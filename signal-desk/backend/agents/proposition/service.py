"""LLM-backed implementation for the proposition tools."""

import json
from typing import Any, Dict, Optional

from agents.proposition.knowledge_base import retrieve_relevant_knowledge
from agents.proposition.prompts import (
    PROPOSE_ACTIONS_PROMPT,
    SYNTHESIZE_NEW_INFORMATION_PROMPT,
)


def synthesize_kyc_new_information(
    llm_client: Any,
    deployment_name: str,
    kyc_delta: Dict[str, Any],
) -> str:
    """Return a validated JSON synthesis of analysis.new_information."""
    return _ask_for_json(
        llm_client=llm_client,
        deployment_name=deployment_name,
        instructions=SYNTHESIZE_NEW_INFORMATION_PROMPT,
        payload={"kyc_delta": kyc_delta},
    )


def propose_banking_actions(
    llm_client: Any,
    deployment_name: str,
    kyc_delta: Dict[str, Any],
    new_information_summary: Optional[Dict[str, Any]] = None,
    knowledge_base: Optional[Dict[str, Any]] = None,
) -> str:
    """Return a validated JSON list of banking actions to qualify."""
    payload: Dict[str, Any] = {"kyc_delta": kyc_delta}
    if new_information_summary is not None:
        payload["new_information_summary"] = new_information_summary
    if knowledge_base is None:
        payload["knowledge_base"] = retrieve_relevant_knowledge(
            kyc_delta=kyc_delta,
            new_information_summary=new_information_summary,
        )
        payload["knowledge_base_status"] = payload["knowledge_base"]["status"]
    else:
        payload["knowledge_base"] = knowledge_base
        payload["knowledge_base_status"] = "caller_provided"

    return _ask_for_json(
        llm_client=llm_client,
        deployment_name=deployment_name,
        instructions=PROPOSE_ACTIONS_PROMPT,
        payload=payload,
    )


def _ask_for_json(
    llm_client: Any,
    deployment_name: str,
    instructions: str,
    payload: Dict[str, Any],
) -> str:
    """Call Foundry and make the tool output safe for the outer orchestrator."""
    response = llm_client.responses.create(
        model=deployment_name,
        instructions=instructions,
        input=json.dumps(payload, ensure_ascii=False),
    )
    raw_output = response.output_text.strip()
    json_output = _extract_json(raw_output)

    try:
        json.loads(json_output)
    except json.JSONDecodeError as error:
        raise ValueError(
            "Le modèle n'a pas retourné le JSON attendu pour le tool propositionnel."
        ) from error

    return json_output


def _extract_json(raw_output: str) -> str:
    """Accept a fenced JSON response defensively, while preserving JSON only."""
    if raw_output.startswith("```json") and raw_output.endswith("```"):
        return raw_output[len("```json"):-len("```")].strip()
    if raw_output.startswith("```") and raw_output.endswith("```"):
        return raw_output[len("```"):-len("```")].strip()
    return raw_output
