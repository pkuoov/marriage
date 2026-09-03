import { generateCasesForMode } from "./caseModes.js";
import { clearPlayedCueKeysByPrefix, getAudioSettings, playAudioCueOnce, playDialogueBlip, playSfx, resetAudioCueHistory } from "./sound.js";
import { audioCueView } from "./audioCatalog.js";
import { baseState, clearStateSnapshot, loadMeta, loadState, normalizeRuntimeState, saveStateSnapshot } from "./state.js";
import { NPCS } from "./story.js";
import { dailyAccusationChoices } from "./dailyChoices.js";
import { keyboardNavigationIntent } from "./runtime/inputNavigation.js";
import { materialOperationOutcome } from "./runtime/materialOperation.js";
import { unlockedMaterialProfile } from "./runtime/materialVisibility.js";
import { answeredEvidenceCountForState, answeredSceneCountForState, askedDialoguePicksForState, completedSceneExchangeForState, contradictionsForState, latestChoiceReviewRowsForState, routeAxisProfileForState, routeChoicesForState, selectedDelegationPickForState, selectedEvidencePickForState, selectedEvidencePicksForState, selectedInvestigationPickForState, selectedInvestigationPicksForState, selectedScenePickForState, selectedScenePicksForState, truthBoundaryMissesForState, truthBoundaryPicksForState, unlockedInvestigationEntriesForState } from "./runtime/caseStateSelectors.js";
import { dailyConclusionModel, finalQuoteComparison, investigationPickReaction, issueLine, issueResultLine, recapRankLabel, truthBoundaryAftertaste, truthBoundaryReview } from "./runtime/recapModel.js";
import { materialPressureReaction, materialPressureSignal, pressuredAnswerVariant, questionPressureReaction, questionPressureSignal } from "./runtime/livePressure.js";
import { routeAxisForChoice, routeToneForChoice } from "./runtime/routeLog.js";
import { canRewindQuestion, popQuestionRewindPoint, pushQuestionRewindPoint } from "./runtime/questionRewind.js";
import { afterEvidenceScene as nextSceneAfterEvidence, afterSceneEvidenceFor, answerKey, availableCallbackOpeners, availableOvernightCallbackOpeners, callbackOpenerById, canEnterOvernightCallback, caseKey, daySceneById, delegationFor, delegationOutcomeFor, delegationRouteAxisForAdvisor, documentById, documentRowById, documentQuestionId, earnedDocumentQuestionsFor, evidenceAnswerKey, evidenceCheckModel, evidenceChecksFor, firstUnansweredSceneIndex as firstOpenSceneIndex, interludeEarnedItemsForOvernight, investigationAnswerKey, investigationBackflowModel, investigationRouteIndexBase, keyQuestionLimit, liveCounterBeatAfterScene, liveCounterBeatBeforeScene, liveCounterBeatById, liveCounterBeatsFor, nextPlayableSceneIndex, nightActionById, nightStructureFor, overnightCallbackDialogueLines, overnightCallbackOpenerById, overnightCallerQuestionFor, overnightFirstNight2SceneIndex, overnightReturnPostureFor, overnightStructureFor, pendingEvidenceChecksFor, playableSceneCount, playableSceneIndexes, pressureSignalForLiveCounterChoice, returnStanceFor, sceneReviewModel, shouldEnterHangupAfterScene, shouldEnterOvernightHangupAfterScene, snapshotEchoFor, stanceSnapshotForScene } from "./runtime/sceneAdvance.js";
import { storyInterludeCaseId, storyOptionalQuickCall } from "./runtime/storyInterludeModel.js";
import { careChoiceById, careChoicesFor } from "./runtime/careChoiceModel.js";
import { epilogueUnreadStage } from "./runtime/epilogueUnreadModel.js";
import { cafePrologueCanOpenForensic, cafePrologueCanPresentEvidence, cafePrologueCanPresentRevisionEvidence, cafePrologueRemainingEvidenceId, cafePrologueRevisionEvidenceHit, cafePrologueRevisedStatementReady, cafePrologueSceneForStep, cafePrologueStatementReady, normalizedCafePrologueProgress } from "./runtime/prologueCafeModel.js";
import { hostDisclosureLinesForAnchor } from "./runtime/hostDisclosureModel.js";
import { normalizePlayerName, personalizeHostHtml, personalizeHostText, playerFamiliarName } from "./playerIdentity.js";
import { CHOICE_COST_META } from "./runtime/choiceCostModel.js";
import { mountDialoguePresentation } from "./runtime/dialoguePresentation.js";
import { refreshSavedCaseContent } from "./runtime/savedContentRefresh.js";
import { storyBoundaryRows, storyMaterialRows, storyPackSummaryModel, storyPressureRows } from "./runtime/storyPackSummaryModel.js";
import { callDialogueHtml, choiceButtonBodyHtml, choiceGroupHtml, choiceReviewHtml, flowGroupHtml } from "./ui/callFlowView.js";
import { dailyCompleteChoicesHtml, dailyCompleteHtml, dailyCompleteShareText } from "./ui/dailyCompleteView.js";
import { delegationScreenHtml, evidenceCheckScreenHtml, investigationBackflowScreenHtml } from "./ui/evidenceView.js";
import { audioPlaybackControlsHtml, callbackOpenerBeatHtml, callbackOpenerChoiceHtml, hangupBeatHtml, interludeDeskHtml, interludeDialogueActionHtml, interludePlaybackActionHtml, interruptToastHtml, replyChoicesHtml } from "./ui/interludeDeskView.js";
import { bindAudioControls, syncSceneAudio, watchAudioPlaybackControls } from "./ui/audioController.js";
import { liveCounterBeatHtml } from "./ui/liveCounterBeatView.js";
import { liveControlDeckHtml, liveFrameHtml } from "./ui/liveFrameView.js";
import { avgSystemBarHtml, mountCourtRecord } from "./ui/courtRecordView.js";
import { finalQuoteComparisonHtml, solvedRecapFlowView, solvedRecapPagesHtml } from "./ui/recapView.js";
import { routeTrailHtml } from "./ui/routeTrailView.js";
import { focusedQuestionOptions, sceneDialogueOptions, sceneQuestionChoicesHtml } from "./ui/sceneQuestions.js";
import { completedSceneExchangeHtml, scenePromptExchangeHtml, sceneQuestionAnswerHtml, sceneReviewDoneChoicesHtml, sceneReviewHtml, stanceSnapshotHtml, statementStagePromptExchangeHtml } from "./ui/sceneReviewView.js";
import { storyInterludeChoicesHtml, storyInterludeHtml, storyInterludeStageHtml, storyWorldEchoStageHtml } from "./ui/storyInterludeView.js";
import { caseBridgeChoicesHtml, caseBridgeHtml, caseClosingChoicesHtml, caseClosingHtml, caseTitleChoicesHtml, caseTitleHtml } from "./ui/caseTransitionView.js";
import { careChoiceContinueHtml, careChoiceHtml } from "./ui/careChoiceView.js";
import { epilogueUnreadContinueHtml, epilogueUnreadHtml } from "./ui/epilogueUnreadView.js";
import { cafeAccountBoardHtml, cafeEvidencePairHtml, cafeFinalBoundaryHtml, cafeInvestigationChoicesHtml, cafeLegalRequestsHtml, cafeMaterialDetailModalHtml, cafeMaterialPromptHtml, cafePrologueDialogueHtml, cafePrologueHeaderHtml, cafeProloguePortraitStageHtml, cafeRevisionStatusHtml, cafeSingleEvidenceHtml, cafeStatementReplayHtml, cafeTransferPresentHtml } from "./ui/prologueCafeView.js";
import { storyPackCompleteHtml, storyPackShareText } from "./ui/storyPackCompleteView.js";
import { titleScreenHtml } from "./ui/titleView.js";
import { CONTENT_ADVISORS } from "./generated/contentPackIndex.js";
import { quickDetectiveCaseFor, quickDetectiveCasesFor, storyPackForKey } from "./storyPacks.js";
import { HOST_PROFILE } from "./hostProfile.js";
import { createOvernightScreens } from "./ui/screens/overnightScreens.js";
import { createInterludeScreens } from "./ui/screens/interludeScreens.js";
import { createSceneScreens } from "./ui/screens/sceneScreens.js";
import { createRecapScreens } from "./ui/screens/recapScreens.js";
import { createQuickDetectiveScreens } from "./ui/screens/quickDetectiveScreens.js";
import { createFocusInputControl } from "./ui/focusInputControl.js";
import { createLiveHudPresenter } from "./ui/liveHudPresenter.js";
import { createCaseStateWrites } from "./runtime/caseStateWrites.js";
import { createCaseOutcome } from "./runtime/caseOutcome.js";

const app = document.querySelector("#app");
const PRODUCT_NAME = "深夜热线：直播间侦探";
const DEFAULT_ATTRS = { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 };
const {
  bind,
  bindChoiceActivation,
  queueDefaultFocus,
  preferredDefaultButton,
  preferredBackButton,
  toggleReviewPanel,
  moveButtonFocus,
  closeTopOverlay,
  isVisibleElement,
  focusButton,
  activateButton,
  startGamepadPolling,
  currentDialogueAdvance,
  keyEventInTextInput
} = createFocusInputControl({ app });

const startsFresh = hasFreshStartParam();
if (startsFresh) clearStateSnapshot();
const loadedState = startsFresh ? null : loadState();
let state = loadedState ?? normalizeRuntimeState(structuredClone(baseState));
if (!startsFresh && state.caseBriefs.length) {
  state = refreshSavedCaseContent(state, {
    generateCases: (npcs, attrs, options) => generateCasesForMode(state.caseMode, npcs, attrs, options),
    npcs: NPCS
  });
}
// Screen handlers read ctx.getState() when invoked; cache the factory, never the state object.
let dailyScreenRenderers = null;
let quickScreenRenderers = null;
if (!startsFresh && loadedState?.screen === "chapter" && state.caseBriefs.length) state.screen = "title";
let meta = loadMeta();
let shownPixelTransitions = new Set();
let titleNewGameConfirmation = false;
let titlePlayerNameDraft = null;
let questionRewindHistory = [];
let lastQuestionRewindCapture = { target: null, at: 0 };
const {
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
} = createCaseStateWrites({
  getState: () => state,
  setState: (nextState) => { state = nextState; },
  saveState,
  render,
  clearQuestionRewindHistory,
  clearPlayedCueKeysByPrefix,
  areaTotalForRetry
});
const {
  accusationReadinessForBrief,
  advanceToNextStoryPackCase,
  isFinalStoryPackCase,
  issueCompletion,
  normalizedDailyResult,
  postDailySharePayload,
  relationshipExpectedForResult,
  resolveAccusationFromButton,
  routeProfileForBrief
} = createCaseOutcome({
  getState: () => state,
  getMeta: () => meta,
  setMeta: (nextMeta) => { meta = nextMeta; },
  saveState,
  render,
  ensureBudget,
  actionDone,
  isStoryPackMode,
  clearQuestionRewindHistory,
  activeCaseBrief
});
const {
  currentLivePressure,
  escapeHtml: appEscapeHtml,
  hostPortraitLayer,
  liveCommentStrip,
  liveSceneClass,
  materialPityLineFor,
  portraitLayer,
  reactionLine,
  storyPackSummaryHud
} = createLiveHudPresenter({
  getState: () => state,
  isStoryPackMode,
  ensureBudget,
  ensureNight,
  currentIndex,
  isSceneReviewScene,
  answeredSceneCountForState
});

const QUESTION_REWIND_TRIGGER_SELECTOR = [
  "button.choice-question",
  "button.decision-choice",
  "button.quick-issue-option",
  "button[data-evidence-check]",
  "button[data-document-row]",
  "button[data-day-timeline-card]",
  "button[data-submit-day-timeline]",
  "button[data-live-counter-choice]",
  "button[data-truth-boundary-pick]",
  "button[data-stance-snapshot]",
  "button[data-care-choice]",
  "button[data-scene-review-line]",
  "button[data-scene-open-replay]",
  "button[data-retry-statement]"
].join(",");

watchAudioPlaybackControls({ getRoot: () => app });

document.addEventListener("pointerup", captureQuestionRewindFromEvent, true);
document.addEventListener("click", captureQuestionRewindFromEvent, true);

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  if (button.matches('[data-action="rewind"]')) return rewindToPreviousQuestion();
  if (button.hasAttribute("data-audio-mute")) return;
  if (button.matches("[data-start-story], [data-start-quick-detective], [data-continue-story], [data-request-new-game], [data-confirm-new-game], [data-cancel-new-game], [data-enter-first-case]")) return;
  if (button.matches("[data-evidence-check], [data-document-row]")) return;
  playSfx(button.classList.contains("primary") || button.dataset.accuse ? "confirm" : "click");
});

document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || keyEventInTextInput(event)) return;
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

function saveState() {
  saveStateSnapshot(state);
}

function captureQuestionRewindFromEvent(event) {
  const button = event.target?.closest?.(QUESTION_REWIND_TRIGGER_SELECTOR);
  if (!button || button.disabled) return;
  const now = Date.now();
  if (lastQuestionRewindCapture.target === button && now - lastQuestionRewindCapture.at < 350) return;
  questionRewindHistory = pushQuestionRewindPoint(questionRewindHistory, state);
  lastQuestionRewindCapture = { target: button, at: now };
}

function rewindToPreviousQuestion() {
  const rewind = popQuestionRewindPoint(questionRewindHistory, state);
  if (!rewind.state) return;
  questionRewindHistory = rewind.history;
  lastQuestionRewindCapture = { target: null, at: 0 };
  shownPixelTransitions = new Set();
  // Replace the whole state so every memoized screen handler follows the restored checkpoint.
  state = normalizeRuntimeState(rewind.state);
  saveState();
  render();
}

function clearQuestionRewindHistory() {
  questionRewindHistory = [];
  lastQuestionRewindCapture = { target: null, at: 0 };
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
  clearQuestionRewindHistory();
  commitTitlePlayerName();
  const quickDetectiveCompletedIds = [...(state.quickDetectiveCompletedIds ?? [])];
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
  state = normalizeRuntimeState({
    ...structuredClone(baseState),
    playerName: state.playerName,
    quickDetectiveCompletedIds,
    screen: "chapter",
    scene: mode === "daily"
      ? "caseOpen"
      : nightShellForStoryKey(caseBriefs[0]?.storyKey ?? storyKeyFromUrl())?.cafePrologue
        ? "cafePrologue"
        : nightShellForStoryKey(caseBriefs[0]?.storyKey ?? storyKeyFromUrl())?.prologue
          ? "nightShellPrologue"
          : "caseOpen",
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
  commitTitlePlayerName();
  titleNewGameConfirmation = false;
  state.screen = "chapter";
  saveState();
  render();
}

function returnToTitle() {
  clearQuestionRewindHistory();
  titleNewGameConfirmation = false;
  shownPixelTransitions = new Set();
  state.screen = "title";
  saveState();
  render();
}

function resetToTitle() {
  clearQuestionRewindHistory();
  const playerName = normalizePlayerName(state.playerName);
  const quickDetectiveCompletedIds = [...(state.quickDetectiveCompletedIds ?? [])];
  clearStateSnapshot();
  titleNewGameConfirmation = false;
  shownPixelTransitions = new Set();
  // Replace the whole state object; memoized screen handlers follow through ctx.getState().
  state = normalizeRuntimeState(structuredClone(baseState));
  state.playerName = playerName;
  state.quickDetectiveCompletedIds = quickDetectiveCompletedIds;
  state.screen = "title";
  saveState();
  render();
}

function render() {
  if (!app) return;
  if (state.screen === "title") return renderTitle();
  if (state.screen === "quickDetectiveSelect") return quickScreenRenderersForRender().renderQuickDetectiveSelect();
  if (state.screen === "quickDetective") return quickScreenRenderersForRender().renderQuickDetective();
  if (!activeCaseBrief()) return renderTitle();
  return renderDailyCase();
}

function renderTitle() {
  const previews = storyPreviewBriefs();
  const preview = previews[0] ?? null;
  const storyPack = modeFromUrl() !== "daily";
  const title = storyPack ? "Steam 试玩版" : preview?.dailyShareTitle ?? preview?.label ?? "今日来电有点东西";
  const hook = storyPack ? "" : preview?.publicHook ?? "一通匿名来电已经接进来，第一句还没说完。";
  const object = storyPack ? "" : preview?.storyClueObject ?? "今日通话摘录";
  const canContinue = canContinueJourney();
  const playerName = normalizePlayerName(titlePlayerNameDraft ?? state.playerName);
  app.innerHTML = personalizeHostHtml(titleScreenHtml({
    productName: PRODUCT_NAME,
    storyPack,
    title,
    hook,
    object,
    host: { ...HOST_PROFILE, name: playerName },
    audioSettings: getAudioSettings(),
    canContinue,
    resumeLabel: resumeStageLabel(),
    confirmNewGame: (canContinue || Boolean(state.saveLoadError)) && titleNewGameConfirmation,
    saveLoadError: state.saveLoadError,
    quickModeAvailable: storyPack && quickDetectiveCasesFor(storyKeyFromUrl()).length > 0,
    playerName
  }), playerName);
  bind("[data-player-name]", (event) => {
    titlePlayerNameDraft = event.currentTarget.value;
  }, "input");
  bind("[data-start-story]", startStoryPack);
  bind("[data-start-quick-detective]", () => quickScreenRenderersForRender().openQuickDetectiveSelect());
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

function canContinueJourney() {
  return Boolean(!state.saveLoadError && state.caseBriefs?.length && activeCaseBrief());
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
  if (["cafePrologue", "cafePrologueAftermath"].includes(scene)) return "上次停在：开播前的咖啡厅";
  if (scene === "cafePrologueForensic") return "上次停在：鉴定回告";
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
    pressureSignalForLiveCounterChoice,
    nextPlayableSceneIndex,
    nightStructureFor,
    overnightCallbackDialogueLines,
    overnightCallbackOpenerById,
    overnightFirstNight2SceneIndex,
    overnightReturnPostureFor,
    overnightStructureFor,
    playableSceneIndexes,
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
    hostPortraitLayer,
    liveCommentStrip,
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
    escapeHtml: appEscapeHtml,
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
    interludeDeskHtml,
    interludeDialogueActionHtml,
    interludePlaybackActionHtml,
    interruptToastHtml,
    replyChoicesHtml,
    CONTENT_ADVISORS,
    liveChapterTitle,
    moveScene,
    setIndex,
    setIndexValue,
    issueCompletion,
    recordPatienceLost,
    ensureBudget,
    interludeActionState,
    completeInterludeAction,
    nextPendingInterruptAction,
    countCompletedInterludeActions,
    recordInterludeActionChoice,
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
    sceneQuestionChoicesHtml,
    completedSceneExchangeHtml,
    scenePromptExchangeHtml,
    statementStagePromptExchangeHtml,
    sceneQuestionAnswerHtml,
    sceneReviewDoneChoicesHtml,
    sceneReviewHtml,
    stanceSnapshotHtml,
    activeCaseBrief,
    sceneWithShownCard,
    sceneWithCallbackRevision,
    sceneRevisionUnlocked,
    bindChoiceActivation,
    firstUnansweredSceneIndex: firstPendingSceneIndex,
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
    storyOptionalQuickCall,
    careChoiceById,
    careChoicesFor,
    epilogueUnreadStage,
    normalizedCafePrologueProgress,
    cafePrologueStatementReady,
    cafePrologueCanPresentEvidence,
    cafePrologueRevisedStatementReady,
    cafePrologueCanPresentRevisionEvidence,
    cafePrologueRevisionEvidenceHit,
    cafePrologueRemainingEvidenceId,
    cafePrologueCanOpenForensic,
    cafePrologueSceneForStep,
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
    storyInterludeStageHtml,
    storyWorldEchoStageHtml,
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
    cafePrologueHeaderHtml,
    cafePrologueDialogueHtml,
    cafeProloguePortraitStageHtml,
    cafeRevisionStatusHtml,
    cafeMaterialDetailModalHtml,
    cafeMaterialPromptHtml,
    cafeStatementReplayHtml,
    cafeEvidencePairHtml,
    cafeSingleEvidenceHtml,
    cafeTransferPresentHtml,
    cafeLegalRequestsHtml,
    cafeInvestigationChoicesHtml,
    cafeAccountBoardHtml,
    cafeFinalBoundaryHtml,
    storyPackCompleteHtml,
    storyPackShareText,
    storyPackForKey,
    isStoryPackMode,
    storyKeyFromUrl,
    returnToTitle,
    consumePixelTransition: (key) => {
      if (shownPixelTransitions.has(key)) return false;
      shownPixelTransitions.add(key);
      return true;
    },
    nightShellForBrief,
    nightShellInterludeForBrief,
    nightShellGoodEnding,
    nightShellEndingKey,
    compactDialogueLines,
    normalizedDailyResult,
    routeProfileForBrief,
    postDailySharePayload,
    isFinalStoryPackCase,
    advanceToNextStoryPackCase,
    resetCaseAttempt,
    startQuickDetective: (...args) => quickScreenRenderersForRender().startQuickDetective(...args),
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

function createQuickScreenRenderers() {
  return createQuickDetectiveScreens({
    getState: () => state,
    getRoot: () => app,
    productName: PRODUCT_NAME,
    clearQuestionRewindHistory,
    commitTitlePlayerName,
    resetQuickTransientState: () => {
      titleNewGameConfirmation = false;
      shownPixelTransitions = new Set();
    },
    saveState,
    render,
    quickDetectiveCaseFor,
    quickDetectiveCasesFor,
    quickPatienceLostComment: () => storyPackForKey(storyKeyFromUrl())?.quickDetective?.patienceLostComment ?? null,
    storyKeyFromUrl,
    renderTitle,
    personalizeHostHtml,
    personalizeHostText,
    liveFrameHtml,
    liveControlDeckHtml,
    getAudioSettings,
    bind,
    returnToTitle,
    bindAudioControls,
    syncSceneAudio,
    resetViewportScroll,
    queueDefaultFocus,
    canRewindQuestionNow: () => canRewindQuestion(questionRewindHistory),
    consumePixelTransition: (key) => {
      if (shownPixelTransitions.has(key)) return false;
      shownPixelTransitions.add(key);
      return true;
    }
  });
}

function quickScreenRenderersForRender() {
  quickScreenRenderers ??= createQuickScreenRenderers();
  return quickScreenRenderers;
}

function renderDailyCase() {
  const brief = activeCaseBrief();
  const screens = dailyScreenRenderersForRender();
  if (state.scene === "sceneQuestionMenu") return screens.renderSceneQuestionMenu(brief);
  if (state.scene === "sceneQuestionAnswer") return screens.renderSceneQuestionAnswer(brief);
  if (state.scene === "sceneLineReplay") return screens.renderSceneLineReplay(brief);
  if (state.scene === "statementPatienceLost") return screens.renderStatementPatienceLost(brief);
  if (state.scene === "testimonyPrelude") return screens.renderTestimonyPrelude(brief);
  if (state.scene === "testimonyWall") return screens.renderTestimonyWall(brief);
  if (state.scene === "testimonyMaterials") return screens.renderTestimonyMaterials(brief, "soft");
  if (state.scene === "decisivePresentMaterial") return screens.renderTestimonyMaterials(brief, "decisive");
  if (state.scene === "decisivePresentTarget") return screens.renderDecisivePresentTarget(brief);
  if (state.scene === "decisivePresentHit") return screens.renderDecisivePresentHit(brief);
  if (isSceneReviewScene(state.scene)) return screens.renderSceneReview(brief);
  if (state.scene === "nightShellPrologue") return screens.renderNightShellPrologue(brief);
  if (state.scene === "nightShellEpilogue") return screens.renderNightShellEpilogue(brief);
  if (state.scene === "cafePrologue") return screens.renderCafePrologue(brief);
  if (state.scene === "cafePrologueAftermath") return screens.renderCafePrologueAftermath(brief);
  if (state.scene === "cafePrologueForensic") return screens.renderCafePrologueForensic(brief);
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
      [`${caseKey(brief)}:sceneReview`]: firstPendingSceneIndex(brief)
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
  return ["sceneReview", "sceneQuestionMenu", "sceneQuestionAnswer", "callSegment1", "callSegment2", "overnightNight1", "overnightNight2", "testimonyPrelude", "testimonyWall", "testimonyMaterials", "decisivePresentMaterial", "decisivePresentTarget", "decisivePresentHit"].includes(scene);
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

function nightShellEndingKey() {
  const paidPlatformCost = Object.values(state.liveCounterPicks ?? {})
    .some((pick) => pick?.endingImpact === "platform-data-loss");
  if (paidPlatformCost) return "platformCost";
  return nightShellGoodEnding() ? "good" : "bad";
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
    ? {
        ...scene,
        version: scene.revisedVersion,
        questionOptions: (scene.questionOptions ?? []).map((option) => ({
          ...option,
          sourceAnchor: option.revisedSourceAnchor ?? option.sourceAnchor,
          question: option.revisedQuestion ?? option.question
        }))
      }
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

function frame({ brief, label, chapter, text, choices, mood, showCaseHud = true, visualHud: visualHudOverride, screenClass = "", backdropClass: backdropClassOverride = "", audioEnterCueId = "", keepVoiceCueId = "", pixelTransition: pixelTransitionOverride = undefined, pressureOverride = null, controlMode = "listen", musicPhase = "" }) {
  const modeLabel = isStoryPackMode() ? "试玩连线" : "今日来电";
  const backdropClass = backdropClassOverride || caseBackdropClass(brief);
  const pressure = showCaseHud ? (pressureOverride ?? currentLivePressure(brief, mood)) : {};
  const visualHud = visualHudOverride ?? (showCaseHud
    ? `${liveCommentStrip(pressure)}${portraitLayer(brief, mood, pressure)}`
    : storyPackSummaryHud());
  const total = Math.max(1, playableSceneCount(brief));
  const materialProfile = unlockedMaterialProfile({ state, brief, visible: showCaseHud });
  const currentMaterial = materialProfile.label;
  const pixelTransition = pixelTransitionOverride === undefined ? pixelTransitionForCurrentScene(brief) : pixelTransitionOverride;
  app.innerHTML = personalizeHostHtml(liveFrameHtml({
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
    materialArtSrc: brief?.evidenceBoard ?? "",
    screenEffect: state.lastScreenEffect ?? "",
    pixelTransition,
    rewindAvailable: canRewindQuestion(questionRewindHistory),
    screenClass: `${screenClass} effects-${state.settings?.screenEffects ?? "full"} ${pixelTransition?.kind === "reveal" ? "key-reveal-answer" : ""} ${showCaseHud ? liveSceneClass(brief, mood, pressure) : ""}`.trim(),
    controlDeckHtml: showCaseHud
      ? liveControlDeckHtml({
          onAirLabel: isStoryPackMode() ? "匿名热线" : brief.label ?? "来电中",
          label,
          segment: Math.min(total, answeredSceneCountForState(state, brief) + 1),
          total,
          pressure,
          mode: controlMode,
          material: currentMaterial,
          materialCount: materialProfile.count
        })
      : ""
  }), state.playerName);
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
  syncSceneAudio({ briefId: brief?.id ?? "root", scene: state.scene || "title", backdropClass, pressureLevel: pressure.level, musicPhase, audioEnterCueId, keepVoiceCueId });
  if (pressure.flashback?.id) playAudioCueOnce("sfx.document.mark", `${caseKey(brief)}:flashback:${pressure.flashback.id}`);
  resetViewportScroll();
  mountCurrentDialogue();
  queueDefaultFocus();
}

function dayFrame({ brief, label, chapter, text, choices, backdropClass = "day-city", audioEnterCueId = "", keepVoiceCueId = "", pixelTransition = undefined }) {
  const materialProfile = unlockedMaterialProfile({ state, brief });
  app.innerHTML = personalizeHostHtml(liveFrameHtml({
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
    materialArtSrc: brief?.evidenceBoard ?? "",
    screenEffect: "",
    pixelTransition: pixelTransition === undefined ? pixelTransitionForCurrentScene(brief) : pixelTransition,
    rewindAvailable: canRewindQuestion(questionRewindHistory),
    controlDeckHtml: ""
  }), state.playerName);
  bind('[data-action="title"]', returnToTitle);
  bind('[data-action="reset"]', resetToTitle);
  bindAudioControls({ root: app, onToggleSound: render });
  syncSceneAudio({ briefId: brief?.id ?? "root", scene: state.scene || "title", backdropClass, audioEnterCueId, keepVoiceCueId });
  resetViewportScroll();
  mountCurrentDialogue();
  queueDefaultFocus();
}

function pixelTransitionForCurrentScene(brief = {}) {
  const revealTransition = keyRevealTransitionForCurrentScene(brief);
  if (revealTransition) return revealTransition;
  const transition = {
    nightShellPrologue: { kind: "soft-fade" },
    overnightPostLive: { kind: "signal-disconnect" },
    dayActOpening: { kind: "scene" },
    overnightCallback: { kind: "signal-connect" },
    storyInterlude: { kind: "signal-disconnect" },
    nightShellEpilogue: { kind: "scene" }
  }[state.scene];
  if (!transition) return null;
  const key = `${caseKey(brief)}:${state.scene}`;
  if (shownPixelTransitions.has(key)) return null;
  shownPixelTransitions.add(key);
  return transition;
}

function keyRevealTransitionForCurrentScene(brief = {}) {
  if (state.scene !== "sceneQuestionAnswer") return null;
  const focus = state.sceneQuestionFocus;
  if (!focus || focus.kind !== "key" || focus.caseId !== caseKey(brief)) return null;
  const pick = state.sceneQuestionPicks?.[answerKey(brief, focus.sceneIndex)];
  const transition = pick?.revealTransition;
  if (!transition?.id) return null;
  const key = `${caseKey(brief)}:reveal:${transition.id}`;
  if (shownPixelTransitions.has(key)) return null;
  shownPixelTransitions.add(key);
  return { ...transition, kind: "reveal", evidenceArtSrc: brief.evidenceBoard ?? transition.evidenceArtSrc ?? "" };
}

function mountCurrentDialogue() {
  const card = app?.querySelector(".dialogue-card");
  if (card) card.insertAdjacentHTML("beforeend", avgSystemBarHtml(state.settings));
  const materialPanel = mountMaterialPanel();
  let controller = null;
  controller = mountDialoguePresentation(app, {
    hostName: normalizePlayerName(state.playerName),
    speed: state.settings?.textSpeed ?? "normal",
    autoMode: Boolean(state.settings?.autoMode),
    autoDelay: state.settings?.autoDelay ?? 2,
    presentationProfile: activeCaseBrief()?.dialoguePresentation ?? {},
    onBlip: playDialogueBlip,
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
  const triggers = Array.from(app?.querySelectorAll?.("[data-material-open]") ?? []);
  const choices = app?.querySelector(".avg-choice-overlay");
  let lastFocused = null;

  const close = ({ restoreFocus = true } = {}) => {
    if (!modal || modal.hidden) return false;
    modal.hidden = true;
    shell?.classList.remove("material-open");
    triggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
    if (restoreFocus && lastFocused && isVisibleElement(lastFocused)) focusButton(lastFocused);
    return true;
  };

  const syncChoices = () => {
    const choicesOpen = Boolean(choices && !choices.hidden && choices.querySelector("button:not(:disabled)"));
    shell?.classList.toggle("choices-open", choicesOpen);
  };

  if (!modal || !triggers.length) return { close, syncChoices };

  triggers.forEach((trigger) => trigger.addEventListener("click", () => {
    const record = app?.querySelector(".court-record:not([hidden])");
    record?.querySelector("[data-record-close]")?.click();
    lastFocused = document.activeElement;
    modal.hidden = false;
    shell?.classList.add("material-open");
    triggers.forEach((item) => item.setAttribute("aria-expanded", "true"));
    focusButton(modal.querySelector(".avg-material-panel [data-material-close]"));
  }));
  modal.querySelectorAll("[data-material-close]").forEach((button) => button.addEventListener("click", () => close()));
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(modal.querySelectorAll("button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex='-1'])"))
      .filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) return;
    const currentIndex = focusable.indexOf(document.activeElement);
    const nextIndex = event.shiftKey
      ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
      : (currentIndex < 0 || currentIndex >= focusable.length - 1 ? 0 : currentIndex + 1);
    event.preventDefault();
    focusable[nextIndex].focus?.();
  });
  return { close, syncChoices };
}

function cycleAvgSetting(kind) {
  const speeds = ["slow", "normal", "fast", "instant"];
  const effects = ["full", "reduced", "off"];
  if (kind === "auto") state.settings.autoMode = !state.settings.autoMode;
  if (kind === "speed") state.settings.textSpeed = speeds[(speeds.indexOf(state.settings.textSpeed) + 1) % speeds.length];
  if (kind === "fast") state.settings.fastForward = !state.settings.fastForward;
  if (kind === "effects") state.settings.screenEffects = effects[(effects.indexOf(state.settings.screenEffects) + 1) % effects.length];
  saveState();
  render();
}

function caseBackdropClass(brief = {}) {
  return brief.backdropClass ?? "backdrop-live";
}

function compactDialogueLines(lines) {
  return (lines ?? []).filter((line) => line?.text);
}

function commitTitlePlayerName() {
  const previousName = normalizePlayerName(state.playerName);
  const input = document.querySelector("[data-player-name]");
  const nextName = normalizePlayerName(input?.value ?? titlePlayerNameDraft ?? previousName);
  state.playerName = nextName;
  if (previousName !== nextName) {
    const previousFamiliarName = playerFamiliarName(previousName);
    const nextFamiliarName = playerFamiliarName(nextName);
    state.dialogueBacklog = (state.dialogueBacklog ?? []).map((line) => ({
      ...line,
      speaker: personalizeHostText(line?.speaker ?? "", nextName).replaceAll(previousName, nextName),
      text: personalizeHostText(line?.text ?? "", nextName)
        .replaceAll(`${previousFamiliarName}哥`, `${nextFamiliarName}哥`)
        .replaceAll(previousName, nextName)
    }));
  }
  titlePlayerNameDraft = null;
  return nextName;
}

function resetViewportScroll() {
  globalThis.scrollTo?.(0, 0);
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
    const readiness = accusationReadinessForBrief(brief);
    if (!readiness.ready) {
      state.lastReaction = readiness.message;
      state.scene = "sceneReview";
      state.dialogueProgress = {
        ...(state.dialogueProgress ?? {}),
        [`${caseKey(brief)}:sceneReview`]: firstPendingSceneIndex(brief)
      };
      saveState();
      return render();
    }
    if (overnightStructureFor(brief) && overnightCallerQuestionFor(brief) && !actionDone(brief, "overnight:callerQuestion")) {
      state.scene = "callerQuestion";
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

function firstPendingSceneIndex(brief) {
  return firstOpenSceneIndex(brief, (actionKey) => actionDone(brief, actionKey));
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

render();
