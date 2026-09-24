"""Accès aux données internes (fichiers data/test_*.json aujourd'hui, Containers Azure Blob demain)."""
import json
import re
from pathlib import Path
from typing import Any

DATA_DIRECTORY = Path(__file__).resolve().parents[1] / "data"

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


def _load_json(path: Path) -> dict[str, Any]:
    # Certains fichiers de test ont un bloc de commentaire /* ... */ en tête.
    raw = re.sub(r"^\s*/\*.*?\*/\s*", "", path.read_text(encoding="utf-8"), flags=re.DOTALL)
    return json.loads(raw)


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


def _extract_person_record(person: dict[str, Any], source: str) -> dict[str, Any] | None:
    identification = person.get("identification", {}) or {}
    entity_id = identification.get("personKey")
    entity_name = identification.get("fullName")
    if not entity_id or not entity_name:
        return None

    commercial = person.get("commercial", {}) or {}
    business_activity = person.get("businessActivity", {}) or {}

    return {
        "source_file": source,
        "record_kind": "person",
        "client_id": entity_id,
        "client_name": entity_name,
        "last_name": identification.get("lastName"),
        "first_name": identification.get("firstName"),
        "client_type": identification.get("personTypeValue"),
        "status": identification.get("personStatusValue"),
        "legal_form": identification.get("legalFormValue"),
        "country": identification.get("countryOfDomicileValue"),
        "business_activity": business_activity.get("businessActivity13Value")
        or business_activity.get("businessActivityDetails"),
        "commercial": {key: commercial.get(key) for key in _COMMERCIAL_KEYS if commercial.get(key)},
        "bank_services": [item.get("serviceValue") for item in commercial.get("bankServices", [])],
        "bank_products": [item.get("productValue") for item in commercial.get("bankProducts", [])],
    }


def _extract_bp_record(bp_data: dict[str, Any], source: str) -> dict[str, Any] | None:
    details = bp_data.get("bpDetails", {}) or {}
    entity_id = details.get("bpKey")
    entity_name = details.get("bpFullName") or details.get("bpName")
    if not entity_id or not entity_name:
        return None

    return {
        "source_file": source,
        "record_kind": "business_partner",
        "client_id": entity_id,
        "client_name": entity_name,
        "last_name": None,
        "first_name": None,
        "client_type": details.get("bpPersonTypeValue"),
        "status": details.get("clientCommercialStatusValue"),
        "legal_form": None,
        "country": details.get("countryOfDomicileValue"),
        "business_activity": None,
        "commercial": {},
        "bank_services": [],
        "bank_products": [],
        "relationship_manager": details.get("crmName"),
    }


def _extract_record(document: dict[str, Any], source: str) -> dict[str, Any] | None:
    result = document.get("result", {}) or {}
    if result.get("personData"):
        return _extract_person_record(result["personData"], source)
    if result.get("bpData"):
        return _extract_bp_record(result["bpData"], source)
    return None


def search_internal_records(client_name: str) -> list[dict[str, Any]]:
    """Retourne les enregistrements internes dont le nom correspond (complet, nom ou prénom)."""
    if not client_name or not client_name.strip():
        return []

    matches: list[dict[str, Any]] = []
    for path in sorted(DATA_DIRECTORY.glob("test_*.json")):
        record = _extract_record(_load_json(path), path.name)
        if not record:
            continue
        candidate_names = [
            record["client_name"],
            record.get("last_name"),
            record.get("first_name"),
            " ".join(filter(None, [record.get("first_name"), record.get("last_name")])),
        ]
        if _name_matches(client_name, candidate_names):
            matches.append(record)
    return matches
