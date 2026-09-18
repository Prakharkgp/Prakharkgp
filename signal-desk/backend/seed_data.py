"""Seed data for the Signal Desk prototype.

Everything here — clients, entities, sources, and events — is fictional,
built directly from the event taxonomy and source list captured in the
hackathon's Req.md. It exists to demonstrate product shape: what a real
feed of registry/media/compliance signals, triaged and linked back to a
client, would look like — not to represent any real company or person.
"""

CATEGORIES = [
    "Commercial Opportunity",
    "Corporate & Credit",
    "KYC Update",
    "Risk & Compliance",
]

SOURCES = [
    # Public registries / disclosures
    {
        "id": "inpi", "name": "INPI", "kind": "public",
        "coverage": "French National Business Register",
        "description": "French companies, directors, filings, accounts, and corporate changes.",
        "status": "simulated",
    },
    {
        "id": "bodacc", "name": "BODACC", "kind": "public",
        "coverage": "France — official gazette",
        "description": "Incorporations, business sales/transfers, modifications, and insolvency proceedings.",
        "status": "simulated",
    },
    {
        "id": "companies-house", "name": "Companies House", "kind": "public",
        "coverage": "United Kingdom",
        "description": "Directors, Persons with Significant Control (PSC), filing history, accounts, charges, and insolvencies.",
        "status": "simulated",
    },
    {
        "id": "amf", "name": "AMF", "kind": "public",
        "coverage": "France — listed companies",
        "description": "Major shareholding disclosures, insider transactions, sanctions, and regulatory disclosures.",
        "status": "simulated",
    },
    {
        "id": "sec-edgar", "name": "SEC EDGAR", "kind": "public",
        "coverage": "United States — listed companies",
        "description": "Extremely rich equivalent for US-listed companies (filings, insider transactions, disclosures).",
        "status": "simulated",
    },
    {
        "id": "sanctions", "name": "EU Sanctions Map & national lists", "kind": "public",
        "coverage": "EU / international",
        "description": "Official sanctions lists for compliance-related monitoring.",
        "status": "simulated",
    },
    {
        "id": "corp-ir", "name": "Corporate websites (IR)", "kind": "public",
        "coverage": "Global",
        "description": "Investor relations announcements: M&A activity, results, management changes, dividends.",
        "status": "simulated",
    },
    {
        "id": "fin-media", "name": "Financial media", "kind": "public",
        "coverage": "Global",
        "description": "Reliable financial press — often surfaces events before official registries are updated.",
        "status": "simulated",
    },
    # Private / commercial sources — planned integrations
    {
        "id": "orbis", "name": "Moody's Orbis", "kind": "private",
        "coverage": "Ownership mapping",
        "description": "Answers “who owns what” — links an event on an indirectly owned company back to the right client.",
        "status": "planned",
    },
    {
        "id": "mergermarket", "name": "Mergermarket", "kind": "private",
        "coverage": "M&A intelligence",
        "description": "Answers “who is buying/selling what” — early intelligence on business sales and liquidity events.",
        "status": "planned",
    },
    {
        "id": "pitchbook", "name": "PitchBook", "kind": "private",
        "coverage": "Private markets",
        "description": "Answers “who is raising/investing” — funding rounds, PE/VC firms, and investors.",
        "status": "planned",
    },
    {
        "id": "wealth-x", "name": "Altrata / Wealth-X", "kind": "private",
        "coverage": "Person-centric wealth data",
        "description": "UHNW prospecting and Private Banking client acquisition intelligence.",
        "status": "planned",
    },
    {
        "id": "world-check", "name": "LSEG World-Check", "kind": "private",
        "coverage": "Risk & compliance",
        "description": "Sanctions, PEPs, and risk intelligence.",
        "status": "planned",
    },
    {
        "id": "lexisnexis", "name": "LexisNexis", "kind": "private",
        "coverage": "Risk & compliance",
        "description": "Adverse media, due diligence, and international coverage.",
        "status": "planned",
    },
    {
        "id": "spark-interfax", "name": "SPARK/Interfax", "kind": "private",
        "coverage": "Geography-specific",
        "description": "Already used for certain Russian individuals and entities.",
        "status": "planned",
    },
    {
        "id": "salamanca", "name": "Salamanca", "kind": "private",
        "coverage": "Enhanced due diligence",
        "description": "Deeper human-led investigations when a detected signal needs EDD.",
        "status": "planned",
    },
]

CLIENTS = [
    {
        "id": "lefevre",
        "name": "Antoine Lefevre",
        "segment": "UHNW Individual — Private Banking",
        "rm_owner": "Camille Dubois",
        "is_prospect": False,
        "linked_entities": [
            {"name": "Lefevre Family Holding SAS", "relation": "40% shareholder", "jurisdiction": "France"},
            {"name": "NovaTech Robotics SAS", "relation": "Indirect, via holding", "jurisdiction": "France"},
        ],
    },
    {
        "id": "whitfield-rowe",
        "name": "Whitfield & Rowe Group plc",
        "segment": "Corporate — Mid-Cap, UK-listed",
        "rm_owner": "James Okafor",
        "is_prospect": False,
        "linked_entities": [
            {"name": "Whitfield & Rowe Logistics Ltd", "relation": "Wholly-owned subsidiary", "jurisdiction": "United Kingdom"},
        ],
    },
    {
        "id": "meridian",
        "name": "Meridian BioTech Inc.",
        "segment": "Corporate — US-listed",
        "rm_owner": "Sarah Klein",
        "is_prospect": False,
        "linked_entities": [],
    },
    {
        "id": "aurelie-costa",
        "name": "Aurélie Costa",
        "segment": "UHNW Individual — Prospect",
        "rm_owner": "Camille Dubois",
        "is_prospect": True,
        "linked_entities": [
            {"name": "Costa Ventures Holding", "relation": "Sole shareholder", "jurisdiction": "France"},
        ],
    },
    {
        "id": "delacroix",
        "name": "Delacroix Capital SAS",
        "segment": "Corporate — Family Office",
        "rm_owner": "James Okafor",
        "is_prospect": False,
        "linked_entities": [],
    },
    {
        "id": "meridian-holdings-prospect",
        "name": "Julien Bertrand",
        "segment": "Corporate Entrepreneur — Prospect",
        "rm_owner": "Sarah Klein",
        "is_prospect": True,
        "linked_entities": [
            {"name": "Bertrand Industrials SAS", "relation": "Founder & majority shareholder", "jurisdiction": "France"},
        ],
    },
]

# category, event_type mirror the taxonomy in Req.md section 1.
EVENTS = [
    {
        "category": "Commercial Opportunity",
        "event_type": "Business or shareholding sale",
        "entity_name": "NovaTech Robotics SAS",
        "client_id": "lefevre",
        "source_id": "bodacc",
        "priority": "High",
        "description": (
            "BODACC filing shows a 60% stake sale in NovaTech Robotics SAS, indirectly "
            "held via Lefevre Family Holding SAS. Potential cash event and reinvestment "
            "opportunity for the underlying UBO."
        ),
    },
    {
        "category": "Commercial Opportunity",
        "event_type": "IPO / listing / delisting",
        "entity_name": "Meridian BioTech Inc.",
        "client_id": "meridian",
        "source_id": "sec-edgar",
        "priority": "High",
        "description": (
            "S-1 registration filed with the SEC ahead of a planned Nasdaq listing. "
            "Major liquidity event for founding shareholders."
        ),
    },
    {
        "category": "Commercial Opportunity",
        "event_type": "Fundraising / capital increase",
        "entity_name": "Costa Ventures Holding",
        "client_id": "aurelie-costa",
        "source_id": "pitchbook",
        "priority": "Medium",
        "description": (
            "PitchBook records a new Series B round led into a portfolio company of Costa "
            "Ventures Holding, increasing the prospect's shareholding value."
        ),
    },
    {
        "category": "Commercial Opportunity",
        "event_type": "Special dividend or significant distribution",
        "entity_name": "Whitfield & Rowe Group plc",
        "client_id": "whitfield-rowe",
        "source_id": "corp-ir",
        "priority": "Medium",
        "description": "Board announces a special dividend following the disposal of a non-core division.",
    },
    {
        "category": "Commercial Opportunity",
        "event_type": "Appointment to a key position (CEO, CFO, Board member, etc.)",
        "entity_name": "Delacroix Capital SAS",
        "client_id": "delacroix",
        "source_id": "fin-media",
        "priority": "Low",
        "description": "Financial press reports the founder's appointment to the board of a listed peer.",
    },
    {
        "category": "Corporate & Credit",
        "event_type": "Refinancing",
        "entity_name": "Whitfield & Rowe Logistics Ltd",
        "client_id": "whitfield-rowe",
        "source_id": "companies-house",
        "priority": "Medium",
        "description": "New charge registered at Companies House, consistent with a refinancing of existing facilities.",
    },
    {
        "category": "Corporate & Credit",
        "event_type": "Significant change in revenue, earnings, or leverage",
        "entity_name": "Meridian BioTech Inc.",
        "client_id": "meridian",
        "source_id": "sec-edgar",
        "priority": "Medium",
        "description": "10-Q shows a sharp increase in leverage following a debt-funded acquisition.",
    },
    {
        "category": "Corporate & Credit",
        "event_type": "Restructuring",
        "entity_name": "Delacroix Capital SAS",
        "client_id": "delacroix",
        "source_id": "inpi",
        "priority": "Low",
        "description": "INPI filing shows an internal restructuring merging two subsidiaries.",
    },
    {
        "category": "KYC Update",
        "event_type": "Change of shareholder or UBO",
        "entity_name": "Lefevre Family Holding SAS",
        "client_id": "lefevre",
        "source_id": "orbis",
        "priority": "High",
        "description": "Ownership mapping shows a change in the UBO chain following the NovaTech stake sale — KYC file needs refresh.",
    },
    {
        "category": "KYC Update",
        "event_type": "New executive appointment",
        "entity_name": "Meridian BioTech Inc.",
        "client_id": "meridian",
        "source_id": "sec-edgar",
        "priority": "Low",
        "description": "8-K filing announces a new CFO — update client knowledge file.",
    },
    {
        "category": "KYC Update",
        "event_type": "Change of jurisdiction, headquarters, or corporate structure",
        "entity_name": "Whitfield & Rowe Group plc",
        "client_id": "whitfield-rowe",
        "source_id": "companies-house",
        "priority": "Medium",
        "description": "Registered office address changed; group is reorganizing under a new UK holding entity.",
    },
    {
        "category": "Risk & Compliance",
        "event_type": "Credible adverse media (fraud, corruption, financial crime, etc.)",
        "entity_name": "Costa Ventures Holding",
        "client_id": "aurelie-costa",
        "source_id": "lexisnexis",
        "priority": "High",
        "description": "Adverse media hit referencing a former portfolio company under investigation for accounting irregularities.",
    },
    {
        "category": "Risk & Compliance",
        "event_type": "PEP status or appointment to a relevant public office",
        "entity_name": "Antoine Lefevre",
        "client_id": "lefevre",
        "source_id": "world-check",
        "priority": "High",
        "description": "Screening flags a newly appointed close associate holding a prominent public function — PEP review required.",
    },
    {
        "category": "Risk & Compliance",
        "event_type": "Significant litigation or legal proceedings",
        "entity_name": "Delacroix Capital SAS",
        "client_id": "delacroix",
        "source_id": "fin-media",
        "priority": "Medium",
        "description": "Financial press reports a commercial litigation filed against a subsidiary.",
    },
    {
        "category": "Risk & Compliance",
        "event_type": "Sanctions",
        "entity_name": "Unrelated third party — screening match",
        "client_id": None,
        "source_id": "sanctions",
        "priority": "High",
        "description": "Name-matching alert against the EU consolidated sanctions list; requires manual disambiguation before linking to any client.",
    },
]
