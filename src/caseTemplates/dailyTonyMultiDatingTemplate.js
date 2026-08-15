import { dailyBaseBrief } from "./dailyTemplateSupport.js";

export function dailyTonyMultiDatingTemplate(brief, names) {
  const name = "咨询者";
  const other = "对方";
  return dailyBaseBrief(brief, names, {
    label: "理发店排班表",
    storyArcTitle: "今日来电：理发店排班表",
    publicHook: "她以为自己快要确定关系，直到对方发错一张店里预约表，备注不像剪头，倒像在给人分类。",
    storyArcSummary: "先保留真实照顾，再看亲近如何被接进年卡、带客和投店。",
    storySuspense: "她做了一年多普通顾客，最近几个月才觉得关系变了；发错的表却把这种亲近写成可利用的顾客特征。",
    storyClueObject: "遮名后的理发店私表、标准表与办卡记录",
    openingComplaint: `${name}连线说：“同事推荐我去他店里剪了一年多，最近几个月才变得不像普通顾客。昨晚他发错一张店里的表，我翻到最后一列，突然不知道我们俩到底算什么。”`,
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播，我想问个有点丢人的事。给我剪了一年多头的理发师，昨晚发错一张表。我看了半宿，还是没想明白我们俩到底算什么。", mood: "anxious" },
      { speaker: "你", role: "host", text: "先不急着给关系下名字。你们怎么认识的？", mood: "listening" },
      { speaker: name, role: "caller", text: "一年多前，同事说他剪得好，推荐我去的。最开始就是剪头，最近几个月才越走越近。", mood: "anxious" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我下班晚，他总给我留最后那档。有回店里有人拿我的上班时间开玩笑，他还替我挡了一句。后来他会发语音，说店长又骂他了，最后来一句‘也就你肯听我说这些’。我们没正式在一起，可我听久了，真觉得自己对他不一样。",
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
        version: "昨天他发错那张表，我才把前面的事串起来。表头写的是预约，可发型和项目那几格都是空的，备注写着“稳情绪”“能投店”“朋友多”。我那一行是“稳情绪”。",
        doubt: "那张表不像普通客户备注，更像在写每个人能带来什么。",
        contradiction: "对方把不同顾客按情绪、投店能力和客源资源分类管理。",
        reliability: "partial",
        questionOptions: [
          { question: "这些备注里，哪一项跟剪头有关？", answer: "没有。发型那格是空的。我看到的就是‘稳情绪’‘能投店’‘朋友多’。", contradiction: "预约表实际在记录顾客可转化的资源。", correct: true },
          { question: "你那一栏为什么会被写成稳情绪？", answer: "可能因为我总听他说店里的事，也很少当场翻脸。他知道我会先安慰他，再帮他想办法。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "昨晚收到那张表，我马上问他是什么意思。他只回了一句：“我从来没说只有你一个。”可他以前明明发过“以后店开起来，你就是老板娘”。我知道那不是求婚，可听了这句话，他再提年卡、再问我要不要投一点，我确实没那么防着他。",
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
        version: "我后来盯着最后那列看了很久：“下一次推进”。我那行写“年卡已聊，可稳情绪”；下面是“能投店，约饭再谈”；还有一个写“朋友多，带客”。",
        doubt: "表格不只是备注，还写了下一步怎么把人往店里推进。",
        contradiction: "对方把不同顾客按可转化资源分层管理。",
        reliability: "partial",
        questionOptions: [
          { question: "先看你自己那行。他下一步想让你做什么？", answer: "办年卡。那一行不是在约我下次剪头。", contradiction: "私人表把她的下一步写成年卡，不是服务预约。", correct: true },
          { question: "有没有可能只是店里玩笑备注？", answer: "如果只有我一个名字，我还能骗自己是玩笑。但每个人后面都接一个功能，还写下一次怎么推进，我就没法只当玩笑了。", correct: false }
        ]
      }
    ],
    evidenceCards: [
      { id: "daily-tony-roster", type: "排班表", title: "理发店预约表", front: "备注列写着“稳情绪 / 能投店 / 朋友多”。", detail: "这些备注不像剪发需求，更像每个人能带来的东西。", targets: ["truthWithGap", "sceneHint"], contradiction: "排班表显示多名顾客被按可转化价值分类。" },
      { id: "daily-tony-chat-copy", type: "聊天截图", title: "相似称呼与不同请求", front: "不止一名熟客收到过‘自己人’或‘你和别人不一样’一类称呼。", detail: "这些称呼后面出现过办卡、投店或带朋友。", targets: ["halfLie"], contradiction: "相似的亲密称呼被接到不同商业目标。" },
      { id: "daily-tony-card", type: "消费记录", title: "老板娘与年卡", front: "‘老板娘’玩笑后几天再次出现年卡，之后又提过新店投入。", detail: "未来称呼后面接上具体消费和投钱话题。", targets: ["sceneHint"], contradiction: "未来称呼后紧接消费与投钱话题。" }
    ],
    evidenceChecks: [
      {
        id: "tony-roster-column",
        title: "排班表检视",
        prompt: "这张表里哪一列不像预约表？",
        material: "表头写预约，备注却写着“稳情绪”“能投店”“朋友多”，最后一列还有“下一次推进”。",
        options: [
          { label: "备注和下一次推进", correct: true, contradiction: "对方把不同顾客按可转化资源分层管理。", feedback: "这不是剪头需求，是把人按能带来什么往下排。", routeAxis: "process-control" },
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
        proves: "相似的亲密称呼后面接的是不同商业目标。",
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
    stageJudgement: "他给过晚档，也替她挡过闲话，这些照顾是真的。可私人表把年卡、投店和带客写成下一步；她拿过便利、帮过店里，也不等于同意被写成生意上的联络人。",
    followupTwist: "后续回拨里，另一位女生也发来私信，说她那栏写着“能投店”。到这里，“排班表”三个字已经挂不住了。",
    dailyShareTitle: "你会从哪一句看出 对方 在养鱼？",
    dailyShareBody: "几句暧昧聊天还能解释，排班表里那几栏解释不了：情绪稳定、能投店、能带客。",
    dailyShareQuestion: "你觉得“你和别人不一样”算锤吗？",
    truth: "会聊天不等于有问题，给晚档和替人挡闲话也确实是照顾。可相似的亲密称呼后面反复接办卡、带客和投店，私人表又按这些用途记人，就不能只用‘店里都这样’解释。那条深夜语音有没有原样发给别人，仍然没有证据。"
  });
}
