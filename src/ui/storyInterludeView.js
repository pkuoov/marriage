export function storyInterludeHtml({
  kicker = "广告间隙",
  shellLine = "",
  shellLines = [],
  shellAfterLines = [],
  worldEcho = null
} = {}) {
  return `
    <section class="story-interlude-card shell">
      <span>${escapeHtml(kicker)}</span>
      ${(shellLines ?? []).map((line) => `<div class="story-interlude-line"><b>${escapeHtml(line.speaker ?? "")}</b><p>${escapeHtml(line.text ?? "")}</p></div>`).join("")}
      <p>${escapeHtml(shellLine || "控台安静了一会儿，下一通的材料先到了后台。")}</p>
      ${(shellAfterLines ?? []).map((line) => `<div class="story-interlude-line stage"><b>${escapeHtml(line.speaker ?? "")}</b><p>${escapeHtml(line.text ?? "")}</p></div>`).join("")}
    </section>
    ${worldEcho ? `<section class="story-interlude-card world-echo">
      <span>${escapeHtml(worldEcho.kicker ?? "城市回声")}</span>
      <b>${escapeHtml(worldEcho.headline ?? "")}</b>
      <p>${escapeHtml(worldEcho.body ?? "")}</p>
    </section>` : ""}
  `;
}

export function storyInterludeChoicesHtml({ finalCase = false, worldEcho = null, worldEchoRevealed = false } = {}) {
  if (worldEcho && !worldEchoRevealed) {
    return `<button class="primary" data-reveal-world-echo type="button">${escapeHtml(worldEcho.actionLabel ?? "继续听")}</button><button data-retry-case type="button">回看这通</button>`;
  }
  const primary = finalCase
    ? `<button class="primary" data-enter-night-epilogue type="button">收播</button>`
    : `<button class="primary" data-enter-case-bridge type="button">接下一通</button>`;
  return `${primary}<button data-retry-case type="button">回看这通</button>`;
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
