export function storyInterludeHtml({
  nextObjectLabel = "",
  nextLine = "",
  shellLine = "",
  shellLines = [],
  shellAfterLines = []
} = {}) {
  return `
    <section class="story-interlude-card shell">
      <span>广告间隙</span>
      ${(shellLines ?? []).map((line) => `<div class="story-interlude-line"><b>${escapeHtml(line.speaker ?? "")}</b><p>${escapeHtml(line.text ?? "")}</p></div>`).join("")}
      <p>${escapeHtml(shellLine || "控台安静了一会儿，下一通的材料先到了后台。")}</p>
      ${(shellAfterLines ?? []).map((line) => `<div class="story-interlude-line stage"><b>${escapeHtml(line.speaker ?? "")}</b><p>${escapeHtml(line.text ?? "")}</p></div>`).join("")}
    </section>
    <section class="story-interlude-card next">
      <span>下一通 · 材料先到</span>
      <b>${escapeHtml(nextObjectLabel)}</b>
      <p>${escapeHtml(nextLine)}</p>
    </section>
  `;
}

export function storyInterludeChoicesHtml() {
  return `<button class="primary" data-enter-next-case type="button">接下一路麦</button><button data-retry-case type="button">回看这通</button>`;
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
