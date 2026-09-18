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
    col_segment: "Segment",
    col_rm: "RM owner",
    col_linked_entities: "Linked entities",
    kpi_total: "Total signals",
    kpi_high: "High priority",
    kpi_new: "Awaiting triage",
    kpi_risk: "Risk & compliance",
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
      "<strong>Azure AI Foundry (ready, not yet connected):</strong> setting <code>AZURE_AI_FOUNDRY_ENDPOINT</code> and <code>AZURE_AI_FOUNDRY_API_KEY</code> as environment variables on the backend switches every “Analyze” call to a real model deployment — same interface, richer output.",
    ai_env_endpoint: "https://&lt;resource&gt;.services.ai.azure.com",
    ai_env_key: "secret — set in your host's env, never in code",
    ai_env_deployment: "defaults to gpt-4o-mini",
    ai_note_demo:
      "Set AZURE_AI_FOUNDRY_ENDPOINT and AZURE_AI_FOUNDRY_API_KEY as environment variables to switch from the demo engine to a live Azure AI Foundry model deployment — no code change required.",
    ai_note_azure: "This deployment is running on a live Azure AI Foundry model.",
    provider_mock: "Rule-based demo engine",
    provider_azure: "Azure AI Foundry",
    no_match: "No signals match these filters.",
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
    col_segment: "Segment",
    col_rm: "Chargé de relation",
    col_linked_entities: "Entités liées",
    kpi_total: "Signaux totaux",
    kpi_high: "Priorité élevée",
    kpi_new: "En attente de tri",
    kpi_risk: "Risque & conformité",
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
      "<strong>Azure AI Foundry (prêt, non connecté) :</strong> définir <code>AZURE_AI_FOUNDRY_ENDPOINT</code> et <code>AZURE_AI_FOUNDRY_API_KEY</code> comme variables d'environnement sur le backend fait basculer chaque analyse vers un modèle réel — même interface, résultat plus riche.",
    ai_env_endpoint: "https://&lt;ressource&gt;.services.ai.azure.com",
    ai_env_key: "secret — à définir dans l'environnement de l'hôte, jamais dans le code",
    ai_env_deployment: "par défaut : gpt-4o-mini",
    ai_note_demo:
      "Définissez AZURE_AI_FOUNDRY_ENDPOINT et AZURE_AI_FOUNDRY_API_KEY comme variables d'environnement pour passer du moteur de démonstration à un modèle Azure AI Foundry réel — aucune modification de code requise.",
    ai_note_azure: "Ce déploiement fonctionne actuellement avec un modèle Azure AI Foundry réel.",
    provider_mock: "Moteur de démonstration à base de règles",
    provider_azure: "Azure AI Foundry",
    no_match: "Aucun signal ne correspond à ces filtres.",
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
  expandedClientId: null,
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
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
  return res.json();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
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
  const high = state.events.filter((e) => e.priority === "High").length;
  const newCount = state.events.filter((e) => e.status === "New").length;
  const risk = state.events.filter((e) => e.category === "Risk & Compliance").length;

  const kpis = [
    { value: total, label: t("kpi_total") },
    { value: high, label: t("kpi_high") },
    { value: newCount, label: t("kpi_new") },
    { value: risk, label: t("kpi_risk") },
  ];

  document.getElementById("kpis").innerHTML = kpis
    .map((k) => `<div class="kpi-card"><div class="value">${k.value}</div><div class="label">${k.label}</div></div>`)
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

  return `
    <tr class="detail-row" data-detail-for="${event.id}">
      <td colspan="8">
        <p class="detail-desc">${escapeHtml(event.description)}</p>
        ${aiHtml}
        <div class="detail-actions">
          <button class="btn-navy analyze-btn" data-id="${event.id}">${event.aiSummary ? t("btn_reanalyze") : t("btn_analyze")}</button>
          <select class="status-select" data-id="${event.id}">
            <option value="New"${event.status === "New" ? " selected" : ""}>${t("status_new")}</option>
            <option value="Under Review"${event.status === "Under Review" ? " selected" : ""}>${t("status_review")}</option>
            <option value="Actioned"${event.status === "Actioned" ? " selected" : ""}>${t("status_actioned")}</option>
            <option value="Dismissed"${event.status === "Dismissed" ? " selected" : ""}>${t("status_dismissed")}</option>
          </select>
        </div>
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
      try {
        const updated = await api(`/api/events/${id}/analyze`, { method: "POST" });
        const idx = state.events.findIndex((ev) => ev.id === updated.id);
        state.events[idx] = updated;
        renderEventTable();
      } finally {
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll(".status-select").forEach((select) => {
    select.addEventListener("change", async (e) => {
      const id = Number(select.dataset.id);
      const updated = await api(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: e.target.value }),
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
  a.download = "signal-desk-export.csv";
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

function renderClientDetailRow(client) {
  const chain = client.linkedEntities.length
    ? `<ul class="ownership-chain">${client.linkedEntities
        .map((e) => `<li><span>${escapeHtml(e.name)}</span><span class="relation">${escapeHtml(e.relation)} · ${escapeHtml(e.jurisdiction)}</span></li>`)
        .join("")}</ul>`
    : `<p style="font-size:13px;color:var(--muted);">${t("no_linked_entities")}</p>`;

  const events = client.events && client.events.length
    ? client.events
        .map(
          (e) => `<div class="client-event-row"><strong>${escapeHtml(e.eventType)}</strong> — ${escapeHtml(e.entityName)}
            <div class="ct">${escapeHtml(t(CATEGORY_KEY[e.category] || e.category))} · ${escapeHtml(t("signal_line", t(PRIORITY_KEY[e.priority] || e.priority), e.sourceName))}</div></div>`
        )
        .join("")
    : `<p style="font-size:13px;color:var(--muted);">${t("no_signals_recorded")}</p>`;

  return `
    <tr class="detail-row" data-client-detail-for="${client.id}">
      <td colspan="5" class="client-details-cell">
        <div class="client-events-title">${t("ownership_chain_title")}</div>
        ${chain}
        <div class="client-events-title">${t("linked_signals_title")}</div>
        ${events}
      </td>
    </tr>`;
}

function renderClients() {
  const tbody = document.getElementById("clients-table-body");
  tbody.innerHTML = state.clients
    .map((c) => {
      const row = `
      <tr>
        <td class="source-name">${escapeHtml(c.name)}</td>
        <td>${escapeHtml(c.segment)}</td>
        <td>${escapeHtml(c.rmOwner)}</td>
        <td>${c.linkedEntities ? c.linkedEntities.length : 0}</td>
        <td><button class="btn-navy client-view-btn" data-id="${c.id}">${state.expandedClientId === c.id ? t("btn_hide") : t("btn_view")}</button></td>
      </tr>`;
      const detail = state.expandedClientId === c.id && state.loadedClientDetail && state.loadedClientDetail.id === c.id
        ? renderClientDetailRow(state.loadedClientDetail)
        : "";
      return row + detail;
    })
    .join("");

  document.querySelectorAll(".client-view-btn").forEach((btn) => {
    btn.addEventListener("click", () => toggleClient(btn.dataset.id));
  });
}

async function toggleClient(clientId) {
  if (state.expandedClientId === clientId) {
    state.expandedClientId = null;
    renderClients();
    return;
  }
  const client = await api(`/api/clients/${clientId}`);
  state.expandedClientId = clientId;
  state.loadedClientDetail = client;
  renderClients();
}

async function renderAIStatus() {
  const status = await api("/api/ai/status");
  state.aiStatus = status;
  document.getElementById("ai-active-provider").textContent = t(PROVIDER_KEY[status.activeProvider] || status.activeProvider);
  document.getElementById("ai-status-note").textContent = status.azureFoundryConfigured
    ? t("ai_note_azure")
    : t("ai_note_demo");
}

function renderAll() {
  populateCategoryFilter();
  renderKPIs();
  renderEventTable();
  renderSources();
  renderClients();
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
}

init();
