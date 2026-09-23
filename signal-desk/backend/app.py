"""Signal Desk API — a FastAPI backend for the client-event monitoring
prototype: a triage feed of commercial, credit, KYC, and risk/compliance
signals surfaced from public registries and (eventually) private
intelligence sources, linked back to clients and entities."""

import json
import re
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
                ai_provider_used TEXT,
                decline_reason TEXT
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS ai_config (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                endpoint TEXT NOT NULL DEFAULT '',
                api_key TEXT NOT NULL DEFAULT '',
                deployment TEXT NOT NULL DEFAULT ''
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
        "declineReason": row["decline_reason"],
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
    reason: Optional[str] = None


VALID_STATUSES = {"New", "Under Review", "Actioned", "Dismissed"}


class AIConfigIn(BaseModel):
    endpoint: Optional[str] = None
    apiKey: Optional[str] = None
    deployment: Optional[str] = None


class ShareholderConvertIn(BaseModel):
    entityName: str
    shareholderName: str


def _annotate_other_shareholders(client: dict, conn) -> None:
    """Mark each linked entity's other shareholders as isClient by
    cross-checking their name against the current clients table, so a
    shareholder just converted into a client is reflected immediately."""
    existing_names = {r["name"].strip().lower() for r in conn.execute("SELECT name FROM clients")}
    for entity in client["linkedEntities"]:
        for holder in entity.get("other_shareholders", []):
            holder["isClient"] = holder["name"].strip().lower() in existing_names


def _potential_prospect_count(client: dict) -> int:
    """How many co-shareholders across this client's linked entities have
    no client record yet — i.e. convertible opportunity prospects."""
    return sum(
        1
        for entity in client["linkedEntities"]
        for holder in entity.get("other_shareholders", [])
        if not holder.get("isClient")
    )


app = FastAPI(title="Signal Desk API")


@app.on_event("startup")
def on_startup():
    init_db()


def _sources_and_clients(conn):
    sources_by_id = {r["id"]: source_row_to_dict(r) for r in conn.execute("SELECT * FROM sources")}
    clients_by_id = {r["id"]: client_row_to_dict(r) for r in conn.execute("SELECT * FROM clients")}
    return sources_by_id, clients_by_id


def _get_ai_config_row(conn):
    return conn.execute("SELECT * FROM ai_config WHERE id = 1").fetchone()


def _get_active_provider(conn):
    row = _get_ai_config_row(conn)
    if row is None:
        return get_provider()
    return get_provider(row["endpoint"], row["api_key"], row["deployment"])


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
        reason = payload.reason.strip() if payload.reason else None
        conn.execute(
            "UPDATE events SET status = ?, decline_reason = ? WHERE id = ?",
            (payload.status, reason, event_id),
        )
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

        provider = _get_active_provider(conn)
        try:
            result = provider.analyze(
                {
                    "category": event["category"],
                    "event_type": event["eventType"],
                    "entity_name": event["entityName"],
                    "source_name": event["sourceName"],
                    "description": event["description"],
                }
            )
        except Exception as exc:
            raise HTTPException(
                status_code=502,
                detail=f"{provider.name} call failed: {type(exc).__name__}: {exc}",
            ) from exc
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
        clients = [client_row_to_dict(r) for r in conn.execute("SELECT * FROM clients ORDER BY name")]
        for client in clients:
            _annotate_other_shareholders(client, conn)
            client["potentialProspectCount"] = _potential_prospect_count(client)
        return clients


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
        _annotate_other_shareholders(client, conn)
        client["potentialProspectCount"] = _potential_prospect_count(client)
        return client


@app.post("/api/clients/{client_id}/scan-opportunities")
def scan_client_opportunities(client_id: str):
    """The 'agent' button: cross-checks the client's known ownership
    structure against the signals already on file, and flags any linked
    entity that has no tracked signal yet — i.e. something the internal
    referential may have missed. For each gap, a new signal is created
    directly in the Signal Directory (source = the internal cross-check
    agent) and immediately run through the active AI provider — so the
    agent doesn't just preview a finding, it adds a fully-analyzed line."""
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM clients WHERE id = ?", (client_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Client not found")
        client = client_row_to_dict(row)

        tracked_entities = {
            r["entity_name"]
            for r in conn.execute("SELECT entity_name FROM events WHERE client_id = ?", (client_id,))
        }
        gaps = [e for e in client["linkedEntities"] if e["name"] not in tracked_entities]

        if not gaps:
            return {"found": False, "clientId": client_id, "clientName": client["name"]}

        provider = _get_active_provider(conn)
        sources_by_id, clients_by_id = _sources_and_clients(conn)
        now = datetime.now(timezone.utc).isoformat()
        results = []

        for gap in gaps[:3]:
            description = (
                f"{gap['name']} is linked to {client['name']} "
                f"({gap['relation']}, {gap['jurisdiction']}) but had no signal on file — "
                "added automatically by the internal referential cross-check agent."
            )
            cur = conn.execute(
                """
                INSERT INTO events (
                    category, event_type, entity_name, client_id, source_id, priority,
                    description, status, detected_at, ai_summary, ai_suggested_action,
                    ai_confidence, ai_provider_used, decline_reason
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'New', ?, NULL, NULL, NULL, NULL, NULL)
                """,
                (
                    "Commercial Opportunity", "Potential missed opportunity", gap["name"],
                    client_id, "internal-crosscheck", "Medium", description, now,
                ),
            )
            new_event_id = cur.lastrowid
            conn.commit()

            error = None
            try:
                analysis = provider.analyze(
                    {
                        "category": "Commercial Opportunity",
                        "event_type": "Potential missed opportunity",
                        "entity_name": gap["name"],
                        "source_name": "AI Agent — Internal Cross-Check",
                        "description": description,
                    }
                )
                conn.execute(
                    """
                    UPDATE events SET ai_summary = ?, ai_suggested_action = ?, ai_confidence = ?, ai_provider_used = ?
                    WHERE id = ?
                    """,
                    (analysis["summary"], analysis["suggested_action"], analysis["confidence"], provider.name, new_event_id),
                )
                conn.commit()
            except Exception as exc:
                error = f"{type(exc).__name__}: {exc}"

            new_row = conn.execute("SELECT * FROM events WHERE id = ?", (new_event_id,)).fetchone()
            event = event_row_to_dict(new_row, sources_by_id, clients_by_id)
            event["relation"] = gap["relation"]
            event["jurisdiction"] = gap["jurisdiction"]
            event["error"] = error
            results.append(event)

        return {
            "found": True,
            "clientId": client_id,
            "clientName": client["name"],
            "provider": provider.name,
            "gaps": results,
        }


@app.post("/api/clients/{client_id}/shareholders/convert")
def convert_shareholder_to_prospect(client_id: str, payload: ShareholderConvertIn):
    """Turns a co-shareholder of one of the client's linked entities — someone
    with no client record yet — into a tracked prospect. Creates a new client
    row referencing the shared entity, plus a Commercial Opportunity signal
    run through the active AI provider, so the new prospect arrives with an
    analyzed starting point rather than a blank record."""
    with get_conn() as conn:
        row = conn.execute("SELECT * FROM clients WHERE id = ?", (client_id,)).fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Client not found")
        client = client_row_to_dict(row)

        entity = next((e for e in client["linkedEntities"] if e["name"] == payload.entityName), None)
        if entity is None:
            raise HTTPException(status_code=404, detail="Linked entity not found on this client")
        holder = next(
            (h for h in entity.get("other_shareholders", []) if h["name"] == payload.shareholderName), None
        )
        if holder is None:
            raise HTTPException(status_code=404, detail="Shareholder not found on this entity")

        existing = conn.execute(
            "SELECT id FROM clients WHERE lower(name) = lower(?)", (holder["name"],)
        ).fetchone()
        if existing is not None:
            raise HTTPException(status_code=409, detail=f"{holder['name']} is already a tracked client")

        new_id = re.sub(r"[^a-z0-9]+", "-", holder["name"].lower()).strip("-") or "prospect"
        suffix = 1
        candidate_id = new_id
        while conn.execute("SELECT 1 FROM clients WHERE id = ?", (candidate_id,)).fetchone():
            suffix += 1
            candidate_id = f"{new_id}-{suffix}"
        new_id = candidate_id

        segment = (
            f"{'Individual' if holder['type'] == 'individual' else 'Corporate'} — "
            f"Prospect via {client['name']} shareholder network"
        )
        stake_match = re.search(r"[\d.]+", holder["stake"])
        new_linked_entities = [
            {
                "name": entity["name"],
                "relation": f"Co-shareholder ({holder['stake']}), alongside {client['name']}",
                "jurisdiction": entity["jurisdiction"],
                "client_stake_percent": float(stake_match.group()) if stake_match else None,
            }
        ]
        conn.execute(
            "INSERT INTO clients (id, name, segment, rm_owner, is_prospect, linked_entities) VALUES (?, ?, ?, ?, 1, ?)",
            (new_id, holder["name"], segment, client["rmOwner"], json.dumps(new_linked_entities)),
        )
        conn.commit()

        provider = _get_active_provider(conn)
        description = (
            f"{holder['name']} holds {holder['stake']} of {entity['name']}, alongside existing client "
            f"{client['name']} — surfaced as a new commercial prospect by the internal cross-check agent."
        )
        now = datetime.now(timezone.utc).isoformat()
        cur = conn.execute(
            """
            INSERT INTO events (
                category, event_type, entity_name, client_id, source_id, priority,
                description, status, detected_at, ai_summary, ai_suggested_action,
                ai_confidence, ai_provider_used, decline_reason
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'New', ?, NULL, NULL, NULL, NULL, NULL)
            """,
            (
                "Commercial Opportunity", "New prospect identified via shareholder network", entity["name"],
                new_id, "internal-crosscheck", "Medium", description, now,
            ),
        )
        new_event_id = cur.lastrowid
        conn.commit()

        error = None
        try:
            analysis = provider.analyze(
                {
                    "category": "Commercial Opportunity",
                    "event_type": "New prospect identified via shareholder network",
                    "entity_name": entity["name"],
                    "source_name": "AI Agent — Internal Cross-Check",
                    "description": description,
                }
            )
            conn.execute(
                """
                UPDATE events SET ai_summary = ?, ai_suggested_action = ?, ai_confidence = ?, ai_provider_used = ?
                WHERE id = ?
                """,
                (analysis["summary"], analysis["suggested_action"], analysis["confidence"], provider.name, new_event_id),
            )
            conn.commit()
        except Exception as exc:
            error = f"{type(exc).__name__}: {exc}"

        new_row = conn.execute("SELECT * FROM clients WHERE id = ?", (new_id,)).fetchone()
        new_client = client_row_to_dict(new_row)
        sources_by_id, clients_by_id = _sources_and_clients(conn)
        event_row = conn.execute("SELECT * FROM events WHERE id = ?", (new_event_id,)).fetchone()
        new_client["events"] = [event_row_to_dict(event_row, sources_by_id, clients_by_id)]

        return {
            "client": new_client,
            "provider": provider.name,
            "error": error,
        }


@app.get("/api/ai/status")
def ai_status():
    with get_conn() as conn:
        provider = _get_active_provider(conn)
    return {
        "activeProvider": provider.name,
        "azureFoundryConfigured": provider.name == "Azure AI Foundry",
        "note": (
            "Set AZURE_AI_FOUNDRY_ENDPOINT and AZURE_AI_FOUNDRY_API_KEY as environment "
            "variables to switch from the demo engine to a live Azure AI Foundry model "
            "deployment — no code change required."
        ),
    }


@app.get("/api/ai/config")
def get_ai_config():
    with get_conn() as conn:
        row = _get_ai_config_row(conn)
        if row is None:
            return {"endpoint": "", "deployment": "", "hasApiKey": False}
        return {
            "endpoint": row["endpoint"],
            "deployment": row["deployment"],
            "hasApiKey": bool(row["api_key"]),
        }


@app.put("/api/ai/config")
def update_ai_config(payload: AIConfigIn):
    with get_conn() as conn:
        row = _get_ai_config_row(conn)
        endpoint = payload.endpoint if payload.endpoint is not None else (row["endpoint"] if row else "")
        deployment = payload.deployment if payload.deployment is not None else (row["deployment"] if row else "")
        api_key = payload.apiKey if payload.apiKey else (row["api_key"] if row else "")

        conn.execute(
            """
            INSERT INTO ai_config (id, endpoint, api_key, deployment) VALUES (1, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET endpoint = excluded.endpoint, api_key = excluded.api_key,
                deployment = excluded.deployment
            """,
            (endpoint.strip(), api_key.strip(), deployment.strip()),
        )
        conn.commit()
        return {"endpoint": endpoint.strip(), "deployment": deployment.strip(), "hasApiKey": bool(api_key.strip())}


@app.delete("/api/ai/config")
def clear_ai_config():
    with get_conn() as conn:
        conn.execute("DELETE FROM ai_config WHERE id = 1")
        conn.commit()
    return {"endpoint": "", "deployment": "", "hasApiKey": False}


app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
