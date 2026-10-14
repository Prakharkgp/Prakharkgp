# Signal Desk

A working prototype of the client-event monitoring product scoped in the
RBS hackathon `Req.md`: a triage feed that turns public-registry and
(eventually) private-intelligence signals into prioritized, client-linked
alerts for Private Banking and Corporate coverage teams.

This is a **product-shape demo** — it shows how the tool would function
and look for an initial prototype review, built on realistic-but-fictional
data. It is not wired to any real registry, media, or compliance data
provider yet.

## What it demonstrates

- **The event taxonomy from `Req.md`**, across all four priority
  categories: Commercial Opportunity, Corporate & Credit, KYC Update, and
  Risk & Compliance — each event tagged with its specific type (e.g.
  "M&A / acquisition", "Change of shareholder or UBO", "Sanctions").
- **A source registry** listing the public sources to prioritize first
  (INPI, BODACC, Companies House, AMF, SEC EDGAR, sanctions lists,
  corporate IR, financial media — simulated here) alongside the private
  sources to benchmark against later (Orbis, Mergermarket, PitchBook,
  Altrata/Wealth-X, World-Check, LexisNexis, SPARK/Interfax, Salamanca —
  flagged as planned integrations, with the specific question each one
  answers).
- **Client & ownership linking** — an event on an indirectly-held entity
  (e.g. a stake sale in a subsidiary) is traced back to the client through
  an ownership chain, the same role Orbis plays in the target
  architecture.
- **A triage workflow** — filter the feed by category/priority/status,
  and move a signal through New → Under Review → Actioned/Dismissed.
- **A pluggable AI layer** — every signal has an "Analyze with AI" action.
  Today it runs a rule-based demo engine (no external calls, no keys).
  The interface is already shaped for **Azure AI Foundry**: set two
  environment variables and every analysis call runs against a real model
  deployment instead, with no code changes. See `backend/ai_provider.py`.

## Run it

```bash
cd signal-desk/backend
pip install -r requirements.txt
python -m uvicorn app:app --reload
```

Open http://127.0.0.1:8000 — demo sources and events are seeded automatically
on first run into `backend/signal_desk.db` (SQLite, git-ignored). The Clients
screen loads live client/prospect records and KYC services from the same API.

## Environment variables (.env)

Create `backend/.env` (git-ignored, never commit it) to configure the
optional integrations. Nothing here is required to run the demo — every
feature falls back to a rule-based/mock implementation when a variable is
missing.

```env
# Veille agent pipeline (POST /api/veille, "Explorer l'opportunité commerciale")
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_DEPLOYMENT_NAME=

# Analyze-with-AI enrichment layer (AI Engine tab) — alternative to setting
# these from the UI itself
AZURE_AI_FOUNDRY_ENDPOINT=
AZURE_AI_FOUNDRY_API_KEY=
AZURE_AI_FOUNDRY_DEPLOYMENT=

# Optional: run the veille pipeline against a separate hosted API instead of
# in-process (see "Deploy" below)
VEILLE_API_URL=

# Optional: real web/registry lookups used by the veille agent's tools
# (backend/agents/tools.py) — each is independent and safe to leave unset
GOOGLE_SEARCH_PROVIDER=
GOOGLE_SEARCH_API_KEY=
GOOGLE_SEARCH_ENGINE_ID=
PAPPERS_API_TOKEN=
COMPANIES_HOUSE_API_KEY=
```

`.env` is loaded from `backend/.env` first, then `signal-desk/.env` and
`backend/agents/.env` as fallbacks (see `load_dotenv(...)` calls in
`backend/agents/client.py` and `backend/agents/kyc/agent.py`). To add a new
variable: add the line to `backend/.env`, read it with `os.getenv("NAME")`
(or `os.environ["NAME"]` if it's required) wherever it's needed, and restart
the server — `uvicorn --reload` does not reload `.env` changes on its own.

## Adding data to the SQLite database

Everything the app reads is stored in `backend/signal_desk.db` (SQLite,
git-ignored, recreated automatically). There is no separate "data" step to
run — restart the backend and it re-seeds anything missing:

- **Demo sources / clients / events** — edit `backend/seed_data.py`
  (`SOURCES`, `CLIENTS`, `EVENTS` lists) and add new entries following the
  existing shape. They're only inserted once, when the `sources` table is
  empty, so delete `backend/signal_desk.db` and restart the server to force
  a full re-seed with your changes.
- **KYC BDD fixtures** (`backend/agents/bdd/*.json`) — drop a new file in
  that folder; it's picked up by `backend/agents/bdd_store.py` the same way,
  but only loaded into the `bdd_documents` table once (when it's empty).
  Delete `signal_desk.db` (or just clear that table) and restart to pick up
  new/changed files. The JSON files themselves are never deleted or
  modified by the app.
- **Internal KYC referential** (`data/test_*.json`, at the repo root) — read
  live from disk on every request by `backend/agents/kyc/store.py`, so
  adding a new `test_*.json` file there is picked up immediately, no
  restart needed.
- **Veille run history** — every "Explorer l'opportunité commerciale" run is
  saved automatically to the `veille_runs` table (`POST
  /api/clients/{id}/veille-runs`); no manual step needed. View it from the
  "Historique de veille" button next to a client's "Veille" button in the
  Clients tab.

## Connecting Azure AI Foundry later

The AI Engine tab in the app always shows which engine is currently
active. To move off the demo engine, set these on the backend's
environment (never commit them):

| Variable | Purpose |
|---|---|
| `AZURE_AI_FOUNDRY_ENDPOINT` | Your Foundry resource's OpenAI-compatible base URL, e.g. `https://<resource>.services.ai.azure.com/openai/v1` |
| `AZURE_AI_FOUNDRY_API_KEY` | API key for that deployment |
| `AZURE_AI_FOUNDRY_DEPLOYMENT` | Deployment name, e.g. `gpt-5.4-mini` |

`get_provider()` in `backend/ai_provider.py` picks `AzureFoundryProvider`
automatically once both the endpoint and key are set — otherwise it falls
back to `MockAIProvider`, so the app always works out of the box.
`AzureFoundryProvider` calls the deployment through the official `openai`
Python SDK's Responses API (`client.responses.create(...)`), pointed at
the Foundry endpoint via `base_url`.

## API

| Method | Path | Does |
|---|---|---|
| GET | `/api/meta` | Category list |
| GET | `/api/events` | List signals (optional `category`, `priority`, `status` filters) |
| PATCH | `/api/events/{id}` | Update a signal's triage status |
| POST | `/api/events/{id}/analyze` | Run the active AI provider on a signal |
| GET | `/api/sources` | List public/private sources |
| GET | `/api/clients` | List clients |
| GET | `/api/clients/{id}` | Client detail: ownership chain + linked signals |
| POST | `/api/clients/{id}/kyc` | Run KYC analysis against supplied external data |
| POST | `/api/veille` | Run commercial monitoring for an internal client |
| POST | `/api/clients/{id}/agent-runs` | Start the explore-opportunity agent run |
| GET | `/api/agent-runs/{run_id}` | Agent run progress and result |
| POST | `/api/clients/{id}/veille-runs` | Save a completed veille/agent-run result to history |
| GET | `/api/clients/{id}/veille-runs` | Veille history for a client, most recent first |
| GET | `/api/veille-runs/summary` | Per-client veille history counts |
| GET | `/api/ai/status` | Which AI engine is currently active |

## Deploy (Render)

`render.yaml` at the repo root includes the `signal-desk` web service
pointed at `signal-desk/backend`. Push to GitHub, then in the
[Render dashboard](https://dashboard.render.com) use **New +** → **Blueprint**
on this repo; Render will propose all services defined in `render.yaml`.
To enable Azure AI Foundry on the deployed instance, add
`AZURE_AI_FOUNDRY_ENDPOINT` / `AZURE_AI_FOUNDRY_API_KEY` /
`AZURE_AI_FOUNDRY_DEPLOYMENT` as environment variables on that service in
Render's dashboard — the same free-tier caveats apply
(SQLite resets on redeploy, service spins down when idle).

`POST /api/veille` (called by **Explorer l'opportunité commerciale**)
forwards `{"client_id": ...}` to the veille agent API. Set `VEILLE_API_URL`
to that API's base URL (e.g. `https://veille-agent.example.com`; the app
calls `$VEILLE_API_URL/api/veille`). If it is not set, the pipeline runs
in-process and needs `AZURE_OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT` and
`AZURE_OPENAI_DEPLOYMENT_NAME` instead.

## A note on the data

All clients, entities, and events in this prototype are fictional,
constructed directly from the priority-event and source lists in `Req.md`
to make the workflow legible — none of it reflects real people, companies,
or filings.
