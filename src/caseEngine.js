import { applyDifficultyProfile } from "./difficulty.js?v=0.20.68";
import { applyRuntimeCaseContent } from "./runtime/contentCase.js?v=0.20.68";
import { routeAxisForChoice, routeToneForChoice } from "./runtime/routeLog.js?v=0.20.68";
import { DEFAULT_STORY_PACK_KEY, storyPackCaseContentFor, storyPackCaseCount, storyPackForKey } from "./storyPacks.js?v=0.20.68";

const DAILY_PLOT_DEFINITIONS = {
  "lost-job-hidden-credit": {
    taskProfile: { id: "audit", label: "钱款说不清", recommendedSpecialtyId: "audit", summary: "钱说得急，责任却还没落到人。" },
    backdropClass: "backdrop-credit",
    label: "失业信用卡隐瞒局",
    publicHook: "一方失业后继续维持体面恋爱消费，直到信用卡和网贷爆雷。",
    truth: "失业没先说，账单又递到另一方手里，这事不能只靠心疼往下接。",
    accusationChoices: [
      { label: "“我只是怕你知道我失业后就离开我。”", accuseRole: "respondent", response: "怕你离开可以是真的，但最低还款为什么马上转到你这里？" },
      { label: "“我也怕别人觉得我找了个撑不住场面的人。”", accuseRole: "complainant", response: "这句把她自己的面子也放进来了。她不是只被催债，也不想承认自己被体面吸引过。" },
      { label: "“账单其实还有三天才到期。”", accuse: "noPremeditated", response: "这句要停一下。说急了可能是慌，也可能是怕你有时间把账单看清楚。" },
      { label: "“以后他可能就不敢跟我谈结婚了。”", accuse: "both", response: "这句听着像怕丢脸，但一落到转钱，就不能只按感情话听了。" }
    ]
  },
  "house-name-security-test": {
    taskProfile: { id: "audit", label: "钱款说不清", recommendedSpecialtyId: "audit", summary: "钱说得急，责任却还没落到人。" },
    backdropClass: "backdrop-house",
    label: "婚前房产加名安全感局",
    publicHook: "一方说加名是安全感，另一方说这是以结婚为名拿资产。",
    truth: "房本归谁、婚后谁还、分开钱怎么算，这几句没人能靠“像一家人”带过去。",
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
    accusationChoices: [
      { label: "“只有我能接住 TA 的情绪。”", accuseRole: "respondent", response: "如果只对你一个人这么说，是暧昧；同样的话复制出去，味道就变了。" },
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
    accusationChoices: [
      { label: "“他一直说名校毕业，细问才说是 MBA。”", accuseRole: "respondent", response: "学校不是假的，但这句话让别人往更好听的方向理解了。" },
      { label: "“我只说他学校那边确实是真的。”", accuseRole: "complainant", response: "你这句也没说全。前面话说满了，后面就很难自己拆台。" },
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
    accusationChoices: [
      { label: "“报销审批通过了。”", accuseRole: "respondent", response: "这句只能证明审批到过那一步，不能证明钱已经打给谁。" },
      { label: "“我也确实想要这个主责。”", accuseRole: "complainant", response: "这句要承认。她想要机会是真的，同事拿这个机会让她先刷卡也是真的。" },
      { label: "“返款统一打给对接人。”", accuse: "both", response: "这句和审批截图放一起看，钱为什么一直回不来就有方向了。" },
      { label: "“先私下把事办成，复盘再补流程。”", accuseRole: "respondent", response: "这句是入口。流程先被挪到私下，后面截图再漂亮，也补不了垫款风险。" }
    ]
  }
};

const DAILY_TEMPLATE_PLOT_IDS = Object.keys(DAILY_PLOT_DEFINITIONS);

function taskProfileForPlot(plotId) {
  return DAILY_PLOT_DEFINITIONS[plotId]?.taskProfile ?? DAILY_PLOT_DEFINITIONS["education-income-fake-profile"].taskProfile;
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
    plotId: "house-name-security-test",
    caseMode: "daily",
    sceneId: "broker-office",
    complainantId: "zhou",
    respondentId: "lin"
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
    plotId: "house-name-security-test",
    caseMode: "daily",
    sceneId: "broker-office",
    complainantId: "he",
    respondentId: "xu"
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
    stance: "halfTruth",
    premeditated: false,
    premeditatedActorId: null
  };
  const names = {
    complainantName: npcs.find((npc) => npc.id === brief.complainantId)?.name ?? "咨询者",
    respondentName: npcs.find((npc) => npc.id === brief.respondentId)?.name ?? "对方"
  };
  return [applyDifficultyProfile(applyDailyCaseTemplate({
    ...brief
  }, names), {
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
    const templateBrief = generateDailyCaseSequence(npcs, attrs, {
      ...options,
      dailyKey: `${storyKey}-${index + 1}`,
      plotId: spec.plotId,
      complainantId: spec.complainantId,
      respondentId: spec.respondentId
    })[0];
    const runtimeContent = storyPackCaseContentFor(storyKey, spec.caseId);
    const brief = applyRuntimeCaseContent(templateBrief, runtimeContent
      ? {
          ...runtimeContent,
          sceneVersions: withChoiceRoutes(runtimeContent.sceneVersions ?? [])
        }
      : null);
    return {
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
      storyCommentSeeds: comments.commentSeeds ?? [],
      storyLowRevealTone: comments.lowRevealTone ?? "",
      storyHighRevealTone: comments.highRevealTone ?? "",
      storyAct: spec.act,
      storyBridge: spec.bridge,
      storyObjectLabel: spec.objectLabel,
      backdropClass: spec.backdropClass ?? brief.backdropClass,
      weeklyCase: true,
      weeklyKey: storyKey,
      weeklyThemeId: theme.id,
      weeklyThemeTitle: theme.title,
      weeklyThemeIntro: theme.intro,
      weeklyThemeThesis: theme.thesis,
      weeklyThemeCommentPrompt: theme.commentPrompt,
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
  });
}

export function generateWeeklyCaseSequence(npcs, attrs, options = {}) {
  return generateStoryPackSequence(npcs, attrs, options);
}

function applyDailyCaseTemplate(brief, names) {
  if (brief.plotId === "lost-job-hidden-credit") return dailyLostJobCreditTemplate(brief, names);
  if (brief.plotId === "house-name-security-test") return dailyHouseBoundaryTemplate(brief, names);
  if (brief.plotId === "tony-multi-dating") return dailyTonyMultiDatingTemplate(brief, names);
  if (brief.plotId === "education-income-fake-profile") return dailyFakeProfileTemplate(brief, names);
  if (brief.plotId === "workplace-reimbursement-screenshot") return dailyWorkplaceReimbursementTemplate(brief, names);
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
    publicHook: "TA 一直维持体面恋爱消费，突然让你先垫 8 万信用卡。是困难，还是化债？",
    storyArcSummary: "账单摊开：钱什么时候花的、花在哪、现在谁被叫去补洞。",
    storySuspense: "这案一不小心就吵成“你嫌我穷”。账单日期比委屈更诚实。",
    storyClueObject: "信用卡账单与社保断缴截图",
    openingComplaint: `${name}连线说：“TA 说信用卡只是短期周转，让我先帮一下。我不是不帮，是后来发现这个洞可能早就有了。”`,
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我想问下我男朋友的事。我们谈了半年，之前约会一直挺体面。前几天他突然说信用卡要周转，让我先帮他顶一下。", mood: "anxious" },
      { speaker: "你", role: "host", text: "晚上好。先说第一次提钱，他原话怎么讲？", mood: "listening" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "他一开始说的是“奖金晚发，帮我挡几天”。我本来以为只是手头紧。后来他让我帮他看一张办材料用的社保截图，我才看到上面已经断缴两个月了。",
        doubt: "说是奖金晚发，可社保已经断缴两个月。",
        contradiction: "TA 一边说奖金延迟，一边继续高消费，说明资金缺口不是临时才出现。",
        reliability: "mixed",
        questionOptions: [
          { question: "他开口借钱之前，有没有跟你说过工作最近不稳定？", answer: "没有。他之前一直说最近忙、加班多。要不是那张办材料的截图，我根本不知道他已经断缴两个月了。", contradiction: "社保断缴早于借钱，失业不是突然发生。", correct: true },
          { question: "你当时有没有起疑心？", answer: "一开始没有。我第一反应是他是不是压力太大，想先把人稳住。可后来再看，失业到底从什么时候开始，他一直没讲。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我把那张信用卡账单翻出来才知道，不是小几千，是 8 万出头。最大几笔不是房租和医疗，是餐厅、礼物、酒店和短视频平台分期。",
        doubt: "金额和用途都比“挡几天”重得多。",
        contradiction: "8 万信用卡主要花在餐厅、礼物和酒店，不是房租医疗这类急事。",
        reliability: "partial",
        questionOptions: [
          { question: "这几笔账，哪些是在他没工作以后花的？", answer: "纪念日晚餐、礼物分期和两次酒店都在断缴之后。", contradiction: "TA 失业后仍继续制造高消费恋爱场景。", correct: true },
          { question: "有没有可能这些消费是他在硬撑？", answer: "可能。可我卡住的是，硬撑出来的账单，最后为什么变成我要先帮他补上。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我后来又对了一遍日期。他第一次说周转那天，账单其实还有三天才到期。他先催我“今晚就要”，后面又改成“这几天都行”。",
        doubt: "时间被说急了，咨询者更容易先转钱。",
        contradiction: "TA 把还款截止时间说急，制造咨询者当晚转钱的压力。",
        reliability: "partial",
        questionOptions: [
          { question: "他为什么把三天后的期限说成今晚？", answer: "我问过，他说怕我拖着不管。可他越催我当晚转钱，我越觉得不对：他可能更怕我把账单明细翻完。", contradiction: "TA 放大还款期限，减少咨询者检查账单的时间。", correct: true },
          { question: "有没有可能他自己也慌了，才把时间说乱？", answer: "可能。他确实慌。但慌不等于可以把时间说成今晚，让我在没看清账单时先转钱。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "他后来发来一句：“我只是怕你知道我失业后就离开我。”但紧接着又问我能不能先把最低还款转过去。",
        doubt: "难过是真的，账递过来也是真的。",
        contradiction: "TA 承认隐瞒失业，却仍把还款压力推给关系里的另一方。",
        reliability: "partial",
        questionOptions: [
          { question: "他说怕你离开，那最低还款为什么要你先转？", answer: "我当时确实被那句“怕你离开”弄心软了。可他下一句就发来最低还款金额，我才反应过来：他说难受是真的，让我补窟窿也是真的。", contradiction: "情绪脆弱不能自动转化为债务转嫁。", correct: true },
          { question: "那他下个月准备怎么还？", answer: "他开始讲下个月会有办法，可说来说去，失业多久、债务怎么形成，还是没接上。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "还有一句我没好意思说：他提过如果我这次不帮，以后他可能就不敢跟我谈结婚了，说自己会一直觉得低我一头。我前面也没说全，那周我们刚吃过很贵的纪念日晚餐，我还发了朋友圈。我跟朋友一直把他讲得挺体面，也没想承认自己其实很吃那种体面，怕突然承认他失业欠账，像是我自己看走眼。",
        doubt: "借钱这件事开始被说成尊严和结婚态度。",
        contradiction: "TA 把个人债务转成关系忠诚测试，咨询者也不愿承认自己被体面吸引。",
        reliability: "partial",
        questionOptions: [
          { question: "他把你不垫钱和结婚联系起来，是怎么说的？", answer: "他说最难的时候我都不站在他这边，以后结婚他也抬不起头。我听完很难受，好像不转这笔钱，就成了我不爱他。", contradiction: "TA 把个人债务转成关系忠诚测试。", correct: true },
          { question: "那你为什么一直绕着说要看账单？", answer: "其实我是怕背这笔债，但又说不出口。我怕一拒绝就被说嫌贫爱富，我也怕别人觉得我找了个撑不住场面的人。前面我把他夸得体面，现在突然承认他失业欠账，我自己也挂不住。所以我才一直说要看账单。", correct: false }
        ]
      }
    ],
    evidenceCards: [
      { id: "daily-credit-social-security", type: "社保截图", title: "社保断缴时间", front: "断缴月份早于第一次借钱 47 天。", detail: "失业并非临时发生。", targets: ["truthWithGap", "sceneHint"], contradiction: "社保断缴早于借钱，说明失业被持续隐瞒。" },
      { id: "daily-credit-card-bill", type: "账单", title: "信用卡账单", front: "餐厅、礼物分期和最低还款集中在同一周。", detail: "账单显示债务与体面恋爱消费有关。", targets: ["sceneHint"], contradiction: "信用卡债务包含维持恋爱体面的消费成本。" },
      { id: "daily-credit-chat", type: "聊天", title: "最低还款请求", front: "“你先帮我挡一下，我不想这段关系因为钱毁了。”", detail: "把债务包装成关系考验。", targets: ["truthWithGap"], contradiction: "还款请求把个人债务包装成关系考验。" }
    ],
    evidenceChecks: [
      {
        id: "credit-after-layoff-spend",
        title: "账单检视",
        prompt: "这张信用卡账单里，哪一块最该先圈出来？",
        material: "社保断缴后，同一张卡上继续出现纪念日晚餐、礼物分期、两次酒店和短视频平台分期。",
        options: [
          { label: "断缴后的餐厅、礼物和酒店消费", correct: true, contradiction: "8 万信用卡主要花在餐厅、礼物和酒店，不是房租医疗这类急事。", feedback: "这块一圈出来，“临时周转”就站不稳了。", routeAxis: "money-flow" },
          { label: "最低还款金额本身很高", correct: false, feedback: "金额高只能说明压力大，还不能说明这笔债为什么要转给她。", routeAxis: "money-flow" },
          { label: "他说自己怕被分手", correct: false, feedback: "这句话有用，但它是情绪入口，不是账单上的硬缺口。", routeAxis: "caller-credibility" }
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
        material: "朋友圈照片发在纪念日晚餐那晚。配文写“终于有人把日子过得体面一点”。同一周账单里，还有礼物分期和两次酒店。",
        proves: "咨询者也参与过体面叙事。",
        stillCannotProve: "不能证明她应该替对方还信用卡。",
        routeAxis: "external-corroboration",
        options: [
          { label: "朋友圈配文和账单同周", correct: true, contradiction: "咨询者也参与维持体面叙事，但这不能把信用卡债务转给她。", feedback: "这张图补的是她为什么迟迟不愿撕开体面，不是替对方接账的理由。", routeAxis: "external-corroboration" },
          { label: "朋友语气很替她生气", correct: false, feedback: "朋友站队能解释情绪，解释不了这笔账为什么该由谁还。", routeAxis: "outer-thread" },
          { label: "照片看起来很贵", correct: false, feedback: "贵不贵只是感觉，和账单同周出现才有咬合。", routeAxis: "document-edge" }
        ]
      }
    ],
    deepFollowup: {
      question: "那我多问一句，社保断缴和信用卡还款都摆出来以后，你最怕失去的是钱，还是这段关系原来看起来很体面的样子？",
      answer: "我最怕承认的是，我也被那个体面打动过。朋友都觉得他工作稳定、出手大方，我不垫这笔信用卡还款，就像亲手把这层撕开。可撕开归撕开，账还是不能变成我的。",
      note: "聊到这一步，心疼归心疼，面子归面子，账单不能自动换人。"
    },
    stageJudgement: "这案别只问穷不穷。社保断缴没说，信用卡花销没停；她也被那层体面吸引过，所以才迟迟不敢把账单和面子分开。",
    followupTwist: "后续回拨里，对方承认失业和信用卡债务都是真的，也承认现在最急的是先撑过最低还款。脆弱是真的，让别人接账也是真的。",
    dailyShareTitle: "8 万信用卡，到底该不该帮 TA 还？",
    dailyShareBody: "我卡住的不是 TA 穷，是社保断了快两个月，约会账单还在往上堆。",
    dailyShareQuestion: "你会先问失业时间，还是先问 TA 为什么借钱？",
    truth: "失业可以让人慌，恋爱里也可以互相帮一把。但社保断缴先瞒着、信用卡消费照旧、还款再让别人顶，不能靠一句怕分手盖过去。她也要承认，自己吃过那层体面，才会在转不转钱前先怕丢人。"
  });
}

function dailyHouseBoundaryTemplate(brief, names) {
  const name = "咨询者";
  const other = "对方";
  return dailyBaseBrief(brief, names, {
    label: "婚前房与共同还贷",
    storyArcTitle: "今日来电：婚前房与共同还贷",
    publicHook: "婚前房写在 TA 父母名下，却要你婚后一起还贷。你提份额协议，TA 说你太算计。",
    storyArcSummary: "别先吵加名，先问房本、还贷、分开以后钱怎么认。",
    storySuspense: "“你不信任我”这句话很好用，但它不能替共同还贷签字。",
    storyClueObject: "购房合同、父母转账与协议草稿",
    openingComplaint: `${name}连线说：“TA 家婚前买房写父母名下，说婚后我们一起还贷。我提能不能写清份额和退出机制，TA 说我还没结婚就想着离。”`,
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我不是非要房子。婚前房写 TA 父母名下，可婚后又说我们一起还贷才像一家人。", mood: "anxious" },
      { speaker: "你", role: "host", text: "晚上好。合同上写谁、家里怎么说还贷，你从这两处讲。", mood: "listening" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我不是非要加名，我只是想知道我婚后还进去的钱算什么。可 TA 一直说，正常夫妻不会算这么细。",
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
        contradiction: "咨询者把“最好能有个位置”的诉求包装成投入确认；TA 连不加名的投入确认也拒绝。",
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
        contradiction: "TA 把投入确认说成不信任，回避了共同还贷如何被确认的问题。",
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
          { label: "不吉利这三个字", correct: false, feedback: "这三个字好听也好用，但真正要圈的是它挡掉了哪一栏。", routeAxis: "identity-wording" },
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
    dailyShareBody: "我卡住的不是加不加名，是房本在父母名下，还贷却要从共同账户走。",
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
    openingComplaint: `${name}连线说：“我以为快确定关系了。后来他发错了一张预约表，我才发现那张表好像不是在排剪头。”`,
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我想问一个相亲后暧昧了几个月的人。他在理发店上班，昨天本来要发预约时间给我，结果发错了一张店里表格。我第一眼以为是预约表，越看越不对。", mood: "anxious" },
      { speaker: "你", role: "host", text: "晚上好。表先放一下，看到表之前，他平时怎么和你相处？", mood: "listening" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "TA 每次下班后都陪我聊天，说只有我能接住 TA 的情绪，还说别人都不懂。我们没正式说男女朋友，可每天聊到凌晨，我就默认是在往那边走。",
        doubt: "没有确认关系，但对方一直给排他式的亲近感。",
        contradiction: "TA 用“只有你懂我”的亲密话术制造排他期待，却没有给明确关系承诺。",
        reliability: "mixed",
        questionOptions: [
          { question: "他有没有说过你们现在到底算什么关系？", answer: "没有。他会说“你跟别人不一样”，但真问到关系，他就说慢慢来。", contradiction: "亲密感很满，关系承诺却一直悬着。", correct: true },
          { question: "话当时没说死，你当时怎么回他的？", answer: "我也怕一问就尴尬。他说我像店里自己人，我听着其实挺受用，就想着再等等。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "后来我翻聊天，发现一个节奏特别明显。他先说“店里压力大”“今晚又被店长说了”，我一心软，他就接让我帮忙发活动、带朋友去剪头，或者问我下次要不要直接办年卡。",
        doubt: "情绪求助后面开始接店里的经营目标。",
        contradiction: "TA 把亲密聊天接到办卡、带客和朋友圈推广上。",
        reliability: "partial",
        questionOptions: [
          { question: "他说压力大之后，最常接什么请求？", answer: "不是只求安慰。聊着聊着就会说，能不能帮他转个活动，或者问我朋友最近要不要剪头。", contradiction: "情绪求助后接商业转化请求。", correct: true },
          { question: "他让你帮店里这些事时，你当时怎么理解你们的关系？", answer: "我以为我们是在一起往前走，也有点享受他把我当自己人，所以帮店里做点事就没细算。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "昨天他发错那张表，我才把前面的事串起来。表头写的是预约，可备注没写“烫发”“修刘海”，写的是“情绪稳定”“办卡意向强”“朋友多”。我那一行后面写着“稳情绪”。",
        doubt: "那张表不像普通客户备注，更像在写每个人能带来什么。",
        contradiction: "TA 把不同对象按情绪价值、办卡意向和客源资源分类管理。",
        reliability: "partial",
        questionOptions: [
          { question: "这张表是在记发型需求，还是在记你们能带来什么？", answer: "现在看是在记人能带来什么。发型需求那一栏反而很空，备注全是能不能安抚、能不能办卡、能不能带朋友。", contradiction: "预约表实际在记录对象可转化的资源。", correct: true },
          { question: "你那一栏为什么会被写成稳情绪？", answer: "可能因为我总听他说店里的事，也很少当场翻脸。他知道我会先安慰他，再帮他想办法。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我拿表问他，他回我：“我从来没说只有你一个。”可我翻聊天，他发过“以后店开起来，你就是老板娘”。这句话不是求婚，可听完以后，他再说办年卡、以后投一点，我就没那么防备。",
        doubt: "没说“只有你”，不代表没有让人往那个方向想。",
        contradiction: "TA 用未来身份暗示制造排他期待，同时保留口头退路。",
        reliability: "partial",
        questionOptions: [
          { question: "他说老板娘之后，有没有马上让你办卡或投店？", answer: "有。那晚后面就聊到年卡，说我以后常来店里也方便。再往后又提过，如果店扩大，我可以先投一点。", contradiction: "未来身份暗示后紧接着出现办卡和投店话题。", correct: true },
          { question: "“老板娘”那句是在什么场合说的？", answer: "是深夜聊天时说的。单看挺甜，可后面接着聊年卡、投店，我就不敢只当甜话听了。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "最让我清醒的是后面那列“下一次推进”。我那行写“年卡已聊，可稳情绪”；另一个女生写“能投店，约饭再谈”；还有一个写“朋友多，带客”。这就不是我一个人的误会了。",
        doubt: "表格不只是备注，还写了下一步怎么把人往店里推进。",
        contradiction: "TA 把不同暧昧对象按可推进资源分层管理。",
        reliability: "partial",
        questionOptions: [
          { question: "这张表是在排员工，还是在排你们这些人下一步怎么推进？", answer: "现在看更像后者。我不是班次，我是“年卡已聊、稳情绪”。另一个也不是班次，是“能投店”“能带客”。", contradiction: "排班表实为暧昧对象资源分层表。", correct: true },
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
          { label: "备注和下一次推进", correct: true, contradiction: "TA 把不同对象按可推进资源分层管理。", feedback: "这不是剪头需求，是把人按能带来什么往下排。", routeAxis: "process-control" },
          { label: "预约时间", correct: false, feedback: "预约时间本身正常，真正不对的是备注里的功能标签。", routeAxis: "document-edge" },
          { label: "店员名字", correct: false, feedback: "名字不够要紧，后面那些“稳情绪”“能投店”才让这张表变了性质。", routeAxis: "outer-thread" }
        ]
      }
    ],
    investigationHooks: [
      {
        id: "tony-other-caller-dm",
        source: "dm",
        surface: "后台进来一条私信",
        title: "另一份同款表",
        triggerContradiction: "TA 把不同对象按可推进资源分层管理。",
        appearsNowBecause: "收麦后，另一个女生把她收到的那张表也发了过来。",
        prompt: "这张同款表里，哪处最该圈？",
        material: "她那栏写着“能投店”，后面跟着“约见朋友、聊分红”。另一栏写“情绪稳住，年卡下次推”。",
        proves: "同一套亲密话术后面接的是不同商业目标。",
        stillCannotProve: "不能证明所有暧昧都假，但能证明他把人按用途往下排。",
        routeAxis: "external-corroboration",
        options: [
          { label: "能投店和聊分红", correct: true, contradiction: "另一个对象也被写进投店推进表，亲密关系被接到商业转化上。", feedback: "这不是只对一个人嘴甜，是每个人后面都接着下一步用途。", routeAxis: "external-corroboration" },
          { label: "她也说被他哄过", correct: false, feedback: "被哄过能说明情绪相似，但这张表真正咬住的是用途分栏。", routeAxis: "caller-credibility" },
          { label: "年卡下次推", correct: false, feedback: "年卡是旧线，新私信更重的是投店和分红已经进表。", routeAxis: "money-flow" }
        ]
      }
    ],
    deepFollowup: {
      question: "那我多问一句，看到排班表里写投店、带客以后，你自己当时为什么还愿意接那些店里的事？",
      answer: "因为我也吃了那个“自己人”的感觉。他说以后店里有我一个位置，我就觉得办卡、转活动、带朋友过去都像在帮我们。现在看，他不承认关系，我也没逼他说清楚，投店、带客这些难听话就被我们一起往后拖了。",
      note: "问到这里，别只问他花不花心，要问他到底把她当谁。"
    },
    stageJudgement: "这不像普通多聊几个人。那张表把“稳情绪”“年卡已聊”“能投店”“带客”写得明明白白。",
    followupTwist: "后续回拨里，另一位女生也发来私信，说她那栏写着“能投店”。直播间这才反应过来，表里排的不是班，是人。",
    dailyShareTitle: "你会从哪一句看出 TA 在养鱼？",
    dailyShareBody: "我卡住的不是暧昧聊天，是排班表里那几栏：情绪稳定、能投店、能带客。",
    dailyShareQuestion: "你觉得“你和别人不一样”算锤吗？",
    truth: "一个人会聊天不等于有问题。但如果同一套“你最懂我”分别发给几个人，后面还接办卡、带客、投店，那就不是普通暧昧了。"
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
    openingComplaint: "咨询者连线说：“我想问下我男朋友的事。我们是相亲认识的，最近聊到见父母，他发了学校、工作、收入截图，后面又补了一张存款证明。我越看越觉得，这事不是一张图的问题。”",
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我想问下我男朋友的事。", mood: "thinking" },
      { speaker: "你", role: "host", text: "晚上好。你们怎么认识的，现在聊到哪一步了？", mood: "listening" },
      { speaker: name, role: "caller", text: "我们是相亲认识的，最近聊到见父母。我之前跟家里说过他名校毕业、条件不错，所以我妈问得比我想象中细。", mood: "thinking" }
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
          { question: "这些截图是什么时候发的，发之前你们怎么说到材料的？", answer: "我没敢直接说“你把截图发来”。是我妈一直说见面前得摸清楚，我夹在中间，只能含糊跟他说：我妈可能会问学校和收入，让他别被问住。第二天他就把几张图发来了。", contradiction: "女方家在见面前就开始核对择偶条件。", correct: true },
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
          { question: "这个好看的版本，是他一个人说出来的吗？", answer: "不全是。介绍人先夸了一层，我跟家里复述时也又好听了一层。他自己也没把 MBA、本科和收入构成一次说清。", contradiction: "体面标签被介绍人、男方和咨询者共同放大。", correct: true },
          { question: "你后来为什么没有跟家里改口？", answer: "我前面已经说他条件不错了，后面再改口，就像我自己也没看清。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "后来我细问才发现，他说的名校毕业不是全假，但具体是读过一个名校 MBA 项目。他之前本科很普通，这段他一开始没主动说。",
        doubt: "名校这句有真东西，但别人听到的可能是另一层意思。",
        contradiction: "男方用名校毕业概括 MBA 项目，本科学历落差被留在了标签外面。",
        reliability: "partial",
        questionOptions: [
          { question: "那张学校图少了哪一边，少的是本科、项目还是学制？", answer: "图上的校名和项目是真的。可他一直说名校毕业，细问才说是 MBA；别人很容易听成本科一路名校。至于本科、项目性质、学制这些，都是后来才补出来的。", contradiction: "男方用真标签保留了别人误会的空间。", correct: true },
          { question: "你知道本科之后，跟家里说了吗？", answer: "没有。我只说他学校那边确实是真的。因为我前面已经把“名校毕业”讲得很好听了，再补一句本科很普通，我怕我妈立刻变脸。", correct: false }
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
          { question: "你问流水，是想确认他到底赚多少？", answer: "是。我嘴上说家里想看稳定，其实我自己也想知道。他到底是收入没那么高，还是钱花到别处去了。", contradiction: "咨询者追流水不只是求安心，也在确认真实收入和婚后钱怎么落地。", correct: true },
          { question: "哪次花销让你觉得不对？", answer: "有次他说这个月奖金刚到，结果吃饭时又反复算团购券，还提醒我停车费能不能 AA。不是不能 AA，是和他说的收入状态放一起有点别扭。", correct: false }
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
        "女方家问流水，不只是怕被骗，也带着婚后工资透明和上交工资的预设。",
        "咨询者把工资管理的要求包装成了确认稳定。"
      ]
    ],
    evidenceCards: [
      { id: "daily-profile-scale", type: "聊天原话", title: "见面前的问题", front: "学校、工作、收入、存款、流水都被提前问到。", detail: "饭还没吃，条件已经先筛了一轮。", targets: ["truthWithGap"], contradiction: "见父母前就要学校、收入、存款和流水，本身已经超过普通寒暄。" },
      { id: "daily-profile-mba", type: "学历材料", title: "名校毕业", front: "细问才知道是 MBA 项目，本科学历没有一起说。", detail: "真标签也能制造过度想象。", targets: ["halfLie"], contradiction: "男方用名校毕业概括 MBA 项目，本科学历落差被留在了标签外面。" },
      { id: "daily-profile-spending", type: "消费细节", title: "收入和花销", front: "口头收入不错，日常小钱却反复算。", detail: "抠门不等于没钱，但会让收入叙事变得别扭。", targets: ["truthWithGap", "sceneHint"], contradiction: "男方声称收入和日常花销、抠门细节不匹配。" },
      { id: "daily-profile-flow", type: "聊天原话", title: "流水和工资卡", front: "对方反问：再问下去，是不是工资卡也要交出来？", detail: "这句刺中女方家没有说出口的工资管理预设。", targets: ["sceneHint"], contradiction: "流水追问背后藏着婚后工资透明和上交工资的预设。" }
    ],
    evidenceChecks: [
      {
        id: "profile-mba-gap",
        title: "学历材料检视",
        prompt: "学校图里最该追哪一块？",
        material: "截图能看到校名和 MBA 项目，但本科、项目性质和学制没有放在一起。",
        options: [
          { label: "本科、项目性质和学制", correct: true, contradiction: "男方用名校毕业概括 MBA 项目，本科学历落差被留在了标签外面。", feedback: "图不一定假，但少的这一块会让“名校毕业”变成另一种听法。", routeAxis: "identity-wording" },
          { label: "截图像不像修过", correct: false, feedback: "现在的问题不是修图，而是真标签只露了好听的那一面。", routeAxis: "document-edge" },
          { label: "介绍人有没有夸张", correct: false, feedback: "介绍人是前因，这张图上要先看少了哪一边。", routeAxis: "caller-credibility" }
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
        proves: "学历只是入口，家里真正追的是收入和婚后工资管理。",
        stillCannotProve: "不能证明男方资料全假，也不能证明女方只是拜金。",
        routeAxis: "external-corroboration",
        options: [
          { label: "后面主要看收入流水", correct: true, contradiction: "学历追问只是入口，家里真正盯的是收入流水和婚后工资管理。", feedback: "这页把女方家没说出口的筛选目的补出来了。", routeAxis: "external-corroboration" },
          { label: "学历先这样说", correct: false, feedback: "这句有用，但它只是过门，后面那句才接到真实诉求。", routeAxis: "identity-wording" },
          { label: "工资最好放一起管", correct: false, feedback: "这句很刺耳，但单圈它会跳过前面为什么一路追流水。", routeAxis: "money-flow" }
        ]
      }
    ],
    deepFollowup: {
      question: "那我多问一句，你自己的家庭经济状况怎么样？你自己一个月工资多少，够花吗？",
      answer: "我自己也不是特别宽裕，所以我才更在意他收入到底落不落地。我嘴上说家里想看稳定，其实我也想知道以后这笔钱是不是能进小家。",
      note: "问到这里，资料真假还在桌上，她自己最在意的钱也上桌了。"
    },
    stageJudgement: "男方不是整套假资料，MBA、收入、存款都有真东西；女方也不只是求个安心，她想看的其实是以后这笔收入能不能进小家。",
    followupTwist: "后续回拨里，咨询者补了一句，她妈原话其实是“以后钱最好放一起管”。这下流水就不只是证明题了。",
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
    openingComplaint: "咨询者连线说：“我想问公司同事欠我一笔垫付款。他发了报销审批截图，说财务已经批了，可钱一直没转给我。我越看越觉得那张图少了一块。”",
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我想问一件公司里的事。上个月部门做客户答谢会，同事让我先垫了场地和礼品钱。后来他发了一张报销截图，可钱一直没回我。", mood: "thinking" },
      { speaker: "你", role: "host", text: "晚上好。为什么一开始是你垫？", mood: "listening" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我一开始也不是完全被迫。我刚进项目组，确实想借这次客户答谢会让老板看到我。更难听一点，我先跟老板说过这次我可以主责，所以听到“署名写你负责”，就先垫了。",
        doubt: "咨询者不是完全被逼，也确实想拿这个表现机会。",
        contradiction: "咨询者先想要主责曝光，同事再把垫付款包装成机会，资金风险被弱化。",
        reliability: "mixed",
        questionOptions: [
          { question: "他让你垫钱时，原话有没有提署名和老板？", answer: "有。他说这次答谢会缺个执行负责人，如果我先垫场地和礼品费，复盘材料里可以写我主责。我没说的是，我前面已经跟老板表过态，想接这个活。", contradiction: "咨询者先向老板表态想主责，同事借这个把垫款包装成机会。", correct: true },
          { question: "他说主责署名的时候，你为什么先答应垫？", answer: "我也确实想要这个主责，所以没有第一时间追垫款流程。可想表现不等于默认钱可以一直卡着。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我后来才想起来，活动前他让我别在大群里问预算，说客户答谢会临时调整太多，先私下把事办成，复盘再补流程。我也怕在大群问预算，会显得我前面说能主责是嘴硬。",
        doubt: "私下垫款不是偶然，它先绕开了公开预算确认。",
        contradiction: "同事让咨询者避开大群预算确认，把垫款放进私下流程。",
        reliability: "partial",
        questionOptions: [
          { question: "他为什么不让你在大群确认预算？", answer: "他说大群里问预算，会显得我不担事，老板会觉得我推活。不如先私下办成，复盘时再补流程。现在回头看，他拿住的就是我想表现又怕露怯。", contradiction: "同事借表现压力阻止公开确认预算。", correct: true },
          { question: "你如果当时在群里问，会不会真的影响观感？", answer: "可能会显得我不够爽快。但至少钱是谁批、谁还、谁对接供应商，会留下记录。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "他后来发给我的那张图，抬头是“报销审批通过”。我当时以为等于钱已经到了，可仔细看下面没有付款流水，也没有收款账户。",
        doubt: "审批通过看着像结束了，其实还差付款那一步。",
        contradiction: "报销截图只显示审批通过，没有付款流水和收款账户。",
        reliability: "partial",
        questionOptions: [
          { question: "这张审批图少了哪一边，是付款状态还是收款账户？", answer: "图上确实写着审批通过。但下面没有付款状态，也没露收款账户。它只能证明公司同意报销，不能证明钱已经打出去，更不能证明打给了谁。", contradiction: "审批截图缺少付款状态和收款账户，不能证明钱已到账。", correct: true },
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
          { question: "供应商返款打给谁，和你的垫付款是不是同一条钱路？", answer: "供应商群里说返款统一打给对接人，对接人是他。也就是说，我垫出去的钱、公司报销的钱、供应商那笔返款，最后都绕到他手里。", contradiction: "同事同时控制报销入口和供应商返款入口。", correct: true },
          { question: "你问过这笔服务协调费是不是正常报价吗？", answer: "问过。他说可能就是正常报价。可他不让我问财务，也不说返款怎么处理，我就没法只按正常报价理解。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "复盘材料出来以后，主责那栏确实写了我，但付款对接人和供应商确认人都还是他。也就是说，出问题时我像负责人，拿钱时入口还在他手里。",
        doubt: "署名给了表面责任，关键入口仍在同事手里。",
        contradiction: "咨询者拿到项目署名，却没有拿到付款和供应商入口。",
        reliability: "partial",
        questionOptions: [
          { question: "主责署名和付款入口，最后在同一个人手里吗？", answer: "不在。复盘报告写我主责，看起来是我负责；可付款对接、供应商确认、返款入口都在他那边。出事先问我，钱什么时候回却要看他。", contradiction: "项目责任和资金入口被拆给不同人。", correct: true },
          { question: "主责写了你以后，你为什么反而更慌？", answer: "一开始我觉得也算值。可钱没回来以后，主责反而像风险，出了问题大家会先问我为什么私下垫。", correct: false }
        ]
      }
    ],
    evidenceCards: [
      { id: "daily-work-repay-approval", type: "报销截图", title: "审批通过页", front: "截图只露出“审批通过”，没有付款状态和收款账户。", detail: "审批通过不等于钱已到账。", targets: ["truthWithGap"], contradiction: "审批截图缺少付款状态和收款账户，不能证明钱已到账。" },
      { id: "daily-work-repay-chat", type: "群聊原话", title: "署名和垫款", front: "“你先顶上，复盘材料里可以写你主责。”", detail: "表现机会和资金风险被放在同一句话里。", targets: ["sceneHint"], contradiction: "垫付款被包装成项目署名机会，资金风险被弱化。" },
      { id: "daily-work-repay-vendor", type: "报价单", title: "服务协调费", front: "礼品报价里出现服务协调费，供应商群里提到返款给对接人。", detail: "返款流向决定这事是慢报销，还是有人截住入口。", targets: ["truthWithGap"], contradiction: "同事同时控制报销入口和供应商返款入口。" }
    ],
    evidenceChecks: [
      {
        id: "work-approval-missing",
        title: "审批截图检视",
        prompt: "这张审批图最该让对方补哪一页？",
        material: "截图只露出“审批通过”。下面没有付款状态，也没有收款账户。",
        options: [
          { label: "付款状态和收款账户", correct: true, contradiction: "审批截图缺少付款状态和收款账户，不能证明钱已到账。", feedback: "审批通过不是到账，缺的这一页才决定钱去了哪里。", routeAxis: "document-edge" },
          { label: "活动现场照片", correct: false, feedback: "活动办没办不是当前缺口，钱有没有打出去才是。", routeAxis: "outer-thread" },
          { label: "老板有没有看到复盘", correct: false, feedback: "复盘能证明署名，证明不了垫付款有没有回。", routeAxis: "identity-wording" }
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
          { label: "返给对接人", correct: true, contradiction: "供应商返款按老规矩返给对接人，资金入口仍在同事手里。", feedback: "这句把审批截图和供应商那条钱路接上了。", routeAxis: "external-corroboration" },
          { label: "按老规矩", correct: false, feedback: "老规矩很可疑，但要先圈出钱最后返给谁。", routeAxis: "process-control" },
          { label: "付款确认页没发", correct: false, feedback: "这点前面已经咬过，补话新增的是返款落点。", routeAxis: "document-edge" }
        ]
      }
    ],
    deepFollowup: {
      question: "那我多问一句，如果今天不只是钱没回来，你最怕这件事在公司里被说成什么？",
      answer: "我最怕他们说我是为了抢署名才私下垫款，流程不规范。我先跟老板说能主责，我也确实想要这个主责；但他用这个让我先刷卡、又拿审批截图挡我，也是真的。",
      note: "问到这里，咨询者想表现是真的，被人拿这个点压着先垫钱也是真的。"
    },
    stageJudgement: "这不只是同事欠钱。审批图、主责署名、垫付款、供应商返款全挤在同一个人手里，对方就有办法一直拖。",
    followupTwist: "后续回拨里，财务说审批通过后还要二次付款确认，收款账户填的是同事账户。截图不是假，只是刚好截到最能让人闭嘴的地方。",
    dailyShareTitle: "报销截图都发了，钱为什么还没回来？",
    dailyShareBody: "我卡住的不是审批过没过，是付款状态、收款账户和供应商返款都没露出来。",
    dailyShareQuestion: "你会先问审批截图，还是先问谁拿了项目署名？",
    truth: "职场截图也会只截好看的半张。咨询者想拿表现，所以先垫了；同事拿着审批图和供应商入口不放，所以钱一直回不来。两件事要分开说。",
    premeditated: false,
    premeditatedActorId: null,
    stance: "halfTruth"
  });
}
