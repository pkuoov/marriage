import { dailyBaseBrief } from "./dailyTemplateSupport.js";

export function dailyFakeProfileTemplate(brief, names) {
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
