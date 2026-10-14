"""Local retrieval over the structured SGPB knowledge-base files."""

import json
import math
import re
import unicodedata
from collections import Counter, defaultdict
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple


DATA_FILES = ("lux.json", "monaco.json", "paris.json")
MAX_RETRIEVED_ENTRIES = 15
MAX_ENTRIES_PER_ENTITY = 6
MIN_RELATIVE_SCORE = 0.30

FIELD_WEIGHTS = {
    "title": 6,
    "summary": 3,
    "product_type": 1,
    "target_client_types": 2,
    "relevant_context": 4,
    "detection_signals": 5,
    "triggers": 5,
    "constraints": 1,
    "blockers": 1,
    "questions_to_qualify": 2,
    "required_data": 2,
}

STOP_WORDS = {
    "avec", "avoir", "client", "dans", "des", "elle", "entre", "est", "etre",
    "pour", "plus", "sans", "ses", "son", "sur", "une", "the", "and", "from",
    "that", "this", "les", "leur", "leurs", "aux", "par", "pas", "qui", "que",
    "du", "de", "la", "le", "un", "au", "ou", "en", "se", "sa", "si", "a",
    "banque", "bancaire", "besoin", "conseil", "information", "interne", "nouveau",
    "nouvelle", "operation", "potentiel", "produit", "relation", "sgpb",
}


def retrieve_relevant_knowledge(
    kyc_delta: Dict[str, Any],
    new_information_summary: Optional[Dict[str, Any]] = None,
    commercial_signals: Optional[Any] = None,
    max_entries: int = MAX_RETRIEVED_ENTRIES,
) -> Dict[str, Any]:
    """Return a compact subset of KB entries relevant to the supplied KYC delta."""
    entries, weighted_documents, document_frequency = _load_index()
    query = _build_query(kyc_delta, new_information_summary, commercial_signals)
    if not query:
        return _retrieval_payload([], "available_no_match")

    corpus_size = len(entries)
    scored_entries = []
    for index, document in enumerate(weighted_documents):
        score = 0.0
        for token, query_weight in query.items():
            document_weight = document.get(token)
            if not document_weight:
                continue
            frequency = document_frequency[token]
            inverse_document_frequency = math.log((corpus_size + 1) / (frequency + 1)) + 1
            score += min(query_weight, 12) * document_weight * inverse_document_frequency

        if score > 0:
            scored_entries.append((score, index))

    scored_entries.sort(reverse=True)
    selected = []
    entity_counts = defaultdict(int)
    minimum_score = scored_entries[0][0] * MIN_RELATIVE_SCORE if scored_entries else 0
    for score, index in scored_entries:
        if score < minimum_score:
            break
        entry = entries[index]
        entity = entry.get("bank_entity", "unknown")
        if entity_counts[entity] >= MAX_ENTRIES_PER_ENTITY:
            continue

        selected_entry = dict(entry)
        selected_entry["retrieval_score"] = round(score, 2)
        selected.append(selected_entry)
        entity_counts[entity] += 1
        if len(selected) >= max_entries:
            break

    status = "local_retrieved" if selected else "available_no_match"
    return _retrieval_payload(selected, status)


def _retrieval_payload(entries: List[Dict[str, Any]], status: str) -> Dict[str, Any]:
    return {
        "status": status,
        "retrieval_method": "local_weighted_lexical",
        "source_files": list(DATA_FILES),
        "entry_count": len(entries),
        "entries": entries,
    }


@lru_cache(maxsize=1)
def _load_index() -> Tuple[
    Tuple[Dict[str, Any], ...],
    Tuple[Counter, ...],
    Counter,
]:
    data_directory = Path(__file__).resolve().parent.parent / "data"
    entries: List[Dict[str, Any]] = []
    weighted_documents: List[Counter] = []
    document_frequency: Counter = Counter()

    for filename in DATA_FILES:
        path = data_directory / filename
        with path.open(encoding="utf-8") as data_file:
            content = json.load(data_file)
        if not isinstance(content, list):
            raise ValueError(f"Knowledge-base file {filename} must contain a JSON array.")

        for raw_entry in content:
            if not isinstance(raw_entry, dict):
                raise ValueError(f"Knowledge-base file {filename} contains a non-object entry.")
            if not raw_entry.get("kb_entry_id") or not raw_entry.get("bank_entity"):
                raise ValueError(f"Knowledge-base entry in {filename} lacks an ID or bank entity.")

            entry = dict(raw_entry)
            entry["source_file"] = filename
            document = _weighted_document(entry)
            entries.append(entry)
            weighted_documents.append(document)
            document_frequency.update(document.keys())

    return tuple(entries), tuple(weighted_documents), document_frequency


def _weighted_document(entry: Dict[str, Any]) -> Counter:
    weighted_tokens: Counter = Counter()
    for field_name, weight in FIELD_WEIGHTS.items():
        tokens = set(_tokenize(" ".join(_iter_strings(entry.get(field_name)))))
        for token in tokens:
            weighted_tokens[token] += weight
    return weighted_tokens


def _build_query(
    kyc_delta: Dict[str, Any],
    new_information_summary: Optional[Dict[str, Any]],
    commercial_signals: Optional[Any] = None,
) -> Counter:
    query: Counter = Counter()

    def add(value: Any, weight: int) -> None:
        for token in _tokenize(" ".join(_iter_strings(value))):
            query[token] += weight

    analysis = kyc_delta.get("analysis")
    if isinstance(analysis, dict):
        add(analysis.get("new_information"), 10)
        add(analysis.get("opportunities"), 12)
        add(analysis.get("summary"), 4)
        add(analysis.get("crm_alert"), 2)
        # Current KYC output contract used by agents/kyc. Keep the future
        # new_information contract above, but retrieve useful knowledge for the
        # payload that is produced by the merged orchestrator today as well.
        add(analysis.get("kyc_deltas"), 2)
        add(analysis.get("identity_check"), 1)
        add(analysis.get("aml_assessment"), 1)
        add(analysis.get("kyc_alert"), 1)

    for key, value in kyc_delta.items():
        normalized_key = _normalize(str(key))
        if any(marker in normalized_key for marker in ("change", "delta", "difference")):
            add(value, 5)

    internal_records = kyc_delta.get("internal_records")
    if isinstance(internal_records, list):
        contextual_fields = (
            "client_type", "status", "legal_form", "country", "business_activity",
            "bank_services", "bank_products", "commercial",
        )
        for record in internal_records:
            if isinstance(record, dict):
                add({key: record.get(key) for key in contextual_fields}, 1)
    add(new_information_summary, 8)
    add(commercial_signals, 14)
    return query


def _iter_strings(value: Any) -> Iterable[str]:
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for key, nested_value in value.items():
            yield str(key)
            yield from _iter_strings(nested_value)
    elif isinstance(value, Sequence) and not isinstance(value, (str, bytes)):
        for item in value:
            yield from _iter_strings(item)


def _tokenize(text: str) -> List[str]:
    normalized = _normalize(text)
    return [
        token
        for token in re.findall(r"[a-z0-9][a-z0-9_-]+", normalized)
        if token not in STOP_WORDS and len(token) > 2
    ]


def _normalize(text: str) -> str:
    decomposed = unicodedata.normalize("NFKD", text)
    return "".join(character for character in decomposed if not unicodedata.combining(character)).lower()
