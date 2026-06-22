import { buildStoryEvidenceArchiveCards, visibleReferencedStoryEvidence } from "../src/caseArchive.js?v=0.14.0";
import { generateCasesForMode } from "../src/caseModes.js?v=0.14.0";
import { accusationLabel, evidenceInsightFor, explanationForExpected, runCompleteLineFor, structuralResponsibilityText, timelineGapText } from "../src/caseNarration.js?v=0.14.0";
import { allCaseContradictions, calculateCaseBudgetMax, calculateCaseOutcome, calculateInspirationMax, expectedAccusationForCase, nextInspirationContradictionForCase, relationshipExpectedAccusationForCase, resolveAccusationForCase } from "../src/caseRuntime.js?v=0.14.0";
import { requiredContradictionsForCase } from "../src/difficulty.js?v=0.14.0";
import { migrateState } from "../src/state.js?v=0.14.0";
import { NPCS } from "../src/story.js?v=0.14.0";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const attrs = { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 };
const story = generateCasesForMode("story", NPCS, attrs, { runNumber: 0 });
const arc = generateCasesForMode("arc", NPCS, attrs, { runNumber: 0 });
const anchor = generateCasesForMode("anchor", NPCS, attrs, { runNumber: 0 });

assert(story.length === 4, "故事模式必须生成 4 案");
assert(story.map((item) => item.difficulty).join(",") === "4,6,8,9", "故事模式难度必须稳定递进为 4,6,8,9");
assert(story.map((item) => requiredContradictionsForCase(item)).join(",") === "2,2,3,3", "故事模式矛盾门槛必须为 2,2,3,3");
assert(Boolean(story[1].contentWarning), "第二案必须带内容提示");
assert((story[1].referencesEvidenceIds ?? []).length === 1, "第二案必须引用第一案跨案证据");
assert((story[2].referencesEvidenceIds ?? []).length === 1, "第三案必须引用第二案跨案证据");
assert((story[3].referencesEvidenceIds ?? []).length === 1, "第四案必须引用第三案跨案证据");
assert(arc.length === 13, "连环剧场必须生成 13 案");
assert(anchor.length >= 3 && anchor.length <= 5, "主播模式必须生成 3-5 案");

const migrated = migrateState({
  profileDone: true,
  playerRole: "host-lawyer",
  caseBriefs: story,
  settings: { textSpeed: "fast" }
});

assert(migrated.settings.textSpeed === "fast", "存档迁移必须保留旧设置");
assert(migrated.settings.contentWarningAccepted === false, "存档迁移必须补内容警示默认值");
assert(migrated.settings.streamlineMode === false, "存档迁移必须补绿色模式默认值");
assert(migrated.saveSlot === "slot1", "存档迁移必须补默认存档槽");

const efficientWin = calculateCaseOutcome({
  brief: { caseMode: "premarital" },
  result: { correct: true },
  contradictionCount: 3,
  budgetRemaining: 1,
  agencyReputation: 8,
  publicHeat: 1,
  now: 1
});
assert(efficientWin.agencyReputation === 9, "高声誉正确结案必须被上限夹到 9");
assert(efficientWin.publicHeat === 0, "婚前案正确结案应降低热度并夹到 0");
assert(efficientWin.interlude.reputationDelta === 3 && efficientWin.interlude.efficient === true, "高效正确结案应给 +3 声誉");

const failedCase = calculateCaseOutcome({
  brief: { caseMode: "married" },
  result: { correct: false },
  contradictionCount: 1,
  budgetRemaining: 0,
  agencyReputation: -3,
  publicHeat: 8,
  now: 2
});
assert(failedCase.agencyReputation === -3, "失败结案声誉必须被下限夹到 -3");
assert(failedCase.publicHeat === 9, "失败结案热度必须被上限夹到 9");
assert(failedCase.interlude.heatDelta === 2, "失败结案应增加 2 点舆论热度");
assert(calculateCaseBudgetMax({ brief: { caseMode: "premarital" }, bonusPoints: 5, agencyReputation: 4, publicHeat: 5 }) === 8, "调查配额必须同时计算助理、声誉和舆论热度");
assert(calculateCaseBudgetMax({ brief: { caseMode: "confession", difficultyProfile: { budgetDelta: -8 } }, publicHeat: 9 }) === 4, "调查配额必须保底为 4");
assert(calculateInspirationMax({ brief: { tutorialChapter: true }, caseMode: "story" }) === 99, "教学章启发道具必须不限次数");
assert(calculateInspirationMax({ brief: { difficulty: 8, difficultyProfile: { inspirationBase: 1 } }, caseMode: "story", bonusPoints: 12 }) === 3, "启发次数必须计算难案和老手加成");
assert(relationshipExpectedAccusationForCase({ stance: "halfTruth" }) === "both", "halfTruth 必须指向双方都有隐瞒");
assert(relationshipExpectedAccusationForCase({ stance: "trueVictim", respondentId: "r" }) === "r", "trueVictim 必须指向另一方");
assert(relationshipExpectedAccusationForCase({ stance: "personalityMismatch" }) === "noPremeditated", "personalityMismatch 必须指向 noPremeditated");
assert(expectedAccusationForCase({ structuralActorId: "platform", stance: "personalityMismatch" }) === "platform", "结构性责任必须优先于关系层责任");
const enoughBoth = resolveAccusationForCase({
  brief: { id: "case-a", stance: "halfTruth" },
  accused: "both",
  contradictionCount: 2,
  requiredContradictions: 2
});
assert(enoughBoth.result.correct === true && enoughBoth.enoughContradictions === true, "both 指认在矛盾足够时必须正确");
const notEnough = resolveAccusationForCase({
  brief: { id: "case-b", stance: "halfTruth" },
  accused: "both",
  contradictionCount: 1,
  requiredContradictions: 2
});
assert(notEnough.result.correct === false && notEnough.enoughContradictions === false, "矛盾不足时即使命中方向也不能正确");
const platformPick = resolveAccusationForCase({
  brief: { id: "case-c", structuralActorId: "platform", stance: "personalityMismatch" },
  accused: "platform",
  contradictionCount: 3,
  requiredContradictions: 3
});
assert(platformPick.result.correct === true && platformPick.result.relationshipExpected === "noPremeditated", "平台指认必须保留关系层责任");
assert(accusationLabel({ caseMode: "premarital" }, "platform") === "平台 / 第三方操盘", "平台指认标签必须稳定");
assert(explanationForExpected({ caseMode: "confession", respondentId: "r" }, "r").includes("真正的受害方"), "trueVictim 复盘解释必须指向真正受害方");
assert(structuralResponsibilityText({ structuralActorId: "platform" }).includes("系统性提取"), "平台结构层复盘必须说明系统性提取");
assert(evidenceInsightFor({
  evidenceCards: [{ type: "转账记录", title: "婚前转账", front: "48 小时内转账", detail: "备注改成共同储备" }]
}, "money").includes("转账记录《婚前转账》"), "钱款启发必须优先指出金额/资源证据卡");
assert(timelineGapText({ hiddenFacts: ["领证前两天才第一次提借钱"] }).includes("领证前两天"), "时间线启发必须优先指出时间缺口");
assert(runCompleteLineFor({ correct: 2, total: 5, caseMode: "anchor", playthroughNumber: 1 }).includes("没有完美通关"), "第一周目 5 案只有 2 对不能触发成功评价");
assert(runCompleteLineFor({ correct: 3, total: 5, caseMode: "anchor", playthroughNumber: 1 }).includes("第一次开播"), "第一周目 5 案达到 60% 才触发成功评价");

const archiveCards = buildStoryEvidenceArchiveCards({
  brief: {
    fixedStory: true,
    id: "story-a",
    label: "旧案",
    storyArcTitle: "旧案标题",
    storySetName: "主播主线",
    evidenceCards: [
      { id: "keep", type: "主线物证", title: "预约表", contradiction: "预约冲突" },
      { id: "hidden", type: "跨套线索", title: "匿名号", contradiction: "匿名号来源" },
      { id: "drop", type: "普通证据", title: "闲聊", contradiction: "闲聊矛盾" }
    ]
  },
  caseKey: "story-a",
  foundContradictions: ["预约冲突"],
  result: { correct: false },
  now: 10
});
assert(archiveCards.length === 2, "跨案归档只能收录主线证据类型");
assert(archiveCards.find((item) => item.id === "keep")?.discovered === true, "已发现矛盾的归档证据必须可调取");
assert(archiveCards.find((item) => item.id === "hidden")?.discovered === false, "未发现矛盾且结案错误的归档证据不能提前显形");
assert(visibleReferencedStoryEvidence({ referencesEvidenceIds: ["keep", "hidden"] }, archiveCards).map((item) => item.id).join(",") === "keep", "下一案只能调取已发现的旧案证据");
assert(allCaseContradictions({
  sceneVersions: [{ contradiction: "时间错位" }],
  testimony: [{ followups: [{ contradiction: "钱款矛盾" }, { contradiction: "时间错位" }] }],
  evidenceCards: [{ contradiction: "证据反咬" }],
  confessionTimeline: [{ contradiction: "自述断点" }]
}).join(",") === "时间错位,钱款矛盾,证据反咬,自述断点", "案件矛盾汇总必须跨来源去重");
assert(nextInspirationContradictionForCase({
  sceneVersions: [{ contradiction: "时间错位" }],
  evidenceCards: [{ contradiction: "证据反咬" }]
}, ["时间错位"]) === "证据反咬", "启发道具必须跳过已发现矛盾");
assert(nextInspirationContradictionForCase({
  evidenceCards: [{ contradiction: "证据反咬" }]
}, ["出示证据：证据反咬"]) === null, "启发道具不能重复提示已通过证据出示命中的矛盾");

console.log("logic verification passed");
