# Connaissance projet - Veille commerciale

## Objectif du hackathon

Construire un prototype de veille commerciale capable de partir d'une base de clients, d'interroger des fournisseurs externes via des tools appeles par un LLM, puis de restituer des evenements business qualifies et exploitables par une equipe commerciale.

Le projet doit permettre de detecter rapidement des signaux utiles autour d'un client ou prospect : levee de fonds, acquisition, partenariat, lancement produit, expansion geographique, changement de direction, restructuration, recompense, actualite reglementaire ou tout autre evenement pouvant declencher une action commerciale.

## Contexte actuel du repository

- Le dossier parent `venture-bridge/` contient deja un socle applicatif avec un backend et un frontend.
- Le frontend existe mais n'est pas encore connecte au flux de veille commerciale cible.
- Le backend principal expose aujourd'hui une application de suivi existante.
- L'orchestration Azure AI Foundry et tous les tools sont integres dans `backend/agents/`.
- `backend/agents/tools.py` regroupe les tools de recherche, KYC, synthese et propositions.
- `backend/agents/proposition/` contient les prompts et services propositionnels ; `backend/agents/data/` contient la knowledge base SGPB.

## Use case cible

### Entree

Une base de clients contenant a minima :

- identifiant client
- nom de l'entreprise
- secteur d'activite
- pays ou zone geographique
- taille ou segment commercial
- informations internes utiles pour contextualiser la recherche
- eventuellement contacts, priorite commerciale, comptes assignes, historique d'interactions

### Traitement attendu

Pour chaque client ou pour une selection de clients :

1. Le backend recupere les donnees client.
2. Un orchestrateur LLM construit une demande de veille contextualisee.
3. Le LLM appelle un ou plusieurs tools externes.
4. Les providers retournent des resultats sources.
5. Le LLM extrait, dedoublonne et qualifie les evenements business.
6. Le backend persiste ou expose les evenements obtenus.
7. Le frontend affiche les signaux dans une interface exploitable.

### Sortie

Chaque evenement business devrait etre structure sous une forme proche de :

```json
{
  "client_id": "client-001",
  "client_name": "Example Corp",
  "event_type": "partnership",
  "title": "Example Corp annonce un partenariat strategique",
  "summary": "Resume court de l'evenement et de son impact commercial potentiel.",
  "business_relevance": "Pourquoi cet evenement est utile pour un commercial.",
  "confidence": "high",
  "event_date": "2026-09-23",
  "detected_at": "2026-09-23T10:30:00Z",
  "sources": [
    {
      "title": "Titre de la source",
      "url": "https://example.com/article",
      "provider": "foundry_hosted_search",
      "published_at": "2026-09-20"
    }
  ]
}
```

## Providers externes envisages

### Deja initie

- Validation du tool calling local avec `calculate`.
- Clarification d'architecture : les appels externes de recherche ne doivent pas etre faits par un tool Python local si l'objectif est que Foundry porte l'appel provider. Il faut utiliser un tool heberge ou une capacite de grounding/recherche configuree cote Foundry.
- Ajout d'un test de tool Pappers porte par Foundry via la connexion projet `PAPPERS_CALLER`. Ce chemin utilise `azure-ai-projects` et necessite une authentification Entra locale (`az login`, `azd auth login`, extension Azure VS Code ou service principal), pas seulement `AZURE_OPENAI_API_KEY`.
- Changement de contrainte : l'equipe ne peut pas creer d'agents Foundry. La strategie retenue redevient donc du function calling local : le modele choisit les tools, puis le client Python execute les appels Google, Pappers, BODACC et Companies House.

### A envisager selon le temps disponible

- Bing Search ou Brave Search pour completer Google.
- NewsAPI, GDELT ou autre fournisseur d'actualites.
- APIs specialisees entreprises si disponibles pendant le hackathon.
- Donnees internes ou fichiers CSV pour simuler la base client.
- Recherche web ciblee par secteur ou zone geographique.

## Role attendu du LLM

Le LLM ne doit pas seulement resumer des resultats. Il doit agir comme orchestrateur :

- choisir le ou les tools pertinents selon le client ;
- formuler les requetes de recherche ;
- analyser les resultats ;
- filtrer le bruit ;
- regrouper les sources qui parlent du meme evenement ;
- produire une sortie JSON stable ;
- expliquer la pertinence commerciale ;
- signaler les incertitudes si les sources sont faibles ou contradictoires.

## Architecture cible minimale

```text
Base clients
    |
    v
Backend API
    |
    v
Service de veille commerciale
    |
    v
LLM Azure AI Foundry
    |
    v
Tools providers externes
    |
    v
Evenements business structures
    |
    v
API + Frontend
```

## Modules a construire

### Backend

- Charger ou stocker une base de clients.
- Exposer une route pour lister les clients.
- Exposer une route pour lancer la veille sur un client.
- Maintenir l'orchestration et les tools dans `backend/agents/`.
- Normaliser les resultats de tools dans un schema commun.
- Ajouter une persistance simple des evenements detectes si necessaire.

### Agents / Tools

- Stabiliser le contrat des tools.
- Eviter de mettre un appel provider externe directement dans un tool Python local si le provider doit etre appele derriere Foundry.
- Ajouter un schema de sortie commun pour les providers.
- Gerer les erreurs provider proprement.
- Prevoir les variables d'environnement requises : Azure Foundry, Google Search, autres providers.

### LLM / Prompting

- Definir un prompt system pour l'agent de veille commerciale.
- Forcer une sortie JSON valide.
- Demander une justification commerciale courte.
- Ajouter une strategie de dedoublonnage.
- Ajouter une notion de confiance : `low`, `medium`, `high`.

### Frontend

- Connecter l'interface au backend.
- Afficher la liste des clients.
- Afficher les evenements detectes par client.
- Ajouter une action pour lancer ou relancer la veille.
- Afficher les sources cliquables.
- Montrer un etat de chargement et les erreurs provider.

## Decisions a prendre

- Source initiale de la base clients : CSV, SQLite existant, JSON seed, API, saisie manuelle.
- L'orchestration LLM est integree dans `backend/agents/`.
- Niveau de persistance attendu pour les evenements : memoire, fichier, SQLite, Cosmos DB.
- Providers externes retenus pour la demo.
- Format exact du schema evenement.
- Niveau de connexion souhaite entre le frontend existant et le nouveau use case.

## Backlog de suivi

### Priorite 1 - Demo minimale

- [ ] Creer une base clients de demonstration.
- [ ] Ajouter un endpoint backend pour recuperer les clients.
- [ ] Ajouter un endpoint backend pour lancer une veille sur un client.
- [x] Brancher l'appel Azure AI Foundry avec tool calling local minimal.
- [ ] Identifier le type exact de tool heberge/grounding expose par Foundry pour la recherche web.
- [ ] Tester la veille commerciale avec un appel provider porte par Foundry.
- [x] Ajouter les tools locaux Google, Pappers, BODACC et Companies House dans `backend/agents/tools.py`.
- [x] Integrer la synthese KYC et les propositions bancaires dans `backend/agents/`.
- [ ] Retourner une liste d'evenements business structures.
- [ ] Afficher les resultats dans le frontend.

### Priorite 2 - Qualite des resultats

- [ ] Normaliser les types d'evenements.
- [ ] Dedoublonner les resultats proches.
- [ ] Ajouter un score ou niveau de confiance.
- [ ] Ajouter une justification commerciale.
- [ ] Mieux filtrer les resultats non pertinents.

### Priorite 3 - Industrialisation legere

- [ ] Persister les evenements detectes.
- [ ] Ajouter un historique de veille par client.
- [ ] Ajouter une configuration providers.
- [ ] Ajouter des tests simples sur les schemas et tools.
- [x] Documenter les variables d'environnement.

## Questions ouvertes

- Quel format aura la base clients pendant le hackathon ?
- Quels providers sont autorises ou accessibles dans l'environnement donne ?
- Le frontend actuel doit-il etre adapte ou faut-il creer une nouvelle page dediee ?
- Souhaite-t-on traiter un client a la fois ou lancer une veille batch ?
- Faut-il privilegier la vitesse de demo ou la persistance des resultats ?

## Journal de suivi

### 2026-09-23

- Creation du dossier de connaissance projet.
- Clarification du use case : veille commerciale par client, providers externes, orchestration LLM, restitution d'evenements business.
- Exploration initiale d'un tool Python local appelant Google, puis abandon de cette piste car l'objectif est de faire porter l'appel provider par Foundry.
- Validation initiale de la connexion Azure Foundry et du function calling local.
- Exploration puis abandon du provider de recherche heberge cote Foundry, faute de capacite a creer des agents pendant le hackathon.
- Integration finale de tous les tools dans `backend/agents/`, sans sous-projet d'orchestration separe.
- Pivot final pour le hackathon : pas de creation d'agents. Ajout de tools locaux `search_google_business_events`, `search_pappers_company`, `search_bodacc_announcements`, `search_companies_house_company`. Validation : le modele appelle les providers, continue si un token manque, puis genere un recapitulatif d'evenements business.
