export function solvedRecapPagesHtml({
  rank = "",
  issue = {},
  result = {},
  route = {},
  routeTrail = "",
  pressure = {},
  quoteComparison = null,
  conclusion = {},
  offMicLetters = [],
  boundary = {},
  boundaryPicks = {},
  boundaryLine = "",
  issueLineText = ""
} = {}) {
  return [
    `
      <section class="recap-score-card">
        <div class="recap-score-head"><span>收麦回看</span><em>${escapeHtml(rank)}</em></div>
        <div class="recap-score-main">
          <b>${Number(issue.percent ?? 0)}</b>
          <span>% 已问到</span>
        </div>
        <div class="recap-score-grid">
          <span><b>${(issue.revealed ?? []).length ? "有抓手" : "刚开口"}</b><small>麦上记录</small></span>
          <span><b>${result.dailyBadge ? "能挂麦" : "还会吵"}</b><small>弹幕</small></span>
        </div>
        <p>${escapeHtml(issueLineText)}</p>
        <div class="route-map-card">
          <span>本案路线</span>
          <b>${escapeHtml(route.label)}</b>
          <small>${escapeHtml(route.summary)}</small>
          ${routeTrail}
        </div>
        <div class="pressure-recap-card">
          <span>现场压力</span>
          <b>${escapeHtml(pressure.label)}</b>
          <small>${escapeHtml(pressure.line)}</small>
        </div>
        <p><strong>你接住的那句</strong>：${escapeHtml(result.dailyAccuseLabel ?? "还没选最后那句")}。</p>
        ${result.dailyResponse ? `<p><strong>主播接法</strong>：${escapeHtml(result.dailyResponse)}</p>` : ""}
        ${quoteComparison ? finalQuoteComparisonHtml(quoteComparison) : ""}
      </section>
    `,
    `
      <p><b>台面上的话</b></p>
      <p>${(issue.revealed ?? []).length ? issue.revealed.map(escapeHtml).join(" / ") : "这轮只听到表层，评论区还会继续吵。"}</p>
    `,
    `
      <p><b>主播收话</b></p>
      <p>${escapeHtml(conclusion.summary)}</p>
      ${conclusion.deepQuestion ? `<p class="hint"><strong>多问一句</strong>：${escapeHtml(conclusion.deepQuestion)}</p>` : ""}
    `,
    `
      <p><b>后续回拨</b></p>
      <p>${escapeHtml(conclusion.followup)}</p>
    `,
    offMicLettersHtml(offMicLetters),
    truthBoundaryReviewHtml(boundary, boundaryPicks),
    `
      <p><b>连线收住</b></p>
      ${truthBoundaryRevealHtml(boundary, boundaryPicks)}
      ${boundaryLine ? `<p class="hint">${escapeHtml(boundaryLine)}</p>` : ""}
      <p>${escapeHtml(conclusion.truth)}</p>
    `
  ].filter((page) => String(page ?? "").trim());
}

export function offMicLettersHtml(letters = []) {
  const rows = (letters ?? []).filter(Boolean);
  if (!rows.length) return "";
  return `
    <section class="offmic-letter-card">
      <p><b>麦外来信</b></p>
      <div class="offmic-letter-list">
        ${rows.map((letter) => `
          <article class="offmic-letter ${escapeHtml(letter.kind ?? "note")}">
            <span>${escapeHtml(letter.badge ?? "后台留言")}</span>
            ${letter.appearsNowBecause ? `<small>${escapeHtml(letter.appearsNowBecause)}</small>` : ""}
            <p>${escapeHtml(letter.text ?? "")}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

export function solvedRecapFlowView({
  pages = [],
  step = 0,
  boundary = {},
  boundaryPicks = {},
  afterLabel = "继续",
  retryLabel = "从头再问"
} = {}) {
  const safePages = Array.isArray(pages) && pages.length ? pages : [""];
  const index = Math.max(0, Math.min(Number(step ?? 0), safePages.length - 1));
  const pageHtml = safePages[index] ?? "";
  const isBoundaryPage = pageHtml.includes("truth-boundary-card");
  const canLeaveBoundary = !isBoundaryPage || truthBoundaryPlaced(boundary, boundaryPicks);
  return {
    index,
    pageCount: safePages.length,
    isBoundaryPage,
    canLeaveBoundary,
    text: `<div class="recap-page-kicker"><span>回看</span><b>${index + 1}/${safePages.length}</b></div>${pageHtml}`,
    choices: recapFlowChoicesHtml({
      index,
      pageCount: safePages.length,
      canLeaveBoundary,
      afterLabel,
      retryLabel
    })
  };
}

export function finalQuoteComparisonHtml(comparison) {
  const pickedCaption = comparison.sameQuote ? "就接这句" : "你接的那句";
  if (comparison.sameQuote) {
    return `
      <div class="quote-compare-card quote-compare-card-single">
        <p><span>${escapeHtml(pickedCaption)}</span><b>${escapeHtml(comparison.pickedLabel)}</b>${comparison.pickedResponse ? `<small>${escapeHtml(comparison.pickedResponse)}</small>` : ""}<em>这句够了。</em></p>
      </div>
    `;
  }
  const bestCaption = "换个口子";
  return `
    <div class="quote-compare-card">
      <p><span>${escapeHtml(pickedCaption)}</span><b>${escapeHtml(comparison.pickedLabel)}</b>${comparison.pickedResponse ? `<small>${escapeHtml(comparison.pickedResponse)}</small>` : ""}</p>
      <p><span>${escapeHtml(bestCaption)}</span><b>${escapeHtml(comparison.bestLabel)}</b>${comparison.bestResponse ? `<small>${escapeHtml(comparison.bestResponse)}</small>` : ""}</p>
    </div>
  `;
}

export function truthBoundaryReviewHtml(review, picks = {}) {
  if (!review?.columns?.length) {
    return `
      <p><b>事实边界</b></p>
      <p>这通还没留下足够边界。</p>
    `;
  }
  return `
    <section class="truth-boundary-card">
      <p><b>${escapeHtml(review.title)}</b></p>
      <p>${escapeHtml(review.line)}</p>
      ${truthBoundaryChallengeHtml(review, picks)}
    </section>
  `;
}

export function truthBoundaryRevealHtml(review, picks = {}) {
  if (!review?.columns?.length) return "";
  return `
    <div class="truth-boundary-grid truth-boundary-reveal">
      ${review.columns.map((column) => `
        <div class="truth-boundary-column truth-boundary-${escapeHtml(column.key)}">
          <span>${escapeHtml(column.label)}</span>
          <ul>
            ${column.items.map((item, index) => {
              const promptId = `${column.key}:${index}`;
              const wasPrompted = (review.prompts ?? []).some((prompt) => prompt.id === promptId);
              const picked = picks[promptId] ?? "";
              const mark = picked ? picked === column.key ? "放在这儿说得通" : `归到了${truthBoundaryChoiceLabel(review, picked)}` : wasPrompted ? "没放" : "回看补上";
              return `<li>${escapeHtml(item)}<small>${escapeHtml(mark)}</small></li>`;
            }).join("")}
          </ul>
        </div>
      `).join("")}
    </div>
  `;
}

export function truthBoundaryPlaced(review, picks = {}) {
  return (review?.prompts ?? []).every((prompt) => Boolean(picks[prompt.id]));
}

function truthBoundaryChallengeHtml(review, picks = {}) {
  if (!review?.prompts?.length) return "";
  return `
    <div class="truth-boundary-challenge">
      ${review.prompts.map((prompt) => {
        const picked = picks[prompt.id] ?? "";
        const pickedLabel = review.choices.find((choice) => choice.key === picked)?.label ?? "";
        return `
          <div class="truth-boundary-prompt ${picked ? "placed" : ""}">
            <p>${escapeHtml(prompt.text)}</p>
            <div class="truth-boundary-options">
              ${review.choices.map((choice) => `
                <button class="${picked === choice.key ? "selected" : ""}" ${picked ? "disabled" : `data-truth-boundary-prompt="${escapeHtml(prompt.id)}" data-truth-boundary-pick="${escapeHtml(choice.key)}"`} type="button">${escapeHtml(choice.label)}</button>
              `).join("")}
            </div>
            ${picked ? `<small>放在：${escapeHtml(pickedLabel)}。</small>` : ""}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function recapFlowChoicesHtml({ index = 0, pageCount = 1, canLeaveBoundary = true, afterLabel = "继续", retryLabel = "从头再问" } = {}) {
  const hasNext = Number(index ?? 0) < Number(pageCount ?? 1) - 1;
  if (hasNext) {
    return flowGroup(`
      ${canLeaveBoundary
        ? `<button class="primary" data-recap-next type="button">继续回看</button>`
        : `<button class="primary" disabled type="button">还有话没落位</button>`}
      <button data-retry-case type="button">${escapeHtml(retryLabel)}</button>
    `);
  }
  return flowGroup(`
    <button class="primary" data-after-recap type="button">${escapeHtml(afterLabel)}</button>
    <button data-retry-case type="button">${escapeHtml(retryLabel)}</button>
  `);
}

function flowGroup(content) {
  return `<div class="choice-flow">${content}</div>`;
}

function truthBoundaryChoiceLabel(review, key) {
  return review.choices?.find((choice) => choice.key === key)?.label ?? "另一栏";
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
