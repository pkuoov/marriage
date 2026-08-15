import {
  calculateCaseOutcome,
  calculateIssueCompletion,
  expectedAccusationForCase,
  relationshipExpectedAccusationForCase,
  resolveFinalQuoteForCase
} from "../caseRuntime.js";
import { platformRuntime } from "../platformRuntime.js";
import { saveMetaSnapshot } from "../state.js";
import {
  contradictionsForState,
  routeAxisProfileForState,
  selectedInvestigationPickForState,
  unlockedInvestigationEntriesForState
} from "./caseStateSelectors.js";
import {
  dailyPlayerType,
  dailyRouteProfile as buildDailyRouteProfile
} from "./recapModel.js";
import {
  dailyAccusationReadiness as accusationReadinessForCase,
  playableSceneCount
} from "./sceneAdvance.js";
import { upsertCaseResultById } from "./caseStateWrites.js";

export function createCaseOutcome(ctx) {
  const {
    getState,
    getMeta,
    setMeta,
    saveState,
    render,
    ensureBudget,
    actionDone,
    isStoryPackMode,
    clearQuestionRewindHistory,
    activeCaseBrief
  } = ctx;

  function resolveAccusationFromButton(brief, button) {
    const state = getState();
    const accuseLabel = button.getAttribute("data-accuse-label") ?? button.textContent?.trim() ?? "";
    const response = button.getAttribute("data-accuse-response") ?? "";
    const accused = button.getAttribute("data-accuse") ?? "";
    const issue = issueCompletion(brief);
    const quoteResult = resolveFinalQuoteForCase({
      brief,
      selectedQuote: accused,
      issue
    });
    const result = {
      caseId: brief.id,
      ...quoteResult,
      contradictionCount: contradictionsForState(state, brief).length,
      issuePercent: issue.percent,
      issueRevealed: issue.revealed,
      issueMissed: issue.missed
    };
    result.dailyAccuseLabel = accuseLabel;
    result.dailyResponse = response;
    result.dailyRoute = routeProfileForBrief(brief, result);
    state.accusationHistory = upsertCaseResultById(state.accusationHistory, result);
    state.solvedCaseIds = [...new Set([...(state.solvedCaseIds ?? []), brief.id])];
    applyOutcome(brief, result);
    recordDailyMeta(brief, result, issue);
    state.scene = unlockedInvestigationEntriesForState(state, brief)
      .some((entry) => !selectedInvestigationPickForState(state, brief, entry.index))
      ? "investigationBackflow"
      : "caseSolved";
    state.recapStep = 0;
    saveState();
    render();
  }

  function normalizedDailyResult(brief) {
    const state = getState();
    const current = state.accusationHistory?.find((item) => item.caseId === brief.id);
    const issue = issueCompletion(brief);
    return {
      ...(current ?? {}),
      caseId: brief.id,
      accused: current?.accused ?? null,
      expected: expectedAccusationForCase(brief),
      relationshipExpected: current?.relationshipExpected ?? relationshipExpectedForResult(brief),
      correct: current?.correct ?? false,
      deductionComplete: current?.deductionComplete ?? current?.correct ?? false,
      dailyAccuseLabel: current?.dailyAccuseLabel ?? "还没选最后那句",
      dailyResponse: current?.dailyResponse ?? "",
      contradictionCount: contradictionsForState(state, brief).length,
      issuePercent: issue.percent,
      issueRevealed: issue.revealed,
      issueMissed: issue.missed,
      dailyBadge: current?.dailyBadge ?? current?.deductionComplete ?? current?.correct ?? false,
      quoteHit: current?.quoteHit ?? false
    };
  }

  function issueCompletion(brief) {
    const state = getState();
    return calculateIssueCompletion({
      brief,
      foundContradictions: contradictionsForState(state, brief),
      requiredLimit: playableSceneCount(brief)
    });
  }

  function relationshipExpectedForResult(brief) {
    return relationshipExpectedAccusationForCase(brief);
  }

  function accusationReadinessForBrief(brief) {
    return accusationReadinessForCase(brief, (actionKey) => actionDone(brief, actionKey));
  }

  function applyOutcome(brief, result) {
    const state = getState();
    if (state.caseInterludes?.[brief.id]) return;
    const budget = ensureBudget(brief);
    const outcome = calculateCaseOutcome({
      result,
      contradictionCount: contradictionsForState(state, brief).length,
      budgetRemaining: budget.remaining
    });
    state.caseInterludes = { ...(state.caseInterludes ?? {}), [brief.id]: outcome.interlude };
  }

  function recordDailyMeta(brief, result, issue) {
    const state = getState();
    const meta = getMeta();
    const nextMeta = {
      ...meta,
      runs: Number(meta.runs ?? 0) + 1,
      history: [
        {
          caseId: brief.id,
          dailyKey: brief.dailyKey,
          plotId: brief.plotId,
          issuePercent: issue.percent,
          dailyBadge: Boolean(result.dailyBadge),
          routeAxis: routeAxisProfileForState(state, brief, result).axis,
          playerType: dailyPlayerType({
            percent: issue.percent,
            quoteHit: result.quoteHit,
            accused: result.accused
          }),
          at: Date.now()
        },
        ...(Array.isArray(meta.history) ? meta.history : [])
      ].slice(0, 30)
    };
    setMeta(nextMeta);
    saveMetaSnapshot(nextMeta);
  }

  function routeProfileForBrief(brief, result = {}) {
    const state = getState();
    return buildDailyRouteProfile(brief, result, {
      issue: issueCompletion(brief),
      axisProfile: routeAxisProfileForState(state, brief, result)
    });
  }

  function postDailySharePayload(brief, route, result) {
    const mode = isStoryPackMode() ? "episode" : "daily";
    const storyKey = brief.storyKey ?? brief.weeklyKey ?? "";
    const shareQuery = `mode=${encodeURIComponent(mode)}&dailyKey=${encodeURIComponent(brief.dailyKey ?? "")}&storyKey=${encodeURIComponent(storyKey)}`;
    platformRuntime.postMessage({
      type: "daily-share",
      dailyKey: brief.dailyKey,
      storyKey,
      solved: Boolean(result.dailyBadge),
      issuePercent: Number(result.issuePercent ?? 0),
      dailyBadge: Boolean(result.dailyBadge),
      playerType: route.playerType,
      title: route.shareTitle,
      body: route.shareBody,
      question: route.shareQuestion,
      shareQuery,
      shareUrl: `?${shareQuery}`
    });
  }

  function isFinalStoryPackCase() {
    const state = getState();
    return Number(state.chapter ?? 1) >= (state.caseBriefs?.length ?? 1);
  }

  function advanceToNextStoryPackCase(message = "新的来电接进来，上一通留给弹幕吵。") {
    clearQuestionRewindHistory();
    const state = getState();
    state.chapter = Math.min(Number(state.chapter ?? 1) + 1, state.caseBriefs?.length ?? 1);
    state.caseBrief = activeCaseBrief();
    state.scene = "caseTitle";
    state.recapStep = 0;
    state.patienceLostContext = null;
    void message;
    state.lastReaction = null;
    state.lastPressureSignal = null;
    state.pendingQuestionPressureSignal = null;
    state.pendingQuestionPressureSource = null;
    state.lastPressureAxis = null;
    state.lastScreenEffect = null;
    saveState();
    render();
  }

  return {
    accusationReadinessForBrief,
    advanceToNextStoryPackCase,
    isFinalStoryPackCase,
    issueCompletion,
    normalizedDailyResult,
    postDailySharePayload,
    relationshipExpectedForResult,
    resolveAccusationFromButton,
    routeProfileForBrief
  };
}
