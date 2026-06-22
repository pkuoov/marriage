export const STORY_DIFFICULTY_CURVE = [
  {
    tier: 1,
    label: "入门案",
    targetDifficulty: 4,
    minDifficulty: 4,
    requiredContradictions: 2,
    budgetDelta: 1,
    inspirationBase: 2,
    note: "先练习听出客户没说完整的地方，用较宽裕的资源建立方法。"
  },
  {
    tier: 2,
    label: "标准案",
    targetDifficulty: 6,
    minDifficulty: 6,
    requiredContradictions: 2,
    budgetDelta: 0,
    inspirationBase: 2,
    note: "开始把真实伤害和半真半假拆开，不能靠单一截图站队。"
  },
  {
    tier: 3,
    label: "复杂案",
    targetDifficulty: 8,
    minDifficulty: 8,
    requiredContradictions: 3,
    budgetDelta: -1,
    inspirationBase: 1,
    note: "多人、多承诺、多资源线并行，要求你把关系收益结构拆出来。"
  },
  {
    tier: 4,
    label: "季终案",
    targetDifficulty: 9,
    minDifficulty: 9,
    requiredContradictions: 4,
    budgetDelta: -1,
    inspirationBase: 1,
    note: "终局不只找坏人，还要区分诈骗、成熟度不足、现实错配和多线筛选。"
  }
];

export function storyDifficultyProfile(index) {
  return STORY_DIFFICULTY_CURVE[Math.min(index, STORY_DIFFICULTY_CURVE.length - 1)];
}

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
  return mode === "story" ? 2 : 1;
}

export function difficultyLabelForCase(brief) {
  return brief?.difficultyProfile?.label ?? ((brief?.difficulty ?? 0) >= 8 ? "高复杂度" : (brief?.difficulty ?? 0) >= 6 ? "中高复杂度" : "入门复杂度");
}
