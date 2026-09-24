"""Venture Bridge API — a small FastAPI backend for tracking progress
across a portfolio of projects, backed by a local SQLite database."""

import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from agents.router import router as agents_router

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "venture_bridge.db"
FRONTEND_DIR = BASE_DIR.parent / "frontend"

SEED = [
    {
        "id": "yumesorai", "order": 1, "name": "Yumesorai", "category": "Anime IP",
        "summary": "Original anime IP — world, characters, and pilot concept.",
        "milestone": "Define core IP & pilot concept",
    },
    {
        "id": "agent-arena", "order": 2, "name": "Agent Arena", "category": "AI · Gaming",
        "summary": "Competitive arena where AI agents face off.",
        "milestone": "Scope MVP arena format",
    },
    {
        "id": "new-age-browser", "order": 3, "name": "New Age Browser", "category": "Consumer Tech",
        "summary": "Rethinking the browser for an AI-native web.",
        "milestone": "Nail the core differentiator",
    },
    {
        "id": "gold-tokenization", "order": 4, "name": "Tokenization of Gold", "category": "Fintech · RWA",
        "summary": "On-chain tokens backed by physical gold reserves.",
        "milestone": "Map the regulatory path",
        "ppt_url": "https://docs.google.com/presentation/d/1WYidDrs6urrL9Z1qWk4YdJh0FH9Tx8k-xzaT1n7q-vU/edit",
    },
    {
        "id": "anime-micro-drama", "order": 5, "name": "Anime Micro Drama", "category": "Content · Media",
        "summary": "Short-form anime drama built for vertical video.",
        "milestone": "Produce the first micro-drama pilot",
    },
    {
        "id": "agentic-os", "order": 6, "name": "Agentic OS", "category": "AI Infra",
        "summary": "An operating layer built around autonomous agents.",
        "milestone": "Define the agent runtime primitives",
    },
]

FIELD_TO_COLUMN = {
    "summary": "summary",
    "stage": "stage",
    "health": "health",
    "progress": "progress",
    "milestone": "milestone",
    "githubUrl": "github_url",
    "liveUrl": "live_url",
    "serverUrl": "server_url",
    "pptUrl": "ppt_url",
    "credentialsNote": "credentials_note",
}


@contextmanager
def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    with get_conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS projects (
                id TEXT PRIMARY KEY,
                order_num INTEGER NOT NULL,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                stage TEXT NOT NULL,
                health TEXT NOT NULL,
                progress INTEGER NOT NULL,
                milestone TEXT NOT NULL,
                summary TEXT NOT NULL,
                team TEXT NOT NULL,
                github_url TEXT NOT NULL,
                live_url TEXT NOT NULL,
                server_url TEXT NOT NULL,
                ppt_url TEXT NOT NULL,
                credentials_note TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                log TEXT NOT NULL
            )
            """
        )
        conn.commit()
        count = conn.execute("SELECT COUNT(*) FROM projects").fetchone()[0]
        if count == 0:
            seed(conn)


def seed(conn):
    now = datetime.now(timezone.utc).isoformat()
    for p in SEED:
        starter_log = json.dumps(
            [{"date": now, "note": "Tracker created. Log your first real update here."}]
        )
        conn.execute(
            """
            INSERT INTO projects (
                id, order_num, name, category, stage, health, progress, milestone,
                summary, team, github_url, live_url, server_url, ppt_url, credentials_note,
                updated_at, log
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                p["id"], p["order"], p["name"], p["category"], "Ideation", "on-track", 10,
                p["milestone"], p["summary"], json.dumps([]), "", "", "", p.get("ppt_url", ""), "",
                now, starter_log,
            ),
        )
    conn.commit()


def row_to_dict(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "order": row["order_num"],
        "name": row["name"],
        "category": row["category"],
        "stage": row["stage"],
        "health": row["health"],
        "progress": row["progress"],
        "milestone": row["milestone"],
        "summary": row["summary"],
        "team": json.loads(row["team"]),
        "githubUrl": row["github_url"],
        "liveUrl": row["live_url"],
        "serverUrl": row["server_url"],
        "pptUrl": row["ppt_url"],
        "credentialsNote": row["credentials_note"],
        "updatedAt": row["updated_at"],
        "log": json.loads(row["log"]),
    }


class ProjectUpdate(BaseModel):
    summary: Optional[str] = None
    stage: Optional[str] = None
    health: Optional[str] = None
    progress: Optional[int] = None
    milestone: Optional[str] = None
    team: Optional[List[str]] = None
    githubUrl: Optional[str] = None
    liveUrl: Optional[str] = None
    serverUrl: Optional[str] = None
    pptUrl: Optional[str] = None
    credentialsNote: Optional[str] = None


class LogEntryIn(BaseModel):
    note: str


app = FastAPI(title="Venture Bridge API")
app.include_router(agents_router)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/api/projects")
def list_projects():
    with get_conn() as conn:
        rows = conn.execute("SELECT * FROM projects ORDER BY order_num").fetchall()
        return [row_to_dict(r) for r in rows]


@app.get("/api/projects/{project_id}")
def get_project(project_id: str):
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Project not found")
        return row_to_dict(row)


@app.put("/api/projects/{project_id}")
def update_project(project_id: str, payload: ProjectUpdate):
    data = payload.model_dump(exclude_unset=True)
    if "progress" in data and data["progress"] is not None:
        data["progress"] = max(0, min(100, int(data["progress"])))

    with get_conn() as conn:
        row = conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Project not found")

        set_clauses = []
        values: list = []
        for key, column in FIELD_TO_COLUMN.items():
            if key in data:
                set_clauses.append(f"{column} = ?")
                values.append(data[key])
        if "team" in data:
            set_clauses.append("team = ?")
            values.append(json.dumps(data["team"] or []))

        set_clauses.append("updated_at = ?")
        values.append(datetime.now(timezone.utc).isoformat())
        values.append(project_id)

        conn.execute(f"UPDATE projects SET {', '.join(set_clauses)} WHERE id = ?", values)
        conn.commit()
        row = conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
        return row_to_dict(row)


@app.post("/api/projects/{project_id}/log")
def add_log_entry(project_id: str, entry: LogEntryIn):
    note = entry.note.strip()
    if not note:
        raise HTTPException(status_code=400, detail="Log note cannot be empty")

    with get_conn() as conn:
        row = conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Project not found")

        log = json.loads(row["log"])
        now = datetime.now(timezone.utc).isoformat()
        log.insert(0, {"date": now, "note": note})

        conn.execute(
            "UPDATE projects SET log = ?, updated_at = ? WHERE id = ?",
            (json.dumps(log), now, project_id),
        )
        conn.commit()
        row = conn.execute("SELECT * FROM projects WHERE id = ?", (project_id,)).fetchone()
        return row_to_dict(row)


app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
