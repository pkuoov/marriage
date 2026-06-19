export const STORAGE_KEY = "chinese-marriage-ten-year-dream-save-v1";
export const META_STORAGE_KEY = "chinese-marriage-ten-year-dream-meta-v1";
export const BASE_POINTS = 25;
export const MAX_META_BONUS = 24;
export const PUBLIC_PLAYER_GENDER = "male";

export const CHARACTER_ART = {
  meng: "./assets/generated/characters/meng_neutral.png?v=0.14.0",
  zhou: "./assets/generated/characters/zhou_neutral.png?v=0.14.0",
  lin: "./assets/generated/characters/lin_neutral.png?v=0.14.0",
  xu: "./assets/generated/characters/xu_neutral.png?v=0.14.0",
  chen: "./assets/generated/characters/chen_neutral.png?v=0.14.0",
  shen: "./assets/generated/characters/shen_neutral.png?v=0.14.0",
  he: "./assets/generated/characters/he_neutral.png?v=0.14.0"
};

export const baseState = {
  screen: "title",
  gender: PUBLIC_PLAYER_GENDER,
  startMode: "agency",
  attrs: { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 },
  profileDone: false,
  npcSeeds: {},
  packaging: null,
  questionnaire: {},
  selectedFirstDates: [],
  primaryNpcId: null,
  secondaryNpcId: null,
  caseDeck: {},
  appliedCaseEvents: [],
  secondaryPressureChapters: [],
  secondaryMessageHandled: false,
  terminatedNpcIds: [],
  routeSwitches: 0,
  lastRouteLesson: null,
  lastStopLossReason: null,
  lastReaction: null,
  chapterVariants: {},
  insightHintSeen: false,
  seenDangerSignals: [],
  vagueSignalSeen: false,
  lastBurstEvent: null,
  interruptEvent: null,
  chapter: 1,
  scene: "intro",
  flags: {
    boundary: 0,
    romance: 0,
    reality: 0,
    riskTolerance: 0,
    parentDependency: 0,
    agencyControl: 0,
    trust: 0,
    suspicion: 0,
    affection: 0,
    assetProtection: 0,
    parentConflict: 0,
    partnerParentApproval: 0,
    ownParentApproval: 0,
    siblingPressure: 0,
    phoenixAmbition: 0,
    povertyStress: 0,
    giftPressure: 0,
    communicationFriction: 0,
    timeConflict: 0,
    exBoundary: 0,
    intimacyBoundary: 0,
    publicPressure: 0,
    emotionalLabor: 0,
    weddingPressure: 0,
    householdPressure: 0,
    debtPressure: 0,
    childPressure: 0,
    midlifePressure: 0,
    educationPressure: 0
  },
  log: [],
  runSettled: false
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? migrateState(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function migrateState(saved) {
  const next = {
    ...structuredClone(baseState),
    ...saved,
    attrs: { ...baseState.attrs, ...(saved.attrs ?? {}) },
    flags: { ...baseState.flags, ...(saved.flags ?? {}) }
  };
  if (!next.caseDeck) next.caseDeck = {};
  if (!next.appliedCaseEvents) next.appliedCaseEvents = [];
  if (!next.secondaryPressureChapters) next.secondaryPressureChapters = [];
  if (typeof next.secondaryMessageHandled !== "boolean") next.secondaryMessageHandled = false;
  if (!next.terminatedNpcIds) next.terminatedNpcIds = [];
  if (typeof next.routeSwitches !== "number") next.routeSwitches = 0;
  if (!("lastRouteLesson" in next)) next.lastRouteLesson = null;
  if (!("lastStopLossReason" in next)) next.lastStopLossReason = null;
  if (!("lastReaction" in next)) next.lastReaction = null;
  if (!next.chapterVariants) next.chapterVariants = {};
  if (typeof next.insightHintSeen !== "boolean") next.insightHintSeen = false;
  if (!Array.isArray(next.seenDangerSignals)) next.seenDangerSignals = [];
  if (typeof next.vagueSignalSeen !== "boolean") next.vagueSignalSeen = false;
  if (!("lastBurstEvent" in next)) next.lastBurstEvent = null;
  if (!("interruptEvent" in next)) next.interruptEvent = null;
  if (typeof next.runSettled !== "boolean") next.runSettled = false;
  return next;
}

export function loadMeta() {
  try {
    const raw = localStorage.getItem(META_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { runs: 0, bonusPoints: 0, history: [] };
  } catch {
    return { runs: 0, bonusPoints: 0, history: [] };
  }
}

export function saveStateSnapshot(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function saveMetaSnapshot(meta) {
  localStorage.setItem(META_STORAGE_KEY, JSON.stringify(meta));
}

export function clearStateSnapshot() {
  localStorage.removeItem(STORAGE_KEY);
}
