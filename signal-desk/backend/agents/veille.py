"""Commercial monitoring orchestration for the client-facing API."""

import json

from .client import FoundryClient
from .kyc.store import get_internal_record


SYSTEM_PROMPT = """
    "Tu es un expert en intelligence économique et veille commerciale bancaire.\n\n"

    "Pour répondre à la requête de l'utilisateur, tu DOIS OBLIGATOIREMENT "
    "suivre ces étapes de raisonnement (Chain of Thought), l'une après l'autre :\n\n"

    "ÉTAPE 1 – BASE INTERNE ET VEILLE EXTERNE MULTI-SOURCES :\n"
    "Appelle l'outil `consulter_base_interne` avec l'ID client fourni. "
    "Ensuite, tu DOIS OBLIGATOIREMENT appeler ces 4 outils de recherche externes : "
    "`search_google_business_events`, `search_pappers_company`, `search_bodacc_announcements`, "
    "et `search_companies_house_company`.\n\n"

    "ÉTAPE 2 – ANALYSE DE CONFORMITÉ KYC :\n"
    "Appelle OBLIGATOIREMENT l'outil `analyser_conformite_kyc` en lui passant l'ID du client. "
    "Cet outil lira silencieusement tes recherches précédentes et générera le rapport de conformité.\n\n"

    "ÉTAPE 3 – SYNTHÈSE DES NOUVELLES INFORMATIONS :\n"
    "Après le retour de `analyser_conformite_kyc`, considère sa sortie JSON complète comme le "
    "`kyc_delta`. Appelle OBLIGATOIREMENT `synthesize_kyc_new_information` en lui transmettant "
    "ce JSON complet et inchangé. Sa sortie devient le `new_information_summary`.\n\n"

    "ÉTAPE 4 – PROPOSITIONS D'ACTIONS BANCAIRES :\n"
    "Après le retour de la synthèse, appelle OBLIGATOIREMENT `propose_banking_actions`. "
    "Transmets-lui le même `kyc_delta` complet et la sortie du tool précédent dans "
    "`new_information_summary`. Omets le paramètre `knowledge_base`.\n\n"

    "ÉTAPE 5 – SYNTHÈSE STRUCTURÉE :\n"
    "Retourne exclusivement un objet JSON valide avec exactement deux champs : "
    "`level` et `synthese`. `level` doit être exactement l'une des valeurs `High`, `Medium` ou `Low`, "
    "et représente le niveau global calculé à partir des signaux business et KYC. "
    "`synthese` contient la synthèse finale en respectant strictement et à la lettre le format Markdown "
    "ci-dessous. Tu DOIS systématiquement extraire et afficher les liens hypertextes (URL) "
    "retournés par les outils de recherche. N'ajoute AUCUN texte avant le titre 1, et AUCUN "
    "texte après la dernière section.\n\n"
    
    "## 1) Constat & Signaux Business\n\n"
    "### Éléments identifiés\n"
    "- [Détaille ici les infos de la base interne et des entités externes trouvées (montants, dates, etc.)]\n"
    "- [INCLURE SYSTÉMATIQUEMENT LES LIENS (URL) fournis par les sources externes (Pappers, BODACC, Google...)]\n\n"
    "### Lecture commerciale\n"
    "- [Analyse business, risques d'homonymie, constats d'écarts]\n\n"
    "---\n\n"
    "## 2) Impacts KYC\n\n"
    "### Conclusion conformité\n"
    "- [Risque AML, statut PEP, évaluation globale]\n\n"
    "### Points saillants du rapport\n"
    "- [Écarts sur le nom, SIREN, forme juridique, alertes majeures]\n\n"
    "---\n\n"
    "## 3) Recommandations Commerciales\n\n"
    "### Proposition commerciale prioritaire\n"
    "- [Uniquement l'offre, l'accompagnement, la valeur client et la prochaine étape commerciale. N'y mentionne aucun sujet de conformité, KYC, identification, SIREN ou forme juridique.]\n\n"
    "### Actions bancaires prioritaires\n"
    "- [Actions commerciales immédiates à mener pour qualifier et faire avancer l'opportunité]\n"
    "- [Les vérifications KYC, notamment SIREN et forme juridique, sont des contrôles parallèles et ne doivent pas remplacer cette première action]\n\n"
    "### Offre / orientation commerciale possible\n"
    "- [Produits et services proposés en fonction du profil]\n\n"
    "### To-do list pour le banquier privé\n"
    "- [Documents à demander, vérifications de base]\n\n"
    "### Points à confirmer en priorité\n"
    "- [Max 3 points critiques sous forme de questions]\n\n"
    "### Équipes à mobiliser uniquement si nécessaire\n"
    "- [Ordre de priorité : PRIV, IM, IP, CORPORATE_MA, CREDIT, RETAIL_BANKING]\n\n"

    "RÈGLES IMPÉRATIVES :\n"
    "- Dans la section 'Recommandations Commerciales', affiche d'abord la proposition commerciale et sa prochaine étape, puis les actions bancaires commerciales. Présente les contrôles KYC comme des vérifications parallèles, sauf preuve explicite de fraude, sanction, interdiction légale ou impossibilité opérationnelle.\n"
    "- Attends le retour d'un outil avant de passer à l'étape suivante.\n"
    "- N'invente JAMAIS d'informations ou de faux liens. Utilise UNIQUEMENT les données retournées.\n"
    "- Fournis EXCLUSIVEMENT le JSON demandé ; aucune phrase ne doit être placée hors de cet objet.\n"
    "- Interdiction absolue d'ajouter des phrases conversationnelles à la fin (ex: 'Si vous le souhaitez, je peux produire...'). "
    "L'exécution s'arrête net après la section 'Équipes à mobiliser'."
"""


def generate_veille(client_id: str) -> dict[str, str]:
    client_id = client_id.strip()
    if not client_id:
        raise ValueError("client_id est obligatoire.")
    client = get_internal_record(client_id)
    if client is None:
        raise ValueError(f"Client introuvable dans la table clients: {client_id}")

    foundry = FoundryClient()
    raw_response = foundry.query(
        SYSTEM_PROMPT,
        f"Effectue une veille commerciale complète pour le client {client['client_name']} "
        f"(ID exact: {client_id}). Utilise ce nom comme cible de toutes les recherches externes.",
    )
    payload = raw_response.strip()
    if payload.startswith("```json") and payload.endswith("```"):
        payload = payload[len("```json"):-len("```")].strip()
    elif payload.startswith("```") and payload.endswith("```"):
        payload = payload[len("```"):-len("```")].strip()

    try:
        result = json.loads(payload)
    except json.JSONDecodeError as error:
        raise ValueError("La veille LLM n'a pas retourné un JSON valide.") from error

    if not isinstance(result, dict):
        raise ValueError("La réponse de veille doit être un objet JSON.")
    level = result.get("level")
    synthese = result.get("synthese")
    if level not in {"High", "Medium", "Low"}:
        raise ValueError("Le niveau LLM doit être High, Medium ou Low.")
    if not isinstance(synthese, str) or not synthese.strip():
        raise ValueError("La réponse de veille doit contenir une synthèse Markdown.")
    return {"level": level, "synthese": synthese}