export function applyDifficultyProfile(brief, profile) {
  if (!profile) return brief;
  return {
    ...brief,
    difficulty: profile.targetDifficulty ?? Math.max(brief.difficulty ?? 1, profile.minDifficulty),
    difficultyProfile: profile
  };
}

export function requiredContradictionsForCase(brief) {
  if (brief?.difficultyProfile?.tier >= 4 && brief?.stance === "personalityMismatch") return 3;
  if (brief?.difficultyProfile?.requiredContradictions) return brief.difficultyProfile.requiredContradictions;
  if (brief?.structuralActorId) return 3;
  return brief?.premeditated ? 3 : 2;
}

export function caseBudgetDelta(brief) {
  return Number(brief?.difficultyProfile?.budgetDelta ?? 0);
}

export function inspirationBaseForCase(brief, mode) {
  if (brief?.difficultyProfile?.inspirationBase) return brief.difficultyProfile.inspirationBase;
  return 1;
}
