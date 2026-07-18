import { caseModeConfig, generateCasesForMode, normalizeCaseMode, validCaseBriefCount } from "../src/caseModes.js?v=0.20.68";
import { accusationLabel, evidenceInsightFor, runCompleteLineFor, timelineGapText } from "../src/caseNarration.js?v=0.20.68";
import { allCaseContradictions, calculateCaseBudgetMax, calculateCaseOutcome, calculateInspirationMax, calculateIssueCompletion, expectedAccusationForCase, nextInspirationContradictionForCase, relationshipExpectedAccusationForCase, resolveAccusationForCase } from "../src/caseRuntime.js?v=0.20.68";
import { requiredContradictionsForCase, truthBoundaryPromptLimitForCase } from "../src/difficulty.js?v=0.20.68";
import { migrateState } from "../src/state.js?v=0.20.68";
import { CONTENT_ADVISORS, CONTENT_HELPER_NPCS } from "../src/generated/contentPackIndex.js?v=0.23.0";
import { DEFAULT_STORY_PACK_KEY, storyPackCaseCount, storyPackForKey } from "../src/storyPacks.js?v=0.20.68";
import { NPCS } from "../src/story.js?v=0.20.68";
import { dailyAccusationChoices } from "../src/dailyChoices.js?v=0.20.68";
import { AUDIO_CUES, audioCueView } from "../src/audioCatalog.js?v=0.22.0";
import { platformRuntime } from "../src/platformRuntime.js?v=0.20.68";
import { createSaveStore } from "../src/platform/saveStore.js?v=0.20.68";
import { materialOperationOutcome } from "../src/runtime/materialOperation.js?v=0.20.68";
import { audioBusGain, normalizeAudioSettings, updateAudioBusVolume } from "../src/runtime/audioModel.js?v=0.22.0";
import { ambienceCueForBackdrop, audioScenePlan } from "../src/runtime/audioSceneModel.js?v=0.22.0";
import { applyRuntimeCaseContent, isRuntimeLoadedCaseContent, RUNTIME_CASE_CONTENT_STATUS } from "../src/runtime/contentCase.js?v=0.20.68";
import { actionDoneForState, answeredEvidenceCountForState, answeredSceneCountForState, askedDialoguePicksForState, completedSceneExchangeForState, contradictionsForState, latestChoiceReviewRowsForState, routeAxisProfileForState, routeChoicesForState, selectedEvidencePicksForState, selectedInvestigationPicksForState, selectedScenePickForState, truthBoundaryPicksForState, unlockedInvestigationEntriesForState } from "../src/runtime/caseStateSelectors.js?v=0.20.68";
import { dailyConclusionModel, dailyPlayerType, dailyRouteProfile as buildDailyRouteProfile, finalQuoteComparison, investigationBackflowProfile, investigationPickReaction, recapRankLabel, storyCallCountText, storyCommentWall, storyHiddenThreadProfile, storyMaterialProfile, storyObjectProfile, storyPackAftertaste, storyPackAxes, storyPackBestAxis, storyPackClosingLine, storyPlayerType, storyQuoteProfile, storyShareTitle, storyThemeProfile, truthBoundaryAftertaste, truthBoundaryPackProfile, truthBoundaryReview } from "../src/runtime/recapModel.js?v=0.20.68";
import { livePressureProfile, materialPressureReaction, materialPressureSignal, pressuredAnswerVariant, pressurePackProfile, pressureRecapProfile, questionPressureReaction, questionPressureSignal } from "../src/runtime/livePressure.js?v=0.21.1";
import { gamepadAxisDirection, keyboardNavigationIntent, nextFocusIndex } from "../src/runtime/inputNavigation.js?v=0.20.68";
import { splitDialogueSentences } from "../src/runtime/dialoguePresentation.js?v=0.21.0";
import { assertDialogueTexture, dialogueTextureMetrics, spokenPunctuationLeaks } from "../src/runtime/dialogueTexture.js?v=0.22.0";
import { normalizeRouteChoice, routeAxisForChoice, routeAxisProfileFromChoices, routeToneForChoice } from "../src/runtime/routeLog.js?v=0.20.68";
import { routeTrailModel } from "../src/runtime/routeMapModel.js?v=0.20.68";
import { answerKey, applyActionMark, availableCallbackOpeners, availableOvernightCallbackOpeners, canEnterOvernightCallback, casePatienceLost, completeNightAction, dailyAccusationReadiness as accusationReadinessForCase, daySceneById, evidenceAnsweredCount, evidenceAnswerKey, evidenceCheckModel, initialCaseBudget, initialOvernightStateFor, interludeEarnedItemsForOvernight, investigationAnswerKey, investigationBackflowModel, investigationRouteIndexBase, liveCounterBeatAfterScene, liveCounterBeatBeforeScene, liveCounterBeatById, liveCounterBeatTriggerMet, nightActionById, nightStructureFor, overnightAnchorSceneIndex, overnightCallbackOpenerById, overnightCallerQuestionFor, overnightFirstNight2SceneIndex, overnightReturnPostureFor, overnightStructureFor, recordPatienceLostState, retryPatienceLostState, sceneReviewModel, shouldEnterHangupAfterScene, shouldEnterOvernightHangupAfterScene, snapshotEchoFor, unlockedInvestigationEntries } from "../src/runtime/sceneAdvance.js?v=0.22.0";
import { storyInterludeNextLine, storyInterludeObjectLabel } from "../src/runtime/storyInterludeModel.js?v=0.20.68";
import { storyBoundaryRows, storyMaterialRows, storyPackSummaryModel, storyPressureRows } from "../src/runtime/storyPackSummaryModel.js?v=0.20.68";
import { callDialogueHtml, choiceGroupHtml, choiceReviewHtml, flowGroupHtml } from "../src/ui/callFlowView.js?v=0.20.68";
import { audioSettingsPanelHtml } from "../src/ui/audioSettingsView.js?v=0.22.0";
import { formatAudioTime } from "../src/ui/audioController.js?v=0.24.1";
import { dailyCompleteChoicesHtml, dailyCompleteHtml, dailyCompleteShareText } from "../src/ui/dailyCompleteView.js?v=0.20.68";
import { evidenceCheckScreenHtml, evidenceMaterialKind, evidenceMaterialRows, evidenceMaterialThumbHtml, evidenceOperationHtml, investigationBackflowScreenHtml } from "../src/ui/evidenceView.js?v=0.20.68";
import { audioPlaybackControlsHtml, interludePlaybackActionHtml } from "../src/ui/interludeDeskView.js?v=0.21.3";
import { audiencePatienceHudHtml, callerArtForExpression, callerExpressionForView, caseProgressStripHtml, liveCommentStripHtml, portraitLayerHtml, storyPackSummaryHudHtml } from "../src/ui/liveCallView.js?v=0.21.4";
import { liveControlDeckHtml, liveFrameHtml } from "../src/ui/liveFrameView.js?v=0.20.68";
import { finalQuoteComparisonHtml, offMicLettersHtml, solvedRecapFlowView, solvedRecapPagesHtml, truthBoundaryPlaced, truthBoundaryReviewHtml } from "../src/ui/recapView.js?v=0.20.68";
import { routeTrailHtml } from "../src/ui/routeTrailView.js?v=0.20.68";
import { focusedQuestionOptions, playerQuestionLabel, sceneDialogueOptions, sceneQuestionChoicesHtml, sceneQuestionMenuHtml } from "../src/ui/sceneQuestions.js?v=0.23.0";
import { activeSceneExchangeHtml, completedSceneExchangeHtml, keyChoiceExchangeHtml, sceneReviewDoneChoicesHtml, sceneReviewHtml } from "../src/ui/sceneReviewView.js?v=0.21.1";
import { storyInterludeChoicesHtml, storyInterludeHtml } from "../src/ui/storyInterludeView.js?v=0.20.68";
import { caseClosingChoicesHtml, caseClosingHtml, caseTitleChoicesHtml, caseTitleHtml } from "../src/ui/caseTransitionView.js?v=0.20.96";
import { storyPackCompleteHtml, storyPackShareText } from "../src/ui/storyPackCompleteView.js?v=0.20.68";
import { titleScreenHtml } from "../src/ui/titleView.js?v=0.20.68";
import { readFileSync } from "node:fs";

const attrs = { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 };
const results = [];

test("AVG-001", "render-layer sentence splitting preserves quoted sentences and ellipses", () => {
  assertEqual(splitDialogueSentences("她说：「等等。别走！」然后停了……我没回。 ").join("|"), "她说：「等等。别走！」|然后停了……|我没回。", "引号内标点不得拆句，省略号必须保留");
  assertEqual(splitDialogueSentences("这跟八万比——你别管。 ").join("|"), "这跟八万比——|你别管。", "句尾双破折号必须按被打断拍掐断显示");
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
  assert(result.metrics.longRambleCount >= 2, "案 1 必须有至少两段长絮叨");
  assert(result.metrics.interruptionCount >= 2, "案 1 必须有至少两处掐断");
  assertEqual(result.metrics.nonLoadBearingCount, 3, "案 1 必须显式标出三拍生活噪声");
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
          { role: "caller", text: "灯太亮。", nonLoadBearing: true },
          { role: "caller", text: "我去关窗。", nonLoadBearing: true }
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
  const cleanLine = "……写。主责我还想留，钱也得回来。";
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
  return new RegExp(`不是.*而是|真正|听到这里|你把这句记下|抓到的关键|核心风险|债务转移|法律武器|商业阴谋|蓄意诈骗|白莲花|丧尽天良|处心积虑|脑子嗡|提款机|成本归属|满格以后|这通电话|心里咯噔一下|算借款、赠与|借款、赠与|先说第一次提钱|表先放一下|为什么一开始是你垫|按理说活动是大家一起办的|主播你好，我想问一个相亲后暧昧|${awkwardShortJobPhrase}`);
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
  const demoCaseCount = storyPackCaseCount(storyPackForKey(DEFAULT_STORY_PACK_KEY));
  assertEqual(normalizeCaseMode("unknown-mode"), "episode", "未知模式必须归一到案件包");
  assertEqual(normalizeCaseMode("weekly"), "episode", "旧 weekly 链接必须迁移到案件包");
  assertEqual(caseModeConfig("episode").minCases, 1, "案件包模式必须允许章节包长度由内容决定");
  assert(validCaseBriefCount(3, "episode"), "案件包模式不能把三案章节误判为坏存档");
  assert(!validCaseBriefCount(3, "daily"), "单案兼容入口仍然只能保留一案");
  assertEqual(caseModeConfig("daily").expectedCases, 1, "每日案必须只有一案");
  assertEqual(generateCasesForMode("unknown-mode", NPCS, attrs, { dailyKey: "2026-06-24" }).length, demoCaseCount, "未知模式入口必须回落到当前默认案件包");
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
  assertEqual(audioScenePlan({ scene: "nightShellPrologue" }).enterSfxCueId, "sfx.broadcast.on-air", "首夜开播必须触发真实 ON AIR 音效");
  assertEqual(audioScenePlan({ scene: "caseOpen" }).enterSfxCueId, "sfx.phone.connect", "案件接线必须触发真实接通音效");
  assertEqual(audioScenePlan({ scene: "sceneReview", pressureLevel: "low" }).bgmCueId, "bgm.pressure-stem", "耐心偏低时必须切到压力层");
  assertEqual(audioScenePlan({ scene: "overnightCallback" }).bgmCueId, "bgm.callback-return", "第二夜回拨必须使用回拨 cue");
  assertEqual(audioScenePlan({ scene: "liveCounterBeat" }).ambienceCueId, "ambience.studio-line", "实时反压仍在直播中，不能误切到收麦后台声场");
  assertEqual(ambienceCueForBackdrop("day-restaurant"), "ambience.restaurant", "餐厅背景必须映射餐厅环境音");
  assertEqual(ambienceCueForBackdrop("day-studio"), "ambience.archive-studio", "工作室背景必须映射室内工作环境音");
  ["sfx.case1.lamp-drag", "voice.case2.dryer-message", "voice.case3.dinner-pause", "voice.case4.pad-message", "voice.case4.supplier-message"].forEach((cueId) => {
    assert(AUDIO_CUES[cueId], `必要剧情 cue 不得从目录消失: ${cueId}`);
  });
  assertEqual(audioCueView("voice.case2.dryer-message")?.available, false, "未交付资产的 cue 必须安全保持不可播放");
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
  assertEqual(profile.label, "来电人可信度线", "路线画像必须输出玩家可读标签");
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
  assertEqual(latestChoiceReviewRowsForState(selectorState, brief)[1].role, "host", "上一问回看 rows 必须脱离 app.js 组装");
  assertEqual(selectedEvidencePicksForState(selectorState, brief)[0].label, "账单缺口", "材料选择必须能脱离 app.js 读取");
  assertEqual(selectedInvestigationPicksForState(selectorState, brief)[0].label, "朋友圈截图", "回流选择必须能脱离 app.js 读取");
  assertEqual(truthBoundaryPicksForState(selectorState, brief)["true:0"], "true", "事实边界选择必须能脱离 app.js 读取");
  assert(unlockedInvestigationEntriesForState(selectorState, brief).length >= 1, "回流解锁必须能脱离 app.js 计算");
  assertEqual(routeChoicesForState(selectorState, brief)[0].axis, "money-flow", "路线 choices 必须能从已选问题回退生成");
  assertEqual(routeAxisProfileForState(selectorState, brief).axis, "money-flow", "路线画像必须能脱离 app.js 生成");
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
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
  assertEqual(storyPackBestAxis(20, axes).label, "外围听感线", "低揭示率路线画像必须降级成外围听感");
  assertEqual(storyPlayerType(80, bestAxis), "钱流雷达主播", "故事集主播类型必须由纯模型生成");
  assertIncludes(storyShareTitle(80, bestAxis), "钱流结构线", "故事集分享标题必须回收主路线");
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
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
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

test("INVESTIGATION-001", "host investigation backflow is fixed material, not freeform facts", () => {
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
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
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
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
      { question: "剩下那五万多，你问过他是什么吗？", suspicionLabel: "八万里的五万缺口", answer: "问过。", contradiction: "缺口未解释。" },
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
  assertIncludes(directionHtml, "八万里的五万缺口", "方向式节点必须显示玩家选择的疑点短标签");
  assert(!directionHtml.includes("剩下那五万多，你问过他是什么吗？"), "方向式节点在选择前不能暴露主播完整句子");
  assertEqual(playerQuestionLabel(directionScene.questionOptions[0]), "八万里的五万缺口", "玩家可见标签必须优先使用 suspicionLabel");
  assertIncludes(helperClosedHtml, "求助 V哥", "V哥必须只以玩家主动求助入口出现");
  assert(!helperClosedHtml.includes(directionScene.helperHint), "玩家未求助前不能自动显示 V哥提示");
  assertIncludes(helperOpenHtml, directionScene.helperHint, "玩家求助后必须显示当前场景的 V哥提示");
  assert(!helperOpenHtml.includes("求助 V哥"), "提示展开后不应重复提供求助按钮");
  assert(CONTENT_HELPER_NPCS["v-bro"] && !CONTENT_ADVISORS["v-bro"], "V哥必须与专业顾问注册表分离");
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
  assertIncludes(appSource, "./runtime/storyInterludeModel.js", "案间过渡文案模型必须从 app.js 拆到 runtime/storyInterludeModel");
  assertIncludes(storyInterludeModelSource, "storyInterludeObjectLabel", "案间过渡必须从内容包读取下一案物件钩子");
  assert(!appSource.includes("\"lost-job-hidden-credit\": \"backdrop-credit\""), "案件背景 class 必须来自 brief.backdropClass，不能留 app.js plotId 映射");
  assert(!appSource.includes("brief.plotId === \"education-income-fake-profile\""), "存款证明结算特判必须来自内容 JSON 字段，不能留在 app.js");
  assert(!appSource.includes("function conclusionBranchFor"), "案后分支匹配不能继续定义在 app.js");
  assertIncludes(recapModelSource, "conclusionBranchFor", "案后分支结论必须走 recapModel 的内容字段匹配，而不是 plotId 特判");
  assertIncludes(storyInterludeObjectLabel({ storyObjectLabel: "表格" }), "表格", "案间过渡必须用物件钩子接下一通，减少目录感");
  assertIncludes(storyInterludeNextLine({ storyBridge: "后台又亮了一张审批图。" }), "审批图", "案间桥接句必须来自内容包 bridge");
  assert(!appSource.includes("function storyInterludeObjectLabel"), "案间物件名模型不能继续定义在 app.js");
  assert(!appSource.includes("function storyInterludeNextLine"), "案间桥接句模型不能继续定义在 app.js");
  assertIncludes(storyInterludeViewSource, "广告间隙", "案间过渡必须只是节目间隙，不能抢走正式结案职责");
  assertIncludes(storyInterludeViewSource, "下一通 · 材料先到", "案间过渡必须用下一案物件建立钩子");
  assert(!appSource.includes("\"tony-multi-dating\": \"表格\""), "案间物件名必须来自内容包 sequence.objectLabel，不能留 app.js plotId 映射");
  assert(!appSource.includes("\"workplace-reimbursement-screenshot\": \"公司那边也来了截图"), "案间桥接句必须来自内容包 sequence.bridge，不能留 app.js plotId 映射");
  assertIncludes(appSource, "caseClosure", "上一案回看结束后必须进入独立案件结案页");
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
  assertIncludes(interludeDeskViewSource, "advisor-avatar", "顾问分歧必须有可辨识头像槽");
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
  assertIncludes(packageSource, "\"steam:preflight\"", "Steam 发版必须有本地 preflight 检查入口");
  assertIncludes(packageSource, "\"smoke:desktop\"", "桌面 staging 必须有不启动 Electron 的文件烟测");
  assertIncludes(packageSource, "\"smoke:browser\"", "大测试必须有真实浏览器回放 smoke 入口");
  assertIncludes(packageSource, "\"verify:audio\"", "全套校验必须检查音频 cue 与资产状态");
  assertIncludes(packageSource, "\"electron-builder\"", "Windows 打包入口必须声明 electron-builder 依赖");
  assertIncludes(packageSource, "scripts/smoke-desktop.js", "check 必须语法检查桌面烟测脚本");
  assertIncludes(packageSource, "scripts/smoke-browser-replay.js", "check 必须语法检查浏览器回放脚本");
  assertIncludes(packageSource, "scripts/steam-preflight.js", "check 必须语法检查 Steam preflight 脚本");
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
  assertIncludes(browserSmokeSource, "accounting-restaurant", "浏览器回放必须覆盖周会计档案室+餐厅白天路线");
  assertIncludes(browserSmokeSource, "restaurant-document", "浏览器回放必须覆盖餐厅+独立审流水路线");
  assertIncludes(browserSmokeSource, "day map must not allow skipping the required two daytime actions", "浏览器回放必须覆盖白天调查的两处最低门槛");
  assertIncludes(browserSmokeSource, "sceneMode: \"outer\"", "浏览器回放必须覆盖只点外围追问也能继续主线");
  assertIncludes(browserSmokeSource, "data-scene-dialogue", "浏览器回放必须覆盖先问普通问题再点关键追问的流程");
  assertIncludes(browserSmokeSource, "materialMode: \"miss\"", "浏览器回放必须覆盖材料误圈路线");
  assertIncludes(browserSmokeSource, "keyboard-accounting-restaurant", "浏览器回放必须覆盖真实键盘焦点路线");
  assertIncludes(browserSmokeSource, "page.keyboard.press(\"Enter\")", "键盘回放必须用真实键盘确认，而不是只用 DOM click");
  assertIncludes(browserSmokeSource, "gamepad-restaurant-document", "浏览器回放必须覆盖模拟 Gamepad API 路线");
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

test("UI-002", "live-call screens keep a broadcast control-desk identity", () => {
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
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
  const hostDialogueHtml = callDialogueHtml([{ role: "host", text: "你当时怎么回的？" }, { role: "caller", text: "我说先看账单。" }]);
  assertIncludes(hostDialogueHtml, "你当时怎么回的？", "通话气泡必须可由纯 UI 模块渲染");
  assertIncludes(hostDialogueHtml, "林旭阳", "主持人对话框必须使用固定角色名");
  assert(!hostDialogueHtml.includes("<b>你</b>"), "主持人对话框不能再用第二人称作署名");
  assertIncludes(choiceReviewHtml([{ role: "caller", text: "账单只有消费页。" }]), "上一问", "上一问回看必须可由纯 UI 模块渲染");
  assertIncludes(choiceReviewHtml([{ role: "caller", text: "账单只有消费页。" }]), "call-log-drawer", "上一问回看必须升级为通话记录抽屉，而不是普通说明折叠块");
  assertIncludes(appSource, "./ui/liveCallView.js", "直播 HUD/立绘 HTML 必须从 app.js 拆到 ui/liveCallView");
  assertIncludes(appSource, "./ui/liveFrameView.js", "案内主舞台 HTML 必须从 app.js 拆到 ui/liveFrameView");
  assertIncludes(audiencePatienceHudHtml({ level: "mid", ratio: 0.5, remaining: 4, max: 8 }), "听众忍耐", "听众忍耐 HUD 必须可由纯 UI 模块渲染");
  assertIncludes(liveCommentStripHtml({ comments: ["弹幕安静", "账单边上有时间"] }), "账单边上有时间", "直播弹幕条必须可由纯 UI 模块渲染");
  assertIncludes(caseProgressStripHtml({ total: 5, answered: 2, label: "匿名来电" }), "第 3/5 句", "通话进度条必须可由纯 UI 模块渲染");
  assertIncludes(storyPackSummaryHudHtml({ total: 4, solved: 2 }), "2/4", "故事包收麦 HUD 必须可由纯 UI 模块渲染");
  assertEqual(callerExpressionForView({ mood: "thinking", sceneIndex: 1 }).kind, "shift", "来电人表情 fallback 必须可脱离 app 状态测试");
  assertEqual(callerArtForExpression({ neutralSrc: "neutral.png", variants: { guarded: "guarded.png", pause: "pause.png" }, expression: { kind: "shift" } }).src, "guarded.png", "shift 表演必须切到 guarded 立绘");
  assertEqual(callerArtForExpression({ neutralSrc: "neutral.png", variants: { pause: "pause.png" }, expression: { kind: "pause" } }).src, "pause.png", "pause 表演必须切到 pause 立绘");
  assertEqual(callerArtForExpression({ neutralSrc: "neutral.png", variants: {}, expression: { kind: "pause" } }).src, "neutral.png", "缺少差分图时必须安全回退 neutral");
  assertIncludes(portraitLayerHtml({ artSrc: "./caller_pixel.png", artStyle: "pixel" }), "art-pixel", "像素立绘必须给浏览器显式最近邻渲染标记");
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
    scene: { version: "他说只是周转两天。" },
    dialoguePicks: [{ question: "你当时怎么回的？", answer: "我说先看账单。" }]
  });
  assertIncludes(activeExchange, "咨询者", "当前对话气泡组装必须保留来电人 speaker");
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
  assertIncludes(storyInterludeHtml({ nextObjectLabel: "表格", nextLine: "后台又亮了一路麦" }), "表格", "案间过渡必须可由纯 UI 模块渲染下一通物件钩子");
  assertIncludes(storyInterludeHtml({ shellLine: "老方发来消息。", shellLines: [{ speaker: "林旭阳", text: "广告弹幕念错了。" }] }), "广告弹幕念错了。", "案间串场必须能在原旁白前追加主播台词");
  assertIncludes(storyInterludeChoicesHtml(), "接下一路麦", "案间过渡必须用直播节目语言进入下一案标题页");
  const closingCard = caseClosingHtml({
    caseNumber: 1,
    closing: { title: "账单里的八万", verdict: "先别垫。", beats: [{ label: "来电", text: "要八万。" }], confirmed: ["失业早于借钱"], unresolved: ["3301 归属未定"], nextStep: "先对账。" }
  });
  assertIncludes(closingCard, "今晚能确认", "案件结案页必须区分确认事项");
  assertIncludes(closingCard, "今晚不替人定", "案件结案页必须保留未定事项");
  assertIncludes(caseClosingChoicesHtml(), "进入案间", "案件结案页必须在正式收束后才进入案间");
  assertIncludes(caseTitleHtml({ caseNumber: 2, brief: { caseTitle: { title: "理发店排班表", subtitle: "暧昧还是成交", intro: "表到了。" } } }), "第 02 案", "第二案必须有独立案号标题页");
  assertIncludes(caseTitleChoicesHtml(2), "接入第 02 案", "案标题页必须明确接入对应案号");
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
  const titleHtml = titleScreenHtml({ productName: "直播间大侦探", storyPack: true, title: "Steam 试玩版", hook: "热线已经接进来。资料在后台。", object: "热线已接入" });
  assertIncludes(titleHtml, "title-console-strip", "标题页必须先有直播信号状态条，不能只剩普通剧情标题卡");
  assertIncludes(titleHtml, "林旭阳", "标题页必须交代固定主播角色");
  assertIncludes(titleHtml, "热线已接入", "标题页必须像热线接入，不提前列目录");
  assertIncludes(titleHtml, "data-audio-settings", "标题页必须能在开始前调声音");
  assert(!/四案|4\s*案|故事集目录|第一案|第二案|第三案|第四案|主题论点/.test(titleHtml), "标题页不能提前暴露案数、目录或主题论点");
  assertIncludes(liveFrameViewSource, "liveControlDeckHtml", "案内 UI 必须由直播控场台纯 UI 模块统一生成");
  assertIncludes(liveFrameViewSource, "liveFrameHtml", "案内主舞台 HTML 必须由纯 UI 模块生成");
  assert(!appSource.includes("class=\"control-deck\""), "控场台 DOM 不能继续写在 app.js");
  assert(!appSource.includes("live-console-shell"), "案内主舞台骨架 DOM 不能继续写在 app.js");
  const deckHtml = liveControlDeckHtml({ onAirLabel: "匿名热线", label: "看材料", segment: 2, total: 5, pressure: { remaining: 6, max: 8, patienceLabel: "压得住" }, material: "审批图" });
  const firstDeckHtml = liveControlDeckHtml({ onAirLabel: "匿名热线", label: "继续对话", segment: 1, total: 5, pressure: { remaining: 8, max: 8, patienceLabel: "还在听" }, material: "信用卡账单" });
  assertIncludes(deckHtml, "class=\"control-deck\"", "案内主画面必须保留直播控场台侧栏");
  assertIncludes(deckHtml, "deck-live-metrics", "控场台必须有 LIVE 时间和观众数氛围指标");
  assertIncludes(deckHtml, "deck-host-monitor", "控场台必须保留主播监看层，强化玩家在主播台控场");
  assertIncludes(deckHtml, "主播监听", "控场台监看层应像直播监听状态，不要退回抽象的听线小仪表");
  assertIncludes(deckHtml, "当前第 2 段，共 5 段。", "控场台通话进度必须说清当前段落，不能用指代不明的氛围句");
  assert(!deckHtml.includes("麦没断"), "控场台通话进度不能再写“麦没断”这类指代不明文案");
  assertIncludes(firstDeckHtml, "绕问、误指会掉耐心", "第一次进入通话时，听众耐心必须有简短规则提示");
  assert(!deckHtml.includes("绕问、误指会掉耐心"), "听众耐心提示只在首次满格进入时出现，不能常驻挤占控场台");
  assertIncludes(deckHtml, "Viewers", "控场台直播指标必须像直播间状态，不写成玩法分数");
  assertIncludes(deckHtml, "deck-monitor-strip", "控场台必须有麦克风/监听状态，不能只是普通信息卡");
  assertIncludes(deckHtml, "后台材料", "控场台必须把材料作为直播间后台对象呈现");
  assertIncludes(deckHtml, "deck-material-preview", "控场台材料卡必须有缩略图，提升直播后台操作感");
  assertIncludes(deckHtml, "审批图", "控场台必须展示当前后台材料");
  const frameHtml = liveFrameHtml({ productName: "直播间大侦探", modeLabel: "试玩连线", soundEnabled: true, label: "继续对话", chapter: "匿名来电", text: "<p>正文</p>", choices: "<button>继续</button>", visualHud: "<div>HUD</div>", controlDeckHtml: deckHtml, backdropClass: "backdrop-credit", material: "信用卡账单" });
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
  assertIncludes(liveFrameHtml({ text: "<p>正文</p>", screenEffect: "patience-drop" }), "screen-effect-patience-drop", "耐心扣除必须能渲染一次性红色暗角层");
  assertIncludes(liveFrameHtml({ text: "<p>正文</p>", pixelTransition: { eyebrow: "DAY SHIFT", label: "白天调查" } }), "pixel-transition", "大切点必须能渲染像素风过场层");
  assertIncludes(stylesSource, "@keyframes pixel-transition-out", "像素风过场必须由短促分步动画控制");
  assertIncludes(stylesSource, "prefers-reduced-motion: reduce", "像素风过场必须尊重减少动态效果设置");
  assertIncludes(stylesSource, ".screen-effect-material-hit", "材料命中必须有全屏 CRT 扫描反馈层");
  assertIncludes(stylesSource, ".screen-effect-patience-drop", "耐心扣除必须有红闪暗角反馈层");
  assertIncludes(stylesSource, "patienceRedVignette", "耐心扣除红闪必须由短动画控制，不应常驻");
  assertIncludes(appSource, "state.lastScreenEffect = state.lastScreenEffect ?? \"patience-drop\"", "真实消耗耐心时必须触发一次红闪反馈");
  assertIncludes(appSource, "state.lastScreenEffect = null", "屏幕反馈渲染后必须清空，不能存档后反复闪");
  assertIncludes(stylesSource, ".story-grid.case-vn-grid.live-console-shell", "控场台布局必须覆盖普通 VN 单栏布局");
  assertIncludes(stylesSource, ".live-console-shell.has-control-deck > .vn-stage", "桌面主舞台必须明确进入第二列");
  assert(!stylesSource.includes(".case-vn-grid .control-deck { position: absolute"), "控场台不能再被后置 AVG 样式改成遮挡舞台的绝对定位");
  assertIncludes(stylesSource, ".avg-material-modal[hidden]", "材料模态关闭后必须真正退出布局");
  assertIncludes(stylesSource, ".choices-open .avg-material-card", "选择出现时必须收起材料入口，避免两个交互层争抢");
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
  assertIncludes(stylesSource, ".case-portrait::after", "立绘层必须有直播流扫描线/压缩感滤镜");
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
  assertEqual(a.map((brief) => brief.plotId).join("|"), "lost-job-hidden-credit|tony-multi-dating|education-income-fake-profile|workplace-reimbursement-screenshot", "当前 demo 包必须按体面、自己人、条件、主责递进");
  assertEqual(a[0].runtimeContentSource, "content-pack-json", "第一案必须从 content JSON 接管完整运行时内容");
  assertEqual(a[0].runtimeContentCaseId, "01-credit", "第一案必须记录接管它的内容包 caseId");
  assertEqual(a[1].runtimeContentSource, "content-pack-json", "第二案必须从 content JSON 接管完整运行时内容");
  assertEqual(a[1].runtimeContentCaseId, "02-tony", "第二案必须记录接管它的内容包 caseId");
  assertEqual(a[1].callerArtStyle, "pixel", "第二案必须作为像素立绘单案样张进入运行时");
  assertEqual(Object.keys(a[1].callerArtVariants ?? {}).sort().join("|"), "guarded|neutral|pause", "第二案像素样张必须接齐 neutral / guarded / pause 三态");
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
    assert(brief.storyAct && brief.storyBridge && brief.storyObjectLabel && brief.storyInterludeRecap && brief.backdropClass && brief.callerArt, "每案必须有整集里的功能、物件名、桥接句、背景 class、匿名来电人立绘和案间收束句");
    assert(/^\.\/assets\/generated\/callers\/[^?#]+\.png(\?v=[\w.-]+)?$/.test(brief.callerArt), "故事包来电人立绘必须来自匿名 callers 资产目录");
    assert((brief.accusationChoices ?? []).length >= 3, `第 ${index + 1} 案最终收麦原话必须来自内容包`);
    assert(!/故事集|第[一二三四五六七八九十\d]+\s*案|\d+\s*\/\s*\d+|体面|一家人|条件|主责/.test(`${brief.modeLabel} ${brief.storyArcTitle} ${brief.storyCaseLabel}`), "案内可见标题不能像目录或剧透标签");
    assert(brief.sceneVersions.length >= 5 && brief.sceneVersions.length <= 7, `第 ${index + 1} 案必须是 5-7 段来电`);
    if (brief.runtimeLengthPlan?.liveBeatCount !== undefined) {
      assertEqual(brief.runtimeLengthPlan.liveBeatCount, brief.sceneVersions.length, `第 ${index + 1} 案 runtimeLengthPlan.liveBeatCount 必须等于实际段落数`);
    }
    assert(brief.sceneVersions.every((scene) => (scene.questionOptions ?? []).length >= 2 && (scene.questionOptions ?? []).length <= 4), `第 ${index + 1} 案每段必须保留 2-4 个主播问法，兼顾随意提问和关键选择`);
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
  assertIncludes(a[0].storyThemeTitle, "好听的身份", "当前 demo 包必须共享同一主题");
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assertIncludes(appSource, "storyThemeIntro", "标题页必须优先使用故事集开场引子，而不是主题论点");
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
  const runtimeLoaded = applyRuntimeCaseContent(templateBrief, {
    caseId: "case-b",
    runtimeContentStatus: RUNTIME_CASE_CONTENT_STATUS.runtimeLoaded,
    label: "JSON 案",
    openingComplaint: "JSON 开场",
    sceneVersions: [{ version: "JSON 说法" }],
    evidenceChecks: [{ id: "json-evidence" }]
  });
  assertEqual(metadataOnly.openingComplaint, "模板开场", "metadata-only 案件不能覆盖模板台词");
  assert(isRuntimeLoadedCaseContent({ runtimeContentStatus: RUNTIME_CASE_CONTENT_STATUS.runtimeLoaded }), "runtime-loaded 状态必须能被识别");
  assertEqual(runtimeLoaded.label, "JSON 案", "runtime-loaded 案件可以覆盖标题");
  assertEqual(runtimeLoaded.openingComplaint, "JSON 开场", "runtime-loaded 案件可以覆盖开场");
  assertEqual(runtimeLoaded.sceneVersions[0].version, "JSON 说法", "runtime-loaded 案件可以覆盖逐段说法");
  assertEqual(runtimeLoaded.runtimeContentSource, "content-pack-json", "runtime-loaded 覆盖后必须标记内容来源");
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
    "lost-job-hidden-credit": ["撑不住场面", "自己其实很吃那种体面"],
    "tony-multi-dating": ["自己人", "没逼他说清楚"],
    "education-income-fake-profile": ["一万出头", "流水是我先提的"],
    "workplace-reimbursement-screenshot": ["主责，我确实想要", "我来扛"]
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

test("EPISODE-001C", "demo story pack bridges form a four-act escalation", () => {
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const expectedBridgeMarkers = [
    ["账单"],
    ["店", "表"],
    ["资料图"],
    ["公司", "截图"]
  ];
  briefs.forEach((brief, index) => {
    const bridge = `${brief.storyAct ?? ""} ${brief.storyBridge ?? ""}`;
    expectedBridgeMarkers[index].forEach((marker) => {
      assertIncludes(bridge, marker, `第 ${index + 1} 案必须承担故事集四幕推进功能`);
    });
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
  assertIncludes(text, "咨询者先想要主责", "职场报销案应使用角色称谓承接来电人，避免头像和代词冲突");
  assertIncludes(text, "供应商确认人", "职场报销案应使用流程角色承接缺席方，避免性别绑定");
  assertIncludes(text, "付款对接人", "职场报销案应把缺席方问题落到流程入口，不回到性别代词判断");
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
    assert(brief.openingDialogue.length >= 2 && brief.openingDialogue.length <= 5, `${brief.plotId} 开场必须控制在 2-5 句`);
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
  assertIncludes(brief.openingDialogue.map((line) => line.text).join(" "), "见父母", "截图出现必须有关系阶段触发");
  assertIncludes(brief.openingDialogue.map((line) => line.text).join(" "), "名校毕业", "外层说法应先是名校毕业，不应一开始就摊开 MBA");
  const sceneVersionsText = brief.sceneVersions.map((scene) => scene.version).join(" ");
  const introducerScene = brief.sceneVersions.find((scene) => scene.version.includes("介绍人"));
  const dinnerScene = brief.sceneVersions.find((scene) => scene.version.includes("第一次正式吃饭"));
  const mbaScene = brief.sceneVersions.find((scene) => scene.version.includes("细问") && scene.version.includes("本科"));
  const spendingScene = brief.sceneVersions.find((scene) => scene.version.includes("团购") && scene.version.includes("停车 AA"));
  const wageScene = brief.sceneVersions.find((scene) => scene.version.includes("工资"));
  assertIncludes(brief.sceneVersions[0].version, "见父母", "第一段必须指出见家长前问得过细本身不正常");
  assertIncludes(sceneVersionsText, "介绍人", "扩成长案后必须交代体面标签不是单人凭空出现");
  assertIncludes(sceneVersionsText, "第一次正式吃饭", "扩成长案后必须还原第一次饭局现场");
  assertIncludes(sceneVersionsText, "两边", "扩成长案后必须还原介绍链双面话术");
  assert(introducerScene, "扩成长案后必须有介绍人参与的场景");
  assert(dinnerScene, "扩成长案后必须有第一次饭局场景");
  assert(mbaScene, "MBA 必须是追问后才揭示出的具体说法，并明确本科学历有落差");
  assert(spendingScene, "收入疑点必须来自日常观察而不只是截图缺边");
  assert(wageScene, "女方家关注流水必须连到婚后管钱预设");
  assertIncludes(JSON.stringify(brief), "工资卡", "追问流水必须触发额外隐藏信息");
  assertIncludes(brief.deepFollowup?.question, "你要看他的收入和工资卡", "满格后必须从已出现的收入要求追问咨询者自己的经济位置");
  assertIncludes(brief.deepFollowup?.answer, "一万出头", "深入一问必须用具体数字揭示咨询者自身经济压力");
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
  const answerCoaching = /更要先看|但这里先看|才是关键|核心痕迹|真正越界要看|这个判断|你中段|这句说明|这说明|它说明|这条不替/;
  const frozenShareFrame = /^让我.*(?:的是|不是)/;
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

test("DAILY-011", "case 4 line-pick has no marked wrong answers", () => {
  const brief = generateCasesForMode("daily", NPCS, attrs, {
    dailyKey: "2026-06-24",
    plotId: "education-income-fake-profile"
  })[0];
  const buttons = dailyAccusationChoices(brief);
  assert(buttons.length >= 3, "案 4 最终回应必须有至少三句可选原话");
  assertEqual(buttons[0].accuse, brief.respondentId, "第一句应是诱人的单方材料真假判断");
  assertIncludes(buttons[0].label, "“", "案 4 挑句按钮必须像原话而不是抽象结论");
  const grayIndex = buttons.findIndex((button) => button.accuse === "both");
  assert(grayIndex > 0, "案 4 灰区句不能排在第一个");
  assertIncludes(buttons[grayIndex].label, "工资卡", "案 4 灰区原话必须落在工资卡这句");
  assertIncludes(JSON.stringify(brief), "上交工资", "案 4 必须保留流水背后的隐藏动机");
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
  assertEqual(typeof migrated.truthBoundaryPicks, "object", "旧存档必须补 truthBoundaryPicks 记录");
  assertEqual(typeof migrated.truthBoundaryMisses, "object", "旧存档必须补 truthBoundaryMisses 记录");
  assertEqual(migrated.lastPressureSignal, null, "旧存档必须补结构化现场压力状态");
  assertEqual(migrated.lastPressureAxis, null, "旧存档必须补路线轴现场压力状态");
  assertEqual(migrated.patienceLostContext, null, "旧存档必须补耐心耗尽重试上下文");
  assertEqual(typeof migrated.helperHintPicks, "object", "旧存档必须补 V哥求助记录，且不混入路线记录");

  const dailyCallMigrated = migrateState({
    caseMode: "daily",
    chapter: 1,
    caseBriefs: [{ id: "daily-old", caseMode: "daily", plotId: "education-income-fake-profile" }]
  });
  assertEqual(dailyCallMigrated.caseBriefs[0].dailyCase, true, "每日连线存档必须补 dailyCase 标记");

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
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assert(!appSource.includes("data-after-patience-lost"), "耐心耗尽页不能跳下一通或进故事集总结");
});

test("RUNTIME-008", "overnight helpers gate day budget and callback openers", () => {
  const [brief] = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const structure = overnightStructureFor(brief);
  assert(structure, "案 1 必须启用 overnightStructure");
  const anchorIndex = overnightAnchorSceneIndex(brief);
  assert(anchorIndex >= 0, "隔夜锚点必须命中场景");
  assertIncludes(brief.sceneVersions[anchorIndex].version, "五万多", "隔夜锚点必须落在审计拍");
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
  assert(!daySceneById(brief, "day-home"), "赵律师改入幕间框架冲突，白天地图不应再要求玩家回家解锁她");
  assert(!brief.overnightStructure.postHangupContact, "案1 收麦后赵律师说教已迁出 postHangupContact");
  const frameAction = nightActionById(brief, "zhao-zhou-frame");
  assertEqual(frameAction?.kind, "advisorConflict", "案1 幕间必须保留赵周框架冲突");
  assertEqual(frameAction?.npcVerb, "conflict", "案1 幕间赵周框架必须标记 conflict");
  assert(frameAction?.options?.some((option) => option.id === "frame-zhao"), "幕间必须能先采性质框架");
  assert(frameAction?.options?.some((option) => option.id === "frame-zhou"), "幕间必须能先采路径框架");
  const restaurant = daySceneById(brief, "day-restaurant");
  assertEqual(restaurant?.body?.choice?.options?.length, 2, "餐厅必须有会员号/轮订两岔");
  assert(restaurant?.body?.choice?.options?.every((option) => option.grantsEarnedItemId), "餐厅两岔必须产出不同带回物");
  assert(restaurant?.body?.choice?.options?.every((option) => (option.resultBeats ?? []).length || option.resultText), "餐厅两岔必须在选择后才展示各自所得");
  const sitIn = daySceneById(brief, "day-cafe-sitin");
  assert(sitIn?.body?.choice?.options?.every((option) => (option.resultBeats ?? []).length || option.resultText), "旁听两岔必须改变玩家实际听到的信息");
  const openers = availableOvernightCallbackOpeners(brief, ["周会计的时间线", "她的会员号"]).map((opener) => opener.id);
  assert(openers.includes("周会计的时间线"), "带回周会计时间线必须解锁时间线回拨");
  assert(openers.includes("她的会员号"), "带回她的会员号必须解锁对应回拨");
  assert(availableOvernightCallbackOpeners(brief, ["常客的轮订规律"]).some((opener) => opener.id === "常客的轮订规律"), "常客的轮订规律必须改变第二夜第一句");
  assert(availableOvernightCallbackOpeners(brief, ["流水圈注"]).some((opener) => opener.id === "流水圈注"), "流水圈注必须改变第二夜第一句");
  assertIncludes(overnightCallbackOpenerById(brief, "她的会员号")?.line ?? "", "不外传", "她的会员号回拨台词必须稳定");
  assert(overnightCallbackOpenerById(brief, "她的会员号")?.firstConflict?.hostLine, "会员号带回必须改变夜 B 第一轮追问，不能只换开场文案");
  assert(overnightCallbackOpenerById(brief, "他对五万的沉默")?.firstConflict?.callerLine, "旁听提前离开必须改变夜 B 第一轮回答");
  assertIncludes(JSON.stringify(sitIn?.body?.choice?.options ?? []), "灯是我真心买的", "同席原句必须保留，供麦外来信精确回声");
  assertEqual(brief.lurkerNote?.deletedFragment, "灯是我真心买的", "lurker 只能复现同席已经当面说过的原句");
  const deviceSeed = brief.sceneVersions.find((scene) => scene.id === "credit-device-benefit");
  const deviceReveal = brief.sceneVersions.find((scene) => scene.id === "credit-bank-flow");
  assert(deviceSeed, "案 1 夜 A 必须保留设备受益种子");
  assert(deviceReveal, "案 1 夜 B 必须保留设备受益揭示");
  assertIncludes(deviceSeed.version, "投资", "案 1 夜 A 只能先种下投资话术");
  assert(!deviceSeed.version.includes("灯架和稳定器一直在我屋里"), "案 1 夜 A 不得抢先说完设备实际受益");
  assert(!(deviceSeed.questionOptions ?? []).some((option) => /实际服务过咨询者账号|收了设备/.test(option.contradiction ?? "")), "案 1 夜 A 的矛盾入账不得提前公布设备受益结论");
  assertEqual(brief.callMedium, "voice", "案 1 必须保持纯语音连线");
  assertIncludes(deviceReveal.version, "麦克风", "案 1 夜 B 的设备揭示必须落成麦克风可听见的现场动作");
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
  assertEqual(callerQuestion?.prompt, "主播，你说……我该不该垫？", "她的那一问必须稳定");
  assert(!callerQuestion.options.find((option) => option.id === "dont-answer-for-her")?.requiresEarnedItem, "不替咨询者作答必须成为常驻选项");
  assertEqual(overnightReturnPostureFor({ id: "caller-benefited" }), "againstCaller", "中段先怪她必须让回拨防御");
  assertEqual(overnightReturnPostureFor({ id: "respondent-shifted-debt" }, "defensive"), "againstCaller", "幕间 defensive nudge 必须覆盖中段快照进入隔夜姿态");
  assertEqual(overnightReturnPostureFor({ id: "caller-benefited" }, "open"), "withCaller", "幕间 open nudge 必须覆盖中段快照进入隔夜姿态");
  assertEqual(availableOvernightCallbackOpeners({ id: "plain" }, ["周会计的时间线"]).length, 0, "无 overnightStructure 的旧案不应暴露隔夜 opener");
});

test("RUNTIME-009", "case 2 moves shop observation and table comparison into a two-stop day map", () => {
  const briefs = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" });
  const brief = briefs.find((item) => item.runtimeContentCaseId === "02-tony");
  assert(brief, "案 2 必须存在");
  const nightStructure = nightStructureFor(brief);
  assert(nightStructure, "案 2 必须保留两段连线结构");
  assert(shouldEnterHangupAfterScene(brief, 3), "案 2 第四段材料结束后必须真正进入跨夜挂断");
  assertEqual(nightStructure.interlude?.budget, 1, "案 2 短幕间最多支出一步");
  assertEqual(nightStructure.interlude?.maxActions, 1, "案 2 短幕间不能和白天地图库叠满");
  assert(!(nightStructure.callbackOpeners ?? []).length, "案 2 存在 overnightStructure 时不得保留第二套 opener 表");
  assert(!nightActionById(brief, "visit-lin"), "标准表对照必须迁入白天地图库，不能继续藏在旧幕间登门");
  assert(!nightActionById(brief, "call-manager-boundary"), "店长拒答已迁出幕间，不得再保留 call-manager-boundary");
  assertEqual(nightActionById(brief, "shop-sync-interrupt")?.npcVerb, "interrupt", "短幕间须保留 NPC interrupt 配额");
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
  const appSource = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  assertIncludes(appSource, "先圈一行", "流水调查必须要求玩家实际圈行，不能空手记下离开");
  assertIncludes(appSource, "firstConflict.hostLine", "隔夜 opener 后必须渲染路线专属第一轮冲突");
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
  assertEqual(liveCounterBeatBeforeScene(case2, 5, () => false)?.id, "tony-comment-benefit-blowup", "案 2 评论区爆句必须在下一段辩解前出现");
  const case3 = briefs.find((item) => item.runtimeContentCaseId === "03-profile");
  assertEqual(
    liveCounterBeatAfterScene(case3, 5, () => false, { documentMarks: { "case3-credential-balance": ["p04"] } })?.id,
    "profile-family-chat-blowup",
    "案 3 圈中 p04 后必须在家里群反转场尾出现情绪拍"
  );
  const case4 = briefs.find((item) => item.runtimeContentCaseId === "04-workplace");
  assertEqual(liveCounterBeatAfterScene(case4, 5, () => false)?.id, "work-comment-stupid-blowup", "案 4 蠢话爆句必须先于群内还款截图");
  assertEqual(
    liveCounterBeatAfterScene(case4, 5, (key) => key === "liveCounterBeat:work-comment-stupid-blowup")?.id,
    "work-group-repayment-message",
    "案 4 情绪拍播完后必须继续归还原有群内还款反制"
  );
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
  assertEqual(daySceneById(brief, "day-profile-teahouse")?.kind, "visit", "案 3 必须到茶馆核两套报价");
  assertEqual(daySceneById(brief, "day-profile-teahouse")?.body?.choice?.options?.length, 2, "案 3 茶馆必须有两岔现场取舍");
  assert(daySceneById(brief, "day-profile-teahouse")?.body?.choice?.options?.every((option) => (option.resultBeats ?? []).length >= 2), "案 3 茶馆两岔必须留下不同的当场确认，不能只换 earnedItem 标签");
  assertEqual(daySceneById(brief, "day-profile-cousin-doorstep")?.kind, "doorstep", "案 3 表姐必须只在门口有限作证");
  assertEqual(daySceneById(brief, "day-profile-credential-docs")?.kind, "document", "案 3 必须并读学历核验与存款证明");
  assert(!(structure.dayScenes ?? []).some((scene) => scene.kind === "sitIn"), "案 3 不得增加第二次同席");
  const initial = initialOvernightStateFor(brief);
  assert(!canEnterOvernightCallback(brief, { ...initial, dayScenesDone: ["day-profile-teahouse"] }), "案 3 只去一处不能进入第二夜");
  assert(canEnterOvernightCallback(brief, { ...initial, dayScenesDone: ["day-profile-teahouse", "day-profile-cousin-doorstep"] }), "案 3 去满两处后必须允许回拨");
  const case3OpenerIds = ["介绍人双边记录", "介绍人添话标记", "表姐门口口供", "双份材料圈注", "家里群原话", "饭局停顿回放"];
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
});

test("RUNTIME-011", "case 4 stages a three-advisor conflict before callback", () => {
  const brief = generateCasesForMode("episode", NPCS, attrs, { storyKey: "steam-demo-01" })
    .find((item) => item.runtimeContentCaseId === "04-workplace");
  const conflict = nightActionById(brief, "zhao-zhou-work");
  assertEqual(conflict?.kind, "advisorConflict", "案 4 三位顾问必须在同一冲突场景出现");
  assertEqual(conflict?.options?.length, 3, "案 4 必须同时呈现赵律师、周会计和小林老师三套框架");
  ["work-frame-zhao", "work-frame-zhou", "work-frame-lin"].forEach((id) => {
    assert(conflict.options.some((option) => option.id === id), `案 4 顾问冲突缺少 ${id}`);
  });
  assertEqual(nightStructureFor(brief)?.interlude?.budget, 1, "案 4 短幕间最多支出一步");
  assert(!(nightStructureFor(brief)?.callbackOpeners ?? []).length, "案 4 存在 overnightStructure 时不得保留第二套 opener 表");
  const structure = overnightStructureFor(brief);
  const linFrameEarned = interludeEarnedItemsForOvernight(brief, ["work-frame-lin"]);
  assert(linFrameEarned.includes("小林主责框架"), "案 4 镜框 inventory 必须同步进 overnight earnedItems");
  assert(availableOvernightCallbackOpeners(brief, linFrameEarned).some((item) => item.id === "小林主责框架"), "采小林框架必须改变第二夜开场");
  assert(interludeEarnedItemsForOvernight(brief, ["delegation-return"]).includes("顾问回单"), "案 4 顾问回单必须从幕间同步进 overnight earnedItems");
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
  assertEqual(daySceneById(brief, "day-work-breakroom-observe")?.body?.choice?.options?.length, 2, "案 4 茶水间观察必须有两岔现场取舍");
  const case4OpenerIds = Object.keys(structure?.callbackOpeners ?? {});
  assertEqual(case4OpenerIds.length, 13, "案 4 必须覆盖九条既有 opener、两条白天分叉与两条幕间带回");
  case4OpenerIds.forEach((itemId) => {
    assert(overnightCallbackOpenerById(brief, itemId)?.firstConflict?.hostLine, `案 4 带回 ${itemId} 必须改变第二夜第一轮对峙`);
  });
  assertEqual(new Set(case4OpenerIds.map((itemId) => overnightCallbackOpenerById(brief, itemId)?.firstConflict?.hostLine)).size, case4OpenerIds.length, "案 4 每个带回物必须有不同的第一拳");
  assertEqual(nightStructureFor(brief)?.interlude?.continueLabel, "进入白天调查", "案 4 幕间结束必须明确进入白天，不能误导为立即回拨");
  assertEqual(nightStructureFor(brief)?.hangup?.stageDirection, structure?.hangupLine, "案 4 挂断舞台指示必须与 overnight 挂断文案对齐");
  assertEqual(nightStructureFor(brief)?.hangup?.hostLine, structure?.hostHoldLine, "案 4 主持人挂断句必须与 overnight 保持单一来源");
  assert(!nightStructureFor(brief)?.hangup?.line?.includes("马上"), "案 4 挂断不能再写成马上回来的软离席");
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
