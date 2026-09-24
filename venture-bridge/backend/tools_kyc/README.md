# tools_kyc

Module d'analyse KYC de veille commerciale. Il croise les **données internes**
du client (aujourd'hui `data/test_*.json`, demain les *Containers* Azure Blob)
avec le **résultat des API externes** produit par `tools_calling` (Google,
Pappers, BODACC, Companies House), puis appelle l'**Agent Lifecycle Management**
(déploiement Azure OpenAI) pour produire une analyse structurée.

Ce module est autonome et ne modifie pas `tools_calling`.

## Utilisation

```python
from tools_kyc import analyze_client

result = analyze_client(
    client_name="DOMAINE DE CHEZELLES",
    api_results=resultat_de_tools_calling,  # dict/list renvoyé par les APIs
)
```

## Sortie

| Champ | Description |
|-------|-------------|
| `client_name` | Nom recherché |
| `internal_records_found` | Nombre d'enregistrements internes trouvés |
| `internal_records` | Champs commerciaux internes (sans données sensibles) |
| `analysis.summary` | Résumé français |
| `analysis.new_information[]` | Faits absents de la base interne (`is_new`, `relevance`) |
| `analysis.opportunities[]` | Signaux `buy`/`sell` (achat/vente d'entreprise, immobilier…) fondés sur preuve |
| `analysis.crm_alert` | `should_contact`, `reason`, `priority` pour alerter le CRM |

## Configuration

```env
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_ENDPOINT=...
AZURE_OPENAI_DEPLOYMENT_NAME=...
```

## Confidentialité

Identité, fiscalité, AML, patrimoine et coordonnées ne sont **jamais** transmis
à l'agent : seuls les champs commerciaux internes le sont, et les résultats
externes sont filtrés (`_strip_sensitive`).

## Tests

Les tests sont **hors ligne** : l'agent Azure OpenAI et la couche réseau de
`tools_calling` sont simulés. Lance-les depuis le dossier `backend/` :

```powershell
cd venture-bridge/backend
py -3.12 -m pip install pytest
py -3.12 -m pytest tools_kyc/tests
```

Suite :

| Fichier | Couverture |
|---------|------------|
| `tests/test_analyzer.py` | Recherche interne (`store`), filtrage sensible, garde-fous de `analyze_client` |
| `tests/test_integration_tools_calling_kyc.py` | **Intégration bout-en-bout** : la sortie des tools de `tools_calling` (starter) alimente l'analyse KYC |

### Test d'intégration `tools_calling` ↔ `tools_kyc`

`test_integration_tools_calling_kyc.py` valide le pipeline complet sans clé d'API :

1. `tools_calling.execute_tool("search_google_business_events", ...)` produit un
   signal business (réseau simulé via monkeypatch).
2. Ce résultat est passé à `analyze_client(...)` comme `api_results`.
3. On vérifie que la base interne est croisée, que le signal externe atteint le
   prompt de l'agent et que les champs sensibles sont bien filtrés.

Pour ne lancer que ce test :

```powershell
cd venture-bridge/backend
py -3.12 -m pytest tools_kyc/tests/test_integration_tools_calling_kyc.py -v
```
