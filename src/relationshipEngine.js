import { HUMAN_PATTERNS, MOTIVES } from "./story.js?v=0.14.0";

export const INTERNAL_BURST_FLOOR = 20;
export const MOTIVE_BURST_THRESHOLD = 70;

export function randomPick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function randomRange(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function clampBurst(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function effectiveInternalBurst(seed) {
  const value = seed?.internalBurst ?? 0;
  return value < INTERNAL_BURST_FLOOR ? 0 : value;
}

export function effectiveMotiveBurst(seed) {
  const value = seed?.motiveBurst ?? 0;
  return value < MOTIVE_BURST_THRESHOLD ? 0 : value;
}

export function internalBurstChance(seed) {
  const value = effectiveInternalBurst(seed);
  return value === 0 ? 0 : Math.min(0.8, ((value - INTERNAL_BURST_FLOOR) / 100) * affectionRiskModifier(seed));
}

export function motiveBurstChance(seed) {
  const value = effectiveMotiveBurst(seed);
  return value === 0 ? 0 : Math.min(0.75, ((value - MOTIVE_BURST_THRESHOLD + 1) / 40) * affectionRiskModifier(seed));
}

function affectionRiskModifier(seed) {
  const affection = seed?.affection ?? 24;
  const patternModifier = HUMAN_PATTERNS[seed?.humanPattern]?.burstModifier ?? 1;
  const hiddenModifier = seed?.hiddenType === "controlling" ? 1.35 : 1;
  let affectionModifier = 1;
  if (affection >= 28) affectionModifier = 0.65;
  else if (affection >= 25) affectionModifier = 0.82;
  else if (affection <= 20) affectionModifier = 1.25;
  return affectionModifier * patternModifier * hiddenModifier;
}

export function initialInternalBurst(hiddenType) {
  const ranges = {
    sincere: [0, 16],
    selfish: [12, 36],
    flawed: [18, 48],
    controlling: [48, 76]
  };
  return randomRange(...ranges[hiddenType]);
}

export function initialMotiveBurst(hiddenType, motive) {
  if (!motive) return randomRange(0, 16);
  const ranges = {
    sincere: [0, 16],
    selfish: [34, 58],
    flawed: [42, 66],
    controlling: [48, 70]
  };
  return randomRange(...ranges[hiddenType]);
}

export function internalBurstLine(seed) {
  if (seed.humanPattern === "spoiledHeir") return "TA 的委屈来得很快：不是不能商量，而是 TA 不能接受你没有立刻让步。";
  if (seed.humanPattern === "npdMask") return "TA 的温柔突然撤掉了，开始把你的边界说成背叛，把你的解释说成狡辩。";
  if (seed.humanPattern === "avoidantPleaser") return "TA 一边说都可以，一边把真正的决定和后果悄悄推到你身上。";
  if (seed.humanPattern === "pragmaticClimber") return "TA 把关系讲得很现实，现实到你的价值像被放进了一张收益表。";
  if (seed.hiddenType === "controlling") return "TA 的语气忽然变硬，把你的犹豫解释成不够爱。";
  if (seed.hiddenType === "flawed") return "TA 对一个细节反应过激，像是害怕你继续问下去。";
  if (seed.hiddenType === "selfish") return "TA 开始把自己的需求说成“我们共同的未来”。";
  return "TA 短暂失态，但很快承认刚才的表达不太好。";
}

export function motiveRevealLine(seed, npc) {
  const motive = seed.motive ? MOTIVES[seed.motive] : null;
  if (!motive) return `${npc?.name ?? "TA"} 没有摊牌某种目的，只是把真实恐惧说了出来。`;
  return npc?.red ?? motive.pressure ?? "TA 把真正目的说出了口。";
}
