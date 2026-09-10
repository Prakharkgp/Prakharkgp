# Prakhar Bridge Board

A tracker for the status, progress, and access details of Prakhar's
portfolio of projects: Yumesorai, Agent Arena, New Age Browser,
Tokenization of Gold, Anime Micro Drama, and Agentic OS.

- **Backend**: FastAPI + SQLite (`backend/app.py`). Stores each project's
  stage, health, progress, next milestone, team members, GitHub repo,
  live platform link, server/infra link, a credentials pointer, and a
  timestamped update log.
- **Frontend**: a single static page (`frontend/index.html`) served by
  the backend, talking to it over a small JSON API.

## Run it

```bash
cd venture-bridge/backend
pip install -r requirements.txt
python -m uvicorn app:app --reload
```

Open http://127.0.0.1:8000 — the six projects are seeded automatically
on first run, in `backend/venture_bridge.db` (SQLite, git-ignored).

## Deploy (Render)

`render.yaml` at the repo root defines a free web service pointed at
`venture-bridge/backend`.

1. Push this repo to GitHub (already done if you're reading this from there).
2. In the [Render dashboard](https://dashboard.render.com), click **New +** → **Blueprint**, and pick this repo.
3. Render reads `render.yaml` and proposes a `venture-bridge` web service — review and click **Apply**.
4. Once it builds, Render gives you a `https://venture-bridge-xxxx.onrender.com` URL.

**Data persistence caveat:** the free plan has no persistent disk, so
`venture_bridge.db` resets on every redeploy (and the service spins
down after 15 minutes idle, waking on the next request with a ~30s
delay). Fine for trying it out; for data that needs to survive
redeploys, either attach a paid persistent disk to this service in
Render's dashboard, or swap SQLite for a hosted Postgres (Render's
free Postgres tier works well with a small schema change).

## Live terminal (read this before enabling it)

`frontend/terminal.html` (linked from the "Terminal" button in the header)
opens a real bash shell inside whatever container is running this backend,
streamed to the browser over a WebSocket (`/ws/terminal`) using xterm.js.

**This is off by default.** The endpoint refuses every connection unless
the `TERMINAL_TOKEN` environment variable is set on the server. With it
unset, `/ws/terminal` just tells you it's disabled and closes.

If you turn it on:

- **It's full shell access to this exact machine** — same filesystem, same
  environment variables (which may include other secrets), for whoever
  holds the token. It is not a separate, sandboxed VM.
- **It's the same container the web app runs in.** On Render's free tier
  that container is ephemeral — ends on every redeploy — but while it's
  up, the token is equivalent to that machine's root password.
- Set `TERMINAL_TOKEN` as a long random secret (e.g. `openssl rand -hex 32`)
  in Render's **Environment** tab for this service — never commit it to
  git, never put it in `render.yaml`.
- The server does a constant-time token comparison and locks out an IP
  after 5 failed attempts within 5 minutes. That's a deterrent, not a
  substitute for a strong token — there's no real rate-limiting or 2FA.
- Consider restricting the service's **IP Allow List** (in Render's
  dashboard, under the service's Settings) to your own IP if you want
  real defense in depth.
- Rotate the token if you ever suspect it leaked (browser history,
  screen share, etc.) — just change `TERMINAL_TOKEN` in Render and
  redeploy.

## API

| Method | Path                          | Does                                   |
|--------|-------------------------------|-----------------------------------------|
| GET    | `/api/projects`               | List all projects                       |
| GET    | `/api/projects/{id}`          | Get one project                         |
| PUT    | `/api/projects/{id}`          | Update any subset of its fields         |
| POST   | `/api/projects/{id}/log`      | Prepend a dated note to its update log  |
| WS     | `/ws/terminal`                | Live shell; requires `TERMINAL_TOKEN`   |

## A note on credentials

The **Credentials** field is plain text in the SQLite file — there's no
encryption or access control beyond the machine the server runs on.
Use it to point at where real credentials live (a password manager
vault, a secrets store), not to hold the credentials themselves.
