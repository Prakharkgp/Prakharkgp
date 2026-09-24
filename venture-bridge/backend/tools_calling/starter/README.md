# Hackathon Starter Module

Small Python example for calling an Azure AI Foundry deployment through the
OpenAI-compatible Responses API, including a function tool call.

## Getting Started

The starter folder contains:
- `main.py` - Runnable Foundry example that validates local function tool calling
- `client.py` - Foundry client and Responses API integration
- `tools.py` - Local function tool definitions and provider clients
- `test_calculate_foundry.py` - Direct Foundry smoke test with the local `calculate` tool
- `test_foundry_web_search.py` - Foundry-hosted web search smoke test, if enabled on the deployment
- `test_pappers_foundry_tool.py` - Foundry agent smoke test using the `PAPPERS_CALLER` project connection
- `pyproject.toml` and `uv.lock` - Project metadata and locked dependencies

The starter uses the `.env` file in this folder. Create it once at
`hackathon-rbs2026/starter/.env`.

### Setup Steps for Python

```bash
cd starter
py -m pip install -e .
```

Create `.env` in this folder from `env.template`, then fill the Azure Foundry values.

Test local function tool calling first:

```bash
py test_calculate_foundry.py
```

Run the multi-provider commercial-intelligence smoke test:

```bash
py main.py
```

This lets the model call local function tools for Google, Pappers, BODACC, and Companies House,
then synthesize a business-event recap from the tool outputs.

Then test Foundry-hosted web search, if your Foundry deployment exposes a hosted
web/search tool:

```bash
py test_foundry_web_search.py
```

Test the Pappers connection configured in Foundry:

```bash
py test_pappers_foundry_tool.py
```

This test creates a temporary Foundry agent with an OpenAPI tool that references
the `PAPPERS_CALLER` project connection, then deletes the agent after the run.
It uses `azure-ai-projects`, so it requires Entra authentication in addition to
the `.env` API key values. Sign in with `az login`, `azd auth login`, the VS Code
Azure extension, or service-principal environment variables before running it.

## Configuration

The client loads `.env` from the `starter` directory. It requires these values
from the deployment outputs and Azure AI Foundry resource keys:

```env
AZURE_OPENAI_ENDPOINT=https://foundry-hackathon-rbs2026-<teamname>.services.ai.azure.com/openai/v1
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
FOUNDRY_PROJECT_ENDPOINT=https://foundry-hackathon-rbs2026-<teamname>.services.ai.azure.com/api/projects/<project-name>
```

Replace the placeholders with your actual values. The client normalizes the
endpoint to end in `/openai/v1` and removes an `/api/projects/...` suffix if
one is supplied. `AZURE_OPENAI_API_VERSION` is not used by the current client.

## What It Does

Running `py main.py`:
1. Loads configuration from `.env`
2. Creates a `FoundryClient` for the configured deployment
3. Sends a French commercial-intelligence prompt to the Responses API
4. Lets the model call local provider tools for Google, Pappers, BODACC, and Companies House
5. Sends the tool outputs back to Foundry
6. Prints the synthesized business-event recap

You can use the client from another Python module as follows:

```python
from client import FoundryClient

client = FoundryClient()
answer = client.query(
	"Tu es un analyste de veille commerciale.",
	"Fais une veille commerciale sur BNP Paribas via Google, Pappers, BODACC et Companies House.",
)
print(answer)
```

### Local provider tools

`tools.py` exposes these provider clients as function tools:

- `search_google_business_events`: Google News RSS by default, or Google Custom Search if configured.
- `search_pappers_company`: Pappers company search, requiring `PAPPERS_API_TOKEN`.
- `search_bodacc_announcements`: public BODACC OpenDataSoft announcements API.
- `search_companies_house_company`: Companies House official UK company search, requiring `COMPANIES_HOUSE_API_KEY`.

Recommended `.env` values:

```env
GOOGLE_SEARCH_PROVIDER=google_news
PAPPERS_API_TOKEN=your-pappers-token
COMPANIES_HOUSE_API_KEY=your-companies-house-api-key
```

If `PAPPERS_API_TOKEN` or `COMPANIES_HOUSE_API_KEY` is missing, the corresponding
tool returns a structured error to the model and the workflow continues with the
other providers.

### Foundry-hosted business event search

The local Python `tools.py` file should not call Google directly if the goal is to
let Foundry own the external search. In that architecture, the search capability
must be configured as a hosted tool or grounding capability on the Foundry side,
then declared in the Responses API request.

`test_foundry_web_search.py` declares a hosted search tool type in the request:

```env
FOUNDRY_HOSTED_SEARCH_TOOL_TYPE=web_search_preview
```

If the deployment does not support that hosted tool type, Foundry will reject the
request or time out. In that case, the next step is to check which web/search or
grounding tool type the hackathon Foundry instance exposes.

### Pappers project connection

`test_pappers_foundry_tool.py` uses the project connection ID stored in:

```env
PAPPERS_PROJECT_CONNECTION_ID=/subscriptions/.../connections/PAPPERS_CALLER
PAPPERS_AUTH_PARAMETER_NAME=api_token
PAPPERS_AUTH_PARAMETER_LOCATION=query
PAPPERS_TEST_QUERY=BNP Paribas
```

The OpenAPI security scheme must match how the Pappers credential was stored in
the Foundry connection. If the connection key is named differently from
`api_token`, update `PAPPERS_AUTH_PARAMETER_NAME`.

## Customization

To add another function tool, define its Responses API schema in `tools.py`,
implement it there, and handle its function call in `FoundryClient.query`.
