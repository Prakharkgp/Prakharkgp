import os
import json
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
try:
    from .tools import TOOLS, execute_tool
except ImportError:
    from tools import TOOLS, execute_tool

_agents_dir = Path(__file__).resolve().parent
_backend_dir = _agents_dir.parent

# Charge le .env du dossier backend/ (parent) en priorité,
# puis celui de agents/ en fallback s'il existe.
load_dotenv(_backend_dir / '.env')
load_dotenv(_backend_dir.parent / '.env')
load_dotenv(_agents_dir / '.env')


class FoundryClient:
    def __init__(self):
        self.api_key = os.getenv('AZURE_OPENAI_API_KEY')
        configured_endpoint = os.getenv('AZURE_OPENAI_ENDPOINT', '').rstrip('/')
        if '/api/projects/' in configured_endpoint:
            configured_endpoint = configured_endpoint.split('/api/projects/', 1)[0]
        self.endpoint = (
            configured_endpoint
            if configured_endpoint.endswith('/openai/v1')
            else f'{configured_endpoint}/openai/v1'
        )
        self.deployment_name = os.getenv('AZURE_OPENAI_DEPLOYMENT_NAME')

        if not self.api_key or not self.endpoint or not self.deployment_name:
            raise ValueError(
                'AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT, and '
                'AZURE_OPENAI_DEPLOYMENT_NAME must be set in .env file'
            )

        self.client = OpenAI(
            base_url=self.endpoint,
            api_key=self.api_key,
        )

    def query(self, system_prompt: str, query: str) -> str:
        response = self.client.responses.create(
            model=self.deployment_name,
            instructions=system_prompt,
            input=query,
            tools=TOOLS,
        )

        while True:
            tool_outputs = []
            for item in response.output:
                if item.type != 'function_call':
                    continue

                print(
                    'Tool call metadata:',
                    json.dumps(
                        {
                            'type': item.type,
                            'name': item.name,
                            'call_id': item.call_id,
                            'arguments': json.loads(item.arguments),
                        },
                        indent=2,
                    ),
                )

                # --- Exécution avec gestion d'erreur ---
                print(f'Executing tool: {item.name}')
                try:
                    tool_output = execute_tool(item.name, item.arguments)
                except Exception as error:
                    tool_output = json.dumps(
                        {
                            'tool': item.name,
                            'error_type': type(error).__name__,
                            'error': str(error),
                        },
                        ensure_ascii=False,
                    )
                    print(f'Tool failed: {type(error).__name__}: {error}')

                print(f'Tool output ready: {len(tool_output)} characters')
                tool_outputs.append({
                    'type': 'function_call_output',
                    'call_id': item.call_id,
                    'output': tool_output,
                })

            if not tool_outputs:
                break

            print('Sending tool outputs back to Foundry...')
            try:
                response = self.client.responses.create(
                    model=self.deployment_name,
                    instructions=system_prompt,
                    previous_response_id=response.id,
                    input=tool_outputs,
                    tools=TOOLS,
                )
                print('Foundry response received')
            except Exception as error:
                print(f'Foundry synthesis failed: {type(error).__name__}: {error}')
                return json.dumps(
                    {
                        'warning': 'Foundry synthesis failed after tool execution.',
                        'error_type': type(error).__name__,
                        'error': str(error),
                        'tool_outputs': tool_outputs,
                    },
                    ensure_ascii=False,
                    indent=2,
                )

        return response.output_text
