import { audioSettingsPanelHtml } from "./audioSettingsView.js?v=0.22.0";

export function titleScreenHtml({
  productName = "直播间大侦探",
  storyPack = true,
  title = "",
  hook = "",
  object = "",
  host = {},
  audioSettings = {},
  canContinue = false,
  resumeLabel = "上次停在：直播连线",
  confirmNewGame = false
} = {}) {
  return `
    <main>
      <section class="title-screen">
        <div class="title-copy">
          <p class="eyebrow">${storyPack ? "Steam 首发试玩" : "今日匿名来电"}</p>
          <h1>${escapeHtml(productName)}</h1>
          <p>${escapeHtml(title)}</p>
          <div class="title-console-strip" aria-hidden="true">
            <span><b>STANDBY</b><small>等待开播</small></span>
            <span><b>REC</b><small>后台留档</small></span>
            <span><b>LINE</b><small>热线待接</small></span>
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
            <small>${storyPack ? "先进去。开播以后，再接第一通线。" : "同一天同一通电话。你接哪句，朋友进来就能对答案。"}</small>
          </div>
          <div class="title-actions">
            <div class="title-journey-menu">
              ${canContinue ? `
                <button class="primary title-journey-action title-journey-continue" data-continue-story type="button">
                  <span>CONTINUE</span>
                  <b>继续上次直播</b>
                  <small>${escapeHtml(resumeLabel)}</small>
                </button>
                <button class="title-journey-action title-journey-new" data-request-new-game type="button">
                  <span>NEW GAME</span>
                  <b>新游戏</b>
                  <small>从开播前重新开始</small>
                </button>
              ` : `
                <button class="primary title-journey-action title-journey-new title-journey-new-only" data-start-story type="button">
                  <span>NEW GAME</span>
                  <b>${storyPack ? "新游戏" : "开始今日来电"}</b>
                  <small>${storyPack ? "从今晚 20:00 的开播前开始" : "接入今天这通匿名来电"}</small>
                </button>
              `}
            </div>
            ${confirmNewGame ? `
              <section class="title-new-game-confirm" aria-live="polite">
                <div><b>要从头开始吗？</b><small>新游戏会覆盖当前进度。</small></div>
                <button data-cancel-new-game type="button">保留进度</button>
                <button class="primary" data-confirm-new-game type="button">确认新游戏</button>
              </section>
            ` : ""}
            <div class="title-utility-row">${audioSettingsPanelHtml(audioSettings, { placement: "title" })}</div>
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
