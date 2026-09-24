import json
from typing import Any, Dict, Optional

from proposition.service import propose_banking_actions, synthesize_kyc_new_information


TOOLS = [
    {
        'type': 'function',
        'name': 'synthesize_kyc_new_information',
        'description': (
            'Synthétise uniquement kyc_delta.analysis.new_information. Préserve '
            'séparément relevance, confidence, evidence et crm_alert, sans créer '
            'de score numérique.'
        ),
        'parameters': {
            'type': 'object',
            'properties': {
                'kyc_delta': {
                    'type': 'object',
                    'description': (
                        'Le delta KYC complet. Le format peut évoluer ; il peut contenir '
                        'internal_records, analysis.new_information, opportunities, '
                        'crm_alert et des changements factuels explicites de base.'
                    ),
                    'additionalProperties': True,
                },
            },
            'required': ['kyc_delta'],
            'additionalProperties': False,
        },
        # The KYC contract is intentionally flexible until the KYC team freezes it.
        'strict': False,
    },
    {
        'type': 'function',
        'name': 'propose_banking_actions',
        'description': (
            'Propose au banquier des actions, sujets de rendez-vous et pistes de '
            'services à qualifier à partir de analysis.new_information. Ne pas utiliser pour '
            'un conseil juridique, fiscal, d’investissement ou une décision de crédit.'
        ),
        'parameters': {
            'type': 'object',
            'properties': {
                'kyc_delta': {
                    'type': 'object',
                    'description': (
                        'Le delta KYC complet, incluant relevance, confidence, '
                        'opportunities et crm_alert produits en amont.'
                    ),
                    'additionalProperties': True,
                },
                'new_information_summary': {
                    'type': 'object',
                    'description': (
                        'Sortie optionnelle de synthesize_kyc_new_information, '
                        'si elle est déjà disponible.'
                    ),
                    'additionalProperties': True,
                },
                'knowledge_base': {
                    'type': 'object',
                    'description': (
                        'Base optionnelle fournie par l’appelant. Si elle est absente, '
                        'le tool récupère automatiquement les entrées pertinentes dans '
                        'data/paris.json, data/monaco.json et data/lux.json.'
                    ),
                    'additionalProperties': True,
                },
            },
            'required': ['kyc_delta'],
            'additionalProperties': False,
        },
        # Optional inputs and the future knowledge-base contract must remain extensible.
        'strict': False,
    },
]


def execute_tool(
    name: str,
    arguments: str,
    llm_client: Optional[Any] = None,
    deployment_name: Optional[str] = None,
) -> str:
    """Execute a tool selected by the orchestrator model."""
    parsed_arguments: Dict[str, Any] = json.loads(arguments)

    if name in {'synthesize_kyc_new_information', 'propose_banking_actions'}:
        if llm_client is None or not deployment_name:
            raise ValueError(
                f'Tool {name} requires an Azure AI Foundry client and deployment name.'
            )
        _validate_kyc_delta(parsed_arguments)

        if name == 'synthesize_kyc_new_information':
            return synthesize_kyc_new_information(
                llm_client=llm_client,
                deployment_name=deployment_name,
                kyc_delta=parsed_arguments['kyc_delta'],
            )

        _validate_optional_object(parsed_arguments, 'new_information_summary')
        _validate_optional_object(parsed_arguments, 'knowledge_base')
        return propose_banking_actions(
            llm_client=llm_client,
            deployment_name=deployment_name,
            kyc_delta=parsed_arguments['kyc_delta'],
            new_information_summary=parsed_arguments.get('new_information_summary'),
            knowledge_base=parsed_arguments.get('knowledge_base'),
        )

    raise ValueError(f'Unknown tool: {name}')


def _validate_kyc_delta(arguments: Dict[str, Any]) -> None:
    kyc_delta = arguments.get('kyc_delta')
    if not isinstance(kyc_delta, dict):
        raise ValueError('kyc_delta must be a JSON object.')
    analysis = kyc_delta.get('analysis')
    if analysis is not None and not isinstance(analysis, dict):
        raise ValueError('kyc_delta.analysis must be a JSON object.')
    if isinstance(analysis, dict) and (
        analysis.get('new_information') is not None
        and not isinstance(analysis.get('new_information'), list)
    ):
        raise ValueError('kyc_delta.analysis.new_information must be a JSON array.')


def _validate_optional_object(arguments: Dict[str, Any], field_name: str) -> None:
    value = arguments.get(field_name)
    if value is not None and not isinstance(value, dict):
        raise ValueError(f'{field_name} must be a JSON object when provided.')
