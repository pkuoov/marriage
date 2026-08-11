import {
  applyActionMark,
  caseKey,
  casePatienceLost,
  initialCaseBudget,
  recordPatienceLostState,
  refundOneBudgetPoint,
  retryPatienceLostState
} from "./caseBudgetModel.js";
import {
  documentById,
  documentQuestionId,
  documentRowById,
  documentsFor,
  earnedDocumentQuestionsFor
} from "./documentMarkModel.js";
import {
  liveCounterBeatAfterScene,
  liveCounterBeatBeforeScene,
  liveCounterBeatById,
  liveCounterBeatsFor,
  liveCounterBeatTriggerMet
} from "./liveCounterModel.js";
import {
  availableCallbackOpeners,
  availableOvernightCallbackOpeners,
  callbackOpenerById,
  canCompleteNightAction,
  canEnterOvernightCallback,
  completeNightAction,
  daySceneById,
  initialNightStateFor,
  initialOvernightStateFor,
  interludeEarnedItemsForOvernight,
  nightActionById,
  nightActionCost,
  nightActionCountsForBudget,
  nightSegmentLastSceneIndex,
  nightSegmentSceneIndexes,
  nightStructureFor,
  overnightAnchorSceneIndex,
  overnightCallbackDialogueLines,
  overnightCallbackOpenerById,
  overnightCallerQuestionFor,
  overnightFirstNight2SceneIndex,
  overnightReturnPostureFor,
  overnightStructureFor,
  returnStanceFor,
  shouldEnterHangupAfterScene,
  shouldEnterOvernightHangupAfterScene,
  snapshotEchoFor
} from "./nightOvernightModel.js";

export {
  applyActionMark,
  availableCallbackOpeners,
  availableOvernightCallbackOpeners,
  callbackOpenerById,
  canCompleteNightAction,
  canEnterOvernightCallback,
  caseKey,
  casePatienceLost,
  completeNightAction,
  daySceneById,
  documentById,
  documentQuestionId,
  documentRowById,
  documentsFor,
  earnedDocumentQuestionsFor,
  initialCaseBudget,
  initialNightStateFor,
  initialOvernightStateFor,
  interludeEarnedItemsForOvernight,
  liveCounterBeatAfterScene,
  liveCounterBeatBeforeScene,
  liveCounterBeatById,
  liveCounterBeatsFor,
  liveCounterBeatTriggerMet,
  nightActionById,
  nightActionCost,
  nightActionCountsForBudget,
  nightSegmentLastSceneIndex,
  nightSegmentSceneIndexes,
  nightStructureFor,
  overnightAnchorSceneIndex,
  overnightCallbackDialogueLines,
  overnightCallbackOpenerById,
  overnightCallerQuestionFor,
  overnightFirstNight2SceneIndex,
  overnightReturnPostureFor,
  overnightStructureFor,
  recordPatienceLostState,
  refundOneBudgetPoint,
  returnStanceFor,
  retryPatienceLostState,
  shouldEnterHangupAfterScene,
  shouldEnterOvernightHangupAfterScene,
  snapshotEchoFor
};

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

export function playableSceneIndexes(brief = {}) {
  const total = brief.sceneVersions?.length ?? 0;
  const structure = nightStructureFor(brief);
  if (!structure) return Array.from({ length: total }, (_, index) => index);
  const indexes = [
    ...(structure.segment1SceneIndexes ?? []),
    ...(structure.segment2SceneIndexes ?? [])
  ];
  return [...new Set(indexes.map(Number))].filter((index) => Number.isInteger(index) && index >= 0 && index < total);
}

export function playableSceneCount(brief = {}) {
  return playableSceneIndexes(brief).length;
}

export function nextPlayableSceneIndex(brief = {}, sceneIndex = -1) {
  const indexes = playableSceneIndexes(brief);
  const position = indexes.indexOf(Number(sceneIndex));
  return position >= 0 && position < indexes.length - 1 ? indexes[position + 1] : -1;
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
  return playableSceneIndexes(brief).filter((index) => actionDone(`version:${index}`)).length;
}

export function evidenceAnsweredCount(brief = {}, actionDone = () => false) {
  return evidenceChecksFor(brief).filter((_, index) => actionDone(`evidenceCheck:${index}`)).length;
}

export function investigationRouteIndexBase(brief = {}) {
  return keyQuestionLimit(brief) + evidenceChecksFor(brief).length;
}

export function firstUnansweredSceneIndex(brief = {}, actionDone = () => false) {
  const indexes = playableSceneIndexes(brief);
  const index = indexes.find((sceneIndex) => !actionDone(`version:${sceneIndex}`));
  return index ?? indexes[indexes.length - 1] ?? 0;
}

export function sceneReviewModel({ brief = {}, index = 0, actionDone = () => false, issueBadge = false, hasDeepFollowup = false } = {}) {
  const scenes = brief.sceneVersions ?? [];
  const total = scenes.length || 1;
  const safeIndex = Math.max(0, Math.min(Number(index ?? 0), total - 1));
  const scene = scenes[safeIndex] ?? {};
  const done = actionDone(`version:${safeIndex}`);
  const pendingSnapshot = done ? stanceSnapshotForScene(brief, safeIndex, actionDone) : null;
  const pendingAfterSceneEvidence = done ? afterSceneEvidenceFor(brief, safeIndex, actionDone) : null;
  const activeIndexes = playableSceneIndexes(brief);
  const lastStage = safeIndex === activeIndexes[activeIndexes.length - 1];
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
  const required = playableSceneCount(brief);
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
