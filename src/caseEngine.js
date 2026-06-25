import { shuffle } from "./random.js?v=0.19.36";
import { applyDifficultyProfile } from "./difficulty.js?v=0.19.36";

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
    truth: "亲密关系被内容资产化，争点是授权、收益、隐私和公开施压。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["账号收益", "脚本文案", "隐私授权", "分手炒作"],
    exaggerations: ["真实记录", "粉丝祝福", "共同账号"],
    evidence: ["账号收益数据", "广告合同", "拍摄脚本", "聊天授权", "公开视频时间线"]
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
  },
  {
    id: "fake-marriage-green-card",
    label: "假婚绿卡/身份利益局",
    publicHook: "一方说假结婚只是互相帮忙，但身份、地址、保证金和退出机制都没有说清。",
    truth: "身份收益被包装成合作，风险却可能落在更难退出的一方身上。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["共同地址证明", "保证金用途", "身份申请节点", "退出协议缺失"],
    exaggerations: ["只是帮忙", "不会影响生活", "各取所需"],
    evidence: ["共同地址证明", "保证金转账", "申请材料", "聊天承诺", "租房/账单记录"]
  },
  {
    id: "extortion-intimacy-trap",
    label: "亲密边界勒索局",
    publicHook: "亲密接触后，一方以报警、公开视频或聊天截图威胁要钱，另一方也可能确实存在越界。",
    truth: "性同意边界必须严肃核验，同时也要查清是否有人利用边界争议进行勒索。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["清醒程度", "威胁时间", "索财金额", "偷拍视频/录音来源"],
    exaggerations: ["完全自愿", "只是开玩笑", "不给钱就让你身败名裂"],
    evidence: ["酒后聊天时间线", "转账要求", "报警威胁记录", "监控/定位", "朋友证言"]
  },
  {
    id: "tony-multi-dating",
    label: "托尼老师多线养鱼局",
    publicHook: "一方以服务热情、性格会聊为借口，同时给多人制造排他暧昧。",
    truth: "多线养鱼不是单纯花心，而是用不同版本的未来承诺换情绪、消费和机会。",
    possibleComplainants: ["female"],
    hiddenFacts: ["多线排班", "专属昵称", "重复承诺", "消费绑定"],
    exaggerations: ["只是客户关系", "我对谁都这样", "还没正式确定"],
    evidence: ["理发店预约表", "聊天昵称截图", "消费/办卡记录", "朋友圈屏蔽分组", "同事证言"]
  },
  {
    id: "princess-giant-baby",
    label: "公主病/巨婴责任局",
    publicHook: "双方都说自己只是需要被照顾，但生活责任、情绪劳动和现实能力严重不对等。",
    truth: "这类案未必有预谋，核心是成年人责任能力不足和需求表达失衡。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["生活分工", "情绪劳动次数", "父母代办", "经济自理能力"],
    exaggerations: ["我要求不高", "TA 应该主动懂我", "我只是不会表达"],
    evidence: ["生活分工清单", "聊天催促记录", "父母代办记录", "消费/账单", "共同计划表"]
  },
  {
    id: "high-demand-fishing",
    label: "狮子大开口/多线养鱼局",
    publicHook: "表面是一方要求过高、认不清现实，追问后却可能发现 TA 同时推进多名对象。",
    truth: "高要求可能只是表层，真正风险是把不同对象当成资源池，骑驴找马、多线发展。",
    possibleComplainants: ["male", "female"],
    hiddenFacts: ["多线聊天", "资源分工", "见家长排期", "备选对象"],
    exaggerations: ["只是朋友", "我值得更好", "还没确定关系"],
    evidence: ["多线聊天日历", "礼物/转账记录", "约会定位", "朋友圈分组", "亲友证言"]
  }
];

const TASK_PROFILES = {
  audit: {
    id: "audit",
    label: "钱款说不清",
    recommendedSpecialtyId: "audit",
    summary: "钱说得急，责任却还没落到人。"
  },
  emotion: {
    id: "emotion",
    label: "情绪卡住了",
    recommendedSpecialtyId: "emotion",
    summary: "情绪很满，有人一直把问题推回爱不爱。"
  },
  verification: {
    id: "verification",
    label: "资料有雾",
    recommendedSpecialtyId: "verification",
    summary: "标签都好看，材料却总少一块。"
  }
};

const PLOT_TASK_PROFILE = {
  "marriage-fraud": "audit",
  "debt-transfer": "audit",
  "resource-harvest": "audit",
  "romance-transfer-gift-or-loan": "audit",
  "bride-price-short-cohabitation": "audit",
  "house-name-security-test": "audit",
  "relative-debt-bundle": "audit",
  "fake-divorce-quota": "audit",
  "wedding-sunk-cost-pressure": "audit",
  "couple-startup-equity": "audit",
  "cohabitation-renovation-cost": "audit",
  "lost-job-hidden-credit": "audit",
  "pig-butchering-investment": "audit",
  "dating-app-bot-vip": "audit",
  "ex-borrow-money-reentry": "emotion",
  "coworker-emotional-affair": "emotion",
  "influencer-relationship-content": "emotion",
  "control-isolation-reporting": "emotion",
  "violence-mutual-accusation": "emotion",
  "extortion-intimacy-trap": "emotion",
  "tony-multi-dating": "emotion",
  "princess-giant-baby": "emotion",
  "high-demand-fishing": "emotion",
  "affair-reversal": "emotion",
  "positioning-lie": "verification",
  "hidden-divorce-history": "verification",
  "hidden-child-support": "verification",
  "major-illness-disclosure": "verification",
  "education-income-fake-profile": "verification",
  "pregnancy-timeline-gap": "verification",
  "paternity-doubt-after-birth": "verification",
  "child-paternity-trap": "verification",
  "fake-marriage-green-card": "verification"
};

function taskProfileForPlot(plotId) {
  return TASK_PROFILES[PLOT_TASK_PROFILE[plotId]] ?? TASK_PROFILES.verification;
}

function plotIdsForSpecialty(specialtyId) {
  return Object.entries(PLOT_TASK_PROFILE)
    .filter(([, taskId]) => taskId === specialtyId)
    .map(([plotId]) => plotId);
}

const DAILY_TEMPLATE_PLOT_IDS = [
  "lost-job-hidden-credit",
  "house-name-security-test",
  "tony-multi-dating",
  "education-income-fake-profile"
];

const DAILY_FEATURED_PLOTS = {
  audit: ["lost-job-hidden-credit"],
  emotion: ["tony-multi-dating"],
  verification: ["education-income-fake-profile"]
};

const DAILY_ROTATION = [
  {
    plotId: "lost-job-hidden-credit",
    caseMode: "premarital",
    specialty: "audit",
    sceneId: "rental-room",
    complainantId: "shen",
    respondentId: "xu"
  },
  {
    plotId: "house-name-security-test",
    caseMode: "premarital",
    specialty: "audit",
    sceneId: "broker-office",
    complainantId: "zhou",
    respondentId: "lin"
  },
  {
    plotId: "tony-multi-dating",
    caseMode: "premarital",
    specialty: "emotion",
    sceneId: "late-night-chat",
    complainantId: "he",
    respondentId: "chen"
  },
  {
    plotId: "education-income-fake-profile",
    caseMode: "premarital",
    specialty: "verification",
    sceneId: "live-call",
    complainantId: "lin",
    respondentId: "zhou"
  },
  {
    plotId: "house-name-security-test",
    caseMode: "premarital",
    specialty: "audit",
    sceneId: "broker-office",
    complainantId: "he",
    respondentId: "xu"
  },
  {
    plotId: "lost-job-hidden-credit",
    caseMode: "premarital",
    specialty: "audit",
    sceneId: "rental-room",
    complainantId: "chen",
    respondentId: "zhou"
  },
  {
    plotId: "tony-multi-dating",
    caseMode: "premarital",
    specialty: "emotion",
    sceneId: "late-night-chat",
    complainantId: "lin",
    respondentId: "shen"
  },
  {
    plotId: "education-income-fake-profile",
    caseMode: "premarital",
    specialty: "verification",
    sceneId: "live-call",
    complainantId: "xu",
    respondentId: "chen"
  }
];

const CASE_SCENES = [
  {
    id: "live-call",
    name: "直播连线",
    description: "来访者刚接进直播间，话还没讲顺，弹幕已经开始站队。",
    dialogue: "“主播你好，我想把这件事说清楚。”",
    hint: "先听出对方卡在哪里，再决定要不要往下追。"
  },
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

const DAILY_CASE_MODE = {
  id: "daily-call",
  label: "直播来电",
  brief: "每日只接一通来电，先听当事人把情况说出来。",
  stage: "liveCall",
  plotIds: DAILY_TEMPLATE_PLOT_IDS
};

const CASE_MODE_SEQUENCE = [DAILY_CASE_MODE];

export function generateDailyCaseSequence(npcs, attrs, options = {}) {
  if (options.plotId && !DAILY_TEMPLATE_PLOT_IDS.includes(options.plotId)) {
    throw new Error(`Daily case plot is not templated: ${options.plotId}`);
  }
  const dailyKey = options.dailyKey ?? dailyCaseKey(options.now);
  const dailySpec = options.plotId ? null : DAILY_ROTATION[dailyHash(dailyKey) % DAILY_ROTATION.length];
  const specialty = dailySpec?.specialty ?? options.specialty;
  const preferredPlotIds = plotIdsForSpecialty(specialty);
  const featuredPlotIds = DAILY_FEATURED_PLOTS[specialty] ?? [];
  const dailyPool = (featuredPlotIds.length ? featuredPlotIds : preferredPlotIds)
    .filter((plotId) => DAILY_TEMPLATE_PLOT_IDS.includes(plotId));
  const mode = DAILY_CASE_MODE;
  const matchingPlotIds = mode.plotIds.filter((plotId) => dailyPool.includes(plotId));
  const requestedPlotId = options.plotId ?? null;
  const plotId = requestedPlotId ?? dailySpec?.plotId ?? randomItem(matchingPlotIds.length ? matchingPlotIds : dailyPool.length ? dailyPool : mode.plotIds);
  const brief = generateLivestreamCase(npcs, attrs, {
    ...options,
    order: 1,
    caseMode: mode,
    sceneId: "live-call",
    plotId,
    complainantId: dailySpec?.complainantId ?? options.complainantId,
    respondentId: dailySpec?.respondentId ?? options.respondentId,
    forcedPremeditated: true
  });
  const names = {
    complainantName: npcs.find((npc) => npc.id === brief.complainantId)?.name ?? "咨询者",
    respondentName: npcs.find((npc) => npc.id === brief.respondentId)?.name ?? "对方"
  };
  return [applyDifficultyProfile(applyDailyCaseTemplate({
    ...brief,
    id: `daily-${dailyKey}-${plotId}`,
    dailyKey,
    dailyCase: true,
    modeLabel: "今日连线",
    storyArcTitle: `今日连线：${brief.label}`,
    storyArcSummary: "一通客户来电，三轮问话，一次阶段判断。适合发给朋友看 TA 会不会判错。",
    storySuspense: "今天的关键不是读完资料，而是看你能不能在对方第一次自述里抓到真正该追问的地方。",
    storyClueObject: brief.storyClueObject ?? "今日通话摘录",
    storyClue: brief.storyClue ?? "今日短案只记录关键原话和时间点，判断留给主播。"
  }, names), {
    tier: 1,
    label: "快玩短案",
    targetDifficulty: Math.max(4, brief.difficulty ?? 4),
    minDifficulty: 4,
    requiredContradictions: 2,
    budgetDelta: 1,
    inspirationBase: 2,
    note: "手机端短案只要求先抓住两处矛盾，结果卡再引导好友挑战。"
  })];
}

function applyDailyCaseTemplate(brief, names) {
  if (brief.plotId === "lost-job-hidden-credit") return dailyLostJobCreditTemplate(brief, names);
  if (brief.plotId === "house-name-security-test") return dailyHouseBoundaryTemplate(brief, names);
  if (brief.plotId === "tony-multi-dating") return dailyTonyMultiDatingTemplate(brief, names);
  if (brief.plotId === "education-income-fake-profile") return dailyFakeProfileTemplate(brief, names);
  throw new Error(`Daily case plot is not templated: ${brief.plotId}`);
}

function dailyCaseKey(now = new Date()) {
  const date = now instanceof Date ? now : new Date(now);
  const utc8Date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  const year = utc8Date.getUTCFullYear();
  const month = String(utc8Date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(utc8Date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dailyHash(text) {
  return [...String(text)].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) >>> 0, 2166136261);
}

function dailyBaseBrief(brief, names, fields) {
  const problemActorId = brief.respondentId ?? brief.complainantId;
  return {
    ...brief,
    label: fields.label ?? brief.label,
    storyArcTitle: fields.storyArcTitle ?? brief.storyArcTitle,
    premeditated: fields.premeditated ?? true,
    premeditatedActorId: fields.premeditatedActorId ?? problemActorId,
    stance: fields.stance ?? "trueVictim",
    openingComplaint: fields.openingComplaint,
    openingDialogue: fields.openingDialogue,
    scene: {
      ...(brief.scene ?? {}),
      name: fields.sceneName ?? "直播连线"
    },
    sceneVersions: fields.sceneVersions,
    testimony: fields.testimony,
    explicitClueGroups: fields.explicitClueGroups,
    evidenceCards: fields.evidenceCards,
    stageJudgement: fields.stageJudgement,
    followupTwist: fields.followupTwist,
    dailyShareTitle: fields.dailyShareTitle,
    dailyShareBody: fields.dailyShareBody,
    dailyShareQuestion: fields.dailyShareQuestion,
    publicHook: fields.publicHook ?? brief.publicHook,
    storyArcSummary: fields.storyArcSummary ?? brief.storyArcSummary,
    storySuspense: fields.storySuspense ?? brief.storySuspense,
    storyClueObject: fields.storyClueObject ?? brief.storyClueObject,
    truth: fields.truth ?? brief.truth
  };
}

function dailyLostJobCreditTemplate(brief, names) {
  const name = "咨询者";
  const other = "对方";
  return dailyBaseBrief(brief, names, {
    label: "8 万信用卡周转",
    storyArcTitle: "今日连线：8 万信用卡周转",
    publicHook: "TA 一直维持体面恋爱消费，突然让你先垫 8 万信用卡。是困难，还是化债？",
    storyArcSummary: "这通先听清：钱从哪里来、花到谁身上、最后谁来扛。",
    storySuspense: "这案最容易吵成“你嫌我穷”。真正该查的是：债务爆雷前，谁在维持体面幻觉。",
    storyClueObject: "信用卡账单与社保断缴截图",
    openingComplaint: `${name}连线说：“TA 说只是短期周转，让我先垫 8 万信用卡。我不是不帮，是我突然发现 TA 可能早就失业了。”`,
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我想问下我男朋友的事。我们谈了半年，之前约会一直挺体面。可他突然让我先垫 8 万信用卡，那周我们还去了很贵的纪念日晚餐。", mood: "anxious" },
      { speaker: "你", role: "host", text: "晚上好，这事听着不只是手头紧。TA 第一次提钱时，原话怎么说？", mood: "listening" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我本来以为 TA 只是手头紧。TA 之前每次约会都很体面，订餐厅、买礼物，从来不像没钱。",
        doubt: "体面消费可能是真投入，也可能是靠信用卡维持的人设。",
        contradiction: "TA 一边说奖金延迟，一边继续高消费，说明资金缺口不是临时才出现。",
        reliability: "mixed",
        questionOptions: [
          { question: "他开口借钱之前，有没有跟你说过工作不太稳？", answer: "没有。TA 只说最近忙，社保截图却显示两个月前已经断缴。", contradiction: "社保断缴早于借钱，失业不是突然发生。", correct: true },
          { question: "你当时是不是先安慰他，说困难可以一起扛？", answer: "我那时候确实一直在心疼他，可讲来讲去，还是没说出失业到底从什么时候开始。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我把那张信用卡账单翻出来了。最大几笔不是房租和医疗，是餐厅、礼物和短视频平台分期。",
        doubt: "债务用途决定它是共同困难，还是体面人设成本。",
        contradiction: "8 万信用卡不是基本生存债，而是长期维持体面恋爱的消费后果。",
        reliability: "partial",
        questionOptions: [
          { question: "这几笔账，哪些是在他没工作以后花的？", answer: "纪念日晚餐、礼物分期和两次酒店都在断缴之后。", contradiction: "TA 失业后仍继续制造高消费恋爱场景。", correct: true },
          { question: "这些消费会不会是他为了维持关系硬撑出来的？", answer: "这句听起来体贴，但会把话题带去动机。账单里真正没说清的是：硬撑后的债让谁来接。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "他后来发来一句：“我只是怕你知道我失业后就离开我。”但紧接着又问我能不能先把最低还款转过去。",
        doubt: "脆弱可以是真的，化债也可以同时是真的。",
        contradiction: "TA 承认隐瞒失业，却仍把还款压力推给关系里的另一方。",
        reliability: "partial",
        questionOptions: [
          { question: "他说怕你离开，那最低还款为什么要你先转？", answer: "不是追问 TA 可不可怜，而是问这笔钱为什么要由你来接。", contradiction: "情绪脆弱不能自动转化为债务转嫁。", correct: true },
          { question: "你先问他下个月怎么还，别让话停在道歉上。", answer: "他开始讲下个月会有办法，但失业多久、债务怎么形成还是没接上。", correct: false }
        ]
      }
    ],
    testimony: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        line: "“TA 说过了这阵子就好，可我查到社保断缴不是这个月的事。”",
        kind: "truthWithGap",
        surface: "失业时间线",
        hint: "先锁失业发生时间，再看借钱发生时间。",
        followups: [
          { question: "社保断缴和第一次借钱隔了多久？", result: "隔了 47 天。中间还发生过三次高消费约会。", contradiction: "失业隐瞒持续 47 天，且期间继续高消费。" },
          { question: "TA 说怕你离开，你怎么想？", result: "这是情绪解释，不是债务为什么要你来接的解释。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        line: "“我把短信和账单按日期排了一下，最低还款、餐厅订金和礼物分期都在同一周出现。”",
        kind: "sceneHint",
        surface: "体面成本",
        hint: "债务不是凭空出现，是被体面恋爱持续堆出来的。",
        followups: [
          { question: "哪一笔最能说明问题？", result: "礼物分期。它证明 TA 不是单纯生存困难，而是在维持恋爱人设。", contradiction: "礼物分期把经济困难和人设包装连在一起。" }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        line: "“我最怕别人说我嫌贫爱富。可我卡住的不是他没钱，是他瞒着失业以后，还让我替他还这些体面账。”",
        kind: "sceneHint",
        surface: "咨询者卡住的点",
        hint: "这笔钱先把同情和谁来扛分开放。",
        followups: [
          { question: "所以你不是怕他穷，是怕这笔债最后让你来接？", result: "她点头：我可以理解他难，但不能因为我心软，就默认我来接这笔债。", contradiction: "同情 TA 的处境，不等于接受 TA 把债务转给你。" }
        ]
      }
    ],
    evidenceCards: [
      { id: "daily-credit-social-security", type: "社保截图", title: "社保断缴时间", front: "断缴月份早于第一次借钱 47 天。", detail: "失业并非临时发生。", targets: ["truthWithGap", "sceneHint"], contradiction: "社保断缴早于借钱，说明失业被持续隐瞒。" },
      { id: "daily-credit-card-bill", type: "账单", title: "信用卡账单", front: "餐厅、礼物分期和最低还款集中在同一周。", detail: "账单显示债务与体面恋爱消费有关。", targets: ["sceneHint"], contradiction: "信用卡债务包含维持恋爱体面的消费成本。" },
      { id: "daily-credit-chat", type: "聊天", title: "最低还款请求", front: "“你先帮我挡一下，我不想这段关系因为钱毁了。”", detail: "把债务包装成关系考验。", targets: ["truthWithGap"], contradiction: "还款请求把个人债务包装成关系考验。" }
    ],
    stageJudgement: "听到这里：这通电话不是穷的问题，而是失业隐瞒、体面消费和债务转嫁叠在一起。",
    followupTwist: "后续回拨：咨询者补充，对方承认失业是真，但仍希望先用她的钱撑过最低还款。你把这句记下：脆弱是真的，转嫁也可以是真的。",
    dailyShareTitle: "8 万信用卡，到底该不该帮 TA 还？",
    dailyShareBody: "我抓到的关键不是 TA 穷，而是失业 47 天后还在制造高消费恋爱。",
    dailyShareQuestion: "你会先问失业时间，还是先问 TA 为什么借钱？",
    truth: "失业隐瞒与信用卡债务转嫁同时成立。关系里的同情，不能替谁把债接过去。"
  });
}

function dailyHouseBoundaryTemplate(brief, names) {
  const name = "咨询者";
  const other = "对方";
  return dailyBaseBrief(brief, names, {
    label: "婚前房与共同还贷",
    storyArcTitle: "今日连线：婚前房与共同还贷",
    publicHook: "婚前房写在 TA 父母名下，却要你婚后一起还贷。你提份额协议，TA 说你太算计。",
    storyArcSummary: "这通先稳住：房子、还贷、退路，哪一句没说清。",
    storySuspense: "这案最容易吵成“你不信任我”。真正要查的是：反洗房边界有没有被曲解成感情测试。",
    storyClueObject: "购房合同、父母转账与协议草稿",
    openingComplaint: `${name}连线说：“TA 家婚前买房写父母名下，说婚后我们一起还贷。我提能不能写清份额和退出机制，TA 说我还没结婚就想着离。”`,
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我不是非要房子。婚前房写 TA 父母名下，可婚后又说我们一起还贷才像一家人。", mood: "anxious" },
      { speaker: "你", role: "host", text: "晚上好。合同上写谁、家里怎么说还贷，你从这两处讲。", mood: "listening" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我不是非要加名，我只是想知道我婚后还进去的钱算什么。可 TA 一直说，正常夫妻不会算这么细。",
        doubt: "不加名可以是合理资产隔离，也可能配合共同还贷形成洗房风险。",
        contradiction: "房产登记和还贷安排被拆成两套说法：权属归父母，现金流要小家庭承担。",
        reliability: "mixed",
        questionOptions: [
          { question: "你慢点说，首付谁出、房本写谁、婚后谁还？", answer: "首付和登记都在对方父母名下，婚后还贷计划却要从共同账户走。", contradiction: "权属和还贷安排不匹配，存在共同还贷被弱化的风险。", correct: true },
          { question: "你先问他，婚后还贷这件事是不是代表把你当一家人？", answer: "我顺着“是不是一家人”讲下去，委屈是被接住了，但房本和还贷还是两套话。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我手里有合同照片。买受人写的是对方父母。可贷款预案旁边另有一页“婚后家庭共同账户支出表”。",
        doubt: "资产隔离本身不是错，关键是有没有同步说清还贷和退路。",
        contradiction: "材料把产权留在父母名下，却把婚后还贷放入共同支出。",
        reliability: "partial",
        questionOptions: [
          { question: "这张表里，房贷和装修是怎么写进家庭开销的？", answer: "房贷和装修被列为家庭固定支出，旁边没有份额或补偿说明。", contradiction: "共同支出表缺少还贷份额和退出补偿机制。" },
          { question: "你先退一步，不谈加名，只问每月流水能不能留着。", answer: "这像是折中，但把补偿和退出规则推迟了。流水有了，钱算什么还是没说清。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我把他后来那句也念一下：“房子放父母名下是家里安排，不影响我们过日子。不写才像一家人，你要协议，就是不信我。”",
        doubt: "“不写才像一家人”把退出规则包装成感情测试，但不能代替权属、债务和退出规则。",
        contradiction: "TA 把投入确认说成不信任，回避了共同还贷如何被确认的问题。",
        reliability: "partial",
        questionOptions: [
          { question: "你可以问他：不写清楚的话，我还进去的钱算什么？", answer: "追问：如果不写份额，那我婚后还贷的钱算借款、赠与，还是家庭支出？", contradiction: "对方无法说明共同还贷的钱最后怎么算。" },
          { question: "你要不要先只谈装修钱，房贷这块晚点再说？", answer: "装修钱容易谈，但房贷才是长期流出的那笔。话题一缩小，核心现金流就滑过去了。", correct: false }
        ]
      }
    ],
    testimony: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        line: "“我提过不加名也行，只要写清楚婚后还贷和装修怎么算。TA 说这就是不信任。”",
        kind: "truthWithGap",
        surface: "反洗房边界",
        hint: "反制方式不一定是加名，也可以是确认还贷性质和退出补偿。",
        followups: [
          { question: "你提出的具体条款是什么？", result: "还贷留流水、装修单独记账、分开时按实际投入补偿。", contradiction: "咨询者提出的是还贷补偿，不是单方面索要产权。" },
          { question: "你有没有先退一步，说不写协议也可以先留流水？", result: "这听起来好谈一点，但把退出补偿推迟了。流水能证明付过钱，却不能自动说明怎么算。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        line: "“我草稿里没写要加名，只写婚后共同账户支付的房贷、装修、物业，按实际流水确认投入。”",
        kind: "sceneHint",
        surface: "协议性质",
        hint: "先判断条款是保护投入，还是夺取对方父母资产。",
        followups: [
          { question: "这份草稿有没有直接要求加名？", result: "没有。它要求记录婚后投入和退出补偿。", contradiction: "协议草稿没有要求加名，重点是确认共同投入。" }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        line: "“他一直说我现实，可我其实就想问一句：如果这房子完全是他们家的，为什么婚后要从我们共同账户固定还贷？”",
        kind: "sceneHint",
        surface: "咨询者卡住的点",
        hint: "合理保护和洗房风险的分界，在权属与现金流是否一致。",
        followups: [
          { question: "你把这句原样留住，不要换成加不加名。", result: "她慢下来：对，我问的是共同账户为什么要承担固定还贷。", contradiction: "权属归父母但还贷进家庭账户，是这通电话最拧巴的地方。" }
        ]
      }
    ],
    evidenceCards: [
      { id: "daily-house-contract", type: "购房合同", title: "买受人页", front: "买受人为对方父母，未出现婚后双方姓名。", detail: "产权归属清晰，但和婚后还贷计划不一致。", targets: ["truthWithGap", "sceneHint"], contradiction: "产权归父母，婚后还贷却计划由小家庭承担。" },
      { id: "daily-house-account", type: "账户表", title: "共同账户支出表", front: "房贷、装修、物业被列为婚后固定共同支出。", detail: "共同支出需要对应份额、补偿或明确赠与。", targets: ["sceneHint"], contradiction: "共同账户支出表缺少还贷份额和退出补偿机制。" },
      { id: "daily-house-agreement", type: "协议草稿", title: "投入确认条款", front: "未要求加名，只要求还贷和装修留流水、按投入补偿。", detail: "这更像保护投入，不是直接夺取产权。", targets: ["truthWithGap", "sceneHint"], contradiction: "协议草稿没有要求加名，重点是确认共同投入。" }
    ],
    stageJudgement: "听到这里：这通电话不能简单吵加不加名。关键是权属、还贷、装修和退出补偿是否一致。",
    followupTwist: "后续回拨：对方仍然坚持“不写才像一家人”。你把这句记下：越要求你别算清，越要先算清谁承担成本。",
    dailyShareTitle: "婚前房不加名，但要你一起还贷，算不算洗房？",
    dailyShareBody: "我抓到的关键不是加不加名，而是产权归父母、还贷进共同账户。",
    dailyShareQuestion: "你会先问房本，首付，还是婚后还贷？",
    truth: "合理资产隔离必须同步说明还贷和补偿。只隔离产权、不隔离现金流，会制造洗房风险。"
  });
}

function dailyTonyMultiDatingTemplate(brief, names) {
  const name = "咨询者";
  const other = "对方";
  return dailyBaseBrief(brief, names, {
    label: "理发店排班表",
    storyArcTitle: "今日连线：理发店排班表",
    publicHook: "她以为自己是女朋友，直到看见理发店排班表：自己旁边写着“情绪稳定”。",
    storyArcSummary: "这通看反应：谁被放进不同分组，谁在被哄着付出。",
    storySuspense: "这案最适合发给朋友：到底是服务热情，还是把暧昧做成了客户管理？",
    storyClueObject: "理发店排班表与办卡记录",
    openingComplaint: `${name}连线说：“我以为我是女朋友。后来才看到排班表，我旁边写‘情绪稳定’，另一个女生旁边写‘能投店’。”`,
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我想问一个相亲后暧昧了几个月的人。他在理发店上班，我昨天看到一张排班表，里面不是名字，是“情绪稳定”“能投店”这种备注。", mood: "anxious" },
      { speaker: "你", role: "host", text: "晚上好。看到那张表之前，他平时怎么和你相处？", mood: "listening" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "TA 每次下班后都陪我聊天，说我是最懂 TA 的人。我以为这就是确定关系前的暧昧期。",
        doubt: "“最懂我”可能是亲密表达，也可能是情绪功能标签。",
        contradiction: "排班表把亲密称呼改写成了功能分组：情绪稳定、能投店、能带客。",
        reliability: "mixed",
        questionOptions: [
          { question: "他有没有把这种话也发给别人？", answer: "有。另一个女生截图里也有“只有你能理解我”。", contradiction: "专属话术被复制给不同对象。", correct: true },
          { question: "你先问她，表里有没有直接写到她自己。", answer: "我开始找自己那一栏，但“专属话术是不是被复制”这条线暂时断了。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我当时看见那张表，第一反应不是吃醋。表格里不是客户姓名，而是功能备注：情绪稳定、愿意办卡、有资源、可能投店。",
        doubt: "问题不只是多线聊天，而是多线对象被分配了不同收益功能。",
        contradiction: "TA 把不同暧昧对象按资源功能管理，不是普通服务热情。",
        reliability: "partial",
        questionOptions: [
          { question: "这张表除了备注，还有没有写下一步要做什么？", answer: "“下一次推进目标”。里面写着办卡、见朋友、谈入股。", contradiction: "排班表存在明确推进目标，说明暧昧被运营化。" },
          { question: "他平时会不会把所有熟客都写成这种备注？", answer: "这句把话题带到行业习惯，但表里每个人后面还有不同推进目标，不能只按普通客户备注看。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "后来他回我：“我从来没说只有你一个。”可我翻聊天截图，他发过“以后店开起来，你就是老板娘”。",
        doubt: "没说“唯一”，不代表没制造未来承诺。",
        contradiction: "TA 用未来身份暗示制造排他期待，同时保留口头退路。",
        reliability: "partial",
        questionOptions: [
          { question: "他说老板娘之后，有没有马上让你办卡或投店？", answer: "追问它之后是否接了消费、办卡或投资请求。", contradiction: "未来身份暗示后紧接着出现办卡和投店话题。" },
          { question: "你先把“老板娘”那句出现的场合补出来。", answer: "场合补出来了：深夜聊天。可后面紧接着办卡和投店，才是这句真正带出来的东西。", correct: false }
        ]
      }
    ],
    testimony: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        line: "“我不是因为 TA 和客户聊天生气，我是发现每个人旁边都有用途。”",
        kind: "truthWithGap",
        surface: "功能分组",
        hint: "多线的关键不是人数，是每条线各自换取什么。",
        followups: [
          { question: "你的那一栏写的是什么？", result: "情绪稳定、可长期陪聊、已办年卡。", contradiction: "TA 对咨询者的定位包含情绪供给和消费绑定。" },
          { question: "你们有没有正式确认？", result: "她顺着名分讲下去，话题被带走了，排班表里的备注反而没人继续问。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        line: "“我后来拿到另外两段截图，三个人都收到过‘你和别人不一样’。只有后半句不同：一个接办卡，一个接入股，一个接见朋友。”",
        kind: "halfLie",
        surface: "复制专属话术",
        hint: "专属感被复制，就不再只是暧昧。",
        followups: [
          { question: "哪句最能证明复制话术？", result: "“你和别人不一样”在三段聊天里完全一致。", contradiction: "同一句专属话术被复制给三个人。" }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        line: "“我现在不是只想骂他花心。我是突然觉得，我在那张表里不是女朋友，是一个可以长期陪聊、也已经办了年卡的人。”",
        kind: "sceneHint",
        surface: "咨询者卡住的点",
        hint: "边界追问要追功能，不只追称呼。",
        followups: [
          { question: "你最想让他回答的不是关系名分，而是那张表的用途？", result: "她说：对。你把不同人分成这些功能，是客户管理，还是恋爱关系？", contradiction: "多线对象被功能化管理，是这通电话最拧巴的地方。" }
        ]
      }
    ],
    evidenceCards: [
      { id: "daily-tony-roster", type: "排班表", title: "理发店预约表", front: "备注列写着“情绪稳定 / 能投店 / 能带客”。", detail: "备注不是服务需求，而是关系收益。", targets: ["truthWithGap", "sceneHint"], contradiction: "排班表显示多个暧昧对象被按功能分类。" },
      { id: "daily-tony-chat-copy", type: "聊天截图", title: "三份专属话术", front: "三个人都收到过“你和别人不一样”。", detail: "后续请求不同：办卡、投店、见朋友。", targets: ["halfLie"], contradiction: "专属话术被复制给不同对象。" },
      { id: "daily-tony-card", type: "消费记录", title: "办卡与礼物", front: "暧昧升温后一周内出现年卡和礼物消费。", detail: "情绪承诺与消费绑定。", targets: ["sceneHint"], contradiction: "未来承诺后紧接消费绑定。" }
    ],
    stageJudgement: "听到这里：这通电话不是单纯花心，而是把多线暧昧按情绪、消费和资源功能运营。",
    followupTwist: "后续回拨：另一位女生也发来私信，说她那栏写着“能投店”。直播间第一次意识到，这不是三角恋，是客户分层表。",
    dailyShareTitle: "你会从哪一句看出 TA 在养鱼？",
    dailyShareBody: "我抓到的不是暧昧聊天，而是排班表里的功能备注：情绪稳定、能投店、能带客。",
    dailyShareQuestion: "你觉得“你和别人不一样”算锤吗？",
    truth: "多线养鱼通过复制专属话术和功能分组换取情绪、消费与资源机会。"
  });
}

function dailyFakeProfileTemplate(brief, names) {
  const name = "咨询者";
  const other = "对方";
  return dailyBaseBrief(brief, names, {
    label: "存款证明",
    storyArcTitle: "今日连线：存款证明",
    publicHook: "见父母前，他发来学校、工作、收入截图，还补了一张存款证明。最怪的不是图，而是谁先把存款这两个字说出口。",
    storyArcSummary: "这通先听清：证明为什么出现，又是谁借父母的嘴把话推过去。",
    storySuspense: "标签都像真的，直播间先不急着骂人，也不急着替 TA 圆。",
    storyClueObject: "几张资料截图和一张存款证明",
    openingComplaint: "咨询者连线说：“我想问下我男朋友的事。我们是相亲认识的，最近聊到见父母，他发了学校、工作、收入截图，后面又补了一张存款证明。我越看越觉得，这事不像他一个人突然想出来的。”",
    openingDialogue: [
      { speaker: name, role: "caller", text: "主播你好，我想问下我男朋友的事。", mood: "thinking" },
      { speaker: "你", role: "host", text: "晚上好。你们怎么认识的，现在聊到哪一步了？", mood: "listening" },
      { speaker: name, role: "caller", text: "我们是相亲认识的，最近聊到见父母。我之前跟家里说过他条件不错，我妈就问得细了一点。", mood: "thinking" },
      { speaker: "你", role: "host", text: "她具体问了什么？你当时怎么接的？", mood: "listening" },
      { speaker: name, role: "caller", text: "我妈问学校、工作、收入稳不稳，还顺口问了一句有没有点积蓄。我跟他说的时候可能没那么顺口。他第二天发来几张截图，最后还补了一张存款证明。", mood: "anxious" }
    ],
    sceneVersions: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "见父母前，我手里现在是三张截图，加一张存款证明。学校、工作、收入是他先发的；但存款那张，我真说不清是他主动补，还是我把我妈的话转得太像在要。",
        doubt: "材料不是凭空出现的，存款证明尤其卡在父母、咨询者和对方三个人的面子中间。",
        contradiction: "存款证明的出现不是单方主动展示，咨询者转述父母问题时也把压力递了过去。",
        reliability: "mixed",
        questionOptions: [
          { question: "你把你转给他的原话说一下。", answer: "我说的是：我妈可能会问收入稳不稳、有没有点存款，你别到时候被问住。说完我自己也觉得，这话不像只是提醒。", contradiction: "咨询者借父母的提问，把存款压力提前递给了对方。", correct: true },
          { question: "存款证明这四个字是谁先说的？", answer: "我想了一下：不是我妈直接说证明，是我转述得太像在要一个能交代的东西。", correct: false },
          { question: "你当时为什么收下那张证明？", answer: "因为我已经跟家里说他条件不错。看到那张证明，我确实松了一口气。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我刚才又看了一眼，几张图都不像 P 的。学校那张有校徽，公司那张有尾缀，收入那张有数字，存款证明上也有余额。可每一张都停在最好看的地方。",
        doubt: "这不是当场打假，而是用真的局部制造足够体面的第一印象。",
        contradiction: "学校、工作、收入和存款都露出好看的局部，没露出来的地方才决定含金量。",
        reliability: "partial",
        questionOptions: [
          { question: "你让他把几张图边上那一块补全了吗？", answer: "我把图往上划了：学校那张右边多出项目名称，公司那张下面露出签约主体，收入那张后面还有绩效说明。存款证明没露开户时间和是否冻结。", contradiction: "学校、工作、收入和存款都露出好看的局部，没露出来的地方才决定含金量。", correct: true },
          { question: "他听见你问原图，第一反应是什么？", answer: "我记得他回得很快：你要这么想我也没办法。图没补全，话先变成了信不信任。", correct: false },
          { question: "如果他愿意补全原图，你还会介意吗？", answer: "如果他愿意把学制、合同主体、完整收入和存款证明边缘都补全，我会少一点不安。可问题不是介不介意，是为什么一开始只露够我拿回家交代的那部分。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        version: "我把他后来那句回复念出来：“你家里要看稳定，我给了；你又说我像在表演。那我到底要怎么做？先把饭吃了，别一上来就把我当面试。”",
        doubt: "这句不只是防御，也把父母的筛选、咨询者的转述和他的体面展示全搅在一起。",
        contradiction: "对方把补全材料的问题推成被面试，但没有解释为什么每份材料都只露到够体面的地方。",
        reliability: "partial",
        questionOptions: [
          { question: "他这句里最想让你接受的是什么？", answer: "他想让我承认：是我家先把问题问得像筛选，所以他发材料只是被逼出来的体面。", correct: false },
          { question: "你再看一遍，他有没有解释存款证明缺的那几项？", answer: "没有。他只反复说证明是真的，把问题从完整信息挪到真假二选一。", contradiction: "证明真假被拿来挡住证明用途、时间和完整性的追问。", correct: true }
        ]
      }
    ],
    testimony: [
      {
        speakerId: brief.complainantId,
        speaker: name,
        line: "“我不是想查他存款。我也承认，我之前跟家里说过他条件不错，所以他发来那张证明时，我其实松了一口气。”",
        kind: "halfLie",
        surface: "咨询者自己的面子压力",
        hint: "她也有自己的位置要维护，这会影响她为什么一开始没有追问。",
        followups: [
          { question: "所以你也不想让家里觉得自己看走眼？", result: "我其实有点不敢承认：对。我已经把话说出去了，所以我也希望那张证明是真的够稳。", contradiction: "咨询者也在用存款证明维护自己先前转述过的体面印象。" },
          { question: "你家里真正想从这些材料里确认什么？", result: "我妈嘴上说是看稳定，其实是想知道我带回去的人能不能跟我之前说的条件对上。我也怕前后说法打脸，他也怕饭局前被看低，所以那几张图才会变得这么有用。", correct: false }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        line: "“那些图都不一定假。学校标识、公司尾缀、薪资数字和存款余额都是真的一部分。只是它们刚好够我拿去跟家里交代。”",
        kind: "truthWithGap",
        surface: "真图没露出的地方",
        hint: "现在要看几份材料少掉的是不是同一种信息。",
        followups: [
          { question: "你把没露出来的边缘按顺序说一遍。", result: "我一张张看下来：学制、合同主体、完整收入页，还有存款证明的开户时间和冻结状态，都是父母真正会追问的部分。", contradiction: "多份材料同时避开择偶定位核心。" }
        ]
      },
      {
        speakerId: brief.complainantId,
        speaker: name,
        line: "“后来他回我：你家不是想看稳定吗？我给了，又说我表演。那这饭还吃不吃？”",
        kind: "sceneHint",
        surface: "聊天原话",
        hint: "这时候不用替谁定性，只看他有没有把话说全。",
        followups: [
          { question: "你把这句后面他怎么接的说完。", result: "他后面接的是：先见了面，别让一张证明把两个人都弄得难看。", contradiction: "存款证明被用来换取饭局继续，但完整信息被推到见面之后。" }
        ]
      }
    ],
    explicitClueGroups: [
      [
        "存款证明的出现不是单方主动展示，咨询者转述父母问题时也把压力递了过去。",
        "存款证明是双方你推我接出来的，不是单方凭空炫耀。"
      ],
      [
        "学校、工作、收入和存款都露出好看的局部，没露出来的地方才决定含金量。",
        "对方把补材料的问题推成信任问题，避开了具体内容。"
      ],
      [
        "多份材料同时避开择偶定位核心。",
        "咨询者也在用存款证明维护自己先前转述过的体面印象。",
        "证明真假被拿来挡住证明用途、时间和完整性的追问。",
        "存款证明被用来换取饭局继续，但完整信息被推到见面之后。"
      ]
    ],
    evidenceCards: [
      { id: "daily-profile-crop", type: "截图", title: "裁切材料", front: "公司抬头、学制、收入栏和存款证明边缘都没露全。", detail: "留下的信息都好看，被拿掉的信息都关键。", targets: ["truthWithGap"], contradiction: "多份材料同时避开择偶定位核心。" },
      { id: "daily-profile-program", type: "学历材料", title: "项目英文缩写", front: "学校标识真实，但项目路径未显示。", detail: "真学校不等于对方暗示的学历含金量。", targets: ["halfLie"], contradiction: "学校是真的，不等于标签含义真实。" },
      { id: "daily-profile-job", type: "岗位材料", title: "金融服务岗位", front: "公司材料显示业务支持/外包服务。", detail: "“金融企业”需要拆成公司、岗位、合同主体。", targets: ["halfLie", "sceneHint"], contradiction: "金融企业标签遮住岗位性质。" },
      { id: "daily-profile-deposit", type: "存款证明", title: "余额截图", front: "余额数字清楚，开户时间、冻结状态和账户用途没露出。", detail: "能证明有一笔钱，不等于证明这笔钱稳定、可用、属于长期积蓄。", targets: ["truthWithGap", "sceneHint"], contradiction: "存款证明只露余额，不露时间、冻结状态和账户用途。" }
    ],
    stageJudgement: "听到这里：这通电话不能直接定骗。学制、合同主体、收入和存款证明都只露好看的局部，父母真正会追问的完整信息被留在饭局后面。",
    followupTwist: "后续回拨：对方没有否认裁切，只说“你们家不是要看稳定吗，先把饭吃了”。咨询者沉默了一下，说她也不确定那句是不是自己先递过去的。",
    dailyShareTitle: "存款证明都发了，怎么反而更怪？",
    dailyShareBody: "今晚最好吵的是：存款证明不是突然冒出来的，谁先想看都说不清。",
    dailyShareQuestion: "你听完会觉得是包装，是试探，还是双方都在借父母的嘴？",
    truth: "存款证明不一定假，但它的出现本身就是关系压力的一部分。父母的筛选、咨询者的面子和对方的体面展示一起把饭局推向了更高门槛。",
    premeditated: false,
    premeditatedActorId: null,
    stance: "halfTruth"
  });
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
    taskProfile: taskProfileForPlot(plot.id),
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
      type: "图片线索",
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
    front: `连线里提到：${item}`,
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
  return [
    {
      speakerId: complainant?.id ?? null,
      speaker: name,
      version: `那天在${scene.name}，${other} 是突然把话题压过来的。我当时只能回应，根本没有准备。`,
      doubt: `TA 把“突然”说得很重，但没有主动说明 ${gap}，也没有解释为什么自己提前准备了材料。`,
      contradiction: `如果真是突然施压，为什么 ${packaging} 的说法在前一天已经出现在聊天里？`,
      reliability: premeditated ? "low" : "mixed"
    },
    {
      speakerId: null,
      speaker: `${other} 的材料摘录`,
      version: `截图里，${other} 的说法是：那天不是突然逼问，而是两人早就约好把关键问题说清楚。`,
      doubt: `TA 反驳得很快，但对自己能得到什么讲得很轻，像是把收益藏进了“沟通成本”里。`,
      contradiction: `TA 说“早就约好”，却拿不出明确约定，只能拿出几个含糊表情包。`,
      reliability: "mixed"
    },
    {
      speakerId: null,
      speaker: "材料摘录",
      version: `现场材料只能证明两个人确实在${scene.name}出现过，不能替任何一方的完整版本背书。`,
      doubt: "场景复原不是监控录像，它仍然是被选择过的叙事。",
      contradiction: `现场说法和双方叙事共同指向：${gap} 与 ${packaging} 需要单独对一对。`,
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
    return `${name} 是今晚第一个连线者。TA 说自己只想要一个说法，镜头却拍到 TA 手边放着两份材料：一份聊天截图，一份被折过的转账记录。${other} 还没进线，弹幕已经开始替 ${name} 下判断。`;
  }
  if (runNumber === 1 && order === 1) {
    return `${name} 的叙事几乎无懈可击：时间点清楚、说法齐全、连自己可能被误会的地方都提前解释过。越完整的故事，越像一间打扫过的房间，需要看看被收进抽屉里的东西。`;
  }
  if (stance === "trueVictim") return `${name} 接进直播间，说自己被 ${other} 的承诺拖住太久，现在只想知道该不该止损。`;
  if (stance === "badActorFirst") return `${name} 先来诉苦，把自己说成受害者，但 TA 回避了几个关键时间点。`;
  if (stance === "personalityMismatch") return `${name} 说自己被伤得很深，但初步听起来更像性格、沟通和家庭压力叠在了一起。`;
  return `${name} 的叙事听起来有委屈，也有空白；你需要把 ${other} 的版本一起拼进来。`;
}

function buildTestimony(plot, scene, complainant, respondent, stance, hiddenFacts, exaggerations, premeditated, caseMode) {
  const name = complainant?.name ?? "来访者";
  const other = respondent?.name ?? "对方";
  const primaryGap = hiddenFacts[0] ?? "关键事实";
  const primaryExaggeration = exaggerations[0] ?? "自身条件";
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
          contradiction: "诉求越含糊，越可能是在直播间里争取道德高位，而不是把话说完整。"
        }
      ]
    },
    {
      speakerId: null,
      speaker: `${other} 的材料摘录`,
      line: `对方材料里反复出现一句：“TA 没说的是，${primaryGap} 这件事从一开始就没讲完整。”`,
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
      speakerId: null,
      speaker: `${other} 的补充材料`,
      line: premeditated
        ? `材料里还有一句被截断的话：“如果不是我发现得早，TA 已经把下一步都安排好了。”`
        : stance === "personalityMismatch"
          ? `补充记录里写着：“我们可能都不算坏，只是每次沟通都变成互相证明谁更委屈。”`
          : `补充材料里承认：“我也有做得不好的地方，但不是 TA 连线里说的那个版本。”`,
      kind: premeditated ? "truthWithGap" : "defensive",
      surface: premeditated ? "真话但留白" : "防御性含糊",
      hint: premeditated ? "“下一步”是这类套路的关键词，要追钱、说法和时间线。" : "这类来电先别急着站队，等原话自己露出停顿。",
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
      line: `回看到这里，${scene.hint}`,
      kind: "sceneHint",
      surface: "场景提示",
      hint: plot.truth,
      followups: [
        {
          question: "这个场景有没有可能被双方都复原错？",
          result: "有。场景复原依赖记忆和立场，不能替代原话。",
          contradiction: "当两个人都在讲同一个现场时，矛盾点比情绪强度更重要。"
        }
      ]
    }
  ];
}
