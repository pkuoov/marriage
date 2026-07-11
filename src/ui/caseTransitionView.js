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

export function caseTitleHtml({ caseNumber = 1, brief = {} } = {}) {
  const titleCard = brief.caseTitle ?? {};
  const title = titleCard.title ?? brief.label ?? "新的来电";
  const subtitle = titleCard.subtitle ?? brief.publicHook ?? "一通新来电已经接入后台。";
  const intro = titleCard.intro ?? brief.storyBridge ?? "控台亮起了新的呼入灯。";
  return `
    <section class="case-title-card">
      <span>试玩连线 · 第 ${String(caseNumber).padStart(2, "0")} 案</span>
      <h1>${escapeHtml(title)}</h1>
      <p class="case-title-subtitle">${escapeHtml(subtitle)}</p>
      <div class="case-title-rule"></div>
      <p class="case-title-intro">${escapeHtml(intro)}</p>
    </section>
  `;
}

export function caseTitleChoicesHtml(caseNumber = 1) {
  return `<button class="primary" data-enter-case-live type="button">接入第 ${String(caseNumber).padStart(2, "0")} 案</button>`;
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
