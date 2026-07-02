import { generateDailyCaseSequence, generateStoryPackSequence } from "./caseEngine.js?v=0.20.57";

export const CASE_MODE_IDS = ["episode", "daily"];

export const CASE_MODE_CONFIG = {
  episode: {
    id: "episode",
    label: "试玩版",
    title: "Steam 试玩版",
    minCases: 1,
    maxCases: 12,
    intro: "热线已经接进来。资料在后台，她已经开口了。",
    summary: "每路麦都会留下你的追问痕迹，收麦后再看整晚怎么走偏、怎么拉回。",
    generator: generateStoryPackSequence
  },
  daily: {
    id: "daily",
    label: "今日来电",
    title: "今日来电",
    expectedCases: 1,
    minCases: 1,
    maxCases: 1,
    intro: "一通匿名来电，几次接话分岔，今晚就能聊完。",
    summary: "今日来电不用读长资料，重点是从开场那几句里听出哪句话没有落地。",
    generator: generateDailyCaseSequence
  }
};

export function normalizeCaseMode(mode) {
  if (mode === "weekly") return "episode";
  return CASE_MODE_IDS.includes(mode) ? mode : "episode";
}

export function caseModeConfig(mode) {
  return CASE_MODE_CONFIG[normalizeCaseMode(mode)];
}

export function generateCasesForMode(mode, npcs, attrs, options = {}) {
  return caseModeConfig(mode).generator(npcs, attrs, options);
}

export function validCaseBriefCount(count, mode = null) {
  const configs = mode ? [caseModeConfig(mode)] : Object.values(CASE_MODE_CONFIG);
  return configs.some((config) => {
    if (Number.isFinite(config.expectedCases)) return count === config.expectedCases;
    return count >= Number(config.minCases ?? 1) && count <= Number(config.maxCases ?? 12);
  });
}
