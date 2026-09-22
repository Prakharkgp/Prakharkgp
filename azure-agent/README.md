# Azure Agent

A long-running AI agent, built on the [Azure AI Foundry Agent
Service](https://learn.microsoft.com/azure/ai-foundry/agents/overview)
SDK (`azure-ai-agents`), packaged to run as an always-on container
service on Azure.

## Why "long-running" needs its own shape

An LLM agent run isn't request/response-fast — it can take anywhere
from a few seconds to several minutes once you add tool calls and
multi-step reasoning. A plain "handle the HTTP request, call the
model, return the answer" server either times the caller out or ties
up a request thread for the whole run. This one doesn't do that:

- `POST /jobs` enqueues the work and returns immediately (`202`) with a
  job id.
- A background worker task — started once at process startup in
  `app/main.py`'s lifespan, and never expected to return — pulls jobs
  off an in-process queue and runs them against the agent one at a
  time (`app/queue_worker.py`).
- `GET /jobs/{id}` polls for the result.
- Conversations can span many jobs: pass the same `conversation_id`
  back in and the agent sees the full thread history, because Azure AI
  Foundry keeps thread state server-side, independent of this process.

That worker loop is *why* this needs an always-on host rather than a
request-scoped function app — it has to keep running between requests.
Container Apps with `minReplicas == maxReplicas == 1` (see
`infra/main.bicep`) is the simplest way to guarantee that.

## Layout

```
app/
  agent_runtime.py   # thin wrapper around the azure-ai-agents SDK
  tools.py           # function tool(s) the agent can call mid-run
  queue_worker.py     # the always-running background loop
  store.py            # in-memory job status/result tracking
  main.py              # FastAPI app: /jobs, /conversations, /healthz, /readyz
infra/
  main.bicep           # Container Apps env + registry + app (1 replica, always on)
  main.parameters.json
Dockerfile
requirements.txt
```

## A note on what "deployed in Azure AI Foundry" means here

Azure AI Foundry's Agent Service hosts the *agent itself* — its model,
instructions, tools, and every conversation thread it has. That part
happens automatically: the first time this app starts up,
`agent_runtime.py` calls `create_agent()` against your Foundry project,
and from then on the agent shows up in your project's **Agents**
playground at [ai.azure.com](https://ai.azure.com) like any agent you'd
built by hand in the portal, with a real `agent_id` and real threads.

What Foundry does *not* do is run your own custom Python process for
you — there's no "upload this FastAPI app to Foundry" step. The
queue/worker/HTTP layer in this repo needs its own always-on compute,
which is what the Container Apps deployment below provides. So getting
this running is two separate steps: create the Foundry project (once,
this section), then deploy the container that talks to it (next
section).

## Step 0 — create the Azure AI Foundry project and model deployment

If you don't already have one:

1. Go to [ai.azure.com](https://ai.azure.com) → **Create project** (or
   **New +** → **AI Foundry project**). Give it a name and pick/create
   a resource group and region.
2. Once it's created, open **Models + endpoints** in the left nav →
   **Deploy model** → pick a chat model (e.g. `gpt-4o`) → deploy it.
   Note the **deployment name** you give it (this is
   `MODEL_DEPLOYMENT_NAME` below — it doesn't have to match the base
   model's name).
3. On the project's **Overview** page, copy the **project endpoint**
   (looks like `https://<project>.services.ai.azure.com/api/projects/<project-name>`).
   This is `PROJECT_ENDPOINT` below.

(Portal navigation shifts over time — if a label doesn't match exactly,
look for "Models + endpoints" / "Deployments" and the project's
endpoint on its Overview page.)

You don't create the *agent* itself here — leave the Agents tab empty.
This app creates its own agent via the SDK on startup, using the model
deployment and endpoint above.

## Prerequisites

- The Azure AI Foundry project and model deployment from Step 0 — its
  **project endpoint** and the model's **deployment name**.
- The Azure CLI, logged in (`az login`), with access to the
  subscription you want to deploy into.

## Run it locally

```bash
cd azure-agent
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in PROJECT_ENDPOINT and MODEL_DEPLOYMENT_NAME
export $(grep -v '^#' .env | xargs)
```

Auth is via `DefaultAzureCredential` — no keys to copy in. Locally that
means `az login` as a user who has the **Azure AI Developer** role on
the project:

```bash
az role assignment create \
  --assignee "$(az ad signed-in-user show --query id -o tsv)" \
  --role "Azure AI Developer" \
  --scope "<AI Foundry project resource id>"
```

Then:

```bash
uvicorn app.main:app --reload --port 8000
```

```bash
curl -X POST localhost:8000/jobs -H 'content-type: application/json' \
  -d '{"message": "Summarize the plot of Hamlet in two sentences."}'
# -> {"id": "...", "status": "queued", "conversation_id": "...", ...}

curl localhost:8000/jobs/<id>
# -> {"status": "completed", "result": "...", ...}
```

Keep sending jobs with the same `"conversation_id"` to continue that
thread.

## Deploy to Azure

**1. Provision the compute** (Container Apps environment, a Container
Registry, and the app itself, at a fixed 1 replica):

```bash
az group create -n azure-agent-rg -l eastus

az deployment group create \
  -g azure-agent-rg \
  -f infra/main.bicep \
  -p infra/main.parameters.json \
  -p projectEndpoint="https://<project>.services.ai.azure.com/api/projects/<project-name>" \
  -p modelDeploymentName="gpt-4o" \
  -p apiToken="$(openssl rand -hex 32)"   # keep this value, you'll need it as a client
```

Note the `registryLoginServer` and `containerAppPrincipalId` from the
deployment outputs.

**2. Build and push the image** (via ACR Tasks — no local Docker
daemon required):

```bash
az acr build --registry <registryLoginServer without .azurecr.io> \
  -t azure-agent:latest .

az containerapp update -n azure-agent-app -g azure-agent-rg \
  --image <registryLoginServer>/azure-agent:latest
```

**3. Grant the app access to your AI Foundry project.** The bicep only
provisions compute — it deliberately doesn't reach into your AI
Foundry project's resource group to assign roles, since that project
usually already exists and may live elsewhere:

```bash
az role assignment create \
  --assignee "<containerAppPrincipalId>" \
  --role "Azure AI Developer" \
  --scope "<AI Foundry project resource id>"
```

**4. Call it:**

```bash
FQDN=$(az containerapp show -n azure-agent-app -g azure-agent-rg \
  --query properties.configuration.ingress.fqdn -o tsv)

curl -X POST "https://$FQDN/jobs" \
  -H 'content-type: application/json' \
  -H 'authorization: Bearer <the apiToken you set above>' \
  -d '{"message": "hello"}'
```

**5. Confirm it in Foundry.** Open your project at
[ai.azure.com](https://ai.azure.com) → **Agents** — you should see an
agent named `long-running-agent` (or whatever `AGENT_NAME` you set),
created the moment the container app first started. That's the actual
"deployed in Azure AI Foundry" part; everything above it just gets your
own code running somewhere that can reach it.

## Auth

`/jobs`, `/conversations`, and `/jobs/{id}` are gated behind a bearer
token (`API_TOKEN`) using the same optional-but-strongly-recommended
shared-secret pattern as `venture-bridge/shell`'s `TERMINAL_TOKEN`. If
`API_TOKEN` is unset the service logs a warning at startup and accepts
unauthenticated requests — fine for local testing, not for anything
public. Every job run spends real model tokens on your Azure bill, so
set it before exposing the container app's FQDN to anyone but yourself.

## Extending it

- **More tools**: add functions to `AGENT_FUNCTIONS` in `app/tools.py`
  — any plain, type-hinted, docstring'd Python function becomes a
  callable tool automatically.
- **More throughput**: raise `WORKER_CONCURRENCY` in `app/main.py` to
  run more than one job at a time (each worker still processes its own
  jobs serially; this just adds more workers pulling from the same
  queue).
- **Durable job history across restarts**: `app/store.py` is in-memory
  by design — the thing that actually needs to survive a restart, the
  agent's conversation history, already does (Azure AI Foundry owns
  it). If you also want job *metadata* (status, timestamps) to survive
  a restart or to be visible across replicas, swap `JobStore` for a
  table in Azure Table Storage or Cosmos DB; `main.py` and
  `queue_worker.py` only touch its four methods (`create`, `get`,
  `mark_running`, `mark_done`).
