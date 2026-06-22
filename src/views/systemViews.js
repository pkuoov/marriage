export function contentWarningView() {
  return `
    <section class="title-screen">
      <div class="title-copy">
        <p class="eyebrow">内容提示</p>
        <h1>婚恋侦探局</h1>
        <p>本作是虚构的婚恋风险识别与关系悬疑游戏。案件会涉及骗婚、债务转嫁、控制关系、亲密边界侵害、酒后时间线核验和以报警威胁索财等敏感议题。</p>
        <p>游戏不提供法律、心理或婚恋咨询结论。请把它当作虚构叙事与证据判断练习，而不是现实处置建议。</p>
        <div class="title-actions">
          <button class="primary" data-accept-content-warning type="button">我已了解，进入游戏</button>
          <button class="secondary" data-accept-streamline type="button">开启绿色模式并进入</button>
        </div>
      </div>
      <aside class="notice">
        <h2>绿色模式</h2>
        <p>绿色模式会在敏感案件中提供“仅核查硬性时间线”的跳过选项，减少对敏感证词的直接阅读。</p>
      </aside>
    </section>
  `;
}

export function settingsView({ currentSlot, slots, soundEnabled, textSpeed, streamlineMode }) {
  return `
    <div class="panel">
      <p class="eyebrow">Steam 发布准备</p>
      <h1>设置</h1>
      <div class="scene-list">
        <p><b>存档槽</b>：${slotLabel(currentSlot)}</p>
        ${slots.map((slot) => `<button class="${slot === currentSlot ? "primary" : ""}" data-save-slot="${slot}" type="button">${slotLabel(slot)}</button>`).join("")}
      </div>
      <div class="scene-list">
        <p><b>音效</b>：${soundEnabled ? "开" : "关"}</p>
        <button data-settings-sound type="button">${soundEnabled ? "关闭音效" : "开启音效"}</button>
        <p><b>文字速度</b>：${textSpeedLabel(textSpeed)}</p>
        <button class="${textSpeed === "slow" ? "primary" : ""}" data-text-speed="slow" type="button">慢速</button>
        <button class="${textSpeed === "normal" ? "primary" : ""}" data-text-speed="normal" type="button">标准</button>
        <button class="${textSpeed === "fast" ? "primary" : ""}" data-text-speed="fast" type="button">快速</button>
        <p><b>绿色模式</b>：${streamlineMode ? "开" : "关"}</p>
        <button data-streamline-mode type="button">${streamlineMode ? "关闭绿色模式" : "开启绿色模式"}</button>
      </div>
      <div class="scene-list">
        <p><b>存档管理</b>：清除当前槽只会删除 ${slotLabel(currentSlot)} 的案件进度，不会清除全局经验点。</p>
        <button data-clear-current-slot type="button">清除当前存档槽</button>
      </div>
    </div>
  `;
}

function slotLabel(slot) {
  return slot.replace("slot", "存档 ");
}

function textSpeedLabel(speed) {
  if (speed === "slow") return "慢速";
  if (speed === "fast") return "快速";
  return "标准";
}
