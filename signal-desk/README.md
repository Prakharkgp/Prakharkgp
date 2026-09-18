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

Open http://127.0.0.1:8000 — sample sources, clients, and events are
seeded automatically on first run, into `backend/signal_desk.db` (SQLite,
git-ignored).

## Connecting Azure AI Foundry later

The AI Engine tab in the app always shows which engine is currently
active. To move off the demo engine, set these on the backend's
environment (never commit them):

| Variable | Purpose |
|---|---|
| `AZURE_AI_FOUNDRY_ENDPOINT` | Your Foundry resource endpoint, e.g. `https://<resource>.services.ai.azure.com` |
| `AZURE_AI_FOUNDRY_API_KEY` | API key for that deployment |
| `AZURE_AI_FOUNDRY_DEPLOYMENT` | Deployment/model name (defaults to `gpt-4o-mini`) |

`get_provider()` in `backend/ai_provider.py` picks `AzureFoundryProvider`
automatically once both the endpoint and key are set — otherwise it falls
back to `MockAIProvider`, so the app always works out of the box.

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
| GET | `/api/ai/status` | Which AI engine is currently active |

## Deploy (Render)

`render.yaml` at the repo root includes a `signal-desk` web service
pointed at `signal-desk/backend`, alongside the existing `venture-bridge`
services. Push to GitHub, then in the
[Render dashboard](https://dashboard.render.com) use **New +** → **Blueprint**
on this repo; Render will propose all services defined in `render.yaml`.
To enable Azure AI Foundry on the deployed instance, add
`AZURE_AI_FOUNDRY_ENDPOINT` / `AZURE_AI_FOUNDRY_API_KEY` /
`AZURE_AI_FOUNDRY_DEPLOYMENT` as environment variables on that service in
Render's dashboard — the same free-tier caveats as `venture-bridge` apply
(SQLite resets on redeploy, service spins down when idle).

## A note on the data

All clients, entities, and events in this prototype are fictional,
constructed directly from the priority-event and source lists in `Req.md`
to make the workflow legible — none of it reflects real people, companies,
or filings.
