export function storyInterludeHtml({
  nextObjectLabel = "",
  nextLine = "",
  shellLine = ""
} = {}) {
  return `
    <section class="story-interlude-card shell">
      <span>广告间隙</span>
      <p>${escapeHtml(shellLine || "控台安静了一会儿，下一通的材料先到了后台。")}</p>
    </section>
    <section class="story-interlude-card next">
      <span>下一通 · 材料先到</span>
      <b>${escapeHtml(nextObjectLabel)}</b>
      <p>${escapeHtml(nextLine)}</p>
    </section>
  `;
}

export function storyInterludeChoicesHtml() {
  return `<button class="primary" data-enter-next-case type="button">查看下一案</button><button data-retry-case type="button">回看本案</button>`;
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
