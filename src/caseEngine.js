import { shuffle } from "./random.js?v=0.14.0";

export const CASE_STAGES = {
  screening: "婚介初筛",
  dating: "约会观察",
  preParents: "见父母之前",
  marriageTalk: "谈婚论嫁",
  wedding: "婚礼战役",
  firstYear: "婚后第一年",
  housingDebt: "买房与债务",
  child: "孩子上学"
};

export const CASE_LIBRARY = [
  {
    id: "bride-price-security",
    title: "彩礼保障与返还争议",
    motiveHints: ["money", "kpi", "familyResource"],
    factors: [
      {
        stage: "screening",
        type: "money",
        line: "资料里写着“尊重本地礼俗”，但没有写具体金额。",
        internalDelta: 2,
        motiveDelta: 6
      },
      {
        stage: "marriageTalk",
        type: "money",
        line: "彩礼数字从“态度”变成了双方父母的底线。",
        internalDelta: 8,
        motiveDelta: 14,
        flags: { weddingPressure: 1, parentConflict: 1 }
      },
      {
        stage: "wedding",
        type: "money",
        line: "婚礼定金、酒席加桌和礼金预期开始被反复计算。",
        internalDelta: 9,
        motiveDelta: 14,
        flags: { weddingPressure: 2, parentConflict: 1 }
      },
      {
        stage: "firstYear",
        type: "money",
        line: "婚后第一个月，共同账户和工资卡归属变成了新的敏感点。",
        internalDelta: 10,
        motiveDelta: 16,
        flags: { householdPressure: 1, assetProtection: 1 }
      },
      {
        stage: "housingDebt",
        type: "money",
        line: "月供、装修贷和共同账户开始连在一起，谁承担风险变得越来越具体。",
        internalDelta: 13,
        motiveDelta: 18,
        flags: { debtPressure: 2, assetProtection: 1 }
      },
      {
        stage: "child",
        type: "money",
        line: "产检、月子中心、育儿嫂和托育费用被放进同一张预算表，爱忽然有了单价。",
        internalDelta: 10,
        motiveDelta: 14,
        flags: { childPressure: 2, debtPressure: 1 }
      }
    ]
  },
  {
    id: "house-parent-funded",
    title: "婚房父母出资与房本名字",
    motiveHints: ["familyResource", "money", "control"],
    factors: [
      {
        stage: "preParents",
        type: "property",
        line: "TA 的父母很早开始问房子首付、贷款和房本名字。",
        internalDelta: 6,
        motiveDelta: 8,
        flags: { parentConflict: 1 }
      },
      {
        stage: "marriageTalk",
        type: "property",
        line: "房本名字被说成安全感，也被说成不信任。",
        internalDelta: 10,
        motiveDelta: 12,
        flags: { assetProtection: 1, parentConflict: 1 }
      },
      {
        stage: "wedding",
        type: "property",
        line: "婚礼前，房子和装修又被父母拿出来确认了一遍。",
        internalDelta: 8,
        motiveDelta: 10,
        flags: { parentConflict: 1 }
      },
      {
        stage: "firstYear",
        type: "property",
        line: "装修、房贷和谁拥有决策权，开始每天出现在生活细节里。",
        internalDelta: 9,
        motiveDelta: 11,
        flags: { householdPressure: 1, parentConflict: 1 }
      },
      {
        stage: "housingDebt",
        type: "property",
        line: "房子还没真正住进去，产权、贷款和父母出资已经先住进了你们的关系。",
        internalDelta: 12,
        motiveDelta: 15,
        flags: { debtPressure: 2, parentConflict: 1, assetProtection: 1 }
      },
      {
        stage: "child",
        type: "property",
        line: "学区、户口和谁接送孩子，让房子再次变成两家人争夺话语权的入口。",
        internalDelta: 10,
        motiveDelta: 13,
        flags: { childPressure: 2, parentConflict: 1 }
      }
    ]
  },
  {
    id: "care-and-child-plan",
    title: "生育照护与老人同住",
    motiveHints: ["care", "control", "kpi"],
    factors: [
      {
        stage: "dating",
        type: "care",
        line: "TA 很自然地问起你能不能接受老人同住和三年内要孩子。",
        internalDelta: 5,
        motiveDelta: 9
      },
      {
        stage: "marriageTalk",
        type: "care",
        line: "孩子、老人和家务被放进同一张表，好像婚后劳动已经默认分配好了。",
        internalDelta: 12,
        motiveDelta: 13,
        flags: { parentConflict: 1 }
      },
      {
        stage: "wedding",
        type: "care",
        line: "婚礼座次里，未来带娃和养老的期待被亲戚们提前说出口。",
        internalDelta: 10,
        motiveDelta: 11,
        flags: { parentConflict: 1 }
      },
      {
        stage: "firstYear",
        type: "care",
        line: "家务、老人探访和备孕安排被默认塞进你的日程里。",
        internalDelta: 13,
        motiveDelta: 14,
        flags: { householdPressure: 2, parentConflict: 1 }
      },
      {
        stage: "housingDebt",
        type: "care",
        line: "为了省钱，老人同住和未来带娃被重新包装成“家庭互助”。",
        internalDelta: 10,
        motiveDelta: 12,
        flags: { debtPressure: 1, parentConflict: 2 }
      },
      {
        stage: "child",
        type: "care",
        line: "孩子还没出生，谁牺牲职业、谁夜醒、谁负责老人情绪，已经被默认分配了一轮。",
        internalDelta: 16,
        motiveDelta: 20,
        flags: { childPressure: 3, householdPressure: 1, parentConflict: 1 }
      }
    ]
  },
  {
    id: "debt-and-cover",
    title: "债务遮羞与背调回避",
    motiveHints: ["cover", "money"],
    factors: [
      {
        stage: "preParents",
        type: "concealment",
        line: "背调里有一项记录暂时无法确认，TA 说那只是过去的小事。",
        internalDelta: 7,
        motiveDelta: 15,
        flags: { suspicion: 1 }
      },
      {
        stage: "marriageTalk",
        type: "concealment",
        line: "TA 希望先订婚，债务和资料细节以后再慢慢补。",
        internalDelta: 9,
        motiveDelta: 18,
        flags: { suspicion: 2 }
      },
      {
        stage: "wedding",
        type: "concealment",
        line: "婚礼前夕，一个陌生消息提醒你：TA 还有一件事没说清。",
        internalDelta: 12,
        motiveDelta: 20,
        flags: { suspicion: 2, weddingPressure: 1 }
      },
      {
        stage: "firstYear",
        type: "concealment",
        line: "一笔旧账单或旧消息在婚后生活里突然冒出来。",
        internalDelta: 12,
        motiveDelta: 18,
        flags: { suspicion: 2, householdPressure: 1 }
      },
      {
        stage: "housingDebt",
        type: "concealment",
        line: "贷款审批前夕，TA 的征信或旧债务出现了一个解释不清的缺口。",
        internalDelta: 15,
        motiveDelta: 22,
        flags: { suspicion: 2, debtPressure: 2 }
      },
      {
        stage: "child",
        type: "concealment",
        line: "产检和育儿安排逼近时，TA 仍回避一个会影响家庭计划的旧问题。",
        internalDelta: 13,
        motiveDelta: 18,
        flags: { suspicion: 2, childPressure: 1 }
      }
    ]
  },
  {
    id: "public-display-content",
    title: "公开展示与内容流量",
    motiveHints: ["content", "display"],
    factors: [
      {
        stage: "dating",
        type: "reputation",
        line: "TA 总能把约会安排到适合拍照的位置。",
        internalDelta: 3,
        motiveDelta: 8
      },
      {
        stage: "marriageTalk",
        type: "reputation",
        line: "订婚宴方案里，镜头、文案和宾客反应被安排得比誓言还细。",
        internalDelta: 7,
        motiveDelta: 16,
        flags: { weddingPressure: 1 }
      },
      {
        stage: "wedding",
        type: "reputation",
        line: "婚礼流程被拆成可发布的片段，连父母敬茶都要找角度。",
        internalDelta: 7,
        motiveDelta: 18,
        flags: { weddingPressure: 2 }
      },
      {
        stage: "firstYear",
        type: "reputation",
        line: "婚后日常也开始被挑选、修剪、发布，真实生活反而无处安放。",
        internalDelta: 9,
        motiveDelta: 15,
        flags: { householdPressure: 1 }
      },
      {
        stage: "housingDebt",
        type: "reputation",
        line: "买房进度被包装成生活升级内容，但真实月供没有出现在镜头里。",
        internalDelta: 7,
        motiveDelta: 14,
        flags: { debtPressure: 1 }
      },
      {
        stage: "child",
        type: "reputation",
        line: "孕期、育儿和亲子日常开始被构想成内容选题，真实疲惫被要求保持体面。",
        internalDelta: 8,
        motiveDelta: 16,
        flags: { childPressure: 1, householdPressure: 1 }
      }
    ]
  },
  {
    id: "emotional-pressure",
    title: "情绪供养与压力转嫁",
    motiveHints: ["emotionalSupply", "control"],
    factors: [
      {
        stage: "dating",
        type: "emotion",
        line: "TA 在很短时间里把许多脆弱交给你，好像你已经负责接住。",
        internalDelta: 8,
        motiveDelta: 8
      },
      {
        stage: "preParents",
        type: "emotion",
        line: "每当你想谈规则，TA 都先谈自己有多累。",
        internalDelta: 11,
        motiveDelta: 10,
        flags: { suspicion: 1 }
      },
      {
        stage: "wedding",
        type: "emotion",
        line: "婚礼压力一上来，TA 把所有焦虑都倒向你，要求你先安抚 TA。",
        internalDelta: 14,
        motiveDelta: 12,
        flags: { weddingPressure: 1 }
      },
      {
        stage: "firstYear",
        type: "emotion",
        line: "同住以后，TA 的情绪低谷不再是电话里的声音，而是每天客厅里的天气。",
        internalDelta: 15,
        motiveDelta: 12,
        flags: { householdPressure: 2 }
      },
      {
        stage: "housingDebt",
        type: "emotion",
        line: "月供压力一来，TA 把焦虑、羞耻和不安都倒向你。",
        internalDelta: 16,
        motiveDelta: 13,
        flags: { debtPressure: 2, householdPressure: 1 }
      },
      {
        stage: "child",
        type: "emotion",
        line: "育儿压力还没真正开始，TA 已经把恐惧和委屈都交给你处理。",
        internalDelta: 17,
        motiveDelta: 15,
        flags: { childPressure: 2, householdPressure: 1 }
      }
    ]
  },
  {
    id: "love-transfer-special-numbers",
    title: "恋爱转账与特殊金额争议",
    motiveHints: ["money", "emotionalSupply"],
    factors: [
      {
        stage: "dating",
        type: "money",
        line: "TA 开始用“520、1314 只是表达心意”来模糊小额和大额支出的边界。",
        internalDelta: 4,
        motiveDelta: 10,
        flags: { giftPressure: 1 }
      },
      {
        stage: "preParents",
        type: "money",
        line: "你发现恋爱期间的转账和代付已经很难说清是赠与、借款还是情绪安抚。",
        internalDelta: 8,
        motiveDelta: 14,
        flags: { assetProtection: 1, suspicion: 1 }
      },
      {
        stage: "firstYear",
        type: "money",
        line: "婚后共同账户开始承担过去恋爱期形成的消费习惯。",
        internalDelta: 10,
        motiveDelta: 12,
        flags: { householdPressure: 1, debtPressure: 1 }
      }
    ]
  },
  {
    id: "pre-marriage-house-name",
    title: "婚前房产加名与共同还贷",
    motiveHints: ["familyResource", "money", "control"],
    factors: [
      {
        stage: "marriageTalk",
        type: "property",
        line: "TA 把婚前房产加名说成安全感测试，却不愿同步谈出资、还贷和退出机制。",
        internalDelta: 10,
        motiveDelta: 16,
        flags: { assetProtection: 1, parentConflict: 1 }
      },
      {
        stage: "housingDebt",
        type: "property",
        line: "共同还贷、装修款和父母出资混在一起，任何一句“都是一家人”都开始变得危险。",
        internalDelta: 14,
        motiveDelta: 18,
        flags: { debtPressure: 2, assetProtection: 1 }
      }
    ]
  },
  {
    id: "sibling-bride-price-buyout",
    title: "弟弟压力与彩礼买断感",
    motiveHints: ["money", "familyResource", "care"],
    factors: [
      {
        stage: "marriageTalk",
        type: "family",
        line: "TA 家里把彩礼和弟弟、父母养老、家里欠账放在同一段话里。",
        internalDelta: 12,
        motiveDelta: 18,
        flags: { siblingPressure: 2, parentConflict: 1, weddingPressure: 1 }
      },
      {
        stage: "wedding",
        type: "family",
        line: "婚礼前，原生家庭再次确认彩礼是否“到位”，仿佛婚姻是一次家庭资金结算。",
        internalDelta: 12,
        motiveDelta: 16,
        flags: { siblingPressure: 1, weddingPressure: 2 }
      },
      {
        stage: "firstYear",
        type: "family",
        line: "婚后，TA 家里仍会把小家庭收入和原生家庭需求连在一起。",
        internalDelta: 10,
        motiveDelta: 14,
        flags: { siblingPressure: 1, householdPressure: 1, debtPressure: 1 }
      }
    ]
  },
  {
    id: "wedding-hazing-boundary",
    title: "婚闹与公开羞辱边界",
    motiveHints: ["display", "control", "content"],
    factors: [
      {
        stage: "wedding",
        type: "boundary",
        line: "伴郎伴娘游戏被说成热闹，但每个环节都在测试你愿意为场面让出多少尊严。",
        internalDelta: 14,
        motiveDelta: 10,
        flags: { publicPressure: 2, weddingPressure: 1 }
      },
      {
        stage: "firstYear",
        type: "boundary",
        line: "婚礼上被笑着越过的边界，婚后很容易继续以“开玩笑”的方式回来。",
        internalDelta: 12,
        motiveDelta: 10,
        flags: { communicationFriction: 1, householdPressure: 1 }
      }
    ]
  },
  {
    id: "unpaid-care-work",
    title: "全职照护与家务劳动价值",
    motiveHints: ["care", "kpi", "familyResource"],
    factors: [
      {
        stage: "firstYear",
        type: "labor",
        line: "TA 说“家务不就是顺手做吗”，但顺手的人总是同一个。",
        internalDelta: 13,
        motiveDelta: 10,
        flags: { householdPressure: 2, emotionalLabor: 1 }
      },
      {
        stage: "child",
        type: "labor",
        line: "育儿和家务被默认归到一个人身上，收入表看不见的劳动却每天都在发生。",
        internalDelta: 16,
        motiveDelta: 16,
        flags: { childPressure: 2, householdPressure: 2, emotionalLabor: 1 }
      }
    ]
  },
  {
    id: "phoenix-career-lift",
    title: "凤凰男事业起飞与全家期待",
    motiveHints: ["classJump", "familyResource", "money"],
    factors: [
      {
        stage: "dating",
        type: "career",
        line: "TA 说自己只是暂时起点低，但很快又问你能不能介绍更好的机会。",
        internalDelta: 7,
        motiveDelta: 12,
        flags: { phoenixAmbition: 1 }
      },
      {
        stage: "marriageTalk",
        type: "career",
        line: "TA 家里把婚姻说成“互相扶持”，实际更像希望你带着 TA 完成一次阶层跃迁。",
        internalDelta: 12,
        motiveDelta: 18,
        flags: { phoenixAmbition: 2, povertyStress: 1, parentConflict: 1 }
      },
      {
        stage: "housingDebt",
        type: "career",
        line: "买房压力下，TA 更频繁提到创业、跳槽和你的人脉资源。",
        internalDelta: 14,
        motiveDelta: 18,
        flags: { phoenixAmbition: 1, debtPressure: 2 }
      }
    ]
  }
];

const HUMAN_PATTERN_LIBRARY = {
  spoiledHeir: {
    id: "pattern-spoiled-heir",
    title: "受宠家庭的让步测试",
    factors: [
      {
        stage: "dating",
        type: "upbringing",
        line: "你只是没有按 TA 想要的时间回复，TA 就把这件事说成“你根本不在乎我”。",
        internalDelta: 16,
        motiveDelta: 4,
        flags: { suspicion: 1 }
      },
      {
        stage: "preParents",
        type: "upbringing",
        line: "TA 习惯让父母替自己兜底，也习惯让亲密关系继续兜底。",
        internalDelta: 14,
        motiveDelta: 5,
        flags: { parentConflict: 1 }
      },
      {
        stage: "wedding",
        type: "upbringing",
        line: "婚礼方案稍微不合 TA 的期待，TA 就说“从小到大没人这样委屈过我”。",
        internalDelta: 20,
        motiveDelta: 6,
        flags: { weddingPressure: 2, parentConflict: 1 }
      },
      {
        stage: "firstYear",
        type: "upbringing",
        line: "共同生活里，TA 对家务和让步的理解仍像在原生家庭里当孩子。",
        internalDelta: 18,
        motiveDelta: 6,
        flags: { householdPressure: 2 }
      },
      {
        stage: "child",
        type: "upbringing",
        line: "育儿压力一来，TA 希望所有人先照顾自己的情绪，再照顾孩子和现实。",
        internalDelta: 18,
        motiveDelta: 8,
        flags: { childPressure: 2, householdPressure: 1 }
      }
    ]
  },
  npdMask: {
    id: "pattern-npd-mask",
    title: "高伪装控制与关系围猎",
    factors: [
      {
        stage: "dating",
        type: "control",
        line: "TA 初期几乎完美：懂你、宠你、接住你，但也开始轻轻评价你的朋友和边界。",
        internalDelta: 18,
        motiveDelta: 22,
        flags: { suspicion: 1 }
      },
      {
        stage: "preParents",
        type: "control",
        line: "当你提出核实信息，TA 立刻反问：“你是不是从一开始就没信过我？”",
        internalDelta: 24,
        motiveDelta: 24,
        flags: { suspicion: 2 }
      },
      {
        stage: "marriageTalk",
        type: "control",
        line: "TA 把协议、边界和核验都说成伤害感情，要求你用服从证明爱。",
        internalDelta: 26,
        motiveDelta: 26,
        flags: { suspicion: 2, parentConflict: 1 }
      },
      {
        stage: "wedding",
        type: "control",
        line: "婚礼临近，TA 开始要求统一口径、删掉异性联系人，并把你的迟疑说成背叛。",
        internalDelta: 28,
        motiveDelta: 24,
        flags: { weddingPressure: 2, suspicion: 2 }
      },
      {
        stage: "firstYear",
        type: "control",
        line: "婚后 TA 开始用“已婚人士自觉”要求报备、交账和站队，温柔变成制度。",
        internalDelta: 30,
        motiveDelta: 24,
        flags: { householdPressure: 3, suspicion: 2 }
      },
      {
        stage: "housingDebt",
        type: "control",
        line: "债务压力给了 TA 新理由：你的工作、社交、消费和退路都被说成家庭风险。",
        internalDelta: 30,
        motiveDelta: 24,
        flags: { debtPressure: 2, householdPressure: 2, suspicion: 2 }
      },
      {
        stage: "child",
        type: "control",
        line: "孩子成为新的控制理由。TA 要求你按 TA 的家庭秩序调整工作、父母和生活半径。",
        internalDelta: 32,
        motiveDelta: 24,
        flags: { childPressure: 3, householdPressure: 2, suspicion: 2 }
      }
    ]
  },
  pragmaticClimber: {
    id: "pattern-pragmatic-climber",
    title: "现实上升与资源计算",
    factors: [
      {
        stage: "dating",
        type: "resource",
        line: "TA 聊天很舒服，但总会自然地绕回你的圈子、户口、收入和未来机会。",
        internalDelta: 8,
        motiveDelta: 18,
        flags: { suspicion: 1 }
      },
      {
        stage: "marriageTalk",
        type: "resource",
        line: "谈婚论嫁时，你能提供的资源被说成“共同未来的一部分”。",
        internalDelta: 10,
        motiveDelta: 22,
        flags: { parentConflict: 1 }
      },
      {
        stage: "housingDebt",
        type: "resource",
        line: "买房和学区被包装成共同进阶，但真正承担风险的人越来越像你。",
        internalDelta: 12,
        motiveDelta: 24,
        flags: { debtPressure: 2, assetProtection: 1 }
      }
    ]
  },
  avoidantPleaser: {
    id: "pattern-avoidant-pleaser",
    title: "讨好回避与责任转移",
    factors: [
      {
        stage: "preParents",
        type: "avoidance",
        line: "TA 表面说都听你的，但关键时刻总让你去面对父母和规则。",
        internalDelta: 10,
        motiveDelta: 8,
        flags: { householdPressure: 1 }
      },
      {
        stage: "firstYear",
        type: "avoidance",
        line: "婚后争议一出现，TA 就沉默、装忙、让你替两个人做决定。",
        internalDelta: 14,
        motiveDelta: 10,
        flags: { householdPressure: 2 }
      },
      {
        stage: "child",
        type: "avoidance",
        line: "育儿分工需要落地时，TA 仍然说“我都可以”，但没有接走任何一件事。",
        internalDelta: 15,
        motiveDelta: 10,
        flags: { childPressure: 2, householdPressure: 2 }
      }
    ]
  }
};

export function buildCaseDeck(npcs, npcSeeds, attrs) {
  const deck = {};

  npcs.forEach((npc) => {
    const seed = npcSeeds[npc.id];
    const candidates = CASE_LIBRARY.filter((item) => {
      if (seed.motive && item.motiveHints.includes(seed.motive)) return true;
      if (seed.hiddenType === "controlling" && item.motiveHints.includes("control")) return true;
      if (attrs.wealth >= 7 && item.motiveHints.includes("money")) return true;
      if (attrs.family >= 7 && item.motiveHints.includes("familyResource")) return true;
      if (attrs.looks >= 7 && item.motiveHints.includes("display")) return true;
      if (npc.id === "he" && item.id === "sibling-bride-price-buyout") return true;
      if (npc.id === "chen" && item.id === "phoenix-career-lift") return true;
      return item.id === "house-parent-funded";
    });
    const patternCase = HUMAN_PATTERN_LIBRARY[seed.humanPattern];
    if (patternCase) candidates.push(patternCase);

    deck[npc.id] = {};
    shuffle(candidates).forEach((caseItem) => {
      caseItem.factors.forEach((factor) => {
        if (!deck[npc.id][factor.stage]) deck[npc.id][factor.stage] = [];
        if (deck[npc.id][factor.stage].length < 2) {
          deck[npc.id][factor.stage].push({
            ...factor,
            caseId: caseItem.id,
            caseTitle: caseItem.title
          });
        }
      });
    });
  });

  return deck;
}

export function caseEventsFor(deck, npcId, stage) {
  return deck?.[npcId]?.[stage] ?? [];
}
