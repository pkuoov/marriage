import { resolveCommit } from "../../runtime/stateCommit.js";
import { evidenceOperationHtml } from "../evidenceView.js";
import { nextLinearInvestigationScene } from "../../runtime/nightOvernightModel.js";

export function createInterludeInvestigationFlow(ctx, scope) {
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

  function renderInvestigationBackflow(brief) {
    const state = ctx.getState();
    const model = investigationBackflowModel({
      entries: unlockedInvestigationEntriesForState(state, brief).filter(({ hook }) => {
        if (nightStructureFor(brief)?.interlude?.flowMode !== "linear") return true;
        const night = ensureNight(brief);
        return !(nightStructureFor(brief).interlude.actions ?? []).some((action) =>
          action.hookId === hook.id && (night.interludeActionsDone ?? []).includes(action.id));
      }),
      selectedPick: (index) => selectedInvestigationPickForState(state, brief, index)
    });
    const { hook, pick, index, nextLabel } = model;
    if (model.missing) {
      return commit((state) => {
        state.scene = "caseSolved";
      });
    }
    const replyChoices = hook.replyChoices ?? [];
    const replyChoiceId = ensureNight(brief).investigationReplyChoices?.[hook.id] ?? "";
    const needsReply = Boolean(pick && replyChoices.length && !replyChoiceId);
    frame({
      brief,
      mood: pick ? (pick.correct ? "focused" : "tense") : "thinking",
      label: "后台私信",
      chapter: liveChapterTitle(brief),
      text: `
        ${investigationBackflowScreenHtml({
          hook,
          pick,
          index,
          hostName: state.playerName,
          reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
        })}
        ${pick ? replyChoicesHtml(replyChoices, replyChoiceId) : ""}
        ${pick ? hostDisclosureForAnchor(brief, "afterBackflow") : ""}
      `,
      choices: pick && !needsReply
        ? flowGroupHtml(`<button class="primary" data-after-investigation type="button">${nextLabel}</button>`)
        : ""
    });
    bindInvestigationButtons(brief, hook, index);
    bind("[data-reply-choice]", (event) => recordInvestigationReplyChoice(brief, hook, replyChoices, event.currentTarget?.getAttribute("data-reply-choice") ?? ""));
    bind("[data-after-investigation]", () => moveScene("caseSolved"));
    bindSceneButtons();
  }

  function recordInvestigationReplyChoice(brief, hook = {}, choices = [], choiceId = "") {
    const choice = choices.find((item) => item.id === choiceId);
    if (!choice) return;
    const state = ctx.getState();
    const night = ensureNight(brief);
    updateNight(brief, {
      inventory: [...new Set([...(night.inventory ?? []), ...(choice.grantsInventory ?? [])])],
      investigationReplyChoices: {
        ...(night.investigationReplyChoices ?? {}),
        [hook.id]: choice.id
      },
      stanceNudge: choice.stanceNudge ?? night.stanceNudge ?? null
    });
    recordRouteChoice(brief, investigationRouteIndexBase(brief) + (brief.investigationHooks ?? []).indexOf(hook), {
      question: hook.title ?? "后台收件箱",
      answer: choice.label ?? "",
      routeAxis: choice.routeAxis ?? hook.routeAxis ?? "outer-thread",
      routeTone: "reply-choice"
    }, { version: hook.material ?? "" });
    commit((state) => {
      state.lastReaction = choice.aftertaste ?? "这封先按你选的方式处理。";
      state.lastPressureSignal = choice.pressureSignal ?? "";
      state.lastScreenEffect = choice.screenEffect ?? "";
    });
  }

  function renderDelegation(brief) {
    const state = ctx.getState();
    const delegation = delegationFor(brief);
    const pick = selectedDelegationPickForState(state, brief);
    if (!delegation || !delegation.material || actionDone(brief, "delegation") && !pick) {
      state.scene = "accusation";
      saveState();
      return renderAccusation(brief);
    }
    if (pick?.skipped) {
      state.scene = "accusation";
      saveState();
      return renderAccusation(brief);
    }
    frame({
      brief,
      mood: pick ? "focused" : "thinking",
      label: pick ? "顾问回单" : "后台委托",
      chapter: liveChapterTitle(brief),
      text: delegationScreenHtml({
        delegation,
        advisors: CONTENT_ADVISORS,
        pick,
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
      }),
      choices: pick
        ? flowGroupHtml(`<button class="primary" data-after-delegation type="button">选一句往下追</button>`)
        : flowGroupHtml(`<button class="decision-choice" data-skip-delegation type="button">${choiceButtonBodyHtml("先不送", CHOICE_COST_META.skipAdvisor)}</button>`)
    });
    bindDelegationButtons(brief, delegation);
    bind("[data-skip-delegation]", () => skipDelegation(brief));
    bind("[data-after-delegation]", () => {
      state.scene = "accusation";
      saveState();
      renderAccusation(brief);
    });
    bindSceneButtons();
  }

  function bindInvestigationButtons(brief, hook = {}, hookIndex = 0, context = {}) {
    const state = ctx.getState();
    document.querySelectorAll("[data-evidence-check]").forEach((button) => {
      button.addEventListener("click", () => {
        const optionIndex = Number(button.dataset.evidenceCheck.split(":")[1] ?? 0);
        const outcome = materialOperationOutcome(hook, hookIndex, optionIndex);
        playAudioCueOnce("sfx.document.mark", `${caseKey(brief)}:investigation:${hookIndex}:${optionIndex}`);
        const spend = !context.interludeAction && hook.spendOnMiss === true && outcome.spend;
        markAction(brief, `investigation:${hookIndex}:${optionIndex}`, { spend });
        markAction(brief, `investigation:${hookIndex}`);
        if (outcome.contradiction) {
          recordContradiction(brief, outcome.contradiction);
        }
        state.investigationPicks = {
          ...(state.investigationPicks ?? {}),
          [investigationAnswerKey(brief, hookIndex)]: outcome.pick
        };
        recordRouteChoice(
          brief,
          investigationRouteIndexBase(brief) + hookIndex,
          {
            ...outcome.routeChoice,
            routeAxis: hook.routeAxis ?? outcome.routeChoice.routeAxis,
            routeTone: outcome.correct ? "backflow-hit" : "backflow-miss"
          },
          { version: hook.material ?? "" }
        );
        state.lastReaction = investigationPickReaction(outcome, hook);
        state.lastPressureSignal = brief.dialoguePresentation?.focusedInquiry ? null : materialPressureSignal(outcome);
        if (outcome.correct) state.lastScreenEffect = "material-hit";
        state.lastPressureAxis = outcome.routeChoice?.routeAxis ?? outcome.routeChoice?.axis ?? null;
        if (context.interludeAction) {
          const replyChoices = context.interludeAction.replyChoices ?? hook.replyChoices ?? [];
          if (!replyChoices.length && nightStructureFor(brief)?.interlude?.flowMode !== "linear") {
            completeInterludeAction(brief, context.interludeAction, { renderNow: false });
          }
          saveState();
          return render();
        }
        if (!brief.dialoguePresentation?.focusedInquiry && spend && Number(ensureBudget(brief).remaining ?? 0) <= 0) return recordPatienceLost(brief, {
          area: "investigationBackflow",
          index: hookIndex,
          actionKeys: [`investigation:${hookIndex}:${optionIndex}`, `investigation:${hookIndex}`],
          answerKey: investigationAnswerKey(brief, hookIndex),
          routeIndex: investigationRouteIndexBase(brief) + hookIndex,
          spent: true,
          removeInvestigationPick: true
        });
        saveState();
        render();
      });
    });
  }

  function bindDelegationButtons(brief, delegation = {}, context = {}) {
    document.querySelectorAll("[data-delegation-advisor]").forEach((button) => {
      button.addEventListener("click", () => recordDelegationPick(brief, delegation, button.dataset.delegationAdvisor ?? "", context));
    });
  }

  function recordDelegationPick(brief, delegation = {}, advisorId = "", context = {}) {
    const state = ctx.getState();
    const outcome = delegationOutcomeFor(delegation, advisorId);
    const advisor = CONTENT_ADVISORS[advisorId] ?? {};
    if (!outcome || !advisor.id) return;
    const key = caseKey(brief);
    const material = delegation.material ?? {};
    const advisorBadge = [advisor.name, advisor.domain].filter(Boolean).join(" · ");
    state.delegationPicks = {
      ...(state.delegationPicks ?? {}),
      [key]: {
        advisorId,
        advisorBadge,
        material,
        tone: outcome.tone ?? "",
        text: outcome.text ?? "",
        skipped: false,
        at: Date.now()
      }
    };
    markAction(brief, "delegation");
    recordRouteChoice(brief, delegationRouteIndexFor(brief), {
      question: `委托${advisor.name ?? "顾问"}看${material.label ?? "后台材料"}`,
      answer: outcome.text ?? "",
      routeAxis: delegationRouteAxisForAdvisor(advisorId),
      routeTone: `delegation-${outcome.tone ?? "partial"}`
    }, { version: material.label ?? "" });
    if (context.interludeAction) {
      completeInterludeAction(brief, context.interludeAction, { renderNow: false });
    }
    commit((state) => {
      state.lastReaction = "回单到了，先看这句。";
    });
  }

  function skipDelegation(brief) {
    const state = ctx.getState();
    const key = caseKey(brief);
    state.delegationPicks = {
      ...(state.delegationPicks ?? {}),
      [key]: {
        skipped: true,
        at: Date.now()
      }
    };
    markAction(brief, "delegation");
    state.scene = "accusation";
    saveState();
    renderAccusation(brief);
  }

  function delegationRouteIndexFor(brief = {}) {
    return keyQuestionLimit(brief) + evidenceChecksFor(brief).length - 0.5;
  }
  return {
    renderInvestigationBackflow,
    recordInvestigationReplyChoice,
    renderDelegation,
    bindInvestigationButtons,
    bindDelegationButtons,
    recordDelegationPick,
    skipDelegation,
    delegationRouteIndexFor
  };
}
