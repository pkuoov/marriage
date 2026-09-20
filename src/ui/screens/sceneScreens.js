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
import { createTestimonyWallScreens } from "./testimonyWallScreens.js";

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
  const testimonyScreens = createTestimonyWallScreens({ ...ctx, continueAfterFocusedEvidence: continueAfterSceneReview });
  const {
    renderTestimonyPrelude,
    renderTestimonyWall,
    renderTestimonyMaterials,
    renderDecisivePresentTarget,
    renderDecisivePresentHit,
    testimonyContext,
    decisiveProgress,
    advanceWallAct
  } = testimonyScreens;

  function renderSceneReview(brief) {
    const state = ctx.getState();
    const currentSceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    if (enterLiveCounterBeatBeforeScene(brief, currentSceneIndex)) return;
    const currentScene = brief.sceneVersions?.[currentSceneIndex] ?? {};
    if (sceneUsesLineReplay(currentScene)) return renderStatementStageReview(brief, currentSceneIndex);
    const review = sceneReviewModel({
      brief,
      index: currentSceneIndex,
      actionDone: (key) => actionDone(brief, key),
      issueBadge: issueCompletion(brief).badge,
      overnight: ensureOvernight(brief),
      hasDeepFollowup: !nightStructureFor(brief) && !overnightStructureFor(brief) && hasDeepFollowup(brief)
    });
    const { index, scene, done, lastStage, nextStage, nextLabel } = review;
    const sceneForView = sceneWithShownCard(brief, sceneWithCallbackRevision(brief, scene, index));
    const testimonyPresent = sceneForView.interactionMode === "testimonyWall"
      ? decisiveProgress(brief, sceneForView, index)
      : null;
    if (sceneForView.interactionMode === "testimonyWall") {
      const wallContext = testimonyContext(brief);
      const finalActResolved = wallContext.finalAct && wallContext.presentProgress.resolved;
      if (!finalActResolved && wallContext.presentProgress.resolved && !wallContext.finalAct) {
        advanceWallAct(wallContext);
        state.scene = "testimonyWall";
        saveState();
        return renderTestimonyWall(brief);
      }
      if (!finalActResolved) {
        const needsPrelude = wallContext.wallProgress.act === 1
          && !wallContext.wallProgress.preludeSeen
          && (wallContext.scene.beforeVersion?.lines ?? []).length > 0;
        state.scene = needsPrelude ? "testimonyPrelude" : "testimonyWall";
        saveState();
        return needsPrelude ? renderTestimonyPrelude(brief) : renderTestimonyWall(brief);
      }
    }
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
      screenClass: sceneUsesLineReplay(sceneForView) ? "dialogue-mode-listen" : "",
      controlMode: "listen",
      musicPhase: sceneForView.interactionMode === "testimonyWall" && done && testimonyPresent?.resolved ? "pursuit" : "",
      pressureOverride: sceneUsesLineReplay(sceneForView) ? statementPressure(brief, index, "listen") : null,
      pixelTransition: sceneUsesLineReplay(sceneForView) ? statementPhaseTransition(brief, sceneForView, index, "listen") : undefined,
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
        : sceneUsesLineReplay(sceneForView)
          ? flowGroupHtml('<button class="primary" data-scene-open-replay type="button">把刚才那段拉回来</button>')
          : flowGroupHtml(sceneQuestionChoicesHtml(index, sceneForView, dialoguePicks))
    });
    playAudioCueOnce(sceneForView.audioCueId, `${caseKey(brief)}:scene:${index}:${sceneForView.id ?? "beat"}`);
    bindChoiceActivation("[data-scene-question]", (button) => handleSceneQuestionButton(button));
    bindChoiceActivation("[data-scene-dialogue]", (button) => handleSceneDialogueButton(button));
    bind("[data-scene-open-replay]", () => openSceneLineReplay(brief, index, { reset: true }));
    bind("[data-next-scene-stage]", () => continueAfterSceneReview(brief, index));
    bindSceneButtons();
  }

  function renderStatementStageReview(brief, currentSceneIndex) {
    const state = ctx.getState();
    const context = statementStageContext(brief, currentSceneIndex);
    if (!context) return;
    if (context.progress.started && !context.progress.complete) {
      state.scene = "sceneLineReplay";
      saveState();
      return renderSceneLineReplay(brief);
    }
    if (context.progress.complete && brief.dialoguePresentation?.focusedInquiry) return continueAfterSceneReview(brief, context.stage.endIndex);
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
    bind("[data-next-scene-stage]", () => continueAfterSceneReview(brief, context.stage.endIndex));
    bindSceneButtons();
  }

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
    const stageContext = sceneUsesLineReplay(scene) ? statementStageContext(brief, index) : null;
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
      pressureOverride: focus.kind === "key" && sceneUsesLineReplay(scene) ? statementPressure(brief, index, "interrupt") : null,
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
    bind("[data-scene-open-replay]", () => openSceneLineReplay(brief, index));
    bind("[data-next-scene-stage]", () => continueAfterSceneReview(brief, reviewIndex));
    bindSceneButtons();
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
      return renderSceneReview(brief);
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
      bind("[data-next-scene-stage]", () => continueAfterSceneReview(brief, context.stage.endIndex));
      return;
    }
    const position = statementReplayPosition(brief, context, sceneIndex);
    if (!position) {
      state.scene = "sceneReview";
      saveState();
      return renderSceneReview(brief);
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
    bindChoiceActivation("[data-scene-question]", (button) => handleSceneQuestionButton(button));
    bindChoiceActivation("[data-scene-dialogue]", (button) => handleSceneDialogueButton(button));
    bind("[data-scene-review-line]", (event) => handleSceneReviewLine(event.currentTarget, brief));
    bind("[data-scene-replay-next]", () => advanceStatementReplay(brief, position.sceneIndex));
    bind("[data-scene-replay-previous]", () => advanceStatementReplay(brief, position.sceneIndex, -1));
    bindSceneButtons();
  }

  function renderFocusedInquiry(brief, context) {
    const entry = context.entries.find(({ sceneIndex }) => !actionDone(brief, `version:${sceneIndex}`));
    if (!entry) return continueAfterSceneReview(brief, context.stage.endIndex);
    const { scene, sceneIndex } = entry;
    setIndexValue(brief, "sceneReview", sceneIndex);
    const completed = selectedScenePickForState(ctx.getState(), brief, sceneIndex)?.completedOptionIds ?? [];
    const sequence = sceneQuestionSequence(scene);
    const next = nextSequentialChoice(sequence, completed);
    const options = (scene.questionOptions ?? []).filter(option => !completed.includes(option.id)
      && (!option.correct || !sequence.length || option.id === next?.id));
    if (options.length === 1 && options[0].correct) return handleSceneQuestionButton({ dataset: { sceneQuestion: `${sceneIndex}:${scene.questionOptions.indexOf(options[0])}` } });
    frame({ brief, mood: "focused", label: "继续问清这一段", chapter: liveChapterTitle(brief),
      pixelTransition: null, screenClass: "dialogue-mode-listen focused-inquiry", controlMode: "listen",
      text: statementReplayPageHtml({ speaker: scene.speaker ?? "咨询者", line: { text: scene.version } }),
      choices: flowGroupHtml(options.map(option => `<button data-scene-question="${sceneIndex}:${scene.questionOptions.indexOf(option)}" type="button">${escapeHtml(option.question)}</button>`).join("")) });
    bindChoiceActivation("[data-scene-question]", button => handleSceneQuestionButton(button));
    bindSceneButtons();
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
        state.activeStatementLineId = `${context.stage.id}:end`;
        state.scene = "sceneLineReplay";
        saveState();
        return render();
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
    state.activeStatementLineId = nextLines[nextLineIndex]?.id ?? nextLines[0]?.id ?? null;
    state.scene = "sceneLineReplay";
    saveState();
    render();
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
      return openSceneLineReplay(brief, sceneIndex);
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
        const patienceKey = statementPatienceKey(brief, sceneIndex);
        const next = spendStatementPatience(state.statementPatience?.[patienceKey], statementPatienceMax(brief, sceneIndex));
        state.statementPatience = { ...(state.statementPatience ?? {}), [patienceKey]: next };
        state.lastScreenEffect = "patience-drop";
        state.lastPressureSignal = "drift";
        state.lastReaction = "这句没问下去，耐心 −1。";
        const stageComplete = statementStageContext(brief, sceneIndex)?.progress.complete;
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
      pressureOverride: statementPressure(brief, sceneIndex, "replay")
    });
    bind("[data-retry-statement]", () => retryStatementReview(brief, sceneIndex));
    bindSceneButtons();
  }

  function retryStatementReview(brief, sceneIndex) {
    const state = ctx.getState();
    const stage = statementStageForScene(brief, sceneIndex);
    const patienceKey = statementPatienceKey(brief, sceneIndex);
    state.statementPatience = {
      ...(state.statementPatience ?? {}),
      [patienceKey]: resetStatementPatience(statementPatienceMax(brief, sceneIndex))
    };
    state.statementReviewAttempts = { ...(state.statementReviewAttempts ?? {}) };
    for (const stageSceneIndex of stage?.sceneIndexes ?? [sceneIndex]) {
      state.statementReviewAttempts[answerKey(brief, stageSceneIndex)] = [];
    }
    state.activeStatementLineId = null;
    state.lastScreenEffect = null;
    state.scene = "sceneLineReplay";
    saveState();
    render();
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
      const pendingEvidence = afterSceneEvidenceFor(brief, snapshot.sceneIndex, (key) => actionDone(brief, key));
      state.scene = pendingEvidence
        ? "afterSceneEvidence"
        : shouldEnterOvernightHangupAfterScene(brief, snapshot.sceneIndex)
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
    if (question?.choiceMode === "sequence") return renderSequentialCallerQuestion(brief, question, overnight);
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

  function renderSequentialCallerQuestion(brief, question, overnight) {
    const progress = callerQuestionProgress(question, overnight);
    const picked = progress.picked;
    const displayed = picked ?? question.options.find(option => option.id === progress.completedIds.at(-1));
    frame({
      brief, mood: "focused", label: "她的那一问", chapter: liveChapterTitle(brief),
      text: `<div class="caller-question-dialogue">${callDialogueHtml([
        ...(!progress.completedIds.length || displayed?.id === question.options[0]?.id ? [{ role: "caller", text: question.prompt }] : []),
        ...(displayed ? [{ role: "host", text: displayed.label }, ...(displayed.lines ?? (displayed.callerLine ? [{ role: "caller", text: displayed.callerLine }] : []))] : [])
      ])}</div>`,
      choices: picked || progress.complete
        ? flowGroupHtml(`<button class="primary" data-caller-sequence-continue type="button">继续</button>`)
        : flowGroupHtml(`<button class="decision-choice" data-caller-question="${escapeHtml(progress.next.id)}" type="button">${escapeHtml(progress.next.label)}</button>`)
    });
    bind("[data-caller-question]", event => recordCallerQuestionChoice(brief, event.currentTarget?.getAttribute("data-caller-question") ?? ""));
    bind("[data-caller-sequence-continue]", () => {
      if (progress.complete) {
        markAction(brief, "overnight:callerQuestion");
        ctx.getState().scene = nextSceneAfterEvidence({ issueBadge: issueCompletion(brief).badge, hasDeepFollowup: hasDeepFollowup(brief) });
      } else updateOvernight(brief, { callerQuestionChoiceId: null });
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
        ], "", { autoPairQuestions: true })}
        <p class="hint">${escapeHtml(followup.note)}</p>
      `,
      choices: flowGroupHtml(`<button class="primary" data-scene="accusation" type="button">选一句往下追</button>`)
    });
    bindSceneButtons();
  }

  function renderPatienceLost(brief) {
    if (brief.dialoguePresentation?.focusedInquiry) { retryPatienceLostStep(brief); return; }
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
    bind("[data-retry-lost-step]", () => {
      const state = ctx.getState();
      const key = state.patienceLostContext?.decisivePresentKey;
      if (key) {
        state.decisivePresentProgress = {
          ...(state.decisivePresentProgress ?? {}),
          [key]: resetDecisivePresentProgress(state.decisivePresentProgress?.[key])
        };
      }
      retryPatienceLostStep(brief);
    });
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
    if (brief.dialoguePresentation?.compactClosing) {
      return resolveAccusationFromButton(brief, { getAttribute: name => ({ "data-accuse": "close", "data-accuse-label": "结束连线", "data-accuse-response": "" })[name] ?? "" });
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
    state.sceneQuestionFocus = {
      caseId: caseKey(brief), sceneIndex, kind: "key", optionIndex, sceneId: scene.id, optionId: option.id,
      pendingPenalty: option.correct || option.contradiction || actionDone(brief, `sceneQuestion:${sceneIndex}:${optionIndex}`) ? null : sceneUsesLineReplay(scene) ? "statement-key" : "question"
    };
    state.scene = "sceneQuestionAnswer";
    saveState();
    render();
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
    saveState();
    render();
  }

  function closeSceneQuestionMenu(brief) {
    const state = ctx.getState();
    const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    state.sceneQuestionFocus = null;
    state.scene = statementStageForScene(brief, sceneIndex) ? "sceneLineReplay" : "sceneReview";
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
    if (nextIndex >= 0) {
      state.scene = "sceneReview";
      setIndex(brief, "sceneReview", nextIndex);
    }
    else moveScene("accusation");
  }

  function recordCallerQuestionChoice(brief, choiceId = "") {
    const question = overnightCallerQuestionFor(brief);
    const choice = (question?.options ?? []).find((option) => option.id === choiceId);
    const overnight = ensureOvernight(brief);
    if (!choice) return;
    if (question.choiceMode === "sequence") {
      const updated = advanceCallerQuestion(question, overnight, choiceId);
      if (updated === overnight) return;
      updateOvernight(brief, updated);
      recordRouteChoice(brief, keyQuestionLimit(brief) + evidenceChecksFor(brief).length + 0.8 + question.options.indexOf(choice) / 100, {
        question: question.prompt, answer: choice.label, routeAxis: choice.routeAxis ?? "process-control", routeTone: "caller-question"
      }, { version: question.prompt });
      saveState();
      render();
      return;
    }
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
    renderTestimonyPrelude,
    renderTestimonyWall,
    renderTestimonyMaterials,
    renderDecisivePresentTarget,
    renderDecisivePresentHit,
    renderSceneLineReplay,
    renderStatementPatienceLost,
    renderStanceSnapshot,
    renderHangupBeat,
    renderCallerQuestion,
    renderDeepFollowup,
    renderPatienceLost,
    renderAccusation,
    bindSceneButtons
  };
}
import { completedChoicePrefix, nextSequentialChoice, sceneQuestionSequence } from "../../runtime/sequentialChoices.js";
import { callerQuestionProgress, advanceCallerQuestion } from "../../runtime/callerQuestionSequence.js";
