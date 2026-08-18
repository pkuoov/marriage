export function caseClosingHtml({ caseNumber = 1, closing = {}, boundary = {} } = {}) {
  const title = closing.title ?? "本案结案";
  const verdict = closing.verdict ?? "今晚先把能确认和不能确认的事分开。";
  const beats = closing.beats ?? [];
  const confirmed = closing.confirmed ?? boundaryItems(boundary, "true");
  const unresolved = closing.unresolved ?? boundaryItems(boundary, "unknown");
  const nextStep = closing.nextStep ?? "先保留材料，等能核实的部分补齐。";
  return `
    <section class="case-closing-card">
      <div class="case-closing-heading">
        <span>第 ${String(caseNumber).padStart(2, "0")} 案 · 已收麦</span>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(verdict)}</p>
      </div>
      ${closing.notice?.text ? `<div class="case-closing-notice"><span>${escapeHtml(closing.notice.label ?? "后台消息")}</span><p>${escapeHtml(closing.notice.text)}</p></div>` : ""}
      <ol class="case-closing-beats">
        ${beats.map((beat) => `
          <li>
            <b>${escapeHtml(beat.label)}</b>
            <p>${escapeHtml(beat.text)}</p>
          </li>
        `).join("")}
      </ol>
      <div class="case-closing-facts">
        ${closingColumnHtml("已经确认", confirmed, "confirmed")}
        ${closingColumnHtml("还没弄清", unresolved, "unresolved")}
      </div>
      <div class="case-closing-next">
        <span>接下来</span>
        <p>${escapeHtml(nextStep)}</p>
      </div>
    </section>
  `;
}

export function caseClosingChoicesHtml() {
  return `<button class="primary" data-enter-story-interlude type="button">收麦后</button><button data-return-recap type="button">回看本案</button>`;
}

export function caseBridgeHtml({
  fromCaseNumber = 1,
  toCaseNumber = 2,
  quote = {},
  fromMaterialSrc = "",
  toMaterialSrc = ""
} = {}) {
  const bridgeCopy = quote.kind === "news-push"
    ? `<div class="case-bridge-news"><span>财经推送</span><b>${escapeHtml(quote.headline ?? "新消息")}</b><p>${escapeHtml(quote.text ?? "")}</p><small>${escapeHtml(quote.source ?? "")}</small></div>`
    : `<blockquote><p>“${escapeHtml(quote.text ?? "")}”</p><cite>${escapeHtml(quote.source ?? "")}</cite></blockquote>`;
  return `
    <section class="case-bridge-card">
      <div class="case-bridge-objects" aria-hidden="true">
        <figure class="case-bridge-object outgoing">${fromMaterialSrc ? `<img src="${escapeHtml(fromMaterialSrc)}" alt="" onerror="this.hidden=true" />` : "<i></i>"}</figure>
        <span><i></i></span>
        <figure class="case-bridge-object incoming">${toMaterialSrc ? `<img src="${escapeHtml(toMaterialSrc)}" alt="" onerror="this.hidden=true" />` : "<i></i>"}</figure>
      </div>
      ${bridgeCopy}
    </section>
  `;
}

export function caseBridgeChoicesHtml() {
  return `<button class="primary" data-enter-next-case type="button">接下一通</button>`;
}

export function caseTitleHtml({ caseNumber = 1, totalCases = 4, brief = {} } = {}) {
  const titleCard = brief.caseTitle ?? {};
  const title = titleCard.title ?? brief.label ?? "新的来电";
  return `
    <section class="case-title-card">
      <header class="case-title-index">
        <span>CASE ${String(caseNumber).padStart(2, "0")}</span>
      </header>
      <h1>${escapeHtml(title)}</h1>
      <div class="case-title-rule"></div>
    </section>
  `;
}

export function caseTitleChoicesHtml() {
  return `<button class="primary" data-enter-case-live type="button">接听</button>`;
}

function closingColumnHtml(label, items, className) {
  const rows = (items ?? []).slice(0, 3);
  if (!rows.length) return "";
  return `
    <section class="case-closing-column ${escapeHtml(className)}">
      <span>${escapeHtml(label)}</span>
      <ul>${rows.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
  `;
}

function boundaryItems(boundary, key) {
  return boundary?.columns?.find((column) => column.key === key)?.items ?? [];
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}
