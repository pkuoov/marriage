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
