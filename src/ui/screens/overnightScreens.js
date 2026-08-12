import { DEFAULT_PLAYER_NAME, normalizePlayerName } from "../../playerIdentity.js";

export function createOvernightScreens(ctx) {
  const {
    playAudioCueOnce,
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
          ${callDialogueHtml(hangupDialogue)}
          <span>${escapeHtml(structure.hangupLine ?? "")}</span>
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
    if (dayScene.kind === "document") return renderDocumentDayScene(brief, dayScene);
    const completed = (overnight.dayScenesDone ?? []).includes(dayScene.id);
    const timeline = body.timelineSort;
    const timelineState = overnight.timelineSorts?.[dayScene.id] ?? { order: [], submitted: false };
    const followupAsked = Boolean(overnight.dayFollowups?.[dayScene.id]);
    const choiceStateId = overnight.dayChoices?.[dayScene.id] ?? "";
    const interaction = timeline
      ? dayTimelineHtml(dayScene, timeline, timelineState)
      : dayFollowupHtml(body, followupAsked);
    const stageExtras = dayStageExtrasHtml(dayScene, body);
    let canLeave = completed || !timeline || timelineState.submitted;
    if (body.choice && !choiceStateId) canLeave = false;
    dayFrame({
      brief,
      label: dayScene.label ?? "白天调查",
      chapter: quietDayChapter(dayScene.kind),
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
      selectTimelineCard(brief, dayScene, event.currentTarget?.getAttribute("data-day-timeline-card") ?? "");
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
    bind("[data-submit-day-timeline]", () => submitTimelineSort(brief, dayScene));
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
      state.scene = pendingDocumentQuestions(brief).length ? "documentReconcile" : "overnightNight2";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderLiveCounterBeat(brief) {
    const state = ctx.getState();
    const beat = liveCounterBeatById(brief, state.activeLiveCounterBeatId)
      ?? liveCounterBeatBeforeScene(
        brief,
        currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1),
        (key) => actionDone(brief, key),
        ensureOvernight(brief)
      )
      ?? liveCounterBeatAfterScene(
        brief,
        currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1),
        (key) => actionDone(brief, key),
        ensureOvernight(brief)
      );
    if (!beat) {
      state.activeLiveCounterBeatId = null;
      state.scene = "overnightNight2";
      saveState();
      return renderSceneReview(brief);
    }
    const pick = liveCounterPickForState(brief, beat.id);
    const requiresChoice = (beat.choices ?? []).length > 0;
    frame({
      brief,
      mood: "tense",
      label: "现场反压",
      chapter: "第二夜",
      text: liveCounterBeatHtml(beat, pick),
      choices: (!requiresChoice || pick)
        ? flowGroupHtml(`<button class="primary" data-continue-live-counter type="button">继续追问</button>`)
        : ""
    });
    bind("[data-live-counter-choice]", (event) => {
      recordLiveCounterChoice(brief, beat, event.currentTarget?.getAttribute("data-live-counter-choice") ?? "");
    });
    bind("[data-continue-live-counter]", () => continueAfterLiveCounterBeat(brief, beat));
    bindSceneButtons();
  }

  function renderDocumentDayScene(brief, dayScene = {}) {
    const state = ctx.getState();
    const document = documentById(brief, dayScene.body?.documentId);
    if (!document) {
      state.scene = "dayMap";
      saveState();
      return renderDayMap(brief);
    }
    const overnight = ensureOvernight(brief);
    const markedRows = overnight.documentMarks?.[document.id] ?? [];
    const canLeave = markedRows.length > 0;
    dayFrame({
      brief,
      label: dayScene.label ?? document.title ?? "回后台审流水",
      chapter: quietDayChapter(dayScene.kind),
      backdropClass: dayScene.backdropClass ?? "day-document",
      text: `
        ${dayScene.body?.access ? `<p class="hint day-access-hint"><b>这份材料为什么能看：</b>${escapeHtml(dayScene.body.access)}</p>` : ""}
        ${documentViewerHtml({ document, markedRows })}
      `,
      choices: flowGroupHtml(`
        <button data-scene="dayMap" type="button">先回安排页</button>
        ${canLeave
          ? `<button class="primary" data-complete-day-scene type="button">圈好，带回直播间</button>`
          : `<button type="button" disabled>先圈一行</button>`}
      `)
    });
    bind("[data-document-row]", (event) => markDocumentRow(brief, dayScene, document, event.currentTarget?.getAttribute("data-document-row") ?? ""));
    bind("[data-complete-day-scene]", () => completeDayScene(brief, dayScene));
    bindSceneButtons();
  }

  function renderDocumentReconcile(brief) {
    const overnight = ensureOvernight(brief);
    const pending = pendingDocumentQuestions(brief);
    const active = (overnight.documentEarnedQuestions ?? []).find((question) => question.id === overnight.activeDocumentQuestionId) ?? null;
    if (!pending.length && !active) {
      enterOvernightNight2(brief);
      return;
    }
    frame({
      brief,
      mood: "focused",
      label: "对账节拍",
      chapter: "第二夜",
      text: documentReconcileHtml({ active, pending }),
      choices: flowGroupHtml(`
        ${active ? `<button class="primary" data-close-document-question type="button">继续对账</button>` : ""}
        ${!active && !pending.length ? `<button class="primary" data-enter-overnight-night2-direct type="button">继续追问</button>` : ""}
      `)
    });
    bind("[data-document-question]", (event) => askDocumentQuestion(brief, event.currentTarget?.getAttribute("data-document-question") ?? ""));
    bind("[data-close-document-question]", () => {
      updateOvernight(brief, { activeDocumentQuestionId: null });
      saveState();
      render();
    });
    bind("[data-enter-overnight-night2-direct]", () => enterOvernightNight2(brief));
    bindSceneButtons();
  }

  function dayTimelineHtml(dayScene = {}, timeline = {}, timelineState = {}) {
    const order = timelineState.order ?? [];
    const submitted = Boolean(timelineState.submitted);
    const selected = new Set(order);
    const cards = timeline.cards ?? [];
    const payoff = timelineState.correct ? timeline.payoffLine : timeline.missLine;
    return `
      <section class="day-timeline-sort">
        <header class="timeline-sort-head">
          <span class="source-badge">时间线</span>
          <b>把确认过的时间点，从早到晚放进来。</b>
          <small>已放 ${order.length}/${cards.length} 张。</small>
        </header>
        <section class="timeline-order" aria-label="当前时间线">
          <span>当前顺序</span>
          <ol class="timeline-picked">
            ${cards.map((_, index) => {
              const card = order[index];
              return `<li class="${card ? "filled" : "empty"}"><i>${index + 1}</i><span>${escapeHtml(card ?? "等待放入")}</span></li>`;
            }).join("")}
          </ol>
        </section>
        ${submitted ? `<p class="reaction">${escapeHtml(payoff ?? "")}</p>` : `
          <section class="timeline-available">
            <span>待放时间点</span>
            <div class="timeline-card-grid">
              ${cards.map((card) => `
                <button class="decision-choice" data-day-timeline-card="${escapeHtml(card)}" ${selected.has(card) ? "disabled" : ""} type="button">
                  ${choiceButtonBodyHtml(card, selected.has(card) ? "已放入" : CHOICE_COST_META.timelineCard)}
                </button>
              `).join("")}
            </div>
          </section>
          <div class="inline-actions">
            <button data-reset-day-timeline ${order.length ? "" : "disabled"} type="button">清空重排</button>
            <button class="primary" data-submit-day-timeline ${order.length === cards.length ? "" : "disabled"} type="button">确认时间线</button>
          </div>
        `}
      </section>
    `;
  }

  function dayFollowupHtml(body = {}, followupAsked = false) {
    const followup = body.followup;
    if (!followup?.question) return "";
    return `
      <section class="day-followup">
        ${followupAsked ? callDialogueHtml([
          { role: "host", text: followup.question },
          { role: "caller", speaker: followup.speaker ?? "她", text: followup.answer ?? "" }
        ]) : `<button class="decision-choice" data-day-followup type="button">${choiceButtonBodyHtml(followup.question, CHOICE_COST_META.dayFollowup)}</button>`}
      </section>
    `;
  }

  function quietDayChapter(dayKind = "") {
    return {
      lab: "白天·鉴定所",
      visit: "白天·街上",
      home: "白天·家",
      studio: "白天·工作室",
      document: "白天·后台流水",
      observe: "白天·同场观察",
      doorstep: "白天·门口"
    }[dayKind] ?? "白天";
  }

  function documentViewerHtml({ document = {}, markedRows = [] } = {}) {
    const marked = new Set(markedRows ?? []);
    const limit = Number(document.markLimit ?? 3);
    const columns = documentTableColumns(document);
    const gridStyle = `grid-template-columns: 56px repeat(${columns.length}, minmax(110px, 1fr));`;
    return `
      <section class="document-viewer-card">
        <span class="source-badge">文档呈堂</span>
        <p><b>${escapeHtml(document.title ?? "")}</b></p>
        <p>${escapeHtml(document.intro ?? "")}</p>
        <div class="document-mark-limit"><b>已圈 ${marked.size}/${limit}</b><span>圈行后，夜里可逐条对账。</span></div>
        <div class="bank-flow-table" role="table" aria-label="${escapeHtml(document.title ?? "流水单")}">
          <div class="bank-flow-head" role="row" style="${gridStyle}">
            <span>序号</span>${columns.map((column) => `<span>${escapeHtml(column.label)}</span>`).join("")}
          </div>
          ${(document.rows ?? []).map((row, index) => {
            const selected = marked.has(row.rowId);
            const disabled = !selected && marked.size >= limit;
            return `
              <button class="bank-flow-row ${selected ? "marked" : ""}" data-document-row="${escapeHtml(row.rowId ?? "")}" ${disabled || selected ? "disabled" : ""} type="button" role="row" style="${gridStyle}">
                <span>${String(index + 1).padStart(2, "0")}</span>
                ${columns.map((column) => `<span>${escapeHtml(row[column.key] ?? "")}</span>`).join("")}
              </button>
            `;
          }).join("")}
        </div>
        ${documentEarnedPreviewHtml(document, markedRows)}
      </section>
    `;
  }

  function documentTableColumns(document = {}) {
    if (Array.isArray(document.columns) && document.columns.length) return document.columns;
    return [
      { key: "date", label: "日期" },
      { key: "kind", label: "类别" },
      { key: "amount", label: "金额" },
      { key: "party", label: "对手方" },
      { key: "memo", label: "备注" }
    ];
  }

  function documentEarnedPreviewHtml(document = {}, markedRows = []) {
    const earned = earnedDocumentQuestionsFor(document, markedRows);
    if (!earned.length) return "";
    return `
      <section class="document-earned-preview">
        <span class="source-badge">夜里可问</span>
        ${earned.map((question) => `<p>${escapeHtml(question.question ?? "")}</p>`).join("")}
      </section>
    `;
  }

  function documentReconcileHtml({ active = null, pending = [] } = {}) {
    if (active) {
      return `
        <section class="document-reconcile-card">
          <span class="source-badge">对账</span>
          ${callDialogueHtml([
            { role: "host", text: active.question ?? "" },
            { role: "caller", text: active.answer ?? "" }
          ])}
        </section>
      `;
    }
    return `
      <section class="document-reconcile-card">
        <span class="source-badge">对账节拍</span>
        <p><b>白天圈出的行，夜里逐条问。</b></p>
        <div class="document-question-grid">
          ${pending.map((question) => `
            <button data-document-question="${escapeHtml(question.id ?? "")}" type="button">
              <b>${escapeHtml(questionLabel(question))}</b>
              <span>${escapeHtml(question.question ?? "")}</span>
            </button>
          `).join("")}
        </div>
      </section>
    `;
  }

  function questionLabel(question = {}) {
    return question.kind === "cross" ? "跨行对照" : "单行追问";
  }

  function selectTimelineCard(brief, dayScene = {}, card = "") {
    if (!card) return;
    const overnight = ensureOvernight(brief);
    const previous = overnight.timelineSorts?.[dayScene.id] ?? { order: [], submitted: false };
    if (previous.submitted || (previous.order ?? []).includes(card)) return;
    updateOvernight(brief, {
      timelineSorts: {
        ...(overnight.timelineSorts ?? {}),
        [dayScene.id]: {
          ...previous,
          order: [...(previous.order ?? []), card]
        }
      }
    });
    saveState();
    render();
  }

  function submitTimelineSort(brief, dayScene = {}) {
    const overnight = ensureOvernight(brief);
    const timeline = dayScene.body?.timelineSort ?? {};
    const previous = overnight.timelineSorts?.[dayScene.id] ?? { order: [], submitted: false };
    const order = previous.order ?? [];
    if (previous.submitted || order.length !== (timeline.cards ?? []).length) return;
    const correct = JSON.stringify(order) === JSON.stringify(timeline.correctOrder ?? []);
    updateOvernight(brief, {
      timelineSorts: {
        ...(overnight.timelineSorts ?? {}),
        [dayScene.id]: {
          order,
          submitted: true,
          correct
        }
      }
    });
    recordRouteChoice(brief, overnightRouteIndexFor(brief, dayScene), {
      question: dayScene.label ?? "白天排序",
      answer: order.join(" / "),
      routeAxis: dayScene.body?.routeAxis ?? "document-edge",
      routeTone: correct ? "timeline-hit" : "timeline-miss"
    }, { version: dayScene.body?.text ?? "" });
    completeDayScene(brief, dayScene, { renderNow: false, stayActive: true });
    saveState();
    render();
  }

  function markDocumentRow(brief, dayScene = {}, document = {}, rowId = "") {
    const row = documentRowById(document, rowId);
    if (!row) return;
    const overnight = ensureOvernight(brief);
    const previous = overnight.documentMarks?.[document.id] ?? [];
    if (previous.includes(rowId)) return;
    const limit = Math.max(0, Number(document.markLimit ?? 3));
    if (previous.length >= limit) return;
    const markedRows = [...previous, rowId];
    const earned = mergeDocumentQuestions(overnight.documentEarnedQuestions ?? [], earnedDocumentQuestionsFor(document, markedRows));
    updateOvernight(brief, {
      documentMarks: {
        ...(overnight.documentMarks ?? {}),
        [document.id]: markedRows
      },
      documentEarnedQuestions: earned
    });
    markAction(brief, `document:${document.id}:${rowId}`);
    playAudioCueOnce("sfx.document.mark", `${caseKey(brief)}:document:${document.id}:${rowId}`);
    recordRouteChoice(brief, overnightRouteIndexFor(brief, dayScene) + markedRows.length / 1000, {
      question: `圈出：${row.date ?? row.kind ?? "这一行"}`,
      answer: documentRowSummary(row, document),
      routeAxis: "document-edge",
      routeTone: "document-row"
    }, { version: document.title ?? "" });
    saveState();
    render();
  }

  function mergeDocumentQuestions(current = [], next = []) {
    const byId = new Map((current ?? []).map((question) => [question.id, question]));
    (next ?? []).forEach((question) => byId.set(question.id, question));
    return [...byId.values()];
  }

  function documentRowSummary(row = {}, document = {}) {
    return documentTableColumns(document).map((column) => row[column.key]).filter(Boolean).join("；");
  }

  function pendingDocumentQuestions(brief) {
    const overnight = ensureOvernight(brief);
    const answered = overnight.documentAnsweredQuestions ?? {};
    return (overnight.documentEarnedQuestions ?? []).filter((question) => !answered[question.id]);
  }

  function askDocumentQuestion(brief, questionId = "") {
    const overnight = ensureOvernight(brief);
    const question = (overnight.documentEarnedQuestions ?? []).find((item) => item.id === questionId);
    if (!question) return;
    updateOvernight(brief, {
      activeDocumentQuestionId: question.id,
      documentAnsweredQuestions: {
        ...(overnight.documentAnsweredQuestions ?? {}),
        [question.id]: true
      }
    });
    markAction(brief, `documentQuestion:${question.id}`);
    if (question.contradiction) recordContradiction(brief, question.contradiction);
    recordRouteChoice(brief, documentQuestionRouteIndexFor(brief, question), {
      question: question.question ?? "",
      answer: question.answer ?? "",
      routeAxis: question.routeAxis ?? "document-edge",
      routeTone: question.kind === "cross" ? "document-cross" : "document-row-question"
    }, { version: question.rows?.join(" / ") ?? "" });
    saveState();
    render();
  }

  function documentQuestionRouteIndexFor(brief = {}, question = {}) {
    const questions = ensureOvernight(brief).documentEarnedQuestions ?? [];
    const index = Math.max(0, questions.findIndex((item) => item.id === question.id));
    return keyQuestionLimit(brief) + evidenceChecksFor(brief).length + 0.5 + index / 100;
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

  function enterLiveCounterBeatBeforeScene(brief = {}, sceneIndex = 0) {
    const state = ctx.getState();
    const beat = liveCounterBeatBeforeScene(
      brief,
      sceneIndex,
      (key) => actionDone(brief, key),
      ensureOvernight(brief)
    );
    if (!beat) return false;
    state.activeLiveCounterBeatId = beat.id;
    state.scene = "liveCounterBeat";
    saveState();
    renderLiveCounterBeat(brief);
    return true;
  }

  function enterLiveCounterBeatAfterScene(brief = {}, sceneIndex = 0) {
    const state = ctx.getState();
    const beat = liveCounterBeatAfterScene(brief, sceneIndex, (key) => actionDone(brief, key), ensureOvernight(brief));
    if (!beat) return false;
    state.activeLiveCounterBeatId = beat.id;
    state.scene = "liveCounterBeat";
    saveState();
    render();
    return true;
  }

  function recordLiveCounterChoice(brief = {}, beat = {}, choiceId = "") {
    const state = ctx.getState();
    const choice = (beat.choices ?? []).find((item) => item.id === choiceId) ?? null;
    if (!choice) return;
    const pressureSignal = pressureSignalForLiveCounterChoice(choice, state.lastPressureSignal ?? "");
    state.liveCounterPicks = {
      ...(state.liveCounterPicks ?? {}),
      [liveCounterPickKey(brief, beat.id)]: {
        choiceId: choice.id,
        label: choice.label ?? "",
        recapAftertaste: choice.recapAftertaste ?? "",
        stanceNudge: choice.stanceNudge ?? null,
        pressureSignal,
        routeTone: choice.routeTone ?? "live-counter",
        endingImpact: choice.endingImpact ?? null,
        at: Date.now()
      }
    };
    state.lastPressureSignal = pressureSignal || null;
    state.lastPressureAxis = choice.routeAxis ?? "caller-credibility";
    const anchorIndex = Number(beat.beforeSceneIndex ?? beat.afterSceneIndex ?? 0);
    recordRouteChoice(brief, anchorIndex + (beat.beforeSceneIndex === undefined ? 0.5 : -0.5), {
      question: beat.text ?? beat.from ?? "现场反压",
      answer: choice.label ?? "",
      routeAxis: choice.routeAxis ?? "caller-credibility",
      routeTone: choice.routeTone ?? "live-counter",
      stanceNudge: choice.stanceNudge ?? null
    }, { version: beat.from ?? "现场反压" });
    state.lastReaction = choice.recapAftertaste ?? "";
    saveState();
    render();
  }

  function continueAfterLiveCounterBeat(brief = {}, beat = {}) {
    const state = ctx.getState();
    if ((beat.choices ?? []).length && !liveCounterPickForState(brief, beat.id)) return;
    markAction(brief, `liveCounterBeat:${beat.id}`);
    state.activeLiveCounterBeatId = null;
    if (beat.beforeSceneIndex !== undefined) {
      state.scene = overnightStructureFor(brief)
        ? ensureOvernight(brief).segment === "night2" ? "overnightNight2" : "overnightNight1"
        : "sceneReview";
      saveState();
      render();
      return;
    }
    const nextBeat = liveCounterBeatAfterScene(brief, beat.afterSceneIndex, (key) => actionDone(brief, key), ensureOvernight(brief));
    if (nextBeat) {
      state.activeLiveCounterBeatId = nextBeat.id;
      state.scene = "liveCounterBeat";
      saveState();
      render();
      return;
    }
    const nextSceneIndex = nextPlayableSceneIndex(brief, Number(beat.afterSceneIndex ?? 0));
    if (nextSceneIndex >= 0) {
      setIndexValue(brief, "sceneReview", nextSceneIndex);
      state.scene = "overnightNight2";
    } else {
      state.scene = sceneAfterEvidenceFor(brief);
    }
    saveState();
    render();
  }

  return {
    renderOvernightHangup,
    renderOvernightPostLive,
    renderDayActOpening,
    renderDayMap,
    renderDayScene,
    renderOvernightCallback,
    renderLiveCounterBeat,
    renderDocumentDayScene,
    renderDocumentReconcile,
    renderCallbackOpener,
    renderCallbackOpenerBeat,
    enterLiveCounterBeatBeforeScene,
    enterLiveCounterBeatAfterScene
  };
}
