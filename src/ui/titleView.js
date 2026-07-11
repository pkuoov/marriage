export function titleScreenHtml({
  productName = "直播间大侦探",
  storyPack = true,
  title = "",
  hook = "",
  object = "",
  host = {}
} = {}) {
  return `
    <main>
      <section class="title-screen">
        <div class="title-copy">
          <p class="eyebrow">${storyPack ? "Steam 首发试玩" : "今日匿名来电"}</p>
          <h1>${escapeHtml(productName)}</h1>
          <p>${escapeHtml(title)}</p>
          <div class="title-console-strip" aria-hidden="true">
            <span><b>ON AIR</b><small>热线待接</small></span>
            <span><b>REC</b><small>后台留档</small></span>
            <span><b>LIVE</b><small>弹幕入场</small></span>
          </div>
          ${storyPack ? `
            <section class="title-host-card">
              <span>今晚值班的主播</span>
              <b>${escapeHtml(host.name ?? "林旭阳")}<small>${escapeHtml(host.role ?? "深夜热线主播")}</small></b>
              <p>${escapeHtml(host.setup ?? "不替任何人下结论，只把没说全的话问清楚。")}</p>
            </section>
          ` : ""}
          <div class="quick-play-card case-file-ledger daily-hook-card">
            <span>${escapeHtml(object)}</span>
            <b>${escapeHtml(hook)}</b>
            <small>${storyPack ? "麦已经亮了。" : "同一天同一通电话。你接哪句，朋友进来就能对答案。"}</small>
          </div>
          <div class="title-actions">
            <button class="primary" data-start-story type="button">${storyPack ? "接通" : "我来接一句"}</button>
          </div>
        </div>
      </section>
    </main>
  `;
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
