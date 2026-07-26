export function refreshSavedCaseContent(state = {}, { generateCases, npcs = [] } = {}) {
  if (!Array.isArray(state.caseBriefs) || !state.caseBriefs.length || typeof generateCases !== "function") return state;
  const firstBrief = state.caseBriefs[0] ?? {};
  const mode = state.caseMode === "daily" ? "daily" : "episode";
  const options = mode === "daily"
    ? {
        dailyKey: firstBrief.dailyKey,
        plotId: firstBrief.plotId,
        runtimeCaseId: firstBrief.runtimeContentCaseId ?? firstBrief.caseId,
        complainantId: firstBrief.complainantId,
        respondentId: firstBrief.respondentId
      }
    : {
        storyKey: firstBrief.storyKey ?? firstBrief.weeklyKey
      };
  try {
    const refreshed = generateCases(npcs, state.attrs ?? {}, options);
    if (!Array.isArray(refreshed) || !refreshed.length) return state;
    const chapterIndex = Math.max(0, Math.min(refreshed.length - 1, Number(state.chapter ?? 1) - 1));
    return {
      ...state,
      caseBriefs: refreshed,
      caseBrief: refreshed[chapterIndex]
    };
  } catch {
    return state;
  }
}
