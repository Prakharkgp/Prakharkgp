const I18N = {
  en: {
    tagline: "Client event intelligence for Private Banking & Corporate coverage",
    tab_dashboard: "Signal Directory",
    tab_sources: "Sources",
    tab_clients: "Clients",
    tab_ai: "AI Engine",
    dashboard_title: "Signal Directory",
    filter_entity: "Entity / client",
    filter_entity_placeholder: "Search by name or keyword",
    filter_category: "Category",
    filter_priority: "Priority",
    filter_status: "Status",
    filter_all: "<< All >>",
    priority_high: "High",
    priority_medium: "Medium",
    priority_low: "Low",
    status_review: "Pending",
    status_actioned: "Actioned",
    status_dismissed: "Dismissed",
    btn_search: "Search",
    btn_reset: "Reset",
    btn_export: "Export",
    btn_view: "View",
    btn_hide: "Hide",
    btn_analyze: "Analyze with AI",
    btn_reanalyze: "Re-analyze",
    btn_analyzing: "Analyzing…",
    col_category: "Category",
    col_event_type: "Event type",
    col_entity: "Entity / client",
    col_priority: "Priority",
    col_source: "Source",
    col_status: "Status",
    col_detected: "Detected",
    col_action: "Action",
    col_source_name: "Source",
    col_kind: "Kind",
    col_coverage: "Coverage",
    col_role: "Role",
    col_client: "Client",
    col_type: "Type",
    col_segment: "Segment",
    col_rm: "RM owner",
    col_linked_entities: "Linked entities",
    kpi_total: "Total signals",
    kpi_high: "High priority",
    kpi_pending: "Pending",
    kpi_opportunities: "Commercial opportunities",
    client_type_client: "Client",
    client_type_prospect: "Prospect",
    clients_kpi_clients: "Existing clients",
    clients_kpi_prospects: "Prospects",
    cat_commercial: "Commercial Opportunity",
    cat_kyc: "KYC Update",
    entity_unlinked: "unlinked, screening match",
    ai_summary_label: "AI summary",
    ai_action_prefix: "Suggested action:",
    pagination_page_size: "Page size:",
    pagination_range: (start, end, total) => `${start} to ${end} of ${total}`,
    pagination_page_of: (p, n) => `Page ${p} of ${n}`,
    kind_public: "Public",
    kind_private: "Private",
    tag_simulated: "Simulated",
    tag_planned: "Planned",
    sources_title: "Source Registry",
    sources_subtitle:
      "Public registries are simulated in this prototype so the feed and triage workflow can be demoed end to end. Private/commercial sources are mapped to their role in the workflow, ready to be wired in as licensed integrations become available.",
    clients_title: "Clients & Ownership",
    clients_subtitle:
      "Events on indirectly held entities are linked back to the client through the ownership chain — the same “who owns what” role a source like Moody's Orbis would play in production.",
    ownership_chain_title: "Ownership chain",
    linked_signals_title: "Linked signals",
    no_linked_entities: "No linked entities recorded.",
    no_signals_recorded: "No signals recorded for this client yet.",
    signal_line: (priority, source) => `${priority} priority · via ${source}`,
    ai_title: "AI Enrichment Engine",
    ai_subtitle:
      "Every signal can be summarized and triaged by an AI layer that sits behind a single interface, so the underlying model can change without touching the product.",
    ai_active_engine: "Active engine",
    ai_how_title: "How it's wired",
    ai_how_1:
      "<strong>Demo mode (default):</strong> a rule-based engine drafts a one-line summary and a suggested next action from the event's own fields — no external calls, no keys required.",
    ai_how_2:
      "<strong>Azure AI Foundry:</strong> fill in the endpoint, deployment, and API key above (or set <code>AZURE_AI_FOUNDRY_ENDPOINT</code>/<code>AZURE_AI_FOUNDRY_API_KEY</code>/<code>AZURE_AI_FOUNDRY_DEPLOYMENT</code> as environment variables) to switch every “Analyze” call to a real model deployment — same interface, richer output.",
    ai_env_endpoint: "https://&lt;resource&gt;.services.ai.azure.com/openai/v1",
    ai_env_key: "secret — set in your host's env, never in code",
    ai_env_deployment: "e.g. gpt-5.4-mini",
    ai_note_demo:
      "Set AZURE_AI_FOUNDRY_ENDPOINT and AZURE_AI_FOUNDRY_API_KEY as environment variables to switch from the demo engine to a live Azure AI Foundry model deployment — no code change required.",
    ai_note_azure: "This deployment is running on a live Azure AI Foundry model.",
    provider_mock: "Rule-based demo engine",
    provider_azure: "Azure AI Foundry",
    no_match: "No signals match these filters.",
    ai_config_title: "Azure AI Foundry connection",
    ai_config_subtitle: "Set these values directly here — no access to the hosting dashboard needed.",
    ai_field_endpoint: "Endpoint",
    ai_field_deployment: "Deployment",
    ai_field_api_key: "API key",
    btn_save: "Save",
    btn_clear: "Reset",
    ai_config_key_set: "An API key is already saved. Leave blank to keep it, or enter a new one to replace it.",
    ai_config_key_unset: "No API key saved yet — the demo engine will keep running until one is set.",
    ai_config_saved: "Saved. The Analyze button now uses this configuration.",
    ai_config_cleared: "Cleared. Reverted to environment variables (if any) or the demo engine.",
    ai_config_error: "Couldn't save — please try again.",
    ai_call_error_prefix: "Analysis failed:",
    shareholder_structure_title: "Shareholder structure",
    explore_opportunity_btn: "Explore commercial opportunity",
    scan_loading_title: "Agent sequence running…",
    progress_step_search: "1/1 Multi-sources web searches",
    progress_step_kyc: "2/2 Person KYC data comparison",
    progress_step_synthesis: "3/3 Commercial opportunities synthesis preparation",
    no_opportunity_title: "No opportunity for this legal entity",
    no_opportunity_body: "The AI agent cross-checked the shareholder structure against tracked signals and found nothing new.",
    agent_findings_title: "Agent findings",
    gap_found_intro: "The agent found linked entities with no signal on file yet:",
    client_opportunities_title: "Commercial opportunity signals",
    client_opportunities_empty: "No commercial opportunity signals on file for this client.",
    linked_signals_empty_short: "No linked signals.",
    decline_reason_label: "Reason for not pursuing this opportunity",
    decline_reason_placeholder: "e.g. client not interested, insufficient fit…",
    decline_reason_prefix: "Decline reason:",
    action_comment_label: "Comment on this action",
    action_comment_placeholder: "e.g. client onboarded, proposal sent…",
    action_comment_prefix: "Action comment:",
    btn_confirm: "Confirm",
    btn_cancel: "Cancel",
    scan_call_error_prefix: "Check failed:",
    btn_dashboard: "Signals",
    gap_added_tag: "Added to the Signal Directory",
    step_search_online: "1. Online search",
    step_search_online_placeholder: "No additional public source reachable from this demo environment.",
    step_kyc_check: "2. Internal KYC data check",
    step_kyc_check_result: (relation, jurisdiction) => `No signal on file for this entity yet (${relation}, ${jurisdiction}) — internal referential updated.`,
    step_synthesis: "3. Synthetic summary",
    step_commercial_proposal: "4. Commercial proposal",
    other_shareholders_label: "Other shareholders",
    other_shareholders_section_title: "Potential shareholders to address",
    already_client_tag: "Already a client",
    btn_details: "Details",
    btn_hide_details: "Hide details",
    rating_label: "Rating",
    convert_to_client_btn: "Make this shareholder a client",
    converting_label: "Converting…",
    convert_success: (name) => `${name} was added as a new prospect — a commercial opportunity signal was created and analyzed. See the Clients tab.`,
    convert_error_prefix: "Conversion failed:",
    convert_already_client: (name) => `${name} is already a tracked client.`,
    this_client_label: "this client",
    unidentified_stake: "Unidentified shareholders",
    col_opportunity_prospects: "Opportunity prospects",
    opportunity_prospects_count: (n) => `${n} prospect${n > 1 ? "s" : ""}`,
    opportunity_prospects_hint: "Co-shareholders not yet tracked as clients — open the dashboard to convert them.",
    clients_kpi_opportunity_prospects: "Opportunity prospects identified",
    crm_review_date_prefix: "CRM review:",
  },
  fr: {
    tagline: "Intelligence des événements clients pour la Banque Privée et les Entreprises",
    tab_dashboard: "Répertoire des signaux",
    tab_sources: "Sources",
    tab_clients: "Clients",
    tab_ai: "Moteur IA",
    dashboard_title: "Répertoire des signaux",
    filter_entity: "Entité / client",
    filter_entity_placeholder: "Rechercher par nom ou mot-clé",
    filter_category: "Catégorie",
    filter_priority: "Priorité",
    filter_status: "Statut",
    filter_all: "<< Tous >>",
    priority_high: "Élevée",
    priority_medium: "Moyenne",
    priority_low: "Faible",
    status_review: "En cours d'examen",
    status_actioned: "Traité",
    status_dismissed: "Rejeté",
    btn_search: "Rechercher",
    btn_reset: "Réinitialisation",
    btn_export: "Exporter",
    btn_view: "Visualiser",
    btn_hide: "Masquer",
    btn_analyze: "Analyser avec l'IA",
    btn_reanalyze: "Réanalyser",
    btn_analyzing: "Analyse en cours…",
    col_category: "Catégorie",
    col_event_type: "Type d'événement",
    col_entity: "Entité / client",
    col_priority: "Priorité",
    col_source: "Source",
    col_status: "Statut",
    col_detected: "Détecté",
    col_action: "Action",
    col_source_name: "Source",
    col_kind: "Type",
    col_coverage: "Couverture",
    col_role: "Rôle",
    col_client: "Client",
    col_type: "Type",
    col_segment: "Segment",
    col_rm: "Chargé de relation",
    col_linked_entities: "Entités liées",
    kpi_total: "Signaux totaux",
    kpi_high: "Priorité élevée",
    kpi_pending: "En attente",
    kpi_opportunities: "Opportunités commerciales",
    client_type_client: "Client",
    client_type_prospect: "Prospect",
    clients_kpi_clients: "Clients existants",
    clients_kpi_prospects: "Prospects",
    cat_commercial: "Opportunité Commerciale",
    cat_kyc: "Mise à jour KYC",
    entity_unlinked: "non lié, correspondance de filtrage",
    ai_summary_label: "Résumé IA",
    ai_action_prefix: "Action suggérée :",
    pagination_page_size: "Taille de page :",
    pagination_range: (start, end, total) => `${start} à ${end} sur ${total}`,
    pagination_page_of: (p, n) => `Page ${p} sur ${n}`,
    kind_public: "Public",
    kind_private: "Privé",
    tag_simulated: "Simulé",
    tag_planned: "Prévu",
    sources_title: "Registre des sources",
    sources_subtitle:
      "Les registres publics sont simulés dans ce prototype afin de démontrer le flux et le triage de bout en bout. Les sources privées/commerciales sont associées à leur rôle dans le processus, prêtes à être intégrées lorsque les licences seront disponibles.",
    clients_title: "Clients & actionnariat",
    clients_subtitle:
      "Les événements sur des entités détenues indirectement sont rattachés au client via la chaîne d'actionnariat — le même rôle que jouerait une source comme Moody's Orbis en production.",
    ownership_chain_title: "Chaîne d'actionnariat",
    linked_signals_title: "Signaux liés",
    no_linked_entities: "Aucune entité liée enregistrée.",
    no_signals_recorded: "Aucun signal enregistré pour ce client.",
    signal_line: (priority, source) => `Priorité ${priority} · via ${source}`,
    ai_title: "Moteur d'enrichissement IA",
    ai_subtitle:
      "Chaque signal peut être résumé et trié par une couche d'IA placée derrière une interface unique, afin que le modèle sous-jacent puisse évoluer sans modifier le produit.",
    ai_active_engine: "Moteur actif",
    ai_how_title: "Fonctionnement",
    ai_how_1:
      "<strong>Mode démo (par défaut) :</strong> un moteur à base de règles rédige un résumé en une phrase et une action suggérée à partir des champs de l'événement — aucun appel externe, aucune clé requise.",
    ai_how_2:
      "<strong>Azure AI Foundry :</strong> renseignez le point de terminaison, le déploiement et la clé API ci-dessus (ou définissez <code>AZURE_AI_FOUNDRY_ENDPOINT</code>/<code>AZURE_AI_FOUNDRY_API_KEY</code>/<code>AZURE_AI_FOUNDRY_DEPLOYMENT</code> comme variables d'environnement) pour faire basculer chaque analyse vers un modèle réel — même interface, résultat plus riche.",
    ai_env_endpoint: "https://&lt;ressource&gt;.services.ai.azure.com/openai/v1",
    ai_env_key: "secret — à définir dans l'environnement de l'hôte, jamais dans le code",
    ai_env_deployment: "ex. : gpt-5.4-mini",
    ai_note_demo:
      "Définissez AZURE_AI_FOUNDRY_ENDPOINT et AZURE_AI_FOUNDRY_API_KEY comme variables d'environnement pour passer du moteur de démonstration à un modèle Azure AI Foundry réel — aucune modification de code requise.",
    ai_note_azure: "Ce déploiement fonctionne actuellement avec un modèle Azure AI Foundry réel.",
    provider_mock: "Moteur de démonstration à base de règles",
    provider_azure: "Azure AI Foundry",
    no_match: "Aucun signal ne correspond à ces filtres.",
    ai_config_title: "Connexion Azure AI Foundry",
    ai_config_subtitle: "Renseignez ces valeurs directement ici — aucun accès au tableau de bord d'hébergement n'est nécessaire.",
    ai_field_endpoint: "Point de terminaison",
    ai_field_deployment: "Déploiement",
    ai_field_api_key: "Clé API",
    btn_save: "Enregistrer",
    btn_clear: "Réinitialiser",
    ai_config_key_set: "Une clé API est déjà enregistrée. Laissez vide pour la conserver, ou saisissez-en une nouvelle pour la remplacer.",
    ai_config_key_unset: "Aucune clé API enregistrée pour l'instant — le moteur de démonstration continuera de fonctionner jusqu'à ce qu'une clé soit définie.",
    ai_config_saved: "Enregistré. Le bouton Analyser utilise désormais cette configuration.",
    ai_config_cleared: "Réinitialisé. Retour aux variables d'environnement (le cas échéant) ou au moteur de démonstration.",
    ai_config_error: "Impossible d'enregistrer — veuillez réessayer.",
    ai_call_error_prefix: "Échec de l'analyse :",
    shareholder_structure_title: "Structure actionnariale",
    explore_opportunity_btn: "Explorer l'opportunité commerciale",
    scan_loading_title: "Séquence d'agents en cours…",
    progress_step_search: "1/1 Recherches web multi-sources",
    progress_step_kyc: "2/2 Comparaison des données KYC des référentiels",
    progress_step_synthesis: "3/3 Préparation de la synthèse des opportunités commerciales",
    no_opportunity_title: "Aucune opportunité pour cette entité juridique",
    no_opportunity_body: "L'agent IA a comparé la structure actionnariale aux signaux suivis et n'a rien trouvé de nouveau.",
    agent_findings_title: "Résultats de l'agent",
    gap_found_intro: "L'agent a trouvé des entités liées sans signal enregistré :",
    client_opportunities_title: "Signaux d'opportunité commerciale",
    client_opportunities_empty: "Aucun signal d'opportunité commerciale enregistré pour ce client.",
    linked_signals_empty_short: "Aucun signal lié.",
    decline_reason_label: "Motif de non-poursuite de cette opportunité",
    decline_reason_placeholder: "ex. : client non intéressé, profil non adapté…",
    decline_reason_prefix: "Motif du rejet :",
    action_comment_label: "Commentaire sur cette action",
    action_comment_placeholder: "ex. : client intégré, proposition envoyée…",
    action_comment_prefix: "Commentaire :",
    btn_confirm: "Confirmer",
    btn_cancel: "Annuler",
    scan_call_error_prefix: "Échec de la vérification :",
    btn_dashboard: "Veille",
    gap_added_tag: "Ajouté au répertoire des signaux",
    step_search_online: "1. Recherche en ligne",
    step_search_online_placeholder: "Aucune source publique supplémentaire accessible depuis cet environnement de démonstration.",
    step_kyc_check: "2. Vérification KYC interne",
    step_kyc_check_result: (relation, jurisdiction) => `Aucun signal enregistré pour cette entité (${relation}, ${jurisdiction}) — référentiel interne mis à jour.`,
    step_synthesis: "3. Synthèse",
    step_commercial_proposal: "4. Proposition commerciale",
    other_shareholders_label: "Autres actionnaires",
    other_shareholders_section_title: "Actionnaires potentiels à adresser",
    already_client_tag: "Déjà client",
    btn_details: "Détails",
    btn_hide_details: "Masquer les détails",
    rating_label: "Niveau",
    convert_to_client_btn: "Faire de cet actionnaire un client",
    converting_label: "Conversion en cours…",
    convert_success: (name) => `${name} a été ajouté comme nouveau prospect — un signal d'opportunité commerciale a été créé et analysé. Voir l'onglet Clients.`,
    convert_error_prefix: "Échec de la conversion :",
    convert_already_client: (name) => `${name} est déjà un client suivi.`,
    this_client_label: "ce client",
    unidentified_stake: "Actionnaires non identifiés",
    col_opportunity_prospects: "Prospects opportunité",
    opportunity_prospects_count: (n) => `${n} prospect${n > 1 ? "s" : ""}`,
    opportunity_prospects_hint: "Co-actionnaires pas encore suivis comme clients — ouvrez le tableau de bord pour les convertir.",
    clients_kpi_opportunity_prospects: "Prospects opportunité identifiés",
    crm_review_date_prefix: "Revue CRM :",
  },
};

const state = {
  categories: [],
  events: [],
  sources: [],
  clients: [],
  appliedFilters: { search: "", category: "", priority: "", status: "" },
  page: 1,
  pageSize: 10,
  expandedEventId: null,
  modalClient: null,
  lang: localStorage.getItem("sd_lang") || "fr",
};

const CATEGORY_CLASS = {
  "Commercial Opportunity": "cat-commercial",
  "KYC Update": "cat-kyc",
};

const CATEGORY_KEY = {
  "Commercial Opportunity": "cat_commercial",
  "KYC Update": "cat_kyc",
};

const PRIORITY_CLASS = { High: "pri-high", Medium: "pri-medium", Low: "pri-low" };
const PRIORITY_KEY = { High: "priority_high", Medium: "priority_medium", Low: "priority_low" };

const STATUS_CLASS = {
  "Under Review": "status-review",
  Actioned: "status-actioned",
  Dismissed: "status-dismissed",
};
const STATUS_KEY = {
  "Under Review": "status_review",
  Actioned: "status_actioned",
  Dismissed: "status_dismissed",
};

function statusCommentPrefix(status) {
  return status === "Actioned" ? t("action_comment_prefix") : t("decline_reason_prefix");
}

const PROVIDER_KEY = {
  "Rule-based demo engine": "provider_mock",
  "Azure AI Foundry": "provider_azure",
};

function t(key, ...args) {
  const entry = I18N[state.lang][key] ?? I18N.en[key] ?? key;
  return typeof entry === "function" ? entry(...args) : entry;
}

async function api(path, options) {
  const res = await fetch(path, options);
  if (!res.ok) {
    let detail = `${path} failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body && body.detail) detail = body.detail;
    } catch (e) {
      // response body wasn't JSON — keep the generic message
    }
    throw new Error(detail);
  }
  return res.json();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function setupClientModal() {
  document.getElementById("client-modal-close").addEventListener("click", closeClientModal);
  document.getElementById("client-modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "client-modal-overlay") closeClientModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeClientModal();
  });
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`panel-${btn.dataset.tab}`).classList.add("active");
    });
  });
}

function setupLangSwitch() {
  const buttons = document.querySelectorAll(".lang-btn");
  buttons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === state.lang);
    btn.addEventListener("click", () => {
      state.lang = btn.dataset.lang;
      localStorage.setItem("sd_lang", state.lang);
      buttons.forEach((b) => b.classList.toggle("active", b.dataset.lang === state.lang));
      document.documentElement.lang = state.lang;
      applyStaticTranslations();
      renderAll();
    });
  });
}

function applyStaticTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}

function setupLogoFallback() {
  const img = document.getElementById("brand-logo");
  img.addEventListener("error", () => {
    const fallback = document.createElement("span");
    fallback.className = "brand-mark";
    fallback.textContent = "SG";
    img.replaceWith(fallback);
  });
}

function renderKPIs() {
  const total = state.events.length;
  const opportunities = state.events.filter((e) => e.category === "Commercial Opportunity").length;
  const high = state.events.filter((e) => e.priority === "High").length;
  const pending = state.events.filter((e) => e.status === "Under Review").length;

  const kpis = [
    { value: total, label: t("kpi_total") },
    { value: pending, label: t("kpi_pending") },
    { value: high, label: t("kpi_high") },
    { value: opportunities, label: t("kpi_opportunities"), accent: true },
  ];

  document.getElementById("kpis").innerHTML = kpis
    .map((k) => `<div class="kpi-card${k.accent ? " kpi-accent" : ""}"><div class="value">${k.value}</div><div class="label">${k.label}</div></div>`)
    .join("");
}

function renderClientKPIs() {
  const clients = state.clients.filter((c) => !c.isProspect).length;
  const prospects = state.clients.filter((c) => c.isProspect).length;
  const opportunityProspects = state.clients.reduce((sum, c) => sum + (c.potentialProspectCount || 0), 0);

  const kpis = [
    { value: clients, label: t("clients_kpi_clients") },
    { value: prospects, label: t("clients_kpi_prospects"), accent: true },
    { value: opportunityProspects, label: t("clients_kpi_opportunity_prospects"), accent: true },
  ];

  document.getElementById("client-kpis").innerHTML = kpis
    .map((k) => `<div class="kpi-card${k.accent ? " kpi-accent" : ""}"><div class="value">${k.value}</div><div class="label">${k.label}</div></div>`)
    .join("");
}

function populateCategoryFilter() {
  const select = document.getElementById("filter-category");
  const current = select.value;
  select.innerHTML =
    `<option value="">${t("filter_all")}</option>` +
    state.categories.map((c) => `<option value="${c}">${t(CATEGORY_KEY[c] || c)}</option>`).join("");
  select.value = current;
}

function getFilteredEvents() {
  const { search, category, priority, status } = state.appliedFilters;
  const needle = search.trim().toLowerCase();
  return state.events.filter((e) => {
    if (category && e.category !== category) return false;
    if (priority && e.priority !== priority) return false;
    if (status && e.status !== status) return false;
    if (needle) {
      const haystack = `${e.entityName} ${e.clientName || ""} ${e.description} ${e.eventType}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });
}

function readDraftFilters() {
  return {
    search: document.getElementById("filter-search").value,
    category: document.getElementById("filter-category").value,
    priority: document.getElementById("filter-priority").value,
    status: document.getElementById("filter-status").value,
  };
}

function renderEventDetailRow(event) {
  const aiHtml = event.aiSummary
    ? `<div class="ai-block">
        <div class="ai-block-label">${t("ai_summary_label")} <span class="ai-provider-badge">${escapeHtml(t(PROVIDER_KEY[event.aiProviderUsed] || event.aiProviderUsed))}</span></div>
        <p class="ai-summary">${escapeHtml(event.aiSummary)}</p>
        <p class="ai-action">${t("ai_action_prefix")} ${escapeHtml(event.aiSuggestedAction)}</p>
      </div>`
    : "";

  const errorMessage = state.analyzeErrors && state.analyzeErrors[event.id];
  const errorHtml = errorMessage
    ? `<p class="ai-error">${t("ai_call_error_prefix")} ${escapeHtml(errorMessage)}</p>`
    : "";

  const declineReasonHtml = event.declineReason
    ? `<p class="decline-reason-note${event.status === "Actioned" ? " actioned" : ""}">${statusCommentPrefix(event.status)} ${escapeHtml(event.declineReason)}</p>`
    : "";

  return `
    <tr class="detail-row" data-detail-for="${event.id}">
      <td colspan="8">
        <p class="detail-desc">${escapeHtml(event.description)}</p>
        ${aiHtml}
        ${errorHtml}
        <div class="detail-actions">
          <button class="btn-navy analyze-btn" data-id="${event.id}">${event.aiSummary ? t("btn_reanalyze") : t("btn_analyze")}</button>
          <select class="status-select" data-id="${event.id}">
            <option value="Under Review"${event.status === "Under Review" ? " selected" : ""}>${t("status_review")}</option>
            <option value="Actioned"${event.status === "Actioned" ? " selected" : ""}>${t("status_actioned")}</option>
            <option value="Dismissed"${event.status === "Dismissed" ? " selected" : ""}>${t("status_dismissed")}</option>
          </select>
        </div>
        <div class="decline-reason-slot" data-id="${event.id}"></div>
        ${declineReasonHtml}
      </td>
    </tr>`;
}

function renderEventTable() {
  const filtered = getFilteredEvents();
  const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
  state.page = Math.min(state.page, totalPages);
  const start = (state.page - 1) * state.pageSize;
  const pageItems = filtered.slice(start, start + state.pageSize);

  const tbody = document.getElementById("event-table-body");

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="color:var(--muted); padding: 20px 14px;">${t("no_match")}</td></tr>`;
  } else {
    tbody.innerHTML = pageItems
      .map((e) => {
        const entityCell = e.clientName
          ? `<span class="entity-name">${escapeHtml(e.entityName)}</span><span class="client-link">${escapeHtml(e.clientName)}</span>`
          : `<span class="entity-name">${escapeHtml(e.entityName)}</span><span class="unlinked">${t("entity_unlinked")}</span>`;

        const row = `
        <tr class="event-row" data-id="${e.id}">
          <td><span class="pill ${CATEGORY_CLASS[e.category] || ""}">${escapeHtml(t(CATEGORY_KEY[e.category] || e.category))}</span></td>
          <td>${escapeHtml(e.eventType)}</td>
          <td class="entity-cell">${entityCell}</td>
          <td><span class="pill ${PRIORITY_CLASS[e.priority] || ""}">${escapeHtml(t(PRIORITY_KEY[e.priority] || e.priority))}</span></td>
          <td class="source-name">${escapeHtml(e.sourceName)}</td>
          <td><span class="pill ${STATUS_CLASS[e.status] || ""}">${escapeHtml(t(STATUS_KEY[e.status] || e.status))}</span></td>
          <td class="detected-cell">${new Date(e.detectedAt).toLocaleDateString(state.lang === "fr" ? "fr-FR" : "en-US")}</td>
          <td><button class="btn-navy view-btn" data-id="${e.id}">${state.expandedEventId === e.id ? t("btn_hide") : t("btn_view")}</button></td>
        </tr>`;
        return state.expandedEventId === e.id ? row + renderEventDetailRow(e) : row;
      })
      .join("");
  }

  attachEventTableHandlers();
  renderPagination(filtered.length, totalPages);
}

function attachEventTableHandlers() {
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      state.expandedEventId = state.expandedEventId === id ? null : id;
      renderEventTable();
    });
  });

  document.querySelectorAll(".analyze-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = Number(btn.dataset.id);
      btn.disabled = true;
      btn.textContent = t("btn_analyzing");
      state.analyzeErrors = state.analyzeErrors || {};
      delete state.analyzeErrors[id];
      try {
        const updated = await api(`/api/events/${id}/analyze`, { method: "POST" });
        const idx = state.events.findIndex((ev) => ev.id === updated.id);
        state.events[idx] = updated;
        renderEventTable();
      } catch (e) {
        state.analyzeErrors[id] = e.message;
        renderEventTable();
      } finally {
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll(".status-select").forEach((select) => {
    select.dataset.prevValue = select.value;
    select.addEventListener("change", async (e) => {
      const id = Number(select.dataset.id);
      const newStatus = e.target.value;

      if (newStatus === "Dismissed" || newStatus === "Actioned") {
        const placeholder = newStatus === "Actioned" ? t("action_comment_placeholder") : t("decline_reason_placeholder");
        const slot = document.querySelector(`.decline-reason-slot[data-id="${id}"]`);
        if (slot) {
          slot.innerHTML = `
            <div class="decline-reason-box">
              <input type="text" class="decline-reason-input" placeholder="${placeholder}" />
              <button class="btn-navy decline-reason-confirm">${t("btn_confirm")}</button>
              <button class="btn btn-outline decline-reason-cancel" style="padding:5px 12px;font-size:12px;">${t("btn_cancel")}</button>
            </div>`;
          slot.querySelector(".decline-reason-input").focus();

          slot.querySelector(".decline-reason-cancel").addEventListener("click", () => {
            select.value = select.dataset.prevValue;
            slot.innerHTML = "";
          });

          const confirmReason = async () => {
            const reason = slot.querySelector(".decline-reason-input").value.trim();
            const updated = await api(`/api/events/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: newStatus, reason }),
            });
            const idx = state.events.findIndex((ev) => ev.id === updated.id);
            state.events[idx] = updated;
            renderKPIs();
            renderEventTable();
          };
          slot.querySelector(".decline-reason-confirm").addEventListener("click", confirmReason);
          slot.querySelector(".decline-reason-input").addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") confirmReason();
          });
        }
        return;
      }

      const updated = await api(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const idx = state.events.findIndex((ev) => ev.id === updated.id);
      state.events[idx] = updated;
      renderKPIs();
      renderEventTable();
    });
  });
}

function renderPagination(totalCount, totalPages) {
  const el = document.getElementById("event-pagination");
  const start = totalCount === 0 ? 0 : (state.page - 1) * state.pageSize + 1;
  const end = Math.min(state.page * state.pageSize, totalCount);

  el.innerHTML = `
    <div class="page-size">
      ${t("pagination_page_size")}
      <select id="page-size-select">
        ${[10, 25, 50].map((n) => `<option value="${n}"${n === state.pageSize ? " selected" : ""}>${n}</option>`).join("")}
      </select>
    </div>
    <div>${t("pagination_range", start, end, totalCount)}</div>
    <div class="page-nav">
      <button id="page-first" ${state.page === 1 ? "disabled" : ""}>&laquo;</button>
      <button id="page-prev" ${state.page === 1 ? "disabled" : ""}>&lsaquo;</button>
      <span>${t("pagination_page_of", state.page, totalPages)}</span>
      <button id="page-next" ${state.page === totalPages ? "disabled" : ""}>&rsaquo;</button>
      <button id="page-last" ${state.page === totalPages ? "disabled" : ""}>&raquo;</button>
    </div>
  `;

  document.getElementById("page-size-select").addEventListener("change", (e) => {
    state.pageSize = Number(e.target.value);
    state.page = 1;
    renderEventTable();
  });
  document.getElementById("page-first").addEventListener("click", () => { state.page = 1; renderEventTable(); });
  document.getElementById("page-prev").addEventListener("click", () => { state.page = Math.max(1, state.page - 1); renderEventTable(); });
  document.getElementById("page-next").addEventListener("click", () => { state.page = Math.min(totalPages, state.page + 1); renderEventTable(); });
  document.getElementById("page-last").addEventListener("click", () => { state.page = totalPages; renderEventTable(); });
}

function exportCsv() {
  const filtered = getFilteredEvents();
  const headers = [
    t("col_category"), t("col_event_type"), t("col_entity"), t("col_client"),
    t("col_priority"), t("col_source"), t("col_status"), t("col_detected"),
  ];
  const rows = filtered.map((e) => [
    t(CATEGORY_KEY[e.category] || e.category), e.eventType, e.entityName, e.clientName || "",
    t(PRIORITY_KEY[e.priority] || e.priority), e.sourceName, t(STATUS_KEY[e.status] || e.status), e.detectedAt,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "veille-commerciale-intelligente-export.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function setupFilterActions() {
  document.getElementById("btn-search").addEventListener("click", () => {
    state.appliedFilters = readDraftFilters();
    state.page = 1;
    renderEventTable();
  });
  document.getElementById("btn-reset").addEventListener("click", () => {
    document.getElementById("filter-search").value = "";
    document.getElementById("filter-category").value = "";
    document.getElementById("filter-priority").value = "";
    document.getElementById("filter-status").value = "";
    state.appliedFilters = { search: "", category: "", priority: "", status: "" };
    state.page = 1;
    renderEventTable();
  });
  document.getElementById("btn-export").addEventListener("click", exportCsv);
  document.getElementById("filter-search").addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("btn-search").click();
  });
}

function renderSources() {
  const tbody = document.getElementById("sources-table-body");
  tbody.innerHTML = state.sources
    .map(
      (s) => `
      <tr>
        <td class="source-name">${escapeHtml(s.name)}</td>
        <td><span class="kind-pill ${s.kind}">${s.kind === "public" ? t("kind_public") : t("kind_private")}</span></td>
        <td>${escapeHtml(s.coverage)}</td>
        <td>${escapeHtml(s.description)}</td>
        <td><span class="status-tag ${s.status === "simulated" ? "simulated" : "planned"}">${s.status === "simulated" ? t("tag_simulated") : t("tag_planned")}</span></td>
      </tr>`
    )
    .join("");
}

function renderClients() {
  const tbody = document.getElementById("clients-table-body");
  tbody.innerHTML = state.clients
    .map(
      (c) => `
      <tr>
        <td class="source-name">${escapeHtml(c.name)}</td>
        <td><span class="type-pill ${c.isProspect ? "prospect" : "client"}">${c.isProspect ? t("client_type_prospect") : t("client_type_client")}</span></td>
        <td>${escapeHtml(c.segment)}</td>
        <td>${escapeHtml(c.rmOwner)}</td>
        <td>${c.linkedEntities ? c.linkedEntities.length : 0}</td>
        <td>${
          c.potentialProspectCount
            ? `<span class="opportunity-prospect-badge" title="${escapeHtml(t("opportunity_prospects_hint"))}">${t("opportunity_prospects_count", c.potentialProspectCount)}</span>`
            : `<span class="opportunity-prospect-none">—</span>`
        }</td>
        <td><button class="btn-navy client-view-btn" data-id="${c.id}">${t("btn_dashboard")}</button></td>
      </tr>`
    )
    .join("");

  document.querySelectorAll(".client-view-btn").forEach((btn) => {
    btn.addEventListener("click", () => openClientModal(btn.dataset.id));
  });
}

async function openClientModal(clientId) {
  const client = await api(`/api/clients/${clientId}`);
  state.modalClient = client;
  renderClientModalContent(client);
  document.getElementById("client-modal-overlay").hidden = false;
}

function closeClientModal() {
  document.getElementById("client-modal-overlay").hidden = true;
  state.modalClient = null;
}

function renderOwnershipBreakdown(client, entity) {
  const segments = [];
  if (typeof entity.client_stake_percent === "number") {
    segments.push({ name: client.name, percent: entity.client_stake_percent, isClient: true });
  }
  (entity.other_shareholders || []).forEach((h) => {
    const pct = parseFloat(h.stake);
    if (!isNaN(pct)) segments.push({ name: h.name, percent: pct, isClient: false });
  });
  if (!segments.length) return "";

  const palette = ["#2c2c54", "#6c7a89", "#a9b4bd", "#4b6584"];
  let paletteIdx = 0;
  segments.forEach((s) => {
    s.color = s.isClient ? "var(--red)" : palette[paletteIdx++ % palette.length];
  });

  const known = segments.reduce((sum, s) => sum + s.percent, 0);
  const remainder = Math.max(0, Math.round((100 - known) * 10) / 10);
  if (remainder > 0.5) {
    segments.push({ name: t("unidentified_stake"), percent: remainder, isUnknown: true, color: "var(--border)" });
  }

  const bar = segments
    .map(
      (s) =>
        `<span class="ownership-bar-segment${s.isUnknown ? " ownership-bar-unknown" : ""}" style="flex-basis:${s.percent}%;background:${s.color}" title="${escapeHtml(s.name)} — ${s.percent}%"></span>`
    )
    .join("");

  const legend = segments
    .map(
      (s) =>
        `<li class="ownership-legend-row"><span class="legend-dot" style="background:${s.color}"></span>${escapeHtml(s.name)}${
          s.isClient ? ` <em>(${t("this_client_label")})</em>` : ""
        }<span class="legend-percent">${s.percent}%</span></li>`
    )
    .join("");

  return `<div class="ownership-breakdown">
    <div class="ownership-bar">${bar}</div>
    <ul class="ownership-legend">${legend}</ul>
  </div>`;
}

function renderShareholdersBlock(entity) {
  const holders = entity.other_shareholders || [];
  if (!holders.length) return "";
  const rows = holders
    .map((h) => {
      const action = h.isClient
        ? `<span class="already-client-tag">${t("already_client_tag")}</span>`
        : `<button class="btn btn-outline btn-small convert-shareholder-btn" data-entity="${escapeHtml(entity.name)}" data-shareholder="${escapeHtml(h.name)}">${t("convert_to_client_btn")}</button>`;
      return `<li class="shareholder-row" data-shareholder-row="${escapeHtml(entity.name)}::${escapeHtml(h.name)}">
        <span>${escapeHtml(h.name)} <span class="relation">(${escapeHtml(h.stake)})</span></span>
        ${action}
      </li>`;
    })
    .join("");
  return `<ul class="other-shareholders">${rows}</ul>`;
}

function renderShareholdersSection(client) {
  const entitiesWithShareholders = (client.linkedEntities || []).filter((e) => e.other_shareholders && e.other_shareholders.length);
  if (!entitiesWithShareholders.length) return "";
  const blocks = entitiesWithShareholders
    .map(
      (e) => `<div class="other-shareholders-entity">
        <div class="other-shareholders-entity-name">${escapeHtml(e.name)}</div>
        ${renderShareholdersBlock(e)}
      </div>`
    )
    .join("");
  return `<div class="client-modal-section">
    <h3>${t("other_shareholders_section_title")}</h3>
    ${blocks}
    <p class="shareholder-convert-status" id="shareholder-convert-status"></p>
  </div>`;
}

function renderClientModalContent(client) {
  const chain = client.linkedEntities.length
    ? `<ul class="ownership-chain">${client.linkedEntities
        .map(
          (e) => `<li>
            <div class="ownership-chain-row"><span>${escapeHtml(e.name)}</span><span class="relation">${escapeHtml(e.relation)} · ${escapeHtml(e.jurisdiction)}</span></div>
            ${renderOwnershipBreakdown(client, e)}
          </li>`
        )
        .join("")}</ul>`
    : `<p style="font-size:13px;color:var(--muted);">${t("no_linked_entities")}</p>`;

  const LEGACY_STATUSES = new Set(["Actioned", "Dismissed"]);
  const signals = client.events && client.events.length
    ? client.events
        .map((e) => {
          const dateStr = new Date(e.detectedAt).toLocaleDateString(state.lang === "fr" ? "fr-FR" : "en-US");

          if (LEGACY_STATUSES.has(e.status)) {
            const reasonColor = e.status === "Dismissed" ? "var(--red)" : "var(--green)";
            const reason = e.declineReason
              ? `<div class="om" style="color:${reasonColor};">${statusCommentPrefix(e.status)} ${escapeHtml(e.declineReason)}</div>`
              : "";
            return `<div class="client-event-row client-event-row-legacy">
              <div class="legacy-review-line">
                <span class="legacy-review-date">${escapeHtml(t("crm_review_date_prefix"))} ${dateStr}</span>
                <span class="pill ${STATUS_CLASS[e.status] || ""}">${escapeHtml(t(STATUS_KEY[e.status] || e.status))}</span>
              </div>
              ${reason}
            </div>`;
          }

          return `<div class="client-event-row"><strong>${escapeHtml(e.eventType)}</strong> — ${escapeHtml(e.entityName)}
            <div class="ct">${escapeHtml(t(CATEGORY_KEY[e.category] || e.category))} · ${escapeHtml(t("signal_line", t(PRIORITY_KEY[e.priority] || e.priority), e.sourceName))}</div></div>`;
        })
        .join("")
    : `<p style="font-size:13px;color:var(--muted);">${t("no_signals_recorded")}</p>`;

  document.getElementById("client-modal-content").innerHTML = `
    <div class="client-modal-header">
      <h2>${escapeHtml(client.name)}</h2>
      <div class="segment">${escapeHtml(client.segment)}</div>
      <div class="rm">RM: ${escapeHtml(client.rmOwner)}</div>
    </div>

    <div class="client-modal-section">
      <h3>${t("shareholder_structure_title")}</h3>
      ${chain}
    </div>

    <div class="client-modal-actions">
      <button class="btn btn-primary" id="explore-opportunity-btn">${t("explore_opportunity_btn")}</button>
    </div>

    <div id="explore-opportunity-panel" hidden></div>

    <div class="client-modal-section">
      <h3>${t("linked_signals_title")}</h3>
      ${signals}
    </div>
  `;

  document.getElementById("explore-opportunity-btn").addEventListener("click", () => exploreCommercialOpportunity(client));
}

function wireShareholderConvertButtons(client) {
  document.querySelectorAll(".convert-shareholder-btn").forEach((btn) => {
    btn.addEventListener("click", () => convertShareholderToClient(client, btn));
  });
}

async function convertShareholderToClient(client, btn) {
  const entityName = btn.dataset.entity;
  const shareholderName = btn.dataset.shareholder;
  const statusEl = document.getElementById("shareholder-convert-status");
  const originalLabel = btn.textContent;
  btn.disabled = true;
  btn.textContent = t("converting_label");
  statusEl.textContent = "";
  statusEl.className = "shareholder-convert-status";

  try {
    const result = await api(`/api/clients/${client.id}/shareholders/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityName, shareholderName }),
    });

    const row = btn.closest(".shareholder-row");
    if (row) {
      row.querySelector("button")?.replaceWith(
        Object.assign(document.createElement("span"), {
          className: "already-client-tag",
          textContent: t("already_client_tag"),
        })
      );
    }
    statusEl.textContent = t("convert_success", shareholderName);
    statusEl.className = "shareholder-convert-status ok";

    await refreshClients();

    if (result.client && result.client.events && result.client.events.length) {
      const idx = state.events.findIndex((ev) => ev.id === result.client.events[0].id);
      if (idx === -1) state.events.push(result.client.events[0]);
      renderKPIs();
      renderEventTable();
    }
  } catch (e) {
    btn.disabled = false;
    btn.textContent = originalLabel;
    statusEl.textContent = e.message && e.message.includes("already a tracked client")
      ? t("convert_already_client", shareholderName)
      : `${t("convert_error_prefix")} ${e.message}`;
    statusEl.className = "shareholder-convert-status error";
  }
}

async function refreshClients() {
  const clients = await api("/api/clients");
  state.clients = clients;
  renderClientKPIs();
  renderClients();
}

function renderNoOpportunityBanner() {
  return `
    <div class="no-opportunity-banner">
      <strong>${t("no_opportunity_title")}</strong>
      ${t("no_opportunity_body")}
    </div>`;
}

const AGENT_PROGRESS_STEPS = ["progress_step_search", "progress_step_kyc", "progress_step_synthesis"];

function renderAgentProgress(panel, completedCount) {
  const rows = AGENT_PROGRESS_STEPS.map((key, i) => {
    const stepNum = i + 1;
    const isDone = stepNum <= completedCount;
    const isActive = stepNum === completedCount + 1;
    const icon = isDone ? '<span class="agent-progress-check">✓</span>' : isActive ? '<span class="agent-progress-spinner"></span>' : "";
    return `<div class="agent-progress-row${isDone ? " done" : ""}${isActive ? " active" : ""}">
      ${icon}
      <span class="agent-progress-label">${escapeHtml(t(key))}</span>
    </div>`;
  }).join("");
  panel.innerHTML = `<div class="client-modal-section"><h3>${t("scan_loading_title")}</h3><div class="agent-progress">${rows}</div></div>`;
}

function renderAgentFindingCard(g) {
  const ratingPill = g.priority
    ? `<span class="pill ${PRIORITY_CLASS[g.priority] || ""}">${escapeHtml(t(PRIORITY_KEY[g.priority] || g.priority))}</span>`
    : "";

  const details = g.error
    ? `<div class="ge">${t("scan_call_error_prefix")} ${escapeHtml(g.error)}</div>`
    : `
      <div class="agent-step">
        <div class="agent-step-label">${t("step_search_online")}</div>
        <p>${escapeHtml(t("step_search_online_placeholder"))}</p>
      </div>
      <div class="agent-step">
        <div class="agent-step-label">${t("step_kyc_check")}</div>
        <p>${escapeHtml(t("step_kyc_check_result", g.relation, g.jurisdiction))}</p>
      </div>
      <div class="agent-step">
        <div class="agent-step-label">${t("step_synthesis")}</div>
        <p>${escapeHtml(g.aiSummary)}</p>
      </div>
      <div class="agent-step">
        <div class="agent-step-label">${t("step_commercial_proposal")}</div>
        <p>${escapeHtml(g.aiSuggestedAction)}</p>
      </div>`;

  return `<div class="gap-row">
    <div class="synthesis-header">
      <div class="ot">${escapeHtml(g.entityName)} — ${escapeHtml(g.relation)} · ${escapeHtml(g.jurisdiction)}</div>
      ${ratingPill}
    </div>
    <div class="gap-added-tag">${t("gap_added_tag")}</div>
    <p class="synthesis-headline">${escapeHtml(g.error ? t("scan_call_error_prefix") : g.aiSuggestedAction || "")}</p>
    <button class="btn btn-outline btn-small gap-details-toggle" data-id="${g.id}">${t("btn_details")}</button>
    <div class="gap-details" hidden>${details}</div>
  </div>`;
}

function wireGapDetailsToggles() {
  document.querySelectorAll(".gap-details-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const details = btn.parentElement.querySelector(".gap-details");
      const isHidden = details.hidden;
      details.hidden = !isHidden;
      btn.textContent = isHidden ? t("btn_hide_details") : t("btn_details");
    });
  });
}

async function exploreCommercialOpportunity(client) {
  const panel = document.getElementById("explore-opportunity-panel");

  if (!panel.hidden && panel.dataset.loaded === "true") {
    panel.hidden = true;
    return;
  }

  panel.hidden = false;
  renderAgentProgress(panel, 0);

  const existingOpportunities = (client.events || []).filter((e) => e.category === "Commercial Opportunity");

  const fetchPromise = (async () => {
    try {
      return { scanResult: await api(`/api/clients/${client.id}/scan-opportunities`, { method: "POST" }), scanError: null };
    } catch (e) {
      return { scanResult: null, scanError: e.message };
    }
  })();

  const progressDelays = [500, 1100, 1700];
  const progressTimers = progressDelays.map(
    (delay, i) => new Promise((resolve) => setTimeout(() => { renderAgentProgress(panel, i + 1); resolve(); }, delay))
  );

  const [{ scanResult, scanError }] = await Promise.all([fetchPromise, ...progressTimers]);

  if (scanResult && scanResult.found) {
    scanResult.gaps.forEach((g) => {
      const idx = state.events.findIndex((ev) => ev.id === g.id);
      if (idx === -1) state.events.push(g);
      else state.events[idx] = g;
    });
    renderKPIs();
    renderEventTable();
  }

  const hasNewGaps = !!(scanResult && scanResult.found && scanResult.gaps.length);
  const hasExisting = existingOpportunities.length > 0;
  const shareholdersHtml = renderShareholdersSection(client);

  if (!hasExisting && !hasNewGaps && !scanError) {
    panel.innerHTML = `
      <div class="client-modal-section"><h3>${t("client_opportunities_title")}</h3>${renderNoOpportunityBanner()}</div>
      ${shareholdersHtml}
    `;
    panel.dataset.loaded = "true";
    wireShareholderConvertButtons(client);
    return;
  }

  const existingHtml = hasExisting
    ? existingOpportunities
        .map(
          (e) => `<div class="opportunity-row">
            <div class="ot">${escapeHtml(e.eventType)} — ${escapeHtml(e.entityName)}</div>
            <div class="om">${escapeHtml(e.description)}</div>
          </div>`
        )
        .join("")
    : `<p style="font-size:13px;color:var(--muted);">${t("client_opportunities_empty")}</p>`;

  const gapsHtml = hasNewGaps ? scanResult.gaps.map(renderAgentFindingCard).join("") : "";
  const errorHtml = scanError ? `<p class="ai-error">${t("scan_call_error_prefix")} ${escapeHtml(scanError)}</p>` : "";

  panel.innerHTML = `
    <div class="client-modal-section">
      <h3>${t("client_opportunities_title")}</h3>
      ${existingHtml}
    </div>
    ${
      hasNewGaps
        ? `<div class="client-modal-section">
      <h3>${t("agent_findings_title")}</h3>
      <p style="font-size:13px;color:var(--muted);margin:0 0 10px;">${t("gap_found_intro")}</p>
      ${gapsHtml}
    </div>`
        : ""
    }
    ${shareholdersHtml}
    ${errorHtml}
  `;
  panel.dataset.loaded = "true";
  wireShareholderConvertButtons(client);
  wireGapDetailsToggles();
}

async function renderAIStatus() {
  const status = await api("/api/ai/status");
  state.aiStatus = status;
  document.getElementById("ai-active-provider").textContent = t(PROVIDER_KEY[status.activeProvider] || status.activeProvider);
  document.getElementById("ai-status-note").textContent = status.azureFoundryConfigured
    ? t("ai_note_azure")
    : t("ai_note_demo");
}

function renderAIConfigHint() {
  const hintEl = document.getElementById("ai-config-key-hint");
  if (!hintEl || !state.aiConfig) return;
  hintEl.textContent = state.aiConfig.hasApiKey ? t("ai_config_key_set") : t("ai_config_key_unset");
}

async function loadAIConfig() {
  const config = await api("/api/ai/config");
  state.aiConfig = config;
  document.getElementById("ai-config-endpoint").value = config.endpoint || "";
  document.getElementById("ai-config-deployment").value = config.deployment || "";
  document.getElementById("ai-config-api-key").value = "";
  renderAIConfigHint();
}

function setupAIConfigForm() {
  document.getElementById("ai-config-save").addEventListener("click", async () => {
    const statusEl = document.getElementById("ai-config-status");
    const endpoint = document.getElementById("ai-config-endpoint").value.trim();
    const deployment = document.getElementById("ai-config-deployment").value.trim();
    const apiKey = document.getElementById("ai-config-api-key").value.trim();
    try {
      const updated = await api("/api/ai/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint, deployment, apiKey: apiKey || undefined }),
      });
      state.aiConfig = updated;
      document.getElementById("ai-config-api-key").value = "";
      renderAIConfigHint();
      statusEl.textContent = t("ai_config_saved");
      statusEl.className = "ai-config-status ok";
      await renderAIStatus();
    } catch (e) {
      statusEl.textContent = t("ai_config_error");
      statusEl.className = "ai-config-status error";
    }
  });

  document.getElementById("ai-config-clear").addEventListener("click", async () => {
    const statusEl = document.getElementById("ai-config-status");
    await api("/api/ai/config", { method: "DELETE" });
    state.aiConfig = { endpoint: "", deployment: "", hasApiKey: false };
    document.getElementById("ai-config-endpoint").value = "";
    document.getElementById("ai-config-deployment").value = "";
    document.getElementById("ai-config-api-key").value = "";
    renderAIConfigHint();
    statusEl.textContent = t("ai_config_cleared");
    statusEl.className = "ai-config-status ok";
    await renderAIStatus();
  });
}

function renderAll() {
  populateCategoryFilter();
  renderKPIs();
  renderEventTable();
  renderSources();
  renderClientKPIs();
  renderClients();
  renderAIConfigHint();
  if (state.aiStatus) {
    document.getElementById("ai-active-provider").textContent = t(PROVIDER_KEY[state.aiStatus.activeProvider] || state.aiStatus.activeProvider);
    document.getElementById("ai-status-note").textContent = state.aiStatus.azureFoundryConfigured
      ? t("ai_note_azure")
      : t("ai_note_demo");
  }
}

async function init() {
  document.documentElement.lang = state.lang;
  setupTabs();
  setupLangSwitch();
  setupFilterActions();
  setupLogoFallback();
  setupAIConfigForm();
  setupClientModal();
  applyStaticTranslations();

  const [meta, events, sources, clients] = await Promise.all([
    api("/api/meta"),
    api("/api/events"),
    api("/api/sources"),
    api("/api/clients"),
  ]);

  state.categories = meta.categories;
  state.events = events;
  state.sources = sources;
  state.clients = clients;

  renderAll();
  renderAIStatus();
  loadAIConfig();
}

init();
