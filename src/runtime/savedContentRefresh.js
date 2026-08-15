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
    if (!Array.isArray(refreshed) || !refreshed.length) return contentRefreshFailure(state);
    const chapterIndex = Math.max(0, Math.min(refreshed.length - 1, Number(state.chapter ?? 1) - 1));
    return reconcileSavedOvernightProgress({
      ...state,
      saveLoadError: null,
      caseBriefs: refreshed,
      caseBrief: refreshed[chapterIndex]
    }, refreshed, chapterIndex);
  } catch {
    return contentRefreshFailure(state);
  }
}

function contentRefreshFailure(state = {}) {
  return {
    ...state,
    screen: "title",
    saveLoadError: "content-refresh-failed"
  };
}

export function reconcileSavedOvernightProgress(state = {}, briefs = [], chapterIndex = 0) {
  if (!state.caseOvernights || Array.isArray(state.caseOvernights)) return state;
  const briefById = new Map((briefs ?? []).map((brief) => [brief?.id, brief]));
  let currentProgressNeedsDayMap = false;
  const currentBriefId = briefs?.[chapterIndex]?.id;
  const caseOvernights = Object.fromEntries(Object.entries(state.caseOvernights).map(([caseId, saved]) => {
    const brief = briefById.get(caseId);
    const structure = brief?.overnightStructure;
    if (!saved || typeof saved !== "object" || Array.isArray(saved) || !structure) return [caseId, saved];

    const validDaySceneIds = new Set((structure.dayScenes ?? []).map((scene) => scene.id).filter(Boolean));
    const validOpenerIds = new Set(Object.keys(structure.callbackOpeners ?? {}));
    const originalDone = Array.isArray(saved.dayScenesDone) ? saved.dayScenesDone : [];
    const dayScenesDone = [...new Set(originalDone.filter((sceneId) => validDaySceneIds.has(sceneId)))];
    const removedCompletedScene = dayScenesDone.length !== originalDone.length;
    const max = Math.max(0, Number(structure.dayBudget ?? saved.dayBudget?.max ?? 0));
    const used = Math.min(max, dayScenesDone.length);
    const activeDaySceneId = validDaySceneIds.has(saved.activeDaySceneId) ? saved.activeDaySceneId : null;
    const callbackOpenerId = validOpenerIds.has(saved.callbackOpenerId) ? saved.callbackOpenerId : null;
    const earnedItems = [...new Set((saved.earnedItems ?? []).filter((itemId) => validOpenerIds.has(itemId)))];

    if (caseId === currentBriefId && (removedCompletedScene || saved.activeDaySceneId && !activeDaySceneId)) {
      currentProgressNeedsDayMap = true;
    }

    return [caseId, {
      ...saved,
      dayBudget: { max, used, remaining: Math.max(0, max - used) },
      dayScenesDone,
      earnedItems,
      activeDaySceneId,
      callbackOpenerId,
      dayChoices: filterRecordKeys(saved.dayChoices, validDaySceneIds),
      dayFollowups: filterRecordKeys(saved.dayFollowups, validDaySceneIds),
      timelineSorts: filterRecordKeys(saved.timelineSorts, validDaySceneIds)
    }];
  }));

  const scene = currentProgressNeedsDayMap && ["dayScene", "dayMap", "overnightCallback"].includes(state.scene)
    ? "dayMap"
    : state.scene;
  return { ...state, scene, caseOvernights };
}

function filterRecordKeys(record = {}, validKeys = new Set()) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return {};
  return Object.fromEntries(Object.entries(record).filter(([key]) => validKeys.has(key)));
}
