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

export function createStatementReplayFlow(ctx, scope) {
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

  function renderStatementStageReview(brief, currentSceneIndex) {
    const state = ctx.getState();
    const context = statementStageContext(brief, currentSceneIndex);
    if (!context) return;
    if (context.progress.started && !context.progress.complete) {
      state.scene = "sceneLineReplay";
      saveState();
      return renderSceneLineReplay(brief);
    }
    if (context.progress.complete && brief.dialoguePresentation?.focusedInquiry) return scope.continueAfterSceneReview(brief, context.stage.endIndex);
    const review = sceneReviewModel({
      brief,
      index: context.stage.endIndex,
      actionDone: (key) => actionDone(brief, key),
      issueBadge: issueCompletion(brief).badge,
      overnight: ensureOvernight(brief),
      hasDeepFollowup: !nightStructureFor(brief) && !overnightStructureFor(brief) && hasDeepFollowup(brief)
    });
    const completedExchangeHtml = context.progress.complete && brief.dialoguePresentation?.focusedInquiry
      ? '<p>这一段已经问清。</p>'
      : context.progress.complete
      ? context.entries.map(({ scene, sceneIndex }) => {
          const pick = selectedScenePickForState(state, brief, sceneIndex);
          return `${completedSceneExchangeHtml(completedSceneExchangeForState(state, brief, scene, sceneIndex, pick))}${respondentTeaseHtml(brief, sceneIndex)}${hostDisclosureForAnchor(brief, `afterScene:${sceneIndex + 1}`)}`;
        }).join("")
      : "";
    frame({
      brief,
      mood: "thinking",
      label: context.progress.complete ? "这一段问完了" : "听完这段",
      chapter: liveChapterTitle(brief),
      screenClass: "dialogue-mode-listen statement-stage-listen",
      controlMode: "listen",
      pressureOverride: statementPressure(brief, context.stage.startIndex, "listen"),
      pixelTransition: null,
      text: sceneReviewHtml({
        index: context.stage.startIndex,
        displayIndex: Math.max(0, playableSceneIndexes(brief).indexOf(context.stage.startIndex)),
        done: context.progress.complete,
        completedExchangeHtml,
        activeExchangeHtml: context.progress.complete ? "" : statementStagePromptExchangeHtml({ entries: context.entries }),
        reviewHtml: context.progress.complete ? "" : choiceReviewHtml(latestChoiceReviewRowsForState(state, brief, { excludeIndex: context.stage.startIndex }))
      }),
      choices: context.progress.complete
        ? sceneReviewDoneChoicesHtml({ lastStage: review.lastStage, nextStage: review.nextStage, nextLabel: review.nextLabel })
        : flowGroupHtml(`<button class="primary" data-scene-open-replay type="button">${brief.dialoguePresentation?.focusedInquiry ? "继续" : context.entries.length > 1 ? "回放刚才几段" : "回放刚才这段"}</button>`)
    });
    const firstEntry = context.entries[0];
    playAudioCueOnce(firstEntry?.scene?.audioCueId, `${caseKey(brief)}:stage:${context.stage.id}`);
    bind("[data-scene-open-replay]", () => openSceneLineReplay(brief, context.stage.startIndex, { reset: true }));
    bind("[data-next-scene-stage]", () => scope.continueAfterSceneReview(brief, context.stage.endIndex));
    scope.bindSceneButtons();
  }

  function openSceneLineReplay(brief, sceneIndex, { reset = false } = {}) {
    const state = ctx.getState();
    const stage = statementStageForScene(brief, sceneIndex);
    const targetIndex = reset ? (stage?.startIndex ?? sceneIndex) : sceneIndex;
    setIndexValue(brief, "sceneReview", targetIndex);
    state.scene = "sceneLineReplay";
    if (reset || !state.activeStatementLineId) {
      const targetScene = sceneWithShownCard(
        brief,
        sceneWithCallbackRevision(brief, brief.sceneVersions?.[targetIndex] ?? {}, targetIndex)
      );
      state.activeStatementLineId = statementLinesFromText(targetScene.version ?? "", { prefix: targetScene.id ?? `scene-${targetIndex}` })[0]?.id ?? null;
    }
    saveState();
    render();
  }

  function renderSceneLineReplay(brief) {
    const state = ctx.getState();
    const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    const context = statementStageContext(brief, sceneIndex);
    if (!context) {
      state.scene = "sceneReview";
      saveState();
      return scope.renderSceneReview(brief);
    }
    if (brief.dialoguePresentation?.focusedInquiry) return renderFocusedInquiry(brief, context);
    if (state.activeStatementLineId === `${context.stage.id}:end`) {
      const review = sceneReviewModel({ brief, index: context.stage.endIndex,
        actionDone: (key) => actionDone(brief, key), issueBadge: issueCompletion(brief).badge,
        overnight: ensureOvernight(brief), hasDeepFollowup: hasDeepFollowup(brief) });
      frame({ brief, mood: "thinking", label: "本段回放结束", chapter: liveChapterTitle(brief),
        pixelTransition: null, screenClass: "dialogue-mode-replay", controlMode: "replay",
        text: statementReplayPageHtml({ speaker: "回放", line: { text: context.progress.complete
          ? "这一段已经问完。" : "已经听到这段末尾。还有没问完的事情，可以返回查看。" } }),
        choices: context.progress.complete
          ? sceneReviewDoneChoicesHtml({ lastStage: review.lastStage, nextStage: review.nextStage, nextLabel: review.nextLabel })
          : flowGroupHtml('<button class="primary" data-scene-replay-restart type="button">重新查看这段</button><button class="secondary" data-action="title" type="button">保存并回标题</button>') });
      bind("[data-scene-replay-restart]", () => openSceneLineReplay(brief, context.stage.startIndex, { reset: true }));
      bind('[data-action="title"]', ctx.returnToTitle);
      bind("[data-next-scene-stage]", () => scope.continueAfterSceneReview(brief, context.stage.endIndex));
      return;
    }
    const position = statementReplayPosition(brief, context, sceneIndex);
    if (!position) {
      state.scene = "sceneReview";
      saveState();
      return scope.renderSceneReview(brief);
    }
    const attemptedLineIds = state.statementReviewAttempts?.[answerKey(brief, position.sceneIndex)] ?? [];
    const resolvedDialogueOptionIndexes = askedDialoguePicksForState(state, brief, position.sceneIndex)
      .map((pick) => Number(pick.optionIndex));
    const atStageEnd = position.entryIndex === context.entries.length - 1
      && position.lineIndex === position.lines.length - 1;
    frame({
      brief,
      mood: "focused",
      label: context.entries.length > 1
        ? `回放 · 第 ${position.entryIndex + 1} 段`
        : "回放这一段",
      chapter: liveChapterTitle(brief),
      text: statementReplayPageHtml({
        line: position.line,
        speaker: position.scene.speaker ?? "咨询者"
      }),
      choices: statementReplayPageChoicesHtml({
        scene: position.scene,
        sceneIndex: position.sceneIndex,
        line: position.line,
        attempted: attemptedLineIds.includes(position.line.id),
        keyResolved: actionDone(brief, `version:${position.sceneIndex}`),
        completedOptionIds: selectedScenePickForState(state, brief, position.sceneIndex)?.completedOptionIds ?? [],
        resolvedDialogueOptionIndexes,
        stageKeysRemaining: context.progress.unresolvedSceneIndexes.length,
        nextLabel: atStageEnd && !context.progress.complete ? "从前面再听" : "继续回放"
      }),
      screenClass: "dialogue-mode-replay",
      controlMode: "replay",
      musicPhase: "",
      pressureOverride: statementPressure(brief, context.stage.startIndex, "replay"),
      pixelTransition: position.lineIndex === 0 ? statementPhaseTransition(brief, position.scene, position.sceneIndex, "review") : null
    });
    bindChoiceActivation("[data-scene-question]", (button) => scope.handleSceneQuestionButton(button));
    bindChoiceActivation("[data-scene-dialogue]", (button) => scope.handleSceneDialogueButton(button));
    bind("[data-scene-review-line]", (event) => scope.handleSceneReviewLine(event.currentTarget, brief));
    bind("[data-scene-replay-next]", () => advanceStatementReplay(brief, position.sceneIndex));
    bind("[data-scene-replay-previous]", () => advanceStatementReplay(brief, position.sceneIndex, -1));
    scope.bindSceneButtons();
  }

  function renderFocusedInquiry(brief, context) {
    const entry = context.entries.find(({ sceneIndex }) => !actionDone(brief, `version:${sceneIndex}`));
    if (!entry) return scope.continueAfterSceneReview(brief, context.stage.endIndex);
    const { scene, sceneIndex } = entry;
    setIndexValue(brief, "sceneReview", sceneIndex);
    const completed = selectedScenePickForState(ctx.getState(), brief, sceneIndex)?.completedOptionIds ?? [];
    const sequence = sceneQuestionSequence(scene);
    const next = nextSequentialChoice(sequence, completed);
    const options = (scene.questionOptions ?? []).filter(option => !completed.includes(option.id)
      && (!option.correct || !sequence.length || option.id === next?.id));
    if (options.length === 1 && options[0].correct) return scope.handleSceneQuestionButton({ dataset: { sceneQuestion: `${sceneIndex}:${scene.questionOptions.indexOf(options[0])}` } });
    frame({ brief, mood: "focused", label: "继续问清这一段", chapter: liveChapterTitle(brief),
      pixelTransition: null, screenClass: "dialogue-mode-listen focused-inquiry", controlMode: "listen",
      text: statementReplayPageHtml({ speaker: scene.speaker ?? "咨询者", line: { text: scene.version } }),
      choices: flowGroupHtml(options.map(option => `<button data-scene-question="${sceneIndex}:${scene.questionOptions.indexOf(option)}" type="button">${escapeHtml(option.question)}</button>`).join("")) });
    bindChoiceActivation("[data-scene-question]", button => scope.handleSceneQuestionButton(button));
    scope.bindSceneButtons();
  }

  function statementReplayPosition(brief, context, sceneIndex) {
    const state = ctx.getState();
    let entryIndex = context.entries.findIndex((entry) => entry.sceneIndex === Number(sceneIndex));
    if (entryIndex < 0) entryIndex = 0;
    const entry = context.entries[entryIndex];
    if (!entry) return null;
    const lines = statementLinesFromText(entry.scene.version ?? "", { prefix: entry.scene.id ?? `scene-${entry.sceneIndex}` });
    if (!lines.length) return null;
    let lineIndex = lines.findIndex((line) => line.id === state.activeStatementLineId);
    if (lineIndex < 0) lineIndex = 0;
    state.activeStatementLineId = lines[lineIndex].id;
    return { ...entry, entryIndex, lines, lineIndex, line: lines[lineIndex] };
  }

  function advanceStatementReplay(brief, sceneIndex, direction = 1) {
    const state = ctx.getState();
    const context = statementStageContext(brief, sceneIndex);
    const position = context ? statementReplayPosition(brief, context, sceneIndex) : null;
    if (!context || !position) return openSceneLineReplay(brief, sceneIndex, { reset: true });
    let nextEntryIndex = position.entryIndex;
    let nextLineIndex = position.lineIndex + direction;
    if (nextLineIndex >= position.lines.length) {
      if (position.entryIndex === context.entries.length - 1) {
        return commit((state) => {
          state.activeStatementLineId = `${context.stage.id}:end`;
          state.scene = "sceneLineReplay";
        });
      }
      nextEntryIndex = position.entryIndex + 1;
      nextLineIndex = 0;
    }
    if (nextLineIndex < 0) {
      nextEntryIndex = Math.max(0, position.entryIndex - 1);
      const previous = context.entries[nextEntryIndex];
      nextLineIndex = position.entryIndex > 0
        ? statementLinesFromText(previous.scene.version).length - 1 : 0;
    }
    const nextEntry = context.entries[nextEntryIndex];
    const nextLines = statementLinesFromText(nextEntry.scene.version ?? "", { prefix: nextEntry.scene.id ?? `scene-${nextEntry.sceneIndex}` });
    setIndexValue(brief, "sceneReview", nextEntry.sceneIndex);
    commit((state) => {
      state.activeStatementLineId = nextLines[nextLineIndex]?.id ?? nextLines[0]?.id ?? null;
      state.scene = "sceneLineReplay";
    });
  }

  function statementStageContext(brief, sceneIndex) {
    const state = ctx.getState();
    const stage = statementStageForScene(brief, sceneIndex);
    if (!stage) return null;
    const entries = stage.sceneIndexes.map((entrySceneIndex) => ({
      sceneIndex: entrySceneIndex,
      scene: sceneWithShownCard(
        brief,
        sceneWithCallbackRevision(brief, brief.sceneVersions?.[entrySceneIndex] ?? {}, entrySceneIndex)
      )
    }));
    return {
      stage,
      entries,
      progress: statementStageProgress({
        brief,
        stage,
        actionDone: (key) => actionDone(brief, key),
        dialoguePicksForScene: (entrySceneIndex) => askedDialoguePicksForState(state, brief, entrySceneIndex)
      })
    };
  }

  function statementPatienceKey(brief, sceneIndex) {
    return `${caseKey(brief)}:${statementNightKey(brief, sceneIndex)}`;
  }

  function statementPatienceMax(brief, sceneIndex) {
    return statementNightPatienceMax(brief, statementNightKey(brief, sceneIndex));
  }

  function statementPatience(brief, sceneIndex) {
    const state = ctx.getState();
    const max = statementPatienceMax(brief, sceneIndex);
    return normalizeStatementPatience(state.statementPatience?.[statementPatienceKey(brief, sceneIndex)], max);
  }

  function statementPressure(brief, sceneIndex, mode) {
    return statementPressureFor(statementPatience(brief, sceneIndex), {
      mode,
      max: statementPatienceMax(brief, sceneIndex)
    });
  }

  function statementPhaseTransition(brief, scene, sceneIndex, mode) {
    const phase = mode === "review" ? "review" : "listen";
    const key = `${caseKey(brief)}:statement:${scene?.id ?? sceneIndex}:${phase}`;
    if (!consumePixelTransition(key)) return null;
    return phase === "review"
      ? { kind: "phase", visualVariant: "review", eyebrow: "回到刚才的话", label: "逐句追问" }
      : { kind: "phase", visualVariant: "listen", eyebrow: "这一段先别打断", label: "来电人陈述" };
  }
  return {
    renderStatementStageReview,
    openSceneLineReplay,
    renderSceneLineReplay,
    renderFocusedInquiry,
    statementReplayPosition,
    advanceStatementReplay,
    statementStageContext,
    statementPatienceKey,
    statementPatienceMax,
    statementPatience,
    statementPressure,
    statementPhaseTransition
  };
}
