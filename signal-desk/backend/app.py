"""Signal Desk API — a FastAPI backend for the client-event monitoring
prototype: a triage feed of commercial, credit, KYC, and risk/compliance
signals surfaced from public registries and (eventually) private
intelligence sources, linked back to clients and entities."""

import json
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from ai_provider import get_provider
from seed_data import CATEGORIES, CLIENTS, EVENTS, SOURCES

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "signal_desk.db"
FRONTEND_DIR = BASE_DIR.parent / "frontend"


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
            CREATE TABLE IF NOT EXISTS sources (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                kind TEXT NOT NULL,
                coverage TEXT NOT NULL,
                description TEXT NOT NULL,
                status TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS clients (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                segment TEXT NOT NULL,
                rm_owner TEXT NOT NULL,
                is_prospect INTEGER NOT NULL DEFAULT 0,
                linked_entities TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category TEXT NOT NULL,
                event_type TEXT NOT NULL,
                entity_name TEXT NOT NULL,
                client_id TEXT,
                source_id TEXT NOT NULL,
                priority TEXT NOT NULL,
                description TEXT NOT NULL,
                status TEXT NOT NULL,
                detected_at TEXT NOT NULL,
                ai_summary TEXT,
                ai_suggested_action TEXT,
                ai_confidence REAL,
                ai_provider_used TEXT
            )
            """
        )
        conn.commit()
        if conn.execute("SELECT COUNT(*) FROM sources").fetchone()[0] == 0:
            seed(conn)


def seed(conn):
    for s in SOURCES:
        conn.execute(
            "INSERT INTO sources (id, name, kind, coverage, description, status) VALUES (?, ?, ?, ?, ?, ?)",
            (s["id"], s["name"], s["kind"], s["coverage"], s["description"], s["status"]),
        )
    for c in CLIENTS:
        conn.execute(
            "INSERT INTO clients (id, name, segment, rm_owner, is_prospect, linked_entities) VALUES (?, ?, ?, ?, ?, ?)",
            (c["id"], c["name"], c["segment"], c["rm_owner"], int(c.get("is_prospect", False)), json.dumps(c["linked_entities"])),
        )
    now = datetime.now(timezone.utc)
    for i, e in enumerate(EVENTS):
        detected_at = (now - timedelta(hours=i * 7)).isoformat()
        conn.execute(
            """
            INSERT INTO events (
                category, event_type, entity_name, client_id, source_id, priority,
                description, status, detected_at, ai_summary, ai_suggested_action,
                ai_confidence, ai_provider_used
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'New', ?, NULL, NULL, NULL, NULL)
            """,
            (
                e["category"], e["event_type"], e["entity_name"], e["client_id"],
                e["source_id"], e["priority"], e["description"], detected_at,
            ),
        )
    conn.commit()


def event_row_to_dict(row: sqlite3.Row, sources_by_id: dict, clients_by_id: dict) -> dict:
    source = sources_by_id.get(row["source_id"], {})
    client = clients_by_id.get(row["client_id"]) if row["client_id"] else None
    return {
        "id": row["id"],
        "category": row["category"],
        "eventType": row["event_type"],
        "entityName": row["entity_name"],
        "clientId": row["client_id"],
        "clientName": client["name"] if client else None,
        "sourceId": row["source_id"],
        "sourceName": source.get("name", row["source_id"]),
        "sourceKind": source.get("kind"),
        "priority": row["priority"],
        "description": row["description"],
        "status": row["status"],
        "detectedAt": row["detected_at"],
        "aiSummary": row["ai_summary"],
        "aiSuggestedAction": row["ai_suggested_action"],
        "aiConfidence": row["ai_confidence"],
        "aiProviderUsed": row["ai_provider_used"],
    }


def source_row_to_dict(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"], "name": row["name"], "kind": row["kind"],
        "coverage": row["coverage"], "description": row["description"], "status": row["status"],
    }


def client_row_to_dict(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"], "name": row["name"], "segment": row["segment"],
        "rmOwner": row["rm_owner"], "isProspect": bool(row["is_prospect"]),
        "linkedEntities": json.loads(row["linked_entities"]),
    }


class StatusUpdate(BaseModel):
    status: str


VALID_STATUSES = {"New", "Under Review", "Actioned", "Dismissed"}


class AIConfigIn(BaseModel):
    endpoint: Optional[str] = None
    deployment: Optional[str] = None


app = FastAPI(title="Signal Desk API")


@app.on_event("startup")
def on_startup():
    init_db()


def _sources_and_clients(conn):
    sources_by_id = {r["id"]: source_row_to_dict(r) for r in conn.execute("SELECT * FROM sources")}
    clients_by_id = {r["id"]: client_row_to_dict(r) for r in conn.execute("SELECT * FROM clients")}
    return sources_by_id, clients_by_id


@app.get("/api/meta")
def get_meta():
    return {"categories": CATEGORIES}


@app.get("/api/events")
def list_events(category: Optional[str] = None, priority: Optional[str] = None, status: Optional[str] = None):
    with get_conn() as conn:
        sources_by_id, clients_by_id = _sources_and_clients(conn)
        rows = conn.execute("SELECT * FROM events ORDER BY detected_at DESC").fetchall()
        events = [event_row_to_dict(r, sources_by_id, clients_by_id) for r in rows]
        if category:
            events = [e for e in events if e["category"] == category]
        if priority:
            events = [e for e in events if e["priority"] == priority]
        if status:
            events = [e for e in events if e["status"] == status]
        return events


@app.patch("/api/events/{event_id}")
def update_event_status(event_id: int, payload: StatusUpdate):
    if payload.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"status must be one of {sorted(VALID_STATUSES)}")
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM events WHERE id = ?", (event_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Event not found")
        conn.execute("UPDATE events SET status = ? WHERE id = ?", (payload.status, event_id))
        conn.commit()
        sources_by_id, clients_by_id = _sources_and_clients(conn)
        row = conn.execute("SELECT * FROM events WHERE id = ?", (event_id,)).fetchone()
        return event_row_to_dict(row, sources_by_id, clients_by_id)


@app.post("/api/events/{event_id}/analyze")
def analyze_event(event_id: int):
    with get_conn() as conn:
        sources_by_id, clients_by_id = _sources_and_clients(conn)
        row = conn.execute("SELECT * FROM events WHERE id = ?", (event_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Event not found")
        event = event_row_to_dict(row, sources_by_id, clients_by_id)

        provider = get_provider()
        result = provider.analyze(
            {
                "category": event["category"],
                "event_type": event["eventType"],
                "entity_name": event["entityName"],
                "source_name": event["sourceName"],
                "description": event["description"],
            }
        )
        conn.execute(
            """
            UPDATE events SET ai_summary = ?, ai_suggested_action = ?, ai_confidence = ?, ai_provider_used = ?
            WHERE id = ?
            """,
            (result["summary"], result["suggested_action"], result["confidence"], provider.name, event_id),
        )
        conn.commit()
        row = conn.execute("SELECT * FROM events WHERE id = ?", (event_id,)).fetchone()
        return event_row_to_dict(row, sources_by_id, clients_by_id)


@app.get("/api/sources")
def list_sources():
    with get_conn() as conn:
        return [source_row_to_dict(r) for r in conn.execute("SELECT * FROM sources ORDER BY kind, name")]


@app.get("/api/clients")
def list_clients():
    with get_conn() as conn:
        return [client_row_to_dict(r) for r in conn.execute("SELECT * FROM clients ORDER BY name")]


@app.get("/api/clients/{client_id}")
def get_client(client_id: str):
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM clients WHERE id = ?", (client_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Client not found")
        client = client_row_to_dict(row)
        sources_by_id, clients_by_id = _sources_and_clients(conn)
        events = conn.execute(
            "SELECT * FROM events WHERE client_id = ? ORDER BY detected_at DESC", (client_id,)
        ).fetchall()
        client["events"] = [event_row_to_dict(r, sources_by_id, clients_by_id) for r in events]
        return client


@app.get("/api/ai/status")
def ai_status():
    provider = get_provider()
    return {
        "activeProvider": provider.name,
        "azureFoundryConfigured": provider.name == "Azure AI Foundry",
        "note": (
            "Set AZURE_AI_FOUNDRY_ENDPOINT and AZURE_AI_FOUNDRY_API_KEY as environment "
            "variables to switch from the demo engine to a live Azure AI Foundry model "
            "deployment — no code change required."
        ),
    }


app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
