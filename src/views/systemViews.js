export function contentWarningView() {
  return `
    <section class="title-screen">
      <div class="title-copy">
        <p class="eyebrow">悬疑解谜游戏</p>
        <h1>婚恋侦探事务所</h1>
        <p>人人都是大侦探。你将作为一名婚恋主播，听出对话背后没说完的那半句。</p>
        <p>本作是虚构悬疑解谜游戏，直播间里的说法别直接套到现实关系里。</p>
        <div class="title-actions">
          <button class="primary" data-accept-content-warning type="button">我已了解，进入游戏</button>
        </div>
      </div>
      <aside class="notice homepage-docket">
        <p class="eyebrow">今晚来电</p>
        <h2>麦克风已亮</h2>
        <p>吃瓜群众们也在跃跃欲试。</p>
      </aside>
    </section>
  `;
}

export function settingsView({ soundEnabled, textSpeed }) {
  return `
    <div class="panel">
      <p class="eyebrow">设置</p>
      <h1>设置</h1>
      <div class="scene-list">
        <p><b>音效</b>：${soundEnabled ? "开" : "关"}</p>
        <button data-settings-sound type="button">${soundEnabled ? "关闭音效" : "开启音效"}</button>
        <p><b>文字速度</b>：${textSpeedLabel(textSpeed)}</p>
        <button class="${textSpeed === "slow" ? "primary" : ""}" data-text-speed="slow" type="button">慢速</button>
        <button class="${textSpeed === "normal" ? "primary" : ""}" data-text-speed="normal" type="button">标准</button>
        <button class="${textSpeed === "fast" ? "primary" : ""}" data-text-speed="fast" type="button">快速</button>
      </div>
      <div class="scene-list">
        <p><b>存档管理</b>：清除当前连线进度，不会清除全局记录。</p>
        <button data-clear-current-slot type="button">清除当前进度</button>
      </div>
    </div>
  `;
}

function textSpeedLabel(speed) {
  if (speed === "slow") return "慢速";
  if (speed === "fast") return "快速";
  return "标准";
}
