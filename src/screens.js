import { ATTRIBUTES, DETECTIVE_SPECIALTIES } from "./story.js?v=0.14.0";
import { publicProfileText } from "./profileView.js?v=0.14.0";
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
        <h2>直播后台</h2>
        <p>你是婚恋侦探局的主播顾问。今晚可以接固定主线、深挖旧档，也可以打开随机来电。</p>
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
  document.querySelector("[data-sound-title]").addEventListener("click", () => {
    toggleSound();
    renderTitle();
  });
}

function renderCreator() {
  if (state.gender !== "male") state.gender = "male";
  const activeSpecialty = DETECTIVE_SPECIALTIES.find((item) => item.id === state.specialty) ?? DETECTIVE_SPECIALTIES[2];
  app.innerHTML = `
    <section class="creator">
      <div class="panel">
        <p class="eyebrow">侦探局开案</p>
        <h1>选择调查模式，再开案</h1>
        <p class="muted">开播前先选你的调查专长和接案栏目。不同栏目会改变来电顺序、旧案牵连和后台愿意交出的材料。</p>
        <div class="scene-list">
          <p><b>选择案件模式</b>：${caseModeText(state.caseMode).label}</p>
          <p><button class="${state.caseMode === "story" ? "primary" : ""}" data-case-mode="story" type="button">故事模式</button><br><span>四通固定来电，从领证前转账一路查到边界勒索、多线承诺和责任错配。</span></p>
          <p><button class="${state.caseMode === "arc" ? "primary" : ""}" data-case-mode="arc" type="button">连环剧场</button><br><span>打开资料包疑云和模板回声，追查旧案材料怎样被人整理、复用、收费。</span></p>
          <p><button class="${state.caseMode === "anchor" ? "primary" : ""}" data-case-mode="anchor" type="button">主播模式</button><br><span>随机接入后台来电，逐案复盘、追问、指认和结案。</span></p>
        </div>
        <div class="scene-list">
          <p><b>选择本局专长</b>：${activeSpecialty.label}</p>
          ${DETECTIVE_SPECIALTIES.map((item) => `
            <p><button class="${state.specialty === item.id ? "primary" : ""}" data-specialty="${item.id}" type="button">${item.label}</button><br><span>${item.intro}</span></p>
          `).join("")}
        </div>
        <div class="scene-list">
          <p><b>你的身份</b>：婚恋侦探 / 律师顾问</p>
          <p><b>案件可能</b>：骗婚、化债、外遇反咬、外情生子、接盘生子、择偶定位包装、大结果收割</p>
          <p><b>调查方法</b>：复盘当时场景，追问含糊证词，抓迷惑点和矛盾点，再判断谁在隐瞒、夸大、恶人先告状，或在告解里自欺。</p>
          <p><b>今晚栏目</b>：${caseModeText(state.caseMode).intro}</p>
        </div>
        <button class="primary wide" data-finalize type="button">生成案件并开播</button>
      </div>
      <aside class="panel profile-preview">
        <h2>后台规则</h2>
        <p>系统会随机生成本场调查画像，并叠加你的专长加成。画像会影响你更容易看见哪类线索。</p>
        <p><b>${activeSpecialty.label}</b>：${activeSpecialty.intro}</p>
        ${publicProfileText(state, ATTRIBUTES).map((line) => `<p>${line}</p>`).join("")}
        <h2>侦探经验</h2>
        <p>已完成周目：${meta.runs ?? 0}</p>
        <p>经验点：${meta.bonusPoints ?? 0}</p>
        <p>${toolUnlockText(meta.bonusPoints ?? 0).join("<br>")}</p>
      </aside>
    </section>
  `;
  document.querySelectorAll("[data-specialty]").forEach((button) => {
    button.addEventListener("click", () => chooseSpecialty(button.dataset.specialty));
  });
  document.querySelectorAll("[data-case-mode]").forEach((button) => {
    button.addEventListener("click", () => chooseCaseMode(button.dataset.caseMode));
  });
  document.querySelector("[data-finalize]")?.addEventListener("click", finalizeCharacter);
}

function caseModeText(mode) {
  return caseModeConfig(mode);
}

function toolUnlockText(points) {
  return [
    `${points >= 5 ? "已解锁" : "5 点解锁"}：加班助理，每案 +1 追问配额`,
    `${points >= 10 ? "已解锁" : "10 点解锁"}：时间线追踪，证据卡自动提示时间缺口`,
    `${points >= 15 ? "已解锁" : "15 点解锁"}：提前预警，开案显示本栏目高发风险`
  ];
}


  return { renderTitle, renderCreator };
}
