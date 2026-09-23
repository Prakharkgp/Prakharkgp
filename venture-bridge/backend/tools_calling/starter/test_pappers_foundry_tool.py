import json
import os
from pathlib import Path

from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import (
    OpenApiFunctionDefinition,
    OpenApiProjectConnectionAuthDetails,
    OpenApiProjectConnectionSecurityScheme,
    OpenApiTool,
    PromptAgentDefinition,
)
from azure.core.exceptions import ClientAuthenticationError
from azure.identity import DefaultAzureCredential
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent / '.env')

DEFAULT_FOUNDRY_PROJECT_ENDPOINT = (
    'https://test-veille-commerciale.services.ai.azure.com/api/projects/proj-default'
)
DEFAULT_PAPPERS_CONNECTION_ID = (
    '/subscriptions/cd42c6a9-be39-499b-9cda-34d4cee517ab/'
    'resourceGroups/rg-uc34-veille-commerciale/'
    'providers/Microsoft.CognitiveServices/accounts/test-veille-commerciale/'
    'projects/proj-default/connections/PAPPERS_CALLER'
)


def _project_endpoint() -> str:
    endpoint = os.getenv('FOUNDRY_PROJECT_ENDPOINT')
    if endpoint:
        return endpoint.rstrip('/')

    azure_openai_endpoint = os.getenv('AZURE_OPENAI_ENDPOINT', '').rstrip('/')
    if '/api/projects/' in azure_openai_endpoint:
        return azure_openai_endpoint.split('/openai/v1', 1)[0].rstrip('/')

    return DEFAULT_FOUNDRY_PROJECT_ENDPOINT


def _deployment_name() -> str:
    deployment_name = os.getenv('AZURE_OPENAI_DEPLOYMENT_NAME') or os.getenv(
        'FOUNDRY_MODEL_DEPLOYMENT_NAME'
    )
    if not deployment_name:
        raise ValueError(
            'AZURE_OPENAI_DEPLOYMENT_NAME or FOUNDRY_MODEL_DEPLOYMENT_NAME must be set.'
        )
    return deployment_name


def _pappers_openapi_spec() -> dict:
    auth_parameter_name = os.getenv('PAPPERS_AUTH_PARAMETER_NAME', 'api_token').strip()
    auth_parameter_location = os.getenv(
        'PAPPERS_AUTH_PARAMETER_LOCATION',
        'query',
    ).strip()

    return {
        'openapi': '3.1.0',
        'info': {
            'title': 'Pappers API',
            'version': '1.0.0',
            'description': 'Recherche d entreprises francaises via Pappers.',
        },
        'servers': [{'url': 'https://api.pappers.fr/v2'}],
        'paths': {
            '/recherche': {
                'get': {
                    'operationId': 'search_pappers_companies',
                    'description': 'Search French companies by name, SIREN, or SIRET.',
                    'parameters': [
                        {
                            'name': 'q',
                            'in': 'query',
                            'required': True,
                            'description': 'Company name, SIREN, SIRET, or search query.',
                            'schema': {'type': 'string'},
                        },
                        {
                            'name': 'par_page',
                            'in': 'query',
                            'required': False,
                            'description': 'Maximum number of results to return.',
                            'schema': {
                                'type': 'integer',
                                'minimum': 1,
                                'maximum': 20,
                                'default': 5,
                            },
                        },
                    ],
                    'responses': {
                        '200': {
                            'description': 'Pappers company search results.',
                            'content': {
                                'application/json': {
                                    'schema': {'type': 'object'}
                                }
                            },
                        }
                    },
                }
            }
        },
        'components': {
            'securitySchemes': {
                'pappersApiKey': {
                    'type': 'apiKey',
                    'name': auth_parameter_name,
                    'in': auth_parameter_location,
                }
            }
        },
        'security': [{'pappersApiKey': []}],
    }


def _pappers_tool(connection_id: str) -> OpenApiTool:
    return OpenApiTool(
        openapi=OpenApiFunctionDefinition(
            name='PAPPERS_CALLER',
            description='Recherche des informations entreprises via Pappers.',
            spec=_pappers_openapi_spec(),
            auth=OpenApiProjectConnectionAuthDetails(
                security_scheme=OpenApiProjectConnectionSecurityScheme(
                    project_connection_id=connection_id,
                ),
            ),
        )
    )


def main() -> None:
    endpoint = _project_endpoint()
    deployment_name = _deployment_name()
    pappers_connection_id = os.getenv(
        'PAPPERS_PROJECT_CONNECTION_ID',
        DEFAULT_PAPPERS_CONNECTION_ID,
    ).strip()
    query = os.getenv('PAPPERS_TEST_QUERY', 'BNP Paribas').strip()
    agent_name = os.getenv('PAPPERS_TEST_AGENT_NAME', 'pappers-caller-smoke-test')

    print(f'Foundry project endpoint: {endpoint}')
    print(f'Foundry deployment: {deployment_name}')
    print(f'Pappers connection id: {pappers_connection_id}')
    print(f'Pappers test query: {query}')

    credential = DefaultAzureCredential()
    project = AIProjectClient(
        endpoint=endpoint,
        credential=credential,
        allow_preview=True,
    )
    openai = project.get_openai_client()
    agent = None

    try:
        agent = project.agents.create_version(
            agent_name=agent_name,
            definition=PromptAgentDefinition(
                model=deployment_name,
                instructions=(
                    'Tu es un analyste de veille commerciale. Utilise le tool '
                    'Pappers pour rechercher l entreprise demandee. Reponds en '
                    'francais avec les informations utiles disponibles.'
                ),
                tools=[_pappers_tool(pappers_connection_id)],
            ),
        )
        print(f'Agent created: name={agent.name}, version={agent.version}')

        response = openai.responses.create(
            input=f'Recherche Pappers pour: {query}',
            tool_choice='required',
            extra_body={
                'agent_reference': {
                    'name': agent.name,
                    'type': 'agent_reference',
                }
            },
        )

        print('Pappers Foundry agent response received')
        print('Raw response output:')
        print(json.dumps([item.model_dump() for item in response.output], indent=2))
        print(f'Answer: {response.output_text}')
    except ClientAuthenticationError as error:
        print(
            'Azure authentication failed. This test uses azure-ai-projects, which '
            'requires an Entra token, not the AZURE_OPENAI_API_KEY. Sign in with '
            '`az login`, `azd auth login`, the VS Code Azure extension, or provide '
            'service principal environment variables before rerunning.'
        )
        print(f'Authentication detail: {error}')
        raise
    except Exception as error:
        print(f'Pappers Foundry agent failed: {type(error).__name__}: {error}')
        raise
    finally:
        if agent is not None:
            project.agents.delete_version(
                agent_name=agent.name,
                agent_version=agent.version,
            )
            print('Agent deleted')


if __name__ == '__main__':
    main()
