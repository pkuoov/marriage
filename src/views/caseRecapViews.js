export function caseSolvedView({
  chapter,
  brief,
  result,
  actorName,
  solved,
  contradictionCount,
  structuralResponsibility,
  hasNextCase,
  recapStep = 0
}) {
  const pages = [
    `
      <p><b>本案复盘</b></p>
      <p>${result?.correct ? "你抓住了关键矛盾。" : "你的判断还不够稳，旁听席的情绪干扰了事实排序。"}</p>
      <p><b>你的指认</b>：${solved.accusedLabel}。<b>后台更接近</b>：${solved.expectedLabel}。</p>
      ${solved.responsibilityLayer ? `<p><b>责任层级</b>：${solved.responsibilityLayer}</p>` : ""}
    `,
    `
      <p><b>关键矛盾</b></p>
      <p>已抓矛盾点：${result?.contradictionCount ?? contradictionCount} 个。</p>
      <p>${solved.hit.length ? solved.hit.join(" / ") : "没有命中关键矛盾，只抓到外围疑点。"}</p>
    `,
    `
      <p><b>孟姐补一句</b></p>
      <p>${solved.why}</p>
      <p><b>错过的关键点</b>：${solved.missed.length ? solved.missed.join(" / ") : "本案关键矛盾基本覆盖。"}</p>
    `,
    `
      <p><b>后续回拨</b></p>
      ${brief.stageJudgement ? `<p>${brief.stageJudgement}</p>` : ""}
      ${brief.followupTwist ? `<p>${brief.followupTwist}</p>` : ""}
    `,
    `
      <p><b>后台真相</b></p>
      <p>${brief.truth}</p>
      <p><b>隐藏事实</b>：${brief.hiddenFacts.join("、")}</p>
      <p><b>包装/夸大</b>：${brief.exaggerations.join("、")}</p>
      ${structuralResponsibility ? `<p><b>主线结构层</b>：${structuralResponsibility}</p>` : ""}
      ${brief.premeditated ? `<p><b>本案关系层</b>：${actorName ?? "未知"} 从一开始就带着非纯洁婚恋目的进入关系。</p>` : `<p><b>本案关系层</b>：${brief.modeBrief ?? "本案不保证存在预谋，性格问题、家庭压力和半真半假同样可能造成伤害。"}</p>`}
    `
  ];
  const index = Math.max(0, Math.min(recapStep, pages.length - 1));
  return {
    chapter,
    text: `
      <p class="hint">复盘 ${index + 1}/${pages.length}</p>
      ${pages[index]}
    `,
    choices: index < pages.length - 1
      ? `<button class="primary" data-recap-next type="button">继续复盘</button>`
      : `<button class="primary" data-next-case type="button">${hasNextCase ? "查看案间战况" : "查看最终战况"}</button>`
  };
}

export function caseInterludeView({
  currentTitle,
  interlude,
  interludeLines = [],
  interludeStep = 0,
  reputation,
  heat,
  nextTitle
}) {
  const step = Math.max(0, Math.min(interludeStep, Math.max(0, interludeLines.length - 1)));
  const line = interludeLines[step] ?? {
    speaker: "孟姐",
    label: `${currentTitle} 结案后`,
    text: interlude.summary
  };
  const isLast = step >= interludeLines.length - 1;
  return {
    chapter: "侦探局战况",
    text: `
      <p class="hint">过场 ${step + 1}/${interludeLines.length || 1}</p>
      <p><b>${line.label ?? `${currentTitle} 结案后`}</b></p>
      <p class="vn-line">${line.text ?? interlude.summary}</p>
      ${line.detail ? `<p class="side-signal">${line.detail}</p>` : ""}
      <div class="interlude-meter">
        <span>声誉 ${reputation}</span>
        <span>热度 ${heat}</span>
        <span>${signed(interlude.reputationDelta)} / ${signed(interlude.heatDelta)}</span>
      </div>
    `,
    choices: !isLast
      ? `<button class="primary" data-interlude-next type="button">下一段</button>`
      : nextTitle
        ? `<button class="primary" data-enter-next-case type="button">进入${nextTitle}</button>`
        : `<button class="primary" data-finish-run type="button">完成本周目复盘</button>`,
    speakerName: line.speaker ?? "孟姐"
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
      <p>直播结束后，镜头不会继续跟拍每个人的人生。侦探局只收到几段回音：谁更早止损，谁被澄清，谁还在重复同一套选择。</p>
      <div class="scene-list">
        ${aftermathLines.join("")}
      </div>
      <p class="hint">案子结了，关系未必结束。你能留下的只有证据、边界和一份尽量不误伤的判断。</p>
    `,
    choices: `<button class="primary" data-complete-run-title type="button">回到标题，开始下一组案件</button>`
  };
}

function signed(value) {
  if (value > 0) return `+${value}`;
  return String(value);
}
