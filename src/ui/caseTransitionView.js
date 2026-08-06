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
      <ol class="case-closing-beats">
        ${beats.map((beat) => `
          <li>
            <b>${escapeHtml(beat.label)}</b>
            <p>${escapeHtml(beat.text)}</p>
          </li>
        `).join("")}
      </ol>
      <div class="case-closing-facts">
        ${closingColumnHtml("今晚能确认", confirmed, "confirmed")}
        ${closingColumnHtml("今晚不替人定", unresolved, "unresolved")}
      </div>
      <div class="case-closing-next">
        <span>节目给出的下一步</span>
        <p>${escapeHtml(nextStep)}</p>
      </div>
    </section>
  `;
}

export function caseClosingChoicesHtml() {
  return `<button class="primary" data-enter-story-interlude type="button">进入案间</button><button data-return-recap type="button">回看本案</button>`;
}

export function caseBridgeHtml({
  fromCaseNumber = 1,
  toCaseNumber = 2,
  fromAct = "",
  nextAct = "",
  quote = {},
  nextBrief = {}
} = {}) {
  const nextTitle = nextBrief.caseTitle?.title ?? nextBrief.label ?? "下一通来电";
  const nextObject = nextBrief.storyObjectLabel ?? nextBrief.storyClueObject ?? "新材料";
  return `
    <section class="case-bridge-card">
      <header class="case-bridge-route" aria-label="从第 ${String(fromCaseNumber).padStart(2, "0")} 幕进入第 ${String(toCaseNumber).padStart(2, "0")} 幕">
        <span><small>ACT ${String(fromCaseNumber).padStart(2, "0")}</small><b>${escapeHtml(fromAct || "已收束")}</b></span>
        <i aria-hidden="true"></i>
        <span><small>ACT ${String(toCaseNumber).padStart(2, "0")}</small><b>${escapeHtml(nextAct || "待接入")}</b></span>
      </header>
      <blockquote>
        <p>“${escapeHtml(quote.text ?? "")}”</p>
        <cite>${escapeHtml(quote.source ?? "")}</cite>
      </blockquote>
      <div class="case-bridge-handoff">
        <span>下一幕 · ${escapeHtml(nextObject)}</span>
        <b>${escapeHtml(nextTitle)}</b>
        <p>${escapeHtml(quote.bridge ?? nextBrief.storyBridge ?? "后台又亮了一路麦。")}</p>
      </div>
    </section>
  `;
}

export function caseBridgeChoicesHtml(toCaseNumber = 2) {
  return `<button class="primary" data-enter-next-case type="button">翻到第 ${String(toCaseNumber).padStart(2, "0")} 幕</button>`;
}

export function caseTitleHtml({ caseNumber = 1, totalCases = 4, brief = {} } = {}) {
  const titleCard = brief.caseTitle ?? {};
  const title = titleCard.title ?? brief.label ?? "新的来电";
  const subtitle = typeof titleCard.subtitle === "string" ? titleCard.subtitle.trim() : "";
  const intro = titleCard.intro ?? brief.storyBridge ?? "控台亮起了新的呼入灯。";
  const act = brief.storyAct ?? "来电";
  const object = brief.storyObjectLabel ?? brief.storyClueObject ?? "后台材料";
  return `
    <section class="case-title-card">
      <header class="case-title-index">
        <span>ACT ${String(caseNumber).padStart(2, "0")}</span>
        <small>${String(caseNumber).padStart(2, "0")} / ${String(totalCases).padStart(2, "0")}</small>
      </header>
      <p class="case-title-act">第${chineseNumber(caseNumber)}幕 · ${escapeHtml(act)}</p>
      <h1>${escapeHtml(title)}</h1>
      ${subtitle ? `<p class="case-title-subtitle">${escapeHtml(subtitle)}</p>` : ""}
      <div class="case-title-rule"></div>
      <p class="case-title-intro">${escapeHtml(intro)}</p>
      <div class="case-title-object"><span>本幕材料</span><b>${escapeHtml(object)}</b></div>
    </section>
  `;
}

export function caseTitleChoicesHtml(caseNumber = 1) {
  return `<button class="primary" data-enter-case-live type="button">接入第 ${String(caseNumber).padStart(2, "0")} 幕</button>`;
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

function chineseNumber(value = 1) {
  return ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][Number(value)] ?? String(value);
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
