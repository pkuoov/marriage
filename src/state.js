import { normalizeCaseMode, validCaseBriefCount } from "./caseModes.js?v=0.20.55";
import { activeSaveSlot, saveStore } from "./platform/saveStore.js?v=0.20.55";

export const STORAGE_KEY = "livestream-detective-save-v1";
export const META_STORAGE_KEY = "livestream-detective-meta-v1";
const LEGACY_STORAGE_KEY = "marriage-detective-agency-save-v1";
const LEGACY_META_STORAGE_KEY = "marriage-detective-agency-meta-v1";

export const CHARACTER_ART = {
  meng: "./assets/generated/characters/meng_host_v2.png?v=0.20.55",
  zhou: "./assets/generated/characters/zhou_neutral.png?v=0.20.55",
  lin: "./assets/generated/characters/lin_neutral.png?v=0.20.55",
  xu: "./assets/generated/characters/xu_neutral.png?v=0.20.55",
  chen: "./assets/generated/characters/chen_neutral.png?v=0.20.55",
  shen: "./assets/generated/characters/shen_neutral.png?v=0.20.55",
  he: "./assets/generated/characters/he_neutral.png?v=0.20.55"
};

export const baseState = {
  screen: "title",
  saveSlot: "slot1",
  settings: {
    textSpeed: "normal",
    contentWarningAccepted: false
  },
  caseMode: "episode",
  chapter: 1,
  scene: "caseOpen",
  attrs: { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 },
  caseBrief: null,
  caseBriefs: [],
  dialogueProgress: {},
  sceneAnswers: {},
  sceneQuestionPicks: {},
  sceneDialoguePicks: {},
  evidenceCheckPicks: {},
  investigationPicks: {},
  truthBoundaryPicks: {},
  truthBoundaryMisses: {},
  routeChoiceLog: {},
  caseBudgets: {},
  caseActionLog: {},
  contradictionLog: {},
  accusationHistory: [],
  solvedCaseIds: [],
  caseInterludes: {},
  lastReaction: null,
  recapStep: 0
};

export function loadState() {
  try {
    const raw = saveStore.read(STORAGE_KEY, [LEGACY_STORAGE_KEY]);
    return raw ? migrateState({ ...JSON.parse(raw), saveSlot: activeSaveSlot() }) : null;
  } catch {
    return null;
  }
}

export function migrateState(saved) {
  const next = {
    ...structuredClone(baseState),
    ...saved,
    attrs: { ...baseState.attrs, ...(saved.attrs ?? {}) }
  };
  next.saveSlot = activeSaveSlot();
  next.settings = { ...baseState.settings, ...(next.settings ?? {}) };
  if (!("caseBrief" in next)) next.caseBrief = null;
  if (!Array.isArray(next.caseBriefs)) next.caseBriefs = [];
  next.caseBriefs = next.caseBriefs.map(migrateCaseBrief);
  next.caseBrief = next.caseBrief ? migrateCaseBrief(next.caseBrief) : next.caseBriefs[next.chapter - 1] ?? null;
  if (!next.dialogueProgress || Array.isArray(next.dialogueProgress)) next.dialogueProgress = {};
  if (!next.sceneAnswers || Array.isArray(next.sceneAnswers)) next.sceneAnswers = {};
  if (!next.sceneQuestionPicks || Array.isArray(next.sceneQuestionPicks)) next.sceneQuestionPicks = {};
  if (!next.sceneDialoguePicks || Array.isArray(next.sceneDialoguePicks)) next.sceneDialoguePicks = {};
  if (!next.evidenceCheckPicks || Array.isArray(next.evidenceCheckPicks)) next.evidenceCheckPicks = {};
  if (!next.investigationPicks || Array.isArray(next.investigationPicks)) next.investigationPicks = {};
  if (!next.truthBoundaryPicks || Array.isArray(next.truthBoundaryPicks)) next.truthBoundaryPicks = {};
  if (!next.truthBoundaryMisses || Array.isArray(next.truthBoundaryMisses)) next.truthBoundaryMisses = {};
  if (!next.routeChoiceLog || Array.isArray(next.routeChoiceLog)) next.routeChoiceLog = {};
  if (!next.caseBudgets || Array.isArray(next.caseBudgets)) next.caseBudgets = {};
  if (!next.caseActionLog || Array.isArray(next.caseActionLog)) next.caseActionLog = {};
  if (!next.contradictionLog || Array.isArray(next.contradictionLog)) next.contradictionLog = {};
  if (!Array.isArray(next.solvedCaseIds)) next.solvedCaseIds = [];
  if (!Array.isArray(next.accusationHistory)) next.accusationHistory = [];
  if (!next.caseInterludes || Array.isArray(next.caseInterludes)) next.caseInterludes = {};
  if (!("lastReaction" in next)) next.lastReaction = null;
  next.sceneQuestionPicks = migrateChoiceRecord(next.sceneQuestionPicks);
  next.sceneDialoguePicks = migrateChoiceListRecord(next.sceneDialoguePicks);
  next.evidenceCheckPicks = migrateChoiceRecord(next.evidenceCheckPicks);
  next.investigationPicks = migrateChoiceRecord(next.investigationPicks);
  next.routeChoiceLog = migrateChoiceListRecord(next.routeChoiceLog);
  next.caseMode = normalizeCaseMode(next.caseMode);
  if (next.caseBriefs.length && !validCaseBriefCount(next.caseBriefs.length, next.caseMode)) {
    next.screen = "title";
    next.caseBrief = null;
    next.caseBriefs = [];
    next.scene = "caseOpen";
  }
  return next;
}

function migrateCaseBrief(brief) {
  if (!brief || typeof brief !== "object") return brief;
  const daily = brief.dailyCase || brief.storyPackCase || brief.weeklyCase || brief.dailyKey || brief.storyKey || brief.weeklyKey || brief.caseMode === "daily" || brief.caseMode === "episode" || brief.caseMode === "weekly" || String(brief.id ?? "").startsWith("daily-") || String(brief.id ?? "").startsWith("episode-") || String(brief.id ?? "").startsWith("weekly-");
  if (!daily) return brief;
  const openingDialogue = migrateOpeningDialogue(brief);
  return {
    ...brief,
    openingDialogue,
    sceneVersions: migrateSceneRouteAxes(brief),
    deepFollowup: migrateDeepFollowup(brief),
    dailyCase: true,
    modeLabel: brief.storyPackCase || brief.weeklyCase || brief.caseMode === "episode" || brief.caseMode === "weekly" ? "试玩连线" : brief.modeLabel === "今日连线" ? "今日来电" : brief.modeLabel ?? "今日来电",
    storyArcTitle: String(brief.storyArcTitle ?? "").startsWith("今日连线")
      ? String(brief.storyArcTitle).replace("今日连线", "今日来电")
      : brief.storyArcTitle
  };
}

function migrateOpeningDialogue(brief) {
  const lines = Array.isArray(brief.openingDialogue) ? brief.openingDialogue : [];
  if (brief.plotId !== "education-income-fake-profile") return lines;
  return lines.filter((line) => {
    const text = String(line?.text ?? "");
    if (text === "她问细到哪一步了？") return false;
    if (text.startsWith("学校、工作、收入、有没有存款，后来还绕到流水。")) return false;
    return true;
  });
}

function migrateSceneRouteAxes(brief) {
  const scenes = brief.sceneVersions;
  if (!Array.isArray(scenes)) return scenes;
  return scenes.map((scene) => ({
    ...scene,
    questionOptions: (scene.questionOptions ?? []).map((option) => {
      const migrated = migrateQuestionOptionCopy(option);
      const routeAxis = migratedRouteAxisForQuestion(migrated?.question ?? "", brief.plotId);
      return routeAxis ? { ...migrated, routeAxis } : migrated;
    })
  }));
}

const QUESTION_COPY_MIGRATIONS = [
  {
    from: "你当时是不是先心疼他了？",
    to: "你当时有没有起疑心？",
    fromAnswer: "是。我第一反应是他是不是压力太大，想先把人稳住。可后来再看，失业到底从什么时候开始，他一直没讲。",
    toAnswer: "一开始没有。我第一反应是他是不是压力太大，想先把人稳住。可后来再看，失业到底从什么时候开始，他一直没讲。"
  },
  { from: "你是不是也怕自己显得太现实？", to: "那你为什么一直绕着说要看账单？" },
  { from: "她说不用你家出大头，是不是也算退让？", to: "她说不用你家出大头，你当时为什么还是不踏实？" },
  { from: "你当时为什么没有把关系问死？", to: "话当时没说死，你当时怎么回他的？" },
  { from: "关系一直没说死，你当时怎么接的？", to: "话当时没说死，你当时怎么回他的？" },
  { from: "你当时帮他，是因为喜欢他还是想帮事业？", to: "他让你帮店里这些事时，你当时怎么理解你们的关系？" },
  { from: "他让你帮店里这些事时，你有没有觉得已经算自己人了？", to: "他让你帮店里这些事时，你当时怎么理解你们的关系？" },
  { from: "你当时有没有觉得问太细了？", to: "问到流水的时候，你有没有拦过？" },
  { from: "你是不是也不想让家里觉得你判断错了？", to: "你后来为什么没有跟家里改口？" },
  { from: "你当时是不是也想在老板面前表现？", to: "他说主责署名的时候，你为什么先答应垫？" },
  { from: "你拿到主责署名后，有没有觉得这事也算值？", to: "主责写了你以后，你为什么反而更慌？" }
];

function migrateQuestionOptionCopy(option) {
  if (!option || typeof option !== "object") return option;
  const migration = QUESTION_COPY_MIGRATIONS.find((item) => item.from === option.question);
  if (!migration) return option;
  const next = { ...option, question: migration.to };
  if (migration.toAnswer && (!next.answer || next.answer === migration.fromAnswer)) {
    next.answer = migration.toAnswer;
  }
  return next;
}

function migrateChoiceRecord(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return {};
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, migrateQuestionOptionCopy(value)])
  );
}

function migrateChoiceListRecord(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return {};
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.map(migrateQuestionOptionCopy) : value
    ])
  );
}

function migratedRouteAxisForQuestion(question, plotId) {
  const text = String(question ?? "");
  if (!text) return "";
  if (/你当时|你自己|你妈|你是不是|你有没有|起疑|绕着|不踏实|怎么接|怎么回|怎么理解|自己人|拦过|改口|为什么先答应|更慌/.test(text)) return "caller-credibility";
  if (/好看的版本|名校|MBA|本科|学历|署名|主责|老板/.test(text)) return "identity-wording";
  if (/大群|预算|流程|供应商|对接人|入口|越级/.test(text)) return "process-control";
  if (/截图|付款状态|收款账户|少了哪|哪一边/.test(text)) return "document-edge";
  if (plotId === "workplace-reimbursement-screenshot" && /垫钱/.test(text)) return "identity-wording";
  return "";
}

function migrateDeepFollowup(brief) {
  if (brief.plotId !== "education-income-fake-profile" || !brief.deepFollowup) return brief.deepFollowup;
  if (brief.deepFollowup.note !== "这句不是替谁开脱，是把她自己最在意的钱也问出来。") return brief.deepFollowup;
  return {
    ...brief.deepFollowup,
    note: "问到这里，资料真假还在桌上，她自己最在意的钱也上桌了。"
  };
}

export function loadMeta() {
  try {
    const raw = saveStore.read(META_STORAGE_KEY, [LEGACY_META_STORAGE_KEY]);
    return raw ? JSON.parse(raw) : { runs: 0, bonusPoints: 0, history: [] };
  } catch {
    return { runs: 0, bonusPoints: 0, history: [] };
  }
}

export function saveStateSnapshot(state) {
  saveStore.write(STORAGE_KEY, JSON.stringify({ ...state, saveSlot: activeSaveSlot() }));
}

export function saveMetaSnapshot(meta) {
  saveStore.write(META_STORAGE_KEY, JSON.stringify(meta));
}

export function clearStateSnapshot() {
  saveStore.removeMany([STORAGE_KEY, LEGACY_STORAGE_KEY]);
}
