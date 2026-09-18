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

import httpx


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
    """Calls a chat-completions-style model deployment on Azure AI Foundry.

    Configure via environment variables:
      AZURE_AI_FOUNDRY_ENDPOINT    e.g. https://<resource>.services.ai.azure.com
      AZURE_AI_FOUNDRY_API_KEY
      AZURE_AI_FOUNDRY_DEPLOYMENT  defaults to "gpt-4o-mini"
    """

    name = "Azure AI Foundry"

    def __init__(self, endpoint: str, api_key: str, deployment: str):
        self.endpoint = endpoint.rstrip("/")
        self.api_key = api_key
        self.deployment = deployment

    def analyze(self, event: dict) -> dict:
        url = (
            f"{self.endpoint}/openai/deployments/{self.deployment}"
            "/chat/completions?api-version=2024-06-01"
        )
        prompt = (
            "You are a private-banking signal analyst. In one sentence, summarize "
            "this event for a relationship manager and suggest one next action.\n\n"
            f"Category: {event.get('category')}\n"
            f"Type: {event.get('event_type')}\n"
            f"Entity: {event.get('entity_name')}\n"
            f"Source: {event.get('source_name')}\n"
            f"Details: {event.get('description')}\n"
        )
        headers = {"api-key": self.api_key, "Content-Type": "application/json"}
        payload = {
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
            "max_tokens": 200,
        }
        with httpx.Client(timeout=15) as client:
            resp = client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"]
        return {"summary": content.strip(), "suggested_action": "", "confidence": 0.9}


def get_provider() -> AIProvider:
    endpoint = os.getenv("AZURE_AI_FOUNDRY_ENDPOINT", "").strip()
    api_key = os.getenv("AZURE_AI_FOUNDRY_API_KEY", "").strip()
    deployment = os.getenv("AZURE_AI_FOUNDRY_DEPLOYMENT", "gpt-4o-mini").strip()
    if endpoint and api_key:
        return AzureFoundryProvider(endpoint, api_key, deployment)
    return MockAIProvider()
