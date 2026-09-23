import json
import os


# ---------------------------------------------------------------------------
# Chemin vers le dossier de données locales (bdd/)
# ---------------------------------------------------------------------------
BDD_DIR = os.path.join(os.path.dirname(__file__), 'bdd')


# ---------------------------------------------------------------------------
# Schémas JSON stricts des 2 outils
# ---------------------------------------------------------------------------

TOOLS = [
    {
        'type': 'function',
        'name': 'consulter_base_interne',
        'description': (
            "Consulte la base de données interne de la banque pour récupérer "
            "toutes les informations connues sur un client à partir de son ID. "
            "Retourne une synthèse structurée : identité du Business Partner, "
            "personne morale associée, bénéficiaire effectif, gérant, niveau "
            "de risque AML, produits et services bancaires en cours."
        ),
        'parameters': {
            'type': 'object',
            'properties': {
                'client_id': {
                    'type': 'string',
                    'description': "L'identifiant unique du client (BP Key).",
                },
            },
            'required': ['client_id'],
            'additionalProperties': False,
        },
        'strict': True,
    },
    {
        'type': 'function',
        'name': 'rechercher_pappers',
        'description': (
            "Effectue une recherche externe sur les bases légales et "
            "financières (type Pappers, Infogreffe, BODACC) pour récupérer "
            "les actualités récentes concernant une entreprise ou une personne : "
            "cessions, changements de dirigeants, opérations capitalistiques, "
            "publications légales."
        ),
        'parameters': {
            'type': 'object',
            'properties': {
                'requete': {
                    'type': 'string',
                    'description': (
                        "Le terme de recherche : nom de l'entreprise, "
                        "nom d'un dirigeant ou d'un bénéficiaire effectif."
                    ),
                },
            },
            'required': ['requete'],
            'additionalProperties': False,
        },
        'strict': True,
    },
]


# ---------------------------------------------------------------------------
# Outil 1 – Consultation de la base de données interne
# ---------------------------------------------------------------------------

def consulter_base_interne(client_id: str) -> str:
    """Lit les fichiers JSON locaux du dossier bdd/ et retourne une synthèse
    formatée de la situation du client."""

    if client_id != "1532378":
        return f"ERREUR : Aucun client trouvé avec l'ID {client_id}."

    # --- Lecture des fichiers JSON ---
    try:
        with open(os.path.join(BDD_DIR, 'test_1_bp.json'), 'r', encoding='utf-8') as f:
            bp_data = json.load(f)
        with open(os.path.join(BDD_DIR, 'test_2_pm.json'), 'r', encoding='utf-8') as f:
            pm_data = json.load(f)
        with open(os.path.join(BDD_DIR, 'test_3_be.json'), 'r', encoding='utf-8') as f:
            be_data = json.load(f)
        with open(os.path.join(BDD_DIR, 'test_5_gerant.json'), 'r', encoding='utf-8') as f:
            gerant_data = json.load(f)
    except FileNotFoundError as e:
        return f"ERREUR : Fichier de données introuvable – {e}"

    # --- Extraction des informations clés ---
    bp = bp_data['result']['bpData']['bpDetails']
    bp_tax = bp_data['result']['bpData']['bpTax']
    ownerships = bp_data['result']['bpData']['relations']['ownerships']

    pm_ident = pm_data['result']['personData']['identification']
    pm_business = pm_data['result']['personData']['businessActivity']
    pm_commercial = pm_data['result']['personData']['commercial']
    pm_aml = pm_data['result']['personData']['aml']

    be_ident = be_data['result']['personData']['identification']
    be_risk = be_data['result']['personData']['riskFactors']
    be_wealth = be_data['result']['personData']['wealthDetails']

    gerant_ident = gerant_data['result']['personData']['identification']

    # --- Construction de la synthèse ---
    synthese = (
        f"=== SYNTHÈSE BASE INTERNE – Client ID: {client_id} ===\n\n"

        f"1. BUSINESS PARTNER (BP)\n"
        f"   - Nom BP : {bp['bpName']}\n"
        f"   - Clé BP : {bp['bpKey']}\n"
        f"   - Date d'ouverture : {bp['openDate']}\n"
        f"   - Type client : {bp['customerTypeValue']}\n"
        f"   - BU : {bp['subBuValue']}\n"
        f"   - Pays de domicile : {bp['countryOfDomicileValue']}\n"
        f"   - CRM : {bp['crmName']}\n"
        f"   - Risque AML validé : {bp_tax['amlValidatedRiskLevelValue']}\n"
        f"   - Statut PEP : {bp_tax['pepAccountValue']}\n\n"

        f"2. PERSONNE MORALE (Registered Owner)\n"
        f"   - Nom : {pm_ident['fullName']}\n"
        f"   - Person Key : {pm_ident['personKey']}\n"
        f"   - Type : {pm_ident['personTypeValue']}\n"
        f"   - Forme juridique : {pm_ident.get('legalFormValue', 'N/A')}\n"
        f"   - Pays d'enregistrement : {pm_ident.get('registrationCountryValue', 'N/A')}\n"
        f"   - Date d'enregistrement : {pm_ident.get('registrationDate', 'N/A')}\n"
        f"   - Secteur d'activité : {pm_business['businessActivity11Value']}\n"
        f"   - CA : {pm_business.get('turnover', 'N/A')}\n"
        f"   - Bilan total : {pm_business.get('totalBalanceSheet', 'N/A')}\n"
        f"   - Risque AML : {pm_aml['validatedAMLRiskLevelValue']}\n"
        f"   - Produits bancaires : {', '.join(p['productValue'] for p in pm_commercial.get('bankProducts', []))}\n"
        f"   - Services bancaires : {', '.join(s['serviceValue'] for s in pm_commercial.get('bankServices', []))}\n\n"

        f"3. BÉNÉFICIAIRE EFFECTIF (Ultimate Beneficial Owner)\n"
        f"   - Nom : {be_ident['fullName']}\n"
        f"   - Person Key : {be_ident['personKey']}\n"
        f"   - Type : {be_ident['personTypeValue']}\n"
        f"   - Date de naissance : {be_ident.get('birthDate', 'N/A')}\n"
        f"   - Nationalité : {be_ident.get('nationalityValue', 'N/A')}\n"
        f"   - Pays de domicile : {be_ident.get('countryOfDomicileValue', 'N/A')}\n"
        f"   - Qualification PEP : {be_risk['pepQualificationValue']}\n"
        f"   - Fonction PEP : {be_risk.get('pepFunctionValue', 'N/A')}\n"
        f"   - Patrimoine estimé : {be_wealth['totalEstimatedWealthValue']}\n"
        f"   - Source de richesse : {', '.join(s['sourceOfWealthValue'] for s in be_wealth.get('sourceOfWealth', []))}\n\n"

        f"4. GÉRANT\n"
        f"   - Nom : {gerant_ident['fullName']}\n"
        f"   - Person Key : {gerant_ident['personKey']}\n"
        f"   - Type : {gerant_ident['personTypeValue']}\n"
        f"   - Statut : {gerant_ident['personStatusValue']}\n"
        f"   - Date de naissance : {gerant_ident.get('birthDate', 'N/A')}\n\n"

        f"5. RELATIONS D'ACTIONNARIAT\n"
    )

    for own in ownerships:
        synthese += (
            f"   - {own['ownershipTypeValue']} : {own['personFullName']} "
            f"(Rôle: {own['ownershipRoleValue']}, "
            f"Risque AML: {own.get('validatedAmlRiskValue', 'N/A')})\n"
        )

    return synthese


# ---------------------------------------------------------------------------
# Outil 2 – Recherche externe (Mock Pappers)
# ---------------------------------------------------------------------------

def rechercher_pappers(requete: str) -> str:
    """Mock – Simule un appel API externe de recherche légale et financière."""

    if "DOMAINE DE CHEZELLES" in requete.upper() or "HERNAEZ" in requete.upper():
        return (
            "RÉSULTAT DE RECHERCHE : Cession actée du DOMAINE DE CHEZELLES "
            "la semaine dernière. L'actionnaire unique, Marie-Cécile Hernaez, "
            "a vendu l'intégralité de ses parts à un groupe viticole "
            "international pour 8 millions d'euros. Baptiste DUFOSSEZ a été "
            "révoqué de son mandat de gérant."
        )

    return (
        f"RÉSULTAT DE RECHERCHE : Aucune actualité significative trouvée "
        f"pour la requête '{requete}'."
    )


# ---------------------------------------------------------------------------
# Routeur d'exécution des outils
# ---------------------------------------------------------------------------

def execute_tool(name: str, arguments: str) -> str:
    """Route l'appel vers la fonction outil appropriée."""
    args = json.loads(arguments)

    if name == 'consulter_base_interne':
        return consulter_base_interne(**args)

    if name == 'rechercher_pappers':
        return rechercher_pappers(**args)

    raise ValueError(f'Outil inconnu : {name}')