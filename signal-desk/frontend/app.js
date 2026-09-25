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
    clients_title: "Clients and prospects",
    ownership_chain_title: "Ownership chain",
    linked_signals_title: "Previous signals",
    previous_signals_empty: "No previous signal for this client.",
    prev_col_name: "Person / denomination",
    prev_col_date: "Date",
    prev_col_type: "Type",
    prev_col_status: "Status",
    prev_col_reason: "Rejection reason",
    outcome_success: "Success",
    outcome_rejected: "Rejected",
    no_linked_entities: "No linked entities recorded.",
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
    shareholder_structure_title: "Shareholder structure",
    explore_opportunity_btn: "Explore commercial opportunity",
    scan_loading_title: "Agent sequence running…",
    progress_step_search: "1/1 Multi-sources web searches",
    progress_step_kyc: "2/2 Person KYC data comparison",
    progress_step_synthesis: "3/3 Commercial opportunities synthesis preparation",
    no_opportunity_title: "No opportunity for this legal entity",
    no_opportunity_body: "The AI agent cross-checked the shareholder structure against tracked signals and found nothing new.",
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
    other_shareholders_label: "Other shareholders",
    already_client_tag: "Already a client",
    btn_details: "Details",
    btn_hide_details: "Hide details",
    rating_label: "Level",
    synthesis_title: "Commercial opportunity synthesis",
    synthesis_text: (n, type, entity) => `${n} pending commercial opportunit${n > 1 ? "ies" : "y"} — main one: ${type} (${entity}).`,
    level_high: "High",
    level_medium: "Medium",
    level_low: "Low",
    details_sources_title: "Sources identified by the agents",
    details_opportunities_title: "Opportunities detected",
    details_updates_title: "Proposed referential updates",
    referential_update_line: (name, stake, entity, source) => `${name} (${stake}) found as a shareholder of ${entity} via ${source} — missing from our referential.`,
    btn_apply_update: "Apply update",
    update_applied: (name) => `Referential updated — ${name} added to the shareholder structure.`,
    no_sources: "No source identified.",
    veille_unavailable: "AI monitoring synthesis unavailable:",
    veille_fact_aml: "AML risk",
    veille_fact_pep: "PEP status",
    veille_fact_kyc: "KYC assessment",
    veille_fact_priority: "Review priority",
    convert_to_client_btn: "Make this shareholder a client",
    converting_label: "Converting…",
    convert_success: (name) => `${name} was added as a new prospect — a commercial opportunity signal was created and analyzed. See the Clients tab.`,
    convert_error_prefix: "Conversion failed:",
    convert_already_client: (name) => `${name} is already a tracked client.`,
    this_client_label: "this client",
    unidentified_stake: "Unidentified shareholders",
    clients_kpi_opportunity_prospects: "Opportunity prospects identified",
    crm_review_date_prefix: "CRM review:",
    btn_veille_history: "Veille history",
    veille_history_title: "Veille history",
    veille_history_empty: "No veille run recorded yet for this client.",
    veille_history_level_label: "Level",
    veille_history_provider_label: "Engine",
    veille_history_error_prefix: "Error:",
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
    kpi_pending: "En cours d'examen",
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
    clients_title: "Clients et prospects",
    ownership_chain_title: "Chaîne d'actionnariat",
    linked_signals_title: "Signaux précédents",
    previous_signals_empty: "Aucun signal précédent pour ce client.",
    prev_col_name: "Personne / dénomination",
    prev_col_date: "Date",
    prev_col_type: "Type",
    prev_col_status: "Statut",
    prev_col_reason: "Motif du rejet",
    outcome_success: "Succès",
    outcome_rejected: "Rejeté",
    no_linked_entities: "Aucune entité liée enregistrée.",
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
    shareholder_structure_title: "Structure actionnariale",
    explore_opportunity_btn: "Explorer l'opportunité commerciale",
    scan_loading_title: "Séquence d'agents en cours…",
    progress_step_search: "1/1 Recherches web multi-sources",
    progress_step_kyc: "2/2 Comparaison des données KYC des référentiels",
    progress_step_synthesis: "3/3 Préparation de la synthèse des opportunités commerciales",
    no_opportunity_title: "Aucune opportunité pour cette entité juridique",
    no_opportunity_body: "L'agent IA a comparé la structure actionnariale aux signaux suivis et n'a rien trouvé de nouveau.",
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
    btn_dashboard: "Signaux",
    gap_added_tag: "Ajouté au répertoire des signaux",
    other_shareholders_label: "Autres actionnaires",
    already_client_tag: "Déjà client",
    btn_details: "Détails",
    btn_hide_details: "Masquer les détails",
    rating_label: "Niveau",
    synthesis_title: "Synthèse de l'opportunité commerciale",
    synthesis_text: (n, type, entity) => `${n} opportunité${n > 1 ? "s" : ""} commerciale${n > 1 ? "s" : ""} en cours — principale : ${type} (${entity}).`,
    level_high: "Élevé",
    level_medium: "Moyen",
    level_low: "Faible",
    details_sources_title: "Sources identifiées par les agents",
    details_opportunities_title: "Opportunités détectées",
    details_updates_title: "Mises à jour proposées du référentiel",
    referential_update_line: (name, stake, entity, source) => `${name} (${stake}) identifié comme actionnaire de ${entity} via ${source} — absent de notre référentiel.`,
    btn_apply_update: "Appliquer la mise à jour",
    update_applied: (name) => `Référentiel mis à jour — ${name} ajouté à la structure actionnariale.`,
    no_sources: "Aucune source identifiée.",
    veille_unavailable: "Synthèse de veille IA indisponible :",
    veille_fact_aml: "Risque AML",
    veille_fact_pep: "Statut PEP",
    veille_fact_kyc: "Évaluation KYC",
    veille_fact_priority: "Priorité de revue",
    convert_to_client_btn: "Faire de cet actionnaire un client",
    converting_label: "Conversion en cours…",
    convert_success: (name) => `${name} a été ajouté comme nouveau prospect — un signal d'opportunité commerciale a été créé et analysé. Voir l'onglet Clients.`,
    convert_error_prefix: "Échec de la conversion :",
    convert_already_client: (name) => `${name} est déjà un client suivi.`,
    this_client_label: "ce client",
    unidentified_stake: "Actionnaires non identifiés",
    clients_kpi_opportunity_prospects: "Prospects opportunité identifiés",
    crm_review_date_prefix: "Revue CRM :",
    btn_veille_history: "Historique de veille",
    veille_history_title: "Historique de veille",
    veille_history_empty: "Aucune veille enregistrée pour ce client pour le moment.",
    veille_history_level_label: "Niveau",
    veille_history_provider_label: "Moteur",
    veille_history_error_prefix: "Erreur :",
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

function renderMarkdown(markdown) {
  if (window.marked && window.DOMPurify) {
    return window.DOMPurify.sanitize(window.marked.parse(markdown || ""));
  }
  return `<pre>${escapeHtml(markdown || "")}</pre>`;
}

// POST /api/veille — the commercial monitoring + KYC pipeline. Resolves with
// {synthese} on success, {notFound} when the client is not in the internal KYC
// referential (the demo clients), or {error} when the pipeline fails.
async function runVeille(clientId) {
  try {
    const res = await fetch("/api/veille", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok) return { synthese: body.synthese };
    if (res.status === 404) return { notFound: true };
    return { error: body.detail || `/api/veille failed: ${res.status}` };
  } catch (e) {
    return { error: e.message };
  }
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
  document.getElementById("veille-history-close").addEventListener("click", closeVeilleHistory);
  document.getElementById("veille-history-overlay").addEventListener("click", (e) => {
    if (e.target.id === "veille-history-overlay") closeVeilleHistory();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeClientModal();
      closeVeilleHistory();
    }
  });
}

// POST the completed veille/agent-run result so it is kept in the SQLite
// history for this client — best-effort, never blocks the UI.
async function saveVeilleRun(client, result) {
  try {
    await api(`/api/clients/${client.id}/veille-runs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: client.name,
        level: result.level || null,
        provider: result.provider || null,
        synthese: result.veille?.synthese || null,
        error: result.veille?.error || null,
        result,
      }),
    });
    const btn = document.querySelector(`.veille-history-btn[data-id="${client.id}"]`);
    if (btn) btn.disabled = false;
  } catch (e) {
    // Non-blocking: the veille result itself already rendered successfully.
  }
}

function closeVeilleHistory() {
  document.getElementById("veille-history-overlay").hidden = true;
}

async function openVeilleHistory(client) {
  const overlay = document.getElementById("veille-history-overlay");
  const content = document.getElementById("veille-history-content");
  overlay.hidden = false;
  content.innerHTML = `<h2>${escapeHtml(t("veille_history_title"))}</h2><p>…</p>`;
  let runs = [];
  try {
    runs = await api(`/api/clients/${client.id}/veille-runs`);
  } catch (e) {
    content.innerHTML = `<h2>${escapeHtml(t("veille_history_title"))}</h2><p class="ai-error">${escapeHtml(e.message)}</p>`;
    return;
  }
  content.innerHTML = renderVeilleHistory(client, runs);
  content.querySelectorAll(".veille-history-rendered").forEach(wireVeilleTabs);
}

function renderVeilleHistory(client, runs) {
  const fmt = (d) =>
    new Date(d).toLocaleString(state.lang === "fr" ? "fr-FR" : "en-US");
  const rows = runs.length
          ? runs
              .map(
                (run) => `<div class="veille-history-row">
            <div class="veille-history-row-header">
              <span class="veille-history-date">${escapeHtml(fmt(run.createdAt))}</span>
              ${run.level ? `<span class="pill ${PRIORITY_CLASS[run.level] || ""}">${escapeHtml(t("veille_history_level_label"))} : ${escapeHtml(t(LEVEL_KEY[run.level] || run.level))}</span>` : ""}
              ${run.provider ? `<span class="veille-history-provider">${escapeHtml(t("veille_history_provider_label"))} : ${escapeHtml(t(PROVIDER_KEY[run.provider] || run.provider))}</span>` : ""}
            </div>
                   ${run.synthese ? `<div class="veille-history-rendered">${renderVeille(run.synthese)}</div>` : ""}
            ${run.error ? `<p class="veille-error">${escapeHtml(t("veille_history_error_prefix"))} ${escapeHtml(run.error)}</p>` : ""}
          </div>`
        )
        .join("")
    : `<p class="details-empty">${escapeHtml(t("veille_history_empty"))}</p>`;
  return `<h2>${escapeHtml(t("veille_history_title"))} — ${escapeHtml(client.name)}</h2>${rows}`;
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

  const declineReasonHtml = event.declineReason
    ? `<p class="decline-reason-note${event.status === "Actioned" ? " actioned" : ""}">${statusCommentPrefix(event.status)} ${escapeHtml(event.declineReason)}</p>`
    : "";

  return `
    <tr class="detail-row" data-detail-for="${event.id}">
      <td colspan="8">
        <p class="detail-desc">${escapeHtml(event.description)}</p>
        ${aiHtml}
        <div class="detail-actions">
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
        <td class="client-actions-cell">
          <button class="btn-navy client-view-btn" data-id="${c.id}">${t("btn_dashboard")}</button>
          <button class="btn btn-outline btn-small veille-history-btn" data-id="${c.id}" data-name="${escapeHtml(c.name)}" disabled>${t("btn_veille_history")}</button>
        </td>
      </tr>`
    )
    .join("");

  document.querySelectorAll(".client-view-btn").forEach((btn) => {
    btn.addEventListener("click", () => openClientModal(btn.dataset.id));
  });
  document.querySelectorAll(".veille-history-btn").forEach((btn) => {
    btn.addEventListener("click", () => openVeilleHistory({ id: btn.dataset.id, name: btn.dataset.name }));
  });
  refreshVeilleHistoryButtons();
}

// Enables each row's history button only when that client actually has at
// least one stored veille run, keeping it disabled otherwise.
async function refreshVeilleHistoryButtons() {
  let summary = {};
  try {
    summary = await api("/api/veille-runs/summary");
  } catch (e) {
    return;
  }
  document.querySelectorAll(".veille-history-btn").forEach((btn) => {
    const entry = summary[btn.dataset.id];
    btn.disabled = !entry || !entry.count;
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
      <div id="linked-signals-list">${renderLinkedSignals(client)}</div>
    </div>
  `;

  document.getElementById("explore-opportunity-btn").addEventListener("click", () => exploreCommercialOpportunity(client));
}

// "Previous signals": only closed signals (Actioned = success, Dismissed =
// rejected) — pending ones are worked from the Signal Directory.
const OUTCOME = {
  Actioned: { key: "outcome_success", cls: "outcome-success" },
  Dismissed: { key: "outcome_rejected", cls: "outcome-rejected" },
};

function renderLinkedSignals(client) {
  const previous = (client.events || []).filter((e) => OUTCOME[e.status]);
  if (!previous.length) return `<p class="details-empty">${t("previous_signals_empty")}</p>`;
  const locale = state.lang === "fr" ? "fr-FR" : "en-US";
  const rows = previous
    .map((e) => {
      const outcome = OUTCOME[e.status];
      const reason = e.status === "Dismissed" && e.declineReason ? escapeHtml(e.declineReason) : "—";
      return `<tr class="previous-signal-row">
        <td>${escapeHtml(e.entityName)}</td>
        <td>${new Date(e.detectedAt).toLocaleDateString(locale)}</td>
        <td>${escapeHtml(e.eventType)}</td>
        <td><span class="pill ${outcome.cls}">${escapeHtml(t(outcome.key))}</span></td>
        <td>${reason}</td>
      </tr>`;
    })
    .join("");
  return `<table class="previous-signals-table">
    <thead><tr>
      <th>${t("prev_col_name")}</th><th>${t("prev_col_date")}</th><th>${t("prev_col_type")}</th>
      <th>${t("prev_col_status")}</th><th>${t("prev_col_reason")}</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
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
    const entity = client.linkedEntities.find((e) => e.name === entityName);
    const holder = entity && (entity.other_shareholders || []).find((h) => h.name === shareholderName);
    if (holder) holder.isClient = true;
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

const AGENT_PROGRESS_STEPS = ["progress_step_search", "progress_step_kyc", "progress_step_synthesis"];
const LEVEL_KEY = { High: "level_high", Medium: "level_medium", Low: "level_low" };

// The veille agent answers in Markdown: "## 1) Constat & Signaux Business",
// "## 2) Impacts KYC", "## 3) Recommandations Commerciales", with the key KYC
// facts written as "**Risque AML interne** : `High`".
const VEILLE_FACTS = [
  { key: "veille_fact_aml", re: /Risque AML[^:\n]*:\s*[`*]*([^`*\n]+)/i },
  { key: "veille_fact_pep", re: /Statut PEP[^:\n]*:\s*[`*]*([^`*\n]+)/i },
  { key: "veille_fact_kyc", re: /[ÉE]valuation KYC[^:\n]*:\s*[`*]*([^`*\n]+)/i },
  { key: "veille_fact_priority", re: /Priorit[ée] de revue[^:\n]*:\s*[`*]*([^`*\n]+)/i },
];

function parseVeille(markdown) {
  const text = (markdown || "")
    .replace(/^\s*-{3,}\s*$/gm, "")
    // drop the chatbot-style closing offer ("Si vous le souhaitez, je peux…")
    .replace(/\n+\s*(Si vous le souhaitez|Souhaitez-vous|Voulez-vous|If you want|Would you like)[^\n]*\s*$/i, "")
    .trim();
  const [intro, ...chunks] = text.split(/^##\s+/m);
  const sections = chunks.map((chunk) => {
    const nl = chunk.indexOf("\n");
    const title = (nl === -1 ? chunk : chunk.slice(0, nl)).replace(/^\d+\s*[).:-]\s*/, "").trim();
    return { title, body: nl === -1 ? "" : chunk.slice(nl + 1).trim() };
  });
  const facts = VEILLE_FACTS.map((f) => {
    const m = text.match(f.re);
    return m ? { key: f.key, value: m[1].trim() } : null;
  }).filter(Boolean);
  return { intro: intro.trim(), sections, facts };
}

function renderVeille(markdown) {
  const { intro, sections, facts } = parseVeille(markdown);
  if (!sections.length) return `<div class="veille-result">${renderMarkdown(markdown)}</div>`;
  const factsHtml = facts.length
    ? `<div class="veille-facts">${facts
        .map((f) => {
          const cls = PRIORITY_CLASS[f.value] || "";
          const value = LEVEL_KEY[f.value] ? t(LEVEL_KEY[f.value]) : f.value;
          return `<span class="veille-fact ${cls}"><span>${escapeHtml(t(f.key))}</span> ${escapeHtml(value)}</span>`;
        })
        .join("")}</div>`
    : "";
  const tabs = sections
    .map((sec, i) => `<button class="veille-tab${i === 0 ? " active" : ""}" data-index="${i}">${i + 1}. ${escapeHtml(sec.title)}</button>`)
    .join("");
  const panes = sections
    .map((sec, i) => `<div class="veille-result veille-pane" data-index="${i}"${i === 0 ? "" : " hidden"}>${renderMarkdown(sec.body)}</div>`)
    .join("");
  return `${factsHtml}
    ${intro ? `<div class="veille-result">${renderMarkdown(intro)}</div>` : ""}
    <div class="veille-tabs">${tabs}</div>
    ${panes}`;
}

function wireVeilleTabs(panel) {
  panel.querySelectorAll(".veille-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      panel.querySelectorAll(".veille-tab").forEach((x) => x.classList.toggle("active", x === tab));
      panel.querySelectorAll(".veille-pane").forEach((pane) => {
        pane.hidden = pane.dataset.index !== tab.dataset.index;
      });
    });
  });
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function renderAgentProgress(panel, completedCount) {
  const rows = AGENT_PROGRESS_STEPS.map((key, i) => {
    const stepNum = i + 1;
    const isDone = stepNum <= completedCount;
    const isActive = stepNum === completedCount + 1;
    const icon = isDone ? '<span class="agent-progress-check">✓</span>' : isActive ? '<span class="agent-progress-spinner">↻</span>' : "";
    return `<div class="agent-progress-row${isDone ? " done" : ""}${isActive ? " active" : ""}">
      ${icon}
      <span class="agent-progress-label">${escapeHtml(t(key))}</span>
    </div>`;
  }).join("");
  panel.innerHTML = `<div class="client-modal-section"><h3>${t("scan_loading_title")}</h3><div class="agent-progress">${rows}</div></div>`;
}

function renderSynthesis(client, result, detailsOpen) {
  const opps = result.opportunities || [];
  const top = opps[0];
  const veille = result.veille || {};
  const level = result.level || (veille.synthese ? null : "Low");
  const headline = top
    ? `${t("synthesis_text", opps.length, top.eventType, top.entityName)} ${top.aiSuggestedAction || ""}`
    : `${t("no_opportunity_title")} — ${t("no_opportunity_body")}`;
  const fmtDate = (d) => new Date(d).toLocaleDateString(state.lang === "fr" ? "fr-FR" : "en-US");

  const sourcesHtml = opps.length
    ? `<ul class="details-list">${opps
        .map((o) => `<li><strong>${escapeHtml(o.sourceName)}</strong> · ${fmtDate(o.detectedAt)} — ${escapeHtml(o.description)}</li>`)
        .join("")}</ul>`
    : `<p class="details-empty">${t("no_sources")}</p>`;

  const oppsHtml = opps.length
    ? opps
        .map(
          (o) => `<div class="opportunity-row">
            <div class="synthesis-header">
              <div class="ot">${escapeHtml(o.eventType)} — ${escapeHtml(o.entityName)}</div>
              <span class="pill ${PRIORITY_CLASS[o.priority] || ""}">${escapeHtml(t(PRIORITY_KEY[o.priority] || o.priority))}</span>
            </div>
            ${o.isNew ? `<div class="gap-added-tag">${t("gap_added_tag")}</div>` : ""}
            <div class="om">${escapeHtml(o.aiSummary || o.description)}</div>
            ${o.aiSuggestedAction ? `<div class="ga">→ ${escapeHtml(o.aiSuggestedAction)}</div>` : ""}
          </div>`
        )
        .join("")
    : `<p class="details-empty">${t("client_opportunities_empty")}</p>`;

  const updates = result.referentialUpdates || [];
  const updatesHtml = updates.length
    ? `<div class="details-section">
        <h4>${t("details_updates_title")}</h4>
        ${updates
          .map(
            (u) => `<div class="referential-update-row">
              <span>${escapeHtml(t("referential_update_line", u.name, u.stake, u.entityName, u.sourceName))}</span>
              <button class="btn btn-outline btn-small apply-update-btn" data-entity="${escapeHtml(u.entityName)}" data-shareholder="${escapeHtml(u.name)}">${t("btn_apply_update")}</button>
            </div>`
          )
          .join("")}
      </div>`
    : "";

  const holderEntities = (client.linkedEntities || []).filter((e) => e.other_shareholders && e.other_shareholders.length);
  const holdersHtml = holderEntities.length
    ? `<div class="details-section">
        <h4>${t("other_shareholders_label")}</h4>
        ${holderEntities
          .map(
            (e) => `<div class="other-shareholders-entity">
              <div class="other-shareholders-entity-name">${escapeHtml(e.name)}</div>
              ${renderShareholdersBlock(e)}
            </div>`
          )
          .join("")}
      </div>`
    : "";

  // With a veille synthesis and nothing structured to add (KYC referential
  // clients), the Details block would only hold empty sections.
  const showDetails = !veille.synthese || opps.length || updates.length || holderEntities.length;

  return `<div class="client-modal-section synthesis-card">
    <div class="synthesis-header">
      <h3>${t("synthesis_title")}</h3>
      ${level ? `<span class="pill ${PRIORITY_CLASS[level] || ""}">${escapeHtml(t("rating_label"))} : ${escapeHtml(t(LEVEL_KEY[level]))}</span>` : ""}
    </div>
    ${veille.synthese
      ? renderVeille(veille.synthese)
      : `<p class="synthesis-headline">${escapeHtml(headline)}</p>`}
    ${veille.error ? `<p class="veille-error">${t("veille_unavailable")} ${escapeHtml(veille.error)}</p>` : ""}
    ${showDetails
      ? `<button class="btn btn-outline btn-small gap-details-toggle">${detailsOpen ? t("btn_hide_details") : t("btn_details")}</button>
    <div class="gap-details"${detailsOpen ? "" : " hidden"}>
      <div class="details-section"><h4>${t("details_sources_title")}</h4>${sourcesHtml}</div>
      <div class="details-section"><h4>${t("details_opportunities_title")}</h4>${oppsHtml}</div>
      ${updatesHtml}
      ${holdersHtml}
      <p class="shareholder-convert-status" id="shareholder-convert-status"></p>
    </div>`
      : ""}
  </div>`;
}

function showExploreResult(client, result, detailsOpen) {
  const panel = document.getElementById("explore-opportunity-panel");
  panel.hidden = false;
  panel.innerHTML = renderSynthesis(client, result, detailsOpen);
  panel.dataset.loaded = "true";

  wireVeilleTabs(panel);
  const toggle = panel.querySelector(".gap-details-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const details = panel.querySelector(".gap-details");
      details.hidden = !details.hidden;
      toggle.textContent = details.hidden ? t("btn_details") : t("btn_hide_details");
    });
  }
  wireShareholderConvertButtons(client);
  panel.querySelectorAll(".apply-update-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyReferentialUpdate(client, result, btn));
  });
}

async function applyReferentialUpdate(client, result, btn) {
  const entityName = btn.dataset.entity;
  const shareholderName = btn.dataset.shareholder;
  btn.disabled = true;
  try {
    const updated = await api(`/api/clients/${client.id}/referential-updates/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityName, shareholderName }),
    });
    result.referentialUpdates = result.referentialUpdates.filter(
      (u) => !(u.entityName === entityName && u.name === shareholderName)
    );
    Object.assign(client, updated);
    renderClientModalContent(client);
    showExploreResult(client, result, true);
    const statusEl = document.getElementById("shareholder-convert-status");
    statusEl.textContent = t("update_applied", shareholderName);
    statusEl.className = "shareholder-convert-status ok";
    await refreshClients();
  } catch (e) {
    btn.disabled = false;
    const statusEl = document.getElementById("shareholder-convert-status");
    statusEl.textContent = `${t("scan_call_error_prefix")} ${e.message}`;
    statusEl.className = "shareholder-convert-status error";
  }
}

async function exploreCommercialOpportunity(client) {
  const panel = document.getElementById("explore-opportunity-panel");

  if (!panel.hidden && panel.dataset.loaded === "true") {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  if (panel.dataset.loaded === "true") return;

  renderAgentProgress(panel, 0);
  // The veille pipeline runs alongside the agent run; step 3 (synthesis)
  // stays ongoing until it answers.
  const veillePromise = runVeille(client.id);
  let run;
  try {
    const { runId } = await api(`/api/clients/${client.id}/agent-runs`, { method: "POST" });
    // Poll the run row; each completed step is recorded in the DB by the
    // backend. Advance one step per tick so every checkmark is visible even
    // when a step finishes faster than the poll interval.
    let shown = 0;
    for (;;) {
      await sleep(400);
      run = await api(`/api/agent-runs/${runId}`);
      if (run.step > shown) {
        shown += 1;
        renderAgentProgress(panel, shown);
      }
      if (run.status !== "running" && shown >= run.step) break;
      if (shown === AGENT_PROGRESS_STEPS.length - 1) {
        // hold the synthesis step until the veille pipeline has answered
        await veillePromise;
      }
    }
  } catch (e) {
    panel.innerHTML = `<p class="ai-error">${t("scan_call_error_prefix")} ${escapeHtml(e.message)}</p>`;
    return;
  }
  if (run.status === "error") {
    panel.innerHTML = `<p class="ai-error">${t("scan_call_error_prefix")} ${escapeHtml(run.error || "")}</p>`;
    return;
  }
  const result = run.result;
  result.veille = await veillePromise;
  await sleep(400);

  saveVeilleRun(client, result);

  const changed = result.changedEvents || [];
  if (changed.length) {
    client.events = client.events || [];
    changed.forEach((ev) => {
      const i = state.events.findIndex((x) => x.id === ev.id);
      if (i === -1) state.events.push(ev);
      else state.events[i] = ev;
      const j = client.events.findIndex((x) => x.id === ev.id);
      if (j === -1) client.events.unshift(ev);
      else client.events[j] = ev;
    });
    const list = document.getElementById("linked-signals-list");
    if (list) list.innerHTML = renderLinkedSignals(client);
    renderKPIs();
    renderEventTable();
  }
  showExploreResult(client, result, false);
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
