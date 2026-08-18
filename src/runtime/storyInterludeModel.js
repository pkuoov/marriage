export function storyInterludeObjectLabel(brief = {}) {
  return brief?.storyObjectLabel ?? brief?.weeklyObjectLabel ?? brief?.storyClueObject ?? brief?.clueObject ?? "新材料";
}

export function storyInterludeCaseId(pack = {}, brief = {}) {
  if (brief.caseId) return brief.caseId;
  const spec = (pack.sequence ?? []).find((item) => item.plotId === brief.plotId);
  return spec?.caseId ?? brief.id ?? "";
}

export function storyOptionalQuickCall(pack = {}, brief = {}) {
  const caseId = storyInterludeCaseId(pack, brief);
  const calls = pack?.nightShell?.optionalQuickCalls;
  if (!Array.isArray(calls)) return null;
  return calls.find((item) => item?.afterCaseId === caseId && item?.quickCaseId) ?? null;
}
