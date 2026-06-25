import { platformRuntime } from "./platformRuntime.js?v=0.19.36";
import { normalizeCaseMode, validCaseBriefCount } from "./caseModes.js?v=0.19.36";

export const STORAGE_KEY = "marriage-detective-agency-save-v1";
export const META_STORAGE_KEY = "marriage-detective-agency-meta-v1";
export const MAX_META_BONUS = 24;
export const PUBLIC_PLAYER_GENDER = "male";

export const CHARACTER_ART = {
  meng: "./assets/generated/characters/meng_host_v2.png?v=0.19.36",
  zhou: "./assets/generated/characters/zhou_neutral.png?v=0.19.36",
  lin: "./assets/generated/characters/lin_neutral.png?v=0.19.36",
  xu: "./assets/generated/characters/xu_neutral.png?v=0.19.36",
  chen: "./assets/generated/characters/chen_neutral.png?v=0.19.36",
  shen: "./assets/generated/characters/shen_neutral.png?v=0.19.36",
  he: "./assets/generated/characters/he_neutral.png?v=0.19.36"
};

export const baseState = {
  screen: "title",
  saveSlot: "slot1",
  settings: {
    textSpeed: "normal",
    contentWarningAccepted: false
  },
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
  caseMode: "daily",
  gender: PUBLIC_PLAYER_GENDER,
  specialty: null,
  attrs: { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 },
  profileDone: false,
  selectedFirstDates: [],
  primaryNpcId: null,
  secondaryNpcId: null,
  caseBudgets: {},
  caseActionLog: {},
  inspirationUsage: {},
  evidenceInsights: {},
  selectedEvidenceCard: {},
  lastReaction: null,
  chapter: 1,
  scene: "intro",
  flags: {
    boundary: 0,
    reality: 0,
    riskTolerance: 0,
    parentDependency: 0,
    agencyControl: 0,
    trust: 0,
    suspicion: 0,
    clientTrust: 0,
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

export function activeSaveSlot() {
  return "slot1";
}

export function loadState() {
  try {
    const raw = platformRuntime.storage.get(STORAGE_KEY);
    return raw ? migrateState({ ...JSON.parse(raw), saveSlot: activeSaveSlot() }) : null;
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
  if (typeof next.flags.clientTrust !== "number" && typeof saved.flags?.affection === "number") {
    next.flags.clientTrust = saved.flags.affection;
  }
  delete next.flags.affection;
  delete next.flags.romance;
  if (!("lastReaction" in next)) next.lastReaction = null;
  if (!("playerRole" in next)) next.playerRole = "host-lawyer";
  next.saveSlot = activeSaveSlot();
  next.settings = { ...baseState.settings, ...(next.settings ?? {}) };
  if (!("specialty" in next)) next.specialty = null;
  if (!("caseBrief" in next)) next.caseBrief = null;
  if (!Array.isArray(next.caseBriefs)) next.caseBriefs = [];
  if (!next.caseBudgets || Array.isArray(next.caseBudgets)) next.caseBudgets = {};
  if (!next.caseActionLog || Array.isArray(next.caseActionLog)) next.caseActionLog = {};
  if (!next.inspirationUsage || Array.isArray(next.inspirationUsage)) next.inspirationUsage = {};
  if (!next.evidenceInsights || Array.isArray(next.evidenceInsights)) next.evidenceInsights = {};
  if (!next.selectedEvidenceCard || Array.isArray(next.selectedEvidenceCard)) next.selectedEvidenceCard = {};
  if (!next.interrogationNotes || Array.isArray(next.interrogationNotes)) next.interrogationNotes = {};
  if (!next.contradictionLog || Array.isArray(next.contradictionLog)) next.contradictionLog = {};
  if (!Array.isArray(next.solvedCaseIds)) next.solvedCaseIds = [];
  if (!Array.isArray(next.accusationHistory)) next.accusationHistory = [];
  if (typeof next.agencyReputation !== "number") next.agencyReputation = 0;
  if (typeof next.publicHeat !== "number") next.publicHeat = 0;
  if (!next.caseInterludes || Array.isArray(next.caseInterludes)) next.caseInterludes = {};
  if (!Array.isArray(next.caseThread)) next.caseThread = [];
  if (typeof next.investigationComplete !== "boolean") next.investigationComplete = false;
  next.caseMode = normalizeCaseMode(next.caseMode);
  if (next.profileDone && next.playerRole === "host-lawyer" && !validCaseBriefCount(next.caseBriefs.length)) {
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
    const raw = platformRuntime.storage.get(META_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { runs: 0, bonusPoints: 0, history: [] };
  } catch {
    return { runs: 0, bonusPoints: 0, history: [] };
  }
}

export function saveStateSnapshot(state) {
  platformRuntime.storage.set(STORAGE_KEY, JSON.stringify({ ...state, saveSlot: activeSaveSlot() }));
}

export function saveMetaSnapshot(meta) {
  platformRuntime.storage.set(META_STORAGE_KEY, JSON.stringify(meta));
}

export function clearStateSnapshot() {
  platformRuntime.storage.remove(STORAGE_KEY);
}
