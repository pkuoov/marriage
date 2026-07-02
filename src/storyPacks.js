import { CONTENT_CASES, CONTENT_PACKS, DEFAULT_CONTENT_PACK_KEY } from "./generated/contentPackIndex.js?v=0.20.56";
import { isRuntimeLoadedCaseContent } from "./runtime/contentCase.js?v=0.20.56";

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

export function storyPackCaseContentStatus(storyKey, caseId) {
  return CONTENT_CASES[storyKey]?.[caseId]?.runtimeContentStatus ?? CONTENT_CASES[DEFAULT_STORY_PACK_KEY]?.[caseId]?.runtimeContentStatus ?? "metadata-only";
}
