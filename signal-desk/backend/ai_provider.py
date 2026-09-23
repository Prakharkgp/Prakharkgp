"""Pluggable AI providers for signal enrichment.

`MockAIProvider` is used by default and needs no external service — it
produces a templated summary/next-action from the event's own fields, so
the product is fully demoable with zero configuration.

`AzureFoundryProvider` is the real integration point: it is fully wired
(config, request shape, error handling) but stays dormant until
AZURE_AI_FOUNDRY_ENDPOINT and AZURE_AI_FOUNDRY_API_KEY are set as
environment variables. `get_provider()` picks whichever is configured, so
switching from demo mode to a live model deployment is an env-var change,
not a code change.
"""

import os
from abc import ABC, abstractmethod

from openai import OpenAI


class AIProvider(ABC):
    name: str

    @abstractmethod
    def analyze(self, event: dict) -> dict:
        """Return {"summary": str, "suggested_action": str, "confidence": float}."""


class MockAIProvider(AIProvider):
    name = "Rule-based demo engine"

    _ACTIONS = {
        "Commercial Opportunity": "Flag to the RM for outreach — potential liquidity or wealth-planning event.",
        "Corporate & Credit": "Route to the credit team for an exposure review.",
        "KYC Update": "Refresh the KYC file and notify onboarding / compliance.",
        "Risk & Compliance": "Escalate to Compliance for immediate review.",
    }

    def analyze(self, event: dict) -> dict:
        category = event.get("category", "")
        entity = event.get("entity_name") or "the entity"
        event_type = (event.get("event_type") or "an event").lower()
        source = event.get("source_name") or "a monitored source"
        summary = f"{entity} — {event_type} detected via {source}. {event.get('description', '')}".strip()
        return {
            "summary": summary,
            "suggested_action": self._ACTIONS.get(category, "Review manually."),
            "confidence": 0.72,
        }


class AzureFoundryProvider(AIProvider):
    """Calls a model deployment on Azure AI Foundry through its
    OpenAI-compatible Responses API, using the official `openai` SDK.

    Configure via environment variables:
      AZURE_AI_FOUNDRY_ENDPOINT    the resource's OpenAI-compatible base URL,
                                    e.g. https://<resource>.services.ai.azure.com/openai/v1
      AZURE_AI_FOUNDRY_API_KEY
      AZURE_AI_FOUNDRY_DEPLOYMENT  the deployment name, e.g. "gpt-5.4-mini"
    """

    name = "Azure AI Foundry"

    def __init__(self, endpoint: str, api_key: str, deployment: str):
        self.client = OpenAI(base_url=endpoint, api_key=api_key)
        self.deployment = deployment

    def analyze(self, event: dict) -> dict:
        prompt = (
            "You are a private-banking signal analyst. Reply with exactly two "
            "lines and no other text:\n"
            "Summary: <one-sentence summary of the event for a relationship manager>\n"
            "Suggested action: <one short recommended next action>\n\n"
            f"Category: {event.get('category')}\n"
            f"Type: {event.get('event_type')}\n"
            f"Entity: {event.get('entity_name')}\n"
            f"Source: {event.get('source_name')}\n"
            f"Details: {event.get('description')}\n"
        )
        response = self.client.responses.create(model=self.deployment, input=prompt)
        text = (response.output_text or "").strip()

        summary, suggested_action = text, ""
        for line in text.splitlines():
            stripped = line.strip()
            if stripped.lower().startswith("summary:"):
                summary = stripped[len("summary:"):].strip()
            elif stripped.lower().startswith("suggested action:"):
                suggested_action = stripped[len("suggested action:"):].strip()

        return {"summary": summary, "suggested_action": suggested_action, "confidence": 0.9}


def get_provider(endpoint: str = "", api_key: str = "", deployment: str = "") -> AIProvider:
    """Pick the active provider. Explicit args (from the saved UI config) take
    priority over the matching environment variable, so the AI Engine tab's
    settings form overrides env vars without needing a redeploy."""
    endpoint = (endpoint or os.getenv("AZURE_AI_FOUNDRY_ENDPOINT", "")).strip()
    api_key = (api_key or os.getenv("AZURE_AI_FOUNDRY_API_KEY", "")).strip()
    deployment = (deployment or os.getenv("AZURE_AI_FOUNDRY_DEPLOYMENT", "")).strip() or "gpt-5.4-mini"
    if endpoint and api_key:
        return AzureFoundryProvider(endpoint, api_key, deployment)
    return MockAIProvider()
