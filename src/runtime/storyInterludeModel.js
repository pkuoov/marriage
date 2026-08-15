export function storyInterludeObjectLabel(brief = {}) {
  return brief?.storyObjectLabel ?? brief?.weeklyObjectLabel ?? brief?.storyClueObject ?? brief?.clueObject ?? "新材料";
}

export function storyInterludeCaseId(pack = {}, brief = {}) {
  if (brief.caseId) return brief.caseId;
  const spec = (pack.sequence ?? []).find((item) => item.plotId === brief.plotId);
  return spec?.caseId ?? brief.id ?? "";
}
