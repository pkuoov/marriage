export function caseSolvedView({
  chapter,
  brief,
  result,
  actorName,
  solved,
  contradictionCount,
  structuralResponsibility,
  hasNextCase
}) {
  return {
    chapter,
    text: `
      <p><b>本案复盘</b></p>
      <p>${result?.correct ? "你抓住了关键矛盾。" : "你的判断还不够稳，旁听席的情绪干扰了事实排序。"}</p>
      <p><b>你的指认</b>：${solved.accusedLabel}。<b>后台更接近</b>：${solved.expectedLabel}。</p>
      ${solved.responsibilityLayer ? `<p><b>责任层级</b>：${solved.responsibilityLayer}</p>` : ""}
      <p><b>已抓矛盾点</b>：${result?.contradictionCount ?? contradictionCount} 个。</p>
      <p><b>关键矛盾命中</b>：${solved.hit.length ? solved.hit.join(" / ") : "没有命中关键矛盾，只抓到外围疑点。"}</p>
      <p><b>错过的关键点</b>：${solved.missed.length ? solved.missed.join(" / ") : "本案关键矛盾基本覆盖。"}</p>
      <p><b>为什么指向这里</b>：${solved.why}</p>
      ${brief.stageJudgement ? `<p><b>阶段判定</b>：${brief.stageJudgement}</p>` : ""}
      ${brief.followupTwist ? `<p><b>后续新情况</b>：${brief.followupTwist}</p>` : ""}
      <p><b>后台真相</b>：${brief.truth}</p>
      <p><b>隐藏事实</b>：${brief.hiddenFacts.join("、")}</p>
      <p><b>包装/夸大</b>：${brief.exaggerations.join("、")}</p>
      ${structuralResponsibility ? `<p><b>主线结构层</b>：${structuralResponsibility}</p>` : ""}
      ${brief.premeditated ? `<p><b>本案关系层</b>：${actorName ?? "未知"} 从一开始就带着非纯洁婚恋目的进入关系。</p>` : `<p><b>本案关系层</b>：${brief.modeBrief ?? "本案不保证存在预谋，性格问题、家庭压力和半真半假同样可能造成伤害。"}</p>`}
    `,
    choices: `<button class="primary" data-next-case type="button">${hasNextCase ? "查看案间战况" : "查看最终战况"}</button>`
  };
}

export function caseInterludeView({
  currentTitle,
  interlude,
  nextHook,
  transition,
  followupTwist,
  reputation,
  heat,
  nextCarryover,
  nextThreadLine,
  nextTitle
}) {
  return {
    chapter: "侦探局战况",
    text: `
      <p><b>${currentTitle} 结案后</b></p>
      <p>${interlude.summary}</p>
      <p class="episode-hook">${nextHook}</p>
      ${transition ? `<p class="side-signal"><b>主线过场</b>：${transition}</p>` : ""}
      ${followupTwist ? `<p><b>新情况回拨</b>：${followupTwist}</p>` : ""}
      <div class="scene-list">
        <p><b>声誉变化</b>：${signed(interlude.reputationDelta)}｜当前 ${reputation}</p>
        <p><b>舆论热度</b>：${signed(interlude.heatDelta)}｜当前 ${heat}</p>
        <p><b>下一案影响</b>：${nextCarryover}</p>
        ${nextThreadLine ? `<p><b>人物牵连</b>：${nextThreadLine}</p>` : ""}
      </div>
    `,
    choices: nextTitle
      ? `<button class="primary" data-enter-next-case type="button">进入${nextTitle}</button>`
      : `<button class="primary" data-finish-run type="button">完成本周目复盘</button>`
  };
}

export function runCompleteView({
  chapter,
  correct,
  totalCases,
  caseSetLabel,
  runLine,
  reputation,
  heat,
  caseSetSummary,
  interludeLines
}) {
  return {
    chapter,
    text: `
      <p><b>本轮案件复盘</b></p>
      <p>你完成了${caseSetLabel}，其中 ${correct}/${totalCases} 起抓住了关键矛盾。</p>
      <p class="episode-hook">${runLine}</p>
      <p><b>最终战况</b>：声誉 ${reputation}｜舆论热度 ${heat}。</p>
      <p>${caseSetSummary}</p>
      <div class="scene-list">
        ${interludeLines.map((line) => `<p>${line}</p>`).join("")}
      </div>
    `,
    choices: `
      <button class="primary" data-case-aftermath type="button">查看当事人后续片段</button>
      <button data-action="title" type="button">先回标题</button>
    `
  };
}

export function aftermathView({ aftermathLines }) {
  return {
    chapter: "关系后续",
    text: `
      <p><b>当事人后续片段</b></p>
      <p>侦探局不再展开十年恋爱模拟，只保留案件后的关系余波。真正重要的是：你的判断让谁更早止损，谁被误伤，谁还在重复同一套选择。</p>
      <div class="scene-list">
        ${aftermathLines.join("")}
      </div>
      <p class="hint">长线恋爱章节暂时降级为素材库，主体验回到逆转裁判式连环案件。</p>
    `,
    choices: `<button class="primary" data-complete-run-title type="button">回到标题，开始下一组案件</button>`
  };
}

function signed(value) {
  if (value > 0) return `+${value}`;
  return String(value);
}
