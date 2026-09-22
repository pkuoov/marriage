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

export function createSceneReviewFlow(ctx, scope) {
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

  function renderSceneReview(brief) {
    const state = ctx.getState();
    const currentSceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    if (enterLiveCounterBeatBeforeScene(brief, currentSceneIndex)) return;
    const currentScene = brief.sceneVersions?.[currentSceneIndex] ?? {};
    if (sceneUsesLineReplay(currentScene)) return scope.renderStatementStageReview(brief, currentSceneIndex);
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
      ? scope.decisiveProgress(brief, sceneForView, index)
      : null;
    if (sceneForView.interactionMode === "testimonyWall") {
      const wallContext = scope.testimonyContext(brief);
      const finalActResolved = wallContext.finalAct && wallContext.presentProgress.resolved;
      if (!finalActResolved && wallContext.presentProgress.resolved && !wallContext.finalAct) {
        scope.advanceWallAct(wallContext);
        state.scene = "testimonyWall";
        saveState();
        return scope.renderTestimonyWall(brief);
      }
      if (!finalActResolved) {
        const needsPrelude = wallContext.wallProgress.act === 1
          && !wallContext.wallProgress.preludeSeen
          && (wallContext.scene.beforeVersion?.lines ?? []).length > 0;
        state.scene = needsPrelude ? "testimonyPrelude" : "testimonyWall";
        saveState();
        return needsPrelude ? scope.renderTestimonyPrelude(brief) : scope.renderTestimonyWall(brief);
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
      pressureOverride: sceneUsesLineReplay(sceneForView) ? scope.statementPressure(brief, index, "listen") : null,
      pixelTransition: sceneUsesLineReplay(sceneForView) ? scope.statementPhaseTransition(brief, sceneForView, index, "listen") : undefined,
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
    bindChoiceActivation("[data-scene-question]", (button) => scope.handleSceneQuestionButton(button));
    bindChoiceActivation("[data-scene-dialogue]", (button) => scope.handleSceneDialogueButton(button));
    bind("[data-scene-open-replay]", () => scope.openSceneLineReplay(brief, index, { reset: true }));
    bind("[data-next-scene-stage]", () => continueAfterSceneReview(brief, index));
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
      return commit((state) => {
        state.lastReaction = readiness.message;
        state.scene = "sceneReview";
        state.dialogueProgress = {
        ...(state.dialogueProgress ?? {}),
        [`${caseKey(brief)}:sceneReview`]: firstUnansweredSceneIndex(brief)
      };
      });
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

  function continueAfterSceneReview(brief, sceneIndex = 0) {
    const state = ctx.getState();
    state.sceneQuestionFocus = null;
    if (enterLiveCounterBeatAfterScene(brief, sceneIndex)) return;
    if (shouldEnterOvernightHangupAfterScene(brief, sceneIndex)) {
      commit((state) => {
        state.scene = "overnightHangup";
      });
      return;
    }
    if (shouldEnterHangupAfterScene(brief, sceneIndex)) {
      commit((state) => {
        state.scene = "hangupBeat";
      });
      return;
    }
    const nextIndex = nextPlayableSceneIndex(brief, sceneIndex);
    if (nextIndex >= 0) {
      state.scene = "sceneReview";
      setIndex(brief, "sceneReview", nextIndex);
    }
    else moveScene("accusation");
  }
  return {
    renderSceneReview,
    renderPatienceLost,
    renderAccusation,
    bindSceneButtons,
    continueAfterSceneReview
  };
}
