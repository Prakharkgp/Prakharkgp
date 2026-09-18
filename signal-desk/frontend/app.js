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
};

const CATEGORY_CLASS = {
  "Commercial Opportunity": "cat-commercial",
  "Corporate & Credit": "cat-credit",
  "KYC Update": "cat-kyc",
  "Risk & Compliance": "cat-risk",
};

const PRIORITY_CLASS = { High: "pri-high", Medium: "pri-medium", Low: "pri-low" };

const STATUS_CLASS = {
  New: "status-new",
  "Under Review": "status-review",
  Actioned: "status-actioned",
  Dismissed: "status-dismissed",
};

async function api(path, options) {
  const res = await fetch(path, options);
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
  return res.json();
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

function renderKPIs() {
  const total = state.events.length;
  const high = state.events.filter((e) => e.priority === "High").length;
  const newCount = state.events.filter((e) => e.status === "New").length;
  const risk = state.events.filter((e) => e.category === "Risk & Compliance").length;

  const kpis = [
    { value: total, label: "Total signals" },
    { value: high, label: "High priority" },
    { value: newCount, label: "Awaiting triage" },
    { value: risk, label: "Risk & compliance" },
  ];

  document.getElementById("kpis").innerHTML = kpis
    .map((k) => `<div class="kpi-card"><div class="value">${k.value}</div><div class="label">${k.label}</div></div>`)
    .join("");
}

function populateCategoryFilter() {
  const select = document.getElementById("filter-category");
  select.innerHTML =
    `<option value="">&lt;&lt; All &gt;&gt;</option>` +
    state.categories.map((c) => `<option value="${c}">${c}</option>`).join("");
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

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function renderEventDetailRow(event) {
  const aiHtml = event.aiSummary
    ? `<div class="ai-block">
        <div class="ai-block-label">AI summary <span class="ai-provider-badge">${escapeHtml(event.aiProviderUsed)}</span></div>
        <p class="ai-summary">${escapeHtml(event.aiSummary)}</p>
        <p class="ai-action">Suggested action: ${escapeHtml(event.aiSuggestedAction)}</p>
      </div>`
    : "";

  return `
    <tr class="detail-row" data-detail-for="${event.id}">
      <td colspan="8">
        <p class="detail-desc">${escapeHtml(event.description)}</p>
        ${aiHtml}
        <div class="detail-actions">
          <button class="btn-navy analyze-btn" data-id="${event.id}">${event.aiSummary ? "Re-analyze" : "Analyze with AI"}</button>
          <select class="status-select" data-id="${event.id}">
            <option${event.status === "New" ? " selected" : ""}>New</option>
            <option${event.status === "Under Review" ? " selected" : ""}>Under Review</option>
            <option${event.status === "Actioned" ? " selected" : ""}>Actioned</option>
            <option${event.status === "Dismissed" ? " selected" : ""}>Dismissed</option>
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
    tbody.innerHTML = `<tr><td colspan="8" style="color:var(--muted); padding: 20px 14px;">No signals match these filters.</td></tr>`;
  } else {
    tbody.innerHTML = pageItems
      .map((e) => {
        const entityCell = e.clientName
          ? `<span class="entity-name">${escapeHtml(e.entityName)}</span><span class="client-link">${escapeHtml(e.clientName)}</span>`
          : `<span class="entity-name">${escapeHtml(e.entityName)}</span><span class="unlinked">unlinked, screening match</span>`;

        const row = `
        <tr class="event-row" data-id="${e.id}">
          <td><span class="pill ${CATEGORY_CLASS[e.category] || ""}">${escapeHtml(e.category)}</span></td>
          <td>${escapeHtml(e.eventType)}</td>
          <td class="entity-cell">${entityCell}</td>
          <td><span class="pill ${PRIORITY_CLASS[e.priority] || ""}">${escapeHtml(e.priority)}</span></td>
          <td class="source-name">${escapeHtml(e.sourceName)}</td>
          <td><span class="pill ${STATUS_CLASS[e.status] || ""}">${escapeHtml(e.status)}</span></td>
          <td class="detected-cell">${new Date(e.detectedAt).toLocaleDateString()}</td>
          <td><button class="btn-navy view-btn" data-id="${e.id}">${state.expandedEventId === e.id ? "Hide" : "View"}</button></td>
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
      btn.textContent = "Analyzing…";
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
      Page size:
      <select id="page-size-select">
        ${[10, 25, 50].map((n) => `<option value="${n}"${n === state.pageSize ? " selected" : ""}>${n}</option>`).join("")}
      </select>
    </div>
    <div>${start} to ${end} of ${totalCount}</div>
    <div class="page-nav">
      <button id="page-first" ${state.page === 1 ? "disabled" : ""}>&laquo;</button>
      <button id="page-prev" ${state.page === 1 ? "disabled" : ""}>&lsaquo;</button>
      <span>Page ${state.page} of ${totalPages}</span>
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
  const headers = ["Category", "Event Type", "Entity", "Client", "Priority", "Source", "Status", "Detected At"];
  const rows = filtered.map((e) => [
    e.category, e.eventType, e.entityName, e.clientName || "", e.priority, e.sourceName, e.status, e.detectedAt,
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
        <td><span class="kind-pill ${s.kind}">${s.kind}</span></td>
        <td>${escapeHtml(s.coverage)}</td>
        <td>${escapeHtml(s.description)}</td>
        <td><span class="status-tag ${s.status === "simulated" ? "simulated" : "planned"}">${s.status === "simulated" ? "Simulated" : "Planned"}</span></td>
      </tr>`
    )
    .join("");
}

function renderClientDetailRow(client) {
  const chain = client.linkedEntities.length
    ? `<ul class="ownership-chain">${client.linkedEntities
        .map((e) => `<li><span>${escapeHtml(e.name)}</span><span class="relation">${escapeHtml(e.relation)} · ${escapeHtml(e.jurisdiction)}</span></li>`)
        .join("")}</ul>`
    : `<p style="font-size:13px;color:var(--muted);">No linked entities recorded.</p>`;

  const events = client.events && client.events.length
    ? client.events
        .map(
          (e) => `<div class="client-event-row"><strong>${escapeHtml(e.eventType)}</strong> — ${escapeHtml(e.entityName)}
            <div class="ct">${escapeHtml(e.category)} · ${escapeHtml(e.priority)} priority · via ${escapeHtml(e.sourceName)}</div></div>`
        )
        .join("")
    : `<p style="font-size:13px;color:var(--muted);">No signals recorded for this client yet.</p>`;

  return `
    <tr class="detail-row" data-client-detail-for="${client.id}">
      <td colspan="5" class="client-details-cell">
        <div class="client-events-title">Ownership chain</div>
        ${chain}
        <div class="client-events-title">Linked signals</div>
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
        <td><button class="btn-navy client-view-btn" data-id="${c.id}">${state.expandedClientId === c.id ? "Hide" : "View"}</button></td>
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
  document.getElementById("ai-active-provider").textContent = status.activeProvider;
  document.getElementById("ai-status-note").textContent = status.azureFoundryConfigured
    ? "This deployment is running on a live Azure AI Foundry model."
    : status.note;
}

async function init() {
  setupTabs();
  setupFilterActions();

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

  populateCategoryFilter();
  renderKPIs();
  renderEventTable();
  renderSources();
  renderClients();
  renderAIStatus();
}

init();
