export function storyInterludeRecapLine(brief = {}, result = {}, route = {}, interlude = {}, backflow = {}) {
  const percent = Number(result.issuePercent ?? 0);
  const backflowLine = backflow.line ? backflow.line : "";
  if (percent < 50) return `${interlude.summary ?? "刚才那通挂得早，弹幕还在翻开场那句。"}${backflowLine}`;
  const routeLabel = route.label ? `你刚才一直压着${route.label}问。` : "";
  const recap = brief.storyInterludeRecap ?? brief.weeklyInterludeRecap ?? interlude.summary;
  return recap ? `${recap}${routeLabel}${backflowLine}` : (backflowLine || "这边刚挂，后台又亮了。");
}

export function storyInterludeObjectLabel(brief = {}) {
  return brief?.storyObjectLabel ?? brief?.weeklyObjectLabel ?? brief?.storyClueObject ?? brief?.clueObject ?? "新材料";
}

export function storyInterludeNextLine(brief = {}) {
  if (!brief) return "后台又亮了一路麦。";
  const bridge = brief.storyBridge ?? brief.weeklyBridge ?? "";
  if (bridge) return bridge;
  return "后台又亮了一路麦。";
}
