"""Commercial monitoring orchestration for the client-facing API."""

from .client import FoundryClient


SYSTEM_PROMPT = """
Tu es un expert en intelligence économique et veille commerciale bancaire.

Pour le client fourni, appelle d'abord consulter_base_interne, puis les outils
externes pertinents (Google, Pappers, BODACC ou Companies House). Appelle
ensuite obligatoirement analyser_conformite_kyc avec le même identifiant.

Rédige une synthèse finale en français, au format Markdown, avec les sections:
1. Constat et signaux business
2. Impacts KYC
3. Recommandations commerciales

N'invente jamais d'information. Si une source échoue, poursuis avec les autres
résultats et signale la source indisponible dans la synthèse.
"""


def generate_veille(client_id: str) -> str:
    client_id = client_id.strip()
    if not client_id:
        raise ValueError("client_id est obligatoire.")

    client = FoundryClient()
    return client.query(
        SYSTEM_PROMPT,
        f"Effectue une veille commerciale complète pour le client dont l'ID est {client_id}.",
    )