"""Appel à Azure OpenAI (Agent Lifecycle Management) pour l'analyse KYC."""
import json
import os
import urllib.error
import urllib.request


class AgentConfigError(RuntimeError):
    """Variables d'environnement Azure OpenAI manquantes."""


class AgentCallError(RuntimeError):
    """Échec d'appel ou réponse invalide d'Azure OpenAI."""


def run_agent(messages: list[dict[str, str]]) -> str:
    try:
        endpoint = os.environ["AZURE_OPENAI_ENDPOINT"].rstrip("/")
        deployment = os.environ["AZURE_OPENAI_DEPLOYMENT_NAME"]
        api_key = os.environ["AZURE_OPENAI_API_KEY"]
    except KeyError as error:
        raise AgentConfigError(f"Variable d'environnement manquante : {error}") from error

    if endpoint.endswith("/openai/v1"):
        url = f"{endpoint}/chat/completions"
        body = {"model": deployment, "messages": messages, "temperature": 0}
    else:
        url = (
            f"{endpoint}/openai/deployments/{deployment}"
            "/chat/completions?api-version=2024-10-21"
        )
        body = {"messages": messages, "temperature": 0}

    request = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "api-key": api_key},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            payload = json.loads(response.read())
        return payload["choices"][0]["message"]["content"]
    except urllib.error.HTTPError as error:
        raise AgentCallError(f"Azure OpenAI HTTP {error.code}.") from error
    except (KeyError, ValueError, urllib.error.URLError) as error:
        raise AgentCallError(f"Réponse Azure OpenAI invalide : {error}") from error
