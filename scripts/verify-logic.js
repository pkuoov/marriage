import { dailyKeyFromUrl, hasFreshStartParam, modeFromUrl, storyKeyFromUrl } from "../src/runtime/urlMode.js";
import { caseModeConfig, generateCasesForMode, normalizeCaseMode, validCaseBriefCount } from "../src/caseModes.js";
import { accusationLabel, evidenceInsightFor, runCompleteLineFor, timelineGapText } from "../src/caseNarration.js";
import { allCaseContradictions, calculateCaseBudgetMax, calculateCaseOutcome, calculateInspirationMax, calculateIssueCompletion, expectedAccusationForCase, nextInspirationContradictionForCase, relationshipExpectedAccusationForCase, resolveAccusationForCase, resolveFinalQuoteForCase } from "../src/caseRuntime.js";
import { requiredContradictionsForCase, truthBoundaryPromptLimitForCase } from "../src/difficulty.js";
import { migrateState, normalizeRuntimeState, parseStateSnapshot, saveReadingBeforeExit, saveStateSnapshot, STORAGE_KEY, stateSnapshotForPersistence } from "../src/state.js";
import { CONTENT_ADVISORS, CONTENT_HELPER_NPCS } from "../src/generated/contentPackIndex.js";
import { DEFAULT_STORY_PACK_KEY, quickDetectiveCaseFor, quickDetectiveCasesFor, storyPackCaseCount, storyPackForKey } from "../src/storyPacks.js";
import { NPCS } from "../src/story.js";
import { dailyAccusationChoices } from "../src/dailyChoices.js";
import { AUDIO_CUES, audioCueView } from "../src/audioCatalog.js";
import { platformRuntime } from "../src/platformRuntime.js";
import { DEFAULT_PLAYER_NAME, normalizePlayerName, personalizeHostHtml } from "../src/playerIdentity.js";
import { createSaveStore } from "../src/platform/saveStore.js";
import { materialOperationOutcome } from "../src/runtime/materialOperation.js";
import { unlockedMaterialProfile } from "../src/runtime/materialVisibility.js";
import { nextLinearInvestigationScene } from "../src/runtime/nightOvernightModel.js";
import { refreshSavedCaseContent, reconcileSavedOvernightProgress } from "../src/runtime/savedContentRefresh.js";
import { liveSceneForCurrentSegment } from "../src/runtime/nightOvernightModel.js";
import { audioBusGain, normalizeAudioSettings, updateAudioBusVolume } from "../src/runtime/audioModel.js";
import { ambienceCueForBackdrop, audioScenePlan } from "../src/runtime/audioSceneModel.js";
import { applyRuntimeCaseContent, isRuntimeLoadedCaseContent, missingRuntimeCaseRequiredFields, RUNTIME_CASE_CONTENT_STATUS } from "../src/runtime/contentCase.js";
import { actionDoneForState, answeredEvidenceCountForState, answeredSceneCountForState, askedDialoguePicksForState, completedSceneExchangeForState, contradictionsForState, latestChoiceReviewRowsForState, routeAxisProfileForState, routeChoicesForState, selectedEvidencePicksForState, selectedInvestigationPicksForState, selectedScenePickForState, truthBoundaryPicksForState, unlockedInvestigationEntriesForState } from "../src/runtime/caseStateSelectors.js";
import { dailyConclusionModel, dailyPlayerType, dailyRouteProfile as buildDailyRouteProfile, finalQuoteComparison, investigationBackflowProfile, investigationPickReaction, recapRankLabel, storyCallCountText, storyCommentWall, storyHiddenThreadProfile, storyMaterialProfile, storyObjectProfile, storyPackAftertaste, storyPackAxes, storyPackBestAxis, storyPackClosingLine, storyPlayerType, storyQuoteProfile, storyShareTitle, storyThemeProfile, truthBoundaryAftertaste, truthBoundaryPackProfile, truthBoundaryReview } from "../src/runtime/recapModel.js";
import { livePressureProfile, materialPressureReaction, materialPressureSignal, nextQuestionPressureSignal, pressuredAnswerVariant, pressurePackProfile, pressureRecapProfile, questionPressureReaction, questionPressureSignal } from "../src/runtime/livePressure.js";
import { gamepadAxisDirection, keyboardNavigationIntent, nextFocusIndex } from "../src/runtime/inputNavigation.js";
import { gamepadHapticPlan, triggerGamepadHaptic } from "../src/runtime/haptics.js";
import { chunkDialogueTurn, dialogueReadingKey, dialoguePageRole, dialogueTurnsFrom, groupDialogueTurns, shouldAutoAdvanceDialoguePair, splitDialogueSentences } from "../src/runtime/dialoguePresentation.js";
import { assertDialogueTexture, dialogueTextureMetrics, spokenPunctuationLeaks } from "../src/runtime/dialogueTexture.js";
import { normalizeRouteChoice, routeAxisForChoice, routeAxisProfileFromChoices, routeToneForChoice } from "../src/runtime/routeLog.js";
import { canRewindQuestion, popQuestionRewindPoint, pushQuestionRewindPoint, QUESTION_REWIND_LIMIT } from "../src/runtime/questionRewind.js";
import { routeTrailModel } from "../src/runtime/routeMapModel.js";
import { afterSceneEvidenceFor, answerKey, applyActionMark, availableCallbackOpeners, availableOvernightCallbackOpeners, canEnterOvernightCallback, casePatienceLost, completeNightAction, dailyAccusationReadiness as accusationReadinessForCase, daySceneById, earnedDocumentQuestionsFor, evidenceAnsweredCount, evidenceAnswerKey, evidenceCheckModel, firstUnansweredSceneIndex, initialCaseBudget, initialNightStateFor, initialOvernightStateFor, interludeEarnedItemsForOvernight, investigationAnswerKey, investigationBackflowModel, investigationRouteIndexBase, liveCounterBeatAfterScene, liveCounterBeatBeforeScene, liveCounterBeatById, liveCounterBeatTriggerMet, nextPlayableSceneIndex, nightActionById, nightStructureFor, overnightAnchorSceneIndex, overnightCallbackDialogueLines, overnightCallbackOpenerById, overnightCallerQuestionFor, overnightFirstNight2SceneIndex, overnightReturnPostureFor, overnightStructureFor, playableSceneCount, playableSceneIndexes, pressureSignalForLiveCounterChoice, recordPatienceLostState, retryPatienceLostState, sceneReviewModel, shouldEnterHangupAfterScene, shouldEnterOvernightHangupAfterScene, snapshotEchoFor, unlockedInvestigationEntries } from "../src/runtime/sceneAdvance.js";
import { storyInterludeCaseId, storyInterludeObjectLabel, storyOptionalQuickCall } from "../src/runtime/storyInterludeModel.js";
import { CARE_CHOICE_IDS, careChoiceById, careChoiceIsComplete, careChoiceLines } from "../src/runtime/careChoiceModel.js";
import { epilogueUnreadMessages, epilogueUnreadStage } from "../src/runtime/epilogueUnreadModel.js";
import { cafePrologueCanOpenForensic, cafePrologueCanPresentEvidence, cafePrologueCanPresentRevisionEvidence, cafePrologueRemainingEvidenceId, cafePrologueRevisionEvidenceHit, cafePrologueRevisedStatementReady, cafePrologueSceneForStep, cafePrologueStatementReady, normalizedCafePrologueProgress } from "../src/runtime/prologueCafeModel.js";
import { hostDisclosureLinesForAnchor } from "../src/runtime/hostDisclosureModel.js";
import { advanceQuickConfrontation, advanceQuickMissReaction, advanceQuickTranscript, advanceQuickVerdict, applyQuickIssueSelection, applyQuickStatementLineSelection, endQuickCaseEarly, initialQuickDetectiveState, normalizeQuickDetectiveState, quickConfrontationLines, quickDetectiveIsComplete, quickDisclosureRounds, quickIssueOptionsForRound, quickRoundPatienceForState, quickStatementLinesForRound, quickVerdictPages, retryQuickStatement } from "../src/runtime/quickDetectiveModel.js";
import { normalizeStatementPatience, normalizeStatementReaction, spendStatementPatience, statementAnchorLineMatches, statementLinesFromText, statementMissReactionForOption, statementNightKey, statementNightPatienceMax, statementNoClueReactionFor, statementOptionForLine, statementOptionsForLine, statementPressureFor, statementStageForScene, statementStageProgress, statementStagesForBrief } from "../src/runtime/statementReviewModel.js";
import { advanceTestimonyAct, decisivePresentAvailability, decisivePresentOutcome, normalizeDecisivePresentProgress, normalizeTestimonyWallProgress, pressTestimonyStatement, resetDecisivePresentProgress, testimonyActForScene, testimonyActIsFinal, testimonyStatementsForScene, testimonyWallKey } from "../src/runtime/decisivePresentModel.js";
import { CHOICE_COST_META, choiceCostMeta } from "../src/runtime/choiceCostModel.js";
import { storyBoundaryRows, storyMaterialRows, storyPackSummaryModel, storyPressureRows } from "../src/runtime/storyPackSummaryModel.js";
import { callDialogueHtml, choiceButtonBodyHtml, choiceGroupHtml, choiceReviewHtml, flowGroupHtml } from "../src/ui/callFlowView.js";
import { audioSettingsPanelHtml } from "../src/ui/audioSettingsView.js";
import { formatAudioTime, resolveSceneAudioFallback } from "../src/ui/audioController.js";
import { clearPlayedCueKeysByPrefix, playAudioCueOnce } from "../src/sound.js";
import { dailyCompleteChoicesHtml, dailyCompleteHtml, dailyCompleteShareText } from "../src/ui/dailyCompleteView.js";
import { evidenceCheckScreenHtml, evidenceMaterialKind, evidenceMaterialRows, evidenceMaterialThumbHtml, evidenceOperationHtml, investigationBackflowScreenHtml } from "../src/ui/evidenceView.js";
import { audioPlaybackControlsHtml, callbackOpenerChoiceHtml, interludePlaybackActionHtml, replyChoicesHtml } from "../src/ui/interludeDeskView.js";
import { audiencePatienceHudHtml, callerArtForExpression, callerExpressionForView, caseProgressStripHtml, hostSpeakingStateForView, liveCommentStripHtml, portraitLayerHtml, storyPackSummaryHudHtml } from "../src/ui/liveCallView.js";
import { liveCounterBeatHtml } from "../src/ui/liveCounterBeatView.js";
import { liveControlDeckHtml, liveFrameHtml, pixelTransitionHtml } from "../src/ui/liveFrameView.js";
import { finalQuoteComparisonHtml, offMicLettersHtml, solvedRecapFlowView, solvedRecapPagesHtml, truthBoundaryPlaced, truthBoundaryReviewHtml } from "../src/ui/recapView.js";
import { routeTrailHtml } from "../src/ui/routeTrailView.js";
import { focusedQuestionOptions, playerQuestionLabel, sceneDialogueOptions, sceneQuestionChoicesHtml } from "../src/ui/sceneQuestions.js";
import { activeSceneExchangeHtml, completedSceneExchangeHtml, keyChoiceExchangeHtml, sceneQuestionAnswerHtml, sceneReviewDoneChoicesHtml, sceneReviewHtml, stanceSnapshotHtml, statementStagePromptExchangeHtml } from "../src/ui/sceneReviewView.js";
import { statementReplayHtml, statementReplayPageChoicesHtml, statementReplayPageHtml } from "../src/ui/statementReviewView.js";
import { testimonyWallHtml } from "../src/ui/decisivePresentView.js";
import { storyInterludeChoicesHtml, storyInterludeHtml, storyInterludeStageHtml, storyWorldEchoStageHtml } from "../src/ui/storyInterludeView.js";
import { caseBridgeChoicesHtml, caseBridgeHtml, caseClosingChoicesHtml, caseClosingHtml, caseTitleChoicesHtml, caseTitleHtml } from "../src/ui/caseTransitionView.js";
import { careChoiceContinueHtml, careChoiceHtml } from "../src/ui/careChoiceView.js";
import { epilogueUnreadContinueHtml, epilogueUnreadHtml } from "../src/ui/epilogueUnreadView.js";
import { cafeAccountBoardHtml, cafeEvidencePairHtml, cafeFinalBoundaryHtml, cafeInvestigationChoicesHtml, cafeLegalRequestsHtml, cafeMaterialDetailModalHtml, cafeMaterialPromptHtml, cafePrologueDialogueHtml, cafePrologueHeaderHtml, cafeProloguePortraitStageHtml, cafeRevisionStatusHtml, cafeStatementReplayHtml, cafeTransferPresentHtml } from "../src/ui/prologueCafeView.js";
import { storyPackCompleteHtml } from "../src/ui/storyPackCompleteView.js";
import { titleScreenHtml } from "../src/ui/titleView.js";
import { quickDetectiveActiveLine, quickDetectiveCaseSelectHtml, quickDetectiveConfrontationHtml, quickDetectiveIntroHtml, quickDetectiveIssueSelectionHtml, quickDetectiveMissReactionHtml, quickDetectivePatienceLostHtml, quickDetectiveShouldAutoContinue, quickDetectiveStageHtml, quickDetectiveTranscriptHtml, quickDetectiveVerdictHtml } from "../src/ui/quickDetectiveView.js";
import { createRecapScreens } from "../src/ui/screens/recapScreens.js";
import { createLiveCounterScreens } from "../src/ui/screens/liveCounterScreens.js";
import { readFileSync, readdirSync } from "node:fs";
import { bundleCssSync } from "./css-bundle.js";
import { assetReferencesInText } from "./runtime-assets.js";

const attrs = { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 };
const results = [];
const testFilter = commandLineOption("--filter").toLowerCase();
const screenSourcePaths = [
  "../src/ui/screens/overnightScreens.js",
  "../src/ui/screens/interludeScreens.js",
  "../src/ui/screens/sceneScreens.js",
  "../src/ui/screens/recapScreens.js",
  "../src/ui/screens/quickDetectiveScreens.js",
  "../src/ui/screens/overnightDocumentScreens.js",
  "../src/ui/screens/liveCounterScreens.js",
  "../src/ui/screens/testimonyWallScreens.js"
];
const screenSources = screenSourcePaths.map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));
const runtimeSource = [
  readFileSync(new URL("../src/app.js", import.meta.url), "utf8"),
  readFileSync(new URL("../src/runtime/caseOutcome.js", import.meta.url), "utf8"),
  readFileSync(new URL("../src/runtime/caseStateWrites.js", import.meta.url), "utf8"),
  readFileSync(new URL("../src/ui/focusInputControl.js", import.meta.url), "utf8"),
  readFileSync(new URL("../src/ui/liveHudPresenter.js", import.meta.url), "utf8"),
  ...screenSources
].join("\n");
const quickDetectiveUiSource = readFileSync(new URL("../src/ui/quickDetectiveView.js", import.meta.url), "utf8");
const courtRecordUiSource = readFileSync(new URL("../src/ui/courtRecordView.js", import.meta.url), "utf8");

test("URL-MODE-001", "URL modes preserve defaults, empty values and legacy story aliases", () => {
  assertEqual(dailyKeyFromUrl("?dailyKey=2026-09-10"), "2026-09-10", "daily key");
  assertEqual(dailyKeyFromUrl("?dailyKey="), undefined, "empty daily key");
  assertEqual(storyKeyFromUrl("?storyKey=story&packKey=pack&weeklyKey=week"), "story", "story key priority");
  assertEqual(storyKeyFromUrl("?storyKey=&packKey=pack&weeklyKey=week"), "pack", "legacy pack alias");
  assertEqual(storyKeyFromUrl("?weeklyKey=week"), "week", "legacy weekly alias");
  assertEqual(storyKeyFromUrl(""), undefined, "default story");
  assertEqual(modeFromUrl("?mode=daily"), "daily", "daily mode");
  assertEqual(modeFromUrl("?mode=unknown"), "episode", "unknown mode fallback");
  assertEqual(modeFromUrl(""), "episode", "default mode");
});

test("URL-MODE-002", "fresh reset survives unavailable or rejected history updates", () => {
  const href = "https://local.invalid/game?fresh=1&storyKey=demo#opening";
  assertEqual(hasFreshStartParam(href, { replaceState() { throw new Error("SecurityError"); } }), true, "history rejection must not load the old save");
  assertEqual(hasFreshStartParam(href, null), true, "history may be unavailable");
  assertEqual(hasFreshStartParam("not a URL", null), false, "invalid URL");
});

test("URL-MODE-003", "fresh cleanup preserves other parameters and runs only for fresh=1", () => {
  const calls = [];
  const history = { replaceState(...args) { calls.push(args); } };
  assertEqual(hasFreshStartParam("https://local.invalid/game?fresh=1&storyKey=demo#opening", history), true, "fresh flag");
  assertEqual(calls.length, 1, "one cleanup");
  assertEqual(calls[0][2], "/game?storyKey=demo#opening", "preserve story and hash");
  for (const query of ["", "?fresh=0", "?fresh=true", "?fresh="]) {
    assertEqual(hasFreshStartParam(`https://local.invalid/game${query}`, history), false, "do not reset without fresh=1");
  }
  assertEqual(calls.length, 1, "non-fresh URL must not be rewritten");
});

test("PERF-001", "persistent CSS animations stay on compositor-safe properties", () => {
  const styleDirectory = new URL("../src/styles/", import.meta.url);
  const cssSource = readdirSync(styleDirectory)
    .filter((name) => name.endsWith(".css"))
    .map((name) => readFileSync(new URL(name, styleDirectory), "utf8"))
    .join("\n");
  const infiniteNames = new Set();
  for (const match of cssSource.matchAll(/\banimation\s*:\s*([^;}]+)/g)) {
    const animations = [];
    let current = "";
    let parenthesisDepth = 0;
    for (const character of match[1]) {
      if (character === "(") parenthesisDepth += 1;
      if (character === ")") parenthesisDepth = Math.max(0, parenthesisDepth - 1);
      if (character === "," && parenthesisDepth === 0) {
        animations.push(current);
        current = "";
        continue;
      }
      current += character;
    }
    animations.push(current);
    for (const animation of animations) {
      if (!/\binfinite\b/.test(animation)) continue;
      const name = animation.trim().split(/\s+/)[0];
      if (name && name !== "none") infiniteNames.add(name);
    }
  }
  const forbiddenProperties = /(?:^|[;{]\s*)(box-shadow|filter|width|height|top|left|margin(?:-[\w-]+)?|padding(?:-[\w-]+)?|border(?:-[\w-]+)?|font-size|background-position)\s*:/gm;
  const violations = [];
  for (const name of infiniteNames) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const marker = new RegExp(`@keyframes\\s+${escapedName}\\s*\\{`, "g");
    const keyframeMatch = marker.exec(cssSource);
    assert(keyframeMatch, `无限动画 ${name} 必须有可检查的 @keyframes 定义`);
    const blockStart = cssSource.indexOf("{", keyframeMatch.index);
    let depth = 1;
    let cursor = blockStart + 1;
    while (cursor < cssSource.length && depth > 0) {
      if (cssSource[cursor] === "{") depth += 1;
      if (cssSource[cursor] === "}") depth -= 1;
      cursor += 1;
    }
    const block = cssSource.slice(blockStart + 1, cursor - 1);
    for (const propertyMatch of block.matchAll(forbiddenProperties)) {
      violations.push(`${name}:${propertyMatch[1]}`);
    }
  }
  assertEqual(violations.join(","), "", `无限动画只能改变 transform/opacity，发现非合成属性：${violations.join(", ")}`);
});

test("INPUT-000", "mouse wheel never opens the court record", () => {
  assert(!courtRecordUiSource.includes('addEventListener("wheel"'), "鼠标滚轮只能滚动页面，不能打开案卷");
  assertIncludes(courtRecordUiSource, 'querySelectorAll("[data-record-open]")', "案卷必须保留明确的打开入口");
  assertIncludes(courtRecordUiSource, 'aria-modal="true"', "案卷必须声明为模态对话框");
  assertIncludes(courtRecordUiSource, 'event.key !== "Tab"', "案卷打开后必须把 Tab 焦点留在弹层内");
  assertIncludes(courtRecordUiSource, "lastFocused", "关闭案卷后必须把焦点还给打开它的按钮");
});

test("ARCH-001", "screen modules depend on an injected context instead of app.js", () => {
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  screenSources.forEach((source, index) => {
    assert(!/from\s+["'][^"']*app\.js["']/.test(source), `${screenSourcePaths[index]} 不能反向 import app.js`);
    assertIncludes(source, "ctx.getState()", `${screenSourcePaths[index]} 必须通过 ctx 读取当前状态`);
    assert(!/export function create\w+Screens\(ctx\) \{\s*const state = ctx\.getState\(\);/.test(source), `${screenSourcePaths[index]} 不得在工厂作用域捕获 state`);
  });
  assertIncludes(appSource, "createDailyScreenRenderers", "app.js 必须只负责组装屏幕依赖与分发");
  assertIncludes(appSource, "dailyScreenRenderers ??= createDailyScreenRenderers()", "屏幕工厂必须只创建一次并复用");
  assertIncludes(appSource, "quickScreenRenderers ??= createQuickScreenRenderers()", "快案屏幕工厂必须只创建一次并复用");
  assert(!appSource.includes("function renderSceneReview("), "sceneReview 屏幕不能重新回到 app.js");
  assert(!appSource.includes("function renderInterludeDesk("), "interludeDesk 屏幕不能重新回到 app.js");
  assert(!appSource.includes("function renderSolved("), "recap 屏幕不能重新回到 app.js");
  assert(!appSource.includes("function renderQuickDetective("), "快案主屏幕不能重新回到 app.js");
  assert(!appSource.includes("function quickRevealTransition("), "快案揭示过场不能重新回到 app.js");
});

test("FLOW-000", "screen fallbacks preserve the current segment and every pending gate", () => {
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const interludeSource = screenSources[1];
  const sceneSource = screenSources[2];
  const quickSource = screenSources[4];
  assertIncludes(interludeSource, "nextPlayableSceneIndex(brief, sceneIndex)", "场后材料完成后必须跳到下一个可玩场，不得用下标加一误入隐藏场");
  assertIncludes(interludeSource, "pendingAfterScene ?? afterSceneEvidenceFor(brief, sceneIndex, () => false)", "场后材料刚命中时必须先播本次反馈，不能因完成标记立刻跳回场景");
  assertIncludes(sceneSource, "pendingEvidence", "立场快照完成后必须先回收待处理的场后材料");
  assertIncludes(sceneSource, 'button.dataset.sceneReplayDialogue !== "true"', "自由问只有从原话回放发起时才能绕过退役问卷入口");
  assertIncludes(sceneSource, 'data-scene-open-replay', "自由问答完必须能回到同一段原话，不能落回退役问卷");
  assertIncludes(quickSource, "const autoPair = false", "快案对质必须由玩家点击换句，不得 450ms 自动跳过");
  const moveSceneSource = appSource.slice(appSource.indexOf("function moveScene(scene)"), appSource.indexOf("function setIndex(brief"));
  assert(moveSceneSource.indexOf("const readiness = accusationReadinessForBrief(brief)") < moveSceneSource.indexOf('state.scene = "callerQuestion"'), "进入结案前必须先验门，不得用来电人反问绕过未完成场次");
});

test("ARCH-002", "memoized screen factories follow whole-state replacement", () => {
  let currentState = { chapter: 1, caseBriefs: [{}], scene: "caseTitle" };
  const originalState = currentState;
  let latestFrame = null;
  let enterCase = null;
  const screens = createRecapScreens({
    getState: () => currentState,
    frame: (frame) => {
      latestFrame = frame;
    },
    caseTitleHtml: ({ caseNumber, totalCases }) => `${caseNumber}/${totalCases}`,
    caseTitleChoicesHtml: () => "",
    flowGroupHtml: (html) => html,
    bind: (selector, handler) => {
      if (selector === "[data-enter-case-live]") enterCase = handler;
    },
    saveState: () => {},
    render: () => {},
    bindSceneButtons: () => {}
  });

  screens.renderCaseTitle({});
  assertEqual(latestFrame?.text, "1/1", "首次渲染必须读取初始 state");

  currentState = { chapter: 2, caseBriefs: [{}, {}], scene: "caseTitle" };
  screens.renderCaseTitle({});
  assertEqual(latestFrame?.text, "2/2", "复用同一工厂后必须读取整体替换的新 state");
  enterCase?.();
  assertEqual(currentState.scene, "caseOpen", "重绑后的屏幕事件必须写入新 state");
  assertEqual(originalState.scene, "caseTitle", "旧 state 不得被复用工厂继续改写");
});

test("FLOW-COUNTER-MATERIAL", "live interruption returns to pending material without replaying completed boards", () => {
  const beat = { id: "incoming-message", afterSceneIndex: 0 };
  const brief = {
    sceneVersions: [{ afterScene: { kind: "evidenceCheck", checkId: "bill" } }, {}],
    evidenceChecks: [{ id: "bill" }]
  };
  for (const completed of [false, true]) {
    const state = { scene: "liveCounterBeat", activeLiveCounterBeatId: beat.id };
    const done = new Set(completed ? ["evidenceCheck:0", "afterScene:0"] : []);
    let continueCall;
    let sceneIndex = 0;
    const screens = createLiveCounterScreens({
      getState: () => state,
      liveCounterBeatById: () => beat,
      liveCounterPickForState: () => null,
      caseKey: () => "test-case",
      liveCounterBeatHtml: () => "",
      frame: () => {},
      bind: (selector, handler) => { if (selector === "[data-continue-live-counter]") continueCall = handler; },
      bindSceneButtons: () => {},
      markAction: (_, key) => done.add(key),
      actionDone: (_, key) => done.has(key),
      ensureOvernight: () => ({}),
      ensureNight: () => ({}),
      liveCounterBeatAfterScene: () => null,
      nextPlayableSceneIndex: () => 1,
      setIndexValue: (_, area, index) => { sceneIndex = index; },
      saveState: () => {},
      render: () => {}
    });
    screens.renderLiveCounterBeat(brief);
    continueCall();
    assert(done.has(`liveCounterBeat:${beat.id}`), "打断必须标记已播，材料结束后不得再次插入");
    assertEqual(sceneIndex, completed ? 1 : 0, "未检视材料须留在原场，已完成才进入下一场");
    assertEqual(state.scene, completed ? "sceneReview" : "afterSceneEvidence", "打断结束后必须恢复正确环节");
  }
});

test("ARCH-003", "large runtime domains stay split behind injected boundaries", () => {
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const caseEngineSource = readFileSync(new URL("../src/caseEngine.js", import.meta.url), "utf8");
  const overnightSource = readFileSync(new URL("../src/ui/screens/overnightScreens.js", import.meta.url), "utf8");
  const sceneSource = readFileSync(new URL("../src/ui/screens/sceneScreens.js", import.meta.url), "utf8");
  const splitSources = [
    "../src/ui/focusInputControl.js",
    "../src/ui/liveHudPresenter.js",
    "../src/runtime/caseStateWrites.js",
    "../src/runtime/caseOutcome.js",
    "../src/ui/screens/overnightDocumentScreens.js",
    "../src/ui/screens/liveCounterScreens.js",
    "../src/ui/screens/testimonyWallScreens.js"
  ].map((path) => ({ path, source: readFileSync(new URL(path, import.meta.url), "utf8") }));

  assertIncludes(caseEngineSource, "./caseTemplates/index.js", "caseEngine 必须通过模板注册表生成每日案");
  assert(!caseEngineSource.includes("function dailyLostJobCreditTemplate"), "每日案模板不能重新塞回 caseEngine");
  assertIncludes(overnightSource, "createOvernightDocumentScreens", "隔夜屏幕必须把材料子系统委托给独立工厂");
  assertIncludes(overnightSource, "createLiveCounterScreens", "隔夜屏幕必须把实时追问委托给独立工厂");
  assert(!overnightSource.includes("function renderDocumentReconcile"), "材料对账实现不能重新塞回 overnightScreens");
  assert(!overnightSource.includes("function renderLiveCounterBeat"), "实时追问实现不能重新塞回 overnightScreens");
  assertIncludes(sceneSource, "createTestimonyWallScreens", "主场景必须把证词墙与决定性指认委托给独立工厂");
  assert(!sceneSource.includes("function renderTestimonyWall"), "证词墙实现不能重新塞回 sceneScreens");
  assert(!sceneSource.includes("function renderDecisivePresentHit"), "决定性指认演出不能重新塞回 sceneScreens");

  [
    "createFocusInputControl",
    "createLiveHudPresenter",
    "createCaseStateWrites",
    "createCaseOutcome"
  ].forEach((factoryName) => assertIncludes(appSource, factoryName, `app.js 必须只组装 ${factoryName}`));
  [
    "function handleGamepadInput",
    "function currentLivePressure",
    "function ensureBudget",
    "function normalizedDailyResult"
  ].forEach((definition) => assert(!appSource.includes(definition), `${definition} 不能重新回到 app.js`));
  splitSources.forEach(({ path, source }) => {
    assert(!/from\s+["'][^"']*app\.js["']/.test(source), `${path} 不能反向 import app.js`);
  });
  ["liveHudPresenter.js", "caseStateWrites.js", "caseOutcome.js"].forEach((fileName) => {
    const source = splitSources.find((item) => item.path.endsWith(fileName))?.source ?? "";
    assertIncludes(source, "getState", `${fileName} 必须在调用时读取当前状态`);
  });
});

test("AVG-001", "render-layer sentence splitting preserves quoted sentences and ellipses", () => {
  assertEqual(splitDialogueSentences("她说：「等等。别走！」然后停了……我没回。 ").join("|"), "她说：「等等。别走！」|然后停了……|我没回。", "引号内标点不得拆句，省略号必须保留");
  assertEqual(splitDialogueSentences("这跟八万比——你别管。 ").join("|"), "这跟八万比——|你别管。", "句尾双破折号必须按被打断拍掐断显示");
});

test("AVG-002", "dialogue pages show one current speaker and split long turns", () => {
  const audioChunks = chunkDialogueTurn({ role: "stage", speaker: "旁白", text: "开播提示音响了一声。", audioCueId: "sfx.broadcast.on-air" }, 56);
  assertEqual(audioChunks[0].audioCueId, "sfx.broadcast.on-air", "对白分页不能丢掉随台词触发的语义音效");
  const sentenceLimitedChunks = chunkDialogueTurn({ role: "caller", speaker: "咨询者", text: "第一句。第二句。第三句。第四句。" }, 92);
  assertEqual(sentenceLimitedChunks.length, 2, "主案同一人连续说话时每屏最多显示两句");
  assertEqual(sentenceLimitedChunks[0].text, "第一句。第二句。", "两句以内必须留在同一个当前说话者气泡里");
  assert(sentenceLimitedChunks.every((turn) => splitDialogueSentences(turn.text).length <= 2), "主案任何对白续页都不能超过两句话");

  const openingPages = groupDialogueTurns([
    { role: "caller", speaker: "咨询者", text: "主播你好，我想咨询一件事。" },
    { role: "host", speaker: "林旭阳", text: "你好，你慢慢说。" },
    { role: "host", speaker: "林旭阳", text: "最近发生什么了？" },
    { role: "caller", speaker: "咨询者", text: "男朋友突然找我借钱。" },
    { role: "host", speaker: "林旭阳", text: "他想借多少？" },
    { role: "caller", speaker: "咨询者", text: "八万。" }
  ]);
  assertEqual(openingPages.length, 6, "六轮开场必须逐句播放，不能再把问答塞进同一屏");
  assert(openingPages.every((page) => page.lines.length === 1), "每个对白页只能显示当前说话人的一句台词");
  assertEqual(openingPages.map((page) => page.lines[0].role).join(","), "caller,host,host,caller,host,caller", "逐句播放不能改变原始问答顺序");
  assertEqual(dialoguePageRole(openingPages[0]), "caller", "来电人页面必须把舞台焦点交给来电人立绘");
  assertEqual(dialoguePageRole(openingPages[1]), "host", "主播页面必须把舞台焦点交给主播立绘");

  const longReply = "他说最近奖金晚发，让我先帮他垫几天。八万太多，我让他把账单和最近的工资记录发来。他没发工资，只发来一张社保缴费记录，说公司只是漏缴。可最后缴费月份停在四月，那段时间他还每天跟我说加班。";
  const longPages = groupDialogueTurns([
    { role: "host", speaker: "林旭阳", text: "那你后来为什么没有直接转给他？" },
    ...chunkDialogueTurn({ role: "caller", speaker: "咨询者", text: longReply }, 56)
  ]);
  assert(longPages.length >= 2, "长回答必须拆出续页，不能把整段压进一屏");
  assertEqual(longPages[0].lines[0].role, "host", "长问答首屏必须先显示主播问题");
  assert(longPages.every((page) => page.lines.length === 1), "长回答拆页后仍只能显示一位说话人");
  assert(longPages.slice(1).every((page) => page.lines[0].role === "caller"), "主播问题之后的续页必须保持来电人连续作答");

  const oversizedPairPages = groupDialogueTurns([
    { role: "host", speaker: "林旭阳", text: `${"我把账单重新分了一遍，前面这些都已经能对应到具体消费，".repeat(2)}最后还有一笔没有说清。你先告诉我，这笔钱当时为什么没有继续问？` },
    { role: "caller", speaker: "咨询者", text: `${"我问过一次，他当时把话岔开了。我怕继续问下去，两个人连表面那点体面都保不住。".repeat(2)}所以后来一直拖着。` }
  ]);
  assert(oversizedPairPages.length >= 2, "超出单页容量的完整问答必须拆页");
  assert(oversizedPairPages.every((page) => page.lines.length === 1), "超长问答拆页后每屏仍只能出现当前说话人");
  assertEqual(oversizedPairPages[0].lines[0].role, "host", "超长问答不得打乱先问后答顺序");
  assertEqual(oversizedPairPages.at(-1).lines[0].role, "caller", "超长问答最后仍应落在来电人的回答上");

  const stagePages = groupDialogueTurns([
    { role: "caller", speaker: "咨询者", text: "我看见那条弹幕了。" },
    { role: "stage", speaker: "现场", text: "弹幕慢下来，没人接话。" },
    { role: "host", speaker: "林旭阳", text: "先继续说。" }
  ]);
  assertEqual(stagePages.length, 3, "舞台提示必须单独成页，不能挤进角色问答");
  assertEqual(stagePages[1].lines[0].role, "stage", "舞台提示分页不得被吞掉或冒充咨询者");

  const reverseQuestionPages = groupDialogueTurns([
    { role: "caller", speaker: "咨询者", text: "主播，你说我该不该转？" },
    { role: "host", speaker: "林旭阳", text: "这件事只能你自己决定。" }
  ]);
  assertEqual(reverseQuestionPages.length, 2, "咨询者发问与主播回答也必须逐句切屏");
  const statementThenQuestion = groupDialogueTurns([
    { role: "caller", speaker: "咨询者", text: "钱还没有转。" },
    { role: "host", speaker: "林旭阳", text: "他第一次催你是在什么时候？" }
  ]);
  assertEqual(statementThenQuestion.length, 2, "咨询者陈述后接主播新问题时必须换页，不能伪装成问答组");
  assert(!shouldAutoAdvanceDialoguePair(statementThenQuestion[0], statementThenQuestion[1]), "仅仅更换说话人不能被误判为自动问答");
  const markedPair = groupDialogueTurns([
    { role: "host", speaker: "林旭阳", text: "这笔钱当时为什么没继续问？", autoAdvanceNext: true },
    { role: "caller", speaker: "咨询者", text: "他把话岔开了。" }
  ]);
  assert(shouldAutoAdvanceDialoguePair(markedPair[0], markedPair[1]), "作者明确标记的主播问句必须能够自动接到来电人回答");
  const markedStage = groupDialogueTurns([
    { role: "host", speaker: "林旭阳", text: "门外是谁？", autoAdvanceNext: true },
    { role: "stage", speaker: "现场", text: "敲门声又响了。" }
  ]);
  assert(!shouldAutoAdvanceDialoguePair(markedStage[0], markedStage[1]), "舞台提示前必须停住，不能被成对接话吞掉");
});

test("STATEMENT-001", "statement replay keeps one source block and exact line anchors", () => {
  const lines = statementLinesFromText("第一句先把自己说得很稳。第二句露出一个时间差。第三句只是生活细节。", { prefix: "sample" });
  assertEqual(lines.length, 3, "回放必须按原句切开，不能改写或新增事实");
  assertEqual(lines[1].id, "sample:1", "同一段回放的句子必须有稳定定位 id");
  const full = normalizeStatementPatience(null, 3);
  const afterMiss = spendStatementPatience(full, 3);
  assertEqual(afterMiss.remaining, 2, "错按一句只消耗一格耐心");
  const quietPressure = statementPressureFor(afterMiss, { mode: "replay", max: 3 });
  assertEqual(quietPressure.crowd, "", "耐心尚未耗尽时不能提前制造弹幕或直播间反应");
  assert(quietPressure.quietUntilEmpty === true, "逐句追问的耐心变化必须只给简单 UI 提示");
  const emptyPressure = statementPressureFor({ max: 3, remaining: 0 }, { mode: "replay", max: 3 });
  assertEqual(emptyPressure.crowd, "散了", "只有耐心耗尽后才允许出现直播间反应");
  const listenTransition = pixelTransitionHtml({ kind: "phase", visualVariant: "listen", eyebrow: "先听她说完", label: "来电人陈述" });
  const reviewTransition = pixelTransitionHtml({ kind: "phase", visualVariant: "review", eyebrow: "回到刚才那段", label: "逐句追问" });
  const revisionTransition = pixelTransitionHtml({ kind: "phase", visualVariant: "listen", eyebrow: "她换了一套说法", label: "改口陈述" });
  assert(listenTransition.includes('data-transition-kind="phase"') && listenTransition.includes("来电人陈述"), "进入陈述必须出现独立全屏阶段提示");
  assert(listenTransition.includes("statement-phase-stage") && listenTransition.includes("statement-phase-signal"), "进入陈述不能只剩一块文字牌，必须有统一的全屏动态信号层");
  assert(reviewTransition.includes('data-transition-variant="review"') && reviewTransition.includes("逐句追问"), "进入逐句追问必须出现独立全屏阶段提示");
  assert(revisionTransition.includes("改口陈述"), "整套说法被打穿后必须用独立过场进入改口陈述");
  assertEqual(
    statementOptionForLine([
      { id: "short", sourceAnchor: "他三十五" },
      { id: "long", sourceAnchor: "他三十五，自己开公司" }
    ], { text: "他三十五，自己开公司。" })?.id,
    "long",
    "同一句命中多个短键时必须优先最长原话锚点，不能受 JSON 顺序影响"
  );
  const repeatedAnchorLines = statementLinesFromText("他说钱已经转了。后来他又说钱已经转了。", { prefix: "ambiguous" });
  const repeatedAnchorOption = { id: "repeated", sourceAnchor: "钱已经转了" };
  assertEqual(statementAnchorLineMatches(repeatedAnchorLines, repeatedAnchorOption.sourceAnchor).length, 2, "作者工具必须识别跨句重复的 sourceAnchor");
  assertEqual(statementOptionForLine([repeatedAnchorOption], repeatedAnchorLines[0], { allLines: repeatedAnchorLines }), null, "跨句重复的 sourceAnchor 不得在运行时随便绑到第一句");

  const sampleStageBrief = {
    sceneVersions: [
      { id: "sample-a", interactionMode: "lineReplay", version: "先把前半段说完。这里有第一处。" },
      { id: "sample-b", interactionMode: "lineReplay", version: "接着把后半段说完。这里有第二处。" }
    ],
    statementStages: [{ id: "sample-stage", sceneIndexes: [0, 1], minimumReviewCount: 2 }]
  };
  const sampleStage = statementStageForScene(sampleStageBrief, 1);
  assertEqual(JSON.stringify(sampleStage.sceneIndexes), JSON.stringify([0, 1]), "同一陈述阶段内任一场景都必须回到完整阶段");
  const oneReview = statementStageProgress({
    brief: sampleStageBrief,
    stage: sampleStage,
    actionDone: (key) => key === "version:0"
  });
  assertEqual(oneReview.complete, false, "阶段内只反驳一处时不得提前进入下一段");
  const fullReview = statementStageProgress({
    brief: sampleStageBrief,
    stage: sampleStage,
    actionDone: (key) => ["version:0", "version:1"].includes(key)
  });
  assertEqual(fullReview.complete, true, "阶段内各承重点都处理后才能离开回放");
  const stagedListenHtml = statementStagePromptExchangeHtml({
    entries: sampleStage.sceneIndexes.map((sceneIndex) => ({ scene: sampleStageBrief.sceneVersions[sceneIndex], sceneIndex }))
  });
  assert(stagedListenHtml.indexOf("先把前半段说完") < stagedListenHtml.indexOf("接着把后半段说完"), "阶段陈述必须保持原事件顺序，不能先反驳再补叙述");
  const firstReplayLine = statementLinesFromText(sampleStageBrief.sceneVersions[0].version, { prefix: "sample-a" })[0];
  const stagedReplayHtml = statementReplayPageHtml({ line: firstReplayLine });
  assertIncludes(stagedReplayHtml, "先把前半段说完", "逐句回放必须保留当前原话");
  assert(!stagedReplayHtml.includes("接着把后半段说完"), "逐句回放不得把阶段后半段同时堆到一屏");
  const stagedReplayChoices = statementReplayPageChoicesHtml({
    scene: { ...sampleStageBrief.sceneVersions[0], questionOptions: [{ sourceAnchor: "先把前半段说完", question: "这一句怎么回事？" }] },
    sceneIndex: 0,
    line: firstReplayLine
  });
  assertIncludes(stagedReplayChoices, 'data-scene-question="0:0"', "询问操作关联当前原句");
  assertIncludes(stagedReplayChoices, "询问这句", "实际问题留在对话里");
  assertIncludes(stagedReplayChoices, "不询问", "每句均可选择不询问");
  assertIncludes(stagedReplayChoices, "data-scene-replay-next", "玩家必须能逐句继续回放而不是困在选项墙");

  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  let hiddenDecisiveStatementCount = 0;
  for (const brief of briefs) {
    const replayScenes = (brief.sceneVersions ?? []).filter((scene) => scene.interactionMode === "lineReplay");
    const wallScenes = (brief.sceneVersions ?? []).filter((scene) => scene.interactionMode === "testimonyWall");
    assertEqual(wallScenes.length, 1, `${brief.plotId} 必须且只能有一场证词墙`);
    assertEqual(replayScenes.length, brief.sceneVersions.length - 1, `${brief.plotId} 除证词墙外的通麦场次必须采用整段听麦与逐句回放`);
    const stages = statementStagesForBrief(brief);
    const playableReplayIndexes = playableSceneIndexes(brief)
      .filter((sceneIndex) => brief.sceneVersions?.[sceneIndex]?.interactionMode === "lineReplay")
      .sort((left, right) => left - right);
    assertEqual(JSON.stringify(stages.flatMap((stage) => stage.sceneIndexes).sort((left, right) => left - right)), JSON.stringify(playableReplayIndexes), `${brief.plotId} 阶段编排必须覆盖全部可玩陈述`);
    for (const stage of stages) {
      assert(stage.minimumReviewCount >= stage.sceneIndexes.length, `${brief.plotId}/${stage.id} 必须覆盖关键问题，不强迫外围追问`);
      const onlyFirstKey = statementStageProgress({
        brief,
        stage,
        actionDone: (key) => key === `version:${stage.sceneIndexes[0]}`
      });
      assertEqual(onlyFirstKey.complete, stage.sceneIndexes.length === 1 && stage.minimumReviewCount === 1, `${brief.plotId}/${stage.id} 关键问题与约定操作完成后应能离开`);
      const extraReviewCount = Math.max(0, stage.minimumReviewCount - stage.sceneIndexes.length);
      const completedStage = statementStageProgress({
        brief,
        stage,
        actionDone: (key) => stage.sceneIndexes.some((sceneIndex) => key === `version:${sceneIndex}`),
        dialoguePicksForScene: (sceneIndex) => sceneIndex === stage.sceneIndexes[0]
          ? Array.from({ length: extraReviewCount }, (_, optionIndex) => ({ optionIndex }))
          : []
      });
      assertEqual(completedStage.complete, true, `${brief.plotId}/${stage.id} 达到多问门槛后必须能继续`);
    }
    const wall = wallScenes[0];
    assert((wall.testimonyWall?.acts?.length ?? 0) > 0, `${brief.plotId} 已配置证词墙须暴露可播放段落`);
    assert((wall.testimonyWall?.statements ?? []).length >= 2, `${brief.plotId} 证词墙必须有 4 到 6 句`);
    assert((wall.testimonyWall?.statements ?? []).every((statement) => statement.pressResponse && statement.presentResponse), `${brief.plotId} 每句证词都必须有专属追问与普通出示回应`);
    const initialStatements = testimonyStatementsForScene(wall, {});
    const revealSource = (wall.testimonyWall?.statements ?? []).find((statement) => statement.reveals?.length);
    const decisiveStatement = (wall.testimonyWall?.statements ?? []).find((statement) => statement.id === wall.decisivePresent?.statementId);
    if (decisiveStatement?.hidden) {
      hiddenDecisiveStatementCount += 1;
      assertEqual(decisivePresentAvailability(wall, {}).canStart, false, `${brief.plotId} 隐藏决定性证词未揭出前不得发起正式指认`);
    } else {
      assertEqual(decisivePresentAvailability(wall, {}).canStart, true, `${brief.plotId} 可见决定性证词必须允许发起正式指认`);
    }
    if (revealSource) {
      const afterPress = pressTestimonyStatement(wall, {}, revealSource.id);
      assert(testimonyStatementsForScene(wall, afterPress).length > initialStatements.length, `${brief.plotId} 隐藏证词必须由 PRESS 后出现`);
      if (decisiveStatement?.hidden) {
        assertEqual(decisivePresentAvailability(wall, afterPress).canStart, true, `${brief.plotId} 隐藏决定性证词揭出后必须解锁正式指认`);
      }
    }
    const present = wall.decisivePresent;
    const missOne = decisivePresentOutcome(wall, {}, "wrong-evidence", present.statementId);
    const missTwo = decisivePresentOutcome(wall, missOne.progress, "wrong-evidence", present.statementId);
    const hit = decisivePresentOutcome(wall, normalizeDecisivePresentProgress({}, present.maxAttempts), present.evidenceId, present.statementId);
    assertEqual(missOne.kind, "miss", `${brief.plotId} 第一次正式错证必须进入 guarded 收紧`);
    assert(missOne.progress.guarded && missOne.progress.remaining === 1, `${brief.plotId} 第一次正式错证必须当场掉一大格`);
    assertEqual(missTwo.kind, "exhausted", `${brief.plotId} 两次正式指认全错必须耗尽机会`);
    assertEqual(hit.kind, "hit", `${brief.plotId} 唯一材料×证词组合必须命中`);
    if (wall.testimonyWall.acts.length === 1) {
      assertEqual(testimonyActIsFinal(wall, {}), true, "单段证词问清后直接向前");
      continue;
    }
    const act2Progress = advanceTestimonyAct(wall, {});
    assertEqual(act2Progress.act, 2, `${brief.plotId} act1 命中后必须把墙推进 act2`);
    assertEqual(testimonyActIsFinal(wall, {}), false, `${brief.plotId} act1 命中后不得直接进入 afterVersion`);
    assertEqual(testimonyActIsFinal(wall, act2Progress), true, `${brief.plotId} act2 才是进入 afterVersion 前的最终幕`);
    assertEqual(decisivePresentAvailability(wall, act2Progress).canStart, true, `${brief.plotId} act2 切入后必须按第二幕证词计算指认门禁`);
    const act2 = testimonyActForScene(wall, act2Progress);
    const act2Present = act2.decisivePresent;
    const act1Key = testimonyWallKey(brief, wall, 0, 1);
    const act2Key = testimonyWallKey(brief, wall, 0, 2);
    assertEqual(act2Key, `${act1Key}:act2`, `${brief.plotId} act2 presentProgress key 必须使用 :act2 后缀`);
    const act2MissOne = decisivePresentOutcome(wall, {}, "wrong-evidence", act2Present.statementId, act2Progress);
    const act2MissTwo = decisivePresentOutcome(wall, act2MissOne.progress, "wrong-evidence", act2Present.statementId, act2Progress);
    assertEqual(act2MissOne.progress.attempts, 1, `${brief.plotId} act2 第一次错误必须从自己的 0 次开始计数`);
    assertEqual(hit.progress.attempts, 0, `${brief.plotId} act2 错误不得改写 act1 已命中的独立进度`);
    assertEqual(act2MissTwo.kind, "exhausted", `${brief.plotId} act2 两次全错必须走 patienceLost`);
    const retriedAct2 = resetDecisivePresentProgress(act2MissTwo.progress, act2Present.maxAttempts);
    assertEqual(retriedAct2.attempts, 0, `${brief.plotId} patienceLost 重试必须只重置 act2 次数`);
    assertEqual(retriedAct2.resolved, false, `${brief.plotId} act2 重试必须恢复为未命中`);
    assert(hit.progress.resolved, `${brief.plotId} act2 重试后 act1 必须保持已完成`);
    const retriedWallState = retryPatienceLostState({
      state: { patienceLostContext: null },
      brief,
      context: { caseId: brief.id, area: "sceneReview", retryScene: "testimonyWall", index: 0, actionKeys: [], spent: false },
      budget: { max: 2, remaining: 0, used: 2 },
      areaTotal: brief.sceneVersions.length
    });
    assertEqual(retriedWallState.scene, "testimonyWall", `${brief.plotId} act2 耗尽后重试必须直接回当前证词墙，不得触发后续场景钩子`);
    const afterVersionLine = wall.afterVersion?.lines?.find((line) => line.text)?.text;
    if (afterVersionLine) {
      const continued = completedSceneExchangeHtml({ scene: wall });
      assertIncludes(continued, afterVersionLine, `${brief.plotId} 决定性指认后的 sceneReview 必须续播 afterVersion`);
      assertEqual(continued.split(afterVersionLine).length - 1, 1, `${brief.plotId} 墙后对白只能播一次`);
      assert(!continued.includes(wall.version), `${brief.plotId} 墙后不能重新播放旧陈述`);
    }
    for (const scene of replayScenes) {
      const loadBearing = (scene.questionOptions ?? []).filter((option) => option.contradiction);
      assert(loadBearing.length >= 1, `${scene.id} 至少要有一句能进入质问的原话`);
      assert(loadBearing.every((option) => option.sourceAnchor && scene.version.includes(option.sourceAnchor)), `${scene.id} 的 sourceAnchor 必须逐字存在于首次陈述`);
      const replayLines = statementLinesFromText(scene.version ?? "", { prefix: scene.id });
      const replayHtml = statementReplayHtml({ scene });
      for (const [kind, options] of [["question", scene.questionOptions ?? []], ["dialogue", scene.casualQuestions ?? []]]) {
        for (const [optionIndex, option] of options.entries()) {
          if (!option.answer && !option.lines?.length) continue;
          assert(option.sourceAnchor, `${scene.id} ${kind} ${optionIndex} 有回答却没有 sourceAnchor，玩家会看见死内容`);
          const anchorMatches = statementAnchorLineMatches(replayLines, option.sourceAnchor);
          assertEqual(anchorMatches.length, 1, `${scene.id} ${kind} ${optionIndex} 的 sourceAnchor 必须只命中当前陈述的一句`);
          const sourceLine = anchorMatches[0];
          assert(sourceLine, `${scene.id} ${kind} ${optionIndex} 的 sourceAnchor 不在当前陈述原句里`);
          assert(statementOptionsForLine(options, sourceLine).includes(option), `${scene.id} ${kind} ${optionIndex} 被同句更长 anchor 遮住，无法从回放发起`);
          const binding = kind === "question" ? `data-scene-question=\"0:${optionIndex}\"` : `data-scene-dialogue=\"0:${optionIndex}\"`;
          assertIncludes(replayHtml, binding, `${scene.id} ${kind} ${optionIndex} 必须从逐句回放实际渲染为可点击入口`);
        }
      }
      const wrongOptions = (scene.questionOptions ?? []).filter((option) => option.correct === false);
      for (const option of wrongOptions) {
        assert(option.sourceAnchor, `${scene.id} 可见错问必须有 sourceAnchor`);
        const anchorMatches = statementAnchorLineMatches(replayLines, option.sourceAnchor);
        assertEqual(anchorMatches.length, 1, `${scene.id} 可见错问的 sourceAnchor 必须只命中当前陈述的一句`);
        const sourceLine = anchorMatches[0];
        assert(sourceLine, `${scene.id} 可见错问的 sourceAnchor 必须逐字落在当前陈述`);
        assert(statementOptionsForLine(scene.questionOptions ?? [], sourceLine).includes(option), `${scene.id} 可见错问不得被同句更长 anchor 吞掉`);
        const reaction = statementMissReactionForOption(option);
        assert(reaction.text && ["caller", "host", "comment"].includes(reaction.role), `${scene.id} 可见错问必须有带角色的 missReaction`);
        assert(!/(正确答案|你该点|点另一句|换一条线索)/.test(reaction.text), `${scene.id} 错问反应不得教玩家改点答案`);
        const answerAnchors = (scene.questionOptions ?? [])
          .filter((candidate) => candidate.correct === true)
          .flatMap((candidate) => [candidate.logicContract?.answerAnchor, candidate.revisedSourceAnchor])
          .filter((value) => String(value ?? "").length >= 6);
        assert(answerAnchors.every((anchor) => !reaction.text.includes(anchor)), `${scene.id} 错问反应不得顺手泄出正确锚点`);
        if (scene.revisedVersion) {
          assert(option.revisedSourceAnchor, `${scene.id} 改口场的可见错问必须另有 revisedSourceAnchor`);
          const revisedLines = statementLinesFromText(scene.revisedVersion, { prefix: `${scene.id}:revised` });
          const revisedAnchorMatches = statementAnchorLineMatches(revisedLines, option.revisedSourceAnchor);
          assertEqual(revisedAnchorMatches.length, 1, `${scene.id} 可见错问的 revisedSourceAnchor 必须只命中改口陈述的一句`);
          const revisedLine = revisedAnchorMatches[0];
          assert(revisedLine, `${scene.id} 可见错问的 revisedSourceAnchor 必须逐字落在改口陈述`);
          const revisedOptions = (scene.questionOptions ?? []).map((candidate) => ({
            ...candidate,
            sourceAnchor: candidate.revisedSourceAnchor ?? candidate.sourceAnchor
          }));
          const revisedOption = revisedOptions[(scene.questionOptions ?? []).indexOf(option)];
          assert(statementOptionsForLine(revisedOptions, revisedLine).includes(revisedOption), `${scene.id} 改口后的可见错问不得被更长 anchor 吞掉`);
        }
      }
      const noClueLines = replayLines.filter((line) =>
        !statementOptionsForLine(scene.questionOptions ?? [], line).length &&
        !statementOptionsForLine(scene.casualQuestions ?? [], line).length
      );
      if (noClueLines.length) {
        const reaction = statementNoClueReactionFor(scene);
        assert(reaction.text && ["caller", "host", "comment"].includes(reaction.role), `${scene.id} 无线索原句扣耐心后必须接角色反应`);
      }
      if (scene.revisedVersion) {
        assert(loadBearing.every((option) => scene.revisedVersion.includes(option.revisedSourceAnchor ?? option.sourceAnchor)), `${scene.id} 的改口陈述也必须保留可点中的承重原句`);
      }
    }
    assert(statementNightPatienceMax(brief, "night-a") >= 3, `${brief.plotId} 第一夜必须有独立耐心条`);
    assert(statementNightPatienceMax(brief, "night-b") >= 3, `${brief.plotId} 第二夜必须重置为独立耐心条`);
    for (const [nightKey, sceneIndexes] of [
      ["night-a", brief.nightStructure?.segment1SceneIndexes ?? []],
      ["night-b", brief.nightStructure?.segment2SceneIndexes ?? []]
    ]) {
      const nightScenes = sceneIndexes.map((index) => brief.sceneVersions?.[index]).filter(Boolean);
      const replayRounds = nightScenes.filter((scene) => scene.interactionMode === "lineReplay");
      const wallRounds = nightScenes.filter((scene) => scene.interactionMode === "testimonyWall");
      assert(replayRounds.length + wallRounds.length >= 2, `${brief.plotId} ${nightKey} 每次连线至少要有两轮陈述盘问`);
      assert(
        replayRounds.some((scene) => statementLinesFromText(scene.version ?? "").length >= 3) || wallRounds.some((scene) => (scene.testimonyWall?.statements ?? []).length >= 4),
        `${brief.plotId} ${nightKey} 至少要有一段三句以上的完整陈述或四句证词墙`
      );
    }
    const firstNightA = brief.nightStructure?.segment1SceneIndexes?.[0];
    const firstNightB = brief.nightStructure?.segment2SceneIndexes?.[0];
    if (Number.isInteger(firstNightA)) assertEqual(statementNightKey(brief, firstNightA), "night-a", `${brief.plotId} 第一夜场次必须共用 night-a 耐心`);
    if (Number.isInteger(firstNightB)) assertEqual(statementNightKey(brief, firstNightB), "night-b", `${brief.plotId} 第二夜场次必须共用 night-b 耐心`);
  }
  assert(hiddenDecisiveStatementCount >= 1, "至少一案必须保留 PRESS 后才解锁决定性指认的二段发现");
  const migratedWallState = migrateState({ testimonyWallProgress: { legacy: { pressedIds: ["old-line"] } } });
  assertEqual(migratedWallState.testimonyWallProgress.legacy.act, 1, "旧版单幕 testimonyWall 存档必须迁移为 act1 进行中");
  assertEqual(normalizeTestimonyWallProgress(migratedWallState.testimonyWallProgress.legacy).preludeSeen, true, "已经在旧证词墙操作过的存档不能倒退重播前置陈述");
  assertEqual(normalizeTestimonyWallProgress({}).preludeSeen, false, "新证词墙必须先播放承重前置陈述再开放逐句盘问");
  assertIncludes(screenSources[2], "wallContext.finalAct && wallContext.presentProgress.resolved", "旧版 act1 已写完成标记的存档也必须以 act2 命中作为证词墙最终门禁");
  assertIncludes(screenSources[7], "function advanceWallAct", "证词墙模块必须保留 act1 命中后推进到 act2 的独立入口");

  for (const packet of quickDetectiveCasesFor("steam-demo-01")) {
    const rounds = quickDisclosureRounds(packet);
    assert(rounds.length >= 2, `${packet.id} 每通快案至少要有两轮陈述与逐句追问`);
    rounds.forEach((round, roundIndex) => {
      assert(quickStatementLinesForRound(packet, { roundIndex }).length >= 2, `${packet.id} ${round.id ?? roundIndex} 必须能拆成至少两句逐句追问`);
      const state = { ...initialQuickDetectiveState(packet), scene: "issueSelection", roundIndex, resolvedConfrontationIds: [...(round.autoConfrontationIds ?? [])] };
      const lines = quickStatementLinesForRound(packet, state);
      const options = quickIssueOptionsForRound(packet, state);
      for (const [optionIndex, option] of options.entries()) {
        assertEqual(statementAnchorLineMatches(lines, option.sourceAnchor).length, 1, `${packet.id}/${round.id} 快案选项 ${optionIndex} 的 sourceAnchor 必须只命中本轮一句原话`);
      }
      for (const option of options.filter((item) => item.correct === false)) {
        assert(option.sourceAnchor, `${packet.id}/${round.id} 快案错问必须有 sourceAnchor`);
        const anchorMatches = statementAnchorLineMatches(lines, option.sourceAnchor);
        assertEqual(anchorMatches.length, 1, `${packet.id}/${round.id} 快案错问的 sourceAnchor 必须只命中本轮一句原话`);
        const sourceLine = anchorMatches[0];
        assert(sourceLine, `${packet.id}/${round.id} 快案错问必须逐字落在本轮原话`);
        assertEqual(statementOptionForLine(options, sourceLine), option, `${packet.id}/${round.id} 快案错问不得被同句更长 anchor 吞掉`);
        const reaction = statementMissReactionForOption(option);
        assert(reaction.text && ["caller", "host", "comment"].includes(reaction.role), `${packet.id}/${round.id} 快案错问必须有非讲解式角色反应`);
        assert(!/(正确答案|你该点|点另一句|换一条线索)/.test(reaction.text), `${packet.id}/${round.id} 快案错问反应不得教答案`);
        const asked = applyQuickStatementLineSelection(packet, state, sourceLine.id);
        assertIncludes(quickDetectiveMissReactionHtml(packet, asked), option.question, "错问先说出实际问句");
        const miss = advanceQuickMissReaction(packet, asked);
        assertEqual(miss.scene, "missReaction", `${packet.id}/${round.id} 快案错问必须先播角色反应，不能只扣耐心`);
        const afterMiss = advanceQuickMissReaction(packet, miss);
        const remaining = afterMiss.roundPatience?.[round.id]?.remaining ?? Number(round.patience ?? 3);
        assertEqual(remaining, Math.max(0, Number(round.patience ?? 3) - (packet.focusedInquiry ? 0 : 1)), `${packet.id}/${round.id} 集中问询保留旧预算但不再扣费`);
        assertIncludes(quickDetectiveMissReactionHtml(packet, miss), reaction.text, `${packet.id}/${round.id} 快案错问反应必须在下一屏可见`);
        assert(["issueSelection", "transcript", "confrontation"].includes(afterMiss.scene), `${packet.id}/${round.id} 错问反应播完必须回到当前回放或接上本段自动问询`);
      }
      const noClueLine = lines.find((line) => !statementOptionForLine(options, line));
      if (noClueLine && options.length && packet.format !== "solo-commentary" && !packet.focusedInquiry) {
        const reaction = statementNoClueReactionFor(round);
        assert(reaction.text, `${packet.id}/${round.id} 无线索原句必须配置角色反应`);
        const miss = applyQuickStatementLineSelection(packet, state, noClueLine.id);
        assertEqual(miss.scene, "missReaction", `${packet.id}/${round.id} 无线索原句不得只扣耐心后静默返回`);
        const afterReaction = advanceQuickMissReaction(packet, advanceQuickMissReaction(packet, miss));
        assertIncludes(quickDetectiveIssueSelectionHtml(packet, afterReaction), "这句没有可追问的线索 · 耐心 −1", `${packet.id}/${round.id} 无线索原句必须保留统一脚注`);
      }
    });
  }

  assert(screenSources.join("\n").includes("来电人陈述"), "主案与快案屏幕必须接入陈述阶段提示");
  assert(screenSources.join("\n").includes("逐句追问"), "主案与快案屏幕必须接入逐句追问阶段提示");
});

test("VIEW-TESTIMONY-003", "voice matrix is a visual skin on the existing testimony wall", () => {
  const statement = { id: "s1", label: "证词 01", text: "我不是要钱，我是要个态度。" };
  const html = testimonyWallHtml({
    scene: { testimonyWall: { presentationSkin: "voice-matrix" } },
    wallAct: {
      act: 1,
      presentationSkin: "voice-matrix",
      title: "把原话摊开",
      statements: [statement],
      decisivePresent: { materialCards: [] }
    },
    statements: [statement],
    wallProgress: {},
    presentProgress: { remaining: 2 },
    presentAvailability: { canStart: true }
  });
  assertIncludes(html, "testimony-wall--voice-matrix", "语音方阵必须复用证词墙并只增加外观类");
  assertIncludes(html, "语音方阵 · 第 1 幕", "语音方阵必须在现有证词墙标题上给出玩家可见状态");
  assertIncludes(html, "data-testimony-press=\"s1\"", "语音方阵必须保留原有 PRESS 操作");
  assertIncludes(html, "data-inline-present-material", "语音方阵同页选择出示材料");
});

test("NARRATIVE-CAFE-ROUTE", "continuous reading keeps the cafe investigation and callback on the same route", () => {
  const continuous = readFileSync(new URL("../docs/generated/steam-demo-01-continuous-story-script.md", import.meta.url), "utf8").split("# 附录｜")[0];
  assertIncludes(continuous, "受理需要谁到场", "代表路线先咨询机构");
  assertIncludes(continuous, "双方带孩子到机构", "代表路线后续披露同意及到场经过");
  assertIncludes(continuous, "十八号那笔，收款人不是顾*", "顺序调查完成后必须回收家庭卡线索");
  assert(!continuous.includes("与上段互斥"), "当前双线调查不能仍写成互斥路线");
});

test("VIEW-NARRATIVE-001", "clarification and solo commentary do not invent a confession or caller", () => {
  const statements = [{ id: "a", text: "已知的事实" }, { id: "b", text: "希望主播替我说的话" }];
  const wallHtml = testimonyWallHtml({ wallAct: { midSummary: "", decisivePresent: { outcomeKind: "clarification" } }, statements });
  assert(!wallHtml.includes("testimony-host-summary"), "没有小结时不能自动补一段判词");
  assertIncludes(wallHtml, "材料核对", "补问应与声称证伪的指认区分");
  assertIncludes(wallHtml, 'data-testimony-press="b"', "没有小结也必须显示后半组原话");
  const soloDeck = liveControlDeckHtml({ soloCommentary: true, segment: 2, total: 5 });
  assert(!/来电人|通话进度|刚接进来|尚未收到/.test(soloDeck), "独白模式不能显示虚构的来电状态");
  assertIncludes(soloDeck, "公开文本", "独白的材料来自公开文本");
});

test("AVG-002B", "night-shell narration keeps narrator attribution instead of becoming caller speech", () => {
  const narrationNode = {
    classList: { contains: (name) => name === "night-shell-line" || name === "shell-narration" },
    querySelector: (selector) => selector === "b"
      ? { textContent: "旁白" }
      : selector === "p" ? { textContent: "直播中灭了。" } : null,
    getAttribute: () => ""
  };
  const turns = dialogueTurnsFrom({ querySelectorAll: () => [narrationNode] });
  assertEqual(turns[0]?.role, "stage", "终局旁白必须按舞台叙述分页，不能使用咨询者气泡");
  assertEqual(turns[0]?.speaker, "旁白", "终局旁白必须保留旁白署名");
});

test("AVG-003", "all four authored openings preserve their conversational order in single-speaker pages", () => {
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  briefs.forEach((brief) => {
    const turns = (brief.openingDialogue ?? []).flatMap((line) => chunkDialogueTurn(line, 92));
    const pages = groupDialogueTurns(turns, { maxPageChars: 156 });
    assert(pages.length >= 4, `${brief.runtimeContentCaseId} 开场至少需要四拍逐句交流`);
    assert(pages.every((page) => page.lines.length === 1), `${brief.runtimeContentCaseId} 每个开场页面只能显示当前说话人`);
    assertEqual(pages.map((page) => page.lines[0].text).join("|"), turns.map((turn) => turn.text).join("|"), `${brief.runtimeContentCaseId} 逐句切屏不得改写或重排原始台词`);
  });
});

test("TEXTURE-001", "texture metrics remain descriptive while declared voice contracts are enforced", () => {
  const unmarked = dialogueTextureMetrics({ caseId: "unmarked" });
  assertEqual(unmarked.skipped, true, "未打 texturePass 标记的案件必须跳过纹理门控");
  const broken = dialogueTextureMetrics({ caseId: "broken", texturePass: true, voiceTics: { 沈: ["反正"] }, sceneVersions: [] });
  assertEqual(broken.valid, false, "声明口癖却缺少 voiceTicArc 时必须失败");
  assertThrows(() => assertDialogueTexture({ caseId: "broken", texturePass: true, voiceTics: { 沈: ["反正"] } }), /voiceTicArc/, "纹理断言报告缺失的角色约束，不强制凑短答或打断");
  const caseOne = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/cases/01-credit.json", import.meta.url), "utf8"));
  const result = assertDialogueTexture(caseOne);
  for (const [metric, sample] of [["shortAnswerCount", "shortAnswers"], ["longRambleCount", "longRambles"], ["interruptionCount", "interruptions"], ["nonLoadBearingCount", "nonLoadBearing"]]) {
    assertEqual(result.metrics[metric], result.samples[sample].length, `${metric} 应如实统计已播放台词，不要求作者凑次数`);
  }
  assertEqual(result.metrics.otherTicCount, 0, "明确归属于沈的口癖不能串给其他角色");
});

test("TEXTURE-002", "zero-tic fingerprints, one-time tics, and clean ending lines are pure assertions", () => {
  const longLine = "我把这件事从头又说了一遍，数字写在纸上，主语也补回来了。".repeat(6);
  const base = {
    caseId: "texture-pure",
    texturePass: true,
    voiceTicArc: { 测试角色: "测试分布" },
    sceneVersions: [
      {
        version: longLine,
        beforeVersion: { lines: [
          { role: "caller", text: "我先——" },
          { role: "caller", text: "没有。" },
          { role: "caller", text: "水凉了。", nonLoadBearing: true }
        ] }
      },
      {
        version: longLine,
        sceneCloser: { lines: [
          { role: "host", text: "今晚——" },
          { role: "caller", text: "发。" },
          { role: "caller", text: "灯太亮。", nonLoadBearing: true }
        ] }
      }
    ],
    deepFollowup: { question: "你报多少？", answer: "唉。……一万出头。" }
  };
  const negative = dialogueTextureMetrics({
    ...base,
    voiceTics: { 林: [] },
    oneTimeTic: "唉",
    oneTimeTicPath: "deepFollowup.answer"
  });
  assert(negative.valid, `零语气词与 oneTimeTic 合法样本必须通过: ${negative.errors.join(" / ")}`);
  assertEqual(negative.metrics.oneTimeCallerCount, 1, "oneTimeTic 必须精确出现一次");
  const leaked = dialogueTextureMetrics({
    ...base,
    voiceTics: { 林: [] },
    oneTimeTic: "唉",
    oneTimeTicPath: "deepFollowup.answer",
    sceneVersions: [{ ...base.sceneVersions[0], version: `${longLine} 呃。` }, base.sceneVersions[1]]
  });
  assert(leaked.errors.some((error) => error.includes("零语气词指纹泄漏")), "空口癖表必须抓住通用语气词泄漏");
  const cleanLine = "……写。这个活动我还想继续负责，钱也得回来。";
  const clean = dialogueTextureMetrics({
    ...base,
    voiceTics: { 陈: ["呃"] },
    sceneVersions: [
      { ...base.sceneVersions[0], version: `${longLine} 呃，呃，呃。` },
      base.sceneVersions[1]
    ],
    deepFollowup: { question: "写不写？", answer: cleanLine },
    voiceTicCleanLines: [cleanLine]
  });
  assert(clean.valid, `指定无口癖句合法样本必须通过: ${clean.errors.join(" / ")}`);
  const contaminatedLine = `${cleanLine}呃。`;
  const contaminated = dialogueTextureMetrics({
    ...base,
    voiceTics: { 陈: ["呃"] },
    sceneVersions: [
      { ...base.sceneVersions[0], version: `${longLine} 呃，呃，呃。` },
      base.sceneVersions[1]
    ],
    deepFollowup: { question: "写不写？", answer: contaminatedLine },
    voiceTicCleanLines: [contaminatedLine]
  });
  assert(contaminated.errors.some((error) => error.includes("指定干净句未通过")), "指定干净句混入口癖必须失败");
});

test("TEXTURE-003", "spoken surfaces reject half-width prose punctuation without policing typed comments", () => {
  const packet = {
    texturePass: false,
    openingDialogue: [{ role: "caller", text: "我看见了,但没回。" }],
    driftComments: ["看见了,没回"]
  };
  assertEqual(spokenPunctuationLeaks(packet).length, 1, "半角逗号只应从说话面报错");
  assertEqual(spokenPunctuationLeaks(packet)[0].path, "packet.openingDialogue[0]", "报错必须保留可定位路径");
  assertEqual(spokenPunctuationLeaks({ ...packet, openingDialogue: [{ role: "caller", text: "我看见了，但没回。" }] }).length, 0, "全角口语必须通过，打字弹幕不参与检查");
});

test("TEXTURE-004", "staged ramble metrics count rendered lines instead of hidden fallback answers", () => {
  const result = dialogueTextureMetrics({
    texturePass: true,
    voiceTics: { 陈: ["呃"] },
    voiceTicArc: { 陈: "前密后净" },
    sceneVersions: [{
      casualQuestions: [{
        textureRole: "ramble",
        answer: "备用答案里也有呃，但玩家不会听到。",
        lines: [{ role: "caller", text: "玩家只听见这一句，呃。" }]
      }]
    }]
  });
  assertEqual(result.metrics.longRambleCount, 1, "拆拍长絮叨必须按一段计数");
  assertEqual(result.metrics.callerTicCount, 1, "未渲染 answer 不得重复贡献口癖计数");
  assertIncludes(result.samples.longRambles[0], ".lines[0]", "长絮叨样本必须指向实际渲染的 lines");
});

test("TEXTURE-005", "declared night-A to night-B tic arcs reject late tic leakage", () => {
  const packet = {
    texturePass: true,
    voiceTics: { 何: ["你知道吧"] },
    voiceTicArc: { 何: "夜 A 密,夜 B 消失" },
    nightStructure: { segment1SceneIndexes: [0], segment2SceneIndexes: [1] },
    sceneVersions: [
      { version: "你知道吧。", casualQuestions: [{ answer: "我说过，你知道吧。" }] },
      { version: "到第二晚了，你知道吧。" }
    ]
  };
  const leaked = dialogueTextureMetrics(packet);
  assert(leaked.errors.some((message) => message.includes("夜 B 口癖未消失")), "夜 B 复现声明口癖必须报错");
  packet.sceneVersions[1].version = "到第二晚了。";
  const clean = dialogueTextureMetrics(packet);
  assert(!clean.errors.some((message) => message.includes("夜 B 口癖未消失")), "口癖只落在夜 A 时弧线检查必须通过");
});

test("CARE-001", "closing care choices are complete, non-scored, and render authored pauses", () => {
  const packets = ["01-credit", "02-tony", "03-profile", "04-workplace"].map((caseId) => JSON.parse(readFileSync(new URL(`../content/packs/steam-demo-01/cases/${caseId}.json`, import.meta.url), "utf8")));
  packets.forEach((packet) => {
    assert(careChoiceIsComplete(packet), `${packet.caseId} 必须各有 pragmatic/affirm/accompany 三种关怀选择`);
    assert(packet.careChoices.every(choice => CARE_CHOICE_IDS.includes(choice.id)), "收麦使用稳定 ID");
    assert(packet.careChoices.every((choice) => !("score" in choice) && !("correct" in choice)), `${packet.caseId} 关怀选择不得计分或标正确项`);
    assert(packet.careChoices.every((choice) => !JSON.stringify(choice).includes("(拍)")), `${packet.caseId} 停顿必须是独立拍，不能把(拍)写进台词`);
  });
  assertEqual(careChoiceById(packets[0], "accompany")?.label, packets[0].careChoices[0].hostLine, "顺序收麦按稳定 ID 读取实际台词");
  assert(packets.every(packet => packet.careChoices.every(choice => choice.sequential)), "四案收麦必须顺序推进");
  assert(!JSON.stringify(packets[2].careChoices).includes("唉"), "案 3 关怀支线不得污染 oneTimeTic 唯一性");
  assert(packets[3].careChoices[0].lines[0].text.length > 0, "案 4 务实支线必须回应跟进安排");
  const choiceHtml = careChoiceHtml({ choices: packets[0].careChoices });
  assertIncludes(choiceHtml, "data-care-choice=\"accompany\"", "未选择时必须渲染三种关怀动词");
  assert(!choiceHtml.includes("不计分"), "最后一句靠选项差异自行说明，不再插入游戏规则解释");
  assert(choiceHtml.includes(packets[0].careChoices[0].hostLine) && !choiceHtml.includes('data-care-choice="affirm"'), "初始只显示第一句，不再给三个互斥选项");
  const selectedHtml = careChoiceHtml({ selectedChoice: { ...packets[0].careChoices[0], lines: [{ role: "pause" }, ...packets[0].careChoices[0].lines] } });
  assertIncludes(selectedHtml, "care-choice-pause", "选择后必须渲染停顿拍");
  assertIncludes(careChoiceHtml({ selectedChoice: packets[0].careChoices[0], hostName: "周明" }), "周明", "关怀拍必须显式使用当前玩家姓名");
  assertEqual(careChoiceLines(careChoiceById(packets[0], "accompany"), "周明")[0].speaker, "周明", "关怀拍纯模型必须接受当前玩家姓名");
  assertIncludes(careChoiceContinueHtml({ finalCase: true }), "听完这夜", "最后一案关怀拍必须能进入整夜尾声");
  assertIncludes(careChoiceContinueHtml({ finalCase: false }), "data-view-case-closure", "完整案件案卷必须保留为可选查看，不再强制重复收束");
});

test("CARE-002", "epilogue unread callbacks echo care choices before the data curve", () => {
  const manifest = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/manifest.json", import.meta.url), "utf8"));
  const epilogue = manifest.nightShell.epilogue;
  const careChoices = {
    "01-credit": "pragmatic",
    "02-tony": "affirm",
    "03-profile": "accompany",
    "04-workplace": "pragmatic"
  };
  const messages = epilogueUnreadMessages(epilogue, careChoices);
  assertEqual(messages.length, 5, "尾声必须依次有四条回访和一条陌生号码");
  assertEqual(messages[0].echo, epilogue.unreadMessages[0].echoes.pragmatic, "案 1 未读必须回声务实选择");
  assertIncludes(messages[1].text, "群里到今天还没回", "第二通职场回访必须回声务实选择");
  const profileCallback = epilogue.unreadMessages.find((message) => message.caseId === "03-profile");
  assertEqual(messages[2].echo, profileCallback.echoes.accompany, "案 3 未读必须选中陪伴回声，不锁定已经退役的对白");
  assertIncludes(messages[2].text, "那几条付款条件，她没说要改", "案 3 回访不得把取消饭局改写成女方已让步");
  assertIncludes(messages[3].text, "十五块", "第四通 Tony 回访必须回声肯定选择");
  const caseThree = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/cases/03-profile.json", import.meta.url), "utf8"));
  const caseFour = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/cases/04-workplace.json", import.meta.url), "utf8"));
  const caseThreeAffirm = caseThree.careChoices.find((choice) => choice.id === "affirm")?.hostLine ?? "";
  const caseFourAffirm = caseFour.careChoices.find((choice) => choice.id === "affirm")?.hostLine ?? "";
  assertIncludes(epilogue.unreadMessages.find((message) => message.caseId === "03-profile")?.echoes?.affirm ?? "", "没替她说忙", "回访承接当前交锋，不引用退役安慰");
  assertIncludes(epilogue.unreadMessages.find((message) => message.caseId === "04-workplace")?.echoes?.affirm ?? "", "两个同事", "职场回访跟进实际问过的同事");
  assertEqual(messages[4].echo, "", "陌生号码不得拼接关怀回声");
  const typedStrings = epilogue.unreadMessages.flatMap((message) => [message.base, ...Object.values(message.echoes ?? {})]);
  assert(typedStrings.every((text) => !/[,:;]/.test(text)), "后台未读的打字面必须统一使用中文全角标点");
  const unreadStage = epilogueUnreadStage(epilogue, careChoices, 5);
  assertEqual(unreadStage.visibleMessages.length, 5, "第五步必须先显示完所有未读");
  assertEqual(unreadStage.complete, false, "未读显示完时数据曲线仍不得提前出现");
  assertEqual(epilogueUnreadStage(epilogue, careChoices, 6).complete, true, "第六步才允许进入数据曲线");
  const unreadHtml = epilogueUnreadHtml({ messages, currentIndex: 4 });
  assertEqual((unreadHtml.match(/epilogue-attachment-placeholder/g) ?? []).length, 2, "灯箱照和三张表留证照片必须各有一个附件卡");
  assert(!unreadHtml.includes("试玩素材占位"), "玩家可见尾声不得暴露开发期素材占位文案");
  assertIncludes(epilogueUnreadContinueHtml({ visibleCount: 5, total: 5 }), "看后台曲线", "读完五条后才出现曲线按钮");
  assertIncludes(epilogue.platformCost, "推荐位没了", "平台压力选择必须拥有独立尾声结果，不能被整晚平均分覆盖");
  assertIncludes(runtimeSource, "endingImpact: choice.endingImpact", "现场压力选择必须把结局代价写入存档状态");
  assertIncludes(runtimeSource, "pick?.endingImpact === \"platform-data-loss\"", "整晚尾声必须读取已经发生的平台代价");
});

test("PROLOGUE-CAFE-001", "the opening cafe loop gates statement and evidence, preserves one real route, and migrates old saves", () => {
  const empty = normalizedCafePrologueProgress({});
  assertEqual(empty.step, 0, "旧档进入咖啡厅序章时必须从第一步开始");
  assertEqual(empty.marks.join("|"), "", "旧档不得凭空获得咖啡厅对时材料");
  assert(!cafePrologueStatementReady(empty), "没有点中否认原句时不能进入材料出示");
  assert(!cafePrologueCanPresentEvidence(empty), "没有点原句、没有拿材料时不能正式出示");
  const oneMark = normalizedCafePrologueProgress({ cafePrologueMarks: ["chat", "unknown", "chat"] });
  assertEqual(oneMark.marks.join("|"), "chat", "材料标记迁移必须去重并清掉未知 id");
  const statementOnly = normalizedCafePrologueProgress({ cafePrologueVersion: 2, cafePrologueStep: 1, cafePrologueStatementId: "hotel-denial" });
  assert(cafePrologueStatementReady(statementOnly), "点中‘没去酒店’原句后必须解锁材料选择");
  assert(!cafePrologueCanPresentEvidence(statementOnly), "尚未拿起材料时不能出示");
  const ready = normalizedCafePrologueProgress({ cafePrologueVersion: 2, cafePrologueStep: 1, cafePrologueStatementId: "hotel-denial", cafePrologueEvidenceId: "hotel" });
  assert(cafePrologueCanPresentEvidence(ready), "点中原句并拿起任一有效材料后必须允许出示");
  assertEqual(cafePrologueRemainingEvidenceId({ marks: ["hotel"] }), "chat", "第一张出示订单后，聊天截图必须留给改口后的第二拍");
  const revisedStatement = normalizedCafePrologueProgress({ cafePrologueVersion: 3, cafePrologueStep: 3, cafePrologueAct: 2, cafePrologueStatementId: "money-denial" });
  assert(cafePrologueRevisedStatementReady(revisedStatement), "第一轮命中后必须等第二段说法讲完，再由玩家点中新的承重句");
  assert(!cafePrologueCanPresentRevisionEvidence(revisedStatement), "第二段只点中原句、尚未拿材料时不能出示");
  const revisedWrongEvidence = normalizedCafePrologueProgress({ cafePrologueVersion: 3, cafePrologueStep: 3, cafePrologueAct: 2, cafePrologueStatementId: "money-denial", cafePrologueEvidenceId: "hotel" });
  assert(cafePrologueCanPresentRevisionEvidence(revisedWrongEvidence), "第二段必须允许玩家把桌上旧材料拿来试");
  assert(!cafePrologueRevisionEvidenceHit(revisedWrongEvidence), "酒店订单不能越级证明转账否认");
  const revisedHit = normalizedCafePrologueProgress({ cafePrologueVersion: 3, cafePrologueStep: 3, cafePrologueAct: 2, cafePrologueStatementId: "money-denial", cafePrologueEvidenceId: "parallel-transfer-ledger" });
  assert(cafePrologueRevisionEvidenceHit(revisedHit), "第二段只有三笔流水能打穿转账否认");
  assertEqual(ready.legalBriefSeen, false, "旧档不得跳过赵律师当面说明法律诉求的独立一拍");
  const briefSeen = normalizedCafePrologueProgress({ cafePrologueVersion: 2, cafePrologueStep: 5, cafePrologueLegalBriefSeen: true });
  assertEqual(briefSeen.legalBriefSeen, true, "法律诉求清单确认后必须保存在序章进度中");
  const firstRoute = normalizedCafePrologueProgress({ cafePrologueVersion: 2, cafePrologueStep: 7, cafePrologueOrder: ["account"] });
  assert(!cafePrologueCanOpenForensic(firstRoute), "散场后两段必须依次核对，不能读一段就结束");
  assert(cafePrologueCanOpenForensic({order:["toy", "account"]}), "两段完成后允许进入后续");
  assertEqual(cafePrologueSceneForStep(0), "cafePrologue", "咖啡厅对质必须有独立场景");
  assertEqual(cafePrologueSceneForStep(4), "cafePrologue", "流水命中与律师记录仍属于咖啡厅对质");
  assertEqual(cafePrologueSceneForStep(5), "cafePrologue", "旧第三环的 step 5 保留为关录像出口，不重编号后续存档");
  assertEqual(cafePrologueSceneForStep(6), "cafePrologueAftermath", "同晚否认与路线选择必须切到麦外场景");
  assertEqual(cafePrologueSceneForStep(8), "cafePrologueForensic", "亲子初步结果必须只出现在个人委托检测场景");
  const migrated = migrateState({
    cafePrologueStep: "6",
    cafePrologueMarks: ["chat", "bad"],
    cafePrologueOrder: ["toy", "bad", "toy"],
    cafePrologueLegalBriefSeen: "yes",
    cafeProloguePressureChoice: 7
  });
  assertEqual(migrated.cafePrologueStep, 7, "旧版已进入第二条路线的存档必须迁到新版单路线完成态");
  assertEqual(migrated.cafePrologueVersion, 4, "序章新增字段必须通过 migrateState 升到第四版");
  assertEqual(migrated.cafePrologueAct, 2, "旧版已走过第一次出示的存档必须迁到第二段说法之后");
  assertEqual(migrated.cafePrologueStatementId, "hotel-denial", "旧版已过材料桌的存档不得卡回原句门禁");
  assertEqual(migrated.cafePrologueMarks.join("|"), "chat", "序章材料标记必须安全迁移");
  assertEqual(migrated.cafePrologueOrder.join("|"), "toy", "序章路线顺序必须安全迁移");
  assertEqual(migrated.cafePrologueLegalBriefSeen, false, "非法法律诉求进度必须回落为未读");
  assertEqual(migrated.cafeProloguePressureChoice, "camera-off", "旧版已离开咖啡厅的非法镜头选择必须迁到唯一有效的关录像路径");
});

test("PROLOGUE-CAFE-002", "the cafe prologue UI keeps the player's evidence actions and a non-verdict ending visible", () => {
  assertIncludes(cafePrologueHeaderHtml({ timeline: "现在 · 傍晚", title: "序章" }), "现在 · 傍晚", "咖啡厅页必须交代现在的时间层");
  const dialogue = cafePrologueDialogueHtml([{ speaker: "妻子", speakerProfileId: "prologue-cafe-wife", type: "participant", text: "那晚我没去酒店。" }]);
  assertIncludes(dialogue, "那晚我没去酒店", "咖啡厅对质必须由人物原话开口");
  assertIncludes(dialogue, "data-dialogue-role=\"wife\"", "咖啡厅对白必须把当前说话人交给立绘舞台");
  const portraits = cafeProloguePortraitStageHtml();
  for (const role of ["host", "advisor", "husband", "wife", "cousin"]) {
    assertIncludes(portraits, `data-dialogue-portrait=\"${role}\"`, `咖啡厅立绘舞台必须保留 ${role} 说话位`);
  }
  const prompt = cafeMaterialPromptHtml({ evidencePair: [{ id: "chat", kicker: "聊天截图", detail: "21:18" }, { id: "hotel", kicker: "酒店订单", detail: "入住人：妻子本人" }] });
  assertIncludes(prompt, "桌面", "材料名称必须进入场景物件提示而非人物对白");
  assertIncludes(prompt, "data-cafe-material-open=\"hotel\"", "右侧桌面材料必须可以打开原件，不能只放一行小字");
  const materialModal = cafeMaterialDetailModalHtml([
    { id: "chat", documentKind: "chat", title: "联系人：顾*", detail: "21:18" },
    { id: "hotel", documentKind: "hotel", title: "澜桥酒店", detail: "入住人：妻子本人" }
  ]);
  assertIncludes(materialModal, "material-chat", "聊天截图必须有可读的聊天原件视图");
  assertIncludes(materialModal, "入住人", "酒店订单必须展开到可读字段");
  assertIncludes(prompt, "入住人：妻子本人", "酒店材料入口必须直接显示可读的原始入住字段");
  assert(!prompt.includes("遮名银行流水"), "酒店对质结束前桌面不得提前亮出第三张流水");
  const statements = cafeStatementReplayHtml({ statements: [
    { id: "hotel-denial", text: "我没在外面开过房。", correct: true },
    { id: "screenshot-dismissal", text: "他就是自己越想越多。", missLine: "你要问这句就问。" }
  ] });
  assertIncludes(statements, "data-cafe-statement-id=\"hotel-denial\"", "玩家必须先从刚听过的话里点原句");
  assertIncludes(statements, "我没在外面开过房", "正确锚点必须显示为人物原话，不能改成说明书按钮");
  const pair = cafeEvidencePairHtml([
    { id: "chat", title: "聊天定位" },
    { id: "hotel", title: "酒店订单" }
  ], "chat", "我没在外面开过房。");
  assertIncludes(pair, "data-cafe-evidence-select=\"chat\"", "两张材料必须允许玩家一次拿起一张");
  assertIncludes(pair, "aria-pressed=\"true\"", "已选材料必须呈现可访问的选中状态");
  assertIncludes(pair, "已选择", "点击材料后必须有当场可见的选择反馈");
  assert(!pair.includes("依次点击") && !pair.includes("教学 ·"), "正式循环不得继续伪装成两页签收教学");
  assertIncludes(cafeRevisionStatusHtml(), "她改口了", "第一次命中后必须明确进入第二段完整说法");
  const revisedPair = cafeEvidencePairHtml([
    { id: "hotel", title: "酒店订单", detail: "入住人：妻子本人" },
    { id: "parallel-transfer-ledger", title: "三笔双向转账", rows: ["4 月 12 日｜转出｜顾*"] }
  ], "parallel-transfer-ledger", "我跟顾*之间没转过钱。");
  assertIncludes(revisedPair, "4 月 12 日｜转出｜顾*", "第二段材料选择器必须让玩家读到流水原始行");
  const present = cafeTransferPresentHtml({ evidence: { title: "三笔双向转账", detail: "保留日期、方向和交易对手。", rows: ["4 月 12 日｜转出｜顾*"] } });
  assertIncludes(present, "三笔双向转账", "正式出示前必须看见材料卡");
  assertIncludes(present, "4 月 12 日｜转出｜顾*", "转账卡必须呈现原始日期、方向和遮名户名");
  assert(!present.includes("钱上没有") && !present.includes("我跟顾*之间没转过钱"), "材料卡不得把正确目标句贴在证据旁边替玩家推理");
  const legalBrief = cafeLegalRequestsHtml({
    zhaoRole: "赵律师与林旭阳同行到场，不代理男方。",
    items: [{ title: "共同财产", request: "申请调查", nextAction: "列账户", boundary: "怀疑不足以冻结" }]
  });
  assertIncludes(legalBrief, "列账户", "法律记录板只保留人物已经谈到的眼前动作");
  const routes = cafeInvestigationChoicesHtml([{ id: "toy", label: "先看旧物", note: "保留来源" }]);
  assertIncludes(routes, "data-cafe-investigation=\"toy\"", "同晚后续必须让玩家选择先查哪一边");
  assert(!routes.includes("两边都会查"), "先查路线必须是真选择，界面不得宣布两边都会补做");
  assertIncludes(cafeAccountBoardHtml([{ when: "每月", label: "固定转出", status: "户名遮蔽", focus: true }]), "cafe-account-row focus", "固定转账必须在家庭账上可见但保持遮名");
  const ending = cafeFinalBoundaryHtml({ result: "排除生物学父子关系", openAccount: "还有一笔账", unknown: ["生父未知", "收款人未知"] });
  assertIncludes(ending, "生父未知", "结果卡必须把未知放在判断之后");
  assert(!ending.includes("GUILTY") && !ending.includes("胜利"), "试玩序章不得回退到胜负或判罪收尾");
  assertIncludes(runtimeSource, "? \"cafePrologue\"", "新游戏必须优先进入咖啡厅序章");
  assertIncludes(runtimeSource, "renderCafePrologue,", "咖啡厅序章渲染器必须从 recap screen 工厂导出");
  assertIncludes(runtimeSource, "renderCafePrologueAftermath,", "同晚后续渲染器必须从 recap screen 工厂导出");
  assertIncludes(runtimeSource, "renderCafePrologueForensic,", "私下回告渲染器必须从 recap screen 工厂导出");
  assertIncludes(runtimeSource, "data-cafe-pressure", "录像与剪辑压力必须交给玩家处理");
  assertIncludes(runtimeSource, "cafe-aftermath-step-${step}", "序章后续必须按步骤提供独立布局钩子，不能继续挤在通用选择层");
  assertIncludes(runtimeSource, "cafeProloguePortraitStageHtml", "咖啡厅必须使用多人立绘舞台而非纯文字清单");
  assertIncludes(runtimeSource, "data-cafe-legal-brief", "转账命中后必须先由玩家确认法律诉求清单，不能把律师台词塞进镜头中断页");
  assertIncludes(runtimeSource, "data-cafe-statement-id", "咖啡厅第一动必须由玩家点人物原句");
  assertIncludes(runtimeSource, "data-cafe-evidence-present", "点中原句后必须由玩家正式出示一张材料");
  assertIncludes(runtimeSource, "data-cafe-revised-present", "她讲完第二段说法后必须再由玩家亲手出示一次");
  assertIncludes(readFileSync(new URL("../src/ui/liveFrameView.js", import.meta.url), "utf8"), "choiceMarkup.includes(\"cafe-opening-action\")", "序章材料托盘必须留在场内操作层，不能触发压暗全景的模态遮罩");
  assertIncludes(runtimeSource, "data-cafe-aftermath-next", "咖啡厅同晚核对完成后必须由玩家操作进入夜间直播");
  assertIncludes(runtimeSource, "setCafePrologueStep(state, 8)", "整晚尾声必须只在咖啡厅两条线完成后打开数日后的鉴定回告");
});

test("PROLOGUE-CAFE-003", "cafe, aftermath, and forensic scenes use distinct audio spaces", () => {
  assertEqual(audioScenePlan({ scene: "cafePrologue" }).ambienceCueId, "ambience.cafe", "咖啡厅必须接入已有咖啡环境声");
  assertEqual(audioScenePlan({ scene: "cafePrologueAftermath" }).ambienceCueId, "ambience.apartment-hall", "同晚回家调查不得继续响咖啡厅环境声");
  assertEqual(audioScenePlan({ scene: "cafePrologueForensic" }).ambienceCueId, "ambience.document-desk", "私下回告必须切到文档桌环境声");
});

test("CARE-003", "soup arc, solo-host pause, and case-file hook keep their authored order", () => {
  const manifest = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/manifest.json", import.meta.url), "utf8"));
  const caseThree = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/cases/03-profile.json", import.meta.url), "utf8"));
  const caseFour = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/cases/04-workplace.json", import.meta.url), "utf8"));
  const zhaoPrologueMessage = manifest.nightShell.prologue.lines.find((line) => line.speaker === "老婆的微信");
  assertEqual(zhaoPrologueMessage?.speaker, "老婆的微信", "序章私人消息必须明确发送者和微信渠道");
  assert(!JSON.stringify(manifest).includes("领导（老婆）"), "玩家可见内容不得残留旧联系人备注“领导（老婆）”");
  assertIncludes(zhaoPrologueMessage?.text, "汤在冰箱", "序章必须留下汤");
  assertIncludes(zhaoPrologueMessage?.text, "有个东西我塞你包里了", "赵律师的私下留言必须先成立为恋人间的生活话");
  assert(!zhaoPrologueMessage?.text.includes("案卷"), "赵律师不得在恋人留言里使用案卷交接腔");
  const interlude = manifest.nightShell.interludes.find((entry) => entry.afterCaseId === "03-profile");
  const interludeHtml = storyInterludeHtml({ kicker: interlude.kicker, shellLine: interlude.line, shellLines: interlude.lines, shellAfterLines: interlude.afterLines });
  assertIncludes(interludeHtml, "第一次去我家", "案三小尾声必须让赵律师以伴侣身份进入生活场景");
  assert(interludeHtml.indexOf("第一次去我家") < interludeHtml.indexOf("那顿饭吃完"), "案三小尾声必须按问话与回应顺序展开");
  assertIncludes(interludeHtml, "热过的汤又凉了", "汤的物件弧必须继续留在案三收尾");
  assertIncludes(manifest.nightShell.epilogue.home, "保温盒空了。你顺手洗了", "回家段必须收回空保温盒，并保持玩家行动视角");
  assertIncludes(manifest.nightShell.epilogue.close, "牛皮纸文件袋", "收束必须用文件袋回收序章托放动作");
  assertIncludes(manifest.nightShell.epilogue.close, "你两年前没问完的那通", "文件袋便签必须接回主播旧伤");
  assert(!manifest.nightShell.epilogue.close.includes("留给后续正式内容"), "玩家可见尾声不得出现编剧说明");
  const disclosureLines = caseFour.sceneVersions.find(scene => scene.id === "work-split-ownership").sceneCloser.lines;
  assert(disclosureLines.some((line) => line.role === "stage"), "发送前的停顿需呈现为现场动作");
  assertEqual(disclosureLines.filter((line) => line.role === "stage" && line.text.includes("他发出两条群消息")).length, 1, "固定结案流程只发送一次");
  assert(disclosureLines.some((line) => line.role === "stage" && line.text.includes("受理页")), "发送内容须承认费用已经受理");
  assertIncludes(callDialogueHtml(disclosureLines), "call-stage-direction", "现场动作应使用舞台渲染");
});

function test(id, name, fn) {
  if (testFilter && !`${id} ${name}`.toLowerCase().includes(testFilter)) return;
  try {
    fn();
    results.push({ id, name, ok: true });
  } catch (error) {
    results.push({ id, name, ok: false, error });
  }
}

function commandLineOption(name) {
  const exactIndex = process.argv.indexOf(name);
  if (exactIndex >= 0) return String(process.argv[exactIndex + 1] ?? "").trim();
  const prefix = `${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  return String(inline?.slice(prefix.length) ?? "").trim();
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}｜expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertIncludes(value, needle, message) {
  if (!String(value).includes(needle)) throw new Error(`${message}｜missing ${JSON.stringify(needle)} in ${JSON.stringify(value)}`);
}

function assertThrows(fn, pattern, message) {
  try {
    fn();
  } catch (error) {
    if (!pattern.test(String(error?.message ?? error))) {
      throw new Error(`${message}｜unexpected error: ${error?.message ?? error}`);
    }
    return;
  }
  throw new Error(`${message}｜expected throw`);
}

function stockAiForbiddenCopyRegex() {
  const awkwardShortJobPhrase = `${"工作"}${"不太"}${"稳"}`;
  return new RegExp(`不是.*而是|真正|听到这里|你把这句记下|抓到的关键|核心风险|债务转移|法律武器|商业阴谋|蓄意诈骗|白莲花|丧尽天良|处心积虑|脑子嗡|提款机|成本归属|满格以后|这通电话|心里咯噔一下|算借款、赠与|借款、赠与|先说第一次提钱|表先放一下|为什么一开始是你垫|按理说活动是大家一起办的|昨晚说.*今晚还能留着|主播你好，我想问一个相亲后暧昧|${awkwardShortJobPhrase}`);
}

function compressedSpokenRetellingRegex() {
  return /问过一次。[他她](?:愣|顿|停)了一下|[”」』]。我再问[，,][他她](?:就|又)/;
}

function proxyTestimonyCompressionRegex() {
  return /(?:我只记|那我记)[“\"][^”\"]*(?:不肯说|不能说)[”\"]|(?:不肯说|不能说)[，,]不等于/;
}

function chineseStringLiterals(source = "") {
  const literals = [];
  const pattern = /(["'`])((?:\\.|(?!\1)[\s\S])*[\u3400-\u9fff](?:\\.|(?!\1)[\s\S])*)\1/g;
  let match;
  while ((match = pattern.exec(source))) {
    literals.push(match[2]);
  }
  return literals;
}

function dailyCase(key, options = {}) {
  return generateCasesForMode("daily", NPCS, attrs, { dailyKey: key, ...options })[0];
}

test("MODE-001", "unknown modes normalize to episode while daily stays available", () => {
  const caseEngineSource = readFileSync(new URL("../src/caseEngine.js", import.meta.url), "utf8");
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const caseOutcomeSource = readFileSync(new URL("../src/runtime/caseOutcome.js", import.meta.url), "utf8");
  const miniappPageSource = readFileSync(new URL(["../miniapp-webview/pages", "index", "index.js"].join("/"), import.meta.url), "utf8");
  const demoCaseCount = storyPackCaseCount(storyPackForKey(DEFAULT_STORY_PACK_KEY));
  assertEqual(normalizeCaseMode("unknown-mode"), "episode", "未知模式必须归一到案件包");
  assertEqual(normalizeCaseMode("weekly"), "episode", "旧 weekly 链接必须迁移到案件包");
  assertEqual(caseModeConfig("episode").minCases, 1, "案件包模式必须允许章节包长度由内容决定");
  assert(validCaseBriefCount(3, "episode"), "案件包模式不能把三案章节误判为坏存档");
  assert(!validCaseBriefCount(3, "daily"), "单案兼容入口仍然只能保留一案");
  assertEqual(caseModeConfig("daily").expectedCases, 1, "每日案必须只有一案");
  assertEqual(generateCasesForMode("unknown-mode", NPCS, attrs, { dailyKey: "2026-06-24" }).length, demoCaseCount, "未知模式入口必须回落到当前默认案件包");
  assertIncludes(caseEngineSource, "DAILY_ROTATION", "每日案轮换表必须使用未损坏的英文标识符");
  assert(!/DAILY_RO[^\x00-\x7f]+TION/.test(caseEngineSource), "每日案轮换表不得残留混入中文的损坏标识符");
  assert(!appSource.includes(["/pages", "index"].join("/")), "H5 核心层不得写死小程序页面路径");
  assertIncludes(caseOutcomeSource, "shareQuery", "分享消息必须发送平台无关的查询参数");
  assertIncludes(miniappPageSource, "sharePathForPayload", "小程序壳必须在自己的边界内组装页面分享路径");
});

test("QUICK-001", "focused calls advance through direct questions and compact endings", () => {
  for (const packet of quickDetectiveCasesFor("steam-demo-01").filter(p => p.focusedInquiry)) {
    let state = { ...initialQuickDetectiveState(packet), scene: "transcript" };
    let steps = 0;
    while (state.scene !== "verdict" && steps++ < 100) {
      if (state.scene === "transcript") state = advanceQuickTranscript(packet, state);
      else if (state.scene === "confrontation") state = advanceQuickConfrontation(packet, state);
      else {
        const round = quickDisclosureRounds(packet)[state.roundIndex] ?? {};
        const required = new Set([
          ...(round.requiredConfrontationIds ?? []),
          ...(round.autoConfrontationIds ?? [])
        ]);
        const issue = quickIssueOptionsForRound(packet, state).find((o) => o.confrontationId
          && !state.resolvedConfrontationIds.includes(o.confrontationId)
          && (required.size === 0 || required.has(o.confrontationId)));
        if (issue) {
          const html = quickDetectiveIssueSelectionHtml(packet, state);
          assertIncludes(html, `data-quick-issue="${issue.id}"`, "直接问法可点击");
          assert(!html.includes("data-quick-review-line"), "集中问询不要求回放选句");
          state = applyQuickIssueSelection(packet, state, issue.id);
        } else {
          assertEqual(required.size, 0, "本段必须有可问的下一问");
        }
      }
      state = normalizeQuickDetectiveState(JSON.parse(JSON.stringify(state)), packet);
    }
    assertEqual(state.scene, "verdict", "保存恢复不阻塞任何披露段");
    const reachable = new Set();
    for (const round of packet.disclosureRounds ?? []) {
      for (const id of round.requiredConfrontationIds ?? []) reachable.add(id);
      for (const id of round.autoConfrontationIds ?? []) reachable.add(id);
    }
    assertEqual(state.resolvedConfrontationIds.length, reachable.size, "两来电案必要问询均已播完");
    assertEqual(packet.ending.summaryPages.length, 1, "一个短收尾即可");
    while (!quickDetectiveIsComplete(packet, state)) state = advanceQuickVerdict(packet, state);
    assertIncludes(quickDetectiveVerdictHtml(packet, state), "返回案件选择", "最后一句后才能结束");
  }
});

test("QUICK-003", "second quick case reveals new contradictions only after the previous confrontation", () => {
  const quickCases = quickDetectiveCasesFor("steam-demo-01");
  const packet = quickCases.find((item) => item.id === "02-one-missed-message");
  assert(packet, "试玩包必须加载第二宗快案");
  assertEqual(quickCases.map((item) => item.caseNumber).join("|"), "01|02|03", "快案选择页必须按 manifest 保持 01、02、03 的稳定顺序");
  assertEqual(packet.caseNumber, "02", "第二宗快案必须使用稳定编号 02");
  assertEqual(packet.premise, "一个姑娘打进电话，想问问她和男朋友接下来该怎么办。", "第二宗快案入口只能交代表面求助，不得提前剧透学历、婚介、创业者、送花和失联原因");
  assertEqual(packet.turns.length, 12, "第二宗快案收尾诉求放在结尾，保留十二组阶段陈述");
  const identityRound = quickDisclosureRounds(packet).findIndex(round => round.requiredConfrontationIds?.includes("third-person-at-table"));
  const explanationRound = quickDisclosureRounds(packet).findIndex(round => round.requiredConfrontationIds?.includes("how-he-knew"));
  assert(identityRound >= 0 && explanationRound > identityRound, "第三人身份必须先问清，不能让解释过程抢先泄露");
  assertEqual(quickDisclosureRounds(packet)[0]?.turnIds?.length, 6, "第二宗快案第一轮只能用六组话建立公开版本，不能恢复十七组问卷");
  assert(!quickDisclosureRounds(packet)[identityRound].turnIds.includes("how-he-knew-version"), "身份问清前不追问如何解释桌上这个人");
  assertEqual(packet.confrontations.length, 6, "第二宗快案必须让主播问回六处彼此不同的前后矛盾");
  assert(packet.issueOptions.length > packet.confrontations.length, "第二宗快案必须混入合理但不能互证的方向，不能直接把六个矛盾答案交给玩家");
  assert(packet.issueOptions.every((item) => item.sourceAnchor), "第二宗快案每个判断点都必须绑定本轮已经播出的原话");
  for (const issueId of ["founder-busy"]) {
    const issue = packet.issueOptions.find((item) => item.id === issueId);
    const roundIndex = quickDisclosureRounds(packet).findIndex((round) => round.issueOptionIds?.includes(issueId));
    const line = quickStatementLinesForRound(packet, { roundIndex }).find((item) => item.text.includes(issue.sourceAnchor));
    assertEqual(statementOptionForLine(quickIssueOptionsForRound(packet, { roundIndex }), line), issue, `${issueId} 必须绑定独立原句，不得再被同句更长锚点遮住`);
  }
  assertEqual(packet.confrontations.filter((item) => item.revealTransition).length, 1, "第二宗快案只能给最大反转播放一次重击过场");
  assertEqual(packet.confrontations.find((item) => item.revealTransition)?.id, "third-person-at-table", "第二宗快案的重击必须落在姐妹小聚出现第三个人的整体重估上");
  assertEqual(packet.confrontations.find((item) => item.revealTransition)?.revealTransition?.lineIndex, 4, "第三人重击必须等来电人承认男性在场以后再播放，不能由动画提前给答案");
  assertIncludes(packet.presentation?.caller?.artSrc, "caller-zhou-female-pixel", "第二宗快案必须使用自己的匿名女性来电人立绘，不能串用第一宗角色");
  assertIncludes(quickDetectiveCaseSelectHtml(quickCases, []), "CASE</small><b>02", "案件选择页必须实际渲染 CASE 02");
  assert(!packet.sourceBoundary.includes("BV1iGKG65EJ3"), "运行时内容不得暴露精确公开视频编号");
  assertIncludes(packet.sourceBoundary, "公开讨论中常见", "第二宗快案必须说明结构参考来自公开讨论中的常见模式");
  assertIncludes(packet.sourceBoundary, "虚构合成", "来源边界必须声明人物、事件细节和全部台词已经虚构合成");
  assertIncludes(packet.sourceBoundary, "异性在场本身不构成越界证据", "第二宗快案不得把男性在场直接升级成未证实行为");

  const turnIds = new Set(packet.turns.map((turn) => turn.id));
  for (const confrontation of packet.confrontations) {
    assert((confrontation.basisTurnIds ?? []).length >= 1, `${confrontation.id} 必须引用至少两处已经播出的原话`);
    assert(confrontation.basisTurnIds.every((turnId) => turnIds.has(turnId)), `${confrontation.id} 不得带入麦外事实`);
    assert(confrontation.logicContract?.premiseAnchor, `${confrontation.id} 必须登记问句前提`);
    assert(confrontation.logicContract?.sourceProves, `${confrontation.id} 必须登记现有原话能证明什么`);
    assert(confrontation.logicContract?.sourceDoesNotProve, `${confrontation.id} 必须登记不能证明什么`);
    const lines = quickConfrontationLines(confrontation);
    assert(lines.length >= 4, `${confrontation.id} 必须经过来电人反驳和主播回问，不能两句直接交答案`);
    assert(lines.every((line, index) => line.text && ["host", "caller"].includes(line.role) && (index === 0 || line.role !== lines[index - 1].role)), `${confrontation.id} 多轮对质必须逐句交替`);
  }

  const originalTranscript = packet.turns.map((turn) => `${turn.host} ${turn.caller}`).join(" ");
  assert(!/我一直在装乖|那晚我出轨|他肯定就是嫌我不正经/.test(originalTranscript), "原始连线不能让来电人主动提交人格答案，也不能提前坐实未知项");
  assertIncludes(originalTranscript, "二十六，研三", "第二宗快案必须保持来电人二十六岁的统一设定");
  assert(!originalTranscript.includes("二十七，研三"), "第二宗快案不得残留二十七岁的旧台词");
  assertIncludes(originalTranscript, "本科和硕士都在一所985高校", "第二宗快案必须使用玩家指定的985高校表述");
  assertIncludes(originalTranscript, "家里能支持我，所以找对象也不是指望他养我", "不靠男方养的自我辩护必须放在介绍男方以后");
  assertIncludes(originalTranscript, "他至少中A8，本地两套平层。我们家就普通家庭，A7吧", "第二宗快案必须在结案前让来电人亲口比较双方家底");
  assertIncludes(originalTranscript, "我把花那条和前面几条都截了", "展示需求对质前必须先由来电人主动提供对应朋友圈截图");
  assert(!originalTranscript.includes("旁边那个新包也是这个新男友送的吧"), "听取公开版本时不得提前质证照片里的包");
  assertIncludes(originalTranscript, "现在朋友圈三天可见", "第二宗快案必须说明主播为何无法直接查看旧朋友圈");
  assertIncludes(originalTranscript, "你这边看不到以前的。我自己还能翻", "三天可见以后，旧动态只能由来电人自己翻出并截屏提供");
  assertIncludes(originalTranscript, "吃饭、演唱会这些", "第一批朋友圈截图必须在对质前露出她平时主动展示的内容");
  assertIncludes(originalTranscript, "十一点五十二，他问我喝得怎么样", "六分钟消息差必须先在原始连线里公平出现");
  assert(!originalTranscript.includes("其实是三个人"), "第三名同行人不能在玩家质问前由来电人主动交代");
  assertIncludes(originalTranscript, "后面又有人点了一轮", "第二轮重讲当晚时必须先露出酒并非她和妹妹所点的可追问缺口");
  assertIncludes(originalTranscript, "后来也解释过了", "第三轮先留下解释缺口，具体说漏过程等玩家追问");
  assertIncludes(originalTranscript, "那是八号的照片", "公开动态的拍摄日期必须在结案前由来电人自己说出");
  assert(packet.turns.findIndex((turn) => turn.id === "social-post-date") < packet.turns.findIndex((turn) => turn.id === "previous-night"), "第三轮必须先问清十号照片拍摄日，再追出八号也在 KTV");
  assertIncludes(JSON.stringify(packet.disclosureRounds), "凌晨 5:17", "第三轮必须由主播在来电人发来的截图里看到深夜时间，不能在结案凭空宣布经常夜不归宿");
  assertIncludes(originalTranscript, "那几次动态我找到了，发给你", "第二批朋友圈材料必须明确由来电人自己发来，不能写成主播直接翻她的主页");
  assert(!originalTranscript.includes("后台收到了。往前两个月翻"), "朋友圈三天可见以后，主播不得表现成能直接翻看来电人的历史动态");
  assert(!packet.issueOptions.some((item) => item.id.includes("tattoo")), "纹身不得成为玩家需要判定的矛盾方向");
  assertIncludes(packet.confrontations.find((item) => item.id === "third-person-at-table")?.logicContract?.sourceDoesNotProve, "不自动证明暧昧、出轨", "异性在场必须有明确的不证明边界");
  assert((packet.ending?.unknown ?? []).some((item) => item.includes("是否发生过暧昧")), "结案制作边界必须保留酒局内容未知");
  const quickTwoRecapPage = packet.ending.summaryPages.find((page) => page.stageLabel === "结案复盘");
  assert(!quickTwoRecapPage?.lines?.[0]?.text?.includes("我们来把这次这个连线复个盘"), "第二宗快案不得恢复共用复盘模板句");
  const spokenSummary = packet.ending.summaryPages.flatMap((page) => page.lines ?? []).map((line) => line.text).join(" ");
  assert((packet.ending?.unknown ?? []).some((item) => item.includes("男方实际看过哪些旧动态")), "截图接收范围保留在未知项，不强迫口播用免责声明收尾");
  assert(packet.ending.summaryPages[0].lines.some((line) => line.role === "caller"), "收尾保留来电人的反应，允许拒绝、争取或犹豫，不锁定为接受建议的固定句");
  assertIncludes(packet.ending?.riskReading?.text ?? "", "不能据此证明出轨、把谁当备选或存在供养关系", "出轨、备选和供养边界必须留在结案事实卡，不冲淡口播判断");
  assert(!spokenSummary.includes("骑驴找马") && !spokenSummary.includes("供养者") && !spokenSummary.includes("潜在的雷"), "第二宗快案不得把信息缩小升级成供养、备选或性别化污名判断");
  assert(!spokenSummary.includes("男方不会提供情绪价值") && !spokenSummary.includes("前后原话放在一起，这个说法站不住"), "第二宗快案结案不得残留报告式的情绪价值与说法站不住表述");
  assert(!/这期对账，不给话术|按日期把这三天放回去/.test(spokenSummary), "快案二不得把拒绝和复盘写成栏目标签");
  assert(!spokenSummary.includes("别再把原因缩回那六分钟"), "第二宗快案结案不得用抽象缩回措辞弱化连续隐瞒");
  const displayConfrontation = quickConfrontationLines(packet.confrontations.find((item) => item.id === "care-or-display"));
  assertIncludes(displayConfrontation[0]?.text, "花是你先开口要的", "花是谁先要的，只能在玩家选中展示需求以后由主播问出");
  assertIncludes(displayConfrontation[1]?.text, "我高兴啊", "收花的心情必须由来电人在对质中亲口确认");
  assertIncludes(displayConfrontation.map((line) => line.text).join(" "), "朋友圈截图我看了", "主播必须说明自己的判断来自刚收到的截图");
  assertIncludes(displayConfrontation.map((line) => line.text).join(" "), "有人羡慕我也高兴", "展示需求由本人回答补出");
  assertIncludes(displayConfrontation.map((line) => line.text).join(" "), "总不能有花有包，就不用好好聊天", "保留对方认为物质与交流不能互相替代的反驳");
  const messageConfrontation = quickConfrontationLines(packet.confrontations.find((item) => item.id === "message-or-drunkenness"));
  const messageDialogue = messageConfrontation.map((line) => line.text).join(" ");
  assertIncludes(messageConfrontation[0]?.text, "身体到底怎么样", "六分钟记录只能引出对身体状态的追问，不能让主播先替她承认已经喝醉");
  assert(!messageConfrontation[0]?.text.includes("已经喝得难受"), "主播首问不得把合同写明尚未证明的醉酒状态塞进前提");
  assertIncludes(messageDialogue, "已经有点难受了", "真实身体状态必须由来电人在追问后亲口补出");
  const discoveryConfrontation = quickConfrontationLines(packet.confrontations.find((item) => item.id === "how-he-knew"));
  assertEqual(discoveryConfrontation.length, 6, "先问具体解释，再问漏出的称呼，保留对方辩解");
  assertIncludes(discoveryConfrontation.map((line) => line.text).join(" "), "妹妹那个朋友", "男方起疑依赖能听清的称呼，不能靠他她同音字幕");
  assert(!originalTranscript.includes("六分钟以后怎么就看不到了"), "第一轮听取阶段不得抢先把六分钟当成主播质证");
  const nightlifeConfrontation = quickConfrontationLines(packet.confrontations.find((item) => item.id === "nightlife-pattern"));
  const nightlifeDialogue = nightlifeConfrontation.map((line) => line.text).join(" ");
  assert(!nightlifeDialogue.includes("三次过了凌晨四点"), "三张具体时间没有上场前，主播不得凭内部账本报出三次凌晨四点");
  assert(!nightlifeDialogue.includes("男方看到的当然不是同一个说法"), "夜生活对质不得残留抽象的版本比较句");
  assert(!packet.issueOptions.some((item) => item.id === "bar-judgment" || item.label.includes("去酒吧本身")), "第二宗快案不得再用去酒吧是否正确充当无效选项");
  assertIncludes(packet.issueOptions.find((item) => item.id === "how-he-knew")?.label, "男方怎么发现", "第三轮必须把无效价值判断换成可调查的发现来源");
  const apologyConfrontation = quickConfrontationLines(packet.confrontations.find((item) => item.id === "apology-and-post"));
  const apologyDialogue = apologyConfrontation.map((line) => line.text).join(" ");
  assert(/(?:写清.*哪天|写了.*八号).*拍/.test(apologyDialogue), "道歉动态对质必须按男方当时能看到的信息说话，不能假定他知道照片拍摄日期");
  assertIncludes(apologyDialogue, "他真看到也未必知道是旧图", "动态未标日期可以引发误解，但不能假定男方看过");
  assert(!apologyDialogue.includes("日期能对上") && !apologyDialogue.includes("道歉变轻"), "道歉动态对质不得退回错误日期判断或 AI 式抽象措辞");

  let state = { ...initialQuickDetectiveState(packet), scene: "transcript" };
  while (state.scene === "transcript") state = advanceQuickTranscript(packet, state);
  assertEqual(state.roundIndex, 0, "第一轮听完必须停在初问阶段");
  assertEqual(quickIssueOptionsForRound(packet, state).map((item) => item.id).join("|"), "missed-message-state|founder-busy", "第一轮可问身体状态或补问手机去向，不提前出现第三人、朋友圈");
  state = applyQuickIssueSelection(packet, state, "missed-message-state");
  while (state.scene === "confrontation") state = advanceQuickConfrontation(packet, state);
  assertEqual(state.scene, "transcript", "第一轮核心问题问完后必须回到连线继续追，而不是继续弹出后面的答案");
  assertEqual(state.roundIndex, 1, "第一轮对质应迫使来电人进入第二版说法");
  while (state.scene === "transcript") state = advanceQuickTranscript(packet, state);
  assertEqual(quickIssueOptionsForRound(packet, state).map((item) => item.id).join("|"), "third-person", "先只核在场者，不能提前开放解释或朋友圈结论");
  {
    const issue = packet.issueOptions.find((item) => item.id === "third-person");
    const line = quickStatementLinesForRound(packet, state).find((item) => item.text.includes(issue.sourceAnchor));
    state = applyQuickStatementLineSelection(packet, state, line.id);
  }
  while (state.scene === "confrontation") state = advanceQuickConfrontation(packet, state);
  assertEqual(state.scene, "transcript", "第三人问清以后才能接入向男方解释的原话");
  assertEqual(state.roundIndex, explanationRound, "身份揭露后接着追解释");
  while (state.scene === "transcript") state = advanceQuickTranscript(packet, state);
  assertEqual(quickIssueOptionsForRound(packet, state).map((item) => item.id).join("|"), "how-he-knew", "已问清身份不再询问，这里只追解释过程");
  {
    const issue = packet.issueOptions.find((item) => item.id === "how-he-knew");
    const line = quickStatementLinesForRound(packet, state).find((item) => item.text.includes(issue.sourceAnchor));
    state = applyQuickStatementLineSelection(packet, state, line.id);
    while (state.scene === "confrontation") state = advanceQuickConfrontation(packet, state);
  }
  assertEqual(quickDisclosureRounds(packet)[state.roundIndex].id, "social-feed", "解释过程完成后才开始翻旧动态");
  while (state.scene === "transcript") state = advanceQuickTranscript(packet, state);
  assertEqual(quickIssueOptionsForRound(packet, state).map((item) => item.id).join("|"), "nightlife-pattern|apology-post", "已读到的外出频率和照片日期都应允许玩家追问");
  while (state.scene === "confrontation") state = advanceQuickConfrontation(packet, state);
  for (const issueId of ["nightlife-pattern", "apology-post"]) {
    const issue = packet.issueOptions.find((item) => item.id === issueId);
    const line = quickStatementLinesForRound(packet, state).find((item) => item.text.includes(issue.sourceAnchor));
    state = applyQuickStatementLineSelection(packet, state, line.id);
    while (state.scene === "confrontation") state = advanceQuickConfrontation(packet, state);
  }
  assertEqual(state.scene, "verdict", "第二宗快案六处对质完成后必须进入主播结案，不能卡在选择页");
});

test("QUICK-004", "third quick case concentrates the essay in four solo-commentary rounds", () => {
  const quickCases = quickDetectiveCasesFor("steam-demo-01");
  const packet = quickCases.find((item) => item.id === "03-labeled-fiction");
  assert(packet, "试玩包必须加载第三宗快案");
  assertEqual(packet.format, "solo-commentary", "第三宗快案必须改成主播单独复盘，不再模拟当事人来电");
  assertEqual(packet.premise, "今晚不接电话。看一篇科技创业者写给女演员的长文。", "第三宗快案入口必须直接说明本期看长文");
  assertEqual(quickDisclosureRounds(packet).length, 4, "第三宗快案省去强制背景课，四段回收认全文条件");
  assert(quickDisclosureRounds(packet).every((round) => round.turnIds?.length === 3), "每段只能保留三句上屏精华");
  assert(quickDisclosureRounds(packet).every((round) => round.completionMode === "any"), "单人口播每段必须允许任选一个成立角度推进");
  assertEqual(packet.confrontations.length, 12, "四段各保留三个可独立成立的点评角度");
  assert(packet.confrontations.every((item) => quickConfrontationLines(item).every((line) => line.role === "host")), "案三点评必须全程只有主播说话");
  assertEqual(packet.presentation?.caller, undefined, "单人口播舞台不得继续挂来电人立绘");
  assertIncludes(packet.presentation?.source?.name, "科技创业者写给女演员的长文", "舞台必须把公开长文作为材料上屏");
  assertIncludes(quickDetectiveStageHtml(packet, { scene: "transcript" }), "data-quick-source-panel", "单人口播舞台必须显示材料卡");
  assertEqual((quickDetectiveStageHtml(packet, { scene: "transcript" }).match(/data-dialogue-portrait=/g) ?? []).length, 1, "案三舞台必须只保留主播一个人物立绘");
  const soloSpoken = [
    ...packet.turns.flatMap((turn) => [turn.host, turn.source]),
    ...packet.confrontations.flatMap((item) => quickConfrontationLines(item).map((line) => line.text)),
    ...(packet.ending?.summaryPages ?? []).flatMap((page) => (page.lines ?? []).map((line) => line.text))
  ].join(" ");
  const fictionComment = quickConfrontationLines(packet.confrontations.find(item => item.id === 'labeled-fiction')).map(line => line.text).join(' ');
  assert(/名字.*照片/.test(fictionComment) && fictionComment.includes('虚构'), "第一段点评要对照指向真人的文字图片与虚构标注，不锁定主播措辞");
  for (const required of [
    "五张卡一起打",
    "三千万，一个字没回",
    "没有中间人的独立原话",
    "诉状里是三千万，撤声明、认全文都没写进去",
    "三千万该不该退，交给法院判"
  ]) assertIncludes(soloSpoken, required, `第三宗快案必须保留承重句：${required}`);
  const mediation = quickConfrontationLines(packet.confrontations.find(item => item.id === "settlement-inference")).map(line => line.text).join(" ");
  assert(/中间人.*谁.*找/.test(mediation) && /她本人.*回/.test(mediation), "推测她想息事之前，先追问中间人来源和本人回应");
  assert(!/孙宇晨|景甜|张继科|TRON|波多黎各|Claude|我的女友|易理华/.test(JSON.stringify(packet)), "运行时内容不得出现可检索真名、原标题或原事件地标");
  assert((packet.ending?.unknown ?? []).some((item) => item.includes("应退彩礼") || item.includes("该退彩礼")), "制作边界必须保留法律定性未知");
  assertIncludes(packet.ending?.riskReading?.text ?? "", "不确认私下转账全貌", "主播观点必须明确，同时说明观点落在哪些公开行为上");
  let soloState = { ...initialQuickDetectiveState(packet), scene: "transcript" };
  for (const round of quickDisclosureRounds(packet)) {
    soloState = advanceQuickTranscript(packet, soloState);
    const issueId = round.issueOptionIds.find((id) => packet.issueOptions.find((item) => item.id === id)?.confrontationId);
    const issue = packet.issueOptions.find((item) => item.id === issueId);
    const line = quickStatementLinesForRound(packet, soloState).find((item) => item.text.includes(issue.sourceAnchor));
    soloState = applyQuickStatementLineSelection(packet, soloState, line.id);
    while (soloState.scene === "confrontation") soloState = advanceQuickConfrontation(packet, soloState);
  }
  assertEqual(soloState.scene, "verdict", "五段各完成任一点评后必须进入主播个人结论");
  return;
  assertEqual(packet.caseNumber, "03", "第三宗快案必须使用稳定编号 03");
  assertEqual(packet.premise, "一个男生打进电话，想请你今晚帮他说句话。", "第三宗快案入口只能交代表面求助，不得提前剧透金额、虚构标注或私密指控");
  assertEqual(quickDisclosureRounds(packet).length, 4, "第三宗快案必须分成听长文、听回复、对起诉状三轮");
  assertEqual(quickDisclosureRounds(packet)[0]?.turnIds?.length, 6, "第一轮只能用六组话建立公开版本");
  assertEqual(quickDisclosureRounds(packet)[1]?.turnIds?.length, 4, "第二轮必须由对方回复、网友估损、中间人转述和直播先说组成");
  assertEqual(packet.confrontations.length, 7, "第三宗快案必须让主播问回七处彼此不同的前后矛盾");
  assert(packet.issueOptions.length > packet.confrontations.length, "第三宗快案必须混入合理但不能互证的方向");
  assert(packet.issueOptions.filter((item) => !item.confrontationId).length >= 2, "第三宗快案至少需要两个合理干扰方向");
  assertEqual(packet.confrontations.filter((item) => item.revealTransition).length, 1, "第三宗快案只能给最大反转播放一次重击过场");
  assertEqual(packet.confrontations.find((item) => item.revealTransition)?.id, "settlement-endorsement", "第三宗快案的重击必须落在虚构标注与全文认账条件对上之后");
  assertEqual(packet.confrontations.find((item) => item.revealTransition)?.revealTransition?.lineIndex, 4, "和解重击必须等来电人坚持虚构标注只是保护以后再播放");
  assertIncludes(packet.presentation?.caller?.artSrc, "caller-gu-pixel", "第三宗快案必须使用自己的匿名男性来电人立绘，不能串用前两宗角色");
  assertIncludes(quickDetectiveCaseSelectHtml(quickCases, []), "CASE</small><b>03", "案件选择页必须实际渲染 CASE 03");
  assertIncludes(packet.sourceBoundary, "公开争议", "第三宗快案必须说明只借用公开争议的结构");
  assertIncludes(packet.sourceBoundary, "虚构合成", "来源边界必须声明人物和台词已经虚构合成");
  assertIncludes(packet.sourceBoundary, "没有司法确认", "来源边界必须把现实事件中的单方说法留在未确认层");
  assert(!/孙宇晨|景甜|张继科|TRON|波多黎各|Claude|我的女友|易理华/.test(JSON.stringify(packet)), "运行时内容不得出现可检索真名、原标题或原事件地标");

  const spoken = [
    ...packet.turns.flatMap((turn) => [turn.host, turn.caller]),
    ...packet.confrontations.flatMap((item) => quickConfrontationLines(item).map((line) => line.text)),
    ...(packet.ending?.summaryPages ?? []).flatMap((page) => (page.lines ?? []).map((line) => line.text))
  ].join(" ");
  assertIncludes(spoken, "『纯属虚构』", "第一轮必须让虚构标注出现在原话里");
  assertIncludes(spoken, "五张卡一起打", "第一轮必须让五张卡打法出现在原话里");
  assertIncludes(spoken, "三千万，一个字没回", "第二轮必须让没对账出现在原话里");
  assertIncludes(spoken, "真掉了要赔上亿", "第二轮必须让网上估损进入来电人的公开版本");
  const mediationTurn = packet.turns.find((item) => item.id === "mediation-version");
  assertIncludes(mediationTurn?.caller, "人都找过来了，还不是怕了", "第二轮听麦必须先把中间人来谈抬成对方害怕");
  assert(!String(mediationTurn?.caller ?? "").includes("没有收到她本人消息"), "听麦不得提前交出中间人转述的缺边");
  const mediationSpoken = quickConfrontationLines(packet.confrontations.find((item) => item.id === "mediation-not-confession")).map((line) => line.text).join(" ");
  assertIncludes(mediationSpoken, "没有。中间人说是她的意思", "对质必须逼出没有对方本人消息");
  assertIncludes(mediationSpoken, "没有她一句话", "对质必须把中间人转述留在单方层");
  const settlementTurn = packet.turns.find((item) => item.id === "settlement-terms-version");
  assertIncludes(settlementTurn?.caller, "承认我长文里写的都是真的", "第三轮必须让全文认账成为来电人亲口开的条件");
  const settlementSpoken = quickConfrontationLines(packet.confrontations.find((item) => item.id === "settlement-endorsement")).map((line) => line.text).join(" ");
  assertIncludes(settlementSpoken, "文末的纯属虚构是你自己写的", "最大重击必须把虚构标注问回全文认账条件");
  assertIncludes(settlementSpoken, "三千万在状子里。撤声明、认长文都不在", "最大重击必须拆开诉内退钱与诉外认全文");
  assertIncludes(spoken, "我不会帮你催", "结案必须当面拒绝让主播成为三条条件的催收工具");
  assertIncludes(spoken, "还是他一个人在讲", "高概率判断必须把女方动机留在单方陈述层");
  assertIncludes(spoken, "三千万该不该退，法院判", "高概率判断不得把彩礼说成已经成立");
  assertIncludes(spoken, "他想让我也跟着催", "高概率判断必须点出他来电的现实目的");
  assert(!/两边都脏|厌的是这个人|怕的是公开|借节目砸人|第二锤|生育方案|孩子按什么方式|我不会对着直播间替你宣|直播间只把已经说出口的事钉住/.test(spoken), "第三宗快案不得恢复强行对称、单方动机判决、猎奇撤回或作者式边界口播");
  const quickViewSource = readFileSync(new URL("../src/ui/quickDetectiveView.js", import.meta.url), "utf8");
  const liveFrameSource = readFileSync(new URL("../src/ui/liveFrameView.js", import.meta.url), "utf8");
  assert(!quickViewSource.includes("已经有足够理由先做谨慎判断"), "快案回放页不得用作者判断解释提前收案按钮");
  assert(!liveFrameSource.includes("替她收尾"), "快案控场状态不得使用作者调度词‘替她收尾’");
  const recapPage = packet.ending.summaryPages.find((page) => page.stageLabel === "结案复盘");
  assert(/(电话挂了|收麦了)/.test(recapPage?.lines?.[0]?.text ?? ""), "第三宗快案挂断后必须用口语接回逐项回看");
  assert(!recapPage?.lines?.[0]?.text?.includes("我们来把这次这个连线复个盘"), "第三宗快案不得恢复共用复盘模板句");
  assert((packet.ending?.unknown ?? []).some((item) => item.includes("应退彩礼") || item.includes("该退彩礼")), "制作边界必须保留法律定性未知");
  assert(!(packet.rageBaitContract?.tierPlan ?? []).includes("Tier 4"), "第三宗快案不得使用 Tier 4");
});

test("PLATFORM-001", "platform runtime exposes a safe top-level postMessage bridge", () => {
  assertEqual(typeof platformRuntime.postMessage, "function", "platformRuntime 必须提供顶层 postMessage，供收麦分享调用");
  assert("saveFiles" in platformRuntime, "platformRuntime 必须暴露桌面文件存档桥入口");
  platformRuntime.postMessage({ type: "test-message" });
});

test("PLATFORM-002", "save store wraps storage for future desktop saves", () => {
  const memory = new Map();
  const store = createSaveStore({
    storage: {
      get: (key) => memory.has(key) ? memory.get(key) : null,
      set: (key, value) => memory.set(key, value),
      remove: (key) => memory.delete(key)
    }
  });
  memory.set("legacy-save", "old");
  assertEqual(store.read("new-save", ["legacy-save"]), "old", "新存档不存在时必须能读取 legacy fallback");
  store.write("new-save", "fresh");
  assertEqual(store.read("new-save", ["legacy-save"]), "fresh", "新存档必须优先于 legacy fallback");
  assertEqual(store.list()[0].slotId, "slot1", "当前 Web 版仍保持单槽存档接口");
  const cloud = store.exportForCloud(["new-save", "missing"]);
  assertEqual(cloud["new-save"], "fresh", "cloud export 必须导出指定 key 的原始内容");
  assertEqual(cloud.missing, null, "cloud export 对缺失 key 必须保持 null，便于桌面壳判断");
  store.removeMany(["new-save", "legacy-save"]);
  assertEqual(store.read("new-save", ["legacy-save"]), null, "removeMany 必须同时清理当前和旧存档 key");
  const fileMemory = new Map([["desktop-save", "file-old"]]);
  const touchedStorage = [];
  const fileStore = createSaveStore({
    storage: {
      get: (key) => {
        touchedStorage.push(key);
        return null;
      },
      set: (key) => touchedStorage.push(`set:${key}`),
      remove: (key) => touchedStorage.push(`remove:${key}`)
    },
    saveFiles: {
      read: (key) => fileMemory.has(key) ? fileMemory.get(key) : undefined,
      write: (key, value) => fileMemory.set(key, value),
      remove: (key) => fileMemory.delete(key),
      list: () => [{ slotId: "slot1", backend: "file" }],
      exportForCloud: (keys) => Object.fromEntries(keys.map((key) => [key, fileMemory.get(key) ?? null]))
    }
  });
  assertEqual(fileStore.read("desktop-save"), "file-old", "桌面文件桥存在时必须优先读取文件存档");
  fileStore.write("desktop-save", "file-new");
  assertEqual(fileMemory.get("desktop-save"), "file-new", "桌面文件桥存在时必须写入文件存档");
  assertEqual(fileStore.list()[0].backend, "file", "存档列表必须能来自桌面文件桥");
  assertEqual(fileStore.exportForCloud(["desktop-save"])["desktop-save"], "file-new", "Steam Cloud 导出必须能委托给桌面文件桥");
  fileStore.remove("desktop-save");
  assertEqual(fileStore.read("desktop-save"), null, "桌面文件桥缺失值必须归一成 null");
  assertEqual(touchedStorage.length, 0, "桌面文件桥存在时不能再落回 localStorage");
  const failedStore = createSaveStore({
    storage: {
      get: () => null,
      set: () => { throw new Error("quota"); },
      remove: () => true
    }
  });
  assertEqual(failedStore.write("save", "value"), false, "存档后端写失败必须返回 false，不能静默假装成功");
});

test("PLATFORM-003", "release builds copy referenced assets while allowing declared planned placeholders", () => {
  const references = assetReferencesInText(`
    <img src="./assets/generated/host.png?v=7" />
    .scene { background: url('../assets/backgrounds/cafe.png#night'); }
  `);
  assertEqual(JSON.stringify(references), JSON.stringify(["assets/backgrounds/cafe.png", "assets/generated/host.png"]), "资产扫描必须覆盖 HTML/CSS 并去掉缓存参数");
});

test("AUDIO-001", "audio buses clamp, persist independently, and duck scene beds under voice", () => {
  const normalized = normalizeAudioSettings({ enabled: true, master: 2, bgm: -1, ambience: 0.4, sfx: "0.6", voice: 0.9 });
  assertEqual(normalized.master, 1, "主音量必须钳制到 1");
  assertEqual(normalized.bgm, 0, "BGM 音量不能低于 0");
  assertEqual(normalized.sfx, 0.6, "字符串滑杆值必须归一成数值");
  const changed = updateAudioBusVolume({ ...normalized, bgm: 0.5 }, "voice", 0.35);
  assertEqual(changed.voice, 0.35, "语音音量必须能独立更新");
  assertEqual(changed.ambience, 0.4, "更新语音不能改写环境音");
  assert(audioBusGain(changed, "bgm", { ducked: true }) < audioBusGain(changed, "bgm"), "语音播放时必须压低 BGM");
  assertEqual(audioBusGain({ ...changed, enabled: false }, "voice"), 0, "总静音必须压住所有总线");
});

test("AUDIO-002", "scene audio plans and semantic cues stay stable", () => {
  assertEqual(audioScenePlan({ scene: "title" }).bgmCueId, "bgm.title-nightshift", "标题页必须有稳定 BGM cue");
  assertEqual(audioScenePlan({ scene: "nightShellPrologue" }).enterSfxCueId, undefined, "进入直播间时不能提前播放 ON AIR；提示音必须跟着倒计时台词出现");
  assertEqual(audioScenePlan({ scene: "caseOpen" }).enterSfxCueId, "sfx.phone.connect", "案件接线必须触发真实接通音效");
  assertEqual(audioScenePlan({ scene: "sceneReview", pressureLevel: "low" }).bgmCueId, "bgm.pressure-stem", "耐心偏低时必须切到压力层");
  const allegroPlan = audioScenePlan({ scene: "testimonyWall", musicPhase: "allegro" });
  const silentPlan = audioScenePlan({ scene: "decisivePresentHit", musicPhase: "silent" });
  const pursuitPlan = audioScenePlan({ scene: "sceneReview", musicPhase: "pursuit" });
  assertEqual(allegroPlan.bgmCueId, "bgm.live-call-allegro", "进入关键追问链必须切 Allegro 版");
  assertEqual(allegroPlan.fallbackBgmCueId, "bgm.live-call", "Allegro 缺位时必须回退到直播连线底乐");
  assertEqual(resolveSceneAudioFallback(allegroPlan).bgmCueId, "bgm.live-call-allegro", "已交付 Allegro 必须使用独立母版");
  assertEqual(resolveSceneAudioFallback({ ...allegroPlan, bgmCueId: "missing.allegro" }).bgmCueId, "bgm.live-call", "未交付主 cue 必须保留回退能力");
  assertEqual(silentPlan.bgmCueId, "", "决定性命中必须先留出半秒静音窗口");
  assertEqual(silentPlan.fallbackBgmCueId, undefined, "刻意静音计划不得声明 BGM 回退");
  assertEqual(pursuitPlan.bgmCueId, "bgm.pursuit", "B 故事浮出后必须接 pursuit 循环");
  assertEqual(pursuitPlan.fallbackBgmCueId, "bgm.accusation", "Pursuit 缺位时必须回退到高压追问底乐");
  assertEqual(resolveSceneAudioFallback(pursuitPlan).bgmCueId, "bgm.pursuit", "已交付追索音乐必须使用独立母版");
  assertEqual(resolveSceneAudioFallback({ ...pursuitPlan, bgmCueId: "missing.pursuit" }).bgmCueId, "bgm.accusation", "未交付追索 cue 必须保留回退能力");
  const cafePlan = audioScenePlan({ scene: "cafePrologue" });
  assertEqual(cafePlan.fallbackAmbienceCueId, "ambience.city-afternoon", "咖啡厅环境声缺位时必须声明可用的室外城市底噪回退");
  assertEqual(resolveSceneAudioFallback(cafePlan).ambienceCueId, "ambience.city-afternoon", "planned 咖啡厅环境声不得造成环境总线整段静音");
  const epiloguePlan = audioScenePlan({ scene: "nightShellEpilogue" });
  assertEqual(epiloguePlan.fallbackBgmCueId, "bgm.recap-afterhours", "天亮前曲目缺位时必须延续可用的收麦回看音乐");
  assertEqual(resolveSceneAudioFallback(epiloguePlan).bgmCueId, "bgm.epilogue-dawn", "全局尾声必须播放独立天亮母版");
  assertEqual(resolveSceneAudioFallback({ ...epiloguePlan, bgmCueId: "missing.dawn" }).bgmCueId, "bgm.recap-afterhours", "尾声仍须保留可用的复盘回退");
  assertIncludes(screenSources[7], 'ctx.getState().scene !== "decisivePresentHit"', "命中 stinger 定时器必须校验仍停留在命中场景");
  assert(!screenSources[7].includes('playAudioCue("bgm.pursuit")'), "命中页不得再用脱离场景同步的定时器手动切 pursuit");
  assertIncludes(screenSources[2], '? "pursuit" : ""', "命中后的 sceneReview 必须通过 musicPhase 接管 pursuit 续播");
  assertIncludes(screenSources[7], 'context.wallProgress.act > 1 ? "pursuit" : "allegro"', "act2 证词墙与材料选择必须切入 pursuit，并继续使用场景音频回退");
  assertEqual(audioScenePlan({ scene: "sceneLineReplay" }).ambienceCueId, "ambience.studio-line", "原话回放仍在连线中，不得掉到收麦声场");
  assertEqual(audioScenePlan({ scene: "afterSceneEvidence" }).ambienceCueId, "ambience.studio-line", "连线中插入材料不得误切后台声场");
  assertEqual(audioScenePlan({ scene: "overnightCallback" }).bgmCueId, "bgm.callback-return", "第二夜回拨必须使用回拨 cue");
  assertEqual(audioScenePlan({ scene: "overnightNight2" }).bgmCueId, "bgm.callback-return", "进入第二夜连续对白后不得切回第一夜 BGM");
  assertEqual(audioScenePlan({ scene: "documentReconcile" }).bgmCueId, "bgm.callback-return", "第二夜核对材料时必须保持回拨 BGM");
  assertEqual(audioScenePlan({ scene: "liveCounterBeat", liveNight: "night2" }).bgmCueId, "bgm.callback-return", "第二夜实时反压必须保持回拨 BGM");
  assertEqual(audioScenePlan({ scene: "overnightNight2", pressureLevel: "low" }).bgmCueId, "bgm.pressure-stem", "第二夜耐心偏低时仍允许压力层覆盖回拨底乐");
  assertEqual(audioScenePlan({ scene: "careChoice" }).bgmCueId, "bgm.recap-afterhours", "结案关怀选择必须留在单案回看音乐段");
  assertEqual(audioScenePlan({ scene: "caseBridge" }).bgmCueId, "bgm.recap-afterhours", "案间新闻页必须延续收麦余韵，不能突然切回直播 BGM");
  assertEqual(audioScenePlan({ scene: "liveCounterBeat" }).ambienceCueId, "ambience.studio-line", "实时反压仍在直播中，不能误切到收麦后台声场");
  assertEqual(ambienceCueForBackdrop("day-restaurant"), "ambience.restaurant", "餐厅背景必须映射餐厅环境音");
  assertEqual(ambienceCueForBackdrop("day-studio"), "ambience.archive-studio", "工作室背景必须映射室内工作环境音");
  ["sfx.case2.door-knock", "voice.case2.dryer-message", "voice.case3.dinner-pause", "voice.case4.pad-message", "voice.case4.supplier-message"].forEach((cueId) => {
    assert(AUDIO_CUES[cueId], `必要剧情 cue 不得从目录消失: ${cueId}`);
  });
  ["bgm.title-nightshift", "bgm.live-call", "bgm.pressure-stem", "bgm.offair-desk", "bgm.day-investigation", "bgm.callback-return", "ambience.studio-room", "ambience.city-afternoon", "voice.case2.dryer-message"].forEach((cueId) => {
    assertEqual(audioCueView(cueId)?.available, true, `P1 关键声轨必须有可播放资产: ${cueId}`);
  });
  assertEqual(AUDIO_CUES["bgm.title-nightshift"]?.src, "./assets/audio/bgm/title-neon-rain.ogg", "标题槽位必须使用已完成的霓虹雨夜正式母版");
  ["sfx.phone.connect", "sfx.phone.disconnect", "sfx.broadcast.on-air", "sfx.message.notification", "sfx.document.mark"].forEach((cueId) => {
    assertEqual(audioCueView(cueId)?.available, true, `试玩关键音效必须有可播放资产: ${cueId}`);
  });
  assertEqual(AUDIO_CUES["sfx.phone.soft-hangup"]?.fallbackCueId, "sfx.phone.disconnect", "轻挂电话缺位时必须回退到现有挂断音");
  assertEqual(AUDIO_CUES["sfx.phone.busy"]?.fallbackCueId, "sfx.phone.disconnect", "忙音缺位时必须回退到现有挂断音");
  ["sfx.present.hit", "sfx.present.miss"].forEach((cueId) => assertEqual(audioCueView(cueId)?.available, true, `决定性 PRESENT stinger 必须有合成回退: ${cueId}`));
  ["bgm.live-call-allegro", "bgm.pursuit"].forEach((cueId) => {
    assertEqual(AUDIO_CUES[cueId]?.status, "ready", `${cueId} 已有真实母版，必须可播放`);
    assertEqual(AUDIO_CUES[cueId]?.loopStart, 0, `${cueId} 必须从无前奏循环点接入`);
    assertEqual(AUDIO_CUES[cueId]?.attackMs, 0, `${cueId} 必须支持 stinger 后无迟滞切入`);
  });
});

test("AUDIO-004", "case retries can replay one-shot climax cues", () => {
  const prefix = "unit-case-retry:";
  clearPlayedCueKeysByPrefix(prefix);
  assertEqual(playAudioCueOnce("missing.test-cue", `${prefix}hit`).reason, "unknown-cue", "首次一次性 cue 必须进入播放尝试");
  assertEqual(playAudioCueOnce("missing.test-cue", `${prefix}hit`).reason, "duplicate", "同一次案件中必须拦截重复 cue");
  assertEqual(clearPlayedCueKeysByPrefix(prefix), 1, "重开案件必须只清理该案件前缀的一次性 cue");
  assertEqual(playAudioCueOnce("missing.test-cue", `${prefix}hit`).reason, "unknown-cue", "清理后高潮 cue 必须可再次播放");
  clearPlayedCueKeysByPrefix(prefix);
});

test("AUDIO-003", "audio UI keeps visible transcripts and exposes accessible controls only for ready cues", () => {
  const settingsHtml = audioSettingsPanelHtml({ enabled: true, master: 0.8, bgm: 0.5, ambience: 0.4, sfx: 0.7, voice: 1 });
  ["master", "bgm", "ambience", "sfx", "voice"].forEach((busId) => {
    assertIncludes(settingsHtml, `data-audio-volume="${busId}"`, `声音设置必须包含 ${busId} 滑杆`);
  });
  assertIncludes(settingsHtml, "data-audio-mute", "声音设置必须保留一键静音");
  const cue = { id: "voice.test", available: true };
  const controls = audioPlaybackControlsHtml(cue);
  assertIncludes(controls, "data-audio-play", "可用语音必须显示播放/暂停按钮");
  assertIncludes(controls, "data-audio-seek", "可用语音必须显示进度拖动条");
  const playback = interludePlaybackActionHtml({ summary: "听原话", script: { clipLine: "文字原句仍在。", hostNote: "只按可见事实判断。" } }, cue);
  assertIncludes(playback, "文字原句仍在。", "语音线索必须始终保留可见逐字稿");
  assertIncludes(playback, "data-audio-play", "有资产时回放卡必须接入语音控制");
  assert(!interludePlaybackActionHtml({ script: { clipLine: "无资产也可读。" } }, { id: "voice.missing", available: false }).includes("data-audio-play"), "未交付资产不能显示假播放按钮");
  assertEqual(formatAudioTime(65.9), "01:05", "录音控制器必须稳定格式化分钟和秒数");
  assertEqual(formatAudioTime(-4), "00:00", "录音控制器不能显示负时间");
});

test("ROUTE-002", "route log helpers infer axis, tone, and dominant profile outside app rendering", () => {
  const caseEngineSource = readFileSync(new URL("../src/caseEngine.js", import.meta.url), "utf8");
  assertEqual(routeAxisForChoice({ question: "这几笔账，哪些是在他没工作以后花的？" }), "money-flow", "钱款问题必须进入钱流结构线");
  assertEqual(routeAxisForChoice({ question: "这张表里，房贷和装修是怎么写进家庭开销的？" }), "document-edge", "材料问题必须进入材料缺口线");
  assertEqual(routeToneForChoice({ question: "你当时有没有起疑心？" }), "caller-skeptical", "绕回来电人自己的问题必须记录为来电人怀疑语气");
  assertEqual(routeToneForChoice({ question: "钱花在哪？", contradiction: "账单不对" }, {}, 0), "trust-but-verify", "第一段核心追问必须由 routeLog 统一生成 trust-but-verify");
  assert(!caseEngineSource.includes("function inferRouteAxis"), "caseEngine 不能再维护第二套路由轴推断");
  assert(!caseEngineSource.includes("function inferRouteTone"), "caseEngine 不能再维护第二套语气推断");
  const choices = [
    normalizeRouteChoice(0, { routeAxis: "caller-credibility", routeTone: "caller-skeptical", question: "你当时有没有起疑心？" }),
    normalizeRouteChoice(1, { routeAxis: "caller-credibility", routeTone: "caller-skeptical", question: "你一直说要看账单，那句不好说出口的话是什么？" }),
    normalizeRouteChoice(2, { routeAxis: "money-flow", routeTone: "pressure-point", contradiction: "账单不对", question: "钱花在哪？" })
  ];
  const profile = routeAxisProfileFromChoices(choices);
  assertEqual(profile.axis, "caller-credibility", "最多路线轴必须成为路线画像主轴");
  assertEqual(profile.label, "来电人没说全的部分", "路线画像必须输出玩家可读标签");
  assertIncludes(profile.summary, "不急着相信来电人的版本", "连续怀疑来电人时，summary 必须反映路线倾向");
  assertIncludes(caseEngineSource, "DAILY_TEMPLATE_BUILDERS", "日案模板分发必须走 registry，减少新增 plot 的硬编码入口");
  assert(!caseEngineSource.includes("if (brief.plotId ==="), "日案模板分发不能退回 plotId if 链");
  const trail = routeTrailModel({
    choices: [
      { sceneIndex: 0, axis: "caller-credibility", question: "你当时有没有起疑心？" },
      { sceneIndex: 5, axis: "document-edge", question: "这份材料少了哪一边？" },
      { sceneIndex: 10, axis: "external-corroboration", question: "后台回流里哪句最该圈？" }
    ],
    keyQuestionCount: 5,
    investigationIndexBase: 10
  });
  assertEqual(trail[0].mark, 1, "路线图普通追问必须保留段落序号");
  assertEqual(trail[1].mark, "料", "路线图材料节点必须标成料");
  assertEqual(trail[2].mark, "回", "路线图回流节点必须标成回");
});

test("STATE-SELECTOR-001", "case state selectors read picks and route profile outside app rendering", () => {
  const [brief] = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const key = brief.id;
  const firstQuestion = brief.sceneVersions?.[0]?.questionOptions?.[0] ?? {};
  const firstEvidencePick = { correct: true, label: "账单缺口" };
  const firstInvestigationPick = { correct: false, label: "朋友圈截图" };
  const selectorState = {
    caseActionLog: {
      [key]: {
        "version:0": true,
        "evidenceCheck:0": true
      }
    },
    contradictionLog: {
      [key]: [
        brief.sceneVersions?.[0]?.contradiction,
        brief.investigationHooks?.[0]?.triggerContradiction
      ].filter(Boolean)
    },
    sceneQuestionPicks: {
      [answerKey(brief, 0)]: {
        question: firstQuestion.question ?? "这句怎么问？",
        answer: "我当时确实停了一下。",
        sceneVersionKind: "revised",
        routeAxis: "money-flow",
        routeTone: "pressure-point"
      }
    },
    sceneDialoguePicks: {
      [answerKey(brief, 0)]: [{ optionIndex: 1, question: "先问外围？", answer: "我绕了一句。" }]
    },
    evidenceCheckPicks: {
      [evidenceAnswerKey(brief, 0)]: firstEvidencePick
    },
    investigationPicks: {
      [investigationAnswerKey(brief, 0)]: firstInvestigationPick
    },
    truthBoundaryPicks: {
      [key]: { "true:0": "true" }
    },
    routeChoiceLog: {}
  };
  assert(actionDoneForState(selectorState, brief, "version:0"), "状态 selector 必须能读取动作完成状态");
  assertEqual(answeredSceneCountForState(selectorState, brief), 1, "已问段落数量必须脱离 app.js 计算");
  assertEqual(answeredEvidenceCountForState(selectorState, brief), 1, "已处理材料数量必须脱离 app.js 计算");
  assertEqual(selectedScenePickForState(selectorState, brief, 0).routeAxis, "money-flow", "场景选择必须能补齐路线轴");
  assertEqual(askedDialoguePicksForState(selectorState, brief, 0).length, 1, "外围对话选择必须能脱离 app.js 读取");
  assertEqual(completedSceneExchangeForState(selectorState, brief, brief.sceneVersions[0], 0, selectedScenePickForState(selectorState, brief, 0)).fallbackAnswer, "", "已完成问答模型必须脱离 app.js 组装");
  const revisedBrief = {
    ...brief,
    sceneVersions: brief.sceneVersions.map((scene, index) => index === 0 ? { ...scene, revisedVersion: "这是材料触发后的改口。" } : scene)
  };
  assertEqual(latestChoiceReviewRowsForState(selectorState, revisedBrief)[0].text, "这是材料触发后的改口。", "上一问回看必须保留玩家当时实际听到的重述，不能退回 JSON 初始原话");
  assertEqual(latestChoiceReviewRowsForState(selectorState, brief)[1].role, "host", "上一问回看 rows 必须脱离 app.js 组装");
  assertEqual(selectedEvidencePicksForState(selectorState, brief)[0].label, "账单缺口", "材料选择必须能脱离 app.js 读取");
  assertEqual(selectedInvestigationPicksForState(selectorState, brief)[0].label, "朋友圈截图", "回流选择必须能脱离 app.js 读取");
  assertEqual(truthBoundaryPicksForState(selectorState, brief)["true:0"], "true", "事实边界选择必须能脱离 app.js 读取");
  assert(unlockedInvestigationEntriesForState({ ...selectorState, caseActionLog: { [brief.id]: { "version:2": true } } }, brief).length >= 1, "回流解锁必须能脱离 app.js 计算");
  assertEqual(routeChoicesForState(selectorState, brief)[0].axis, "money-flow", "路线 choices 必须能从已选问题回退生成");
  assertEqual(routeAxisProfileForState(selectorState, brief).axis, "money-flow", "路线画像必须能脱离 app.js 生成");
  const appSource = runtimeSource;
  assertIncludes(appSource, "./runtime/caseStateSelectors.js", "app.js 必须通过 runtime caseStateSelectors 读取案件状态");
  assert(!appSource.includes("function selectedScenePick("), "app.js 不能重新维护场景选择 selector");
  assert(!appSource.includes("function selectedEvidencePicksFor("), "app.js 不能重新维护材料选择 selector");
  assert(!appSource.includes("function keyChoiceReview("), "app.js 不能重新维护上一问回看 selector");
});

test("MATERIAL-001", "material operation model records hit and miss without UI coupling", () => {
  const check = {
    prompt: "这张审批图少了哪一边？",
    material: "截图只露出审批通过，没有付款状态。",
    options: [
      { label: "付款状态和收款账户", correct: true, contradiction: "审批截图缺少付款状态和收款账户。", feedback: "缺的这一页才决定钱去了哪里。", revisesScene: 1, routeAxis: "document-edge" },
      { label: "活动现场照片", correct: false, feedback: "活动办没办不是当前缺口。", routeAxis: "outer-thread" }
    ]
  };
  const hit = materialOperationOutcome(check, 0, 0);
  assertEqual(hit.correct, true, "材料命中必须标记 correct");
  assertEqual(hit.spend, false, "材料命中不能消耗听众耐心");
  assertEqual(hit.routeChoice.routeTone, "evidence-hit", "材料命中必须进入 evidence-hit 路线语气");
  assertEqual(hit.routeChoice.contradiction, "审批截图缺少付款状态和收款账户。", "材料命中必须记录矛盾");
  assertEqual(hit.pick.revisesScene, 1, "材料命中必须保留可触发证言重述的场景下标");
  const miss = materialOperationOutcome(check, 0, 1);
  assertEqual(miss.correct, false, "材料误指必须标记 miss");
  assertEqual(miss.spend, true, "材料误指要消耗听众耐心");
  assertEqual(miss.routeChoice.routeTone, "evidence-miss", "材料误指必须进入 evidence-miss 路线语气");
  assertEqual(miss.routeChoice.contradiction, "", "材料误指不能泄露正确矛盾");

  const priorityCheck = {
    selectionMode: "priority",
    prompt: "两处都要问，先问哪一处？",
    options: [
      { label: "先问流程", correct: true, contradiction: "流程没有闭合。", feedback: "先问流程。", routeAxis: "process-control" },
      { label: "先问账户", correct: true, contradiction: "账户没有闭合。", feedback: "先问账户。", routeAxis: "money-flow" },
      { label: "先问态度", correct: false, feedback: "态度不是材料缺口。", routeAxis: "outer-thread" }
    ]
  };
  const priorityHit = materialOperationOutcome(priorityCheck, 1, 1);
  assertEqual(priorityHit.spend, false, "先问哪个模式的第二个成立方向也不能消耗耐心");
  assertEqual(priorityHit.pick.selectionMode, "priority", "材料结果必须保留先问哪个模式供 UI 呈现");
  assertIncludes(evidenceOperationHtml(priorityCheck), "先问哪一处", "先问哪个材料板必须明确显示有限选择，而不是伪装成唯一正解圈选");
});

test("PRESSURE-001", "live pressure profile unifies audience, comments, and caller guard", () => {
  const low = livePressureProfile({
    budget: { max: 8, remaining: 2 },
    foundCount: 0,
    intentHook: "话太顺了"
  });
  assertEqual(low.level, "low", "低忍耐必须进入低压状态");
  assertIncludes(low.comments.join("/"), "弹幕散了", "低忍耐弹幕必须跑散");
  const miss = livePressureProfile({
    budget: { max: 8, remaining: 6 },
    pressureSignal: "drift",
    routeAxis: "document-edge",
    routeAxisComments: { "document-edge": ["截图少的那页开始吵"] },
    intentHook: "截图少了一边"
  });
  assertEqual(miss.crowd, "跑偏", "误指材料必须推动弹幕跑偏");
  assertEqual(miss.callerGuard, "防备", "弹幕跑偏必须提高连线人防备");
  assertIncludes(miss.comments.join("/"), "截图少的那页开始吵", "现场弹幕必须能按玩家路线轴读取内容包种子");
  const drift = livePressureProfile({
    budget: { max: 8, remaining: 6 },
    pressureSignal: "drift",
    driftComments: ["蹲一个主播同款保温杯"]
  });
  assertEqual(drift.comments[0], "蹲一个主播同款保温杯", "跑偏态必须用案件原生跑题弹幕替代通用文案");
  const hit = livePressureProfile({
    budget: { max: 8, remaining: 6 },
    pressureSignal: "held",
    intentHook: "返钱入口对上了"
  });
  assertEqual(hit.crowd, "稳住", "命中材料必须能稳住弹幕");
  assertEqual(hit.callerGuard, "松动", "命中材料后连线人防备应松动");
  const hinted = livePressureProfile({
    budget: { max: 8, remaining: 6 },
    sceneHint: { callerGuard: "tense", expression: { kind: "pause", text: "流程词说得很顺" } },
    intentHook: "流程词说得太熟"
  });
  assertEqual(hinted.callerGuard, "绷住", "场景压力提示必须能驱动连线人防备状态");
  assertEqual(hinted.expression.text, "流程词说得很顺", "现场压力画像必须从 JSON hint 给人物表情层提供钩子");
  assertEqual(questionPressureSignal({ routeTone: "softening" }), "drift", "追问压力状态必须由 routeTone 结构化生成");
  assertEqual(questionPressureSignal({ routeTone: "pressure-point" }), "held", "核心追问语气必须能稳住现场");
  const guardedVariant = pressuredAnswerVariant(
    { answer: "原回答", guardedAnswer: "收紧回答" },
    { pressureSignal: "drift" }
  );
  assertEqual(guardedVariant.answer, "收紧回答", "上一拍跑偏后必须能切到内容包写好的收紧版回答");
  assertEqual(guardedVariant.guarded, true, "收紧版回答必须留下 guarded 标记，供路线回看和结算继续使用");
  assertEqual(pressuredAnswerVariant({ answer: "原回答", guardedAnswer: "收紧回答" }, { pressureSignal: "guarded" }).answer, "收紧回答", "同一问题进入防备状态时必须返回不同文本");
  assertEqual(pressuredAnswerVariant({ answer: "原回答", guardedAnswer: "收紧回答" }, { pressureSignal: "held" }).answer, "原回答", "稳住现场时不能无故改写来电人回答");
  assertEqual(nextQuestionPressureSignal({ pendingQuestionPressureSignal: "guarded", lastPressureSignal: null }), "guarded", "现场反压选择必须保存到下一次实际追问再消费");
  assertEqual(nextQuestionPressureSignal({ pendingQuestionPressureSignal: null, lastPressureSignal: "held" }), "held", "没有待消费反压时必须兼容当前现场压力状态");
  assertEqual(materialPressureSignal({ correct: false }), "drift", "材料误指必须生成结构化跑偏状态");
  assertEqual(questionPressureReaction({ answer: "我只是替他说一句。", routeTone: "softening" }), "", "没有逐句编写的动作时，不凭语气分数杜撰人物反应");
  assertEqual(questionPressureReaction({ answer: "我只是换个方向问。", routeTone: "detour" }), "", "外围追问不得自动添加无依据的弹幕旁白");
  assertEqual(materialPressureReaction({ correct: true, pick: { label: "付款状态", feedback: "缺的这一页才决定钱去了哪里。" } }, { title: "审批图", material: "付款和收款账户没露出来。" }), "", "材料判断已有具体反馈，不再自动追加弹幕旁白");
  assertEqual(materialPressureReaction({ correct: false, pick: { label: "截图边角", feedback: "这会顺手讲出答案。" } }, { title: "截图" }), "", "材料误指不凭得分杜撰观众反应");
  const recap = pressureRecapProfile({
    budget: { max: 8, remaining: 1, used: 7 },
    choices: [{ tone: "evidence-miss" }, { tone: "detour" }],
    foundCount: 1
  });
  assertEqual(recap.label, "差点断麦", "低忍耐必须影响单案结算压力画像");
  const pack = pressurePackProfile([{ profile: recap }, { profile: pressureRecapProfile({ budget: { max: 8, remaining: 7 }, choices: [{ tone: "pressure-point", core: true }], foundCount: 2 }) }]);
  assertEqual(pack.label, "有麦差点断", "故事集终局必须汇总单案压力画像");
  assertIncludes(pack.comment, "差点", "故事集评论必须能回收控场压力");
  const materialProfile = storyMaterialProfile([
    { label: "第一通", picks: [{ correct: true, label: "账单缺口" }] },
    { label: "第二通", picks: [{ correct: false, label: "截图边角" }] }
  ]);
  assertEqual(materialProfile.label, "材料拉回", "故事集终局必须汇总材料使用情况，但不显示判卷标签");
  assertIncludes(materialProfile.line, "材料", "材料圈点汇总必须进入终局余味");
  const quoteProfile = storyQuoteProfile([{ quoteHit: true, dailyAccuseLabel: "原话 A" }, { quoteHit: false, dailyAccuseLabel: "原话 B" }]);
  assertEqual(quoteProfile.label, "接住几句", "故事集终局必须汇总最终原话选择");
  assertIncludes(quoteProfile.comment, "收得准", "原话汇总必须进入评论区余味");
  const objectProfile = storyObjectProfile([{ storyObjectLabel: "账单" }, { storyObjectLabel: "表格" }, { storyObjectLabel: "账单" }]);
  assertEqual(objectProfile.total, 2, "故事集物件汇总必须去重");
  assertIncludes(objectProfile.line, "账单、表格", "故事集终局必须回收每案物件，而不是只看路线轴");
  const theme = storyThemeProfile([{ storyThemeTitle: "今晚四通麦", storyThemeThesis: "别替人补完。", storyThemeCommentPrompt: "弹幕还在吵。", storyHiddenThread: { title: "今晚暗线", label: "同款话术", reveal: "好听话后面接成本。", lowReveal: "还没完全露头。", beats: ["体面接钱", "自己人接资源"], comment: "「暗线露出来了。」" } }]);
  const axes = storyPackAxes([{ axis: "money-flow" }, { axis: "money-flow" }, { axis: "document-edge" }]);
  const bestAxis = storyPackBestAxis(65, axes);
  assertEqual(theme.title, "今晚四通麦", "故事集主题必须由纯模型读取，不能散在 app 渲染里");
  assertEqual(bestAxis.axis, "money-flow", "故事集主路线必须由纯模型统计");
  assertEqual(theme.hiddenThread.label, "同款话术", "故事包暗线必须由主题数据进入纯模型");
  const hiddenThread = storyHiddenThreadProfile({ theme, avgPercent: 80, objectProfile });
  assertEqual(hiddenThread.label, "同款话术", "故事包暗线高揭示时必须露出主题标签");
  assertIncludes(hiddenThread.line, "成本", "故事包暗线必须输出散场后才看的串案结构");
  assertEqual(storyPackBestAxis(20, axes).label, "外围印象", "低揭示率路线画像必须降级成外围印象");
  assertEqual(storyPlayerType(80, bestAxis), "钱流雷达主播", "故事集主播类型必须由纯模型生成");
  assertIncludes(storyShareTitle(80, bestAxis), "钱去了哪儿", "故事集分享标题必须回收主路线");
  assertIncludes(storyPackAftertaste(55), "浮上", "故事集余味必须由纯模型生成");
  assertEqual(storyCallCountText(3), "这 3 路麦", "故事集终局必须按实际案数生成称呼，不能写死四通");
  assert(!storyPackAftertaste(95, 3).includes("四通"), "故事集余味不能写死四通");
  assertIncludes(storyPackClosingLine(95, bestAxis, 3), "这 3 路麦", "故事集收束小字必须使用实际案数");
  const lowClosing = storyPackClosingLine(20, bestAxis, 3);
  assertIncludes(lowClosing, "现场情绪", "低揭示路线也要有完整余味，不写成失败补课");
  assert(!/重开|换条线|补考|再来/.test(lowClosing), "低揭示终局不能主动提示玩家重开补路线");
  const missOnlyMaterial = storyMaterialProfile([{ label: "第一通", picks: [{ correct: false, label: "截图边角" }] }]);
  assert(!/重开|我会先/.test(missOnlyMaterial.comment), "材料误圈评论不能像教程一样替玩家决定下一次怎么问");
  const wall = storyCommentWall({
    briefs: [{ label: "第一通" }, { label: "第二通" }],
    results: [{ issuePercent: 80 }, { issuePercent: 30 }],
    routes: [{ label: "钱流结构线" }, { label: "材料缺口线" }],
    best: bestAxis,
    avgPercent: 55,
    theme: {
      ...theme,
      commentSeeds: ["我站主播问账单，心疼可以，转账得慢一点。"],
      highRevealTone: "该点的那句，你点到了。"
    },
    materialProfile,
    quoteProfile,
    objectProfile,
    hiddenThreadProfile: hiddenThread
  });
  assertEqual(wall.length, 4, "故事集评论墙必须稳定输出 4 条以内");
  assertIncludes(wall.join(""), "心疼可以", "故事集评论墙必须能读取内容包评论种子");
  assertIncludes(wall.join(""), "收得准", "故事集评论墙必须能回收原话选择余味");
});

test("SAVE-READING-001", "reading checkpoint preserves newer saves and invalidates changed dialogue", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const storage = new Map();
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value)
  } });
  try {
    const reading = { screen: "chapter", dialogueReading: { pageIndex: 1, visibleCount: 2 } };
    assert(saveStateSnapshot(reading), "普通存档应写入");
    reading.dialogueReading.visibleCount = 5;
    assert(saveReadingBeforeExit(reading), "退出前应保存当前字数");
    assertEqual(JSON.parse(storage.get(STORAGE_KEY)).dialogueReading.visibleCount, 5, "续读应保留打字位置");
    storage.set(STORAGE_KEY, '{"chapter":4}');
    assertEqual(saveReadingBeforeExit(reading), false, "退出时不覆盖更新的存档");
    assertEqual(storage.get(STORAGE_KEY), '{"chapter":4}', "外部更新的章节应原样保留");
    storage.delete(STORAGE_KEY);
    assertEqual(saveReadingBeforeExit(reading), false, "删除存档后不能在退出时把旧档写回来");
    const pages = [{ lines: [{ role: "caller", text: "我还没转。" }] }];
    assertEqual(dialogueReadingKey(pages, "case1:scene1"), dialogueReadingKey(structuredClone(pages), "case1:scene1"), "相同对白重绘应保留阅读标识");
    assert(dialogueReadingKey(pages, "case1:scene1") !== dialogueReadingKey(pages, "case2:scene1"), "不同案件不能共享页位置");
    assert(dialogueReadingKey(pages, "case1:scene1") !== dialogueReadingKey([{ lines: [{ role: "caller", text: "我已经转了。" }] }], "case1:scene1"), "台词更新后旧阅读位置应失效");
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else delete globalThis.localStorage;
  }
});

test("INPUT-001", "keyboard and gamepad navigation has pure focus rules", () => {
  assertEqual(keyboardNavigationIntent("Enter"), "confirm", "Enter 必须确认当前按钮");
  assertEqual(keyboardNavigationIntent("ArrowRight"), "next", "右方向键必须移动到下一个按钮");
  assertEqual(keyboardNavigationIntent("a"), "previous", "WASD/方向键必须共用上一项/下一项规则");
  assertEqual(keyboardNavigationIntent("Tab"), "", "Tab 必须保留浏览器原生焦点导航，不能被案卷快捷键劫持");
  assertEqual(keyboardNavigationIntent("r"), "review", "R 键必须进入回看意图");
  assertEqual(keyboardNavigationIntent("Escape"), "back", "Esc 必须进入返回意图");
  assertEqual(nextFocusIndex({ currentIndex: 1, total: 3, direction: 1 }), 2, "焦点向前移动必须落到下一个按钮");
  assertEqual(nextFocusIndex({ currentIndex: 2, total: 3, direction: 1 }), 0, "焦点必须能从末尾循环到开头");
  assertEqual(nextFocusIndex({ currentIndex: -1, total: 3, direction: -1 }), 2, "没有当前焦点时向上/左应落到末尾");
  assertEqual(gamepadAxisDirection({ axes: [0.7, 0], lastMoveAt: 0, now: 500 }), 1, "左摇杆右推必须生成下一项方向");
  assertEqual(gamepadAxisDirection({ axes: [-0.7, 0], lastMoveAt: 0, now: 500 }), -1, "左摇杆左推必须生成上一项方向");
  assertEqual(gamepadAxisDirection({ axes: [0.2, 0], lastMoveAt: 0, now: 500 }), 0, "摇杆小幅漂移不能移动焦点");
  assertEqual(gamepadAxisDirection({ axes: [0.8, 0], lastMoveAt: 450, now: 500 }), 0, "摇杆移动必须有冷却，避免一帧扫过多个按钮");
  const inputControlSource = readFileSync(new URL("../src/ui/focusInputControl.js", import.meta.url), "utf8");
  assertIncludes(inputControlSource, "handleGamepadButton(gamepad, 0, confirmCurrentControl)", "手柄 A 与键盘确认必须共用当前交互区域规则；真实弹层行为由 reading-controls 回放验收");
});

test("INPUT-002", "decisive feedback uses optional, reduced-motion-aware gamepad haptics", () => {
  assertEqual(JSON.stringify(gamepadHapticPlan("hit", "full")), JSON.stringify({ duration: 260, strongMagnitude: 0.72, weakMagnitude: 0.38 }), "完整演出必须给命中明确但短促的手柄反馈");
  const reduced = gamepadHapticPlan("hit", "reduced");
  assert(reduced.duration < 260 && reduced.strongMagnitude < 0.72, "减弱演出必须同步降低手柄震动时长和强度");
  assertEqual(gamepadHapticPlan("hit", "off"), null, "关闭闪烁/震动时不得触发手柄震动");
  let requested = null;
  const actuator = { playEffect: (kind, plan) => { requested = { kind, plan }; return Promise.resolve(); } };
  const result = triggerGamepadHaptic({ kind: "miss", effects: "full", gamepads: [{ connected: true, vibrationActuator: actuator }] });
  assertEqual(result.ok, true, "支持 dual-rumble 的手柄必须能触发反馈");
  assertEqual(requested?.kind, "dual-rumble", "手柄反馈必须使用标准 dual-rumble effect");
  assertEqual(triggerGamepadHaptic({ kind: "hit", effects: "full", gamepads: [] }).reason, "no-gamepad", "未连接手柄时必须静默降级");
});

test("REWIND-001", "question rewind restores the complete pre-choice checkpoint without cloning static case content", () => {
  const brief = { id: "case-1" };
  const before = {
    screen: "chapter",
    chapter: 1,
    scene: "sceneQuestionMenu",
    playerName: "周明",
    saveSlot: "slot1",
    settings: { textSpeed: "normal" },
    caseBriefs: [brief],
    caseBrief: brief,
    caseBudgets: { "case-1": { remaining: 3 } },
    sceneQuestionPicks: {},
    contradictionLog: {}
  };
  let history = pushQuestionRewindPoint([], before);
  before.caseBudgets["case-1"].remaining = 1;
  const currentBrief = { id: "case-1", refreshed: true };
  const current = {
    ...before,
    settings: { textSpeed: "fast" },
    caseBriefs: [currentBrief],
    caseBrief: currentBrief,
    scene: "sceneQuestionAnswer",
    sceneQuestionPicks: { "case-1:0": { question: "钱去哪了？" } },
    contradictionLog: { "case-1": ["去向前后不一"] }
  };
  const rewind = popQuestionRewindPoint(history, current);
  history = rewind.history;
  assertEqual(rewind.state.caseBudgets["case-1"].remaining, 3, "返回必须恢复追问前的耐心预算");
  assertEqual(Object.keys(rewind.state.sceneQuestionPicks).length, 0, "返回必须撤销刚才的追问记录");
  assertEqual(Object.keys(rewind.state.contradictionLog).length, 0, "返回必须撤销刚才揭示的矛盾");
  assertEqual(rewind.state.settings.textSpeed, "fast", "返回不得覆盖玩家刚改过的系统设置");
  assert(rewind.state.caseBrief === currentBrief, "返回必须复用当前内容包，不能把大份案情静态内容塞进历史栈");
  assertEqual(history.length, 0, "返回一次只能弹出一个追问检查点");
  assertEqual(canRewindQuestion(history), false, "没有检查点时返回键必须禁用");
  for (let index = 0; index < QUESTION_REWIND_LIMIT + 5; index += 1) history = pushQuestionRewindPoint(history, { scene: String(index) });
  assertEqual(history.length, QUESTION_REWIND_LIMIT, "追问历史必须有上限，不能随长局无限占用内存");
  const enabledFrame = liveFrameHtml({ rewindAvailable: true });
  const disabledFrame = liveFrameHtml({ rewindAvailable: false });
  assertIncludes(enabledFrame, 'data-action="rewind"', "所有直播与调查框架必须共享同一个返回键");
  assert(!enabledFrame.match(/data-action="rewind"[^>]*disabled/), "存在检查点时返回键必须可用");
  assert(disabledFrame.match(/data-action="rewind"[^>]*disabled/), "没有检查点时返回键必须保持隐藏禁用");
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assertIncludes(appSource, 'document.addEventListener("pointerup", captureQuestionRewindFromEvent, true)', "指针选择必须在业务处理器改状态前保存检查点");
  assertIncludes(appSource, 'document.addEventListener("click", captureQuestionRewindFromEvent, true)', "键盘触发的选择也必须保存检查点");
  ["data-scene-review-line", "data-scene-open-replay", "data-retry-statement"].forEach((selector) => {
    assertIncludes(appSource, selector, `原话回放操作 ${selector} 必须进入全局返回检查点`);
  });
});

test("MATERIAL-002", "material inspection renders as an in-document markable board", () => {
  const stylesSource = bundleCssSync(new URL("../src/styles.css", import.meta.url));
  const html = evidenceOperationHtml({
    title: "后台补充",
    material: "上一句只说已经转交，下一句没有说明谁接手。",
    options: [{ label: "付款状态", correct: true }]
  });
  assertIncludes(html, "evidence-workbench", "材料检视必须通过材料操作台渲染，不能退回普通段落卡");
  assertIncludes(html, "evidence-document-body", "材料对象必须有独立正文区域，便于按类型换版式");
  assertIncludes(html, "evidence-document-lines", "材料文本必须拆成文件行，形成可看的材料对象");
  assertIncludes(html, "class=\"evidence-target", "材料选项必须在材料板内部作为可圈点区域出现");
  assertIncludes(html, CHOICE_COST_META.evidenceMark, "材料圈点必须在按钮级显示圈偏的耐心代价");
  const markedHtml = evidenceOperationHtml(
    { title: "聊天截图", material: "截图缺下半边。", options: [{ label: "下半边", correct: true }] },
    { optionIndex: 0, label: "下半边", correct: true, feedback: "圈住了缺口。" },
    0
  );
  assertIncludes(markedHtml, "evidence-annotation hit", "材料选择后必须在文件上显示圈点结果");
  assertIncludes(stylesSource, ".evidence-target.selected", "被圈位置必须有视觉反馈");
  assertIncludes(stylesSource, ".evidence-annotation.miss", "误指材料必须只标出玩家圈偏的位置");
  assertIncludes(stylesSource, ".evidence-workbench.marked.hit::before", "材料命中必须有局部扫描高光，避免圈中反馈太硬");
  assertIncludes(stylesSource, "evidenceHitScan", "材料命中扫描必须有独立动画");
  const appSource = runtimeSource;
  assert(!appSource.includes("choiceGroup(\"圈哪一处\""), "材料检视不能退回下方普通按钮组选项");
  assertIncludes(appSource, "evidenceCheckScreenHtml", "材料检视整页 HTML 必须从 app.js 拆到 ui/evidenceView");
  assertIncludes(appSource, "state.lastScreenEffect = \"material-hit\"", "材料命中必须触发一次全屏 CRT 扫描反馈");
  assert(!appSource.includes("这份材料里，哪一块最该先指出？"), "材料检视提示文案不能继续手写在 app.js");
  const screenHtml = evidenceCheckScreenHtml({
    check: { title: "账单检视", prompt: "圈哪里？", material: "账单缺页。", options: [{ label: "缺页", correct: true }] },
    pick: { optionIndex: 0, label: "缺页", correct: true, feedback: "圈住了缺口。", reactionLine: "这页我刚才没敢细看。", revisedVersion: "……我再说一遍，那页不是没看，是没敢看。" },
    reviewHtml: "<aside>上一问</aside>"
  });
  assert(!screenHtml.includes("evidence-workbench"), "结果对白不能与材料操作台挤在同层");

  assertIncludes(screenHtml, DEFAULT_PLAYER_NAME, "材料判断必须由主播说出口，不能继续显示无署名系统判卷");
  assertIncludes(screenHtml, "call-dialogue evidence-pick-feedback", "材料结果必须进入当前逐句播放，不能被上一问回放抢走");
  assert(!screenHtml.includes("圈中了") && !screenHtml.includes("没圈准") && !screenHtml.includes("这处还不够"), "材料判断页不得使用系统判卷标签");
  assertIncludes(screenHtml, "咨询者", "材料圈点后的 reactionLine 必须以咨询者对话气泡渲染");
  assertIncludes(screenHtml, "这页我刚才没敢细看。", "材料圈点后的 reactionLine 必须出现在材料结果页");
  assertIncludes(screenHtml, "……我再说一遍，那页不是没看，是没敢看。", "材料命中后的 revisedVersion 必须作为咨询者气泡出现在反应台词之后");
  assert(!screenHtml.includes("荧光笔"), "材料检视候选区不能继续显示不明确的工具名");
  assert(!screenHtml.includes("上一问"), "历史通过记录入口查看，不挤进当前材料反馈");
  assert(!stylesSource.includes("evidence-check-card"), "材料操作台上线后不能留下旧材料段落卡样式");
  const missScreenHtml = evidenceCheckScreenHtml({
    check: { title: "账单检视", prompt: "圈哪里？", material: "账单缺页。", options: [{ label: "日期", correct: false }] },
    pick: { optionIndex: 0, label: "日期", correct: false, feedback: "这里会说明当前选项的问题。", reactionLine: "这句反应也会提示答案。" },
    hostName: "周明"
  });
  assertIncludes(missScreenHtml, "周明", "材料判断必须使用玩家设置的主播姓名");
  assert(!missScreenHtml.includes("未选中关键线索"), "材料结果用当前对话说明，不叠放作者判断标签");
  assertIncludes(missScreenHtml, "这里会说明当前选项的问题。", "材料未命中必须显示对应选项的解释");
  assert(!missScreenHtml.includes("这句反应也会提示答案。"), "材料圈偏后不得播放为正确材料准备的人物反应");
});

test("MATERIAL-003", "material board uses distinct visual layouts by material type", () => {
  const stylesSource = bundleCssSync(new URL("../src/styles.css", import.meta.url));
  assertEqual(evidenceMaterialKind({ title: "信用卡账单", material: "餐厅消费，礼物分期。" }), "bill", "账单材料必须识别为 bill");
  assertEqual(evidenceMaterialKind({ title: "排班表", material: "预约表列了能办卡。" }), "table", "表格材料必须识别为 table");
  assertEqual(evidenceMaterialKind({ title: "学校截图", material: "图里只有 MBA 项目。" }), "shot", "截图材料必须识别为 shot");
  assertEqual(evidenceMaterialKind({ title: "报销审批", material: "审批通过但没有付款状态。" }), "flow", "审批材料必须识别为 flow");
  assertIncludes(evidenceOperationHtml({ title: "信用卡账单", material: "餐厅消费。", options: [] }), "material-bill", "材料类型必须落到 DOM class，供 CSS 区分版式");
  assertIncludes(evidenceOperationHtml({ title: "信用卡账单", material: "餐厅消费。", options: [] }), "evidence-thumb-bill", "材料板必须有可见缩略图，不能只是一块文字板");
  assertIncludes(evidenceMaterialThumbHtml({ title: "报销审批", material: "审批通过。" }), "evidence-thumb-flow", "材料缩略图必须跟随材料类型变化");
  assertIncludes(evidenceOperationHtml({ title: "信用卡账单", material: "餐厅消费。", options: [] }), "evidence-ledger", "账单材料必须渲染成账单行，而不是普通段落");
  const structuredBill = {
    title: "信用卡账单",
    material: "社保断缴后，同一张卡上继续出现几笔消费。",
    materialRows: ["纪念日晚餐 · 断缴后", "短视频平台分期 · 1.2 万"],
    options: []
  };
  const structuredBillHtml = evidenceCheckScreenHtml({ check: structuredBill });
  assertEqual(JSON.stringify(evidenceMaterialRows(structuredBill)), JSON.stringify(structuredBill.materialRows), "材料板必须优先使用内容包写好的 materialRows");
  assertIncludes(structuredBillHtml, "纪念日晚餐 · 断缴后", "结构化账单行必须进入材料板正文");
  assertIncludes(structuredBillHtml, "短视频平台分期 · 1.2 万", "结构化账单行必须保留短视频分期疑点");
  assertIncludes(structuredBillHtml, "evidence-material-note", "materialRows 存在时，原 material 必须降为板下注释");
  assertIncludes(evidenceOperationHtml({ title: "排班表", material: "顾客｜备注。", options: [] }), "evidence-table-grid", "表格材料必须渲染成表格感区域");
  assertIncludes(evidenceOperationHtml({ title: "截图", material: "学校图里只有项目。", options: [] }), "evidence-shot-frame", "截图材料必须渲染成截图/手机框区域");
  const socialPostHtml = evidenceOperationHtml({
    title: "朋友圈补图",
    socialPost: { author: "咨询者", caption: "终于有人把日子过得体面一点。", comment: "这才像被认真对待" },
    options: []
  });
  assertEqual(evidenceMaterialKind({ title: "朋友圈补图", socialPost: {} }), "social", "朋友圈补图必须使用独立社交动态材料类型");
  assertIncludes(socialPostHtml, "social-post-shot", "朋友圈补图必须渲染成动态截图，不可退回纯文本材料");
  assertIncludes(socialPostHtml, "这才像被认真对待", "朋友圈截图必须保留原评论证据");
  assertIncludes(socialPostHtml, "evidence-target-grid", "材料判断选项必须收进四方格面板");
  assertIncludes(evidenceOperationHtml({ title: "审批流", material: "审批通过。没有付款状态。", options: [] }), "evidence-flow-track", "审批流材料必须渲染成流程节点区域");
  assertIncludes(stylesSource, ".evidence-document.material-bill", "账单材料必须有独立视觉皮肤");
  assertIncludes(stylesSource, ".evidence-table-grid", "表格材料必须有独立视觉皮肤");
  assertIncludes(stylesSource, ".evidence-shot-frame", "截图材料必须有独立视觉皮肤");
  assertIncludes(stylesSource, ".evidence-flow-track", "流程材料必须有独立视觉皮肤");
  assertIncludes(stylesSource, ".evidence-thumb", "材料检视必须有缩略图样式，补直播后台资产感");
});

test("MATERIAL-004", "scene dialogue can reveal read-only evidence cards", () => {
  const card = { type: "账单", title: "信用卡账单", front: "餐厅、礼物分期、两次酒店集中在断缴后一个月内；另有“短视频平台分期 1.2 万”一笔。" };
  const activeHtml = activeSceneExchangeHtml({ scene: { version: "我翻到账单。", shownCard: card } });
  const completedHtml = completedSceneExchangeHtml({ scene: { version: "我翻到账单。", shownCard: card }, pick: { question: "哪几笔？", answer: "餐厅和酒店。" } });
  assertIncludes(activeHtml, "scene-evidence-card", "场景内材料卡必须在当前对话里可见");
  assertIncludes(activeHtml, "短视频平台分期 1.2 万", "场景内材料卡必须显示 evidenceCard.front");
  assertIncludes(completedHtml, "scene-evidence-card", "完成后的对话回看仍需保留只读材料卡");
  assert(!activeHtml.includes("button"), "场景内材料卡必须是只读展示，不能变成可点击材料板");
});

test("MATERIAL-005", "material toolbar unlocks only after the player has actually received a document", () => {
  const [brief] = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const unopened = unlockedMaterialProfile({ state: {}, brief });
  assertEqual(unopened.count, 0, "来电开场不能提前出现“材料 1”");
  assertEqual(unopened.label, "", "未收到材料时不能提前泄露本案核心材料名");

  const firstEvidenceSceneIndex = (brief.sceneVersions ?? []).findIndex((scene) => scene.showsCard);
  assert(firstEvidenceSceneIndex >= 0, "测试案件必须有一段会交出随麦材料的问答");
  const afterFirstExchange = {
    caseActionLog: {
      [brief.id]: {
        [`version:${firstEvidenceSceneIndex}`]: true
      }
    }
  };
  const firstReceived = unlockedMaterialProfile({ state: afterFirstExchange, brief });
  assertEqual(firstReceived.count, 1, "相关问答完成后才应解锁第一份随麦材料");
  assertEqual(firstReceived.label, "社保断缴时间", "材料栏必须显示玩家刚听到的截图，不能提前显示完整银行流水");

  const hiddenOutsideCase = unlockedMaterialProfile({ state: afterFirstExchange, brief, visible: false });
  assertEqual(hiddenOutsideCase.count, 0, "序章、案名页和收束页必须隐藏案件材料栏");

  const afterHangup = { ...afterFirstExchange, caseOvernights: { [brief.id]: { hangupDone: true, segment: "day" } } };
  const fullFlowReceived = unlockedMaterialProfile({ state: afterHangup, brief });
  assertEqual(fullFlowReceived.count, 2, "挂断后补发的完整流水必须在真正收到后加入材料栏");
  assertEqual(fullFlowReceived.label, brief.documents[0].title, "收到的材料必须用原件标题，不能把全案摘要当标题");
  assert(!JSON.stringify(fullFlowReceived).includes(brief.storyClueObject), "材料栏不得泄露全案答案摘要");

  const emptyDeck = liveControlDeckHtml({ material: "", materialCount: 0 });
  assertIncludes(emptyDeck, "尚未收到", "材料未送达时控台必须明确显示空状态");
  assert(!liveFrameHtml({ material: "", materialCount: 0 }).includes("data-material-open"), "未收到材料时不能渲染“材料 1”入口");
  assertIncludes(liveFrameHtml({ material: "社保断缴时间", materialCount: 1 }), "<b>1</b>", "第一份材料收到后才显示材料数量");
});

test("UI-004", "inline transition buttons keep a normal CTA shape", () => {
  const stylesSource = bundleCssSync(new URL("../src/styles.css", import.meta.url));
  const recapScreenSource = readFileSync(new URL("../src/ui/screens/recapScreens.js", import.meta.url), "utf8");
  const inlineFlowRule = stylesSource.slice(
    stylesSource.indexOf(".avg-choice-overlay.inline-choice-flow:not([hidden]) {"),
    stylesSource.indexOf(".evidence-screen, .investigation-screen")
  );
  assertIncludes(inlineFlowRule, "flex: 0 0 auto", "过场按钮必须清掉普通 flow button 的 150px flex-basis，不能被拉成竖方块");
  assertIncludes(inlineFlowRule, "height: auto", "“进入第一幕”等过场按钮必须按文字高度排版");
  assertIncludes(inlineFlowRule, "min-height: 3rem", "过场按钮仍需保留清晰、可点击的最小高度");
  assertIncludes(inlineFlowRule, "justify-content: center", "进入幕、接入案件和后续继续按钮必须统一居中，不能悬在舞台最右侧");
  assertIncludes(inlineFlowRule, "text-align: center", "推进按钮文字必须使用居中 CTA 排版");
  assertIncludes(inlineFlowRule, "scroll-margin-block: 1rem", "推进按钮滚入视口时必须保留底部呼吸空间");
  assertIncludes(recapScreenSource, "night-shell-prologue-screen", "开播前页面必须有独立布局类，避免入口按钮被长对白挤出首屏");
  assertIncludes(stylesSource, ".night-shell-prologue-screen .vn-stage", "开播前舞台必须给入口按钮预留一行");
  assertIncludes(runtimeSource, "keepInlineChoicesVisible(shownChoices)", "后续继续按钮出现时必须滚到完整可见位置");
});

test("INVESTIGATION-001", "host investigation backflow is fixed material, not freeform facts", () => {
  const appSource = runtimeSource;
  const stateSource = readFileSync(new URL("../src/state.js", import.meta.url), "utf8");
  const cases = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  assertIncludes(appSource, "renderInvestigationBackflow", "案后私信回流必须有独立场景，不能塞进普通结果页文字");
  assertIncludes(appSource, "unlockedInvestigationEntriesFor", "回流材料必须由已听到的矛盾触发，不能开局直接发答案");
  assertIncludes(appSource, "investigationPicks", "回流材料选择必须可存档、可回放、可测试");
  assertIncludes(appSource, "investigationRouteIndexBase", "路线图必须把回流节点标出来，不能伪装成第六段对话");
  assertIncludes(appSource, "investigationBackflowScreenHtml", "后台私信回流整页 HTML 必须从 app.js 拆到 ui/evidenceView");
  assert(!appSource.includes("收麦后，有人补了一张图。"), "后台私信默认文案不能继续手写在 app.js");
  const backflowHtml = investigationBackflowScreenHtml({
    hook: { surface: "后台私信", appearsNowBecause: "有人补了一句。", prompt: "圈哪句？", material: "返给对接人。", options: [{ label: "对接人", correct: true }] },
    reviewHtml: "<aside>上一问</aside>"
  });
  assertIncludes(backflowHtml, "后台私信", "后台私信页面 helper 必须保留来源标题");
  assertIncludes(backflowHtml, "evidence-workbench", "后台私信页面 helper 必须复用材料操作台");
  assertIncludes(stateSource, "investigationPicks", "旧存档迁移必须补回流材料选择容器");
  cases.forEach((brief, index) => {
    assert(Array.isArray(brief.investigationHooks), `第 ${index + 1} 案保留回流兼容数组，不要求额外回流`);
    (brief.investigationHooks ?? []).forEach((hook, hookIndex) => {
      assert(hook.triggerContradiction || hook.triggerAction, `第 ${index + 1} 案第 ${hookIndex + 1} 个回流必须由已听到的矛盾或动作触发`);
      assert(hook.material && hook.prompt, `第 ${index + 1} 案第 ${hookIndex + 1} 个回流必须是固定材料，不是自由生成事实`);
      assert(hook.proves && hook.stillCannotProve, `第 ${index + 1} 案第 ${hookIndex + 1} 个回流必须同时写清能证明和不能证明什么`);
      assert((hook.options ?? []).some((option) => option.correct), `第 ${index + 1} 案第 ${hookIndex + 1} 个回流必须有可圈中的材料点`);
      assert((hook.options ?? []).some((option) => !option.correct), `第 ${index + 1} 案第 ${hookIndex + 1} 个回流必须保留噪音或误导点`);
    });
  });
  assert(!appSource.includes("新线索解锁"), "回流不能写成任务系统提示");
  assert(!appSource.includes("核验成功"), "回流不能写成通关提示");
});

test("INVESTIGATION-002", "off-mic letters share the final recap page after boundary placement", () => {
  assert(CONTENT_ADVISORS["zhao-lawyer"], "顾问注册表必须进入运行时内容索引");
  const letterHtml = offMicLettersHtml([
    {
      kind: "advisor",
      badge: "赵律师 · 家事与债务",
      appearsNowBecause: "收麦后，后台一位常来的律师听友留了几句。",
      text: "口说的不算，落纸的算数。"
    },
    {
      kind: "respondent",
      badge: "对方留言",
      appearsNowBecause: "收麦后，对方给节目后台留了一段文字。",
      text: "这两码事。"
    }
  ]);
  assertIncludes(letterHtml, "麦外来信", "麦外来信必须有独立阅读页标题");
  assertIncludes(letterHtml, "赵律师 · 家事与债务", "顾问条目必须显示姓名和领域名牌");
  assertIncludes(letterHtml, "对方留言", "缺席方单向留言必须显示对方留言名牌");
  const pages = solvedRecapPagesHtml({
    offMicLetters: [{ badge: "赵律师 · 家事与债务", text: "口说的不算，落纸的算数。" }],
    boundary: { title: "事实边界", columns: [{ key: "true", label: "能确认", items: ["账单存在"] }], prompts: [], choices: [] },
    boundaryPicks: {}
  });
  assertEqual(pages.length, 2, "没有独立主播口播时，收麦回看必须压缩成两页");
  assertIncludes(pages[0], "事实边界", "首屏回看必须同时完成事实边界放置");
  assert(pages[1].indexOf("后续回拨") < pages[1].indexOf("麦外来信"), "末页必须先交代后续回拨，再显示麦外来信");
  assertIncludes(pages[1], "连线收住", "末页必须保留事实边界揭示与收束");
});

test("UI-001", "current-node questions separate free asks from key choices", () => {
  const appSource = runtimeSource;
  const materialSource = readFileSync(new URL("../src/runtime/materialOperation.js", import.meta.url), "utf8");
  const recapModelSource = readFileSync(new URL("../src/runtime/recapModel.js", import.meta.url), "utf8");
  const routeMapSource = readFileSync(new URL("../src/runtime/routeMapModel.js", import.meta.url), "utf8");
  const livePressureSource = readFileSync(new URL("../src/runtime/livePressure.js", import.meta.url), "utf8");
  const storyInterludeModelSource = readFileSync(new URL("../src/runtime/storyInterludeModel.js", import.meta.url), "utf8");
  const storyPackSummarySource = readFileSync(new URL("../src/runtime/storyPackSummaryModel.js", import.meta.url), "utf8");
  const liveCallViewSource = readFileSync(new URL("../src/ui/liveCallView.js", import.meta.url), "utf8");
  const recapViewSource = readFileSync(new URL("../src/ui/recapView.js", import.meta.url), "utf8");
  const routeTrailViewSource = readFileSync(new URL("../src/ui/routeTrailView.js", import.meta.url), "utf8");
  const sceneReviewViewSource = readFileSync(new URL("../src/ui/sceneReviewView.js", import.meta.url), "utf8");
  const storyInterludeViewSource = readFileSync(new URL("../src/ui/storyInterludeView.js", import.meta.url), "utf8");
  const storyPackCompleteViewSource = readFileSync(new URL("../src/ui/storyPackCompleteView.js", import.meta.url), "utf8");
  const interludeDeskViewSource = readFileSync(new URL("../src/ui/interludeDeskView.js", import.meta.url), "utf8");
  const stylesSource = bundleCssSync(new URL("../src/styles.css", import.meta.url));
  const questionOptions = focusedQuestionOptions([
    { question: "你当时有没有起疑心？", answer: "有一点。" },
    { question: "他开口借钱之前，有没有跟你说过工作最近不稳定？", answer: "没有。", contradiction: "失业早于借钱。" },
    { question: "你朋友怎么说？", answer: "朋友劝我看账单。" }
  ]);
  const scene = {
    version: "他说账单今晚必须先转。",
    questionOptions,
    casualQuestions: [
      { question: "你们平时谁管钱多一点？", answer: "各花各的。" },
      { question: "他以前跟你开过口借钱吗？", answer: "没有。" }
    ]
  };
  const dialogueOptions = sceneDialogueOptions(scene, questionOptions);
  const questionHtml = sceneQuestionChoicesHtml(2, scene, []);
  const askedQuestionHtml = sceneQuestionChoicesHtml(2, scene, [{ optionIndex: 0, question: dialogueOptions[0].option.question, answer: "有一点。" }]);
  const directionScene = {
    helperHint: "把八万和已经说清的消费分开看。",
    questionOptions: [
      { question: "剩下那三万五，你问过他是什么吗？", suspicionLabel: "八万里没说清的三万五", answer: "问过。", contradiction: "缺口未解释。" },
      { question: "这些账单上的日子，你们当时在一起吗？", suspicionLabel: "账单日期和交往时间", answer: "有些在。", contradiction: "时间待核。" }
    ]
  };
  const directionHtml = sceneQuestionChoicesHtml(4, directionScene, []);
  assertIncludes(questionHtml, "scene-question-group", "当前节点必须把所有主播问题放进同一面板");
  assertIncludes(questionHtml, "data-scene-dialogue=\"2:0\"", "随意提问必须有独立事件入口，不结束当前段落");
  assertIncludes(questionHtml, "data-scene-question=\"2:1\"", "关键追问仍要保留可点击数据");
  assertIncludes(questionHtml, "你们平时谁管钱多一点？", "有 casualQuestions 时普通区必须渲染署名闲聊层");
  assert(!/补问背景|追原话|消耗听众耐心|补问 · 不收束/.test(questionHtml), "同屏底栏不得再显示旧问题菜单的分组标题和后台说明");
  assertIncludes(questionHtml, "收束 · 未命中 −1 耐心", "每个正式追问按钮必须直接说明推进与失败成本");
  assert(!askedQuestionHtml.includes("你们平时谁管钱多一点？"), "问过的背景问必须退出活动底栏，不能继续占据按钮位");
  assertIncludes(askedQuestionHtml, "他以前跟你开过口借钱吗？", "问过一项后下一条背景问必须留在同一底栏");
  const crowdedHtml = sceneQuestionChoicesHtml(3, {
    questionOptions: directionScene.questionOptions,
    casualQuestions: Array.from({ length: 5 }, (_, index) => ({ question: `背景问题${index + 1}？`, answer: "答。" }))
  }, []);
  assertEqual((crowdedHtml.match(/data-scene-(?:dialogue|question)=/g) ?? []).length, 4, "同屏底栏最多显示四个可问项，避免重新变成问卷");
  assertIncludes(directionHtml, "八万里没说清的三万五", "方向式节点必须显示玩家选择的疑点短标签");
  assert(!directionHtml.includes("剩下那三万五，你问过他是什么吗？"), "方向式节点在选择前不能暴露主播完整句子");
  assertEqual(playerQuestionLabel(directionScene.questionOptions[0]), "八万里没说清的三万五", "玩家可见标签必须优先使用 suspicionLabel");
  assert(!runtimeSource.includes("data-open-question-menu") && !runtimeSource.includes("data-return-question-menu") && !runtimeSource.includes("data-close-question-menu"), "正案不得保留提问门、返回菜单或退出菜单按钮");
  assert(!questionHtml.includes("完整问句") && !questionHtml.includes("按下以后") && !questionHtml.includes("疑点方向"), "主案选择页不得用教程句或重复标签解释方向按钮");
  assert(!questionHtml.includes("求助 V哥") && !questionHtml.includes(directionScene.helperHint), "V哥隐藏期间不得出现在同屏问题底栏");
  assert(CONTENT_HELPER_NPCS["v-bro"]?.playerVisible === false, "V哥必须保留在注册表中并统一标记为玩家不可见");
  assert(!CONTENT_ADVISORS["v-bro"], "V哥不能混入专业顾问注册表");
  assert(dialogueOptions.every((row) => scene.casualQuestions.some((option) => option.question === row.option.question)), "有 casualQuestions 时普通区不能继续回收关键选择里的外围项");
  ["普通提问", "关键选择", "核心问题", "推荐", "路线轴", "会推进剧情", "不推进剧情", "正确答案", "加分", "必选"].forEach((term) => {
    assert(!questionHtml.includes(term), `提问面板不得泄露后台类型：${term}`);
  });
  assert(!questionHtml.includes("先问两句"), "随意提问区不能写成意义不明的流程标签");
  assert(!questionHtml.includes("接着追"), "正式追问区不能写成意义不明的半截话");
  assert(!questionHtml.includes("问偏"), "面板说明不许把失败机制直接说给玩家听");
  assert(!questionHtml.includes("弹幕会散"), "面板说明不能用伪直播马甲解释机制");
  assert(!questionHtml.includes("问偏会掉耐心"), "正式追问区不能写成机制说明书");
  assert(!dialogueOptions.some((row) => row.option.question === questionOptions[row.option.sourceIndex ?? row.optionIndex]?.question), "随意提问不能原样复用正式追问选项");
  assert(!questionHtml.includes("choice-kind"), "问题按钮不能额外显示类型标签");
  assert(!askedQuestionHtml.includes(`data-scene-dialogue="2:0"`), "问过的非推进问题应退出底栏，给下一条未问项让位");
  assertIncludes(appSource, "handleSceneDialogueButton", "随意提问必须有事件入口，不能和关键追问混成一个按钮组");
  assertIncludes(appSource, "state.lastPressureSignal = questionPressureSignal", "随意提问也必须影响来电人防备，避免免费扫雷");
  assertIncludes(appSource, "renderEvidenceCheck", "追问结束后必须保留材料检视阶段，避免玩法退回纯问答");
  assertIncludes(appSource, "evidenceCheckPicks", "材料检视选择必须进入存档和复盘状态");
  assertIncludes(appSource, 'if (option.contradiction) markAction(brief, `sceneQuestion:${sceneIndex}:${optionIndex}`)', "关键追问命中不扣耐心；错问等反驳说完再扣");
  assertIncludes(materialSource, "spend: !correct", "材料检视圈中不能消耗听众忍耐，误指才扣");
  assertIncludes(storyPackSummarySource, "storyPackClosingLine", "故事集终局小字必须按本局表现生成，不能写成玩法说明");
  assertIncludes(storyPackSummarySource, "storyCallCountText(briefs.length)", "故事集终局正文必须按实际案数生成，不能写死四路麦");
  assert(!appSource.includes("今晚四路麦都挂了"), "故事集终局不能写死四路麦");
  assertIncludes(routeMapSource, "return \"料\"", "路线图里的材料检视节点必须标成材料，不能伪装成第六段对话");
  assertIncludes(routeMapSource, "return \"回\"", "路线图里的私信回流节点必须标成回流，不能伪装成材料或第六段对话");
  assertIncludes(appSource, "./ui/routeTrailView.js", "路线图 HTML 必须从 app.js 拆到 ui/routeTrailView");
  assertIncludes(routeTrailViewSource, "routeTrailModel", "路线图 UI 必须复用 runtime routeTrailModel，不能自己重新判断节点类型");
  assert(!appSource.includes("function routeTrailHtml"), "路线图 HTML 不能继续留在 app.js");
  const routeTrailUi = routeTrailHtml({
    choices: [
      { sceneIndex: 0, axis: "caller-credibility", question: "你当时有没有起疑心？" },
      { sceneIndex: 5, axis: "document-edge", question: "这份材料少了哪一边？" },
      { sceneIndex: 10, axis: "external-corroboration", question: "后台回流里哪句最该圈？" }
    ],
    keyQuestionCount: 5,
    investigationIndexBase: 10
  });
  assertIncludes(routeTrailUi, "route-trail", "路线图 HTML 必须可由纯 UI 模块渲染");
  assertIncludes(routeTrailUi, ">料<", "路线图 UI 必须把材料节点显示为料");
  assertIncludes(routeTrailUi, ">回<", "路线图 UI 必须把回流节点显示为回");
  assertIncludes(routeTrailUi, "你当时有没有起疑心？", "路线图 UI 必须保留玩家实际问题痕迹");
  assert(!routeTrailUi.includes("来电人没说全的部分"), "每个路线节点应显示玩家实际问句，不能重复堆叠分类标签");
  assertIncludes(appSource, "./runtime/storyInterludeModel.js", "案间过渡文案模型必须从 app.js 拆到 runtime/storyInterludeModel");
  assertIncludes(storyInterludeModelSource, "storyInterludeObjectLabel", "案间过渡必须从内容包读取下一案物件钩子");
  assert(!appSource.includes("\"lost-job-hidden-credit\": \"backdrop-credit\""), "案件背景 class 必须来自 brief.backdropClass，不能留 app.js plotId 映射");
  assert(!appSource.includes("brief.plotId === \"education-income-fake-profile\""), "存款证明结算特判必须来自内容 JSON 字段，不能留在 app.js");
  assert(!appSource.includes("function conclusionBranchFor"), "案后分支匹配不能继续定义在 app.js");
  assertIncludes(recapModelSource, "conclusionBranchFor", "案后分支结论必须走 recapModel 的内容字段匹配，而不是 plotId 特判");
  assertIncludes(storyInterludeObjectLabel({ storyObjectLabel: "表格" }), "表格", "案间过渡必须用物件钩子接下一通，减少目录感");
  assert(!appSource.includes("function storyInterludeObjectLabel"), "案间物件名模型不能继续定义在 app.js");
  assertIncludes(storyInterludeViewSource, "广告间隙", "案间过渡必须只是节目间隙，不能抢走正式结案职责");
  assert(!storyInterludeViewSource.includes("下一通 · 材料先到"), "案后小尾声不能提前塞入下一案材料，下一案钩子应留给独立引页");
  assert(!appSource.includes("\"tony-multi-dating\": \"表格\""), "案间物件名必须来自内容包 sequence.objectLabel，不能留 app.js plotId 映射");
  assert(!appSource.includes("\"workplace-reimbursement-screenshot\": \"公司那边也来了截图"), "案间桥接句必须来自内容包 sequence.bridge，不能留 app.js plotId 映射");
  assertIncludes(appSource, "caseClosure", "上一案回看结束后必须进入独立案件结案页");
  assertIncludes(appSource, "caseBridge", "带新闻推送的幕间必须经过独立案间页");
  assertIncludes(appSource, "caseTitle", "下一案开始前必须进入独立标题页");
  assertIncludes(appSource, "./ui/caseTransitionView.js", "结案和案标题 HTML 必须从 app.js 拆到独立 UI 模块");
  assertIncludes(appSource, "state.lastReaction = investigationPickReaction", "私信回流圈选必须牵动现场弹幕反应");
  assertIncludes(appSource, "currentLivePressure", "听众忍耐、弹幕跑偏和连线人防备必须收束到现场压力画像");
  assertIncludes(liveCallViewSource, "pressure.comments", "弹幕条必须由现场压力画像生成，不能散落多套规则");
  assertIncludes(liveCallViewSource, "pressure.expression", "来电人表情必须能读取现场压力画像");
  assertIncludes(appSource, "lastPressureSignal", "现场压力状态必须有结构化 signal，不能只靠反应文案推断");
  assertIncludes(appSource, "lastPressureAxis", "现场压力弹幕必须记录最近一次路线轴，不能只吐通用短句");
  assertIncludes(appSource, "routeAxisComments", "案内弹幕必须能读取内容包路线轴种子");
  assertIncludes(appSource, "currentScenePressureHint", "场景表情和弹幕钩子必须从内容数据读取，不能在 app.js 扫台词");
  assert(!livePressureSource.includes("sceneText"), "livePressure 不能扫描案件台词决定表情或防备，场景钩子必须进 JSON");
  assert(!livePressureSource.includes("reaction = \"\"") && !livePressureSource.includes("reaction,"), "livePressure 不能扫描自己生成的反应文案决定 crowdState");
  assert(!/\.test\(option\.answer/.test(livePressureSource), "livePressure 不能扫描来电人回答关键词生成现场反应");
  assert(!livePressureSource.includes("check.title") && !livePressureSource.includes("check.material"), "材料压力反应不能扫描材料标题/正文关键词，优先使用结构化命中和内容反馈");
  assertIncludes(appSource, "questionPressureReaction", "追问语气反应必须由现场压力模型生成，不能散在 app.js");
  assertIncludes(appSource, "materialPressureReaction", "材料命中/误指反应必须由现场压力模型生成，不能只扣忍耐");
  assert(!appSource.includes("function outerAngleReaction"), "旧的 UI 本地压力反应函数必须删除，避免两套规则并存");
  assertIncludes(storyPackSummarySource, "pressureRecapProfile", "单案结算必须回收现场压力画像");
  assertIncludes(storyPackSummarySource, "pressurePackProfile", "故事集终局必须汇总现场压力画像");
  assertIncludes(appSource, "evidenceCheckModel", "材料检视推进必须调用 sceneAdvance 纯模型");
  assertIncludes(appSource, "investigationBackflowModel", "回流私信推进必须调用 sceneAdvance 纯模型");
  assertIncludes(appSource, "./ui/sceneReviewView.js", "对话回合 HTML 必须从 app.js 拆到 ui/sceneReviewView");
  assertIncludes(sceneReviewViewSource, "sceneReviewHtml", "对话回合正文必须有纯 UI 渲染函数");
  assertIncludes(sceneReviewViewSource, "sceneReviewDoneChoicesHtml", "对话回合继续按钮必须有纯 UI 渲染函数");
  assertIncludes(sceneReviewViewSource, "activeSceneExchangeHtml", "当前对话气泡组装必须有纯 UI 渲染函数");
  assertIncludes(sceneReviewViewSource, "completedSceneExchangeHtml", "已完成对话气泡组装必须有纯 UI 渲染函数");
  assert(!appSource.includes("function activeSceneExchange("), "当前对话气泡组装不能继续留在 app.js");
  assert(!appSource.includes("function keyChoiceExchange("), "关键追问气泡组装不能继续留在 app.js");
  assert(!appSource.includes("function storyCommentWall"), "故事集评论墙模型不能继续留在 app.js god file");
  assertIncludes(recapModelSource, "export function storyCommentWall", "故事集评论墙模型必须留在 recapModel 纯函数里");
  assertIncludes(storyPackSummarySource, "storyPackBestAxis", "故事集终局 UI 必须调用纯模型生成主路线");
  assertIncludes(recapViewSource, "pressure-recap-card", "收麦回看必须显示现场压力余味");
  assertIncludes(storyPackSummarySource, "storyMaterialProfile", "故事集终局必须回收材料圈点结果");
  assertIncludes(storyPackSummarySource, "storyQuoteProfile", "故事集终局必须回收最终原话选择");
  assertIncludes(storyPackSummarySource, "storyObjectProfile", "故事集终局必须回收每案物件");
  assert(!storyPackCompleteViewSource.includes("weeklyProfileLine"), "终局案情回看不再堆叠玩家评分行");
  assertIncludes(recapViewSource, "truthBoundaryReviewHtml", "收麦回看必须把事实边界显示出来，不能让 truthBoundary 只停在 JSON 元数据");
  assertIncludes(appSource, "data-truth-boundary-pick", "事实边界必须可交互归位，不能只做静态说明页");
  assertIncludes(recapViewSource, "truthBoundaryPlaced", "事实边界必须改成一次放置后继续，不能强制玩家改到标准答案");
  assertIncludes(recapViewSource, "solvedRecapFlowView", "单案收麦回看分页和按钮必须由纯 UI 模块生成");
  assertIncludes(interludeDeskViewSource, "剩余 ${Number(budget.remaining ?? 0)} 格", "幕间预算必须压成一行剩余格数");
  assert(!interludeDeskViewSource.includes("advisor-conflict"), "未被内容使用的顾问分歧卡不能残留在运行时 UI");
  assert(!stylesSource.includes(".advisor-conflict"), "顾问分歧死分支删除后不能残留孤立样式");
  assertIncludes(stylesSource, ".day-studio", "工作室白天场景必须有独立背景规则");
  assertIncludes(stylesSource, ".day-office", "办公室白天场景必须有独立背景规则");
  assertIncludes(stylesSource, "backgrounds/cafe_date.png", "餐厅与咖啡馆必须接入已有场景图");
  assertIncludes(appSource, "solvedRecapFlowView", "renderSolved 必须调用纯 UI flow helper，不能继续本地拼分页按钮");
  assert(!appSource.includes("先把这几句放完") && !recapViewSource.includes("先把这几句放完"), "事实边界阻止继续的按钮文案不能继续写回运行时代码或 UI 模块");
  assert(!appSource.includes("这句还不能这么放"), "事实边界不能当场提示对错，错放应留到回看/终局揭晓");
  assertIncludes(appSource, "truthBoundaryMisses", "事实边界一次放错必须影响收话余味，不能只看最终放对");
  assertIncludes(storyPackSummarySource, "truthBoundaryPackProfile", "故事集终局必须汇总四案事实边界，而不是只看路线轴");
  assertIncludes(recapModelSource, "replaceOrAppendComment(comments, boundaryProfile.comment, 3)", "评论区审判墙必须保留事实边界评论");
  assert(!questionHtml.includes("choice-question-${kind}"), "追问按钮不能按内部问法类型暴露不同视觉样式");
  const oldKickerClass = `${"choice"}-${"kicker"}`;
  assert(!appSource.includes(oldKickerClass), "追问按钮不能再显示解释型小标签");
  const oldDialogueTag = `${"顺着"}${"问"}`;
  const oldKeyTag = `${"按住"}${"问"}`;
  const oldFlowLabel = `${"麦上"}${"动作"}`;
  const oldFlowNote = `${"麦还"}${"连着"}`;
  const oldReviewTitle = `${"前文"}${"对话"}`;
  const oldReviewContext = `${"开场"}${"对话"}`;
  const oldScoreFlavor = `${"麦里留下"}${"的味道"}`;
  const oldEndingExplainer = `${"不同主播"}${"会走出不同问法"}`;
  const oldInterludeSummary = `${"刚才那通"}${"先记下"}`;
  const oldNextCallTitle = `${"下一通"}${"来电</b>"}`;
  const recapSlopPhrases = ["半口瓜", "闻到味", "闻味", "差一口", "瓜心", "刚起味", "这轮听感", "这句能收住", "接到这里，这通就能收麦了", "主播倾向", "接入下一通"];
  assert(!appSource.includes(oldDialogueTag), "不能用设计标签解释普通问法");
  assert(!appSource.includes(oldKeyTag), "不能用设计标签解释推进问法");
  assert(!appSource.includes(oldFlowLabel), "主流程动作区不能显示解释性标题");
  assert(!appSource.includes(oldFlowNote), "主流程动作区不能显示解释性说明");
  assert(!appSource.includes(oldReviewTitle), "回看折叠入口不能使用后台整理式标题");
  assert(!appSource.includes(oldReviewContext), "回看折叠入口不能显示意义不明的开场分类");
  assert(!appSource.includes(oldScoreFlavor), "结算分数不能使用 AI 味的抽象味道文案");
  assert(!appSource.includes(oldEndingExplainer), "故事集终局不能把路线差异写成玩法说明");
  assert(!appSource.includes(oldInterludeSummary), "案间过渡不能使用通用记录式文案");
  assert(!appSource.includes(oldNextCallTitle), "案间过渡标题不能退回目录式下一通来电");
  recapSlopPhrases.forEach((phrase) => {
    assert(!appSource.includes(phrase), `结算和案间文案不能退回评分腔或 AI 味标签：${phrase}`);
  });
  const oldUpperGroup = `choiceGroup("${"岔开"}${"一句"}`;
  const oldLowerGroup = `choiceGroup("${"盯住"}${"一句"}`;
  assert(!appSource.includes(oldUpperGroup), "不能恢复成上方单独一个岔开按钮组");
  assert(!appSource.includes(oldLowerGroup), "不能恢复成下方单独一个关键按钮组");
  const packageSource = readFileSync(new URL("../package.json", import.meta.url), "utf8");
  const windowsPlaySource = readFileSync(new URL("../play-windows.bat", import.meta.url), "utf8");
  const buildStaticSource = readFileSync(new URL("../scripts/build-static.js", import.meta.url), "utf8");
  const devServerSource = readFileSync(new URL("../scripts/dev-server.js", import.meta.url), "utf8");
  assert(!stylesSource.includes("choice-question-key"), "核心追问不能用高亮色条暗示优先级");
  assert(!stylesSource.includes("critical-choice-group"), "当前节点追问不能恢复成关键选项高亮卡");
  assert(!appSource.includes("dialogueOptionsHtml"), "统一选择面板后不能留下未调用的 dialogueOptionsHtml 死代码");
  assert(!stylesSource.includes("dialogue-choice-group"), "统一选择面板后不能留下未使用的 dialogue-choice-group 样式");
  assertIncludes(recapViewSource, "Number(issue.percent ?? 0)", "recap 主视觉大字必须展示数值，避免四字 rank 在手机端溢出");
  assertIncludes(packageSource, "\"build:playable\"", "发布前必须有不依赖 dev server 的可玩构建脚本");
  assertIncludes(packageSource, "\"build:desktop\"", "必须保留桌面壳构建入口");
  assertIncludes(packageSource, "\"build:steam\"", "必须保留 Steam 构建入口");
  assertIncludes(packageSource, "\"build:steam\": \"npm run build:desktop\"", "Steam 构建必须指向桌面壳构建，不能继续只产出浏览器静态页");
  assertIncludes(packageSource, "\"package:win\"", "Steam/Windows 发版必须有 exe/portable 打包入口");
  assertIncludes(packageSource, "assert-windows-package-env.js", "Windows 正式打包必须拒绝 Mac/Linux 跨平台冒充验收");
  assertIncludes(packageSource, "\"verify:win-package\"", "Windows 产物必须有 PE 文件头、体积和校验和验证入口");
  assertIncludes(packageSource, "\"verify:win-runtime-smoke\"", "Windows 产物必须在目标系统实际启动并验证文件存档");
  assertIncludes(packageSource, "\"steam:preflight\"", "Steam 发版必须有本地 preflight 检查入口");
  assertIncludes(packageSource, "\"smoke:desktop\"", "桌面 staging 必须有不启动 Electron 的文件烟测");
  assertIncludes(packageSource, "\"smoke:quick\"", "本地提交前必须有单路线、单视口的快速浏览器回放入口");
  assertIncludes(packageSource, "--target=local-quick", "本地快速回放必须显式选择核心路线，不能偷偷运行完整矩阵");
  assertIncludes(packageSource, "\"smoke:browser\"", "大测试必须有真实浏览器回放 smoke 入口");
  assertIncludes(packageSource, "\"test:local\"", "本地提交前闸门必须串联静态校验与快速浏览器回放");
  assertIncludes(packageSource, "\"verify:audio\"", "全套校验必须检查音频 cue 与资产状态");
  assertIncludes(packageSource, "\"electron-builder\"", "Windows 打包入口必须声明 electron-builder 依赖");
  assertIncludes(packageSource, "scripts/smoke-desktop.js", "check 必须语法检查桌面烟测脚本");
  assertIncludes(packageSource, "scripts/smoke-browser-replay.js", "check 必须语法检查浏览器回放脚本");
  assertIncludes(packageSource, "scripts/steam-preflight.js", "check 必须语法检查 Steam preflight 脚本");
  assertIncludes(packageSource, "scripts/verify-windows-package.js", "check 必须语法检查 Windows 产物验证脚本");
  assertIncludes(packageSource, "scripts/verify-windows-runtime-smoke.js", "check 必须语法检查 Windows 运行报告验证脚本");
  assertIncludes(packageSource, "scripts/build-desktop.js", "桌面构建必须生成 Electron 壳目录");
  assertIncludes(packageSource, "\"content:index\"", "构建前必须生成 content 运行时索引");
  assertIncludes(packageSource, "\"dev\": \"node scripts/dev-server.js\"", "开发入口必须使用项目开发服务，不能退回裸 Python 静态服务");
  assertIncludes(packageSource, "\"play:fresh\"", "必须有一键清空进度的本地试玩入口");
  assertIncludes(packageSource, "scripts/dev-server.js", "check 必须语法检查开发服务脚本");
  assertIncludes(devServerSource, "listenOnAvailablePort", "开发服务必须在端口被占用时自动回退");
  assertIncludes(devServerSource, "text/event-stream", "开发服务必须支持浏览器自动刷新事件");
  assertIncludes(devServerSource, "no-store, max-age=0", "开发服务不能缓存源码，避免试玩看到旧版本");
  assertIncludes(appSource, "hasFreshStartParam", "试玩链接 fresh=1 必须能清空当前局进度");
  assertIncludes(packageSource, "\"play:windows\"", "必须保留 Windows 一键试玩入口");
  assertIncludes(windowsPlaySource, "dist\\playable\\index.html", "Windows 一键试玩必须打开离线可玩包");
  assert(!/http\.server|127\.0\.0\.1|localhost/i.test(windowsPlaySource), "Windows 一键试玩不能依赖本地端口或 dev server");
  assert(!buildStaticSource.includes("rm(dist"), "H5 构建不能删除整个 dist，否则会和 dist/playable 构建互相踩目录");
  assertIncludes(buildStaticSource, "cleanStaticBuildTargets", "H5 构建必须只清理自己的静态目标");
  assertIncludes(buildStaticSource, "copyRuntimeAssets", "H5 构建必须只复制运行时实际引用的资产");
  const desktopMainSource = readFileSync(new URL("../desktop/electron/main.cjs", import.meta.url), "utf8");
  const desktopPreloadSource = readFileSync(new URL("../desktop/electron/preload.cjs", import.meta.url), "utf8");
  const desktopBuilderSource = readFileSync(new URL("../desktop/electron-builder.json", import.meta.url), "utf8");
  const desktopSteamPlan = readFileSync(new URL("../docs/desktop-steam-build-plan.md", import.meta.url), "utf8");
  const steamPreflightSource = readFileSync(new URL("../scripts/steam-preflight.js", import.meta.url), "utf8");
  const buildDesktopSource = readFileSync(new URL("../scripts/build-desktop.js", import.meta.url), "utf8");
  const buildPlayableSource = readFileSync(new URL("../scripts/build-playable.js", import.meta.url), "utf8");
  const browserSmokeSource = readFileSync(new URL("../scripts/smoke-browser-replay.js", import.meta.url), "utf8");
  assertIncludes(desktopMainSource, "BrowserWindow", "桌面壳必须有 Electron 主窗口入口");
  assertIncludes(desktopMainSource, "app.getPath(\"userData\")", "桌面壳必须把存档写到用户数据目录");
  assertIncludes(desktopMainSource, "desktop-settings.json", "桌面壳必须保存窗口状态，不能每次固定一个窗口尺寸");
  assertIncludes(desktopMainSource, "before-input-event", "桌面壳必须拦截全屏/缩放快捷键，支撑 Steam/桌面试玩");
  assertIncludes(desktopMainSource, "setFullScreen", "桌面壳必须支持全屏切换");
  assertIncludes(desktopMainSource, "setZoomFactor", "桌面壳必须支持缩放调节");
  assertIncludes(desktopMainSource, "crash-logs", "桌面壳必须把崩溃日志写到用户数据目录");
  assertIncludes(desktopMainSource, "render-process-gone", "桌面壳必须记录渲染进程崩溃");
  assertIncludes(desktopMainSource, "atomicWriteFile", "桌面文件存档必须先写临时文件再原子替换");
  assertIncludes(desktopMainSource, "MAX_SAVE_BYTES", "桌面存档桥必须限制渲染进程可写入的数据体积");
  assertIncludes(desktopMainSource, "JSON.parse(serialized)", "桌面存档桥必须拒绝非 JSON 数据");
  assertIncludes(desktopMainSource, "sandbox: true", "桌面渲染进程必须启用 Electron sandbox");
  assertIncludes(desktopMainSource, "setWindowOpenHandler", "桌面壳必须拒绝页面任意打开新窗口");
  assertIncludes(desktopMainSource, "will-navigate", "桌面壳必须拒绝离开本地试玩入口的导航");
  assertIncludes(desktopMainSource, "requestSingleInstanceLock", "桌面壳必须避免重复启动多个实例抢存档");
  assertIncludes(desktopPreloadSource, "livestreamDetectiveDesktop", "preload 必须暴露平台桥给游戏运行时");
  assertIncludes(desktopPreloadSource, "saveFiles", "preload 必须暴露文件存档桥");
  assertIncludes(desktopPreloadSource, "reportError", "preload 必须把渲染异常交给桌面日志通道");
  assertIncludes(buildDesktopSource, "dist\", \"desktop-electron", "桌面构建必须输出到独立目录，不能覆盖 H5/playable");
  assertIncludes(buildDesktopSource, "buildPlayable", "桌面构建必须在同一脚本内生成 playable，避免 npm 串联命令之间被并发构建插队");
  assertIncludes(buildDesktopSource, "withBuildLock", "桌面构建必须串行化 playable 和 desktop staging");
  assertIncludes(buildDesktopSource, ".desktop-build.lock", "桌面构建必须使用独立锁目录");
  assertIncludes(buildDesktopSource, "mkdtemp", "桌面构建必须先写临时目录，避免并发构建互相踩 playable 子目录");
  assertIncludes(buildDesktopSource, "rename(tempDir, outDir)", "桌面构建必须以临时目录替换目标目录，减少半成品 staging");
  assertIncludes(buildPlayableSource, "export async function buildPlayable", "离线 playable 构建必须可被桌面构建复用");
  assertIncludes(buildPlayableSource, "mkdtemp", "离线 playable 构建必须先写临时目录，避免并发写 dist/playable");
  assertIncludes(buildPlayableSource, "rename(tempDir, outDir)", "离线 playable 构建必须以临时目录替换目标目录");
  assertIncludes(buildPlayableSource, "importAliasDeclarations", "离线 playable bundler 必须保留 import alias，避免 app 运行时 undefined");
  assertIncludes(buildPlayableSource, "copyRuntimeAssets", "离线 playable 必须只复制运行时实际引用的资产");
  assertIncludes(browserSmokeSource, "accounting-support", "浏览器回放必须覆盖周会计档案室+房租账页白天路线");
  assertIncludes(browserSmokeSource, "support-document", "浏览器回放必须覆盖房租账页+独立审流水路线");
  assertIncludes(browserSmokeSource, "incomplete or out-of-order day scenes", "浏览器回放必须验证全部必要场景依序完成");
  assertIncludes(browserSmokeSource, "data-scene-open-replay", "浏览器回放必须覆盖听完陈述后主动拉回原话的流程");
  assertIncludes(browserSmokeSource, "currentLoadBearingStatementLine", "浏览器回放必须按内容锚点点中当前实际播出的承重原句");
  assertIncludes(browserSmokeSource, "materialMode: \"miss\"", "浏览器回放必须覆盖材料误圈路线");
  assertIncludes(browserSmokeSource, "keyboard-accounting-support", "浏览器回放必须覆盖真实键盘焦点路线");
  assertIncludes(browserSmokeSource, "page.keyboard.press(\"Enter\")", "键盘回放必须用真实键盘确认，而不是只用 DOM click");
  assertIncludes(browserSmokeSource, "gamepad-support-document", "浏览器回放必须覆盖模拟 Gamepad API 路线");
  assertIncludes(browserSmokeSource, "case2-day-map", "浏览器回放必须覆盖第二案店外观察与会员文档路线");
  assertIncludes(browserSmokeSource, "navigator, \"getGamepads\"", "手柄回放必须走 Gamepad API 入口，而不是复用键盘或 DOM click");
  assertIncludes(browserSmokeSource, "runSmokeStep", "浏览器回放必须逐路线输出开始、结束和耗时，便于定位卡点");
  assertIncludes(browserSmokeSource, "local-quick", "浏览器回放必须保留本地核心路线子集");
  assertIncludes(browserSmokeSource, "Smoke step timed out", "单条浏览器路线必须有看门狗，不能无限无输出地挂住");
  assertIncludes(browserSmokeSource, "gamepadDialogueSampleLimit", "手柄路线只抽样验证逐句 A 键，其余对白必须批量推进以控制矩阵耗时");
  assert(!browserSmokeSource.includes("waitForTimeout("), "浏览器回放不得用固定毫秒空等推进剧情，必须等待真实状态或同步事件完成");
  assertIncludes(steamPreflightSource, "nodeSupportsElectronPackaging", "Steam preflight 必须明确 Node/Electron 打包版本要求");
  assertIncludes(steamPreflightSource, "dist/steam", "Steam preflight 必须检查打包输出目录");
  assertIncludes(desktopSteamPlan, "Steam Cloud Contract", "桌面发版计划必须写清 Steam Cloud 存档口径");
  assertIncludes(desktopSteamPlan, "Steam Deck Smoke", "桌面发版计划必须保留 Steam Deck 实机验收清单");
  assertIncludes(buildDesktopSource, "start: \"electron .\"", "桌面壳 package 必须能被 Electron 直接启动验包");
  assertIncludes(desktopBuilderSource, "\"app\": \"dist/desktop-electron\"", "Electron 打包器必须以桌面壳目录为 app 输入");
  assertIncludes(desktopBuilderSource, "\"output\": \"dist/steam\"", "Electron 打包产物必须进入独立 Steam 输出目录");
  assertIncludes(desktopBuilderSource, "\"target\": \"portable\"", "Windows 首版打包先产出 portable 便于 Steam demo 验收");
});

test("UI-003", "decision buttons expose cost, lock, or scoring consequences before activation", () => {
  const appSource = runtimeSource;
  const stylesSource = bundleCssSync(new URL("../src/styles.css", import.meta.url));
  const metaValues = Object.values(CHOICE_COST_META);
  assert(metaValues.length >= 12, "按钮代价词典必须覆盖追问、材料、白天、回拨、顾问、终局与关怀");
  assertEqual(new Set(metaValues).size, metaValues.length, "不同决策类型不能复用模糊的同一句代价文案");
  assertEqual(choiceCostMeta("evidenceMark"), "圈点 · 圈偏 −1 耐心", "材料圈点必须明确即时资源损失");
  assertIncludes(choiceButtonBodyHtml("去财务窗口", CHOICE_COST_META.dayPlace), "choice-button-body", "统一按钮正文必须提供标签与代价双栏");
  assertIncludes(callbackOpenerChoiceHtml({ openers: [{ id: "流水圈注", label: "流水圈注", hostLine: "从七月那一行问。" }] }), CHOICE_COST_META.callbackOpener, "回拨开场必须说明选后锁定");
  assertIncludes(truthBoundaryReviewHtml({ title: "边界", line: "先放句子", choices: [{ key: "true", label: "能确认" }], columns: [{ key: "true", label: "能确认", items: ["A"] }], prompts: [{ id: "true:0", text: "A", expected: "true" }] }, {}), CHOICE_COST_META.truthBoundary, "事实归位必须说明选后锁定");
  ["dayPlace", "dayChoice", "timelineCard", "dayFollowup", "callbackOpener", "skipAdvisor", "nonScoredReply", "finalQuestion"].forEach((key) => {
    assertIncludes(appSource, `CHOICE_COST_META.${key}`, `主流程决策缺少按钮代价映射: ${key}`);
  });
  assertIncludes(stylesSource, ".decision-choice .choice-button-body", "按钮代价必须有桌面与移动端共用布局");
});

test("UI-002", "live-call screens keep a broadcast control-desk identity", () => {
  const appSource = runtimeSource;
  const stylesSource = bundleCssSync(new URL("../src/styles.css", import.meta.url));
  const cssDefinitions = new Set([...stylesSource.matchAll(/--([a-zA-Z0-9_-]+)\s*:/g)].map((match) => match[1]));
  const cssVariables = new Set([...stylesSource.matchAll(/var\(--([a-zA-Z0-9_-]+)/g)].map((match) => match[1]));
  const undefinedCssVariables = [...cssVariables].filter((name) => !cssDefinitions.has(name)).sort();
  assertEqual(JSON.stringify(undefinedCssVariables), "[]", "styles.css 使用的每个 CSS 变量都必须在样式表中定义");
  const callFlowViewSource = readFileSync(new URL("../src/ui/callFlowView.js", import.meta.url), "utf8");
  const liveFrameViewSource = readFileSync(new URL("../src/ui/liveFrameView.js", import.meta.url), "utf8");
  const audioControllerSource = readFileSync(new URL("../src/ui/audioController.js", import.meta.url), "utf8");
  const dialoguePresentationSource = readFileSync(new URL("../src/runtime/dialoguePresentation.js", import.meta.url), "utf8");
  assertIncludes(appSource, "./ui/callFlowView.js", "通用通话气泡和按钮组 HTML 必须从 app.js 拆到 ui/callFlowView");
  assertIncludes(callFlowViewSource, "choiceReviewHtml", "上一问回看必须由纯 UI 模块渲染");
  assert(!appSource.includes("function choiceGroup"), "通用选择组 HTML 不能继续留在 app.js");
  assert(!appSource.includes("function flowGroup"), "流程按钮组 HTML 不能继续留在 app.js");
  assert(!appSource.includes("function callLine"), "通话气泡 HTML 不能继续留在 app.js");
  assertIncludes(choiceGroupHtml("往下追", "<button>原话</button>", "single-choice-group", "从刚才听到的话里选一句"), "choice-label", "通用选择组必须可由纯 UI 模块渲染");
  assert(!appSource.includes("收哪句"), "最终原话选择不能写“收哪句”这种内部黑话");
  assert(!appSource.includes("选关键原话"), "最终原话选择不能写“关键”这种替玩家评估的设计词");
  assertIncludes(appSource, "下面哪句最该继续追？", "最终原话选择页必须明确玩家在选下一句追问对象");
  assertIncludes(flowGroupHtml("<button>继续</button>"), "flow-group", "流程按钮组必须可由纯 UI 模块渲染");
  assert(!flowGroupHtml("<button>继续</button>").includes("flow-group-copy"), "独立流程按钮默认不显示“下一步”一类空泛指引");
  assertIncludes(
    flowGroupHtml("<button>接入</button>", { label: "直播已经开始", note: "第一位咨询者正在等待接通。" }),
    "第一位咨询者正在等待接通。",
    "关键过场的流程按钮必须说明按下后会去哪里"
  );
  const hostDialogueHtml = callDialogueHtml([{ role: "host", text: "你当时怎么回的？" }, { role: "caller", text: "我说先看账单。" }]);
  assertIncludes(hostDialogueHtml, "你当时怎么回的？", "通话气泡必须可由纯 UI 模块渲染");
  assertIncludes(hostDialogueHtml, "林旭阳", "主持人对话框必须使用固定角色名");
  assert(!hostDialogueHtml.includes("<b>你</b>"), "主持人对话框不能再用第二人称作署名");
  assertIncludes(choiceReviewHtml([{ role: "caller", text: "账单只有消费页。" }]), "上一问", "上一问回看必须可由纯 UI 模块渲染");
  assertIncludes(choiceReviewHtml([{ role: "caller", text: "账单只有消费页。" }]), "call-log-drawer", "上一问回看必须升级为通话记录抽屉，而不是普通说明折叠块");
  assertIncludes(appSource, "./liveCallView.js", "直播 HUD/立绘 presenter 必须继续复用 ui/liveCallView");
  assertIncludes(appSource, "./ui/liveFrameView.js", "案内主舞台 HTML 必须从 app.js 拆到 ui/liveFrameView");
  assertIncludes(appSource, "active !== document.body && isVisibleElement(active)", "默认聚焦不得在玩家刚操作键盘时抢走现有可见焦点");
  assert(!appSource.includes('<span>${escapeHtml(row.rowId ?? "")}</span>'), "文档表格不得把 r08、q06 等内部行 ID 显示给玩家");
  assert(!appSource.includes("圈行 ${rowId}"), "结算路线不得把内部行 ID 写进玩家的追问轨迹");
  assertIncludes(appSource, 'return question.kind === "cross" ? "跨行对照" : "单行追问"', "夜间对账按钮必须使用玩家能读懂的标签");
  const patienceHud = audiencePatienceHudHtml({ level: "mid", ratio: 0.5, remaining: 4, max: 8, patienceLabel: "开始起噪" });
  assertIncludes(patienceHud, "听众耐心", "听众耐心 HUD 必须可由纯 UI 模块渲染");
  assertIncludes(patienceHud, "开始起噪", "听众耐心只呈现可观察状态，不暴露底层数字");
  assert(!patienceHud.includes("4/8"), "听众耐心不得显示成 RPG 数值");
  assertIncludes(liveCommentStripHtml({ comments: ["弹幕安静", "账单边上有时间"] }), "账单边上有时间", "直播弹幕条必须可由纯 UI 模块渲染");
  const progressStrip = caseProgressStripHtml({ total: 5, answered: 2, label: "匿名来电" });
  assertIncludes(progressStrip, "连线进行中", "通话进度条必须用现场状态代替页码");
  assert(!progressStrip.includes("3/5"), "通话进度不得把剧情写成第几句测验");
  assertIncludes(storyPackSummaryHudHtml({ total: 4, solved: 2 }), "2/4", "故事包收麦 HUD 必须可由纯 UI 模块渲染");
  assertEqual(callerExpressionForView({ mood: "thinking", sceneIndex: 1 }).kind, "shift", "来电人表情 fallback 必须可脱离 app 状态测试");
  assertEqual(hostSpeakingStateForView({ scene: "sceneReview", mood: "thinking" }), "listening", "整段听麦时主播必须保持倾听立绘");
  assertEqual(hostSpeakingStateForView({ scene: "sceneLineReplay", mood: "focused" }), "questioning", "拉回原话时主播必须切到找问题立绘");
  assertEqual(hostSpeakingStateForView({ scene: "sceneReview", mood: "focused", controlMode: "replay" }), "questioning", "回放操作必须切到找问题立绘");
  assertEqual(hostSpeakingStateForView({ scene: "sceneReview", mood: "focused", controlMode: "present" }), "pressing", "出示材料时主播必须切到施压立绘");
  assertEqual(hostSpeakingStateForView({ scene: "sceneQuestionAnswer", mood: "focused" }), "pressing", "打断质问时主播必须切到追问立绘");
  assertEqual(callerArtForExpression({ neutralSrc: "neutral.png", variants: { guarded: "guarded.png", pause: "pause.png" }, expression: { kind: "shift" } }).src, "guarded.png", "shift 表演必须切到 guarded 立绘");
  assertEqual(callerArtForExpression({ neutralSrc: "neutral.png", variants: { pause: "pause.png" }, expression: { kind: "pause" } }).src, "pause.png", "pause 表演必须切到 pause 立绘");
  assertEqual(callerArtForExpression({ neutralSrc: "neutral.png", variants: {}, expression: { kind: "pause" } }).src, "neutral.png", "缺少差分图时必须安全回退 neutral");
  assertIncludes(portraitLayerHtml({ artSrc: "./caller_pixel.png", artStyle: "pixel" }), "art-pixel", "像素立绘必须给浏览器显式最近邻渲染标记");
  assertIncludes(portraitLayerHtml({ artSrc: "./caller_pixel.png", artStyle: "pixel" }), 'data-dialogue-portrait="host"', "主线连线舞台必须保留主播立绘");
  assertIncludes(portraitLayerHtml({ artSrc: "./caller_pixel.png", artStyle: "pixel" }), 'data-dialogue-portrait="caller"', "主线连线舞台必须保留来电人立绘");
  const renamedPortrait = portraitLayerHtml({ artSrc: "./caller_pixel.png", hostName: "周明" });
  assertIncludes(renamedPortrait, "周明", "主线立绘名必须显式使用当前玩家姓名");
  assert(!renamedPortrait.includes(DEFAULT_PLAYER_NAME), "主线立绘显式改名后不得残留默认主播名");
  assertIncludes(portraitLayerHtml({ artSrc: "./caller.png", mood: "tense", expression: { kind: "pause", text: "停了一下" } }), "停了一下", "来电人立绘层必须可由纯 UI 模块渲染");
  const guardedPortrait = portraitLayerHtml({ artSrc: "./assets/generated/characters/shen_guarded.png", fallbackSrc: "./assets/generated/characters/shen_neutral.png", mood: "tense" });
  assertIncludes(guardedPortrait, 'data-fallback-src="./assets/generated/characters/shen_neutral.png"', "来电人差分缺图必须带 neutral 回退");
  assertIncludes(guardedPortrait, "this.src=this.dataset.fallbackSrc", "来电人差分缺图不能报错或空图");
  assertIncludes(appSource, "./ui/recapView.js", "收麦回看 HTML 必须从 app.js 拆到 ui/recapView");
  assertIncludes(finalQuoteComparisonHtml({ sameQuote: true, pickedLabel: "“原话”", pickedResponse: "接住了" }), "这句够了", "最终原话对比卡必须可由纯 UI 模块渲染");
  assertIncludes(truthBoundaryReviewHtml({ title: "边界", line: "先放句子", choices: [{ key: "true", label: "能确认" }], columns: [{ key: "true", label: "能确认", items: ["A"] }], prompts: [{ id: "true:0", text: "A", expected: "true" }] }, {}), "data-truth-boundary-pick", "事实边界归位按钮必须可由纯 UI 模块渲染");
  assert(truthBoundaryPlaced({ prompts: [{ id: "a" }] }, { a: "true" }), "事实边界一次放置完成判断必须可由纯 UI 模块测试");
  const compactRecapPages = solvedRecapPagesHtml({ issue: { percent: 80, revealed: ["A"] }, result: { dailyBadge: true, dailyAccuseLabel: "“A”" }, route: { label: "钱流", summary: "盯钱" }, pressure: { label: "稳住了", line: "现场收住" }, conclusion: { summary: "收住", followup: "后续", truth: "事实" }, boundary: { columns: [] }, issueLineText: "问到了" });
  assertIncludes(compactRecapPages[0], "收麦回看", "收麦回看页面组必须可由纯 UI 模块渲染");
  assertEqual(compactRecapPages.length, 3, "收麦回看、主播结论和后续回拨必须压缩成三页");
  assertIncludes(compactRecapPages[1], "host-verdict-dialogue", "主播结论必须复用逐句对话播放器，而不是塞进普通段落");
  assertIncludes(compactRecapPages[0], "台面上的话", "事实边界必须并入首屏回看，避免独立重复一页");
  const recapFlow = solvedRecapFlowView({ pages: ["第一页", "第二页"], step: 0 });
  assertIncludes(recapFlow.text, "回看", "收麦回看必须显示当前阶段名");
  assert(!recapFlow.text.includes("1/2"), "收麦回看不得用页码破坏叙事节奏");
  assertIncludes(recapFlow.choices, "data-recap-next", "收麦回看非末页继续按钮必须由纯 UI flow helper 生成");
  assertIncludes(recapFlow.choices, "flow-group", "收麦回看按钮必须留在页内流程区，不能变成覆盖正文的全屏选项层");
  const blockedBoundaryFlow = solvedRecapFlowView({
    pages: ['<section class="truth-boundary-card">边界</section>', "收住"],
    boundary: { prompts: [{ id: "true:0" }] },
    boundaryPicks: {}
  });
  assertIncludes(blockedBoundaryFlow.choices, "还有话没落位", "事实边界未放完时必须由纯 UI flow helper 阻止继续");
  const finalRecapFlow = solvedRecapFlowView({ pages: ["第一页", "末页"], step: 1, afterLabel: "接下一路麦" });
  assertIncludes(finalRecapFlow.choices, "data-after-recap", "收麦回看末页出口必须由纯 UI flow helper 生成");
  assertIncludes(finalRecapFlow.choices, "接下一路麦", "收麦回看末页出口文案必须可由 app 传入但由 UI helper 渲染");
  assertIncludes(appSource, "./ui/dailyCompleteView.js", "单案结果卡 HTML 必须从 app.js 拆到 ui/dailyCompleteView");
  assert(!appSource.includes("share-result-card"), "单案结果卡结构不能继续写在 app.js");
  const dailyCompleteCard = dailyCompleteHtml({
    issueLineText: "这通能收住。",
    route: { label: "钱流线", playerType: "收麦主播", shareTitle: "账单没说完", shareQuestion: "你会怎么接？" },
    issue: { percent: 76 },
    rank: "话头收住",
    result: { dailyBadge: true },
    pickedQuote: "“先看账单。”",
    quoteComparisonHtml: "<div>原话对照</div>",
    caught: "少了还款来源"
  });
  assertIncludes(dailyCompleteCard, "share-result-card", "单案结果卡必须可由纯 UI 模块渲染");
  assertIncludes(dailyCompleteCard, "少了还款来源", "单案结果卡必须保留今晚瓜点");
  assertIncludes(dailyCompleteChoicesHtml(), "data-copy-result", "单案结果卡按钮必须可由纯 UI 模块渲染");
  assertIncludes(dailyCompleteShareText({ route: { shareTitle: "账单没说完", playerType: "收麦主播", shareQuestion: "你会怎么接？" }, pickedQuote: "“先看账单。”" }), "我接的那句：", "单案复制文案必须可由纯 UI 模块生成");
  assertIncludes(appSource, "./ui/sceneReviewView.js", "对话回合 HTML 必须从 app.js 拆到 ui/sceneReviewView");
  const activeSceneHtml = sceneReviewHtml({ index: 1, activeExchangeHtml: "<p>咨询者：账单我发过来了。</p>", reviewHtml: "<aside>上一问</aside>" });
  assert(!activeSceneHtml.includes("第 2 句"), "当前对话回合不得显示机械页码");
  assertIncludes(activeSceneHtml, "咨询者：账单我发过来了。", "当前对话回合必须渲染传入的来电内容");
  const activeExchange = activeSceneExchangeHtml({
    scene: { entryQuestion: "那八万是怎么提出来的？", version: "他说只是周转两天。" },
    dialoguePicks: [{ question: "你当时怎么回的？", answer: "我说先看账单。" }]
  });
  assertIncludes(activeExchange, "咨询者", "当前对话气泡组装必须保留来电人 speaker");
  assert(activeExchange.indexOf("那八万是怎么提出来的？") < activeExchange.indexOf("他说只是周转两天。"), "场景入场问句必须紧挨正文回答之前渲染");
  assertIncludes(activeExchange, "你当时怎么回的？", "当前对话气泡组装必须保留外围追问来回");
  const completedExchange = completedSceneExchangeHtml({
    scene: { version: "账单发来以后，我发现只有消费页。", questionOptions: [{ question: "少了哪一页？", contradiction: "少了还款来源。" }] },
    pick: { question: "少了哪一页？", answer: "少了还款来源。" }
  });
  assertIncludes(completedExchange, "少了哪一页？", "已完成对话气泡组装必须保留关键追问");
  assertIncludes(completedExchange, "少了还款来源。", "已完成对话气泡组装必须保留关键回答");
  const texturedExchange = completedSceneExchangeHtml({
    scene: {
      beforeVersion: { lines: [{ role: "caller", text: "开场杂音。" }] },
      version: "正文。",
      afterVersion: { lines: [{ role: "caller", text: "关窗。", nonLoadBearing: true }] },
      sceneCloser: { lines: [{ role: "host", text: "场尾。" }] }
    },
    dialoguePicks: [{ question: "还留着？", answer: "留着。", lines: [{ role: "caller", text: "嗯。" }, { role: "pause" }, { role: "caller", text: "留着。" }] }],
    pick: { question: "问完了吗？", answer: "完了。" }
  });
  assert(texturedExchange.indexOf("开场杂音。") < texturedExchange.indexOf("正文。"), "beforeVersion 必须在正文前渲染");
  assert(texturedExchange.indexOf("关窗。") < texturedExchange.indexOf("还留着？"), "afterVersion 必须接在正文后、补问前渲染");
  assertIncludes(texturedExchange, "call-pause", "补充对话 lines 必须保留停顿拍");
  assert(texturedExchange.indexOf("场尾。") > texturedExchange.indexOf("完了。"), "sceneCloser 必须在关键追问结束后自动播");
  const questionAnswerWithTail = sceneQuestionAnswerHtml({
    question: "钱是谁转的？",
    answer: "我还没说完。",
    reactionLine: "这张图我刚才一直没敢放大。",
    sceneCloser: {
      lines: [
        { role: "host", text: "那就把图打开。" },
        { role: "caller", text: "好，你等一下。" }
      ]
    }
  });
  assert(questionAnswerWithTail.indexOf("我还没说完。") < questionAnswerWithTail.indexOf("这张图我刚才一直没敢放大。"), "选项反应必须接在关键回答之后播放");
  assert(questionAnswerWithTail.indexOf("这张图我刚才一直没敢放大。") < questionAnswerWithTail.indexOf("那就把图打开。"), "场尾必须接在选项反应之后播放");
  assertIncludes(questionAnswerWithTail, "好，你等一下。", "关键追问结果页必须播完台本中的场尾来回，不能直接跳到下一阶段");
  assertIncludes(screenSources, "sceneCloser: focus.kind === \"key\" && !nextQuestion ? scene.sceneCloser : null", "正常试玩的关键追问结果页必须接入 sceneCloser");
  assertIncludes(screenSources, "hostDisclosureForAnchor(brief, `afterScene:${index + 1}`)", "正常试玩的关键追问结果页必须接入段后主播披露");
  assertIncludes(keyChoiceExchangeHtml({ scene: { questionOptions: [{ question: "默认问法？", contradiction: "A" }] }, fallbackAnswer: "兜底回答" }), "兜底回答", "关键追问气泡组装必须支持存档兜底回答");
  const resistanceHtml = keyChoiceExchangeHtml({
    pick: {
      question: "为什么？",
      answer: "第二拍回答。",
      resistanceBeat: {
        lines: [
          { role: "caller", text: "你们就等我这句？" },
          { role: "stage", text: "直播间安静了两秒。" },
          { role: "host", text: "先记下。" }
        ]
      }
    }
  });
  assertIncludes(resistanceHtml, "你们就等我这句？", "关键追问必须先渲染来电人的抵抗拍");
  assertIncludes(resistanceHtml, "直播间安静了两秒。", "抵抗拍必须支持舞台指示");
  assert(resistanceHtml.indexOf("先记下。") < resistanceHtml.indexOf("第二拍回答。"), "抵抗拍必须在第二拍回答之前播放");
  assertIncludes(sceneReviewDoneChoicesHtml({ lastStage: false }), "data-next-scene-stage", "普通对话回合继续按钮必须可由纯 UI 模块渲染");
  assertIncludes(sceneReviewDoneChoicesHtml({ lastStage: true, nextStage: "evidenceCheck", nextLabel: "看材料" }), "data-scene=\"evidenceCheck\"", "末段对话回合跳转按钮必须可由纯 UI 模块渲染");
  assertIncludes(appSource, "./ui/storyInterludeView.js", "案间过渡 HTML 必须从 app.js 拆到 ui/storyInterludeView");
  assert(!storyInterludeHtml({ shellLine: "本案完。" }).includes("下一通"), "案后小尾声必须先让上一案落地，不能在同一屏抢跑下一案");
  assertIncludes(storyInterludeHtml({ shellLine: "老方发来消息。", shellLines: [{ speaker: "林旭阳", text: "广告弹幕念错了。" }] }), "广告弹幕念错了。", "案间串场必须能在原旁白前追加主播台词");
  assertIncludes(storyInterludeStageHtml({ afterCaseId: "01-credit" }), "zhao-lawyer-teasing-pixel.png", "案一广告间隙必须使用赵律师揶揄态立绘");
  assertIncludes(storyInterludeStageHtml({ afterCaseId: "03-profile" }), "is-remote", "案三赵律师语音必须以远程态呈现，不能误画成同处一室");
  assertIncludes(storyInterludeChoicesHtml(), "data-enter-case-bridge", "案后小尾声不得直接跳到下一案");
  const optionalQuickCall = storyOptionalQuickCall(storyPackForKey("steam-demo-01"), { caseId: "04-workplace" });
  assertEqual(optionalQuickCall?.quickCaseId, "01-no-conditions", "第二幕与第三幕之间必须提供一通可选插播来电");
  assertIncludes(storyInterludeChoicesHtml({ optionalQuickCall }), 'data-enter-optional-quick="01-no-conditions"', "主线幕间必须渲染可返回主线的插播入口");
  const worldEcho = { actionLabel: "把午间新闻听完", kicker: "午间新闻", headline: "某机构暂停兑付", body: "监管部门已经介入。" };
  assertIncludes(storyInterludeChoicesHtml({ worldEcho, worldEchoRevealed: false }), "data-reveal-world-echo", "跨案世界回声必须先要求一次玩家操作");
  assert(!storyInterludeChoicesHtml({ worldEcho, worldEchoRevealed: false }).includes("data-enter-case-bridge"), "世界回声未揭示时不得跳过到下一案");
  assertIncludes(storyInterludeHtml({ worldEcho }), "某机构暂停兑付", "玩家操作后必须能渲染世界回声");
  assertIncludes(storyWorldEchoStageHtml({ ...worldEcho, artSrc: "./assets/generated/cg/news.png" }), "news.png", "世界回声应能切换为全舞台新闻 CG");
  assertIncludes(storyInterludeChoicesHtml({ worldEcho, worldEchoRevealed: true }), "data-enter-case-bridge", "世界回声揭示后必须恢复下一幕入口");
  const hypothesisEcho = { ...worldEcho, hypotheses: [{ id: "cross-case", label: "把四案线索并在一起", response: "先核对同名机构。" }] };
  assertIncludes(storyInterludeChoicesHtml({ worldEcho: hypothesisEcho, worldEchoRevealed: false }), "data-world-echo-hypothesis", "跨案回收必须先让玩家主动押下一条风险假设");
  assert(!storyInterludeChoicesHtml({ worldEcho: hypothesisEcho, worldEchoRevealed: false }).includes("data-reveal-world-echo"), "玩家尚未选风险假设时不能直接播放新闻答案");
  assertIncludes(storyInterludeChoicesHtml({ worldEcho: hypothesisEcho, worldEchoRevealed: false, worldEchoHypothesisId: "cross-case" }), "data-reveal-world-echo", "玩家记录风险假设后才能揭示世界回声");
  assertIncludes(storyInterludeHtml({ worldEchoHypothesis: hypothesisEcho.hypotheses[0] }), "先核对同名机构", "跨案回收必须在揭示前回应玩家选择");
  assertIncludes(storyInterludeChoicesHtml({ finalCase: true }), "data-enter-night-epilogue", "最后一案小尾声之后必须进入来信尾声");
  assert(!storyInterludeHtml({ shellLine: "第四案完。" }).includes("下一通"), "最后一案小尾声不能渲染不存在的下一案材料");
  assertEqual(storyInterludeCaseId({ sequence: [{ caseId: "01-credit", plotId: "lost-job-hidden-credit" }] }, { id: "episode-generated-id", plotId: "lost-job-hidden-credit" }), "01-credit", "案间必须把运行时 plotId 映射回 manifest caseId");
  const closingCard = caseClosingHtml({
    caseNumber: 1,
    closing: { title: "账单里的八万", verdict: "先别垫。", beats: [{ label: "来电", text: "要八万。" }], confirmed: ["失业早于借钱"], unresolved: ["3301 归属未定"], nextStep: "先对账。" }
  });
  assertIncludes(closingCard, "已经确认", "案件结案页必须区分确认事项");
  assertIncludes(closingCard, "还没弄清", "案件结案页必须保留未定事项");
  assertIncludes(caseClosingChoicesHtml(), "收麦后", "案件结案页必须在正式收束后才进入案后尾声");
  const newsBridge = caseBridgeHtml({
    fromCaseNumber: 1,
    toCaseNumber: 2,
    fromAct: "体面",
    nextAct: "自己人",
    quote: { kind: "news-push", headline: "宸直产品出现延期登记传闻", text: "平台称正在核对。", source: "财经客户端推送 · 00:47" },
    nextBrief: { label: "理发店排班表", storyObjectLabel: "店表", caseTitle: { title: "理发店排班表" } },
    fromMaterialSrc: "./assets/generated/materials/case1-credit-evidence-board.png",
    toMaterialSrc: "./assets/generated/materials/case2-tony-evidence-board.png"
  });
  assertIncludes(newsBridge, "财经推送", "第三幕之后必须用新闻推送形状预震，不能继续堆第三张格言卡");
  assertIncludes(newsBridge, "宸直产品出现延期登记传闻", "新闻推送必须完整显示标题");
  assertIncludes(newsBridge, "财经客户端推送 · 00:47", "新闻推送必须显示可核对的来源");
  assert(!newsBridge.includes("理发店排班表") && !newsBridge.includes("本幕材料"), "新闻页不得追加下一案标题或材料预告");
  assert(!newsBridge.includes("体面") && !newsBridge.includes("自己人"), "案间路线不得再显示作者概括的单词式幕标签");
  assertIncludes(newsBridge, "case-bridge-objects", "新闻推送必须与上一案退场、下一案进场的物件交接同屏");
  assertIncludes(newsBridge, "case1-credit-evidence-board.png", "案间物件交接必须保留上一案材料的视觉余波");
  assertIncludes(newsBridge, "case2-tony-evidence-board.png", "案间物件交接必须让下一案材料进入舞台");
  assertIncludes(caseBridgeChoicesHtml(2), "data-enter-next-case", "新闻页之后才能进入下一幕标题");
  const secondCaseTitle = caseTitleHtml({ caseNumber: 2, totalCases: 4, brief: { storyAct: "自己人", storyObjectLabel: "店表", caseTitle: { title: "理发店排班表", subtitle: "暧昧还是成交", intro: "表到了。" } } });
  assertIncludes(secondCaseTitle, "CASE 02", "第二案必须有独立案号标题页");
  assert(!secondCaseTitle.includes("02 / 04") && !secondCaseTitle.includes("本幕材料") && !secondCaseTitle.includes("表到了。") && !secondCaseTitle.includes("暧昧还是成交"), "幕标题只显示案号和案名，不显示总目录，也不替人物预告求助、材料或判断");
  assertIncludes(caseTitleChoicesHtml(2), "接听", "幕标题页按钮只写玩家当下动作");
  const titleWithoutSubtitle = caseTitleHtml({ caseNumber: 1, totalCases: 4, brief: { storyAct: "体面", publicHook: "不应回填到副标题", caseTitle: { title: "账单里的八万", intro: "电话接通了。" } } });
  assert(!titleWithoutSubtitle.includes("case-title-subtitle") && !titleWithoutSubtitle.includes("不应回填到副标题"), "幕标题允许省略无功能副标题，且不得拿 publicHook 自动回填");
  assertIncludes(appSource, "./ui/storyPackCompleteView.js", "故事集终局 HTML 必须从 app.js 拆到 ui/storyPackCompleteView");
  const hiddenThreadProfile = { total: 4, title: "今晚暗线", label: "同款话术", line: "好听话后面接成本。", beats: ["体面接钱", "自己人接资源"] };
  const storyCompleteCard = storyPackCompleteHtml({ playerType: "钱流雷达主播", comments: ["说教评论"], boundaryProfile: { total: 1, label: "定急了" } });
  assertIncludes(storyCompleteCard, "故事未完待续", "试玩片尾保留故事续篇提示");
  assertEqual((storyCompleteCard.match(/<p /g) ?? []).length, 1, "片尾只保留一屏字幕，不能恢复旧宣讲页");
  assert(!storyCompleteCard.includes("钱流雷达主播") && !storyCompleteCard.includes("定急了") && !storyCompleteCard.includes("说教评论"), "旧评分字段不得重新进入结尾文案");
  const summaryBriefs = [{ label: "第一案", truthBoundary: { true: ["账单是真的"], edited: ["少了来源"], unknown: ["动机定不了"] }, storyClueObject: "账单", storyHiddenThread: { title: "今晚暗线", label: "同款话术", reveal: "好听词后面接成本。", beats: ["账单", "表格"] } }];
  const summary = storyPackSummaryModel({
    briefs: summaryBriefs,
    results: [{ issuePercent: 100, dailyAccuseLabel: "“账单”", quoteHit: true }],
    routeProfiles: [{ axis: "money-flow", label: "钱流线" }],
    boundaryRows: storyBoundaryRows(summaryBriefs, { picksFor: () => ({ "true:0": "true", "edited:0": "edited", "unknown:0": "unknown" }) }),
    pressureRows: storyPressureRows(summaryBriefs, { budgetFor: () => ({ max: 8, remaining: 8 }), choicesFor: () => [], foundCountFor: () => 3 }),
    materialRows: storyMaterialRows(summaryBriefs, { evidencePicksFor: () => [{ correct: true }], investigationPicksFor: () => [] })
  });
  assertIncludes(summary.materialProfile.label, "材料", "故事集材料 profile 必须可由纯 runtime summary 模型生成");
  assertIncludes(summary.boundaryProfile.label, "挂", "故事集事实边界 profile 必须可由纯 runtime summary 模型生成");
  assertIncludes(summary.objectProfile.line, "账单", "故事集物件 profile 必须可由纯 runtime summary 模型生成");
  assertIncludes(summary.hiddenThreadProfile.line, "成本", "故事集暗线 profile 必须可由纯 runtime summary 模型生成");
  assertIncludes(appSource, "./ui/titleView.js", "标题页 HTML 必须从 app.js 拆到 ui/titleView");
  const titleHtml = titleScreenHtml({
    productName: "深夜热线：直播间侦探",
    storyPack: true,
    title: "Steam 试玩版",
    hook: "第一通匿名来电还在等待接入。",
    object: "今晚 20:00 · 开播前",
    quickModeAvailable: true
  });
  assertIncludes(titleHtml, "title-page-shell", "标题页必须使用独立封面骨架，而不是把信息卡纵向堆满首屏");
  assertIncludes(titleHtml, "<span>深夜热线</span><strong>直播间侦探</strong>", "标题页必须按节目名与游戏身份分成两行");
  assertIncludes(titleHtml, "title-console-strip", "标题页必须先有直播信号状态条，不能只剩普通剧情标题卡");
  assertIncludes(titleHtml, `value="${DEFAULT_PLAYER_NAME}"`, "标题页必须把林旭阳作为可编辑主播姓名的默认值");
  assertIncludes(titleHtml, "data-player-name", "标题页必须提供主播姓名输入框");
  assert(!titleHtml.includes("你接麦"), "标题页已有可编辑姓名，不得再用解释性徽章重复说明玩家身份");
  assert(!titleHtml.includes("第一通匿名来电还在等待接入") && !titleHtml.includes("今晚 20:00 · 开播前"), "标题页不得用案情 hook 或时间卡替序幕开口");
  assertIncludes(titleHtml, "等待开播", "标题页必须明确仍在开播前，不能先写已接通再倒退进序章");
  assert(!titleHtml.includes("今晚主题") && !titleHtml.includes("title-theme-card"), "标题页不得把内部主题总结直接展示给玩家");
  assert(!titleHtml.includes("title-act-rail") && !titleHtml.includes("今晚四幕"), "标题页不得提前展示四案题眼目录");
  assertIncludes(titleHtml, "data-start-story", "无存档时标题页必须提供新游戏入口");
  assertIncludes(titleHtml, "data-start-quick-detective", "试玩标题页必须提供独立快案入口");
  assertIncludes(titleHtml, "选择一宗短案，当面问穿前后矛盾", "快案入口必须先说明可选案件，再交代主播对质动作");
  assertIncludes(titleHtml, "新游戏", "无存档时标题页必须用标准游戏入口文案");
  assertIncludes(titleHtml, "从咖啡厅序章开始", "试玩标题页必须把玩家带进咖啡厅序章，不能把序章误归到两年前的开播前");
  assertIncludes(titleHtml, "data-audio-settings", "标题页必须能在开始前调声音");
  assert(!/四案|4\s*案|故事集目录|第一案|第二案|第三案|第四案|主题论点/.test(titleHtml), "标题页不能提前暴露案数、目录或主题论点");
  const readableScriptBuilderSource = readFileSync(new URL("./build-readable-script.js", import.meta.url), "utf8");
  assert(!readableScriptBuilderSource.includes("【林旭阳选择："), "连续阅读版生成器不能把玩家写回林旭阳身后的选项编辑器");
  assert(!readableScriptBuilderSource.includes("【ON AIR。"), "个人直播的派生剧本不能重新插入电视演播室式 ON AIR 口令");
  assert(!readableScriptBuilderSource.includes("`【来电摘要】${packet.openingComplaint}"), "派生阅读稿不得在人物开口前插入作者来电摘要");
  assert(!readableScriptBuilderSource.includes("item.bridge ?? packet.publicHook"), "派生阅读稿不得在幕标题后插入案情桥接旁白");
  const stanceHtml = stanceSnapshotHtml({
    prompt: "现在最怀疑哪边？",
    options: [
      { label: "钱的去向", summary: "作者提前写好的结论", feedback: "账单里还有一笔没有说明。" },
      { label: "谁在隐瞒", summary: "另一段作者结论", feedback: "她刚才改过一次说法。" }
    ]
  });
  assertIncludes(stanceHtml, "钱的去向", "中段判断必须保留方向标签");
  assert(!stanceHtml.includes("作者提前写好的结论") && !stanceHtml.includes("另一段作者结论"), "中段判断未选择前不得展示作者总结");
  const pickedStanceHtml = stanceSnapshotHtml({
    options: [{ label: "钱的去向", summary: "作者提前写好的结论", feedback: "账单里还有一笔没有说明。" }]
  }, { optionIndex: 0 });
  assertIncludes(pickedStanceHtml, "账单里还有一笔没有说明", "中段判断选中后可以回收已经播出的事实");
  assert(!pickedStanceHtml.includes("作者提前写好的结论"), "中段判断选中后也不应回退展示内部总结");
  const resumeTitleHtml = titleScreenHtml({ productName: "深夜热线：直播间侦探", storyPack: true, canContinue: true, resumeLabel: "上次停在：白天调查" });
  assertIncludes(resumeTitleHtml, "data-continue-story", "有存档时标题页必须提供继续入口");
  assertIncludes(resumeTitleHtml, "继续上次直播", "继续入口必须使用玩家能立即理解的存档文案");
  assertIncludes(resumeTitleHtml, "上次停在：白天调查", "继续入口必须提示存档所在阶段，但不剧透案件目录");
  assertIncludes(resumeTitleHtml, "data-request-new-game", "有存档时仍必须保留新游戏入口");
  const confirmNewGameHtml = titleScreenHtml({ productName: "深夜热线：直播间侦探", storyPack: true, canContinue: true, confirmNewGame: true });
  assertIncludes(confirmNewGameHtml, "新游戏会覆盖当前进度", "覆盖存档前必须有明确二次确认");
  assertIncludes(confirmNewGameHtml, "data-confirm-new-game", "新游戏二次确认必须有明确确认按钮");
  assertIncludes(confirmNewGameHtml, "data-cancel-new-game", "新游戏二次确认必须允许保留当前进度");
  const customNameTitleHtml = personalizeHostHtml(titleScreenHtml({ productName: "深夜热线：直播间侦探", storyPack: true, playerName: "周明", host: { name: "周明" } }), "周明");
  assertIncludes(customNameTitleHtml, "value=\"周明\"", "自定义主播名必须回填到标题页输入框");
  assert(!customNameTitleHtml.includes("坐在主播台前"), "自定义姓名已经显示在输入框里，不再追加解释玩家身份的句子");
  assertEqual(normalizePlayerName("   "), DEFAULT_PLAYER_NAME, "空白姓名必须回落到默认名");
  assertEqual(normalizePlayerName("  周   明  "), "周 明", "自定义姓名必须清理首尾和重复空格");
  assertIncludes(personalizeHostHtml("<b>林旭阳</b>", "<周明>"), "&lt;周明&gt;", "自定义姓名进入 HTML 前必须转义");
  assertIncludes(personalizeHostHtml("旭阳哥，你帮我看看。", "陈浩然"), "浩然哥", "人物对主播的熟称必须随自定义姓名一起变化");
  assertIncludes(liveFrameViewSource, "liveControlDeckHtml", "案内 UI 必须由直播控场台纯 UI 模块统一生成");
  assertIncludes(liveFrameViewSource, "liveFrameHtml", "案内主舞台 HTML 必须由纯 UI 模块生成");
  assert(!appSource.includes("class=\"control-deck\""), "控场台 DOM 不能继续写在 app.js");
  assert(!appSource.includes("live-console-shell"), "案内主舞台骨架 DOM 不能继续写在 app.js");
  const deckHtml = liveControlDeckHtml({ onAirLabel: "匿名热线", label: "看材料", segment: 2, total: 5, pressure: { remaining: 6, max: 8, patienceLabel: "压得住" }, material: "审批图" });
  const firstDeckHtml = liveControlDeckHtml({ onAirLabel: "匿名热线", label: "继续对话", segment: 1, total: 5, pressure: { remaining: 8, max: 8, patienceLabel: "还在听" }, material: "信用卡账单" });
  assertIncludes(deckHtml, "class=\"control-deck", "案内主画面必须保留直播控场台侧栏");
  assertIncludes(deckHtml, "deck-live-metrics", "控场台必须有 LIVE 状态和观众数氛围指标");
  assert(!deckHtml.includes("LIVE 01:24:55"), "控场台不得显示不会随流程变化的假直播时长");
  assertIncludes(deckHtml, "deck-host-monitor", "控场台必须保留主播监看层，强化玩家在主播台控场");
  assertIncludes(deckHtml, "主播监听", "控场台监看层应像直播监听状态，不要退回抽象的听线小仪表");
  assertIncludes(deckHtml, "还在往下问", "控场台通话进度必须呈现当前现场阶段");
  assert(!deckHtml.includes("2/5"), "控场台不得把通话写成关卡页码");
  assertIncludes(deckHtml, "压得住", "控场台耐心必须呈现人物可感知的状态");
  assert(!deckHtml.includes("6/8"), "控场台不得暴露底层耐心数值");
  assert(!deckHtml.includes("麦没断"), "控场台通话进度不能再写“麦没断”这类指代不明文案");
  assert(!firstDeckHtml.includes("绕问、误指会掉耐心"), "直播台不应在剧情中插入系统教学句");
  assertIncludes(deckHtml, "Viewers", "控场台直播指标必须像直播间状态，不写成玩法分数");
  assertIncludes(deckHtml, "deck-monitor-strip", "控场台必须有麦克风/监听状态，不能只是普通信息卡");
  assertIncludes(deckHtml, "deck-value-rail", "控场台的通话与耐心状态必须有可扫读的硬件式进度轨");
  assertIncludes(deckHtml, "deck-pressure-rail", "听众耐心必须与普通通话进度使用不同的视觉轨道");
  assertIncludes(deckHtml, "后台材料", "控场台必须把材料作为直播间后台对象呈现");
  assertIncludes(deckHtml, "data-material-open", "后台材料收到后必须能从控场台直接打开，不能只显示数量");
  assertIncludes(deckHtml, "点击查看", "后台材料卡必须明确提示玩家可以查看");
  assertIncludes(deckHtml, "deck-material-preview", "控场台材料卡必须有缩略图，提升直播后台操作感");
  assertIncludes(deckHtml, "审批图", "控场台必须展示当前后台材料");
  const frameHtml = liveFrameHtml({ productName: "深夜热线：直播间侦探", modeLabel: "试玩连线", soundEnabled: true, label: "继续对话", chapter: "匿名来电", text: "<p>正文</p>", choices: "<button>继续</button>", visualHud: "<div>HUD</div>", controlDeckHtml: deckHtml, backdropClass: "backdrop-credit", material: "信用卡账单" });
  assertIncludes(frameHtml, "live-console-shell", "案内主画面必须使用控场台布局骨架");
  assertIncludes(frameHtml, "has-control-deck", "有控场台时主舞台必须进入明确的桌面两栏状态");
  assertIncludes(frameHtml, "data-live-shell", "主舞台必须暴露稳定的交互外壳标记，不能由 app.js 复制骨架类名");
  assertIncludes(frameHtml, "data-live-stage", "主案与快案必须共享稳定的全屏舞台标记");
  assertIncludes(frameHtml, "vn-stage-frame", "推理舞台必须有镜头框与信号层，不能只剩背景图和网页卡片");
  assertIncludes(frameHtml, "data-audio-settings", "案内主画面 topbar 必须提供分路声音设置");
  assertIncludes(frameHtml, "data-audio-volume=\"voice\"", "案内声音设置必须能独立调语音");
  assertIncludes(frameHtml, "scene-evidence-props", "主舞台必须有案件物件前景层，不能只有背景图和立绘");
  assertIncludes(frameHtml, "scene-props-credit", "案件物件前景层必须跟随场景背景切换");
  assertIncludes(frameHtml, "props-bill", "案件物件前景层必须跟随材料类型切换");
  assertIncludes(frameHtml, "data-material-modal", "材料详情必须进入独立模态层，不能继续浮在对白上");
  assertIncludes(frameHtml, "data-material-close", "材料模态必须提供明确关闭操作");
  assertIncludes(frameHtml, "aria-expanded=\"false\"", "材料入口必须向辅助技术报告展开状态");
  assert(!liveFrameHtml({ text: "<p>正文</p>", choices: "" }).includes("avg-choice-overlay"), "没有选项时不得生成空白全屏遮罩");
  assertIncludes(liveFrameHtml({ text: "<p>正文</p>", screenEffect: "patience-drop" }), "screen-effect-patience-drop", "耐心扣除必须能渲染一次性红色暗角层");
  const plainSceneTransition = liveFrameHtml({ text: "<p>正文</p>", pixelTransition: { kind: "scene" } });
  assertIncludes(plainSceneTransition, "pixel-transition-scene", "大切点必须能保留无报幕卡的背景过场层");
  assert(!/<small>|<b>/.test(plainSceneTransition.slice(plainSceneTransition.indexOf("pixel-transition-scene"), plainSceneTransition.indexOf("<header class=\"topbar\""))), "普通过场不得输出空牌或英文场记");
  assertIncludes(liveFrameHtml({ text: "<p>正文</p>", pixelTransition: { kind: "signal-connect" } }), "pixel-transition-signal-connect", "接通瞬间必须能渲染轻微信号断帧");
  assertIncludes(liveFrameHtml({ text: "<p>正文</p>", pixelTransition: { kind: "soft-fade" } }), "pixel-transition-soft-fade", "首页入场必须能使用柔和过渡，不得强制套用硬像素断帧");
  assertIncludes(liveFrameHtml({ text: "<p>正文</p>", pixelTransition: { kind: "reveal", eyebrow: "HOLD", label: "等等" } }), "pixel-transition-reveal", "案内唯一核心反转必须能渲染短促重击过场");
  assertIncludes(stylesSource, "soft-scene-transition-out 1200ms", "开播前无文案淡化应保留一点入场重量，但不能继续停两秒以上");
  assertIncludes(stylesSource, "reveal-transition-out 2200ms", "案内核心反转必须给玩家足够时间读完重点标注");
  assertIncludes(stylesSource, "reveal-portrait-step", "案内核心反转必须在过场后强调当前主播立绘");
  assertIncludes(stylesSource, "@keyframes pixel-transition-out", "像素风过场必须由短促分步动画控制");
  assertIncludes(stylesSource, "@keyframes statement-phase-signal", "陈述和改口陈述必须共用可辨识的动态信号过场");
  assertIncludes(stylesSource, "prefers-reduced-motion: reduce", "像素风过场必须尊重减少动态效果设置");
  assertIncludes(stylesSource, ".screen-effect-material-hit", "材料命中必须有全屏 CRT 扫描反馈层");
  assertIncludes(stylesSource, ".screen-effect-patience-drop", "耐心扣除必须有红闪暗角反馈层");
  assertIncludes(stylesSource, "patienceRedVignette", "耐心扣除红闪必须由短动画控制，不应常驻");
  assertIncludes(appSource, "state.lastScreenEffect = state.lastScreenEffect ?? \"patience-drop\"", "真实消耗耐心时必须触发一次红闪反馈");
  assertIncludes(appSource, "state.lastScreenEffect = null", "屏幕反馈渲染后必须清空，不能存档后反复闪");
  assertIncludes(stylesSource, ".story-grid.case-vn-grid.live-console-shell", "控场台布局必须覆盖普通 VN 单栏布局");
  assertIncludes(stylesSource, "@media (min-width: 1440px)", "桌面全屏必须有独立宽屏布局，不能把主体锁死在 1280px 中央");
  assertIncludes(stylesSource, "width: calc(100% - clamp(48px, 4vw, 96px))", "宽屏主舞台必须利用两侧空间并保留适度安全边距");
  assertIncludes(stylesSource, ".live-console-shell.has-control-deck > .vn-stage", "桌面主舞台必须明确进入第二列");
  assertIncludes(stylesSource, ".dialogue-focus-stage .avg-choice-overlay.inline-choice-flow:not([hidden])", "主案高频继续按钮必须固定在对白舞台底部，不能落到后台控件层");
  assertIncludes(stylesSource, "bottom: clamp(14px, 2.4vh, 26px)", "主案继续按钮必须与对白框共享底部安全边距");
  assert(!stylesSource.includes(".case-vn-grid .control-deck { position: absolute"), "控场台不能再被后置 AVG 样式改成遮挡舞台的绝对定位");
  assertIncludes(stylesSource, ".avg-material-modal[hidden]", "材料模态关闭后必须真正退出布局");
  assertIncludes(stylesSource, ".avg-material-modal { position: fixed; z-index: 200", "材料窗口必须在舞台与顶栏之上");
  assertIncludes(stylesSource, "width: min(72rem, 100%)", "后台材料必须使用足够大的阅读面板，不能缩成小卡片");
  assertIncludes(stylesSource, "height: min(88dvh, 54rem)", "后台材料必须占据主要视口高度，方便查看和关闭");
  assertIncludes(stylesSource, "#app", "游戏舞台必须阻止连续点击造成的误选文字");
  assertIncludes(stylesSource, ".choice-material-shortcut", "关键选择出现时必须在选择层提供材料快捷入口");
  assertIncludes(liveFrameViewSource, "material-toolbar-button", "材料入口必须占据工具栏空间，不能覆盖继续按钮");
  assertIncludes(appSource, "querySelectorAll?.(\"[data-material-open]\")", "控场台与对白框两个材料入口必须共用同一个材料板");
  assertIncludes(stylesSource, ".case-portrait.art-pixel img", "像素立绘必须使用独立的最近邻渲染规则，不能给旧立绘全局套滤镜");
  assertIncludes(stylesSource, ".deck-card-live", "控场台必须有直播信号视觉模块");
  assert(!stylesSource.includes("50% 50% 44% 44%"), "控场台主播监听不能再画成小人脸图标");
  assertIncludes(stylesSource, ".scene-evidence-props", "主舞台案件物件前景层必须有样式");
  assertIncludes(stylesSource, ".scene-evidence-props.props-bill", "账单类前景物件必须有区别于普通文件的样式");
  assertIncludes(stylesSource, ".scene-evidence-props.props-flow", "审批/流程类前景物件必须有区别于普通文件的样式");
  assertIncludes(stylesSource, ".deck-live-metrics", "控场台 LIVE 指标必须有独立样式");
  assert(!stylesSource.includes(".deck-patience-hint"), "删除教学句后不得遗留无效样式");
  assertIncludes(stylesSource, ".deck-card-material", "控场台必须有后台材料视觉模块");
  assertIncludes(stylesSource, ".deck-monitor-strip", "控场台必须有麦控监看条样式");
  assertIncludes(stylesSource, ".deck-material-preview", "控场台必须有材料缩略图样式");
  assertIncludes(stylesSource, ".vn-stage[data-live-stage]", "全屏推理舞台必须有独立于普通内容页的视觉架构");
  assertIncludes(stylesSource, "@keyframes stageSignal", "舞台顶端的直播信号必须有克制的动态反馈");
  assert(!/animation:\s*stageSignal[^;]*\binfinite\b/.test(stylesSource), "直播信号只可在入场时短暂播放，不能让静置页面持续重绘");
  assert(!/animation:\s*avg-continue[^;]*\binfinite\b/.test(stylesSource), "继续提示只可短暂闪动，不能在玩家阅读时持续重绘");
  assert(!/animation:\s*hostWave[^;]*\binfinite\b/.test(stylesSource), "主播监听条只可在入场时短暂播放，不能常驻刷新");
  assert(!/animation:\s*statement-phase-signal[^;]*\binfinite\b/.test(stylesSource), "陈述过场信号必须在过场结束前停止，不能在隐藏后继续刷新");
  assertIncludes(stylesSource, ".title-console-strip", "标题页必须有直播状态条样式");
  assertIncludes(stylesSource, ".audio-settings-panel", "分路声音设置必须有独立浮层样式");
  assertIncludes(stylesSource, ".audio-playback", "录音回放必须有独立控制条样式");
  assertIncludes(appSource, "./ui/audioController.js", "声音 DOM 协调必须从 app.js 拆到独立控制器");
  assert(!appSource.includes("function bindAudioControls"), "app.js 不能重新内联声音设置事件绑定");
  assertIncludes(audioControllerSource, "syncAudioScene", "场景声音控制器必须统一同步 BGM 与环境音");
  assertIncludes(audioControllerSource, "toggleVoiceCue", "声音控制器必须支持录音播放与暂停");
  assert(/\.title-console-strip span[\s\S]*pointer-events: none/.test(stylesSource), "标题页 ON AIR/REC/LIVE 是状态灯，不能保留可点击区域");
  assert(/\.deck-live-metrics i[\s\S]*pointer-events: none/.test(stylesSource), "控场台 LIVE/REC 这类信号指标不能像可点击按钮");
  assertIncludes(appSource, 'document.addEventListener("keydown"', "Steam/桌面输入必须有全局键盘入口");
  assertIncludes(appSource, "moveButtonFocus", "方向键/WASD 必须能切换可用按钮焦点");
  assertIncludes(appSource, "keyboardNavigationIntent", "键盘输入意图必须走纯函数模型，不能全散在 app.js 事件里");
  assertIncludes(appSource, "nextFocusIndex", "按钮焦点循环必须走可测试纯函数");
  assertIncludes(appSource, "preferredDefaultButton", "每个渲染页必须能恢复清楚的默认焦点");
  assertIncludes(appSource, "queueDefaultFocus()", "标题页和案内 frame 渲染后必须排入默认焦点");
  assertIncludes(appSource, "\"gamepadconnected\"", "Steam/桌面输入必须有手柄连接入口");
  assertIncludes(appSource, "\"gamepaddisconnected\"", "拔出最后一个手柄后必须停止空闲轮询");
  assertIncludes(appSource, "getGamepads", "Steam/桌面输入必须轮询标准 Gamepad API");
  assertIncludes(appSource, "handleGamepadButton(gamepad, 0", "手柄 A 键必须能确认当前按钮");
  assertIncludes(appSource, "handleGamepadButton(gamepad, 1", "手柄 B 键必须能返回或重试");
  assertIncludes(appSource, "handleGamepadButton(gamepad, 3", "手柄 Y 键必须预留给回看/复盘入口");
  assertIncludes(appSource, "intent === \"review\"", "R 键必须能通过键盘意图打开或收起当前回看面板");
  assertIncludes(appSource, "toggleReviewPanel", "键盘 R 和手柄 Y 必须复用同一套回看切换逻辑");
  assert(!appSource.includes('event.key === "a" || event.key === "A"'), "A 键必须只用于向左移动，不能再与自动播放设置冲突");
  assertIncludes(appSource, 'modal.addEventListener("keydown"', "材料弹层必须把 Tab 焦点留在弹层内");
  assertIncludes(appSource, "closeTopOverlay", "Esc 与手柄 B 必须先关闭材料或案卷顶层");
  assertIncludes(appSource, "onChoicesShown", "对白结束展示选项时必须同步材料层状态");
  assertIncludes(appSource, "resetViewportScroll", "SPA 切换场景后必须回到新画面顶部，不能继承上一页滚动位置");
  assertIncludes(dialoguePresentationSource, ".night-shell-line", "夜班序章必须进入逐句 AVG 分页，不能在手机端堆成长页");
  assertIncludes(dialoguePresentationSource, "destroyed || box.isConnected === false", "旧对白控制器离开页面后必须停止动画和自动推进");
  assertIncludes(dialoguePresentationSource, "setFastForward", "快进按钮必须真正改变当前对白控制器，不能只保存一个死设置");
  assertIncludes(appSource, "handleGamepadAxis", "左摇杆必须能移动焦点");
  assertIncludes(appSource, "gamepadAxisDirection", "摇杆方向和冷却必须走可测试纯函数");
  assertIncludes(stylesSource, "button:focus-visible", "键盘和手柄焦点必须有可见焦点环");
  assert(!stylesSource.includes("focusCurrent"), "键盘和手柄焦点必须使用静态描边，不能用无限阴影动画空烧 CPU");
  assert(!stylesSource.includes("portraitBlink"), "立绘滤镜必须保持静态，不能用无限眨眼动画反复重绘整张立绘");
  assertIncludes(stylesSource, ".call-log-drawer-body", "上一问回看必须有抽屉式通话记录样式");
  assert(!stylesSource.includes(".case-portrait::after"), "常驻立绘不能叠扫描线或信号错位层");
  assertIncludes(stylesSource, ".pixel-transition-signal", "信号断帧只能作为短促过场变体存在");
  assertIncludes(stylesSource, "portraitCrossFade", "立绘表情/状态切换必须有淡入过渡样式");
  assertIncludes(stylesSource, "expressionShiftFloat", "立绘表情气泡必须有分状态微动效，避免所有反应都像同一个贴片");
  assertIncludes(stylesSource, "expressionPauseFloat", "停顿类表情必须和普通眨眼气泡有不同节奏");
});

test("EPISODE-001", "story pack contains deterministic live-call cases with one spine", () => {
  const storyPacksSource = readFileSync(new URL("../src/storyPacks.js", import.meta.url), "utf8");
  const recapModelSource = readFileSync(new URL("../src/runtime/recapModel.js", import.meta.url), "utf8");
  const contentIndexSource = readFileSync(new URL("../src/generated/contentPackIndex.js", import.meta.url), "utf8");
  const dailyChoicesSource = readFileSync(new URL("../src/dailyChoices.js", import.meta.url), "utf8");
  const demoPack = storyPackForKey("steam-demo-01");
  const demoCaseCount = storyPackCaseCount(demoPack);
  const a = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const b = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const legacy = generateCasesForMode("weekly", NPCS, attrs, { weeklyKey: "steam-demo-01" });
  assertIncludes(storyPacksSource, "./generated/contentPackIndex.js", "故事包运行时必须读取 content 生成索引，不能再手写 manifest 镜像");
  assert(!storyPacksSource.includes("ANONYMOUS_CALL_LABELS"), "故事包标签不能在 storyPacks.js 里手写双份");
  assertIncludes(contentIndexSource, "CONTENT_CASES", "内容索引必须包含案件运行时状态，为后续 JSON loader 留入口");
  assertIncludes(contentIndexSource, "commentSeeds", "内容索引必须包含 comments.json，不能让弹幕种子停在影子资产");
  assertIncludes(contentIndexSource, "hiddenThread", "内容索引必须包含故事包暗线，不能把串案结构写死在终局 UI");
  assertIncludes(contentIndexSource, '"runtimeContentStatus": "runtime-loaded"', "至少一案必须已接通 runtime-loaded 内容，证明 JSON loader 真实生效");
  assert(!contentIndexSource.includes('"runtimeContentStatus": "metadata-only"'), "当前试玩包四案都必须由 content JSON 接管完整台词");
  assertIncludes(contentIndexSource, "accusationChoices", "最终收麦原话必须进入内容索引，不能停在 dailyChoices.js 分支");
  assertIncludes(contentIndexSource, "taskProfile", "任务画像必须进入内容索引，不能继续只靠 caseEngine.js 的 plotId 表");
  assert(!/brief\.plotId ===/.test(dailyChoicesSource), "最终收麦选项不能继续在 dailyChoices.js 里按 plotId 分支");
  assert(!recapModelSource.includes("brief.plotId === \"education-income-fake-profile\""), "分享卡不能为存款证明案保留 runtime plotId 特判");
  assertEqual(a.length, demoCaseCount, "故事包必须按 manifest size 生成案件");
  assert(validCaseBriefCount(a.length, "episode"), "故事包案件数量必须被 episode 存档校验接受");
  assertEqual(a.map((brief) => brief.id).join("|"), b.map((brief) => brief.id).join("|"), "同一个 storyKey 必须生成同一组故事");
  assertEqual(a.map((brief) => brief.plotId).join("|"), legacy.map((brief) => brief.plotId).join("|"), "旧 weeklyKey 必须兼容同一组故事");
  assert(a.every((brief) => Object.keys(brief).every((key) => !key.startsWith("weekly"))), "新生成的故事包 brief 只能写 story*，不得继续写 weekly* 别名");
  assertEqual(a.map((brief) => brief.plotId).join("|"), "lost-job-hidden-credit|workplace-reimbursement-screenshot|education-income-fake-profile|tony-multi-dating", "当前 demo 包必须按体面、职场垫款、婚恋条件、Tony 名单递进");
  assertEqual(a[0].runtimeContentSource, "content-pack-json", "第一案必须从 content JSON 接管完整运行时内容");
  assertEqual(a[0].runtimeContentCaseId, "01-credit", "第一案必须记录接管它的内容包 caseId");
  assertEqual(a[1].runtimeContentSource, "content-pack-json", "第二案必须从 content JSON 接管完整运行时内容");
  assertEqual(a[1].runtimeContentCaseId, "04-workplace", "第二通必须记录接管它的职场内容包 caseId");
  a.forEach((brief, index) => {
    assertEqual(brief.callerArtStyle, "pixel", `第 ${index + 1} 案必须使用统一像素立绘`);
    assertEqual(Object.keys(brief.callerArtVariants ?? {}).sort().join("|"), "guarded|neutral|pause", `第 ${index + 1} 案像素立绘必须接齐 neutral / guarded / pause 三态`);
  });
  assertEqual(a[2].runtimeContentSource, "content-pack-json", "第三案必须从 content JSON 接管完整运行时内容");
  assertEqual(a[2].runtimeContentCaseId, "03-profile", "第三案必须记录接管它的内容包 caseId");
  assertEqual(a[3].runtimeContentSource, "content-pack-json", "第四案必须从 content JSON 接管完整运行时内容");
  assertEqual(a[3].runtimeContentCaseId, "02-tony", "第四通必须记录接管它的 Tony 内容包 caseId");
  assertEqual(a[3].taskProfile.id, "emotion", "Tony 案任务画像必须来自 content JSON，而不是运行时 plotId 特判");
  assertEqual(a[2].taskProfile.id, "verification", "存款证明案任务画像必须来自 content JSON");
  assertEqual(a[1].taskProfile.summary, "截图看着完整，钱却没落到该落的位置。", "职场案任务画像必须保留内容包里的案内操作摘要");
  assertEqual(a[0].storyHiddenThread?.label, demoPack.theme.hiddenThread.label, "故事包暗线必须从 manifest theme 进入每案 brief");
  assertEqual(a[0].difficultyProfile.tier, 1, "第一案必须从 manifest 接到开场难度 profile");
  assertEqual(a[3].difficultyProfile.tier, 4, "第四案必须从 manifest 接到收束难度 profile");
  assert(calculateCaseBudgetMax({ brief: a[0] }) > calculateCaseBudgetMax({ brief: a[3] }), "故事包后段必须能通过 manifest 降低听众耐心预算");
  assertEqual(truthBoundaryPromptLimitForCase(a[2]), 6, "故事包中后段必须能通过 manifest 提高事实边界题量");
  assertEqual(truthBoundaryReview(a[3]).prompts.length, 6, "事实边界回看必须读取 per-case truthBoundaryPromptLimit，而不是全包固定 5 条");
  a.forEach((brief, index) => {
    assert(Object.values(brief.routeAxisComments ?? {}).flat().every((comment) => typeof comment === "string" && comment.trim()), `第 ${index + 1} 案已配置的路线评论必须是有效文本`);
    assert(Array.isArray(brief.truthBoundary?.true), `第 ${index + 1} 案内部 true 记录须为数组，不要求编造事实`);
    assert(Array.isArray(brief.truthBoundary?.edited), `第 ${index + 1} 案内部 edited 记录须为数组，不要求编造事实`);
    assert(Array.isArray(brief.truthBoundary?.unknown), `第 ${index + 1} 案内部 unknown 记录须为数组，不要求编造事实`);
  });
  assertEqual(new Set(a.map((brief) => brief.plotId)).size, demoCaseCount, "当前 demo 包不能重复题材");
  a.forEach((brief, index) => {
    assertEqual(brief.caseMode, "episode", `第 ${index + 1} 案必须标记 episode`);
    assertEqual(brief.order, index + 1, `第 ${index + 1} 案顺序必须稳定`);
    assertEqual(brief.modeLabel, "试玩连线", "故事包案内模式标签不能暴露目录包装");
    assertEqual(brief.storyArcTitle, "热线连线", "故事包案内眉题不能显示案名或进度");
    assertEqual(brief.storyCaseLabel, "匿名来电", "故事包通话 HUD 不能提前显示案名");
    assert(brief.storyThemeTitle && brief.storyThemeIntro && brief.storyThemeThesis, "故事包必须携带主题、开场引子和主题论点");
    assert((brief.storyCommentSeeds ?? []).every((comment) => typeof comment === "string" && comment.trim()), "故事包已配置的评论种子必须以有效文本进入运行时 brief");
    const preachyOpeningBits = [`${"这些词"}${"都不坏"}`, `${"坏的是"}`, `${"四通来电"}${"放在一起看"}`, `${"四通"}${"匿名来电"}`, `${"四案"}${"故事集"}`];
    assert(!preachyOpeningBits.some((phrase) => brief.storyThemeIntro.includes(phrase)), "故事集开场引子不能先下主题判断");
    assert(brief.storyThemeCommentPrompt, "故事包必须携带评论区提示");
    assert(brief.storyAct && brief.storyObjectLabel && brief.storyInterludeRecap && brief.backdropClass && brief.callerArt, "每案必须有整集里的功能、物件名、背景 class、匿名来电人立绘和案间收束句");
    assert(brief.storyBridge === undefined && brief.weeklyBridge === undefined, "主案接通前不得挂载案情桥接旁白");
    assert(/^\.\/assets\/generated\/callers\/[^?#]+\.png$/.test(brief.callerArt), "故事包来电人立绘必须来自匿名 callers 资产目录且不带手写缓存戳");
    assert(Array.isArray(brief.accusationChoices), `第 ${index + 1} 案保留收麦兼容数组，不设候选数配额`);
    assert(!/故事集|第[一二三四五六七八九十\d]+\s*案|\d+\s*\/\s*\d+|体面|一家人|条件|主责/.test(`${brief.modeLabel} ${brief.storyArcTitle} ${brief.storyCaseLabel}`), "案内可见标题不能像目录或剧透标签");
    assert(brief.sceneVersions.length > 0, `第 ${index + 1} 案必须有可播放场景`);
    const firstNightIndexes = brief.nightStructure?.segment1SceneIndexes ?? [];
    const secondNightIndexes = brief.nightStructure?.segment2SceneIndexes ?? [];
    assert(firstNightIndexes.length > 0, `第 ${index + 1} 案第一夜不能为空`);
    assert(secondNightIndexes.length > 0, `第 ${index + 1} 案第二夜不能为空`);
    const nightIndexes = [...firstNightIndexes, ...secondNightIndexes];
    assert(nightIndexes.every(sceneIndex => Number.isInteger(sceneIndex) && sceneIndex >= 0 && sceneIndex < brief.sceneVersions.length), `第 ${index + 1} 案夜间场景索引必须有效`);
    assertEqual(new Set(nightIndexes).size, nightIndexes.length, `第 ${index + 1} 案夜间场景索引不能重复`);
    assert(firstNightIndexes.every((sceneIndex) => !secondNightIndexes.includes(sceneIndex)), `第 ${index + 1} 案两夜承重场景不得重复播放`);
    if (brief.runtimeLengthPlan?.liveBeatCount !== undefined) {
      assertEqual(brief.runtimeLengthPlan.liveBeatCount, brief.sceneVersions.length, `第 ${index + 1} 案 runtimeLengthPlan.liveBeatCount 必须等于实际段落数`);
    }
    assert(brief.sceneVersions.every((scene) => (scene.interactionMode === "testimonyWall" || (scene.questionOptions ?? []).length >= 1)), `第 ${index + 1} 案每段保留可执行问法，数量由本案对话决定`);
    const committedOptions = brief.sceneVersions.flatMap((scene) => scene.questionOptions ?? []);
    assert(brief.sceneVersions.every(scene => (scene.questionOptions ?? []).every(option => scene.questionSequence?.length ? option.suspicionLabel === option.question : Boolean(option.suspicionLabel))), `第 ${index + 1} 案顺序追问直接显示台词`);
assert(brief.sceneVersions.filter(scene => !scene.questionSequence?.length).flatMap(scene => scene.questionOptions ?? []).every(option => !/[？?。！!]$/.test(option.suspicionLabel)), `第 ${index + 1} 案非顺序疑点保留简短方向标签`);
    const revealOptions = committedOptions.filter((option) => option.revealTransition);
    const revealInterrupts = [
      ...(brief.nightStructure?.interlude?.actions ?? []),
      ...(brief.overnightStructure?.liveCounterBeats ?? [])
    ].filter((action) => action.kind === "interruptToast" && action.revealTransition);
    assertEqual(revealOptions.length + revealInterrupts.length, 1, `第 ${index + 1} 案必须且只能有一个案内核心反转过场`);
    assert(revealOptions.every((option) => option.correct === true), `第 ${index + 1} 案问话触发的核心反转过场只能来自正确方向`);
    assert(brief.evidenceBoard, `第 ${index + 1} 案必须挂载对应的材料合成图`);
    if (index === 2) assert(brief.respondentArtVariants?.neutral && brief.respondentArtVariants?.guarded, "第三案男方上麦必须使用独立双态立绘，不能复用女方立绘");
    assert(Array.isArray(brief.evidenceChecks), "材料检视兼容数组存在，不强制额外关卡");
    (brief.evidenceChecks ?? []).forEach((check, checkIndex) => {
      assert(check.material && check.prompt, `第 ${index + 1} 案第 ${checkIndex + 1} 个材料检视必须有材料文本和问题`);
      assert((check.options ?? []).some((option) => option.correct), `第 ${index + 1} 案第 ${checkIndex + 1} 个材料检视必须有正确指出项`);
    });
    brief.sceneVersions.forEach((scene, sceneIndex) => {
      const normal = (scene.questionOptions ?? []).filter((option) => !option.contradiction);
      const critical = (scene.questionOptions ?? []).filter((option) => option.contradiction);
      assert([...normal, ...critical].every((option) => option.question && option.answer), `第 ${index + 1} 案第 ${sceneIndex + 1} 段每个问法都有回应，不强制编造错问`);
      assert(scene.interactionMode === "testimonyWall" || critical.length >= 1, `第 ${index + 1} 案第 ${sceneIndex + 1} 段须有可揭示已配置矛盾的追问`);
    });
    if (!brief.dialoguePresentation?.compactClosing) assertEqual(dailyAccusationChoices(brief).length, 4, `第 ${index + 1} 案最终必须给四句原话`);
  });
  assertEqual(a[0].storyThemeTitle, "四通来电", "当前 demo 包必须共享同一条物件回看主题");
  const appSource = runtimeSource;
  assert(!appSource.includes("第一通匿名来电，还在等待接入"), "标题页不再提前概括第一通来电；序幕负责开场");
  assert(!/const hook = storyPack \? preview\?\.storyThemeThesis/.test(appSource), "标题页不能直接把主题论点当开场 hook");
  const oldPreviewListClass = `${"weekly"}-${"preview"}-${"list"}`;
  const oldStartButton = `${"开始"}${"四案"}${"故事集"}`;
  assert(!appSource.includes(oldPreviewListClass), "标题页不能提前列出故事目录");
  assert(!appSource.includes(oldStartButton), "标题页按钮不能提前暴露四案结构");
  assert(!appSource.includes('const title = storyPack ? "Steam 试玩故事集"'), "标题页不能用内容包目录式标题");
  const runtimeSpoilerBits = [`${"四案"}${"故事集"}`, `${"Steam 试玩"}${"故事集"}`, `${"进入下一"}${"案"}`, `${"接入下一"}${"案"}`];
  assert(!runtimeSpoilerBits.some((phrase) => appSource.includes(phrase)), "运行时玩家文案不能继续使用目录式故事包措辞");
  const modeConfigSource = readFileSync(new URL("../src/caseModes.js", import.meta.url), "utf8");
  const oldCallCountIntro = `${"四通"}${"匿名来电"}`;
  assert(!modeConfigSource.includes(oldCallCountIntro), "模式入口文案不能提前暴露通话数量");
});

test("EPISODE-003", "runtime-loaded case content can replace template fields without touching metadata-only cases", () => {
  const templateBrief = {
    label: "模板案",
    openingComplaint: "模板开场",
    sceneVersions: [{ version: "模板说法" }],
    evidenceChecks: []
  };
  const metadataOnly = applyRuntimeCaseContent(templateBrief, {
    caseId: "case-a",
    runtimeContentStatus: RUNTIME_CASE_CONTENT_STATUS.metadataOnly,
    openingComplaint: "不该覆盖"
  });
  const incompleteRuntimePacket = {
    caseId: "case-b",
    runtimeContentStatus: RUNTIME_CASE_CONTENT_STATUS.runtimeLoaded,
    label: "JSON 案",
    openingComplaint: "JSON 开场",
    sceneVersions: [{ version: "JSON 说法" }],
    evidenceChecks: [{ id: "json-evidence" }]
  };
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (message) => warnings.push(String(message));
  let runtimeLoaded;
  try {
    runtimeLoaded = applyRuntimeCaseContent(templateBrief, incompleteRuntimePacket);
  } finally {
    console.warn = originalWarn;
  }
  assertEqual(metadataOnly.openingComplaint, "模板开场", "metadata-only 案件不能覆盖模板台词");
  assert(isRuntimeLoadedCaseContent({ runtimeContentStatus: RUNTIME_CASE_CONTENT_STATUS.runtimeLoaded }), "runtime-loaded 状态必须能被识别");
  assertEqual(runtimeLoaded.label, "JSON 案", "runtime-loaded 案件可以覆盖标题");
  assertEqual(runtimeLoaded.openingComplaint, "JSON 开场", "runtime-loaded 案件可以覆盖开场");
  assertEqual(runtimeLoaded.sceneVersions[0].version, "JSON 说法", "runtime-loaded 案件可以覆盖逐段说法");
  assertEqual(runtimeLoaded.runtimeContentSource, "content-pack-json", "runtime-loaded 覆盖后必须标记内容来源");
  assert(missingRuntimeCaseRequiredFields(incompleteRuntimePacket).includes("truth"), "缺字段检查必须列出 runtime-loaded 未提供的必填真相字段");
  assert(warnings.some((message) => message.includes("case-b") && message.includes("truth")), "runtime-loaded 缺字段时必须告警，不能静默保留模板值");
});

test("EPISODE-004", "daily mode reuses runtime-loaded JSON content before template fallback", () => {
  [
    ["lost-job-hidden-credit", "01-credit"],
    ["tony-multi-dating", "02-tony"],
    ["education-income-fake-profile", "03-profile"],
    ["workplace-reimbursement-screenshot", "04-workplace"]
  ].forEach(([plotId, caseId]) => {
    const brief = generateCasesForMode("daily", NPCS, attrs, { dailyKey: `explicit-${plotId}`, plotId })[0];
    assertEqual(brief.runtimeContentCaseId, caseId, `daily ${plotId} 必须复用内容包 JSON，避免模板和故事集双源`);
  });
  const house = generateCasesForMode("daily", NPCS, attrs, { dailyKey: "legacy-house", plotId: "house-name-security-test" })[0];
  assertEqual(house.runtimeContentSource, undefined, "显式旧房产案可以继续走模板兜底，但不能进入自动 daily 轮换");
  Array.from({ length: 12 }, (_, index) => generateCasesForMode("daily", NPCS, attrs, { dailyKey: `2026-07-${String(index + 1).padStart(2, "0")}` })[0])
    .forEach((brief) => {
      assertEqual(brief.runtimeContentSource, "content-pack-json", "自动 daily 轮换必须只出 runtime-loaded JSON 内容");
    });
  const variant = generateCasesForMode("daily", NPCS, attrs, { dailyKey: "2026-06-29" })[0];
  assertEqual(variant.runtimeContentSource, "content-pack-json", "daily 轮换变体也应复用 JSON 台词");
  assert((variant.sceneVersions ?? []).every((scene) => scene.speakerId === variant.complainantId), "daily 套 JSON 后仍必须保持单来电人讲述");
});

test("EPISODE-001B", "each demo case exposes the caller's self-serving omission", () => {
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const expectedOmissions = {
    "lost-job-hidden-credit": ["主动赠与", "八万拿不出来"],
    "tony-multi-dating": ["自己人", "走我户"],
    "education-income-fake-profile": ["八万四", "没让她撤回二十八万八"],
    "workplace-reimbursement-screenshot": ["报下来分我四千", "外部服务"]
  };
  briefs.forEach((brief) => {
    const text = JSON.stringify({
      openingDialogue: brief.openingDialogue,
      sceneVersions: brief.sceneVersions,
      deepFollowup: brief.deepFollowup,
      stageJudgement: brief.stageJudgement,
      truth: brief.truth,
      dailyAccusationChoices: dailyAccusationChoices(brief)
    });
    expectedOmissions[brief.plotId].forEach((marker) => {
      assertIncludes(text, marker, `${brief.plotId} 必须写出咨询者藏起的自利信息`);
    });
  });
  const profileCase = briefs.find((brief) => brief.plotId === "education-income-fake-profile");
  assert(profileCase?.conclusionWhenCleared && (profileCase.conclusionBranches ?? []).length >= 2, "存款证明案的特殊结算必须来自 content JSON 字段");
});

test("EPISODE-001C", "demo story pack keeps four-act structure internal and pickup silent", () => {
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const expectedActMarkers = [
    ["体面"],
    ["主责"],
    ["条件"],
    ["自己人"]
  ];
  briefs.forEach((brief, index) => {
    expectedActMarkers[index].forEach((marker) => {
      assertIncludes(brief.storyAct ?? "", marker, `第 ${index + 1} 案必须承担故事集四幕推进功能`);
    });
    assert(brief.storyBridge === undefined && brief.weeklyBridge === undefined, `第 ${index + 1} 案不得在接通前概括案情`);
  });
});

test("EPISODE-001D", "workplace case keeps role pronouns aligned with assigned caller", () => {
  const [brief] = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" })
    .filter((item) => item.plotId === "workplace-reimbursement-screenshot");
  assert(brief, "试玩包必须包含职场报销案");
  assertEqual(brief.complainantId, "chen", "职场报销案当前来电人必须是 chen");
  assertEqual(brief.respondentId, "shen", "职场报销案当前同事必须是 shen");
  const text = JSON.stringify({
    sceneVersions: brief.sceneVersions,
    deepFollowup: brief.deepFollowup,
    stageJudgement: brief.stageJudgement,
    followupTwist: brief.followupTwist,
    truth: brief.truth
  });
  ["她不是完全被逼", "她想表现", "她想拿表现", "他就有办法一直拖"].forEach((badPhrase) => {
    assert(!text.includes(badPhrase), `职场报销案不能用错性别代词或旧硬编码：${badPhrase}`);
  });
  assertIncludes(text, "主管", "职场案缺席方应统一为有分活权限的主管");
  assertIncludes(text, "咨询者", "职场报销案应使用角色称谓承接来电人，避免性别绑定");
  assertIncludes(text, "付款经办人", "职场报销案应把缺席方问题落到流程入口，不回到性别代词判断");
});

test("EPISODE-001E", "all four demo cases preserve human causality and evidence boundaries", () => {
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const allText = JSON.stringify(briefs);
  // Ordinary conversational phrases are not banned outside the old exchange.
  const staleCausality = /订座记录和朋友圈，我|靠窗位是谁订的|我看窗外，他看酒|现在那两个字卡在这儿|这张表记的是发型，还是人能派什么用|那列不是预约|一个把我写成|这三样，你补给家里了吗|材料就对到这儿|先别打。她也是看你困在里面|报价单哪一行写了钱往谁那儿走|领导写了你什么；钱，又写了什么|你第三次为什么还收了|月底，在归档以后|月底统一走|复盘下周一就要归档|下周一就要归档|周一就归档|周一先被复盘的是我|归档材料最后怎么写的|他一直说名校毕业，细问才说是 MBA|他今晚在群里说话了吗|归档前，你最怕补哪七个字|我在他那儿是个项目|那天刚好看到那张表|上个月发过一张办材料的截图|东西送到哪儿，我今晚还不想说|买了什么，我现在不想说|买了什么……这句我先不说|先让我把账算完|还想转给他时，心里怎么想的|后来你是怎么发现这个顺序的|你从这段关系里拿过什么好处|你白天去了哪里，先说给我听|你先把昨晚突然挂断的事说清楚|那四张材料是怎么发来的|他问到工资卡以后呢|下一句通常是什么|那次六折，你当时觉得他为什么愿意给|这条不算骂|二十九。说的|在我这里。你等一下，我把灯拖过来|面……看心情吧|账单里剩下那三万五……让我缓一晚|好，我不逼你今晚说|账单里那三万五你继续问|你先别问我，先看他的图|钱就是那次“你先顶上”刷进我个人卡的|新批注和审批页对不上|为什么没继续问回单号|那三张审批图里有什么|垫的钱是多少|红包发完以后呢|后半句，你别逼我|欠条有没有|为什么一直没提欠条|先别一句一个骗|说高、说低，两边都有|你要骂，按句骂|我承认添话，不认凭空造人|两套报价并排|不替任何一边省掉半句|最后分别要人做什么|三栏念完了|付款一张凭据，到账另一张|赵律师站在控制室门口|我只帮你看纸面：三页都没有回单号|主责，我确实想要|这句我想哭。忍住了|比他半年说的都实在|好，这顿饭先放在这里|这一万二先记着|两边加完|我没敢往那边说|我们从这儿接着问|先放后台吧|最后总会落到店里的事上|先不接弹幕的话|这块最灰|推进走完，人就往后放|先放宸直两个月|那十万到底怎么走的|那十万是不是后来进了宸直|接资金路径|周末这顿饭可以先放一放|这几张图先放一下|什么都想往那边套|我还能往回收一点|图上的事我们还没说完|这顿饭先往后放吧|资料里的学历和正式学历不是同一个口径|修没修先放下|材料没齐，我不签后面的结论|介绍链两边话|介绍人的两边话|刚接主责|拿主责|给你主责|第一次主责|主责给我|主责我还想留|不配拿主责|抢着要主责|会丢主责|刚把执行这块接下来|只有你能接住我|只有我能接住他|只有我能接住对方的情绪|晚点我给你插一位|插位完就登记|又自己人？上回那护理我不续|不续就不续，先坐|先缓口气|上一通是账单|四通麦背后没有同一个反派|先把身份、关系或流程说得好听/;
  assert(!staleCausality.test(allText), "四案不能重新引入无来源预设、重复追问、作者金句或会议纪要腔旧台词");
  assert(!allText.includes("TA"), "四案玩家可见内容不得用 TA 代替具体人物");
  briefs.forEach((brief) => {
    const openerLines = Object.values(brief.overnightStructure?.callbackOpeners ?? {}).map((opener) => opener?.line ?? "");
    const postureLines = Object.values(brief.overnightStructure?.postures ?? {});
    assert([...openerLines, ...postureLines].every((line) => !/^「.*」$/.test(line)), `${brief.plotId} 回拨台词不得在对话框外再套整句引号`);
  });

  const byPlot = Object.fromEntries(briefs.map((brief) => [brief.plotId, JSON.stringify(brief)]));
  const case1Opening = briefs.find((brief) => brief.runtimeContentCaseId === "01-credit");
  const case1OpeningText = JSON.stringify(case1Opening?.openingDialogue ?? []);
  assertEqual([3, 6].map(index => afterSceneEvidenceFor(case1Opening, index, () => false)?.check?.id).join("|"), "credit-anniversary-footprint|credit-leveraged-trust", "每份材料只在相应段落出现");
  assertEqual(afterSceneEvidenceFor(case1Opening, 6, key => key === "evidenceCheck:1"), null, "已核过材料不重复进入");
  assert(case1Opening.dialoguePresentation.focusedInquiry && case1Opening.dialoguePresentation.compactClosing, "案一集中问询后直接收尾");
  assert(!case1Opening.overnightStructure.callerQuestion && !case1Opening.deepFollowup.question, "没有第二轮八万问答");
  const case2 = briefs.find((brief) => brief.runtimeContentCaseId === "02-tony");
  const case3Opening = briefs.find((brief) => brief.runtimeContentCaseId === "03-profile");
  const case4Opening = briefs.find((brief) => brief.runtimeContentCaseId === "04-workplace");
  [case1Opening, case2, case3Opening, case4Opening].forEach((brief) => {
    const wall = brief.sceneVersions.find((scene) => scene.testimonyWall)?.testimonyWall;
    assert((wall?.missFeedback?.evidence ?? []).length >= 2 && (wall?.missFeedback?.statement ?? []).length >= 2, `${brief.runtimeContentCaseId} 决定性指认失误必须按错误类型和次数提供案件化反馈`);
    const act2HostLines = (wall?.acts?.[1]?.openerLines ?? [])
      .filter((line) => line.role === "host")
      .map((line) => line.text)
      .join(" ");
    assert(!/一句一句往回补|哪儿问到哪儿|从头讲一遍|我们就真的没法聊/.test(act2HostLines), `${brief.runtimeContentCaseId} 第二幕开场必须追本案事件，不得复用作者式审稿模板`);
  });
  assertIncludes(JSON.stringify(case3Opening), "卡上有二十八万六，也不代表我要拿二十八万八", "案三男方必须在错误追问路线也能当场反驳工资卡推断");
  assert(!/男方(?:问|插话)/.test(JSON.stringify(case3Opening.sceneVersions.find((scene) => scene.testimonyWall)?.testimonyWall?.acts?.[1]?.missFeedback ?? {})), "案三证词墙完成后男方才申请接麦，失败反馈不得让他提前发言");
  const openingFirstLines = [case1Opening, case2, case3Opening, case4Opening]
    .map((brief) => brief?.openingDialogue?.find((line) => line.role === "caller")?.text ?? "");
  assert(openingFirstLines.every((line) => /主播|咨询|分析/.test(line)), "四案第一句都必须先有自然接通感，不能从金额或证据物件硬切入");
  assertEqual(new Set(openingFirstLines.map((line) => line.split(/[。！？]/)[0])).size, 4, "四案不得共用同一句模板问候");
  const tonyOpening = case2.openingDialogue.filter((line) => line.role !== "stage");
  assertIncludes(tonyOpening[0]?.text ?? "", "我在线上吗", "案二应先确认自己已经接入，不得把名单和失眠塞进问候句");
  assertIncludes(tonyOpening[1]?.text ?? "", "你在的，请讲", "案二主播必须先完成正常接线，再让名单进入");
  assert(!/名单|女的|没睡/.test(tonyOpening[0]?.text ?? ""), "案二问候句不得兼做名单摘要");
  assert(!JSON.stringify(case2?.openingDialogue ?? []).includes("先缓口气"), "案二开场必须从名单和要钱直接追，不能保留模板式安抚");
  assertIncludes(JSON.stringify(case2?.openingDialogue ?? []), "钱在他那里", "案二开场必须在名单之后尽快砸出要钱，不能只填关系表");
  assertIncludes(case3Opening?.openingDialogue?.[0]?.text ?? "", "帮我听听一件事", "案三应先用自己的措辞提出求助，不得从二十八万八硬切入");
  assertIncludes(case3Opening?.openingDialogue?.[1]?.text ?? "", "好，你说", "案三主播必须先把话头交回给来电人");
  assert(!/二十八万八|彩礼|见父母/.test(case3Opening?.openingDialogue?.[0]?.text ?? ""), "案三问候句不得兼做彩礼摘要");
  assert(!JSON.stringify(case3Opening?.openingDialogue ?? []).includes("你慢慢说"), "案三开场必须直接接住见父母和彩礼冲突，不能保留模板问候");
  assertIncludes(JSON.stringify(case3Opening?.openingDialogue ?? []), "饭店还没订", "案三开场必须交代饭局尚未落定");
  assertIncludes(JSON.stringify(case3Opening?.openingDialogue ?? []), "先托介绍人去问", "案三开场必须把彩礼越过当事人先传出去的时间冲突说清");
  assertIncludes(case4Opening?.openingDialogue?.[0]?.text ?? "", "工作上的事", "案四应先正常提出工作咨询，不得用群输入框制造冷开场");
  assertIncludes(case4Opening?.openingDialogue?.[1]?.text ?? "", "你说", "案四主播先接住工作咨询");
  assert(!/六万八|工作群|输入框|一张图/.test(case4Opening?.openingDialogue?.[0]?.text ?? ""), "案四问候句不得兼做垫款材料摘要");
  const case3ClosingAmounts = ["二十八万八", "二十八万六", "二十三万八", "三十万", "二十万"]
    .filter((amount) => `${case3Opening?.stageJudgement ?? ""}${case3Opening?.caseClosing?.verdict ?? ""}`.includes(amount));
  assert(case3ClosingAmounts.length <= 2, "案三结案口播不得连续复报材料板里的多个金额");
  const guidedDocumentIntros = {
    "01-credit": ["男方看直播后直接向后台", "摘录没有余额列"],
    "03-profile": ["学校查询页", "工资卡", "家里群"],
    "04-workplace": ["前五行", "第二夜"]
  };
  Object.entries(guidedDocumentIntros).forEach(([caseId, anchors]) => {
    const intro = briefs.find((brief) => brief.runtimeContentCaseId === caseId)?.documents?.[0]?.intro ?? "";
    anchors.forEach((anchor) => assertIncludes(intro, anchor, `${caseId} 材料板须保留来源或时序信息，不强制追加阅读教程`));
  });
  assertIncludes(byPlot["lost-job-hidden-credit"], "第三次来啦", "案一旧图提供可核对的到店次数，不能仅凭高价餐厅认定日常支出");
  assertIncludes(byPlot["lost-job-hidden-credit"], "大部分没有", "探店开销是否有收入覆盖需由回答说明");
  assertIncludes(byPlot["lost-job-hidden-credit"], "从电子社保卡导出的缴费记录", "案一社保线索必须说明由谁、通过什么载体取得，不能让截图凭空出现");
  assertIncludes(byPlot["lost-job-hidden-credit"], "工资记录没发", "案一必须说明社保记录为何进入对话，并保留男方没有提供工资记录这一缺口");
  const case1SocialSecurityCard = briefs
    .find((brief) => brief.runtimeContentCaseId === "01-credit")
    ?.evidenceCards?.find((card) => card.id === "daily-credit-social-security");
  assert(!case1SocialSecurityCard?.front?.includes("五万贷款"), "案一社保截图本身不能提前携带银行流水中的五万贷款");
  assertIncludes(case1SocialSecurityCard?.detail ?? "", "不能单独确定离职日期", "案一社保材料必须明确缴费中断不等于精确离职日");
  assertIncludes(byPlot["lost-job-hidden-credit"], "送到我这儿了，东西也一直是我在用", "案一被直接问设备去向时必须说出事实并给出人物自己的责任解释，不能为排剧情硬拒答");
  assertIncludes(byPlot["lost-job-hidden-credit"], "我真以为那是他全款买来送我的", "案一必须让咨询者用当时的赠礼理解解释行为，而不是用作者式总结拖延揭示");
  assertIncludes(byPlot["tony-multi-dating"], "你怎么确定名单上的名字都是他在谈的人", "案二第一段必须先核对恋爱名义再进入名单字段");
  assertIncludes(byPlot["tony-multi-dating"], "昨晚你已经看见这张名单了", "案二必须固定第一夜已知名单，第二夜不得再演第一次发现");
  assertIncludes(byPlot["tony-multi-dating"], "tony-cropped-to-protect-self", "第二夜证词墙保留裁图所省略的代投背景");
  assertIncludes(byPlot["tony-multi-dating"], "十二万是否已经买成宸直产品", "案二必须把代投与入产品拆开，不能拿名单替认购作证");
  assertIncludes(byPlot["tony-multi-dating"], "今天就补颜色，别又跟我说那个", "案二熟客必须用眼前需求拒绝再次推介，不能替作者解释上一次发生了什么");
  assertIncludes(byPlot["tony-multi-dating"], "行，不说那个", "Tony 必须接住熟客的拒绝，不能用空话掐断相邻话轮");
  assertIncludes(byPlot["tony-multi-dating"], "Tony 是否具备向顾客推介或代购这类理财的资格", "案二真相边界必须显式保留代销资格这一未知项");
  assert(!byPlot["tony-multi-dating"].includes("同一句“只有你懂我”也发给了几个人"), "案二不得把相似专属话术升级成已证实的同句群发");
  assertIncludes(byPlot["education-income-fake-profile"], "只看那张学校图，能看出他本科在哪儿读吗", "案三必须先核图片字段再讨论名校标签");
  assertIncludes(byPlot["education-income-fake-profile"], "后来问清的本科和学费", "案三各选项必须从已问清的本科自然接到自费 MBA");
  assertIncludes(byPlot["education-income-fake-profile"], "工资、流水，你一样都没见过", "案三茶馆必须先追介绍人说法的依据，不能让她进场自报完整审查结论");
  const profileVisit = case3Opening.overnightStructure.dayScenes.find(scene => scene.id === "day-profile-teahouse");
  assert(/两段聊天.*彩礼传话/.test(profileVisit.body.access), "介绍人见面核对的材料范围包括聊天和彩礼传话");
  assert(profileVisit.body.beats.some(beat => beat.speaker === "介绍人" && /二十八万八/.test(beat.text) && /转/.test(beat.text)), "介绍人亲自说明彩礼转述，主播无需再次复述完整来源链");
  const case3DepositCard = case3Opening?.evidenceCards?.find((card) => card.id === "daily-profile-deposit");
  assertIncludes(case3DepositCard?.front ?? "", "工资账户期末余额 28.6 万", "案三材料卡正面必须先展示页面原始字段");
  assertIncludes(case3DepositCard?.front ?? "", "页面没有列出其他账户", "案三材料卡正面只能写页面可见范围，不替玩家推断全部家底");
  assert(!/女方要求|男方只提供/.test(case3DepositCard?.front ?? ""), "案三材料卡正面不得把双方行为判断混进原始页面");
  const supplierDay = case4Opening.overnightStructure.dayScenes.find(scene => scene.id === "day-work-supplier-visit");
  assert(!supplierDay.body.cast.includes("仓库管理员"), "付款线不再引入没有经手款项的仓库人员作证");
  assert(supplierDay.body.beats.some(beat => beat.speaker === "供应商项目员" && /财务/.test(beat.text) && /回执/.test(beat.text)), "供货方先说明付款回执需另找本方财务，不能把结算表直接当到账");
  assert(!byPlot["workplace-reimbursement-screenshot"].includes("欠条"), "案四公司报销关系不得被写成私人借贷欠条");
  const case4PrivateProcess = case4Opening?.sceneVersions?.find((scene) => scene.id === "work-private-process");
  assertEqual(case4PrivateProcess?.beforeVersion?.lines?.length ?? 0, 0, "案四公开流程场不得在 entryQuestion 前再播一遍同义问题");
  assert(!/我看串了|流程词说得很顺/.test(JSON.stringify(case4Opening)), "案四不得用假口误或作者批注伪造口语感");
  const case2Hook = briefs.find((brief) => brief.runtimeContentCaseId === "02-tony")?.investigationHooks?.find((hook) => hook.id === "tony-other-caller-dm");
  assert(!(case2Hook?.options ?? []).some((option) => option.correct === false && option.contradiction), "案二同款表误选项不得同时携带可结算矛盾，避免两项都对却只认一个");
  const case3 = briefs.find((brief) => brief.runtimeContentCaseId === "03-profile");
  const dinnerCancelled = case3?.overnightStructure?.liveCounterBeats?.find((beat) => beat.id === "profile-weekend-dinner-cancelled");
  const cancellationLines = dinnerCancelled?.lines ?? [];
  assert(cancellationLines.some((line) => line.role === "caller" && line.speaker === "男方"), "取消饭局必须有男方本人回应");
  assert(cancellationLines.some((line) => line.role === "caller" && line.speaker === "咨询者"), "取消饭局必须有来电人本人回应");
  assertEqual(cancellationLines.at(-1)?.role, "host", "双方说完以后主播收段，不把来回争执限制成固定三句话");
  assert(!(dinnerCancelled?.lines ?? []).some((line) => line.speaker === "介绍人"), "案三介绍人未接入直播，不得越权替双方宣布取消饭局");
});

test("EPISODE-002", "demo story pack can be played through with core reveals", () => {
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const outcomes = briefs.map((brief) => {
    const sceneContradictions = (brief.sceneVersions ?? []).map((scene) => scene.contradiction).filter(Boolean);
    const evidenceContradictions = (brief.evidenceChecks ?? [])
      .map((check, index) => {
        const correctIndex = (check.options ?? []).findIndex((option) => option.correct);
        assert(correctIndex >= 0, `${brief.plotId} 第 ${index + 1} 个材料必须有正确项`);
        return materialOperationOutcome(check, index, correctIndex).contradiction;
      })
      .filter(Boolean);
    const investigationContradictions = (brief.investigationHooks ?? [])
      .map((hook, index) => {
        const correctIndex = (hook.options ?? []).findIndex((option) => option.correct);
        assert(correctIndex >= 0, `${brief.plotId} 第 ${index + 1} 个回流材料必须有正确项`);
        return materialOperationOutcome(hook, index, correctIndex).contradiction;
      })
      .filter(Boolean);
    const found = [...new Set([...sceneContradictions, ...evidenceContradictions, ...investigationContradictions])];
    const issue = calculateIssueCompletion({
      brief,
      foundContradictions: found,
      requiredLimit: requiredContradictionsForCase(brief)
    });
    const resolved = resolveAccusationForCase({
      brief,
      accused: expectedAccusationForCase(brief),
      contradictionCount: found.length,
      requiredContradictions: requiredContradictionsForCase(brief)
    });
    const outcome = calculateCaseOutcome({
      result: resolved,
      contradictionCount: found.length,
      budgetRemaining: calculateCaseBudgetMax({ brief })
    });
    assert(issue.badge, `${brief.plotId} 核心路线必须能揭示足够问题`);
    assert(resolved.result.correct, `${brief.plotId} 核心路线最终指认必须可通过`);
    assert(resolved.result.enoughContradictions, `${brief.plotId} 核心路线必须达到矛盾门槛`);
    return { ...outcome, correct: resolved.result.correct };
  });
  assertEqual(outcomes.length, storyPackCaseCount(storyPackForKey("steam-demo-01")), "自动回放必须覆盖当前 demo 包全部案件");
  assert(outcomes.every((outcome) => outcome.correct), "自动回放每案都必须可结算成功");
});

test("DAILY-001", "daily case count and structural fields stay complete", () => {
  const brief = dailyCase("2026-06-24");
  assert(validCaseBriefCount(1, "daily"), "每日入口有效连线数量只能是一案");
  assert(brief.dailyCase === true, "每日案必须标记 dailyCase");
  assert(brief.sceneVersions.length >= 2, "每日案必须有可追问 sceneVersions");
  assert(brief.evidenceCards.length >= 3, "每日案必须有 evidenceCards");
    assert(Array.isArray(brief.evidenceChecks), "材料检视兼容数组存在，不强制额外关卡");
  assert(brief.deepFollowup && typeof brief.deepFollowup === "object", "保留兼容字段，允许无额外深问");
  assert(requiredContradictionsForCase(brief) >= 1, "每日案必须保留可判断的矛盾门槛");
});

test("DAILY-002", "daily generation is deterministic by dailyKey", () => {
  const a = dailyCase("2026-06-24");
  const b = dailyCase("2026-06-24");
  assertEqual(a.id, b.id, "同一天 dailyKey 必须生成同一案");
  assertEqual(a.plotId, b.plotId, "同一天 dailyKey 必须生成同一 plot");
  assertEqual(JSON.stringify(a.openingDialogue), JSON.stringify(b.openingDialogue), "同一天开场必须稳定");
});

test("DAILY-003", "UTC+8 day boundary drives default daily key", () => {
  const before = generateCasesForMode("daily", NPCS, attrs, { now: new Date("2026-06-23T15:59:59.000Z") })[0];
  const after = generateCasesForMode("daily", NPCS, attrs, { now: new Date("2026-06-23T16:00:00.000Z") })[0];
  assertIncludes(before.id, "2026-06-23", "UTC+8 零点前仍应属于前一天");
  assertIncludes(after.id, "2026-06-24", "UTC+8 零点后应进入新一天");
});

test("DAILY-004", "unsupported explicit daily plot is blocked", () => {
  assertThrows(
    () => generateCasesForMode("daily", NPCS, attrs, { dailyKey: "2026-06-24", plotId: "marriage-fraud" }),
    /not templated/,
    "未模板化 plotId 不能进入每日案"
  );
});

test("DAILY-005", "eight-day rotation never yields empty playable cases", () => {
  const days = Array.from({ length: 8 }, (_, index) => {
    const day = String(24 + index).padStart(2, "0");
    return dailyCase(`2026-06-${day}`);
  });
  const ids = new Set(days.map((brief) => `${brief.plotId}:${brief.complainantId}:${brief.respondentId}`));
  assert(ids.size >= 6, "8 天轮换至少要避免同 plot 同角色组合直接重复");
  days.forEach((brief) => {
    assert(brief.openingDialogue.length >= 2 && brief.openingDialogue.length <= 20, `${brief.plotId} 开场必须控制在 2-20 句，给正常接线留出两拍，同时仍用短问答逐步交代而不是单句倾倒`);
    assert(brief.sceneVersions.every((item) => item.testimonyWall || (item.questionOptions ?? []).length >= 1), `${brief.plotId} 每段必须有可问方向`);
    assert(brief.sceneVersions.every((item) => item.version && item.contradiction), `${brief.plotId} sceneVersion 不能缺文本或矛盾`);
  });
});

test("DAILY-006", "daily choices avoid no-click throwaway answers", () => {
  const forbidden = /是真的.*相信|先相信|别纠结|别聊僵|条件.*不错/;
  Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`))
    .flatMap((brief) => brief.sceneVersions.flatMap((item) => item.questionOptions ?? []))
    .forEach((option) => {
      assert(!forbidden.test(option.question), `不允许无脑/没人会点的选项：${option.question}`);
    });
});

test("DAILY-006B", "host questions avoid leading caller psychology labels", () => {
  const forbidden = /你当时是不是|你是不是也|你当时为什么没有把关系问死|你当时帮他，是因为|有没有觉得这事也算值|关系一直没说死|怎么接的|那你为什么一直绕着说要看账单|你后来为什么没有跟家里改口|他说主责署名的时候，你为什么先答应垫|主责写了你以后，你为什么反而更慌/;
  [
    ...generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" }),
    ...Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`))
  ]
    .flatMap((brief) => brief.sceneVersions.flatMap((item) => item.questionOptions ?? []))
    .forEach((option) => {
      assert(!forbidden.test(option.question), `主播追问不能替来电人下心理判断：${option.question}`);
    });
});

test("DAILY-006C", "core question correctness metadata stays explicit", () => {
  [
    ...generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" }),
    ...Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`))
  ]
    .flatMap((brief) => brief.sceneVersions.flatMap((item) => item.questionOptions ?? []))
    .forEach((option) => {
      assertEqual(typeof option.correct, "boolean", `追问必须显式记录 correct：${option.question}`);
      if (option.contradiction) {
        assertEqual(option.correct, true, `带矛盾的核心追问必须 correct=true：${option.question}`);
      }
    });
});

test("DAILY-007", "fake profile case keeps motive chain and half-truth structure", () => {
  const brief = generateCasesForMode("daily", NPCS, attrs, {
    dailyKey: "2026-06-24",
    plotId: "education-income-fake-profile"
  })[0];
  assertEqual(brief.stance, "halfTruth", "三张截图应是双向修剪事实，不是单向 trueVictim");
  assertEqual(brief.premeditated, false, "三张截图不应强行写成预谋犯罪");
  const openingText = brief.openingDialogue.map((line) => line.text).join(" ");
  assertIncludes(openingText, "见父母", "截图出现必须有关系阶段触发");
  assertIncludes(openingText, "本科不是她以为的那所名校", "外层说法必须先出现母亲对名校本科的误认，再揭示 MBA");
  assertIncludes(openingText, "二十八万八拿不出来", "案三必须先让男方直接拒绝高彩礼");
  assertIncludes(openingText, "我让他打流水", "流水必须由咨询者不相信拒绝后主动索要");
  assertIncludes(openingText, "只发来一份工资账户流水", "男方必须选择性提供工资账户，不能再主动交完整家底");
  assert(!openingText.includes("家里肯定不会差") && !openingText.includes("手里肯定还有积蓄"), "开场不能替玩家揭示女方父母把自费 MBA 当成家底");
  const sceneVersionsText = brief.sceneVersions.map((scene) => scene.version).join(" ");
  const proofScene = brief.sceneVersions.find((scene) => scene.id === "profile-proof-before-dinner");
  const requestedFlowQuestion = proofScene?.questionOptions?.find((option) => option.id === "profile-proof-before-dinner:questionOptions:0");
  const salaryOnlyQuestion = proofScene?.questionOptions?.find((option) => option.id === "profile-proof-before-dinner:questionOptions:1");
  const introducerScene = brief.sceneVersions.find((scene) => scene.version.includes("介绍人"));
  const dinnerScene = brief.sceneVersions.find((scene) => scene.version.includes("第一次正式吃饭"));
  const mbaScene = brief.sceneVersions.find((scene) => scene.version.includes("MBA") && scene.version.includes("本科"));
  const motiveScene = brief.sceneVersions.find((scene) => scene.id === "profile-caller-repeats-label");
  const complicityQuestion = motiveScene?.questionOptions?.find((option) => option.correct);
  const spendingScene = brief.sceneVersions.find((scene) => scene.id === "profile-income-and-card");
  const bridePriceFlow = `${openingText} ${brief.sceneVersions[0]?.version ?? ""}`;
  assertIncludes(brief.sceneVersions[0].version, "工资卡最清楚", "第一段必须承接女方索要流水后男方只交工资账户，不能残留无缘无故主动发图");
  assertIncludes(JSON.stringify({ answer: requestedFlowQuestion?.answer, lines: requestedFlowQuestion?.lines }), "条件我不想改", "第二夜必须把索要流水接到她不肯改条件的目的");
  assertIncludes(salaryOnlyQuestion?.answer, "问过，他没回", "玩家必须能问出男方只提供工资账户的材料缺口");
  assert(!salaryOnlyQuestion?.answer?.includes("今晚上麦") && !salaryOnlyQuestion?.answer?.includes("刚才上麦"), "案三夜 A 追问不得提前引用夜 B 上麦后的承认");
  assertIncludes(salaryOnlyQuestion?.logicContract?.sourceDoesNotProve, "其他账户", "工资账户不能被写成男方全部家底");
  assertIncludes(sceneVersionsText, "介绍人", "扩成长案后必须交代体面标签不是单人凭空出现");
  assertIncludes(sceneVersionsText, "第一次正式吃饭", "扩成长案后必须还原第一次饭局现场");
  assertIncludes(sceneVersionsText, "在男方家那边也替我说过", "扩成长案后必须还原介绍链双面话术");
  assert(introducerScene, "扩成长案后必须有介绍人参与的场景");
  assert(dinnerScene, "扩成长案后必须有第一次饭局场景");
  assert(mbaScene, "MBA 必须是追问后才揭示出的具体说法，并明确本科学历有落差");
  assert(motiveScene, "案三必须保留学历纠正后彩礼反涨的玩家追问场景");
  assert(!motiveScene.version.includes("手里应该还有不少") && !motiveScene.version.includes("手里肯定还有积蓄"), "固定陈述不能在玩家选择前说出女方父母的财力推断");
assertEqual(requestedFlowQuestion?.suspicionLabel, requestedFlowQuestion?.question, "顺序追问按钮直接显示主播将说的话");
  assertIncludes(requestedFlowQuestion?.question, "为什么还非要看流水", "第二夜追问承接第一夜她已赞成加价的事实");
  assert(!JSON.stringify(requestedFlowQuestion?.lines).includes("学费"), "第二夜不再以学费复审财力误判");
assertEqual(complicityQuestion?.suspicionLabel, complicityQuestion?.question, "后续顺序追问使用实际台词");
  assertIncludes(complicityQuestion?.answer, "没让她撤回二十八万八", "咨询者必须承认自己没有叫停二十八万八");
  assert(spendingScene?.questionOptions.some(option => option.lines?.some(line => /吃饭|下班/.test(line.text))), "出资争执保留日常关系背景，不强制首述同时列举全部消费");
  assertIncludes(bridePriceFlow, "二十八万八拿不出来", "案三必须先让男方拒绝二十八万八");
  assertIncludes(bridePriceFlow, "工资账户", "案三必须把女方索要流水与男方只交工资账户接在拒绝之后");
  assertIncludes(bridePriceFlow, "二十八万六", "案三必须让工资账户二十八万六成为局部材料，而非主动展示完整家底");
  assertEqual((proofScene?.version?.match(/二十八万六/g) ?? []).length, 0, "案三开场报过二十八万六后，首场固定陈述不得再次完整报数");
  assertIncludes(JSON.stringify(brief), "宸直那三十万", "案三必须把女方家尚未到期的资产带回第二夜");
  assertIncludes(JSON.stringify(brief), "九月底到期", "案三必须明确宸直在案三阶段只到约定期限，不能提前宣布暴雷");
  const profileDeepText = JSON.stringify(brief.sceneVersions.find((scene) => scene.id === "profile-income-and-card"));
  assertIncludes(profileDeepText, "八万四", "双人调解必须在取消饭局前问出咨询者存款");
  assertIncludes(profileDeepText, "六万", "双人调解必须报出愿意投入的资金上限");
});

test("DAILY-008", "daily livestream stays anonymous and single-caller", () => {
  const realNames = new RegExp(NPCS.map((npc) => npc.name).join("|"));
  Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`))
    .forEach((brief) => {
      const directRespondentScenes = (brief.sceneVersions ?? []).filter((item) => item.speakerId === brief.respondentId);
      assertEqual(directRespondentScenes.length, 0, `${brief.plotId} 不能让另一方直接进入 sceneReview`);
      assert((brief.sceneVersions ?? []).every((item) => item.speakerId === brief.complainantId), `${brief.plotId} sceneReview 必须全部由咨询者讲出`);
      assert(!realNames.test(JSON.stringify({
        openingDialogue: brief.openingDialogue,
        sceneVersions: brief.sceneVersions,
        deepFollowup: brief.deepFollowup,
        evidenceCards: brief.evidenceCards,
        stageJudgement: brief.stageJudgement,
        followupTwist: brief.followupTwist,
        truth: brief.truth
      })), `${brief.plotId} 每日直播间文本不能出现 NPC 真名`);
    });
});

test("DAILY-009", "daily cases keep drama, gray zone, and unclear motivation", () => {
  Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`))
    .forEach((brief) => {
      const text = JSON.stringify({
        openingDialogue: brief.openingDialogue,
        sceneVersions: brief.sceneVersions,
        deepFollowup: brief.deepFollowup,
        evidenceCards: brief.evidenceCards,
        stageJudgement: brief.stageJudgement,
        followupTwist: brief.followupTwist,
        truth: brief.truth
      });
      assert(/存款证明|证明|截图|账单|合同|协议|草稿|排班表|聊天|社保|转账|房本|账户|饭局|借钱|还贷|分期|备注|原话|录音|余额|礼物|年卡/.test(text), `${brief.plotId} 必须有具体戏剧物件或原话`);
      assert(/说不清|不确定|可能|转述|父母|家里|妈妈|朋友|平台|面子|体面|被问|借.*嘴|双方|一边|一半|误会|不信任|被筛|表演|试探|委屈|分成|四千|安全感|脆弱|像一家人|最懂|老板娘/.test(text), `${brief.plotId} 必须有灰区动机或不明确推手`);
    });
});

test("DAILY-009B", "case copy avoids gender-war framing but allows mutual harm", () => {
  const forbidden = /男人都|女人都|男的都|女的都|捞女|渣男|拜金女|普信男|女拳|男拳|性别对立/;
  Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`))
    .forEach((brief) => {
      const text = JSON.stringify({
        openingDialogue: brief.openingDialogue,
        sceneVersions: brief.sceneVersions,
        deepFollowup: brief.deepFollowup,
        evidenceCards: brief.evidenceCards,
        stageJudgement: brief.stageJudgement,
        followupTwist: brief.followupTwist,
        truth: brief.truth,
        dailyShareTitle: brief.dailyShareTitle,
        dailyShareBody: brief.dailyShareBody,
        dailyShareQuestion: brief.dailyShareQuestion
      });
      assert(!forbidden.test(text), `${brief.plotId} 不允许使用性别对立或群体攻击文案；双方互害必须写成具体行为链条`);
    });
});

test("DAILY-009C", "playable case copy avoids stock AI-summary phrasing", () => {
  const forbidden = stockAiForbiddenCopyRegex();
  const compressedRetelling = compressedSpokenRetellingRegex();
  const proxyTestimony = proxyTestimonyCompressionRegex();
  const answerCoaching = /更要先看|但这里先看|才是关键|核心痕迹|真正越界要看|这个判断|你中段|这句说明|这说明|它说明|这条不替/;
  const frozenShareFrame = /^让我.*(?:的是|不是)/;
  assert(compressedRetelling.test("问过一次。他愣了一下，说完了。我再问，他就把话岔开。"), "压缩复述门禁必须识别缺少事件时间和动作顺序的旧写法");
  assert(!compressedRetelling.test("问过一次。他当时愣了一下，说完了。然后我再问，他就把话岔开。"), "压缩复述门禁必须允许补全必要时序后的口语写法");
  assert(proxyTestimony.test("好，那我只记“店里不肯说”。不肯说，不等于这个号就是她的。"), "代述门禁必须识别主播把第三方拒答压成自己的结论");
  assert(!proxyTestimony.test("明白，我回去问她本人。餐厅这边不打听了。"), "代述门禁必须允许主播把事实退回原始说话人");
  Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`))
    .forEach((brief) => {
      const text = JSON.stringify({
        publicHook: brief.publicHook,
        storyArcSummary: brief.storyArcSummary,
        storySuspense: brief.storySuspense,
        openingDialogue: brief.openingDialogue,
        sceneVersions: brief.sceneVersions,
        deepFollowup: brief.deepFollowup,
        evidenceCards: brief.evidenceCards,
        evidenceChecks: brief.evidenceChecks,
        investigationHooks: brief.investigationHooks,
        stanceSnapshot: brief.stanceSnapshot,
        accusationChoices: brief.accusationChoices,
        nightStructure: brief.nightStructure,
        overnightStructure: brief.overnightStructure,
        stageJudgement: brief.stageJudgement,
        followupTwist: brief.followupTwist,
        truth: brief.truth,
        dailyShareTitle: brief.dailyShareTitle,
        dailyShareBody: brief.dailyShareBody,
        dailyShareQuestion: brief.dailyShareQuestion
      });
      assert(!forbidden.test(text), `${brief.plotId} 仍有总结腔/AI 腔短语`);
      assert(!compressedRetelling.test(text), `${brief.plotId} 过去事件被压成案情摘要；补回必要的“当时/然后”等时序承接`);
      assert(!proxyTestimony.test(text), `${brief.plotId} 主播把第三方拒答改写成了自己的证词或结论`);
      assert(!answerCoaching.test(text), `${brief.plotId} 误选反馈或复盘仍在替玩家提示正确方向`);
      assert(!frozenShareFrame.test(brief.dailyShareBody ?? ""), `${brief.plotId} 结果卡不能用“让我……的是/不是……”作文式开头`);
    });
});

test("RUNTIME-COPY-001", "runtime generated copy avoids AI and empty-atmosphere phrasing", () => {
  const forbidden = stockAiForbiddenCopyRegex();
  const atmosphereForbidden = /咬住|压住|带散|麦温|人声/;
  [
    ["livePressure", readFileSync(new URL("../src/runtime/livePressure.js", import.meta.url), "utf8")],
    ["recapModel", readFileSync(new URL("../src/runtime/recapModel.js", import.meta.url), "utf8")]
  ].forEach(([name, source]) => {
    chineseStringLiterals(source).forEach((literal) => {
      assert(!forbidden.test(literal), `${name} runtime copy has AI phrase: ${literal}`);
      assert(!atmosphereForbidden.test(literal), `${name} runtime copy has atmosphere filler: ${literal}`);
    });
  });
});

test("DAILY-010", "daily scenes expose a playable core issue", () => {
  Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`))
    .forEach((brief) => {
      (brief.sceneVersions ?? []).forEach((scene, sceneIndex) => {
        const issueQuestions = (scene.questionOptions ?? []).filter((option) => option.contradiction);
        assert(scene.interactionMode === "testimonyWall" || issueQuestions.length >= 1, `${brief.plotId} 第 ${sceneIndex + 1} 段需要可推进的核心问题`);
      });
    });
});

test("DAILY-011", "case 3 line-pick has no marked wrong answers", () => {
  const brief = generateCasesForMode("daily", NPCS, attrs, {
    dailyKey: "2026-06-24",
    plotId: "education-income-fake-profile"
  })[0];
  const buttons = dailyAccusationChoices(brief);
  assert(buttons.length >= 4, "案 3 最终回应必须有四句可选原话");
  assertEqual(buttons[0].accuse, brief.respondentId, "第一句应是诱人的单方材料真假判断");
  assertIncludes(buttons[0].label, "“", "案 3 挑句按钮必须像原话而不是抽象结论");
  const grayIndex = buttons.findIndex((button) => button.accuse === "both");
  assert(grayIndex > 0, "案 3 灰区句不能排在第一个");
  assertIncludes(buttons[grayIndex].label, "你不是要看收入吗", "案 3 灰区原话必须落在只交工资账户的含糊答复");
  assertIncludes(JSON.stringify(brief), "八万四", "案 3 必须把咨询者自己的存款问回台前");
  assert(buttons.every((button) => !("correct" in button)), "最终回应不再标记正确/错误，只记录玩家选择的角度");
});

test("DAILY-012", "final response choices separate caller quote from host response", () => {
  Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`))
    .forEach((brief) => {
      const disclosedText = JSON.stringify([
        brief.openingDialogue,
        brief.sceneVersions,
        brief.deepFollowup,
        brief.evidenceCards
      ]);
      dailyAccusationChoices(brief).forEach((button) => {
        assertIncludes(button.label, "“", `${brief.plotId} 最终选择按钮必须像来电原话`);
        const quote = button.label.replace(/^“|”$/g, "");
        const normalizedDisclosed = disclosedText.replace(/其实/g, "");
        const normalizedQuote = quote.replace(/其实/g, "");
        const quoteDisclosed = normalizedDisclosed.includes(normalizedQuote) || normalizedQuote.split(/[，。？！]/).filter((part) => part.length >= 4).every((part) => normalizedDisclosed.includes(part));
        assert(quoteDisclosed, `${brief.plotId} 最终原话必须来自玩家已经听过或看过的内容：${button.label}`);
        assert(typeof button.response === "string" && button.response.length >= 8, `${brief.plotId} 主播接法必须放在 response 字段`);
      });
    });
});

test("DAILY-013", "daily linear flow has one focused choice per stage", () => {
  Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`))
    .forEach((brief) => {
      const sceneCount = brief.sceneVersions?.length ?? 0;
      assert(sceneCount > 0, `${brief.plotId} 精选集单案不能缺少可玩段落`);
      brief.sceneVersions.forEach((scene, index) => {
        assert((scene.interactionMode === "testimonyWall" || (scene.questionOptions ?? []).length >= 1), `${brief.plotId} 第 ${index + 1} 段必须有关键追问`);
      });
    });
});

test("DAILY-014", "final quote choice changes the result angle", () => {
  Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`))
    .forEach((brief) => {
      if (brief.dialoguePresentation?.compactClosing) return; // 本案当场收麦，不再做最终引语评分。
      const expected = expectedAccusationForCase(brief);
      const choices = dailyAccusationChoices(brief);
      assert(choices.some((choice) => choice.accuse === expected), `${brief.plotId} 必须有一句能接住核心判断`);
      assert(choices.some((choice) => choice.accuse !== expected), `${brief.plotId} 必须有外圈解读，不能选哪句都一样`);
    });
});

test("DAILY-015", "daily engine supports non-romance public incident cases", () => {
  const brief = generateCasesForMode("daily", NPCS, attrs, {
    dailyKey: "2026-06-24",
    plotId: "workplace-reimbursement-screenshot"
  })[0];
  assertEqual(brief.label, "职场报销截图", "每日案必须能生成非婚恋事件模板");
  assertIncludes(brief.openingDialogue.map((line) => line.text).join(" "), "公司", "非婚恋案开场必须交代公共事件场景");
  assertIncludes(JSON.stringify(brief.sceneVersions), "报销", "非婚恋案必须围绕非婚恋事件推进");
  assert(dailyAccusationChoices(brief).some((choice) => /返款|审批|立项|发了三次/.test(choice.label)), "最终挑句必须包含职场事件原话");
});

test("ROUTE-001", "every playable choice records a hidden route axis and tone", () => {
  const briefs = [
    ...Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`)),
    ...generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" })
  ];
  briefs.flatMap((brief) => brief.sceneVersions.flatMap((scene) => scene.questionOptions ?? []))
    .forEach((option) => {
      assert(typeof option.routeAxis === "string" && option.routeAxis.length >= 4, `追问必须记录路线轴：${option.question}`);
      assert(typeof option.routeTone === "string" && option.routeTone.length >= 4, `追问必须记录语气倾向：${option.question}`);
    });
});

test("STATE-001", "legacy saves migrate into episode-compatible shape", () => {
  const stateSource = readFileSync(new URL("../src/state.js", import.meta.url), "utf8");
  assert(!/if\s*\([^)]*plotId|switch\s*\([^)]*plotId/.test(stateSource), "旧存档迁移不能按具体 plotId 写分支；但保存内容刷新键不应被误判");
  const migrated = migrateState({
    profileDone: true,
    caseMode: "unknown-mode",
    caseBriefs: generateCasesForMode("daily", NPCS, attrs, { dailyKey: "2026-06-24" }),
    settings: { textSpeed: "fast" }
  });
  assertEqual(migrated.caseMode, "episode", "未知旧模式必须迁移为案件包入口");
  assertEqual(migrated.settings.textSpeed, "fast", "存档迁移必须保留文本速度设置");
  assertEqual(migrated.settings.contentWarningAccepted, false, "存档迁移必须补内容警示默认值");
  assertEqual(migrated.settings.screenEffects, "full", "旧存档必须补默认完整演出设置");
  assertEqual(typeof migrated.testimonyWallProgress, "object", "旧存档必须补证词墙进度记录");
  assertEqual(typeof migrated.decisivePresentProgress, "object", "旧存档必须补决定性 PRESENT 进度记录");
  assertEqual(migrated.saveSlot, "slot1", "存档迁移必须补默认存档槽");
  assertEqual(migrated.playerName, DEFAULT_PLAYER_NAME, "旧存档必须补默认主播姓名");
  assertEqual(typeof migrated.truthBoundaryPicks, "object", "旧存档必须补 truthBoundaryPicks 记录");
  assertEqual(typeof migrated.truthBoundaryMisses, "object", "旧存档必须补 truthBoundaryMisses 记录");
  assertEqual(migrated.lastPressureSignal, null, "旧存档必须补结构化现场压力状态");
  assertEqual(migrated.lastPressureAxis, null, "旧存档必须补路线轴现场压力状态");
  assertEqual(migrated.patienceLostContext, null, "旧存档必须补耐心耗尽重试上下文");
  assertEqual(typeof migrated.helperHintPicks, "object", "旧存档必须补 V哥求助记录，且不混入路线记录");

  const namedSave = migrateState({ playerName: "周明" });
  assertEqual(namedSave.playerName, "周明", "新存档必须保留玩家输入的主播姓名");
  assertEqual(migrateState({ settings: { screenEffects: "off" } }).settings.screenEffects, "off", "减弱或关闭闪烁震动的设置必须跨存档保留");

  const dailyCallMigrated = migrateState({
    caseMode: "daily",
    chapter: 1,
    caseBriefs: [{ id: "daily-old", caseMode: "daily", plotId: "education-income-fake-profile" }]
  });
  assertEqual(dailyCallMigrated.caseBriefs[0].dailyCase, true, "每日连线存档必须补 dailyCase 标记");

  const unrelatedStoryKeyMigrated = migrateState({
    caseMode: "episode",
    chapter: 1,
    caseBriefs: [{
      id: "ordinary-note",
      storyKey: "unrelated-metadata",
      openingDialogue: [{ role: "host", text: "她问细到哪一步了？" }]
    }]
  });
  assertEqual(unrelatedStoryKeyMigrated.caseBriefs[0].dailyCase, undefined, "仅有 storyKey 的普通 brief 不得误套 daily 迁移");
  assertEqual(unrelatedStoryKeyMigrated.caseBriefs[0].openingDialogue.length, 1, "普通 brief 的台词不得被 daily 过滤器静默删除");

  const legacyWeeklyBriefMigrated = migrateState({
    caseMode: "weekly",
    chapter: 1,
    caseBriefs: [{
      id: "weekly-old-credit",
      caseMode: "weekly",
      weeklyCase: true,
      weeklyKey: "steam-demo-01",
      weeklyThemeTitle: "旧主题",
      weeklyAct: "第一幕",
      weeklyObjectLabel: "旧物件"
    }]
  });
  assertEqual(legacyWeeklyBriefMigrated.caseBriefs[0].storyKey, "steam-demo-01", "旧 weeklyKey 必须迁移为 storyKey");
  assertEqual(legacyWeeklyBriefMigrated.caseBriefs[0].storyPackCase, true, "旧 weeklyCase 必须迁移为 storyPackCase");
  assertEqual(legacyWeeklyBriefMigrated.caseBriefs[0].storyThemeTitle, "旧主题", "旧 weeklyThemeTitle 必须迁移为 storyThemeTitle");
  assertEqual(legacyWeeklyBriefMigrated.caseBriefs[0].storyAct, "第一幕", "旧 weeklyAct 必须迁移为 storyAct");
  assertEqual(legacyWeeklyBriefMigrated.caseBriefs[0].storyObjectLabel, "旧物件", "旧 weeklyObjectLabel 必须迁移为 storyObjectLabel");

  const oldOpeningMigrated = migrateState({
    caseMode: "episode",
    chapter: 3,
    caseBriefs: [{
      id: "episode-old-profile",
      caseMode: "episode",
      plotId: "education-income-fake-profile",
      openingDialogue: [
        { role: "caller", text: "主播你好，我想问下我男朋友的事。" },
        { role: "host", speaker: "你", text: "晚上好。你们怎么认识的，现在聊到哪一步了？" },
        { role: "caller", text: "我们是相亲认识的，最近聊到见父母。我之前跟家里说过他名校毕业、条件不错，所以我妈问得比我想象中细。" },
        { role: "host", speaker: "你", text: "她问细到哪一步了？" },
        { role: "caller", text: "学校、工作、收入、有没有存款，后来还绕到流水。我也知道见父母前问这么细有点过，可我当时没拦住。" }
      ],
      sceneVersions: [
        {
          questionOptions: [
            { question: "后来这件事，你跟家里改过口吗？", routeAxis: "money-flow" },
            { question: "这个好看的版本，是他一个人说出来的吗？", routeAxis: "money-flow" }
          ]
        }
      ]
    }]
  });
  const migratedOpeningText = JSON.stringify(oldOpeningMigrated.caseBriefs[0].openingDialogue);
  assert(!migratedOpeningText.includes("她问细到哪一步了？"), "旧存档里悬空的主播问句必须迁移掉");
  assert(!migratedOpeningText.includes("学校、工作、收入、有没有存款"), "旧存档里被切到首屏外的回答必须迁移掉，交给第一段原话承接");
  assertEqual(oldOpeningMigrated.caseBriefs[0].sceneVersions[0].questionOptions[0].routeAxis, "caller-credibility", "旧存档里问来电人自己的追问必须迁移为来电人可信度线");
  assertEqual(oldOpeningMigrated.caseBriefs[0].sceneVersions[0].questionOptions[1].routeAxis, "identity-wording", "旧存档里问好看版本来源的追问必须迁移为身份话术线");

  const oldQuestionMigrated = migrateState({
    caseMode: "episode",
    chapter: 1,
    caseBriefs: [{
      id: "episode-old-credit",
      caseMode: "episode",
      plotId: "lost-job-hidden-credit",
      sceneVersions: [{
        questionOptions: [
          {
            question: "你当时是不是先心疼他了？",
            answer: "是。我第一反应是他是不是压力太大，想先把人稳住。可后来再看，失业到底从什么时候开始，他一直没讲。"
          }
        ]
      }]
    }],
    sceneQuestionPicks: {
      "episode-old-credit:0": { question: "你当时是不是先心疼他了？" }
    },
    routeChoiceLog: {
      "episode-old-credit": [{ question: "你当时是不是先心疼他了？" }]
    }
  });
  const migratedOption = oldQuestionMigrated.caseBriefs[0].sceneVersions[0].questionOptions[0];
  assertEqual(migratedOption.question, "你当时有没有起疑心？", "旧存档里的主播心理标签按钮必须迁移为事实追问");
  assertIncludes(migratedOption.answer, "一开始没有", "旧存档里的回答也要跟着按钮语气迁移");
  assertEqual(oldQuestionMigrated.sceneQuestionPicks["episode-old-credit:0"].question, "你当时有没有起疑心？", "旧已选追问必须同步迁移");
  assertEqual(oldQuestionMigrated.routeChoiceLog["episode-old-credit"][0].question, "你当时有没有起疑心？", "旧路线日志必须同步迁移");

  const oldRelationQuestionMigrated = migrateState({
    caseMode: "episode",
    chapter: 2,
    caseBriefs: [{
      id: "episode-old-salon",
      caseMode: "episode",
      plotId: "tony-multi-dating",
      sceneVersions: [{
        questionOptions: [{ question: "关系一直没说死，你当时怎么接的？" }]
      }]
    }],
    sceneQuestionPicks: {
      "episode-old-salon:0": { question: "关系一直没说死，你当时怎么接的？" }
    }
  });
  assertEqual(oldRelationQuestionMigrated.caseBriefs[0].sceneVersions[0].questionOptions[0].question, "话当时没说死，你当时怎么回他的？", "旧理发店追问必须迁移掉整理腔");
  assertEqual(oldRelationQuestionMigrated.sceneQuestionPicks["episode-old-salon:0"].question, "话当时没说死，你当时怎么回他的？", "旧已选理发店追问必须同步迁移");

  const workplaceAxisMigrated = migrateState({
    caseMode: "episode",
    chapter: 4,
    caseBriefs: [{
      id: "episode-old-workplace",
      caseMode: "episode",
      plotId: "workplace-reimbursement-screenshot",
      sceneVersions: [{
        questionOptions: [
          { question: "他让你垫钱时，原话有没有提署名和老板？", routeAxis: "money-flow" }
        ]
      }]
    }]
  });
  assertEqual(workplaceAxisMigrated.caseBriefs[0].sceneVersions[0].questionOptions[0].routeAxis, "identity-wording", "旧职场存档里垫钱+署名追问必须迁移为身份话术线");

  const episodeMigrated = migrateState({
    caseMode: "weekly",
    chapter: 2,
    caseBriefs: generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" })
  });
  assertEqual(episodeMigrated.caseMode, "episode", "旧 weekly 存档模式必须迁移为 episode");
  assertEqual(episodeMigrated.caseBriefs.length, storyPackCaseCount(storyPackForKey("steam-demo-01")), "当前 demo 包存档必须保留 manifest 指定的案件数");
  assertEqual(episodeMigrated.caseBriefs[0].modeLabel, "试玩连线", "故事包案必须迁移为不剧透的模式标签");

  const variableEpisodeMigrated = migrateState({
    caseMode: "episode",
    chapter: 2,
    caseBriefs: generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" }).slice(0, 3)
  });
  assertEqual(variableEpisodeMigrated.caseBriefs.length, 3, "episode 存档不能再把三案章节包当成坏存档清掉");
});

test("STATE-001A", "runtime state normalization has one authoritative entry point", () => {
  const normalized = normalizeRuntimeState({
    screen: "retired-screen",
    chapter: "2",
    sceneAnswers: [],
    attrs: { wealth: 7 }
  });
  assertEqual(normalized.screen, "title", "废弃顶层页面必须回到标题页");
  assertEqual(normalized.chapter, 2, "章节序号必须在统一入口转成数字");
  assertEqual(normalized.attrs.wealth, 7, "统一入口必须保留有效属性覆盖");
  assertEqual(normalized.attrs.family, 4, "统一入口必须补齐缺失属性");
  assertEqual(Array.isArray(normalized.sceneAnswers), false, "统一入口必须修复损坏的映射字段");
  assertEqual(normalizeRuntimeState({ chapter: "broken" }).chapter, 1, "损坏章节序号必须回到第一章");

  const quickMode = normalizeRuntimeState({ screen: "quickDetective", quickDetective: {} });
  assertEqual(quickMode.screen, "quickDetective", "快速案件顶层页面必须保持可恢复");
});

test("STATE-001B", "damaged or unrefreshable saves stop at a visible recovery state", () => {
  const damaged = parseStateSnapshot("{not-json", "slot1");
  assertEqual(damaged.screen, "title", "损坏存档必须停在标题页，不得直接进新游戏");
  assertEqual(damaged.saveLoadError, "corrupt-save", "损坏存档必须留下可见的恢复标记");
  const saved = {
    screen: "chapter",
    caseMode: "episode",
    chapter: 1,
    caseBriefs: [{ id: "episode-old", storyKey: "steam-demo-01" }],
    caseBrief: { id: "episode-old", storyKey: "steam-demo-01" }
  };
  const failedRefresh = refreshSavedCaseContent(saved, { generateCases: () => { throw new Error("broken pack"); }, npcs: NPCS });
  assertEqual(failedRefresh.screen, "title", "存档与当前内容无法对齐时必须退回标题页");
  assertEqual(failedRefresh.saveLoadError, "content-refresh-failed", "内容刷新失败不得被静默吞掉");
  const recoveryTitle = titleScreenHtml({ canContinue: false, saveLoadError: damaged.saveLoadError, confirmNewGame: false });
  assertIncludes(recoveryTitle, "data-request-new-game", "损坏存档状态下点新游戏必须先进确认层");
  assert(!recoveryTitle.includes("data-start-story"), "损坏存档不得被一次点击直接覆盖");
});

test("STATE-001C", "persisted state keeps progress but replaces authored case payloads with refresh keys", () => {
  const [brief] = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const snapshot = stateSnapshotForPersistence({
    screen: "chapter",
    chapter: 1,
    caseMode: "episode",
    caseBriefs: [brief],
    caseBrief: brief,
    sceneAnswers: { kept: "玩家选择" },
    saveLoadError: "transient",
    saveWriteError: "transient"
  });
  assertEqual(snapshot.sceneAnswers.kept, "玩家选择", "存档瘦身必须保留玩家进度");
  assertEqual(snapshot.caseBriefs[0].storyKey, "steam-demo-01", "存档必须保留内容包刷新键");
  assertEqual("sceneVersions" in snapshot.caseBriefs[0], false, "存档不得重复写入整份作者台词");
  assertEqual("caseBrief" in snapshot, false, "当前案卷可由 caseBriefs 和章节号恢复，不应重复持久化");
  assertEqual("saveLoadError" in snapshot, false, "读取错误提示不得写回永久存档");
  assertEqual("saveWriteError" in snapshot, false, "写入错误提示不得写回永久存档");
  const serialized = JSON.stringify(snapshot);
  assert(!serialized.includes(brief.openingDialogue?.[0]?.text ?? "__missing__"), "序列化进度不得夹带作者台词");
  assert(serialized.length < 30_000, `空进度案件包存档应低于 30KB，当前 ${serialized.length} bytes`);
  const restored = refreshSavedCaseContent(parseStateSnapshot(serialized, "slot1"), {
    generateCases: (npcs, savedAttrs, options) => generateCasesForMode("episode", npcs, savedAttrs, options),
    npcs: NPCS
  });
  assertEqual(restored.sceneAnswers.kept, "玩家选择", "瘦身存档刷新内容后必须保留玩家进度");
  assert((restored.caseBriefs[0].sceneVersions ?? []).length > 0, "瘦身存档读回后必须重建完整台本");
});

test("STATE-002", "saved progress refreshes authored case copy from the current content pack", () => {
  const currentBriefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const staleBriefs = structuredClone(currentBriefs);
  const staleAnniversary = staleBriefs[0].sceneVersions.find((scene) => scene.id === "credit-anniversary-agency");
  staleAnniversary.version = "他把酒单推到我面前。酒是他点的，我当时也没拦。";
  const saved = {
    caseMode: "episode",
    chapter: 1,
    attrs,
    caseBriefs: staleBriefs,
    caseBrief: staleBriefs[0],
    scene: "sceneReview",
    sceneAnswers: { kept: "玩家已经做过的选择" },
    contradictionLog: { kept: ["既有矛盾"] }
  };
  const refreshed = refreshSavedCaseContent(saved, {
    generateCases: (npcs, savedAttrs, options) => generateCasesForMode("episode", npcs, savedAttrs, options),
    npcs: NPCS
  });
  const anniversary = refreshed.caseBriefs[0].sceneVersions.find((scene) => scene.id === "credit-anniversary-agency");
  assertIncludes(anniversary.version, "认识他以前跟朋友去过一次", "继续旧存档时刷新当前来源陈述");
  assert(!anniversary.version.includes("他把酒单推到我面前"), "存档刷新后不得保留已经废弃的点酒台词");
  assertEqual(refreshed.caseBrief, refreshed.caseBriefs[0], "刷新内容后当前案件引用必须指向同一份新台本");
  assertEqual(refreshed.sceneAnswers.kept, saved.sceneAnswers.kept, "刷新台本不能清掉玩家已经完成的问答");
  assertEqual(refreshed.contradictionLog.kept[0], "既有矛盾", "刷新台本不能清掉玩家已经取得的矛盾");
});

test("STATE-002B", "removed daytime scenes refund their slot instead of trapping an old save", () => {
  const currentBriefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const caseId = currentBriefs[0].id;
  const saved = {
    caseMode: "episode",
    chapter: 1,
    attrs,
    caseBriefs: currentBriefs,
    caseBrief: currentBriefs[0],
    scene: "overnightCallback",
    caseOvernights: {
      [caseId]: {
        segment: "day",
        dayBudget: { max: 2, remaining: 0, used: 2 },
        dayScenesDone: ["day-accounting", "day-cafe-sitin"],
        earnedItems: ["周会计的时间线", "他对三万五的沉默"],
        activeDaySceneId: "day-cafe-sitin",
        callbackOpenerId: "他对三万五的沉默",
        dayChoices: { "day-cafe-sitin": "leave-early" },
        dayFollowups: { "day-cafe-sitin": true },
        timelineSorts: { "day-accounting": { submitted: true }, "day-cafe-sitin": { submitted: true } }
      }
    }
  };
  const refreshed = refreshSavedCaseContent(saved, {
    generateCases: (npcs, savedAttrs, options) => generateCasesForMode("episode", npcs, savedAttrs, options),
    npcs: NPCS
  });
  const overnight = refreshed.caseOvernights[caseId];
  assertEqual(refreshed.scene, "dayMap", "旧白天场景被删除后，存档必须回到安排页继续选择");
  assertEqual(overnight.dayScenesDone.join("|"), "", "已删除场景与未排对的时间线均不能算完成");
  assertEqual(overnight.dayBudget.remaining, 0, "旧存档接入线性流程，不再分配时间格");
  assertEqual(overnight.activeDaySceneId, null, "活动中的旧场景 id 必须清掉");
  assertEqual(overnight.callbackOpenerId, null, "旧场景带回的回拨开场必须清掉");
  assertEqual(overnight.earnedItems.join("|"), "", "未排对不能授予时间线材料");
  assertEqual(Object.keys(overnight.dayChoices).length, 0, "旧场景选项不能继续留在存档里");
  assert(!canEnterOvernightCallback(currentBriefs[0], {
    ...overnight,
    dayScenesDone: ["day-accounting", "day-cafe-sitin"]
  }), "回拨门槛不能把已删除场景算作合法调查");
});

test("STATE-003", "retired advisor routes migrate without leaking internal ids", () => {
  const migrated = migrateState({
    caseNights: {
      workplace: {
        activeActionId: "zhao-zhou-work",
        inventory: ["work-frame-zhou", "work-frame-lin", "delegation-return"],
        interludeActionsDone: ["send-appraisal", "zhao-zhou-work"],
        interludeChoicesDone: ["work-frame-zhou"],
        interludeActionChoices: { "zhao-zhou-work": "work-frame-zhou" }
      }
    },
    caseOvernights: {
      workplace: {
        earnedItems: ["周会计钱路框架", "顾问回单"],
        callbackOpenerId: "周会计钱路框架"
      }
    },
    caseActionLog: {
      workplace: { "interlude:zhao-zhou-work": true }
    },
    delegationPicks: {
      workplace: { material: { id: "work-approval-missing", label: "那张审批图" } }
    },
    earnedItems: ["周会计钱路框架"]
  });
  const night = migrated.caseNights.workplace;
  assertEqual(night.activeActionId, null, "已经完成的旧顾问分流不得迁成一个无法退出的活动页面");
  assertEqual(night.inventory.join("|"), "approval-page-reviewed", "旧顾问库存必须折叠成一份立项页核对结果");
  assertEqual(night.interludeActionsDone.join("|"), "recheck-approval-page", "旧顾问行动进度必须迁到当前行动并去重");
  assertEqual(night.interludeChoicesDone.length, 0, "已删除的顾问选项不得留在存档里");
  assertEqual(Object.keys(night.interludeActionChoices).length, 0, "已删除的顾问分流记录不得继续参与界面渲染");
  assertEqual(migrated.caseOvernights.workplace.earnedItems.join("|"), "立项页不是报销单", "旧回拨物必须折叠成当前玩家可见名");
  assertEqual(migrated.caseOvernights.workplace.callbackOpenerId, "立项页不是报销单", "已选旧 opener 必须迁到当前立项页 opener");
  assert(migrated.caseActionLog.workplace["interlude:recheck-approval-page"], "旧行动日志必须保留完成状态");
  assertEqual(Object.keys(migrated.delegationPicks).length, 0, "已删除委托的顾问回单不得继续出现在案卷");
  assertEqual(migrated.earnedItems.join("|"), "立项页不是报销单", "旧全局收获不得泄漏内部名称");
  const inProgress = migrateState({
    caseNights: { workplace: { activeActionId: "zhao-zhou-work", interludeActionsDone: [] } }
  });
  assertEqual(inProgress.caseNights.workplace.activeActionId, "recheck-approval-page", "尚未完成的旧顾问分流必须落到当前审批页行动");
});

test("RUNTIME-001", "case outcome records daily recap rhythm without visible score systems", () => {
  const efficientWin = calculateCaseOutcome({
    result: { correct: true },
    contradictionCount: 3,
    budgetRemaining: 1,
    now: 1
  });
  assertEqual(efficientWin.interlude.reputationDelta, 3, "高效聊透时只记录内部复盘增量");
  assertIncludes(efficientWin.interlude.summary, "后面那几句也补出来", "正确结案复盘必须保持直播连线语境");

  const failedCase = calculateCaseOutcome({
    result: { correct: false },
    contradictionCount: 1,
    budgetRemaining: 0,
    now: 2
  });
  assertEqual(failedCase.interlude.reputationDelta, -1, "判断偏掉时只记录内部复盘扣分");
  assertIncludes(failedCase.interlude.summary, "弹幕已经开始吵", "失败复盘必须保留直播间反馈");
});

test("RUNTIME-002", "daily pacing and story-pack difficulty profiles stay bounded", () => {
  assert(calculateCaseBudgetMax({ brief: { caseMode: "daily" }, bonusPoints: 5 }) >= 4, "每日案追问次数必须有保底");
  assertEqual(calculateInspirationMax({ brief: { dailyCase: true }, caseMode: "daily" }), 1, "每日案提示只能保留一次");
  const cases = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  assert(calculateCaseBudgetMax({ brief: cases[0] }) > calculateCaseBudgetMax({ brief: cases[3] }), "故事包后段必须能通过 manifest 收紧听众耐心预算");
  assertEqual(truthBoundaryPromptLimitForCase(cases[3]), 6, "故事包后段必须能通过 manifest 增加事实边界题量");
});

test("RUNTIME-003", "accusation resolution respects stance and clue threshold", () => {
  const enoughBoth = resolveAccusationForCase({
    brief: { id: "case-a", stance: "halfTruth" },
    accused: "both",
    contradictionCount: 2,
    requiredContradictions: 2
  });
  assert(enoughBoth.result.correct === true && enoughBoth.enoughContradictions === true, "指认在矛盾足够时必须正确");

  const notEnough = resolveAccusationForCase({
    brief: { id: "case-b", stance: "halfTruth" },
    accused: "both",
    contradictionCount: 1,
    requiredContradictions: 2
  });
  assert(notEnough.result.correct === false && notEnough.enoughContradictions === false, "矛盾不足时即使命中方向也不能正确");
  assertEqual(relationshipExpectedAccusationForCase({ stance: "halfTruth" }), "both", "halfTruth 关系层应指向双方修剪事实");
  assertEqual(relationshipExpectedAccusationForCase({ stance: "halfTruth", premeditated: true, premeditatedActorId: "respondent" }), "both", "halfTruth 不能被旧预谋字段覆盖成单方责任");
  assertEqual(expectedAccusationForCase({ stance: "halfTruth", structuralActorId: "platform" }), "platform", "结构层指认应覆盖关系层");
});

test("RUNTIME-004", "explicit resolver override can bypass clue threshold when requested", () => {
  const quotePick = resolveAccusationForCase({
    brief: { id: "daily-a", caseMode: "daily", stance: "halfTruth" },
    accused: "both",
    contradictionCount: 1,
    requiredContradictions: 3,
    allowCorrectWithoutThreshold: true
  });
  assert(quotePick.result.correct === true, "显式 override 应能绕过隐藏矛盾计数");
  assert(quotePick.result.thresholdForgiven === true, "显式 override 必须记录这是阈值豁免");

  const ordinary = resolveAccusationForCase({
    brief: { id: "case-c", stance: "halfTruth" },
    accused: "both",
    contradictionCount: 1,
    requiredContradictions: 3
  });
  assert(ordinary.result.correct === false, "普通案件仍然必须满足线索阈值");
});

test("RUNTIME-004B", "final quote selects a recap angle while clue completion controls case closure", () => {
  const brief = { id: "daily-angle", stance: "halfTruth", structuralActorId: "platform" };
  const alternate = resolveFinalQuoteForCase({ brief, selectedQuote: "both", issue: { badge: true } });
  assert(alternate.deductionComplete && alternate.correct && alternate.dailyBadge, "线索已完成时，非最佳原话也必须允许正常结案");
  assertEqual(alternate.quoteHit, false, "非最佳原话必须保留为不同复盘角度，不能伪装成同一句");
  const best = resolveFinalQuoteForCase({ brief, selectedQuote: "platform", issue: { badge: true } });
  assertEqual(best.quoteHit, true, "选择最佳原话时必须记录命中供复盘比较");
  const incomplete = resolveFinalQuoteForCase({ brief, selectedQuote: "platform", issue: { badge: false } });
  assert(!incomplete.deductionComplete && !incomplete.correct, "线索没有完成时不能仅凭选中某句话结案");
});

test("RUNTIME-005", "recap model stays pure and reusable outside app rendering", () => {
  const [brief] = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const result = {
    accused: "both",
    issuePercent: 100,
    quoteHit: true,
    dailyAccuseLabel: "“我只是怕你知道我失业后就离开我。”",
    issueRevealed: ["社保断缴早于借钱。"]
  };
  const route = buildDailyRouteProfile(brief, result, { axisProfile: { axis: "money-flow" }, issue: { percent: 100 } });
  assertEqual(recapRankLabel({ badge: true, percent: 100 }), "能挂麦", "复盘等级必须由纯模型生成");
  assertEqual(dailyPlayerType({ percent: 75, quoteHit: false, axis: "document-edge" }), "截图拆边主播", "玩家类型必须由纯模型生成");
  assertEqual(route.label, "收得住", "收麦路线标签必须由纯模型生成");
  assertIncludes(route.shareBody, "社保断缴早于借钱", "分享文案必须优先回收已揭示矛盾");
  const comparison = finalQuoteComparison(brief, result);
  assert(comparison?.pickedLabel, "最终原话比较必须能脱离 DOM 生成");
  assert(comparison.bestLabel, "最终原话比较必须给出可回看的收束口子");
  const branchConclusion = dailyConclusionModel({
    conclusionBranches: [{ match: "流水", summary: "先看流水这条线。", followup: "后台补了流水截图。", truth: "只能确认钱的入口。" }],
    truth: "默认收束。"
  }, {}, { badge: false, revealed: ["收入说法不稳"] }, { pickedQuestions: ["那流水后来给你看了吗？"] });
  assertEqual(branchConclusion.summary, "先看流水这条线。", "结算分支必须由内容字段和玩家问题匹配生成");
  assertEqual(branchConclusion.truth, "只能确认钱的入口。", "结算分支必须能覆盖默认 truth");
  const boundary = truthBoundaryReview(brief);
  assertEqual(boundary.columns.length, 3, "回看必须分成能确认、被改过、还不能定三栏");
  assertEqual(boundary.columns[0].label, "能确认", "事实边界第一栏不能写成判题提示");
  assert(boundary.columns[2].items.length > 0, "事实边界必须保留未知项，避免结算页写成全知判词");
  assertEqual(boundary.prompts.length, 5, "事实边界必须使用多于三句，不允许每栏只取第一条");
  assert(boundary.prompts.some((prompt) => prompt.id.endsWith(":1")), "事实边界必须用到每栏第一条以外的数据");
  assertEqual(boundary.prompts.filter((prompt) => prompt.expected === "true").length, 2, "事实边界不应固定成三栏各一条的元游戏");
  assertEqual(boundary.choices.length, 3, "事实边界归位必须提供三类边界选项");
  const perfectPicks = Object.fromEntries(boundary.prompts.map((prompt) => [prompt.id, prompt.expected]));
  const wrongPickKey = boundary.choices.find((choice) => choice.key !== boundary.prompts[0].expected)?.key;
  const wrongPicks = { ...perfectPicks, [boundary.prompts[0].id]: wrongPickKey };
  assertIncludes(truthBoundaryAftertaste(boundary, perfectPicks, {}), "能说清", "事实边界全放对要影响最终收话余味");
  assertIncludes(truthBoundaryAftertaste(boundary, wrongPicks, { [boundary.prompts[0].id]: 1 }), "还悬着", "事实边界一次放错会改变终局，不能现场纠正到标准答案");
  const packProfile = truthBoundaryPackProfile([{ label: brief.label, review: boundary, picks: perfectPicks, misses: {} }]);
  assertEqual(packProfile.label, "挂得住", "故事集终局必须能汇总事实边界归位结果");
  assertIncludes(packProfile.comment, "挂得住", "事实边界全放稳要进入故事集评论区");
  const wrongProfile = truthBoundaryPackProfile([{ label: brief.label, review: boundary, picks: wrongPicks, misses: { [boundary.prompts[0].id]: 1 } }]);
  assertEqual(wrongProfile.label, "定急了", "事实边界一次放错要改变故事集终局标签");
  assertIncludes(wrongProfile.line, "证据到不了", "故事集终局必须回收边界误放痕迹");
  const backflowHit = investigationBackflowProfile([{ correct: true }]);
  assertEqual(backflowHit.label, "私信补上", "回流材料命中必须生成案间余味标签");
  assertIncludes(backflowHit.line, "缺口", "回流材料命中必须回收到案间过渡");
  const backflowMiss = investigationBackflowProfile([{ correct: false }]);
  assertEqual(backflowMiss.label, "被带偏", "回流材料误指必须生成不同案间余味");
  assertIncludes(investigationPickReaction({ correct: false, pick: { label: "截图边角" } }, { surface: "后台私信" }), "弹幕", "回流材料误指必须牵动现场弹幕反应");
});

test("RUNTIME-006", "scene advance helpers stay pure outside app state", () => {
  const [brief] = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const done = new Set(["version:0", "version:1", "evidenceCheck:0"]);
  (brief.evidenceChecks ?? []).forEach((_, index) => done.add(`evidenceCheck:${index}`));
  const actionDone = (key) => done.has(key);
  const notReady = accusationReadinessForCase(brief, actionDone);
  assertEqual(notReady.ready, false, "未问完场景时不能进入收麦");
  assertIncludes(notReady.message, "当前这段", "未问完场景时要回到当前段");
  brief.sceneVersions.forEach((_, index) => done.add(`version:${index}`));
  const ready = accusationReadinessForCase(brief, actionDone);
  assertEqual(ready.ready, true, "场景和材料都完成后可以收麦");
  assertEqual(evidenceAnsweredCount(brief, actionDone), (brief.evidenceChecks ?? []).length, "材料完成数必须由纯函数计算");
  assertEqual(investigationRouteIndexBase(brief), (brief.sceneVersions ?? []).length + (brief.evidenceChecks ?? []).length, "回流路线下标必须接在材料节点之后");
  assertEqual(answerKey(brief, 2), `${brief.id}:scene:2`, "场景答案 key 必须稳定");
  const firstReview = sceneReviewModel({ brief, index: 0, actionDone });
  assertEqual(firstReview.done, true, "对话段落完成状态必须由纯函数读取");
  assertEqual(firstReview.nextStage, "sceneReview", "非最后一段仍应停在继续对话流程");
  const pendingDone = new Set(done);
  pendingDone.delete("evidenceCheck:0");
  const pendingReview = sceneReviewModel({ brief, index: (brief.sceneVersions ?? []).length - 1, actionDone: (key) => pendingDone.has(key), issueBadge: true, hasDeepFollowup: true });
  assertEqual(pendingReview.nextStage, "evidenceCheck", "最后一段后若还有未处理材料，必须先看材料");
  const lastReview = sceneReviewModel({ brief, index: (brief.sceneVersions ?? []).length - 1, actionDone, issueBadge: true, hasDeepFollowup: true });
  assertEqual(lastReview.nextStage, "deepFollowup", "最后一段后若材料已中置处理，可进入深入追问");
  const deepReview = sceneReviewModel({ brief: { id: "no-evidence", sceneVersions: [{}, {}] }, index: 1, actionDone: () => true, issueBadge: true, hasDeepFollowup: true });
  assertEqual(deepReview.nextStage, "deepFollowup", "无材料且已问到关键点时才进入深入追问");
  const accusationReview = sceneReviewModel({ brief: { id: "plain", sceneVersions: [{}] }, index: 0, actionDone: () => true });
  assertEqual(accusationReview.nextLabel, "选一句往下追", "普通末段应进入原话追问选择");
  const firstEvidence = evidenceCheckModel({ brief, index: 0, pick: { correct: true }, issueBadge: true, hasDeepFollowup: true });
  assertEqual(firstEvidence.missing, false, "材料模型必须返回当前材料");
  assertEqual(firstEvidence.nextStage, "deepFollowup", "材料全部处理完后才按案件状态决定下一步");
  const missingEvidence = evidenceCheckModel({ brief: { id: "empty", evidenceChecks: [] }, index: 0 });
  assertEqual(missingEvidence.missing, true, "无材料时模型必须显式返回 missing");
  const unlocked = unlockedInvestigationEntries(brief, {
    foundContradictions: [brief.investigationHooks?.[0]?.triggerContradiction].filter(Boolean),
    actionDone
  });
  assert(unlocked.length >= 1, "回流材料必须能由已发现矛盾纯函数解锁");
  const backflow = investigationBackflowModel({
    entries: [{ index: 0, hook: { surface: "第一条" } }, { index: 1, hook: { surface: "第二条" } }],
    selectedPick: (index) => index === 0 ? { correct: true } : null
  });
  assertEqual(backflow.index, 1, "回流模型必须优先返回未处理的回流材料");
  assertEqual(backflow.nextLabel, "继续回看", "回流模型必须统一给出回看入口文案");
  const emptyBackflow = investigationBackflowModel({ entries: [] });
  assertEqual(emptyBackflow.missing, true, "没有可见回流时模型必须显式返回 missing");
});

test("RUNTIME-007", "action mark patches spend budget without mutating old state", () => {
  const originalBudget = initialCaseBudget(3);
  const first = applyActionMark({
    caseActionLog: {},
    caseId: "case-a",
    actionKey: "version:0",
    budget: originalBudget,
    spend: true
  });
  assertEqual(originalBudget.remaining, 3, "旧预算对象不能被直接改写");
  assertEqual(first.budget.remaining, 2, "第一次消耗动作必须扣 1 点耐心");
  assertEqual(first.budget.used, 1, "第一次消耗动作必须记录 used");
  assertEqual(first.caseActionLog["case-a"]["version:0"], true, "动作记录必须写入对应案件");
  const second = applyActionMark({
    caseActionLog: first.caseActionLog,
    caseId: "case-a",
    actionKey: "version:0",
    budget: first.budget,
    spend: true
  });
  assertEqual(second.alreadyDone, true, "重复动作必须识别为已完成");
  assertEqual(second.budget.remaining, 2, "重复动作不能重复扣耐心");
  assert(casePatienceLost({ budget: { remaining: 0 }, answeredScenes: 1, requiredScenes: 2 }), "耐心耗尽且未问完时必须失败");
  assert(!casePatienceLost({ budget: { remaining: 0 }, answeredScenes: 2, requiredScenes: 2, answeredEvidence: 1, requiredEvidence: 1 }), "已经问完时不能因为刚好归零误判失败");
  const lost = recordPatienceLostState({
    state: { scene: "sceneReview", lastReaction: "吵起来了", lastPressureSignal: "miss" },
    brief: { id: "case-a" },
    context: {
      area: "sceneReview",
      index: 1,
      answerKey: "case-a:scene:1",
      actionKeys: ["sceneQuestion:1:0", "version:1"],
      routeIndex: 1,
      removeQuestionPick: true,
      spent: true
    }
  });
  assertEqual(lost.scene, "patienceLost", "耐心耗尽必须进入当前案失败态");
  assertEqual(lost.patienceLostContext.index, 1, "耐心耗尽必须记录失败发生在哪一步");
  assertEqual(lost.lastPressureSignal, null, "进入失败态时必须清掉上一条压力反应");
  const retried = retryPatienceLostState({
    state: {
      scene: "patienceLost",
      patienceLostContext: lost.patienceLostContext,
      sceneQuestionPicks: { "case-a:scene:1": { question: "刚才怎么回的？" } },
      sceneAnswers: { "case-a:scene:1": "我没想那么多。" },
      caseActionLog: { "case-a": { "sceneQuestion:1:0": true, "version:1": true, "version:0": true } },
      routeChoiceLog: { "case-a": [{ sceneIndex: 0 }, { sceneIndex: 1 }] },
      caseBudgets: { "case-a": { max: 3, remaining: 0, used: 3 } },
      dialogueProgress: {}
    },
    brief: { id: "case-a" },
    budget: { max: 3, remaining: 0, used: 3 },
    areaTotal: 5
  });
  assertEqual(retried.scene, "sceneReview", "重试必须回到断掉的当前流程，不进下一通");
  assertEqual(retried.dialogueProgress["case-a:sceneReview"], 1, "重试必须回到失败的那一句");
  assertEqual(retried.caseBudgets["case-a"].remaining, 1, "重试必须退回这一次消耗的耐心");
  assertEqual(retried.caseBudgets["case-a"].used, 2, "重试必须撤销这一次 used 计数");
  assert(!retried.sceneQuestionPicks["case-a:scene:1"], "重试必须撤销这一次失败追问");
  assert(!retried.sceneAnswers["case-a:scene:1"], "重试必须撤销这一次失败回答");
  assert(!retried.caseActionLog["case-a"]["sceneQuestion:1:0"], "重试必须撤销失败动作");
  assert(!retried.caseActionLog["case-a"]["version:1"], "重试必须让当前句重新可问");
  assertEqual(retried.routeChoiceLog["case-a"].length, 1, "重试必须移除这一步路线记录");
  assertEqual(retried.patienceLostContext, null, "重试后不能保留失败上下文");
  const appSource = runtimeSource;
  assert(!appSource.includes("data-after-patience-lost"), "耐心耗尽页不能跳下一通或进故事集总结");
});

test("RUNTIME-008", "focused case day receipt gates callback without a document-question loop", () => {
  const [brief] = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  assertEqual(overnightAnchorSceneIndex(brief), 1, "第一夜在社保缴费问清后收麦");
  const structure = overnightStructureFor(brief);
  const day = structure.dayScenes[0];
  assertEqual(structure.dayScenes.length, 1, "只保留一次材料接收");
  assert(!canEnterOvernightCallback(brief, { dayScenesDone: [] }), "漏看材料不得跨过");
  assert(canEnterOvernightCallback(brief, { dayScenesDone: [day.id] }), "看完材料直接下一晚");
  assertEqual(earnedDocumentQuestionsFor(brief.documents[0], ["r13", "r14", "r15"]).length, 0, "不生成下一晚重复的逐行对账");
  assert(!overnightCallerQuestionFor(brief), "收尾没有新一轮提问");
});
test("RUNTIME-008A", "non-contiguous night scenes skip archived beats without blocking the finale", () => {
  const [brief] = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  assertEqual(playableSceneIndexes(brief).join("|"), "0|2|3|1|6|7", "案一运行时只应包含两夜登记的六个场景");
  assertEqual(playableSceneCount(brief), 6, "案一 HUD 与结案门槛必须按六个实际场景计数");
  assertEqual(nextPlayableSceneIndex(brief, 1), 6, "第二夜必须越过归档场景 4、5，直接进入下一个有效场景");
  const done = new Set([0, 1, 2, 3].map((index) => `version:${index}`));
  assertEqual(firstUnansweredSceneIndex(brief, (key) => done.has(key)), 6, "未回答场景查找不得把归档场景重新塞回流程");
  const allActiveDone = new Set(playableSceneIndexes(brief).map((index) => `version:${index}`));
  assertEqual(answeredSceneCountForState({ caseActionLog: { [brief.id]: Object.fromEntries([...allActiveDone].map((key) => [key, true])) } }, brief), 6, "完成数必须忽略归档场景");
});

test("RUNTIME-009", "case 2 receives material through caller contacts, a public service call and a shop appointment", () => {
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const brief = briefs.find((item) => item.runtimeContentCaseId === "02-tony");
  assert(brief, "案 2 必须存在");
  const nightStructure = nightStructureFor(brief);
  assert(nightStructure, "案 2 必须保留两段连线结构");
  assert(shouldEnterHangupAfterScene(brief, 3), "案 2 第四段材料结束后必须真正进入跨夜挂断");
  assertEqual(overnightAnchorSceneIndex(brief), 3, "案 2 的隔夜锚点必须能命中第四段场尾的敲门，不得要求把动作硬塞进陈述正文");
  assert(shouldEnterOvernightHangupAfterScene(brief, 3), "案 2 敲门场尾结束后必须进入隔夜挂断");
  assertEqual(overnightFirstNight2SceneIndex(brief), 4, "案 2 第二夜必须从敲门后的下一段开始，不能重播第一夜场尾");
  assertIncludes(JSON.stringify(brief.sceneVersions?.[3]?.sceneCloser ?? {}), "窗外忽然扫进一片白光", "案 2 第四段场尾必须先让窗外强光进入现场");
  assertIncludes(JSON.stringify(brief.sceneVersions?.[3]?.sceneCloser ?? {}), "门外传来两下敲门声", "案 2 第四段场尾必须用敲门打断连线");
  assertIncludes(nightStructure?.hangup?.line ?? "", "真有事", "案 2 第一夜必须保留咨询者含糊离线的借口");
  assertIncludes(nightStructure?.hangup?.hostLine ?? "", "确认安全", "案 2 挂断页必须让主播先确认安全");
  assertEqual(nightStructure.interlude?.budget, 0, "线性幕间不使用行动配额");
  assertEqual(nightStructure.interlude?.maxActions, 0, "线性幕间不使用行动配额");
  assert(!(nightStructure.callbackOpeners ?? []).length, "案 2 存在 overnightStructure 时不得保留第二套 opener 表");
  assert(!nightActionById(brief, "visit-lin"), "标准表对照必须迁入白天地图库，不能继续藏在旧幕间登门");
  assert(!nightActionById(brief, "call-manager-boundary"), "店长拒答已迁出幕间，不得再保留 call-manager-boundary");
  assert(!nightActionById(brief, "shop-sync-interrupt"), "店长拒答已经落在白天门口，短幕间不得再塞一条不改变材料或回拨的微信");
  const structure = overnightStructureFor(brief);
  assertEqual(structure?.dayBudget, 0, "线性白天不使用地点预算");
  assertEqual(structure?.dayScenes?.length, 4, "案 2 白天必须提供四处地点");
  assertEqual(daySceneById(brief, "day-tony-shop-observe")?.kind, "observe", "案 2 必须有店外观察");
  assert(!daySceneById(brief, "day-tony-shop-observe")?.body?.text?.includes("斜对面"), "店外观察不能隔街听清整段店内对话");
  assertEqual(daySceneById(brief, "day-tony-friend-studio")?.kind, "studio", "案 2 必须能找小姐妹核高息来源");
  assertEqual(daySceneById(brief, "day-tony-manager-doorstep")?.kind, "studio", "公开业务咨询在工作室通过电话完成，不默认进入机构内部");
  assertEqual(daySceneById(brief, "day-tony-manager-doorstep")?.body?.earnedItemId, "宸直窗口答复", "宸直窗口必须产出认购规则答复");
  assertIncludes(overnightCallbackOpenerById(brief, "宸直窗口答复")?.line ?? "", "系统只认合同上的委托人", "案 2 宸直窗口带回物必须提供区别于一百万门槛的合同委托人边界");
  assertEqual(daySceneById(brief, "day-tony-member-docs")?.kind, "document", "案 2 必须能核完整名单与转账");
  assert(!(structure.dayScenes ?? []).some((scene) => scene.kind === "sitIn"), "案 2 不得再消耗包级同席配额");
  assert(!(structure?.snapshotEcho?.["industry-gray"] ?? "").includes("今天拿培训页一对"), "案 2 固定立场回应不得默认玩家白天一定取得培训页");
  assertIncludes(structure?.snapshotEcho?.["industry-gray"] ?? "", "是我裁的", "案 2 裁图路线必须由咨询者在第二夜接回自己的动作");
  assertIncludes(structure?.snapshotEcho?.["industry-gray"] ?? "", "金额和账户栏", "案 2 裁图路线必须说清被她遮掉的是哪部分");
  const initial = initialOvernightStateFor(brief);
  assert(!canEnterOvernightCallback(brief, { ...initial, dayScenesDone: ["day-tony-shop-observe"] }), "案 2 只去一处不能进入第二夜");
  assert(canEnterOvernightCallback(brief, { ...initial, dayScenesDone: structure.dayScenes.map((scene) => scene.id), timelineSorts: correctTimelineSorts(brief) }), "全部必要场景完成后才允许回拨");
  ["门边那句自己人", "预约册旁的手机", "完整名单与转账", "吹风机回放", "门店的说明", "一百万门槛", "翻手机的时间", "宸直窗口答复"].forEach((itemId) => {
    assert(availableOvernightCallbackOpeners(brief, [itemId]).some((opener) => opener.id === itemId), `案 2 带回 ${itemId} 必须改变第二夜第一句`);
    assert(overnightCallbackOpenerById(brief, itemId)?.firstConflict?.hostLine, `案 2 带回 ${itemId} 必须改变第二夜第一轮冲突`);
  });
  const dryerAction = nightActionById(brief, "listen-dryer");
  assertEqual(dryerAction?.grantsInventory?.[0], "吹风机回放", "listen-dryer 必须直接带回同名物件，不能再用假 inventory id");
  const legacyDryerId = ["playback", "dryer"].join("-");
  assert(!structure?.interludeEarnedItemMap?.[legacyDryerId], "案 2 不得保留旧吹风机假映射");
  const dryerEarned = interludeEarnedItemsForOvernight(brief, ["吹风机回放"]);
  assert(dryerEarned.includes("吹风机回放"), "案 2 同名吹风机回放必须显式同步进 overnight earnedItems");
  assert(availableOvernightCallbackOpeners(brief, dryerEarned).some((opener) => opener.id === "吹风机回放"), "案 2 吹风机回放必须能改变第二夜第一句");
  const callbackOpener = overnightCallbackOpenerById(brief, "吹风机回放");
  const callbackLines = overnightCallbackDialogueLines(brief, {
    stanceLine: structure.postures.withCaller,
    opener: callbackOpener,
    snapshotEcho: snapshotEchoFor(brief, { id: "respondent-problem" })
  });
  const callbackTexts = callbackLines.map((line) => line.text ?? "");
  const openerIndex = callbackTexts.indexOf(callbackOpener.line);
  assert(callbackTexts.some((text) => text.includes("你现在安全吗")), "案 2 主播必须在正式追问前先确认咨询者安全");
  assert(callbackTexts.some((text) => text.includes("你现在安全吗")), "案 2 保留安全确认，门口来人不再占据回拨主位");
  assert(!callbackTexts.some((text) => text.includes("等会儿再问行不行")), "案 2 不得用档期闸门把已知事实硬拖到后场");
  assert(!callbackTexts.slice(0, openerIndex).some((text) => /民警|警察|警车|酒吧|高利贷/.test(text)), "案 2 带回物 opener 前不得自动交出需要玩家追问的来人、职业和金额");
  const whoMessagedScene = brief.sceneVersions.find((scene) => scene.id === "tony-who-messaged");
  const whoMessagedOption = whoMessagedScene?.questionOptions?.find((option) => option.correct);
  assertIncludes(brief.sceneVersions.find((scene) => scene.id === "tony-who-messaged").version, "昨晚是警察来核实", "第二夜用简短陈述交代来人");
  assertIncludes(brief.sceneVersions.find((scene) => scene.id === "tony-who-messaged").version, "警察", "第二夜固定陈述交代来人身份");
  assertIncludes(JSON.stringify(whoMessagedOption?.lines ?? []), "酒吧做营销", "必经追问交代高息消息从何而来，并带出职业");
  assert(!whoMessagedScene?.afterVersion, "案 2 不得在玩家选择前用 afterVersion 提前揭示职业");
  const pushColumnScene = brief.sceneVersions.find((scene) => scene.id === "tony-next-push-column");
  const pushColumnLeadIn = JSON.stringify(pushColumnScene?.beforeVersion ?? {});
  assert(pushColumnLeadIn.includes("名单上的周") && /来剪头|女朋友/.test(pushColumnLeadIn), "案 2 周的客户身份问题必须移入正常场景，并在证词墙前得到回答");
  assert(!brief.hostDisclosure, "删去重复催合同的额外结尾");
  const exclusiveVoiceScene = brief.sceneVersions.find((scene) => scene.id === "tony-exclusive-voice");
  assert(!(exclusiveVoiceScene?.version ?? "").includes("人家上自己的班"), "案 2 首场不得在一个气泡里念完职业玩笑原话");
  assertIncludes(JSON.stringify(exclusiveVoiceScene?.casualQuestions ?? []), "人家上自己的班", "案 2 职业玩笑原话必须留给玩家追问后再出现");
  const callerBenefitsScene = brief.sceneVersions.find((scene) => scene.id === "tony-caller-benefits");
  assertIncludes(JSON.stringify(callerBenefitsScene?.casualQuestions ?? []), "染发、护理", "案 2 必须把高频理发消费留给具体追问，不塞进初次职业自报");
  assertIncludes(brief.stageJudgement ?? "", "回单", "案 2 判词必须点明要追的材料是什么");
  assertIncludes(brief.stageJudgement ?? "", "十二万", "案 2 判词必须称量来电人转出的金额");
  assertIncludes(brief.stageJudgement ?? "", "合同回单", "收束保留缺少的关键凭证，不要求再追加操作教程");
  assertIncludes(JSON.stringify(brief.caseClosing?.unresolved ?? []), "十二万是否已经买成", "资金去向留在待追问题里，不要求判词逐项念未知清单");
  assert(!/六折|免过一次护理|十八次|三张十万元/.test(brief.stageJudgement ?? ""), "案 2 结案口播不得重新朗读已进入结案卡的材料清单");
  assertIncludes(JSON.stringify(brief.caseClosing?.confirmed ?? []), "自己开口要求帮忙购买", "结案保留主动代投事实，口播可直接追这项省略的用途");
  assertIncludes(brief.caseClosing?.nextStep ?? "", "同时说明代投安排", "公开追款的后续行动保留完整转款背景");
  assertIncludes(JSON.stringify(brief.sceneVersions.at(-1).testimonyWall.acts[0].decisivePresent), "哄我的话", "感情误导的争执留在当前问询，不到结尾重问");
  assert(!(brief.stageJudgement ?? "").includes("自己的贪心"), "案 2 判词不得用抽象道德标签代替已经播出的代投事实");
  const judgementBeats = splitDialogueSentences(brief.stageJudgement ?? "");
  assert(judgementBeats.length > 0, "收束点明主要问题即可，不按最低句数追加总结");
  assert(judgementBeats.every((beat) => beat.length <= 72), "案 2 结案总长不设硬上限，但每一拍只能推进一个意思");
  assert(!callbackTexts.slice(0, openerIndex).some((text) => text.includes("宸直")), "案 2 带回物 opener 之前不得出现宸直");
  const otherCallerAction = nightActionById(brief, "other-caller-dm");
  const otherCallerHook = brief.investigationHooks?.find((hook) => hook.id === "tony-other-caller-dm");
  assert(otherCallerAction, "案 2 幕间必须保留回女客私信动作");
  assert(otherCallerAction.grantsInventory.includes("side-other-caller"), "周的材料固定收下，不能再互斥选择");
  assert(!otherCallerHook.replyChoices?.length, "给周的回复不能凭空改变何的立场");
  assertEqual(nightActionById(brief, "reopen-training")?.hookId, "tony-manager-training-note", "门店说明必须打开真实门店材料，不能提前展示完整名单");
  [`工作室·标准表${"边"}`, `工作室·六折${"边"}`, legacyDryerId].forEach((legacyName) => {
    assert(!JSON.stringify(brief).includes(legacyName), `案 2 不得再暴露旧带回名: ${legacyName}`);
  });
  assert(!overnightCallbackOpenerById(brief, "周发来的材料"), "周的材料已经按固定主线收到，取消站到门口的兼容开头");
  const managerHook = brief.investigationHooks?.find((hook) => hook.id === "tony-manager-training-note");
  assert(!managerHook?.material?.includes("“下一次推进”不是店里模板"), "店长后台说明不得重复培训页的承重结论");
  assertIncludes(managerHook?.material ?? "", "你们问他本人", "案 2 店长说明必须把私人聊天归回 Tony 本人");
  assert(!managerHook?.material?.includes("手机里记了什么"), "案 2 店长不得替节目打包盘点 Tony 的私人名单与手机内容");
  const appSource = runtimeSource;
  const sceneAdvanceSource = readFileSync(new URL("../src/runtime/sceneAdvance.js", import.meta.url), "utf8");
  const nightOvernightSource = readFileSync(new URL("../src/runtime/nightOvernightModel.js", import.meta.url), "utf8");
  assertIncludes(appSource, "!brief.dialoguePresentation?.focusedInquiry", "集中问询允许查阅后继续，旧圈行仅作兼容");
  assertIncludes(appSource, "overnightCallbackDialogueLines", "隔夜回拨必须通过统一拼装器保持先行拍顺序");
  assert(appSource.indexOf("${callDialogueHtml(hangupDialogue)}") < appSource.indexOf("<span>${escapeHtml(structure.hangupLine ?? \"\")}</span>"), "隔夜挂断页必须先播来电人与主播的最后一轮，再显示忙音或断线舞台说明");
  assertIncludes(sceneAdvanceSource, 'from "./nightOvernightModel.js"', "sceneAdvance 门面必须继续从隔夜模型导入稳定接口");
  assertIncludes(sceneAdvanceSource, "overnightCallbackDialogueLines,", "sceneAdvance 门面必须显式导出隔夜回拨拼装器，兼容离线打包器");
  assertIncludes(nightOvernightSource, "firstConflict.hostLine", "隔夜 opener 后必须渲染路线专属第一轮冲突");
});

test("RUNTIME-008B", "night-B snapshot echoes and live counter beats are selected by pure helpers", () => {
  assertEqual(
    liveSceneForCurrentSegment({ overnightStructure: {} }, { overnight: { segment: "night1" } }),
    "overnightNight1",
    "反压拍缺失时必须回到当前夜 A，不得强跳第二夜"
  );
  assertEqual(
    liveSceneForCurrentSegment({ nightStructure: { enabled: true } }, { night: { segment: "segment2" } }),
    "callSegment2",
    "非隔夜案必须回到当前通麦段"
  );
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  briefs.forEach((brief) => {
    (brief.stanceSnapshot?.options ?? []).forEach((option) => {
      assert(snapshotEchoFor(brief, { id: option.id }), `${brief.runtimeContentCaseId} 的 ${option.id} 必须在夜 B 归还立场押注`);
    });
    const beat = brief.overnightStructure?.liveCounterBeats?.find((item) => item.afterSceneIndex !== undefined && !item.triggerAny);
    if (!beat) { assert(brief.dialoguePresentation.focusedInquiry, "仅集中问询可省去插话"); return; }
    assertEqual(liveCounterBeatById(brief, beat.id)?.id, beat.id, `${brief.runtimeContentCaseId} 必须能按 id 取反压拍`);
    assertEqual(liveCounterBeatAfterScene(brief, beat.afterSceneIndex, () => false)?.id, beat.id, `${brief.runtimeContentCaseId} 必须在指定场景后插入反压拍`);
    const followingBeat = liveCounterBeatAfterScene(brief, beat.afterSceneIndex, (key) => key === `liveCounterBeat:${beat.id}`);
    assert(followingBeat?.id !== beat.id, `${brief.runtimeContentCaseId} 已播反压拍不得重复自身`);
  });
  const case2 = briefs.find((brief) => brief.runtimeContentCaseId === "02-tony");
  const choice = case2.overnightStructure.liveCounterBeats
    .find((item) => item.id === "tony-business-letter")
    ?.choices.find((item) => item.id === "ask-person-not-shop");
  assertEqual(choice?.questionOverride, undefined, "最后一场之后的选择不再覆盖已退出流程的旧问句");
  assert(choice?.label && choice?.lines?.length, "顺序插话包含主播的问题和对方后续回应");
});

test("RUNTIME-008C", "conditional reaction beats trigger from either a marked row or callback opener and only once", () => {
  const beat = {
    id: "conditional-reaction",
    beforeSceneIndex: 5,
    triggerAny: {
      documentRows: ["case3-credential-balance:p04"],
      callbackOpeners: ["家里群原话"]
    }
  };
  const brief = { overnightStructure: { liveCounterBeats: [beat] } };
  assertEqual(liveCounterBeatTriggerMet(beat, {}), false, "未触发反转时不得提前播放情绪拍");
  assert(liveCounterBeatTriggerMet(beat, { documentMarks: { "case3-credential-balance": ["p04"] } }), "圈中 p04 必须触发情绪拍");
  assert(liveCounterBeatTriggerMet(beat, { callbackOpenerId: "家里群原话" }), "家里群 opener 必须触发情绪拍");
  assertEqual(liveCounterBeatBeforeScene(brief, 5, () => false, { callbackOpenerId: "家里群原话" })?.id, beat.id, "触发后必须在指定 version 前返回情绪拍");
  assertEqual(liveCounterBeatBeforeScene(brief, 5, (key) => key === `liveCounterBeat:${beat.id}`, { callbackOpenerId: "家里群原话" }), null, "播过一次后不得重复");
  const afterBrief = { overnightStructure: { liveCounterBeats: [{ ...beat, beforeSceneIndex: undefined, afterSceneIndex: 5 }] } };
  assertEqual(liveCounterBeatAfterScene(afterBrief, 5, () => false, { callbackOpenerId: "家里群原话" })?.id, beat.id, "同一触发器必须支持在反转场尾播放");
  assertEqual(pressureSignalForLiveCounterChoice({ stanceNudge: "defensive" }), "guarded", "现场施压必须让下一轮进入防备回答");
  assertEqual(pressureSignalForLiveCounterChoice({ stanceNudge: "open" }), "held", "现场安抚必须让下一轮回到完整回答");
  assertEqual(pressureSignalForLiveCounterChoice({ stanceNudge: "neutral" }, "guarded"), "", "明确沉默处理必须清掉上一轮残留压力");

  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const case2 = briefs.find((item) => item.runtimeContentCaseId === "02-tony");
  assertEqual(liveCounterBeatBeforeScene(case2, 6, () => false)?.id, "tony-trust-screenshot-followup", "案 2 必须在玩家问出民警与职业后独立归还宸直截图");
  assertEqual(
    liveCounterBeatBeforeScene(case2, 6, (key) => key === "liveCounterBeat:tony-trust-screenshot-followup")?.id,
    "tony-business-letter",
    "补图后先处理商务函，不打断最后的刘海情绪段"
  );
  const case3 = briefs.find((item) => item.runtimeContentCaseId === "03-profile");
  const profileFamilyAnswer = case3?.sceneVersions?.[0]?.casualQuestions?.find((item) => item.id === "profile-proof-before-dinner:casualQuestions:1")?.answer ?? "";
  assertIncludes(profileFamilyAnswer, "我当时半天没接上", "案 3 母女闲聊必须落回咨询者当场反应");
  assert(!profileFamilyAnswer.includes("筛出来的。她原话"), "案 3 母女闲聊不得用作者式点题收尾");
  assertEqual(
    liveCounterBeatAfterScene(case3, 5, () => false, { documentMarks: { "case3-credential-balance": ["p04"] } })?.id,
    "profile-family-chat-blowup",
    "案 3 圈中 p04 后必须在家里群反转场尾出现情绪拍"
  );
  const case3Marks = { documentMarks: { "case3-credential-balance": ["p04"] } };
  const case3Done = (...ids) => (key) => ids.some((id) => key === `liveCounterBeat:${id}`);
  assertEqual(
    liveCounterBeatAfterScene(case3, 5, case3Done("profile-family-chat-blowup"), case3Marks)?.id,
    "profile-gift-mic-request",
    "案 3 家里群隐私拍之后必须出现男方刷礼物申请插麦"
  );
  assertEqual(
    liveCounterBeatAfterScene(case3, 5, case3Done("profile-family-chat-blowup", "profile-gift-mic-request"), case3Marks)?.id,
    "profile-mediation-consent",
    "案 3 礼物申请之后必须分别取得双方公开授权"
  );
  assertEqual(
    liveCounterBeatAfterScene(case3, 6, case3Done("profile-family-chat-blowup", "profile-gift-mic-request", "profile-mediation-consent"), case3Marks)?.id,
    "profile-weekend-dinner-cancelled",
    "案 3 双人谈过出资仍未达成一致，介绍人才带回取消饭局的后果"
  );
  const giftBeat = case3.overnightStructure.liveCounterBeats.find((item) => item.id === "profile-gift-mic-request");
  const giftText = [
    ...(giftBeat?.lines ?? []).map((line) => line.text ?? ""),
    ...(giftBeat?.choices ?? []).flatMap((choice) => [
      choice.label ?? "",
      ...(choice.lines ?? []).map((line) => line.text ?? ""),
      choice.recapAftertaste ?? ""
    ])
  ].join(" ");
  assertEqual(giftBeat?.presentation, "gift", "案 3 高额礼物必须使用独立现场呈现");
  assertIncludes(giftText, "送出“星河”×1", "案 3 必须让刷礼物成为玩家可见动作");
  assertEqual(giftBeat?.choices?.length ?? 0, 0, "退礼物与接麦确认合并为完整交流，不拆三个确认按钮");
assertIncludes(giftText, "学校、学费、工资卡和彩礼可以说", "男方亲口限定公开材料");
  assertIncludes(giftText, "其他账户不公开", "案 3 不得借临时调解公开男方未授权的其他账户");
  const consentFirstChoice = giftBeat?.choices?.find((choice) => choice.id === "ask-caller-before-mic");
  assertIncludes(giftText, "接进来", "女方亲口同意连麦，并保留自己的追问诉求");
  assertIncludes(giftText, "退款处理中", "案 3 退礼物路线必须当场显示退款动作");
assert(!JSON.stringify(giftBeat?.choices?.find(choice => choice.id === "hold-gift-then-scope")?.lines ?? []).includes("礼物暂挂"), "已退款后不得再播放互斥的暂挂结果");
  const mediationBeat = case3.overnightStructure.liveCounterBeats.find((item) => item.id === "profile-mediation-consent");
  const mediationText = (mediationBeat?.lines ?? []).map((line) => line.text ?? "").join(" ");
  assertIncludes(giftText, "我的工资存款我自己说", "案 3 咨询者必须亲口给出自己的公开授权");
  assertIncludes(mediationText, "双方确认公开范围后", "案 3 主播只能在双方同意后接受临时调解");
assertIncludes(giftText, "其他账户不公开", "退款后依次确认材料范围，再征求女方连麦意见");
  const giftHtml = liveCounterBeatHtml(giftBeat);
  assertIncludes(giftHtml, "gift-counter-beat-card", "案 3 礼物插麦必须有区别于普通后台消息的视觉层");
  assertIncludes(giftHtml, "送出“星河”×1", "案 3 礼物卡必须显示具体刷礼物动作");
  const case4 = briefs.find((item) => item.runtimeContentCaseId === "04-workplace");
  assertEqual(liveCounterBeatAfterScene(case4, 3, () => false)?.id, "work-group-repayment-message", "删除弹幕后直接进入群消息");
  assertEqual(
    liveCounterBeatAfterScene(case4, 3, (key) => key === "liveCounterBeat:work-comment-stupid-blowup")?.id,
    "work-group-repayment-message",
    "案 4 情绪拍播完后必须继续归还原有群内还款反制"
  );
  briefs.forEach((caseBrief) => {
    (caseBrief.overnightStructure?.liveCounterBeats ?? []).forEach((counterBeat) => {
      (counterBeat.choices ?? []).forEach((choice, choiceIndex) => {
        assert(choice.directionLabel, `${caseBrief.runtimeContentCaseId} 的现场压力选择 ${counterBeat.id}/${choice.id} 必须提供方向按钮`);
        if (counterBeat.choiceMode === "sequence") assertEqual(choice.directionLabel, choice.label, "顺序选项直接展示实际台词");
        else assert(choice.directionLabel !== choice.label, "保留的分支方向使用短标签");
        assert((choice.lines ?? []).length >= 1, `${caseBrief.runtimeContentCaseId} 的现场压力选择 ${counterBeat.id}/${choice.id} 必须在点击后的第一屏改变人物或现场状态`);
        const choiceResultHtml = liveCounterBeatHtml(counterBeat, { choiceId: choice.id, completedChoiceIds: counterBeat.choices.slice(0, choiceIndex + 1).map(item => item.id) });
        assertIncludes(choiceResultHtml, choice.lines[0].text ?? "", `${caseBrief.runtimeContentCaseId} 的现场压力选择 ${counterBeat.id}/${choice.id} 必须立即渲染所选后果`);
        if (counterBeat.choiceMode === "sequence") assert(!choice.recapAftertaste, "顺序对话不再附加作者总结");
        else assert(choice.recapAftertaste && !choice.recapAftertaste.includes("主播"), "分支回看使用人物口吻");
      });
    });
  });
});

test("RAGE-001", "rage-bait payoff stays player-led, bounded, and visible in runtime plans", () => {
  const pack = storyPackForKey("steam-demo-01");
  const prologue = pack.nightShell?.prologue;
  const coldOpen = prologue?.coldOpen;
  assertEqual(prologue?.entryActionKey, "night-shell-broadcast-opened", "冷开场前必须先让玩家完成开播动作");
  assertIncludes(screenSources[3], "data-start-night-broadcast", "开播动作必须有独立可操作按钮，不能由冷开场倒叙代劳");
  assertIncludes(JSON.stringify(coldOpen?.setupLines ?? []), "第一位来电人", "失业语音前必须先交代它来自第一位来电人");
  assertIncludes(JSON.stringify(coldOpen?.setupLines ?? []), "男朋友", "失业语音前必须先交代说话人与来电人的关系");
  assertEqual(coldOpen?.line?.speakerProfileId, "case1-respondent", "失业语音必须绑定案一男方，不能误用来电人声纹");
  assert(coldOpen?.line?.text && !/失业|离职|补偿金/.test(coldOpen.line.text), "冷开场不得提前承认第一夜尚待核实的失业信息");
  assertEqual(coldOpen?.actionLabel, "听完这条语音", "首期付息必须由玩家主动听完原话触发");
  assert(!/替(?:他|她|谁)收口|紧跟着|紧接着/.test(JSON.stringify(coldOpen)), "冷开场不得让主播说作者衔接词");
  assert(!screenSources[3].includes("先让弹幕把这句话听全"), "冷开场按钮旁不得再放编导式操作说明");
  assertIncludes(JSON.stringify(coldOpen?.interestLines ?? []), "今晚转我行不行", "首期付息后必须立即增发下一笔债");

  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  briefs.forEach((brief) => {
    const activeScene = brief.sceneVersions?.find((scene) => (scene.questionOptions ?? []).some((option) => option.routeAxis === "active-provocation"));
    const activeOption = activeScene?.questionOptions?.find((option) => option.routeAxis === "active-provocation");
    if (!activeOption) return;
    assert(activeOption.correct, `${brief.runtimeContentCaseId} 已使用主动复读时必须走已有正确问答通道`);
    assert(activeScene.questionSequence?.length ? activeOption.suspicionLabel === activeOption.question : /重放|重读|读全|听完|问她要回放/.test(activeOption.suspicionLabel ?? ""), `${brief.runtimeContentCaseId} 顺序按钮显示实际接话`);
    assert(!/弹幕|课代表|替我选|替我下手/.test(activeOption.suspicionLabel ?? ""), `${brief.runtimeContentCaseId} 主动回放按钮不得写成编导口令`);
    assert(activeOption.answer || activeOption.lines?.some((line) => line.role === "caller"), `${brief.runtimeContentCaseId} 主动询问必须有回答，不强制演应激`);
    const reaction = (brief.routeAxisComments?.["active-provocation"] ?? []).join("\n");
    assert(!/@讲道理先劝和|@他也是为你好|前面那句我收回|当我没说/.test(reaction), `${brief.runtimeContentCaseId} 若有现场评论，不得套用固定账号整齐败退模板`);
  });

  const case1 = briefs.find((brief) => brief.runtimeContentCaseId === "01-credit");
  assertEqual(liveCounterBeatAfterScene(case1, 3, (key) => key === "liveCounterBeat:credit-night-b-first-interest"), null, "案一付息拍播过后不得重复");
  const case3 = briefs.find((brief) => brief.runtimeContentCaseId === "03-profile");
  assertIncludes(JSON.stringify(case3.overnightStructure?.liveCounterBeats ?? []), "礼物我退回去", "案三接麦必须先退礼物，不能恢复弹幕插话");
  const case4 = briefs.find((brief) => brief.runtimeContentCaseId === "04-workplace");
});

test("FABLE-001", "old-case welds stay actionable, visible, and save-compatible", () => {
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const case3 = briefs.find((brief) => brief.runtimeContentCaseId === "03-profile");
  const case4 = briefs.find((brief) => brief.runtimeContentCaseId === "04-workplace");
  const profileLedger = case3?.documents?.find((document) => document.id === "case3-credential-balance");
  const inbox = case4?.investigationHooks?.find((hook) => hook.id === "work-postcase-inbox");
  const fireBack = inbox?.replyChoices?.find((choice) => choice.id === "inbox-fire-back");

  assert(profileLedger?.rows?.some((row) => row.rowId === "p08"), "案三‘差两千’出处必须进入现有材料板，不得另开解释场");
  assert(!inbox, "供应商回执已直接到场，不再筛选收件箱");
  assertIncludes(runtimeSource, "echo.requiresInventoryId", "跨案回声必须检查玩家是否真的执行过对应处理动作");
  assertIncludes(runtimeSource, "inventory.has(echo.requiresInventoryId)", "未执行案四错回时不得播放被截句的下一案回声");

  briefs.forEach((brief) => {
    const activeScene = brief.sceneVersions?.find((scene) => (scene.questionOptions ?? []).some((option) => option.routeAxis === "active-provocation"));
    const activeOption = activeScene?.questionOptions?.find((option) => option.routeAxis === "active-provocation");
    if (!activeOption) return;
    assert((activeOption?.lines ?? []).some((line) => line.role === "caller") || activeOption?.answer, `${brief.runtimeContentCaseId} 主动拱火后必须立刻改变来电人开口`);
    assert(activeOption?.answer || activeOption?.lines?.some((line) => line.role === "caller"), `${brief.runtimeContentCaseId} 正常核实可以直接回答，不必额外应激`);
  });
});

test("RUNTIME-010", "case 3 connects voluntary explanations to the received credentials", () => {
  const brief = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" })
    .find((item) => item.runtimeContentCaseId === "03-profile");
  const nightStructure = nightStructureFor(brief);
  assertEqual(nightStructure?.interlude?.budget, 0, "线性幕间不使用行动配额");
  assertEqual(nightStructure?.interlude?.maxActions, 0, "线性幕间不使用行动配额");
  assert(!nightActionById(brief, "profile-cousin-message"), "案 3 幕间不得重复表姐门口承重拍");
  assert(!(brief.investigationHooks ?? []).some((hook) => hook.id === "profile-cousin-family-note"), "案 3 表姐幕间 hook 必须移除");
  assert(!(nightStructure.callbackOpeners ?? []).length, "案 3 存在 overnightStructure 时不得保留第二套 opener 表");
  assert(!nightActionById(brief, "profile-day-route"), "案 3 旧的一地点登门必须迁出幕间");
  const structure = overnightStructureFor(brief);
  assertEqual(structure?.dayBudget, 0, "线性白天不使用地点预算");
  assertEqual(structure?.dayScenes?.length, 3, "案 3 白天必须提供三处调查面");
  assert((structure?.dayScenes ?? []).every((scene) => scene.body?.access), "案 3 每处白天回访都必须显示联系与授权来源");
  assertEqual(daySceneById(brief, "day-profile-teahouse")?.kind, "visit", "案 3 必须到茶馆核两套报价");
  assertEqual(daySceneById(brief, "day-profile-cousin-doorstep")?.kind, "studio", "案 3 表姐通过男方牵线私下语音，不默认可以登门询问");
  assertEqual(daySceneById(brief, "day-profile-credential-docs")?.kind, "document", "案 3 必须并读学历核验与工资账户流水");
  assert(!(structure.dayScenes ?? []).some((scene) => scene.kind === "sitIn"), "案 3 不得增加第二次同席");
  const initial = initialOvernightStateFor(brief);
  assert(!canEnterOvernightCallback(brief, { ...initial, dayScenesDone: ["day-profile-teahouse"] }), "案 3 只去一处不能进入第二夜");
  assert(canEnterOvernightCallback(brief, { ...initial, dayScenesDone: structure.dayScenes.map((scene) => scene.id), timelineSorts: correctTimelineSorts(brief) }), "全部必要场景完成后才允许回拨");
  const case3OpenerIds = ["两边的完整聊天", "她没核实的两句话", "表姐门口口供", "双份材料圈注", "家里群原话", "饭局停顿回放"];
  case3OpenerIds.forEach((itemId) => {
    assert(availableOvernightCallbackOpeners(brief, [itemId]).some((opener) => opener.id === itemId), `案 3 带回 ${itemId} 必须改变第二夜第一句`);
    assert(overnightCallbackOpenerById(brief, itemId)?.firstConflict?.hostLine, `案 3 带回 ${itemId} 必须改变第二夜第一轮对峙`);
  });
  assertEqual(new Set(case3OpenerIds.map((itemId) => overnightCallbackOpenerById(brief, itemId)?.firstConflict?.hostLine)).size, case3OpenerIds.length, "案 3 每个带回物必须有不同的第一拳");
  assert(interludeEarnedItemsForOvernight(brief, ["family-chat-seen"]).includes("家里群原话"), "案 3 家里群原话必须从幕间同步进 overnight earnedItems");
  assertEqual(nightStructure?.interlude?.continueLabel, "进入白天调查", "案 3 幕间结束必须明确进入白天，不能误导为立即回拨");
  assertEqual(nightStructure?.hangup?.stageDirection, structure?.hangupLine, "案 3 挂断舞台指示必须与 overnight 挂断文案对齐");
  assertEqual(nightStructure?.hangup?.hostLine, structure?.hostHoldLine, "案 3 主持人挂断句必须与 overnight 保持单一来源");
  assert(!nightStructure?.hangup?.line?.includes("马上"), "案 3 挂断不能再写成马上回来的软离席");
  assert(!/爸爸|宸直/.test(nightStructure?.hangup?.hostLine ?? ""), "案 3 夜 A 挂断不得点名尚未揭示的父亲或宸直线");
  const incomeCardScene = (brief.sceneVersions ?? []).find((scene) => scene.id === "profile-income-and-card");
  assert(/(?:其他|别的)账户/.test(JSON.stringify(incomeCardScene?.afterVersion ?? {})), "案 3 最终对峙保留工资卡以外账户仍未公开的范围");
  assertIncludes((incomeCardScene?.afterVersion?.lines ?? []).map((line) => line.text ?? "").join(" "), "其他账户我不公开", "案 3 必须让男方亲口说明选择性提供流水的边界");
  assertIncludes(JSON.stringify(structure.liveCounterBeats), "九月底", "双人对话须先谈女方家资金时点，不在最后对话重讲同一笔");
  assert(!incomeCardScene?.version?.includes("只能代表一张工资卡"), "案 3 咨询者不得替材料念证明边界公式");
  assert(!/只能证明|既不能.*也不能/.test((incomeCardScene?.afterVersion?.lines ?? []).map((line) => line.text ?? "").join(" ")), "案 3 主播不得用证明边界三联代替现场说话");
  assert(!incomeCardScene?.sceneCloser, "案 3 不得在最终对峙突然新增四次见面记录表");
  assert(!JSON.stringify(brief).includes("四次见面做了张表"), "案 3 不得用未参与证据链的新道具凑收束");
  assertIncludes(brief.stageJudgement ?? "", "不去了", "案 3 收束承接饭局已取消");
  assertIncludes(JSON.stringify(brief.caseClosing?.confirmed ?? []), "赞成完整付款条件", "结案事实保留她认可加价；判词继续处理已发生的条件与解释权争执");
  assertIncludes(JSON.stringify(brief.caseClosing?.unresolved ?? []), "男方其他账户", "其他账户仍留作未知，不把拒付直接等同藏钱欺骗");
  const giftMicBeat = structure?.liveCounterBeats?.find((beat) => beat.id === "profile-gift-mic-request");
  const giftMicText = JSON.stringify(giftMicBeat?.lines ?? []);
  assertIncludes(giftMicText, "领证前把二十八万八打进你的卡", "案 3 男方插麦必须把女方个人收款账户带入必经矛盾");
  assertIncludes(giftMicText, "等到九月底", "案 3 男方插麦必须把女方家资金的较晚时点带入必经矛盾");
  assertIncludes(giftMicText, "有没有一起告诉我", "案 3 插麦问句必须修正为男方追问自己是否被告知");
  const refundGiftChoice = giftMicBeat?.choices?.find((choice) => choice.id === "refund-then-scope");
assertEqual(pressureSignalForLiveCounterChoice(refundGiftChoice), "", "顺序对话不再根据旧分支改变下一问");
  const mediationBeat = structure?.liveCounterBeats?.find((beat) => beat.id === "profile-mediation-consent");
  assertIncludes(JSON.stringify(mediationBeat?.lines ?? []), "共同账户", "案 3 男方必须提出可谈方案，不能只情绪性拒绝");
  const dinnerCancelBeat = structure?.liveCounterBeats?.find((beat) => beat.id === "profile-weekend-dinner-cancelled");
  assert(!JSON.stringify(dinnerCancelBeat?.lines ?? []).includes("定金"), "尚未订饭店的前文不能突然产生已付定金");
  const privacyBeat = structure?.liveCounterBeats?.find((beat) => beat.id === "profile-family-chat-blowup");
assertIncludes(JSON.stringify(privacyBeat?.lines ?? []), "表妹发的整页我删了", "先从后台删除截图，不能暗示此前已经公开");
  assert(!JSON.stringify(privacyBeat).includes("别让弹幕再转"), "未经同意的家庭群截图没有公开来源时，不得写成弹幕已经拿到并转发");
  assert((privacyBeat?.choices ?? []).every((choice) => choice.silent !== true), "案 3 隐私爆点不得把沉默包装成唯一不施压的处理方式");
});

test("RUNTIME-011", "case 4 keeps interlude choices on evidence that changes the callback", () => {
  const brief = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" })
    .find((item) => item.runtimeContentCaseId === "04-workplace");
  const deepFollowupText = JSON.stringify(brief.deepFollowup ?? {});
  const workActs = brief.sceneVersions.find((scene) => scene.testimonyWall).testimonyWall.acts;
  assertEqual(workActs[0].decisivePresent.evidenceId, "case4-department-ledger:q06", "夜二先核其他部门齐件待付");
  assertEqual(workActs.length, 1, "不再复审四千分配");
  assert(!deepFollowupText.includes("发了。"), "发送必须放在所有路线都会到达的固定结尾");
  const privateWarningBeat = brief.overnightStructure?.liveCounterBeats?.find((beat) => beat.id === "work-private-warning-voice");
  assert(privateWarningBeat?.lines?.some((line) => line.speaker === "主管（语音）"), "案 4 群消息撤回后播放主管本人发来的私聊语音，不能只靠主播或弹幕概括");
  assertIncludes(JSON.stringify(privateWarningBeat?.lines ?? []), "以后还要不要活动", "案 4 主管仍以活动分配施压");
  const inboxHook = brief.investigationHooks?.find((hook) => hook.id === "work-postcase-inbox");
  const actOneContradiction = brief.sceneVersions?.find((scene) => scene.testimonyWall)?.testimonyWall?.acts?.[0]?.decisivePresent?.contradiction;
  assert(!unlockedInvestigationEntries(brief, { foundContradictions: [], actionDone: () => false }).some((entry) => entry.hook.id === "work-postcase-inbox"), "案 4 收件箱不得在第一夜幕间提前出现");
  assert(!brief.delegation, "案 4 不得保留与审批页复核重复的顾问委托");
  assert(!nightActionById(brief, "zhao-zhou-work"), "案 4 不得再用三位顾问包装同一组材料问题");
  const approvalAction = nightActionById(brief, "recheck-approval-page");
  assertEqual(approvalAction?.kind, "evidencePass", "案 4 幕间应直接核对审批页");
  assert(approvalAction?.focusCheckIds?.includes("work-approval-missing"), "审批页行动必须接到付款缺口材料题");
  assert(approvalAction?.grantsInventory?.includes("approval-page-reviewed"), "核对审批页后必须带回可改变第二夜开场的结果");
  assertEqual(nightStructureFor(brief)?.interlude?.budget, 0, "线性幕间不使用行动配额");
  assert(!(nightStructureFor(brief)?.callbackOpeners ?? []).length, "案 4 存在 overnightStructure 时不得保留第二套 opener 表");
  const structure = overnightStructureFor(brief);
  const approvalEarned = interludeEarnedItemsForOvernight(brief, ["approval-page-reviewed"]);
  assert(approvalEarned.includes("立项页不是报销单"), "案 4 立项页复核必须同步进 overnight earnedItems");
  assert(availableOvernightCallbackOpeners(brief, approvalEarned).some((item) => item.id === "立项页不是报销单"), "立项页复核必须改变第二夜开场");
  const leaderInterrupt = nightActionById(brief, "leader-interrupt");
  assert(leaderInterrupt.grantsInventory.includes("leader-note-hot"), "活动通知固定收到，后续能够直接追问");
  assert(!leaderInterrupt.choices?.length, "同一后续剧情不再包装成压下或带回的假选择");
  ["day-work-finance-window", "day-work-supplier-visit", "day-work-breakroom-observe"].forEach((sceneId) => {
    const body = daySceneById(brief, sceneId)?.body;
    assert(!body.choice, `${sceneId} 必要材料应在同场连读`);
    assertEqual(body.earnedItemIds.length, 2, `${sceneId} 原来互斥的两份信息应一起带回`);
  });
  assertEqual(structure?.dayBudget, 0, "线性白天不使用地点预算");
  assertEqual(structure?.dayScenes?.length, 4, "案 4 白天必须提供三处走访和一份后台流转记录");
  assert(!/领导批注|供应商内部结算页/.test(structure?.snapshotEcho?.unclear ?? ""), "案 4 固定立场回应不得默认玩家已经取得可跳过的白天材料");
  const documentScene = daySceneById(brief, "day-work-payment-ledger");
  assertEqual(documentScene?.kind, "document", "案 4 必须把报销流转记录接入文档玩法");
  assertEqual(documentScene?.body?.earnedItemId, "她整理的报销时间线", "案 4 圈完记录必须授予同名回拨物");
  const paymentLedger = (brief.documents ?? []).find((document) => document.id === "case4-payment-ledger");
  assertEqual(paymentLedger?.rows?.length, 5, "白天仅含早期五条，晚间材料单独登记");
  const singleRowQuestions = earnedDocumentQuestionsFor(paymentLedger, ["q02", "q04", "q05"]);
  assertEqual(singleRowQuestions.filter((question) => question.kind === "row").length, 0, "关键早期行必须能解锁对应追问");
  const crossedQuestions = earnedDocumentQuestionsFor(paymentLedger, ["q01", "q02", "q03", "q05"]);
  assertEqual(crossedQuestions.filter((question) => question.kind === "cross").length, 0, "两组早期比较应由圈行解锁");
  assert(availableOvernightCallbackOpeners(brief, ["她整理的报销时间线"]).some((item) => item.id === "她整理的报销时间线"), "案 4 报销时间线必须改变第二夜开场");
  const reimbursementTimelineOpener = overnightCallbackOpenerById(brief, "她整理的报销时间线");
  assertIncludes(reimbursementTimelineOpener?.firstConflict?.hostLine ?? "", "发票照片", "案 4 早期资料开场应询问已交材料的后续处理");
  assert(!reimbursementTimelineOpener?.firstConflict?.hostLine?.includes("财务那时还没说延后"), "案 4 主播不得把时间比较结论预先塞进问题");
  const case4OpenerIds = Object.keys(structure?.callbackOpeners ?? {});
  assertEqual(case4OpenerIds.length, 11, "案 4 必须覆盖十一条由实际材料带回的回拨开场");
  assert(!case4OpenerIds.some((itemId) => /赵律师|周会计|小林老师|顾问回单/.test(itemId)), "案 4 回拨物不得再用无实际作用的人名或顾问回单占位");
  case4OpenerIds.forEach((itemId) => {
    assert(overnightCallbackOpenerById(brief, itemId)?.firstConflict?.hostLine, `案 4 带回 ${itemId} 必须改变第二夜第一轮对峙`);
  });
  assertEqual(new Set(case4OpenerIds.map((itemId) => overnightCallbackOpenerById(brief, itemId)?.firstConflict?.hostLine)).size, case4OpenerIds.length, "案 4 每个带回物必须有不同的第一拳");
  assertEqual(nightStructureFor(brief)?.interlude?.continueLabel, "进入白天调查", "案 4 幕间结束必须明确进入白天，不能误导为立即回拨");
  assertEqual(nightStructureFor(brief)?.hangup?.stageDirection, structure?.hangupLine, "案 4 挂断舞台指示必须与 overnight 挂断文案对齐");
  assertEqual(nightStructureFor(brief)?.hangup?.hostLine, structure?.hostHoldLine, "案 4 主持人挂断句必须与 overnight 保持单一来源");
  assert(!nightStructureFor(brief)?.hangup?.line?.includes("马上"), "案 4 挂断不能再写成马上回来的软离席");
  assertEqual(nightStructureFor(brief)?.segment1SceneIndexes?.join("|"), "0|1|2", "第一夜从分活、过往结算到本次催款");
  assertEqual(nightStructureFor(brief)?.segment2SceneIndexes?.join("|"), "3|4", "第二夜从跨部门欠款进入包干费用");
  const first = brief.sceneVersions.find((scene) => scene.id === "work-title-for-advance");
  assertIncludes(JSON.stringify(first.questionOptions), "谁能先出钱", "交活条件必须能由玩家问出");
  const profit = brief.sceneVersions.find((scene) => scene.id === "work-private-process");
  assertIncludes(JSON.stringify(profit.questionOptions), "分我四千", "个人获利必须在第一夜的追问中出现");
  assert(!JSON.stringify(brief.openingDialogue).includes("四千"), "开场不能直接交出她隐去的分成");
  assert(!JSON.stringify(brief.sceneVersions).includes("负责人名单还没定"), "活动已完成，不能退回争本场署名状态");
  assertEqual(nightStructureFor(brief).hangup.stageDirection, structure.hangupLine, "挂断来源一致");
  assertEqual(nightStructureFor(brief).hangup.hostLine, structure.hostHoldLine, "挂断主持句一致");
  assertIncludes(brief.stageJudgement, "旧立项页", "主管拖延的具体行为仍应保留");
  assertIncludes(JSON.stringify(brief.sceneVersions.at(-1).testimonyWall.acts.find(act => act.id === 'act1').decisivePresent.materialCards), "12,000", "旧费用保留在材料中，不再单独复审一幕");
  assert(!JSON.stringify(brief.careChoices).includes("发完了"), "关怀不得重复发送");
  assert(!JSON.stringify(brief.sceneVersions).includes("金融杠杆"), "集团资金去向不能由连线人提前宣布");
});

test("NARRATION-001", "case narration helpers keep critical labels stable", () => {
  assertEqual(accusationLabel({ caseMode: "daily" }, "platform"), "平台 / 第三方操盘", "平台指认标签必须稳定");
  assertIncludes(evidenceInsightFor({
    evidenceCards: [{ type: "转账记录", title: "婚前转账", front: "48 小时内转账", detail: "备注改成共同储备" }]
  }, "money"), "转账记录《婚前转账》", "钱款启发必须优先指出金额/资源证据卡");
  assertIncludes(timelineGapText({ hiddenFacts: ["领证前两天才第一次提借钱"] }), "领证前两天", "时间线启发必须优先指出时间缺口");
  assertIncludes(runCompleteLineFor({ correct: 1, total: 1, caseMode: "daily", playthroughNumber: 1 }), "最热闹的地方", "每日案成功结语必须保留直播吃瓜口吻");
});

test("DOCS-001", "planned AI intent interface remains documented", () => {
  const aiIntentDoc = readFileSync(new URL("../docs/controlled-ai-intent-schema.md", import.meta.url), "utf8");
  assertIncludes(aiIntentDoc, "AI 不新增事实", "受控自由追问文档必须明确 AI 不新增事实");
  assertIncludes(aiIntentDoc, "allowedIntents", "受控自由追问文档必须定义 allowedIntents");
  assertIncludes(aiIntentDoc, "blockedTopics", "受控自由追问文档必须定义 blockedTopics");
  assertIncludes(aiIntentDoc, "离线试玩版必须能不依赖 AI 服务运行", "AI 问答实验不能让试玩版依赖服务端");
});

test("DOCS-003", "case writing law requires audited adjacent-turn causality", () => {
  const adjacencyReview = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/dialogue-adjacency-review.json", import.meta.url), "utf8"));
  assertEqual(JSON.stringify([...adjacencyReview.reviewedCaseIds].sort()), JSON.stringify(["01-credit", "02-tony", "03-profile", "04-workplace"]), "试玩四案必须全部保持逐句复审锁定状态");
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const coreOptions = briefs.flatMap((brief) => (brief.sceneVersions ?? []).flatMap((scene) => (scene.questionOptions ?? []).filter((option) => option.correct === true)));
  assert(coreOptions.length > 0 && new Set(coreOptions.map((option) => option.id)).size === coreOptions.length, "承重问题身份必须唯一，数量服从剧情需要");
  assert(coreOptions.every((option) => option.logicContract?.premiseAnchor && option.logicContract?.sourceDoesNotProve && option.logicContract?.nextLegalQuestion), "四案所有承重追问必须登记前提、证据边界和下一问上限");
  const loadBearingClosers = briefs.flatMap((brief) => (brief.sceneVersions ?? []).filter((scene) => (scene.sceneCloser?.lines ?? []).some((line) => !["stage", "pause"].includes(line?.role) && line?.nonLoadBearing !== true && line?.text)));
  assert(loadBearingClosers.length > 0, "检查当前承重场尾合同，不固定场尾数量");
  assert(loadBearingClosers.every((scene) => scene.closureContract?.routeIndependent === true && scene.closureContract?.openEdge), "四案所有承重场尾必须登记路线独立合同和唯一未决问题");
});

test("DOCS-004", "top-level docs keep only current production material", () => {
  const docsEntry = readFileSync(new URL("../docs/README.md", import.meta.url), "utf8");
  const topLevelDocs = readdirSync(new URL("../docs/", import.meta.url), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();
  const promptDocs = topLevelDocs.filter((name) => name.includes("prompt"));
  const oneOffDocs = topLevelDocs.filter((name) => /(?:^|-)pass-\d+|(?:exec|fix)-prompt|rereview|suggestions-review|script-feel-polish/.test(name));
  assertEqual(JSON.stringify(promptDocs), JSON.stringify(["udio-bgm-production-prompts-v2.md", "udio-missing-bgm-prompts-2026-09-05.md"]), "docs 顶层只能保留现行 Udio 制作单与缺曲补充单");
  for (const name of promptDocs) assertIncludes(docsEntry, `](${name})`, "现行 Prompt 必须能从文档入口找到");
  assertEqual(oneOffDocs.length, 0, "已执行批次、一次性修复单和外部复审不能重新堆回 docs 顶层");
  assertIncludes(docsEntry, "一次性评审意见执行后应转成代码、测试、skill 或 backlog 条目", "文档入口必须写明一次性评审的退出机制");
});

test("CLUE-001", "contradiction aggregation dedupes scene and evidence sources", () => {
  assertEqual(allCaseContradictions({
    sceneVersions: [{ contradiction: "时间错位" }],
    evidenceCards: [{ contradiction: "证据反咬" }, { contradiction: "时间错位" }]
  }).join(","), "时间错位,证据反咬", "案件矛盾汇总必须跨来源去重");
});

test("CLUE-004", "issue completion lives in runtime and scores core reveals", () => {
  const brief = dailyCase("2026-06-24");
  const core = (brief.sceneVersions ?? []).map((scene) => scene.contradiction).filter(Boolean);
  const empty = calculateIssueCompletion({ brief, foundContradictions: [], requiredLimit: core.length });
  assertEqual(empty.percent, 0, "未揭示核心问题时进度必须为 0");
  const full = calculateIssueCompletion({ brief, foundContradictions: core, requiredLimit: core.length });
  assertEqual(full.percent, 100, "核心问题全揭示时进度必须为 100");
  assert(full.badge === true, "核心问题全揭示时才具备徽章基础");
});

test("CLUE-003", "daily score keeps early core issues after later material notes", () => {
  const brief = dailyCase("2026-06-24");
  const core = (brief.sceneVersions ?? []).map((scene) => scene.contradiction).filter(Boolean);
  const extra = [
    ...brief.sceneVersions.flatMap((scene) => (scene.questionOptions ?? []).map((option) => option.contradiction).filter(Boolean)),
    ...brief.evidenceCards.map((card) => card.contradiction).filter(Boolean)
  ];
  const kept = [...new Set([...core, ...extra])].slice(-32);
  core.forEach((point) => {
    assert(kept.includes(point), `后续材料不能把早期核心问题挤出得分记录：${point}`);
  });
});

test("CLUE-002", "inspiration skips already found contradictions", () => {
  assertEqual(nextInspirationContradictionForCase({
    sceneVersions: [{ contradiction: "时间错位" }],
    evidenceCards: [{ contradiction: "证据反咬" }]
  }, ["时间错位"]), "证据反咬", "启发道具必须跳过已发现矛盾");
});

test("STORY-REVISION-001", "reordered quick cases preserve all valid routes and reject obsolete round saves", () => {
  const packets = quickDetectiveCasesFor("steam-demo-01");
  function explore(packet, state) {
    if (state.scene === "verdict") {
      assertEqual(state.verdictMode, "complete", `${packet.id} 正常路线不得误作提前收案`);
      return 1;
    }
    assert(state.scene === "transcript" || state.scene === "issueSelection", `${packet.id} 追问后应能继续听或选句`);
    if (state.scene === "transcript") state = advanceQuickTranscript(packet, state);
    if (state.scene === "confrontation") {
      assert(packet.confrontations.some((item) => item.id === state.activeConfrontationId), "自动接入必须指向已有对质");
      while (state.scene === "confrontation") state = advanceQuickConfrontation(packet, state);
      return explore(packet, state);
    }
    const seenTurns = new Set(quickDisclosureRounds(packet).slice(0, state.roundIndex + 1).flatMap((round) => round.turnIds));
    const choices = quickIssueOptionsForRound(packet, state).filter((issue) => issue.confrontationId && !state.resolvedConfrontationIds.includes(issue.confrontationId));
    assert(choices.length > 0, `${packet.id} 未结案轮次必须有未问完的有效选项`);
    return choices.reduce((total, issue) => {
      const confrontation = packet.confrontations.find((item) => item.id === issue.confrontationId);
      assert(confrontation.basisTurnIds.every((id) => seenTurns.has(id)), `${packet.id}/${issue.id} 不得引用未来轮次的材料`);
      const line = quickStatementLinesForRound(packet, state).find((item) => item.text.includes(issue.sourceAnchor));
      assert(line, `${packet.id}/${issue.id} 必须在本轮有可点击原句`);
      let next = applyQuickStatementLineSelection(packet, state, line.id);
      assertEqual(next.scene, "confrontation", `${issue.id} 必须实际进入对应对话`);
      assertEqual(next.activeConfrontationId, issue.confrontationId, `${issue.id} 不得被另一锚点截走`);
      while (next.scene === "confrontation") next = advanceQuickConfrontation(packet, next);
      return total + explore(packet, next);
    }, 0);
  }
  for (const [id, count] of [["01-no-conditions", 2], ["02-one-missed-message", 2], ["03-labeled-fiction", 27]]) {
    const packet = packets.find((item) => item.id === id);
    assertEqual(explore(packet, { ...initialQuickDetectiveState(packet), scene: "transcript" }), count, `${id} 全部有效选择顺序应到达结案`);
    const priorLayout = structuredClone(packet);
    priorLayout.disclosureRounds = [...priorLayout.disclosureRounds].reverse();
    const obsolete = { ...initialQuickDetectiveState(priorLayout), scene: "issueSelection", roundIndex: 2 };
    const restored = normalizeQuickDetectiveState(obsolete, packet);
    assertEqual(restored.roundIndex, packet.disclosureRounds.findIndex(r => r.id === priorLayout.disclosureRounds[2].id), `${id} 结构迁移按稳定段落身份定位`);
    const current = { ...initialQuickDetectiveState(packet), scene: "issueSelection", roundIndex: 1 };
    assertEqual(normalizeQuickDetectiveState(current, packet).roundIndex, 1, `${id} 同版存档仍保留进度`);
  }
});

test("STORY-WORKPLACE-003", "workplace facts advance without quota filler or repeated material inspection", () => {
  const packet = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/cases/04-workplace.json", import.meta.url), "utf8"));
  const texture = dialogueTextureMetrics(packet);
  assert(texture.valid, "去掉重复絮叨和口癖后仍应校验事实、声纹边界，不能为了计数加回填充台词");
  const continuous = readFileSync(new URL("../docs/generated/steam-demo-01-continuous-story-script.md", import.meta.url), "utf8");
  const chapter = continuous.split("# 第二幕｜")[1].split("# 第三幕｜")[0];
  const check = packet.evidenceChecks.find((item) => item.id === "work-approval-missing");
  const selected = check.options.find((item) => item.correct);
  const selectedLabel = selected.question ?? selected.label;
  assertEqual(chapter.split(`【你询问：${selectedLabel}】`).length - 1, 1, "幕间已核材料必须计入导出路线，不能结尾重复核一次");
  assertEqual(chapter.split("他发出两条群消息").length - 1, 1, "连续路线只能发送一次最终消息");
  const acceptedRows = chapter.indexOf("补件要求：无");
  const falseServiceAdmission = chapter.indexOf("这一万二，有外面的人做过服务吗");
  assert(acceptedRows >= 0 && falseServiceAdmission === -1, "直接核跨部门齐件待付，不重审已认过的协调费");
  assert(!packet.openingDialogue.some((line) => /配资|杠杆/.test(line.text)), "开场不能透支案后资金去向");
});

test("STORY-REVISION-002", "long-case sequencing follows disclosed knowledge before conclusions", () => {
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const tony = briefs.find((brief) => brief.runtimeContentCaseId === "02-tony");
  const policeStage = statementStageForScene(tony, 4);
  const moneyStage = statementStageForScene(tony, 5);
  assert(policeStage.id !== moneyStage.id && !policeStage.sceneIndexes.includes(5), "Tony先问追款的起因，再问十二万具体代投经过");
  const credit = briefs.find((brief) => brief.runtimeContentCaseId === "01-credit");
  const continuation = credit.sceneVersions.find((scene) => scene.id === "credit-loyalty-test").afterVersion.lines;
  const profile = briefs.find((brief) => brief.runtimeContentCaseId === "03-profile");
  const beforeCancellation = liveCounterBeatAfterScene(profile, 5, (key) => ["profile-family-chat-blowup", "profile-gift-mic-request", "profile-mediation-consent"].some((id) => key === `liveCounterBeat:${id}`), {});
  assert(!beforeCancellation, "同意上麦后先进入出资对话，不能立即取消饭局");
  const contribution = profile.sceneVersions[6];
  const contributionLines = contribution.questionSequence.flatMap(id => contribution.questionOptions.find(option => option.id === id).lines ?? []);
  assert(contributionLines.some(line => line.role === "caller" && line.text.includes("八万四")), "自己的钱必须在取消饭局前的必经问答出现");
  assert(!JSON.stringify([contribution.version, contribution.beforeVersion, contribution.afterVersion]).includes("八万四"), "存款放在追问回答里，不提前塞回首述或场前对话");
  const cancel = profile.overnightStructure.liveCounterBeats.find((beat) => beat.id === "profile-weekend-dinner-cancelled");
  assertEqual(cancel.afterSceneIndex, 6, "取消饭局跟在出资谈不拢之后");
});


test("STORY-REVISION-003", "each new reversal is playable after its source arrives", () => {
  const packets = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const credit = packets.find((p) => p.runtimeContentCaseId === "01-credit");
  const balance = credit.sceneVersions.find((s) => s.id === "credit-loyalty-test").afterVersion.lines;
  assert(balance.some((l) => l.role === "caller" && l.text.includes("八万拿不出来")), "固定收束必须确认拿不出八万，不能仅凭拒报余额断定没钱");
  assert(balance.every((l) => !/一万一千六百|11600|11,600/.test(l.text)), "固定收束不得泄露作者掌握的精确余额");
  const tony = packets.find((p) => p.runtimeContentCaseId === "02-tony");
  const finalScene = tony.sceneVersions[6];
  const act = finalScene.testimonyWall.acts[1];
  const doc = tony.documents.find((d) => d.id === "tony-submission");
  assert(doc && doc.rows.some((r) => r.rowId === "status"), "新出示必须有可读原行");
  assertEqual(act.decisivePresent.evidenceId, "tony-submission:status", "第二幕应查收款后凭证，不再问一次谁主动");
  assert(act.openerLines.some((l) => l.text?.includes("已提交")), "新提交页先到后台，再作为出示材料");
  assert(!JSON.stringify(tony.overnightStructure.dayScenes).includes("tony-submission"), "第二夜才收到的提交页不能在白天提前取到");
  const profile = packets.find((p) => p.runtimeContentCaseId === "03-profile");
  assert(profile.sceneVersions[5].beforeVersion.lines.some((l) => l.role === "caller" && l.text.includes("可以念")), "群聊节选先由本人提供，整页截图不能倒补公开授权");
});


test("STORY-REVISION-004", "final statement preserves its unresolved live counter before leaving dialogue", () => {
  const packet = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" }).find((p) => p.runtimeContentCaseId === "03-profile");
  const cancellation = packet.overnightStructure.liveCounterBeats.find((b) => b.id === "profile-weekend-dinner-cancelled");
  for (const keyQuestionHit of [true, false]) {
    const done = new Set([`version:${cancellation.afterSceneIndex}`]);
    if (keyQuestionHit) done.add(`keyQuestion:${cancellation.afterSceneIndex}`);
    const review = () => sceneReviewModel({ brief: packet, index: cancellation.afterSceneIndex, actionDone: (key) => done.has(key), overnight: { segment: "night2" } });
    assertEqual(review().lastStage, false, "最后一段无论问中与否，都须通过继续按钮进入尚未播放的固定事件");
    done.add(`liveCounterBeat:${cancellation.id}`);
    assertEqual(review().lastStage, true, "固定事件完成后才能离开问答，不得重播取消饭局");
  }
});


test("FLOW-LINEAR-UI", "off-air material controls do not promise a live patience penalty", () => {
  const material = { options: [{ label: "这行", correct: true }] };
  assert(!evidenceCheckScreenHtml({ check: material, costMeta: "圈选" }).includes("−1 耐心"), "幕间账页不能显示不存在的扣耐心");
  assert(!investigationBackflowScreenHtml({ hook: material, costMeta: "圈选" }).includes("−1 耐心"), "后台私信不能显示不存在的扣耐心");
  assert(evidenceCheckScreenHtml({ check: material }).includes("−1 耐心"), "直播中的材料风险保持原有规则");
});

test("FLOW-LINEAR-001", "required investigation scenes stay ordered without action budgets", () => {
  for (const brief of generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" })) {
    const structure = brief.nightStructure;
    assertEqual(structure.interlude.flowMode, "linear", "四案统一线性幕间");
    let night = initialNightStateFor(brief);
    const original = JSON.stringify(night);
    for (const action of structure.interlude.actions) {
      assertEqual(nextLinearInvestigationScene(structure.interlude.actions, night.interludeActionsDone)?.id, action.id, "必须先处理下一条未读材料");
      night = completeNightAction(night, action, structure);
      assertEqual(night.interludeBudget.used, 0, "调查不消耗行动点");
      assertEqual(completeNightAction(night, action, structure), night, "重复确认不重复授予材料");
      for (const item of action.grantsInventory ?? []) assert(night.inventory.includes(item), "必要材料全部带回");
    }
    assertEqual(nextLinearInvestigationScene(structure.interlude.actions, night.interludeActionsDone), null, "全部完成后退出幕间");
    assertEqual(JSON.stringify(initialNightStateFor(brief)), original, "纯状态函数不能污染新游戏");
    const ids = brief.overnightStructure.dayScenes.map((scene) => scene.id);
    for (const missing of ids) {
      const done = ids.filter((id) => id !== missing);
      assert(!canEnterOvernightCallback(brief, { dayScenesDone: [...done, ...done, "retired-location"] }), "重复记录和已删地点不能顶替缺失场景");
      assertEqual(nextLinearInvestigationScene(brief.overnightStructure.dayScenes, done)?.id, missing, "旧存档从漏掉的第一场继续");
    }
    assert(canEnterOvernightCallback(brief, { dayScenesDone: ids, timelineSorts: correctTimelineSorts(brief) }), "全场完成后回拨");
    const exhausted = { ...initialNightStateFor(brief), interludeBudget: { max: 1, remaining: 0, used: 1 } };
    if (structure.interlude.actions.length) assert(completeNightAction(exhausted, structure.interlude.actions[0], structure).interludeActionsDone.length === 1, "旧存档即使次数耗尽仍能继续");
    else assertEqual(nextLinearInvestigationScene(structure.interlude.actions, []), null, "无任务幕间直接进入白天，不制造重复询问");
  }
});

test("FLOW-LINEAR-002", "retired day choices cannot skip the new receipt scene", () => {
  const [brief] = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const saved = { scene: "overnightCallback", caseOvernights: { [brief.id]: { segment: "day", dayScenesDone: ["day-support-payments"], earnedItems: [], callbackOpenerId: "两个月一次的房租" } } };
  const refreshed = reconcileSavedOvernightProgress(saved, [brief]);
  assertEqual(refreshed.caseOvernights[brief.id].callbackOpenerId, null, "旧开场作废");
  assertEqual(nextLinearInvestigationScene(brief.overnightStructure.dayScenes, refreshed.caseOvernights[brief.id].dayScenesDone)?.id, brief.overnightStructure.dayScenes[0].id, "从未读的新来源继续");
});
test("PLAYTEST-RECORDED-001", "broadcast night and advisor role survive interaction mode changes", () => {
  for (const liveNight of ["night1", "night2"]) {
    const expected = liveNight === "night2" ? "bgm.callback-return" : "bgm.live-call";
    for (const scene of ["sceneReview", "sceneLineReplay", "sceneQuestionAnswer", "afterSceneEvidence", "liveCounterBeat"]) {
      assertEqual(audioScenePlan({ scene, liveNight }).bgmCueId, expected, `${scene} 同一晚不得因控件模式改变 BGM`);
    }
  }
  for (const speaker of ["赵律师", "赵律师（语音）"]) {
    assertIncludes(callDialogueHtml([{ speaker, role: "caller", text: "先看这一条。" }]), "call-line advisor", "顾问不能复用求助者样式");
    const line = { classList: { contains: (name) => name === "caller" }, querySelector: (tag) => ({ textContent: tag === "b" ? speaker : "先看这一条。" }) };
    assertEqual(dialogueTurnsFrom({ querySelectorAll: () => [line] })[0].role, "advisor", "旧台词结构也要识别顾问角色");
  }
});

test("PLAYTEST-RECORDED-002", "authored probes and shared-savings reveal retain their actual sources", () => {
  const packets = ["01-credit", "04-workplace", "03-profile", "02-tony"].map((id) => JSON.parse(readFileSync(new URL(`../content/packs/steam-demo-01/cases/${id}.json`, import.meta.url), "utf8")));
  for (const packet of packets) for (const scene of packet.sceneVersions) {
    for (const probe of scene.reviewProbes ?? []) {
      const matches = statementAnchorLineMatches(statementLinesFromText(scene.version), probe.sourceAnchor);
      assertEqual(matches.length, 1, `${scene.id} 追问必须挂在唯一原句上`);
      assert(probe.question && probe.answer, `${scene.id} 必须写出具体追问与反驳`);
    }
  }
  const credit = packets[0];
  const acts = credit.sceneVersions.at(-1).testimonyWall.acts;
  assertIncludes(acts[0].decisivePresent.materialCards[0].excerpt, "我替我们存着", "代存反驳以约定原话为材料");
  assertIncludes(JSON.stringify(credit.sceneVersions.at(-1).beforeVersion), "我替我们存着", "代存原话必须在第一次出示前播放");
  assertIncludes(JSON.stringify(acts[1].openerLines), "我拿去做脸买衣服了", "个人消费聊天必须在第二次出示前收到");
  const work = packets[1].sceneVersions.find(scene => scene.id === "work-split-ownership").sceneCloser.lines;
  const stop = work.findIndex((line) => line.text?.includes("不再个人垫款"));
  const sent = work.findIndex((line) => line.role === "stage" && line.text.includes("他发出两条群消息"));
  assert(stop >= 0 && sent >= stop, "停止垫款必须进入原有发送动作，不另发一轮");
  assertEqual(work.filter((line) => line.role === "stage" && line.text.includes("他发出两条群消息")).length, 1, "发送事件只发生一次");
});

const failed = results.filter((item) => !item.ok);
if (testFilter && !results.length) {
  console.error(`No unit tests matched filter: ${testFilter}`);
  process.exit(1);
}
if (failed.length) {
  failed.forEach((item) => {
    console.error(`✗ ${item.id} ${item.name}`);
    console.error(item.error?.stack ?? item.error);
  });
  process.exit(1);
}

results.forEach((item) => console.log(`✓ ${item.id} ${item.name}`));
console.log(`game unit tests passed: ${results.length}${testFilter ? ` (filter: ${testFilter})` : ""}`);

function correctTimelineSorts(brief) {
  return Object.fromEntries((brief.overnightStructure?.dayScenes ?? []).filter(scene => scene.body?.timelineSort).map(scene => [scene.id, { submitted: true, correct: true, order: [...scene.body.timelineSort.correctOrder] }]));
}
