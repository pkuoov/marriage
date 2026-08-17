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
    pendingQuestionPressureSignal: null,
    pendingQuestionPressureSource: null,
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
  const retryScene = retryContext.retryScene === "testimonyWall" ? "testimonyWall" : area;
  if (Number.isInteger(retryContext.index)) {
    nextState.dialogueProgress = {
      ...(nextState.dialogueProgress ?? {}),
      [`${key}:${area}`]: clampProgressIndex(retryContext.index, areaTotal)
    };
  }

  return {
    ...nextState,
    scene: retryScene,
    lastReaction: null,
    lastPressureSignal: null,
    pendingQuestionPressureSignal: null,
    pendingQuestionPressureSource: null,
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
