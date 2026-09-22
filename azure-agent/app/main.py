"""HTTP front door for the agent.

Jobs are accepted, queued, and answered asynchronously: `POST /jobs`
returns immediately with a job id, and the background worker (started
at startup, see queue_worker.py) works through the queue in order.
Poll `GET /jobs/{id}` for the result. This shape — accept now, compute
later, poll for the answer — is what makes "long running" safe to host
behind a normal HTTP load balancer without timing requests out.
"""

import asyncio
import hmac
import logging
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel

from .agent_runtime import Agent
from .config import settings
from .queue_worker import run_worker
from .store import JobStore

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

WORKER_CONCURRENCY = 1  # raise to process more than one job at a time


def require_token(authorization: str = Header(default="")) -> None:
    """Gate every job-submission endpoint behind API_TOKEN, the same
    optional-but-strongly-recommended shared-secret pattern the
    venture-bridge shell service uses for TERMINAL_TOKEN. Each job run
    costs real model tokens, so an unauthenticated public endpoint is a
    standing invitation to burn someone else's Azure bill.
    """
    if not settings.api_token:
        return
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not hmac.compare_digest(token, settings.api_token):
        raise HTTPException(status_code=401, detail="missing or invalid bearer token")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not settings.api_token:
        logger.warning(
            "API_TOKEN is not set — /jobs and /conversations are unauthenticated. "
            "Set API_TOKEN before exposing this service publicly."
        )
    logger.info("initializing agent...")
    agent = Agent()
    queue: "asyncio.Queue[str]" = asyncio.Queue()
    store = JobStore()

    app.state.agent = agent
    app.state.queue = queue
    app.state.store = store

    workers = [
        asyncio.create_task(run_worker(queue, store, agent)) for _ in range(WORKER_CONCURRENCY)
    ]
    logger.info("worker(s) started, ready to accept jobs")

    yield

    for task in workers:
        task.cancel()
    await asyncio.gather(*workers, return_exceptions=True)
    agent.close()


app = FastAPI(title="Long-running Azure AI agent", lifespan=lifespan)


class JobRequest(BaseModel):
    message: str
    conversation_id: str | None = None  # reuse a thread id for multi-turn context


class JobResponse(BaseModel):
    id: str
    status: str
    conversation_id: str
    result: str | None = None
    error: str | None = None
    created_at: str
    updated_at: str


def _to_response(job) -> JobResponse:
    return JobResponse(
        id=job.id,
        status=job.status,
        conversation_id=job.conversation_id,
        result=job.result,
        error=job.error,
        created_at=job.created_at,
        updated_at=job.updated_at,
    )


@app.get("/healthz")
def healthz():
    """Liveness — always OK once the process is up."""
    return {"status": "ok"}


@app.get("/readyz")
def readyz():
    """Readiness — OK only once the agent has been created."""
    if getattr(app.state, "agent", None) is None:
        raise HTTPException(status_code=503, detail="agent not ready")
    return {"status": "ready"}


@app.post("/conversations", dependencies=[Depends(require_token)])
def new_conversation():
    """Start a fresh thread for a multi-turn job sequence."""
    return {"conversation_id": app.state.agent.new_thread()}


@app.post("/jobs", response_model=JobResponse, status_code=202, dependencies=[Depends(require_token)])
async def submit_job(payload: JobRequest):
    conversation_id = payload.conversation_id or app.state.agent.new_thread()
    job = await app.state.store.create(conversation_id, payload.message)
    await app.state.queue.put(job.id)
    return _to_response(job)


@app.get("/jobs/{job_id}", response_model=JobResponse, dependencies=[Depends(require_token)])
async def get_job(job_id: str):
    job = await app.state.store.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="job not found")
    return _to_response(job)
