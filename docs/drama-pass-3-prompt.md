# 第 3 批·戏剧性改造执行单（drama pass 3）

你是本仓库的实施工程师。本单来自 2026-07-05 的剧情戏剧性评审（标准：意料之外、情理之中），共 4 个任务，按顺序执行。写作规则以 `project-skills/case-scriptwriting/SKILL.md` 与 `project-skills/detective-plot-coupling-review/SKILL.md` 为准；本单给出的台词一律逐字使用，不要润色。任务 1、3、4 只改 `content/packs/steam-demo-01/` 下 JSON；任务 2 含一次小引擎改动。

## 任务 1：修两处回流合理性裂缝（纯文案）

### 1a 案 3（03-profile.json）：回流发件人不能是咨询者本人

问题：现在 `investigationHooks[0].appearsNowBecause` 说截图是咨询者自己补的，可那页最上面一条（"妈，要不要把流水也问了"）恰恰自证她的剪辑——她不可能主动递出这一页。

`appearsNowBecause` 替换为：

> 收麦后，一条私信进来：她表妹也在那个家里群，看了直播，把整页聊天拍了过来。

`surface` 保持不动。

### 1b 案 2（02-tony.json）：错发两次是巧合，重复手滑才是证据

`investigationHooks[0].appearsNowBecause` 替换为：

> 收麦后，另一个女生私信进来：他手滑不是一次两次了，聊的人太多，发错过谁什么，他自己都记不清。这张表她也收到过。

同时从 `investigationHooks[0].material` 中删掉这句（它将由任务 3a 挪进主路径，避免重复）：

> 那位朋友后来补了一句：她待过的店也有维护表，备注顶多写发型和预算，从没见过“下一次推进”这种列。

## 任务 2：材料板反应台词（小引擎 + 案 1 内容模板）

目标：玩家在材料板圈点后，来电人要用一句台词接住这次圈点——命中像一次落地的指控，误圈像一次被挡回。这是把全案唯一的单发决策点变成戏剧节拍。

引擎契约：

- 内容字段：`evidenceChecks[].options[].reactionLine`（可选，字符串）。
- 渲染：玩家点选后，若该选项有 `reactionLine`，在材料板结果区以「咨询者」对话气泡渲染（不是系统备注、不是 toast），出现在"继续"按钮之前。
- `verify:pack` 的 runtime schema 允许该可选字段；`scripts/verify-logic.js` 增加一条断言：evidence 渲染路径能输出 reactionLine 气泡。
- `npm run smoke:browser` 若断言了材料板结果屏文本，同步更新。

案 1（01-credit.json）四个选项的 `reactionLine`（逐字）：

- 「断缴后的餐厅、礼物和酒店消费」（T）：

> ……你这么一圈，我自己都说不出“就挡几天”这四个字了。

- 「最低还款金额本身很高」（F）：

> 金额我也吓到过。可你这么问，他还是那句“先帮我挡一下”。

- 「那笔 1.2 万的短视频平台分期」（F）：

> 那笔……刚才都说开了。您别盯着它了，我怕弹幕又拐回我身上。

- 「他说自己怕被分手」（F）：

> 这句我听一次软一次。可软完，账单还在我手机里亮着。

写作约束（后续给案 2-4 补 reactionLine 时同样适用）：误圈的反应台词不得暗示正确答案在哪，只能挡回或自辩；每句必须接住所选选项自己的词（接话头规则）；全部是来电人第一人称口语。案 2-4 的 reactionLine 本批不写，等案 1 模式过 playtest。

## 任务 3：把两个被放逐的转折搬回必经之路（局部链改写）

### 3a 案 2：私加列判别从回流挪进 S4 正文

`sceneVersions[4].version` 末尾追加（在"这就不是我一个人的误会了。"之后）：

> 那个开过店的朋友后来给我回了句话：话术哪家都教，表哪家都有，这一列，她没见过。

链路自查：S2 正文朋友"盯着最后那列没说话"埋钩 → S2 外围喂假解（话术都教）→ S4 正文朋友判词击杀假解（两拍内还债）→ 回流只剩"第二个女生"的外部佐证（配合任务 1b 的删句，不再重复）。

### 3b 案 3：她先提流水的实锤进无条件复盘

`followupTwist` 整段替换（现文只是复读 S4 已上麦的"钱放一起管"，是弱转折；换成对没触发回流的玩家也必达的实锤）：

> 后续回拨里，那页家里群聊天记录被摆了出来：最上面一条“妈，要不要把流水也问了”，是她自己发的。

触发过回流的玩家读到它是确认，没触发的玩家读到它是揭示，措辞对两条路都成立，勿改为"表妹又发了一次"之类的二次事件。

## 任务 4：三个开场白去方向化（纯文案）

开场只许卖"有地方不对"，不许卖"哪里不对"。案 4 的开场是范本，不动。

案 1 `openingComplaint` 替换为：

> 咨询者连线说：“我男朋友说信用卡要周转，想让我先帮他顶几天。这几天我翻他那份账单，越翻越睡不着，今天想让主播帮我听听。”

案 2 `openingComplaint` 替换为：

> 咨询者连线说：“我和相亲认识的一个发型师暧昧了几个月，本来以为快要往前走一步了。结果他昨晚手滑发错一张店里的表，我盯着看了半个钟头，到现在说不上来哪里怪。”

案 3 `openingComplaint` 替换为：

> 咨询者连线说：“我跟相亲对象快到见父母这一步了。他把学历、工作、收入的截图都发来了，后面还主动补了张存款证明。图越全，我妈问得越细，我心里反而越没底。”

`openingDialogue` 各案第一句均不动。

## 验收

1. 任务顺序：1 → 4（纯文案先行）→ 3 → 2（引擎最后）。每步后跑 `npm run content:index && npm run check`。
2. 全部完成后：`npm run verify:pack -- steam-demo-01`；`npm run smoke:browser`。
3. 若 `scripts/verify-logic.js` 或回放脚本钉了被替换的旧文本，在同一提交内更新断言；不得反过来改台词。
4. `rg` 自查：
   - `rg "窟窿早在|不是在排剪头|都少一块" content/` 应零命中（开场方向词清除）。
   - `rg "没见过" content/packs/steam-demo-01/cases/02-tony.json` 应只命中 S4 version，不命中回流 material。
   - `rg "表妹" content/packs/steam-demo-01/cases/03-profile.json` 应命中 appearsNowBecause。
   - `rg "reactionLine" content/ src/` 应命中案 1 四个选项与渲染/校验路径。
5. 更新 `content/packs/steam-demo-01/qa-report.md`：伏笔账本补"私加列"新链路（S2 埋 → S2 外围假解 → S4 击杀 → 回流佐证）。
6. 分两次提交：`fix: repair backflow plausibility and de-telegraph openings`（任务 1+4+3）、`feat: evidence reaction lines land marks as caller beats`（任务 2）。

## 不要做的事

- 不动场景数、材料板数、回流数、accusationChoices、quotePickCandidates、routeAxis/routeTone。
- 不给案 2-4 写 reactionLine，不顺手润色本单之外的台词。
- 任务 2 的反应气泡不做打字机动画、不加音效——只做文字气泡，表现层增强另行立项。
- 案 3 的 stageJudgement / truth 已含"她先提流水"，不要再往里加句子。
