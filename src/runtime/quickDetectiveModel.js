export function initialQuickDetectiveState(packet = {}) {
  return {
    caseId: packet.id ?? "",
    scene: "intro",
    turnIndex: 0,
    attemptedQuoteIds: [],
    playerFoundFlawIds: [],
    crowdFoundFlawIds: [],
    crowdQueue: [],
    selectedQuoteId: null
  };
}

export function normalizeQuickDetectiveState(value, packet = {}) {
  const base = initialQuickDetectiveState(packet);
  if (!value || value.caseId !== packet.id) return base;
  const optionIds = new Set((packet.quoteOptions ?? []).map((option) => option.id));
  const flawIds = new Set((packet.quoteOptions ?? []).filter((option) => option.kind === "flaw").map((option) => option.flawId));
  const scenes = new Set(["intro", "transcript", "investigation", "feedback", "crowdAssist", "crowdFeedback", "verdict"]);
  return {
    ...base,
    ...value,
    scene: scenes.has(value.scene) ? value.scene : "intro",
    turnIndex: Math.max(0, Math.min(Math.max(0, (packet.turns?.length ?? 1) - 1), Number(value.turnIndex ?? 0))),
    attemptedQuoteIds: uniqueKnown(value.attemptedQuoteIds, optionIds),
    playerFoundFlawIds: uniqueKnown(value.playerFoundFlawIds, flawIds),
    crowdFoundFlawIds: uniqueKnown(value.crowdFoundFlawIds, flawIds),
    crowdQueue: uniqueKnown(value.crowdQueue, flawIds),
    selectedQuoteId: optionIds.has(value.selectedQuoteId) ? value.selectedQuoteId : null
  };
}

export function quickDetectiveProgress(packet = {}, state = {}) {
  const flawIds = (packet.quoteOptions ?? []).filter((option) => option.kind === "flaw").map((option) => option.flawId);
  const playerFound = uniqueKnown(state.playerFoundFlawIds, new Set(flawIds));
  const crowdFound = uniqueKnown(state.crowdFoundFlawIds, new Set(flawIds)).filter((id) => !playerFound.includes(id));
  const foundIds = [...playerFound, ...crowdFound];
  const attemptsUsed = uniqueKnown(state.attemptedQuoteIds, new Set((packet.quoteOptions ?? []).map((option) => option.id))).length;
  const markLimit = Math.max(1, Number(packet.playerMarkLimit ?? 1));
  return {
    attemptsUsed,
    marksLeft: Math.max(0, markLimit - attemptsUsed),
    markLimit,
    playerFound,
    crowdFound,
    foundIds,
    remainingFlawIds: flawIds.filter((id) => !foundIds.includes(id)),
    transcriptComplete: Number(state.turnIndex ?? 0) >= Math.max(0, (packet.turns?.length ?? 1) - 1),
    readyForCrowd: attemptsUsed >= markLimit,
    solved: foundIds.length >= flawIds.length
  };
}

export function advanceQuickTranscript(packet = {}, state = {}) {
  const lastIndex = Math.max(0, (packet.turns?.length ?? 1) - 1);
  const turnIndex = Math.min(lastIndex, Number(state.turnIndex ?? 0) + 1);
  return {
    ...state,
    turnIndex,
    scene: Number(state.turnIndex ?? 0) >= lastIndex ? "investigation" : "transcript"
  };
}

export function applyQuickQuoteSelection(packet = {}, state = {}, quoteId = "") {
  const progress = quickDetectiveProgress(packet, state);
  const option = quickQuoteOption(packet, quoteId);
  if (!option || progress.readyForCrowd || state.attemptedQuoteIds?.includes(quoteId)) return state;
  return {
    ...state,
    scene: "feedback",
    selectedQuoteId: quoteId,
    attemptedQuoteIds: [...(state.attemptedQuoteIds ?? []), quoteId],
    playerFoundFlawIds: option.kind === "flaw" && !state.playerFoundFlawIds?.includes(option.flawId)
      ? [...(state.playerFoundFlawIds ?? []), option.flawId]
      : [...(state.playerFoundFlawIds ?? [])]
  };
}

export function continueQuickInvestigation(packet = {}, state = {}) {
  const progress = quickDetectiveProgress(packet, state);
  return {
    ...state,
    selectedQuoteId: null,
    scene: progress.readyForCrowd ? "crowdAssist" : "investigation",
    crowdQueue: progress.readyForCrowd && !(state.crowdQueue ?? []).length
      ? [...progress.remainingFlawIds]
      : [...(state.crowdQueue ?? [])]
  };
}

export function revealNextCrowdFlaw(packet = {}, state = {}) {
  const progress = quickDetectiveProgress(packet, state);
  const queue = (state.crowdQueue ?? []).length ? [...state.crowdQueue] : [...progress.remainingFlawIds];
  const flawId = queue.shift();
  if (!flawId) return { ...state, scene: "verdict", selectedQuoteId: null, crowdQueue: [] };
  const option = (packet.quoteOptions ?? []).find((item) => item.flawId === flawId);
  return {
    ...state,
    scene: "crowdFeedback",
    selectedQuoteId: option?.id ?? null,
    crowdFoundFlawIds: state.crowdFoundFlawIds?.includes(flawId)
      ? [...(state.crowdFoundFlawIds ?? [])]
      : [...(state.crowdFoundFlawIds ?? []), flawId],
    crowdQueue: queue
  };
}

export function continueQuickCrowd(packet = {}, state = {}) {
  const progress = quickDetectiveProgress(packet, state);
  return {
    ...state,
    selectedQuoteId: null,
    scene: progress.solved || !(state.crowdQueue ?? []).length ? "verdict" : "crowdAssist"
  };
}

export function quickQuoteOption(packet = {}, quoteId = "") {
  return (packet.quoteOptions ?? []).find((option) => option.id === quoteId) ?? null;
}

export function quickTurnById(packet = {}, turnId = "") {
  return (packet.turns ?? []).find((turn) => turn.id === turnId) ?? null;
}

function uniqueKnown(values, allowed) {
  return [...new Set(Array.isArray(values) ? values : [])].filter((value) => allowed.has(value));
}
