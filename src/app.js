import { generateCasesForMode } from "./caseModes.js";
import { dailyKeyFromUrl, hasFreshStartParam, modeFromUrl, storyKeyFromUrl } from "./runtime/urlMode.js";
import { isSceneReviewScene } from "./runtime/liveSceneKinds.js";
import { clearPlayedCueKeysByPrefix, getAudioSettings, playAudioCueOnce, playDialogueBlip, playSfx, resetAudioCueHistory } from "./sound.js";
import { audioCueView } from "./audioCatalog.js";
import { baseState, clearStateSnapshot, loadMeta, loadState, normalizeRuntimeState, saveReadingBeforeExit, saveStateSnapshot } from "./state.js";
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
import { afterSceneEvidenceFor, answerKey, availableCallbackOpeners, availableOvernightCallbackOpeners, callbackOpenerById, canEnterOvernightCallback, caseKey, daySceneById, delegationFor, delegationOutcomeFor, delegationRouteAxisForAdvisor, documentById, documentRowById, documentQuestionId, earnedDocumentQuestionsFor, evidenceAnswerKey, evidenceCheckModel, evidenceChecksFor, interludeEarnedItemsForOvernight, investigationAnswerKey, investigationBackflowModel, investigationRouteIndexBase, keyQuestionLimit, liveCounterBeatAfterScene, liveCounterBeatBeforeScene, liveCounterBeatById, liveCounterBeatsFor, nextPlayableSceneIndex, nightActionById, nightStructureFor, overnightCallbackDialogueLines, overnightCallbackOpenerById, overnightCallerQuestionFor, overnightFirstNight2SceneIndex, overnightReturnPostureFor, overnightStructureFor, pendingEvidenceChecksFor, playableSceneCount, playableSceneIndexes, pressureSignalForLiveCounterChoice, returnStanceFor, sceneReviewModel, shouldEnterHangupAfterScene, shouldEnterOvernightHangupAfterScene, snapshotEchoFor, stanceSnapshotForScene } from "./runtime/sceneAdvance.js";
import { isPrivateConsultation } from "./runtime/consultationModel.js";
import { storyInterludeCaseId, storyOptionalQuickCall } from "./runtime/storyInterludeModel.js";
import { careChoiceById, careChoicesFor } from "./runtime/careChoiceModel.js";
import { epilogueUnreadStage } from "./runtime/epilogueUnreadModel.js";
import { cafePrologueCanOpenForensic, cafePrologueCanPresentEvidence, cafePrologueCanPresentRevisionEvidence, cafePrologueRemainingEvidenceId, cafePrologueRevisionEvidenceHit, cafePrologueRevisedStatementReady, cafePrologueSceneForStep, cafePrologueStatementReady, normalizedCafePrologueProgress } from "./runtime/prologueCafeModel.js";
import { hostDisclosureLinesForAnchor } from "./runtime/hostDisclosureModel.js";
import { normalizePlayerName, personalizeHostHtml, personalizeHostText, playerFamiliarName } from "./playerIdentity.js";
import { CHOICE_COST_META } from "./runtime/choiceCostModel.js";
import { mountDialoguePresentation } from "./runtime/dialoguePresentation.js";
import { refreshSavedCaseContent } from "./runtime/savedContentRefresh.js";
import { storyPressureRows } from "./runtime/storyPackSummaryModel.js";
import { callDialogueHtml, choiceButtonBodyHtml, choiceGroupHtml, choiceReviewHtml, flowGroupHtml } from "./ui/callFlowView.js";
import { dailyCompleteChoicesHtml, dailyCompleteHtml, dailyCompleteShareText } from "./ui/dailyCompleteView.js";
import { delegationScreenHtml, evidenceCheckScreenHtml, investigationBackflowScreenHtml } from "./ui/evidenceView.js";
import { audioPlaybackControlsHtml, callbackOpenerBeatHtml, callbackOpenerChoiceHtml, hangupBeatHtml, interludeDeskHtml, interludeDialogueActionHtml, interludePlaybackActionHtml, interruptToastHtml, replyChoicesHtml } from "./ui/interludeDeskView.js";
import { bindAudioControls, syncSceneAudio, watchAudioPlaybackControls } from "./ui/audioController.js";
import { liveCounterBeatHtml } from "./ui/liveCounterBeatView.js";
import { currentLiveCounterPick } from "./runtime/liveCounterModel.js";
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
import { storyPackCompleteHtml } from "./ui/storyPackCompleteView.js";
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
import { createStateCommit } from "./runtime/stateCommit.js";
import { createCaseStateWrites } from "./runtime/caseStateWrites.js";
import { createCaseOutcome } from "./runtime/caseOutcome.js";
import { platformRuntime } from "./platformRuntime.js";
import { composeScreenContext } from "./ui/screenContext.js";
import { createDailyQueryView } from "./ui/dailyScreenParts.js";
import { createLiveChrome } from "./ui/liveChrome.js";
import { createTitleFlow } from "./ui/titleFlow.js";

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
  stopGamepadPollingWhenIdle,
  confirmCurrentControl,
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
let activeDialogueController = null;
let liveChrome = null;
let titleFlow = null;

function areaTotalForRetry(...args) {
  return liveChrome.areaTotalForRetry(...args);
}

function currentIndex(...args) {
  return liveChrome.currentIndex(...args);
}
let runtimeErrorNotice = meta.loadError ? "以前的通关统计没能读出来；本局进度不受影响。" : "";
installRuntimeErrorReporting();
syncRuntimeWarningBanner();
const commit = createStateCommit({ getState: () => state, saveState, render });
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
  commit,
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
  commit,
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
const shellBound = {
  getState: () => state,
  get pixelTransitions() { return shownPixelTransitions; },
  set pixelTransitions(value) { shownPixelTransitions = value; },
  get confirmingNewGame() { return titleNewGameConfirmation; },
  set confirmingNewGame(value) { titleNewGameConfirmation = value; },
  get titleNameDraft() { return titlePlayerNameDraft; },
  set titleNameDraft(value) { titlePlayerNameDraft = value; },
  get meta() { return meta; },
  setState: (nextState) => { state = nextState; },
  defaultAttrs: DEFAULT_ATTRS,
  clearQuestionRewindHistory,
  dailyScreens: () => dailyScreenRenderersForRender(),
  openQuickSelect: () => quickScreenRenderersForRender().openQuickDetectiveSelect(),
  nightShellForStoryKey: (...args) => liveChrome.nightShellForStoryKey(...args),
  firstPendingSceneIndex: (...args) => liveChrome.firstPendingSceneIndex(...args),
  get questionRewindHistory() { return questionRewindHistory; },
  get dialogueController() { return activeDialogueController; },
  set dialogueController(value) { activeDialogueController = value; },
  app,
  PRODUCT_NAME,
  saveState,
  render,
  returnToTitle: () => titleFlow.returnToTitle(),
  resetToTitle: () => titleFlow.resetToTitle(),
  activeCaseBrief,
  isStoryPackMode,
  commit,
  bind,
  queueDefaultFocus,
  isVisibleElement,
  focusButton,
  ensureNight,
  ensureOvernight,
  actionDone,
  accusationReadinessForBrief,
  issueCompletion,
  normalizedDailyResult,
  resetViewportScroll,
  currentLivePressure,
  liveCommentStrip,
  liveSceneClass,
  portraitLayer,
  reactionLine,
  storyPackSummaryHud
};
liveChrome = createLiveChrome(shellBound);
const {
  liveChapterTitle,
  nightShellForStoryKey,
  nightShellForBrief,
  nightShellInterludeForBrief,
  nightShellGoodEnding,
  nightShellEndingKey,
  sceneWithShownCard,
  sceneWithCallbackRevision,
  sceneRevisionUnlocked,
  sceneWithLiveCounterQuestionOverride,
  frame,
  dayFrame,
  pixelTransitionForCurrentScene,
  keyRevealTransitionForCurrentScene,
  mountCurrentDialogue,
  syncDialoguePause,
  destroyActiveDialogueController,
  keepInlineChoicesVisible,
  mountMaterialPanel,
  cycleAvgSetting,
  caseBackdropClass,
  stageBackdropArt,
  stanceSnapshotPickForState,
  liveCounterPickKey,
  liveCounterPickForState,
  moveScene,
  setIndex,
  setIndexValue,
  firstPendingSceneIndex,
  sceneAfterEvidenceFor,
  hasDeepFollowup,
  deepFollowupFor,
  dailyConclusion
} = liveChrome;
titleFlow = createTitleFlow(shellBound);
const {
  renderTitle,
  renderDailyCase,
  commitTitlePlayerName,
  returnToTitle
} = titleFlow;

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
  // Native details disclosure must not confirm the currently highlighted inquiry.
  if (event.target.closest?.(".quick-inquiry-history summary")) return;
  const intent = keyboardNavigationIntent(event.key);
  if (intent === "confirm") {
    event.preventDefault();
    if (event.repeat) return;
    confirmCurrentControl();
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
globalThis.addEventListener?.("gamepaddisconnected", () => stopGamepadPollingWhenIdle());
startGamepadPolling();
globalThis.addEventListener?.("pagehide", () => { if (activeDialogueController) saveReadingBeforeExit(state); });

function saveState() {
  const saved = saveStateSnapshot(state);
  syncRuntimeWarningBanner();
  return saved;
}

function installRuntimeErrorReporting() {
  globalThis.addEventListener?.("error", (event) => {
    reportRuntimeError("renderer-error", event.error ?? new Error(event.message ?? "Unknown renderer error"));
  });
  globalThis.addEventListener?.("unhandledrejection", (event) => {
    reportRuntimeError("renderer-unhandled-rejection", event.reason);
  });
}

function reportRuntimeError(kind, error) {
  const normalized = error instanceof Error ? error : new Error(String(error ?? "Unknown renderer error"));
  runtimeErrorNotice = "这一屏出了点问题。你可以回到标题页再继续，进度不会因此被清掉。";
  syncRuntimeWarningBanner();
  platformRuntime.reportError({ kind, message: normalized.message, stack: normalized.stack ?? "" });
}

function syncRuntimeWarningBanner() {
  const message = state?.saveWriteError
    ? "刚才的进度没有存进去。请先不要关闭游戏，检查磁盘空间后再试一次。"
    : runtimeErrorNotice;
  let banner = document.querySelector("#runtime-status-warning");
  if (!message) {
    banner?.remove();
    return;
  }
  if (!banner) {
    banner = document.createElement("div");
    banner.id = "runtime-status-warning";
    banner.className = "runtime-status-warning";
    banner.setAttribute("role", "alert");
    document.body.append(banner);
  }
  banner.textContent = message;
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

function render() {
  if (!app) return;
  destroyActiveDialogueController();
  if (state.screen === "title") return renderTitle();
  if (state.screen === "quickDetectiveSelect") return quickScreenRenderersForRender().renderQuickDetectiveSelect();
  if (state.screen === "quickDetective") return quickScreenRenderersForRender().renderQuickDetective();
  if (!activeCaseBrief()) return renderTitle();
  return renderDailyCase();
}

function createDailyScreenRenderers() {
  const screens = {};
  const session = {
    getState: () => state,
    playAudioCueOnce,
    saveState,
    commit,
    render,
    bind,
    setIndexValue,
    markAction,
    actionDone,
    ensureNight,
    ensureOvernight,
    updateNight,
    updateOvernight,
    recordContradiction,
    recordRouteChoice,
    moveScene,
    setIndex,
    recordPatienceLost,
    ensureBudget,
    completeInterludeAction,
    nextPendingInterruptAction,
    recordInterludeActionChoice,
    recordInterludeReplyChoice,
    closeInterludeAction,
    activeCaseBrief,
    bindChoiceActivation,
    returnToTitle,
    consumePixelTransition: (key) => {
      if (shownPixelTransitions.has(key)) return false;
      shownPixelTransitions.add(key);
      return true;
    },
    isFinalStoryPackCase,
    advanceToNextStoryPackCase,
    resetCaseAttempt,
    startQuickDetective: (...args) => quickScreenRenderersForRender().startQuickDetective(...args),
    renderSceneReview: (...args) => screens.renderSceneReview(...args),
    bindSceneButtons: (...args) => screens.bindSceneButtons(...args),
    renderAccusation: (...args) => screens.renderAccusation(...args),
    enterLiveCounterBeatAfterScene: (...args) => screens.enterLiveCounterBeatAfterScene(...args),
    enterLiveCounterBeatBeforeScene: (...args) => screens.enterLiveCounterBeatBeforeScene(...args)

  };
  const { queries, view } = createDailyQueryView({
    stanceSnapshotPickForState,
    currentIndex,
    sceneAfterEvidenceFor,
    hasDeepFollowup,
    sceneWithShownCard,
    sceneWithCallbackRevision,
    sceneRevisionUnlocked,
    firstPendingSceneIndex,
    deepFollowupFor,
    dailyConclusion,
    liveCounterPickKey,
    liveCounterPickForState,
    nightShellForBrief,
    nightShellInterludeForBrief,
    nightShellGoodEnding,
    nightShellEndingKey,
    isStoryPackMode,
    frame,
    dayFrame,
    liveChapterTitle,
    appEscapeHtml,
    compactDialogueLines,
    issueCompletion,
    interludeActionState,
    countCompletedInterludeActions,
    materialPityLineFor,
    resolveAccusationFromButton,
    accusationReadinessForBrief,
    retryPatienceLostStep,
    audiencePatienceLost,
    normalizedDailyResult,
    routeProfileForBrief,
    postDailySharePayload,
    hostPortraitLayer,
    liveCommentStrip,
    screens
  });
  const ctx = composeScreenContext({ session, queries, view });
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
    commit,
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

function compactDialogueLines(lines) {
  return (lines ?? []).filter((line) => line?.text);
}

function resetViewportScroll() {
  globalThis.scrollTo?.(0, 0);
}


render();
