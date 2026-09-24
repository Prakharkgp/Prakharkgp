import json
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(Path(__file__).resolve().parent / '.env')


def _foundry_client() -> tuple[OpenAI, str]:
    api_key = os.getenv('AZURE_OPENAI_API_KEY')
    configured_endpoint = os.getenv('AZURE_OPENAI_ENDPOINT', '').rstrip('/')
    if '/api/projects/' in configured_endpoint:
        configured_endpoint = configured_endpoint.split('/api/projects/', 1)[0]
    endpoint = (
        configured_endpoint
        if configured_endpoint.endswith('/openai/v1')
        else f'{configured_endpoint}/openai/v1'
    )
    deployment_name = os.getenv('AZURE_OPENAI_DEPLOYMENT_NAME')

    if not api_key or not endpoint or not deployment_name:
        raise ValueError(
            'AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, and '
            'AZURE_OPENAI_DEPLOYMENT_NAME must be set in .env file'
        )

    return OpenAI(base_url=endpoint, api_key=api_key, timeout=20), deployment_name


def main() -> None:
    client, deployment_name = _foundry_client()
    hosted_search_tool_type = os.getenv(
        'FOUNDRY_HOSTED_SEARCH_TOOL_TYPE',
        'web_search_preview',
    ).strip()
    query = (
        'Cherche sur le web les evenements business recents concernant BNP Paribas. '
        'Concentre-toi sur partenariats, acquisitions, lancements, changements de '
        'direction ou expansions. Cite les sources trouvees.'
    )

    print(f'Hosted search tool type: {hosted_search_tool_type}')
    print(f'Query: {query}')
    try:
        response = client.responses.create(
            model=deployment_name,
            instructions=(
                'Tu es un analyste de veille commerciale. Utilise la recherche web '
                'hebergeee par Foundry si elle est disponible. Reponds en francais.'
            ),
            input=query,
            tools=[{'type': hosted_search_tool_type}],
        )
    except Exception as error:
        print(f'Foundry hosted search failed: {type(error).__name__}: {error}')
        raise

    print('Foundry hosted search response received')
    print('Raw response output:')
    print(json.dumps([item.model_dump() for item in response.output], indent=2))
    print(f'Answer: {response.output_text}')


if __name__ == '__main__':
    main()