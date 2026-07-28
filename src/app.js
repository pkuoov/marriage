import { generateCasesForMode } from "./caseModes.js";
import { calculateCaseBudgetMax, calculateCaseOutcome, calculateIssueCompletion, expectedAccusationForCase, relationshipExpectedAccusationForCase, resolveAccusationForCase } from "./caseRuntime.js";
import { getAudioSettings, playAudioCueOnce, playSfx, resetAudioCueHistory } from "./sound.js";
import { audioCueView } from "./audioCatalog.js";
import { CHARACTER_ART, baseState, clearStateSnapshot, loadMeta, loadState, saveMetaSnapshot, saveStateSnapshot } from "./state.js";
import { platformRuntime } from "./platformRuntime.js";
import { NPCS } from "./story.js";
import { dailyAccusationChoices } from "./dailyChoices.js";
import { gamepadAxisDirection, keyboardNavigationIntent, nextFocusIndex } from "./runtime/inputNavigation.js";
import { materialOperationOutcome } from "./runtime/materialOperation.js";
import { unlockedMaterialProfile } from "./runtime/materialVisibility.js";
import { answeredEvidenceCountForState, answeredSceneCountForState, askedDialoguePicksForState, completedSceneExchangeForState, contradictionsForState, latestChoiceReviewRowsForState, routeAxisProfileForState, routeChoicesForState, selectedDelegationPickForState, selectedEvidencePickForState, selectedEvidencePicksForState, selectedInvestigationPickForState, selectedInvestigationPicksForState, selectedScenePickForState, selectedScenePicksForState, truthBoundaryMissesForState, truthBoundaryPicksForState, unlockedInvestigationEntriesForState } from "./runtime/caseStateSelectors.js";
import { dailyConclusionModel, dailyPlayerType, dailyRouteProfile as buildDailyRouteProfile, finalQuoteComparison, investigationPickReaction, issueLine, issueResultLine, recapRankLabel, truthBoundaryAftertaste, truthBoundaryReview } from "./runtime/recapModel.js";
import { livePressureProfile, materialPressureReaction, materialPressureSignal, pressuredAnswerVariant, questionPressureReaction, questionPressureSignal } from "./runtime/livePressure.js";
import { normalizeRouteChoice, routeAxisForChoice, routeToneForChoice } from "./runtime/routeLog.js";
import { afterEvidenceScene as nextSceneAfterEvidence, afterSceneEvidenceFor, answerKey, applyActionMark, availableCallbackOpeners, availableOvernightCallbackOpeners, callbackOpenerById, canCompleteNightAction, canEnterOvernightCallback, caseKey, casePatienceLost, completeNightAction, dailyAccusationReadiness as accusationReadinessForCase, daySceneById, delegationFor, delegationOutcomeFor, delegationRouteAxisForAdvisor, documentById, documentRowById, documentQuestionId, earnedDocumentQuestionsFor, evidenceAnswerKey, evidenceCheckModel, evidenceChecksFor, firstUnansweredSceneIndex as firstOpenSceneIndex, initialCaseBudget, initialNightStateFor, initialOvernightStateFor, interludeEarnedItemsForOvernight, investigationAnswerKey, investigationBackflowModel, investigationRouteIndexBase, keyQuestionLimit, liveCounterBeatAfterScene, liveCounterBeatBeforeScene, liveCounterBeatById, liveCounterBeatsFor, nightActionById, nightActionCountsForBudget, nightStructureFor, overnightCallbackDialogueLines, overnightCallbackOpenerById, overnightCallerQuestionFor, overnightFirstNight2SceneIndex, overnightReturnPostureFor, overnightStructureFor, pendingEvidenceChecksFor, recordPatienceLostState, retryPatienceLostState, returnStanceFor, sceneReviewModel, shouldEnterHangupAfterScene, shouldEnterOvernightHangupAfterScene, snapshotEchoFor, stanceSnapshotForScene } from "./runtime/sceneAdvance.js";
import { storyInterludeCaseId } from "./runtime/storyInterludeModel.js";
import { careChoiceById, careChoicesFor } from "./runtime/careChoiceModel.js";
import { epilogueUnreadStage } from "./runtime/epilogueUnreadModel.js";
import { advanceQuickTranscript, applyQuickQuoteSelection, continueQuickCrowd, continueQuickInvestigation, initialQuickDetectiveState, normalizeQuickDetectiveState, revealNextCrowdFlaw } from "./runtime/quickDetectiveModel.js";
import { hostDisclosureLinesForAnchor } from "./runtime/hostDisclosureModel.js";
import { CHOICE_COST_META } from "./runtime/choiceCostModel.js";
import { mountDialoguePresentation } from "./runtime/dialoguePresentation.js";
import { refreshSavedCaseContent } from "./runtime/savedContentRefresh.js";
import { storyBoundaryRows, storyMaterialRows, storyPackSummaryModel, storyPressureRows } from "./runtime/storyPackSummaryModel.js";
import { callDialogueHtml, choiceButtonBodyHtml, choiceGroupHtml, choiceReviewHtml, flowGroupHtml } from "./ui/callFlowView.js";
import { dailyCompleteChoicesHtml, dailyCompleteHtml, dailyCompleteShareText } from "./ui/dailyCompleteView.js";
import { delegationScreenHtml, evidenceCheckScreenHtml, investigationBackflowScreenHtml } from "./ui/evidenceView.js";
import { audioPlaybackControlsHtml, callbackOpenerBeatHtml, callbackOpenerChoiceHtml, hangupBeatHtml, interludeConflictActionHtml, interludeDeskHtml, interludeDialogueActionHtml, interludePlaybackActionHtml, interruptToastHtml, replyChoicesHtml } from "./ui/interludeDeskView.js";
import { bindAudioControls, syncSceneAudio, watchAudioPlaybackControls } from "./ui/audioController.js";
import { audiencePatienceHudHtml, callerArtForExpression, callerExpressionForView, caseProgressStripHtml, liveCommentStripHtml, portraitLayerHtml, storyPackSummaryHudHtml } from "./ui/liveCallView.js";
import { liveCounterBeatHtml } from "./ui/liveCounterBeatView.js";
import { liveControlDeckHtml, liveFrameHtml } from "./ui/liveFrameView.js";
import { avgSystemBarHtml, mountCourtRecord } from "./ui/courtRecordView.js";
import { finalQuoteComparisonHtml, solvedRecapFlowView, solvedRecapPagesHtml } from "./ui/recapView.js";
import { routeTrailHtml } from "./ui/routeTrailView.js";
import { focusedQuestionOptions, sceneDialogueOptions, sceneQuestionMenuHtml } from "./ui/sceneQuestions.js";
import { completedSceneExchangeHtml, scenePromptExchangeHtml, sceneQuestionAnswerHtml, sceneReviewDoneChoicesHtml, sceneReviewHtml, stanceSnapshotHtml } from "./ui/sceneReviewView.js";
import { storyInterludeChoicesHtml, storyInterludeHtml } from "./ui/storyInterludeView.js";
import { caseBridgeChoicesHtml, caseBridgeHtml, caseClosingChoicesHtml, caseClosingHtml, caseTitleChoicesHtml, caseTitleHtml } from "./ui/caseTransitionView.js";
import { careChoiceContinueHtml, careChoiceHtml } from "./ui/careChoiceView.js";
import { epilogueUnreadContinueHtml, epilogueUnreadHtml } from "./ui/epilogueUnreadView.js";
import { storyPackCompleteHtml, storyPackShareText } from "./ui/storyPackCompleteView.js";
import { titleScreenHtml } from "./ui/titleView.js";
import { quickDetectiveCrowdAssistHtml, quickDetectiveFeedbackHtml, quickDetectiveHudHtml, quickDetectiveIntroHtml, quickDetectiveInvestigationHtml, quickDetectiveTranscriptHtml, quickDetectiveVerdictHtml } from "./ui/quickDetectiveView.js";
import { CONTENT_ADVISORS, CONTENT_HELPER_NPCS } from "./generated/contentPackIndex.js";
import { quickDetectiveCaseFor, storyPackForKey } from "./storyPacks.js";
import { HOST_PROFILE } from "./hostProfile.js";
import { createOvernightScreens } from "./ui/screens/overnightScreens.js";
import { createInterludeScreens } from "./ui/screens/interludeScreens.js";
import { createSceneScreens } from "./ui/screens/sceneScreens.js";
import { createRecapScreens } from "./ui/screens/recapScreens.js";

const app = document.querySelector("#app");
const PRODUCT_NAME = "深夜热线：直播间侦探";
const DEFAULT_ATTRS = { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 };
const SCENE_HELPER = CONTENT_HELPER_NPCS["v-bro"] ?? null;

const startsFresh = hasFreshStartParam();
if (startsFresh) clearStateSnapshot();
const loadedState = startsFresh ? null : loadState();
let state = normalizeDailyState(loadedState ?? structuredClone(baseState));
if (!startsFresh && state.caseBriefs.length) {
  state = refreshSavedCaseContent(state, {
    generateCases: (npcs, attrs, options) => generateCasesForMode(state.caseMode, npcs, attrs, options),
    npcs: NPCS
  });
}
// Screen handlers read ctx.getState() when invoked; cache the factory, never the state object.
let dailyScreenRenderers = null;
if (!startsFresh && loadedState?.screen === "chapter" && state.caseBriefs.length) state.screen = "title";
let meta = loadMeta();
let gamepadPollingStarted = false;
let gamepadPreviousButtons = {};
let lastGamepadMoveAt = 0;
let shownPixelTransitions = new Set();
let titleNewGameConfirmation = false;

watchAudioPlaybackControls({ getRoot: () => app });

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  if (button.hasAttribute("data-audio-mute")) return;
  if (button.matches("[data-start-story], [data-start-quick-detective], [data-continue-story], [data-request-new-game], [data-confirm-new-game], [data-cancel-new-game], [data-enter-first-case]")) return;
  if (button.matches("[data-evidence-check], [data-document-row]")) return;
  playSfx(button.classList.contains("primary") || button.dataset.accuse ? "confirm" : "click");
});

document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || keyEventInTextInput(event)) return;
  if (event.key === "a" || event.key === "A") {
    event.preventDefault();
    cycleAvgSetting("auto");
    return;
  }
  const intent = keyboardNavigationIntent(event.key);
  if (intent === "confirm") {
    const dialogue = currentDialogueAdvance();
    if (dialogue) {
      event.preventDefault();
      dialogue.click();
      return;
    }
    const button = document.activeElement?.matches?.("button") ? document.activeElement : preferredDefaultButton();
    if (!button) return;
    event.preventDefault();
    activateButton(button);
    return;
  }
  if (intent === "next") {
    event.preventDefault();
    moveButtonFocus(1);
    return;
  }
  if (intent === "previous") {
    event.preventDefault();
    moveButtonFocus(-1);
    return;
  }
  if (intent === "review") {
    if (!toggleReviewPanel()) return;
    event.preventDefault();
    return;
  }
  if (intent === "back") {
    if (closeTopOverlay()) {
      event.preventDefault();
      return;
    }
    const backButton = preferredBackButton();
    if (!backButton) return;
    event.preventDefault();
    activateButton(backButton);
  }
});

globalThis.addEventListener?.("gamepadconnected", () => startGamepadPolling());
startGamepadPolling();

function normalizeDailyState(saved) {
  const mode = saved?.caseMode === "daily" ? "daily" : "episode";
  return {
    ...structuredClone(baseState),
    ...saved,
    screen: ["chapter", "quickDetective"].includes(saved?.screen) ? saved.screen : "title",
    caseMode: mode,
    chapter: Math.max(1, Number(saved?.chapter ?? 1)),
    attrs: { ...DEFAULT_ATTRS, ...(saved?.attrs ?? {}) },
    caseBriefs: Array.isArray(saved?.caseBriefs) ? saved.caseBriefs : [],
    caseBrief: saved?.caseBrief ?? saved?.caseBriefs?.[0] ?? null,
    scene: saved?.scene ?? "caseOpen",
    dialogueProgress: saved?.dialogueProgress ?? {},
    sceneAnswers: saved?.sceneAnswers ?? {},
    sceneQuestionPicks: saved?.sceneQuestionPicks ?? {},
    sceneDialoguePicks: saved?.sceneDialoguePicks ?? {},
    helperHintPicks: saved?.helperHintPicks ?? {},
    sceneQuestionFocus: saved?.sceneQuestionFocus ?? null,
    evidenceCheckPicks: saved?.evidenceCheckPicks ?? {},
    investigationPicks: saved?.investigationPicks ?? {},
    delegationPicks: saved?.delegationPicks ?? {},
    stanceSnapshots: saved?.stanceSnapshots ?? {},
    liveCounterPicks: saved?.liveCounterPicks ?? {},
    activeLiveCounterBeatId: saved?.activeLiveCounterBeatId ?? null,
    truthBoundaryPicks: saved?.truthBoundaryPicks ?? {},
    truthBoundaryMisses: saved?.truthBoundaryMisses ?? {},
    materialPityLog: saved?.materialPityLog ?? {},
    routeChoiceLog: saved?.routeChoiceLog ?? {},
    caseActionLog: saved?.caseActionLog ?? {},
    caseBudgets: saved?.caseBudgets ?? {},
    caseNights: saved?.caseNights ?? {},
    caseOvernights: saved?.caseOvernights ?? {},
    contradictionLog: saved?.contradictionLog ?? {},
    accusationHistory: Array.isArray(saved?.accusationHistory) ? saved.accusationHistory : [],
    solvedCaseIds: Array.isArray(saved?.solvedCaseIds) ? saved.solvedCaseIds : [],
    caseInterludes: saved?.caseInterludes ?? {},
    storyWorldEchoes: saved?.storyWorldEchoes ?? {},
    careChoices: saved?.careChoices ?? {},
    epilogueUnreadStep: Number(saved?.epilogueUnreadStep ?? 0),
    lastReaction: saved?.lastReaction ?? null,
    lastPressureSignal: saved?.lastPressureSignal ?? null,
    lastPressureAxis: saved?.lastPressureAxis ?? null,
    lastPityLine: saved?.lastPityLine ?? null,
    patienceLostContext: saved?.patienceLostContext ?? null,
    quickDetective: saved?.quickDetective ?? null,
    settings: { ...baseState.settings, ...(saved?.settings ?? {}) }
  };
}

function saveState() {
  saveStateSnapshot(state);
}

function activeCaseBrief() {
  return state.caseBriefs?.[Math.max(0, Number(state.chapter ?? 1) - 1)] ?? state.caseBrief ?? null;
}

function isStoryPackMode() {
  return state.caseMode !== "daily";
}

function dailyKeyFromUrl() {
  try {
    return new URLSearchParams(globalThis.location?.search ?? "").get("dailyKey") || undefined;
  } catch {
    return undefined;
  }
}

function storyKeyFromUrl() {
  try {
    const params = new URLSearchParams(globalThis.location?.search ?? "");
    return params.get("storyKey") || params.get("packKey") || params.get("weeklyKey") || undefined;
  } catch {
    return undefined;
  }
}

function modeFromUrl() {
  try {
    const mode = new URLSearchParams(globalThis.location?.search ?? "").get("mode");
    return mode === "daily" ? "daily" : "episode";
  } catch {
    return "episode";
  }
}

function hasFreshStartParam() {
  try {
    const url = new URL(globalThis.location?.href ?? "https://local.invalid/");
    if (url.searchParams.get("fresh") !== "1") return false;
    url.searchParams.delete("fresh");
    globalThis.history?.replaceState?.(null, "", `${url.pathname}${url.search}${url.hash}`);
    return true;
  } catch {
    return false;
  }
}

function startStoryPack() {
  titleNewGameConfirmation = false;
  resetAudioCueHistory();
  shownPixelTransitions = new Set();
  const mode = modeFromUrl();
  const caseBriefs = generateCasesForMode(mode, NPCS, DEFAULT_ATTRS, {
    dailyKey: dailyKeyFromUrl(),
    storyKey: storyKeyFromUrl(),
    runNumber: meta.runs ?? 0
  });
  // Replace the whole state object; memoized screen handlers follow through ctx.getState().
  state = normalizeDailyState({
    ...structuredClone(baseState),
    screen: "chapter",
    scene: mode === "daily" || !nightShellForStoryKey(caseBriefs[0]?.storyKey ?? storyKeyFromUrl())?.prologue ? "caseOpen" : "nightShellPrologue",
    profileDone: true,
    caseMode: mode,
    chapter: 1,
    attrs: DEFAULT_ATTRS,
    caseBriefs,
    caseBrief: caseBriefs[0]
  });
  saveState();
  render();
}

function startQuickDetective() {
  const packet = activeQuickDetectiveCase();
  if (!packet) return;
  titleNewGameConfirmation = false;
  state.screen = "quickDetective";
  state.quickDetective = initialQuickDetectiveState(packet);
  saveState();
  render();
}

function storyPreviewBriefs() {
  try {
    return generateCasesForMode(modeFromUrl(), NPCS, DEFAULT_ATTRS, {
      dailyKey: dailyKeyFromUrl(),
      storyKey: storyKeyFromUrl(),
      runNumber: meta.runs ?? 0
    });
  } catch {
    return [];
  }
}

function continueStoryPack() {
  if (!canContinueJourney()) return startStoryPack();
  titleNewGameConfirmation = false;
  state.screen = "chapter";
  saveState();
  render();
}

function returnToTitle() {
  titleNewGameConfirmation = false;
  shownPixelTransitions = new Set();
  state.screen = "title";
  saveState();
  render();
}

function resetToTitle() {
  clearStateSnapshot();
  titleNewGameConfirmation = false;
  shownPixelTransitions = new Set();
  // Replace the whole state object; memoized screen handlers follow through ctx.getState().
  state = normalizeDailyState(structuredClone(baseState));
  state.screen = "title";
  saveState();
  render();
}

function render() {
  if (!app) return;
  if (state.screen === "title") return renderTitle();
  if (state.screen === "quickDetective") return renderQuickDetective();
  if (!activeCaseBrief()) return renderTitle();
  return renderDailyCase();
}

function renderTitle() {
  const previews = storyPreviewBriefs();
  const preview = previews[0] ?? null;
  const storyPack = modeFromUrl() !== "daily";
  const pack = storyPack ? storyPackForKey(storyKeyFromUrl()) : null;
  const title = storyPack ? "Steam 试玩版" : preview?.dailyShareTitle ?? preview?.label ?? "今日来电有点东西";
  const hook = storyPack ? "晚上八点，你推开直播间的门。第一通匿名来电，还在等待接入。" : preview?.publicHook ?? "一通匿名来电已经接进来，第一句还没说完。";
  const object = storyPack ? "今晚 20:00 · 开播前" : preview?.storyClueObject ?? "今日通话摘录";
  const canContinue = canContinueJourney();
  app.innerHTML = titleScreenHtml({
    productName: PRODUCT_NAME,
    storyPack,
    title,
    hook,
    object,
    themeTitle: pack?.theme?.title ?? "",
    acts: pack?.sequence ?? [],
    host: HOST_PROFILE,
    audioSettings: getAudioSettings(),
    canContinue,
    resumeLabel: resumeStageLabel(),
    confirmNewGame: canContinue && titleNewGameConfirmation,
    quickModeAvailable: storyPack && Boolean(activeQuickDetectiveCase())
  });
  bind("[data-start-story]", startStoryPack);
  bind("[data-start-quick-detective]", startQuickDetective);
  bind("[data-continue-story]", continueStoryPack);
  bind("[data-request-new-game]", () => {
    titleNewGameConfirmation = true;
    renderTitle();
  });
  bind("[data-confirm-new-game]", startStoryPack);
  bind("[data-cancel-new-game]", () => {
    titleNewGameConfirmation = false;
    renderTitle();
  });
  bindAudioControls({ root: app, onToggleSound: render });
  syncSceneAudio({ scene: "title" });
  queueDefaultFocus();
}

function activeQuickDetectiveCase() {
  return quickDetectiveCaseFor(storyKeyFromUrl());
}

function renderQuickDetective() {
  const packet = activeQuickDetectiveCase();
  if (!packet) {
    state.screen = "title";
    return renderTitle();
  }
  state.quickDetective = normalizeQuickDetectiveState(state.quickDetective, packet);
  const quickState = state.quickDetective;
  const body = {
    intro: () => quickDetectiveIntroHtml(packet),
    transcript: () => quickDetectiveTranscriptHtml(packet, quickState),
    investigation: () => quickDetectiveInvestigationHtml(packet, quickState),
    feedback: () => quickDetectiveFeedbackHtml(packet, quickState),
    crowdAssist: () => quickDetectiveCrowdAssistHtml(packet, quickState),
    crowdFeedback: () => quickDetectiveFeedbackHtml(packet, quickState, { crowd: true }),
    verdict: () => quickDetectiveVerdictHtml(packet, quickState)
  }[quickState.scene] ?? (() => quickDetectiveIntroHtml(packet));
  app.innerHTML = liveFrameHtml({
    productName: PRODUCT_NAME,
    modeLabel: "快速侦探",
    audioSettings: getAudioSettings(),
    backdropClass: "backdrop-live quick-detective-backdrop",
    label: packet.label,
    chapter: `${packet.title} · ${packet.durationLabel}`,
    text: body(),
    visualHud: quickDetectiveHudHtml(packet, quickState),
    screenClass: `quick-detective-screen quick-scene-${quickState.scene}`,
    controlDeckHtml: "",
    showRecordButton: false
  });
  bind('[data-action="title"]', returnToTitle);
  bind('[data-action="reset"]', startQuickDetective);
  bind("[data-quick-begin]", () => updateQuickDetective({ ...quickState, scene: "transcript", turnIndex: 0 }));
  bind("[data-quick-next-turn]", () => updateQuickDetective(advanceQuickTranscript(packet, quickState)));
  bind("[data-quick-quote]", (event) => updateQuickDetective(applyQuickQuoteSelection(packet, quickState, event.currentTarget.dataset.quickQuote)));
  bind("[data-quick-continue-investigation]", () => updateQuickDetective(continueQuickInvestigation(packet, quickState)));
  bind("[data-quick-reveal-crowd]", () => updateQuickDetective(revealNextCrowdFlaw(packet, quickState)));
  bind("[data-quick-next-crowd]", () => updateQuickDetective(continueQuickCrowd(packet, quickState)));
  bind("[data-quick-restart]", startQuickDetective);
  bind("[data-quick-title]", returnToTitle);
  bindAudioControls({ root: app, onToggleSound: render });
  syncSceneAudio({ briefId: `quick-${packet.id}`, scene: "sceneReview", backdropClass: "backdrop-live" });
  resetViewportScroll();
  queueDefaultFocus();
}

function updateQuickDetective(nextQuickState) {
  state.quickDetective = nextQuickState;
  saveState();
  render();
}

function canContinueJourney() {
  return Boolean(state.caseBriefs?.length && activeCaseBrief());
}

function resumeStageLabel() {
  const scene = state.scene ?? "caseOpen";
  if (scene === "nightShellPrologue") return "上次停在：开播前";
  if (["dayActOpening", "dayMap", "dayScene"].includes(scene)) return "上次停在：白天调查";
  if (["overnightCallback", "callbackOpener", "callbackOpenerBeat", "overnightNight2", "documentReconcile", "liveCounterBeat"].includes(scene)) return "上次停在：第二晚回拨";
  if (["hangupBeat", "overnightHangup", "overnightPostLive", "interludeDesk"].includes(scene) || scene.startsWith("interlude")) return "上次停在：收麦调查台";
  if (scene === "accusation") return "上次停在：最终追问";
  if (scene === "caseBridge") return "上次停在：幕间引页";
  if (scene === "caseTitle") return "上次停在：幕标题";
  if (["caseSolved", "careChoice", "caseClosure", "storyInterlude"].includes(scene)) return "上次停在：收麦回看";
  if (["nightShellEpilogue", "runComplete"].includes(scene)) return "上次停在：天亮前";
  return "上次停在：直播连线";
}


function createDailyScreenRenderers() {
  const screens = {};
  const ctx = {
    getState: () => state,
    playAudioCueOnce,
    audioCueView,
    availableCallbackOpeners,
    availableOvernightCallbackOpeners,
    callbackOpenerById,
    canEnterOvernightCallback,
    caseKey,
    daySceneById,
    documentById,
    documentRowById,
    earnedDocumentQuestionsFor,
    evidenceChecksFor,
    keyQuestionLimit,
    liveCounterBeatAfterScene,
    liveCounterBeatBeforeScene,
    liveCounterBeatById,
    nightStructureFor,
    overnightCallbackDialogueLines,
    overnightCallbackOpenerById,
    overnightFirstNight2SceneIndex,
    overnightReturnPostureFor,
    overnightStructureFor,
    returnStanceFor,
    snapshotEchoFor,
    CHOICE_COST_META,
    callDialogueHtml,
    choiceButtonBodyHtml,
    flowGroupHtml,
    audioPlaybackControlsHtml,
    callbackOpenerBeatHtml,
    callbackOpenerChoiceHtml,
    liveCounterBeatHtml,
    saveState,
    render,
    frame,
    dayFrame,
    bind,
    stanceSnapshotPickForState,
    setIndexValue,
    currentIndex,
    markAction,
    actionDone,
    ensureNight,
    ensureOvernight,
    updateNight,
    updateOvernight,
    recordContradiction,
    recordRouteChoice,
    sceneAfterEvidenceFor,
    escapeHtml,
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
    delegationFor,
    delegationOutcomeFor,
    delegationRouteAxisForAdvisor,
    evidenceAnswerKey,
    evidenceCheckModel,
    interludeEarnedItemsForOvernight,
    investigationAnswerKey,
    investigationBackflowModel,
    investigationRouteIndexBase,
    nightActionById,
    shouldEnterHangupAfterScene,
    shouldEnterOvernightHangupAfterScene,
    choiceReviewHtml,
    delegationScreenHtml,
    evidenceCheckScreenHtml,
    investigationBackflowScreenHtml,
    interludeConflictActionHtml,
    interludeDeskHtml,
    interludeDialogueActionHtml,
    interludePlaybackActionHtml,
    interruptToastHtml,
    replyChoicesHtml,
    CONTENT_ADVISORS,
    liveChapterTitle,
    moveScene,
    setIndex,
    issueCompletion,
    recordPatienceLost,
    ensureBudget,
    interludeActionState,
    completeInterludeAction,
    nextPendingInterruptAction,
    countCompletedInterludeActions,
    recordAdvisorConflictChoice,
    recordInterludeReplyChoice,
    closeInterludeAction,
    hasDeepFollowup,
    materialPityLineFor,
    dailyAccusationChoices,
    askedDialoguePicksForState,
    completedSceneExchangeForState,
    selectedScenePickForState,
    pressuredAnswerVariant,
    questionPressureReaction,
    questionPressureSignal,
    routeAxisForChoice,
    routeToneForChoice,
    nextSceneAfterEvidence,
    overnightCallerQuestionFor,
    sceneReviewModel,
    stanceSnapshotForScene,
    choiceGroupHtml,
    hangupBeatHtml,
    focusedQuestionOptions,
    sceneDialogueOptions,
    sceneQuestionMenuHtml,
    completedSceneExchangeHtml,
    scenePromptExchangeHtml,
    sceneQuestionAnswerHtml,
    sceneReviewDoneChoicesHtml,
    sceneReviewHtml,
    stanceSnapshotHtml,
    SCENE_HELPER,
    activeCaseBrief,
    sceneWithShownCard,
    sceneWithCallbackRevision,
    sceneRevisionUnlocked,
    bindChoiceActivation,
    firstUnansweredSceneIndex,
    resolveAccusationFromButton,
    accusationReadinessForBrief,
    retryPatienceLostStep,
    audiencePatienceLost,
    deepFollowupFor,
    contradictionsForState,
    routeAxisProfileForState,
    routeChoicesForState,
    selectedEvidencePicksForState,
    selectedInvestigationPicksForState,
    truthBoundaryMissesForState,
    truthBoundaryPicksForState,
    finalQuoteComparison,
    issueLine,
    issueResultLine,
    recapRankLabel,
    truthBoundaryAftertaste,
    truthBoundaryReview,
    liveCounterBeatsFor,
    storyInterludeCaseId,
    careChoiceById,
    careChoicesFor,
    epilogueUnreadStage,
    hostDisclosureLinesForAnchor,
    storyBoundaryRows,
    storyMaterialRows,
    storyPackSummaryModel,
    storyPressureRows,
    dailyCompleteChoicesHtml,
    dailyCompleteHtml,
    dailyCompleteShareText,
    finalQuoteComparisonHtml,
    solvedRecapFlowView,
    solvedRecapPagesHtml,
    routeTrailHtml,
    storyInterludeChoicesHtml,
    storyInterludeHtml,
    caseBridgeChoicesHtml,
    caseBridgeHtml,
    caseClosingChoicesHtml,
    caseClosingHtml,
    caseTitleChoicesHtml,
    caseTitleHtml,
    careChoiceContinueHtml,
    careChoiceHtml,
    epilogueUnreadContinueHtml,
    epilogueUnreadHtml,
    storyPackCompleteHtml,
    storyPackShareText,
    storyPackForKey,
    isStoryPackMode,
    storyKeyFromUrl,
    returnToTitle,
    nightShellForBrief,
    nightShellInterludeForBrief,
    nightShellGoodEnding,
    compactDialogueLines,
    normalizedDailyResult,
    routeProfileForBrief,
    postDailySharePayload,
    isFinalStoryPackCase,
    advanceToNextStoryPackCase,
    resetCaseAttempt,
    dailyConclusion,
    liveCounterPickKey,
    liveCounterPickForState,

    renderSceneReview: (...args) => screens.renderSceneReview(...args),
    bindSceneButtons: (...args) => screens.bindSceneButtons(...args),
    renderAccusation: (...args) => screens.renderAccusation(...args),
    hostDisclosureForAnchor: (...args) => screens.hostDisclosureForAnchor(...args),
    enterLiveCounterBeatAfterScene: (...args) => screens.enterLiveCounterBeatAfterScene(...args),
    respondentTeaseHtml: (...args) => screens.respondentTeaseHtml(...args),
    enterLiveCounterBeatBeforeScene: (...args) => screens.enterLiveCounterBeatBeforeScene(...args)
  };
  Object.assign(screens, {
    ...createOvernightScreens(ctx),
    ...createInterludeScreens(ctx),
    ...createSceneScreens(ctx),
    ...createRecapScreens(ctx)
  });
  return screens;
}

function dailyScreenRenderersForRender() {
  dailyScreenRenderers ??= createDailyScreenRenderers();
  return dailyScreenRenderers;
}

function renderDailyCase() {
  const brief = activeCaseBrief();
  const screens = dailyScreenRenderersForRender();
  if (state.scene === "sceneQuestionMenu") return screens.renderSceneQuestionMenu(brief);
  if (state.scene === "sceneQuestionAnswer") return screens.renderSceneQuestionAnswer(brief);
  if (isSceneReviewScene(state.scene)) return screens.renderSceneReview(brief);
  if (state.scene === "nightShellPrologue") return screens.renderNightShellPrologue(brief);
  if (state.scene === "nightShellEpilogue") return screens.renderNightShellEpilogue(brief);
  if (state.scene === "stanceSnapshot") return screens.renderStanceSnapshot(brief);
  if (state.scene === "overnightHangup") return screens.renderOvernightHangup(brief);
  if (state.scene === "overnightPostLive") return screens.renderOvernightPostLive(brief);
  if (state.scene === "dayActOpening") return screens.renderDayActOpening(brief);
  if (state.scene === "dayMap") return screens.renderDayMap(brief);
  if (state.scene === "dayScene") return screens.renderDayScene(brief);
  if (state.scene === "overnightCallback") return screens.renderOvernightCallback(brief);
  if (state.scene === "documentReconcile") return screens.renderDocumentReconcile(brief);
  if (state.scene === "liveCounterBeat") return screens.renderLiveCounterBeat(brief);
  if (state.scene === "hangupBeat") return screens.renderHangupBeat(brief);
  if (state.scene === "interludeDesk") return screens.renderInterludeDesk(brief);
  if (state.scene === "callbackOpener") return screens.renderCallbackOpener(brief);
  if (state.scene === "callbackOpenerBeat") return screens.renderCallbackOpenerBeat(brief);
  if (state.scene === "afterSceneEvidence") return screens.renderAfterSceneEvidence(brief);
  if (state.scene === "evidenceCheck") return screens.renderEvidenceCheck(brief);
  if (state.scene === "delegation") return screens.renderDelegation(brief);
  if (state.scene === "investigationBackflow") return screens.renderInvestigationBackflow(brief);
  if (state.scene === "callerQuestion") return screens.renderCallerQuestion(brief);
  if (state.scene === "deepFollowup") return screens.renderDeepFollowup(brief);
  if (state.scene === "testimony" || state.scene === "evidence") {
    state.scene = "sceneReview";
    state.dialogueProgress = {
      ...(state.dialogueProgress ?? {}),
      [`${caseKey(brief)}:sceneReview`]: firstUnansweredSceneIndex(brief)
    };
    saveState();
    return screens.renderSceneReview(brief);
  }
  if (state.scene === "accusation") return screens.renderAccusation(brief);
  if (state.scene === "patienceLost") return screens.renderPatienceLost(brief);
  if (state.scene === "caseSolved") return screens.renderSolved(brief);
  if (state.scene === "careChoice") return screens.renderCareChoice(brief);
  if (state.scene === "caseClosure") return screens.renderCaseClosure(brief);
  if (state.scene === "storyInterlude") return screens.renderStoryInterlude(brief);
  if (state.scene === "caseBridge") return screens.renderCaseBridge(brief);
  if (state.scene === "caseTitle") return screens.renderCaseTitle(brief);
  if (state.scene === "runComplete") return screens.renderRunComplete(brief);
  return screens.renderCaseOpen(brief);
}

function isSceneReviewScene(scene = "") {
  return ["sceneReview", "sceneQuestionMenu", "sceneQuestionAnswer", "callSegment1", "callSegment2", "overnightNight1", "overnightNight2"].includes(scene);
}

function liveChapterTitle(brief = {}) {
  return isStoryPackMode() ? "热线连线" : brief.storyArcTitle ?? "今日来电";
}

function nightShellForStoryKey(storyKey = "") {
  return storyPackForKey(storyKey)?.nightShell ?? null;
}

function nightShellForBrief(brief = {}) {
  if (!isStoryPackMode()) return null;
  return nightShellForStoryKey(brief.storyKey ?? brief.weeklyKey ?? storyKeyFromUrl());
}

function nightShellInterludeForBrief(brief = {}) {
  const pack = storyPackForKey(brief.storyKey ?? brief.weeklyKey ?? storyKeyFromUrl());
  const caseId = storyInterludeCaseId(pack, brief);
  return (pack?.nightShell?.interludes ?? []).find((item) => item.afterCaseId === caseId) ?? null;
}

function nightShellGoodEnding() {
  const briefs = state.caseBriefs ?? [];
  const results = briefs.map((brief) => normalizedDailyResult(brief));
  const finished = results.filter((result) => result.accused);
  if (!finished.length) return false;
  const average = finished.reduce((sum, result) => sum + Number(result.issuePercent ?? 0), 0) / finished.length;
  return average >= 60;
}

function sceneWithShownCard(brief = {}, scene = {}) {
  if (!scene?.showsCard) return scene;
  const shownCard = (brief.evidenceCards ?? []).find((card) => card.id === scene.showsCard);
  return shownCard ? { ...scene, shownCard } : scene;
}

function sceneWithCallbackRevision(brief = {}, scene = {}, sceneIndex = 0) {
  let revisionUnlocked = false;
  if (nightStructureFor(brief)) {
    const opener = callbackOpenerById(brief, ensureNight(brief).callbackOpenerId);
    revisionUnlocked = Boolean(opener?.appliesRevisedOnScenes?.includes(sceneIndex));
  }
  if (scene.revisedVersionTriggers) {
    revisionUnlocked = revisionUnlocked || sceneRevisionUnlocked(brief, scene.revisedVersionTriggers);
  }
  let next = revisionUnlocked && scene?.revisedVersion
    ? { ...scene, version: scene.revisedVersion }
    : scene;
  if (!revisionUnlocked && scene.revisedVersionTriggers) {
    next = {
      ...next,
      questionOptions: (next.questionOptions ?? []).map((option) => (
        option.answerRequiresRevisedVersion && option.guardedAnswer
          ? { ...option, answer: option.guardedAnswer, forcedGuardedAnswer: true }
          : option
      ))
    };
  }
  return sceneWithLiveCounterQuestionOverride(brief, next);
}

function sceneRevisionUnlocked(brief = {}, triggers = {}) {
  const overnight = ensureOvernight(brief);
  const documentHit = (triggers.documentRows ?? []).some((entry) => {
    const splitAt = String(entry).lastIndexOf(":");
    if (splitAt < 0) return false;
    const documentId = String(entry).slice(0, splitAt);
    const rowId = String(entry).slice(splitAt + 1);
    return (overnight.documentMarks?.[documentId] ?? []).includes(rowId);
  });
  const openerHit = (triggers.callbackOpeners ?? []).includes(overnight.callbackOpenerId);
  return documentHit || openerHit;
}

function sceneWithLiveCounterQuestionOverride(brief = {}, scene = {}) {
  const override = liveCounterBeatsFor(brief).flatMap((beat) => {
    const pick = liveCounterPickForState(brief, beat.id);
    const choice = (beat.choices ?? []).find((item) => item.id === pick?.choiceId);
    return choice?.questionOverride ? [choice.questionOverride] : [];
  }).find((item) => item.sceneId === scene.id);
  if (!override) return scene;
  return {
    ...scene,
    questionOptions: (scene.questionOptions ?? []).map((option, optionIndex) => (
      optionIndex === Number(override.optionIndex ?? 0)
        ? { ...option, question: override.question }
        : option
    ))
  };
}

function frame({ brief, label, chapter, text, choices, mood, showCaseHud = true, visualHud: visualHudOverride, screenClass = "", audioEnterCueId = "", keepVoiceCueId = "" }) {
  const modeLabel = isStoryPackMode() ? "试玩连线" : "今日来电";
  const backdropClass = caseBackdropClass(brief);
  const pressure = showCaseHud ? currentLivePressure(brief, mood) : {};
  const visualHud = visualHudOverride ?? (showCaseHud
    ? `${caseProgressStrip(brief)}${audiencePatienceHud(pressure)}${liveCommentStrip(pressure)}${portraitLayer(brief, mood)}`
    : storyPackSummaryHud());
  const total = Math.max(1, keyQuestionLimit(brief));
  const materialProfile = unlockedMaterialProfile({ state, brief, visible: showCaseHud });
  const currentMaterial = materialProfile.label;
  app.innerHTML = liveFrameHtml({
    productName: PRODUCT_NAME,
    modeLabel,
    audioSettings: getAudioSettings(),
    backdropClass,
    label,
    chapter,
    text,
    reactionHtml: reactionLine(),
    choices,
    visualHud,
    material: currentMaterial,
    materialCount: materialProfile.count,
    screenEffect: state.lastScreenEffect ?? "",
    pixelTransition: pixelTransitionForCurrentScene(brief),
    screenClass: `${screenClass} ${showCaseHud ? liveSceneClass(brief, mood) : ""}`.trim(),
    controlDeckHtml: showCaseHud
      ? liveControlDeckHtml({
          onAirLabel: isStoryPackMode() ? "匿名热线" : brief.label ?? "来电中",
          label,
          segment: answeredSceneCountForState(state, brief) + 1,
          total,
          pressure,
          material: currentMaterial,
          materialCount: materialProfile.count
        })
      : ""
  });
  const hadPressureCue = Boolean(state.lastReaction || state.lastPressureSignal || state.lastScreenEffect || state.lastPityLine);
  if (pressure.pityKey) {
    state.materialPityLog = {
      ...(state.materialPityLog ?? {}),
      [pressure.pityKey]: true
    };
  }
  if (hadPressureCue) {
    state.lastReaction = null;
    state.lastPressureSignal = null;
    state.lastPressureAxis = null;
    state.lastPityLine = null;
    state.lastScreenEffect = null;
    saveState();
  } else if (pressure.pityKey) {
    saveState();
  }
  bind('[data-action="title"]', returnToTitle);
  bind('[data-action="reset"]', resetToTitle);
  bindAudioControls({ root: app, onToggleSound: render });
  syncSceneAudio({ briefId: brief?.id ?? "root", scene: state.scene || "title", backdropClass, pressureLevel: pressure.level, audioEnterCueId, keepVoiceCueId });
  resetViewportScroll();
  mountCurrentDialogue();
  queueDefaultFocus();
}

function dayFrame({ brief, label, chapter, text, choices, backdropClass = "day-city", audioEnterCueId = "", keepVoiceCueId = "" }) {
  const materialProfile = unlockedMaterialProfile({ state, brief });
  app.innerHTML = liveFrameHtml({
    productName: PRODUCT_NAME,
    modeLabel: "白天调查",
    audioSettings: getAudioSettings(),
    backdropClass,
    label,
    chapter,
    text,
    reactionHtml: "",
    choices,
    visualHud: "",
    material: materialProfile.label,
    materialCount: materialProfile.count,
    screenEffect: "",
    pixelTransition: pixelTransitionForCurrentScene(brief),
    controlDeckHtml: ""
  });
  bind('[data-action="title"]', returnToTitle);
  bind('[data-action="reset"]', resetToTitle);
  bindAudioControls({ root: app, onToggleSound: render });
  syncSceneAudio({ briefId: brief?.id ?? "root", scene: state.scene || "title", backdropClass, audioEnterCueId, keepVoiceCueId });
  resetViewportScroll();
  mountCurrentDialogue();
  queueDefaultFocus();
}

function pixelTransitionForCurrentScene(brief = {}) {
  const transition = {
    nightShellPrologue: { kind: "soft-fade", eyebrow: "20:00", label: "开播前" },
    overnightPostLive: { kind: "signal-disconnect", eyebrow: "SIGNAL LOST", label: "挂断以后" },
    dayActOpening: { kind: "scene", eyebrow: "DAY SHIFT", label: "白天调查" },
    overnightCallback: { kind: "signal-connect", eyebrow: "CALLBACK", label: "第二晚回拨" },
    storyInterlude: { kind: "signal-disconnect", eyebrow: "LINE CLOSED", label: "换下一通热线" },
    caseBridge: { kind: "soft-fade", eyebrow: "INTERMISSION", label: "下一幕" },
    caseTitle: { kind: "signal-connect", eyebrow: `CALL ${String(state.chapter ?? 1).padStart(2, "0")}`, label: "新案接入" },
    nightShellEpilogue: { kind: "scene", eyebrow: "OFF AIR", label: "天亮前" }
  }[state.scene];
  if (!transition) return null;
  const key = `${caseKey(brief)}:${state.scene}`;
  if (shownPixelTransitions.has(key)) return null;
  shownPixelTransitions.add(key);
  return transition;
}

function mountCurrentDialogue() {
  const card = app?.querySelector(".dialogue-card");
  if (card) card.insertAdjacentHTML("beforeend", avgSystemBarHtml(state.settings));
  const materialPanel = mountMaterialPanel();
  let controller = null;
  controller = mountDialoguePresentation(app, {
    speed: state.settings?.textSpeed ?? "normal",
    onPageStart: (page) => {
      const pageLines = Array.isArray(page?.lines) ? page.lines : [page];
      pageLines.forEach((line) => {
        const cueId = line?.audioCueId ?? "";
        if (!cueId) return;
        playAudioCueOnce(cueId, `${caseKey(activeCaseBrief())}:${state.scene}:dialogue:${cueId}`);
      });
    },
    onShown: (page) => {
      const shownLines = Array.isArray(page?.lines) ? page.lines : [page];
      state.dialogueBacklog = [...(state.dialogueBacklog ?? []), ...shownLines].filter((line) => line?.text).slice(-500);
      saveState();
      if (state.settings?.autoMode) setTimeout(() => controller?.advance(), Math.max(1, Number(state.settings.autoDelay ?? 2)) * 500);
    },
    onChoicesShown: (shownChoices) => {
      materialPanel.syncChoices();
      keepInlineChoicesVisible(shownChoices);
    }
  });
  materialPanel.syncChoices();
  mountCourtRecord(app, {
    state,
    onSettingsChange: cycleAvgSetting,
    onBeforeOpen: () => materialPanel.close({ restoreFocus: false })
  });
}

function keepInlineChoicesVisible(choices) {
  if (!choices?.classList?.contains("inline-choice-flow")) return;
  choices.scrollIntoView?.({ block: "nearest", inline: "nearest" });
}

function mountMaterialPanel() {
  const shell = app?.querySelector("[data-live-shell]");
  const modal = app?.querySelector("[data-material-modal]");
  const trigger = app?.querySelector("[data-material-open]");
  const choices = app?.querySelector(".avg-choice-overlay");
  let lastFocused = null;

  const close = ({ restoreFocus = true } = {}) => {
    if (!modal || modal.hidden) return false;
    modal.hidden = true;
    shell?.classList.remove("material-open");
    trigger?.setAttribute("aria-expanded", "false");
    if (restoreFocus && lastFocused && isVisibleElement(lastFocused)) focusButton(lastFocused);
    return true;
  };

  const syncChoices = () => {
    const choicesOpen = Boolean(choices && !choices.hidden && choices.querySelector("button:not(:disabled)"));
    shell?.classList.toggle("choices-open", choicesOpen);
    if (choicesOpen) close({ restoreFocus: false });
  };

  if (!modal || !trigger) return { close, syncChoices };

  trigger.addEventListener("click", () => {
    if (shell?.classList.contains("choices-open")) return;
    const record = app?.querySelector(".court-record:not([hidden])");
    if (record) record.hidden = true;
    lastFocused = document.activeElement;
    modal.hidden = false;
    shell?.classList.add("material-open");
    trigger.setAttribute("aria-expanded", "true");
    focusButton(modal.querySelector(".avg-material-panel [data-material-close]"));
  });
  modal.querySelectorAll("[data-material-close]").forEach((button) => button.addEventListener("click", () => close()));
  return { close, syncChoices };
}

function cycleAvgSetting(kind) {
  const speeds = ["slow", "normal", "fast", "instant"];
  if (kind === "auto") state.settings.autoMode = !state.settings.autoMode;
  if (kind === "speed") state.settings.textSpeed = speeds[(speeds.indexOf(state.settings.textSpeed) + 1) % speeds.length];
  if (kind === "fast") state.settings.fastForward = !state.settings.fastForward;
  saveState();
  render();
}

function caseBackdropClass(brief = {}) {
  return brief.backdropClass ?? "backdrop-live";
}

function compactDialogueLines(lines) {
  return (lines ?? []).filter((line) => line?.text);
}

function bind(selector, handler) {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener("click", handler);
  });
}

function resetViewportScroll() {
  globalThis.scrollTo?.(0, 0);
}

function bindChoiceActivation(selector, handler) {
  document.querySelectorAll(selector).forEach((element) => {
    let lastPointerAt = 0;
    element.addEventListener("pointerup", () => {
      lastPointerAt = Date.now();
      handler(element);
    });
    element.addEventListener("click", () => {
      if (Date.now() - lastPointerAt < 350) return;
      handler(element);
    });
  });
}

function queueDefaultFocus() {
  requestAnimationFrame(() => setupDefaultFocus());
}

function setupDefaultFocus() {
  const active = document.activeElement;
  if (active && active !== document.body && isVisibleElement(active)) return;
  focusButton(preferredDefaultButton());
}

function preferredDefaultButton() {
  return topInteractiveScope()?.querySelector(
    "button.primary:not(:disabled), button[data-primary='true']:not(:disabled), button:not(:disabled)"
  ) ?? null;
}

function preferredBackButton() {
  return topInteractiveScope()?.querySelector('[data-material-close]:not(:disabled), [data-record-close]:not(:disabled), [data-close-question-menu]:not(:disabled), [data-retry-case]:not(:disabled), [data-action="title"]:not(:disabled)') ?? null;
}

function preferredReviewButton() {
  return app?.querySelector('[data-recap-next]:not(:disabled), [data-after-recap]:not(:disabled)') ?? null;
}

function toggleReviewPanel() {
  closeMaterialPanel();
  const record = app?.querySelector(".court-record");
  if (record) {
    record.hidden = !record.hidden;
    return true;
  }
  const panel = app?.querySelector(".choice-review");
  if (!panel) return false;
  panel.open = !panel.open;
  return true;
}

function moveButtonFocus(direction) {
  const buttons = focusableButtons();
  if (!buttons.length) return;
  const currentIndex = buttons.indexOf(document.activeElement);
  const nextIndex = nextFocusIndex({ currentIndex, total: buttons.length, direction });
  focusButton(buttons[nextIndex]);
}

function focusableButtons() {
  return Array.from(topInteractiveScope()?.querySelectorAll("button:not(:disabled)") ?? []).filter(isVisibleElement);
}

function topInteractiveScope() {
  const material = app?.querySelector(".avg-material-modal:not([hidden])");
  if (material) return material;
  const record = app?.querySelector(".court-record:not([hidden])");
  if (record) return record;
  const choices = app?.querySelector(".avg-choice-overlay:not([hidden])");
  if (choices?.querySelector("button:not(:disabled)") && isVisibleElement(choices)) return choices;
  return app;
}

function closeMaterialPanel() {
  const modal = app?.querySelector(".avg-material-modal:not([hidden])");
  const closeButton = modal?.querySelector(".avg-material-panel [data-material-close]");
  if (!closeButton) return false;
  closeButton.click();
  return true;
}

function closeTopOverlay() {
  if (closeMaterialPanel()) return true;
  const recordClose = app?.querySelector(".court-record:not([hidden]) [data-record-close]");
  if (!recordClose) return false;
  recordClose.click();
  return true;
}

function isVisibleElement(element) {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function focusButton(button) {
  if (!button) return;
  try {
    button.focus({ preventScroll: true });
  } catch {
    button.focus();
  }
}

function activateButton(button) {
  if (!button || button.disabled) return;
  button.click();
}

function startGamepadPolling() {
  if (gamepadPollingStarted) return;
  if (typeof requestAnimationFrame !== "function") return;
  if (typeof globalThis.navigator?.getGamepads !== "function") return;
  gamepadPollingStarted = true;
  requestAnimationFrame(pollGamepads);
}

function pollGamepads() {
  const gamepad = firstActiveGamepad();
  if (gamepad) handleGamepadInput(gamepad);
  requestAnimationFrame(pollGamepads);
}

function firstActiveGamepad() {
  return Array.from(globalThis.navigator?.getGamepads?.() ?? []).find((item) => item?.connected) ?? null;
}

function handleGamepadInput(gamepad) {
  handleGamepadButton(gamepad, 0, () => {
    const dialogue = currentDialogueAdvance();
    if (dialogue) return dialogue.click();
    const focusedButton = document.activeElement?.matches?.("button:not(:disabled)") && isVisibleElement(document.activeElement)
      ? document.activeElement
      : null;
    if (focusedButton) return activateButton(focusedButton);
    activateButton(preferredDefaultButton());
  });
  handleGamepadButton(gamepad, 1, () => {
    if (!closeTopOverlay()) activateButton(preferredBackButton());
  });
  handleGamepadButton(gamepad, 3, () => {
    if (!toggleReviewPanel()) activateButton(preferredReviewButton());
  });
  handleGamepadButton(gamepad, 12, () => moveButtonFocus(-1));
  handleGamepadButton(gamepad, 13, () => moveButtonFocus(1));
  handleGamepadButton(gamepad, 14, () => moveButtonFocus(-1));
  handleGamepadButton(gamepad, 15, () => moveButtonFocus(1));
  handleGamepadAxis(gamepad);
}

function currentDialogueAdvance() {
  return Array.from(app?.querySelectorAll?.("[data-dialogue-advance]:not([data-dialogue-done])") ?? [])
    .find((element) => element.getClientRects().length > 0 && !element.closest("[hidden]")) ?? null;
}

function handleGamepadButton(gamepad, buttonIndex, handler) {
  const key = `${gamepad.index}:${buttonIndex}`;
  const pressed = Boolean(gamepad.buttons?.[buttonIndex]?.pressed);
  if (pressed && !gamepadPreviousButtons[key]) handler();
  gamepadPreviousButtons[key] = pressed;
}

function handleGamepadAxis(gamepad) {
  const now = Date.now();
  const direction = gamepadAxisDirection({ axes: gamepad.axes, lastMoveAt: lastGamepadMoveAt, now });
  if (!direction) return;
  moveButtonFocus(direction);
  lastGamepadMoveAt = now;
}

function keyEventInTextInput(event) {
  const target = event.target;
  const tagName = target?.tagName;
  return target?.isContentEditable || tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT";
}

function stanceSnapshotPickForState(brief = {}) {
  return state.stanceSnapshots?.[caseKey(brief)] ?? null;
}

function liveCounterPickKey(brief = {}, beatId = "") {
  return `${caseKey(brief)}:${beatId}`;
}

function liveCounterPickForState(brief = {}, beatId = "") {
  return state.liveCounterPicks?.[liveCounterPickKey(brief, beatId)] ?? null;
}

function moveScene(scene) {
  const brief = activeCaseBrief();
  if (scene === "sceneReview" && overnightStructureFor(brief)) {
    const overnight = ensureOvernight(brief);
    scene = overnight.segment === "night2" ? "overnightNight2" : "overnightNight1";
  } else if (scene === "sceneReview" && nightStructureFor(brief)) {
    const night = ensureNight(brief);
    scene = night.segment === "segment2" ? "callSegment2" : "callSegment1";
  }
  if (scene === "accusation") {
    if (overnightStructureFor(brief) && overnightCallerQuestionFor(brief) && !actionDone(brief, "overnight:callerQuestion")) {
      state.scene = "callerQuestion";
      saveState();
      return render();
    }
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
    if (!nightStructureFor(brief) && delegationFor(brief) && !actionDone(brief, "delegation")) {
      state.scene = "delegation";
      saveState();
      return render();
    }
  }
  state.scene = scene;
  saveState();
  render();
}

function setIndex(brief, area, index) {
  setIndexValue(brief, area, index);
  saveState();
  render();
}

function setIndexValue(brief, area, index) {
  const total = area === "sceneReview" ? brief.sceneVersions?.length ?? 1 : area === "evidenceCheck" ? evidenceChecksFor(brief).length || 1 : unlockedInvestigationEntriesForState(state, brief).length || 1;
  state.dialogueProgress = {
    ...(state.dialogueProgress ?? {}),
    [`${caseKey(brief)}:${area}`]: Math.max(0, Math.min(index, total - 1))
  };
}

function areaTotalForRetry(brief, area) {
  if (area === "sceneReview") return brief.sceneVersions?.length ?? 1;
  if (area === "evidenceCheck") return evidenceChecksFor(brief).length || 1;
  if (area === "investigationBackflow") return unlockedInvestigationEntriesForState(state, brief).length || 1;
  return 1;
}

function currentIndex(brief, area, total) {
  return Math.max(0, Math.min(Number(state.dialogueProgress?.[`${caseKey(brief)}:${area}`] ?? 0), Math.max(0, total - 1)));
}

function firstUnansweredSceneIndex(brief) {
  return firstOpenSceneIndex(brief, (actionKey) => actionDone(brief, actionKey));
}

function resolveAccusationFromButton(brief, button) {
  const accuseLabel = button.getAttribute("data-accuse-label") ?? button.textContent?.trim() ?? "";
  const response = button.getAttribute("data-accuse-response") ?? "";
  const accused = button.getAttribute("data-accuse") ?? "";
  const issue = issueCompletion(brief);
  const resolved = resolveAccusationForCase({
    brief,
    accused,
    contradictionCount: issue.revealed.length,
    requiredContradictions: issue.total
  });
  const issueCleared = Boolean(issue.badge);
  const quoteHit = accused === resolved.result.expected;
  const result = {
    caseId: brief.id,
    accused,
    expected: resolved.result.expected,
    relationshipExpected: resolved.result.relationshipExpected,
    structuralExpected: resolved.result.structuralExpected,
    correct: issueCleared,
    contradictionCount: contradictionsForState(state, brief).length,
    issuePercent: issue.percent,
    issueRevealed: issue.revealed,
    issueMissed: issue.missed,
    dailyBadge: issueCleared,
    quoteHit
  };
  result.dailyAccuseLabel = accuseLabel;
  result.dailyResponse = response;
  result.dailyRoute = routeProfileForBrief(brief, result);
  state.accusationHistory = upsertByCaseId(state.accusationHistory, result);
  state.solvedCaseIds = [...new Set([...(state.solvedCaseIds ?? []), brief.id])];
  applyOutcome(brief, result);
  recordDailyMeta(brief, result, issue);
  state.scene = unlockedInvestigationEntriesForState(state, brief).some((entry) => !selectedInvestigationPickForState(state, brief, entry.index)) ? "investigationBackflow" : "caseSolved";
  state.recapStep = 0;
  saveState();
  render();
}

function normalizedDailyResult(brief) {
  const current = state.accusationHistory?.find((item) => item.caseId === brief.id);
  const issue = issueCompletion(brief);
  return {
    ...(current ?? {}),
    caseId: brief.id,
    accused: current?.accused ?? null,
    expected: expectedAccusationForCase(brief),
    relationshipExpected: current?.relationshipExpected ?? relationshipExpectedForResult(brief),
    correct: current?.correct ?? false,
    dailyAccuseLabel: current?.dailyAccuseLabel ?? "还没选最后那句",
    dailyResponse: current?.dailyResponse ?? "",
    contradictionCount: contradictionsForState(state, brief).length,
    issuePercent: issue.percent,
    issueRevealed: issue.revealed,
    issueMissed: issue.missed,
    dailyBadge: current?.dailyBadge ?? false,
    quoteHit: current?.quoteHit ?? false
  };
}

function issueCompletion(brief) {
  return calculateIssueCompletion({
    brief,
    foundContradictions: contradictionsForState(state, brief),
    requiredLimit: keyQuestionLimit(brief)
  });
}

function relationshipExpectedForResult(brief) {
  return relationshipExpectedAccusationForCase(brief);
}

function accusationReadinessForBrief(brief) {
  return accusationReadinessForCase(brief, (actionKey) => actionDone(brief, actionKey));
}

function applyOutcome(brief, result) {
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
  meta = {
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
  saveMetaSnapshot(meta);
}

function routeProfileForBrief(brief, result = {}) {
  return buildDailyRouteProfile(brief, result, {
    issue: issueCompletion(brief),
    axisProfile: routeAxisProfileForState(state, brief, result)
  });
}

function postDailySharePayload(brief, route, result) {
  const mode = isStoryPackMode() ? "episode" : "daily";
  const storyKey = brief.storyKey ?? brief.weeklyKey ?? "";
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
    path: `/pages/index/index?mode=${mode}&dailyKey=${encodeURIComponent(brief.dailyKey ?? "")}&storyKey=${encodeURIComponent(storyKey)}`
  });
}

function isFinalStoryPackCase() {
  return Number(state.chapter ?? 1) >= (state.caseBriefs?.length ?? 1);
}

function advanceToNextStoryPackCase(message = "新的来电接进来，上一通留给弹幕吵。") {
  state.chapter = Math.min(Number(state.chapter ?? 1) + 1, state.caseBriefs?.length ?? 1);
  state.caseBrief = activeCaseBrief();
  state.scene = "caseTitle";
  state.recapStep = 0;
  state.patienceLostContext = null;
  void message;
  state.lastReaction = null;
  state.lastPressureSignal = null;
  state.lastPressureAxis = null;
  state.lastScreenEffect = null;
  saveState();
  render();
}

function retryPatienceLostStep(brief) {
  const context = state.patienceLostContext ?? {};
  // Replace the whole state object; memoized screen handlers follow through ctx.getState().
  state = retryPatienceLostState({
    state,
    brief,
    context,
    budget: ensureBudget(brief),
    areaTotal: areaTotalForRetry(brief, context.area ?? "sceneReview")
  });
  saveState();
  render();
}

function resetCaseAttempt(brief) {
  const key = caseKey(brief);
  state.scene = "caseOpen";
  state.sceneQuestionFocus = null;
  state.dialogueProgress = removeKeyPrefix(state.dialogueProgress, `${key}:`);
  state.sceneAnswers = removeKeyPrefix(state.sceneAnswers, `${key}:`);
  state.sceneQuestionPicks = removeKeyPrefix(state.sceneQuestionPicks, `${key}:`);
  state.sceneDialoguePicks = removeKeyPrefix(state.sceneDialoguePicks, `${key}:`);
  state.evidenceCheckPicks = removeKeyPrefix(state.evidenceCheckPicks, `${key}:`);
  state.investigationPicks = removeKeyPrefix(state.investigationPicks, `${key}:`);
  state.delegationPicks = omitRecordKey(state.delegationPicks, key);
  state.stanceSnapshots = omitRecordKey(state.stanceSnapshots, key);
  state.liveCounterPicks = removeKeyPrefix(state.liveCounterPicks, `${key}:`);
  state.activeLiveCounterBeatId = null;
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

function upsertByCaseId(items = [], result) {
  const next = (items ?? []).filter((item) => item.caseId !== result.caseId);
  return [...next, result];
}

function removeKeyPrefix(record = {}, prefix) {
  return Object.fromEntries(Object.entries(record ?? {}).filter(([key]) => !key.startsWith(prefix)));
}

function omitRecordKey(record = {}, keyToOmit) {
  return Object.fromEntries(Object.entries(record ?? {}).filter(([key]) => key !== keyToOmit));
}

function markAction(brief, actionKey, { spend = false } = {}) {
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
  const budget = ensureBudget(brief);
  if (!casePatienceLost({
    budget,
    answeredScenes: answeredSceneCountForState(state, brief),
    requiredScenes: keyQuestionLimit(brief),
    answeredEvidence: answeredEvidenceCountForState(state, brief),
    requiredEvidence: evidenceChecksFor(brief).length
  })) return false;
  recordPatienceLost(brief, context);
  return true;
}

function recordPatienceLost(brief, context = {}) {
  // Replace the whole state object; memoized screen handlers follow through ctx.getState().
  state = recordPatienceLostState({ state, brief, context });
  saveState();
  render();
  return true;
}

function actionDone(brief, actionKey) {
  return Boolean(state.caseActionLog?.[caseKey(brief)]?.[actionKey]);
}

function ensureBudget(brief) {
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

function recordAdvisorConflictChoice(brief, action = {}, choiceId = "") {
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
  state.lastReaction = "这套框架先记下。";
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
  state.lastReaction = "这句回出去了。";
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
  const key = caseKey(brief);
  const current = state.contradictionLog?.[key] ?? [];
  if (current.includes(contradiction)) return;
  state.contradictionLog = {
    ...(state.contradictionLog ?? {}),
    [key]: [...current, contradiction].slice(-32)
  };
}

function recordRouteChoice(brief, sceneIndex, option = {}, scene = {}) {
  const key = caseKey(brief);
  const current = (state.routeChoiceLog?.[key] ?? []).filter((item) => item.sceneIndex !== sceneIndex);
  const entry = normalizeRouteChoice(sceneIndex, option, scene);
  state.routeChoiceLog = {
    ...(state.routeChoiceLog ?? {}),
    [key]: [...current, entry].sort((a, b) => a.sceneIndex - b.sceneIndex)
  };
}

function sceneAfterEvidenceFor(brief) {
  if (pendingEvidenceChecksFor(brief, (actionKey) => actionDone(brief, actionKey)).length) return "evidenceCheck";
  if (overnightStructureFor(brief) && overnightCallerQuestionFor(brief) && !actionDone(brief, "overnight:callerQuestion")) return "callerQuestion";
  if (nightStructureFor(brief)) return "accusation";
  return nextSceneAfterEvidence({ issueBadge: issueCompletion(brief).badge, hasDeepFollowup: hasDeepFollowup(brief) });
}

function hasDeepFollowup(brief) {
  return Boolean(deepFollowupFor(brief).question);
}

function deepFollowupFor(brief) {
  if (brief.deepFollowup?.question) return brief.deepFollowup;
  return {
    question: "那我多问一句，如果把情绪先放一边，这件事最后是谁要承担成本？",
    answer: "她停了一下，说：我刚才一直在讲委屈，其实最怕的是最后又变成我来兜底。",
    note: "问到这一步，就别只听委屈了，得问最后谁兜底。"
  };
}

function dailyConclusion(brief, result, issue) {
  const picked = selectedScenePicksForState(state, brief);
  const pickedQuestions = picked.map((item) => item.question).filter(Boolean);
  const deep = issue.badge ? deepFollowupFor(brief) : null;
  return dailyConclusionModel(brief, result, issue, { pickedQuestions, deepFollowup: deep });
}

function currentLivePressure(brief, mood = "listening") {
  const sceneHint = currentScenePressureHint(brief);
  const pressure = livePressureProfile({
    budget: ensureBudget(brief),
    foundCount: contradictionsForState(state, brief).length,
    intentHook: liveIntentHookFor(brief),
    pressureSignal: state.lastPressureSignal ?? "",
    routeAxis: state.lastPressureAxis ?? "",
    routeAxisComments: brief.routeAxisComments ?? {},
    driftComments: brief.driftComments ?? [],
    scene: state.scene,
    sceneHint,
    mood
  });
  return withMaterialPityLine(withCrossCaseEchoes(pressure, brief), brief);
}

function withCrossCaseEchoes(pressure = {}, brief = {}) {
  const echo = eligibleCrossCaseEcho(brief);
  const comments = Array.isArray(pressure.comments) ? [...pressure.comments] : [];
  if (!echo || comments.length === 0) return pressure;
  comments[stableEchoIndex(`${brief.id}:${echo.requiresCaseId}:${echo.text}`, comments.length)] = echo.text;
  return { ...pressure, comments };
}

function eligibleCrossCaseEcho(brief = {}) {
  if (!isStoryPackMode()) return null;
  const echoes = Array.isArray(brief.crossCaseEchoes) ? brief.crossCaseEchoes : [];
  if (!echoes.length) return null;
  const solvedContentCaseIds = new Set((state.caseBriefs ?? [])
    .filter((item) => (state.solvedCaseIds ?? []).includes(item.id))
    .map((item) => item.runtimeContentCaseId ?? item.caseId)
    .filter(Boolean));
  return echoes.find((echo) => solvedContentCaseIds.has(echo.requiresCaseId)) ?? null;
}

function stableEchoIndex(seed = "", length = 1) {
  const safeLength = Math.max(1, Number(length ?? 1));
  let hash = 2166136261;
  for (const char of String(seed)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % safeLength;
}

function withMaterialPityLine(pressure = {}, brief = {}) {
  const pity = activeMaterialPityLine(pressure, brief);
  const comments = Array.isArray(pressure.comments) ? [...pressure.comments] : [];
  if (!pity || comments.length === 0) return pressure;
  comments[Math.min(1, comments.length - 1)] = pity.text;
  return { ...pressure, comments, pityKey: pity.key };
}

function activeMaterialPityLine(pressure = {}, brief = {}) {
  const pending = state.lastPityLine;
  if (pending?.key && pending?.text && !state.materialPityLog?.[pending.key]) return pending;
  if (state.scene !== "evidenceCheck" || pressure.level !== "low") return null;
  const checkIndex = currentIndex(brief, "evidenceCheck", evidenceChecksFor(brief).length || 1);
  if (selectedEvidencePickForState(state, brief, checkIndex)) return null;
  const check = evidenceChecksFor(brief)[checkIndex] ?? {};
  return materialPityLineFor(brief, check, checkIndex);
}

function materialPityLineFor(brief = {}, check = {}, checkIndex = 0, outcome = null) {
  if (!check.pityLine || outcome?.correct) return null;
  const key = `${caseKey(brief)}:evidence:${checkIndex}`;
  if (state.materialPityLog?.[key]) return null;
  return { key, text: check.pityLine };
}

function caseProgressStrip(brief) {
  if (!brief) return "";
  return caseProgressStripHtml({
    total: keyQuestionLimit(brief),
    answered: answeredSceneCountForState(state, brief),
    label: isStoryPackMode() ? "匿名来电" : brief.label ?? "连线中"
  });
}

function audiencePatienceHud(pressure = {}) {
  return audiencePatienceHudHtml(pressure);
}

function storyPackSummaryHud() {
  const total = state.caseBriefs?.length || 1;
  const solved = state.caseBriefs?.filter((brief) => state.solvedCaseIds?.includes(brief.id)).length ?? total;
  return storyPackSummaryHudHtml({ total, solved });
}

function liveCommentStrip(pressure = {}) {
  return liveCommentStripHtml(pressure);
}

function liveIntentHookFor(brief) {
  return currentScenePressureHint(brief).intentHook ?? "话太顺了";
}

function portraitLayer(brief, mood = "listening") {
  const npc = NPCS.find((item) => item.id === brief.complainantId) ?? NPCS[0];
  const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
  const expression = callerExpressionFor(brief, mood);
  const art = casePortraitArt(brief, npc, expression);
  return portraitLayerHtml({
    artSrc: art.src,
    fallbackSrc: art.fallbackSrc,
    artStyle: brief.callerArtStyle,
    mood,
    expression,
    sceneIndex
  });
}

function casePortraitArt(brief, npc, expression = {}) {
  const neutralArt = brief.callerArtVariants?.neutral ?? brief.callerArt ?? CHARACTER_ART[npc.id] ?? "";
  return callerArtForExpression({
    neutralSrc: neutralArt,
    variants: brief.callerArtVariants,
    expression
  });
}

function callerExpressionFor(brief, mood = "listening") {
  const pressure = currentLivePressure(brief, mood);
  const budget = ensureBudget(brief);
  const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
  return callerExpressionForView({ pressure, budget, scene: state.scene, sceneIndex, mood });
}

function currentScenePressureHint(brief) {
  if (!isSceneReviewScene(state.scene)) return {};
  const scenes = brief?.sceneVersions ?? [];
  const index = currentIndex(brief, "sceneReview", scenes.length || 1);
  return scenes[index]?.pressureHint ?? {};
}

function liveSceneClass(brief, mood = "listening") {
  const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
  const pressure = currentLivePressure(brief, mood);
  const expression = pressure.expression?.kind ?? "blink";
  return `scene-beat-${sceneIndex % 4} scene-expression-${expression} scene-guard-${pressure.callerGuard ?? "listening"}`;
}

function reactionLine() {
  const text = state.lastReaction;
  if (!text) return "";
  return `<p class="reaction">${escapeHtml(text)}</p>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

render();
