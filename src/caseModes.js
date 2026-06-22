import { generateArcCaseSequence, generateCaseSequence, generateStoryCaseSequence } from "./caseEngine.js?v=0.14.0";

export const CASE_MODE_IDS = ["story", "arc", "anchor"];

export const CASE_MODE_CONFIG = {
  story: {
    id: "story",
    label: "故事模式",
    title: "婚姻主播主线",
    expectedCases: 4,
    intro: "后台已经排好四通固定来电。每个客户都会先讲一个对自己有利的版本，真正的问题要从后续插线、证据卡和临时回拨里拆出来。",
    summary: "四通固定来电会一路追到领证前转账、酒后时间线、多人承诺和责任错配。你要判断它们分别是骗局、勒索、养鱼，还是不适合进入婚姻的现实缺口。",
    generator: generateStoryCaseSequence
  },
  arc: {
    id: "arc",
    label: "连环剧场",
    title: "连环剧场",
    expectedCases: 13,
    intro: "先过一份试播训练档，再打开资料包疑云和模板回声。旧案证据会被收进档案，下一案可能重新咬住它。",
    summary: "资料包疑云从一份匿名材料开始，模板回声则追查这些材料怎样被整理成报告、服务和话术。每一份旧证据都可能在后面变成新的突破口。",
    generator: generateArcCaseSequence
  },
  anchor: {
    id: "anchor",
    label: "主播模式",
    title: "主播随机案",
    expectedCases: [3, 4, 5],
    intro: "随机接入后台来电。每一案单独判断，但上一案留下的声誉、舆论和人物牵连会先一步进入直播间。",
    summary: "随机来电会在婚前、婚后和告解之间切换。你要用有限追问配额，把每段说法压回时间线、钱和责任。",
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
