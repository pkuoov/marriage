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

export function createSceneBeatFlow(ctx, scope) {
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
      return scope.renderSceneReview(brief);
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
      commit((state) => {
        state.scene = pendingEvidence
        ? "afterSceneEvidence"
        : shouldEnterOvernightHangupAfterScene(brief, snapshot.sceneIndex)
          ? "overnightHangup"
          : shouldEnterHangupAfterScene(brief, snapshot.sceneIndex)
            ? "hangupBeat"
            : "sceneReview";
      });
    });
    scope.bindSceneButtons();
  }

  function renderHangupBeat(brief) {
    const state = ctx.getState();
    const structure = nightStructureFor(brief);
    if (!structure?.hangup) {
      state.scene = "sceneReview";
      saveState();
      return scope.renderSceneReview(brief);
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
      commit((state) => {
        state.scene = "interludeDesk";
      });
    });
    scope.bindSceneButtons();
  }

  function renderCallerQuestion(brief) {
    const state = ctx.getState();
    const question = overnightCallerQuestionFor(brief);
    const overnight = ensureOvernight(brief);
    if (question?.choiceMode === "sequence") return renderSequentialCallerQuestion(brief, question, overnight);
    if (!question || actionDone(brief, "overnight:callerQuestion") && !overnight.callerQuestionChoiceId) {
      return commit((state) => {
        state.scene = nextSceneAfterEvidence({ issueBadge: issueCompletion(brief).badge, hasDeepFollowup: hasDeepFollowup(brief) });
      });
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
      commit((state) => {
        state.scene = nextSceneAfterEvidence({ issueBadge: issueCompletion(brief).badge, hasDeepFollowup: hasDeepFollowup(brief) });
      });
    });
    scope.bindSceneButtons();
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
    scope.bindSceneButtons();
  }

  function renderDeepFollowup(brief) {
    const state = ctx.getState();
    const issue = issueCompletion(brief);
    if (!issue.badge || !hasDeepFollowup(brief)) {
      state.scene = "accusation";
      saveState();
      return scope.renderAccusation(brief);
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
    scope.bindSceneButtons();
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
    commit((state) => {
      state.lastReaction = null;
    });
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
    commit((state) => {
      state.lastReaction = choice.aftertaste ?? "";
    });
  }
  return {
    renderStanceSnapshot,
    renderHangupBeat,
    renderCallerQuestion,
    renderSequentialCallerQuestion,
    renderDeepFollowup,
    recordStanceSnapshot,
    recordCallerQuestionChoice,
    recordCallerQuestionHostChoice,
    completeCallerQuestionChoice
  };
}
