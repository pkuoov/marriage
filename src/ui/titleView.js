import { audioSettingsPanelHtml } from "./audioSettingsView.js";

export function titleScreenHtml({
  productName = "深夜热线：直播间侦探",
  storyPack = true,
  title = "",
  hook = "",
  object = "",
  host = {},
  audioSettings = {},
  canContinue = false,
  resumeLabel = "上次停在：直播连线",
  confirmNewGame = false,
  saveLoadError = null,
  quickModeAvailable = false,
  playerName = "林旭阳"
} = {}) {
  const titleLines = productTitleLines(productName);
  return `
    <main>
      <section class="title-screen">
        <div class="title-page-shell">
          <header class="title-masthead">
            <span>${storyPack ? "STEAM DEMO · NIGHT SHIFT" : "DAILY CALL · ON AIR"}</span>
            <b>${escapeHtml(storyPack ? title : "今日匿名来电")}</b>
          </header>
          <div class="title-layout">
            <section class="title-brand-block">
              <p class="eyebrow">${storyPack ? "匿名连麦 · 现实推理" : "今天只有这一通"}</p>
              <h1><span>${escapeHtml(titleLines[0])}</span><strong>${escapeHtml(titleLines[1])}</strong></h1>
              ${storyPack ? "" : `<p class="title-deck">${escapeHtml(title)}</p>`}
            </section>
            <aside class="title-entry-panel">
              <div class="title-console-strip" aria-label="直播间状态">
                <span><i></i><b>STANDBY</b><small>等待开播</small></span>
                <span><b>20:00</b><small>今晚值班</small></span>
              </div>
              ${storyPack ? `
                <section class="title-host-card">
                  <label class="title-host-name-field">
                    <input data-player-name type="text" value="${escapeHtml(playerName || host.name || "林旭阳")}" maxlength="12" autocomplete="off" spellcheck="false" aria-label="主播姓名" />
                    <small>${escapeHtml(host.role ?? "深夜热线主播")}</small>
                  </label>
                </section>
              ` : ""}
              ${storyPack ? "" : `<div class="quick-play-card case-file-ledger daily-hook-card">
                <span>${escapeHtml(object)}</span>
                <b>${escapeHtml(hook)}</b>
                <small>同一天同一通电话。你接哪句，朋友进来就能对答案。</small>
              </div>`}
              ${saveLoadError ? `
                <section class="title-save-warning" role="alert">
                  <b>上次进度没有正常读出来</b>
                  <small>${escapeHtml(saveLoadError === "content-refresh-failed"
                    ? "存档还在，但现在的故事内容无法和它对上。"
                    : "存档文件已损坏，游戏不会自动覆盖它。" )}</small>
                </section>
              ` : ""}
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
                    <button class="primary title-journey-action title-journey-new title-journey-new-only" ${saveLoadError ? "data-request-new-game" : "data-start-story"} type="button">
                      <span>NEW GAME</span>
                      <b>${storyPack ? "新游戏" : "开始今日来电"}</b>
                      <small>${storyPack ? "从今晚 20:00 推门进直播间" : "接入今天这通匿名来电"}</small>
                    </button>
                  `}
                  ${quickModeAvailable ? `
                    <button class="title-journey-action title-quick-detective" data-start-quick-detective type="button">
                      <span>DETECTIVE MODE · 15 MIN</span>
                      <b>直播快案</b>
                      <small>选择一宗短案，当面问穿前后矛盾</small>
                    </button>
                  ` : ""}
                </div>
                ${confirmNewGame ? `
                  <section class="title-new-game-confirm" aria-live="polite">
                    <div><b>要从头开始吗？</b><small>${saveLoadError ? "确认后才会覆盖这份异常存档。" : "新游戏会覆盖当前进度。"}</small></div>
                    <button data-cancel-new-game type="button">保留进度</button>
                    <button class="primary" data-confirm-new-game type="button">确认新游戏</button>
                  </section>
                ` : ""}
                <div class="title-utility-row">${audioSettingsPanelHtml(audioSettings, { placement: "title" })}</div>
              </div>
            </aside>
          </div>
          <footer class="title-footer">
            <span>耳机体验更佳</span>
            <span>所有人物与机构均为虚构</span>
          </footer>
        </div>
      </section>
    </main>
  `;
}

function productTitleLines(productName = "") {
  const value = String(productName || "深夜热线：直播间侦探");
  if (value === "深夜热线：直播间侦探") return ["深夜热线", "直播间侦探"];
  return [value, ""];
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
