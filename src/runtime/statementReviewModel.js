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
    if (!turn?.caller) return [];
    return statementLinesFromText(turn.caller, { prefix: turnId });
  });
}

export function statementTextFromTurns(packet = {}, round = {}) {
  const turnById = new Map((packet.turns ?? []).map((turn) => [turn.id, turn]));
  return (round.turnIds ?? [])
    .map((turnId) => String(turnById.get(turnId)?.caller ?? "").trim())
    .filter(Boolean)
    .join("\n\n");
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
