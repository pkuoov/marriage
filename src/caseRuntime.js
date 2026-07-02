import { caseBudgetDelta } from "./difficulty.js?v=0.20.35";

export function calculateCaseOutcome({ result, contradictionCount, budgetRemaining, now = Date.now() }) {
  const efficient = contradictionCount >= 3 && budgetRemaining >= 1;
  const reputationDelta = result.correct ? (efficient ? 3 : 2) : -1;
  const heatDelta = result.correct ? -1 : 2;
  const summary = result.correct
    ? efficient
      ? "这轮问得顺，咨询者愿意把后面那几句也补出来。"
      : "方向是对的，只是中间绕了一点。咨询者还在配合，语气比刚才谨慎些。"
    : "这轮有点被开场带跑了。弹幕已经开始吵：刚才那几句是不是听漏了。";

  return {
    interlude: {
      reputationDelta,
      heatDelta,
      summary,
      efficient,
      at: now
    }
  };
}

export function expectedAccusationForCase(brief) {
  const structural = structuralExpectedAccusationForCase(brief);
  return structural ?? relationshipExpectedAccusationForCase(brief);
}

export function structuralExpectedAccusationForCase(brief) {
  return brief?.structuralActorId ?? null;
}

export function relationshipExpectedAccusationForCase(brief) {
  if (brief.stance === "selfDoubt") return "both";
  if (brief.stance === "halfTruth") return "both";
  if (brief.stance === "selfJustifying") return brief.complainantId;
  if (brief.stance === "badActorFirst") return brief.complainantId;
  if (brief.stance === "trueVictim") return brief.respondentId;
  if (brief.stance === "personalityMismatch") return "noPremeditated";
  if (brief.premeditated) return brief.premeditatedActorId;
  return "both";
}

export function resolveAccusationForCase({ brief, accused, contradictionCount, requiredContradictions, allowCorrectWithoutThreshold = false }) {
  const expected = expectedAccusationForCase(brief);
  const enoughContradictions = contradictionCount >= requiredContradictions;
  const expectedHit = accused === expected || (expected === "both" && accused === "both");
  const correct = expectedHit && (enoughContradictions || allowCorrectWithoutThreshold);
  return {
    result: {
      caseId: brief.id,
      accused,
      expected,
      relationshipExpected: relationshipExpectedAccusationForCase(brief),
      structuralExpected: structuralExpectedAccusationForCase(brief),
      correct,
      contradictionCount,
      enoughContradictions,
      thresholdForgiven: correct && !enoughContradictions
    },
    enoughContradictions
  };
}

export function allCaseContradictions(brief) {
  const sceneItems = (brief.sceneVersions ?? []).map((item) => item.contradiction).filter(Boolean);
  const evidenceItems = (brief.evidenceCards ?? []).map((item) => item.contradiction).filter(Boolean);
  return [...new Set([...sceneItems, ...evidenceItems])];
}

export function coreIssuePoints(brief) {
  return [...new Set((brief.sceneVersions ?? []).map((scene) => scene.contradiction).filter(Boolean))];
}

export function calculateIssueCompletion({ brief, foundContradictions = [], requiredLimit }) {
  const points = coreIssuePoints(brief);
  const found = new Set(foundContradictions);
  const revealed = points.filter((point) => found.has(point));
  const required = Math.max(1, Math.min(points.length || 1, requiredLimit || points.length || 1));
  const countedRevealed = revealed.slice(0, required);
  const missed = points.filter((point) => !found.has(point)).slice(0, Math.max(0, required - countedRevealed.length));
  const percent = Math.round((countedRevealed.length / required) * 100);
  return {
    total: required,
    revealed: countedRevealed,
    missed,
    percent,
    ratio: countedRevealed.length / required,
    badge: countedRevealed.length === required
  };
}

export function nextInspirationContradictionForCase(brief, foundContradictions = []) {
  const found = new Set(foundContradictions);
  return allCaseContradictions(brief).find((item) => !found.has(item) && !found.has(`出示证据：${item}`)) ?? null;
}

export function calculateCaseBudgetMax({ brief, bonusPoints = 0 }) {
  const base = 7;
  const toolBonus = bonusPoints >= 5 ? 1 : 0;
  return Math.max(4, base + caseBudgetDelta(brief) + toolBonus);
}

export function calculateInspirationMax() {
  return 1;
}
