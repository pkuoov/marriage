import { ATTRIBUTES, DETECTIVE_SPECIALTIES } from "./story.js?v=0.14.0";
import { publicProfileText } from "./profileView.js?v=0.14.0";

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
        <p>每周目三起连环婚恋案。你要从诉苦、证词、现场复盘和证据卡里找出被包装的真相。</p>
        <div class="title-actions">
          <button class="primary" data-start type="button">${state.profileDone ? "继续调查" : "开始接案"}</button>
          <button class="secondary" data-new type="button">新案件</button>
          <button class="secondary" data-sound-title type="button">${isSoundEnabled() ? "音效 开" : "音效 关"}</button>
        </div>
      </div>
      <aside class="notice">
        <h2>当前原型</h2>
        <p>新模式：你是婚恋侦探 / 律师顾问。系统每周目会预生成三起案子：婚前 case、婚后 case、告解模式。</p>
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
        <h1>今晚由系统随机生成三起连环婚恋案</h1>
        <p class="muted">你不再给“主角”自由加点，但可以选择本局侦探专长。系统会后台生成三份案卷、当事人画像、隐藏事实、来访叙事和大致真相，再逐案送进侦探局。</p>
        <div class="scene-list">
          <p><b>选择本局专长</b>：${activeSpecialty.label}</p>
          ${DETECTIVE_SPECIALTIES.map((item) => `
            <p><button class="${state.specialty === item.id ? "primary" : ""}" data-specialty="${item.id}" type="button">${item.label}</button><br><span>${item.intro}</span></p>
          `).join("")}
        </div>
        <div class="scene-list">
          <p><b>你的身份</b>：婚恋侦探 / 律师顾问</p>
          <p><b>案件可能</b>：骗婚、化债、外遇反咬、外情生子、接盘生子、择偶定位包装、大结果收割</p>
          <p><b>核心玩法</b>：逐案复盘当时场景，追问证词里的提示，抓迷惑点和矛盾点，判断谁在隐瞒、夸大、恶人先告状，或在告解里自欺。</p>
          <p><b>三案结构</b>：第一案婚前核验，第二案婚后共同生活，第三案告解模式，随机当事人自述经历并查探关系问题。</p>
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
  document.querySelector("[data-finalize]")?.addEventListener("click", finalizeCharacter);
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
