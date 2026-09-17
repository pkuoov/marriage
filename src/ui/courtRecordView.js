import { materialRecordHtml } from "./materialRecordView.js";
import { cafeMaterialDocumentHtml } from "./prologueCafeView.js";

export function mountCourtRecord(root, { state, cafe = {}, materialItems = [], onSettingsChange = () => {}, onBeforeOpen = () => {}, onVisibilityChange = () => {} } = {}) {
  if (!root) return;
  const overlay = document.createElement("aside");
  overlay.className = "court-record";
  overlay.hidden = true;
  overlay.innerHTML = courtRecordHtml(state, { cafe, materialItems });
  root.append(overlay);
  let lastFocused = null;
  let activeTab = "materials";
  const selectTab = (id) => {
    activeTab = id;
    overlay.querySelectorAll("[data-record-tab]").forEach((item) => {
      const active = item.dataset.recordTab === id;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    overlay.querySelectorAll("[data-record-page]").forEach((page) => {
      page.hidden = page.dataset.recordPage !== id;
      if (id === "backlog" && !page.hidden) page.scrollTop = page.scrollHeight;
    });
  };
  const open = () => {
    onBeforeOpen();
    lastFocused = document.activeElement;
    overlay.innerHTML = courtRecordHtml(state, { cafe, materialItems });
    overlay.hidden = false;
    selectTab(activeTab);
    onVisibilityChange();
    overlay.querySelector("button")?.focus({ preventScroll: true });
  };
  const close = ({ restoreFocus = true } = {}) => {
    if (overlay.hidden) return;
    overlay.hidden = true;
    onVisibilityChange();
    if (restoreFocus && lastFocused?.isConnected) lastFocused.focus?.({ preventScroll: true });
  };
  root.querySelectorAll("[data-record-open]").forEach((button) => button.addEventListener("click", open));
  overlay.addEventListener("click", (event) => {
    if (event.target.closest("[data-record-close]")) close();
    const tabButton = event.target.closest("[data-record-tab]");
    if (tabButton) selectTab(tabButton.dataset.recordTab);
  });
  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(overlay.querySelectorAll("button:not(:disabled), summary, input:not(:disabled), [tabindex]:not([tabindex='-1'])"))
      .filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) return;
    const currentIndex = focusable.indexOf(document.activeElement);
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
      : (currentIndex < 0 || currentIndex >= focusable.length - 1 ? 0 : currentIndex + 1);
    event.preventDefault();
    focusable[nextIndex].focus?.({ preventScroll: true });
  });
  root.querySelectorAll("[data-avg-setting]").forEach((button) => button.addEventListener("click", () => onSettingsChange(button.dataset.avgSetting)));
  return { open, close };
}

export function courtRecordHtml(state = {}, { cafe = {}, materialItems = [] } = {}) {
  const backlog = state.dialogueBacklog ?? [];
  const seen = new Set([...(state.cafePrologueInspectedIds ?? []), ...(state.cafePrologueMarks ?? [])]);
  const cafeMaterials = [...(cafe.evidencePair ?? []), cafe.transferEvidence].filter((card) => card && seen.has(card.id));
  const originalMaterials = cafeMaterials.map((card) => `<details class="record-material"><summary>${escapeHtml(card.title ?? "材料原件")} · 查看原件</summary>${cafeMaterialDocumentHtml(card, { hidden: false })}</details>`).join("");
  const materialRows = values(state.evidenceCheckPicks).map(labelFor).filter(Boolean);
  const documentRows = values(state.documentRowPicks ?? state.investigationPicks).map(labelFor).filter(Boolean);
  const earnedRows = [...(state.earnedItems ?? []), ...values(state.delegationPicks).map(labelFor)].filter(Boolean);
  return `<div class="court-record-panel" role="dialog" aria-modal="true" aria-label="案卷">
    <header><h2>案卷</h2><button data-record-close type="button">关闭</button></header>
    <nav>${tab("materials", "材料", true)}${tab("documents", "文档")}${tab("earned", "收获")}${tab("backlog", "对话记录")}</nav>
    ${page("materials", materialRows, true, originalMaterials + materialRecordHtml(materialItems))}${page("documents", documentRows)}${page("earned", earnedRows)}
    <section data-record-page="backlog" hidden class="record-backlog">${state.contentHistoryNotice ? `<p class="record-empty">${escapeHtml(state.contentHistoryNotice)}</p>` : ""}${backlog.length ? backlog.map((row) => `<p><b>${escapeHtml(row.role === "host" ? "你" : row.speaker)}</b><span>${escapeHtml(row.text)}</span></p>`).join("") : emptyRecordHtml("已读对话会记录在这里。")}</section>
  </div>`;
}

export function avgSystemBarHtml(settings = {}) {
  return `<div class="avg-system-bar"><button data-avg-setting="auto" type="button" aria-pressed="${Boolean(settings.autoMode)}">自动 ${settings.autoMode ? "开" : "关"}</button><button data-avg-setting="fast" type="button" aria-pressed="${Boolean(settings.fastForward)}" title="文字立即显示；自动播放由“自动”控制">即时文字 ${settings.fastForward ? "开" : "关"}</button><button data-avg-setting="speed" type="button">字速 ${speedLabel(settings.textSpeed)}</button><button data-avg-setting="effects" type="button">画面效果 ${effectsLabel(settings.screenEffects)}</button></div>`;
}

function tab(id, label, active = false) { return `<button class="${active ? "active" : ""}" data-record-tab="${id}" type="button" aria-pressed="${active}">${label}</button>`; }
function emptyRecordHtml(message = "暂时没有记录。查看材料、完成圈点后，可在这里回看。") {
  return `<p class="record-empty">${escapeHtml(message)}</p>`;
}
function page(id, rows, active = false, originals = "") {
  return `<section data-record-page="${id}" ${active ? "" : "hidden"}>${originals}${rows.map((row) => `<p>${escapeHtml(row)}</p>`).join("")}${!originals && !rows.length ? emptyRecordHtml() : ""}</section>`;
}
function values(value) { return Object.values(value ?? {}).flat(); }
function labelFor(value) { return typeof value === "string" ? value : value?.material ?? value?.label ?? value?.title ?? value?.question ?? ""; }
function speedLabel(value) { return ({ slow: "慢", normal: "中", fast: "快", instant: "立即" })[value] ?? "中"; }
function effectsLabel(value) { return ({ full: "完整", reduced: "减弱", off: "关闭" })[value] ?? "完整"; }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]); }
