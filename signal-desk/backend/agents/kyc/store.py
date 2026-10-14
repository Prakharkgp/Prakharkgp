"""Accès aux clients stockés dans la base SQLite de l'application."""
import json
import sqlite3
import re
from pathlib import Path
from typing import Any

DB_PATH = Path(__file__).resolve().parents[2] / "signal_desk.db"

# Champs commerciaux autorisés à être transmis au modèle.
_COMMERCIAL_KEYS = (
    "productsAndServicesDetails",
    "potentialOtherBusinessLines",
    "relationOtherBusinessLines",
    "expectedAssets1YearValue",
    "otherBanksRelations",
    "prospectConversionDate",
)

# Titres à ignorer lors de la comparaison de nom.
_TITLES = ("madame", "monsieur", "mr", "mrs", "mme", "m", "ms")


def _normalise(value: str | None) -> str:
    if not value:
        return ""
    tokens = [tok for tok in re.split(r"\s+", value.lower().strip()) if tok not in _TITLES]
    return " ".join(tokens)


def _name_matches(target: str, candidate_names: list[str | None]) -> bool:
    target = _normalise(target)
    if not target:
        return False
    for name in candidate_names:
        candidate = _normalise(name)
        if candidate and (target in candidate or candidate in target):
            return True
    return False


def _client_row_to_record(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "source_file": "clients",
        "record_kind": "client",
        "client_id": row["id"],
        "client_name": row["name"],
        "last_name": None,
        "first_name": None,
        "client_type": row["segment"],
        "status": "Prospect" if row["is_prospect"] else "Client",
        "legal_form": None,
        "country": None,
        "business_activity": None,
        "commercial": {},
        "bank_services": [],
        "bank_products": [],
        "relationship_manager": row["rm_owner"],
        "linked_entities": json.loads(row["linked_entities"]),
    }


def list_internal_records() -> list[dict[str, Any]]:
    """Return all sanitized clients directly from the application database."""
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("SELECT * FROM clients ORDER BY name").fetchall()
    return [_client_row_to_record(row) for row in rows]


def get_internal_record(client_id: str) -> dict[str, Any] | None:
    """Return one sanitized client directly from the application database."""
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        row = conn.execute("SELECT * FROM clients WHERE id = ?", (client_id,)).fetchone()
    return _client_row_to_record(row) if row else None


def search_internal_records(client_name: str) -> list[dict[str, Any]]:
    """Retourne les enregistrements internes dont le nom correspond (complet, nom ou prénom)."""
    if not client_name or not client_name.strip():
        return []

    matches: list[dict[str, Any]] = []
    for record in list_internal_records():
        candidate_names = [
            record["client_name"],
            record["client_id"],
            record.get("last_name"),
            record.get("first_name"),
            " ".join(filter(None, [record.get("first_name"), record.get("last_name")])),
        ]
        if _name_matches(client_name, candidate_names):
            matches.append(record)
    return matches
