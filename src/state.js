import { normalizeCaseMode, validCaseBriefCount } from "./caseModes.js";
import { activeSaveSlot, saveStore } from "./platform/saveStore.js";
import { routeAxisForChoice } from "./runtime/routeLog.js";
import { DEFAULT_PLAYER_NAME, normalizePlayerName } from "./playerIdentity.js";

export const STORAGE_KEY = "livestream-detective-save-v1";
export const META_STORAGE_KEY = "livestream-detective-meta-v1";
const LEGACY_STORAGE_KEY = "marriage-detective-agency-save-v1";
const LEGACY_META_STORAGE_KEY = "marriage-detective-agency-meta-v1";
const LEGACY_INTERLUDE_INVENTORY = Object.freeze({
  "work-frame-zhao": "approval-page-reviewed",
  "work-frame-zhou": "approval-page-reviewed",
  "work-frame-lin": "approval-page-reviewed",
  "delegation-return": "approval-page-reviewed"
});
const LEGACY_INTERLUDE_ACTIONS = Object.freeze({
  "send-appraisal": "recheck-approval-page",
  "zhao-zhou-work": "recheck-approval-page"
});
const LEGACY_CALLBACK_ITEMS = Object.freeze({
  "赵律师边界框架": "立项页不是报销单",
  "周会计钱路框架": "立项页不是报销单",
  "扛活还是扛钱": "立项页不是报销单",
  "顾问回单": "立项页不是报销单",
  "审批页缺口": "立项页不是报销单"
});
const RETIRED_INTERLUDE_CHOICES = new Set(["work-frame-zhao", "work-frame-zhou", "work-frame-lin"]);
const RETIRED_DELEGATION_MATERIALS = new Set(["profile-mba-gap", "work-approval-missing"]);
const RUNTIME_TOP_LEVEL_SCREENS = new Set(["chapter", "quickDetectiveSelect", "quickDetective"]);

export const CHARACTER_ART = {
  meng: "./assets/generated/characters/meng_host_v2.png",
  zhou: "./assets/generated/characters/zhou_neutral.png",
  lin: "./assets/generated/characters/lin_neutral.png",
  xu: "./assets/generated/characters/xu_neutral.png",
  chen: "./assets/generated/characters/chen_neutral.png",
  shen: "./assets/generated/characters/shen_neutral.png",
  he: "./assets/generated/characters/he_neutral.png"
};

export const baseState = {
  screen: "title",
  saveSlot: "slot1",
  saveLoadError: null,
  playerName: DEFAULT_PLAYER_NAME,
  settings: {
    textSpeed: "normal",
    autoMode: false,
    autoDelay: 2,
    fastForward: false,
    contentWarningAccepted: false
  },
  caseMode: "episode",
  quickDetective: null,
  quickDetectiveCompletedIds: [],
  chapter: 1,
  scene: "caseOpen",
  attrs: { wealth: 4, family: 4, looks: 4, education: 4, eq: 4 },
  caseBrief: null,
  caseBriefs: [],
  dialogueProgress: {},
  dialogueBacklog: [],
  sceneAnswers: {},
  sceneQuestionPicks: {},
  sceneDialoguePicks: {},
  statementReviewAttempts: {},
  statementPatience: {},
  activeStatementLineId: null,
  helperHintPicks: {},
  sceneQuestionFocus: null,
  evidenceCheckPicks: {},
  investigationPicks: {},
  delegationPicks: {},
  stanceSnapshots: {},
  liveCounterPicks: {},
  activeLiveCounterBeatId: null,
  truthBoundaryPicks: {},
  truthBoundaryMisses: {},
  materialPityLog: {},
  routeChoiceLog: {},
  caseBudgets: {},
  caseNights: {},
  caseOvernights: {},
  caseActionLog: {},
  contradictionLog: {},
  accusationHistory: [],
  solvedCaseIds: [],
  caseInterludes: {},
  storyWorldEchoes: {},
  careChoices: {},
  epilogueUnreadStep: 0,
  lastReaction: null,
  lastPressureSignal: null,
  lastPressureAxis: null,
  lastPityLine: null,
  patienceLostContext: null,
  recapStep: 0
};

export function loadState() {
  const saveSlot = activeSaveSlot();
  try {
    const raw = saveStore.read(STORAGE_KEY, [LEGACY_STORAGE_KEY]);
    return parseStateSnapshot(raw, saveSlot);
  } catch {
    return damagedSaveState(saveSlot);
  }
}

export function parseStateSnapshot(raw, saveSlot = "slot1") {
  if (!raw) return null;
  try {
    return normalizeRuntimeState({ ...JSON.parse(raw), saveSlot });
  } catch {
    return damagedSaveState(saveSlot);
  }
}

function damagedSaveState(saveSlot = "slot1") {
  return {
    ...structuredClone(baseState),
    saveSlot,
    screen: "title",
    saveLoadError: "corrupt-save"
  };
}

export function normalizeRuntimeState(saved = {}) {
  const next = migrateState(saved ?? {});
  const chapter = Number(next.chapter);
  next.screen = RUNTIME_TOP_LEVEL_SCREENS.has(next.screen) ? next.screen : "title";
  next.chapter = Number.isInteger(chapter) && chapter > 0 ? chapter : 1;
  next.attrs = { ...baseState.attrs, ...(next.attrs ?? {}) };
  next.caseBriefs = Array.isArray(next.caseBriefs) ? next.caseBriefs : [];
  next.caseBrief = next.caseBrief ?? next.caseBriefs[next.chapter - 1] ?? null;
  return next;
}

export function migrateState(saved) {
  const next = {
    ...structuredClone(baseState),
    ...saved,
    attrs: { ...baseState.attrs, ...(saved.attrs ?? {}) }
  };
  next.saveSlot = activeSaveSlot();
  next.saveLoadError = typeof next.saveLoadError === "string" && next.saveLoadError ? next.saveLoadError : null;
  next.playerName = normalizePlayerName(next.playerName);
  next.settings = { ...baseState.settings, ...(next.settings ?? {}) };
  if (!Array.isArray(next.dialogueBacklog)) next.dialogueBacklog = [];
  if (!("caseBrief" in next)) next.caseBrief = null;
  if (!Array.isArray(next.caseBriefs)) next.caseBriefs = [];
  next.caseBriefs = next.caseBriefs.map(migrateCaseBrief);
  next.caseBrief = next.caseBrief ? migrateCaseBrief(next.caseBrief) : next.caseBriefs[next.chapter - 1] ?? null;
  if (!next.dialogueProgress || Array.isArray(next.dialogueProgress)) next.dialogueProgress = {};
  if (!next.sceneAnswers || Array.isArray(next.sceneAnswers)) next.sceneAnswers = {};
  if (!next.sceneQuestionPicks || Array.isArray(next.sceneQuestionPicks)) next.sceneQuestionPicks = {};
  if (!next.sceneDialoguePicks || Array.isArray(next.sceneDialoguePicks)) next.sceneDialoguePicks = {};
  if (!next.statementReviewAttempts || Array.isArray(next.statementReviewAttempts)) next.statementReviewAttempts = {};
  if (!next.statementPatience || Array.isArray(next.statementPatience)) next.statementPatience = {};
  if (!("activeStatementLineId" in next)) next.activeStatementLineId = null;
  if (!next.helperHintPicks || Array.isArray(next.helperHintPicks)) next.helperHintPicks = {};
  if (!next.sceneQuestionFocus || typeof next.sceneQuestionFocus !== "object" || Array.isArray(next.sceneQuestionFocus)) next.sceneQuestionFocus = null;
  if (!next.evidenceCheckPicks || Array.isArray(next.evidenceCheckPicks)) next.evidenceCheckPicks = {};
  if (!next.investigationPicks || Array.isArray(next.investigationPicks)) next.investigationPicks = {};
  if (!next.delegationPicks || Array.isArray(next.delegationPicks)) next.delegationPicks = {};
  if (!next.stanceSnapshots || Array.isArray(next.stanceSnapshots)) next.stanceSnapshots = {};
  if (!next.liveCounterPicks || Array.isArray(next.liveCounterPicks)) next.liveCounterPicks = {};
  if (!("activeLiveCounterBeatId" in next)) next.activeLiveCounterBeatId = null;
  if (!next.truthBoundaryPicks || Array.isArray(next.truthBoundaryPicks)) next.truthBoundaryPicks = {};
  if (!next.truthBoundaryMisses || Array.isArray(next.truthBoundaryMisses)) next.truthBoundaryMisses = {};
  if (!next.materialPityLog || Array.isArray(next.materialPityLog)) next.materialPityLog = {};
  if (!next.routeChoiceLog || Array.isArray(next.routeChoiceLog)) next.routeChoiceLog = {};
  if (!next.caseBudgets || Array.isArray(next.caseBudgets)) next.caseBudgets = {};
  if (!next.caseNights || Array.isArray(next.caseNights)) next.caseNights = {};
  if (!next.caseOvernights || Array.isArray(next.caseOvernights)) next.caseOvernights = {};
  if (!next.caseActionLog || Array.isArray(next.caseActionLog)) next.caseActionLog = {};
  if (!next.contradictionLog || Array.isArray(next.contradictionLog)) next.contradictionLog = {};
  if (!Array.isArray(next.solvedCaseIds)) next.solvedCaseIds = [];
  if (!Array.isArray(next.accusationHistory)) next.accusationHistory = [];
  if (!next.caseInterludes || Array.isArray(next.caseInterludes)) next.caseInterludes = {};
  if (!next.storyWorldEchoes || Array.isArray(next.storyWorldEchoes)) next.storyWorldEchoes = {};
  if (!next.careChoices || Array.isArray(next.careChoices)) next.careChoices = {};
  if (!Number.isFinite(Number(next.epilogueUnreadStep))) next.epilogueUnreadStep = 0;
  if (!("lastReaction" in next)) next.lastReaction = null;
  if (!("lastPressureSignal" in next)) next.lastPressureSignal = null;
  if (!("lastPityLine" in next)) next.lastPityLine = null;
  if (!("patienceLostContext" in next)) next.patienceLostContext = null;
  if (!("lastPressureAxis" in next)) next.lastPressureAxis = null;
  next.sceneQuestionPicks = migrateChoiceRecord(next.sceneQuestionPicks);
  next.sceneDialoguePicks = migrateChoiceListRecord(next.sceneDialoguePicks);
  next.evidenceCheckPicks = migrateChoiceRecord(next.evidenceCheckPicks);
  next.investigationPicks = migrateChoiceRecord(next.investigationPicks);
  next.routeChoiceLog = migrateChoiceListRecord(next.routeChoiceLog);
  next.caseNights = migrateCaseNightRecord(next.caseNights);
  next.caseOvernights = migrateCaseOvernightRecord(next.caseOvernights);
  next.caseActionLog = migrateCaseActionLog(next.caseActionLog);
  next.delegationPicks = removeRetiredDelegationPicks(next.delegationPicks);
  if (Array.isArray(next.earnedItems)) next.earnedItems = migrateIdList(next.earnedItems, LEGACY_CALLBACK_ITEMS);
  next.caseMode = normalizeCaseMode(next.caseMode);
  if (!next.quickDetective || typeof next.quickDetective !== "object" || Array.isArray(next.quickDetective)) next.quickDetective = null;
  if (!Array.isArray(next.quickDetectiveCompletedIds)) next.quickDetectiveCompletedIds = [];
  next.quickDetectiveCompletedIds = [...new Set(next.quickDetectiveCompletedIds.filter((caseId) => typeof caseId === "string" && caseId))];
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
  const rawMode = String(brief.caseMode ?? "");
  const mode = rawMode ? normalizeCaseMode(rawMode) : "";
  const isDailyLike =
    mode === "daily" ||
    mode === "episode" ||
    brief.dailyCase === true ||
    brief.storyPackCase === true ||
    brief.weeklyCase === true ||
    String(brief.id ?? "").startsWith("daily-") ||
    String(brief.id ?? "").startsWith("episode-") ||
    String(brief.id ?? "").startsWith("weekly-");
  if (!isDailyLike) return brief;
  const openingDialogue = migrateOpeningDialogue(brief);
  return {
    ...brief,
    ...(brief.storyPackCase === undefined && brief.weeklyCase === true ? { storyPackCase: true } : {}),
    ...(brief.storyKey === undefined && brief.weeklyKey !== undefined ? { storyKey: brief.weeklyKey } : {}),
    ...(brief.storyThemeId === undefined && brief.weeklyThemeId !== undefined ? { storyThemeId: brief.weeklyThemeId } : {}),
    ...(brief.storyThemeTitle === undefined && brief.weeklyThemeTitle !== undefined ? { storyThemeTitle: brief.weeklyThemeTitle } : {}),
    ...(brief.storyThemeIntro === undefined && brief.weeklyThemeIntro !== undefined ? { storyThemeIntro: brief.weeklyThemeIntro } : {}),
    ...(brief.storyThemeThesis === undefined && brief.weeklyThemeThesis !== undefined ? { storyThemeThesis: brief.weeklyThemeThesis } : {}),
    ...(brief.storyThemeCommentPrompt === undefined && brief.weeklyThemeCommentPrompt !== undefined ? { storyThemeCommentPrompt: brief.weeklyThemeCommentPrompt } : {}),
    ...(brief.storyHiddenThread === undefined && brief.weeklyHiddenThread !== undefined ? { storyHiddenThread: brief.weeklyHiddenThread } : {}),
    ...(brief.storyAct === undefined && brief.weeklyAct !== undefined ? { storyAct: brief.weeklyAct } : {}),
    ...(brief.storyObjectLabel === undefined && brief.weeklyObjectLabel !== undefined ? { storyObjectLabel: brief.weeklyObjectLabel } : {}),
    ...(brief.storyEpisodeTitle === undefined && brief.weeklyEpisodeTitle !== undefined ? { storyEpisodeTitle: brief.weeklyEpisodeTitle } : {}),
    ...(brief.storyCaseLabel === undefined && brief.weeklyCaseLabel !== undefined ? { storyCaseLabel: brief.weeklyCaseLabel } : {}),
    openingDialogue,
    sceneVersions: migrateSceneRouteAxes(brief),
    deepFollowup: migrateDeepFollowup(brief),
    dailyCase: true,
    modeLabel: brief.storyPackCase || brief.weeklyCase || mode === "episode" ? "试玩连线" : brief.modeLabel === "今日连线" ? "今日来电" : brief.modeLabel ?? "今日来电",
    storyArcTitle: String(brief.storyArcTitle ?? "").startsWith("今日连线")
      ? String(brief.storyArcTitle).replace("今日连线", "今日来电")
      : brief.storyArcTitle
  };
}

function migrateOpeningDialogue(brief) {
  const lines = Array.isArray(brief.openingDialogue) ? brief.openingDialogue : [];
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
      const routeAxis = routeAxisForChoice(migrated, scene);
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
  { from: "你是不是也怕自己显得太现实？", to: "你一直说要看账单，那句不好说出口的话是什么？" },
  { from: "那你为什么一直绕着说要看账单？", to: "你一直说要看账单，那句不好说出口的话是什么？" },
  { from: "她说不用你家出大头，是不是也算退让？", to: "她说不用你家出大头，你当时为什么还是不踏实？" },
  { from: "你当时为什么没有把关系问死？", to: "话当时没说死，你当时怎么回他的？" },
  { from: "关系一直没说死，你当时怎么接的？", to: "话当时没说死，你当时怎么回他的？" },
  { from: "你当时帮他，是因为喜欢他还是想帮事业？", to: "他让你帮店里这些事时，你当时怎么理解你们的关系？" },
  { from: "他让你帮店里这些事时，你有没有觉得已经算自己人了？", to: "他让你帮店里这些事时，你当时怎么理解你们的关系？" },
  { from: "你当时有没有觉得问太细了？", to: "问到流水的时候，你有没有拦过？" },
  { from: "你是不是也不想让家里觉得你判断错了？", to: "后来这件事，你跟家里改过口吗？" },
  { from: "你后来为什么没有跟家里改口？", to: "后来这件事，你跟家里改过口吗？" },
  { from: "你当时是不是也想在老板面前表现？", to: "他说署名写你负责的时候，你当时怎么想的？" },
  { from: "他说主责署名的时候，你为什么先答应垫？", to: "他说署名写你负责的时候，你当时怎么想的？" },
  { from: "你拿到主责署名后，有没有觉得这事也算值？", to: "活动总结写了你负责以后，你最怕别人怎么说？" },
  { from: "主责写了你以后，你为什么反而更慌？", to: "活动总结写了你负责以后，你最怕别人怎么说？" }
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

function migrateCaseNightRecord(record) {
  return Object.fromEntries(Object.entries(record ?? {}).map(([key, night]) => {
    if (!night || typeof night !== "object" || Array.isArray(night)) return [key, night];
    const actionsDone = migrateIdList(night.interludeActionsDone, LEGACY_INTERLUDE_ACTIONS);
    const activeActionId = LEGACY_INTERLUDE_ACTIONS[night.activeActionId] ?? night.activeActionId ?? null;
    const actionChoices = Object.fromEntries(Object.entries(night.interludeActionChoices ?? {})
      .filter(([actionId]) => !LEGACY_INTERLUDE_ACTIONS[actionId]));
    return [key, {
      ...night,
      activeActionId: actionsDone.includes(activeActionId) ? null : activeActionId,
      inventory: migrateIdList(night.inventory, LEGACY_INTERLUDE_INVENTORY),
      interludeActionsDone: actionsDone,
      interludeChoicesDone: (night.interludeChoicesDone ?? []).filter((choiceId) => !RETIRED_INTERLUDE_CHOICES.has(choiceId)),
      interludeActionChoices: actionChoices
    }];
  }));
}

function migrateCaseOvernightRecord(record) {
  return Object.fromEntries(Object.entries(record ?? {}).map(([key, overnight]) => {
    if (!overnight || typeof overnight !== "object" || Array.isArray(overnight)) return [key, overnight];
    return [key, {
      ...overnight,
      earnedItems: migrateIdList(overnight.earnedItems, LEGACY_CALLBACK_ITEMS),
      callbackOpenerId: LEGACY_CALLBACK_ITEMS[overnight.callbackOpenerId] ?? overnight.callbackOpenerId ?? null
    }];
  }));
}

function migrateCaseActionLog(record) {
  const actionMigrations = {
    "interlude:send-appraisal": "interlude:recheck-approval-page",
    "interlude:zhao-zhou-work": "interlude:recheck-approval-page"
  };
  return Object.fromEntries(Object.entries(record ?? {}).map(([key, actions]) => {
    if (!actions || typeof actions !== "object" || Array.isArray(actions)) return [key, actions];
    const migrated = { ...actions };
    Object.entries(actionMigrations).forEach(([legacyId, currentId]) => {
      if (legacyId in migrated) migrated[currentId] = migrated[currentId] ?? migrated[legacyId];
      delete migrated[legacyId];
    });
    return [key, migrated];
  }));
}

function removeRetiredDelegationPicks(record) {
  return Object.fromEntries(Object.entries(record ?? {}).filter(([, pick]) =>
    !RETIRED_DELEGATION_MATERIALS.has(pick?.material?.id)
  ));
}

function migrateIdList(items, migrations) {
  if (!Array.isArray(items)) return [];
  return [...new Set(items.map((item) => migrations[item] ?? item).filter(Boolean))];
}

function migrateDeepFollowup(brief) {
  if (!brief.deepFollowup) return brief.deepFollowup;
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
