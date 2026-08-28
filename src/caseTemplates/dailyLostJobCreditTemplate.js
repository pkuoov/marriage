import { dailyBaseBrief } from "./dailyTemplateSupport.js";

export function dailyLostJobCreditTemplate(brief, names) {
  const name = "咨询者";
  const other = "对方";
  return dailyBaseBrief(brief, names, {
    label: "8 万信用卡周转",
    storyArcTitle: "今日来电：8 万信用卡周转",
    publicHook: "他连续十四个月转给女友一半工资，以为她至少存了十五万；她实际只剩一万一千六百多。现在，他让她先拿八万救信用卡。",
    storyArcSummary: "累计转入、实际余额和男方自己的贷款，要分开看。",
    storySuspense: "他为什么偏偏找她要八万，她又为什么一直不让他看余额？",
    storyClueObject: "信用卡账单与社保断缴截图",
    openingComplaint: `${name}连线说：“我男朋友前几天突然让我帮他垫信用卡，说是短期周转。可我后来对账单才发现，这个窟窿早在他借钱之前就有了。”`,
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我想问下我男朋友的事。我们谈了一年半左右。前几天他突然说信用卡要周转，想让我先替他垫八万。", mood: "anxious" },
      { speaker: "你", role: "host", text: "晚上好。我想问一下，他提钱的时候，原话是怎么讲的？", mood: "listening" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "他先说：“奖金晚发，帮我垫几天。”我真当成手头紧。后来他发了张办材料的截图，我瞄见社保那栏，停了两个多月——那张图还是他上个月办材料时截的。可他每天还跟我说加班。那张图我盯了半天，没回他。",
        doubt: "说是奖金晚发，可社保已经断缴两个月。",
        contradiction: "对方 一边说奖金延迟，一边在失业后继续刷体面消费，说明资金缺口不是临时才出现。",
        reliability: "mixed",
        questionOptions: [
          { question: "他开口借钱之前，有没有跟你说过工作最近不稳定？", answer: "没有。他之前一直说最近忙、加班多。要不是那张截图，我还以为他每天真在公司耗着。", contradiction: "社保断缴早于借钱，失业不是突然发生。", correct: true },
          { question: "你当时有没有起疑心？", answer: "一开始没有。我还替他想，是不是压力太大了，先把我稳住再说。可后来越对越不对，失业到底从哪天开始，他始终没讲清。", correct: false }
        ],
        dialogueOptions: [
          { question: "他当时只说差多少钱吗？", answer: "一开始没有。他就说先帮他垫一下，别让卡逾期。我追问，他才把最低还款那一栏截给我看。", routeAxis: "money-flow", routeTone: "detour" },
          { question: "你当时为什么没接着问工作？", answer: "我怕问重了像查岗。那会儿我还把他当男朋友，不是当一个要对账的人。", routeAxis: "caller-credibility", routeTone: "softening" }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我把那张信用卡账单翻出来才知道，不是小几千，是 8 万出头。大头是餐厅、礼物和两次酒店，都是他安排的那种店。往下还有一笔一万二的分期，写着什么短视频平台，我没细看，反正也是他手机上弄的。",
        doubt: "金额、用途和时间都比“垫几天”重得多。",
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
        version: "我后来又对了一遍日期。他第一次说周转那天，账单还有三天才到期。他先催我“今晚就要”，后面又改成“这几天都行”。我问急什么，他回我一句：“我只是怕你知道我失业后就离开我。”语音一停，最低还款金额就发过来了。",
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
        version: "还有一句我没好意思说。他提过，如果这次我不帮，以后可能连结婚都不敢跟我谈，会一直觉得低我一头。我前面也没说全。那周我们刚吃过很贵的纪念日晚餐，店是我用会员号订的，朋友圈也是我发的。我以前总跟朋友夸他对我好。真到他没工作的时候，他头一回开口，我马上说不行，我自己也觉得难看。",
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
      { id: "daily-credit-card-bill", type: "账单", title: "信用卡账单", front: "约四万用于两人的餐厅、酒店、礼物和短视频设备，能看清的男方个人男装约五千，至少三万五未说明。", detail: "一件大衣两千多不能单独证明个人挥霍；咨询者开场也没有主动提共同消费里自己的那一份。", targets: ["sceneHint"], contradiction: "咨询者只追着男方的五千元男装发问，却省略了金额更大的共同消费。" },
      { id: "daily-credit-chat", type: "聊天", title: "最低还款请求", front: "“你先帮我垫一下，我不想这段关系因为钱毁了。”", detail: "把债务包装成关系考验。", targets: ["truthWithGap"], contradiction: "还款请求把个人债务包装成关系考验。" }
    ],
    evidenceChecks: [
      {
        id: "credit-after-layoff-spend",
        title: "账单检视",
        prompt: "这张信用卡账单里，哪一块最该先圈出来？",
        material: "社保断缴后，同一张卡上继续出现纪念日晚餐、礼物分期、两次酒店，还有一笔 1.2 万的短视频平台分期。",
        options: [
          { label: "断缴后的餐厅、礼物和酒店消费", correct: true, contradiction: "8 万信用卡主要花在餐厅、礼物和酒店，不是房租医疗这类急事。", feedback: "圈到这里，“临时垫几天”就没那么轻了。社保断了，吃住玩还在往卡上走。", routeAxis: "money-flow" },
          { label: "最低还款金额本身很高", correct: false, feedback: "金额高当然可疑，但这张账单更要先看：钱是在失业后怎么继续刷出来的。", routeAxis: "money-flow" },
          { label: "那笔 1.2 万的短视频平台分期", correct: false, feedback: "这笔名目是怪，可单看它定不了性。断缴之后还在刷的吃住玩，才把“垫几天”压垮。", routeAxis: "document-edge" },
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
    truth: "两边都少说了。男方早已失业，却继续替两个人的排场刷卡，还把三天后的还款说成今晚就要；贷款和至少三万五的去向仍由他解释。咨询者开场只盯着约五千的男装，却没提约四万共同消费，也没有说清设备和账号由谁受益。一件大衣两千多不能证明男方个人挥霍，她参与过消费也不等于要替他还八万。"
  });
}
