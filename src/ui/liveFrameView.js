export function liveControlDeckHtml({
  onAirLabel = "匿名热线",
  label = "连线中",
  segment = 1,
  total = 1,
  pressure = {},
  material = "通话摘录"
} = {}) {
  const safeTotal = Math.max(1, Number(total ?? 1));
  const safeSegment = Math.max(1, Math.min(safeTotal, Number(segment ?? 1)));
  return `
    <aside class="control-deck" aria-label="直播控场台">
      <section class="deck-card deck-card-live">
        <span><i></i>ON AIR</span>
        <b>${escapeHtml(onAirLabel)}</b>
        <small>${escapeHtml(label || "连线中")}</small>
      </section>
      <section class="deck-card">
        <span>连线句子</span>
        <b>${safeSegment}/${safeTotal}</b>
        <small>麦没断，话还在往下走。</small>
      </section>
      <section class="deck-card deck-card-pressure">
        <span>听众耐心</span>
        <b>${Number(pressure.remaining ?? 0)}/${Number(pressure.max ?? 0)}</b>
        <small>${escapeHtml(pressure.patienceLabel ?? "")}</small>
      </section>
      <section class="deck-card deck-card-material">
        <span>后台材料</span>
        <b>${escapeHtml(material)}</b>
        <small>先放在台面边上。</small>
      </section>
    </aside>
  `;
}

export function liveFrameHtml({
  productName = "直播间大侦探",
  modeLabel = "试玩连线",
  soundEnabled = true,
  backdropClass = "backdrop-live",
  label = "",
  chapter = "",
  text = "",
  reactionHtml = "",
  choices = "",
  visualHud = "",
  controlDeckHtml = ""
} = {}) {
  return `
    <main>
      <header class="topbar">
        <button data-action="title" type="button" aria-label="回到标题页">${escapeHtml(productName)}</button>
        <nav aria-label="章节"><span class="active"><i></i>${escapeHtml(modeLabel)}</span></nav>
        <button data-action="sound" type="button">音效 ${soundEnabled ? "开" : "关"}</button>
        <button data-action="reset" type="button" aria-label="重新开始，清除本局存档">重开</button>
      </header>
      <section class="story-grid case-vn-grid live-console-shell">
        ${controlDeckHtml}
        <article class="vn-stage">
          <div class="visual-scene backdrop-office ${escapeHtml(backdropClass)}" aria-hidden="true">
            <div class="scene-label">${escapeHtml(label)}</div>
            ${visualHud}
          </div>
          <div class="dialogue-card" aria-live="polite">
            <p class="eyebrow">${escapeHtml(chapter)}</p>
            ${text}
            ${reactionHtml}
            <div class="choices">${choices}</div>
          </div>
        </article>
      </section>
    </main>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
