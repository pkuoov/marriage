import { resolveCommit } from "../../runtime/stateCommit.js";
import { evidenceOperationHtml } from "../evidenceView.js";
import { nextLinearInvestigationScene } from "../../runtime/nightOvernightModel.js";

export function createInterludeDeskFlow(ctx, scope) {
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

  function renderInterludeDesk(brief) {
    const state = ctx.getState();
    const structure = nightStructureFor(brief);
    if (!structure) {
      state.scene = "sceneReview";
      saveState();
      return renderSceneReview(brief);
    }
    const night = ensureNight(brief);
    const activeAction = nightActionById(brief, night.activeActionId);
    if (activeAction) return renderInterludeAction(brief, activeAction);
    if (structure.interlude?.flowMode === "linear") {
      const next = nextLinearInvestigationScene(structure.interlude.actions, night.interludeActionsDone);
      if (next) {
        updateNight(brief, { activeActionId: next.id });
        saveState();
        return renderInterludeAction(brief, next);
      }
      const overnight = ensureOvernight(brief);
      updateOvernight(brief, {
        earnedItems: [...new Set([...(overnight.earnedItems ?? []), ...interludeEarnedItemsForOvernight(brief, night.inventory)])]
      });
      return commit((state) => {
        state.scene = "dayActOpening";
      });
    }
    const interrupt = nextPendingInterruptAction(brief, night);
    if (interrupt) return renderInterludeInterruptToast(brief, interrupt);
    const interlude = structure.interlude ?? {};
    const actionStates = (interlude.actions ?? [])
      .filter((action) => action.kind !== "interruptToast")
      .map((action) => interludeActionState(structure, night, action));
    const doneCount = countCompletedInterludeActions(brief, night);
    const canReturn = doneCount >= Number(interlude.minActions ?? 0);
    dayFrame({
      brief,
      backdropClass: "day-city",
      label: "收麦后",
      chapter: "回拨前",
      text: interludeDeskHtml({ interlude, night, actionStates, canReturn }),
      choices: flowGroupHtml(`
        ${canReturn ? `<button class="primary" data-callback-ready type="button">${escapeHtml(interlude.continueLabel ?? "回拨她")}</button>` : ""}
      `)
    });
    bind("[data-interlude-action]", (event) => {
      const actionId = event.currentTarget?.getAttribute("data-interlude-action") ?? "";
      updateNight(brief, { activeActionId: actionId });
      saveState();
      render();
    });
    bind("[data-callback-ready]", () => {
      if (overnightStructureFor(brief)) {
        const overnight = ensureOvernight(brief);
        const syncedItems = interludeEarnedItemsForOvernight(brief, ensureNight(brief).inventory);
        updateOvernight(brief, {
          earnedItems: [...new Set([...(overnight.earnedItems ?? []), ...syncedItems])]
        });
      }
      commit((state) => {
        state.scene = overnightStructureFor(brief) ? "dayActOpening" : "callbackOpener";
      });
    });
    bindSceneButtons();
  }

  function renderInterludeAction(brief, action) {
    if (action.kind === "delegation") return renderInterludeDelegation(brief, action);
    if (action.kind === "evidencePass") return renderInterludeEvidence(brief, action);
    if (action.kind === "backflowEarly") return renderInterludeBackflow(brief, action);
    if (action.kind === "advisorCall") return renderInterludeAdvisorCall(brief, action);
    if (action.kind === "interruptToast") return renderInterludeInterruptToast(brief, action);
    if (action.kind === "playback") return renderInterludePlayback(brief, action);
    completeInterludeAction(brief, action);
  }

  function renderInterludeDelegation(brief, action) {
    const state = ctx.getState();
    const delegation = delegationFor(brief);
    const pick = selectedDelegationPickForState(state, brief);
    if (!delegation) return completeInterludeAction(brief, action);
    dayFrame({
      brief,
      backdropClass: "day-document",
      label: pick ? "顾问回单" : "送鉴定",
      chapter: "回拨前",
      text: delegationScreenHtml({
        delegation,
        advisors: CONTENT_ADVISORS,
        pick,
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
      }),
      choices: flowGroupHtml(`
        ${pick ? `<button class="primary" data-return-interlude type="button">${nightStructureFor(brief)?.interlude?.flowMode === "linear" ? "继续" : "回调查台"}</button>` : `<button data-return-interlude type="button">先放下</button>`}
      `)
    });
    scope.bindDelegationButtons(brief, delegation, { interludeAction: action });
    bind("[data-return-interlude]", () => closeInterludeAction(brief));
    bindSceneButtons();
  }

  function renderInterludeEvidence(brief, action) {
    const state = ctx.getState();
    const checkIndex = evidenceChecksFor(brief).findIndex((check) => action.focusCheckIds?.includes(check.id));
    const safeIndex = checkIndex >= 0 ? checkIndex : 0;
    const check = evidenceChecksFor(brief)[safeIndex] ?? null;
    const pick = selectedEvidencePickForState(state, brief, safeIndex);
    if (!check) return completeInterludeAction(brief, action);
    if (action.readOnlyAfterCall) {
      if (actionDone(brief, `evidenceCheck:${safeIndex}`)) return completeInterludeAction(brief, action);
      dayFrame({ brief, backdropClass: "day-document", label: "已收到的审批原页", chapter: "收麦后",
        text: evidenceOperationHtml(check, {}, safeIndex, ""),
        choices: flowGroupHtml('<button class="primary" data-read-legacy-material type="button">继续</button>') });
      bind("[data-read-legacy-material]", () => { markAction(brief, `evidenceCheck:${safeIndex}`); completeInterludeAction(brief, action); });
      bindSceneButtons(); return;
    }
    const retry = brief.dialoguePresentation?.focusedInquiry && pick && !pick.correct;
    dayFrame({
      brief,
      backdropClass: action.backdropClass ?? "day-document",
      label: action.label ?? "重看材料",
      chapter: "回拨前",
      text: evidenceCheckScreenHtml({
        check,
        pick,
        index: safeIndex,
        hostName: state.playerName,
        costMeta: "",
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
      }),
      choices: pick
        ? flowGroupHtml(`<button class="primary" data-return-interlude type="button">${retry ? "这处没问清，重新问" : nightStructureFor(brief)?.interlude?.flowMode === "linear" ? "继续" : "回调查台"}</button>`)
        : ""
    });
    scope.bindEvidenceCheckButtons(brief, check, { interludeAction: action });
    bind("[data-return-interlude]", () => {
      if (retry) {
        return commit((state) => {
          delete state.evidenceCheckPicks[evidenceAnswerKey(brief, safeIndex)];
        });
      }
      completeInterludeAction(brief, action);
    });
    bindSceneButtons();
  }

  function renderInterludeBackflow(brief, action) {
    const state = ctx.getState();
    const hookIndex = (brief.investigationHooks ?? []).findIndex((hook) => hook.id === action.hookId);
    const hook = brief.investigationHooks?.[hookIndex] ?? null;
    const pick = selectedInvestigationPickForState(state, brief, hookIndex);
    const replyChoices = action.replyChoices ?? hook?.replyChoices ?? [];
    const replyChoiceId = ensureNight(brief).interludeReplyChoices?.[action.id] ?? "";
    const needsReply = pick && replyChoices.length && !replyChoiceId;
    if (!hook) return completeInterludeAction(brief, action);
    dayFrame({
      brief,
      backdropClass: action.backdropClass ?? "day-document",
      label: action.label ?? "后台私信",
      screenClass: !pick && hook.socialPost ? "social-evidence-screen" : "",
      chapter: "回拨前",
      text: `${investigationBackflowScreenHtml({
        hook,
        pick,
        index: hookIndex,
        hostName: state.playerName,
        costMeta: "",
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
      })}${pick ? replyChoicesHtml(replyChoices, replyChoiceId) : ""}`,
      choices: pick
        ? flowGroupHtml(`${needsReply ? "" : `<button class="primary" data-return-interlude type="button">${nightStructureFor(brief)?.interlude?.flowMode === "linear" ? "继续" : "回调查台"}</button>`}`)
        : ""
    });
    scope.bindInvestigationButtons(brief, hook, hookIndex, { interludeAction: action });
    bind("[data-reply-choice]", (event) => recordInterludeReplyChoice(brief, action, replyChoices, event.currentTarget?.getAttribute("data-reply-choice") ?? ""));
    bind("[data-return-interlude]", () => completeInterludeAction(brief, action));
    bindSceneButtons();
  }

  function renderInterludeAdvisorCall(brief, action) {
    const night = ensureNight(brief);
    const followupAsked = Boolean(night.interludeFollowups?.[action.id]);
    const cueId = action.script?.audioCueId ?? action.audioCueId ?? "";
    dayFrame({
      brief,
      backdropClass: action.backdropClass ?? "day-city",
      label: action.label ?? "幕间通话",
      chapter: "回拨前",
      text: interludeDialogueActionHtml(action, followupAsked, audioCueView(cueId)),
      choices: flowGroupHtml(`
        ${action.script?.followupQuestion && !followupAsked ? `<button data-interlude-followup="${escapeHtml(action.id)}" type="button">追一问</button>` : ""}
        <button class="primary" data-complete-interlude-action type="button">继续</button>
      `),
      keepVoiceCueId: cueId
    });
    bind("[data-interlude-followup]", (event) => {
      const actionId = event.currentTarget?.getAttribute("data-interlude-followup") ?? "";
      updateNight(brief, {
        interludeFollowups: {
          ...(ensureNight(brief).interludeFollowups ?? {}),
          [actionId]: true
        }
      });
      saveState();
      render();
    });
    bind("[data-complete-interlude-action]", () => completeInterludeAction(brief, action));
    bindSceneButtons();
  }

  function renderInterludePlayback(brief, action) {
    const cueId = action.script?.audioCueId ?? action.audioCueId ?? "";
    dayFrame({
      brief,
      backdropClass: action.backdropClass ?? "day-document",
      label: action.label ?? "听回放",
      chapter: "回拨前",
      text: interludePlaybackActionHtml(action, audioCueView(cueId)),
      choices: flowGroupHtml(`<button class="primary" data-complete-interlude-action type="button">继续</button>`),
      keepVoiceCueId: cueId
    });
    bind("[data-complete-interlude-action]", () => completeInterludeAction(brief, action));
    bindSceneButtons();
  }

  function renderInterludeInterruptToast(brief, action) {
    const night = ensureNight(brief);
    const selectedChoiceId = night.interludeActionChoices?.[action.id] ?? "";
    const hasChoices = (action.choices ?? []).length > 0;
    const transitionKey = `${caseKey(brief)}:interrupt:${action.id}:reveal`;
    const pixelTransition = action.revealTransition?.id && consumePixelTransition?.(transitionKey)
      ? { ...action.revealTransition, kind: "reveal", evidenceArtSrc: brief.evidenceBoard ?? action.revealTransition.evidenceArtSrc ?? "" }
      : null;
    playAudioCueOnce("sfx.message.notification", `${caseKey(brief)}:interrupt:${action.id}`);
    dayFrame({
      brief,
      backdropClass: action.backdropClass ?? "day-city",
      label: "后台打断",
      chapter: "回拨前",
      text: interruptToastHtml(action, selectedChoiceId),
      pixelTransition,
      choices: flowGroupHtml(`
        ${!hasChoices && !selectedChoiceId ? `<button class="primary" data-complete-interlude-action type="button">继续</button>` : ""}
        ${selectedChoiceId ? `<button class="primary" data-return-interlude type="button">${nightStructureFor(brief)?.interlude?.flowMode === "linear" ? "继续" : "回调查台"}</button>` : ""}
      `)
    });
    bind("[data-interrupt-choice]", (event) => recordInterludeActionChoice(brief, action, event.currentTarget?.getAttribute("data-interrupt-choice") ?? ""));
    bind("[data-complete-interlude-action]", () => completeInterludeAction(brief, action));
    bind("[data-return-interlude]", () => closeInterludeAction(brief));
    bindSceneButtons();
  }
  return {
    renderInterludeDesk,
    renderInterludeAction,
    renderInterludeDelegation,
    renderInterludeEvidence,
    renderInterludeBackflow,
    renderInterludeAdvisorCall,
    renderInterludePlayback,
    renderInterludeInterruptToast
  };
}
