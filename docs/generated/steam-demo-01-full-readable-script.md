# 《Steam 试玩版》全量可读文字剧本

> 本文档由内容包自动汇编。它按真实游玩阶段整理夜 A、收麦幕间、白天调查、夜 B、材料与所有分支；同一阶段的互斥选项会并列收录，不表示它们会在一次实机流程里连续发生。方括号内是舞台或玩法说明，不是角色台词。需要逐屏核对固定代表路线时，请看“连续故事台本”。请修改 JSON 真源后运行 `npm run content:script`，不要手改本文档。

## 阅读入口

- [连续故事台本](steam-demo-01-continuous-story-script.md)：顺着主线读：序章、四案、尾声；其他问法放在附录。
- [纯故事台本](steam-demo-01-pure-story-script.md)：逐场对照台词和可选接法；并列分支不代表连续发生。
- [导演阅读版](steam-demo-01-director-script.md)：查看排演动作、人物资料和主要分支；含作者信息。
- [全量可读文字剧本](steam-demo-01-full-readable-script.md)：查完整字段、原件和独立快案；含作者信息与后续真相。

> **时间与场景：** 案件按讲述顺序排列，各案日期见正文，并非连续几晚。方括号为动作、材料或场景说明，不作台词朗读。

## 目录

- [阅读图例](#reading-section-1)
- [故事包总纲](#reading-section-2)
- [【编剧资料】案件顺序与舞台索引](#reading-section-3)
- [演员与声纹速查](#reading-section-4)
- [咖啡厅序章：开播前](#reading-section-5)
- [2024-07-15 晚上八点：开麦](#reading-section-6)
- [第一幕：账单里的八万](#reading-section-7)
- [第二幕：职场报销截图](#reading-section-8)
- [第三幕：彩礼与流水](#reading-section-9)
- [第四幕：那张名单](#reading-section-10)
- [独立模式：直播快案](#reading-section-11)
- [尾声](#reading-section-12)
- [试玩片尾](#reading-section-13)
- [评论与分享文案库](#reading-section-14)

<a id="reading-section-1"></a>

## 阅读图例

- **角色名：** 玩家能听见或读到的台词。
- `【可选】` 表示玩家选择、失败反馈、顾问分歧或未必进入本轮的分支。
- `【编剧资料】` 表示真相边界、人物利益、路线轴等不会原样播出的制作信息。
- 同一个表面名（如“咨询者”）只在所属案件内指向该案角色。

<a id="reading-section-2"></a>

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
- 过去垫钱能多结一笔，现在多个部门都在等；押金归集进了关联资金平台。
- 学校图和工资卡都是真的，两边的全部家底仍没有摊开。
- 店表写了起投和走他户；直播时只有提交页，收播后 Tony 补来的成交材料确认已经认购。

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

<a id="reading-section-3"></a>

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

### 节目日历与历史材料日期

- **timezone：** Asia/Shanghai
- **first Night Date：** 2024-07-15
#### case Sessions

##### 1. case Sessions 1

- **案件 ID：** 01-credit
###### dates

- 2024-07-15
- 2024-07-16

##### 2. case Sessions 2

- **案件 ID：** 04-workplace
###### dates

- 2024-07-25
- 2024-07-26

##### 3. case Sessions 3

- **案件 ID：** 03-profile
###### dates

- 2024-08-22
- 2024-08-23

##### 4. case Sessions 4

- **案件 ID：** 02-tony
###### dates

- 2024-09-21
- 2024-09-22

- **cafe Prologue Date：** 2024-09-01
- **present Date：** 2024-09-22
- **forensic Callback Date：** 2024-09-23
- **news Date：** 2024-09-22
- **platform Deadline：** 2024-09-23T09:00:00+08:00
- **workplace Meeting Date：** 2024-07-29
- **workplace Public Recap Date：** 2024-07-29
- **workplace Activity Date：** 2024-06-26
- **case3 Dinner Date：** 2024-08-25
- **host Started Month：** 2022-01
- **host Misjudgment Month：** 2022-07
- **old Bill Date：** 2019-11-08

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
- **出现界面：** night-b-and-case-tail
- **entity Id：** qixing-shared-tech
###### anchors

- 包干
- 虚增费用
- 押金
- 关联往来

- **document Id：** case4-department-ledger
###### row Ids

- q06
- q09

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

- **revalues：** 栖行的亏损经营、包干虚列费用、虚增协调费与跨部门待付，先引出押金关联归集的疑问；最终处置通报确认宸直将押金用于金融杠杆。这不把所有个案转账并成同一笔，也不预判各人清偿金额。

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

<a id="reading-section-4"></a>

## 演员与声纹速查

| 角色 | 类型 | 固定性格 | 压力反应 | 主要声纹 |
|---|---|---|---|---|
| 林旭阳 | host | 见得多、反应快，能接住情绪，也敢抓着绕答继续问 | 听见用途偷换、关键人被省掉或对方答非所问，就收笑、打断，直接追他在躲哪一件事；不等材料全部到齐才施压。 | 稳、直接，普通话题可以闲聊；听见绕答会打断，把被避开的名词或动作拎回来，不连续背诵边界。；你没回答我刚才那句；这是谁先提的；你问的是这个，他回的是另一个；为什么偏偏少了这一段；我们不脱离感情只谈钱 |
| 老方 | production | 急躁的结果主义者 | 数据越差，句子越像截止日期和命令。 | 说话急，常惦记数据和交稿时间；该说清谁做什么时不省主语。；数据；改版；九点；这个劲儿 |
| 旁白 | narration | 克制的观察者 | 不用结论，只留下声音、灯和动作。 | 按可见或可听见的动作交代现场，不为隔开两句对白硬加停顿。；灯；耳机；门；屏幕 |
| 赵律师 | advisor | 锋利的理性派 | 听到说错的具体事实会打断纠正；涉及工作时问当前缺哪份材料，不在每次判断后自动补条件。 | 直接、利落，也会跟熟人开玩笑；句长随场面，不把每句话变成程序提醒。；你刚才说的是哪一笔；这份发我看看；回来吃饭 |
| 周会计 | advisor | 冷静的数字理性派 | 听到数字不对就打断，让对方翻到对应那一页；只解释眼前真正卡住的地方。 | 跟熟人说话随意，算到关键金额才放慢，不把每句话都排成三项。；往后翻；这笔是谁转的；数不对 |
| 小林老师 | advisor | 热络的感性现实派 | 同行被一概骂时会反驳，也会埋怨具体介绍人把事情办坏了。 | 热络，遇到熟人会接旧话；不每次先声明立场再分析。；行里的话；我先护一句行；小砸；这话得翻译 |
| 张法医 | advisor | 技术洁癖型理性派 | 碰到来源不全的材料会停止讨论结论。 | 读鉴定意见时正式准确，私下交流可以平常说话。；原件；链条；来源；复印件 |
| 案一咨询者·沈 | caller | 敏感的体面维护者 | 越紧张句子越长，堆很多场面细节；一说到自己收过的钱和催过的电话就突然变短。 | 平时绵长，压力点骤短。；体面；挂不住；他安排的；我男朋友 |
| 案一男友 | respondent | 羞耻驱动的防御者 | 被问金额时把问题改写成信任和离开。 | 先柔后急，关键金额处绕回感情。；周转；体面；一家人；怕你离开 |
| 案一闺蜜 | offmic | 爱热闹又怕丢脸 | 先强调自己只是起哄，再缩短回答。 | 口语快，解释多。；我就随口；当时大家都；别算我 |
| 案一男方前同事 | offmic | 谨慎的人情债务人 | 问题靠近钱的去向时只剩一句拒答。 | 短，话到为止。；阔过；那是以前；别问我 |
| 第四通咨询者·何 | caller | 渴望被尊重的社交型人格 | 引用他的原话前会停；别人拿酒吧工作定性她时立刻变硬；问到自己花过多少钱时不再铺垫。 | 想把话拉回感情，提到自己先找人买时会急着反驳；不主动总结自己的隐瞒策略。；受用；顺；他；顺手帮忙 |
| Tony | respondent | 讨喜的即兴交易者 | 面对其他客户关系的追问时退回服务和店务，把同样的情绪词说成维护。 | 轻松、顺口，像边做事边聊。；自己人；你肯听；顺手；店里都这样 |
| Tony 案邻桌常客 | offmic | 厌烦套路的直肠子 | 听见熟悉话术就直接复述自己听过的版本。 | 话赶、带刺；先拿上次被推销的具体经历打断，再说这次只做什么。；你可少来；上回也是这么说的；今天就 |
| Tony 案小姐妹 | offmic | 酒桌知情却不愿当证人的朋友 | 先划清自己只说过门槛，再把后续动作推回何。 | 短、硬，先报自己说过什么，再用何的反应把责任推回去。；一百万起；我没让她买；酒桌上；赎回要排队 |
| Tony 案店长 | offmic | 急躁的防守型管理者 | 追问私表越深，越快结束谈话并关门。 | 快、硬，末句常封口。；店里教的；年轻人自己；盯不过来；门要关了 |
| Tony 案前台 | offmic | 安静的程序执行者 | 只读系统里能公开确认的字段。 | 礼貌、平直。；系统里；我只能确认；这一栏 |
| Tony 案另一位女客 | offmic | 受伤后外放的感性派 | 越被拒绝越想把个人尴尬变成共同指控。 | 情绪快，反问多。；不止我；一起去问；他也跟你说过 |
| Tony 案宸直柜员 | offmic | 守窗口权限的程序执行者 | 一碰到代持代购就不再回答，没有合同编号就结束谈话。 | 平、短，答完公开规则便结束电话。；起投一百万；个人认购；合同户名；请合同上的委托人联系 |
| 案三咨询者·林 | caller | 把家里的婚恋规矩当成常理，重保障和面子，不觉得自己的要求需要逐条争取同意。 | 问到自己出多少钱时会反问为什么总让她退让，提起家里的钱又搬出母亲的安排。 | 先用大家都这么办、我妈说来解释，碰到钱由谁出时会反问，不主动整段报完家底。；二十三万八；二十八万八；我妈；九月底 |
| 案三咨询者表妹 | offmic | 替人递话的亲近晚辈 | 越怕姐姐反悔，越用玩笑和催促把话说快。 | 打字快，先交代姐姐的决定，再替她遮一句不好意思。；我姐；替她说；你们等着 |
| 案三相亲对象 | respondent | 受冒犯的条件维护者 | 被质疑时按项目、学费和工资账户逐项举证；被追问其他账户时明确拒绝公开。 | 不耐烦时反问、打断，抓住一个自己不能接受的条件争，不逐项写辩论稿。；二十三万八；二十八万六；工资卡；这几页可以 |
| 案三介绍人 | offmic | 嘴快、怕砸媒人的热心撮合者 | 越被两家围攻，越急着翻聊天记录；被问到依据时，先辩一句，再认自己没核实的具体话。 | 说得快，会抢着澄清；一问到凭什么，就从圆场变成认具体一句。；你先看聊天；这句是我说的；这句我没问过；我就想让他们先见一面 |
| 案三男方表姐 | offmic | 护家的感性防守者 | 先拒答；确认只问资料整理后才给半句。 | 先埋怨被拉进争执，护家人时也会指出表弟没有自己回话。；又转给我；让他自己说；我也不知道 |
| 第二通咨询者·陈 | caller | 想证明能扛事的焦虑新人 | 害怕失去活动机会时，会搬出主管的原话自保，也会急着打听付款日期。 | 怕得罪主管，急起来会照搬主管说过的话，遇到表格才跟着认字段；不熟悉财务全套流程。；负责人；让我垫；流程；回单 |
| 职场案主管 | respondent | 圆滑的责任切割者 | 被问到账和署名时，会反复强调活动是对方主动争取的，再把付款推给财务。 | 顺滑、像工作消息，责任词切得很细。；活动是你争取的；审批已经过了；财务月底处理 |
| 做企业财务的朋友 | offmic | 冷静的程序理性派 | 被追问小陈的报销结果时，会说明自己没有栖行的受理记录。 | 朋友之间当面聊事，直接指出单据上写的是什么。；审批；付款；到账；凭证 |
| 职场案前地推同事 | offmic | 忙了一天还有一肚子牢骚 | 抱怨自己遇到的具体工作要求。 | 熟人聊天，语速快。；拉新；指标；下班 |
| 职场案仓库管理员 | offmic | 朴实的记录主义者 | 只让人翻页、对日期，不接关系判断。 | 朴素，带操作指令。；翻到那页；入库单；日期；我这儿记着 |
| 职场案原部门助理 | offmic | 规则型自保者 | 逐字复述模板，不评价任何私聊。 | 规整，像内部答复。；模板；群里发过；样本；私聊我不判断 |
| 职场案领导 | offmic | 冷硬的结果主义者 | 出现流程事故时，只催项目交付和活动总结。 | 简短、上位、不给情绪回应。；结果；季度总结；项目交了；流程自己补 |
| 搬过三次仓库的人 | offmic | 惜字如金的职场老手 | 只报自己经历过几次，不说公司名，也不替任何账户作证。 | 短消息，先落一句判断，再留下身份代号。；老规矩；专场；我再来 |
| 快案来电人·周女士 | caller | 很会把自己放在重感情的位置上，却总把不利事实拆开讲的体面自保者 | 第一轮先坚持自己只是漏回一条消息；被问酒是谁点的时，把第三个人缩成‘别人’和‘妹妹的朋友’，直到主播问性别才承认是男性；第二天对男方解释时，她也先只说妹妹，直到自己说漏‘妹妹那个朋友’才被追问出第三个人；她说明朋友圈现在三天可见，再自己翻出两批旧动态截图发给后台。等主播问到凌晨照片和近两个月的夜场频率，她才承认读研以后聚会一直不少、同行男的女的都有，却仍把长期状态缩成普通聚会。 | 开场句子柔和，先说自己的感受；被卡住以后语速变快，连续补理由，最后常用一个反问把事实问题改成立场问题。；不是同一天；真的是碰巧；我后来都解释了；又不是我约来的 |
| 快案长文作者·顾 | source | 把私人争议写成公开长文，并用数字、传闻和未公开材料维持注意力的高流量作者 | 不参与直播对话，只存在于公开文本里。长文先诉委屈，再放人物、金额和代孕传闻；文末留纯属虚构，收尾又说手里还有材料，并把退三千万、撤声明、认全文列成一套条件。 | 长文起头先绕、重复委屈，碰到物件和数字突然变短，结尾留半句和下一批材料。；我本来不想发；纯属虚构；三千万；五张卡；她自己清楚；我手里还有 |
| 快案来电人·罗 | caller | 擅长用低姿态和亲近感争取入口的机会主义自保者 | 被追到钱源时先坚持长期父女称呼、反问为什么非要分清，被逼着回答是否亲生以后才最小承认，再用隐私和自愿赠与转题；被回问为什么拿自己不能生孩子举例时先反问“你怎么能这么问”，直到主播再追一句才承认做过检查。 | 开头把要求说得很短、很宽；被卡住时拉长尾音叫“哥”，立刻补一句让自己显得好相处的话。；哥；我真的不挑；对我好就行；你帮我一次嘛 |
| 咖啡厅男方 | participant | 压着火、急于拿到确定结果的人 | 材料被逐页缩窄时会突然跳到孩子，句子从完整请求变成短问句。 | 开场礼貌完整，诉求一多会挤在一句里，越靠近孩子越短。；我准备离婚；那孩子呢；我没动 |
| 咖啡厅妻子 | participant | 把每一页材料单独降格的强防御者 | 时间和户名被并看后不再否认材料本身，改说材料只能证明最低限度。 | 句子短，先否定提问范围，再给一个最小解释。；只能说明；那是借的；孩子别碰 |
| 咖啡厅表哥 | participant | 会用证据效力争回场面控制的人 | 材料越对得上，越不谈内容，转而追问录像、录屏和后续剪辑。 | 先接一句‘对’，再用反问夺话。；不等于；能不能用；你是来调解还是来播出的 |

<a id="reading-section-5"></a>

## 咖啡厅序章：开播前

### 离婚谈判、同晚咨询与数周后回告

- **内部 ID：** prologue-cafe-opening
- **timeline：** 三周前 · 2024 年 9 月 1 日傍晚
- **标题：** 序章
- **副标题：** 咖啡厅 · 谈离婚
- **舞台背景：** day-cafe cafe-prologue-backdrop
#### puzzle Ledger

- **player Goal：** 把妻子承认的聊天、酒店订单和钱款往来固定下来，再让男方把离婚、财产和亲子诉求逐项说清；亲子线先向机构问清受理与现场采样要求，旧物不能冒充孩子身份已确认的样本，账户线只看男方本人名下的家庭支出卡。
- **adversary Goal：** 妻子想把同日酒店与钱款往来分别降格成可编辑截图、普通住宿和私人借款；表哥则借证据效力争议逼节目停播。
##### mechanical Coupling

- 玩家必须先点出‘没去过酒店’这句原话，再亲手出示聊天截图或酒店订单；任一张都只能逼她承认开房，剩下那张仍不能证明顾*上过楼。
- 玩家打开逐行流水追问‘没跟顾*转过钱’，只打穿没有钱款往来，不越级证明借款性质或酒店内行为。
- 玩家依次查看孩子旧物和男方名下的家庭支出卡；两项交接后回看七月起的三宗旧案，再进入最近发生的 Tony 案，次日上午接回亲子鉴定与家庭卡的后续。

- **pressure：** 桌边录像、表哥手机里的另一份录屏和双方对后续剪辑的争夺同时压上来；妻子带孩子离开后，留在共同住所的孩子旧物也可能随时被取走。
- **failure Boundary：** 不能在咖啡厅公开亲子结果，不能把酒店同住写成已经证明发生性关系，也不能用鉴定结果倒推女方何时知道孩子身世、为何结婚或给固定转账收款人补身份。

#### cafe

##### clip Draft

- **duration：** 15 秒
- **标题：** 她说没去酒店，怎么让她当场改口
- **status：** 待双方确认

##### opening Lines

###### 1. opening Lines 1

**旁白：** 傍晚。你和妻子赵律师按约来到咖啡厅。她替你捋平卷起的领口。男方的妻子和她表哥已经坐在靠窗那桌。几张遮过名字的材料压在咖啡杯下，桌边的手机已经架好。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** narration

###### 2. opening Lines 2

**赵律师：** 站好，领子又卷了。大学到现在，一出门就得给你理。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 3. opening Lines 3

**林旭阳：** 行，赵同学。人都等着了，回家再数落我。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 4. opening Lines 4

**男方：** 林老师，赵律师，麻烦你们跑一趟。我准备离婚。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 5. opening Lines 5

**林旭阳：** 就昨天电话里聊的那些？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 6. opening Lines 6

**男方：** 对。她跟别的男人聊天，酒店订单也在。我不想再听她绕了。今天把家里的账算清，孩子以后怎么安排，也谈清楚。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 7. opening Lines 7

**林旭阳：** 先用桌边架好的手机录，省得后面谁说了又不承认。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 8. opening Lines 8

**妻子：** 我只答应把话说清楚，没答应拿孩子做节目。离婚可以谈，孩子的事没什么好谈的。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 9. opening Lines 9

**赵律师：** 孩子的事后面再说。你们愿意的话，你们也可以拍。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 10. opening Lines 10

**表哥：** 那就把镜头挪开，只录声音。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-cousin
- **表现类型：** participant

###### 11. opening Lines 11

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

**妻子：** 那晚我没去澜桥酒店。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 3. initial Account Lines 3

**妻子：** 就是疑神疑鬼，天天怀疑我。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 4. initial Account Lines 4

**妻子：** 我跟顾*也没转过钱。你要谈离婚，就谈我们俩的账。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

- **first Claim：** 那晚我没去澜桥酒店。
##### claim Statements

###### 1. long acquaintance

- **内部 ID：** long-acquaintance
我和顾*就是认识得久一点，平时聊得多，没有其他关系。

- **miss Line：** 认识多久、聊了什么，你可以问。别把没问的先塞进我嘴里。

###### 2. hotel denial

- **内部 ID：** hotel-denial
那晚我没去澜桥酒店。

- **是否核心项：** true

###### 3. screenshot dismissal

- **内部 ID：** screenshot-dismissal
就是疑神疑鬼，天天怀疑我。

- **miss Line：** 他天天怀疑我。你要问哪件事，就把哪件事拿出来说。

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

**林旭阳：** 这是你自己发的，“我到澜桥酒店了”。你刚说那晚没去，这两句话怎么回事？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 2. 澜桥酒店

- **内部 ID：** hotel
- **document Kind：** hotel
- **kicker：** 酒店订单
- **标题：** 澜桥酒店
- **detail：** 21:24｜状态：已入住｜入住人：妻子本人｜大床房 1 间
###### remaining Lines

###### 1. remaining Lines 1

**妻子：** 这个订单你又是哪儿来的？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 2. remaining Lines 2

**男方：** 订单邮件同步到家里的平板，入住后的订单状态也在，我一起留了。

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

**男方：** 订单邮件同步到家里的平板，入住后的订单状态也在，我一起留了。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 3. hit Lines 3

**林旭阳：** 这张订单状态是已入住，入住人写的是你。你刚说那晚没去，怎么对得上？

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

###### 5. revised Account Lines 5

**男方：** 这三笔是以前你发给我核对家用的转账通知。我存着。后来这两个月你不让我看账户，我才没法接着对。

#### 舞台标记

- **表现类型：** participant
- **声纹卡 ID：** prologue-cafe-husband

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

**林旭阳：** 等一下。那你跟顾*来往的这三笔钱是怎么回事？

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

- **zhao Role：** 赵律师接受男方当场咨询，与林旭阳一同到场，协助把离婚和家账先谈清；她不代理诉讼，不替任何一方下裁判，亲子鉴定申请只在谈判吵散后私下告诉男方。
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
- **求助内容：** 男方先咨询个人委托鉴定；正式委托时按机构要求核验身份和现场采样，诉讼中的亲子关系异议由法院审查。
- **next Action：** 咨询机构取得初步材料，再由律师审查是否足以提出亲子关系异议、申请鉴定。
- **boundary：** 双方委托的鉴定意见不能直接改变法律亲子关系，诉讼中的证明力由法院审查。

##### legal Claim Lines

###### 1. legal Claim Lines 1

**男方：** 酒店我不想再吵了。我现在就想离婚，把家里的账查清。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 2. legal Claim Lines 2

**男方：** 这两个月，她一直不让我看账户。我怕她还会往外转。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 3. legal Claim Lines 3

**妻子：** 你们今天是来劝我们谈，还是来帮他告我？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 4. legal Claim Lines 4

**赵律师：** 他请我来，是想把离婚和账目的事当面说清。完整流水你愿意拿，我们就对；这些截图先留好，钱怎么算，要核完材料再谈。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

##### camera Break Lines

###### 1. camera Break Lines 1

**妻子：** 流水我不拿，今天也不谈了。你们把录像关了。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 2. camera Break Lines 2

**旁白：** 你关掉桌边录像。妻子推开椅子，表哥跟着站起来。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** stage

###### 3. camera Break Lines 3

**表哥：** 你们合着伙逼她是吧？刚才的话一段都别少。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-cousin
- **表现类型：** participant

###### 4. camera Break Lines 4

**旁白：** 表哥把自己的手机举起来。屏幕上的录制计时还在走，镜头朝着窗外。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** stage

###### 5. camera Break Lines 5

**表哥：** 你们敢断章取义剪完再发，我就先发原片再告你们。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-cousin
- **表现类型：** participant

###### 6. camera Break Lines 6

**赵律师：** 那今天就先这样。也确实没什么好谈的了。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

##### pressure Choices

###### 1. 结束谈话

- **内部 ID：** camera-off
- **标签：** 结束谈话
- **说明：**
- **echo：** 你收起设备，结束这次谈话。

##### inquiries

###### 1. hotel

- **内部 ID：** hotel
###### 选项

###### 1. hotel message

- **内部 ID：** hotel-message
- **主播问句：** 你发消息说到澜桥酒店了，现在又说那晚没去，是怎么回事？
- **是否核心项：** true
- **evidence Id：** chat
###### lines

###### 1. lines 1

**妻子：** 等一下，你怎么会有我手机里的截图？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 2. lines 2

**男方：** 家里的平板还登着你的账号。那天消息自己同步过来，我截下来的。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 2. hotel room

- **内部 ID：** hotel-room
- **主播问句：** 这个房间是谁订的？
- **是否核心项：** false
###### lines

###### 1. lines 1

**妻子：** 订单上有名字，你看就是了。你们到底要问什么？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 2. transfers

- **内部 ID：** transfers
###### 选项

###### 1. transfer purpose

- **内部 ID：** transfer-purpose
- **主播问句：** 等一下。那你跟顾*来往的这三笔钱是怎么回事？
- **是否核心项：** true
- **evidence Id：** parallel-transfer-ledger
###### lines

###### 1. lines 1

**妻子：** 那是借的。有进有出，早就平了。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

###### 2. lines 2

**男方：** 你看，又变成借的了。完整流水我问了几次，她都不给。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 2. transfer balance

- **内部 ID：** transfer-balance
- **主播问句：** 你们之间这些转账，最后谁还欠谁的钱？
- **是否核心项：** false
###### lines

###### 1. lines 1

**妻子：** 你们拿来的只有这三笔，又不是全部往来。要说欠不欠，光这张看不出来。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** participant

#### aftermath

##### opening Lines

###### 1. opening Lines 1

**旁白：** 妻子和表哥先走了。你和赵律师把男方送到停车场。半小时后，妻子发来一条语音。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** narration

###### 2. opening Lines 2

**妻子（语音）：** 那天是我自己住的酒店，你们看到的三笔钱都是借款。你们要是敢乱剪辑做视频，小心跟你们翻脸不认人。孩子的事也没什么好说的。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-wife
- **表现类型：** message

###### 3. opening Lines 3

**赵律师：** 钱的材料先留好，你发来以后我再看。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 4. opening Lines 4

**男方：** 还有孩子。我怀疑了半年，她一直不肯跟我谈。我想问问鉴定该怎么办。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 5. opening Lines 5

**林旭阳：** 我把一家鉴定机构的公开联系方式发给你。受理需要谁到场，带哪些材料，你先问清。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 6. opening Lines 6

**林旭阳：** 家里还留着孩子用过的东西吗？哪些能用，也先问机构。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 7. opening Lines 7

**男方：** 家里应该还有。我现在回去找找？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 8. opening Lines 8

**林旭阳：** 嗯，到家给我打个电话。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

##### routes

###### 1. 到家后的电话

- **内部 ID：** toy
- **标签：** 咨询鉴定机构
- **说明：**
- **标题：** 到家后的电话
###### lines

###### 1. lines 1

**男方（电话）：** 我到家了。沙发靠背缝里还有个硅胶咬胶。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 2. lines 2

**林旭阳：** 你问过机构了吗？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 3. lines 3

**男方（电话）：** 问了。他们说可以先做个人委托的鉴定，东西能不能用，还得看。我就是想先知道孩子到底是不是我的。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 4. lines 4

**赵律师：** 机构给你的说明和结果都留着，到时候发给我。我看过材料，再跟你谈法院那边怎么申请。

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
- **标签：** 核对家庭支出卡
- **说明：**
###### lines

###### 1. lines 1

**男方（电话）：** 家里有张日常开销卡，在我名下。房贷和平时家里花的钱都从这张卡走，近一年的明细我能下载。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 2. lines 2

**林旭阳：** 你发来吧。我请平时帮节目核账的周会计一起看。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 3. lines 3

**旁白：** 你在微信里建了个临时群，把男方和周会计加进来，发起群语音。周会计接通后，你将男方刚发来的明细转给他。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** stage

###### 4. lines 4

**周会计：** 老林，你这下班语音，比上班还准时。明细我收到了，五号是房贷，十八号还有一笔固定转出。

#### 舞台标记

- **声纹卡 ID：** zhou-accountant
- **表现类型：** advisor

###### 5. lines 5

**林旭阳：** 又耽误你吃饭了，回头请你。车贷呢？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 6. lines 6

**周会计：** 四个月前就结清了，跟十八号这笔对不上。

#### 舞台标记

- **声纹卡 ID：** zhou-accountant
- **表现类型：** advisor

###### 7. lines 7

**林旭阳：** 十八号那笔备注写的什么？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 8. lines 8

**周会计：** ‘私教课时’。连续四个月，都是同一天、同一个数。收款人的名字没显示全。

#### 舞台标记

- **声纹卡 ID：** zhou-accountant
- **表现类型：** advisor

###### 9. lines 9

**林旭阳：** 你自己的卡，电子回单能下载吗？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 10. lines 10

**男方（微信语音）：** 能。我自己去银行APP里下。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### handoff Lines

###### 1. handoff Lines 1

**林旭阳：** 下载好了发给赵律师，我们一起看。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

#### forensic

- **timeline：** 9 月 23 日上午 · 咖啡厅见面三周后
##### opening Lines

###### 1. opening Lines 1

**旁白：** 9 月 23 日上午，工作室没有开播。距离咖啡厅那晚已经过去三周。赵把男方带到桌边，他手里拿着昨晚收到的报告。这期间，妻子同意双方带孩子到机构，工作人员核对身份、完成现场采样。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** narration

###### 2. opening Lines 2

**男方：** 报告我昨晚就收到了，看了一晚上。赵律师，能不能找个懂行的人，再帮我看看？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 3. opening Lines 3

**赵律师：** 我有个朋友是法医，姓张。我问过他了，他这会儿有空。你把报告翻到意见那一页，我接通给他看。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 4. opening Lines 4

**旁白：** 赵拨通张法医的视频。你把桌上的台灯转向报告，男方把纸摊平。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** stage

###### 5. opening Lines 5

**张法医：** 看得清。我先把这一句念给你听。

#### 舞台标记

- **声纹卡 ID：** zhang-forensic
- **表现类型：** advisor

###### 6. opening Lines 6

**张法医：** 这次用的是到场核对身份后提取的样本，没有用那只咬胶。这份鉴定意见排除生物学父子关系。它是你们双方委托的，不是法院委托的。

#### 舞台标记

- **声纹卡 ID：** zhang-forensic
- **表现类型：** advisor

###### 7. opening Lines 7

**旁白：** 男方把手机扣在桌上，手还压着，许久没有说话。

#### 舞台标记

- **表现类型：** stage

###### 8. opening Lines 8

**男方：** 我给他报学校、带他看病……一直都是我去的。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 9. opening Lines 9

**赵律师：** 你一晚上没睡吧？坐会儿，后面的事等你缓一缓再谈。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 10. opening Lines 10

**男方：** 我知道。让我坐一会儿。

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 11. opening Lines 11

**男方：** 那我能不能拿这个结果，直接把孩子的关系改掉？

#### 舞台标记

- **声纹卡 ID：** prologue-cafe-husband
- **表现类型：** participant

###### 12. opening Lines 12

**赵律师：** 不能直接改。你要提出亲子关系异议，就把这份意见和相关材料交给法院审查。是否还要由法院委托鉴定，得由法院决定。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 13. opening Lines 13

**林旭阳：** 你先坐着，我给你倒杯水。

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 14. opening Lines 14

**旁白：** 男方点了点头，从文件袋里又抽出一张回单，递给赵。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** stage

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

**旁白：** 赵律师打开周会计核对这份回单后发来的语音。

#### 舞台标记

- **表现类型：** narration
- **声纹卡 ID：** narrator

###### 4. account Clue Lines 4

**周会计（语音）：** 我看过了。十八号那笔，收款人不是顾*。

#### 舞台标记

- **声纹卡 ID：** zhou-accountant
- **表现类型：** advisor

###### 5. account Clue Lines 5

**赵律师：** 回单我留下了。你知道这笔钱是给谁的吗？

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** advisor

###### 6. account Clue Lines 6

**林旭阳：** 你以前看过这个名字吗？

#### 舞台标记

- **声纹卡 ID：** host-lin-xuyang
- **表现类型：** host

###### 7. account Clue Lines 7

**旁白：** 男方看着遮住的名字，没有接话。赵把回单放在鉴定报告旁边。窗外，送孩子上学的人正从楼下经过。

#### 舞台标记

- **声纹卡 ID：** narrator
- **表现类型：** stage

##### final Cards

- **result：** 双方到场委托鉴定：排除生物学父子关系
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
- 数周后双方同意带孩子到机构，核验身份并现场采样；鉴定意见排除生物学父子关系。这是双方委托的意见，不是变更法律亲子关系的生效裁判。
- 男方名下的家庭支出卡里有一笔每月同日的固定转账，不是房贷或未结清车贷；摘要写着‘私教课时’，电子回单上的收款姓氏也不是顾。

##### 今晚定不了

- 酒店内具体发生了什么，三笔钱各自是借款、赠与还是其他用途。
- 孩子的生物学父亲是谁。
- 女方何时知道孩子与男方不存在生物学父子关系，以及她为什么仍然结婚；鉴定意见不能证明她此前的知情和婚姻目的。
- 固定转账收款人的身份没有向节目公开；‘私教课时’是否对应真实课程、为什么持续支付、妻子是否知情。

- **ending Line：** 亲子鉴定有了结果，家庭账仍有未解之处。

#### author Truth

- **wife Pregnancy Knowledge：** 女方怀孕时已经知道孩子不是男方的。
- **wife Marriage Motive：** 她仍然与男方结婚，目的就是取得婚内钱款后离开。
- **disclosure Boundary：** 这是后续主线的作者真相。试玩只披露双方同意、到场核验并采样所得的亲子鉴定意见，不能证明女方此前何时知情或为何结婚。

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
- **payoff：** 玩家依次交接旧物与家庭卡；三周后，双方同意现场采样所得鉴定意见和家庭卡电子回单先后回告，序章不提前披露结果。

###### next Debt

- **location：** cafePrologue.forensic.accountClueLines
- **quote：** 十八号那笔，收款人不是顾*。

<a id="reading-section-6"></a>

## 2024-07-15 晚上八点：开麦

**旁白：** 2024 年 7 月 15 日，晚上八点，你推开直播间的门。老方正站在桌边，低头看着压住转接线的旧工牌。显示器已经亮了。

#### 舞台标记

- **表现类型：** narration

**运营 · 老方（现场）：** 老林，到屋了？你那张旧工牌怎么还压着线。跟你说正事，深夜档的数据再这么下去，就并进娱乐区。改版的事，你得想想了。

#### 舞台标记

- **声纹卡 ID：** producer-lao-fang
- **表现类型：** background

**林旭阳：** 少惦记我工牌。改版的事，等下播再说。

#### 舞台标记

- **表现类型：** background

**老婆的微信：** 吃饭没有？汤在冰箱，记得热。还有个东西我塞你包里了，等这几天忙完了再看。

#### 舞台标记

- **声纹卡 ID：** zhao-lawyer
- **表现类型：** message

**旁白：** 你把工牌挪到一边。老方指了指时间，带上门出去了。你看完老婆的微信，收起手机，戴上耳机。

#### 舞台标记

- **表现类型：** narration

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

**男方语音（来电人转发）：** 这次先帮我顶几天，我会还你的。

#### 舞台标记

- **声纹卡 ID：** case1-respondent
- **表现类型：** caller
- **音频提示：** voice.case1.loyalty-message

**@还没下班：** 听着怪难受的。

#### 舞台标记

- **表现类型：** comment

【玩家操作：听完这条语音】

**主播·林旭阳：** 她把后半段也转来了。她问钱都花哪去了，男友没答。

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

<a id="reading-section-7"></a>

# 第一幕：账单里的八万

- **案件 ID：** 01-credit
- **剧情 ID：** lost-job-hidden-credit
- **内容包原题：** 今日来电：8 万信用卡周转
- **时间：** 2024 年 7 月 15 日 · 两个多月前
### 本案两次通话日期

- 2024-07-15
- 2024-07-16

## 本案人物

| 角色 | 性格 | 欲望 | 防御动作 | 知识边界 |
|---|---|---|---|---|
| 案一咨询者·沈 | 敏感的体面维护者 | 旧钱不退；还能供养就继续收，停转后借男方隐瞒工作找退出理由，想截主播回放替自己拒绝八万。 | 先把半薪说成男方自愿给花的。代存聊天出现后，承认说过存着，仍拿他以前没拦过消费来反问；承认拿不出八万，却拒报当前余额。 | 知道十四个月固定转账累计二十四万五、自己只剩一万一千六百多，也知道自己的消费、催款动作、见过的流水与对方说法；不知道尾号 3301 的主人。知道当初由自己提出半薪代存，不是男方单方面猜用途。 |
| 案一男友 | 羞耻驱动的防御者 | 保住供养者形象，把女友承诺替两个人存的钱当成应急退路，估算她还剩十五万，试图让她接眼前八万。 | 隐瞒失业，把补偿金说成奖金；代存约定使他预期有存款，但不能替他免除自己签下的借款和信托风险。 | 知道自己的失业、贷款、十四个月转账与八万元请求，也知道自己只是估算女友至少还有十五万；对她的真实余额和他人账户身份不能装作早已知道。 |
| 案一闺蜜 | 爱热闹又怕丢脸 | 继续做朋友，但别让自己显得也被人设骗过。 | 把自己的动作说成气氛到了。 | 只知道朋友圈、饭局和自己删过的评论，不知道男方账目。 |
| 案一男方前同事 | 谨慎的人情债务人 | 还一点旧人情，但不替任何现在的账作证。 | 承认早年的阔，不谈后来钱路。 | 只知道失业前的阔绰与旧账，不知道咨询者和男方的现在。 |

## 【编剧资料】案件发动机

- **戏剧锚点：** 信用卡账单、社保断缴截图、离职结算通知、十四个月固定转账与实际余额、二十万借款与两笔信托转账、日常餐厅消费和开箱视频
- **为何今晚发生：** 对方再次要求咨询者拿八万处理信用卡，还把过去给她的钱也算了进来。她本来就不想给，账户里也根本拿不出八万；她没准备查清账，只想让主播替她确认：那些钱既然是男方自愿给的，她现在一分不出也不算亏欠。
### 公开求助

- **类型：** interest
- **求助内容：** 她已经不想转八万，想让正在看直播的男友听到主播支持她，也想避开对过去收款和消费的追问。

- **核心物件作用：** 账单被说成短期周转证明，社保截图先暴露失业时间，第二夜的离职结算通知再说明所谓奖金其实是待发补偿金；十四个月固定转账解释了男方为什么认定她拿得出八万，实际余额、日常餐厅消费和开箱视频则露出咨询者早已把男友收入花进自己的生活。
- **咨询者所求：** 咨询者确实不想给这八万，来电时更想得到一句可以直接转述给男友的道德支持。她没有说男友连续十四个月转给她的一半工资已经基本花完，也没有说男友在半薪之外，每两个月还直接替她交一万元房租。男方以为她至少存着十五万，她实际只剩一万一千六百多。她看信用卡时先抓住男方约五千元的男装，对约四万元共同消费只是一句带过，也没有说明一万二的设备就是买给自己的。
- **对方所求：** 对方既想瞒住失业、继续当一个出手大方的男友，也认定十四个月给出去的二十四万五至少还剩十五万，八万才会开口向她要。他每月给出一万七千五，还要另外承担女方每月五千元房租和两人的排场消费，经济压力确实很重；但这不能替他隐瞒失业，也不能把借款、信托认购和信用卡缺口推给咨询者。
- **第三压力：** 女方长期维持的高消费生活与男方隐瞒失业后仍在负担的支出。
- **咨询者自利删减：** 她先不说半薪是自己以共同生活代存的名义索取的，另付房租也不主动提。十四个月收款基本花完后改称自愿供养，想让主播替自己拒绝八万，并挡住男方追问旧钱。
- **公开钩子：** 他连续十四个月把一半工资交给女友，认定她至少存了十五万；她不肯说现在剩多少。现在，他让她先拿八万救信用卡。
- **故事概述：** 她先用五千元男装追问男方怎么花钱，却把约四万元共同排场一句带过，也一直没让他看十四个月半薪所剩的余额；他隐瞒失业，把累计给过的钱当成她现有的存款，又借钱买信托，想继续撑住两个人已经习惯的生活。
- **悬念：** 每月半薪当初说替两个人存着，为什么现在只肯说自愿给的？累计转账不等于她现在还留着的钱。
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

**林旭阳：** 他今晚还催，你准备怎么回他？

#### 舞台标记

- **mood：** listening

**咨询者：** 我不想转。他还提以前给我花过的钱，说得像我今天不转，这一年半都是我欠他的。

#### 舞台标记

- **mood：** anxious

### 夜 A · 1｜credit-living-arrangement

**咨询者：** 工资卡他自己拿着，每个月转我一半，已经一年多了。不住在一起，他住他的，我住我的。以前吃饭出去玩也都是他付，他从没说吃力。就是这个月没转，我才去问他。结果自己的钱没等到，他倒让我先拿八万。我就想问，之前愿意给我的，现在还能反过来逼我还吗？

#### no Clue Reaction

**咨询者：** 我们没住一起，平时还是一起花钱的。

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

**林旭阳：** 以前花过的钱他也要翻出来？你们平时住一起吗？钱是怎么安排的？

- **现场疑点：** 两人没有同住，但这不等于日常支出完全分开。
- **矛盾：** 男方工资卡没有交给她，却固定把一半工资转给她，持续了一年多；具体月数和金额留给后续流水。银行流水还会在第二天暴露另一笔她没有主动提的固定住房支出。
- **可靠度：** mixed
#### 关键追问

##### 1. credit living arrangement:question Options:0

**林旭阳：** 每个月转你一半，这事当初怎么说的？

**咨询者：** 这是他追我的时候承诺的，我又没要。我也没像其他人一样扣着工资卡。

- **source Anchor：** 工资卡他自己拿着
- **玩家所选怀疑方向：** 每个月转你一半，这事当初怎么说的？
###### logic Contract

- **premise Anchor：** 工资卡他自己拿着
- **source Kind：** caller-statement
- **source Proves：** 咨询者与对方没有同住，男方也没有把工资卡交给咨询者。
- **source Does Not Prove：** 没有同住、没有交工资卡，不能证明双方日常收入与支出彼此独立。
- **answer Anchor：** 这是他追我的时候承诺的，我又没要。我也没像其他人一样扣着工资卡。
- **answer Adds：** 她强调给付是男方追求时的承诺，省略自己曾提出替两个人存钱的约定。
- **next Legal Question：** 可以继续核对固定转账和咨询者如何使用这笔钱，不能据此把男方自行签下的借款与信托认购归给咨询者。

- **矛盾：** 她说工资卡不在自己手里，却早已把男方半薪当成每月应到的钱。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** pressure-point
- **内部 ID：** credit-living-arrangement:questionOptions:0

##### 2. credit living arrangement:question Options:1

**林旭阳：** 没住一起，吃饭出去玩这些，是各付各的，还是从你卡里出？

**咨询者：** 也不是。吃饭出去玩，我们日常都是一起花销的。总不能因为没住一起，又交了一部分工资，剩下的就都得我花吧。

- **source Anchor：** 他住他的，我住我的
- **玩家所选怀疑方向：** 没住一起，吃饭出去玩这些，是各付各的，还是从你卡里出？
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** trust-but-verify
- **矛盾：** 分开居住之外仍有固定半薪和共同日常支出，她没有交代半薪的具体用途。
###### logic Contract

- **premise Anchor：** 他住他的，我住我的
- **source Kind：** caller-statement
- **source Proves：** 咨询者说两人分开住。
- **source Does Not Prove：** 没有同住、没有交工资卡，不能证明双方日常收入与支出彼此独立。
- **answer Anchor：** 也不是。吃饭出去玩，我们日常都是一起花销的。总不能因为没住一起，又交了一部分工资，剩下的就都得我花吧。
- **answer Adds：** 她沿着固定给付的回答，继续用两人吃饭出游解释自己收钱，不再重复揭露半薪。
- **next Legal Question：** 可以继续核对固定转账和咨询者如何使用这笔钱，不能据此把男方自行签下的借款与信托认购归给咨询者。

- **内部 ID：** credit-living-arrangement:questionOptions:1

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

#### question Sequence

- credit-living-arrangement:questionOptions:0
- credit-living-arrangement:questionOptions:1

### 夜 A · 2｜credit-eight-wan-bill

**咨询者：** 账单八万出头。男装就五千左右，一件大衣两千多，奖金都没发，还买这些。餐厅、酒店和礼物也有，都是我们一起出去的。云栖那顿纪念日晚餐最贵，主要贵在酒，店和靠窗位是我让他订的。还有一万二的拍摄设备，在我家。我没把每一笔都加起来。

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

**林旭阳：** 后台有个人说是你男朋友，发来了账单。你看看，是他的账号吗？

###### 2. lines 2

**咨询者：** 是他。我把直播链接发给他了，省得我再解释。

###### 3. lines 3

**林旭阳：** 他不上麦，那我把他发的账单打开，姓名卡号遮掉。

###### 4. lines 4

【后台收到男方发来的信用卡账单与催款聊天截图。】

- **现场疑点：** 金额、用途和时间都比“垫几天”重得多。
- **矛盾：** 咨询者先指责男方约五千元男装，又确认餐厅、礼物和设备与自己有关；两类金额之外仍有至少三万五用途不明。
- **可靠度：** partial
- **展示卡片：** daily-credit-card-bill
#### 关键追问

##### 1. credit eight wan bill:wine

**林旭阳：** 云栖这顿酒水是谁点的，你平时吃饭也按这个标准？

**咨询者：** 酒是他挑的，我还说太贵了。店是我想去的，平时探店也会去这种地方。

**林旭阳：** 那你挑他的衣服贵，这些送你的、你们一起花的，就都不算了？

**咨询者：** 一起出去又不是只有我享受。他愿意付，我还能每次抢着结账？

**林旭阳：** 那你自己这一年花了多少，算过吗？

**咨询者：** 我没算全年。谈恋爱谁还拿计算器啊。

**林旭阳：** 就说这几笔吧，你自己出了多少？

**咨询者：** 这几笔是他付的。可他当时又没拦我。

- **source Anchor：** 主要贵在酒
- **玩家所选怀疑方向：** 云栖这顿酒水是谁点的，你平时吃饭也按这个标准？
###### logic Contract

- **premise Anchor：** 主要贵在酒
- **source Kind：** caller-statement
- **source Proves：** 来电人当场陈述，可与已经收到的材料核对。
- **source Does Not Prove：** 未披露的付款、余额或用途不能靠语气推断。
- **answer Anchor：** 酒是他挑的，我还说太贵了
- **answer Adds：** 酒是他挑的，我还说太贵了。店是我想去的，平时探店也会去这种地方。一起出去又不是只有我享受。他愿意付，我还能每次抢着结账？我没算全年。谈恋爱谁还拿计算器啊。这几笔是他付的。可他当时又没拦我。
- **next Legal Question：** 沿已披露的消费与钱款去向继续问。

- **矛盾：** 八万元中至少三万五去向不明，对方被问时继续催款而没有解释。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** pressure-point
- **内部 ID：** credit-eight-wan-bill:wine
###### 材料行

- 本期应还款额：¥80,360.00
持卡人、卡号已遮盖。以下为发来的消费明细截图。
- 云栖餐厅｜6,800.00
- 餐饮消费（多笔）｜7,200.00
- 酒店住宿（两笔）｜4,800.00
- 礼品消费（多笔）｜9,200.00
- 拍摄设备／分期订单总价｜12,000.00
- 男装（含大衣 2,380.00）｜5,000.00

- **material Title：** 信用卡账单 · 已遮名

##### 2. credit eight wan bill:device installment

**林旭阳：** 设备在你家。买的时候，你知道他办分期了吗？

**咨询者：** 不知道。我以为他全款买来送我的。他说支持我做探店号，还说这是投资我。

**林旭阳：** 那他提过让你一起还吗？

**咨询者：** 没有。我没签过分期，也没答应替他还。东西我是用了，可他买的时候不是这么说的。

- **内部 ID：** credit-eight-wan-bill:device-installment
- **source Anchor：** 一万二的拍摄设备
- **玩家所选怀疑方向：** 设备在你家。买的时候，你知道他办分期了吗？
- **是否核心项：** true
- **路线轴：** document-edge
- **路线口气：** trust-but-verify
###### 材料行

- 本期应还款额：¥80,360.00
持卡人、卡号已遮盖。以下为发来的消费明细截图。
- 云栖餐厅｜6,800.00
- 餐饮消费（多笔）｜7,200.00
- 酒店住宿（两笔）｜4,800.00
- 礼品消费（多笔）｜9,200.00
- 拍摄设备／分期订单总价｜12,000.00
- 男装（含大衣 2,380.00）｜5,000.00

- **material Title：** 信用卡账单 · 已遮名
- **矛盾：** 咨询者使用拍摄设备，但声称购入时不知道分期，也没有同意共同还款。
###### logic Contract

- **premise Anchor：** 一万二的拍摄设备
- **source Kind：** caller-statement
- **source Proves：** 设备在她家，账单显示分期订单。
- **source Does Not Prove：** 接收使用设备不等于签订分期或承诺还款。
- **answer Anchor：** 不知道
- **answer Adds：** 她说自己以为是全款赠礼，未签分期，也未约定共同还款。
- **next Legal Question：** 继续核对账单其余款项，不把设备受益直接认作还款责任。

##### 3. credit eight wan bill:question Options:0

**林旭阳：** 这几笔我加了一遍：吃饭、酒店、礼物和设备合计四万，男装五千。八万多的账单，还差三万五千多。他说过剩下的花在哪儿了吗？

**咨询者：** 没解释。问起来就说奖金快发了，让我先把卡还上。

**林旭阳：** 你也在听吧？其余三万五的明细，还有工作和奖金的通知，能说的发来。

【男方回复：“流水我发，三万五的事我不想在直播里说。”】

**咨询者：** 可这些是他当时愿意花的。怎么一缺钱就都要找我？

- **source Anchor：** 我没把每一笔都加起来
- **玩家所选怀疑方向：** 这几笔我加了一遍：吃饭、酒店、礼物和设备合计四万，男装五千。八万多的账单，还差三万五千多。他说过剩下的花在哪儿了吗？
###### 唯一核心反转过场

- **内部 ID：** case1-unexplained-gap
- **类型：** reveal
- **过场短标：** 金额对不上
- **标签：** 还差至少三万五
- **visual Variant：** amount-gap

###### logic Contract

- **premise Anchor：** 我没把每一笔都加起来
- **source Kind：** host-calculation
- **source Proves：** 已上屏账单总额80360；餐饮、酒店、礼物与设备合计40000，男装5000，差额35360尚未说明。
- **source Does Not Prove：** 未披露的付款、余额或用途不能靠语气推断。
- **answer Anchor：** 没解释。问起来就说奖金快发了，让我先把卡还上。
- **answer Adds：** 没解释。问起来就说奖金快发了，让我先把卡还上。可这些是他当时愿意花的。怎么一缺钱就都要找我？
- **next Legal Question：** 沿已披露的消费与钱款去向继续问。

- **矛盾：** 八万元中至少三万五去向不明，对方被问时继续催款而没有解释。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** pressure-point
- **内部 ID：** credit-eight-wan-bill:questionOptions:0
###### 材料行

- 本期应还款额：¥80,360.00
持卡人、卡号已遮盖。以下为发来的消费明细截图。
- 云栖餐厅｜6,800.00
- 餐饮消费（多笔）｜7,200.00
- 酒店住宿（两笔）｜4,800.00
- 礼品消费（多笔）｜9,200.00
- 拍摄设备／分期订单总价｜12,000.00
- 男装（含大衣 2,380.00）｜5,000.00

- **material Title：** 信用卡账单 · 已遮名

#### 压力表演

- **意图钩子：** 体面账单压上来
- **防备状态：** tense

#### question Sequence

- credit-eight-wan-bill:wine
- credit-eight-wan-bill:device-installment
- credit-eight-wan-bill:questionOptions:0

### 夜 A · 3｜credit-anniversary-agency

**咨询者：** 我俩第一次去那家餐厅。靠窗那排好拍照，我才让他订。认识他以前跟朋友去过一次，没别的了。

#### no Clue Reaction

**咨询者：** 那晚就这些。别的我现在想不起来。

- **interaction Mode：** lineReplay
- **线索职能：** setup
- **错误框架：** 核对到店经历，为后续询问她自己的探店支出补充背景；旧图不承担资金去向的反驳。
#### 回收目标

- credit-bank-flow

#### 段后触发

- **类型：** evidenceCheck
- **材料检视 ID：** credit-anniversary-footprint
- **标签：** 把纪念日那页接上
- **continue Label：** 继续问这个月没到的钱

- **说话人 ID：** shen
#### 正文前节拍

##### lines

###### 1. lines 1

**林旭阳：** 云栖这家店，你以前去过吗？

- **现场疑点：** 她说第一次去，却事先指定了靠窗座位；需要问清此前到店经历。
- **矛盾：** 她从第一次去改口为只在认识现任前随朋友去过一次，第一夜收到的两年前朋友圈却写着第三次来、同行恋人每次订靠窗位。
- **可靠度：** mixed
- **展示卡片：** daily-credit-anniversary
#### 关键追问

##### 1. credit anniversary agency:question Options:0

**林旭阳：** 跟朋友只去过一次？

**咨询者：** 就那一次。这跟他现在找我要钱有什么关系？

- **source Anchor：** 认识他以前跟朋友去过一次
- **玩家所选怀疑方向：** 跟朋友只去过一次？
###### logic Contract

- **premise Anchor：** 认识他以前跟朋友去过一次
- **source Kind：** caller-statement
- **source Proves：** 来电人当场陈述，可与已经收到的材料核对。
- **source Does Not Prove：** 未披露的付款、余额或用途不能靠语气推断。
- **answer Anchor：** 就那一次。这跟他现在找我要钱有什么关系？
- **answer Adds：** 就那一次。这跟他现在找我要钱有什么关系？
- **next Legal Question：** 沿已披露的消费与钱款去向继续问。

- **矛盾：** 她从第一次去改口为只在认识现任前随朋友去过一次，第一夜收到的两年前朋友圈却写着第三次来、同行恋人每次订靠窗位。
- **是否核心项：** true
- **路线轴：** caller-credibility
- **路线口气：** pressure-point
- **内部 ID：** credit-anniversary-agency:questionOptions:0

#### 场尾自动拍

##### lines

###### 1. lines 1

**林旭阳：** 后台有个观众发来一张你的旧朋友圈，说以前加过你。定位是云栖，你看看。

#### closure Contract

- **entry Anchor：** 我俩第一次去那家餐厅
- **closer Anchor：** 旧朋友圈
- **adds：** 明确后台新材料的提交者与收到时间，再向连线人核实。
- **open Edge：** 由下一张材料承接本段刚出现的问题。
- **route Independent：** true

#### 压力表演

- **意图钩子：** 餐厅经历
- **防备状态：** guarded

#### question Sequence

- credit-anniversary-agency:questionOptions:0

### 夜 A · 4｜credit-layoff-gap

**咨询者：** 这个月那笔没来，我就问他怎么回事，他还是说奖金晚发。我不放心，才让他把工资记录发来。工资记录没发，只给了我一份从电子社保卡导出的缴费记录，说公司漏缴了两个月。我翻到最后，才发现缴费停在四月。可四月以后，他还天天跟我说加班。

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

**林旭阳：** 这个月的钱没来，他怎么跟你解释的？

#### 正文后节拍

##### lines

###### 1. lines 1

**林旭阳：** 他让你拿八万出来，却没给工资记录。把他发你的那份社保记录转到后台，我看看具体断在哪个月。

###### 2. lines 2

**咨询者：** 好，发过去了，就是他给我的那份。

###### 3. lines 3

【后台收到她转来的社保缴费记录，最后缴费月份停在四月。】

###### 4. lines 4

**林旭阳：** 停缴这两个月，他给你看过工资到账吗？

###### 5. lines 5

**咨询者：** 我问过他。他说工资明细太私密，停两个月只是漏缴。可八万我更觉得不该转。

- **现场疑点：** 说是奖金晚发，可社保已经断缴两个月。
- **矛盾：** 他用“奖金延迟”解释周转，社保停后却还在刷体面消费，资金缺口早已出现。
- **可靠度：** mixed
- **展示卡片：** daily-credit-social-security
#### 关键追问

##### 1. credit layoff gap:question Options:0

**林旭阳：** 他拿漏缴解释过去，你现在还信吗？

**咨询者：** 不信。他还天天说加班，有一回我说送吃的，他让我别去，说门禁严。可我不信他，就更不想拿以前给我的钱去填他的卡。

**林旭阳：** 那以前他转给你的钱呢，你打算怎么跟他说？

**咨询者：** 以前给我的，我凭什么吐？他自己刷的卡，现在倒要从我这里拿回去。

- **source Anchor：** 缴费停在四月
- **玩家所选怀疑方向：** 他拿漏缴解释过去，你现在还信吗？
- **texture Role：** ramble
###### logic Contract

- **premise Anchor：** 缴费停在四月
- **source Kind：** caller-statement
- **source Proves：** 咨询者持续听到对方说自己在加班。
- **source Does Not Prove：** 这些说法不能证明对方当时仍在职。
- **answer Anchor：** 不信。他还天天说加班，有一回我说送吃的，他让我别去，说门禁严。可我不信他，就更不想拿以前给我的钱去填他的卡。
- **answer Adds：** 不信。他还天天说加班，有一回我说送吃的，他让我别去，说门禁严。可我不信他，就更不想拿以前给我的钱去填他的卡。
- **next Legal Question：** 继续核对断缴和账单时间，不能只凭加班说法确定离职日期。

- **矛盾：** 社保断缴早于借钱，失业不是突然发生。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** trust-but-verify
- **内部 ID：** credit-layoff-gap:questionOptions:0

#### 压力表演

- **意图钩子：** 心疼话后面接钱
- **防备状态：** guarded

#### question Sequence

- credit-layoff-gap:questionOptions:0

### 第一次收麦

**咨询者：** 他把材料都发你了吧？那你看，我明晚再来。

#### 舞台标记

- **after Scene Index：** 1
- **主播台词：** 材料收到了。明晚把钱的用途和当初的约定一起说清楚。
- **stage Direction：** 连线结束。匿名观众那张云栖朋友圈已经对过。男方继续向后台发来遮名流水、转账记录和聊天截图。
- **音频提示：** sfx.phone.soft-hangup

## 收麦幕间：控台短查

### 幕间行动

- **标题：** 男方连夜补材料
- **kicker：**
- **budget：** 0
- **min Actions：** 0
- **max Actions：** 0
- **continue Label：** 进入白天调查
- **flow Mode：** linear

## 白天调查

- **白天开场：** 男方昨夜直接向后台补了流水和聊天。今天把收到的材料打开，准备继续问。
- **白天行动预算：** 0
- **最少白天场景：** 1
### 地点 1

- **内部 ID：** day-inbox-review
- **标签：** 查看男方后台来信
- **舞台背景：** day-document
- **类型：** studio
#### 场景正文

- **access：** 男方直接向节目提交并同意遮名展示。
昨晚你把男方发来的材料转给一直帮工作室记账的周会计，请他帮忙看这几笔进出。他约你下午在工作室碰头，把外套搭在椅背上。

- **获得物件：** 男方后台材料
- **source Note：** 男方补来了流水；你请平时帮工作室记账的周会计一起看。
- **document Id：** case1-bank-flow
##### 场景节拍

###### 1. rhythm beat 0

**周会计：** 昨晚那通还没问完？我看看。每月三万五，转她一万七千五，房租另外付。

#### 舞台标记

- **内部 ID：** rhythm-beat-0

###### 2. rhythm beat 1

**你：** 她一直拿共同花销解释，自己的账还没拿来。

#### 舞台标记

- **内部 ID：** rhythm-beat-1

###### 3. rhythm beat 2

**周会计：** 往下看。他居然也买理财了。三月十一号借二十万，十二号、十四号各买十万宸直信托的理财产品。是不是借来买的，得问他。

#### 舞台标记

- **内部 ID：** rhythm-beat-2

###### 4. rhythm beat 3

**你：** 工资还在发就借钱投资？他图什么？

#### 舞台标记

- **内部 ID：** rhythm-beat-3

###### 5. rhythm beat 4

**周会计：** 你问问他当时看了什么介绍。别光算她那八万。

#### 舞台标记

- **内部 ID：** rhythm-beat-4

###### 6. rhythm beat 5

**你：** 我问问他。这笔借款，还有他说快发的奖金，都得让他自己回。

#### 舞台标记

- **内部 ID：** rhythm-beat-5

###### 7. credit product intro

**旁白：** 男方先回了一张当时保存的宣传页：高收益、到期返本，下面排列着地产和商业项目。你打开机构介绍，满页都是新项目签约。

#### 舞台标记

- **内部 ID：** credit-product-intro

###### 8. credit product question

**你：** 这广告光说收益高，什么时候能拿钱倒找不着。他借的钱可是每个月都要还利息的。

#### 舞台标记

- **内部 ID：** credit-product-question

### 幕间物件映射

## 夜 B：回拨

- **收麦锚点：** 缴费停在四月
- **收麦舞台：** 连线结束。匿名观众那张云栖朋友圈已经对过。男方继续向后台发来遮名流水、转账记录和聊天截图。
- **hangup Audio Cue Id：** sfx.phone.soft-hangup
- **主播留话：** 材料收到了。明晚把钱的用途和当初的约定一起说清楚。
### 回拨衔接

#### lines

##### 1. lines 1

**林旭阳：** 嗯，我把昨晚的聊天打开了。

### 回拨立场

- **against Caller：** 我回来了，你问吧。
- **with Caller：** 我回来了，你问吧。

### 夜 B · 1｜credit-bank-flow

**咨询者：** 说过想投资，没说钱是借的。没钱还每天跟我说加班，找我要八万的时候又说奖金快来了。他这些都不告诉我，我凭什么先把自己的钱拿出来？

#### no Clue Reaction

**咨询者：** 他的事都没说清，怎么又只问我？

- **interaction Mode：** lineReplay
- **线索职能：** missing-edge
- **错误框架：** 用男方瞒失业和借款，盖住自己不肯吐出旧钱的要求。
#### 回收目标

- credit-loyalty-test

#### 段后触发

- **类型：** evidenceCheck
- **材料检视 ID：** credit-leveraged-trust
- **标签：** 把借款和宸直转账放一起
- **continue Label：** 继续问她收下的钱

- **说话人 ID：** shen
#### 正文前节拍

##### lines

###### 1. lines 1

**林旭阳：** 你还是不肯拿以前转给你的钱，对吧？

###### 2. lines 2

**咨询者：** 对。给我的时候愿意，现在不能说要就要。

###### 3. lines 3

【男方回复白天的询问，发来借款、认购记录与离职结算通知。】

###### 4. lines 4

**林旭阳：** 他回我了，那二十万是借来买宸直的。你说的奖金，他发来的却是离职结算通知，十万五，预计月底发。这些他跟你讲过吗？

- **现场疑点：** 她拿他的隐瞒解释自己拒绝吐出旧钱，原始给付约定仍未核对。
- **矛盾：** 男方借款与失业的解释，不替代双方当初的给付约定。
- **可靠度：** mixed
#### 关键追问

##### 1. credit bank flow:question Options:0

**林旭阳：** 他有没有说过，为什么偏偏让你拿八万？

**咨询者：** 他说以前转给我的那些，留一部分也够了。可那是以前的事，谈恋爱愿意给我的，现在又拿来算。

- **source Anchor：** 找我要八万
- **玩家所选怀疑方向：** 他有没有说过，为什么偏偏让你拿八万？
###### logic Contract

- **premise Anchor：** 找我要八万
- **source Kind：** caller-statement
- **source Proves：** 她仍认为男方无权索回旧钱，八万请求出现了过去转账这一理由。
- **source Does Not Prove：** 男方曾经转账，不等于双方没有约定用途，也不等于当前余额。
- **answer Anchor：** 他说以前转给我的那些，留一部分也够了。可那是以前的事，谈恋爱愿意给我的，现在又拿来算。
- **answer Adds：** 他说以前转给我的那些，留一部分也够了。可那是以前的事，谈恋爱愿意给我的，现在又拿来算。
- **next Legal Question：** 核对固定给付原始约定，不将转账总额当余额。

- **矛盾：** 男方借款与失业的解释，不替代双方当初的给付约定。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** pressure-point
- **内部 ID：** credit-bank-flow:questionOptions:0

##### 2. credit bank flow:question Options:1

**林旭阳：** 他当时说过，这些钱你可以随便花吗？

**咨询者：** 他又没说不许花。钱都转给我了，用的时候还得一笔笔问他？

- **source Anchor：** 自己的钱
- **玩家所选怀疑方向：** 他当时说过，这些钱你可以随便花吗？
- **是否核心项：** true
- **路线轴：** document-edge
- **路线口气：** trust-but-verify
- **内部 ID：** credit-bank-flow:questionOptions:1
- **矛盾：** 男方借款与失业的解释，不替代双方当初的给付约定。
###### logic Contract

- **premise Anchor：** 自己的钱
- **source Kind：** caller-statement
- **source Proves：** 她以转账已经完成为由，主张自己可以支配。
- **source Does Not Prove：** 男方曾经转账，不等于双方没有约定用途，也不等于当前余额。
- **answer Anchor：** 他又没说不许花
- **answer Adds：** 她用没有禁止花钱来回答是否明确同意随便花，没有给出原始约定。
- **next Legal Question：** 用双方原始聊天核对代存约定。

#### 压力表演

- **意图钩子：** 不吐旧钱
- **防备状态：** guarded

#### question Sequence

- credit-bank-flow:questionOptions:0
- credit-bank-flow:questionOptions:1

### 夜 B · 2｜credit-loyalty-test

**林旭阳：** 接着呢？

**咨询者：** 他每个月转来的钱我收了。可那是谈恋爱给我花的。

- **interaction Mode：** testimonyWall
- **线索职能：** payoff
- **错误框架：** 害怕被离开只是情绪表达，与催转账无关。
#### 回收目标

- credit-layoff-gap

- **说话人 ID：** shen
#### 正文前节拍

##### lines

###### 1. lines 1

**林旭阳：** 把你们当时的聊天发来看看吧。

###### 2. lines 2

【男方在后台发来十四个月的转账记录，以及当初约定存钱的聊天。】

###### 3. lines 3

**林旭阳：** 十四个月都转了，房租也是他另付的。这个没错吧？

###### 4. lines 4

**咨询者：** 数没错，房租也是他另外付的。

###### 5. lines 5

**林旭阳：** 他留言说，以为你至少存了十五万，才向你要八万。你让他看过余额吗？

###### 6. lines 6

**咨询者：** 没有。我的账户干嘛天天给他看？

###### 7. lines 7

【后台打开男方提交的约定原图。沈：“每个月那一半放我这儿，我替我们存着，以后一起生活用。”男友：“好，那就每月八号转，房租我另外付。”沈：“嗯。”】

###### 8. lines 8

**咨询者：** 他连这么久以前的聊天都翻出来了？

#### testimony Wall

- **presentation Skin：** voice-matrix
- **标题：** 谈到以前的转账
- **引子：** 选择原话与材料后出示。
- **split After：** 3
- **mid Summary：**
- **soft Anchor Response：** 已选材料
##### miss Feedback

###### evidence

- 她回了一句：“这张跟我刚才说的有什么关系？”
- 她说：“你拿这张问我，我还是那句话。”

###### statement

- 她打断你：“我这句哪里说错了？”
- 她没有改口：“这话我认，怎么了？”

##### statements

###### 1. 证词 01

- **内部 ID：** credit-consumption-gloss
- **标签：** 证词 01
每个月那笔我收了，可那是他给我花的。我从没答应替两个人存起来。

- **press Response：** 他以前又不查账。怎么今天要用钱了，就全得躺在那儿等着他？
- **present Response：** 已选材料

###### 2. 证词 03

- **内部 ID：** credit-eight-wan-separate
- **标签：** 证词 03
他今晚要的八万，不能因为以前花过钱就算成我欠他的。

- **press Response：** ‘八万不是我的卡。以前的钱……那是以前。’
- **present Response：** 已选材料

###### 3. 证词 04

- **内部 ID：** credit-savings-unknown
- **标签：** 证词 04
我手里剩多少一直没给他看，因为那是我的账户。

- **press Response：** ‘我没给他看过余额。十五万是他自己猜的。’
- **present Response：** 已选材料

##### acts

###### 1. 每月转账，当初怎么约定的

- **内部 ID：** act1
- **presentation Skin：** voice-matrix
- **标题：** 每月转账，当初怎么约定的
- **wink Line：**
- **wink Tier：** tier2-player-cue
- **引子：** 选一份材料，再点你要核对的原话。
- **split After：** 3
- **mid Summary：**
- **soft Anchor Response：** 已选材料
###### statements

###### 1. 证词 01

- **内部 ID：** credit-consumption-gloss
- **标签：** 证词 01
每个月那笔我收了，可那是他给我花的。我从没答应替两个人存起来。

- **press Response：** 他以前又不查账。怎么今天要用钱了，就全得躺在那儿等着他？
- **present Response：** 已选材料

###### 2. 证词 03

- **内部 ID：** credit-eight-wan-separate
- **标签：** 证词 03
他今晚要的八万，不能因为以前花过钱就算成我欠他的。

- **press Response：** ‘八万不是我的卡。以前的钱……那是以前。’
- **present Response：** 已选材料

###### 3. 证词 04

- **内部 ID：** credit-savings-unknown
- **标签：** 证词 04
我手里剩多少一直没给他看，因为那是我的账户。

- **press Response：** ‘我没给他看过余额。十五万是他自己猜的。’
- **present Response：** 已选材料

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** credit-savings-agreement:chat
- **statement Id：** credit-consumption-gloss
###### material Cards

###### 1. 每月半薪的约定

- **内部 ID：** credit-savings-agreement:chat
- **类型：** 双方聊天原图
- **标签：** 每月半薪的约定
- **excerpt：** 沈：“每个月那一半放我这儿，我替我们存着，以后一起生活用。”男友：“好，那就每月八号转，房租我另外付。”沈：“嗯。”
- **source Label：** 男方直接发来的双方旧聊天
###### source Beat

- **scene Id：** credit-loyalty-test
- **field：** beforeVersion
- **line Index：** 6

###### 2. 月转 17500 × 14 个月

- **内部 ID：** credit-fixed-support:summary
- **类型：** 材料检视
- **标签：** 月转 17500 × 14 个月
- **excerpt：** 固定转账汇总：¥17,500 × 14；累计 ¥245,000
- **source Label：** 固定转账与存款预期

- **咨询者台词：** 是说过存着，可也没说一分不能花啊。做脸买衣服他以前也知道，我们出去的时候他也没说不让我花。现在怎么全变成我的问题了？
- **主播台词：** 你当时明明说替两个人存着。现在钱要用了，怎么变成从没答应过？
- **boundary Line：** 旧聊天确认她曾答应替两个人存钱；共同消费仍须核对，八万不因此成为她的债。
- **矛盾：** 她否认代存约定，双方旧聊天保留了她提出代存及男方接受的原话。
- **路线轴：** money-flow
- **continue Label：** 问钱花在哪儿
- **outcome Kind：** contradiction
- **selection Reason：** 直接对应“从没答应代存”的旧聊天，金额汇总不能证明用途约定。

###### miss Feedback

###### evidence

- 她回了一句：“这张跟我刚才说的有什么关系？”
- 她说：“你拿这张问我，我还是那句话。”

###### statement

- 她打断你：“我这句哪里说错了？”
- 她没有改口：“这话我认，怎么了？”

###### inquiry

###### opening Lines

###### 1. opening Lines 1

**咨询者：** 可那时候又没定哪天结婚，也没规定每月必须留多少。我穿什么、去哪儿，他都知道，从前不说，现在急用了就让我全拿出来。每个月那笔我收了，可那是他给我花的。我从没答应替两个人存起来。

###### 选项

###### 1. act1 ask

- **内部 ID：** act1-ask
- **主播问句：** 你当时说替两个人存着，现在为什么说从没答应过？
- **是否核心项：** true
###### lines

###### 1. lines 1

**咨询者：** 是说过存着，可也没说一分不能花啊。做脸买衣服他以前也知道，我们出去的时候他也没说不让我花。现在怎么全变成我的问题了？

###### 2. lines 2

**林旭阳：** 他答应的是让你存着，你怎么就当成随便花了？

###### 3. lines 3

**咨询者：** 以后一起生活又没说哪天。他现在急用了，才来抓我以前那句话。

###### 2. act1 miss 1

- **内部 ID：** act1-miss-1
- **主播问句：** 每个月那一半到账以后，你有没有把还剩多少告诉过他？
- **是否核心项：** false
###### lines

###### 1. lines 1

**咨询者：** 没有。他不问，我也不主动报。

- **supplementary：** true

###### 3. act1 miss 2

- **内部 ID：** act1-miss-2
- **主播问句：** 这十四个月里，有哪一个月你是原数转回去的？
- **是否核心项：** false
###### lines

###### 1. lines 1

**咨询者：** 没有。他以前又没叫我往回转。

- **supplementary：** true

###### 2. 转给你的钱，花在哪儿了

- **内部 ID：** act2
- **presentation Skin：** voice-matrix
- **status Label：** 她接着说
- **标题：** 转给你的钱，花在哪儿了
- **引子：** 选一份材料，再点你要核对的原话。
###### opener Lines

###### 1. opener Lines 1

**林旭阳：** 转给你的钱，除了用于共同生活，你房租也不用出，剩下的钱呢？

###### 2. opener Lines 2

**咨询者：** 一起吃喝、出去玩不都得花钱？现在怎么都来问我。

###### 3. opener Lines 3

【男方看见她仍在说共同开销，又向后台发来一张两个月前的聊天。沈：“你每个月转我的，我拿去做脸买衣服了，出去吃饭你付。”男友：“少花点，留着以后用。”】

###### 4. opener Lines 4

**林旭阳：** 这是他刚发来的，你看看。

###### 5. opener Lines 5

**咨询者：** 他说什么就是什么？你先听我讲完。

- **revised Frame：** 代存约定问清后，直接追问固定转账如何花掉；男方提交女方自己写的个人消费说明。
- **split After：** 2
- **mid Summary：**
- **soft Anchor Response：** 已选材料
###### statements

###### 1. 原话 01

- **内部 ID：** credit-transfer-was-his-idea
- **标签：** 原话 01
衣服做脸是我用的，可我跟他出去也得体面。这些也算两个人过日子的花销。

- **press Response：** 一起出去的时候，我穿得好看，他也有面子。
- **present Response：** 已选材料

###### 2. 原话 02

- **内部 ID：** credit-shared-spending-limited
- **标签：** 原话 02
设备是他送我的，分期是他自己选的。

- **press Response：** 这件事我没改口，东西在我家。
- **present Response：** 已选材料

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** credit-personal-spending:chat
- **statement Id：** credit-transfer-was-his-idea
###### material Cards

###### 1. 她说钱拿去做脸买衣服

- **内部 ID：** credit-personal-spending:chat
- **类型：** 双方聊天
- **标签：** 她说钱拿去做脸买衣服
- **excerpt：** 沈：“你每个月转我的，我拿去做脸买衣服了，出去吃饭你付。”男友：“少花点，留着以后用。”
- **source Label：** 男方刚发来的两个月前聊天
###### source Beat

- **scene Id：** credit-loyalty-test
- **field：** openerLines
- **act Id：** act2
- **line Index：** 2

###### 2. 月转 17500 × 14 个月

- **内部 ID：** credit-fixed-support:summary
- **类型：** 材料检视
- **标签：** 月转 17500 × 14 个月
- **excerpt：** 固定转账汇总：¥17,500 × 14；累计 ¥245,000
- **source Label：** 固定转账与存款预期

- **咨询者台词：** 做脸、衣服、探店，哪样不要钱？我做账号，探店的钱先垫着，等合作下来就回来了。
- **主播台词：** 那说好存着的钱呢？总不能全花在这些上面吧？
- **boundary Line：** 本人聊天与现场回答说明代存款被用于个人消费和无约定报酬的探店；当前余额她不公开。
- **矛盾：** 她承认个人消费，却把维护外表与未收回的探店开销都算作代存款的共同用途。
- **路线轴：** money-flow
- **continue Label：** 继续问余额
- **outcome Kind：** contradiction
- **selection Reason：** 核对她自己对个人消费的说明。

###### miss Feedback

###### evidence

- 她问：“这能说明什么？”
- 她说：“该说的我刚才都说了。”

###### statement

- 她反问：“我说这句也有问题？”
- 她说：“你换个问法，我也是这么说。”

- **wink Line：**
###### inquiry

###### opening Lines

###### 1. opening Lines 1

**林旭阳：** 转给你的钱，除了用于共同生活，你房租也不用出，剩下的钱呢？

###### 2. opening Lines 2

**咨询者：** 一起吃喝、出去玩不都得花钱？现在怎么都来问我。

###### 3. opening Lines 3

**林旭阳：** 共同花的，和你自己买东西的分开说。男方，你说提醒过她少花，原话也发来。

###### 4. opening Lines 4

【男方看见她仍在说共同开销，又向后台发来一张两个月前的聊天。沈：“你每个月转我的，我拿去做脸买衣服了，出去吃饭你付。”男友：“少花点，留着以后用。”】

###### 5. opening Lines 5

**林旭阳：** 这是他刚发来的，你看看。

###### 6. opening Lines 6

**咨询者：** 他说什么就是什么？你先听我讲完。

###### 7. opening Lines 7

**咨询者：** 衣服做脸是我用的，可我跟他出去也得体面。这些也算两个人过日子的花销。

###### 选项

###### 1. act2 miss 1

- **内部 ID：** act2-miss-1
- **主播问句：** 一起吃的那些，是你先付他还你，还是他当时就刷了？
- **是否核心项：** false
###### lines

###### 1. lines 1

**咨询者：** 出去吃他刷得多。可做脸买衣服那些，不是饭局。

- **supplementary：** true

###### 2. act2 ask

- **内部 ID：** act2-ask
- **主播问句：** 那说好存着的钱呢？总不能全花在这些上面吧？
- **是否核心项：** true
###### lines

###### 1. lines 1

**咨询者：** 做脸、衣服、探店，哪样不要钱？我做账号，探店的钱先垫着，等合作下来就回来了。

###### 2. lines 2

**林旭阳：** 现在接的合作，够补你花出去的这些吗？

###### 3. lines 3

**咨询者：** 还没。就接过几次。

###### 4. lines 4

**林旭阳：** 你自己付的饭钱，商家答应报销了吗？

###### 5. lines 5

**咨询者：** 大部分没有。我得先拍，账号做起来才有人找。工资不够，就用他每个月转来的。我也不能一条没接到广告，就立刻不拍了。

###### 6. lines 6

**林旭阳：** 明白，钱反正已经花出去了，什么时候能见回头钱咱也不知道。

###### 3. act2 miss 2

- **内部 ID：** act2-miss-2
- **主播问句：** 他让你少花点，你回过他一句好、我少花没有？
- **是否核心项：** false
###### lines

###### 1. lines 1

**咨询者：** 答应过啊。可买的时候，我也没觉得就多花了多少。

- **supplementary：** true

- **wink Line：**
- **revision：** shameless-2026-09-19

#### decisive Present

- **max Attempts：** 2
- **evidence Id：** credit-savings-agreement:chat
- **statement Id：** credit-consumption-gloss
##### material Cards

###### 1. 每月半薪的约定

- **内部 ID：** credit-savings-agreement:chat
- **类型：** 双方聊天原图
- **标签：** 每月半薪的约定
- **excerpt：** 沈：“每个月那一半放我这儿，我替我们存着，以后一起生活用。”男友：“好，那就每月八号转，房租我另外付。”沈：“嗯。”
- **source Label：** 男方直接发来的双方旧聊天
###### source Beat

- **scene Id：** credit-loyalty-test
- **field：** beforeVersion
- **line Index：** 6

###### 2. 月转 17500 × 14 个月

- **内部 ID：** credit-fixed-support:summary
- **类型：** 材料检视
- **标签：** 月转 17500 × 14 个月
- **excerpt：** 固定转账汇总：¥17,500 × 14；累计 ¥245,000
- **source Label：** 固定转账与存款预期

- **咨询者台词：** 是说过存着，可也没说一分不能花啊。做脸买衣服他以前也知道，我们出去的时候他也没说不让我花。现在怎么全变成我的问题了？
- **主播台词：** 你当时明明说替两个人存着。现在钱要用了，怎么变成从没答应过？
- **boundary Line：** 旧聊天确认她曾答应替两个人存钱；共同消费仍须核对，八万不因此成为她的债。
- **矛盾：** 她否认代存约定，双方旧聊天保留了她提出代存及男方接受的原话。
- **路线轴：** money-flow
- **continue Label：** 问钱花在哪儿
- **outcome Kind：** contradiction
- **selection Reason：** 直接对应“从没答应代存”的旧聊天，金额汇总不能证明用途约定。

#### 正文后节拍

##### lines

###### 1. lines 1

**林旭阳：** 那现在还留了多少？

###### 2. lines 2

**咨询者：** 剩多少我不想在这里报。反正八万拿不出来。我的工资也基本花完了。

###### 3. lines 3

**林旭阳：** 他还以为你存着十五万呢。你跟他说过没存下来吗？

###### 4. lines 4

**咨询者：** 没说。他自己连失业都瞒着我，凭什么只问我？

###### 5. lines 5

**林旭阳：** 可钱没存下来，你也一直没告诉他啊。

###### 6. lines 6

**咨询者：** 他愿意给我的，怎么现在都成我的错了？

- **展示卡片：** daily-credit-severance
- **现场疑点：** 她把承诺代存改称赠与，把个人消费说成共同开销。
- **矛盾：** 女方称固定转账全用于共同开销，自己的聊天却明确说拿去做脸买衣服，外出吃饭仍由男方另付。
- **可靠度：** partial
#### 压力表演

- **意图钩子：** 体面话开始露底
- **防备状态：** guarded

- **legacy Question Options：** true
### 回拨后立场

- **default：** neutral
#### lines

- **defensive：** 我回来了。你接着问吧。
- **open：** 我回来了。你接着问吧。
- **neutral：** 我回来了。你接着问吧。

## 材料、回流与可选追查

### 证据卡

#### 1. “奖金”的实际名目

- **内部 ID：** daily-credit-severance
- **表现类型：** 离职结算通知
- **标题：** “奖金”的实际名目
- **front：** 第二夜男方直接向后台提交的离职结算通知：离职前月工资 ¥35,000；待发解除劳动合同补偿金 ¥105,000；预计 7 月底支付。
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
- **front：** 本期应还款额：¥80,360.00
持卡人、卡号已遮盖。以下为发来的消费明细截图。
- **detail：**
##### targets

- sceneHint

- **矛盾：** 两人的共同消费远高于男方个人男装；咨询者不能只用约五千男装指责他乱花钱，男方也仍要解释至少三万五的去向。
##### source Table

###### columns

- 商户／商品
- 人民币金额

###### 表格行

###### 表格行 1

- 云栖餐厅
- 6,800.00

###### 表格行 2

- 餐饮消费（多笔）
- 7,200.00

###### 表格行 3

- 酒店住宿（两笔）
- 4,800.00

###### 表格行 4

- 礼品消费（多笔）
- 9,200.00

###### 表格行 5

- 拍摄设备／分期订单总价
- 12,000.00

###### 表格行 6

- 男装（含大衣 2,380.00）
- 5,000.00

#### 4. 最低还款请求

- **内部 ID：** daily-credit-chat
- **表现类型：** 聊天
- **标题：** 最低还款请求
- **front：** “你先帮我垫一下，我不想这段关系因为钱毁了。”
- **detail：** 男方问她能否今晚转八万，并提到奖金晚发和两人的关系。
##### targets

- truthWithGap

- **矛盾：** 还款请求把个人债务包装成关系考验。

#### 5. 纪念日晚餐痕迹

- **内部 ID：** daily-credit-anniversary
- **表现类型：** 消费记录
- **标题：** 纪念日晚餐痕迹
- **front：** 云栖餐厅的纪念日晚餐账单，酒水占了大头；可与第一夜收到的两年前朋友圈定位核对。
- **detail：** 第一夜匿名私信附来的旧截图：发布于本案第一夜的两年前，定位云栖餐厅。她的配文是“第三次来啦，他每次都订靠窗这排，知道我爱拍照。”朋友评论“你男朋友也太会挑地方了”。本次纪念日晚餐账单的商户同样是云栖餐厅。
##### targets

- halfLie
- sceneHint

- **矛盾：** 她从第一次去改口为只在认识现任前随朋友去过一次，第一夜收到的两年前朋友圈却写着第三次来、同行恋人每次订靠窗位。

### 材料圈点

#### 1. 旧朋友圈

- **内部 ID：** credit-anniversary-footprint
##### revalues

- credit-eight-wan-bill
- credit-anniversary-agency

- **标题：** 旧朋友圈
- **提示题：** 哪处记录和她刚才说的经历对不上？
- **材料：** 第一夜匿名私信附来的旧截图：发布于本案第一夜的两年前，定位云栖餐厅。她的配文是“第三次来啦，他每次都订靠窗这排，知道我爱拍照。”朋友评论“你男朋友也太会挑地方了”。本次纪念日晚餐账单的商户同样是云栖餐厅。
##### 材料行

- 旧朋友圈 · 本案第一夜的两年前
- 定位与本次账单商户 · 云栖餐厅
- 配文 · 第三次来啦，他每次都订靠窗这排，知道我爱拍照。
- 评论 · 你男朋友也太会挑地方了

##### 选项

###### 1. 两年前已写“第三次来”，评论还提到男朋友

- **标签：** 两年前已写“第三次来”，评论还提到男朋友
- **是否核心项：** true
- **矛盾：** 她从第一次去改口为只在认识现任前随朋友去过一次，第一夜收到的两年前朋友圈却写着第三次来、同行恋人每次订靠窗位。
- **反馈：** 两年前你就写第三次来了，朋友还在夸你男朋友。怎么到今天，只剩一次朋友聚餐了？
- **人物反应：** ……是前任，行了吧。那时候是去过几次。我不想在直播里提前任，万一传到他那儿，又得吵。我就是喜欢去那家嘛。
- **路线轴：** caller-credibility
- **内部 ID：** credit-anniversary-footprint:option:0
- **主播问句：** 两年前你就写第三次来了，朋友还在夸你男朋友，怎么只剩一次朋友聚餐了？

###### 2. 这张图是谁拍的

- **标签：** 这张图是谁拍的
- **是否核心项：** false
- **反馈：** 谁按的快门，说明不了她去过几次。先看她自己写的第三次来。
- **人物反应：** 我自己拍的。靠窗好看，去过的人都知道。
- **路线轴：** money-flow
- **内部 ID：** credit-anniversary-footprint:option:1
- **主播问句：** 靠窗这排是他订的。你发这张的时候，是你拍的，还是他拍的？

###### 3. 有没有同时发过人均或账单

- **标签：** 有没有同时发过人均或账单
- **是否核心项：** false
- **反馈：** 有没有发账单，帮不上核对她写过几次。先看配文自己写的到店次数。
- **人物反应：** 那张没配账单。我就是发了座位。
- **路线轴：** outer-thread
- **内部 ID：** credit-anniversary-footprint:option:2
- **主播问句：** 定位写云栖。你发这张的时候，有没有同时发过人均或者账单？

##### social Post

- **author：** 咨询者
- **posted At：** 两年前
- **location：** 云栖餐厅
- **caption：** 第三次来啦，他每次都订靠窗这排，知道我爱拍照。
- **image Src：** ./assets/generated/backgrounds/cafe_date.png?v=0.20.95
- **image Alt：** 两年前的餐厅照片
- **comment Author：** 朋友
- **评论：** 你男朋友也太会挑地方了
- **comment Note：** 匿名来信附图，保留当年的评论。
- **followup：** 第一夜后台收到的原图；本次纪念日晚餐账单商户：云栖餐厅。

- **spoken Inquiry：** true

#### 2. 借款与信托转账检视

- **内部 ID：** credit-leveraged-trust
##### revalues

- credit-layoff-gap
- credit-five-wan-gap

- **标题：** 借款与信托转账检视
- **提示题：** 他承认借钱买理财了，接下来问什么？
- **材料：** 男方直接发来的流水与本人说明：“三月从澄川借了二十万，十二号、十四号各转十万买宸直的产品。我原本想赚收益，撑住平时开销。”
##### 材料行

- 03-11 · 入账 ¥200,000 · 澄川金融服务有限公司 · 借款发放
- 03-12 · 支出 ¥100,000 · 宸直信托有限公司 · 产品认购
- 03-14 · 支出 ¥100,000 · 宸直信托有限公司 · 产品认购
- 男方说明 · 借款用于这两笔认购，想靠收益维持开销

##### 选项

###### 1. 你知道他要靠投资收益撑日常开销吗？

- **标签：** 你知道他要靠投资收益撑日常开销吗？
- **是否核心项：** true
- **矛盾：** 对方在有工资时已经借入二十万，随后三天内向同一家信托机构分两次转出二十万，债务并非失业后才突然出现。
- **反馈：** 那他跟你说过，这样花下去他已经撑不住了吗？
- **人物反应：** 没说过负担不起。他说过等投资赚了就轻松了，我当时还以为他手头有闲钱。
- **路线轴：** money-flow
- **内部 ID：** credit-leveraged-trust:option:0
- **主播问句：** 那他跟你说过，这样花下去他已经撑不住了吗？

###### 2. 你们一起商量过借钱认购的金额吗？

- **标签：** 你们一起商量过借钱认购的金额吗？
- **是否核心项：** true
- **反馈：** 他投这二十万之前，有没有跟你商量过？
- **路线轴：** document-edge
- **内部 ID：** credit-leveraged-trust:option:1
- **主播问句：** 他投这二十万之前，有没有跟你商量过？
- **人物反应：** 他说有个产品能赚钱，没跟我说准备投多少，更没说要借钱。 他只说等投资赚了就轻松了，我不知道他已经要靠这个填日常开销。
- **矛盾：** 男方借款认购，来电人并不清楚投资的金额、期限和借款成本。

###### 3. 让他把这二十万先取出来还信用卡？

- **标签：** 让他把这二十万先取出来还信用卡？
- **是否核心项：** true
- **反馈：** 他有没有说过，这笔钱什么时候能取出来？
- **路线轴：** outer-thread
- **内部 ID：** credit-leveraged-trust:option:2
- **主播问句：** 他有没有说过，这笔钱什么时候能取出来？
- **人物反应：** 只说现在动不了。我没见过合同，不知道是没到期，还是出了别的问题。 他只说等投资赚了就轻松了，我不知道他已经要靠这个填日常开销。
- **矛盾：** 男方借款认购，来电人并不清楚投资的金额、期限和借款成本。

- **spoken Inquiry：** true

### 后台回流

#### 1. 旧朋友圈

- **内部 ID：** credit-friend-dm
- **声纹卡 ID：** case1-friend
- **来源：** dm
- **出现界面：** 已经对过的云栖朋友圈
- **标题：** 旧朋友圈
- **此刻出现原因：** 连线里已经当场核对过这张图。收麦后再看一眼，不另开问。
- **提示题：** 这张图今晚已经对过。白天先看哪份材料？
- **材料：** 第一夜匿名私信附来的旧截图：发布于本案第一夜的两年前，定位云栖餐厅。她的配文是“第三次来啦，他每次都订靠窗这排，知道我爱拍照。”朋友评论“你男朋友也太会挑地方了”。
##### social Post

- **author：** 咨询者
- **posted At：** 两年前
- **location：** 云栖餐厅
- **caption：** 第三次来啦，他每次都订靠窗这排，知道我爱拍照。
- **image Src：** ./assets/generated/backgrounds/cafe_date.png?v=0.20.95
- **image Alt：** 两年前的餐厅照片
- **comment Author：** 朋友
- **评论：** 你男朋友也太会挑地方了
- **comment Note：** 匿名来信附图，保留当年的评论。
- **followup：** 我以前就认识她，这张是两年前存的。今晚听她说只跟朋友去过一次，觉得不对才翻出来。别把我的名字放出来。

- **能证明：** 截图保留两年前的日期、餐厅定位、第三次到店的配文及关于男朋友的评论。
- **仍不能证明：** 不能仅凭截图认定同行人的具体身份、谁付款或日常消费总额。
- **路线轴：** external-corroboration
##### 选项

###### 1. 已经对过。白天打开男方流水。

- **标签：** 已经对过。白天打开男方流水。
- **是否核心项：** true
- **矛盾：** 两年前她已经发过多次到店并由同行人订靠窗位的记录，连线里已经对过次数。
- **反馈：** 次数今晚对过了。白天打开男方流水，问钱的用途和当初的约定。
- **路线轴：** external-corroboration
- **主播问句：** 已经对过。白天打开男方流水。

###### 2. 这张图里请你吃饭的，就是现在这个男朋友吧？

- **标签：** 这张图里请你吃饭的，就是现在这个男朋友吧？
- **是否核心项：** false
- **反馈：** 当年的评论只写了男朋友，不能直接当成现在这位。先核实时间和到店经历。
- **路线轴：** outer-thread
- **主播问句：** 这张图里请你吃饭的，就是现在这个男朋友吧？

###### 3. 配文写第三次，但没写同行是谁

- **标签：** 配文写第三次，但没写同行是谁
- **是否核心项：** false
- **反馈：** 没写同行，不等于没去过三次。先核对她自己写下的到店次数。
- **路线轴：** document-edge
- **主播问句：** 配文写第三次来。你两年前发的时候，有没有写过跟谁去？

- **trigger Action：** version:2

### 文档原件

#### 1. 他的银行流水（近五个月关键交易摘录）

**他的银行流水（近五个月关键交易摘录）**

第一夜男方看直播后直接向后台发来的关键交易摘录，姓名与完整卡号已遮挡。摘录没有余额列。

| 行 ID | 日期 | 类型 | 金额 | 对方/项目 | 备注 |
| --- | --- | --- | --- | --- | --- |
| r01 | 03-08 | 入账 | ¥35,000 | XX科技(深圳)有限公司 | 代发工资 |
| r01a | 03-08 | 支出 | ¥17,500 | 转出·尾号 6624 | 转账 |
| r01b | 03-09 | 支出 | ¥10,000 | 安寓住房租赁有限公司 | 房租（3—4月） |
| r13 | 03-11 | 入账 | ¥200,000 | 澄川金融服务有限公司 | 借款发放 |
| r14 | 03-12 | 支出 | ¥100,000 | 宸直信托有限公司 | 信托产品认购 |
| r15 | 03-14 | 支出 | ¥100,000 | 宸直信托有限公司 | 信托产品认购 |
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
| r11 | 07-14 | 支出 | ¥49,800 | 转出·尾号 3301 | 转账 |
| r12 | 07-26 | 提醒 | ¥8,214 | 本期最低还款 | 未来还款到期提醒，非交易记录 |

- **内部 ID：** case1-bank-flow
##### focus Row Ids

- r01a
- r13
- r14
- r15
- r08
- r11

- **presentation：** transactionCards
### 对方留言

- **来源：** respondent-note
- **此刻出现原因：** 男方看直播后直接向后台发来截图和本人文字，始终没有上麦。
- **夜 B 预告：** false
我发来的流水、聊天和离职通知都可以遮名展示。借款和投资是我做的，三万五的明细我不想公开。

## 收束与结案

- **host Wound Hook：** 人都失业了，她还追着那五千块男装骂
### deep Followup

- **stage Judgement：** 你答应替两个人存钱，后来花了，也没告诉他。
### quote Pick Candidates

- 衣服做脸是我用的，可我跟他出去也得体面。这些也算两个人过日子的花销。
- 我手里剩多少一直没给他看，因为那是我的账户。
- 他愿意给我的，怎么现在都成我的错了？

### accusation Choices

#### 1. “衣服做脸是我用的，可我跟他出去也得体面。这些也算两个人过日子的花销。”

- **标签：** “衣服做脸是我用的，可我跟他出去也得体面。这些也算两个人过日子的花销。”
- **主播回应：** 本段已经当场问清。
- **quote Source Scene Id：** credit-loyalty-test
- **quote Source Anchor：** 衣服做脸是我用的，可我跟他出去也得体面。这些也算两个人过日子的花销。
- **责任角色：** complainant

#### 2. “我手里剩多少一直没给他看，因为那是我的账户。”

- **标签：** “我手里剩多少一直没给他看，因为那是我的账户。”
- **主播回应：** 本段已经当场问清。
- **quote Source Scene Id：** credit-loyalty-test
- **quote Source Anchor：** 我手里剩多少一直没给他看，因为那是我的账户。
- **责任角色：** complainant

#### 3. “他愿意给我的，怎么现在都成我的错了？”

- **标签：** “他愿意给我的，怎么现在都成我的错了？”
- **主播回应：** 本段已经当场问清。
- **quote Source Scene Id：** credit-loyalty-test
- **quote Source Anchor：** 他愿意给我的，怎么现在都成我的错了？
- **责任角色：** both

### 今晚最后一句

#### 1. 你有什么话当着直播间直接跟他说吧。

- **内部 ID：** accompany
- **标签：** 你有什么话当着直播间直接跟他说吧。
- **主播台词：** 你有什么话当着直播间直接跟他说吧。
##### lines

###### 1. lines 1

**咨询者：** 反正八万我不转，之前给我的就是主动赠与。

- **sequential：** true

### 正式结案

- **标题：** 存的时候是两个人，花的时候是自己的
#### notice

- **标签：** 连线结束
女方挂断，男方没有上麦。

- **结论：** 男方旧聊天保留了代存约定。女方承认代存款用于做脸、买衣服和探店，八万拿不出来，拒绝公开余额，仍坚持此前给付都是主动赠与。
#### 场景节拍

##### 1. 来电

- **标签：** 来电
他要她拿八万，还把过去给过的钱算进理由里；她来电想证明自己一分不出也不欠情分。

##### 2. 麦上

- **标签：** 麦上
当初说替两个人存着，后来改说自愿给她花；她没有存下那笔钱，却仍不肯说余额，也不肯吐出旧钱。

##### 3. 离台核实

- **标签：** 离台核实
第二夜的结算通知证明所谓奖金是待发离职补偿；更早的二十万借款已经进了两笔信托，信用卡账单总额和已分项仍然对不上。

#### 已确认

- 他离职和债务压力都是真实存在的
- 失业早于第一次向她借钱
- 他离职前月薪约三万五，连续十四个月每月转她一万七千五，累计二十四万五
- 她提出替两个人存钱；男方据此和累计转账估算她至少存了十五万，向她要八万，这不是双方约定的最低存款额
- 半薪代存款已基本花完，她改说自愿供养，并要求把此前给付说成主动赠与
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

- **下一步：** 她挂断，八万未转。三万五用途、当前具体余额与产品回款仍未说明，不能用未公开部分改写当场已认下的约定。

- **story Interlude Recap：** 男方在后台发来代存约定和消费聊天；女方承认代存款基本花完、余额不肯公开，仍坚持此前的钱都是主动赠与。男方借款投资的事由本人后台说明，未公开的信用卡消费仍未解释。
- **followup Twist：** 男方看直播后直接提交材料，确认三月借款用于宸直认购。他把离职补偿说成奖金，也仍不愿公开信用卡中至少三万五的明细。女方承认代存款基本花完，但没有公开实际余额；男方始终没有上麦。
- **分享卡标题：** 8 万信用卡，到底该不该帮他还？
- **分享卡正文：** 男方提供的旧聊天保留了代存约定。女方承认用钱做脸、买衣服和探店，代存款基本花完、余额不肯公开，仍坚持此前给付都是主动赠与。
- **分享题：** 说好存的钱花掉了，还能改口说全是主动赠与吗？
- **作者真相：** 她以共同生活、替两个人存钱为由要半薪，房租却由男方另付。十四个月二十四万五基本花完，才改称男方自愿供养；钱断了，她首先要保住以前的钱，再借男方隐瞒失业为退出理由。男方瞒下工作和借款，把预想中的存款当退路，八万信用卡和二十万信托借款仍要自己面对。

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

- **focused Inquiry：** true
- **compact Closing：** true

### voice Tics

#### 沈

- 就……

### voice Tic Arc

- **沈：** 夜 A 密,夜 B 干净

- **来电媒介：** voice
### caller Intent Profile

- **open Goal：** 让主播支持她先不转八万元。
- **preferred Answer：** 八万元是男友自己的信用卡债，过去给她的钱也不能在今晚改成她必须偿还的欠款。
- **audience Tilt：** 让听众先把她看成被失业男友催债的人，不去追问固定转账、房租和共同消费。
- **protected Interest：** 已经收下的钱不退，也不想解释为什么没存下来；想借主播的话挡住正在看直播的男友。
- **default Tactic：** 先强调没有同住、工资卡不在自己手里，再抓住男方个人消费和隐瞒工作情况，淡化自己的持续受益。信用卡债务确在男方名下；她修剪的是消费与给付经过，不能把个人债务本身登记为她编造的说法。
- **concession Limit：** 承认聊天和转账是真的，但把当时答应存钱改说成男方主动赠与。
#### pain Points

##### 1. pain Points 1

- **topic：** 十四个月固定转账
- **threatens：** 一旦说清金额和持续时间，听众会追问她为什么拿不出八万。
- **first Response：** 先说工资卡没给她，只承认每月会转一半。
- **after Proof：** 第一夜先承认每月一半、持续一年多；第二夜固定转账汇总明确一万七千五与十四个月，后段不得再当首次揭露。
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
- **first Response：** 拒报具体余额，拿对方也有隐瞒挡住追问。
- **after Proof：** 主播逐项收窄后才承认大类和自己的工资也没存下。
- **minimum Leak：** 承认八万拿不出来、工资也基本花完，但拒报余额。

##### 4. pain Points 4

- **topic：** 来电目的
- **threatens：** 会暴露她来之前就决定不转，只想找人替自己说话。
- **first Response：** 继续抓住男方隐瞒失业和自行借款。
- **after Proof：** 不再解释存款去向，直接对正在看直播的男友表示拒绝。
- **minimum Leak：** 反正八万我不转，之前给我的就是主动赠与。

### 运行时长度计划

- **live Beat Count：** 6
- **material Board Count：** 2
- **backflow Count：** 1
- **truth Boundary Prompt Count：** 0
- **case Specific Pressure：** 酒水和高消费先问，男方后台材料逐份进入集中问询；本段问清后推进，余额与态度明确后收麦。
#### what Player Does Besides Read

- 选择具体问法
- 从后台材料中选择要问的问题
- 同页选择材料与原话

### 任务画像

- **内部 ID：** audit
- **标签：** 钱款说不清
- **recommended Specialty Id：** audit
- **摘要：** 钱说得急，责任却还没落到人。

### 路线评论

### 事实边界

#### 能确认

- 失业和债务压力都存在
- 社保断缴早于第一次向咨询者借钱
- 信用卡消费包含约会体面开支
- 1.2 万短视频分期开在断缴之后，设备和推广的受益账号是咨询者的
- 两人交往约一年半，没有同住，男方工资卡也未交给咨询者；从交往第五个月起，男方连续十四个月每月转给她一万七千五，累计二十四万五；他还每两个月直接替她支付一万元房租，自己的住房成本另行承担
- 男方按累计转账认定咨询者手里至少还存着十五万，因此开口向她要八万；这只是他的余额估算，不是她负有八万元债务的证明
- 咨询者自己的月收入只有八千多，长期把男方固定转来的钱算进自己的生活；在房租由男方另付的情况下，她仍把自己工资和十四个月固定转账基本花完，实际只剩一万一千六百多，也没有把余额告诉男方
- 信用卡里与两人共同生活和维持排场有关的消费约四万，男方个人男装消费约五千，仍有至少三万五未说明
- 男方失业后购买的男装合计约五千，其中一件大衣两千多；这笔消费本身不足以证明他个人挥霍
- 匿名观众提供女方两年前在云栖餐厅的朋友圈截图；该图用于核对到店经历。
- 五月、六月的每月 8 日都有固定私人入账，七月 8 日中断
- 匿名人提供的两年前朋友圈显示，她与前任多次到同一家餐厅；探店自付支出尚无明确回款
- 咨询者在被旧朋友圈揭穿后承认此前与前任多次到店，并称当时由前任请客
- 纪念日晚餐对应账单里一笔明显偏高的餐厅消费，主要金额来自酒水
- 纪念日晚餐朋友圈由咨询者发布，朋友曾跟着起哄
- 短视频设备开箱和首拍夜发生在咨询者屋里
- 那排靠窗位确需提前两周预订
- 四月工资停发后，五月和六月各有一笔王姓私人转账，七月又有一笔新阳信贷五万入账
- 男方看到直播后通过节目后台直接发来遮去姓名和卡号的交易摘录及本人说明；主播在第二夜问询前查看材料
- 七月 5 日贷款到账，七月 14 日 49,800 转出至尾号 3301
- 咨询者确认尾号 3301 不是自己的账户
- 三月 11 日澄川金融服务发放借款二十万
- 三月 12 日和 14 日，账户先后向宸直信托转出两笔十万
- 对方在麦外留言中承认，三月的二十万借款用于购买宸直信托产品
- 第二夜问到余额后，男方通过后台直接补发离职结算通知；所谓晚发奖金是预计七月底支付的离职补偿金
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
- 第一夜匿名来信提供两年前的餐厅朋友圈截图
- 匿名观众提供女方两年前在云栖餐厅的朋友圈截图；该图用于核对到店经历。

#### 今晚定不了

- 尾号 3301 的账户归属仍无法确认
- 展示的流水只是关键交易摘录，没有期初余额和完整收支；五月、六月每月 8 号有王姓私人入账，七月中断，来源、中断原因及停薪后其余支出的资金来源仍无法确认
- 宸直信托两笔认购对应的具体产品、兑付状态和可追回金额仍无法确认
- 对方后续是否具备还款能力仍无法确认
- 双方摊开账单后是否继续关系仍无法确认

### scene

- **name：** 直播连线

### statement Patience

- **night a：** 4
- **night b：** 4

### statement Stages

#### 1. credit living arrangement:inquiry

- **内部 ID：** credit-living-arrangement:inquiry
##### scene Indexes

- 0

- **minimum Review Count：** 1

#### 2. credit layoff gap:inquiry

- **内部 ID：** credit-layoff-gap:inquiry
##### scene Indexes

- 1

- **minimum Review Count：** 1

#### 3. credit eight wan bill:inquiry

- **内部 ID：** credit-eight-wan-bill:inquiry
##### scene Indexes

- 2

- **minimum Review Count：** 1

#### 4. credit anniversary agency:inquiry

- **内部 ID：** credit-anniversary-agency:inquiry
##### scene Indexes

- 3

- **minimum Review Count：** 1

#### 5. credit bank flow:inquiry

- **内部 ID：** credit-bank-flow:inquiry
##### scene Indexes

- 6

- **minimum Review Count：** 1

## 7 月 16 日 · 收播以后

【7 月 16 日，回拨结束，直播灯熄了。】

**赵律师：** 汤在这儿。别盯着宸直信托的页面了，先吃。

**林旭阳：** 白天周会计提醒我看那笔认购。我把宣传页和官网介绍都翻了，收益写得很显眼，旁边全是项目和签约照片。难怪他觉得借钱也能赚。

**赵律师：** 你看他合同里的兑付安排了吗？

**林旭阳：** 还没收到。广告讲到期返本，借款每月要还，他却想靠这个撑消费。等不到到期怎么办？

**赵律师：** 我手上已经有几起宸直的兑付纠纷，约定的时间到了还在拖。那几笔投向商场、地产和关联项目，资产卖不掉，广告再好看也变不出现钱。

**林旭阳：** 我给他补个消息：合同、到期日、借款利息一起发来。得看看他以为能赚到的钱，够不够先付利息。

**赵律师：** 让他把产品名字也发来，我看看是不是我手里这几款。

**赵律师：** 他还以为有十五万呢。她这一年多，居然一直没跟他说。

**林旭阳：** 还都等着对方有钱。

**赵律师：** 你还笑，先把汤喝了。

**赵律师：** 那我问个不用证据的。我要是也这么爱面子、花钱没数，你会不会什么都给我买？

**林旭阳：** 真那样的话，我们俩大概一开始就看不上对方。

你笑了一下。赵律师把一杯热水推到你手边。

【你关掉监听音箱，和赵一起出了门。】

<a id="reading-section-8"></a>

# 第二幕：职场报销截图

- **案件 ID：** 04-workplace
- **剧情 ID：** workplace-reimbursement-screenshot
- **内容包原题：** 今日来电：职场报销截图
- **时间：** 2024 年 7 月 25 日 · 九天后
### 本案两次通话日期

- 2024-07-25
- 2024-07-26

## 本案人物

| 角色 | 性格 | 欲望 | 防御动作 | 知识边界 |
|---|---|---|---|---|
| 第二通咨询者·陈 | 想证明能扛事的焦虑新人 | 想拿活动业绩，也期待按惯例多报后分到四千；欠款后想保住本金与以后的机会。 | 先只讲业绩，后来用以前都能结和部门包干替私人分配辩护。 | 知道自己垫款、主管分配和他人授权提供的受理页，不知道公司押金去了哪里。 |
| 职场案主管 | 圆滑的责任切割者 | 掌握活动分配与费用并单，在包干额度中虚列协调费、参与物料返费；资金紧张后继续要求员工先垫。 | 只回答眼前被问到的那一步，随后把选择说成咨询者自愿，把延迟推给财务。 | 知道自己经手的活动、费用与分配，不掌握宸直集团押金杠杆账。 |
| 做企业财务的朋友 | 冷静的程序理性派 | 帮主播认清手里的单据，提醒小陈还要向公司查询什么。 | 只解释自己看到的单据，不替主管答应付款。 | 不在栖行任职，只看过主播转交的材料。可以解释通用财务流程，不能查看栖行的受理记录，也不知道供应商返费归属。 |
| 职场案前地推同事 | 忙了一天还有一肚子牢骚 | 小陈问起以前的工作，愿意私下聊几句。 | 只讲自己做过的地推。 | 知道自己在职期间的指标、底薪及拉新奖金，不掌握公司账本、押金去向或当前付款进度。 |
| 职场案仓库管理员 | 朴实的记录主义者 | 让出入库记录和实际交付对上。 | 认单、认页、不认口头身份。 | 只知道仓库收货、出入库单与日期。 |
| 职场案原部门助理 | 规则型自保者 | 澄清自己已经发过报备通知，不让陈把主管承诺和填单责任推成助理漏通知。 | 只给群模板与样本，拒绝解释人的意思。 | 只掌握离职前亲自发过的活动通知、预算页及自己留的消息；离职后没有系统权限，不知当前付款状态、主管私聊和钱的去向。 |
| 职场案领导 | 冷硬的结果主义者 | 项目按时交付，季度总结里的部门成绩好看。 | 把旧规矩当执行细节，只认结果和汇报。 | 知道活动总结与负责人署名，不知道垫款金额、公司付款账户和供应商返利归属。 |
| 搬过三次仓库的人 | 惜字如金的职场老手 | 确认节目愿意听这类事后，给自己留一个以后再来的入口。 | 匿名、延后、只约定专场，不交案件细节。 | 只知道自己的职场经历和节目公开播出的内容，不知道第二通职场案未公开的账户与管理层事实。 |

## 【编剧资料】案件发动机

- **戏剧锚点：** 六万八刷卡记录、过往超额结算、旧立项页、跨部门待付受理页和八万包干草单
- **为何今晚发生：** 个人信用卡账单已出，下周一公司还要安排下一轮活动。陈想催回六万八，又怕失去能带来业绩和分成的活动机会。
### 公开求助

- **类型：** interest
- **求助内容：** 他想找到催回六万八的办法，又不影响主管继续分活动给他。前段希望保住业绩和四千分成；发现多部门也被欠款后，收窄为先追真实垫款，但仍怕公开草单断了以后的机会。

- **核心物件作用：** 六万八与八万引出虚增一万二及四千／八千分配；前同事的地推经历和多部门待付让问题扩大到公司；案后公开经营材料再揭开押金用途。
- **咨询者所求：** 追回六万八，保住业绩与主办分成，不愿一上来承认自己期待多报的四千元。
- **对方所求：** 主管靠分活动和控制费用草单分配利益；公司资金收紧后仍要求员工垫付，不想让虚列协调费被问穿。
- **第三压力：** 信用卡还款日、下周一活动安排、跨部门欠款和继续扩张的公司指标。
- **咨询者自利删减：** 他知道主办能从多报费用中分到四千，开场却只说活动业绩；欠款扩散后仍想把包干私人分配说成正常辛苦费。
- **公开钩子：** 六万八垫了一个月。他想催，又怕以后没有活动给他办。
- **故事概述：** 陈为业绩与四千元预期分成先垫六万八。第二夜跨部门待付与包干草单使个人催款变成公司资金问题；案后再核经营成本、地推指标和押金关联往来。
- **悬念：** 以前人人抢着先垫，这次几个部门都收不回钱。主管说月底统一结，可公司拿什么结？
- **线索物件：** 六万八刷卡记录、过往超额结算、旧立项页、跨部门待付受理页和八万包干草单

## 夜 A：第一次来电

**咨询者：** 主播，叫我小陈就行。我想问个工作上的事。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 嗯，你说。

#### 舞台标记

- **mood：** listening

**咨询者：** 我替公司垫了六万八，一个月了，还没报下来。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 钱花哪儿了？

#### 舞台标记

- **mood：** listening

**咨询者：** 用我的信用卡刷的。这个月还款账单都出了，钱还没回来。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 我问你用在哪了。

#### 舞台标记

- **mood：** listening

**咨询者：** 招商会的场地和礼品。场地四万八，礼品两万。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 那你催过吗？

#### 舞台标记

- **mood：** listening

**咨询者：** 我差点在公司群里问：公司报销什么时候能下来？可我没敢发。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 群里不敢发，你是怕得罪谁？

#### 舞台标记

- **mood：** listening

**咨询者：** 怕影响后续给我活动。这次城市合伙人的招商会是我刚争来的。一发出去，以后铁定不让我碰客户活动了。

#### 舞台标记

- **mood：** thinking

**林旭阳：** 六万八是谁让你垫的？没批，还是你自己先刷的？

#### 舞台标记

- **mood：** listening

**咨询者：** 主管私聊让我先垫，说活动批了，费用单他来补。

#### 舞台标记

- **mood：** thinking

### 夜 A · 1｜work-title-for-advance

**咨询者：** 小会上，我争着接了这场招商会。主管说谁先把场地和礼品的钱垫上，客户就归谁跟。我刷了六万八，现在卡账单都来了，他还叫我等。报销单是他给我填的，写了八万。我问什么时候能下来，他就说流程在走。

#### no Clue Reaction

**咨询者：** 我先说能做活动，垫钱是他后来私聊提的。

- **interaction Mode：** lineReplay
- **线索职能：** setup
- **错误框架：** 他只是为了业绩争取一次活动，垫款是临时被塞来的负担。
#### 回收目标

- work-private-process
- work-split-ownership

- **说话人 ID：** chen
- **现场疑点：** 先垫钱的人为什么能拿到主办机会？
- **矛盾：** 主管按谁先垫钱分配活动，陈愿意接受这一惯例。
- **可靠度：** mixed
#### 自由追问

##### 1. work title for advance:casual Questions:0

**林旭阳：** 会上说能接的时候，他有没有当场定是你办？

**咨询者：** 会上就点了个头，没当场定人。散会才私聊我。

- **source Anchor：** 小会上
- **内部 ID：** work-title-for-advance:casualQuestions:0

##### 2. work title for advance:casual Questions:1

**林旭阳：** 他私聊让你先垫的时候，有没有说钱什么时候能报回来？

**咨询者：** 只说这场交给我。什么时候付，他当时没给日子。我信他会办，才刷的卡。

- **source Anchor：** 主管说
- **内部 ID：** work-title-for-advance:casualQuestions:1

##### 3. work title for advance:question Options:1

**林旭阳：** 六万八的数，是你刷卡前就知道的？

**咨询者：** 知道，报价发给我了。我嫌贵，但还是想接。这么大的活动以前轮不到我。

- **source Anchor：** 场地和礼品的钱
- **玩家所选怀疑方向：** 答应时知道多少
- **路线轴：** money-flow
- **路线口气：** neutral
- **内部 ID：** work-title-for-advance:questionOptions:1

#### 关键追问

##### 1. work title for advance:invoice gap

**林旭阳：** 你实际垫了六万八，单子怎么填成八万？

**咨询者：** 主管让我把手上别的票也凑进去，说这场按八万报。我说这些又不是这次活动花的，他说票够就行，以前都这么办。

- **source Anchor：** 报销单是他给我填的，写了八万
- **玩家所选怀疑方向：** 你实际垫了六万八，单子怎么填成八万？
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** trust-but-verify
- **矛盾：** 为争活动接受先垫款，还在信用卡额度不足时申请提额。
###### logic Contract

- **premise Anchor：** 报销单是他给我填的，写了八万
- **source Kind：** caller-statement
- **source Proves：** 报销单是他给我填的，写了八万
- **source Does Not Prove：** 尚未取得公司全部账目。
- **answer Anchor：** 主管让我把手上别的票也凑进去，说这场按八万报。我说这些又不是这次活动花的，他说票够就行，以前都这么办。
- **answer Adds：** 主管让我把手上别的票也凑进去，说这场按八万报。我说这些又不是这次活动花的，他说票够就行，以前都这么办。
- **next Legal Question：** 核对已出现的款项与原始单据。

- **内部 ID：** work-title-for-advance:invoice-gap

##### 2. work title for advance:question Options:0

**林旭阳：** 六万八不是小数，你当时怎么凑出来的？

**咨询者：** 信用卡啊，额度还不够，我又申请了临时提额。上一场都结了，我想着这回也就是周转几天。

- **source Anchor：** 我刷了六万八
- **玩家所选怀疑方向：** 六万八不是小数，你当时怎么凑出来的？
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** trust-but-verify
- **矛盾：** 为争活动接受先垫款，还在信用卡额度不足时申请提额。
###### logic Contract

- **premise Anchor：** 我刷了六万八
- **source Kind：** caller-statement
- **source Proves：** 主管提出先垫场地和礼品费，来电人已说六万八不是随手能拿出的数额。
- **source Does Not Prove：** 口述与现有单据不说明公司全部账目或最终追回金额。
- **answer Anchor：** 申请了临时提额
- **answer Adds：** 他刷信用卡并申请临时提额，按上一场已结的经历预期短期报回。
- **next Legal Question：** 沿已出现的款项、经手人和原始材料继续核对。

- **内部 ID：** work-title-for-advance:questionOptions:0

#### 压力表演

- **意图钩子：** 他把争活动说成临时接手
- **防备状态：** tense

- **音频提示：** voice.case4.pad-message
#### question Sequence

- work-title-for-advance:invoice-gap
- work-title-for-advance:questionOptions:0

#### 场尾自动拍

##### lines

###### 1. lines 1

**林旭阳：** 先看看八万里都填了什么。

#### closure Contract

- **entry Anchor：** 写了八万
- **closer Anchor：** 八万里都填了什么
- **adds：** 陈实际刷卡六万八，按主管要求用额外票据凑到八万申报。
- **open Edge：** 多出的一万二如何分配。
- **route Independent：** true

### 夜 A · 2｜work-private-process

**林旭阳：** 多出来这一万二，他说怎么算？

**咨询者：** 他给我发过分配表，说不会让我白忙。单子上那一万二写的是外部协调费。我以为跟以前一样，报下来再分就行。上回主办也给我看过到账。

【材料触发后的重述】 **咨询者：** 报下来的比先垫的多，我是知道的。就是没把那四千当成什么见不得人的钱。

#### no Clue Reaction

**咨询者：** 业绩也要啊。可光为了业绩，哪会人人都愿意先掏钱。

- **interaction Mode：** lineReplay
- **线索职能：** reversal
- **错误框架：** 多报的部分都是正常的活动奖金。
#### 回收目标

- work-approval-only

- **说话人 ID：** chen
- **现场疑点：** 为什么垫款比只做工作更有吸引力？
- **矛盾：** 陈期待的回报不只有业绩，还包括活动支出之外的一笔私下分成。
- **可靠度：** partial
#### 段后触发

- **类型：** evidenceCheck
- **材料检视 ID：** work-budget-timeline
- **标签：** 材料板
- **next Label：** 看预算沟通
- **continue Label：** 继续听

#### 自由追问

##### 1. work private process:casual Questions:0

**林旭阳：** 上回结算有单子吗？

**咨询者：** 上回主办发给我的，还在聊天里。我把名字遮了发后台。

- **source Anchor：** 上回主办
- **内部 ID：** work-private-process:casualQuestions:0

#### 关键追问

##### 1. work private process:question Options:0

**林旭阳：** 这一万二，报下来分给谁？

**咨询者：** 分配表写的是我四千，他八千。他说我这阵子忙前忙后，四千是我应得的。

- **source Anchor：** 他给我发过分配表
- **玩家所选怀疑方向：** 这一万二，报下来分给谁？
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** trust-but-verify
- **矛盾：** 他争取活动不只为了业绩，还期待主管许诺的四千元分配；尚未到账。
###### logic Contract

- **premise Anchor：** 他给我发过分配表
- **source Kind：** caller-statement
- **source Proves：** 他给我发过分配表
- **source Does Not Prove：** 尚未取得公司全部账目。
- **answer Anchor：** 分配表写的是我四千，他八千。他说我这阵子忙前忙后，四千是我应得的。
- **answer Adds：** 分配表写的是我四千，他八千。他说我这阵子忙前忙后，四千是我应得的。
- **next Legal Question：** 核对已出现的款项与原始单据。

- **revised Source Anchor：** 报下来的比先垫的多
- **内部 ID：** work-private-process:questionOptions:0

##### 2. work private process:fee followup:1

**林旭阳：** 写的是外部协调费，外面哪家替你们做了什么？

**咨询者：** 没有另外找人。场地四万八、礼品两万，都算在六万八里了。我看上回的人也是这么报的，垫五万八，最后结了七万，自己拿四千。他还给我看过到账。

- **source Anchor：** 单子上那一万二写的是外部协调费
- **玩家所选怀疑方向：** 写的是外部协调费，外面哪家替你们做了什么？
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** trust-but-verify
- **矛盾：** 他争取活动不只为了业绩，还期待主管许诺的四千元分配；尚未到账。
###### logic Contract

- **premise Anchor：** 单子上那一万二写的是外部协调费
- **source Kind：** caller-statement
- **source Proves：** 单子上那一万二写的是外部协调费
- **source Does Not Prove：** 尚未取得公司全部账目。
- **answer Anchor：** 没有另外找人。场地四万八、礼品两万，都算在六万八里了。我看上回的人也是这么报的，垫五万八，最后结了七万，自己拿四千。他还给我看过到账。
- **answer Adds：** 没有另外找人。场地四万八、礼品两万，都算在六万八里了。我看上回的人也是这么报的，垫五万八，最后结了七万，自己拿四千。他还给我看过到账。
- **next Legal Question：** 核对已出现的款项与原始单据。

- **revised Source Anchor：** 报下来的比先垫的多
- **内部 ID：** work-private-process:fee-followup:1

##### 3. work private process:fee followup:2

**林旭阳：** 你知道这四千不是实际花出去的钱，还准备接着垫？

**咨询者：** 是，我也想拿这四千。以前都能回来，我才接的。

**林旭阳：** 钱压在你卡里，你还怕催急了得罪主管？

**咨询者：** 我就想把钱要回来，没想跟主管翻脸。以后还得在他手底下干呢。

**林旭阳：** 你现在打算怎么催？下周再让你先垫呢？

**咨询者：** 先私下问他。我还是想接下周的，前一笔能回来就接。进来才多久，我不想一催就把机会催没了。

- **source Anchor：** 说不会让我白忙
- **玩家所选怀疑方向：** 你知道这四千不是实际花出去的钱，还准备接着垫？
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** trust-but-verify
- **矛盾：** 他争取活动不只为了业绩，还期待主管许诺的四千元分配；尚未到账。
###### logic Contract

- **premise Anchor：** 说不会让我白忙
- **source Kind：** caller-statement
- **source Proves：** 报下来的比先垫的多
- **source Does Not Prove：** 口述与现有单据不说明公司全部账目或最终追回金额。
- **answer Anchor：** 是，我也想拿这四千。以前都能回来，我才接的。
- **answer Adds：** 是，我也想拿这四千。以前都能回来，我才接的。我就想把钱要回来，没想跟主管翻脸。以后还得在他手底下干呢。先私下问他。我还是想接下周的，前一笔能回来就接。进来才多久，我不想一催就把机会催没了。
- **next Legal Question：** 沿已出现的款项、经手人和原始材料继续核对。

- **revised Source Anchor：** 报下来的比先垫的多
- **内部 ID：** work-private-process:fee-followup:2

#### 压力表演

- **意图钩子：** 他说不会白忙
- **防备状态：** tense

#### question Sequence

- work-private-process:questionOptions:0
- work-private-process:fee-followup:1
- work-private-process:fee-followup:2

### 夜 A · 3｜work-approval-only

**林旭阳：** 这六万八刷出去以后，他拿什么让你继续等？

**咨询者：** 活动后，我把发票照片和刷卡记录都交给主管了，原件他让我先留着。他发来一张审批页，顶上写着“审批通过”。我问什么时候回来，他又发一次。第二天再问，还是它。就这一张图，他发了三次，每次都说“流程在走”。

#### no Clue Reaction

**咨询者：** 我现在就是拿不出日期。他每次只说‘在走’。

- **interaction Mode：** lineReplay
- **线索职能：** missing-edge
- **错误框架：** 过往确有超额结算到账，主管又发来通过页，这次似乎也只是排队慢。
#### 回收目标

- work-private-process

- **说话人 ID：** chen
- **现场疑点：** 页面顶端确实写着审批通过，但被批准的是哪一类单据还没有核清。
- **矛盾：** 同一张审批页面被重复发送三次，却没有新增内容或具体到账日期。
- **可靠度：** partial
#### 自由追问

##### 1. work approval only:casual Questions:0

**林旭阳：** 你问什么时候回来，他三次都发同一张。有没有一次写过哪天付？

**咨询者：** 没有。每次都是那张“审批通过”，没日子。卡账单已经来了，我才越来越慌。

- **source Anchor：** 审批通过
- **内部 ID：** work-approval-only:casualQuestions:0

##### 2. work approval only:casual Questions:2

**林旭阳：** 以前垫打车费，第二天就能报。这次他三次发同一张图，有没有一张是付款回单？

**咨询者：** 没有。这么大一笔我是第一次垫。以前最多垫过打车费，第二天就能报。

【停顿】

**咨询者：** 这次六万八，他还是那张旧图。

- **source Anchor：** 活动后
- **内部 ID：** work-approval-only:casualQuestions:2

#### 关键追问

##### 1. work approval only:question Options:0

**林旭阳：** 你问的是付款，他一直发旧图。财务受理了没有，你直接问过吗？

**咨询者：** 没问过。不是找不到财务……主管说他统一报，我怕绕过他，这四千也不好再提。

- **source Anchor：** 就这一张图，他发了三次
- **玩家所选怀疑方向：** 你问的是付款，他一直发旧图。财务受理了没有，你直接问过吗？
- **矛盾：** 同一张页面被重复发送三次，却没有新增进度信息。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** pressure-point
###### logic Contract

- **premise Anchor：** 就这一张图，他发了三次
- **source Kind：** caller-statement
- **source Proves：** 三次发送的审批页没有新增内容。
- **source Does Not Prove：** 单凭同图不能判断公司是否受理费用。
- **answer Anchor：** 没问过。不是找不到财务…
- **answer Adds：** 他有财务的工作号，却因主管掌握分成而只催主管。
- **next Legal Question：** 同图反复发送已足以质疑主管借流程拖延；继续问谁经手、哪里能查到新进展，再核财务受理，不把旧审批当作停问理由。

- **内部 ID：** work-approval-only:questionOptions:0

#### 压力表演

- **意图钩子：** 负责人署名压着垫款风险
- **防备状态：** guarded

#### question Sequence

- work-approval-only:questionOptions:0

#### 场尾自动拍

##### lines

###### 1. lines 1

**林旭阳：** 把他发你的原页给我看看。

###### 2. lines 2

【小陈将主管发来的活动审批原页传到后台。】

#### 段后触发

- **类型：** evidenceCheck
- **材料检视 ID：** work-approval-missing
- **标签：** 核对审批原页
- **continue Label：** 继续

#### closure Contract

- **entry Anchor：** 把他发你的原页给我看看
- **closer Anchor：** 把他发你的原页给我看看
- **adds：** 主播当面索取主管的审批原页，小陈传来后立即核对单据类型。
- **open Edge：** 审批原页是否包含费用受理和付款信息。
- **route Independent：** true

### 中段立场快照

- **段后触发：** 2
- **kicker：** 接着问
- **提示题：** 你现在最想往哪边问？
- **说明：**
- **after Pick Line：** 那这回钱刷出去以后，主管怎么回你的？
- **continue Label：** 继续听
- **recap Kicker：** 这次问到的事
#### 选项

##### 1. 活动给谁办，就看谁愿意先垫钱？

- **内部 ID：** respondent-problem
- **标签：** 活动给谁办，就看谁愿意先垫钱？
- **摘要：** 活动给谁办，就看谁愿意先垫钱？
- **反馈：** 谁能垫钱，活动就归谁。我以前看他们都这么办。
- **recap：** 活动给谁办，就看谁愿意先垫钱？
- **主播回应：** 谁能垫钱，活动就归谁。我以前看他们都这么办。
- **closing Title：** 垫款与活动分配
###### callback Lines

###### 1. callback Lines 1

**咨询者：** 昨天你问活动怎么分，我也找以前做过的人聊了。

##### 2. 上一场多出来的一万二，后来怎么分的？

- **内部 ID：** caller-complicit
- **标签：** 上一场多出来的一万二，后来怎么分的？
- **摘要：** 上一场多出来的一万二，后来怎么分的？
- **反馈：** 他拿四千，主管八千。我就是听他这么说，才觉得这次也能拿到。
- **recap：** 上一场多出来的一万二，后来怎么分的？
- **主播回应：** 他拿四千，主管八千。我就是听他这么说，才觉得这次也能拿到。
- **closing Title：** 旧结算与这次垫款
###### callback Lines

###### 1. callback Lines 1

**咨询者：** 上次那份结算我带着呢，这次的单子也拿到了。

##### 3. 你这次的报销，现在办到哪一步了？

- **内部 ID：** unclear
- **标签：** 你这次的报销，现在办到哪一步了？
- **摘要：** 你这次的报销，现在办到哪一步了？
- **反馈：** 我手上只有立项那张图。具体到财务哪一步，我还得去问。
- **recap：** 你这次的报销，现在办到哪一步了？
- **主播回应：** 我手上只有立项那张图。具体到财务哪一步，我还得去问。
- **closing Title：** 这次报销停在哪一步
###### callback Lines

###### 1. callback Lines 1

**咨询者：** 昨天说要找财务对一下，我去问过了。

### 第一次收麦

**咨询者：** 我把那三张图找齐。明天直接问财务，再问问以前办过的人。

#### 舞台标记

- **after Scene Index：** 2
- **主播台词：** 这张立项图可看不出来什么，得有更细节的账目才能看出来问题。财务怎么回的，明晚跟我说。
- **stage Direction：** 他那头传来翻相册的声音，随后只剩忙音。
- **音频提示：** sfx.phone.busy

## 收麦幕间：控台短查

### 幕间行动

- **标题：** 收麦后·控台短查
- **kicker：**
- **budget：** 0
- **min Actions：** 0
- **max Actions：** 0
- **continue Label：** 进入白天调查
#### actions

##### 1. 核对单据类型

- **内部 ID：** recheck-approval-page
- **标签：** 核对单据类型
- **摘要：** 再看一遍“审批通过”批的到底是哪张单。
- **cost：** 0
- **类型：** evidencePass
###### 授予库存

- approval-page-reviewed

###### focus Check Ids

- work-approval-missing

- **read Only After Call：** true

##### 2. 陈补来的工作群通知

- **内部 ID：** leader-interrupt
- **声纹卡 ID：** case4-leader
- **标签：** 陈补来的工作群通知
- **摘要：** 收麦后，陈从工作群转来领导刚发的通知。
- **cost：** 0
- **类型：** interruptToast
- **npc Verb：** interrupt
- **from：** 领导通知（陈转发）
二十九号，下周一照常排下一轮活动。各部门按包干额度先顶，旧费用月底一起处理。

###### 授予库存

- leader-note-hot

- **flow Mode：** linear

## 白天调查

- **白天开场：** 今早，你把小陈发来的单据转给周会计。小陈也约了以前做地推、已经辞职的同事，下午私下聊聊。你桌上的手机响了，是周会计回电话。
- **白天行动预算：** 0
- **最少白天场景：** 4
- **session Mode：** private-consultation
### 地点 1

- **内部 ID：** day-work-finance-window
- **标签：** 工作室·周会计回电话
- **舞台背景：** day-studio
- **类型：** studio
#### 场景正文

- **access：** 周会计长期帮工作室记账，应主播请求看已收到的审批页；不在栖行任职，不查其内部记录。
你把立项截图发给周会计，问小陈拿这张能不能催报销。他忙完手头的账，给你回了电话。

- **路线轴：** money-flow
##### cast

- 周会计
- 你

##### 场景节拍

###### 1. rhythm beat 0

**周会计：** 老林，你发的图我看了。昨晚问受理号是对的。他今天去查，就带刷卡日期和金额，别重新报一遍。

#### 舞台标记

- **内部 ID：** rhythm-beat-0

###### 2. rhythm beat 1

**你：** 谢了。我让他把费用单和财务的回复一起带回来。

#### 舞台标记

- **内部 ID：** rhythm-beat-1

###### 3. rhythm beat 2

**周会计：** 让他把财务要补什么也记下来。卡在哪一步、找谁补，别只带回来一句等通知。

#### 舞台标记

- **内部 ID：** rhythm-beat-2

###### 4. rhythm beat 3

**你：** 好。晚上听听他到底问到了什么。

#### 舞台标记

- **内部 ID：** rhythm-beat-3

##### earned Item Ids

- 财务窗口补报销要求
- 立项单号拒查记录

- **获得物件：** 财务窗口补报销要求
- **source Note：** 今早你把现有单据转给周会计，现在接起他的回电。

### 地点 2

- **内部 ID：** day-work-supplier-visit
- **标签：** 工作室·小陈约来的前地推同事
- **舞台背景：** day-studio
- **类型：** studio
#### 场景正文

- **access：** 小陈联系以前一起做过活动、现已辞职的地推同事，邀请其私下语音。对方只谈自己的工作经历。
下午，小陈拉起三人语音，说这是以前一起摆过展台的同事，上个月辞职了。对方刚下班，接通后先问小陈那笔垫款回来没有。

- **路线轴：** external-corroboration
##### cast

- 前地推同事
- 你
- 小陈

##### 场景节拍

###### 1. work ground 0

**前地推同事：** 还没回来啊？我走之前你就说快了。我现在下班能准点走，真不想回去。

#### 舞台标记

- **内部 ID：** work-ground-0

###### 2. work ground 1

**你：** 你以前也是做招商会的？

#### 舞台标记

- **内部 ID：** work-ground-1

###### 3. work ground 2

**前地推同事：** 主要地推，摆展台拉人注册。他们天天盯新增，每个人都有指标，晚上还在群里排谁拉了多少。

#### 舞台标记

- **内部 ID：** work-ground-2

###### 4. work ground 3

**你：** 新增用户跟你们工资挂钩？

#### 舞台标记

- **内部 ID：** work-ground-3

###### 5. work ground 4

**前地推同事：** 有底薪，奖金看你推出去多少用户。光注册不行，交了押金才算。没达标就继续出去跑。

#### 舞台标记

- **内部 ID：** work-ground-4

###### 6. work ground 5

**小陈：** 对，我们也天天报这个数。

#### 舞台标记

- **内部 ID：** work-ground-5

###### 7. work ground 6

**你：** 用户用了多少次，有没有人付租金，也考核吗？

#### 舞台标记

- **内部 ID：** work-ground-6

###### 8. work ground 7

**前地推同事：** 我那组就盯拉新。免费券一把一把发，先把人拉进来。到后面天天加指标，我实在干不下去了。

#### 舞台标记

- **内部 ID：** work-ground-7

###### 9. work ground 8

**你：** 你们垫的钱还没结，又一直加拉新指标。陈，晚上把财务的回复拿来，咱们一起看。

#### 舞台标记

- **内部 ID：** work-ground-8

##### earned Item Ids

- 前同事地推经历

- **获得物件：** 前同事地推经历
- **source Note：** 小陈约来的前地推同事，在三人私下语音中谈自己在职时的工作。

### 地点 3

- **内部 ID：** day-work-breakroom-observe
- **标签：** 工作室·小陈拉来的前同事
- **舞台背景：** day-studio
- **类型：** studio
#### 场景正文

- **access：** 陈把连线转给月初离职的原部门助理，并问是不是当时没通知报备要求。她为澄清自己职责接受私下语音，只提供离职前亲自发过的通知和留存预算页，没有当前系统权限。
下午，小陈又拉起一通三人语音，你和他一起接通前同事。这位前同事原来做部门助理，月初已经离职。刚接通，她就抱怨了几句以前天天被催着转通知的事。小陈问起报备要求，她翻出了当时发给他的通知原图。

- **路线轴：** process-control
##### cast

- 原部门助理
- 你
- 小陈

##### 场景节拍

###### 1. day work breakroom observe:reason

**原部门助理：** 小陈，我月初就走了。走了还老有人来问。通知我当时发给你了，旧消息还在，你看日期。

#### 舞台标记

- **内部 ID：** day-work-breakroom-observe:reason

###### 2. day work breakroom observe:beat:0

**你：** 主办为什么都要先垫？

#### 舞台标记

- **内部 ID：** day-work-breakroom-observe:beat:0

###### 3. day work breakroom observe:beat:1

**原部门助理：** 当时就是谁能垫钱，活动就归谁。费用让各部门主管并起来报。

#### 舞台标记

- **内部 ID：** day-work-breakroom-observe:beat:1

###### 4. day work breakroom observe:beat:2

**你：** 八万是陈这一个人的额度？

#### 舞台标记

- **内部 ID：** day-work-breakroom-observe:beat:2

###### 5. day work breakroom observe:beat:3

**原部门助理：** 是这一场的部门包干预算。主办实际花了多少，还得附单。

#### 舞台标记

- **内部 ID：** day-work-breakroom-observe:beat:3

###### 6. day work breakroom observe:beat:4

**你：** 多出来的怎么处理？

#### 舞台标记

- **内部 ID：** day-work-breakroom-observe:beat:4

###### 7. day work breakroom observe:beat:5

**原部门助理：** 那你还不如当面问他。

#### 舞台标记

- **内部 ID：** day-work-breakroom-observe:beat:5

###### 8. day work breakroom observe:beat:6

**你：** 陈，你把主管给你填的单子找出来再看一眼。

#### 舞台标记

- **内部 ID：** day-work-breakroom-observe:beat:6

###### 9. day work breakroom observe:beat:7

**原部门助理：** 对，我只负责转发走流程，具体细节真别问我。

#### 舞台标记

- **内部 ID：** day-work-breakroom-observe:beat:7

###### 10. day work breakroom observe:finance followup

**你：** 陈，你记得再找财务的人对一下，看看主管交上去的单子到底怎么填的。晚上咱们单独聊。

#### 舞台标记

- **内部 ID：** day-work-breakroom-observe:finance-followup

##### earned Item Ids

- 茶水间立项缺口
- 茶水间责任对照

- **获得物件：** 茶水间立项缺口
- **source Note：** 小陈拉起的三人语音；前部门助理翻出自己发过的通知和留存的预算页。

### 地点 4

- **内部 ID：** day-work-payment-ledger
- **标签：** 后台·昨夜交来的垫款记录
- **舞台背景：** day-document
- **类型：** document
#### 场景正文

- **access：** 前五条由陈和前主办授权提供；第二夜的新材料尚未收到。
- **document Id：** case4-payment-ledger
- **路线轴：** money-flow
- **获得物件：** 她整理的报销时间线
- **source Note：** 小陈交来自己的垫款记录，也转来上一场主办补发的实支与到账页；对方要求把自己先垫的钱一起说明。

### 幕间物件映射

- **approval page reviewed：** 立项页不是报销单
- **leader note hot：** 领导批注

## 夜 B：单独咨询

- **收麦锚点：** 发了三次
- **收麦舞台：** 他那头传来翻相册的声音，随后只剩忙音。
- **hangup Audio Cue Id：** sfx.phone.busy
- **主播留话：** 这张立项图可看不出来什么，得有更细节的账目才能看出来问题。财务怎么回的，明晚跟我说。
### 回拨衔接

#### lines

##### 1. lines 1

**林旭阳：** 就咱们两个人，你慢慢说。

### 回拨立场

- **against Caller：** 我承认想多拿四千。可六万八现在压在卡里，也是真的。
- **with Caller：** 今天拿到新的受理页了，你看完再问我。

### 夜 B · 1｜work-leader-note

**林旭阳：** 后来问到新的情况了吗？

**咨询者：** 问到了。早上我拿日期和金额去查，六万八登记着，付款日期还是待通知。财务问我外部协调的一万二给谁，我一下没答上来。中午找运营部的姐姐问，她也没收到，维修那边也有。下午她们把各自的受理页发过来，连几千块的物料费都挂着。可主管私下还说会优先办我的，让我别跟着起哄。我是真不信他了。下周又排了活动，我拿什么继续垫？

#### no Clue Reaction

**咨询者：** 我今天才知道她们也在催。昨晚还觉得催快一点就轮到我了。

- **interaction Mode：** lineReplay
- **线索职能：** misdirect
- **错误框架：** 别人的材料也有问题，所以仍只是各自补单。
#### 回收目标

- work-split-ownership

- **说话人 ID：** chen
- **现场疑点：** 多个部门同时未付款，不能只沿主管与小陈的关系解释。
- **矛盾：** 跨部门已有受理且无补件要求的费用仍在等待付款。
- **可靠度：** partial
#### 自由追问

##### 1. work leader note:casual Questions:0

**林旭阳：** 她们怎么知道你也被欠着？

**咨询者：** 我中午找她问怎么催，她把维修那位也拉进来了。三个人一报数，谁也没安慰成谁。

- **source Anchor：** 中午找运营部的姐姐问
- **内部 ID：** work-leader-note:casualQuestions:0

##### 2. work leader note:casual Questions:1

**林旭阳：** 这些受理页能给我看吗？

**咨询者：** 她们同意了，姓名和账号都遮了，只留部门、金额和状态。

- **source Anchor：** 受理页
- **内部 ID：** work-leader-note:casualQuestions:1

##### 3. work leader note:question Options:1

**林旭阳：** 以前她们也给公司垫过钱？

**咨询者：** 运营那个姐姐办过好几场，之前都报了。这次她拿自己的旧到账记录跟新单号挨个对，越对越慌。

- **source Anchor：** 运营部
- **玩家所选怀疑方向：** 其他人的垫款经历
- **路线轴：** money-flow
- **路线口气：** neutral
- **内部 ID：** work-leader-note:questionOptions:1

##### 4. work leader note:review Probes:0

**林旭阳：** 其他部门的垫款，是这次问同事才知道的？

**咨询者：** 对，之前我不知道。

- **内部 ID：** work-leader-note:reviewProbes:0
- **source Anchor：** 下午她们把各自的受理页发过来
- **路线口气：** neutral

#### 关键追问

##### 1. work leader note:question Options:0

**林旭阳：** 主管说优先办你的，财务给你定了哪天付款？

**咨询者：** 没定，受理页还是待通知。主管让我先别催财务，说他去打招呼。我想着下周还得跟他干，就没再追问。

**林旭阳：** 把你和她们的受理页放一起，看财务究竟回了什么。

- **source Anchor：** 主管私下还说会优先办我的
- **玩家所选怀疑方向：** 主管说优先办你的，财务给你定了哪天付款？
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** trust-but-verify
- **矛盾：** 其他部门提供了财务受理页，需按页核对费用状态。
###### logic Contract

- **premise Anchor：** 主管私下还说会优先办我的
- **source Kind：** caller-statement
- **source Proves：** 主管私下承诺优先，但受理页仍待通知。
- **source Does Not Prove：** 口述与现有单据不说明公司全部账目或最终追回金额。
- **answer Anchor：** 没定，受理页还是待通知
- **answer Adds：** 没定，受理页还是待通知。主管让我先别催财务，说他去打招呼。我想着下周还得跟他干，就没再追问。
- **next Legal Question：** 比较三个部门的受理与待付状态，追主管优先承诺的依据。

- **内部 ID：** work-leader-note:questionOptions:0

#### 压力表演

- **意图钩子：** 别的部门也没有付款日期
- **防备状态：** tense

#### question Sequence

- work-leader-note:questionOptions:0

### 场间实时反压

- **内部 ID：** work-group-repayment-message
- **类型：** interruptToast
- **cost：** 0
- **after Scene Index：** 3
- **from：** 陈的工作群消息
#### supersedes Choice Ids

- read-before-ad
- mute-for-ad

#### lines

##### 1. lines 1

**咨询者：** 工作群刚弹出一条，是他说的。我念给你听吧。

##### 2. lines 2

**咨询者：** “各部门别单独催，费用月底一起结算，下周活动照常。谁能垫钱，活动就归谁。”

##### 3. lines 3

**林旭阳：** 月底结算，那具体哪天到账？他写了吗？

##### 4. lines 4

**咨询者：** 没写。他撤回了，还好截图截到了。

### 场间实时反压

- **内部 ID：** work-private-warning-voice
- **类型：** interruptToast
- **cost：** 0
- **after Scene Index：** 3
- **from：** 主管私聊语音
#### lines

##### 1. lines 1

**咨询者：** 主管又发语音了。

##### 2. lines 2

【他把手机贴近麦克风。】

##### 3. lines 3

**主管（语音）：** 你跟财务说六万八就行，八万草单别往大群发。以后还要不要活动了？

#### 舞台标记

- **声纹卡 ID：** case4-colleague

##### 4. lines 4

**咨询者：** 你听听，我催个钱，他又拿以后的活动压我。

##### 5. lines 5

**林旭阳：** 他提到八万草单了，把那页也打开。

### 夜 B · 2｜work-split-ownership

**咨询者：** 活动负责人写的是我，付款经办人写的是他。今天三个人把受理页放到一起，都还没收到钱。

- **interaction Mode：** testimonyWall
- **线索职能：** payoff
- **错误框架：** 别人也许没补齐手续，主管答应优先，自己仍能先拿到钱。
#### 回收目标

- work-title-for-advance
- work-leader-note

- **说话人 ID：** chen
#### testimony Wall

- **标题：** 不止他这一笔
- **引子：** 选择原话与材料后出示。
- **split After：** 3
- **mid Summary：**
- **soft Anchor Response：** 已选材料
##### miss Feedback

###### evidence

- 他问：“你说的是这张？这张怎么了？”
- 他说：“你拿这个问，我也不知道怎么回答。”

###### statement

- 他说：“我就是这么听来的。”
- 他问：“这句有什么问题？你说明白。”

##### statements

###### 1. 原话

- **内部 ID：** work-process-complete
- **标签：** 原话
立项和报销不是一回事，我知道了。可她们那几笔会不会也是手续没补完？

- **press Response：** 我想着各自补齐了，就能各自拿钱。
- **present Response：** 已选材料

###### 2. 原话

- **内部 ID：** work-three-screenshots
- **标签：** 原话
他发给我的还是那张旧立项页。财务今天给的受理页，我以前没见过。

- **press Response：** 我催了三回，他都没把新单号给我。
- **present Response：** 已选材料

###### 3. 原话

- **内部 ID：** work-title-matters
- **标签：** 原话
这回主办是我，下回还得他分。我也不想把他彻底得罪了。

- **press Response：** 他管活动，我还在他下面做事。
- **present Response：** 已选材料

###### 4. 原话

- **内部 ID：** work-payment-handler-other
- **标签：** 原话
活动负责人写的是我，付款经办人写的是他。费用草单也是他交的。

- **press Response：** 我交了发票照片和刷卡记录，八万的草单是他填的。
- **present Response：** 已选材料

###### 5. 原话

- **内部 ID：** work-unsent-group-message
- **标签：** 原话
我想先让主管把我这笔办掉，其他部门的事她们自己催。

- **press Response：** 三个人一起等，难道就能快一点？
- **present Response：** 已选材料

##### acts

###### 1. 不止他这一笔

- **内部 ID：** act1
- **标题：** 不止他这一笔
- **wink Line：**
- **wink Tier：** tier3-accomplice
- **引子：** 选择原话与材料后出示。
- **split After：** 3
- **mid Summary：**
- **soft Anchor Response：** 已选材料
###### statements

###### 1. 原话

- **内部 ID：** work-process-complete
- **标签：** 原话
立项和报销不是一回事，我知道了。可她们那几笔会不会也是手续没补完？

- **press Response：** 我想着各自补齐了，就能各自拿钱。
- **present Response：** 已选材料

###### 2. 原话

- **内部 ID：** work-three-screenshots
- **标签：** 原话
他发给我的还是那张旧立项页。财务今天给的受理页，我以前没见过。

- **press Response：** 我催了三回，他都没把新单号给我。
- **present Response：** 已选材料

###### 3. 原话

- **内部 ID：** work-title-matters
- **标签：** 原话
这回主办是我，下回还得他分。我也不想把他彻底得罪了。

- **press Response：** 他管活动，我还在他下面做事。
- **present Response：** 已选材料

###### 4. 原话

- **内部 ID：** work-payment-handler-other
- **标签：** 原话
活动负责人写的是我，付款经办人写的是他。费用草单也是他交的。

- **press Response：** 我交了发票照片和刷卡记录，八万的草单是他填的。
- **present Response：** 已选材料

###### 5. 原话

- **内部 ID：** work-unsent-group-message
- **标签：** 原话
我想先让主管把我这笔办掉，其他部门的事她们自己催。

- **press Response：** 三个人一起等，难道就能快一点？
- **present Response：** 已选材料

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** case4-department-ledger:q06
- **statement Id：** work-process-complete
###### material Cards

###### 1. 运营和维修的待付受理页

- **内部 ID：** case4-department-ledger:q06
- **类型：** 其他部门受理页
- **标签：** 运营和维修的待付受理页
- **excerpt：** 运营 ¥42,000；维修 ¥9,600；补件要求：无；状态：待付款；付款日期：待通知
- **source Label：** 第二夜收到的受理页与包干明细

###### 2. 六万八已登记，付款待通知

- **内部 ID：** case4-department-ledger:q07
- **类型：** 本场费用受理页
- **标签：** 六万八已登记，付款待通知
- **excerpt：** 已登记实际垫款 ¥68,000；发票照片及刷卡记录已收；原件后补；协调费 ¥12,000 待解释；付款日期：待通知
- **source Label：** 第二夜收到的受理页与包干明细

###### 3. 八万费用草单与分配附注

- **内部 ID：** case4-department-ledger:q08
- **类型：** 主管发给陈的分配附注
- **标签：** 八万费用草单与分配附注
- **excerpt：** 交财务的草单：场地 ¥48,000；礼品 ¥20,000；外部协调 ¥12,000；外部服务方及工作记录未填。主管另发的分配表：陈 ¥4,000；主管 ¥8,000。
- **source Label：** 第二夜收到的受理页与包干明细

- **咨询者台词：** 真不用补啊？那这两笔到底在等什么？我这笔还说要补原件。
- **主播台词：** 财务跟你提过优先付款吗？
- **boundary Line：** 多个部门均无补件要求，付款日期仍待通知。
- **矛盾：** 多个部门无补件要求仍待付款，不能把欠款都归结为个人手续遗漏。
- **路线轴：** process-control
- **continue Label：** 听他说公司的安排
- **outcome Kind：** contradiction

###### miss Feedback

###### evidence

- 他问：“你说的是这张？这张怎么了？”
- 他说：“你拿这个问，我也不知道怎么回答。”

###### statement

- 他说：“我就是这么听来的。”
- 他问：“这句有什么问题？你说明白。”

###### inquiry

###### opening Lines

###### 1. opening Lines 1

**林旭阳：** 你那六万八登记了。再看运营和维修这两张，财务有没有叫她们补材料？

###### 2. opening Lines 2

**咨询者：** 我没细看她们缺什么。我就想知道，我这笔到底哪天能下来。

###### 选项

###### 1. act1 ask

- **内部 ID：** act1-ask
- **主播问句：** 这两张都写着不用补件。手续已经齐了，怎么也没付？
- **是否核心项：** true
###### lines

###### 1. lines 1

**咨询者：** 真不用补啊？那这两笔到底在等什么？我这笔还说要补原件。

###### 2. lines 2

**林旭阳：** 财务跟你提过优先付款吗？

###### 3. lines 3

**咨询者：** 财务没说优先。是主管自己跟我保证的。

###### 4. lines 4

**林旭阳：** 那不还是主管嘴上说的吗？下周他再叫你垫，你怎么办？

###### 5. lines 5

**咨询者：** 现在肯定不垫。他说能先办，我就等着看钱到底到不到。

###### 6. lines 6

**林旭阳：** 你看，自己的费用里多填了一万二，其他部门手续齐了也拿不到钱。下午那位前同事还说，天天加拉新指标，交押金才算数。这公司的账目有问题，你不能再往里垫了。

###### 7. lines 7

**咨询者：** 那我现在怎么办？六万八总不能不要了。

###### 8. lines 8

**林旭阳：** 当然要。现在就把实际垫款要回来，别再接垫资的活，这份工作也尽快辞了。不是他说月底结，你就再替他撑一个月。

###### 2. act1 miss 1

- **内部 ID：** act1-miss-1
- **主播问句：** 主管说已经打过招呼。财务那栏有没有留下他催付的记录？
- **是否核心项：** false
###### lines

###### 1. lines 1

**咨询者：** 没有。我只听他说打过，财务页上什么都没写。

- **supplementary：** true

###### 3. act1 miss 2

- **内部 ID：** act1-miss-2
- **主播问句：** 运营和维修那两笔，比你的报销交得晚吗？
- **是否核心项：** true
###### lines

###### 1. lines 1

**咨询者：** 受理时间比我早，钱也没到。我只知道主管说先办我的。

###### 2. lines 2

**林旭阳：** 比你早，材料也齐，照样没付。他答应优先，财务给过确认吗？

###### 3. lines 3

**咨询者：** 没有。财务只说等通知，我听到的优先都是主管说的。

###### 4. lines 4

**林旭阳：** 那不还是主管嘴上说的吗？下周他再叫你垫，你怎么办？

###### 5. lines 5

**咨询者：** 现在肯定不垫。他说能先办，我就等着看钱到底到不到。

###### 6. lines 6

**林旭阳：** 你看，自己的费用里多填了一万二，其他部门手续齐了也拿不到钱。下午那位前同事还说，天天加拉新指标，交押金才算数。这公司的账目有问题，你不能再往里垫了。

###### 7. lines 7

**咨询者：** 那我现在怎么办？六万八总不能不要了。

###### 8. lines 8

**林旭阳：** 当然要。现在就把实际垫款要回来，别再接垫资的活，这份工作也尽快辞了。不是他说月底结，你就再替他撑一个月。

###### opener Lines

###### 1. opener Lines 1

**林旭阳：** 你那六万八登记了。再看运营和维修这两张，财务有没有叫她们补材料？

###### 2. opener Lines 2

**咨询者：** 我没细看她们缺什么。我就想知道，我这笔到底哪天能下来。

- **revised Frame：** 多报的协调费、齐件仍待付款，与前同事描述的拉新压力放在一起。主播建议追讨实际垫款、停止垫资并离职。

- **wink Line：**
- **revision：** remaining-edits-2026-09-19
##### previous Act Orders

###### shameless 2026 09 19

- act2
- act1

#### decisive Present

- **max Attempts：** 2
- **evidence Id：** case4-department-ledger:q06
- **statement Id：** work-process-complete
##### material Cards

###### 1. 运营和维修的待付受理页

- **内部 ID：** case4-department-ledger:q06
- **类型：** 其他部门受理页
- **标签：** 运营和维修的待付受理页
- **excerpt：** 运营 ¥42,000；维修 ¥9,600；补件要求：无；状态：待付款；付款日期：待通知
- **source Label：** 第二夜收到的受理页与包干明细

###### 2. 六万八已登记，付款待通知

- **内部 ID：** case4-department-ledger:q07
- **类型：** 本场费用受理页
- **标签：** 六万八已登记，付款待通知
- **excerpt：** 已登记实际垫款 ¥68,000；发票照片及刷卡记录已收；原件后补；协调费 ¥12,000 待解释；付款日期：待通知
- **source Label：** 第二夜收到的受理页与包干明细

###### 3. 八万费用草单与分配附注

- **内部 ID：** case4-department-ledger:q08
- **类型：** 主管发给陈的分配附注
- **标签：** 八万费用草单与分配附注
- **excerpt：** 交财务的草单：场地 ¥48,000；礼品 ¥20,000；外部协调 ¥12,000；外部服务方及工作记录未填。主管另发的分配表：陈 ¥4,000；主管 ¥8,000。
- **source Label：** 第二夜收到的受理页与包干明细

- **咨询者台词：** 真不用补啊？那这两笔到底在等什么？我这笔还说要补原件。
- **主播台词：** 财务跟你提过优先付款吗？
- **boundary Line：** 多个部门均无补件要求，付款日期仍待通知。
- **矛盾：** 多个部门无补件要求仍待付款，不能把欠款都归结为个人手续遗漏。
- **路线轴：** process-control
- **continue Label：** 听他说公司的安排
- **outcome Kind：** contradiction

- **现场疑点：** 其他部门材料已齐仍未付款，主管的优先承诺没有财务确认。
- **矛盾：** 真实垫款拖欠，费用草单虚增一万二，公司仍要求个人垫资并加拉新指标。
- **可靠度：** partial
#### 自由追问

##### 1. work split ownership:casual Questions:0

**林旭阳：** 活动办完了。财务有没有给你一个付款日期，还是只让你等月底开会？

**咨询者：** 没有日期。财务写待通知。卡不会因为公司月底开会就晚扣。

- **source Anchor：** 没收到钱
- **内部 ID：** work-split-ownership:casualQuestions:0

#### 关键追问

##### 1. work split ownership:question Options:0

**林旭阳：** 其他人材料齐不齐，你看过状态没有？

**咨询者：** 受理页已经放在一起了，我跟你看。

- **source Anchor：** 都还没收到钱
- **玩家所选怀疑方向：** 其他部门的受理状态
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** trust-but-verify
- **矛盾：** 受理页已经放在一起了，我跟你看。
- **防备回答：** 一起看吧。
###### logic Contract

- **premise Anchor：** 都还没收到钱
- **source Kind：** caller-statement
- **source Proves：** 都还没收到钱
- **source Does Not Prove：** 口述与现有单据不说明公司全部账目或最终追回金额。
- **answer Anchor：** 受理页已经放在一起了，我跟你看。
- **answer Adds：** 受理页已经放在一起了，我跟你看。
- **next Legal Question：** 沿已出现的款项、经手人和原始材料继续核对。

###### 唯一核心反转过场

- **内部 ID：** case4-responsibility-split
- **类型：** reveal
- **过场短标：** 受理页翻开
- **标签：** 另外两个部门
- **visual Variant：** approval-split

- **内部 ID：** work-split-ownership:questionOptions:0

##### 2. work split ownership:question Options:1

**林旭阳：** 财务受理页上，有没有写优先付你这一单？

**咨询者：** 没有。财务只写待通知。优先是主管私下跟我说的。

- **source Anchor：** 活动负责人写的是我
- **玩家所选怀疑方向：** 优先是主管口头说的，还是财务写的
- **是否核心项：** false
- **路线轴：** money-flow
- **路线口气：** caller-skeptical
###### miss Reaction

**咨询者：** 没有。财务只写待通知。优先是主管私下跟我说的。

- **内部 ID：** work-split-ownership:questionOptions:1

#### 压力表演

- **意图钩子：** 他仍想只催自己那一笔
- **防备状态：** tense

#### 正文前节拍

##### lines

###### 1. lines 1

**咨询者：** 她们两个人同意把受理页给你看，名字已经遮了。主管那张费用草单，我也发了。

###### 2. lines 2

**林旭阳：** 先看三张受理页。你们的钱，各卡在哪儿？

###### 3. lines 3

【你把两份待付受理页与陈自己的新受理页并排打开。】

- **legacy Question Options：** true
#### 场尾自动拍

##### lines

###### 1. lines 1

**林旭阳：** 草单和分配表都交财务，六万八的刷卡记录也留好。

###### 2. lines 2

**咨询者：** 我现在就去群里问，六万八到底哪天付。下周不接了，我也不干了。

###### 3. lines 3

【他发出两条群消息：附上六万八的受理页询问付款日期，并说明不再垫款、提出离职。费用草单与分配消息一并提交。】

###### 4. lines 4

**咨询者：** 发了。群里一个都没回，平时催我倒挺快。

#### closure Contract

- **entry Anchor：** 草单和分配表都交财务
- **closer Anchor：** 发了。群里一个都没回
- **adds：** 陈提交材料催还六万八，拒绝再垫款并提出离职。
- **open Edge：** 付款日期与财务对协调费的回复。
- **route Independent：** true

### 回拨后立场

#### from Snapshot Option Ids

- **respondent problem：** open
- **caller complicit：** defensive
- **unclear：** neutral

- **default：** neutral
#### lines

- **defensive：** 我承认想多拿四千。可六万八现在压在卡里，也是真的。
- **open：** 今天拿到新的受理页了，你看完再问我。
- **neutral：** 我回来了，今天直接问了财务。

## 材料、回流与可选追查

### 证据卡

#### 1. 主管重发的审批页

- **内部 ID：** daily-work-repay-approval
- **表现类型：** 审批截图
- **标题：** 主管重发的审批页
- **front：** 状态通过，单据类型为活动立项。
- **detail：** LX-2406-018 通过于活动前一天，同图三次重发，没有费用受理号和付款回单。
##### targets

- truthWithGap

- **矛盾：** 立项通过不能说明活动后的费用已经支付。

#### 2. 先垫与结算的私聊

- **内部 ID：** daily-work-repay-chat
- **表现类型：** 群聊原话
- **标题：** 先垫与结算的私聊
- **front：** 谁先垫谁主办；上一场实支五万八、结算七万。
- **detail：** 陈承认这场先垫六万八，主管许诺按八万报，分他四千。
##### targets

- sceneHint

- **矛盾：** 陈期待的回报不只有业绩，还包括活动支出之外的一笔私下分成。

### 材料圈点

#### 1. 上一场结算单

- **内部 ID：** work-budget-timeline
##### revalues

- work-private-process

- **标题：** 上一场结算单
- **selection Mode：** priority
- **提示题：** 这张结算单里，你先问哪一处？
- **材料：** 小陈转来前主办补发的结算单与到账截页，姓名已遮盖。
##### 材料行

- 上一场实际支出｜¥58,000
- 公司结算到账｜¥70,000
- 差额列支｜协调费 ¥12,000
- 分配记录｜主办 ¥4,000；主管 ¥8,000

##### 选项

###### 1. 协调费比实际支出多出一笔

- **标签：** 协调费比实际支出多出一笔
- **是否核心项：** true
- **矛盾：** 陈期待的回报不只有业绩，还包括活动支出之外的一笔私下分成。
- **反馈：** 这四千是公司正式给主办的奖金吗？
- **人物反应：** 没有奖金通知。主管说大单都这么结。我知道自己能拿四千，就没追问名字怎么填。
- **revises Scene：** 1
- **路线轴：** caller-credibility
- **内部 ID：** work-budget-timeline:option:0
- **主播问句：** 这四千是公司正式给主办的奖金吗？

###### 2. 先垫的人拿到主办机会

- **标签：** 先垫的人拿到主办机会
- **是否核心项：** true
- **矛盾：** 主管按谁先垫钱分配活动，陈愿意接受这一惯例。
- **反馈：** 你说他们抢着办，原来连怎么分都讲好了？
- **人物反应：** 是。我没听说谁上回没拿回来，想着这次也一样。
- **路线轴：** process-control
- **内部 ID：** work-budget-timeline:option:1
- **主播问句：** 你说他们抢着办，是因为事先讲好了怎么分吗？

###### 3. 多出来的是不是场地超支

- **标签：** 多出来的是不是场地超支
- **是否核心项：** false
- **反馈：** 支出五万八、结了七万都写在这儿。多出来的那笔，先问怎么分，不是有没有办成。
- **人物反应：** 不是超支。支出五万八，结了七万。多出来的就是他们叫的协调费。
- **路线轴：** outer-thread
- **内部 ID：** work-budget-timeline:option:2
- **主播问句：** 差额一万二，是补给场地和礼品的超支吗？

- **spoken Inquiry：** true

#### 2. 这张审批批的是什么

- **内部 ID：** work-approval-missing
##### revalues

- work-approval-only

- **标题：** 这张审批批的是什么
- **提示题：** 拿到原页后，接着问什么？
- **材料：** 审批页保留了截图里能读到的字段。
##### 材料行

- 状态｜审批通过
- 审批时间｜活动前一天
- 单据类型｜活动立项
- 单据编号｜LX-2406-018
- 报销申请编号｜未显示
- 付款回单｜未显示

##### 选项

###### 1. 这张批的是立项，报销受理号拿到了吗？

- **标签：** 这张批的是立项，报销受理号拿到了吗？
- **是否核心项：** true
- **矛盾：** 截图通过的是活动立项，且没有报销申请编号，不能证明个人垫款已经进入报销流程。
- **反馈：** 这是活动前批的立项。你的六万八有没有报销受理号？
- **人物反应：** 没有。他没给过我。我明天直接问财务。
- **路线轴：** document-edge
- **内部 ID：** work-approval-missing:option:0
- **主播问句：** 这张批的是立项，报销受理号拿到了吗？

###### 2. 立项号能不能直接查付款

- **标签：** 立项号能不能直接查付款
- **是否核心项：** false
- **反馈：** 先看编号对应的单据。这是立项号，报销受理号还没看到。
- **人物反应：** 他就给了这一张，我没有别的编号。
- **路线轴：** outer-thread
- **内部 ID：** work-approval-missing:option:1
- **主播问句：** 单据编号 LX-2406-018 已经有了。按这个号，能不能直接去查付款日期？

###### 3. 这页没付款回单，财务是不是拒绝报销了？

- **标签：** 这页没付款回单，财务是不是拒绝报销了？
- **是否核心项：** false
- **反馈：** 这页只写立项通过，没有财务拒绝报销的记录。
- **人物反应：** 财务我还没问过，不能说她们拒绝了。
- **路线轴：** identity-wording
- **内部 ID：** work-approval-missing:option:2
- **主播问句：** 这页没付款回单，财务是不是拒绝报销了？

- **spoken Inquiry：** true

### 文档原件

#### 1. 垫款、结算与待付记录

**垫款、结算与待付记录**

前五行是昨夜交来的材料；第二夜的新受理页和包干明细另行加入。

- **时间格式：** relative
- **表格字段：** date（时间）；kind（来源）；party（人物／字段）；memo（原文／状态）

| 行 | 时间 | 来源 | 人物／字段 | 原文／状态 |
| --- | --- | --- | --- | --- |
| q01 | 06-25 14:05 | 部门通知 | 部门助理 | 城市招商会按场包干八万元；主办先垫，主管统一报费用；个人垫付需报备 |
| q02 | 06-25 14:22 | 主管私聊 | 活动分配 | 你先把场地和礼品费垫了，这场就交给你；费用单我补 |
| q03 | 06-26 | 刷卡记录 | 陈 | 场地 ¥48,000；礼品 ¥20,000；个人信用卡实付 ¥68,000 |
| q04 | 06-25通过；活动后重发三次 | 审批截图 | 主管提供 | 活动立项 LX-2406-018；状态：通过；费用受理及付款信息未显示 |
| q05 | 上一场，6月已结 | 前主办提供的结算单与到账截页 | 实支与结算 | 实付 ¥58,000；结算 ¥70,000；协调费 ¥12,000；主办自述分得 ¥4,000 |

- **内部 ID：** case4-payment-ledger
#### 2. 第二夜收到的受理页与包干明细

**第二夜收到的受理页与包干明细**

两位同事授权提供受理页；陈提供本场费用草单及主管发来的分配表。

- **时间格式：** relative
- **表格字段：** date（时间）；kind（来源）；party（人物／字段）；memo（原文／状态）

| 行 | 时间 | 来源 | 人物／字段 | 原文／状态 |
| --- | --- | --- | --- | --- |
| q06 | 第二夜收到 | 其他部门受理页 | 运营／维修 | 运营 ¥42,000；维修 ¥9,600；补件要求：无；状态：待付款；付款日期：待通知 |
| q07 | 第二夜财务书面回复 | 本场费用受理页 | BX-2406-027 | 已登记实际垫款 ¥68,000；发票照片及刷卡记录已收；原件后补；协调费 ¥12,000 待解释；付款日期：待通知 |
| q08 | 本场费用草单 | 主管发给陈的分配附注 | 活动包干 ¥80,000 | 交财务的草单：场地 ¥48,000；礼品 ¥20,000；外部协调 ¥12,000；外部服务方及工作记录未填。主管另发的分配表：陈 ¥4,000；主管 ¥8,000。 |
| q10 | 07-04 | 财务群通知 | 财务 | 供应商付款本月延后，具体付款日期另行通知。 |

- **内部 ID：** case4-department-ledger
##### available At

- **scene Id：** work-split-ownership
- **act：** 1

### 对方留言

- **来源：** respondent-note
- **此刻出现原因：** 主管收到财务对协调费的追问，托话给后台。
八万本来就是我们部门包干的，别的部门也这么办。他没垫之前，我就跟他说过给他四千。现在钱下不来，都成我一个人的事了？运营维修也没付，你们也看到了吧。

- **夜 B 预告：** true

### 跨案回声

#### 1. case4 flashback credit transfer

- **内部 ID：** case4-flashback-credit-transfer
- **requires Case Id：** 01-credit
- **quote：** 八万太多，我先让他把账单发来。
- **source Case Label：** 案1
上一通八万还停在转账页，这通六万八已经刷出去了。先问钱现在卡在哪一步。

## 收束与结案

- **host Wound Hook：** 也许只是他这一单没办完
### deep Followup

- **stage Judgement：** 六万八还没还，下场先垫钱的通知倒比付款日期来得快。又准备拿旧立项页顶一个月？
### quote Pick Candidates

- 就这一张图，他发了三次
- 争着接了这场招商会
- 不会让我白忙
- 活动负责人写的是我，付款经办人写的是他

### accusation Choices

#### 1. “就这一张图，他发了三次。”

- **标签：** “就这一张图，他发了三次。”
- **quote Source Scene Id：** work-approval-only
- **责任角色：** respondent
- **主播回应：** 我问什么时候付款，你给我看活动批准了。是问题看不懂，还是就没打算答？

#### 2. “争着接了这场招商会。”

- **标签：** “争着接了这场招商会。”
- **quote Source Scene Id：** work-title-for-advance
- **责任角色：** both
- **主播回应：** 自己刷六万八，才能当主办。你们这业绩，入场费还挺贵。

#### 3. “不会让我白忙。”

- **标签：** “不会让我白忙。”
- **quote Source Scene Id：** work-private-process
- **责任角色：** complainant
- **主播回应：** 四千是想拿的，六万八也是真刷的。主管答应分你的钱，几号给过准话？

#### 4. “活动负责人写的是我，付款经办人写的是他。”

- **标签：** “活动负责人写的是我，付款经办人写的是他。”
- **quote Source Scene Id：** work-split-ownership
- **责任角色：** both
- **主播回应：** 你刷六万八，他写八万。多出来的一万二，谁干的活？

### 今晚最后一句

#### 1. 原件明天补上，收件记录和付款回复留好。有消息再跟我说。

- **内部 ID：** accompany
- **标签：** 原件明天补上，收件记录和付款回复留好。有消息再跟我说。
- **主播台词：** 原件明天补上，收件记录和付款回复留好。有消息再跟我说。
##### lines

###### 1. lines 1

**咨询者：** 行，知道了。这次还不见钱，肯定跟他们完不了。

- **sequential：** true

### 正式结案

- **标题：** 抢着垫钱的人都在催款
- **结论：** 小陈刷卡六万八，主管让他用额外票据按八万申报，一万二写作外部协调费，实际约定分陈四千、主管八千。其他部门齐件仍待付款；前地推同事说公司不断加拉新指标。小陈已提交材料催款，停止垫资并提出离职。
#### 场景节拍

##### 1. 为什么抢

- **标签：** 为什么抢
以前主办拿回实际垫款，还能分到多报的一部分。

##### 2. 谁在等钱

- **标签：** 谁在等钱
运营、维修与陈的受理记录都显示待付款。

##### 3. 包干怎么花

- **标签：** 包干怎么花
协调费没有对应服务，额外分配却被说成包干惯例。继续沿费用与付款问题追下去，才能看见更大的资金缺口。

#### 已确认

- 六万八为场地和礼品实际支出，费用已受理但尚无付款日期
- 陈知道主管准备按八万报，期待其中四千元；当前额外一万二未支付
- 其他两部门受理页无补件要求仍待付款
- 小陈提交费用草单和分配表，拒绝再垫款并提出离职
- 前地推同事在小陈邀请的私下语音里说，公司按新增付押金用户计算奖金，不断加拉新指标

#### 未决

- 六万八何时归还、能追回多少
- 财务对虚增协调费的处理
- 公司经营与押金用途，案后继续核对

- **下一步：** 补交原件并留好收件记录，追讨实际垫付的六万八；离职与停止垫款的消息已发出，付款日期尚无回复。

- **story Interlude Recap：** 陈已提交草单和分配消息，拒绝继续垫款并提出离职，约定次日补原件。咨询结束后，周会计应林的请求发来栖行的公开广告、融资稿和大股东宣传册；第三天开播再提催款进展与经营结论。
- **followup Twist：** 他说收到新的付款回复就再打来。
- **分享卡标题：** 为什么大家抢着给公司垫钱？
- **分享卡正文：** 以前办完能多报一笔，这次几个部门一起等付款。
- **分享题：** 你会先问过去怎么结，还是现在谁也没收到？
- **作者真相：** 陈原来想拿业绩和额外四千，主管靠分活和费用草单控制这笔分配。现在六万八已经受理，几个部门却都在等付款。公司到底还能不能付，今晚没有答案。

## 【编剧资料】事实边界与运行规则

- **内部来电索引：** 他打来问：自己垫出的六万八还没回来；他想追钱，又怕以后再也接不到客户活动。
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

- **focused Inquiry：** true
- **compact Closing：** true

### voice Tics

#### 陈

- 呃
- 就是说

### voice Tic Arc

- **陈：** 替分成辩解时话多，决定不再垫款时直接说出自己的安排。

### drift Comments

- 他也许真是急着交差
- 以前给得痛快，就都觉得这回也能给
- 我司谁听见先垫谁跑，怎么你们反过来
- 主播喝口水吧,嗓子听着冒烟了
- 刚才谁说眉笔的,链接呢

- **来电媒介：** voice
### caller Intent Profile

- **open Goal：** 他想让主播帮忙判断如何催回六万八，又不影响主管继续分活动给他。
- **preferred Answer：** 追回实际垫款，保住活动机会，不问过去多报分成。
- **audience Tilt：** 先把自己说成争业绩又被拖款的员工。
- **protected Interest：** 追回六万八，保住业绩与主办分成，不愿一上来承认自己期待多报的四千元。
- **default Tactic：** 先讲业绩，再用以前都能到账解释抢着垫钱，最后拿部门惯例替私人分配辩护。
- **concession Limit：** 愿意承认想多拿四千，不愿把这笔称为没有对应服务的费用。
#### pain Points

##### 1. pain Points 1

- **topic：** 多报分成
- **threatens：** 暴露他并非只想争业绩。
- **first Response：** 说不会白忙。
- **after Proof：** 承认期待四千。
- **minimum Leak：** 承认见过以前到账。

##### 2. pain Points 2

- **topic：** 协调费的服务内容
- **threatens：** 包干余款的辩护失效。
- **first Response：** 说大家一直这么分。
- **after Proof：** 承认没有外部协调人。
- **minimum Leak：** 承认费用不是实际垫付。

##### 3. pain Points 3

- **topic：** 其他部门也没付款
- **threatens：** 只找主管催自己一笔的解释不够。
- **first Response：** 怀疑别人也缺手续。
- **after Proof：** 看见无补件要求仍待付款，承认问题扩大。
- **minimum Leak：** 承认同事也在催。

### 运行时长度计划

- **live Beat Count：** 5
- **material Board Count：** 2
- **backflow Count：** 0
- **truth Boundary Prompt Count：** 0
- **case Specific Pressure：** 陈为业绩与四千元预期分成先垫六万八。第二夜跨部门待付与包干草单使个人催款变成公司资金问题；案后再核经营成本、地推指标和押金关联往来。
#### what Player Does Besides Read

- 本段集中问询，问错留在本段重问
- 查阅本段原件
- 跨夜带回新材料
- 在当事人的决定处结束

### 任务画像

- **内部 ID：** audit
- **标签：** 款项卡住了
- **recommended Specialty Id：** audit
- **摘要：** 截图看着完整，钱却没落到该落的位置。

### 路线评论

#### process control

- 谁能先垫谁就能接活
- 各部门是不是一样

#### document edge

- 三张图有没有变化
- 先别被审批通过带走

#### money flow

- 钱还没落地
- 立项和报销别混着查

#### caller credibility

- 原来还等着四千
- 以前都报得回来

#### active provocation

- 几个部门都在等

### 事实边界

#### 能确认

- 栖行经营共享充电柜和储物柜，宸直是主要股东之一
- 部门按谁先垫款分配主办，过去结算存在实际支出之外的分成
- 陈实际垫六万八，主管拟报八万并分他四千；当前一万二没有对应外部服务且未支付
- 财务已登记陈实际垫款，主管此前只给旧立项页；其他两部门材料齐全仍待付款
- 前地推同事描述底薪加拉新奖金、每人有指标，付押金用户才计数

#### 被修剪

- 陈把抢活动先说成争取业绩，隐去预期四千元
- 主管将个人分配写作外部协调费，又用立项页代替费用进展
- 陈先以为只催自己即可；多部门受理记录改变了问题范围

#### 今晚定不了

- 各笔欠款最终支付日期和追回金额
- 费用草单的处理结果
- 公司全部账目与押金去向；连线中尚未取得集团资金材料

### scene

- **name：** 直播连线

### statement Patience

- **night a：** 4
- **night b：** 3

### statement Stages

#### 1. work title for advance:inquiry

- **内部 ID：** work-title-for-advance:inquiry
##### scene Indexes

- 0

- **minimum Review Count：** 1

#### 2. work private process:inquiry

- **内部 ID：** work-private-process:inquiry
##### scene Indexes

- 1

- **minimum Review Count：** 1

#### 3. work approval only:inquiry

- **内部 ID：** work-approval-only:inquiry
##### scene Indexes

- 2

- **minimum Review Count：** 1

#### 4. work leader note:inquiry

- **内部 ID：** work-leader-note:inquiry
##### scene Indexes

- 3

- **minimum Review Count：** 1

### author Facts

- **allocation：** 陈先在部门会上争取做招商会，主管随后将先垫六万八作为交活条件；这是部门惯例，不是首次现金紧张时临时转嫁。
- **settlement：** 部门包干预算八万，真实场地与礼品支出六万八。主管拟以不存在的外部协调服务列支一万二，分陈四千、自己八千；陈知道多报和分成，开场先交代六万八与八万的差额，追问后说明分成。此前主办给他看过实支五万八、结算七万的到账样本。
- **submission：** 6月27日陈交发票照片及刷卡记录，主管提交八万费用草单。财务登记真实六万八、另挂一万二待解释，原件可后补；主管只回旧立项页。
- **arrears：** 其他部门授权的受理页显示材料齐仍待付款；小陈联系的前地推同事在私下语音中讲述拉新指标、底薪与奖金。主播据已经看过的费用和待付记录提出公司账目有问题，劝其立即讨款、停止垫资、离职。
- **middle Management：** 主管虚列外部协调费，分配表约定陈四千、主管八千；该笔尚未支付。
- **corporate：** 栖行经营共享充电宝，租价低于同区常见价格一半、频繁免费而押金较高，公开融资稿的试点收入不足以覆盖维护、点位分成与折旧。周会计应林请求发来广告、融资稿及大股东官网宣传册；关联往来附注写明用户押金余额归集至宸直控制的平台、用于地产等关联项目周转。宣传册列出同一实控人控制的地产、资产管理与资金平台。后续通报才确认项目配资、继续融资及无法回流。
- **boundary：** 第二夜是林与陈的私下咨询，企业材料不在直播中展示。案尾公开材料说明经营亏损和押金用于关联项目周转；项目配资、继续融资及兑付危机仍留给最后的处置通报。第七晚开播，林只讲匿名催款进展及公开经营结论，不展示内部单据。

- **one Time Tic：**

## 7 月 26 日 · 私下咨询之后

【小陈挂断语音。你存好他的受理页，把去名的费用草单与分配表转给周会计，接着发了一条消息。】

**林旭阳：** 老周，几个部门都等着付款，还在催人办活动。栖行平时到底靠什么挣钱？有公开的经营资料吗？

【过了一会儿，周会计回了电话，微信里同时收到栖行的租借广告和一份公开融资稿。】

**周会计（语音）：** 我从他们官网翻到的。做共享充电宝的，广告和融资稿发你了，先看它怎么收费。

#### 舞台标记

- **声纹卡 ID：** zhou-accountant

【租借广告：每小时一元，同区常见价格每小时两元；每周三天免租金。押金一百九十九元，同区常见押金九十九元。页脚写着“新增点位持续招募”。】

**林旭阳：** 收费低一半，还经常免费。维护、给店里的分成，拿什么付？

**周会计（语音）：** 融资稿有个试点月报。租金收了三万，点位分成、维护和设备折旧加起来五万二，还没算总部的人。

#### 舞台标记

- **声纹卡 ID：** zhou-accountant

【你翻到融资稿的设备与扩张计划：设备向现有厂家采购；下一阶段继续减免租金、增加点位。盈利预测沿用现有收费，收入增长只列了新增用户数，分成和维护费用却没有随点位增加。】

**林旭阳：** 这么做根本不挣钱，还拼命加点位。他们收的押金放在哪儿了？

**周会计（语音）：** 融资稿后面有张关联往来表，你往后翻。

#### 舞台标记

- **声纹卡 ID：** zhou-accountant

【附注“用户押金与关联往来”：押金余额统一归集至宸直控制的资金平台，用于集团地产等关联项目周转；退押申请由平台按批次调拨。】

**林旭阳：** 押金收进来，又拿去做别的生意了。宸直怎么也在这儿？

【周会计发来栖行大股东官网上的宣传册链接。你点开“集团业务”，翻到股权关系页。】

**周会计（语音）：** 你问的那家平台在这页。栖行的大股东背后是同一个实控人，名下还有地产公司、资产管理公司。宣传册里说这些业务一起发展。

#### 舞台标记

- **声纹卡 ID：** zhou-accountant

**林旭阳：** 又是宸直。押金拿去做地产，几个部门的报销还拖着。栖行自己手里还有多少能用的钱？

**周会计（语音）：** 租金连成本都不够，押金又拿走了。大家要是都来退，他们拿什么还？

#### 舞台标记

- **声纹卡 ID：** zhou-accountant

**林旭阳：** 这些公开页我给陈发过去。明天他去交原件，也得问清楚，这次到底排没排付款。

【你把广告、融资稿和宣传册链接发给小陈。他回了一条语音。】

**陈（语音）：** 看到了。招新点位的广告倒一天没停过。我明天跟运营那个姐姐一起去，原件交了就让他们给收件记录。

#### 舞台标记

- **声纹卡 ID：** case4-caller-chen

**林旭阳：** 好，付款那栏有变化就发我。

【第二天下午，小陈发来盖过收件章的照片：原件已补齐，付款日期仍是“待通知”。下周活动改由主管另找人承办。】

**陈（语音）：** 我没再接，离职申请也交了。钱还是没下来，我跟她们留了同一份催款记录。财务有回复，我再找你。

#### 舞台标记

- **声纹卡 ID：** case4-caller-chen

你存好新的收件记录，把付款日期空着的那一栏留在屏幕上。

语音：语音与消息

### 7 月 29 日 · 开播回访

【几天后，开播】

【材料原页：栖行官网 · 租借广告】

> 租金：每小时 ¥1；同区常见价格：每小时 ¥2

> 每周三天免租金

> 押金：¥199；同区常见押金：¥99

> 新增点位持续招募

【材料原页：公开融资稿 · 试点月报与预测摘页】

> 月租金收入：¥30,000

> 点位分成、维护、设备折旧合计：¥52,000

> 总部费用：未列入本表

> 设备来源：向现有厂家采购

> 扩张计划：减免租金，增加点位

> 预测表：新增用户数逐期上升；分成、维护费用各期沿用当期数额

【材料原页：公开融资稿 · 用户押金与关联往来附注】

> 用户押金余额统一归集至宸直控制的资金平台

> 用途：集团地产等关联项目周转

> 退押申请：平台按批次调拨

【材料原页：大股东官网 · 集团宣传册】

> 栖行股东关系页所列控制人与资金平台控制人相同

> 同一控制人名下业务：地产、资产管理、资金平台

【7 月 29 日，距离那次私下咨询已经过去三天。开播前，陈发来消息：今天的会开完了，六万八仍未到账，付款日期还是“待通知”。】

【你关掉内部单据和聊天窗口，打开直播。】

**林旭阳：** 前几天那个垫钱办活动的小伙子，后来跟我私下聊了。原件补齐了，钱还没到。他这次没再垫。

【你把栖行官网的租借广告和公开融资稿放到直播画面里。】

**林旭阳：** 我去翻了这家栖行共享科技的公开资料。看完以后，我觉得他们的经营可能有很严重的问题。你们看，租金收三万，成本五万二，总部的人还没算。就这样，还在往外铺。

**林旭阳：** 设备是买现成的，也没见它说有什么新技术能把成本降下来。后面这张盈利预测，用户越来越多，给店里的分成、维护费倒不涨了。多摆几台就不用修了？照它这个收费，铺得越快，亏的不是越多吗？

**林旭阳：** 可它每拉来一个用户，先收一百九十九的押金。再看这页，押金进了宸直控制的关联平台，拿去给地产这些项目周转。充电宝可以免费借，押金得先留下。

**林旭阳：** 人家不用了就要退押金，地产那头没回款，你拿什么退？租金连自己都养不活。还得不停拉新人进来，前面的钱才有得还。这怎么维持下去？

**林旭阳：** 我看他们就是冲着押金来的。拿免费充电招人，把人家随时要退的钱拿去做别的生意，还吹自己扩张有多快。这不就是骗吗？

**林旭阳：** 小陈那六万八还没拿回来。他原来以为把主管说通了就行，现在是连付款日期都没人给。我会接着问他。今天这些公开资料，我也放到回放下面，你们自己看。

【下播后，你截出刚才谈栖行的这一段，附上广告和融资稿的原链接，发到自己的账号。】

【接下来几天，这段视频不断被转发。评论从“免费用还不好？”吵到“点位越来越多，成本怎么还是原来那些？”“押金都拿走了，真要退的时候找谁？”你刷到几个转发帖，也在问栖行到底靠什么挣钱。】

【账号里的新增关注开始一页接一页地往下排。之后几次开播，你看到一些陌生账号留言：“刷到你讲栖行那段来的。”“那个垫钱的小伙子，后来拿到钱了吗？”】

<a id="reading-section-9"></a>

# 第三幕：彩礼与流水

- **案件 ID：** 03-profile
- **剧情 ID：** education-income-fake-profile
- **内容包原题：** 今日来电：彩礼与流水
- **时间：** 2024 年 8 月 22 日 · 又过了三个多星期
### 本案两次通话日期

- 2024-08-22
- 2024-08-23

## 本案人物

| 角色 | 性格 | 欲望 | 防御动作 | 知识边界 |
|---|---|---|---|---|
| 案三咨询者·林 | 把家里的婚恋规矩当成常理，重保障和面子，不觉得自己的要求需要逐条争取同意。 | 让主播把男方拒绝二十八万八、只交工资账户解释成没有诚意，从而支持她先取得这笔保障；她也默认自己工作和家庭条件更好，男方平时多花钱、多照顾是应该的。 | 先说彩礼是母亲定的，把家境调查说成父母替她操心；只转达金额，不说付款时点、收款账户和额外支出，也不主动计算男方已经承担的饭钱、展票、接送和倾听。 | 母亲看过男方自费 MBA 回单后提高彩礼；女方说在缓和，却保留数字并主动提出婚房加名。 |
| 案三咨询者表妹 | 替人递话的亲近晚辈 | 让姐姐别只拿男方的钱争吵，也把自家条件讲全；后来转达她愿意公开的见面取消和家里安排。 | 只说亲见的家里群和姐姐告知的后续，不替男方回答家底，也不替姐姐宣布改变条件。 | 知道自己所在家里群的彩礼和父亲未来给款承诺，以及姐姐告诉她的周末安排；不知道男方其他账户或产品实际兑付情况。 |
| 案三相亲对象 | 受冒犯的条件维护者 | 让女方明白自己不是名校本科，却也不是靠家里读 MBA；更要阻止一张工资卡余额被直接当成他接受领证前转账、婚宴首饰另算的证明。 | 用每个局部真实抵挡整体概括的问题。 | 知道自己的项目、缴费、账户和家人整理材料过程；第二夜才从群聊得知女方父母的三十万元在宸直，不知道最终能否兑付。 |
| 案三介绍人 | 嘴快、怕砸媒人的热心撮合者 | 把相亲撮合成，也把谢媒人情办漂亮；两家开始谈彩礼后，又想证明自己只是传话。 | 先划掉不是自己说的那一句，再把没核实的话解释成“想让他们先见一面”。 | 知道女方母亲提出二十八万八、领证前进女方卡和婚宴首饰另算；向男方先只问了金额。她当时不知道女方父亲二十万的来源与用途，完整条件也未一起转达。 |
| 案三男方表姐 | 护家的感性防守者 | 澄清自己提醒过表弟说明工资卡范围，不替他承担隐瞒责任；不愿上直播，也不替他报家底。 | 说明自己参与的选卡过程；拒答其他账户和表弟愿意支付的金额。 | 在家里群亲历选卡过程，知道自己提醒过表弟说明仅为工资账户，也知道学费由他自付；不知道他的其他账户和女方家的宸直情况。 |

## 【编剧资料】案件发动机

- **戏剧锚点：** 自费 MBA 二十三万八、彩礼从十八万八参考提高到二十八万八、女方自己提出婚房加名、工资账户十八天流水，以及她开始询问下一位对象的条件。
- **为何今晚发生：** 母亲看到男方自费 MBA 回单后，将原先参考的十八万八提高到二十八万八。男方拒绝；女方称自己在挽回，却保留原数并提出婚房加名，要求工资流水。
### 公开求助

- **类型：** interest
- **求助内容：** 她想让主播支持自己的付款条件，把男方只交工资卡、拒绝领证前支付二十八万八解释成诚意不足，并推动周末见父母。男方当面拒绝后，她又要求换一个取消理由，保住在母亲和介绍人面前的体面。

- **核心物件作用：** 学校图先制造名校本科的误会；父母托人查到他只是后来读 MBA、家庭出身普通后，没有喊被骗，转头借这个落差把彩礼往上加。工资账户流水是在男方说拿不出高彩礼、女方坚持要看账之后出现的，它既暴露女方不肯相信当事人的拒绝，也暴露男方只交一张工资卡、没有说明其他账户。她自己提供的家里群节选进一步写明二十八万八的收款账户、支付时点和另算项目，并揭出女方父母的二十万元即使到期也准备先留给女儿本人。
- **咨询者所求：** 她认可提高后的彩礼，并主动提出婚房加名；对方拒绝后仍不愿减条件，想知道换个人还能得到什么。
- **对方所求：** 对方需要解释名校 MBA 不等于名校本科，也要说明自己已经拒绝二十八万八，为什么后来又只交出工资账户流水；他不愿把其他账户交给相亲对象或直播间，更不愿让一张工资卡余额替自己答应彩礼。
- **第三压力：** 父母把学历换算成家底、母亲用‘女方要留保障’解释单向条件、介绍人替两家传价、男方家催婚，以及直播礼物带来的发言压力。
- **咨询者自利删减：** 她先说母亲擅自报数，自己忙着挽回；后来才说明自己并未答应减彩礼，还在父母提醒后发消息要求婚房加名。她省下了彩礼须领证前进自己的个人账户、婚宴和首饰另算的要求，也没有一开始说自己的六万要等领证后才出。她自己的八万四与父亲以后给的二十万，都准备先留在女方一侧。
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

**咨询者：** 我在北京做审计，他在这边工作，是熟人介绍的。相处几个月，吃饭、看展，他都挺照顾我。本来周末要见父母，现在卡在彩礼上了。他问我二十八万八是谁定的，我才知道我妈已经托介绍人报了这个数。

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

### 夜 A · 1｜profile-dinner-pause

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

##### 1. profile dinner pause:casual Questions:0

**林旭阳：** 他说完那几句话，你当时先记住了哪一句？

**咨询者：** 学费。二十三万八。我脑子里先过的是这个数，本科那句反而没追下去。

- **source Anchor：** 学费二十三万八
- **内部 ID：** profile-dinner-pause:casualQuestions:0

##### 2. profile dinner pause:casual Questions:1

**林旭阳：** 开口问本科以前，你已经觉得那张学校图有问题了吗？

**咨询者：** 还没有。我只是想把介绍人那句“学校好”问得具体一点。结果他一停，我才觉得这事可能没说全。

- **source Anchor：** 本科也是在那儿读的吗
- **内部 ID：** profile-dinner-pause:casualQuestions:1

##### 3. profile dinner pause:question Options:2

**林旭阳：** 他承认本科不是那所以后，介绍人当时有没有把“名校毕业”圆回去？

**咨询者：** 没有。服务员来添水，话就断了。他付的账，用了团购券和积分。学历那句，谁都没再捡起来。

- **source Anchor：** 第一次正式吃饭
- **玩家所选怀疑方向：** 冷场时介绍人有没有接学历这句
- **路线轴：** money-flow
- **路线口气：** neutral
- **内部 ID：** profile-dinner-pause:questionOptions:2

##### 4. profile dinner pause:question Options:1

**林旭阳：** 服务员走了以后，你们又聊本科了吗？

**咨询者：** 没有。他说菜快凉了，我也就跟着聊别的。那顿饭是我催着约的，我也怕当场问僵。

- **source Anchor：** 正好服务员来添水
- **玩家所选怀疑方向：** 饭桌上有没有继续谈本科
- **路线轴：** caller-credibility
- **路线口气：** neutral
- **内部 ID：** profile-dinner-pause:questionOptions:1

##### 5. profile dinner pause:review Probes:0

**林旭阳：** 他问审计加班的时候，你怎么说的？

**咨询者：** 我说忙季是要加班，平常还好。

- **内部 ID：** profile-dinner-pause:reviewProbes:0
- **source Anchor：** 审计是不是总加班
- **路线口气：** neutral

#### 关键追问

##### 1. profile dinner pause:question Options:0

**林旭阳：** 那顿饭以后，你把本科的事跟家里说了吗？

**咨询者：** 没有。回家我还是说他是那所学校本科毕业。那时候我妈挺满意的，我没想再改口。

**林旭阳：** 他当面说了不是，你回去还这么讲？

**咨询者：** 介绍人那张学校图摆在那儿，谁看了不以为是本科？我总不能在饭桌上跟他查户口吧。

- **source Anchor：** 本科不是
- **玩家所选怀疑方向：** 那顿饭以后，你把本科的事跟家里说了吗？
###### logic Contract

- **premise Anchor：** 本科不是。我工作以后去读的 MBA
- **source Kind：** quoted-message
- **source Proves：** 被问本科时，对方承认本科不是该校，并说 MBA 学费由自己承担。
- **source Does Not Prove：** 自费二十三万八能确认当年发生过这笔支出，不能证明他现在积蓄很多。
- **answer Anchor：** 谁看了不以为是本科
- **answer Adds：** 她用学校图和饭桌礼貌推脱自己没有细问；名校这句还没问到是谁先说的。
- **next Legal Question：** 可以核对学校与缴费记录，不能把自费 MBA 直接推成家底丰厚。

- **矛盾：** 第一次饭局上问到资料时冷场了十几秒。
- **是否核心项：** true
- **路线轴：** identity-wording
- **路线口气：** pressure-point
- **内部 ID：** profile-dinner-pause:questionOptions:0

#### 压力表演

- **意图钩子：** 饭局冷场露出来
- **防备状态：** tense

#### 段后触发

- **类型：** evidenceCheck
- **材料检视 ID：** profile-mba-gap
- **标签：** 看饭局提到的两张材料

#### 正文前节拍

##### lines

###### 1. lines 1

【后台留着她此前转来的学校页与遮名缴费回单；男方同意节目查看这两页。】

- **音频提示：** voice.case3.dinner-pause
#### question Sequence

- profile-dinner-pause:questionOptions:0

### 夜 A · 2｜profile-caller-repeats-label

**林旭阳：** 那晚回家你还说是本科。后来什么时候改的口，回单又是什么时候发给你妈的？

**咨询者：** 隔了两天，我在微信上又问了一次。他还是说本科不是那所，把 MBA 查询页和缴费回单发来了。我这才把两张图转给我妈，跟她说是工作以后读的 MBA，不是本科。她先说我没问清，接着问：二十三万八，真是他自己出的？我说是。她就去找介绍人了。

【材料触发后的重述】 **咨询者：** 我妈看到自费学费回单以后，把原先参考的十八万八提高到了二十八万八。

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

【你请她把介绍人发给双方的原话一起转来。她停了一会儿，发来两段遮名聊天；是否核实过收入，文字里没有说明。】

- **现场疑点：** 母亲问清学费是否自费后，具体怎样提高了彩礼？
- **矛盾：** 咨询者把父母调查后的加价说成自己无可奈何；她嘴上劝了一句，却没有让二十八万八撤回。
- **可靠度：** partial
#### 自由追问

##### 1. profile caller repeats label:casual Questions:0

**林旭阳：** 介绍人是他妈的老同事。她说收入稳、家里省心，这些有没有让你核对过材料？

**咨询者：** 没有。他妈的老同事，话肯定挑好的说，这我懂。可收入稳那句，我当时没要材料。

- **source Anchor：** 介绍人说
- **内部 ID：** profile-caller-repeats-label:casualQuestions:0

##### 2. profile caller repeats label:casual Questions:1

**林旭阳：** “家里省心”这话你怎么理解？

**咨询者：** 就是独生子，爸妈有退休金，平时不用他贴钱。我妈一听这四个字，后面都没细问。

- **source Anchor：** 家里省心
- **内部 ID：** profile-caller-repeats-label:casualQuestions:1

##### 3. profile caller repeats label:question Options:1

**林旭阳：** 你把本科说清以后，你妈妈当时怎么回的？

**咨询者：** 她先说我没问清，接着问二十三万八是不是他自己交的。我把回单发给她了。

- **source Anchor：** 后来问清本科
- **玩家所选怀疑方向：** 母亲听完学历更正后的反应
- **路线轴：** caller-credibility
- **路线口气：** neutral
- **内部 ID：** profile-caller-repeats-label:questionOptions:1

##### 4. profile caller repeats label:review Probes:0

**林旭阳：** 她说收入稳。有没有给过一个月多少的工资单，还是只报了这个词？

**咨询者：** 没有。她说工作稳，我就没再问具体数字。

- **内部 ID：** profile-caller-repeats-label:reviewProbes:0
- **source Anchor：** 介绍人说
- **路线口气：** neutral

#### 关键追问

##### 1. profile caller repeats label:question Options:0

**林旭阳：** 你妈原来怎么说彩礼的，看到回单以后又怎么说？

**咨询者：** 原来拿我表姐那份十八万八作参考。后来她说，他自己读书都能花二十三万八，结婚怎么也不能比读书少，就让介绍人问二十八万八。我也是他来问才知道报了这个数，我还得去哄他。

- **source Anchor：** 二十三万八，真是他自己出的
- **玩家所选怀疑方向：** 你妈原来怎么说彩礼的，看到回单以后又怎么说？
###### logic Contract

- **premise Anchor：** 二十三万八，真是他自己出的
- **source Kind：** caller-statement
- **source Proves：** 二十三万八，真是他自己出的
- **source Does Not Prove：** 不能据此确认男方全部资产。
- **answer Anchor：** 原来拿我表姐那份十八万八作参考。后来她说，他自己读书都能花二十三万八，结婚怎么也不能比读书少，就让介绍人问二十八万八。我也是他来问才知道报了这个数，我还得去哄他。
- **answer Adds：** 原来拿我表姐那份十八万八作参考。后来她说，他自己读书都能花二十三万八，结婚怎么也不能比读书少，就让介绍人问二十八万八。我也是他来问才知道报了这个数，我还得去哄他。
- **next Legal Question：** 沿已说出的条件继续问。

- **矛盾：** 母亲看过男方自费 MBA 回单后提高彩礼；女方说在缓和，却保留数字并主动提出婚房加名。
- **是否核心项：** true
- **路线轴：** active-provocation
- **路线口气：** caller-skeptical
- **内部 ID：** profile-caller-repeats-label:questionOptions:0
- **revised Source Anchor：** 提高到了二十八万八

#### 压力表演

- **意图钩子：** 资料缺口压上来
- **防备状态：** tense

#### 段后触发

- **类型：** evidenceCheck
- **材料检视 ID：** profile-introducer-double-speak
- **标签：** 对介绍人两边发的话

#### question Sequence

- profile-caller-repeats-label:questionOptions:0

#### 场尾自动拍

##### lines

###### 1. lines 1

**林旭阳：** 她不是嫌他学历低，是看他自己花得起这笔学费，觉得还可以多要。

###### 2. lines 2

**咨询者：** 我妈是这么算的。可他现在一听这个数，就连我也不想理了。

#### closure Contract

- **entry Anchor：** 二十三万八
- **closer Anchor：** 她不是嫌他学历低
- **adds：** 主播根据彩礼变化判断加码来自对支付能力的估计。
- **open Edge：** 女方如何挽回、有没有自己加条件。
- **route Independent：** true

### 中段立场快照

- **段后触发：** 3
- **kicker：** 接着问
- **提示题：** 走到这儿，哪件事最让你在意？
- **说明：**
- **after Pick Line：** 她要回家里群看原话。明天再问那几个数字是怎么传出去的。
- **continue Label：** 继续听
- **recap Kicker：** 这次问到的事
#### 选项

##### 1. 知道学费是他自己交的之后，你妈妈改了什么条件？

- **内部 ID：** respondent-fraud
- **标签：** 知道学费是他自己交的之后，你妈妈改了什么条件？
- **摘要：** 知道学费是他自己交的之后，你妈妈改了什么条件？
- **反馈：** 她说他既然肯花二十多万读书，结婚就更不能省。我当时没让她往回改。
- **recap：** 知道学费是他自己交的之后，你妈妈改了什么条件？
- **主播回应：** 她说他既然肯花二十多万读书，结婚就更不能省。我当时没让她往回改。
- **closing Title：** 学费之后，条件怎么变了
###### callback Lines

###### 1. callback Lines 1

**咨询者：** 学费回单也拿来了，是他自己交的。至于彩礼，我妈还是原来那个数。

##### 2. 这个彩礼数，你自己同意吗？

- **内部 ID：** caller-control
- **标签：** 这个彩礼数，你自己同意吗？
- **摘要：** 这个彩礼数，你自己同意吗？
- **反馈：** 我不想因为这个谈崩。但要是能给，我当然也想要。
- **recap：** 这个彩礼数，你自己同意吗？
- **主播回应：** 我不想因为这个谈崩。但要是能给，我当然也想要。
- **closing Title：** 父母的条件，她自己的意思
###### callback Lines

###### 1. callback Lines 1

**咨询者：** 昨天你问是不是我自己同意的。她提的时候，我确实没让她撤回。

##### 3. 他只给这一张工资卡，你还想知道什么？

- **内部 ID：** market-coauthored
- **标签：** 他只给这一张工资卡，你还想知道什么？
- **摘要：** 他只给这一张工资卡，你还想知道什么？
- **反馈：** 他别的卡里有多少。他说没那么多，我不知道该不该信。
- **recap：** 他只给这一张工资卡，你还想知道什么？
- **主播回应：** 他别的卡里有多少。他说没那么多，我不知道该不该信。
- **closing Title：** 一张工资卡与结婚出资
###### callback Lines

###### 1. callback Lines 1

**咨询者：** 他今天还是只给这一张工资卡，别的账户我没拿到。

### 第一次收麦

**咨询者：** 家里群一直在 @ 我。最上面那几句……我得自己再看一遍。今晚先到这儿吧，明天我回来。

#### 舞台标记

- **after Scene Index：** 2
- **主播台词：** 你先看家里怎么说。介绍人那边也联系一下，明天把原话带来。
- **stage Direction：** 电话断了。屏幕上，家里群的新消息还在往外跳。
- **音频提示：** sfx.phone.busy

## 收麦幕间：控台短查

### 幕间行动

- **标题：** 收麦后·控台短查
- **kicker：**
- **budget：** 0
- **min Actions：** 0
- **max Actions：** 0
- **continue Label：** 进入白天调查
#### actions

##### 1. 先在后台看表妹发来的群聊

- **内部 ID：** profile-family-chat-late
- **标签：** 先在后台看表妹发来的群聊
- **摘要：** 整页聊天由来电人回拨时自己念，后台不替她解释彩礼和宸直。
- **cost：** 0
- **类型：** backflowEarly
- **hook Id：** profile-family-chat-backflow
###### 授予库存

- family-chat-seen

- **scene Text：** 表妹私信与家里群截图：后台私信
发送人：表妹
我也在群里。让她把两家的条件都说全吧，别吵到最后全怪介绍人。
附件：家里群截图

家里群截图
表妹转发的群聊原图
咨询者：本科不是那所，是后来读的 MBA。二十三万八，都是他自己交的。
母亲：那说明手里不会差。彩礼先问二十八万八，领证前打进她自己的卡。婚宴和首饰另算。
父亲：咱家宸直那三十万九月底到期，到时候拿二十万给她，她自己留着。

- **flow Mode：** linear

## 白天调查

- **白天开场：** 表妹发来的群聊先留在后台。来电人把连线片段转给介绍人和男方。介绍人约你到茶馆，带来了两边的聊天记录；男方回了消息，把帮忙看过材料的表姐拉进私聊。
- **白天行动预算：** 0
- **最少白天场景：** 3
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

###### 1. day profile teahouse:beat:0

**介绍人：** 你先看聊天。她妈妈现在一口一个我骗她，可“名校毕业”真不是我说的。我当时只说他学校不错。至于“收入挺稳”，是男方家先这么跟我讲的。

#### 舞台标记

- **内部 ID：** day-profile-teahouse:beat:0

###### 2. day profile teahouse:beat:1

**你：** 男方家这么讲，你就直接转给她家了？工资、流水，你一样都没见过？

#### 舞台标记

- **内部 ID：** day-profile-teahouse:beat:1

###### 3. day profile teahouse:beat:2

**介绍人：** 工资条是没看，老同事介绍自己儿子，我还能先让她拿证明？我给女方说的也都是好话。

#### 舞台标记

- **内部 ID：** day-profile-teahouse:beat:2

###### 4. day profile teahouse:beat:3

**你：** 你还替女方说过什么？

#### 舞台标记

- **内部 ID：** day-profile-teahouse:beat:3

###### 5. day profile teahouse:beat:4

**介绍人：** 我说她做审计，工作稳定，家里事少。男方家问她会不会嫌学历，我还说了句“她不太计较这个”。后来她妈妈听说 MBA 二十三万八是他自己交的，又让我去问二十八万八。我一个字没改，全转了。

#### 舞台标记

- **内部 ID：** day-profile-teahouse:beat:4

###### 6. day profile teahouse:beat:5

**你：** 你知道女方家准备给她多少吗？

#### 舞台标记

- **内部 ID：** day-profile-teahouse:beat:5

###### 7. day profile teahouse:beat:6

**介绍人：** 不知道。她妈妈只说家里不会亏待女儿。今天她又给我打电话，解释到最后才说，那笔钱还没到期。早知道是这样，我至少会先问一句：现在拿得出来吗？

#### 舞台标记

- **内部 ID：** day-profile-teahouse:beat:6

###### 8. day profile teahouse:beat:7

**你：** 她计不计较学历，你也没问啊。你就不怕两个人一见面，全对不上？

#### 舞台标记

- **内部 ID：** day-profile-teahouse:beat:7

###### 9. day profile teahouse:beat:8

**介绍人：** 我想着见了面，觉得人不错，这些就好谈了。谁知道两家连饭店都没订，就吵成这样。

#### 舞台标记

- **内部 ID：** day-profile-teahouse:beat:8

##### earned Item Ids

- 两边的完整聊天
- 她没核实的两句话

- **获得物件：** 两边的完整聊天
- **source Note：** 来电人把连线片段转给介绍人；介绍人随后联系你，约在茶馆见面。

### 地点 2

- **内部 ID：** day-profile-cousin-doorstep
- **标签：** 工作室·男方表姐的私下语音
- **舞台背景：** day-studio
- **类型：** studio
#### 场景正文

- **access：** 男方收到来电人转发的片段后，把工资卡问题转给帮忙看过材料的表姐。表姐怕“家里一起挑的”变成自己教他隐瞒，要求男方牵线私下语音，只谈她参与过的选卡过程。
你在工作室接通表姐的语音。她刚下班，电话里还听得见进站广播。

- **路线轴：** external-corroboration
- **获得物件：** 表姐门口口供
##### cast

- 男方表姐
- 你

##### 场景节拍

###### 1. day profile cousin doorstep:beat:0

**男方表姐：** 怎么又把我扯进来了？我就帮他看过那几张材料。他的学费是自己交的，回单他也答应给你们看。

#### 舞台标记

- **内部 ID：** day-profile-cousin-doorstep:beat:0

###### 2. day profile cousin doorstep:beat:1

**你：** 那张工资卡，是谁挑的？

#### 舞台标记

- **内部 ID：** day-profile-cousin-doorstep:beat:1

###### 3. day profile cousin doorstep:beat:2

**男方表姐：** 他在家里群问过该发哪张。姑姑说工资卡最规整，别的卡不用给。他就照着发了。

#### 舞台标记

- **内部 ID：** day-profile-cousin-doorstep:beat:2

###### 4. profile cousin choice

**你：** 那你当时怎么说的？

#### 舞台标记

- **内部 ID：** profile-cousin-choice

###### 5. profile cousin view

**男方表姐：** 我说问收入就发工资卡呗。可她后来问别的卡，我让他自己回。他倒好，又把问题转给我。

#### 舞台标记

- **内部 ID：** profile-cousin-view

###### 6. profile cousin family

**你：** 他家里也觉得只发这一张就够了？

#### 舞台标记

- **内部 ID：** profile-cousin-family

###### 7. profile cousin reply

**男方表姐：** 姑姑就是这么想的，给人家看了工资还不够？我说人家现在问的是结婚拿多少钱，你光给一张卡有什么用。他愿意拿多少，还得他自己开口。

#### 舞台标记

- **内部 ID：** profile-cousin-reply

###### 8. day profile cousin doorstep:beat:3

**男方表姐：** 你们晚上聊的时候，让他自己把话说明白。别又让他转给我，我也不知道他另外存了多少。

#### 舞台标记

- **内部 ID：** day-profile-cousin-doorstep:beat:3

- **source Note：** 男方把工资卡问题转给表姐，拉起了三人私聊。

### 地点 3

- **内部 ID：** day-profile-credential-docs
- **标签：** 后台·核验页与工资流水
- **舞台背景：** day-document
- **类型：** document
#### 场景正文

- **access：** 学校页、缴费回单和男方已经发给女方的工资账户流水由男方明确同意查看；其他账户从未提供，也不在授权范围内。家里群截图来自自称表妹的后台账号，来电人尚未同意公开，只能麦外查看，带回直播前必须先问她。来电人另补了父亲的宸直持有页，说这能证明家里答应的二十万不是空话。
- **document Id：** case3-credential-balance
- **路线轴：** document-edge
- **获得物件：** 双份材料圈注
- **source Note：** 男方同意核对这份学费回单和工资流水；家里群截图还没征得来电人同意，暂时只在后台看。来电人另补了父亲的宸直持有页，说这能证明家里答应的二十万不是空话。

### 幕间物件映射

- **family chat seen：** 家里群原话

## 夜 B：回拨

- **收麦锚点：** 她就去找介绍人了
- **收麦舞台：** 电话断了。屏幕上，家里群的新消息还在往外跳。
- **hangup Audio Cue Id：** sfx.phone.busy
- **主播留话：** 你先看家里怎么说。介绍人那边也联系一下，明天把原话带来。
### 回拨衔接

#### lines

##### 1. lines 1

**林旭阳：** 好，那咱们接着昨晚说。

### 回拨立场

- **against Caller：** 二十八万八是我妈定的，我知道以后没叫停。今晚我自己答。
- **with Caller：** 我又看了家里群。他们到现在还觉得我没错。你要问就问吧。

### 夜 B · 1｜profile-proof-before-dinner

**林旭阳：** 昨天你说还得去哄他。你后来是怎么跟他说的？

**咨询者：** 我说你别跟我妈生气，她就是担心我，我去跟她说。又问他周末还见不见面。他回我：“条件不改，见面还说什么？”我也不想就这么散了。

【材料触发后的重述】 **咨询者：** 我没有答应降低彩礼，还自己提出以后婚房加名。男方拒绝后，我要求看流水，他只给工资卡。

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
- **矛盾：** 咨询者不相信男方对彩礼的直接拒绝，坚持要求流水；男方只提供工资账户，对其他账户的追问尚未答复。
- **可靠度：** mixed
- **展示卡片：** daily-profile-deposit
#### 关键追问

##### 1. profile proof before dinner:question Options:0

**林旭阳：** 你说去跟你妈谈，具体答应他改哪一条？

**咨询者：** 我没答应改数字。我跟他说，彩礼先给我，我妈那边我会解释；以后买婚房，也把我的名字加上，我就踏实了。这都是结婚的事，先说清楚不好吗？

**林旭阳：** 婚房加名字，是你妈妈让你转达的？

**咨询者：** 她提醒过我。不过那条消息是我自己发的。我本来没想这么细，她一说，我也觉得不能什么都不问。

**林旭阳：** 你跟他说别听你妈的，转过去又把数留下，还添了房子的要求。你这不是在替他往回谈啊。

**咨询者：** 我说了让我妈少说两句，又没说我不要这些。

- **source Anchor：** 我去跟她说
- **玩家所选怀疑方向：** 你说去跟你妈谈，具体答应他改哪一条？
###### logic Contract

- **premise Anchor：** 我去跟她说
- **source Kind：** caller-statement
- **source Proves：** 我去跟她说
- **source Does Not Prove：** 不能据此确认男方全部资产。
- **answer Anchor：** 我没答应改数字。我跟他说，彩礼先给我，我妈那边我会解释；以后买婚房，也把我的名字加上，我就踏实了。这都是结婚的事，先说清楚不好吗？
- **answer Adds：** 我没答应改数字。我跟他说，彩礼先给我，我妈那边我会解释；以后买婚房，也把我的名字加上，我就踏实了。这都是结婚的事，先说清楚不好吗？
- **next Legal Question：** 沿已说出的条件继续问。

- **矛盾：** 她已在第一夜认下赞成加价，现在仍把不愿改条件说成对方没有诚意。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** trust-but-verify
- **内部 ID：** profile-proof-before-dinner:questionOptions:0
- **revised Source Anchor：** 婚房加名

##### 2. profile proof before dinner:question Options:1

**林旭阳：** 他拒绝这几个条件以后，你又问了什么？

**咨询者：** 我让他给我看流水。他说拿不出，总得让我知道到底差多少吧。他发来工资卡，我又问其他账户，他没答。这张我也转给我妈了。

- **source Anchor：** 条件不改，见面还说什么
- **玩家所选怀疑方向：** 他拒绝这几个条件以后，你又问了什么？
###### logic Contract

- **premise Anchor：** 条件不改，见面还说什么
- **source Kind：** caller-statement
- **source Proves：** 条件不改，见面还说什么
- **source Does Not Prove：** 这张工资卡不能证明其他账户余额或男方全部资产。
- **answer Anchor：** 我让他给我看流水。他说拿不出，总得让我知道到底差多少吧。他发来工资卡，我又问其他账户，他没答。这张我也转给我妈了。
- **answer Adds：** 我让他给我看流水。他说拿不出，总得让我知道到底差多少吧。他发来工资卡，我又问其他账户，他没答。这张我也转给我妈了。
- **next Legal Question：** 沿已说出的条件继续问。

- **矛盾：** 男方把一张真实的工资账户流水放在台前，却把其他账户留在材料之外。
- **是否核心项：** true
- **路线轴：** document-edge
- **路线口气：** trust-but-verify
- **内部 ID：** profile-proof-before-dinner:questionOptions:1
- **revised Source Anchor：** 婚房加名

#### 压力表演

- **意图钩子：** 条件话被托了一层
- **防备状态：** guarded

#### question Sequence

- profile-proof-before-dinner:questionOptions:0
- profile-proof-before-dinner:questionOptions:1

### 夜 B · 2｜profile-family-chat-origin

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

- **标题：** 谈到两家出钱
- **引子：** 看材料，接着问。
- **split After：** 3
- **mid Summary：**
- **soft Anchor Response：** 已选材料
##### miss Feedback

###### evidence

- 她说：“这个我知道啊，然后呢？”
- 她回了一句：“我不觉得这能说明什么。”

###### statement

- 她问：“这句话有什么问题？”
- 她说：“我没打算收回这句话。”

##### statements

###### 1. 她的说法

- **内部 ID：** profile-family-rule-proves-attitude
- **标签：** 她的说法
我家规矩就是先看他愿不愿意拿出来。他工资卡有二十八万六，只差两千，不是拿不出，就是不肯。

- **press Response：** ‘就差两千。你让我怎么不往态度上想？’
- **present Response：** 已选材料

###### 2. 她的说法

- **内部 ID：** profile-other-accounts-still-unknown
- **标签：** 她的说法
我问别的账户他不答，你们怎么不催他？

- **press Response：** ‘别的账户我不知道。可这张卡上的二十八万六总是真的。’
- **present Response：** 已选材料

###### 3. 她的说法

- **内部 ID：** profile-payment-rule-stated
- **标签：** 她的说法
我妈要他领证前把二十八万八打进我卡，婚宴首饰另算，这就是她开出的条件。

- **press Response：** ‘领证前进我卡，婚宴首饰另算。是我家开的条件，我没说他答应了。’
- **present Response：** 已选材料

###### 4. 她的说法

- **内部 ID：** profile-family-fund-remains-future
- **标签：** 她的说法
我爸都答应二十万了，就等到九月底，有那么难等吗？

- **press Response：** ‘九月底以后，给我留着。现在确实还没到。’
- **present Response：** 已选材料

##### acts

###### 1. 她接着解释自己的要求

- **内部 ID：** act1
- **status Label：** 双方的付款条件
- **标题：** 她接着解释自己的要求
- **引子：** 选择原话与材料后出示。
###### opener Fact Keywords

- 二十八万八
- 二十万

- **revised Frame：** 她认可父亲的承诺、要求男方先付，用亲疏和先后给两笔钱分出不同标准，不自称已接受批评。
- **split After：** 2
- **mid Summary：**
###### miss Feedback

###### evidence

- 她反问：“拿这个就能说我要求多？”
- 她反问：“这页哪一项说他只能拿这些了？你倒是让他把别的账户也答了啊。”

###### statement

- 她说：“这句我认。”
- 她说：“这句话是我说的。我问的是他肯不肯，你们怎么总让我先退？”

- **soft Anchor Response：** 已选材料
###### statements

###### 1. 她的说法

- **内部 ID：** profile-family-rule-proves-attitude
- **标签：** 她的说法
我家规矩就是先看他愿不愿意拿出来。他工资卡有二十八万六，只差两千，不是拿不出，就是不肯。

- **press Response：** ‘就差两千。你让我怎么不往态度上想？’
- **present Response：** 已选材料

###### 2. 她的说法

- **内部 ID：** profile-other-accounts-still-unknown
- **标签：** 她的说法
我问别的账户他不答，你们怎么不催他？

- **press Response：** ‘别的账户我不知道。可这张卡上的二十八万六总是真的。’
- **present Response：** 已选材料

###### 3. 她的说法

- **内部 ID：** profile-payment-rule-stated
- **标签：** 她的说法
我妈要他领证前把二十八万八打进我卡，婚宴首饰另算，这就是她开出的条件。

- **press Response：** ‘领证前进我卡，婚宴首饰另算。是我家开的条件，我没说他答应了。’
- **present Response：** 已选材料

###### 4. 她的说法

- **内部 ID：** profile-family-fund-remains-future
- **标签：** 她的说法
我爸都答应二十万了，就等到九月底，有那么难等吗？

- **press Response：** ‘九月底以后，给我留着。现在确实还没到。’
- **present Response：** 已选材料

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** case3-credential-balance:p03
- **statement Id：** profile-family-rule-proves-attitude
###### boundary Line Key Phrases

- 已提供一个工资账户，其余账户和后续开支尚未核全。

- **selection Reason：** 这张工资卡显示期末余额二十八万六，不能证明男方愿意把全部余额转进她的个人卡，也不能证明其他账户或婚宴预算。
###### material Cards

###### 1. 期末余额 ¥286,000 · 仅一张账户

- **内部 ID：** case3-credential-balance:p03
- **类型：** 工资卡覆盖范围
- **标签：** 期末余额 ¥286,000 · 仅一张账户
- **excerpt：** 08-18 · 男方工资账户 · ¥286,000 · 08-01 至 08-18；期末余额；其他账户未提供
- **source Label：** 学历、彩礼与两家资金边界 p03

###### 2. 领证前转入女方个人账户 ¥288,000

- **内部 ID：** case3-credential-balance:p04
- **类型：** 条件原文
- **标签：** 领证前转入女方个人账户 ¥288,000
- **excerpt：** 08-17 · 女方母亲→介绍人 · ¥288,000 · 听说 MBA 自费后提出；要求领证前转入女方个人账户
- **source Label：** 学历、彩礼与两家资金边界

- **咨询者台词：** 两千倒不至于掏不出来吧。行，你说卡上看不出，我就问他本人，他到底肯不肯。
- **主播台词：** 那就问他接不接受这些条件。
- **boundary Line：** 已提供一个工资账户，其余账户和后续开支尚未核全。
- **矛盾：** 她把单卡余额接近条件当作拒付出于态度的理由，补问实际拒绝原因；父亲承诺的兑现仍未知。
- **路线轴：** process-control
- **continue Label：** 听他怎么说
- **outcome Kind：** clarification

- **wink Line：**
###### inquiry

###### opening Lines

###### 1. opening Lines 1

**咨询者：** 彩礼先到我自己卡里，两家才好往下谈。不然等领了证，他变卦怎么办？

###### 选项

###### 1. act1 miss 1

- **内部 ID：** act1-miss-1
- **主播问句：** 你有没有问过，钱能不能先放共同账户，而不是进你自己卡？
- **是否核心项：** false
###### lines

###### 1. lines 1

**咨询者：** 没问。我要先放自己卡里，也是怕婚后说不清。

- **supplementary：** true

###### 2. act1 ask

- **内部 ID：** act1-ask
- **主播问句：** 这张工资卡有二十八万六。即使他另凑两千，你肯放共同账户、一起谈婚宴吗？
- **是否核心项：** true
###### lines

###### 1. lines 1

**咨询者：** 共同账户我不接受。彩礼得先进我自己卡，不答应这个，我怎么往下谈？

###### 2. lines 2

**林旭阳：** 他要是只肯放共同账户，这婚还谈吗？

###### 3. lines 3

**咨询者：** 那就让他再想想。我都说了，彩礼要给我的，这个也要我让？

###### 3. act1 miss 2

- **内部 ID：** act1-miss-2
- **主播问句：** 他有没有说过，领证前具体能给你多少？
- **是否核心项：** true
###### lines

###### 1. lines 1

**咨询者：** 他就说拿不出，没报具体能给多少。我要的还是二十八万八，先进我的卡，共同账户我不接受。

###### 2. lines 2

**林旭阳：** 他要是只肯放共同账户，这婚还谈吗？

###### 3. lines 3

**咨询者：** 那就让他再想想。我都说了，彩礼要给我的，这个也要我让？

###### opener Lines

###### 1. opener Lines 1

**咨询者：** 彩礼先到我自己卡里，两家才好往下谈。不然等领了证，他变卦怎么办？

- **wink Line：**
- **revision：** shameless-2026-09-19

#### decisive Present

- **max Attempts：** 2
- **evidence Id：** case3-credential-balance:p03
- **statement Id：** profile-family-rule-proves-attitude
##### boundary Line Key Phrases

- 已提供一个工资账户，其余账户和后续开支尚未核全。

- **selection Reason：** 这张工资卡显示期末余额二十八万六，不能证明男方愿意把全部余额转进她的个人卡，也不能证明其他账户或婚宴预算。
##### material Cards

###### 1. 期末余额 ¥286,000 · 仅一张账户

- **内部 ID：** case3-credential-balance:p03
- **类型：** 工资卡覆盖范围
- **标签：** 期末余额 ¥286,000 · 仅一张账户
- **excerpt：** 08-18 · 男方工资账户 · ¥286,000 · 08-01 至 08-18；期末余额；其他账户未提供
- **source Label：** 学历、彩礼与两家资金边界 p03

###### 2. 领证前转入女方个人账户 ¥288,000

- **内部 ID：** case3-credential-balance:p04
- **类型：** 条件原文
- **标签：** 领证前转入女方个人账户 ¥288,000
- **excerpt：** 08-17 · 女方母亲→介绍人 · ¥288,000 · 听说 MBA 自费后提出；要求领证前转入女方个人账户
- **source Label：** 学历、彩礼与两家资金边界

- **咨询者台词：** 两千倒不至于掏不出来吧。行，你说卡上看不出，我就问他本人，他到底肯不肯。
- **主播台词：** 那就问他接不接受这些条件。
- **boundary Line：** 已提供一个工资账户，其余账户和后续开支尚未核全。
- **矛盾：** 她把单卡余额接近条件当作拒付出于态度的理由，补问实际拒绝原因；父亲承诺的兑现仍未知。
- **路线轴：** process-control
- **continue Label：** 听他怎么说
- **outcome Kind：** clarification

#### revised Version Triggers

##### document Rows

- case3-credential-balance:p04

##### 带回物开场

- 家里群原话

#### 正文前节拍

##### lines

###### 1. lines 1

**咨询者：** 家里那几句我自己截好了，发给你们了，可以念。别把整页都放出去。

###### 2. lines 2

**咨询者：** 今天下午，介绍人又来问我。

###### 3. lines 3

【停顿】

###### 4. lines 4

**咨询者：** 男方家想知道，我家除了要二十八万八，准备给我多少。

###### 5. lines 5

**林旭阳：** 你怎么回的？

###### 6. lines 6

**咨询者：** 我说我家也出二十万，她又问什么时候到。我爸都答应了，还得一天追着问啊？

###### 7. lines 7

【她授权公开的家里群记录：父亲说二十万等九月底产品到期后给她留着；母亲要求男方领证前转二十八万八进女儿个人卡，婚宴首饰另算。】

###### 8. lines 8

**林旭阳：** 你家的二十万可以等九月底，为什么他必须领证前转给你？

###### 9. lines 9

**咨询者：** 那是我爸啊。他是还没领证的相亲对象，能一样吗？二十八万八，我妈说了，我也同意。

- **现场疑点：** 女方家要求男方在领证前把二十八万八转进女方个人账户，婚宴和首饰另算；自己的二十万元却要等宸直到期，并先留给女儿本人。
- **矛盾：** 咨询者只说“妈妈问了彩礼”，省掉钱要进自己的卡、婚宴首饰另算；父亲留给她个人的二十万元，又被她说成女方家也会为结婚出钱。
- **可靠度：** partial
#### 自由追问

##### 1. profile family chat origin:casual Questions:0

**林旭阳：** 你看见家里群里领证前进卡那句。当时你有没有让介绍人先别按这个数去问？

**咨询者：** 没有。券怎么用、积分抵了多少，他饭桌上倒说得清楚。彩礼进我卡这句，我没让介绍人先停。

- **source Anchor：** 我当时看见了
- **内部 ID：** profile-family-chat-origin:casualQuestions:0

##### 2. profile family chat origin:casual Questions:1

**林旭阳：** 你爸那二十万要等到九月底。彩礼为什么非得领证前进你的卡，不能等两边的钱都能拿出来再谈？

**咨询者：** 我问过。我妈说：“他先把彩礼给了，咱家的钱九月底到期再说。”她不肯等。我那时候听着，也没觉得哪里不对。

- **source Anchor：** 九月底到期
- **内部 ID：** profile-family-chat-origin:casualQuestions:1

##### 3. profile family chat origin:casual Questions:2

**林旭阳：** 你妈说先别把人得罪死。她还坚持领证前进你卡吗？

**咨询者：** 坚持。她就说：『过了年你就 29 了，先别把人得罪死。』……这话她今年说了四回。我记着次数呢。你看，职业病。

- **source Anchor：** 我妈先发了一句
- **内部 ID：** profile-family-chat-origin:casualQuestions:2

#### 关键追问

##### 1. profile family chat origin:question Options:0

**林旭阳：** 你把二十八万八告诉男方时，有没有把“领证前进你卡、婚宴和首饰另算”也一起说清楚？

**咨询者：** 没有。只发了二十八万八。

**林旭阳：** 你只发数字，领证前进你卡、婚宴首饰另算，怎么不一起说？怕他看完，周末连饭都不来吃了？

**咨询者：** 我就是怕他看完不来。条件我也同意，彩礼先到我卡里，我才踏实。

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
- **内部 ID：** profile-family-chat-origin:questionOptions:0

##### 2. profile family chat origin:question Options:1

**林旭阳：** 你爸说以后给你二十万。那笔钱是拿来付婚宴，还是给你自己留着？

**咨询者：** 我爸原话，是给我自己留着。

**林旭阳：** 你跟男方怎么说的？

**咨询者：** 我说我家也会出二十万。

**林旭阳：** “给你留着”说了吗？

**咨询者：** 没有。

- **source Anchor：** 拿二十万给我留着
- **玩家所选怀疑方向：** 女方家的二十万准备怎么用
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** detour
- **内部 ID：** profile-family-chat-origin:questionOptions:1
- **矛盾：** 父亲给女儿个人留用的未来款项没有约定婚礼用途。
###### logic Contract

- **premise Anchor：** 拿二十万给我留着
- **source Kind：** caller-statement
- **source Proves：** 父亲承诺到期后给女儿二十万。
- **source Does Not Prove：** 这笔钱尚未到账，也未约定用于婚礼。
- **answer Anchor：** 我爸原话
- **answer Adds：** 她确认父亲的二十万尚未转入，只是到期后给她个人的承诺。
- **next Legal Question：** 问她向男方说过什么用途。

#### 压力表演

- **意图钩子：** 彩礼问到了女方家的钱
- **防备状态：** guarded
##### 表情/听感

- **类型：** pause
她说“等一下”，随后传来几下点按声

- **legacy Question Options：** true
### 场间实时反压

- **内部 ID：** profile-family-chat-blowup
- **类型：** interruptToast
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

**咨询者：** 等一下。我自己只给了那几句，后台怎么还有整页群聊……是我表妹发给你们的？

##### 2. lines 2

【停顿】

##### 3. lines 3

**咨询者：** 她把我家的群发给一个直播间？

##### 4. lines 4

【停顿】

##### 5. lines 5

**咨询者：** 你们等我一下，我要先给她打个电话。

##### 6. lines 6

**林旭阳：** 表妹发的整页我删了，只留你同意公开的那几句。你要先打电话，我们就等一会儿。

##### 7. lines 7

**咨询者：** 她多半跟我妈在一起。打过去又是我妈接，说都是为我好。烦死了。

##### 8. lines 8

【电话那头安静了一会儿。】

##### 9. lines 9

**咨询者：** 先说完吧。播完我自己找她。

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
- **标签：** 第二路连麦申请
- **visual Variant：** second-mic

#### lines

##### 1. lines 1

【金色特效铺开，账号“Z先生”送出“星河”×1。特效还没散，他又申请了连麦。】

##### 2. lines 2

**男方（后台文字）：** 我是她说的那个人。介绍人把直播片段转给我了，我才进来的。礼物你先收着。

##### 3. lines 3

**男方（后台文字）：** 我只问一句：你家要我领证前把二十八万八打进你的卡，你爸答应你的二十万却要等到九月底，宸直那三十万到期，拿到以后还说是留给你自己的。这些话，你有没有一起告诉我？

##### 4. lines 4

**林旭阳：** 礼物我退回去。你要上麦，就把愿意公开谈的范围说清楚。

##### 5. lines 5

【礼物特效退下去，后台显示“退款处理中”。】

##### 6. lines 6

**男方（后台文字）：** 学校、学费、工资卡和彩礼可以说，其他账户不公开。她家就谈已经同意公开的那几句。

##### 7. lines 7

**林旭阳：** 你同意按这个范围当面谈吗？

##### 8. lines 8

**咨询者：** 接进来。我的工资存款我自己说，家里群只说那几句。

### 场间实时反压

- **内部 ID：** profile-mediation-consent
- **类型：** interruptToast
- **cost：** 0
- **after Scene Index：** 5
- **from：** 临时双人连麦
- **声纹卡 ID：** case3-respondent
#### lines

##### 1. lines 1

【双方确认公开范围后，第二路麦克风接通。】

##### 2. lines 2

**男方：** 我说拿不出来，你就让我打流水。打了又问还有没有别的卡。我现在最烦的就是这个，给你看多少才算完？

##### 3. lines 3

**咨询者：** 二十八万八要在领证前进我卡，婚宴和首饰另算。我们家就是这么谈的，我也同意。见面还可以聊，你现在就说不去了？

##### 4. lines 4

**男方：** 我说拿不出，不是差那两千，是我不接受领证前全打进她个人卡里。你们别再拿那张工资卡——

##### 5. lines 5

**林旭阳：** 那你能接受怎么出？当着她说。

##### 6. lines 6

**男方：** 行。二十八万八真要谈，就放共同账户。她家九月底那笔怎么放、婚宴和首饰谁出，也一起写清。只让我先打进她卡里，我不接受。

##### 7. lines 7

**林旭阳：** 行，两边的钱都谈，你先听她说。

### 夜 B · 3｜profile-income-and-card

**林旭阳：** 他提共同账户，你先说说自己的钱准备怎么放？

**咨询者：** 我自己也会出钱啊。又不是结了婚就什么都让他掏。

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

**咨询者：** 可你老问我的钱，自己的其他账户还是没给我看啊。

###### 2. lines 2

**林旭阳：** 她问过其他账户，你为什么一直没答？

###### 3. lines 3

**男方：** 我就是不想给她看别的卡。我妈让我发工资卡，我觉得这张就够了。其他账户我不公开，难道我都给她看了，她就肯改条件？

- **现场疑点：** 她知道工资卡不等于全部资产，仍默认未知资金承担婚宴首饰；共同账户提议让双方出钱的时点与用途直接冲突。
- **矛盾：** 她要求男方婚前先给个人彩礼，自己六万婚后用于家电搬家，还把婚宴首饰默认留给男方。
- **可靠度：** partial
#### 自由追问

##### 1. profile income and card:casual Questions:1

**林旭阳：** 婚宴和首饰另算。你身边有没有婚后一起管这些钱的例子？

**咨询者：** 我表姐家就是一起管。可她挣得比姐夫多，跟我们又不一样。我不想结了婚，连给自己买点东西都得商量。

- **source Anchor：** 我自己也会出钱
- **texture Role：** ramble
- **内部 ID：** profile-income-and-card:casualQuestions:1

#### 关键追问

##### 1. profile income and card:question Options:0

**林旭阳：** 姑娘，你刚才说自己也会出钱，那你准备拿多少？

**咨询者：** 我现在有八万四，最多拿六万。剩下的我得留点。

**林旭阳：** 这六万准备什么时候拿出来？

**咨询者：** 领证以后啊，添家电、搬家总要花钱。

**男方：** 那你爸说的二十万呢？

**咨询者：** 那是我爸给我的。怎么一到账就得算我们俩的？

**男方：** 我的就得领证前打进你的卡，你家的你自己留着？

**咨询者：** 彩礼本来就是给女方的。我爸给我的，又不是彩礼。

**林旭阳：** 那婚宴和首饰呢，你准备怎么出？

**咨询者：** 他家出吧。我一直以为是这样办的。

**男方：** 你问过我家没有？你这边倒给我安排好了。

**咨询者：** 平时吃饭、买展票都是你付，我就以为你也这么想。你来接我下班的时候，也没跟我算过这些啊。

**男方：** 吃顿饭跟办婚礼能一样吗？

**咨询者：** 行，那现在商量嘛。干嘛说得像我故意占你便宜一样。

- **source Anchor：** 我自己也会出钱
- **玩家所选怀疑方向：** 姑娘，你刚才说自己也会出钱，那你准备拿多少？
###### logic Contract

- **premise Anchor：** 我自己也会出钱
- **source Kind：** caller-statement
- **source Proves：** 她声称自己也会为婚后生活出钱，尚未说明数额和时点。
- **source Does Not Prove：** 另算条件不能证明男方有其他账户、愿意承担后续支出或已经接受这组安排。
- **answer Anchor：** 我现在有八万四
- **answer Adds：** 她默认男方家庭另付婚宴首饰，男方当场说明没有答应。
- **next Legal Question：** 可以让男方回应是否承担，并决定是否继续原定见父母安排。

- **矛盾：** 咨询者要求男方先交一笔个人保障，又默认未知账户承担后续婚宴和首饰。
- **是否核心项：** true
- **路线轴：** caller-credibility
- **路线口气：** pressure-point
- **内部 ID：** profile-income-and-card:questionOptions:0

#### 压力表演

- **意图钩子：** 条件表面开始松动
- **防备状态：** tense

#### question Sequence

- profile-income-and-card:questionOptions:0

### 场间实时反压

- **内部 ID：** profile-weekend-dinner-cancelled
- **类型：** interruptToast
- **cost：** 0
- **after Scene Index：** 6
- **from：** 临时双人连麦
- **声纹卡 ID：** case3-respondent
#### lines

##### 1. lines 1

**男方：** 周末的饭先取消吧。我回去跟我爸妈说，你也跟你家里说。我不想带着二十八万八去见你父母。

##### 2. lines 2

**咨询者：** 饭可以先不吃。可你跟介绍人别说是因为彩礼，就说你最近忙，往后放一放。

##### 3. lines 3

**男方：** 我不忙。我不接受刚才那几条，为什么不能照实说？

##### 4. lines 4

**咨询者：** 你这么一说，我妈肯定觉得是我没跟你谈好。你先把这次见面往后推，我再跟她说。

##### 5. lines 5

**男方：** 那二十八万八进你卡这条，你准备改吗？

##### 6. lines 6

**咨询者：** 我没说改。我只是让你别把话说得那么难听。

##### 7. lines 7

**男方：** 可我真不是因为忙。你让我撒这个谎，下次见面怎么办？

### 场间实时反压

- **内部 ID：** profile-marriage-price
- **类型：** interruptToast
- **cost：** 0
- **after Scene Index：** 6
- **from：** 连线继续
#### lines

##### 1. lines 1

**林旭阳：** 你还要按原来的条件谈，就回去跟你父母说。他不愿意，你让他说忙也没用啊。

##### 2. lines 2

**咨询者：** 我自己跟我妈说。

##### 3. lines 3

**咨询者：** 可我是真觉得他条件不错。要不然我也不至于跟他说这么多。

##### 4. lines 4

**林旭阳：** 那就看你愿意改什么，不能光让他改。

##### 5. lines 5

**咨询者：** 主播，你不是也帮人介绍对象吗？按我的条件，如果不找他，还能找到什么条件的？上限能到哪儿？

##### 6. lines 6

**林旭阳：** 你先说你要什么。收入、相处，还是结婚给你多少钱？

##### 7. lines 7

**咨询者：** 收入不能比他低吧。彩礼还是要有，房子也得有保障。不然女孩子结这个婚图什么？我又不想被物化。我的付出和青春，总得有人配得起吧。

#### choices

##### 1. 不想被物化，怎么又拿彩礼和房子当结婚的条件？

- **内部 ID：** price-versus-security
- **标签：** 不想被物化，怎么又拿彩礼和房子当结婚的条件？
###### lines

###### 1. lines 1

**咨询者：** 这是保障，又不是卖自己。什么都不要，万一以后过不下去，我怎么办？

###### 2. lines 2

**林旭阳：** 保障可以谈。可你刚问我换个人能找什么上限，列的又全是人家要给你多少。你不也在拿这些给自己标价吗？

###### 3. lines 3

**咨询者：** 我总不能换个人，条件还越谈越低吧？

- **direction Label：** 不想被物化，怎么又拿彩礼和房子当结婚的条件？
- **recap Aftertaste：** 我问了彩礼和房子的保障，她仍不愿降低条件。

##### 2. 付出和青春要人配得起，这不就是在标价？

- **内部 ID：** price-of-youth
- **标签：** 付出和青春要人配得起，这不就是在标价？
###### lines

###### 1. lines 1

**咨询者：** 我又没说一年青春多少钱。可我付出这么多，找个人还不如现在这个，图什么？

###### 2. lines 2

**林旭阳：** 那你说说，除了收入、彩礼和房子，你还想跟他过什么样的日子？

###### 3. lines 3

**咨询者：** 日子当然要好好过。可这些都没有，光说对我好有什么用？

- **direction Label：** 付出和青春要人配得起，这不就是在标价？
- **recap Aftertaste：** 我问了付出和青春的标价，她仍先看对方能给什么。

- **choice Mode：** single

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
- **front：** 08-01 至 08-18；工资账户期末余额 28.6 万。页面没有列出其他账户。
- **detail：** 这页只列一个工资账户：到账和期末余额都在，其他账户和转账授权都没有。
##### targets

- truthWithGap
- sceneHint

- **矛盾：** 男方不愿提供其他账户，女方知道材料范围，仍用单卡余额推断付款意愿。

#### 2. 彩礼传话

- **内部 ID：** daily-profile-scale
- **表现类型：** 聊天原话
- **标题：** 彩礼传话
- **front：** 女方母亲让介绍人先问二十八万八，理由是男方能自己承担二十三万八的 MBA 学费。
- **detail：** 女方母亲提出二十八万八，领证前转入女方个人账户，婚宴和首饰另算。
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
- **detail：** 女方提到男方吃饭用团购和积分，停车费两人分摊。
##### targets

- truthWithGap
- sceneHint

- **矛盾：** 日常节俭不能验证收入；工资流水只覆盖已提供的账户。

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
- **detail：** 介绍人转述了男方家境和女方家的彩礼条件；她没有查过男方的账户。
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
- **提示题：** 他交过这笔学费，你就觉得他拿得出彩礼吗？
- **材料：** 学校查询页和三笔缴费记录摆在一起。
##### 材料行

- 校名｜已显示
- 项目｜MBA
- 本科｜未显示
- 学费｜¥238,000｜本人账户分三次支付

##### 选项

###### 1. 还没拿到流水的时候，他说拿不出，你为什么不信？

- **标签：** 还没拿到流水的时候，他说拿不出，你为什么不信？
- **是否核心项：** true
- **矛盾：** 她因为男方过去付得起学费，推断当时仍有钱可付彩礼，因此坚持索要流水；历史支出不能证明当时余额。
- **反馈：** 还没拿到流水的时候，他说拿不出，你为什么不信？
- **人物反应：** 二十三万八的学费都是他自己交的，我就觉得他肯定有钱。他说拿不出，我当然想看看。
- **路线轴：** identity-wording
- **内部 ID：** profile-mba-gap:option:0
- **主播问句：** 还没拿到流水的时候，他说拿不出，你为什么不信？

###### 2. 缴费回单是以前的支出。上面有没有写他现在还剩多少？

- **标签：** 缴费回单是以前的支出。上面有没有写他现在还剩多少？
- **是否核心项：** false
- **反馈：** 图片和回单都可以是真的，它们仍然不能证明他现在有多少积蓄。
- **人物反应：** 回单只写以前交过二十三万八。现在剩多少，上面没写。
- **路线轴：** document-edge
- **内部 ID：** profile-mba-gap:option:1
- **主播问句：** 缴费回单是以前的支出。上面有没有写他现在还剩多少？

###### 3. 学费分三次交清。你有没有问，交完以后账户里还剩多少？

- **标签：** 学费分三次交清。你有没有问，交完以后账户里还剩多少？
- **是否核心项：** false
- **反馈：** 学费分三次交清，只能证明当时付过。现在账户里剩多少，这两页没写。
- **人物反应：** 没问过交完还剩多少。我当时盯着的是校名和二十三万八。
- **路线轴：** caller-credibility
- **内部 ID：** profile-mba-gap:option:2
- **主播问句：** 学费分三次交清。你有没有问，交完以后账户里还剩多少？

- **spoken Inquiry：** true

#### 2. 介绍链原话检视

- **内部 ID：** profile-introducer-double-speak
##### revalues

- profile-introducer-two-prices

- **标题：** 介绍链原话检视
- **提示题：** 两段介绍里，哪件事还需要向介绍人本人问清？
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
- **反馈：** 她说收入稳，有没有给过你们工资或者流水？
- **人物反应：** 没有。以前我以为她看过，才说得这么肯定。明天你帮我问一句，她到底看过什么。
- **路线轴：** process-control
- **内部 ID：** profile-introducer-double-speak:option:0
- **主播问句：** 她说收入稳，有没有给过你们工资或者流水？

###### 2. 收入稳是看过材料还是听来的

- **标签：** 收入稳是看过材料还是听来的
- **是否核心项：** true
- **反馈：** 她跟你说收入稳的时候，有没有说自己看过工资单？
- **人物反应：** 她没说看过材料。给我家的原话，只写了收入稳。明天你帮我问一句，她到底看过什么。
- **路线轴：** caller-credibility
- **内部 ID：** profile-introducer-double-speak:option:1
- **主播问句：** 她给女方家说收入稳。这句话，她有没有说是看过材料，还是听男方家说的？
- **矛盾：** 介绍人对两边都抬高好处、压低短处，条件版本被介绍链共同加工。

###### 3. 她说的“稳定”是多少钱

- **标签：** 她说的“稳定”是多少钱
- **是否核心项：** false
- **反馈：** 聊天只写了“收入稳”，没有工资数字，也没有核实记录。
- **人物反应：** 没报具体数，只说收入稳。我也没追着问。
- **路线轴：** money-flow
- **内部 ID：** profile-introducer-double-speak:option:2
- **主播问句：** 她说收入稳的时候，报过具体的工资数吗？

- **spoken Inquiry：** true

### 后台回流

#### 1. 表妹私信与家里群截图

- **内部 ID：** profile-family-chat-backflow
- **声音归属：** document
- **来源：** dm
- **出现界面：** 有人补了一张图
- **标题：** 表妹私信与家里群截图
- **触发矛盾：** 名校本科的误会被纠正后，自费 MBA 又被女方家换算成当前家底。
- **此刻出现原因：** 后台收到自称表妹的账号发来的私信，附有家里群截图。
- **提示题：** 这页家里群里，哪两句话必须连着看？
- **材料：** 后台私信
发送人：表妹
我也在群里。让她把两家的条件都说全吧，别吵到最后全怪介绍人。
附件：家里群截图

家里群截图
表妹转发的群聊原图
咨询者：本科不是那所，是后来读的 MBA。二十三万八，都是他自己交的。
母亲：那说明手里不会差。彩礼先问二十八万八，领证前打进她自己的卡。婚宴和首饰另算。
父亲：咱家宸直那三十万九月底到期，到时候拿二十万给她，她自己留着。
- **能证明：** 女方母亲因男方自费 MBA 推高彩礼，并要求领证前进女儿个人账户、婚宴首饰另算；与此同时，女方父亲给女儿的二十万元仍在宸直产品中。
- **仍不能证明：** 不能证明宸直到期一定无法兑付，也不能证明男方应当或有能力支付二十八万八。
- **路线轴：** external-corroboration
##### 选项

###### 1. 领证前转账和九月底到期

- **标签：** 领证前转账和九月底到期
- **是否核心项：** true
- **矛盾：** 女方家要求男方在领证前把钱转入女儿账户，婚宴首饰另算；自己那二十万元不但要等九月底，还准备留给女儿本人。
- **反馈：** 你爸的钱可以等九月底，为什么他的就得领证前给？
- **路线轴：** caller-credibility
- **主播问句：** 她家能等九月底，为什么要男方领证前转钱？

###### 2. MBA 二十三万八是他自己交的

- **标签：** MBA 二十三万八是他自己交的
- **是否核心项：** false
- **反馈：** 缴费单记的是以前付过的学费，没写他现在剩多少。
- **路线轴：** external-corroboration
- **主播问句：** 他以前交过二十三万八学费，现在也该拿得出来吧？

###### 3. 九月底到期

- **标签：** 九月底到期
- **是否核心项：** false
- **反馈：** 约定日期不是兑付保证。还要把它和女方家当天问出的彩礼放在一起看。
- **路线轴：** identity-wording
- **主播问句：** 说了九月底到期，就能保证届时这笔钱一定会给他俩用？

##### source Documents

###### 1. 后台私信

- **标题：** 后台私信
- **sender：** 发送人：表妹
###### 表格行

- 我也在群里。让她把两家的条件都说全吧，别吵到最后全怪介绍人。
- 附件：家里群截图

###### 2. 家里群截图

- **标题：** 家里群截图
- **sender：** 表妹转发的群聊原图
###### 表格行

- 咨询者：本科不是那所，是后来读的 MBA。二十三万八，都是他自己交的。
- 母亲：那说明手里不会差。彩礼先问二十八万八，领证前打进她自己的卡。婚宴和首饰另算。
- 父亲：咱家宸直那三十万九月底到期，到时候拿二十万给她，她自己留着。

#### 2. 介绍人分别对两家说的话

- **内部 ID：** profile-introducer-double-note
- **声纹卡 ID：** case3-introducer
- **来源：** introducer-note
- **出现界面：** 介绍人留了话
- **标题：** 介绍人分别对两家说的话
- **触发矛盾：** 介绍人对两边都抬高好处、压低短处，条件版本被介绍链共同加工。
- **此刻出现原因：** 茶馆聊完以后，介绍人沿用约见时的私聊补了一段文字，请主播别把未核实的好话说成她看过证明。
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
- **反馈：** 她替你说不计较学历，这话你同意过吗？
- **路线轴：** process-control
- **主播问句：** 她为了把饭局约成，替双方说过哪些没确认的话？

###### 2. 收入稳

- **标签：** 收入稳
- **是否核心项：** false
- **反馈：** 她这么说过，但她没有材料证明收入构成。
- **路线轴：** money-flow
- **主播问句：** 她说收入稳，就算看过收入证明了吗？

###### 3. 对学历不会太计较

- **标签：** 对学历不会太计较
- **是否核心项：** false
- **反馈：** 这句不是女方说的；还要继续查“收入稳”是谁告诉她的。
- **路线轴：** identity-wording
- **主播问句：** “对学历不会太计较”，是女方本人说的吗？

### 文档原件

#### 1. 学历、彩礼与两家资金边界

**学历、彩礼与两家资金边界**

学校查询页、缴费回单和工资卡来自男方；彩礼传话与父亲的安排来自家里群。

| 行 ID | 日期 | 类型 | 金额 | 对方/项目 | 备注 |
| --- | --- | --- | --- | --- | --- |
| p01 | 06-16 | 提醒 | —— | 某名校 MBA 项目 | 校名与项目可核 |
| p02 | 06-16 | 提醒 | ¥238,000 | MBA 学费缴费回单 | 本人账户分三次支付；本科另有学校 |
| p04 | 08-17 | 提醒 | ¥288,000 | 女方母亲→介绍人 | 听说 MBA 自费后提出；要求领证前转入女方个人账户 |
| p06 | 08-17 | 提醒 | ¥200,000 | 女方父亲口头安排 | 从下述 30 万宸直中划出；到期后给女儿自己留着 |
| p07 | 08-17 | 提醒 | 另算 | 婚宴与首饰 | 不包含在 28.8 万内；女方家希望男方另行承担 |
| p03 | 08-18 | 提醒 | ¥286,000 | 男方工资账户 | 08-01 至 08-18；期末余额；其他账户未提供 |
| p05 | 09-30 | 提醒 | ¥300,000 | 女方父母·宸直产品 | 持有页列明到期日；当前不能取 |

- **内部 ID：** case3-credential-balance
### 顾问留言

#### 1. 顾问留言 1

- **顾问 ID：** lin-matchmaker
- **此刻出现原因：** 收麦后，平时与主播合作婚介业务的小林老师发来语音。
老林，忙完回我电话，你那边相亲登记我还等着呢。刚才这通听得我茶都凉了。介绍人两头都能说，怎么真让这俩人坐下，一句也接不上？

### 对方留言

- **来源：** respondent-note
- **此刻出现原因：** 临时双人连麦结束后，男方又在后台补了一句，重申刚才答应公开到哪里。
- **夜 B 预告：** false
学校页、MBA 缴费和工资卡是我发的，你们可以问。别的账户我没给她，那些账户的情况也不想在直播里说。当时她要看收入，我就挑了工资卡，其他账户她问了，我没有回。饭、展票、接她下班，是我愿意做，也不等于我答应了这些条件。卡上有二十八万六，也不代表我要拿二十八万八，更不代表后面婚宴首饰都我出。

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

- **stage Judgement：** 二十八万八一分不改，还得让他对外说是自己忙。人家不同意，你连不去了都要替他编一句？
### quote Pick Candidates

- 本科不是。我工作以后去读的 MBA
- 条件不改，见面还说什么
- 彩礼先问二十八万八
- 彩礼领证前打到她自己的卡里，婚宴和首饰另算

### accusation Choices

#### 1. “本科不是。我工作以后去读的 MBA。”

- **标签：** “本科不是。我工作以后去读的 MBA。”
- **quote Source Scene Id：** profile-dinner-pause
- **责任角色：** respondent
- **主播回应：** 二十三万八已经交给学校了，怎么还能再算一遍给你家？

#### 2. “条件不改，见面还说什么？”

- **标签：** “条件不改，见面还说什么？”
- **quote Source Scene Id：** profile-proof-before-dinner
- **责任指向：** both
- **主播回应：** 你要看全部，他只给一张；他卡里二十八万六，你就要二十八万八。两边都挺会挑。

#### 3. “彩礼先问二十八万八。”

- **标签：** “彩礼先问二十八万八。”
- **quote Source Scene Id：** profile-family-chat-origin
- **requires Revised Scene Id：** profile-family-chat-origin
- **责任角色：** complainant
- **主播回应：** 你妈说家里帮不上，转头又加彩礼。这一缺钱，倒是催人多掏钱的理由了？

#### 4. “彩礼领证前打到她自己的卡里，婚宴和首饰另算。”

- **标签：** “彩礼领证前打到她自己的卡里，婚宴和首饰另算。”
- **quote Source Scene Id：** profile-family-chat-origin
- **责任角色：** complainant
- **主播回应：** 二十八万八先进你卡，婚宴首饰另算。他说不接受，你怎么又让他对外说自己忙？

### 今晚最后一句

#### 1. 他不接受这些条件。你想继续，就跟他谈；想换人，也别把自己的要求全推给父母。

- **内部 ID：** accompany
- **标签：** 他不接受这些条件。你想继续，就跟他谈；想换人，也别把自己的要求全推给父母。
- **主播台词：** 他不接受这些条件。你想继续，就跟他谈；想换人，也别把自己的要求全推给父母。
##### lines

###### 1. lines 1

**咨询者：** 那彩礼我还是要的。你要有合适的人，先把情况给我看看吧。

- **sequential：** true

### 正式结案

- **标题：** 他不肯给，她开始问下一位
- **结论：** 父母看到自费学费回单后提高彩礼。她说在劝和，却没有减条件，还自己发消息要求婚房加名。男方拒绝婚前转入她的个人账户；她随后问主播，换个对象能找到什么条件，彩礼仍不愿让。
#### 场景节拍

##### 1. 加价从哪来

- **标签：** 加价从哪来
自费学费二十三万八被女方母亲当成还能多给彩礼的依据。

##### 2. 怎样挽回

- **标签：** 怎样挽回
女方让他别生母亲的气，却没有答应减彩礼，并自己提出婚房加名。

##### 3. 接着问谁

- **标签：** 接着问谁
男方拒绝后，她询问下一位对象的条件上限，仍坚持彩礼和房子保障。

#### 已确认

- 学校图没有本科信息；工资流水覆盖 8 月 1 日至 18 日
- 二十三万八学费由男方自己承担；这是过去的支出，不是当前家底
- 二十八万八来自女方母亲；男方先说拿不出，女方要求流水后，他只提供工资账户
- 工资账户期末余额为二十八万六，其他账户没有提供
- 二十八万八要在领证前转进女方个人账户，婚宴和首饰另算
- 女方本人有八万四，最多愿意拿六万，准备领证后用于家电和搬家
- 女方父母的三十万元仍在宸直产品中，约定九月底到期；其中二十万元准备留给女儿本人
- 饭局取消后，她要求男方向介绍人说自己忙；男方拒绝，她仍未答应修改付款条件
- 女方亲口说明自己发消息提出婚房加名，并未答应降低彩礼
- 男方拒绝后，她向主播询问换人可找的条件，仍表示彩礼要有

#### 未决

- 男方是否有持续收入
- 男方其他账户里有多少，以及真实总家底
- 宸直产品九月底能否按约兑付
- 双方最终愿意拿多少、何时拿、进入谁的账户以及用于哪些项目
- 坦白条件后双方是否仍愿意继续

- **下一步：** 双方没有谈妥，周末饭局取消。她说自己跟母亲讲，随后请主播留意其他人选；主播没有承诺介绍。

- **story Interlude Recap：** 见面取消。她没有答应修改付款条件，转而询问主播能否介绍条件更好的人；主播没有答应。
### conclusion When Cleared

- **摘要：** 母亲看过男方自费 MBA 回单后提高彩礼；女方说在缓和，却保留数字并主动提出婚房加名。
- **followup：** 男方上麦后承认只交了工资账户，也拒绝了她提出的付法。她有八万四，最多愿意领证后拿六万买家电、搬家；父母答应的二十万留给她。男方的钱要先到，她家的钱可以等。
- **作者真相：** 她要二十八万八领证前进自己的卡，男方不肯。她说只差两千，他拒绝的却是这整笔钱的付法。今晚没谈拢。

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

- **followup Twist：** 回拨时，她说自己劝男方别生母亲的气，却没有答应减彩礼，还自己提出婚房加名。双方谈到各自的钱什么时候出、给谁用，最终没有谈成。
- **分享卡标题：** 二十八万八，对上二十八万六
- **分享卡正文：** 看过男方自费学费回单，彩礼从十八万八的参考加到二十八万八。她说在挽回，却又自己提了婚房加名。男方拒绝后，她开始询问下一位的条件，彩礼仍要有。
- **分享题：** 如果心里已经把对方放在条件较弱的位置，还把他的付出当成补差价，这段关系到底在谈感情，还是在谈身价？
- **作者真相：** 父母看到自费学费回单后提高彩礼。她说在劝和，却没有减条件，还自己发消息要求婚房加名。男方拒绝婚前转入她的个人账户；她随后问主播，换个对象能找到什么条件，彩礼仍不愿让。

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

- **focused Inquiry：** true
- **compact Closing：** true
- **single Closing Card：** true

### voice Tics

- **one Time Tic：**
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
- **protected Interest：** 保留彩礼进个人账户与婚房加名的要求，同时维持自己只是在缓和父母与男方关系的说法。
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
- **threatens：** 母亲看过男方自费 MBA 回单后提高彩礼；女方说在缓和，却保留数字并主动提出婚房加名。
- **first Response：** 先说父母只是替她多打听了一下。
- **after Proof：** 母亲看过男方自费 MBA 回单后提高彩礼；女方说在缓和，却保留数字并主动提出婚房加名。
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

- **live Beat Count：** 5
- **material Board Count：** 2
- **backflow Count：** 2
- **truth Boundary Prompt Count：** 0
- **case Specific Pressure：** 资料图先让女方家误认名校本科，自费 MBA 随后被换算成家底；介绍人带回二十八万八彩礼，男方说拿不出后被要求打流水，却只交工资账户。第二夜他刷礼物插麦，双方在公开授权范围内当场争到其他账户为何没交和女方家锁在宸直的三十万元。
#### what Player Does Besides Read

- 本段集中问询，问错留在本段重问
- 查阅本段原件
- 跨夜带回新材料
- 在当事人的决定处结束

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
- 男方随后只提供工资账户8 月 1 日至 18 日的流水，期末余额为二十八万六
- 资料里的 MBA 项目和本科经历不是一回事
- 他吃饭算团购、停车问 AA，节俭是真的
- 第一次饭局上问到资料时冷场了十几秒
- 介绍人说“收入稳”和“不计较学历”之前，都没问过本人
- 女方母亲得知 MBA 学费由男方自己承担后，让介绍人去问二十八万八彩礼
- 女方母亲看过自费 MBA 学费回单后，把参考的十八万八提高到二十八万八
- 男方平时承担大多数饭钱和展票，也接过咨询者下班、听她讲家里的烦恼；咨询者认为自己工作和家庭条件更好，曾把这些投入视为男方应该多做的部分
- 女方父母持有三十万元宸直产品，约定到期日在九月底
- 女方母亲提出二十八万八要在领证前打进女儿个人账户，婚宴和首饰另算
- 女方父亲说宸直到期后拿二十万元给女儿自己留着，没有承诺用来支付婚宴或首饰
- 男方表姐说资料是家里一起帮着整理的
- 第二夜男方刷礼物要求上麦，双方分别同意讨论已经公开的材料和各自原话

#### 被修剪

- 对方最初发学校材料时没有主动说明本科另有学校
- 对方只提供工资账户流水，女方知道范围并追问其他账户，他一直没有答复
- 咨询者把收入诉求说成只是家里想看稳定
- 母亲看过男方自费 MBA 回单后提高彩礼；女方说在缓和，却保留数字并主动提出婚房加名。
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
- 男方只提供工资账户8 月 1 日至 18 日流水，期末余额二十八万六；其他账户余额仍未知。
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

#### 1. profile proof before dinner:inquiry

- **内部 ID：** profile-proof-before-dinner:inquiry
##### scene Indexes

- 0

- **minimum Review Count：** 1

#### 2. profile dinner pause:inquiry

- **内部 ID：** profile-dinner-pause:inquiry
##### scene Indexes

- 1

- **minimum Review Count：** 1

#### 3. profile caller repeats label:inquiry

- **内部 ID：** profile-caller-repeats-label:inquiry
##### scene Indexes

- 2

- **minimum Review Count：** 1

#### 4. profile income and card:inquiry

- **内部 ID：** profile-income-and-card:inquiry
##### scene Indexes

- 6

- **minimum Review Count：** 1

## 8 月 23 日 · 收播以后

【8 月 23 日，回拨结束，直播灯熄了。】

【赵律师下班时送来今天新煮的汤。她回家后又打来电话，你刚倒了一碗。】

**赵律师（语音）：** 你刚才说的那笔宸直，女方家买的是哪一款？

**林旭阳：** 我只看见持有页，三十万，写着九月底到期。合同没上屏。

**赵律师（语音）：** 持有页写的是九月底。合同还没发来？

**林旭阳：** 没发。她爸那笔是留给女儿自己的，婚宴首饰照样让男方出。

【手机收到老方发来的语音。你对赵律师说了声“等一下”，点开播放。】

**老方（语音）：** 有个自称买过婚恋课的观众私信我，说听了今晚这通，想找卖课的人退款，问我能不能帮她看看。她只肯发一页打码课纲，怕被认出来；标题和来源都遮了，只剩安全感、态度、向上社交、退出这四个词。

**赵律师（语音）：** 她想退课，先让她把购买记录和完整课纲发来。四个词，看不出对方到底教了什么。

**赵律师（语音）：** 先别替人家发愁。你第一次去我家的时候，我爸妈要是先问你能拿多少，你还会来吗？

**林旭阳：** 还是会去。可那顿饭吃完，我有多少钱、愿意怎么花，得由我自己说。

语音停了，你把保温盒重新扣好。

【热过的汤又凉了。塑料盖轻轻响了一声。】

### 新闻推送

- **类型：** news-push

**宸直产品出现延期登记传闻**

宸直旗下多只产品被曝延期登记，平台回应称正在核对。

> 财经客户端推送 · 9 月 21 日 19:47

<a id="reading-section-10"></a>

# 第四幕：那张名单

- **案件 ID：** 02-tony
- **剧情 ID：** tony-multi-dating
- **内容包原题：** 今日来电：那张名单
- **时间：** 2024 年 9 月 21 日 · 最近
### 本案两次通话日期

- 2024-09-21
- 2024-09-22

## 本案人物

| 角色 | 性格 | 欲望 | 防御动作 | 知识边界 |
|---|---|---|---|---|
| 第四通咨询者·何 | 渴望被尊重的社交型人格 | 确认这个外形好、会说话又给她恋爱位置的男人，到底有多少真心；同时让主播支持把十二万按被骗要回来。 | 第一夜只砸裁过的名单和要钱，把左半张图读成女友名册；问到恋爱就承认他帅、自己也要这个位置。敲门时突然下线，不说警察是因涉案放款人来核实。开场不说十二万是自己让他代投。 | 知道主动代投、转账十二万与一百万门槛；查看手机时看到 Tony 同时交往的记录。Tony 九月十九日向她发过成交材料，她直播时没有承认收到；是否看过未知。她知道赎回困难，要求 Tony 自己还钱。 |
| Tony | 讨喜的即兴交易者 | 维持熟客信任，把愿意买高息的人留在自己的私人代投入口；收下何的十二万，让钱走个人账户，产品材料和后续查询也都经过自己。 | 把走他户说成替自己人凑门槛的顺手帮忙；先认自己人、晚档、走我户和已经提交，再把名单说成客户跟进。声称材料只给何本人，不向节目交代。不上麦。 | 自己同时与两人交往，也知道小何主动要求并入其户购买。收播后才向节目提供含其十二万的一百一十二万成交材料及九月十九日发给她的记录；无法证明她是否看过。 |
| Tony 案邻桌常客 | 厌烦套路的直肠子 | 提醒咨询者别把服务熟练误认成专属。 | 只说耳朵听见的，不负责解释。 | 只知道同席时听见的当面话，不知道麦外私聊。 |
| Tony 案小姐妹 | 酒桌知情却不愿当证人的朋友 | 确认何有没有已经转钱，同时把自己从推销链里摘出去。 | 只认酒桌上说过一百万起，不认自己让她买。 | 知道自己在酒吧酒桌说过高息档一百万起，也知道何听完就问自己那点钱够不够；后来听说赎回要排队才让何别再转。不知道 Tony 名单全文、十二万是否入产品、Tony 有无代销资格。 |
| Tony 案店长 | 急躁的防守型管理者 | 保住门店口碑和会员指标。 | 承认培训，不承认自己知道私人推进。 | 知道培训、会员制度和员工指标，不知道Tony全部私人对话。 |
| Tony 案前台 | 安静的程序执行者 | 把预约和会员记录办对，不卷入客人与技师的关系。 | 使用系统用语和权限边界。 | 只知道前台系统、预约和标准会员字段。 |
| Tony 案另一位女客 | 受伤后外放的感性派 | 澄清顾客身份，找回自己那笔钱，愿将转账与回单交警方核对。 | 只给自己的记录，不替何证明十二万已入产品，也不去店里堵人。 | 知道自己转过一百万、名单行写已买、Tony 发来的聊天和一张认购回单；不知道咨询者的十二万是否入了同一产品，也不知道其他顾客是否投过钱。 |
| Tony 案宸直柜员 | 守窗口权限的程序执行者 | 只确认公开产品门槛，不替私人转账作证。 | 只报高息档起投，其余推给系统户名。 | 只知道高息档个人认购起投一百万；代持代购、具体合同和兑付结果不在窗口可答范围。 |

## 【编剧资料】案件发动机

- **戏剧锚点：** Tony 的名单、恋爱名义下的相处、高息档一百万起投、她转到他户头的十二万、酒吧小姐妹的高息传闻、名单上另一位女客的认购回单
- **为何今晚发生：** 小姐妹先说产品最近在拖、提醒别再转，她才去翻 Tony 的手机，随后裁掉名单里的金额和代投字段来求助。她开场把诱因说成发现女客名单；实际更急的是十二万可能拿不回，想借节目公开施压。
### 公开求助

- **类型：** interest
- **求助内容：** 她想追回交到 Tony 手里的十二万，也想有人承认自己在感情里受了伤。她希望节目按恋爱被骗施压；主动代投被问清后，仍要求 Tony 交代钱与凭据，不愿自己的省略成为没人帮她追钱的理由。

- **核心物件作用：** Tony 的私人名单把熟客称呼、下次约、金额、起投和账户去向记在一起，让客户关系与代投都经过他。她第一夜只发左半边，把姓名、亲密度和下次约讲成女友名册；被裁掉的右半边和十二万转账随后把“被骗的恋爱钱”翻回她主动要求的代投，也留下 Tony 为什么把钱和原件都放在自己手里的问题。
- **咨询者所求：** 她和 Tony 确实谈过恋爱，也觉得他长得好看。她想把转到他手里的十二万说成被养鱼骗走的钱，好在听说可能拿不回以后翻脸追讨。她不想让直播间先知道：高息档是她在酒吧听小姐妹说的，自己不够一百万起投，是她让男友帮她买。
- **对方所求：** Tony 用留晚档、‘自己人’和私下约会维持熟客信任，再把愿意买高息的人接到自己的私人代投里。何的十二万走他个人账户，产品全名、合同、回单和实际下单账户都没有交到何手里；他不愿上麦说明资格与资金去向。
- **第三压力：** 酒吧小姐妹的高息传闻、名单上另一位女客来问钱、店里不能卖理财的边界、宸直起投门槛，以及放款人涉案后按借款人找上门的核实。
- **咨询者自利删减：** 咨询者开场已经说出要回这笔钱，并把名单讲成养鱼女友名册；她只发左半边截图，裁掉金额、起投和账户备注。她不先说自己确实以恋爱名义和他相处、也觉得他帅，更不说高息是自己在酒吧听小姐妹聊的、十二万是因为不够一百万门槛才让他代投。她把今晚说成发现被骗，不说自己是听说可能拿不回才翻脸。第一夜敲门时，她也不说来人是警察，更不说自己借过涉案放贷人的钱。
- **公开钩子：** 她翻到一份全是女人的名单，说他以谈恋爱为名养鱼，钱还在他那儿，问怎么要回来。
- **故事概述：** 第一夜先让裁过的名单被读成养鱼名册，再承认两人真实的恋爱相处和真实照顾都发生过；强光照进窗内，敲门声逼她突然下线。第二夜问出来人是警察，再把门店预约册、Tony 的私人跟进、完整名单和十二万转账放到一起：她主动绕门槛，他则把熟客、钱和产品材料都留在自己的私人代投入口。
- **悬念：** 她为什么一开口就要钱，却只发名单左半边；Tony 为什么让十二万走个人户，声称已经提交后又迟迟不交原件。
- **线索物件：** Tony 的私人名单、门店预约册与私人备忘录、十二万转账、酒吧小姐妹的高息传闻、另一位女客转发的认购回单

## 夜 A：第一次来电

【9 月 21 日，晚上八点。开播前，老方发来消息：“二十三号早上九点，改版方案给我。这回别再拖了。”你把消息关掉，接入今晚的热线。】

**咨询者：** 主播，我在线上吗？

#### 舞台标记

- **mood：** anxious

**林旭阳：** 你在的，请讲。

#### 舞台标记

- **mood：** listening

**咨询者：** 叫我小何吧。我昨晚在一个男的手机里看见张名单，上面全是女的。我一晚上没睡。

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

**咨询者：** 在谈，没公开过。他一直叫我自己人。

#### 舞台标记

- **mood：** anxious

**林旭阳：** 名单上写了什么？

#### 舞台标记

- **mood：** listening

**咨询者：** 亲密度、下次约，一排女人的名字。越看越不对。我当时就觉得，他是不是拿谈恋爱吊着一串人。而且我还有一笔钱在他那里。

#### 舞台标记

- **mood：** anxious

**林旭阳：** 钱是什么钱，怎么给他的？

#### 舞台标记

- **mood：** listening

**咨询者：** 你先听这张名单行不行？钱我会讲。我就想知道，他是不是对谁都这样。

**林旭阳：** 行。那名单你是怎么看见的？

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

【材料触发后的重述】 **咨询者：** 我看到的名字都是女的。我发的确实只有左半边。

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

##### 1. tony list as dating:casual Questions:0

**林旭阳：** 你发来的图，是整屏截的，还是先框了一块？

**咨询者：** 我框过。发给你们的是左边名字和亲密度。

- **source Anchor：** 截图发到后台
- **内部 ID：** tony-list-as-dating:casualQuestions:0

##### 2. tony list as dating:casual Questions:1

**林旭阳：** 一排名字全是女的。你当时是按女朋友数的，还是按客人？

**咨询者：** 我数过，八……不对，九个。

【停顿】

**咨询者：** 连我。

- **source Anchor：** 一排名字
- **内部 ID：** tony-list-as-dating:casualQuestions:1

##### 3. tony list as dating:casual Questions:2

**林旭阳：** 你按灭屏幕以前，有没有把右边几列一起截进去？

**咨询者：** 没有。我截的是左边。他出来还问我晚上吃什么。

- **source Anchor：** 我往下划
- **内部 ID：** tony-list-as-dating:casualQuestions:2

##### 4. tony list as dating:review Probes:0

**林旭阳：** 亲密度这一栏，Tony 有没有说过是按女朋友排的？

**咨询者：** 没有。我看到那些备注，就觉得他跟这些人都不一般。

- **内部 ID：** tony-list-as-dating:reviewProbes:0
- **source Anchor：** 备注写着亲密度
- **路线口气：** neutral

##### 5. tony list as dating:review Probes:1

**林旭阳：** 你看到自己那一行时，右边那些钱数也在吗？

**咨询者：** 在。但我发给小姐妹的只有左半边。

- **内部 ID：** tony-list-as-dating:reviewProbes:1
- **source Anchor：** 我那行也在
- **路线口气：** neutral

#### 关键追问

##### 1. tony list as dating:question Options:0

**林旭阳：** 你发来的图，每一行怎么都在右边同一个地方断了？

**咨询者：** 截得急……我就先发了我最在意的那半边。

**林旭阳：** 每一行都在同一个地方断。这不是截急了，是你自己裁的吧？

**咨询者：** ……我裁过。右边几列没发。

- **source Anchor：** 我把截图发到后台了
- **revised Source Anchor：** 确实只有左半边
- **玩家所选怀疑方向：** 你发来的图，每一行怎么都在右边同一个地方断了？
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
- **内部 ID：** tony-list-as-dating:questionOptions:0

##### 2. tony list as dating:question Options:1

**林旭阳：** 你看到亲密度那栏，最在意哪一行？

**咨询者：** 我自己的。他平时把我当自己人，手机里倒跟别的女人排在一起了。

- **source Anchor：** 全是女的
- **revised Source Anchor：** 名字都是女的
- **玩家所选怀疑方向：** 你看到亲密度那栏，最在意哪一行？
###### logic Contract

- **premise Anchor：** 全是女的
- **source Kind：** caller-statement
- **source Proves：** 名单可见行都是女性姓名，咨询者自己的名字也在其中。
- **source Does Not Prove：** 姓名性别不能证明每个人都和 Tony 建立了恋爱关系。
- **answer Anchor：** 我自己的
- **answer Adds：** 从裁图转回她的关系诉求，她在意自己也被列在客户之间；未揭露右侧金额。
- **next Legal Question：** 仍需从截图本身追问她没有发出的部分。

- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** caller-skeptical
- **内部 ID：** tony-list-as-dating:questionOptions:1
- **矛盾：** 开场用名单支持养鱼和要钱，发来的截图却在每一行同一个位置断掉。

#### 压力表演

- **意图钩子：** 先砸名单再要钱
- **防备状态：** guarded
##### 表情/听感

- **类型：** blink
她没接话，只听见一声短促的叹气

#### question Sequence

- tony-list-as-dating:questionOptions:0
- tony-list-as-dating:questionOptions:1

### 夜 A · 2｜tony-list-columns

**林旭阳：** 你裁掉的右半边，写的是什么？

**咨询者：** 右边记的是钱。我没把那几列发给你们。小姐妹让我把原图留好，我跟她说，名字和亲密度还不够吗？她没理我。

#### no Clue Reaction

**咨询者：** 右边我没发，我承认。先看我发来的这半张行不行？

- **interaction Mode：** lineReplay
- **线索职能：** missing-edge
- **错误框架：** 她发来的左半张截图已经足够说明整张名单。
#### 回收目标

- tony-exclusive-voice

- **说话人 ID：** he
- **现场疑点：** 她知道被裁掉的几列与钱有关，却迟迟不交原图。
- **矛盾：** 她明知表格右边还有钱和产品，还是主动裁掉了会改变名单性质的部分。
- **可靠度：** partial
#### 自由追问

##### 1. tony list columns:casual Questions:0

**林旭阳：** 小姐妹为什么让你留原图？

**咨询者：** 她只说别光留名字，原图别删。我问她什么意思，她说等见面再讲。

- **source Anchor：** 原图留好
- **texture Role：** ramble
- **内部 ID：** tony-list-columns:casualQuestions:0

##### 2. tony list columns:casual Questions:1

**林旭阳：** 你裁图的时候，知道右边跟钱有关吗？

**咨询者：** 知道。可我当时就想先让你们看他怎么记这些女的。

- **source Anchor：** 右边记的是钱
- **内部 ID：** tony-list-columns:casualQuestions:1

##### 3. tony list columns:question Options:1

**林旭阳：** 你说名字和亲密度还不够，她后来回你了吗？

**咨询者：** 没再回。前面她只让我把原图留好。

- **source Anchor：** 小姐妹让我把原图留好
- **玩家所选怀疑方向：** 小姐妹当时怎么回
- **路线轴：** caller-credibility
- **路线口气：** neutral
- **内部 ID：** tony-list-columns:questionOptions:1

##### 4. tony list columns:review Probes:0

**林旭阳：** 没发的那几列，原图还留着吗？

**咨询者：** 留着，我只是没截进去。

- **内部 ID：** tony-list-columns:reviewProbes:0
- **source Anchor：** 我没把那几列
- **路线口气：** neutral

##### 5. tony list columns:review Probes:1

**林旭阳：** 她没回以后，你还问过她吗？

**咨询者：** 没有，我就来找你了。

- **内部 ID：** tony-list-columns:reviewProbes:1
- **source Anchor：** 她没理我
- **路线口气：** neutral

#### 关键追问

##### 1. tony list columns:question Options:0

**林旭阳：** 跟钱有关的几列，为什么偏偏没发过来？

**咨询者：** 那几列是钱的事。我想先说他怎么对我，放一起，你们又要先问我为什么转钱。

**林旭阳：** 你要把钱追回来，那半张总得拿出来吧。

**咨询者：** 我会发。可他叫自己人、留晚档，那些也不是我编的啊。

- **source Anchor：** 右边记的是钱
- **玩家所选怀疑方向：** 跟钱有关的几列，为什么偏偏没发过来？
###### logic Contract

- **premise Anchor：** 右边记的是钱
- **source Kind：** caller-statement
- **source Proves：** 她承认裁掉与钱有关的列；原图尚未交来。
- **source Does Not Prove：** 第一夜仍不能确认具体金额、产品名称或资金去向。
- **answer Anchor：** 那几列是钱的事。我想先说他怎么对我，放一起，你们又要先问我为什么转钱。
- **answer Adds：** 那几列是钱的事。我想先说他怎么对我，放一起，你们又要先问我为什么转钱。我会发。可他叫自己人、留晚档，那些也不是我编的啊。
- **next Legal Question：** 可问朋友此前提过什么，具体产品、起投与账户安排待次日材料。

- **矛盾：** 她先用半张名单讲感情问题，却拒绝解释自己裁掉的金额栏。
- **是否核心项：** true
- **路线轴：** document-edge
- **路线口气：** pressure-point
- **内部 ID：** tony-list-columns:questionOptions:0

#### 压力表演

- **意图钩子：** 起投不是约会词
- **防备状态：** guarded

#### question Sequence

- tony-list-columns:questionOptions:0

#### 场尾自动拍

##### lines

###### 1. lines 1

【她没有把右半张发来。】

###### 2. lines 2

**林旭阳：** 行，那说说你们俩。

#### closure Contract

- **entry Anchor：** 我没把那几列发给你们
- **closer Anchor：** 说说你们俩
- **adds：** 她承认裁掉的是与钱有关的列，答应补图但尚未发送。
- **open Edge：** 约会是不是真的，她自己怎么说；半张名单还要把称呼和钱分开看。
- **route Independent：** true

### 夜 A · 3｜tony-exclusive-voice

**林旭阳：** 你们俩是怎么走到一起的？

**咨询者：** 我一开始就觉得他长得好看，他总给我留最晚那档，也叫我自己人。约会也是真的，不是只有剪头的时候见。

【材料触发后的重述】 **咨询者：** 我确实想跟他谈。他没带我见朋友，我就一直没追问。可自己人是他叫的，晚档他也留了。

#### no Clue Reaction

**咨询者：** 他就是这么叫的。别的我现在不想说。

- **interaction Mode：** lineReplay
- **线索职能：** misdirect
- **错误框架：** 真约会和真帅足以证明他在用恋爱骗人。
#### 回收目标

- tony-list-as-dating

- **说话人 ID：** he
- **现场疑点：** 两人的恋爱和亲密相处确实发生过，仍不能证明名单是女友名册。
- **矛盾：** 她用真约会给养鱼垫底，却说他从没公开。
- **可靠度：** mixed
#### 自由追问

##### 1. tony exclusive voice:casual Questions:0

**林旭阳：** 他叫你自己人、留晚档。你当时有没有问过，店里别人是不是也这样？

**咨询者：** 没问。同事推荐我去剪头，只说技术好。我第一次去就觉得他长得好看，后来一直找他。

- **source Anchor：** 我一开始
- **内部 ID：** tony-exclusive-voice:casualQuestions:0

##### 2. tony exclusive voice:casual Questions:1

**林旭阳：** 你固定找他，是因为手艺，还是因为他把最晚那档留给你？

**咨询者：** 两样都有。手艺好，我上班时间跟别人不太一样，经常要见人，头发隔一阵就得弄。他肯给我留最晚的号。

- **source Anchor：** 长得好看
- **内部 ID：** tony-exclusive-voice:casualQuestions:1

##### 3. tony exclusive voice:casual Questions:2

**林旭阳：** 他有没有当着别人维护过你？

**咨询者：** 旁边有个客人说，女孩子半夜下班不像正经工作。他当场回了一句：“人家上自己的班，关你什么事。”我那时候真挺感激他的。

- **source Anchor：** 叫我自己人
- **内部 ID：** tony-exclusive-voice:casualQuestions:2

##### 4. tony exclusive voice:casual Questions:3

**林旭阳：** 最晚那档他给你留了多久，是从第一次剪头就开始，还是后来才有？

**咨询者：** 一年多。最开始就是普通剪头，最近几个月才越走越近。

- **source Anchor：** 最晚那档
- **内部 ID：** tony-exclusive-voice:casualQuestions:3

##### 5. tony exclusive voice:casual Questions:4

**林旭阳：** 约会也是真的。第一次吃饭，是你下班去等他，还是他收店后来找你？

**咨询者：** 他收店后来找我。大概三个月前，我也刚下班，就在旁边吃了碗面。后来又吃过两次。

- **source Anchor：** 约会也是真的
- **内部 ID：** tony-exclusive-voice:casualQuestions:4

##### 6. tony exclusive voice:casual Questions:5

**林旭阳：** 叫你自己人的时候，是当着客人，还是私下发语音？

**咨询者：** 私下也有。有次他说店长又骂他了，最后来一句：“也就你肯听我说这些。”那条语音我一直留着。

- **source Anchor：** 自己人
- **内部 ID：** tony-exclusive-voice:casualQuestions:5

##### 7. tony exclusive voice:casual Questions:6

**林旭阳：** 他总给你留最晚那档。留号的时候，有没有说过只给你留？

**咨询者：** 没说过只给我。

【停顿】

**咨询者：** 他自己说二十九，晚档也确实留了。

- **source Anchor：** 长得好看
- **内部 ID：** tony-exclusive-voice:casualQuestions:6

##### 8. tony exclusive voice:question Options:1

**林旭阳：** 他叫你自己人时，你怎么回的？

**咨询者：** 我回他，有事就找我。我也想跟他多聊一会儿。

- **source Anchor：** 也叫我自己人
- **玩家所选怀疑方向：** 她怎么回应深夜倾诉
- **路线轴：** caller-credibility
- **路线口气：** neutral
- **内部 ID：** tony-exclusive-voice:questionOptions:1

#### 关键追问

##### 1. tony exclusive voice:question Options:0

**林旭阳：** 名单上其他人，你见过谁跟他约会吗？

**咨询者：** 我又不可能天天跟着他。可他也给别人留晚档、叫自己人，我看着就恶心。

- **source Anchor：** 约会也是真的
- **revised Source Anchor：** 自己人是他叫的
- **玩家所选怀疑方向：** 名单上其他人，你见过谁跟他约会吗？
###### logic Contract

- **premise Anchor：** 约会也是真的
- **source Kind：** caller-statement
- **source Proves：** 她和 Tony 确实谈恋爱、约会，留晚档和情绪上的照顾也真实存在。
- **source Does Not Prove：** 不能证明他承诺排他关系，也不能证明名单上其他人是女友。
- **answer Anchor：** 我又不可能天天跟着他。可他也给别人留晚档、叫自己人，我看着就恶心。
- **answer Adds：** 我又不可能天天跟着他。可他也给别人留晚档、叫自己人，我看着就恶心。
- **next Legal Question：** 核对完整名单与转账，不能由她的恋爱关系推出其他行也全是女友。

- **矛盾：** 她开场把自己写成被吊着的人，这里承认恋爱位置是她要的。
- **是否核心项：** true
- **路线轴：** identity-wording
- **路线口气：** trust-but-verify
- **内部 ID：** tony-exclusive-voice:questionOptions:0

##### 2. tony exclusive voice:overlap

**林旭阳：** 除了留晚档，你在他手机里还看到过什么？

**咨询者：** 有一个女生问他，周末要不要一起过交往纪念日。他回她，说当然陪女朋友，还发了他们八月十五号住酒店的合照。八月十七号他才跟我说，只有我一个女朋友。两段日期都在，我一起截下来了。

**林旭阳：** 你们这两段时间确实重着。但那张名单上的周，她也是？

**咨询者：** 周我不认识。那行也没写亲密度，我昨晚就想先把人都找到。

- **source Anchor：** 约会也是真的
- **revised Source Anchor：** 自己人是他叫的
- **玩家所选怀疑方向：** 除了留晚档，你在他手机里还看到过什么？
###### logic Contract

- **premise Anchor：** 约会也是真的
- **source Kind：** caller-statement
- **source Proves：** 她和 Tony 确实谈恋爱、约会，留晚档和情绪上的照顾也真实存在。
- **source Does Not Prove：** 除这两段交往外，不能推出其他名单行的关系。
- **answer Anchor：** 有一个女生问他
- **answer Adds：** 手机里的两段带日期对话与合照显示另一段交往重叠；不能把名单全部当女友。
- **next Legal Question：** 核对完整名单与转账，不能由她的恋爱关系推出其他行也全是女友。

- **矛盾：** 她开场把自己写成被吊着的人，这里承认恋爱位置是她要的。
- **是否核心项：** true
- **路线轴：** identity-wording
- **路线口气：** trust-but-verify
- **内部 ID：** tony-exclusive-voice:overlap

#### 压力表演

- **意图钩子：** 真约会垫在养鱼下面
- **防备状态：** guarded
##### 表情/听感

- **类型：** shift
她说话越来越快，中间不留停顿

#### question Sequence

- tony-exclusive-voice:questionOptions:0
- tony-exclusive-voice:overlap

### 夜 A · 4｜tony-bar-rumor-hangup

**林旭阳：** 小姐妹让你留原图，她之前跟你聊过钱的事吗？

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

##### 1. tony bar rumor hangup:casual Questions:0

**林旭阳：** 她说利息挺高。有没有说过起投要多少，还是只报了息？

**咨询者：** 说过我那点钱不够。我当时也没问到底差多少，觉得跟我没什么关系。

- **source Anchor：** 有个东西
- **内部 ID：** tony-bar-rumor-hangup:casualQuestions:0

##### 2. tony bar rumor hangup:casual Questions:1

**林旭阳：** 你只记住息挺高。当时有没有问，是谁在卖、要从哪转？

**咨询者：** 没问。她随口一说，我也没当场追着问。我只记住息挺高。

- **source Anchor：** 没跟她细问
- **内部 ID：** tony-bar-rumor-hangup:casualQuestions:1

##### 3. tony bar rumor hangup:question Options:1

**林旭阳：** 她提这一嘴的时候，有没有把产品和 Tony 的店放在一起说？

**咨询者：** 没有。是在外面聚会时听的。具体在哪儿，我不想在直播里说。

- **source Anchor：** 小姐妹提过一嘴
- **玩家所选怀疑方向：** 传闻有没有绑到店里
- **路线轴：** identity-wording
- **路线口气：** neutral
- **内部 ID：** tony-bar-rumor-hangup:questionOptions:1

#### 场尾自动拍

##### lines

###### 1. lines 1

【听筒里传来一阵拉动帘子的声音。】

###### 2. lines 2

**咨询者：** 等一下，外面车灯晃进来了，我拉下窗帘。

###### 3. lines 3

【门外传来两下敲门声。】

【音效：sfx.case2.door-knock】

###### 4. lines 4

**咨询者：** 我先去看看。

#### closure Contract

- **entry Anchor：** 之前跟你聊过钱的事
- **closer Anchor：** 我先去看看
- **adds：** 第一夜在高息来源未说完时被强光和敲门打断；她没有解释门外是谁。
- **open Edge：** 昨晚是谁敲门，她为什么立刻下线，来人跟她隐瞒的钱有没有关系。
- **route Independent：** true

#### 关键追问

##### 1. tony bar rumor hangup:question Options:0

**林旭阳：** 小姐妹当时到底跟你说了多少？

**咨询者：** 她说有个东西利息高。

**林旭阳：** 就这一句？

**咨询者：** 她还说，不是我手里那点钱能买的。你别问着问着，又成我自己的问题了。

**林旭阳：** 我就想问，这个高息跟你转给他的钱有没有关系？

**咨询者：** 听过收益高就算我该知道？我昨晚看见一排女人才觉得不对，你别又全问钱。

- **source Anchor：** 小姐妹提过一嘴
- **玩家所选怀疑方向：** 小姐妹当时到底跟你说了多少？
###### logic Contract

- **premise Anchor：** 小姐妹提过一嘴
- **source Kind：** caller-statement
- **source Proves：** 咨询者在翻名单以前就听过高息产品，也知道自己手里的钱够不上门槛。
- **source Does Not Prove：** 听过高息不等于知道被骗；尚未证明她听完后转了钱，也尚未证明产品就是宸直。
- **answer Anchor：** 不是我手里那点钱能买的
- **answer Adds：** 她知道自己够不上门槛，却把后来找谁帮忙掐断。
- **next Legal Question：** 可以问她后来做了什么，不能把听过传闻写成已经买成产品。

- **矛盾：** 她开场只讲名单里的女人，追问产品后才补出自己早听过高息、知道起投门槛；这不代表她当时已知产品有风险。
- **是否核心项：** true
- **路线轴：** caller-credibility
- **路线口气：** pressure-point
- **内部 ID：** tony-bar-rumor-hangup:questionOptions:0

#### 压力表演

- **意图钩子：** 高息她早听过
- **防备状态：** guarded
##### 表情/听感

- **类型：** shift
她压低了声音，像在听屋里别的动静

#### question Sequence

- tony-bar-rumor-hangup:questionOptions:0

### 中段立场快照

- **段后触发：** 3
- **kicker：** 接着问
- **提示题：** 裁图和相处都听过了，你更想接着问什么？
- **说明：**
- **after Pick Line：** 她说右边有钱和产品。那些内容，为什么让她想先来讲名单？
- **continue Label：** 继续听
- **recap Kicker：** 这次问到的事
#### 选项

##### 1. 他对名单里别的人，也这么叫、这么留晚档吗？

- **内部 ID：** respondent-problem
- **标签：** 他对名单里别的人，也这么叫、这么留晚档吗？
- **摘要：** 他对名单里别的人，也这么叫、这么留晚档吗？
- **反馈：** 我就想知道这个。要是对谁都说自己人，那我算什么？
- **recap：** 他对名单里别的人，也这么叫、这么留晚档吗？
- **主播回应：** 我就想知道这个。要是对谁都说自己人，那我算什么？
- **closing Title：** 称呼、预约与真实关系
###### callback Lines

###### 1. callback Lines 1

**咨询者：** 名单上别人跟他到底什么关系，我也问过了。

##### 2. 你裁掉的那几列，能把原图拿来吗？

- **内部 ID：** industry-gray
- **标签：** 你裁掉的那几列，能把原图拿来吗？
- **摘要：** 你裁掉的那几列，能把原图拿来吗？
- **反馈：** 能。但那些钱跟我说他有别的女人，是两件事吧？
- **recap：** 你裁掉的那几列，能把原图拿来吗？
- **主播回应：** 能。但那些钱跟我说他有别的女人，是两件事吧？
- **closing Title：** 补全名单上的钱款记录
###### callback Lines

###### 1. callback Lines 1

**咨询者：** 完整名单我带来了，右边也在。

##### 3. 你现在最急的是问清关系，还是把钱拿回来？

- **内部 ID：** caller-complicit
- **标签：** 你现在最急的是问清关系，还是把钱拿回来？
- **摘要：** 你现在最急的是问清关系，还是把钱拿回来？
- **反馈：** 钱先还我。关系我已经不想谈了。
- **recap：** 你现在最急的是问清关系，还是把钱拿回来？
- **主播回应：** 钱先还我。关系我已经不想谈了。
- **closing Title：** 她要回的这笔钱
###### callback Lines

###### 1. callback Lines 1

**咨询者：** 我今天还是来问这笔钱的，他得给我个说法。

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
- **kicker：**
- **budget：** 0
- **min Actions：** 0
- **max Actions：** 0
- **continue Label：** 进入白天调查
#### actions

##### 1. 看门店发来的说明

- **内部 ID：** reopen-training
- **标签：** 看门店发来的说明
- **摘要：** 门店刚把一段说明转到后台，看看店里认不认这项业务。
- **cost：** 0
- **类型：** backflowEarly
###### 授予库存

- training-no-column

- **hook Id：** tony-manager-training-note
- **scene Text：** 店长与熟客发来的材料：门店培训卡
店长发来的门店原页
记需求
约下次
晚档优先

上周预约聊天
熟客发来的 Tony 私聊截图
Tony：上周那个，你听完了吗？自己人，晚档给你留。
熟客：听过了，没钱。剪头就剪头，别又跟我说那个。

店长的后台留言
发送人：店长
我们店只做美发，也没让员工替客人收这种钱。Tony 私下跟客人说了什么，你们问他本人，别把店也写进去。

##### 2. 回女客私信

- **内部 ID：** other-caller-dm
- **标签：** 回女客私信
- **摘要：** 周发来材料，可以回一句。
- **cost：** 0
- **类型：** backflowEarly
- **hook Id：** tony-other-caller-dm
###### 授予库存

- side-other-caller

- **scene Text：** 周发来的材料：周看到了同一预约群里的回放，从节目入口发来私信：“我也是顾客，我想查的是自己的钱。”

周女士说：“我就是名单上写一百万、已买的那位客人。他给我发过一张回单。我不去店里闹，材料可以交警方。回单是不是对应我那笔钱，让他们查。”

##### 3. 听小何新发来的语音

- **内部 ID：** listen-dryer
- **标签：** 听小何新发来的语音
- **摘要：** 后台新到一条她保存的 Tony 店内语音。
- **cost：** 0
- **类型：** playback
###### 授予库存

- 吹风机回放

###### script

- **音频提示：** voice.case2.dryer-message
- **clip Label：** Tony · 店内语音
- **clip Line：** “今晚店长又说我了。也就你肯听我说这些。”话音底下，吹风机一直没停。
- **host Note：** 语音我听见了。那名单上的人，有谁回过你吗？
- **speaker：** Tony（录音）

- **flow Mode：** linear

## 白天调查

- **白天开场：** 小何补来了完整名单和转账，也把提过高息的朋友拉进私聊。你按周的回单上的机构名找到公开咨询电话；店长另发来消息，约你下午到店。
- **白天行动预算：** 0
- **最少白天场景：** 4
### 地点 1

- **内部 ID：** day-tony-friend-studio
- **标签：** 工作室·小何牵线的语音
- **舞台背景：** day-studio
- **类型：** studio
#### 场景正文

- **access：** 何把节目追问发给聊过高息的朋友，请她证明自己不是凭空听来的；朋友怕被说成推销人，主动提出在何拉起的私聊中说清原话。
小何把那位朋友拉进私聊。朋友开工前接起语音，说一会儿还要去上班。

- **路线轴：** process-control
##### cast

- 小姐妹
- 你

##### 场景节拍

###### 1. day tony friend studio:beat:0

**小姐妹：** 她是不是跟你说成我劝她买的了？我可没劝，她那点钱根本就不够。

#### 舞台标记

- **内部 ID：** day-tony-friend-studio:beat:0

###### 2. tony friend original question

**你：** 你当时怎么跟她说的？

#### 舞台标记

- **内部 ID：** tony-friend-original-question

###### 3. tony friend original reply

**小姐妹：** 酒桌上聊起来的，我说利息是高，可那档一百万起。她问自己能不能买，我还笑她想得美。

#### 舞台标记

- **内部 ID：** tony-friend-original-reply

###### 4. day tony friend studio:beat:1

**你：** 你说了不够，她就不问了？

#### 舞台标记

- **内部 ID：** day-tony-friend-studio:beat:1

###### 5. day tony friend studio:beat:2

**小姐妹：** 反正当着我没再问。后来怎么跟 Tony 聊的，我哪知道。

#### 舞台标记

- **内部 ID：** day-tony-friend-studio:beat:2

###### 6. day tony friend studio:beat:3

**你：** 后来你们还聊过这个产品吗？

#### 舞台标记

- **内部 ID：** day-tony-friend-studio:beat:3

###### 7. day tony friend studio:beat:4

**小姐妹：** 最近有人说赎回要排队。我怕她已经转了，才让她别再转。她回我一句：我去翻他手机。

#### 舞台标记

- **内部 ID：** day-tony-friend-studio:beat:4

##### earned Item Ids

- 一百万门槛
- 翻手机的时间

- **获得物件：** 一百万门槛
- **source Note：** 小何联系了那位提过高息的朋友，拉起私聊；你在工作室接通她的语音。

### 地点 2

- **内部 ID：** day-tony-manager-doorstep
- **标签：** 工作室·拨打公开咨询电话
- **舞台背景：** day-studio
- **类型：** studio
#### 场景正文

- **access：** 主播按周提供的回单机构名查找公开客服渠道，咨询公开认购规则；客服履行一般咨询职责，不查第三人账户，也不确认截图真伪。
周发来的回单上有机构名。你按公开渠道找到宸直的咨询电话，接线柜员只答业务规则。

- **路线轴：** external-corroboration
- **获得物件：** 宸直窗口答复
##### cast

- 柜员
- 你

##### 场景节拍

###### 1. day tony manager doorstep:beat:0

**柜员：** 你问的那类产品，单笔认购至少一百万，还要做投资者资格和风险匹配。

#### 舞台标记

- **内部 ID：** day-tony-manager-doorstep:beat:0

###### 2. day tony manager doorstep:beat:1

**你：** 如果钱先转到别人户头，再由他来买呢？

#### 舞台标记

- **内部 ID：** day-tony-manager-doorstep:beat:1

###### 3. day tony manager doorstep:beat:2

**柜员：** 系统只认合同上的委托人。你没有产品全名和合同编号，我查不了。

#### 舞台标记

- **内部 ID：** day-tony-manager-doorstep:beat:2

###### 4. day tony manager doorstep:beat:3

**柜员：** 这边只能答业务规则。你要问具体哪笔，还是请合同上的委托人来联系。

#### 舞台标记

- **内部 ID：** day-tony-manager-doorstep:beat:3

- **source Note：** 周的回单提供机构线索；你按机构名找到公开咨询电话。

### 地点 3

- **内部 ID：** day-tony-shop-observe
- **标签：** 理发店外·等店长
- **舞台背景：** day-city
- **类型：** observe
#### 场景正文

- **access：** 店长因何在预约群追问而约主播到店说明门店业务；主播提前到门外等候，未进入员工区，也未要求顾客提供资料。
店长约你傍晚五点到店。你提前几分钟到了，坐在同侧奶茶店外摆位，离门三四步。隔着玻璃能看见动作；门开时漏出几句招呼。

- **路线轴：** external-corroboration
##### cast

- Tony（店内）
- 熟客
- 前台
- 店长

##### 场景节拍

###### 1. day tony shop observe:beat:0

**Tony（店内）：** 姐，先坐会儿。

#### 舞台标记

- **内部 ID：** day-tony-shop-observe:beat:0

###### 2. day tony shop observe:beat:1

**Tony（门边）：** 自己人还排什么队啊。我把手上这个做完就轮你。

#### 舞台标记

- **内部 ID：** day-tony-shop-observe:beat:1

###### 3. day tony shop observe:beat:2

**熟客：** 你可少来。今天就补颜色，别又跟我说那个。我没钱。

#### 舞台标记

- **内部 ID：** day-tony-shop-observe:beat:2

###### 4. day tony shop observe:beat:3

**Tony（门边）：** 行，不说那个。你先坐，我这边马上好。

#### 舞台标记

- **内部 ID：** day-tony-shop-observe:beat:3

###### 5. day tony shop observe:manager arrival

**店长：** 来了？刚才在忙。培训卡原页在这儿，店里没教过起投、走谁的户。Tony 私下收的钱你问他，别写成在我们店里买的。

#### 舞台标记

- **内部 ID：** day-tony-shop-observe:manager-arrival

##### earned Item Ids

- 门边那句自己人

- **获得物件：** 门边那句自己人
- **source Note：** 店长主动约你来说明情况，你在门外等她忙完。

### 地点 4

- **内部 ID：** day-tony-member-docs
- **标签：** 后台·昨夜的半张名单
- **舞台背景：** day-document
- **类型：** document
#### 场景正文

- **access：** 白天只查看小何第一夜已经发来的半张名单。
- **document Id：** case2-roster-cropped
- **路线轴：** document-edge
- **获得物件：** 裁过的半张名单
- **source Note：** 小何第一夜发来的半张名单；右侧列仍未收到。

### 幕间物件映射

- **side other caller：** 周发来的材料
- **training no column：** 门店的说明

## 夜 B：回拨

- **收麦锚点：** 门外传来两下敲门声
- **收麦舞台：** 她没有解释门外是谁，电话很快断了。
- **hangup Audio Cue Id：** sfx.phone.disconnect
- **主播留话：** 我听见敲门了。你先确认安全，方便的时候给后台留句话。
### 回拨衔接

#### lines

##### 1. lines 1

**咨询者：** 我现在在我妈家，没事。完整截图和转账都补发了。

##### 2. lines 2

**林旭阳：** 没事就好。材料我收到了。

### 回拨立场

- **against Caller：** 让他帮我买是我问的，这我认。可我没答应被写成女朋友名册拿去养鱼。
- **with Caller：** 昨晚下线以后，我折腾到很晚。白天你查到什么，等我先把昨晚的消息说完。

### 夜 B · 1｜tony-who-messaged

**林旭阳：** 昨晚后来怎么样，你先说吧。

**咨询者：** 昨晚是警察来核实我另外一笔借款，没问 Tony。我借钱也是想多凑点跟着买，多少今晚不说。那十二万转进他户里了，我现在只想拿回来。

#### no Clue Reaction

**咨询者：** 我现在就想拿回那十二万，别又扯到其他借款上。

- **interaction Mode：** lineReplay
- **线索职能：** reversal
- **错误框架：** 她只因男友和别的女人来往才开始追钱。
#### 回收目标

- tony-bar-rumor-hangup

- **说话人 ID：** he
- **现场疑点：** 她先听到赎回拖延才翻手机，名单上的女人未必是她查钱的起因。
- **矛盾：** 她先从朋友处听到产品，再找 Tony 代买；先讲养鱼，掩住了自己主动买入的经过。
- **可靠度：** mixed
#### 自由追问

##### 1. tony who messaged:casual Questions:0

**林旭阳：** 他们核实的是你自己那笔借款，还是也问了 Tony 这十二万？

**咨询者：** 只问我自己那笔。十来分钟，问我什么时候借的、怎么联系上的。Tony 那笔他们没问。

- **source Anchor：** 核实我另外一笔借款
- **内部 ID：** tony-who-messaged:casualQuestions:0

#### 关键追问

##### 1. tony who messaged:question Options:0

**林旭阳：** 十二万已经转过去了，什么事让你开始怕拿不回来？

**咨询者：** 小姐妹说，那个产品赎回在排队，让我别再转。我越想越怕，才去翻他的手机。结果钱没找着，看见那么一排名单。

**林旭阳：** 高息也是这个小姐妹告诉你的？

**咨询者：** 对。我在酒吧做营销，订台卖酒，她在酒桌上跟我说的。Tony 没先给我讲这个，是我后来去问他。

- **source Anchor：** 十二万
- **玩家所选怀疑方向：** 十二万已经转过去了，什么事让你开始怕拿不回来？
###### logic Contract

- **premise Anchor：** 十二万
- **source Kind：** caller-statement
- **source Proves：** 她已经说明警方核实自己的借款，今晚仍要追回 Tony 收的十二万。
- **source Does Not Prove：** 不能证明她涉嫌违法，也不知道她借了多少、是否仍欠。
- **answer Anchor：** 小姐妹说，那个产品赎回在排队，让我别再转。我越想越怕，才去翻他的手机。结果钱没找着，看见那么一排名单。
- **answer Adds：** 小姐妹说，那个产品赎回在排队，让我别再转。我越想越怕，才去翻他的手机。结果钱没找着，看见那么一排名单。对。我在酒吧做营销，订台卖酒，她在酒桌上跟我说的。Tony 没先给我讲这个，是我后来去问他。
- **next Legal Question：** 沿她主动买入与听到赎回拖延的先后，追代投经过和实际凭据。

- **矛盾：** 她先从朋友处听到产品，再找 Tony 代买；先讲养鱼，掩住了自己主动买入的经过。
- **是否核心项：** true
- **路线轴：** document-edge
- **路线口气：** pressure-point
- **内部 ID：** tony-who-messaged:questionOptions:0

#### 压力表演

- **意图钩子：** 她什么时候开始追十二万
- **防备状态：** guarded
##### 表情/听感

- **类型：** shift
背景电视一直响着，她说到十二万时提高了声音

#### question Sequence

- tony-who-messaged:questionOptions:0

### 夜 B · 2｜tony-caller-benefits

**林旭阳：** 你补来的转账我看了，十二万，怎么到他手里的？

**咨询者：** 是我转的。我先问能不能跟着买，他说我这十二万可以并进他的户。我知道不够一百万，可小姐妹都说收益高，他又对我那么好，我想他不会坑我。

#### no Clue Reaction

**咨询者：** 我跟他在一起的时候，他对我真的挺好的。你不能因为这笔钱就说那些全是假的。

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

##### 1. tony caller benefits:casual Questions:0

**林旭阳：** 走他的户，你想过以后要找谁要钱吗？

**咨询者：** 找他啊。他说钱不会不认，我才敢转。

- **source Anchor：** 并进他的户
- **内部 ID：** tony-caller-benefits:casualQuestions:0

##### 2. tony caller benefits:casual Questions:1

**林旭阳：** 你当时想过自己凑够一百万再买吗？

**咨询者：** 哪凑得够。我就这十二万，他肯帮我并进去，我才转的。

- **source Anchor：** 我知道不够一百万
- **内部 ID：** tony-caller-benefits:casualQuestions:1

##### 3. tony caller benefits:casual Questions:2

**林旭阳：** 他又对你好。十二万转出去以前，染发护理这些，是你自己结，还是记在他账上？

**咨询者：** 我自己结。我下班晚，他肯留最后的号。染发、护理我都找他，酒吧一晚的提成有时候当晚就结，我花钱也快。

- **source Anchor：** 他又对我那么好
- **内部 ID：** tony-caller-benefits:casualQuestions:2

##### 4. tony caller benefits:question Options:1

**林旭阳：** 转完以后，你还当自己在跟他谈吗？

**咨询者：** 我那时候还想跟他谈。这十二万，我也以为他会替我办好。

- **source Anchor：** 他又对我那么好
- **玩家所选怀疑方向：** 转钱之后关系怎么变
- **路线轴：** identity-wording
- **路线口气：** neutral
- **内部 ID：** tony-caller-benefits:questionOptions:1

#### 关键追问

##### 1. tony caller benefits:question Options:0

**林旭阳：** 你说并进他的户。他当时是怎么保证这十二万能算到你头上的？

**咨询者：** 他说聊天转账都留着，钱不会不认。

**林旭阳：** 这句话你们聊天里留着吗？

**咨询者：** 留着。是我先发的“帮我买”，他才回这些。转账记录我也有。

- **source Anchor：** 是我转的
- **玩家所选怀疑方向：** 你说并进他的户。他当时是怎么保证这十二万能算到你头上的？
###### 唯一核心反转过场

- **内部 ID：** case2-proxy-invest
- **类型：** reveal
- **过场短标：** 钱怎么出去的
- **标签：** 十二万，怎么并进他的户
- **visual Variant：** proxy-ledger

###### logic Contract

- **premise Anchor：** 是我转的
- **source Kind：** caller-statement
- **source Proves：** 她承认自己先提出代投、十二万由自己转给他，并称对方答应并入他的户。
- **source Does Not Prove：** 承认收款与答应代投，不能证明钱已实际买成产品，也不能证明他有代销资格。
- **answer Anchor：** 他说聊天转账都留着，钱不会不认
- **answer Adds：** 他说聊天转账都留着，钱不会不认。留着。是我先发的“帮我买”，他才回这些。转账记录我也有。
- **next Legal Question：** 她希望节目按什么说法追款；之后再查 Tony 对资金去向和退钱的答复。

- **矛盾：** 她已承认主动代投，追问确认走户安排有聊天依据；主动转款不等于 Tony 已履行。
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** pressure-point
- **内部 ID：** tony-caller-benefits:questionOptions:0

#### 压力表演

- **意图钩子：** 十二万是她让他代投
- **防备状态：** guarded

#### question Sequence

- tony-caller-benefits:questionOptions:0

### 场前情绪反应

- **内部 ID：** tony-trust-screenshot-followup
- **类型：** interruptToast
- **cost：** 0
- **before Scene Index：** 6
- **from：** 周的补充材料
#### lines

##### 1. lines 1

**林旭阳：** 周发来的那几张图，你手里也有吗？

##### 2. lines 2

**咨询者：** 有。她从预约群加了我，转了三张图：她给他的一百万、他说先放进宸直的聊天，还有一张认购回单。

##### 3. lines 3

**林旭阳：** 你能确定回单就是她转的那一百万吗？

##### 4. lines 4

**咨询者：** 不能。我手里只有她转来的图。是不是同一笔钱，我看不出来。我那十二万进没进产品，更看不见。

### 场前情绪反应

- **内部 ID：** tony-business-letter
- **类型：** interruptToast
- **cost：** 0
- **from：** 老方（后台同步）
- **声纹卡 ID：** producer-lao-fang
店家商务函到平台了，要求别把 Tony 的私人收款说成门店业务，也别再挂店名。法务让缓。你要继续，数据得扛住。——方

#### choices

##### 1. 那就把刚查到的继续说完。

- **内部 ID：** keep-asking-table
- **direction Label：** 那就把刚查到的继续说完。
- **标签：** 那就把刚查到的继续说完。
###### lines

###### 1. lines 1

【后台的推荐提示从绿色变成灰色：本场停止推荐。】

###### 2. lines 2

**林旭阳：** 函是店里寄给平台的。行，收钱的是 Tony，那就请他本人把合同拿出来。

- **路线口气：** pressure-point
- **ending Impact：** platform-data-loss
- **recap Aftertaste：**
- **不出声：** false
- **立场变化：** neutral

##### 2. 老方，回店里：请他们把要合同的问题转给 Tony。

- **内部 ID：** ask-person-not-shop
- **direction Label：** 老方，回店里：请他们把要合同的问题转给 Tony。
- **标签：** 老方，回店里：请他们把要合同的问题转给 Tony。
###### lines

###### 1. lines 1

【老方回了一个“收到”。推荐提示仍是灰色。】

###### 2. lines 2

**咨询者：** 对，我问的是他收钱以后干了什么。店里不认这项业务，总能叫他自己回我吧。

- **路线轴：** identity-wording
- **recap Aftertaste：**
- **不出声：** false
- **立场变化：** neutral

- **choice Mode：** sequence
- **before Scene Index：** 6

### 夜 B · 3｜tony-next-push-column

**林旭阳：** 昨晚你已经看见这张名单了。现在把你自己那行念完。

**咨询者：** 完整名单我昨晚就看完了。我那行写着十二万、不够起投、走 Tony 户。周那行是一百万、已买。我发给后台时把这些都裁掉了。

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

**咨询者：** 看见了。一百万就一定只是客户了？他把亲密度跟钱记在一张表上，你不觉得更恶心吗？

#### testimony Wall

- **标题：** 谈到名单和十二万
- **引子：** 看材料，接着问。
- **split After：** 3
- **mid Summary：**
- **soft Anchor Response：** 已选材料
##### miss Feedback

###### evidence

- 她说：“我没看出这跟我说的有什么冲突。”
- 她反问：“你拿这个就让我改口？”

###### statement

- 她说：“这句我没说错。”
- 她打断你：“我刚才就是这个意思。”

##### statements

###### 1. 证词 01

- **内部 ID：** tony-list-was-romantic
- **标签：** 证词 01
我看到一排女人和亲密度，第一反应当然是他拿谈恋爱吊着人。

- **press Response：** ‘那排名字就是全是女的。右边的钱……我等会儿说。’
- **present Response：** 已选材料

###### 2. 证词 02

- **内部 ID：** tony-heard-threshold-before
- **标签：** 证词 02
转钱以前，小姐妹提过高息档一百万起投，我只当听个热闹。

- **press Response：** ‘小姐妹是提过一百万。后来……后来我确实问过 Tony，能不能让我跟着买。’
- **present Response：** 已选材料
###### reveals

- tony-romance-only-claim

###### 3. 证词 03

- **内部 ID：** tony-transfer-was-hers
- **标签：** 证词 03
十二万是我自己转的，备注没写，但聊天里有‘帮我买’。

- **press Response：** ‘钱是我转的。可他收了以后，合同呢？’
- **present Response：** 已选材料

###### 4. 证词 04

- **内部 ID：** tony-cropped-to-protect-self
- **标签：** 证词 04
我裁掉金额和‘走我户’，是怕原图一发，大家先问我为什么把钱转给他。

- **press Response：** ‘我不想一发出来就被围着骂。右边是我裁的。’
- **present Response：** 已选材料

###### 5. 补充证词

- **内部 ID：** tony-romance-only-claim
- **标签：** 补充证词
- **hidden：** true
那段能不能别一上来就放？你一说“帮我买”，大家肯定觉得全是我自己活该。

- **press Response：** ‘一说代投，大家就只骂我贪利息，谁还帮我追钱？’
- **present Response：** 已选材料

##### acts

###### 1. 谈到名单和十二万

- **内部 ID：** act1
- **标题：** 谈到名单和十二万
- **wink Line：**
- **wink Tier：** tier3-accomplice
- **引子：** 选择原话与材料后出示。
- **split After：** 3
- **mid Summary：**
- **soft Anchor Response：** 已选材料
###### statements

###### 1. 证词 01

- **内部 ID：** tony-list-was-romantic
- **标签：** 证词 01
我看到一排女人和亲密度，第一反应当然是他拿谈恋爱吊着人。

- **press Response：** ‘那排名字就是全是女的。右边的钱……我等会儿说。’
- **present Response：** 已选材料

###### 2. 证词 02

- **内部 ID：** tony-heard-threshold-before
- **标签：** 证词 02
转钱以前，小姐妹提过高息档一百万起投，我只当听个热闹。

- **press Response：** ‘小姐妹是提过一百万。后来……后来我确实问过 Tony，能不能让我跟着买。’
- **present Response：** 已选材料
###### reveals

- tony-romance-only-claim

###### 3. 证词 03

- **内部 ID：** tony-transfer-was-hers
- **标签：** 证词 03
十二万是我自己转的，备注没写，但聊天里有‘帮我买’。

- **press Response：** ‘钱是我转的。可他收了以后，合同呢？’
- **present Response：** 已选材料

###### 4. 证词 04

- **内部 ID：** tony-cropped-to-protect-self
- **标签：** 证词 04
我裁掉金额和‘走我户’，是怕原图一发，大家先问我为什么把钱转给他。

- **press Response：** ‘我不想一发出来就被围着骂。右边是我裁的。’
- **present Response：** 已选材料

###### 5. 补充证词

- **内部 ID：** tony-romance-only-claim
- **标签：** 补充证词
- **hidden：** true
那段能不能别一上来就放？你一说“帮我买”，大家肯定觉得全是我自己活该。

- **press Response：** ‘一说代投，大家就只骂我贪利息，谁还帮我追钱？’
- **present Response：** 已选材料

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** case2-member-training:m03
- **statement Id：** tony-romance-only-claim
- **selection Reason：** m03 对应她要求省略的金额与账户安排；它支持拒绝省略的有限判断，不能证明不存在恋爱误导。
###### material Cards

###### 1. 何：12 万／不够 100 万起投／走 Tony 户

- **内部 ID：** case2-member-training:m03
- **类型：** 名单原行
- **标签：** 何：12 万／不够 100 万起投／走 Tony 户
- **excerpt：** 09-12 · 何 · ¥120,000 · 不够100万起投；走Tony户
- **source Label：** 名单与十二万转账

###### 2. 周：100 万／已买

- **内部 ID：** case2-member-training:m02
- **类型：** 名单原行
- **标签：** 周：100 万／已买
- **excerpt：** 09-11 · 周（遮名） · ¥1,000,000 · 已买；跟进；无亲密度
- **source Label：** 名单与十二万转账

###### 3. 何→Tony：¥120,000

- **内部 ID：** case2-member-training:m05
- **类型：** 转账记录
- **标签：** 何→Tony：¥120,000
- **excerpt：** 09-13 · 何→Tony · ¥120,000 · 转账备注空；聊天写帮我买
- **source Label：** 名单与十二万转账

- **咨询者台词：** 我找他帮忙，是因为我跟他那种关系。你把代投两个字摆出来，好像我跟他只剩买卖了，那他哄我的话就不算了？
- **主播台词：** 留晚档、陪你聊天，这些你说过了。代投的聊天也已经在这儿，不能省掉。他对合同和退钱到底怎么答的？
- **boundary Line：** 十二万转入 Tony 账户，认购结果尚未取得。
- **矛盾：** 她要求主播省略已经承认的代投安排；主播拒绝在追款时省去相关事实。
- **路线轴：** money-flow
- **continue Label：** 接着问认购结果
- **outcome Kind：** clarification
###### accepted Evidence Ids

- case2-member-training:m05

###### miss Feedback

###### evidence

- 她说：“我没看出这跟我说的有什么冲突。”
- 她反问：“你拿这个就让我改口？”

###### statement

- 她说：“这句我没说错。”
- 她打断你：“我刚才就是这个意思。”

###### inquiry

###### opening Lines

###### 1. opening Lines 1

**林旭阳：** 那就把你们谈买东西的聊天也放出来，从转钱之前看。

###### 2. opening Lines 2

**咨询者：** 那段能不能别一上来就放？你一说“帮我买”，大家肯定觉得全是我自己活该。

###### 选项

###### 1. act1 miss 1

- **内部 ID：** act1-miss-1
- **主播问句：** 你把代投那段先省掉。当时转十二万，聊天里写的是借，还是帮你买？
- **是否核心项：** false
###### lines

###### 1. lines 1

**咨询者：** 写的是帮我买。可我跟他那种关系，才肯转。

- **supplementary：** true

###### 2. act1 ask

- **内部 ID：** act1-ask
- **主播问句：** 你发过“帮我买”，现在追这十二万，为什么要把这段聊天省掉？
- **是否核心项：** true
###### lines

###### 1. lines 1

**咨询者：** 我找他帮忙，是因为我跟他那种关系。你把代投两个字摆出来，好像我跟他只剩买卖了，那他哄我的话就不算了？

###### 2. lines 2

**林旭阳：** 那几句是你自己发的。要钱就得删掉？

###### 3. lines 3

**咨询者：** 是我先说要买的，可他要不跟我谈恋爱，我会把钱交给他？这层关系你也得说。

###### 3. act1 miss 2

- **内部 ID：** act1-miss-2
- **主播问句：** 转账备注没写用途。当时聊天里，你有没有把“帮我买”和转账发在一起？
- **是否核心项：** false
###### lines

###### 1. lines 1

**咨询者：** 是啊，先说了帮我买，接着就转了。可钱过去以后，合同一直没给我。

- **supplementary：** true

###### 2. 他只给了提交页

- **内部 ID：** act2
- **status Label：** 接着问钱去了哪里
- **标题：** 他只给了提交页
- **引子：** 选择原话与材料后出示。
###### opener Fact Keywords

- 合同
- 十二万

###### opener Lines

###### 1. opener Lines 1

**咨询者：** 我把催合同和退钱的聊天、他给的提交页一起发来。你们看他怎么回的。

###### 2. opener Lines 2

【后台打开完整聊天。何：“我这十二万到底买成了没有？买成了是哪一笔，合同呢？没买成为什么不退给我？”Tony：“十二万是过了我户。先问能不能跟着买的是你，我也说了已经提交。钱走我户，材料当然先在我这儿。”】

###### 3. opener Lines 3

【后台将刚收到的提交页与此前的十二万元转账回执并排打开。提交页只显示“已提交”，产品名称、认购户名、份额及成交日期均未显示。】

- **revised Frame：** 主动代投已承认；她仍把已提交当成已买入，把退款阻碍都归给产品。玩家核交付状态，追问转向收款人。
- **split After：** 2
- **mid Summary：**
- **soft Anchor Response：** 已选材料
###### comparison

###### 1. comparison 1

- **statement Id：** tony-list-was-romantic
- **status：** 保留原话

###### 2. comparison 2

- **statement Id：** tony-heard-threshold-before
- **status：** 保留原话

###### 3. comparison 3

- **statement Id：** tony-transfer-was-hers
- **status：** 保留原话

###### 4. comparison 4

- **statement Id：** tony-cropped-to-protect-self
- **status：** 保留原话

###### 5. comparison 5

- **statement Id：** tony-romance-only-claim
- **status：** 补充说明

###### statements

###### 1. 改口 01

- **内部 ID：** tony-atmosphere-was-his-alone
- **标签：** 改口 01
他既然发了已提交，那就是买进去了吧。现在退不出来，应该是产品那边卡着。

- **press Response：** ‘我就是觉得，没买成他干吗不退？可你问这张图哪里写了买成，我找不到。’
- **present Response：** 已选材料

###### 2. 改口 02

- **内部 ID：** tony-transfer-instruction-admitted
- **标签：** 改口 02
十二万是我转的，聊天里的‘帮我买’也是我发的，这些我不改。

- **press Response：** ‘钱是我转的，话也是我发的。可他收了以后，合同呢？’
- **present Response：** 已选材料
- **survives From Act1：** tony-transfer-was-hers

###### 3. 改口 03

- **内部 ID：** tony-product-result-still-unknown
- **标签：** 改口 03
合同和正式回单，他说都在他那儿。我问了，他没给我。

- **press Response：** ‘我问买成哪笔，他就回是我先要买的。我没说不是我先问，他能不能别再绕这句？’
- **present Response：** 已选材料
- **survives From Act1：** tony-romance-only-claim

###### 4. 改口 04

- **内部 ID：** tony-crop-admission-kept
- **标签：** 改口 04
右半边是我裁的。我怕大家一上来先骂我贪利息。

- **press Response：** ‘右边是我裁的，这点我不躲。可“自己人”是他说的。’
- **present Response：** 已选材料
- **survives From Act1：** tony-cropped-to-protect-self

###### decisive Present

- **max Attempts：** 2
- **evidence Id：** tony-submission:status
- **statement Id：** tony-atmosphere-was-his-alone
###### boundary Line Key Phrases

- 目前只有提交页，合同和成交回单仍缺失。

- **selection Reason：** 提交页没有产品名称、户名和成交记录，不能据已提交将退钱困难全推给产品。
###### material Cards

###### 1. 已提交／未显示认购结果

- **内部 ID：** tony-submission:status
- **类型：** 后台收到的提交页
- **标签：** 已提交／未显示认购结果
- **excerpt：** 状态：已提交；产品名称、认购户名、份额、成交日期：未显示。
- **source Label：** 小何刚转来的提交页

###### 2. 她已知道不够一百万

- **内部 ID：** tony-next-push-column:tony-heard-threshold-before
- **类型：** 本次连线原话
- **标签：** 她已知道不够一百万
- **excerpt：** ‘我知道不够一百万，可小姐妹都说收益高，他又对我那么好，我想他不会坑我。’
- **source Label：** 本次连线 · 她解释十二万怎么转的

###### 3. 何→Tony：¥120,000

- **内部 ID：** case2-member-training:m05
- **类型：** 转账记录
- **标签：** 何→Tony：¥120,000
- **excerpt：** 09-13 · 何→Tony · ¥120,000 · 转账备注空；聊天写帮我买
- **source Label：** 名单与十二万转账

###### 4. 不够 100 万起投／走 Tony 户

- **内部 ID：** case2-member-training:m03
- **类型：** 名单原行
- **标签：** 不够 100 万起投／走 Tony 户
- **excerpt：** 09-12 · 何 · ¥120,000 · 不够100万起投；走Tony户
- **source Label：** 名单与十二万转账

- **咨询者台词：** 提交页也是他发的，又不是我做的。他拿这个应付我，你怎么倒问起我来了？合同我催过两遍了！
- **主播台词：** 十二万收得挺痛快，问个合同倒嫌你催了？
- **boundary Line：** 目前只有提交页，合同和成交回单仍缺失。
- **矛盾：** 她将已提交推成已成交，再把退款困难全归给产品；现有页面不能支持这一跳步。
- **路线轴：** money-flow
- **continue Label：** 继续追十二万的去向
- **outcome Kind：** clarification

###### miss Feedback

###### evidence

- 她说：“就这张？我还是没明白你在怀疑什么。”
- 她回道：“这张我看过了。”

###### statement

- 她问：“我这句话哪里不对？”
- 她说：“你再问，我也这么说。”

- **wink Line：**
###### inquiry

###### opening Lines

###### 1. opening Lines 1

**咨询者：** 我把催合同和退钱的聊天、他给的提交页一起发来。你们看他怎么回的。

###### 2. opening Lines 2

【后台收到她发来的聊天截图和提交页，与先前的转账记录放在一起。】

###### 3. opening Lines 3

**咨询者：** 我现在也不知道买成没有。他让我等产品那边消息，我除了等，还能找谁？可合同他总该给我看看吧。

###### 选项

###### 1. act2 miss 1

- **内部 ID：** act2-miss-1
- **主播问句：** 提交页只写已提交。他有没有说过，还差你补哪份材料才能办完？
- **是否核心项：** false
###### lines

###### 1. lines 1

**咨询者：** 没有，他只说已经提交，让我等。

- **supplementary：** true

###### 2. act2 miss 2

- **内部 ID：** act2-miss-2
- **主播问句：** 你催退款的时候，他答应过哪天退吗？
- **是否核心项：** true
###### lines

###### 1. lines 1

**咨询者：** 没给过日期。我问急了，他就说当初是我让他帮忙的。

###### 2. lines 2

**林旭阳：** 到底买没买成，他总得告诉你钱在哪儿吧？光发个“已提交”就完了？

###### 3. lines 3

**咨询者：** 我就要他正面回这几句。合同我催过两遍了。

###### 3. act2 ask

- **内部 ID：** act2-ask
- **主播问句：** 钱进的是他的户，这张提交页又没有认购结果。你要他拿什么来说明十二万现在在哪儿？
- **是否核心项：** true
###### lines

###### 1. lines 1

**咨询者：** 合同、回单，买成了就给我看对应哪一笔。没买成就把钱退回来，别再让我空等。

###### 2. lines 2

**林旭阳：** 合同催过没有，退钱的日期他给了吗？

###### 3. lines 3

**咨询者：** 合同催过两遍，退钱也没给日期。每次都是等，我不想再等了。

- **wink Line：**
- **revision：** focused-2026-09-16

#### decisive Present

- **max Attempts：** 2
- **evidence Id：** case2-member-training:m03
- **statement Id：** tony-romance-only-claim
- **selection Reason：** m03 对应她要求省略的金额与账户安排；它支持拒绝省略的有限判断，不能证明不存在恋爱误导。
##### material Cards

###### 1. 何：12 万／不够 100 万起投／走 Tony 户

- **内部 ID：** case2-member-training:m03
- **类型：** 名单原行
- **标签：** 何：12 万／不够 100 万起投／走 Tony 户
- **excerpt：** 09-12 · 何 · ¥120,000 · 不够100万起投；走Tony户
- **source Label：** 名单与十二万转账

###### 2. 周：100 万／已买

- **内部 ID：** case2-member-training:m02
- **类型：** 名单原行
- **标签：** 周：100 万／已买
- **excerpt：** 09-11 · 周（遮名） · ¥1,000,000 · 已买；跟进；无亲密度
- **source Label：** 名单与十二万转账

###### 3. 何→Tony：¥120,000

- **内部 ID：** case2-member-training:m05
- **类型：** 转账记录
- **标签：** 何→Tony：¥120,000
- **excerpt：** 09-13 · 何→Tony · ¥120,000 · 转账备注空；聊天写帮我买
- **source Label：** 名单与十二万转账

- **咨询者台词：** 我找他帮忙，是因为我跟他那种关系。你把代投两个字摆出来，好像我跟他只剩买卖了，那他哄我的话就不算了？
- **主播台词：** 留晚档、陪你聊天，这些你说过了。代投的聊天也已经在这儿，不能省掉。他对合同和退钱到底怎么答的？
- **boundary Line：** 十二万转入 Tony 账户，认购结果尚未取得。
- **矛盾：** 她要求主播省略已经承认的代投安排；主播拒绝在追款时省去相关事实。
- **路线轴：** money-flow
- **continue Label：** 接着问认购结果
- **outcome Kind：** clarification
##### accepted Evidence Ids

- case2-member-training:m05

- **现场疑点：** 翻脸时机在风险传闻之后，不在刚发现恋爱破裂。
- **矛盾：** 完整追款必须写明主动代投，同时核对 Tony 收款后实际提供的凭证。
- **可靠度：** mixed
#### 自由追问

##### 1. tony next push column:casual Questions:0

**林旭阳：** 完整名单你看过了。你还去店里找过 Tony 要合同吗？

**咨询者：** 没去要。号还留着，人没去。头发长了，随便找了家快剪。

- **source Anchor：** 完整名单
- **内部 ID：** tony-next-push-column:casualQuestions:0

##### 2. tony next push column:casual Questions:1

**林旭阳：** 小姐妹说产品在拖。她找你的时候，有没有把你那十二万和名单放在一起说？

**咨询者：** 没有先提名单。她说这产品最近在拖，让我别再转。我才翻他手机的。

- **source Anchor：** 周那行
- **内部 ID：** tony-next-push-column:casualQuestions:1

##### 3. tony next push column:casual Questions:2

**林旭阳：** 这张名单你还转给过谁，发给后台以前，金额那几列还在吗？

**咨询者：** 只发给小姐妹和你们后台。给你们之前我遮了名字，金额那几列第一夜没发进去。

- **source Anchor：** 发给后台
- **内部 ID：** tony-next-push-column:casualQuestions:2

#### 场尾自动拍

##### lines

###### 1. lines 1

**咨询者：** 就算真买了，现在取不出来，我也要他把十二万还我。他自己想办法。他脚踩两条船的事，总不能就这么算了。

###### 2. lines 2

**咨询者：** 上礼拜他给我修刘海，手特别轻。我问两遍嫌不嫌烦，他说不烦。问两遍合同，倒成了催他。

###### 3. lines 3

**林旭阳：** 合同拿不到就继续找他要，别再往里转了。

###### 4. lines 4

**咨询者：** 完整截图和转账我一起留着。这次不发半张了，省得他又拿这个岔开。

#### closure Contract

- **entry Anchor：** 上礼拜他给我修刘海
- **closer Anchor：** 问两遍合同
- **adds：** 她用同一个人对刘海与合同的不同耐心作比较；服务细致没有消失，钱款交付仍未回答。
- **open Edge：** 十二万是否买成产品、合同与凭证何时提供。
- **route Independent：** true

#### 关键追问

##### 1. tony next push column:question Options:0

**林旭阳：** Tony 写的这行“不够起投、走我户”，你当时看见了吗？

**咨询者：** 看见了。我知道不够起投，还问他能不能帮我买。

- **source Anchor：** 完整名单我昨晚就看完了
- **玩家所选怀疑方向：** 重读‘走我户’那行
- **防备回答：** 看见了，我同意先转给他。
###### logic Contract

- **premise Anchor：** 完整名单我昨晚就看完了
- **source Kind：** caller-statement
- **source Proves：** 她第一夜已看完全表，公开会同时带出她的代投备注。
- **source Does Not Prove：** 不能证明公开就能要回十二万，也不能证明产品已经损失。
- **answer Anchor：** 看见了。我知道不
- **answer Adds：** 看见了。我知道不够起投，还问他能不能帮我买。
- **next Legal Question：** 可以问她若只给回单不退现金还公开不明，不能替她决定是否报案。

- **矛盾：** 她想用半张名单取得恋爱受害者位置，同时有意藏起自己主动代投的事实。
- **是否核心项：** true
- **路线轴：** active-provocation
- **路线口气：** caller-skeptical
- **内部 ID：** tony-next-push-column:questionOptions:0

##### 2. tony next push column:question Options:1

**林旭阳：** 小姐妹说产品在拖，是在你转钱之前，还是之后？

**咨询者：** 转钱以后。她说赎回在排队，让我别再转，我才去翻他手机。

- **source Anchor：** 完整名单我昨晚就看完了
- **玩家所选怀疑方向：** 她何时听说可能拿不回
- **是否核心项：** true
- **路线轴：** money-flow
- **路线口气：** caller-skeptical
- **内部 ID：** tony-next-push-column:questionOptions:1
- **矛盾：** 她在转账后听到赎回拖延，随后翻手机并打来追款。
###### logic Contract

- **premise Anchor：** 完整名单我昨晚就看完了
- **source Kind：** caller-statement
- **source Proves：** 她已见过全图。
- **source Does Not Prove：** 不能确定十二万的去向。
- **answer Anchor：** 转钱以后
- **answer Adds：** 她转账后才听到赎回拖延。
- **next Legal Question：** 继续向收款人追实际凭证。

#### 压力表演

- **意图钩子：** 风声一来才翻脸
- **防备状态：** guarded
##### 表情/听感

- **类型：** shift
她轻声念了一遍名单上的十二万

- **legacy Question Options：** true
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
- **front：** 手机截图 · 左侧可见区域
- **detail：**
##### targets

- truthWithGap
- sceneHint

- **矛盾：** 来电人用左半张图指认养鱼，却裁掉了改变整张表性质的金额栏。
##### source Table

###### columns

- 姓名
- 亲密度
- 下次约

###### 表格行

###### 表格行 1

- 何*
- ★★★★★
- 周日晚上

###### 表格行 2

- 许*
- ★★★★
- 周二晚档

###### 表格行 3

- 陈*
- ★★★
- 周六下午

###### 表格行 4

- 周*
- —
- 回电

###### 表格行 5

- 李*
- ★★
- 月底

###### 表格行 6

- 吴*
- ★★★
- 周三晚档

###### 表格行 7

- 郑*
- ★★
- 周五

###### 表格行 8

- 孙*
- ★
- 未定

###### 表格行 9

- 王*
- ★★
- 周末

#### 2. 走我户

- **内部 ID：** daily-tony-chat-copy
- **表现类型：** 聊天截图
- **标题：** 走我户
- **front：** 咨询者说不够一百万，Tony 回不够起投、走我户。
- **detail：** 聊天里有代投约定；她为什么信他、他收款后做了什么，还需另查。
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

### 后台回流

#### 1. 店长与熟客发来的材料

- **内部 ID：** tony-manager-training-note
- **声纹卡 ID：** case2-manager
- **来源：** store-manager-note
- **出现界面：** 后台收到话术卡和一张熟客截图
- **标题：** 店长与熟客发来的材料
- **触发矛盾：** Tony 把门店里维系熟客的称呼和排期方式，接进了自己的产品跟进；店里并不承认理财业务。
- **此刻出现原因：** 收麦后，小何向后台发来消息：“我刚把回放发进预约群了，让他们都看看。”随后，店长发来说明与培训卡，一位熟客也发来了自己的聊天截图。
- **提示题：** 把话术卡和上周截图并排，哪一处最该留下？
- **材料：** 门店培训卡
店长发来的门店原页
记需求
约下次
晚档优先

上周预约聊天
熟客发来的 Tony 私聊截图
Tony：上周那个，你听完了吗？自己人，晚档给你留。
熟客：听过了，没钱。剪头就剪头，别又跟我说那个。

店长的后台留言
发送人：店长
我们店只做美发，也没让员工替客人收这种钱。Tony 私下跟客人说了什么，你们问他本人，别把店也写进去。
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
- **主播问句：** 她上周已经听过这套说法，为什么这回先拦住了？

###### 2. 店里知不知道私下收款

- **标签：** 店里知不知道私下收款
- **是否核心项：** false
- **反馈：** 这句划清门店边界，但没有解释 Tony 为什么把同样的称呼接到私人名单和账户上。
- **路线轴：** caller-credibility
- **主播问句：** 店长说只做美发。Tony 私下收款，店里当时知道吗？

###### 3. 店长有没有说私下怎么承诺

- **标签：** 店长有没有说私下怎么承诺
- **是否核心项：** false
- **反馈：** 这是店长的态度，还不能说明 Tony 私下收款时怎么承诺。
- **路线轴：** money-flow
- **主播问句：** 店长不想牵连门店。他有没有说，Tony 私下跟客人怎么承诺的？

##### source Documents

###### 1. 门店培训卡

- **标题：** 门店培训卡
- **sender：** 店长发来的门店原页
###### 表格行

- 记需求
- 约下次
- 晚档优先

###### 2. 上周预约聊天

- **标题：** 上周预约聊天
- **sender：** 熟客发来的 Tony 私聊截图
###### 表格行

- Tony：上周那个，你听完了吗？自己人，晚档给你留。
- 熟客：听过了，没钱。剪头就剪头，别又跟我说那个。

###### 3. 店长的后台留言

- **标题：** 店长的后台留言
- **sender：** 发送人：店长
###### 表格行

- 我们店只做美发，也没让员工替客人收这种钱。Tony 私下跟客人说了什么，你们问他本人，别把店也写进去。

#### 2. 周发来的材料

- **内部 ID：** tony-other-caller-dm
- **声纹卡 ID：** case2-other-customer
- **来源：** dm
- **出现界面：** 后台进来一条私信
- **标题：** 周发来的材料
- **触发矛盾：** 名单上另一行也是钱，不是女朋友。
- **此刻出现原因：** 周女士也在那个美发预约群里，看到了小何转去的回放。她不愿被说成 Tony 的女朋友，也想查自己的一百万去了哪里，沿节目后台入口发来自己的转账与回单截图。
- **提示题：** 周手里的哪一项，最值得和转账原件一起核？
- **材料：** 周看到了同一预约群里的回放，从节目入口发来私信：“我也是顾客，我想查的是自己的钱。”

周女士说：“我就是名单上写一百万、已买的那位客人。他给我发过一张回单。我不去店里闹，材料可以交警方。回单是不是对应我那笔钱，让他们查。”
##### 材料行

- 她那栏写着｜100万，已买
- 她收到的｜认购回单截图
- 她愿意做的｜把转账与回单交警方核原件
- 仍不知道｜回单是否对应她那一百万

- **能证明：** 周也向 Tony 转过钱，并持有一张他转来的认购回单截图。
- **仍不能证明：** 不能证明两笔钱都买成同一产品，也不能证明已经损失。
- **路线轴：** external-corroboration
##### 选项

###### 1. 名单上的已买能不能当成交

- **标签：** 名单上的已买能不能当成交
- **是否核心项：** false
- **反馈：** 名单是 Tony 自己记的，不能替代转账与回单原件。
- **路线轴：** money-flow
- **主播问句：** 名单写着一百万已买。周手里那张回单，当时有没有和转账一起核过？

###### 2. 转账与回单放在一起核

- **标签：** 转账与回单放在一起核
- **是否核心项：** true
- **矛盾：** Tony 说已经提交，仍只有逐笔核对原件才能确认钱去了哪里。
- **反馈：** 转账证明钱给了 Tony；回单是否对应这笔钱，要看原件。
- **人物反应：** 她肯把原图交出去。我也交。
- **路线轴：** external-corroboration
- **主播问句：** 钱转给 Tony 以后，收到的回单能不能和这笔转账对应？

###### 3. 已买是不是机构回单

- **标签：** 已买是不是机构回单
- **是否核心项：** false
- **反馈：** 已买是 Tony 的备注，不是机构回单。
- **路线轴：** caller-credibility
- **主播问句：** 名单上写已买。Tony 有没有给过机构出具的成交回单？

### 文档原件

#### 1. 小何昨晚发来的半张名单

**小何昨晚发来的半张名单**

右边沿被裁断，只能读到姓名、亲密度和下次约。

- **时间格式：** relative

| 行 ID | 日期 | 对方/项目 | 金额 | 备注 | 类型 |
| --- | --- | --- | --- | --- | --- |
| crop-0 | 09-11 | 何* | ★★★★★ | 周日晚上 | 提醒 |
| crop-1 | 09-11 | 许* | ★★★★ | 周二晚档 | 提醒 |
| crop-2 | 09-11 | 陈* | ★★★ | 周六下午 | 提醒 |
| crop-3 | 09-11 | 周* | — | 回电 | 提醒 |
| crop-4 | 09-11 | 李* | ★★ | 月底 | 提醒 |
| crop-5 | 09-11 | 吴* | ★★★ | 周三晚档 | 提醒 |
| crop-6 | 09-11 | 郑* | ★★ | 周五 | 提醒 |
| crop-7 | 09-11 | 孙* | ★ | 未定 | 提醒 |
| crop-8 | 09-11 | 王* | ★★ | 周末 | 提醒 |

- **内部 ID：** case2-roster-cropped
#### 2. 名单与十二万转账

**名单与十二万转账**

第二夜，小何补来完整名单及十二万转账页；右侧列在此时第一次可读。

| 行 ID | 日期 | 类型 | 金额 | 对方/项目 | 备注 |
| --- | --- | --- | --- | --- | --- |
| m01 | 09-11 | 提醒 | —— | 下次约／亲密度 | 名单左侧列名 |
| m02 | 09-11 | 提醒 | ¥1,000,000 | 周（遮名） | 已买；跟进；无亲密度 |
| m03 | 09-12 | 提醒 | ¥120,000 | 何 | 不够100万起投；走Tony户 |
| m05 | 09-13 | 支出 | ¥120,000 | 何→Tony | 转账备注空；聊天写帮我买 |

- **内部 ID：** case2-member-training
##### available At

- **scene Id：** tony-next-push-column
- **act：** 1

#### 3. 第二夜转来的提交页

**第二夜转来的提交页**

小何刚转来 Tony 发给她的提交页，以及她追问合同的聊天。

| 行 ID | 日期 | 类型 | 金额 | 对方/项目 | 备注 |
| --- | --- | --- | --- | --- | --- |
| status | 09-22 | 提醒 | —— | Tony 转给何 | 状态：已提交；产品名称、认购户名、份额、成交日期：未显示。 |
| reply | 09-22 | 提醒 | —— | Tony→何 | 钱走我户，材料当然先在我这儿。 |

- **内部 ID：** tony-submission
##### available At

- **scene Id：** tony-next-push-column
- **act：** 2

### 对方留言

- **来源：** respondent-note
- **此刻出现原因：** 店长把节目链接转给Tony，问他私下收款的事。收麦后，他给后台留了这段文字，不肯上麦。
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
前面那通拿旧审批图搪塞，这通只发已提交。打个钱，就这么难要张回单？

## 收束与结案

- **host Wound Hook：** Tony 对熟客都叫自己人，也许只是嘴甜
### deep Followup

- **stage Judgement：** 店里忙着发函划清业务，Tony 还没把合同回单给她。十二万收走了，总得有人回答买成了什么吧。
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
- **主播回应：** 周那行一百万、已买，没有亲密度。你裁掉右边，倒把她也编进女朋友里了？

#### 2. “不够起投，走我户。”

- **标签：** “不够起投，走我户。”
- **quote Source Scene Id：** tony-list-columns
- **责任角色：** complainant
- **主播回应：** 名单是 Tony 写的，十二万是你转的。你连帮我买三个字都要裁掉，让我怎么替你问？

#### 3. “是我转的。”

- **标签：** “是我转的。”
- **quote Source Scene Id：** tony-caller-benefits
- **责任指向：** both
- **主播回应：** 是你先问能不能跟着买。Tony 收了钱之后干了什么，他还没答。

#### 4. “他总给我留最晚那档。”

- **标签：** “他总给我留最晚那档。”
- **quote Source Scene Id：** tony-exclusive-voice
- **责任指向：** noPremeditated
- **主播回应：** 留晚档的时候叫自己人，问合同的时候让你别催。这时候怎么又生分了？

### 今晚最后一句

#### 1. 他回了消息再来。

- **内部 ID：** accompany
- **标签：** 他回了消息再来。
- **主播台词：** 他回了消息再来。
##### lines

###### 1. lines 1

**咨询者：** 行。别我一走，你们就只剩笑我了。

- **sequential：** true

### 正式结案

- **标题：** 钱走他户之后
- **结论：** 直播里核到十二万由她主动委托 Tony 代买；名单混有顾客和恋爱关系，带日期的聊天显示 Tony 同时与另一人交往。她仍要求 Tony 自己拿钱还她。截至挂断，节目收到的只有提交页，还需要认购结果。
#### 场景节拍

##### 1. 来电

- **标签：** 来电
她先把名单讲成养鱼女友名册，一开口就要钱。后来才承认自己也要恋爱这个位置，他确实帅。

##### 2. 麦上

- **标签：** 麦上
昨晚敲门的是警察，因涉案放款人来核实借款。周只是剪头客户。第二夜完整名单和转账才对出：十二万是她因为不够一百万才让他代投。

##### 3. 回看

- **标签：** 回看
她确认转账是自己要求代买，又说即便真买了、暂时取不出，也要 Tony 自己拿钱还她。直播结束时仍只有提交页。

#### 已确认

- 咨询者与 Tony 交往期间，他仍与另一名女生以男女朋友相称；手机截图包含重叠日期与合照
- 名单上多为女客，字段包含金额、起投、跟进和走他户
- 咨询者向 Tony 转过十二万，自己开口要求帮忙购买高息档
- 咨询者听说产品可能出事后才翻名单，并裁掉金额、起投、跟进和走他户等右半边，把主动代投改口成恋爱诈骗
- 高息传闻来自酒吧小姐妹，咨询者在翻名单前就听过一百万起投
- 周是剪头客户，名单行写一百万已买，不是咨询者所说的女朋友
- 第一夜敲门的是警察；放款的人涉案，按借款人来问咨询者
- 店长称店里不卖理财，拒绝替 Tony 的私人名单作证
- 截至挂断连线，Tony 承认十二万经其账户，节目尚未收到成交凭证

#### 未决

- 十二万是否已经买成宸直产品
- Tony 是否有向顾客推介或代购的资格
- 周的认购回单是不是她自己那笔钱
- 其他名单行是否完成认购
- 宸直该档产品能否兑付或赎回
- Tony 是否因私人代投获得佣金或其他报酬
- 她向放贷人借了多少、是否仍欠
- 警察把她当证人还是另有调查

- **下一步：** 不再转钱。要求 Tony 交产品全名、认购合同、回单和实际下单账户；提交转账与完整聊天供警方核实。公开谈这笔钱时同时说明代投安排，不凭裁图判定其他顾客与他的关系。
#### postscript

- **标题：** 收播后 · Tony 补来的凭证
##### 已确认

- Tony 本人随后发来的完整聊天与认购成交记录显示，十二万并入其名下的一百一十二万元认购。
- 记录中包含他在直播前向小何发送同组凭证的消息；没有已读标记，不能确认她看过。
- 小何直播时没有承认收到这组成交材料；该笔当前赎回申请待处理。

##### 未决

- 最终能否兑付、何时追回
- 私人代投责任与是否存在佣金

- **story Interlude Recap：** 她先拿裁过的名单讲养鱼，后来才承认两人真实的恋爱相处和真实照顾都发生过。第一夜强光和敲门让她突然下线；第二夜才问出警方因涉案放款人来核实借款。完整名单和转账随后对出：她主动让 Tony 代投十二万，钱走他的个人账户，合同和回单仍在他手里。风声一来，她才裁图改口。
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

- **focused Inquiry：** true
- **compact Closing：** true
- **single Closing Card：** true

### voice Tics

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
- **protected Interest：** 追回十二万，保住自己被认真对待的感受和公开追款的压力；不愿主动代投与裁图使听众只批评她、放过收款后不交凭据的 Tony。主动代投不能直接排除受骗或关系误导。
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
- **material Board Count：** 0
- **backflow Count：** 2
- **truth Boundary Prompt Count：** 0
- **case Specific Pressure：** 第一夜先让裁过的名单被读成养鱼名册，再承认亲密相处是真的、他确实帅；窗外强光和敲门声逼她突然下线。第二夜问出来人是警察，再拆出周只是剪头客户、十二万是她自己让他代投。
#### what Player Does Besides Read

- 本段集中问询，问错留在本段重问
- 查阅本段原件
- 跨夜带回新材料
- 在当事人的决定处结束

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
- 咨询者和 Tony 确实谈过恋爱，Tony 称她自己人、给她留最晚那档，照顾也真实发生过
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
- 咨询者借真实恋爱和名单推称所有女人都是受骗女友，并将主动代投省略成恋爱收款；真实相处不能证明其他顾客也是女友。
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

### scene

- **name：** 直播连线

### after Judgement Lines

#### 1. after Judgement Lines 1

【你抬手揉了揉眼睛，手背碰倒空纸杯。杯子滚到控台边，没洒出一滴。】

### statement Patience

- **night a：** 4
- **night b：** 4

### statement Stages

#### 1. tony list as dating:inquiry

- **内部 ID：** tony-list-as-dating:inquiry
##### scene Indexes

- 0

- **minimum Review Count：** 1

#### 2. tony exclusive voice:inquiry

- **内部 ID：** tony-exclusive-voice:inquiry
##### scene Indexes

- 1

- **minimum Review Count：** 1

#### 3. tony list columns:inquiry

- **内部 ID：** tony-list-columns:inquiry
##### scene Indexes

- 2

- **minimum Review Count：** 1

#### 4. tony bar rumor hangup:inquiry

- **内部 ID：** tony-bar-rumor-hangup:inquiry
##### scene Indexes

- 3

- **minimum Review Count：** 1

#### 5. tony who messaged:inquiry

- **内部 ID：** tony-who-messaged:inquiry
##### scene Indexes

- 4

- **minimum Review Count：** 1

#### 6. tony caller benefits:inquiry

- **内部 ID：** tony-caller-benefits:inquiry
##### scene Indexes

- 5

- **minimum Review Count：** 1

- **one Time Tic：**
### author Facts

- **relationships：** 小何查看 Tony 手机时截下与另一女生的交往纪念日对话和八月十五号酒店合照；Tony 八月十七号仍向她说只有她一位女友。名单同时包含普通顾客，周不是女友。
- **money：** 小何已知一百万门槛，主动转十二万并入 Tony 名下总额一百一十二万元认购。直播只收到提交页，成交事实在收播后的 Tony 后台补件中首次确认。
- **receipt：** Tony 通过店长先前转来的节目后台渠道补发完整聊天、扣款和成交记录；同组凭证在九月十九日曾发给何，截图无已读标记。何直播时未承认收件，是否看过未知。
- **求助内容：** 何因赎回困难要求 Tony 自己出钱偿还，以同时交往造成的过错向他施压；不是由旁白确认她的全部心理。

## 9 月 22 日 · 收播以后

【9 月 22 日，今晚的回拨结束，直播灯熄了。】

【店长先前把节目后台联系方式转给了 Tony。收播后，同一个账号又发来一组完整聊天、账户扣款和认购成交页。】

**Tony（后台私信）：** 刚才说不上麦，是不想在店里吵。这几张给你看，别把我的名字和账号放出去。她那十二万买进去了，这组材料我十九号就发给她了。

#### 舞台标记

- **声纹卡 ID：** case2-tony

【材料原页：Tony 与小何 · 9 月 12 日聊天】

> 小何：我就十二万，跟你的一起买吧。

> Tony：我一百万，加你十二万，一共一百一十二万，挂我名下。

【材料原页：账户转账与成交摘页 · 账号已遮盖】

> 09-13｜小何 → Tony｜¥120,000

> 09-14｜Tony → 宸直产品收款账户｜¥1,120,000｜交易编号尾号 0914-628

> 认购成交页｜认购人 Tony｜金额 ¥1,120,000｜对应交易编号尾号 0914-628

> 最新赎回申请｜待处理｜到账记录：无

【材料原页：Tony 发给小何的消息记录 · 9 月 19 日】

> 已发送：上述扣款与成交截图

> Tony：这个就是买进去的记录，你看下。

> 页面未显示已读状态

**林旭阳：** 金额、日期和交易编号都对上了。她的十二万确实并进去买了。

**赵律师：** 她今晚没说收到过这些。十九号发过，不知道她到底看没看。

**林旭阳：** 她最后倒说了，就算买了，取不出来也得让他自己还。

**赵律师：** 他同时跟两个人谈是真的。可这十二万买进去以后，和他自己欠她十二万，是两件事。

**林旭阳：** 嗯，聊天和成交页都存下。她要再来，先把这几张对清楚。

**赵律师：** 今晚这些杯子，谁洗？

**林旭阳：** 我洗。你站旁边监督。

**赵律师：** 不监督。我在门口等你。

你把备用线缠好，收进桌下的盒子，又端起桌上的杯子。

【屏幕右上角的“直播中”灭了。】

【桌上的手机亮了一下，财经新闻推送里出现“宸直”两个字。你把杯子放回桌上，叫住门口的赵律师。】

### 9 月 22 日深夜 · 新闻推送

- **世界回声 ID：** world-echo-chenzhi-payment-crisis
- **承诺 ID：** chenzhi-trust-payment-crisis

【玩家操作：把新闻推送点开】

#### 玩家先押下的风险假设（三选一，不判分）

- **cross-case-ledger｜把四案里的宸直线索并在一起：** 先把栖行融资稿的押金归集附注、部门待付记录与其他案的宸直材料摆到一起。融资稿已经写了关联项目周转；这次通报说了什么，得打开看。
- **tony-only｜先只核 Tony 的十二万元：** 最后一案的代投回单最紧迫，但只盯这一笔，可能看不见前三案已经留下的同名线索。
- **ordinary-news｜先按普通财经新闻处理：** 先读通报。尤其核对有没有提栖行此前披露的押金归集；不能只凭机构同名就把各人的转账并成一笔。

**宸直信托全部产品暂停兑付，实控人失联**

赵律师把新闻附的处置通报打开。宸直信托全部产品暂停兑付，实控人暂时失联，监管部门和警方已介入。

通报另列栖行：用户押金被归集至宸直控制的关联资金平台，作为关联项目配资资金，再以相关资产继续融资；到期资金无法回流，栖行的退押金与日常付款同时吃紧。

各笔清偿金额尚未公布。

【确认到】处置通报确认宸直将归集的栖行用户押金用于关联项目配资及继续融资，资金无法回流；此前经营披露、虚增协调费和跨部门待付由此连接成公司层面的资金链。

【不能倒推】不能由公司资金链确认陈的六万八哪天追回，也不能把每一笔垫款标记为已直接投入杠杆；不能倒推第一通认购已全部损失；何的十二万元认购由刚收到的个人成交材料确认，不能用新闻替代；女方父母三十万元的清偿顺序与金额也需分别核对。 周的一百万元仍需分别核其本人原件。

<a id="reading-section-11"></a>

# 独立模式：直播快案

> 快案不属于四幕主线。来电案在本段直接选择问法，问清后推进；单人口播案由玩家在每段材料后选择主播先评价的成立角度。

## 直播快案 01：什么都不图

- **开场：** 一个姑娘打进电话，想请你帮她介绍对象。

### 求助与重大隐瞒

- **为何今晚发生：** 她知道林旭阳除了做情感热线，也兼职替人介绍对象，登记的听众里有做生意、家境稳定的男性，想借直播间获得介绍。
#### 公开求助

- **类型：** interest
- **求助内容：** 她想从主播登记的候选人里获得实际介绍机会。开场说要求不高，后面补出熟悉、经商、家庭稳定及分担房贷的偏好，最后还希望主播先向对方说她可靠，让人愿意见面。

- **咨询者所求：** 想找能体谅脾气、分担生活与房贷的人，先用低要求争取介绍，再借主播信用让人愿意见面。
- **咨询者自利删减：** 把资助买房的人也称作爸爸，淡化当前择偶的房贷要求；希望主播先说她可靠。
#### cover Strategy

- **public Image：** 她把自己说成能养活自己、有房、要求低、看重患难相守，也不擅长说漂亮话的人。
##### honest Details

- 她二十四岁，在商场做服装销售，收入约六七千元。
- 亲生父亲腰伤后不能做重活，母亲在她上小学时离开。
- 她名下有小两居，购入时贷款九十万元，当前余额未公开。

##### layered Leaks

- 普通交流确认她在工作中会说客气话，亲密关系里不愿继续哄人；两种场合的差别不构成矛盾。
- 先说亲生父亲靠零工生活，再说爸爸给了一百万元；对质时先坚持两人一直以父女相称，被逼着只回答是否亲生以后才承认不是同一个人，再用隐私和自愿赠与挡住真实关系。
- 她主动谈到身体顾虑，普通交流中自愿说明曾做检查；不以举例判定隐瞒或疾病。
- 她开头已承认脾气和争吵。最后仍要求刚认识她的主播先说好话，主播拒绝作出没有依据的推荐。

- **default Tactic：** 先用脾气解释分手，再讲家庭与出资；被追问就区分工作与恋爱、重定义爸爸的称呼，最后才把房贷分担说具体。

### 第 1 轮｜先听她怎么介绍自己（sales-version）

【无线索原句后的反应】 **来电人：** 我在店里卖衣服是工作，私下不爱哄人。

#### 普通问话

##### 第 1 组（greeting）

**林旭阳：** 你好，能听见吗？

**来电人：** 能听见。那个……我这事从哪儿说呢。

##### 第 2 组（ask-for-match）

**林旭阳：** 好，你今天想问什么事？

**来电人：** 我想找个对象，也想让你帮我看看，我这样的适合找什么样的。你手里要真有合适的，也可以给我介绍一下。

##### 第 3 组（caller-profile）

**林旭阳：** 我这确实有一些登记的候选男生，看你要什么样的了。先说说你自己吧，以前的情感经历最好也说说。

**来电人：** 我二十四，在商场卖衣服，底薪加提成一个月六七千，自己能养活自己。以前谈过两个，一个去了外地，另一个嫌我脾气不好。我脾气确实不好，好听的也不会讲。现在想找个踏实的，别赌，别动手。家里遇上事，别瞒着我，也别转身就跑。

#### 本轮玩家可选的问题方向

- **sales-voice**：她在柜台上怎么跟顾客说话 → 对质 sales-soft-talk

**林旭阳：** 你在店里，客人试了半天又不买，你也这么直说？

#### 本轮当面对质

### 第 2 轮｜家里和买房的钱（family-version）

【无线索原句后的反应】 **来电人：** 钱是他愿意帮我的，我现在不是来借钱的。

#### 普通问话

##### 第 4 组（birth-father）

**林旭阳：** 你刚才说家里遇事别转身就跑。为什么这么在意这一点？

**来电人：** 我妈就是这么走的。我爸以前给人开货车，后来伤了腰，重活干不了，家里收入就断了。我妈收拾东西就走了，那年我还在上小学。后来我爸一个人把我带大的。现在亲爸偶尔替人看店，也挣不了多少。我就觉得，两个人碰上没法上班，总该一起想办法。

##### 第 5 组（million-from-dad）

**林旭阳：** 你现在是租房，还是跟家里住？

**来电人：** 我自己有套小两居，还有一点贷款。去年买的时候，爸爸给了我一百万，我又添了一点才买下来。以后男方没房，也可以先住我这里。

##### 第 6 组（which-dad）

**林旭阳：** 一百万从家里出，你现在还有贷。这笔钱当时怎么说的？

**来电人：** 他在我身上一直挺舍得的。钱的事其实都不是重点，我也不会让男方养我。

#### 本轮玩家可选的问题方向

- **benefactor-source**：买房的钱到底是谁出的 → 对质 two-fathers

**林旭阳：** 你爸不是伤了腰，连重活都干不了了吗？他哪来的一百万？

- **father-identity**：这位爸爸是不是亲生父亲 → 对质 father-identity

**林旭阳：** 给你一百万的这个爸爸，是你亲生父亲吗？

#### 本轮当面对质

##### two-fathers

【依据话轮】birth-father / million-from-dad / which-dad

###### 微因果合同

- **premise Anchor：** 爸爸给了我一百万
- **source Proves：** 她先说亲生父亲腰伤后收入很少，随后又说爸爸一次给了一百万元买房。
- **source Does Not Prove：** 称呼相同不能证明两人关系，也不能证明这一百万元存在交换条件。
- **answer Adds：** 她承认出资人不是亲生父亲，但拒绝公开双方具体关系。
- **next Limit：** 当前先追出资人与亲爸的区别；后面结合房贷、前任和择偶要求，可以质疑她是否在寻找接续供养的人，不以她拒绝承认终止推断。
- **next Legal Question：** 继续问清她当前的择偶要求，不据此猜测资助人的具体关系。

**林旭阳：** 你爸不是伤了腰，连重活都干不了了吗？他哪来的一百万？

**来电人：** 不是我亲爸给的。我一直叫他爸爸，他也一直把我当女儿。钱是他愿意给我的，你们为什么非要分得这么清？

【画面短停，主播立绘提亮。】

- **过场 ID：** quick-two-fathers
- **内部过场标签（不作字幕）：** 两个“爸爸”
- **过场类型：** reveal
- **过场短标：** 称呼对不上
- **演出变体：** two-fathers
- **触发行：** 2

**林旭阳：** 给这一百万的，跟你是什么关系？

**来电人：** 这是我的私事，我没必要在直播里全说。反正钱是他自愿给的，不是我偷的抢的，房子也在我名下。

##### father-identity

【依据话轮】birth-father / million-from-dad / which-dad

###### 微因果合同

- **premise Anchor：** 爸爸给了我一百万
- **source Proves：** 她先说亲生父亲腰伤后收入很少，随后又说爸爸一次给了一百万元买房。
- **source Does Not Prove：** 称呼相同不能证明两人关系，也不能证明这一百万元存在交换条件。
- **answer Adds：** 她承认出资人不是亲生父亲，但拒绝公开双方具体关系。
- **next Limit：** 当前先追出资人与亲爸的区别；后面结合房贷、前任和择偶要求，可以质疑她是否在寻找接续供养的人，不以她拒绝承认终止推断。
- **next Legal Question：** 继续问清她当前的择偶要求，不据此猜测资助人的具体关系。

**林旭阳：** 给你一百万的这个爸爸，是你亲生父亲吗？

**来电人：** ……不是亲爸。可我叫了这么多年，跟亲爸有什么区别？

**林旭阳：** 给这一百万的，跟你是什么关系？

**来电人：** 这是我的私事，我没必要在直播里全说。反正钱是他自愿给的，不是我偷的抢的，房子也在我名下。

### 第 3 轮｜重新问找人的要求（actual-request）

【无线索原句后的反应】 **来电人：** 没房我说了可以啊，可我也得看合不合适吧。

#### 普通问话

##### 第 8 组（low-standards）

**林旭阳：** 这笔钱你不想说，那你想找的这个对象，要什么条件？

**来电人：** 还是想让你介绍啊。以前是谁帮我，跟我现在找对象有什么关系？一个月四五千就行，年龄大我五岁以内，没房也可以。学历、长相我真不挑，人品好就行。

##### 第 9 组（ordinary-match）

**林旭阳：** 登记表上有个，二十九，月薪六千，在物流公司做调度，没房。要不要先认识一下？

**来电人：** 先别急吧。就这么几句话，我也不知道他平时是什么样的人。加了以后不合适，再删也挺麻烦的。

##### 第 10 组（ordinary-caution）

**林旭阳：** 那什么样的介绍，你会更放心？

**来电人：** 最好是您认识久一点的，自己做点生意，家里也省心。能帮我减轻点房贷压力，那就更好了。

##### 第 11 组（home-price）

**林旭阳：** 还得帮你还房贷啊。你那房子多少钱，贷了多少？

**来电人：** 房子总价两百万。爸爸给了一百万，我添了十万，贷了九十万。每个月还完，工资也剩不了多少。

##### 第 7 组（fertility-example）

**林旭阳：** 房贷是钱的事。你前面说遇事别一听就走，还怕什么？

**来电人：** 遇上事不光是钱的事。哪怕以后他身体不好，或者是我不能生孩子，也能商量着过，别一听就走。

#### 本轮玩家可选的问题方向

- **mortgage-pressure**：分担房贷是要求，还是希望 → 对质 hidden-standards

**林旭阳：** 你说月薪四五千也行，自己的工资还完房贷又剩不了多少。你希望对方每月替你还多少？

- **report-disclosure**：为什么偏偏拿自己不能生孩子举例 → 对质 fertility-slip

**林旭阳：** 怎么会想到拿自己不能生孩子举例？你很担心这个吗？

#### 本轮当面对质

##### hidden-standards

【依据话轮】low-standards / home-price

###### 微因果合同

- **premise Anchor：** 能帮我减轻点房贷压力
- **source Kind：** caller-statement
- **source Proves：** 她希望对象帮助分担房贷，而不只是人品好。
- **source Does Not Prove：** 没有具体月供，不能替双方算出能否负担。
- **answer Anchor：** 那我也得考虑啊
- **answer Adds：** 能否分担房贷会影响她是否愿意见面。
- **next Legal Question：** 问清真实要求后，回应她请主播背书的请求。

**林旭阳：** 你说月薪四五千也行，自己的工资还完房贷又剩不了多少。你希望对方每月替你还多少？

**来电人：** 我又没让他全包。以后住我的房子，帮着还一点不是应该的吗？

**林旭阳：** 如果他四五千只够自己生活，拿不出钱帮你还贷，你还愿意见吗？

**来电人：** 那我也得考虑啊。两个人过日子，总不能比我一个人还紧吧。

##### fertility-slip

【依据话轮】fertility-example

###### 微因果合同

- **premise Anchor：** 或者是我不能生孩子
- **source Proves：** 她在讲相互扶持时主动拿自己不能生孩子举例。
- **source Does Not Prove：** 一句举例不能证明具体诊断、成因或个人经历。
- **answer Adds：** 她承认做过检查，医生说自然怀孕机会较低。
- **next Limit：** 普通交流，由她自愿补充顾虑；不设举例即隐瞒的必答题。

**林旭阳：** 怎么会想到拿自己不能生孩子举例？你很担心这个吗？

**来电人：** 我怕对方一听就走。可现在才刚说介绍，总不能先把检查都交上去吧。

**林旭阳：** 这事你打算什么时候跟对方说？

**来电人：** 见面聊得来，我会跟他说。我以前查过，医生说自然怀孕的机会低一点，又没说一定不能。我还年轻，后面也可以再复查。

### 第 4 轮｜她还要一句推荐（endorsement-request）

【无线索原句后的反应】 **来电人：** 你就先替我说句好话不行吗？

#### 普通问话

##### 第 12 组（borrow-host-trust）

**林旭阳：** 你为什么一定想让我来介绍？

**来电人：** 您做这个两年多了，看人肯定比我准。您要是先跟他说一句，我这人还可以，他至少愿意见我一面。旭阳哥，我条件真没那么多，您就帮我留意一下吧。

#### 本轮玩家可选的问题方向

- **soft-talk**：我刚认识她，凭什么替她说好话 → 对质 useful-soft-talk

**林旭阳：** 我今天才认识你，怎么跟人家保证你可靠？

#### 本轮当面对质

##### useful-soft-talk

【依据话轮】borrow-host-trust

###### 微因果合同

- **premise Anchor：** 先跟他说一句，我这人还可以
- **source Proves：** 她要求今天才认识她的主播先向候选人评价她可靠。
- **source Does Not Prove：** 客气和恭维不能否定她在恋爱中的沟通困难，也不能证明她的人品。
- **answer Adds：** 她仍希望主播先说好话，让对方愿意见面，具体情况留给她以后解释。
- **next Limit：** 主播可以拒绝没有依据的推荐，不要求她公开私人经历。

**林旭阳：** 我今天才认识你，怎么跟人家保证你可靠？

**来电人：** 又没让你担保。你先说一句好话，后面我自己跟他聊。

**林旭阳：** 可人家听的是我说你好，回头不合适，还不得来找我？

**来电人：** 那你就直说不想介绍呗。

### 旁支问法（本通不自动必中）

#### sales soft talk

- **内部 ID：** sales-soft-talk
##### basis Turn Ids

- caller-profile

##### logic Contract

- **premise Anchor：** 好听的也不会讲
- **source Proves：** 她自述卖衣服，同时把不会说好话作为恋爱争吵的解释。
- **source Does Not Prove：** 职业本身不能证明她善于亲密沟通，须听她自己怎样对顾客说话。
- **answer Adds：** 她承认工作时能耐心哄顾客，恋爱里不愿这样做。
- **next Limit：** 普通接话，允许工作与亲密关系中的沟通不同，不作为玩家反驳。

##### lines

###### 1. lines 1

**林旭阳：** 你在店里，客人试了半天又不买，你也这么直说？

###### 2. lines 2

**咨询者：** 那怎么会。我就说姐，您再搭这件试试，这个颜色显气色。真不买，我也得笑着送出去。

###### 3. lines 3

**林旭阳：** 工作里能耐着性子，回家就不想再这么说了？

###### 4. lines 4

**咨询者：** 上班才这么说啊。下班找个对象，还得让我哄？我一天都够累了。

- **类型：** conversation

### 主播结案复盘

> 主播结案复盘

#### 结束通话｜这句保证说不了

【舞台状态】通话收尾

**林旭阳：** 你这忙我帮不了。今天就到这儿吧。

**来电人：** 行，那不麻烦你了。

### 玩家提前收案｜按现有信息谨慎判断

#### 按现有信息收住｜暂不替她介绍

【舞台状态】谨慎收案

**林旭阳：** 我还不了解你，现在没法替你介绍。

#### 制作边界（不上屏）

##### risk Reading

- **标题：** 主播给出的风险判断
她口头说人品好就行，实际还要求对象分担房贷，并希望主播先替她说好话。当前信息不足以替她保证可靠；出资人与她的具体关系仍未说明。

- **confirmed Title：** 她在麦上说了什么
##### 已确认

- 她说亲生父亲腰伤后只能断断续续做零工；给她一百万元买房的是另一位被她称为“爸爸”的人。
- 被问到以后，她只承认出资人不是自己的亲生父亲，没有说明双方的具体关系。
- 她在原始连线里主动拿自己不能生孩子举例；主播回问以后，她才承认医生曾告诉她自然怀孕机会较低。
- 她自述房价两百万，出资人给一百万，自己添十万、原贷九十万；工资还贷后所剩不多，希望对象帮还，当前余额与具体月供未提供。
- 她请求主播替自己说好话，主播拒绝背书后结束通话。
- 她承认能在工作中说好话，但不想在恋爱中继续哄人；最终又希望主播先替她说可靠。

- **unknown Title：** 细节还没说透
##### 今晚定不了

- 给她一百万元的人具体是谁、双方是什么关系，以及现在是否仍有往来。
- 自然怀孕机会较低的医学原因；直播间不能替她下医学结论，也不能由此推断她的性经历。
- 她目前是否另有伴侣，以及真要介绍时双方能接受的具体条件。

- **改写边界：** 本案为原创虚构文本。作者设定沿长期经济供养、个人生育顾虑与接续生活负担展开；玩家由具体说辞、拒答和第二轮择偶要求叠加判断，不需要她亲口认下供养关系。当前资助是否继续、具体交换条件与医学成因未披露，不从职业或检查单项推导性经历，不复刻参考视频中的真实人物。

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
- **confrontation Count：** 6

## 直播快案 02：那晚没回消息

- **开场：** 一个姑娘打进电话，想问问她和男朋友接下来该怎么办。

### 求助与重大隐瞒

- **为何今晚发生：** 她通过婚恋机构认识了一位创业者。两个人相处一个月，男方却在一次周末聚会后停下了联系。她认为自己只是有一晚喝多了、漏回一条消息，想问主播是不是自己对情绪交流要求太高。
#### 公开求助

- **类型：** explanation
- **求助内容：** 她想理解男方为什么突然退出，先获得对委屈和交流需要的支持；几轮解释后又想要一句能发给男方、争取恢复联系的话。收麦时她要求男方先为口气道歉。

- **咨询者所求：** 她想追回一个经济条件、婚姻意愿都符合预期的对象，同时保住自己在这段关系里‘重感情、只想被理解’的说法。只要把分开归因于男方不懂情绪、介意一条消息，她就不用正面面对自己连续几次缩小那两晚的事实。
- **咨询者自利删减：** 她把失联缩成漏看一条消息，未先说明回复“还行”时已经难受；起初只提妹妹，后来才补同行者。她发来旧动态后仍称很久没出去，把生日和毕业聚会排除在外。收礼与沟通需求、拍摄与发布日期作为正常核实，不算隐瞒动机的证据。
#### cover Strategy

- **public Image：** 她介绍自己的学历、家庭和相处经历，想找能认真沟通的人，又把九号外出说成很久以来偶然的一次。
##### honest Details

- 她二十六岁，是重点大学的在读硕士。
- 两人由婚恋机构介绍，认识一个月，平均每周见面两三次。
- 男方三十五岁，自己经营公司，确实按长期关系的节奏接送、吃饭，也送过花和包。

##### layered Leaks

- 普通交流核实花、包和照片评论。收礼高兴、喜欢分享与需要深入交流可以同时成立，不要求玩家以其中一项反驳另一项。
- 开头已交代十一点五十二分回过“还行”；随后追问才承认当时已经喝得难受，不想让男方知道。
- 先只提跟妹妹小聚；被问酒是谁点的时仍只说‘别人’，直到当面对质才补出桌上还有妹妹的一名男性朋友。
- 她说第二天已经向男方解释，却没有主动交代男性同行者；直到主播追问男方为什么会知道，她才承认自己解释时说漏‘妹妹那个朋友’，被男方问住后才补上。
- 她为证明自己的说法发来旧动态截图；主播据六条酒吧、KTV 记录问频率，她把生日、毕业聚会和少喝的场合排除在外。
- 普通交流核实十号发布的是八号的照片，未标日期。男方是否看过、怎样理解仍未知，不将发旧图当作道歉不真诚。

#### case Ledger

- **surface Claim：** 男方不懂她的情绪，只因一次喝多后没有及时回消息，就草率结束了关系。
- **dramatic Object：** 她自报的双方家底差距，花、包和车同框的动态及其评论截图，八号、九号、十号三天的活动顺序，以及十一点五十二和十一点五十八的两条消息。
- **false Solution：** 男方年纪大、忙于创业，不会回应年轻女生的情绪需求；两个人只是交流方式不合。
- **missing Edge：** 她把醉酒后的失联缩成没看手机，先省掉同行者，又把近两个月多次外出按生日、毕业重新分类，维持很久没出去的说法。
- **interest Path：** 如果主播接受她的版本，她既能把男方退出解释成不会沟通，也能继续以被误解的一方去挽回这个条件合适的对象。
- **caller Edit：** 先讲缺少深度，再讲漏回消息；先说与妹妹小聚，对质后才补男性同行者；为证明自己没隐瞒而发来朋友圈，又被看出近两个月反复玩到深夜；先说自己认真道歉，再补道歉当天发出的喝酒动态。
- **第三压力：** 婚恋机构最初把她介绍成学历好、生活简单、想认真结婚的人；男方也按这个版本放慢了相处节奏。
- **physical Verbal Lock：** 聊天记录显示她十一点五十二分还回了‘还行’，十一点五十八分便不再回复。她后来承认，当时已经喝到难受，并不是整晚没有看见手机。
- **reversal：** 一次漏回消息的版本，经追问变成缩小醉酒状态、分段补同行者，再用生日和毕业聚会给自己的频率另分类；男方实际知道多少单列。
- **boundary：** 当前材料显示近两个月六条酒吧或 KTV 动态，一条动态发布于凌晨 5:17；八号和九号连续外出，九号有男性同行且她喝得难受。不能确认每次醉酒程度、具体回家时间或其他未播行为。
- **quote Payoff：** 主播不再劝男方一定继续，也没有提供能让对方马上回复的话术。
- **cover Layer：** 求助先从缺乏交流切入；这一需求本身成立，不能据收礼或发照片判为伪装。
- **load Bearing Layer：** 时间诡计：把八号 KTV、九号酒吧和十号发动态拆开，让连续发生的事看起来互不相关。

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

**林旭阳：** 收到花的时候，你高兴吗？

**来电人：** 我挺高兴的，坐在他车里拍了照片。朋友在下面问是不是谈恋爱了，还有人说羡慕，我回了几个表情。现在朋友圈三天可见。你这边看不到以前的。我自己还能翻。我把花那条和前面几条都截了，刚发后台，前面就是吃饭、演唱会这些。

##### 第 6 组（missed-message-version）

**林旭阳：** 他从什么时候开始不联系的？

**来电人：** 九号那晚，我妹妹叫我出去坐坐。我已经很久没出去了，正好她想喝一点，我们就去了一家清吧。我后来翻记录数过。十一点五十二，他问我喝得怎么样，我回‘还行’；十一点五十八，他又问我准备几点回去。后面那条我没看见，早上七点多才回。第二天我解释了，也跟他道歉了，他还是越来越冷。

#### 本轮玩家可选的问题方向

- **missed-message-state**：漏回消息前后的真实状态 → 对质 message-or-drunkenness

**林旭阳：** 十一点五十二你回的是‘还行’，六分钟以后就没再回。你回‘还行’的时候，身体到底怎么样？

- **founder-busy**：后一条为什么没看见 → 对质 phone-in-bag

**林旭阳：** 前一条你还回着，后一条为什么没看见？手机那会儿放哪儿？

#### 本轮当面对质

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

**林旭阳：** 都快吐了，怎么还跟他说还行？

**来电人：** 我怕他知道我喝多了又来问，才说还行。可第二天一醒我就解释了，也没有故意晾他。

##### phone-in-bag

【依据话轮】missed-message-version

###### 微因果合同

- **premise Anchor：** 她说十一点五十二回复过，之后没有看到消息。
- **source Proves：** 两条消息之间是否还能接触手机需要问清。
- **source Does Not Prove：** 不回消息不能单独证明醉酒程度或隐瞒关系。
- **answer Adds：** 回完后手机放进包里，后来由妹妹拿着包。
- **next Limit：** 沿当晚聚会继续听，不补问另一条身体状态分支。

**林旭阳：** 前一条你还回着，后一条为什么没看见？手机那会儿放哪儿？

**来电人：** 回完就塞包里了。后来不舒服，是妹妹帮我拿着包，我没再翻手机。

### 第 2 轮｜继续问当晚的情况（changed-version）

【无线索原句后的反应】 **来电人：** 我已经说记不清了。你一直追着问，我更不想讲。

#### 普通问话

##### 第 7 组（changed-night-version）

**林旭阳：** 早上七点多才回那条消息。你当时人在哪？

**来电人：** 醒来已经在妹妹家了，回去那段记不太清。桌上混着点了几种鸡尾酒，还有龙舌兰，后面又有人点了一轮。

##### 第 8 组（who-ordered-drinks）

**林旭阳：** 最后那轮还是你点的？

**来电人：** 不是我，别人加的。我已经喝不下了。

#### 本轮玩家可选的问题方向

- **third-person**：那晚没有先说出的第三个人 → 对质 third-person-at-table

**林旭阳：** 你刚说有些酒是别人点的。这个‘别人’是谁？

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

【画面短停，主播立绘提亮。】

- **过场 ID：** quick-third-person-appears
- **内部过场标签（不作字幕）：** 桌上还有一个人
- **过场类型：** reveal
- **过场短标：** 人数对不上
- **演出变体：** third-chair
- **触发行：** 4

**林旭阳：** 你前面只提了妹妹，我刚还以为就你们俩。这个朋友，你为什么没提？

**来电人：** ……我是不想被误会，不是想骗人。

### 第 3 轮｜她怎样向男方解释（explanation-to-him）

#### 普通问话

##### 第 9 组（how-he-knew-version）

**林旭阳：** 那第二天，你跟男方提桌上这个人了吗？

**来电人：** 后来也解释过了啊。我不是都没说。他一直问，我当时也急。

#### 本轮玩家可选的问题方向

- **how-he-knew**：男方怎么发现当晚还有别人 → 对质 how-he-knew

**林旭阳：** 你说解释过了，当时怎么跟他讲的？

#### 本轮当面对质

##### how-he-knew

【依据话轮】who-ordered-drinks / how-he-knew-version

###### 微因果合同

- **premise Anchor：** 第三人已在前一轮问清；本轮她说后来解释过，但还没讲具体怎么解释。
- **source Proves：** 她没有主动把当晚人员说完整，男方是从她后续解释里的破绽继续问下去。
- **source Does Not Prove：** 男方起疑不能证明酒局发生过暧昧或其他未公开行为。
- **answer Adds：** 她说出妹妹那个朋友这一称呼，男方才追问并得知还有男性同行者；线索不依赖他／她字幕差别。
- **next Limit：** 主播可以判断她对男方也在分段补充，不能把男性在场直接写成越界。

**林旭阳：** 你说解释过了，当时怎么跟他讲的？

**来电人：** 先说我喝多了，妹妹把我送回去。说着说着，就说我妹妹那个朋友也不知道我会吐成那样。

**林旭阳：** 说到妹妹那个朋友，他才知道还有个人？

**来电人：** 对，他就问什么朋友。我当时急着解释，哪会每句话都说得那么严谨。

**林旭阳：** 你前面只提妹妹，忽然又有个朋友，他当然要问啊。

**来电人：** 可那就是我妹妹的朋友。我不想说得好像我专门去见他一样。

### 第 4 轮｜再看她发来的朋友圈截图（social-feed）

【无线索原句后的反应】 **来电人：** 我能找到的都发了。你还要我答什么？

#### 普通问话

##### 第 10 组（social-feed-version）

**林旭阳：** 你说自己很久没出去。近两个月的动态还能找着吗？

**来电人：** 那几次动态我找到了，发给你。生日、毕业这些也算啊？我说很久没出去没说错。

##### 第 11 组（social-post-date）

**林旭阳：** 十号你还发了一组 KTV 的照片，那是哪天拍的？

**来电人：** 他可能以为是喝断片那晚拍的，其实不是，那是八号的照片，我晚了两天才发。

##### 第 12 组（previous-night）

**林旭阳：** 八号你也出去喝酒了？

**来电人：** 我跟师姐去唱歌，包厢套餐里带了六杯鸡尾酒。那天就我们两个，我也没喝醉，和九号不是一回事。

#### 本段原件

- 她发来的近两个月动态：六条酒吧或 KTV 记录；上个月三个周末有聚会。
- 其中一条动态发布时间：凌晨 5:17。
- 八号在 KTV；九号在清吧；十号发布的是八号 KTV 的照片。

#### 本轮玩家可选的问题方向

- **nightlife-pattern**：偶尔一次还是经常玩到很晚 → 对质 nightlife-pattern

**林旭阳：** 这两个月六次酒吧、KTV，上个月三个周末都有。你说很久没出去，是这些都不算？

- **apology-post**：道歉当天仍发出的 KTV 动态 → 对质 apology-and-post

**林旭阳：** 你发那组 KTV 照片的时候，写了是八号拍的吗？

#### 本轮当面对质

##### nightlife-pattern

【依据话轮】missed-message-version / social-feed-version / previous-night

###### 微因果合同

- **premise Anchor：** 婚介向男方说她生活简单，她自己也说很久没出去、九号只是偶然；她发来的截图却有近两个月六次深夜酒局，八号和九号又连续两晚外出。
- **source Proves：** 她本人发来的近两个月截图记录了六次外出，八号和九号连续两晚；没有提供更早记录。
- **source Does Not Prove：** 朋友圈不能证明她每次都喝醉，也不能证明她和任何一名异性发生过越界行为。
- **answer Adds：** 她把生日、毕业聚会和少喝的聚会排除在自己所说的外出频率之外。
- **next Limit：** 可以追问她怎样计算外出次数，不根据聚会或异性在场推断越界。

**林旭阳：** 这两个月六次酒吧、KTV，上个月三个周末都有。你说很久没出去，是这些都不算？

**来电人：** 有生日，有毕业聚会。跟同学见面也算玩啊？又不是每次都喝成九号那样。

**林旭阳：** 八号 KTV、九号清吧，连着两晚。你说偶尔出去一次，把前一晚也没算进去？

**来电人：** 八号主要是送师姐，我没喝多少。九号才是我自己想出去坐坐。

##### apology-and-post

【依据话轮】social-post-date / previous-night

###### 微因果合同

- **premise Anchor：** 她说第二天一直认真解释和道歉，却在十号公开发出八号 KTV 喝酒的照片。
- **source Proves：** 十号发布八号照片、未标日期是她确认的行为；男方能看见，但是否看过、怎样理解未有本人答复。
- **source Does Not Prove：** 发旧照片不能证明她再次出去，也不能证明她故意挑衅。
- **answer Adds：** 她承认没标日期，仍认为不是同一天就不该影响自己发照片。
- **next Limit：** 保留她的答偏与不服，不替男方确认看过所有照片。

**林旭阳：** 你发那组 KTV 照片的时候，写了是八号拍的吗？

**来电人：** 没写。可那不是同一天。我照片早就修好了，不发也浪费。他要是问，我完全可以解释。

**林旭阳：** 没写日期，他真看到也未必知道是旧图。你后来单独跟他解释过八号、九号吗？

**来电人：** 那我总不能因为他不高兴，什么都不发、哪里也不去吧？

### 旁支问法（本通不自动必中）

#### emotion or display

- **内部 ID：** emotion-or-display
- **标签：** 情绪交流和公开展示
- **source Anchor：** 还有人说羡慕
- **confrontation Id：** care-or-display
- **主播问句：** 那束花是你自己开口要的，还是他先送的？

#### flower request

- **内部 ID：** flower-request
- **标签：** 那束花是谁先开口要的
- **source Anchor：** 顺口问他能不能也送我一束
- **confrontation Id：** care-or-display
##### confrontation Opening Lines

###### 1. confrontation Opening Lines 1

**林旭阳：** 花是你先开口要的。他真送来以后，你还是觉得缺点什么？

###### 2. confrontation Opening Lines 2

**咨询者：** 我高兴啊，可也想知道他为什么愿意送。他就说你喜欢就买了，后面又没话。

- **主播问句：** 花是你先开口要的。他真送来以后，你还是觉得缺点什么？

#### care or display

- **内部 ID：** care-or-display
##### basis Turn Ids

- relationship-version
- public-photo-screenshot

##### logic Contract

- **premise Anchor：** 她用分享歌曲没人回应证明男方不懂情绪，却主动要求送花；她发来的照片里还有一个新包，评论里朋友表示羡慕，她回复得很开心，前几条也多是漂亮饭和演唱会。
- **source Proves：** 她在意私人交流，也在意男方提供的物质条件和别人如何看待这段关系。
- **source Does Not Prove：** 收花、收包和发照片不能单独证明她只图钱，也不能否定她确实需要沟通。
- **answer Adds：** 她说明包是男方送的，也享受朋友羡慕；仍坚持物质照顾不能替代交流。
- **next Limit：** 普通核实照片与需求，不用享受礼物反驳沟通需求。

##### lines

###### 1. lines 1

**林旭阳：** 花是你先开口要的。他真送来以后，你还是觉得缺点什么？

###### 2. lines 2

**咨询者：** 我高兴啊，可也想知道他为什么愿意送。他就说你喜欢就买了，后面又没话。

###### 3. lines 3

**林旭阳：** 朋友圈截图我看了，朋友都在猜你是不是谈了。你跟他说过这些评论吗？

###### 4. lines 4

**咨询者：** 说过，我还截给他看了。有人羡慕我也高兴啊。但总不能有花有包，就不用好好聊天了吧。

- **类型：** conversation

### 主播结案复盘

> 主播结案复盘

#### 结束通话｜还要不要联系

【舞台状态】通话收尾

**林旭阳：** 你今天还打算联系他吗？

**来电人：** 我可以解释。可他那样问我，他也得先为自己的口气道歉吧。你帮我想一句，别弄得像我求他。

**林旭阳：** 那他不先道歉，你就不联系了？

**来电人：** 先不发了。我都解释过一次了，总不能一直是我找他。

### 玩家提前收案｜按现有信息谨慎判断

#### 按现有信息收住｜今天先聊到这里

【舞台状态】谨慎收案

**林旭阳：** 你跟他怎么说，还得你自己想。让我替你去要道歉，这我帮不了。

**来电人：** 行吧。

**林旭阳：** 挂了。

#### 制作边界（不上屏）

##### risk Reading

- **标题：** 主播给出的风险判断
她连续缩小说法，又要求挽回话术不能像求他，并希望男方先为说话重道歉。她要留住合适对象，同时保留自己无需进一步解释的位置；连续改口很可能正在耗掉男方的信任。不能据此证明出轨、把谁当备选或存在供养关系。

- **confirmed Title：** 这通电话已经说清的事
##### 已确认

- 她主动让男方送花，也收过男方送的包，并把花、包和男方的车拍进公开动态；她的需求不只有私人交流。
- 九号十一点五十二分她回过‘还行’，六分钟后不再回复；她后来承认当时已经喝到难受，只是不想让男方知道。
- 九号酒桌上除她和妹妹外，还有妹妹的一名男性朋友；三个人混酒，她后来呕吐并记不清回程。
- 八号她和师姐去 KTV，九号又去酒吧；‘很久没出去，只是那天碰巧’不是完整版本。
- 她发来的近两个月动态有六条酒吧或 KTV 记录，上个月三个周末有聚会，一条动态发布于凌晨 5:17；她把生日、毕业聚会和少喝的场合排除在“出去玩”之外。
- 十号她向男方解释和道歉的同时，公开发了八号 KTV 的照片。
- 她考虑再联系男方，仍希望男方先为追问的口气道歉，并要求话术不要像自己求人。

- **unknown Title：** 今晚不需要继续猜的部分
##### 今晚定不了

- 九号酒局里是否发生过暧昧、身体接触或其他未公开行为。
- 男方退出时最看重的是醉酒、男性在场、连续改口，还是这些因素叠加。
- 她两个月以前的社交频率，以及两个人是否还会重新联系。
- 男方实际看过哪些旧动态、如何理解十号发出的照片。

- **改写边界：** 本案以公开讨论中常见的相亲沟通、醉酒失联与信息逐步补充模式为结构参考，人物、机构、具体时间、聊天措辞、对质台词与舞台结论均为虚构合成。当前朋友圈三天可见、两批旧动态均由她本人翻出后截屏发给后台，主播没有直接浏览其历史朋友圈；异性在场本身不构成越界证据。

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
- **confrontation Count：** 7

## 直播快案 03：写给女演员的长文

- **开场：** 今晚不接电话。看一篇科技创业者写给女演员的长文。

### 求助与重大隐瞒

- **format：** solo-commentary
- **为何今晚发生：** 一篇指向真人、文末却标了虚构的长文已经刷屏；女方发了公开回应，三千万争议也进入诉讼。林旭阳不接当事人电话，只把公开文本和必要背景压成四段，边读边给出自己的评价。
#### 公开求助

- **类型：** interest
- **求助内容：** 本案没有当事人来电。节目要讨论的是：长文作者声称追三千万，为何又要求对方撤声明、认全文；女方的感情表态有没有回答钱款。公开人物的诉求与主播点评目的分别记录。

- **source Stake：** 长文试图让舆论在判决前先替作者给对方定性，同时保住‘我只是写了个故事、我只要公平、是她来找我谈’的说法。只要主播公开接受这套叙事，长文和诉讼就多了一次公开背书。
- **咨询者自利删减：** 文章把男方所称已转的三千万与未转的五千万美元相邻排列，再接中间人来谈；末尾才给全退钱、撤声明、认全文三条条件。
#### cover Strategy

- **public Image：** 男方将自己写成追钱并恢复名誉的一方，用大额开价和来谈转述强化自己的说法。
##### honest Details

- 男方以科技创业者身份公开发布长文。
- 被点名者为女演员，已公开回应感情与金钱问题。
- 文中的具体私事仍是公开说法，不能由身份介绍自动证实。

##### layered Leaks

- 先读发文者、被点名者及虚构标注。
- 再读男方声称的转款、未转金额和女方回应，各选一个角度点评。
- 循他为什么说她怕了，读早前传闻与中间人转述。
- 对职业风险补必要背景，不拿前例替本案证明私事。
- 回到三条条件，认全文与虚构标注直接相撞。

#### case Ledger

- **surface Claim：** 公开长文把男方写成被金钱要求不断加码的一方；女方公开回应则把自己写成从未因金钱出卖爱情的一方。
- **dramatic Object：** 点名配图与虚构标注、男方所称三千万与五张卡、未转出的五千万美元、中间人的转述和三条条件。
- **false Solution：** 更大开价与来谈的转述，足以证明女方已经认账求饶。
- **missing Edge：** 五千万美元未转；来谈没有本人授权材料；据男方说诉状只写三千万，却要求认全文。
- **interest Path：** 如果玩家只追最大数字，主播就会被带去替单方长文判动机；如果玩家逐段选准切口，主播才会把两边的公开动作都评价到。
- **source Edit：** 先排列钱款与女方未答之处，再借来谈传闻放大压力，最后捆绑三条条件。
- **第三压力：** 公众讨论、女方职业合作与男方公开提及的诉讼，共同给末尾条件施压。
- **physical Verbal Lock：** 本快案不展示现实长文原页、起诉状或调解记录，只让主播读取虚构合成后的公开文本：文末标虚构、起诉范围写三千万，公开条件却还包括撤声明与认全文。
- **reversal：** 玩家起初容易被更大开价和求和传闻带走，四段读完后发现真正可评价的是双方已公开做出的动作：男方拿长文、传闻和条件压舆论，女方在声明里躲开三千万与代孕争议。
- **boundary：** 能确认虚构合成文本里出现了人物基本盘、虚构标注、未转出的五千万美元、已经进入诉讼的三千万、中间人转述和三条公开条件；不能确认催卡、更大开价和代孕安排的原始记录，也不能确认三千万的法律性质、调解授权、具体刑事责任或判决结果。
- **quote Payoff：** 他自己写虚构，却要她认全文；主播不接受这种要求。
- **cover Layer：** 感性诡计：用‘我喜欢她’、‘我只要公平’和‘她现在怕了’先把讨论带到被辜负的一方。
- **load Bearing Layer：** 条件诡计：把诉状里的退钱，与诉状外的撤声明、承认全文捆成一套，再把这套说成普通和解。

### 上屏原文

写给许念的一封信

周砚 · 公开账号长文

许念，这封信写给你，也给一直问我为什么分开的人。

【配图：许念的公开活动照片；照片下标注“演员许念”。】

我们谈婚事的时候，我向你家里的账户转了三千万。这笔钱我已经起诉。你当时嫌一张卡每天只能转一百万，太慢，让我准备五张卡一起打。

后来你又开口要五千万美元。我说，让我想想。这五千万美元我没有转。

在我发这篇文章以前，网上已经有代孕的传闻。后来有中间人找我，说你愿意谈，希望事情不要继续扩大。

你还有演出、平台和品牌合作，事情闹大了会影响工作。我觉得你是怕了，才想尽早把事情平息。

我让中间人带回去三条：第一，退还三千万；第二，撤回你的公开声明；第三，公开承认这篇长文写的都是真的。

三千万在我的诉状里。撤回声明、承认全文，这两条没写进诉状。

有些事你自己清楚。我手里还有，今晚先不放。

纯属虚构。

许念 · 公开回应

我从没因为金钱出卖爱情。

### 第 1 轮｜第一段 · 谁写了什么（people-and-post）

【无线索原句后的反应】 **林旭阳：** 这篇是他自己发出来的。

#### 普通问话

##### 第 1 组（profile-author）

**林旭阳：** 先看写这篇长文的人。

【上屏长文】男方是科技创业者，有自己的高关注度账号。这篇长文由他公开发布，很快被大量转发。

##### 第 2 组（profile-actress）

**林旭阳：** 再看看被他写进文里的女方。

【上屏长文】女方是曾经站在流量顶端的演员，播出平台、品牌和公众形象都是她的职业资产。

##### 第 3 组（essay-label）

**林旭阳：** 文末这个“纯属虚构”，你们看见没有？

【上屏长文】正文指向现实人物并配图，文末却留了一句『纯属虚构』。

#### 本段玩家可选的点评切口

- **labeled-fiction**：点名配图，为什么又写虚构？ → 点评 labeled-fiction

**林旭阳：** 名字和照片都指向一个人，末尾又写“纯属虚构”。看的人到底该按哪句信？

#### 本段主播点评

##### labeled-fiction

【依据话轮】profile-author / essay-label

###### 微因果合同

- **premise Anchor：** 长文正文指向现实人物并配图，文末同时标注纯属虚构。
- **source Proves：** 作者一面把读者指向现实人物，一面在文末保留虚构标注。
- **source Does Not Prove：** 这组写法本身不能证明长文中的私密指控全部属实，也不能替法院认定责任。
- **answer Adds：** 主播明确评价这种写法是在指向真人的同时给作者自己留退路。
- **next Limit：** 只评价公开写法，不借此替任何一边回答后续争议。

**林旭阳：** 名字照片都点了这个人，末尾写虚构。谁信啊？

### 第 2 轮｜第二段 · 钱与回应（money-and-reply）

【无线索原句后的反应】 **林旭阳：** 金额写得很大，可现在只有他这篇长文。

#### 普通问话

##### 第 4 组（money-transferred）

**林旭阳：** 再看钱。他说已经转了多少？

【上屏长文】长文说，谈婚期间三千万打进女方家里账户，他已经为这笔钱起诉；男方的原话是，她嫌一天限额一百万太慢，让我准备五张卡一起打。

##### 第 5 组（money-not-transferred）

**林旭阳：** 后面还有一笔更大的数。

【上屏长文】他又写，后来女方开口要五千万美元；他的回答是『让我想想』，这笔钱没有转出去。

##### 第 6 组（money-not-answered）

**林旭阳：** 女方怎么回的？

【上屏长文】女方说自己从没因为金钱出卖爱情，但对三千万，一个字没回。

#### 本段玩家可选的点评切口

- **single-source-money**：这些细节是谁说的？ → 点评 single-source-money

**林旭阳：** 五张卡、催得急、后来又开大价，这些都是男方在文里讲的。

- **money-split**：哪笔已转，哪笔没转？ → 点评 money-split

**林旭阳：** 三千万，他说转了，也起诉了。五千万美元，他说对方要过，可自己没转。

- **reply-avoids-money**：女方回应了三千万吗？ → 点评 reply-avoids-money

**林旭阳：** 男方把三千万说得这么具体，女方只回一句“不拿金钱换爱情”，这哪儿答上了？

#### 本段主播点评

##### single-source-money

【依据话轮】money-transferred / money-not-transferred

###### 微因果合同

- **premise Anchor：** 五张卡与更大开价目前都来自男方长文。
- **source Proves：** 男方公开写过这些私密细节。
- **source Does Not Prove：** 公开写下不等于每个细节都有第二份材料。
- **answer Adds：** 主播拒绝用女方回应不完整来替男方整篇叙事保真。
- **next Limit：** 已诉金额、未转金额与单方细节继续分层。

**林旭阳：** 五张卡、催得急、后来又开大价，这些都是男方在文里讲的。

**林旭阳：** 他说三千万已经起诉，法院要查的是这笔钱。其他私下细节，不会因为他起诉了就自动变真。

##### money-split

【依据话轮】money-transferred / money-not-transferred / money-not-answered

###### 微因果合同

- **premise Anchor：** 男方说三千万已经转出并起诉；五千万美元停在开口和让我想想；女方声明没有回应三千万。
- **source Proves：** 公开叙事里存在已诉金额、未转金额和未回应金额三层。
- **source Does Not Prove：** 男方写下五张卡和更大开价，不等于这些私密细节已有第二份来源，也不等于三千万已被判为应退彩礼。
- **answer Adds：** 主播明确批评女方回应躲开三千万，同时拒绝把未转金额算入已拿走的钱。
- **next Limit：** 道德上评价公开回应，法律上仍把三千万交给法院。

**林旭阳：** 三千万，他说转了，也起诉了。五千万美元，他说对方要过，可自己没转。

**林旭阳：** 两笔别加在一起算她拿了多少。三千万该不该退，交给法院判。

##### reply-avoids-money

【依据话轮】money-transferred / money-not-answered

###### 微因果合同

- **premise Anchor：** 女方以感情表态回应，却没有逐项回应三千万与代孕争议。
- **source Proves：** 女方公开回应避开了争议中的关键钱款与生育问题。
- **source Does Not Prove：** 回应回避不能反过来证明男方全部私密叙事属实。
- **answer Adds：** 主播明确拒绝接受用漂亮话绕开关键问题的回应。
- **next Limit：** 道德上评价回避，事实层仍不替男方补证。

**林旭阳：** 男方把三千万说得这么具体，女方只回一句“不拿金钱换爱情”，这哪儿答上了？

**林旭阳：** 我想听的是，她认不认这笔钱，怎么解释。这个回应说服不了我。

### 第 3 轮｜第三段 · 他凭什么说她怕了（settlement-rumor）

【无线索原句后的反应】 **林旭阳：** 她到底怎么想，我又没听她自己讲。

#### 普通问话

##### 第 7 组（early-rumor）

**林旭阳：** 钱还没对清，他又说女方怕了。凭什么这么说？把时间倒回长文发布以前。

【上屏长文】在这篇长文刷屏前，网上已经出现代孕传闻，也传出有人提前找中间人谈。

##### 第 8 组（mediation-retelling）

**林旭阳：** 这段“有人来谈”，是谁说的？

【上屏长文】男方称，中间人来传话，说女方愿意谈，希望事情不要继续扩大。现有材料是男方对这次传话的描述，没有中间人的独立原话。

##### 第 9 组（motive-alignment）

**林旭阳：** 他还拿女方的工作来解释这次来谈。

【上屏长文】男方写，她有演出、平台和品牌合作，事情闹大了会影响工作，所以她想尽早平息争议。

#### 本段玩家可选的点评切口

- **settlement-inference**：来谈就能说明她怕了吗？ → 点评 settlement-inference

**林旭阳：** 他觉得她是怕丢工作，才找人来谈。

- **mediation-authorization**：中间人受谁委托？ → 点评 mediation-authorization

**林旭阳：** “她愿意谈”是谁的原话？

- **rumor-as-leverage**：传闻能证明她认了吗？ → 点评 rumor-as-leverage

**林旭阳：** 他把有人来谈紧接在传闻后面，再补一句“她怕了”。

#### 本段主播点评

##### settlement-inference

【依据话轮】early-rumor / motive-alignment

###### 微因果合同

- **premise Anchor：** 求和传闻的时间与女方可能承受的职业风险能够对上。
- **source Proves：** 公开背景提供了一个符合一般逻辑的求和动机。
- **source Does Not Prove：** 动机吻合仍不能证明中间人得到女方授权。
- **answer Adds：** 主播说明职业风险提供了平息争议的可能动机，仍不能据此确认授权。
- **next Limit：** 后续只核对转述链，不把推断写成本人承认。

**林旭阳：** 他觉得她是怕丢工作，才找人来谈。

**林旭阳：** 可这个中间人到底是谁找的？她本人回过这件事吗？

##### mediation-authorization

【依据话轮】mediation-retelling / motive-alignment

###### 微因果合同

- **premise Anchor：** 现有公开说法停在中间人转述。
- **source Proves：** 男方公开称有人出面谈。
- **source Does Not Prove：** 没有女方本人材料能够确认授权与具体诉求。
- **answer Adds：** 主播明确指出可信动机与本人授权之间缺少一环。
- **next Limit：** 不让中间人替女方认账。

**林旭阳：** “她愿意谈”是谁的原话？

**林旭阳：** 现在是男方说，中间人传的是她的意思。我还没看见中间人怎么说，更没看见她怎么委托的。

##### rumor-as-leverage

【依据话轮】early-rumor / mediation-retelling

###### 微因果合同

- **premise Anchor：** 男方把早前传闻与有人来谈解释成女方害怕。
- **source Proves：** 传闻和中间人转述被一并放进公开叙事。
- **source Does Not Prove：** 两者并不能替女方本人承认长文。
- **answer Adds：** 主播指出男方把可信动机进一步加工成舆论压力。
- **next Limit：** 只评价公开传播动作，不猜未公开沟通。

**林旭阳：** 他把有人来谈紧接在传闻后面，再补一句“她怕了”。

**林旭阳：** 这样读下来，来谈就像已经认了前面那些事。可这个结论是他加的。

### 第 4 轮｜第四段 · 退钱为什么还要认全文（settlement-scope）

【无线索原句后的反应】 **林旭阳：** 他要对方答应的，可不只是退钱。

#### 普通问话

##### 第 10 组（settlement-three）

**林旭阳：** 那他让中间人带回去的，只有退钱这件事吗？

【上屏长文】他开出三条：退三千万、撤回公开声明、公开承认整篇长文都是真的。

##### 第 11 组（lawsuit-scope）

**林旭阳：** 这些要求，都写进诉状了吗？

【上屏长文】但他自己也承认：三千万在状子里。撤声明、认长文都不在。

##### 第 12 组（more-to-release）

**林旭阳：** 把第一段的虚构标注翻回来，再读他的最后一句。

【上屏长文】文末写着虚构，收尾却说她自己清楚；我手里还有，今晚先不放。

#### 本段玩家可选的点评切口

- **settlement-scope**：诉状里究竟要求了什么？ → 点评 settlement-scope

**林旭阳：** 照男方自己说的，诉状里是三千万，撤声明、认全文都没写进去。

- **public-leverage**：为什么说有材料却不放？ → 点评 public-leverage

**林旭阳：** “我手里还有”——那他打算什么时候拿出来？

- **moral-conclusion**：标了虚构，怎么还要她认全文？ → 点评 moral-conclusion

**林旭阳：** 最让我不信的是这儿：他自己给文章写虚构，却要她公开认全文。

#### 本段主播点评

##### settlement-scope

【依据话轮】settlement-three / lawsuit-scope

###### 微因果合同

- **premise Anchor：** 三千万进入诉状，撤声明与认全文属于诉状外要求。
- **source Proves：** 男方把诉状内外的三项要求列为同一套条件。
- **source Does Not Prove：** 金额争议不能替诉状外要求自动取得正当性。
- **answer Adds：** 主播把退钱与公开背书拆成不同问题。
- **next Limit：** 三千万交给法院，主播只评价诉状外施压。

**林旭阳：** 照男方自己说的，诉状里是三千万，撤声明、认全文都没写进去。

**林旭阳：** 钱要她退，文章还得让她全认。他自己写的“虚构”，这会儿又不算了？

##### public-leverage

【依据话轮】essay-label / more-to-release

###### 微因果合同

- **premise Anchor：** 文末保留虚构标注，作者又以未公开材料施压。
- **source Proves：** 男方公开使用了我手里还有但暂时不放的表达。
- **source Does Not Prove：** 未公开材料的内容与真实性目前都无法判断。
- **answer Adds：** 主播把这种表达评价为利用对方职业风险施压。
- **next Limit：** 不猜未公开材料，只评已经说出口的威胁结构。

**林旭阳：** “我手里还有”——那他打算什么时候拿出来？

【画面短停，主播立绘提亮。】

- **过场 ID：** quick-public-leverage
- **内部过场标签（不作字幕）：** 文末虚构，转头用未公开材料施压
- **过场类型：** reveal
- **过场短标：** 最后一张牌
- **演出变体：** settlement-terms
- **触发行：** 1

**林旭阳：** 东西还没见着，倒先让她把整篇认了。

##### moral-conclusion

【依据话轮】settlement-three / more-to-release

###### 微因果合同

- **premise Anchor：** 文末虚构标注与要求对方承认整篇长文同时出现。
- **source Proves：** 作者公开给自己的叙述保留退路，又要求对方取消这条退路。
- **source Does Not Prove：** 这些公开动作不能替法院完成金额与刑事判断。
- **answer Adds：** 主播评价该不一致的公开要求，不强制补一段双方各打五十大板。
- **next Limit：** 结论落在公开行为，不冒充法律定性。

**林旭阳：** 最让我不信的是这儿：他自己给文章写虚构，却要她公开认全文。

**林旭阳：** 这句虚构到底只准谁用啊？

### 旁支问法（本通不自动必中）

#### attention asymmetry

- **内部 ID：** attention-asymmetry
- **标签：** 谁主动把事情公开？
- **source Anchor：** 由他公开发布
- **confrontation Id：** attention-asymmetry
- **主播问句：** 长文是他自己发出来的，不是女方先爆的。

#### career asymmetry

- **内部 ID：** career-asymmetry
- **标签：** 她的工作会受影响吗？
- **source Anchor：** 都是她的职业资产
- **confrontation Id：** career-asymmetry
- **主播问句：** 她靠演出和品牌合作吃饭。这事一直挂着，片方和品牌方会不会继续找她，她能不着急吗？

#### attention asymmetry

- **内部 ID：** attention-asymmetry
##### basis Turn Ids

- profile-author
- profile-actress

##### logic Contract

- **premise Anchor：** 长文由男方在高关注度账号主动发布，女方职业依赖演出与品牌合作。
- **source Proves：** 发文和传播是公开动作，双方可能承担不同风险；是否净获利未确认。
- **source Does Not Prove：** 这种不对称不能证明任何私密指控属实。
- **answer Adds：** 主播先说明男方可能从争议获利，而女方可能承担职业损失。
- **next Limit：** 只解释传播动机，不替后续材料定真假。

##### lines

###### 1. lines 1

**林旭阳：** 长文是他自己发出来的，不是女方先爆的。

###### 2. lines 2

**林旭阳：** 长文是他自己发的，名字照片也都放了。他就是要让她的观众和合作方看见。

#### career asymmetry

- **内部 ID：** career-asymmetry
##### basis Turn Ids

- profile-actress
- essay-label

##### logic Contract

- **premise Anchor：** 女方的播出平台、品牌与公众形象都是职业资产。
- **source Proves：** 争议曝光可能直接伤到她的职业合作。
- **source Does Not Prove：** 职业风险不能证明她做过长文所写的私密行为。
- **answer Adds：** 主播把女方可能急于灭火的职业背景先摆出来。
- **next Limit：** 动机只用于解释反应，不能补成事实。

##### lines

###### 1. lines 1

**林旭阳：** 她靠演出和品牌合作吃饭。这事一直挂着，片方和品牌方会不会继续找她，她能不着急吗？

###### 2. lines 2

**林旭阳：** 我要是她，现在最想知道的恐怕是：这篇东西到底还要挂多久？

### 主播结案复盘

> 主播个人结论

#### 说到这里｜收麦

【舞台状态】点评结束

**林旭阳：** 点名配图，文末又标虚构，还要对方公开认全文。这种写法我不信。三千万该怎么处理，等法院认定。

### 玩家提前收案｜按现有信息谨慎判断

#### 先下结论｜只评已经看见的动作

【舞台状态】提前收束

**林旭阳：** 看到这里，我只评公开动作：点名配图又标虚构，这种写法我不信。

#### 制作边界（不上屏）

##### risk Reading

- **标题：** 主播给出的风险判断
从虚构标注与三项公开条件看，男方很可能借追款争取对整段关系的公开说法；女方用态度声明避开了钱款问题。可以继续追这些具体矛盾，不必等本人承认目的。这不确认私下转账全貌、代孕安排或中间人授权。

- **confirmed Title：** 公开材料里能确认的动作
##### 已确认

- 男方公开长文正文指向现实人物并配图，文末同时标注『纯属虚构』。
- 男方公开叙事称三千万已经转出并进入诉讼；他所说的五千万美元没有转出。
- 女方公开说自己从没因为金钱出卖爱情，但公开回应没有回答三千万与代孕争议。
- 网上曾出现提前求和的传闻；男方称中间人代女方求和，未见中间人原话与女方本人的委托。
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

- **name：** 科技创业者写给女演员的长文
- **role Label：** 公开长文

#### 运行规则

- **内部 ID：** 03-labeled-fiction
- **案件编号：** 03
- **cast Profile Id：** quick3-caller-gu
- **confrontation Count：** 12

<a id="reading-section-12"></a>

# 尾声

## 收播后

- **开场：** 9 月 22 日深夜。你摘下耳机，手机接连震了几下。新闻链接下面，几位以前的来电人又发来了消息。
### unread Messages

#### 1. case1 callback

- **内部 ID：** case1-callback
- **案件 ID：** 01-credit
- **case Label：** 第一通回访
- **sender：** 咨询者
- **声纹卡 ID：** case1-caller-shen
- **base：** 七月那通电话之后，八万我一直没转，灯也早收进箱子了。刚才新闻出来，他又回了一句：宸直那二十万现在动不了，什么时候能拿回来他也不知道。
##### echoes

- **pragmatic：** 那次直播他早听过了，到现在还拿那几笔花销跟我吵。
- **affirm：** 八万拿不出来，那天他也听见了。他到现在还要我一笔笔列。
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
- **base：** 七月底那次会，我跟运营、维修一起问了。后来又催了几回，到今天六万八还没拿到，付款日期还是待通知。多出来那一万二，我当时也说明了。新闻你们看见了吧？无论如何他们得还我六万八，不行我就报警。
##### echoes

- **pragmatic：** 群里到今天还没回。
- **affirm：** 那两个同事也跟着催了。
- **accompany：** 有付款消息我再来。现在还是那句等通知。

#### 3. case3 callback

- **内部 ID：** case3-callback
- **案件 ID：** 03-profile
- **case Label：** 第三通回访
- **sender：** 表妹
- **声纹卡 ID：** case3-caller-cousin
- **base：** 八月底那顿饭取消了，两边父母也各自说过了。我姐后来还问介绍人有没有别的人选，彩礼的条件没松。现在宸直又出了新闻，她爸那三十万原定九月底到期，答应从里面拿二十万给她自己留着，现在也不知道什么时候能拿到。
##### echoes

- **pragmatic：** 介绍人来问，她只说饭局往后放。
- **affirm：** 男方没替她说忙。她还在生这个气。
- **accompany：** 她说要谈也得男方先来找她。

#### 4. case2 callback

- **内部 ID：** case2-callback
- **案件 ID：** 02-tony
- **case Label：** 第四通回访
- **sender：** 咨询者
- **声纹卡 ID：** case2-caller-he
- **base：** 周把转账和回单原图又交了一遍，我也把自己的聊天和十二万转账交了。我们没去店里堵人。现在赎回还是排着，他说买了就得等，可我还是要他先把钱还我。
##### echoes

- **pragmatic：** 合同我还在催。他又嫌我催得急。
- **affirm：** 头发在楼下剪了，十五块。
- **accompany：** 我还在找他要钱，他又让我等产品的消息。

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
- **数据较差分支：** 后台曲线停在老地方。老方的短信显示“输入中”……又消失了。天亮后九点，方案还是要交。
- **platform Cost：** 后台曲线掉回老地方。老方这次没打字，直接发来一句：‘推荐位没了。明早九点，方案照交。’
- **回家：** 天有点亮了。赵睡在沙发上，合同盖在脸上。保温盒空了。你顺手洗了，倒扣在水池边。你把她的合同挪开，又把自己的手机放远了点。 昨晚男方发来的鉴定报告还在消息列表里，赵已经和他约好，今天上午来拿材料。
- **收束：** 你从包里拿出那个牛皮纸文件袋。封口贴着一张便签，赵的字：『你两年前没问完的那通，我帮你找到了后续。』里面是当时用过的旧账单，原件日期写着 2019-11-08；旁边另贴着直播回放索引：2022 年 7 月，『已撤回的账单』。
### closing Cg

- **src：** ./assets/generated/cg/envelope-2019-pixel.png?v=0.28.0
- **alt：** 天快亮时，直播桌上摊开的牛皮纸文件袋和旧账单
- **kicker：** 账单原件 · 2019-11-08
- **caption：** 2022 年 7 月 · 那通没问完的电话

<a id="reading-section-13"></a>

# 试玩片尾

故事未完待续

<a id="reading-section-14"></a>

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
