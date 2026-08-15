import { dailyBaseBrief } from "./dailyTemplateSupport.js";

export function dailyWorkplaceReimbursementTemplate(brief, names) {
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
