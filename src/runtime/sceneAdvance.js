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

export function investigationHooksFor(brief = {}) {
  return Array.isArray(brief?.investigationHooks) ? brief.investigationHooks : [];
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
  const lastStage = safeIndex >= scenes.length - 1;
  const hasEvidence = evidenceChecksFor(brief).length > 0;
  const canDeepFollow = Boolean(issueBadge && hasDeepFollowup);
  const nextStage = lastStage
    ? hasEvidence ? "evidenceCheck" : canDeepFollow ? "deepFollowup" : "accusation"
    : "sceneReview";
  const nextLabel = lastStage
    ? hasEvidence ? "看材料" : canDeepFollow ? "再深入一句" : "选一句往下追"
    : "继续";
  return {
    scenes,
    index: safeIndex,
    scene,
    done,
    lastStage,
    hasEvidence,
    canDeepFollow,
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
