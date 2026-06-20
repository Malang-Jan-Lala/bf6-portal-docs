const state = {
  apiItems: [],
  apiGroups: [],
  enumItems: [],
  templates: [],
  bugs: [],
  selectedApiId: null,
  selectedEnumId: null,
  selectedTemplateId: null,
  selectedBugId: null,
};

const dataFiles = {
  api: "data/bf6_mod_api_functions.json",
  enums: "data/bf6_selection_list_enum_map.json",
  templates: "data/templates.json",
  bugs: "data/known_bugs.json",
};

document.addEventListener("DOMContentLoaded", init);

async function init() {
  bindTabs();
  bindSearch();
  await loadData();
}

function bindTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      activateTab(tab.dataset.tab);
    });
  });
}

function activateTab(tabId) {
  document.querySelectorAll(".tab").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.tab === tabId);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === tabId);
  });
}

function bindSearch() {
  document.getElementById("apiSearch").addEventListener("input", () => renderApiList({ selectFirst: true }));
  document.getElementById("enumSearch").addEventListener("input", () => renderEnumList({ selectFirst: true }));
}

async function loadData() {
  const status = document.getElementById("loadStatus");
  const results = await Promise.allSettled([
    fetchJson(dataFiles.api),
    fetchJson(dataFiles.enums),
    fetchJson(dataFiles.templates),
    fetchJson(dataFiles.bugs),
  ]);

  if (results[0].status === "fulfilled" && results[1].status === "fulfilled") {
    state.apiItems = normalizeApiItems(results[0].value);
    state.apiGroups = groupApiItems(state.apiItems);
    state.enumItems = normalizeEnumItems(results[1].value);
    renderApiList({ selectFirst: true });
    renderEnumList({ selectFirst: true });
    status.textContent = `Loaded ${state.apiItems.length} API variants, ${state.enumItems.length} enums`;
    status.className = "load-status ok";
  } else {
    const error = results.find((result) => result.status === "rejected")?.reason || new Error("Unknown JSON load error");
    status.textContent = "JSON not loaded. Use a local server if the browser blocks file access.";
    status.className = "load-status warn";
    showLoadError(error);
  }

  if (results[2].status === "fulfilled") {
    state.templates = normalizeTemplates(results[2].value);
    renderTemplates({ selectFirst: true });
  } else {
    renderDataError("templateList", "Could not load templates.json", results[2].reason);
    renderTemplateMessage("Could not load templates.json");
  }

  if (results[3].status === "fulfilled") {
    state.bugs = normalizeKnownBugs(results[3].value);
    renderBugs({ selectFirst: true });
  } else {
    renderDataError("bugList", "Could not load known_bugs.json", results[3].reason);
    renderBugMessage("Could not load known_bugs.json");
  }
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`${path}: ${response.status}`);
  }
  return response.json();
}

function normalizeApiItems(raw) {
  const list = Array.isArray(raw) ? raw : [];
  return list.map((item, index) => {
    const tags = compact([item.category_guess, item.return_type, "api"]);
    return {
      id: `api-${index}-${slug(item.name || "unknown")}`,
      name: item.name || "Unknown function",
      signature: item.signature || "",
      comment: item.comment || "",
      category: item.category_guess || "Other",
      returnType: item.return_type || "unknown",
      parameters: item.parameters_raw || "",
      source: compact([item.source_file, item.source_line]).join(":"),
      tags,
      raw: item,
    };
  });
}

function groupApiItems(items) {
  const groups = new Map();

  items.forEach((item) => {
    if (!groups.has(item.name)) {
      groups.set(item.name, {
        id: `api-group-${slug(item.name || "unknown")}`,
        name: item.name,
        items: [],
        categories: [],
        tags: [],
        nameText: "",
        detailText: "",
        descriptionText: "",
        searchText: "",
      });
    }

    groups.get(item.name).items.push(item);
  });

  return Array.from(groups.values()).map((group) => {
    group.categories = unique(group.items.map((item) => item.category));
    group.tags = unique(group.items.flatMap((item) => item.tags)).slice(0, 6);
    group.nameText = group.name.toLowerCase();
    group.detailText = group.items.map((item) => [
      item.signature,
      item.parameters,
      item.category,
      item.returnType,
    ].join(" ")).join(" ").toLowerCase();
    group.descriptionText = group.items.map((item) => item.comment).join(" ").toLowerCase();
    group.searchText = `${group.nameText} ${group.detailText} ${group.descriptionText}`;
    return group;
  });
}

function normalizeEnumItems(raw) {
  const selectionLists = raw && raw.selection_lists ? raw.selection_lists : {};
  return Object.entries(selectionLists).map(([key, item]) => {
    const allowedValues = Array.isArray(item.allowed_values) ? item.allowed_values : [];
    const apiRefs = Array.isArray(item.used_with_from_api_signatures) ? item.used_with_from_api_signatures : [];
    const tags = compact([item.enum_name, item.output_type_inferred, "enum"]);
    return {
      id: `enum-${slug(key)}`,
      title: key,
      summary: item.summary || "",
      enumName: item.enum_name || item.output_type_inferred || "unknown",
      allowedValues,
      apiRefs,
      sourceUrl: item.source_url || "",
      warnings: Array.isArray(item.warnings) ? item.warnings : [],
      tags,
      raw: item,
    };
  });
}

function normalizeTemplates(raw) {
  const list = Array.isArray(raw) ? raw : [];
  return list.map((item) => ({
    id: item.id || "",
    title: item.title || "Untitled template",
    status: item.status || "unknown",
    summary: item.summary || "",
    tags: Array.isArray(item.tags) ? item.tags : [],
    relatedApi: Array.isArray(item.relatedApi) ? item.relatedApi : [],
    relatedEnums: Array.isArray(item.relatedEnums) ? item.relatedEnums : [],
    relatedBugs: Array.isArray(item.relatedBugs) ? item.relatedBugs : [],
  }));
}

function normalizeKnownBugs(raw) {
  const list = Array.isArray(raw) ? raw : [];
  return list.map((item) => ({
    id: item.id || "",
    title: item.title || "Untitled bug",
    status: item.status || "unknown",
    summary: item.summary || "",
    affectedBf6Version: item.affectedBf6Version || "unknown",
    affectedPortalSdkVersion: item.affectedPortalSdkVersion || "unknown",
    affectedGodotVersion: item.affectedGodotVersion || "unknown",
    tags: Array.isArray(item.tags) ? item.tags : [],
    relatedApi: Array.isArray(item.relatedApi) ? item.relatedApi : [],
    relatedTemplates: Array.isArray(item.relatedTemplates) ? item.relatedTemplates : [],
    workaround: item.workaround || "unknown",
    dateObserved: item.dateObserved || "unknown",
    sourceType: item.sourceType || "unknown",
  }));
}

function renderApiList(options = {}) {
  const list = document.getElementById("apiList");
  const query = document.getElementById("apiSearch").value.trim().toLowerCase();
  const filtered = getFilteredApiGroups(query);
  document.getElementById("apiCount").textContent = `${filtered.length} of ${state.apiGroups.length} functions`;
  list.innerHTML = "";

  if (!filtered.length) {
    list.innerHTML = `<p class="muted">No functions found.</p>`;
    state.selectedApiId = null;
    renderApiMessage(query ? "No results found" : "No API function selected");
    return;
  }

  if (options.selectFirst || !filtered.some((group) => group.id === state.selectedApiId)) {
    state.selectedApiId = filtered[0].id;
    renderApiDetail(filtered[0]);
  }

  filtered.slice(0, 250).forEach((group) => {
    const button = document.createElement("button");
    const variantText = group.items.length > 1 ? `${group.items.length} overloads` : "1 variant";
    const subtitle = group.items.length > 1
      ? `${variantText} - ${group.categories.slice(0, 3).map(escapeHtml).join(", ")}`
      : escapeHtml(group.categories[0] || "Other");

    button.className = `item${group.id === state.selectedApiId ? " is-active" : ""}`;
    button.innerHTML = `
      <span class="item-title">${escapeHtml(group.name)}</span>
      <span class="item-subtitle">${subtitle}</span>
    `;
    button.addEventListener("click", () => selectApi(group.id));
    list.appendChild(button);
  });
}

function selectApi(id) {
  state.selectedApiId = id;
  const group = state.apiGroups.find((entry) => entry.id === id);
  if (!group) return;
  renderApiDetail(group);
  renderApiList();
}

function renderApiDetail(group) {
  const relatedHtml = renderApiRelatedContent(group.name);

  if (group.items.length === 1) {
    const item = group.items[0];
    document.getElementById("apiDetail").innerHTML = `
      <h3>${escapeHtml(item.name)}</h3>
      <code>${escapeHtml(item.signature || "No signature available.")}</code>
      <div class="meta">
        <div><strong>Category:</strong> ${escapeHtml(item.category)}</div>
        <div><strong>Return:</strong> ${escapeHtml(item.returnType)}</div>
        <div><strong>Parameters:</strong> ${escapeHtml(item.parameters || "none")}</div>
        <div><strong>Source:</strong> ${escapeHtml(item.source || "unknown")}</div>
      </div>
      <p><strong>Description:</strong> ${escapeHtml(item.comment || "No description available.")}</p>
      ${renderTags(item.tags)}
      ${relatedHtml}
    `;
    bindRelationChips();
    return;
  }

  document.getElementById("apiDetail").innerHTML = `
    <h3>${escapeHtml(group.name)}</h3>
    <p class="muted">${group.items.length} overloads / variants</p>
    ${renderTags(group.tags)}
    <div class="overload-stack">
      ${group.items.map((item, index) => renderApiVariantCard(item, index + 1)).join("")}
    </div>
    ${relatedHtml}
  `;
  bindRelationChips();
}

function renderApiRelatedContent(apiName) {
  const templates = state.templates.filter((item) => item.relatedApi.includes(apiName));
  const bugs = state.bugs.filter((item) => item.relatedApi.includes(apiName));
  const enums = unique(templates.flatMap((item) => item.relatedEnums));

  if (!templates.length && !enums.length && !bugs.length) {
    return `
      <div class="related-block">
        <h3>Related Content</h3>
        <p class="muted">No related templates yet.</p>
      </div>
    `;
  }

  return `
    <div class="related-block">
      <h3>Related Templates</h3>
      ${templates.length ? renderRelationChips("template", templates.map((item) => item.id)) : `<p class="muted">No related templates yet.</p>`}
      <h3>Related Enums / Selection Lists</h3>
      ${enums.length ? renderRelationChips("enum", enums) : `<p class="muted">No related enums yet.</p>`}
      <h3>Related Known Bugs</h3>
      ${bugs.length ? renderRelationChips("bug", bugs.map((item) => item.id)) : `<p class="muted">No related known bugs yet.</p>`}
    </div>
  `;
}

function renderApiMessage(message) {
  document.getElementById("apiDetail").innerHTML = `<p class="muted">${escapeHtml(message)}</p>`;
}

function getFilteredApiGroups(query) {
  if (!query) {
    return state.apiGroups;
  }

  return state.apiGroups
    .map((group) => ({ group, rank: getApiSearchRank(group, query) }))
    .filter((entry) => entry.rank < 99)
    .sort((a, b) => a.rank - b.rank || a.group.name.localeCompare(b.group.name))
    .map((entry) => entry.group);
}

function getApiSearchRank(group, query) {
  if (group.nameText === query) return 1;
  if (group.nameText.includes(query)) return 2;
  if (group.detailText.includes(query)) return 3;
  if (group.descriptionText.includes(query)) return 4;
  return 99;
}

function renderApiVariantCard(item, number) {
  return `
    <article class="overload-card">
      <h3>Overload ${number}</h3>
      <code>${escapeHtml(item.signature || "No signature available.")}</code>
      <div class="meta">
        <div><strong>Parameters:</strong> ${escapeHtml(item.parameters || "none")}</div>
        <div><strong>Return:</strong> ${escapeHtml(item.returnType)}</div>
        <div><strong>Category:</strong> ${escapeHtml(item.category)}</div>
        <div><strong>Source:</strong> ${escapeHtml(item.source || "unknown")}</div>
      </div>
      <p><strong>Description:</strong> ${escapeHtml(item.comment || "No description available.")}</p>
    </article>
  `;
}

function renderEnumList(options = {}) {
  const list = document.getElementById("enumList");
  const query = document.getElementById("enumSearch").value.trim().toLowerCase();
  const filtered = state.enumItems.filter((item) => {
    const values = item.allowedValues.join(" ").toLowerCase();
    return item.title.toLowerCase().includes(query) || item.enumName.toLowerCase().includes(query) || values.includes(query);
  });
  document.getElementById("enumCount").textContent = `${filtered.length} of ${state.enumItems.length} selection lists`;
  list.innerHTML = "";

  if (!filtered.length) {
    list.innerHTML = `<p class="muted">No selection lists found.</p>`;
    state.selectedEnumId = null;
    renderEnumMessage(query ? "No results found" : "No selection list selected");
    return;
  }

  if (options.selectFirst || !filtered.some((item) => item.id === state.selectedEnumId)) {
    state.selectedEnumId = filtered[0].id;
    renderEnumDetail(filtered[0]);
  }

  filtered.slice(0, 250).forEach((item) => {
    const button = document.createElement("button");
    button.className = `item${item.id === state.selectedEnumId ? " is-active" : ""}`;
    button.innerHTML = `<span class="item-title">${escapeHtml(item.title)}</span><span class="item-subtitle">${escapeHtml(item.enumName)}</span>`;
    button.addEventListener("click", () => selectEnum(item.id));
    list.appendChild(button);
  });
}

function selectEnum(id) {
  state.selectedEnumId = id;
  const item = state.enumItems.find((entry) => entry.id === id);
  if (!item) return;
  renderEnumDetail(item);
  renderEnumList();
}

function renderEnumDetail(item) {
  const valueItems = item.allowedValues.slice(0, 120).map((value) => `<li>${escapeHtml(value)}</li>`).join("");
  const apiRefs = item.apiRefs.slice(0, 16).map((ref) => `<li>${escapeHtml(ref.signature || ref.function || "")}</li>`).join("");

  document.getElementById("enumDetail").innerHTML = `
    <h3>${escapeHtml(item.title)}</h3>
    <div class="meta">
      <div><strong>Enum:</strong> ${escapeHtml(item.enumName)}</div>
      <div><strong>Allowed values:</strong> ${item.allowedValues.length}</div>
      <div><strong>API references:</strong> ${item.apiRefs.length}</div>
    </div>
    <p>${escapeHtml(item.summary || "No summary available.")}</p>
    ${renderTags(item.tags)}
    <h3>Allowed Values</h3>
    <ul class="compact">${valueItems || "<li>No values listed.</li>"}</ul>
    <h3>Possible API Usage</h3>
    <ul class="compact">${apiRefs || "<li>No API usage listed.</li>"}</ul>
  `;
}

function renderEnumMessage(message) {
  document.getElementById("enumDetail").innerHTML = `<p class="muted">${escapeHtml(message)}</p>`;
}

function renderTemplates(options = {}) {
  if (!state.templates.length) {
    document.getElementById("templateList").innerHTML = `<p class="muted">No templates found.</p>`;
    renderTemplateMessage("No template selected");
    return;
  }

  if (options.selectFirst || !state.templates.some((item) => item.id === state.selectedTemplateId)) {
    state.selectedTemplateId = state.templates[0].id;
    renderTemplateDetail(state.templates[0]);
  }

  document.getElementById("templateList").innerHTML = state.templates.map((item) => `
    <article class="template-card click-card${item.id === state.selectedTemplateId ? " is-active" : ""}" data-id="${escapeHtml(item.id)}" role="button" tabindex="0">
      <h3>${escapeHtml(item.title)}</h3>
      <p><strong>Status:</strong> ${escapeHtml(item.status)}</p>
      <p>${escapeHtml(item.summary || "No summary available.")}</p>
      ${renderTags(item.tags)}
      <p class="muted">${escapeHtml(renderRelatedSummary(item.relatedApi, item.relatedEnums, item.relatedBugs))}</p>
    </article>
  `).join("");

  bindTemplateCards();
}

function renderBugs(options = {}) {
  if (!state.bugs.length) {
    document.getElementById("bugList").innerHTML = `<p class="muted">No known bugs found.</p>`;
    renderBugMessage("No known bug selected");
    return;
  }

  if (options.selectFirst || !state.bugs.some((item) => item.id === state.selectedBugId)) {
    state.selectedBugId = state.bugs[0].id;
    renderBugDetail(state.bugs[0]);
  }

  document.getElementById("bugList").innerHTML = state.bugs.map((item) => `
    <article class="bug-card click-card${item.id === state.selectedBugId ? " is-active" : ""}" data-id="${escapeHtml(item.id)}" role="button" tabindex="0">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary || "No summary available.")}</p>
      <div class="meta">
        <div><strong>Status:</strong> ${escapeHtml(item.status)}</div>
        <div><strong>BF6 version:</strong> ${escapeHtml(item.affectedBf6Version)}</div>
        <div><strong>Portal SDK:</strong> ${escapeHtml(item.affectedPortalSdkVersion)}</div>
        <div><strong>Godot:</strong> ${escapeHtml(item.affectedGodotVersion)}</div>
        <div><strong>Workaround:</strong> ${escapeHtml(item.workaround)}</div>
        <div><strong>Date observed:</strong> ${escapeHtml(item.dateObserved)}</div>
        <div><strong>Source type:</strong> ${escapeHtml(item.sourceType)}</div>
      </div>
      ${renderTags(item.tags)}
      <p class="muted">${escapeHtml(renderBugRelatedSummary(item.relatedApi, item.relatedTemplates))}</p>
    </article>
  `).join("");

  bindBugCards();
}

function bindTemplateCards() {
  document.querySelectorAll("#templateList .click-card").forEach((card) => {
    card.addEventListener("click", () => selectTemplate(card.dataset.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectTemplate(card.dataset.id);
      }
    });
  });
}

function bindBugCards() {
  document.querySelectorAll("#bugList .click-card").forEach((card) => {
    card.addEventListener("click", () => selectBug(card.dataset.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectBug(card.dataset.id);
      }
    });
  });
}

function selectTemplate(id) {
  const item = state.templates.find((entry) => entry.id === id);
  if (!item) return;
  state.selectedTemplateId = id;
  renderTemplateDetail(item);
  renderTemplates();
}

function selectBug(id) {
  const item = state.bugs.find((entry) => entry.id === id);
  if (!item) return;
  state.selectedBugId = id;
  renderBugDetail(item);
  renderBugs();
}

function renderTemplateDetail(item) {
  document.getElementById("templateDetail").innerHTML = `
    <h3>${escapeHtml(item.title)}</h3>
    <div class="meta">
      <div><strong>Status:</strong> ${escapeHtml(item.status)}</div>
    </div>
    <p>${escapeHtml(item.summary || "No summary available.")}</p>
    <h3>Tags</h3>
    ${renderTags(item.tags)}
    <h3>Related API</h3>
    ${renderRelationChips("api", item.relatedApi)}
    <h3>Related Enums</h3>
    ${renderRelationChips("enum", item.relatedEnums)}
    <h3>Related Bugs</h3>
    ${renderRelationChips("bug", item.relatedBugs)}
  `;
  bindRelationChips();
}

function renderBugDetail(item) {
  document.getElementById("bugDetail").innerHTML = `
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.summary || "No summary available.")}</p>
    <div class="meta">
      <div><strong>Status:</strong> ${escapeHtml(item.status)}</div>
      <div><strong>BF6 version:</strong> ${escapeHtml(item.affectedBf6Version)}</div>
      <div><strong>Portal SDK:</strong> ${escapeHtml(item.affectedPortalSdkVersion)}</div>
      <div><strong>Godot:</strong> ${escapeHtml(item.affectedGodotVersion)}</div>
      <div><strong>Workaround:</strong> ${escapeHtml(item.workaround)}</div>
      <div><strong>Date observed:</strong> ${escapeHtml(item.dateObserved)}</div>
      <div><strong>Source type:</strong> ${escapeHtml(item.sourceType)}</div>
    </div>
    <h3>Tags</h3>
    ${renderTags(item.tags)}
    <h3>Related API</h3>
    ${renderRelationChips("api", item.relatedApi)}
    <h3>Related Templates</h3>
    ${renderRelationChips("template", item.relatedTemplates)}
  `;
  bindRelationChips();
}

function renderTemplateMessage(message) {
  document.getElementById("templateDetail").innerHTML = `<p class="muted">${escapeHtml(message)}</p>`;
}

function renderBugMessage(message) {
  document.getElementById("bugDetail").innerHTML = `<p class="muted">${escapeHtml(message)}</p>`;
}

function renderRelationChips(kind, values) {
  if (!values.length) {
    return `<p class="muted">No related items yet.</p>`;
  }

  return `
    <div class="chip-row">
      ${values.map((value) => `<button class="relation-chip" type="button" data-kind="${escapeHtml(kind)}" data-id="${escapeHtml(value)}">${escapeHtml(value)}</button>`).join("")}
    </div>
  `;
}

function bindRelationChips() {
  document.querySelectorAll(".relation-chip").forEach((chip) => {
    chip.addEventListener("click", () => handleRelationClick(chip.dataset.kind, chip.dataset.id));
  });
}

function handleRelationClick(kind, id) {
  if (kind === "api") {
    activateTab("api");
    document.getElementById("apiSearch").value = id;
    renderApiList({ selectFirst: true });
  }

  if (kind === "enum") {
    activateTab("enums");
    document.getElementById("enumSearch").value = id;
    renderEnumList({ selectFirst: true });
  }

  if (kind === "template") {
    const item = findByIdTitleOrSlug(state.templates, id);
    if (item) {
      activateTab("templates");
      selectTemplate(item.id);
    }
  }

  if (kind === "bug") {
    const item = findByIdTitleOrSlug(state.bugs, id);
    if (item) {
      activateTab("bugs");
      selectBug(item.id);
    }
  }
}

function findByIdTitleOrSlug(items, value) {
  const normalized = String(value).toLowerCase();
  return items.find((item) => (
    item.id === value ||
    item.title === value ||
    slug(item.title) === normalized ||
    slug(item.id) === normalized
  ));
}

function showLoadError(error) {
  const message = escapeHtml(error.message || String(error));
  document.getElementById("apiList").innerHTML = `<p class="muted">Could not load API JSON. ${message}</p>`;
  document.getElementById("enumList").innerHTML = `<p class="muted">Could not load enum JSON. ${message}</p>`;
}

function renderDataError(containerId, title, error) {
  const message = error && error.message ? error.message : String(error || "Unknown error");
  const cardClass = containerId === "templateList" ? "template-card" : "bug-card";
  document.getElementById(containerId).innerHTML = `
    <article class="${cardClass}">
      <h3>${escapeHtml(title)}</h3>
      <p class="muted">${escapeHtml(message)}</p>
    </article>
  `;
}

function renderRelatedSummary(relatedApi, relatedEnums, relatedBugs) {
  return [
    `related API: ${relatedApi.length}`,
    `enums: ${relatedEnums.length}`,
    `known bugs: ${relatedBugs.length}`,
  ].join(" | ");
}

function renderBugRelatedSummary(relatedApi, relatedTemplates) {
  return [
    `related API: ${relatedApi.length}`,
    `templates: ${relatedTemplates.length}`,
  ].join(" | ");
}

function renderTags(tags) {
  return `<div class="tag-row">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`;
}

function compact(values) {
  return values.filter((value) => value !== undefined && value !== null && String(value).trim() !== "").map(String);
}

function unique(values) {
  return Array.from(new Set(compact(values)));
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
