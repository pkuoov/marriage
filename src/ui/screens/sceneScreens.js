export function createSceneScreens(ctx) {
  const {
    playAudioCueOnce,
    dailyAccusationChoices,
    askedDialoguePicksForState,
    completedSceneExchangeForState,
    latestChoiceReviewRowsForState,
    selectedScenePickForState,
    pressuredAnswerVariant,
    questionPressureReaction,
    questionPressureSignal,
    routeAxisForChoice,
    routeToneForChoice,
    nextSceneAfterEvidence,
    answerKey,
    caseKey,
    evidenceChecksFor,
    keyQuestionLimit,
    nightStructureFor,
    overnightCallerQuestionFor,
    overnightStructureFor,
    sceneReviewModel,
    shouldEnterHangupAfterScene,
    shouldEnterOvernightHangupAfterScene,
    stanceSnapshotForScene,
    CHOICE_COST_META,
    callDialogueHtml,
    choiceButtonBodyHtml,
    choiceGroupHtml,
    choiceReviewHtml,
    flowGroupHtml,
    hangupBeatHtml,
    focusedQuestionOptions,
    sceneDialogueOptions,
    sceneQuestionMenuHtml,
    completedSceneExchangeHtml,
    scenePromptExchangeHtml,
    sceneQuestionAnswerHtml,
    sceneReviewDoneChoicesHtml,
    sceneReviewHtml,
    stanceSnapshotHtml,
    SCENE_HELPER,
    saveState,
    activeCaseBrief,
    render,
    liveChapterTitle,
    sceneWithShownCard,
    sceneWithCallbackRevision,
    sceneRevisionUnlocked,
    hostDisclosureForAnchor,
    respondentTeaseHtml,
    frame,
    bind,
    bindChoiceActivation,
    stanceSnapshotPickForState,
    enterLiveCounterBeatBeforeScene,
    enterLiveCounterBeatAfterScene,
    moveScene,
    setIndex,
    setIndexValue,
    currentIndex,
    firstUnansweredSceneIndex,
    nextPlayableSceneIndex,
    playableSceneIndexes,
    resolveAccusationFromButton,
    issueCompletion,
    accusationReadinessForBrief,
    retryPatienceLostStep,
    markAction,
    audiencePatienceLost,
    actionDone,
    ensureOvernight,
    updateNight,
    updateOvernight,
    recordContradiction,
    recordRouteChoice,
    hasDeepFollowup,
    deepFollowupFor,
    escapeHtml
  } = ctx;

  function renderSceneReview(brief) {
    const state = ctx.getState();
    const currentSceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    if (enterLiveCounterBeatBeforeScene(brief, currentSceneIndex)) return;
    const review = sceneReviewModel({
      brief,
      index: currentSceneIndex,
      actionDone: (key) => actionDone(brief, key),
      issueBadge: issueCompletion(brief).badge,
      hasDeepFollowup: !nightStructureFor(brief) && !overnightStructureFor(brief) && hasDeepFollowup(brief)
    });
    const { index, scene, done, lastStage, nextStage, nextLabel } = review;
    const sceneForView = sceneWithShownCard(brief, sceneWithCallbackRevision(brief, scene, index));
    const pick = selectedScenePickForState(state, brief, index);
    const dialoguePicks = askedDialoguePicksForState(state, brief, index);
    const completedExchangeHtml = done
      ? `${completedSceneExchangeHtml(completedSceneExchangeForState(state, brief, sceneForView, index, pick))}${respondentTeaseHtml(brief, index)}${hostDisclosureForAnchor(brief, `afterScene:${index + 1}`)}`
      : "";
    frame({
      brief,
      mood: "thinking",
      label: "继续对话",
      chapter: liveChapterTitle(brief),
      text: sceneReviewHtml({
        index,
        displayIndex: Math.max(0, playableSceneIndexes(brief).indexOf(index)),
        done,
        completedExchangeHtml,
        activeExchangeHtml: done ? "" : scenePromptExchangeHtml({ scene: sceneForView, askedCount: dialoguePicks.length }),
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief, { excludeIndex: index }))
      }),
      choices: done
        ? sceneReviewDoneChoicesHtml({ lastStage, nextStage, nextLabel })
        : flowGroupHtml(`<button class="primary" data-open-question-menu type="button">提问</button>`)
    });
    playAudioCueOnce(sceneForView.audioCueId, `${caseKey(brief)}:scene:${index}:${sceneForView.id ?? "beat"}`);
    bind("[data-open-question-menu]", () => openSceneQuestionMenu(brief, index));
    bind("[data-next-scene-stage]", () => continueAfterSceneReview(brief, index));
    bindSceneButtons();
  }

  function renderSceneQuestionMenu(brief) {
    const state = ctx.getState();
    const index = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    const scene = sceneWithShownCard(brief, sceneWithCallbackRevision(brief, brief.sceneVersions?.[index] ?? {}, index));
    const dialoguePicks = askedDialoguePicksForState(state, brief, index);
    if (selectedScenePickForState(state, brief, index)) return closeSceneQuestionMenu(brief);
    frame({
      brief,
      mood: "thinking",
      label: "连线继续",
      chapter: liveChapterTitle(brief),
      text: sceneQuestionMenuHtml(index, scene, dialoguePicks, {
        helper: SCENE_HELPER,
        helperRevealed: Boolean(state.helperHintPicks?.[answerKey(brief, index)])
      }),
      choices: flowGroupHtml(`<button data-close-question-menu type="button">先不问了</button>`)
    });
    bindChoiceActivation("[data-scene-question]", (button) => handleSceneQuestionButton(button));
    bindChoiceActivation("[data-scene-dialogue]", (button) => handleSceneDialogueButton(button));
    bind("[data-scene-helper]", () => revealSceneHelperHint(brief, index, scene));
    bind("[data-close-question-menu]", () => closeSceneQuestionMenu(brief));
    bindSceneButtons();
  }

  function renderSceneQuestionAnswer(brief) {
    const state = ctx.getState();
    const index = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    const focus = sceneQuestionFocusFor(brief, index);
    if (!focus) return closeSceneQuestionMenu(brief);
    const dialoguePicks = askedDialoguePicksForState(state, brief, index);
    const pick = focus.kind === "dialogue"
      ? dialoguePicks.find((item) => Number(item.optionIndex) === Number(focus.optionIndex))
      : selectedScenePickForState(state, brief, index);
    if (!pick?.question || !pick?.answer) return closeSceneQuestionMenu(brief);
    const review = sceneReviewModel({
      brief,
      index,
      actionDone: (key) => actionDone(brief, key),
      issueBadge: issueCompletion(brief).badge,
      hasDeepFollowup: !nightStructureFor(brief) && !overnightStructureFor(brief) && hasDeepFollowup(brief)
    });
    frame({
      brief,
      mood: focus.kind === "key" ? "focused" : "thinking",
      label: "连线继续",
      chapter: liveChapterTitle(brief),
      text: sceneQuestionAnswerHtml({ question: pick.question, answer: pick.answer, lines: pick.lines, resistanceBeat: pick.resistanceBeat }),
      choices: focus.kind === "key"
        ? sceneReviewDoneChoicesHtml({ lastStage: review.lastStage, nextStage: review.nextStage, nextLabel: review.nextLabel })
        : flowGroupHtml(`<button class="primary" data-return-question-menu type="button">继续问</button>`)
    });
    bind("[data-return-question-menu]", () => openSceneQuestionMenu(brief, index));
    bind("[data-next-scene-stage]", () => continueAfterSceneReview(brief, index));
    bindSceneButtons();
  }

  function renderStanceSnapshot(brief) {
    const state = ctx.getState();
    const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    let snapshot = stanceSnapshotForScene(brief, sceneIndex, (key) => actionDone(brief, key));
    const pick = stanceSnapshotPickForState(brief);
    if (!snapshot && pick && Number(pick.sceneIndex) === Number(sceneIndex)) {
      snapshot = {
        ...(brief.stanceSnapshot ?? {}),
        sceneIndex
      };
    }
    if (!snapshot) {
      state.scene = "sceneReview";
      saveState();
      return renderSceneReview(brief);
    }
    frame({
      brief,
      mood: "thinking",
      label: "立场快照",
      chapter: liveChapterTitle(brief),
      text: `
        ${choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))}
        ${stanceSnapshotHtml(snapshot, pick)}
      `,
      choices: pick
        ? flowGroupHtml(`<button class="primary" data-after-stance-snapshot type="button">${escapeHtml(snapshot.continueLabel ?? "继续听")}</button>`)
        : ""
    });
    document.querySelectorAll("[data-stance-snapshot]").forEach((button) => {
      button.addEventListener("click", () => recordStanceSnapshot(brief, snapshot, Number(button.dataset.stanceSnapshot ?? 0)));
    });
    bind("[data-after-stance-snapshot]", () => {
      state.scene = shouldEnterOvernightHangupAfterScene(brief, snapshot.sceneIndex)
        ? "overnightHangup"
        : shouldEnterHangupAfterScene(brief, snapshot.sceneIndex)
          ? "hangupBeat"
          : "sceneReview";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderHangupBeat(brief) {
    const state = ctx.getState();
    const structure = nightStructureFor(brief);
    if (!structure?.hangup) {
      state.scene = "sceneReview";
      saveState();
      return renderSceneReview(brief);
    }
    frame({
      brief,
      mood: "tense",
      label: "连线挂断",
      chapter: "第一段连线",
      text: hangupBeatHtml(structure.hangup),
      choices: flowGroupHtml(`<button class="primary" data-enter-interlude type="button">切到调查台</button>`),
      audioEnterCueId: structure.hangup.audioCueId
    });
    bind("[data-enter-interlude]", () => {
      updateNight(brief, { segment: "interlude", hangupDone: true });
      state.scene = "interludeDesk";
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderCallerQuestion(brief) {
    const state = ctx.getState();
    const question = overnightCallerQuestionFor(brief);
    const overnight = ensureOvernight(brief);
    if (!question || actionDone(brief, "overnight:callerQuestion") && !overnight.callerQuestionChoiceId) {
      state.scene = nextSceneAfterEvidence({ issueBadge: issueCompletion(brief).badge, hasDeepFollowup: hasDeepFollowup(brief) });
      saveState();
      return render();
    }
    const picked = (question.options ?? []).find((option) => option.id === overnight.callerQuestionChoiceId) ?? null;
    const hostPick = (picked?.hostChoices ?? []).find((option) => option.id === overnight.callerQuestionHostChoiceId) ?? null;
    const earned = new Set(overnight.earnedItems ?? []);
    frame({
      brief,
      mood: "focused",
      label: "她的那一问",
      chapter: liveChapterTitle(brief),
      text: `
        ${callDialogueHtml([{ role: "caller", text: question.prompt ?? "" }])}
        ${picked ? callDialogueHtml([
          { role: "host", text: picked.label ?? "" },
          ...(picked.lines ?? (picked.callerLine ? [{ role: "caller", text: picked.callerLine }] : [])),
          ...(hostPick?.silent ? [] : hostPick ? [{ role: "host", text: hostPick.label ?? "" }] : []),
          ...(hostPick?.lines ?? [])
        ]) : ""}
      `,
      choices: picked && (picked.hostChoices ?? []).length && !hostPick
        ? choiceGroupHtml("你怎么接", (picked.hostChoices ?? []).map((option) => `<button class="decision-choice" data-caller-question-host="${escapeHtml(option.id ?? "")}" type="button">${choiceButtonBodyHtml(option.label ?? "", CHOICE_COST_META.nonScoredReply)}</button>`).join(""), "single-choice-group", "不判对错，只记下你怎么接住这次迁怒")
        : picked
        ? flowGroupHtml(`<button class="primary" data-after-caller-question type="button">再深入一句</button>`)
        : choiceGroupHtml("你先回应", (question.options ?? []).map((option) => {
            const locked = option.requiresEarnedItem && !earned.has(option.requiresEarnedItem);
            return `<button class="decision-choice" data-caller-question="${escapeHtml(option.id ?? "")}" ${locked ? "disabled" : ""} type="button">${choiceButtonBodyHtml(option.label ?? "", locked ? `缺少：${option.requiresEarnedItem}` : CHOICE_COST_META.nonScoredReply)}</button>`;
          }).join(""), "single-choice-group", "不判对错，只留下余味")
    });
    bind("[data-caller-question]", (event) => recordCallerQuestionChoice(brief, event.currentTarget?.getAttribute("data-caller-question") ?? ""));
    bind("[data-caller-question-host]", (event) => recordCallerQuestionHostChoice(brief, event.currentTarget?.getAttribute("data-caller-question-host") ?? ""));
    bind("[data-after-caller-question]", () => {
      state.scene = nextSceneAfterEvidence({ issueBadge: issueCompletion(brief).badge, hasDeepFollowup: hasDeepFollowup(brief) });
      saveState();
      render();
    });
    bindSceneButtons();
  }

  function renderDeepFollowup(brief) {
    const state = ctx.getState();
    const issue = issueCompletion(brief);
    if (!issue.badge || !hasDeepFollowup(brief)) {
      state.scene = "accusation";
      saveState();
      return renderAccusation(brief);
    }
    const followup = deepFollowupFor(brief, issue);
    frame({
      brief,
      mood: "focused",
      label: "深入一问",
      chapter: liveChapterTitle(brief),
      text: `
        ${hostDisclosureForAnchor(brief, "beforeDeepFollowup")}
        ${callDialogueHtml([
          { role: "host", text: followup.question },
          ...(followup.resistanceBeat?.lines ?? []),
          { role: "caller", text: followup.answer }
        ])}
        <p class="hint">${escapeHtml(followup.note)}</p>
      `,
      choices: flowGroupHtml(`<button class="primary" data-scene="accusation" type="button">选一句往下追</button>`)
    });
    bindSceneButtons();
  }

  function renderPatienceLost(brief) {
    frame({
      brief,
      mood: "tense",
      label: "这通断了",
      chapter: liveChapterTitle(brief),
      text: `
        ${callDialogueHtml([
          { role: "host", text: "停一下，这里接乱了。" },
          { role: "caller", text: "嗯，我刚才也乱了。我们从前面那句重新说吧。" }
        ])}
        <p class="hint">这案还没收住。回到刚才那一步重新接。</p>
      `,
      choices: flowGroupHtml(`
        <button class="primary" data-retry-lost-step type="button">从这句重来</button>
        <button data-action="title" type="button">回标题</button>
      `)
    });
    bind("[data-retry-lost-step]", () => retryPatienceLostStep(brief));
    bindSceneButtons();
  }

  function renderAccusation(brief) {
    const state = ctx.getState();
    const readiness = accusationReadinessForBrief(brief);
    if (!readiness.ready) {
      state.lastReaction = readiness.message;
      state.scene = "sceneReview";
      state.dialogueProgress = {
        ...(state.dialogueProgress ?? {}),
        [`${caseKey(brief)}:sceneReview`]: firstUnansweredSceneIndex(brief)
      };
      saveState();
      return render();
    }
    const choices = dailyAccusationChoices(brief).filter((choice) => {
      if (!choice.requiresRevisedSceneId) return true;
      const sourceScene = (brief.sceneVersions ?? []).find((scene) => scene.id === choice.requiresRevisedSceneId);
      return Boolean(sourceScene?.revisedVersion && sceneRevisionUnlocked(brief, sourceScene.revisedVersionTriggers ?? {}));
    });
    frame({
      brief,
      mood: "tense",
      label: "收住话头",
      chapter: liveChapterTitle(brief),
      text: `
        <p><b>选一句往下追</b></p>
        <p>下面哪句最该继续追？</p>
        ${choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))}
      `,
      choices: choiceGroupHtml("往下追", choices.map((choice) => `<button class="decision-choice" data-accuse="${escapeHtml(choice.accuse)}" data-accuse-label="${escapeHtml(choice.label)}" data-accuse-response="${escapeHtml(choice.response ?? "")}" type="button">${choiceButtonBodyHtml(choice.label, CHOICE_COST_META.finalQuestion)}</button>`).join(""), "single-choice-group", "从刚才听到的话里选一句")
    });
    document.querySelectorAll("[data-accuse]").forEach((button) => {
      button.addEventListener("click", () => resolveAccusationFromButton(brief, button));
    });
    bindSceneButtons();
  }

  function bindSceneButtons() {
    document.querySelectorAll("[data-scene]").forEach((button) => {
      button.addEventListener("click", () => moveScene(button.dataset.scene));
    });
  }

  function handleSceneQuestionButton(button) {
    const state = ctx.getState();
    const [sceneIndex, optionIndex] = button.dataset.sceneQuestion.split(":").map(Number);
    const { brief, scene, options } = sceneChoiceContext(sceneIndex);
    const option = options[optionIndex] ?? options[0];
    if (!brief || !option) return;
    const answerVariant = pressuredAnswerVariant(option, { pressureSignal: state.lastPressureSignal ?? "" });
    const answer = answerVariant.answer;
    markAction(brief, `sceneQuestion:${sceneIndex}:${optionIndex}`, { spend: !option.contradiction });
    markAction(brief, `version:${sceneIndex}`);
    if (option.contradiction) {
      recordContradiction(brief, option.contradiction);
      recordContradiction(brief, scene.contradiction);
    }
    else {
      state.lastReaction = questionPressureReaction({ ...option, answer }, option.routeTone ?? routeToneForChoice(option));
      state.lastPressureSignal = questionPressureSignal(option, option.routeTone ?? routeToneForChoice(option));
    }
    state.lastPressureAxis = option.routeAxis ?? routeAxisForChoice(option, scene);
    state.sceneAnswers = {
      ...(state.sceneAnswers ?? {}),
      [answerKey(brief, sceneIndex)]: answer
    };
    state.sceneQuestionPicks = {
      ...(state.sceneQuestionPicks ?? {}),
      [answerKey(brief, sceneIndex)]: {
        question: option.question ?? "",
        suspicionLabel: option.suspicionLabel ?? "",
        revealTransition: option.revealTransition ?? null,
        answer,
        contradiction: option.contradiction ?? "",
        routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
        routeTone: option.routeTone ?? routeToneForChoice(option),
        correct: Boolean(option.contradiction),
        guarded: answerVariant.guarded || Boolean(option.forcedGuardedAnswer),
        resistanceBeat: option.resistanceBeat ?? null
      }
    };
    recordRouteChoice(brief, sceneIndex, option, scene);
    if (audiencePatienceLost(brief, {
      area: "sceneReview",
      index: sceneIndex,
      actionKeys: [`sceneQuestion:${sceneIndex}:${optionIndex}`, `version:${sceneIndex}`],
      answerKey: answerKey(brief, sceneIndex),
      routeIndex: sceneIndex,
      spent: !option.contradiction,
      removeQuestionPick: true
    })) return;
    state.sceneQuestionFocus = { caseId: caseKey(brief), sceneIndex, kind: "key", optionIndex };
    state.scene = "sceneQuestionAnswer";
    saveState();
    render();
  }

  function revealSceneHelperHint(brief, sceneIndex, scene = {}) {
    const state = ctx.getState();
    if (!SCENE_HELPER?.id || !String(scene.helperHint ?? "").trim()) return;
    const key = answerKey(brief, sceneIndex);
    state.helperHintPicks = {
      ...(state.helperHintPicks ?? {}),
      [key]: {
        helperId: SCENE_HELPER.id,
        revealed: true
      }
    };
    saveState();
    render();
  }

  function handleSceneDialogueButton(button) {
    const state = ctx.getState();
    const [sceneIndex, optionIndex] = button.dataset.sceneDialogue.split(":").map(Number);
    const { brief, scene, options } = sceneChoiceContext(sceneIndex);
    const dialogueRows = sceneDialogueOptions(scene, options);
    const option = dialogueRows[optionIndex]?.option ?? null;
    if (!brief || !option) return;
    const key = answerKey(brief, sceneIndex);
    const current = state.sceneDialoguePicks?.[key] ?? [];
    if (current.some((pick) => Number(pick.optionIndex) === Number(optionIndex))) return;
    const answerVariant = pressuredAnswerVariant(option, { pressureSignal: state.lastPressureSignal ?? "" });
    state.sceneDialoguePicks = {
      ...(state.sceneDialoguePicks ?? {}),
      [key]: [
        ...current,
        {
          optionIndex,
          question: option.question ?? "",
          answer: answerVariant.answer,
          lines: answerVariant.guarded ? null : option.lines ?? null,
          routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
          routeTone: option.routeTone ?? routeToneForChoice(option),
          guarded: answerVariant.guarded
        }
      ]
    };
    state.lastReaction = questionPressureReaction({ ...option, answer: answerVariant.answer }, option.routeTone ?? routeToneForChoice(option));
    state.lastPressureSignal = questionPressureSignal(option, option.routeTone ?? routeToneForChoice(option));
    state.lastPressureAxis = option.routeAxis ?? routeAxisForChoice(option, scene);
    state.sceneQuestionFocus = { caseId: caseKey(brief), sceneIndex, kind: "dialogue", optionIndex };
    state.scene = "sceneQuestionAnswer";
    saveState();
    render();
  }

  function openSceneQuestionMenu(brief, sceneIndex) {
    const state = ctx.getState();
    state.sceneQuestionFocus = null;
    state.scene = "sceneQuestionMenu";
    setIndexValue(brief, "sceneReview", sceneIndex);
    saveState();
    render();
  }

  function closeSceneQuestionMenu(brief) {
    const state = ctx.getState();
    state.sceneQuestionFocus = null;
    state.scene = "sceneReview";
    saveState();
    render();
  }

  function sceneQuestionFocusFor(brief, sceneIndex) {
    const state = ctx.getState();
    const focus = state.sceneQuestionFocus;
    if (!focus || focus.caseId !== caseKey(brief) || Number(focus.sceneIndex) !== Number(sceneIndex)) return null;
    return focus;
  }

  function sceneChoiceContext(sceneIndex) {
    const brief = activeCaseBrief();
    const scene = sceneWithCallbackRevision(brief, brief?.sceneVersions?.[sceneIndex] ?? {}, sceneIndex);
    return {
      brief,
      scene,
      options: focusedQuestionOptions(scene.questionOptions ?? [])
    };
  }

  function recordStanceSnapshot(brief, snapshot = {}, optionIndex = 0) {
    const state = ctx.getState();
    const option = snapshot.options?.[optionIndex] ?? snapshot.options?.[0] ?? null;
    if (!option) return;
    const key = caseKey(brief);
    state.stanceSnapshots = {
      ...(state.stanceSnapshots ?? {}),
      [key]: {
        sceneIndex: snapshot.sceneIndex,
        optionIndex,
        id: option.id ?? String(optionIndex),
        label: option.label ?? "",
        summary: option.summary ?? "",
        feedback: option.feedback ?? "",
        recap: option.recap ?? snapshot.recap ?? "",
        at: Date.now()
      }
    };
    markAction(brief, `stanceSnapshot:${snapshot.sceneIndex}`);
    state.lastReaction = null;
    saveState();
    render();
  }

  function continueAfterSceneReview(brief, sceneIndex = 0) {
    const state = ctx.getState();
    state.sceneQuestionFocus = null;
    if (enterLiveCounterBeatAfterScene(brief, sceneIndex)) return;
    if (shouldEnterOvernightHangupAfterScene(brief, sceneIndex)) {
      state.scene = "overnightHangup";
      saveState();
      render();
      return;
    }
    if (shouldEnterHangupAfterScene(brief, sceneIndex)) {
      state.scene = "hangupBeat";
      saveState();
      render();
      return;
    }
    const nextIndex = nextPlayableSceneIndex(brief, sceneIndex);
    if (nextIndex >= 0) setIndex(brief, "sceneReview", nextIndex);
    else moveScene("accusation");
  }

  function recordCallerQuestionChoice(brief, choiceId = "") {
    const question = overnightCallerQuestionFor(brief);
    const choice = (question?.options ?? []).find((option) => option.id === choiceId);
    const overnight = ensureOvernight(brief);
    if (!choice) return;
    if (choice.requiresEarnedItem && !(overnight.earnedItems ?? []).includes(choice.requiresEarnedItem)) return;
    updateOvernight(brief, { callerQuestionChoiceId: choice.id, callerQuestionHostChoiceId: null, callerQuestionStanceNudge: null });
    if ((choice.hostChoices ?? []).length) {
      saveState();
      return render();
    }
    completeCallerQuestionChoice(brief, question, choice);
  }

  function recordCallerQuestionHostChoice(brief, hostChoiceId = "") {
    const question = overnightCallerQuestionFor(brief);
    const overnight = ensureOvernight(brief);
    const choice = (question?.options ?? []).find((option) => option.id === overnight.callerQuestionChoiceId);
    const hostChoice = (choice?.hostChoices ?? []).find((option) => option.id === hostChoiceId);
    if (!choice || !hostChoice) return;
    updateOvernight(brief, {
      callerQuestionHostChoiceId: hostChoice.id,
      callerQuestionStanceNudge: hostChoice.stanceNudge ?? null
    });
    completeCallerQuestionChoice(brief, question, choice, hostChoice);
  }

  function completeCallerQuestionChoice(brief, question = {}, choice = {}, hostChoice = null) {
    const state = ctx.getState();
    markAction(brief, "overnight:callerQuestion");
    recordRouteChoice(brief, keyQuestionLimit(brief) + evidenceChecksFor(brief).length + 0.8, {
      question: question.prompt ?? "她的那一问",
      answer: [choice.label, hostChoice?.label].filter(Boolean).join(" / "),
      routeAxis: choice.routeAxis ?? "process-control",
      routeTone: hostChoice?.routeTone ?? "caller-question",
      stanceNudge: hostChoice?.stanceNudge ?? null
    }, { version: question.prompt ?? "" });
    state.lastReaction = choice.aftertaste ?? "";
    saveState();
    render();
  }

  return {
    renderSceneReview,
    renderSceneQuestionMenu,
    renderSceneQuestionAnswer,
    renderStanceSnapshot,
    renderHangupBeat,
    renderCallerQuestion,
    renderDeepFollowup,
    renderPatienceLost,
    renderAccusation,
    bindSceneButtons
  };
}
