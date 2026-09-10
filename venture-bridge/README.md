# Venture Bridge

A tracker for the status, progress, and access details of a portfolio of
projects: Yumesorai, Agent Arena, New Age Browser, Tokenization of Gold,
Anime Micro Drama, and Agentic OS.

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

## API

| Method | Path                          | Does                                   |
|--------|-------------------------------|-----------------------------------------|
| GET    | `/api/projects`               | List all projects                       |
| GET    | `/api/projects/{id}`          | Get one project                         |
| PUT    | `/api/projects/{id}`          | Update any subset of its fields         |
| POST   | `/api/projects/{id}/log`      | Prepend a dated note to its update log  |

## A note on credentials

The **Credentials** field is plain text in the SQLite file — there's no
encryption or access control beyond the machine the server runs on.
Use it to point at where real credentials live (a password manager
vault, a secrets store), not to hold the credentials themselves.
