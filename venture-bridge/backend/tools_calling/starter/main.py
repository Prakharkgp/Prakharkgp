from client import FoundryClient


def main() -> None:
    client = FoundryClient()

    system_prompt = (
        "Tu es un analyste de veille commerciale. Pour l'entreprise demandee, "
        "utilise les tools disponibles pour interroger Google, Pappers, BODACC "
        "et Companies House si pertinent. "
        "Croise les sources, dedoublonne les informations, puis produis un "
        "recapitulatif en francais des evenements business detectes. Pour chaque "
        "evenement, indique le type d'evenement, la source, la date si disponible, "
        "la pertinence commerciale et un niveau de confiance low/medium/high. "
        "Demande au maximum 3 resultats par provider pour ce test."
    )
    user_query = (
        "Fais une veille commerciale sur BNP Paribas. Recherche les signaux "
        "business recents et les informations officielles utiles via Google, "
        "Pappers, BODACC et Companies House."
    )

    print(f"Query: {user_query}")
    answer = client.query(system_prompt, user_query)
    print(f"Answer: {answer}")


if __name__ == '__main__':
    main()