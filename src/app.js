import { generateCasesForMode } from "./caseModes.js?v=0.20.87";
import { calculateCaseBudgetMax, calculateCaseOutcome, calculateIssueCompletion, expectedAccusationForCase, relationshipExpectedAccusationForCase, resolveAccusationForCase } from "./caseRuntime.js?v=0.20.68";
import { isSoundEnabled, playSfx, toggleSound } from "./sound.js?v=0.20.68";
import { CHARACTER_ART, baseState, clearStateSnapshot, loadMeta, loadState, saveMetaSnapshot, saveStateSnapshot } from "./state.js?v=0.20.78";
import { platformRuntime } from "./platformRuntime.js?v=0.20.68";
import { NPCS } from "./story.js?v=0.20.68";
import { dailyAccusationChoices } from "./dailyChoices.js?v=0.20.68";
import { gamepadAxisDirection, keyboardNavigationIntent, nextFocusIndex } from "./runtime/inputNavigation.js?v=0.20.68";
import { materialOperationOutcome } from "./runtime/materialOperation.js?v=0.20.87";
import { answeredEvidenceCountForState, answeredSceneCountForState, askedDialoguePicksForState, completedSceneExchangeForState, contradictionsForState, latestChoiceReviewRowsForState, routeAxisProfileForState, routeChoicesForState, selectedDelegationPickForState, selectedEvidencePickForState, selectedEvidencePicksForState, selectedInvestigationPickForState, selectedInvestigationPicksForState, selectedScenePickForState, selectedScenePicksForState, truthBoundaryMissesForState, truthBoundaryPicksForState, unlockedInvestigationEntriesForState } from "./runtime/caseStateSelectors.js?v=0.20.68";
import { dailyConclusionModel, dailyPlayerType, dailyRouteProfile as buildDailyRouteProfile, finalQuoteComparison, investigationPickReaction, issueLine, issueResultLine, recapRankLabel, truthBoundaryAftertaste, truthBoundaryReview } from "./runtime/recapModel.js?v=0.20.68";
import { livePressureProfile, materialPressureReaction, materialPressureSignal, pressuredAnswerVariant, questionPressureReaction, questionPressureSignal } from "./runtime/livePressure.js?v=0.21.1";
import { normalizeRouteChoice, routeAxisForChoice, routeToneForChoice } from "./runtime/routeLog.js?v=0.20.68";
import { afterEvidenceScene as nextSceneAfterEvidence, afterSceneEvidenceFor, answerKey, applyActionMark, availableCallbackOpeners, availableOvernightCallbackOpeners, callbackOpenerById, canCompleteNightAction, caseKey, casePatienceLost, completeNightAction, dailyAccusationReadiness as accusationReadinessForCase, daySceneById, delegationFor, delegationOutcomeFor, delegationRouteAxisForAdvisor, documentById, documentRowById, documentQuestionId, earnedDocumentQuestionsFor, evidenceAnswerKey, evidenceCheckModel, evidenceChecksFor, firstUnansweredSceneIndex as firstOpenSceneIndex, initialCaseBudget, initialNightStateFor, initialOvernightStateFor, investigationAnswerKey, investigationBackflowModel, investigationRouteIndexBase, keyQuestionLimit, nightActionById, nightActionCountsForBudget, nightStructureFor, overnightCallbackOpenerById, overnightCallerQuestionFor, overnightFirstNight2SceneIndex, overnightReturnPostureFor, overnightStructureFor, pendingEvidenceChecksFor, recordPatienceLostState, retryPatienceLostState, returnStanceFor, sceneReviewModel, shouldEnterHangupAfterScene, shouldEnterOvernightHangupAfterScene, stanceSnapshotForScene } from "./runtime/sceneAdvance.js?v=0.20.77";
import { storyInterludeNextLine, storyInterludeObjectLabel } from "./runtime/storyInterludeModel.js?v=0.20.96";
import { mountDialoguePresentation } from "./runtime/dialoguePresentation.js?v=0.21.5";
import { storyBoundaryRows, storyMaterialRows, storyPackSummaryModel, storyPressureRows } from "./runtime/storyPackSummaryModel.js?v=0.20.68";
import { callDialogueHtml, choiceGroupHtml, choiceReviewHtml, flowGroupHtml } from "./ui/callFlowView.js?v=0.20.69";
import { dailyCompleteChoicesHtml, dailyCompleteHtml, dailyCompleteShareText } from "./ui/dailyCompleteView.js?v=0.20.68";
import { delegationScreenHtml, evidenceCheckScreenHtml, investigationBackflowScreenHtml } from "./ui/evidenceView.js?v=0.20.87";
import { callbackOpenerBeatHtml, callbackOpenerChoiceHtml, hangupBeatHtml, interludeConflictActionHtml, interludeDeskHtml, interludeDialogueActionHtml, interludePlaybackActionHtml, interruptToastHtml, replyChoicesHtml } from "./ui/interludeDeskView.js?v=0.20.90";
import { audiencePatienceHudHtml, callerExpressionForView, caseProgressStripHtml, liveCommentStripHtml, portraitLayerHtml, storyPackSummaryHudHtml } from "./ui/liveCallView.js?v=0.20.68";
import { liveControlDeckHtml, liveFrameHtml } from "./ui/liveFrameView.js?v=0.20.77";
import { avgSystemBarHtml, mountCourtRecord } from "./ui/courtRecordView.js?v=0.21.0";
import { finalQuoteComparisonHtml, solvedRecapFlowView, solvedRecapPagesHtml } from "./ui/recapView.js?v=0.20.68";
import { routeTrailHtml } from "./ui/routeTrailView.js?v=0.20.68";
import { focusedQuestionOptions, sceneDialogueOptions, sceneQuestionMenuHtml } from "./ui/sceneQuestions.js?v=0.21.1";
import { completedSceneExchangeHtml, scenePromptExchangeHtml, sceneQuestionAnswerHtml, sceneReviewDoneChoicesHtml, sceneReviewHtml, stanceSnapshotHtml } from "./ui/sceneReviewView.js?v=0.21.1";
import { storyInterludeChoicesHtml, storyInterludeHtml } from "./ui/storyInterludeView.js?v=0.20.68";
import { caseClosingChoicesHtml, caseClosingHtml, caseTitleChoicesHtml, caseTitleHtml } from "./ui/caseTransitionView.js?v=0.20.96";
import { storyPackCompleteHtml, storyPackShareText } from "./ui/storyPackCompleteView.js?v=0.20.68";
import { titleScreenHtml } from "./ui/titleView.js?v=0.20.68";
import { CONTENT_ADVISORS } from "./generated/contentPackIndex.js?v=0.20.87";
import { storyPackForKey } from "./storyPacks.js?v=0.20.87";
import { HOST_PROFILE } from "./hostProfile.js?v=0.20.94";

const app = document.querySelector("#app");
const PRODUCT_NAME = "直播间大侦探";
const DEFAULT_ATTRS = { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 };

const startsFresh = hasFreshStartParam();
if (startsFresh) clearStateSnapshot();
let state = normalizeDailyState(startsFresh ? structuredClone(baseState) : loadState() ?? structuredClone(baseState));
let meta = loadMeta();
let gamepadPollingStarted = false;
let gamepadPreviousButtons = {};
let lastGamepadMoveAt = 0;

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || button.disabled) return;
  if (button.dataset.action === "sound") return;
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
    screen: saved?.screen === "chapter" ? "chapter" : "title",
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
    sceneQuestionFocus: saved?.sceneQuestionFocus ?? null,
    evidenceCheckPicks: saved?.evidenceCheckPicks ?? {},
    investigationPicks: saved?.investigationPicks ?? {},
    delegationPicks: saved?.delegationPicks ?? {},
    stanceSnapshots: saved?.stanceSnapshots ?? {},
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
    lastReaction: saved?.lastReaction ?? null,
    lastPressureSignal: saved?.lastPressureSignal ?? null,
    lastPressureAxis: saved?.lastPressureAxis ?? null,
    lastPityLine: saved?.lastPityLine ?? null,
    patienceLostContext: saved?.patienceLostContext ?? null,
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
  const mode = modeFromUrl();
  const caseBriefs = generateCasesForMode(mode, NPCS, DEFAULT_ATTRS, {
    dailyKey: dailyKeyFromUrl(),
    storyKey: storyKeyFromUrl(),
    runNumber: meta.runs ?? 0
  });
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

function resetToTitle() {
  clearStateSnapshot();
  state = normalizeDailyState(structuredClone(baseState));
  state.screen = "title";
  saveState();
  render();
}

function render() {
  if (!app) return;
  if (state.screen === "title") return renderTitle();
  if (!activeCaseBrief()) return renderTitle();
  return renderDailyCase();
}

function renderTitle() {
  const previews = storyPreviewBriefs();
  const preview = previews[0] ?? null;
  const storyPack = modeFromUrl() !== "daily";
  const title = storyPack ? "Steam 试玩版" : preview?.dailyShareTitle ?? preview?.label ?? "今日来电有点东西";
  const hook = storyPack ? preview?.storyThemeIntro ?? preview?.weeklyThemeIntro ?? "热线已经接进来。资料在后台，她已经开口了。" : preview?.publicHook ?? "一通匿名来电已经接进来，第一句还没说完。";
  const object = storyPack ? "热线已接入" : preview?.storyClueObject ?? "今日通话摘录";
  app.innerHTML = titleScreenHtml({ productName: PRODUCT_NAME, storyPack, title, hook, object, host: HOST_PROFILE });
  bind("[data-start-story]", startStoryPack);
  queueDefaultFocus();
}

function renderDailyCase() {
  const brief = activeCaseBrief();
  if (state.scene === "sceneQuestionMenu") return renderSceneQuestionMenu(brief);
  if (state.scene === "sceneQuestionAnswer") return renderSceneQuestionAnswer(brief);
  if (isSceneReviewScene(state.scene)) return renderSceneReview(brief);
  if (state.scene === "nightShellPrologue") return renderNightShellPrologue(brief);
  if (state.scene === "nightShellEpilogue") return renderNightShellEpilogue(brief);
  if (state.scene === "stanceSnapshot") return renderStanceSnapshot(brief);
  if (state.scene === "overnightHangup") return renderOvernightHangup(brief);
  if (state.scene === "overnightPostLive") return renderOvernightPostLive(brief);
  if (state.scene === "dayActOpening") return renderDayActOpening(brief);
  if (state.scene === "dayMap") return renderDayMap(brief);
  if (state.scene === "dayScene") return renderDayScene(brief);
  if (state.scene === "overnightCallback") return renderOvernightCallback(brief);
  if (state.scene === "documentReconcile") return renderDocumentReconcile(brief);
  if (state.scene === "hangupBeat") return renderHangupBeat(brief);
  if (state.scene === "interludeDesk") return renderInterludeDesk(brief);
  if (state.scene === "callbackOpener") return renderCallbackOpener(brief);
  if (state.scene === "callbackOpenerBeat") return renderCallbackOpenerBeat(brief);
  if (state.scene === "afterSceneEvidence") return renderAfterSceneEvidence(brief);
  if (state.scene === "evidenceCheck") return renderEvidenceCheck(brief);
  if (state.scene === "delegation") return renderDelegation(brief);
  if (state.scene === "investigationBackflow") return renderInvestigationBackflow(brief);
  if (state.scene === "callerQuestion") return renderCallerQuestion(brief);
  if (state.scene === "deepFollowup") return renderDeepFollowup(brief);
  if (state.scene === "testimony" || state.scene === "evidence") {
    state.scene = "sceneReview";
    state.dialogueProgress = {
      ...(state.dialogueProgress ?? {}),
      [`${caseKey(brief)}:sceneReview`]: firstUnansweredSceneIndex(brief)
    };
    saveState();
    return renderSceneReview(brief);
  }
  if (state.scene === "accusation") return renderAccusation(brief);
  if (state.scene === "patienceLost") return renderPatienceLost(brief);
  if (state.scene === "caseSolved") return renderSolved(brief);
  if (state.scene === "caseClosure") return renderCaseClosure(brief);
  if (state.scene === "storyInterlude") return renderStoryInterlude(brief);
  if (state.scene === "caseTitle") return renderCaseTitle(brief);
  if (state.scene === "runComplete") return renderRunComplete(brief);
  return renderCaseOpen(brief);
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

function nightShellInterludeLine(brief = {}) {
  const shell = nightShellForBrief(brief);
  return (shell?.interludes ?? []).find((item) => item.afterCaseId === brief.id || item.afterCaseId === brief.caseId)?.line ?? "";
}

function nightShellGoodEnding() {
  const briefs = state.caseBriefs ?? [];
  const results = briefs.map((brief) => normalizedDailyResult(brief));
  const finished = results.filter((result) => result.accused);
  if (!finished.length) return false;
  const average = finished.reduce((sum, result) => sum + Number(result.issuePercent ?? 0), 0) / finished.length;
  return average >= 60;
}

function renderCaseOpen(brief) {
  const lines = compactDialogueLines(brief.openingDialogue ?? []);
  frame({
    brief,
    mood: "listening",
    label: "直播连线",
    chapter: liveChapterTitle(brief),
    text: callDialogueHtml(lines),
    choices: flowGroupHtml(`<button class="primary" data-scene="sceneReview" type="button">继续</button>`)
  });
  bindSceneButtons();
}

function renderNightShellPrologue(brief) {
  const prologue = nightShellForBrief(brief)?.prologue ?? {};
  const lines = [...(prologue.lines ?? []), prologue.hostLine].filter(Boolean);
  frame({
    brief,
    mood: "focused",
    label: "夜班序章",
    chapter: "深夜档",
    showCaseHud: false,
    visualHud: "",
    text: nightShellHtml(lines),
    choices: flowGroupHtml(`<button class="primary" data-enter-first-case type="button">开始接线</button>`)
  });
  bind("[data-enter-first-case]", () => {
    state.scene = "caseOpen";
    saveState();
    render();
  });
  bindSceneButtons();
}

function renderNightShellEpilogue(brief) {
  const epilogue = nightShellForBrief(brief)?.epilogue ?? {};
  const resultLine = nightShellGoodEnding() ? epilogue.good : epilogue.bad;
  const lines = [epilogue.opening, resultLine, epilogue.home, epilogue.close].filter(Boolean);
  frame({
    brief,
    mood: "focused",
    label: "天亮前",
    chapter: "深夜档",
    showCaseHud: false,
    text: nightShellHtml(lines),
    choices: flowGroupHtml(`<button class="primary" data-finish-night-shell type="button">收麦</button>`)
  });
  bind("[data-finish-night-shell]", () => moveScene("runComplete"));
  bindSceneButtons();
}

function nightShellHtml(lines = []) {
  return `
    <section class="night-shell-card">
      ${lines.map((line) => {
        const entry = typeof line === "string" ? { text: line } : line ?? {};
        return `
          <div class="night-shell-line shell-${escapeHtml(entry.type ?? "plain")}">
            ${entry.speaker ? `<b>${escapeHtml(entry.speaker)}</b>` : ""}
            <p>${escapeHtml(entry.text ?? "")}</p>
          </div>
        `;
      }).join("")}
    </section>
  `;
}

function renderSceneReview(brief) {
  const review = sceneReviewModel({
    brief,
    index: currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1),
    actionDone: (key) => actionDone(brief, key),
    issueBadge: issueCompletion(brief).badge,
    hasDeepFollowup: !nightStructureFor(brief) && !overnightStructureFor(brief) && hasDeepFollowup(brief)
  });
  const { index, scene, done, lastStage, nextStage, nextLabel } = review;
  const sceneForView = sceneWithShownCard(brief, sceneWithCallbackRevision(brief, scene, index));
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
    text: sceneReviewHtml({
      index,
      done,
      completedExchangeHtml,
      activeExchangeHtml: done ? "" : scenePromptExchangeHtml({ scene: sceneForView, askedCount: dialoguePicks.length }),
      reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief, { excludeIndex: index }))
    }),
    choices: done
      ? sceneReviewDoneChoicesHtml({ lastStage, nextStage, nextLabel })
      : flowGroupHtml(`<button class="primary" data-open-question-menu type="button">提问</button>`)
  });
  bind("[data-open-question-menu]", () => openSceneQuestionMenu(brief, index));
  bind("[data-next-scene-stage]", () => continueAfterSceneReview(brief, index));
  bindSceneButtons();
}

function renderSceneQuestionMenu(brief) {
  const index = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
  const scene = sceneWithShownCard(brief, sceneWithCallbackRevision(brief, brief.sceneVersions?.[index] ?? {}, index));
  const dialoguePicks = askedDialoguePicksForState(state, brief, index);
  if (selectedScenePickForState(state, brief, index)) return closeSceneQuestionMenu(brief);
  frame({
    brief,
    mood: "thinking",
    label: "连线继续",
    chapter: liveChapterTitle(brief),
    text: sceneQuestionMenuHtml(index, scene, dialoguePicks),
    choices: flowGroupHtml(`<button data-close-question-menu type="button">先不问了</button>`)
  });
  bindChoiceActivation("[data-scene-question]", (button) => handleSceneQuestionButton(button));
  bindChoiceActivation("[data-scene-dialogue]", (button) => handleSceneDialogueButton(button));
  bind("[data-close-question-menu]", () => closeSceneQuestionMenu(brief));
  bindSceneButtons();
}

function renderSceneQuestionAnswer(brief) {
  const index = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
  const focus = sceneQuestionFocusFor(brief, index);
  if (!focus) return closeSceneQuestionMenu(brief);
  const dialoguePicks = askedDialoguePicksForState(state, brief, index);
  const pick = focus.kind === "dialogue"
    ? dialoguePicks.find((item) => Number(item.optionIndex) === Number(focus.optionIndex))
    : selectedScenePickForState(state, brief, index);
  if (!pick?.question || !pick?.answer) return closeSceneQuestionMenu(brief);
  const review = sceneReviewModel({
    brief,
    index,
    actionDone: (key) => actionDone(brief, key),
    issueBadge: issueCompletion(brief).badge,
    hasDeepFollowup: !nightStructureFor(brief) && !overnightStructureFor(brief) && hasDeepFollowup(brief)
  });
  frame({
    brief,
    mood: focus.kind === "key" ? "focused" : "thinking",
    label: "连线继续",
    chapter: liveChapterTitle(brief),
    text: sceneQuestionAnswerHtml({ question: pick.question, answer: pick.answer }),
    choices: focus.kind === "key"
      ? sceneReviewDoneChoicesHtml({ lastStage: review.lastStage, nextStage: review.nextStage, nextLabel: review.nextLabel })
      : flowGroupHtml(`<button class="primary" data-return-question-menu type="button">继续问</button>`)
  });
  bind("[data-return-question-menu]", () => openSceneQuestionMenu(brief, index));
  bind("[data-next-scene-stage]", () => continueAfterSceneReview(brief, index));
  bindSceneButtons();
}

function renderStanceSnapshot(brief) {
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
    return renderSceneReview(brief);
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
    state.scene = shouldEnterOvernightHangupAfterScene(brief, snapshot.sceneIndex)
      ? "overnightHangup"
      : shouldEnterHangupAfterScene(brief, snapshot.sceneIndex)
        ? "hangupBeat"
        : "sceneReview";
    saveState();
    render();
  });
  bindSceneButtons();
}

function renderHangupBeat(brief) {
  const structure = nightStructureFor(brief);
  if (!structure?.hangup) {
    state.scene = "sceneReview";
    saveState();
    return renderSceneReview(brief);
  }
  frame({
    brief,
    mood: "tense",
    label: "连线挂断",
    chapter: "第一段连线",
    text: hangupBeatHtml(structure.hangup),
    choices: flowGroupHtml(`<button class="primary" data-enter-interlude type="button">切到调查台</button>`)
  });
  bind("[data-enter-interlude]", () => {
    updateNight(brief, { segment: "interlude", hangupDone: true });
    state.scene = "interludeDesk";
    saveState();
    render();
  });
  bindSceneButtons();
}

function renderOvernightHangup(brief) {
  const structure = overnightStructureFor(brief);
  if (!structure) {
    state.scene = "sceneReview";
    saveState();
    return renderSceneReview(brief);
  }
  frame({
    brief,
    mood: "tense",
    label: "连线挂断",
    chapter: "第一夜",
    text: `
      <section class="hangup-beat-card">
        <span>${escapeHtml(structure.hangupLine ?? "")}</span>
        ${callDialogueHtml([{ role: "host", text: structure.hostHoldLine ?? "" }])}
      </section>
    `,
    choices: flowGroupHtml(`<button class="primary" data-enter-post-live type="button">收麦，离开直播台</button>`)
  });
  bind("[data-enter-post-live]", () => {
    state.scene = "overnightPostLive";
    saveState();
    render();
  });
  bindSceneButtons();
}

function renderOvernightPostLive(brief) {
  const structure = overnightStructureFor(brief);
  const contact = structure?.postHangupContact ?? null;
  if (!structure || !contact?.lines?.length) {
    state.scene = "dayActOpening";
    saveState();
    return renderDayActOpening(brief);
  }
  frame({
    brief,
    mood: "focused",
    label: "收麦后",
    chapter: "第一夜 · 后台",
    showCaseHud: false,
    visualHud: "",
    text: `
      <section class="hangup-beat-card hangup-npc-contact">
        <span>${escapeHtml(contact.stageDirection ?? "直播信号已经切断。")}</span>
        <span class="source-badge">${escapeHtml(contact.label ?? "收麦后通话")}</span>
        ${callDialogueHtml(contact.lines)}
      </section>
    `,
    choices: flowGroupHtml(`<button class="primary" data-enter-day-act type="button">进入第二幕</button>`)
  });
  bind("[data-enter-day-act]", () => {
    state.scene = "dayActOpening";
    saveState();
    render();
  });
  bindSceneButtons();
}

function renderDayActOpening(brief) {
  const structure = overnightStructureFor(brief);
  if (!structure) {
    state.scene = "dayMap";
    saveState();
    return renderDayMap(brief);
  }
  const caseNumber = Number(state.chapter ?? 1);
  dayFrame({
    brief,
    label: `第 ${caseNumber} 案 · 第二幕`,
    chapter: "第二天，下午 · 离台调查",
    backdropClass: "day-city",
    text: `
      <section class="day-act-opening">
        <span>第二天，下午</span>
        <b>离台调查</b>
        <p>${escapeHtml(structure.dayIntro ?? "")}</p>
        <small>没有弹幕替你接话。现在去找人，也去找原件。</small>
      </section>
    `,
    choices: flowGroupHtml(`<button class="primary" data-enter-day-map type="button">开始走访</button>`)
  });
  bind("[data-enter-day-map]", () => {
    updateOvernight(brief, { segment: "day", hangupDone: true });
    state.scene = "dayMap";
    saveState();
    render();
  });
  bindSceneButtons();
}

function renderDayMap(brief) {
  const structure = overnightStructureFor(brief);
  if (!structure) {
    state.scene = "sceneReview";
    saveState();
    return renderSceneReview(brief);
  }
  const overnight = ensureOvernight(brief);
  const done = new Set(overnight.dayScenesDone ?? []);
  const remaining = Number(overnight.dayBudget?.remaining ?? 0);
  const scenes = structure.dayScenes ?? [];
  const sceneGrid = scenes.map((scene) => {
    const completed = done.has(scene.id);
    const disabled = !completed && remaining <= 0;
    if (completed) {
      return `
        <article class="day-place done">
          <b>${escapeHtml(scene.label ?? "")}</b>
          <span>已去过</span>
        </article>
      `;
    }
    return `
      <button class="day-place" data-day-scene="${escapeHtml(scene.id ?? "")}" ${disabled ? "disabled" : ""} type="button">
        <b>${escapeHtml(scene.label ?? "")}</b>
        <span>${disabled ? "下午不够了" : "过去看看"}</span>
      </button>
    `;
  }).join("");
  dayFrame({
    brief,
    label: "白天调查",
    chapter: "第二天，下午",
    backdropClass: "day-city",
    text: `
      <section class="day-map-card">
        <span class="source-badge">下午走访</span>
        <div class="interlude-budget" aria-label="白天预算">
          <b>剩余 ${remaining}/${Number(overnight.dayBudget?.max ?? 0)}</b>
          <span>去过 ${(overnight.dayScenesDone ?? []).length} 处。</span>
        </div>
        <div class="day-place-grid">${sceneGrid}</div>
        ${(overnight.earnedItems ?? []).length ? `<p class="hint">带到夜里的东西：${escapeHtml((overnight.earnedItems ?? []).join(" / "))}</p>` : ""}
      </section>
    `,
    choices: flowGroupHtml(`<button class="primary" data-enter-overnight-callback type="button">等到夜里</button>`)
  });
  bind("[data-day-scene]", (event) => {
    updateOvernight(brief, { activeDaySceneId: event.currentTarget?.getAttribute("data-day-scene") ?? "" });
    state.scene = "dayScene";
    saveState();
    render();
  });
  bind("[data-enter-overnight-callback]", () => {
    updateOvernight(brief, { segment: "night2" });
    state.scene = "overnightCallback";
    saveState();
    render();
  });
  bindSceneButtons();
}

function renderDayScene(brief) {
  const structure = overnightStructureFor(brief);
  const overnight = ensureOvernight(brief);
  const dayScene = daySceneById(brief, overnight.activeDaySceneId);
  if (!structure || !dayScene) {
    state.scene = "dayMap";
    saveState();
    return renderDayMap(brief);
  }
  const body = dayScene.body ?? {};
  if (dayScene.kind === "document") return renderDocumentDayScene(brief, dayScene);
  const completed = (overnight.dayScenesDone ?? []).includes(dayScene.id);
  const timeline = body.timelineSort;
  const timelineState = overnight.timelineSorts?.[dayScene.id] ?? { order: [], submitted: false };
  const followupAsked = Boolean(overnight.dayFollowups?.[dayScene.id]);
  const interaction = timeline
    ? dayTimelineHtml(dayScene, timeline, timelineState)
    : dayFollowupHtml(body, followupAsked);
  const canLeave = completed || !timeline || timelineState.submitted;
  dayFrame({
    brief,
    label: dayScene.label ?? "白天调查",
    chapter: quietDayChapter(dayScene.kind),
    backdropClass: dayScene.backdropClass ?? "day-city",
    text: `
      <section class="day-scene-card">
        <span class="source-badge">${escapeHtml(dayScene.label ?? "白天")}</span>
        <p>${escapeHtml(body.text ?? "")}</p>
        ${interaction}
      </section>
    `,
    choices: flowGroupHtml(`
      <button data-scene="dayMap" type="button">先退回街上</button>
      ${canLeave ? `<button class="primary" data-complete-day-scene type="button">记下离开</button>` : ""}
    `)
  });
  bind("[data-day-timeline-card]", (event) => {
    selectTimelineCard(brief, dayScene, event.currentTarget?.getAttribute("data-day-timeline-card") ?? "");
  });
  bind("[data-reset-day-timeline]", () => {
    updateOvernight(brief, {
      timelineSorts: {
        ...(ensureOvernight(brief).timelineSorts ?? {}),
        [dayScene.id]: { order: [], submitted: false }
      }
    });
    saveState();
    render();
  });
  bind("[data-submit-day-timeline]", () => submitTimelineSort(brief, dayScene));
  bind("[data-day-followup]", () => {
    updateOvernight(brief, {
      dayFollowups: {
        ...(ensureOvernight(brief).dayFollowups ?? {}),
        [dayScene.id]: true
      }
    });
    saveState();
    render();
  });
  bind("[data-complete-day-scene]", () => completeDayScene(brief, dayScene));
  bindSceneButtons();
}

function renderOvernightCallback(brief) {
  const structure = overnightStructureFor(brief);
  if (!structure) {
    state.scene = "sceneReview";
    saveState();
    return renderSceneReview(brief);
  }
  const overnight = ensureOvernight(brief);
  const openers = availableOvernightCallbackOpeners(brief, overnight.earnedItems);
  if (!overnight.callbackOpenerId && openers.length > 1) {
    frame({
      brief,
      mood: "focused",
      label: "回拨开场",
      chapter: "第二夜",
      text: `
        <section class="callback-opener-card">
          <span class="source-badge">回拨已接入</span>
          <p><b>带一件白天的东西回到麦上</b></p>
          <div class="callback-opener-grid">
            ${openers.map((opener) => `
              <button class="callback-opener-option" data-overnight-opener="${escapeHtml(opener.id ?? "")}" type="button">
                <b>${escapeHtml(opener.id ?? "")}</b>
                <span>${escapeHtml(opener.line ?? "")}</span>
              </button>
            `).join("")}
          </div>
        </section>
      `,
      choices: ""
    });
    bind("[data-overnight-opener]", (event) => {
      updateOvernight(brief, { callbackOpenerId: event.currentTarget?.getAttribute("data-overnight-opener") ?? "" });
      saveState();
      render();
    });
    bindSceneButtons();
    return;
  }
  const opener = overnight.callbackOpenerId
    ? overnightCallbackOpenerById(brief, overnight.callbackOpenerId)
    : openers[0] ?? { id: "fallback", ...(structure.callbackFallback ?? {}) };
  const posture = overnightReturnPostureFor(stanceSnapshotPickForState(brief));
  const stanceLine = structure.postures?.[posture] ?? "";
  frame({
    brief,
    mood: posture === "againstCaller" ? "tense" : "focused",
    label: "回拨已接入",
    chapter: "第二夜",
    text: `
      <section class="callback-opener-card">
        <span class="source-badge">第二夜</span>
        ${callDialogueHtml([
          ...(stanceLine ? [{ role: "caller", text: stanceLine }] : []),
          { role: "caller", text: opener.line ?? "" }
        ])}
      </section>
    `,
    choices: flowGroupHtml(`<button class="primary" data-enter-overnight-night2 type="button">继续追问</button>`)
  });
  bind("[data-enter-overnight-night2]", () => {
    updateOvernight(brief, { segment: "night2", callbackOpenerId: opener.id ?? "fallback" });
    setIndexValue(brief, "sceneReview", overnightFirstNight2SceneIndex(brief));
    state.scene = pendingDocumentQuestions(brief).length ? "documentReconcile" : "overnightNight2";
    saveState();
    render();
  });
  bindSceneButtons();
}

function renderDocumentDayScene(brief, dayScene = {}) {
  const document = documentById(brief, dayScene.body?.documentId);
  if (!document) {
    state.scene = "dayMap";
    saveState();
    return renderDayMap(brief);
  }
  const overnight = ensureOvernight(brief);
  const markedRows = overnight.documentMarks?.[document.id] ?? [];
  dayFrame({
    brief,
    label: dayScene.label ?? document.title ?? "回后台审流水",
    chapter: quietDayChapter(dayScene.kind),
    backdropClass: dayScene.backdropClass ?? "day-document",
    text: documentViewerHtml({ document, markedRows }),
    choices: flowGroupHtml(`
      <button data-scene="dayMap" type="button">先退回街上</button>
      <button class="primary" data-complete-day-scene type="button">记下离开</button>
    `)
  });
  bind("[data-document-row]", (event) => markDocumentRow(brief, dayScene, document, event.currentTarget?.getAttribute("data-document-row") ?? ""));
  bind("[data-complete-day-scene]", () => completeDayScene(brief, dayScene));
  bindSceneButtons();
}

function renderDocumentReconcile(brief) {
  const overnight = ensureOvernight(brief);
  const pending = pendingDocumentQuestions(brief);
  const active = (overnight.documentEarnedQuestions ?? []).find((question) => question.id === overnight.activeDocumentQuestionId) ?? null;
  if (!pending.length && !active) {
    enterOvernightNight2(brief);
    return;
  }
  frame({
    brief,
    mood: "focused",
    label: "对账节拍",
    chapter: "第二夜",
    text: documentReconcileHtml({ active, pending }),
    choices: flowGroupHtml(`
      ${active ? `<button class="primary" data-close-document-question type="button">继续对账</button>` : ""}
      ${!active && !pending.length ? `<button class="primary" data-enter-overnight-night2-direct type="button">继续追问</button>` : ""}
    `)
  });
  bind("[data-document-question]", (event) => askDocumentQuestion(brief, event.currentTarget?.getAttribute("data-document-question") ?? ""));
  bind("[data-close-document-question]", () => {
    updateOvernight(brief, { activeDocumentQuestionId: null });
    saveState();
    render();
  });
  bind("[data-enter-overnight-night2-direct]", () => enterOvernightNight2(brief));
  bindSceneButtons();
}

function dayTimelineHtml(dayScene = {}, timeline = {}, timelineState = {}) {
  const order = timelineState.order ?? [];
  const submitted = Boolean(timelineState.submitted);
  const selected = new Set(order);
  const cards = timeline.cards ?? [];
  const payoff = timelineState.correct ? timeline.payoffLine : timeline.missLine;
  return `
    <section class="day-timeline-sort">
      <header class="timeline-sort-head">
        <span class="source-badge">时间线</span>
        <b>把确认过的时间点，从早到晚放进来。</b>
        <small>已放 ${order.length}/${cards.length} 张。</small>
      </header>
      <section class="timeline-order" aria-label="当前时间线">
        <span>当前顺序</span>
        <ol class="timeline-picked">
          ${cards.map((_, index) => {
            const card = order[index];
            return `<li class="${card ? "filled" : "empty"}"><i>${index + 1}</i><span>${escapeHtml(card ?? "等待放入")}</span></li>`;
          }).join("")}
        </ol>
      </section>
      ${submitted ? `<p class="reaction">${escapeHtml(payoff ?? "")}</p>` : `
        <section class="timeline-available">
          <span>待放时间点</span>
          <div class="timeline-card-grid">
            ${cards.map((card) => `
              <button data-day-timeline-card="${escapeHtml(card)}" ${selected.has(card) ? "disabled" : ""} type="button">
                ${escapeHtml(card)}
              </button>
            `).join("")}
          </div>
        </section>
        <div class="inline-actions">
          <button data-reset-day-timeline ${order.length ? "" : "disabled"} type="button">清空重排</button>
          <button class="primary" data-submit-day-timeline ${order.length === cards.length ? "" : "disabled"} type="button">确认时间线</button>
        </div>
      `}
    </section>
  `;
}

function dayFollowupHtml(body = {}, followupAsked = false) {
  const followup = body.followup;
  if (!followup?.question) return "";
  return `
    <section class="day-followup">
      ${followupAsked ? callDialogueHtml([
        { role: "host", text: followup.question },
        { role: "caller", speaker: followup.speaker ?? "她", text: followup.answer ?? "" }
      ]) : `<button data-day-followup type="button">${escapeHtml(followup.question)}</button>`}
    </section>
  `;
}

function quietDayChapter(dayKind = "") {
  return {
    lab: "白天·鉴定所",
    visit: "白天·街上",
    home: "白天·家",
    studio: "白天·工作室",
    document: "白天·后台流水"
  }[dayKind] ?? "白天";
}

function documentViewerHtml({ document = {}, markedRows = [] } = {}) {
  const marked = new Set(markedRows ?? []);
  const limit = Number(document.markLimit ?? 3);
  return `
    <section class="document-viewer-card">
      <span class="source-badge">文档呈堂</span>
      <p><b>${escapeHtml(document.title ?? "")}</b></p>
      <p>${escapeHtml(document.intro ?? "")}</p>
      <div class="document-mark-limit"><b>已圈 ${marked.size}/${limit}</b><span>圈行后，夜里可逐条对账。</span></div>
      <div class="bank-flow-table" role="table" aria-label="${escapeHtml(document.title ?? "流水单")}">
        <div class="bank-flow-head" role="row">
          <span>行</span><span>日期</span><span>类别</span><span>金额</span><span>对手方</span><span>备注</span>
        </div>
        ${(document.rows ?? []).map((row) => {
          const selected = marked.has(row.rowId);
          const disabled = !selected && marked.size >= limit;
          return `
            <button class="bank-flow-row ${selected ? "marked" : ""}" data-document-row="${escapeHtml(row.rowId ?? "")}" ${disabled || selected ? "disabled" : ""} type="button" role="row">
              <span>${escapeHtml(row.rowId ?? "")}</span>
              <span>${escapeHtml(row.date ?? "")}</span>
              <span>${escapeHtml(row.kind ?? "")}</span>
              <span>${escapeHtml(row.amount ?? "")}</span>
              <span>${escapeHtml(row.party ?? "")}</span>
              <span>${escapeHtml(row.memo ?? "")}</span>
            </button>
          `;
        }).join("")}
      </div>
      ${documentEarnedPreviewHtml(document, markedRows)}
    </section>
  `;
}

function documentEarnedPreviewHtml(document = {}, markedRows = []) {
  const earned = earnedDocumentQuestionsFor(document, markedRows);
  if (!earned.length) return "";
  return `
    <section class="document-earned-preview">
      <span class="source-badge">夜里可问</span>
      ${earned.map((question) => `<p>${escapeHtml(question.question ?? "")}</p>`).join("")}
    </section>
  `;
}

function documentReconcileHtml({ active = null, pending = [] } = {}) {
  if (active) {
    return `
      <section class="document-reconcile-card">
        <span class="source-badge">对账</span>
        ${callDialogueHtml([
          { role: "host", text: active.question ?? "" },
          { role: "caller", text: active.answer ?? "" }
        ])}
      </section>
    `;
  }
  return `
    <section class="document-reconcile-card">
      <span class="source-badge">对账节拍</span>
      <p><b>白天圈出的行，夜里逐条问。</b></p>
      <div class="document-question-grid">
        ${pending.map((question) => `
          <button data-document-question="${escapeHtml(question.id ?? "")}" type="button">
            <b>${escapeHtml(questionLabel(question))}</b>
            <span>${escapeHtml(question.question ?? "")}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function questionLabel(question = {}) {
  return question.kind === "cross" ? `交叉 ${question.rows?.join(" × ")}` : `行 ${question.rows?.join(" / ")}`;
}

function selectTimelineCard(brief, dayScene = {}, card = "") {
  if (!card) return;
  const overnight = ensureOvernight(brief);
  const previous = overnight.timelineSorts?.[dayScene.id] ?? { order: [], submitted: false };
  if (previous.submitted || (previous.order ?? []).includes(card)) return;
  updateOvernight(brief, {
    timelineSorts: {
      ...(overnight.timelineSorts ?? {}),
      [dayScene.id]: {
        ...previous,
        order: [...(previous.order ?? []), card]
      }
    }
  });
  saveState();
  render();
}

function submitTimelineSort(brief, dayScene = {}) {
  const overnight = ensureOvernight(brief);
  const timeline = dayScene.body?.timelineSort ?? {};
  const previous = overnight.timelineSorts?.[dayScene.id] ?? { order: [], submitted: false };
  const order = previous.order ?? [];
  if (previous.submitted || order.length !== (timeline.cards ?? []).length) return;
  const correct = JSON.stringify(order) === JSON.stringify(timeline.correctOrder ?? []);
  updateOvernight(brief, {
    timelineSorts: {
      ...(overnight.timelineSorts ?? {}),
      [dayScene.id]: {
        order,
        submitted: true,
        correct
      }
    }
  });
  recordRouteChoice(brief, overnightRouteIndexFor(brief, dayScene), {
    question: dayScene.label ?? "白天排序",
    answer: order.join(" / "),
    routeAxis: dayScene.body?.routeAxis ?? "document-edge",
    routeTone: correct ? "timeline-hit" : "timeline-miss"
  }, { version: dayScene.body?.text ?? "" });
  completeDayScene(brief, dayScene, { renderNow: false, stayActive: true });
  saveState();
  render();
}

function markDocumentRow(brief, dayScene = {}, document = {}, rowId = "") {
  if (!documentRowById(document, rowId)) return;
  const overnight = ensureOvernight(brief);
  const previous = overnight.documentMarks?.[document.id] ?? [];
  if (previous.includes(rowId)) return;
  const limit = Math.max(0, Number(document.markLimit ?? 3));
  if (previous.length >= limit) return;
  const markedRows = [...previous, rowId];
  const earned = mergeDocumentQuestions(overnight.documentEarnedQuestions ?? [], earnedDocumentQuestionsFor(document, markedRows));
  updateOvernight(brief, {
    documentMarks: {
      ...(overnight.documentMarks ?? {}),
      [document.id]: markedRows
    },
    documentEarnedQuestions: earned
  });
  markAction(brief, `document:${document.id}:${rowId}`);
  recordRouteChoice(brief, overnightRouteIndexFor(brief, dayScene) + markedRows.length / 1000, {
    question: `圈行 ${rowId}`,
    answer: documentRowSummary(documentRowById(document, rowId)),
    routeAxis: "document-edge",
    routeTone: "document-row"
  }, { version: document.title ?? "" });
  saveState();
  render();
}

function mergeDocumentQuestions(current = [], next = []) {
  const byId = new Map((current ?? []).map((question) => [question.id, question]));
  (next ?? []).forEach((question) => byId.set(question.id, question));
  return [...byId.values()];
}

function documentRowSummary(row = {}) {
  return [row.date, row.kind, row.amount, row.party, row.memo].filter(Boolean).join(" / ");
}

function pendingDocumentQuestions(brief) {
  const overnight = ensureOvernight(brief);
  const answered = overnight.documentAnsweredQuestions ?? {};
  return (overnight.documentEarnedQuestions ?? []).filter((question) => !answered[question.id]);
}

function askDocumentQuestion(brief, questionId = "") {
  const overnight = ensureOvernight(brief);
  const question = (overnight.documentEarnedQuestions ?? []).find((item) => item.id === questionId);
  if (!question) return;
  updateOvernight(brief, {
    activeDocumentQuestionId: question.id,
    documentAnsweredQuestions: {
      ...(overnight.documentAnsweredQuestions ?? {}),
      [question.id]: true
    }
  });
  markAction(brief, `documentQuestion:${question.id}`);
  if (question.contradiction) recordContradiction(brief, question.contradiction);
  recordRouteChoice(brief, documentQuestionRouteIndexFor(brief, question), {
    question: question.question ?? "",
    answer: question.answer ?? "",
    routeAxis: question.routeAxis ?? "document-edge",
    routeTone: question.kind === "cross" ? "document-cross" : "document-row-question"
  }, { version: question.rows?.join(" / ") ?? "" });
  saveState();
  render();
}

function documentQuestionRouteIndexFor(brief = {}, question = {}) {
  const questions = ensureOvernight(brief).documentEarnedQuestions ?? [];
  const index = Math.max(0, questions.findIndex((item) => item.id === question.id));
  return keyQuestionLimit(brief) + evidenceChecksFor(brief).length + 0.5 + index / 100;
}

function enterOvernightNight2(brief) {
  setIndexValue(brief, "sceneReview", overnightFirstNight2SceneIndex(brief));
  state.scene = "overnightNight2";
  saveState();
  render();
}

function completeDayScene(brief, dayScene = {}, { renderNow = true, stayActive = false } = {}) {
  const overnight = ensureOvernight(brief);
  const alreadyDone = (overnight.dayScenesDone ?? []).includes(dayScene.id);
  const budget = overnight.dayBudget ?? { max: 0, remaining: 0, used: 0 };
  const earnedItemId = dayScene.body?.earnedItemId;
  updateOvernight(brief, {
    dayBudget: alreadyDone ? budget : {
      ...budget,
      remaining: Math.max(0, Number(budget.remaining ?? 0) - 1),
      used: Number(budget.used ?? 0) + 1
    },
    dayScenesDone: [...new Set([...(overnight.dayScenesDone ?? []), dayScene.id])],
    earnedItems: earnedItemId ? [...new Set([...(overnight.earnedItems ?? []), earnedItemId])] : (overnight.earnedItems ?? []),
    activeDaySceneId: stayActive ? dayScene.id : null
  });
  markAction(brief, `overnight:dayScene:${dayScene.id}`);
  if (!alreadyDone && !dayScene.body?.timelineSort) {
    recordRouteChoice(brief, overnightRouteIndexFor(brief, dayScene), {
      question: dayScene.label ?? "白天地点",
      answer: earnedItemId ?? "visited",
      routeAxis: dayScene.body?.routeAxis ?? "outer-thread",
      routeTone: "day-scene"
    }, { version: dayScene.body?.text ?? "" });
  }
  if (renderNow) {
    state.scene = "dayMap";
    saveState();
    render();
  }
}

function overnightRouteIndexFor(brief = {}, dayScene = {}) {
  const scenes = overnightStructureFor(brief)?.dayScenes ?? [];
  const dayIndex = Math.max(0, scenes.findIndex((item) => item.id === dayScene.id));
  return keyQuestionLimit(brief) + evidenceChecksFor(brief).length + 0.2 + dayIndex / 100;
}

function renderInterludeDesk(brief) {
  const structure = nightStructureFor(brief);
  if (!structure) {
    state.scene = "sceneReview";
    saveState();
    return renderSceneReview(brief);
  }
  const night = ensureNight(brief);
  const activeAction = nightActionById(brief, night.activeActionId);
  if (activeAction) return renderInterludeAction(brief, activeAction);
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
    label: "幕间调查台",
    chapter: "广告中 / 等待回拨",
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
    state.scene = "callbackOpener";
    saveState();
    render();
  });
  bindSceneButtons();
}

function renderInterludeAction(brief, action) {
  if (action.kind === "delegation") return renderInterludeDelegation(brief, action);
  if (action.kind === "evidencePass") return renderInterludeEvidence(brief, action);
  if (action.kind === "backflowEarly") return renderInterludeBackflow(brief, action);
  if (action.kind === "advisorCall") return renderInterludeAdvisorCall(brief, action);
  if (action.kind === "advisorConflict") return renderInterludeAdvisorConflict(brief, action);
  if (action.kind === "interruptToast") return renderInterludeInterruptToast(brief, action);
  if (action.kind === "playback") return renderInterludePlayback(brief, action);
  completeInterludeAction(brief, action);
}

function renderInterludeDelegation(brief, action) {
  const delegation = delegationFor(brief);
  const pick = selectedDelegationPickForState(state, brief);
  if (!delegation) return completeInterludeAction(brief, action);
  dayFrame({
    brief,
    backdropClass: "day-document",
    label: pick ? "顾问回单" : "送鉴定",
    chapter: "幕间·调查台",
    text: delegationScreenHtml({
      delegation,
      advisors: CONTENT_ADVISORS,
      pick,
      reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
    }),
    choices: flowGroupHtml(`
      ${pick ? `<button class="primary" data-return-interlude type="button">回调查台</button>` : `<button data-return-interlude type="button">先放下</button>`}
    `)
  });
  bindDelegationButtons(brief, delegation, { interludeAction: action });
  bind("[data-return-interlude]", () => closeInterludeAction(brief));
  bindSceneButtons();
}

function renderInterludeEvidence(brief, action) {
  const checkIndex = evidenceChecksFor(brief).findIndex((check) => action.focusCheckIds?.includes(check.id));
  const safeIndex = checkIndex >= 0 ? checkIndex : 0;
  const check = evidenceChecksFor(brief)[safeIndex] ?? null;
  const pick = selectedEvidencePickForState(state, brief, safeIndex);
  if (!check) return completeInterludeAction(brief, action);
  dayFrame({
    brief,
    backdropClass: action.backdropClass ?? "day-document",
    label: action.label ?? "重看材料",
    chapter: "幕间·调查台",
    text: evidenceCheckScreenHtml({
      check,
      pick,
      index: safeIndex,
      reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
    }),
    choices: pick
      ? flowGroupHtml(`<button class="primary" data-return-interlude type="button">回调查台</button>`)
      : ""
  });
  bindEvidenceCheckButtons(brief, check, { interludeAction: action });
  bind("[data-return-interlude]", () => closeInterludeAction(brief));
  bindSceneButtons();
}

function renderInterludeBackflow(brief, action) {
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
    chapter: "幕间·调查台",
    text: `${investigationBackflowScreenHtml({
      hook,
      pick,
      index: hookIndex,
      reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
    })}${pick ? replyChoicesHtml(replyChoices, replyChoiceId) : ""}`,
    choices: pick
      ? flowGroupHtml(`${needsReply ? "" : `<button class="primary" data-return-interlude type="button">回调查台</button>`}`)
      : ""
  });
  bindInvestigationButtons(brief, hook, hookIndex, { interludeAction: action });
  bind("[data-reply-choice]", (event) => recordInterludeReplyChoice(brief, action, replyChoices, event.currentTarget?.getAttribute("data-reply-choice") ?? ""));
  bind("[data-return-interlude]", () => closeInterludeAction(brief));
  bindSceneButtons();
}

function renderInterludeAdvisorCall(brief, action) {
  const night = ensureNight(brief);
  const followupAsked = Boolean(night.interludeFollowups?.[action.id]);
  dayFrame({
    brief,
    backdropClass: action.backdropClass ?? "day-city",
    label: action.label ?? "幕间通话",
    chapter: "幕间·调查台",
    text: interludeDialogueActionHtml(action, followupAsked),
    choices: flowGroupHtml(`
      ${action.script?.followupQuestion && !followupAsked ? `<button data-interlude-followup="${escapeHtml(action.id)}" type="button">追一问</button>` : ""}
      <button class="primary" data-complete-interlude-action type="button">记下回调查台</button>
    `)
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
  dayFrame({
    brief,
    backdropClass: action.backdropClass ?? "day-document",
    label: action.label ?? "听回放",
    chapter: "幕间·调查台",
    text: interludePlaybackActionHtml(action),
    choices: flowGroupHtml(`<button class="primary" data-complete-interlude-action type="button">记下回调查台</button>`)
  });
  bind("[data-complete-interlude-action]", () => completeInterludeAction(brief, action));
  bindSceneButtons();
}

function renderInterludeAdvisorConflict(brief, action) {
  const night = ensureNight(brief);
  const selectedChoiceId = night.interludeActionChoices?.[action.id] ?? "";
  const selectedChoice = (action.options ?? []).find((option) => option.id === selectedChoiceId) ?? null;
  const screen = {
    brief,
    label: action.label ?? "顾问分歧",
    chapter: action.chapter ?? "幕间·调查台",
    text: interludeConflictActionHtml(action, selectedChoiceId),
    choices: selectedChoiceId
      ? flowGroupHtml(`<button class="primary" data-return-interlude type="button">回调查台</button>`)
      : ""
  };
  const backdropClass = selectedChoice?.backdropClass ?? action.backdropClass;
  if (backdropClass) {
    dayFrame({ ...screen, backdropClass });
  } else {
    frame({ ...screen, mood: "focused" });
  }
  bind("[data-advisor-conflict]", (event) => recordAdvisorConflictChoice(brief, action, event.currentTarget?.getAttribute("data-advisor-conflict") ?? ""));
  bind("[data-return-interlude]", () => closeInterludeAction(brief));
  bindSceneButtons();
}

function renderInterludeInterruptToast(brief, action) {
  const night = ensureNight(brief);
  const selectedChoiceId = night.interludeActionChoices?.[action.id] ?? "";
  const hasChoices = (action.choices ?? []).length > 0;
  dayFrame({
    brief,
    backdropClass: action.backdropClass ?? "day-city",
    label: "后台打断",
    chapter: "幕间·调查台",
    text: interruptToastHtml(action, selectedChoiceId),
    choices: flowGroupHtml(`
      ${!hasChoices && !selectedChoiceId ? `<button class="primary" data-complete-interlude-action type="button">稍后处理</button>` : ""}
      ${selectedChoiceId ? `<button class="primary" data-return-interlude type="button">回调查台</button>` : ""}
    `)
  });
  bind("[data-interrupt-choice]", (event) => recordAdvisorConflictChoice(brief, action, event.currentTarget?.getAttribute("data-interrupt-choice") ?? ""));
  bind("[data-complete-interlude-action]", () => completeInterludeAction(brief, action));
  bind("[data-return-interlude]", () => closeInterludeAction(brief));
  bindSceneButtons();
}

function renderCallbackOpener(brief) {
  const night = ensureNight(brief);
  const openers = availableCallbackOpeners(brief, night.inventory, night.interludeChoicesDone);
  frame({
    brief,
    mood: "focused",
    label: "回拨开场",
    chapter: "第二段连线",
    text: callbackOpenerChoiceHtml({ openers, inventory: night.inventory }),
    choices: ""
  });
  bind("[data-callback-opener]", (event) => {
    const openerId = event.currentTarget?.getAttribute("data-callback-opener") ?? "";
    const stance = night.stanceNudge ?? returnStanceFor(brief, stanceSnapshotPickForState(brief));
    updateNight(brief, {
      segment: "segment2",
      callbackOpenerId: openerId,
      callerStanceOnReturn: stance
    });
    state.scene = "callbackOpenerBeat";
    saveState();
    render();
  });
  bindSceneButtons();
}

function renderCallbackOpenerBeat(brief) {
  const night = ensureNight(brief);
  const structure = nightStructureFor(brief);
  const opener = callbackOpenerById(brief, night.callbackOpenerId) ?? availableCallbackOpeners(brief, night.inventory, night.interludeChoicesDone)[0] ?? {};
  const stanceLine = structure?.returnStance?.lines?.[night.callerStanceOnReturn] ?? "";
  frame({
    brief,
    mood: night.callerStanceOnReturn === "defensive" ? "tense" : "focused",
    label: "回拨已接入",
    chapter: "第二段连线",
    text: callbackOpenerBeatHtml({ stanceLine, opener }),
    choices: flowGroupHtml(`<button class="primary" data-enter-segment2 type="button">继续追问</button>`)
  });
  bind("[data-enter-segment2]", () => {
    const firstSegment2 = nightStructureFor(brief)?.segment2SceneIndexes?.[0] ?? 0;
    setIndexValue(brief, "sceneReview", firstSegment2);
    state.scene = "callSegment2";
    saveState();
    render();
  });
  bindSceneButtons();
}

function sceneWithShownCard(brief = {}, scene = {}) {
  if (!scene?.showsCard) return scene;
  const shownCard = (brief.evidenceCards ?? []).find((card) => card.id === scene.showsCard);
  return shownCard ? { ...scene, shownCard } : scene;
}

function sceneWithCallbackRevision(brief = {}, scene = {}, sceneIndex = 0) {
  if (!nightStructureFor(brief)) return scene;
  const opener = callbackOpenerById(brief, ensureNight(brief).callbackOpenerId);
  if (!opener?.appliesRevisedOnScenes?.includes(sceneIndex)) return scene;
  if (!scene?.revisedVersion) return scene;
  return { ...scene, version: scene.revisedVersion };
}

function renderAfterSceneEvidence(brief) {
  const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
  const afterScene = afterSceneEvidenceFor(brief, sceneIndex, (key) => actionDone(brief, key));
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
    chapter: liveChapterTitle(brief),
    text: evidenceCheckScreenHtml({
      check,
      pick,
      index: checkIndex,
      reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
    }),
    choices: pick
      ? flowGroupHtml(`<button class="primary" data-after-scene-evidence type="button">${escapeHtml(afterScene.continueLabel ?? "继续听")}</button>`)
      : ""
  });
  bindEvidenceCheckButtons(brief, check, { afterSceneIndex: sceneIndex });
  bind("[data-after-scene-evidence]", () => continueAfterSceneEvidence(brief, sceneIndex));
  bindSceneButtons();
}

function renderEvidenceCheck(brief) {
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
    state.scene = sceneAfterEvidenceFor(brief);
    saveState();
    return render();
  }
  frame({
    brief,
    mood: pick ? (pick.correct ? "focused" : "tense") : "thinking",
    label: "看材料",
    chapter: liveChapterTitle(brief),
    text: evidenceCheckScreenHtml({
      check,
      pick,
      index,
      reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
    }),
    choices: pick
      ? flowGroupHtml(lastCheck
        ? `<button class="primary" data-scene="${effectiveNextStage}" type="button">${effectiveNextLabel}</button>`
        : `<button class="primary" data-next-evidence-check type="button">继续看材料</button>`)
      : ""
  });
  bindEvidenceCheckButtons(brief, check);
  bind("[data-next-evidence-check]", () => setIndex(brief, "evidenceCheck", index + 1));
  bindSceneButtons();
}

function renderInvestigationBackflow(brief) {
  const model = investigationBackflowModel({
    entries: unlockedInvestigationEntriesForState(state, brief),
    selectedPick: (index) => selectedInvestigationPickForState(state, brief, index)
  });
  const { hook, pick, index, nextLabel } = model;
  if (model.missing) {
    state.scene = "caseSolved";
    saveState();
    return render();
  }
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
        reviewHtml: choiceReviewHtml(latestChoiceReviewRowsForState(state, brief))
      })}
      ${pick ? hostDisclosureForAnchor(brief, "afterBackflow") : ""}
    `,
    choices: pick
      ? flowGroupHtml(`<button class="primary" data-after-investigation type="button">${nextLabel}</button>`)
      : ""
  });
  bindInvestigationButtons(brief, hook, index);
  bind("[data-after-investigation]", () => moveScene("caseSolved"));
  bindSceneButtons();
}

function renderDelegation(brief) {
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
      : flowGroupHtml(`<button data-skip-delegation type="button">先不送</button>`)
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

function renderCallerQuestion(brief) {
  const question = overnightCallerQuestionFor(brief);
  const overnight = ensureOvernight(brief);
  if (!question || actionDone(brief, "overnight:callerQuestion") && !overnight.callerQuestionChoiceId) {
    state.scene = nextSceneAfterEvidence({ issueBadge: issueCompletion(brief).badge, hasDeepFollowup: hasDeepFollowup(brief) });
    saveState();
    return render();
  }
  const picked = (question.options ?? []).find((option) => option.id === overnight.callerQuestionChoiceId) ?? null;
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
        { role: "caller", text: picked.callerLine ?? "" }
      ]) : ""}
    `,
    choices: picked
      ? flowGroupHtml(`<button class="primary" data-after-caller-question type="button">再深入一句</button>`)
      : choiceGroupHtml("主播回应", (question.options ?? []).map((option) => {
          const locked = option.requiresEarnedItem && !earned.has(option.requiresEarnedItem);
          return `<button data-caller-question="${escapeHtml(option.id ?? "")}" ${locked ? "disabled" : ""} type="button">${escapeHtml(option.label ?? "")}</button>`;
        }).join(""), "single-choice-group", "不判对错，只留下余味")
  });
  bind("[data-caller-question]", (event) => recordCallerQuestionChoice(brief, event.currentTarget?.getAttribute("data-caller-question") ?? ""));
  bind("[data-after-caller-question]", () => {
    state.scene = nextSceneAfterEvidence({ issueBadge: issueCompletion(brief).badge, hasDeepFollowup: hasDeepFollowup(brief) });
    saveState();
    render();
  });
  bindSceneButtons();
}

function renderDeepFollowup(brief) {
  const issue = issueCompletion(brief);
  if (!issue.badge || !hasDeepFollowup(brief)) {
    state.scene = "accusation";
    saveState();
    return renderAccusation(brief);
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
        { role: "caller", text: followup.answer }
      ])}
      <p class="hint">${escapeHtml(followup.note)}</p>
    `,
    choices: flowGroupHtml(`<button class="primary" data-scene="accusation" type="button">选一句往下追</button>`)
  });
  bindSceneButtons();
}

function renderPatienceLost(brief) {
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
  bind("[data-retry-lost-step]", () => retryPatienceLostStep(brief));
  bindSceneButtons();
}

function renderAccusation(brief) {
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
  const choices = dailyAccusationChoices(brief);
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
    choices: choiceGroupHtml("往下追", choices.map((choice) => `<button data-accuse="${escapeHtml(choice.accuse)}" data-accuse-label="${escapeHtml(choice.label)}" data-accuse-response="${escapeHtml(choice.response ?? "")}" type="button">${escapeHtml(choice.label)}</button>`).join(""), "single-choice-group", "从刚才听到的话里选一句")
  });
  document.querySelectorAll("[data-accuse]").forEach((button) => {
    button.addEventListener("click", () => resolveAccusationFromButton(brief, button));
  });
  bindSceneButtons();
}

function renderSolved(brief) {
  const result = normalizedDailyResult(brief);
  const step = Number(state.recapStep ?? 0);
  const issue = issueCompletion(brief);
  const rank = recapRankLabel(issue);
  const conclusion = dailyConclusion(brief, result, issue);
  const route = routeAxisProfileForState(state, brief, result);
  const pressure = storyPressureRows([brief], {
    budgetFor: ensureBudget,
    choicesFor: (item) => routeChoicesForState(state, item),
    foundCountFor: (item) => contradictionsForState(state, item).length
  })[0]?.profile ?? {};
  const quoteComparison = finalQuoteComparison(brief, result);
  const boundary = truthBoundaryReview(brief);
  const boundaryPicks = truthBoundaryPicksForState(state, brief);
  const boundaryMisses = truthBoundaryMissesForState(state, brief);
  const boundaryLine = truthBoundaryAftertaste(boundary, boundaryPicks, boundaryMisses);
  const finalScene = isFinalStoryPackCase();
  const pages = withStageJudgementDisclosure(solvedRecapPagesHtml({
    rank,
    issue,
    result,
    route,
    routeTrail: routeTrailHtml({
      choices: routeChoicesForState(state, brief),
      keyQuestionCount: keyQuestionLimit(brief),
      investigationIndexBase: investigationRouteIndexBase(brief)
    }),
    pressure,
    quoteComparison,
    conclusion,
    stanceSnapshot: stanceSnapshotRecapForBrief(brief),
    offMicLetters: offMicLettersForBrief(brief, CONTENT_ADVISORS),
    boundary,
    boundaryPicks,
    boundaryLine,
    issueLineText: issueLine(issue, result)
  }), brief);
  const recap = solvedRecapFlowView({
    pages,
    step,
    boundary,
    boundaryPicks,
    afterLabel: isStoryPackMode() ? finalScene ? "查看整晚收麦" : "完成结案" : "查看今日结果"
  });
  frame({
    brief,
    mood: "listening",
    label: "连线回看",
    chapter: liveChapterTitle(brief),
    text: recap.text,
    choices: recap.choices
  });
  document.querySelectorAll("[data-truth-boundary-pick]").forEach((button) => {
    button.addEventListener("click", () => {
      const promptId = button.getAttribute("data-truth-boundary-prompt");
      const answer = button.getAttribute("data-truth-boundary-pick");
      if (!promptId || !answer) return;
      const key = caseKey(brief);
      if (state.truthBoundaryPicks?.[key]?.[promptId]) return;
      const prompt = (boundary.prompts ?? []).find((item) => item.id === promptId);
      const miss = prompt && answer !== prompt.expected;
      state.truthBoundaryPicks = {
        ...(state.truthBoundaryPicks ?? {}),
        [key]: {
          ...(state.truthBoundaryPicks?.[key] ?? {}),
          [promptId]: answer
        }
      };
      if (miss) {
        state.truthBoundaryMisses = {
          ...(state.truthBoundaryMisses ?? {}),
          [key]: {
            ...(state.truthBoundaryMisses?.[key] ?? {}),
            [promptId]: Number(state.truthBoundaryMisses?.[key]?.[promptId] ?? 0) + 1
          }
        };
      }
      saveState();
      render();
    });
  });
  bind("[data-recap-next]", () => {
    state.recapStep = recap.index + 1;
    saveState();
    render();
  });
  bind("[data-retry-case]", () => resetCaseAttempt(brief));
  bind("[data-after-recap]", () => {
    if (isStoryPackMode() && !isFinalStoryPackCase()) {
      state.scene = "caseClosure";
      saveState();
      return render();
    }
    if (isStoryPackMode() && nightShellForBrief(brief)?.epilogue) {
      state.scene = "nightShellEpilogue";
      saveState();
      return render();
    }
    moveScene("runComplete");
  });
  bindSceneButtons();
}

function renderCaseClosure(brief) {
  const boundary = truthBoundaryReview(brief);
  frame({
    brief,
    mood: "focused",
    label: "案件结案",
    chapter: `第 ${String(Number(state.chapter ?? 1)).padStart(2, "0")} 案 · 收束`,
    showCaseHud: false,
    visualHud: "",
    text: caseClosingHtml({
      caseNumber: Number(state.chapter ?? 1),
      closing: brief.caseClosing,
      boundary
    }),
    choices: flowGroupHtml(caseClosingChoicesHtml())
  });
  bind("[data-enter-story-interlude]", () => {
    state.scene = "storyInterlude";
    saveState();
    render();
  });
  bind("[data-return-recap]", () => {
    state.scene = "caseSolved";
    state.recapStep = 0;
    saveState();
    render();
  });
  bindSceneButtons();
}

function renderCaseTitle(brief) {
  frame({
    brief,
    mood: "focused",
    label: "新案接入",
    chapter: "热线连线",
    showCaseHud: false,
    visualHud: "",
    screenClass: "case-title-screen",
    text: caseTitleHtml({ caseNumber: Number(state.chapter ?? 1), brief }),
    choices: flowGroupHtml(caseTitleChoicesHtml(Number(state.chapter ?? 1)))
  });
  bind("[data-enter-case-live]", () => {
    state.scene = "caseOpen";
    saveState();
    render();
  });
  bindSceneButtons();
}

function offMicLettersForBrief(brief = {}, advisors = {}) {
  const advisorRows = (brief.advisorNotes ?? []).map((note) => {
    const advisor = advisors[note.advisorId] ?? {};
    const title = [advisor.name, advisor.domain].filter(Boolean).join(" · ");
    return {
      kind: "advisor",
      badge: title || "顾问留言",
      appearsNowBecause: note.appearsNowBecause ?? "",
      text: note.text ?? ""
    };
  });
  const respondentNotes = Array.isArray(brief.respondentNote)
    ? brief.respondentNote
    : brief.respondentNote
      ? [brief.respondentNote]
      : [];
  const respondent = respondentNotes.map((note) => ({
    kind: "respondent",
    badge: note.badge ?? "对方留言",
    appearsNowBecause: note.appearsNowBecause ?? "",
    text: note.text ?? ""
  }));
  const lurker = brief.lurkerNote?.presenceLine && brief.lurkerNote?.deletedFragment
    ? [{
      kind: "lurker",
      badge: "后台提示",
      appearsNowBecause: brief.lurkerNote.presenceLine,
      text: `已删除弹幕残影：「${brief.lurkerNote.deletedFragment}」`
    }]
    : [];
  return [...advisorRows, ...respondent, ...lurker].filter((letter) => letter.text);
}

function stanceSnapshotRecapForBrief(brief = {}) {
  const pick = stanceSnapshotPickForState(brief);
  if (!pick) return null;
  const configured = (brief.stanceSnapshot?.options ?? []).find((option) => option.id === pick.id) ?? null;
  return {
    kicker: brief.stanceSnapshot?.recapKicker ?? "中段立场",
    label: pick.label,
    recap: configured?.recap ?? pick.recap ?? brief.stanceSnapshot?.recap ?? "这次判断不判分，只用来回看你的路线。"
  };
}

function hostDisclosureForAnchor(brief = {}, anchor = "") {
  const disclosure = brief.hostDisclosure;
  if (!disclosure || disclosure.anchor !== anchor || !disclosure.text) return "";
  return callDialogueHtml([{ role: "host", text: disclosure.text }], "host-disclosure");
}

function respondentTeaseHtml(brief = {}, sceneIndex = 0) {
  if (!brief.respondentNote?.teaseDuringSegment2) return "";
  const indexes = nightStructureFor(brief)?.segment2SceneIndexes ?? [];
  if (indexes[0] !== sceneIndex) return "";
  return `<p class="reaction">后台有一条未读，来自对方——收麦后可看。</p>`;
}

function withStageJudgementDisclosure(pages = [], brief = {}) {
  const disclosureHtml = hostDisclosureForAnchor(brief, "atStageJudgement");
  const overnightAftertasteHtml = overnightCallerQuestionAftertasteHtml(brief);
  if (!disclosureHtml && !overnightAftertasteHtml) return pages;
  return pages.map((page, index) => index === 2 ? `${disclosureHtml}${overnightAftertasteHtml}${page}` : page);
}

function overnightCallerQuestionAftertasteHtml(brief = {}) {
  const overnight = state.caseOvernights?.[caseKey(brief)] ?? null;
  const question = overnightCallerQuestionFor(brief);
  const choice = (question?.options ?? []).find((option) => option.id === overnight?.callerQuestionChoiceId);
  if (!choice?.recapAftertaste) return "";
  return callDialogueHtml([{ role: "host", text: choice.recapAftertaste }], "host-disclosure");
}

function renderStoryInterlude(brief) {
  const nextBrief = state.caseBriefs?.[Number(state.chapter ?? 1)] ?? null;
  frame({
    brief,
    mood: "focused",
    label: "案间过渡",
    chapter: "案间",
    text: storyInterludeHtml({
      nextObjectLabel: storyInterludeObjectLabel(nextBrief),
      nextLine: storyInterludeNextLine(nextBrief),
      shellLine: nightShellInterludeLine(brief)
    }),
    choices: flowGroupHtml(storyInterludeChoicesHtml())
  });
  bind("[data-enter-next-case]", () => advanceToNextStoryPackCase());
  bind("[data-retry-case]", () => resetCaseAttempt(brief));
  bindSceneButtons();
}

function renderRunComplete(brief) {
  if (isStoryPackMode()) return renderStoryPackComplete();
  const result = normalizedDailyResult(brief);
  const route = routeProfileForBrief(brief, result);
  const issue = issueCompletion(brief);
  const rank = recapRankLabel(issue);
  const pickedQuote = result.dailyAccuseLabel ?? "还没选最后那句";
  const quoteComparison = finalQuoteComparison(brief, result);
  const caught = issue.revealed[0] ?? route.shareBody;
  const quoteComparisonHtml = quoteComparison ? finalQuoteComparisonHtml(quoteComparison) : "";
  frame({
    brief,
    mood: "focused",
    label: "今日收麦",
    chapter: "今日收麦",
    text: dailyCompleteHtml({
      issueLineText: issueResultLine(issue, result),
      route,
      issue,
      rank,
      result,
      pickedQuote,
      quoteComparisonHtml,
      caught
    }),
    choices: dailyCompleteChoicesHtml()
  });
  bind("[data-copy-result]", async () => {
    const text = dailyCompleteShareText({ route, pickedQuote });
    try {
      await navigator.clipboard?.writeText(text);
      state.lastReaction = "吃瓜文案已复制。";
    } catch {
      state.lastReaction = "浏览器没放开复制权限，可以直接用这张结果卡分享。";
    }
    render();
  });
  bind('[data-action="title"]', resetToTitle);
  postDailySharePayload(brief, route, result);
}

function renderStoryPackComplete() {
  const briefs = state.caseBriefs ?? [];
  const results = briefs.map((brief) => normalizedDailyResult(brief));
  const solved = results.filter((result) => result.accused).length;
  const routeProfiles = briefs.map((brief, index) => routeAxisProfileForState(state, brief, results[index] ?? {}));
  const summary = storyPackSummaryModel({
    briefs,
    results,
    routeProfiles,
    boundaryRows: storyBoundaryRows(briefs, {
      picksFor: (brief) => truthBoundaryPicksForState(state, brief),
      missesFor: (brief) => truthBoundaryMissesForState(state, brief)
    }),
    pressureRows: storyPressureRows(briefs, {
      budgetFor: ensureBudget,
      choicesFor: (brief) => routeChoicesForState(state, brief),
      foundCountFor: (item) => contradictionsForState(state, item).length
    }),
    materialRows: storyMaterialRows(briefs, {
      evidencePicksFor: (brief) => selectedEvidencePicksForState(state, brief),
      investigationPicksFor: (brief) => selectedInvestigationPicksForState(state, brief)
    })
  });
  frame({
    brief: briefs[Math.max(0, Number(state.chapter ?? 1) - 1)] ?? briefs[0],
    mood: "focused",
    label: "试玩收麦",
    chapter: "试玩收麦",
    showCaseHud: false,
    text: storyPackCompleteHtml({
      briefs,
      results,
      routeProfiles,
      ...summary
    }),
    choices: flowGroupHtml(`
      <button class="primary" data-copy-weekly-result type="button">复制收麦文案</button>
      <button data-action="title" type="button">回标题</button>
    `)
  });
  bind("[data-copy-weekly-result]", async () => {
    const text = storyPackShareText({
      theme: summary.theme,
      displayBest: summary.displayBest,
      pressureProfile: summary.pressureProfile,
      materialProfile: summary.materialProfile,
      quoteProfile: summary.quoteProfile,
      hiddenThreadProfile: summary.hiddenThreadProfile,
      playerType: summary.playerType
    });
    try {
      await navigator.clipboard?.writeText(text);
      state.lastReaction = "收麦文案已复制。";
    } catch {
      state.lastReaction = "浏览器没放开复制权限，可以直接用这张结果卡分享。";
    }
    render();
  });
  bind('[data-action="title"]', resetToTitle);
}

function frame({ brief, label, chapter, text, choices, mood, showCaseHud = true, visualHud: visualHudOverride, screenClass = "" }) {
  const modeLabel = isStoryPackMode() ? "试玩连线" : "今日来电";
  const backdropClass = caseBackdropClass(brief);
  const pressure = showCaseHud ? currentLivePressure(brief, mood) : {};
  const visualHud = visualHudOverride ?? (showCaseHud
    ? `${caseProgressStrip(brief)}${audiencePatienceHud(pressure)}${liveCommentStrip(pressure)}${portraitLayer(brief, mood)}`
    : storyPackSummaryHud());
  const total = Math.max(1, keyQuestionLimit(brief));
  const firstMaterial = evidenceChecksFor(brief)[0] ?? {};
  const currentMaterial = brief.storyClueObject ?? brief.clueObject ?? firstMaterial.title ?? "通话摘录";
  app.innerHTML = liveFrameHtml({
    productName: PRODUCT_NAME,
    modeLabel,
    soundEnabled: isSoundEnabled(),
    backdropClass,
    label,
    chapter,
    text,
    reactionHtml: reactionLine(),
    choices,
    visualHud,
    material: currentMaterial,
    screenEffect: state.lastScreenEffect ?? "",
    screenClass: `${screenClass} ${showCaseHud ? liveSceneClass(brief, mood) : ""}`.trim(),
    controlDeckHtml: showCaseHud
      ? liveControlDeckHtml({
          onAirLabel: isStoryPackMode() ? "匿名热线" : brief.label ?? "来电中",
          label,
          segment: answeredSceneCountForState(state, brief) + 1,
          total,
          pressure,
          material: currentMaterial
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
  bind('[data-action="title"]', resetToTitle);
  bind('[data-action="reset"]', resetToTitle);
  bind('[data-action="sound"]', () => {
    toggleSound();
    render();
  });
  mountCurrentDialogue();
  queueDefaultFocus();
}

function dayFrame({ brief, label, chapter, text, choices, backdropClass = "day-city" }) {
  app.innerHTML = liveFrameHtml({
    productName: PRODUCT_NAME,
    modeLabel: "白天调查",
    soundEnabled: isSoundEnabled(),
    backdropClass,
    label,
    chapter,
    text,
    reactionHtml: "",
    choices,
    visualHud: "",
    material: label,
    screenEffect: "",
    controlDeckHtml: ""
  });
  bind('[data-action="title"]', resetToTitle);
  bind('[data-action="reset"]', resetToTitle);
  bind('[data-action="sound"]', () => {
    toggleSound();
    render();
  });
  mountCurrentDialogue();
  queueDefaultFocus();
}

function mountCurrentDialogue() {
  const card = app?.querySelector(".dialogue-card");
  if (card) card.insertAdjacentHTML("beforeend", avgSystemBarHtml(state.settings));
  let controller = null;
  controller = mountDialoguePresentation(app, {
    speed: state.settings?.textSpeed ?? "normal",
    onShown: (page) => {
      state.dialogueBacklog = [...(state.dialogueBacklog ?? []), page].slice(-500);
      saveState();
      if (state.settings?.autoMode) setTimeout(() => controller?.advance(), Math.max(1, Number(state.settings.autoDelay ?? 2)) * 500);
    }
  });
  bind("[data-material-card]", (event) => event.currentTarget.classList.toggle("expanded"));
  mountCourtRecord(app, { state, onSettingsChange: cycleAvgSetting });
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
  const normalized = (lines ?? []).filter((line) => line?.text);
  const totalLength = normalized.reduce((sum, line) => sum + String(line.text ?? "").length, 0);
  return normalized.slice(0, totalLength > 170 ? 2 : 4);
}

function bind(selector, handler) {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener("click", handler);
  });
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
  focusButton(preferredDefaultButton());
}

function preferredDefaultButton() {
  return app?.querySelector(
    ".choices button.primary:not(:disabled), .choices button[data-primary='true']:not(:disabled), .choices button:not(:disabled), .title-actions button:not(:disabled), .topbar button:not(:disabled)"
  ) ?? null;
}

function preferredBackButton() {
  return app?.querySelector('[data-action="title"]:not(:disabled), [data-retry-case]:not(:disabled)') ?? null;
}

function preferredReviewButton() {
  return app?.querySelector('[data-recap-next]:not(:disabled), [data-after-recap]:not(:disabled)') ?? null;
}

function toggleReviewPanel() {
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
  return Array.from(app?.querySelectorAll("button:not(:disabled)") ?? []).filter(isVisibleElement);
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
  handleGamepadButton(gamepad, 1, () => activateButton(preferredBackButton()));
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

function bindSceneButtons() {
  document.querySelectorAll("[data-scene]").forEach((button) => {
    button.addEventListener("click", () => moveScene(button.dataset.scene));
  });
}

function handleSceneQuestionButton(button) {
  const [sceneIndex, optionIndex] = button.dataset.sceneQuestion.split(":").map(Number);
  const { brief, scene, options } = sceneChoiceContext(sceneIndex);
  const option = options[optionIndex] ?? options[0];
  if (!brief || !option) return;
  const answerVariant = pressuredAnswerVariant(option, { pressureSignal: state.lastPressureSignal ?? "" });
  const answer = answerVariant.answer;
  markAction(brief, `sceneQuestion:${sceneIndex}:${optionIndex}`, { spend: !option.contradiction });
  markAction(brief, `version:${sceneIndex}`);
  if (option.contradiction) {
    recordContradiction(brief, option.contradiction);
    recordContradiction(brief, scene.contradiction);
  }
  else {
    state.lastReaction = questionPressureReaction({ ...option, answer }, option.routeTone ?? routeToneForChoice(option));
    state.lastPressureSignal = questionPressureSignal(option, option.routeTone ?? routeToneForChoice(option));
  }
  state.lastPressureAxis = option.routeAxis ?? routeAxisForChoice(option, scene);
  state.sceneAnswers = {
    ...(state.sceneAnswers ?? {}),
    [answerKey(brief, sceneIndex)]: answer
  };
  state.sceneQuestionPicks = {
    ...(state.sceneQuestionPicks ?? {}),
    [answerKey(brief, sceneIndex)]: {
      question: option.question ?? "",
      answer,
      contradiction: option.contradiction ?? "",
      routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
      routeTone: option.routeTone ?? routeToneForChoice(option),
      correct: Boolean(option.contradiction),
      guarded: answerVariant.guarded
    }
  };
  recordRouteChoice(brief, sceneIndex, option, scene);
  if (audiencePatienceLost(brief, {
    area: "sceneReview",
    index: sceneIndex,
    actionKeys: [`sceneQuestion:${sceneIndex}:${optionIndex}`, `version:${sceneIndex}`],
    answerKey: answerKey(brief, sceneIndex),
    routeIndex: sceneIndex,
    spent: !option.contradiction,
    removeQuestionPick: true
  })) return;
  state.sceneQuestionFocus = { caseId: caseKey(brief), sceneIndex, kind: "key", optionIndex };
  state.scene = "sceneQuestionAnswer";
  saveState();
  render();
}

function handleSceneDialogueButton(button) {
  const [sceneIndex, optionIndex] = button.dataset.sceneDialogue.split(":").map(Number);
  const { brief, scene, options } = sceneChoiceContext(sceneIndex);
  const dialogueRows = sceneDialogueOptions(scene, options);
  const option = dialogueRows[optionIndex]?.option ?? null;
  if (!brief || !option) return;
  const key = answerKey(brief, sceneIndex);
  const current = state.sceneDialoguePicks?.[key] ?? [];
  if (current.some((pick) => Number(pick.optionIndex) === Number(optionIndex))) return;
  const answerVariant = pressuredAnswerVariant(option, { pressureSignal: state.lastPressureSignal ?? "" });
  state.sceneDialoguePicks = {
    ...(state.sceneDialoguePicks ?? {}),
    [key]: [
      ...current,
      {
        optionIndex,
        question: option.question ?? "",
        answer: answerVariant.answer,
        routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
        routeTone: option.routeTone ?? routeToneForChoice(option),
        guarded: answerVariant.guarded
      }
    ]
  };
  state.lastReaction = questionPressureReaction({ ...option, answer: answerVariant.answer }, option.routeTone ?? routeToneForChoice(option));
  state.lastPressureSignal = questionPressureSignal(option, option.routeTone ?? routeToneForChoice(option));
  state.lastPressureAxis = option.routeAxis ?? routeAxisForChoice(option, scene);
  state.sceneQuestionFocus = { caseId: caseKey(brief), sceneIndex, kind: "dialogue", optionIndex };
  state.scene = "sceneQuestionAnswer";
  saveState();
  render();
}

function openSceneQuestionMenu(brief, sceneIndex) {
  state.sceneQuestionFocus = null;
  state.scene = "sceneQuestionMenu";
  setIndexValue(brief, "sceneReview", sceneIndex);
  saveState();
  render();
}

function closeSceneQuestionMenu(brief) {
  state.sceneQuestionFocus = null;
  state.scene = "sceneReview";
  saveState();
  render();
}

function sceneQuestionFocusFor(brief, sceneIndex) {
  const focus = state.sceneQuestionFocus;
  if (!focus || focus.caseId !== caseKey(brief) || Number(focus.sceneIndex) !== Number(sceneIndex)) return null;
  return focus;
}

function sceneChoiceContext(sceneIndex) {
  const brief = activeCaseBrief();
  const scene = brief?.sceneVersions?.[sceneIndex] ?? {};
  return {
    brief,
    scene,
    options: focusedQuestionOptions(scene.questionOptions ?? [])
  };
}

function bindEvidenceCheckButtons(brief, check = {}, context = {}) {
  document.querySelectorAll("[data-evidence-check]").forEach((button) => {
    button.addEventListener("click", () => {
      const [checkIndex, optionIndex] = button.dataset.evidenceCheck.split(":").map(Number);
      const outcome = materialOperationOutcome(check, checkIndex, optionIndex);
      markAction(brief, `evidenceCheck:${checkIndex}:${optionIndex}`, { spend: outcome.spend });
      markAction(brief, `evidenceCheck:${checkIndex}`);
      if (outcome.contradiction) {
        recordContradiction(brief, outcome.contradiction);
      }
      state.evidenceCheckPicks = {
        ...(state.evidenceCheckPicks ?? {}),
        [evidenceAnswerKey(brief, checkIndex)]: evidencePickWithRevision(brief, outcome.pick)
      };
      recordRouteChoice(brief, keyQuestionLimit(brief) + checkIndex, outcome.routeChoice, { version: check.material ?? "" });
      state.lastReaction = materialPressureReaction(outcome, check);
      state.lastPressureSignal = materialPressureSignal(outcome);
      state.lastPityLine = materialPityLineFor(brief, check, checkIndex, outcome);
      if (outcome.correct) state.lastScreenEffect = "material-hit";
      state.lastPressureAxis = outcome.routeChoice?.routeAxis ?? outcome.routeChoice?.axis ?? null;
      if (context.interludeAction) {
        completeInterludeAction(brief, context.interludeAction, { renderNow: false });
        saveState();
        return render();
      }
      if (outcome.spend && Number(ensureBudget(brief).remaining ?? 0) <= 0) return recordPatienceLost(brief, {
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

function recordStanceSnapshot(brief, snapshot = {}, optionIndex = 0) {
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
  state.lastReaction = null;
  saveState();
  render();
}

function continueAfterSceneReview(brief, sceneIndex = 0) {
  state.sceneQuestionFocus = null;
  if (shouldEnterOvernightHangupAfterScene(brief, sceneIndex)) {
    state.scene = "overnightHangup";
    saveState();
    render();
    return;
  }
  if (shouldEnterHangupAfterScene(brief, sceneIndex)) {
    state.scene = "hangupBeat";
    saveState();
    render();
    return;
  }
  setIndex(brief, "sceneReview", sceneIndex + 1);
}

function stanceSnapshotPickForState(brief = {}) {
  return state.stanceSnapshots?.[caseKey(brief)] ?? null;
}

function continueAfterSceneEvidence(brief, sceneIndex = 0) {
  markAction(brief, `afterScene:${sceneIndex}`);
  if (shouldEnterOvernightHangupAfterScene(brief, sceneIndex)) {
    state.scene = "overnightHangup";
    saveState();
    return render();
  }
  if (shouldEnterHangupAfterScene(brief, sceneIndex)) {
    state.scene = "hangupBeat";
    saveState();
    return render();
  }
  const nextSceneIndex = Number(sceneIndex ?? 0) + 1;
  if (nextSceneIndex < (brief.sceneVersions?.length ?? 0)) {
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

function bindInvestigationButtons(brief, hook = {}, hookIndex = 0, context = {}) {
  document.querySelectorAll("[data-evidence-check]").forEach((button) => {
    button.addEventListener("click", () => {
      const optionIndex = Number(button.dataset.evidenceCheck.split(":")[1] ?? 0);
      const outcome = materialOperationOutcome(hook, hookIndex, optionIndex);
      const spend = hook.spendOnMiss === true && outcome.spend;
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
      state.lastPressureSignal = materialPressureSignal(outcome);
      if (outcome.correct) state.lastScreenEffect = "material-hit";
      state.lastPressureAxis = outcome.routeChoice?.routeAxis ?? outcome.routeChoice?.axis ?? null;
      if (context.interludeAction) {
        completeInterludeAction(brief, context.interludeAction, { renderNow: false });
        saveState();
        return render();
      }
      if (spend && Number(ensureBudget(brief).remaining ?? 0) <= 0) return recordPatienceLost(brief, {
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
  state.lastReaction = "回单到了，先看这句。";
  saveState();
  render();
}

function skipDelegation(brief) {
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

function recordCallerQuestionChoice(brief, choiceId = "") {
  const question = overnightCallerQuestionFor(brief);
  const choice = (question?.options ?? []).find((option) => option.id === choiceId);
  const overnight = ensureOvernight(brief);
  if (!choice) return;
  if (choice.requiresEarnedItem && !(overnight.earnedItems ?? []).includes(choice.requiresEarnedItem)) return;
  updateOvernight(brief, { callerQuestionChoiceId: choice.id });
  markAction(brief, "overnight:callerQuestion");
  recordRouteChoice(brief, keyQuestionLimit(brief) + evidenceChecksFor(brief).length + 0.8, {
    question: question.prompt ?? "她的那一问",
    answer: choice.label ?? "",
    routeAxis: choice.routeAxis ?? "process-control",
    routeTone: "caller-question"
  }, { version: question.prompt ?? "" });
  state.lastReaction = choice.aftertaste ?? "";
  saveState();
  render();
}

function delegationRouteIndexFor(brief = {}) {
  return keyQuestionLimit(brief) + evidenceChecksFor(brief).length - 0.5;
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
  const art = casePortraitArt(brief, npc);
  const sceneIndex = currentIndex(brief, "sceneReview", brief.sceneVersions?.length || 1);
  return portraitLayerHtml({
    artSrc: art.src,
    fallbackSrc: art.fallbackSrc,
    mood,
    expression: callerExpressionFor(brief, mood),
    sceneIndex
  });
}

function casePortraitArt(brief, npc) {
  const neutralArt = CHARACTER_ART[npc.id];
  const fallback = neutralArt ?? CHARACTER_ART.meng;
  return { src: brief.callerArt ?? fallback, fallbackSrc: fallback };
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
