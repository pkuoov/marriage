export function applyDifficultyProfile(brief, profile) {
  if (!profile) return brief;
  const previous = brief?.difficultyProfile ?? {};
  const nextProfile = {
    ...previous,
    ...profile
  };
  const currentDifficulty = Number(brief?.difficulty ?? 1);
  const minDifficulty = Number(nextProfile.minDifficulty ?? previous.minDifficulty ?? currentDifficulty);
  const targetDifficulty = Number(nextProfile.targetDifficulty ?? Math.max(currentDifficulty, minDifficulty));
  return {
    ...brief,
    difficulty: Number.isFinite(targetDifficulty) ? targetDifficulty : currentDifficulty,
    difficultyProfile: nextProfile
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

export function truthBoundaryPromptLimitForCase(brief, fallback = 5) {
  const value = Number(brief?.difficultyProfile?.truthBoundaryPromptLimit ?? fallback);
  if (!Number.isFinite(value)) return fallback;
  return Math.max(3, Math.min(9, Math.floor(value)));
}
