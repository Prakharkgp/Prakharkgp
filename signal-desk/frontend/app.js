const state = {
  categories: [],
  events: [],
  sources: [],
  clients: [],
  filters: { category: "", priority: "", status: "" },
};

const CATEGORY_CLASS = {
  "Commercial Opportunity": "cat-commercial",
  "Corporate & Credit": "cat-credit",
  "KYC Update": "cat-kyc",
  "Risk & Compliance": "cat-risk",
};

const PRIORITY_CLASS = { High: "pri-high", Medium: "pri-medium", Low: "pri-low" };

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
    `<option value="">All</option>` +
    state.categories.map((c) => `<option value="${c}">${c}</option>`).join("");
}

function matchesFilters(event) {
  const { category, priority, status } = state.filters;
  if (category && event.category !== category) return false;
  if (priority && event.priority !== priority) return false;
  if (status && event.status !== status) return false;
  return true;
}

function renderEventFeed() {
  const container = document.getElementById("event-feed");
  const template = document.getElementById("event-card-template");
  container.innerHTML = "";

  const filtered = state.events.filter(matchesFilters);
  if (filtered.length === 0) {
    container.innerHTML = `<p style="color:var(--muted); font-size:14px;">No signals match these filters.</p>`;
    return;
  }

  for (const event of filtered) {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".event-card");
    card.dataset.id = event.id;

    const catBadge = node.querySelector(".badge.category");
    catBadge.textContent = event.category;
    catBadge.classList.add(CATEGORY_CLASS[event.category] || "");

    const priBadge = node.querySelector(".badge.priority");
    priBadge.textContent = event.priority;
    priBadge.classList.add(PRIORITY_CLASS[event.priority] || "");

    const sourceBadge = node.querySelector(".badge.source");
    sourceBadge.textContent = `${event.sourceName} · ${event.sourceKind || ""}`;

    node.querySelector(".event-type").textContent = event.eventType;

    const entityLine = node.querySelector(".entity-line");
    entityLine.innerHTML = event.clientName
      ? `${event.entityName} — linked to <span class="client-link">${event.clientName}</span>`
      : `${event.entityName} — <em>unlinked, screening match</em>`;

    node.querySelector(".description").textContent = event.description;

    const aiBlock = node.querySelector(".ai-block");
    if (event.aiSummary) {
      aiBlock.hidden = false;
      node.querySelector(".ai-provider-badge").textContent = event.aiProviderUsed || "";
      node.querySelector(".ai-summary").textContent = event.aiSummary;
      node.querySelector(".ai-action").textContent = `Suggested action: ${event.aiSuggestedAction}`;
    }

    const statusSelect = node.querySelector(".status-select");
    statusSelect.value = event.status;
    statusSelect.addEventListener("change", async (e) => {
      const updated = await api(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: e.target.value }),
      });
      const idx = state.events.findIndex((ev) => ev.id === updated.id);
      state.events[idx] = updated;
      renderKPIs();
    });

    const analyzeBtn = node.querySelector(".analyze-btn");
    if (event.aiSummary) {
      analyzeBtn.textContent = "Re-analyze";
    }
    analyzeBtn.addEventListener("click", async () => {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "Analyzing…";
      try {
        const updated = await api(`/api/events/${event.id}/analyze`, { method: "POST" });
        const idx = state.events.findIndex((ev) => ev.id === updated.id);
        state.events[idx] = updated;
        renderEventFeed();
      } finally {
        analyzeBtn.disabled = false;
      }
    });

    node.querySelector(".detected-at").textContent = `Detected ${new Date(event.detectedAt).toLocaleString()}`;

    container.appendChild(node);
  }
}

function renderSources() {
  const publicSources = state.sources.filter((s) => s.kind === "public");
  const privateSources = state.sources.filter((s) => s.kind === "private");

  const cardHtml = (s) => `
    <div class="source-card">
      <h4>${s.name}</h4>
      <div class="coverage">${s.coverage}</div>
      <p class="desc">${s.description}</p>
    </div>`;

  document.getElementById("sources-public").innerHTML = publicSources.map(cardHtml).join("");
  document.getElementById("sources-private").innerHTML = privateSources.map(cardHtml).join("");
}

function renderClients() {
  const container = document.getElementById("client-list");
  container.innerHTML = state.clients
    .map(
      (c) => `
      <div class="client-card">
        <div class="client-header" data-client="${c.id}">
          <div>
            <h4>${c.name}</h4>
            <div class="segment">${c.segment}</div>
          </div>
          <div class="rm">RM: ${c.rmOwner}</div>
        </div>
        <div class="client-details" id="client-details-${c.id}"></div>
      </div>`
    )
    .join("");

  container.querySelectorAll(".client-header").forEach((header) => {
    header.addEventListener("click", () => toggleClient(header.dataset.client));
  });
}

async function toggleClient(clientId) {
  const details = document.getElementById(`client-details-${clientId}`);
  const isOpen = details.classList.contains("open");
  if (isOpen) {
    details.classList.remove("open");
    return;
  }
  if (!details.dataset.loaded) {
    const client = await api(`/api/clients/${clientId}`);
    const chain = client.linkedEntities.length
      ? `<ul class="ownership-chain">${client.linkedEntities
          .map((e) => `<li><span>${e.name}</span><span class="relation">${e.relation} · ${e.jurisdiction}</span></li>`)
          .join("")}</ul>`
      : `<p style="font-size:13px;color:var(--muted);">No linked entities recorded.</p>`;

    const events = client.events.length
      ? client.events
          .map(
            (e) => `<div class="client-event-row"><strong>${e.eventType}</strong> — ${e.entityName}
              <div class="ct">${e.category} · ${e.priority} priority · via ${e.sourceName}</div></div>`
          )
          .join("")
      : `<p style="font-size:13px;color:var(--muted);">No signals recorded for this client yet.</p>`;

    details.innerHTML = `
      <div class="client-events-title">Ownership chain</div>
      ${chain}
      <div class="client-events-title">Linked signals</div>
      ${events}
    `;
    details.dataset.loaded = "1";
  }
  details.classList.add("open");
}

async function renderAIStatus() {
  const status = await api("/api/ai/status");
  document.getElementById("ai-active-provider").textContent = status.activeProvider;
  document.getElementById("ai-status-note").textContent = status.azureFoundryConfigured
    ? "This deployment is running on a live Azure AI Foundry model."
    : status.note;
}

function setupFilterListeners() {
  document.getElementById("filter-category").addEventListener("change", (e) => {
    state.filters.category = e.target.value;
    renderEventFeed();
  });
  document.getElementById("filter-priority").addEventListener("change", (e) => {
    state.filters.priority = e.target.value;
    renderEventFeed();
  });
  document.getElementById("filter-status").addEventListener("change", (e) => {
    state.filters.status = e.target.value;
    renderEventFeed();
  });
}

async function init() {
  setupTabs();
  setupFilterListeners();

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
  renderEventFeed();
  renderSources();
  renderClients();
  renderAIStatus();
}

init();
