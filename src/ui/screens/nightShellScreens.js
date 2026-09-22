import { resolveCommit } from "../../runtime/stateCommit.js";

export function createNightShellScreens(ctx) {
  const {
    actionDone,
    bind,
    bindSceneButtons,
    caseKey,
    epilogueUnreadContinueHtml,
    epilogueUnreadHtml,
    epilogueUnreadStage,
    escapeHtml,
    flowGroupHtml,
    frame,
    hostPortraitLayer,
    liveCommentStrip,
    markAction,
    moveScene,
    nightShellForBrief,
    render,
    saveState,
    setCafePrologueStep,
    storyInterludeCaseId,
    storyKeyFromUrl,
    storyPackForKey
  } = ctx;
  const commit = resolveCommit(ctx);

function renderNightShellPrologue(brief) {
  const state = ctx.getState();
  const prologue = nightShellForBrief(brief)?.prologue ?? {};
  const coldOpen = prologue.coldOpen ?? null;
  const entryActionKey = prologue.entryActionKey ?? null;
  const coldOpenDone = coldOpen
    ? actionDone(brief, coldOpen.actionKey ?? "golden-90-first-interest")
    : true;
  const entryDone = !entryActionKey
    || coldOpenDone
    || actionDone(brief, entryActionKey);
  if (!entryDone && !actionDone(brief, "first-case-flashback")) {
    frame({
      brief,
      mood: "thinking",
      label: "",
      chapter: "",
      showCaseHud: false,
      visualHud: "",
      screenClass: "case-title-screen first-case-flashback-screen",
      text: '<section class="case-title-card"><p class="eyebrow">时间回到</p><h1>先从七月说起</h1><p class="case-title-subtitle">2024 年 7 月 15 日 · 晚上八点</p><p class="case-title-intro">那时，你的深夜热线还在为留下这个时段发愁。</p></section>',
      choices: flowGroupHtml('<button class="primary" data-enter-first-flashback type="button">走进那晚的直播间</button>'),
      pixelTransition: { kind: "soft-fade" }
    });
    bind("[data-enter-first-flashback]", () => {
      markAction(brief, "first-case-flashback", { spend: false });
      saveState();
      render();
    });
    bindSceneButtons();
    return;
  }
  const regularLines = [...(prologue.lines ?? []), prologue.hostLine].filter(Boolean);
  let lines = regularLines;
  let label = "开播前";
  let choices = flowGroupHtml(
    `<button class="primary" data-start-night-broadcast type="button">${escapeHtml(prologue.entryActionLabel ?? "开始直播")}</button>`
  );
  if (entryDone && coldOpen && !coldOpenDone) {
    lines = [...(coldOpen.setupLines ?? []), coldOpen.line, ...(coldOpen.baitComments ?? [])].filter(Boolean);
    label = "第一通来电";
    choices = flowGroupHtml(
      `<button class="primary" data-reveal-cold-open type="button">${escapeHtml(coldOpen.actionLabel ?? "听完这条语音")}</button>`
    );
  } else if (entryDone) {
    lines = coldOpen ? [...(coldOpen.interestLines ?? [])] : regularLines;
    label = coldOpen ? "第一通来电" : "开播前";
    choices = flowGroupHtml(
      `<button class="primary" data-enter-first-case type="button">接入第一通来电</button>`,
      { label: "直播已经开始", note: "第一位咨询者正在等待接通。" }
    );
  }
  const commentLines = lines.filter((line) => typeof line === "object" && line?.type === "comment");
  const dialogueLines = lines.filter((line) => typeof line !== "object" || line?.type !== "comment");
  frame({
    brief,
    mood: "focused",
    label,
    chapter: "晚间热线",
    showCaseHud: false,
    visualHud: `${hostPortraitLayer()}${liveCommentStrip({ comments: commentLines.map((line) => line.text).filter(Boolean) })}`,
    screenClass: "night-shell-prologue-screen",
    text: nightShellHtml(dialogueLines),
    choices
  });
  bind("[data-start-night-broadcast]", () => {
    if (entryActionKey) markAction(brief, entryActionKey, { spend: false });
    saveState();
    render();
  });
  bind("[data-reveal-cold-open]", () => {
    markAction(brief, coldOpen.actionKey ?? "golden-90-first-interest", { spend: false });
    saveState();
    render();
  });
  bind("[data-enter-first-case]", () => {
    commit((state) => {
      state.scene = "caseTitle";
    });
  });
  bindSceneButtons();
}

function renderNightShellEpilogue(brief) {
  const state = ctx.getState();
  const epilogue = nightShellForBrief(brief)?.epilogue ?? {};
  const resultLine = epilogue[nightShellEndingKey?.() ?? (nightShellGoodEnding() ? "good" : "bad")]
    ?? (nightShellGoodEnding() ? epilogue.good : epilogue.bad);
  const careChoicesByCaseId = { ...state.careChoices };
  for (const caseBrief of state.caseBriefs ?? []) {
    const choice = state.careChoices?.[caseKey(caseBrief)];
    if (!choice) continue;
    const pack = storyPackForKey(caseBrief.storyKey ?? caseBrief.weeklyKey ?? storyKeyFromUrl());
    careChoicesByCaseId[storyInterludeCaseId(pack, caseBrief)] = choice;
  }
  const stage = epilogueUnreadStage(epilogue, careChoicesByCaseId, state.epilogueUnreadStep);
  const currentIndex = stage.visibleMessages.length - 1;
  const lines = stage.complete
    ? [resultLine, epilogue.home, epilogue.close].filter(Boolean)
    : [];
  const openingHtml = nightShellHtml([epilogue.opening].filter(Boolean));
  const unreadHtml = epilogueUnreadHtml({ messages: stage.visibleMessages, currentIndex });
  const canReturnToCafe = Boolean(nightShellForBrief(brief)?.cafePrologue);
  frame({
    brief,
    mood: "focused",
    label: stage.complete ? "天亮前" : "收播后 · 后台未读",
    chapter: "深夜档",
    showCaseHud: false,
    visualHud: stage.complete ? endingCgStageHtml(epilogue.closingCg) : "",
    screenClass: `night-epilogue-screen${stage.complete && epilogue.closingCg?.src ? " has-ending-cg" : ""}`,
    text: stage.complete ? `${openingHtml}${nightShellHtml(lines)}` : `${openingHtml}${unreadHtml}`,
    choices: flowGroupHtml(stage.complete
      ? `<button class="primary" data-finish-night-shell type="button">${canReturnToCafe ? "上午，见一位老来客" : "结束试玩"}</button>`
      : epilogueUnreadContinueHtml({ visibleCount: stage.visibleMessages.length, total: stage.messages.length }))
  });
  bind("[data-epilogue-unread-next]", () => {
    commit((state) => {
      state.epilogueUnreadStep = Math.min(stage.messages.length + 1, stage.index + 1);
    });
  });
  bind("[data-finish-night-shell]", () => {
    const cafePrologue = nightShellForBrief(brief)?.cafePrologue;
    if (cafePrologue) {
      setCafePrologueStep(state, 8);
      return;
    }
    moveScene("runComplete");
  });
  bindSceneButtons();
}


function nightShellHtml(lines = []) {
  return `
    <section class="night-shell-card">
      ${lines.map((line) => {
        const entry = typeof line === "string"
          ? { type: "narration", speaker: "旁白", text: line }
          : line ?? {};
        const audioCueAttribute = entry.audioCueId ? ` data-audio-cue-id="${escapeHtml(entry.audioCueId)}"` : "";
        return `
          <div class="night-shell-line shell-${escapeHtml(entry.type ?? "plain")}" data-speaker-profile-id="${escapeHtml(entry.speakerProfileId ?? "")}"${audioCueAttribute}>
            ${entry.speaker ? `<b>${escapeHtml(entry.speaker)}</b>` : ""}
            <p>${escapeHtml(entry.text ?? "")}</p>
          </div>
        `;
      }).join("")}
    </section>
  `;
}

function endingCgStageHtml(cg = null) {
  if (!cg?.src) return "";
  return `
    <figure class="night-ending-cg-stage">
      <img src="${escapeHtml(cg.src)}" alt="${escapeHtml(cg.alt ?? "收播后的桌面")}" onerror="this.closest('figure')?.classList.add('art-missing');this.hidden=true" />
      <figcaption>
        ${cg.kicker ? `<span>${escapeHtml(cg.kicker)}</span>` : ""}
        ${cg.caption ? `<b>${escapeHtml(cg.caption)}</b>` : ""}
      </figcaption>
    </figure>
  `;
}

  return {
    renderNightShellPrologue,
    renderNightShellEpilogue
  };
}
