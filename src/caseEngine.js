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

export const LIVESTREAM_PLOT_LIBRARY = [
  {
    id: "marriage-fraud",
    label: "骗婚局",
    publicHook: "一方说自己被催婚、被要钱、被逼表态，但账目和时间线可能对不上。",
    truth: "婚恋承诺被用来换取现金、房产加名、资源引荐或快速领证。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["婚史", "债务", "收入", "真实工作", "前任未断"],
    exaggerations: ["家庭背景", "学历", "房产", "稳定职业"],
    evidence: ["转账记录", "聊天承诺", "房产材料", "婚介资料", "征信线索"]
  },
  {
    id: "debt-transfer",
    label: "化债局",
    publicHook: "来访者说只是想结婚过日子，但对彩礼、共同账户、装修贷或婚房款异常急。",
    truth: "一方试图把婚前债务、家庭欠账、创业亏损或信用卡周转转嫁给伴侣。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["债务", "失信记录", "亲属借款", "创业亏损"],
    exaggerations: ["收入", "公司前景", "父母兜底能力"],
    evidence: ["征信", "借条", "贷款审批", "消费账单", "亲属聊天记录"]
  },
  {
    id: "affair-reversal",
    label: "外遇反咬局",
    publicHook: "一方哭诉自己被冷暴力、不被关心，但外部暧昧和前任联系可能早已存在。",
    truth: "诉苦者可能是真受害者，也可能把情绪外包、精神出轨或实质外遇包装成被忽视。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["暧昧对象", "前任联系", "酒店/出行记录", "社交软件"],
    exaggerations: ["自己受伤程度", "对方冷漠程度", "关系已经破裂"],
    evidence: ["聊天记录", "出行记录", "共同朋友证言", "消费记录"]
  },
  {
    id: "child-paternity-trap",
    label: "外情生子/接盘生子局",
    publicHook: "来访者强调孩子无辜、对方必须负责，但怀孕时间线和亲密关系边界需要核实。",
    truth: "孩子、备孕、领证和财产安排被混在一起，可能存在接盘、隐瞒生育史或抚养责任转移。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["生育史", "亲子关系", "同居时间线", "婚史", "短择经历"],
    exaggerations: ["稳定关系时长", "双方承诺", "父母认可"],
    evidence: ["产检时间", "同居记录", "聊天承诺", "亲子鉴定意向", "医院材料"]
  },
  {
    id: "resource-harvest",
    label: "大结果收割局",
    publicHook: "一方说自己只是想找合适对象，但曾经拿过大钱、大资源或关键机会却选择性不提。",
    truth: "亲密关系被当成资源通道，择偶定位与真实经历、既得利益和退出成本不匹配。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["拿过大额转账", "拿过资源引荐", "短择史", "同居史", "上一段补偿"],
    exaggerations: ["单纯人设", "择偶诚意", "家庭托举", "职业履历"],
    evidence: ["转账记录", "社交动态", "共同好友", "项目合同", "旧聊天记录"]
  },
  {
    id: "positioning-lie",
    label: "择偶定位包装局",
    publicHook: "来访者寻求择偶定位，看似想自我提升，实际可能隐瞒家境、学历、外貌包装、婚育史或短择经历。",
    truth: "资料包装超过合理美化，已经影响对方知情权和匹配判断。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["真实学历", "真实年龄", "婚史", "育儿责任", "家庭负担"],
    exaggerations: ["家境", "学历", "外貌", "收入", "情绪稳定"],
    evidence: ["学历认证", "户籍/婚育信息", "工作证明", "照片时间线", "亲友证言"]
  },
  {
    id: "romance-transfer-gift-or-loan",
    label: "恋爱转账借赠争议",
    publicHook: "一方说钱是恋爱表达，另一方说是借款或被长期索取。",
    truth: "特殊金额、日常代付和大额转账被混在一起，真正争点是借款合意、赠与意思和情绪索取。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["大额转账用途", "借款承诺", "分手前最后一笔钱", "共同消费记录"],
    exaggerations: ["恋爱投入", "经济困难", "自愿程度"],
    evidence: ["转账备注", "聊天催款", "消费明细", "还款承诺", "分手时间线"]
  },
  {
    id: "bride-price-short-cohabitation",
    label: "彩礼短暂共同生活局",
    publicHook: "双方已经办酒或短暂同居，但没领证或共同生活很短，彩礼返还比例成为焦点。",
    truth: "彩礼被礼俗、面子和共同生活事实共同拉扯，双方都会选择性描述“有没有真正过日子”。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["共同生活天数", "彩礼用途", "退婚原因", "酒席礼金归属"],
    exaggerations: ["共同生活程度", "家庭付出", "当地习俗"],
    evidence: ["同居记录", "彩礼流水", "酒席账单", "亲友证言", "退婚聊天"]
  },
  {
    id: "house-name-security-test",
    label: "婚前房产加名安全感局",
    publicHook: "一方说加名是安全感，另一方说这是以结婚为名拿资产。",
    truth: "安全感话术掩盖了出资、贷款、装修、退出机制和父母赠与归属。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["首付来源", "父母出资性质", "共同还贷计划", "装修款承担"],
    exaggerations: ["安全感需求", "婚后贡献", "父母态度"],
    evidence: ["购房合同", "贷款流水", "父母转账", "装修合同", "加名聊天记录"]
  },
  {
    id: "hidden-divorce-history",
    label: "婚史隐瞒局",
    publicHook: "来访者说自己只是没找到合适时机坦白，对方却认为自己被欺骗。",
    truth: "离异、事实婚姻、订婚史或长期同居史被包装成“过去的感情经历”。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["离婚时间", "订婚退婚史", "长期同居史", "前配偶联系"],
    exaggerations: ["单身时长", "感情空窗", "坦白意愿"],
    evidence: ["婚姻登记信息", "旧照片", "共同朋友证言", "前任聊天", "租房记录"]
  },
  {
    id: "hidden-child-support",
    label: "孩子与抚养责任隐瞒局",
    publicHook: "一方承认有孩子，但强调孩子“不影响现在的关系”。",
    truth: "孩子不只是身份信息，还关联抚养费、探视、前任边界、未来生育和家庭资源分配。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["抚养权", "抚养费", "探视频率", "前任共同决策"],
    exaggerations: ["影响很小", "前任已断", "父母能兜底"],
    evidence: ["离婚协议", "抚养费流水", "探视聊天", "学校/医院记录", "前任沟通记录"]
  },
  {
    id: "major-illness-disclosure",
    label: "重大疾病婚前告知局",
    publicHook: "一方说病情是隐私，另一方说这是影响结婚决定的重大事实。",
    truth: "病情、用药、生育影响和经济负担被“隐私权”与“知情权”夹在中间。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["诊断时间", "复发风险", "长期用药", "生育影响", "医疗支出"],
    exaggerations: ["已经痊愈", "不影响生活", "只是小毛病"],
    evidence: ["病历", "购药记录", "体检报告", "婚前聊天", "医保流水"]
  },
  {
    id: "relative-debt-bundle",
    label: "原生家庭债务捆绑局",
    publicHook: "来访者说自己只是孝顺顾家，对方却发现小家庭像被接入了原生家庭债务。",
    truth: "父母欠款、弟妹买房、亲属创业和婚礼彩礼被包装成“帮家里渡过难关”。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["亲属欠款", "担保记录", "弟妹购房", "父母医疗债"],
    exaggerations: ["只是临时周转", "以后会还", "家人不会拖累"],
    evidence: ["借条", "担保合同", "亲属聊天", "银行流水", "催收记录"]
  },
  {
    id: "fake-divorce-quota",
    label: "假离婚购房资格局",
    publicHook: "一方说假离婚只是技术操作，另一方担心关系和资产都被掏空。",
    truth: "资格、税费、贷款和房产归属被“只是走个流程”掩盖，风险集中在弱势一方。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["真实购房目的", "房本归属", "贷款人", "复婚承诺"],
    exaggerations: ["只是形式", "绝对会复婚", "不会影响感情"],
    evidence: ["离婚协议", "购房合同", "聊天承诺", "贷款材料", "户口材料"]
  },
  {
    id: "education-income-fake-profile",
    label: "学历收入资料造假局",
    publicHook: "当事人来咨询择偶定位，却把学历、职业、收入和家庭资产说得很漂亮。",
    truth: "资料包装已经从美化变成影响匹配判断的虚假基础。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["真实学历", "真实公司", "收入流水", "负债", "家庭资产归属"],
    exaggerations: ["名校背景", "高管职位", "家里有房", "年入水平"],
    evidence: ["学历认证", "社保记录", "工资流水", "房产证", "公司工商信息"]
  },
  {
    id: "pig-butchering-investment",
    label: "杀猪盘投资局",
    publicHook: "一方说对方带自己投资发财，后来平台无法提现，关系也突然消失。",
    truth: "亲密感被用于降低防备，投资话术、假平台和提现门槛构成一条诈骗链。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["平台归属", "推荐人身份", "提现规则", "客服话术"],
    exaggerations: ["稳定收益", "内部渠道", "共同未来"],
    evidence: ["平台链接", "充值流水", "客服聊天", "提现截图", "对方身份资料"]
  },
  {
    id: "dating-app-bot-vip",
    label: "交友软件假账号会员局",
    publicHook: "当事人以为自己遇见真爱，却不断被引导充值会员、买礼物、解锁聊天。",
    truth: "恋爱期待被平台机制和假账号利用，真实对方可能根本不存在。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["账号真实性", "平台分成", "客服诱导", "照片来源"],
    exaggerations: ["匹配成功", "对方主动", "线下见面机会"],
    evidence: ["充值记录", "聊天模板", "账号照片反搜", "平台协议", "客服记录"]
  },
  {
    id: "ex-borrow-money-reentry",
    label: "前任借钱复联局",
    publicHook: "一方说前任只是遇到困难，对方认为旧关系正在重新进入小家庭。",
    truth: "前任借钱不是单纯钱的问题，而是边界、隐瞒和情绪替代关系的测试。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["借钱次数", "见面地点", "是否主动告知", "旧情绪依赖"],
    exaggerations: ["普通朋友", "最后一次", "只是帮忙"],
    evidence: ["转账记录", "聊天记录", "定位/出行", "电话记录", "共同朋友证言"]
  },
  {
    id: "coworker-emotional-affair",
    label: "同事情绪外包局",
    publicHook: "一方说只是同事倾诉，对方发现伴侣把婚内情绪都交给了别人。",
    truth: "精神亲密先于实质越界，关键在隐瞒、排他性称呼和持续比较伴侣。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["深夜聊天", "单独出差", "暧昧称呼", "共同秘密"],
    exaggerations: ["只是工作", "你太敏感", "没有身体接触"],
    evidence: ["聊天记录", "出差行程", "报销记录", "同事证言", "删改记录"]
  },
  {
    id: "pregnancy-timeline-gap",
    label: "怀孕时间线缺口局",
    publicHook: "一方强调孩子无辜，另一方发现同居、分手、复合和产检时间对不上。",
    truth: "亲密关系、怀孕时间、承诺和责任被混在一起，事实必须先于情绪。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["末次月经", "产检时间", "同居时间", "复合时间", "其他亲密关系"],
    exaggerations: ["关系稳定", "双方默认备孕", "父母认可"],
    evidence: ["产检单", "聊天时间线", "住宿记录", "出行记录", "亲友证言"]
  },
  {
    id: "paternity-doubt-after-birth",
    label: "婚后亲子疑云局",
    publicHook: "孩子出生后，一方因时间线和外貌怀疑亲子关系，另一方说这是羞辱。",
    truth: "亲子怀疑可能来自控制，也可能来自真实时间线缺口，必须拆开动机和证据。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["备孕时间", "外部关系", "亲子鉴定意向", "出生证明"],
    exaggerations: ["完全信任", "毫无根据", "对孩子不负责"],
    evidence: ["出生医学证明", "产检记录", "聊天时间线", "亲子鉴定沟通", "外部关系证据"]
  },
  {
    id: "wedding-sunk-cost-pressure",
    label: "婚礼沉没成本局",
    publicHook: "婚礼临近时，一方突然提出加钱、加名或改变条件，对方不敢停下。",
    truth: "酒店定金、亲友通知和面子压力被用来压制最后核验。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["临时加价原因", "定金承担", "亲友施压", "旧问题未解决"],
    exaggerations: ["不办会丢脸", "都到这一步了", "婚后再说"],
    evidence: ["婚庆合同", "转账流水", "双方父母聊天", "变更条件记录", "宾客通知"]
  },
  {
    id: "couple-startup-equity",
    label: "情侣创业股权局",
    publicHook: "一方说两人一起创业，分手后却发现股权、债务和劳动贡献都没写清。",
    truth: "恋爱承诺替代了商业协议，感情破裂后才发现贡献无法证明。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["股权代持", "借款性质", "无偿劳动", "客户资源来源"],
    exaggerations: ["共同事业", "以后都是你的", "只是临时挂名"],
    evidence: ["工商登记", "聊天承诺", "转账记录", "客户合同", "工作记录"]
  },
  {
    id: "influencer-relationship-content",
    label: "情侣博主人设流量局",
    publicHook: "一方说恋爱是内容共创，另一方认为隐私、消费和分手都被当成流量素材。",
    truth: "亲密关系被内容资产化，争点是授权、收益、隐私和舆论胁迫。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["账号收益", "脚本文案", "隐私授权", "分手炒作"],
    exaggerations: ["真实记录", "粉丝祝福", "共同账号"],
    evidence: ["账号后台", "广告合同", "拍摄脚本", "聊天授权", "公开视频时间线"]
  },
  {
    id: "control-isolation-reporting",
    label: "控制报备孤立局",
    publicHook: "一方说自己只是需要安全感，对方发现朋友、钱和手机都被慢慢接管。",
    truth: "安全感话术升级为控制：报备、删联系人、查手机、限制工作和孤立支持系统。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["查手机频率", "删联系人", "限制见朋友", "工资卡控制"],
    exaggerations: ["只是爱你", "别人都不靠谱", "情侣应该透明"],
    evidence: ["聊天要求", "定位记录", "转账/工资卡", "朋友证言", "争吵录音"]
  },
  {
    id: "violence-mutual-accusation",
    label: "冲突互殴反咬局",
    publicHook: "双方都说自己被打，但现场伤情、先后顺序和报警叙事互相冲突。",
    truth: "暴力不能被情绪合理化，但谁先动手、谁持续控制、谁事后威胁需要拆开。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["第一次动手", "长期威胁", "报警原因", "伤情来源"],
    exaggerations: ["只是推了一下", "完全没还手", "TA 一直这样"],
    evidence: ["伤情照片", "报警记录", "监控", "邻居证言", "聊天威胁"]
  },
  {
    id: "cohabitation-renovation-cost",
    label: "同居装修代付局",
    publicHook: "分手后，一方要求返还同居期间房租、装修、家电和宠物开销。",
    truth: "生活共同消费、借款、赠与和对未来婚姻的投入被混成一笔糊涂账。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["谁居住受益", "家电归属", "装修房屋产权", "宠物归属"],
    exaggerations: ["都是我花的", "都是共同生活", "以后会结婚"],
    evidence: ["租房合同", "购物发票", "转账备注", "聊天承诺", "搬离记录"]
  },
  {
    id: "lost-job-hidden-credit",
    label: "失业信用卡隐瞒局",
    publicHook: "一方失业后继续维持体面恋爱消费，直到信用卡和网贷爆雷。",
    truth: "面子、恐惧和消费预期共同制造债务隐瞒，婚前婚后责任边界需要核实。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["失业时间", "信用卡负债", "网贷", "消费用途"],
    exaggerations: ["工作稳定", "只是短期周转", "马上能还"],
    evidence: ["社保记录", "信用卡账单", "网贷短信", "消费记录", "求职记录"]
  }
];

const CASE_SCENES = [
  {
    id: "family-dinner",
    name: "双方父母饭局",
    description: "包间里，彩礼、房本、孩子和父母养老被包进几句客气话里。",
    dialogue: "“我们不是要钱，是看态度。” / “以后都是一家人，别算这么清。”",
    hint: "越客气的场合，越要看谁在替谁做决定。"
  },
  {
    id: "rental-room",
    name: "同居出租屋",
    description: "客厅里有没拆的快递、两份账单和一只没有归属的行李箱。",
    dialogue: "“我只是暂时周转一下。” / “你别把我想得那么复杂。”",
    hint: "账单出现的时间，往往比解释更诚实。"
  },
  {
    id: "wedding-prep",
    name: "婚礼筹备现场",
    description: "婚庆表格、宾客名单和转账截图同时摊在桌上，谁都说自己委屈。",
    dialogue: "“婚礼都快到了，现在查这些是什么意思？”",
    hint: "越临近承诺，越有人想用沉没成本压住问题。"
  },
  {
    id: "late-night-chat",
    name: "深夜聊天记录",
    description: "截图里有安慰、抱怨、撤回，也有几个没有解释的时间缺口。",
    dialogue: "“TA 只是懂我，不像你总是审判我。”",
    hint: "情绪倾诉不一定是出轨，但边界模糊一定会制造第二套亲密关系。"
  },
  {
    id: "hospital-check",
    name: "医院走廊",
    description: "产检时间、同居时间和承诺时间线第一次被放在同一张纸上。",
    dialogue: "“孩子是无辜的，你现在纠结这些还有意义吗？”",
    hint: "孩子无辜，不代表成年人可以跳过事实。"
  },
  {
    id: "broker-office",
    name: "房产中介门店",
    description: "首付来源、贷款资格、房本名字和父母出资被写进不同版本的说法。",
    dialogue: "“名字只是安全感，难道你连这个都不肯给？”",
    hint: "安全感不能替代出资记录和退出机制。"
  }
];

const OBFUSCATION_LINES = [
  "“这不重要吧，反正结果就是 TA 伤害了我。”",
  "“我记不太清了，大概就是那个意思。”",
  "“你非要问这么细，是不是已经站 TA 那边了？”",
  "“当时大家都在，我不可能一个个细节都记得。”",
  "“我承认有些话没说全，但那是因为我也很难受。”"
];

const RELUCTANT_REVEALS = [
  "说到这里，TA 停了两秒，才承认有一笔钱没有放进第一版叙事。",
  "TA 没有否认，只是把“以前的关系”换成了“过去的朋友”。",
  "TA 开始强调自己不是故意隐瞒，而不是解释为什么一开始没说。",
  "TA 承认时间线“可能有点出入”，但拒绝给出具体日期。",
  "TA 把问题推给父母、前任或情绪状态，却没有回答自己能得到什么。"
];

export const CASE_MODE_SEQUENCE = [
  {
    id: "premarital",
    label: "婚前 case",
    brief: "关系尚未进入婚姻，重点查择偶定位、婚史孩子、彩礼房产、债务和承诺是否被包装。",
    stage: "marriageTalk",
    plotIds: [
      "marriage-fraud",
      "debt-transfer",
      "resource-harvest",
      "positioning-lie",
      "romance-transfer-gift-or-loan",
      "bride-price-short-cohabitation",
      "house-name-security-test",
      "hidden-divorce-history",
      "hidden-child-support",
      "major-illness-disclosure",
      "relative-debt-bundle",
      "education-income-fake-profile",
      "pig-butchering-investment",
      "dating-app-bot-vip",
      "ex-borrow-money-reentry",
      "wedding-sunk-cost-pressure",
      "couple-startup-equity",
      "influencer-relationship-content",
      "control-isolation-reporting",
      "cohabitation-renovation-cost",
      "lost-job-hidden-credit"
    ]
  },
  {
    id: "married",
    label: "婚后 case",
    brief: "关系已经进入婚姻或事实共同生活，重点查共同财务、家务育儿、债务、出轨、亲子和双方家庭责任。",
    stage: "firstYear",
    plotIds: [
      "debt-transfer",
      "affair-reversal",
      "child-paternity-trap",
      "hidden-child-support",
      "relative-debt-bundle",
      "fake-divorce-quota",
      "coworker-emotional-affair",
      "pregnancy-timeline-gap",
      "paternity-doubt-after-birth",
      "couple-startup-equity",
      "influencer-relationship-content",
      "control-isolation-reporting",
      "violence-mutual-accusation",
      "lost-job-hidden-credit"
    ]
  },
  {
    id: "confession",
    label: "告解模式",
    brief: "随机当事人用第一人称回看自己的经历，玩家要站在 TA 的视角里查探：自己哪里被坑、哪里自欺、哪里也可能伤害了别人。",
    stage: "dating",
    plotIds: [
      "positioning-lie",
      "resource-harvest",
      "romance-transfer-gift-or-loan",
      "hidden-divorce-history",
      "hidden-child-support",
      "major-illness-disclosure",
      "education-income-fake-profile",
      "pig-butchering-investment",
      "dating-app-bot-vip",
      "ex-borrow-money-reentry",
      "coworker-emotional-affair",
      "pregnancy-timeline-gap",
      "wedding-sunk-cost-pressure",
      "couple-startup-equity",
      "influencer-relationship-content",
      "control-isolation-reporting",
      "cohabitation-renovation-cost",
      "lost-job-hidden-credit"
    ]
  }
];

const STORY_CASE_SEQUENCE = [
  {
    id: "story-00-tutorial-first-contradiction",
    title: "教学章：第一处矛盾",
    setName: "教学模式",
    summary: "孟姐用一件压缩案教你读案：先别急着相信委屈，先找时间线、钱和台词里最硬的矛盾。",
    openingComplaint: "孟姐把一份旧案投到直播屏上。来访者说自己只是被催着结婚、被迫转账，但案卷里有三处地方同时发亮：转账时间、被删动态、以及一句反复出现的“先别问细节”。",
    coldOpen: "开播前，孟姐没有让你直接接当事人。她只放出一段旧录屏：“一个案子最危险的时候，不是没人说话，而是每个人都说得太顺。”",
    suspense: "这不是正式连环案，却会教你后面所有案件的基本动作：复盘场景、交叉追问、整理证据、再阶段指认。",
    mislead: "玩家最容易被第一版哭诉带走，所以教学章会把“委屈”和“证据”故意放在同一个人身上。",
    clueObject: "孟姐的红线笔记",
    transition: "教学章结束后，孟姐把红线笔记收进档案袋。袋口露出第一套案件的匿名资料包：同样的红线，圈住了“稳定推进”四个字。",
    caseMode: "premarital",
    plotId: "romance-transfer-gift-or-loan",
    complainantId: "lin",
    respondentId: "zhou",
    stance: "halfTruth",
    sceneId: "rental-room",
    tutorialChapter: true,
    tutorialTip: "教学目标：至少抓到一处矛盾，再进入阶段指认。启发道具可以帮你指出尚未发现的矛盾点。",
    storyClue: "孟姐的红线笔记会在正式剧情里反复出现：它提醒你，所有漂亮叙事都必须回到时间线和材料。"
  },
  {
    id: "story-01-profile-mask",
    title: "第一案：完美资料",
    setName: "第一套：资料包疑云",
    summary: "一份过于漂亮的择偶资料，把婚史、负债和家庭托举都藏进了“只是包装”。",
    openingComplaint: "何念带着一份近乎完美的择偶资料连线。她说自己只是被周砚误会了包装，但匿名资料包里的被删动态显示，她早在来侦探局前就准备好了另一套叙事。",
    coldOpen: "开播前三分钟，后台收到一份匿名资料包。文件名只有四个字：她在演。资料包里没有结论，只有三张被删动态、两笔转账和一张没有露脸的订婚照。",
    suspense: "真正的问题不是何念有没有包装资料，而是谁提前知道她会来侦探局，并把证据按顺序摆好了。",
    mislead: "旁听席会先把注意力放在外貌、学历和收入包装上，但第一案真正埋下的是“稳定推进”这四个字。",
    clueObject: "被删动态截图",
    transition: "结案后，截图角落里的房产中介门店 LOGO 被技术组放大。它不是背景，而是第二案的现场。",
    caseMode: "premarital",
    plotId: "positioning-lie",
    complainantId: "he",
    respondentId: "zhou",
    stance: "badActorFirst",
    premeditatedActorId: "he",
    sceneId: "late-night-chat",
    storyClue: "被删动态里出现的“稳定推进”，会在第二案变成房本和安全感争议。"
  },
  {
    id: "story-02-house-name",
    title: "第二案：房本安全感",
    setName: "第一套：资料包疑云",
    summary: "第一案留下的稳定关系话术，转成了婚前房产加名和父母出资归属。",
    openingComplaint: "周砚主动连线回应第一案。他没有否认何念截图里的“稳定推进”，而是把问题推到房本加名：“如果都准备结婚了，为什么安全感不能写进合同？”",
    coldOpen: "第二天，周砚主动连线。他没有否认第一案里的截图，只说：“如果一个人真想结婚，为什么不能给安全感？”镜头外，有人轻轻敲了两下桌面。",
    suspense: "周砚像是来反击何念，但他带来的购房材料太完整，完整到不像临时自证。",
    mislead: "这案看起来是房本加不加名，其实要查谁在用“安全感”替父母出资、贷款资格和退出机制挡刀。",
    clueObject: "购房合同角落的手写编号",
    transition: "合同编号被录入系统后，弹出一条旧记录：同一位婚庆经理，三个月内经手过两场突然取消的订婚宴。",
    caseMode: "premarital",
    plotId: "house-name-security-test",
    complainantId: "zhou",
    respondentId: "he",
    stance: "badActorFirst",
    premeditatedActorId: "zhou",
    sceneId: "broker-office",
    storyClue: "房本争议没有停在两个人之间，双方父母的账本会把第三案推到婚礼桌上。"
  },
  {
    id: "story-03-bride-price",
    title: "第三案：酒席和彩礼",
    setName: "第一套：资料包疑云",
    summary: "办酒、短暂同居和礼金流水纠缠在一起，谁都说自己已经付出了足够多。",
    openingComplaint: "婚庆经理先把尾款单传进后台，随后陈默和林鹿几乎同时申请连线。两个人都说自己被婚礼进度拖住，但尾款单上的排期显示，这不是第一次有人在临门一脚改口。",
    coldOpen: "第三案不是当事人先来的，是婚庆经理先把一张酒席尾款单传进后台。备注栏写着：退婚原因不要写真实的。",
    suspense: "陈默和林鹿都说自己是被拖到这一步的人，但酒席名单里出现了第一案房产合同旁同一家婚庆公司的经办人。",
    mislead: "彩礼金额会很吵，酒席礼金会很乱，但真正的悬念是：谁在利用婚礼临近这件事制造停不下来的压力。",
    clueObject: "婚庆尾款单",
    transition: "尾款单背面拍到一行小字：亲属借款先过桥，婚后共同还。第四案的债务从这里开始露头。",
    caseMode: "premarital",
    plotId: "bride-price-short-cohabitation",
    complainantId: "chen",
    respondentId: "lin",
    stance: "personalityMismatch",
    sceneId: "wedding-prep",
    storyClue: "礼金和彩礼只是表面，真正进入婚后的，是原生家庭债务和责任捆绑。"
  },
  {
    id: "story-04-relative-debt",
    title: "第四案：亲属债务",
    setName: "第一套：资料包疑云",
    summary: "小家庭刚开始共同生活，亲属借款、担保和父母医疗债同时进入账本。",
    openingComplaint: "林鹿上传家庭群截图后才开麦。她不再问陈默爱不爱她，只问：为什么一笔亲属借款会先经过婚庆尾款，再进入他们的共同账户。",
    coldOpen: "第四案开场，林鹿没有哭。她只上传了一张家庭群截图：大家都在说“先帮你哥过这一关”，唯独没人问这笔钱从哪里来。",
    suspense: "陈默看起来像被家庭推着走，但他每次沉默都刚好避开了担保、借条和共同账户的关键日期。",
    mislead: "这案容易被看成凤凰男或原生家庭负担，但真正要查的是：小家庭什么时候被悄悄接入了别人的债务系统。",
    clueObject: "家庭群截图",
    transition: "债务复盘到最后，一个深夜转账对象浮出水面。备注不是亲属名，而是“项目咨询”。第五案的同事出现了。",
    caseMode: "married",
    plotId: "relative-debt-bundle",
    complainantId: "lin",
    respondentId: "chen",
    stance: "trueVictim",
    premeditatedActorId: "chen",
    sceneId: "rental-room",
    storyClue: "债务压力让情绪外包更容易发生，下一案会从账本滑向边界。"
  },
  {
    id: "story-05-emotional-affair",
    title: "第五案：同事情绪外包",
    setName: "第一套：资料包疑云",
    summary: "一段婚后深夜聊天被说成工作倾诉，但报销、出差和删改记录对不上。",
    openingComplaint: "沈知夏把聊天记录投到屏幕上。许照承认情绪外包，却坚持没有越界；但他删掉的那段语音，关键词不是暧昧，而是“资料夹”。",
    coldOpen: "沈知夏把聊天记录投到屏幕上，第一句话不是暧昧，而是：“你终于懂我为什么不想回家。”弹幕安静了三秒。",
    suspense: "许照承认自己情绪外包，却坚持没有越界。问题是，他删掉的不是暧昧称呼，而是一段关于前四案的共同资料。",
    mislead: "这案看起来是婚内边界，其实它第一次证明：前面几案不是偶然同题，而是被同一套亲密关系话术反复利用。",
    clueObject: "被撤回的深夜语音",
    transition: "语音恢复后，只剩一句话：“如果他们都愿意讲自己的版本，我们就能把局做完整。”终局告解由此打开。",
    caseMode: "married",
    plotId: "coworker-emotional-affair",
    complainantId: "shen",
    respondentId: "xu",
    stance: "halfTruth",
    sceneId: "late-night-chat",
    storyClue: "第五案没有给出爽快结论，因为终局要回到当事人的自我告解里。"
  },
  {
    id: "story-06-confession",
    title: "第六案：告解终局",
    setName: "第一套：资料包疑云",
    summary: "当事人回看整条关系链，必须拆开自己哪里被坑、哪里自欺、哪里也伤害了别人。",
    openingComplaint: "许照没有带来新的控诉。他打开六案共用资料夹，承认自己曾经把别人的包装、房本、彩礼、债务和情绪外包都当成素材，想证明自己才是唯一看清关系的人。",
    coldOpen: "终局没有新的来访者。屏幕亮起时，许照坐在黑场里，说：“前五案你们都以为在查别人，其实也在查我。”",
    suspense: "告解者把所有线索都串得太顺了。顺到你必须反过来问：这是忏悔，还是最后一次控制叙事？",
    mislead: "终局不再奖励你找到唯一坏人。它要求你判断：被坑、自欺、伤害别人，能不能同时发生在同一个人身上。",
    clueObject: "六案共用资料夹",
    transition: "资料夹最后一页没有证据，只有孟姐的一句批注：能重来的不是人生，是你下一次识别叙事的速度。",
    caseMode: "confession",
    plotId: "control-isolation-reporting",
    complainantId: "xu",
    respondentId: "shen",
    stance: "selfDoubt",
    sceneId: "family-dinner",
    storyClue: "终局不再寻找唯一反派，而是把六案里的包装、资源、账本和控制全部连起来。"
  },
  {
    id: "story-07-platform-intake",
    title: "第二套第一案：入会测评",
    setName: "第二套：模板回声",
    summary: "第一套的共用资料夹没有结束，它指向一家婚恋咨询平台：测评表把人分成可推进、可付费、可施压。",
    openingComplaint: "沈知夏带来一份平台入会测评表。表面上它只是婚恋咨询，背后却把第一套案件里的“稳定推进、房本安全感、婚礼压力”做成了收费话术。",
    coldOpen: "终局资料夹被封存的第三天，后台收到一封自动邮件：恭喜你完成亲密关系风险测评。附件里，第一题就是“你愿意为安全感支付多少成本”。",
    suspense: "这套测评像是从第一套案件里长出来的，但它的时间戳早于许照告解。",
    mislead: "这案容易被看成普通婚恋平台割韭菜，但真正的问题是：谁把真实案件改写成可复制的付费模板。",
    clueObject: "平台入会测评表",
    transition: "测评表最后一页要求上传征信和资产截图。第二套第二案的贷款材料，就从这里流出。",
    caseMode: "premarital",
    plotId: "education-income-fake-profile",
    complainantId: "shen",
    respondentId: "xu",
    stance: "trueVictim",
    sceneId: "late-night-chat",
    premeditatedActorId: "xu",
    bridgeClue: "它回收第一套的六案资料夹：许照不是终点，平台才是把叙事模板商品化的人。",
    storyClue: "平台测评表把第一套里的“稳定推进”改成付费筛选项，说明两套案件共享同一套话术源头。"
  },
  {
    id: "story-08-credit-mirror",
    title: "第二套第二案：征信镜像",
    setName: "第二套：模板回声",
    summary: "入会测评后的征信截图被用于制造婚前焦虑，债务与房本再次被绑在一起。",
    openingComplaint: "周砚收到一份匿名征信截图，对方说这是“婚前诚意核验”。但截图里的裁剪方式，和第一套房本案里那份购房合同附件一模一样。",
    coldOpen: "周砚第二次坐到镜头前，这次他没有谈安全感。他把手机举近摄像头：有人把他的征信做成了付费报告，标题叫《婚前风险等级》。",
    suspense: "征信截图可能是真的，使用它的人却不一定有正当目的。",
    mislead: "玩家会先想判断周砚有没有债务，但本案真正要查的是：谁在用“核验”包装信息勒索。",
    clueObject: "婚前风险等级报告",
    transition: "报告模板底部有一个灰色水印：宴席延期保障。第三案会把这套风险评级推到婚礼现场。",
    caseMode: "premarital",
    plotId: "lost-job-hidden-credit",
    complainantId: "zhou",
    respondentId: "he",
    stance: "halfTruth",
    sceneId: "broker-office",
    bridgeClue: "它回收第一套第二案的房本材料：同样的安全感话术，被平台升级成信用评级。",
    storyClue: "征信报告把第一套房本安全感和第二套平台测评连起来，证明“核验”也可能被滥用成控制工具。"
  },
  {
    id: "story-09-wedding-delay",
    title: "第二套第三案：延期保障",
    setName: "第二套：模板回声",
    summary: "婚礼延期保障服务制造新的沉没成本，第一套婚庆经办人再次出现。",
    openingComplaint: "何念上传一份“婚礼延期保障”合同。她说这是为了减少损失，陈默却发现合同推荐人正是第一套酒席案里的婚庆经办人。",
    coldOpen: "合同第一页写着：延期不是失败，是重新谈判的机会。孟姐看完只说了一句：“这不像保险，像话术。”",
    suspense: "婚礼延期保障把“都到这一步了”包装成服务条款，甚至能自动生成给双方父母看的解释模板。",
    mislead: "这案不只是退不退钱，而是谁在利用延期把彩礼、房本、父母脸面重新绑在一起。",
    clueObject: "婚礼延期保障合同",
    transition: "合同附带的家庭沟通模板里，有一段关于“先帮亲属周转”的话。第四案的债务入口再次打开。",
    caseMode: "premarital",
    plotId: "wedding-sunk-cost-pressure",
    complainantId: "he",
    respondentId: "chen",
    stance: "badActorFirst",
    premeditatedActorId: "he",
    sceneId: "wedding-prep",
    bridgeClue: "它回收第一套第三案的婚庆经办人：同一个人把临门一脚的压力做成了合同产品。",
    storyClue: "延期保障合同证明第一套的婚庆压力不是偶发，而是第二套平台服务的一环。"
  },
  {
    id: "story-10-family-debt-app",
    title: "第二套第四案：亲属互助",
    setName: "第二套：模板回声",
    summary: "家庭互助小程序把亲属债务变成情感积分，小家庭再次被接入外部账本。",
    openingComplaint: "林鹿发现陈默家族群开始使用一款互助小程序。每笔亲属周转都有“孝顺值”和“家庭贡献榜”，而榜单模板来自第二套平台后台。",
    coldOpen: "林鹿没有再上传聊天截图，她上传的是一张排行榜：第一名不是还钱最多的人，而是“最愿意理解家人”的人。",
    suspense: "互助小程序看起来是家庭内部工具，却能读取婚恋平台的风险等级和婚礼延期合同。",
    mislead: "这案容易被看成陈默家里又缺钱了，但真正要查的是：亲情如何被系统化成债务服从。",
    clueObject: "亲属互助小程序",
    transition: "小程序后台显示一条客服备注：高情绪依赖用户，适合转入陪伴服务。第五案的情绪外包不再只是同事关系。",
    caseMode: "married",
    plotId: "relative-debt-bundle",
    complainantId: "lin",
    respondentId: "chen",
    stance: "trueVictim",
    premeditatedActorId: "chen",
    sceneId: "rental-room",
    bridgeClue: "它回收第一套第四案的家庭群截图：亲属债务从人工劝说升级成了系统化排名。",
    storyClue: "互助小程序把第一套的债务捆绑与第二套平台后台连上，说明亲情也被做成了可运营的压力模型。"
  },
  {
    id: "story-11-companion-service",
    title: "第二套第五案：陪伴服务",
    setName: "第二套：模板回声",
    summary: "平台提供的陪伴服务接管了婚内情绪外包，删改记录与第一套深夜语音形成镜像。",
    openingComplaint: "沈知夏收到许照的账单：每月固定支付给“关系陪伴顾问”。许照说那只是咨询，但顾问话术里出现了第一套被撤回语音的原句。",
    coldOpen: "账单金额不高，备注却很刺眼：夜间稳定陪伴。沈知夏把它念出来时，许照第一次没有立刻解释。",
    suspense: "陪伴服务可能提供真实支持，也可能把婚内孤独变成可持续收费入口。",
    mislead: "这案看起来像精神出轨，但它更关键的矛盾是：平台是否在主动训练用户把伴侣排除在沟通之外。",
    clueObject: "夜间陪伴账单",
    transition: "陪伴顾问的账号归属被查到后，终局入口出现：管理员不是陌生人，而是第一套终局资料夹里被隐藏的共编者。",
    caseMode: "married",
    plotId: "coworker-emotional-affair",
    complainantId: "shen",
    respondentId: "xu",
    stance: "halfTruth",
    sceneId: "late-night-chat",
    bridgeClue: "它回收第一套第五案的深夜语音：情绪外包从私人越界变成平台服务。",
    storyClue: "夜间陪伴账单证明第二套不是新问题，而是第一套情绪外包话术的商业化版本。"
  },
  {
    id: "story-12-template-confession",
    title: "第二套第六案：模板告解",
    setName: "第二套：模板回声",
    summary: "管理员用第一套所有案件训练出一套告解模板，最后一次要求玩家分辨自省、被坑和操控。",
    openingComplaint: "管理员主动连线，自称只是把大家的痛苦整理成工具。TA 说平台没有制造伤害，只是让真实关系更快暴露问题。孟姐没有打断，只把第一套六案资料夹重新投到屏幕上。",
    coldOpen: "终局开场没有人哭，也没有人喊冤。管理员平静地说：“你们解决了十二个案子，却还没回答一个问题：如果模板真的有效，它算伤害吗？”",
    suspense: "管理员的告解太像产品发布会。每一句自省后面，都藏着一次责任转移。",
    mislead: "终局会诱导玩家把平台简化成唯一反派，但更难的是判断：真实痛苦被整理成工具之后，谁被帮助，谁被收割。",
    clueObject: "告解模板后台",
    transition: "后台最后一条日志停在孟姐的红线笔记旁：教学章那句“先找矛盾”，现在变成了全剧的答案。",
    caseMode: "confession",
    plotId: "control-isolation-reporting",
    complainantId: "xu",
    respondentId: "shen",
    stance: "selfJustifying",
    sceneId: "family-dinner",
    bridgeClue: "它回收第一套终局和教学章：同一套识别矛盾的方法，既能保护人，也可能被人拿去设计别人。",
    storyClue: "告解模板后台把两套案件互相扣住：第一套提供真实痛苦，第二套展示痛苦如何被产品化。"
  }
];

export function generateStoryCaseSequence(npcs, attrs, options = {}) {
  const runNumber = options.runNumber ?? 0;
  return STORY_CASE_SEQUENCE.map((item, index) => {
    const mode = CASE_MODE_SEQUENCE.find((caseMode) => caseMode.id === item.caseMode) ?? CASE_MODE_SEQUENCE[0];
    const brief = generateLivestreamCase(npcs, attrs, {
      order: index + 1,
      caseMode: mode,
      runNumber,
      plotId: item.plotId,
      complainantId: item.complainantId,
      respondentId: item.respondentId,
      stance: item.stance,
      sceneId: item.sceneId,
      forcedPremeditated: Boolean(item.premeditatedActorId),
      premeditatedActorId: item.premeditatedActorId
    });
    return {
      ...brief,
      id: item.id,
      storyCaseId: item.id,
      storyArcTitle: item.title,
      storyArcSummary: item.summary,
      storySetName: item.setName ?? "故事模式",
      storySetIndex: storySetIndexFor(item),
      storyCaseInSet: storyCaseInSetFor(item),
      openingComplaint: item.openingComplaint ?? brief.openingComplaint,
      storyColdOpen: item.coldOpen,
      storySuspense: item.suspense,
      storyMislead: item.mislead,
      storyClueObject: item.clueObject,
      storyClue: item.storyClue,
      storyBridgeClue: item.bridgeClue,
      storyTransition: item.transition,
      tutorialChapter: Boolean(item.tutorialChapter),
      tutorialTip: item.tutorialTip,
      evidenceCards: [...buildStoryEvidenceCards(item), ...(brief.evidenceCards ?? [])],
      confessionTimeline: item.caseMode === "confession" ? buildStoryConfessionTimeline(item, brief.confessionTimeline) : brief.confessionTimeline,
      fixedStory: true
    };
  });
}

function storySetIndexFor(item) {
  if (item.tutorialChapter) return 0;
  if (item.setName?.includes("第二套")) return 2;
  return 1;
}

function storyCaseInSetFor(item) {
  if (item.tutorialChapter) return 0;
  const match = item.title?.match(/第([一二三四五六])案|第二套第([一二三四五六])案/);
  const value = match?.[1] ?? match?.[2];
  return { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6 }[value] ?? 1;
}

function buildStoryEvidenceCards(item) {
  const commonTargets = ["ambiguous", "reluctant", "truthWithGap", "defensive", "sceneHint", "selfDoubt", "shadowVersion", "halfLie"];
  const base = {
    id: `${item.id}-story-clue`,
    type: "主线物证",
    title: item.clueObject,
    front: item.suspense,
    detail: item.transition,
    targets: commonTargets,
    contradiction: `主线物证《${item.clueObject}》证明本案不是孤立事件：${item.storyClue}`
  };
  const bridge = item.bridgeClue ? {
    id: `${item.id}-bridge-clue`,
    type: "跨套线索",
    title: "第一套回收点",
    front: item.bridgeClue,
    detail: "这条线索说明第二套案件不是新的随机危机，而是在复用第一套已经验证过的亲密关系压力模板。",
    targets: commonTargets,
    contradiction: `跨套线索证明两套正式案件互相关联：${item.bridgeClue}`
  } : null;
  const extras = {
    "story-03-bride-price": {
      id: "story-03-wedding-manager",
      type: "排期表",
      title: "婚庆经理经办记录",
      front: "排期表显示，同一位婚庆经办人同时出现在第二案房产合同附件和第三案酒席尾款单里。",
      detail: "这让“临近婚礼才谈条件”不再只是两个人的临时争吵，而像一种可复制的推进方式。",
      targets: commonTargets,
      contradiction: "婚庆经办记录把第二案房本安全感和第三案酒席彩礼连到同一个压力节点。"
    },
    "story-05-emotional-affair": {
      id: "story-05-recovered-voice",
      type: "音频恢复",
      title: "被撤回的深夜语音",
      front: "恢复后的语音只剩一句：“如果他们都愿意讲自己的版本，我们就能把局做完整。”",
      detail: "这句话让第五案从情绪外包滑向主线：有人在把前四案的当事人叙事当成同一套资料。",
      targets: commonTargets,
      contradiction: "被撤回语音证明许照删掉的不是暧昧称呼，而是他对前四案资料的参与。"
    },
    "story-06-confession": {
      id: "story-06-shared-folder",
      type: "资料夹",
      title: "六案共用资料夹",
      front: "资料夹按“包装、房本、彩礼、债务、情绪、告解”六个标签排列，时间戳早于部分当事人连线。",
      detail: "这不是一份普通复盘，而是有人提前把关系里的常见话术整理成了可调用模板。",
      targets: commonTargets,
      contradiction: "六案共用资料夹证明终局告解不是突然自省，而是对前五案叙事控制欲的回收。"
    }
  };
  return [base, bridge, extras[item.id]].filter(Boolean);
}

function buildStoryConfessionTimeline(item, fallback = []) {
  if (item.id === "story-12-template-confession") {
    return [
      {
        id: "tutorial-red-line",
        label: "教学章：红线笔记",
        text: "管理员承认，平台最早不是从复杂案开始，而是从孟姐教学章那种“找第一处矛盾”的方法里学会了拆解用户。",
        correctMark: "hurtOther",
        contradiction: "模板告解：平台把教学章的识别方法反向用于筛选脆弱用户。"
      },
      {
        id: "first-set-folder",
        label: "第一套：六案资料夹",
        text: "TA 说第一套案件只是公开素材，但后台日志显示，资料夹在部分案件开播前就已经生成标签。",
        correctMark: "selfBlind",
        contradiction: "模板告解：管理员把提前整理资料包装成事后复盘，回避了自己对案件推进的参与。"
      },
      {
        id: "paid-intake",
        label: "第二套：入会测评",
        text: "测评表把“安全感、诚意、家庭责任、情绪陪伴”做成付费项。管理员说这只是帮助用户表达需求。",
        correctMark: "hurtOther",
        contradiction: "模板告解：平台把真实痛苦转换成付费按钮，帮助和收割之间的边界被故意模糊。"
      },
      {
        id: "credit-control",
        label: "第二套：征信镜像",
        text: "TA 反复强调核验很重要，却没有解释为什么用户资料会被裁剪成可传播的风险报告。",
        correctMark: "hurtByOther",
        contradiction: "模板告解：征信核验被平台滥用成信息控制，真实风险被改写成勒索筹码。"
      },
      {
        id: "family-score",
        label: "第二套：亲属互助",
        text: "家庭互助榜单被称作“减少沟通成本”，但它让不愿意承担外部债务的人自动变成不孝。",
        correctMark: "hurtOther",
        contradiction: "模板告解：亲属互助榜单把家庭压力系统化，制造新的道德债务。"
      },
      {
        id: "final-product-demo",
        label: "最终：产品式忏悔",
        text: "管理员讲得冷静、完整、像一场产品发布。越像自省，越要检查 TA 是否把责任转移给“用户自己的选择”。",
        correctMark: "selfBlind",
        contradiction: "模板告解：管理员的完整忏悔仍在控制叙事，把平台设计造成的伤害推回用户选择。"
      }
    ];
  }
  if (item.id !== "story-06-confession") return fallback;
  return [
    {
      id: "profile-mask",
      label: "第一案：资料包装",
      text: "许照承认，何念的完美资料让他第一次意识到：只要把婚史、负债和家庭压力改写成“普通包装”，旁听席就会先争论她值不值得，而不是她隐瞒了什么。",
      correctMark: "hurtOther",
      contradiction: "终局告解：许照不是旁观第一案，他从资料包装里学会了如何让别人替叙事做情绪劳动。"
    },
    {
      id: "house-name",
      label: "第二案：安全感话术",
      text: "周砚把房本加名说成安全感，许照说自己当时只是在记录话术。但资料夹里，“安全感”被标成了可复用关键词。",
      correctMark: "selfBlind",
      contradiction: "终局告解：许照把控制话术当成观察样本，却没有承认自己也被这套话术吸引。"
    },
    {
      id: "wedding-pressure",
      label: "第三案：停不下来的婚礼",
      text: "酒席和彩礼把所有人都推到“都到这一步了”的位置。许照承认，他最早看见沉没成本如何替真相封口。",
      correctMark: "hurtByOther",
      contradiction: "终局告解：婚礼压力不是单案背景，而是整条主线里最稳定的逼迫装置。"
    },
    {
      id: "debt-system",
      label: "第四案：债务接入",
      text: "亲属债务进入小家庭时，许照没有提醒当事人。他说自己只是想确认：账本是不是比承诺更能暴露关系真实结构。",
      correctMark: "hurtOther",
      contradiction: "终局告解：许照用“观察”包装了自己的不介入，让伤害继续扩大。"
    },
    {
      id: "emotional-outsourcing",
      label: "第五案：情绪外包",
      text: "深夜语音里，许照终于从观察者变成参与者。他把别人的痛苦整理成资料，也把自己的孤独交给了不该接住的人。",
      correctMark: "selfBlind",
      contradiction: "终局告解：情绪外包不是第五案的偶发越界，而是许照一直拒绝承认自己也在索取情绪供养。"
    },
    {
      id: "confession-control",
      label: "第六案：最后一次叙事控制",
      text: "许照坐到镜头前告解，讲得完整、清醒、有结构。你必须判断：这是自省，还是他最后一次把所有人的故事排成对自己有利的顺序。",
      correctMark: "selfBlind",
      contradiction: "终局告解：越完整的忏悔越需要被核验，因为自省也可能成为控制叙事的方式。"
    }
  ];
}

export function generateCaseSequence(npcs, attrs, options = {}) {
  const usedPlots = new Set();
  const runNumber = options.runNumber ?? 0;
  const modes = options.modes ?? buildAnchorModeSequence(options.count ?? randomRangeInt(3, 5));
  return modes.map((mode, index) => {
    const brief = generateLivestreamCase(npcs, attrs, {
      order: index + 1,
      caseMode: mode,
      usedPlots,
      runNumber,
      forcedPremeditated: shouldForcePremeditated(runNumber, index, mode)
    });
    usedPlots.add(brief.plotId);
    return brief;
  });
}

function buildAnchorModeSequence(count) {
  const nonConfession = CASE_MODE_SEQUENCE.filter((mode) => mode.id !== "confession");
  const includeConfession = Math.random() < 0.75;
  const mainCount = includeConfession ? Math.max(1, count - 1) : count;
  const main = Array.from({ length: mainCount }, () => randomItem(nonConfession));
  return includeConfession ? [...main, CASE_MODE_SEQUENCE.find((mode) => mode.id === "confession")] : main;
}

function randomRangeInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shouldForcePremeditated(runNumber, index, mode) {
  if (mode.id === "confession") return false;
  if (runNumber === 0) return index === 0;
  if (runNumber === 1) return index <= 1;
  return false;
}

export function generateLivestreamCase(npcs, attrs, options = {}) {
  const mode = normalizeCaseMode(options.caseMode, options.order);
  const modePlotIds = new Set(mode.plotIds);
  const matchingPlots = LIVESTREAM_PLOT_LIBRARY.filter((item) => modePlotIds.has(item.id));
  const availablePlots = matchingPlots.filter((item) => !options.usedPlots?.has(item.id));
  const explicitPlot = options.plotId ? LIVESTREAM_PLOT_LIBRARY.find((item) => item.id === options.plotId) : null;
  const plot = explicitPlot ?? randomItem(availablePlots.length ? availablePlots : LIVESTREAM_PLOT_LIBRARY);
  const complainantGender = randomItem(plot.possibleComplainants);
  const complainantPool = npcs.filter((npc) => npc.gender === complainantGender);
  const respondentPool = npcs.filter((npc) => npc.gender !== complainantGender);
  const complainant = npcs.find((npc) => npc.id === options.complainantId) ?? randomItem(complainantPool) ?? randomItem(npcs);
  const respondent = npcs.find((npc) => npc.id === options.respondentId) ?? randomItem(respondentPool) ?? randomItem(npcs.filter((npc) => npc.id !== complainant?.id));
  const forcedPremeditated = Boolean(options.forcedPremeditated || options.premeditatedActorId);
  const stance = options.stance ?? (mode.id === "confession"
    ? randomItem(["selfDoubt", "selfJustifying", "trueVictim", "halfTruth"])
    : forcedPremeditated
      ? randomItem(["halfTruth", "badActorFirst"])
      : randomItem(["trueVictim", "halfTruth", "badActorFirst", "personalityMismatch"]));
  const hiddenFacts = shuffle(plot.hiddenFacts).slice(0, forcedPremeditated || mode.id === "confession" ? 3 : 2);
  const exaggerations = shuffle(plot.exaggerations).slice(0, forcedPremeditated || mode.id === "confession" ? 3 : 2);
  const evidence = shuffle(plot.evidence).slice(0, forcedPremeditated || mode.id === "confession" ? 4 : 3);
  const scene = CASE_SCENES.find((item) => item.id === options.sceneId) ?? randomItem(CASE_SCENES);
  const premeditatedActorId = forcedPremeditated ? options.premeditatedActorId ?? randomItem([complainant?.id, respondent?.id].filter(Boolean)) : null;
  const order = options.order ?? 1;
  const difficultyBase = mode.id === "premarital" ? 3 : mode.id === "married" ? 5 : 6;
  const difficulty = Math.min(10, Math.max(1, difficultyBase + hiddenFacts.length + exaggerations.length - Math.floor(((attrs.eq ?? 4) + (attrs.education ?? 4)) / 7)));

  return {
    id: `${plot.id}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
    order,
    caseMode: mode.id,
    modeLabel: mode.label,
    modeBrief: mode.brief,
    stage: mode.stage,
    plotId: plot.id,
    label: plot.label,
    publicHook: plot.publicHook,
    truth: plot.truth,
    stance,
    premeditated: forcedPremeditated,
    premeditatedActorId,
    complainantId: complainant?.id ?? null,
    respondentId: respondent?.id ?? null,
    complainantGender,
    hiddenFacts,
    exaggerations,
    evidence,
    evidenceCards: buildEvidenceCards(plot, scene, complainant, respondent, hiddenFacts, exaggerations, evidence),
    scene,
    sceneVersions: buildSceneVersions(scene, complainant, respondent, hiddenFacts, exaggerations, forcedPremeditated, mode.id),
    testimony: buildTestimony(plot, scene, complainant, respondent, stance, hiddenFacts, exaggerations, forcedPremeditated, mode.id),
    confessionTimeline: mode.id === "confession" ? buildConfessionTimeline(scene, complainant, respondent, hiddenFacts, exaggerations, plot.truth) : [],
    difficulty,
    openingComplaint: openingComplaintFor(plot, stance, complainant, respondent, mode.id, options.runNumber ?? 0, order)
  };
}

function buildEvidenceCards(plot, scene, complainant, respondent, hiddenFacts, exaggerations, evidence) {
  const name = complainant?.name ?? "来访者";
  const other = respondent?.name ?? "对方";
  const gap = hiddenFacts[0] ?? "关键事实";
  const secondGap = hiddenFacts[1] ?? "另一处隐瞒";
  const packaging = exaggerations[0] ?? "自身条件";
  const secondPackaging = exaggerations[1] ?? "关系承诺";
  const base = [
    {
      id: "prior-statement-pressure",
      type: "话术回放",
      title: "上一段直播录屏",
      front: `${name} 之前说：“我从来没主动要过结果，只是被逼到这里。”`,
      detail: `录屏时间比${scene.name}早一天，里面已经出现 ${gap} 和 ${packaging}。`,
      targets: ["ambiguous"],
      contradiction: `直播录屏显示，${name} 不是被突然逼到现场，而是提前把 ${gap} 和 ${packaging} 带进了叙事。`
    },
    {
      id: "wechat-screenshot",
      type: "微信截图",
      title: "聊天截图九宫格",
      front: `${other} 发来三张截图，其中一张被打码的位置正好是转账/承诺前后。`,
      detail: `截图里有人把“以后再说”改成“你先表态”，语气和直播叙述不一致。`,
      targets: ["reluctant", "truthWithGap", "shadowVersion"],
      contradiction: `微信截图证明，${secondGap} 的时间点被双方都修剪过。`
    },
    {
      id: "luxury-outfit-photo",
      type: "图片证据",
      title: "高级服装试穿照",
      front: `朋友圈照片里出现一套明显高价的通勤/宴会服装，配文是“重要场合要体面”。`,
      detail: `照片发布时间紧贴 ${packaging} 被包装的节点，消费能力和自述压力不完全匹配。`,
      targets: ["halfLie", "selfDoubt"],
      contradiction: `高级服装图片不能证明人品，但能证明 ${packaging} 的呈现经过精心设计。`
    },
    {
      id: "skincare-receipt",
      type: "消费截图",
      title: "高级护肤品订单",
      front: `购物记录显示一组高价护肤品/医美项目，备注是“见家长前急用”。`,
      detail: `订单和诉苦里的“我没想包装自己”存在冲突。`,
      targets: ["halfLie", "self-packaging"],
      contradiction: `护肤品订单说明 ${name} 并非只是被动进入关系，也主动参与了 ${packaging} 的包装。`
    },
    {
      id: "social-post-archive",
      type: "社媒存档",
      title: "被删动态截图",
      front: `共同朋友保存过一条动态，里面出现 ${other}、礼物、餐厅定位和一句“稳定推进”。`,
      detail: `这条动态后来被删除，和直播里“关系一直没确认”的说法对不上。`,
      targets: ["defensive", "sceneHint"],
      contradiction: `被删动态把关系阶段往前推了一格，不能再只听“我们没说清楚”。`
    }
  ];

  return base.concat(evidence.slice(0, 3).map((item, index) => ({
    id: `material-${index}`,
    type: "材料卡",
    title: item,
    front: `案卷材料：${item}`,
    detail: `${item} 只能证明局部事实，需要和台词、时间线一起看。`,
    targets: ["sceneHint", "truthWithGap", "defensive", "selfDoubt"],
    contradiction: `${item} 把 ${plot.label} 的争议从情绪拉回了材料。`
  })));
}

function normalizeCaseMode(mode, order = 1) {
  if (typeof mode === "object" && mode?.id) return mode;
  return CASE_MODE_SEQUENCE.find((item) => item.id === mode) ?? CASE_MODE_SEQUENCE[Math.max(0, Math.min(order - 1, CASE_MODE_SEQUENCE.length - 1))] ?? CASE_MODE_SEQUENCE[0];
}

function buildSceneVersions(scene, complainant, respondent, hiddenFacts, exaggerations, premeditated, caseMode) {
  const name = complainant?.name ?? "来访者";
  const other = respondent?.name ?? "对方";
  const gap = hiddenFacts[0] ?? "关键事实";
  const packaging = exaggerations[0] ?? "自身条件";
  if (caseMode === "confession") {
    return [
      {
        speakerId: complainant?.id ?? null,
        speaker: `${name} 的自述`,
        version: `${name} 说，自己现在回看${scene.name}，才发现当时有些不舒服被自己压下去了。`,
        doubt: `TA 把重点放在“我当时太傻”，但还没说清 ${gap}。`,
        contradiction: `如果 TA 当时已经察觉不对，为什么还继续配合 ${packaging} 这套说法？`,
        reliability: "mixed"
      },
      {
        speakerId: respondent?.id ?? null,
        speaker: `${other} 的影子版本`,
        version: `${other} 没有直接在场连线，只能从聊天、账单和共同朋友口中拼出另一个版本。`,
        doubt: "告解模式里，缺席者也可能被叙述者塑造成单纯恶人。",
        contradiction: `缺席者版本提示：${gap} 不是突然发生，而是被多次绕开。`,
        reliability: "partial"
      },
      {
        speakerId: null,
        speaker: "自我核验材料",
        version: `材料只能证明 ${name} 确实经历过${scene.name}，不能证明 TA 对自己动机的解释完全可靠。`,
        doubt: "人在告解时也会保护自尊，把选择说成被迫，把收益说成偶然。",
        contradiction: `真正要查的是：${name} 有没有在 ${gap} 和 ${packaging} 上同时骗过别人，也骗过自己。`,
        reliability: "partial"
      }
    ];
  }
  return [
    {
      speakerId: complainant?.id ?? null,
      speaker: name,
      version: `${name} 说，当时 ${other} 在${scene.name}突然施压，自己只是被迫回应。TA 复述得很快，快到像背熟了一段对自己有利的开场白。`,
      doubt: `TA 把“突然”说得很重，但没有主动说明 ${gap}，也没有解释为什么自己提前准备了材料。`,
      contradiction: `如果真是突然施压，为什么 ${packaging} 的说法在前一天已经出现在聊天里？`,
      reliability: premeditated ? "low" : "mixed"
    },
    {
      speakerId: respondent?.id ?? null,
      speaker: other,
      version: `${other} 说，那天不是逼迫，而是双方早就约好把钱、家里和未来说清楚。TA 一边否认施压，一边把自己塑造成唯一还愿意讲道理的人。`,
      doubt: `TA 反驳得很快，但对自己能得到什么讲得很轻，像是把收益藏进了“沟通成本”里。`,
      contradiction: `TA 说“早就约好”，却拿不出明确约定，只能拿出几个含糊表情包。`,
      reliability: "mixed"
    },
    {
      speakerId: null,
      speaker: "第三方/现场材料",
      version: `现场材料只证明大家确实在${scene.name}出现过，不证明任何一方的完整版本就是真的。`,
      doubt: "场景复原不是监控录像，它仍然是被选择过的叙事。",
      contradiction: `现场材料和双方叙事共同指向：${gap} 与 ${packaging} 需要被单独核验。`,
      reliability: "partial"
    }
  ];
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function openingComplaintFor(plot, stance, complainant, respondent, caseMode, runNumber = 0, order = 1) {
  const name = complainant?.name ?? "来访者";
  const other = respondent?.name ?? "对方";
  if (runNumber === 0 && order === 1) {
    return `${name} 是今晚第一个连线者。TA 说自己只想要一个说法，镜头却拍到 TA 手边放着两份材料：一份聊天截图，一份被折过的转账记录。${other} 还没进线，旁听席已经开始替 ${name} 下判断。`;
  }
  if (runNumber === 1 && order === 1) {
    return `${name} 的叙事几乎无懈可击：时间点清楚、证据齐全、连自己可能被误会的地方都提前解释过。越完整的故事，越像一间打扫过的房间，需要检查被收进抽屉里的东西。`;
  }
  if (caseMode === "premarital") return `${name} 带着一段还没真正进入婚姻的关系来咨询：TA 想知道眼前的问题是普通磨合，还是婚前就该止损的风险。${other} 的名字被反复提起，但每次都停在最关键的半句话前。`;
  if (caseMode === "married") return `${name} 连线侦探局，说婚后矛盾已经从情绪变成账本、责任和家庭边界。TA 不再问“还爱不爱”，而是问“这笔账、这个孩子、这套房，到底是谁的责任”。`;
  if (caseMode === "confession") {
    if (stance === "selfJustifying") return `${name} 选择告解自己的经历，但 TA 的讲法像是在替过去的选择寻找理由。TA 说“我不是完全没错”，却总能把每个错误讲成迫不得已。`;
    if (stance === "selfDoubt") return `${name} 选择告解自己的经历，想让你站在 TA 的视角里查：自己到底哪里被坑，哪里也在自欺。TA 最怕的不是发现 ${other} 有问题，而是发现自己当时其实看见过信号。`;
    return `${name} 选择告解自己的经历，TA 不急着指控 ${other}，而是想把这段婚恋里的问题重新查一遍。TA 的语气很平静，平静到像已经提前排练过一遍。`;
  }
  if (stance === "trueVictim") return `${name} 连线侦探局，说自己被 ${other} 的承诺拖住太久，现在只想知道该不该止损。`;
  if (stance === "badActorFirst") return `${name} 先来诉苦，把自己说成受害者，但 TA 回避了几个关键时间点。`;
  if (stance === "personalityMismatch") return `${name} 说自己被伤得很深，但初步听起来更像性格、沟通和家庭压力叠在了一起。`;
  return `${name} 的叙事听起来有委屈，也有空白；你需要把 ${other} 的版本一起拼进来。`;
}

function buildTestimony(plot, scene, complainant, respondent, stance, hiddenFacts, exaggerations, premeditated, caseMode) {
  const name = complainant?.name ?? "来访者";
  const other = respondent?.name ?? "对方";
  const primaryGap = hiddenFacts[0] ?? "关键事实";
  const primaryExaggeration = exaggerations[0] ?? "自身条件";
  if (caseMode === "confession") {
    return [
      {
        speakerId: complainant?.id ?? null,
        speaker: name,
        line: `“我现在回想起来，${scene.name} 那天我其实已经觉得不对，但我说服自己别太计较。”`,
        kind: "selfDoubt",
        surface: "自我告解",
        hint: "告解不是自动可信，它只是把调查对象从“对方有没有错”扩展到“我为什么当时没有看”。",
        followups: [
          {
            question: "你当时说服自己的理由是什么？",
            result: `TA 说自己不想显得现实，追问后才承认 ${primaryGap} 当时已经出现。`,
            contradiction: `TA 不是完全没看见 ${primaryGap}，而是主动把它压成了“小问题”。`
          },
          {
            question: "这段关系里，你得到过什么好处？",
            result: randomItem(OBFUSCATION_LINES),
            contradiction: "只说自己受伤，不说自己收益，告解也会变成另一种包装。"
          }
        ]
      },
      {
        speakerId: complainant?.id ?? null,
        speaker: name,
        line: `“我也不是完全无辜。${primaryExaggeration} 这件事，我当时确实说得比事实好看。”`,
        kind: "halfLie",
        surface: "小承认掩护大隐瞒",
        hint: "自我咨询里最容易出现“我承认一点点，所以我已经很坦诚”的错觉。",
        followups: [
          {
            question: `除了 ${primaryExaggeration}，你还包装过什么？`,
            result: "TA 沉默了一下，开始把“隐瞒”改口成“没必要一开始都说”。",
            contradiction: `TA 对 ${primaryExaggeration} 的承认，可能是在保护更大的择偶定位问题。`
          }
        ]
      },
      {
        speakerId: respondent?.id ?? null,
        speaker: `${other} 的缺席版本`,
        line: `“如果只听 TA 的告解，我永远都是那个让 TA 受伤的人。”`,
        kind: "shadowVersion",
        surface: "缺席者反叙事",
        hint: "告解模式里，另一方可能缺席，但证据不会缺席。",
        followups: [
          {
            question: "如果对方也在场，TA 最可能反驳哪一句？",
            result: `材料指向：${primaryGap} 不是单方突然制造，而是在双方默认里滚大的。`,
            contradiction: `告解者把 ${primaryGap} 说成对方单方面造成，但时间线显示自己也参与了推进。`
          }
        ]
      },
      {
        speakerId: null,
        speaker: "自我核验",
        line: `复盘到这里，${scene.hint}`,
        kind: "sceneHint",
        surface: "自查提示",
        hint: plot.truth,
        followups: [
          {
            question: "这段经历最该查的是对方，还是自己的选择机制？",
            result: "两者都要查。只查对方会变成控诉，只查自己会变成自责。",
            contradiction: "告解模式的答案不是找一个坏人，而是找出关系问题如何被双方共同放大。"
          }
        ]
      }
    ];
  }
  return [
    {
      speakerId: complainant?.id ?? null,
      speaker: name,
      line: `“当时就在${scene.name}，${other} 一直逼我表态。我承认我语气不好，可我只是想把事情说清楚。”`,
      kind: "ambiguous",
      surface: "迷惑性含糊",
      hint: "“只是想说清楚”后面通常要追问具体诉求。",
      followups: [
        {
          question: "你说的“表态”具体是钱、领证、房本，还是公开关系？",
          result: `TA 先说“都差不多”，追问后才把重点落到 ${primaryGap}。`,
          contradiction: `把多个诉求混成“表态”，是在模糊 ${primaryGap} 的真实重量。`
        },
        {
          question: "你当时希望对方给你什么结果？",
          result: randomItem(OBFUSCATION_LINES),
          contradiction: "诉求越含糊，越可能是在侦探局里争取道德高位，而不是还原事实。"
        }
      ]
    },
    {
      speakerId: respondent?.id ?? null,
      speaker: other,
      line: `“TA 没说的是，${primaryGap} 这件事从一开始就没讲完整。每次快谈到这里，TA 就会说我不够爱。”`,
      kind: "reluctant",
      surface: "不愿意说完整",
      hint: "被诉方给出的反叙事未必全真，但能暴露第一版故事的缺口。",
      followups: [
        {
          question: `你第一次知道 ${primaryGap} 是哪一天？`,
          result: randomItem(RELUCTANT_REVEALS),
          contradiction: `TA 能指出 ${primaryGap}，却回避具体日期，说明这条反叙事也被修剪过。`
        },
        {
          question: "你有没有利用这件事反过来要条件？",
          result: "TA 说“我只是保护自己”，但没有否认后来提出过新的条件。",
          contradiction: "被隐瞒不等于后续所有索取都合理。"
        }
      ]
    },
    {
      speakerId: complainant?.id ?? null,
      speaker: name,
      line: `“我承认${primaryExaggeration}说得好听了一点，可这不影响 TA 对我的伤害。难道我不完美，就活该被这样对待吗？”`,
      kind: "halfLie",
      surface: "小承认掩护大隐瞒",
      hint: "承认小包装时，要警惕背后是否还有更大的隐瞒。",
      followups: [
        {
          question: `除了 ${primaryExaggeration}，还有哪些资料不是原样？`,
          result: "TA 先笑了一下，说“谁相亲不包装”，随后避开了婚史、债务和家庭负担。",
          contradiction: `TA 把 ${primaryExaggeration} 降级成普通包装，可能是在保护更关键的隐瞒。`
        }
      ]
    },
    {
      speakerId: respondent?.id ?? null,
      speaker: other,
      line: premeditated
        ? `“如果不是我发现得早，TA 已经把下一步都安排好了。”`
        : stance === "personalityMismatch"
          ? `“我们可能都不算坏，只是每次沟通都变成互相证明谁更委屈。”`
          : `“我也有做得不好的地方，但不是 TA 连线里说的那个版本。”`,
      kind: premeditated ? "truthWithGap" : "defensive",
      surface: premeditated ? "真话但留白" : "防御性含糊",
      hint: premeditated ? "“下一步”是预谋案的关键词，要追钱、证据和时间线。" : "非预谋案也需要判断责任比例，而不是只选好人坏人。",
      followups: [
        {
          question: premeditated ? "TA 的下一步具体是什么？" : "你说自己也有做得不好的地方，具体是哪一件？",
          result: premeditated ? `TA 提到一个和 ${primaryGap} 相连的安排，但一开始没说，因为这也会暴露自己的拖延。` : "TA 终于承认，自己确实用冷处理拖过问题。",
          contradiction: premeditated ? "预谋线索出现，但发现者也可能不是完全无辜。" : "性格问题不是犯罪，但会制造大量看似恶意的误读。"
        }
      ]
    },
    {
      speakerId: null,
      speaker: "现场细节",
      line: `复盘到这里，${scene.hint}`,
      kind: "sceneHint",
      surface: "场景提示",
      hint: plot.truth,
      followups: [
        {
          question: "这个场景有没有可能被双方都复原错？",
          result: "有。场景复原依赖记忆和立场，不能替代证据卡。",
          contradiction: "当两个人都在讲同一个现场时，矛盾点比情绪强度更重要。"
        }
      ]
    }
  ];
}

function buildConfessionTimeline(scene, complainant, respondent, hiddenFacts, exaggerations, truth) {
  const name = complainant?.name ?? "来访者";
  const other = respondent?.name ?? "对方";
  const gap = hiddenFacts[0] ?? "关键事实";
  const secondGap = hiddenFacts[1] ?? "另一处隐瞒";
  const packaging = exaggerations[0] ?? "自身条件";
  const secondPackaging = exaggerations[1] ?? "关系承诺";
  return [
    {
      id: "first-signal",
      label: "最初的不舒服",
      text: `${name} 第一次觉得不对，是在${scene.name}前后。${other} 把 ${gap} 说得很轻，${name} 选择先相信关系本身。`,
      correctMark: "selfBlind",
      contradiction: `告解时间线：${name} 并非完全没看见 ${gap}，而是主动把它压成了“小问题”。`
    },
    {
      id: "sweet-proof",
      label: "被关系证明感安抚",
      text: `一次示好、陪伴或承诺让 ${name} 放下追问，甚至开始替 ${other} 解释。`,
      correctMark: "hurtByOther",
      contradiction: `告解时间线：关系证明感被用来绕开 ${secondGap}，这不是普通浪漫，而是风险遮蔽。`
    },
    {
      id: "self-packaging",
      label: "自己的包装",
      text: `${name} 也承认，自己在 ${packaging} 上说得比事实好看，觉得“大家相亲都会美化”。`,
      correctMark: "hurtOther",
      contradiction: `告解时间线：${name} 在 ${packaging} 上也制造了信息不对称，不能只把自己放在受害者位置。`
    },
    {
      id: "cost-sunk",
      label: "沉没成本出现",
      text: `关系推进后，钱、时间、公开关系或共同计划已经投入，${name} 开始更怕承认自己看错。`,
      correctMark: "selfBlind",
      contradiction: "告解时间线：继续投入不是新证据，有时只是为了证明旧选择没有错。"
    },
    {
      id: "truth-gap",
      label: "事实缺口扩大",
      text: `${secondPackaging} 的说法越来越漂亮，但材料只能证明一部分；${truth}`,
      correctMark: "hurtByOther",
      contradiction: `告解时间线：${secondPackaging} 越漂亮，越需要回到材料而不是回到承诺。`
    },
    {
      id: "exit-or-repeat",
      label: "退出或重复",
      text: `${name} 来到侦探局，不只是想知道 ${other} 有没有错，也想知道自己下次会不会重复同一套选择。`,
      correctMark: "selfBlind",
      contradiction: "告解时间线：如果只把这段经历讲成遇人不淑，下次仍然可能在同一类信号前停下。"
    }
  ];
}

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
  },
  {
    id: "macro-economy-cycle",
    title: "经济周期与家庭承压",
    motiveHints: ["money", "familyResource", "classJump", "kpi"],
    factors: [
      {
        stage: "screening",
        type: "macro",
        line: "婚介资料里多了一行行业稳定性评估，经济风向开始影响每个人的婚恋报价。",
        internalDelta: 3,
        motiveDelta: 6,
        flags: { macroEconomyPressure: 1 }
      },
      {
        stage: "dating",
        type: "macro",
        line: "TA 开始频繁聊裁员、降薪和副业，好像恋爱还没开始就已经背着一张压力表。",
        internalDelta: 6,
        motiveDelta: 8,
        flags: { macroEconomyPressure: 1, povertyStress: 1 }
      },
      {
        stage: "firstYear",
        type: "macro",
        line: "经济下行把耐心变薄，账单、加班和收入不稳更容易变成吵架的入口。",
        internalDelta: 13,
        motiveDelta: 12,
        flags: { macroEconomyPressure: 2, householdPressure: 1, debtPressure: 1 }
      },
      {
        stage: "housingDebt",
        type: "macro",
        line: "房贷和收入预期不再像签合同时那么稳定，家庭现金流开始要求每个人说实话。",
        internalDelta: 16,
        motiveDelta: 16,
        flags: { macroEconomyPressure: 2, debtPressure: 3, assetProtection: 1 }
      },
      {
        stage: "child",
        type: "macro",
        line: "教育、托育和老人医疗同时涨价，外部环境把小家庭的每个短板都放大了。",
        internalDelta: 15,
        motiveDelta: 14,
        flags: { macroEconomyPressure: 2, childPressure: 2, educationPressure: 1 }
      }
    ]
  },
  {
    id: "stock-market-family-investment",
    title: "股市投资与家庭风险偏好",
    motiveHints: ["money", "classJump", "control"],
    factors: [
      {
        stage: "dating",
        type: "investment",
        line: "TA 对一只热门股票或基金讲得很笃定，收益率听起来比关系本身还诱人。",
        internalDelta: 5,
        motiveDelta: 10,
        flags: { stockMarketHeat: 1, scamExposure: 1 }
      },
      {
        stage: "marriageTalk",
        type: "investment",
        line: "彩礼、婚房和投资账户被放进同一张未来规划表，风险却没有被同样认真计算。",
        internalDelta: 11,
        motiveDelta: 16,
        flags: { stockMarketHeat: 1, investmentExposure: 2, assetProtection: 1 }
      },
      {
        stage: "firstYear",
        type: "investment",
        line: "股市上涨时，TA 更愿意谈加仓；股市回撤时，TA 更愿意谈你为什么没有支持。",
        internalDelta: 15,
        motiveDelta: 14,
        flags: { stockMarketHeat: 2, investmentExposure: 2, householdPressure: 1 }
      },
      {
        stage: "housingDebt",
        type: "investment",
        line: "有人提出用家庭备用金搏一把，说行情好时犹豫就是错过阶层跃迁。",
        internalDelta: 18,
        motiveDelta: 20,
        flags: { investmentExposure: 3, scamExposure: 1, debtPressure: 2, assetProtection: 1 }
      }
    ]
  },
  {
    id: "ex-reentry-boundary",
    title: "前任回流与暧昧边界",
    motiveHints: ["cover", "emotionalSupply", "control", "display"],
    factors: [
      {
        stage: "dating",
        type: "ex",
        line: "TA 说前任只是偶尔问候，但手机亮起时，TA 的第一反应是把屏幕扣下。",
        internalDelta: 8,
        motiveDelta: 12,
        flags: { exBoundary: 1, exReentryRisk: 1, suspicion: 1 }
      },
      {
        stage: "preParents",
        type: "ex",
        line: "旧关系在你们确认排他前后重新出现，TA 把边界问题说成你太敏感。",
        internalDelta: 13,
        motiveDelta: 16,
        flags: { exBoundary: 2, exReentryRisk: 1, suspicion: 1 }
      },
      {
        stage: "wedding",
        type: "ex",
        line: "婚礼前的陌生消息不一定是真相，但足够说明有一段旧关系没有被彻底关上。",
        internalDelta: 16,
        motiveDelta: 18,
        flags: { exBoundary: 2, exReentryRisk: 2, weddingPressure: 1, suspicion: 2 }
      },
      {
        stage: "firstYear",
        type: "ex",
        line: "一次争吵后，TA 又去找那个“最懂 TA 的老朋友”倾诉。",
        internalDelta: 18,
        motiveDelta: 16,
        flags: { exReentryRisk: 2, infidelityRisk: 2, communicationFriction: 1, householdPressure: 1 }
      }
    ]
  },
  {
    id: "attention-gap-affair-risk",
    title: "关心不足与情绪价值外包",
    motiveHints: ["emotionalSupply", "control", "content"],
    factors: [
      {
        stage: "dating",
        type: "intimacy",
        line: "TA 对回复速度和陪伴频率特别敏感，像是在用秒回确认自己是否被爱。",
        internalDelta: 8,
        motiveDelta: 10,
        flags: { emotionalValueDemand: 1, communicationFriction: 1 }
      },
      {
        stage: "firstYear",
        type: "intimacy",
        line: "你们不再认真听对方说完一天，情绪价值开始被短视频、同事和旧联系人分走。",
        internalDelta: 14,
        motiveDelta: 12,
        flags: { careDeficit: 2, emotionalValueDemand: 1, infidelityRisk: 1, householdPressure: 1 }
      },
      {
        stage: "housingDebt",
        type: "intimacy",
        line: "经济压力让你们只剩下任务协作，谁都没有力气再做对方的情绪容器。",
        internalDelta: 16,
        motiveDelta: 14,
        flags: { careDeficit: 2, emotionalValueDemand: 1, infidelityRisk: 1, debtPressure: 1 }
      },
      {
        stage: "child",
        type: "intimacy",
        line: "育儿把亲密切成碎片，外面那个愿意听 TA 抱怨的人忽然显得很轻松。",
        internalDelta: 18,
        motiveDelta: 16,
        flags: { careDeficit: 2, emotionalValueDemand: 2, infidelityRisk: 2, childPressure: 1 }
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
      if (item.id === "house-parent-funded") {
        return ["zhou", "shen", "chen"].includes(npc.id) || seed.motive === "familyResource" || attrs.family >= 6;
      }
      return false;
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
