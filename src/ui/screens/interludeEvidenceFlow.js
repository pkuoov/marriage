import { resolveCommit } from "../../runtime/stateCommit.js";
import { evidenceOperationHtml } from "../evidenceView.js";
import { nextLinearInvestigationScene } from "../../runtime/nightOvernightModel.js";

export function createInterludeEvidenceFlow(ctx, scope) {
  const {
    playAudioCueOnce,
    consumePixelTransition,
    audioCueView,
    materialOperationOutcome,
    latestChoiceReviewRowsForState,
    selectedDelegationPickForState,
    selectedEvidencePickForState,
    selectedInvestigationPickForState,
    unlockedInvestigationEntriesForState,
    investigationPickReaction,
    materialPressureReaction,
    materialPressureSignal,
    afterSceneEvidenceFor,
    answerKey,
    caseKey,
    delegationFor,
    delegationOutcomeFor,
    delegationRouteAxisForAdvisor,
    evidenceAnswerKey,
    evidenceCheckModel,
    evidenceChecksFor,
    interludeEarnedItemsForOvernight,
    investigationAnswerKey,
    investigationBackflowModel,
    investigationRouteIndexBase,
    keyQuestionLimit,
    nextPlayableSceneIndex,
    nightActionById,
    nightStructureFor,
    overnightStructureFor,
    shouldEnterHangupAfterScene,
    shouldEnterOvernightHangupAfterScene,
    CHOICE_COST_META,
    choiceButtonBodyHtml,
    choiceReviewHtml,
    flowGroupHtml,
    delegationScreenHtml,
    evidenceCheckScreenHtml,
    investigationBackflowScreenHtml,
    interludeDeskHtml,
    interludeDialogueActionHtml,
    interludePlaybackActionHtml,
    interruptToastHtml,
    replyChoicesHtml,
    CONTENT_ADVISORS,
    saveState,
    render,
    liveChapterTitle,
    renderSceneReview,
    renderAccusation,
    hostDisclosureForAnchor,
    frame,
    dayFrame,
    bind,
    bindSceneButtons,
    enterLiveCounterBeatAfterScene,
    moveScene,
    setIndex,
    setIndexValue,
    currentIndex,
    issueCompletion,
    markAction,
    recordPatienceLost,
    actionDone,
    ensureBudget,
    ensureNight,
    ensureOvernight,
    updateNight,
    updateOvernight,
    interludeActionState,
    completeInterludeAction,
    nextPendingInterruptAction,
    countCompletedInterludeActions,
    recordInterludeActionChoice,
    recordInterludeReplyChoice,
    closeInterludeAction,
    recordContradiction,
    recordRouteChoice,
    sceneAfterEvidenceFor,
    hasDeepFollowup,
    materialPityLineFor,
    escapeHtml
  } = ctx;
  const commit = resolveCommit(ctx);

  function renderAfterSceneEvidence(brief) {
    const state = ctx.getState();
    const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
    const pendingAfterScene = afterSceneEvidenceFor(brief, sceneIndex, (key) => actionDone(brief, key));
    // A result stays open until explicit continuation, including after reload or
    // transient feedback cleanup. Completion alone must not close the board.
    const afterScene = pendingAfterScene ?? afterSceneEvidenceFor(brief, sceneIndex, () => false);
    if (!afterScene?.check) {
      state.scene = "sceneReview";
      saveState();
      return renderSceneReview(brief);
    }
    const { check, checkIndex } = afterScene;
    const pick = selectedEvidencePickForState(state, brief, checkIndex);
    frame({
      brief,
      mood: pick ? (pick.correct ? "focused" : "tense") : "thinking",
      label: afterScene.label ?? "看材料",
      screenClass: !pick ? (check.socialPost ? "social-evidence-screen" : "focused-evidence-inquiry material-check-screen") : "",
      chapter: liveChapterTitle(brief),
      text: evidenceCheckScreenHtml({
        check,
        pick,
        index: checkIndex,
        hostName: state.playerName,
        costMeta: brief.dialoguePresentation?.focusedInquiry ? "" : CHOICE_COST_META.evidenceMark,
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
      }),
      choices: pick
        ? flowGroupHtml(`<button class="primary" data-after-scene-evidence type="button">${escapeHtml(brief.dialoguePresentation?.focusedInquiry && !pick.correct ? "这处没问清，重新问" : afterScene.continueLabel ?? "收起材料，继续连线")}</button>`)
        : ""
    });
    bindEvidenceCheckButtons(brief, check, { afterSceneIndex: sceneIndex });
    bind("[data-after-scene-evidence]", () => continueAfterSceneEvidence(brief, sceneIndex));
    bindSceneButtons();
  }

  function renderEvidenceCheck(brief) {
    const state = ctx.getState();
    const index = currentIndex(brief, "evidenceCheck", evidenceChecksFor(brief).length || 1);
    const model = evidenceCheckModel({
      brief,
      index,
      pick: selectedEvidencePickForState(state, brief, index),
      issueBadge: issueCompletion(brief).badge,
      hasDeepFollowup: !nightStructureFor(brief) && !overnightStructureFor(brief) && hasDeepFollowup(brief)
    });
    const { check, pick, lastCheck, nextStage, nextLabel } = model;
    const effectiveNextStage = lastCheck ? sceneAfterEvidenceFor(brief) : nextStage;
    const effectiveNextLabel = effectiveNextStage === "callerQuestion"
      ? "听她问完"
      : effectiveNextStage === "deepFollowup"
        ? "再深入一句"
        : nextLabel;
    if (model.missing) {
      return commit((state) => {
        state.scene = sceneAfterEvidenceFor(brief);
      });
    }
    frame({
      brief,
      mood: pick ? (pick.correct ? "focused" : "tense") : "thinking",
      screenClass: !pick && !check.socialPost ? "focused-evidence-inquiry material-check-screen" : "",
      label: "看材料",
      chapter: liveChapterTitle(brief),
      text: evidenceCheckScreenHtml({
        check,
        pick,
        index,
        hostName: state.playerName,
        costMeta: brief.dialoguePresentation?.focusedInquiry ? "" : CHOICE_COST_META.evidenceMark,
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
      }),
      choices: pick
        ? flowGroupHtml(brief.dialoguePresentation?.focusedInquiry && !pick.correct
          ? '<button class="primary" data-retry-evidence-check type="button">这处没问清，重新问</button>'
          : lastCheck
          ? `<button class="primary" data-scene="${effectiveNextStage}" type="button">${effectiveNextLabel}</button>`
          : `<button class="primary" data-next-evidence-check type="button">继续看材料</button>`)
        : ""
    });
    bindEvidenceCheckButtons(brief, check);
    bind("[data-next-evidence-check]", () => setIndex(brief, "evidenceCheck", index + 1));
    bind("[data-retry-evidence-check]", () => {
      commit((state) => {
        delete state.evidenceCheckPicks[evidenceAnswerKey(brief, index)];
      });
    });
    bindSceneButtons();
  }

  function bindEvidenceCheckButtons(brief, check = {}, context = {}) {
    const state = ctx.getState();
    document.querySelectorAll("[data-evidence-check]").forEach((button) => {
      button.addEventListener("click", () => {
        const [checkIndex, optionIndex] = button.dataset.evidenceCheck.split(":").map(Number);
        const outcome = materialOperationOutcome(check, checkIndex, optionIndex);
        playAudioCueOnce("sfx.document.mark", `${caseKey(brief)}:evidence:${checkIndex}:${optionIndex}`);
        markAction(brief, `evidenceCheck:${checkIndex}:${optionIndex}`, { spend: context.interludeAction ? false : outcome.spend });
        if (outcome.correct || !brief.dialoguePresentation?.focusedInquiry) markAction(brief, `evidenceCheck:${checkIndex}`);
        if (outcome.contradiction) {
          recordContradiction(brief, outcome.contradiction);
        }
        state.evidenceCheckPicks = {
          ...(state.evidenceCheckPicks ?? {}),
          [evidenceAnswerKey(brief, checkIndex)]: evidencePickWithRevision(brief, { ...outcome.pick, checkId: check.id, optionId: check.options?.[optionIndex]?.id })
        };
        recordRouteChoice(brief, keyQuestionLimit(brief) + checkIndex, outcome.routeChoice, { version: check.material ?? "" });
        state.lastReaction = brief.dialoguePresentation?.focusedInquiry ? null : materialPressureReaction(outcome, check);
        state.lastPressureSignal = brief.dialoguePresentation?.focusedInquiry ? null : materialPressureSignal(outcome);
        state.lastPityLine = materialPityLineFor(brief, check, checkIndex, outcome);
        if (outcome.correct) state.lastScreenEffect = "material-hit";
        state.lastPressureAxis = outcome.routeChoice?.routeAxis ?? outcome.routeChoice?.axis ?? null;
        if (context.interludeAction) {
          if (nightStructureFor(brief)?.interlude?.flowMode !== "linear") {
            completeInterludeAction(brief, context.interludeAction, { renderNow: false });
          }
          saveState();
          return render();
        }
        if (!brief.dialoguePresentation?.focusedInquiry && outcome.spend && Number(ensureBudget(brief).remaining ?? 0) <= 0) return recordPatienceLost(brief, {
          area: Number.isInteger(context.afterSceneIndex) ? "afterSceneEvidence" : "evidenceCheck",
          index: checkIndex,
          actionKeys: [
            `evidenceCheck:${checkIndex}:${optionIndex}`,
            `evidenceCheck:${checkIndex}`,
          ],
          answerKey: evidenceAnswerKey(brief, checkIndex),
          routeIndex: keyQuestionLimit(brief) + checkIndex,
          spent: true,
          removeEvidencePick: true
        });
        saveState();
        render();
      });
    });
  }

  function continueAfterSceneEvidence(brief, sceneIndex = 0) {
    const state = ctx.getState();
    const afterScene = afterSceneEvidenceFor(brief, sceneIndex, () => false);
    if (brief.dialoguePresentation?.focusedInquiry && afterScene && !selectedEvidencePickForState(state, brief, afterScene.checkIndex)?.correct) {
      return commit((state) => {
        delete state.evidenceCheckPicks[evidenceAnswerKey(brief, afterScene.checkIndex)];
        state.scene = "afterSceneEvidence";
      });
    }
    markAction(brief, `afterScene:${sceneIndex}`);
    if (afterScene?.returnScene) {
      return commit((state) => {
        state.scene = afterScene.returnScene;
      });
    }
    if (enterLiveCounterBeatAfterScene(brief, sceneIndex)) return;
    if (shouldEnterOvernightHangupAfterScene(brief, sceneIndex)) {
      return commit((state) => {
        state.scene = "overnightHangup";
      });
    }
    if (shouldEnterHangupAfterScene(brief, sceneIndex)) {
      return commit((state) => {
        state.scene = "hangupBeat";
      });
    }
    const nextSceneIndex = nextPlayableSceneIndex(brief, sceneIndex);
    if (nextSceneIndex >= 0) {
      setIndexValue(brief, "sceneReview", nextSceneIndex);
      state.scene = "sceneReview";
    } else {
      state.scene = sceneAfterEvidenceFor(brief);
    }
    saveState();
    render();
  }

  function evidencePickWithRevision(brief, pick = {}) {
    if (!pick.correct || pick.revisesScene === undefined) return pick;
    const scene = brief?.sceneVersions?.[Number(pick.revisesScene)] ?? null;
    if (!scene?.revisedVersion) return pick;
    return {
      ...pick,
      revisedVersion: scene.revisedVersion
    };
  }
  return {
    renderAfterSceneEvidence,
    renderEvidenceCheck,
    bindEvidenceCheckButtons,
    continueAfterSceneEvidence,
    evidencePickWithRevision
  };
}
