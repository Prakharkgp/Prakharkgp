# Hackathon Starter Module

Small Python example for calling an Azure AI Foundry deployment through the
OpenAI-compatible Responses API, including a function tool call.

## Getting Started

The starter folder contains:

- `main.py` - Runnable example that orchestrates the two KYC proposition tools
- `client.py` - Foundry client and Responses API integration
- `tools.py` - tool schemas, dispatch and implementation entry point
- `proposition/` - isolated prompts and LLM-backed proposition services
- `pyproject.toml` and `uv.lock` - Project metadata and locked dependencies

The starter uses the `.env` file in this folder. Create it once at
`hackathon-rbs2026/starter/.env`.

### Setup Steps for Python

```bash
cd starter
# Create .env and add your Azure OpenAI endpoint, key, and deployment name
uv sync
uv run main.py
```

On Windows, run `setup\install-host.bat` from the repository root first and restart
your computer. Then run the commands above; `uv sync` creates the local environment.

## Configuration

The client loads `.env` from the `starter` directory. It requires these values
from the deployment outputs and Azure AI Foundry resource keys:

```env
AZURE_OPENAI_ENDPOINT=https://foundry-hackathon-rbs2026-<teamname>.services.ai.azure.com/openai/v1
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
```

Replace the placeholders with your actual values. The client normalizes the
endpoint to end in `/openai/v1` and removes an `/api/projects/...` suffix if
one is supplied. `AZURE_OPENAI_API_VERSION` is not used by the current client.

## What It Does

Running `uv run main.py`:

1. Loads configuration from `.env`
2. Creates a `FoundryClient` for the configured deployment
3. Sends a French orchestration prompt and a sample KYC delta to the Responses API
4. Lets the model call `synthesize_kyc_new_information` then `propose_banking_actions`
5. Each proposition tool calls the configured Foundry deployment to return structured JSON
6. Sends tool results back using `previous_response_id`, then prints the final answer

You can use the client from another Python module as follows:

```python
from client import FoundryClient

client = FoundryClient()
answer = client.query(
	"You are a helpful assistant.",
	"What is 2 + 2?",
)
print(answer)
```



## Proposition tools

`synthesize_kyc_new_information` reads `kyc_delta.analysis.new_information`. It
preserves the upstream `relevance`, `confidence`, source and evidence values
without manufacturing a numerical score.

`propose_banking_actions` accepts the same `kyc_delta` and may additionally
receive a `new_information_summary` from the first tool and a `knowledge_base` JSON
object. When no knowledge base is supplied by the caller, the tool automatically
retrieves a bounded set of relevant entries from `data/paris.json`,
`data/monaco.json`, and `data/lux.json`. Prompts live in
`proposition/prompts.py`, so that they can evolve without changing tool wiring.

Both tools return JSON, which lets the outer orchestrator or frontend reuse the
result without parsing a prose response.

## Customization

To add another function tool, define its Responses API schema and dispatcher in
`tools.py`. A tool that needs the LLM receives the already configured Foundry
client and deployment from `FoundryClient.query`.
