import { resolveCommit } from "../../runtime/stateCommit.js";
import {
  normalizeStatementPatience,
  resetStatementPatience,
  sceneUsesLineReplay,
  spendStatementPatience,
  statementMissReactionForOption,
  statementLinesFromText,
  statementNightKey,
  statementNightPatienceMax,
  statementNoClueReactionFor,
  statementPressureFor,
  statementReactionDisplayText,
  statementStageForScene,
  statementStageProgress
} from "../../runtime/statementReviewModel.js";
import {
  statementPatienceLostHtml,
  statementReplayPageChoicesHtml,
  statementReplayPageHtml,
  statementReplayLineForScene,
  statementReplayOptionIndex
} from "../statementReviewView.js";
import { nextQuestionPressureSignal } from "../../runtime/livePressure.js";
import { resetDecisivePresentProgress } from "../../runtime/decisivePresentModel.js";
import { completedChoicePrefix, nextSequentialChoice, sceneQuestionSequence } from "../../runtime/sequentialChoices.js";
import { callerQuestionProgress, advanceCallerQuestion } from "../../runtime/callerQuestionSequence.js";

export function createSceneQuestionFlow(ctx, scope) {
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
    afterSceneEvidenceFor,
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
    sceneQuestionChoicesHtml,
    completedSceneExchangeHtml,
    scenePromptExchangeHtml,
    statementStagePromptExchangeHtml,
    sceneQuestionAnswerHtml,
    sceneReviewDoneChoicesHtml,
    sceneReviewHtml,
    stanceSnapshotHtml,
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
    consumePixelTransition,
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
  const commit = resolveCommit(ctx);

  function renderSceneQuestionMenu(brief) {
    // One-release compatibility for saves captured on the retired question-menu route.
    closeSceneQuestionMenu(brief);
  }

  function renderSceneQuestionAnswer(brief) {
    const state = ctx.getState();
    const index = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    const focus = sceneQuestionFocusFor(brief, index);
    if (!focus) return closeSceneQuestionMenu(brief);
    const scene = sceneWithShownCard(brief, sceneWithCallbackRevision(brief, brief.sceneVersions?.[index] ?? {}, index));
    const dialoguePicks = askedDialoguePicksForState(state, brief, index);
    const pick = focus.kind === "probe" ? focus.pick : focus.kind === "dialogue"
      ? dialoguePicks.find((item) => Number(item.optionIndex) === Number(focus.optionIndex))
      : selectedScenePickForState(state, brief, index);
    if (!pick?.question || (!pick?.answer && !pick?.lines?.length)) return closeSceneQuestionMenu(brief);
    const sequence = sceneQuestionSequence(scene);
    const nextQuestion = focus.kind === "key" && sequence.length ? nextSequentialChoice(sequence, pick.completedOptionIds) : null;
    const stageContext = sceneUsesLineReplay(scene) ? scope.statementStageContext(brief, index) : null;
    const stageComplete = !focus.pendingPenalty && Boolean(stageContext?.progress.complete);
    const reviewIndex = stageComplete ? stageContext.stage.endIndex : index;
    const review = sceneReviewModel({
      brief,
      index: reviewIndex,
      actionDone: (key) => actionDone(brief, key),
      issueBadge: issueCompletion(brief).badge,
      overnight: ensureOvernight(brief),
      hasDeepFollowup: !nightStructureFor(brief) && !overnightStructureFor(brief) && hasDeepFollowup(brief)
    });
    frame({
      brief,
      mood: focus.kind === "key" ? "focused" : "thinking",
      label: "连线继续",
      chapter: liveChapterTitle(brief),
      pixelTransition: null,
      screenClass: focus.kind === "key" && sceneUsesLineReplay(scene) ? "dialogue-mode-interrupt" : "",
      controlMode: focus.kind === "key" && sceneUsesLineReplay(scene) ? "interrupt" : "listen",
      pressureOverride: focus.kind === "key" && sceneUsesLineReplay(scene) ? scope.statementPressure(brief, index, "interrupt") : null,
      musicPhase: "",
      text: `${sceneQuestionAnswerHtml({
        question: pick.question,
        answer: pick.answer,
        lines: pick.lines,
        resistanceBeat: pick.resistanceBeat,
        reactionLine: pick.reactionLine,
        sceneCloser: focus.kind === "key" && !nextQuestion ? scene.sceneCloser : null
      })}${focus.kind === "key" && !nextQuestion ? `${respondentTeaseHtml(brief, index)}${hostDisclosureForAnchor(brief, `afterScene:${index + 1}`)}` : ""}`,
      choices: nextQuestion
        ? flowGroupHtml(`<button class="primary" data-scene-open-replay type="button">${brief.dialoguePresentation?.focusedInquiry ? '继续问' : '继续逐句回放'}</button>`)
        : focus.pendingPenalty
        ? flowGroupHtml('<button class="primary" data-finish-question type="button">继续</button>')
        : stageComplete
        ? sceneReviewDoneChoicesHtml({ lastStage: review.lastStage, nextStage: review.nextStage, nextLabel: review.nextLabel })
        : sceneUsesLineReplay(scene)
          ? flowGroupHtml(`<button class="primary" data-scene-open-replay type="button">${brief.dialoguePresentation?.focusedInquiry ? '继续问清这一段' : '回到刚才那段'}</button>`)
        : flowGroupHtml(sceneQuestionChoicesHtml(index, scene, dialoguePicks))
    });
    bind("[data-finish-question]", () => finishQuestionPenalty(brief, index, focus));
    bindChoiceActivation("[data-scene-question]", (button) => handleSceneQuestionButton(button));
    bindChoiceActivation("[data-scene-dialogue]", (button) => handleSceneDialogueButton(button));
    bind("[data-scene-open-replay]", () => scope.openSceneLineReplay(brief, index));
    bind("[data-next-scene-stage]", () => scope.continueAfterSceneReview(brief, reviewIndex));
    scope.bindSceneButtons();
  }

  function handleSceneReviewLine(button, brief) {
    const state = ctx.getState();
    const sceneIndex = Number(button.dataset.sceneReviewIndex ?? currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1));
    const scene = sceneWithShownCard(brief, sceneWithCallbackRevision(brief, brief.sceneVersions?.[sceneIndex] ?? {}, sceneIndex));
    const lineId = button.dataset.sceneReviewLine ?? "";
    const line = statementReplayLineForScene(scene, lineId);
    const key = answerKey(brief, sceneIndex);
    state.activeStatementLineId = lineId;
    const sequence = sceneQuestionSequence(scene);
    const next = nextSequentialChoice(sequence, selectedScenePickForState(state, brief, sceneIndex)?.completedOptionIds);
    const optionIndex = statementReplayOptionIndex(scene, line, next?.id);
    if (optionIndex >= 0 && !actionDone(brief, `version:${sceneIndex}`)
      && (!sequence.length || scene.questionOptions[optionIndex].id === next?.id)) {
      saveState();
      return handleSceneQuestionButton({ dataset: { sceneQuestion: `${sceneIndex}:${optionIndex}` } });
    }
    if (!line) return;
    const repeated = (state.statementReviewAttempts?.[key] ?? []).includes(lineId);
    const probe = (scene.reviewProbes ?? []).find((item) => line.text.includes(item.sourceAnchor));
    const resolvedOption = optionIndex >= 0 && (actionDone(brief, `version:${sceneIndex}`)
      || selectedScenePickForState(state, brief, sceneIndex)?.completedOptionIds?.includes(scene.questionOptions[optionIndex].id))
      ? scene.questionOptions[optionIndex] : null;
    state.sceneQuestionFocus = {
      caseId: caseKey(brief), sceneIndex, kind: "probe", lineId, sceneId: scene.id,
      probeId: resolvedOption ? null : probe?.id,
      resolvedOptionId: resolvedOption?.id ?? null,
      pendingPenalty: resolvedOption || probe?.keyChoice || repeated || !probe ? null : "statement",
      pick: {
        question: resolvedOption?.question ?? probe?.question ?? "嗯，你接着说。",
        answer: resolvedOption?.answer ?? probe?.answer ?? statementNoClueReactionFor(scene).text,
        lines: resolvedOption?.lines ?? probe?.lines
      }
    };
    if (probe?.keyChoice) {
      state.statementReviewAttempts = { ...(state.statementReviewAttempts ?? {}), [key]: [...(state.statementReviewAttempts?.[key] ?? []), lineId] };
    }
    state.scene = "sceneQuestionAnswer";
    setIndexValue(brief, "sceneReview", sceneIndex);
    saveState();
    render();
  }

  function finishQuestionPenalty(brief, sceneIndex, focus) {
    const state = ctx.getState();
    if (!focus.pendingPenalty) return;
    if (brief.dialoguePresentation?.focusedInquiry) {
      focus.pendingPenalty = null;
      state.lastReaction = null; state.lastPressureSignal = null;
      return scope.openSceneLineReplay(brief, sceneIndex);
    }
    const kind = focus.pendingPenalty;
    // Clear the saved debt before navigating: reload/double click must not charge twice.
    focus.pendingPenalty = null;
    if (kind === "statement" || kind === "statement-key") {
      const key = answerKey(brief, sceneIndex);
      const attempted = state.statementReviewAttempts?.[key] ?? [];
      if (kind === "statement-key" ? !actionDone(brief, `sceneQuestion:${sceneIndex}:${focus.optionIndex}`) : !attempted.includes(focus.lineId)) {
        if (kind === "statement-key") markAction(brief, `sceneQuestion:${sceneIndex}:${focus.optionIndex}`);
        else state.statementReviewAttempts = { ...(state.statementReviewAttempts ?? {}), [key]: [...attempted, focus.lineId] };
        const patienceKey = scope.statementPatienceKey(brief, sceneIndex);
        const next = spendStatementPatience(state.statementPatience?.[patienceKey], scope.statementPatienceMax(brief, sceneIndex));
        state.statementPatience = { ...(state.statementPatience ?? {}), [patienceKey]: next };
        state.lastScreenEffect = "patience-drop";
        state.lastPressureSignal = "drift";
        state.lastReaction = "这句没问下去，耐心 −1。";
        const stageComplete = scope.statementStageContext(brief, sceneIndex)?.progress.complete;
        state.scene = next.remaining <= 0 && !stageComplete && !brief.dialoguePresentation?.focusedInquiry ? "statementPatienceLost" : kind === "statement-key" ? "sceneQuestionAnswer" : "sceneLineReplay";
      }
    } else {
      markAction(brief, `sceneQuestion:${sceneIndex}:${focus.optionIndex}`, { spend: true });
      if (audiencePatienceLost(brief, {
        area: "sceneReview", index: sceneIndex,
        actionKeys: [`sceneQuestion:${sceneIndex}:${focus.optionIndex}`, `version:${sceneIndex}`],
        answerKey: answerKey(brief, sceneIndex), routeIndex: sceneIndex,
        spent: true, removeQuestionPick: true
      })) return;
      state.lastScreenEffect = "patience-drop";
      state.lastReaction = "这句没问下去，耐心 −1。";
    }
    saveState();
    render();
  }

  function renderStatementPatienceLost(brief) {
    const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    if (brief.dialoguePresentation?.focusedInquiry) return retryStatementReview(brief, sceneIndex);
    frame({
      brief,
      mood: "tense",
      label: "线路发散",
      chapter: liveChapterTitle(brief),
      text: statementPatienceLostHtml(),
      choices: flowGroupHtml('<button class="primary" data-retry-statement type="button">重新听这段</button>'),
      screenClass: "dialogue-mode-replay statement-patience-empty",
      controlMode: "replay",
      pressureOverride: scope.statementPressure(brief, sceneIndex, "replay")
    });
    bind("[data-retry-statement]", () => retryStatementReview(brief, sceneIndex));
    scope.bindSceneButtons();
  }

  function retryStatementReview(brief, sceneIndex) {
    const stage = statementStageForScene(brief, sceneIndex);
    const patienceKey = scope.statementPatienceKey(brief, sceneIndex);
    const patienceReset = resetStatementPatience(scope.statementPatienceMax(brief, sceneIndex));
    commit((state) => {
      state.statementPatience = { ...(state.statementPatience ?? {}), [patienceKey]: patienceReset };
      state.statementReviewAttempts = { ...(state.statementReviewAttempts ?? {}) };
      for (const stageSceneIndex of stage?.sceneIndexes ?? [sceneIndex]) {
        state.statementReviewAttempts[answerKey(brief, stageSceneIndex)] = [];
      }
      state.activeStatementLineId = null;
      state.lastScreenEffect = null;
      state.scene = "sceneLineReplay";
    });
  }

  function handleSceneQuestionButton(button) {
    const state = ctx.getState();
    const [sceneIndex, optionIndex] = button.dataset.sceneQuestion.split(":").map(Number);
    const { brief, scene, options } = sceneChoiceContext(sceneIndex);
    const option = options[optionIndex] ?? options[0];
    if (!brief || !option) return;
    setIndexValue(brief, "sceneReview", sceneIndex);
    const answerVariant = pressuredAnswerVariant(option, { pressureSignal: nextQuestionPressureSignal(state) });
    const missReaction = option.correct === false ? statementMissReactionForOption(option) : null;
    state.pendingQuestionPressureSignal = null;
    state.pendingQuestionPressureSource = null;
    const answer = missReaction?.text || answerVariant.answer;
    const sequence = sceneQuestionSequence(scene);
    const previousPick = selectedScenePickForState(state, brief, sceneIndex);
    const focusedCorrect = option.correct === true || Boolean(option.contradiction);
    if (sequence.length && (!brief.dialoguePresentation?.focusedInquiry || focusedCorrect) && option.id !== nextSequentialChoice(sequence, previousPick?.completedOptionIds)?.id) return;
    const completedOptionIds = sequence.length ? [...completedChoicePrefix(sequence, previousPick?.completedOptionIds), ...(brief.dialoguePresentation?.focusedInquiry && !focusedCorrect ? [] : [option.id])] : [];
    if (option.contradiction) markAction(brief, `sceneQuestion:${sceneIndex}:${optionIndex}`);
    if ((!brief.dialoguePresentation?.focusedInquiry || focusedCorrect) && (!sequence.length || !nextSequentialChoice(sequence, completedOptionIds))) markAction(brief, `version:${sceneIndex}`);
    if (option.contradiction) {
      recordContradiction(brief, option.contradiction);
      recordContradiction(brief, scene.contradiction);
    }
    else {
      state.lastReaction = null;
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
        optionIndex, optionId: option.id, sceneId: scene.id, completedOptionIds,
        question: option.question ?? "",
        suspicionLabel: option.suspicionLabel ?? "",
        revealTransition: option.revealTransition ?? null,
        answer,
        contradiction: option.contradiction ?? "",
        routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
        routeTone: option.routeTone ?? routeToneForChoice(option),
        correct: Boolean(option.correct || option.contradiction),
        guarded: Boolean(missReaction?.text) || answerVariant.guarded || Boolean(option.forcedGuardedAnswer),
        resistanceBeat: option.resistanceBeat ?? null,
        lines: missReaction?.text || answerVariant.guarded ? null : option.lines ?? null,
        reactionLine: missReaction?.text ? "" : option.reactionLine ?? "",
        sceneVersionKind: scene.version === brief.sceneVersions?.[sceneIndex]?.revisedVersion ? "revised" : "base"
      }
    };
    recordRouteChoice(brief, sceneIndex, option, scene);
    commit((state) => {
      state.sceneQuestionFocus = {
      caseId: caseKey(brief), sceneIndex, kind: "key", optionIndex, sceneId: scene.id, optionId: option.id,
      pendingPenalty: option.correct || option.contradiction || actionDone(brief, `sceneQuestion:${sceneIndex}:${optionIndex}`) ? null : sceneUsesLineReplay(scene) ? "statement-key" : "question"
    };
      state.scene = "sceneQuestionAnswer";
    });
  }

  function handleSceneDialogueButton(button) {
    const state = ctx.getState();
    const [sceneIndex, optionIndex] = button.dataset.sceneDialogue.split(":").map(Number);
    const { brief, scene, options } = sceneChoiceContext(sceneIndex);
    if (sceneUsesLineReplay(scene) && button.dataset.sceneReplayDialogue !== "true") return;
    const dialogueRows = sceneDialogueOptions(scene, options);
    const option = dialogueRows[optionIndex]?.option ?? null;
    if (!brief || !option) return;
    setIndexValue(brief, "sceneReview", sceneIndex);
    const key = answerKey(brief, sceneIndex);
    const current = state.sceneDialoguePicks?.[key] ?? [];
    if (current.some((pick) => Number(pick.optionIndex) === Number(optionIndex))) return;
    const answerVariant = pressuredAnswerVariant(option, { pressureSignal: nextQuestionPressureSignal(state) });
    commit((state) => {
      state.pendingQuestionPressureSignal = null;
      state.pendingQuestionPressureSource = null;
      state.sceneDialoguePicks = {
      ...(state.sceneDialoguePicks ?? {}),
      [key]: [
        ...current,
        {
          optionIndex, optionId: option.id, sceneId: scene.id,
          question: option.question ?? "",
          answer: answerVariant.answer,
          lines: answerVariant.guarded ? null : option.lines ?? null,
          routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
          routeTone: option.routeTone ?? routeToneForChoice(option),
          guarded: answerVariant.guarded,
          sceneVersionKind: scene.version === brief.sceneVersions?.[sceneIndex]?.revisedVersion ? "revised" : "base"
        }
      ]
    };
      state.lastReaction = questionPressureReaction({ ...option, answer: answerVariant.answer }, option.routeTone ?? routeToneForChoice(option));
      state.lastPressureSignal = questionPressureSignal(option, option.routeTone ?? routeToneForChoice(option));
      state.lastPressureAxis = option.routeAxis ?? routeAxisForChoice(option, scene);
      state.sceneQuestionFocus = { caseId: caseKey(brief), sceneIndex, kind: "dialogue", optionIndex, sceneId: scene.id, optionId: option.id };
      state.scene = "sceneQuestionAnswer";
    });
  }

  function closeSceneQuestionMenu(brief) {
    const state = ctx.getState();
    const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    commit((state) => {
      state.sceneQuestionFocus = null;
      state.scene = statementStageForScene(brief, sceneIndex) ? "sceneLineReplay" : "sceneReview";
    });
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
  return {
    renderSceneQuestionMenu,
    renderSceneQuestionAnswer,
    handleSceneReviewLine,
    finishQuestionPenalty,
    renderStatementPatienceLost,
    retryStatementReview,
    handleSceneQuestionButton,
    handleSceneDialogueButton,
    closeSceneQuestionMenu,
    sceneQuestionFocusFor,
    sceneChoiceContext
  };
}
