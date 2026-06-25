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
  const isDaily = brief?.dailyCase || brief?.caseMode === "daily";
  const stageJudgement = isDaily ? cleanDailyRecapCopy(brief.stageJudgement) : brief.stageJudgement;
  const followupTwist = isDaily ? cleanDailyRecapCopy(brief.followupTwist) : brief.followupTwist;
  const why = isDaily ? cleanDailyRecapCopy(solved.why) : solved.why;
  const missedLine = solved.missed.length
    ? solved.missed.join(" / ")
    : (isDaily ? "后面再接麦，估计还能吵出新版本。" : "后续暂时没有新的补充。");
  const pages = [
    `
      <p><b>连线回看</b></p>
      <p>${result?.correct ? "你听到了这通电话里最别扭的那一下。" : "你的听法还不够稳，弹幕的情绪把话题带跑了。"}</p>
      <p><b>${isDaily ? "你刚才抓的点" : "你的听法"}</b>：${solved.accusedLabel}。<b>${isDaily ? "最后露出来的点" : "系统回看"}</b>：${solved.expectedLabel}。</p>
      ${solved.responsibilityLayer ? `<p><b>${isDaily ? "背后还有一层" : "说法层次"}</b>：${solved.responsibilityLayer}</p>` : ""}
    `,
    `
      <p><b>最别扭的几句</b></p>
      <p>已经听出的别扭点：${result?.contradictionCount ?? contradictionCount} 个。</p>
      <p>${solved.hit.length ? solved.hit.join(" / ") : (isDaily ? "这轮还只是闻到味儿，没把最关键那句捞出来。" : "还没听到最拧巴那句，只碰到边上的小别扭。")}</p>
    `,
    `
      <p><b>主播收麦</b></p>
      <p>${why}</p>
      <p><b>${isDaily ? "弹幕还在问" : "后续补充"}</b>：${missedLine}</p>
    `,
    `
      <p><b>后续回拨</b></p>
      ${stageJudgement ? `<p>${stageJudgement}</p>` : ""}
      ${followupTwist ? `<p>${followupTwist}</p>` : ""}
    `,
    `
      <p><b>${isDaily ? "最后聊开" : "完整回看"}</b></p>
      <p>${brief.truth}</p>
      ${isDaily ? "" : `
        <p><b>隐藏事实</b>：${brief.hiddenFacts.join("、")}</p>
        <p><b>包装/夸大</b>：${brief.exaggerations.join("、")}</p>
        ${structuralResponsibility ? `<p><b>主线结构层</b>：${structuralResponsibility}</p>` : ""}
        ${brief.premeditated ? `<p><b>关系里的那一层</b>：${actorName ?? "未知"} 从一开始就带着非纯洁婚恋目的进入关系。</p>` : `<p><b>关系里的那一层</b>：${brief.modeBrief ?? "这通电话不保证存在预谋，性格问题、家庭压力和半真半假同样可能造成伤害。"}</p>`}
      `}
    `
  ];
  const index = Math.max(0, Math.min(recapStep, pages.length - 1));
  return {
    chapter,
    text: `
      <p class="hint">回看 ${index + 1}/${pages.length}</p>
      ${pages[index]}
    `,
    choices: index < pages.length - 1
      ? `<button class="primary" data-recap-next type="button">继续回看</button>${result?.correct === false ? `<button data-retry-case type="button">从头再问</button>` : ""}`
      : `${result?.correct === false ? `<button class="primary" data-retry-case type="button">从头再问</button>` : `<button class="primary" data-next-case type="button">${isDaily ? "查看今日结果" : hasNextCase ? "查看后续" : "查看结果"}</button>`}`
  };
}

function cleanDailyRecapCopy(value = "") {
  return String(value)
    .replace(/^阶段判定：/, "")
    .replace(/^后续回拨：/, "后来补充：")
    .replace(/本案/g, "这通电话")
    .replace(/判定/g, "听到这里")
    .replace(/核验/g, "对一对")
    .replace(/证据/g, "说法")
    .replace("的学习点是", "要看的，是");
}

export function caseInterludeView({
  currentTitle,
  brief,
  interlude,
  interludeLines = [],
  interludeStep = 0,
  reputation,
  heat,
  nextTitle
}) {
  const isDaily = brief?.dailyCase || brief?.caseMode === "daily";
  const step = Math.max(0, Math.min(interludeStep, Math.max(0, interludeLines.length - 1)));
  const line = interludeLines[step] ?? {
    speaker: "你",
    label: `${currentTitle} 结案后`,
    text: interlude.summary
  };
  const lineText = isDaily ? cleanDailyInterludeCopy(line.text ?? interlude.summary) : line.text ?? interlude.summary;
  const isLast = step >= interludeLines.length - 1;
  return {
    chapter: isDaily ? "今日连线余波" : "后续余波",
    text: `
      <p class="hint">${isDaily ? "余波" : "过场"} ${step + 1}/${interludeLines.length || 1}</p>
      <p><b>${line.label ?? `${currentTitle} 结案后`}</b></p>
      <p class="vn-line">${lineText}</p>
      ${!isDaily && line.detail ? `<p class="side-signal">${line.detail}</p>` : ""}
    `,
    choices: !isLast
      ? `<button class="primary" data-interlude-next type="button">继续听后续回拨</button>`
      : nextTitle
        ? `<button class="primary" data-enter-next-case type="button">进入${nextTitle}</button>`
        : `<button class="primary" data-finish-run type="button">${isDaily ? "查看今日结果" : "查看结果"}</button>`,
    speakerName: line.speaker ?? "你"
  };
}

function cleanDailyInterludeCopy(value = "") {
  const legacyBackend = ["后", "台", "愿意把", "更完整", "的材料交给你。"].join("");
  return String(value)
    .replace(`你不仅判断对了，还没有把当事人的耐心耗光。${legacyBackend}`, "你判断对了，也没有把这通电话拖散。咨询者愿意把后续补充说完。")
    .replace(legacyBackend, "咨询者愿意把后续补充说完。")
    .replace("下一案能拿到信任，但配合度不会无限上升。", "咨询者还在配合，只是语气更谨慎了。");
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
  interludeLines,
  shareCard = null
}) {
  const isDaily = totalCases === 1;
  return {
    chapter,
    text: `
      <p><b>${isDaily ? "今日收麦" : "连线回看"}</b></p>
      <p>${isDaily ? `今晚这通连线先收麦，${correct ? "这口瓜够弹幕吵一轮。" : "第一版说法还没完全咂出味。"}` : `你完成了${caseSetLabel}，其中 ${correct}/${totalCases} 通听出了别扭点。`}</p>
      <p class="episode-hook">${runLine}</p>
      ${shareCard ? `
        <section class="share-result-card">
          <div class="share-card-head">
            <span>${shareCard.kicker}</span>
            ${shareCard.routeLabel ? `<em>${shareCard.routeLabel}</em>` : ""}
          </div>
          <p class="share-card-title">${shareCard.title}</p>
          <p class="share-card-finding"><span>今晚瓜点</span>${shareCard.finding}</p>
          <small>${shareCard.cta}</small>
        </section>
      ` : ""}
      ${isDaily ? "" : `<p>${caseSetSummary}</p>`}
      ${isDaily ? "" : `<div class="scene-list">
        ${interludeLines.map((line) => `<p>${line}</p>`).join("")}
      </div>`}
    `,
    choices: `
      ${shareCard ? `<button class="primary" data-copy-daily-result type="button">复制吃瓜文案</button>` : ""}
      <button data-action="title" type="button">先回标题</button>
    `
  };
}
