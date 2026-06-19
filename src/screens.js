import { ATTRIBUTES } from "./story.js?v=0.14.0";
import { describeAttr, publicProfileText } from "./profileView.js?v=0.14.0";

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
        <h1>中国式婚恋：十年一梦</h1>
        <p>你不是在创造一个完美的人。你是在决定，别人会先用什么眼光误解你。</p>
        <div class="title-actions">
          <button class="primary" data-start type="button">${state.profileDone ? "继续游戏" : "开始建档"}</button>
          <button class="secondary" data-new type="button">新周目</button>
          <button class="secondary" data-sound-title type="button">${isSoundEnabled() ? "音效 开" : "音效 关"}</button>
        </div>
      </div>
      <aside class="notice">
        <h2>当前原型</h2>
        <p>已接入十章：相亲、约会、见父母、谈婚论嫁、婚礼、婚后第一年、买房债务、生育育儿、七年之痒、孩子上学。NPC 每周目会随机隐藏底色与初始不良动机。</p>
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
  const remaining = totalPoints() - totalAttrs();
  app.innerHTML = `
    <section class="creator">
      <div class="panel">
        <p class="eyebrow">客户建档</p>
        <h1>创建你的婚恋市场画像</h1>
        <p class="muted">当前公开版为男主线。把 ${totalPoints()} 点机动点数分配到五项属性。每项 0-10，周目经验会提供额外点数。</p>
        <div class="segmented" role="group" aria-label="性别">
          <button class="${state.gender === "male" ? "selected" : ""}" data-gender="male" type="button">男</button>
          <button disabled title="女主线需要独立候选、心态和问题库，后续版本开放" type="button">女版待开发</button>
        </div>
        <div class="segmented" role="group" aria-label="开局方式">
          <button class="${state.startMode !== "freeLove" ? "selected" : ""}" data-start-mode="agency" type="button">婚介相亲</button>
          <button class="${state.startMode === "freeLove" ? "selected" : ""}" data-start-mode="freeLove" type="button">自由恋爱</button>
        </div>
        <div class="point-readout ${remaining === 0 ? "ok" : ""}">剩余点数：${remaining}</div>
        <div class="attrs">
          ${ATTRIBUTES.map((attr) => `
            <div class="attr-row">
              <div>
                <strong>${attr.label}</strong>
                <span>${describeAttr(state.attrs[attr.id])}</span>
              </div>
              <div class="stepper">
                <button data-attr-minus="${attr.id}" ${!canRemove(attr.id) ? "disabled" : ""} type="button">−</button>
                <output>${state.attrs[attr.id]}</output>
                <button data-attr-plus="${attr.id}" ${!canAdd(attr.id) ? "disabled" : ""} type="button">+</button>
              </div>
            </div>
          `).join("")}
        </div>
        <button class="primary wide" data-finalize ${!state.gender || remaining !== 0 ? "disabled" : ""} type="button">进入良缘算法</button>
      </div>
      <aside class="panel profile-preview">
        <h2>公开资料预览</h2>
        ${publicProfileText(state, ATTRIBUTES).map((line) => `<p>${line}</p>`).join("")}
        <h2>周目经验</h2>
        <p>已完成周目：${meta.runs ?? 0}</p>
        <p>额外机动点：${meta.bonusPoints ?? 0}</p>
      </aside>
    </section>
  `;

  document.querySelectorAll("[data-gender]").forEach((button) => {
    button.addEventListener("click", () => {
      state.gender = button.dataset.gender;
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-start-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      state.startMode = button.dataset.startMode;
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-attr-minus]").forEach((button) => {
    button.addEventListener("click", () => {
      const attr = button.dataset.attrMinus;
      if (canRemove(attr)) state.attrs[attr] -= 1;
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-attr-plus]").forEach((button) => {
    button.addEventListener("click", () => {
      const attr = button.dataset.attrPlus;
      if (canAdd(attr)) state.attrs[attr] += 1;
      saveState();
      render();
    });
  });
  document.querySelector("[data-finalize]")?.addEventListener("click", finalizeCharacter);
}


  return { renderTitle, renderCreator };
}
