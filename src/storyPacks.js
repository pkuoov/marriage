import { CONTENT_CASES, CONTENT_PACKS, CONTENT_QUICK_CASES, DEFAULT_CONTENT_PACK_KEY } from "./generated/contentPackIndex.js";
import { isRuntimeLoadedCaseContent } from "./runtime/contentCase.js";

export const DEFAULT_STORY_PACK_KEY = DEFAULT_CONTENT_PACK_KEY;
export const STORY_PACKS = CONTENT_PACKS;

export function storyPackForKey(storyKey) {
  return STORY_PACKS[storyKey] ?? STORY_PACKS[DEFAULT_STORY_PACK_KEY];
}

export function storyPackCaseCount(storyPack) {
  const sequenceLength = storyPack?.sequence?.length ?? 0;
  const requestedSize = Number(storyPack?.size ?? sequenceLength);
  if (!Number.isFinite(requestedSize) || requestedSize <= 0) return sequenceLength;
  return Math.min(sequenceLength, Math.max(1, Math.floor(requestedSize)));
}

export function storyPackCaseContentFor(storyKey, caseId) {
  const packet = CONTENT_CASES[storyKey]?.[caseId] ?? CONTENT_CASES[DEFAULT_STORY_PACK_KEY]?.[caseId] ?? null;
  return isRuntimeLoadedCaseContent(packet) ? packet : null;
}

export function storyPackCaseContentForPlot(storyKey, plotId) {
  const pack = storyPackForKey(storyKey);
  const spec = (pack.sequence ?? []).find((item) => item.plotId === plotId);
  if (!spec?.caseId) return null;
  return storyPackCaseContentFor(storyKey, spec.caseId);
}

export function storyPackCaseContentStatus(storyKey, caseId) {
  return CONTENT_CASES[storyKey]?.[caseId]?.runtimeContentStatus ?? CONTENT_CASES[DEFAULT_STORY_PACK_KEY]?.[caseId]?.runtimeContentStatus ?? "metadata-only";
}

export function quickDetectiveCaseFor(storyKey, quickCaseId) {
  const packKey = CONTENT_QUICK_CASES[storyKey] ? storyKey : DEFAULT_CONTENT_PACK_KEY;
  const cases = CONTENT_QUICK_CASES[packKey] ?? {};
  const preferredId = quickCaseId ?? storyPackForKey(packKey)?.quickCases?.[0];
  return cases[preferredId] ?? cases[Object.keys(cases)[0]] ?? null;
}

export function quickDetectiveCasesFor(storyKey) {
  const packKey = CONTENT_QUICK_CASES[storyKey] ? storyKey : DEFAULT_CONTENT_PACK_KEY;
  const cases = CONTENT_QUICK_CASES[packKey] ?? {};
  const orderedIds = storyPackForKey(packKey)?.quickCases ?? [];
  const ordered = orderedIds.map((caseId) => cases[caseId]).filter(Boolean);
  const knownIds = new Set(orderedIds);
  return [
    ...ordered,
    ...Object.entries(cases).filter(([caseId]) => !knownIds.has(caseId)).map(([, packet]) => packet)
  ];
}
