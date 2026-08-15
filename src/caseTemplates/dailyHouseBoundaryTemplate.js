import { dailyBaseBrief } from "./dailyTemplateSupport.js";

export function dailyHouseBoundaryTemplate(brief, names) {
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
