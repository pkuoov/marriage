import { ATTRIBUTES, DETECTIVE_SPECIALTIES } from "./story.js?v=0.14.0";
import { caseModeConfig } from "./caseModes.js?v=0.14.0";

export function createScreenRenderers(ctx) {
  const {
    state,
    meta,
    layout,
    setScreen,
    totalPoints,
    totalAttrs,
    canRemove,
    canAdd,
    saveState,
    render,
    finalizeCharacter,
    chooseSpecialty,
    chooseCaseMode,
    app,
    resetGame,
    isSoundEnabled,
    toggleSound
  } = ctx;

function renderTitle() {
  const lastRun = meta.history?.[0];
  app.innerHTML = `
    <section class="title-screen">
      <div class="title-copy">
        <p class="eyebrow">良缘算法婚恋咨询有限公司</p>
        <h1>婚恋侦探局</h1>
        <p>今晚的直播间只接一种委托：听当事人把话说完，再把没说完的地方翻出来。钱、承诺、边界、备胎和责任，都会藏在客户第一次连线没讲清的半句话里。</p>
        <div class="title-actions">
          <button class="primary" data-start type="button">${state.profileDone ? "继续调查" : "开始接案"}</button>
          <button class="secondary" data-new type="button">新案件</button>
          <button class="secondary" data-settings type="button">设置</button>
          <button class="secondary" data-sound-title type="button">${isSoundEnabled() ? "音效 开" : "音效 关"}</button>
        </div>
      </div>
      <aside class="notice">
        <h2>今晚接哪个栏目？</h2>
        <div class="mode-grid title-mode-grid">
          ${modeCard("story", state.caseMode)}
          ${modeCard("arc", state.caseMode)}
          ${modeCard("anchor", state.caseMode)}
        </div>
        <p>已完成周目：${meta.runs ?? 0}｜经验点：${meta.bonusPoints ?? 0}</p>
        ${lastRun ? `<p>最近周目：压力 ${lastRun.pressureScore}｜获得 ${lastRun.gained} 点</p>` : `<p>最近周目：暂无记录</p>`}
      </aside>
    </section>
  `;

  document.querySelector("[data-start]").addEventListener("click", () => {
    state.screen = state.profileDone ? "chapter" : "creator";
    saveState();
    render();
  });
  document.querySelector("[data-new]").addEventListener("click", resetGame);
  document.querySelector("[data-settings]").addEventListener("click", () => setScreen("settings"));
  document.querySelectorAll("[data-title-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.caseMode = button.dataset.titleMode;
      state.screen = "creator";
      saveState();
      render();
    });
  });
  document.querySelector("[data-sound-title]").addEventListener("click", () => {
    toggleSound();
    renderTitle();
  });
}

function renderCreator() {
  if (state.gender !== "male") state.gender = "male";
  const activeSpecialty = DETECTIVE_SPECIALTIES.find((item) => item.id === state.specialty) ?? DETECTIVE_SPECIALTIES[2];
  const activeMode = caseModeText(state.caseMode);
  const previewAttrs = loadoutPreviewAttrs(activeSpecialty);
  app.innerHTML = `
    <section class="creator">
      <div class="panel">
        <p class="eyebrow">本局配置</p>
        <h1>选择本局专长</h1>
        <p class="muted">${activeMode.label}已接入。选一个调查风格，今晚的线索提示会向它倾斜。</p>
        <div class="title-actions creator-actions">
          <button class="secondary" data-back-title type="button">返回主页</button>
        </div>
        <div class="loadout-grid">
          ${DETECTIVE_SPECIALTIES.map((item) => specialtyCard(item, activeSpecialty.id)).join("")}
        </div>
        <button class="primary wide" data-finalize type="button">生成案件并开播</button>
      </div>
      <aside class="panel loadout-panel">
        <p class="eyebrow">直播台</p>
        <h2>${activeMode.label}</h2>
        <div class="loadout-chip">${modeSubtitle(state.caseMode)}</div>
        <div class="loadout-current">
          <span>当前专长</span>
          <b>${activeSpecialty.label}</b>
        </div>
        <div class="attr-pips">
          ${ATTRIBUTES.map((item) => attrPip(item, previewAttrs[item.id] ?? 0, item.id === activeSpecialty.attr)).join("")}
        </div>
        <div class="run-badges">
          <span>${meta.runs ?? 0} 周目</span>
          <span>${meta.bonusPoints ?? 0} 经验</span>
          <span>${nextUnlockText(meta.bonusPoints ?? 0)}</span>
        </div>
      </aside>
    </section>
  `;
  document.querySelectorAll("[data-specialty]").forEach((button) => {
    button.addEventListener("click", () => chooseSpecialty(button.dataset.specialty));
  });
  document.querySelector("[data-back-title]")?.addEventListener("click", () => setScreen("title"));
  document.querySelector("[data-finalize]")?.addEventListener("click", finalizeCharacter);
}

function caseModeText(mode) {
  return caseModeConfig(mode);
}

function modeCard(mode, activeMode, dataName = "title-mode") {
  const config = caseModeText(mode);
  return `
    <button class="mode-card ${activeMode === mode ? "active" : ""}" data-${dataName}="${mode}" type="button">
      <b>${config.label}</b>
      <span>${modeSubtitle(mode)}</span>
    </button>
  `;
}

function modeSubtitle(mode) {
  return {
    story: "固定四通来电",
    arc: "旧档连环深挖",
    anchor: "随机后台来电"
  }[mode] ?? "后台来电";
}

function specialtyCard(item, activeId) {
  const icons = {
    audit: "账",
    emotion: "心",
    verification: "证"
  };
  return `
    <button class="loadout-card ${activeId === item.id ? "active" : ""}" data-specialty="${item.id}" type="button">
      <span class="loadout-icon">${icons[item.id] ?? "查"}</span>
      <b>${item.label}</b>
      <small>${item.intro}</small>
    </button>
  `;
}

function attrPip(item, value, boosted) {
  const filled = Math.max(1, Math.min(5, Math.ceil(value / 2)));
  return `
    <p class="${boosted ? "boosted" : ""}">
      <span>${item.short}${boosted ? " +3" : ""}</span>
      <b>${"■".repeat(filled)}${"□".repeat(5 - filled)}</b>
    </p>
  `;
}

function loadoutPreviewAttrs(activeSpecialty) {
  return ATTRIBUTES.reduce((attrs, item) => {
    const base = 4;
    attrs[item.id] = item.id === activeSpecialty.attr ? Math.min(10, base + activeSpecialty.boost) : base;
    return attrs;
  }, {});
}

function nextUnlockText(points) {
  if (points < 5) return "下一解锁 5";
  if (points < 10) return "下一解锁 10";
  if (points < 15) return "下一解锁 15";
  return "道具已开放";
}


  return { renderTitle, renderCreator };
}
