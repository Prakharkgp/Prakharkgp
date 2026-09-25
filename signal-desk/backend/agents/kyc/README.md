# Module KYC des agents

Module d'analyse des **impacts KYC**. Il croise les **données internes** du
client (aujourd'hui `agents/bdd/test_*.json`, demain les *Containers* Azure Blob) avec
le **résultat des API externes** produit par `agents.tools` (Google, Pappers,
BODACC, Companies House), puis appelle l'**Agent Lifecycle Management**
(déploiement Azure OpenAI) pour évaluer la cohérence d'identité, détecter les
écarts KYC et signaler les revues AML/PEP nécessaires.

Le module cible les impacts KYC (contrôle d'identité, homonymies, deltas de
registre, réévaluation AML), et non les opportunités commerciales. Il est intégré
à l'orchestrateur du package `agents`.

## Utilisation

```python
from agents.kyc import analyze_client

result = analyze_client(
    client_name="DOMAINE DE CHEZELLES",
    api_results=resultat_des_tools,  # dict/list renvoyé par les APIs
)
```

## Sortie

| Champ | Description |
|-------|-------------|
| `client_name` | Nom recherché |
| `internal_records_found` | Nombre d'enregistrements internes trouvés |
| `internal_records` | Champs commerciaux internes (sans données sensibles) |
| `analysis.summary` | Résumé français des impacts KYC |
| `analysis.identity_check` | Cohérence d'identité interne/externe : `status`, identités comparées, `discrepancies`, `homonymy_risk` |
| `analysis.kyc_deltas[]` | Écarts par champ (`field`, `internal_value`, `external_value`, `status`, `action`, `severity`) fondés sur preuve |
| `analysis.aml_assessment` | `current_risk`, `pep_status`, `reassessment_required`, `reason` |
| `analysis.kyc_alert` | `should_review`, `reason`, `priority` pour déclencher une revue KYC |

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

Les tests sont **hors ligne** : l'agent Azure OpenAI et la couche réseau des
tools externes sont simulés. Lance-les depuis le dossier `backend/` :

```powershell
cd venture-bridge/backend
py -3.12 -m pip install pytest
py -3.12 -m pytest agents/kyc/tests
```

Suite :

| Fichier | Couverture |
|---------|------------|
| `tests/test_analyzer.py` | Recherche interne (`store`), filtrage sensible, garde-fous de `analyze_client` |
| `tests/test_integration_agents_kyc.py` | **Intégration bout-en-bout** : la sortie des tools de `agents.tools` alimente l'analyse KYC |

### Test d'intégration tools externes ↔ KYC

`test_integration_agents_kyc.py` valide le pipeline complet sans clé d'API :

1. `agents.tools.execute_tool("search_google_business_events", ...)` produit un
   signal business (réseau simulé via monkeypatch).
2. Ce résultat est passé à `analyze_client(...)` comme `api_results`.
3. On vérifie que la base interne est croisée, que le signal externe atteint le
   prompt de l'agent et que les champs sensibles sont bien filtrés.

Pour ne lancer que ce test :

```powershell
cd venture-bridge/backend
py -3.12 -m pytest agents/kyc/tests/test_integration_agents_kyc.py -v
```
