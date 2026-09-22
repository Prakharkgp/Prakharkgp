"""Environment-driven settings for the agent service."""

import os
from dataclasses import dataclass
from typing import Optional


def _require(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"missing required environment variable: {name}")
    return value


@dataclass(frozen=True)
class Settings:
    project_endpoint: str
    model_deployment_name: str
    agent_name: str
    agent_instructions: str
    poll_interval_seconds: float
    api_token: Optional[str]


def load_settings() -> Settings:
    return Settings(
        project_endpoint=_require("PROJECT_ENDPOINT"),
        model_deployment_name=_require("MODEL_DEPLOYMENT_NAME"),
        agent_name=os.environ.get("AGENT_NAME", "long-running-agent"),
        agent_instructions=os.environ.get(
            "AGENT_INSTRUCTIONS",
            "You are a helpful assistant that completes background tasks "
            "submitted to you one at a time. Be concise.",
        ),
        poll_interval_seconds=float(os.environ.get("POLL_INTERVAL_SECONDS", "1")),
        api_token=os.environ.get("API_TOKEN") or None,
    )


settings = load_settings()
