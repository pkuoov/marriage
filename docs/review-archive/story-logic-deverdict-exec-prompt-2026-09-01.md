# 全篇剧情/台词复审 · 去「替玩家下判断」执行单（2026-09-01）

> 依据：2026-09-01 对序章 + 四主案 + 三快案的**当前稿**通读（`docs/generated/steam-demo-01-continuous-story-script.md` 全文 + `full-readable-script` 快案段 + 四案 JSON 抽查）。
> 性质：**收口单，不是重写单。** 主线事实、金额、材料边界、A→A′→B 结构、钉死短语全部已成立，一律不动。
> 本轮只治一件事：**游戏替玩家把话说完了。**

## 先说不要动的（防止扩大范围）

上几轮已经修好，本单不许回滚、不许"顺手优化"：

- **公平口癖已经降下来了。** 全篇玩家可见文本里"不能证明/不等于/仍是两回事"合计 9 处，都在承重位。**不要再删**。
- **序章两张材料各有自己的分支台词**（`nightShell.cafePrologue.cafe.evidencePair` 的 chat / hotel 各带 `remainingLines`+`hitLines`）。出示酒店订单时妻子问的是"这个订单你又是哪儿来的"，不是截图那句。**无 bug，不要改。**
- **快案的反转过场卡是对的**：`confrontations[].revealTransition` 在来电人认下来**之后**才闪（快案1 她说完"这是我的私事"才亮"两个爸爸"）。这是正确形状，主案要向它看齐。
- **`docs/review-archive/story-logic-humanize-exec-prompt-2026-08-29.md` 的「已完成，禁止回滚」清单继续有效。**

## 本轮的三个正面范本（改写时照着抄）

改下面任何一处以前，先读这三个仓库内已有的正确写法：

1. **玩家动作后不给判词** —— `01-credit.json` → `overnightStructure.dayScenes[day-support-payments]`。玩家圈完房租，`resultText` 只写"你在两笔住房租赁支出旁各画了一道线。"，没有主播总结，结论靠 `grantsEarnedItemId` 留到第二夜兑现。**这是全库最好的一处。**
2. **压力提示只写听感** —— `03-profile.json` 的七条 `pressureHint.expression.text`：「纸张响了一下，她停了两秒」「她说"等一下"，随后传来几下点按声」「她停了一下，重新念了页面抬头」。全是麦克风里听得见的东西，不预告她要说什么。
3. **过场卡在承认之后** —— 见上一节快案。

---

# P0 · 三个「替玩家下判断」的机制（全部是系统层，不是零散台词）

## P0-1｜反转过场卡把答案写在脸上

`revealTransition` 挂在 `sceneVersions[].questionOptions[]` 上，运行时在进入 `sceneQuestionAnswer` 时闪（`src/app.js:keyRevealTransitionForCurrentScene`）——**也就是在来电人开口之前**。现在有两处的 `label` 直接就是她还没说的那句答案：

| 文件 | 玩家刚点的问题 | 卡面现写 | 她随后才说 |
| --- | --- | --- | --- |
| `02-tony.json` `case2-proxy-invest` | 是你开口让他帮你买，还是他先劝你把钱给他？ | **我让他帮我买的** | 我先问的。 |
| `04-workplace.json` `case4-responsibility-split` | 这张表一确认，活动要是出了问题，公司先找谁？ | **负责的人和付款的人不是一个** | 先找我……可我要催付款，还得找他。 |

玩家点了一个二选一的问题，游戏先把答案打在屏幕上，角色再念一遍。这是本轮最刺眼的一处。

**修法**：把 `label` 从「答案」改成「赌注/物件」——保持问句形状或名词形状，和已有的 `eyebrow` 同一层级。逐字建议（不锁死，可按演出节奏调）：

- `case2-proxy-invest`：`label` 「我让他帮我买的」→ **「十二万，谁先开的口」**（`eyebrow` "钱怎么出去的" 不动）
- `case4-responsibility-split`：`label` 「负责的人和付款的人不是一个」→ **「负责人栏，付款经办栏」**（`eyebrow` "审批页翻到底" 不动）

`01-credit.json` 的 `case1-unexplained-gap`（卡面"还差至少三万五"）**不改**——那个数字主播在自己的问句里已经报过，卡面没有多说。

`03-profile.json` 的 `case3-second-mic`（卡面"第二路麦克风接通"）**不改**——那是舞台事件不是答案。

不要改 `revealTransition` 的触发时机、`id`、`kind`、`visualVariant`，也不要动运行时代码。只改 `label` 字符串。

## P0-2｜压力提示提前剧透本场的承认

`sceneVersions[].pressureHint.expression.text` 在**进场时**上屏（`src/ui/liveHudPresenter.js:190`，生成稿里是场次开头的【】）。可现在有一批是写成**回顾体**的——"说到 X 时……""承认 X 之后……"——于是屏幕在她开口前就报了她这场要说什么。

**案 2（那张名单，播放第四幕）是重灾区，七条里六条剧透，其中两条毁掉本案最大的两个悬念：**

| 场次 | 现写 | 它提前泄了什么 |
| --- | --- | --- |
| `tony-exclusive-voice` | 说到"我要这个位置"时，她停了一下 | 她这场才说得出口的那句 |
| `tony-list-columns` | 承认自己裁过图时，她不再翻那张截图 | 裁图这件事 |
| `tony-bar-rumor-hangup` | 敲门声响起时，她没有再看直播画面 | **敲门本身就是本场结尾的悬念** |
| `tony-who-messaged` | 说出警察两个字以后，她先把电视声音关小了 | **"警察"是全案最大的一次揭示** |
| `tony-caller-benefits` | 承认"我先问的"之后，她不再看屏幕 | 和 P0-1 同一处答案，泄两遍 |
| `tony-next-push-column` | 承认裁图是为了藏住代投时，她不再争养鱼 | 本场结论 |

同型的还有：`01-credit.json` 的 `credit-anniversary-agency`（"承认自己是老会员时停了一下"）、`credit-device-benefit`（"说到'投资'时停了一下"）、`credit-bank-flow`（"说到'买给我的'时，她停了一下"）；`03-profile.json` 的 `profile-proof-before-dinner`（"报出二十八万六时，她把最后一个'六'字说得很轻"，提前报了数）、`profile-income-and-card`（"说到宸直，她停了一会儿"）；`04-workplace.json` 的 `work-leader-note`（"说到被夸时**反而**把声音压低"——"反而"是作者在解释她的心理，8/21 审查 P2「舞台只交付声音或画面」那条没执行到这里）。

**修法**：把上述各条改成**进场即成立的听感/动作**，不引用本场尚未出口的台词，不含"承认…之后""说到 X 时""反而"。照案 3 的写法。逐字建议（可调，形状不可退）：

- `tony-exclusive-voice`：→ 「她说话越来越快，中间不留停顿」
- `tony-list-columns`：→ 「她把手机换到另一只手，屏幕朝下扣了一下」
- `tony-bar-rumor-hangup`：→ 「她压低了声音，像在听屋里别的动静」（**不许出现"敲门"**）
- `tony-who-messaged`：→ 「背景里的电视声一直没停，她隔一会儿看一眼门口」（**不许出现"警察"**）
- `tony-caller-benefits`：→ 「她盯着屏幕，很久没接话」
- `tony-next-push-column`：→ 「她开始重复上一句的前半截」
- `credit-anniversary-agency`：→ 「她翻东西的声音停了」
- `credit-bank-flow`：→ 「听筒离远了一点，她像在把话往回收」
- `profile-proof-before-dinner`：→ 「她把数字念得很轻，念完没有往下接」（**不出现"二十八万六"**）
- `work-leader-note`：→ 「她的声音压低了半格」（去掉"说到被夸时""反而"）

`credit-device-benefit`、`profile-income-and-card` 情节较轻，可保留可微调，由你判断后在交付里说明。

**案 3 的七条、`01-credit` 的 `credit-five-wan-gap`/`credit-loyalty-test`、`02-tony` 的 `tony-list-as-dating`、`04-workplace` 的 `work-private-process`/`work-approval-only`/`work-split-ownership` 是正确写法，一个字不要动。**

## P0-3｜圈中反馈是第三人称判词，还带攻略指导

`evidenceChecks[].options[].feedback` 以主播台词上屏（生成稿里就是 **林旭阳：**）。可来电人此刻**正在线上**，主播却在用「她」谈她；有几条更直接跳出戏，告诉玩家下一步该怎么打。共 14 处，按严重度分三档：

**甲档（跳出戏，直接对玩家做攻略）——必须改：**

- `01-credit` 账单检视 / 那笔 1.2 万的短视频平台分期：「这一笔直接买给她用。**先问它，会把她从'完全不知情'里拉出来**；八万其余部分仍要另算。」
- `04-workplace` 预算沟通记录检视 / 个人垫付需报备：「这条她第一夜已经承认了：……**现在更需要带回去的是九天的时差，或者同事为什么改让她刷个人卡。**」
- `03-profile` 介绍链原话检视 / 她是不是更偏男方家：「另一段聊天里，她也替女方说过没确认的话。**先查"收入稳"从哪儿来的。**」

**乙档（当着她的面用「她」下判词）——改成对她说的第二人称，或改成主播读到的物件 + 一个问题：**

- `01-credit` 纪念日痕迹检视 / 会员号是她的：「会员号和朋友圈都把她放回那顿饭里。八万仍按每笔消费分开算。」
- `01-credit` 固定转账与存款预期 / 他已经把工资全部交给她：「流水只显示……另一半怎么使用不能替他补。」
- `02-tony` 完整名单 / 右侧的金额与产品栏：「第一夜不是没看见，是她没发。」
- `02-tony` 十二万转账 / 她先问能不能帮我买：「她先问能不能跟着买，Tony 才说可以走他的户。」
- `03-profile` 介绍链原话检视 / 她有没有看过工资或流水：「她两样都没看过。」
- `03-profile` 介绍链原话检视 / 她说的"稳定"是多少钱：「她连工资和流水都没见过，现在还谈不上问具体数字。」

改写形状（**这是本单最重要的一条**）：

> 圈中不是让主播替玩家宣布结论，是让主播把玩家圈到的东西**摆到她面前**，然后**闭嘴等她说**。
> 坏：「会员号和朋友圈都把她放回那顿饭里。」
> 好：「会员号是你的，朋友圈也是你发的。这顿饭你怎么就讲成全是他安排的？」

注意：紧跟 `feedback` 的 `reactionLine` 已经是来电人自己的承认（例：「会员号是我的，靠窗位也是我订的……可这顿饭被我讲成全是他安排，讲顺嘴了。」）。**所以主播那句不需要再总结一遍**——把结论让给她说，主播只负责把东西摆上桌。删掉重复的那半句，比改措辞更有效。

**丙档（谈的是不在线的第三方，可保留）——不改：**
`01-credit`「餐厅和酒店都刷在他卡上」「这几笔的时候他还不认识她」「分期习惯说明他一直这么过日子」、`03-profile`「图片和回单都可以是真的」、`04-workplace`「活动总结写了谁负责，没写他什么时候把垫款还回来」。这些说的是男方/材料本身，不是当着来电人评价来电人。

**硬边界**：`logicContract`、`contradiction`、`sourceProves`/`sourceDoesNotProve` 是内部证据合同，**一个字不许为了口语化改软**。只改 `feedback` 这一层玩家听得到的话。

---

# P1 · 硬逻辑（确凿一处）

## P1-1｜案 1 结案判词把一万二重复计了一次

`content/packs/steam-demo-01/cases/01-credit.json` → `truth`（玩家可见，经 `src/ui/recapView.js` 渲染，生成稿里是【连线收住】）现写：

> ……开场却拿五千元男装盖过约四万元共同消费**和**给自己用的一万二设备。

全库其它八处口径一致地写的是「**其中**」——一万二设备**本来就在约四万里面**：

- `evidenceCards[2].front`：「餐厅、礼物、两次酒店和 1.2 万短视频设备分期，**合计约四万**」
- `evidenceChecks[0].material`：同上
- `deceptionChain.stages[2].editedFact`：「约四万元共同排场与她有关，**其中**一万二设备直接给她使用」

`truth` 里的「和」把两笔并列，玩家一加就是 4 万 + 1.2 万 + 0.5 万 = 5.7 万，和全篇钉死的「八万里至少三万五没说清」直接对撞。

**逐字修**：

```
开场却拿五千元男装盖过约四万元共同消费和给自己用的一万二设备。
```
→
```
开场却拿五千元男装盖过约四万元共同消费——那里面就有给自己用的一万二设备。
```

只改这一句。`caseClosing`、`evidenceCards`、`followupTwist`、`dailyShareBody` 的口径都已正确，**不要动**。改完 `rg "一万二" content/packs/steam-demo-01/cases/01-credit.json` 复核：不应再有把 4 万和 1.2 万并列相加的写法。

## P1-2｜案 3 主播用直接引号引了一句她没说过的话

`03-profile.json` → `sceneVersions[2].questionOptions[0].question` 现写：

> 你刚才自己说：'"名校毕业"是我加的。' 后来你妈把彩礼加到二十八万八，你拦过吗？

她的原话（同场 `sceneVersions[2].version`，也是本项的 `sourceAnchor`）是：

> 我回去以后，把"学校好"说成了"名校毕业"。

本作的规矩是回放原话逐字（`sourceAnchor` 全库硬校验）。这里用**直接引号**包了一句转述，读着就是编剧在替角色总结。

**逐字修**：

```
你刚才自己说：‘“名校毕业”是我加的。’后来你妈把彩礼加到二十八万八，你拦过吗？
```
→
```
你刚才说，是你把“学校好”说成了“名校毕业”。后来你妈把彩礼加到二十八万八，你拦过吗？
```

改完确认 `sourceAnchor`（「把"学校好"说成了"名校毕业"」）仍是当前播出原话的逐字子串，`verify:pack` 绿。

---

# P2 · 口语与排版

## P2-1｜尾声三条未读消息混用半角标点

`content/packs/steam-demo-01/manifest.json` → `nightShell.epilogue`，这几条是全场最后读到的字，现在混着半角 `,` 和半角 `:`：

- 615 行：`面煮了,放了两个蛋。`
- 631 行：`明天的话我写好了,三个版本。……开玩笑的。用第一版:先报备,再要回单号。`
- 657 行：`周把转账和回单原图又交了一遍,我也把自己的聊天和十二万转账交了。……新闻出来以后,Tony 还是只说已经提交,没把合同发来。我的钱到底进没进产品,还是不知道。`

全部改成全角 `，` `：`。**只改标点，一个字不动。** 顺手 `rg -n "[，。！？]" ` 之外的半角逗号扫一遍 `manifest.json` 和四案 JSON 的玩家可见字段，同类一并修（不要动 JSON 语法里的逗号，也不要动材料表里的数字格式）。

## P2-2｜来电人替自己做标注

`03-profile.json` → `sceneVersions[3].questionOptions[2].answer`：

> 我跟我妈说："名校毕业，条件不错。"**后面这两个判断都是我自己加的。**

"这两个判断"是评审用词，不是她会说的话。改成人话，例如「这两句都是我自己添的。」——**只改这半句**，前面的原话引用和后面的"我妈一听，马上开始催我带人回家"不动。

改这一处时顺手用同一把尺子扫一遍四案 `answer`/`version`：来电人嘴里如果还有"判断/口径/边界/证明"这类词，列出来报我，**不要自己改**（可能挂着 pin）。

---

# 验收

1. `npm run content:index && npm run content:script && npm run test:logic && npm run verify:pack -- steam-demo-01` 全绿；改了 `pressureHint`/`revealTransition` 后再跑 `npm run smoke:browser`。
2. 测试若因为旧句形失败：**先看是不是 pin 追不上内容**。pin 追内容，不改内容迁就 pin；确需改 pin 时逐条核对现行内容再改，不许删断言。
3. `git diff -- content/` 应只含：3 处 `pressureHint`+2 处 `revealTransition.label`（P0-1/P0-2 实际条数按你执行的为准）、若干 `feedback`、`01-credit.truth` 一句、`03-profile` 一句问句、`manifest` 标点、`03-profile` 半句。**不应含**任何金额、日期、行 ID、`logicContract`、`stageJudgement`、`caseClosing`、钉死短语的改动。
4. 重生成台本后抽读三处：案 2 第四幕进场时**不再预告"警察"和敲门**；案 2 代投那一问**不再先闪出"我让他帮我买的"**；案 1【连线收住】不再把 4 万和 1.2 万并列。
5. 朗读门禁：改过的每一条 `feedback`，遮住字段名，连着它前一句（玩家圈选动作）和后一句（`reactionLine`）读。**如果主播那句删掉之后不影响理解，就删掉，别改。**

# 提交切分

1. `fix(case1): stop double-counting the 1.2 万 device in the closing line`（P1-1）
2. `fix(case3): quote the caller's actual wording`（P1-2）
3. `fix(content): stop pressure hints from pre-announcing the confession`（P0-2）
4. `fix(content): keep reveal cards off the answer`（P0-1）
5. `fix(content): let the caller land her own admission`（P0-3）
6. `chore(content): normalize epilogue punctuation`（P2）

# 交付只报这些

- 改了哪些文件、哪些字段（按上面的编号）
- P0-2 你实际改了几条、哪几条判为"情节较轻可留"
- P0-3 甲/乙档每条一句 before / after；哪几条是**删掉主播那半句**而不是改写
- 跑了哪些测试、是否全绿；有没有动过 pin，动了哪条、为什么
- **如果发现新的上场逻辑断裂（角色装第一次听见、主播引用未上场的数字、结案把 unknown 坐实），单列出来报我，不要顺手改。**

不要写"已全面口语化"。不要重写没点名的字段。
