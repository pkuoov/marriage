export function storyInterludeObjectLabel(brief = {}) {
  return brief?.storyObjectLabel ?? brief?.weeklyObjectLabel ?? brief?.storyClueObject ?? brief?.clueObject ?? "新材料";
}

export function storyInterludeNextLine(brief = {}) {
  if (!brief) return "后台又亮了一路麦。";
  const bridge = brief.storyBridge ?? brief.weeklyBridge ?? "";
  if (bridge) return bridge;
  return "后台又亮了一路麦。";
}
