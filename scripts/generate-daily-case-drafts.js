import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = parseArgs(process.argv.slice(2));
const inputPath = resolve(root, args.input ?? args.in ?? await latestIntelligencePath());
const outPath = resolve(root, args.out ?? ".local/daily-intelligence/story-pack-case-drafts.json");

const intelligence = JSON.parse(await readFile(inputPath, "utf8"));
const sourceCards = (intelligence.cards ?? [])
  .filter((card) => (card.conflictTypes ?? []).length)
  .slice(0, Number(args.limit ?? 16));
const drafts = buildCompositeDrafts(sourceCards, Number(args.cases ?? 4));

const payload = {
  generatedAt: new Date().toISOString(),
  sourceFile: inputPath.replace(`${root}/`, ""),
  draftCount: drafts.length,
  drafts
};

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Story-pack candidate case drafts written: ${outPath}`);

function buildCompositeDrafts(cards, caseCount) {
  const used = new Set();
  return cards.slice(0, caseCount).map((primary, index) => {
    const supporting = pickSupportingCards(primary, cards, used, 3);
    [primary, ...supporting].forEach((card) => used.add(card.id));
    return buildDraft([primary, ...supporting], index);
  });
}

function pickSupportingCards(primary, cards, used, count) {
  const primaryConflicts = new Set(primary.conflictTypes ?? []);
  const candidates = cards
    .filter((card) => card.id !== primary.id && !used.has(card.id))
    .map((card) => ({
      card,
      score:
        (card.sourceLabel !== primary.sourceLabel ? 2 : 0) +
        (card.conflictTypes ?? []).filter((item) => !primaryConflicts.has(item)).length +
        (card.talkTracks ?? []).length +
        (card.countermeasures ?? []).length
    }))
    .sort((a, b) => b.score - a.score || String(a.card.id).localeCompare(String(b.card.id)));
  return candidates.slice(0, count).map((item) => item.card);
}

function buildDraft(cards, index) {
  const primary = cards[0] ?? {};
  const conflicts = unique(cards.flatMap((card) => card.conflictTypes ?? []));
  const countermeasures = unique(cards.flatMap((card) => card.countermeasures ?? []));
  const talkTracks = unique(cards.flatMap((card) => card.talkTracks ?? []));
  const conflict = primary.abstraction?.conflict ?? conflicts[0] ?? "关系叙事争议";
  const countermeasure = primary.abstraction?.countermeasure ?? countermeasures[0] ?? "事实核验";
  const talkTrack = primary.abstraction?.talkTrack ?? talkTracks[0] ?? "第一版叙事";
  const theme = themeForConflict(conflict);
  return {
    id: `draft-${String(index + 1).padStart(2, "0")}-${slugify(conflict)}`,
    status: "needs-human-review",
    basedOnCardIds: cards.map((card) => card.id),
    primarySourceLabel: primary.sourceLabel,
    sourceLabels: unique(cards.map((card) => card.sourceLabel).filter(Boolean)),
    sourceUrls: cards.map((card) => card.sourceUrl).filter(Boolean),
    contentBoundary: "只使用多条热点的抽象结构，不使用真实人物、完整案情、原视频原话或可识别时间线。",
    hotspotFusion: {
      rule: "一个候选案至少融合 2-4 张热点卡：主冲突给案件骨架，其他卡只提供话术、材料形态、误读风险或第三方压力。",
      primaryConflict: conflict,
      supportingSignals: {
        conflicts: conflicts.filter((item) => item !== conflict),
        countermeasures,
        talkTracks
      },
      originalityGuard: "合成后必须换人物、换关系阶段、换材料触发、换金额和推进顺序；不能让任何单一来源还原出原案。"
    },
    singleCallerContract: [
      "单案只有主播和一个匿名咨询者在直播间，可作为四案故事集的一通来电。",
      "sceneVersions 必须全部由咨询者说出，满格 deepFollowup.answer 也必须是咨询者第一人称回答。",
      "另一方只能作为咨询者转述、聊天截图、录音、账单、合同或第三方匿名留言出现。",
      "材料不能自己当说话人；不要写“后台账单”“回拨新情况”“主播记事”直接插入流程。"
    ],
    storyPackHook: compositeHook(cards, conflict, countermeasure, talkTrack),
    caseTitle: titleForConflict(conflict, countermeasure),
    openingComplaint: openingForTheme(theme, countermeasure, talkTrack),
    materialTrigger: materialTriggerForTheme(theme),
    dramaticAnchor: dramaticAnchorForTheme(theme, countermeasure),
    grayZonePush: grayZonePushForTheme(theme),
    scriptGenerationModel: scriptGenerationModelForTheme(theme, conflict),
    integratedStoryPacket: integratedStoryPacketForTheme(theme, conflict, countermeasure, talkTrack),
    coreDispute: `${conflict}：${countermeasure}到底是在保护边界，还是被用来转移成本/控制对方。旁支热点只负责提供材料和话术，不抢主案。`,
    questionRoutes: routesForTheme(theme, unique(cards.flatMap((card) => card.playableQuestions ?? []))),
    deepFollowupPrompt: deepFollowupForTheme(theme),
    possibleResultProfiles: profilesForTheme(theme),
    evidenceCards: evidenceForTheme(theme, countermeasure),
    shareQuestion: shareQuestionForTheme(theme),
    reviewerChecklist: [
      "是否已去除真实姓名、账号、地点、机构和独特时间线？",
      "是否保持单人匿名连线，没有另一方直接上麦？",
      "sceneVersions 和 deepFollowup.answer 是否全部由咨询者讲出，材料是否由咨询者拿出或念出？",
      "是否保留了反制方式被正确使用、被曲解、被滥用三种可能？",
      "是否有一个具体戏剧物件/原话/动作，而不是只有抽象冲突？",
      "关键物件是谁推出来的是否存在灰区：咨询者、对方、父母、朋友、平台或双方压力？",
      "是否先写成一通完整电话，再拆成 openingDialogue / sceneVersions / questionOptions / deepFollowup？",
      "每个选项和反馈是否都回到同一个压力系统，没有突然跳去泛情感问题？",
      "是否能支撑至少 20 分钟玩法：5-6 个关键来电段、满格深问、最终挑句和复盘？",
      "是否避免把法律/心理建议写成确定结论？"
    ]
  };
}

function compositeHook(cards, conflict, countermeasure, talkTrack) {
  const hooks = cards.map((card) => card.hook).filter(Boolean);
  if (hooks.length >= 2) return `${hooks[0]} 另一条热议里也出现了${countermeasure || talkTrack || conflict}，这次把两种压力拧到同一通电话里。`;
  return hooks[0] ?? buildHook([conflict], [countermeasure], [talkTrack]);
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function integratedStoryPacketForTheme(theme, conflict, countermeasure, talkTrack) {
  return {
    generationRule: "先写最终争点和完整通话，再拆字段；任何动机/面子/证明用途变化都要重跑本包。",
    endingFirst: {
      finalAudienceArgument: audienceArgumentForTheme(theme, conflict),
      valueBoundary: "结论必须指向具体行为、成本和责任，不指向性别、职业、年龄或群体标签。",
      noPreachRule: "先让玩家在选择里听出问题，再在复盘里分层说清，不能在来电中提前讲道理。"
    },
    pressureSystem: {
      relationshipStage: relationshipStageForTheme(theme),
      pressurePoint: pressurePointForTheme(theme, talkTrack),
      dramaticAnchor: dramaticAnchorForTheme(theme, countermeasure),
      callerStake: callerStakeForTheme(theme),
      otherStake: otherStakeForTheme(theme),
      thirdPressure: thirdPressureForTheme(theme),
      truthBoundary: truthBoundaryForTheme(theme)
    },
    beatLadder: beatLadderForTheme(theme),
    branchingContract: {
      choiceShape: "每段 2-3 个主播追问；每个都像真人主播会问，但只有部分抓核心。",
      branchReturn: "回答后必须回到下一段咨询者陈述，不允许扫同节点剩余选项。",
      stateTracking: "每个选项必须标 routeAxis、routeTone、是否揭示 core issue。",
      fullHitGate: "5-6 段核心都抓住，才出现一次无选择 deepFollowup。"
    },
    stitchedTranscriptPlan: [
      "opening: 咨询者先讲关系阶段和为什么今天打来；主播只问下一句自然问题；咨询者回答材料为什么出现。",
      "scene-1: 追材料是谁推出来的，反馈必须回答谁的压力进入了对话。",
      "scene-2: 追材料真到哪一层，反馈必须说清露出的部分和没露出的部分。",
      "scene-3: 追对方如何转移问题，反馈必须落在话术、时间或完整信息缺口。",
      "scene-4: 追来电人自己的修剪，反馈必须让咨询者承认自己也保留了有利版本。",
      "scene-5: 追成本/责任落点，反馈必须把本案推向最终挑句。",
      "deepFollowup: 只有满格路线出现，主播只多问一句咨询者自己的利益/面子/误判压力，咨询者第一人称回答。",
      "open: 最终选择设计成两个半答案、一个灰区真答案、一个情绪化误判。"
    ],
    writersRoomPasses: writerRoomPassesForTheme(theme),
    qualityScorecard: qualityScorecard(),
    splitGuard: [
      "不要先填 sceneVersions/deepFollowup 再倒推动机。",
      "不要把一个好句子塞进不相邻的场景。",
      "不要让 outer angle 跳出核心争议；外围角度只能偏窄、偏情绪或偏半边责任。",
      "share copy 只抛争议，不公布完整结论。"
    ],
    mainAudienceArgument: audienceArgumentForTheme(theme, conflict)
  };
}

function scriptGenerationModelForTheme(theme, conflict) {
  return {
    methodSources: [
      "screenplay beat outline: setup -> pressure -> reversal -> cost -> resolution",
      "Pixar-style ending-first story spine: know the final argument before drafting middle beats",
      "Ink/Twine-style interactive writing: choices branch briefly, then rejoin with state tracked",
      "LLM writers-room workflow: showrunner, case writer, actor-consistency pass, continuity QA pass"
    ],
    showrunnerBrief: {
      theme,
      conflict,
      promise: "玩家会从一句看似合理的话里，问出利益、材料缺口、责任和成本。",
      audienceTaste: "现实、克制、评论区会吵；像是真的，不像短剧硬反转。"
    }
  };
}

function beatLadderForTheme(theme) {
  const base = {
    house: ["共同生活话术出现", "权属与现金流拆开", "共同账户转账压力出现", "咨询者承认怕显得算计", "退出补偿或投入确认被拒绝"],
    trust: ["稳定承诺出现", "受益人/变更权缺口出现", "资金来源或控制权露出", "咨询者承认自己没看懂但怕多疑", "谁能决定钱出来成为责任落点"],
    transfer: ["转账争议出现", "备注和聊天前后文冲突", "用途和受益人出现", "咨询者承认当时有默认或享受体面", "借赠边界落到还款/分手节点"],
    debt: ["短期周转请求出现", "旧账或消费用途露出", "账单期限/情绪压力改变节奏", "咨询者承认怕被说冷血", "债务责任被包装成关系忠诚测试"],
    agreement: ["协议被说成不信任", "条款真实目的出现", "上限或退出缺口出现", "咨询者承认恐惧和控制欲的边界", "保护边界还是压人落到具体条款"],
    emotion: ["安全感话术出现", "条件跟在情绪承诺后面", "资源/消费/身份收益出现", "咨询者承认自己也被承诺打动", "谁付出谁受益落到下一步要求"],
    verification: ["材料被提前索取或展示", "材料边缘缺失", "收入/身份/流程的利益路径出现", "咨询者承认自己也在借他人口吻筛选", "最终落到成本、工资、家庭或关系推进"]
  };
  const beats = base[theme] ?? base.verification;
  return beats.map((beat, index) => ({
    beat: index + 1,
    purpose: beat,
    requiredOutput: "caller statement + 2-3 host questions + caller feedback + route metadata"
  }));
}

function writerRoomPassesForTheme(theme) {
  return [
    {
      role: "Showrunner Agent",
      pass: "检查本集主题是否能穿过四案，不靠性别对立制造热度。"
    },
    {
      role: "Case Writer Agent",
      pass: "先写 ending-first argument 和五段 beat ladder，再写 stitched transcript。"
    },
    {
      role: "Actor Consistency Agent",
      pass: "分别替咨询者、对方、第三方压力回答：这句话保护了谁的面子、钱、责任或退路？"
    },
    {
      role: "Branch Designer Agent",
      pass: "检查每段选项是否都有真人会点，是否只改变揭示程度和路线倾向，不破坏主线。"
    },
    {
      role: "Continuity QA Agent",
      pass: "串读 opening、5-6 段来电、deepFollowup、最终原话、复盘，查跳步、提前剧透和未披露事实。"
    }
  ];
}

function qualityScorecard() {
  return [
    "结构 0-2：是否有 5-6 段完整 beat ladder。",
    "冲突 0-2：每段是否新增压力，而不是重复同一个疑点。",
    "角色 0-2：咨询者、对方、第三方压力是否各自有利益。",
    "互动 0-2：每个选项是否像主播会问的话，且后果不同。",
    "回收 0-2：分支是否回到主线而不造成断裂。",
    "现实 0-2：是否像评论区会吵的真实公共事件。",
    "价值 0-2：是否打击具体坏行为，不制造性别或群体对立。",
    "低于 10 分不得入库；任一项 0 分必须重写。"
  ];
}

function themeForConflict(conflict) {
  if (/房产|洗房/.test(conflict)) return "house";
  if (/信托|保险/.test(conflict)) return "trust";
  if (/恋爱转账/.test(conflict)) return "transfer";
  if (/债务/.test(conflict)) return "debt";
  if (/协议/.test(conflict)) return "agreement";
  if (/多线|情绪/.test(conflict)) return "emotion";
  return "verification";
}

function titleForConflict(conflict, countermeasure) {
  const titles = {
    house: "婚前房不加名，但要你一起还贷，算不算洗房？",
    trust: "TA 拿出信托/保险安排，真正该问谁是受益人？",
    transfer: "恋爱转账写了备注，到底是借款还是赠与？",
    debt: "TA 说只是短期周转，为什么账本像在转嫁债务？",
    agreement: "婚前协议被说成不信任，是保护还是控制？",
    emotion: "一句安全感后面，接的是沟通还是条件？",
    verification: `${countermeasure}背后，开场那几句少了哪一块？`
  };
  return titles[themeForConflict(conflict)] ?? titles.verification;
}

function openingForTheme(theme, countermeasure, talkTrack) {
  const lines = {
    house: `咨询者说：主播你好，我不是非要房子。对方家婚前买房写父母名下，却希望婚后用共同账户还贷。我提出${countermeasure}，对方说这是${talkTrack}。`,
    trust: `咨询者说：主播你好，对方拿出一份资产安排，里面有信托、保险或受益人结构。我听不懂，只听见对方说这是为了未来稳定。`,
    transfer: `咨询者说：主播你好，恋爱期间有几笔转账。对方说是自愿表达，可我记得其中几笔明明是借款，聊天记录和备注开始互相打架。`,
    debt: `咨询者说：主播你好，对方突然需要短期周转，可我把账单、征信和消费记录放一起看，发现问题可能不是这个月才发生。`,
    agreement: `咨询者说：主播你好，我只是想婚前说清楚房、钱和退出机制，对方却把协议说成不信任和太算计。`,
    emotion: `咨询者说：主播你好，对方一直讲安全感、诚意和态度，但每次情绪升温后都会出现一个新的条件。`,
    verification: `咨询者说：主播你好，开场听着很完整，但我手里那份材料有一块刚好被裁掉。`
  };
  return lines[theme] ?? lines.verification;
}

function materialTriggerForTheme(theme) {
  const triggers = {
    house: "咨询者手里有合同照片、共同账户计划或协议草稿；材料出现是因为双方已经聊到婚后钱怎么出。",
    trust: "咨询者手里有资产安排截图或条款页；材料出现是因为对方想先证明安排合理、说服 TA 接受。",
    transfer: "咨询者手里有转账备注和聊天前后文；材料出现是因为分手/催还/翻旧账时双方说法冲突。",
    debt: "咨询者手里有账单、征信或还款短信；材料出现是因为对方要求 TA 先垫钱或共同周转。",
    agreement: "咨询者手里有协议草稿；材料出现是因为双方准备进入同居、订婚、领证或共同出资阶段。",
    emotion: "咨询者手里有聊天截图或条件变更记录；材料出现是因为情绪承诺后接了新要求。",
    verification: "咨询者手里有被裁切/遮挡的截图；材料出现是因为对方想先证明条件或诚意，说服 TA 或家里放心。"
  };
  return triggers[theme] ?? triggers.verification;
}

function dramaticAnchorForTheme(theme, countermeasure) {
  const anchors = {
    house: `一页合同、共同账户表或${countermeasure}草稿，最好卡在父母出资和婚后还贷之间。`,
    trust: `一张受益人页、保单截图或资产安排截图，最好卡在“为未来好”和“谁控制钱”之间。`,
    transfer: "一笔备注暧昧的转账、催还截图或共同消费账单，最好卡在借款和赠与之间。",
    debt: "一张账单、征信截图、最低还款短信或礼物分期记录，最好卡在困难和转嫁之间。",
    agreement: `一份${countermeasure}草稿，最好卡在保护边界和控制对方之间。`,
    emotion: "一句被截图的原话、条件变更记录或第三方建议，最好卡在爱和要求之间。",
    verification: "一张被裁切的资料、存款证明或工作/学历截图，最好卡在证明诚意和被家里筛选之间。"
  };
  return anchors[theme] ?? anchors.verification;
}

function grayZonePushForTheme(theme) {
  const pushes = {
    house: "不要写成单方要房。写清楚是父母出资、共同账户、婚后计划、咨询者安全感共同把协议推出来。",
    trust: "不要写成单方炫资产。写清楚是婚前承诺、家族安排、未来稳定话术共同把复杂结构推出来。",
    transfer: "不要写成单方骗钱。写清楚是恋爱表达、分手翻账、聊天备注和双方默认共同把争议推出来。",
    debt: "不要写成单方借钱。写清楚是体面消费、同情、关系压力和短期周转共同把垫付推出来。",
    agreement: "不要写成单方算计。写清楚是边界、恐惧、家庭意见和对方反应共同把条款推出来。",
    emotion: "不要写成单方 PUA。写清楚是情绪需求、承诺期待、第三方建议和现实条件共同把要求推出来。",
    verification: "不要写成单方造假。写清楚是父母追问、咨询者转述、对方体面展示共同把证明推出来。"
  };
  return pushes[theme] ?? pushes.verification;
}

function relationshipStageForTheme(theme) {
  const stages = {
    house: "谈婚后居住、共同账户或装修还贷前后。",
    trust: "谈婚前承诺、长期保障或家族资产安排时。",
    transfer: "分手、催还、翻旧账或共同消费结算时。",
    debt: "对方提出周转、垫付或共同承担账单时。",
    agreement: "同居、订婚、领证或共同出资前。",
    emotion: "暧昧升温、承诺关系或提出新条件后。",
    verification: "相亲推进到见父母、确认条件或替对方向家里介绍前。"
  };
  return stages[theme] ?? stages.verification;
}

function pressurePointForTheme(theme, talkTrack) {
  const points = {
    house: `父母出资、婚后还贷和“${talkTrack}”的说法同时出现。`,
    trust: `稳定承诺、复杂条款和“${talkTrack}”的说法同时出现。`,
    transfer: `感情表达、金额备注和“${talkTrack}”的说法同时出现。`,
    debt: `短期困难、体面消费和“${talkTrack}”的说法同时出现。`,
    agreement: `边界保护、关系信任和“${talkTrack}”的说法同时出现。`,
    emotion: `安全感、承诺和“${talkTrack}”的说法同时出现。`,
    verification: `家里追问、咨询者转述和“${talkTrack}”的体面展示同时出现。`
  };
  return points[theme] ?? points.verification;
}

function callerStakeForTheme(theme) {
  const stakes = {
    house: "咨询者可能怕自己显得算计，也怕婚后现金流被悄悄推走。",
    trust: "咨询者可能怕显得不懂或多疑，也怕复杂结构先被对方定义成安全感。",
    transfer: "咨询者可能怕承认自己当时默认过，也怕钱被改写成自愿表达。",
    debt: "咨询者可能怕显得冷血，也怕自己的同情变成默认接债。",
    agreement: "咨询者可能怕被说太算，也怕不说清后失去退出空间。",
    emotion: "咨询者可能怕承认自己被承诺打动，也怕对方把需求包装成爱。",
    verification: "咨询者可能怕自己跟家里夸过头后打脸，也怕承认自己借家人口吻在筛选。"
  };
  return stakes[theme] ?? stakes.verification;
}

function otherStakeForTheme(theme) {
  const stakes = {
    house: "对方可能想保住产权叙事，同时让婚后现金流自然进入房子。",
    trust: "对方可能想把控制权藏在专业结构里，同时先获得信任。",
    transfer: "对方可能想把金额说成感情表达，避开具体用途和还款节点。",
    debt: "对方可能想把旧账说成短期困难，先拿到周转。",
    agreement: "对方可能想把不利条款包装成安全感，或把合理边界说成不信任。",
    emotion: "对方可能想用专属承诺换取情绪、消费、资源或让步。",
    verification: "对方可能想用局部真实的材料降低追问，让见面或关系推进先发生。"
  };
  return stakes[theme] ?? stakes.verification;
}

function thirdPressureForTheme(theme) {
  const pressure = {
    house: "父母出资、未来共同居住或亲戚意见可能参与推动。",
    trust: "家族安排、保险/理财顾问或长辈意见可能参与推动。",
    transfer: "朋友建议、分手舆论或双方共同朋友圈可能参与推动。",
    debt: "催收、账单日、朋友借钱或体面社交可能参与推动。",
    agreement: "父母意见、婚期压力或共同生活计划可能参与推动。",
    emotion: "朋友建议、红娘话术、平台教程或同伴比较可能参与推动。",
    verification: "父母筛选、相亲介绍人、饭局时间和咨询者自己的转述可能参与推动。"
  };
  return pressure[theme] ?? pressure.verification;
}

function truthBoundaryForTheme(theme) {
  const boundaries = {
    house: "产权、首付、还贷、装修可能各有一部分是真的，但风险在现金流和退出补偿。",
    trust: "资产安排可能真实，但受益人、变更权和资金来源决定含义。",
    transfer: "转账可能真实发生，但备注、用途和关系节点决定借赠边界。",
    debt: "困难可能真实，但旧账、消费和偿还计划决定是否转嫁。",
    agreement: "保护条款可能合理，但上限、退出和惩罚条款决定是否控制。",
    emotion: "情绪可能真实，但后续条件和资源交换决定是否被运营。",
    verification: "学校、工作、收入、存款可能都真一部分，但缺失边缘决定标签含金量。"
  };
  return boundaries[theme] ?? boundaries.verification;
}

function audienceArgumentForTheme(theme, conflict) {
  const argumentsByTheme = {
    house: "这是合理算清楚，还是只隔离产权不隔离成本？",
    trust: "这是安全安排，还是把控制权藏进专业词里？",
    transfer: "这是恋爱表达，还是事后改写账目？",
    debt: "这是共渡难关，还是把旧账转给关系？",
    agreement: "这是边界，还是借边界控制对方？",
    emotion: "这是爱里的需求，还是用承诺换资源？",
    verification: "这是证明诚意，还是双方都借体面材料往前推？"
  };
  return argumentsByTheme[theme] ?? `${conflict}到底是哪一边先被说偏了？`;
}

function routesForTheme(theme, playableQuestions) {
  const routeBank = {
    house: [
      route("问权属", "确认房本、首付来源和买受人。", "拿到产权与出资结构。", "资产边界型侦探"),
      route("问还贷", "确认婚后共同账户是否承担房贷/装修。", "拿到现金流和补偿缺口。", "资金流侦探"),
      route("问情绪", "追问对方为何把协议说成不信任。", "拿到话术，但可能漏掉权属。", "同情心先行型")
    ],
    trust: [
      route("问受益人", "确认信托/保险真实受益人和变更权限。", "拿到控制权线索。", "资产结构侦探"),
      route("问资金来源", "确认保费、注入资产和婚后收入是否混同。", "拿到现金流线索。", "资金流侦探"),
      route("问安全感", "追问复杂结构为何必须婚前接受。", "拿到话术和压力。", "话术识别型侦探")
    ],
    transfer: [
      route("问备注", "逐笔核对备注、聊天前后文和金额。", "拿到借赠争议线索。", "资金流侦探"),
      route("问用途", "确认转账是否进入共同消费或个人支出。", "拿到收益路径。", "责任边界型"),
      route("问分手节点", "确认最后一笔钱和关系状态。", "拿到时间线缺口。", "时间线侦探")
    ],
    agreement: [
      route("问条款", "拆分保护条款、控制条款和惩罚条款。", "拿到协议性质。", "边界清醒型"),
      route("问上限", "确认补偿或份额是否有边界。", "拿到是否借规则压人的线索。", "资产边界型侦探"),
      route("问情绪", "追问为什么核验会被说成伤感情。", "拿到不信任话术。", "话术识别型侦探")
    ],
    default: [
      route("问时间线", "把关键说法放回日期。", "拿到时间缺口。", "时间线侦探"),
      route("问钱和资源", "确认谁付出、谁受益、谁承担风险。", "拿到收益路径。", "资金流侦探"),
      route("问情绪动机", "确认委屈背后接了什么要求。", "拿到话术线索。", "话术识别型侦探")
    ]
  };
  const routes = routeBank[theme] ?? routeBank.default;
  return routes.map((item, index) => ({
    ...item,
    sourceQuestion: playableQuestions[index] ?? item.route
  }));
}

function route(routeName, question, unlocks, likelyProfile) {
  return { route: routeName, question, unlocks, likelyProfile };
}

function deepFollowupForTheme(theme) {
  const prompts = {
    house: {
      question: "满格后多问：如果以后分开，婚后还进去的钱准备怎么算？",
      answerTarget: "咨询者说出自己真正怕的是现金流退出没有位置，而不只是房本加不加名。"
    },
    trust: {
      question: "满格后多问：这份安排里，谁能改受益人，谁能决定钱什么时候出来？",
      answerTarget: "咨询者承认自己一开始被“稳定”安抚，后来才意识到控制权没有在自己这边。"
    },
    transfer: {
      question: "满格后多问：那笔钱第一次被说成感情表达时，你为什么没把账说开？",
      answerTarget: "咨询者说出自己也享受过关系里的体面或承诺，所以后来才更难把账摊开。"
    },
    debt: {
      question: "满格后多问：如果你今天不垫，他自己准备怎么处理？",
      answerTarget: "咨询者分清同情对方的难和替对方接账不是同一件事。"
    },
    agreement: {
      question: "满格后多问：你最怕的是协议本身，还是怕现在不问以后没法退？",
      answerTarget: "咨询者承认自己要的是可退出边界，不只是让对方道歉。"
    },
    emotion: {
      question: "满格后多问：如果不谈安全感，这个条件具体让谁付出、谁受益？",
      answerTarget: "咨询者把情绪承诺翻译成实际资源交换。"
    },
    verification: {
      question: "满格后多问：你自己或你家里真正想通过这些材料确认什么？",
      answerTarget: "咨询者说出自己也在借家人的筛选标准推进关系，而不只是被对方欺骗。"
    }
  };
  return prompts[theme] ?? prompts.verification;
}

function profilesForTheme(theme) {
  if (theme === "trust") return ["资产结构侦探", "资金流侦探", "同情心先行型", "过早站队型"];
  if (theme === "house") return ["资产边界型侦探", "资金流侦探", "话术识别型侦探", "过早站队型"];
  if (theme === "transfer") return ["资金流侦探", "时间线侦探", "责任边界型", "直觉误判型"];
  return ["边界清醒型", "资金流侦探", "话术识别型侦探", "过早站队型"];
}

function evidenceForTheme(theme, countermeasure) {
  const base = {
    house: ["买受人页", "共同账户支出表", "投入确认条款"],
    trust: ["受益人页", "保费/注资流水", "变更权限说明"],
    transfer: ["转账备注", "聊天前后文", "共同消费明细"],
    debt: ["征信/账单", "借款请求聊天", "消费用途明细"],
    agreement: ["协议草稿", "条款上限", "退出机制"],
    emotion: ["聊天截图", "条件变更记录", "第三方建议"],
    verification: ["裁切截图", "原始材料", "核验记录"]
  }[theme] ?? ["关键材料", "时间线", countermeasure];
  return base.map((title) => ({
    title,
    purpose: `用于核验${countermeasure}是否被正确使用或被曲解。`
  }));
}

function shareQuestionForTheme(theme) {
  if (theme === "house") return "你会问房本、首付，还是婚后还贷？";
  if (theme === "trust") return "你会问受益人、资金来源，还是为什么现在要签？";
  if (theme === "transfer") return "你会问备注、用途，还是分手节点？";
  if (theme === "agreement") return "你会问条款、上限，还是对方为什么说不信任？";
  return "你会问时间、钱，还是情绪？";
}

async function latestIntelligencePath() {
  const dir = resolve(root, ".local/daily-intelligence");
  const files = (await readdir(dir)).filter((file) => /^\d{4}-W\d{2}\.json$/.test(file)).sort();
  if (!files.length) throw new Error("No intelligence files found. Run npm run intel:collect first.");
  return `.local/daily-intelligence/${files[files.length - 1]}`;
}

function slugify(text) {
  return stableHash(text);
}

function stableHash(text) {
  let hash = 2166136261;
  for (const char of String(text)) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      index += 1;
    }
  }
  return parsed;
}
