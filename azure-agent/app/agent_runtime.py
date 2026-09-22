"""Thin wrapper around the Azure AI Foundry Agent Service SDK
(`azure-ai-agents`). Everything the rest of the app needs — "create the
agent once, run a message through a thread, read the reply back" — lives
here so a future SDK surface change only touches this one file.
"""

import logging

from azure.ai.agents import AgentsClient
from azure.ai.agents.models import FunctionTool, ListSortOrder, MessageRole, ToolSet
from azure.identity import DefaultAzureCredential

from .config import settings
from .tools import AGENT_FUNCTIONS

logger = logging.getLogger(__name__)


class Agent:
    """A single persistent Azure AI Foundry agent, created once at
    startup and reused for every job the worker processes."""

    def __init__(self) -> None:
        self._client = AgentsClient(
            endpoint=settings.project_endpoint,
            credential=DefaultAzureCredential(),
        )

        toolset = ToolSet()
        if AGENT_FUNCTIONS:
            toolset.add(FunctionTool(functions=AGENT_FUNCTIONS))
            self._client.enable_auto_function_calls(toolset)

        self._agent = self._client.create_agent(
            model=settings.model_deployment_name,
            name=settings.agent_name,
            instructions=settings.agent_instructions,
            toolset=toolset if AGENT_FUNCTIONS else None,
        )
        logger.info("agent ready: %s (%s)", self._agent.name, self._agent.id)

    def new_thread(self) -> str:
        """Start a fresh conversation and return its thread id. Callers
        that want multi-turn context (a job that runs several related
        tasks) should keep reusing the same thread id."""
        return self._client.threads.create().id

    def run(self, thread_id: str, message: str) -> str:
        """Post `message` to `thread_id` and run the agent against it,
        blocking (via SDK-side polling) until the run finishes. Returns
        the agent's latest reply as plain text.

        This is the slow, potentially long-running call — the caller
        (queue_worker.py) is expected to run it off the request thread.
        """
        self._client.messages.create(thread_id=thread_id, role="user", content=message)

        run = self._client.runs.create_and_process(
            thread_id=thread_id,
            agent_id=self._agent.id,
            polling_interval=settings.poll_interval_seconds,
        )
        if run.status == "failed":
            raise RuntimeError(f"agent run failed: {run.last_error}")

        for msg in self._client.messages.list(
            thread_id=thread_id, order=ListSortOrder.DESCENDING, limit=1
        ):
            if msg.role == MessageRole.AGENT:
                return "\n".join(part.text.value for part in msg.text_messages)
        return ""

    def close(self) -> None:
        """Delete the agent definition. Threads and their history are
        left alone — Azure AI Foundry retains them independently."""
        self._client.delete_agent(self._agent.id)
        self._client.close()
