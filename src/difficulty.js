export function applyDifficultyProfile(brief, profile) {
  if (!profile) return brief;
  return {
    ...brief,
    difficulty: profile.targetDifficulty ?? Math.max(brief.difficulty ?? 1, profile.minDifficulty),
    difficultyProfile: profile
  };
}

export function requiredContradictionsForCase(brief) {
  const longCaseRequirement = Math.max(2, brief?.sceneVersions?.length ?? 0);
  if (brief?.difficultyProfile?.tier >= 4 && brief?.stance === "personalityMismatch") return 3;
  if (brief?.difficultyProfile?.requiredContradictions) {
    return Math.max(longCaseRequirement, brief.difficultyProfile.requiredContradictions);
  }
  if (brief?.structuralActorId) return Math.max(3, longCaseRequirement);
  return Math.max(brief?.premeditated ? 3 : 2, longCaseRequirement);
}

export function caseBudgetDelta(brief) {
  return Number(brief?.difficultyProfile?.budgetDelta ?? 0);
}
