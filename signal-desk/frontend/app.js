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
    status_new: "New",
    status_review: "Under Review",
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
    kpi_new: "Awaiting triage",
    kpi_risk: "Risk & compliance",
    kpi_opportunities: "Commercial opportunities",
    client_type_client: "Client",
    client_type_prospect: "Prospect",
    clients_kpi_clients: "Existing clients",
    clients_kpi_prospects: "Prospects",
    cat_commercial: "Commercial Opportunity",
    cat_credit: "Corporate & Credit",
    cat_kyc: "KYC Update",
    cat_risk: "Risk & Compliance",
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
    scan_agent_btn: "Check with AI agent",
    scan_loading: "Checking internal referential…",
    no_opportunity_title: "No opportunity for this legal entity",
    no_opportunity_body: "The AI agent cross-checked the shareholder structure against tracked signals and found nothing new.",
    gap_found_intro: "The agent found linked entities with no signal on file yet:",
    client_opportunities_title: "Commercial opportunity signals",
    client_opportunities_empty: "No commercial opportunity signals on file for this client.",
    linked_signals_empty_short: "No linked signals.",
    decline_reason_label: "Reason for not pursuing this opportunity",
    decline_reason_placeholder: "e.g. client not interested, insufficient fit…",
    decline_reason_prefix: "Decline reason:",
    btn_confirm: "Confirm",
    btn_cancel: "Cancel",
    scan_call_error_prefix: "Check failed:",
    btn_dashboard: "Dashboard",
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
    status_new: "Nouveau",
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
    kpi_new: "En attente de tri",
    kpi_risk: "Risque & conformité",
    kpi_opportunities: "Opportunités commerciales",
    client_type_client: "Client",
    client_type_prospect: "Prospect",
    clients_kpi_clients: "Clients existants",
    clients_kpi_prospects: "Prospects",
    cat_commercial: "Opportunité Commerciale",
    cat_credit: "Entreprise & Crédit",
    cat_kyc: "Mise à jour KYC",
    cat_risk: "Risque & Conformité",
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
    scan_agent_btn: "Vérifier avec l'agent IA",
    scan_loading: "Vérification du référentiel interne…",
    no_opportunity_title: "Aucune opportunité pour cette entité juridique",
    no_opportunity_body: "L'agent IA a comparé la structure actionnariale aux signaux suivis et n'a rien trouvé de nouveau.",
    gap_found_intro: "L'agent a trouvé des entités liées sans signal enregistré :",
    client_opportunities_title: "Signaux d'opportunité commerciale",
    client_opportunities_empty: "Aucun signal d'opportunité commerciale enregistré pour ce client.",
    linked_signals_empty_short: "Aucun signal lié.",
    decline_reason_label: "Motif de non-poursuite de cette opportunité",
    decline_reason_placeholder: "ex. : client non intéressé, profil non adapté…",
    decline_reason_prefix: "Motif du rejet :",
    btn_confirm: "Confirmer",
    btn_cancel: "Annuler",
    scan_call_error_prefix: "Échec de la vérification :",
    btn_dashboard: "Tableau de bord",
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
  "Corporate & Credit": "cat-credit",
  "KYC Update": "cat-kyc",
  "Risk & Compliance": "cat-risk",
};

const CATEGORY_KEY = {
  "Commercial Opportunity": "cat_commercial",
  "Corporate & Credit": "cat_credit",
  "KYC Update": "cat_kyc",
  "Risk & Compliance": "cat_risk",
};

const PRIORITY_CLASS = { High: "pri-high", Medium: "pri-medium", Low: "pri-low" };
const PRIORITY_KEY = { High: "priority_high", Medium: "priority_medium", Low: "priority_low" };

const STATUS_CLASS = {
  New: "status-new",
  "Under Review": "status-review",
  Actioned: "status-actioned",
  Dismissed: "status-dismissed",
};
const STATUS_KEY = {
  New: "status_new",
  "Under Review": "status_review",
  Actioned: "status_actioned",
  Dismissed: "status_dismissed",
};

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
  const newCount = state.events.filter((e) => e.status === "New").length;
  const risk = state.events.filter((e) => e.category === "Risk & Compliance").length;

  const kpis = [
    { value: total, label: t("kpi_total") },
    { value: opportunities, label: t("kpi_opportunities"), accent: true },
    { value: high, label: t("kpi_high") },
    { value: newCount, label: t("kpi_new") },
    { value: risk, label: t("kpi_risk") },
  ];

  document.getElementById("kpis").innerHTML = kpis
    .map((k) => `<div class="kpi-card${k.accent ? " kpi-accent" : ""}"><div class="value">${k.value}</div><div class="label">${k.label}</div></div>`)
    .join("");
}

function renderClientKPIs() {
  const clients = state.clients.filter((c) => !c.isProspect).length;
  const prospects = state.clients.filter((c) => c.isProspect).length;

  const kpis = [
    { value: clients, label: t("clients_kpi_clients") },
    { value: prospects, label: t("clients_kpi_prospects"), accent: true },
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
    ? `<p class="decline-reason-note">${t("decline_reason_prefix")} ${escapeHtml(event.declineReason)}</p>`
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
            <option value="New"${event.status === "New" ? " selected" : ""}>${t("status_new")}</option>
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

      if (newStatus === "Dismissed") {
        const slot = document.querySelector(`.decline-reason-slot[data-id="${id}"]`);
        if (slot) {
          slot.innerHTML = `
            <div class="decline-reason-box">
              <input type="text" class="decline-reason-input" placeholder="${t("decline_reason_placeholder")}" />
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

function renderClientModalContent(client) {
  const chain = client.linkedEntities.length
    ? `<ul class="ownership-chain">${client.linkedEntities
        .map((e) => `<li><span>${escapeHtml(e.name)}</span><span class="relation">${escapeHtml(e.relation)} · ${escapeHtml(e.jurisdiction)}</span></li>`)
        .join("")}</ul>`
    : `<p style="font-size:13px;color:var(--muted);">${t("no_linked_entities")}</p>`;

  const signals = client.events && client.events.length
    ? client.events
        .map((e) => {
          const decline = e.declineReason
            ? `<div class="om" style="color:var(--red);">${t("decline_reason_prefix")} ${escapeHtml(e.declineReason)}</div>`
            : "";
          return `<div class="client-event-row"><strong>${escapeHtml(e.eventType)}</strong> — ${escapeHtml(e.entityName)}
            <div class="ct">${escapeHtml(t(CATEGORY_KEY[e.category] || e.category))} · ${escapeHtml(t("signal_line", t(PRIORITY_KEY[e.priority] || e.priority), e.sourceName))}</div>${decline}</div>`;
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
      <button class="btn btn-outline" id="scan-agent-btn">${t("scan_agent_btn")}</button>
    </div>

    <div id="explore-opportunity-panel" hidden></div>
    <div id="scan-result-panel" hidden></div>

    <div class="client-modal-section">
      <h3>${t("linked_signals_title")}</h3>
      ${signals}
    </div>
  `;

  document.getElementById("explore-opportunity-btn").addEventListener("click", () => toggleExploreOpportunities(client));
  document.getElementById("scan-agent-btn").addEventListener("click", () => scanForMissedOpportunities(client));
}

function toggleExploreOpportunities(client) {
  const panel = document.getElementById("explore-opportunity-panel");
  if (!panel.hidden) {
    panel.hidden = true;
    return;
  }
  const opportunities = (client.events || []).filter((e) => e.category === "Commercial Opportunity");
  const list = opportunities.length
    ? opportunities
        .map(
          (e) => `<div class="opportunity-row">
            <div class="ot">${escapeHtml(e.eventType)} — ${escapeHtml(e.entityName)}</div>
            <div class="om">${escapeHtml(e.description)}</div>
          </div>`
        )
        .join("")
    : `<p style="font-size:13px;color:var(--muted);">${t("client_opportunities_empty")}</p>`;

  panel.innerHTML = `<div class="client-modal-section"><h3>${t("client_opportunities_title")}</h3>${list}</div>`;
  panel.hidden = false;
}

async function scanForMissedOpportunities(client) {
  const panel = document.getElementById("scan-result-panel");
  panel.hidden = false;
  panel.innerHTML = `<p class="scan-loading">${t("scan_loading")}</p>`;

  try {
    const result = await api(`/api/clients/${client.id}/scan-opportunities`, { method: "POST" });

    if (!result.found) {
      panel.innerHTML = `
        <div class="no-opportunity-banner">
          <strong>${t("no_opportunity_title")}</strong>
          ${t("no_opportunity_body")}
        </div>`;
      return;
    }

    const gapsHtml = result.gaps
      .map((g) => {
        const body = g.error
          ? `<div class="ge">${t("scan_call_error_prefix")} ${escapeHtml(g.error)}</div>`
          : `<div class="om">${escapeHtml(g.summary)}</div><div class="ga">${escapeHtml(g.suggestedAction)}</div>`;
        return `<div class="gap-row">
          <div class="ot">${escapeHtml(g.entityName)} — ${escapeHtml(g.relation)} · ${escapeHtml(g.jurisdiction)}</div>
          ${body}
        </div>`;
      })
      .join("");

    panel.innerHTML = `
      <div class="client-modal-section">
        <h3>${t("scan_agent_btn")}</h3>
        <p style="font-size:13px;color:var(--muted);margin:0 0 10px;">${t("gap_found_intro")}</p>
        ${gapsHtml}
      </div>`;
  } catch (e) {
    panel.innerHTML = `<p class="ai-error">${t("scan_call_error_prefix")} ${escapeHtml(e.message)}</p>`;
  }
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
