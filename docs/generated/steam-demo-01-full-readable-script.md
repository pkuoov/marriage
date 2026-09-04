# 《Steam 试玩版》全量可读文字剧本

> 本文档由内容包自动汇编。它按真实游玩阶段整理夜 A、收麦幕间、白天调查、夜 B、材料与所有分支；同一阶段的互斥选项会并列收录，不表示它们会在一次实机流程里连续发生。方括号内是舞台或玩法说明，不是角色台词。需要逐屏核对固定代表路线时，请看“连续故事台本”。请修改 JSON 真源后运行 `npm run content:script`，不要手改本文档。

## 阅读图例

- **角色名：** 玩家能听见或读到的台词。
- `【可选】` 表示玩家选择、失败反馈、顾问分歧或未必进入本轮的分支。
- `【编剧资料】` 表示真相边界、人物利益、路线轴等不会原样播出的制作信息。
- 同一个表面名（如“咨询者”）只在所属案件内指向该案角色。

## 故事包总纲

- **主题：** 四通来电
- **开场提示：** 热线已经接进来。资料在后台，她已经开口了。
- **主题句：** 账单、审批页、工资流水和店表都是真的。人也会挑着说，只把对自己有利的那一截递到麦前。
- **观众观察题：** 材料对上的，就直说；材料没写的，到这儿为止。
### 暗线

- **标题：** 她们先没说的事
- **标签：** 材料没错，人挑着说
- **完整揭示：** 四通电话里，最先没说的都不是材料真假，而是谁先开口、谁得了好处、谁把钱往别人身上推。
- **低揭示：** 材料都在，她们先没说的那件事，你还有没听出来的。
#### 场景节拍

- 账单里有消费、借款和两笔认购，尾号 3301 仍没有名字。
- 三张审批页都写着通过，付款账户和回单号仍是空的。
- 学校图和工资卡都是真的，两边的全部家底仍没有摊开。
- 店表写了起投和走他户，十二万是否入产品仍不知道。

- **评论：** 图没假,她就是没把右边一起发啊
#### phrase Echo

- **标签：** 好听话后面接了什么
##### reveal Order

- 04-workplace
- 03-profile
- 02-tony

- **rule：** 相似措辞只能提示继续核对来源，不能证明来电人买过课、彼此认识或受同一人指使。
##### terms

- 安全感
- 态度
- 自己人
- 退出

## 【编剧资料】案件顺序与舞台索引

- **内容包 ID：** steam-demo-01
- **案件数：** 4
### 虚构机构登记

#### 1. chengchuan financial

- **内部 ID：** chengchuan-financial
- **display Name：** 澄川金融服务
- **类型：** consumer-credit-provider
- **fictional：** true

#### 2. chenzhi trust

- **内部 ID：** chenzhi-trust
- **display Name：** 宸直信托
- **类型：** trust-company
- **fictional：** true

#### 3. qixing shared tech

- **内部 ID：** qixing-shared-tech
- **display Name：** 栖行共享科技
- **类型：** shared-hardware-company
- **fictional：** true

### 跨案承诺账本

#### 1. chenzhi trust payment crisis

- **内部 ID：** chenzhi-trust-payment-crisis
- **entity Id：** chenzhi-trust
- **status：** paid-off
##### seed

- **案件 ID：** 01-credit
- **document Id：** case1-bank-flow
###### row Ids

- r13
- r14
- r15

##### reinforcement

- **after Case Id：** 01-credit
- **出现界面：** case-tail

##### corporate Seed

- **案件 ID：** 04-workplace
- **出现界面：** case-tail
- **entity Id：** qixing-shared-tech
###### anchors

- 主要股东
- 共享硬件
- 层层返费
- 估值

##### secondary Seed

- **案件 ID：** 02-tony
- **出现界面：** overnight-return
###### anchors

- 名单
- 十二万
- 走我户
- 宸直信托

##### tertiary Seed

- **案件 ID：** 03-profile
- **出现界面：** family-future-fund
###### anchors

- 二十八万八
- 三十万
- 九月底到期
- 宸直

##### payoff

- **after Case Id：** 02-tony
- **world Echo Id：** world-echo-chenzhi-payment-crisis

- **revalues：** 机构最后出现全面兑付危机，既扩大案一投资风险的社会背景，也让栖行共享科技依赖融资抬估值的扩张、最后一通里的十二万元代投、周的一百万元回单和案三女方父母三十万元未到期资产重新变重；不倒推证明任何一笔钱已经全部损失，也不替当事人的借款、挪用、回扣或彩礼加码免责。

### 来电标签

- 匿名来电
- 匿名来电
- 匿名来电
- 匿名来电

### 案件顺序

#### 1. 案件顺序 1

- **案件 ID：** 01-credit
- **剧情 ID：** lost-job-hidden-credit
- **scene Id：** rental-room
- **complainant Id：** shen
- **respondent Id：** xu
##### cast Profile Ids

- case1-caller-shen
- case1-respondent
- case1-friend
- case1-ex-coworker

- **act：** 体面
- **object Label：** 账单
- **舞台背景：** backdrop-credit
- **caller Art：** ./assets/generated/callers/pixel-case01/caller_credit_neutral_pixel.png?v=0.26.0
- **caller Art Style：** pixel
##### caller Art Variants

- **neutral：** ./assets/generated/callers/pixel-case01/caller_credit_neutral_pixel.png?v=0.26.0
- **guarded：** ./assets/generated/callers/pixel-case01/caller_credit_guarded_pixel.png?v=0.26.0
- **pause：** ./assets/generated/callers/pixel-case01/caller_credit_pause_pixel.png?v=0.26.0

##### caller Art Variant Plan

###### shaken

- **status：** planned
- **fallback：** pause
- **asset Path：** ./assets/generated/callers/pixel-case01/caller_credit_shaken_pixel.png

###### broken

- **status：** planned
- **fallback：** guarded
- **asset Path：** ./assets/generated/callers/pixel-case01/caller_credit_broken_pixel.png

- **evidence Board：** ./assets/generated/materials/case1-credit-evidence-board.png?v=0.27.0
##### difficulty Profile

- **tier：** 1
- **标签：** 开场体面
- **budget Delta：** 1
- **truth Boundary Prompt Limit：** 5

#### 2. 案件顺序 2

- **案件 ID：** 04-workplace
- **剧情 ID：** workplace-reimbursement-screenshot
- **scene Id：** office-chat
- **complainant Id：** chen
- **respondent Id：** shen
##### cast Profile Ids

- case4-caller-chen
- case4-colleague
- case4-finance
- case4-supplier
- case4-warehouse
- case4-department-assistant
- case4-leader
- case4-unknown-mover

- **act：** 主责
- **object Label：** 审批截图
- **舞台背景：** backdrop-work
- **caller Art：** ./assets/generated/callers/pixel-case04/caller_work_neutral_pixel.png?v=0.26.0
- **caller Art Style：** pixel
##### caller Art Variants

- **neutral：** ./assets/generated/callers/pixel-case04/caller_work_neutral_pixel.png?v=0.26.0
- **guarded：** ./assets/generated/callers/pixel-case04/caller_work_guarded_pixel.png?v=0.26.0
- **pause：** ./assets/generated/callers/pixel-case04/caller_work_pause_pixel.png?v=0.26.0

##### caller Art Variant Plan

###### shaken

- **status：** planned
- **fallback：** pause
- **asset Path：** ./assets/generated/callers/pixel-case04/caller_work_shaken_pixel.png

###### broken

- **status：** planned
- **fallback：** guarded
- **asset Path：** ./assets/generated/callers/pixel-case04/caller_work_broken_pixel.png

- **evidence Board：** ./assets/generated/materials/case4-workplace-evidence-board.png?v=0.27.0
##### difficulty Profile

- **tier：** 2
- **标签：** 流程加压
- **budget Delta：** 0
- **truth Boundary Prompt Limit：** 6

#### 3. 案件顺序 3

- **案件 ID：** 03-profile
- **剧情 ID：** education-income-fake-profile
- **scene Id：** live-call
- **complainant Id：** lin
- **respondent Id：** zhou
##### cast Profile Ids

- case3-caller-lin
- case3-caller-cousin
- case3-respondent
- case3-introducer
- case3-cousin

- **act：** 条件
- **object Label：** 彩礼与存款
- **舞台背景：** backdrop-profile
- **caller Art：** ./assets/generated/callers/pixel-case03/caller_profile_neutral_pixel.png?v=0.26.0
- **caller Art Style：** pixel
##### caller Art Variants

- **neutral：** ./assets/generated/callers/pixel-case03/caller_profile_neutral_pixel.png?v=0.26.0
- **guarded：** ./assets/generated/callers/pixel-case03/caller_profile_guarded_pixel.png?v=0.26.0
- **pause：** ./assets/generated/callers/pixel-case03/caller_profile_pause_pixel.png?v=0.26.0

##### caller Art Variant Plan

###### shaken

- **status：** planned
- **fallback：** pause
- **asset Path：** ./assets/generated/callers/pixel-case03/caller_profile_shaken_pixel.png

###### broken

- **status：** planned
- **fallback：** guarded
- **asset Path：** ./assets/generated/callers/pixel-case03/caller_profile_broken_pixel.png

- **respondent Art：** ./assets/generated/respondents/pixel-case03/respondent_profile_neutral_pixel.png?v=0.27.0
##### respondent Art Variants

- **neutral：** ./assets/generated/respondents/pixel-case03/respondent_profile_neutral_pixel.png?v=0.27.0
- **guarded：** ./assets/generated/respondents/pixel-case03/respondent_profile_guarded_pixel.png?v=0.27.0

- **evidence Board：** ./assets/generated/materials/case3-profile-evidence-board.png?v=0.27.0
##### difficulty Profile

- **tier：** 3
- **标签：** 条件反问
- **budget Delta：** 0
- **truth Boundary Prompt Limit：** 6

#### 4. 案件顺序 4

- **案件 ID：** 02-tony
- **剧情 ID：** tony-multi-dating
- **scene Id：** late-night-chat
- **complainant Id：** he
- **respondent Id：** chen
##### cast Profile Ids

- case2-caller-he
- case2-tony
- case2-regular
- case2-former-owner
- case2-manager
- case2-front-desk
- case2-other-customer
- case2-chenzhi-clerk

- **act：** 自己人
- **object Label：** 名单
- **舞台背景：** backdrop-tony
- **caller Art：** ./assets/generated/callers/pixel-sample-case02/caller_salon_neutral_pixel.png?v=0.26.0
- **caller Art Style：** pixel
##### caller Art Variants

- **neutral：** ./assets/generated/callers/pixel-sample-case02/caller_salon_neutral_pixel.png?v=0.26.0
- **guarded：** ./assets/generated/callers/pixel-sample-case02/caller_salon_guarded_pixel.png?v=0.26.0
- **pause：** ./assets/generated/callers/pixel-sample-case02/caller_salon_pause_pixel.png?v=0.26.0

##### caller Art Variant Plan

###### shaken

- **status：** planned
- **fallback：** pause
- **asset Path：** ./assets/generated/callers/pixel-sample-case02/caller_salon_shaken_pixel.png

###### broken

- **status：** planned
- **fallback：** guarded
- **asset Path：** ./assets/generated/callers/pixel-sample-case02/caller_salon_broken_pixel.png

- **evidence Board：** ./assets/generated/materials/case2-tony-evidence-board.png?v=0.27.0
##### difficulty Profile

- **tier：** 4
- **标签：** 名单压麦
- **budget Delta：** -1
- **truth Boundary Prompt Limit：** 6

### 独立快案入口

- 01-no-conditions
- 02-one-missed-message
- 03-labeled-fiction

### 快案直播反馈

#### patience Lost Comment

- **listener Id：** @耳机借我重听
先倒回去，刚才那句没挨着。

### 主线可选插播

#### 1. 主线可选插播 1

- **after Case Id：** 04-workplace
- **quick Case Id：** 01-no-conditions
- **action Label：** 接一通插播

## 演员与声纹速查

| 角色 | 类型 | 固定性格 | 压力反应 | 主要声纹 |
|---|---|---|---|---|
| 林旭阳 | host | 温热、有分寸，也有明确好恶 | 事实没闭合时先缩短句子，把混在一起的事拆开；证据已经对齐，对方还在把自己的代价甩给别人时，他会收笑、直说，火气只落在具体做法上。 | 平时稳、短，关键处停一下；真正动怒时不用分栏句，改用第二人称、具体动作和短句当面说。；X归X，Y是Y；先别定；把这两件事分开；这种话，我不会替你说的；我们不脱离感情只谈钱 |
| 老方 | production | 急躁的结果主义者 | 数据越差，句子越像截止日期和命令。 | 短促，先结果后期限。；数据；改版；下周一；这个劲儿 |
| 旁白 | narration | 克制的观察者 | 不用结论，只留下声音、灯和动作。 | 一到两句，画面先于判断。；灯；耳机；门；屏幕 |
| 赵律师 | advisor | 锋利的理性派 | 听见无证据定性会立刻打断，并补适用条件。 | 句短，判断后必跟边界。；落纸；不等于；前提是；我不猜动机 |
| 周会计 | advisor | 冷静的数字理性派 | 删掉形容词，只报金额、时间和路径。 | 短而平，常用三项并列。；路径；入账；转出；主语 |
| 小林老师 | advisor | 热络的感性现实派 | 先替行业解释一句，再把行话翻成人话。 | 口语、热络，先招呼再翻译。；行里的话；我先护一句行；小砸；这话得翻译 |
| 张法医 | advisor | 技术洁癖型理性派 | 碰到来源不全的材料会停止讨论结论。 | 硬、干，像检验报告。；原件；链条；来源；复印件 |
| 案一咨询者·沈 | caller | 敏感的体面维护者 | 越紧张句子越长，堆很多场面细节；一说到自己收过的钱和催过的电话就突然变短。 | 平时绵长，压力点骤短。；体面；挂不住；他安排的；我男朋友 |
| 案一男友 | respondent | 羞耻驱动的防御者 | 被问金额时把问题改写成信任和离开。 | 先柔后急，关键金额处绕回感情。；周转；体面；一家人；怕你离开 |
| 案一闺蜜 | offmic | 爱热闹又怕丢脸 | 先强调自己只是起哄，再缩短回答。 | 口语快，解释多。；我就随口；当时大家都；别算我 |
| 案一男方前同事 | offmic | 谨慎的人情债务人 | 问题靠近钱的去向时只剩一句拒答。 | 短，话到为止。；阔过；那是以前；别问我 |
| 第四通咨询者·何 | caller | 渴望被尊重的社交型人格 | 引用他的原话前会停；别人拿酒吧工作定性她时立刻变硬；问到自己花过多少钱时不再铺垫。 | 社交口语流畅；第一夜被问工作时只说作息、酒桌和花，第二夜问出警察和剪头客户后，场尾才把酒吧营销说具体；引用 Tony 对她生活方式的判断前会先反驳半句。；受用；顺；他；顺手帮忙 |
| Tony | respondent | 讨喜的即兴交易者 | 被逼着定义关系时退回服务和店务，把情绪词说成维护。 | 轻松、顺口，像边做事边聊。；自己人；你肯听；顺手；店里都这样 |
| Tony 案邻桌常客 | offmic | 厌烦套路的直肠子 | 听见熟悉话术就直接复述自己听过的版本。 | 话赶、带刺；先拿上次被推销的具体经历打断，再说这次只做什么。；你可少来；上回也是这么说的；今天就 |
| Tony 案小姐妹 | offmic | 酒桌知情却不愿当证人的朋友 | 先划清自己只说过门槛，再把后续动作推回何。 | 短、硬，先报自己说过什么，再用何的反应把责任推回去。；一百万起；我没让她买；酒桌上；赎回要排队 |
| Tony 案店长 | offmic | 急躁的防守型管理者 | 追问私表越深，越快结束谈话并关门。 | 快、硬，末句常封口。；店里教的；年轻人自己；盯不过来；门要关了 |
| Tony 案前台 | offmic | 安静的程序执行者 | 只读系统里能公开确认的字段。 | 礼貌、平直。；系统里；我只能确认；这一栏 |
| Tony 案另一位女客 | offmic | 受伤后外放的感性派 | 越被拒绝越想把个人尴尬变成共同指控。 | 情绪快，反问多。；不止我；一起去问；他也跟你说过 |
| Tony 案宸直柜员 | offmic | 守窗口权限的程序执行者 | 一碰到代持代购就不再回答，没有合同编号就结束谈话。 | 平、短，末句关窗。；起投一百万；个人认购；合同户名；窗口我要关了 |
| 案三咨询者·林 | caller | 数字化自保的理性派 | 更爱报精确数字、减少语气词；问到自己的八万四和父母那笔理财时句子骤短。 | 报数字时短而准；讲到自己的要求，会先绕到母亲身上，再被追问到第一人称。；二十三万八；二十八万八；我妈；九月底 |
| 案三咨询者表妹 | offmic | 替人递话的亲近晚辈 | 越怕姐姐反悔，越用玩笑和催促把话说快。 | 打字快，先交代姐姐的决定，再替她遮一句不好意思。；我姐；替她说；你们等着 |
| 案三相亲对象 | respondent | 受冒犯的条件维护者 | 被质疑时按项目、学费和工资账户逐项举证；被追问其他账户时明确拒绝公开。 | 克制、条列式，冒犯感藏在反问里；刷礼物进麦后句子变短，先争发言权再列授权范围。；二十三万八；二十八万六；工资卡；这几页可以 |
| 案三介绍人 | offmic | 嘴快、怕砸媒人的热心撮合者 | 越被两家围攻，越急着翻聊天记录；被问到依据时，先辩一句，再认自己没核实的具体话。 | 说得快，会抢着澄清；一问到凭什么，就从圆场变成认具体一句。；你先看聊天；这句是我说的；这句我没问过；我就想让他们先见一面 |
| 案三男方表姐 | offmic | 护家的感性防守者 | 先拒答；确认只问资料整理后才给半句。 | 先冷后松，答案保留主语。；这我不说；家里一起；别问他愿不愿意 |
| 第二通咨询者·陈 | caller | 想证明能扛事的焦虑新人 | 害怕时句子越来越短；复述公司话时给流程词加引号。 | 前段解释完整，压力点短促。；负责人；让我垫；流程；回单 |
| 职场案同事 | respondent | 圆滑的责任切割者 | 被问到账和署名时，会反复强调活动是对方主动争取的，再把付款推给财务。 | 顺滑、像工作消息，责任词切得很细。；活动是你争取的；审批已经过了；财务月底处理 |
| 职场案财务经办 | offmic | 冷静的程序理性派 | 争执越大越只报节点和缺件。 | 平直、短句，窗口还有人排队时会直接打断。；审批；付款；到账；凭证 |
| 职场案供应商项目员 | offmic | 谨慎的中立执行者 | 问题越敏感越退回对公记录。 | 客气、保守。；我们这边；只能确认；项目联系人；支付记录 |
| 职场案仓库管理员 | offmic | 朴实的记录主义者 | 只让人翻页、对日期，不接关系判断。 | 朴素，带操作指令。；翻到那页；入库单；日期；我这儿记着 |
| 职场案部门助理 | offmic | 规则型自保者 | 逐字复述模板，不评价任何私聊。 | 规整，像内部答复。；模板；群里发过；样本；私聊我不判断 |
| 职场案领导 | offmic | 冷硬的结果主义者 | 出现流程事故时，只催项目交付和活动总结。 | 简短、上位、不给情绪回应。；结果；季度总结；项目交了；流程自己补 |
| 搬过三次仓库的人 | offmic | 惜字如金的职场老手 | 只报自己经历过几次，不说公司名，也不替任何账户作证。 | 短消息，先落一句判断，再留下身份代号。；老规矩；专场；我再来 |
| 快案来电人·周女士 | caller | 很会把自己放在重感情的位置上，却总把不利事实拆开讲的体面自保者 | 第一轮先坚持自己只是漏回一条消息；被问酒是谁点的时，把第三个人缩成‘别人’和‘妹妹的朋友’，直到主播问性别才承认是男性；第二天对男方解释时，她也先只说妹妹，直到自己说漏一个‘他’才被追问出第三个人；她说明朋友圈现在三天可见，再自己翻出两批旧动态截图发给后台。等主播问到凌晨照片和近两个月的夜场频率，她才承认读研以后聚会一直不少、同行男的女的都有，却仍把长期状态缩成普通聚会。 | 开场句子柔和，先说自己的感受；被卡住以后语速变快，连续补理由，最后常用一个反问把事实问题改成立场问题。；不是同一天；真的是碰巧；我后来都解释了；又不是我约来的 |
| 快案长文作者·顾 | source | 把私人争议写成公开长文，并用数字、传闻和未公开材料维持注意力的高流量作者 | 不参与直播对话，只存在于公开文本里。长文先诉委屈，再放人物、金额和代孕传闻；文末留纯属虚构，收尾又说手里还有材料，并把退三千万、撤声明、认全文列成一套条件。 | 长文起头先绕、重复委屈，碰到物件和数字突然变短，结尾留半句和下一批材料。；我本来不想发；纯属虚构；三千万；五张卡；她自己清楚；我手里还有 |
| 快案来电人·罗 | caller | 擅长用低姿态和亲近感争取入口的机会主义自保者 | 被追到钱源时先坚持长期父女称呼、反问为什么非要分清，被逼着回答是否亲生以后才最小承认，再用隐私和自愿赠与转题；被回问为什么拿自己不能生孩子举例时先反问“你怎么能这么问”，直到主播再追一句才承认做过检查。 | 开头把要求说得很短、很宽；被卡住时拉长尾音叫“哥”，立刻补一句让自己显得好相处的话。；哥；我真的不挑；对我好就行；你帮我一次嘛 |
| 咖啡厅男方 | participant | 压着火、急于拿到确定结果的人 | 材料被逐页缩窄时会突然跳到孩子，句子从完整请求变成短问句。 | 开场礼貌完整，诉求一多会挤在一句里，越靠近孩子越短。；我准备离婚；那孩子呢；我没动 |
| 咖啡厅妻子 | participant | 把每一页材料单独降格的强防御者 | 时间和户名被并看后不再否认材料本身，改说材料只能证明最低限度。 | 句子短，先否定提问范围，再给一个最小解释。；只能说明；那是借的；孩子别碰 |
| 咖啡厅表哥 | participant | 会用证据效力争回场面控制的人 | 材料越对得上，越不谈内容，转而追问录像、录屏和后续剪辑。 | 先接一句‘对’，再用反问夺话。；不等于；能不能用；你是来调解还是来播出的 |

## 咖啡厅序章：开播前

### 离婚谈判、同晚核对与数日后回告

- **内部 ID：** prologue-cafe-opening
- **timeline：** 开播前 · 傍晚
- **标题：** 序章
- **副标题：** 咖啡厅 · 谈离婚
- **舞台背景：** day-cafe cafe-prologue-backdrop
#### puzzle Ledger

- **player Goal：** 把妻子承认的聊天、酒店订单和钱款往来固定下来，再让男方把离婚、财产和亲子诉求逐项说清；亲子线必须赶在孩子旧物被带走前保住可核来源的样本，账户线只看男方本人名下的家庭支出卡。
- **adversary Goal：** 妻子想把同日酒店与钱款往来分别降格成可编辑截图、普通住宿和私人借款；表哥则借证据效力争议逼节目停播。
##### mechanical Coupling

- 玩家必须先点出‘没去过酒店’这句原话，再亲手出示聊天截图或酒店订单；任一张都只能逼她承认开房，剩下那张仍不能证明顾*上过楼。
- 玩家打开逐行流水追问‘没跟顾*转过钱’，只打穿没有钱款往来，不越级证明借款性质或酒店内行为。
- 玩家决定开播前先查孩子旧物还是男方名下的家庭支出卡；当晚只走选中的一条，数日后的回告也只兑付这条。

- **pressure：** 桌边录像、表哥手机里的另一份录屏和双方对后续剪辑的争夺同时压上来；妻子带孩子离开后，留在共同住所的孩子旧物也可能随时被取走。
- **failure Boundary：** 不能在咖啡厅公开亲子结果，不能把酒店同住写成已经证明发生性关系，也不能用个人委托初检倒推女方何时知道孩子身世、为何结婚或给固定转账收款人补身份。

#### cafe

##### clip Draft

- **duration：** 15 秒
- **标题：** 她说没去酒店，怎么让她当场改口
- **status：** 待双方确认

##### opening Lines

###### 1. opening Lines 1

**旁白：** 傍晚。你和妻子赵律师按约来到咖啡厅。男方的妻子和她表哥已经坐在靠窗那桌。几张遮过名字的材料压在咖啡杯下，桌边录像机的红灯还亮着。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** narration

###### 2. opening Lines 2

**男方：** 林老师，赵律师，麻烦你们跑一趟。我准备离婚。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 3. opening Lines 3

**林旭阳：** 就昨天电话里聊的那些？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 4. opening Lines 4

**男方：** 对。她跟别的男人聊天，酒店订单也在。我不想再听她绕了。今天把家里的账算清，孩子以后怎么安排，也谈清楚。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 5. opening Lines 5

**林旭阳：** 先用桌边架好的手机录，省得后面谁说了又不承认。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 6. opening Lines 6

**妻子：** 我只答应把话说清楚，没答应拿孩子做节目。离婚可以谈，孩子的事没什么好谈的。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 7. opening Lines 7

**赵律师：** 孩子的事后面再说。你们愿意的话，你们也可以拍。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 8. opening Lines 8

**表哥：** 那就把镜头挪开，只录声音。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-cousin
- **表现类型：** participant

###### 9. opening Lines 9

**林旭阳：** 行，不拍脸。后续剪完的片子也会给你们看，你们不点头，我们也不会发。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

##### initial Account Lines

###### 1. initial Account Lines 1

**妻子：** 那我把话一次性说完。我和顾*就是认识得久一点，平时聊得多，没有其他关系。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 2. initial Account Lines 2

**妻子：** 我也没偷着去澜桥酒店。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 3. initial Account Lines 3

**妻子：** 他就是看见几张截图，自己越想越多。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 4. initial Account Lines 4

**妻子：** 我跟顾*也没转过钱。你要谈离婚，就谈我们俩的账。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

- **first Claim：** 我也没偷着去澜桥酒店。
##### claim Statements

###### 1. long acquaintance

- **内部 ID：** long-acquaintance
我和顾*就是认识得久一点，平时聊得多，没有其他关系。

- **miss Line：** 认识多久、聊了什么，你可以问。别把没问的先塞进我嘴里。

###### 2. hotel denial

- **内部 ID：** hotel-denial
我也没偷着去澜桥酒店。

- **是否核心项：** true

###### 3. screenshot dismissal

- **内部 ID：** screenshot-dismissal
他就是看见几张截图，自己越想越多。

- **miss Line：** 我说的是他看完截图以后自己乱想。你要问这句就问，别替他往下编。

###### 4. money denial early

- **内部 ID：** money-denial-early
我跟顾*也没转过钱。

- **miss Line：** 钱的事我刚说了没有。你想问什么就问清楚。

##### evidence Pair

###### 1. 联系人：顾*

- **内部 ID：** chat
- **document Kind：** chat
- **kicker：** 聊天截图
- **标题：** 联系人：顾*
- **detail：** 妻子发送｜21:18｜“我到澜桥酒店了”
###### remaining Lines

###### 1. remaining Lines 1

**妻子：** 等一下，你怎么会有我手机里的截图？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 2. remaining Lines 2

**男方：** 家里的平板还登着你的账号。那天消息自己同步过来，我截下来的。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### hit Lines

###### 1. hit Lines 1

**妻子：** 等一下，你怎么会有我手机里的截图？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 2. hit Lines 2

**男方：** 家里的平板还登着你的账号。那天消息自己同步过来，我截下来的。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 3. hit Lines 3

**林旭阳：** 这是你自己发的，‘我到澜桥酒店了’。你刚说没去过，房是谁开的？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 2. 澜桥酒店

- **内部 ID：** hotel
- **document Kind：** hotel
- **kicker：** 酒店订单
- **标题：** 澜桥酒店
- **detail：** 21:24｜入住人：妻子本人｜大床房 1 间
###### remaining Lines

###### 1. remaining Lines 1

**妻子：** 这个订单你又是哪儿来的？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 2. remaining Lines 2

**男方：** 预订邮件同步到家里的平板，订单还在。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### hit Lines

###### 1. hit Lines 1

**妻子：** 这个订单你又是哪儿来的？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 2. hit Lines 2

**男方：** 预订邮件同步到家里的平板，订单还在。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 3. hit Lines 3

**林旭阳：** 入住人写的是你。你刚说没去过，房是谁开的？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

##### revised Account Lines

###### 1. revised Account Lines 1

**妻子：** 那天是我自己住的酒店。我跟家里吵完，不想回去，就在那里住了一晚。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 2. revised Account Lines 2

**妻子：** 顾*跟这件事没关系，他没有上去。订单上也只有我一个人的名字。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 3. revised Account Lines 3

**妻子：** 钱上也一样。我跟顾*之间没转过钱。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 4. revised Account Lines 4

**妻子：** 你们别把聊天、酒店和钱全拧在一起。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

##### revised Claim Statements

###### 1. room admission

- **内部 ID：** room-admission
那天是我自己住的酒店。

- **miss Line：** 那天是我自己住的酒店，这句我已经说了。你还想问什么？

###### 2. alone stay

- **内部 ID：** alone-stay
我在那里住了一晚。

- **miss Line：** 订单上写的是我。你手里的东西也只能看到我。

###### 3. no upstairs

- **内部 ID：** no-upstairs
顾*没有上去。

- **miss Line：** 你们手里没有他上楼的东西。别拿猜的来问我。

###### 4. money denial

- **内部 ID：** money-denial
我跟顾*之间没转过钱。

- **是否核心项：** true

##### revised Evidence Miss Lines

###### chat

###### 1. chat 1

**妻子：** 这张图只能说明我说过自己到了酒店。你拿它问转账，问不着。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### hotel

###### 1. hotel 1

**妻子：** 订单上只有我的名字。你拿它问转账，也问不着。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

##### revised Present Lead Lines

###### 1. revised Present Lead Lines 1

**林旭阳：** 你刚才说得很清楚：你跟顾*之间没转过钱。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

- **money Claim：** 我跟顾*之间没转过钱。
##### transfer Evidence

- **内部 ID：** parallel-transfer-ledger
- **document Kind：** ledger
- **kicker：** 遮名银行流水
- **标题：** 三笔双向转账
- **detail：** 公开副本遮去金额，保留日期、方向和交易对手。
###### 表格行

- 4 月 12 日｜转出｜顾*
- 5 月 3 日｜转入｜顾*
- 6 月 17 日｜转出｜顾*

##### transfer Hit Lines

###### 1. transfer Hit Lines 1

**林旭阳：** 你刚说没转过钱。流水里有三笔，交易对手都是顾*。这个怎么说？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 2. transfer Hit Lines 2

**妻子：** 那是借的。有进有出，早就平了。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 3. transfer Hit Lines 3

**男方：** 你看，又变成借的了。完整流水我问了几次，她都不给。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

##### legal Requests

- **zhao Role：** 赵律师接受男方当场咨询，与林旭阳一同到场，协助把离婚和家账先谈清；她不代理诉讼，不替任何一方下裁判，亲子初检路径只在谈判吵散后私下告诉男方。
###### items

###### 1. 离婚与电子材料

- **内部 ID：** divorce-evidence
- **标题：** 离婚与电子材料
- **ui Note：** 留原手机、完整页面和订单来源
- **求助内容：** 男方准备起诉离婚，并把完整聊天、酒店订单来源和银行原始流水提交诉讼。
- **next Action：** 保留原手机、完整页面和来源信息，截图只作为桌边展示。
- **boundary：** 同日酒店和转账不当然证明持续、稳定共同居住，也不直接等于离婚损害赔偿成立。

###### 2. 共同财产

- **内部 ID：** marital-property
- **标题：** 共同财产
- **ui Note：** 先记已知账户和转账日期
- **求助内容：** 男方要求查明三笔转账和婚内共同财产范围；发现具体转移风险时申请财产保全。
- **next Action：** 先写明已知账户、转账日期和收款线索，再由诉讼程序调查。
- **boundary：** 只有怀疑不能当场冻结全部财产，借款、赠与和共同财产性质仍需材料。

###### 3. 亲子关系与孩子见面

- **内部 ID：** parentage-and-child-contact
- **标题：** 亲子关系与孩子见面
- **ui Note：** 先取得能说明怀疑来源的初步材料
- **求助内容：** 男方先取得有来源记录的初步排除意见；结果支持怀疑后，再向法院提出亲子关系异议并申请法院委托鉴定。孩子见面另行书面约时间。
- **next Action：** 先保全可核来源的样本，走个人委托的初步检测；委托、来源和流转记录一起留存。
- **boundary：** 个人委托意见只建立可审查的怀疑基础，不能直接改变法律亲子关系；法院是否准许鉴定仍要审查材料。

##### legal Claim Lines

###### 1. legal Claim Lines 1

**男方：** 酒店我不想再吵了。我现在就想离婚，把家里的账查清。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 2. legal Claim Lines 2

**赵律师：** 她说的自己都对不上了。聊下一个问题吧。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 3. legal Claim Lines 3

**男方：** 这两个月，她一直不让我看账户。我怕她还会往外转。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 4. legal Claim Lines 4

**赵律师：** 具体证据的事，我们回头再说。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 5. legal Claim Lines 5

**妻子：** 你们今天是来劝我们谈，还是来帮他告我？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 6. legal Claim Lines 6

**赵律师：** 他请我来，是想先把离婚和家里的账谈清楚。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 7. legal Claim Lines 7

**赵律师：** 你肯拿完整流水，我们现在对。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 8. legal Claim Lines 8

**赵律师：** 你不肯，我就按现有材料准备。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 9. legal Claim Lines 9

**赵律师：** 今天我们只聊现有的这些事。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 10. legal Claim Lines 10

**赵律师：** 我们还没到起诉离婚的程度。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

##### parentage Block Lines

###### 1. parentage Block Lines 1

**男方：** 钱的事先这么办。那孩子呢？你看着我说，他到底是不是我的？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 2. parentage Block Lines 2

**妻子：** 你有完没完？当着镜头问这个，你让孩子以后怎么做人？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 3. parentage Block Lines 3

**男方：** 我问了半年，你每次都拿些乱七八糟的理由堵我。你要说是我的，就跟我去做鉴定。敢不敢？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 4. parentage Block Lines 4

**妻子：** 我不做。你爱信不信。这个婚我离，孩子我带走。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 5. parentage Block Lines 5

**赵律师：** 你俩先别吵。孩子是不是他的，在这儿也掰扯不明白。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 6. parentage Block Lines 6

**旁白：** 妻子猛地推开椅子。表哥也跟着站了起来。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** stage

##### camera Break Lines

###### 1. camera Break Lines 1

**表哥：** 你们两口子合着伙逼她是吧？录像别关，刚才的话一段都别少。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-cousin
- **表现类型：** participant

###### 2. camera Break Lines 2

**旁白：** 表哥把自己的手机举起来。屏幕上也是刚才那段录像，进度条还在往前走。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** stage

###### 3. camera Break Lines 3

**表哥：** 大主播也不过如此。你们敢只剪问赢的那几句，我就把这份原片发出去。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-cousin
- **表现类型：** participant

###### 4. camera Break Lines 4

**赵律师：** 表哥，你那边先别录了。林旭阳，我们这边也关。还要谈就继续谈。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

##### pressure Choices

###### 1. 继续谈

- **内部 ID：** camera-off
- **标签：** 继续谈
- **说明：** 桌边不再录，剩下的条件不公开。
- **echo：** 你关掉桌边录像。后面的争吵不再录，已经拍下的片段暂不剪、不发。剩下的条件改为私下谈。

#### aftermath

##### opening Lines

###### 1. opening Lines 1

**旁白：** 同一晚，咖啡厅那桌彻底吵散。妻子和表哥先走。你和赵律师把男方送到停车场。半小时后，妻子已经把孩子接走，又发来一条语音。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** narration

###### 2. opening Lines 2

**妻子（语音）：** 那天是我自己住的酒店，三笔钱是借的。你们敢剪成别的，我就闹给你们看。孩子的事没得商量。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** message

###### 3. opening Lines 3

**赵律师：** 她不肯做，桌上再吵也没用。你真要去法院申请鉴定，不能只拿一句‘我怀疑’过去，手上得先有能支撑这个怀疑的具体东西。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 4. opening Lines 4

**男方：** 那我现在还能做什么？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 5. opening Lines 5

**赵律师：** 你先去问我给你的那家机构。他们让你怎么留，你就怎么留。说不定她明天就把孩子的东西都带走。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 6. opening Lines 6

**男方：** 那我现在回家？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 7. opening Lines 7

**林旭阳：** 那你现在回家。别私下找她理论，也别碰孩子。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

##### routes

###### 1. 沙发缝里的咬胶

- **内部 ID：** toy
- **标签：** 先联系机构，再看家里的旧物
- **说明：** 由机构判断什么能收，男方只报告原位置。
- **标题：** 沙发缝里的咬胶
###### lines

###### 1. lines 1

**男方（电话）：** 我到家了。沙发靠背缝里还有个硅胶咬胶，应该是她走得急，忘了拿。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 2. lines 2

**林旭阳：** 先跟机构说清它放在哪、是谁用过。能不能收，让他们判断。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 3. lines 3

**赵律师：** 机构愿意接，就按他们的登记走。现在只叫个人委托初检，别叫司法鉴定。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### handoff Lines

###### 1. handoff Lines 1

**赵律师：** 机构回话要几天。电话先留着，你去开播吧。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 2. 家庭支出卡

**家庭支出卡**

| when | 标签 | status | focus |
| --- | --- | --- | --- |
| 每月 5 日 | 住房贷款 | 银行自动扣款 |  |
| 四个月前 | 车辆贷款 | 已结清 |  |
| 每月 18 日 | 固定同额转出 | 摘要‘私教课时’ · 个人账户 · 户名未显示全 | true |

- **内部 ID：** account
- **标签：** 先看男方名下的家庭支出卡
- **说明：** 只看男方本人能下载的明细，不碰妻子的个人账户。
###### lines

###### 1. lines 1

**男方（电话）：** 家里有张日常开销卡，在我名下。房贷和平时家里花的钱都从这张卡走，近一年的明细我能下载。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 2. lines 2

**林旭阳：** 那就只看你这张卡。她自己的账户先别碰。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 3. lines 3

**周会计：** 明细我收到了。五号是房贷，十八号还有一笔固定转出。

#### 舞台标记

- **声纹卡 ID：** zhou-accountant
- **表现类型：** advisor

###### 4. lines 4

**林旭阳：** 车贷呢？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 5. lines 5

**周会计：** 四个月前就结清了，跟十八号这笔对不上。

#### 舞台标记

- **声纹卡 ID：** zhou-accountant
- **表现类型：** advisor

###### 6. lines 6

**林旭阳：** 十八号那笔备注写的什么？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 7. lines 7

**周会计：** ‘私教课时’。连续四个月，都是同一天、同一个数。收款人的名字没显示全。

#### 舞台标记

- **声纹卡 ID：** zhou-accountant
- **表现类型：** advisor

###### 8. lines 8

**林旭阳：** 你自己的卡，电子回单能下载吗？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 9. lines 9

**男方（电话）：** 能。我自己去银行APP里下。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### handoff Lines

###### 1. handoff Lines 1

**林旭阳：** 回单你自己下，先留在麦外。时间到了，我得回去开播。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

#### forensic

- **timeline：** 数日后
##### opening Lines

###### 1. opening Lines 1

**旁白：** 数日后。录制关闭，屏幕上只留张法医和当事人的个人委托检测回告。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** narration

###### 2. opening Lines 2

**张法医：** 这是个人委托的初步检测，不是法院鉴定。咬胶样本和男方样本都有登记。结果是排除生物学父子关系。

#### 舞台标记

- **声纹卡 ID：** zhang-forensic
- **表现类型：** advisor

###### 3. opening Lines 3

**男方：** 那我能不能拿这个结果，直接把孩子的关系改掉？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 4. opening Lines 4

**赵律师：** 不能。它只能让你的怀疑不再是一句空话。你可以带着它去法院提出亲子关系异议，再申请由法院委托鉴定。法院准不准，还要看其他材料。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 5. opening Lines 5

**林旭阳：** 这份初检只排除了他。生父是谁，我们不猜。孩子以后怎么安排，也不是这通电话能定的。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

##### account Clue Lines

###### 1. account Clue Lines 1

**男方：** 家庭卡的电子回单我从自己的银行APP里下来了。完整版给了赵律师。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 2. account Clue Lines 2

**男方：** 发给你们看的这份，我把名字遮了，只留了姓。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 3. account Clue Lines 3

**周会计：** 我看过了。十八号那笔，收款人不是顾*。

#### 舞台标记

- **声纹卡 ID：** zhou-accountant
- **表现类型：** advisor

###### 4. account Clue Lines 4

**赵律师：** 回单留好。这笔钱为什么每月都转，后面再查。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 5. account Clue Lines 5

**林旭阳：** 那就先别把这笔钱也算到顾*头上。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

##### final Cards

- **result：** 个人委托初检：排除生物学父子关系
- **open Account：** 固定转账收款人另有其人

##### unknown By Route

###### toy

- 孩子的生物学父亲是谁。
- 女方何时知道孩子与男方不存在生物学父子关系，以及她为什么仍然结婚。

###### account

- 固定转账收款人的身份没有向节目公开。
- ‘私教课时’是否对应真实课程、为什么持续支付、妻子是否知情。

#### 事实边界

##### 已确认

- 妻子否认去过澜桥酒店，随后承认房是自己开的；她否认与顾*转账，流水显示两人之间有三笔双向记录。
- 个人委托的初步检测中，机构登记的咬胶咬合面样本与男方对照样本排除生物学父子关系；该意见尚未替代法院委托鉴定或生效裁判。
- 男方名下的家庭支出卡里有一笔每月同日的固定转账，不是房贷或未结清车贷；摘要写着‘私教课时’，电子回单上的收款姓氏也不是顾。

##### 今晚定不了

- 酒店内具体发生了什么，三笔钱各自是借款、赠与还是其他用途。
- 孩子的生物学父亲是谁。
- 女方何时知道孩子与男方不存在生物学父子关系，以及她为什么仍然结婚；个人委托初检不能证明她此前的知情和婚姻目的。
- 固定转账收款人的身份没有向节目公开；‘私教课时’是否对应真实课程、为什么持续支付、妻子是否知情。

- **ending Line：** 初步排除亲生，还有一笔账没对上。

#### author Truth

- **wife Pregnancy Knowledge：** 女方怀孕时已经知道孩子不是男方的。
- **wife Marriage Motive：** 她仍然与男方结婚，目的就是取得婚内钱款后离开。
- **disclosure Boundary：** 这是后续主线的作者真相。试玩现有材料只证明个人委托样本组合排除生物学父子关系，尚不能证明女方何时知情或为何结婚。

#### rage Bait Contract

##### tier Plan

- Tier 2
- Tier 3

##### debts

###### 1. cafe only close chat

- **内部 ID：** cafe-only-close-chat
- **tier：** Tier 2
###### issue

- **location：** cafePrologue.cafe.openingLines
- **quote：** 那晚我没去澜桥酒店。

###### interest

- **location：** cafePrologue.cafe.evidencePair
- **trigger：** player-input
- **payoff：** 玩家先点出她否认去酒店的原话，再亲手压上一张能直接反驳它的材料；她被迫承认房是自己开的。
- **holding Limit：** 同一场

###### principal

- **location：** cafePrologue.cafe.transferEvidence
- **trigger：** player-input
- **payoff：** 玩家打开三笔双向转账，主播让她解释‘没跟顾*转过钱’，同时保留借款性质与酒店内行为未知。

###### next Debt

- **location：** cafePrologue.cafe.cameraBreakLines
- **quote：** 大主播也不过如此。

###### 2. cafe recording control

- **内部 ID：** cafe-recording-control
- **tier：** Tier 3
###### issue

- **location：** cafePrologue.cafe.cameraBreakLines
- **quote：** 你们敢只剪问赢的那几句，我就把这份原片发出去。

###### interest

- **location：** cafePrologue.cafe.pressureChoices
- **trigger：** player-input
- **payoff：** 玩家亲手关掉桌边录像，随后继续谈；未确认的片段不进入剪辑和发布。
- **holding Limit：** 同一屏

###### principal

- **location：** cafePrologue.forensic
- **trigger：** player-input
- **payoff：** 玩家先查咬胶，数日后只收到支持亲子怀疑的初步排除意见；先查家庭卡，则只收到十八日回单。两条都不在同一关同时兑付。

###### next Debt

- **location：** cafePrologue.forensic.accountClueLines
- **quote：** 十八号那笔，收款人不是顾*。

## 晚上八点：回到直播间

**旁白：** 晚上八点，你推开直播间的门。旧工牌还压着转接线，桌上的显示器已经亮了。

#### 舞台标记

- **表现类型：** narration

**运营 · 老方（工作消息）：** 深夜档这个月再不达标，就并进娱乐区。改版方案，下周一前给我。

#### 舞台标记

- **表现类型：** notice

**老婆：** 吃饭没有？汤在冰箱，记得热。还有个东西我塞你包里了，忙完再看。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** message

**林旭阳：** 我把工牌挪到一边，戴上耳机。改版的事，等下播再说。

#### 舞台标记

- **表现类型：** background

- **行动标记：** night-shell-broadcast-opened

【玩家操作：开始直播】

### 冷开场｜发债到首期付息

- **行动标记：** golden-90-first-interest

**旁白：** 你点下“开始直播”。屏幕上的三秒倒计时归零，开播提示音响了一声。

#### 舞台标记

- **表现类型：** stage
- **音频提示：** sfx.broadcast.on-air

**主播·林旭阳：** 晚上好，我是林旭阳。第一位来电人还没接进来，她先把男朋友刚发来的一段语音转到了后台。

#### 舞台标记

- **表现类型：** host

**男方语音（来电人转发）：** 我只是怕你知道我失业后就离开我。

#### 舞台标记

- **声纹卡 ID：** case1-respondent
- **表现类型：** caller
- **音频提示：** voice.case1.loyalty-message

**@还没下班：** 听着怪难受的。

#### 舞台标记

- **表现类型：** comment

【玩家操作：听完这条语音】

**主播·林旭阳：** 她把后半段也转来了。她问钱花去哪儿，男友没答。

#### 舞台标记

- **表现类型：** host

**第一位来电人（后台文字）：** 他就回我：‘我又没拿钱出去乱花，奖金这两天就发了。你先帮我把这期卡还上，别真拖到逾期，今晚转我行不行？’

#### 舞台标记

- **声纹卡 ID：** case1-caller-shen
- **表现类型：** caller

**@卡里没钱：** 等下，还在催她转钱？

#### 舞台标记

- **表现类型：** comment

【首期付息后，接入第一通来电。】

# 第一幕：账单里的八万

- **案件 ID：** 01-credit
- **剧情 ID：** lost-job-hidden-credit
- **内容包原题：** 今日来电：8 万信用卡周转

## 本案人物

| 角色 | 性格 | 欲望 | 防御动作 | 知识边界 |
|---|---|---|---|---|
| 案一咨询者·沈 | 敏感的体面维护者 | 她已经决定不拿八万，只想让主播公开确认自己不转也不欠情分，最好能把直播回放直接发给男友，同时不让男友和直播间知道十四个月的钱已经基本花完。 | 先强调没有同住、工资卡不在自己手里，第一夜完全不提房租；第二天流水出现周期住房支出后，被玩家追问才承认受益人是自己。她始终把‘不想给’说成‘拿不出来’，希望主播替她完成拒绝，并继续淡化实际余额和花销。 | 知道十四个月固定转账累计二十四万五、自己只剩一万一千六百多，也知道自己的消费、催款动作、见过的流水与对方说法；不知道尾号 3301 的主人。 |
| 案一男友 | 羞耻驱动的防御者 | 保住月薪三万五时养成的供养者形象，也把十四个月给出去的钱当成女友手里的应急存款，让眼前的八万有人接。 | 把离职补偿说成奖金，把二十四万五累计给付算成女友至少还有十五万，再用她的催款和关系词解释自己的冒险。 | 知道自己的失业、贷款、十四个月转账与八万元请求，也知道自己只是估算女友至少还有十五万；对她的真实余额和他人账户身份不能装作早已知道。 |
| 案一闺蜜 | 爱热闹又怕丢脸 | 继续做朋友，但别让自己显得也被人设骗过。 | 把自己的动作说成气氛到了。 | 只知道朋友圈、饭局和自己删过的评论，不知道男方账目。 |
| 案一男方前同事 | 谨慎的人情债务人 | 还一点旧人情，但不替任何现在的账作证。 | 承认早年的阔，不谈后来钱路。 | 只知道失业前的阔绰与旧账，不知道咨询者和男方的现在。 |

## 【编剧资料】案件发动机

- **戏剧锚点：** 信用卡账单、社保断缴截图、离职结算通知、十四个月固定转账与实际余额、二十万借款与两笔信托转账、老会员身份和开箱视频
- **为何今晚发生：** 对方再次要求咨询者拿八万处理信用卡，还把过去给她的钱也算了进来。她本来就不想给，账户里也根本拿不出八万；她没准备查清账，只想让主播替她确认：那些钱既然是男方自愿给的，她现在一分不出也不算亏欠。
### 公开求助

- **类型：** interest
- **求助内容：** 她想让主播支持她拒绝这八万。男友过去自愿给过的钱，不能在这时候拿来逼她还信用卡。

- **核心物件作用：** 账单被说成短期周转证明，社保截图先暴露失业时间，第二夜的离职结算通知再说明所谓奖金其实是待发补偿金；十四个月固定转账解释了男方为什么认定她拿得出八万，实际余额、老会员身份和开箱视频则露出咨询者早已把男友收入花进自己的生活。
- **咨询者所求：** 咨询者确实不想给这八万，来电时更想得到一句可以直接转述给男友的道德支持。她没有说男友连续十四个月转给她的一半工资已经基本花完，也没有说男友在半薪之外，每两个月还直接替她交一万元房租。男方以为她至少存着十五万，她实际只剩一万一千六百多。她看信用卡时先抓住男方约五千元的男装，对约四万元共同消费只是一句带过，也没有说明一万二的设备就是买给自己的。
- **对方所求：** 对方既想瞒住失业、继续当一个出手大方的男友，也认定十四个月给出去的二十四万五至少还剩十五万，八万才会开口向她要。他每月给出一万七千五，还要另外承担女方每月五千元房租和两人的排场消费，经济压力确实很重；但这不能替他隐瞒失业，也不能把借款、信托认购和信用卡缺口推给咨询者。
- **第三压力：** 朋友圈里的体面伴侣形象、朋友起哄、前同事人情和结婚态度测试。
- **咨询者自利删减：** 咨询者没有中立地问账；她想让主播替她确认自己一分钱也不用出。她自己参与过体面消费，也收下过那套短视频设备；念信用卡时，她先用约五千元的男装指责男方失业后乱花，把约四万元共同消费一句带过，也没有说设备就是买给自己的。她还强调两人没有同住、工资卡不在自己手里，省掉男友连续十四个月每月转她一万七千五，更没说银行流水里每两个月还有一万元房租由男方直接替她支付。二十四万五已经基本花完，账户只剩一万一千六百多。
- **公开钩子：** 他连续十四个月把一半工资交给女友，认定她至少存了十五万；她其实只剩一万一千六百多。现在，他让她先拿八万救信用卡。
- **故事概述：** 她先用五千元男装追问男方怎么花钱，却把约四万元共同排场一句带过，也一直没让他看十四个月半薪所剩的余额；他隐瞒失业，把累计给过的钱当成她现有的存款，又借钱买信托，想继续撑住两个人已经习惯的生活。
- **悬念：** 他为什么偏偏找她要八万？二十四万五累计转账、十五万存款估算和一万一千六百多实际余额，要与贷款和信托分开算。
- **线索物件：** 一份近五个月的银行流水、一张离职结算通知和双方对十四个月固定转账的说法：三万五月薪、存款误判、实际余额、借款、信托认购与待发补偿金。

## 夜 A：第一次来电

**咨询者：** 主播你好，我想问个自己的事。

#### 舞台标记

- **mood：** anxious

**林旭阳：** 你好，我在听。你说。

#### 舞台标记

- **mood：** listening

**咨询者：** 我刚转到后台那段，你听见了吧？我男朋友刚才找我，就是想让我先垫一笔钱。

#### 舞台标记

- **mood：** anxious

**林旭阳：** 听见了。后半段他还在催你今晚转。你转了吗？

#### 舞台标记

- **mood：** listening

**咨询者：** 没有。我把转账页面打开过，后来又退了。

#### 舞台标记

- **mood：** anxious

**林旭阳：** 那先别转。是什么钱？

#### 舞台标记

- **mood：** listening

**咨询者：** 他信用卡该还了。说奖金晚发，让我帮他顶几天。

#### 舞台标记

- **mood：** anxious

**林旭阳：** 要你垫多少？

#### 舞台标记

- **mood：** listening

**咨询者：** 八万。

#### 舞台标记

- **mood：** anxious

**林旭阳：** 他说什么时候还？

#### 舞台标记

- **mood：** listening

**咨询者：** 没说准，就说过几天。

#### 舞台标记

- **mood：** anxious

**林旭阳：** 那你自己怎么想？

#### 舞台标记

- **mood：** listening

**咨询者：** 我不想转。他还提以前给我花过的钱，说得像我今天不转，这一年半都是我欠他的。

#### 舞台标记

- **mood：** anxious

### 夜 A · 1｜credit-living-arrangement

**咨询者：** 不住在一起。他住他的，我住我的。

#### no Clue Reaction

**咨询者：** 住址我说了。钱不是一回事，别现在就往我身上算。

- **interaction Mode：** lineReplay
- **线索职能：** setup
- **错误框架：** 两人没有住在一起，日常的钱也就完全分开。
#### 回收目标

- credit-five-wan-gap
- credit-loyalty-test

- **说话人 ID：** shen
#### 正文前节拍

##### lines

###### 1. lines 1

**林旭阳：** 你们平时住在一起吗？

- **现场疑点：** 两人没有同住，但这不等于日常支出完全分开。
- **矛盾：** 男方工资卡没有交给她，却固定把一半工资转给她，持续了一年多；具体月数和金额留给后续流水。银行流水还会在第二天暴露另一笔她没有主动提的固定住房支出。
- **可靠度：** mixed
#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 工资卡一直在他自己手里？

**咨询者：** 对，没给我。

**林旭阳：** 那你这边每个月收到多少？

**咨询者：** 工资一到账，转我一半。

**林旭阳：** 转了多久？

**咨询者：** 一年多。每个月都转。

- **source Anchor：** 不住在一起
- **玩家所选怀疑方向：** 工资发下来后交不交给她
- **防备回答：** 对，没给我。他每个月会转一半，转了一年多。
###### logic Contract

- **premise Anchor：** 他住他的，我住我的
- **source Kind：** caller-statement
- **source Proves：** 咨询者与对方没有同住，男方也没有把工资卡交给咨询者。
- **source Does Not Prove：** 没有同住、没有交工资卡，不能证明双方日常收入与支出彼此独立。
- **answer Anchor：** 转我一半
- **answer Adds：** 男方固定把一半工资转给咨询者，持续了一年多；具体月数和金额仍待后续流水确认。
- **next Legal Question：** 可以继续核对固定转账和咨询者如何使用这笔钱，不能据此把男方自行签下的借款与信托认购归给咨询者。

- **矛盾：** 她说工资卡不在自己手里，却早已把男方半薪当成每月应到的钱。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 你们没住一起，平时的钱也完全分开吗？

**咨询者：** 也不是。他固定给我转过钱，前后有一年多。

###### miss Reaction

**咨询者：** 我没说完全分开。你别一听没住一起，就先算我欠了他多少。

- **source Anchor：** 他住他的，我住我的
- **玩家所选怀疑方向：** 没住一起时两个人怎么管钱
- **防备回答：** 没有完全分开。他固定给我转过钱。
- **是否核心项：** false
- **路线轴：** caller-credibility
- **路线口气：** caller-skeptical

#### 场尾自动拍

##### lines

###### 1. lines 1

**林旭阳：** 以前每个月都按时到？

###### 2. lines 2

**咨询者：** 对。就这个月第一次没来。

#### closure Contract

- **entry Anchor：** 他住他的，我住我的
- **closer Anchor：** 这个月第一次没来
- **adds：** 咨询者确认固定的半薪转账此前按月到账，本月第一次中断。
- **open Edge：** 这笔固定转账究竟持续了多久、她如何使用，以及男方流水里是否还有她没有说的支出。
- **route Independent：** true

#### 压力表演

- **意图钩子：** 分住以后仍有固定半薪往来
- **防备状态：** guarded

### 夜 A · 2｜credit-layoff-gap

**咨询者：** 这个月那笔没来，我问他，他还是说奖金晚发。我不放心，才让他把工资记录发来。工资记录没发，只给了我一份从电子社保卡导出的缴费记录，说公司漏缴了两个月。我翻到最后，才发现缴费停在四月。可四月以后，他还天天跟我说加班。

#### no Clue Reaction

**咨询者：** 这个我真不知道。他当时就说奖金，我手里没有别的话。

- **interaction Mode：** lineReplay
- **线索职能：** setup
- **错误框架：** 奖金晚发只是短暂周转。
#### 回收目标

- credit-eight-wan-bill

- **说话人 ID：** shen
#### 正文前节拍

##### lines

###### 1. lines 1

**林旭阳：** 这个月的钱没来，他又让你垫八万。你后来是怎么发现工作不对的？

#### 正文后节拍

##### lines

###### 1. lines 1

**林旭阳：** 你拿这张社保记录问过他吗？

###### 2. lines 2

**咨询者：** 问了。他说工资明细太私密，停两个月只是漏缴。我还是觉得不对，八万也没转。

- **现场疑点：** 说是奖金晚发，可社保已经断缴两个月。
- **矛盾：** 他用“奖金延迟”解释周转，社保停后却还在刷体面消费，资金缺口早已出现。
- **可靠度：** mixed
- **展示卡片：** daily-credit-social-security
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 他丢工作前，加班是什么样子？

**咨询者：** 天天说忙。可几点下班、跟谁吃饭，我都不知道。我们没住一起，他说加班，我就回“早点睡”。

- **source Anchor：** 还天天跟我说加班

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 借钱以前，他跟你提过工作出了问题吗？

**咨询者：** 没有。他还是天天说忙，项目要上线。有一回我说给他送点吃的，他让我别去，说公司门禁严。可那阵子，他可能已经不去公司了。

- **source Anchor：** 还天天跟我说加班
- **玩家所选怀疑方向：** 加班说法和失业时间
- **texture Role：** ramble
- **防备回答：** 他说忙，我就信了。我们没住一起，我也不想天天问他在哪。
###### logic Contract

- **premise Anchor：** 还天天跟我说加班
- **source Kind：** caller-statement
- **source Proves：** 咨询者持续听到对方说自己在加班。
- **source Does Not Prove：** 这些说法不能证明对方当时仍在职。
- **answer Anchor：** 没有。他还是天天说忙
- **answer Adds：** 借钱以前，对方没有主动说明工作已经出问题。
- **next Legal Question：** 继续核对断缴和账单时间，不能只凭加班说法确定离职日期。

- **矛盾：** 社保断缴早于借钱，失业不是突然发生。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** trust-but-verify

##### 2. 关键追问 2

**林旭阳：** 他为什么拿社保记录代替工资记录？

**咨询者：** 他说工资明细太私密，社保那张就够了，停两个月只是漏缴。我盯着那页看了半天，最后还是没拿到工资记录。

###### miss Reaction

**咨询者：** 他为什么给社保记录，你问我也没用。他没跟我说。

- **source Anchor：** 从电子社保卡导出的缴费记录
- **玩家所选怀疑方向：** 为什么用社保记录代替工资
- **是否核心项：** false
- **路线轴：** caller-credibility
- **路线口气：** caller-skeptical

#### 补充对话

##### 1. 补充对话 1

**林旭阳：** 他当时只说差多少钱吗？

**咨询者：** 一开始没有。他就说先帮他垫一下，别让卡逾期。我追问，他才把最低还款那一栏截给我看。

- **路线轴：** money-flow
- **路线口气：** detour

##### 2. 补充对话 2

**林旭阳：** 你当时为什么没接着问工作？

**咨询者：** 我问到‘是不是工作出问题了’，他脸一下就沉了。我就没往下问。

- **路线轴：** caller-credibility
- **路线口气：** softening

#### 压力表演

- **意图钩子：** 心疼话后面接钱
- **防备状态：** guarded

### 夜 A · 3｜credit-eight-wan-bill

**咨询者：** 我先看见右上角那个数，七万九……不对，八万零几百，反正是八万出头。往下翻，男装一共五千左右，光一件大衣就两千多，我当时就想，他都没工作了，怎么还给自己买这些。别的我没细算；往下翻的时候，我就记得几家餐厅、买礼物的，酒店那栏好像还划过去两回，后面那套放在我家的拍摄设备我倒认得，账上是一万二分期，反正我当时就盯着男装看。那些也不是我一个人花的。

【材料触发后的重述】 **咨询者：** ……两个人一起出去的也有。可你这么加，餐厅、酒店、礼物，还有设备……差不多四万，是跟我有关。

#### no Clue Reaction

**咨询者：** 你问哪一笔？我刚翻开账单，先看见的就是那几件男装。

- **interaction Mode：** lineReplay
- **线索职能：** misdirect
- **错误框架：** 八万主要是两人维持体面的消费。
#### 回收目标

- credit-anniversary-agency
- credit-five-wan-gap

- **说话人 ID：** shen
#### 正文前节拍

##### lines

###### 1. lines 1

**林旭阳：** 那张信用卡账单，你后来要到完整的吗？

###### 2. lines 2

**咨询者：** 要到了。他一开始只发最低还款那一栏，我说想看明细，他才补给我。

###### 3. lines 3

**林旭阳：** 把姓名和卡号遮一下，发到后台。

###### 4. lines 4

**咨询者：** 好，等我一下。

###### 5. lines 5

【几秒后，后台多了一份账单，姓名和卡号都遮住了。页面按日期、商户、金额和备注四列展开，右上角先亮出总额。】

- **现场疑点：** 金额、用途和时间都比“垫几天”重得多。
- **矛盾：** 咨询者先拿男方约五千元的男装证明他乱花钱，却把金额更大的餐厅、酒店、礼物和拍摄设备一句带过，也没有说明设备是买给自己的。
- **可靠度：** partial
- **展示卡片：** daily-credit-card-bill
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 那些餐厅是什么档次？

**咨询者：** 人均四五百。有两家是我收藏过的，他记住了。纪念日那家靠窗，他说提前两周才订到。

- **source Anchor：** 餐厅

##### 2. 自由追问 2

**林旭阳：** 礼物都送了些什么？

**咨询者：** 香水，还有一条项链。项链那次他自己发朋友圈，写“她值得”。我朋友全点赞，我还截图留着。

- **source Anchor：** 礼物

##### 3. 自由追问 3

**林旭阳：** 他开口的时候，要你垫的就是整整八万吗？

**咨询者：** 嗯。

【停顿】

**咨询者：** 一分没少。

- **source Anchor：** 八万零几百
- **路线轴：** money-flow
- **路线口气：** detour

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 我按着这张账单算过了。两个人一起花的差不多四万，他自己的衣服五千左右。还剩至少三万五，你问过这笔吗？

**咨询者：** 问过一次。他当时愣了一下，就说：‘我又没拿钱出去乱花，奖金这两天就发了。’我再问，他就岔开了。后面那句我开播前已经转给你了：‘你先帮我把这期卡还上，别真拖到逾期，今晚转我行不行？’

- **source Anchor：** 别的我没细算
- **revised Source Anchor：** 差不多四万，是跟我有关
- **玩家所选怀疑方向：** 八万里没说清的三万五
###### 唯一核心反转过场

- **内部 ID：** case1-unexplained-gap
- **类型：** reveal
- **过场短标：** 金额对不上
- **标签：** 还差至少三万五
- **visual Variant：** amount-gap

- **防备回答：** 问过，他没细说。开播前那句你们也听见了，他只顾着催我转。
###### logic Contract

- **premise Anchor：** 别的我没细算
- **source Kind：** host-calculation
- **source Proves：** 约四万共同消费和约五千男方个人男装之外，八万元总额中仍有至少三万五没有说明。
- **source Does Not Prove：** 金额缺口不能证明收款账户、借款用途或谁实际拿走了钱。
- **answer Anchor：** 奖金这两天就发了
- **answer Adds：** 对方被问到缺口时没有说明用途，反而继续催促当晚转账。
- **next Legal Question：** 第二夜继续查流水中的对应行和账户，不能把回避直接判成诈骗。

- **矛盾：** 八万元中至少三万五去向不明，对方被问时继续催款而没有解释。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 后面男装加起来也就五千，一件大衣两千多。单看这些，能说明他平时挥霍吗？

**咨询者：** 单看五千，确实说不上挥霍。可他那时候已经没工作了，我看到以后还是会不舒服。

###### miss Reaction

**咨询者：** 一件衣服当然不能。可我当时往下一翻，先看见的就是它，我能不生气吗？

- **source Anchor：** 男装一共五千左右
- **revised Source Anchor：** 两个人一起出去的也有
- **revised Question：** 两个人一起出去的消费，能不能都算到你一个人头上？
- **玩家所选怀疑方向：** 五千元男装是不是挥霍
- **是否核心项：** false
- **路线轴：** money-flow
- **路线口气：** softening

#### 补充对话

##### 1. 补充对话 1

**林旭阳：** 你第一眼先看到哪一栏？

**咨询者：** 先看到最低还款。八千多，我手都停了一下。再往下翻，才看到那些消费明细。

- **路线轴：** money-flow
- **路线口气：** detour

#### 压力表演

- **意图钩子：** 体面账单压上来
- **防备状态：** tense

### 中段立场快照

- **段后触发：** 4
- **kicker：** 中段立场快照
- **提示题：** 现在你最想先问哪一件？
- **说明：** 不判分。按下你现在最在意的那件事。
- **after Pick Line：** 八万为什么正好找她要？他发来的那页账，还没读完。
- **continue Label：** 继续听
- **recap Kicker：** 中段立场
#### 选项

##### 1. 她在要公开赦免

- **内部 ID：** caller-benefited
- **标签：** 她在要公开赦免
- **摘要：** 她不只是不转八万，还想让直播间替她证明过去十四个月一分不用解释。
- **反馈：** 她承认了：她不只想停转，还想拿一段回放去跟男友说。
- **recap：** 她想让直播间替她说，过去的钱全是男方自愿给的，她不用交代余额和花销。

##### 2. 她把固定给付说成几次消费

- **内部 ID：** respondent-shifted-debt
- **标签：** 她把固定给付说成几次消费
- **摘要：** 十四个月按月进卡，房租另付；她开场却只讲几次吃饭和男方买衣服。
- **反馈：** 固定转账不是几顿饭。她把长期拿进生活里的钱说轻了。
- **recap：** 十四个月每月一万七千五，房租另付，设备在她家；她开场却只说成几顿饭。

##### 3. 他拿失业和旧账逼她接盘

- **内部 ID：** both-performed
- **标签：** 他拿失业和旧账逼她接盘
- **摘要：** 信用卡、贷款和信托都在他名下，他却拿过去的给付催她当晚转八万。
- **反馈：** 他可以追问过去的钱花到哪儿，不能把自己签下的债直接塞给她。
- **recap：** 失业、贷款、信托和信用卡缺口都要由他解释；过去给过钱，不等于她替他签了债。

### 第一次收麦

**咨询者：** 他刚又发来一个文件，说我既然不信，就拿给你们看。姓名和卡号都遮了，只截了几个月的关键交易。我现在转后台。信用卡账单我也会再问一遍，明晚回来。

#### 舞台标记

- **after Scene Index：** 2
- **主播台词：** 好，就看他发来的这几页。账单里没说清的地方，明晚把他怎么回的告诉我。
- **stage Direction：** 电话断了。后台多出一份遮名交易摘录，信用卡账单还亮着，账单总额和已分项对不上。弹幕还在往上滚：“别转。”下一条是：“拿了他一年多的钱，这八万就该转。”
- **音频提示：** sfx.phone.soft-hangup

## 收麦幕间：控台短查

### 幕间行动

- **标题：** 收麦后·控台短查
- **kicker：** 出门前只够做一件事。
- **budget：** 1
- **min Actions：** 1
- **max Actions：** 1
- **continue Label：** 进入白天调查
#### actions

##### 1. 先翻往期账页

- **内部 ID：** recheck-history-pages
- **标签：** 先翻往期账页
- **摘要：** 自己按日期看看五月、六月和七月，不先让别人替你下结论。
- **cost：** 1
- **类型：** evidencePass
###### focus Check Ids

- credit-history-pages

###### 授予库存

- history-pages-reviewed

##### 2. 回闺蜜私信

- **内部 ID：** friend-dm-early
- **标签：** 回闺蜜私信
- **摘要：** 闺蜜补来她删掉的那条评论截图，可以先回一句。
- **cost：** 1
- **类型：** backflowEarly
- **hook Id：** credit-friend-dm
###### 授予库存

- friend-dm-seen

## 白天调查

- **白天开场：** 沈把遮掉姓名和完整账号的账页发到后台，同意节目只问日期、金额和付款项目。周会计答应只按日期看账页。下午最多处理两处。
- **白天行动预算：** 2
- **最少白天场景：** 2
### 地点 1

- **内部 ID：** day-accounting
- **标签：** 周会计的档案室
- **舞台背景：** day-document
- **类型：** studio
#### 场景正文

- **access：** 周会计是节目的长期顾问，只看沈同意交给节目的遮名账页，不猜姓名和账户。
旧厂房改的档案室，白炽灯照着一排铁柜。你把手机摘要递过去，周会计没接：「摘要不要。原件没拿到，就别拿半个姓猜人。先把四个日子排清楚，看看规律在哪儿断了。」

- **路线轴：** money-flow
- **获得物件：** 周会计的时间线
##### timeline Sort

###### cards

- 他开口借八万
- 分期开通
- 社保断缴
- 每月 8 日的固定入账中断

###### correct Order

- 社保断缴
- 分期开通
- 每月 8 日的固定入账中断
- 他开口借八万

- **payoff Line：** 周会计看完顺序，只点了点最后两张卡：「七月 8 号那笔固定入账没来，接着才是借八万。人是谁，手里这些东西看不出来。」
- **miss Line：** 周会计把纸转回来：「再排一次。先别猜转账的人，四张卡只看日期。」

### 地点 2

- **内部 ID：** day-support-payments
- **标签：** 把两笔房租圈出来
- **舞台背景：** day-document
- **类型：** studio
#### 场景正文

- **access：** 沈同意节目核对她上传的遮名流水；这里只看已经出现的日期、金额和收款方，不先猜房子是谁住。
回到工作室，你把三月九日和五月九日两行并排放大。两笔都是一万元，收款方都是安寓住房租赁，备注分别写着三至四月、五至六月。每月一万七千五的固定转账在另外几行。

- **路线轴：** money-flow
##### 场景选择

- **提示题：** 明晚先问她哪件事？
###### 选项

###### 1. 这两笔房租付的是谁住的房子

- **内部 ID：** ask-rent-home
- **标签：** 这两笔房租付的是谁住的房子
- **授予物件：** 两个月一次的房租
- **路线轴：** caller-credibility
- **路线口气：** beneficiary-edge
- **选择后正文：** 你在两笔住房租赁支出旁各画了一道线。

###### 2. 房租是否另算在每月一万七千五之外

- **内部 ID：** compare-rent-transfer
- **标签：** 房租是否另算在每月一万七千五之外
- **授予物件：** 房租是不是另外付的
- **路线轴：** money-flow
- **路线口气：** amount-edge
- **选择后正文：** 你把一万七千五的转账和次日的一万元房租并排标了出来。

### 地点 3

- **内部 ID：** day-bank-flow
- **标签：** 回后台审流水
- **舞台背景：** day-document
- **类型：** document
#### 场景正文

- **access：** 流水原页由沈本人上传，姓名和完整账号已经遮掉；节目只处理她明确同意公开的几行。
- **document Id：** case1-bank-flow
- **路线轴：** money-flow
- **获得物件：** 流水圈注

### 幕间物件映射

- **history pages reviewed：** 往期账页
- **friend dm seen：** 闺蜜删掉的那条评论

## 夜 B：回拨

- **收麦锚点：** 别的我没细算
- **收麦舞台：** 电话断了。后台多出一份遮名交易摘录，信用卡账单还亮着，账单总额和已分项对不上。弹幕还在往上滚：“别转。”下一条是：“拿了他一年多的钱，这八万就该转。”
- **hangup Audio Cue Id：** sfx.phone.soft-hangup
- **主播留话：** 好，就看他发来的这几页。账单里没说清的地方，明晚把他怎么回的告诉我。
### 带回物开场（全部分支）

#### 周会计的时间线

- **台词：** 周会计那张时间线，我看了好几遍。五月 8 号、六月 8 号都有一万，翻到七月 8 号，空的。
##### 回拨首次冲突

###### lines

###### 1. lines 1

**林旭阳：** 五月、六月都有一万进来，七月 8 号却空了。给你的那两笔也是这个月一起停的吗？

###### 2. lines 2

**咨询者：** 对。一万七千五没来。我那天问了他好几次，他一直拿奖金晚发搪塞。

###### 3. lines 3

**林旭阳：** 那你昨晚为什么只说他奖金晚发？

- **咨询者台词：** ……说成断了，话就重了。
- **pause After Caller Line：** true
- **caller Followup Line：** 我只敢跟自己说，他是奖金晚发。

#### 两个月一次的房租

- **台词：** 我又看了一遍流水。三月和五月那两笔一万，我知道你会问。
##### 回拨首次冲突

###### lines

###### 1. lines 1

**林旭阳：** 那是你住的房子，还是他住的？

###### 2. lines 2

**咨询者：** 是我住的。他两个月替我交一万，房租不在一万七千五里面。他自己住的地方也要另外花钱。

###### 3. lines 3

**林旭阳：** 这件事你昨晚为什么没说？

###### 4. lines 4

**咨询者：** 我昨天只想着八万不是我欠的。我知道一说房租，弹幕肯定要骂我。

#### 房租是不是另外付的

- **台词：** 我又看了一遍流水。一万七千五的转账后面，还跟着一笔房租。
##### 回拨首次冲突

###### lines

###### 1. lines 1

**林旭阳：** 房租算在每月一万七千五里面吗？

###### 2. lines 2

**咨询者：** 不算。他每个月转一万七千五，两个月再替我交一万房租。可他当时说，房租算他帮我，不是我逼他给的。

###### 3. lines 3

**林旭阳：** 你自己的八千多工资呢？

###### 4. lines 4

**咨询者：** 也基本花完了。我平时没算过这些，真以为他手里还有钱。

#### 流水圈注

- **台词：** 三月十一号那行我看见了。澄川金融打进来二十万，备注写的是借款。
##### 回拨首次冲突

###### lines

###### 1. lines 1

**林旭阳：** 这二十万，他以前跟你提过吗？

###### 2. lines 2

**咨询者：** 没有。他只说自己在看一个投资机会，没说钱是借来的。

###### 3. lines 3

**林旭阳：** 后面两笔宸直信托呢？

###### 4. lines 4

**咨询者：** 我也是昨天才看到。十二号十万，十四号又十万。

###### 5. lines 5

**林旭阳：** 宸直这个名字，他以前说过吗？

###### 6. lines 6

**咨询者：** 说过。他嫌十来个点太慢，说真想翻身就得找能翻倍的。我以为他只是嘴上说说。

#### 往期账页

- **台词：** 前几个月还有两笔。五月 8 号、六月 8 号各进过一万，到了七月 8 号，那天是空的。
##### 回拨首次冲突

- **主播台词：** 前两笔是谁转的，你知道吗？
- **咨询者台词：** 不知道。他不肯说，流水上也只看得到一个姓。

#### 闺蜜删掉的那条评论

- **台词：** 闺蜜把删掉的评论发回来了。我看着那句‘这才像被认真对待’，脸有点烫。那场面，我也撑过。
##### 回拨首次冲突

- **主播台词：** 她起哄，你也发了照片。可这些跟你今晚要不要转八万，不是一回事。
- **咨询者台词：** 他在拿。我昨晚也差点拿它替自己装无辜。八万不抵。

### 无带回物兜底开场

- **台词：** 我想了一晚上，还是得把话说完——你接着问吧。

### 回拨立场

- **against Caller：** 我差点不打回来。刚才弹幕……我都听到了。你要是也觉得是我贪体面，这通我讲不下去。
- **with Caller：** 我回来了。八万的事，你继续问。我把白天重新看过的流水也带来了。

### 立场快照回应拍

- **caller benefited：** 昨晚你说，我打进来就是想让你替我说一分钱不用出。我不爱听。可那十四个月的钱，我确实得自己讲。
- **respondent shifted debt：** 昨晚你说，我把固定转账讲成了几次消费。今天流水在后台，你按十四个月问。
- **both performed：** 昨晚你说，他拿失业和旧账逼我接盘。八万我没转；过去的钱花在哪儿，我也不躲。

### 来电人反问

- **提示题：** 你都问到这里了，总不能还让我把这八万转过去吧？
#### 选项

##### 1. 八万别转。但你收过多少钱、花到哪，要自己跟他说。

- **内部 ID：** not-your-debt
- **标签：** 八万别转。但你收过多少钱、花到哪，要自己跟他说。
###### lines

###### 1. lines 1

**咨询者：** ……我本来还想把你说的‘别转’直接发给他。可行，前面那些钱我自己跟他讲。

- **路线轴：** caller-credibility

##### 2. 这八万是他的债；以前给你的钱怎么算，你们另外谈。

- **内部 ID：** ask-fifty-thousand
- **标签：** 这八万是他的债；以前给你的钱怎么算，你们另外谈。
- **咨询者台词：** 好。八万我不转，之前的钱我也不拿这通直播直接堵他。我把花销列出来再谈。
- **路线轴：** money-flow

##### 3. 今晚别转。前面十四个月的钱怎么花，你自己跟他说。

- **内部 ID：** dont-answer-for-her
- **标签：** 今晚别转。前面十四个月的钱怎么花，你自己跟他说。
- **咨询者台词：** ……明白。贷款让他解释，我拿过的钱和剩下的钱，我自己说。
- **路线轴：** process-control
- **recap Aftertaste：** 八万没有转，直播也没有替她把过去所有给付说成一笔勾销。

### 夜 B · 1｜credit-anniversary-agency

**咨询者：** 对，那晚坐的是靠窗位，他说两周前订的。主要贵在酒，他看中一瓶，我说太贵了。他说：“都纪念日了，总不能太寒酸。”他还是点了，我没再拦。当天只有我发朋友圈，他没发，身边朋友都挺羡慕我的。

#### no Clue Reaction

**咨询者：** 那晚就这些。别的我现在想不起来。

- **interaction Mode：** lineReplay
- **线索职能：** reversal
- **错误框架：** 纪念日完全由对方单方面安排。
#### 回收目标

- credit-device-benefit

#### 段后触发

- **类型：** evidenceCheck
- **材料检视 ID：** credit-anniversary-footprint
- **标签：** 把纪念日那页接上
- **continue Label：** 继续问那套设备

- **说话人 ID：** shen
#### 正文前节拍

##### lines

###### 1. lines 1

**林旭阳：** 账单里有一笔餐厅消费特别高，挺舍得花。是纪念日那晚吗？

#### 正文后节拍

##### lines

###### 1. lines 1

**林旭阳：** 先等等。靠窗位提前两周也未必订得到。你们俩是不是有人是那里的老会员？

###### 2. lines 2

**咨询者：** ……那家店确实难订。你等一下。会员……会员是我的。跟他在一起以前就办了。那晚也用了我的号。

- **现场疑点：** 她承认自己是老会员，但过去的高额消费由谁承担还没说。
- **矛盾：** 咨询者用自己长期积累的会员资格订座，却把纪念日晚餐说成对方单方面安排。
- **可靠度：** mixed
- **展示卡片：** daily-credit-anniversary
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 你自己一个人去过那家店吗？

**咨询者：** 没有。不是约会就是朋友聚餐，我自己不会订靠窗那排。

- **source Anchor：** 靠窗位

##### 2. 自由追问 2

**林旭阳：** 他没发朋友圈，你当时问过他吗？

**咨询者：** 问过。他说自己不爱发这些，叫我发就好。我那时候没多想。

- **source Anchor：** 他没发

##### 3. 自由追问 3

**林旭阳：** 那晚的照片删了吗？

**咨询者：** 没删。

【停顿】

**咨询者：** 舍不得。里面那盏灯拍得挺好看的。

- **source Anchor：** 朋友圈
- **路线轴：** caller-credibility
- **路线口气：** detour

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 用你的会员号订的，是你订的，还是他拿你的号订的？

**咨询者：** 我不知道他是自己操作，还是让餐厅用我的号订的。我只知道那晚用了我的会员号。

**林旭阳：** 你一个月八千多，如果自己结账，会来这家吃吗？

**咨询者：** 认识他以前，我跟前任也来过几次，基本都是对方结账。那时候……约会不都这样吗。

- **source Anchor：** 他说两周前订的
- **玩家所选怀疑方向：** 订座的人和她当时的收入
- **防备回答：** 我不知道是谁操作的，只知道用了我的会员号。
###### logic Contract

- **premise Anchor：** 跟他在一起以前就办了
- **source Kind：** caller-statement
- **source Proves：** 咨询者在这段关系以前已经是餐厅会员，那晚也使用了她的会员号。
- **source Does Not Prove：** 会员号不能证明订座操作由谁完成，也不能证明过去的账由她本人支付。
- **answer Anchor：** 基本都是对方结账
- **answer Adds：** 咨询者月收入只有八千多，过去的高消费多由此前交往对象结账，会员等级由此积累。
- **next Legal Question：** 可以追问她对约会消费的长期预期，不能据此替当前男方的债务免责。

- **矛盾：** 咨询者不知道订座由谁操作，却确认自己的会员资格来自过去由交往对象买单的高消费。
- **是否核心项：** true
- **路线轴：** caller-credibility
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 那晚他说过手头紧吗？

**咨询者：** 没有。他还说这顿算他的，叫我别看价格。我还挺高兴，真没看。现在账单摆出来，我才知道那句话也是刷卡。

###### miss Reaction

**咨询者：** 他没说手头紧。那晚一直说的是纪念日。

- **source Anchor：** 总不能太寒酸
- **玩家所选怀疑方向：** 纪念日晚餐前有没有说手头紧
- **是否核心项：** false
- **路线轴：** money-flow
- **路线口气：** trust-but-verify

##### 3. 关键追问 3

**林旭阳：** 朋友羡慕你时，你有没有说过那个位置其实是你订的？

**咨询者：** 没有。她们都说我没看错人，我听着挺高兴，就没解释。

###### miss Reaction

**咨询者：** 我朋友怎么想，跟这笔账有什么关系？

- **source Anchor：** 身边朋友都挺羡慕我的
- **玩家所选怀疑方向：** 朋友是否知道靠窗位是她订的
- **是否核心项：** false
- **路线轴：** outer-thread
- **路线口气：** softening

#### 场尾自动拍

##### lines

###### 1. lines 1

**林旭阳：** 纪念日这顿先放这儿。你刚才还提到一万二的分期。

#### closure Contract

- **entry Anchor：** 一万二的分期
- **closer Anchor：** 一万二的分期
- **adds：** 确认纪念日订座、点酒和朋友圈各自由谁完成，并回到此前尚未说明用途的一万二分期。
- **open Edge：** 这笔分期买了什么，以及谁实际受益。
- **route Independent：** true

#### 压力表演

- **意图钩子：** 老会员消费来源暂时留白
- **防备状态：** guarded
##### 表情/听感

- **类型：** shift
她翻东西的声音停了

### 场间实时反压

- **内部 ID：** credit-night-b-first-interest
- **类型：** interruptToast
- **cost：** 0
- **after Scene Index：** 3
- **from：** 弹幕风向
#### lines

##### 1. lines 1

【房租是不是另付的？刚才没听清。】

##### 2. lines 2

【等下，每月一万七千五里，到底算没算房租？】

##### 3. lines 3

**咨询者：** 我刚才没说房租。先看他后面发了什么。

### 夜 B · 2｜credit-bank-flow

**咨询者：** 是给我买的。送到我家以后，也一直是我在用。可我当时真以为他付的全款，分期那两个字，我是这两天才在账单上看见的。

#### no Clue Reaction

**咨询者：** 灯在我家。我现在能说的就是这个。

- **interaction Mode：** lineReplay
- **线索职能：** missing-edge
- **错误框架：** 分期由对方操作，所以八万元里没有任何一笔是直接花给咨询者的。
#### 回收目标

- credit-loyalty-test

#### 段后触发

- **类型：** evidenceCheck
- **材料检视 ID：** credit-leveraged-trust
- **标签：** 把借款和宸直转账放一起
- **continue Label：** 回到刚进来的消息

- **说话人 ID：** shen
#### 正文前节拍

##### lines

###### 1. lines 1

**林旭阳：** 昨晚你只说，账单里有一套放在你家的拍摄设备。那一万二，到底是给谁买的？

- **现场疑点：** 她承认一万二的设备是专门买给自己的，第一夜却只说设备放在自己家，没有说明这笔钱直接花给了自己。
- **矛盾：** 八万元里已经有一万二直接花在咨询者身上，她此前只交代设备放在自己家，避开了自己是直接受益人。
- **可靠度：** mixed
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 探店号你做起来了吗？

**咨询者：** 发了十几条。最高一条八百多赞。他每条都转。

- **source Anchor：** 送到我家以后

##### 2. 自由追问 2

**林旭阳：** 那套设备现在还用吗？

**咨询者：** 灯上个月还开过。现在拍不动了，一开灯就想起这事。

- **source Anchor：** 一直是我在用

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 昨晚你只说那套设备放在你家，没说东西就是给你买的。为什么把这件事省了？

**咨询者：** 你们一听是给我买的，肯定就要把八万都算我头上。

**林旭阳：** 我现在只问这一万二。

**咨询者：** ……行。这一万二是花在我身上。

**林旭阳：** 分期呢？

**咨询者：** 不是我签的。

- **source Anchor：** 是给我买的
- **玩家所选怀疑方向：** 她为什么没提一万二设备
- **防备回答：** 设备是在我这儿。可你们一听这个，八万是不是又都要算到我头上？分期又不是我开的。
###### logic Contract

- **premise Anchor：** 是给我买的
- **source Kind：** caller-statement
- **source Proves：** 八万元中有一万二购买的设备直接交给咨询者使用。
- **source Does Not Prove：** 设备买给咨询者不能证明她事先知道分期、同意借款或承担整张信用卡。
- **answer Anchor：** 这一万二是花在我身上
- **answer Adds：** 咨询者承认自己开场避开这笔直接受益，是怕观众把整笔八万元都算到她头上。
- **next Legal Question：** 可以继续追问信用卡里至少三万五的用途，仍须把设备受益、分期责任和未知金额分开。

- **矛盾：** 咨询者承认一万二设备直接买给自己，也承认开场有意淡化这笔受益。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 他买设备的时候，有没有跟你说过要一起还分期？

**咨询者：** 没有。他说的是买来支持我做账号。我没签，也没答应一起还。这一万二确实花给了我，可他办分期的时候没跟我商量。

###### miss Reaction

**咨询者：** 他从没跟我说一起还。你别先把这个前提放进去。

- **source Anchor：** 分期那两个字
- **玩家所选怀疑方向：** 设备分期有没有说过一起还
- **是否核心项：** false
- **路线轴：** document-edge
- **路线口气：** trust-but-verify

#### 补充对话

##### 1. 补充对话 1

**林旭阳：** 他说投资你的时候，你怎么回的？

**咨询者：** 我没拦。还挺高兴的。那时候我真以为他是买来送我的。

- **路线轴：** money-flow
- **路线口气：** softening

#### 场尾自动拍

##### lines

###### 1. lines 1

**林旭阳：** 后台流水里还有两笔宸直。先把借款和这两笔转账对一下。

#### 舞台标记

- **生活噪声标记：** true

#### 压力表演

- **意图钩子：** 一万二直接买给她
- **防备状态：** guarded
##### 表情/听感

- **类型：** pause
听筒离远了一点，回来时她先吸了口气

### 场间实时反压

- **内部 ID：** credit-live-listener-screenshot
- **类型：** emotionalChoice
- **cost：** 0
- **after Scene Index：** 6
- **from：** 来电人转读手机
#### lines

##### 1. lines 1

**咨询者：** 等等——他刚发我消息。

##### 2. lines 2

【停顿】

##### 3. lines 3

**咨询者：** 一张截图。上面还有一句：‘你闺蜜把链接发我了。’他在听。

#### choices

##### 1. 他已经在听了。你还愿意继续吗？你说停，我们现在就停。

- **内部 ID：** ask-to-continue
- **direction Label：** 把继续与否交还给她
- **标签：** 他已经在听了。你还愿意继续吗？你说停，我们现在就停。
###### lines

###### 1. lines 1

**咨询者：** 继续。我本来就是来问这笔账的，不能他一听见，我就不敢说了。

- **recap Aftertaste：** 他发来直播截图以后，我先问她还愿不愿意继续。她说继续，我们才把账问完。
- **立场变化：** open
- **路线轴：** caller-credibility
- **路线口气：** reassure

##### 2. 我先关一分钟麦。你不用回他，想好了再告诉我还要不要继续。

- **内部 ID：** mute-before-continuing
- **direction Label：** 先静音，让她自己决定
- **标签：** 我先关一分钟麦。你不用回他，想好了再告诉我还要不要继续。
###### lines

###### 1. lines 1

【直播静音。一分钟后，她重新开口。】

###### 2. lines 2

**咨询者：** 继续吧。我不回他，先把这笔账说完。

- **recap Aftertaste：** 他闯进监听以后，我先关了一分钟麦。重新开口，是她自己做的决定。
- **立场变化：** neutral
- **路线轴：** process-control
- **路线口气：** neutral

##### 3. 截图先放着。你不用替他回话，只告诉我，你还要不要继续。

- **内部 ID：** ignore-screenshot
- **direction Label：** 不让截图替他插话
- **标签：** 截图先放着。你不用替他回话，只告诉我，你还要不要继续。
###### lines

###### 1. lines 1

**咨询者：** 要。后面他再发什么，我只念我愿意念的。

- **recap Aftertaste：** 我没有拿他的截图替他插话。她愿意继续，也只念了自己愿意公开的消息。
- **立场变化：** defensive
- **路线轴：** process-control
- **路线口气：** firm

### 夜 B · 3｜credit-loyalty-test

**林旭阳：** 接着呢？

**咨询者：** 他又把开播前那条语音发了一遍：“我只是怕你知道我失业后就离开我。”语音放完，下一条还是最低还款金额。昨晚他还发过一份文件，我一直没点开。他刚才才说，那是离职结算通知，名字已经遮了，可以给节目看。

- **interaction Mode：** testimonyWall
- **线索职能：** payoff
- **错误框架：** 害怕被离开只是情绪表达，与催转账无关。
#### 回收目标

- credit-layoff-gap

#### 段后触发

- **类型：** evidenceCheck
- **材料检视 ID：** credit-fixed-support
- **标签：** 把他说的十五万对回流水
- **continue Label：** 把她刚才的说法摊开
- **return Scene：** testimonyWall

- **说话人 ID：** shen
#### 正文前节拍

##### lines

###### 1. lines 1

**咨询者：** 等下……他又发消息了。一个『抱抱』表情包，企鹅那个。

###### 2. lines 2

【停顿】

###### 3. lines 3

**咨询者：** 他知道这是直播。他知道你们都看着。

###### 4. lines 4

**林旭阳：** 抱抱来得挺是时候。先看他后面还说什么。

###### 5. lines 5

**咨询者：** 有。十二点四十，又来了一条。

###### 6. lines 6

【停顿】

###### 7. lines 7

**咨询者：** ……跟着又来一句：『账单 26 号出』。前面还是『抱抱』，后面就变成还款日了。

###### 8. lines 8

**咨询者：** 还有一条：『这一年多，我每个月都给你一半，你住的房租也是我另外付。你手里少说有十五万，我只让你先拿八万。』

###### 9. lines 9

**林旭阳：** 他说你住的房租也是另外付的。这个数没算错吧？

###### 10. lines 10

**咨询者：** 没算错。房租是他另外付的，余额我也一直没给他看。

#### testimony Wall

- **presentation Skin：** voice-matrix
- **标题：** 把‘都是一起消费’逐句摊开
- **引子：** 流水已经进后台。先追问哪句都行，普通出示也不扣耐心；只有正式指认会压上两次机会。
- **split After：** 3
- **mid Summary：** 餐厅和礼物是一块，十四个月的固定转账是一块，今晚这八万又是另一块。
- **soft Anchor Response：** 这一行确实碰到她省掉的固定给付。要正式打断这段说法，还得把材料压到那句原话上。
##### miss Feedback

###### evidence

- 这页只够看卡上的一笔，压不到她说的十四个月。她不往下接了。
- 又拿错页了。她只回一句：‘这张跟我刚才那句没关系。’

###### statement

- 流水没拿错，原句偏了。她马上把话缩回八万。
- 材料还在，句子又没对上。她已经不肯再讲以前的钱。

##### relief Beat

- **listener Id：** @账单翻到第十七页
- **评论：** 主播先喝口水，我替你盯着尾号。
- **主播台词：** 谢谢，尾号你盯，结论我还是不外包。

##### statements

###### 1. 证词 01

- **内部 ID：** credit-consumption-gloss
- **标签：** 证词 01
我没占他什么固定便宜，账单里的餐厅、礼物，都是两个人一起消费。

- **press Response：** ‘餐厅和礼物本来就是两个人用的。每月那笔……你先问别的。’
- **present Response：** 这份材料能问消费构成，却还没有直接碰到她省掉的固定转账。

###### 2. 证词 02

- **内部 ID：** credit-gift-was-voluntary
- **标签：** 证词 02
灯和稳定器是他自己说要送我的，我没签过分期。

- **press Response：** ‘灯现在还在我家，可分期不是我签的。’
- **present Response：** 材料能确认设备受益人，不能单独替任何人认定还款责任。

###### 3. 证词 03

- **内部 ID：** credit-eight-wan-separate
- **标签：** 证词 03
他今晚要的八万，不能因为以前花过钱就算成我欠他的。

- **press Response：** ‘八万不是我的卡。以前的钱……那是以前。’
- **present Response：** 这张材料只够继续问钱路，不能把八万直接改写成债务。

###### 4. 证词 04

- **内部 ID：** credit-savings-unknown
- **标签：** 证词 04
我手里剩多少一直没给他看，因为那是我的账户。

- **press Response：** ‘我没给他看过余额。十五万是他自己猜的。’
- **present Response：** 材料没有她的余额列，放在这里也补不出她账户里的未知数。

###### 5. 证词 05

- **内部 ID：** credit-wants-no-transfer
- **标签：** 证词 05
我不是要钱，我是要个态度。以前那些钱，不能拿来逼我转这八万。

- **press Response：** ‘八万我不转。你就告诉他，以前那些钱都是他自愿给的。’
- **present Response：** 这是她今晚想带走的说法。要核固定给付，仍得回到她前面那句‘没占固定便宜’。

##### acts

###### 1. 把‘都是一起消费’逐句摊开

- **内部 ID：** act1
- **presentation Skin：** voice-matrix
- **标题：** 把‘都是一起消费’逐句摊开
- **wink Line：** 等一下。先看她刚才那句。
- **wink Tier：** tier2-player-cue
- **引子：** 流水已经进后台。先追问哪句都行，普通出示也不扣耐心；只有正式指认会压上两次机会。
- **split After：** 3
- **mid Summary：** 餐厅和礼物是一块，十四个月的固定转账是一块，今晚这八万又是另一块。
- **soft Anchor Response：** 这一行确实碰到她省掉的固定给付。要正式打断这段说法，还得把材料压到那句原话上。
###### relief Beat

- **listener Id：** @账单翻到第十七页
- **评论：** 主播先喝口水，我替你盯着尾号。
- **主播台词：** 谢谢，尾号你盯，结论我还是不外包。

###### statements

###### 1. 证词 01

- **内部 ID：** credit-consumption-gloss
- **标签：** 证词 01
我没占他什么固定便宜，账单里的餐厅、礼物，都是两个人一起消费。

- **press Response：** ‘餐厅和礼物本来就是两个人用的。每月那笔……你先问别的。’
- **present Response：** 这份材料能问消费构成，却还没有直接碰到她省掉的固定转账。

###### 2. 证词 02

- **内部 ID：** credit-gift-was-voluntary
- **标签：** 证词 02
灯和稳定器是他自己说要送我的，我没签过分期。

- **press Response：** ‘灯现在还在我家，可分期不是我签的。’
- **present Response：** 材料能确认设备受益人，不能单独替任何人认定还款责任。

###### 3. 证词 03

- **内部 ID：** credit-eight-wan-separate
- **标签：** 证词 03
他今晚要的八万，不能因为以前花过钱就算成我欠他的。

- **press Response：** ‘八万不是我的卡。以前的钱……那是以前。’
- **present Response：** 这张材料只够继续问钱路，不能把八万直接改写成债务。

###### 4. 证词 04

- **内部 ID：** credit-savings-unknown
- **标签：** 证词 04
我手里剩多少一直没给他看，因为那是我的账户。

- **press Response：** ‘我没给他看过余额。十五万是他自己猜的。’
- **present Response：** 材料没有她的余额列，放在这里也补不出她账户里的未知数。

###### 5. 证词 05

- **内部 ID：** credit-wants-no-transfer
- **标签：** 证词 05
我不是要钱，我是要个态度。以前那些钱，不能拿来逼我转这八万。

- **press Response：** ‘八万我不转。你就告诉他，以前那些钱都是他自愿给的。’
- **present Response：** 这是她今晚想带走的说法。要核固定给付，仍得回到她前面那句‘没占固定便宜’。

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** credit-fixed-support:summary
- **statement Id：** credit-consumption-gloss
###### material Cards

###### 1. 月转 17500 × 14 个月

- **内部 ID：** credit-fixed-support:summary
- **类型：** 材料检视
- **标签：** 月转 17500 × 14 个月
- **excerpt：** 固定转账汇总：¥17,500 × 14；累计 ¥245,000
- **source Label：** 固定转账与存款预期

###### 2. 本期最低还款 ¥8,214

- **内部 ID：** case1-bank-flow:r12
- **类型：** 账单提醒
- **标签：** 本期最低还款 ¥8,214
- **excerpt：** 只显示最低还款金额，不能说明八万总用途。
- **source Label：** 信用卡账单

###### 3. 拍摄设备分期首扣

- **内部 ID：** case1-bank-flow:r07
- **类型：** 流水行
- **标签：** 拍摄设备分期首扣
- **excerpt：** ¥2,000；分期总额一万二。
- **source Label：** 他的银行流水

- **咨询者台词：** ……这十四个月，确实不是几顿饭能带过去的。
- **主播台词：** 那你还说自己没占固定便宜？这句话先改。房租另付也算上，我们再说那十四个月的钱去了哪儿。
- **boundary Line：** 这行流水只推翻‘没有固定便宜’；它不证明八万已经变成她的债，也不替男方解释未知去向。
- **矛盾：** 咨询者把十四个月每月一万七千五的固定转账粉饰成零散共同消费。
- **路线轴：** money-flow
- **continue Label：** 把八万和过去的给付分开谈

###### 2. 把‘我只是收着’再摊一遍

- **内部 ID：** act2
- **presentation Skin：** voice-matrix
- **status Label：** 她改口了 · 第二段说法
- **标题：** 把‘我只是收着’再摊一遍
- **引子：** 她认了固定转账，却换了一种说法解释自己和这笔钱的关系。第二段仍可自由追问、普通出示；正式指认另有两次机会。
###### opener Fact Keywords

- 17500
- 十四个月

###### opener Lines

###### 1. opener Lines 1

**咨询者：** 等一下，你别把我说成每个月伸手等钱的人。17500，十四个月，我认；七月没来，我也问了。可这钱一开始就是他自己说要给的，说让我把探店号做起来，别老看别人脸色。我从来没开口跟他要。

###### 2. opener Lines 2

**林旭阳：** 行。你从第一笔开始说，钱怎么成了每个月都会来的？

###### 3. opener Lines 3

**咨询者：** 开始是他说每个月给我，我就收了，后来也确实拿去过日子。七月那天他又不回消息，钱也没来，我连着问了几次，是怕他又瞒着我。以前的钱我会跟他讲，今晚这八万不是我的卡，我不替他还。

- **revised Frame：** 她承认十四个月固定转账，却把自己长期等待、断供后追问的参与压成‘他坚持给，我只是收’。
- **split After：** 2
- **mid Summary：** 她现在的说法是：钱一直收着，七月追问却只是怕他瞒事。先听这两句话能不能同时成立。
###### relief Beat

- **listener Id：** @工资没它准时
- **评论：** 一万七千五按月来，我工资都没这么准。
- **主播台词：** 先别羡慕，七月那格正好空了。

- **soft Anchor Response：** 缺转这一行碰到了她改口后的新承重句。要压上麦，还得把她先前那句追问原话一起放回去。
###### comparison

###### 1. comparison 1

- **statement Id：** credit-consumption-gloss
- **status：** 被打破

###### 2. comparison 2

- **statement Id：** credit-gift-was-voluntary
- **status：** 变了说法

###### 3. comparison 3

- **statement Id：** credit-eight-wan-separate
- **status：** 变了说法

###### 4. comparison 4

- **statement Id：** credit-savings-unknown
- **status：** 变了说法

###### 5. comparison 5

- **statement Id：** credit-wants-no-transfer
- **status：** 她收回了

###### statements

###### 1. 改口 01

- **内部 ID：** credit-transfer-was-his-idea
- **标签：** 改口 01
钱是他自己说要给的。七月多问几句，是怕他又瞒事，不是我每个月等着这笔钱。

- **press Response：** ‘我问的是他为什么又瞒我。钱没来……对，我也问了钱。’
- **present Response：** 缺转能碰到她一直等没等，不能替直播间猜她心里到底怕什么。

###### 2. 改口 02

- **内部 ID：** credit-eight-wan-still-separate
- **标签：** 改口 02
八万我不转。这个没变。

- **press Response：** ‘卡不是我的，这八万我不转。以前的钱我会跟他讲。’
- **present Response：** 材料可以拆钱路，不能替任何一边把今晚八万直接定成债。
- **survives From Act1：** credit-eight-wan-separate

###### 3. 改口 03

- **内部 ID：** credit-balance-needs-explaining
- **标签：** 改口 03
余额……我会跟他说，不在直播里报。

- **press Response：** ‘余额我只跟他本人说。直播里别再问了。’
- **present Response：** 现有流水没有她的余额，不能拿来替她报数。
- **survives From Act1：** credit-savings-unknown

###### 4. 改口 04

- **内部 ID：** credit-shared-spending-limited
- **标签：** 改口 04
灯在我家，餐厅也有我的份。可他借钱买信托，别往我这边算。

- **press Response：** ‘灯是我在用。可信托是他自己借钱买的，别混在一起。’
- **present Response：** 这张材料只能确认其中一段消费，不能把整份账单一次结清。
- **survives From Act1：** credit-gift-was-voluntary

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** case1-bank-flow:r09
- **statement Id：** credit-transfer-was-his-idea
###### boundary Line Key Phrases

- 不证明最初是谁提议
- 不把八万变成她的债

###### material Cards

###### 1. 七月固定转账缺失

- **内部 ID：** case1-bank-flow:r09
- **类型：** 流水圈注＋原话回放
- **标签：** 七月固定转账缺失
- **excerpt：** 07-08 未见固定转出；她回拨时说：‘我那天问了他好几次。’
- **source Label：** 他的银行流水 r09 · 回拨原话

###### 2. 月转 17500 × 14 个月

- **内部 ID：** credit-fixed-support:summary
- **类型：** 材料检视
- **标签：** 月转 17500 × 14 个月
- **excerpt：** 能确认长期给付，不能单独确认她在断转后怎么做。
- **source Label：** 固定转账与存款预期

###### 3. 本期最低还款 ¥8,214

- **内部 ID：** case1-bank-flow:r12
- **类型：** 账单提醒
- **标签：** 本期最低还款 ¥8,214
- **excerpt：** 这是今晚催款背景，不回答她有没有把转账当固定收入。
- **source Label：** 信用卡账单

- **咨询者台词：** ……我等了。七月没来，我第一句问的就是钱怎么没了。
- **主播台词：** 七月钱一断，你连着问了好几次。你不是‘只是收着’。这句话别再说了。
- **boundary Line：** 缺转行和她的原话只推翻‘没当固定收入、没追着要’；不证明最初是谁提议，也不把八万变成她的债。
- **矛盾：** 咨询者认下长期固定给付后，又否认自己把它当成按月会来的收入；七月缺转后的连续追问推翻了这层圆谎。
- **路线轴：** money-flow
- **continue Label：** 把改口后的边界听完

#### decisive Present

- **max Attempts：** 2
- **evidence Id：** credit-fixed-support:summary
- **statement Id：** credit-consumption-gloss
##### material Cards

###### 1. 月转 17500 × 14 个月

- **内部 ID：** credit-fixed-support:summary
- **类型：** 材料检视
- **标签：** 月转 17500 × 14 个月
- **excerpt：** 固定转账汇总：¥17,500 × 14；累计 ¥245,000
- **source Label：** 固定转账与存款预期

###### 2. 本期最低还款 ¥8,214

- **内部 ID：** case1-bank-flow:r12
- **类型：** 账单提醒
- **标签：** 本期最低还款 ¥8,214
- **excerpt：** 只显示最低还款金额，不能说明八万总用途。
- **source Label：** 信用卡账单

###### 3. 拍摄设备分期首扣

- **内部 ID：** case1-bank-flow:r07
- **类型：** 流水行
- **标签：** 拍摄设备分期首扣
- **excerpt：** ¥2,000；分期总额一万二。
- **source Label：** 他的银行流水

- **咨询者台词：** ……这十四个月，确实不是几顿饭能带过去的。
- **主播台词：** 那你还说自己没占固定便宜？这句话先改。房租另付也算上，我们再说那十四个月的钱去了哪儿。
- **boundary Line：** 这行流水只推翻‘没有固定便宜’；它不证明八万已经变成她的债，也不替男方解释未知去向。
- **矛盾：** 咨询者把十四个月每月一万七千五的固定转账粉饰成零散共同消费。
- **路线轴：** money-flow
- **continue Label：** 把八万和过去的给付分开谈

#### 正文后节拍

##### lines

###### 1. lines 1

**林旭阳：** 所以这份通知昨晚就发给你了？

###### 2. lines 2

**咨询者：** 嗯。我当时只看到文件名，没敢点开。刚才他同意展示，我才打开。上面写着月工资三万五，待发的是解除劳动合同补偿金，预计七月底到账。

###### 3. lines 3

**林旭阳：** 所以他说的奖金，是这笔补偿金？

###### 4. lines 4

**咨询者：** 对。他又发了一句：“我怕你一听我被裁了着急，也怕你马上问那两笔钱，才说成奖金。”

###### 5. lines 5

**林旭阳：** 补偿金是真的。语音放完，他就发了最低还款金额。你当时怎么想的？

###### 6. lines 6

**咨询者：** 我第一反应是，他以后是不是连结婚都不敢跟我提了。

###### 7. lines 7

【停顿】

###### 8. lines 8

**咨询者：** 结婚……不是，他没提结婚。是我听到失业，自己往那儿想了。

###### 9. lines 9

**咨询者：** 我以前总跟朋友夸他对我好。真到他没工作，头一回找我，就是八万。我没转，也不敢把‘不想转’说出口。

###### 10. lines 10

**林旭阳：** 到现在，你说的还是拿不出来，不是不想给。

###### 11. lines 11

**咨询者：** ……对。

- **展示卡片：** daily-credit-severance
- **现场疑点：** 所谓奖金确有一笔待发的钱，却被改了名目；咨询者也把明确的不愿意包装成拿不准，想让主播替她回绝。
- **矛盾：** 他把离职补偿金说成奖金，随后又把个人债务转成关系忠诚测试；咨询者则隐去自己的固定受益和消费，只想拿走一句‘一分钱都不用出’。
- **可靠度：** partial
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 你朋友现在知道多少？

**咨询者：** 知道我们在闹别扭，不知道钱的事。我还没想好怎么开口。

- **source Anchor：** 可以给节目看

##### 2. 自由追问 2

**林旭阳：** 他以前有没有说过，怕失业以后配不上你？

**咨询者：** 说过一次，喝了酒。他说自己要是混不好，就低我一头。那时候我当情话听的。

- **source Anchor：** 怕你知道我失业后就离开我

##### 3. 自由追问 3

**林旭阳：** “怕你离开”那句，他是打字还是语音？

**咨询者：** 语音。声音很低，我听了三遍。……然后金额是打字发的，很整齐。

- **source Anchor：** 语音放完

##### 4. 自由追问 4

**林旭阳：** 你发朋友圈的那些朋友，后来有人来问过吗？

**咨询者：** 我闺蜜来问了。她劝我想开点，说至少没领证，她表姐那种才叫惨。……我听完更想哭了。但她是好意，我知道她是好意。

- **source Anchor：** 给节目看

##### 5. 自由追问 5

**林旭阳：** 那条语音你还留着？

**咨询者：** 留着。

- **source Anchor：** 开播前那条语音
- **路线轴：** caller-credibility
- **路线口气：** detour

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 刚才那句我再放一遍：‘我只是怕你知道我失业后就离开我。’你今晚打进来，是想问这八万该不该转，还是想让我替你跟他说别转？

**咨询者：** ……想让你替我说。

**林旭阳：** 说完以后呢？

**咨询者：** 我会把回放发给他。

**林旭阳：** 前面十四个月的钱，你准备怎么解释？

**咨询者：** 那些我不想再跟他一笔一笔讲。

- **source Anchor：** 下一条还是最低还款金额
- **玩家所选怀疑方向：** 重放‘怕你离开’那句
- **防备回答：** 我想把回放发给他。前面那些钱，我不想跟他讲。
###### resistance Beat

###### lines

###### 1. lines 1

**咨询者：** 你非要当着这么多人再放一遍吗？

###### 2. lines 2

**林旭阳：** 你也准备把这段回放发给他。那就先说清楚，你想让我在回放里说什么。

###### logic Contract

- **premise Anchor：** 说的还是拿不出来，不是不想给
- **source Kind：** caller-statement
- **source Proves：** 咨询者尚未转账，也始终用拿不出来代替明确表达自己不愿意给。
- **source Does Not Prove：** 她不愿意给不能自动证明过去所有给付都是无条件赠与，也不能替男方名下债务改变责任。
- **answer Anchor：** 把回放发给他
- **answer Adds：** 咨询者承认来电的实际目标是获得主播公开背书，从而不用亲自解释十四个月固定转账的去向。
- **next Legal Question：** 可以明确八万元不应当场转，也必须要求她自己说明余额与花销；主播不能替她把过去全部给付定性为赠与。

- **矛盾：** 咨询者把明确的不愿出钱说成拿不准，试图借直播间的判断回避自己长期受益和花销。
- **是否核心项：** true
- **路线轴：** active-provocation
- **路线口气：** caller-skeptical

##### 2. 关键追问 2

**林旭阳：** 如果我现在只说一句‘别转’，你准备怎么跟他谈前面那些钱？

**咨询者：** 我不是让你替我谈。我就是想听听，这八万该不该转。前面的钱怎么说，我自己会跟他讲。

- **source Anchor：** 下一条还是最低还款金额
- **玩家所选怀疑方向：** 直播结论之后怎么谈
- **是否核心项：** false
- **路线轴：** caller-credibility
- **路线口气：** caller-skeptical

#### 压力表演

- **意图钩子：** 体面话开始露底
- **防备状态：** guarded
##### 表情/听感

- **类型：** pause
她停了几秒，没有点开那条语音

### 回拨后立场

- **default：** neutral
#### lines

- **defensive：** 我差点不打回来。弹幕说我贪体面……我认过探店，可八万我不替他还。
- **open：** 我回来了。那三万五我又问了一遍。他怎么答的，我原话告诉你。
- **neutral：** 我回来了。隔了一天，那三万五他还是没说清。

## 材料、回流与可选追查

### 证据卡

#### 1. “奖金”的实际名目

- **内部 ID：** daily-credit-severance
- **表现类型：** 离职结算通知
- **标题：** “奖金”的实际名目
- **front：** 对方第一夜收麦后发给咨询者、第二夜同意遮名展示的通知写着：离职前月工资 ¥35,000；待发项目为解除劳动合同补偿金 ¥105,000；预计 7 月底支付。
- **detail：** 通知写的是预计七月底支付。借款、信托认购和信用卡消费都发生在前面。
##### targets

- truthWithGap
- sceneHint

- **矛盾：** 他没有凭空编造待发款项，却把离职补偿金说成奖金，借此同时遮住失业和固定转账断供。

#### 2. 社保断缴时间

- **内部 ID：** daily-credit-social-security
- **表现类型：** 社保截图
- **标题：** 社保断缴时间
- **front：** 他自己发来的缴费记录显示，最后缴费月份停在四月；页面没有在职状态或奖金信息。
- **detail：** 这张记录能确认参保缴费中断，不能单独确定离职日期。
##### targets

- truthWithGap
- sceneHint

- **矛盾：** 他用奖金晚发解释周转，却没有提供工资记录；自己发来的社保记录反而停在四月。

#### 3. 信用卡账单

- **内部 ID：** daily-credit-card-bill
- **表现类型：** 账单
- **标题：** 信用卡账单
- **front：** 四月工资停发后，同一张卡上仍有餐厅、礼物、两次酒店和 1.2 万短视频设备分期，合计约四万；另有数笔男装，合计约五千。
- **detail：** 约四万与两人的约会、礼物和设备有关；男方个人男装约五千，其中一件大衣两千多；至少三万五仍未说明。
##### targets

- sceneHint

- **矛盾：** 两人的共同消费远高于男方个人男装；咨询者不能只用约五千男装指责他乱花钱，男方也仍要解释至少三万五的去向。

#### 4. 最低还款请求

- **内部 ID：** daily-credit-chat
- **表现类型：** 聊天
- **标题：** 最低还款请求
- **front：** “你先帮我垫一下，我不想这段关系因为钱毁了。”
- **detail：** 把债务包装成关系考验。
##### targets

- truthWithGap

- **矛盾：** 还款请求把个人债务包装成关系考验。

#### 5. 纪念日晚餐痕迹

- **内部 ID：** daily-credit-anniversary
- **表现类型：** 消费记录
- **标题：** 纪念日晚餐痕迹
- **front：** 账单只显示一笔高额餐厅消费，酒水占了大头；她发出的朋友圈截图里，闺蜜曾评论“真羡慕你”。
- **detail：** 体面不是单向投喂，她也把它发给了观众看。
##### targets

- halfLie
- sceneHint

- **矛盾：** 纪念日晚餐由咨询者订座、接受高价酒水并发布朋友圈，体面现场不是单方制造。

### 材料圈点

#### 1. 账单检视

- **内部 ID：** credit-after-layoff-spend
##### start Comment

- **listener Id：** @刚进直播间
课代表呢？进来就看见八万。

##### revalues

- credit-layoff-gap
- credit-eight-wan-bill

- **标题：** 账单检视
- **selection Mode：** priority
- **提示题：** 这张信用卡账单里，两处都要问。你先带哪一处上麦？
- **材料：** 社保断缴后，同一张卡上继续出现纪念日晚餐、礼物分期、两次酒店和一笔 1.2 万的短视频设备分期，合计约四万；男装数笔，合计约五千，其中一件大衣两千多。
- **失败后侧向提示：** 一件大衣两千多，单看不算离谱。四万共同消费里她那一份没说，这账看偏了吧？
##### 材料行

- 纪念日晚餐 · 断缴后
- 礼物分期 · 断缴后
- 酒店消费 ×2 · 断缴后
- 短视频平台分期 · 1.2 万
- 餐厅、酒店、礼物及设备 · 合计约 4 万
- 男装消费数笔 · 约 5 千 · 其中大衣 2 千多
- 本期最低还款 · 待还

##### 选项

###### 1. 四万共同消费与五千男装

- **标签：** 四万共同消费与五千男装
- **是否核心项：** true
- **矛盾：** 约四万共同消费远高于约五千个人男装；咨询者先指责后者，省略了自己参与的主要花销。
- **反馈：** 男装加起来五千左右，跟你有关的消费接近四万。你开场为什么只说那五千？
- **人物反应：** 他那几件衣服确实只有五千左右。我一看是失业以后买的，就先拿出来说了。跟我有关的那些，数更大。
- **revises Scene：** 2
- **路线轴：** money-flow

###### 2. 最低还款金额本身很高

- **标签：** 最低还款金额本身很高
- **是否核心项：** false
- **反馈：** 最低还款八千多，谁看都得发慌。可它只报这一期要还多少，没交代这八万是怎么滚出来的。
- **人物反应：** 金额我也吓到过。可你这么问，他还是那句“先帮我垫一下”。
- **路线轴：** money-flow

###### 3. 那笔 1.2 万的短视频平台分期

- **标签：** 那笔 1.2 万的短视频平台分期
- **是否核心项：** true
- **矛盾：** 八万元账单里有一万二直接买了咨询者正在使用的设备，她不能把整张账单都说成对方自己的花销。
- **反馈：** 这一万二买的是你一直在用的设备。你之前为什么没提？
- **人物反应：** 那笔……设备在我家，也一直是我用。行，先问这个。
- **路线轴：** document-edge

###### 4. 他说自己怕被分手

- **标签：** 他说自己怕被分手
- **是否核心项：** false
- **反馈：** 这句话会让人心软，但它不是账单里的消费记录。先把卡上那几笔圈清楚。
- **人物反应：** 这句我听一次软一次。可软完，账单还在我手机里亮着。
- **路线轴：** caller-credibility

#### 2. 纪念日痕迹检视

- **内部 ID：** credit-anniversary-footprint
##### revalues

- credit-eight-wan-bill
- credit-anniversary-agency

- **标题：** 纪念日痕迹检视
- **提示题：** 纪念日晚餐这组痕迹里，哪一处最该圈出来？
- **材料：** 信用卡账单显示高额酒水；咨询者在连线中承认自己是老会员，并用自己的号订座；朋友圈照片由咨询者发布，闺蜜的起哄评论已删除。
- **失败后侧向提示：** 发照片那晚，账单已经在后台计时了。
##### 材料行

- 订座口述 · 咨询者承认是老会员
- 酒水小票 · 对方信用卡
- 朋友圈照片 · 咨询者发布
- 闺蜜评论 · 已删除

##### 选项

###### 1. 会员号是她的，朋友圈也是她发的

- **标签：** 会员号是她的，朋友圈也是她发的
- **是否核心项：** true
- **矛盾：** 纪念日晚餐由咨询者订座、接受高价酒水并发布朋友圈，体面现场不是单方制造。
- **反馈：** 会员号是你的，朋友圈也是你发的。这顿饭怎么就成了全是他安排的？
- **人物反应：** 会员号是我的，靠窗位也是我订的。照片是谁发的，我前面说过。可这顿饭被我讲成全是他安排，讲顺嘴了。
- **路线轴：** caller-credibility

###### 2. 酒水是他主动点的

- **标签：** 酒水是他主动点的
- **是否核心项：** false
- **反馈：** 餐厅和酒店都刷在他卡上。单凭消费地点，还分不出谁在经营这顿饭的样子。
- **人物反应：** 酒是他点的，我没拦。那晚我也想让它好看一点。
- **路线轴：** money-flow

###### 3. 闺蜜评论删了

- **标签：** 闺蜜评论删了
- **是否核心项：** false
- **反馈：** 删评发生在事后。那晚的订座记录和朋友圈还留着。
- **人物反应：** 她删掉我也懂。谁都不想显得自己当初眼光很响。
- **路线轴：** outer-thread

#### 3. 固定转账与存款预期

- **内部 ID：** credit-fixed-support
##### revalues

- credit-living-arrangement
- credit-anniversary-agency

- **标题：** 固定转账与存款预期
- **提示题：** 他为什么认定她拿得出八万？
- **材料：** 咨询者在后台补充的十四个月固定转账口径，与近五个月流水一并核对。
- **失败后侧向提示：** 先分开看：一共转进来多少，不等于现在还剩多少。
##### 材料行

- 咨询者后台补充 · 固定半薪持续 14 个月：¥17,500 × 14 = ¥245,000
- 03-08 · 代发工资 ¥35,000；当日转出 ¥17,500 至尾号 6624
- 04-08 · 同样转出 ¥17,500
- 05-08 · 同样转出 ¥17,500
- 06-08 · 同样转出 ¥17,500
- 07-08 · 固定转出未出现

##### 选项

###### 1. 累计二十四万五与“至少存了十五万”

- **标签：** 累计二十四万五与“至少存了十五万”
- **是否核心项：** true
- **矛盾：** 男方按十四个月累计转出的二十四万五估算她至少还存着十五万，咨询者却始终没有给他看过实际余额。
- **反馈：** 十四个月的转账，他算出了八万。你让他看过现在的余额吗？
- **人物反应：** 他一直觉得我卡里至少还有十五万。我没让他看过余额。
- **路线轴：** money-flow

###### 2. 她卡里一定还有十五万

- **标签：** 她卡里一定还有十五万
- **是否核心项：** false
- **反馈：** 二十四万五是转入总额，不是余额。她现在剩多少，要看账户和花销。
- **人物反应：** 不是。我没有那么多。具体还剩多少……等会儿我说。
- **路线轴：** outer-thread

###### 3. 他已经把工资全部交给她

- **标签：** 他已经把工资全部交给她
- **是否核心项：** false
- **反馈：** 流水只显示三万五工资到账后转出一万七千五，另一半怎么使用不能替他补。
- **人物反应：** 没有。工资卡一直在他手里，他每个月转给我的是一半。
- **路线轴：** document-edge

#### 4. 借款与信托转账检视

- **内部 ID：** credit-leveraged-trust
##### revalues

- credit-layoff-gap
- credit-five-wan-gap

- **标题：** 借款与信托转账检视
- **提示题：** 三月这三行里，哪一处最值得继续问？
- **材料：** 后台流水索引：case1-bank-flow r13/r14/r15。
- **失败后侧向提示：** 把三行分开读。日期和金额能对上，流水没有写这是不是同一笔钱。
##### 材料行

- case1-bank-flow r13 · 03-11 · 入账 ¥200,000 · 澄川金融服务有限公司 · 借款发放
- case1-bank-flow r14 · 03-12 · 支出 ¥100,000 · 宸直信托有限公司 · 产品认购
- case1-bank-flow r15 · 03-14 · 支出 ¥100,000 · 宸直信托有限公司 · 产品认购

##### 选项

###### 1. 二十万借款后紧接两笔十万认购

- **标签：** 二十万借款后紧接两笔十万认购
- **是否核心项：** true
- **矛盾：** 对方在有工资时已经借入二十万，随后三天内向同一家信托机构分两次转出二十万，债务并非失业后才突然出现。
- **反馈：** 三月十一号有二十万借款入账，十二号和十四号各有十万转给宸直信托。先后和金额都能看见，三笔钱是不是同一笔还要另外确认。
- **人物反应：** 宸直这个名字，我听他提过。他那阵还说，十来个点太慢，真想翻身就得找能翻倍的。我以为他只是嘴上说说。
- **路线轴：** money-flow

###### 2. 两笔十万就是借来的二十万

- **标签：** 两笔十万就是借来的二十万
- **是否核心项：** false
- **反馈：** 金额正好，日期也近，但流水只记录每次进出，没有证明转出的就是十一号那笔借款。
- **人物反应：** 我也想直接这么认。可他账户里本来还有钱，光看这三行，我不敢替他说。
- **路线轴：** document-edge

###### 3. 二十万比信用卡欠款更大

- **标签：** 二十万比信用卡欠款更大
- **是否核心项：** false
- **反馈：** 二十万确实更大，但金额大小没有回答借款和两笔认购是什么关系。
- **人物反应：** 二十万我看到的时候也吓了一跳。可钱大归钱大，我还是不知道这三笔怎么回事。
- **路线轴：** outer-thread

#### 5. 往期账单检视

- **内部 ID：** credit-history-pages
##### revalues

- credit-five-wan-gap
- credit-bank-flow

- **标题：** 往期账单检视
- **提示题：** 往前翻的这几页里，最该圈哪一处？
- **材料：** 后台流水索引: case1-bank-flow r04/r06/r09。
- **失败后侧向提示：** 工资打款和人情打款，日子的性子不一样。
##### 材料行

- case1-bank-flow r04 · 05-08 · 入账 ¥10,000 · 个人转账·王** · 转账
- case1-bank-flow r06 · 06-08 · 入账 ¥10,000 · 个人转账·王** · 转账
- case1-bank-flow r09 · 07-08 · 空行 —— · (本月 8 号无入账) · ——

##### 选项

###### 1. 五月、六月都在 8 日入账，七月中断

- **标签：** 五月、六月都在 8 日入账，七月中断
- **是否核心项：** true
- **矛盾：** 五月、六月的 8 日都有王姓私人入账，七月贷款到账后，同日入账规律中断。
- **反馈：** 两笔都在 8 号进来，七月断了。付款人是谁，流水没写。
- **人物反应：** ……每月 8 日那笔入账，我也看到了。我不敢猜是谁转的。
- **路线轴：** money-flow

###### 2. 交往之前的同款消费

- **标签：** 交往之前的同款消费
- **是否核心项：** false
- **反馈：** 这几笔的时候他还不认识她。以前也这么花，只说明这不是他第一次撑场面。
- **人物反应：** 看到这几笔的时候，我先想的居然是：原来那些安排，不是为我一个人练的。
- **路线轴：** document-edge

###### 3. 礼物分期一直都有

- **标签：** 礼物分期一直都有
- **是否核心项：** false
- **反馈：** 分期习惯说明他一直这么过日子，可日子怎么过不是这几页最扎的地方。
- **人物反应：** 他确实什么都爱分期。以前我觉得这叫会安排。
- **路线轴：** outer-thread

### 后台回流

#### 1. 朋友圈补图

- **内部 ID：** credit-friend-dm
- **声纹卡 ID：** case1-friend
- **来源：** dm
- **出现界面：** 后台进来一条私信
- **标题：** 朋友圈补图
- **触发矛盾：** 8 万信用卡主要花在餐厅、礼物和酒店，不是房租医疗这类急事。
- **此刻出现原因：** 收麦后，咨询者的朋友补了一张当晚朋友圈截图。
- **提示题：** 这张补图里，最该圈的是哪一处？
- **材料：** 闺蜜补来的朋友圈截图发在纪念日晚餐那晚，定位是她常去的那家店，配文写“终于有人把日子过得体面一点”。闺蜜补了句话：“那晚我跟着起哄了，‘这才像被认真对待’是我评的。昨天删了，怕她看见难堪。还有，她那阵子天天拍探店，灯和稳定器……是不是那笔分期买的？”
##### social Post

- **author：** 咨询者
- **posted At：** 纪念日晚餐当晚
- **location：** 她常去的那家店
- **caption：** 终于有人把日子过得体面一点。
- **image Src：** ./assets/generated/backgrounds/cafe_date.png?v=0.20.95
- **image Alt：** 窗边晚餐照片
- **comment Author：** 闺蜜
- **评论：** 这才像被认真对待
- **comment Note：** 该评论已删除，由闺蜜补图保留。
- **followup：** 她那阵子天天发探店视频，灯和稳定器还是那笔分期置的吧。

- **能证明：** 体面是两个人一起经营的，朋友当初也当过这份人设的观众。
- **仍不能证明：** 不能证明她该替对方还这八万，也不能证明他失业前的旧债从哪来。
- **路线轴：** external-corroboration
##### 选项

###### 1. 删掉的起哄评论和探店设备

- **标签：** 删掉的起哄评论和探店设备
- **是否核心项：** true
- **矛盾：** 闺蜜当初起哄“他真大方”，后来删评撇清，体面人设有过观众。
- **反馈：** 她朋友当时也参与了探店号的起哄，第二天删了评论。但八万该不该还，不能算到她头上。
- **路线轴：** external-corroboration

###### 2. 朋友语气很替她生气

- **标签：** 朋友语气很替她生气
- **是否核心项：** false
- **反馈：** 朋友生气很正常，账还是得回到谁刷、谁还。
- **路线轴：** outer-thread

###### 3. 照片看起来很贵

- **标签：** 照片看起来很贵
- **是否核心项：** false
- **反馈：** 贵不贵只是第一眼的感觉，和账单同周出现才咬得上。
- **路线轴：** document-edge

##### reply Choices

###### 1. 你当时起哄也算观众

- **内部 ID：** blame-cheer
- **标签：** 你当时起哄也算观众
- **立场变化：** defensive

###### 2. 直播里先不提你

- **内部 ID：** protect-friend
- **标签：** 直播里先不提你
- **立场变化：** open

#### 2. 前同事的旧话

- **内部 ID：** credit-ex-coworker-note
- **声纹卡 ID：** case1-ex-coworker
- **来源：** dm
- **出现界面：** 前同事发来一句
- **标题：** 前同事的旧话
- **触发矛盾：** 交往之前的账单上也有同款体面消费。
- **此刻出现原因：** 往期账单翻出交往前的同款消费后，一位自称男方前同事的人留了话。
- **提示题：** 这位前同事的话，哪一句能留下？
- **材料：** 前同事说：“他以前阔过，阔得早。请客、送礼、订酒店，真不是认识她以后才学会的。欠过他人情，我只能说到这儿。钱后来去哪儿、五月六月那两笔怎么回事，我不说，也别问我。”
- **能证明：** 同款体面消费早于这段关系，八万不能全写成她让他撑出来的。
- **仍不能证明：** 不能证明信用卡里至少三万五的用途，也不能说明每月 8 号的私人入账为什么在七月中断。
- **路线轴：** external-corroboration
##### 选项

###### 1. 阔过，阔得早

- **标签：** 阔过，阔得早
- **是否核心项：** true
- **矛盾：** 同款体面消费早于这段关系，旧洞不是认识咨询者以后才出现。
- **反馈：** 他以前确实有钱。可为什么七月那笔入账没了，这句话还是解释不了。
- **路线轴：** document-edge

###### 2. 欠过他人情

- **标签：** 欠过他人情
- **是否核心项：** false
- **反馈：** 这解释他为什么收着说，不解释钱。
- **路线轴：** outer-thread

###### 3. 七月 8 号为什么空了

- **标签：** 七月 8 号为什么空了
- **是否核心项：** false
- **反馈：** 他没有解释，这条仍然留白。
- **路线轴：** money-flow

### 文档原件

#### 1. 他的银行流水（近五个月关键交易摘录）

**他的银行流水（近五个月关键交易摘录）**

第一夜挂断前，对方为了催她转账，发来这份遮去姓名和卡号的关键交易摘录，还说可以拿给节目核对。她随后转到后台。摘录没有余额列，也不是完整收支表；这次同意核的是这几页，不是其他账户。先看三月工资到账后的固定转出，再看借款、信托和尾号 3301。两笔住房租赁支出可以看见，但房子是谁住的不能靠流水判断。

| 行 ID | 日期 | 类型 | 金额 | 对方/项目 | 备注 |
| --- | --- | --- | --- | --- | --- |
| r01 | 03-08 | 入账 | ¥35,000 | XX科技(深圳)有限公司 | 代发工资 |
| r01a | 03-08 | 支出 | ¥17,500 | 转出·尾号 6624 | 转账 |
| r01b | 03-09 | 支出 | ¥10,000 | 安寓住房租赁有限公司 | 房租（3—4月） |
| r13 | 03-11 | 入账 | ¥200,000 | 澄川金融服务有限公司 | 借款发放 |
| r14 | 03-12 | 支出 | ¥100,000 | 宸直信托有限公司 | 产品认购 |
| r15 | 03-14 | 支出 | ¥100,000 | 宸直信托有限公司 | 产品认购 |
| r02 | 04-08 | 入账 | ¥35,000 | XX科技(深圳)有限公司 | 代发工资 |
| r02a | 04-08 | 支出 | ¥17,500 | 转出·尾号 6624 | 转账 |
| r03 | 04-19 | 支出 | ¥4,280 | 悦府餐饮 | 消费 |
| r04 | 05-08 | 入账 | ¥10,000 | 个人转账·王** | 转账 |
| r04a | 05-08 | 支出 | ¥17,500 | 转出·尾号 6624 | 转账 |
| r04b | 05-09 | 支出 | ¥10,000 | 安寓住房租赁有限公司 | 房租（5—6月） |
| r05 | 05-15 | 支出 | ¥6,980 | 星澜酒店 | 消费 |
| r06 | 06-08 | 入账 | ¥10,000 | 个人转账·王** | 转账 |
| r06a | 06-08 | 支出 | ¥17,500 | 转出·尾号 6624 | 转账 |
| r07 | 06-21 | 支出 | ¥2,000 | 短视频平台·分期首扣（总额一万二） | 分期 |
| r08 | 07-05 | 入账 | ¥50,000 | 新阳信贷有限公司 | 贷款发放 |
| r09 | 07-08 | 空行 | —— | (本月 8 号无入账) | 本月未见对尾号 6624 的固定转出；07-09 也未见双月房租 |
| r10 | 07-12 | 支出 | ¥3,600 | 悦府餐饮 | 消费 |
| r11 | 07-19 | 支出 | ¥49,800 | 转出·尾号 3301 | 转账 |
| r12 | 07-26 | 提醒 | ¥8,214 | 本期最低还款 | 账单 |

- **内部 ID：** case1-bank-flow
##### 逐行追问

###### r01a

###### 1. r01a 1

**林旭阳：** 这笔一万七千五，是转给你的吗？

**咨询者：** 是。尾号 6624 是我的。他说每个月工资分我一半，我就一直按这个数等。

- **矛盾：** 咨询者没有拿工资卡，却长期把男方半薪视为自己每月固定会收到的钱
- **路线轴：** money-flow
###### logic Contract

###### source Rows

- r01
- r01a

- **source Proves：** 三月八日工资入账三万五，同日有一万七千五转向尾号 6624
- **source Does Not Prove：** 同日和金额一半不能单独证明尾号 6624 属于咨询者，也不能证明此后每月都有同样约定
- **answer Anchor：** 尾号 6624 是我的
- **answer Adds：** 咨询者确认收款账户属于自己，并确认男方把这笔钱说成每月给她的一半工资
- **next Legal Question：** 可以继续比较后续月份与另付房租，不能据此替男方的借款和信托认购改写责任

###### r13

###### 1. r13 1

**林旭阳：** 澄川金融服务这二十万，他跟你说过吗？

**咨询者：** 没有。他只说自己在看投资机会，从没说钱是借来的。

- **矛盾：** 对方在仍有工资入账时已经新增二十万元借款，债务并非失业后才突然出现
- **路线轴：** money-flow
###### logic Contract

###### source Rows

- r13

- **source Proves：** 三月十一日有二十万元借款从澄川金融服务进入账户
- **source Does Not Prove：** 不能证明咨询者此前知情，也不能证明借款的后续用途
- **answer Anchor：** 从没说钱是借来的
- **answer Adds：** 咨询者只听说对方在看投资机会，没有听说这笔钱来自借款
- **next Legal Question：** 可以继续问随后出现的信托转账，以及对方是否提过该机构

###### r14

###### 1. r14 1

**林旭阳：** 宸直信托这个名字，你以前听过吗？

**咨询者：** 听过一次。他说十来个点不算机会，真想翻身得找能翻倍的。我以为他只是吹牛。

- **矛盾：** 对方曾主动表达对远超一般收益的期待，但隐瞒了实际认购
- **路线轴：** caller-credibility
###### logic Contract

###### source Rows

- r14

- **source Proves：** 三月十二日账户向宸直信托转出十万元，备注为产品认购
- **source Does Not Prove：** 不能证明咨询者听过该机构，也不能仅凭流水确定对方期待的收益
- **answer Anchor：** 真想翻身得找能翻倍的
- **answer Adds：** 咨询者确认对方曾提到宸直，并表达过追求翻倍收益的想法
- **next Legal Question：** 可以继续确认第二笔认购是否同样被隐瞒

###### r15

###### 1. r15 1

**林旭阳：** 隔两天又转了十万，这第二笔他提过吗？

**咨询者：** 没有。两笔我都是现在看流水才知道。

- **矛盾：** 同一机构在三天内收到两笔十万元认购，咨询者此前并不知情
- **路线轴：** document-edge
###### logic Contract

###### source Rows

- r15

- **source Proves：** 三月十四日账户再次向宸直信托转出十万元，备注为产品认购
- **source Does Not Prove：** 不能证明第二笔与第一笔使用同一来源的资金，也不能证明咨询者知情
- **answer Anchor：** 两笔我都是现在看流水才知道
- **answer Adds：** 咨询者确认两笔认购此前都未向她说明
- **next Legal Question：** 可以把三行并列，询问她还能补充哪些亲耳听过的内容

###### r08

###### 1. r08 1

**林旭阳：** 七月这笔贷款进来时，他还在领工资吗？

**咨询者：** 早就没领了。社保是四月底断的，最后一笔工资是四月八号。中间靠什么续上，我现在也说不清。

- **矛盾：** 离职在前、信贷在后，五万不是应急，是接续
- **路线轴：** money-flow

###### 2. r08 2

**林旭阳：** 这五万，他跟你提过吗？

**咨询者：** 一个字没提。他嘴里只有“奖金晚发”。

- **矛盾：** 五万贷款与奖金说法并存
- **路线轴：** money-flow

###### r11

###### 1. r11 1

**林旭阳：** 尾号 3301，你有印象吗？

**咨询者：** ……不是我的卡。我的卡他存过，尾号我记得。

- **矛盾：** 七月五日贷款到账；七月十九日账户另有 49,800 转出，收款账户身份不明，两行是否为同一笔资金仍无法证明
- **路线轴：** money-flow

###### r04

###### 1. r04 1

**林旭阳：** 他身边姓王的人，你能想到谁？

**咨询者：** 他妈姓王。他表哥也姓王。……他前公司的领导，好像也姓王。

- **矛盾：**
- **路线轴：** caller-credibility

###### r06

###### 1. r06 1

**林旭阳：** 他身边姓王的人，你能想到谁？

**咨询者：** 他妈姓王。他表哥也姓王。……他前公司的领导，好像也姓王。

- **矛盾：**
- **路线轴：** caller-credibility

###### r09

###### 1. r09 1

**林旭阳：** 七月八号，这一行怎么是空的？

**咨询者：** 我也盯着这行看了很久。到点了，没人来。

- **矛盾：** 按月的私人转账在贷款到账当月停止
- **路线轴：** document-edge

###### r12

###### 1. r12 1

**林旭阳：** 最低还款八千二，他让你垫的是八万？

**咨询者：** 八万是总欠款。他原话：“一次清了才算帮。”

- **矛盾：** 最低仅八千余，索要的却是全额八万
- **路线轴：** money-flow

##### 跨行追问

###### 1. 跨行追问 1

**林旭阳：** 这三行挨得很近，可流水没写后面转出的就是那二十万。除了日期和金额，你还知道什么？

**咨询者：** 我不知道是不是同一笔。他提过宸直，还说想找个能翻倍的。别的我就不知道了。

###### 表格行

- r13
- r14
- r15

- **矛盾：** 借款与两笔认购在金额和日期上紧密相接，但资金同一性仍需由合同或当事人确认
###### logic Contract

###### source Rows

- r13
- r14
- r15

- **source Proves：** 二十万元借款入账后，三天内出现两笔合计二十万元的宸直信托认购
- **source Does Not Prove：** 三行流水没有追踪编号，不能确认认购款就是前一笔借款
- **answer Anchor：** 我不知道是不是同一笔
- **answer Adds：** 咨询者只补充对方提过宸直及翻倍收益，明确不替资金同一性下结论
- **next Legal Question：** 需要借款合同、产品合同或对方承认，才能确认借款用途

###### 2. 跨行追问 2

**林旭阳：** 五月八号只进来一万，当天却转出去一万七千五，第二天又付了一万房租。这张摘录没写余额。多出来的钱从哪儿来的，你知道吗？

**咨询者：** 不知道。他没给我看过余额，那两笔私人转账他也没解释。我只知道那两个月，该给我的钱没停。

###### 表格行

- r04
- r04a
- r04b

- **矛盾：** 停薪后固定转账和房租仍在继续，但关键交易摘录无法说明完整资金来源
###### logic Contract

###### source Rows

- r04
- r04a
- r04b

- **source Proves：** 五月八日有一万元私人入账，同日转出一万七千五，次日另付一万元房租
- **source Does Not Prove：** 摘录没有期初余额和完整收支，不能说明超出当月展示入账的资金来自哪里
- **answer Anchor：** 不知道
- **answer Adds：** 咨询者确认自己没有看过余额，也不知道两笔私人转账的来源
- **next Legal Question：** 需要完整流水、余额记录或当事人说明，才能核对停薪后的资金来源

###### 3. 跨行追问 3

**林旭阳：** 七月五日五万进，七月十九日四万九千八出——这算周转吗？

**咨询者：** 他跟我说“周转”的时候，这两行已经在他流水里躺了半个月了。

###### 表格行

- r08
- r11

- **矛盾：** 所谓周转发生在借款请求之前，且资金已近全额流出

- **最多圈选：** 4
### 对方留言

- **来源：** respondent-note
- **此刻出现原因：** 第一夜收麦后，对方把通知发给咨询者；第二夜又给后台留了文字，并同意她把通知遮名展示，但仍不肯上麦。
- **夜 B 预告：** true
十四个月就是二十四万五，我真以为她能剩十五万。八万也不是我张口乱要。奖金那句……行，不是奖金，是离职补偿，我没敢说自己被裁。三月那二十万是我从澄川借的，后来拿去买了宸直的产品。借款是我签的，宸直也是我自己买的；我当时真觉得能翻倍。至于账上那三万五，我不在直播里说。

## 收束与结案

### host Disclosure

- **anchor：** afterScene:2
“先帮我垫几天”，这话我听过。以前也有人这么跟我借钱，那笔后来没要回来。你刚才一重复，我手心还是会冒汗。

- **host Wound Hook：** 人都失业了，她还追着那五千块男装骂
### deep Followup

**林旭阳：** 他按十四个月算，觉得你手里至少有十五万。你一直没给他看余额。那张卡现在还有多少？

**咨询者：** 我自己的工资也没存下来。余额没给他看。

#### resistance Beat

##### lines

###### 1. lines 1

**咨询者：** 一万……一万一千六百多。

###### 2. lines 2

**林旭阳：** 十四个月的钱呢？

###### 3. lines 3

**咨询者：** 花了。

###### 4. lines 4

**林旭阳：** 花在哪儿？

###### 5. lines 5

**咨询者：** 衣服、做脸，平时出门……你别让我一笔一笔念。

###### 6. lines 6

**林旭阳：** 行，我也怕你念，我记不过来。

- **说明：** 让咨询者报出实际余额，承认自己已经把男方的固定转账当成可持续收入并消费掉，也让男方索要八万的计算依据落地；玩家若在第二天追问房租，还会看到她的住房成本并不从这一万七千五中支出。累计给付仍不能把男方债务变成咨询者债务。

- **stage Judgement：** 你打进来不是查账。你是想让我公开替你说：钱是他自愿给的，你不用解释。这样行吗？这种话，我不会替你说的。十四个月，每月一万七千五，房租另付。八万先别转，卡是他签的。可前面的花到哪，你自己跟他说。信用卡剩下没说清的那截，让他讲。
### quote Pick Candidates

- 我只是怕你知道我失业后就离开我
- 我没转，也不敢把‘不想转’说出口
- 那些也不是我一个人花的
- 你手里少说有十五万，我只让你先拿八万

### accusation Choices

#### 1. “我只是怕你知道我失业后就离开我。”

- **标签：** “我只是怕你知道我失业后就离开我。”
- **quote Source Scene Id：** credit-loyalty-test
- **责任角色：** respondent
- **主播回应：** 怕你离开可以是真的，但最低还款为什么马上转到你这里？

#### 2. “我没转，也不敢把‘不想转’说出口。”

- **标签：** “我没转，也不敢把‘不想转’说出口。”
- **quote Source Scene Id：** credit-loyalty-test
- **责任角色：** complainant
- **主播回应：** 你不是没想好。你是不想自己开口说：八万不转，以前的钱也花得差不多了。今晚这八万先别转。可过去十四个月的钱花到哪儿了，你得自己跟他讲。

#### 3. “那些也不是我一个人花的。”

- **标签：** “那些也不是我一个人花的。”
- **quote Source Scene Id：** credit-eight-wan-bill
- **责任角色：** complainant
- **主播回应：** 你开场先拿那五千说事，四万左右的共同消费一句带过。自己的花销，别再省。至于他签下的债，还是他的。

#### 4. “你手里少说有十五万，我只让你先拿八万。”

- **标签：** “你手里少说有十五万，我只让你先拿八万。”
- **quote Source Scene Id：** credit-loyalty-test
- **责任指向：** both
- **主播回应：** 二十四万五确实转到过她那里，可累计转入不是当前余额。她把钱花掉了要说明，你也不能因为自己算错了余额，就把八万变成她的债。

### 今晚最后一句

#### 1. 先关掉转账页

- **内部 ID：** pragmatic
- **标签：** 先关掉转账页
- **主播台词：** 回去先把转账页关了。饭吃了吗？没吃煮个面。
##### lines

###### 1. lines 1

**咨询者：** ……嗯。我现在就关。

###### 2. lines 2

【停顿】

###### 3. lines 3

**咨询者：** 面就算了，我现在吃不下。

#### 2. 八万不用你还

- **内部 ID：** affirm
- **标签：** 八万不用你还
- **主播台词：** 八万不用你还。十四个月花到哪，你自己跟他说。
##### lines

###### 1. lines 1

**咨询者：** ……这句我存下了。语音的那种存。

#### 3. 给她一晚再决定

- **内部 ID：** accompany
- **标签：** 给她一晚再决定
- **主播台词：** 八万今晚不转。要不要继续这段关系，睡醒再想。热线明晚还开，我们都在。
##### lines

###### 1. lines 1

**咨询者：** 明晚……明晚我大概不打了。但我会听。

### 正式结案

- **标题：** 十四个月，每月一万七千五
#### notice

- **标签：** 后台新消息
回放发他了。

- **结论：** 十四个月里，他每月转一万七千五、另付房租，设备也留在她家；她来电要主播公开说这些都是自愿给的，不必再交代花销。八万没有转，债仍在男方名下。信用卡账单总额和已分项仍然对不上。
#### 场景节拍

##### 1. 来电

- **标签：** 来电
他要她拿八万，还把过去给过的钱算进理由里；她来电想证明自己一分不出也不欠情分。

##### 2. 麦上

- **标签：** 麦上
他连续十四个月每月转她一万七千五；他以为她至少存了十五万，她实际只剩一万一千六百多。

##### 3. 离台核实

- **标签：** 离台核实
第二夜的结算通知证明所谓奖金是待发离职补偿；更早的二十万借款已经进了两笔信托，信用卡账单总额和已分项仍然对不上。

#### 已确认

- 他离职和债务压力都是真实存在的
- 失业早于第一次向她借钱
- 他离职前月薪约三万五，连续十四个月每月转她一万七千五，累计二十四万五
- 他按累计转账认定她至少存了十五万，因此开口向她要八万
- 十四个月的固定转账已基本花完，她实际只剩一万一千六百多；她没有告诉男方，来电时想让主播公开替她说过去给付全是男方自愿、她不用解释
- 所谓晚发奖金实际是预计七月底支付的离职补偿金
- 她一开始只盯着男方约五千元的男装，却把约四万元与自己有关的共同消费一句带过
- 信用卡账单总额和已分项仍然对不上
- 对方承认三月借入二十万购买宸直信托产品

#### 未决

- 尾号 3301 的账户归属仍无法确认
- 展示的流水只是关键交易摘录，没有期初余额和完整收支；五月、六月每月 8 号有王姓私人入账，七月中断，来源、中断原因及停薪后其余支出的资金来源仍无法确认
- 宸直信托具体产品、兑付状态和可追回金额仍无法确认
- 离职补偿金是否按通知在七月底实际到账仍无法确认
- 对方后续是否具备还款能力仍无法确认

- **下一步：** 先关掉转账页。她把实际余额和这十四个月的花销整理出来，不再拿直播间的结论替自己回话；他把信用卡明细、借款合同、信托合同和补偿金到账记录拿齐。谁长期承担过哪些生活成本可以另列，不能拿来抵掉他名下的债。

- **story Interlude Recap：** 收麦后，她承认男方连续十四个月每月转来一万七千五；二十四万五已经基本花完，账户只剩一万一千六百多。她原本想从主播这里拿到一句‘一分钱都不用出’，最后只得到‘八万先不转，自己的花销也得说清’。近五个月流水还写着二十万借款和两笔信托认购。
- **followup Twist：** 双方都承认，男方连续十四个月每月转给她一万七千五，累计二十四万五。他因此认定她至少存了十五万，才开口要八万；她实际只剩一万一千六百多，一直没告诉他。近五个月关键交易摘录另外显示：五月、六月没有工资，给她的一万七千五却照常转出，七月才停下；摘录不含期初余额，不能凭这些行算出中间的全部资金来源。更早的三月十一日，澄川金融服务发放借款二十万，随后三天内账户分两次向宸直信托各转十万。七月五日新阳信贷五万入账，十九日又有 49,800 转向尾号 3301；相邻金额不能证明两行是同一笔钱。
- **分享卡标题：** 8 万信用卡，到底该不该帮他还？
- **分享卡正文：** 他连续十四个月每月转给女友一万七千五，累计二十四万五。他以为她至少存了十五万，她实际只剩一万一千六百多。信用卡里约四万用于两人共同撑排场，能看清的男方个人男装约五千；她开场只追着问他的钱怎么花，还想让主播替她证明自己一分钱也不用出。与此同时，他借二十万买了两笔信托，把待发的离职补偿说成奖金。她要交代自己的花销，他签下的贷款也仍是他的。
- **分享题：** 一个瞒着余额，一个瞒着失业和借款；这八万还该不该谈成两个人一起周转？
- **作者真相：** 八万是男方名下的信用卡债务，今晚先别转。十四个月里，他每月转她一万七千五、房租另付；她只剩一万一千六百多，开场却拿五千元男装盖过约四万元共同消费——那里面就有给自己用的一万二设备。前面的钱花到哪由她跟男方说，信用卡至少三万五的缺口由男方说。

## 【编剧资料】事实边界与运行规则

- **内部来电索引：** 她打来问：男朋友突然让她拿八万元还信用卡，她不想转，想让主播支持她拒绝。
- **运行时状态：** runtime-loaded
- **texture Pass：** true
### dialogue Presentation

#### speed Tiers

##### strained

- **delay：** 48
- **hold Ms：** 0

##### stalled

- **delay：** 54
- **hold Ms：** 1000

#### blip Pitch Hz

- **host：** 330
- **caller：** 286
- **respondent：** 214

### voice Tics

#### 沈

- 就……
- 反正

### voice Tic Arc

- **沈：** 夜 A 密,夜 B 干净

### drift Comments

- 他都失业了,先听他把话说完吧
- 卡是他的,怎么先让她转八万
- 蹲一个主播同款保温杯
- 课代表呢?进来就看见八万
- 刚下夜班,他还了吗

- **来电媒介：** voice
### caller Intent Profile

- **open Goal：** 让主播支持她先不转八万元。
- **preferred Answer：** 八万元是男友自己的信用卡债，过去给她的钱也不能在今晚改成她必须偿还的欠款。
- **audience Tilt：** 让听众先把她看成被失业男友催债的人，不去追问固定转账、房租和共同消费。
- **protected Interest：** 保住账户里剩下的钱，也保住自己一直被男友照顾、没有占便宜的体面。
- **default Tactic：** 先强调没有同住、工资卡不在自己手里，再抓住男方个人消费和隐瞒失业，把双方长期混用的钱说成他的个人债务。
- **concession Limit：** 可以承认收过设备、参与过约会消费，也可以承认男友每月转钱；在余额被问到以前，不主动承认固定给付基本花完，更不主动说想拿直播回放替自己回绝。
#### pain Points

##### 1. pain Points 1

- **topic：** 十四个月固定转账
- **threatens：** 一旦说清金额和持续时间，听众会追问她为什么拿不出八万。
- **first Response：** 先说工资卡没给她，只承认每月会转一半。
- **after Proof：** 流水和日期摆出后才报一万七千五与十四个月。
- **minimum Leak：** 承认这笔钱过去一直按月到账。

##### 2. pain Points 2

- **topic：** 设备与共同消费
- **threatens：** 会打破八万元都是男友个人挥霍的开场版本。
- **first Response：** 先强调分期不是自己签的，反问直播间是不是要把八万都算到她头上。
- **after Proof：** 设备送到她家并由她使用后，只承认这一万二花在自己身上。
- **minimum Leak：** 承认设备是给她的，不替男友解释其余缺口。

##### 3. pain Points 3

- **topic：** 账户实际余额
- **threatens：** 会暴露二十四万五固定给付和她自己的工资都没有留下。
- **first Response：** 先只报余额，拒绝逐项念消费。
- **after Proof：** 主播逐项收窄后才承认大类和自己的工资也没存下。
- **minimum Leak：** 承认只剩一万一千六百多。

##### 4. pain Points 4

- **topic：** 使用直播回放
- **threatens：** 会暴露她不是来中立查账，而是想借主播替自己向男友施压。
- **first Response：** 先承认想听主播说别转。
- **after Proof：** 被问准备怎样使用结论后，才说会把回放发给男友。
- **minimum Leak：** 承认她来电前已经不想给。

### 运行时长度计划

- **live Beat Count：** 8
- **material Board Count：** 5
- **backflow Count：** 2
- **truth Boundary Prompt Count：** 5
- **case Specific Pressure：** 首案先把八万账单拆成约四万共同排场、约五千个人男装和至少三万五未说明，再用社保截图、三万五月薪、十四个月固定转账、十五万存款误判、实际余额、离职结算通知、二十万借款、两笔信托转账、老会员身份和开箱夜，把双方各自瞒下的钱拆开。
#### what Player Does Besides Read

- 圈选银行流水行
- 按行追问
- 交叉对账
- 比较工资与固定转账
- 选择白天路线
- 决定夜里回拨顺序

### 任务画像

- **内部 ID：** audit
- **标签：** 钱款说不清
- **recommended Specialty Id：** audit
- **摘要：** 钱说得急，责任却还没落到人。

### 路线评论

#### money flow

- 弹幕开始算账了
- 我算了下我自己的卡,不敢细看

#### document edge

- 账单边上有时间
- 截图不是白发的

#### caller credibility

- 有人问她也图体面
- 来电人这句也没全白

#### identity wording

- 体面这词开始扎人
- 身份话压到钱上了

#### process control

- 订座号也有名字
- 一万二的设备是买给她的

#### active provocation

- 刚才那句挺可怜,可她要拿回放去说什么?

### 事实边界

#### 能确认

- 失业和债务压力都存在
- 社保断缴早于第一次借钱
- 信用卡消费包含约会体面开支
- 1.2 万短视频分期开在断缴之后，设备和推广的受益账号是咨询者的
- 两人交往约一年半，没有同住，男方工资卡也未交给咨询者；从交往第五个月起，男方连续十四个月每月转给她一万七千五，累计二十四万五；他还每两个月直接替她支付一万元房租，自己的住房成本另行承担
- 男方按累计转账认定咨询者手里至少还存着十五万，因此开口向她要八万；这只是他的余额估算，不是她负有八万元债务的证明
- 咨询者自己的月收入只有八千多，长期把男方固定转来的钱算进自己的生活；在房租由男方另付的情况下，她仍把自己工资和十四个月固定转账基本花完，实际只剩一万一千六百多，也没有把余额告诉男方
- 信用卡里与两人共同生活和维持排场有关的消费约四万，男方个人男装消费约五千，仍有至少三万五未说明
- 男方失业后购买的男装合计约五千，其中一件大衣两千多；这笔消费本身不足以证明他个人挥霍
- 交往之前的账单上也有同款体面消费
- 五月、六月的每月 8 日都有固定私人入账，七月 8 日中断
- 纪念日晚餐是咨询者用会员号订的座
- 咨询者的餐厅会员等级主要由此前恋爱中对方结账的消费积累
- 纪念日晚餐对应账单里一笔明显偏高的餐厅消费，主要金额来自酒水
- 纪念日晚餐朋友圈由咨询者发布，朋友曾跟着起哄
- 短视频设备开箱和首拍夜发生在咨询者屋里
- 那排靠窗位确需提前两周预订
- 四月工资停发后，五月和六月各有一笔王姓私人转账，七月又有一笔新阳信贷五万入账
- 第一夜挂断前，对方为了继续催她转账，主动发来遮去姓名和卡号的近五个月关键交易摘录，并明确让她拿给节目核对
- 七月 5 日贷款到账，七月 19 日 49,800 转出至尾号 3301
- 咨询者确认尾号 3301 不是自己的账户
- 三月 11 日澄川金融服务发放借款二十万
- 三月 12 日和 14 日，账户先后向宸直信托转出两笔十万
- 对方在麦外留言中承认，三月的二十万借款用于购买宸直信托产品
- 对方第一夜收麦后已经发来离职结算通知；咨询者当时没敢打开，直到第二夜对方同意遮名展示，她才点开；所谓晚发奖金实际是预计七月底支付的离职补偿金
- 咨询者长期消费固定给付、接受男方另付房租并共同维持排场，是男方经济压力的重要来源；借款、认购和继续撑排场仍由男方自己决定

#### 被修剪

- 对方把待发的离职补偿金说成奖金；既想让咨询者别为失业着急，也不想固定转账一停就被追问
- 咨询者把两个人挑的体面说成“都是他安排”
- 咨询者先用没有同住和没拿工资卡强调各自管钱，没有主动提男方连续十四个月每月转她一半工资，更没有说房租也由男方另付、实际余额只剩一万一千六百多
- 对方把十四个月累计转入二十四万五直接算成她至少还存着十五万，没问她实际花销就认定八万拿得出来
- 咨询者把收了设备的分期说成“没细看”
- 对方把整个八万的窟窿讲成“为这段关系撑面子欠的”
- 对方把五月、六月的固定私人转账说成“以前的账”，拒绝给出可核对来源
- 对方曾把借钱追求翻倍收益说成一次能填平旧洞的投资机会
- 闺蜜把当初的起哄评论删掉后才来补图
- 男方前同事只肯说他阔过，不说钱后来去了哪里

#### 今晚定不了

- 尾号 3301 的账户归属仍无法确认
- 展示的流水只是关键交易摘录，没有期初余额和完整收支；五月、六月每月 8 号有王姓私人入账，七月中断，来源、中断原因及停薪后其余支出的资金来源仍无法确认
- 宸直信托两笔认购对应的具体产品、兑付状态和可追回金额仍无法确认
- 对方后续是否具备还款能力仍无法确认
- 双方摊开账单后是否继续关系仍无法确认

### deception Chain

- **owner：** caller
- **protected Purpose：** 让主播公开支持她一分钱也不出，同时不让男友和直播间把十四个月固定给付、另付房租、共同排场与实际余额算进这次拒绝。
#### stages

##### 1. credit moral backing

- **内部 ID：** credit-moral-backing
- **pressure Trigger：** 男友再次催她拿八万，并把过去给过的钱也提了出来。
- **surface Version：** 她已经决定不转，也拿不出八万，却把这个决定交给主播来批准。
- **edited Fact：** 她要的不是中立查账，而是一句可以转给男友的公开背书。
- **immediate Utility：** 先把直播间拉到拒绝转账这一边，避免说明自己手里的钱去了哪里。
- **fair Trace：** 开场反复强调钱是男方自愿给的，却不先问八万由什么构成。
- **player Test：** credit-loyalty-test：追问她是真拿不准，还是想让主播替她把拒绝说出口。
- **forced Revision：** 她承认自己没转，也一直没把话说死，确实想从节目带走一句不该转。
- **advice Impact：** 主播仍可建议八万暂不转，但不能替她把过去的给付和花销一笔勾销。

##### 2. credit separate finances

- **内部 ID：** credit-separate-finances
- **pressure Trigger：** 主播不肯只谈情分，转而问两人的住处和日常钱怎么走。
- **surface Version：** 她先说两人不住一起、工资卡也没交给她，让这段经济关系听起来彼此独立。
- **edited Fact：** 男友连续十四个月每月转她一万七千五，房租还在这笔钱之外另付。
- **immediate Utility：** 阻止直播间把她当成长期固定受益人，也暂时躲开钱是否存下的问题。
- **fair Trace：** 她说这个月的钱第一次没来，说明自己一直在等一笔固定到账。
- **player Test：** credit-living-arrangement 追问固定转账；case1-bank-flow 的住房支出行再追问房租受益人。
- **forced Revision：** 她第一夜只承认固定半薪持续了一年多；流水出现后才确认十四个月和具体金额，看到两笔双月房租后再承认那也是男友替她付的。
- **advice Impact：** 男方长期压力和索要八万的计算来源变得可解释，但名下债务仍不能自动转给她。

##### 3. credit selective bill

- **内部 ID：** credit-selective-bill
- **pressure Trigger：** 固定给付被问出后，她需要证明八万主要是男友自己失业后乱花。
- **surface Version：** 她先抓住约五千元男装，尤其是一件两千多的大衣。
- **edited Fact：** 同一张账单里约四万元共同排场与她有关，其中一万二设备直接给她使用。
- **immediate Utility：** 把男友塑造成失业后仍个人挥霍的人，让拒绝转钱显得不需要再谈自己的受益。
- **fair Trace：** 她念账单时已经说出餐厅、礼物、酒店和短视频设备，却只对男装作判断。
- **player Test：** credit-anniversary-agency、credit-device-benefit 与 credit-five-wan-gap 连续追问共同消费的安排和受益人。
- **forced Revision：** 她承认约四万元与自己有关，也承认开头只拿男装说事，把共同消费一句带过。
- **advice Impact：** 主播不能接受八万主要由男方个人挥霍造成的说法，必须把共同消费、个人消费和未知三万五拆开。

##### 4. credit gift relabel

- **内部 ID：** credit-gift-relabel
- **pressure Trigger：** 账单上的一万二设备被明确送到她家并一直由她使用。
- **surface Version：** 她说自己一直以为设备是男友全款送的，是他主动支持自己的事业。
- **edited Fact：** 她确实直接享受了这笔支出，却借赠与理解把自己从八万元账单里移出去。
- **immediate Utility：** 承认拿到设备，同时继续拒绝承担任何与这笔钱有关的解释成本。
- **fair Trace：** 设备出现在信用卡分期里，受益账号和实物都在她这一边。
- **player Test：** credit-bank-flow：追问为什么开场没提这一万二，以及购买时有没有共同还款约定。
- **forced Revision：** 她承认八万里这一万二花在自己身上，但坚持男友没有让她共同承担分期。
- **advice Impact：** 受益必须进入双方谈账，签字和还款责任仍留在男方名下。

##### 5. credit hidden balance

- **内部 ID：** credit-hidden-balance
- **pressure Trigger：** 男友说出十四个月累计二十四万五，并解释自己为何估算她至少存了十五万。
- **surface Version：** 她此前只对男友说自己没有八万，从未给过余额，也不解释固定给付怎么花掉。
- **edited Fact：** 账户实际只剩一万一千六百多，自己的工资和固定转账都基本花完。
- **immediate Utility：** 既不转八万，也避免承认自己把长期给付当成稳定收入花掉。
- **fair Trace：** 累计金额、另付房租与她始终不展示余额之间有明显空白。
- **player Test：** deepFollowup：在十五万估算出现后直接问当前余额和十四个月花销。
- **forced Revision：** 她报出一万一千六百多，并承认衣服、美容、打车、吃饭和账号推广已经把钱花掉。
- **advice Impact：** 她必须向男友说明余额和消费，主播仍只建议暂缓转账，不替男方把估算变成她的债。

### scene

- **name：** 直播连线

### statement Patience

- **night a：** 4
- **night b：** 4

### statement Stages

#### 1. credit night a account

- **内部 ID：** credit-night-a-account
##### scene Indexes

- 0
- 1

- **minimum Review Count：** 2

#### 2. credit night a living

- **内部 ID：** credit-night-a-living
##### scene Indexes

- 2

- **minimum Review Count：** 2

#### 3. credit night b anniversary

- **内部 ID：** credit-night-b-anniversary
##### scene Indexes

- 3

- **minimum Review Count：** 2

#### 4. credit night b benefit

- **内部 ID：** credit-night-b-benefit
##### scene Indexes

- 6

- **minimum Review Count：** 2

## 广告间隙

**赵律师：** 你今天直播里提到的宸直信托，我知道。最近我手上就有好几起跟他们有关的兑付纠纷。

**林旭阳：** 已经兑不出来了？

**赵律师：** 有纠纷，不等于全线违约。不过我看过几份合同，收益写得很高，钱又去了商场、地产，还有几家关联公司。

**林旭阳：** 我记得这家公司什么都做，盘子也很大。

**赵律师：** 老板路子很广，业务铺得也开。可盘子大，不等于自己的钱多。至少我经手的几个项目，主要靠一轮一轮往外融。

**林旭阳：** 那今天这二十万呢？

**赵律师：** 产品、合同、到期日都没看见。现在只能说风险高，你别先替人宣布拿不回。

**林旭阳：** 行，我收回。

**赵律师：** 还有，她账户只剩一万一千六百多。这句别替她藏，让她自己跟男友说。

**林旭阳：** 八万先不转，但她账户还剩多少，也得自己跟男友说清楚。

**赵律师：** 对。至于那八万，债签在谁名下，合同就该由谁拿出来。

**赵律师：** 那我问个不用证据的。我要是也这么爱面子、花钱没数，你会不会什么都给我买？

**林旭阳：** 真那样的话，我们俩大概一开始就看不上对方。

你笑了一下。赵律师把一杯热水推到你手边。

【监听音箱里的音乐慢慢起来。】

# 第二幕：职场报销截图

- **案件 ID：** 04-workplace
- **剧情 ID：** workplace-reimbursement-screenshot
- **内容包原题：** 今日来电：职场报销截图

## 本案人物

| 角色 | 性格 | 欲望 | 防御动作 | 知识边界 |
|---|---|---|---|---|
| 第二通咨询者·陈 | 想证明能扛事的焦虑新人 | 在宸直持股、估值不断上涨的栖行共享科技争取更多客户活动，也把六万八垫款追回来。 | 把主动承担说成‘让我垫’，用流程词遮住个人选择。 | 知道公司做共享充电柜和储物柜、宸直是主要股东之一，也知道自己参与的项目、私聊、垫款和收到的截图；下麦前拿到三层供应商返费表，但不知道各笔是否实际支付及最终账户。 |
| 职场案同事 | 圆滑的责任切割者 | 保住铺点项目的采购返费和对上汇报位置，把垫付风险留在执行端。 | 只回答眼前被问到的那一步，随后把选择说成咨询者自愿，把延迟推给财务。 | 知道自己发出的私聊、审批和署名安排，也知道栖行的点位项目存在多层返费；未有材料时不替财务付款、各层支付状态或供应商返费账户作证。 |
| 职场案财务经办 | 冷静的程序理性派 | 把审批、付款和到账三个节点说准确。 | 不给评价，只列系统状态。 | 只知道通用财务节点与经办材料，不知道私聊动机和供应商项目返利归属。 |
| 职场案供应商项目员 | 谨慎的中立执行者 | 保住客户关系并准确说明自己收到什么。 | 只确认本方收款与联系人。 | 只知道供应商一侧的项目联系人、内部结算页和工作语音；不知道返利是否支付或最终账户，也看不到客户公司的报销。 |
| 职场案仓库管理员 | 朴实的记录主义者 | 让出入库记录和实际交付对上。 | 认单、认页、不认口头身份。 | 只知道仓库收货、出入库单与日期。 |
| 职场案部门助理 | 规则型自保者 | 证明正常流程发过、缺口不在助理岗。 | 只给群模板与样本，拒绝解释人的意思。 | 只知道公开群流程与样本，不知道私聊和钱的去向。 |
| 职场案领导 | 冷硬的结果主义者 | 项目按时交付，季度总结里的部门成绩好看。 | 把旧规矩当执行细节，只认结果和汇报。 | 知道活动总结与负责人署名，不知道垫款金额、公司付款账户和供应商返利归属。 |
| 搬过三次仓库的人 | 惜字如金的职场老手 | 确认节目愿意听这类事后，给自己留一个以后再来的入口。 | 匿名、延后、只约定专场，不交案件细节。 | 只知道自己的职场经历和节目公开播出的内容，不知道第二通职场案未公开的账户与管理层事实。 |

## 【编剧资料】案件发动机

- **戏剧锚点：** 群输入框里没有发出的追款消息、栖行共享科技的铺点活动、预算沟通记录、被当成报销凭证的活动立项页、公司抬头发票和活动总结表
- **为何今晚发生：** 栖行共享科技下周一要开季度总结会，活动总结和负责人名单会在会前确认；六万八已经进了她的信用卡账单。她把“公司一直不给我报销”打进工作群输入框，却既怕这句话没有凭证，也怕发出去以后再也接不到客户活动。
### 公开求助

- **类型：** interest
- **求助内容：** 她想让主播帮她把群里的追款话写准确：既把六万八个人垫款留进公司记录，也不靠一句含糊指控把自己绕过报备的部分藏掉；她仍想保住负责人署名和以后接活动的机会。

- **核心物件作用：** 群输入框里那句‘公司一直不给我报销’先暴露她既想追款又不愿写出自己绕过报备；预算群记录把‘来不及’钉在财务延后通知之前；截图看似审批通过，单据类型却是活动立项，连正式报销申请都没有出现。供应商返费表只留在白天可选支线和案后讨论：它会露出招商主管、区域经理、采购经办三层返费，却不能替公司报销路径作证。
- **咨询者所求：** 咨询者看着栖行共享科技的点位和估值一起涨，想借这次城市招商活动拿到负责人署名，也必须让公司书面承认六万八来自她的个人信用卡；她不愿让老板先看见自己明知要报备、仍回了“我来扛”。
- **对方所求：** 对方需要让咨询者按现有版本确认活动总结，把六万八继续留在口头催办里；他既不想让老板追问当初为什么绕开报备，也不愿明确月底究竟只是提交报销，还是公司会实际付款。
- **第三压力：** 下周一的活动总结、已经到来的信用卡账单、负责人署名、部门公开报备流程，以及同事把‘能扛事’和沉默绑在一起的职场评价。
- **咨询者自利删减：** 她没有把想负责这次活动藏到结尾；她逐层压轻的是自己回过“收到”、明知个人垫付要报备却没有在群里问、为了刷下六万八主动申请临时提额、把九天后的财务通知挪来替当天的决定解释，以及准备以“公司一直不给我报销”开头追款却连正式报销申请都没提。她想追回六万八，也想让老板只看见自己扛下活动的一面。
- **公开钩子：** 她想在群里写公司一直不给报销，可自己看过流程、回过‘我来扛’，手里的审批图又只是活动立项，正式报销还没提。六万八该追，追款的话也得经得起回看。
- **故事概述：** 陈想在栖行共享科技的城市铺点活动里拿到负责人署名，也想追回个人卡上的六万八。她从‘同事让我垫’一路退到看过流程、回过‘我来扛’、拿九天后的通知替当天找理由；第二夜，同事在群里承认她垫过钱，却仍不说月底究竟提交还是付款。案后补来的返费表再把个人风险扩大成公司各层都在抽钱。
- **悬念：** 同事让她私下垫款是真的，她主动抢机会也是真的。六万八能不能回到公司账上，要看她是否愿意把个人垫款写进记录；栖行一直上涨的估值和快速铺开的点位，则要等案后那张三层返费表重新解释。
- **线索物件：** 未发送的群消息、预算沟通记录、被当成报销凭证的活动立项页、公司抬头发票和待确认的活动总结表；供应商返费三层表只在白天可选路线和案后讨论出现

## 夜 A：第一次来电

**咨询者：** 主播，我想问个工作上的事。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 在，你说。

#### 舞台标记

- **mood：** listening

**咨询者：** 我替公司垫了六万八，三个星期了，还没报下来。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 钱刷在哪儿？

#### 舞台标记

- **mood：** listening

**咨询者：** 我自己的信用卡。账单已经出了，钱还没回来。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 你催过吗？

#### 舞台标记

- **mood：** listening

**咨询者：** 我有句话都打到工作群输入框里了：“公司一直不给我报销。”可我还没发。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 为什么还没发？

#### 舞台标记

- **mood：** listening

**咨询者：** 这次城市合伙人的招商会是我刚争来的。我怕一发出去，以后就不让我碰客户活动了。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 你们公司做什么？

#### 舞台标记

- **mood：** listening

**咨询者：** 公司叫栖行共享科技，做商场里的共享充电柜和储物柜。宸直是主要股东之一，最近一直催着铺点。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 垫钱这件事，当时是谁先提的？

#### 舞台标记

- **mood：** listening

**咨询者：** 一个同事私聊我，说今天来不及走流程，让我先垫上。

#### 舞台标记

- **mood：** thinking

### 夜 A · 1｜work-title-for-advance

**林旭阳：** 你当时为什么答应先垫？

**咨询者：** 小会上，我刚当着老板的面说，城市合伙人的招商会我能接。他私聊过来：“你先把场地和礼品费垫了。活动总结里，我写你是负责人。”我几乎马上就回了。

#### no Clue Reaction

**咨询者：** 我没问。他只说活动后补，我当时就回了。

- **interaction Mode：** lineReplay
- **线索职能：** setup
- **错误框架：** 咨询者主动争取负责这次活动，因此个人垫款只是她为机会自愿承担的成本。
#### 回收目标

- work-private-process
- work-split-ownership

- **说话人 ID：** chen
- **现场疑点：** 咨询者不是完全被逼，也确实想拿这个表现机会。
- **矛盾：** 咨询者先想争取负责活动，同事再把垫付款包装成表现机会，资金风险被弱化。
- **可靠度：** mixed
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 你主动说能接，是在群里说的，还是当面说的？

**咨询者：** 部门小会上说的，老板也在。我说这活我能接。

- **source Anchor：** 小会上

##### 2. 自由追问 2

**林旭阳：** 那位同事平时对你怎么样？

**咨询者：** 有回我加班到十点，他给我留了盏灯，桌上还贴了张“早点回”。

【停顿】

**咨询者：** 那张便利贴我留着，夹在工牌套后面。后来他让我别去群里问预算，我也更愿意信他会补流程。

- **source Anchor：** 他私聊过来
- **texture Role：** ramble

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 他那条私聊，是先说让你负责这次活动，还是先说要你垫钱？

**咨询者：** 先说垫钱。

**林旭阳：** 后面呢？

**咨询者：** 说活动总结会写我负责。

**林旭阳：** 你回了什么？

**咨询者：** ‘我来扛。’报销怎么走，我没问。

**林旭阳：** 额度不够呢？

**咨询者：** 我自己申请了临时提额。那时候我是真想让老板把这次活动交给我。

- **source Anchor：** 你先把场地和礼品费垫了
- **玩家所选怀疑方向：** 负责人署名和“先垫”写在一起
- **防备回答：** 他先提垫钱。我看到后面会写我负责，就……回了。额度不够，也是我自己去提的。
###### logic Contract

- **premise Anchor：** 你先把场地和礼品费垫了。活动总结里，我写你是负责人
- **source Kind：** quoted-message
- **source Proves：** 负责人署名与个人垫款出现在同一条私聊里。
- **source Does Not Prove：** 同一句话不能证明垫款已获公司授权或一定会按时报销。
- **answer Anchor：** 先说垫钱
- **answer Adds：** 咨询者承认自己只注意到负责人署名，没有细问垫款责任，额度不够时还主动申请了临时提额。
- **next Legal Question：** 可以追问她是否问过预算和还款人，不能把争取负责活动等同于同意承担六万八。

- **矛盾：** 咨询者先向老板表态想负责这次活动，同事借这个把垫款包装成机会。
- **是否核心项：** true
- **路线轴：** identity-wording
- **路线口气：** trust-but-verify

##### 2. 关键追问 2

**林旭阳：** 你答应先垫时，有没有问这钱最后谁来还？

**咨询者：** 没有。他说活动后补流程。

**林旭阳：** 你回了什么？

**咨询者：** “我来扛。”

**林旭阳：** 后来问了吗？

**咨询者：** 我把“这钱谁还”打了一遍，最后删了。

###### miss Reaction

**咨询者：** 我没问。他只说活动后补，我当时就回了。

- **source Anchor：** 我几乎马上就回了
- **玩家所选怀疑方向：** 答应前的还款安排
- **是否核心项：** false
- **路线轴：** caller-credibility
- **路线口气：** caller-skeptical

#### 压力表演

- **意图钩子：** 流程词说得太熟
- **防备状态：** tense

### 夜 A · 2｜work-private-process

**林旭阳：** 你说活动后补流程。活动前一天，群里发过正式流程吗？

**咨询者：** 发过。客户把日子提前了两天。14：05，部门助理在大群发了流程表，上面写着预算要填金额，个人垫付要先报备。我点开了，也回了“收到”。

【材料触发后的重述】 **咨询者：** 等一下，时间不对。两点二十二，他就让我别在群里问了。财务说延后，是九天后的事。那时候我还没看见通知，已经把群关了。

#### no Clue Reaction

**咨询者：** 我当时没想谁来补。看见他私聊说能处理，我就没再看那一格。

- **interaction Mode：** lineReplay
- **线索职能：** reversal
- **错误框架：** 财务当时已经通知延后，所以先办活动、后补流程是临时应急。
#### 回收目标

- work-approval-only

- **说话人 ID：** chen
- **现场疑点：** 私下垫款不是偶然，它先绕开了公开预算确认。
- **矛盾：** 对公付款要比价，同事却用来不及为由让咨询者改刷个人卡，把预算和比价一起挪出公开流程。
- **可靠度：** partial
#### 段后触发

- **类型：** evidenceCheck
- **材料检视 ID：** work-budget-timeline
- **标签：** 材料板
- **next Label：** 看预算沟通
- **continue Label：** 继续听

#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 那张流程表现在还在群里吗？

**咨询者：** 在。我回完“收到”以后就没再点开，刚才已经截下来了。

- **source Anchor：** 大群发了流程表

##### 2. 自由追问 2

**林旭阳：** 你以前自己走过这套流程吗？

**咨询者：** 没有。以前最多垫过打车费，这么大的活动是第一次。

- **source Anchor：** 个人垫付要先报备

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 流程表明明写着个人垫付要先报备。你为什么还是刷了自己的卡？

**咨询者：** 14：22，他私聊我，说比价来不及，让我别在群里问预算，先刷自己的卡，活动结束再补。

**咨询者：** 后面又来一句，‘别让领导觉得你不担事。’我看着输入框里的‘预算多少’，最后还是删了。

- **source Anchor：** 个人垫付要先报备
- **revised Source Anchor：** 别在群里问了
- **玩家所选怀疑方向：** 公开流程和私聊要求相反
- **防备回答：** 14：22，他私聊让我别在群里问预算，还拿领导压我。我把那句‘预算多少’删了。
###### logic Contract

- **premise Anchor：** 个人垫付要先报备
- **source Kind：** caller-statement
- **source Proves：** 公开流程已经要求个人垫付先报备，她却没有照这条流程做。
- **source Does Not Prove：** 公开流程不能单独说明是谁劝她绕开，也不能证明财务当时已经延后。
- **answer Anchor：** 最后还是删了
- **answer Adds：** 咨询者第一次交出十四点二十二分的相反私聊，也承认自己删掉了预算问题。
- **next Legal Question：** 可以拿这条私聊去和财务通知核对时间，不能先假定财务当天已经延后。

- **矛盾：** 公开流程要求提前报备，同事却借表现压力阻止她公开确认预算。
- **是否核心项：** true
- **路线轴：** identity-wording
- **路线口气：** caller-skeptical

##### 2. 关键追问 2

**林旭阳：** 你回了‘收到’，当时以为表里空着的预算会由谁补？

**咨询者：** 我以为是他。

**林旭阳：** 为什么？

**咨询者：** 供应商是他找的，预算也在他手里。

**林旭阳：** 你问过他吗？

**咨询者：** 没有。

###### miss Reaction

**咨询者：** 我当时没想谁来补。看见他私聊说能处理，我就没再看那一格。

- **source Anchor：** 预算要填金额
- **revised Source Anchor：** 那时候我还没看见通知
- **revised Question：** 你说没看见通知，是不是想把前面的群流程先放过去？
- **玩家所选怀疑方向：** 她以为谁会补完流程表
- **是否核心项：** false
- **路线轴：** identity-wording
- **路线口气：** softening

#### 压力表演

- **意图钩子：** 流程表明明看过
- **防备状态：** tense
##### 表情/听感

- **类型：** pause
她盯着群里的“收到”，停了几秒

### 夜 A · 3｜work-approval-only

**林旭阳：** 这六万八刷出去以后，他拿什么让你继续等？

**咨询者：** 活动后，他发来一张审批页，顶上写着“审批通过”。我问什么时候回来，他又发一次。第二天再问，还是它。就这一张图，他发了三次，每次都说“流程在走”。

#### no Clue Reaction

**咨询者：** 我现在就是拿不出日期。他每次只说‘在走’。

- **interaction Mode：** lineReplay
- **线索职能：** missing-edge
- **错误框架：** 财务延后通知是真的，审批也通过了，因此钱只是晚几天。
#### 回收目标

- work-private-process

- **说话人 ID：** chen
- **现场疑点：** 页面顶端确实写着审批通过，但被批准的是哪一类单据还没有核清。
- **矛盾：** 同一张审批页面被重复发送三次，却没有新增内容或具体到账日期。
- **可靠度：** partial
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 信用卡账单出来以后，你准备怎么还？

**咨询者：** 我还没想好。手头的钱不够一次还清，又不想做最低还款，所以才越来越慌。

- **source Anchor：** 审批通过

##### 2. 自由追问 2

**林旭阳：** 财务那边你认识人吗？

**咨询者：** 不认识。入职培训见过一面。真要问，也得同事引荐，又绕回他。

- **source Anchor：** 流程在走

##### 3. 自由追问 3

**林旭阳：** 你以前用个人信用卡垫过公司的钱吗？

**咨询者：** 没有。以前最多垫过打车，第二天就能报。

【停顿】

**咨询者：** 六万八，是第一次。

- **source Anchor：** 活动后

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 三次发来的图，有没有哪一次多了新的内容？

**咨询者：** 没有，三张一模一样。

**林旭阳：** 那你每次看了什么？

**咨询者：** 就看见上面写着“审批通过”。我根本没往下翻。

- **source Anchor：** 就这一张图，他发了三次
- **玩家所选怀疑方向：** 三张图有没有新增内容
- **防备回答：** 没有，三次都是同一张。我当时没往下看。
###### logic Contract

- **premise Anchor：** 就这一张图，他发了三次
- **source Kind：** caller-statement
- **source Proves：** 同事三次发送的是同一张页面，没有用新材料解释进度。
- **source Does Not Prove：** 只看出三张图相同，还不能确认单据类型，也不能确认正式报销是否另行提交。
- **answer Anchor：** 三张一模一样
- **answer Adds：** 咨询者承认自己只看了页面顶端，没有核对下方字段。
- **next Legal Question：** 收麦后可以核对单据类型和编号，再问正式报销是否有申请记录。

- **矛盾：** 同一张页面被重复发送三次，却没有新增进度信息。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 他每次把这张图发回来，有没有说过具体哪天到账？

**咨询者：** 没有。每次就那四个字：“流程在走。”

**林旭阳：** 你没再问？

**咨询者：** 没有。我真没往下看。后来财务一说延后，我更觉得只是晚几天。

###### miss Reaction

**咨询者：** 没有日期。他每次都只说‘在走’，我手里就这张图。

- **source Anchor：** 每次都说“流程在走”
- **玩家所选怀疑方向：** 审批通过后的付款凭证
- **是否核心项：** false
- **路线轴：** money-flow
- **路线口气：** softening

#### 压力表演

- **意图钩子：** 负责人署名压着垫款风险
- **防备状态：** guarded
##### 表情/听感

- **类型：** shift
她停了一下，才继续说

### 中段立场快照

- **段后触发：** 2
- **kicker：** 中段立场快照
- **提示题：** 现在这几件事，你最想先问哪件？
- **说明：** 不判分。按下你现在最在意的那件事。
- **after Pick Line：** 群里刚发报备，他转头就来私聊。先听他在私聊里怎么说。
- **continue Label：** 继续听
- **recap Kicker：** 中段立场
#### 选项

##### 1. 他在绕开报备

- **内部 ID：** respondent-problem
- **标签：** 他在绕开报备
- **摘要：** 公开流程刚要求先报预算，他就私聊让她别在群里问，改刷个人卡。
- **反馈：** 14:22 那条私聊是在绕开公开报备，不是普通催进度。
- **recap：** 群公告要求个人垫付先报备；十七分钟后，他让她别问预算、先刷个人卡。

##### 2. 她为署名主动提额

- **内部 ID：** caller-complicit
- **标签：** 她为署名主动提额
- **摘要：** 她想拿到负责人署名，也自己申请了临时额度，把垫款刷进个人卡。
- **反馈：** 她不是完全被动垫款：机会是她争取的，临时额度也是她自己提的。
- **recap：** 她为了负责人机会主动提额、回了‘我来扛’；这一步不能藏进‘让我垫’。

##### 3. 她删掉了预算追问

- **内部 ID：** unclear
- **标签：** 她删掉了预算追问
- **摘要：** 她看见公开流程，也在群输入框里打过预算问题，最后还是自己删了。
- **反馈：** 她怕显得不担事，亲手删掉了能留下预算责任的那句话。
- **recap：** 公开规则就在群里，她仍删掉预算追问，选择先信同事活动后会补。

### 第一次收麦

**咨询者：** 等一下，我把那三张图重新找出来。发票我明天也带去问问。

#### 舞台标记

- **after Scene Index：** 2
- **主播台词：** 你先把图和发票找齐。明天问完，再把对方怎么回的原话告诉我。
- **stage Direction：** 她那头传来翻相册的声音，随后只剩忙音。
- **音频提示：** sfx.phone.busy

## 收麦幕间：控台短查

### 幕间行动

- **标题：** 收麦后·控台短查
- **kicker：** 出门前只够处理一样：核立项页、听回放或重排时间线。
- **budget：** 1
- **min Actions：** 1
- **max Actions：** 1
- **continue Label：** 进入白天调查
#### actions

##### 1. 核对单据类型

- **内部 ID：** recheck-approval-page
- **标签：** 核对单据类型
- **摘要：** 再看一遍“审批通过”批的到底是哪张单。
- **cost：** 1
- **类型：** evidencePass
###### 授予库存

- approval-page-reviewed

###### focus Check Ids

- work-approval-missing

##### 2. 领导批注（未邀）

- **内部 ID：** leader-interrupt
- **声纹卡 ID：** case4-leader
- **标签：** 领导批注（未邀）
- **摘要：** 后台同步了一条新批注。
- **cost：** 0
- **类型：** interruptToast
- **npc Verb：** interrupt
- **from：** 领导批注（后台同步）
下周一照常开季度总结会，负责人就按现在这份名单写。你们没报备的那几项，开会前自己补上。

###### choices

###### 1. 带回拨质问「老规矩」

- **内部 ID：** bring-to-callback
- **标签：** 带回拨质问「老规矩」
###### 授予库存

- leader-note-hot

###### 2. 先压下，怕影响她署名

- **内部 ID：** hold-back
- **标签：** 先压下，怕影响她署名
- **路线轴：** caller-credibility

##### 3. 重看预算时间线

- **内部 ID：** reopen-timeline
- **标签：** 重看预算时间线
- **摘要：** 「来不及」和财务延后通知，谁在先？
- **cost：** 1
- **类型：** evidencePass
###### 授予库存

- timeline-delay-gap

###### focus Check Ids

- work-budget-timeline

##### 4. 听回放

- **内部 ID：** listen-pad
- **标签：** 听回放
- **摘要：** 回听私聊里「让我垫」原话。
- **cost：** 1
- **类型：** playback
###### 授予库存

- playback-pad

###### script

- **音频提示：** voice.case4.pad-message
- **clip Label：** 回放·私聊
- **clip Line：** 你先把场地和礼品费垫了。活动总结里，我写你是负责人。
- **host Note：** 他拿活动总结里的负责人署名，劝她先把钱垫上。

## 白天调查

- **白天开场：** 陈把遮掉公司名和姓名的活动立项页、刷卡记录、公司抬头发票和供应商内部结算页交给节目。节目约到一位财务经办，只讲通用报销流程；陈也给供应商和部门助理发了书面同意，他们只谈各自经手的材料。下午最多处理两处。
- **白天行动预算：** 2
- **最少白天场景：** 2
### 地点 1

- **内部 ID：** day-work-finance-window
- **标签：** 财务服务窗口
- **舞台背景：** day-studio
- **类型：** studio
#### 场景正文

- **access：** 财务经办只看遮名审批页和发票抬头、解释通用节点，不进入咨询者公司的财务系统。
午休前，财务服务窗只剩一个号。你遮住公司名和姓名，把咨询者收到的审批页和发票抬头递进窗口。经办人没有替你查个案。

- **路线轴：** money-flow
##### cast

- 财务经办
- 你

##### 场景节拍

###### 1. 场景节拍 1

**财务经办：** 这页是活动立项，根本不是报销审批。单据类型和 LX 编号都写着。场地和礼品的发票，开的谁的抬头？

###### 2. 场景节拍 2

**你：** 公司抬头，原件还在她手里。

###### 3. 场景节拍 3

**财务经办：** 那先拿发票提正式报销。报销单出来，再问预计付款日期和回单。

###### 4. 场景节拍 4

**财务经办：** 拿着立项页等不到账。下一位。

##### 场景选择

- **提示题：** 窗口把缺口分成两件事。你先带哪一件回夜里？
###### 选项

###### 1. 先补正式报销单

- **内部 ID：** keep-payment-receipt-rule
- **标签：** 先补正式报销单
- **授予物件：** 财务窗口补报销要求
- **路线轴：** money-flow
###### 选择后节拍

###### 1. 选择后节拍 1

**你：** 那我让她先拿公司抬头发票提报销，拿到申请编号。

###### 2. 选择后节拍 2

**财务经办：** 对。有报销单，再问什么时候付。

###### 2. 确认立项单号不能查报销

- **内部 ID：** keep-account-refusal
- **标签：** 确认立项单号不能查报销
- **授予物件：** 立项单号拒查记录
- **路线轴：** document-edge
###### 选择后节拍

###### 1. 选择后节拍 1

**你：** 只有 LX 开头的立项单号，窗口查不了她的个人报销。

###### 2. 选择后节拍 2

**财务经办：** 对。报销申请都没有，先别往付款和收款人上猜。

### 地点 2

- **内部 ID：** day-work-supplier-visit
- **标签：** 供应商仓库门市
- **舞台背景：** day-city
- **类型：** visit
#### 场景正文

- **access：** 陈给供应商发过书面同意；项目员只谈自己经手的返费表和工作语音，不提供个人收款账户。
仓库门市正忙着点货。项目员把遮名返费表翻到背面：招商主管、区域经理、采购经办各有一栏，三栏的名字不同，算法都跟铺设点位挂钩。

- **路线轴：** external-corroboration
##### cast

- 供应商项目员
- 仓库管理员
- 你

##### 场景节拍

###### 1. 场景节拍 1

**供应商项目员：** 以前不是只找一个项目联系人。招商主管一栏叫点位协调费，区域经理叫渠道维护费，采购经办叫采购配合费。

###### 2. 场景节拍 2

**你：** 每一层都要返？

###### 3. 场景节拍 3

**供应商项目员：** 表上是这么列的。这个项目里，他在采购经办那一栏。哪一笔付了、最后进谁账户，我没经手。

###### 4. 场景节拍 4

**仓库管理员：** 我只认这张供应商表。三栏算法都跟点位走，付没付、进谁账户，我这儿没有。

###### 5. 场景节拍 5

**你：** 她那六万八是公司报销，两件事别混着问。这张表是供应商返费。

##### 场景选择

- **提示题：** 返费三栏和工作语音，你带哪一件回夜里？
###### 选项

###### 1. 只带回返费三栏

- **内部 ID：** keep-supplier-contact-column
- **标签：** 只带回返费三栏
- **授予物件：** 供应商返费三层表
- **路线轴：** document-edge
###### 选择后节拍

###### 1. 选择后节拍 1

**你：** 我把三栏一起拍下来。只拍岗位和名目，姓名、支付状态、账户全遮掉。

###### 2. 选择后节拍 2

**供应商项目员：** 可以。表能看出各层都要返费，看不出钱最后进了谁的口袋。

###### 2. 只带回返费原话

- **内部 ID：** keep-supplier-voice-line
- **标签：** 只带回返费原话
- **音频提示：** voice.case4.supplier-message
- **授予物件：** 供应商返费原话
- **路线轴：** external-corroboration
###### 选择后节拍

###### 1. 选择后节拍 1

**你：** 那我把语音原句带回去：“每一层的返费结完，下一批点位才往下走。”

###### 2. 选择后节拍 2

**供应商项目员：** 原话带走。哪笔付了、给了谁，还得另查。

### 地点 3

- **内部 ID：** day-work-breakroom-observe
- **标签：** 共享茶水间·流程观察
- **舞台背景：** day-office
- **类型：** observe
#### 场景正文

- **access：** 部门助理主动约在共享茶水间，前提是公司名和姓名不上屏，只核她发过的流程样本。
部门助理约你在共享茶水间交一份公开流程样本。她不谈私聊，只肯当着你的面把三页摆在一起看：同事托话、领导批注、活动立项页。

- **路线轴：** process-control
##### cast

- 部门助理
- 同事托话（手机）
- 你

##### 场景节拍

###### 1. 场景节拍 1

**同事托话（手机）：** 立项批了，别再往大群里问。

###### 2. 场景节拍 2

**部门助理：** 领导批注我只核过这一句：这次活动负责人写小陈，流程该补的补齐。

###### 3. 场景节拍 3

**部门助理：** 这张是活动立项，LX 开头。报销单不归我看，那句私聊也不是我发的。

###### 4. 场景节拍 4

**部门助理：** 流程表我那天在群里发过。个人垫付要先报备，供应商走对公还得附报价比较。

##### 场景选择

- **提示题：** 三页摊到这里，你先带哪条回去？
###### 选项

###### 1. 留下立项与报销缺口

- **内部 ID：** keep-receipt-gap
- **标签：** 留下立项与报销缺口
- **授予物件：** 茶水间立项缺口
- **路线轴：** money-flow
###### 选择后节拍

###### 1. 选择后节拍 1

**部门助理：** 这三页我都翻过了，只有活动立项，没有她的报销申请。别的你别问我，我也不知道。

###### 2. 选择后节拍 2

**你：** 明白。我把单据类型原样拍下来，不把立项写成报销。

###### 2. 留下托话和批注没对上

- **内部 ID：** keep-responsibility-gap
- **标签：** 留下托话和批注没对上
- **授予物件：** 茶水间责任对照
- **路线轴：** process-control
###### 选择后节拍

###### 1. 选择后节拍 1

**部门助理：** 私聊让她别问预算，领导后来只写了她负责活动。谁负责催付款，我这儿没看到。

###### 2. 选择后节拍 2

**你：** 那我把缺的这句拍下来，别的回去再问。

### 地点 4

- **内部 ID：** day-work-payment-ledger
- **标签：** 后台·她整理的报销记录
- **舞台背景：** day-document
- **类型：** document
#### 场景正文

- **access：** 七条记录由陈本人按原始时间整理并上传，姓名、公司名和完整卡号已经遮掉。
- **document Id：** case4-payment-ledger
- **路线轴：** money-flow
- **获得物件：** 她整理的报销时间线

### 幕间物件映射

- **approval page reviewed：** 立项页不是报销单
- **timeline delay gap：** 预算时间线复核
- **leader note hot：** 领导批注
- **playback pad：** 垫款回放

## 夜 B：回拨

- **收麦锚点：** 发了三次
- **收麦舞台：** 她那头传来翻相册的声音，随后只剩忙音。
- **hangup Audio Cue Id：** sfx.phone.busy
- **主播留话：** 你先把图和发票找齐。明天问完，再把对方怎么回的原话告诉我。
### 带回物开场（全部分支）

#### 她整理的报销时间线

- **台词：** 14：05 助理发流程，14：22 他就让我别在群里问。财务说延后，是九天以后才来的。
##### 回拨首次冲突

- **主播台词：** 十四点二十二分那条私聊，你当时怎么回的？
- **咨询者台词：** 我回“我来扛”。他让我别问，我也真没问。

#### 财务窗口补报销要求

- **台词：** 财务窗口看了一眼就说，那三张都是活动立项，不是我的报销。我手里的公司抬头发票，原件还没交。
##### 回拨首次冲突

- **主播台词：** 正式报销都还没提，你这三个星期在等什么？
- **咨询者台词：** 我在等他替我办。可发票一直在我手里，我也没问报销单号。

#### 立项单号拒查记录

- **台词：** 窗口拿那串 LX 单号查不了个人报销。那是立项编号，不是报销编号。
##### 回拨首次冲突

- **主播台词：** 你手里连报销编号都没有。明天第一件事做什么？
- **咨询者台词：** 拿发票去提正式报销，把申请编号发到群里。

#### 供应商返费原话

- **台词：** 供应商那句语音很短：‘每一层的返费结完，下一批点位才往下走。’哪笔付了、最后进谁账户，还是没说。
##### 回拨首次冲突

- **主播台词：** 这句话能让你确认什么？
- **咨询者台词：** 返费不是只经过一个人。可哪一笔真的付了、最后进谁账户，我还是看不出来。

#### 供应商返费三层表

- **台词：** 供应商返费表列了三层：点位协调、渠道维护、采购配合。他在采购经办那一栏，可支付状态和账户都遮着。这张表和公司报销不是一回事。
##### 回拨首次冲突

- **主播台词：** 三层都有返费。他那一层到底拿没拿，你今晚要他补什么？
- **咨询者台词：** 供应商的支付记录。得有支付状态和收款账户。

#### 茶水间立项缺口

- **台词：** 助理把三页摊在桌上。私聊叫我别问预算，领导批注只写我负责，剩下那张又只是活动立项。我的报销单，根本不在里面。
##### 回拨首次冲突

- **主播台词：** 公司抬头发票一直在你手里。你为什么没自己提报销？
- **咨询者台词：** 我一直等他补。等了三个星期，发票还夹在我抽屉里。

#### 茶水间责任对照

- **台词：** 私聊让我别问预算，领导后来只写了我负责。我来回看了几遍，也没找到谁负责催付款。
##### 回拨首次冲突

- **主播台词：** 活动总结写了你负责。有没有人书面写过谁负责催付款？
- **咨询者台词：** 没有。负责人的位置有我的名字，催款的人没写。
- **pause After Caller Line：** true
- **caller Followup Line：** 可要我现在把“个人垫款未返”写进那张表，我还不敢。

#### 立项页不是报销单

- **台词：** 我又看了那三张图。单据类型全是活动立项，编号也都是 LX 开头，连报销申请编号都没有。
##### 回拨首次冲突

- **主播台词：** 你问了三次报销，对方为什么一直拿立项页回你？
- **咨询者台词：** 他说流程在走，我就没往下看。到底有没有替我提过报销，我现在真不知道。

#### 预算时间线复核

- **台词：** 他让我别在群里问预算时，财务还没发延后通知。我把日期看岔了，昨晚那句不算。
##### 回拨首次冲突

- **主播台词：** 他当时拿什么让你别在群里问？
- **咨询者台词：** 就说来不及，还说别让领导觉得我不担事。财务慢，是我后来替他补的。

#### 领导批注

- **台词：** 领导那条批注，我又看了。只写了我负责，一个钱字都没有。我当时高兴，是真的。账也还在。
##### 回拨首次冲突

- **主播台词：** 那句夸奖落下来时，你有没有问六万八什么时候回？
- **咨询者台词：** 没有。我先截图发给朋友了。

#### 垫款回放

- **台词：** 那句私聊我重新放了。‘你先把场地和礼品费垫了。活动总结里，我写你是负责人。’钱在前，负责人在后。可我当时只顾着高兴，马上回了“我来扛”。
##### 回拨首次冲突

- **主播台词：** 你回“我来扛”时，知道自己要垫六万八吗？
- **咨询者台词：** 不知道具体金额。我以为只是先把活接下来，真让我刷卡时，我也没敢追问这算谁的责任。

### 无带回物兜底开场

- **台词：** 我回来了。新批注还在手机里。你白天先看了哪份材料？

### 回拨立场

- **against Caller：** 这次活动是我先争取的，“我来扛”也是我回的。我认。可钱还是没回来。
- **with Caller：** 那三张立项页我都留着，群里的流程表也翻出来了。你问吧。

### 回拨后的生活拍

#### lines

##### 1. lines 1

**咨询者：** 等一下，我把工作群的提示音关了。它一响，我就以为钱回来了。……关了，你说。

### 立场快照回应拍

- **respondent problem：** 昨晚你问他为什么不让我在群里问预算。那条私聊还在，今天就问那十七分钟。
- **caller complicit：** 昨晚你问临时额度是不是我自己提的。是，我想拿这个活动，也确实自己去提了。
- **unclear：** 昨晚你问我为什么删掉预算问题。那句话我又打了一遍，这次没有删。

### 夜 B · 1｜work-leader-note

**林旭阳：** 后来公司有人公开提过这次活动吗？

**咨询者：** 活动结束以后，部门开了个小会。领导当众说：“客户反馈不错，这次活动负责人写小陈，流程该补的补齐。”我一听见自己的名字，马上截了图发给朋友，后半句根本没细看。今天再往前翻，14：05 那张流程表还在，我回的“收到”也还在。

【材料触发后的重述】 **咨询者：** 批注我又看了一遍。活动负责人是我，付款那一栏空着。下周一开会前要确认，可我点了确认，六万八也回不到信用卡里。

#### no Clue Reaction

**咨询者：** 领导点了我的名。我当时光顾着高兴，别的真没看进去。

- **interaction Mode：** lineReplay
- **线索职能：** misdirect
- **错误框架：** 领导公开夸了咨询者，并在活动总结里写她负责，说明组织认可她承担这单，流程只是内部补齐。
#### 回收目标

- work-split-ownership

- **说话人 ID：** chen
- **现场疑点：** 会上的夸奖坐实了负责人署名，也把流程问题压回执行层。
- **矛盾：** 领导夸的是活动结果，也写了负责人，没有追问垫款与流程入口。
- **可靠度：** partial
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 领导当场知道你刷了个人卡吗？

**咨询者：** 我不确定。会上没人说“个人卡”三个字。说的都是执行效率、客户反馈。

- **source Anchor：** 流程该补的补齐

##### 2. 自由追问 2

**林旭阳：** 那句老规矩是谁先接的话？

**咨询者：** 他回得最快，说会补齐。可我后来问了几次，还是只有他发来的活动立项页。正式报销谁来提，我一句都没问到。

- **source Anchor：** 后半句根本没细看

##### 3. 自由追问 3

**林旭阳：** 会后他单独回过你吗？

**咨询者：** 没有。他在会上说会补流程，散会以后就没再找我。

- **source Anchor：** 活动结束以后

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 我把领导原话再放一遍：‘流程该补的补齐。’这句话里，提没提这六万八什么时候还？

**咨询者：** 没提。谁来还、哪天还，都没说。我当时只顾着截自己的名字。

**林旭阳：** 公司抬头的发票原件呢？

**咨询者：** 还在我抽屉里。三个星期了，一直没交。

**林旭阳：** 那你为什么不自己提报销？

**咨询者：** 我怕财务先问我为什么没报备。也总觉得，他既然说会补，就会替我办。

- **source Anchor：** 这次活动负责人写小陈
- **revised Source Anchor：** 付款那一栏空着
- **玩家所选怀疑方向：** 重放‘流程该补的补齐’
- **防备回答：** 写了我名字。我那时候只顾着截图。
###### resistance Beat

###### lines

###### 1. lines 1

**咨询者：** 这句他是当着所有人说的。

###### 2. lines 2

**林旭阳：** 所以更要把‘负责活动’和‘什么时候还钱’分开。

###### logic Contract

- **premise Anchor：** 这次活动负责人写小陈
- **source Kind：** document-readout
- **source Proves：** 领导批注明确记录咨询者为这次活动的负责人。
- **source Does Not Prove：** 负责人署名不能证明领导知道个人垫款，也没有确定补款人和日期。
- **answer Anchor：** 都没说
- **answer Adds：** 批注没有记录还款人或具体还款日期；咨询者随后承认公司抬头发票在自己抽屉里放了三个星期，因为怕被财务追问未报备而始终没有提交。
- **next Legal Question：** 可以追问活动总结表确认前责任如何写，不能用公开表扬替付款流程背书。

- **矛盾：** 领导只确认结果和署名，没有确认垫款与流程责任。
- **是否核心项：** true
- **路线轴：** active-provocation
- **路线口气：** caller-skeptical

##### 2. 关键追问 2

**林旭阳：** 被点名以后，你为什么又等了一天？

**咨询者：** ……因为我高兴。领导念到我名字，我先截图了。可真要追钱，别人就会问我为什么没报备。我一想到这儿，又拖了一天。

###### miss Reaction

**咨询者：** 因为领导点了我的名。我当时光顾着截图，没往前翻。

- **source Anchor：** 马上截了图发给朋友
- **revised Source Anchor：** 我点了确认
- **revised Question：** 你点了确认以后，是不是又把追款往后放了？
- **玩家所选怀疑方向：** 被点名后为什么继续等
- **是否核心项：** false
- **路线轴：** caller-credibility
- **路线口气：** caller-skeptical

#### 压力表演

- **意图钩子：** 夸奖把话堵回去
- **防备状态：** guarded
##### 表情/听感

- **类型：** shift
她的声音压低了半格

### 场间实时反压

- **内部 ID：** work-comment-stupid-blowup
- **类型：** emotionalChoice
- **cost：** 0
- **after Scene Index：** 3
- **from：** 来电人看见弹幕
#### lines

##### 1. lines 1

【流程都走完了？那报销编号呢。】

##### 2. lines 2

【六万八刷了三个星期，群里没人说哪天还。】

##### 3. lines 3

**咨询者：** 弹幕里有人说我蠢。

##### 4. lines 4

【停顿】

##### 5. lines 5

**咨询者：** 我知道六万八刷得离谱。可他当时说会在活动总结里写我负责，我就没再想别的。

##### 6. lines 6

【停顿】

##### 7. lines 7

**咨询者：** 这六万八，我刷卡的时候连报备都没做。那句说得难听，我还真反驳不了。你听我——算了，你问。

#### choices

##### 1. 弹幕的话先别往自己身上揽。你当时想把活动做好，这不丢人。把群里刚发的那句念给我听。

- **内部 ID：** soothe
- **direction Label：** 先让她从弹幕里退出来
- **标签：** 弹幕的话先别往自己身上揽。你当时想把活动做好，这不丢人。把群里刚发的那句念给我听。
###### lines

###### 1. lines 1

**咨询者：** ……好。

- **立场变化：** open
- **路线轴：** caller-credibility
- **路线口气：** reassure
- **recap Aftertaste：** 她开始跟着弹幕骂自己时，我先让她停下来，把群里的话说完。

##### 2. 自责先放一边。现在只对账。

- **内部 ID：** push-back
- **direction Label：** 不安慰，先追六万八
- **标签：** 自责先放一边。现在只对账。
###### lines

###### 1. lines 1

**咨询者：** ……嗯。对账。

- **立场变化：** defensive
- **路线轴：** caller-credibility
- **路线口气：** pressure-point
- **recap Aftertaste：** 她开始自责时，我没有顺着安慰，先把六万八和回单问清楚。

##### 3. (不接话)

- **内部 ID：** silence
- **direction Label：** 让她自己把话接下去
- **标签：** (不接话)
- **不出声：** true
###### lines

###### 1. lines 1

【弹幕慢下来。几秒钟没人接话。】

###### 2. lines 2

**咨询者：** ……行。

###### 3. lines 3

【停顿】

###### 4. lines 4

**咨询者：** 行，继续。

- **立场变化：** neutral
- **路线轴：** caller-credibility
- **路线口气：** neutral
- **recap Aftertaste：** 她说自己没法反驳以后，我没有接话。等她自己说继续，我们才往下问。

### 场间实时反压

- **内部 ID：** work-group-repayment-message
- **类型：** interruptToast
- **cost：** 0
- **after Scene Index：** 3
- **from：** 平台强制贴片
#### lines

##### 1. lines 1

**咨询者：** 工作群刚弹出一条，是他说的。我正要念。

##### 2. lines 2

【后台同时弹出强制贴片：五秒后播放。继续发声，本场退出推荐。】

#### choices

##### 1. 先把这条念完。

- **内部 ID：** read-before-ad
- **direction Label：** 先念完原话，承担停推
- **标签：** 先把这条念完。
###### lines

###### 1. lines 1

**咨询者：** ‘陈先垫的六万八，等月底财务集中报销时一起办，大家辛苦。’他终于肯在群里认这六万八了。那我是不是就不用再单独发了？

###### 2. lines 2

**林旭阳：** 他只认了你垫过，没说报销单在哪儿，也没说月底是提交还是打钱。

###### 3. lines 3

【群消息随即撤回。她截到了；贴片同时归零，后台曲线骤降，本场推荐关闭。】

- **路线轴：** process-control
- **路线口气：** pressure-point
- **ending Impact：** platform-data-loss
- **recap Aftertaste：** 强制贴片倒数时，我让她先把群消息念完。本场随即退出推荐。

##### 2. 先静音，广告后回来。

- **内部 ID：** mute-for-ad
- **direction Label：** 先静音，保住连线
- **标签：** 先静音，广告后回来。
###### lines

###### 1. lines 1

【直播声道被切进广告，电话没有断。四十秒后，她还在。】

###### 2. lines 2

**咨询者：** 刚才那条撤回了。我截到了，已经发后台。

###### 3. lines 3

**林旭阳：** 截图只认了你垫过。报销单、提交日期和打款日期，还是一项都没有。

- **路线轴：** document-edge
- **路线口气：** trust-but-verify
- **recap Aftertaste：** 强制贴片下来时，我先静音保住连线。群消息被撤回，后台留下了截图。

### 场间实时反压

- **内部 ID：** work-private-warning-voice
- **类型：** interruptToast
- **cost：** 0
- **after Scene Index：** 3
- **from：** 同事私聊语音
#### lines

##### 1. lines 1

**咨询者：** 他又私聊了。语音，刚发的。

##### 2. lines 2

【她把手机贴近麦克风。】

##### 3. lines 3

**同事托话（手机）：** 群里那句你截图就算了。负责人名单还没定，你真把这事捅到老板那儿，以后活动别找我。

##### 4. lines 4

【停顿】

##### 5. lines 5

**咨询者：** 他就是拿这个压我。

##### 6. lines 6

**林旭阳：** 语音留着。明天拿发票提正式报销，别再等他替你办。

### 夜 B · 2｜work-split-ownership

**林旭阳：** 他们发来让你确认的那张表，最后怎么写的？

**咨询者：** 这份表的初稿是我写的，写到凌晨两点多，呃，写完还挺兴奋的。我给我妈发消息，说老板第一次让我独立负责这么大的活动，她第二天回了个大拇指。后来他拿去改，发回来让我确认：活动负责人写的是我，付款经办人写的是他。下周一开会前就得确认，我现在还没点。群里那句‘公司一直不给我报销’，我打好了，也一直没敢发。

- **interaction Mode：** testimonyWall
- **线索职能：** payoff
- **错误框架：** 活动总结已经写咨询者负责，因此正式报销只剩执行细节。
#### 回收目标

- work-title-for-advance
- work-leader-note

- **说话人 ID：** chen
#### testimony Wall

- **标题：** 把‘流程都走完了’放回付款节点
- **引子：** 审批通过、活动署名和实际付款是三个节点。逐句问，不把任何一张截图当成终点。
- **split After：** 3
- **mid Summary：** 她想保住负责人署名，也想拿回六万八；这两个诉求都是真的，但不能继续共用一张立项页。
- **soft Anchor Response：** 缺失付款栏正好碰到这句。正式指认只证明流程没走到付款，不替公司判定最终责任。
##### miss Feedback

###### evidence

- 这张页没有付款栏，压不到她刚才那句。她又把‘审批通过’念了一遍。
- 还是旧图。她只说：‘公司欠我的六万八总是真的。’

###### statement

- 付款栏找对了，原句没对上。她把负责人署名挡到前面。
- 句子又偏了。她不再答报销编号，只说经办会补。

##### relief Beat

- **listener Id：** @审批通过但钱包未通过
- **评论：** 本直播间第一个到账的是大拇指。
- **主播台词：** 大拇指先记精神奖励，六万八还得找回单。

##### statements

###### 1. 证词 01

- **内部 ID：** work-process-complete
- **标签：** 证词 01
流程都走完了，就是公司一直不给我报销。

- **press Response：** ‘图上就是审批通过。报销编号……我没看见。’
- **present Response：** 同一张审批页只能证明立项通过，不能把空着的付款栏说成到账。

###### 2. 证词 02

- **内部 ID：** work-three-screenshots
- **标签：** 证词 02
他一共发了三次。三次都是同一张活动立项页，编号没变。

- **press Response：** ‘三次，都是LX那张。没有新编号。’
- **present Response：** 重复截图能说明催问被同一页面挡回，不能单独证明钱在财务手里。

###### 3. 证词 03

- **内部 ID：** work-title-matters
- **标签：** 证词 03
活动负责人写的是我，我确实舍不得把这个机会一起丢掉。

- **press Response：** ‘这个负责人是我争来的。刷卡……也是我自己刷的。’
- **present Response：** 负责人字段和付款字段属于不同责任线，不能拿其中一个覆盖另一个。

###### 4. 证词 04

- **内部 ID：** work-payment-handler-other
- **标签：** 证词 04
活动总结初稿上，活动负责人是我，付款经办人是他。六万八刷在我的信用卡上。

- **press Response：** ‘负责人是我，经办是他。六万八，刷的是我的卡。’
- **present Response：** 材料能支持继续追付款经办和回单，不能证明同事已经收走返款。

###### 5. 证词 05

- **内部 ID：** work-unsent-group-message
- **标签：** 证词 05
我把追款消息打进群里，一直没发，是怕以后不再让我接活动。

- **press Response：** ‘消息还在输入框。我怕发了以后，再也轮不到我。’
- **present Response：** 这句讲的是她的风险选择，付款栏只能帮她把问题问得更具体。

##### acts

###### 1. 把‘流程都走完了’放回付款节点

- **内部 ID：** act1
- **标题：** 把‘流程都走完了’放回付款节点
- **wink Line：** 我把审批页再打开。
- **wink Tier：** tier3-accomplice
- **引子：** 审批通过、活动署名和实际付款是三个节点。逐句问，不把任何一张截图当成终点。
- **split After：** 3
- **mid Summary：** 她想保住负责人署名，也想拿回六万八；这两个诉求都是真的，但不能继续共用一张立项页。
- **soft Anchor Response：** 缺失付款栏正好碰到这句。正式指认只证明流程没走到付款，不替公司判定最终责任。
###### relief Beat

- **listener Id：** @审批通过但钱包未通过
- **评论：** 本直播间第一个到账的是大拇指。
- **主播台词：** 大拇指先记精神奖励，六万八还得找回单。

###### statements

###### 1. 证词 01

- **内部 ID：** work-process-complete
- **标签：** 证词 01
流程都走完了，就是公司一直不给我报销。

- **press Response：** ‘图上就是审批通过。报销编号……我没看见。’
- **present Response：** 同一张审批页只能证明立项通过，不能把空着的付款栏说成到账。

###### 2. 证词 02

- **内部 ID：** work-three-screenshots
- **标签：** 证词 02
他一共发了三次。三次都是同一张活动立项页，编号没变。

- **press Response：** ‘三次，都是LX那张。没有新编号。’
- **present Response：** 重复截图能说明催问被同一页面挡回，不能单独证明钱在财务手里。

###### 3. 证词 03

- **内部 ID：** work-title-matters
- **标签：** 证词 03
活动负责人写的是我，我确实舍不得把这个机会一起丢掉。

- **press Response：** ‘这个负责人是我争来的。刷卡……也是我自己刷的。’
- **present Response：** 负责人字段和付款字段属于不同责任线，不能拿其中一个覆盖另一个。

###### 4. 证词 04

- **内部 ID：** work-payment-handler-other
- **标签：** 证词 04
活动总结初稿上，活动负责人是我，付款经办人是他。六万八刷在我的信用卡上。

- **press Response：** ‘负责人是我，经办是他。六万八，刷的是我的卡。’
- **present Response：** 材料能支持继续追付款经办和回单，不能证明同事已经收走返款。

###### 5. 证词 05

- **内部 ID：** work-unsent-group-message
- **标签：** 证词 05
我把追款消息打进群里，一直没发，是怕以后不再让我接活动。

- **press Response：** ‘消息还在输入框。我怕发了以后，再也轮不到我。’
- **present Response：** 这句讲的是她的风险选择，付款栏只能帮她把问题问得更具体。

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** case4-payment-ledger:q07
- **statement Id：** work-process-complete
###### material Cards

###### 1. 截至第二晚仍缺失的付款栏

- **内部 ID：** case4-payment-ledger:q07
- **类型：** 付款栏核对
- **标签：** 截至第二晚仍缺失的付款栏
- **excerpt：** 付款回单／预计付款日期：两项均未显示。
- **source Label：** 她整理的七条报销记录

###### 2. 旧立项页 LX 2407 018

- **内部 ID：** case4-payment-ledger:q04
- **类型：** 审批截图
- **标签：** 旧立项页 LX-2407-018
- **excerpt：** 活动前一天通过；活动后同一张图重发三次。
- **source Label：** 她整理的七条报销记录

###### 3. 咨询者个人卡垫付 ¥68,000

- **内部 ID：** case4-payment-ledger:q03
- **类型：** 刷卡记录
- **标签：** 咨询者个人卡垫付 ¥68,000
- **excerpt：** 能确认垫付发生，不能确认公司付款已经进入哪一步。
- **source Label：** 她整理的七条报销记录

- **咨询者台词：** ……对，流程没走完。至少付款那一段，我手里什么都没有。
- **主播台词：** 那就别再说‘流程都走完了’。你现在拿得出的，只有活动立项页。正式报销编号和回单，你有哪一样？
- **boundary Line：** 缺失付款栏只证明现有材料没走到付款，不证明公司最终拒付，也不证明同事已拿到返款。
- **矛盾：** 咨询者把立项审批和负责人署名说成完整报销流程，但付款栏始终缺失。
- **路线轴：** process-control
- **continue Label：** 把活动负责人和付款经办人分开

###### 2. 把‘经办说会补’放回公开流程

- **内部 ID：** act2
- **status Label：** 她改口了 · 第二段说法
- **标题：** 把‘经办说会补’放回公开流程
- **引子：** 她认下付款流程没走完，转而把没继续追问的责任全推给经办承诺。第二段仍可自由追问、普通出示；正式指认另有两次机会。
###### opener Fact Keywords

- 没走完
- 付款

###### opener Lines

###### 1. opener Lines 1

**咨询者：** 好，付款那段没走完，我认。可那天下午客户突然提前，他是经办，14：22 又私聊我，说先刷，活动结束他会补。我第一次独立负责这么大的活动，老板还在等结果，我能当场说不做吗？

###### 2. opener Lines 2

**林旭阳：** 那就按时间说。客户改期以后，第一条消息是谁发的？

###### 3. opener Lines 3

**咨询者：** 客户把活动提前，他私聊说别在群里问预算，先刷，活动后补。我当时想先把活动做下来，负责人也能写我。付款一直是他经办，后来他又反复说会补，我当然就按他说的等。

- **revised Frame：** 她承认付款流程未完成，却把自己未报备、未追编号和未发群消息全解释成经办同事承诺会补。
- **split After：** 2
- **mid Summary：** 她现在把经办的承诺放在前面。可在那条私聊之前，她已经看见报备要求，还回了‘收到’。
###### relief Beat

- **listener Id：** @月底到底哪月底
- **评论：** ‘月底会补’是不是公司免密支付。
- **主播台词：** 先别开免密。她连报销编号都没有。

- **soft Anchor Response：** 14:05 的公开报备要求碰到了她的新说法。正式指认只拆‘我只能按他说的等’，不替公司免除付款责任。
###### comparison

###### 1. comparison 1

- **statement Id：** work-process-complete
- **status：** 被打破

###### 2. comparison 2

- **statement Id：** work-three-screenshots
- **status：** 变了说法

###### 3. comparison 3

- **statement Id：** work-title-matters
- **status：** 变了说法

###### 4. comparison 4

- **statement Id：** work-payment-handler-other
- **status：** 变了说法

###### 5. comparison 5

- **statement Id：** work-unsent-group-message
- **status：** 她收回了

###### statements

###### 1. 改口 01

- **内部 ID：** work-handler-promise-cleared-her
- **标签：** 改口 01
付款没走完我认，可经办说活动后会补，我按他的安排等就行，没再盯不能算我的问题。

- **press Response：** ‘他就是这么答应我的。群公告我看见了，可当时客户已经提前了。’
- **present Response：** 要拆这句，得找她在私聊之前已经收到的公开规则，不能只重复付款栏为空。

###### 2. 改口 02

- **内部 ID：** work-repeat-screenshot-no-number
- **标签：** 改口 02
他后来三次发的都是同一张立项图，我那时也确实没再问正式报销编号。

- **press Response：** ‘对，三张都一样。我没再问编号，因为我当时信他会补。’
- **present Response：** q04 能核对重复截图，这句已经没有把旧页面说成付款进展。
- **survives From Act1：** work-three-screenshots

###### 3. 改口 03

- **内部 ID：** work-title-and-payment-split
- **标签：** 改口 03
负责人署名我还想保留，可付款责任不能因为署名也压在我个人卡上。

- **press Response：** ‘负责人别给我撤。可六万八也不能一直压在我卡上。’
- **present Response：** 负责人字段不能代替付款字段，也不能反过来取消她的项目署名。
- **survives From Act1：** work-title-matters

###### 4. 改口 04

- **内部 ID：** work-card-debt-needs-formal-entry
- **标签：** 改口 04
六万八还在我信用卡上，我现在得拿到正式报销编号和预计日期。

- **press Response：** ‘报销编号，预计日期。明天我就问这两个。’
- **present Response：** 现有记录能支持她去要编号和日期，不能预判公司最后怎么处理。
- **survives From Act1：** work-payment-handler-other

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** case4-payment-ledger:q01
- **statement Id：** work-handler-promise-cleared-her
###### boundary Line Key Phrases

- 不减轻同事绕流程
- 不证明公司可以拒付

- **selection Reason：** q01 比 14:22 私聊早十七分钟，明确写着个人垫付需报备；它能打穿‘经办说会补，所以我只需等待’的新框架，同时保留同事诱导绕流程和公司最终付款责任。
###### material Cards

###### 1. 14:05 群公告 · 个人垫付需报备

- **内部 ID：** case4-payment-ledger:q01
- **类型：** 公开流程原文
- **标签：** 14:05 群公告 · 个人垫付需报备
- **excerpt：** 预算先填金额；个人垫付需报备；供应商对公付款需附报价比较。
- **source Label：** 她整理的七条报销记录 q01

###### 2. 14:22 先刷，活动后补

- **内部 ID：** case4-payment-ledger:q02
- **类型：** 私聊指令
- **标签：** 14:22 先刷，活动后补
- **excerpt：** 能确认同事要求绕开群内预算，不能抹掉她此前看到的公开规则。
- **source Label：** 她整理的七条报销记录

###### 3. 正式报销申请编号未显示

- **内部 ID：** case4-payment-ledger:q06
- **类型：** 财务窗口核对
- **标签：** 正式报销申请编号未显示
- **excerpt：** 能确认缺少查询入口，不能说明她绕流程前知道什么。
- **source Label：** 她整理的七条报销记录

- **咨询者台词：** ……14：05那条我看见了，也回了收到。后来他让我别在群里问，是我自己答应先刷的。
- **主播台词：** 你看见了，还回了‘收到’。十七分钟以后，你自己答应刷卡。那句‘他会补’，不能替你把前面这一步抹掉。
- **boundary Line：** q01 只推翻‘经办承诺后她无需再跟进’；不减轻同事绕流程和重复发旧图的责任，也不证明公司可以拒付。
- **矛盾：** 咨询者承认付款流程没走完后，把未报备和未追编号全推给经办承诺；更早的公开流程公告证明她曾知情并选择绕开。
- **路线轴：** process-control
- **continue Label：** 把活动负责人和付款经办人分开

#### decisive Present

- **max Attempts：** 2
- **evidence Id：** case4-payment-ledger:q07
- **statement Id：** work-process-complete
##### material Cards

###### 1. 截至第二晚仍缺失的付款栏

- **内部 ID：** case4-payment-ledger:q07
- **类型：** 付款栏核对
- **标签：** 截至第二晚仍缺失的付款栏
- **excerpt：** 付款回单／预计付款日期：两项均未显示。
- **source Label：** 她整理的七条报销记录

###### 2. 旧立项页 LX 2407 018

- **内部 ID：** case4-payment-ledger:q04
- **类型：** 审批截图
- **标签：** 旧立项页 LX-2407-018
- **excerpt：** 活动前一天通过；活动后同一张图重发三次。
- **source Label：** 她整理的七条报销记录

###### 3. 咨询者个人卡垫付 ¥68,000

- **内部 ID：** case4-payment-ledger:q03
- **类型：** 刷卡记录
- **标签：** 咨询者个人卡垫付 ¥68,000
- **excerpt：** 能确认垫付发生，不能确认公司付款已经进入哪一步。
- **source Label：** 她整理的七条报销记录

- **咨询者台词：** ……对，流程没走完。至少付款那一段，我手里什么都没有。
- **主播台词：** 那就别再说‘流程都走完了’。你现在拿得出的，只有活动立项页。正式报销编号和回单，你有哪一样？
- **boundary Line：** 缺失付款栏只证明现有材料没走到付款，不证明公司最终拒付，也不证明同事已拿到返款。
- **矛盾：** 咨询者把立项审批和负责人署名说成完整报销流程，但付款栏始终缺失。
- **路线轴：** process-control
- **continue Label：** 把活动负责人和付款经办人分开

- **现场疑点：** 署名给了表面责任，付款入口仍在同事手里。
- **矛盾：** 咨询者拿到项目署名，却没有拿到正式报销和付款入口。
- **可靠度：** partial
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 表发回来以后，你先看了哪一栏？

**咨询者：** 先看负责人。还是我。付款经办人那一栏，我是今晚才认真看。

- **source Anchor：** 负责人写的是我

##### 2. 自由追问 2

**林旭阳：** 如果重来一次，你还接这个活吗？

**咨询者：** 接。但会先在群里问一句预算。就一句，够了。

- **source Anchor：** 我现在还没点

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 这张表一确认，活动要是出了问题，公司先找谁？

**咨询者：** 先找我，因为表上写我是活动负责人。可我要催付款，还得找他。

- **source Anchor：** 活动负责人写的是我
- **玩家所选怀疑方向：** 负责人出事后先找谁
###### 唯一核心反转过场

- **内部 ID：** case4-responsibility-split
- **类型：** reveal
- **过场短标：** 审批页翻到底
- **标签：** 负责人栏，付款经办栏
- **visual Variant：** approval-split

- **防备回答：** 先找我。写着我负责啊。
###### logic Contract

- **premise Anchor：** 活动负责人
- **source Kind：** document-readout
- **source Proves：** 活动总结表把咨询者写成活动负责人，把付款经办写给同事。
- **source Does Not Prove：** 岗位分栏不能证明款项已经被同事占有，也不能消除咨询者绕流程的责任。
- **answer Anchor：** 先找我
- **answer Adds：** 出现问题时责任先落到她，追款却仍要经过同事掌握的入口。
- **next Legal Question：** 可以决定是否在活动总结表确认前写明个人垫款未返，不能从付款经办人直接推定公司已经受理或付款。

- **矛盾：** 项目责任和资金入口被拆给不同人。
- **是否核心项：** true
- **路线轴：** identity-wording
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 你想过在那张表里加一句‘个人垫款还没报销’吗？

**咨询者：** 想过。可一加，别人先问的就是我为什么私下垫钱。写上去，我先挨问；不写，信用卡账单还是我的。

- **source Anchor：** 我现在还没点
- **玩家所选怀疑方向：** 活动总结要不要写明垫款未还
- **是否核心项：** false
- **路线轴：** caller-credibility
- **路线口气：** caller-skeptical

#### 压力表演

- **意图钩子：** 入口攥在别人手里
- **防备状态：** guarded
##### 表情/听感

- **类型：** pause
吸了口气才接

### 回拨后立场

#### from Snapshot Option Ids

- **respondent problem：** open
- **caller complicit：** defensive
- **unclear：** neutral

- **default：** neutral
#### lines

- **defensive：** 我差点没敢再打。弹幕说得也没错，这次活动是我自己想接的。可那六万八不能就这么算了。
- **open：** 我回来了。白天财务一眼就看出来，那三张是立项页，不是我的报销。
- **neutral：** 我回来了。新批注还在手机里，那张立项页也还在。正式报销单还是没有。

## 材料、回流与可选追查

### 证据卡

#### 1. 审批通过页

- **内部 ID：** daily-work-repay-approval
- **表现类型：** 审批截图
- **标题：** 审批通过页
- **front：** 页面顶端写着“审批通过”；审批时间是活动前一天。下方是“单据类型：活动立项”“单据编号：LX-2407-018”。
- **detail：** 这是活动前已经批好的立项，不是个人垫款报销单。页面没有报销申请编号。
##### targets

- truthWithGap

- **矛盾：** 通过的是活动立项，不是个人垫款报销；这张图不能证明报销已经提交。

#### 2. 署名和垫款

- **内部 ID：** daily-work-repay-chat
- **表现类型：** 群聊原话
- **标题：** 署名和垫款
- **front：** “你先把场地和礼品费垫了。活动总结里，我写你是负责人。”
- **detail：** 表现机会和资金风险被放在同一条私聊里。
##### targets

- sceneHint

- **矛盾：** 垫付款被包装成项目署名机会，资金风险被弱化。

### 材料圈点

#### 1. 预算沟通记录检视

- **内部 ID：** work-budget-timeline
##### revalues

- work-private-process

- **标题：** 预算沟通记录检视
- **selection Mode：** priority
- **提示题：** 这组聊天里有三处都得追。你先带哪一处上麦？
- **材料：** 部门助理 14:05 在大群发流程表：预算金额、个人垫付报备、供应商对公付款需附报价比较。当天 14:22，同事私聊“比价来不及，先别在大群问预算，用个人卡先刷。活动结束再补报备”。财务延后通知是九天后才发的。
##### 材料行

- 14:05 部门助理：活动预算先填金额；供应商对公付款需附报价比较；个人垫付需提前报备
- 14:22 同事私聊：比价来不及；别在大群问预算；用个人卡先刷
- 九天后 财务群：供应商付款本月统一延后

##### 选项

###### 1. 延后通知晚了九天

- **标签：** 延后通知晚了九天
- **是否核心项：** true
- **矛盾：** 同事说来不及时，财务还没有发布付款延后通知。
- **反馈：** 私聊是14：22，财务通知在九天以后。你怎么把后面的通知当成了当天刷卡的理由？
- **人物反应：** 14：22……财务通知是九天以后。我把日期看岔了。
- **revises Scene：** 1
- **路线轴：** process-control

###### 2. 个人垫付需报备

- **标签：** 个人垫付需报备
- **是否核心项：** false
- **反馈：** 这条她第一夜已经承认了：流程写着要报备，她还是在没有预算和报备的情况下刷了自己的卡。现在更需要带回去的是九天的时差，或者同事为什么改让她刷个人卡。
- **人物反应：** 这条我认。流程我看过，也回了收到。可六万八刷出去以前，我没报备。
- **路线轴：** caller-credibility

###### 3. 供应商对公账户

- **标签：** 供应商对公账户
- **是否核心项：** true
- **矛盾：** 公开流程要求对公付款附报价比较，同事却以比价来不及为由改让咨询者刷个人卡。
- **反馈：** 流程要求对公付款带报价比较。他说‘比价来不及’，你为什么就拿自己的卡刷了？
- **人物反应：** 他一说比价来不及，我就真拿自己的卡顶上去了。当时我只怕耽误活动。
- **路线轴：** money-flow

#### 2. 审批截图检视

- **内部 ID：** work-approval-missing
##### revalues

- work-approval-only

- **标题：** 审批截图检视
- **提示题：** 这张“审批通过”最先要核对哪三项？
- **材料：** 审批页保留了截图里能读到的字段。
##### 材料行

- 状态｜审批通过
- 审批时间｜活动前一天
- 单据类型｜活动立项
- 单据编号｜LX-2407-018
- 报销申请编号｜未显示
- 付款回单｜未显示
- 同图发送｜3 次

##### 选项

###### 1. 审批时间、单据类型和报销编号

- **标签：** 审批时间、单据类型和报销编号
- **是否核心项：** true
- **矛盾：** 截图通过的是活动立项，且没有报销申请编号，不能证明个人垫款已经进入报销流程。
- **反馈：** 这张立项在活动前一天就批了。活动后他又发了三次，发的是不是同一张？
- **人物反应：** 活动前一天……所以他后来发的三次，都是同一张旧立项。
- **路线轴：** document-edge

###### 2. 活动现场照片

- **标签：** 活动现场照片
- **是否核心项：** false
- **反馈：** 活动办了也不代表钱回来了。
- **人物反应：** 现场照片老板都点过赞。活动本身没毛病。
- **路线轴：** outer-thread

###### 3. 老板有没有看到活动总结

- **标签：** 老板有没有看到活动总结
- **是否核心项：** false
- **反馈：** 活动总结写了谁负责，没写他什么时候把垫款还回来。
- **人物反应：** 活动总结老板看了，还夸了。夸完我更不敢提钱。
- **路线轴：** identity-wording

### 后台回流

#### 1. 哪一封值得留下

- **内部 ID：** work-postcase-inbox
- **声音归属：** document
- **来源：** mixed-inbox
- **出现界面：** 后台收件箱 · 四分钟内六封新消息
- **标题：** 哪一封值得留下
- **触发矛盾：** 咨询者把立项审批和负责人署名说成完整报销流程，但付款栏始终缺失。
- **此刻出现原因：** 主播结案后，节目切片把‘流程都走完了’和空着的支付状态并排放出，后台收件箱立刻挤满。
- **提示题：** 六封消息里，哪一封能带回材料板？
- **材料：** 前四分钟共收到六封：两封只骂小陈，一封索要节目里的追款原话，一封推销‘职场翻盘课’，一封自称法务要求删稿；最后一封来自供应商项目组，对方愿意提交返费表原页。
##### 材料行

- @职场先懂事：新人抢功，现在装受害者
- 匿名：六万八都敢刷，怪谁
- @求原话：你们追报销那句能发我吗，我照着说
- @上岸训练营：三节课教你从背锅到升职
- 自称法务：限节目立即删除相关内容
- 供应商项目组：返费表原页还在，支付状态和收款账户仍为空

- **能证明：** 供应商项目组愿意提供返费表原页；原页的支付状态和收款账户仍为空，不能把旧图说成已付款。
- **仍不能证明：** 不能证明返费最终进了谁的账户，也不能凭其余五封消息判断公司、同事或来信者的真实身份。
- **路线轴：** document-edge
##### 选项

###### 1. 新人抢功，现在装受害者

- **标签：** 新人抢功，现在装受害者
- **是否核心项：** false
- **反馈：** 只骂人，没有来源，也没有一项能核。存档，不回。
- **路线轴：** outer-thread

###### 2. 六万八都敢刷，怪谁

- **标签：** 六万八都敢刷，怪谁
- **是否核心项：** false
- **反馈：** 这是态度，不是材料。存档，不回。
- **路线轴：** outer-thread

###### 3. 把追款原话发我，我照着说

- **标签：** 把追款原话发我，我照着说
- **是否核心项：** false
- **反馈：** 节目可以教她核对单号和回单，不替陌生人写一套拿去套用的台词。
- **路线轴：** caller-credibility

###### 4. 三节职场翻盘课

- **标签：** 三节职场翻盘课
- **是否核心项：** false
- **反馈：** 广告只说明有人趁热招生，不能反推来电人或公司买过课。
- **路线轴：** identity-wording

###### 5. 自称法务要求删稿

- **标签：** 自称法务要求删稿
- **是否核心项：** false
- **反馈：** 没有主体、姓名和授权。原信留存，交赵律师看，不在直播里对骂。
- **路线轴：** process-control

###### 6. 供应商项目组愿交返费表原页

- **标签：** 供应商项目组愿交返费表原页
- **是否核心项：** true
- **矛盾：** 旧截图始终没有支付状态；能核的是原页，不是收件箱里谁嗓门大。
- **反馈：** 请对方保留原文件和发送记录。它只能确认支付状态仍空着，返费去了谁的账户还不知道。
- **路线轴：** document-edge

##### reply Choices

###### 1. 不回，先归档

- **内部 ID：** inbox-no-reply
- **标签：** 不回，先归档
- **action Only：** true
- **路线轴：** process-control
- **aftertaste：** 六封都留在后台，不给骂声、广告和套话的人续一轮流量。

###### 2. 留原件和发送记录

- **内部 ID：** inbox-preserve-originals
- **标签：** 留原件和发送记录
- **action Only：** true
###### 授予库存

- work-inbox-originals

- **路线轴：** document-edge
- **aftertaste：** 原信、附件和发送时间一起留存。下一步只核能对上的原页。

###### 3. 把自称法务那封转给赵

- **内部 ID：** inbox-send-zhao
- **标签：** 把自称法务那封转给赵
- **action Only：** true
###### 授予库存

- work-inbox-to-zhao

- **路线轴：** process-control
- **aftertaste：** 那封没有主体和授权的信转给赵律师，直播间不跟它对骂。

###### 4. 回一句：先把六万八还了再说

- **内部 ID：** inbox-fire-back
- **标签：** 回一句：先把六万八还了再说
- **action Only：** true
###### 授予库存

- work-inbox-replied

- **路线轴：** caller-credibility
- **pressure Signal：** drift
- **screen Effect：** patience-drop
- **aftertaste：** 这句回出去了。对方没交原件，只截了你的回复。

#### 2. 部门助理流程样本

- **内部 ID：** work-assistant-flow-sample
- **声纹卡 ID：** case4-department-assistant
- **来源：** department-assistant
- **出现界面：** 后台收到一份流程样本
- **标题：** 部门助理流程样本
- **触发矛盾：** 同事说来不及时，财务还没有发布付款延后通知。
- **此刻出现原因：** 收麦后，部门助理把那天的大群流程样本补给后台。
- **提示题：** 按公司的正常流程，这一单本来还要做哪一步？
- **材料：** 部门助理补充：正常客户活动单先由执行人填预算，个人垫付需要提前报备；供应商走对公时要附报价比较。她说“我只按模板发流程，不判断谁私下说了什么”。
##### 材料行

- 执行人先填预算金额
- 个人垫付需提前报备
- 供应商对公付款需附报价比较
- 助理备注：我只按模板发流程，不判断谁私下说了什么

- **能证明：** 群流程发过，后续私聊绕开了它。
- **仍不能证明：** 不能证明助理知道垫款，也不能证明老板知情。
- **路线轴：** process-control
##### 选项

###### 1. 个人垫付需提前报备

- **标签：** 个人垫付需提前报备
- **是否核心项：** false
- **矛盾：** 正常流程要求个人垫付提前报备，这单却被挪到私聊里。
- **反馈：** 她第一夜已经承认自己看过报备要求。这里新多出来的是对公付款还要比较报价。
- **路线轴：** process-control

###### 2. 我只按模板发流程

- **标签：** 我只按模板发流程
- **是否核心项：** false
- **反馈：** 助理在给自己留痕。她那条‘收到’能证明流程发过，谁让它转进私聊，得看后面的时间。
- **路线轴：** caller-credibility

###### 3. 供应商对公付款需附报价比较

- **标签：** 供应商对公付款需附报价比较
- **是否核心项：** true
- **矛盾：** 同事用“比价来不及”让她改刷个人卡，直接绕开了公开流程里的报价比较。
- **反馈：** 这句能解释为什么偏要她的卡：刷个人卡以后，当天不用把报价比较放进对公流程。它和供应商返利仍是两回事。
- **路线轴：** money-flow

##### reply Choices

###### 1. 请在群里补预算确认

- **内部 ID：** ask-public-budget
- **标签：** 请在群里补预算确认
###### 授予库存

- fetch-public-budget

###### 2. 先不催助理

- **内部 ID：** let-it-go
- **标签：** 先不催助理
- **立场变化：** defensive

#### 3. 领导的活动总结批注

- **内部 ID：** work-leader-recap-note
- **声纹卡 ID：** case4-leader
- **来源：** leader-note
- **出现界面：** 后台收到活动总结批注
- **标题：** 领导的活动总结批注
- **触发矛盾：** 领导只确认结果和署名，没有确认垫款与流程责任。
- **此刻出现原因：** 收麦后，有人把活动总结表上的批注截给后台。
- **提示题：** 这条批注里，哪一句最说明领导看见的是结果，不是钱路？
- **材料：** 领导批注：“客户反馈不错，这次活动负责人写小陈；流程该补的补齐。别让这点流程问题影响部门这季度的成绩。”批注里没有垫款金额、付款账户、供应商联系人。
##### 材料行

- 客户反馈不错
- 这次活动负责人写小陈
- 流程该补的补齐
- 别让这点流程问题影响部门这季度的成绩
- 活动总结表末栏｜出了问题先找活动负责人
- 未出现：垫款金额、付款账户、供应商联系人

- **能证明：** 领导的批注写明咨询者负责活动，但没有核对垫款和资金入口。
- **仍不能证明：** 不能证明领导参与拿钱，只能看出组织层面对结果和数据更敏感。
- **路线轴：** process-control
##### 选项

###### 1. 这次活动负责人写小陈

- **标签：** 这次活动负责人写小陈
- **是否核心项：** true
- **矛盾：** 领导批注写明咨询者负责活动，却没有同步确认资金入口。
- **反馈：** 这句把她写进责任位，却没把钱路交给她。
- **路线轴：** identity-wording

###### 2. 客户反馈不错

- **标签：** 客户反馈不错
- **是否核心项：** false
- **反馈：** 结果好是真的，但它解释不了垫款为什么回不来。
- **路线轴：** outer-thread

###### 3. 别影响部门这季度的成绩

- **标签：** 别影响部门这季度的成绩
- **是否核心项：** false
- **反馈：** 这句露出领导的顾虑，但眼前先要问：负责人写了，资金入口为什么没写。
- **路线轴：** process-control

###### 4. 出了问题先找活动负责人

- **标签：** 出了问题先找活动负责人
- **是否核心项：** false
- **反馈：** 负责人姓名和出了问题先找谁写在同一栏。确认以前，这一行她该看见。
- **路线轴：** process-control

### 文档原件

#### 1. 她整理的七条报销记录

**她整理的七条报销记录**

七行最多圈三行。先分开看：哪一行只是活动立项，哪一行才出现正式报销或付款凭证。

- **时间格式：** relative
- **表格字段：** date（时间）；kind（来源）；party（人物／字段）；memo（原文／状态）

| 行 | 时间 | 来源 | 人物／字段 | 原文／状态 |
| --- | --- | --- | --- | --- |
| q01 | 前一天 14:05 | 群公告 | 部门助理 | 预算先填金额；个人垫付需报备；供应商对公付款需附报价比较 |
| q02 | 前一天 14:22 | 私聊 | 该同事 | 比价来不及；先别在大群问预算，用个人卡先刷，活动结束再补报备 |
| q03 | 活动当天 | 刷卡 | 咨询者 | 客户答谢会的场地与礼品费刷进个人信用卡 |
| q04 | 活动前一天通过；活动后至次日重发 | 审批截图 | 该同事 | 同一张旧立项页共发送三次；单号为 LX-2407-018 |
| q05 | 九天后 | 财务群通知 | 财务 | 供应商付款本月统一延后 |
| q06 | 第二天下午 | 财务窗口核对 | 正式报销申请编号 | 未显示；现有 LX 编号只能查询活动立项 |
| q07 | 截至第二晚 | 公司付款缺失字段 | 付款回单／预计付款日期 | 两项均未显示；公司抬头发票原件仍在咨询者手里 |

- **内部 ID：** case4-payment-ledger
##### 逐行追问

###### q02

###### 1. q02 1

**林旭阳：** 这条私聊比财务通知早了几天？

**咨询者：** 九天。他让我别问预算的时候，财务还没说要延后。是我们先躲开了群聊，不是财务先慢。

- **矛盾：** 同事让咨询者避开公开预算确认，发生在财务通知延后之前。
- **路线轴：** process-control
###### logic Contract

- **premise Anchor：** 比价来不及；先别在大群问预算，用个人卡先刷
- **source Kind：** quoted-message
- **source Proves：** 该私聊发生在财务延后通知之前九天。
- **source Does Not Prove：** 时间差不能单独证明同事当时已经知道财务会延后。
- **answer Anchor：** 是我们先躲开了群聊
- **answer Adds：** 咨询者确认绕开公开流程的决定早于财务方面的官方说法。
- **next Legal Question：** 可以继续问审批和付款的关系，不能倒推同事在十四点二十二分已经预谋不还垫款。

###### q04

###### 1. q04 1

**林旭阳：** 这张图什么时候批的，批的到底是什么？

**咨询者：** 活动前一天批的活动立项，编号是 LX 开头。不是报销单，也没有报销申请编号。

- **矛盾：** 三次发送的都是活动立项审批页，不能证明个人垫款已经提交报销。
- **路线轴：** money-flow
###### logic Contract

- **premise Anchor：** 同一张活动立项审批页共发送三次
- **source Kind：** document-readout
- **source Proves：** 三次发送的是活动前一天已经通过的同一张活动立项审批页，单据编号以 LX 开头。
- **source Does Not Prove：** 立项审批不能证明个人垫款已经创建报销申请，也不能单独证明对方故意隐瞒。
- **answer Anchor：** 不是报销单
- **answer Adds：** 咨询者按单据类型和编号重读了截图。
- **next Legal Question：** 可以索要正式报销申请编号、发票提交记录和预计付款日期。

###### q06

###### 1. q06 1

**林旭阳：** 财务窗口能不能用这串 LX 编号查到你的正式报销？

**咨询者：** 查不到。财务说这是活动立项编号，我的报销申请编号还没有。

- **矛盾：** 现有 LX 编号只能查询活动立项，不能对应咨询者的正式报销申请。
- **路线轴：** document-edge
###### logic Contract

- **premise Anchor：** 现有 LX 编号只能查询活动立项
- **source Kind：** document-readout
- **source Proves：** 财务窗口无法用 LX 编号查询到咨询者的正式报销申请。
- **source Does Not Prove：** 查不到申请编号不能单独证明公司拒绝报销，也不能证明同事另建过申请。
- **answer Anchor：** 我的报销申请编号还没有
- **answer Adds：** 咨询者确认现有编号属于活动立项，正式报销仍缺少可追踪的申请编号。
- **next Legal Question：** 可以要求先创建正式报销并取得申请编号，再问预计付款日期。

##### 跨行追问

###### 1. 跨行追问 1

**林旭阳：** 公开流程刚写完对公要比价，他为什么十七分钟后就让你改刷个人卡？

**咨询者：** 他说比价来不及，活动不能等。可财务九天以后才说延后。当天绕开比价，是他让我这么做的，也是我自己答应的。

###### 表格行

- q01
- q02

- **矛盾：** 公开流程与私下叫停几乎同时出现，绕开预算并非应对财务延误的临时决定。
- **路线轴：** process-control

###### 2. 跨行追问 2

**林旭阳：** 同一张立项页发了三次，能不能说明正式报销已经提交？

**咨询者：** 不能。那串 LX 只能查活动立项，财务那里没有我的正式报销申请编号。

###### 表格行

- q04
- q06

- **矛盾：** 活动立项页被重复发送，仍不能替代缺失的正式报销申请。
- **路线轴：** document-edge

- **最多圈选：** 3
### 对方留言

- **来源：** respondent-note
- **此刻出现原因：** 收麦后，那位同事托人给后台带了话。
六万八我没赖。她问进度时，我手里只有那张立项页，就先发给她了。正式报销还得拿发票去提。活动是她自己要接的，“我来扛”也是她回的，不能全算我逼她。

- **夜 B 预告：** true

### 跨案回声

#### 1. case4 flashback credit transfer

- **内部 ID：** case4-flashback-credit-transfer
- **requires Case Id：** 01-credit
- **quote：** 八万太多，我先让他把账单发来。
- **source Case Label：** 案1
上一通八万还停在转账页，这通六万八已经刷出去了。先问钱现在卡在哪一步。

## 收束与结案

### host Disclosure

- **anchor：** atStageJudgement
你把‘公司一直不给我报销’打进群里时，我第一反应也是生气。可你连正式报销都没提，这句话真发出去，六万八只会继续卡着。

#### lines

##### 1. lines 1

【你把那句没发出去的群消息和活动立项页并排放回屏幕。】

- **host Wound Hook：** 三周没打款，也许只是财务排得慢
### deep Followup

**林旭阳：** 群输入框里那句‘公司一直不给我报销’还在。现在你准备怎么写？

**咨询者：** 发了。周一老板问起来，我就这么答。

#### resistance Beat

##### lines

###### 1. lines 1

**咨询者：** 我先把‘公司一直不给我报销’删了。

###### 2. lines 2

**林旭阳：** 只写你现在能证明的。

###### 3. lines 3

**咨询者：** 六万八是我个人卡刷的，发票原件在我这儿。我要正式报销单号，还有预计付款日期。这样行吗？

###### 4. lines 4

**林旭阳：** 老板问你为什么没走报备呢？

###### 5. lines 5

**咨询者：** 流程表我看见了。我当时想拿负责人，还是答应自己先刷。这句我认。

###### 6. lines 6

**林旭阳：** 好。别省这句。发吧。

- **说明：** 她删掉了无凭证的笼统指控，第一次把刷卡、发票、正式报销申请和自己绕过报备的原因放进同一轮回答。

- **stage Judgement：** ‘流程都走完了’是假话。你手里只有立项页，连正式报销编号都没有。他拿‘来不及’催你刷卡，三个星期后还在发那张旧图。他就是看准你想把这次活动扛下来。六万八是你个人垫的钱。明天拿发票，走正式报销。公司还有返费这一层。钱进了谁的账户，今晚不知道。
### quote Pick Candidates

- 就这一张图，他发了三次
- 我刚当着老板的面说，城市合伙人的招商会我能接
- 我点开了，也回了
- 活动负责人写的是我，付款经办人写的是他

### accusation Choices

#### 1. “就这一张图，他发了三次。”

- **标签：** “就这一张图，他发了三次。”
- **quote Source Scene Id：** work-approval-only
- **责任角色：** respondent
- **主播回应：** 她每次问进度，他都把同一张图发回来。图没变，到账日期也始终没说。

#### 2. “我刚当着老板的面说，城市合伙人的招商会我能接。”

- **标签：** “我刚当着老板的面说，城市合伙人的招商会我能接。”
- **quote Source Scene Id：** work-title-for-advance
- **责任角色：** complainant
- **主播回应：** 想要这个机会就认，没什么丢人的。可他让你当负责人，又让你刷自己的卡，这两件事不能混着说。

#### 3. “我点开了，也回了。”

- **标签：** “我点开了，也回了。”
- **quote Source Scene Id：** work-private-process
- **责任角色：** complainant
- **主播回应：** 14：05 那条报备你看见了，也回了‘收到’。后来把预算问题删掉，这一步你得认。六万八该不该走公司报销，我们再看下一张。

#### 4. “活动负责人写的是我，付款经办人写的是他。”

- **标签：** “活动负责人写的是我，付款经办人写的是他。”
- **quote Source Scene Id：** work-split-ownership
- **责任角色：** both
- **主播回应：** 出了问题先找她，催钱还得找他。她没报备得认，他也别再拿这张表拖着六万八。

### 今晚最后一句

#### 1. 明早先补材料

- **内部 ID：** pragmatic
- **标签：** 明早先补材料
- **主播台词：** 明天到公司，先把刷卡记录和那条消息发进去。有人问为什么没报备，你照实说。
##### lines

###### 1. lines 1

**咨询者：** ……呃，行。我明天早点去。

#### 2. 把机会和六万八分开

- **内部 ID：** affirm
- **标签：** 把机会和六万八分开
- **主播台词：** 你想接活动没问题。可六万八是六万八，别因为怕难看就一直不问。
##### lines

###### 1. lines 1

**咨询者：** ……嗯。

###### 2. lines 2

【停顿】

###### 3. lines 3

**咨询者：** 发完了。手还有点抖。抖完我就去睡。

#### 3. 答应她再打回来

- **内部 ID：** accompany
- **标签：** 答应她再打回来
- **主播台词：** 下周一开会前，你要是又想把那句话删掉，就打过来。
##### lines

###### 1. lines 1

**咨询者：** 你还真知道我会删。

###### 2. lines 2

【停顿】

###### 3. lines 3

**咨询者：** 你们也早点睡吧。

### 正式结案

- **标题：** 旧立项页发了三次
- **结论：** 现有三张截图都是活动立项页，没有正式报销编号和付款回单。她为负责人机会主动提额、回了‘我来扛’；同事让她绕过报备，又用旧图回应催款。六万八仍是公司抬头支出。公司返费进了谁账户，今晚不知道。
#### 场景节拍

##### 1. 接活

- **标签：** 接活
她主动争取负责这次活动，也在私聊里回过“我来扛”。

##### 2. 绕流程

- **标签：** 绕流程
公开流程要求提前报备，同事却让她别在大群问预算。

##### 3. 留下话

- **标签：** 留下话
同事在群里承认六万八由她先垫，却没说月底提交还是付款；她因此没有省掉自己的书面追问。

#### 已确认

- 她看过垫付报备流程，却没有在群里留下预算和还款安排
- 截图通过的是活动立项，编号以 LX 开头，没有报销申请编号
- 发票抬头是公司，原件仍在她手里
- 活动总结写她负责，付款经办仍由同事掌握
- 同事在大群承认六万八由她先垫，但‘月底一起办’没有写明提交时间或付款时间

#### 未决

- 同事是否另行创建过正式报销申请
- 领导是否知道六万八来自她的个人卡
- 月底承诺能否按时兑现
- 各层返费是否实际支付，以及最终进入谁的账户

- **下一步：** 下周一开会前，在公司群里写清六万八由个人信用卡支付，并提交公司抬头发票。拿到正式报销申请编号后，再书面问预计付款日期。

- **story Interlude Recap：** 活动总结写了她负责，六万八却从她自己的卡里划走；下麦后补来的返费表，又把栖行一路上涨的估值照出了另一层问题。
- **followup Twist：** 回拨前，后台多出领导批注；活动立项页、私聊回放和预算时间线也都能重新核对。白天带回哪份材料，第二夜就从哪一处开口。
- **分享卡标题：** 报销截图都发了，钱为什么还没回来？
- **分享卡正文：** 她回过“收到”，也回过“我来扛”；活动总结写了她负责，那张“审批通过”却只是活动立项。六万八进了个人信用卡，正式报销申请仍没有出现。
- **分享题：** 你会先问审批截图，还是先问谁拿了项目署名？
- **作者真相：** 她主动争取活动、看过流程，也回过“我来扛”；同事却让她绕过报备，三个星期里反复拿立项页冒充报销进度。六万八是公司抬头支出，也是她个人先垫的钱，明天拿发票走正式报销。返费表另存，钱进了谁的账户今晚不知道。

## 【编剧资料】事实边界与运行规则

- **内部来电索引：** 她打来问：自己垫出的六万八还没回来；她想追钱，又怕以后再也接不到客户活动。
- **运行时状态：** runtime-loaded
- **texture Pass：** true
### dialogue Presentation

#### speed Tiers

##### strained

- **delay：** 47
- **hold Ms：** 0

##### stalled

- **delay：** 55
- **hold Ms：** 1000

#### blip Pitch Hz

- **host：** 330
- **caller：** 294
- **respondent：** 218

### voice Tics

#### 陈

- 呃
- 就是说

### voice Tic Arc

- **陈：** 全程密,深问答应在群里写明垫款后的最后一句干净

### voice Tic Clean Lines

- 发了。周一老板问起来，我就这么答。

### drift Comments

- 他也许真是急着交差
- 她自己答应刷的,这笔不能全推给公司
- 弱弱问下:垫付报备流程哪里有模板,我司也没有
- 主播喝口水吧,嗓子听着冒烟了
- 刚才谁说眉笔的,链接呢

- **来电媒介：** voice
### caller Intent Profile

- **open Goal：** 把六万八个人垫款写进工作群并追回，同时保住以后独立负责活动的机会。
- **preferred Answer：** 同事绕开流程让她垫钱，公司应当尽快还款，她不必为公开追问付出职业代价。
- **audience Tilt：** 让听众先看到一个被同事压着垫款的新人，不先追问她怎样主动争取活动、怎样删掉预算问题。
- **protected Interest：** 追回六万八、保住负责人署名，也避免老板认定她明知流程仍私下刷卡。
- **default Tactic：** 复述同事和公司的流程词，把自己的决定藏在‘来不及’和‘别人让我做’后面；害怕时句子变短。
- **concession Limit：** 可以承认自己想负责活动、回过‘我来扛’，但不主动承认看过报备要求后仍删掉预算问题。
#### pain Points

##### 1. pain Points 1

- **topic：** 负责人署名与垫款先后
- **threatens：** 会暴露机会是她愿意冒险的重要原因。
- **first Response：** 先只说同事先提垫钱。
- **after Proof：** 私聊原文摆出后才承认看见负责人三个字就答应。
- **minimum Leak：** 承认自己当时没有问报销怎么走。

##### 2. pain Points 2

- **topic：** 删掉预算问题
- **threatens：** 会证明她不是完全不知道流程，而是怕失去机会而主动沉默。
- **first Response：** 先说同事把领导搬了出来。
- **after Proof：** 公开流程与私聊时间对上后，才承认删掉‘预算多少’。
- **minimum Leak：** 承认她不敢在群里问。

##### 3. pain Points 3

- **topic：** 审批页到底批了什么
- **threatens：** 会打破‘报销只是晚几天’的安全说法。
- **first Response：** 只读单据类型和编号，不解释整套流程。
- **after Proof：** 被问报销编号后才承认页面只是活动立项。
- **minimum Leak：** 承认截图上没有报销申请编号。

##### 4. pain Points 4

- **topic：** 工作群里怎样写
- **threatens：** 写得太重可能失去机会，写得太轻又会继续没有记录。
- **first Response：** 先删掉‘公司一直不给我报销’。
- **after Proof：** 在主播逐项追问下写明刷卡人、发票、正式单号和付款日期。
- **minimum Leak：** 承认自己绕过报备，但要求公司给出正式入口。

### 运行时长度计划

- **live Beat Count：** 5
- **material Board Count：** 2
- **backflow Count：** 3
- **truth Boundary Prompt Count：** 6
- **case Specific Pressure：** 终案只让预算时间线和活动立项页承担主证据：第一夜问出公开流程与私聊命令相反，材料板再揭开财务通知晚了九天；第二夜把负责人署名、个人垫款和正式报销入口放到同一条群消息里。供应商返利降为白天可选支线，不再挤进固定对质。
#### what Player Does Besides Read

- 先问两句
- 定向追问
- 中段挂断进幕间
- 幕间核审批页 / 回听私聊 / 重排时间线
- 回拨开场与立场
- 圈报销流转记录
- 核对活动立项页；若走供应商路线，再单独查看返利材料
- 归位事实边界
- 选一句往下追

### 任务画像

- **内部 ID：** audit
- **标签：** 款项卡住了
- **recommended Specialty Id：** audit
- **摘要：** 截图看着完整，钱却没落到该落的位置。

### 路线评论

#### process control

- 入口在谁手里
- 能扛事后面接的是谁的卡

#### document edge

- 三张图有没有变化
- 先别被审批通过带走

#### money flow

- 钱还没落地
- 立项和报销别混着查

#### caller credibility

- 她也想负责这次活动
- 表现机会不是免费午餐

#### active provocation

- 群里那句没说谁还,也没说哪天

### 事实边界

#### 能确认

- 栖行共享科技主营共享充电柜和储物柜，宸直是主要股东之一；公司融资稿持续强调估值和铺设点位增长
- 截图上的单据类型是活动立项，编号以 LX 开头
- 咨询者确实垫了款
- 截图没有显示正式报销申请、付款完成或收款账户
- 发票抬头是公司，原件仍在咨询者手里
- 财务群确实发过供应商付款延后的通知
- 部门助理在大群发过正常预算流程样本
- 公开流程写明供应商对公付款要附报价比较；同事随后以比价来不及为由，让咨询者改用个人卡先刷
- 活动立项在活动前一天已经通过；同事在活动结束后连续三次重发的是这张旧立项页
- 活动总结会上领导确实点名夸了咨询者
- 第二夜同事在大群承认六万八由咨询者先垫，但只说月底一起办
- 案后补来的供应商返费表列出招商主管、区域经理和采购经办三层返费名目

#### 被修剪

- 对方把活动立项审批页发给咨询者，让她以为个人报销已经通过
- 咨询者开场承认自己想负责这次活动，但此前把自己回过“收到”、又在私聊说“我来扛”的主动部分压轻了
- 咨询者原本准备在群里写‘公司一直不给我报销’，却没有同步写出自己还没有提交正式报销、也没有在公开流程里留下个人垫款
- 对方拿延后通知解释公司报销，却一直没有提供付款凭证
- 领导的夸奖被咨询者听成保护伞，也被对方用来让她闭嘴

#### 今晚定不了

- 同事是否另行创建过正式报销申请；现有材料没有申请编号
- 公司是否已经实际付款、收款账户是谁的
- 三层供应商返费分别是否支付、最终账户是谁的
- 老板是否知道真实垫款和对接过程
- 老规矩从哪一年开始、还有谁拿过

### deception Chain

- **owner：** caller
- **protected Purpose：** 让公司和直播间支持追回六万八，同时保住负责人署名和以后的客户活动机会，并尽量不让老板看见她为了表现主动绕过报备、申请临时提额，又把立项页当成报销页等了三个星期的全过程。
#### stages

##### 1. work opportunity left out

- **内部 ID：** work-opportunity-left-out
- **pressure Trigger：** 信用卡账单已经到，她需要先说明六万八为什么会由自己刷出去。
- **surface Version：** 她开场先说同事让自己垫、公司一直没有报销，听起来像临时被人推上去付款。
- **edited Fact：** 她在此前的小会上主动说过这项活动自己能接，也几乎立刻接受了负责人署名和垫款的捆绑。
- **immediate Utility：** 先让直播间认可追款，不让自己的晋升欲望变成同事反击的第一句话。
- **fair Trace：** 她问的不是要不要追回钱，而是追款以后老板还会不会把活动交给她，说明负责人机会从开场就在利害里。
- **player Test：** work-title-for-advance：追问她为什么马上答应，以及垫款和负责人署名在私聊中的先后顺序。
- **forced Revision：** 她承认那时候是真想让老板把活动交给自己，也承认钱在前、负责人署名在后。
- **advice Impact：** 主播既不能把她写成完全被迫，也不能因为她想表现就把公司活动成本算成她个人承担。

##### 2. work process seen

- **内部 ID：** work-process-seen
- **pressure Trigger：** 她把同事说的‘活动后补流程’当成垫款依据，玩家转去核公开报备是否存在。
- **surface Version：** 她说自己以为供应商和预算都由同事负责，回头他会替自己补报备。
- **edited Fact：** 部门助理在十四点零五分发过流程，她点开、看懂大概并回了‘收到’，却没有在群里留预算或个人垫付。
- **immediate Utility：** 把绕开公开入口讲成新人依赖熟手，而不是她为了不显得生疏主动选择沉默。
- **fair Trace：** 她能准确说出流程表的栏目，却一直说自己只是等同事处理。
- **player Test：** work-private-process：公开流程先出现；玩家追问她为什么仍刷个人卡以后，她才交出相反私聊和删预算的动作。
- **forced Revision：** 她承认十四点二十二分收到相反私聊，也承认同事拿领导施压后，自己删掉了预算问题。
- **advice Impact：** 她必须把未报备写进事实经过；这一违规仍不等于放弃六万八的报销主张。

##### 3. work late notice cover

- **内部 ID：** work-late-notice-cover
- **pressure Trigger：** 公开流程已经成立，她需要解释为什么相信十四点二十二分那句‘来不及’。
- **surface Version：** 她把后来的财务延后通知接到活动当天，告诉自己当时私下垫款确实是财务太慢。
- **edited Fact：** 同事让她别在群里问预算发生在前，财务延后通知晚了九天。
- **immediate Utility：** 给自己当时的选择补一个看似客观的外部原因，也替同事保留善意解释。
- **fair Trace：** 她第一次讲两件事时只说‘后来财务真发了’，没有报出九天差。
- **player Test：** work-private-process 与 case4-payment-ledger：把十四点二十二分和九天后的通知按顺序并排。
- **forced Revision：** 她先说‘等一下，时间不对’，随后承认财务当时还没通知，自己已经听同事的话没在群里问。
- **advice Impact：** 财务后来的延后只能解释后续等待，不能替活动当天绕开报备作证。

##### 4. work approval means payment

- **内部 ID：** work-approval-means-payment
- **pressure Trigger：** 账单到期而钱没有回来，她需要证明公司已经接住这笔垫款。
- **surface Version：** 她把三次收到的‘审批通过’当成个人报销已经在走，只是晚几天到账。
- **edited Fact：** 三次都是同一张活动立项页，单据编号以 LX 开头；发票原件还在她手里，正式报销申请没有出现。
- **immediate Utility：** 继续等下去就不用公开承认自己没有掌握正式付款入口，也不会立刻危及负责人署名。
- **fair Trace：** 她说在相册里来回滑‘跟没动一样’，已经意识到三张图没有新增内容，却一直没有读单据类型。
- **player Test：** work-approval-only 与 case4-payment-ledger：夜 A 先问三张图有没有新增内容，收麦后再核单据类型、LX 编号和正式报销入口。
- **forced Revision：** 她承认通过的是活动立项，不是个人报销；公司抬头发票原件仍在自己手里。
- **advice Impact：** 追款先补正式报销申请和编号，再问预计付款日期；不能拿立项页继续等到账。

##### 5. work acknowledgement without record

- **内部 ID：** work-acknowledgement-without-record
- **pressure Trigger：** 同事终于在大群承认六万八由陈先垫，却仍只说月底一起办；待确认的活动总结也没有个人垫款。
- **surface Version：** 她想把这条群消息当成已经留痕，省掉自己再写个人垫款和未报销状态。
- **edited Fact：** 消息没有说月底是提交还是付款；她连正式报销都还没提，输入框里的原稿却已经写成‘公司一直不给我报销’。
- **immediate Utility：** 既保住活动负责人署名，又避免老板追问她为什么明知流程仍私下垫款。
- **fair Trace：** 她一直问写进去会不会失去机会，而不是公司是否应当知道这笔垫款。
- **player Test：** work-group-repayment-message、work-split-ownership 与 deepFollowup：比较群消息、待确认表和她准备发送的具体句子。
- **forced Revision：** 她承认那句群消息还缺正式报销入口，最终把刷卡事实、公司抬头发票、报销申请编号和预计付款日期写进同一条消息。
- **advice Impact：** 结案行动不再是笼统曝光同事，而是先留下准确书面记录，把正式报销入口、申请编号和预计付款日期问进公司群。

### scene

- **name：** 直播连线

### statement Patience

- **night a：** 4
- **night b：** 3

### statement Stages

#### 1. work night a promise

- **内部 ID：** work-night-a-promise
##### scene Indexes

- 0
- 1

- **minimum Review Count：** 2

#### 2. work night a approval

- **内部 ID：** work-night-a-approval
##### scene Indexes

- 2

- **minimum Review Count：** 2

#### 3. work night b credit

- **内部 ID：** work-night-b-credit
##### scene Indexes

- 3

- **minimum Review Count：** 2

## 广告间隙

**老方（语音）：** （嗦面声）刚才贴片再晚十秒，就自己切进来了。

**林旭阳：** 可那六万八也不会自己回来。

**赵律师：** 六万八走正式报销，返费表另存。你也趁广告吃一口。

**老方（语音）：** 栖行那份融资稿我翻到了。押金二十九，一次一块五，维护费和场地分成还没扣。估值那页我没看懂，发你了。

**老方（语音）：** 还有张公开照片：宸直那位坐私人飞机去法国看酒庄。先说好，这就是八卦。

**林旭阳：** 那张照片先别往案子里放。融资稿和返费表留下，我待会儿再看。

**老方（语音）：** 刚才后台有人说，前一通是‘要态度’，这一通是‘想表现、能扛事’。好听话后面怎么都跟着让人掏钱。

**林旭阳：** 这句话先留着吧。几个人说话听着像，也不能就说她们认识。

你掀开保温盒，面已经坨成一团。广告快结束了。

【广告音乐换成一段轻一点的钢琴。】

# 第三幕：彩礼与流水

- **案件 ID：** 03-profile
- **剧情 ID：** education-income-fake-profile
- **内容包原题：** 今日来电：彩礼与流水

## 本案人物

| 角色 | 性格 | 欲望 | 防御动作 | 知识边界 |
|---|---|---|---|---|
| 案三咨询者·林 | 数字化自保的理性派 | 让主播把男方拒绝二十八万八、只交工资账户解释成没有诚意，从而支持她先取得这笔保障；她也默认自己工作和家庭条件更好，男方平时多花钱、多照顾是应该的。 | 先说彩礼是母亲定的，把家境调查说成父母替她操心；只转达金额，不说付款时点、收款账户和额外支出，也不主动计算男方已经承担的饭钱、展票、接送和倾听。 | 知道 MBA 学费由男方本人承担、父母托人查到的普通家境、自己收到的材料、家庭群、完整彩礼条件和父母二十万元的预定用途；不知道对方连续收入、其他账户余额，也不知道宸直能否按约兑付。 |
| 案三咨询者表妹 | 替人递话的亲近晚辈 | 替姐姐把不便亲口说的谢谢送到，也盼两个人先谈一次。 | 只转姐姐准她说的生活安排，不碰材料真假。 | 只知道姐姐告诉她的周末安排与回访意愿，不知道男方收入、学费和资料来源。 |
| 案三相亲对象 | 受冒犯的条件维护者 | 让女方明白自己不是名校本科，却也不是靠家里读 MBA；更要阻止一张工资卡余额被直接当成他接受领证前转账、婚宴首饰另算的证明。 | 用每个局部真实抵挡整体概括的问题。 | 知道自己的项目、缴费、账户和家人整理材料过程；第二夜才从群聊得知女方父母的三十万元在宸直，不知道最终能否兑付。 |
| 案三介绍人 | 嘴快、怕砸媒人的热心撮合者 | 把相亲撮合成，也把谢媒人情办漂亮；两家开始谈彩礼后，又想证明自己只是传话。 | 先划掉不是自己说的那一句，再把没核实的话解释成“想让他们先见一面”。 | 知道两家给她的条件、女方母亲的二十八万八和自己转述过的话；转达彩礼时不知道女方家的三十万元锁在宸直，也不知道父亲准备把其中二十万元只留给女儿本人。 |
| 案三男方表姐 | 护家的感性防守者 | 让相亲继续，也别让家里任何一个人被钉成造假主谋。 | 使用‘大家一起整理’稀释主导者。 | 知道资料如何整理，也知道 MBA 学费由男方本人承担；不知道收入构成，不知道女方家的宸直情况。 |

## 【编剧资料】案件发动机

- **戏剧锚点：** 名校 MBA、女方父母对男方普通家境的私下调查、领证前进女方个人账户的二十八万八、另算的婚宴首饰、只交出一张的工资账户流水、女方家锁在宸直的三十万元和一场礼物插麦
- **为何今晚发生：** 女方家先把男方当成名校本科高材生。问清他是自费读 MBA、父母只是普通上班、家里也帮不上婚房以后，没有把前面的误会当成欺骗，反而借‘替女儿留保障’把彩礼加到二十八万八。条件还包括领证前打进女方个人账户、婚宴和首饰另算。咨询者嘴上说是父母定的，实际上没有叫停；男方明确说拿不出，她仍要求看银行流水。他最后只交出工资账户，期末余额恰好是二十八万六。两家周末见面的饭局因此停住。
### 公开求助

- **类型：** interest
- **求助内容：** 她想让主播判断，男方拒绝领证前支付二十八万八、又只交工资账户，是不是没有诚意；周末还要不要带他见父母。

- **核心物件作用：** 学校图先制造名校本科的误会；父母托人查到他只是后来读 MBA、家庭出身普通后，没有喊被骗，转头借这个落差把彩礼往上加。工资账户流水是在男方说拿不出高彩礼、女方坚持要看账之后出现的，它既暴露女方不肯相信当事人的拒绝，也暴露男方只交一张工资卡、没有说明其他账户。家里群整页截图进一步写明二十八万八的收款账户、支付时点和另算项目，并揭出女方父母的二十万元即使到期也准备先留给女儿本人。
- **咨询者所求：** 咨询者嘴上说自己在意学历和收入是否真实，实际既认可父母按男方普通家境加价，也默认自己工作和家庭条件更好、男方多花钱多安抚是应该的。她想把二十八万八先放进自己的个人账户，婚宴和首饰继续另算；她不愿先说自己的八万四准备留多少，也不愿承认父母的二十万元既未到期、也没有承诺用于婚宴。
- **对方所求：** 对方需要解释名校 MBA 不等于名校本科，也要说明自己已经拒绝二十八万八，为什么后来又只交出工资账户流水；他不愿把其他账户交给相亲对象或直播间，更不愿让一张工资卡余额替自己答应彩礼。
- **第三压力：** 父母把学历换算成家底、母亲用‘女方要留保障’解释单向条件、介绍人替两家传价、男方家催婚，以及直播礼物带来的发言压力。
- **咨询者自利删减：** 咨询者开场承认母亲已经托介绍人问二十八万八，却没有先说父母查到男方家境普通后借机加价、她本人也没有叫停，更没有说自己一直觉得工作和家庭条件胜过男方，因此把他多付饭钱、展票和情绪安抚当成理所应当。她也省掉了这笔钱要在领证前进自己的个人账户、婚宴和首饰另算；自己的八万四和父母未来二十万元都准备先留在女方一侧。
- **公开钩子：** 女方家先以为他是名校本科，知道他自费读 MBA 后，反而认定他有家底，托介绍人问了二十八万八彩礼。他说拿不出，咨询者不信并要求看银行流水；他最后只交出工资账户，期末余额二十八万六。
- **故事概述：** 名校本科的误会没有及时纠正，自费 MBA 又被女方家换算成财力。男方拒绝二十八万八后，女方要求看流水，他却只交工资账户；随后女方家锁在宸直的三十万元也被翻了出来。
- **悬念：** 工资账户流水是真的，女方父亲口头说过到期后给她二十万自己留着；可一张工资卡不能代表男方全部账户，未到期理财已经锁住，眼下拿不出来。二十八万八却要先进入女方个人账户，婚宴和首饰另算，女方一侧的钱没有同样明确的共同用途。
- **线索物件：** MBA 项目与缴费记录、只提供一张的工资账户流水、二十八万八彩礼传话和宸直持有页

## 夜 A：第一次来电

**咨询者：** 主播你好，我想请你帮我听听一件事。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 好，你说。

#### 舞台标记

- **mood：** listening

**咨询者：** 我这周末本来要带相亲对象见父母。今天他突然问我，二十八万八是谁定的，我才知道我妈已经先托介绍人去问了彩礼。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 你之前不知道？

#### 舞台标记

- **mood：** listening

**咨询者：** 不知道。饭店还没订，她已经把数报出去了。上周我才告诉她，男方本科不是她以为的那所名校。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 男方怎么回？

#### 舞台标记

- **mood：** listening

**咨询者：** 他说二十八万八拿不出来，也不能把手里的钱全拿去做彩礼。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 你信了？

#### 舞台标记

- **mood：** listening

**咨询者：** 没信。我让他打流水，他只发来一份工资账户流水。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 上面余额多少？

#### 舞台标记

- **mood：** listening

**咨询者：** 二十八万六。

#### 舞台标记

- **mood：** thinking

### 夜 A · 1｜profile-proof-before-dinner

**林旭阳：** 他把工资账户流水发来以后，你们怎么聊的？

**咨询者：** 他已经说拿不出，我还是让他打了流水。发来以后，我先问：“只有这一张？”过了十几分钟，他才回：“你不是要看收入吗？工资卡最清楚。”我又问其他账户，他没接；到昨晚，我手里就这一张。我把这张转给我妈，她看过。

#### no Clue Reaction

**咨询者：** 我妈怎么想，你得问她。她没跟我解释。

- **interaction Mode：** lineReplay
- **线索职能：** setup
- **错误框架：** 工资账户里有二十八万六，就足以证明男方拿得出二十八万八，也足以代表他的全部家底。
#### 回收目标

- profile-mba-wording
- profile-family-chat-origin

- **说话人 ID：** lin
- **现场疑点：** 男方先说拿不出二十八万八，工资账户却有二十八万六；咨询者把一张卡当成全部家底，男方也没有说明其他账户。
- **矛盾：** 咨询者不相信男方对彩礼的直接拒绝，坚持要求流水；男方只交工资账户，也没有交代这不是全部账户。
- **可靠度：** mixed
- **展示卡片：** daily-profile-deposit
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 你们相亲见了几次？

**咨询者：** 四次。两次饭，一次展，一次他接我下班。节奏不快不慢。

- **source Anchor：** 过了十几分钟

##### 2. 自由追问 2

**林旭阳：** 你跟你妈平时什么都聊吗？

**咨询者：** 大事聊。她比我急。我 28，虚岁 29，她逢人就说我不挑，其实是她挑。上个月她把我照片发给三个介绍人，像素还调高了。我说妈，你这是发简历呢。她说简历怎么了，你爸当年也是我筛出来的。……她真这么说。我当时半天没接上。

- **source Anchor：** 我把这张转给我妈
- **texture Role：** ramble

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 他已经说拿不出二十八万八，你为什么还是不信，非要他把流水打出来？

**咨询者：** 我妈一直这么说。你别只问我，先问他为什么卡上正好二十八万六。

**林旭阳：** 那张卡我会问。可在看流水以前，他已经说拿不出。你信了吗？

**咨询者：** 没有。我当时觉得，他是在跟我压价。

**林旭阳：** 为什么觉得他在压价？

**咨询者：** 二十三万八的学费都是他自己交的。我妈就说，能把这笔钱交清，不可能连彩礼都拿不出。

**林旭阳：** 阿姨这个算法，比银行风控还激进。

- **source Anchor：** 他已经说拿不出
- **玩家所选怀疑方向：** 不信他说拿不出彩礼
- **防备回答：** 我妈一直这么说。你别只问我，先问他为什么卡上正好二十八万六。
###### logic Contract

- **premise Anchor：** 已经说拿不出
- **source Kind：** caller-statement
- **source Proves：** 男方收到二十八万八要求后明确表示拿不出，咨询者随后要求看银行流水。
- **source Does Not Prove：** 男方说拿不出不能自动证明他没有其他资产；自费 MBA 也不能证明他应当或能够支付这笔彩礼。
- **answer Anchor：** 在跟我压价
- **answer Adds：** 玩家追问后，咨询者才承认自己和母亲都把历史学费当成现有财力，因此不相信男方的直接拒绝。
- **next Legal Question：** 可以检查男方后来提供的流水范围，也要问女方家自己愿意拿出多少。

- **矛盾：** 女方家先用历史学费推断男方有钱，再把他的拒绝理解成压价。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** trust-but-verify

##### 2. 关键追问 2

**林旭阳：** 你要看的是他的银行流水，他为什么只发工资账户？

**咨询者：** 我只说了“把流水给我看”，没限定哪张。他发工资卡，我问还有没有别的，他没回。到现在，我手里就这一张。其他账户……我真不知道。

- **source Anchor：** 只有这一张
- **玩家所选怀疑方向：** 只给了工资账户
- **防备回答：** 我问了，他没回。你要说我只看见一张，那就一张。
###### logic Contract

- **premise Anchor：** 只有这一张
- **source Kind：** document-readout
- **source Proves：** 男方只提供工资账户近一个月流水，期末余额为二十八万六。
- **source Does Not Prove：** 一张工资卡不能证明男方其他账户的余额、用途或全部可支配资产。
- **answer Anchor：** 他发工资卡
- **answer Adds：** 咨询者确认自己要求看流水后，男方选择性提供工资账户，并回避了是否还有其他账户。
- **next Legal Question：** 可以追问男方为何选择这张卡，不能猜测未提供账户里一定有钱或一定没钱。

- **矛盾：** 男方把一张真实的工资账户流水放在台前，却把其他账户留在材料之外。
- **是否核心项：** true
- **路线轴：** document-edge
- **路线口气：** trust-but-verify

##### 3. 关键追问 3

**林旭阳：** 你妈妈看到那张工资卡的余额以后，问过这是不是他的全部账户吗？

**咨询者：** 没有。她只盯着那两千块，说：“差这么一点，怎么会拿不出？”我知道那只是工资卡，没提醒她。

###### miss Reaction

**咨询者：** 她看完没跟我说这些。你现在问我，我也说不出她怎么想。

- **source Anchor：** 我把这张转给我妈
- **玩家所选怀疑方向：** 女方家有没有继续追问
- **是否核心项：** false
- **路线轴：** caller-credibility
- **路线口气：** caller-skeptical

#### 压力表演

- **意图钩子：** 条件话被托了一层
- **防备状态：** guarded
##### 表情/听感

- **类型：** blink
她把数字念得很轻，念完没有往下接

### 夜 A · 2｜profile-dinner-pause

**林旭阳：** 第一次正式吃饭时，本科学历说清楚了吗？

**咨询者：** 第一次正式吃饭，介绍人订了窗边。他先问我审计是不是总加班，我问他平时出差多不多。吃到一半，我还是问了：“你发的材料是那所学校，本科也是在那儿读的吗？”他筷子停了一下，才说：“本科不是。我工作以后去读的 MBA，学费二十三万八，是我自己出的。”正好服务员来添水，我没有接着问，之前那句“名校毕业”到底是谁说出来的。

#### no Clue Reaction

**咨询者：** 那顿饭已经够尴尬了。你还想问什么？

- **interaction Mode：** lineReplay
- **线索职能：** misdirect
- **错误框架：** 饭局冷场只是第一次见家长前问得太细，不能说明学历材料有问题。
#### 回收目标

- profile-mba-wording

- **说话人 ID：** lin
- **现场疑点：** 第一次饭局的冷场不是因为问太细，是因为名校这句第一次被拆开。
- **矛盾：** 第一次饭局上问到资料时冷场了十几秒，服务员加水才把话岔过去。
- **可靠度：** mixed
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 他说完那几句话，你当时先记住了哪一句？

**咨询者：** 学费。二十三万八。我脑子里先过的是这个数，本科那句反而没追下去。

- **source Anchor：** 学费二十三万八

##### 2. 自由追问 2

**林旭阳：** 开口问本科以前，你已经觉得那张学校图有问题了吗？

**咨询者：** 还没有。我只是想把介绍人那句“学校好”问得具体一点。结果他一停，我才觉得这事可能没说全。

- **source Anchor：** 本科也是在那儿读的吗

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 他已经承认本科不是那所。你当时为什么没接着问，前面那句“名校毕业”到底怎么来的？

**咨询者：** ……没问。

**林旭阳：** 为什么？

**咨询者：** ‘名校毕业’是我先跟家里说的。再问下去，我妈就知道我没问清。

**林旭阳：** 他又说学费是自己出的，你当时想到什么？

**咨询者：** 觉得他手里应该还有钱。就这个。

- **source Anchor：** 本科不是
- **玩家所选怀疑方向：** 本科更正后她为什么没追问
- **防备回答：** 没问。服务员一来，我就顺势把话停了。
###### logic Contract

- **premise Anchor：** 本科不是。我工作以后去读的 MBA
- **source Kind：** quoted-message
- **source Proves：** 被问本科时，对方承认本科不是该校，并说 MBA 学费由自己承担。
- **source Does Not Prove：** 自费二十三万八能确认当年发生过这笔支出，不能证明他现在积蓄很多。
- **answer Anchor：** 我先跟家里说的
- **answer Adds：** 咨询者没有继续追本科，也把自费 MBA 错当成当前财力的信号。
- **next Legal Question：** 可以核对学校与缴费记录，不能把自费 MBA 直接推成家底丰厚。

- **矛盾：** 第一次饭局上问到资料时冷场了十几秒。
- **是否核心项：** true
- **路线轴：** identity-wording
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 服务员走了以后，你们又聊本科了吗？

**咨询者：** 没有。他说菜快凉了，我也就跟着聊别的。那顿饭是我催着约的，我也怕当场问僵。

###### miss Reaction

**咨询者：** 没有。服务员走了，谁也没再提本科。

- **source Anchor：** 正好服务员来添水
- **玩家所选怀疑方向：** 饭桌上有没有继续谈本科
- **是否核心项：** false
- **路线轴：** caller-credibility
- **路线口气：** softening

##### 3. 关键追问 3

**林旭阳：** 那顿饭谁结的账？

**咨询者：** 他付的，用了团购券和积分。停车费一百多，他问我要不要 AA。单看都没问题。后来再想他的收入，我总会想起那张券。

###### miss Reaction

**咨询者：** 谁结账跟本科有什么关系？我不想算那顿饭。

- **source Anchor：** 第一次正式吃饭
- **玩家所选怀疑方向：** 那顿饭最后是谁买单
- **是否核心项：** false
- **路线轴：** money-flow
- **路线口气：** detour

#### 压力表演

- **意图钩子：** 饭局冷场露出来
- **防备状态：** tense
##### 表情/听感

- **类型：** pause
停了很久才说完

### 夜 A · 3｜profile-caller-repeats-label

**林旭阳：** 你回家以后是怎么跟家里说的？

**咨询者：** 其实“名校毕业”最早也不是他说的。介绍人跟我家说的是：“学校好、收入稳，家里也省心。”我回去以后，把“学校好”说成了“名校毕业”。

#### no Clue Reaction

**咨询者：** 介绍人的话我就听到这些。再让我念，也还是这几句。

- **interaction Mode：** lineReplay
- **线索职能：** missing-edge
- **错误框架：** 只要学校图是真图，“名校毕业”的说法就不算修剪。
#### 回收目标

- profile-mba-wording
- profile-family-chat-origin

- **说话人 ID：** lin
#### 正文后节拍

##### lines

###### 1. lines 1

**林旭阳：** 你把本科学历改过来以后，你爸妈又查了什么？

###### 2. lines 2

**咨询者：** 我爸妈托人去问了。问回来，我妈就一句：“他父母都是普通上班的，老家那套房自己要住，婚房也帮不上。”

###### 3. lines 3

**林旭阳：** 他们说男方骗了你？

###### 4. lines 4

**咨询者：** 没有。她说：“家里帮不上，以后真有事还得你们自己扛。彩礼就多问一点，至少钱先在你手里。”又拿他二十三万八的学费说，他手上不至于没有。

###### 5. lines 5

**林旭阳：** 你怎么回的？

###### 6. lines 6

**咨询者：** 我就说，别一下把人吓跑。可真让她把二十八万八收回来……我没开口。

###### 7. lines 7

**咨询者：** 还有。我把二十三万八学费发进家里群，本来是想把学历说清。我妈只回了一句：‘你别插嘴，我问介绍人。’第二天，二十八万八就传过去了。

- **现场疑点：** 名校本科的误会被纠正后，女方父母查到男方家境普通，却没有主张受骗，反而借普通出身和自费 MBA 把彩礼往上加。
- **矛盾：** 咨询者把父母调查后的加价说成自己无可奈何；她嘴上劝了一句，却没有让二十八万八撤回。
- **可靠度：** partial
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 介绍人跟男方家什么关系？

**咨询者：** 他妈的老同事。所以话肯定挑好的说，这我懂。

- **source Anchor：** 介绍人跟我家说的是

##### 2. 自由追问 2

**林旭阳：** “家里省心”这话你怎么理解？

**咨询者：** 就是独生子，爸妈有退休金，平时不用他贴钱。我妈一听这四个字，后面都没细问。

- **source Anchor：** 家里也省心

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 你刚才说，是你把“学校好”说成了“名校毕业”。后来你妈把彩礼加到二十八万八，你拦过吗？

**咨询者：** 没有。我就说了一句，别把人吓跑。

**林旭阳：** 你自己也认这个理由？

**咨询者：** ……我觉得我工作和家里都比他稳一点。他多拿一点，我当时没觉得不对。

- **source Anchor：** 把“学校好”说成了“名校毕业”
- **玩家所选怀疑方向：** 重放‘名校毕业’，问她拦没拦
- **防备回答：** 没说骗。她说家里帮不上，钱更得先留在我手里。我……没叫她收。
###### resistance Beat

###### lines

###### 1. lines 1

**咨询者：** 你把这句单独拎出来，谁都会觉得是我抬的价。

###### 2. lines 2

**林旭阳：** 我只问你，当时有没有拦。

###### logic Contract

- **premise Anchor：** 真让她把二十八万八收回来
- **source Kind：** caller-statement
- **source Proves：** 咨询者知道父母查过男方普通家境，也知道二十八万八来自家境比较和自费 MBA 的财力推断。
- **source Does Not Prove：** 咨询者没有亲自定价，不等于她知情后反对或撤回了这个要求。
- **answer Anchor：** 工作和家里都比他稳一点
- **answer Adds：** 咨询者承认父母没有定性欺骗，随后借普通出身加价；她本人也认可双方条件有高低，所以默许彩礼继续传递。
- **next Legal Question：** 可以继续问这种条件比较如何影响她看待男方平时的花钱和照顾，也要问女方家自己当下能拿出多少。

- **矛盾：** 咨询者已经纠正本科学历，却默许父母把普通出身和自费 MBA 换成新的加价理由。
- **是否核心项：** true
- **路线轴：** active-provocation
- **路线口气：** caller-skeptical

##### 2. 关键追问 2

**林旭阳：** 你把本科说清以后，你妈妈当时怎么回的？

**咨询者：** 她先说我没问清，又托人去问他家。知道他父母普通上班、婚房也帮不上以后，她没再提被骗，只说彩礼得多问一点。第二天她去找介绍人，我没拦。

###### miss Reaction

**咨询者：** 我妈那会儿只催我带人回家。别的我记不清了。

- **source Anchor：** 我回去以后
- **玩家所选怀疑方向：** 母亲听完学历更正后的反应
- **是否核心项：** false
- **路线轴：** caller-credibility
- **路线口气：** caller-skeptical

#### 压力表演

- **意图钩子：** 资料缺口压上来
- **防备状态：** tense
##### 表情/听感

- **类型：** pause
纸张响了一下，她停了两秒

### 中段立场快照

- **段后触发：** 5
- **kicker：** 中段立场快照
- **提示题：** 走到这儿，你最想先问哪件？
- **说明：** 不判分。按下你现在最在意的那件事。
- **after Pick Line：** 家里群里刚换了数字。工资卡发来以后，她又怎么说？
- **continue Label：** 继续听
- **recap Kicker：** 中段立场
#### 选项

##### 1. 她赞成彩礼进自己卡

- **内部 ID：** respondent-fraud
- **标签：** 她赞成彩礼进自己卡
- **摘要：** 二十八万八要领证前转进她个人账户，婚宴首饰另算；她知道这组条件。
- **反馈：** 她不是只替母亲传话。钱进她的卡，条件也有她本人赞成。
- **recap：** 领证前进个人账户、婚宴首饰另算，这组条件由她继续传下去，也由她受益。

##### 2. 父母查完普通家境后加价，她没拦

- **内部 ID：** caller-control
- **标签：** 父母查完普通家境后加价，她没拦
- **摘要：** 学历误会纠正后，父母查到婚房帮不上，没有喊被骗，转头把彩礼往上加。
- **反馈：** 加价发生在家境调查之后。她知道，也没有让母亲把数字收回去。
- **recap：** 父母查完普通家境就提高彩礼；她嘴上怕吓跑人，实际让新数字继续传。

##### 3. 男方用一张工资卡应付审查

- **内部 ID：** market-coauthored
- **标签：** 男方用一张工资卡应付审查
- **摘要：** 他说拿不出以后只交工资账户，没有主动说明其他账户不在这份材料里。
- **反馈：** 一张工资卡不是全部家底。他挑了一张真的材料，让别人自己把范围想大。
- **recap：** 工资账户余额是真的，材料范围也只有这一张；男方没有把其他账户一起交出来。

### 第一次收麦

**咨询者：** 家里群一直在 @ 我。最上面那几句……我得自己再看一遍。今晚先到这儿吧，明天我回来。

#### 舞台标记

- **after Scene Index：** 2
- **主播台词：** 好。你先回群里看看。学费那句往后，每个人到底说了什么，明天回来我们再问。
- **stage Direction：** 电话断了。屏幕上，家里群的新消息还在往外跳。
- **音频提示：** sfx.phone.busy

## 收麦幕间：控台短查

### 幕间行动

- **标题：** 收麦后·控台短查
- **kicker：** 出门前只够打一通短电话，或先把家里群原话调出来。
- **budget：** 1
- **min Actions：** 1
- **max Actions：** 1
- **continue Label：** 进入白天调查
#### actions

##### 1. 先在后台看表妹发来的群聊

- **内部 ID：** profile-family-chat-late
- **标签：** 先在后台看表妹发来的群聊
- **摘要：** 整页聊天由来电人回拨时自己念，后台不替她解释彩礼和宸直。
- **cost：** 1
- **类型：** backflowEarly
- **hook Id：** profile-family-chat-backflow
###### 授予库存

- family-chat-seen

##### 2. 回听饭局学历转向

- **内部 ID：** profile-listen-dinner-pause
- **标签：** 回听饭局学历转向
- **摘要：** 只听问到本科后的停顿和原答，不替任何人改写。
- **cost：** 1
- **类型：** playback
###### 授予库存

- profile-dinner-pause-playback

###### script

- **音频提示：** voice.case3.dinner-pause
- **clip Label：** 回放·第一次饭局
- **clip Line：** ‘本科也是那所学校吗？’杯碟声停了十几秒。男方说：‘本科不是，是后来读的 MBA。学费二十三万八，我自己交的。’随后有人把话题转到停车费。
- **host Note：** 本科答了，前面那句“名校毕业”却没人往回问。

## 白天调查

- **白天开场：** 她把自己收到的学校页、缴费回单和工资账户流水交给节目。介绍人听过转发片段后主动约在茶馆；她代你把问题转给男方家，表姐只肯在门口说明为什么最后只发工资账户。男方回复：这三页可以看，其他账户不公开。后台还收到一张自称表妹的人发来的家里群截图，来电人并没有同意公开，只能先留在麦外。下午最多处理两处。
- **白天行动预算：** 2
- **最少白天场景：** 2
### 地点 1

- **内部 ID：** day-profile-teahouse
- **标签：** 介绍人约的茶馆
- **舞台背景：** day-matchmaking
- **类型：** visit
#### 场景正文

- **access：** 介绍人听过来电人转发的直播片段后主动约见，同意只核自己发过的两段聊天和彩礼传话。
临街的小茶馆里，介绍人坐下没点茶，先把手机推过来。两边家长从昨晚吵到今天，她说自己也烦了，要你把聊天从头看完。

- **路线轴：** process-control
##### cast

- 介绍人
- 你

##### 场景节拍

###### 1. 场景节拍 1

**介绍人：** 你先看聊天。她妈妈现在一口一个我骗她，可“名校毕业”真不是我说的。我当时只说他学校不错。至于“收入挺稳”，是男方家先这么跟我讲的。

###### 2. 场景节拍 2

**你：** 男方家这么讲，你就直接转给她家了？工资、流水，你一样都没见过？

###### 3. 场景节拍 3

**介绍人：** ……没见过。这个是我话说快了。可我也不是只替男方说话。

###### 4. 场景节拍 4

**你：** 你还替女方说过什么？

###### 5. 场景节拍 5

**介绍人：** 我说她做审计，工作稳定，家里事少。男方家问她会不会嫌学历，我还说了句“她不太计较这个”。后来她妈妈听说 MBA 二十三万八是他自己交的，又让我去问二十八万八。我一个字没改，全转了。

###### 6. 场景节拍 6

**你：** 你知道女方家准备给她多少吗？

###### 7. 场景节拍 7

**介绍人：** 不知道。她妈妈只说家里不会亏待女儿。今天她又给我打电话，解释到最后才说，那笔钱还没到期。早知道是这样，我至少会先问一句：现在拿得出来吗？

##### 场景选择

- **提示题：** 你准备把哪部分带回直播间？
###### 选项

###### 1. 把两边聊天都带回去

- **内部 ID：** keep-both-records
- **标签：** 把两边聊天都带回去
- **授予物件：** 两边的完整聊天
- **路线轴：** external-corroboration
###### 选择后节拍

###### 1. 选择后节拍 1

**你：** 两边聊天和彩礼传话我都留着，前后几句也一起截。

###### 2. 选择后节拍 2

**介绍人：** 行。名校毕业我没说，二十八万八也不是我定的。可话都是从我这儿递过去的，这个躲不了。

###### 2. 标出她没问过的两句话

- **内部 ID：** mark-added-claims
- **标签：** 标出她没问过的两句话
- **授予物件：** 她没核实的两句话
- **路线轴：** process-control
###### 选择后节拍

###### 1. 选择后节拍 1

**你：** 我先把“收入挺稳”“不太计较学历”和二十八万八标出来。前两句你没问本人，最后一句你没问女方家现在能拿多少。

###### 2. 选择后节拍 2

**介绍人：** 对。我先把人约到桌上，别的都没问。现在桌还没坐下，钱先把两家掀了。

### 地点 2

- **内部 ID：** day-profile-cousin-doorstep
- **标签：** 男方表姐家门口
- **舞台背景：** day-home
- **类型：** doorstep
#### 场景正文

- **access：** 来电人代你把问题转给男方家；表姐只答应说明工资账户流水的挑选和发送过程，不谈其他账户余额。
门只开到防盗链。表姐没有请你进去，楼道声控灯灭了两次，她仍只肯认一件事。

- **路线轴：** external-corroboration
- **获得物件：** 表姐门口口供
##### cast

- 男方表姐
- 你

##### 场景节拍

###### 1. 场景节拍 1

**男方表姐：** 先说好，他其他账户里有多少，我不知道。学费是他自己交的，回单他已经同意给你们看，别再问我为什么读。

###### 2. 场景节拍 2

**你：** 我只问他发给女方的那份流水。为什么最后只发工资账户？

###### 3. 场景节拍 3

**男方表姐：** 他在家里群问过该发哪张。姑姑说工资卡最规整，别的卡不用给。我还提醒过他，至少跟人家说清这只是工资账户。他最后只把这张发了，没带那句话。

###### 4. 场景节拍 4

**男方表姐：** 我能说的就这些。其他账户是什么、他愿意拿多少，你去问他，我不替他答。

### 地点 3

- **内部 ID：** day-profile-credential-docs
- **标签：** 后台·核验页与工资流水
- **舞台背景：** day-document
- **类型：** document
#### 场景正文

- **access：** 学校页、缴费回单和男方已经发给女方的工资账户流水由男方明确同意查看；其他账户从未提供，也不在授权范围内。家里群截图来自自称表妹的后台账号，来电人尚未同意公开，只能麦外查看，带回直播前必须先问她。
- **document Id：** case3-credential-balance
- **路线轴：** document-edge
- **获得物件：** 双份材料圈注

### 幕间物件映射

- **family chat seen：** 家里群原话
- **profile dinner pause playback：** 饭局停顿回放

## 夜 B：回拨

- **收麦锚点：** 真让她把二十八万八收回来
- **收麦舞台：** 电话断了。屏幕上，家里群的新消息还在往外跳。
- **hangup Audio Cue Id：** sfx.phone.busy
- **主播留话：** 好。你先回群里看看。学费那句往后，每个人到底说了什么，明天回来我们再问。
### 带回物开场（全部分支）

#### 两边的完整聊天

- **台词：** 我把介绍人两边的聊天都看完了。她替两边说过好话，也把我妈那句二十八万八原样转给了男方家。
##### 回拨首次冲突

- **主播台词：** 介绍人传二十八万八的时候，知道你家现在能拿多少吗？
- **咨询者台词：** 不知道。我妈只说不会亏待我，没说那笔钱还在宸直。

#### 她没核实的两句话

- **台词：** 我把介绍人没问过的几句话标出来了。她没看过男方工资，也没问我家现在能拿多少，就把二十八万八递了过去。
##### 回拨首次冲突

- **主播台词：** 先不谈介绍人。你知道家里的钱还在宸直以后，为什么没让妈妈撤回二十八万八？
- **咨询者台词：** 因为我也觉得，他能自己交二十三万八学费，应该拿得出来。

#### 表姐门口口供

- **台词：** 表姐没让进门，只隔着防盗链说，男方家商量过发哪张卡，最后只挑了工资账户。她提醒过要说清范围，那句话没有跟着流水一起发出来。
##### 回拨首次冲突

- **主播台词：** 你看到只有工资账户，为什么还是把它当成他的全部家底？
- **咨询者台词：** 因为我先认定他是在压价。二十八万六又离二十八万八太近，我只顾着看那个数字。

#### 双份材料圈注

- **台词：** 那两份材料我又看了几遍。二十三万八的学费是他自己交的，我当时一听就觉得他手里肯定有钱。后来工资卡上又正好是二十八万六，我和我妈就盯着这个数，谁也没再问这是不是他全部的钱。
##### 回拨首次冲突

- **主播台词：** 你爸说的二十万，是准备拿来付婚宴和首饰吗？
- **咨询者台词：** 不是。他说到期以后给我自己留着。以前我只跟男方说，我家也会给钱。

#### 家里群原话

- **台词：** 家里群我重新从头看了。我妈说，二十八万八领证前进我卡，婚宴首饰另算；我爸下一句却是，宸直到期后拿二十万给我自己留着。
##### 回拨首次冲突

- **主播台词：** 你自己准备拿多少、什么时候拿，为什么没一起告诉他？
- **咨询者台词：** 因为我想先把彩礼谈下来。自己的钱准备怎么用，我那时候根本没跟他说。

#### 饭局停顿回放

- **台词：** 饭局那十几秒我又听了一遍。我问本科，他承认不是那所，又说二十三万八学费是自己交的。我当时已经不再想学历，开始想他是不是很有钱。
##### 回拨首次冲突

- **主播台词：** 一笔花出去的学费，为什么在你们家变成了还能拿出来的彩礼？
- **咨询者台词：** 我妈一说‘他都能拿二十三万八读书’，我就顺着算下去了。可那是已经交掉的学费，不是他卡里还放着的钱。

### 无带回物兜底开场

- **台词：** 我回来了。二十八万八和宸直那三十万，我都愿意说。你白天查到什么了？

### 回拨立场

- **against Caller：** 二十八万八是我妈定的，我知道以后没叫停。今晚我自己答。
- **with Caller：** 家里群我没删。彩礼和宸直那几句，你看到哪儿，就问到哪儿吧。

### 立场快照回应拍

- **respondent fraud：** 昨晚你先问彩礼为什么要进我个人账户。这句没错，我知道，也赞成。今天把完整条件说出来。
- **caller control：** 昨晚你说我爸妈查完他家境普通就加价。我没让他们改数字，这句我认。
- **market coauthored：** 昨晚你问他为什么只交一张工资卡。那张卡是真的，其他账户没在里面。今晚让他自己说。

### 夜 B · 1｜profile-family-chat-origin

**林旭阳：** 你妈妈去找介绍人以前，家里群还说过什么？

**咨询者：** 我妈先发了一句：“彩礼领证前打到她自己的卡里，婚宴和首饰另算。”我爸又说，宸直那三十万九月底到期，拿二十万给我留着。我当时看见了。就这么看过去了。

【材料触发后的重述】 **咨询者：** ……我以前只告诉他，我妈说‘彩礼先问二十八万八’，我家以后也会给我二十万。领证前打进我卡、婚宴和首饰另算，还有那二十万是让我自己留着，这几句我都没说。

- **interaction Mode：** testimonyWall
- **线索职能：** reversal
- **错误框架：** 女方母亲只是替女儿争取一份保障，女方父亲答应的二十万元也会对等地花在两个人身上。
#### 回收目标

- profile-proof-before-dinner
- profile-caller-repeats-label

- **说话人 ID：** lin
#### testimony Wall

- **标题：** 把‘两边对等’拆成时间、账户和用途
- **引子：** 彩礼数字先放一边，逐句确认两边的钱何时到、进谁账户、以后给谁用。
- **split After：** 3
- **mid Summary：** 男方只给了一张工资卡。女方家的钱要等九月底。以后给的钱，不能算今天已经付了。
- **soft Anchor Response：** 三行放在一起已经碰到‘对等’的说法。正式指认仍只能推翻这一句，不能替两家补完整资产。
##### miss Feedback

###### evidence

- 这页只讲一边的钱，碰不到她说的两边对等。她又念起二十八万六。
- 还是单独一页。她抓住空当，把另一边的钱略过去了。

###### statement

- 三行没拿错，原句没对上。她马上退回‘其他账户不知道’。
- 句子又偏了。她不再回答两边的钱准备怎么用。

##### relief Beat

- **listener Id：** @相亲局临时会计
- **评论：** 我只是来看学历，怎么开始算钱放多久了。
- **主播台词：** 我也没想到，但钱什么时候到，确实不能靠气氛带过。

##### statements

###### 1. 证词 01

- **内部 ID：** profile-same-school-label
- **标签：** 证词 01
学校和 MBA 项目都是真的，我只是把‘学校好’说得更满了。

- **press Response：** ‘MBA 确实在那里读。本科……本科我前面说过了。’
- **present Response：** 学历材料能拆标签，放不到两家付款安排的核心矛盾上。

###### 2. 证词 02

- **内部 ID：** profile-male-card-incomplete
- **标签：** 证词 02
他只给工资账户，其他账户有多少，我现在还是不知道。

- **press Response：** ‘别的账户我没见过。我手里只有这张二十八万六。’
- **present Response：** 材料能确认工资卡余额，不能推算他没交出的账户。

###### 3. 证词 03

- **内部 ID：** profile-cash-before-registration
- **标签：** 证词 03
我妈要的是领证前把二十八万八打进我个人账户，婚宴和首饰另算。

- **press Response：** ‘领证前进我卡。婚宴和首饰……另外算。’
- **present Response：** 这句已经照着材料说全，不需要用同一行重复指认。

###### 4. 证词 04

- **内部 ID：** profile-future-family-fund
- **标签：** 证词 04
我爸说九月底以后从宸直三十万里拿二十万给我留着。

- **press Response：** ‘我爸原话就是给我留着。’
- **present Response：** 持有页能确认三十万和到期日，不能把父亲的口头安排提前兑现。

###### 5. 证词 05

- **内部 ID：** profile-equal-conditions
- **标签：** 证词 05
我爸说，宸直到期后拿二十万给我自己留着。我当时看见了。就这么看过去了，后来只跟他说我家也会出钱。

- **press Response：** ‘是给我留着。可这也算我家出了钱吧？’
- **present Response：** 只放其中一行还不够，必须把领证前入账、未来留存和另算项目并排看。

##### acts

###### 1. 把‘两边对等’拆成时间、账户和用途

- **内部 ID：** act1
- **标题：** 把‘两边对等’拆成时间、账户和用途
- **wink Line：** 我把家里群那页打开。
- **wink Tier：** tier3-accomplice
- **引子：** 彩礼数字先放一边，逐句确认两边的钱何时到、进谁账户、以后给谁用。
- **split After：** 3
- **mid Summary：** 男方只给了一张工资卡。女方家的钱要等九月底。以后给的钱，不能算今天已经付了。
- **soft Anchor Response：** 三行放在一起已经碰到‘对等’的说法。正式指认仍只能推翻这一句，不能替两家补完整资产。
###### relief Beat

- **listener Id：** @相亲局临时会计
- **评论：** 我只是来看学历，怎么开始算钱放多久了。
- **主播台词：** 我也没想到，但钱什么时候到，确实不能靠气氛带过。

###### statements

###### 1. 证词 01

- **内部 ID：** profile-same-school-label
- **标签：** 证词 01
学校和 MBA 项目都是真的，我只是把‘学校好’说得更满了。

- **press Response：** ‘MBA 确实在那里读。本科……本科我前面说过了。’
- **present Response：** 学历材料能拆标签，放不到两家付款安排的核心矛盾上。

###### 2. 证词 02

- **内部 ID：** profile-male-card-incomplete
- **标签：** 证词 02
他只给工资账户，其他账户有多少，我现在还是不知道。

- **press Response：** ‘别的账户我没见过。我手里只有这张二十八万六。’
- **present Response：** 材料能确认工资卡余额，不能推算他没交出的账户。

###### 3. 证词 03

- **内部 ID：** profile-cash-before-registration
- **标签：** 证词 03
我妈要的是领证前把二十八万八打进我个人账户，婚宴和首饰另算。

- **press Response：** ‘领证前进我卡。婚宴和首饰……另外算。’
- **present Response：** 这句已经照着材料说全，不需要用同一行重复指认。

###### 4. 证词 04

- **内部 ID：** profile-future-family-fund
- **标签：** 证词 04
我爸说九月底以后从宸直三十万里拿二十万给我留着。

- **press Response：** ‘我爸原话就是给我留着。’
- **present Response：** 持有页能确认三十万和到期日，不能把父亲的口头安排提前兑现。

###### 5. 证词 05

- **内部 ID：** profile-equal-conditions
- **标签：** 证词 05
我爸说，宸直到期后拿二十万给我自己留着。我当时看见了。就这么看过去了，后来只跟他说我家也会出钱。

- **press Response：** ‘是给我留着。可这也算我家出了钱吧？’
- **present Response：** 只放其中一行还不够，必须把领证前入账、未来留存和另算项目并排看。

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** case3-credential-balance:p04+p06+p07
- **statement Id：** profile-equal-conditions
- **selection Reason：** p04、p06、p07 并排后同时暴露时间、账户和用途差异：男方 28.8 万须领证前进女方个人账户，婚宴首饰另算；女方 20 万只是九月底后的口头安排且给女儿自己留着。这比单看 28.6 万余额更能把‘验诚意’的 A 面翻到条件并不对称的 B 面，同时保留男方其他账户未知。
###### material Cards

###### 1. 领证前 28.8 万 × 未来 20 万 × 婚宴首饰另算

- **内部 ID：** case3-credential-balance:p04+p06+p07
- **类型：** 资金边界对照
- **标签：** 领证前 28.8 万 × 未来 20 万 × 婚宴首饰另算
- **excerpt：** 前者进女方个人账户；后者九月底后给女儿留着；婚宴首饰不含在 28.8 万内。
- **source Label：** 学历、彩礼与两家资金边界
###### source Row Ids

- p04
- p06
- p07

###### 2. 期末余额 ¥286,000

- **内部 ID：** case3-credential-balance:p03
- **类型：** 工资账户
- **标签：** 期末余额 ¥286,000
- **excerpt：** 只是一张工资账户；其他账户未提供。
- **source Label：** 学历、彩礼与两家资金边界

###### 3. 宸直产品 ¥300,000／09 30 到期

- **内部 ID：** case3-credential-balance:p05
- **类型：** 持有页
- **标签：** 宸直产品 ¥300,000／09-30 到期
- **excerpt：** 能确认持有与到期，不能确认未来二十万已经支付。
- **source Label：** 学历、彩礼与两家资金边界

- **咨询者台词：** ……对。那二十万还没到，也不是拿来办婚礼的。
- **主播台词：** 对，没到，也不是婚礼钱。男方那边却要领证前把二十八万八打进你的卡，婚宴首饰另算。你还要说两边一样吗？
- **boundary Line：** 三行只推翻‘条件对等’，不判断彩礼应不应该给，也不推定男方其他账户余额。
- **矛盾：** 咨询者把时间、账户和用途不同的两家资金安排说成对等条件。
- **路线轴：** process-control
- **continue Label：** 把两家的条件逐项说清

###### 2. 把‘我家就是这么算’拆开

- **内部 ID：** act2
- **status Label：** 她改口了 · 第二段说法
- **标题：** 把‘我家就是这么算’拆开
- **引子：** 她认下两边资金安排不对等，转而把要求解释成自家检验诚意的规矩。第二段仍可自由追问、普通出示；正式指认另有两次机会。
###### opener Fact Keywords

- 二十八万八
- 二十万
- 不对等

###### opener Lines

###### 1. opener Lines 1

**咨询者：** 行，二十八万八和以后那二十万，不是同一时间，也不是一个用途，我认。可我家一直觉得，结婚前男方肯不肯先把钱拿出来，就是态度。我们查过他家，条件普通，他又只给了一张二十八万六的工资卡。就差两千，我当然会觉得他不是没有，是不肯。

###### 2. opener Lines 2

**林旭阳：** 那你就回答一个问题：查完他家以后，二十八万八怎么成了‘态度’？

###### 3. opener Lines 3

**咨询者：** 我爸妈查完，觉得他家帮不上什么，可他能自己交二十三万八学费，工资卡又有二十八万六。我妈就说，先拿二十八万八，至少证明他真想结婚。我当时也赞成。现在你们说两边不对等，我听见了，可我还是觉得只差两千，他是在拿态度跟我耗。

- **revised Frame：** 她承认两家资金不对等，又把单方先付款包装成自家一贯的诚意算法，并用一张工资账户截图替男方解释支付能力和动机。
- **split After：** 2
- **mid Summary：** 她不再说两边对等，改用家里的规矩解释先付款。现在只看工资卡能不能替男方回答‘肯不肯’。
###### relief Beat

- **listener Id：** @相亲先看计算器
- **评论：** 差两千开始算态度了。
- **主播台词：** 先别替截图算心情，它只会报余额。

###### miss Feedback

###### evidence

- 这页没回答工资卡能不能替人表态。男方在旁边问：‘又拿她家的钱算我？’
- 男方开口了：‘别拿另一张表替我答应二十八万八。’

###### statement

- 工资卡页没错，句子偏了。男方只回：‘那不是我答应转钱。’
- 男方把话截住：‘卡上有钱，不等于我要按你家的数转。’

- **soft Anchor Response：** 工资账户余额碰到了她对‘差两千就是态度’的判断。正式指认只能拆这个推断，不能替男方补资产。
###### comparison

###### 1. comparison 1

- **statement Id：** profile-same-school-label
- **status：** 她收回了

###### 2. comparison 2

- **statement Id：** profile-male-card-incomplete
- **status：** 变了说法

###### 3. comparison 3

- **statement Id：** profile-cash-before-registration
- **status：** 变了说法

###### 4. comparison 4

- **statement Id：** profile-future-family-fund
- **status：** 变了说法

###### 5. comparison 5

- **statement Id：** profile-equal-conditions
- **status：** 被打破

###### statements

###### 1. 改口 01

- **内部 ID：** profile-family-rule-proves-attitude
- **标签：** 改口 01
我家规矩就是先看他愿不愿意拿出来。他工资卡有二十八万六，只差两千，不是拿不出，就是不肯。

- **press Response：** ‘就差两千。你让我怎么不往态度上想？’
- **present Response：** 要拆这句，得回到账户页写了什么、没写什么，不能拿彩礼数字互相顶。

###### 2. 改口 02

- **内部 ID：** profile-other-accounts-still-unknown
- **标签：** 改口 02
他其他账户有多少我还是不知道，我也不能说他全部资产就这一张卡。

- **press Response：** ‘别的账户我不知道。可这张卡上的二十八万六总是真的。’
- **present Response：** 现有材料只列一张工资账户，放在这里是在守边界，不是矛盾。
- **survives From Act1：** profile-male-card-incomplete

###### 3. 改口 03

- **内部 ID：** profile-payment-rule-stated
- **标签：** 改口 03
我妈要他领证前把二十八万八打进我卡，婚宴首饰另算，这就是她开出的条件。

- **press Response：** ‘领证前进我卡，婚宴首饰另算。是我家开的条件，我没说他答应了。’
- **present Response：** p04 和 p07 能核对条件本身，不能证明这套条件合理或不合理。
- **survives From Act1：** profile-cash-before-registration

###### 4. 改口 04

- **内部 ID：** profile-family-fund-remains-future
- **标签：** 改口 04
我爸那二十万要等九月底以后，而且是给我留着，不算领证前已经出了。

- **press Response：** ‘九月底以后，给我留着。现在确实还没到。’
- **present Response：** 持有页只能确认到期日，放在这里不会多出一笔已经支付的钱。
- **survives From Act1：** profile-future-family-fund

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** case3-credential-balance:p03
- **statement Id：** profile-family-rule-proves-attitude
###### boundary Line Key Phrases

- 不证明他能安全转出
- 不替他解释拒绝原因

- **selection Reason：** p03 是她用来判断男方态度的同一张工资账户页；页面只给出 28.6 万期末余额并明确其他账户未提供，最适合打穿‘只差两千所以不是不能、只是不肯’的新承重推断，同时不否认她家可以提出自己的规则。
###### material Cards

###### 1. ‘只差两千，不是拿不出，就是不肯’

- **内部 ID：** case3-credential-balance:p08
- **类型：** 介绍人转发页
- **标签：** ‘只差两千，不是拿不出，就是不肯’
- **excerpt：** 母亲先发给介绍人；介绍人原样转回；咨询者回复‘嗯，我也觉得是态度’。这是转述，不是银行字段。
- **source Label：** 学历、彩礼与两家资金边界 p08

###### 2. 期末余额 ¥286,000 · 仅一张账户

- **内部 ID：** case3-credential-balance:p03
- **类型：** 工资卡覆盖范围
- **标签：** 期末余额 ¥286,000 · 仅一张账户
- **excerpt：** 06-01 至 06-20 的期末余额；其他账户未提供，也没有可支配用途说明。
- **source Label：** 学历、彩礼与两家资金边界 p03

###### 3. 宸直产品 ¥300,000／09 30 到期

- **内部 ID：** case3-credential-balance:p05
- **类型：** 持有页
- **标签：** 宸直产品 ¥300,000／09-30 到期
- **excerpt：** 这是女方父母的未来资金边界，不能解释男方工资卡的可支配性。
- **source Label：** 学历、彩礼与两家资金边界

###### 4. 领证前转入女方个人账户 ¥288,000

- **内部 ID：** case3-credential-balance:p04
- **类型：** 条件原文
- **标签：** 领证前转入女方个人账户 ¥288,000
- **excerpt：** 能确认女方家开出的条件，不能把二十八万六余额直接改写成男方态度。
- **source Label：** 学历、彩礼与两家资金边界

- **咨询者台词：** ……截图只写了卡里有二十八万六。那两千是拿不出，还是他不愿意，卡上没写。
- **主播台词：** 卡上差两千，跟他的态度没关系。截图也没写他肯不肯转。你说‘只差两千就是态度’，这句话得收回去。
- **boundary Line：** p03 只推翻‘余额接近要求就能证明不肯’；不证明他能安全转出二十八万八，不替他解释拒绝原因，也不补全其他账户。
- **矛盾：** 咨询者承认两家条件不对等后，又用单一工资账户余额把男方的支付能力和态度说成已知。
- **路线轴：** process-control
- **continue Label：** 把规矩和事实边界分开

#### decisive Present

- **max Attempts：** 2
- **evidence Id：** case3-credential-balance:p04+p06+p07
- **statement Id：** profile-equal-conditions
- **selection Reason：** p04、p06、p07 并排后同时暴露时间、账户和用途差异：男方 28.8 万须领证前进女方个人账户，婚宴首饰另算；女方 20 万只是九月底后的口头安排且给女儿自己留着。这比单看 28.6 万余额更能把‘验诚意’的 A 面翻到条件并不对称的 B 面，同时保留男方其他账户未知。
##### material Cards

###### 1. 领证前 28.8 万 × 未来 20 万 × 婚宴首饰另算

- **内部 ID：** case3-credential-balance:p04+p06+p07
- **类型：** 资金边界对照
- **标签：** 领证前 28.8 万 × 未来 20 万 × 婚宴首饰另算
- **excerpt：** 前者进女方个人账户；后者九月底后给女儿留着；婚宴首饰不含在 28.8 万内。
- **source Label：** 学历、彩礼与两家资金边界
###### source Row Ids

- p04
- p06
- p07

###### 2. 期末余额 ¥286,000

- **内部 ID：** case3-credential-balance:p03
- **类型：** 工资账户
- **标签：** 期末余额 ¥286,000
- **excerpt：** 只是一张工资账户；其他账户未提供。
- **source Label：** 学历、彩礼与两家资金边界

###### 3. 宸直产品 ¥300,000／09 30 到期

- **内部 ID：** case3-credential-balance:p05
- **类型：** 持有页
- **标签：** 宸直产品 ¥300,000／09-30 到期
- **excerpt：** 能确认持有与到期，不能确认未来二十万已经支付。
- **source Label：** 学历、彩礼与两家资金边界

- **咨询者台词：** ……对。那二十万还没到，也不是拿来办婚礼的。
- **主播台词：** 对，没到，也不是婚礼钱。男方那边却要领证前把二十八万八打进你的卡，婚宴首饰另算。你还要说两边一样吗？
- **boundary Line：** 三行只推翻‘条件对等’，不判断彩礼应不应该给，也不推定男方其他账户余额。
- **矛盾：** 咨询者把时间、账户和用途不同的两家资金安排说成对等条件。
- **路线轴：** process-control
- **continue Label：** 把两家的条件逐项说清

#### revised Version Triggers

##### document Rows

- case3-credential-balance:p04

##### 带回物开场

- 家里群原话

#### 正文前节拍

##### lines

###### 1. lines 1

**咨询者：** 今天下午，介绍人又来问我。

###### 2. lines 2

【停顿】

###### 3. lines 3

**咨询者：** 男方家想知道，我家除了要二十八万八，准备给我多少。

###### 4. lines 4

**林旭阳：** 你怎么回的？

###### 5. lines 5

**咨询者：** 我没回。我爸妈说以后会给我二十万，可那笔钱现在还在宸直。就算九月底拿出来，他们原话也是给我自己留着。

- **现场疑点：** 女方家要求男方在领证前把二十八万八转进女方个人账户，婚宴和首饰另算；自己的二十万元却要等宸直到期，并先留给女儿本人。
- **矛盾：** 咨询者只说“妈妈问了彩礼”，省掉钱要进自己的卡、婚宴首饰另算；父亲留给她个人的二十万元，又被她说成女方家也会为结婚出钱。
- **可靠度：** partial
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 那顿饭，他算钱时会跟你解释吗？

**咨询者：** 会。券怎么用、积分抵了多少、停车费怎么 AA，他都说得很清楚。我当时觉得这叫会过日子。

- **source Anchor：** 我当时看见了

##### 2. 自由追问 2

**林旭阳：** 你爸那二十万要等到九月底。彩礼为什么非得领证前进你的卡，不能等两边的钱都能拿出来再谈？

**咨询者：** 我问过。我妈说：“他先把彩礼给了，咱家的钱九月底到期再说。”她不肯等。我那时候听着，也没觉得哪里不对。

- **source Anchor：** 九月底到期

##### 3. 自由追问 3

**林旭阳：** 你妈现在什么态度？

**咨询者：** 就一句：『过了年你就 29 了，先别把人得罪死。』……这话她今年说了四回。我记着次数呢。你看，职业病。

- **source Anchor：** 我妈先发了一句

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 你把二十八万八告诉男方时，有没有把“领证前进你卡、婚宴和首饰另算”也一起说清楚？

**咨询者：** 没有。只发了二十八万八。

**林旭阳：** 后面那几条为什么不一起发？

**咨询者：** 我怕他看完，周末这顿饭就不去了。

**林旭阳：** 那你自己同意这些条件吗？

**咨询者：** ……同意。彩礼先到我卡里，我才踏实。

- **source Anchor：** 彩礼领证前打到她自己的卡里
- **revised Source Anchor：** 婚宴和首饰另算
- **玩家所选怀疑方向：** 她没有说全的彩礼条件
- **防备回答：** 我只把二十八万八发给他。后面的……我当时觉得还没谈到，不用一起说。
- **answer Requires Revised Version：** true
###### logic Contract

- **premise Anchor：** 彩礼领证前打到她自己的卡里
- **source Kind：** quoted-message
- **source Proves：** 家里群写明女方家的完整要求包括领证前入个人账户，婚宴和首饰另算。
- **source Does Not Prove：** 女方家提出条件不能证明男方已经同意，也不能把拒绝解释成欺骗或没有诚意。
- **answer Anchor：** 没有
- **answer Adds：** 咨询者承认自己向男方只转达了彩礼金额，没有说全收款账户、支付时点和另算项目，而且她本人赞成这组条件。
- **next Legal Question：** 可以继续问咨询者和父母各自准备拿多少钱、用于哪些项目，不能让她继续把个人保障和共同婚礼开支混说。

- **矛盾：** 咨询者把自己赞成的一组单向条件压成母亲报出的一个数字。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 你爸说以后给你二十万。那笔钱是拿来付婚宴，还是给你自己留着？

**咨询者：** 我爸原话，是给我自己留着。

**林旭阳：** 你跟男方怎么说的？

**咨询者：** 我说我家也会出二十万。

**林旭阳：** “给你留着”说了吗？

**咨询者：** 没有。

- **source Anchor：** 拿二十万给我留着
- **玩家所选怀疑方向：** 女方家的二十万准备怎么用
- **是否核心项：** false
- **路线轴：** money-flow
- **路线口气：** detour

#### 压力表演

- **意图钩子：** 彩礼问到了女方家的钱
- **防备状态：** guarded
##### 表情/听感

- **类型：** pause
她说“等一下”，随后传来几下点按声

### 场间实时反压

- **内部 ID：** profile-family-chat-blowup
- **类型：** emotionalChoice
- **cost：** 0
- **after Scene Index：** 5
- **from：** 家里群反转
#### trigger Any

##### document Rows

- case3-credential-balance:p04

##### 带回物开场

- 家里群原话

#### lines

##### 1. lines 1

**咨询者：** 等一下。那页群聊……是我表妹发给你们的？

##### 2. lines 2

【停顿】

##### 3. lines 3

**咨询者：** 她把我家的群发给一个直播间？

##### 4. lines 4

【停顿】

##### 5. lines 5

**咨询者：** 你们等我一下，我要先给她打个电话。

#### choices

##### 1. 这张截图没有经过你同意。后台先删掉，直播里也不说截图内容。你想暂停，随时可以。

- **内部 ID：** soothe
- **direction Label：** 先处理越界截图
- **标签：** 这张截图没有经过你同意。后台先删掉，直播里也不说截图内容。你想暂停，随时可以。
###### lines

###### 1. lines 1

**咨询者：** 后台先删。不是，电话先别断，我把这段说完。播完我再找她。

###### 2. lines 2

【停顿】

- **立场变化：** open
- **路线轴：** caller-credibility
- **路线口气：** reassure
- **recap Aftertaste：** 她发现群聊截图是表妹发来的以后，我先从后台删掉，也没有在直播里念截图内容。她说继续，我们才往下谈。

##### 2. 你可以现在停。我等你处理完，我们再决定要不要继续。

- **内部 ID：** push-back
- **direction Label：** 把暂停权交给她
- **标签：** 你可以现在停。我等你处理完，我们再决定要不要继续。
###### lines

###### 1. lines 1

**咨询者：** 先不打了。她多半跟我妈在一块儿，我现在打过去，最后还是我妈接。你先让我把这段说完。

- **立场变化：** open
- **路线轴：** caller-credibility
- **路线口气：** reassure
- **recap Aftertaste：** 她发现群聊截图没有经过自己同意，我把停不停交给了她。她决定先把这段说完。

##### 3. 我先把直播静音。你想好了，再告诉我继续还是挂断。

- **内部 ID：** silence
- **direction Label：** 先静音，再决定是否继续
- **标签：** 我先把直播静音。你想好了，再告诉我继续还是挂断。
###### lines

###### 1. lines 1

【直播静音。十几秒后，她重新开口。】

###### 2. lines 2

**咨询者：** 继续吧。截图从后台删掉，直播里也别提内容。

- **立场变化：** neutral
- **路线轴：** caller-credibility
- **路线口气：** neutral
- **recap Aftertaste：** 群聊截图的来路露出来以后，我先把直播静音。她重新说继续，我们才恢复声音。

### 场间实时反压

- **内部 ID：** profile-gift-mic-request
- **类型：** interruptToast
- **cost：** 0
- **after Scene Index：** 5
- **from：** 直播礼物
- **声纹卡 ID：** case3-respondent
- **presentation：** gift
#### 唯一核心反转过场

- **内部 ID：** case3-second-mic
- **类型：** reveal
- **过场短标：** 礼物提示亮起
- **标签：** 第二路麦克风接通
- **visual Variant：** second-mic

#### lines

##### 1. lines 1

【金色特效铺开，账号“Z先生”送出“星河”×1。特效还没散，他又申请了连麦。】

##### 2. lines 2

**@先别拿星河当排队券：** 刷这么大一个礼物就能插麦吗

##### 3. lines 3

**男方：** 我是她说的那个人。介绍人把直播片段转给我了，我才进来的。礼物你先收着。

##### 4. lines 4

**男方：** 我只问一句：你家要我领证前把二十八万八打进你的卡，你们家的三十万却要等到九月底，拿到以后还说是留给你自己的。这些话，你有没有一起告诉我？

#### choices

##### 1. 礼物我会退回。你想上麦，就先把愿意公开到哪儿说清楚。

- **内部 ID：** refund-then-scope
- **direction Label：** 退回礼物，再划公开范围
- **标签：** 礼物我会退回。你想上麦，就先把愿意公开到哪儿说清楚。
###### lines

###### 1. lines 1

【礼物特效退下去，后台显示“退款处理中”。】

###### 2. lines 2

**男方：** 行，退吧。可别拿礼物把我的问题也一起退了。她手里那些材料，学校、学费、工资卡，还有彩礼那几句，可以谈。其他账户不公开。她家的钱，也只说群里已经提过的。

- **recap Aftertaste：** 刚才那份礼物我退了。后来接他上麦，是因为两个人都同意把话说开，不是因为他付了钱。
- **立场变化：** defensive
- **路线轴：** process-control
- **路线口气：** firm

##### 2. 礼物先挂着不动，也不算发言权。你先把能公开的范围打在后台。

- **内部 ID：** hold-gift-then-scope
- **direction Label：** 暂挂礼物，先划公开范围
- **标签：** 礼物先挂着不动，也不算发言权。你先把能公开的范围打在后台。
###### lines

###### 1. lines 1

【礼物状态停在“待处理”，第二路麦克风还没接通。】

###### 2. lines 2

**男方：** 范围我打后台了。她已经拿到的学校图、学费单、工资卡，这几页可以；彩礼原话也能谈。其他账户不公开。她家的钱，只说群里那一句。

- **recap Aftertaste：** 礼物还挂在后台待处理。它没替他多买一句，公开范围仍是双方自己划的。
- **立场变化：** neutral
- **路线轴：** document-edge
- **路线口气：** neutral

##### 3. 先别上麦。我先问她愿不愿意跟你同麦，再谈公开哪些材料。

- **内部 ID：** ask-caller-before-mic
- **direction Label：** 先问她是否同意连麦
- **标签：** 先别上麦。我先问她愿不愿意跟你同麦，再谈公开哪些材料。
###### lines

###### 1. lines 1

**咨询者：** 可以，让他上。先听他把那句话说完。

###### 2. lines 2

**男方：** 行。我这边同意谈学校、学费、那张工资卡和彩礼，这几页可以。其他账户不公开。她家的钱也只念群里出现过的。

- **recap Aftertaste：** 我先问了她愿不愿意，才接他进来。礼物能让申请跳到眼前，不能替另一个人点头。
- **立场变化：** open
- **路线轴：** caller-credibility
- **路线口气：** reassure

### 场间实时反压

- **内部 ID：** profile-mediation-consent
- **类型：** interruptToast
- **cost：** 0
- **after Scene Index：** 5
- **from：** 临时双人连麦
- **声纹卡 ID：** case3-respondent
#### lines

##### 1. lines 1

**咨询者：** 我的工资我自己说，存款也由我说。家里群那几句可以念。可我问你要流水，你只发工资卡，没告诉我别的账户不在里面。

##### 2. lines 2

**男方：** 你们查完我家，转头就把彩礼加到二十八万八。我都说拿不出，你还觉得我在压价，非要查收入。你们到底是在谈结婚，还是看我还能拿多少？

##### 3. lines 3

**咨询者：** 二十八万八要在领证前进我卡，婚宴和首饰另算。这个……我也同意。以前没一起告诉你。

##### 4. lines 4

**男方：** 我说拿不出，不是差那两千，是我不接受领证前全打进她个人卡里。你们别再拿那张工资卡——

##### 5. lines 5

**林旭阳：** 先收一下。你不同意，可以说条件，别把一张卡吵成谁骗谁。

##### 6. lines 6

**男方：** 行。二十八万八真要谈，就放共同账户。她家九月底那笔怎么放、婚宴和首饰谁出，也一起写清。只让我先打进她卡里，我不接受。

##### 7. lines 7

**林旭阳：** 你们俩都愿意说，我才继续。礼物不算谁更有理。她先说自己能拿多少，你再说为什么只发工资卡。别再拿一张图，让对方猜剩下的。

### 场间实时反压

- **内部 ID：** profile-weekend-dinner-cancelled
- **类型：** interruptToast
- **cost：** 0
- **after Scene Index：** 5
- **from：** 临时双人连麦
- **声纹卡 ID：** case3-respondent
#### lines

##### 1. lines 1

**男方：** 周末包间的定金我来认。我回去跟我爸妈说，你也跟你家里说。饭先取消吧。我不想带着二十八万八去见你父母。

##### 2. lines 2

**咨询者：** 好。我也得跟家里说清楚：这套条件他没有答应。还有那二十万，我爸原话是给我自己留着，不是拿来付婚宴和首饰。

##### 3. lines 3

**林旭阳：** 那就先取消。你们把自己的钱说清楚，再决定下一步。

### 夜 B · 2｜profile-income-and-card

**林旭阳：** 男方现在承认只发了工资账户。你收到那份流水时，是怎么理解的？

**咨询者：** 工资账户结余二十八万六，只比彩礼少两千；他说‘拿不出’，我就认定他是不想给。直到刚才上麦，他才承认还有其他账户，只是不愿意交出来，里面有多少我不知道。平时饭钱、展票大多是他出，我加班晚他也来接过。我跟我妈吵了，他能听我讲很久；可他一用团购、积分，停车费跟我 AA，我还是会觉得他在跟我算。

#### no Clue Reaction

**咨询者：** 他怎么花钱，我有我的感受。你别一句话替我算完。

- **interaction Mode：** lineReplay
- **线索职能：** payoff
- **错误框架：** 日常节省就能证明收入包装，或者拒绝流水就能证明心虚。
#### 回收目标

- profile-proof-before-dinner
- profile-family-chat-origin

- **说话人 ID：** lin
#### 正文后节拍

##### lines

###### 1. lines 1

**男方：** 你先说我拿不出是在骗你，又让我打流水。我发工资卡，是因为你问的是收入。其他账户是我的私事，我从来没答应全交给你。

###### 2. lines 2

**咨询者：** 我说的是银行流水。你只给工资卡，也没有说其他账户不在里面。你前面说拿不出，卡上又有二十八万六，我当然觉得你是在跟我压价。

###### 3. lines 3

**林旭阳：** 先停一下。今晚看见的只有这张工资卡，其他账户有多少，谁也不知道。他已经说了拿不出二十八万八；卡上差两千，不等于他答应把这笔钱交出来。

###### 4. lines 4

**男方：** 那她家呢？一开口二十八万八，自己准备给她多少？那三十万宸直，为什么现在才说？

###### 5. lines 5

**咨询者：** 我爸妈说以后给我二十万，让我自己留着。

###### 6. lines 6

**林旭阳：** 彩礼呢？

###### 7. lines 7

**咨询者：** 我妈说进我卡，婚宴和首饰另算。

###### 8. lines 8

**林旭阳：** 这些你都说过吗？

###### 9. lines 9

**咨询者：** ……没有。

- **现场疑点：** 男方只交工资账户，女方却把这张卡当成全部家底；女方还要求彩礼先进入个人账户，婚宴和首饰另算，却没有先说明自己一侧愿意承担哪些支出。
- **矛盾：** 男方只用一张工资卡回答收入；女方只说家里以后会给二十万元，没说这笔钱准备留给自己，也没说婚宴和首饰还要男方另付。
- **可靠度：** partial
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 他问你家准备出多少以后，你多久没回？

**咨询者：** 到现在都没回。我爸说的是以后给我二十万，让我自己留着。那笔钱最快也要等九月底。我怕一说，他会问：那婚宴和首饰到底谁出？

- **source Anchor：** 还有其他账户

##### 2. 自由追问 2

**林旭阳：** 你身边有婚后一起管钱的例子吗？

**咨询者：** 我表姐。管得挺好，但她挣得比姐夫多。多百分之三十几吧，具体没算过——不对，我算过。百分之三十七。你看，我就是这样的人。这话我没跟我妈说过。我们家饭桌上，账是不能上桌的。

- **source Anchor：** 平时饭钱
- **texture Role：** ramble

##### 3. 自由追问 3

**林旭阳：** 他现在还给你发消息吗？

**咨询者：** 发。

【停顿】

**咨询者：** 间隔很规律。

- **source Anchor：** 直到刚才上麦

##### 4. 自由追问 4

**林旭阳：** 周末那顿饭，你还想见吗？

**咨询者：** 不知道。

- **source Anchor：** 展票大多是他出

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 二十八万八不含婚宴和首饰。你看到他工资卡只有二十八万六时，有没有想过彩礼给完以后，后面的钱怎么出？

**咨询者：** 我当时就觉得，他还有别的钱。

**林旭阳：** 所以婚宴和首饰，你默认谁出？

**咨询者：** 他家。

**林旭阳：** 跟他说过吗？

**咨询者：** 没说。

- **source Anchor：** 工资账户结余二十八万六
- **玩家所选怀疑方向：** 彩礼之外的钱谁来出
- **防备回答：** 我当时就觉得他还有钱。婚宴首饰，不都是后面再谈的吗？
###### logic Contract

- **premise Anchor：** 婚宴和首饰另算
- **source Kind：** quoted-message
- **source Proves：** 女方家明确把二十八万八与婚宴、首饰分成不同支出。
- **source Does Not Prove：** 另算条件不能证明男方有其他账户、愿意承担后续支出或已经接受这组安排。
- **answer Anchor：** 没说
- **answer Adds：** 咨询者承认自己默认男方另有资金并会承担婚宴与首饰，却没有把这项条件告诉他。
- **next Legal Question：** 可以问咨询者自己现在有多少、愿意为哪些项目出多少；不能用未知账户补齐后续费用。

- **矛盾：** 咨询者要求男方先交一笔个人保障，又默认未知账户承担后续婚宴和首饰。
- **是否核心项：** true
- **路线轴：** caller-credibility
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 他平时一笔一笔算，你就觉得他收入有问题？

**男方：** 你嫌我算得细可以，别拿这个猜我一个月挣多少。

**男方：** 团购和停车费我算得细，是我花钱的习惯。她先觉得我在压价，才把这些全算成收入有问题。

###### miss Reaction

**咨询者：** 我没说团购能证明收入。可每次都算到停车费，我就是不舒服。

- **source Anchor：** 我还是会觉得他在跟我算
- **玩家所选怀疑方向：** 他平时算小钱说明什么
- **是否核心项：** false
- **路线轴：** money-flow
- **路线口气：** softening

#### 压力表演

- **意图钩子：** 条件表面开始松动
- **防备状态：** tense
##### 表情/听感

- **类型：** blink
她翻了两页纸，才重新开口

### 回拨后立场

#### from Snapshot Option Ids

- **respondent fraud：** open
- **caller control：** defensive
- **market coauthored：** neutral

- **default：** neutral
#### lines

- **defensive：** 我差点没打回来。弹幕说我家问得太多，这话我听见了。群聊我带来了，你接着问吧。
- **open：** 我回来了。昨晚挂完电话，我又看了学校图，也去找了介绍人。今天都带来了。
- **neutral：** 我回来了。昨晚群里吵到很晚，我把那几张图又看了一遍。

## 材料、回流与可选追查

### 证据卡

#### 1. 工资账户流水

- **内部 ID：** daily-profile-deposit
- **表现类型：** 工资账户流水
- **标题：** 工资账户流水
- **front：** 06-01 至 06-20；工资账户期末余额 28.6 万。页面没有列出其他账户。
- **detail：** 这页只列一个工资账户：到账和期末余额都在，其他账户和转账授权都没有。
##### targets

- truthWithGap
- sceneHint

- **矛盾：** 男方用真实工资账户回应财力质疑，却把其他账户留在材料之外；女方又把一张卡当成了全部家底。

#### 2. 彩礼传话

- **内部 ID：** daily-profile-scale
- **表现类型：** 聊天原话
- **标题：** 彩礼传话
- **front：** 女方母亲让介绍人先问二十八万八，理由是男方能自己承担二十三万八的 MBA 学费。
- **detail：** 这个数字来自女方母亲，不是介绍人加价；历史学费也不能直接证明当前财力。
##### targets

- truthWithGap

- **矛盾：** 女方母亲把自费 MBA 换算成家底，咨询者知情后没有叫停。

#### 3. 名校毕业

- **内部 ID：** daily-profile-mba
- **表现类型：** 学历材料
- **标题：** 名校毕业
- **front：** 细问才知道是 MBA 项目，本科学历没有一起说。
- **detail：** 图上写的是 MBA，本科另有学校；缴费回单显示二十三万八由本人分三次交清。
##### targets

- halfLie

- **矛盾：** 名校本科的误会被纠正后，自费 MBA 又被换算成了现成家底。

#### 4. 收入和花销

- **内部 ID：** daily-profile-spending
- **表现类型：** 消费细节
- **标题：** 收入和花销
- **front：** 口头收入不错，日常小钱却反复算。
- **detail：** 团购、积分和停车费 AA 能看出他算钱细，看不出他没有收入。
##### targets

- truthWithGap
- sceneHint

- **矛盾：** 男方声称收入和日常花销、抠门细节不匹配。

#### 5. 女方家以后给她的钱

- **内部 ID：** daily-profile-flow
- **表现类型：** 理财持有页
- **标题：** 女方家以后给她的钱
- **front：** 女方父母持有宸直产品 30 万元，页面约定 9 月 30 日到期。
- **detail：** 父亲说到期后给女儿二十万元自己留着；这笔钱现在不能取，也没有承诺用于婚宴和首饰。
##### targets

- sceneHint

- **矛盾：** 女方家要求男方先把钱转入女儿账户，却没有说明自己一侧的钱尚未到期，且准备继续由女儿个人持有。

#### 6. 介绍人分别对两家说的话

- **内部 ID：** daily-profile-introducer
- **表现类型：** 聊天原话
- **标题：** 介绍人分别对两家说的话
- **front：** 给女方家：学校好、收入稳。给男方家：女生稳定、不太计较学历；随后又转去女方母亲的二十八万八。
- **detail：** 介绍人替双方说过没确认的话，也替女方家传了彩礼数字，但数字不是她定的。
##### targets

- halfLie
- sceneHint

- **矛盾：** 介绍人对两边都抬高好处、压低短处，条件版本被介绍链共同加工。

### 材料圈点

#### 1. 学历材料检视

- **内部 ID：** profile-mba-gap
##### revalues

- profile-dinner-pause
- profile-caller-repeats-label

- **标题：** 学历材料检视
- **提示题：** 学校图和缴费回单一起看，最该分开什么？
- **材料：** 学校查询页和三笔缴费记录摆在一起。
##### 材料行

- 校名｜已显示
- 项目｜MBA
- 本科｜未显示
- 学费｜¥238,000｜本人账户分三次支付
- 当前财力｜无法由学费推出

##### 选项

###### 1. 本科经历和当前财力

- **标签：** 本科经历和当前财力
- **是否核心项：** true
- **矛盾：** 咨询者把“学校不错”转述成“名校毕业”，本科学历落差被留在了标签外面。
- **反馈：** MBA 项目和缴费都是真的。可学校图说的是 MBA，回单说的是过去交了多少学费；这两张都说不了本科，也说不了现在的家底。
- **人物反应：** 我原本是想纠正学历，结果我妈看到的全是二十三万八。
- **路线轴：** identity-wording

###### 2. 截图像不像修过

- **标签：** 截图像不像修过
- **是否核心项：** false
- **反馈：** 图片和回单都可以是真的，它们仍然不能证明他现在有多少积蓄。
- **人物反应：** 图是真的，缴费也是真的。是我们把它又往后推了一步。
- **路线轴：** document-edge

###### 3. 介绍人有没有夸张

- **标签：** 介绍人有没有夸张
- **是否核心项：** false
- **反馈：** 介绍人的说法不能替学校图补本科，也不能替缴费回单证明家底。
- **人物反应：** 介绍人只说学校不错。名校毕业和有钱，是我们家自己接出来的。
- **路线轴：** caller-credibility

#### 2. 介绍链原话检视

- **内部 ID：** profile-introducer-double-speak
##### revalues

- profile-introducer-two-prices

- **标题：** 介绍链原话检视
- **提示题：** 介绍人说男方“收入稳”，你先查哪一件事？
- **材料：** 两段聊天保留了发送人和前后文。
##### 材料行

- 给女方家｜学校好、收入稳、家里省心
- 给男方家｜女生稳定、家里不折腾、对学历不会太计较
- 两段都没说明｜每月收入明细、本科信息

##### 选项

###### 1. 她有没有看过工资或流水

- **标签：** 她有没有看过工资或流水
- **是否核心项：** true
- **矛盾：** 介绍人对两边都抬高好处、压低短处，条件版本被介绍链共同加工。
- **反馈：** 介绍人没看过工资，也没看过流水。她凭什么跟你家说‘收入稳’？
- **人物反应：** 我以前以为她手里真有东西。原来她连工资都没见过。
- **路线轴：** process-control

###### 2. 她是不是更偏男方家

- **标签：** 她是不是更偏男方家
- **是否核心项：** false
- **反馈：** 另一段聊天里，她也替女方说过没确认的话。先查“收入稳”从哪儿来的。
- **人物反应：** 我一开始只觉得她偏他。看到另一段才知道，她也替我省掉了麻烦。
- **路线轴：** caller-credibility

###### 3. 她说的“稳定”是多少钱

- **标签：** 她说的“稳定”是多少钱
- **是否核心项：** false
- **反馈：** 她连工资和流水都没见过，现在还谈不上问具体数字。
- **人物反应：** 我后来问过，她连他哪家公司发工资都说不清。
- **路线轴：** money-flow

#### 3. 彩礼条件与两边的钱

- **内部 ID：** profile-income-flow-gap
##### revalues

- profile-proof-before-dinner
- profile-income-and-card

- **标题：** 彩礼条件与两边的钱
- **selection Mode：** priority
- **提示题：** 家里群和账户里有两处没说清。你先带哪一处上麦？
- **材料：** 男方只交了一个工资账户；女方家则要求领证前把彩礼打进女方个人账户，婚宴首饰另算。
##### 材料行

- 女方要求｜看银行流水
- 男方提供｜仅工资账户近一个月｜期末余额 28.6 万
- 男方其他账户｜未提供｜余额与用途未知
- 彩礼条件｜28.8 万｜领证前进入女方个人账户
- 后续支出｜婚宴、首饰｜不包含在 28.8 万内
- 宸直产品｜本金 30 万｜9 月 30 日约定到期
- 女方父亲安排｜到期后给女儿 20 万｜先由女儿自己留着
- 当前可用金额｜未核实

##### 选项

###### 1. 钱何时给、进谁账户、由谁来花

- **标签：** 钱何时给、进谁账户、由谁来花
- **是否核心项：** true
- **矛盾：** 女方要求男方现在把钱转到自己名下，婚宴首饰继续另算；自己和父母的钱却准备以后再拿，并先留在女方一侧。
- **反馈：** 你追着问他还有多少钱。可二十八万八什么时候转、转给谁，你们谈过吗？
- **人物反应：** 我问了他好几遍还有多少钱。可二十八万八什么时候转、转给谁，还有我自己的钱怎么出，我当时都没跟他说。
- **路线轴：** money-flow

###### 2. 男方只交了工资账户

- **标签：** 男方只交了工资账户
- **是否核心项：** true
- **矛盾：** 男方用一张工资账户回答女方要求的银行流水，却没有说明还有其他账户；女方也不能把这一张卡当成他的全部家底。
- **反馈：** 你手里只有这一张工资账户。你当时为什么把它当成了他的全部家底？
- **人物反应：** 我拿到这一张，就当成他全部的钱。他也没告诉我，还有别的账户。
- **路线轴：** money-flow

###### 3. 截图是不是原图

- **标签：** 截图是不是原图
- **是否核心项：** false
- **反馈：** 原图也可能只截到最好看的那一页。
- **人物反应：** 原图。我检查过像素，没修。是我自己想歪了方向。
- **路线轴：** document-edge

### 后台回流

#### 1. 家里群截图

- **内部 ID：** profile-family-chat-backflow
- **声音归属：** document
- **来源：** dm
- **出现界面：** 有人补了一张图
- **标题：** 家里群截图
- **触发矛盾：** 名校本科的误会被纠正后，自费 MBA 又被女方家换算成当前家底。
- **此刻出现原因：** 收麦后，一条私信进来：她表妹也在那个家里群，看了直播，把整页聊天拍了过来。
- **提示题：** 这页家里群里，哪两句话必须连着看？
- **材料：** 她先发：“本科不是那所，是后来读的 MBA。二十三万八，都是他自己交的。”母亲回：“那说明手里不会差。彩礼先问二十八万八，领证前打进她自己的卡。婚宴和首饰另算。”父亲又发：“咱家宸直那三十万九月底到期，到时候拿二十万给她，她自己留着。”
- **能证明：** 女方母亲因男方自费 MBA 推高彩礼，并要求领证前进女儿个人账户、婚宴首饰另算；与此同时，女方父亲给女儿的二十万元仍在宸直产品中。
- **仍不能证明：** 不能证明宸直到期一定无法兑付，也不能证明男方应当或有能力支付二十八万八。
- **路线轴：** external-corroboration
##### 选项

###### 1. 领证前转账和九月底到期

- **标签：** 领证前转账和九月底到期
- **是否核心项：** true
- **矛盾：** 女方家要求男方在领证前把钱转入女儿账户，婚宴首饰另算；自己那二十万元不但要等九月底，还准备留给女儿本人。
- **反馈：** 要求男方支付的时间、账户和额外项目都很清楚；轮到女方家的钱，只剩一个未来日期，而且没有共同用途。
- **路线轴：** caller-credibility

###### 2. MBA 二十三万八是他自己交的

- **标签：** MBA 二十三万八是他自己交的
- **是否核心项：** false
- **反馈：** 这能证明历史支出，不能单独证明他现在有钱。后来让婚事谈崩的是彩礼和宸直。
- **路线轴：** external-corroboration

###### 3. 九月底到期

- **标签：** 九月底到期
- **是否核心项：** false
- **反馈：** 约定日期不是兑付保证。还要把它和女方家当天问出的彩礼放在一起看。
- **路线轴：** identity-wording

##### reply Choices

###### 1. 直播里说清两家的钱

- **内部 ID：** ack-self-started
- **标签：** 直播里说清两家的钱
- **立场变化：** open

###### 2. 先说彩礼是妈妈定的

- **内部 ID：** blame-mom
- **标签：** 先说彩礼是妈妈定的
- **立场变化：** defensive

#### 2. 介绍人分别对两家说的话

- **内部 ID：** profile-introducer-double-note
- **声纹卡 ID：** case3-introducer
- **来源：** introducer-note
- **出现界面：** 介绍人留了话
- **标题：** 介绍人分别对两家说的话
- **触发矛盾：** 介绍人对两边都抬高好处、压低短处，条件版本被介绍链共同加工。
- **此刻出现原因：** 材料板圈出介绍链原话后，介绍人通过后台补了一段解释。
- **提示题：** 这段留言里，哪一句最该留下？
- **材料：** 介绍人留言：“‘收入稳’是听男方家说完，我顺嘴夸的；‘她不太计较学历’，我也没问过本人。二十八万八是她妈妈让我原话问的。我当时只想着先把人约到桌上，没拦，也没让两个孩子先谈。”
- **能证明：** 介绍人承认两句条件话没有问过本人，也确认二十八万八来自女方母亲。
- **仍不能证明：** 不能证明男方其他账户余额、持续收入，也不能证明宸直到期一定兑付。
- **路线轴：** external-corroboration
##### 选项

###### 1. 我先把两家约到桌上

- **标签：** 我先把两家约到桌上
- **是否核心项：** true
- **矛盾：** 介绍人为了促成见面，替两个人都说了没确认的话。
- **反馈：** 她想把饭局促成，既替双方添了好话，也没有拦住二十八万八这句先冲过去。
- **路线轴：** process-control

###### 2. 收入稳

- **标签：** 收入稳
- **是否核心项：** false
- **反馈：** 她这么说过，但她没有材料证明收入构成。
- **路线轴：** money-flow

###### 3. 对学历不会太计较

- **标签：** 对学历不会太计较
- **是否核心项：** false
- **反馈：** 这句不是女方说的；还要继续查“收入稳”是谁告诉她的。
- **路线轴：** identity-wording

### 文档原件

#### 1. 学历、彩礼与两家资金边界

**学历、彩礼与两家资金边界**

七行不用一起算。先分开看：哪些是以前花掉的钱，哪些是现在真能拿出来的钱；再看彩礼何时支付、进入谁的账户、还不包括哪些支出。

| 行 ID | 日期 | 类型 | 金额 | 对方/项目 | 备注 |
| --- | --- | --- | --- | --- | --- |
| p01 | 06-16 | 提醒 | —— | 某名校 MBA 项目 | 校名与项目可核 |
| p02 | 06-16 | 提醒 | ¥238,000 | MBA 学费缴费回单 | 本人账户分三次支付；本科另有学校 |
| p04 | 06-19 | 提醒 | ¥288,000 | 女方母亲→介绍人 | 听说 MBA 自费后提出；要求领证前转入女方个人账户 |
| p06 | 06-19 | 提醒 | ¥200,000 | 女方父亲口头安排 | 从下述 30 万宸直中划出；到期后给女儿自己留着 |
| p07 | 06-19 | 提醒 | 另算 | 婚宴与首饰 | 不包含在 28.8 万内；女方家希望男方另行承担 |
| p03 | 06-20 | 提醒 | ¥286,000 | 男方工资账户 | 06-01 至 06-20；期末余额；其他账户未提供 |
| p08 | 06-20 | 提醒 | 差 ¥2,000 | 女方母亲→介绍人→咨询者 | 母亲：只差两千，不是拿不出，就是不肯；咨询者回复：嗯，我也觉得是态度 |
| p05 | 09-30 | 提醒 | ¥300,000 | 女方父母·宸直产品 | 持有页列明到期日；当前不能取 |

- **内部 ID：** case3-credential-balance
##### 逐行追问

###### p01

###### 1. p01 1

**林旭阳：** 这张查询页写的是毕业学历，还是项目经历？

**咨询者：** 项目经历。校名和项目都对，本科没在这一页。我以前把这页直接念成名校毕业。

- **矛盾：** 真实项目经历被概括成更宽的学历标签。
- **路线轴：** identity-wording

###### p02

###### 1. p02 1

**林旭阳：** 二十三万八由他自己支付，能直接证明现在有钱吗？

**咨询者：** 不能。它能证明当年这笔学费从他账户出去，也能证明 MBA 不是家里白送的；可花过多少钱，不等于现在还剩多少钱。

- **矛盾：** 女方母亲把一笔历史支出直接换算成了当前家底。
- **路线轴：** document-edge

###### p03

###### 1. p03 1

**林旭阳：** 这份工资账户流水能代表他的全部账户吗？

**咨询者：** 不能。它只显示这一张工资卡在所列期间的进出和期末余额。其他账户没有提供，里面有多少、用来做什么，都不知道。

- **矛盾：** 男方选择性提供工资账户，女方却把一张卡当成了全部家底。
- **路线轴：** money-flow

###### p04

###### 1. p04 1

**林旭阳：** 二十八万八是谁定的，什么时候给，打进谁的账户？

**咨询者：** 我妈定的。她听说二十三万八学费是他自己出的，就觉得他还有积蓄。她要求领证前打进我的卡，介绍人把这组话传了过去。

- **矛盾：** 咨询者只向男方强调彩礼数额，没有说清付款时点和钱会进入她个人账户。
- **路线轴：** caller-credibility

###### p06

###### 1. p06 1

**林旭阳：** 你爸说的二十万元，准备拿来付婚宴和首饰吗？

**咨询者：** 不是。他原话是宸直到期后拿二十万给我，让我自己留着。怎么花以后再说。

- **矛盾：** 咨询者把留给自己个人的钱说成女方家也会为结婚出钱。
- **路线轴：** money-flow

###### p07

###### 1. p07 1

**林旭阳：** 婚宴和首饰包含在二十八万八里吗？

**咨询者：** 不包含。我妈说另算，默认还是男方家出。我以前只把二十八万八告诉他，没把这句一起说。

- **矛盾：** 咨询者要求男方证明能支付彩礼时，没有同时告诉他后面还有两项额外支出。
- **路线轴：** money-flow

###### p05

###### 1. p05 1

**林旭阳：** 宸直三十万元现在能取出来吗？

**咨询者：** 不能。页面只写九月三十日到期，当前不能取；到期能不能按约兑付，这一页也保证不了。

- **矛盾：** 女方家要求男方现在证明支付能力，自己的资金却仍依赖一笔未来兑付。
- **路线轴：** money-flow

###### p08

###### 1. p08 1

**林旭阳：** ‘只差两千就是态度’最早是谁写的？

**咨询者：** 我妈先发给介绍人，介绍人原样转回来。我回了句‘嗯，我也觉得是态度’。这不是工资卡上写的。

- **矛盾：** ‘差两千就是态度’来自女方家和介绍人的转述，不是银行流水的事实字段。
- **路线轴：** identity-wording

##### 跨行追问

###### 1. 跨行追问 1

**林旭阳：** 这两份材料里，哪一份能说明他的本科和完整家底？

**咨询者：** 都不能。一张只有 MBA 项目，一份只有工资账户近一个月。我以前却拿着它们跟家里说，他学历和收入都不错。

###### 表格行

- p01
- p03

- **矛盾：** 两份真实材料被介绍链拼成了更完整的人设。
- **路线轴：** process-control

###### 2. 跨行追问 2

**林旭阳：** 把这三行连起来，双方的钱怎么安排？

**咨询者：** 男方要在领证前把二十八万八转进我的卡，婚宴和首饰再另外出；我爸那二十万要等宸直到期，而且先给我自己留着。

###### 表格行

- p04
- p06
- p07

- **矛盾：** 男方的钱有明确的付款时间、收款账户和额外支出，女方家的钱却既在未来，也没有约定共同用途。
- **路线轴：** money-flow

- **最多圈选：** 2
### 顾问留言

#### 1. 顾问留言 1

- **顾问 ID：** lin-matchmaker
- **此刻出现原因：** 收麦后，那位婚介听友又留了话。
我做婚介的，最怕两家隔着中间人传彩礼数字。你们俩要是还想往下谈，就自己见面，把能拿多少说清楚。家里答应的那份什么时候到，也别含糊。

### 对方留言

- **来源：** respondent-note
- **此刻出现原因：** 临时双人连麦结束后，男方又在后台补了一句，重申刚才答应公开到哪里。
- **夜 B 预告：** false
学校页、MBA 缴费和工资卡是我发的，你们可以问。别的账户我没给她，也不想上直播。当时她要看收入，我就挑了工资卡，没提醒她这不是全部。饭、展票、接她下班，是我愿意做，不是因为我家境普通就欠她。卡上有二十八万六，也不代表我要拿二十八万八，更不代表后面婚宴首饰都我出。

### 跨案回声

#### 1. case3 echo work inbox reply

- **内部 ID：** case3-echo-work-inbox-reply
- **requires Case Id：** 04-workplace
- **requires Inventory Id：** work-inbox-replied
- **quote：** 先把六万八还了再说。
- **source Case Label：** 案4
刚才有人把主播那句截出来，说节目已经判公司欠款。原件没跟来，只剩这句在群里转。

#### 2. case3 flashback work payment

- **内部 ID：** case3-flashback-work-payment
- **requires Case Id：** 04-workplace
- **quote：** 付款回单和预计付款日期，两项都没显示。
- **source Case Label：** 案4
刚才六万八要先找正式报销，这边二十八万八也得先问清是谁提的、准备怎么付。

## 收束与结案

- **host Wound Hook：** 他把学历说漂亮了，她家多要点保障也正常
### deep Followup

**林旭阳：** 你把他工资卡上的二十八万六看得这么细。那你自己现在有多少存款，真结婚愿意先拿多少？

**咨询者：** 唉，这些我也没跟他说。

#### resistance Beat

##### lines

###### 1. lines 1

**咨询者：** 八万四。

###### 2. lines 2

**林旭阳：** 准备先拿多少？

###### 3. lines 3

**咨询者：** 六万。剩下的我得留着。

###### 4. lines 4

**林旭阳：** 什么时候拿出来，用在哪儿？

###### 5. lines 5

**咨询者：** 领证以后。添家电、搬家。婚宴和首饰不从这里出。

- **说明：** 她报出八万四、六万元上限和使用顺序后，二十八万八不再是一个孤立的彩礼数字。

- **stage Judgement：** 查完普通家境，你家就把彩礼往上加。这不是谈结婚，是按差价收费。别再说是你妈一个人的意思。你赞成。周末那顿饭先取消。他不答应二十八万八，不是骗你。至于其他账户，他没给，今晚就不知道。
### quote Pick Candidates

- 本科不是。我工作以后去读的 MBA
- 你不是要看收入吗？工资卡最清楚
- 彩礼先问二十八万八
- 彩礼领证前打到她自己的卡里，婚宴和首饰另算

### accusation Choices

#### 1. “本科不是。我工作以后去读的 MBA。”

- **标签：** “本科不是。我工作以后去读的 MBA。”
- **quote Source Scene Id：** profile-dinner-pause
- **责任角色：** respondent
- **主播回应：** 他这次把本科说清了。问题是女方家听见二十三万八由他自己出以后，又把历史支出当成了当前家底。

#### 2. “你不是要看收入吗？工资卡最清楚。”

- **标签：** “你不是要看收入吗？工资卡最清楚。”
- **quote Source Scene Id：** profile-proof-before-dinner
- **责任指向：** both
- **主播回应：** 女方要求看银行流水，男方却只交工资账户。她把这一张卡当成全部家底，他也没有说明其他账户不在里面。

#### 3. “彩礼先问二十八万八。”

- **标签：** “彩礼先问二十八万八。”
- **quote Source Scene Id：** profile-family-chat-origin
- **requires Revised Scene Id：** profile-family-chat-origin
- **责任角色：** complainant
- **主播回应：** 二十八万八来自你妈。她听说 MBA 学费是男方自己交的，就托介绍人把这个数问了过去。

#### 4. “彩礼领证前打到她自己的卡里，婚宴和首饰另算。”

- **标签：** “彩礼领证前打到她自己的卡里，婚宴和首饰另算。”
- **quote Source Scene Id：** profile-family-chat-origin
- **责任角色：** complainant
- **主播回应：** 二十八万八要进你个人账户，婚宴和首饰还得另算。你可以提，他也可以不答应。别再把拒绝说成没诚意。

### 今晚最后一句

#### 1. 先写清自己的钱

- **内部 ID：** pragmatic
- **标签：** 先写清自己的钱
- **主播台词：** 周末饭先取消。真要谈，你先把自己能拿多少、什么时候拿写下来。
##### lines

###### 1. lines 1

**咨询者：** 先写我自己的？

###### 2. lines 2

**林旭阳：** 对。先把你的那份说清。

###### 3. lines 3

**咨询者：** ……行。

#### 2. 让她自己开口问条件

- **内部 ID：** affirm
- **标签：** 让她自己开口问条件
- **主播台词：** 想把条件问清楚不丢人。下次别借你妈的嘴，自己问。
##### lines

###### 1. lines 1

**咨询者：** ……谢谢。这句，我妈应该听听。

#### 3. 留一句回访

- **内部 ID：** accompany
- **标签：** 留一句回访
- **主播台词：** 谈完什么结果，都可以来说一声。不用带材料。
##### lines

###### 1. lines 1

**咨询者：** 不带材料。

###### 2. lines 2

【停顿】

###### 3. lines 3

**咨询者：** 好。我试试。

### 正式结案

- **标题：** 查完家境，彩礼加价
- **结论：** 女方父母查到男方家境普通后，把彩礼加到二十八万八，要求领证前进女方个人账户，婚宴首饰另算。她知道并赞成；自己最多婚后拿六万。男方只提供了工资卡，也没有先说明本科并非名校。其他账户和宸直兑付仍未知。
#### 场景节拍

##### 1. 来电

- **标签：** 来电
名校本科的误会被纠正后，女方父母查到男方家境普通，又把自费 MBA 当成家底，借‘替女儿留保障’问了二十八万八。

##### 2. 插麦

- **标签：** 插麦
男方刷礼物要求进麦；双方分别说清哪些材料和原话可以公开。

##### 3. 回看

- **标签：** 回看
咨询者默认自己条件更好，把男方平时付饭钱、买展票、接下班和听她倾诉看成应该；女方家又要男方先把彩礼转入女儿账户，婚宴首饰另算。

#### 已确认

- 学校图没有本科，收入图只有一个月
- 二十三万八学费由男方自己承担；这是过去的支出，不是当前家底
- 女方父母查到男方父母普通上班、婚房帮不上，没有定性欺骗，转头借这个落差提高彩礼；咨询者没有叫停，并赞成完整付款条件
- 男方平时承担多数饭钱和展票，也接过她下班、听她倾诉；咨询者曾认为自己条件更好，这些付出是应该的
- 二十八万八来自女方母亲；男方先说拿不出，女方要求流水后，他只提供工资账户
- 工资账户期末余额为二十八万六，其他账户没有提供
- 二十八万八要在领证前转进女方个人账户，婚宴和首饰另算
- 女方本人有八万四，最多愿意拿六万，准备领证后用于家电和搬家
- 女方父母的三十万元仍在宸直产品中，约定九月底到期；其中二十万元准备留给女儿本人

#### 未决

- 男方是否有持续收入
- 男方其他账户里有多少，以及真实总家底
- 宸直产品九月底能否按约兑付
- 双方最终愿意拿多少、何时拿、进入谁的账户以及用于哪些项目
- 坦白条件后双方是否仍愿意继续

- **下一步：** 周末饭局先取消。两个人各写一张清单：现在能拿多少、何时拿、钱进谁的账户、婚宴和首饰谁付。宸直没有兑付以前，不把那二十万元算成可用资金；任何一方不接受这组条件，都可以不继续。

- **story Interlude Recap：** 学校图上只有 MBA。女方父母查到男方家境普通后，没有追究被骗，反而借这个落差问二十八万八；咨询者嘴上劝过一句，实际没有叫停。
### conclusion When Cleared

- **摘要：** 女方父母查到男方只是名校 MBA、家境普通后，没有说被骗，转头把这个落差变成加价理由。咨询者没有叫停，还认为自己条件更好，男方平时多花钱、多照顾是应该的。
- **followup：** 男方刷礼物要求上麦以后，承认自己只交了工资账户，其他账户不愿公开；咨询者也说出完整条件：二十八万八领证前进她的卡，婚宴首饰另算。她有八万四，最多愿意在领证后为家电和搬家拿六万；父母未来的二十万元准备留给她本人。学校、缴费和工资卡分别只证明自己的那一部分。
- **作者真相：** 今晚还不知道男方其他账户有多少、收入能否持续，也不知道宸直九月底能否按约兑付。咨询者可以提出保障，男方也可以拒绝。两家若继续谈，必须把金额、付款时间、收款账户和共同支出逐项说清。

### conclusion Branches

#### 1. conclusion Branches 1

- **match：** MBA|学历|本科|介绍
- **摘要：** 你这轮主要问了学历。学校和 MBA 都是真的，可“名校毕业”听起来更像本科也在那里读。
- **followup：** 本科误会纠正后，女方母亲没有停下来，反而用二十三万八自费学费推断男方家底。
- **作者真相：** 学历只是开头。后来把两家推开的是二十八万八要在领证前转进女方账户、婚宴首饰另算，以及女方一侧的钱没有对等的共同用途。

#### 2. conclusion Branches 2

- **match：** 流水|工资|收入|花销|存款|彩礼|宸直
- **摘要：** 你这轮主要问了两家的钱。男方只交了工资账户，期末余额二十八万六；女方家三十万元是尚未到期的宸直产品。
- **followup：** 一个没有交代其他账户，另一家没有说清彩礼进谁的卡、额外支出谁付，也把留给女儿个人的钱说成家里会为结婚出的钱。
- **作者真相：** 两边数字都是真的，却既不是完整家底，也不是双方已经同意的分配方案。男方其他账户、持续收入和宸直兑付，今晚仍然不知道。

- **followup Twist：** 回拨时，她先承认父母查到男方家境普通后没有喊被骗，转头借这个理由把彩礼往上加；随后亲口念出家里群连着的两段：母亲要求二十八万八领证前进女儿账户，婚宴首饰另算；父亲却说宸直九月底到期后拿二十万给女儿自己留着。白天看材料能确认 MBA 由男方自费；去见介绍人，则能确认彩礼数字确实来自女方母亲。
- **分享卡标题：** 二十八万八，对上二十八万六
- **分享卡正文：** 女方父母查到男方只是名校 MBA、家境普通后，没有说被骗，反而借这个理由把彩礼加到二十八万八；她本人没有叫停，还觉得自己条件更好，男方多花钱、多照顾很正常。男方只交工资账户同样没有把自己的家底说全。
- **分享题：** 如果心里已经把对方放在条件较弱的位置，还把他的付出当成补差价，这段关系到底在谈感情，还是在谈身价？
- **作者真相：** 查完男方普通家境，女方家把彩礼加到二十八万八，要求领证前进女方个人账户，婚宴首饰另算；咨询者知道并赞成，却把父母留给她个人的二十万说成女方家也会为结婚出钱。男方只给了工资卡，其他账户今晚没材料；他拒绝二十八万八，不是骗她。周末饭先取消，把双方能拿多少、何时拿、钱进谁账户重新写清。

## 【编剧资料】事实边界与运行规则

- **内部来电索引：** 她打来问：这个周末原本要带相亲对象见父母，现在这顿饭还要不要继续？
- **运行时状态：** runtime-loaded
- **texture Pass：** true
### dialogue Presentation

#### speed Tiers

##### strained

- **delay：** 50
- **hold Ms：** 0

##### stalled

- **delay：** 56
- **hold Ms：** 1000

#### blip Pitch Hz

- **host：** 330
- **caller：** 274
- **respondent：** 206

### voice Tics

- **one Time Tic：** 唉
- **one Time Tic Path：** deepFollowup.answer
### voice Tic Arc

- **林：** 全案零语气词,只在深问报出工资后用一次『唉』

### drift Comments

- 她妈怕女儿吃亏,这也正常吧
- 结婚本来就要谈条件,先别急
- MBA是啥,速成班吗,有没有懂哥
- 主播我妈也这样,我恋爱她比我上心
- 刷这么大一个礼物就能插麦吗
- 蹲一个审计小姐姐的记账模板

- **来电媒介：** voice
### caller Intent Profile

- **open Goal：** 让主播判断男方拒绝二十八万八、只交工资账户是不是没有诚意，并决定周末是否继续见父母。
- **preferred Answer：** 男方有能力却故意少给、少展示，女方要求领证前获得保障是合理的。
- **audience Tilt：** 让听众盯住男方的学历包装和选择性流水，不先计算女方实际准备拿多少钱。
- **protected Interest：** 保住二十八万八进入个人账户的安排，也保住自己是被母亲先斩后奏、只是核实诚意的说法；不让听众看出她也认定男方家境普通，所以应该多花钱、多哄她。
- **default Tactic：** 先报精确金额和日期，把要求推给母亲；被问到自己一侧的钱时骤然缩短，只承认眼前数字。
- **concession Limit：** 可以承认母亲报了价、自己没有叫停，也可以承认有八万四；不主动承认她赞成完整条件、最多只愿拿六万且要等领证后再用。
#### pain Points

##### 1. pain Points 1

- **topic：** 男方已经明确说拿不出
- **threatens：** 会把她要求流水从核实诚信变成不肯接受拒绝。
- **first Response：** 先把判断推给母亲，并反问工资卡为什么恰好有二十八万六。
- **after Proof：** 主播把历史学费和当前余额分开后，只承认自己当时觉得男方在压价。
- **minimum Leak：** 承认她没有相信男方的直接拒绝。

##### 2. pain Points 2

- **topic：** 名校本科说法从谁开始
- **threatens：** 会暴露她为了不在家人面前承认没问清而主动停下追问。
- **first Response：** 先只说饭桌上没有继续问。
- **after Proof：** 被问谁先对家里说名校后，才承认是自己。
- **minimum Leak：** 承认她借服务员添水把话题停了。

##### 3. pain Points 3

- **topic：** 父母查完家境后的加价
- **threatens：** 会暴露女方家并没有认定男方欺骗，反倒把名校本科的落差和普通出身一起拿来抬高彩礼；她本人也认可这种条件比较。
- **first Response：** 先说父母只是替她多打听了一下。
- **after Proof：** 家里原话和她自己的动作对上后，才承认母亲借家境普通加价，自己嘴上劝过一句，却没有要求撤回。
- **minimum Leak：** 承认父母查过男方家庭，她知道后仍让二十八万八继续传下去。

##### 4. pain Points 4

- **topic：** 完整彩礼条件
- **threatens：** 会证明她把本人赞成的整组条件缩成母亲报出的一个金额。
- **first Response：** 先承认只发了二十八万八。
- **after Proof：** 主播分别追问支付时点、账户和另算项目后，才承认自己同意。
- **minimum Leak：** 承认领证前进个人账户、婚宴首饰另算没有一起告诉男方。

##### 5. pain Points 5

- **topic：** 自己的八万四与父母的钱
- **threatens：** 会暴露双方被要求承担的时点、用途和金额并不对等。
- **first Response：** 只报八万四，句子变短。
- **after Proof：** 逐项追问后才说最多拿六万、领证后用于家电和搬家。
- **minimum Leak：** 承认婚宴和首饰不准备从自己的八万四里出。

### 运行时长度计划

- **live Beat Count：** 7
- **material Board Count：** 3
- **backflow Count：** 2
- **truth Boundary Prompt Count：** 6
- **case Specific Pressure：** 资料图先让女方家误认名校本科，自费 MBA 随后被换算成家底；介绍人带回二十八万八彩礼，男方说拿不出后被要求打流水，却只交工资账户。第二夜他刷礼物插麦，双方在公开授权范围内当场争到其他账户为何没交和女方家锁在宸直的三十万元。
#### what Player Does Besides Read

- 先问两句
- 定向追问
- 中段挂断进幕间
- 幕间回听冷场 / 提前看家里群
- 回拨开场与立场
- 圈学历与收入材料
- 在礼物插麦后划定调解和公开边界
- 归位事实边界
- 选一句往下追

### 任务画像

- **内部 ID：** verification
- **标签：** 资料有雾
- **recommended Specialty Id：** verification
- **摘要：** 标签都好看，材料却总少一块。

### 路线评论

#### identity wording

- 名校两个字太省事
- 名校俩字我妈也爱说,说我邻居家孩子

#### money flow

- 二十八万八是谁定的
- 宸直那三十万现在拿不出来

#### document edge

- 资料图又少一截
- 这跟前面账单少页一个味

#### caller credibility

- 她问诚信，也问钱
- 来电人没把收入诉求说满

#### process control

- 介绍链也在抬价
- 资料不是一个人整理的

#### active provocation

- 所以她听见加价,当时没拦?

### 事实边界

#### 能确认

- MBA 项目和二十三万八的本人缴费记录都是真的
- 男方先明确说拿不出二十八万八，咨询者不信后才要求看银行流水
- 男方随后只提供工资账户近一个月的流水，期末余额为二十八万六
- 资料里的 MBA 项目和本科经历不是一回事
- 他吃饭算团购、停车问 AA，节俭是真的
- 第一次饭局上问到资料时冷场了十几秒
- 介绍人说“收入稳”和“不计较学历”之前，都没问过本人
- 女方母亲得知 MBA 学费由男方自己承担后，让介绍人去问二十八万八彩礼
- 女方父母托人查到男方父母只是普通上班、老家只有一套自住房、婚房帮不上；他们没有把学历落差定成欺骗，转头借此把彩礼加到二十八万八
- 男方平时承担大多数饭钱和展票，也接过咨询者下班、听她讲家里的烦恼；咨询者认为自己工作和家庭条件更好，曾把这些投入视为男方应该多做的部分
- 女方父母持有三十万元宸直产品，约定到期日在九月底
- 女方母亲提出二十八万八要在领证前打进女儿个人账户，婚宴和首饰另算
- 女方父亲说宸直到期后拿二十万元给女儿自己留着，没有承诺用来支付婚宴或首饰
- 男方表姐说资料是家里一起帮着整理的
- 第二夜男方刷礼物要求上麦，双方分别同意讨论已经公开的材料和各自原话

#### 被修剪

- 对方最初发学校材料时没有主动说明本科另有学校
- 对方只提供工资账户流水，却没有主动说明其他账户未包含在内
- 咨询者把收入诉求说成只是家里想看稳定
- 咨询者把父母调查普通家境后的加价说成自己无可奈何；她没有制止母亲借自费 MBA 和出身差距抬高彩礼，也没有告诉男方，父母说的二十万元尚未到期，而且只准备留给她本人
- 咨询者把领证前进个人账户、婚宴首饰另算的完整条件压成了一个彩礼数字，也把父母留给她个人的钱说成女方家会为结婚出的钱
- 介绍人把两边短处都说轻了
- 男方家把资料整理说成他一个人周到

#### 今晚定不了

- 对方是否有持续真实收入
- 对方其他账户的余额、用途和真实总家底
- 双方如果坦白条件后是否还愿意继续
- 宸直产品九月底能否按约兑付
- 双方各自现在能拿出多少，以及愿意把多少钱用于两个人共同的生活
- 男方是否接受彩礼进入女方个人账户、婚宴首饰如何分担，以及双方是否能就这些条件达成一致

### deception Chain

- **owner：** caller
- **protected Purpose：** 让主播把男方拒绝二十八万八、又只交工资账户解释成没有诚意，同时支持领证前把钱转进她个人账户；她要把父母按普通家境加价说成自己拦不住，也不想让人追问她为什么默认男方条件略差就该多花钱、多哄她，更不想先回答自己的八万四、父母未到期的二十万元和婚宴首饰由谁承担。
#### stages

##### 1. profile mother as source

- **内部 ID：** profile-mother-as-source
- **pressure Trigger：** 男方因为二十八万八停止周末见家长，咨询者需要解释这组条件是谁提出来的。
- **surface Version：** 她先说数字是母亲瞒着自己托介绍人问的，把自己放在被两家催着做决定的位置。
- **edited Fact：** 父母查到男方父母只是普通上班、老家一套自住房、婚房帮不上，便借这个落差把彩礼加到二十八万八；她知道以后没有叫停，也赞成用这笔钱检验男方的诚意。
- **immediate Utility：** 把高彩礼的主动性推给母亲，先让主播审查男方为什么拒绝。
- **fair Trace：** 她虽然说事先不知情，却立刻用学历、家境和工资卡替这个数字找理由。
- **player Test：** profile-caller-repeats-label：追问父母查完家境后说的是被骗，还是借机加价；再问她有没有让母亲撤回二十八万八。
- **forced Revision：** 她承认父母没有定性欺骗，反倒觉得男方出身普通就该多拿保障；她自己嘴上劝过一句，却没有让母亲把数字收回来。
- **advice Impact：** 主播不能再把她当成条件的旁观者，必须让她用第一人称说明自己要求什么。

##### 2. profile tuition as assets

- **内部 ID：** profile-tuition-as-assets
- **pressure Trigger：** 名校本科的误会被纠正，女方家失去用学历标签抬高预期的理由。
- **surface Version：** 她说自己已经向家里纠正本科，仿佛学历问题到此为止。
- **edited Fact：** 她和母亲把二十三万八的历史学费换算成男方现在仍有的积蓄，又把后来查到的普通家境当成让男方多付钱的理由；她本人也从学历疑问转去比较双方条件。
- **immediate Utility：** 保住二十八万八看似有事实依据，而不是女方家单方面开出的条件。
- **fair Trace：** 饭局问清本科后，她没有追问名校毕业从哪儿来，反而牢牢记住了学费数字。
- **player Test：** profile-mba-wording 与 profile-dinner-pause：把本科答复、学费和她回家后的转述按顺序问清。
- **forced Revision：** 她承认听见二十三万八以后，第一反应是男方应该挺有钱；查到家境普通后，她又默认自己条件更好，男方多花钱、多安抚是应该的。
- **advice Impact：** 历史支出能确认学费由谁承担，不能继续作为当前彩礼能力的证明；家庭出身也不能被悄悄换成婚姻溢价。

##### 3. profile salary card as total

- **内部 ID：** profile-salary-card-as-total
- **pressure Trigger：** 男方已经明确说拿不出二十八万八，她仍需要证明这句话是在压价。
- **surface Version：** 她拿工资账户二十八万六的余额证明男方明明有钱，只是不愿意给。
- **edited Fact：** 她手里从头到尾只有一张工资账户，问过还有没有其他账户却没有得到回答。
- **immediate Utility：** 把男方对付款条件的拒绝改写成财力隐瞒，让查流水显得理所当然。
- **fair Trace：** 男方原话是‘你不是要看收入吗’，已经限定他为什么挑这张卡；她却继续把余额贴近彩礼数字来讲。
- **player Test：** profile-proof-before-dinner 与 profile-income-and-card：分别核这张卡的范围和男方先前的直接拒绝。
- **forced Revision：** 她承认到昨晚为止手里就这一张，其他账户有没有、里面多少都不知道。
- **advice Impact：** 主播可以指出男方选择性提供材料，却不能把单卡余额变成彩礼承诺或完整家底。

##### 4. profile family money as shared

- **内部 ID：** profile-family-money-as-shared
- **pressure Trigger：** 男方家反问女方准备拿出多少，单向审查开始回到咨询者一侧。
- **surface Version：** 她告诉男方自己家以后也会给二十万，让条件听起来像两边都会为结婚出钱。
- **edited Fact：** 三十万元仍在宸直到期以前不能取，父亲只说到期后拿二十万给女儿自己留着，没有承诺付婚宴或首饰。
- **immediate Utility：** 用一笔未来的个人赠与营造投入对等，同时继续要求男方现在付款。
- **fair Trace：** 她一直说‘以后会给’，却不说到期日、收款人和具体用途。
- **player Test：** profile-family-chat-origin 与 case3-credential-balance：把彩礼时点、收款账户、另算项目和宸直到期日连起来。
- **forced Revision：** 她承认父亲原话是给自己留着，也承认以前没有告诉男方这笔钱不一定用于结婚。
- **advice Impact：** 未到期且留给个人的钱不能算作女方家已经承诺的共同投入。

##### 5. profile own money later

- **内部 ID：** profile-own-money-later
- **pressure Trigger：** 彩礼完整条件和父母资金用途都公开后，主播把问题问到她自己的现有存款。
- **surface Version：** 她此前只问男方还有多少钱，从未给出自己现在能拿多少、什么时候拿。
- **edited Fact：** 她有八万四，最多愿意拿六万，而且准备领证以后才用于家电和搬家，婚宴首饰不从这里出。
- **immediate Utility：** 让男方先承担明确、即时、进入她个人账户的付款义务，自己的投入则保留金额上限、较晚时点和个人决定权。
- **fair Trace：** 她能精确复述男方工资卡余额，却始终没有主动报自己的余额和用途。
- **player Test：** deepFollowup：在男方工资卡、女方家二十万元和另算项目都出现后，直接问她自己的钱。
- **forced Revision：** 她报出八万四和六万元上限，并承认这些安排从来没有告诉男方。
- **advice Impact：** 结案从判断谁有诚意，改成双方分别写清金额、时点、账户和用途；任何一方都可以拒绝。

### scene

- **name：** 直播连线

### explicit Clue Groups

#### explicit Clue Groups 1

- 女方家先把“学校不错”听成名校本科，问清是 MBA 后才纠正。
- 二十三万八学费由男方本人承担，但这笔历史支出不能证明他现在家底丰厚。

#### explicit Clue Groups 2

- 咨询者把“学校不错”转述成“名校毕业”，本科学历落差被留在了标签外面。
- 咨询者把本科不是名校告诉了家里，却没有阻止母亲把自费 MBA 换算成财力。
- 名校误认和财力误判先后接替，推动了二十八万八彩礼。
- 第一次饭局上问到资料时冷场了十几秒。

#### explicit Clue Groups 3

- 介绍人对两边都抬高好处、压低短处，又把女方母亲的二十八万八原样递给男方家。
- 介绍人把两边短处都说轻了。
- 男方表姐说资料是家里一起帮着整理的。

#### explicit Clue Groups 4

- 男方先说拿不出二十八万八；咨询者不信并要求看银行流水。
- 男方只提供工资账户近一个月流水，期末余额二十八万六；其他账户余额仍未知。
- 女方父母说宸直到期后给女儿二十万元自己留着；这笔钱目前未到期，也没有承诺用于婚宴和首饰。
- 单张工资账户流水撑不起完整家底或长期收入判断。
- 双方都把一个真实数字说成了对自己有利的版本，却没有先回答眼下到底能拿出多少。

### after Judgement Lines

#### 1. after Judgement Lines 1

【家里群提示音又响了一声。她没看。】

### statement Patience

- **night a：** 4
- **night b：** 4

### statement Stages

#### 1. profile night a account

- **内部 ID：** profile-night-a-account
##### scene Indexes

- 0
- 1

- **minimum Review Count：** 2

#### 2. profile night a price

- **内部 ID：** profile-night-a-price
##### scene Indexes

- 2

- **minimum Review Count：** 2

#### 3. profile night b card account

- **内部 ID：** profile-night-b-card-account
##### scene Indexes

- 6

- **minimum Review Count：** 2

## 广告间隙

**赵律师（语音）：** 你刚才说的那笔宸直，女方家买的是哪一款？

**林旭阳：** 我只看见持有页，三十万，写着九月底到期。合同没上屏。

**赵律师（语音）：** 那就先看持有页。三十万还在，写着九月底到期。没合同，别先算它能不能兑。

**林旭阳：** 她爸原话是给女儿自己留着，不是拿来办婚礼。九月底到底能不能兑，还得等。

**老方（语音）：** 后台有人丢来一页打码课纲，标题和来源都遮了，只剩四个词：安全感、态度、向上社交、退出。

**赵律师（语音）：** 原图先别删。这页一共就剩四个词，连是谁发的都不知道。今天这个人买没买过课，前两通认不认识发图的人，都不能从这页上猜。

**赵律师（语音）：** 先别替人家发愁。你第一次去我家的时候，我爸妈要是先问你能拿多少，你还会来吗？

**林旭阳：** 还是会去。可那顿饭吃完，我有多少钱、愿意怎么花，得由我自己说。

语音停了，你把保温盒重新扣好。

【热过的汤又凉了。塑料盖轻轻响了一声。】

### 新闻推送

- **类型：** news-push

**宸直产品出现延期登记传闻**

宸直旗下多只产品被曝延期登记，平台回应称正在核对。

> 财经客户端推送 · 00:47

# 第四幕：那张名单

- **案件 ID：** 02-tony
- **剧情 ID：** tony-multi-dating
- **内容包原题：** 今日来电：那张名单

## 本案人物

| 角色 | 性格 | 欲望 | 防御动作 | 知识边界 |
|---|---|---|---|---|
| 第四通咨询者·何 | 渴望被尊重的社交型人格 | 确认这个外形好、会说话又给她恋爱位置的男人，到底有多少真心；同时让主播支持把十二万按被骗要回来。 | 第一夜只砸裁过的名单和要钱，把左半张图读成女友名册；问到恋爱就承认他帅、自己也要这个位置。敲门时突然下线，不说警察是因涉案放款人来核实。开场不说十二万是自己让他代投。 | 知道自己的聊天、十二万转账、不够一百万起投、走他户的口头约定，也知道高息是自己先在酒吧听说的，并知道自己向放贷人借过钱。第二夜知道周是剪头客户并见过她转发的认购回单。她没有合同原件，不知道十二万是否已经买成宸直，也不知道 Tony 有没有代销资格；不知道警察把她当证人还是另有调查。 |
| Tony | 讨喜的即兴交易者 | 维持熟客信任，把愿意买高息的人留在自己的私人代投入口；收下何的十二万，让钱走个人账户，产品材料和后续查询也都经过自己。 | 把走他户说成替自己人凑门槛的顺手帮忙；先认自己人、晚档、走我户和已经提交，再把名单说成客户跟进。声称材料只给何本人，不向节目交代。不上麦。 | 知道自己的聊天、会员记录、私人名单、何转到自己户头的十二万，以及自己把钱实际送去了哪里；不知道产品最终能否兑付，也不能代表门店对外卖理财。节目没有拿到他所称的产品全名、合同和回单。他不上麦。 |
| Tony 案邻桌常客 | 厌烦套路的直肠子 | 提醒咨询者别把服务熟练误认成专属。 | 只说耳朵听见的，不负责解释。 | 只知道同席时听见的当面话，不知道麦外私聊。 |
| Tony 案小姐妹 | 酒桌知情却不愿当证人的朋友 | 确认何有没有已经转钱，同时把自己从推销链里摘出去。 | 只认酒桌上说过一百万起，不认自己让她买。 | 知道自己在酒吧酒桌说过高息档一百万起，也知道何听完就问自己那点钱够不够；后来听说赎回要排队才让何别再转。不知道 Tony 名单全文、十二万是否入产品、Tony 有无代销资格。 |
| Tony 案店长 | 急躁的防守型管理者 | 保住门店口碑和会员指标。 | 承认培训，不承认自己知道私人推进。 | 知道培训、会员制度和员工指标，不知道Tony全部私人对话。 |
| Tony 案前台 | 安静的程序执行者 | 把预约和会员记录办对，不卷入客人与技师的关系。 | 使用系统用语和权限边界。 | 只知道前台系统、预约和标准会员字段。 |
| Tony 案另一位女客 | 受伤后外放的感性派 | 拉咨询者一起讨说法，让自己的经历不再像单独看走眼。 | 用‘不止我一个’压过自己的受用。 | 知道自己转过一百万、名单行写已买、Tony 发来的聊天和一张认购回单；不知道咨询者的十二万是否入了同一产品，也不知道其他顾客是否投过钱。 |
| Tony 案宸直柜员 | 守窗口权限的程序执行者 | 只确认公开产品门槛，不替私人转账作证。 | 只报高息档起投，其余推给系统户名。 | 只知道高息档个人认购起投一百万；代持代购、具体合同和兑付结果不在窗口可答范围。 |

## 【编剧资料】案件发动机

- **戏剧锚点：** Tony 的名单、恋爱名义下的相处、高息档一百万起投、她转到他户头的十二万、酒吧小姐妹的高息传闻、名单上另一位女客的认购回单
- **为何今晚发生：** 她翻到 Tony 一份全是女人的名单，认定他以谈恋爱为名养鱼骗钱，钱还在他那儿，今晚想问直播间怎么要回来。
### 公开求助

- **类型：** interest
- **求助内容：** 她想让主播支持自己把转到 Tony 手里的钱要回来，并把这件事说成恋爱诈骗。

- **核心物件作用：** Tony 的私人名单把熟客称呼、下次约、金额、起投和账户去向记在一起，让客户关系与代投都经过他。她第一夜只发左半边，把姓名、亲密度和下次约讲成女友名册；被裁掉的右半边和十二万转账随后把“被骗的恋爱钱”翻回她主动要求的代投，也留下 Tony 为什么把钱和原件都放在自己手里的问题。
- **咨询者所求：** 她确实以谈恋爱名义和 Tony 相处，也确实觉得他长得好看。她想把转到他手里的十二万说成被养鱼骗走的钱，好在听说可能拿不回以后翻脸追讨。她不想让直播间先知道：高息档是她在酒吧听小姐妹说的，自己不够一百万起投，是她让男友帮她买。
- **对方所求：** Tony 用留晚档、‘自己人’和私下约会维持熟客信任，再把愿意买高息的人接到自己的私人代投里。何的十二万走他个人账户，产品全名、合同、回单和实际下单账户都没有交到何手里；他不愿上麦说明资格与资金去向。
- **第三压力：** 酒吧小姐妹的高息传闻、名单上另一位女客来问钱、店里不能卖理财的边界、宸直起投门槛，以及放款人涉案后按借款人找上门的核实。
- **咨询者自利删减：** 咨询者开场已经说出要回这笔钱，并把名单讲成养鱼女友名册；她只发左半边截图，裁掉金额、起投和账户备注。她不先说自己确实以恋爱名义和他相处、也觉得他帅，更不说高息是自己在酒吧听小姐妹聊的、十二万是因为不够一百万门槛才让他代投。她把今晚说成发现被骗，不说自己是听说可能拿不回才翻脸。第一夜敲门时，她也不说来人是警察，更不说自己借过涉案放贷人的钱。
- **公开钩子：** 她翻到一份全是女人的名单，说他以谈恋爱为名养鱼，钱还在他那儿，问怎么要回来。
- **故事概述：** 第一夜先让裁过的名单被读成养鱼名册，再承认恋爱名义和真实照顾都发生过；强光照进窗内，敲门声逼她突然下线。第二夜问出来人是警察，再把门店预约册、Tony 的私人跟进、完整名单和十二万转账放到一起：她主动绕门槛，他则把熟客、钱和产品材料都留在自己的私人代投入口。
- **悬念：** 她为什么一开口就要钱，却只发名单左半边；Tony 为什么让十二万走个人户，声称已经提交后又迟迟不交原件。
- **线索物件：** Tony 的私人名单、门店预约册与私人备忘录、十二万转账、酒吧小姐妹的高息传闻、另一位女客转发的认购回单

## 夜 A：第一次来电

**咨询者：** 主播，我在线上吗？

#### 舞台标记

- **mood：** anxious

**林旭阳：** 你在的，请讲。

#### 舞台标记

- **mood：** listening

**咨询者：** 我昨晚在一个男的手机里看见张名单，上面全是女的。我一晚上没睡。

#### 舞台标记

- **mood：** anxious

**林旭阳：** 他是谁？

#### 舞台标记

- **mood：** listening

**咨询者：** 给我剪头的那个，我平时叫他 Tony。我今天轮休，现在在家。一直没敢找他。

#### 舞台标记

- **mood：** anxious

**林旭阳：** 你们是什么关系？

#### 舞台标记

- **mood：** listening

**咨询者：** 没公开过。可他一直叫我自己人。

#### 舞台标记

- **mood：** anxious

**林旭阳：** 名单上写了什么？

#### 舞台标记

- **mood：** listening

**咨询者：** 亲密度、下次约，一排女人的名字。越看越不对。我当时就觉得，他是不是拿谈恋爱吊着一串人。而且我还有一笔钱在他那里。

#### 舞台标记

- **mood：** anxious

**林旭阳：** 先把名单说清。它怎么到你手里的？

#### 舞台标记

- **mood：** listening

**咨询者：** 他去洗澡，手机亮着，备忘录没锁。

#### 舞台标记

- **mood：** anxious

**林旭阳：** 把名单发过来，名字遮掉。

#### 舞台标记

- **mood：** listening

**咨询者：** 我已经发后台了。那笔钱，我就是想拿回来。

#### 舞台标记

- **mood：** anxious

### 夜 A · 1｜tony-list-as-dating

**林旭阳：** 你怎么确定名单上的名字都是他在谈的人？

**咨询者：** 我往下划，一排名字，全是女的。备注写着亲密度、下次约。我那行也在。我把截图发到后台了，钱还在他那儿，我才打进来。

【材料触发后的重述】 **咨询者：** 全是女的这一层是真的。可我发的只有左半边，右边几列没发。

#### no Clue Reaction

**咨询者：** 名单上的人我不认识。我只能说我那一行。

- **interaction Mode：** lineReplay
- **线索职能：** setup
- **错误框架：** 名单等于养鱼女友名册，足以支持立刻要钱。
#### 回收目标

- tony-list-columns

- **说话人 ID：** he
- **现场疑点：** 她把左半张名单讲成女友名册，原表右侧仍没出场。
- **矛盾：** 开场用名单支持养鱼和要钱，发来的截图却在每一行同一个位置断掉。
- **可靠度：** mixed
- **展示卡片：** daily-tony-roster
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 备忘录你存下来了吗？

**咨询者：** 截了。

- **source Anchor：** 截图发到后台

##### 2. 自由追问 2

**林旭阳：** 上面大概几个人？

**咨询者：** 我数过，八……不对，九个。

【停顿】

**咨询者：** 连我。

- **source Anchor：** 一排名字

##### 3. 自由追问 3

**林旭阳：** 他回来以后发现你看了吗？

**咨询者：** 没有。我把屏幕按灭了。他出来还问我晚上吃什么。

- **source Anchor：** 我往下划

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 你发来的图，每一行怎么都在右边同一个地方断了？

**咨询者：** 截得急。

**林旭阳：** 不是截得急。每一行都断在同一个地方。

**咨询者：** ……我裁过。右边几列没发。

- **source Anchor：** 我把截图发到后台了
- **revised Source Anchor：** 右边几列没发
- **玩家所选怀疑方向：** 截图为什么只有左半边
- **防备回答：** 右边我没发。
###### logic Contract

- **premise Anchor：** 我把截图发到后台了
- **source Kind：** document-readout
- **source Proves：** 咨询者发来的截图只保留姓名、亲密度和下次约，右侧各行在同一位置断开。
- **source Does Not Prove：** 尚不知道右侧具体字段，也不能据半张图判断其他名字都是恋爱对象。
- **answer Anchor：** 我裁过
- **answer Adds：** 她承认右侧几列原本存在，是她自己没有发。
- **next Legal Question：** 可以追问她裁掉了什么，不能把左半张图当成完整名单。

- **矛盾：** 她用半张截图概括整张名单，还隐瞒自己主动裁掉了右侧字段。
- **是否核心项：** true
- **路线轴：** document-edge
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 名单全是女的，所以你先认定她们都是恋爱关系？

**咨询者：** 我现在不替其他人讲。你先说我这一行。

###### miss Reaction

**咨询者：** 我看到的全是女的，又写着亲密度。你让我当时怎么想？

- **source Anchor：** 全是女的
- **revised Source Anchor：** 全是女的这一层是真的
- **玩家所选怀疑方向：** 女客名单是不是恋爱名单
- **防备回答：** 我现在不替其他人讲。
###### logic Contract

- **premise Anchor：** 全是女的
- **source Kind：** caller-statement
- **source Proves：** 名单可见行都是女性姓名，咨询者自己的名字也在其中。
- **source Does Not Prove：** 姓名性别不能证明每个人都和 Tony 建立了恋爱关系。
- **answer Anchor：** 不替其他人讲
- **answer Adds：** 这个问法只让她把话收回自己一行，没有带出名单右侧字段。
- **next Legal Question：** 仍需从截图本身追问她没有发出的部分。

- **是否核心项：** false
- **路线轴：** money-flow
- **路线口气：** caller-skeptical

#### 压力表演

- **意图钩子：** 先砸名单再要钱
- **防备状态：** guarded
##### 表情/听感

- **类型：** blink
她盯着截图，没有立刻往下翻

### 夜 A · 2｜tony-exclusive-voice

**林旭阳：** 你说你当自己在谈。他怎么对你的？

**咨询者：** 我一开始就是觉得他长得好看。后来他总给我留最晚那档，也叫我自己人。

【材料触发后的重述】 **咨询者：** 我要这个位置，不是他单方面拖着我。他没带我见朋友，可自己人是他叫的。

#### no Clue Reaction

**咨询者：** 他就是这么叫的。别的我现在不想说。

- **interaction Mode：** lineReplay
- **线索职能：** misdirect
- **错误框架：** 真约会和真帅足以证明他在用恋爱骗人。
#### 回收目标

- tony-list-as-dating

- **说话人 ID：** he
- **现场疑点：** 恋爱名义成立，仍不能证明名单是女友名册。
- **矛盾：** 她用真约会给养鱼垫底，却说他从没公开。
- **可靠度：** mixed
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 你们最早怎么认识的？

**咨询者：** 同事推荐的，说他技术好。我第一次去就觉得他长得好看，后来剪头一直找他。

- **source Anchor：** 我一开始

##### 2. 自由追问 2

**林旭阳：** 你为什么一直固定找他？

**咨询者：** 手艺好。我上班时间跟别人不太一样，经常要见人，头发隔一阵就得弄。他肯给我留最晚的号。

- **source Anchor：** 长得好看

##### 3. 自由追问 3

**林旭阳：** 他有没有当着别人维护过你？

**咨询者：** 说女孩子半夜下班不像正经工作。他当场回了一句：“人家上自己的班，关你什么事。”我那时候真挺感激他的。

- **source Anchor：** 叫我自己人

##### 4. 自由追问 4

**林旭阳：** 你在他们店剪了多久头发？

**咨询者：** 一年多。最开始就是普通剪头，最近几个月才越走越近。

- **source Anchor：** 最晚那档

##### 5. 自由追问 5

**林旭阳：** 除了剪头，你们单独出去过吗？

**咨询者：** 大概三个月前。他收店晚，我也刚下班，就在旁边吃了碗面。后来又吃过两次。

- **source Anchor：** 后来

##### 6. 自由追问 6

**林旭阳：** 他会不会私下找你说话？

**咨询者：** 会。有次他说店长又骂他了，最后来一句：“也就你肯听我说这些。”那条语音我一直留着。

- **source Anchor：** 自己人

##### 7. 自由追问 7

**林旭阳：** 他多大？

**咨询者：** 二十九。

【停顿】

**咨询者：** 他自己说的。

- **source Anchor：** 长得好看

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 他亲口说过你们在谈吗？

**咨询者：** 说过自己人。带我吃饭。没带见朋友。

**林旭阳：** 所以是你当自己在谈。

**咨询者：** 我要这个位置，你知道吧。不是他一个人在演。

- **source Anchor：** 也叫我自己人
- **revised Source Anchor：** 自己人是他叫的
- **玩家所选怀疑方向：** 他有没有承认在谈
- **防备回答：** 叫过自己人。没公开。
###### logic Contract

- **premise Anchor：** 你当自己在谈
- **source Kind：** caller-statement
- **source Proves：** 双方以恋爱名义相处，Tony 用过自己人并带她吃饭。
- **source Does Not Prove：** 不能证明他承诺排他关系，也不能证明名单上其他人是女友。
- **answer Anchor：** 我要这个位置
- **answer Adds：** 咨询者承认自己不是单方面被拖着，恋爱位置是她要的。
- **next Legal Question：** 可以继续看名单字段，不能把真约会升级成已证实的养鱼诈骗。

- **矛盾：** 她开场把自己写成被吊着的人，这里承认恋爱位置是她要的。
- **是否核心项：** true
- **路线轴：** identity-wording
- **路线口气：** trust-but-verify

##### 2. 关键追问 2

**林旭阳：** 他叫你自己人时，你怎么回的？

**咨询者：** 我没追问到底算什么，只会回他：有事你就找我。晚档他也留，我愿意信。

###### miss Reaction

**咨询者：** 我怎么回很重要吗？现在是他拿‘自己人’哄了多少人。

- **source Anchor：** 也叫我自己人
- **revised Source Anchor：** 他没带我见朋友
- **revised Question：** 他没带你见朋友，你还拿‘自己人’确认关系？
- **玩家所选怀疑方向：** 她怎么回应深夜倾诉
- **是否核心项：** false
- **路线轴：** caller-credibility
- **路线口气：** caller-skeptical

#### 压力表演

- **意图钩子：** 真约会垫在养鱼下面
- **防备状态：** guarded
##### 表情/听感

- **类型：** shift
她说话越来越快，中间不留停顿

### 夜 A · 3｜tony-list-columns

**林旭阳：** 你裁掉的右半边，写的是什么？

**咨询者：** 金额、产品、后面怎么跟。我没把那几列发给你们。小姐妹让我把原图留好，我跟她说，名字和亲密度还不够吗？她没理我。

#### no Clue Reaction

**咨询者：** 右边我没发，我承认。先看我发来的这半张行不行？

- **interaction Mode：** lineReplay
- **线索职能：** missing-edge
- **错误框架：** 她发来的左半张截图已经足够说明整张名单。
#### 回收目标

- tony-exclusive-voice

- **说话人 ID：** he
- **现场疑点：** 完整名单在记钱和产品跟进；第一夜仍不知道她那行具体金额。
- **矛盾：** 她明知表格右边还有钱和产品，还是主动裁掉了会改变名单性质的部分。
- **可靠度：** partial
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 小姐妹为什么让你留原图？

**咨询者：** 她只说别光留名字，原图别删。我问她什么意思，她说等见面再讲。

- **source Anchor：** 原图留好
- **texture Role：** ramble

##### 2. 自由追问 2

**林旭阳：** 你裁图的时候，知道右边跟钱有关吗？

**咨询者：** 知道。可我当时就想先让你们看他怎么记这些女的。

- **source Anchor：** 金额、产品

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 你为什么偏偏把金额和产品那几列裁掉？

**咨询者：** 我不想先谈钱。

- **source Anchor：** 金额、产品、后面怎么跟
- **玩家所选怀疑方向：** 她为什么裁掉金额栏
- **防备回答：** 我不想先谈钱。
###### logic Contract

- **premise Anchor：** 金额、产品、后面怎么跟
- **source Kind：** document-readout
- **source Proves：** 她发给节目的截图主动省去了与钱和产品相关的列。
- **source Does Not Prove：** 第一夜仍不能确认具体金额、产品名称或资金去向。
- **answer Anchor：** 不想先谈钱
- **answer Adds：** 她拒绝在第一夜解释钱，只承认右侧金额和产品栏是自己裁掉的。
- **next Legal Question：** 可以追她何时知道产品与门槛，具体金额留到第二夜结合原图核对。

- **矛盾：** 她先用半张名单讲感情问题，却拒绝解释自己裁掉的金额栏。
- **是否核心项：** true
- **路线轴：** document-edge
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 你把左半张发给小姐妹以后，她说了什么？

**咨询者：** 她让我留原图，别只发名字。别的没说。

###### miss Reaction

**咨询者：** 她没回我。你别一直追她，图是我自己发的。

- **source Anchor：** 小姐妹让我把原图留好
- **玩家所选怀疑方向：** 小姐妹当时怎么回
- **是否核心项：** false
- **路线轴：** caller-credibility
- **路线口气：** detour

#### 压力表演

- **意图钩子：** 起投不是约会词
- **防备状态：** guarded
##### 表情/听感

- **类型：** shift
她把手机换到另一只手，屏幕朝下扣了一下

### 夜 A · 4｜tony-bar-rumor-hangup

**林旭阳：** 你刚才说产品那一列。高息这件事，你以前听过吗？

**咨询者：** 听过。小姐妹提过一嘴，说有个东西利息挺高。我当时就听了个热闹，没跟她细问。

#### no Clue Reaction

**咨询者：** 她就提过一句。那晚还有谁，我不想说。

- **interaction Mode：** lineReplay
- **线索职能：** misdirect
- **错误框架：** 她只是随耳听过高息，后来没有采取行动。
#### 回收目标

- tony-list-columns

- **说话人 ID：** he
- **现场疑点：** 高息消息早于她翻名单，完整门槛和她的转账仍留到第二夜。
- **矛盾：** 她把今晚讲成刚发现被骗，却承认自己早已听过同类高息产品。
- **可靠度：** partial
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 小姐妹当时说了哪家吗？

**咨询者：** 没有，就说最近有人在买。

- **source Anchor：** 有个东西

##### 2. 自由追问 2

**林旭阳：** 你当时为什么没问是哪家？

**咨询者：** 她随口一说，我也没当场追着问。我只记住息挺高。

- **source Anchor：** 没跟她细问

#### 场尾自动拍

##### lines

###### 1. lines 1

【窗外忽然扫进一片白光。她起身把窗帘拉上。】

###### 2. lines 2

**咨询者：** 等一下。

###### 3. lines 3

【门外传来两下敲门声。】

【音效：sfx.case2.door-knock】

###### 4. lines 4

**咨询者：** 我这边真有事。明天再说。

#### closure Contract

- **entry Anchor：** 高息这件事
- **closer Anchor：** 我这边真有事
- **adds：** 第一夜在高息来源未说完时被强光和敲门打断；她没有解释门外是谁。
- **open Edge：** 昨晚是谁敲门，她为什么立刻下线，来人跟她隐瞒的钱有没有关系。
- **route Independent：** true

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 小姐妹当时到底跟你说了多少？

**咨询者：** 她说有个东西利息高。

**林旭阳：** 就这一句？

**咨询者：** 她还说，不是我手里那点钱能买的。后来我又问过谁，今晚不说。

- **source Anchor：** 小姐妹提过一嘴
- **玩家所选怀疑方向：** 高息消息从哪儿来的
- **防备回答：** 她说利息高。别的不说。
###### logic Contract

- **premise Anchor：** 小姐妹提过一嘴
- **source Kind：** caller-statement
- **source Proves：** 咨询者在翻名单以前就听过高息产品，也知道自己手里的钱够不上门槛。
- **source Does Not Prove：** 尚未证明她听完后转了钱，也尚未证明产品就是宸直。
- **answer Anchor：** 不是我手里那点钱能买的
- **answer Adds：** 她知道自己够不上门槛，却把后来找谁帮忙掐断。
- **next Legal Question：** 可以问她后来做了什么，不能把听过传闻写成已经买成产品。

- **矛盾：** 她开场把今晚写成刚发现被骗，这里承认自己早就听过高息，也知道手里的钱够不上门槛。
- **是否核心项：** true
- **路线轴：** caller-credibility
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 你是在店里听她说的，还是别处？

**咨询者：** 别处。人多。今晚先不说哪。

###### miss Reaction

**咨询者：** 在哪儿听见的有那么重要吗？反正是她随口提了一嘴。

- **source Anchor：** 小姐妹提过一嘴
- **玩家所选怀疑方向：** 传闻是在哪儿听的
- **是否核心项：** false
- **路线轴：** identity-wording
- **路线口气：** detour

#### 压力表演

- **意图钩子：** 高息她早听过
- **防备状态：** guarded
##### 表情/听感

- **类型：** shift
她压低了声音，像在听屋里别的动静

### 中段立场快照

- **段后触发：** 3
- **kicker：** 中段立场快照
- **提示题：** 名单和转账都在这儿，你先问哪件？
- **说明：** 不判分。按下你现在最在意的那件事。
- **after Pick Line：** 截图右边是她自己裁掉的。先问那几栏写了什么。
- **continue Label：** 继续听
- **recap Kicker：** 中段立场
#### 选项

##### 1. 他用亲密话术拉客

- **内部 ID：** respondent-problem
- **标签：** 他用亲密话术拉客
- **摘要：** 他留晚档、叫自己人，也把同一批熟客写进带金额的跟进名单。
- **反馈：** ‘自己人’不只是甜话。它和下次约、客户跟进落在同一张表里。
- **recap：** 他用留晚档和‘自己人’制造特殊感，名单却把关系和客户跟进放在一起。

##### 2. 她裁掉名单右半边

- **内部 ID：** industry-gray
- **标签：** 她裁掉名单右半边
- **摘要：** 她只发姓名、亲密度和下次约，把金额、起投、跟进和账户栏裁掉。
- **反馈：** 截图不是天然缺了一半，是她自己动手裁的。她不想让直播间先看钱。
- **recap：** 她保留一排女人，裁掉金额和账户栏，再把半张名单发进直播间。

##### 3. 她拿半张名单先讲养鱼

- **内部 ID：** caller-complicit
- **标签：** 她拿半张名单先讲养鱼
- **摘要：** 她把客户表的左半边叫成女友名册，先让直播间按恋爱骗局理解。
- **反馈：** 她先抢了受害者位置。名单里那些人到底是什么关系，半张图回答不了。
- **recap：** 她先把客户名单讲成一排女友，再用这套说法向 Tony 要钱。

### 第一次收麦

**咨询者：** 我这边真有事。明天再说。

#### 舞台标记

- **after Scene Index：** 3
- **主播台词：** 我听见敲门了。你先确认安全，方便的时候给后台留句话。
- **stage Direction：** 她没有解释门外是谁，电话很快断了。
- **音频提示：** sfx.phone.disconnect

## 收麦幕间：控台短查

### 幕间行动

- **标题：** 收麦后·控台短查
- **kicker：** 出门前只够处理一样：看门店说明、听回放，或回周的消息。
- **budget：** 1
- **min Actions：** 1
- **max Actions：** 1
- **continue Label：** 进入白天调查
#### actions

##### 1. 看门店发来的说明

- **内部 ID：** reopen-training
- **标签：** 看门店发来的说明
- **摘要：** 门店刚把一段说明转到后台，看看店里认不认这项业务。
- **cost：** 1
- **类型：** evidencePass
###### 授予库存

- training-no-column

###### focus Check Ids

- tony-roster-column

##### 2. 回女客私信

- **内部 ID：** other-caller-dm
- **标签：** 回女客私信
- **摘要：** 周发来材料，可以回一句。
- **cost：** 1
- **类型：** backflowEarly
- **hook Id：** tony-other-caller-dm

##### 3. 听回放

- **内部 ID：** listen-dryer
- **标签：** 听回放
- **摘要：** 回听那条深夜语音，确认原始背景音。
- **cost：** 1
- **类型：** playback
###### 授予库存

- 吹风机回放

###### script

- **音频提示：** voice.case2.dryer-message
- **clip Label：** 回放·深夜语音
- **clip Line：** “今晚店长又说我了。也就你肯听我说这些。”话音底下，吹风机一直没停。
- **host Note：** 这句是他发的，也确实亲密。名单上的别人，得看她们各自的原话。

## 白天调查

- **白天开场：** 何昨晚只交了裁过的名单，今天才补完整截图和转账。她同意你只看店门口公开发生的事，也让那位聊过高息的朋友见你一面。宸直窗口只回答认购规则，不查 Tony 的私人账户。下午最多处理两处。
- **白天行动预算：** 2
- **最少白天场景：** 2
### 地点 1

- **内部 ID：** day-tony-shop-observe
- **标签：** 理发店外·隔窗观察
- **舞台背景：** day-city
- **类型：** observe
#### 场景正文

- **access：** 何同意你观察公开营业区；你不进店、不拍客人，也不向店员打听私人关系。
傍晚五点，你坐在理发店同侧的奶茶店外摆位，离门三四步。隔着玻璃能看见动作；门开时，最多漏出一两句。你不进店，也不拦人。

- **路线轴：** external-corroboration
##### cast

- Tony（店内）
- 熟客
- 前台

##### 场景节拍

###### 1. 场景节拍 1

**Tony（店内）：** 姐，先坐会儿。

##### 场景选择

- **提示题：** 看到这里，你带哪一层回夜里？
###### 选项

###### 1. 留在门边，听他跟熟客聊什么

- **内部 ID：** note-shared-address
- **标签：** 留在门边，听他跟熟客聊什么
- **授予物件：** 门边那句自己人
- **路线轴：** external-corroboration
###### 选择后节拍

###### 1. 选择后节拍 1

**Tony（门边）：** 自己人还排什么队啊。我把手上这个做完就轮你。

###### 2. 选择后节拍 2

**熟客：** 你可少来。今天就补颜色，别又跟我说那个。我没钱。

###### 3. 选择后节拍 3

**Tony（门边）：** 行，不说那个。你先坐，我这边马上好。

###### 2. 绕到侧窗，看他在本子上写什么

- **内部 ID：** note-service-sequence
- **标签：** 绕到侧窗，看他在本子上写什么
- **授予物件：** 他写下的跟进
- **路线轴：** process-control
- **选择后正文：** 你绕到侧窗。Tony 让刚到的熟客先坐，说做完手上这个就轮她。前台随后翻开蓝色《会员预约》册。他另拿出手机备忘录，在一格里落下几个字，隔着玻璃只认出“跟进”。

### 地点 2

- **内部 ID：** day-tony-friend-studio
- **标签：** 小姐妹的休息点
- **舞台背景：** day-studio
- **类型：** studio
#### 场景正文

- **access：** 何让那位聊过高息的朋友见你；朋友只肯说自己听过的门槛，不替 Tony 解释感情。
她那位朋友在下午场开始前的休息点等你。她说只给十分钟，不想被写成证人。

- **路线轴：** process-control
##### cast

- 小姐妹
- 你

##### 场景节拍

###### 1. 场景节拍 1

**小姐妹：** 息高那档我在酒桌上说过。一百万起。我没让她买。

###### 2. 场景节拍 2

**你：** 你先告诉我，她当时听完什么反应？

##### 场景选择

- **提示题：** 你先拆哪件事带回夜里？
###### 选项

###### 1. 先问清一百万门槛是谁说的

- **内部 ID：** split-template
- **标签：** 先问清一百万门槛是谁说的
- **授予物件：** 一百万门槛
- **路线轴：** process-control
###### 选择后节拍

###### 1. 选择后节拍 1

**小姐妹：** 门槛是我听来的，不是 Tony 教我的。何听完就问够不够自己那点钱。我当时还笑她。

###### 2. 选择后节拍 2

**你：** 行。她什么时候动心想买，我回去问她。

###### 2. 先问她后来为什么说产品在拖

- **内部 ID：** point-benefits
- **标签：** 先问她后来为什么说产品在拖
- **授予物件：** 翻手机的时间
- **路线轴：** caller-credibility
###### 选择后节拍

###### 1. 选择后节拍 1

**小姐妹：** 最近有人说赎回要排队。我怕她已经转了，才让她别再转。她回我一句：我去翻他手机。

###### 2. 选择后节拍 2

**你：** 明白。翻名单的时机，让她自己说。

### 地点 3

- **内部 ID：** day-tony-manager-doorstep
- **标签：** 宸直咨询窗口
- **舞台背景：** day-city
- **类型：** doorstep
#### 场景正文

- **access：** 何把问题转成产品门槛咨询；窗口只回答对客口径，不查代投、不认私人名单。
咨询窗口只开一条缝。柜员没让你进厅，手里捏着产品折页。

- **路线轴：** external-corroboration
- **获得物件：** 宸直窗口答复
##### cast

- 柜员
- 你

##### 场景节拍

###### 1. 场景节拍 1

**柜员：** 你问的那类产品，单笔认购至少一百万，还要做投资者资格和风险匹配。

###### 2. 场景节拍 2

**你：** 如果钱先转到别人户头，再由他来买呢？

###### 3. 场景节拍 3

**柜员：** 系统只认合同上的委托人。你没有产品全名和合同编号，我查不了。

###### 4. 场景节拍 4

**柜员：** 后面还有人办业务，先这样。

### 地点 4

- **内部 ID：** day-tony-member-docs
- **标签：** 后台·名单与转账
- **舞台背景：** day-document
- **类型：** document
#### 场景正文

- **access：** 名单、转账和要钱草稿由何本人交给节目。所有姓名与联系方式已经遮掉。
- **document Id：** case2-member-training
- **路线轴：** document-edge
- **获得物件：** 完整名单与转账

### 幕间物件映射

- **side other caller：** 周发来的材料
- **side caller stop：** 先要回单
- **training no column：** 门店的说明

## 夜 B：回拨

- **收麦锚点：** 门外传来两下敲门声
- **收麦舞台：** 她没有解释门外是谁，电话很快断了。
- **hangup Audio Cue Id：** sfx.phone.disconnect
- **主播留话：** 我听见敲门了。你先确认安全，方便的时候给后台留句话。
### 带回物开场（全部分支）

#### 门边那句自己人

- **台词：** 门边那句我听见了。他也叫别人自己人。那个熟客一听他要聊别的，马上就拦了。
##### 回拨首次冲突

- **主播台词：** 他跟熟客也这么说。你以前听见自己人，后面的话还听吗？
- **咨询者台词：** 有时候不听。我想听成关系。

#### 他写下的跟进

- **台词：** 隔着玻璃，只看见他让熟客提前做，自己又在备忘录里写跟进。没听见他怎么叫她。我就是觉得这两件事连得太快。
##### 回拨首次冲突

- **主播台词：** 他刚让熟客坐下，就在备忘录里写跟进。你以前被照顾时，问过他在记什么吗？
- **咨询者台词：** 没问。他说自己人，我就没往下问。

#### 完整名单与转账

- **台词：** 我把完整图补上了。我那行是十二万、不够起投、走他户，下面就是我自己的转账。
##### 回拨首次冲突

- **主播台词：** 十二万是你转的。你为什么还是在草稿里写养鱼骗钱？
- **咨询者台词：** 我一看名单就来气。可走他户是我点过头的，真让我一字一字说，也不能都算他偷的。

#### 吹风机回放

- **台词：** 吹风机那段我听清了。那句“也就你肯听我说这些”是他发的，背景一直是店里。
##### 回拨首次冲突

- **主播台词：** 这句听着很亲密。名单上的别人呢，你有她们自己的聊天吗？
- **咨询者台词：** 没有。只能确定他对我说过。

#### 周发来的材料

- **台词：** 她要拉人去对材料。我不去店里。我只要回单。那张名单，她要留就留。
##### 回拨首次冲突

- **主播台词：** 你支持她留表，却不肯站到店门口。怕闹大，还是怕别人问你自己也转过？
- **咨询者台词：** 都怕。十二万是我转的。我不想领头装成什么都没做。

#### 先要回单

- **台词：** 我劝她先要回单，别去堵门。我自己的预约也取消了。可我没让她删名单，这事他得自己说。
##### 回拨首次冲突

- **主播台词：** 你劝她要回单，自己也取消了预约。要是她把名单发出来，你会不会又劝她算了？
- **咨询者台词：** 不会。我就是不想带头去店里堵人。

#### 门店的说明

- **台词：** 门店那段我看了。他们说店里没让员工收这种钱。他私下做的事，让他自己解释。
##### 回拨首次冲突

- **主播台词：** 所以这不是店里的项目。你把钱转给谁了？
- **咨询者台词：** 转给他个人。

#### 一百万门槛

- **台词：** 小姐妹说，一百万门槛是她在酒桌上讲的。我听完就问自己那点钱够不够。
##### 回拨首次冲突

- **主播台词：** 现在再看，你还觉得高息是他后来才塞给你的吗？
- **咨询者台词：** 不觉得了。是我先动心。他只是说可以走他户。

#### 翻手机的时间

- **台词：** 她说产品在拖，让我别再转。我回她：我去翻他手机。名单是那之后看见的。
##### 回拨首次冲突

- **主播台词：** 风声在前，翻手机在后。你还要把今晚说成刚发现被骗吗？
- **咨询者台词：** ……我就是怕拿不回，才去翻的。

#### 宸直窗口答复

- **台词：** 窗口说，系统只认合同上的委托人。产品全名和合同编号都没有，他们不查这一笔。
##### 回拨首次冲突

- **主播台词：** 那你手里有 Tony 给的合同吗？
- **咨询者台词：** 没有。只有一张提交页面。

### 无带回物兜底开场

- **台词：** 我回来了。那张名单我又看了一遍。你白天先查了哪一处？

### 回拨立场

- **against Caller：** 让他帮我买是我问的，这我认。可我没答应被写成女朋友名册拿去养鱼。
- **with Caller：** 昨晚下线以后，我折腾到很晚。白天你查到什么，等我先把昨晚的消息说完。

### 回拨先行拍

#### lines

##### 1. lines 1

**咨询者：** 我现在在我妈家，她电视还开着。要是吵，你跟我说。

##### 2. lines 2

**林旭阳：** 昨晚窗外突然亮了一下，接着有人敲门。到底谁来了？

##### 3. lines 3

**咨询者：** 有人来问了几句话。我现在不太想说。

##### 4. lines 4

**林旭阳：** 先不说门口的人。你现在安全吗？

##### 5. lines 5

**咨询者：** 安全。可再往下说，直播间里可能有人认出我。你先问别的，行吗？

##### 6. lines 6

**林旭阳：** 行，店名和你现在住哪儿都不说。等会儿我只问谁来过、为什么来；不该公开的地方就停。

### 立场快照回应拍

- **respondent problem：** 昨晚你问他为什么总说‘自己人’。今晚完整名单摆上来，再看这句话后面接的是什么。
- **industry gray：** 昨晚你说右半张是我裁的。是我裁的。今晚金额和账户栏一起摆。
- **caller complicit：** 昨晚你说我拿半张名单先讲养鱼。完整图在这儿，我自己那行也不遮了。

### 夜 B · 1｜tony-who-messaged

**林旭阳：** 昨晚是谁敲门？

**咨询者：** 就是有人来问了几句话。跟他没直接关系。我现在不想说是谁。

#### no Clue Reaction

**咨询者：** 我说了，现在不想讲是谁。你别逼我。

- **interaction Mode：** lineReplay
- **线索职能：** reversal
- **错误框架：** 昨晚只是临时有人找她，与她隐瞒的钱没有关系。
#### 回收目标

- tony-bar-rumor-hangup

- **说话人 ID：** he
- **现场疑点：** 警察上门与她借过钱有关，不是名单上的女友找来。
- **矛盾：** 她第一夜用一句临时有事切断连线，第二夜才承认警方已经上门核实借款。
- **可靠度：** mixed
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 他们问了多久？

**咨询者：** 十来分钟。问我什么时候借的、怎么联系上的。

- **source Anchor：** 问了几句话

##### 2. 自由追问 2

**林旭阳：** 你为什么搬到妈妈家？

**咨询者：** 昨晚那一下把我吓着了。一个人待着心里发慌。

- **source Anchor：** 我现在不想说是谁

#### 场尾自动拍

##### lines

###### 1. lines 1

**林旭阳：** 你为什么会去借这种钱？

###### 2. lines 2

**咨询者：** 那阵子手里正好空了，又想多凑点跟着买。具体借了多少，我今晚不想说。

###### 3. lines 3

**林旭阳：** 你到底做什么工作？

###### 4. lines 4

**咨询者：** 我在酒吧做营销。订台、看桌，客人开的酒我有提成。

###### 5. lines 5

**林旭阳：** 钱来得快，也花得快？

###### 6. lines 6

**咨询者：** 嗯。有时候当晚结，第二天就花了。

###### 7. lines 7

**林旭阳：** 高息也是在酒桌上听的？

###### 8. lines 8

**咨询者：** 嗯。酒桌上听的。我后来才去问他。

###### 9. lines 9

**林旭阳：** 好。你后来问了什么，接着说。

#### closure Contract

- **entry Anchor：** 昨晚是谁敲门
- **closer Anchor：** 你后来问了什么
- **adds：** 昨晚敲门的是警察，因放款人涉案来核实借款；她说当时手里正空，又想多凑点跟着买，随后承认在酒吧做营销，高息传闻也来自酒桌。
- **open Edge：** 她借了多少、有没有还清，以及后来具体怎样找 Tony 代投。
- **route Independent：** true

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 你一直说只是临时有事。昨晚敲门的到底是谁？

**咨询者：** 警察。

**林旭阳：** 为什么找你？

**咨询者：** 给我放高利贷的那个人涉案了。他们来问借过钱的人。

- **source Anchor：** 我现在不想说是谁
- **玩家所选怀疑方向：** 昨晚敲门的人
- **防备回答：** 来问我几句话的人。
###### logic Contract

- **premise Anchor：** 昨晚是谁敲门
- **source Kind：** caller-statement
- **source Proves：** 第一夜确实有人上门，咨询者第二夜承认来人是警察，原因与涉案放款人有关。
- **source Does Not Prove：** 不能证明她涉嫌违法，也不知道她借了多少、是否仍欠。
- **answer Anchor：** 放高利贷的那个人涉案了
- **answer Adds：** 敲门伏笔闭合为警方核实借款人，而非恋爱纠纷。
- **next Legal Question：** 可以追她借款与工作的关系，再问她后来为什么找 Tony；不能替警方给她定性。

- **矛盾：** 她把警方上门压成临时有事，隐瞒自己曾向涉案放款人借钱。
- **是否核心项：** true
- **路线轴：** document-edge
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 你现在住妈妈家，是怕对方还会再来？

**咨询者：** 不是怕谁再来。我昨晚被吓着了，一个人待着慌，就先搬回我妈这儿住两天。

###### miss Reaction

**咨询者：** 我住我妈家怎么了？昨晚来的是谁，我现在不说。

- **source Anchor：** 跟他没直接关系
- **玩家所选怀疑方向：** 她为什么换了住处
- **是否核心项：** false
- **路线轴：** caller-credibility
- **路线口气：** detour

#### 压力表演

- **意图钩子：** 来人不是名单女友
- **防备状态：** guarded
##### 表情/听感

- **类型：** shift
背景里的电视声一直没停，她隔一会儿看一眼门口

### 夜 B · 2｜tony-caller-benefits

**林旭阳：** 你补来的转账我看了，十二万，怎么到他手里的？

**咨询者：** 是我转的。他当时说可以帮忙，我就信了。

#### no Clue Reaction

**咨询者：** 钱是钱，关系是关系。你别一句话把两件事并了。

- **interaction Mode：** lineReplay
- **线索职能：** reversal
- **错误框架：** 十二万是他从恋爱里骗走的钱。
#### 回收目标

- tony-who-messaged

- **说话人 ID：** he
- **现场疑点：** 钱是她为了跨过起投主动转的。
- **矛盾：** 开场要回被骗的钱，这里承认是自己让他代买。
- **可靠度：** mixed
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 转钱以前，你见过产品合同吗？

**咨询者：** 没有。他说先把钱并进去，材料后面给。

- **source Anchor：** 可以帮忙

##### 2. 自由追问 2

**林旭阳：** 转完他给你看过什么？

**咨询者：** 他发过一张提交页面，说已经帮我下了。产品全名、合同和回单，我手里都没有。

- **source Anchor：** 是我转的

##### 3. 自由追问 3

**林旭阳：** 你为什么一直找他做头发？

**咨询者：** 我下班晚，他肯留最后的号。染发、护理我都找他，酒吧一晚的提成有时候当晚就结，我花钱也快。

- **source Anchor：** 他当时说

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 是你开口让他帮你买，还是他先劝你把钱给他？

**咨询者：** 我先问的。

**林旭阳：** 你问的原话？

**咨询者：** 我说自己不够一百万，能不能跟着买。他说他那边已经够门槛，我这十二万可以并进去，走他户。

- **source Anchor：** 是我转的
- **玩家所选怀疑方向：** 代投是谁先提的
###### 唯一核心反转过场

- **内部 ID：** case2-proxy-invest
- **类型：** reveal
- **过场短标：** 钱怎么出去的
- **标签：** 十二万，谁先开的口
- **visual Variant：** proxy-ledger

- **防备回答：** 我先问的。
###### logic Contract

- **premise Anchor：** 是我转的
- **source Kind：** caller-statement
- **source Proves：** 咨询者承认十二万由自己转给他，并称对方答应帮忙。
- **source Does Not Prove：** 还不能判断是谁先提出代投、钱是否已经买成产品，也不能证明他有代销资格。
- **answer Anchor：** 我先问的
- **answer Adds：** 双方口头约定用他的账户绕过她个人不足一百万的门槛，不是他从恋爱里偷划。
- **next Legal Question：** 可以问她何时决定要回，不能把代投直接写成已证实的侵占。

- **矛盾：** 她把十二万讲成被骗，实际是自己开口让他代投。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** pressure-point

##### 2. 关键追问 2

**林旭阳：** 转完以后，你还当自己在跟他谈吗？

**咨询者：** 当。他还是留晚档，还是叫自己人。我没把这十二万从恋爱里拆出来。

###### miss Reaction

**咨询者：** 那时候我自己也乱。你非要把钱和关系一起问，我答不了。

- **source Anchor：** 他当时说可以帮忙
- **玩家所选怀疑方向：** 转钱之后关系怎么变
- **是否核心项：** false
- **路线轴：** identity-wording
- **路线口气：** caller-skeptical

#### 压力表演

- **意图钩子：** 十二万是她让他代投
- **防备状态：** guarded
##### 表情/听感

- **类型：** shift
她盯着屏幕，很久没接话

### 场前情绪反应

- **内部 ID：** tony-trust-screenshot-followup
- **类型：** interruptToast
- **cost：** 0
- **before Scene Index：** 6
- **from：** 周的补充材料
#### lines

##### 1. lines 1

**林旭阳：** 周后来把材料转你了吗？

##### 2. lines 2

**咨询者：** 转了三张图：她给他的一百万、他说先放进宸直的聊天，还有一张认购回单。

##### 3. lines 3

**林旭阳：** 你能确定回单就是她转的那一百万吗？

##### 4. lines 4

**咨询者：** 不能。我手里只有她转来的图。是不是同一笔钱，我看不出来。我那十二万进没进产品，更看不见。

### 场前情绪反应

- **内部 ID：** tony-comment-benefit-blowup
- **类型：** emotionalChoice
- **cost：** 0
- **before Scene Index：** 6
- **from：** 来电人看见弹幕
#### lines

##### 1. lines 1

**咨询者：** 等会儿。刚那条弹幕我看见了——『收了好处装什么受害者』。

##### 2. lines 2

【停顿】

##### 3. lines 3

**咨询者：** 谁装了？！息是我自己想买的！你们倒是来一个人凑一百万试试啊！

#### choices

##### 1. 弹幕我来管。你跟我说话，别跟屏幕吵。

- **内部 ID：** soothe
- **direction Label：** 先把弹幕挡开
- **标签：** 弹幕我来管。你跟我说话，别跟屏幕吵。
###### lines

###### 1. lines 1

**咨询者：** ……嗯。你问吧。

- **立场变化：** open
- **路线轴：** caller-credibility
- **路线口气：** reassure
- **recap Aftertaste：** 她被弹幕激怒时，我先把那条弹幕划掉，让她只跟我说。

##### 2. 这条说得难听，但问到了你自己想买。你愿意只答这一层吗？

- **内部 ID：** push-back
- **direction Label：** 继续追她开口代投
- **标签：** 这条说得难听，但问到了你自己想买。你愿意只答这一层吗？
###### lines

###### 1. lines 1

**咨询者：** ……我先问的。行了吧。

###### 2. lines 2

【停顿】

###### 3. lines 3

**咨询者：** 往下问。

- **立场变化：** defensive
- **路线轴：** caller-credibility
- **路线口气：** pressure-point
- **recap Aftertaste：** 那条弹幕说得难听，我还是问了她是不是自己想买。她没有挂断，接着说了。

##### 3. (不接话)

- **内部 ID：** silence
- **direction Label：** 不接这条弹幕
- **标签：** (不接话)
- **不出声：** true
###### lines

###### 1. lines 1

【你把那条弹幕划掉了，没念。】

###### 2. lines 2

**咨询者：** ……算了。当我没看见。

- **立场变化：** neutral
- **路线轴：** caller-credibility
- **路线口气：** neutral
- **recap Aftertaste：** 她看到那条弹幕时，我没有追着问。等她自己说继续，我们才往下走。

### 夜 B · 3｜tony-next-push-column

**林旭阳：** 昨晚你已经看见这张名单了。现在把你自己那行念完。

**咨询者：** 完整名单我昨晚就看完了。我那行写着十二万、不够起投、走我户。周那行是一百万、已买。我发给后台时把这些都裁掉了。

- **interaction Mode：** testimonyWall
- **线索职能：** payoff
- **错误框架：** 发现名单的今晚，才是她第一次知道风险。
#### 回收目标

- tony-caller-benefits

- **说话人 ID：** he
#### 正文前节拍

##### lines

###### 1. lines 1

**林旭阳：** 名单上的周呢，她到底是来剪头的，还是你说的那种女朋友？

###### 2. lines 2

**咨询者：** ……来剪头的。她那行没有亲密度，只有一百万和已买。

###### 3. lines 3

**林旭阳：** 这两列你昨晚就看见了。

###### 4. lines 4

**咨询者：** 看见了。可我那时候气疯了，就想让你们先看那一排女人。现在让我再说周是他女朋友……我说不出口。

#### testimony Wall

- **标题：** 把半张名单补回右半边
- **引子：** 四句先在墙上。追问她何时知道起投门槛，才会多出最后一句。
- **split After：** 3
- **mid Summary：** 名单能证明她裁过字段，也有‘帮我买’的原话；钱到底进没进产品，还是不知道。
- **soft Anchor Response：** ‘帮我买’正好碰到这句。正式指认前，先让她把藏着的那句说全。
##### miss Feedback

###### evidence

- 这张还没剪到钱那一栏。她顺手又把话带回那排名字。
- 页又拿偏了。她只肯说：‘你们还是只想问我为什么转钱。’

###### statement

- 材料是右半边，句子却没落在她改口那句上。她开始绕。
- 第二次还压错原句。她把‘帮我买’四个字咽回去了。

##### relief Beat

- **listener Id：** @刘海修歪也要留证
- **评论：** 第一次见追款还得先把截图取消裁剪。
- **主播台词：** 先别替截图伸冤，右半边是她自己裁的。

##### statements

###### 1. 证词 01

- **内部 ID：** tony-list-was-romantic
- **标签：** 证词 01
我看到一排女人和亲密度，第一反应当然是他拿谈恋爱吊着人。

- **press Response：** ‘那排名字就是全是女的。右边的钱……我等会儿说。’
- **present Response：** 这张材料能拆掉‘纯女友名册’，还不能替她确认关系或资金结果。

###### 2. 证词 02

- **内部 ID：** tony-heard-threshold-before
- **标签：** 证词 02
转钱以前，小姐妹提过高息档一百万起投，我只当听个热闹。

- **press Response：** ‘小姐妹是提过一百万。后来……后来我确实问过 Tony，能不能让我跟着买。’
- **present Response：** 一百万门槛能解释她为什么找人帮买，不能证明 Tony 后来怎么处置十二万。
###### reveals

- tony-romance-only-claim

###### 3. 证词 03

- **内部 ID：** tony-transfer-was-hers
- **标签：** 证词 03
十二万是我自己转的，备注没写，但聊天里有‘帮我买’。

- **press Response：** ‘钱是我转的。可他收了以后，合同呢？’
- **present Response：** 转账行能确认钱从她这里出去，不能单独确认进了哪一项产品。

###### 4. 证词 04

- **内部 ID：** tony-cropped-to-protect-self
- **标签：** 证词 04
我裁掉金额和‘走我户’，是怕原图一发，大家先问我为什么把钱转给他。

- **press Response：** ‘我不想一发出来就被围着骂。右边是我裁的。’
- **present Response：** 这句已经承认裁图动机，材料可以核对，但不是决定性冲突本身。

###### 5. 补充证词

- **内部 ID：** tony-romance-only-claim
- **标签：** 补充证词
- **hidden：** true
这十二万就是他借谈恋爱骗走的，我只是把自己的钱要回来。

- **press Response：** ‘他就是拿谈恋爱收的钱！谁先说帮买……你别又绕回我。’
- **present Response：** 如果只拿恋爱称呼压这句，仍然会漏掉她主动绕过门槛的资金动作。

##### acts

###### 1. 把半张名单补回右半边

- **内部 ID：** act1
- **标题：** 把半张名单补回右半边
- **wink Line：** 先把原图放完整。
- **wink Tier：** tier3-accomplice
- **引子：** 四句先在墙上。追问她何时知道起投门槛，才会多出最后一句。
- **split After：** 3
- **mid Summary：** 名单能证明她裁过字段，也有‘帮我买’的原话；钱到底进没进产品，还是不知道。
- **soft Anchor Response：** ‘帮我买’正好碰到这句。正式指认前，先让她把藏着的那句说全。
###### relief Beat

- **listener Id：** @刘海修歪也要留证
- **评论：** 第一次见追款还得先把截图取消裁剪。
- **主播台词：** 先别替截图伸冤，右半边是她自己裁的。

###### statements

###### 1. 证词 01

- **内部 ID：** tony-list-was-romantic
- **标签：** 证词 01
我看到一排女人和亲密度，第一反应当然是他拿谈恋爱吊着人。

- **press Response：** ‘那排名字就是全是女的。右边的钱……我等会儿说。’
- **present Response：** 这张材料能拆掉‘纯女友名册’，还不能替她确认关系或资金结果。

###### 2. 证词 02

- **内部 ID：** tony-heard-threshold-before
- **标签：** 证词 02
转钱以前，小姐妹提过高息档一百万起投，我只当听个热闹。

- **press Response：** ‘小姐妹是提过一百万。后来……后来我确实问过 Tony，能不能让我跟着买。’
- **present Response：** 一百万门槛能解释她为什么找人帮买，不能证明 Tony 后来怎么处置十二万。
###### reveals

- tony-romance-only-claim

###### 3. 证词 03

- **内部 ID：** tony-transfer-was-hers
- **标签：** 证词 03
十二万是我自己转的，备注没写，但聊天里有‘帮我买’。

- **press Response：** ‘钱是我转的。可他收了以后，合同呢？’
- **present Response：** 转账行能确认钱从她这里出去，不能单独确认进了哪一项产品。

###### 4. 证词 04

- **内部 ID：** tony-cropped-to-protect-self
- **标签：** 证词 04
我裁掉金额和‘走我户’，是怕原图一发，大家先问我为什么把钱转给他。

- **press Response：** ‘我不想一发出来就被围着骂。右边是我裁的。’
- **present Response：** 这句已经承认裁图动机，材料可以核对，但不是决定性冲突本身。

###### 5. 补充证词

- **内部 ID：** tony-romance-only-claim
- **标签：** 补充证词
- **hidden：** true
这十二万就是他借谈恋爱骗走的，我只是把自己的钱要回来。

- **press Response：** ‘他就是拿谈恋爱收的钱！谁先说帮买……你别又绕回我。’
- **present Response：** 如果只拿恋爱称呼压这句，仍然会漏掉她主动绕过门槛的资金动作。

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** case2-member-training:m03
- **statement Id：** tony-romance-only-claim
- **selection Reason：** m03 同时钉住 12 万、不够 100 万起投与‘走 Tony 户’，能把 A 面的纯恋爱受害叙述翻到 B 面的主动代投和绕门槛；它仍不证明产品已买入，也不替 Tony 免责。
###### material Cards

###### 1. 何：12 万／不够 100 万起投／走 Tony 户

- **内部 ID：** case2-member-training:m03
- **类型：** 名单原行
- **标签：** 何：12 万／不够 100 万起投／走 Tony 户
- **excerpt：** 她裁掉的右半边，把金额、门槛和代持账户写在同一行。
- **source Label：** 名单与十二万转账

###### 2. 周：100 万／已买

- **内部 ID：** case2-member-training:m02
- **类型：** 名单原行
- **标签：** 周：100 万／已买
- **excerpt：** 另一名顾客的行没有亲密度，不能直接套成恋爱关系。
- **source Label：** 名单与十二万转账

###### 3. 何→Tony：¥120,000

- **内部 ID：** case2-member-training:m05
- **类型：** 转账记录
- **标签：** 何→Tony：¥120,000
- **excerpt：** 转账备注为空；聊天写‘帮我买’。
- **source Label：** 名单与十二万转账

- **咨询者台词：** ……是我先问能不能跟着买。把这十二万全说成恋爱里骗走的，确实省了前面那一步。
- **主播台词：** 那就别把前面那一步裁掉。十二万是你转的，也是你自己开口让他代投。你后来改口恋爱诈骗，这个说法我不认。
- **boundary Line：** 名单原行证明主动代投与门槛绕行，不证明认购完成、全部损失或 Tony 没有误导关系。
- **矛盾：** 咨询者把主动要求的十二万元代投改写成只由恋爱欺骗造成的转款。
- **路线轴：** money-flow
- **continue Label：** 继续追十二万的实际去向

###### 2. 把‘都是他带的气氛’再问一遍

- **内部 ID：** act2
- **status Label：** 她改口了 · 第二段说法
- **标题：** 把‘都是他带的气氛’再问一遍
- **引子：** 她认下是自己开口让 Tony 帮买，转而把决定全推给店里的气氛。第二段仍可自由追问、普通出示；正式指认另有两次机会。
###### opener Fact Keywords

- 十二万
- 帮我买

###### opener Lines

###### 1. opener Lines 1

**咨询者：** 你先听我说完。十二万是我转的，‘帮我买’也是我发的，这些我认。可那天店里一直在聊高息档，Tony 又把我叫自己人，说能带我进去。周围的人都像听懂了，就我一个人说不买，我当时真的张不开嘴。转钱以前，我根本不知道还有一百万这道门槛。

###### 2. opener Lines 2

**林旭阳：** 那就从你进店那天说。高息档是谁先提起来的？

###### 3. opener Lines 3

**咨询者：** Tony 先说高息档，又说自己已经够门槛，我才问能不能把我的十二万一起放进去。他说可以，我就转了。那天以前，没人跟我讲过一百万。要不是他一直叫我自己人，我也不会把钱直接转到他个人账户。

- **revised Frame：** 她承认自己主动要求代投，又把绕门槛的决定包装成 Tony 一个人营造的从众压力。
- **split After：** 2
- **mid Summary：** 她这次认了小姐妹先提门槛，也认了自己去问 Tony；现在争的是，十二万到底有多少是她自己的决定。
- **soft Anchor Response：** 小姐妹先提门槛这一行碰到了她的新说法。正式指认仍要落到‘全是 Tony 带的气氛’那句上。
###### comparison

###### 1. comparison 1

- **statement Id：** tony-list-was-romantic
- **status：** 变了说法

###### 2. comparison 2

- **statement Id：** tony-heard-threshold-before
- **status：** 变了说法

###### 3. comparison 3

- **statement Id：** tony-transfer-was-hers
- **status：** 变了说法

###### 4. comparison 4

- **statement Id：** tony-cropped-to-protect-self
- **status：** 她收回了

###### 5. comparison 5

- **statement Id：** tony-romance-only-claim
- **status：** 被打破

###### statements

###### 1. 改口 01

- **内部 ID：** tony-atmosphere-was-his-alone
- **标签：** 改口 01
是我先问他能不能帮我买。可那天不跟，好像就我一个人不识货。转钱以前，我根本没听过一百万门槛。

- **press Response：** ‘那种场面你不在。小姐妹是随口一说，Tony 才是当着我的面说能带我进去。’
- **present Response：** 只拿 Tony 的名单还不够，得找出门槛第一次进到她耳朵里的时间。

###### 2. 改口 02

- **内部 ID：** tony-transfer-instruction-admitted
- **标签：** 改口 02
十二万是我转的，聊天里的‘帮我买’也是我发的，这些我不改。

- **press Response：** ‘钱是我转的，话也是我发的。可他收了以后，合同呢？’
- **present Response：** 转账记录能核对金额和原话，不能直接补出产品去向。
- **survives From Act1：** tony-transfer-was-hers

###### 3. 改口 03

- **内部 ID：** tony-product-result-still-unknown
- **标签：** 改口 03
我是让他帮我买，可钱到底进了什么，他到现在没给我看。

- **press Response：** ‘我现在只要产品名、合同、回单。别的先不谈。’
- **present Response：** 名单和转账都没有认购回单，放在这里仍只能继续追钱路。
- **survives From Act1：** tony-romance-only-claim

###### 4. 改口 04

- **内部 ID：** tony-crop-admission-kept
- **标签：** 改口 04
右半边是我裁的。我怕大家一上来先骂我贪利息。

- **press Response：** ‘右边是我裁的，这点我不躲。可“自己人”是他说的。’
- **present Response：** 原图能核对她裁了什么，不需要再用一次正式指认。
- **survives From Act1：** tony-cropped-to-protect-self

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** tony-next-push-column:tony-heard-threshold-before
- **statement Id：** tony-atmosphere-was-his-alone
###### boundary Line Key Phrases

- 不替 Tony 免除
- 不能证明她没有受现场压力

- **selection Reason：** 第一段里她亲口承认，转钱前小姐妹已经提过一百万起投。把这句原话放回第二段，能打穿‘转钱前根本没听过门槛’的新框架；同时保留 Tony 的关系暗示和资金去向责任。
###### material Cards

###### 1. 转钱前 · 小姐妹提过 100 万起投

- **内部 ID：** tony-next-push-column:tony-heard-threshold-before
- **类型：** 第一段原话回放
- **标签：** 转钱前 · 小姐妹提过 100 万起投
- **excerpt：** ‘转钱以前，小姐妹提过高息档一百万起投，我只当听个热闹。’
- **source Label：** 第一段证词 02

###### 2. 何→Tony：¥120,000

- **内部 ID：** case2-member-training:m05
- **类型：** 转账记录
- **标签：** 何→Tony：¥120,000
- **excerpt：** 能确认她主动发出‘帮我买’，不能单独说明门槛最初由谁提起。
- **source Label：** 名单与十二万转账

###### 3. 不够 100 万起投／走 Tony 户

- **内部 ID：** case2-member-training:m03
- **类型：** 名单原行
- **标签：** 不够 100 万起投／走 Tony 户
- **excerpt：** 能确认帮买结构，不能把更早的口头来源改写成 Tony 一个人。
- **source Label：** 名单与十二万转账

- **咨询者台词：** 小姐妹先提过一百万。后来是我自己又去问 Tony，也是我转的钱。这个不能全算成他逼我。
- **主播台词：** 小姐妹先提过一百万，是你自己又去问 Tony，钱也是你转的。你不能一听说产品在拖，就把前面两步全改成店里逼你。
- **boundary Line：** 她第一段的原话只推翻‘转钱前没人讲过门槛’；不替 Tony 免除资金去向与关系暗示责任，也不能证明她没有受现场压力。
- **矛盾：** 咨询者承认主动代投后，把绕门槛全解释成 Tony 营造的现场压力；更早的小姐妹口头提醒推翻了这层圆谎。
- **路线轴：** money-flow
- **continue Label：** 继续追十二万的实际去向

#### decisive Present

- **max Attempts：** 2
- **evidence Id：** case2-member-training:m03
- **statement Id：** tony-romance-only-claim
- **selection Reason：** m03 同时钉住 12 万、不够 100 万起投与‘走 Tony 户’，能把 A 面的纯恋爱受害叙述翻到 B 面的主动代投和绕门槛；它仍不证明产品已买入，也不替 Tony 免责。
##### material Cards

###### 1. 何：12 万／不够 100 万起投／走 Tony 户

- **内部 ID：** case2-member-training:m03
- **类型：** 名单原行
- **标签：** 何：12 万／不够 100 万起投／走 Tony 户
- **excerpt：** 她裁掉的右半边，把金额、门槛和代持账户写在同一行。
- **source Label：** 名单与十二万转账

###### 2. 周：100 万／已买

- **内部 ID：** case2-member-training:m02
- **类型：** 名单原行
- **标签：** 周：100 万／已买
- **excerpt：** 另一名顾客的行没有亲密度，不能直接套成恋爱关系。
- **source Label：** 名单与十二万转账

###### 3. 何→Tony：¥120,000

- **内部 ID：** case2-member-training:m05
- **类型：** 转账记录
- **标签：** 何→Tony：¥120,000
- **excerpt：** 转账备注为空；聊天写‘帮我买’。
- **source Label：** 名单与十二万转账

- **咨询者台词：** ……是我先问能不能跟着买。把这十二万全说成恋爱里骗走的，确实省了前面那一步。
- **主播台词：** 那就别把前面那一步裁掉。十二万是你转的，也是你自己开口让他代投。你后来改口恋爱诈骗，这个说法我不认。
- **boundary Line：** 名单原行证明主动代投与门槛绕行，不证明认购完成、全部损失或 Tony 没有误导关系。
- **矛盾：** 咨询者把主动要求的十二万元代投改写成只由恋爱欺骗造成的转款。
- **路线轴：** money-flow
- **continue Label：** 继续追十二万的实际去向

- **现场疑点：** 翻脸时机在风险传闻之后，不在刚发现恋爱破裂。
- **矛盾：** 她用发现名单覆盖自己知情代投、又在风声后改口。
- **可靠度：** mixed
#### 自由追问

##### 1. 自由追问 1

**林旭阳：** 你现在还去那家店吗？

**咨询者：** 号还留着，人没去。头发长了，随便找了家快剪。

- **source Anchor：** 完整名单

##### 2. 自由追问 2

**林旭阳：** 小姐妹后来还找过你吗？

**咨询者：** 找了。她说这产品最近在拖，让我别再转。我才翻他手机的。

- **source Anchor：** 周那行

##### 3. 自由追问 3

**林旭阳：** 这张名单你还转给过谁？

**咨询者：** 只发给小姐妹和你们后台。给你们之前我遮了名字，还没发到网上。

- **source Anchor：** 发给后台

#### 场尾自动拍

##### lines

###### 1. lines 1

**林旭阳：** 行，我看到你那一行了。今晚先到——

###### 2. lines 2

**咨询者：** 最后说个事。跟名单没关系。

###### 3. lines 3

【停顿】

###### 4. lines 4

**咨询者：** 上礼拜他还给我修过刘海，手特别轻。我就想不明白，他给我剪头发那么仔细，怎么又能一边跟我谈、一边让别人走他户。

###### 5. lines 5

**林旭阳：** 我明白。先说到这儿。

#### closure Contract

- **entry Anchor：** 看到你那一行
- **closer Anchor：** 修过刘海
- **adds：** 证据讨论结束时她主动补回一次细致服务，手艺与推销同时存在。
- **open Edge：** 钱进没进产品、他有没有资格、她还要不要把代投讲成恋爱诈骗。
- **route Independent：** true

#### 关键追问

##### 1. 关键追问 1

**林旭阳：** 你自己写的是：‘十二万、不够起投、走我户。’原图要是发出去，你还会说这十二万是他借谈恋爱骗走的吗？

**咨询者：** 想过。所以我才裁图。

**林旭阳：** 原图里有你的什么？

**咨询者：** 十二万，不够起投，走我户。

**林旭阳：** 直接发出去呢？

**咨询者：** 我知道门槛，还自己问他能不能帮我买。那我再说是他借谈恋爱把钱划走，谁还信。

**林旭阳：** 你是什么时候开始翻他手机的？

**咨询者：** 小姐妹说产品在拖以后。我这才翻他手机，才打进来要钱。

- **source Anchor：** 完整名单我昨晚就看完了
- **玩家所选怀疑方向：** 重读‘走我户’那行
- **防备回答：** ……会。走我户三个字在上面。
###### resistance Beat

###### lines

###### 1. lines 1

**咨询者：** 非得现在念这一行吗？

###### 2. lines 2

**林旭阳：** 右半张是你裁掉的。我只是把原图读全。

###### logic Contract

- **premise Anchor：** 完整名单我昨晚就看完了
- **source Kind：** caller-statement
- **source Proves：** 她第一夜已看完全表，公开会同时带出她的代投备注。
- **source Does Not Prove：** 不能证明公开就能要回十二万，也不能证明产品已经损失。
- **answer Anchor：** 所以我才裁图
- **answer Adds：** 她承认完整图会让观众看到自己明知门槛仍主动求他帮买，也承认是在听说产品拖延后才翻手机、打进来要钱。
- **next Legal Question：** 可以问她若只给回单不退现金还公开不明，不能替她决定是否报案。

- **矛盾：** 她想用半张名单取得恋爱受害者位置，同时有意藏起自己主动代投的事实。
- **是否核心项：** true
- **路线轴：** active-provocation
- **路线口气：** caller-skeptical

##### 2. 关键追问 2

**林旭阳：** 小姐妹说产品在拖，是在你转钱之前，还是之后？

**咨询者：** 什么时候听说的，跟他该不该还我钱有什么关系？

- **source Anchor：** 完整名单我昨晚就看完了
- **玩家所选怀疑方向：** 她何时听说可能拿不回
- **是否核心项：** false
- **路线轴：** money-flow
- **路线口气：** caller-skeptical

#### 压力表演

- **意图钩子：** 风声一来才翻脸
- **防备状态：** guarded
##### 表情/听感

- **类型：** shift
她把那张截图放大了，又缩回去

### 场间实时反压

- **内部 ID：** tony-business-letter
- **类型：** interruptToast
- **cost：** 0
- **after Scene Index：** 6
- **from：** 老方（后台同步）
- **声纹卡 ID：** producer-lao-fang
店家商务函到平台了，点名这通。法务让缓。你要继续，数据得扛住。——方

#### choices

##### 1. 这张名单继续问。

- **内部 ID：** keep-asking-table
- **direction Label：** 顶着商务函继续问名单
- **标签：** 这张名单继续问。
###### lines

###### 1. lines 1

【后台的推荐提示从绿色变成灰色：本场停止推荐。】

- **路线口气：** pressure-point
- **ending Impact：** platform-data-loss
- **recap Aftertaste：** 商务函压过来那下，我没有换话题。后台随即停了这场的推荐。

##### 2. 店名先不说了，只问这张名单。

- **内部 ID：** ask-person-not-shop
- **direction Label：** 收住店名，只问她自己那行
- **标签：** 店名先不说了，只问这张名单。
###### lines

###### 1. lines 1

【老方回了一个‘收到’，平台提示没有再升级。】

- **路线轴：** identity-wording
- **recap Aftertaste：** 商务函压过来以后，我收了店名，只问那张名单是谁写的、写了什么。
###### question Override

- **scene Id：** tony-next-push-column
- **option Index：** 0
- **主播问句：** 店名不说了。那列备注，你念你自己那行就行。

### 回拨后立场

#### from Snapshot Option Ids

- **respondent problem：** open
- **industry gray：** neutral
- **caller complicit：** defensive

- **default：** neutral
#### lines

- **defensive：** 我差点不打回来。昨晚那张图是我裁的，这个我认。可他为什么收我的钱，也得问。
- **open：** 我回来了。名单的事你继续问。这回我不先说他养鱼。
- **neutral：** 我回来了。完整名单和转账都发后台了。

## 材料、回流与可选追查

### 证据卡

#### 1. 她发来的半张名单

- **内部 ID：** daily-tony-roster
- **表现类型：** 名单
- **标题：** 她发来的半张名单
- **front：** 女性姓名、亲密度、下次约。每一行都在右侧同一个位置断掉。
- **detail：** 第一夜只能看出截图被裁过，还不知道右边具体写了什么。
##### targets

- truthWithGap
- sceneHint

- **矛盾：** 来电人用左半张图指认养鱼，却裁掉了改变整张表性质的金额栏。

#### 2. 走我户

- **内部 ID：** daily-tony-chat-copy
- **表现类型：** 聊天截图
- **标题：** 走我户
- **front：** 咨询者说不够一百万，Tony 回不够起投、走我户。
- **detail：** 这是代投约定，不是从恋爱账户偷划。
##### targets

- halfLie

- **矛盾：** 十二万由她先开口转出。

#### 3. 十二万到他户

- **内部 ID：** daily-tony-card
- **表现类型：** 转账记录
- **标题：** 十二万到他户
- **front：** 咨询者向 Tony 转出十二万。名单同行写着不够起投。
- **detail：** 十二万到了 Tony 账户。产品名、合同和回单还没交。
##### targets

- sceneHint

- **矛盾：** 要回的钱和代投备注是同一笔，不是另一笔恋爱开销。

### 材料圈点

#### 1. 完整名单

- **内部 ID：** tony-roster-column
##### revalues

- tony-list-as-dating
- tony-list-columns

- **标题：** 完整名单
- **提示题：** 第一夜的截图，少了哪一部分？
- **材料：** 后台把第一夜截图与第二天补交的原图并排。
##### 材料行

- 何｜12万｜不够100万起投｜走Tony户｜下次约
- 周｜100万｜已买｜跟进
- 林｜跟进｜未写金额
- 发型需求栏｜空

##### 选项

###### 1. 右侧的金额与产品栏

- **标签：** 右侧的金额与产品栏
- **是否核心项：** true
- **矛盾：** 名单在记门槛和账户，不是女友名册。
- **反馈：** 金额、起投和账户备注都在右边。你第一夜发图时为什么把这一块裁掉？
- **人物反应：** 是我裁的。我当时不想让你们先问钱。
- **revises Scene：** 0
- **路线轴：** document-edge

###### 2. 下次约

- **标签：** 下次约
- **是否核心项：** false
- **反馈：** 下次约第一夜已经出现。少的是整片右栏。
- **人物反应：** 下次约这三个字，我第一眼就抓住了。
- **路线轴：** identity-wording

###### 3. 全是女的

- **标签：** 全是女的
- **是否核心项：** false
- **反馈：** 女客多没有消失，但这不是第一夜截图少掉的部分。
- **人物反应：** 全是女的这一层，我到现在还觉得刺。
- **路线轴：** caller-credibility

#### 2. 十二万转账

- **内部 ID：** tony-spend-and-referrals
##### revalues

- tony-caller-benefits

- **标题：** 十二万转账
- **提示题：** 谁先提出把钱交给 Tony？
- **材料：** 咨询者导出的转账与名单同行。
##### 材料行

- 何→Tony｜¥120,000｜备注空
- 名单｜何｜不够起投，走Tony户
- 聊天｜我不够一百万，能不能帮我买

##### 选项

###### 1. 她先问能不能帮我买

- **标签：** 她先问能不能帮我买
- **是否核心项：** true
- **矛盾：** 十二万是她开口后的转账。
- **反馈：** 聊天里那句‘能不能跟着买’是你发的。代投是谁先提的？
- **人物反应：** 我先问的。这句我认。
- **路线轴：** money-flow

###### 2. 备注空

- **标签：** 备注空
- **是否核心项：** false
- **反馈：** 转账备注空，解释不了是谁提出代投。
- **人物反应：** 备注是空的。他没写理财两个字。
- **路线轴：** document-edge

###### 3. 金额是十二万

- **标签：** 金额是十二万
- **是否核心项：** false
- **反馈：** 十二万在转账记录里。谁先提出代投，要看聊天原话。
- **人物反应：** 金额我没否认。先开口的人是我。
- **路线轴：** caller-credibility

### 后台回流

#### 1. 门店话术卡 · 上周预约截图

- **内部 ID：** tony-manager-training-note
- **声纹卡 ID：** case2-manager
- **来源：** store-manager-note
- **出现界面：** 后台收到话术卡和一张熟客截图
- **标题：** 门店话术卡 · 上周预约截图
- **触发矛盾：** Tony 把门店里维系熟客的称呼和排期方式，接进了自己的产品跟进；店里并不承认理财业务。
- **此刻出现原因：** 收麦后，店长发来公开培训卡；一位熟客也补了上周的预约截图。店长不接受把整家店说成骗局。
- **提示题：** 把话术卡和上周截图并排，哪一处最该留下？
- **材料：** 门店培训卡只写‘记需求、约下次、晚档优先’。熟客补来的上周截图里，Tony 问：‘上周那个，你听完了吗？自己人，晚档给你留。’对方回：‘听过了，没钱。剪头就剪头，别又跟我说那个。’店长另说：‘我们店只做美发，也没让员工替客人收这种钱。Tony 私下跟客人说了什么，你们问他本人，别把店也写进去。’
##### 材料行

- 门店培训卡｜记需求、约下次、晚档优先
- 熟客上周截图｜上周那个，你听完了吗
- 熟客回复｜听过了，没钱；别又跟我说那个
- 熟客上周截图｜自己人，晚档给你留
- 店里只做美发
- 店里没让员工替客人收这种钱
- Tony 私下说了什么，问他本人

- **能证明：** Tony 会把‘自己人’、晚档和一次未写明内容的后续跟进连着使用；至少一位熟客明确说上周听过、这次不想再听。门店只认美发业务，没有让员工替客人收这种钱。
- **仍不能证明：** 截图没写上周听的是什么，不能证明每个被叫自己人的熟客都听过产品，也不能证明 Tony 的资格和十二万去向。
- **路线轴：** process-control
##### 选项

###### 1. 上周听过，这次先拦

- **标签：** 上周听过，这次先拦
- **是否核心项：** true
- **矛盾：** 另一位熟客明确说上周听过、这次没钱，不想再听；Tony 又把‘自己人’和晚档接在同一段跟进里。
- **反馈：** 她确实听过一次，也在这次开口前先拦了。上周听的是什么，截图没写；Tony 私下怎么接，仍要问他本人。
- **路线轴：** process-control

###### 2. 店里只做美发

- **标签：** 店里只做美发
- **是否核心项：** false
- **反馈：** 这句划清门店边界，但没有解释 Tony 为什么把同样的称呼接到私人名单和账户上。
- **路线轴：** caller-credibility

###### 3. 别把整家店带进去

- **标签：** 别把整家店带进去
- **是否核心项：** false
- **反馈：** 这是店长的态度。回答不了走我户三个字从哪来。
- **路线轴：** money-flow

#### 2. 周发来的材料

- **内部 ID：** tony-other-caller-dm
- **声纹卡 ID：** case2-other-customer
- **来源：** dm
- **出现界面：** 后台进来一条私信
- **标题：** 周发来的材料
- **触发矛盾：** 名单上另一行也是钱，不是女朋友。
- **此刻出现原因：** 收麦后，周私信进来。她想拉咨询者一起要说法；咨询者却只想把自己的十二万拿回来。
- **提示题：** 周手里的哪一项，最值得和转账原件一起核？
- **材料：** 周说：“我那行写一百万、已买。他给我发过一张回单。我不去店里闹，材料可以交警方。回单是不是对应我那笔钱，让他们查。”
##### 材料行

- 她那栏写着｜100万，已买
- 她收到的｜认购回单截图
- 她愿意做的｜把转账与回单交警方核原件
- 仍不知道｜回单是否对应她那一百万

- **能证明：** 周也向 Tony 转过钱，并持有一张他转来的认购回单截图。
- **仍不能证明：** 不能证明两笔钱都买成同一产品，也不能证明已经损失。
- **路线轴：** external-corroboration
##### 选项

###### 1. 名单写着100万已买

- **标签：** 名单写着100万已买
- **是否核心项：** false
- **反馈：** 名单是 Tony 自己记的，不能替代转账与回单原件。
- **路线轴：** money-flow

###### 2. 转账与回单放在一起核

- **标签：** 转账与回单放在一起核
- **是否核心项：** true
- **矛盾：** Tony 说已经提交，仍只有逐笔核对原件才能确认钱去了哪里。
- **反馈：** 转账证明钱给了 Tony；回单是否对应这笔钱，要看原件。
- **人物反应：** 她肯把原图交出去。我也交。
- **路线轴：** external-corroboration

###### 3. 名单上写着已买

- **标签：** 名单上写着已买
- **是否核心项：** false
- **反馈：** 已买是 Tony 的备注，不是机构回单。
- **路线轴：** caller-credibility

##### reply Choices

###### 1. 支持她拉人要说法

- **内部 ID：** side-other
- **标签：** 支持她拉人要说法
###### 授予库存

- side-other-caller

- **立场变化：** defensive

###### 2. 劝她先要回单别闹店

- **内部 ID：** side-caller
- **标签：** 劝她先要回单别闹店
###### 授予库存

- side-caller-stop

- **立场变化：** open

### 文档原件

#### 1. 名单与十二万转账

**名单与十二万转账**

前三行来自她第二天补交的完整名单；后两行是转账和要钱草稿。第一夜她只发过左半边。先圈你要带回夜里的两行。

| 行 ID | 日期 | 类型 | 金额 | 对方/项目 | 备注 |
| --- | --- | --- | --- | --- | --- |
| m01 | 07-11 | 提醒 | —— | 下次约／亲密度 | 咨询者第一夜抓住的字段 |
| m02 | 07-11 | 提醒 | ¥1,000,000 | 周（遮名） | 已买；跟进；无亲密度 |
| m03 | 07-12 | 提醒 | ¥120,000 | 何 | 不够100万起投；走Tony户 |
| m05 | 07-13 | 支出 | ¥120,000 | 何→Tony | 转账备注空；聊天写帮我买 |
| m06 | 07-13 | 提醒 | 要回 | 何→节目 | 草稿把代投写成养鱼骗钱 |

- **内部 ID：** case2-member-training
##### 逐行追问

###### m03

###### 1. m03 1

**林旭阳：** 走Tony户，是你同意的，还是他写给自己看的？

**咨询者：** 他回过我这四个字。我当时点头。现在看，像他写给自己的跟进。

- **矛盾：** 代投约定先发生在聊天，再出现在名单备注。
- **路线轴：** money-flow
###### logic Contract

- **premise Anchor：** 走Tony户
- **source Kind：** document-readout
- **source Proves：** 名单把何的十二万标记为经 Tony 账户处理。
- **source Does Not Prove：** 不能证明已经买成产品，也不能证明合同户名。
- **answer Anchor：** 他回过我这四个字
- **answer Adds：** 咨询者承认当时接受走他户。
- **next Legal Question：** 可以追认购回单，不能把备注写成已入宸直。

###### m05

###### 1. m05 1

**林旭阳：** 十二万是你主动转的吗？

**咨询者：** 转了。我先问他能不能帮我买。

- **矛盾：** 转账由咨询者发起，不是被偷划。
- **路线轴：** money-flow
###### logic Contract

- **premise Anchor：** 何→Tony
- **source Kind：** document-readout
- **source Proves：** 存在一笔十二万从何到 Tony 的转账。
- **source Does Not Prove：** 不能证明资金随后进入宸直。
- **answer Anchor：** 转了
- **answer Adds：** 她确认转账是自己操作。
- **next Legal Question：** 可以问有没有回单，不能把转账写成产品认购。

- **最多圈选：** 2
### 对方留言

- **来源：** respondent-note
- **此刻出现原因：** 收麦后，他给节目后台留了一段文字，说不上麦，就说这几句。
十二万过到我户没错，可先问能不能跟着买的是她。我说过走我户，也说过已经提交。名单就是我记客户的，不是什么女朋友名册。‘自己人’我叫过，晚档我也留过，怎么了？钱走我户，材料当然先在我这儿。她要看，我会发给她本人，不发直播间。我不上麦。

- **能证明：** Tony 承认十二万元经过自己的账户，也把产品材料视为由自己掌握和交付。
- **仍不能证明：** 这段留言不能证明认购完成、资金仍在、Tony 具备资格或他因代投获得了报酬。

### 跨案回声

#### 1. case2 flashback profile fund

- **内部 ID：** case2-flashback-profile-fund
- **requires Case Id：** 03-profile
- **quote：** 宸直那三十万九月底到期，拿二十万给我留着。
- **source Case Label：** 案3
怎么又是宸直。上一通女方家的三十万还等九月底，这通又有人把钱转进了别人的账户。

#### 2. case2 flashback work invoice

- **内部 ID：** case2-flashback-work-invoice
- **requires Case Id：** 04-workplace
- **quote：** 公司抬头发票原件还在我手里。
- **source Case Label：** 案4
前面那通六万八至少还有公司抬头发票。这十二万只有转账和提交页，不能混成同一种要钱。

## 收束与结案

### host Disclosure

- **anchor：** afterBackflow
我以前上班也听过‘自己人’。钱要走个人账户，光凭这三个字不够。合同和回单呢？

#### lines

##### 1. lines 1

**咨询者：** 你也被人这么叫过？

##### 2. lines 2

**林旭阳：** 叫过。可我不会因为这三个字，就把十二万和一张提交页当成一回事。

- **host Wound Hook：** Tony 对熟客都叫自己人，也许只是嘴甜
### deep Followup

**林旭阳：** 如果他明天给你一张他名下的认购回单，却不退十二万，你还会把那半张截图发出去，说自己被他养鱼骗钱吗？

**咨询者：** 先把回单和合同户名给我。名单我先不发。十二万怎么处理，等他把材料交出来再说。

#### resistance Beat

##### lines

###### 1. lines 1

**咨询者：** ……我还是想发。

###### 2. lines 2

**林旭阳：** 你那行写的是走我户，还是女朋友？

###### 3. lines 3

**咨询者：** 走我户。

###### 4. lines 4

**林旭阳：** 那先说你现在最要紧的。

- **说明：** 她第一次把要回单、要退现金和公开养鱼控诉拆开。

- **stage Judgement：** 十二万，是你自己开口让他代投的。风声一来，你裁掉金额栏，又改口恋爱诈骗。这个说法我不认。先别再转钱。让他把产品名、合同和回单书面发过来。嘴上叫你‘自己人’，收了钱却不给原件，他也得回答。钱进没进产品，等回单。
### quote Pick Candidates

- 一排女人的名字。越看越不对
- 不够起投，走我户
- 是我转的
- 他总给我留最晚那档

### accusation Choices

#### 1. “一排女人的名字。越看越不对。”

- **标签：** “一排女人的名字。越看越不对。”
- **quote Source Scene Id：** tony-list-as-dating
- **责任角色：** respondent
- **主播回应：** 名单上是女客，这一层看得到。可列里写的是起投和跟进，不是谁在跟他谈恋爱。养鱼这件事，今晚证明不了。

#### 2. “不够起投，走我户。”

- **标签：** “不够起投，走我户。”
- **quote Source Scene Id：** tony-list-columns
- **责任角色：** complainant
- **主播回应：** 那行‘十二万’是你自己记的，钱也是你转的。你可以追问代投，可不能一转头就把它全说成恋爱诈骗。

#### 3. “是我转的。”

- **标签：** “是我转的。”
- **quote Source Scene Id：** tony-caller-benefits
- **责任指向：** both
- **主播回应：** 钱是她亲手转的。是谁先提出代投、他收到以后做了什么，还得接着问。

#### 4. “他总给我留最晚那档。”

- **标签：** “他总给我留最晚那档。”
- **quote Source Scene Id：** tony-exclusive-voice
- **责任指向：** noPremeditated
- **主播回应：** 晚档是实打实的照顾。它能解释她为什么动心，证明不了十二万的去向，也证明不了名单是女友名册。

### 今晚最后一句

#### 1. 不再转钱、要回单

- **内部 ID：** pragmatic
- **标签：** 不再转钱、要回单
- **主播台词：** 别再转钱。产品名、合同、回单和下单账户，一样一样让他发。头发还得剪——换家店。
##### lines

###### 1. lines 1

**咨询者：** ……嗯。楼下新开了家，十五块快剪。就是不聊天。

###### 2. lines 2

【停顿】

###### 3. lines 3

**咨询者：** 不聊挺好。

#### 2. 承认她确实动过心

- **内部 ID：** affirm
- **标签：** 承认她确实动过心
- **主播台词：** 他总给你留晚档，也会叫自己人。你会往那边想，不奇怪。
##### lines

###### 1. lines 1

**咨询者：** ……我还真怕你也说我活该。你这么讲，我能听进去。

#### 3. 允许她回来再谈

- **内部 ID：** accompany
- **标签：** 允许她回来再谈
- **主播台词：** 材料先要。等他回了什么，你再来。
##### lines

###### 1. lines 1

**咨询者：** 行。想不好我就再打。

### 正式结案

- **标题：** 钱走他户之后
- **结论：** 咨询者主动请 Tony 代投十二万；听见产品可能出事后，她裁掉金额栏，改口称恋爱诈骗。Tony 把熟客关系接到个人账户代投上，收钱后没有交产品全名、合同和回单。十二万是否入产品仍待原件。
#### 场景节拍

##### 1. 来电

- **标签：** 来电
她先把名单讲成养鱼女友名册，一开口就要钱。后来才承认自己也要恋爱这个位置，他确实帅。

##### 2. 麦上

- **标签：** 麦上
昨晚敲门的是警察，因涉案放款人来核实借款。周只是剪头客户。第二夜完整名单和转账才对出：十二万是她因为不够一百万才让他代投。

##### 3. 回看

- **标签：** 回看
高息她在酒吧先听过。小姐妹说产品在拖以后，她才翻手机。Tony 承认钱走他户，合同和回单却一直没交。

#### 已确认

- 咨询者确实以恋爱名义和 Tony 相处，并承认他长得好看
- 名单上多为女客，字段包含金额、起投、跟进和走他户
- 咨询者向 Tony 转过十二万，自己开口要求帮忙购买高息档
- 咨询者听说产品可能出事后才翻名单，并裁掉金额、起投、跟进和走他户等右半边，把主动代投改口成恋爱诈骗
- 高息传闻来自酒吧小姐妹，咨询者在翻名单前就听过一百万起投
- 周是剪头客户，名单行写一百万已买，不是咨询者所说的女朋友
- 第一夜敲门的是警察；放款的人涉案，按借款人来问咨询者
- 店长称店里不卖理财，拒绝替 Tony 的私人名单作证
- Tony 承认十二万经过个人账户，并声称材料由自己交给何；截至结案仍未提供产品全名、合同和回单

#### 未决

- 十二万是否已经买成宸直产品
- Tony 是否有向顾客推介或代购的资格
- 周的认购回单是不是她自己那笔钱
- 其他名单行是否完成认购
- 宸直该档产品能否兑付或赎回
- Tony 对她的喜欢有多少是真心
- Tony 是否因私人代投获得佣金或其他报酬
- 她向放贷人借了多少、是否仍欠
- 警察把她当证人还是另有调查

- **下一步：** 不再转钱。书面要求产品全名、认购合同、回单和实际下单账户；把自己与周的转账、聊天分别交给警方核原件。不要拿裁过的名单公开指认恋爱诈骗。

- **story Interlude Recap：** 她先拿裁过的名单讲养鱼，后来才承认恋爱名义和真实照顾都发生过。第一夜强光和敲门让她突然下线；第二夜才问出警方因涉案放款人来核实借款。完整名单和转账随后对出：她主动让 Tony 代投十二万，钱走他的个人账户，合同和回单仍在他手里。风声一来，她才裁图改口。
- **followup Twist：** 周又发来消息，说愿意把转账和回单原图交给警方。来电人也把自己的聊天和十二万转账整理了过去。两人都没有去店里堵人；他还是只说已经提交，没有发合同。
- **分享卡标题：** 十二万为什么要走 Tony 户？
- **分享卡正文：** 她把名单左半边发进直播间，说 Tony 在养鱼。完整图却写着：十二万，不够起投，走 Tony 户。她主动要求代投；Tony 收钱后只给提交页，产品名、合同和回单一直没交。
- **分享题：** Tony 说自己只是帮熟客代投。钱走他的账户，合同和回单又迟迟不交，他要拿什么证明这笔钱去了产品？
- **作者真相：** 十二万是她自己开口让 Tony 代投的；风声一来，她裁掉金额栏和“走他户”，改口成恋爱诈骗。Tony 收钱后只给提交页，产品名、合同和回单都没交，也得回答。先把原件交警方，钱进没进产品再看回单。

## 【编剧资料】事实边界与运行规则

- **内部来电索引：** 她打来问：翻到 Tony 一份名单以后，怎样把钱要回来。
- **运行时状态：** runtime-loaded
- **texture Pass：** true
### dialogue Presentation

#### speed Tiers

##### strained

- **delay：** 46
- **hold Ms：** 0

##### stalled

- **delay：** 54
- **hold Ms：** 1000

#### blip Pitch Hz

- **host：** 330
- **caller：** 302
- **respondent：** 224

### voice Tics

- **one Time Tic：** 你知道吧
### voice Tic Arc

- **何：** 全案只在第一夜承认恋爱位置时用一次『你知道吧』

### drift Comments

- 留熟客资料也不一定是骗吧
- 钱是她自己转的,先问她当时知不知道
- 主播这个发型是不是也该修修了
- 刚进来,谁能告诉我她为什么一晚上没睡
- 蹲各位的Tony老师故事,我先来:我办卡那家跑路了

- **来电媒介：** voice
### caller Intent Profile

- **open Goal：** 让主播告诉她怎么把钱从 Tony 那儿要回来。
- **preferred Answer：** Tony 以谈恋爱为名养鱼，名单上那些女人足以证明他在骗钱，所以她的钱该退。
- **audience Tilt：** 让听众先把她看成被帅哥理发师吊着的受害者，不先问她自己有没有想过那档高息。
- **protected Interest：** 保住恋爱诈骗受害者的位置，也保住把十二万说成被骗、而不是自己找他代投的可能。
- **default Tactic：** 先砸裁过的名单和要钱；问到恋爱是不是真的，就承认他帅、自己也动心；问到截图为什么断在右边，才承认自己裁掉了金额栏；第二夜问到钱怎么到他手里，才说不够门槛。
- **concession Limit：** 可以承认约会、自己人、他真帅；在十二万转账被问实以前，不主动说是自己让他代买高息产品。
#### pain Points

##### 1. pain Points 1

- **topic：** 名单列到底在记什么
- **threatens：** 会把女友名册拆成产品跟进表。
- **first Response：** 先说全是女的、还写下次约。
- **after Proof：** 被追问截图右边为什么齐齐断掉后，才承认自己只发了姓名和约会备注，金额栏没有发。
- **minimum Leak：** 承认完整名单还有被她裁掉的右半边。

##### 2. pain Points 2

- **topic：** 十二万怎么到 Tony 手里
- **threatens：** 会把被骗改写成她主动找他跨过起投。
- **first Response：** 先说钱在他那儿，要回来。
- **after Proof：** 名单上自己那行和转账对上后，才说不够一百万、让他走他的户。
- **minimum Leak：** 承认十二万是自己转给他的。

##### 3. pain Points 3

- **topic：** 高息消息从哪听来
- **threatens：** 会露出酒吧工作和她早就动心那档利息。
- **first Response：** 只说小姐妹聊过，不说在哪儿。
- **after Proof：** 被问听的地点后，才说酒吧做营销。
- **minimum Leak：** 承认高息不是 Tony 第一次开口才听说的。

##### 4. pain Points 4

- **topic：** 听说可能拿不回才翻脸
- **threatens：** 会让直播间把她看成风险一来就改口的人。
- **first Response：** 先把今晚说成发现名单、要讨回被骗的钱。
- **after Proof：** 被问时机后，才承认小姐妹说这产品最近在拖。
- **minimum Leak：** 承认翻脸是在听说钱可能有事后。

##### 5. pain Points 5

- **topic：** 昨晚来找她的人
- **threatens：** 会露出她借过涉案放贷人的钱，而不是名单女友找上门。
- **first Response：** 第一夜只说临时有事，回拨时仍只说有人来问几句话。
- **after Proof：** 被追问后才承认电话是警察打的，放款的人涉案了，按借款人来问。
- **minimum Leak：** 承认来人不是名单上的女朋友。

- **other Benefit：** Tony 已经取得何转入个人账户的十二万，也把产品信息、原件和后续查询留在自己这一端。客户要确认、退出或追问，都得先经过他；节目不能据此断言他赚了佣金、侵吞本金或完成了认购。
### other Intent Profile

- **open Goal：** 把走他户解释成替熟客凑门槛的顺手帮忙，不让节目把私人名单讲成女友名册。
- **preferred Outcome：** 熟客继续通过他接触产品，钱走他的账户，产品材料也由他决定何时交付。
- **protected Interest：** 保住自己作为熟客与产品之间唯一入口的位置，不让门店、节目或客户绕过他直接核对。
- **moral Wrapper：** 都是自己人，我帮你并进去。
- **concession Limit：** 承认十二万经过自己账户、承认说过走我户和已经提交；不公开产品全名、合同、回单、实际下单账户，也不解释是否获得报酬。

### 运行时长度计划

- **live Beat Count：** 7
- **material Board Count：** 2
- **backflow Count：** 2
- **truth Boundary Prompt Count：** 6
- **case Specific Pressure：** 第一夜先让裁过的名单被读成养鱼名册，再承认恋爱名义是真的、他确实帅；窗外强光和敲门声逼她突然下线。第二夜问出来人是警察，再拆出周只是剪头客户、十二万是她自己让他代投。
#### what Player Does Besides Read

- 问清名单怎么到她手里、她把列名读成了什么
- 核对两人是不是真以恋爱名义相处
- 发现她发来的名单截图右侧被裁掉
- 第一夜敲门打断后进入第二天下午
- 从敲门的人问出警察，再确认名单上的周只是剪头客户
- 在店外听他跟熟客聊的是息还是约会
- 向小姐妹核对高息档和一百万门槛
- 圈名单上她自己那行和十二万转账
- 选择听他谈息的语音、回女客私信或看店长说明
- 把要回钱、代投和恋爱诈骗分开处理

### 任务画像

- **内部 ID：** emotion
- **标签：** 情绪卡住了
- **recommended Specialty Id：** emotion
- **摘要：** 情绪很满，有人一直把问题推回爱不爱。

### 路线评论

#### identity wording

- 自己人这词又来了
- 我怎么还嗑上了,快打我

#### money flow

- 她一直不肯说到底转了多少
- 钱怎么到他手里还没讲完

#### document edge

- 右边怎么每行都少一截
- 先问她为什么裁图

#### caller credibility

- 她也顺着这个位置走了
- 风声一来才翻脸

#### process control

- 店里到底认不认这件事
- 谁收的钱得问清楚

#### active provocation

- 等等,右半张是她自己写的?

### 事实边界

#### 能确认

- 咨询者翻到一份 Tony 的名单，上面多为女性客户，备注写着下次约、跟进和数字
- 咨询者确实以谈恋爱名义和 Tony 相处，Tony 也称她自己人、给她留最晚那档
- 咨询者承认最初固定找 Tony，也因为觉得他长得好看、会说话
- 名单列里有起投、金额和跟进，不像单纯的约会记录
- 高息档口头口径是一百万元起投
- 咨询者向 Tony 转过十二万元，自己那行写着不够起投、走 Tony 户
- Tony 承认十二万元经过自己的账户，也声称产品材料在他手里；节目和咨询者仍未拿到产品全名、合同、回单与实际下单账户
- 咨询者在酒吧做营销，高息传闻来自小姐妹闲聊，不是 Tony 第一次开口才听说
- 名单上的周是剪头客户，不是咨询者口中的那种女朋友；她也把钱给过 Tony
- 第一夜敲门的是警察；放款的人涉案，按借款人来问咨询者
- 店长称店里不卖理财，Tony 私下跟客人聊什么她不管

#### 被修剪

- 咨询者把名单先讲成养鱼女友名册，只发姓名、亲密度和下次约，裁掉金额与产品跟进列
- 咨询者把以恋爱名义相处讲成他单方面骗色骗钱，淡化自己也要这个位置
- 咨询者开场只说钱在他那儿要回来，不说十二万是自己让他代买高息档
- 咨询者把小姐妹的高息闲聊压成“听说过”，不说自己听完就动心想买
- 咨询者把今晚来电讲成刚发现被骗，淡化自己是在听说可能拿不回以后才翻脸
- 咨询者第一夜听见敲门后突然下线，不说警察是因涉案放款人来核实借款

#### 今晚定不了

- 十二万是否已经买成宸直产品，还是仍在 Tony 个人账户
- Tony 是否具备向顾客推介或代购这类理财的资格
- 其他名单行是否真的完成认购，节目没有逐笔合同
- 周转来的认购回单是不是她自己那笔钱
- 宸直该档产品此刻能否兑付、能否赎回
- Tony 对她的喜欢有多少是真心，有多少是为了把人留在可推销的位置
- Tony 是否因这类私人代投获得佣金或其他报酬
- 她向放贷人借了多少、是否仍欠
- 警察把她当证人还是另有调查，节目不能确认

### deception Chain

- **owner：** caller
- **protected Purpose：** 让直播间把她认作被恋爱为名养鱼骗钱的人，从而支持她要回这笔钱；同时不把她主动约会、不够起投、自己让他代投、风声一来才翻脸、借过涉案放贷人的钱算进判断。
#### stages

##### 1. tony list as harem

- **内部 ID：** tony-list-as-harem
- **pressure Trigger：** 她需要一个能立刻支持要钱的故事，名单是最容易讲成诈骗的物件。
- **surface Version：** 名单上全是女的，他以谈恋爱为名养鱼，钱在他那儿，问怎么要回来。
- **edited Fact：** 名单是客户跟进表。她自己也在上面，而且不是作为被吊着的女友被记下来的。
- **immediate Utility：** 先把要钱放进恋爱诈骗，而不是一笔她自己发起的转账。
- **fair Trace：** 她先砸名单和要钱，发来的截图却在右侧齐齐断掉。
- **player Test：** tony-list-as-dating：问她凭什么把名单上的名字读成他在谈的人，再追截图为什么只有左半边。
- **forced Revision：** 她承认自己只发了姓名和约会备注，右侧几列被她裁掉。
- **advice Impact：** 主播可以追名单来源，但不能把养鱼当成已经成立的事实。

##### 2. tony dating was real

- **内部 ID：** tony-dating-was-real
- **pressure Trigger：** 名单故事站不住时，她改用“我们就是在谈”来保住被骗的位置。
- **surface Version：** 我当自己在谈。他叫我自己人，留最晚那档，也带我吃饭。
- **edited Fact：** 恋爱名义是真的，他确实帅；这只能证明相处方式，不能证明名单是女友名册，也不能证明十二万是被骗的恋爱钱。
- **immediate Utility：** 用真约会给养鱼指控垫底，让要钱听起来像讨回被骗感情的代价。
- **fair Trace：** 她承认他长得好看，也承认自己人、晚档和约会，却仍把钱说成他骗走的。
- **player Test：** tony-exclusive-voice：问他亲口有没有说过在谈，再核她自己要的是不是这个位置。
- **forced Revision：** 她承认自己要这个恋爱位置，不是单方面被拖着。
- **advice Impact：** 约会和帅都可以成立，主播仍须把名单和钱单独问。

##### 3. tony list is leads

- **内部 ID：** tony-list-is-leads
- **pressure Trigger：** 主播抓住截图右侧整齐的断边，女友名册开始裂。
- **surface Version：** 我先发的是名字、亲密度和下次约，右边没什么好看的。
- **edited Fact：** 她主动裁掉了金额、起投和跟进列；她那行写着不够一百万起投。
- **immediate Utility：** 让节目和小姐妹先看到一张像女友名册的图，不必立刻解释自己的代投。
- **fair Trace：** 截图里的每一行都在同一位置断掉，显然不是原表边缘。
- **player Test：** tony-list-columns 与 case2-member-training：先问截图右边为什么断了，第二夜再让她念完整一行。
- **forced Revision：** 她承认右侧几列是自己裁掉的，但第一夜仍不念金额和账户备注。
- **advice Impact：** 主播可以把正常熟客记录和高息推销分开，不必把整张名单判成女友名册。

##### 4. tony proxy invest

- **内部 ID：** tony-proxy-invest
- **pressure Trigger：** 起投出现后，她必须解释自己为什么不够仍把钱给了他。
- **surface Version：** 小姐妹聊过有档高息。我钱不够那个数，就让他帮我买。
- **edited Fact：** 她主动要求跨过一百万门槛；十二万是她转的，不是他从恋爱里偷的。
- **immediate Utility：** 把代投说成男友帮忙，仍把责任留在他身上。
- **fair Trace：** 她先说听过起投，又说自己那行写着走他户；转账时间和名单备注对得上。
- **player Test：** tony-caller-benefits：问十二万怎么到他手里，再核是谁先提代投。
- **forced Revision：** 她承认是自己开口，因为不够起投。
- **advice Impact：** 建议从追恋爱诈骗，改成追认购回单、合同户名和代投约定。

##### 5. tony flip on rumor

- **内部 ID：** tony-flip-on-rumor
- **pressure Trigger：** 代投被问实后，她仍要把今晚说成刚发现被骗。
- **surface Version：** 我是看见名单才知道他养鱼。钱要回来是应该的。
- **edited Fact：** 她在酒吧已听过高息；转钱时知道这是理财；翻脸是在小姐妹说这产品最近在拖之后。
- **immediate Utility：** 用发现名单的时间盖住她对风险的知情，保住受害者位置。
- **fair Trace：** 她第一夜就说要钱；被问时机才承认听说可能拿不回。
- **player Test：** tony-next-push-column 与 deepFollowup：问她若他肯给回单却不退现金，是否仍要按恋爱诈骗公开名单。
- **forced Revision：** 她承认风声一来才翻脸，公开名单会把自己的代投也摊开。
- **advice Impact：** 当场动作改成停转、要回单、不要把代投改口成恋爱诈骗；兑付结果今晚不判。

### scene

- **name：** 直播连线

### after Judgement Lines

#### 1. after Judgement Lines 1

【你抬手揉了揉眼睛，手背碰倒空纸杯。杯子滚到控台边，没洒出一滴。】

### statement Patience

- **night a：** 4
- **night b：** 4

### statement Stages

#### 1. tony night a account

- **内部 ID：** tony-night-a-account
##### scene Indexes

- 0
- 1

- **minimum Review Count：** 2

#### 2. tony night a message

- **内部 ID：** tony-night-a-message
##### scene Indexes

- 2

- **minimum Review Count：** 2

#### 3. tony night a rumor

- **内部 ID：** tony-night-a-rumor
##### scene Indexes

- 3

- **minimum Review Count：** 2

#### 4. tony night b account

- **内部 ID：** tony-night-b-account
##### scene Indexes

- 4
- 5

- **minimum Review Count：** 2

## 收播以后

**赵律师：** 今晚这些杯子，谁洗？

**林旭阳：** 我洗。你站旁边监督。

**赵律师：** 不监督。我在门口等你。

你把备用线缠好，收进桌下的盒子，又端起桌上的杯子。

【屏幕右上角的“直播中”灭了。】

### 收播后 · 新闻推送

- **世界回声 ID：** world-echo-chenzhi-payment-crisis
- **承诺 ID：** chenzhi-trust-payment-crisis

【玩家操作：把新闻推送点开】

#### 玩家先押下的风险假设（三选一，不判分）

- **cross-case-ledger｜把四案里的宸直线索并在一起：** 借款认购、栖行返费、家庭持有页和代投回单都碰到了同一机构名。先看它是不是一条跨案资金线。
- **tony-only｜先只核 Tony 的十二万元：** 最后一案的代投回单最紧迫，但只盯这一笔，可能看不见前三案已经留下的同名线索。
- **ordinary-news｜先按普通财经新闻处理：** 新闻本身还不能证明每一案的钱都进入宸直；要不要串案，仍得回到各案材料逐笔核对。

**宸直信托全部产品暂停兑付，实控人失联**

赵律师的手机连续震了两下。新闻客户端刚发出通报：宸直信托全部产品暂停兑付，多处关联项目停摆，实控人暂时无法联系，监管部门和警方已经介入。公告没有公布清偿顺序。

【确认到】宸直信托已经出现全面兑付危机，关联项目也受到波及。

【不能倒推】不能倒推第一通的两笔认购已经全部损失，也不能证明最后一通里何的十二万元已经进入宸直，或周的一百万元转账就是回单对应的同一笔资金；第三通女方父母的三十万元具体产品、清偿顺序和可追回金额也仍要分别核对。

# 独立模式：直播快案

> 快案不属于四幕主线。来电案由玩家按住原话追问；单人口播案由玩家在每段材料后选择主播先评价的成立角度。

## 直播快案 01：什么都不图

- **开场：** 一个姑娘打进电话，想请你帮她介绍对象。

### 求助与重大隐瞒

- **为何今晚发生：** 她知道林旭阳除了做情感热线，也兼职替人介绍对象，登记的听众里有做生意、家境稳定的男性，想借直播间获得介绍。
#### 公开求助

- **类型：** interest
- **求助内容：** 她想让林旭阳介绍对象。

- **咨询者所求：** 她想进入主播筛过的优质对象范围，希望林旭阳先替她证明自己可靠，长期最好还能有人分担房贷。
- **咨询者自利删减：** 她用有工作、有房和低要求建立可信形象，却没有主动说明一百万元来自另一位被她称作“爸爸”的年长男性。她也没有说自己做过婚育检查，只在讲相互扶持时突然拿“我不能生孩子”举例，第一次回问仍然否认，直到主播再追一句才承认。
#### cover Strategy

- **public Image：** 她把自己说成能养活自己、有房、要求低、看重患难相守，也不擅长说漂亮话的人。
##### honest Details

- 她二十四岁，在商场做服装销售，收入约六七千元。
- 亲生父亲腰伤后不能做重活，母亲在她上小学时离开。
- 她名下确实有一套仍需偿还少量贷款的小两居。

##### layered Leaks

- 先说亲生父亲靠零工生活，再说爸爸给了一百万元；对质时先坚持两人一直以父女相称，被逼着只回答是否亲生以后才承认不是同一个人，再用隐私和自愿赠与挡住真实关系。
- 先借父亲经历说到“我不能生孩子”，首轮不解释；主播在对质时回问，她先反驳，主播再追一句才承认做过检查。
- 先说工资普通、没有房也可以、不会让男方养，再以不了解为由避开普通听众，转而指定主播熟悉的经商男性，还希望对方减轻房贷压力。
- 把上一段关系散掉归到不会说好听话，求主播背书时却立刻换成恭维和软话；被追问后才承认还有脾气和争吵的问题。

### 第 1 轮｜先听她怎么介绍自己（family-version）

【无线索原句后的反应】 **来电人：** 你突然问这个，我有点跟不上。家里的事我还没说完。

#### 普通问话

##### 第 1 组（greeting）

**林旭阳：** 你好，能听见吗？

**来电人：** 能听见。那个……我这事从哪儿说呢。

##### 第 2 组（ask-for-match）

**林旭阳：** 好，你今天想问什么事？

**来电人：** 我想找个对象，也想让你帮我看看，我这样的适合找什么样的。你手里要真有合适的，也可以给我介绍一下。

##### 第 3 组（caller-profile）

**林旭阳：** 先说说你自己。以前谈过的，也带一句。

**来电人：** 我二十四，在商场卖衣服，底薪加提成一个月六七千，自己能养活自己。闭店晚，回家我一般煮碗面，工作服攒到周一——也不一定周一，轮休那天一起洗。以前谈过两个，一个去了外地，另一个总说我脾气硬。我不太会讲好听的，吵完也拉不下脸哄人，后来就散了。现在就想找个踏实点的，别赌，别动手，家里真遇上事也别瞒着我、转身就跑。

##### 第 4 组（birth-father）

**林旭阳：** 你为什么把这个看得这么重？

**来电人：** 我爸以前给人开货车，后来伤了腰，坐久一点都疼，重活也干不了。家里本来就没什么钱，他一伤，收入也断了。我妈看这日子过不下去，连句话都没多说，收拾东西就走了。那年我还在上小学，后来是我爸一个人把我带大的。现在他偶尔替熟人看看店，也挣不了多少。所以我就觉得，两个人真碰上病啊、没法上班啊，别说散就散。哪怕以后是他身体不好，或者是我不能生孩子，也能商量着过。

##### 第 5 组（million-from-dad）

**林旭阳：** 你刚才说自己能养活自己。现在是租房，还是跟家里住？

**来电人：** 我自己有套小两居，还有一点贷款。去年买的时候，我爸爸给了我一百万，我又添了一点才买下来。以后男方没房，也可以先住我这里。

##### 第 6 组（which-dad）

**林旭阳：** 那你爸还挺疼你的，自己身体这样，还先把你的房子解决了。

**来电人：** 嗯，他在我身上一直挺舍得的。钱的事您就别替我操心了，我不会让男方养我。

#### 本轮玩家可选的问题方向

- **benefactor-source**：买房的钱到底是谁出的 → 对质 two-fathers

- **benefactor-generosity**：这个一直舍得给钱的爸爸是谁 → 对质 two-fathers

- **report-disclosure**：为什么偏偏拿自己不能生孩子举例 → 对质 fertility-slip

#### 本轮当面对质

##### two-fathers

【依据话轮】birth-father / million-from-dad / which-dad

###### 微因果合同

- **premise Anchor：** 我爸爸给了我一百万
- **source Proves：** 她先说亲生父亲腰伤后收入很少，随后又说爸爸一次给了一百万元买房。
- **source Does Not Prove：** 称呼相同不能证明两人关系，也不能证明这一百万元存在交换条件。
- **answer Adds：** 她承认出资人不是亲生父亲，但拒绝公开双方具体关系。
- **next Limit：** 可以拒绝替她背书，不能替她编造出资人的身份和关系。

**林旭阳：** 你前面说亲爸伤了腰，只能偶尔替人看店。后面又说‘爸爸’给了你一百万。我问清楚：给钱的到底是不是你亲爸？

**来电人：** 我一直叫他爸爸，他也一直把我当女儿。钱是他愿意给我的，你们为什么非要分得这么清？

**林旭阳：** 我只问一句，他是不是你亲生父亲？

**来电人：** ……不是亲爸。可我叫了这么多年，跟亲爸有什么区别？

**林旭阳：** 区别是你亲爸一个月挣不了多少钱，另一个人却能一次拿出一百万。他到底是你什么人？

**来电人：** 这是我的私事，我没必要在直播里全说。反正钱是他自愿给的，不是我偷的抢的，房子也在我名下。

【画面短停，屏幕掠过“两个“爸爸””。主播立绘提亮。】

- **过场 ID：** quick-two-fathers
- **过场类型：** reveal
- **过场短标：** 称呼对不上
- **演出变体：** two-fathers

##### fertility-slip

【依据话轮】caller-profile / birth-father

###### 微因果合同

- **premise Anchor：** 或者是我不能生孩子
- **source Proves：** 她在讲相互扶持时主动拿自己不能生孩子举例。
- **source Does Not Prove：** 一句举例不能证明具体诊断、成因或个人经历。
- **answer Adds：** 她承认做过检查，医生说自然怀孕机会较低。
- **next Limit：** 医学含义由医生和她本人说明，直播间不作诊断。

**林旭阳：** 还有一句。你说两个人遇上事别散，举的例子是‘哪怕我不能生孩子’。你为什么会先想到这个？

**来电人：** 你怎么能这么问？我就是顺嘴举个例子。

**林旭阳：** 那到底有没有嘛？

**来电人：** ……我以前确实查过。医生说自然怀孕的机会低一点，又没说一定不能。我还年轻，后面也可以再复查。

### 第 2 轮｜再听她怎么说（actual-request）

【无线索原句后的反应】 **来电人：** 你是不是没听完？我想找什么样的人，还没说完呢。

#### 普通问话

##### 第 7 组（low-standards）

**林旭阳：** 行，这个人你不想讲，我先不追。你刚才说想让我介绍，那你愿意见什么样的人？

**来电人：** 一个月四五千也行，年龄大我五岁以内，没房也可以。学历、长相我真不挑。合适的话相处一两年就结婚。商场下班晚，我平时也没什么机会认识人，要不然也不会来找您。

##### 第 8 组（ordinary-match）

**林旭阳：** 我这边正好有个登记过的听众。二十九，月薪六千，没房，在物流公司做调度。条件跟你刚才说的差不多，要不要先留个联系方式？

**来电人：** 先别急吧。就这么几句话，我也不知道他平时是什么样的人。加了以后不合适，再删也挺麻烦的。

##### 第 9 组（ordinary-caution）

**林旭阳：** 那什么样的介绍，你会更放心？

**来电人：** 最好是您认识久一点、知道底细的。工作稳定当然好，要是自己做点生意，家里也省心，就更合适。不是非得有钱，我主要是怕遇到不靠谱的。能帮我减轻点房贷压力，那就更好了。

##### 第 10 组（home-price）

**林旭阳：** 你那套房买下来一共多少钱？

**来电人：** 总价两百万。

##### 第 11 组（borrow-host-trust）

**林旭阳：** 你为什么一定想让我来介绍？

**来电人：** 您做这个两年多了，看人肯定比我准。您要是先跟他说一句，我这人还可以，他至少愿意见我一面。旭阳哥，我条件真没那么多，您就帮我留意一下吧。

#### 本轮玩家可选的问题方向

- **mortgage-pressure**：她的收入能不能负担剩余房贷 → 对质 hidden-standards

- **actual-standard**：她说的条件和实际选择 → 对质 hidden-standards

- **soft-talk**：不会说好听话是不是分手的根本原因 → 对质 useful-soft-talk

#### 本轮当面对质

##### hidden-standards

【依据话轮】which-dad / low-standards / ordinary-match / ordinary-caution / home-price

###### 微因果合同

- **premise Anchor：** 一个月四五千也行
- **source Proves：** 她口头接受低门槛对象，却拒绝符合条件的普通听众，随后指定主播熟悉、经商、家里省心的人。
- **source Does Not Prove：** 拒绝一个人不能证明她只认钱，也不能证明她必须接受任何介绍。
- **answer Adds：** 她承认想找条件更好的人，也希望未来伴侣分担一点房贷。
- **next Limit：** 可以判断她没有把真实门槛先说全，不能强迫她接受具体对象。

**林旭阳：** 你说月薪四五千、没房、大你五岁以内都可以。我真给你一个二十九、月薪六千、没房的，你又不愿意留联系方式。

**来电人：** 我没说不要，我就是觉得只听几句话不稳妥。

**林旭阳：** 可我问你到底想找什么样的，你说要自己做生意、家里省心，最好还能分担房贷。那套房总价两百万，也是在我追问以后才说的。

**来电人：** 等一下，我又没说只看钱。你介绍的那个人，我就是不熟。可对，能找条件好一点的，谁会故意找差的？最好以后能替我分一点房贷。

##### useful-soft-talk

【依据话轮】caller-profile / borrow-host-trust

###### 微因果合同

- **premise Anchor：** 我不太会讲好听的
- **source Proves：** 她把旧关系散掉归因于不会说软话，求主播介绍时却会恭维并要求主播先替她说好话。
- **source Does Not Prove：** 求助时客气不能证明她在恋爱中没有沟通困难。
- **answer Adds：** 她承认自己脾气不好，争吵时双方都不让步，不会说好听话并非唯一原因。
- **next Limit：** 可以收回单一分手原因，不能替前任判定全部责任。

**林旭阳：** 你说那段感情慢慢散了，是因为自己不会讲好听话。可一到让我帮忙，你马上夸我看人准，叫我旭阳哥，还想让我先替你说好话。

**来电人：** 我求人帮忙，客气一点怎么了？谈恋爱和求人能一样吗？

**林旭阳：** 当然不一样。那段感情最后散了，真就只是你不会哄人？

**来电人：** 感情里的事哪有一句两句说得清。我脾气也不好，吵起来谁都不让谁，后来就散了。你非要算我骗你，我也没办法。

### 主播结案复盘

> 主播结案复盘

#### 结束通话｜先把这通电话收住

【舞台状态】通话收尾

**林旭阳：** 你前面说月薪四五千、没房也行，真给你一个月薪六千的，你又不愿意接。后来你要的是自己做生意、家里省心，还能帮你分房贷。我不会帮你做这种介绍的。

**来电人：** 我就是想让你帮忙介绍一下，又没让你替我保证一辈子。你不愿意就算了。

**林旭阳：** 我不是怕替你保证一辈子。我连这一次也不会替你介绍。今天就到这儿。

#### 主播复盘｜她的话哪里对不上

【舞台状态】结案复盘

**林旭阳：** 电话挂了。我把她刚才说的几件事重新捋一遍。

**林旭阳：** 买房那一百万，不是她亲爸给的。给钱的人到底是谁，她没说。

**林旭阳：** 她嘴上说月薪四五千、没房也行，真递来一个月薪六千的普通上班族，她又不接。

**林旭阳：** 后来再问，她要的是自己做生意、家里省心，最好还能帮她分担房贷。

**林旭阳：** 还有她自己提到的检查。医生到底怎么说，让她自己去问清楚，我不在直播间猜。

**林旭阳：** 她还把上一段感情说成自己不会哄人。再问下去，她才承认脾气和争吵也有关系。

#### 高概率判断｜这些话拼在一起，更像什么

【舞台状态】高概率判断

**林旭阳：** 她想通过我认识条件更好的对象，还想让我先替她说一句‘这个姑娘可靠’。我不会做这种背书的。

**林旭阳：** 刚才这些已经够我拒绝介绍了。那一百万是谁给的，她不说，我也不会替她编。

### 玩家提前收案｜按现有信息谨慎判断

#### 按现有信息收住｜暂不替她介绍

【舞台状态】谨慎收案

**林旭阳：** 你前面说月薪四五千、没房也行，后来又只接条件更好的。人我不会替你介绍，也不会替你向别人保证。

**林旭阳：** 至少先把给你一百万的人是谁说清楚，再谈介绍。

#### 事实边界｜拒绝背书，不替她编故事

【舞台状态】信息边界

**林旭阳：** 那一百万为什么给，今晚没问清。没问清的，我不会替你往下说。

**林旭阳：** 真准备跟谁认真谈，这件事该什么时候说，你自己提前想好。今天先到这里。

#### 制作边界（不上屏）

##### risk Reading

- **标题：** 主播给出的风险判断
她先用独立、有房、要求低和重感情建立可信形象；普通对象出现后，她用“不够了解”挡掉，转而要求主播介绍熟悉的经商男性、替她背书并帮她减轻房贷。两个“爸爸”、一百万元的来源、她真正接受的择偶条件和婚育检查都在追问后才逐步补出。主播因此拒绝替她介绍或背书；但出资人具体是谁、双方是什么关系、检查的医学含义以及她目前是否另有伴侣都仍然未知。

- **confirmed Title：** 为什么已经足够拒绝
##### 已确认

- 她说亲生父亲腰伤后只能断断续续做零工；给她一百万元买房的是另一位被她称为“爸爸”的人。
- 被问到以后，她只承认出资人不是自己的亲生父亲，没有说明双方的具体关系。
- 她在原始连线里主动拿自己不能生孩子举例；主播回问以后，她才承认医生曾告诉她自然怀孕机会较低。
- 她以不了解为由暂缓接触符合口头标准的普通上班族，随后要求主播介绍熟悉的经商男性，还说能帮她减轻房贷更好；她说房屋总价约两百万元。
- 她希望主播先替自己告诉对方“这个姑娘人还可以”；求助时，她会使用恭维和软话。被追问分手原因后，她又承认自己脾气不好，吵架时双方都不让步。

- **unknown Title：** 没查清，也不影响避雷
##### 今晚定不了

- 给她一百万元的人具体是谁、双方是什么关系，以及现在是否仍有往来。
- 自然怀孕机会较低的医学原因；直播间不能替她下医学结论，也不能由此推断她的性经历。
- 她目前是否另有伴侣，以及她拒绝普通上班族时真正看重的条件。

- **改写边界：** 本案为原创虚构文本，只借鉴公开直播中“主播听完一通咨询，再把同一人的多句话放回她面前追问”的互动结构。年长资助者、婚育报告与择偶池只按本案台词判断，不复刻参考视频人物，也不把网络评论中的包养、性经历或现有伴侣猜测写成事实。

#### UI 舞台配置（非剧情证据）

- **background Src：** ./assets/generated/backgrounds/livestream_studio_v2.png
- **art Style：** pixel
##### host

- **name：** 林旭阳
- **role Label：** 主播
- **art Src：** ./assets/generated/quick-detective/lin-xuyang-host-pixel.png
###### art Variants

- **listening：** ./assets/generated/quick-detective/lin-xuyang-host-pixel.png?v=0.27.0
- **questioning：** ./assets/generated/host/lin_xuyang_questioning_pixel.png?v=0.27.0
- **pressing：** ./assets/generated/host/lin_xuyang_pressing_pixel.png?v=0.27.0
- **结论：** ./assets/generated/host/lin_xuyang_verdict_pixel.png?v=0.27.0

##### caller

- **name：** 匿名来电人
- **role Label：** 语音连线
- **art Src：** ./assets/generated/quick-detective/caller-luo-pixel.png
###### art Variants

- **neutral：** ./assets/generated/quick-detective/caller-luo-pixel.png?v=0.27.0
- **guarded：** ./assets/generated/quick-detective/caller-luo-guarded-pixel.png?v=0.27.0
- **pause：** ./assets/generated/quick-detective/caller-luo-pause-pixel.png?v=0.27.0

#### 运行规则

- **内部 ID：** 01-no-conditions
- **案件编号：** 01
- **cast Profile Id：** quick1-caller-luo
- **confrontation Count：** 4

## 直播快案 02：那晚没回消息

- **开场：** 一个姑娘打进电话，想问问她和男朋友接下来该怎么办。

### 求助与重大隐瞒

- **为何今晚发生：** 她通过婚恋机构认识了一位创业者。两个人相处一个月，男方却在一次周末聚会后停下了联系。她认为自己只是有一晚喝多了、漏回一条消息，想问主播是不是自己对情绪交流要求太高。
#### 公开求助

- **类型：** explanation
- **求助内容：** 她想知道男方为什么突然退出，也希望主播认可：一次没及时回消息，不该盖过她对这段关系的认真。

- **咨询者所求：** 她想追回一个经济条件、婚姻意愿都符合预期的对象，同时保住自己在这段关系里‘重感情、只想被理解’的说法。只要把分开归因于男方不懂情绪、介意一条消息，她就不用正面面对自己连续几次缩小那两晚的事实。
- **咨询者自利删减：** 她先把分开讲成男方不懂深度交流，再退到一条消息没回。第一轮对质后，她才露出当晚不是姐妹两个人；继续查看她主动发来的朋友圈截图，最近两个月的深夜酒吧、KTV 和几次彻夜未归才陆续出现。她也没有主动说，自己让男方送花、收过男方送的包，还把花、包和他的车一起拍进动态；道歉当天又发了前一晚的 KTV 照片。
#### cover Strategy

- **public Image：** 她把自己说成学历好、生活简单、平时很少出去，对物质要求也不高，只想找一个能认真沟通的人。
##### honest Details

- 她二十六岁，是重点大学的在读硕士。
- 两人由婚恋机构介绍，认识一个月，平均每周见面两三次。
- 男方三十五岁，自己经营公司，确实按长期关系的节奏接送、吃饭，也送过花和包。

##### layered Leaks

- 先说男方不懂情绪；被问具体例子时，才说自己分享的歌他没认真听，却又承认花是自己开口要的。她现在把朋友圈设成了三天可见，主播从外面看不到旧动态；为了证明只是正常分享，她自己翻出花、包和车同框的那条动态及前几条，截屏发来。主播问到照片里的包，她才说也是男方送的。评论里的羡慕、她开心的回复，以及漂亮饭和演唱会反而把公开展示摆到了主播面前。
- 先说一晚没有看到消息；聊天时间摆出来后，才承认十一点五十二分回过‘还行’，当时已经喝得很难受。
- 先说跟妹妹两个人小聚；被问酒是谁点的时仍只说‘别人’，直到当面对质才补出桌上还有妹妹的一名男性朋友。
- 她说第二天已经向男方解释，却没有主动交代男性同行者；直到主播追问男方为什么会知道，她才承认自己解释时说漏一个‘他’，被男方问住后才补上。
- 先说自己生活简单、很久没出去，刚好那天被叫走；第三个人出现以后，她为了证明自己没隐瞒，又从自己的朋友圈里翻出近两个月带时间的动态，截屏发来。主播从六次酒吧、KTV 和几张凌晨照片继续问，她才承认读研以后聚会一直不少，同行的男男女女也不是固定一拨，仍把这些说成普通聚会。
- 先说第二天一直在解释和道歉；后来才说，道歉当天她仍发了八号 KTV 的照片，男方能看到。

#### case Ledger

- **surface Claim：** 男方不懂她的情绪，只因一次喝多后没有及时回消息，就草率结束了关系。
- **dramatic Object：** 她自报的双方家底差距，花、包和车同框的动态及其评论截图，八号、九号、十号三天的活动顺序，以及十一点五十二和十一点五十八的两条消息。
- **false Solution：** 男方年纪大、忙于创业，不会回应年轻女生的情绪需求；两个人只是交流方式不合。
- **missing Edge：** 她把主动要花、收包和公开展示说成情绪需求，把喝到断片说成没看手机，把三人酒局说成跟妹妹小聚，又把近两个月反复出现的深夜酒局说成很久没出去后的偶然一次。
- **interest Path：** 如果主播接受她的版本，她既能把男方退出解释成不会沟通，也能继续以被误解的一方去挽回这个条件合适的对象。
- **caller Edit：** 先讲缺少深度，再讲漏回消息；先说与妹妹小聚，对质后才补男性同行者；为证明自己没隐瞒而发来朋友圈，又被看出近两个月反复玩到深夜；先说自己认真道歉，再补道歉当天发出的喝酒动态。
- **第三压力：** 婚恋机构最初把她介绍成学历好、生活简单、想认真结婚的人；男方也按这个版本放慢了相处节奏。
- **physical Verbal Lock：** 聊天记录显示她十一点五十二分还回了‘还行’，十一点五十八分便不再回复。她后来承认，当时已经喝到难受，并不是整晚没有看见手机。
- **reversal：** ‘漏回一条消息’变成‘男方在一个周末里发现，她展示给自己的生活和实际发生的事不是同一个版本’。
- **boundary：** 能确认她连续缩小说法、近两个月多次深夜酒局、几次彻夜未归、事发周末连续两晚喝酒，以及第二晚有男性在场并喝到断片；纹身只是人物背景，不作为品行证据，也不需要猜测酒局里是否发生性关系或其他未播行为。
- **quote Payoff：** 男方有足够理由退出。我说实话，也建议男方退出。
- **cover Layer：** 感性诡计：用‘我只想被理解’把讨论先带到男方会不会提供情绪价值。
- **load Bearing Layer：** 时间诡计：把八号 KTV、九号酒吧和十号发动态拆开，让连续发生的事看起来互不相关。

#### deception Chain

##### 1. emotion only

- **内部 ID：** emotion-only
- **surface Version：** 她只在意有没有深度交流，对物质和排场要求不高。
- **omitted Fact：** 她主动让男方送花，也收过男方送的包，又把花、包和男方的车拍进公开动态。
- **immediate Benefit：** 让主播先把问题归到男方不会理解她。
###### trace Turn Ids

- relationship-version
- public-photo-screenshot

- **player Test：** 她所说的情绪需求里有没有公开展示和条件带来的满足
- **minimum Admission：** 承认自己喜欢男方送来的花和包，也喜欢别人看到男方在她身上花心思。
- **advice Change：** 主播不再只评判男方会不会聊天，而先分清她实际向对方索取了什么。

##### 2. missed message

- **内部 ID：** missed-message
- **surface Version：** 她只是喝多后没看到一条消息。
- **omitted Fact：** 她六分钟前还回过‘还行’，随后因已经喝到难受而不再看手机，也不想让男方知道自己喝多。
- **immediate Benefit：** 把主动隐瞒醉酒状态说成一次无意漏看。
###### trace Turn Ids

- missed-message-version
- changed-night-version

- **player Test：** 漏回消息和隐瞒醉酒状态是不是一回事
- **minimum Admission：** 承认当时已经喝多，‘还行’是为了不让男方担心或生气。
- **advice Change：** 主播把问题从回复速度改为她为什么要缩小当时的状态。

##### 3. third person

- **内部 ID：** third-person
- **surface Version：** 她只是和妹妹两个人出去小聚。
- **omitted Fact：** 桌上还有妹妹的一名男性朋友，三个人混着喝酒，最后她喝到呕吐、记不清回程。
- **immediate Benefit：** 让聚会听起来像一次单纯的姐妹夜谈。
###### trace Turn Ids

- missed-message-version
- changed-night-version
- who-ordered-drinks
- how-he-knew-version

- **player Test：** 酒桌上的人数为什么从两个人变成三个人，以及男方为什么会追问到这个人
- **minimum Admission：** 承认有男性在场，也承认第二天是自己先说漏一个‘他’，男方追问后才补充。
- **advice Change：** 主播可以判断开场版本有意缩小，但不补写酒局中没有证据的事。

##### 4. how he knew

- **内部 ID：** how-he-knew
- **surface Version：** 她第二天已经把喝多的事情向男方解释清楚，是男方仍不愿意相信她。
- **omitted Fact：** 她一开始仍只说妹妹送自己回去，直到解释时说漏一个‘他’，才被男方追问出桌上的男性朋友。
- **immediate Benefit：** 把男方继续追问写成无端猜疑，掩掉自己对男方也在分段补充。
###### trace Turn Ids

- who-ordered-drinks
- how-he-knew-version

- **player Test：** 男方为什么会突然追问桌上是否还有别人
- **minimum Admission：** 承认是自己先说漏一个‘他’，男方问这个人是谁以后，她才补出男性同行者。
- **advice Change：** 主播可以指出她并非主动解释完整，但不把男方的怀疑当成酒局越界的证明。

##### 5. nightlife pattern

- **内部 ID：** nightlife-pattern
- **surface Version：** 她很久没出去，只是那天碰巧被妹妹叫去。
- **omitted Fact：** 前一晚她已经和师姐去 KTV；她主动发来的朋友圈截图还显示，近两个月有多个周末在酒吧或 KTV 待到凌晨。继续追问后，她承认读研以来聚会一直不少，同行的男男女女也不是固定一拨，其中几次没有回宿舍。
- **immediate Benefit：** 把生活习惯和连续发生的选择压成一次偶然。
###### trace Turn Ids

- missed-message-version
- social-feed-version
- previous-night

- **player Test：** 偶尔一次和朋友圈里反复出现的深夜酒局是不是同一种生活状态
- **minimum Admission：** 承认读研以后聚会一直不少，同行有不同圈子的男女；近两个月有几次玩到天亮，有时住在妹妹那里，但坚持这只是普通聚会。
- **advice Change：** 主播把婚介所说的‘生活简单’、她开场所说的‘很久没出去’，和她自己承认的长期夜场习惯放到一起判断。

##### 6. apology post

- **内部 ID：** apology-post
- **surface Version：** 她第二天醒来以后一直在认真解释和道歉。
- **omitted Fact：** 就在道歉当天，她还公开发了前一晚 KTV 喝酒的照片。
- **immediate Benefit：** 把男方继续退出归因于他不肯听解释。
###### trace Turn Ids

- social-post-date
- previous-night
- closing-request

- **player Test：** 道歉当天的公开动态会不会让解释失去分量
- **minimum Admission：** 承认男方能看到那条动态，但坚持照片不是出事当晚拍的。
- **advice Change：** 主播不再建议继续证明自己没做错，而要求她先承认对方为什么会觉得这次道歉不可信。

### 第 1 轮｜先听她怎么讲（surface-story）

【无线索原句后的反应】 **来电人：** 我当时就是难受。别的我真没往那儿想。

#### 普通问话

##### 第 1 组（greeting）

**林旭阳：** 你好，能听见吗？

**来电人：** 能听见。我……先说啊，我不是来骂他的。

##### 第 2 组（help-request）

**林旭阳：** 你说吧，遇上什么事了？

**来电人：** 我跟一个男生接触了一个月，本来都挺好的，最近突然不联系了。我觉得他什么都肯做，就是不太懂我的感受。我想问，是不是我对交流要求太高了。

##### 第 3 组（both-profiles）

**林旭阳：** 你先把你们俩的情况大概说一下。

**来电人：** 我二十六，研三，本科和硕士都在一所985高校。他三十五，自己开公司，是婚恋机构介绍的。机构跟他说我学历好、生活简单，也跟我说他想认真结婚。他至少中A8，本地两套平层。我们家就普通家庭，A7吧。家里能支持我，所以找对象也不是指望他养我。

##### 第 4 组（relationship-version）

**林旭阳：** A8、A7，你报得挺顺。先不聊房，你刚才说他不懂你的感受，哪件事让你这么觉得？

**来电人：** 我们一周见两三次，吃饭、散步，他也会开车来接我。我说累，他就把餐厅换到学校附近。可我发一首歌给他，他隔很久只回一句‘听了’，从来不问我为什么发。我有次刷到一束花，顺口问他能不能也送我一束，下次他真带了一大束来。花是有了，可两个人还是聊不到里面去。

##### 第 5 组（public-photo-screenshot）

**林旭阳：** 那条花的动态，你现在还能找到吗？

**来电人：** 我挺高兴的，坐在他车里拍了照片。朋友在下面问是不是谈恋爱了，还有人说羡慕，我回了几个表情。现在朋友圈三天可见。你这边看不到以前的。我自己还能翻。我把花那条和前面几条都截了，刚发后台，前面就是吃饭、演唱会这些。

##### 第 6 组（missed-message-version）

**林旭阳：** 你说他突然不联系了。那晚发生了什么？

**来电人：** 我妹妹叫我出去坐坐。我已经很久没出去了，正好她想喝一点，我们就去了一家清吧。我后来翻记录数过。十一点五十二，他问我喝得怎么样，我回‘还行’；十一点五十八，他又问我准备几点回去。后面那条我没看见，早上七点多才回。第二天我解释了，他还是越来越冷。

#### 本轮玩家可选的问题方向

- **emotion-or-display**：情绪交流和公开展示 → 对质 care-or-display

- **flower-request**：那束花是谁先开口要的 → 对质 care-or-display

- **missed-message-state**：漏回消息前后的真实状态 → 对质 message-or-drunkenness

- **founder-busy**：创业者是不是都没时间听歌 → 不触发对质

  - 【错方向后的反应】**来电人：** 他创业是忙，可我打来不是替他解释工作的。

- **family-level**：双方家庭条件差多少 → 不触发对质

  - 【错方向后的反应】**来电人：** 怎么又问到家境了？我想问的是他为什么突然不理我。

- **age-gap**：九岁年龄差是不是根本问题 → 不触发对质

  - 【错方向后的反应】**来电人：** 我们差九岁，他一开始就知道。这不是他这次不回我的理由。

#### 本轮当面对质

##### care-or-display

【依据话轮】relationship-version / public-photo-screenshot

###### 微因果合同

- **premise Anchor：** 她用分享歌曲没人回应证明男方不懂情绪，却主动要求送花；她发来的照片里还有一个新包，评论里朋友表示羡慕，她回复得很开心，前几条也多是漂亮饭和演唱会。
- **source Proves：** 她在意私人交流，也在意男方提供的物质条件和别人如何看待这段关系。
- **source Does Not Prove：** 收花、收包和发照片不能单独证明她只图钱，也不能否定她确实需要沟通。
- **answer Adds：** 她承认花和包都让自己高兴，朋友羡慕也会让自己高兴，但坚持这和想被理解并不冲突。
- **next Limit：** 主播只拆开两种需求，不把整段关系简化成拜金。

**林旭阳：** 你发来的花那张里，旁边那个新包也是他送的吧？

**来电人：** 嗯。第一次逛街时我在柜台前多看了几眼，他后来自己买的。我可没开口跟他要。

**林旭阳：** 你发来的朋友圈截图我看了。花、包、他的车都在一张。朋友说羡慕，你回得也挺开心。你很在意别人看见这些，对吧？

**来电人：** 朋友圈不就发这些吗？我总不能把两个人私下聊什么也发上去。我喜欢拍照，不代表我不想好好交流。

**林旭阳：** 那就别只说他没听懂你的歌。你也喜欢花和包，喜欢朋友羡慕。这些一起说。

**来电人：** ……行。花和包我都喜欢，有人说羡慕，我也挺高兴。但我也不是只看这些。

##### message-or-drunkenness

【依据话轮】help-request / missed-message-version

###### 微因果合同

- **premise Anchor：** 她把问题说成没有看到一条消息；自己念出的记录却显示，她六分钟前刚回过‘还行’，随后才不再回复。
- **source Proves：** 她并非整晚没有看见手机；‘还行’时的真实状态仍需要当面问。
- **source Does Not Prove：** 六分钟的记录不能单独证明她当时已经喝醉，也不能证明酒局发生了其他行为。
- **answer Adds：** 她承认‘还行’并不是真实状态，只是不想让男方知道自己喝多。
- **next Limit：** 继续问她为什么要藏，不把六分钟本身写成罪证。

**林旭阳：** 十一点五十二你回的是‘还行’，六分钟以后就没再回。你回‘还行’的时候，身体到底怎么样？

**来电人：** 已经有点难受了。我当时想着马上就走，没必要让他跟着担心。谁知道几分钟以后会吐成那样。

**林旭阳：** 那就别只说漏看了一条消息。你当时已经难受，还回他‘还行’，后面才断掉。这一段他当时不知道。

**来电人：** 好，我那句‘还行’确实逞强了。但我第二天一醒就说了，也没有故意晾他。

### 第 2 轮｜继续问当晚的情况（changed-version）

【无线索原句后的反应】 **来电人：** 我已经说记不清了。你一直追，我更不想讲。

#### 普通问话

##### 第 7 组（changed-night-version）

**林旭阳：** 刚才那晚重新讲一遍。你回了‘还行’以后，发生了什么？

**来电人：** 那时候我其实已经有点晕了，怕他知道我喝多，才回了‘还行’。桌上混着点了几种鸡尾酒，还有龙舌兰，后面又有人点了一轮。我后来吐了，回去那段也记不太清，醒来已经在妹妹家。

##### 第 8 组（who-ordered-drinks）

**林旭阳：** 后面又点的那一轮，你还记得自己喝了多少吗？

**来电人：** 记不清了。就是有人又加了酒，我那时候已经开始晕，后来还吐了。

#### 本轮玩家可选的问题方向

- **third-person**：那晚没有先说出的第三个人 → 对质 third-person-at-table

#### 本轮当面对质

##### third-person-at-table

【依据话轮】changed-night-version / who-ordered-drinks

###### 微因果合同

- **premise Anchor：** 她第一版只提妹妹；被问到自己已经喝多以后，重讲当晚才说有人又点了一轮。
- **source Proves：** ‘跟妹妹出去’不是当晚人员的完整版本，她在开场省掉了一个会影响男方判断的人。
- **source Does Not Prove：** 男性在场不自动证明暧昧、出轨或任何性关系。
- **answer Adds：** 她先把对方说成妹妹的朋友，主播把问题收窄到性别以后，才承认对方是男性。
- **next Limit：** 可以判断她有选择地描述，不能虚构第三人的行为。

**林旭阳：** 你刚说有些酒是别人点的。这个‘别人’是谁？

**来电人：** 我妹妹的一个朋友。他本来就在附近，后来过来坐了一会儿。

**林旭阳：** 男的还是女的？

**来电人：** 你听我——是男的。但我跟他不熟，也不是我叫来的。

【画面短停，屏幕掠过“桌上还有一个人”。主播立绘提亮。】

- **过场 ID：** quick-third-person-appears
- **过场类型：** reveal
- **过场短标：** 人数对不上
- **演出变体：** third-chair
- **触发行：** 4

**林旭阳：** 你刚才说的是姐妹俩。现在多出一个男的。别急，我没说发生过什么。我问的是，你为什么没提他？

**来电人：** ……我是不想被误会，不是想骗人。

### 第 3 轮｜再看她发来的朋友圈截图（social-feed）

【无线索原句后的反应】 **来电人：** 我能找到的都发了。你还要我答什么？

#### 普通问话

##### 第 9 组（social-feed-version）

**林旭阳：** 你说自己很久没出去。近两个月的动态还能找着吗？

**来电人：** 我又截了一批发后台了。里面是有五次……不对，我刚重新数了，是六次酒吧或者 KTV。上个月三个周末都有，最晚一张发到凌晨五点十七分，可有的是生日，有的是毕业聚会。照片里也能看见我胳膊上那片纹身，他第一次见我就看见了，这个我没藏。发得晚也不等于我每次都喝醉。

##### 第 10 组（how-he-knew-version）

**林旭阳：** 第二天他怎么知道桌上还有别人？

**来电人：** 我一开始只说自己喝多了，妹妹把我送回去。后来解释的时候顺嘴说了句‘他也不知道我会吐成那样’，男方就问这个‘他’是谁。后来他追着问，我才把那个人也说了。

##### 第 11 组（social-post-date）

**林旭阳：** 十号你还发了一组 KTV 的照片，那是哪天拍的？

**来电人：** 他可能以为是喝断片那晚拍的，其实不是，那是八号的照片，我晚了两天才发。

##### 第 12 组（previous-night）

**林旭阳：** 八号你也出去喝酒了？

**来电人：** 我跟师姐去唱歌，包厢套餐里带了六杯鸡尾酒。那天就我们两个，我也没喝醉，和九号不是一回事。

##### 第 13 组（closing-request）

**林旭阳：** 所以你现在希望我帮你判断什么？

**来电人：** 我想知道他是不是把这件事看得太重，也想问我还要不要联系。他条件确实合适，我也是真想认真谈。你能不能帮我写一句，我照着发给他？

#### 本轮玩家可选的问题方向

- **nightlife-pattern**：偶尔一次还是经常玩到很晚 → 对质 nightlife-pattern

- **how-he-knew**：男方怎么发现当晚还有别人 → 对质 how-he-knew

- **apology-post**：道歉当天仍发出的 KTV 动态 → 对质 apology-and-post

#### 本轮当面对质

##### nightlife-pattern

【依据话轮】missed-message-version / social-feed-version / previous-night

###### 微因果合同

- **premise Anchor：** 婚介向男方说她生活简单，她自己也说很久没出去、九号只是偶然；她发来的截图却有近两个月六次深夜酒局，八号和九号又连续两晚外出。
- **source Proves：** 她的夜生活不是一次孤立聚会；截图至少证明近两个月反复出现，后续回答又把这种社交习惯延伸到读研以来。
- **source Does Not Prove：** 朋友圈不能证明她每次都喝醉，也不能证明她和任何一名异性发生过越界行为。
- **answer Adds：** 她承认读研以后聚会一直不少，同学、师兄师姐里男的女的都有；近两个月有两三次玩到天亮，有时直接住在妹妹那里。
- **next Limit：** 主播可以判断她仍在缩小自己的长期生活状态，但不拿纹身、异性同行或去酒吧本身定罪。

**林旭阳：** 婚介跟他说你生活简单，你自己也说很久没出去。可你发来的截图里，两个月六次酒吧或者KTV，最晚一张到凌晨五点十七分。那几次你跟谁去的？

**来电人：** 同学、师兄师姐都有，男的女的都有。有两三次太晚了，我就在妹妹那里睡了。读研以后聚会一直不少，但也不能说我天天在外面玩吧。

**林旭阳：** 你开场说很久没出去。现在是两个月六次，读研以后也一直不少。你还是我问一句，你补一句。前面那些话全变了，我们还怎么聊？

**来电人：** 我没觉得聚会多就等于不认真。再说我单身的时候怎么玩，跟认真谈对象又不是一回事。

##### how-he-knew

【依据话轮】who-ordered-drinks / how-he-knew-version

###### 微因果合同

- **premise Anchor：** 她说第二天一开始仍只解释自己喝多、妹妹送她回去，男方后来追着问，她才补出桌上还有一个人。
- **source Proves：** 她没有主动把当晚人员说完整，男方是从她后续解释里的破绽继续问下去。
- **source Does Not Prove：** 男方起疑不能证明酒局发生过暧昧或其他未公开行为。
- **answer Adds：** 她解释时说了‘他也不知道我会吐成那样’，男方抓住这个‘他’追问，她才说出妹妹的男性朋友。
- **next Limit：** 主播可以判断她对男方也在分段补充，不能把男性在场直接写成越界。

**林旭阳：** 你不是主动告诉他的，是解释时先说漏了一个‘他’，对吧？

**来电人：** 我当时急着解释，哪会每句话都说得那么严谨。他听见了就一直问。

**林旭阳：** 他问这个‘他’是谁，你才把桌上那个人补上。不是他凭空怀疑。

**来电人：** ……是。但那个人就是我妹妹的朋友，我不想说得好像我专门去见他一样。

##### apology-and-post

【依据话轮】social-post-date / previous-night / closing-request

###### 微因果合同

- **premise Anchor：** 她说第二天一直认真解释和道歉，却在同一天公开发出前一晚 KTV 喝酒的照片。
- **source Proves：** 男方只看到她十号道歉时又发了一组 KTV 照片，并不知道照片拍于八号；这会让她的道歉显得很没分量。
- **source Does Not Prove：** 发旧照片不能证明她再次出去，也不能证明她故意挑衅。
- **answer Adds：** 她承认男方看得到，但坚持照片不是九号拍的，所以不该影响判断。
- **next Limit：** 主播只判断她的解释为何缺乏说服力，不替男方补唯一心理。

**林旭阳：** 十号你一边为九号喝多道歉，一边发了八号在 KTV 的照片。照片是哪天拍的，你知道，他不知道。

**来电人：** 可那不是同一天。我照片早就修好了，不发也浪费。他要是问，我完全可以解释。

**林旭阳：** 所以在他那儿，就是你刚为喝断片道歉，又发了一组喝酒的照片。他当然会怀疑，你这句道歉到底有多少分量。

**来电人：** 那我总不能因为他不高兴，什么都不发、哪里也不去吧？

**林旭阳：** 当然能发。只是他也能据此决定，这是不是自己想认真走下去的关系。

**来电人：** ……所以你也觉得，他不联系不是冲动。

### 主播结案复盘

> 主播结案复盘

#### 结束通话｜先别再发那首歌

【舞台状态】通话收尾

**林旭阳：** 你要我替你写一段把他劝回来的话，这种话我不会替你写的。

**林旭阳：** 你真还想联系，就只发一次，把八号和九号的事从头说清楚。桌上有谁，你醉到什么程度，都别再等他追问。

**林旭阳：** 最后问他一句，这些话他信不信，还愿不愿意继续。发完就停，别再来回猜了。

**来电人：** 可这些我后来都解释了。他不肯回，我还能怎么办？

**林旭阳：** 你那不叫一次解释清楚。每次都是他问到哪儿，你才补到哪儿。别再拿一个谎去圆另一个了。要说就一次说完，然后停。他回不回，是他的事。

**来电人：** ……好，我知道了。

#### 主播复盘｜三天里发生了什么

【舞台状态】结案复盘

**林旭阳：** 电话挂了。我把八号、九号、十号重新捋一遍。

**林旭阳：** 八号、九号、十号连起来看，问题就不只是一条没回的消息。

**林旭阳：** 那首歌，他隔了很久只回‘听了’；花倒是很快送到。你开口要的花、他送的包和车，又都进了同一条动态。

**林旭阳：** 八号，她和师姐去 KTV。

**林旭阳：** 九号，她和妹妹、妹妹的一名男性朋友喝酒。十一点五十二还回‘还行’，六分钟后没再回。

**林旭阳：** 十号，她道歉，同时发了八号那晚的KTV照片。

**林旭阳：** 她发来的旧动态里，近两个月有六次夜场。她后来承认，读研以后聚会一直不少。

**林旭阳：** 她也承认，自己很在意别人羡不羡慕这段关系。

#### 高概率判断｜他为什么停下

【舞台状态】高概率判断

**林旭阳：** 她是学生也好，平时爱出去也好，我都不拿这些给她定罪。婚介跟男方说她生活简单，她自己也一直说很久没出去，这次只是碰巧。可男方后来看到的不是这样。

**林旭阳：** 她打来是想让我说，男方就是不理解她，再教她怎么把人追回来。可她醉成什么样、桌上还有谁，全是男方追问以后才补出来的。连自己平时常不常出去，她也换了好几遍说法。

**林旭阳：** 我不猜酒桌上还有没有别的事。就她已经说出来的这些，男方要退出是有理由的。换成我，我也会劝他退出。

### 玩家提前收案｜按现有信息谨慎判断

#### 按现有信息收住｜先别追着复合

【舞台状态】谨慎收案

**林旭阳：** 你真还想联系，就把那个周末从头到尾说一遍。别再等他问一句，你补一句。

**林旭阳：** 他不想继续，是他的选择。你先别再说只是漏回了六分钟，那不是他当时看到的全部。

#### 事实边界｜能判断不合，不能替酒局定罪

【舞台状态】信息边界

**林旭阳：** 你开场那套说法省了太多。男方要退出，我能理解。

**林旭阳：** 酒桌上还有没有别的事，今晚不知道，我也不猜。今天到这儿。

#### 制作边界（不上屏）

##### risk Reading

- **标题：** 主播给出的风险判断
男方更可能不是因六分钟没回复而退出，而是在近期反复深夜聚会、连续两晚饮酒、第三人同行、醉酒程度、道歉当天的动态和她分层补充事实的过程中，重新判断两人是否适合长期关系。现有事实足以判断她的开场版本失真，也足以理解男方退出；但不能据此证明出轨、把谁当备选或存在供养关系。

- **confirmed Title：** 这通电话已经说清的事
##### 已确认

- 她主动让男方送花，也收过男方送的包，并把花、包和男方的车拍进公开动态；她的需求不只有私人交流。
- 九号十一点五十二分她回过‘还行’，六分钟后不再回复；她后来承认当时已经喝到难受，只是不想让男方知道。
- 九号酒桌上除她和妹妹外，还有妹妹的一名男性朋友；三个人混酒，她后来呕吐并记不清回程。
- 八号她和师姐去 KTV，九号又去酒吧；‘很久没出去，只是那天碰巧’不是完整版本。
- 她发来的朋友圈截图显示，近两个月有多次深夜酒吧或 KTV 动态；她承认读研以后聚会一直不少，同行的男男女女也不是固定一拨，其中两三次玩到天亮，直接住在妹妹那里。
- 十号她向男方解释和道歉的同时，公开发了八号 KTV 的照片。

- **unknown Title：** 今晚不需要继续猜的部分
##### 今晚定不了

- 九号酒局里是否发生过暧昧、身体接触或其他未公开行为。
- 男方退出时最看重的是醉酒、男性在场、连续改口，还是这些因素叠加。
- 她两个月以前的社交频率，以及两个人是否还会重新联系。

- **改写边界：** 本案以公开讨论中常见的相亲沟通、醉酒失联与信息逐步补充模式为结构参考，人物、机构、具体时间、聊天措辞、对质台词与舞台结论均为虚构合成。当前朋友圈三天可见、两批旧动态均由她本人翻出后截屏发给后台，主播没有直接浏览其历史朋友圈；纹身不作为品行证据，也不把异性在场单独写成越界证据。

#### UI 舞台配置（非剧情证据）

- **background Src：** ./assets/generated/backgrounds/livestream_studio_v2.png
- **art Style：** pixel
##### host

- **name：** 林旭阳
- **role Label：** 主播
- **art Src：** ./assets/generated/quick-detective/lin-xuyang-host-pixel.png
###### art Variants

- **listening：** ./assets/generated/quick-detective/lin-xuyang-host-pixel.png?v=0.27.0
- **questioning：** ./assets/generated/host/lin_xuyang_questioning_pixel.png?v=0.27.0
- **pressing：** ./assets/generated/host/lin_xuyang_pressing_pixel.png?v=0.27.0
- **结论：** ./assets/generated/host/lin_xuyang_verdict_pixel.png?v=0.27.0

##### caller

- **name：** 匿名来电人
- **role Label：** 语音连线
- **art Src：** ./assets/generated/quick-detective/caller-zhou-female-pixel.png
###### art Variants

- **neutral：** ./assets/generated/quick-detective/caller-zhou-female-pixel.png?v=0.27.0
- **guarded：** ./assets/generated/quick-detective/caller-zhou-female-guarded-pixel.png?v=0.27.0
- **pause：** ./assets/generated/quick-detective/caller-zhou-female-pause-pixel.png?v=0.27.0

#### 运行规则

- **内部 ID：** 02-one-missed-message
- **案件编号：** 02
- **cast Profile Id：** quick2-caller-zhou
- **confrontation Count：** 6

## 直播快案 03：某流量明星的小作文

- **开场：** 今晚不接电话。我们来看一篇某流量明星的小作文。

### 求助与重大隐瞒

- **format：** solo-commentary
- **为何今晚发生：** 一篇指向真人、文末却标了虚构的长文已经刷屏；女方发了公开回应，三千万争议也进入诉讼。林旭阳不接当事人电话，只把公开文本和必要背景压成五段，边读边给出自己的评价。
#### 公开求助

- **类型：** interest
- **求助内容：** 主播带观众看完五段长文精华与背景卡；玩家决定每一段先从哪里评价，任一成立角度都能推进，最后由主播说出自己的道德结论。

- **source Stake：** 长文试图让舆论在判决前先替作者给对方定性，同时保住‘我只是写了个故事、我只要公平、是她来找我谈’的说法。只要主播公开接受这套叙事，长文和诉讼就多了一次公开背书。
- **咨询者自利删减：** 长文先把自己写成被辜负的一方，再把没有转出的五千万、网友估损和中间人转述叠到已经进入诉讼的三千万上；直到末尾才完整出现撤声明、认全文等诉状外要求。
#### cover Strategy

- **public Image：** 长文把男方写成只想公开经历、要回钱并恢复名誉的人，再用更大的未转金额、商业损失和托人来谈证明女方已经怕了。
##### honest Details

- 他三十出头，做科技创业。
- 两个人谈了七个多月，见过家长，谈过婚。
- 对方是圈内女演员，已经公开回过一句不会为钱出卖爱情。

##### layered Leaks

- 第一段先摆两个人的利益基本盘，再让玩家从热搜收益、职业风险或虚构标注中任选一个切口。
- 第二段给代孕背景卡，玩家可以先谈监管红线、刑事边界或演艺圈前例。
- 第三段用五张卡和五千万放大数字，再让玩家选择审单方材料、拆金额或评价女方回应。
- 第四段把早前传闻、求和动机和中间人转述并排，玩家自行选择先推可信度还是先卡授权。
- 第五段把三条条件和未公开材料放到一起，玩家选择拆范围、评舆论杠杆或直接下道德判断。

#### case Ledger

- **surface Claim：** 公开长文把男方写成被金钱要求不断加码的一方；女方公开回应则把自己写成从未因金钱出卖爱情的一方。
- **dramatic Object：** 文末的虚构标注，正文里的名字和照片，打到家里账上的三千万，一天限额一百万逼出的五张卡，网上估出的上亿损失，中间人的转述，以及最后才说出的三条条件。
- **false Solution：** 大额转账、更大的开价、商业损失和托人来谈叠在一起，足以证明对方已经认账并求饶。
- **missing Edge：** 五千万没有转出；所谓上亿损失只是网友估算；来谈的消息没有对方本人原话；起诉状只写三千万，他却要求对方撤声明并公开承认整篇长文。
- **interest Path：** 如果玩家只追最大数字，主播就会被带去替单方长文判动机；如果玩家逐段选准切口，主播才会把两边的公开动作都评价到。
- **source Edit：** 长文先写委屈，再写大额转账和更大开价，随后叠上网传损失与中间人，最后才露出诉状外的两项公开要求。
- **第三压力：** 法院尚未实体审理；对方工作室说他拿声誉施压；圈里人自称受托调解，网上同时出现商业损失估算。
- **physical Verbal Lock：** 本快案不展示现实长文原页、起诉状或调解记录，只让主播读取虚构合成后的公开文本：文末标虚构、起诉范围写三千万，公开条件却还包括撤声明与认全文。
- **reversal：** 玩家起初容易被更大开价和求和传闻带走，五段读完后发现真正可评价的是双方已公开做出的动作：男方拿长文、传闻和条件压舆论，女方在声明里躲开三千万与代孕争议。
- **boundary：** 能确认虚构合成文本里出现了人物基本盘、虚构标注、未转出的五千万、已经进入诉讼的三千万、中间人转述和三条公开条件，也能确认国内现行监管禁止代孕；不能确认催卡、更大开价和代孕安排的原始记录，也不能确认三千万的法律性质、调解授权、具体刑事责任或判决结果。
- **quote Payoff：** 男方在骗舆论，女方在躲金钱账。三千万该不该退，法院判。
- **cover Layer：** 感性诡计：用‘我喜欢她’、‘我只要公平’和‘她现在怕了’先把讨论带到被辜负的一方。
- **load Bearing Layer：** 条件诡计：把诉状里的退钱，与诉状外的撤声明、承认全文捆成一套，再把这套说成普通和解。

#### deception Chain

##### 1. point and retreat

- **内部 ID：** point-and-retreat
- **surface Version：** 作者说自己只是公开经历，文末已经写了虚构。
- **omitted Fact：** 正文仍用身份和照片把读者指向现实人物。
- **immediate Benefit：** 既让舆论识别对象，又给作者保留退路。
###### trace Turn Ids

- profile-author
- profile-actress
- essay-label

- **player Test：** 这一段先看谁能从热搜获利、谁更怕职业塌方，还是先看作者怎样给自己留门
- **minimum Admission：** 主播指出点名配图与虚构标注同时存在。
- **advice Change：** 长文可以读，不能当判决书。

##### 2. numbers as one story

- **内部 ID：** numbers-as-one-story
- **surface Version：** 三千万、五张卡、五千万美元连在一起，足以证明女方只认钱。
- **omitted Fact：** 三千万已进入诉讼，五千万美元没有转出，女方回应则避开三千万。
- **immediate Benefit：** 用更大的未转数字给已经发生的争议加重量。
###### trace Turn Ids

- money-transferred
- money-not-transferred
- money-not-answered

- **player Test：** 能不能把已转、未转和未回应放在同一个账里
- **minimum Admission：** 主播同时批评女方回避和男方把单方细节写成全貌。
- **advice Change：** 道德评价公开回应，法律结论仍交给法院。

##### 3. rumor as feedback

- **内部 ID：** rumor-as-feedback
- **surface Version：** 代孕曝光足以毁掉职业，又有人提前来谈，说明女方已经怕了、认了。
- **omitted Fact：** 职业风险与求和时间确实对得上，但和解仍是中间人转述，没有女方本人消息。
- **immediate Benefit：** 把合理动机进一步包装成女方本人已经授权和认账。
###### trace Turn Ids

- early-rumor
- mediation-retelling
- motive-alignment

- **player Test：** 可信的求和动机能不能替中间人补出本人授权
- **minimum Admission：** 主播可以说求和推断很可信，但不能说女方本人已经授权。
- **advice Change：** 保留高概率判断，也保留最后一环材料缺口。

##### 4. lawsuit as leverage

- **内部 ID：** lawsuit-as-leverage
- **surface Version：** 退钱、撤声明、认全文只是普通的一套和解。
- **omitted Fact：** 按男方公开说法，诉状只写三千万，后两条是诉状外要求。
- **immediate Benefit：** 借可诉的金额争议让对方为整篇私生活叙事背书。
###### trace Turn Ids

- essay-label
- settlement-three
- lawsuit-scope
- more-to-release

- **player Test：** 诉状里的钱能不能和认全文绑成一件事
- **minimum Admission：** 主播把三千万与撤声明、认全文拆开。
- **advice Change：** 拒绝替诉状外的公开要求催促。

### 第 1 轮｜第一段 · 两个人与这篇长文（people-and-post）

【无线索原句后的反应】 **林旭阳：** 先看两个人各自靠什么活，再决定从哪儿评价这篇文。

#### 普通问话

##### 第 1 组（profile-author）

**林旭阳：** 先把男方放回他的基本盘。

【上屏长文】男方是高流量科技创业者，钱多、话筒多，也习惯把争议变成注意力。

##### 第 2 组（profile-actress）

**林旭阳：** 再看女方靠什么吃饭。

【上屏长文】女方是曾经站在流量顶端的演员，播出平台、品牌和公众形象都是她的职业资产。

##### 第 3 组（essay-label）

**林旭阳：** 然后才看这篇文怎么写。

【上屏长文】正文指向现实人物并配图，文末却留了一句『纯属虚构』。

#### 本段玩家可选的点评切口

- **attention-asymmetry**：先看谁更能从热搜获利 → 点评 attention-asymmetry

- **career-asymmetry**：先看谁更怕职业塌方 → 点评 career-asymmetry

- **labeled-fiction**：先看长文怎样给自己留门 → 点评 labeled-fiction

#### 本段主播点评

##### attention-asymmetry

【依据话轮】profile-author / profile-actress

###### 微因果合同

- **premise Anchor：** 男方靠注意力做生意，女方靠平台、品牌和公众形象吃饭。
- **source Proves：** 双方在同一轮热搜里的收益与职业风险并不对称。
- **source Does Not Prove：** 这种不对称不能证明任何私密指控属实。
- **answer Adds：** 主播先说明男方可能从争议获利，而女方可能承担职业损失。
- **next Limit：** 只解释传播动机，不替后续材料定真假。

**林旭阳：** 先看基本盘。男方靠注意力做生意，争议本身也能给他带来流量。

**林旭阳：** 所以他主动放料，付出的主要是口碑；女方付出的可能是整个职业。

**林旭阳：** 同一场热搜，对两个人不是一个价。

##### career-asymmetry

【依据话轮】profile-actress / essay-label

###### 微因果合同

- **premise Anchor：** 女方的播出平台、品牌与公众形象都是职业资产。
- **source Proves：** 争议曝光可能直接伤到她的职业合作。
- **source Does Not Prove：** 职业风险不能证明她做过长文所写的私密行为。
- **answer Adds：** 主播把女方可能急于灭火的职业背景先摆出来。
- **next Limit：** 动机只用于解释反应，不能补成事实。

**林旭阳：** 女方靠平台、品牌和公众形象吃饭。她最怕的，不只是被骂。

**林旭阳：** 一旦碰到行业红线，项目、代言和播出都可能一起停。

**林旭阳：** 这就是后面『她为什么可能急』的背景。

##### labeled-fiction

【依据话轮】profile-author / essay-label

###### 微因果合同

- **premise Anchor：** 长文正文指向现实人物并配图，文末同时标注纯属虚构。
- **source Proves：** 作者一面把读者指向现实人物，一面在文末保留虚构标注。
- **source Does Not Prove：** 这组写法本身不能证明长文中的私密指控全部属实，也不能替法院认定责任。
- **answer Adds：** 主播明确评价这种写法是在指向真人的同时给作者自己留退路。
- **next Limit：** 只评价公开写法，不借此替任何一边回答后续争议。

**林旭阳：** 正文把人指给观众看，文末又给自己留着虚构，这不是普通讲故事。

**林旭阳：** 文末的纯属虚构是你自己写的。

**林旭阳：** 这篇文可以看，不能当判决书。

### 第 2 轮｜第二段 · 代孕背景卡（surrogacy-background）

【无线索原句后的反应】 **林旭阳：** 这张背景卡既不是给谁定罪，也不是替谁洗白。先选你要说清的那一层。

#### 普通问话

##### 第 4 组（domestic-rule）

**林旭阳：** 第二段，先把国内规则说准。

【上屏长文】国内现行监管明确禁止任何形式的代孕，医疗机构和医务人员不得实施相关技术。

##### 第 5 组（criminal-boundary）

**林旭阳：** 但别顺嘴加罪名。

【上屏长文】禁止不等于所有参与者自动构成同一个刑事罪名，刑事责任仍要看具体行为。

##### 第 6 组（industry-precedent）

**林旭阳：** 再看演艺圈已经发生过什么。

【上屏长文】此前已有头部女星因境外代孕争议叠加偷逃税处罚，被停止邀请和播出，演艺事业就此停摆。

#### 本段玩家可选的点评切口

- **surrogacy-rule**：先说明国内为什么把代孕当红线 → 点评 surrogacy-rule

- **surrogacy-crime-boundary**：先把禁止与刑事定罪分开 → 点评 surrogacy-crime-boundary

- **career-precedent**：先看前例为什么让女方可能着急 → 点评 career-precedent

#### 本段主播点评

##### surrogacy-rule

【依据话轮】domestic-rule / industry-precedent

###### 微因果合同

- **premise Anchor：** 国内现行监管明确禁止代孕。
- **source Proves：** 代孕在国内监管、伦理与行业层面都是明确红线。
- **source Does Not Prove：** 监管禁止本身不能证明本案当事人已经实施相关行为。
- **answer Adds：** 主播解释代孕争议为什么会给公众人物带来重大职业后果。
- **next Limit：** 背景卡说明规则，不替单方长文证明事实。

**林旭阳：** 先说准。国内现行监管明确禁止代孕，医疗机构和医务人员不能做。

**林旭阳：** 这不是普通恋爱黑料，它同时踩到伦理、行业和监管红线。

**林旭阳：** 对公众人物，职业后果会比一般绯闻重得多。

##### surrogacy-crime-boundary

【依据话轮】domestic-rule / criminal-boundary

###### 微因果合同

- **premise Anchor：** 监管禁止与刑事定罪不是同一个判断。
- **source Proves：** 现行规则禁止相关技术与服务。
- **source Does Not Prove：** 所有参与者不会因此自动构成同一个刑事罪名。
- **answer Adds：** 主播明确把道德和监管评价与刑事责任分开。
- **next Limit：** 具体罪责只能跟随具体行为与材料。

**林旭阳：** 但我不把『禁止』顺嘴说成所有参与者都已经犯罪。

**林旭阳：** 有没有刑事责任，要看非法行医、买卖、遗弃之类的具体行为和材料。

**林旭阳：** 观点可以重，罪名不能靠主播补。

##### career-precedent

【依据话轮】profile-actress / industry-precedent

###### 微因果合同

- **premise Anchor：** 已有头部女星因代孕争议叠加税务处罚退出演艺场。
- **source Proves：** 相似争议曾给头部演员带来停播与职业停摆。
- **source Does Not Prove：** 历史前例不能证明本案女方实施过同样行为。
- **answer Adds：** 主播用行业前例解释女方可能存在强烈止损动机。
- **next Limit：** 只能推到动机合理，不能推到传闻已经坐实。

**林旭阳：** 前面已经有头部女星，因为境外代孕争议，再叠上偷逃税，节目停播，演艺事业停摆。

**林旭阳：** 所以对一个靠平台和品牌吃饭的女明星，代孕曝光绝不是普通公关危机。

**林旭阳：** 她有强烈灭火动机，这个判断顺逻辑。

### 第 3 轮｜第三段 · 钱与女方回应（money-and-reply）

【无线索原句后的反应】 **林旭阳：** 大数字先别揉成一团。哪笔转了，哪笔没转，哪笔没人回，分开看。

#### 普通问话

##### 第 7 组（money-transferred）

**林旭阳：** 第三段，看真正转出去的。

【上屏长文】长文说，谈婚期间三千万打进女方家里账户；男方的原话是，她嫌一天限额一百万太慢，让我准备五张卡一起打。

##### 第 8 组（money-not-transferred）

**林旭阳：** 再看更大的那笔。

【上屏长文】他又写，后来女方开口要五千万美元；他的回答是『让我想想』，这笔钱没有转出去。

##### 第 9 组（money-not-answered）

**林旭阳：** 然后是女方回应。

【上屏长文】女方说自己从没因为金钱出卖爱情，但对三千万，一个字没回，代孕与更大开价也没有逐项回应。

#### 本段玩家可选的点评切口

- **single-source-money**：先把男方的私密细节放回单方层 → 点评 single-source-money

- **money-split**：先拆已转、未转和没回应 → 点评 money-split

- **reply-avoids-money**：先评价女方这份回应 → 点评 reply-avoids-money

#### 本段主播点评

##### single-source-money

【依据话轮】money-transferred / money-not-transferred

###### 微因果合同

- **premise Anchor：** 五张卡与更大开价目前都来自男方长文。
- **source Proves：** 男方公开写过这些私密细节。
- **source Does Not Prove：** 公开写下不等于每个细节都有第二份材料。
- **answer Adds：** 主播拒绝用女方回应不完整来替男方整篇叙事保真。
- **next Limit：** 已诉金额、未转金额与单方细节继续分层。

**林旭阳：** 五张卡、催得急、开更大的价，这些细节现在仍主要来自男方长文。

**林旭阳：** 三千万进入诉讼，不等于整篇私密叙事都跟着保真。

**林旭阳：** 我可以不信女方的回应，也不能把男方每一句都当第二份材料。

##### money-split

【依据话轮】money-transferred / money-not-transferred / money-not-answered

###### 微因果合同

- **premise Anchor：** 男方说三千万已经转出并起诉；五千万美元停在开口和让我想想；女方声明没有回应三千万。
- **source Proves：** 公开叙事里存在已诉金额、未转金额和未回应金额三层。
- **source Does Not Prove：** 男方写下五张卡和更大开价，不等于这些私密细节已有第二份来源，也不等于三千万已被判为应退彩礼。
- **answer Adds：** 主播明确批评女方回应躲开三千万，同时拒绝把未转金额算入已拿走的钱。
- **next Limit：** 道德上评价公开回应，法律上仍把三千万交给法院。

**林旭阳：** 三千万，是男方说已经转出并起诉的；五千万美元，是他说女方开过口，但没转。

**林旭阳：** 没转的钱，不能塞进她已经拿走的钱里。

**林旭阳：** 三千万该不该退，法院判。

##### reply-avoids-money

【依据话轮】money-transferred / money-not-answered

###### 微因果合同

- **premise Anchor：** 女方以感情表态回应，却没有逐项回应三千万与代孕争议。
- **source Proves：** 女方公开回应避开了争议中的关键钱款与生育问题。
- **source Does Not Prove：** 回应回避不能反过来证明男方全部私密叙事属实。
- **answer Adds：** 主播明确拒绝接受用漂亮话绕开关键问题的回应。
- **next Limit：** 道德上评价回避，事实层仍不替男方补证。

**林旭阳：** 女方说自己从不拿金钱换爱情，却对三千万一个字不回。

**林旭阳：** 代孕和更大开价，她也没有逐项回应。

**林旭阳：** 她想靠一句漂亮话把钱和代孕一起带过去，这个回应，我不接受。

### 第 4 轮｜第四段 · 早前传闻与求和（settlement-rumor）

【无线索原句后的反应】 **林旭阳：** 动机可以推，授权不能编。先决定这一拍评价哪一层。

#### 普通问话

##### 第 10 组（early-rumor）

**林旭阳：** 第四段，回到长文刷屏以前。

【上屏长文】在这篇长文刷屏前，网上已经出现代孕传闻，也传出有人提前找中间人谈。

##### 第 11 组（mediation-retelling）

**林旭阳：** 再看这是谁的原话。

【上屏长文】男方把有人来谈解释成女方害怕，但整段公开材料里只有中间人转述，没有她一句话。

##### 第 12 组（motive-alignment）

**林旭阳：** 那为什么这传闻又很像真的？

【上屏长文】对依赖平台、品牌和公众形象的演员来说，代孕曝光可能击穿职业，所以求和动机与时间顺序确实对得上。

#### 本段玩家可选的点评切口

- **settlement-inference**：先说为什么求和推断很可信 → 点评 settlement-inference

- **mediation-authorization**：先说证据链还缺哪一环 → 点评 mediation-authorization

- **rumor-as-leverage**：先看男方怎样把传闻变成压力 → 点评 rumor-as-leverage

#### 本段主播点评

##### settlement-inference

【依据话轮】early-rumor / motive-alignment

###### 微因果合同

- **premise Anchor：** 求和传闻的时间与女方可能承受的职业风险能够对上。
- **source Proves：** 公开背景提供了一个符合一般逻辑的求和动机。
- **source Does Not Prove：** 动机吻合仍不能证明中间人得到女方授权。
- **answer Adds：** 主播给出高可信度个人推断，同时保留授权边界。
- **next Limit：** 后续只核对转述链，不把推断写成本人承认。

**林旭阳：** 我的推断很直接：她想灭火，可信度很高。

**林旭阳：** 为什么？职业风险、早前传闻和求和时间能对上，一般人都会先止损。

**林旭阳：** 但高概率推断仍不是本人授权。

##### mediation-authorization

【依据话轮】mediation-retelling / motive-alignment

###### 微因果合同

- **premise Anchor：** 现有公开说法停在中间人转述。
- **source Proves：** 男方公开称有人出面谈。
- **source Does Not Prove：** 没有女方本人材料能够确认授权与具体诉求。
- **answer Adds：** 主播明确指出可信动机与本人授权之间缺少一环。
- **next Limit：** 不让中间人替女方认账。

**林旭阳：** 这里就差最后一环：她本人有没有授权。

**林旭阳：** 现有说法只能到『没有。中间人说是她的意思』，材料里没有她一句话。

**林旭阳：** 动机能解释求和，不能替中间人补授权。

##### rumor-as-leverage

【依据话轮】early-rumor / mediation-retelling

###### 微因果合同

- **premise Anchor：** 男方把早前传闻与有人来谈解释成女方害怕。
- **source Proves：** 传闻和中间人转述被一并放进公开叙事。
- **source Does Not Prove：** 两者并不能替女方本人承认长文。
- **answer Adds：** 主播指出男方把可信动机进一步加工成舆论压力。
- **next Limit：** 只评价公开传播动作，不猜未公开沟通。

**林旭阳：** 早前传闻可以解释双方为什么突然谈，但男方又把『有人来谈』说成『她怕了』。

**林旭阳：** 这一步，是把传闻和中间人一起变成舆论压力。

**林旭阳：** 可信的动机，不等于可以公开替她认账。

### 第 5 轮｜第五段 · 三条条件与最后判断（settlement-scope）

【无线索原句后的反应】 **林旭阳：** 手里还有什么，现在没人看见。先看已经公开开的条件。

#### 普通问话

##### 第 13 组（settlement-three）

**林旭阳：** 最后一段，看男方到底要什么。

【上屏长文】他开出三条：退三千万、撤回公开声明、公开承认整篇长文都是真的。

##### 第 14 组（lawsuit-scope）

**林旭阳：** 再对一下起诉范围。

【上屏长文】但他自己也承认：三千万在状子里。撤声明、认长文都不在。

##### 第 15 组（more-to-release）

**林旭阳：** 文章末尾还压了一句。

【上屏长文】文末写着虚构，收尾却说她自己清楚；我手里还有，今晚先不放。

#### 本段玩家可选的点评切口

- **settlement-scope**：看诉状外多出来的两条 → 点评 settlement-scope

- **public-leverage**：先评价『我手里还有』这套玩法 → 点评 public-leverage

- **moral-conclusion**：现在给两个人下道德判断 → 点评 moral-conclusion

#### 本段主播点评

##### settlement-scope

【依据话轮】settlement-three / lawsuit-scope

###### 微因果合同

- **premise Anchor：** 三千万进入诉状，撤声明与认全文属于诉状外要求。
- **source Proves：** 男方把诉状内外的三项要求列为同一套条件。
- **source Does Not Prove：** 金额争议不能替诉状外要求自动取得正当性。
- **answer Adds：** 主播把退钱与公开背书拆成不同问题。
- **next Limit：** 三千万交给法院，主播只评价诉状外施压。

**林旭阳：** 三千万在状子里。撤声明、认长文都不在。

**林旭阳：** 退钱是一件事，让对方替整篇私生活背书是另外两件。

**林旭阳：** 别拿诉讼里的钱替诉状外的要求抬轿。

##### public-leverage

【依据话轮】essay-label / more-to-release

###### 微因果合同

- **premise Anchor：** 文末保留虚构标注，作者又以未公开材料施压。
- **source Proves：** 男方公开使用了我手里还有但暂时不放的表达。
- **source Does Not Prove：** 未公开材料的内容与真实性目前都无法判断。
- **answer Adds：** 主播把这种表达评价为利用对方职业风险施压。
- **next Limit：** 不猜未公开材料，只评已经说出口的威胁结构。

**林旭阳：** 文末留着虚构，转头又拿『我手里还有』压对方认全文。

【画面短停，屏幕掠过“文末虚构，转头用未公开材料施压”。主播立绘提亮。】

- **过场 ID：** quick-public-leverage
- **过场类型：** reveal
- **过场短标：** 最后一张牌
- **演出变体：** settlement-terms
- **触发行：** 1

**林旭阳：** 这不是讲理，是拿女方最怕的职业后果当杠杆。

**林旭阳：** 这套玩法，我不会帮你催。

##### moral-conclusion

【依据话轮】settlement-three / more-to-release

###### 微因果合同

- **premise Anchor：** 男方要求认全文并继续放话，女方回应则避开关键钱款。
- **source Proves：** 双方都做出了可供道德评价的公开动作。
- **source Does Not Prove：** 这些公开动作不能替法院完成金额与刑事判断。
- **answer Adds：** 主播给出针对舆论操纵与金钱回避的固定个人结论。
- **next Limit：** 结论落在公开行为，不冒充法律定性。

**林旭阳：** 到这里，我可以给个人结论了。

**林旭阳：** 男方在骗舆论，女方在躲金钱账；两边都不是我会替他说话的人。

**林旭阳：** 这个判断落在他们已经公开做出的动作上，不冒充法律判决。

### 主播结案复盘

> 主播个人结论

#### 五段看完｜两边，我都不站

【舞台状态】结案复盘

**林旭阳：** 五段看完了。先给结论：我不站男方，也不替女方洗。

**林旭阳：** 男方把点名、虚构标注、代孕传闻和诉状外条件绑在一起，想让舆论先替他判。这套做法，我不信。

**林旭阳：** 女方说自己从不拿金钱换爱情，却没回应三千万和代孕争议。这个回法，我也不信。

#### 我的评价｜男方在骗舆论，女方在躲金钱账

【舞台状态】个人判断

**林旭阳：** 男方的问题不是文章长，是他把一面说法写成全貌，还要对方公开认全文。道德上，这是操纵。

**林旭阳：** 女方的问题不是不肯认输，是她在最关键的钱和生育问题前绕开，只留一句漂亮话。道德上，这是回避。

**林旭阳：** 她想提前灭火，我认为非常符合一般逻辑；但是否由她授权中间人，目前仍缺本人材料。

**林旭阳：** 我的话再直一点：男方在骗舆论，女方在躲金钱账。两边都不是我会替他说话的人。

#### 事实边界｜观点要直，材料不能乱补

【舞台状态】最后收束

**林旭阳：** 五张卡、五千万、代孕细节，还是男方一个人在讲。网上说真掉了要赔上亿，没有账单。中间人来谈，没有她一句话。

**林旭阳：** 能骂的，骂已经做出来的动作。没材料的，别替任何人补。

**林旭阳：** 三千万该不该退，法院判。代孕在国内被禁止，也不能由主播顺手写成已经构成某个罪名。

**林旭阳：** 认整篇长文这件，我不会帮你催。

### 玩家提前收案｜按现有信息谨慎判断

#### 先下结论｜只评已经看见的动作

【舞台状态】提前收束

**林旭阳：** 看到这里，我只评公开动作：点名配图又标虚构，这种写法我不信。

**林旭阳：** 后面的金额、回应和条件还没看完，现在不替任何一边把结论补齐。

#### 制作边界（不上屏）

##### risk Reading

- **标题：** 主播给出的风险判断
主播明确不接受男方用指向真人的长文、虚构标注、代孕传闻和诉状外条件操纵舆论，也不接受女方用一份没有回答三千万与代孕争议的声明证明自己与金钱无关。这个道德判断只针对双方已公开做出的动作；五张卡、更大开价、代孕细节、商业损失与调解授权仍缺少第二份材料。

- **confirmed Title：** 公开材料里能确认的动作
##### 已确认

- 男方公开长文正文指向现实人物并配图，文末同时标注『纯属虚构』。
- 男方公开叙事称三千万已经转出并进入诉讼；他所说的五千万美元没有转出。
- 女方公开说自己从没因为金钱出卖爱情，但公开回应没有回答三千万与代孕争议。
- 国内现行监管明确禁止任何形式的代孕；禁止不等于所有参与者自动构成同一个刑事罪名。
- 此前已有头部女星因境外代孕争议叠加偷逃税处罚，被停止邀请和播出，演艺事业停摆。
- 上亿损失来自网络估算，不是本案展示的正式账单。
- 网上曾出现提前求和的传闻；所谓女方授权仍来自中间人转述，本案没有女方本人消息。
- 男方公开提出退三千万、撤声明、认全文三条；按他的说法，起诉状只写三千万。

- **unknown Title：** 今晚不需要继续猜的部分
##### 今晚定不了

- 这笔三千万在法律上是否构成应退彩礼，以及法院会如何认定。
- 五千万美元的开价是否有原始记录；本案只能确认男方公开这样写过。
- 男方所说的催卡、代孕安排和其他私密互动有没有第二份来源。
- 片方、品牌方是否会索赔，具体金额是多少，今晚没有正式通知。
- 中间人是否得到女方本人授权，转述是否完整，今晚没有第二份来源。
- 三条条件是否曾完整送达对方、对方如何回复，今晚只有他的说法。
- 代孕相关的具体行为是否发生、谁参与，以及是否产生刑事责任，今晚没有足够材料。
- 男方所称未公开材料到底是什么、是否真实，今晚没有内容可看。

- **改写边界：** 本案借用公开争议中‘指向真人的长文标注虚构、财产诉讼、代孕争议、公开声明与中间人自称调解同时出现’这一结构。游戏只让主播阅读压缩过的虚构合成长文、回应与公共背景卡，不安排真人来电；人物、平台账号、机构、标题、转账打法、三条条件、台词与主播结论均为虚构合成。大额开价、代孕安排和其他私密说法没有司法确认；‘提前求和’仍来自传闻与中间人转述，不写成女方已经授权或认账。国内现行监管禁止代孕，但不把这一规则顺手写成所有参与者已经构成同一个刑事罪名。主播可以对公开行为作明确道德评价，金额与法律结果仍交给法院和有权机关。

#### UI 舞台配置（非剧情证据）

- **background Src：** ./assets/generated/backgrounds/livestream_studio_v2.png
- **art Style：** pixel
##### host

- **name：** 林旭阳
- **role Label：** 主播
- **art Src：** ./assets/generated/quick-detective/lin-xuyang-host-pixel.png
###### art Variants

- **listening：** ./assets/generated/quick-detective/lin-xuyang-host-pixel.png?v=0.27.0
- **questioning：** ./assets/generated/host/lin_xuyang_questioning_pixel.png?v=0.27.0
- **pressing：** ./assets/generated/host/lin_xuyang_pressing_pixel.png?v=0.27.0
- **结论：** ./assets/generated/host/lin_xuyang_verdict_pixel.png?v=0.27.0

##### 来源

- **name：** 某流量明星的小作文
- **role Label：** 公开长文 · 虚构合成

#### 运行规则

- **内部 ID：** 03-labeled-fiction
- **案件编号：** 03
- **cast Profile Id：** quick3-caller-gu
- **confrontation Count：** 15

# 尾声

## 收播后

- **开场：** 屏幕右上角的“直播中”灭了。你摘下耳机，房间一下安静下来。
### unread Messages

#### 1. case1 callback

- **内部 ID：** case1-callback
- **案件 ID：** 01-credit
- **case Label：** 第一通回访
- **sender：** 咨询者
- **声纹卡 ID：** case1-caller-shen
- **base：** 新闻出来以后他只回了一句。宸直那二十万现在动不了。什么时候能拿回来他也不知道。八万我没转。灯收进箱子了。
##### echoes

- **pragmatic：** 面煮了，放了两个蛋。
- **affirm：** 你那句话我又听了一遍。
- **accompany：** 明晚我听着。不打了，就听。

##### attachment

- **类型：** image-placeholder
- **标签：** 装回箱子的灯
- **alt：** 一盏重新装回纸箱的灯

#### 2. case4 callback

- **内部 ID：** case4-callback
- **案件 ID：** 04-workplace
- **case Label：** 第二通回访
- **sender：** 陈
- **声纹卡 ID：** case4-caller-chen
- **base：** 明天的话我写好了，三个版本。……开玩笑的。用第一版：先报备，再要回单号。
##### echoes

- **pragmatic：** 就是你说的顺序。
- **affirm：** 『六万八是六万八』，我抄在第一版开头了。
- **accompany：** 下周一开会前要是扛不住，我真打啊。

#### 3. case3 callback

- **内部 ID：** case3-callback
- **案件 ID：** 03-profile
- **case Label：** 第三通回访
- **sender：** 表妹
- **声纹卡 ID：** case3-caller-cousin
- **base：** 我姐把周末包间退了。定金没退。两边父母也各自说过了。她说二十八万八先不提。宸直的新闻也出来了。那笔钱更不敢算进婚礼预算。她让我替她说声谢谢——她自己不好意思打。
##### echoes

- **pragmatic：** 她说包里会放张表。让你别问是哪张。
- **affirm：** 她把『问清楚不丢人』那句转给我姨了。
- **accompany：** 谈完她可能真会打。你们等着。

#### 4. case2 callback

- **内部 ID：** case2-callback
- **案件 ID：** 02-tony
- **case Label：** 第四通回访
- **sender：** 咨询者
- **声纹卡 ID：** case2-caller-he
- **base：** 周把转账和回单原图又交了一遍，我也把自己的聊天和十二万转账交了。我们没去店里堵人。新闻出来以后，Tony 还是只说已经提交，没把合同发来。我的钱到底进没进产品，还是不知道。
##### echoes

- **pragmatic：** 聊天、转账和他发的提交页面，我分开存了。
- **affirm：** 群里有人说，当时喜欢听那些话也不丢人。
- **accompany：** 后面真要走投诉，我先拿材料问清楚。

##### attachment

- **类型：** image-placeholder
- **标签：** 转账与回单原图
- **alt：** 分别保存的转账、聊天与回单截图

#### 5. unknown mover

- **内部 ID：** unknown-mover
- **sender：** 陌生号码
- **声纹卡 ID：** case4-unknown-mover
- **base：** 老规矩不止你们一家。你们哪天做职场专场，我再来。——搬过三次仓库的人

- **数据较好分支：** 后台曲线停在一个不难看的数字上。老方没发短信——没消息就是好消息，至少今晚是。
- **数据较差分支：** 后台曲线停在老地方。老方的短信显示“输入中”……又消失了。下周，方案还是要交。
- **platform Cost：** 后台曲线掉回老地方。老方这次没打字，直接发来一句：‘推荐位没了。下周一的方案，照交。’
- **回家：** 天有点亮了。赵睡在沙发上，合同盖在脸上。保温盒空了。你顺手洗了，倒扣在水池边。你把她的合同挪开，又把自己的手机放远了点。
- **收束：** 你从包里拿出那个牛皮纸文件袋。封口贴着一张便签，赵的字：『你当年没问完的那通，我帮你找到了后续。』便签下露出一角日期：2019-11-08，『已撤回的账单』。
### closing Cg

- **src：** ./assets/generated/cg/envelope-2019-pixel.png?v=0.28.0
- **alt：** 天快亮时，直播桌上摊开的牛皮纸文件袋和旧账单
- **kicker：** 2019-11-08
- **caption：** 你当年没问完的那通

# 评论与分享文案库

## 评论种子

- **主题 ID：** identity-cost-demo
### 评论种子

- 每次听到'自己人''为你好',我都想先捂钱包.
- 看完睡不着,明天还早八
- 等等,前几通是不是都少说了一句?
- 我站主播问账单,心疼可以,转账得慢一点.
- 他一说自己难,怎么又转到要别人掏钱了.
- 钱是她自己转的,可合同和回单也不能一直不给吧.
- 我把我男朋友账单也翻了.没事.就是有点想不起来密码了
- 主播嗓子哑了吧,喝点水
- 六万八刷自己卡上还不敢发群,我血压上来了.
- 她自己也答应绕流程了,这句不能跳过.
- 主播两年前那期的事,老观众都还记得.
- 他刚才停的那半秒,老观众都懂.
- 十二万是她自己转的,右半张也得一起看.
- 赵姐今晚也在听吧.

- **low Reveal Tone：** 漂亮话一多,她省掉的那句你还没听出来.
- **high Reveal Tone：** 该点的那句,你点到了.
