export function mountCourtRecord(root, { state, onSettingsChange = () => {}, onBeforeOpen = () => {} } = {}) {
  if (!root) return;
  const overlay = document.createElement("aside");
  overlay.className = "court-record";
  overlay.hidden = true;
  overlay.innerHTML = courtRecordHtml(state);
  root.append(overlay);
  const open = () => { onBeforeOpen(); overlay.hidden = false; overlay.querySelector("button")?.focus(); };
  const close = () => { overlay.hidden = true; };
  root.querySelectorAll("[data-record-open]").forEach((button) => button.addEventListener("click", open));
  overlay.querySelector("[data-record-close]")?.addEventListener("click", close);
  overlay.querySelectorAll("[data-record-tab]").forEach((button) => button.addEventListener("click", () => {
    overlay.querySelectorAll("[data-record-tab]").forEach((item) => item.classList.toggle("active", item === button));
    overlay.querySelectorAll("[data-record-page]").forEach((page) => { page.hidden = page.dataset.recordPage !== button.dataset.recordTab; });
  }));
  root.querySelectorAll("[data-avg-setting]").forEach((button) => button.addEventListener("click", () => onSettingsChange(button.dataset.avgSetting)));
  return { open, close };
}

export function courtRecordHtml(state = {}) {
  const backlog = state.dialogueBacklog ?? [];
  const materialRows = values(state.evidenceCheckPicks).map(labelFor).filter(Boolean);
  const documentRows = values(state.documentRowPicks ?? state.investigationPicks).map(labelFor).filter(Boolean);
  const earnedRows = [...(state.earnedItems ?? []), ...values(state.delegationPicks).map(labelFor)].filter(Boolean);
  return `<div class="court-record-panel" role="dialog" aria-label="案卷">
    <header><h2>案卷</h2><button data-record-close type="button">关闭</button></header>
    <nav>${tab("materials", "材料", true)}${tab("documents", "文档")}${tab("earned", "收获")}${tab("backlog", "对话记录")}</nav>
    ${page("materials", materialRows, true)}${page("documents", documentRows)}${page("earned", earnedRows)}
    <section data-record-page="backlog" hidden class="record-backlog">${backlog.map((row) => `<p><b>${escapeHtml(row.role === "host" ? "你" : row.speaker)}</b><span>${escapeHtml(row.text)}</span></p>`).join("")}</section>
  </div>`;
}

export function avgSystemBarHtml(settings = {}) {
  return `<div class="avg-system-bar"><button data-avg-setting="auto" type="button">自动 ${settings.autoMode ? "开" : "关"}</button><button data-avg-setting="fast" type="button">快进</button><button data-avg-setting="speed" type="button">字速 ${speedLabel(settings.textSpeed)}</button><button data-avg-setting="effects" type="button">闪烁/震动 ${effectsLabel(settings.screenEffects)}</button></div>`;
}

function tab(id, label, active = false) { return `<button class="${active ? "active" : ""}" data-record-tab="${id}" type="button">${label}</button>`; }
function page(id, rows, active = false) { return `<section data-record-page="${id}" ${active ? "" : "hidden"}>${rows.map((row) => `<p>${escapeHtml(row)}</p>`).join("")}</section>`; }
function values(value) { return Object.values(value ?? {}).flat(); }
function labelFor(value) { return typeof value === "string" ? value : value?.material ?? value?.label ?? value?.title ?? value?.question ?? ""; }
function speedLabel(value) { return ({ slow: "慢", normal: "中", fast: "快", instant: "立即" })[value] ?? "中"; }
function effectsLabel(value) { return ({ full: "完整", reduced: "减弱", off: "关闭" })[value] ?? "完整"; }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]); }
