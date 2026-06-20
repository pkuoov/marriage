export const ATTRIBUTES = [
  { id: "wealth", label: "财务嗅觉", short: "财务" },
  { id: "family", label: "家庭结构", short: "家庭" },
  { id: "looks", label: "形象观察", short: "形象" },
  { id: "education", label: "信息核验", short: "核验" },
  { id: "eq", label: "情绪洞察", short: "洞察" }
];

export const DETECTIVE_SPECIALTIES = [
  {
    id: "audit",
    label: "财务审计型",
    attr: "wealth",
    boost: 3,
    intro: "更早看见转账、负债、共同账户、房产和资源交换里的不对劲。"
  },
  {
    id: "emotion",
    label: "情绪追踪型",
    attr: "eq",
    boost: 3,
    intro: "更容易听出诉苦、自欺、恶人先告状和情绪勒索里的断点。"
  },
  {
    id: "verification",
    label: "证据核查型",
    attr: "education",
    boost: 3,
    intro: "更擅长重排时间线、核验证件材料、识别资料包装。"
  }
];

export const NPCS = [
  {
    id: "zhou",
    name: "周砚",
    gender: "male",
    archetype: "稳定体面型",
    familyProfile: "父母满意度看重体制与稳定，容易用“为你好”介入小家庭。",
    tags: ["体制内", "有房", "父母退休", "适合结婚"],
    intro: "适合结婚，但不一定适合恋爱。",
    motiveWeights: ["care", "kpi", "control", "familyResource"],
    yellow: "“我妈只是嘴直，她没有恶意。”",
    red: "“婚后工资最好统一交给我妈规划。”"
  },
  {
    id: "lin",
    name: "林鹿",
    gender: "female",
    archetype: "大厂精英型",
    familyProfile: "独生女式高期待家庭，父母一般满意时会挑剔细节，很不满意时会要求你补资源差。",
    tags: ["大厂", "高收入", "高认知", "很忙"],
    intro: "很会沟通，也很会定义沟通。",
    motiveWeights: ["kpi", "emotionalSupply", "classJump", "control"],
    yellow: "“我不是冷淡，我是在复盘我们的问题。”",
    red: "“你的感受我理解，但你的表达方式不成熟。”"
  },
  {
    id: "xu",
    name: "许照",
    gender: "male",
    archetype: "富裕浪漫型",
    familyProfile: "受宠家庭脚本，父母重视体面和圈层，TA 容易把被满足当成默认配置。",
    tags: ["创业", "家境好", "浪漫", "消费高"],
    intro: "他能给你很多，但你要确认那是不是礼物。",
    motiveWeights: ["display", "control", "cover", "emotionalSupply"],
    yellow: "“钱的事你不用懂，我来处理。”",
    red: "“房本写谁名这种问题太伤感情。”"
  },
  {
    id: "chen",
    name: "陈默",
    gender: "male",
    archetype: "普通踏实型",
    familyProfile: "凤凰男/贫穷压力脚本，家庭希望婚姻能帮助事业起飞，也可能把你的让步当作全家资源。",
    tags: ["普通", "踏实", "温和", "收入一般"],
    intro: "不会让你上头，也未必让你失望。",
    motiveWeights: ["money", "familyResource", "care", "cover"],
    yellow: "“我没意见，你决定就好。”",
    red: "“我爸妈不容易，你多让一点。”"
  },
  {
    id: "shen",
    name: "沈知夏",
    gender: "female",
    archetype: "理性边界型",
    familyProfile: "规则型家庭，父母表面尊重边界，但会反复评估协议、资产和未来风险。",
    tags: ["律师", "独立", "边界清楚", "理性"],
    intro: "和 TA 在一起，爱情也要有条款。",
    motiveWeights: ["cover", "classJump", "kpi", "control"],
    yellow: "“我们先把规则说清楚。”",
    red: "“感情不能替代协议。”"
  },
  {
    id: "he",
    name: "何念",
    gender: "female",
    archetype: "精致内容型",
    familyProfile: "有弟弟与彩礼压力脚本，家庭容易把婚礼和彩礼说成“给家里一个交代”。",
    tags: ["博主", "审美好", "情绪价值", "精致"],
    intro: "TA 很懂浪漫，也很懂观众。",
    motiveWeights: ["content", "display", "money", "emotionalSupply"],
    yellow: "“这个瞬间太适合拍下来。”",
    red: "“我们吵架这件事，我想做一期匿名内容。”"
  }
];

export const HIDDEN_TYPES = {
  sincere: {
    label: "真诚型",
    signal: "说法前后一致，愿意解释，也愿意承担一部分代价。"
  },
  selfish: {
    label: "现实私心型",
    signal: "关系推进很快，但谈到责任时会把话说得很圆。"
  },
  flawed: {
    label: "道德瑕疵型",
    signal: "资料里有小漏洞，过去经历总有一块说不清。"
  },
  controlling: {
    label: "高风险控制型",
    signal: "初期极度完美，但会把边界说成“不够爱”。"
  }
};

export const HUMAN_PATTERNS = {
  steadyRepair: {
    label: "稳定修复型",
    signal: "压力上来时，TA 不一定完美，但会回到问题本身。",
    initialInternalDelta: -6,
    initialMotiveDelta: -4,
    burstModifier: 0.72
  },
  spoiledHeir: {
    label: "受宠家庭脚本",
    signal: "TA 习惯被照顾和被让步，亲密关系里很难接受“不按 TA 的来”。",
    initialInternalDelta: 18,
    initialMotiveDelta: 8,
    burstModifier: 1.35
  },
  npdMask: {
    label: "高伪装控制脚本",
    signal: "TA 初期非常完美，越进入承诺越会把爱、规则和亏欠变成控制工具。",
    initialInternalDelta: 26,
    initialMotiveDelta: 22,
    burstModifier: 2.4
  },
  avoidantPleaser: {
    label: "讨好回避脚本",
    signal: "TA 表面温和，关键问题上却总是退、拖、让你替 TA 扛决定。",
    initialInternalDelta: 8,
    initialMotiveDelta: 6,
    burstModifier: 1.05
  },
  pragmaticClimber: {
    label: "现实上升脚本",
    signal: "TA 不一定坏，但很容易把亲密关系当成向上流动的通道。",
    initialInternalDelta: 10,
    initialMotiveDelta: 18,
    burstModifier: 1.25
  }
};

export const MOTIVES = {
  money: {
    label: "图钱",
    light: "TA 总是忘记转账，却记得你收入很高。",
    pressure: "TA 临时说账户出问题，想让你先垫一笔费用。"
  },
  familyResource: {
    label: "图家庭资源",
    light: "TA 对你父母、户口、人脉和学区异常感兴趣。",
    pressure: "TA 提出想提前见你的父母，说只是随便吃个饭。"
  },
  display: {
    label: "图外貌展示",
    light: "TA 很在意你在朋友面前看起来够不够体面。",
    pressure: "TA 想高调公开关系，甚至安排你进入 TA 的社交场。"
  },
  care: {
    label: "图生育/照护",
    light: "TA 很早就聊孩子、父母养老和婚后谁牺牲更多。",
    pressure: "TA 询问你是否能婚后同住，多久要孩子。"
  },
  emotionalSupply: {
    label: "图情绪供养",
    light: "TA 刚认识就把很多创伤经历交到你手里。",
    pressure: "TA 深夜情绪崩溃，希望你立刻赶过去陪伴。"
  },
  classJump: {
    label: "图阶层跳板",
    light: "TA 很关心你的圈子能不能带来新的机会。",
    pressure: "TA 希望你引荐某个人，理由是以后都是一家人。"
  },
  cover: {
    label: "图避险/遮羞",
    light: "TA 对过去含糊其辞，也不喜欢你核实细节。",
    pressure: "TA 要求跳过背调，直接进入见父母流程。"
  },
  control: {
    label: "图控制感",
    light: "TA 开始评价你的朋友和生活习惯。",
    pressure: "TA 要求你停止同时了解别人，并交代近期行程。"
  },
  kpi: {
    label: "图婚恋 KPI",
    light: "TA 像推进项目一样推进关系，每一步都有时间表。",
    pressure: "TA 拿出计划：一个月见父母，三个月订婚。"
  },
  content: {
    label: "图内容/流量",
    light: "TA 总想记录你们的瞬间，哪怕你有点犹豫。",
    pressure: "TA 想发布合照或把两人的故事做成内容。"
  }
};

export const QUESTIONNAIRE = [
  {
    id: "marriageCore",
    text: "第一通连线，你最先核对什么？",
    choices: [
      ["love", "两人真实关系阶段"],
      ["money", "转账、债务和共同财产"],
      ["parents", "双方父母是否介入"],
      ["growth", "时间线和证据链"],
      ["child", "婚育史与孩子责任"]
    ]
  },
  {
    id: "dealbreaker",
    text: "你最警惕哪种隐瞒？",
    choices: [
      ["poor", "家境和债务"],
      ["plain", "外貌包装和照片差异"],
      ["lowEdu", "学历与职业履历"],
      ["parents", "父母强势和家庭负担"],
      ["emotion", "情绪勒索与恶人先告状"],
      ["lie", "婚史、孩子、短择经历"]
    ]
  },
  {
    id: "uneasy",
    text: "如果来访者讲得很委屈，但细节不完整？",
    choices: [
      ["observe", "继续听完整版本"],
      ["reject", "直接指出叙事漏洞"],
      ["ask", "要求补证据和时间线"],
      ["realistic", "先判断利益诉求"]
    ]
  }
];

export const CASE_CHAPTERS = [
  {
    id: "ch1",
    title: "第一案：婚前 case",
    summary: "婚前关系核验，重点判断择偶定位、承诺、彩礼房产、婚史孩子和债务是否被包装。"
  },
  {
    id: "ch2",
    title: "第二案：婚后 case",
    summary: "婚后共同生活案，重点拆共同财务、家务育儿、出轨边界、亲子和双方家庭责任。"
  },
  {
    id: "ch3",
    title: "第三案：告解模式",
    summary: "随机当事人自述经历，玩家站在 TA 的视角里查被坑、自欺和可能伤人的部分。"
  }
];

export const CHAPTERS = [
  {
    id: "ch1",
    title: "第一章：侦探局之后",
    summary: "把三案调查结果转成婚恋候选人入口、信任度和风险标签。"
  },
  {
    id: "ch2",
    title: "第二章：不是所有温柔都免费",
    summary: "三次约会会测试消费观、家庭观，以及对方在你说“不”时的反应。"
  },
  {
    id: "ch3",
    title: "第三章：见父母之前",
    summary: "排他谈判、深度背调、朋友局和父母第一次影子进入关系。"
  },
  {
    id: "ch4",
    title: "第四章：谈婚论嫁",
    summary: "彩礼嫁妆、婚房房本、双方父母见面和第一次重大动机显影。"
  },
  {
    id: "ch5",
    title: "第五章：婚礼战役",
    summary: "订婚宴、酒店档期、座次、份子钱、前任消息和婚礼前最后压力测试。"
  },
  {
    id: "ch6",
    title: "第六章：婚后第一年",
    summary: "工资卡、共同账户、春节去哪家、家务分配、父母探访和第一次共同生活危机。"
  },
  {
    id: "ch7",
    title: "第七章：买房与债务",
    summary: "租房、二手房、期房、月供、装修贷、父母借钱和共同债务风险。"
  },
  {
    id: "ch8",
    title: "第八章：生育与育儿",
    summary: "备孕、产检、职业中断、月子中心、老人带娃、托育和入学前的长期分工。"
  },
  {
    id: "ch9",
    title: "第九章：七年之痒",
    summary: "孩子出生后的长期照护、亲密消退、职业错位、老人依赖和中年危机。"
  },
  {
    id: "ch10",
    title: "第十章：孩子上学",
    summary: "学区、接送、兴趣班、家长群、教育焦虑和十年婚姻的最终清算。"
  }
];

export const PACKAGING_CHOICES = [
  {
    id: "honest",
    label: "先让来访者完整陈述",
    effect: "边界感 +1，容易发现叙事中的自然断点。"
  },
  {
    id: "boost",
    label: "先查硬证据和时间线",
    effect: "现实感 +1，更早触发财务、婚史、孩子和债务线索。"
  },
  {
    id: "hide",
    label: "先顺着 TA 的说法问下去",
    effect: "风险容忍 +1，可能诱导对方多说，也可能被带节奏。"
  },
  {
    id: "delegate",
    label: "让旁听席先投票",
    effect: "舆论压力 +1，热度上升，但判断更容易被情绪带偏。"
  }
];
