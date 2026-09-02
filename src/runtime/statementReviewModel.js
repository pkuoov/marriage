import { splitDialogueSentences } from "./dialoguePresentation.js";

export const DEFAULT_STATEMENT_PATIENCE = 3;

export function statementLinesFromText(value = "", { prefix = "statement" } = {}) {
  return splitDialogueSentences(value).map((text, index) => ({
    id: `${prefix}:${index}`,
    text,
    sourceId: prefix,
    sentenceIndex: index
  }));
}

export function statementLinesFromTurns(packet = {}, round = {}) {
  const turnById = new Map((packet.turns ?? []).map((turn) => [turn.id, turn]));
  return (round.turnIds ?? []).flatMap((turnId) => {
    const turn = turnById.get(turnId);
    const text = statementTurnText(turn);
    if (!text) return [];
    return statementLinesFromText(text, { prefix: turnId });
  });
}

export function statementTextFromTurns(packet = {}, round = {}) {
  const turnById = new Map((packet.turns ?? []).map((turn) => [turn.id, turn]));
  return (round.turnIds ?? [])
    .map((turnId) => statementTurnText(turnById.get(turnId)))
    .filter(Boolean)
    .join("\n\n");
}

function statementTurnText(turn = {}) {
  return String(turn?.source ?? turn?.caller ?? "").trim();
}

export function statementOptionForLine(options = [], line = {}) {
  return statementOptionsForLine(options, line)[0] ?? null;
}

export function statementOptionsForLine(options = [], line = {}) {
  const text = String(line?.text ?? "");
  return (options ?? [])
    .map((option, index) => ({ option, index, anchor: String(option?.sourceAnchor ?? "").trim() }))
    .filter(({ anchor }) => anchor && text.includes(anchor))
    .sort((left, right) => right.anchor.length - left.anchor.length || left.index - right.index)
    .map(({ option }) => option);
}

export function normalizeStatementReaction(value = null, { role = "caller", text = "" } = {}) {
  const source = typeof value === "string"
    ? { role, text: value }
    : value && typeof value === "object" && !Array.isArray(value)
      ? value
      : {};
  const safeRole = ["caller", "host", "comment"].includes(source.role) ? source.role : role;
  return {
    role: safeRole,
    speaker: String(source.speaker ?? "").trim(),
    text: String(source.text ?? text).trim()
  };
}

export function statementMissReactionForOption(option = {}) {
  return normalizeStatementReaction(option.missReaction);
}

export function statementNoClueReactionFor(source = {}) {
  return normalizeStatementReaction(source.noClueReaction, {
    role: "caller",
    text: "这句我现在接不上。你先把刚才那段听完。"
  });
}

export function statementReactionDisplayText(reaction = {}) {
  const safe = normalizeStatementReaction(reaction);
  if (!safe.text) return "";
  const label = safe.speaker || {
    caller: "咨询者",
    host: "林旭阳",
    comment: "弹幕"
  }[safe.role] || "现场";
  return `${label}：${safe.text}`;
}

export function statementLineForId(lines = [], lineId = "") {
  return (lines ?? []).find((line) => line.id === lineId) ?? null;
}

export function normalizeStatementPatience(value = null, max = null) {
  const safeMax = Math.max(1, Number(max ?? value?.max) || DEFAULT_STATEMENT_PATIENCE);
  const remaining = value && Number.isFinite(Number(value.remaining))
    ? Math.max(0, Math.min(safeMax, Number(value.remaining)))
    : safeMax;
  return {
    max: safeMax,
    remaining,
    used: Math.max(0, safeMax - remaining)
  };
}

export function spendStatementPatience(value = null, max = DEFAULT_STATEMENT_PATIENCE) {
  const current = normalizeStatementPatience(value, max);
  const remaining = Math.max(0, current.remaining - 1);
  return {
    max: current.max,
    remaining,
    used: current.max - remaining
  };
}

export function resetStatementPatience(max = DEFAULT_STATEMENT_PATIENCE) {
  return normalizeStatementPatience(null, max);
}

export function statementPressureFor(value = null, { mode = "listen", max = value?.max ?? DEFAULT_STATEMENT_PATIENCE } = {}) {
  const budget = normalizeStatementPatience(value, max);
  const ratio = budget.remaining / Math.max(1, budget.max);
  const level = ratio <= 0.25 ? "low" : ratio <= 0.55 ? "mid" : "high";
  const exhausted = budget.remaining <= 0;
  const patienceLabel = exhausted
    ? "直播间失去耐心"
    : level === "low"
      ? "快见底"
      : level === "mid"
        ? "还能继续"
        : "耐心充足";
  return {
    ...budget,
    ratio,
    level,
    mode,
    quietUntilEmpty: true,
    patienceLabel,
    crowd: exhausted ? "散了" : ""
  };
}

export function sceneUsesLineReplay(scene = {}) {
  return scene.interactionMode === "lineReplay";
}

export function statementStagesForBrief(brief = {}) {
  const scenes = brief.sceneVersions ?? [];
  const configured = Array.isArray(brief.statementStages) ? brief.statementStages : [];
  const stages = configured.map((stage, stageIndex) => {
    const sceneIndexes = [...new Set((stage.sceneIndexes ?? [])
      .map(Number)
      .filter((index) => Number.isInteger(index) && index >= 0 && sceneUsesLineReplay(scenes[index])))]
      .sort((left, right) => left - right);
    if (!sceneIndexes.length) return null;
    return {
      ...stage,
      id: String(stage.id ?? `statement-stage-${stageIndex + 1}`),
      sceneIndexes,
      startIndex: sceneIndexes[0],
      endIndex: sceneIndexes[sceneIndexes.length - 1],
      minimumReviewCount: Math.max(2, Number(stage.minimumReviewCount) || sceneIndexes.length)
    };
  }).filter(Boolean);
  if (stages.length) return stages;

  const structure = brief.nightStructure ?? {};
  const playable = [
    ...(structure.segment1SceneIndexes ?? []),
    ...(structure.segment2SceneIndexes ?? [])
  ];
  const indexes = (playable.length ? playable : scenes.map((_, index) => index))
    .map(Number)
    .filter((index) => Number.isInteger(index) && index >= 0 && sceneUsesLineReplay(scenes[index]));
  return [...new Set(indexes)].map((sceneIndex, stageIndex) => ({
    id: `statement-stage-${stageIndex + 1}`,
    sceneIndexes: [sceneIndex],
    startIndex: sceneIndex,
    endIndex: sceneIndex,
    minimumReviewCount: 2
  }));
}

export function statementStageForScene(brief = {}, sceneIndex = 0) {
  return statementStagesForBrief(brief)
    .find((stage) => stage.sceneIndexes.includes(Number(sceneIndex))) ?? null;
}

export function statementStageProgress({
  brief = {},
  stage = null,
  actionDone = () => false,
  dialoguePicksForScene = () => []
} = {}) {
  const current = stage ?? null;
  if (!current) {
    return {
      started: false,
      complete: false,
      keyReviewCount: 0,
      dialogueReviewCount: 0,
      reviewCount: 0,
      minimumReviewCount: 0,
      unresolvedSceneIndexes: []
    };
  }
  const keyReviewCount = current.sceneIndexes
    .filter((sceneIndex) => actionDone(`version:${sceneIndex}`)).length;
  const dialogueReviewCount = current.sceneIndexes
    .reduce((total, sceneIndex) => total + (dialoguePicksForScene(sceneIndex) ?? []).length, 0);
  const reviewCount = keyReviewCount + dialogueReviewCount;
  const minimumReviewCount = Math.max(2, Number(current.minimumReviewCount) || current.sceneIndexes.length);
  const unresolvedSceneIndexes = current.sceneIndexes
    .filter((sceneIndex) => !actionDone(`version:${sceneIndex}`));
  return {
    started: reviewCount > 0,
    complete: unresolvedSceneIndexes.length === 0 && reviewCount >= minimumReviewCount,
    keyReviewCount,
    dialogueReviewCount,
    reviewCount,
    minimumReviewCount,
    unresolvedSceneIndexes
  };
}

export function statementNightKey(brief = {}, sceneIndex = 0) {
  const structure = brief.nightStructure ?? {};
  if ((structure.segment1SceneIndexes ?? []).includes(sceneIndex)) return "night-a";
  if ((structure.segment2SceneIndexes ?? []).includes(sceneIndex)) return "night-b";
  return "night";
}

export function statementNightPatienceMax(brief = {}, nightKey = "night") {
  const configured = brief.statementPatience ?? {};
  const direct = configured[nightKey] ?? configured.default;
  if (Number.isFinite(Number(direct))) return Math.max(1, Number(direct));
  const structure = brief.nightStructure ?? {};
  const sceneCount = nightKey === "night-a"
    ? (structure.segment1SceneIndexes ?? []).length
    : nightKey === "night-b"
      ? (structure.segment2SceneIndexes ?? []).length
      : (brief.sceneVersions ?? []).length;
  return Math.max(DEFAULT_STATEMENT_PATIENCE, sceneCount + 1);
}
