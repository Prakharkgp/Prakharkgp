"""Test d'intégration bout-en-bout : tools_calling -> tools_kyc.

Vérifie que les résultats produits par les tools externes de `tools_calling`
(starter) alimentent correctement l'analyse KYC de `tools_kyc`, en croisant les
données internes et en filtrant les champs sensibles. Le test est 100 % hors
ligne : la couche réseau de `tools_calling` est simulée via monkeypatch, et
l'agent Azure OpenAI est remplacé par un runner factice.
"""
import importlib.util
import json
from pathlib import Path

from tools_kyc.analyzer import analyze_client

# `tools_calling/starter/tools.py` est un module « à plat » (sans package) qui
# n'importe que la stdlib : on le charge par chemin de fichier pour l'exercer.
_TOOLS_PATH = Path(__file__).resolve().parents[2] / "tools_calling" / "starter" / "tools.py"
_spec = importlib.util.spec_from_file_location("tools_calling_tools", _TOOLS_PATH)
tools_calling = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(tools_calling)


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


_FAKE_GOOGLE_NEWS_RSS = b"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <item>
      <title>DOMAINE DE CHEZELLES etudie la cession de sa filiale forestiere</title>
      <link>https://news.example/chezelles-cession</link>
      <description>&lt;p&gt;Le groupe etudie une cession de son activite sylviculture.&lt;/p&gt;</description>
      <pubDate>Tue, 14 May 2024 08:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>"""


def test_tools_calling_output_feeds_tools_kyc(monkeypatch):
    # 1. tools_calling : produit un signal business externe, hors ligne.
    monkeypatch.setattr(tools_calling, "urlopen", lambda *a, **k: _FakeHttpResponse(_FAKE_GOOGLE_NEWS_RSS))
    monkeypatch.setenv("GOOGLE_SEARCH_PROVIDER", "google_news")

    raw = tools_calling.execute_tool(
        "search_google_business_events",
        json.dumps({"company_name": "DOMAINE DE CHEZELLES", "max_results": 3}),
    )
    external = json.loads(raw)
    assert external["results"], "tools_calling doit renvoyer au moins un signal"

    # Champ sensible ajouté volontairement pour vérifier le filtrage de tools_kyc.
    external["results"][0]["passportId"] = "NE-DOIT-PAS-FUITER"

    # 2. tools_kyc : agent factice capturant le prompt réellement transmis.
    captured: dict[str, str] = {}

    def _fake_agent(messages):
        captured["prompt"] = messages[-1]["content"]
        return json.dumps(
            {
                "summary": "Signal public de cession detecte pour un client connu.",
                "new_information": [
                    {
                        "description": "Etude de cession d'une filiale forestiere.",
                        "source": "google",
                        "date": "2024-05-14",
                        "is_new": True,
                        "relevance": "high",
                        "confidence": "medium",
                        "evidence": "Article de presse.",
                    }
                ],
                "opportunities": [
                    {
                        "type": "vente_entreprise",
                        "description": "Conseil M&A sur cession et reemploi du produit.",
                        "signal": "sell",
                        "relevance": "high",
                        "confidence": "medium",
                        "evidence": "Article mentionnant l'etude d'une cession.",
                    }
                ],
                "crm_alert": {
                    "should_contact": True,
                    "reason": "Opportunite de conseil sur cession.",
                    "priority": "high",
                },
            }
        )

    result = analyze_client("DOMAINE DE CHEZELLES", external, agent_runner=_fake_agent)

    # 3. Les deux modules ont contribué au résultat final.
    assert result["client_name"] == "DOMAINE DE CHEZELLES"
    assert result["internal_records_found"] >= 1  # tools_kyc : base interne croisée
    assert "cession" in captured["prompt"].lower()  # tools_calling : signal transmis à l'analyse
    assert "NE-DOIT-PAS-FUITER" not in captured["prompt"]  # tools_kyc : champ sensible filtré
    assert result["analysis"]["crm_alert"]["should_contact"] is True
    assert result["analysis"]["opportunities"][0]["signal"] == "sell"


def test_tools_calling_provider_error_still_analyzed(monkeypatch):
    """Si un provider tools_calling échoue, l'erreur structurée reste analysable."""
    monkeypatch.setattr(tools_calling, "urlopen", lambda *a, **k: _FakeHttpResponse(_FAKE_GOOGLE_NEWS_RSS))
    monkeypatch.setenv("GOOGLE_SEARCH_PROVIDER", "google_news")

    google = json.loads(
        tools_calling.execute_tool(
            "search_google_business_events",
            json.dumps({"company_name": "DOMAINE DE CHEZELLES", "max_results": 2}),
        )
    )
    # Companies House sans clé d'API : renvoie une erreur structurée (comportement client.py).
    monkeypatch.delenv("COMPANIES_HOUSE_API_KEY", raising=False)
    try:
        tools_calling.execute_tool(
            "search_companies_house_company",
            json.dumps({"query": "DOMAINE DE CHEZELLES", "max_results": 2}),
        )
        companies_house = {}
    except RuntimeError as error:
        companies_house = {"error": str(error)}

    api_results = {"google": google, "companies_house": companies_house}

    def _fake_agent(_messages):
        return json.dumps(
            {
                "summary": "Analyse partielle : un provider indisponible.",
                "new_information": [],
                "opportunities": [],
                "crm_alert": {"should_contact": False, "reason": "", "priority": "low"},
            }
        )

    result = analyze_client("DOMAINE DE CHEZELLES", api_results, agent_runner=_fake_agent)
    assert result["internal_records_found"] >= 1
    assert "crm_alert" in result["analysis"]
