import { caseModeConfig, generateCasesForMode, normalizeCaseMode, validCaseBriefCount } from "../src/caseModes.js";
import { accusationLabel, evidenceInsightFor, runCompleteLineFor, timelineGapText } from "../src/caseNarration.js";
import { allCaseContradictions, calculateCaseBudgetMax, calculateCaseOutcome, calculateInspirationMax, calculateIssueCompletion, expectedAccusationForCase, nextInspirationContradictionForCase, relationshipExpectedAccusationForCase, resolveAccusationForCase } from "../src/caseRuntime.js";
import { requiredContradictionsForCase, truthBoundaryPromptLimitForCase } from "../src/difficulty.js";
import { migrateState } from "../src/state.js";
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
import { refreshSavedCaseContent } from "../src/runtime/savedContentRefresh.js";
import { audioBusGain, normalizeAudioSettings, updateAudioBusVolume } from "../src/runtime/audioModel.js";
import { ambienceCueForBackdrop, audioScenePlan } from "../src/runtime/audioSceneModel.js";
import { applyRuntimeCaseContent, isRuntimeLoadedCaseContent, missingRuntimeCaseRequiredFields, RUNTIME_CASE_CONTENT_STATUS } from "../src/runtime/contentCase.js";
import { actionDoneForState, answeredEvidenceCountForState, answeredSceneCountForState, askedDialoguePicksForState, completedSceneExchangeForState, contradictionsForState, latestChoiceReviewRowsForState, routeAxisProfileForState, routeChoicesForState, selectedEvidencePicksForState, selectedInvestigationPicksForState, selectedScenePickForState, truthBoundaryPicksForState, unlockedInvestigationEntriesForState } from "../src/runtime/caseStateSelectors.js";
import { dailyConclusionModel, dailyPlayerType, dailyRouteProfile as buildDailyRouteProfile, finalQuoteComparison, investigationBackflowProfile, investigationPickReaction, recapRankLabel, storyCallCountText, storyCommentWall, storyHiddenThreadProfile, storyMaterialProfile, storyObjectProfile, storyPackAftertaste, storyPackAxes, storyPackBestAxis, storyPackClosingLine, storyPlayerType, storyQuoteProfile, storyShareTitle, storyThemeProfile, truthBoundaryAftertaste, truthBoundaryPackProfile, truthBoundaryReview } from "../src/runtime/recapModel.js";
import { livePressureProfile, materialPressureReaction, materialPressureSignal, pressuredAnswerVariant, pressurePackProfile, pressureRecapProfile, questionPressureReaction, questionPressureSignal } from "../src/runtime/livePressure.js";
import { gamepadAxisDirection, keyboardNavigationIntent, nextFocusIndex } from "../src/runtime/inputNavigation.js";
import { chunkDialogueTurn, dialoguePageRole, dialogueTurnsFrom, groupDialogueTurns, splitDialogueSentences } from "../src/runtime/dialoguePresentation.js";
import { assertDialogueTexture, dialogueTextureMetrics, spokenPunctuationLeaks } from "../src/runtime/dialogueTexture.js";
import { normalizeRouteChoice, routeAxisForChoice, routeAxisProfileFromChoices, routeToneForChoice } from "../src/runtime/routeLog.js";
import { canRewindQuestion, popQuestionRewindPoint, pushQuestionRewindPoint, QUESTION_REWIND_LIMIT } from "../src/runtime/questionRewind.js";
import { routeTrailModel } from "../src/runtime/routeMapModel.js";
import { answerKey, applyActionMark, availableCallbackOpeners, availableOvernightCallbackOpeners, canEnterOvernightCallback, casePatienceLost, completeNightAction, dailyAccusationReadiness as accusationReadinessForCase, daySceneById, earnedDocumentQuestionsFor, evidenceAnsweredCount, evidenceAnswerKey, evidenceCheckModel, firstUnansweredSceneIndex, initialCaseBudget, initialOvernightStateFor, interludeEarnedItemsForOvernight, investigationAnswerKey, investigationBackflowModel, investigationRouteIndexBase, liveCounterBeatAfterScene, liveCounterBeatBeforeScene, liveCounterBeatById, liveCounterBeatTriggerMet, nextPlayableSceneIndex, nightActionById, nightStructureFor, overnightAnchorSceneIndex, overnightCallbackDialogueLines, overnightCallbackOpenerById, overnightCallerQuestionFor, overnightFirstNight2SceneIndex, overnightReturnPostureFor, overnightStructureFor, playableSceneCount, playableSceneIndexes, recordPatienceLostState, retryPatienceLostState, sceneReviewModel, shouldEnterHangupAfterScene, shouldEnterOvernightHangupAfterScene, snapshotEchoFor, unlockedInvestigationEntries } from "../src/runtime/sceneAdvance.js";
import { storyInterludeCaseId, storyInterludeObjectLabel } from "../src/runtime/storyInterludeModel.js";
import { CARE_CHOICE_IDS, careChoiceById, careChoiceIsComplete, careChoiceLines } from "../src/runtime/careChoiceModel.js";
import { epilogueUnreadMessages, epilogueUnreadStage } from "../src/runtime/epilogueUnreadModel.js";
import { hostDisclosureLinesForAnchor } from "../src/runtime/hostDisclosureModel.js";
import { advanceQuickConfrontation, advanceQuickTranscript, advanceQuickVerdict, applyQuickIssueSelection, initialQuickDetectiveState, normalizeQuickDetectiveState, quickConfrontationLines, quickDetectiveIsComplete, quickDisclosureRounds, quickIssueOptionsForRound } from "../src/runtime/quickDetectiveModel.js";
import { CHOICE_COST_META, choiceCostMeta } from "../src/runtime/choiceCostModel.js";
import { storyBoundaryRows, storyMaterialRows, storyPackSummaryModel, storyPressureRows } from "../src/runtime/storyPackSummaryModel.js";
import { callDialogueHtml, choiceButtonBodyHtml, choiceGroupHtml, choiceReviewHtml, flowGroupHtml } from "../src/ui/callFlowView.js";
import { audioSettingsPanelHtml } from "../src/ui/audioSettingsView.js";
import { formatAudioTime } from "../src/ui/audioController.js";
import { dailyCompleteChoicesHtml, dailyCompleteHtml, dailyCompleteShareText } from "../src/ui/dailyCompleteView.js";
import { evidenceCheckScreenHtml, evidenceMaterialKind, evidenceMaterialRows, evidenceMaterialThumbHtml, evidenceOperationHtml, investigationBackflowScreenHtml } from "../src/ui/evidenceView.js";
import { audioPlaybackControlsHtml, callbackOpenerChoiceHtml, interludePlaybackActionHtml } from "../src/ui/interludeDeskView.js";
import { audiencePatienceHudHtml, callerArtForExpression, callerExpressionForView, caseProgressStripHtml, liveCommentStripHtml, portraitLayerHtml, storyPackSummaryHudHtml } from "../src/ui/liveCallView.js";
import { liveCounterBeatHtml } from "../src/ui/liveCounterBeatView.js";
import { liveControlDeckHtml, liveFrameHtml } from "../src/ui/liveFrameView.js";
import { finalQuoteComparisonHtml, offMicLettersHtml, solvedRecapFlowView, solvedRecapPagesHtml, truthBoundaryPlaced, truthBoundaryReviewHtml } from "../src/ui/recapView.js";
import { routeTrailHtml } from "../src/ui/routeTrailView.js";
import { focusedQuestionOptions, playerQuestionLabel, sceneDialogueOptions, sceneQuestionChoicesHtml, sceneQuestionMenuHtml } from "../src/ui/sceneQuestions.js";
import { activeSceneExchangeHtml, completedSceneExchangeHtml, keyChoiceExchangeHtml, sceneQuestionAnswerHtml, sceneReviewDoneChoicesHtml, sceneReviewHtml, stanceSnapshotHtml } from "../src/ui/sceneReviewView.js";
import { storyInterludeChoicesHtml, storyInterludeHtml } from "../src/ui/storyInterludeView.js";
import { caseBridgeChoicesHtml, caseBridgeHtml, caseClosingChoicesHtml, caseClosingHtml, caseTitleChoicesHtml, caseTitleHtml } from "../src/ui/caseTransitionView.js";
import { careChoiceContinueHtml, careChoiceHtml } from "../src/ui/careChoiceView.js";
import { epilogueUnreadContinueHtml, epilogueUnreadHtml } from "../src/ui/epilogueUnreadView.js";
import { storyPackCompleteHtml, storyPackShareText } from "../src/ui/storyPackCompleteView.js";
import { titleScreenHtml } from "../src/ui/titleView.js";
import { quickDetectiveCaseSelectHtml, quickDetectiveConfrontationHtml, quickDetectiveIntroHtml, quickDetectiveIssueSelectionHtml, quickDetectiveStageHtml, quickDetectiveTranscriptHtml, quickDetectiveVerdictHtml } from "../src/ui/quickDetectiveView.js";
import { createRecapScreens } from "../src/ui/screens/recapScreens.js";
import { readFileSync, readdirSync } from "node:fs";

const attrs = { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 };
const results = [];
const screenSourcePaths = [
  "../src/ui/screens/overnightScreens.js",
  "../src/ui/screens/interludeScreens.js",
  "../src/ui/screens/sceneScreens.js",
  "../src/ui/screens/recapScreens.js",
  "../src/ui/screens/quickDetectiveScreens.js"
];
const screenSources = screenSourcePaths.map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));
const runtimeSource = [
  readFileSync(new URL("../src/app.js", import.meta.url), "utf8"),
  ...screenSources
].join("\n");
const quickDetectiveUiSource = readFileSync(new URL("../src/ui/quickDetectiveView.js", import.meta.url), "utf8");
const courtRecordUiSource = readFileSync(new URL("../src/ui/courtRecordView.js", import.meta.url), "utf8");

test("INPUT-000", "mouse wheel never opens the court record", () => {
  assert(!courtRecordUiSource.includes('addEventListener("wheel"'), "鼠标滚轮只能滚动页面，不能打开案卷");
  assertIncludes(courtRecordUiSource, 'querySelectorAll("[data-record-open]")', "案卷必须保留明确的打开入口");
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

test("TEXTURE-001", "humanization texture metrics are gated, measurable, and enforced", () => {
  const unmarked = dialogueTextureMetrics({ caseId: "unmarked" });
  assertEqual(unmarked.skipped, true, "未打 texturePass 标记的案件必须跳过纹理门控");
  const broken = dialogueTextureMetrics({ caseId: "broken", texturePass: true, voiceTics: { 沈: ["反正"] }, sceneVersions: [] });
  assertEqual(broken.valid, false, "打标案件不足阈值时必须失败");
  assertThrows(() => assertDialogueTexture({ caseId: "broken", texturePass: true, voiceTics: { 沈: ["反正"] } }), /短答句/, "纹理断言必须报告具体缺项");
  const caseOne = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/cases/01-credit.json", import.meta.url), "utf8"));
  const result = assertDialogueTexture(caseOne);
  assert(result.metrics.shortAnswerCount >= 3, "案 1 必须有至少三句短答");
  assert(result.metrics.longRambleCount >= 1, "案 1 保留一段确有口述需要的长回答即可，不能为纹理门禁硬塞第二段");
  assert(result.metrics.interruptionCount >= 2, "案 1 必须有至少两处掐断");
  assert(result.metrics.nonLoadBearingCount <= result.thresholds.nonLoadBearingMaxCount, "案 1 不得为满足纹理门禁硬塞无功能生活噪声");
  assert(result.metrics.callerTicCount >= 3 && result.metrics.otherTicCount === 0, "沈的口癖必须集中在本人台词且不串给其他角色");
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
    assertEqual(packet.careChoices.map((choice) => choice.id).join("|"), CARE_CHOICE_IDS.join("|"), `${packet.caseId} 关怀选择顺序必须固定`);
    assert(packet.careChoices.every((choice) => !("score" in choice) && !("correct" in choice)), `${packet.caseId} 关怀选择不得计分或标正确项`);
    assert(packet.careChoices.every((choice) => !JSON.stringify(choice).includes("(拍)")), `${packet.caseId} 停顿必须是独立拍，不能把(拍)写进台词`);
  });
  assertEqual(careChoiceById(packets[0], "affirm")?.label, "肯定", "关怀选择必须可按 id 读取");
  assert(careChoiceLines(careChoiceById(packets[0], "pragmatic")).some((line) => line.role === "pause"), "务实支线必须保留独立停顿拍");
  assert(!JSON.stringify(packets[2].careChoices).includes("唉"), "案 3 关怀支线不得污染 oneTimeTic 唯一性");
  assertIncludes(packets[3].careChoices[0].lines[0].text, "呃", "案 4 务实支线必须保留陈的口癖");
  const choiceHtml = careChoiceHtml({ choices: packets[0].careChoices });
  assertIncludes(choiceHtml, "data-care-choice=\"pragmatic\"", "未选择时必须渲染三种关怀动词");
  assertIncludes(choiceHtml, CHOICE_COST_META.careChoice, "关怀按钮必须在点击前说明不计分");
  const selectedHtml = careChoiceHtml({ selectedChoice: packets[0].careChoices[0] });
  assertIncludes(selectedHtml, "care-choice-pause", "选择后必须渲染停顿拍");
  assertIncludes(careChoiceHtml({ selectedChoice: packets[0].careChoices[0], hostName: "周明" }), "周明", "关怀拍必须显式使用当前玩家姓名");
  assertEqual(careChoiceLines(careChoiceById(packets[0], "pragmatic"), "周明")[0].speaker, "周明", "关怀拍纯模型必须接受当前玩家姓名");
  assertIncludes(careChoiceContinueHtml({ finalCase: true }), "听完这夜", "最后一案关怀拍必须能进入整夜尾声");
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
  assertIncludes(messages[0].text, "面煮了,放了两个蛋。", "案 1 未读必须回声务实选择");
  assertIncludes(messages[1].text, "不丢人。", "案 2 未读必须回声肯定选择");
  assertIncludes(messages[2].text, "你们等着。", "案 3 未读必须回声陪伴选择");
  const caseThree = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/cases/03-profile.json", import.meta.url), "utf8"));
  const caseFour = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/cases/04-workplace.json", import.meta.url), "utf8"));
  const caseThreeAffirm = caseThree.careChoices.find((choice) => choice.id === "affirm")?.hostLine ?? "";
  const caseFourAffirm = caseFour.careChoices.find((choice) => choice.id === "affirm")?.hostLine ?? "";
  assertIncludes(caseThreeAffirm, "问清楚不丢人", "案 3 肯定选择必须提供尾声回声的原句");
  assertIncludes(epilogue.unreadMessages.find((message) => message.caseId === "03-profile")?.echoes?.affirm ?? "", "问清楚不丢人", "案 3 尾声引语必须追溯到肯定选择原句");
  assertIncludes(caseFourAffirm, "六万八是六万八", "案 4 肯定选择必须提供尾声回声的原句");
  assertIncludes(epilogue.unreadMessages.find((message) => message.caseId === "04-workplace")?.echoes?.affirm ?? "", "六万八是六万八", "案 4 尾声引语必须追溯到肯定选择原句");
  assertEqual(messages[4].echo, "", "陌生号码不得拼接关怀回声");
  const typedStrings = epilogue.unreadMessages.flatMap((message) => [message.base, ...Object.values(message.echoes ?? {})]);
  assert(typedStrings.every((text) => !/[，：；]/.test(text)), "后台未读的打字面不得混入全角逗号、冒号或分号");
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

test("CARE-003", "soup arc, solo-host pause, and case-file hook keep their authored order", () => {
  const manifest = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/manifest.json", import.meta.url), "utf8"));
  const caseThree = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/cases/03-profile.json", import.meta.url), "utf8"));
  const caseFour = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/cases/04-workplace.json", import.meta.url), "utf8"));
  const zhaoPrologueMessage = manifest.nightShell.prologue.lines.find((line) => line.speaker === "老婆");
  assertEqual(zhaoPrologueMessage?.speaker, "老婆", "序章私人联系人统一显示为“老婆”，不再保留容易出戏的复合备注");
  assert(!JSON.stringify(manifest).includes("领导（老婆）"), "玩家可见内容不得残留旧联系人备注“领导（老婆）”");
  assertIncludes(zhaoPrologueMessage?.text, "汤在冰箱", "序章必须留下汤");
  assertIncludes(zhaoPrologueMessage?.text, "有个东西我塞你包里了", "赵律师的私下留言必须先成立为恋人间的生活话");
  assert(!zhaoPrologueMessage?.text.includes("案卷"), "赵律师不得在恋人留言里使用案卷交接腔");
  const interlude = manifest.nightShell.interludes.find((entry) => entry.afterCaseId === "03-profile");
  const interludeHtml = storyInterludeHtml({ kicker: interlude.kicker, shellLine: interlude.line, shellLines: interlude.lines, shellAfterLines: interlude.afterLines });
  assertIncludes(interludeHtml, "第一次去我家", "案三小尾声必须让赵律师以伴侣身份进入生活场景");
  assert(interludeHtml.indexOf("第一次去我家") < interludeHtml.indexOf("饭还是吃完了"), "案三小尾声必须按问话与回应顺序展开");
  assertIncludes(interludeHtml, "热过的汤又凉了", "汤的物件弧必须继续留在案三收尾");
  assertIncludes(manifest.nightShell.epilogue.home, "保温盒空了。你顺手洗了", "回家段必须收回空保温盒，并保持玩家行动视角");
  assertIncludes(manifest.nightShell.epilogue.close, "牛皮纸文件袋", "收束必须用文件袋回收序章托放动作");
  assertIncludes(manifest.nightShell.epilogue.close, "你当年没问完的那通", "文件袋便签必须接回主播旧伤");
  assert(!manifest.nightShell.epilogue.close.includes("留给后续正式内容"), "玩家可见尾声不得出现编剧说明");
  const disclosureLines = hostDisclosureLinesForAnchor(caseFour, "atStageJudgement");
  assertEqual(disclosureLines.length, 2, "案 4 主播自揭后必须只追加一拍材料复核");
  assertEqual(disclosureLines[1].role, "stage", "个人主播复核必须写成现场动作，不得虚构导播回话");
  assertIncludes(disclosureLines[1].text, "供应商回执和报销单并排", "复核动作必须把两笔不同性质的钱重新分开");
  assertIncludes(callDialogueHtml(disclosureLines), "call-stage-direction", "主播复核必须渲染成舞台动作");
  assertEqual(hostDisclosureLinesForAnchor(caseFour, "atStageJudgement", "周明")[0].speaker, "周明", "主播自揭必须显式使用当前玩家姓名");
  assertEqual(dialogueTextureMetrics(caseThree).metrics.oneTimeCallerCount, 1, "案 3 oneTimeTic 必须继续只出现一次");
});

function test(id, name, fn) {
  try {
    fn();
    results.push({ id, name, ok: true });
  } catch (error) {
    results.push({ id, name, ok: false, error });
  }
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
  assertIncludes(appSource, "shareQuery", "分享消息必须发送平台无关的查询参数");
  assertIncludes(miniappPageSource, "sharePathForPayload", "小程序壳必须在自己的边界内组装页面分享路径");
});

test("QUICK-001", "quick detective mode alternates bounded disclosure rounds with host confrontations", () => {
  const packet = quickDetectiveCaseFor("steam-demo-01");
  assert(packet, "试玩包必须提供快案");
  const quickCases = quickDetectiveCasesFor("steam-demo-01");
  assertEqual(quickCases.length, storyPackForKey("steam-demo-01").quickCases.length, "快案选择页必须按 manifest 顺序读取全部快案");
  assertEqual(packet.caseNumber, "01", "首宗快案必须有独立、稳定的两位案件编号");
  const uncompletedSelect = quickDetectiveCaseSelectHtml(quickCases, []);
  const completedSelect = quickDetectiveCaseSelectHtml(quickCases, [packet.id]);
  assertIncludes(uncompletedSelect, "CASE</small><b>01", "快案选择卡必须醒目显示案件编号");
  assertIncludes(uncompletedSelect, `data-quick-case-id="${packet.id}"`, "快案选择卡必须允许玩家选择本次进入哪宗案件");
  assertIncludes(uncompletedSelect, "未完成", "未通关快案必须显示未完成状态");
  assert(!uncompletedSelect.includes("<i>✓</i>"), "未通关快案不能提前显示完成对勾");
  assert(!uncompletedSelect.includes("完成的案件会留下一枚对勾"), "案件卡已经显示完成状态时，选择页不得再解释对勾和重玩行为");
  assertIncludes(completedSelect, "<i>✓</i><b>已完成</b>", "通关快案必须显示对勾和已完成标记");
  assertEqual(migrateState({ quickDetectiveCompletedIds: [packet.id, packet.id, null] }).quickDetectiveCompletedIds.join("|"), packet.id, "快案完成记录必须去重并随存档迁移保留");
  const lastVerdictPage = packet.ending.summaryPages.length - 1;
  const lastVerdictLine = packet.ending.summaryPages[lastVerdictPage].lines.length - 1;
  assert(!quickDetectiveIsComplete(packet, { scene: "verdict", verdictIndex: lastVerdictPage, verdictLineIndex: Math.max(0, lastVerdictLine - 1) }), "快案不能在最后总结说完前提前记为通关");
  assert(quickDetectiveIsComplete(packet, { scene: "verdict", verdictIndex: lastVerdictPage, verdictLineIndex: lastVerdictLine }), "快案最后一行显示后必须记为通关");
  assert(!quickDetectiveUiSource.includes("评论区翻记录"), "快案不得保留评论区补答案流程");
  assert(!quickDetectiveUiSource.includes("圈这句话"), "快案不得保留圈句操作");
  const intro = quickDetectiveIntroHtml(packet);
  assert(!intro.includes("这次怎么玩") && !intro.includes("每轮") && !intro.includes("按钮") && !intro.includes("对质"), "快案开场只交代来电背景，不得向玩家解释游戏机制");
  const customHost = { hostName: "周明" };
  [
    quickDetectiveIntroHtml(packet, customHost),
    quickDetectiveStageHtml(packet, { scene: "transcript", turnIndex: 0 }, customHost),
    quickDetectiveTranscriptHtml(packet, { scene: "transcript", turnIndex: 0 }, customHost),
    quickDetectiveConfrontationHtml(packet, { scene: "confrontation", activeConfrontationId: packet.confrontations[0].id }, customHost),
    quickDetectiveVerdictHtml(packet, { scene: "verdict", verdictIndex: 0, verdictLineIndex: 0 }, customHost)
  ].forEach((html) => {
    assertIncludes(html, "周明", "快案视图必须显式使用当前玩家姓名，不能只依赖整页字符串替换");
    assert(!html.includes(DEFAULT_PLAYER_NAME), "显式传入玩家姓名后，快案气泡、立绘和标题不得残留默认主播名");
  });
  assertEqual(packet.premise, "一个姑娘打进电话，想请你帮她介绍对象。", "快案入口只能显示接通前主播知道的表面求助，不得提前概括人物条件和案情");
  assertEqual(packet.turns.length, 17, "首个快案必须用十七组短对话给人物自述、房价追问和掩护信息留出空间");
  assertEqual(packet.confrontations.length, 4, "快案必须有四组由主播当面问回的前后矛盾");
  const quickRevealConfrontations = packet.confrontations.filter((item) => item.revealTransition);
  assertEqual(quickRevealConfrontations.length, 1, "快案必须且只能给一个最大反转播放重击过场");
  assertEqual(quickRevealConfrontations[0]?.id, "two-fathers", "快案唯一重击点必须落在一百万买房与两个‘爸爸’的矛盾上");
  assertEqual(quickRevealConfrontations[0]?.revealTransition?.kind, "reveal", "快案核心重击必须使用统一 reveal 过场类型");
  assert((packet.ending?.summaryPages ?? []).length >= 3, "快案结尾必须分开结束通话、矛盾复盘和高概率判断");
  const quickOneRecapPage = packet.ending.summaryPages.find((page) => page.stageLabel === "结案复盘");
  assertEqual(quickOneRecapPage?.lines?.[0]?.text, "我们来把这次这个连线复个盘。", "首宗快案挂断后必须用固定口头标记进入主播复盘");
  assert(packet.issueOptions.length > packet.confrontations.length, "快案必须让玩家在矛盾方向和合理干扰项之间判断，不能自动播放答案");
  assertEqual(packet.issueOptions.filter((item) => item.confrontationId).length, packet.confrontations.length, "每项对质必须恰好有一个玩家可选的问题方向");
  assert(packet.issueOptions.every((item) => item.label && !/[？?。！!]$/.test(item.label)), "快案玩家按钮必须只写疑点方向，不直接展示完整问句");
  assert(packet.issueOptions.filter((item) => !item.confrontationId).every((item) => item.missLine), "干扰方向必须有不带价值判断的重试说明");
  assert(packet.quoteOptions === undefined && packet.playerMarkLimit === undefined && packet.requiredFlawCount === undefined, "快案数据不得保留圈句预算和评论接力旧字段");
  assert((packet.coverStrategy?.honestDetails ?? []).length >= 3, "快案必须先用至少三条普通生活信息建立可信形象");
  assert((packet.coverStrategy?.layeredLeaks ?? []).length >= packet.confrontations.length, "每个矛盾点都必须有一层当场说得通的保护说法");
  assertIncludes(packet.presentation?.backgroundSrc, "livestream_studio", "快案必须固定使用直播间背景，不能退回空白配置板");
  assertIncludes(packet.presentation?.host?.artSrc, "lin-xuyang-host-pixel", "快案必须使用林旭阳专属像素立绘");
  assertIncludes(packet.presentation?.caller?.artSrc, "caller-luo-pixel", "快案必须使用本案来电人的专属像素立绘");
  const transcriptStage = quickDetectiveStageHtml(packet, { scene: "transcript", turnIndex: 0 });
  assertIncludes(transcriptStage, "quick-stage-host is-active", "主播问话页必须高亮主播立绘");
  assert(!transcriptStage.includes("quick-stage-caller is-active"), "主播问话页必须把来电人立绘压暗");
  const transcriptReplyStage = quickDetectiveStageHtml(packet, { scene: "transcript", turnIndex: 0, turnLineIndex: 1 });
  assertIncludes(transcriptReplyStage, "quick-stage-caller is-active", "来电人回答页必须高亮来电人立绘");
  assert(!transcriptReplyStage.includes("quick-stage-host is-active"), "来电人回答页必须把主播立绘压暗");
  assertIncludes(transcriptStage, "语音连线中", "双人舞台必须明确这是语音连线，不能暗示来电人真的在直播间出镜");
  const issueStage = quickDetectiveStageHtml(packet, { scene: "issueSelection" });
  assertIncludes(issueStage, "focus-both", "玩家整理矛盾时两边立绘都应保持可见，不能暗示系统已经选定说话人");
  const confrontationStage = quickDetectiveStageHtml(packet, { scene: "confrontation", activeConfrontationId: packet.confrontations[0].id });
  assertIncludes(confrontationStage, "quick-stage-host is-active", "对质问话页必须高亮主播立绘");
  assert(!confrontationStage.includes("quick-stage-caller is-active"), "对质问话页必须把来电人立绘压暗");
  assertIncludes(confrontationStage, "当面对质", "对质阶段必须在连线舞台上明确标记");
  assertIncludes(packet.turns[0].caller, "主播你好", "快案首次接通必须使用自然问候，不能把身份称呼和套近乎硬粘在一起");
  assert(!packet.turns[0].caller.includes("主播哥"), "快案首次问候不能使用生造称呼“主播哥”");
  assertEqual(packet.turns[0].id, "greeting", "快案第一页只能完成接通与互相问候");
  const askForMatchTurn = packet.turns.find((turn) => turn.id === "ask-for-match");
  assertEqual(askForMatchTurn?.host, "那你今天什么问题？", "问候结束后，主播才正式询问来意");
  assertIncludes(askForMatchTurn?.caller, "我想问下我的择偶定位", "来电人必须先说自己的求助，不得开场就塞完人物背景");
  assertIncludes(askForMatchTurn?.caller, "有合适的资源，当然更好", "快案开场必须保留来电人希望获得介绍资源的利益诉求");
  assertIncludes(packet.whyTonight, "兼职替人介绍对象", "快案必须固定主播兼职红娘的业务入口，不能临时获得介绍资源");
  const callerProfileTurn = packet.turns.find((turn) => turn.id === "caller-profile");
  assertIncludes(callerProfileTurn?.caller, "在商场卖衣服", "快案必须先给来电人一条普通、可理解的生活线，不能直接进入破绽清单");
  assertIncludes(callerProfileTurn?.caller, "自己能养活自己", "普通信息必须服务她想建立的独立形象");
  const straightPersonaTurn = packet.turns.find((turn) => turn.id === "straight-persona");
  assertIncludes(straightPersonaTurn?.caller, "吵完架", "来电人不能只报“不会说好听话”的性格标签，必须先说它怎样进入旧关系冲突");
  assertIncludes(straightPersonaTurn?.caller, "慢慢就散了", "旧关系自述必须补齐行为到分手结果的相邻因果");
  assert(packet.turns.every((turn) => !(turn.ambientComments ?? []).length), "快案首轮十七组原始对话不能夹带判断提示");
  assert(!quickDetectiveTranscriptHtml(packet, { scene: "transcript", turnIndex: 2 }).includes("quick-ambient-comments"), "原始问答页不能留下教学式评论容器");
  const desiredPartnerTurn = packet.turns.find((turn) => turn.id === "desired-partner");
  assertIncludes(desiredPartnerTurn?.caller, "别瞒着我", "来电人必须先把不隐瞒说成自己的择偶要求");
  const birthFatherTurn = packet.turns.find((turn) => turn.id === "birth-father");
  assertIncludes(birthFatherTurn?.caller, "上小学", "快案必须交代母亲离开时来电人仍年幼");
  assertIncludes(birthFatherTurn?.caller, "收拾东西就走了", "母亲离开不能只用摘要带过，要保留来电人记住的具体动作");
  assertIncludes(birthFatherTurn?.caller, "我爸一个人把我带大的", "快案必须交代父亲独自抚养她，补齐相互扶持诉求的来路");
  assertIncludes(birthFatherTurn?.caller, "也能商量着过", "家庭经历必须落到来电人的择偶诉求，不能只作为破绽背景材料");
  assertIncludes(birthFatherTurn?.caller, "我不能生孩子", "婚育疑点必须先由人物自己的扶持愿望带出，不能由主播按价值清单硬问");
  const housingTurn = packet.turns.find((turn) => turn.id === "housing-requirement");
  assertEqual(housingTurn?.host, "那你对男方的房子有要求吗？", "家庭与扶持诉求之后，主播才可以自然问到房子要求");
  const millionFromDadTurn = packet.turns.find((turn) => turn.id === "million-from-dad");
  assertIncludes(millionFromDadTurn?.caller, "我又添了一点才买下来", "房款来路必须用完整结果句，不能省掉“才”造成口语残缺");
  const whichDadTurn = packet.turns.find((turn) => turn.id === "which-dad");
  assertIncludes(whichDadTurn?.host, "自己身体这样", "主播只能顺着亲爸的表面理解回应，不能直接问出两个爸爸");
  assertIncludes(whichDadTurn?.caller, "他在我身上一直挺舍得", "来电人必须用代词维持歧义，不能主动交代另一个爸爸");
  assert(!whichDadTurn?.caller.includes("一个我叫爸爸的人"), "两个爸爸的答案必须留到主播最后的对质");
  assert(!packet.turns.some((turn) => ["fertility-report", "report-timing"].includes(turn.id)), "首轮必须删除主播对不能生育例子和检查披露时点的追问");
  const relationshipPaceTurn = packet.turns.find((turn) => turn.id === "relationship-pace");
  assertIncludes(relationshipPaceTurn?.caller, "相处一两年", "删除婚育审问后必须用普通恋爱节奏问答维持咨询铺垫");
  const smallCircleTurn = packet.turns.find((turn) => turn.id === "small-circle");
  assertIncludes(smallCircleTurn?.caller, "商场下班本来就晚", "首轮必须用工作和生活圈补充可信信息，不能连续递破绽");
  const ordinaryMatchTurn = packet.turns.find((turn) => turn.id === "ordinary-match");
  assertIncludes(ordinaryMatchTurn?.caller, "我也不知道他平时是什么样的人", "来电人必须先用安全顾虑挡下普通对象，不能像傻子一样直接承认嫌条件差");
  const ordinaryCautionTurn = packet.turns.find((turn) => turn.id === "ordinary-caution");
  assertIncludes(ordinaryCautionTurn?.caller, "自己做点生意", "优质对象偏好必须在合理顾虑之后逐步加码");
  assertIncludes(ordinaryCautionTurn?.caller, "怕遇到不靠谱的", "来电人必须用安全理由包装筛选利益");
  assertIncludes(ordinaryCautionTurn?.caller, "减轻点房贷压力", "来电人必须在优质对象偏好后露出希望对方分担成本的诉求");
  const homePriceTurn = packet.turns.find((turn) => turn.id === "home-price");
  assertEqual(homePriceTurn?.host, "你那套房买下来一共多少钱？", "房贷诉求出现后主播必须自然追问房屋总价");
  assertEqual(homePriceTurn?.caller, "总价两百万。", "来电人必须明确回答房屋总价两百万元");
  assert(packet.turns.findIndex((turn) => turn.id === "ordinary-caution") + 1 === packet.turns.findIndex((turn) => turn.id === "home-price"), "房价追问必须紧接房贷诉求，不能隔页换题");
  const originalTranscript = packet.turns.map((turn) => `${turn.host} ${turn.caller}`).join(" ");
  assert(!/不是同一个|我只想找有钱|我准备.*瞒/.test(originalTranscript), "原始咨询不得让来电人主动提交核心答案或动机自白");
  assert(!originalTranscript.includes("自然怀孕的机会低") && !originalTranscript.includes("你刚才怎么会想到拿自己不能生孩子举例"), "检查结果只能在玩家选中疑点后的回问中出现，首轮不得提前给答案");
  assert(packet.turns.findIndex((turn) => turn.id === "birth-father") < packet.turns.findIndex((turn) => turn.id === "million-from-dad"), "家庭经历和扶持诉求必须先于房子与一百万出现");
  assert(packet.turns.findIndex((turn) => turn.id === "birth-father") + 1 < packet.turns.findIndex((turn) => turn.id === "million-from-dad"), "父亲困境与一百万元之间必须隔着正常问答，不能把矛盾贴脸摆出来");
  assert(packet.turns.findIndex((turn) => turn.id === "which-dad") < packet.turns.findIndex((turn) => turn.id === "low-standards"), "父亲钱源的含糊反应之后，才能继续问收入与年龄条件");
  assert(packet.turns.findIndex((turn) => turn.id === "low-standards") < packet.turns.findIndex((turn) => turn.id === "relationship-pace"), "低条件之后必须先回到正常恋爱节奏，不能立刻审问婚育");
  assert(packet.turns.findIndex((turn) => turn.id === "small-circle") < packet.turns.findIndex((turn) => turn.id === "ordinary-match"), "生活圈问答必须自然带出主播提供普通对象");
  assert(!packet.turns.find((turn) => turn.id === "borrow-host-trust")?.host.includes("为什么真有一个"), "原始问话阶段主播不得提前宣布低条件与实际选择之间的矛盾");

  const confrontationIds = new Set();
  for (const confrontation of packet.confrontations) {
    assert(!confrontationIds.has(confrontation.id), "快案每项对质必须有唯一 id");
    confrontationIds.add(confrontation.id);
    assert((confrontation.basisTurnIds ?? []).length >= 2, "每项对质必须引用至少两处已播原话");
    assert((confrontation.basisTurnIds ?? []).every((turnId) => packet.turns.some((turn) => turn.id === turnId)), "对质不得引用麦外信息");
    const lines = quickConfrontationLines(confrontation);
    assert(lines.length >= 2 && lines[0]?.role === "host" && lines.some((line) => line.role === "caller"), "每项对质都必须由主播发问并包含来电人回应");
    assert(lines.every((line, index) => line.text && ["host", "caller"].includes(line.role) && (index === 0 || line.role !== lines[index - 1].role)), "多轮对质必须逐句交替说话");
  }
  const twoFathers = packet.confrontations.find((item) => item.id === "two-fathers");
  const twoFatherLines = quickConfrontationLines(twoFathers);
  assertEqual(twoFatherLines.length, 6, "买房钱源必须经过坚持称呼、收窄问题、最小承认和关系转题三轮攻防");
  assertIncludes(twoFatherLines[0]?.text, "给钱的到底是不是你亲爸", "主播必须当面问清两个爸爸是否为同一人");
  assertIncludes(twoFatherLines[1]?.text, "为什么非要分得这么清", "来电人首问必须用长期父女称呼反问，不能立刻交出核心答案");
  assertIncludes(twoFatherLines[2]?.text, "是不是你亲生父亲", "主播必须把模糊称呼收窄为只能回答的是非问题");
  assertIncludes(twoFatherLines[3]?.text, "不是亲爸", "来电人被收窄以后必须作出最小承认");
  assertIncludes(twoFatherLines[3]?.text, "跟亲爸有什么区别", "来电人承认以后必须立刻淡化称呼差别");
  assertIncludes(twoFatherLines[4]?.text, "他到底是你什么人", "主播必须继续追问一百万元给款者的真实关系");
  assertIncludes(twoFatherLines[5]?.text, "这是我的私事", "来电人必须用隐私守住真实关系");
  assertIncludes(twoFatherLines[5]?.text, "不是我偷的抢的", "来电人必须把关系问题转移成钱款是否合法和房屋归属");
  const fertilitySlip = packet.confrontations.find((item) => item.id === "fertility-slip");
  const fertilityLines = quickConfrontationLines(fertilitySlip);
  assertEqual(fertilityLines.length, 4, "婚育疑点必须拆成否认、主播短追问、最小承认两个来回");
  assertIncludes(fertilityLines[0]?.text, "还有一句，我刚才没接", "主播必须明确把首轮暂未追问的不能生育例子留到对质阶段");
  assertIncludes(fertilityLines[0]?.text, "他有钱了会不会变心", "婚育回问必须先说明这个举例为什么反常，再追问检查结果");
  assertIncludes(fertilityLines[1]?.text, "你怎么能这么问", "来电人第一次被问婚育疑点时必须先反驳提问");
  assertEqual(fertilityLines[2]?.text, "那到底有没有嘛？", "来电人只否认提问方式时，主播必须补一句短追问");
  assertIncludes(fertilityLines[3]?.text, "我以前确实查过", "来电人只能在主播短追问后首次承认做过检查");
  assertIncludes(fertilityLines[3]?.text, "自然怀孕的机会低一点", "回问必须拿到她个人确有生育问题的最小确认");
  const hiddenStandards = packet.confrontations.find((item) => item.id === "hidden-standards");
  const hiddenStandardLines = quickConfrontationLines(hiddenStandards);
  assertIncludes(hiddenStandardLines.map((line) => line.text).join(" "), "总价两百万", "口头低要求对质必须把房价和分担房贷诉求带回现场");
  assertIncludes(hiddenStandardLines.map((line) => line.text).join(" "), "没把真要求放在前面", "主播必须当面指出口头低要求与真实筛选标准的差别");
  assertIncludes(hiddenStandardLines.map((line) => line.text).join(" "), "谁会故意找差的", "来电人被问穿后应露出真实偏好，而不是突然认错");
  const usefulSoftTalk = packet.confrontations.find((item) => item.id === "useful-soft-talk");
  const softTalkLines = quickConfrontationLines(usefulSoftTalk);
  assertIncludes(packet.issueOptions.find((item) => item.id === "soft-talk")?.label, "是不是分手的根本原因", "最后一个问题方向必须追分手根因，不能只判断她会不会说好听话");
  assertIncludes(softTalkLines.map((line) => line.text).join(" "), "根本原因真是你不会说好听话吗", "主播必须把表达能力继续追到分手根因");
  assertIncludes(softTalkLines.map((line) => line.text).join(" "), "我脾气也不好", "来电人被追问后必须交出比不会哄人更深一层的关系问题");
  assertIncludes(softTalkLines.map((line) => line.text).join(" "), "你非要算我骗你", "最后一次对质要让来电人顾左右而言他并产生明显反差");

  let quick = initialQuickDetectiveState(packet);
  quick = { ...quick, scene: "transcript" };
  const firstPage = quickDetectiveTranscriptHtml(packet, quick);
  assertIncludes(firstPage, packet.turns[0].host, "回放页必须先显示当前主播问题");
  assert(!firstPage.includes(packet.turns[0].caller), "主播问题页不能提前显示来电人的回答");
  assert(!firstPage.includes(packet.turns[1].caller), "一页只能出现当前一组问答");
  assert(!/第\s*\d+\s*组\s*[/／]\s*\d+/.test(firstPage), "快案问答页不得显示第几屏或总屏数");
  quick = advanceQuickTranscript(packet, quick);
  const firstReplyPage = quickDetectiveTranscriptHtml(packet, quick);
  assertIncludes(firstReplyPage, packet.turns[0].caller, "下一拍才显示来电人的回答");
  assert(!firstReplyPage.includes(packet.turns[0].host), "来电人回答页不能重复显示主播问题");
  while (quick.scene === "transcript") quick = advanceQuickTranscript(packet, quick);
  assertEqual(quick.scene, "issueSelection", "听完第一轮信息后必须先让玩家判断矛盾方向，不能直接播放答案");
  const issueSelection = quickDetectiveIssueSelectionHtml(packet, quick);
  assertIncludes(issueSelection, "先追问哪个矛盾点", "每轮信息结束后必须出现玩家判断层");
  assert(!issueSelection.includes("只选怀疑的方向") && !issueSelection.includes("问成一句完整的话") && !issueSelection.includes("追问方向"), "快案选择页不得用教程句重复解释按钮行为");
  assert(!/\d+\s*[/／]\s*\d+/.test(issueSelection), "快案判断层不得用轮次或完成数量催促玩家");
  assert(!issueSelection.includes(quickConfrontationLines(packet.confrontations[0])[0]?.text), "矛盾方向选择页不得提前显示主播的完整答案句");
  const decoy = quickIssueOptionsForRound(packet, quick).find((item) => !item.confrontationId);
  quick = applyQuickIssueSelection(packet, quick, decoy.id);
  assertEqual(quick.scene, "issueSelection", "只可存疑但尚不矛盾的方向不得触发主播揭底");
  assertIncludes(quickDetectiveIssueSelectionHtml(packet, quick), decoy.missLine, "无充分依据时应给中性重试说明");
  const firstValidIssue = quickIssueOptionsForRound(packet, quick).find((item) => item.confrontationId);
  const interruptedValidAttempt = {
    ...quick,
    attemptedIssueIds: [...quick.attemptedIssueIds, firstValidIssue.id],
    scene: "issueSelection",
    activeConfrontationId: null
  };
  const recoveredConfrontation = applyQuickIssueSelection(packet, interruptedValidAttempt, firstValidIssue.id);
  assertEqual(recoveredConfrontation.scene, "confrontation", "成立方向中途恢复后必须可以重新进入对质，不能出现按钮可点但流程不动");
  const solvedFirstRoundSave = normalizeQuickDetectiveState({
    ...quick,
    scene: "issueSelection",
    resolvedConfrontationIds: [...(quickDisclosureRounds(packet)[0]?.requiredConfrontationIds ?? [])]
  }, packet);
  assertEqual(solvedFirstRoundSave.scene, "transcript", "旧存档若已问清当前段，恢复时必须自动继续下一段陈述");
  assertEqual(solvedFirstRoundSave.roundIndex, 1, "旧存档恢复不得停在已经问清的判断页");
  const playedConfrontations = [];
  while (quick.scene !== "verdict") {
    if (quick.scene === "transcript") {
      while (quick.scene === "transcript") quick = advanceQuickTranscript(packet, quick);
    }
    const roundIssues = quickIssueOptionsForRound(packet, quick)
      .filter((item) => item.confrontationId && !quick.resolvedConfrontationIds.includes(item.confrontationId));
    assert(roundIssues.length, "每一轮必须至少留下一个尚未问清的成立方向");
    for (const issue of roundIssues) {
      const confrontation = packet.confrontations.find((item) => item.id === issue.confrontationId);
      quick = applyQuickIssueSelection(packet, quick, issue.id);
      assertEqual(quick.scene, "confrontation", "玩家选中成立的矛盾方向后才能进入主播对质");
      const lines = quickConfrontationLines(confrontation);
      for (const [lineIndex, line] of lines.entries()) {
        const confrontationHtml = quickDetectiveConfrontationHtml(packet, quick);
        assertIncludes(confrontationHtml, line.text, "对质必须按编剧登记顺序逐句播放");
        assertIncludes(confrontationHtml, `data-quick-speaking=\"${line.role}\"`, "对质每一拍必须高亮当前说话人");
        if (lineIndex + 1 < lines.length) assert(!confrontationHtml.includes(lines[lineIndex + 1].text), "当前对质页不能提前显示下一句");
        quick = advanceQuickConfrontation(packet, quick);
      }
      playedConfrontations.push(confrontation.id);
      if (quick.scene === "transcript" || quick.scene === "verdict") break;
    }
  }
  assertEqual(playedConfrontations.length, packet.confrontations.length, "分轮流程必须实际播放每一项对质");
  assertEqual(quick.scene, "verdict", "四项对质完成后必须进入主播最后一句");
  const verdict = quickDetectiveVerdictHtml(packet, quick);
  assertIncludes(verdict, packet.ending.summaryPages[0].lines[0].text, "最后判断必须先显示主播本人说出的总结");
  assertIncludes(verdict, "结束通话", "主播必须先结束连线，再进入麦后的结案复盘");
  assert(!verdict.includes("quick-boundary-grid"), "快案结案不得再用事实清单卡代替主播说话");
  assert(!verdict.includes(packet.ending.confirmedTitle), "确认项只能作为制作边界，不能在玩家结案页静态展示");
  assert(!verdict.includes("返回案件选择"), "主播总结尚未逐句说完时不能提前显示结案操作");
  const verdictLineCount = packet.ending.summaryPages.reduce((sum, page) => sum + (page.lines?.length ?? 0), 0);
  for (let index = 1; index < verdictLineCount; index += 1) quick = advanceQuickVerdict(packet, quick);
  assertIncludes(quickDetectiveVerdictHtml(packet, quick), "返回案件选择", "主播总结逐句说完以后才能返回带完成标记的案件选择页");
  const spokenSummary = packet.ending.summaryPages.flatMap((page) => page.lines ?? []).map((line) => line.text).join(" ");
  assertIncludes(spokenSummary, "这个忙我不能帮", "主播必须依据风险作出明确行动决定");
  assert(!spokenSummary.includes("原因我不能猜") && !spokenSummary.includes("关系走深了再讲"), "婚育结论不得用原因未知或披露时点撤回已经作出的判断");
  assertIncludes(spokenSummary, "电话挂了", "拒绝帮助以后必须另起一段复盘已经成立的矛盾");
  assertIncludes(spokenSummary, "概率最高", "主播必须把目前最能解释全部矛盾的经历版本告诉玩家");
  assertIncludes(spokenSummary, "长期处在一段经济交换关系里", "高概率版本必须正面判断经济交换关系，不能退回含糊的年长男性照顾");
  assertIncludes(spokenSummary, "长期叫对方“爸爸”", "主播必须说出长期称呼及其年龄含义，不能捏造没有问过的拒答");
  assertIncludes(spokenSummary, "对方年纪肯定不小了", "高概率版本必须把称呼带出的年龄判断说完整");
  assertIncludes(spokenSummary, "一个做销售的，怎么可能不会给别人提供情绪价值嘛", "主播必须用来电人的销售职业反驳不会哄人的自我包装");
  assertIncludes(spokenSummary, "我也有兼职红娘的业务", "主播必须说明来电人为什么会找他做对象背书");
  assertIncludes(spokenSummary, "她那位“爸爸”还在不在，我也不知道", "主播拒绝背书时必须保留原有经济交换关系是否持续的现实顾虑");
  assertIncludes(spokenSummary, "她下意识也好，有意也好", "婚育总结必须指出来电人主动举例本身就是泄露");
  assertIncludes(spokenSummary, "他有钱以后会不会有新欢", "婚育总结必须给出一般人更自然的伴侣变心例子作为对照");
  assertIncludes(spokenSummary, "明显是她自己有这方面的问题", "主播必须根据主动举例和回问承认作出明确判断");
  assert(!spokenSummary.includes("原来那位“爸爸”是不是已经退出，她没有讲"), "主播不得用作者式退出判断替代自己的现实顾虑");
  assert(!spokenSummary.includes("不肯说两个人到底是什么关系"), "主播没有具体追问双方关系，结案不得捏造她拒绝回答该问题");
  assert(!spokenSummary.includes("我只能说很像") && !spokenSummary.includes("不能把这个词坐实"), "主播已经作出判断后不得用免责话术立即撤回");
  assertIncludes(spokenSummary, "想在我们直播间骗人，不可能", "最终行动决定必须用主播口语直接拒绝来电人的欺骗和背书诉求");
  assertIncludes(quickDetectiveStageHtml(packet, { scene: "verdict", verdictIndex: 1, verdictLineIndex: 0 }), "结案复盘", "挂断后的矛盾复盘必须有独立舞台状态");
  assertIncludes(quickDetectiveStageHtml(packet, { scene: "verdict", verdictIndex: 2, verdictLineIndex: 0 }), "高概率判断", "高概率故事版本必须有独立舞台状态");
  assert((packet.ending.unknown ?? []).some((item) => item.includes("不能由此推断她的性经历")), "制作边界必须继续禁止把婚育信息升级成性经历事实");
});

test("QUICK-003", "second quick case reveals new contradictions only after the previous confrontation", () => {
  const quickCases = quickDetectiveCasesFor("steam-demo-01");
  const packet = quickCases.find((item) => item.id === "02-one-missed-message");
  assert(packet, "试玩包必须加载第二宗快案");
  assertEqual(quickCases.map((item) => item.caseNumber).join("|"), "01|02", "快案选择页必须按 manifest 保持 01、02 的稳定顺序");
  assertEqual(packet.caseNumber, "02", "第二宗快案必须使用稳定编号 02");
  assertEqual(packet.premise, "一个姑娘打进电话，想问问她和男朋友接下来该怎么办。", "第二宗快案入口只能交代表面求助，不得提前剧透学历、婚介、创业者、送花和失联原因");
  assertEqual(packet.turns.length, 29, "第二宗快案必须留出三轮询问，让双方条件、花与包、两批朋友圈、消息和同行人按阶段露出");
  assertEqual(quickDisclosureRounds(packet).length, 3, "第二宗快案必须分为初问、改口和朋友圈深究三轮");
  assertEqual(packet.confrontations.length, 6, "第二宗快案必须让主播问回六处彼此不同的前后矛盾");
  assert(packet.issueOptions.length > packet.confrontations.length, "第二宗快案必须混入合理但不能互证的方向，不能直接把六个矛盾答案交给玩家");
  assert(packet.issueOptions.filter((item) => !item.confrontationId).length >= 2, "第二宗快案至少需要两个合理干扰方向");
  assert(packet.issueOptions.every((item) => item.label && !/[？?。！!]$/.test(item.label)), "第二宗快案按钮只能写怀疑方向，不能显示主播完整问句");
  assertEqual(packet.confrontations.filter((item) => item.revealTransition).length, 1, "第二宗快案只能给最大反转播放一次重击过场");
  assertEqual(packet.confrontations.find((item) => item.revealTransition)?.id, "third-person-at-table", "第二宗快案的重击必须落在姐妹小聚出现第三个人的整体重估上");
  assertEqual(packet.confrontations.find((item) => item.revealTransition)?.revealTransition?.lineIndex, 4, "第三人重击必须等来电人承认男性在场以后再播放，不能由动画提前给答案");
  assertIncludes(packet.presentation?.caller?.artSrc, "caller-zhou-female-pixel", "第二宗快案必须使用自己的匿名女性来电人立绘，不能串用第一宗角色");
  assertIncludes(quickDetectiveCaseSelectHtml(quickCases, []), "CASE</small><b>02", "案件选择页必须实际渲染 CASE 02");
  assertIncludes(packet.sourceBoundary, "BV1iGKG65EJ3", "第二宗快案必须登记公开素材来源边界");
  assertIncludes(packet.sourceBoundary, "连续两晚 KTV 与酒吧", "来源边界必须登记原视频中不可替换的连续两晚因果节点");
  assertIncludes(packet.sourceBoundary, "男性同行者", "来源边界必须登记改变男方判断的同行人节点");
  assertIncludes(packet.sourceBoundary, "原创改写", "来源边界必须声明人物细节和全部台词已经重新创作");
  assertIncludes(packet.sourceBoundary, "不把异性在场单独写成越界证据", "第二宗快案不得把男性在场直接升级成未证实行为");

  const turnIds = new Set(packet.turns.map((turn) => turn.id));
  for (const confrontation of packet.confrontations) {
    assert((confrontation.basisTurnIds ?? []).length >= 2, `${confrontation.id} 必须引用至少两处已经播出的原话`);
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
  assertIncludes(originalTranscript, "连前面几条一起截给我看看", "展示需求对质前必须先由主播取得来电人同意并收到对应朋友圈截图");
  assertIncludes(originalTranscript, "旁边那个新包也是这个新男友送的吧", "主播必须在收到朋友圈截图以后，才从图片里的包追问礼物来源");
  assertIncludes(originalTranscript, "我在柜台前多看了几眼。他后来自己买的", "包必须由来电人亲口确认是男方所送，并保留她‘没有开口要’的自利辩解");
  assertIncludes(originalTranscript, "现在朋友圈三天可见", "第二宗快案必须说明主播为何无法直接查看旧朋友圈");
  assertIncludes(originalTranscript, "你这边看不到以前的。我自己还能翻", "三天可见以后，旧动态只能由来电人自己翻出并截屏提供");
  assertIncludes(originalTranscript, "吃饭、演唱会这些", "第一批朋友圈截图必须在对质前露出她平时主动展示的内容");
  assertIncludes(originalTranscript, "十一点五十二，他问我喝得怎么样", "六分钟消息差必须先在原始连线里公平出现");
  assert(!originalTranscript.includes("其实是三个人"), "第三名同行人不能在玩家质问前由来电人主动交代");
  assertIncludes(originalTranscript, "也不全是我们点的", "进入第二轮前必须先露出酒并非两个人所点的可追问缺口");
  assertIncludes(originalTranscript, "后来他追着问，我才把那个人也说了", "第三轮必须先留下男方如何发现第三个人的可追问缺口");
  assertIncludes(originalTranscript, "那是八号的照片", "公开动态的拍摄日期必须在结案前由来电人自己说出");
  assertIncludes(originalTranscript, "八号 KTV，九号酒吧，连续两晚", "连续两晚必须在原始连线末段明确对齐，不能留给结案凭空宣布");
  assertIncludes(originalTranscript, "凌晨五点十七分", "第三轮必须由主播在来电人发来的截图里看到深夜时间，不能在结案凭空宣布经常夜不归宿");
  assertIncludes(originalTranscript, "你发来的截图里，近两个月", "第二批朋友圈材料必须明确来自来电人发来的截图，不能写成主播直接翻她的主页");
  assert(!originalTranscript.includes("后台收到了。往前两个月翻"), "朋友圈三天可见以后，主播不得表现成能直接翻看来电人的历史动态");
  assertIncludes(originalTranscript, "一大片纹身", "纹身只作为质问后自然出现的人物背景，不应做成玩家必选罪证");
  assert(!packet.issueOptions.some((item) => item.id.includes("tattoo")), "纹身不得成为玩家需要判定的矛盾方向");
  assertIncludes(packet.confrontations.find((item) => item.id === "third-person-at-table")?.logicContract?.sourceDoesNotProve, "不自动证明暧昧、出轨", "异性在场必须有明确的不证明边界");
  assert((packet.ending?.unknown ?? []).some((item) => item.includes("是否发生过暧昧")), "结案制作边界必须保留酒局内容未知");
  assert((packet.ending?.summaryPages ?? []).length >= 3, "第二宗快案结尾必须分开结束通话、矛盾复盘和高概率判断");
  const quickTwoRecapPage = packet.ending.summaryPages.find((page) => page.stageLabel === "结案复盘");
  assertEqual(quickTwoRecapPage?.lines?.[0]?.text, "我们来把这次这个连线复个盘。", "第二宗快案挂断后必须用固定口头标记进入主播复盘");
  const spokenSummary = packet.ending.summaryPages.flatMap((page) => page.lines ?? []).map((line) => line.text).join(" ");
  assertIncludes(spokenSummary, "动作倒推发心，逻辑要闭环", "第二宗快案复盘必须落下主播从行为反查真实诉求的固定口头禅");
  assertIncludes(spokenSummary, "八号，她和师姐去 KTV", "结案必须按原始时间线先复盘前一晚，不能只复盘漏回消息");
  assertIncludes(spokenSummary, "三番五次出去喝酒疯玩到深夜，大家也该清楚这个潜在的雷得有多大", "高概率判断必须直接指出长期深夜饮酒对婚恋对象构成的现实风险，不能缩成‘显得不踏实’");
  assert(!spokenSummary.includes("对准备长期相处的人来说，这当然会显得不踏实"), "第二宗快案结案不得恢复成过轻的‘显得不踏实’");
  assertIncludes(spokenSummary, "酒桌上有没有发生别的事，不用猜", "主播必须在不虚构酒局细节的前提下完成判断");
  assertIncludes(spokenSummary, "我说实话，也建议男方退出", "第二宗快案结案必须给出主播明确建议，不能只说男方有理由退出");
  assertIncludes(spokenSummary, "骑驴找马", "第二宗快案结案必须落到她一边寻找供养者、一边继续玩乐的现实判断");
  assertIncludes(spokenSummary, "先找了个条件好的供养者，也不耽误自己继续出去玩", "第二宗快案结案必须直接说清供养与继续玩乐可以同时存在");
  assertIncludes(spokenSummary, "‘深度沟通’和‘情绪价值’，都是借口罢了", "第二宗快案结案必须把来电人反复强调的沟通诉求收束为其自利借口");
  assert(!spokenSummary.includes("到处玩、继续比较") && !spokenSummary.includes("仍在玩和继续比较"), "第二宗快案结案与角色档案不得再把动机写成抽象的‘继续比较’");
  assertIncludes(spokenSummary, "舍不得对方的经济条件", "第二宗快案结案必须说清她仍想复合的经济动机");
  assertIncludes(spokenSummary, "想让我帮她想话术、想办法复合", "第二宗快案结案必须说清来电人希望主播提供的实际帮助");
  assertIncludes(spokenSummary, "没几句是真的", "第二宗快案结案必须直接评价她整通电话里持续改口，不能再用抽象的‘说法站不住’代替");
  assert(!spokenSummary.includes("男方不会提供情绪价值") && !spokenSummary.includes("前后原话放在一起，这个说法站不住"), "第二宗快案结案不得残留报告式的情绪价值与说法站不住表述");
  assertIncludes(spokenSummary, "他信不信、还愿不愿意继续", "第二宗快案通话收尾必须让这次联系同时问清事实接受度和是否继续，不能只让来电人单方面补充");
  assertIncludes(spokenSummary, "别再来回猜了", "第二宗快案通话收尾必须给追回诉求一个可执行的结束点");
  assertIncludes(spokenSummary, "别再遮遮掩掩，拿一个谎话去圆另一个谎话", "第二宗快案通话收尾必须直说连续改口的问题，不能再把整案缩回六分钟消息差");
  assert(!spokenSummary.includes("别再把原因缩回那六分钟"), "第二宗快案结案不得用抽象缩回措辞弱化连续隐瞒");
  const displayConfrontation = quickConfrontationLines(packet.confrontations.find((item) => item.id === "care-or-display"));
  assertEqual(displayConfrontation.length, 6, "展示需求必须经过辩解、截图核对、再次反驳和最小承认三轮攻防");
  assertIncludes(displayConfrontation.map((line) => line.text).join(" "), "朋友圈截图我看了", "主播必须说明自己的判断来自刚收到的截图");
  assertIncludes(displayConfrontation.map((line) => line.text).join(" "), "也收了他送的包", "展示需求对质必须带回朋友圈图片里新发现的包");
  assertIncludes(displayConfrontation.map((line) => line.text).join(" "), "漂亮饭、演唱会", "展示需求必须落到她实际发布的具体内容，不能空说她很受用");
  assertIncludes(displayConfrontation.map((line) => line.text).join(" "), "我们不脱离感情只谈钱", "主播必须在感情与物质同时成立时使用固定判断口头禅");
  const discoveryConfrontation = quickConfrontationLines(packet.confrontations.find((item) => item.id === "how-he-knew"));
  assertEqual(discoveryConfrontation.length, 4, "男方发现第三个人必须经过追问、解释和最小承认，不能用反馈文案代替对质");
  assertIncludes(discoveryConfrontation.map((line) => line.text).join(" "), "这个‘他’是谁", "男方的怀疑必须来自她说漏的具体代词");
  const nightlifeConfrontation = quickConfrontationLines(packet.confrontations.find((item) => item.id === "nightlife-pattern"));
  const nightlifeDialogue = nightlifeConfrontation.map((line) => line.text).join(" ");
  assertIncludes(nightlifeDialogue, "男的女的都有", "夜生活对质必须由来电人自己承认同行者来自不同性别，不能由主播凭空定性");
  assertIncludes(nightlifeDialogue, "读研以后聚会一直不少", "夜生活对质必须把近两个月截图追到更长期的生活习惯");
  assertIncludes(nightlifeDialogue, "婚介跟他说你生活简单", "主播必须把长期夜场与婚介版本直接对照，不能只谈一次喝多");
  assertIncludes(nightlifeDialogue, "到现在你还往‘偶尔一次’上说", "夜生活对质必须指出来电人在被追问后仍继续缩小说法");
  assertIncludes(nightlifeDialogue, "男方看到了当然不可能信啊", "夜生活对质必须落到男方为何不再相信，而不是抽象说两个版本不同");
  assert(!nightlifeDialogue.includes("男方看到的当然不是同一个说法"), "夜生活对质不得残留抽象的版本比较句");
  assert(!packet.issueOptions.some((item) => item.id === "bar-judgment" || item.label.includes("去酒吧本身")), "第二宗快案不得再用去酒吧是否正确充当无效选项");
  assertIncludes(packet.issueOptions.find((item) => item.id === "how-he-knew")?.label, "男方怎么发现", "第三轮必须把无效价值判断换成可调查的发现来源");
  const apologyConfrontation = quickConfrontationLines(packet.confrontations.find((item) => item.id === "apology-and-post"));
  const apologyDialogue = apologyConfrontation.map((line) => line.text).join(" ");
  assertIncludes(apologyDialogue, "哪知道那是八号拍的", "道歉动态对质必须按男方当时能看到的信息说话，不能假定他知道照片拍摄日期");
  assertIncludes(apologyDialogue, "对方又不傻", "主播必须直接指出道歉以后继续发喝酒照片缺乏说服力，不能用抽象总结代替人话");
  assert(!apologyDialogue.includes("日期能对上") && !apologyDialogue.includes("道歉变轻"), "道歉动态对质不得退回错误日期判断或 AI 式抽象措辞");

  let state = { ...initialQuickDetectiveState(packet), scene: "transcript" };
  while (state.scene === "transcript") state = advanceQuickTranscript(packet, state);
  assertEqual(state.roundIndex, 0, "第一轮听完必须停在初问阶段");
  assertEqual(quickIssueOptionsForRound(packet, state).map((item) => item.id).join("|"), "emotion-or-display|age-gap|missed-message-state|founder-busy", "第一轮不能提前出现第三人和朋友圈问题");
  for (const issueId of ["emotion-or-display", "missed-message-state"]) {
    state = applyQuickIssueSelection(packet, state, issueId);
    while (state.scene === "confrontation") state = advanceQuickConfrontation(packet, state);
  }
  assertEqual(state.scene, "transcript", "第一轮两处问题问完后必须回到连线继续追，而不是继续弹出后面的答案");
  assertEqual(state.roundIndex, 1, "第一轮对质应迫使来电人进入第二版说法");
  while (state.scene === "transcript") state = advanceQuickTranscript(packet, state);
  assertEqual(quickIssueOptionsForRound(packet, state).map((item) => item.id).join("|"), "third-person", "第二轮只能追酒桌人数，不能提前开放男方的发现来源或朋友圈结论");
  state = applyQuickIssueSelection(packet, state, "third-person");
  while (state.scene === "confrontation") state = advanceQuickConfrontation(packet, state);
  assertEqual(state.scene, "transcript", "第三个人问出来以后必须继续看她发来的朋友圈截图");
  assertEqual(state.roundIndex, 2, "第三个人出现后才能进入第三轮");
  while (state.scene === "transcript") state = advanceQuickTranscript(packet, state);
  assertEqual(quickIssueOptionsForRound(packet, state).map((item) => item.id).join("|"), "nightlife-pattern|how-he-knew|apology-post", "第三轮才允许追男方的发现来源、夜生活频率和道歉当天的动态");
  for (const issueId of ["nightlife-pattern", "how-he-knew", "apology-post"]) {
    state = applyQuickIssueSelection(packet, state, issueId);
    while (state.scene === "confrontation") state = advanceQuickConfrontation(packet, state);
  }
  assertEqual(state.scene, "verdict", "第二宗快案六处对质完成后必须进入主播结案，不能卡在选择页");
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
  assertEqual(audioScenePlan({ scene: "overnightCallback" }).bgmCueId, "bgm.callback-return", "第二夜回拨必须使用回拨 cue");
  assertEqual(audioScenePlan({ scene: "overnightNight2" }).bgmCueId, "bgm.callback-return", "进入第二夜连续对白后不得切回第一夜 BGM");
  assertEqual(audioScenePlan({ scene: "documentReconcile" }).bgmCueId, "bgm.callback-return", "第二夜核对材料时必须保持回拨 BGM");
  assertEqual(audioScenePlan({ scene: "liveCounterBeat" }).bgmCueId, "bgm.callback-return", "第二夜实时反压必须保持回拨 BGM");
  assertEqual(audioScenePlan({ scene: "overnightNight2", pressureLevel: "low" }).bgmCueId, "bgm.pressure-stem", "第二夜耐心偏低时仍允许压力层覆盖回拨底乐");
  assertEqual(audioScenePlan({ scene: "careChoice" }).bgmCueId, "bgm.recap-afterhours", "结案关怀选择必须留在单案回看音乐段");
  assertEqual(audioScenePlan({ scene: "caseBridge" }).bgmCueId, "bgm.recap-afterhours", "案间名言引页必须延续收麦余韵，不能突然切回直播 BGM");
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
  assert(unlockedInvestigationEntriesForState(selectorState, brief).length >= 1, "回流解锁必须能脱离 app.js 计算");
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
  assertEqual(materialPressureSignal({ correct: false }), "drift", "材料误指必须生成结构化跑偏状态");
  assertEqual(questionPressureReaction({ answer: "我只是替他说一句。", routeTone: "softening" }), "", "普通绕路追问不应生成空泛现场氛围句");
  assertIncludes(materialPressureReaction({ correct: true, pick: { label: "付款状态", feedback: "缺的这一页才决定钱去了哪里。" } }, { title: "审批图", material: "付款和收款账户没露出来。" }), "缺的这一页", "材料命中必须优先使用内容包写好的反馈");
  assertIncludes(materialPressureReaction({ correct: false, pick: { label: "截图边角" } }, { title: "截图" }), "撑不住", "材料误指必须说清这一处撑不住，不能只写抽象氛围");
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
  assertEqual(materialProfile.label, "圈回来了", "故事集终局必须汇总材料圈点命中和误指");
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
      highRevealTone: "你没有急着判人，几张图和几句话都被你接住了。"
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

test("INPUT-001", "keyboard and gamepad navigation has pure focus rules", () => {
  assertEqual(keyboardNavigationIntent("Enter"), "confirm", "Enter 必须确认当前按钮");
  assertEqual(keyboardNavigationIntent("ArrowRight"), "next", "右方向键必须移动到下一个按钮");
  assertEqual(keyboardNavigationIntent("a"), "previous", "WASD/方向键必须共用上一项/下一项规则");
  assertEqual(keyboardNavigationIntent("Tab"), "review", "Tab 必须进入回看意图");
  assertEqual(keyboardNavigationIntent("Escape"), "back", "Esc 必须进入返回意图");
  assertEqual(nextFocusIndex({ currentIndex: 1, total: 3, direction: 1 }), 2, "焦点向前移动必须落到下一个按钮");
  assertEqual(nextFocusIndex({ currentIndex: 2, total: 3, direction: 1 }), 0, "焦点必须能从末尾循环到开头");
  assertEqual(nextFocusIndex({ currentIndex: -1, total: 3, direction: -1 }), 2, "没有当前焦点时向上/左应落到末尾");
  assertEqual(gamepadAxisDirection({ axes: [0.7, 0], lastMoveAt: 0, now: 500 }), 1, "左摇杆右推必须生成下一项方向");
  assertEqual(gamepadAxisDirection({ axes: [-0.7, 0], lastMoveAt: 0, now: 500 }), -1, "左摇杆左推必须生成上一项方向");
  assertEqual(gamepadAxisDirection({ axes: [0.2, 0], lastMoveAt: 0, now: 500 }), 0, "摇杆小幅漂移不能移动焦点");
  assertEqual(gamepadAxisDirection({ axes: [0.8, 0], lastMoveAt: 450, now: 500 }), 0, "摇杆移动必须有冷却，避免一帧扫过多个按钮");
  const inputAppSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const gamepadHandler = inputAppSource.slice(inputAppSource.indexOf("function handleGamepadInput"), inputAppSource.indexOf("function currentDialogueAdvance"));
  assert(gamepadHandler.indexOf("const dialogue = currentDialogueAdvance()") < gamepadHandler.indexOf("const focusedButton"), "手柄 A 键必须先推进正在播放的 AVG 对白，不能误点全局按钮");
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
});

test("MATERIAL-002", "material inspection renders as an in-document markable board", () => {
  const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
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
  assertIncludes(screenHtml, "evidence-workbench", "材料检视页面 helper 必须保留材料操作台");
  assertIncludes(screenHtml, "圈哪一处", "材料检视候选区不能写成工具名，必须提示玩家圈内容");
  assertIncludes(screenHtml, "咨询者", "材料圈点后的 reactionLine 必须以咨询者对话气泡渲染");
  assertIncludes(screenHtml, "这页我刚才没敢细看。", "材料圈点后的 reactionLine 必须出现在材料结果页");
  assertIncludes(screenHtml, "……我再说一遍，那页不是没看，是没敢看。", "材料命中后的 revisedVersion 必须作为咨询者气泡出现在反应台词之后");
  assert(!screenHtml.includes("荧光笔"), "材料检视候选区不能继续显示不明确的工具名");
  assertIncludes(screenHtml, "上一问", "材料检视页面 helper 必须能接入上一问回看");
  assert(!stylesSource.includes("evidence-check-card"), "材料操作台上线后不能留下旧材料段落卡样式");
});

test("MATERIAL-003", "material board uses distinct visual layouts by material type", () => {
  const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
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

  const afterHangup = {
    ...afterFirstExchange,
    caseNights: {
      [brief.id]: {
        hangupDone: true
      }
    }
  };
  const fullFlowReceived = unlockedMaterialProfile({ state: afterHangup, brief });
  assertEqual(fullFlowReceived.count, 2, "挂断后补发的完整流水必须在真正收到后加入材料栏");
  assertEqual(fullFlowReceived.label, brief.storyClueObject, "挂断前不能把后补的完整流水冒充开场材料");

  const emptyDeck = liveControlDeckHtml({ material: "", materialCount: 0 });
  assertIncludes(emptyDeck, "尚未收到", "材料未送达时控台必须明确显示空状态");
  assert(!liveFrameHtml({ material: "", materialCount: 0 }).includes("data-material-open"), "未收到材料时不能渲染“材料 1”入口");
  assertIncludes(liveFrameHtml({ material: "社保断缴时间", materialCount: 1 }), "<b>1</b>", "第一份材料收到后才显示材料数量");
});

test("UI-004", "inline transition buttons keep a normal CTA shape", () => {
  const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
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
    assert((brief.investigationHooks ?? []).length >= 1, `第 ${index + 1} 案必须有至少一个案后回流材料`);
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
  assertEqual(pages.length, 3, "收麦回看必须压缩成三页");
  assertIncludes(pages[1], "事实边界", "第二页必须完成事实边界放置");
  assert(pages[2].indexOf("后续回拨") < pages[2].indexOf("麦外来信"), "末页必须先交代后续回拨，再显示麦外来信");
  assertIncludes(pages[2], "连线收住", "末页必须保留事实边界揭示与收束");
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
  const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
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
  const helperClosedHtml = sceneQuestionMenuHtml(4, directionScene, [], { helper: CONTENT_HELPER_NPCS["v-bro"], helperRevealed: false });
  const helperOpenHtml = sceneQuestionMenuHtml(4, directionScene, [], { helper: CONTENT_HELPER_NPCS["v-bro"], helperRevealed: true });
  assertIncludes(questionHtml, "scene-question-group", "当前节点必须把所有主播问题放进同一面板");
  assertIncludes(questionHtml, "data-scene-dialogue=\"2:0\"", "随意提问必须有独立事件入口，不结束当前段落");
  assertIncludes(questionHtml, "data-scene-question=\"2:1\"", "关键追问仍要保留可点击数据");
  assertIncludes(questionHtml, "你们平时谁管钱多一点？", "有 casualQuestions 时普通区必须渲染署名闲聊层");
  assertIncludes(questionHtml, "question-section-dialogue", "补问背景必须有独立视觉分区");
  assertIncludes(questionHtml, "补问背景", "自由补问必须使用玩家可理解的场内标签");
  assertIncludes(questionHtml, "question-section-key", "推进原话必须有独立视觉分区");
  assertIncludes(questionHtml, "追原话", "推进选择必须使用场内语义，不能写设计师术语");
  assertIncludes(questionHtml, "消耗听众耐心", "追问区必须给出非剧透成本提示");
  assertIncludes(questionHtml, "补问 · 不收束", "每个背景补问按钮必须直接说明不会收束本句");
  assertIncludes(questionHtml, "收束 · 未命中 −1 耐心", "每个正式追问按钮必须直接说明推进与失败成本");
  assertIncludes(askedQuestionHtml, "已问过", "已使用的背景补问必须把按钮代价位改成完成态");
  assertIncludes(directionHtml, "八万里没说清的三万五", "方向式节点必须显示玩家选择的疑点短标签");
  assert(!directionHtml.includes("剩下那三万五，你问过他是什么吗？"), "方向式节点在选择前不能暴露主播完整句子");
  assertEqual(playerQuestionLabel(directionScene.questionOptions[0]), "八万里没说清的三万五", "玩家可见标签必须优先使用 suspicionLabel");
  assert(!helperClosedHtml.includes("完整问句") && !helperClosedHtml.includes("按下以后") && !helperClosedHtml.includes("疑点方向"), "主案选择页不得用教程句或重复标签解释方向按钮");
  assert(!helperClosedHtml.includes("由林旭阳开口"), "方向式选择不得把玩家写成替主播点台词的人");
  assert(!helperClosedHtml.includes("求助 V哥"), "V哥隐藏期间不得显示求助入口");
  assert(!helperClosedHtml.includes(directionScene.helperHint), "V哥隐藏期间不得泄露提示正文");
  assert(!helperOpenHtml.includes(directionScene.helperHint), "即使旧存档记录提示已展开，V哥隐藏期间也不得重新露出");
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
  assertIncludes(askedQuestionHtml, `data-scene-dialogue="2:0"`, "问过的非推进问题仍应保留原问句和禁用入口");
  assertIncludes(appSource, "handleSceneDialogueButton", "随意提问必须有事件入口，不能和关键追问混成一个按钮组");
  assertIncludes(appSource, "state.lastPressureSignal = questionPressureSignal", "随意提问也必须影响来电人防备，避免免费扫雷");
  assertIncludes(appSource, "renderEvidenceCheck", "追问结束后必须保留材料检视阶段，避免玩法退回纯问答");
  assertIncludes(appSource, "evidenceCheckPicks", "材料检视选择必须进入存档和复盘状态");
  assertIncludes(appSource, "spend: !option.contradiction", "关键追问命中不能消耗听众忍耐，忍耐条应惩罚绕问和错问");
  assertIncludes(materialSource, "spend: !correct", "材料检视圈中不能消耗听众忍耐，误指才扣");
  assertIncludes(storyPackSummarySource, "storyPackClosingLine", "故事集终局小字必须按本局表现生成，不能写成玩法说明");
  assertIncludes(storyPackSummarySource, "storyCallCountText(briefs.length)", "故事集终局正文必须按实际案数生成，不能写死四路麦");
  assertIncludes(storyPackCompleteViewSource, "callCountText", "故事集终局 UI 必须接收实际案数称呼，不能写死四案");
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
  assertIncludes(appSource, "caseBridge", "两案之间必须经过独立名言引页");
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
  assertIncludes(storyPackCompleteViewSource, "材料圈点", "终局 UI 必须展示材料圈点余味");
  assertIncludes(storyPackCompleteViewSource, "收麦原话", "终局 UI 必须展示原话选择余味");
  assertIncludes(storyPackCompleteViewSource, "这晚翻过", "终局 UI 必须展示故事包物件余味");
  assertIncludes(storyPackCompleteViewSource, "weeklyProfileLine", "故事集终局结果卡必须能由纯 UI 模块复用 profile 行");
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
  assertIncludes(packageSource, "\"smoke:browser\"", "大测试必须有真实浏览器回放 smoke 入口");
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
  assertIncludes(buildStaticSource, 'resolve(root, "assets")', "H5 构建必须递归带上音频资产目录");
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
  assertIncludes(desktopMainSource, "requestSingleInstanceLock", "桌面壳必须避免重复启动多个实例抢存档");
  assertIncludes(desktopPreloadSource, "livestreamDetectiveDesktop", "preload 必须暴露平台桥给游戏运行时");
  assertIncludes(desktopPreloadSource, "saveFiles", "preload 必须暴露文件存档桥");
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
  assertIncludes(buildPlayableSource, 'copyTree(resolve(root, "assets")', "离线 playable 必须递归带上音频资产目录");
  assertIncludes(browserSmokeSource, "accounting-support", "浏览器回放必须覆盖周会计档案室+房租账页白天路线");
  assertIncludes(browserSmokeSource, "support-document", "浏览器回放必须覆盖房租账页+独立审流水路线");
  assertIncludes(browserSmokeSource, "day map must not allow skipping the required two daytime actions", "浏览器回放必须覆盖白天调查的两处最低门槛");
  assertIncludes(browserSmokeSource, "sceneMode: \"outer\"", "浏览器回放必须覆盖只点外围追问也能继续主线");
  assertIncludes(browserSmokeSource, "data-scene-dialogue", "浏览器回放必须覆盖先问普通问题再点关键追问的流程");
  assertIncludes(browserSmokeSource, "materialMode: \"miss\"", "浏览器回放必须覆盖材料误圈路线");
  assertIncludes(browserSmokeSource, "keyboard-accounting-support", "浏览器回放必须覆盖真实键盘焦点路线");
  assertIncludes(browserSmokeSource, "page.keyboard.press(\"Enter\")", "键盘回放必须用真实键盘确认，而不是只用 DOM click");
  assertIncludes(browserSmokeSource, "gamepad-support-document", "浏览器回放必须覆盖模拟 Gamepad API 路线");
  assertIncludes(browserSmokeSource, "case2-day-map", "浏览器回放必须覆盖第二案店外观察与会员文档路线");
  assertIncludes(browserSmokeSource, "navigator, \"getGamepads\"", "手柄回放必须走 Gamepad API 入口，而不是复用键盘或 DOM click");
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
  const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
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
  const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
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
  assertIncludes(appSource, "./ui/liveCallView.js", "直播 HUD/立绘 HTML 必须从 app.js 拆到 ui/liveCallView");
  assertIncludes(appSource, "./ui/liveFrameView.js", "案内主舞台 HTML 必须从 app.js 拆到 ui/liveFrameView");
  assertIncludes(appSource, "active !== document.body && isVisibleElement(active)", "默认聚焦不得在玩家刚操作键盘时抢走现有可见焦点");
  assert(!appSource.includes('<span>${escapeHtml(row.rowId ?? "")}</span>'), "文档表格不得把 r08、q06 等内部行 ID 显示给玩家");
  assert(!appSource.includes("圈行 ${rowId}"), "结算路线不得把内部行 ID 写进玩家的追问轨迹");
  assertIncludes(appSource, 'return question.kind === "cross" ? "跨行对照" : "单行追问"', "夜间对账按钮必须使用玩家能读懂的标签");
  assertIncludes(audiencePatienceHudHtml({ level: "mid", ratio: 0.5, remaining: 4, max: 8 }), "听众忍耐", "听众忍耐 HUD 必须可由纯 UI 模块渲染");
  assertIncludes(liveCommentStripHtml({ comments: ["弹幕安静", "账单边上有时间"] }), "账单边上有时间", "直播弹幕条必须可由纯 UI 模块渲染");
  assertIncludes(caseProgressStripHtml({ total: 5, answered: 2, label: "匿名来电" }), "第 3/5 句", "通话进度条必须可由纯 UI 模块渲染");
  assertIncludes(storyPackSummaryHudHtml({ total: 4, solved: 2 }), "2/4", "故事包收麦 HUD 必须可由纯 UI 模块渲染");
  assertEqual(callerExpressionForView({ mood: "thinking", sceneIndex: 1 }).kind, "shift", "来电人表情 fallback 必须可脱离 app 状态测试");
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
  assertEqual(compactRecapPages.length, 3, "收麦回看必须固定压缩为三页");
  const recapFlow = solvedRecapFlowView({ pages: ["第一页", "第二页"], step: 0 });
  assertIncludes(recapFlow.text, "1/2", "收麦回看分页 kicker 必须由纯 UI flow helper 生成");
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
  assertIncludes(activeSceneHtml, "第 2 句", "当前对话回合正文必须可由纯 UI 模块渲染");
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
  assertIncludes(screenSources, "sceneCloser: focus.kind === \"key\" ? scene.sceneCloser : null", "正常试玩的关键追问结果页必须接入 sceneCloser");
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
  assertIncludes(storyInterludeChoicesHtml(), "接下一通", "案后小尾声必须先进入独立幕间引页");
  assertIncludes(storyInterludeChoicesHtml(), "data-enter-case-bridge", "案后小尾声不得直接跳到下一案");
  const worldEcho = { actionLabel: "把午间新闻听完", kicker: "午间新闻", headline: "某机构暂停兑付", body: "监管部门已经介入。" };
  assertIncludes(storyInterludeChoicesHtml({ worldEcho, worldEchoRevealed: false }), "data-reveal-world-echo", "跨案世界回声必须先要求一次玩家操作");
  assert(!storyInterludeChoicesHtml({ worldEcho, worldEchoRevealed: false }).includes("data-enter-case-bridge"), "世界回声未揭示时不得跳过到下一案");
  assertIncludes(storyInterludeHtml({ worldEcho }), "某机构暂停兑付", "玩家操作后必须能渲染世界回声");
  assertIncludes(storyInterludeChoicesHtml({ worldEcho, worldEchoRevealed: true }), "data-enter-case-bridge", "世界回声揭示后必须恢复下一幕入口");
  assertIncludes(storyInterludeChoicesHtml({ finalCase: true }), "收播", "最后一案小尾声之后必须进入整晚尾声");
  assert(!storyInterludeHtml({ shellLine: "第四案完。" }).includes("下一通"), "最后一案小尾声不能渲染不存在的下一案材料");
  assertEqual(storyInterludeCaseId({ sequence: [{ caseId: "01-credit", plotId: "lost-job-hidden-credit" }] }, { id: "episode-generated-id", plotId: "lost-job-hidden-credit" }), "01-credit", "案间必须把运行时 plotId 映射回 manifest caseId");
  const closingCard = caseClosingHtml({
    caseNumber: 1,
    closing: { title: "账单里的八万", verdict: "先别垫。", beats: [{ label: "来电", text: "要八万。" }], confirmed: ["失业早于借钱"], unresolved: ["3301 归属未定"], nextStep: "先对账。" }
  });
  assertIncludes(closingCard, "已经确认", "案件结案页必须区分确认事项");
  assertIncludes(closingCard, "还没弄清", "案件结案页必须保留未定事项");
  assertIncludes(caseClosingChoicesHtml(), "收麦后", "案件结案页必须在正式收束后才进入案后尾声");
  const bridgeCard = caseBridgeHtml({
    fromCaseNumber: 1,
    toCaseNumber: 2,
    fromAct: "体面",
    nextAct: "自己人",
    quote: { text: "祸莫大于不知足，咎莫大于欲得。", source: "老子 ·《道德经》第四十六章", bridge: "账单收下，店表来了。" },
    nextBrief: { label: "理发店排班表", storyObjectLabel: "店表", caseTitle: { title: "理发店排班表" } }
  });
  assertIncludes(bridgeCard, "祸莫大于不知足", "案间引页必须完整显示名言原文");
  assertIncludes(bridgeCard, "《道德经》第四十六章", "案间引页必须显示可核对的出处");
  assert(!bridgeCard.includes("理发店排班表") && !bridgeCard.includes("账单收下，店表来了。") && !bridgeCard.includes("本幕材料"), "案间引页只显示名言，不得追加下一案标题、作者式承接或材料预告");
  assert(!bridgeCard.includes("体面") && !bridgeCard.includes("自己人"), "案间路线不得再显示作者概括的单词式幕标签");
  assertIncludes(caseBridgeChoicesHtml(2), "data-enter-next-case", "名言引页之后才能进入下一幕标题");
  const secondCaseTitle = caseTitleHtml({ caseNumber: 2, totalCases: 4, brief: { storyAct: "自己人", storyObjectLabel: "店表", caseTitle: { title: "理发店排班表", subtitle: "暧昧还是成交", intro: "表到了。" } } });
  assertIncludes(secondCaseTitle, "CASE 02", "第二案必须有独立案号标题页");
  assert(!secondCaseTitle.includes("02 / 04") && !secondCaseTitle.includes("本幕材料") && !secondCaseTitle.includes("表到了。") && !secondCaseTitle.includes("暧昧还是成交"), "幕标题只显示案号和案名，不显示总目录，也不替人物预告求助、材料或判断");
  assertIncludes(caseTitleChoicesHtml(2), "接听", "幕标题页按钮只写玩家当下动作");
  const titleWithoutSubtitle = caseTitleHtml({ caseNumber: 1, totalCases: 4, brief: { storyAct: "体面", publicHook: "不应回填到副标题", caseTitle: { title: "账单里的八万", intro: "电话接通了。" } } });
  assert(!titleWithoutSubtitle.includes("case-title-subtitle") && !titleWithoutSubtitle.includes("不应回填到副标题"), "幕标题允许省略无功能副标题，且不得拿 publicHook 自动回填");
  assertIncludes(appSource, "./ui/storyPackCompleteView.js", "故事集终局 HTML 必须从 app.js 拆到 ui/storyPackCompleteView");
  const hiddenThreadProfile = { total: 4, title: "今晚暗线", label: "同款话术", line: "好听话后面接成本。", beats: ["体面接钱", "自己人接资源"] };
  const storyCompleteCard = storyPackCompleteHtml({ displayBest: { label: "钱流线" }, theme: { title: "今晚主题", thesis: "看谁买单" }, materialProfile: { total: 1, label: "圈得准", line: "材料圈准" }, quoteProfile: { total: 1, label: "原话收住", line: "接住原话" }, objectProfile: { total: 1, label: "物件串起来", line: "账单、表格" }, hiddenThreadProfile, briefs: [{ label: "第一案" }], results: [{ dailyAccuseLabel: "“原话”" }], routeProfiles: [{ label: "钱流" }], comments: ["「弹幕」"], playerType: "收麦主播", shareTitle: "今晚收住", aftertaste: "几条线露头", closingLine: "挂麦", callCountText: "这一路麦" });
  assertIncludes(storyCompleteCard, "评论区审判墙", "故事集终局结果卡必须可由纯 UI 模块渲染");
  assertIncludes(storyCompleteCard, "hidden-thread-card", "故事集终局必须能渲染串案暗线卡");
  assertIncludes(storyPackShareText({ theme: { title: "今晚主题" }, displayBest: { label: "钱流线" }, pressureProfile: { label: "稳住" }, materialProfile: { label: "圈准" }, quoteProfile: { label: "收住" }, hiddenThreadProfile, playerType: "收麦主播" }), "散场暗线：同款话术", "故事集终局复制文案必须带出散场暗线");
  const summaryBriefs = [{ label: "第一案", truthBoundary: { true: ["账单是真的"], edited: ["少了来源"], unknown: ["动机定不了"] }, storyClueObject: "账单", storyHiddenThread: { title: "今晚暗线", label: "同款话术", reveal: "好听词后面接成本。", beats: ["账单", "表格"] } }];
  const summary = storyPackSummaryModel({
    briefs: summaryBriefs,
    results: [{ issuePercent: 100, dailyAccuseLabel: "“账单”", quoteHit: true }],
    routeProfiles: [{ axis: "money-flow", label: "钱流线" }],
    boundaryRows: storyBoundaryRows(summaryBriefs, { picksFor: () => ({ "true:0": "true", "edited:0": "edited", "unknown:0": "unknown" }) }),
    pressureRows: storyPressureRows(summaryBriefs, { budgetFor: () => ({ max: 8, remaining: 8 }), choicesFor: () => [], foundCountFor: () => 3 }),
    materialRows: storyMaterialRows(summaryBriefs, { evidencePicksFor: () => [{ correct: true }], investigationPicksFor: () => [] })
  });
  assertIncludes(summary.materialProfile.label, "圈", "故事集材料 profile 必须可由纯 runtime summary 模型生成");
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
  assertIncludes(deckHtml, "class=\"control-deck\"", "案内主画面必须保留直播控场台侧栏");
  assertIncludes(deckHtml, "deck-live-metrics", "控场台必须有 LIVE 状态和观众数氛围指标");
  assert(!deckHtml.includes("LIVE 01:24:55"), "控场台不得显示不会随流程变化的假直播时长");
  assertIncludes(deckHtml, "deck-host-monitor", "控场台必须保留主播监看层，强化玩家在主播台控场");
  assertIncludes(deckHtml, "主播监听", "控场台监看层应像直播监听状态，不要退回抽象的听线小仪表");
  assertIncludes(deckHtml, "当前第 2 段，共 5 段。", "控场台通话进度必须说清当前段落，不能用指代不明的氛围句");
  assert(!deckHtml.includes("麦没断"), "控场台通话进度不能再写“麦没断”这类指代不明文案");
  assertIncludes(firstDeckHtml, "绕问、误指会掉耐心", "第一次进入通话时，听众耐心必须有简短规则提示");
  assert(!deckHtml.includes("绕问、误指会掉耐心"), "听众耐心提示只在首次满格进入时出现，不能常驻挤占控场台");
  assertIncludes(deckHtml, "Viewers", "控场台直播指标必须像直播间状态，不写成玩法分数");
  assertIncludes(deckHtml, "deck-monitor-strip", "控场台必须有麦克风/监听状态，不能只是普通信息卡");
  assertIncludes(deckHtml, "后台材料", "控场台必须把材料作为直播间后台对象呈现");
  assertIncludes(deckHtml, "data-material-open", "后台材料收到后必须能从控场台直接打开，不能只显示数量");
  assertIncludes(deckHtml, "点击查看", "后台材料卡必须明确提示玩家可以查看");
  assertIncludes(deckHtml, "deck-material-preview", "控场台材料卡必须有缩略图，提升直播后台操作感");
  assertIncludes(deckHtml, "审批图", "控场台必须展示当前后台材料");
  const frameHtml = liveFrameHtml({ productName: "深夜热线：直播间侦探", modeLabel: "试玩连线", soundEnabled: true, label: "继续对话", chapter: "匿名来电", text: "<p>正文</p>", choices: "<button>继续</button>", visualHud: "<div>HUD</div>", controlDeckHtml: deckHtml, backdropClass: "backdrop-credit", material: "信用卡账单" });
  assertIncludes(frameHtml, "live-console-shell", "案内主画面必须使用控场台布局骨架");
  assertIncludes(frameHtml, "has-control-deck", "有控场台时主舞台必须进入明确的桌面两栏状态");
  assertIncludes(frameHtml, "data-live-shell", "主舞台必须暴露稳定的交互外壳标记，不能由 app.js 复制骨架类名");
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
  assertIncludes(liveFrameHtml({ text: "<p>正文</p>", pixelTransition: { eyebrow: "DAY SHIFT", label: "白天调查" } }), "pixel-transition-scene", "大切点必须能渲染像素风过场层");
  assertIncludes(liveFrameHtml({ text: "<p>正文</p>", pixelTransition: { kind: "signal-connect", eyebrow: "CALL", label: "新案接入" } }), "pixel-transition-signal-connect", "接通瞬间必须能渲染轻微信号断帧");
  assertIncludes(liveFrameHtml({ text: "<p>正文</p>", pixelTransition: { kind: "soft-fade", eyebrow: "20:00", label: "开播前" } }), "pixel-transition-soft-fade", "首页入场必须能使用柔和过渡，不得强制套用硬像素断帧");
  assertIncludes(liveFrameHtml({ text: "<p>正文</p>", pixelTransition: { kind: "reveal", eyebrow: "HOLD", label: "等等" } }), "pixel-transition-reveal", "案内唯一核心反转必须能渲染短促重击过场");
  assertIncludes(stylesSource, "soft-scene-transition-out 2400ms", "开播前过场必须保留足够阅读时间，不能再次短闪");
  assertIncludes(stylesSource, "reveal-transition-out 1680ms", "案内核心反转必须给玩家足够时间读完重点标注");
  assertIncludes(stylesSource, "reveal-portrait-step", "案内核心反转必须在过场后强调当前主播立绘");
  assertIncludes(stylesSource, "@keyframes pixel-transition-out", "像素风过场必须由短促分步动画控制");
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
  assertIncludes(stylesSource, ".choice-material-shortcut", "关键选择出现时必须在选择层提供材料快捷入口");
  assertIncludes(liveFrameViewSource, "选择前查看材料", "选择层材料入口必须说明可以先看材料再决定");
  assertIncludes(appSource, "querySelectorAll?.(\"[data-material-open]\")", "控场台与对白框两个材料入口必须共用同一个材料板");
  assertIncludes(stylesSource, ".case-portrait.art-pixel img", "像素立绘必须使用独立的最近邻渲染规则，不能给旧立绘全局套滤镜");
  assertIncludes(stylesSource, ".deck-card-live", "控场台必须有直播信号视觉模块");
  assert(!stylesSource.includes("50% 50% 44% 44%"), "控场台主播监听不能再画成小人脸图标");
  assertIncludes(stylesSource, ".scene-evidence-props", "主舞台案件物件前景层必须有样式");
  assertIncludes(stylesSource, ".scene-evidence-props.props-bill", "账单类前景物件必须有区别于普通文件的样式");
  assertIncludes(stylesSource, ".scene-evidence-props.props-flow", "审批/流程类前景物件必须有区别于普通文件的样式");
  assertIncludes(stylesSource, ".deck-live-metrics", "控场台 LIVE 指标必须有独立样式");
  assertIncludes(stylesSource, ".deck-patience-hint", "听众耐心首次提示必须有独立样式，避免混成普通状态文案");
  assertIncludes(stylesSource, ".deck-card-material", "控场台必须有后台材料视觉模块");
  assertIncludes(stylesSource, ".deck-monitor-strip", "控场台必须有麦控监看条样式");
  assertIncludes(stylesSource, ".deck-material-preview", "控场台必须有材料缩略图样式");
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
  assertIncludes(appSource, "getGamepads", "Steam/桌面输入必须轮询标准 Gamepad API");
  assertIncludes(appSource, "handleGamepadButton(gamepad, 0", "手柄 A 键必须能确认当前按钮");
  assertIncludes(appSource, "handleGamepadButton(gamepad, 1", "手柄 B 键必须能返回或重试");
  assertIncludes(appSource, "handleGamepadButton(gamepad, 3", "手柄 Y 键必须预留给回看/复盘入口");
  assertIncludes(appSource, "intent === \"review\"", "Tab 必须能通过键盘意图打开或收起当前回看面板");
  assertIncludes(appSource, "toggleReviewPanel", "键盘 Tab 和手柄 Y 必须复用同一套回看切换逻辑");
  assertIncludes(appSource, "closeTopOverlay", "Esc 与手柄 B 必须先关闭材料或案卷顶层");
  assertIncludes(appSource, "onChoicesShown", "对白结束展示选项时必须同步材料层状态");
  assertIncludes(appSource, "resetViewportScroll", "SPA 切换场景后必须回到新画面顶部，不能继承上一页滚动位置");
  assertIncludes(dialoguePresentationSource, ".night-shell-line", "夜班序章必须进入逐句 AVG 分页，不能在手机端堆成长页");
  assertIncludes(appSource, "handleGamepadAxis", "左摇杆必须能移动焦点");
  assertIncludes(appSource, "gamepadAxisDirection", "摇杆方向和冷却必须走可测试纯函数");
  assertIncludes(stylesSource, "button:focus-visible", "键盘和手柄焦点必须有可见焦点环");
  assertIncludes(stylesSource, "focusCurrent", "键盘和手柄焦点必须有呼吸灯动画，便于小屏和大屏识别");
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
  assertEqual(a.map((brief) => brief.plotId).join("|"), "lost-job-hidden-credit|tony-multi-dating|education-income-fake-profile|workplace-reimbursement-screenshot", "当前 demo 包必须按体面、自己人、条件、主责递进");
  assertEqual(a[0].runtimeContentSource, "content-pack-json", "第一案必须从 content JSON 接管完整运行时内容");
  assertEqual(a[0].runtimeContentCaseId, "01-credit", "第一案必须记录接管它的内容包 caseId");
  assertEqual(a[1].runtimeContentSource, "content-pack-json", "第二案必须从 content JSON 接管完整运行时内容");
  assertEqual(a[1].runtimeContentCaseId, "02-tony", "第二案必须记录接管它的内容包 caseId");
  a.forEach((brief, index) => {
    assertEqual(brief.callerArtStyle, "pixel", `第 ${index + 1} 案必须使用统一像素立绘`);
    assertEqual(Object.keys(brief.callerArtVariants ?? {}).sort().join("|"), "guarded|neutral|pause", `第 ${index + 1} 案像素立绘必须接齐 neutral / guarded / pause 三态`);
  });
  assertEqual(a[2].runtimeContentSource, "content-pack-json", "第三案必须从 content JSON 接管完整运行时内容");
  assertEqual(a[2].runtimeContentCaseId, "03-profile", "第三案必须记录接管它的内容包 caseId");
  assertEqual(a[3].runtimeContentSource, "content-pack-json", "第四案必须从 content JSON 接管完整运行时内容");
  assertEqual(a[3].runtimeContentCaseId, "04-workplace", "第四案必须记录接管它的内容包 caseId");
  assertEqual(a[1].taskProfile.id, "emotion", "理发店案任务画像必须来自 content JSON，而不是运行时 plotId 特判");
  assertEqual(a[2].taskProfile.id, "verification", "存款证明案任务画像必须来自 content JSON");
  assertEqual(a[3].taskProfile.summary, "截图看着完整，钱却没落到该落的位置。", "职场案任务画像必须保留内容包里的案内操作摘要");
  assertEqual(a[0].storyHiddenThread?.label, demoPack.theme.hiddenThread.label, "故事包暗线必须从 manifest theme 进入每案 brief");
  assertEqual(a[0].difficultyProfile.tier, 1, "第一案必须从 manifest 接到开场难度 profile");
  assertEqual(a[3].difficultyProfile.tier, 4, "第四案必须从 manifest 接到收束难度 profile");
  assert(calculateCaseBudgetMax({ brief: a[0] }) > calculateCaseBudgetMax({ brief: a[3] }), "故事包后段必须能通过 manifest 降低听众耐心预算");
  assertEqual(truthBoundaryPromptLimitForCase(a[2]), 6, "故事包中后段必须能通过 manifest 提高事实边界题量");
  assertEqual(truthBoundaryReview(a[3]).prompts.length, 6, "事实边界回看必须读取 per-case truthBoundaryPromptLimit，而不是全包固定 5 条");
  assert((a[1].evidenceChecks ?? []).length >= 2, "第二案必须至少两份材料检视，把老板娘话术后的消费顺序做成玩法");
  assert((a[2].evidenceChecks ?? []).length >= 2, "第三案必须至少两份材料检视，把收入和流水缺口做成玩法");
  assert((a[3].evidenceChecks ?? []).length >= 2, "职场案必须至少两份材料检视，形成流程压力");
  a.forEach((brief, index) => {
    assert(Object.values(brief.routeAxisComments ?? {}).flat().length >= 4, `第 ${index + 1} 案必须有按路线轴反应的弹幕池`);
    assert((brief.sceneVersions ?? []).some((scene) => (scene.questionOptions ?? []).some((option) => option.guardedAnswer)), `第 ${index + 1} 案必须至少有一条收紧版回答，让现场防备进入玩法而不只停在表情`);
    assert((brief.truthBoundary?.true ?? []).length > 0, `第 ${index + 1} 案必须把实锤边界带进运行时`);
    assert((brief.truthBoundary?.edited ?? []).length > 0, `第 ${index + 1} 案必须把修剪边界带进运行时`);
    assert((brief.truthBoundary?.unknown ?? []).length > 0, `第 ${index + 1} 案必须把未知边界带进运行时`);
  });
  assertEqual(new Set(a.map((brief) => brief.plotId)).size, demoCaseCount, "当前 demo 包不能重复题材");
  a.forEach((brief, index) => {
    assertEqual(brief.caseMode, "episode", `第 ${index + 1} 案必须标记 episode`);
    assertEqual(brief.order, index + 1, `第 ${index + 1} 案顺序必须稳定`);
    assertEqual(brief.modeLabel, "试玩连线", "故事包案内模式标签不能暴露目录包装");
    assertEqual(brief.storyArcTitle, "热线连线", "故事包案内眉题不能显示案名或进度");
    assertEqual(brief.storyCaseLabel, "匿名来电", "故事包通话 HUD 不能提前显示案名");
    assert(brief.storyThemeTitle && brief.storyThemeIntro && brief.storyThemeThesis, "故事包必须携带主题、开场引子和主题论点");
    assert((brief.storyCommentSeeds ?? []).length >= 4, "故事包必须把评论种子带进运行时 brief");
    const preachyOpeningBits = [`${"这些词"}${"都不坏"}`, `${"坏的是"}`, `${"四通来电"}${"放在一起看"}`, `${"四通"}${"匿名来电"}`, `${"四案"}${"故事集"}`];
    assert(!preachyOpeningBits.some((phrase) => brief.storyThemeIntro.includes(phrase)), "故事集开场引子不能先下主题判断");
    assert(brief.storyThemeCommentPrompt, "故事包必须携带评论区提示");
    assert(brief.storyAct && brief.storyObjectLabel && brief.storyInterludeRecap && brief.backdropClass && brief.callerArt, "每案必须有整集里的功能、物件名、背景 class、匿名来电人立绘和案间收束句");
    assert(brief.storyBridge === undefined && brief.weeklyBridge === undefined, "主案接通前不得挂载案情桥接旁白");
    assert(/^\.\/assets\/generated\/callers\/[^?#]+\.png$/.test(brief.callerArt), "故事包来电人立绘必须来自匿名 callers 资产目录且不带手写缓存戳");
    assert((brief.accusationChoices ?? []).length >= 3, `第 ${index + 1} 案最终收麦原话必须来自内容包`);
    assert(!/故事集|第[一二三四五六七八九十\d]+\s*案|\d+\s*\/\s*\d+|体面|一家人|条件|主责/.test(`${brief.modeLabel} ${brief.storyArcTitle} ${brief.storyCaseLabel}`), "案内可见标题不能像目录或剧透标签");
    assert(brief.sceneVersions.length >= 5 && brief.sceneVersions.length <= 8, `第 ${index + 1} 案必须是 5-8 段来电`);
    const firstNightIndexes = brief.nightStructure?.segment1SceneIndexes ?? [];
    const secondNightIndexes = brief.nightStructure?.segment2SceneIndexes ?? [];
    assert(firstNightIndexes.length >= 2 && firstNightIndexes.length <= 3, `第 ${index + 1} 案第一夜只能暴露 2-3 个承重问题`);
    assert(secondNightIndexes.length >= 2 && secondNightIndexes.length <= 3, `第 ${index + 1} 案第二夜只能在改口和材料后再暴露 2-3 个承重问题`);
    assert(firstNightIndexes.every((sceneIndex) => !secondNightIndexes.includes(sceneIndex)), `第 ${index + 1} 案两夜承重场景不得重复播放`);
    if (brief.runtimeLengthPlan?.liveBeatCount !== undefined) {
      assertEqual(brief.runtimeLengthPlan.liveBeatCount, brief.sceneVersions.length, `第 ${index + 1} 案 runtimeLengthPlan.liveBeatCount 必须等于实际段落数`);
    }
    assert(brief.sceneVersions.every((scene) => (scene.questionOptions ?? []).length >= 2 && (scene.questionOptions ?? []).length <= 4), `第 ${index + 1} 案每段必须保留 2-4 个主播问法，兼顾随意提问和关键选择`);
    const committedOptions = brief.sceneVersions.flatMap((scene) => scene.questionOptions ?? []);
    assert(committedOptions.every((option) => option.suspicionLabel && option.suspicionLabel !== option.question), `第 ${index + 1} 案所有承重按钮必须只显示疑点方向，完整问句只能在选择后说出`);
    assert(committedOptions.every((option) => !/[？?。！!]$/.test(option.suspicionLabel)), `第 ${index + 1} 案疑点方向不能写成带句末标点的完整问句`);
    const revealOptions = committedOptions.filter((option) => option.revealTransition);
    assertEqual(revealOptions.length, 1, `第 ${index + 1} 案必须且只能有一个案内核心反转过场`);
    assert(revealOptions[0].correct === true, `第 ${index + 1} 案核心反转过场只能由正确方向触发`);
    assert((brief.evidenceChecks ?? []).length >= 1, `第 ${index + 1} 案必须有材料检视节点，不能只有口述二选一`);
    (brief.evidenceChecks ?? []).forEach((check, checkIndex) => {
      assert(check.material && check.prompt, `第 ${index + 1} 案第 ${checkIndex + 1} 个材料检视必须有材料文本和问题`);
      assert((check.options ?? []).some((option) => option.correct), `第 ${index + 1} 案第 ${checkIndex + 1} 个材料检视必须有正确指出项`);
      assert((check.options ?? []).some((option) => !option.correct), `第 ${index + 1} 案第 ${checkIndex + 1} 个材料检视必须有误指项`);
    });
    brief.sceneVersions.forEach((scene, sceneIndex) => {
      const normal = (scene.questionOptions ?? []).filter((option) => !option.contradiction);
      const critical = (scene.questionOptions ?? []).filter((option) => option.contradiction);
      assert(normal.length >= 1, `第 ${index + 1} 案第 ${sceneIndex + 1} 段必须有可岔开的问法`);
      assert(critical.length >= 1 && critical.length <= 2, `第 ${index + 1} 案第 ${sceneIndex + 1} 段必须有 1-2 个盯住的问法`);
    });
    assertEqual(dailyAccusationChoices(brief).length, 4, `第 ${index + 1} 案最终必须给四句原话`);
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
    "lost-job-hidden-credit": ["头一回开口", "我以前总跟朋友夸他对我好"],
    "tony-multi-dating": ["自己人", "关系我一直没敢问"],
    "education-income-fake-profile": ["八万四", "我也没有让她收回来"],
    "workplace-reimbursement-screenshot": ["那时候我是真想让老板把这次活动交给我", "我来扛"]
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
    ["自己人"],
    ["条件"],
    ["主责"]
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
  assertIncludes(text, "咨询者先想争取负责活动", "职场报销案应使用角色称谓承接来电人，避免头像和代词冲突");
  assertIncludes(text, "供应商联系人", "职场报销案应使用流程角色承接缺席方，避免性别绑定");
  assertIncludes(text, "付款经办人", "职场报销案应把缺席方问题落到流程入口，不回到性别代词判断");
});

test("EPISODE-001E", "all four demo cases preserve human causality and evidence boundaries", () => {
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const allText = JSON.stringify(briefs);
  const staleCausality = /订座记录和朋友圈，我|靠窗位是谁订的|我看窗外，他看酒|现在那两个字卡在这儿|这张表记的是发型，还是人能派什么用|那列不是预约|一个把我写成|这三样，你补给家里了吗|材料就对到这儿|先别打。她也是看你困在里面|报价单哪一行写了钱往谁那儿走|领导写了你什么；钱，又写了什么|你第三次为什么还收了|月底，在归档以后|月底统一走|复盘下周一就要归档|下周一就要归档|周一就归档|周一先被复盘的是我|归档材料最后怎么写的|他一直说名校毕业，细问才说是 MBA|他今晚在群里说话了吗|归档前，你最怕补哪七个字|我在他那儿是个项目|那天刚好看到那张表|上个月发过一张办材料的截图|东西送到哪儿，我今晚还不想说|买了什么，我现在不想说|买了什么……这句我先不说|先让我把账算完|还想转给他时，心里怎么想的|后来你是怎么发现这个顺序的|你从这段关系里拿过什么好处|你白天去了哪里，先说给我听|你先把昨晚突然挂断的事说清楚|那四张材料是怎么发来的|他问到工资卡以后呢|下一句通常是什么|那次六折，你当时觉得他为什么愿意给|这条不算骂|二十九。说的|在我这里。你等一下，我把灯拖过来|面……看心情吧|账单里剩下那三万五……让我缓一晚|好，我不逼你今晚说|账单里那三万五你继续问|你先别问我，先看他的图|钱就是那次“你先顶上”刷进我个人卡的|新批注和审批页对不上|为什么没继续问回单号|那三张审批图里有什么|垫的钱是多少|红包发完以后呢|后半句，你别逼我|欠条有没有|为什么一直没提欠条|先别一句一个骗|说高、说低，两边都有|你要骂，按句骂|我承认添话，不认凭空造人|两套报价并排|不替任何一边省掉半句|最后分别要人做什么|三栏念完了|付款一张凭据，到账另一张|赵律师站在控制室门口|我只帮你看纸面：三页都没有回单号|主责，我确实想要|这句我想哭。忍住了|比他半年说的都实在|好，这顿饭先放在这里|这一万二先记着|两边加完|我没敢往那边说|我们从这儿接着问|先放后台吧|最后总会落到店里的事上|先不接弹幕的话|这块最灰|推进走完，人就往后放|先放宸直两个月|那十万到底怎么走的|那十万是不是后来进了宸直|接资金路径|周末这顿饭可以先放一放|这几张图先放一下|什么都想往那边套|我还能往回收一点|图上的事我们还没说完|这顿饭先往后放吧|资料里的学历和正式学历不是同一个口径|修没修先放下|材料没齐，我不签后面的结论|介绍链两边话|介绍人的两边话|刚接主责|拿主责|给你主责|第一次主责|主责给我|主责我还想留|不配拿主责|抢着要主责|会丢主责|刚把执行这块接下来|只有你能接住我|只有我能接住他|只有我能接住对方的情绪|晚点我给你插一位|插位完就登记|又自己人？上回那护理我不续|不续就不续，先坐|你慢慢说|先缓口气|上一通是账单|四通麦背后没有同一个反派|先把身份、关系或流程说得好听/;
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
  assertIncludes(case1OpeningText, "我不转，真就是我不讲情分吗", "案一开场必须暴露来电人索取的是道德判断，不得继续伪装成中立查账");
  assertIncludes(case1OpeningText, "以前给过你什么，和这八万是谁欠的，得分开说", "案一主播必须拆开过去给付与当前债务，不直接替来电人背书");
  assert(!case1OpeningText.includes("是不是我太防着他"), "案一已经没有转钱，开场不得再虚构自我怀疑把话说圆");
  assert(!case1OpeningText.includes("先别怪自己多想"), "案一主播不得用模板安慰回应作者补出的自责");
  assert(!case1OpeningText.includes("换我也得先把手缩回来"), "案一主播接金额时不使用刻意比喻替来电人表态");
  const case1LayoffGap = case1Opening?.sceneVersions?.find((scene) => scene.id === "credit-layoff-gap");
  const case1LayoffGapText = JSON.stringify(case1LayoffGap ?? {});
  assertIncludes(case1LayoffGapText, "他有没有说哪天还你", "案一主播应沿借款承诺直接追问日期");
  assertIncludes(case1LayoffGapText, "那你后来怎么没转", "案一主播在还款承诺后应直接追问未转原因");
  assert(!case1LayoffGapText.includes("先垫着”我听见了"), "案一主播不得用关键词回声证明自己听见上一句");
  assert(!case1LayoffGapText.includes("钱下来”是哪笔钱、哪天下来"), "案一主播不得把来电人刚说完的缺项重新归纳一遍再提问");
  assert(!JSON.stringify(case1Opening).includes("挡几天"), "案一代垫款语境不得为了避词重复改用不自然的‘挡几天’");
  const case1Living = case1Opening?.sceneVersions?.find((scene) => scene.id === "credit-living-arrangement");
  const case1LivingText = JSON.stringify(case1Living ?? {});
  assertIncludes(case1LivingText, "你们平时住在一起吗", "案一必须先用流程问话确认两人是否同住");
  assertIncludes(case1LivingText, "不住在一起", "案一咨询者必须明确回答没有同住");
  assert(!case1Living?.version?.includes("租"), "案一分住回答不得提前暴露咨询者租房");
  assertIncludes(case1LivingText, "他平时发了工资，会交给你吗", "案一玩家必须能追问双方是否共管工资");
  assertIncludes(case1LivingText, "每个月实发三万五", "案一工资线必须补出男方离职前收入");
  assertIncludes(case1LivingText, "到账就转我一万七千五", "案一工资线必须补出固定半薪");
  assertIncludes(case1LivingText, "前后一共十四个月", "案一工资线必须覆盖一年多固定给付");
  const case1Rent = case1Opening?.sceneVersions?.find((scene) => scene.id === "credit-rent-beneficiary");
  assert(!case1Rent, "案一不得保留为房租线索硬造的独立口供场景");
  const case1BankFlow = case1Opening?.documents?.find((document) => document.id === "case1-bank-flow");
  assertEqual(case1BankFlow?.rows?.find((row) => row.rowId === "r01b")?.amount, "¥10,000", "案一第二天流水必须出现三月双月房租一万元");
  assertEqual(case1BankFlow?.rows?.find((row) => row.rowId === "r04b")?.amount, "¥10,000", "案一第二天流水必须出现五月双月房租一万元");
  const case1SupportScene = case1Opening?.overnightStructure?.dayScenes?.find((scene) => scene.id === "day-support-payments");
  assertIncludes(JSON.stringify(case1SupportScene?.body?.choice ?? {}), "这两笔房租付的是谁住的房子", "案一玩家必须从双月房租行选择追问房租归属");
  const case1RentOpener = case1Opening?.overnightStructure?.callbackOpeners?.["两个月一次的房租"];
  assertIncludes(JSON.stringify(case1RentOpener?.firstConflict ?? {}), "是我住的", "案一房租受益人必须在第二天玩家带回问题后才揭示");
  assertIncludes(JSON.stringify(case1RentOpener?.firstConflict ?? {}), "房租不在一万七千五里面", "案一必须把双月房租与固定半薪拆开");
  const case1Loyalty = case1Opening?.sceneVersions?.find((scene) => scene.id === "credit-loyalty-test");
  const endorsementQuestion = case1Loyalty?.questionOptions?.find((option) => option.question?.includes("想让我替你告诉他"));
  assert(endorsementQuestion?.correct, "案一第二夜必须允许玩家追问来电人的真实利益诉求");
  assertIncludes(endorsementQuestion?.answer ?? "", "把回放发给他", "案一咨询者必须承认想把主播判断当成替自己拒绝的工具");
  assert(!JSON.stringify(case1Opening).includes("帮我挡"), "案一代垫款语境不得再出现‘帮我挡’");
  const case2 = briefs.find((brief) => brief.runtimeContentCaseId === "02-tony");
  const case3Opening = briefs.find((brief) => brief.runtimeContentCaseId === "03-profile");
  assert(!JSON.stringify(case2?.openingDialogue ?? []).includes("先缓口气"), "案二开场必须从误发表格直接追关系，不能保留模板式安抚");
  assertIncludes(JSON.stringify(case2?.openingDialogue ?? []), "他原本要发你什么", "案二开场必须沿误发动作追原定内容，不能问表上有什么却让来电人答误发过程");
  assert(!JSON.stringify(case3Opening?.openingDialogue ?? []).includes("你慢慢说"), "案三开场必须直接接住见父母和彩礼冲突，不能保留模板问候");
  assertIncludes(JSON.stringify(case3Opening?.openingDialogue ?? []), "饭店还没订，彩礼倒先问过去了", "案三主播首轮回应必须承接咨询者刚说出的时间冲突");
  const case3ClosingAmounts = ["二十八万八", "二十八万六", "二十三万八", "三十万", "二十万"]
    .filter((amount) => `${case3Opening?.stageJudgement ?? ""}${case3Opening?.caseClosing?.verdict ?? ""}`.includes(amount));
  assert(case3ClosingAmounts.length <= 2, "案三结案口播不得连续复报材料板里的多个金额");
  const guidedDocumentIntros = {
    "01-credit": ["先", "三月"],
    "03-profile": ["先", "现在真能拿出来"],
    "04-workplace": ["先", "回单号"]
  };
  Object.entries(guidedDocumentIntros).forEach(([caseId, anchors]) => {
    const intro = briefs.find((brief) => brief.runtimeContentCaseId === caseId)?.documents?.[0]?.intro ?? "";
    anchors.forEach((anchor) => assertIncludes(intro, anchor, `${caseId} 材料板开场必须先给阅读顺序，不让玩家一次吞完整张表`));
  });
  assertIncludes(byPlot["lost-job-hidden-credit"], "你们俩是不是有人是那里的老会员", "案一必须先把会员身份作为假设询问");
  assertIncludes(byPlot["lost-job-hidden-credit"], "会员是我的。跟他在一起以前就办了", "案一必须等咨询者确认会员身份后再追过去消费");
  assertIncludes(byPlot["lost-job-hidden-credit"], "从电子社保卡导出的缴费记录", "案一社保线索必须说明由谁、通过什么载体取得，不能让截图凭空出现");
  assertIncludes(byPlot["lost-job-hidden-credit"], "工资记录没发", "案一必须说明社保记录为何进入对话，并保留男方没有提供工资记录这一缺口");
  const case1SocialSecurityCard = briefs
    .find((brief) => brief.runtimeContentCaseId === "01-credit")
    ?.evidenceCards?.find((card) => card.id === "daily-credit-social-security");
  assert(!case1SocialSecurityCard?.front?.includes("五万贷款"), "案一社保截图本身不能提前携带银行流水中的五万贷款");
  assertIncludes(case1SocialSecurityCard?.detail ?? "", "不能单独确定离职日期", "案一社保材料必须明确缴费中断不等于精确离职日");
  assertIncludes(byPlot["lost-job-hidden-credit"], "送到我这儿了，东西也一直是我在用", "案一被直接问设备去向时必须说出事实并给出人物自己的责任解释，不能为排剧情硬拒答");
  assertIncludes(byPlot["lost-job-hidden-credit"], "我真以为那是他全款买来送我的", "案一必须让咨询者用当时的赠礼理解解释行为，而不是用作者式总结拖延揭示");
  assertIncludes(byPlot["tony-multi-dating"], "你们平时到底怎么相处", "案二第一段必须先补关系背景再进入表格");
  assertIncludes(byPlot["tony-multi-dating"], "先看你自己那行。他下一步想让你做什么", "案二最后一列必须只追咨询者自己的下一步，不能让她口头归纳整张表");
  assertIncludes(byPlot["tony-multi-dating"], "这条语音有没有原样发给别人，今晚没有证据", "案二必须把相似话术与同一条录音分开，不能拿前者替后者作证");
  assertIncludes(byPlot["tony-multi-dating"], "上回你也是这么说的", "案二熟客必须用一次具体经历接住‘自己人’，不能只扔三截电报句");
  assertIncludes(byPlot["tony-multi-dating"], "今天就补个颜色", "案二熟客必须说清本次到店需求，让反驳落回眼前动作");
  assertIncludes(byPlot["tony-multi-dating"], "行，今天就补颜色", "Tony 必须回应熟客刚说的需求，不能用‘不续就不续’掐断相邻话轮");
  assertIncludes(byPlot["tony-multi-dating"], "“也就你肯听我说这些”这条语音是否原样发给过其他人", "案二真相边界必须显式保留录音是否复用这一未知项");
  assert(!byPlot["tony-multi-dating"].includes("同一句“只有你懂我”也发给了几个人"), "案二不得把相似专属话术升级成已证实的同句群发");
  assertIncludes(byPlot["education-income-fake-profile"], "只看那张学校图，能看出他本科在哪儿读吗", "案三必须先核图片字段再讨论名校标签");
  assertIncludes(byPlot["education-income-fake-profile"], "后来问清的本科和学费", "案三各选项必须从已问清的本科自然接到自费 MBA");
  assertIncludes(byPlot["education-income-fake-profile"], "工资、流水，你一样都没见过", "案三茶馆必须先追介绍人说法的依据，不能让她进场自报完整审查结论");
  assertIncludes(byPlot["education-income-fake-profile"], "两边聊天和彩礼传话我都留着", "案三保存材料必须写成具体动作，并把彩礼传话纳入来源链");
  assertIncludes(byPlot["workplace-reimbursement-screenshot"], "能不能证明，项目返利已经给了他", "案四供应商内部结算页只能追到项目联系人，不能替支付与账户作证");
  assertIncludes(byPlot["workplace-reimbursement-screenshot"], "和公司该还我的六万八不是同一笔钱", "案四必须把公司报销与供应商项目返利拆成两条资金路径");
  assertIncludes(byPlot["workplace-reimbursement-screenshot"], "为什么没再追问钱到底什么时候到", "案四只能追问咨询者当时已经知道该问的到账时间，不能倒灌白天才学到的回单号术语");
  assert(!byPlot["workplace-reimbursement-screenshot"].includes("欠条"), "案四公司报销关系不得被写成私人借贷欠条");
  const case2Hook = briefs.find((brief) => brief.runtimeContentCaseId === "02-tony")?.investigationHooks?.find((hook) => hook.id === "tony-other-caller-dm");
  assert(!(case2Hook?.options ?? []).some((option) => option.correct === false && option.contradiction), "案二同款表误选项不得同时携带可结算矛盾，避免两项都对却只认一个");
  const case3 = briefs.find((brief) => brief.runtimeContentCaseId === "03-profile");
  const dinnerCancelled = case3?.overnightStructure?.liveCounterBeats?.find((beat) => beat.id === "profile-weekend-dinner-cancelled");
  assertEqual(
    (dinnerCancelled?.lines ?? []).slice(0, 3).map((line) => line.role).join("|"),
    "caller|caller|host",
    "案三必须由男女双方直接取消饭局，再由主播确认下一步"
  );
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
  assert((brief.evidenceChecks ?? []).length >= 1, "每日案必须有可操作的材料检视节点");
  assert(brief.deepFollowup?.question, "每日案必须有满格后的深问");
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
    assert(brief.openingDialogue.length >= 2 && brief.openingDialogue.length <= 10, `${brief.plotId} 开场必须控制在 2-10 句，给逐步问答留出空间`);
    assert(brief.sceneVersions.every((item) => (item.questionOptions ?? []).length >= 2), `${brief.plotId} 每段必须至少有两个可问方向`);
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
  assertIncludes(openingText, "名校本科", "外层说法必须先出现父母对名校本科的误认，再揭示 MBA");
  assertIncludes(openingText, "本科不是那所", "开场必须给出学历已经纠正这一可观察前提");
  assertIncludes(openingText, "二十八万八拿不出来", "案三必须先让男方直接拒绝高彩礼");
  assertIncludes(openingText, "让他把银行流水打出来", "流水必须由咨询者不相信拒绝后主动索要");
  assertIncludes(openingText, "只发来一份工资账户流水", "男方必须选择性提供工资账户，不能再主动交完整家底");
  assert(!openingText.includes("家里肯定不会差") && !openingText.includes("手里肯定还有积蓄"), "开场不能替玩家揭示女方父母把自费 MBA 当成家底");
  const sceneVersionsText = brief.sceneVersions.map((scene) => scene.version).join(" ");
  const proofScene = brief.sceneVersions.find((scene) => scene.id === "profile-proof-before-dinner");
  const requestedFlowQuestion = proofScene?.questionOptions?.find((option) => option.suspicionLabel === "不信他说拿不出彩礼");
  const salaryOnlyQuestion = proofScene?.questionOptions?.find((option) => option.suspicionLabel === "只给了工资账户");
  const introducerScene = brief.sceneVersions.find((scene) => scene.version.includes("介绍人"));
  const dinnerScene = brief.sceneVersions.find((scene) => scene.version.includes("第一次正式吃饭"));
  const mbaScene = brief.sceneVersions.find((scene) => scene.version.includes("MBA") && scene.version.includes("本科"));
  const motiveScene = brief.sceneVersions.find((scene) => scene.id === "profile-caller-repeats-label");
  const complicityQuestion = motiveScene?.questionOptions?.find((option) => option.correct);
  const spendingScene = brief.sceneVersions.find((scene) => scene.version.includes("团购") && scene.version.includes("停车费") && scene.version.includes("AA"));
  const bridePriceFlow = `${openingText} ${brief.sceneVersions[0]?.version ?? ""}`;
  assertIncludes(brief.sceneVersions[0].version, "工资卡最清楚", "第一段必须承接女方索要流水后男方只交工资账户，不能残留无缘无故主动发图");
  assertIncludes(requestedFlowQuestion?.answer, "觉得他在跟我压价", "玩家必须问出咨询者为何不信男方拿不出而要求流水");
  assertIncludes(salaryOnlyQuestion?.answer, "手里就这一张", "玩家必须能问出男方只提供工资账户的材料缺口");
  assert(!salaryOnlyQuestion?.answer?.includes("今晚上麦") && !salaryOnlyQuestion?.answer?.includes("刚才上麦"), "案三夜 A 追问不得提前引用夜 B 上麦后的承认");
  assertIncludes(salaryOnlyQuestion?.logicContract?.sourceDoesNotProve, "其他账户", "工资账户不能被写成男方全部家底");
  assertIncludes(sceneVersionsText, "介绍人", "扩成长案后必须交代体面标签不是单人凭空出现");
  assertIncludes(sceneVersionsText, "第一次正式吃饭", "扩成长案后必须还原第一次饭局现场");
  assertIncludes(sceneVersionsText, "又先跟男方家说", "扩成长案后必须还原介绍链双面话术");
  assert(introducerScene, "扩成长案后必须有介绍人参与的场景");
  assert(dinnerScene, "扩成长案后必须有第一次饭局场景");
  assert(mbaScene, "MBA 必须是追问后才揭示出的具体说法，并明确本科学历有落差");
  assert(motiveScene, "案三必须保留学历纠正后彩礼反涨的玩家追问场景");
  assert(!motiveScene.version.includes("手里应该还有不少") && !motiveScene.version.includes("手里肯定还有积蓄"), "固定陈述不能在玩家选择前说出女方父母的财力推断");
  assertIncludes(requestedFlowQuestion?.suspicionLabel, "不信他说拿不出", "玩家按钮必须只点出男方已经拒绝、女方仍要求流水的怀疑方向");
  assertIncludes(requestedFlowQuestion?.question, "为什么还是不信", "财力误判必须由玩家选择后交给主播问出");
  assertIncludes(requestedFlowQuestion?.answer, "不可能连彩礼都拿不出", "玩家追问后才可暴露女方父母把自费 MBA 当成现有家底");
  assertIncludes(complicityQuestion?.suspicionLabel, "有没有叫停", "后续玩家问题必须推进到咨询者知情后的动作，不能重复揭示财力推断");
  assertIncludes(complicityQuestion?.answer, "没有让她收回来", "咨询者必须承认自己没有撤回二十八万八");
  assert(spendingScene, "收入疑点必须来自日常观察而不只是截图缺边");
  assertIncludes(bridePriceFlow, "二十八万八拿不出来", "案三必须先让男方拒绝二十八万八");
  assertIncludes(bridePriceFlow, "工资账户", "案三必须把女方索要流水与男方只交工资账户接在拒绝之后");
  assertIncludes(bridePriceFlow, "二十八万六", "案三必须让工资账户二十八万六成为局部材料，而非主动展示完整家底");
  assertEqual((proofScene?.version?.match(/二十八万六/g) ?? []).length, 0, "案三开场报过二十八万六后，首场固定陈述不得再次完整报数");
  assertIncludes(JSON.stringify(brief), "宸直那三十万", "案三必须把女方家尚未到期的资产带回第二夜");
  assertIncludes(JSON.stringify(brief), "九月底到期", "案三必须明确宸直在案三阶段只到约定期限，不能提前宣布暴雷");
  assertIncludes(brief.deepFollowup?.question, "自己现在有多少存款", "满格后必须把当前可用资金问回来电人");
  assertIncludes(brief.deepFollowup?.answer, "八万四", "深入一问必须用具体数字揭示咨询者自己的存款");
  assertIncludes(brief.deepFollowup?.answer, "六万", "深入一问必须让咨询者报出愿意承担的婚礼资金上限");
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
      assert(/说不清|不确定|可能|转述|父母|家里|妈妈|朋友|平台|面子|体面|被问|借.*嘴|双方|一边|一半|误会|不信任|被筛|表演|试探|委屈|安全感|脆弱|像一家人|最懂|老板娘/.test(text), `${brief.plotId} 必须有灰区动机或不明确推手`);
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

test("DAILY-010", "daily scenes expose bounded core issue questions per beat", () => {
  Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`))
    .forEach((brief) => {
      (brief.sceneVersions ?? []).forEach((scene, sceneIndex) => {
        const issueQuestions = (scene.questionOptions ?? []).filter((option) => option.contradiction);
        assert(issueQuestions.length >= 1 && issueQuestions.length <= 2, `${brief.plotId} 第 ${sceneIndex + 1} 段只能有 1-2 个核心问题追问`);
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
      assert(sceneCount >= 5, `${brief.plotId} 精选集单案必须有足够句子支撑二十分钟玩法`);
      brief.sceneVersions.forEach((scene, index) => {
        assert((scene.questionOptions ?? []).length >= 2, `${brief.plotId} 第 ${index + 1} 段必须有多个追问角度`);
        assert((scene.questionOptions ?? []).length <= 4, `${brief.plotId} 第 ${index + 1} 段不能超过四个追问，手机端会反应不过来`);
      });
    });
});

test("DAILY-014", "final quote choice changes the result angle", () => {
  Array.from({ length: 8 }, (_, index) => dailyCase(`2026-06-${String(24 + index).padStart(2, "0")}`))
    .forEach((brief) => {
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
  assertIncludes(brief.deepFollowup?.question, "公司", "满格深问必须能追公共事件里的风险位置");
  assert(dailyAccusationChoices(brief).some((choice) => /返款|审批/.test(choice.label)), "最终挑句必须包含职场事件原话");
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
  assert(!/plotId/.test(stateSource), "旧存档迁移不能继续按具体 plotId 写分支；应按旧文本或统一 route schema 迁移");
  const migrated = migrateState({
    profileDone: true,
    caseMode: "unknown-mode",
    caseBriefs: generateCasesForMode("daily", NPCS, attrs, { dailyKey: "2026-06-24" }),
    settings: { textSpeed: "fast" }
  });
  assertEqual(migrated.caseMode, "episode", "未知旧模式必须迁移为案件包入口");
  assertEqual(migrated.settings.textSpeed, "fast", "存档迁移必须保留文本速度设置");
  assertEqual(migrated.settings.contentWarningAccepted, false, "存档迁移必须补内容警示默认值");
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
  assertIncludes(anniversary.version, "他看中一瓶，我说太贵了", "继续旧存档时必须刷新为当前点酒因果，不能继续播放旧案件快照");
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
  assertEqual(overnight.dayScenesDone.join("|"), "day-accounting", "已删除的旁听场景不能继续算作完成地点");
  assertEqual(overnight.dayBudget.remaining, 1, "删除旧场景后必须退回对应的一格白天时间");
  assertEqual(overnight.activeDaySceneId, null, "活动中的旧场景 id 必须清掉");
  assertEqual(overnight.callbackOpenerId, null, "旧场景带回的回拨开场必须清掉");
  assertEqual(overnight.earnedItems.join("|"), "周会计的时间线", "只保留当前台本仍能使用的带回物");
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
  assertEqual(night.inventory.join("|"), "approval-page-reviewed", "旧顾问库存必须折叠成一份审批页缺口");
  assertEqual(night.interludeActionsDone.join("|"), "recheck-approval-page", "旧顾问行动进度必须迁到当前行动并去重");
  assertEqual(night.interludeChoicesDone.length, 0, "已删除的顾问选项不得留在存档里");
  assertEqual(Object.keys(night.interludeActionChoices).length, 0, "已删除的顾问分流记录不得继续参与界面渲染");
  assertEqual(migrated.caseOvernights.workplace.earnedItems.join("|"), "审批页缺口", "旧回拨物必须折叠成当前玩家可见名");
  assertEqual(migrated.caseOvernights.workplace.callbackOpenerId, "审批页缺口", "已选旧 opener 必须迁到当前审批页 opener");
  assert(migrated.caseActionLog.workplace["interlude:recheck-approval-page"], "旧行动日志必须保留完成状态");
  assertEqual(Object.keys(migrated.delegationPicks).length, 0, "已删除委托的顾问回单不得继续出现在案卷");
  assertEqual(migrated.earnedItems.join("|"), "审批页缺口", "旧全局收获不得泄漏内部名称");
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

test("RUNTIME-008", "overnight helpers gate day budget and callback openers", () => {
  const [brief] = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const structure = overnightStructureFor(brief);
  assert(structure, "案 1 必须启用 overnightStructure");
  const anchorIndex = overnightAnchorSceneIndex(brief);
  assert(anchorIndex >= 0, "隔夜锚点必须命中场景");
  assertEqual(brief.sceneVersions[anchorIndex].id, "credit-eight-wan-bill", "隔夜锚点必须落在信用卡三桶审计拍");
  assertIncludes(JSON.stringify(brief.sceneVersions[anchorIndex].questionOptions ?? []), "至少三万五", "隔夜锚点所在场景必须实际问到未说明缺口");
  assert(shouldEnterOvernightHangupAfterScene(brief, anchorIndex), "审计拍完成后必须进入隔夜挂断");
  assertEqual(overnightFirstNight2SceneIndex(brief), anchorIndex + 1, "夜 2 必须从锚点后下一段开始");
  const initial = initialOvernightStateFor(brief);
  assertEqual(initial.dayBudget.remaining, 2, "白天初始预算必须来自 JSON");
  assert(!canEnterOvernightCallback(brief, initial), "第一案不能跳过白天调查直接进入第二夜");
  assert(!canEnterOvernightCallback(brief, { ...initial, dayScenesDone: ["day-accounting"] }), "第一案只去一处时还不能进入第二夜");
  assert(canEnterOvernightCallback(brief, { ...initial, dayScenesDone: ["day-accounting", "day-bank-flow"] }), "第一案完成两处调查后必须允许进入第二夜");
  assertEqual(daySceneById(brief, "day-accounting")?.body?.earnedItemId, "周会计的时间线", "周会计档案室必须产出可带回夜里的时间线");
  assertEqual(daySceneById(brief, "day-bank-flow")?.body?.earnedItemId, "流水圈注", "流水圈注必须正式进入 overnight earnedItems");
  const timeline = daySceneById(brief, "day-accounting")?.body?.timelineSort;
  assert(JSON.stringify(timeline?.cards) !== JSON.stringify(timeline?.correctOrder), "时间排序不能把卡片按正确顺序直接摆好");
  assert(!daySceneById(brief, "day-home"), "案1 白天地图不应再要求玩家回家解锁赵律师");
  assert(!brief.overnightStructure.postHangupContact, "案1 收麦后不应增加赵律师说教段");
  assert(!brief.delegation, "案1 不应保留与白天查账重复的顾问委托");
  assert(!nightActionById(brief, "zhao-zhou-frame"), "案1 幕间不应为了展示系统强塞赵律师与周会计二选一");
  const historyAction = nightActionById(brief, "recheck-history-pages");
  assertEqual(historyAction?.kind, "evidencePass", "案1 幕间应让玩家自己翻往期账页");
  assert(historyAction?.focusCheckIds?.includes("credit-history-pages"), "案1 往期账页行动必须接到对应材料检视");
  assert(historyAction?.grantsInventory?.includes("history-pages-reviewed"), "案1 自己翻账后必须带回可改变第二夜开场的结果");
  assert(overnightCallbackOpenerById(brief, "往期账页"), "案1 自己翻出的日期规律必须有第二夜开场");
  assert(!daySceneById(brief, "day-restaurant"), "案 1 白天不得把已删除的同席戏伪装成餐厅访问继续重复订座事实");
  assert(!daySceneById(brief, "day-cafe-sitin"), "案 1 白天不得恢复同席旁听");
  const supportPayments = daySceneById(brief, "day-support-payments");
  assertEqual(supportPayments?.body?.choice?.options?.length, 2, "房租账页必须让玩家选择先问住户还是是否另付");
  assert(supportPayments?.body?.choice?.options?.every((option) => option.grantsEarnedItemId), "房租两岔必须产出不同带回物");
  assert(supportPayments?.body?.choice?.options?.every((option) => (option.resultBeats ?? []).length || option.resultText), "房租两岔必须在选择后才圈出对应缺口");
  const supportDialogue = JSON.stringify(supportPayments ?? {});
  assert(!/(服务员|邻桌常客)/.test((supportPayments?.body?.cast ?? []).join("")), "房租账页不能继续塞入偶遇的餐厅证人");
  assert(!supportDialogue.includes("今天第三拨"), "案 1 白天不能让陌生 NPC 凭空认出直播观众");
  const openers = availableOvernightCallbackOpeners(brief, ["周会计的时间线", "两个月一次的房租"]).map((opener) => opener.id);
  assert(openers.includes("周会计的时间线"), "带回周会计时间线必须解锁时间线回拨");
  assert(openers.includes("两个月一次的房租"), "圈出两笔双月房租必须解锁由咨询者本人确认住户的回拨");
  assert(availableOvernightCallbackOpeners(brief, ["房租是不是另外付的"]).some((opener) => opener.id === "房租是不是另外付的"), "并排固定转账和房租必须改变第二夜第一句");
  assert(availableOvernightCallbackOpeners(brief, ["流水圈注"]).some((opener) => opener.id === "流水圈注"), "流水圈注必须改变第二夜第一句");
  assert(!overnightCallbackOpenerById(brief, "餐厅拒绝核对"), "已在夜 A 承认的订座事实不得再生成餐厅回拨");
  assert(!overnightCallbackOpenerById(brief, "常客的轮订规律"), "随机常客的无来源判断不得保留为带回物");
  assertIncludes(JSON.stringify(overnightCallbackOpenerById(brief, "两个月一次的房租")?.firstConflict ?? {}), "是我住的", "房租住户必须在主播问出方向后由咨询者本人确认");
  assertIncludes(JSON.stringify(overnightCallbackOpenerById(brief, "房租是不是另外付的")?.firstConflict ?? {}), "房租算在每月一万七千五里面吗", "房租另付路线必须把固定转账和住房支出分开问");
  assert(!(brief.documents?.find((document) => document.id === "case1-bank-flow")?.rowQuestions?.r01b), "完整流水不得在房租路线之后再次问同一个住户事实");
  const creditBillScene = brief.sceneVersions.find((scene) => scene.id === "credit-eight-wan-bill");
  assert(!JSON.stringify(creditBillScene?.questionOptions ?? []).includes("又刷了哪些消费"), "账单固定陈述已经报过消费项目，玩家追问不得再整表复挖");
  assertIncludes(creditBillScene?.questionOptions?.find((option) => option.correct)?.question ?? "", "还差至少三万五", "第一夜第三个承重问题必须落在八万元的金额缺口");
  assertIncludes(creditBillScene?.questionOptions?.find((option) => option.correct)?.answer ?? "", "反正不是乱来的钱", "金额缺口必须逼出男方回避用途、继续催款的原话");
  assertIncludes(creditBillScene?.questionOptions?.find((option) => !option.correct)?.question ?? "", "男装加起来也就五千", "五千元男装只保留为可讨论的外围问题，不能挤占第一夜承重名额");
  const flowOpener = overnightCallbackOpenerById(brief, "流水圈注");
  assertIncludes(flowOpener?.line ?? "", "三月十一号", "流水回拨必须从最早的二十万借款开始");
  assertIncludes(flowOpener?.line ?? "", "澄川金融", "流水回拨必须说清二十万借款的来源");
  assert(!/五月|六月|七月|3301/.test(flowOpener?.line ?? ""), "信托带回物不得在一句里重念后续月份和 3301");
  const trustConflictLines = flowOpener?.firstConflict?.lines ?? [];
  assertEqual(JSON.stringify(trustConflictLines.map((line) => line.role)), JSON.stringify(["host", "caller", "host", "caller", "host", "caller"]), "信托回拨必须拆成三轮一问一答");
  trustConflictLines.filter((line) => line.role === "host").forEach((line) => {
    assertEqual((line.text.match(/[？?]/g) ?? []).length, 1, "信托回拨每轮只允许一个问题");
  });
  assertIncludes(JSON.stringify(trustConflictLines), "十二号十万，十四号又十万", "两笔信托认购必须由咨询者分步念出");
  assertIncludes(JSON.stringify(trustConflictLines), "能翻倍", "信托动机必须由对方曾说过的收益期待进入对话");
  assert(!/四月|五月|六月|七月|王姓|新阳信贷|3301/.test(JSON.stringify(trustConflictLines)), "信托回拨只重开三月，不得顺口汇报后续月份和账户");
  ["旧洞", "新洞", "压的注", "两条都要问"].forEach((summarySlop) => {
    assert(!JSON.stringify(trustConflictLines).includes(summarySlop), `流水回拨不得照抄作者总结腔: ${summarySlop}`);
  });
  const historyPagesOpener = overnightCallbackOpenerById(brief, "往期账页");
  assertIncludes(historyPagesOpener?.line ?? "", "到了七月 8 号，那天是空的", "玩家自己翻出的往期账页只抓七月固定入账中断");
  assert(!/新阳信贷|3301|49,800/.test(historyPagesOpener?.line ?? ""), "往期账页带回物不得让咨询者口头重抄整张流水");
  ["顾问的回话", "赵律师的回话", "周会计排的日子"].forEach((removedOpener) => {
    assert(!overnightCallbackOpenerById(brief, removedOpener), `案1 不得残留无效顾问开场: ${removedOpener}`);
  });
  const sharedPerformanceEcho = brief.overnightStructure?.snapshotEcho?.["both-performed"] ?? "";
  assertIncludes(sharedPerformanceEcho, "订座短信", "共同参与路线只能把具体物件带回第二夜");
  assertIncludes(sharedPerformanceEcho, "你按短信问吧", "共同参与路线必须把订座归属留给玩家追问");
  assert(!/会员号是我的|用自己的会员号订的|订座也是我办的/.test(sharedPerformanceEcho), "共同参与路线不得在第二夜订座场开始前交付会员号和订座主语");
  assert(!sharedPerformanceEcho.includes("男装"), "立场回应不能在一句里重抄信用卡三桶");
  assertEqual((sharedPerformanceEcho.match(/三万五/g) ?? []).length, 1, "立场回应只用一个未决金额接回主线");
  assert(!sharedPerformanceEcho.includes("还能留着"), "立场回应不能用指代不明的作者摘要连接两晚剧情");
  Object.values(brief.overnightStructure?.snapshotEcho ?? {}).forEach((echo) => {
    assert(!echo.includes("给我买的") && !echo.includes("会员号是我的") && !echo.includes("用自己的会员号订的") && !echo.includes("订座也是我办的"), "案 1 夜 B 立场回应只能带回待问材料，不能提前交付后续固定场景的答案");
  });
  assert(!overnightCallbackOpenerById(brief, "他对三万五的沉默"), "删除同席旁听后不得残留由旁听生成的夜 B 开场");
  assert(!brief.lurkerNote, "删除同席原句后不得让麦外来信凭空复现该句");
  assertIncludes(brief.stageJudgement, "八万先别转", "案一结论必须先给出当前可执行决定");
  assertIncludes(brief.stageJudgement, "现在的余额", "案一结论必须要求咨询者说明自己的余额与花销");
  assertIncludes(brief.stageJudgement, "没说清的三万五", "案一结论必须保留信用卡未知缺口");
  assertIncludes(brief.stageJudgement, "他签下的债", "案一结论必须明确男方签下的债不能转给伴侣");
  assert(brief.stageJudgement.length < 90, "案一口播判词不得把材料板所有金额和时间重新念一遍");
  const deviceSeed = brief.sceneVersions.find((scene) => scene.id === "credit-device-benefit");
  const deviceReveal = brief.sceneVersions.find((scene) => scene.id === "credit-bank-flow");
  const loyaltyPayoff = brief.sceneVersions.find((scene) => scene.id === "credit-loyalty-test");
  assert(deviceSeed, "案 1 夜 A 必须保留设备受益种子");
  assert(deviceReveal, "案 1 夜 B 必须保留设备受益揭示");
  assert(loyaltyPayoff, "案 1 夜 B 必须保留催款消息回收");
  assert(!JSON.stringify(deviceSeed?.sceneCloser ?? {}).includes("两件事我听明白了"), "案一设备场尾不得用审计清单复述刚听完的两项事实");
  assertIncludes(deviceSeed.version, "投资", "案 1 夜 A 只能先种下投资话术");
  const deviceRevealText = JSON.stringify(deviceReveal ?? {});
  const deviceCoreQuestion = deviceReveal?.questionOptions?.find((option) => option.correct);
  assertIncludes(deviceReveal?.version ?? "", "是给我买的", "设备段必须由咨询者直接承认物件是买给自己的");
  assertIncludes(deviceCoreQuestion?.answer ?? "", "八万都算我头上", "设备段必须把一万二放回八万元总额");
  assertIncludes(deviceCoreQuestion?.question ?? "", "只说那套设备放在你家", "设备追问必须从第一夜已经说出的送达事实继续问受益人");
  assertIncludes(deviceCoreQuestion?.question ?? "", "没说东西就是给你买的", "设备追问不得谎称第一夜完全没有提过设备");
  assertIncludes(deviceCoreQuestion?.answer ?? "", "这一万二是花在我身上", "咨询者必须承认一万二是自己的直接受益");
  assertIncludes(deviceCoreQuestion?.answer ?? "", "没签那个分期", "设备受益不能吞掉分期签字边界");
  ["把灯拖过来", "金属灯架", "拍到凌晨一点", "开箱那晚", "sfx.case1.lamp-drag"].forEach((retiredBeat) => {
    assert(!deviceRevealText.includes(retiredBeat), `设备段不得再用旧版表演重复证明归属: ${retiredBeat}`);
  });
  const loyaltyLead = JSON.stringify(loyaltyPayoff.beforeVersion?.lines ?? []);
  assertIncludes(loyaltyLead, "前面还是『抱抱』，后面就变成还款日了", "案 1 催款回收必须比较本轮玩家已经听见的两条消息");
  assertIncludes(loyaltyLead, "你手里少说有十五万，我只让你先拿八万", "案 1 必须让男方的八万元请求落到可听见的余额估算");
  assertIncludes(loyaltyLead, "你住的房租也是我另外付", "即使玩家白天跳过房租账页，第二夜男方消息也必须提供住户与另付关系的共通来源");
  assertIncludes(JSON.stringify(loyaltyPayoff.beforeVersion?.lines ?? []), "房租是他另外付的", "固定第二夜对话必须让咨询者确认男方消息中的房租事实，不能假定玩家已经完成可选调查");
  assert(!/跟上回|跟上次|又是老样子/.test(loyaltyLead), "案 1 不得用玩家从未听过的过去事件补足催款模式");
  assert(!loyaltyLead.includes("语音"), "案 1 语音到达前的场前对白不得提前引用语音");
  assertEqual(loyaltyPayoff.entryQuestion, "接着呢？", "案 1 语音到达前只能顺接消息，不能提前追问尚未出现的语音");
  assertEqual(loyaltyPayoff.beforeVersion?.lines?.[3]?.text, "抱抱来得挺是时候。先看他后面还说什么。", "案 1 相邻反制拍不得重复要求咨询者别回消息");
  assertIncludes(brief.deepFollowup?.question ?? "", "至少有十五万", "案 1 满格深问必须从男方估算追到当前余额");
  assertIncludes(brief.deepFollowup?.answer ?? "", "一万一千六百多", "案 1 咨询者必须报出真实余额");
  assertIncludes(brief.deepFollowup?.answer ?? "", "十四个月的钱，基本花完了", "案 1 咨询者必须承认固定给付已经基本花完");
  const loyaltyPressureLines = loyaltyPayoff.afterVersion?.lines ?? [];
  const loyaltyPressureText = JSON.stringify(loyaltyPressureLines);
  assertIncludes(loyaltyPressureText, "解除劳动合同补偿金", "案 1 消息突袭必须用授权材料回收‘奖金晚发’的真实名目");
  assertIncludes(loyaltyPressureText, "月工资三万五", "案 1 离职结算通知必须与工资流水口径一致");
  assertIncludes(loyaltyPressureText, "怕你马上问那两笔钱", "案 1 男方必须同时承认保护性动机与躲避固定转账追问");
  assertIncludes(loyaltyPressureText, "这话不是他说的，是我自己想到的", "案 1 消息突袭必须让咨询者自然纠正自己补出的结婚联想");
  assertIncludes(loyaltyPressureText, "我以前总跟朋友夸他对我好", "案 1 咨询者必须说出不愿立刻拒绝的自我形象压力");
  assertIncludes(loyaltyPressureText, "我没转，也一直没把话说死", "案 1 必须把犹豫落到尚未明确拒绝，不能虚构再次打开转账页面");
  assert(!loyaltyPressureText.includes("把转账页点开"), "案 1 第二夜不能把第一夜已经发生的打开转账页写成新动作");
  assertIncludes(loyaltyPressureText, "他头一回开口就是八万", "案 1 必须让咨询者自己说出‘头一回开口’与八万元金额之间的压力");
  assertIncludes(loyaltyPressureText, "只说拿不出来，没说过不想给", "案 1 主播必须指出咨询者一直用余额回避明确拒绝");
  assertEqual(JSON.stringify(loyaltyPressureLines.map((line) => line.role)), JSON.stringify(["host", "caller", "host", "caller", "host", "caller", "pause", "caller", "caller", "host", "caller"]), "案 1 消息突袭必须先核对补偿金，再让咨询者自然改口并由主播用金额反制");
  assert(!deviceSeed.version.includes("八万里面"), "案 1 夜 A 先交代赠礼理解，不提前替玩家完成八万元内的受益归类");
  assert(!(deviceSeed.questionOptions ?? []).some((option) => /实际服务过咨询者账号|收了设备/.test(option.contradiction ?? "")), "案 1 夜 A 的矛盾入账不得提前公布设备受益结论");
  assertEqual(brief.callMedium, "voice", "案 1 必须保持纯语音连线");
  assertIncludes(deviceReveal.beforeVersion?.lines?.[0]?.text ?? "", "放在你家的拍摄设备", "案 1 夜 B 只能复述第一夜已经出现的设备位置");
  assertIncludes(deviceReveal.beforeVersion?.lines?.[0]?.text ?? "", "到底是给谁买的", "案 1 夜 B 必须把设备受益人留给玩家追问");
  assert(!(deviceReveal.beforeVersion?.lines?.[0]?.text ?? "").includes("一直是你在用"), "案 1 夜 B 提问不得把尚未回答的持续使用事实伪装成昨夜已知");
  ["共享屏幕", "镜头", "看了眼墙边"].forEach((visualLeak) => {
    assert(!JSON.stringify(deviceReveal).includes(visualLeak), `案 1 纯语音设备揭示不得依赖视觉信息: ${visualLeak}`);
  });
  assert(!overnightCallbackOpenerById(brief, "流水圈注")?.firstConflict?.hostLine?.includes("这条边"), "流水圈注第一轮追问不得向玩家暴露创作黑话");
  const couplingSkill = readFileSync(new URL("../project-skills/detective-plot-coupling-review/SKILL.md", import.meta.url), "utf8");
  assertIncludes(couplingSkill, "同席特许的当面句允许在麦外来信复现一次，复现即人物", "侦探结构 skill 必须写明 lurker 同席回声特许");
  [`会员号追问${"边"}`, `常客轮订${"边"}`, `旁听·订座与${"灯"}`, `旁听·五万拒${"答"}`].forEach((legacyName) => {
    assert(!JSON.stringify(brief).includes(legacyName), `案 1 不得再暴露黑话带回名: ${legacyName}`);
  });
  const callerQuestion = overnightCallerQuestionFor(brief);
  assertEqual(callerQuestion?.prompt, "你都问到这里了，总不能还让我把这八万转过去吧？", "她的那一问必须暴露自己想从主播这里拿到明确支持");
  assertIncludes(JSON.stringify(callerQuestion?.options ?? []), "不能替你证明自己一分钱都不欠", "主播必须拒绝替咨询者把过去的给付一笔勾销");
  assert(!callerQuestion.options.find((option) => option.id === "dont-answer-for-her")?.requiresEarnedItem, "不替咨询者作答必须成为常驻选项");
  assertEqual(overnightReturnPostureFor({ id: "caller-benefited" }), "againstCaller", "中段先怪她必须让回拨防御");
  assertEqual(overnightReturnPostureFor({ id: "respondent-shifted-debt" }, "defensive"), "againstCaller", "幕间 defensive nudge 必须覆盖中段快照进入隔夜姿态");
  assertEqual(overnightReturnPostureFor({ id: "caller-benefited" }, "open"), "withCaller", "幕间 open nudge 必须覆盖中段快照进入隔夜姿态");
  assertEqual(availableOvernightCallbackOpeners({ id: "plain" }, ["周会计的时间线"]).length, 0, "无 overnightStructure 的旧案不应暴露隔夜 opener");
});

test("RUNTIME-008A", "non-contiguous night scenes skip archived beats without blocking the finale", () => {
  const [brief] = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  assertEqual(playableSceneIndexes(brief).join("|"), "0|1|2|3|6|7", "案一运行时只应包含两夜登记的六个场景");
  assertEqual(playableSceneCount(brief), 6, "案一 HUD 与结案门槛必须按六个实际场景计数");
  assertEqual(nextPlayableSceneIndex(brief, 3), 6, "第二夜必须越过归档场景 4、5，直接进入下一个有效场景");
  const done = new Set([0, 1, 2, 3].map((index) => `version:${index}`));
  assertEqual(firstUnansweredSceneIndex(brief, (key) => done.has(key)), 6, "未回答场景查找不得把归档场景重新塞回流程");
  const allActiveDone = new Set(playableSceneIndexes(brief).map((index) => `version:${index}`));
  assertEqual(answeredSceneCountForState({ caseActionLog: { [brief.id]: Object.fromEntries([...allActiveDone].map((key) => [key, true])) } }, brief), 6, "完成数必须忽略归档场景");
});

test("RUNTIME-009", "case 2 moves shop observation and table comparison into a two-stop day map", () => {
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const brief = briefs.find((item) => item.runtimeContentCaseId === "02-tony");
  assert(brief, "案 2 必须存在");
  const nightStructure = nightStructureFor(brief);
  assert(nightStructure, "案 2 必须保留两段连线结构");
  assert(shouldEnterHangupAfterScene(brief, 3), "案 2 第四段材料结束后必须真正进入跨夜挂断");
  assertEqual(overnightAnchorSceneIndex(brief), 3, "案 2 的隔夜锚点必须能命中第四段场尾的敲门，不得要求把动作硬塞进陈述正文");
  assert(shouldEnterOvernightHangupAfterScene(brief, 3), "案 2 敲门场尾结束后必须进入隔夜挂断");
  assertEqual(overnightFirstNight2SceneIndex(brief), 4, "案 2 第二夜必须从敲门后的下一段开始，不能重播第一夜场尾");
  assertIncludes(JSON.stringify(brief.sceneVersions?.[3]?.sceneCloser ?? {}), "外面怎么这么亮", "案 2 第四段场尾必须把窗外强光呈现给玩家");
  assertIncludes(nightStructure?.hangup?.line ?? "", "可能是物业", "案 2 第一夜必须保留咨询者含糊离线的借口");
  assertIncludes(nightStructure?.hangup?.hostLine ?? "", "听见敲门", "案 2 挂断页必须让主播听见背景敲门");
  assertEqual(nightStructure.interlude?.budget, 1, "案 2 短幕间最多支出一步");
  assertEqual(nightStructure.interlude?.maxActions, 1, "案 2 短幕间不能和白天地图库叠满");
  assert(!(nightStructure.callbackOpeners ?? []).length, "案 2 存在 overnightStructure 时不得保留第二套 opener 表");
  assert(!nightActionById(brief, "visit-lin"), "标准表对照必须迁入白天地图库，不能继续藏在旧幕间登门");
  assert(!nightActionById(brief, "call-manager-boundary"), "店长拒答已迁出幕间，不得再保留 call-manager-boundary");
  assert(!nightActionById(brief, "shop-sync-interrupt"), "店长拒答已经落在白天门口，短幕间不得再塞一条不改变材料或回拨的微信");
  const structure = overnightStructureFor(brief);
  assertEqual(structure?.dayBudget, 2, "案 2 白天地图库必须四选二");
  assertEqual(structure?.dayScenes?.length, 4, "案 2 白天必须提供四处地点");
  assertEqual(daySceneById(brief, "day-tony-shop-observe")?.kind, "observe", "案 2 必须有店外观察");
  assertEqual(daySceneById(brief, "day-tony-shop-observe")?.body?.choice?.options?.length, 2, "案 2 店外观察必须有两岔现场取舍");
  assert(!daySceneById(brief, "day-tony-shop-observe")?.body?.text?.includes("斜对面"), "店外观察不能隔街听清整段店内对话");
  assert(daySceneById(brief, "day-tony-shop-observe")?.body?.choice?.options?.every((option) => (option.resultBeats ?? []).length || option.resultText), "店外观察两岔必须在选择后产生不同感知结果");
  assertEqual(daySceneById(brief, "day-tony-friend-studio")?.kind, "studio", "案 2 必须有旧店主工作室");
  assertEqual(daySceneById(brief, "day-tony-friend-studio")?.body?.choice?.options?.length, 2, "案 2 工作室必须有标准表/六折两岔");
  assert(daySceneById(brief, "day-tony-friend-studio")?.body?.choice?.options?.every((option) => (option.resultBeats ?? []).length || option.resultText), "工作室两岔必须在选择后才展开各自内容");
  assertEqual(daySceneById(brief, "day-tony-manager-doorstep")?.kind, "doorstep", "案 2 店长拒答必须落在白天门口");
  assertEqual(daySceneById(brief, "day-tony-manager-doorstep")?.body?.earnedItemId, "店长门口拒答", "店长门口必须产出拒答带回物");
  assertEqual(daySceneById(brief, "day-tony-member-docs")?.kind, "document", "案 2 必须能圈会员与培训文档");
  assert(!(structure.dayScenes ?? []).some((scene) => scene.kind === "sitIn"), "案 2 不得再消耗包级同席配额");
  assert(!(structure?.snapshotEcho?.["industry-gray"] ?? "").includes("今天拿培训页一对"), "案 2 固定立场回应不得默认玩家白天一定取得培训页");
  assertIncludes(structure?.snapshotEcho?.["industry-gray"] ?? "", "还是得问清楚", "案 2 行业灰区立场回应必须把可选材料收回为待问问题");
  const initial = initialOvernightStateFor(brief);
  assert(!canEnterOvernightCallback(brief, { ...initial, dayScenesDone: ["day-tony-shop-observe"] }), "案 2 只去一处不能进入第二夜");
  assert(canEnterOvernightCallback(brief, { ...initial, dayScenesDone: ["day-tony-shop-observe", "day-tony-member-docs"] }), "案 2 去满两处后必须允许回拨");
  ["店外称呼观察", "店外服务序列", "店里的标准表", "那次六折", "培训页圈注", "店长门口拒答"].forEach((itemId) => {
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
  assert(callbackTexts.some((text) => text.includes("有人来找我问点事")), "案 2 实际回拨拼装必须先保留咨询者的闪躲");
  assert(callbackTexts.some((text) => text.includes("你现在安全吗")), "案 2 主播必须在正式追问前先确认咨询者安全");
  assert(callbackTexts.some((text) => text.includes("不是物业")), "案 2 咨询者拒绝公开身份时必须先交出一条可追的真话");
  assert(!callbackTexts.some((text) => text.includes("等会儿再问行不行")), "案 2 不得用档期闸门把已知事实硬拖到后场");
  assert(!callbackTexts.slice(0, openerIndex).some((text) => /民警|警车|酒吧|十万/.test(text)), "案 2 带回物 opener 前不得自动交出需要玩家追问的民警、职业和金额");
  const knockWorkScene = brief.sceneVersions.find((scene) => scene.id === "tony-knock-and-work");
  const knockWorkOption = knockWorkScene?.questionOptions?.find((option) => option.correct);
  assertIncludes(knockWorkOption?.question ?? "", "强光和敲门", "案 2 第二夜首个正式场景必须让玩家追问第一夜伏笔");
  assertIncludes(knockWorkOption?.answer ?? "", "敲门的是民警", "案 2 民警身份必须在玩家追问后才揭示");
  assertIncludes(JSON.stringify(knockWorkScene?.sceneCloser ?? {}), "我在酒吧做营销", "案 2 具体职业必须在玩家打开警情后的场尾才进入对话");
  assert(!knockWorkScene?.afterVersion, "案 2 不得在玩家选择前用 afterVersion 提前揭示职业");
  assertIncludes(brief.hostDisclosure?.text ?? "", "现在知道来的是民警", "案 2 结案口播必须回应警情本身");
  assert(/还得(?:等|看)原始记录/.test(brief.hostDisclosure?.text ?? ""), "案 2 警情口播必须保留十万元资金同一性边界");
  assertIncludes(brief.stageJudgement ?? "", "开店项目介绍", "案 2 判词必须点明未经同意使用身份的材料是什么");
  assertIncludes(brief.stageJudgement ?? "", "名字和手机号", "案 2 判词必须称量来电人被写成客源联络人的顶重事实");
  assertIncludes(brief.stageJudgement ?? "", "民警来找你", "案 2 判词必须回应民警上门造成的现实后果");
  assertIncludes(brief.stageJudgement ?? "", "你闺蜜拿过六折，你自己免过一次护理", "案 2 判词必须把来电人得到的优惠与被写成联络人分开");
  assertIncludes(brief.stageJudgement ?? "", "修刘海时手很轻", "案 2 判词必须用具体手艺回收真实照顾，不能只剩销售表格");
  assert((brief.stageJudgement ?? "").length < 190, "案 2 结案口播必须压到一轮能说清的长度，不能重新堆回整张材料板");
  assert(!callbackTexts.slice(0, openerIndex).some((text) => text.includes("宸直")), "案 2 带回物 opener 之前不得出现宸直");
  const otherCallerAction = nightActionById(brief, "other-caller-dm");
  const otherCallerHook = brief.investigationHooks?.find((hook) => hook.id === "tony-other-caller-dm");
  assert(otherCallerAction, "案 2 幕间必须保留回女客私信动作");
  assert(!otherCallerAction?.grantsInventory?.length, "回女客私信动作本身不得授予无消费者的已读物件");
  assert(!JSON.stringify(brief).includes("other-caller-dm-seen"), "案 2 运行时内容不得残留孤儿 other-caller-dm-seen");
  [
    ["side-other", "side-other-caller", "女客拉群立场"],
    ["side-caller", "side-caller-stop", "咨询者止损立场"]
  ].forEach(([replyId, inventoryId, openerId]) => {
    const reply = otherCallerHook?.replyChoices?.find((choice) => choice.id === replyId);
    assertEqual(reply?.grantsInventory?.[0], inventoryId, `案 2 私信回复 ${replyId} 必须授予对应立场`);
    const earned = interludeEarnedItemsForOvernight(brief, [inventoryId]);
    assert(earned.includes(openerId), `案 2 私信回复 ${replyId} 必须映射到 ${openerId}`);
    assert(availableOvernightCallbackOpeners(brief, earned).some((opener) => opener.id === openerId), `案 2 私信回复 ${replyId} 必须解锁 ${openerId}`);
    assert(overnightCallbackOpenerById(brief, openerId)?.firstConflict?.hostLine, `案 2 私信回复 ${replyId} 的 opener 必须有第一轮冲突`);
  });
  [`工作室·标准表${"边"}`, `工作室·六折${"边"}`, legacyDryerId].forEach((legacyName) => {
    assert(!JSON.stringify(brief).includes(legacyName), `案 2 不得再暴露旧带回名: ${legacyName}`);
  });
  assert(overnightCallbackOpenerById(brief, "女客拉群立场")?.firstConflict?.callerLine, "女客拉群选择必须进入夜 B 冲突，不得只改标签");
  const managerHook = brief.investigationHooks?.find((hook) => hook.id === "tony-manager-training-note");
  assert(!managerHook?.material?.includes("“下一次推进”不是店里模板"), "店长后台说明不得重复培训页的承重结论");
  const appSource = runtimeSource;
  const sceneAdvanceSource = readFileSync(new URL("../src/runtime/sceneAdvance.js", import.meta.url), "utf8");
  const nightOvernightSource = readFileSync(new URL("../src/runtime/nightOvernightModel.js", import.meta.url), "utf8");
  const caseScriptwritingSkill = readFileSync(new URL("../project-skills/case-scriptwriting/SKILL.md", import.meta.url), "utf8");
  assertIncludes(appSource, "先圈一行", "流水调查必须要求玩家实际圈行，不能空手记下离开");
  assertIncludes(appSource, "overnightCallbackDialogueLines", "隔夜回拨必须通过统一拼装器保持先行拍顺序");
  assert(appSource.indexOf("${callDialogueHtml(hangupDialogue)}") < appSource.indexOf("<span>${escapeHtml(structure.hangupLine ?? \"\")}</span>"), "隔夜挂断页必须先播来电人与主播的最后一轮，再显示忙音或断线舞台说明");
  assertIncludes(sceneAdvanceSource, 'from "./nightOvernightModel.js"', "sceneAdvance 门面必须继续从隔夜模型导入稳定接口");
  assertIncludes(sceneAdvanceSource, "overnightCallbackDialogueLines,", "sceneAdvance 门面必须显式导出隔夜回拨拼装器，兼容离线打包器");
  assertIncludes(nightOvernightSource, "firstConflict.hostLine", "隔夜 opener 后必须渲染路线专属第一轮冲突");
  assertIncludes(caseScriptwritingSkill, "悬时校验律", "剧本 skill 必须阻止首次玩家无法解析的悬空回溯");
  assertIncludes(caseScriptwritingSkill, "顶重反应律", "剧本 skill 必须要求口播回应警情与人身安全等顶重事件");
});

test("RUNTIME-008B", "night-B snapshot echoes and live counter beats are selected by pure helpers", () => {
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  briefs.forEach((brief) => {
    (brief.stanceSnapshot?.options ?? []).forEach((option) => {
      assert(snapshotEchoFor(brief, { id: option.id }), `${brief.runtimeContentCaseId} 的 ${option.id} 必须在夜 B 归还立场押注`);
    });
    const beat = brief.overnightStructure?.liveCounterBeats?.find((item) => item.afterSceneIndex !== undefined && !item.triggerAny);
    assert(beat, `${brief.runtimeContentCaseId} 必须有夜 B 对手实时反制`);
    assertEqual(liveCounterBeatById(brief, beat.id)?.id, beat.id, `${brief.runtimeContentCaseId} 必须能按 id 取反压拍`);
    assertEqual(liveCounterBeatAfterScene(brief, beat.afterSceneIndex, () => false)?.id, beat.id, `${brief.runtimeContentCaseId} 必须在指定场景后插入反压拍`);
    const followingBeat = liveCounterBeatAfterScene(brief, beat.afterSceneIndex, (key) => key === `liveCounterBeat:${beat.id}`);
    assert(followingBeat?.id !== beat.id, `${brief.runtimeContentCaseId} 已播反压拍不得重复自身`);
  });
  const case2 = briefs.find((brief) => brief.runtimeContentCaseId === "02-tony");
  const choice = case2.overnightStructure.liveCounterBeats
    .find((item) => item.id === "tony-business-letter")
    ?.choices.find((item) => item.id === "ask-person-not-shop");
  assertEqual(choice?.questionOverride?.question, "店名不说了。那列备注，你念你自己那行就行。", "案 2 避开店名路线必须带入备用首问");
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

  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const case2 = briefs.find((item) => item.runtimeContentCaseId === "02-tony");
  assertEqual(liveCounterBeatBeforeScene(case2, 6, () => false)?.id, "tony-trust-screenshot-followup", "案 2 必须在玩家问出民警与职业后独立归还宸直截图");
  assertEqual(
    liveCounterBeatBeforeScene(case2, 6, (key) => key === "liveCounterBeat:tony-trust-screenshot-followup")?.id,
    "tony-comment-benefit-blowup",
    "案 2 宸直截图播完后，评论区爆句仍须在下一段辩解前出现"
  );
  const case3 = briefs.find((item) => item.runtimeContentCaseId === "03-profile");
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
    liveCounterBeatAfterScene(case3, 5, case3Done("profile-family-chat-blowup", "profile-gift-mic-request", "profile-mediation-consent"), case3Marks)?.id,
    "profile-weekend-dinner-cancelled",
    "案 3 双人调解建立后，介绍人才可带回家长取消饭局的现实后果"
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
  assertEqual(giftBeat?.choices?.length, 3, "案 3 礼物插麦必须把处理方式交给玩家，而不是由固定主播台词自动解决");
  assert((giftBeat?.choices ?? []).every((choice) => choice.recapAftertaste), "案 3 每种礼物处理都必须在结案回看中留下余味");
  assertIncludes(giftText, "这几页可以", "案 3 男方必须亲口限定自己授权公开的材料");
  assertIncludes(giftText, "其他账户不公开", "案 3 不得借临时调解公开男方未授权的其他账户");
  const mediationBeat = case3.overnightStructure.liveCounterBeats.find((item) => item.id === "profile-mediation-consent");
  const mediationText = (mediationBeat?.lines ?? []).map((line) => line.text ?? "").join(" ");
  assertIncludes(mediationText, "我的工资我自己说", "案 3 咨询者必须亲口给出自己的公开授权");
  assertIncludes(mediationText, "你们俩都愿意说", "案 3 主播只能在双方同意后接受临时调解");
  assertIncludes(mediationText, "礼物不算谁更有理", "案 3 必须明确付费不能购买主播站队");
  const giftHtml = liveCounterBeatHtml(giftBeat);
  assertIncludes(giftHtml, "gift-counter-beat-card", "案 3 礼物插麦必须有区别于普通后台消息的视觉层");
  assertIncludes(giftHtml, "送出“星河”×1", "案 3 礼物卡必须显示具体刷礼物动作");
  const case4 = briefs.find((item) => item.runtimeContentCaseId === "04-workplace");
  assertEqual(liveCounterBeatAfterScene(case4, 5, () => false)?.id, "work-comment-stupid-blowup", "案 4 蠢话爆句必须先于群内还款截图");
  assertEqual(
    liveCounterBeatAfterScene(case4, 5, (key) => key === "liveCounterBeat:work-comment-stupid-blowup")?.id,
    "work-group-repayment-message",
    "案 4 情绪拍播完后必须继续归还原有群内还款反制"
  );
  const emotionalBeat = case2.overnightStructure.liveCounterBeats.find((item) => item.id === "tony-comment-benefit-blowup");
  const emotionalPick = { choiceId: "soothe" };
  const emotionalHtml = liveCounterBeatHtml(emotionalBeat, emotionalPick);
  assertIncludes(emotionalHtml, "弹幕我来管。你跟我说话，别跟屏幕吵。", "情绪选择后必须显示玩家选中的主播台词");
  assertIncludes(emotionalHtml, "……嗯。你问吧。", "主播台词之后必须继续显示咨询者回应");
  briefs.forEach((caseBrief) => {
    (caseBrief.overnightStructure?.liveCounterBeats ?? []).forEach((counterBeat) => {
      (counterBeat.choices ?? []).forEach((choice) => {
        assert(choice.recapAftertaste, `${caseBrief.runtimeContentCaseId} 的现场压力选择 ${counterBeat.id}/${choice.id} 必须在回看留下余味`);
        assert(!choice.recapAftertaste.includes("主播"), `${caseBrief.runtimeContentCaseId} 的现场压力回看必须使用林旭阳第一人称`);
      });
    });
  });
});

test("RUNTIME-010", "case 3 offers tea house, doorstep, and credential comparison as a two-stop trade-off", () => {
  const brief = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" })
    .find((item) => item.runtimeContentCaseId === "03-profile");
  const nightStructure = nightStructureFor(brief);
  assertEqual(nightStructure?.interlude?.budget, 1, "案 3 短幕间只能支出一次行动预算");
  assertEqual(nightStructure?.interlude?.maxActions, 1, "案 3 短幕间不能和白天地图重复扫点");
  assert(!nightActionById(brief, "profile-cousin-message"), "案 3 幕间不得重复表姐门口承重拍");
  assert(!(brief.investigationHooks ?? []).some((hook) => hook.id === "profile-cousin-family-note"), "案 3 表姐幕间 hook 必须移除");
  assert(!(nightStructure.callbackOpeners ?? []).length, "案 3 存在 overnightStructure 时不得保留第二套 opener 表");
  assert(!nightActionById(brief, "profile-day-route"), "案 3 旧的一地点登门必须迁出幕间");
  const structure = overnightStructureFor(brief);
  assertEqual(structure?.dayBudget, 2, "案 3 白天必须三选二");
  assertEqual(structure?.dayScenes?.length, 3, "案 3 白天必须提供三处调查面");
  assert((structure?.dayScenes ?? []).every((scene) => scene.body?.access), "案 3 每处白天回访都必须显示联系与授权来源");
  assertEqual(daySceneById(brief, "day-profile-teahouse")?.kind, "visit", "案 3 必须到茶馆核两套报价");
  assertEqual(daySceneById(brief, "day-profile-teahouse")?.body?.choice?.options?.length, 2, "案 3 茶馆必须有两岔现场取舍");
  assert(daySceneById(brief, "day-profile-teahouse")?.body?.choice?.options?.every((option) => (option.resultBeats ?? []).length >= 2), "案 3 茶馆两岔必须留下不同的当场确认，不能只换 earnedItem 标签");
  assertEqual(daySceneById(brief, "day-profile-cousin-doorstep")?.kind, "doorstep", "案 3 表姐必须只在门口有限作证");
  assertEqual(daySceneById(brief, "day-profile-credential-docs")?.kind, "document", "案 3 必须并读学历核验与工资账户流水");
  assert(!(structure.dayScenes ?? []).some((scene) => scene.kind === "sitIn"), "案 3 不得增加第二次同席");
  const initial = initialOvernightStateFor(brief);
  assert(!canEnterOvernightCallback(brief, { ...initial, dayScenesDone: ["day-profile-teahouse"] }), "案 3 只去一处不能进入第二夜");
  assert(canEnterOvernightCallback(brief, { ...initial, dayScenesDone: ["day-profile-teahouse", "day-profile-cousin-doorstep"] }), "案 3 去满两处后必须允许回拨");
  const case3OpenerIds = ["两边的完整聊天", "她没核实的两句话", "表姐门口口供", "双份材料圈注", "家里群原话", "饭局停顿回放"];
  case3OpenerIds.forEach((itemId) => {
    assert(availableOvernightCallbackOpeners(brief, [itemId]).some((opener) => opener.id === itemId), `案 3 带回 ${itemId} 必须改变第二夜第一句`);
    assert(overnightCallbackOpenerById(brief, itemId)?.firstConflict?.hostLine, `案 3 带回 ${itemId} 必须改变第二夜第一轮对峙`);
  });
  assertEqual(new Set(case3OpenerIds.map((itemId) => overnightCallbackOpenerById(brief, itemId)?.firstConflict?.hostLine)).size, case3OpenerIds.length, "案 3 每个带回物必须有不同的第一拳");
  assert(interludeEarnedItemsForOvernight(brief, ["family-chat-seen"]).includes("家里群原话"), "案 3 家里群原话必须从幕间同步进 overnight earnedItems");
  assert(interludeEarnedItemsForOvernight(brief, ["profile-dinner-pause-playback"]).includes("饭局停顿回放"), "案 3 饭局停顿回放必须从幕间同步进 overnight earnedItems");
  assertEqual(nightStructure?.interlude?.continueLabel, "进入白天调查", "案 3 幕间结束必须明确进入白天，不能误导为立即回拨");
  assertEqual(nightStructure?.hangup?.stageDirection, structure?.hangupLine, "案 3 挂断舞台指示必须与 overnight 挂断文案对齐");
  assertEqual(nightStructure?.hangup?.hostLine, structure?.hostHoldLine, "案 3 主持人挂断句必须与 overnight 保持单一来源");
  assert(!nightStructure?.hangup?.line?.includes("马上"), "案 3 挂断不能再写成马上回来的软离席");
  assert(!/爸爸|宸直/.test(nightStructure?.hangup?.hostLine ?? ""), "案 3 夜 A 挂断不得点名尚未揭示的父亲或宸直线");
  const incomeCardScene = (brief.sceneVersions ?? []).find((scene) => scene.id === "profile-income-and-card");
  assertIncludes(incomeCardScene?.version ?? "", "还有其他账户", "案 3 最终对峙必须确认男方只交了工资账户，其他账户仍在材料外");
  assertIncludes((incomeCardScene?.afterVersion?.lines ?? []).map((line) => line.text ?? "").join(" "), "其他账户是我的私事", "案 3 必须让男方亲口说明选择性提供流水的边界");
  assertIncludes((incomeCardScene?.afterVersion?.lines ?? []).map((line) => line.text ?? "").join(" "), "那三十万宸直", "案 3 最终对峙必须当面追问女方家尚未到期的资产");
  assert(!incomeCardScene?.version?.includes("只能代表一张工资卡"), "案 3 咨询者不得替材料念证明边界公式");
  assert(!/只能证明|既不能.*也不能/.test((incomeCardScene?.afterVersion?.lines ?? []).map((line) => line.text ?? "").join(" ")), "案 3 主播不得用证明边界三联代替现场说话");
  assert(!incomeCardScene?.sceneCloser, "案 3 不得在最终对峙突然新增四次见面记录表");
  assert(!JSON.stringify(brief).includes("四次见面做了张表"), "案 3 不得用未参与证据链的新道具凑收束");
  assertIncludes(brief.stageJudgement ?? "", "周末那顿饭先取消", "案 3 判词必须落到双方当场可执行的决定");
  const privacyBeat = structure?.liveCounterBeats?.find((beat) => beat.id === "profile-family-chat-blowup");
  assertIncludes(privacyBeat?.choices?.find((choice) => choice.id === "soothe")?.label ?? "", "没有经过你同意", "案 3 家庭群截图爆点必须提供明确的隐私边界选项");
  assertIncludes(privacyBeat?.choices?.find((choice) => choice.id === "soothe")?.label ?? "", "后台先删掉", "未经同意的家庭群截图只能从后台删除，不能暗示此前已经公开上屏");
  assert(!JSON.stringify(privacyBeat).includes("别让弹幕再转"), "未经同意的家庭群截图没有公开来源时，不得写成弹幕已经拿到并转发");
  assert((privacyBeat?.choices ?? []).every((choice) => choice.silent !== true), "案 3 隐私爆点不得把沉默包装成唯一不施压的处理方式");
});

test("RUNTIME-011", "case 4 keeps interlude choices on evidence that changes the callback", () => {
  const brief = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" })
    .find((item) => item.runtimeContentCaseId === "04-workplace");
  assert(!brief.delegation, "案 4 不得保留与审批页复核重复的顾问委托");
  assert(!nightActionById(brief, "zhao-zhou-work"), "案 4 不得再用三位顾问包装同一组材料问题");
  const approvalAction = nightActionById(brief, "recheck-approval-page");
  assertEqual(approvalAction?.kind, "evidencePass", "案 4 幕间应直接核对审批页");
  assert(approvalAction?.focusCheckIds?.includes("work-approval-missing"), "审批页行动必须接到付款缺口材料题");
  assert(approvalAction?.grantsInventory?.includes("approval-page-reviewed"), "核对审批页后必须带回可改变第二夜开场的结果");
  assertEqual(nightStructureFor(brief)?.interlude?.budget, 1, "案 4 短幕间最多支出一步");
  assert(!(nightStructureFor(brief)?.callbackOpeners ?? []).length, "案 4 存在 overnightStructure 时不得保留第二套 opener 表");
  const structure = overnightStructureFor(brief);
  const approvalEarned = interludeEarnedItemsForOvernight(brief, ["approval-page-reviewed"]);
  assert(approvalEarned.includes("审批页缺口"), "案 4 审批页复核必须同步进 overnight earnedItems");
  assert(availableOvernightCallbackOpeners(brief, approvalEarned).some((item) => item.id === "审批页缺口"), "审批页复核必须改变第二夜开场");
  assert(interludeEarnedItemsForOvernight(brief, ["playback-pad"]).includes("垫款回放"), "案 4 垫款回放必须从幕间同步进 overnight earnedItems");
  const leaderInterrupt = nightActionById(brief, "leader-interrupt");
  assert(leaderInterrupt?.choices?.find((choice) => choice.id === "bring-to-callback")?.grantsInventory?.includes("leader-note-hot"), "案 4 带回领导批注必须继续解锁回拨");
  assert(!(leaderInterrupt?.choices?.find((choice) => choice.id === "hold-back")?.grantsInventory ?? []).length, "案 4 压下批注不得再授予孤儿 inventory");
  ["day-work-finance-window", "day-work-supplier-visit", "day-work-breakroom-observe"].forEach((sceneId) => {
    const options = daySceneById(brief, sceneId)?.body?.choice?.options ?? [];
    assertEqual(options.length, 2, `案 4 ${sceneId} 必须有两岔现场取舍`);
    assert(options.every((option) => (option.resultBeats ?? []).length >= 2), `案 4 ${sceneId} 两岔必须产生不同当场信息`);
    assertEqual(new Set(options.map((option) => option.grantsEarnedItemId)).size, options.length, `案 4 ${sceneId} 两岔必须改变不同夜 B 第一拳`);
  });
  assertEqual(structure?.dayBudget, 2, "案 4 白天必须四选二");
  assertEqual(structure?.dayScenes?.length, 4, "案 4 白天必须提供三处走访和一份后台流转记录");
  assert(!/领导批注|供应商内部结算页/.test(structure?.snapshotEcho?.unclear ?? ""), "案 4 固定立场回应不得默认玩家已经取得可跳过的白天材料");
  const documentScene = daySceneById(brief, "day-work-payment-ledger");
  assertEqual(documentScene?.kind, "document", "案 4 必须把报销流转记录接入文档玩法");
  assertEqual(documentScene?.body?.earnedItemId, "她整理的报销时间线", "案 4 圈完记录必须授予同名回拨物");
  const paymentLedger = (brief.documents ?? []).find((document) => document.id === "case4-payment-ledger");
  assertEqual(paymentLedger?.rows?.length, 7, "案 4 报销流转记录必须保留七个行级节点");
  assertEqual(paymentLedger?.rows?.find((row) => row.rowId === "q05")?.date, "九天后", "案 4 财务延后通知必须保留自然语言‘九天后’，不得误写 D+9");
  assertEqual(paymentLedger?.rows?.find((row) => row.rowId === "q06")?.date, "第二天下午", "案 4 供应商内部结算页必须在白天补入，不能在白天文档里提前写成第二晚证据");
  const singleRowQuestions = earnedDocumentQuestionsFor(paymentLedger, ["q02", "q04", "q06"]);
  assertEqual(singleRowQuestions.filter((question) => question.kind === "row").length, 3, "案 4 三条关键行必须各解锁一问");
  const crossedQuestions = earnedDocumentQuestionsFor(paymentLedger, ["q01", "q02", "q04", "q06"]);
  assertEqual(crossedQuestions.filter((question) => question.kind === "cross").length, 2, "案 4 两组跨行矛盾必须能由圈行解锁");
  assert(availableOvernightCallbackOpeners(brief, ["她整理的报销时间线"]).some((item) => item.id === "她整理的报销时间线"), "案 4 报销时间线必须改变第二夜开场");
  assertEqual(daySceneById(brief, "day-work-breakroom-observe")?.body?.choice?.options?.length, 2, "案 4 茶水间观察必须有两岔现场取舍");
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
  assert(!brief.stageJudgement?.includes("答应接活，不是答应"), "案 4 结案不得使用整齐的反题句代替责任与回单事实");
  const firstWorkScene = brief.sceneVersions?.find((scene) => scene.id === "work-title-for-advance");
  assertIncludes(firstWorkScene?.version ?? "", "早点回", "案 4 第一场必须让便利贴进入固定陈述，不能只藏在可跳过的闲聊");
  assertIncludes(brief.stageJudgement ?? "", "完整报销单", "案 4 判词必须给出公司报销需要补齐的具体凭证");
  assertIncludes(brief.stageJudgement ?? "", "供应商的项目返利另查", "案 4 判词必须把供应商项目返利与公司报销分开");
  assert(!/四十三页|只改了字体/.test(brief.stageJudgement ?? ""), "案 4 判词不得用无关劳动怨气挤占两条资金路径");
  assert(!brief.evidenceChecks?.find((check) => check.id === "work-budget-timeline")?.options?.find((option) => option.correct)?.reactionLine?.includes("财务根本还没说延后"), "案 4 材料反应必须像人物现场想起来，而不是分析报告");
});

test("NARRATION-001", "case narration helpers keep critical labels stable", () => {
  assertEqual(accusationLabel({ caseMode: "daily" }, "platform"), "平台 / 第三方操盘", "平台指认标签必须稳定");
  assertIncludes(evidenceInsightFor({
    evidenceCards: [{ type: "转账记录", title: "婚前转账", front: "48 小时内转账", detail: "备注改成共同储备" }]
  }, "money"), "转账记录《婚前转账》", "钱款启发必须优先指出金额/资源证据卡");
  assertIncludes(timelineGapText({ hiddenFacts: ["领证前两天才第一次提借钱"] }), "领证前两天", "时间线启发必须优先指出时间缺口");
  assertIncludes(runCompleteLineFor({ correct: 1, total: 1, caseMode: "daily", playthroughNumber: 1 }), "最热闹的地方", "每日案成功结语必须保留直播吃瓜口吻");
});

test("DOCS-001", "AI intent and large playtest templates stay explicit", () => {
  const aiIntentDoc = readFileSync(new URL("../docs/controlled-ai-intent-schema.md", import.meta.url), "utf8");
  const playtestTemplate = readFileSync(new URL("../docs/playtest-report-template.md", import.meta.url), "utf8");
  const skillSource = readFileSync(new URL("../project-skills/livestream-game-flow-review/SKILL.md", import.meta.url), "utf8");
  assertIncludes(aiIntentDoc, "AI 不新增事实", "受控自由追问文档必须明确 AI 不新增事实");
  assertIncludes(aiIntentDoc, "allowedIntents", "受控自由追问文档必须定义 allowedIntents");
  assertIncludes(aiIntentDoc, "blockedTopics", "受控自由追问文档必须定义 blockedTopics");
  assertIncludes(aiIntentDoc, "离线试玩版必须能不依赖 AI 服务运行", "AI 问答实验不能让试玩版依赖服务端");
  assertIncludes(playtestTemplate, "AI 味", "大测试模板必须记录 AI 味文本问题");
  assertIncludes(playtestTemplate, "早剧透", "大测试模板必须记录早剧透问题");
  assertIncludes(playtestTemplate, "忍耐耗尽进入本案失败", "大测试模板必须覆盖耗尽失败不能接下一路麦");
  assertIncludes(playtestTemplate, "主体内容、匿名来电区、按钮和上一问抽屉不能互相遮挡", "大测试模板必须覆盖 UI 遮挡问题");
  assertIncludes(skillSource, "docs/playtest-report-template.md", "大测试 skill 必须引用统一记录模板");
});

test("DOCS-002", "case writing law keeps reciprocity, callbacks, care echoes, exceptions, and active tails", () => {
  const scriptwritingSkill = readFileSync(new URL("../project-skills/case-scriptwriting/SKILL.md", import.meta.url), "utf8");
  assertIncludes(scriptwritingSkill, "## 温情与尾巴法条", "案本 skill 必须有温情与尾巴法条专节");
  assertIncludes(scriptwritingSkill, "**互惠律**:每包主角至少被照顾 2 次", "互惠律必须要求主角也被照顾");
  assertIncludes(scriptwritingSkill, "**回访律**:结案不等于人物结束", "回访律必须让人物在结案后留下生活信息");
  assertIncludes(scriptwritingSkill, "**关怀动词律**:玩家每案至少一个非侦探动词", "关怀动词必须进入玩家操作");
  assertIncludes(scriptwritingSkill, "**破例即温情条款**:声纹破例是最强温情载体", "声纹破例必须受单次预算约束");
  assertIncludes(scriptwritingSkill, "**活性尾巴律**:钩子=再来动因+信物+兑现形态", "活性尾巴必须具备三件套");
  assertIncludes(scriptwritingSkill, "Keep embodiment in generated reading copies", "玩家身份规则必须覆盖自动生成的连续阅读版");
  assertIncludes(scriptwritingSkill, "Close every branch of the identity loop", "现场压力选择的每一条分支都必须留下回声");
  assertIncludes(scriptwritingSkill, "Establish livelihood pressure once per continuous night", "连续直播不能为了结构重复履历或硬造压力");
  assertIncludes(scriptwritingSkill, "### 慌乱失稳律（来电人）", "案本 skill 必须要求来电人在急压拍出现可听见的失稳");
  assertIncludes(scriptwritingSkill, "逻辑/细节露馅 ≥1 处/案", "慌乱失稳必须落到每案至少一处自利粉饰滑动");
  assertIncludes(scriptwritingSkill, "### 抓破绽·主播加压", "主播双寄存器必须包含抓破绽加压相位");
  assertIncludes(scriptwritingSkill, "攻击对象是那处矛盾/粉饰,不是她这个人", "主播加压必须逼逻辑而不是攻击求助者");
});

test("DOCS-003", "case writing law requires audited adjacent-turn causality", () => {
  const scriptwritingSkill = readFileSync(new URL("../project-skills/case-scriptwriting/SKILL.md", import.meta.url), "utf8");
  const continuityAudit = readFileSync(new URL("../docs/dialogue-continuity-audit.md", import.meta.url), "utf8");
  const adjacencyReview = JSON.parse(readFileSync(new URL("../content/packs/steam-demo-01/dialogue-adjacency-review.json", import.meta.url), "utf8"));
  assertIncludes(scriptwritingSkill, "Adjacent-Turn Contract", "案本 skill 必须把逐话轮承接升级为硬合同");
  assertIncludes(scriptwritingSkill, "Human Causality and Evidence Gate", "案本 skill 必须锁定逐句人类因果与证据来源门禁");
  assertIncludes(scriptwritingSkill, "Micro-Logic Closure Contract", "案本 skill 必须把承重追问写成可校验的小逻辑合同");
  assertIncludes(scriptwritingSkill, "Observation → hypothesis → confirmation → derived question", "主播推理必须按观察、假设、确认、衍生追问逐层推进");
  assertIncludes(scriptwritingSkill, "spoken premise | exact source | source proves | source does not prove | next legal question", "事实追问必须登记来源及其证明边界");
  assertIncludes(scriptwritingSkill, "sceneCloser", "逐话轮合同必须检查所有分支共用的场尾");
  assertIncludes(scriptwritingSkill, "runtime displays `lines`", "选项同时存在 answer 与 lines 时必须按玩家实际听见的 lines 审查");
  assertIncludes(scriptwritingSkill, "No plot-scheduled withholding", "案本 skill 必须禁止为排剧情而拒答已知事实");
  assertIncludes(scriptwritingSkill, "Cross-night knowledge isolation", "案本 skill 必须禁止夜 A 台词引用夜 B 才发生的承认");
  assertIncludes(scriptwritingSkill, "Hangup does not preview the payoff", "案本 skill 必须禁止挂断句替下一幕点名答案");
  assertIncludes(scriptwritingSkill, "Quoted lines must be traceable", "案本 skill 必须要求主播引用能追溯到玩家已听见的原话");
  assertIncludes(scriptwritingSkill, "Dialogue Humanization Closure", "案本 skill 必须同时执行删总结与口语复述闭环");
  assertIncludes(scriptwritingSkill, "Summary-removal pass", "双层人话闭环必须先删除作者总结");
  assertIncludes(scriptwritingSkill, "Spoken-realization pass", "双层人话闭环必须补回必要的人类复述时序");
  assertIncludes(scriptwritingSkill, "默认信息跳跃律", "案本 skill 必须允许真人对话省略双方已经知道的信息");
  assertIncludes(scriptwritingSkill, "删去开头复述后若问题含义完全不变", "无功能的关键词回声必须被识别为 AI 接缝");
  assertIncludes(scriptwritingSkill, "Speaker-and-evidence conservation", "案本 skill 必须守住第三方原话、拒答和证据强度");
  assertIncludes(scriptwritingSkill, "Row-identity conservation", "案本 skill 必须禁止把相邻流水行压成未经证明的同一笔钱路");
  assertIncludes(scriptwritingSkill, "A named institution already registered in `crossCasePromises`", "案本 skill 必须把跨案具名机构与匿名收款人预算分开");
  assertIncludes(scriptwritingSkill, "A masked surname that only labels one recurring date pattern", "案本 skill 必须把半姓并回日期供血线，不能另造一张身份谜面");
  assertIncludes(scriptwritingSkill, "Ambient Promise Closure", "案本 skill 必须把被注意的偶发声响纳入闭环合同");
  assertIncludes(scriptwritingSkill, "主播对质快案律", "案本 skill 必须约束主播当面对质的证据边界");
  assertIncludes(scriptwritingSkill, "首轮静默律", "快案首轮必须只让玩家听原始问答，禁止提前教学或纠偏");
  assertIncludes(scriptwritingSkill, "咨询因果先于破绽清单", "快案必须先写成一通正常咨询，禁止主播照着价值边界清单逐页换题");
  assertIncludes(scriptwritingSkill, "咨询者不得替主播破案", "快案来电人必须用可信形象和保护性说法掩护漏洞，不能主动提交核心答案");
  assertIncludes(scriptwritingSkill, "对质延迟律", "快案主播必须把前后矛盾留到完整咨询结束后再问");
  assertIncludes(scriptwritingSkill, "反驳不受一问一答限制", "普通咨询的信息量规则不得限制反驳和对质的真实攻防轮数");
  assertIncludes(scriptwritingSkill, "异常举例延迟回问律", "快案中的敏感异常举例必须留给玩家判断，首轮不得替玩家问出答案");
  assertIncludes(scriptwritingSkill, "重大隐瞒不得首问直认", "承重秘密第一次被问到时必须先经过自利狡辩，不能立刻交出答案");
  assertIncludes(scriptwritingSkill, "basisTurnIds", "快案每项对质必须引用至少两处已播原话");
  assertIncludes(scriptwritingSkill, "最小承认与转题", "来电人被问住后必须保留自利反应，不能提交完整自我审计");
  assertIncludes(scriptwritingSkill, "不得再设置圈句池", "快案必须移除圈句预算、评论接力和弹幕裁判");
  assertIncludes(scriptwritingSkill, "结案不能越界", "快案必须允许主播拒绝背书，同时守住未经证实的身份与经历边界");
  assertIncludes(scriptwritingSkill, "警笛靠近、停在楼下", "警笛从普通噪声升级为承重伏笔的边界必须写清");
  assertIncludes(scriptwritingSkill, "职业因果律", "剧本 skill 必须要求职业设定推动可见行动");
  assertIncludes(scriptwritingSkill, "职业延迟揭示律", "剧本 skill 必须把第二夜职业揭示留给玩家追问");
  assertIncludes(scriptwritingSkill, "真实照顾不得倒销", "剧本 skill 必须保留反转前真实发生的照顾");
  assertIncludes(scriptwritingSkill, "Beneficiary omission", "剧本 skill 必须允许来电人省略付款受益人，并把归属留给玩家追问");
  assertIncludes(continuityAudit, "双层人话开发闭环", "连贯性审查必须登记删总结与口语化的一般开发闭环");
  assertIncludes(continuityAudit, "定位原句及所有副本", "一般开发闭环必须从真源和所有副本开始");
  assertIncludes(continuityAudit, "第三方拒答必须保持原说话人和原证据强度", "连贯性审查必须禁止主播代述第三方证词");
  assertIncludes(continuityAudit, "防备回答单独登记", "连贯性审查必须覆盖压力下的替代回答");
  assertIncludes(continuityAudit, "对话允许默认的信息跳跃", "连贯性审查必须禁止无功能的关键词回声");
  assertEqual(JSON.stringify([...adjacencyReview.reviewedCaseIds].sort()), JSON.stringify(["01-credit", "02-tony", "03-profile", "04-workplace"]), "试玩四案必须全部保持逐句复审锁定状态");
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const coreOptions = briefs.flatMap((brief) => (brief.sceneVersions ?? []).flatMap((scene) => (scene.questionOptions ?? []).filter((option) => option.correct === true)));
  assertEqual(coreOptions.length, 33, "当前四案承重追问数量变化时必须重新审查微因果合同");
  assert(coreOptions.every((option) => option.logicContract?.premiseAnchor && option.logicContract?.sourceDoesNotProve && option.logicContract?.nextLegalQuestion), "四案所有承重追问必须登记前提、证据边界和下一问上限");
  const loadBearingClosers = briefs.flatMap((brief) => (brief.sceneVersions ?? []).filter((scene) => (scene.sceneCloser?.lines ?? []).some((line) => !["stage", "pause"].includes(line?.role) && line?.nonLoadBearing !== true && line?.text)));
  assertEqual(loadBearingClosers.length, 8, "当前四案承重场尾数量变化时必须重新审查路线独立闭环；无新证据价值的场尾应删除");
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
  assertEqual(JSON.stringify(promptDocs), JSON.stringify(["udio-bgm-production-prompts-v2.md"]), "docs 顶层只能保留仍在生产的 Udio Prompt");
  assertEqual(oneOffDocs.length, 0, "已执行批次、一次性修复单和外部复审不能重新堆回 docs 顶层");
  assertIncludes(docsEntry, "一次性评审意见执行后应转成代码、测试、skill 或 backlog 条目", "文档入口必须写明一次性评审的退出机制");
});

test("DETECTIVE-001", "detective plot coupling method stays explicit", () => {
  const detectiveSkill = readFileSync(new URL("../project-skills/detective-plot-coupling-review/SKILL.md", import.meta.url), "utf8");
  const scriptwritingSkill = readFileSync(new URL("../project-skills/case-scriptwriting/SKILL.md", import.meta.url), "utf8");
  const patternReference = readFileSync(new URL("../project-skills/detective-plot-coupling-review/references/detective-patterns.md", import.meta.url), "utf8");
  const improvementPlan = readFileSync(new URL("../docs/detective-coupling-improvement-plan.md", import.meta.url), "utf8");
  const flowSkill = readFileSync(new URL("../project-skills/livestream-game-flow-review/SKILL.md", import.meta.url), "utf8");
  assertIncludes(detectiveSkill, "False solution", "侦探结构 skill 必须要求误导答案");
  assertIncludes(detectiveSkill, "Missing edge", "侦探结构 skill 必须要求缺口");
  assertIncludes(detectiveSkill, "Quote payoff", "侦探结构 skill 必须要求原话回收");
  assertIncludes(detectiveSkill, "No reveal may depend on a fact the player could not have noticed", "侦探结构 skill 必须守住公平揭示");
  assertIncludes(detectiveSkill, "实物-言语死锁", "侦探结构 skill 必须要求材料边缘和口头说法互相卡死");
  assertIncludes(detectiveSkill, "No pristine victims", "侦探结构 skill 必须禁止无瑕受害者");
  assertIncludes(detectiveSkill, "Ambient promises count too", "侦探结构 skill 必须把被强调的声音、来电和地点变化登记进承诺账本");
  assertIncludes(scriptwritingSkill, "绝不提供“无瑕受害者”", "案本 skill 必须在写作规则中禁止无瑕受害者");
  assertIncludes(scriptwritingSkill, "实物-言语死锁", "案本 skill 必须要求材料板物理疑点锁住口头谎言");
  assertIncludes(patternReference, "Sherlock Holmes", "侦探模式参考必须包含经典可见线索模型");
  assertIncludes(patternReference, "Agatha Christie", "侦探模式参考必须包含群像隐瞒模型");
  assertIncludes(patternReference, "Columbo", "侦探模式参考必须包含压力访谈模型");
  assertIncludes(patternReference, "Ace Attorney", "侦探模式参考必须包含逐句证言/证据回收模型");
  assertIncludes(improvementPlan, "Case 1: Credit Card", "四案改造计划必须覆盖第一案");
  assertIncludes(improvementPlan, "Case 4: Workplace", "四案改造计划必须覆盖第四案");
  assertIncludes(improvementPlan, "sceneVersions[].clueRole", "四案改造计划必须提出内容包线索角色字段");
  assertIncludes(flowSkill, "detective-plot-coupling-review", "直播流程 skill 必须指向侦探结构 skill");
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

const failed = results.filter((item) => !item.ok);
if (failed.length) {
  failed.forEach((item) => {
    console.error(`✗ ${item.id} ${item.name}`);
    console.error(item.error?.stack ?? item.error);
  });
  process.exit(1);
}

results.forEach((item) => console.log(`✓ ${item.id} ${item.name}`));
console.log(`game unit tests passed: ${results.length}`);
