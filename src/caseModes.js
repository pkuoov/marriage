import { generateDailyCaseSequence } from "./caseEngine.js?v=0.19.36";

export const CASE_MODE_IDS = ["daily"];

export const CASE_MODE_CONFIG = {
  daily: {
    id: "daily",
    label: "今日连线",
    title: "今日连线",
    expectedCases: 1,
    intro: "一通匿名来电，几次接话分岔，今晚就能聊完。",
    summary: "今日连线不用读长资料，重点是从第一版说法里听出哪句话没有落地。",
    generator: generateDailyCaseSequence
  }
};

export function normalizeCaseMode(mode) {
  return CASE_MODE_IDS.includes(mode) ? mode : "daily";
}

export function caseModeConfig(mode) {
  return CASE_MODE_CONFIG[normalizeCaseMode(mode)];
}

export function generateCasesForMode(mode, npcs, attrs, options = {}) {
  return caseModeConfig(mode).generator(npcs, attrs, options);
}

export function validCaseBriefCount(count) {
  return count === CASE_MODE_CONFIG.daily.expectedCases;
}
