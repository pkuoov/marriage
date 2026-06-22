import { caseBudgetDelta, inspirationBaseForCase } from "./difficulty.js?v=0.14.0";

export function calculateCaseOutcome({ brief, result, contradictionCount, budgetRemaining, agencyReputation = 0, publicHeat = 0, now = Date.now() }) {
  const efficient = contradictionCount >= 3 && budgetRemaining >= 1;
  const reputationDelta = result.correct ? (efficient ? 3 : 2) : -1;
  const heatDelta = result.correct ? (brief.caseMode === "confession" ? 0 : -1) : 2;
  const summary = result.correct
    ? efficient
      ? "你不仅判断对了，还没有把当事人的耐心耗光。后台愿意把更完整的材料交给你。"
      : "你判断对了，但推进过程偏消耗。下一案能拿到信任，但配合度不会无限上升。"
    : "这案的判断没有站稳。旁听席开始争论侦探局是不是被讲故事的人带跑了。";

  return {
    agencyReputation: clamp(agencyReputation + reputationDelta, -3, 9),
    publicHeat: clamp(publicHeat + heatDelta, 0, 9),
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
  if (brief.premeditated) return brief.premeditatedActorId;
  if (brief.stance === "selfJustifying") return brief.complainantId;
  if (brief.stance === "selfDoubt") return "both";
  if (brief.stance === "halfTruth") return "both";
  if (brief.stance === "badActorFirst") return brief.complainantId;
  if (brief.stance === "trueVictim") return brief.respondentId;
  if (brief.stance === "personalityMismatch") return "noPremeditated";
  return "both";
}

export function resolveAccusationForCase({ brief, accused, contradictionCount, requiredContradictions }) {
  const expected = expectedAccusationForCase(brief);
  const enoughContradictions = contradictionCount >= requiredContradictions;
  const correct = (accused === expected || (expected === "both" && accused === "both")) && enoughContradictions;
  return {
    result: {
      caseId: brief.id,
      accused,
      expected,
      relationshipExpected: relationshipExpectedAccusationForCase(brief),
      structuralExpected: structuralExpectedAccusationForCase(brief),
      correct,
      contradictionCount
    },
    enoughContradictions
  };
}

export function allCaseContradictions(brief) {
  const sceneItems = (brief.sceneVersions ?? []).map((item) => item.contradiction).filter(Boolean);
  const testimonyItems = (brief.testimony ?? []).flatMap((item) => (item.followups ?? []).map((followup) => followup.contradiction).filter(Boolean));
  const evidenceItems = (brief.evidenceCards ?? []).map((item) => item.contradiction).filter(Boolean);
  const confessionItems = (brief.confessionTimeline ?? []).map((item) => item.contradiction).filter(Boolean);
  return [...new Set([...sceneItems, ...testimonyItems, ...evidenceItems, ...confessionItems])];
}

export function nextInspirationContradictionForCase(brief, foundContradictions = []) {
  const found = new Set(foundContradictions);
  return allCaseContradictions(brief).find((item) => !found.has(item) && !found.has(`出示证据：${item}`)) ?? null;
}

export function calculateCaseBudgetMax({ brief, bonusPoints = 0, agencyReputation = 0, publicHeat = 0 }) {
  const base = brief?.caseMode === "confession" ? 6 : 7;
  const toolBonus = bonusPoints >= 5 ? 1 : 0;
  const reputationBonus = agencyReputation >= 4 ? 1 : 0;
  const heatPenalty = publicHeat >= 5 ? -1 : 0;
  return Math.max(4, base + caseBudgetDelta(brief) + toolBonus + reputationBonus + heatPenalty);
}

export function calculateInspirationMax({ brief, caseMode, bonusPoints = 0 }) {
  if (brief?.tutorialChapter) return 99;
  const modeBase = inspirationBaseForCase(brief, caseMode);
  const veteranBonus = bonusPoints >= 12 ? 1 : 0;
  const difficultBonus = (brief?.difficulty ?? 0) >= 8 ? 1 : 0;
  return modeBase + veteranBonus + difficultBonus;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
