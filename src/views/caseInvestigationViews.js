export function caseOpenView({
  chapter,
  brief,
  openingDialogue,
  hasMoreOpening = false,
  openingTotal = 0,
  openingStep = 0,
  showStreamline
}) {
  return {
    chapter,
    text: `
      ${brief.contentWarning ? `<p class="signal signal-yellow"><b>连线说明</b>：${brief.contentWarning}</p>` : ""}
      <div class="call-dialogue" data-opening-total="${openingTotal}" data-opening-step="${openingStep}" data-opening-more="${hasMoreOpening ? "true" : "false"}">
        ${(openingDialogue ?? []).map((line) => `
          <div class="call-line ${line.role === "host" ? "host" : "caller"}">
            <b>${callSpeakerLabel(brief, line, line.role === "host" ? "你" : "咨询者")}</b>
            <p>${line.text ?? ""}</p>
          </div>
        `).join("")}
      </div>
    `,
    choices: `
      ${hasMoreOpening
        ? `<button class="primary" data-opening-next onclick="window.__loveOpeningNext && window.__loveOpeningNext()" type="button">听下一句</button>`
        : `<button class="primary" data-case-scene="sceneReview" type="button">接着问她</button>`}
      ${showStreamline ? `<button data-streamline-case type="button">跳过敏感细节</button>` : ""}
    `
  };
}

export function sceneReviewView({
  chapter,
  brief,
  sceneIndex = 0,
  currentVersion,
  totalVersions = 0,
  versionStates,
  optionStates = [],
  canDiscussProblem = false
}) {
  const item = currentVersion ?? {};
  const index = Math.max(0, sceneIndex);
  const version = versionStates[index] ?? {};
  const options = sceneQuestionOptions(item, index);
  const lineClass = callLineClass(brief, item);
  const speakerLabel = callSpeakerLabel(brief, item, "来电");
  return {
    chapter,
    text: `
      <div class="call-dialogue">
        <div class="call-line ${lineClass}">
          <b>${speakerLabel}</b>
          <p>${item.version ?? "暂无叙述。"}</p>
        </div>
      </div>
    `,
    choices: `
      ${version.done
        ? nextDialogueChoices(index, totalVersions, canDiscussProblem)
        : options.map((option, optionIndex) => `
            <button class="${option.correct !== false ? "primary" : ""}" data-version-question="${index}:${optionIndex}" ${version.disabled || optionStates[index]?.[optionIndex]?.disabled || ""} type="button">${option.question}</button>
          `).join("")}
      <div class="nav-actions">
        <button data-scene-version-prev ${index <= 0 ? "disabled" : ""} type="button">上一句</button>
      </div>
    `
  };
}

function nextDialogueChoices(index, totalVersions, canDiscussProblem) {
  if (index < totalVersions - 1) {
    return `<button class="primary" data-scene-version-next type="button">那后来呢？</button>`;
  }
  return canDiscussProblem
    ? `<button class="primary" data-case-scene="testimony" type="button">把通话继续接下去</button>`
    : `<button class="primary" data-case-scene="evidence" type="button">把刚才几句记下</button>`;
}

function sceneQuestionOptions(item, index) {
  if (Array.isArray(item.questionOptions) && item.questionOptions.length) return item.questionOptions;
  const factual = index === 2
    ? "这页东西你是怎么拿到的？"
    : "你刚才那句，前后还发生了什么？";
  return [
    {
      question: factual,
      answer: item.contradiction ? "TA 把前后话又补了一句。" : "TA 把前后话补了一句。",
      contradiction: item.contradiction,
      correct: true
    },
    {
      question: index === 0 ? "所以你现在最委屈的是哪一下？" : "你先别急，我们把这句放慢一点。",
      answer: "TA 的语气明显防御起来，开始重复立场，没有补出新事实。",
      correct: false
    }
  ];
}

function callSpeakerLabel(brief, item = {}, fallback = "来电") {
  if (!isDailyBrief(brief)) return item.speaker ?? fallback;
  if (item.speaker === "你" || item.role === "host") return "你";
  if (item.speakerId === brief.complainantId) return "咨询者";
  if (item.speakerId === brief.respondentId) return "咨询者转述";
  if (/材料|账单|截图|草稿|排班表|回拨|录音|合同|摘录|记事/.test(item.speaker ?? "")) return item.speaker;
  return fallback === "来电" ? "咨询者" : fallback;
}

function callLineClass(brief, item = {}) {
  if (item.role === "host" || item.speaker === "你") return "host";
  if (isDailyBrief(brief)) return "caller";
  if (!item.speakerId) return "host";
  return item.speakerId === brief.complainantId ? "caller" : "other";
}

function isDailyBrief(brief) {
  return brief?.dailyCase || brief?.caseMode === "daily";
}

export function evidenceView({
  chapter,
  brief,
  evidenceStates,
  canAccuse = true,
  readinessHint = ""
}) {
  const evidenceLabels = evidenceChoiceLabels(brief);
  const isDaily = isDailyBrief(brief);
  return {
    chapter,
    text: `
      <p><b>麦先别断</b></p>
      <div class="call-dialogue">
        <div class="call-line host">
          <b>你</b>
          <p>这几句先放在这儿。你别替他解释，也别替自己道歉，接着说原话。</p>
        </div>
      </div>
    `,
    choices: `
      <button data-case-scene="testimony" type="button">继续听她说</button>
      <button data-evidence="timeline" ${evidenceStates.timeline} type="button">${evidenceLabels.timeline}</button>
      <button data-evidence="money" ${evidenceStates.money} type="button">${evidenceLabels.money}</button>
      <button data-evidence="motive" ${evidenceStates.motive} type="button">${evidenceLabels.motive}</button>
      ${canAccuse
        ? `<button class="primary" data-case-scene="accusation" type="button">${isDaily ? "弹幕开盘" : "接哪边的麦"}</button>`
        : `<p class="choice-note">${readinessHint || "这通电话还没听完整。"}</p>`}
      <div class="nav-actions">
        <button data-case-scene="sceneReview" type="button">回到第一版说法</button>
      </div>
    `
  };
}

function evidenceChoiceLabels(brief) {
  if (brief?.plotId === "education-income-fake-profile") {
    return {
      timeline: "先问这些截图是什么时候发的",
      money: "先问每张图少了哪一边",
      motive: "先问他为什么总绕回信不信"
    };
  }
  return {
    timeline: "先问时间怎么接上",
    money: "先问钱和资源谁承担",
    motive: "先问谁因此获益"
  };
}

export function accusationView({
  chapter,
  brief,
  hint,
  complainantName,
  respondentName,
  structuralChoice
}) {
  const isDaily = isDailyBrief(brief);
  if (isDaily) return dailyAccusationView({ chapter, brief });
  const title = "接哪边的麦";
  const intro = "直播间先不盖棺。你只决定下一句该让谁把话补全。";
  const complainantButtonText = `先让 ${complainantName} 补话`;
  const respondentButtonText = `先让 ${respondentName} 补话`;
  const bothButtonText = "双方都有没说完的地方";
  const noPremeditatedButtonText = "先当成关系失衡";
  return {
    chapter,
    text: `
      <p><b>${title}</b></p>
      <p>${intro}</p>
      <p class="hint">${hint}</p>
    `,
    choices: `
      <button data-accuse="${brief.complainantId}" type="button">${complainantButtonText}</button>
      <button data-accuse="${brief.respondentId}" type="button">${respondentButtonText}</button>
      ${structuralChoice}
      <button data-accuse="both" type="button">${bothButtonText}</button>
      <button data-accuse="noPremeditated" type="button">${noPremeditatedButtonText}</button>
      <div class="nav-actions">
        <button data-case-scene="sceneReview" type="button">回到第一版说法</button>
        <button data-case-scene="testimony" type="button">回到原话</button>
      </div>
    `
  };
}

function dailyAccusationView({ chapter, brief }) {
  const choices = dailyAccusationChoices(brief);
  return {
    chapter,
    text: `
      <p><b>弹幕开盘</b></p>
      <p>刚才那几句里，哪一下最值得停住？</p>
    `,
    choices: `
      ${choices.map((choice) => `
        <button data-accuse="${choice.accuse}" data-accuse-label="${choice.label}" type="button">${choice.label}</button>
      `).join("")}
      <div class="nav-actions">
        <button data-case-scene="sceneReview" type="button">回到第一版说法</button>
        <button data-case-scene="testimony" type="button">回到原话</button>
      </div>
    `
  };
}

function dailyAccusationChoices(brief) {
  const respondent = brief.respondentId;
  const complainant = brief.complainantId;
  if (brief?.plotId === "lost-job-hidden-credit") {
    return [
      { label: "失业是真，但体面账也是真的", accuse: respondent },
      { label: "她怕被说现实，所以不敢拒绝", accuse: complainant },
      { label: "借钱那一刻才开始出问题", accuse: "noPremeditated" },
      { label: "两个人都在硬撑体面", accuse: "both" }
    ];
  }
  if (brief?.plotId === "house-name-security-test") {
    return [
      { label: "产权归父母，还贷进共同账户", accuse: respondent },
      { label: "她真正想要的是产权承诺", accuse: complainant },
      { label: "只要不加名就没问题", accuse: "noPremeditated" },
      { label: "两边都在拿安全感试探", accuse: "both" }
    ];
  }
  if (brief?.plotId === "tony-multi-dating") {
    return [
      { label: "不是聊天多，是把人按用途分组", accuse: respondent },
      { label: "她把服务行业热情听成了承诺", accuse: complainant },
      { label: "核心是没有正式确认关系", accuse: "noPremeditated" },
      { label: "几个人都在等对方先表态", accuse: "both" }
    ];
  }
  if (brief?.plotId === "education-income-fake-profile") {
    return [
      { label: "重点是那些材料到底真假", accuse: respondent },
      { label: "她借父母的口在要证明", accuse: complainant },
      { label: "存款证明是谁推出来的说不清", accuse: "both" },
      { label: "只是见父母前紧张过头", accuse: "noPremeditated" }
    ];
  }
  return [
    { label: "对方这句话没说全", accuse: respondent },
    { label: "咨询者这句话没说全", accuse: complainant },
    { label: "两边都有停顿", accuse: "both" },
    { label: "先当成误会", accuse: "noPremeditated" }
  ];
}

export function testimonyView({
  chapter,
  brief,
  testimonyIndex,
  currentTestimony,
  followupStates
}) {
  const item = currentTestimony ?? {};
  const currentFollowups = item.followups ?? [];
  const currentIndex = Math.max(0, testimonyIndex ?? 0);
  const total = Math.max(1, brief.testimony?.length ?? 0);
  const speakerLabel = callSpeakerLabel(brief, item, "来电");
  return {
    chapter,
    text: `
      <p><b>麦还没断</b></p>
      <div class="call-dialogue">
        <div class="call-line ${callLineClass(brief, item)} active-testimony">
          <b>${speakerLabel}</b>
          <p>${item.line ?? "暂无摘录。"}</p>
          <div class="inline-actions">
            ${currentFollowups.map((followup, followupIndex) => {
              const state = followupStates[`${currentIndex}:${followupIndex}`] ?? {};
              if (state.done) return "";
              return `<button data-followup="${currentIndex}:${followupIndex}" ${state.disabled} type="button">${followup.question}</button>`;
            }).join("")}
          </div>
        </div>
      </div>
    `,
    choices: `
      <button class="primary" data-case-scene="evidence" type="button">把刚才几句放一起看</button>
      <div class="nav-actions">
        <button data-testimony-next ${currentIndex >= total - 1 ? "disabled" : ""} type="button">她后面怎么说</button>
        <button data-testimony-prev ${currentIndex <= 0 ? "disabled" : ""} type="button">回上一句</button>
        <button data-case-scene="sceneReview" type="button">回到第一版说法</button>
      </div>
    `
  };
}
