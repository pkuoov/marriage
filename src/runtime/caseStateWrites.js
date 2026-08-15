import { calculateCaseBudgetMax } from "../caseRuntime.js";
import {
  answeredEvidenceCountForState,
  answeredSceneCountForState
} from "./caseStateSelectors.js";
import { normalizeRouteChoice } from "./routeLog.js";
import {
  applyActionMark,
  canCompleteNightAction,
  caseKey,
  casePatienceLost,
  completeNightAction,
  evidenceChecksFor,
  initialCaseBudget,
  initialNightStateFor,
  initialOvernightStateFor,
  keyQuestionLimit,
  nightActionCountsForBudget,
  nightStructureFor,
  playableSceneCount,
  recordPatienceLostState,
  retryPatienceLostState
} from "./sceneAdvance.js";

export function createCaseStateWrites(ctx) {
  const {
    getState,
    setState,
    saveState,
    render,
    clearQuestionRewindHistory,
    areaTotalForRetry
  } = ctx;

  function retryPatienceLostStep(brief) {
    const state = getState();
    const context = state.patienceLostContext ?? {};
    setState(retryPatienceLostState({
      state,
      brief,
      context,
      budget: ensureBudget(brief),
      areaTotal: areaTotalForRetry(brief, context.area ?? "sceneReview")
    }));
    saveState();
    render();
  }

  function resetCaseAttempt(brief) {
    clearQuestionRewindHistory();
    const state = getState();
    const key = caseKey(brief);
    state.scene = "caseOpen";
    state.sceneQuestionFocus = null;
    state.dialogueProgress = removeKeyPrefix(state.dialogueProgress, `${key}:`);
    state.sceneAnswers = removeKeyPrefix(state.sceneAnswers, `${key}:`);
    state.sceneQuestionPicks = removeKeyPrefix(state.sceneQuestionPicks, `${key}:`);
    state.sceneDialoguePicks = removeKeyPrefix(state.sceneDialoguePicks, `${key}:`);
    state.statementReviewAttempts = removeKeyPrefix(state.statementReviewAttempts, `${key}:`);
    state.statementPatience = removeKeyPrefix(state.statementPatience, `${key}:`);
    state.activeStatementLineId = null;
    state.evidenceCheckPicks = removeKeyPrefix(state.evidenceCheckPicks, `${key}:`);
    state.investigationPicks = removeKeyPrefix(state.investigationPicks, `${key}:`);
    state.delegationPicks = omitRecordKey(state.delegationPicks, key);
    state.stanceSnapshots = omitRecordKey(state.stanceSnapshots, key);
    state.liveCounterPicks = removeKeyPrefix(state.liveCounterPicks, `${key}:`);
    state.activeLiveCounterBeatId = null;
    state.pendingQuestionPressureSignal = null;
    state.pendingQuestionPressureSource = null;
    state.truthBoundaryPicks = omitRecordKey(state.truthBoundaryPicks, key);
    state.truthBoundaryMisses = omitRecordKey(state.truthBoundaryMisses, key);
    state.routeChoiceLog = { ...(state.routeChoiceLog ?? {}), [key]: [] };
    state.caseActionLog = omitRecordKey(state.caseActionLog, key);
    state.contradictionLog = omitRecordKey(state.contradictionLog, key);
    state.accusationHistory = (state.accusationHistory ?? []).filter((item) => item.caseId !== key);
    state.solvedCaseIds = (state.solvedCaseIds ?? []).filter((item) => item !== key);
    state.caseInterludes = omitRecordKey(state.caseInterludes, key);
    state.caseBudgets = omitRecordKey(state.caseBudgets, key);
    state.caseNights = omitRecordKey(state.caseNights, key);
    state.caseOvernights = omitRecordKey(state.caseOvernights, key);
    state.recapStep = 0;
    state.patienceLostContext = null;
    saveState();
    render();
  }

  function markAction(brief, actionKey, { spend = false } = {}) {
    const state = getState();
    const key = caseKey(brief);
    const previousRemaining = Number(ensureBudget(brief).remaining ?? 0);
    const patch = applyActionMark({
      caseActionLog: state.caseActionLog,
      caseId: key,
      actionKey,
      budget: ensureBudget(brief),
      spend
    });
    state.caseBudgets = { ...(state.caseBudgets ?? {}), [key]: patch.budget };
    state.caseActionLog = patch.caseActionLog;
    if (patch.budget && Number(patch.budget.remaining ?? 0) < previousRemaining) {
      state.lastScreenEffect = state.lastScreenEffect ?? "patience-drop";
    }
  }

  function audiencePatienceLost(brief, context = {}) {
    const state = getState();
    const budget = ensureBudget(brief);
    if (!casePatienceLost({
      budget,
      answeredScenes: answeredSceneCountForState(state, brief),
      requiredScenes: playableSceneCount(brief),
      answeredEvidence: answeredEvidenceCountForState(state, brief),
      requiredEvidence: evidenceChecksFor(brief).length
    })) return false;
    recordPatienceLost(brief, context);
    return true;
  }

  function recordPatienceLost(brief, context = {}) {
    setState(recordPatienceLostState({ state: getState(), brief, context }));
    saveState();
    render();
    return true;
  }

  function actionDone(brief, actionKey) {
    return Boolean(getState().caseActionLog?.[caseKey(brief)]?.[actionKey]);
  }

  function ensureBudget(brief) {
    const state = getState();
    const key = caseKey(brief);
    if (state.caseBudgets?.[key]) return state.caseBudgets[key];
    const max = calculateCaseBudgetMax({ brief });
    state.caseBudgets = {
      ...(state.caseBudgets ?? {}),
      [key]: initialCaseBudget(max)
    };
    return state.caseBudgets[key];
  }

  function ensureNight(brief) {
    const state = getState();
    const key = caseKey(brief);
    if (state.caseNights?.[key]) return state.caseNights[key];
    const night = initialNightStateFor(brief);
    state.caseNights = {
      ...(state.caseNights ?? {}),
      [key]: night
    };
    return night;
  }

  function ensureOvernight(brief) {
    const state = getState();
    const key = caseKey(brief);
    if (state.caseOvernights?.[key]) return state.caseOvernights[key];
    const overnight = initialOvernightStateFor(brief);
    state.caseOvernights = {
      ...(state.caseOvernights ?? {}),
      [key]: overnight
    };
    return overnight;
  }

  function updateNight(brief, patch = {}) {
    const state = getState();
    const key = caseKey(brief);
    state.caseNights = {
      ...(state.caseNights ?? {}),
      [key]: {
        ...ensureNight(brief),
        ...patch
      }
    };
    return state.caseNights[key];
  }

  function updateOvernight(brief, patch = {}) {
    const state = getState();
    const key = caseKey(brief);
    state.caseOvernights = {
      ...(state.caseOvernights ?? {}),
      [key]: {
        ...ensureOvernight(brief),
        ...patch
      }
    };
    return state.caseOvernights[key];
  }

  function interludeActionState(structure = {}, night = {}, action = {}) {
    const done = (night.interludeActionsDone ?? []).includes(action.id);
    const readiness = canCompleteNightAction(night, action, structure);
    return {
      action,
      done,
      disabled: !done && !readiness.ok,
      disabledReason: readiness.reason === "budget"
        ? "预算不足"
        : readiness.reason === "max-actions"
          ? "行动已满"
          : ""
    };
  }

  function completeInterludeAction(brief, action = {}, { renderNow = true } = {}) {
    const state = getState();
    const structure = nightStructureFor(brief);
    const nextNight = completeNightAction(ensureNight(brief), action, structure);
    state.caseNights = {
      ...(state.caseNights ?? {}),
      [caseKey(brief)]: nextNight
    };
    markAction(brief, `interlude:${action.id}`);
    if (renderNow) {
      state.lastReaction = "这件先记下。";
      saveState();
      render();
    }
    return nextNight;
  }

  function nextPendingInterruptAction(brief, night = {}) {
    return (nightStructureFor(brief)?.interlude?.actions ?? [])
      .find((action) => action.kind === "interruptToast" && !(night.interludeActionsDone ?? []).includes(action.id)) ?? null;
  }

  function countCompletedInterludeActions(brief, night = {}) {
    const structure = nightStructureFor(brief);
    return (night.interludeActionsDone ?? []).filter((id) => nightActionCountsForBudget(structure, id)).length;
  }

  function recordInterludeActionChoice(brief, action = {}, choiceId = "") {
    const choice = (action.options ?? action.choices ?? []).find((item) => item.id === choiceId);
    if (!choice) return;
    completeInterludeAction(brief, action, { renderNow: false });
    const night = ensureNight(brief);
    const inventory = [...new Set([...(night.inventory ?? []), ...(choice.grantsInventory ?? [])])];
    const interludeChoicesDone = [...new Set([...(night.interludeChoicesDone ?? []), choice.id])];
    updateNight(brief, {
      activeActionId: action.id,
      inventory,
      interludeChoicesDone,
      interludeActionChoices: {
        ...(night.interludeActionChoices ?? {}),
        [action.id]: choice.id
      },
      stanceNudge: choice.stanceNudge ?? night.stanceNudge ?? null
    });
    recordRouteChoice(brief, interludeRouteIndexFor(brief, action), {
      question: action.label ?? "幕间抉择",
      answer: choice.label ?? choice.advisorLine ?? "",
      routeAxis: choice.routeAxis ?? action.routeAxis ?? "outer-thread",
      routeTone: action.npcVerb ? `npc-${action.npcVerb}` : "interlude-choice"
    }, { version: action.summary ?? action.text ?? "" });
    getState().lastReaction = "这套框架先记下。";
    saveState();
    render();
  }

  function recordInterludeReplyChoice(brief, action = {}, choices = [], choiceId = "") {
    const choice = choices.find((item) => item.id === choiceId);
    if (!choice) return;
    const night = ensureNight(brief);
    const inventory = [...new Set([...(night.inventory ?? []), ...(choice.grantsInventory ?? [])])];
    const interludeChoicesDone = [...new Set([...(night.interludeChoicesDone ?? []), choice.id])];
    updateNight(brief, {
      inventory,
      interludeChoicesDone,
      interludeReplyChoices: {
        ...(night.interludeReplyChoices ?? {}),
        [action.id]: choice.id
      },
      stanceNudge: choice.stanceNudge ?? night.stanceNudge ?? null
    });
    completeInterludeAction(brief, action, { renderNow: false });
    recordRouteChoice(brief, interludeRouteIndexFor(brief, action), {
      question: "回后台私信",
      answer: choice.label ?? "",
      routeAxis: choice.routeAxis ?? action.routeAxis ?? "outer-thread",
      routeTone: "reply-choice"
    }, { version: action.summary ?? "" });
    getState().lastReaction = "这句回出去了。";
    saveState();
    render();
  }

  function interludeRouteIndexFor(brief = {}, action = {}) {
    const actions = nightStructureFor(brief)?.interlude?.actions ?? [];
    const actionIndex = Math.max(0, actions.findIndex((item) => item.id === action.id));
    return keyQuestionLimit(brief) + evidenceChecksFor(brief).length + 0.1 + actionIndex / 100;
  }

  function closeInterludeAction(brief) {
    updateNight(brief, { activeActionId: null });
    saveState();
    render();
  }

  function recordContradiction(brief, contradiction) {
    if (!contradiction) return;
    const state = getState();
    const key = caseKey(brief);
    const current = state.contradictionLog?.[key] ?? [];
    if (current.includes(contradiction)) return;
    state.contradictionLog = {
      ...(state.contradictionLog ?? {}),
      [key]: [...current, contradiction].slice(-32)
    };
  }

  function recordRouteChoice(brief, sceneIndex, option = {}, scene = {}) {
    const state = getState();
    const key = caseKey(brief);
    const current = (state.routeChoiceLog?.[key] ?? []).filter((item) => item.sceneIndex !== sceneIndex);
    const entry = normalizeRouteChoice(sceneIndex, option, scene);
    state.routeChoiceLog = {
      ...(state.routeChoiceLog ?? {}),
      [key]: [...current, entry].sort((a, b) => a.sceneIndex - b.sceneIndex)
    };
  }

  return {
    actionDone,
    audiencePatienceLost,
    closeInterludeAction,
    completeInterludeAction,
    countCompletedInterludeActions,
    ensureBudget,
    ensureNight,
    ensureOvernight,
    interludeActionState,
    markAction,
    nextPendingInterruptAction,
    recordContradiction,
    recordInterludeActionChoice,
    recordInterludeReplyChoice,
    recordPatienceLost,
    recordRouteChoice,
    resetCaseAttempt,
    retryPatienceLostStep,
    updateNight,
    updateOvernight
  };
}

export function upsertCaseResultById(items = [], result) {
  const next = (items ?? []).filter((item) => item.caseId !== result.caseId);
  return [...next, result];
}

export function removeKeyPrefix(record = {}, prefix) {
  return Object.fromEntries(Object.entries(record ?? {}).filter(([key]) => !key.startsWith(prefix)));
}

export function omitRecordKey(record = {}, keyToOmit) {
  return Object.fromEntries(Object.entries(record ?? {}).filter(([key]) => key !== keyToOmit));
}
