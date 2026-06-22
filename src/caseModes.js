import { generateArcCaseSequence, generateCaseSequence, generateStoryCaseSequence } from "./caseEngine.js?v=0.14.0";

export const CASE_MODE_IDS = ["story", "arc", "anchor"];

export const CASE_MODE_CONFIG = {
  story: {
    id: "story",
    label: "故事模式",
    title: "婚姻主播主线",
    expectedCases: 4,
    intro: "婚姻主播 4 案固定主线：逐案听客户不完整的对话，在多次连线、阶段判定和后续反转中分析问题究竟是骗婚、化债、假婚、边界勒索、多线养鱼，还是成熟度和现实责任问题。",
    summary: "婚姻主播主线以 4 个高密度直播案为核心：每案都有多次连线、两三条混杂线索、阶段判定和后续新情况，用客户不完整叙事拆骗婚、化债、假婚绿、边界勒索、多线养鱼、巨婴责任和海王资源池。",
    generator: generateStoryCaseSequence
  },
  arc: {
    id: "arc",
    label: "连环剧场",
    title: "连环剧场",
    expectedCases: 13,
    intro: "教学章 + 两套正式固定案件：第一套查资料包疑云，第二套回收第一套线索，追查亲密关系话术如何被模板化。",
    summary: "连环剧场由教学章、第一套“资料包疑云”和第二套“模板回声”组成，偏高概念连续剧：从关系叙事一路追到平台模板化。",
    generator: generateArcCaseSequence
  },
  anchor: {
    id: "anchor",
    label: "主播模式",
    title: "主播随机案",
    expectedCases: [3, 4, 5],
    intro: "随机生成案件，一个案子一个案子往下分析，保持栏目式直播节奏。",
    summary: "主播模式保留栏目式随机案卷：每一案独立生成，但上一案的声誉、舆论和人物牵连仍会影响下一案的配合度。",
    generator: generateCaseSequence
  }
};

export function normalizeCaseMode(mode) {
  return CASE_MODE_IDS.includes(mode) ? mode : "story";
}

export function caseModeConfig(mode) {
  return CASE_MODE_CONFIG[normalizeCaseMode(mode)];
}

export function generateCasesForMode(mode, npcs, attrs, options = {}) {
  return caseModeConfig(mode).generator(npcs, attrs, options);
}

export function validCaseBriefCount(count) {
  return [3, 4, 5, 6, 8, 13].includes(count);
}
