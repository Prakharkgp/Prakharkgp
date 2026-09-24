import json

import pytest

from tools_kyc.agent import AgentCallError
from tools_kyc.analyzer import _strip_sensitive, analyze_client
from tools_kyc.store import search_internal_records


def _fake_agent(_messages):
    return json.dumps(
        {
            "summary": "ok",
            "new_information": [],
            "opportunities": [],
            "crm_alert": {"should_contact": False, "reason": "", "priority": "low"},
        }
    )


def test_search_finds_legal_person_by_name():
    records = search_internal_records("DOMAINE DE CHEZELLES")
    assert any(r["client_id"] == "301238697" for r in records)


def test_search_finds_natural_person_by_last_name():
    records = search_internal_records("Hernaez")
    assert any(r["client_id"] == "301238693" for r in records)


def test_search_does_not_leak_sensitive_fields():
    records = search_internal_records("Hernaez")
    dumped = json.dumps(records)
    for leaked in ("passportId", "nationalInsuranceNumber", "birthDate", "taxResidence"):
        assert leaked not in dumped


def test_search_unknown_returns_empty():
    assert search_internal_records("Client Inexistant XYZ") == []


def test_analyze_client_requires_name():
    with pytest.raises(ValueError):
        analyze_client("  ", {}, agent_runner=_fake_agent)


def test_analyze_client_returns_structured_result():
    result = analyze_client(
        "DOMAINE DE CHEZELLES",
        {"google": [{"title": "Rachat en cours"}]},
        agent_runner=_fake_agent,
    )
    assert result["client_name"] == "DOMAINE DE CHEZELLES"
    assert result["internal_records_found"] >= 1
    assert "crm_alert" in result["analysis"]


def test_strip_sensitive_removes_personal_fields():
    cleaned = _strip_sensitive({"title": "ok", "passportId": "123", "taxNumber": "9"})
    assert cleaned == {"title": "ok"}


def test_analyze_client_rejects_non_json_agent_output():
    with pytest.raises(AgentCallError):
        analyze_client("DOMAINE DE CHEZELLES", {}, agent_runner=lambda _m: "pas du json")
