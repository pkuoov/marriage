import { DEFAULT_PLAYER_NAME, normalizePlayerName } from "../../playerIdentity.js";
import { createOvernightDocumentScreens } from "./overnightDocumentScreens.js";
import { createLiveCounterScreens } from "./liveCounterScreens.js";

export function createOvernightScreens(ctx) {
  const {
    playAudioCueOnce,
    consumePixelTransition,
    audioCueView,
    availableCallbackOpeners,
    availableOvernightCallbackOpeners,
    callbackOpenerById,
    canEnterOvernightCallback,
    caseKey,
    daySceneById,
    documentById,
    documentRowById,
    earnedDocumentQuestionsFor,
    evidenceChecksFor,
    keyQuestionLimit,
    liveCounterBeatAfterScene,
    liveCounterBeatBeforeScene,
    liveCounterBeatById,
    pressureSignalForLiveCounterChoice,
    nextPlayableSceneIndex,
    nightStructureFor,
    overnightCallbackDialogueLines,
    overnightCallbackOpenerById,
    overnightFirstNight2SceneIndex,
    overnightReturnPostureFor,
    overnightStructureFor,
    returnStanceFor,
    snapshotEchoFor,
    CHOICE_COST_META,
    callDialogueHtml,
    choiceButtonBodyHtml,
    flowGroupHtml,
    audioPlaybackControlsHtml,
    callbackOpenerBeatHtml,
    callbackOpenerChoiceHtml,
    liveCounterBeatHtml,
    saveState,
    render,
    renderSceneReview,
    frame,
    dayFrame,
    bind,
    bindSceneButtons,
    stanceSnapshotPickForState,
    liveCounterPickKey,
    liveCounterPickForState,
    setIndexValue,
    currentIndex,
    markAction,
    actionDone,
    ensureNight,
    ensureOvernight,
    updateNight,
    updateOvernight,
    recordContradiction,
    recordRouteChoice,
    sceneAfterEvidenceFor,
    escapeHtml
  } = ctx;

  const documentScreens = createOvernightDocumentScreens(ctx, {
    renderDayMap,
    completeDayScene,
    overnightRouteIndexFor,
    enterOvernightNight2
  });
  const liveCounterScreens = createLiveCounterScreens(ctx);

  function renderOvernightHangup(brief) {
    const state = ctx.getState();
    const structure = overnightStructureFor(brief);
    if (!structure) {
      state.scene = "sceneReview";
      saveState();
      return renderSceneReview(brief);
    }
    const authoredHangup = nightStructureFor(brief)?.hangup ?? {};
    const hangupDialogue = [
      ...(authoredHangup.line ? [{ role: "caller", text: authoredHangup.line }] : []),
      ...((structure.hostHoldLine ?? authoredHangup.hostLine) ? [{
        role: "host",
        text: structure.hostHoldLine ?? authoredHangup.hostLine
      }] : [])
    ];
    frame({
      brief,
      mood: "tense",
      label: "连线挂断",
      chapter: "第一夜",
      text: `
        <section class="hangup-beat-card">
          <div class="offair-ritual-visual" aria-hidden="true"><i></i><span>ON AIR</span><b>收麦</b></div>
          ${callDialogueHtml(hangupDialogue)}
          <span>${escapeHtml(structure.hangupLine ?? "")}</span>
          <div class="offair-comment-settle"><span>弹幕慢下来了</span><p>先把原话留在台上。第二晚回拨，再把材料带回来。</p></div>
        </section>
      `,
      choices: flowGroupHtml(
        `<button class="primary" data-enter-post-live type="button">收麦，离开直播台</button>`,
        { label: "第一夜到这里", note: "先把刚才听到的内容带下直播台。" }
      ),
      audioEnterCueId: structure.hangupAudioCueId
    });
    bind("[data-enter-post-live]", () => {
      state.scene = "overnightPostLive";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderOvernightPostLive(brief) {
    const structure = overnightStructureFor(brief);
    const contact = structure?.postHangupContact ?? null;
    if (!structure || !contact?.lines?.length) {
      return enterOvernightInterludeOrDay(brief);
    }
    frame({
      brief,
      mood: "focused",
      label: "收麦后",
      chapter: "第一夜 · 后台",
      showCaseHud: false,
      visualHud: "",
      text: `
        <section class="hangup-beat-card hangup-npc-contact">
          <span>${escapeHtml(contact.stageDirection ?? "直播信号已经切断。")}</span>
          <span class="source-badge">${escapeHtml(contact.label ?? "收麦后通话")}</span>
          ${callDialogueHtml(contact.lines)}
        </section>
      `,
      choices: flowGroupHtml(
        `<button class="primary" data-enter-day-act type="button">到第二天下午</button>`,
        { label: "时间推进", note: "离开直播间，继续查能落到纸面上的东西。" }
      )
    });
    bind("[data-enter-day-act]", () => {
      enterOvernightInterludeOrDay(brief);
    });
    bindSceneButtons();
  }

  function enterOvernightInterludeOrDay(brief) {
    const state = ctx.getState();
    const interlude = nightStructureFor(brief)?.interlude;
    if ((interlude?.actions ?? []).length) {
      updateNight(brief, { segment: "interlude", hangupDone: true });
      state.scene = "interludeDesk";
    } else {
      state.scene = "dayActOpening";
    }
    saveState();
    render();
  }

  function renderDayActOpening(brief) {
    const state = ctx.getState();
    const structure = overnightStructureFor(brief);
    if (!structure) {
      state.scene = "dayMap";
      saveState();
      return renderDayMap(brief);
    }
    const caseNumber = Number(state.chapter ?? 1);
    dayFrame({
      brief,
      label: `第 ${caseNumber} 案 · 回访准备`,
      chapter: "第二天，下午",
      backdropClass: "day-city",
      text: `
        <section class="day-act-opening">
          <span>第二天，下午</span>
          <b>把昨晚没问完的补上</b>
          <p>${escapeHtml(structure.dayIntro ?? "")}</p>
          <small>没有弹幕催你。你只见已经答应见面的人，只看来电人同意交给节目的材料。</small>
        </section>
      `,
      choices: flowGroupHtml(
        `<button class="primary" data-enter-day-map type="button">安排下午的回访</button>`,
        { label: "回访准备", note: "每次约见或看材料会占掉一格下午时间。" }
      )
    });
    bind("[data-enter-day-map]", () => {
      updateOvernight(brief, { segment: "day", hangupDone: true });
      state.scene = "dayMap";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderDayMap(brief) {
    const state = ctx.getState();
    const structure = overnightStructureFor(brief);
    if (!structure) {
      state.scene = "sceneReview";
      saveState();
      return renderSceneReview(brief);
    }
    const overnight = ensureOvernight(brief);
    const done = new Set(overnight.dayScenesDone ?? []);
    const remaining = Number(overnight.dayBudget?.remaining ?? 0);
    const required = Math.max(0, Number(structure.minDayScenes ?? 0));
    const completedCount = (overnight.dayScenesDone ?? []).length;
    const callbackReady = canEnterOvernightCallback(brief, overnight);
    const scenes = structure.dayScenes ?? [];
    const sceneGrid = scenes.map((scene) => {
      const completed = done.has(scene.id);
      const disabled = !completed && remaining <= 0;
      if (completed) {
        return `
          <article class="day-place done">
            <b>${escapeHtml(scene.label ?? "")}</b>
            <span>已去过</span>
          </article>
        `;
      }
      return `
        <button class="day-place decision-choice" data-day-scene="${escapeHtml(scene.id ?? "")}" ${disabled ? "disabled" : ""} type="button">
          ${choiceButtonBodyHtml(scene.label ?? "", disabled ? "本日下午已用完" : CHOICE_COST_META.dayPlace)}
        </button>
      `;
    }).join("");
    dayFrame({
      brief,
      label: "白天调查",
      chapter: "第二天，下午",
      backdropClass: "day-city",
      text: `
        <section class="day-map-card">
          <span class="source-badge">今天的约见与材料</span>
          <div class="interlude-budget" aria-label="白天剩余 ${remaining} 格，总计 ${Number(overnight.dayBudget?.max ?? 0)} 格">
            <b>剩余 ${remaining} 格</b>
            <span>${completedCount ? `已走访 ${completedCount} 处` : "每处耗时 1 格"}</span>
          </div>
          <div class="day-place-grid">${sceneGrid}</div>
          ${(overnight.earnedItems ?? []).length ? `<p class="hint">今晚回拨能用的内容：${escapeHtml((overnight.earnedItems ?? []).join(" / "))}</p>` : ""}
        </section>
      `,
      choices: flowGroupHtml(callbackReady
        ? `<button class="primary" data-enter-overnight-callback type="button">回直播间等回拨</button>`
        : `<button type="button" disabled>还要选 ${Math.max(0, required - completedCount)} 处</button>`)
    });
    bind("[data-day-scene]", (event) => {
      updateOvernight(brief, { activeDaySceneId: event.currentTarget?.getAttribute("data-day-scene") ?? "" });
      state.scene = "dayScene";
      saveState();
      render();
    });
    bind("[data-enter-overnight-callback]", () => {
      updateOvernight(brief, { segment: "night2" });
      state.scene = "overnightCallback";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderDayScene(brief) {
    const state = ctx.getState();
    const structure = overnightStructureFor(brief);
    const overnight = ensureOvernight(brief);
    const dayScene = daySceneById(brief, overnight.activeDaySceneId);
    if (!structure || !dayScene) {
      state.scene = "dayMap";
      saveState();
      return renderDayMap(brief);
    }
    const body = dayScene.body ?? {};
    if (dayScene.kind === "document") return documentScreens.renderDocumentDayScene(brief, dayScene);
    const completed = (overnight.dayScenesDone ?? []).includes(dayScene.id);
    const timeline = body.timelineSort;
    const timelineState = overnight.timelineSorts?.[dayScene.id] ?? { order: [], submitted: false };
    const followupAsked = Boolean(overnight.dayFollowups?.[dayScene.id]);
    const choiceStateId = overnight.dayChoices?.[dayScene.id] ?? "";
    const interaction = timeline
      ? documentScreens.dayTimelineHtml(dayScene, timeline, timelineState)
      : documentScreens.dayFollowupHtml(body, followupAsked);
    const stageExtras = dayStageExtrasHtml(dayScene, body);
    let canLeave = completed || !timeline || timelineState.submitted;
    if (body.choice && !choiceStateId) canLeave = false;
    dayFrame({
      brief,
      label: dayScene.label ?? "白天调查",
      chapter: documentScreens.quietDayChapter(dayScene.kind),
      backdropClass: dayScene.backdropClass ?? "day-city",
      text: `
        <section class="day-scene-card">
          <span class="source-badge">${escapeHtml(dayScene.label ?? "白天")}</span>
          ${stageExtras}
          <p>${escapeHtml(body.text ?? "")}</p>
          ${dayBeatsHtml(body)}
          ${interaction}
          ${dayChoiceHtml(body, choiceStateId)}
        </section>
      `,
      choices: flowGroupHtml(`
        <button data-scene="dayMap" type="button">先回安排页</button>
        ${canLeave ? `<button class="primary" data-complete-day-scene type="button">带着这部分离开</button>` : (body.choice && !choiceStateId ? `<button type="button" disabled>先选一步</button>` : "")}
      `)
    });
    bind("[data-day-timeline-card]", (event) => {
      documentScreens.selectTimelineCard(brief, dayScene, event.currentTarget?.getAttribute("data-day-timeline-card") ?? "");
    });
    bind("[data-reset-day-timeline]", () => {
      updateOvernight(brief, {
        timelineSorts: {
          ...(ensureOvernight(brief).timelineSorts ?? {}),
          [dayScene.id]: { order: [], submitted: false }
        }
      });
      saveState();
      render();
    });
    bind("[data-submit-day-timeline]", () => documentScreens.submitTimelineSort(brief, dayScene));
    bind("[data-day-followup]", () => {
      updateOvernight(brief, {
        dayFollowups: {
          ...(ensureOvernight(brief).dayFollowups ?? {}),
          [dayScene.id]: true
        }
      });
      saveState();
      render();
    });
    bind("[data-day-choice]", (event) => {
      const optionId = event.currentTarget?.getAttribute("data-day-choice") ?? "";
      if (!optionId) return;
      updateOvernight(brief, {
        dayChoices: {
          ...(ensureOvernight(brief).dayChoices ?? {}),
          [dayScene.id]: optionId
        }
      });
      saveState();
      render();
    });
    bind("[data-complete-day-scene]", () => completeDayScene(brief, dayScene));
    bindSceneButtons();
  }

  function dayStageExtrasHtml(dayScene = {}, body = {}) {
    const parts = [];
    if (body.access) {
      parts.push(`<p class="hint day-access-hint"><b>这次为什么能问：</b>${escapeHtml(body.access)}</p>`);
    }
    if (Array.isArray(body.cast) && body.cast.length) {
      parts.push(`<div class="day-cast">${body.cast.map((name) => `<span>${escapeHtml(name)}</span>`).join("")}</div>`);
    }
    if (dayScene.kind === "observe") {
      parts.push(`<p class="hint day-sitin-hint">同场不同桌。你只看，不介入。</p>`);
    }
    return parts.join("");
  }

  function dayBeatsHtml(body = {}) {
    const beats = body.beats ?? [];
    if (!beats.length) return "";
    const hostName = normalizePlayerName(ctx.getState()?.playerName);
    return callDialogueHtml(beats.map((beat) => {
      const speaker = beat.speaker ?? "";
      const isHost = ["你", "主播", DEFAULT_PLAYER_NAME, hostName].some((label) => speaker === label || speaker.includes(label));
      return { role: isHost ? "host" : "caller", speaker, text: beat.text ?? "" };
    }));
  }

  function dayChoiceHtml(body = {}, choiceStateId = "") {
    const choice = body.choice;
    if (!choice?.prompt) return "";
    const options = choice.options ?? [];
    if (choiceStateId) {
      const selected = options.find((option) => option.id === choiceStateId);
      const resultText = selected?.resultText
        ? `<p>${escapeHtml(selected.resultText)}</p>`
        : "";
      const resultBeats = dayBeatsHtml({ beats: selected?.resultBeats ?? [] });
      const audioPlayback = audioPlaybackControlsHtml(audioCueView(selected?.audioCueId ?? ""));
      return `
        <section class="day-followup">
          <p class="reaction">${escapeHtml(selected?.label ?? "已记下")}</p>
          ${resultText}
          ${audioPlayback}
          ${resultBeats}
        </section>
      `;
    }
    return `
      <section class="day-followup">
        <b>${escapeHtml(choice.prompt)}</b>
        <div class="day-choice-grid">
          ${options.map((option) => `
            <button class="decision-choice" data-day-choice="${escapeHtml(option.id ?? "")}" type="button">${choiceButtonBodyHtml(option.label ?? "", CHOICE_COST_META.dayChoice)}</button>
          `).join("")}
        </div>
      </section>
    `;
  }

  function renderOvernightCallback(brief) {
    const state = ctx.getState();
    const structure = overnightStructureFor(brief);
    if (!structure) {
      state.scene = "sceneReview";
      saveState();
      return renderSceneReview(brief);
    }
    const overnight = ensureOvernight(brief);
    const openers = availableOvernightCallbackOpeners(brief, overnight.earnedItems);
    if (!overnight.callbackOpenerId && openers.length > 1) {
      frame({
        brief,
        mood: "focused",
        label: "回拨开场",
        chapter: "第二夜",
        text: `
          <section class="callback-opener-card">
            <span class="source-badge">回拨已接入</span>
            <p><b>带一件白天的东西回到麦上</b></p>
            <div class="callback-opener-grid">
              ${openers.map((opener) => `
                <button class="callback-opener-option decision-choice" data-overnight-opener="${escapeHtml(opener.id ?? "")}" type="button">
                  ${choiceButtonBodyHtml(opener.id ?? "", CHOICE_COST_META.callbackOpener, opener.line ?? "")}
                </button>
              `).join("")}
            </div>
          </section>
        `,
        choices: ""
      });
      bind("[data-overnight-opener]", (event) => {
        updateOvernight(brief, { callbackOpenerId: event.currentTarget?.getAttribute("data-overnight-opener") ?? "" });
        saveState();
        render();
      });
      bindSceneButtons();
      return;
    }
    const opener = overnight.callbackOpenerId
      ? overnightCallbackOpenerById(brief, overnight.callbackOpenerId)
      : openers[0] ?? { id: "fallback", ...(structure.callbackFallback ?? {}) };
    const stanceNudge = nightStructureFor(brief) ? ensureNight(brief).stanceNudge : null;
    const snapshotPick = stanceSnapshotPickForState(brief);
    const posture = overnightReturnPostureFor(snapshotPick, stanceNudge);
    const stanceLine = structure.postures?.[posture] ?? "";
    const snapshotEcho = snapshotEchoFor(brief, snapshotPick);
    frame({
      brief,
      mood: posture === "againstCaller" ? "tense" : "focused",
      label: "回拨已接入",
      chapter: "第二夜",
      text: `
        <section class="callback-opener-card">
          <span class="source-badge">第二夜</span>
          ${callDialogueHtml(overnightCallbackDialogueLines(brief, { stanceLine, opener, snapshotEcho }))}
        </section>
      `,
      choices: flowGroupHtml(`<button class="primary" data-enter-overnight-night2 type="button">继续追问</button>`)
    });
    bind("[data-enter-overnight-night2]", () => {
      updateOvernight(brief, { segment: "night2", callbackOpenerId: opener.id ?? "fallback" });
      setIndexValue(brief, "sceneReview", overnightFirstNight2SceneIndex(brief));
      state.scene = documentScreens.pendingDocumentQuestions(brief).length ? "documentReconcile" : "overnightNight2";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function enterOvernightNight2(brief) {
    const state = ctx.getState();
    setIndexValue(brief, "sceneReview", overnightFirstNight2SceneIndex(brief));
    state.scene = "overnightNight2";
    saveState();
    render();
  }

  function completeDayScene(brief, dayScene = {}, { renderNow = true, stayActive = false } = {}) {
    const state = ctx.getState();
    const overnight = ensureOvernight(brief);
    const alreadyDone = (overnight.dayScenesDone ?? []).includes(dayScene.id);
    const budget = overnight.dayBudget ?? { max: 0, remaining: 0, used: 0 };
    const choiceId = overnight.dayChoices?.[dayScene.id];
    const choiceOpt = (dayScene.body?.choice?.options ?? []).find((option) => option.id === choiceId);
    const earnedItemId = choiceOpt?.grantsEarnedItemId || dayScene.body?.earnedItemId;
    updateOvernight(brief, {
      dayBudget: alreadyDone ? budget : {
        ...budget,
        remaining: Math.max(0, Number(budget.remaining ?? 0) - 1),
        used: Number(budget.used ?? 0) + 1
      },
      dayScenesDone: [...new Set([...(overnight.dayScenesDone ?? []), dayScene.id])],
      earnedItems: earnedItemId ? [...new Set([...(overnight.earnedItems ?? []), earnedItemId])] : (overnight.earnedItems ?? []),
      activeDaySceneId: stayActive ? dayScene.id : null
    });
    markAction(brief, `overnight:dayScene:${dayScene.id}`);
    if (!alreadyDone && !dayScene.body?.timelineSort) {
      recordRouteChoice(brief, overnightRouteIndexFor(brief, dayScene), {
        question: dayScene.label ?? "白天地点",
        answer: earnedItemId ?? "visited",
        routeAxis: choiceOpt?.routeAxis ?? dayScene.body?.routeAxis ?? "outer-thread",
        routeTone: choiceOpt?.routeTone ?? "day-scene"
      }, { version: dayScene.body?.text ?? "" });
    }
    if (renderNow) {
      state.scene = "dayMap";
      saveState();
      render();
    }
  }

  function overnightRouteIndexFor(brief = {}, dayScene = {}) {
    const scenes = overnightStructureFor(brief)?.dayScenes ?? [];
    const dayIndex = Math.max(0, scenes.findIndex((item) => item.id === dayScene.id));
    return keyQuestionLimit(brief) + evidenceChecksFor(brief).length + 0.2 + dayIndex / 100;
  }

  function renderCallbackOpener(brief) {
    const state = ctx.getState();
    const night = ensureNight(brief);
    const openers = availableCallbackOpeners(brief, night.inventory, night.interludeChoicesDone);
    frame({
      brief,
      mood: "focused",
      label: "回拨开场",
      chapter: "第二段连线",
      text: callbackOpenerChoiceHtml({ openers, inventory: night.inventory }),
      choices: ""
    });
    bind("[data-callback-opener]", (event) => {
      const openerId = event.currentTarget?.getAttribute("data-callback-opener") ?? "";
      const stance = night.stanceNudge ?? returnStanceFor(brief, stanceSnapshotPickForState(brief));
      updateNight(brief, {
        segment: "segment2",
        callbackOpenerId: openerId,
        callerStanceOnReturn: stance
      });
      state.scene = "callbackOpenerBeat";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderCallbackOpenerBeat(brief) {
    const state = ctx.getState();
    const night = ensureNight(brief);
    const structure = nightStructureFor(brief);
    const opener = callbackOpenerById(brief, night.callbackOpenerId) ?? availableCallbackOpeners(brief, night.inventory, night.interludeChoicesDone)[0] ?? {};
    const stanceLine = structure?.returnStance?.lines?.[night.callerStanceOnReturn] ?? "";
    frame({
      brief,
      mood: night.callerStanceOnReturn === "defensive" ? "tense" : "focused",
      label: "回拨已接入",
      chapter: "第二段连线",
      text: callbackOpenerBeatHtml({ stanceLine, opener }),
      choices: flowGroupHtml(`<button class="primary" data-enter-segment2 type="button">继续追问</button>`)
    });
    bind("[data-enter-segment2]", () => {
      const firstSegment2 = nightStructureFor(brief)?.segment2SceneIndexes?.[0] ?? 0;
      setIndexValue(brief, "sceneReview", firstSegment2);
      state.scene = "callSegment2";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  return {
    renderOvernightHangup,
    renderOvernightPostLive,
    renderDayActOpening,
    renderDayMap,
    renderDayScene,
    renderOvernightCallback,
    renderLiveCounterBeat: liveCounterScreens.renderLiveCounterBeat,
    renderDocumentDayScene: documentScreens.renderDocumentDayScene,
    renderDocumentReconcile: documentScreens.renderDocumentReconcile,
    renderCallbackOpener,
    renderCallbackOpenerBeat,
    enterLiveCounterBeatBeforeScene: liveCounterScreens.enterLiveCounterBeatBeforeScene,
    enterLiveCounterBeatAfterScene: liveCounterScreens.enterLiveCounterBeatAfterScene
  };
}
