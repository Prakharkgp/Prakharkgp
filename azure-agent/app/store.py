"""In-memory job tracking.

Job state lives in the process, so it doesn't survive a restart — the
one thing that does survive is the agent's own conversation history,
which Azure AI Foundry keeps server-side per thread. That split is
usually enough: retry a lost job by resubmitting against the same
`conversation_id` and the agent still has full context. If job history
itself needs to survive restarts (e.g. multiple replicas, or an audit
trail), swap this module for a table in Azure Table Storage or Cosmos DB
without touching anything else — `main.py` and `queue_worker.py` only
call the four methods below.
"""

import asyncio
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, Optional


@dataclass
class Job:
    id: str
    conversation_id: str
    message: str
    status: str = "queued"  # queued -> running -> completed | failed
    result: Optional[str] = None
    error: Optional[str] = None
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class JobStore:
    def __init__(self) -> None:
        self._jobs: Dict[str, Job] = {}
        self._lock = asyncio.Lock()

    async def create(self, conversation_id: str, message: str) -> Job:
        job = Job(id=str(uuid.uuid4()), conversation_id=conversation_id, message=message)
        async with self._lock:
            self._jobs[job.id] = job
        return job

    async def get(self, job_id: str) -> Optional[Job]:
        async with self._lock:
            return self._jobs.get(job_id)

    async def mark_running(self, job_id: str) -> None:
        await self._update(job_id, status="running")

    async def mark_done(self, job_id: str, *, result: Optional[str] = None, error: Optional[str] = None) -> None:
        await self._update(
            job_id,
            status="failed" if error else "completed",
            result=result,
            error=error,
        )

    async def _update(self, job_id: str, **fields) -> None:
        async with self._lock:
            job = self._jobs.get(job_id)
            if job is None:
                return
            for key, value in fields.items():
                setattr(job, key, value)
            job.updated_at = datetime.now(timezone.utc).isoformat()
