export const QUESTION_REWIND_LIMIT = 48;

const STATIC_STATE_KEYS = new Set([
  "caseBrief",
  "caseBriefs",
  "playerName",
  "saveSlot",
  "settings"
]);

export function pushQuestionRewindPoint(history = [], state = {}, limit = QUESTION_REWIND_LIMIT) {
  const safeHistory = Array.isArray(history) ? history : [];
  const safeLimit = Math.max(1, Number(limit) || QUESTION_REWIND_LIMIT);
  return [...safeHistory, gameplaySnapshot(state)].slice(-safeLimit);
}

export function popQuestionRewindPoint(history = [], currentState = {}) {
  const safeHistory = Array.isArray(history) ? history : [];
  if (!safeHistory.length) return { history: [], state: null };
  const snapshot = safeHistory[safeHistory.length - 1];
  const nextHistory = safeHistory.slice(0, -1);
  const restored = {
    ...currentState,
    ...structuredClone(snapshot),
    caseBriefs: currentState.caseBriefs,
    playerName: currentState.playerName,
    saveSlot: currentState.saveSlot,
    settings: currentState.settings
  };
  restored.caseBrief = restored.caseBriefs?.[Math.max(0, Number(restored.chapter ?? 1) - 1)]
    ?? currentState.caseBrief
    ?? null;
  return { history: nextHistory, state: restored };
}

export function canRewindQuestion(history = []) {
  return Array.isArray(history) && history.length > 0;
}

function gameplaySnapshot(state = {}) {
  return structuredClone(Object.fromEntries(
    Object.entries(state ?? {}).filter(([key]) => !STATIC_STATE_KEYS.has(key))
  ));
}
