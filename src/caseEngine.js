import { applyDifficultyProfile } from "./difficulty.js";
import { applyRuntimeCaseContent } from "./runtime/contentCase.js";
import { DEFAULT_STORY_PACK_KEY, storyPackCaseContentFor, storyPackCaseCount, storyPackForKey } from "./storyPacks.js";
import { DAILY_TEMPLATE_BUILDERS } from "./caseTemplates/index.js";
import { withChoiceRoutes } from "./caseTemplates/dailyTemplateSupport.js";

const DAILY_PLOT_DEFINITIONS = {
  "lost-job-hidden-credit": {
    taskProfile: { id: "audit", label: "钱款说不清", recommendedSpecialtyId: "audit", summary: "钱说得急，责任却还没落到人。" },
    backdropClass: "backdrop-credit",
    backdropArt: "./assets/generated/backgrounds/credit_bill_room.png",
    stance: "trueVictim",
    premeditated: true,
    premeditatedActorRole: "respondent"
  },
  "tony-multi-dating": {
    taskProfile: { id: "emotion", label: "情绪卡住了", recommendedSpecialtyId: "emotion", summary: "情绪很满，有人一直把问题推回爱不爱。" },
    backdropClass: "backdrop-tony",
    backdropArt: "./assets/generated/backgrounds/salon_counter_schedule.png",
    stance: "trueVictim",
    premeditated: true,
    premeditatedActorRole: "respondent"
  },
  "education-income-fake-profile": {
    taskProfile: { id: "verification", label: "资料有雾", recommendedSpecialtyId: "verification", summary: "标签都好看，材料却总少一块。" },
    backdropClass: "backdrop-profile",
    backdropArt: "./assets/generated/backgrounds/profile_verification_desk.png",
    stance: "halfTruth",
    premeditated: false,
    premeditatedActorRole: null
  },
  "workplace-reimbursement-screenshot": {
    taskProfile: { id: "audit", label: "款项卡住了", recommendedSpecialtyId: "audit", summary: "截图看着完整，钱却没落到该落的位置。" },
    backdropClass: "backdrop-work",
    backdropArt: "./assets/generated/backgrounds/office_finance_reimbursement.png",
    stance: "halfTruth",
    premeditated: false,
    premeditatedActorRole: null
  }
};

const DAILY_TEMPLATE_PLOT_IDS = Object.keys(DAILY_PLOT_DEFINITIONS);

function taskProfileForPlot(plotId) {
  return DAILY_PLOT_DEFINITIONS[plotId]?.taskProfile ?? DAILY_PLOT_DEFINITIONS["education-income-fake-profile"].taskProfile;
}

function actorIdForRole(role, ids) {
  if (role === "complainant") return ids.complainantId ?? null;
  if (role === "respondent") return ids.respondentId ?? null;
  return null;
}

function runtimeContentForDailyCase(options, plotId) {
  const storyKey = options.storyKey ?? options.packKey ?? DEFAULT_STORY_PACK_KEY;
  const spec = (storyPackForKey(storyKey)?.sequence ?? []).find((item) => item.plotId === plotId);
  const caseId = options.runtimeCaseId ?? spec?.caseId;
  if (!caseId) return null; // Unmigrated daily plots still have authored templates.
  const content = storyPackCaseContentFor(storyKey, caseId);
  if (!content) throw new Error(`内容包 ${storyKey} 的案件 ${caseId} 缺少可运行正文，已停止载入。`);
  return content;
}

const DAILY_ROTATION = [
  {
    plotId: "lost-job-hidden-credit",
    caseMode: "daily",
    sceneId: "rental-room",
    complainantId: "shen",
    respondentId: "xu"
  },
  {
    plotId: "tony-multi-dating",
    caseMode: "daily",
    sceneId: "late-night-chat",
    complainantId: "he",
    respondentId: "chen"
  },
  {
    plotId: "education-income-fake-profile",
    caseMode: "daily",
    sceneId: "live-call",
    complainantId: "lin",
    respondentId: "zhou"
  },
  {
    plotId: "lost-job-hidden-credit",
    caseMode: "daily",
    sceneId: "rental-room",
    complainantId: "chen",
    respondentId: "zhou"
  },
  {
    plotId: "tony-multi-dating",
    caseMode: "daily",
    sceneId: "late-night-chat",
    complainantId: "lin",
    respondentId: "shen"
  },
  {
    plotId: "education-income-fake-profile",
    caseMode: "daily",
    sceneId: "live-call",
    complainantId: "xu",
    respondentId: "chen"
  },
  {
    plotId: "workplace-reimbursement-screenshot",
    caseMode: "daily",
    sceneId: "office-chat",
    complainantId: "chen",
    respondentId: "shen"
  }
];

const DAILY_CASE_MODE = {
  id: "daily",
  label: "直播来电",
  brief: "每日只接一通来电，当事人把情况说出来。",
  stage: "liveCall",
  plotIds: DAILY_TEMPLATE_PLOT_IDS
};

export function generateDailyCaseSequence(npcs, attrs, options = {}) {
  if (options.plotId && !DAILY_TEMPLATE_PLOT_IDS.includes(options.plotId)) {
    throw new Error(`Daily case plot is not templated: ${options.plotId}`);
  }
  const dailyKey = options.dailyKey ?? dailyCaseKey(options.now);
  const dailySpec = options.plotId ? null : DAILY_ROTATION[dailyHash(dailyKey) % DAILY_ROTATION.length];
  const plotId = options.plotId ?? dailySpec?.plotId ?? DAILY_TEMPLATE_PLOT_IDS[0];
  const plot = DAILY_PLOT_DEFINITIONS[plotId];
  if (!plot) throw new Error(`Daily case plot not found: ${plotId}`);
  const complainantId = dailySpec?.complainantId ?? options.complainantId ?? npcs[0]?.id ?? null;
  const respondentId = dailySpec?.respondentId ?? options.respondentId ?? npcs.find((npc) => npc.id !== complainantId)?.id ?? null;
  const premeditatedActorId = actorIdForRole(plot.premeditatedActorRole, { complainantId, respondentId });
  const brief = {
    id: `daily-${dailyKey}-${plotId}`,
    order: 1,
    caseMode: "daily",
    stage: "liveCall",
    plotId,
    taskProfile: taskProfileForPlot(plotId),
    label: "",
    publicHook: "",
    truth: "",
    backdropClass: plot.backdropClass,
    backdropArt: plot.backdropArt ?? "",
    accusationChoices: [],
    complainantId,
    respondentId,
    dailyKey,
    dailyCase: true,
    modeLabel: "今日来电",
    storyArcTitle: "今日来电",
    storyArcSummary: "一通匿名来电，几次接话分岔，今晚就能聊完。",
    storySuspense: "今晚这路麦，第一轮说法里漏了半拍。",
    storyClueObject: "今日通话摘录",
    storyClue: "今日短案只记录关键原话和时间点，判断留给主播。",
    hiddenFacts: [],
    exaggerations: [],
    evidence: [],
    evidenceCards: [],
    sceneVersions: [],
    difficulty: 4,
    stance: plot.stance ?? "halfTruth",
    premeditated: plot.premeditated ?? false,
    premeditatedActorId
  };
  const names = {
    complainantName: npcs.find((npc) => npc.id === brief.complainantId)?.name ?? "咨询者",
    respondentName: npcs.find((npc) => npc.id === brief.respondentId)?.name ?? "对方"
  };
  const runtimeContent = options.skipRuntimeContent
    ? null
    : runtimeContentForDailyCase(options, plotId);
  const runtimeBrief = runtimeContent
    ? applyRuntimeContentForBrief(brief, runtimeContent, { speakerId: complainantId })
    : applyDailyCaseTemplate({ ...brief }, names);
  return [applyDifficultyProfile(runtimeBrief, {
    tier: 1,
    label: "快玩短案",
    targetDifficulty: Math.max(4, brief.difficulty ?? 4),
    minDifficulty: 4,
    requiredContradictions: 2,
    budgetDelta: 1,
    inspirationBase: 2,
    note: "手机端短案只要求先抓住两处矛盾，结果卡再引导好友挑战。"
  })];
}

export function generateStoryPackSequence(npcs, attrs, options = {}) {
  const storyKey = options.storyKey ?? options.packKey ?? options.weeklyKey ?? DEFAULT_STORY_PACK_KEY;
  const storyPack = storyPackForKey(storyKey);
  const theme = storyPack.theme;
  const comments = storyPack.comments ?? {};
  const pickedSpecs = storyPack.sequence.slice(0, storyPackCaseCount(storyPack));
  return pickedSpecs.map((spec, index) => {
    const brief = generateDailyCaseSequence(npcs, attrs, {
      ...options,
      dailyKey: `${storyKey}-${index + 1}`,
      plotId: spec.plotId,
      runtimeCaseId: spec.caseId,
      complainantId: spec.complainantId,
      respondentId: spec.respondentId
    })[0];
    const episodeBrief = {
      ...brief,
      id: `episode-${storyKey}-${index + 1}-${brief.plotId}`,
      order: index + 1,
      caseMode: "episode",
      storyPackCase: true,
      storyKey,
      storyThemeId: theme.id,
      storyThemeTitle: theme.title,
      storyThemeIntro: theme.intro,
      storyThemeThesis: theme.thesis,
      storyThemeCommentPrompt: theme.commentPrompt,
      storyHiddenThread: theme.hiddenThread,
      storyCommentSeeds: comments.commentSeeds ?? [],
      storyLowRevealTone: comments.lowRevealTone ?? "",
      storyHighRevealTone: comments.highRevealTone ?? "",
      storyAct: spec.act,
      storyObjectLabel: spec.objectLabel,
      backdropClass: spec.backdropClass ?? brief.backdropClass,
      backdropArt: spec.backdropArt ?? brief.backdropArt ?? "",
      callerArt: spec.callerArt ?? brief.callerArt,
      callerArtStyle: spec.callerArtStyle ?? brief.callerArtStyle ?? "",
      callerArtVariants: spec.callerArtVariants ?? brief.callerArtVariants ?? {},
      callerArtVariantPlan: spec.callerArtVariantPlan ?? brief.callerArtVariantPlan ?? {},
      respondentArt: spec.respondentArt ?? brief.respondentArt ?? "",
      respondentArtVariants: spec.respondentArtVariants ?? brief.respondentArtVariants ?? {},
      evidenceBoard: spec.evidenceBoard ?? brief.evidenceBoard ?? "",
      modeLabel: "试玩连线",
      storyArcTitle: "热线连线",
      storyArcSummary: brief.storyArcSummary,
      storyEpisodeTitle: storyPack.title,
      storyCaseLabel: storyPack.caseLabels?.[index] ?? "匿名来电"
    };
    return applyDifficultyProfile(episodeBrief, spec.difficultyProfile);
  });
}

export function generateWeeklyCaseSequence(npcs, attrs, options = {}) {
  return generateStoryPackSequence(npcs, attrs, options);
}

function applyDailyCaseTemplate(brief, names) {
  const builder = DAILY_TEMPLATE_BUILDERS[brief.plotId];
  if (builder) return builder(brief, names);
  throw new Error(`Daily case plot is not templated: ${brief.plotId}`);
}

function dailyCaseKey(now = new Date()) {
  const date = now instanceof Date ? now : new Date(now);
  const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const year = utc8Date.getUTCFullYear();
  const month = String(utc8Date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utc8Date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dailyHash(text) {
  return [...String(text)].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) >>> 0, 2166136261);
}

function applyRuntimeContentForBrief(brief, runtimeContent, options = {}) {
  if (!runtimeContent) return brief;
  const speakerId = options.speakerId ?? null;
  return applyRuntimeCaseContent(brief, {
    ...runtimeContent,
    sceneVersions: withChoiceRoutes((runtimeContent.sceneVersions ?? []).map((scene) => ({
      ...scene,
      ...(speakerId ? { speakerId } : {})
    })))
  });
}
