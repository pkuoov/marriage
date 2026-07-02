import { CONTENT_PACKS, DEFAULT_CONTENT_PACK_KEY } from "./generated/contentPackIndex.js?v=0.20.43";

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
