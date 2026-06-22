export const STORAGE_KEY = "marriage-detective-agency-save-v1";
export const META_STORAGE_KEY = "marriage-detective-agency-meta-v1";
const PITFALL_STORAGE_KEY = "marriage-pitfall-guide-save-v1";
const PITFALL_META_STORAGE_KEY = "marriage-pitfall-guide-meta-v1";
const LEGACY_STORAGE_KEY = "chinese-marriage-ten-year-dream-save-v1";
const LEGACY_META_STORAGE_KEY = "chinese-marriage-ten-year-dream-meta-v1";
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
  playerRole: "host-lawyer",
  caseBrief: null,
  caseBriefs: [],
  interrogationNotes: {},
  contradictionLog: {},
  solvedCaseIds: [],
  accusationHistory: [],
  agencyReputation: 0,
  publicHeat: 0,
  caseInterludes: {},
  caseThread: [],
  investigationComplete: false,
  caseArchive: [],
  candidateAccess: {},
  caseMode: "story",
  gender: PUBLIC_PLAYER_GENDER,
  specialty: null,
  attrs: { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 },
  profileDone: false,
  npcSeeds: {},
  packaging: null,
  questionnaire: {},
  selectedFirstDates: [],
  primaryNpcId: null,
  secondaryNpcId: null,
  caseDeck: {},
  caseBudgets: {},
  caseActionLog: {},
  inspirationUsage: {},
  evidenceInsights: {},
  selectedEvidenceCard: {},
  confessionMarks: {},
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
    educationPressure: 0,
    macroEconomyPressure: 0,
    stockMarketHeat: 0,
    investmentExposure: 0,
    scamExposure: 0,
    exReentryRisk: 0,
    careDeficit: 0,
    emotionalValueDemand: 0,
    infidelityRisk: 0,
    evidenceClarity: 0,
    audiencePressure: 0,
    clientCredibility: 0,
    falseAccusationRisk: 0
  },
  log: [],
  runSettled: false
};

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(PITFALL_STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
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
  if (!("playerRole" in next)) next.playerRole = "host-lawyer";
  if (!("specialty" in next)) next.specialty = null;
  if (!("caseBrief" in next)) next.caseBrief = null;
  if (!Array.isArray(next.caseBriefs)) next.caseBriefs = [];
  if (!next.caseBudgets || Array.isArray(next.caseBudgets)) next.caseBudgets = {};
  if (!next.caseActionLog || Array.isArray(next.caseActionLog)) next.caseActionLog = {};
  if (!next.inspirationUsage || Array.isArray(next.inspirationUsage)) next.inspirationUsage = {};
  if (!next.evidenceInsights || Array.isArray(next.evidenceInsights)) next.evidenceInsights = {};
  if (!next.selectedEvidenceCard || Array.isArray(next.selectedEvidenceCard)) next.selectedEvidenceCard = {};
  if (!next.confessionMarks || Array.isArray(next.confessionMarks)) next.confessionMarks = {};
  if (!next.interrogationNotes || Array.isArray(next.interrogationNotes)) next.interrogationNotes = {};
  if (!next.contradictionLog || Array.isArray(next.contradictionLog)) next.contradictionLog = {};
  if (!Array.isArray(next.solvedCaseIds)) next.solvedCaseIds = [];
  if (!Array.isArray(next.accusationHistory)) next.accusationHistory = [];
  if (typeof next.agencyReputation !== "number") next.agencyReputation = 0;
  if (typeof next.publicHeat !== "number") next.publicHeat = 0;
  if (!next.caseInterludes || Array.isArray(next.caseInterludes)) next.caseInterludes = {};
  if (!Array.isArray(next.caseThread)) next.caseThread = [];
  if (typeof next.investigationComplete !== "boolean") next.investigationComplete = false;
  if (!Array.isArray(next.caseArchive)) next.caseArchive = [];
  if (!next.candidateAccess || Array.isArray(next.candidateAccess)) next.candidateAccess = {};
  if (!["story", "anchor"].includes(next.caseMode)) next.caseMode = "story";
  if (next.profileDone && next.playerRole === "host-lawyer" && ![3, 4, 5, 6, 13].includes(next.caseBriefs.length)) {
    next.profileDone = false;
    next.screen = "title";
    next.caseBrief = null;
    next.caseBriefs = [];
    next.scene = "intro";
  }
  if (typeof next.runSettled !== "boolean") next.runSettled = false;
  return next;
}

export function loadMeta() {
  try {
    const raw = localStorage.getItem(META_STORAGE_KEY) ?? localStorage.getItem(PITFALL_META_STORAGE_KEY) ?? localStorage.getItem(LEGACY_META_STORAGE_KEY);
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
  localStorage.removeItem(PITFALL_STORAGE_KEY);
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}
