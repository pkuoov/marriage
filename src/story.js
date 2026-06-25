export const ATTRIBUTES = [
  { id: "wealth", label: "财务嗅觉", short: "财务" },
  { id: "family", label: "家庭结构", short: "家庭" },
  { id: "looks", label: "形象观察", short: "形象" },
  { id: "education", label: "资料敏感", short: "资料" },
  { id: "eq", label: "情绪洞察", short: "洞察" }
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
    yellow: "“我不是冷淡，我是在回看我们的问题。”",
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

export const CASE_CHAPTERS = [
  {
    id: "ch1",
    title: "第一案：婚前 case",
    summary: "婚前关系连线，重点听择偶定位、承诺、彩礼房产、婚史孩子和债务是否被包装。"
  },
  {
    id: "ch2",
    title: "第二案：婚后 case",
    summary: "婚后共同生活连线，重点拆共同财务、家务育儿、出轨边界、亲子和双方家庭分工。"
  },
  {
    id: "ch3",
    title: "第三案：告解模式",
    summary: "当事人自述经历，你站在 TA 的视角里查被坑、自欺和可能伤人的部分。"
  }
];

export const CHAPTERS = [
  {
    id: "ch1",
    title: "第一章：直播间之后",
    summary: "把连线回看转成婚恋候选人入口、信任度和风险标签。"
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
