import {
  DEFAULT_STATEMENT_PATIENCE,
  normalizeStatementPatience,
  resetStatementPatience,
  spendStatementPatience,
  statementLineForId,
  statementLinesFromTurns,
  statementMissReactionForOption,
  statementNoClueReactionFor,
  statementOptionForLine
} from "./statementReviewModel.js";

const QUICK_SCENES = new Set(["intro", "transcript", "issueSelection", "missReaction", "confrontation", "patienceLost", "verdict"]);
const LEGACY_REVIEW_SCENES = new Set(["investigation", "feedback", "crowdAssist", "crowdFeedback"]);

export function initialQuickDetectiveState(packet = {}) {
  return {
    flowVersion: quickFlowVersion(packet),
    caseId: packet.id ?? "",
    scene: "intro",
    roundIndex: 0,
    turnIndex: 0,
    turnLineIndex: 0,
    activeConfrontationId: null,
    activeIssueId: null,
    activeSourceLineId: null,
    activeMissReaction: null,
    activeMissQuestion: "",
    missPhase: "response",
    missPenaltyPending: false,
    afterMissScene: "issueSelection",
    resolvedConfrontationIds: [],
    attemptedIssueIds: [],
    attemptedLineIds: [],
    roundPatience: {},
    confrontationLineIndex: 0,
    verdictMode: "complete",
    verdictIndex: 0,
    verdictLineIndex: 0
  };
}

export function normalizeQuickDetectiveState(value, packet = {}) {
  const base = initialQuickDetectiveState(packet);
  if (!value || value.caseId !== packet.id) return base;
  if (value.flowVersion !== base.flowVersion && !quickFlowStructureMatches(value.flowVersion, base.flowVersion)) {
    const savedParts = String(value.flowVersion ?? "").split("|");
    const savedRounds = savedParts.slice(savedParts[0] === "quick-v6" ? 2 : 1, -1);
    const savedRoundId = savedRounds[Number(value.roundIndex ?? 0)]?.split(":")[0];
    const rounds = quickDisclosureRounds(packet);
    const nextRoundIndex = rounds.findIndex(round => round.id === savedRoundId || round.previousRoundIds?.includes(savedRoundId));
    if (nextRoundIndex < 0) return base;
    const earlierIds = new Set(rounds.slice(0, nextRoundIndex).flatMap(round => quickRequiredConfrontationIds(packet, round)));
    const ending = value.scene === "verdict";
    value = { ...value, flowVersion: base.flowVersion,
      roundIndex: nextRoundIndex, scene: ending ? "verdict" : "transcript",
      turnIndex: quickTurnIndexesForRound(packet, rounds[nextRoundIndex])[0] ?? 0, turnLineIndex: 0,
      activeConfrontationId: null, activeIssueId: null, activeSourceLineId: null,
      activeMissReaction: null, missPenaltyPending: false, confrontationLineIndex: 0,
      attemptedIssueIds: [], attemptedLineIds: [], verdictIndex: 0, verdictLineIndex: 0,
      resolvedConfrontationIds: ending ? value.resolvedConfrontationIds : (value.resolvedConfrontationIds ?? []).filter(id => earlierIds.has(id))
    };
  }
  const requestedScene = LEGACY_REVIEW_SCENES.has(value.scene) || (value.scene === "confrontation" && !value.activeConfrontationId)
    ? "issueSelection"
    : value.scene;
  const confrontationIds = new Set((packet.confrontations ?? []).map((item) => item.id));
  const issueIds = new Set((packet.issueOptions ?? []).map((item) => item.id));
  const activeConfrontation = (packet.confrontations ?? []).find((item) => item.id === value.activeConfrontationId);
  const roundIndex = boundedIndex(value.roundIndex, quickDisclosureRounds(packet).length);
  const normalized = {
    ...base,
    flowVersion: base.flowVersion,
    scene: QUICK_SCENES.has(requestedScene) ? requestedScene : "intro",
    roundIndex,
    turnIndex: boundedIndex(value.turnIndex, packet.turns?.length),
    turnLineIndex: boundedLineIndex(value.turnLineIndex, 2),
    activeConfrontationId: confrontationIds.has(value.activeConfrontationId) ? value.activeConfrontationId : null,
    activeIssueId: issueIds.has(value.activeIssueId) ? value.activeIssueId : null,
    activeSourceLineId: typeof value.activeSourceLineId === "string" ? value.activeSourceLineId : null,
    activeMissReaction: value.activeMissReaction && typeof value.activeMissReaction === "object"
      ? value.activeMissReaction
      : null,
    afterMissScene: value.afterMissScene === "patienceLost" ? "patienceLost" : "issueSelection",
    activeMissQuestion: String(value.activeMissQuestion ?? ""),
    missPhase: value.missPhase === "question" ? "question" : "response",
    missPenaltyPending: value.scene === "missReaction" && value.missPenaltyPending === true,
    resolvedConfrontationIds: uniqueKnown(value.resolvedConfrontationIds, confrontationIds),
    attemptedIssueIds: uniqueKnown(value.attemptedIssueIds, issueIds),
    attemptedLineIds: uniqueStrings(value.attemptedLineIds),
    roundPatience: normalizeQuickRoundPatience(value.roundPatience, packet),
    confrontationLineIndex: boundedLineIndex(value.confrontationLineIndex, quickConfrontationLinesForState(packet, value).length),
    verdictMode: value.verdictMode === "partial" ? "partial" : "complete",
    verdictIndex: boundedIndex(value.verdictIndex, quickVerdictPages(packet, value).length),
    verdictLineIndex: boundedLineIndex(
      value.verdictLineIndex,
      quickVerdictPages(packet, value)[boundedIndex(value.verdictIndex, quickVerdictPages(packet, value).length)]?.lines?.length
    )
  };
  if (packet.focusedInquiry && normalized.scene === "patienceLost") return retryQuickStatement(packet, normalized);
  return resumeSolvedQuickRound(packet, normalized);
}

export function advanceQuickTranscript(packet = {}, state = {}) {
  return resumeSolvedQuickRound(packet, { ...state, scene: "issueSelection", activeSourceLineId: null });
}

export function applyQuickStatementLineSelection(packet = {}, state = {}, lineId = "") {
  const round = quickDisclosureRoundForState(packet, state);
  const lines = quickStatementLinesForRound(packet, state);
  const line = statementLineForId(lines, lineId);
  if (!line) return state;
  const issue = statementOptionForLine(quickIssueOptionsForRound(packet, state), line, { allLines: lines });
  if (!issue?.confrontationId && state.attemptedLineIds?.includes(lineId)) return state;
  const attemptedLineIds = [...new Set([...(state.attemptedLineIds ?? []), lineId])];
  if (!issue?.confrontationId) {
    return {
      ...state,
      scene: "missReaction",
      attemptedLineIds,
      attemptedIssueIds: issue?.id
        ? [...new Set([...(state.attemptedIssueIds ?? []), issue.id])]
        : [...(state.attemptedIssueIds ?? [])],
      activeSourceLineId: lineId,
      activeIssueId: issue?.id ?? null,
      activeMissQuestion: issue?.question ?? (packet.format === "solo-commentary" ? "这一句还能推出什么？" : "刚才这一句，能再说具体一点吗？"),
      missPhase: "question",
      missPenaltyPending: true,
      activeMissReaction: issue
        ? statementMissReactionForOption(issue)
        : statementNoClueReactionFor(round),
      afterMissScene: "issueSelection"
    };
  }
  const next = applyQuickIssueSelection(packet, state, issue.id);
  return {
    ...next,
    attemptedLineIds,
    activeSourceLineId: lineId
  };
}

export function advanceQuickMissReaction(packet = {}, state = {}) {
  if (state.scene !== "missReaction") return state;
  if (state.missPhase === "question") return { ...state, missPhase: "response" };
  const round = quickDisclosureRoundForState(packet, state);
  const roundId = round.id ?? `round-${Number(state.roundIndex ?? 0)}`;
  const budget = state.missPenaltyPending && !packet.focusedInquiry
    ? spendStatementPatience(state.roundPatience?.[roundId], quickRoundPatienceMax(round))
    : quickRoundPatienceForState(packet, state);
  return resumeSolvedQuickRound(packet, {
    ...state,
    scene: budget.remaining <= 0 && !packet.focusedInquiry ? "patienceLost" : "issueSelection",
    activeMissReaction: null,
    activeMissQuestion: "",
    missPhase: "response",
    missPenaltyPending: false,
    roundPatience: { ...(state.roundPatience ?? {}), [roundId]: budget },
    afterMissScene: "issueSelection"
  });
}

export function applyQuickIssueSelection(packet = {}, state = {}, issueId = "") {
  const issue = quickIssueOptionsForRound(packet, state).find((item) => item.id === issueId);
  if (!issue) return state;
  // A decoy only needs one response. A valid direction must remain recoverable if
  // a save was restored after the attempt was recorded but before the
  // confrontation finished.
  if (state.attemptedIssueIds?.includes(issueId) && !issue.confrontationId) return state;
  const attemptedIssueIds = [...new Set([...(state.attemptedIssueIds ?? []), issueId])];
  const resolved = new Set(state.resolvedConfrontationIds ?? []);
  const confrontation = (packet.confrontations ?? []).find((item) => item.id === issue.confrontationId);
  if (!confrontation && packet.focusedInquiry) return {
    ...state, scene: "missReaction", attemptedIssueIds, activeIssueId: issue.id,
    activeMissQuestion: issue.question ?? issue.label, activeMissReaction: statementMissReactionForOption(issue),
    missPhase: "question", missPenaltyPending: true, afterMissScene: "issueSelection"
  };
  if (!confrontation || resolved.has(confrontation.id)) {
    return {
      ...state,
      scene: "issueSelection",
      attemptedIssueIds
    };
  }
  return {
      ...state,
      scene: "confrontation",
    attemptedIssueIds,
      activeConfrontationId: confrontation.id,
      activeIssueId: issue.id,
      activeSourceLineId: state.activeSourceLineId ?? null,
      confrontationLineIndex: 0
  };
}

export function advanceQuickConfrontation(packet = {}, state = {}) {
  const confrontation = (packet.confrontations ?? []).find((item) => item.id === state.activeConfrontationId);
  const lines = quickConfrontationLinesForState(packet, state);
  const lineIndex = boundedLineIndex(state.confrontationLineIndex, lines.length);
  if (lineIndex < Math.max(0, lines.length - 1)) {
    return { ...state, scene: "confrontation", confrontationLineIndex: lineIndex + 1 };
  }
  const activeId = state.activeConfrontationId;
  const resolvedConfrontationIds = activeId && !state.resolvedConfrontationIds?.includes(activeId)
    ? [...(state.resolvedConfrontationIds ?? []), activeId]
    : [...(state.resolvedConfrontationIds ?? [])];
  const rounds = quickDisclosureRounds(packet);
  const roundIndex = boundedIndex(state.roundIndex, rounds.length);
  const round = rounds[roundIndex] ?? {};
  const roundRequiredIds = quickRequiredConfrontationIds(packet, round);
  const roundSolved = quickRoundIsSolved(round, roundRequiredIds, resolvedConfrontationIds);
  if (roundSolved && roundIndex < rounds.length - 1) {
    const nextRoundIndex = roundIndex + 1;
    const nextTurnIndex = quickTurnIndexesForRound(packet, rounds[nextRoundIndex])[0] ?? 0;
    return {
      ...state,
      scene: "transcript",
      roundIndex: nextRoundIndex,
      turnIndex: nextTurnIndex,
      turnLineIndex: 0,
      activeConfrontationId: null,
      activeSourceLineId: null,
      resolvedConfrontationIds,
      confrontationLineIndex: 0
    };
  }
  const solved = rounds.every((item) => quickRoundIsSolved(
    item,
    quickRequiredConfrontationIds(packet, item),
    resolvedConfrontationIds
  ));
  return solved
    ? { ...state, scene: "verdict", activeConfrontationId: null, activeSourceLineId: null, resolvedConfrontationIds, verdictIndex: 0, verdictLineIndex: 0 }
    : resumeSolvedQuickRound(packet, { ...state, scene: "issueSelection", activeConfrontationId: null, activeIssueId: null, resolvedConfrontationIds, confrontationLineIndex: 0 });
}

export function retryQuickStatement(packet = {}, state = {}) {
  const round = quickDisclosureRoundForState(packet, state);
  const roundId = round.id ?? `round-${Number(state.roundIndex ?? 0)}`;
  const lineIds = new Set(statementLinesFromTurns(packet, round).map((line) => line.id));
  return {
    ...state,
    scene: packet.focusedInquiry ? "issueSelection" : "transcript",
    activeSourceLineId: null,
    activeMissReaction: null,
    afterMissScene: "issueSelection",
    attemptedIssueIds: (state.attemptedIssueIds ?? []).filter(id => !(round.issueOptionIds ?? []).includes(id)),
    attemptedLineIds: (state.attemptedLineIds ?? []).filter((lineId) => !lineIds.has(lineId)),
    roundPatience: packet.focusedInquiry ? { ...(state.roundPatience ?? {}) } : {
      ...(state.roundPatience ?? {}),
      [roundId]: resetStatementPatience(quickRoundPatienceMax(round))
    }
  };
}

export function quickCanEndEarly(packet = {}, state = {}) {
  return (packet.confrontations ?? []).some((item) => item.kind !== "conversation"
    && (state.resolvedConfrontationIds ?? []).includes(item.id));
}

export function endQuickCaseEarly(packet = {}, state = {}) {
  if (!quickCanEndEarly(packet, state)) return state;
  return {
    ...state,
    scene: "verdict",
    verdictMode: "partial",
    activeConfrontationId: null,
    activeSourceLineId: null,
    verdictIndex: 0,
    verdictLineIndex: 0
  };
}

export function quickVerdictPages(packet = {}, state = {}) {
  if (state.verdictMode === "partial" && packet.ending?.partialSummaryPages?.length) {
    return packet.ending.partialSummaryPages;
  }
  return packet.ending?.summaryPages ?? [];
}

export function quickDisclosureRounds(packet = {}) {
  if (Array.isArray(packet.disclosureRounds) && packet.disclosureRounds.length) return packet.disclosureRounds;
  return [{
    id: "full-call",
    label: "原始连线",
    turnIds: (packet.turns ?? []).map((turn) => turn.id),
    issueOptionIds: (packet.issueOptions ?? []).map((option) => option.id),
    requiredConfrontationIds: (packet.confrontations ?? []).map((item) => item.id)
  }];
}

// Sentence wording may change while stable rounds, questions and exchanges retain
// their identity. Keep completed exchanges and clamp offsets to the current text.
function quickFlowStructureMatches(saved, current) {
  if (typeof saved !== "string" || !saved.startsWith("quick-v6|")) return false;
  const shape = (version) => version.split("|").map((part) => part.split(":@:")[0]).join("|");
  return shape(saved) === shape(current);
}

export function quickFlowVersion(packet = {}) {
  const rounds = quickDisclosureRounds(packet);
  const roundShape = rounds.map((round) => [
    round.id,
    round.completionMode ?? "all",
    ...(round.turnIds ?? []),
    "?",
    ...(round.issueOptionIds ?? []),
    "!",
    ...(round.requiredConfrontationIds ?? []),
    "@",
    ...((packet.issueOptions ?? []).filter((option) => !(round.issueOptionIds ?? []).length || round.issueOptionIds.includes(option.id)).map((option) => `${option.id}:${option.sourceAnchor ?? ""}`))
  ].join(":"));
  const confrontationShape = (packet.confrontations ?? []).map((item) => item.id).join(":");
  return `quick-v6|${packet.contentRevision ?? "legacy"}|${roundShape.join("|")}|${confrontationShape}`;
}

export function quickDisclosureRoundForState(packet = {}, state = {}) {
  const rounds = quickDisclosureRounds(packet);
  return rounds[boundedIndex(state.roundIndex, rounds.length)] ?? rounds[0] ?? {};
}

export function quickIssueOptionsForRound(packet = {}, state = {}) {
  const round = quickDisclosureRoundForState(packet, state);
  const allowedIds = new Set(round.issueOptionIds ?? []);
  return (packet.issueOptions ?? []).filter((option) => (!allowedIds.size || allowedIds.has(option.id))
    && !(round.autoConfrontationIds ?? []).includes(option.confrontationId));
}

export function quickAvailableInquiryOptions(packet = {}, state = {}) {
  const resolved = new Set(state.resolvedConfrontationIds ?? []);
  return quickIssueOptionsForRound(packet, state).filter(option => !resolved.has(option.confrontationId)
    && (option.confrontationId || !(state.attemptedIssueIds ?? []).includes(option.id)));
}

export function quickTurnIndexesForRound(packet = {}, round = {}) {
  const indexById = new Map((packet.turns ?? []).map((turn, index) => [turn.id, index]));
  const indexes = (round.turnIds ?? []).map((id) => indexById.get(id)).filter(Number.isInteger);
  return indexes.length ? indexes : (packet.turns ?? []).map((_, index) => index);
}

export function quickStatementLinesForRound(packet = {}, state = {}) {
  return statementLinesFromTurns(packet, quickDisclosureRoundForState(packet, state));
}

export function quickRoundPatienceForState(packet = {}, state = {}) {
  const round = quickDisclosureRoundForState(packet, state);
  const roundId = round.id ?? `round-${Number(state.roundIndex ?? 0)}`;
  return normalizeStatementPatience(state.roundPatience?.[roundId], quickRoundPatienceMax(round));
}

function quickRequiredConfrontationIds(packet = {}, round = {}) {
  if (Array.isArray(round.requiredConfrontationIds) && round.requiredConfrontationIds.length) {
    return round.requiredConfrontationIds;
  }
  const issueIds = new Set(round.issueOptionIds ?? []);
  return (packet.issueOptions ?? [])
    .filter((option) => (!issueIds.size || issueIds.has(option.id)) && option.confrontationId)
    .map((option) => option.confrontationId);
}

function quickRoundIsSolved(round = {}, requiredIds = [], resolvedIds = []) {
  if (!requiredIds.length) return true;
  if (round.completionMode === "any") return requiredIds.some((id) => resolvedIds.includes(id));
  return requiredIds.every((id) => resolvedIds.includes(id));
}

function resumeSolvedQuickRound(packet = {}, state = {}) {
  if (state.scene !== "issueSelection") return state;
  const rounds = quickDisclosureRounds(packet);
  const roundIndex = boundedIndex(state.roundIndex, rounds.length);
  const round = rounds[roundIndex] ?? {};
  const pendingConversationId = (round.autoConfrontationIds ?? [])
    .find((id) => !(state.resolvedConfrontationIds ?? []).includes(id)
      && (packet.confrontations ?? []).some((item) => item.id === id));
  if (pendingConversationId) return {
    ...state, scene: "confrontation", activeConfrontationId: pendingConversationId,
    activeIssueId: null, activeSourceLineId: null, confrontationLineIndex: 0
  };
  const requiredIds = quickRequiredConfrontationIds(packet, round);
  if (!quickRoundIsSolved(rounds[roundIndex] ?? {}, requiredIds, state.resolvedConfrontationIds ?? [])) return state;
  if (roundIndex < rounds.length - 1) {
    const nextRoundIndex = roundIndex + 1;
    return {
      ...state,
      scene: "transcript",
      roundIndex: nextRoundIndex,
      turnIndex: quickTurnIndexesForRound(packet, rounds[nextRoundIndex])[0] ?? 0,
      turnLineIndex: 0,
      activeConfrontationId: null,
      confrontationLineIndex: 0
    };
  }
  const allConfrontationsSolved = rounds.every((round) => quickRoundIsSolved(
    round,
    quickRequiredConfrontationIds(packet, round),
    state.resolvedConfrontationIds ?? []
  ));
  return allConfrontationsSolved
    ? { ...state, scene: "verdict", activeConfrontationId: null, verdictIndex: 0, verdictLineIndex: 0 }
    : state;
}

export function quickConfrontationLines(confrontation = {}) {
  if (Array.isArray(confrontation.lines) && confrontation.lines.length) return confrontation.lines;
  return [
    confrontation.host ? { role: "host", text: confrontation.host } : null,
    confrontation.caller ? { role: "caller", text: confrontation.caller } : null
  ].filter(Boolean);
}

// Keep the selected sentence's opening exchange with its shared follow-up.
// Older saves without an active issue retain their original line offsets.
export function quickConfrontationLinesForState(packet = {}, state = {}) {
  const confrontation = (packet.confrontations ?? []).find((item) => item.id === state.activeConfrontationId);
  const issue = (packet.issueOptions ?? []).find((item) => item.id === state.activeIssueId && item.confrontationId === state.activeConfrontationId);
  return [...(issue?.confrontationOpeningLines ?? []), ...quickConfrontationLines(confrontation)];
}

export function quickMissLine(state = {}) {
  return state.missPhase === "question"
    ? { role: "host", text: state.activeMissQuestion ?? "" }
    : state.activeMissReaction ?? {};
}

export function advanceQuickVerdict(packet = {}, state = {}) {
  const pages = quickVerdictPages(packet, state);
  const pageIndex = boundedIndex(state.verdictIndex, pages.length);
  const lineIndex = boundedLineIndex(state.verdictLineIndex, pages[pageIndex]?.lines?.length);
  const lastLineIndex = Math.max(0, (pages[pageIndex]?.lines?.length ?? 1) - 1);
  if (lineIndex < lastLineIndex) {
    return { ...state, verdictIndex: pageIndex, verdictLineIndex: lineIndex + 1 };
  }
  const lastIndex = Math.max(0, pages.length - 1);
  return {
    ...state,
    verdictIndex: Math.min(lastIndex, pageIndex + 1),
    verdictLineIndex: 0
  };
}

export function quickDetectiveIsComplete(packet = {}, state = {}) {
  if (state.scene !== "verdict") return false;
  const pages = quickVerdictPages(packet, state);
  if (!pages.length) return false;
  const lastPageIndex = pages.length - 1;
  const lastLineIndex = Math.max(0, (pages[lastPageIndex]?.lines?.length ?? 1) - 1);
  return Number(state.verdictIndex ?? 0) >= lastPageIndex && Number(state.verdictLineIndex ?? 0) >= lastLineIndex;
}

function boundedIndex(value, length) {
  return Math.max(0, Math.min(Math.max(0, Number(length ?? 1) - 1), Number(value ?? 0)));
}

function boundedLineIndex(value, length) {
  return Math.max(0, Math.min(Math.max(0, Number(length ?? 1) - 1), Number(value ?? 0)));
}

function uniqueKnown(values, allowed) {
  return [...new Set(Array.isArray(values) ? values : [])].filter((value) => allowed.has(value));
}

function uniqueStrings(values) {
  return [...new Set(Array.isArray(values) ? values : [])].filter((value) => typeof value === "string" && value);
}

function quickRoundPatienceMax(round = {}) {
  return Math.max(1, Number(round.patience ?? DEFAULT_STATEMENT_PATIENCE) || DEFAULT_STATEMENT_PATIENCE);
}

function normalizeQuickRoundPatience(value = {}, packet = {}) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return Object.fromEntries(quickDisclosureRounds(packet).map((round, index) => {
    const id = round.id ?? `round-${index}`;
    return [id, normalizeStatementPatience(source[id], quickRoundPatienceMax(round))];
  }));
}
