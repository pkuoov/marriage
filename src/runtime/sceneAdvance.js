export function caseKey(brief) {
  return brief?.id ?? "daily";
}

export function initialCaseBudget(max = 0) {
  return { max, remaining: max, used: 0 };
}

export function applyActionMark({ caseActionLog = {}, caseId = "daily", actionKey = "", budget = null, spend = false } = {}) {
  const caseLog = caseActionLog?.[caseId] ?? {};
  const alreadyDone = Boolean(caseLog[actionKey]);
  const nextBudget = budget ? { ...budget } : null;
  if (nextBudget && spend && !alreadyDone) {
    nextBudget.remaining = Math.max(0, Number(nextBudget.remaining ?? 0) - 1);
    nextBudget.used = Number(nextBudget.used ?? 0) + 1;
  }
  return {
    alreadyDone,
    budget: nextBudget,
    caseActionLog: {
      ...(caseActionLog ?? {}),
      [caseId]: {
        ...caseLog,
        [actionKey]: true
      }
    }
  };
}

export function casePatienceLost({ budget = {}, answeredScenes = 0, requiredScenes = 0, answeredEvidence = 0, requiredEvidence = 0 } = {}) {
  const allAnswered = answeredScenes >= requiredScenes && answeredEvidence >= requiredEvidence;
  return Number(budget.remaining ?? 0) <= 0 && !allAnswered;
}

export function recordPatienceLostState({ state = {}, brief = {}, context = {} } = {}) {
  return {
    ...state,
    scene: "patienceLost",
    patienceLostContext: {
      caseId: caseKey(brief),
      ...(context ?? {})
    },
    lastReaction: null,
    lastPressureSignal: null,
    lastPressureAxis: null
  };
}

export function retryPatienceLostState({ state = {}, brief = {}, context = null, budget = null, areaTotal = 1 } = {}) {
  const retryContext = context ?? state.patienceLostContext ?? {};
  const key = retryContext.caseId ?? caseKey(brief);
  const answerId = retryContext.answerKey;
  let nextState = { ...state };

  if (answerId && retryContext.removeQuestionPick) {
    nextState.sceneQuestionPicks = omitRecordKey(nextState.sceneQuestionPicks, answerId);
    nextState.sceneAnswers = omitRecordKey(nextState.sceneAnswers, answerId);
  }

  if (answerId && retryContext.dialogueOptionIndex !== undefined) {
    const current = nextState.sceneDialoguePicks?.[answerId] ?? [];
    nextState.sceneDialoguePicks = {
      ...(nextState.sceneDialoguePicks ?? {}),
      [answerId]: current.filter((item) => Number(item.optionIndex) !== Number(retryContext.dialogueOptionIndex))
    };
  }

  if (answerId && retryContext.removeEvidencePick) {
    nextState.evidenceCheckPicks = omitRecordKey(nextState.evidenceCheckPicks, answerId);
  }

  if (answerId && retryContext.removeInvestigationPick) {
    nextState.investigationPicks = omitRecordKey(nextState.investigationPicks, answerId);
  }

  if (Number.isInteger(retryContext.routeIndex)) {
    nextState.routeChoiceLog = {
      ...(nextState.routeChoiceLog ?? {}),
      [key]: (nextState.routeChoiceLog?.[key] ?? []).filter((item) => Number(item.sceneIndex) !== Number(retryContext.routeIndex))
    };
  }

  nextState.caseActionLog = {
    ...(nextState.caseActionLog ?? {}),
    [key]: omitRecordKeys(nextState.caseActionLog?.[key] ?? {}, retryContext.actionKeys ?? [])
  };

  if (retryContext.spent) {
    nextState.caseBudgets = {
      ...(nextState.caseBudgets ?? {}),
      [key]: refundOneBudgetPoint(budget ?? nextState.caseBudgets?.[key] ?? {})
    };
  }

  const area = retryContext.area ?? "sceneReview";
  if (Number.isInteger(retryContext.index)) {
    nextState.dialogueProgress = {
      ...(nextState.dialogueProgress ?? {}),
      [`${key}:${area}`]: clampProgressIndex(retryContext.index, areaTotal)
    };
  }

  return {
    ...nextState,
    scene: area,
    lastReaction: null,
    lastPressureSignal: null,
    lastPressureAxis: null,
    patienceLostContext: null
  };
}

export function refundOneBudgetPoint(budget = {}) {
  const max = Math.max(0, Number(budget.max ?? 0));
  const remaining = Math.min(max, Number(budget.remaining ?? 0) + 1);
  const used = Math.max(0, Number(budget.used ?? 0) - 1);
  return { ...budget, max, remaining, used };
}

export function answerKey(brief, index) {
  return `${caseKey(brief)}:scene:${index}`;
}

export function evidenceAnswerKey(brief, index) {
  return `${caseKey(brief)}:evidence:${index}`;
}

export function investigationAnswerKey(brief, index) {
  return `${caseKey(brief)}:investigation:${index}`;
}

export function keyQuestionLimit(brief = {}) {
  return brief.sceneVersions?.length ?? 0;
}

export function evidenceChecksFor(brief = {}) {
  return Array.isArray(brief?.evidenceChecks) ? brief.evidenceChecks : [];
}

export function pendingEvidenceChecksFor(brief = {}, actionDone = () => false) {
  return evidenceChecksFor(brief)
    .map((check, index) => ({ check, index }))
    .filter(({ index }) => !actionDone(`evidenceCheck:${index}`));
}

export function investigationHooksFor(brief = {}) {
  return Array.isArray(brief?.investigationHooks) ? brief.investigationHooks : [];
}

export function documentsFor(brief = {}) {
  return Array.isArray(brief?.documents) ? brief.documents : [];
}

export function documentById(brief = {}, documentId = "") {
  return documentsFor(brief).find((document) => document.id === documentId) ?? null;
}

export function documentRowById(document = {}, rowId = "") {
  return (document?.rows ?? []).find((row) => row.rowId === rowId) ?? null;
}

export function documentQuestionId(documentId = "", kind = "row", rowIds = [], question = "") {
  const rows = (rowIds ?? []).join("+");
  let hash = 2166136261;
  for (const char of `${documentId}:${kind}:${rows}:${question}`) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `${documentId}:${kind}:${rows}:${(hash >>> 0).toString(36)}`;
}

export function earnedDocumentQuestionsFor(document = {}, markedRows = []) {
  const marked = new Set(markedRows ?? []);
  const questions = [];
  for (const rowId of marked) {
    const rowQuestions = document?.rowQuestions?.[rowId] ?? [];
    rowQuestions.forEach((question) => {
      questions.push({
        ...question,
        id: documentQuestionId(document.id, "row", [rowId], question.question),
        documentId: document.id,
        kind: "row",
        rows: [rowId]
      });
    });
  }
  (document?.crossQuestions ?? []).forEach((question) => {
    const rows = question.rows ?? [];
    if (!rows.length || !rows.every((rowId) => marked.has(rowId))) return;
    questions.push({
      ...question,
      id: documentQuestionId(document.id, "cross", rows, question.question),
      documentId: document.id,
      kind: "cross",
      routeAxis: question.routeAxis ?? "money-flow"
    });
  });
  const seen = new Set();
  return questions.filter((question) => {
    const key = `${question.question}\n${question.answer}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

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
    callerQuestionChoiceId: null
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

export function shouldEnterHangupAfterScene(brief = {}, sceneIndex = 0) {
  return Boolean(nightStructureFor(brief)) && Number(sceneIndex) === nightSegmentLastSceneIndex(brief, "segment1");
}

export function overnightAnchorSceneIndex(brief = {}) {
  const structure = overnightStructureFor(brief);
  const anchor = String(structure?.hangupAnchor ?? "").trim();
  if (!anchor) return -1;
  return (brief.sceneVersions ?? []).findIndex((scene) => String(scene?.version ?? "").includes(anchor));
}

export function overnightFirstNight2SceneIndex(brief = {}) {
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
  return (overnight.dayScenesDone ?? []).length >= required;
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

export function liveCounterBeatsFor(brief = {}) {
  const beats = overnightStructureFor(brief)?.liveCounterBeats;
  return Array.isArray(beats) ? beats : [];
}

export function liveCounterBeatById(brief = {}, beatId = "") {
  return liveCounterBeatsFor(brief).find((beat) => beat.id === beatId) ?? null;
}

export function liveCounterBeatAfterScene(brief = {}, sceneIndex = 0, actionDone = () => false) {
  return liveCounterBeatsFor(brief).find((beat) => (
    Number(beat.afterSceneIndex) === Number(sceneIndex)
      && !actionDone(`liveCounterBeat:${beat.id}`)
  )) ?? null;
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

export function delegationFor(brief = {}) {
  const delegation = brief?.delegation;
  if (!delegation || typeof delegation !== "object") return null;
  if (!delegation.material || typeof delegation.outcomes !== "object") return null;
  return delegation;
}

export function delegationOutcomeFor(delegation = {}, advisorId = "") {
  return delegation?.outcomes?.[advisorId] ?? null;
}

export function delegationRouteAxisForAdvisor(advisorId = "") {
  return {
    "zhou-accountant": "money-flow",
    "zhao-lawyer": "process-control",
    "lin-matchmaker": "identity-wording",
    "zhang-forensic": "document-edge"
  }[advisorId] ?? "outer-thread";
}

export function answeredSceneCount(brief = {}, actionDone = () => false) {
  return (brief.sceneVersions ?? []).filter((_, index) => actionDone(`version:${index}`)).length;
}

export function evidenceAnsweredCount(brief = {}, actionDone = () => false) {
  return evidenceChecksFor(brief).filter((_, index) => actionDone(`evidenceCheck:${index}`)).length;
}

export function investigationRouteIndexBase(brief = {}) {
  return keyQuestionLimit(brief) + evidenceChecksFor(brief).length;
}

export function firstUnansweredSceneIndex(brief = {}, actionDone = () => false) {
  const scenes = brief.sceneVersions ?? [];
  const index = scenes.findIndex((_, sceneIndex) => !actionDone(`version:${sceneIndex}`));
  return index >= 0 ? index : Math.max(0, scenes.length - 1);
}

export function sceneReviewModel({ brief = {}, index = 0, actionDone = () => false, issueBadge = false, hasDeepFollowup = false } = {}) {
  const scenes = brief.sceneVersions ?? [];
  const total = scenes.length || 1;
  const safeIndex = Math.max(0, Math.min(Number(index ?? 0), total - 1));
  const scene = scenes[safeIndex] ?? {};
  const done = actionDone(`version:${safeIndex}`);
  const pendingSnapshot = done ? stanceSnapshotForScene(brief, safeIndex, actionDone) : null;
  const pendingAfterSceneEvidence = done ? afterSceneEvidenceFor(brief, safeIndex, actionDone) : null;
  const lastStage = safeIndex >= scenes.length - 1;
  const overnightHangupStage = done && shouldEnterOvernightHangupAfterScene(brief, safeIndex);
  const hangupStage = done && (shouldEnterHangupAfterScene(brief, safeIndex) || overnightHangupStage);
  const flowBreak = Boolean(pendingSnapshot || pendingAfterSceneEvidence || hangupStage || lastStage);
  const hasEvidence = pendingEvidenceChecksFor(brief, actionDone).length > 0;
  const canDeepFollow = Boolean(issueBadge && hasDeepFollowup);
  const nextStage = pendingSnapshot
    ? "stanceSnapshot"
    : pendingAfterSceneEvidence
      ? "afterSceneEvidence"
      : hangupStage
        ? overnightHangupStage ? "overnightHangup" : "hangupBeat"
      : lastStage
        ? hasEvidence ? "evidenceCheck" : canDeepFollow ? "deepFollowup" : "accusation"
        : "sceneReview";
  const nextLabel = pendingSnapshot
    ? pendingSnapshot.nextLabel ?? "先站一下"
    : pendingAfterSceneEvidence
      ? pendingAfterSceneEvidence.nextLabel ?? "看这份材料"
      : hangupStage
        ? "等她回拨"
      : lastStage
        ? hasEvidence ? "看材料" : canDeepFollow ? "再深入一句" : "选一句往下追"
        : "继续";
  return {
    scenes,
    index: safeIndex,
    scene,
    done,
    lastStage: flowBreak,
    naturalLastStage: lastStage,
    hasEvidence,
    canDeepFollow,
    pendingSnapshot,
    pendingAfterSceneEvidence,
    nextStage,
    nextLabel
  };
}

export function evidenceCheckModel({ brief = {}, index = 0, pick = null, issueBadge = false, hasDeepFollowup = false } = {}) {
  const checks = evidenceChecksFor(brief);
  const total = checks.length || 1;
  const safeIndex = Math.max(0, Math.min(Number(index ?? 0), total - 1));
  const check = checks[safeIndex] ?? null;
  const lastCheck = safeIndex >= checks.length - 1;
  const nextStage = afterEvidenceScene({ issueBadge, hasDeepFollowup });
  return {
    checks,
    index: safeIndex,
    check,
    pick,
    missing: !check,
    lastCheck,
    nextStage,
    nextLabel: nextStage === "deepFollowup" ? "再深入一句" : "选一句往下追"
  };
}

export function afterSceneEvidenceFor(brief = {}, sceneIndex = 0, actionDone = () => false) {
  const scene = brief?.sceneVersions?.[sceneIndex] ?? null;
  const afterScene = scene?.afterScene;
  if (!afterScene || afterScene.kind !== "evidenceCheck") return null;
  if (actionDone(`afterScene:${sceneIndex}`)) return null;
  const checks = evidenceChecksFor(brief);
  const checkIndex = checks.findIndex((check) => check.id === afterScene.checkId);
  if (checkIndex < 0) return null;
  return {
    ...afterScene,
    sceneIndex,
    checkIndex,
    check: checks[checkIndex]
  };
}

export function stanceSnapshotForScene(brief = {}, sceneIndex = 0, actionDone = () => false) {
  const snapshot = brief?.stanceSnapshot;
  if (!snapshot || !Array.isArray(snapshot.options) || !snapshot.options.length) return null;
  const afterScene = Number(snapshot.afterScene ?? 0);
  if (afterScene !== sceneIndex + 1) return null;
  if (actionDone(`stanceSnapshot:${sceneIndex}`)) return null;
  return {
    ...snapshot,
    sceneIndex
  };
}

export function investigationBackflowModel({ entries = [], selectedPick = () => null } = {}) {
  const normalized = Array.isArray(entries) ? entries : [];
  const entry = normalized.find((item) => !selectedPick(item.index)) ?? normalized[normalized.length - 1] ?? null;
  const pick = entry ? selectedPick(entry.index) : null;
  return {
    entries: normalized,
    entry,
    hook: entry?.hook ?? null,
    index: entry?.index ?? -1,
    pick,
    missing: !entry,
    nextStage: "caseSolved",
    nextLabel: "继续回看"
  };
}

export function dailyAccusationReadiness(brief = {}, actionDone = () => false) {
  const required = keyQuestionLimit(brief);
  const sceneCount = answeredSceneCount(brief, actionDone);
  if (sceneCount < required) return { ready: false, message: "麦还没到能挂的时候，先把当前这段问完。" };
  const evidenceRequired = evidenceChecksFor(brief).length;
  const evidenceCount = evidenceAnsweredCount(brief, actionDone);
  if (evidenceCount < evidenceRequired) return { ready: false, message: "材料还摆在台面上，先把少的那块圈出来。" };
  return { ready: true, message: "" };
}

export function afterEvidenceScene({ issueBadge = false, hasDeepFollowup = false } = {}) {
  return issueBadge && hasDeepFollowup ? "deepFollowup" : "accusation";
}

export function unlockedInvestigationEntries(brief = {}, { foundContradictions = [], actionDone = () => false } = {}) {
  const found = new Set(foundContradictions);
  return investigationHooksFor(brief)
    .map((hook, index) => ({ hook, index }))
    .filter(({ hook }) => {
      if (hook.triggerAction && actionDone(hook.triggerAction)) return true;
      if (hook.triggerContradiction && found.has(hook.triggerContradiction)) return true;
      return false;
    });
}

function clampProgressIndex(index = 0, total = 1) {
  return Math.max(0, Math.min(Number(index ?? 0), Math.max(0, Number(total || 1) - 1)));
}

function omitRecordKey(record = {}, keyToOmit) {
  return Object.fromEntries(Object.entries(record ?? {}).filter(([key]) => key !== keyToOmit));
}

function omitRecordKeys(record = {}, keysToOmit = []) {
  const remove = new Set(keysToOmit ?? []);
  return Object.fromEntries(Object.entries(record ?? {}).filter(([key]) => !remove.has(key)));
}
