import { applyDifficultyProfile } from "./difficulty.js";
import { applyRuntimeCaseContent } from "./runtime/contentCase.js";
import { routeAxisForChoice, routeToneForChoice } from "./runtime/routeLog.js";
import { DEFAULT_STORY_PACK_KEY, storyPackCaseContentFor, storyPackCaseContentForPlot, storyPackCaseCount, storyPackForKey } from "./storyPacks.js";

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
      { label: "“我也怕别人觉得我找了个撑不住场面的人。”", accuseRole: "complainant", response: "这句把她自己的面子也放进来了。她不是只被催债，也不想承认自己被体面吸引过。" },
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
    label: "托尼老师多线养鱼局",
    publicHook: "一方以服务热情、性格会聊为借口，同时给多人制造排他暧昧。",
    truth: "几句专属话术如果后面都接办卡、带客、投店，那就不只是会聊天。",
    stance: "trueVictim",
    premeditated: true,
    premeditatedActorRole: "respondent",
    accusationChoices: [
      { label: "“也就我肯听他说这些。”", accuseRole: "respondent", response: "如果只对你一个人这么说，是暧昧；同样的话复制出去，味道就变了。" },
      { label: "“他说我像店里自己人。”", accuseRole: "complainant", response: "这句要承认。她不是错在帮忙，是她也不想太早拆穿那个位置到底算不算关系。" },
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

const DAILY_RO对方TION = [
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
  const dailySpec = options.plotId ? null : DAILY_RO对方TION[dailyHash(dailyKey) % DAILY_RO对方TION.length];
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
      storyBridge: spec.bridge,
      storyObjectLabel: spec.objectLabel,
      backdropClass: spec.backdropClass ?? brief.backdropClass,
      callerArt: spec.callerArt ?? brief.callerArt,
      callerArtStyle: spec.callerArtStyle ?? brief.callerArtStyle ?? "",
      callerArtVariants: spec.callerArtVariants ?? brief.callerArtVariants ?? {},
      weeklyCase: true,
      weeklyKey: storyKey,
      weeklyThemeId: theme.id,
      weeklyThemeTitle: theme.title,
      weeklyThemeIntro: theme.intro,
      weeklyThemeThesis: theme.thesis,
      weeklyThemeCommentPrompt: theme.commentPrompt,
      weeklyHiddenThread: theme.hiddenThread,
      weeklyAct: spec.act,
      weeklyBridge: spec.bridge,
      weeklyObjectLabel: spec.objectLabel,
      modeLabel: "试玩连线",
      storyArcTitle: "热线连线",
      storyArcSummary: spec.bridge,
      storyEpisodeTitle: storyPack.title,
      storyCaseLabel: storyPack.caseLabels?.[index] ?? "匿名来电",
      weeklyEpisodeTitle: storyPack.title,
      weeklyCaseLabel: storyPack.caseLabels?.[index] ?? "匿名来电"
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

const DAILY_TEMPLATE_BUILDERS = {
  "lost-job-hidden-credit": dailyLostJobCreditTemplate,
  "house-name-security-test": dailyHouseBoundaryTemplate,
  "tony-multi-dating": dailyTonyMultiDatingTemplate,
  "education-income-fake-profile": dailyFakeProfileTemplate,
  "workplace-reimbursement-screenshot": dailyWorkplaceReimbursementTemplate
};

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

function dailyBaseBrief(brief, names, fields) {
  const problemActorId = brief.respondentId ?? brief.complainantId;
  return {
    ...brief,
    label: fields.label ?? brief.label,
    storyArcTitle: fields.storyArcTitle ?? brief.storyArcTitle,
    premeditated: fields.premeditated ?? true,
    premeditatedActorId: fields.premeditatedActorId ?? problemActorId,
    stance: fields.stance ?? "trueVictim",
    openingComplaint: fields.openingComplaint,
    openingDialogue: fields.openingDialogue,
    scene: {
      ...(brief.scene ?? {}),
      name: fields.sceneName ?? "直播连线"
    },
    sceneVersions: withChoiceRoutes(fields.sceneVersions ?? []),
    explicitClueGroups: fields.explicitClueGroups,
    evidenceCards: fields.evidenceCards,
    evidenceChecks: fields.evidenceChecks ?? [],
    investigationHooks: fields.investigationHooks ?? [],
    deepFollowup: fields.deepFollowup,
    stageJudgement: fields.stageJudgement,
    followupTwist: fields.followupTwist,
    dailyShareTitle: fields.dailyShareTitle,
    dailyShareBody: fields.dailyShareBody,
    dailyShareQuestion: fields.dailyShareQuestion,
    publicHook: fields.publicHook ?? brief.publicHook,
    storyArcSummary: fields.storyArcSummary ?? brief.storyArcSummary,
    storySuspense: fields.storySuspense ?? brief.storySuspense,
    storyClueObject: fields.storyClueObject ?? brief.storyClueObject,
    truth: fields.truth ?? brief.truth
  };
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

function withChoiceRoutes(sceneVersions) {
  return sceneVersions.map((scene, sceneIndex) => ({
    ...scene,
    questionOptions: (scene.questionOptions ?? []).map((option) => ({
      ...option,
      correct: option.correct ?? (option.contradiction ? true : false),
      routeAxis: option.routeAxis ?? routeAxisForChoice(option, scene),
      routeTone: option.routeTone ?? routeToneForChoice(option, scene, sceneIndex)
    }))
  }));
}

function dailyLostJobCreditTemplate(brief, names) {
  const name = "咨询者";
  const other = "对方";
  return dailyBaseBrief(brief, names, {
    label: "8 万信用卡周转",
    storyArcTitle: "今日来电：8 万信用卡周转",
    publicHook: "对方 一直维持体面恋爱消费，突然让你先垫 8 万信用卡。是困难，还是化债？",
    storyArcSummary: "账单摊开：钱什么时候花的、花在哪、现在谁被叫去补洞。",
    storySuspense: "这案一不小心就吵成“你嫌我穷”。账单日期比委屈更诚实。",
    storyClueObject: "信用卡账单与社保断缴截图",
    openingComplaint: `${name}连线说：“我男朋友前几天突然让我帮他垫信用卡，说是短期周转。可我后来对账单才发现，这个窟窿早在他借钱之前就有了。”`,
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我想问下我男朋友的事。我们谈了半年多，平时约会消费什么的都挺体面的，我也没觉得有什么问题。结果前几天他突然跟我说信用卡需要周转，想让我先帮他顶一下。", mood: "anxious" },
      { speaker: "你", role: "host", text: "晚上好。我想问一下，他提钱的时候，原话是怎么讲的？", mood: "listening" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "他先说：“奖金晚发，帮我挡几天。”我真当成手头紧。后来他发了张办材料的截图，我瞄见社保那栏，停了两个多月——那张图还是他上个月办材料时截的。可他每天还跟我说加班。那张图我盯了半天，没回他。",
        doubt: "说是奖金晚发，可社保已经断缴两个月。",
        contradiction: "对方 一边说奖金延迟，一边在失业后继续刷体面消费，说明资金缺口不是临时才出现。",
        reliability: "mixed",
        questionOptions: [
          { question: "他开口借钱之前，有没有跟你说过工作最近不稳定？", answer: "没有。他之前一直说最近忙、加班多。要不是那张截图，我还以为他每天真在公司耗着。", contradiction: "社保断缴早于借钱，失业不是突然发生。", correct: true },
          { question: "你当时有没有起疑心？", answer: "一开始没有。我还替他想，是不是压力太大了，先把我稳住再说。可后来越对越不对，失业到底从哪天开始，他始终没讲清。", correct: false }
        ],
        dialogueOptions: [
          { question: "他当时只说差多少钱吗？", answer: "一开始没有。他就说先帮他挡一下，别让卡逾期。我追问，他才把最低还款那一栏截给我看。", routeAxis: "money-flow", routeTone: "detour" },
          { question: "你当时为什么没接着问工作？", answer: "我怕问重了像查岗。那会儿我还把他当男朋友，不是当一个要对账的人。", routeAxis: "caller-credibility", routeTone: "softening" }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我把那张信用卡账单翻出来才知道，不是小几千，是 8 万出头。大头是餐厅、礼物和两次酒店，都是他安排的那种店。往下还有一笔一万二的分期，写着什么短视频平台，我没细看，反正也是他手机上弄的。",
        doubt: "金额、用途和时间都比“挡几天”重得多。",
        contradiction: "8 万信用卡主要花在餐厅、礼物和酒店，不是房租医疗这类急事；短视频分期的受益人还没说清。",
        reliability: "partial",
        questionOptions: [
          { question: "这几笔账，哪些是在他没工作以后花的？", answer: "纪念日晚餐、礼物分期、两次酒店，都在断缴之后。那几天我还在朋友圈夸他会安排。那笔一万二的分期也是断缴以后开的，具体买了什么我说不上来。", contradiction: "对方 失业后仍继续制造高消费恋爱场景，短视频分期也在断缴后开通。", correct: true },
          { question: "短视频平台分期这一项，是不是也不对劲？", answer: "我当时也觉得怪。但它写得很含糊，我没往自己身上想。反正那会儿我先盯着餐厅和酒店。", correct: false, routeAxis: "document-edge", routeTone: "trust-but-verify" },
          { question: "有没有可能这些消费是他在硬撑？", answer: "可能。所以我才难受。他硬撑的时候，我也没少享受。账压过来以后，我才发现自己也在那场体面里。", correct: false }
        ],
        dialogueOptions: [
          { question: "你第一眼先看到哪一栏？", answer: "先看到最低还款。八千多，我手都停了一下。再往下翻，才看到那些消费明细。", routeAxis: "money-flow", routeTone: "detour" },
          { question: "那几页账单是完整的吗？", answer: "他一开始没发完整的。我说要看明细，他才补。补出来以后，我就有点不想看了。", routeAxis: "document-edge", routeTone: "trust-but-verify" }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我后来又对了一遍日期。他第一次说周转那天，账单还有三天才到期。他先催我“今晚就要”，后面又改成“这几天都行”。我问急什么，他回我一句：“我只是怕你知道我失业后就离开我。”说完，紧接着把最低还款金额发了过来。",
        doubt: "时间被说急了，咨询者更容易先转钱。",
        contradiction: "对方 把还款截止时间说急，制造咨询者当晚转钱的压力。",
        reliability: "partial",
        questionOptions: [
          { question: "他为什么把三天后的期限说成今晚？", answer: "我问过。他说怕我拖着不管。可账单还有三天，他非要我当晚转，我手都按在转账页上了，越看越不舒服。", contradiction: "对方 放大还款期限，减少咨询者检查账单的时间。", correct: true },
          { question: "有没有可能他自己也慌了，才把时间说乱？", answer: "可能他真是手头太紧，慌了神吧。你想，他平时那么要面子，能开口求我，我第一反应也不是怀疑，是觉得他可能真撑不住了。就是后来我自己想，账单还差两三天，他怎么会急成那样。", correct: false }
        ],
        dialogueOptions: [
          { question: "你当时已经准备转了吗？", answer: "差一点。页面都打开了。就是看到到期日那里，我才停住。", routeAxis: "money-flow", routeTone: "detour" },
          { question: "他后来为什么又改口？", answer: "他说我别紧张，这几天转也行。可前面那句“今晚就要”已经把我吓到了。", routeAxis: "identity-wording", routeTone: "trust-but-verify" }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "主播，还有笔账我得说清楚。你们弹幕一直在问那个一万二的分期。那个……是一套拍视频的灯和稳定器，还有平台的推广套餐。东西，在我这儿。",
        doubt: "她说“没细看”的那笔分期，设备一直摆在她屋里。",
        contradiction: "对方 失业后开通的分期，买的是给咨询者做账号用的设备和推广。",
        reliability: "mixed",
        questionOptions: [
          { question: "设备在你这儿，当时分期是谁提出来开的？", answer: "他提的。我那阵子想做探店号，跟他念叨过好几次。他说“我来投资你”，第二天就把分期开了。我要说完全没心动，是假话。", contradiction: "对方 用“投资你”把她的心愿变成自己账单上的分期。", correct: true, routeAxis: "money-flow", routeTone: "pressure-point" },
          { question: "这笔分期，你为什么开场没提？", answer: "……我怕说了，直播间就不站我了。他瞒失业是真的，让我垫八万也是真的，我不想这两件事被一笔分期搅浑。", correct: false, routeAxis: "caller-credibility", routeTone: "caller-skeptical" }
        ],
        dialogueOptions: [
          { question: "那套东西现在还在吗？", answer: "在。灯架还没拆，稳定器也在。我不是没用过，只是说到八万的时候，我不想先讲这个。", routeAxis: "caller-credibility", routeTone: "detour" },
          { question: "他说投资你的时候，你怎么回的？", answer: "我没拦。还挺高兴的。现在说这个很难听，但当时我真的觉得他是在支持我。", routeAxis: "money-flow", routeTone: "softening" }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "还有一句我没好意思说：他提过如果我这次不帮，以后他可能就不敢跟我谈结婚了，说自己会一直觉得低我一头。我前面也没说全。那周我们刚吃过很贵的纪念日晚餐，店是我用会员号订的，朋友圈也是我发的。我跟朋友一直把他讲得挺体面，也没想承认自己很吃那种体面。真说出来，我也怕别人觉得我找了个撑不住场面的人，像是我自己看走眼。",
        doubt: "借钱这件事开始被说成尊严和结婚态度。",
        contradiction: "对方 把个人债务转成关系忠诚测试，咨询者也不愿承认自己被体面吸引。",
        reliability: "partial",
        questionOptions: [
          { question: "他把你不垫钱和结婚联系起来，是怎么说的？", answer: "他说最难的时候我都不站在他这边，以后结婚他也抬不起头。我听完很难受，好像不转这笔钱，就成了我不爱他。", contradiction: "对方 把个人债务转成关系忠诚测试。", correct: true },
          { question: "你一直说要看账单，那句不好说出口的话是什么？", answer: "我怕的是背这笔债，但那话说不出口。我怕一拒绝就被说嫌贫爱富。刚才那句都说出口了……前面我把他夸得那么体面，现在改口，我自己也挂不住。所以我才一直说要看账单，先拖着。", correct: false }
        ]
      }
    ],
    evidenceCards: [
      { id: "daily-credit-social-security", type: "社保截图", title: "社保断缴时间", front: "断缴发生在第一次借钱之前。", detail: "失业并非临时发生。", targets: ["truthWithGap", "sceneHint"], contradiction: "社保断缴早于借钱，说明失业被持续隐瞒。" },
      { id: "daily-credit-card-bill", type: "账单", title: "信用卡账单", front: "餐厅、礼物分期、酒店、1.2 万短视频分期和最低还款集中在同一周。", detail: "账单显示债务与体面恋爱消费有关，短视频分期另有受益人。", targets: ["sceneHint"], contradiction: "信用卡债务包含维持恋爱体面的消费成本，也包含一笔咨询者受益的短视频分期。" },
      { id: "daily-credit-chat", type: "聊天", title: "最低还款请求", front: "“你先帮我挡一下，我不想这段关系因为钱毁了。”", detail: "把债务包装成关系考验。", targets: ["truthWithGap"], contradiction: "还款请求把个人债务包装成关系考验。" }
    ],
    evidenceChecks: [
      {
        id: "credit-after-layoff-spend",
        title: "账单检视",
        prompt: "这张信用卡账单里，哪一块最该先圈出来？",
        material: "社保断缴后，同一张卡上继续出现纪念日晚餐、礼物分期、两次酒店，还有一笔 1.2 万的短视频平台分期。",
        options: [
          { label: "断缴后的餐厅、礼物和酒店消费", correct: true, contradiction: "8 万信用卡主要花在餐厅、礼物和酒店，不是房租医疗这类急事。", feedback: "圈到这里，“临时挡几天”就没那么轻了。社保断了，吃住玩还在往卡上走。", routeAxis: "money-flow" },
          { label: "最低还款金额本身很高", correct: false, feedback: "金额高当然可疑，但这张账单更要先看：钱是在失业后怎么继续刷出来的。", routeAxis: "money-flow" },
          { label: "那笔 1.2 万的短视频平台分期", correct: false, feedback: "这笔名目是怪，可单看它定不了性。断缴之后还在刷的吃住玩，才把“挡几天”压垮。", routeAxis: "document-edge" },
          { label: "他说自己怕被分手", correct: false, feedback: "这句话会让人心软，但它不是账单里的消费记录。先把卡上那几笔圈清楚。", routeAxis: "caller-credibility" }
        ]
      }
    ],
    investigationHooks: [
      {
        id: "credit-friend-dm",
        source: "dm",
        surface: "后台进来一条私信",
        title: "朋友圈补图",
        triggerContradiction: "8 万信用卡主要花在餐厅、礼物和酒店，不是房租医疗这类急事。",
        appearsNowBecause: "收麦后，咨询者的朋友补了一张当晚朋友圈截图。",
        prompt: "这张补图里，哪一处最该留下？",
        material: "朋友圈照片发在纪念日晚餐那晚，定位是她常去的那家店，配文写“终于有人把日子过得体面一点”。朋友多嘴补了一句：你那阵子天天发探店视频，灯和稳定器还是他分期给你置的吧。",
        proves: "体面是两个人一起经营的，其中一笔的受益人是她。",
        stillCannotProve: "不能证明她该替对方还这八万，也不能证明他失业前的旧债从哪来。",
        routeAxis: "external-corroboration",
        options: [
          { label: "探店视频和那套分期设备", correct: true, contradiction: "分期设备和推广的受益账号是咨询者自己的号，“他带我消费”的说法被她自己的视频拆了半边。", feedback: "这条不替他还账。但今晚的账单里，有一笔的受益人一直坐在麦前。", routeAxis: "external-corroboration" },
          { label: "朋友语气很替她生气", correct: false, feedback: "朋友生气很正常，账还是得回到谁刷、谁还。", routeAxis: "outer-thread" },
          { label: "照片看起来很贵", correct: false, feedback: "贵不贵只是第一眼的感觉，和账单同周出现才咬得上。", routeAxis: "document-edge" }
        ]
      }
    ],
    deepFollowup: {
      question: "那我多问一句。那笔信用卡上一万二分期买的灯和稳定器，现在还摆在你屋里，你心里把它算成谁花的钱？",
      answer: "……说不出口的就是这个。算他的，那是他失业以后刷的卡；算我的，我又没签过一个字。朋友都觉得他工作稳定、出手大方，我一拒绝这八万，就像亲手把这层撕开。可难看归难看，账不能就这么变成我的。",
      note: "问到这里，两个人的体面各归各，账单才能开始谈。"
    },
    stageJudgement: "这通麦别急着站队。他社保停了没说，卡照刷，期限说急，最后一句“怕你离开”接一个还款金额；她开口说“他带我消费”，可订座的会员号、探店的账号，都是她自己的。",
    followupTwist: "后续回拨里，对方承认失业和账单都是真的，也认了那句“投资你”是想把她留住。他问了一句：她收灯的时候挺高兴的，怎么上麦就成了“他手机上弄的”？",
    dailyShareTitle: "8 万信用卡，到底该不该帮 对方 还？",
    dailyShareBody: "手头紧可以理解，可社保早已断缴，约会账单还在往上堆。",
    dailyShareQuestion: "你会先问失业时间，还是先问 对方 为什么借钱？",
    truth: "两条账分开算。他的：失业早已发生，断缴后照样刷吃住玩，三天的期限说成今晚，最后拿感情递账单。这四步一步比一步重，八万的主体是他的债，递不到她手里。她的：店多半是她挑的，人设是她发的，一万二的分期她收了东西还说没细看。这三步不欠他钱，但欠今晚的直播间半个真相。定不了的今晚就不定：他失业前的旧债从哪来的，这两个人往后还过不过，弹幕替谁着急都没用。"
  });
}

function dailyHouseBoundaryTemplate(brief, names) {
  const name = "咨询者";
  const other = "对方";
  return dailyBaseBrief(brief, names, {
    label: "婚前房与共同还贷",
    storyArcTitle: "今日来电：婚前房与共同还贷",
    publicHook: "婚前房写在 对方 父母名下，却要你婚后一起还贷。你提份额协议，对方 说你太算计。",
    storyArcSummary: "别先吵加名，先问房本、还贷、分开以后钱怎么认。",
    storySuspense: "“你不信任我”这句话很好用，但它不能替共同还贷签字。",
    storyClueObject: "购房合同、父母转账与协议草稿",
    openingComplaint: `${name}连线说：“对方 家婚前买房写父母名下，说婚后我们一起还贷。我提能不能写清份额和退出机制，对方 说我还没结婚就想着离。”`,
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我不是非要房子。婚前房写 对方 父母名下，可婚后又说我们一起还贷才像一家人。", mood: "anxious" },
      { speaker: "你", role: "host", text: "晚上好。合同上写谁、家里怎么说还贷，你从这两处讲。", mood: "listening" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我不是非要加名，我只是想知道我婚后还进去的钱算什么。可 对方 一直说，正常夫妻不会算这么细。",
        doubt: "不加名可以理解，但婚后还贷不能含糊。",
        contradiction: "房产登记和还贷安排被拆成两套说法：权属归父母，现金流要小家庭承担。",
        reliability: "mixed",
        questionOptions: [
          { question: "你慢点说，首付谁出、房本写谁、婚后谁还？", answer: "首付和登记都在对方父母名下，婚后还贷计划却要从共同账户走。", contradiction: "权属和还贷安排不匹配，存在共同还贷被弱化的风险。", correct: true },
          { question: "他说一起还贷时，怎么把“一家人”带出来的？", answer: "他说婚后一起还贷才像一家人。我当时听着挺暖，回头看才发现，房本是一套话，还贷是另一套话。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "合同照片是他妈妈发到小群里的，说让我家也先了解一下。买受人写的是对方父母。后面她又补了一张“婚后家庭共同账户支出表”，房贷也在里面。",
        doubt: "房子归父母没问题，但共同账户那页得有人解释。",
        contradiction: "材料把产权留在父母名下，却把婚后还贷放入共同支出。",
        reliability: "partial",
        questionOptions: [
          { question: "这张表里，房贷和装修是怎么写进家庭开销的？", answer: "他妈妈把房贷和装修都列成每月固定开销，像是婚后日常支出。但份额怎么分、以后分开怎么补，一个字都没写。", contradiction: "共同支出表缺少还贷份额和退出补偿机制。", correct: true },
          { question: "如果只留每月流水，这事能不能先谈下去？", answer: "可能能谈下去一点，但补偿和退出规则还是被推迟了。流水有了，钱算什么没说清。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "还有个细节：他妈妈说装修不用我家出大头，但希望我每月从工资里转一笔到共同账户，说这样“新家才像一起过”。",
        doubt: "这笔每月转账听着像过日子，实际用途却没说死。",
        contradiction: "装修和房贷被包装成共同生活投入，但产权与补偿仍不对应。",
        reliability: "partial",
        questionOptions: [
          { question: "这笔每月转账有没有写用途和归属？", answer: "没有。她只说放共同账户好看点。我一问这钱具体干什么，她就说房贷、装修、生活都在里面，夫妻过日子别分那么清。", contradiction: "共同账户转账缺少用途和归属说明。", correct: true },
          { question: "她说不用你家出大头，你当时为什么还是不踏实？", answer: "听起来像退让。但我每月固定转进去，长期下来也不是小钱，只是没有一次性说得那么刺耳。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我提过一个很轻的方案：不加名，只把婚后还贷和装修按流水留个确认。但我没说全，这个说法是我妈帮我改过的。她原话是“最好能有个位置”，怕我直接说加名太难听，才让我先说投入确认。他说这比加名还伤感情，因为说明我随时准备撤。",
        doubt: "连最轻的投入确认，也被说成准备分手。",
        contradiction: "咨询者把“最好能有个位置”的诉求包装成投入确认；对方 连不加名的投入确认也拒绝。",
        reliability: "partial",
        questionOptions: [
          { question: "你提的是加名，还是只确认婚后投入？", answer: "我嘴上只说确认投入，还特意说不碰他们家的首付和产权。可我妈那句“最好能有个位置”确实在我心里，我没有直接说出来。", contradiction: "咨询者没有直接说出“最好能有个位置”的诉求。", correct: true },
          { question: "如果他愿意留流水，不签协议，你能不能接受？", answer: "只能让我没那么慌。流水能证明我出了钱，但这钱以后算什么，还是没人认。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我把他后来那句也念一下：“房子放父母名下是家里安排，不影响我们过日子。不写才像一家人，你要协议，就是不信我。”",
        doubt: "“不写才像一家人”听着亲，但钱已经开始往外走了。",
        contradiction: "对方 把投入确认说成不信任，回避了共同还贷如何被确认的问题。",
        reliability: "partial",
        questionOptions: [
          { question: "不写清楚的话，你还进去的钱算什么？", answer: "我就卡在这里。如果不写清楚，那我婚后还进去的贷款，以后到底算我一起买房，还是算我白替他们家供了一段？", contradiction: "对方无法说明共同还贷的钱最后怎么算。", correct: true },
          { question: "你要不要先只谈装修钱，房贷这块晚点再说？", answer: "装修钱容易谈，但房贷才是长期流出的那笔。话题一缩小，核心现金流就滑过去了。", correct: false }
        ]
      }
    ],
    evidenceCards: [
      { id: "daily-house-contract", type: "购房合同", title: "买受人页", front: "买受人为对方父母，未出现婚后双方姓名。", detail: "产权归属清晰，但和婚后还贷计划不一致。", targets: ["truthWithGap", "sceneHint"], contradiction: "产权归父母，婚后还贷却计划由小家庭承担。" },
      { id: "daily-house-account", type: "账户表", title: "共同账户支出表", front: "房贷、装修、物业被列为婚后固定共同支出。", detail: "共同支出需要对应份额、补偿或明确赠与。", targets: ["sceneHint"], contradiction: "共同账户支出表缺少还贷份额和退出补偿机制。" },
      { id: "daily-house-agreement", type: "协议草稿", title: "投入确认条款", front: "未要求加名，只要求还贷和装修留流水、按投入补偿。", detail: "这更像保护投入，不是直接夺取产权。", targets: ["truthWithGap", "sceneHint"], contradiction: "协议草稿没有要求加名，重点是确认共同投入。" }
    ],
    evidenceChecks: [
      {
        id: "house-account-gap",
        title: "共同账户表",
        prompt: "这张表最缺哪一栏？",
        material: "共同账户支出表列了房贷、装修、物业，但没有写份额，也没有写分开时怎么补。",
        options: [
          { label: "还贷份额和退出补偿", correct: true, contradiction: "共同支出表缺少还贷份额和退出补偿机制。", feedback: "缺的不是感情态度，是这笔钱以后怎么算。", routeAxis: "money-flow" },
          { label: "他父母的首付来源", correct: false, feedback: "首付来源可以另问，但这张表的问题在婚后共同支出没有落账。", routeAxis: "document-edge" },
          { label: "婚礼预算", correct: false, feedback: "婚礼预算不在这张表里，追这里会把房贷主线岔开。", routeAxis: "outer-thread" }
        ]
      }
    ],
    investigationHooks: [
      {
        id: "house-family-chat-backflow",
        source: "dm",
        surface: "有人补了一张图",
        title: "家庭群补图",
        triggerContradiction: "共同支出表缺少还贷份额和退出补偿机制。",
        appearsNowBecause: "收麦后，咨询者把家庭小群里被截掉的一页补了过来。",
        prompt: "这页补图里，哪句最该圈出来？",
        material: "群里上一句是“先别写分开怎么补，写了不吉利”。下一句才是“房贷、装修、物业以后都从共同账户走”。",
        proves: "退出补偿不是没想到，而是被有意避开。",
        stillCannotProve: "不能证明对方家一定想占便宜，但能证明共同账户规则被故意留空。",
        routeAxis: "external-corroboration",
        options: [
          { label: "先别写分开怎么补", correct: true, contradiction: "退出补偿不是没想到，而是被有意避开。", feedback: "这句一出来，表格缺栏就不是疏忽了。", routeAxis: "external-corroboration" },
          { label: "不吉利这三个字", correct: false, feedback: "这三个字好听也好用，但该圈的是它挡掉了哪一栏。", routeAxis: "identity-wording" },
          { label: "共同账户走房贷装修", correct: false, feedback: "这句前面已经听过了，补图新露出来的是为什么不写退出。", routeAxis: "money-flow" }
        ]
      }
    ],
    deepFollowup: {
      question: "那我多问一句，你自己心里最想要的是投入补偿，还是这套房里有一个能被看见的位置？",
      answer: "我想要能被看见的位置。这句话我没在直播开头讲，因为讲出来就像我要房。可如果婚后每月还贷、装修、共同账户都进去，我又不想最后只剩几张流水。",
      note: "问到这里，房本那口气落下去，她没说出口的那句也摆出来了。"
    },
    stageJudgement: "这案不能只盯着加不加名。房本、房贷、装修、分开怎么补，四句话得放在一起听；她嘴上说投入确认，心里也想要一个位置。",
    followupTwist: "后续回拨里，对方还是那句“不写才像一家人”。越是这时候，越要把共同账户的钱问明白。",
    dailyShareTitle: "婚前房不加名，但要你一起还贷，算不算洗房？",
    dailyShareBody: "加不加名还能谈，房本在父母名下、还贷从共同账户走，这句得说清楚。",
    dailyShareQuestion: "你会先问房本，首付，还是婚后还贷？",
    truth: "婚前房不加名可以谈，父母出资也可以尊重。但如果婚后要一起还贷、装修、转共同账户，就得提前说清这些钱以后算什么。她也别把“想有个位置”全包成投入确认，这句话难听，但不说出来更容易把人推到互相猜。"
  });
}

function dailyTonyMultiDatingTemplate(brief, names) {
  const name = "咨询者";
  const other = "对方";
  return dailyBaseBrief(brief, names, {
    label: "理发店排班表",
    storyArcTitle: "今日来电：理发店排班表",
    publicHook: "她以为自己快要确定关系，直到对方发错一张店里预约表，备注不像剪头，倒像在给人分类。",
    storyArcSummary: "看那张表怎么从预约表变成资源表：谁被安抚，谁被办卡，谁被往投店上推。",
    storySuspense: "他会聊天不稀奇，稀奇的是每句亲近后面都接了店里的事。",
    storyClueObject: "理发店排班表与办卡记录",
    openingComplaint: `${name}连线说：“我和相亲认识的一个发型师暧昧了几个月，本来以为快要往前走一步了。结果他昨晚发错一张店里的内部表，我越看越觉得，那上面记的不是预约时间。”`,
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我想问一下相亲认识的一个男生。我们暧昧了几个月，他在理发店当发型师。昨天他本来要发当天的预约时间给我，可能手滑，发错了一张店里的内部表。我刚点开还以为是排班，越看越觉得不对。", mood: "anxious" },
      { speaker: "你", role: "host", text: "晚上好。那张表格的事我们先放一放，在发错表之前，他平时都是怎么跟你相处的？", mood: "listening" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "对方每次下班后都陪我聊天，总说也就我肯听他说这些。我们没正式说男女朋友，可每天聊到凌晨，我就默认是在往那边走。",
        doubt: "没有确认关系，但对方一直给排他式的亲近感。",
        contradiction: "对方 用“只有你懂我”的亲密话术制造排他期待，却没有给明确关系承诺。",
        reliability: "mixed",
        questionOptions: [
          { question: "他有没有说过你们现在到底算什么关系？", answer: "没有。他会说“你跟别人不一样”，但真问到关系，他就说慢慢来。", contradiction: "亲密感很满，关系承诺却一直悬着。", correct: true },
          { question: "话当时没说死，你当时怎么回他的？", answer: "我也怕一问就尴尬。他说我像店里自己人，我听着还挺受用，就想着再等等。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "后来我翻聊天，发现一个节奏特别明显。他先说“店里压力大”“今晚又被店长说了”，还说这些只跟我讲。我跟朋友复述的时候都说：“他说我像店里自己人。”我一心软，他就接让我帮忙发活动、带朋友去剪头，或者问我下次要不要直接办年卡。",
        doubt: "情绪求助后面开始接店里的经营目标。",
        contradiction: "对方 把亲密聊天接到办卡、带客和朋友圈推广上。",
        reliability: "partial",
        questionOptions: [
          { question: "他说压力大之后，最常接什么请求？", answer: "不只是安慰。说着说着就会拐到店里活动，让我转一下，或者问我朋友要不要来剪头。", contradiction: "情绪求助后接商业转化请求。", correct: true },
          { question: "他让你帮店里这些事时，你当时怎么理解你们的关系？", answer: "他老说我是店里的自己人，剪头给我打折，有时还送护理。我那会儿真会往好处想，不愿意往拉客那边想，觉得是在帮他，也是在帮我们以后。说难听点，我也舍不得把这层关系问破。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "昨天他发错那张表，我才把前面的事串起来。表头写的是预约，可备注没写“烫发”“修刘海”，写的是“情绪稳定”“办卡意向强”“朋友多”。我那一行后面写着“稳情绪”。",
        doubt: "那张表不像普通客户备注，更像在写每个人能带来什么。",
        contradiction: "对方 把不同对象按情绪价值、办卡意向和客源资源分类管理。",
        reliability: "partial",
        questionOptions: [
          { question: "这张表是在记发型需求，还是在记你们能带来什么？", answer: "他写的不是我想剪什么头，备注里全是我能不能安抚、会不会办卡、能不能带朋友。发型那栏反而空着。", contradiction: "预约表实际在记录对象可转化的资源。", correct: true },
          { question: "你那一栏为什么会被写成稳情绪？", answer: "可能因为我总听他说店里的事，也很少当场翻脸。他知道我会先安慰他，再帮他想办法。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我拿表问他，他回我：“我从来没说只有你一个。”可我翻聊天，他发过“以后店开起来，你就是老板娘”。这句话不是求婚，可听完以后，他再说办年卡、以后投一点，我就没那么防备。",
        doubt: "没说“只有你”，不代表没有让人往那个方向想。",
        contradiction: "对方 用未来身份暗示制造排他期待，同时保留口头退路。",
        reliability: "partial",
        questionOptions: [
          { question: "他说老板娘之后，有没有马上让你办卡或投店？", answer: "有。那晚没过多久就聊年卡，说我以后常来店里方便。后来还提过店要是扩大，我可以先投一点。", contradiction: "未来身份暗示后紧接着出现办卡和投店话题。", correct: true },
          { question: "“老板娘”那句是在什么场合说的？", answer: "深夜聊天说的。当时听着挺甜，我也愿意信。可后面接着年卡、投店，我现在再看就有点犯恶心。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我后来盯着最后那列看了很久：“下一次推进”。我那行写“年卡已聊，可稳情绪”；另一个女生写“能投店，约饭再谈”；还有一个写“朋友多，带客”。看到那儿，我才知道不是我一个人在自作多情。",
        doubt: "表格不只是备注，还写了下一步怎么把人往店里推进。",
        contradiction: "对方 把不同暧昧对象按可推进资源分层管理。",
        reliability: "partial",
        questionOptions: [
          { question: "这张表是在排员工，还是在排你们这些人下一步怎么推进？", answer: "那不是排班。我的名字后面是“年卡已聊、稳情绪”；另一个也不是班次，是“能投店”“能带客”。", contradiction: "排班表实为暧昧对象资源分层表。", correct: true },
          { question: "有没有可能只是店里玩笑备注？", answer: "如果只有我一个名字，我还能骗自己是玩笑。但每个人后面都接一个功能，还写下一次怎么推进，我就没法只当玩笑了。", correct: false }
        ]
      }
    ],
    evidenceCards: [
      { id: "daily-tony-roster", type: "排班表", title: "理发店预约表", front: "备注列写着“情绪稳定 / 能投店 / 能带客”。", detail: "这些备注不像剪发需求，更像每个人能带来的东西。", targets: ["truthWithGap", "sceneHint"], contradiction: "排班表显示多个暧昧对象被按功能分类。" },
      { id: "daily-tony-chat-copy", type: "聊天截图", title: "三份专属话术", front: "三个人都收到过“你和别人不一样”。", detail: "后续请求不同：办卡、投店、见朋友。", targets: ["halfLie"], contradiction: "专属话术被复制给不同对象。" },
      { id: "daily-tony-card", type: "消费记录", title: "办卡与礼物", front: "暧昧升温后一周内出现年卡和礼物消费。", detail: "情绪承诺与消费绑定。", targets: ["sceneHint"], contradiction: "未来承诺后紧接消费绑定。" }
    ],
    evidenceChecks: [
      {
        id: "tony-roster-column",
        title: "排班表检视",
        prompt: "这张表里哪一列不像预约表？",
        material: "表头写预约，备注却写着“情绪稳定”“办卡意向强”“朋友多”，最后一列还有“下一次推进”。",
        options: [
          { label: "备注和下一次推进", correct: true, contradiction: "对方 把不同对象按可推进资源分层管理。", feedback: "这不是剪头需求，是把人按能带来什么往下排。", routeAxis: "process-control" },
          { label: "预约时间", correct: false, feedback: "预约时间本身没问题，刺眼的是备注里的功能标签。", routeAxis: "document-edge" },
          { label: "店员名字", correct: false, feedback: "名字不够要紧，后面那些“稳情绪”“能投店”才让这张表变了性质。", routeAxis: "outer-thread" }
        ]
      },
      {
        id: "tony-card-timing",
        title: "办卡记录检视",
        prompt: "办卡记录旁边，哪一处最该追？",
        material: "记录里写着：“老板娘玩笑后 22:48 聊年卡，次日推护理套卡；备注：先别催，稳住。”",
        options: [
          { label: "老板娘之后接年卡", correct: true, contradiction: "亲密身份话后立刻接年卡和投店试探。", feedback: "甜话可以是玩笑，可它后面马上接了消费。", routeAxis: "money-flow" },
          { label: "22:48 这个时间", correct: false, feedback: "深夜聊天容易暧昧，但时间本身不是这条记录最扎眼的地方。", routeAxis: "identity-wording" },
          { label: "先别催，稳住", correct: false, feedback: "这句很冷，但它说明的是推进手法；前面那句先把关系位置垫起来了。", routeAxis: "process-control" }
        ]
      }
    ],
    investigationHooks: [
      {
        id: "tony-other-caller-dm",
        source: "dm",
        surface: "后台进来一条私信",
        title: "另一份同款表",
        triggerContradiction: "对方 把不同对象按可推进资源分层管理。",
        appearsNowBecause: "收麦后，另一个女生把她收到的那张表也发了过来。",
        prompt: "这张同款表里，哪处最该圈？",
        material: "她那栏写着“能投店”，后面跟着“约见朋友、聊分红”。另一栏写“情绪稳住，年卡下次推”。",
        proves: "同一套亲密话术后面接的是不同商业目标。",
        stillCannotProve: "不能证明所有暧昧都假，但能证明他把人按用途往下排。",
        routeAxis: "external-corroboration",
        options: [
          { label: "能投店和聊分红", correct: true, contradiction: "另一个对象也被写进投店推进表，亲密关系被接到商业转化上。", feedback: "这不是只对一个人嘴甜，是每个人后面都接着下一步用途。", routeAxis: "external-corroboration" },
          { label: "她也说被他哄过", correct: false, feedback: "被哄过只能说明她也有同样的感觉，这张表更硬的是用途分栏。", routeAxis: "caller-credibility" },
          { label: "年卡下次推", correct: false, feedback: "年卡是旧线，新私信更重的是投店和分红已经进表。", routeAxis: "money-flow" }
        ]
      }
    ],
    deepFollowup: {
      question: "那我多问一句，看到排班表里写投店、带客以后，你自己当时为什么还愿意接那些店里的事？",
      answer: "因为我也吃了那个“自己人”的感觉。他说以后店里有我一个位置，我就觉得办卡、转活动、带朋友过去都像在帮我们。现在看，他不承认关系，我也没逼他说清楚，投店、带客这些难听话就被我们一起往后拖了。",
      note: "问到这里，甜话和店里的账已经缠在一起了。"
    },
    stageJudgement: "这不是普通多聊几个人。那张表里有“稳情绪”“年卡已聊”“能投店”“带客”，甜话后面接的是店里的下一步。",
    followupTwist: "后续回拨里，另一位女生也发来私信，说她那栏写着“能投店”。到这里，“排班表”三个字已经挂不住了。",
    dailyShareTitle: "你会从哪一句看出 对方 在养鱼？",
    dailyShareBody: "几句暧昧聊天还能解释，排班表里那几栏解释不了：情绪稳定、能投店、能带客。",
    dailyShareQuestion: "你觉得“你和别人不一样”算锤吗？",
    truth: "会聊天不等于有问题。可同一套“你最懂我”分别发给几个人，后面又接办卡、带客、投店，那就不只是暧昧了。"
  });
}

function dailyFakeProfileTemplate(brief, names) {
  const name = "咨询者";
  const other = "对方";
  return dailyBaseBrief(brief, names, {
    label: "存款证明",
    storyArcTitle: "今日来电：存款证明",
    publicHook: "见父母前，他发来学校、工作、收入截图，还补了一张存款证明。图不一定假，但这顿饭还没吃，流水已经被问出来了。",
    storyArcSummary: "材料会越要越细，男方有话没说全，女方也有话没跟家里说。",
    storySuspense: "几张图都挺像真的，问题是它们刚好少了最容易吵起来的部分。",
    storyClueObject: "几张资料截图和一张存款证明",
    openingComplaint: "咨询者连线说：“我跟相亲对象快到见父母这一步了。他发来学历、工作、收入截图，后面又补了一张存款证明。我本来挺高兴，可我妈问得细，我拿着图一对，才发现这些图都少一块。”",
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我想问下我男朋友的事。", mood: "thinking" },
      { speaker: "你", role: "host", text: "晚上好。你们是怎么认识的，现在卡在哪一步？", mood: "listening" },
      { speaker: name, role: "caller", text: "我们是相亲认识的，最近快到见父母。我之前跟家里说他名校毕业、条件不错，后来他发了学校、工作、收入截图，我本来还挺高兴。可我妈问得比我想象中细。", mood: "thinking" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我一开始也觉得，我妈只是怕我吃亏。可还没正式见父母，就问到学校、收入、存款，后来又问流水，我自己都觉得这个尺度不太像普通见家长。",
        doubt: "见面前问到流水，这个尺度已经不太像普通寒暄。",
        contradiction: "见父母前就要学校、收入、存款和流水，本身已经超过普通寒暄。",
        reliability: "mixed",
        questionOptions: [
          { question: "这些截图是什么时候发的，发之前你们怎么说到材料的？", answer: "我没敢直接说“你把截图发来”。我妈一直催，说见面前得摸清楚。我夹在中间，只能跟他说，我妈可能会问学校和收入，让他别被问住。第二天他就把几张图发来了。", contradiction: "女方家在见面前就开始核对择偶条件。", correct: true },
          { question: "问到流水的时候，你有没有拦过？", answer: "有。我还跟我妈说，第一次见面就问存款和流水不太好听。可她说我已经把话说在前面了，现在不问，饭桌上更尴尬。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "还有个细节我前面没说。介绍人一开始就把他讲得挺好，说“学校好、收入稳、家里也省心”。我后来跟家里说的时候，也顺着这个版本说下去了。",
        doubt: "这个好看版本不是男方一个人说出来的。",
        contradiction: "介绍人、男方和咨询者都参与放大了体面标签，完整信息被层层修剪。",
        reliability: "partial",
        questionOptions: [
          { question: "这个好看的版本，是他一个人说出来的吗？", answer: "不全是。介绍人先夸，我回家又顺着说得更好听。他自己也含糊，MBA、本科、收入构成，没有一次摊开讲。", contradiction: "体面标签被介绍人、男方和咨询者共同放大。", correct: true },
          { question: "后来这件事，你跟家里改过口吗？", answer: "我怎么改口啊？介绍人说他学校好，我妈都跟亲戚夸出去了。我再跑回去说，妈，他不是你以为的那种名校，本科其实很普通，她脸往哪儿搁？而且相亲不就这样吗，谁先把短处摊出来？他包装学历，我们这边追流水，我当时真觉得半斤八两，凭什么最后只说我不真诚。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我家一直按“名校毕业”理解。真问本科，他说：“也算吧，MBA。”后来才说清，是那所学校的 MBA 项目，本科不是那儿的。我只跟家里说学校是真的，本科没提。",
        doubt: "名校这句有真东西，但别人听到的可能是另一层意思。",
        contradiction: "男方用名校毕业概括 MBA 项目，本科学历落差被留在了标签外面。",
        reliability: "partial",
        questionOptions: [
          { question: "那张学校图少了哪一边，少的是本科、项目还是学制？", answer: "校名和项目是真的。本科、项目性质和学制没写在图上。名校毕业是我回家说满的，他那句“也算吧，MBA”也确实没把本科说明白。", contradiction: "男方用真标签保留了别人误会的空间。", correct: true },
          { question: "本科这件事，你后来跟家里提过吗？", answer: "提不了啊。“名校毕业”已经讲出去了，再补一句本科很普通，我妈立刻就得变脸。我想着流水那关要是过了，这事就当没发生过。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我开始不踏实，是因为他口头收入说得不错，可平时花销看起来对不上。他不是没钱那种，但特别会算，约会也经常把便宜说成会过日子。",
        doubt: "收入截图是一回事，平时钱怎么花又是另一回事。",
        contradiction: "男方声称收入和日常花销不匹配，咨询者才把存款证明追成流水和真实收入。",
        reliability: "partial",
        questionOptions: [
          { question: "你问流水，是想确认他到底赚多少？", answer: "是。我嘴上拿我妈挡着，自己也想知道。他到底是真有那么多收入，还是只是账面上好看。", contradiction: "咨询者追流水不只是求安心，也在确认真实收入和婚后钱怎么落地。", correct: true },
          { question: "哪次花销让你觉得不对？", answer: "有次他说奖金刚到，吃饭却算了半天团购券，还问停车费能不能 AA。AA 不是不行，可和他说的收入放一起，我心里就别扭。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "他后来反问我：“再问下去，是不是工资卡也要交出来？”我当时没接住。可我妈确实说过一句：结婚以后钱最好放一起管。她的意思是，如果他收入真不错，婚后至少工资要透明，甚至要上交一部分。",
        doubt: "问流水这件事，已经快碰到婚后钱怎么管了。",
        contradiction: "女方家问流水，不只是怕被骗，也带着婚后工资透明和上交工资的预设。",
        reliability: "partial",
        questionOptions: [
          { question: "这句你有没有转给他？", answer: "没有。我只说我妈想确认稳定。要是直接把“以后钱最好放一起管”这句话说出来，这顿饭大概就不用吃了。", contradiction: "咨询者把工资管理的要求包装成了确认稳定。", correct: true },
          { question: "那他拒绝流水是不是就一定心虚？", answer: "也不一定。见父母前就问到流水和工资怎么管，换谁都会不舒服。可是我确实想知道，他说的收入能不能落到以后的小家里。", correct: false }
        ]
      }
    ],
    explicitClueGroups: [
      [
        "见父母前就要学校、收入、存款和流水，本身已经超过普通寒暄。",
        "咨询者也知道材料尺度过细，但被自己先前的高预期绑住。"
      ],
      [
        "男方用名校毕业概括 MBA 项目，本科学历落差被留在了标签外面。",
        "咨询者知道学历标签有落差后，也没有把完整信息告诉家里。",
        "多份材料同时避开择偶定位核心。"
      ],
      [
        "男方声称收入和日常花销、抠门细节不匹配。",
        "咨询者借父母的口，想摸清男方真实收入和钱流向。",
        "单张存款证明和当日收入截图撑不起长期收入判断。",
        "女方家问流水，不只是怕被骗，也带着婚后工资透明和上交工资的预设。",
        "咨询者把工资管理的要求包装成了确认稳定。"
      ]
    ],
    evidenceCards: [
      { id: "daily-profile-scale", type: "聊天原话", title: "见面前的问题", front: "见父母还没定，学校、工作、收入、存款和流水已经全摆上了桌。", detail: "她只提过学校和工作；收入、存款是他主动发的，流水是她后来追问的。", targets: ["truthWithGap"], contradiction: "见父母前就要学校、收入、存款和流水，本身已经超过普通寒暄。" },
      { id: "daily-profile-mba", type: "学历材料", title: "名校毕业", front: "细问才知道是 MBA 项目，本科学历没有一起说。", detail: "图上写的是 MBA，没有写他本科在哪儿读。", targets: ["halfLie"], contradiction: "男方用名校毕业概括 MBA 项目，本科学历落差被留在了标签外面。" },
      { id: "daily-profile-spending", type: "消费细节", title: "收入和花销", front: "口头收入不错，日常小钱却反复算。", detail: "团购、积分和停车费 AA 只能说明他算钱细，不能说明他没有收入。", targets: ["truthWithGap", "sceneHint"], contradiction: "男方声称收入和日常花销、抠门细节不匹配。" },
      { id: "daily-profile-flow", type: "聊天原话", title: "流水和工资卡", front: "对方反问：再问下去，是不是工资卡也要交出来？", detail: "她没告诉他，家里还说过婚后工资最好放在一起管。", targets: ["sceneHint"], contradiction: "流水追问背后藏着婚后工资透明和上交工资的预设。" }
    ],
    evidenceChecks: [
      {
        id: "profile-mba-gap",
        title: "学历材料检视",
        prompt: "学校图里最该追哪一块？",
        material: "截图能看到校名和 MBA 项目，但本科、项目性质和学制没有放在一起。",
        options: [
          { label: "本科、项目性质和学制", correct: true, contradiction: "男方用名校毕业概括 MBA 项目，本科学历落差被留在了标签外面。", feedback: "图不一定假，但少的这一块会让“名校毕业”变成另一种听法。", routeAxis: "identity-wording" },
          { label: "截图像不像修过", correct: false, feedback: "就算图片没改过，它也没有本科院校、项目性质和学制。", routeAxis: "document-edge" },
          { label: "介绍人有没有夸张", correct: false, feedback: "介绍人说过什么，不能替这张图补上本科。", routeAxis: "caller-credibility" }
        ]
      },
      {
        id: "profile-income-flow-gap",
        title: "收入材料检视",
        prompt: "存款证明和收入截图里，还缺哪一块？",
        material: "资料里有一张当日存款证明，余额停在 28.6 万；另一张收入截图只露出“本月到账 3.1 万”和公司抬头。",
        options: [
          { label: "连续流水和收入构成", correct: true, contradiction: "单张存款证明和当日收入截图撑不起长期收入判断。", feedback: "只有一个月的到账，不能说明他以后每个月都有这笔钱。", routeAxis: "money-flow" },
          { label: "存款当天的余额数字", correct: false, feedback: "余额数字好看，但它只站在那一天。", routeAxis: "money-flow" },
          { label: "截图是不是原图", correct: false, feedback: "原图也可能只截到最好看的那一页。", routeAxis: "document-edge" }
        ]
      }
    ],
    investigationHooks: [
      {
        id: "profile-family-chat-backflow",
        source: "dm",
        surface: "有人补了一张图",
        title: "家里群截图",
        triggerContradiction: "男方用名校毕业概括 MBA 项目，本科学历落差被留在了标签外面。",
        appearsNowBecause: "收麦后，咨询者补了一页家里群截图，说这页她刚才没敢念。",
        prompt: "这页家里群里，哪一句最该留下？",
        material: "她妈妈发的是：“学历先这样说，后面主要看收入流水。要是真稳定，婚后工资最好放一起管。”",
        proves: "学历只是入口，家里后面追的是收入和婚后工资管理。",
        stillCannotProve: "不能证明男方资料全假，也不能证明女方只是拜金。",
        routeAxis: "external-corroboration",
        options: [
          { label: "后面主要看收入流水", correct: true, contradiction: "学历追问只是入口，家里后面盯的是收入流水和婚后工资管理。", feedback: "这页把女方家没说出口的筛选目的补出来了。", routeAxis: "external-corroboration" },
          { label: "学历先这样说", correct: false, feedback: "这句能解释前面怎么铺开的，后面那句才露出家里要问到哪一步。", routeAxis: "identity-wording" },
          { label: "工资最好放一起管", correct: false, feedback: "这句刺耳，但单圈它会跳过前面为什么一路追流水。", routeAxis: "money-flow" }
        ]
      }
    ],
    deepFollowup: {
      question: "那我多问一句，你自己的家庭经济状况怎么样？你自己一个月工资多少，够花吗？",
      answer: "我自己也不是特别宽裕，所以我才更在意他收入到底落不落地。我嘴上说家里想看稳定，我也想知道以后这笔钱是不是能进小家。",
      note: "问到这里，资料真假还在桌上，她自己最在意的钱也上桌了。"
    },
    stageJudgement: "男方不是整套假资料，MBA、收入、存款都有真东西；女方嘴上说求安心，心里还惦着以后这笔收入能不能进小家。",
    followupTwist: "后续回拨里，咨询者补了一句，她妈原话是“以后钱最好放一起管”。这下流水就不只是证明题了。",
    dailyShareTitle: "存款证明都发了，怎么反而更怪？",
    dailyShareBody: "今晚最该吵的是：他不是全假，她也不只是求安心，流水后面已经碰到工资怎么管。",
    dailyShareQuestion: "你听完会觉得是包装，是筛选，还是两边都在试探婚后的钱？",
    truth: "男方给的不是白纸黑字的假图，但他说法留了很大的想象空间。女方发现学历和收入都有落差后，也没有跟家里讲全，还借家里的口继续问流水。两边都把难听的话包起来了。",
    premeditated: false,
    premeditatedActorId: null,
    stance: "halfTruth"
  });
}

function dailyWorkplaceReimbursementTemplate(brief, names) {
  const name = "咨询者";
  return dailyBaseBrief(brief, names, {
    label: "职场报销截图",
    storyArcTitle: "今日来电：职场报销截图",
    publicHook: "同事说报销已经批了，却一直不把垫付款转回。那张截图看着没问题，偏偏少了付款那一截。",
    storyArcSummary: "先问三件事：谁让垫、谁拿署名、截图到底停在哪一步。",
    storySuspense: "这案很容易骂成同事骗钱。审批通过和钱到账不是一回事。",
    storyClueObject: "报销审批截图、活动群聊和供应商报价单",
    openingComplaint: "咨询者连线说：“公司上个月办客户答谢会，同事说财务流程来不及，让我先拿个人信用卡垫了场地和礼品费。活动办完很久，报销批下来了，可那笔钱一直没回我。”",
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我想问一件公司里的事。上个月我们部门办客户答谢会，当时负责对接的同事跟我说财务流程来不及，让我先拿个人信用卡垫了场地和礼品费。结果活动办完很久，报销批下来了，可我垫付的那笔钱却一直没回我。", mood: "thinking" },
      { speaker: "你", role: "host", text: "晚上好。客户答谢会是部门的事，怎么最后变成你先垫这笔钱？", mood: "listening" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我一开始也不是完全被迫。我刚进项目组，确实想借这次客户答谢会让老板看到我。更难听一点，我先跟老板说过这次活动我能负责，所以听到“活动总结写你负责”，就先垫了。",
        doubt: "咨询者不是完全被逼，也确实想拿这个表现机会。",
        contradiction: "咨询者先争取负责这次活动，同事再把垫付款包装成表现机会，资金风险被弱化。",
        reliability: "mixed",
        questionOptions: [
          { question: "他让你垫钱时，原话有没有提署名和老板？", answer: "有。他让我先垫场地和礼品费，又说活动总结里可以写我负责。我没说的是，我前面已经跟老板表过态，想接这个活。", contradiction: "咨询者先向老板表态想负责这次活动，同事借这个把垫款包装成机会。", correct: true },
          { question: "他说活动总结写你负责的时候，你当时怎么想的？", answer: "我马上答应了。说难听点，我就是想让老板把这次活动交给我。所以垫款的事我没马上追问，怕一问就显得我只惦记钱。可想表现不等于钱可以一直卡在他手里。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我后来才想起来，活动前他让我别在大群里问预算，说当天来不及，等活动结束再补报备。我也怕在大群问预算，会让人觉得我前面说能负责这次活动是在逞强。",
        doubt: "私下垫款不是偶然，它先绕开了公开预算确认。",
        contradiction: "同事让咨询者避开大群预算确认，把垫款放进私下流程。",
        reliability: "partial",
        questionOptions: [
          { question: "他为什么不让你在大群确认预算？", answer: "他说大群里问预算，会显得我不担事，老板会觉得我推活。让我先把活动办了，结束以后再补报备。我当时最怕老板觉得我不扛事，就没再问。现在想想，他就是卡着我这个脸面。", contradiction: "同事借表现压力阻止公开确认预算。", correct: true },
          { question: "你如果当时在群里问，会不会真的影响观感？", answer: "会，肯定不那么好看。但至少群里会留下话，谁批钱、谁还钱、谁跟供应商对接，都跑不掉。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "他后来发给我的那张图，抬头是“报销审批通过”。我当时以为等于钱已经到了，可仔细看下面没有付款流水，也没有收款账户。",
        doubt: "审批通过看着像结束了，后面还差付款那一步。",
        contradiction: "报销截图只显示审批通过，没有付款流水和收款账户。",
        reliability: "partial",
        questionOptions: [
          { question: "这张审批图少了哪一边，是付款状态还是收款账户？", answer: "图上确实是审批通过。可下面没有付款状态，也没收款账户。我看不见钱打没打出去，也看不见打给谁。", contradiction: "审批截图缺少付款状态和收款账户，不能证明钱已到账。", correct: true },
          { question: "他有没有可能只是财务慢，不是故意拖？", answer: "有可能。所以我才没一上来撕破脸。但如果只是财务慢，他完全可以给我看付款状态，或者让我问财务，而不是一直拿审批截图挡。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我后来又翻供应商报价单，发现礼品那项有一个“服务协调费”。同事说这是正常费用，可供应商群里又提到会把返款统一打给对接人。",
        doubt: "钱卡着不动，可能还牵着供应商那边的返款。",
        contradiction: "供应商报价单出现服务协调费，返款却可能打给同事这个对接人。",
        reliability: "partial",
        questionOptions: [
          { question: "供应商返款打给谁，和你的垫付款是不是同一条钱路？", answer: "群里说返款统一给对接人，对接人还是他。等于我先刷卡，公司报销他卡着，供应商返款也往他那边走。", contradiction: "同事同时控制报销入口和供应商返款入口。", correct: true },
          { question: "你问过这笔服务协调费是不是正常报价吗？", answer: "问过。他说这行可能就是正常报价。可他不让我问财务，也不把返款说清楚，我心里怎么可能不犯嘀咕。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "活动总结表出来以后，“执行主责”那栏确实写了我，但付款对接人和供应商确认人都还是他。出了问题，公司先找我；可我要催付款，还得找他。",
        doubt: "署名给了表面责任，关键入口仍在同事手里。",
        contradiction: "咨询者拿到项目署名，却没有拿到付款和供应商入口。",
        reliability: "partial",
        questionOptions: [
          { question: "活动总结写你负责，付款又归他对接，这两个位置最后在同一个人手里吗？", answer: "不在。报告上写我负责，出了事先找我；可付款、供应商确认、返款都在他那边。钱什么时候回来，我还得等他一句话。", contradiction: "项目责任和资金入口被拆给不同人。", correct: true },
          { question: "活动总结写了你负责以后，你最怕别人怎么说？", answer: "一开始我觉得值，能让老板看见我，多干点也认了。可钱一直没回来，我再看那张表，心里就发虚。我最怕别人问：你自己私下垫的钱，为什么没提前报备？", correct: false }
        ]
      }
    ],
    evidenceCards: [
      { id: "daily-work-repay-approval", type: "报销截图", title: "审批通过页", front: "截图只露出“审批通过”，没有付款状态和收款账户。", detail: "审批通过不等于钱已到账。", targets: ["truthWithGap"], contradiction: "审批截图缺少付款状态和收款账户，不能证明钱已到账。" },
      { id: "daily-work-repay-chat", type: "群聊原话", title: "署名和垫款", front: "“你先把场地和礼品费垫了。活动总结的‘执行主责’一栏，可以写你的名字。”", detail: "表现机会和资金风险被放在同一条消息里。", targets: ["sceneHint"], contradiction: "垫付款被包装成项目署名机会，资金风险被弱化。" },
      { id: "daily-work-repay-vendor", type: "报价单", title: "服务协调费", front: "礼品报价里出现服务协调费，供应商群里提到返款给对接人。", detail: "返款流向决定这事是慢报销，还是有人截住入口。", targets: ["truthWithGap"], contradiction: "同事同时控制报销入口和供应商返款入口。" }
    ],
    evidenceChecks: [
      {
        id: "work-approval-missing",
        title: "审批截图检视",
        prompt: "这张审批图最该让对方补哪一页？",
        material: "截图只露出“审批通过”。下面没有付款状态，也没有收款账户。",
        options: [
          { label: "付款状态和收款账户", correct: true, contradiction: "审批截图缺少付款状态和收款账户，不能证明钱已到账。", feedback: "审批过不等于钱到账，少的就是这一页。", routeAxis: "document-edge" },
          { label: "活动现场照片", correct: false, feedback: "活动办了也不代表钱回来了。", routeAxis: "outer-thread" },
          { label: "老板有没有看到活动总结", correct: false, feedback: "活动总结写了谁负责，没写他什么时候把垫款还回来。", routeAxis: "identity-wording" }
        ]
      }
    ],
    investigationHooks: [
      {
        id: "work-supplier-dm",
        source: "dm",
        surface: "后台进来一条私信",
        title: "供应商补话",
        triggerContradiction: "审批截图缺少付款状态和收款账户，不能证明钱已到账。",
        appearsNowBecause: "收麦后，供应商群里有人匿名补了一句。",
        prompt: "这条补话里，哪处最该圈出来？",
        material: "供应商说“服务协调费按老规矩返给对接人”。同一张表里，对接人还是那位同事，付款确认页没有发给咨询者。",
        proves: "报销入口和供应商返款入口都在同事手里。",
        stillCannotProve: "不能证明公司审批是假，但能证明截图停在最容易挡人的一页。",
        routeAxis: "external-corroboration",
        options: [
          { label: "返给对接人", correct: true, contradiction: "供应商返款按老规矩返给对接人，资金入口仍在同事手里。", feedback: "这一句把那张审批图没露出来的钱路补上了。", routeAxis: "external-corroboration" },
          { label: "按老规矩", correct: false, feedback: "老规矩听着就别扭，但要先看钱返给谁。", routeAxis: "process-control" },
          { label: "付款确认页没发", correct: false, feedback: "付款确认前面已经问过，这条新东西是返款给谁。", routeAxis: "document-edge" }
        ]
      }
    ],
    deepFollowup: {
      question: "那我多问一句，如果今天不只是钱没回来，你最怕这件事在公司里被说成什么？",
      answer: "我最怕他们说我是为了抢署名才私下垫款，流程不规范。我先跟老板说这次活动我能负责，我也确实想让老板把活动交给我；但他用这个让我先刷卡、又拿审批截图挡我，也是真的。",
      note: "问到这里，咨询者想表现是真的，被人拿这个点压着先垫钱也是真的。"
    },
    stageJudgement: "这不只是同事欠钱。活动总结写了咨询者负责，垫款却划在她自己的卡里；审批图、付款入口和供应商返款还都攥在对方手里。",
    followupTwist: "后续回拨里，财务说审批通过后还要二次付款确认，收款账户填的是同事账户。截图不是假，只是刚好截到最能让人闭嘴的地方。",
    dailyShareTitle: "报销截图都发了，钱为什么还没回来？",
    dailyShareBody: "审批图是过了，可付款状态、收款账户、供应商返款，一项都没露。",
    dailyShareQuestion: "你会先问审批截图，还是先问谁拿了项目署名？",
    truth: "办公室里，有些机会听着很好听，先刷出去的却是自己的卡。咨询者想让老板看见自己，所以没把报备问清楚；对方答应在活动总结里写她负责，付款入口和供应商返款却还攥着。名声好不好听是一回事，垫出去的钱是真出去了。",
    premeditated: false,
    premeditatedActorId: null,
    stance: "halfTruth"
  });
}
