"""Appel à Azure OpenAI (Agent Lifecycle Management) pour l'analyse KYC."""
import json
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

_BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(_BACKEND_DIR / ".env")
load_dotenv(_BACKEND_DIR.parent / ".env")


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

    if '/api/projects/' in endpoint:
        endpoint = endpoint.split('/api/projects/', 1)[0]
    
    if not endpoint.endswith('/openai/v1'):
        endpoint = f'{endpoint}/openai/v1'

    client = OpenAI(base_url=endpoint, api_key=api_key)

    try:
        response = client.chat.completions.create(
            model=deployment,
            messages=messages,
        )
        return response.choices[0].message.content
    except Exception as error:
        raise AgentCallError(f"Azure OpenAI API Error : {error}") from error
