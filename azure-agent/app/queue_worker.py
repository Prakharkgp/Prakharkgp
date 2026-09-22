"""The long-running part: an asyncio task, started once at process
startup and never expected to return, that pulls jobs off a queue and
runs them against the agent one at a time.

This is what needs an always-on host (a Container Apps replica kept
above zero, a VM, an App Service always-on instance) rather than a
request-scoped function — the worker loop outlives any single HTTP
request, and an agent run can take anywhere from seconds to minutes
depending on how many tool calls and reasoning steps it takes.
"""

import asyncio
import logging

from .agent_runtime import Agent
from .store import JobStore

logger = logging.getLogger(__name__)


async def run_worker(queue: "asyncio.Queue[str]", store: JobStore, agent: Agent) -> None:
    while True:
        job_id = await queue.get()
        try:
            job = await store.get(job_id)
            if job is None:
                continue

            await store.mark_running(job_id)
            logger.info("job %s: running on thread %s", job_id, job.conversation_id)

            try:
                # The SDK call is synchronous and can block for a while
                # (network round trips, tool calls, model latency) — run
                # it in a worker thread so it doesn't stall the event
                # loop other jobs and HTTP requests share.
                reply = await asyncio.to_thread(agent.run, job.conversation_id, job.message)
            except Exception as exc:  # noqa: BLE001 - surface any failure on the job itself
                logger.exception("job %s failed", job_id)
                await store.mark_done(job_id, error=str(exc))
            else:
                await store.mark_done(job_id, result=reply)
                logger.info("job %s: done", job_id)
        finally:
            queue.task_done()
