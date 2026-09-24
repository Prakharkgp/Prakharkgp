from agents.client import FoundryClient


def main() -> None:
    client = FoundryClient()

    # --- Saisie interactive de l'ID client ---
    client_id = input("Veuillez entrer l'ID du client à analyser : ")

    system_prompt = (
        "Tu es un expert en intelligence économique et veille commerciale bancaire.\n\n"

        "Pour répondre à la requête de l'utilisateur, tu DOIS OBLIGATOIREMENT "
        "suivre ces étapes de raisonnement (Chain of Thought), l'une après l'autre :\n\n"

        "ÉTAPE 1 – BASE INTERNE ET VEILLE EXTERNE MULTI-SOURCES :\n"
        "Appelle l'outil `consulter_base_interne` avec l'ID client fourni par l'utilisateur. "
        "Ensuite, appelle les outils externes pertinents (Google, Pappers, BODACC, etc.).\n\n"

        "ÉTAPE 2 – ANALYSE DE CONFORMITÉ KYC :\n"
        "Appelle OBLIGATOIREMENT l'outil `analyser_conformite_kyc` en lui passant l'ID du client. "
        "Cet outil lira silencieusement tes recherches précédentes et générera le rapport de conformité.\n\n"

        "ÉTAPE 3 – SYNTHÈSE STRUCTURÉE :\n"
        "Rédige la synthèse commerciale finale structurée en intégrant les conclusions de l'outil KYC :\n"
        "   1. **Constat & Signaux Business** – Événements détectés classés par catégories (Cession, "
        "IPO, Dividende, Levée de fonds, Immobilier, Nominations/Départs, Franchissement de seuil, etc.).\n"
        "   2. **Impacts KYC** – Synthèse du rapport de conformité généré à l'étape 2 (incohérences, PEP, alertes).\n"
        "   3. **Recommandations Commerciales** – Propose des offres de produits et services.\n\n"

        "RÈGLES IMPÉRATIVES :\n"
        "- Tu dois impérativement attendre le retour d'un outil avant de passer à "
        "l'étape suivante.\n"
        "- N'invente JAMAIS d'informations. Utilise UNIQUEMENT les données retournées "
        "par les outils.\n"
        "- Si un outil renvoie une erreur (clé API manquante, timeout, etc.), continue "
        "ton analyse avec les données des autres outils disponibles. Mentionne dans ta "
        "synthèse que certaines sources n'ont pas pu être consultées.\n"
        "- Rédige TOUJOURS ta réponse finale EN FRANÇAIS.\n"
    )

    user_query = (
        f"Effectue une veille commerciale complète pour le client dont l'ID est {client_id}."
    )

    print(f"\nQuery: {user_query}\n")
    answer = client.query(system_prompt, user_query)
    print(f"\n{'='*60}")
    print(f"SYNTHÈSE FINALE DE L'ORCHESTRATEUR")
    print(f"{'='*60}\n")
    print(answer)


if __name__ == '__main__':
    main()