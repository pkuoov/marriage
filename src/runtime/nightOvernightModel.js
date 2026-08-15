export function nightStructureFor(brief = {}) {
  const structure = brief?.nightStructure;
  if (!structure || structure.enabled !== true) return null;
  return structure;
}

export function overnightStructureFor(brief = {}) {
  const structure = brief?.overnightStructure;
  if (!structure || typeof structure !== "object" || Array.isArray(structure)) return null;
  return structure;
}

export function initialNightStateFor(brief = {}) {
  const structure = nightStructureFor(brief);
  const max = Math.max(0, Number(structure?.interlude?.budget ?? 0));
  return {
    segment: "segment1",
    hangupDone: false,
    interludeBudget: { max, remaining: max, used: 0 },
    interludeActionsDone: [],
    interludeChoicesDone: [],
    inventory: [],
    callbackOpenerId: null,
    callerStanceOnReturn: "neutral",
    stanceNudge: null
  };
}

export function initialOvernightStateFor(brief = {}) {
  const structure = overnightStructureFor(brief);
  const max = Math.max(0, Number(structure?.dayBudget ?? 0));
  return {
    segment: "night1",
    hangupDone: false,
    dayBudget: { max, remaining: max, used: 0 },
    dayScenesDone: [],
    earnedItems: [],
    timelineSorts: {},
    dayFollowups: {},
    dayChoices: {},
    documentMarks: {},
    documentEarnedQuestions: [],
    documentAnsweredQuestions: {},
    activeDocumentQuestionId: null,
    activeDaySceneId: null,
    callbackOpenerId: null,
    callerQuestionChoiceId: null,
    callerQuestionHostChoiceId: null,
    callerQuestionStanceNudge: null
  };
}

export function nightActionById(brief = {}, actionId = "") {
  return (nightStructureFor(brief)?.interlude?.actions ?? []).find((action) => action.id === actionId) ?? null;
}

export function canCompleteNightAction(night = {}, action = {}, structure = {}) {
  const actionId = action?.id ?? "";
  if (!actionId) return { ok: false, reason: "missing-action" };
  if ((night.interludeActionsDone ?? []).includes(actionId)) return { ok: true, reason: "already-done" };
  const maxActions = Math.max(0, Number(structure?.interlude?.maxActions ?? Infinity));
  const doneCount = (night.interludeActionsDone ?? []).filter((id) => nightActionCountsForBudget(structure, id)).length;
  if (nightActionCountsForBudget(structure, actionId) && doneCount >= maxActions) return { ok: false, reason: "max-actions" };
  const cost = nightActionCost(action);
  if (Number(night.interludeBudget?.remaining ?? 0) < cost) return { ok: false, reason: "budget" };
  return { ok: true, reason: "" };
}

export function completeNightAction(night = {}, action = {}, structure = {}) {
  const readiness = canCompleteNightAction(night, action, structure);
  if (!readiness.ok || readiness.reason === "already-done") return night;
  const cost = nightActionCost(action);
  const budget = night.interludeBudget ?? { max: 0, remaining: 0, used: 0 };
  const grants = Array.isArray(action.grantsInventory) ? action.grantsInventory : [];
  return {
    ...night,
    segment: "interlude",
    activeActionId: null,
    interludeBudget: {
      ...budget,
      remaining: Math.max(0, Number(budget.remaining ?? 0) - cost),
      used: Number(budget.used ?? 0) + cost
    },
    interludeActionsDone: [...new Set([...(night.interludeActionsDone ?? []), action.id])],
    inventory: [...new Set([...(night.inventory ?? []), ...grants])]
  };
}

export function availableCallbackOpeners(brief = {}, inventory = [], choiceIds = []) {
  const carried = new Set(inventory ?? []);
  const choices = new Set(choiceIds ?? []);
  return (nightStructureFor(brief)?.callbackOpeners ?? []).filter((opener) => {
    if ((opener.blocksIfInventory ?? []).some((item) => carried.has(item))) return false;
    if (opener.requiresChoiceId && !choices.has(opener.requiresChoiceId)) return false;
    const requirements = opener.requiresAny ?? [];
    if (!requirements.length) return true;
    return requirements.some((item) => carried.has(item));
  });
}

export function callbackOpenerById(brief = {}, openerId = "") {
  return (nightStructureFor(brief)?.callbackOpeners ?? []).find((opener) => opener.id === openerId) ?? null;
}

export function returnStanceFor(brief = {}, snapshotPick = null) {
  const stance = nightStructureFor(brief)?.returnStance;
  const optionId = snapshotPick?.id ?? "";
  return stance?.fromSnapshotOptionIds?.[optionId] ?? stance?.default ?? "neutral";
}

export function overnightReturnPostureFor(snapshotPick = null, stanceNudge = null) {
  if (stanceNudge === "defensive") return "againstCaller";
  if (stanceNudge === "open") return "withCaller";
  return snapshotPick?.id === "caller-benefited" ? "againstCaller" : "withCaller";
}

export function nightSegmentSceneIndexes(brief = {}, segment = "segment1") {
  const structure = nightStructureFor(brief);
  const field = segment === "segment2" ? "segment2SceneIndexes" : "segment1SceneIndexes";
  return Array.isArray(structure?.[field]) ? structure[field] : [];
}

export function nightSegmentLastSceneIndex(brief = {}, segment = "segment1") {
  const indexes = nightSegmentSceneIndexes(brief, segment);
  return indexes.length ? indexes[indexes.length - 1] : -1;
}

export function liveSceneForCurrentSegment(brief = {}, { night = {}, overnight = {} } = {}) {
  if (overnightStructureFor(brief)) {
    return overnight?.segment === "night2" ? "overnightNight2" : "overnightNight1";
  }
  if (nightStructureFor(brief)) {
    return night?.segment === "segment2" ? "callSegment2" : "callSegment1";
  }
  return "sceneReview";
}

export function shouldEnterHangupAfterScene(brief = {}, sceneIndex = 0) {
  return Boolean(nightStructureFor(brief)) && Number(sceneIndex) === nightSegmentLastSceneIndex(brief, "segment1");
}

export function overnightAnchorSceneIndex(brief = {}) {
  const structure = overnightStructureFor(brief);
  const anchor = String(structure?.hangupAnchor ?? "").trim();
  if (!anchor) return -1;
  return (brief.sceneVersions ?? []).findIndex((scene) => [
    scene?.version,
    ...(scene?.sceneCloser?.lines ?? []).map((line) => line?.text)
  ].filter(Boolean).join("\n").includes(anchor));
}

export function overnightFirstNight2SceneIndex(brief = {}) {
  const secondNightIndexes = nightSegmentSceneIndexes(brief, "segment2");
  if (secondNightIndexes.length) return secondNightIndexes[0];
  const anchorIndex = overnightAnchorSceneIndex(brief);
  const total = brief.sceneVersions?.length ?? 0;
  if (anchorIndex < 0) return 0;
  return Math.min(total - 1, anchorIndex + 1);
}

export function shouldEnterOvernightHangupAfterScene(brief = {}, sceneIndex = 0) {
  return Boolean(overnightStructureFor(brief)) && Number(sceneIndex) === overnightAnchorSceneIndex(brief);
}

export function daySceneById(brief = {}, sceneId = "") {
  return (overnightStructureFor(brief)?.dayScenes ?? []).find((scene) => scene.id === sceneId) ?? null;
}

export function availableOvernightCallbackOpeners(brief = {}, earnedItems = []) {
  const carried = new Set(earnedItems ?? []);
  return Object.entries(overnightStructureFor(brief)?.callbackOpeners ?? {})
    .filter(([earnedItemId]) => carried.has(earnedItemId))
    .map(([id, opener]) => ({ id, ...(opener ?? {}) }));
}

export function interludeEarnedItemsForOvernight(brief = {}, inventory = []) {
  const structure = overnightStructureFor(brief);
  const mapping = structure?.interludeEarnedItemMap ?? {};
  const openerIds = new Set(Object.keys(structure?.callbackOpeners ?? {}));
  const carried = new Set(inventory ?? []);
  const directItems = [...carried].filter((inventoryId) => openerIds.has(inventoryId));
  const mappedItems = Object.entries(mapping)
    .filter(([inventoryId]) => carried.has(inventoryId))
    .flatMap(([, earnedItemIds]) => Array.isArray(earnedItemIds) ? earnedItemIds : [earnedItemIds])
    .filter(Boolean);
  return [...new Set([...directItems, ...mappedItems])];
}

export function canEnterOvernightCallback(brief = {}, overnight = {}) {
  const structure = overnightStructureFor(brief);
  if (!structure) return false;
  const required = Math.max(0, Number(structure.minDayScenes ?? 0));
  const validSceneIds = new Set((structure.dayScenes ?? []).map((scene) => scene.id));
  const completed = new Set((overnight.dayScenesDone ?? []).filter((sceneId) => validSceneIds.has(sceneId)));
  return completed.size >= required;
}

export function overnightCallbackOpenerById(brief = {}, openerId = "") {
  const opener = overnightStructureFor(brief)?.callbackOpeners?.[openerId];
  return opener ? { id: openerId, ...opener } : null;
}

export function snapshotEchoFor(brief = {}, snapshotPick = null) {
  const optionId = snapshotPick?.id ?? "";
  if (!optionId) return "";
  return overnightStructureFor(brief)?.snapshotEcho?.[optionId] ?? "";
}

export function overnightCallbackDialogueLines(brief = {}, { stanceLine = "", opener = {}, snapshotEcho = "" } = {}) {
  const structure = overnightStructureFor(brief) ?? {};
  const firstConflict = opener.firstConflict ?? {};
  return [
    ...(stanceLine ? [{ role: "caller", text: stanceLine }] : []),
    ...(structure.returnLead?.lines ?? []),
    ...(opener.line ? [{ role: "caller", text: opener.line }] : []),
    ...(firstConflict.lines ?? (firstConflict.hostLine ? [{ role: "host", text: firstConflict.hostLine }] : [])),
    ...(firstConflict.callerLine ? [{ role: "caller", text: firstConflict.callerLine }] : []),
    ...(firstConflict.pauseAfterCallerLine ? [{ role: "pause" }] : []),
    ...(firstConflict.callerFollowupLine ? [{ role: "caller", text: firstConflict.callerFollowupLine }] : []),
    ...(snapshotEcho ? [{ role: "caller", text: snapshotEcho }] : []),
    ...(structure.returnBeat?.lines ?? [])
  ];
}

export function overnightCallerQuestionFor(brief = {}) {
  const question = overnightStructureFor(brief)?.callerQuestion;
  if (!question || typeof question !== "object" || Array.isArray(question)) return null;
  return question;
}

export function nightActionCost(action = {}) {
  if (action.kind === "interruptToast") return Math.max(0, Number(action.cost ?? 0));
  return Math.max(0, Number(action.cost ?? 1));
}

export function nightActionCountsForBudget(structure = {}, actionId = "") {
  const action = (structure?.interlude?.actions ?? []).find((item) => item.id === actionId);
  return action?.kind !== "interruptToast";
}
