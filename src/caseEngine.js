import { applyDifficultyProfile } from "./difficulty.js";
import { applyRuntimeCaseContent } from "./runtime/contentCase.js";
import { DEFAULT_STORY_PACK_KEY, storyPackCaseContentFor, storyPackCaseContentForPlot, storyPackCaseCount, storyPackForKey } from "./storyPacks.js";
import { DAILY_TEMPLATE_BUILDERS } from "./caseTemplates/index.js";
import { withChoiceRoutes } from "./caseTemplates/dailyTemplateSupport.js";

const DAILY_PLOT_DEFINITIONS = {
  "lost-job-hidden-credit": {
    taskProfile: { id: "audit", label: "钱款说不清", recommendedSpecialtyId: "audit", summary: "钱说得急，责任却还没落到人。" },
    backdropClass: "backdrop-credit",
    label: "失业信用卡隐瞒局",
    publicHook: "一方失业后继续维持体面恋爱消费，直到信用卡和网贷爆雷。",
    truth: "失业、造急和递账是他的链条；会员订座、探店账号和分期设备是她剪掉的半边。",
    stance: "trueVictim",
    premeditated: true,
    premeditatedActorRole: "respondent",
    accusationChoices: [
      { label: "“我只是怕你知道我失业后就离开我。”", accuseRole: "respondent", response: "怕你离开可以是真的，但最低还款为什么马上转到你这里？" },
      { label: "“他头一回开口，我马上说不行，我自己都觉得难看。”", accuseRole: "complainant", response: "她怕自己显得只认钱，这是真的。可八万该不该转，不能靠这份难看来定。" },
      { label: "“账单还有三天才到期。”", accuse: "noPremeditated", response: "这句要停一下。说急了可能是慌，也可能是怕你有时间把账单看清楚。" },
      { label: "“以后他可能就不敢跟我谈结婚了。”", accuse: "both", response: "这句听着像怕丢脸，但一落到转钱，就不能只按感情话听了。" }
    ]
  },
  "house-name-security-test": {
    taskProfile: { id: "audit", label: "钱款说不清", recommendedSpecialtyId: "audit", summary: "钱说得急，责任却还没落到人。" },
    backdropClass: "backdrop-house",
    label: "婚前房产加名安全感局",
    publicHook: "一方说加名是安全感，另一方说这是以结婚为名拿资产。",
    truth: "房本归谁、婚后谁还、分开钱怎么算，这几句没人能靠“像一家人”带过去。",
    stance: "trueVictim",
    premeditated: true,
    premeditatedActorRole: "respondent",
    accusationChoices: [
      { label: "“买受人写的是对方父母。”", accuseRole: "respondent", response: "这句单独没问题，但旁边那张共同账户支出表要一起看。" },
      { label: "“最好能有个位置。”", accuseRole: "complainant", response: "这句才是她开头没说出的愿望。说出来不等于抢房，藏起来会让投入确认听着像绕话。" },
      { label: "“正常夫妻不会算这么细。”", accuse: "noPremeditated", response: "夫妻可以不天天算小账，但房贷和装修不是小账。" },
      { label: "“不写才像一家人。”", accuse: "both", response: "越说像一家人，越别让一个人把钱打进去以后没名分。" }
    ]
  },
  "tony-multi-dating": {
    taskProfile: { id: "emotion", label: "情绪卡住了", recommendedSpecialtyId: "emotion", summary: "情绪很满，有人一直把问题推回爱不爱。" },
    backdropClass: "backdrop-tony",
    label: "理发店自己人局",
    publicHook: "真实的照顾后面接着办卡、带客和投店，一张发错的表又把顾客按用途分了栏。",
    truth: "照顾确实发生过，关系却没有说定；相似称呼后接着生意请求，私加的推进列也不在门店标准表里。",
    stance: "trueVictim",
    premeditated: true,
    premeditatedActorRole: "respondent",
    accusationChoices: [
      { label: "“也就你肯听我说这些。”", accuseRole: "respondent", response: "这句听起来很专属。可相似称呼不等于这条语音原样发给过别人。" },
      { label: "“我听久了，真觉得自己对他不一样。”", accuseRole: "complainant", response: "这是她当时的判断，不是对方给过的关系承诺。" },
      { label: "“我从来没说只有你一个。”", accuse: "noPremeditated", response: "他确实留了口子，但“老板娘”这种话也不是随便听听就算了。" },
      { label: "“以后店开起来，你就是老板娘。”", accuse: "both", response: "这句甜不甜先放一边，后面有没有接办卡、投店，才是关键。" }
    ]
  },
  "education-income-fake-profile": {
    taskProfile: { id: "verification", label: "资料有雾", recommendedSpecialtyId: "verification", summary: "标签都好看，材料却总少一块。" },
    backdropClass: "backdrop-profile",
    label: "学历收入资料造假局",
    publicHook: "当事人来咨询择偶定位，却把学历、职业、收入和家庭资产说得很漂亮。",
    truth: "条件可以说得好听，但学历、收入、流水这些字一旦被拿来定关系，就得说全。",
    stance: "halfTruth",
    premeditated: false,
    premeditatedActorRole: null,
    accusationChoices: [
      { label: "“也算吧，我读的是 MBA。”", accuseRole: "respondent", response: "学校不是假的，但这句话让别人往更好听的方向理解了。" },
      { label: "“学校是真的。”", accuseRole: "complainant", response: "你这句也没说全。前面话说满了，后面就很难自己拆台。" },
      { label: "“再问下去，是不是工资卡也要交出来？”", accuse: "both", response: "这句刺耳，但它碰到的不是学历，是婚后钱怎么管。" },
      { label: "“结婚以后钱最好放一起管。”", accuseRole: "complainant", response: "这句才是流水后面那半句话。不是只验真假，是在试婚后钱归谁管。" }
    ]
  },
  "workplace-reimbursement-screenshot": {
    taskProfile: { id: "audit", label: "款项卡住了", recommendedSpecialtyId: "audit", summary: "截图看着完整，钱却没落到该落的位置。" },
    backdropClass: "backdrop-work",
    label: "职场报销截图",
    publicHook: "同事说报销已经批了，却一直不把垫付款转回。截图看着过了，偏偏少了付款那一页。",
    truth: "审批截图看着像过了，但付款状态、收款账户、返款入口没露出来，钱就还没说清。",
    stance: "halfTruth",
    premeditated: false,
    premeditatedActorRole: null,
    accusationChoices: [
      { label: "“报销审批通过了。”", accuseRole: "respondent", response: "审批走到哪一步是一回事，钱打给谁是另一回事。" },
      { label: "“我也确实想让老板把这次活动交给我。”", accuseRole: "complainant", response: "这句要承认。她想要机会是真的，同事拿这个机会让她先刷卡也是真的。" },
      { label: "“返款统一打给对接人。”", accuse: "both", response: "这句和审批截图放一起看，钱为什么一直回不来就有方向了。" },
      { label: "“先别在大群问预算了，今天来不及。活动结束再补报备。”", accuseRole: "respondent", response: "这句是入口。预算确认先被挪到私下，后面截图再漂亮，也补不了垫款风险。" }
    ]
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
  if (options.runtimeCaseId) return storyPackCaseContentFor(storyKey, options.runtimeCaseId);
  return storyPackCaseContentForPlot(storyKey, plotId);
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
    label: plot.label,
    publicHook: plot.publicHook,
    truth: plot.truth,
    backdropClass: plot.backdropClass,
    accusationChoices: plot.accusationChoices,
    complainantId,
    respondentId,
    dailyKey,
    dailyCase: true,
    modeLabel: "今日来电",
    storyArcTitle: `今日来电：${plot.label}`,
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
      callerArt: spec.callerArt ?? brief.callerArt,
      callerArtStyle: spec.callerArtStyle ?? brief.callerArtStyle ?? "",
      callerArtVariants: spec.callerArtVariants ?? brief.callerArtVariants ?? {},
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
