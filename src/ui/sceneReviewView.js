export function sceneReviewHtml({
  index = 0,
  done = false,
  activeExchangeHtml = "",
  completedExchangeHtml = "",
  reviewHtml = ""
} = {}) {
  return `
    <p><b>第 ${Number(index ?? 0) + 1} 段来电</b></p>
    <div class="call-dialogue">
      ${done ? completedExchangeHtml : activeExchangeHtml}
    </div>
    ${reviewHtml}
  `;
}

export function sceneReviewDoneChoicesHtml({
  lastStage = false,
  nextStage = "",
  nextLabel = "继续",
  continueLabel = "继续"
} = {}) {
  return flowGroup(`
    ${lastStage
      ? `<button class="primary" data-scene="${escapeHtml(nextStage)}" type="button">${escapeHtml(nextLabel)}</button>`
      : `<button class="primary" data-next-scene-stage type="button">${escapeHtml(continueLabel)}</button>`}
  `);
}

function flowGroup(content) {
  return `<div class="choice-flow">${content}</div>`;
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
