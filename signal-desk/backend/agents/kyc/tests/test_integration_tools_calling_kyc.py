"""Test d'intégration bout-en-bout : tools externes -> analyse KYC.

Vérifie que les résultats produits par les tools externes de `agents.tools`
alimentent l'analyse des impacts KYC de `agents.kyc` : croisement avec
la base interne, détection d'écart d'identité / homonymie, et filtrage des champs
sensibles. Le test est 100 % hors ligne : la couche réseau des tools est
simulée via monkeypatch, et l'agent Azure OpenAI est remplacé par un runner
factice.
"""
import json
from urllib.request import Request

from agents import tools as agent_tools
from agents.kyc.analyzer import analyze_client


class _FakeHttpResponse:
    """Réponse HTTP factice utilisable comme context manager."""

    def __init__(self, payload: bytes):
        self._payload = payload

    def __enter__(self):
        return self

    def __exit__(self, *_):
        return False

    def read(self):
        return self._payload


# Registre officiel simulé : une entité HOMONYME (SIREN et forme juridique
# distincts de l'entité interne DOMAINE DE CHEZELLES / EI).
_FAKE_PAPPERS_JSON = json.dumps(
    {
        "resultats": [
            {
                "nom_entreprise": "DOMAINE APICOLE DE CHEZELLES",
                "denomination": "DOMAINE APICOLE DE CHEZELLES",
                "siren": "775193071",
                "siege": {"siret": "77519307100013", "ville": "Chezelles", "code_postal": "36500"},
                "forme_juridique": "SASU",
                "date_creation": "1973-01-01",
                "code_naf": "01.49Z",
                "libelle_code_naf": "Elevage d'autres animaux",
                "dirigeants": [],
            }
        ]
    }
).encode()


def _fake_urlopen(target, *_args, **_kwargs):
    """Répartit la réponse simulée selon l'URL appelée par les tools externes."""
    url = target.full_url if isinstance(target, Request) else str(target)
    if "pappers" in url:
        return _FakeHttpResponse(_FAKE_PAPPERS_JSON)
    return _FakeHttpResponse(b"{}")


def test_external_identity_feeds_kyc(monkeypatch):
    # 1. agents.tools récupère l'identité registre externe, hors ligne.
    monkeypatch.setattr(agent_tools, "urlopen", _fake_urlopen)
    monkeypatch.setenv("PAPPERS_API_TOKEN", "token-de-test")

    raw = agent_tools.execute_tool(
        "search_pappers_company",
        json.dumps({"query": "DOMAINE DE CHEZELLES", "max_results": 3}),
    )
    external = json.loads(raw)
    assert external["results"], "Le tool Pappers doit renvoyer au moins une entité"
    assert external["results"][0]["siren"] == "775193071"

    # Champ sensible ajouté volontairement pour vérifier le filtrage du module KYC.
    external["results"][0]["dirigeantEmail"] = "NE-DOIT-PAS-FUITER"

    # 2. KYC : agent factice capturant le prompt réellement transmis.
    captured: dict[str, str] = {}

    def _fake_agent(messages):
        captured["prompt"] = messages[-1]["content"]
        return json.dumps(
            {
                "summary": "Homonymie detectee : entite externe de registre distinct.",
                "identity_check": {
                    "status": "incoherent",
                    "internal_identity": {
                        "name": "DOMAINE DE CHEZELLES",
                        "legal_form": "EI",
                        "siren": None,
                    },
                    "external_identity": {
                        "name": "DOMAINE APICOLE DE CHEZELLES",
                        "legal_form": "SASU",
                        "siren": "775193071",
                    },
                    "discrepancies": ["nom", "forme_juridique", "siren"],
                    "homonymy_risk": "high",
                    "evidence": "Pappers renvoie SIREN 775193071, forme SASU.",
                },
                "kyc_deltas": [
                    {
                        "field": "forme_juridique",
                        "internal_value": "EI",
                        "external_value": "SASU",
                        "status": "conflicting",
                        "action": "a_corriger",
                        "severity": "high",
                        "evidence": "Ecart EI vs SASU.",
                    }
                ],
                "aml_assessment": {
                    "current_risk": "high",
                    "pep_status": "PEP",
                    "reassessment_required": True,
                    "reason": "Homonymie et profil PEP High.",
                },
                "kyc_alert": {
                    "should_review": True,
                    "reason": "Lever l'ambiguite d'identite avant toute action.",
                    "priority": "high",
                },
            }
        )

    result = analyze_client("DOMAINE DE CHEZELLES", external, agent_runner=_fake_agent)

    # 3. Les deux modules ont contribué au résultat final.
    assert result["client_name"] == "DOMAINE DE CHEZELLES"
    assert result["internal_records_found"] >= 1  # base interne croisée
    assert "775193071" in captured["prompt"]  # identité registre transmise
    assert "SASU" in captured["prompt"]  # forme juridique externe transmise
    assert "NE-DOIT-PAS-FUITER" not in captured["prompt"]  # champ sensible filtré
    assert result["analysis"]["identity_check"]["status"] == "incoherent"
    assert result["analysis"]["kyc_alert"]["should_review"] is True
    assert result["analysis"]["kyc_deltas"][0]["severity"] == "high"


def test_external_provider_error_still_analyzed(monkeypatch):
    """Si un provider externe échoue, l'erreur structurée reste analysable."""
    monkeypatch.setattr(agent_tools, "urlopen", _fake_urlopen)
    monkeypatch.setenv("PAPPERS_API_TOKEN", "token-de-test")

    pappers = json.loads(
        agent_tools.execute_tool(
            "search_pappers_company",
            json.dumps({"query": "DOMAINE DE CHEZELLES", "max_results": 2}),
        )
    )
    # Companies House sans clé d'API : renvoie une erreur structurée (comportement client.py).
    monkeypatch.delenv("COMPANIES_HOUSE_API_KEY", raising=False)
    try:
        agent_tools.execute_tool(
            "search_companies_house_company",
            json.dumps({"query": "DOMAINE DE CHEZELLES", "max_results": 2}),
        )
        companies_house = {}
    except RuntimeError as error:
        companies_house = {"error": str(error)}

    api_results = {"pappers": pappers, "companies_house": companies_house}

    def _fake_agent(_messages):
        return json.dumps(
            {
                "summary": "Analyse partielle : un provider indisponible.",
                "identity_check": {
                    "status": "a_verifier",
                    "internal_identity": {"name": None, "legal_form": None, "siren": None},
                    "external_identity": {"name": None, "legal_form": None, "siren": None},
                    "discrepancies": [],
                    "homonymy_risk": "low",
                    "evidence": "",
                },
                "kyc_deltas": [],
                "aml_assessment": {
                    "current_risk": "unknown",
                    "pep_status": "unknown",
                    "reassessment_required": False,
                    "reason": "",
                },
                "kyc_alert": {"should_review": False, "reason": "", "priority": "low"},
            }
        )

    result = analyze_client("DOMAINE DE CHEZELLES", api_results, agent_runner=_fake_agent)
    assert result["internal_records_found"] >= 1
    assert "kyc_alert" in result["analysis"]
    assert "identity_check" in result["analysis"]
