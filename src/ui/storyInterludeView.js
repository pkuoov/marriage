export function storyInterludeHtml({
  previousLabel = "",
  previousLine = "",
  nextObjectLabel = "",
  nextLine = "",
  shellLine = ""
} = {}) {
  return `
    <section class="story-interlude-card">
      <span>上一通留下</span>
      <b>${escapeHtml(previousLabel)}</b>
      <p>${escapeHtml(previousLine)}</p>
    </section>
    ${shellLine ? `
    <section class="story-interlude-card shell">
      <span>幕间</span>
      <p>${escapeHtml(shellLine)}</p>
    </section>
    ` : ""}
    <section class="story-interlude-card next">
      <span>新来电接入</span>
      <b>${escapeHtml(nextObjectLabel)}</b>
      <p>${escapeHtml(nextLine)}</p>
    </section>
  `;
}

export function storyInterludeChoicesHtml() {
  return `<button class="primary" data-enter-next-case type="button">接下一路麦</button><button data-retry-case type="button">回头重问</button>`;
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
