# 第 16 批·NPC 戏剧扩写（四案厚度 + 三动词配额）

你是本仓库的实施工程师。综合审查结论：**侦探 ledger 合格，演出层偏薄**——NPC/顾问/麦外声 90% 在收麦后「解释」，玩家几乎感觉不到他们在推动剧情；四案真相多在中段一次性说清，后半场像复读。

本单目标：让 NPC 从「解说员」变成「行动者」，用**已授权事实**加厚剧情，不堆新 unknowable。

**前置**：
- 案 1 `nightStructure` 已落地（`01-credit.json` + `interludeDeskView.js`）。本单先做案 1 closeout，再铺案 2–4 的两连线 + NPC 戏。
- 必读：`docs/two-call-night-design.md`、`docs/advisor-npc-and-offmic-design.md`、`docs/two-call-night-pass-15a-prompt.md`、`content/characters/offmic-voices.md`、`content/characters/advisors.md`。

**铁律**：
- 单连线人：对方永不实时上麦。
- 顾问只判效力，不替玩家圈证（禁「圈/那一栏/哪一块」）。
- 8 号收窄阶梯：永不指认付款人；周的深度止于「私人转的 / 不是工资」。
- 不增新事实进 `truthBoundary.unknown` 以外的「今晚可证」列。
- 无性别战争 framing。
- 台词凡本单给出的，逐字使用。

---

## 诊断（先对齐，再动手）

| 问题 | 现状 |
|---|---|
| NPC 三动词 | 包级 FAIL：拒绝仅案1幕间可感；**无 mid-call 打断**；**无框架冲突抉择** |
| 顾问 | 赵/周/林几乎全是收麦 `advisorNotes`；张只有委托 |
| 第三压力 | 店长/介绍人/表姐/助理/领导/前同事 = 口述 + 收麦 hook |
| 直白感 | 真相在 scene3–5 集中落地；scene5–6 常复读；`followupTwist` 不可玩 |
| 案2–4 | 无 `nightStructure`，仍是单链按时发牌 |

**扩写原则（反「加长对话」）**：
1. 每个新拍必须改变**信息态**或**来电人姿态**，否则砍掉。
2. NPC 出场必须带 **REFUSE / INTERRUPT / CONFLICT** 之一，禁止纯 EXPLAIN 新条。
3. 优先把收麦 hook **前移到幕间**，让玩家在回拨前用上。
4. 每案最多加 **1 个新 mid-case 转折 + 1 个 NPC 主动拍**；用压缩重复场腾出篇幅。

---

## 包级三动词配额（本单必须凑齐）

| 动词 | 落地案 | 形态 |
|---|---|---|
| **REFUSE** | 案1（已有周）+ 案1 赵 fetch 拒猜；案3 张「原件才进链」 | 玩家必须回拨去要东西 |
| **INTERRUPT** | 案2 小林幕间主动短信；案4 领导幕间批注弹窗 | 未邀而入 |
| **CONFLICT 抉择** | 案4 幕间「问赵还是问周」互斥；案1 可选赵/周框架 | 玩家选框架 → 回拨首问变 |

---

## 任务 0：引擎小扩展（支撑 NPC 戏，兼容旧案）

在现有 `nightStructure` 上增加（无字段则忽略）：

### 0.1 幕间行动新 kind

| kind | 行为 |
|---|---|
| `advisorCall` | 已有；支持 `followup` 拒答 |
| `advisorConflict` | 展示两位顾问短对立文案，玩家**二选一**；`grantsInventory` 互斥；记入 routeAxis |
| `interruptToast` | 幕间打开时或某 action 后，自动弹出一条未邀短信/批注（可稍后处理）；计入 INTERRUPT |
| `backflowEarly` | 已有；允许 `replyChoices`（回一句影响 `returnStance` 微调） |

### 0.2 `callbackOpeners` 增强

- 支持 `requiresChoiceId`：必须选过某 CONFLICT 选项才解锁。
- 支持 `blocksIfInventory`：有某物则隐藏（互斥开场）。

### 0.3 `respondentNote` 可在 segment2 开头「预告到件」

可选字段 `respondentNote.teaseDuringSegment2: true`：第二段某场结束后闪一句「后台有一条未读，来自对方——收麦后可看」，**不可点开**。增加罗生门预感，不破坏单连线人。

### 0.4 校验

`verify:pack`：启用 `nightStructure` 的案子，`interlude.actions` 中至少 1 个 kind ∈ {advisorCall, advisorConflict, interruptToast}；包级四案合计至少 1 refuse / 1 interrupt / 1 conflict（可用 JSON 标记 `npcVerb: "refuse|interrupt|conflict"` 便于统计）。

---

## 任务 1：案 1 closeout（厚度补丁，不重做结构）

文件：`content/packs/steam-demo-01/cases/01-credit.json`

### 1.1 压缩重复（腾篇幅）

- **scene index 5**（设备复读）：`version` 压缩为至多两句，把设备一笔带过，主写「八万缺口 / 期限 / 8 号还入」。建议逐字：

> 灯和稳定器的事，前面说了，不重复。我现在卡的是另一个数：账单可见的消费加分期，撑死三万出头，他开口却是八万。中间五万多，他只说「不是乱来的钱」。还有——账单明明还有几天，他要我今晚就转。

- **scene index 6**：删掉与 scene2 重复的「会员号/订座」复述，只留感情话 + 「怕你离开」语音压力。若现稿大段重复纪念日，砍到只留新信息。

### 1.2 新增幕间行动：打给赵律师（REFUSE + fetch）

插入 `interlude.actions`（cost 1）：

```json
{
  "id": "call-zhao",
  "label": "打给赵律师",
  "summary": "问垫付能不能要回来——她不猜 8 号是谁。",
  "cost": 1,
  "kind": "advisorCall",
  "advisorId": "zhao-lawyer",
  "npcVerb": "refuse",
  "grantsInventory": ["zhao-fetch-trace"],
  "script": {
    "open": "赵，往期账单里有笔 8 号还入。她要是垫了最低还款，以后还能要回来吗？",
    "reply": "以对象身份说半句：8 号谁转的，我不猜。你回拨只问两样——聊天里怎么称呼那笔钱，转账备注写了什么。口说的不算，落纸的算数。",
    "followupQuestion": "那我能不能先按赠与跟她谈？",
    "followupReply": "你没有备注和原话，谈什么都是空气。去要料，别来要结论。"
  }
}
```

新增 opener：

```json
{
  "id": "opener-zhao-fetch",
  "requiresAny": ["zhao-fetch-trace"],
  "label": "用赵的取证清单开场",
  "hostLine": "回拨前我问过人。你要是真转了最低还款，聊天里你怎么叫这笔钱？转账备注打算写什么？",
  "callerRevisedOpening": "……备注？我刚才挂断的时候想的是先转再说。你这么问，我才意识到——他催今晚，根本没给我留写清楚的时间。",
  "appliesRevisedOnScenes": [4]
}
```

### 1.3 可选 CONFLICT：赵/周框架（幕间互斥，预算 1）

```json
{
  "id": "zhao-zhou-frame",
  "label": "听家人吵一句",
  "summary": "赵要备注原话，周要先对路径。你今晚先采哪套？",
  "cost": 1,
  "kind": "advisorConflict",
  "npcVerb": "conflict",
  "options": [
    {
      "id": "frame-zhao",
      "label": "先采赵：要留痕",
      "advisorLine": "没有备注和原话，垫付在纸上不存在。",
      "grantsInventory": ["frame-zhao"],
      "routeAxis": "process-control"
    },
    {
      "id": "frame-zhou",
      "label": "先采周：对路径",
      "advisorLine": "路径断的那天，才是这案子开始的那天。备注以后再抠。",
      "grantsInventory": ["frame-zhou"],
      "routeAxis": "money-flow"
    }
  ]
}
```

- 若选 `frame-zhao`，回拨默认推荐 `opener-zhao-fetch`（若已有 inventory）或把 host 首问改成留痕问法。
- 若选 `frame-zhou`，推荐 `opener-delegation` / `opener-deadline`。

### 1.4 补 `respondentNote`（收麦，罗生门半张嘴）

```json
"respondentNote": {
  "source": "respondent-note",
  "appearsNowBecause": "收麦后，对方给后台留了一段文字，说不上麦。",
  "teaseDuringSegment2": true,
  "text": "失业是真的，账单也是真的。八万里有她也想去的店，订座是她的会员号——这她自己清楚。五万多那块，不是乱来的钱，但细节我不会在节目里讲。她上麦把灯说成「他手机上弄的」的时候，开箱那天她笑得可开心了。"
}
```

合规：不指认 8 号付款人；不坐实五万来历；带可抓剪辑（反咬订座/灯，淡化「投资你」）。

### 1.5 闺蜜私信可回一句

给 `credit-friend-dm`（或幕间 `backend-dm`）加 `replyChoices`：

```json
"replyChoices": [
  { "id": "blame-cheer", "label": "你当时起哄也算观众", "stanceNudge": "defensive" },
  { "id": "protect-friend", "label": "直播里先不提你", "stanceNudge": "open" }
]
```

`stanceNudge` 在已有 `returnStance` 上微调一行（防御多半句 / 放松多半句），不改事实。

---

## 任务 2：案 2 两连线 + NPC 戏（15b 内容）

文件：`02-tony.json`。复用案 1 引擎；写入完整 `nightStructure`。

### 2.1 结构切分

- `segment1SceneIndexes`: `[0, 1, 2, 3]`（到发错表 + 培训板）
- `segment2SceneIndexes`: `[4, 5, 6]`
- 挂断（逐字）：

```json
"hangup": {
  "afterSceneIndex": 3,
  "speaker": "咨询者",
  "line": "……店里来电了。是他。我——我先接一下，别挂节目，我马上回来。",
  "hostLine": "去吧。表和培训页先留在台上。",
  "stageDirection": "忙音。弹幕还在刷「自己人」。"
}
```

### 2.2 幕间行动（预算 3，选 2–3）

| id | label | kind | npcVerb | 作用 |
|---|---|---|---|---|
| `send-appraisal` | 送鉴定 | delegation | — | 现有委托前移 |
| `call-lin` | 打给小林 | advisorCall | refuse | 护行 + 拒替玩家定性 |
| `lin-interrupt` | （自动） | interruptToast | interrupt | 小林未邀短信 |
| `reopen-training` | 重看培训材料 | evidencePass | — | 提前「行业就这样」误判峰值 |
| `other-caller-dm` | 回女客私信 | backflowEarly | conflict | 闹店 vs 止损，玩家回一句 |
| `listen-dryer` | 听回放 | playback | — | 吹风机 vs 下班陪我 |

#### 小林 `call-lin` script（逐字）

```json
{
  "open": "小林，店里维护表都这样写吗？「下一次推进」算行规吗？",
  "reply": "维护表我见过几百张。能带客、能办卡，行里有。但「下一次推进」这写法——我不能替你们定性，你们自己去对表。话说回来，别因为一个人，把一行手艺人都钉死。",
  "followupQuestion": "那我回拨该先追感情还是先追这一列？",
  "followupReply": "我只翻译行话，不替你选刀口。小砸，这题你自己答。"
}
```

#### 小林 INTERRUPT toast（幕间打开 2 秒后自动，逐字）

```json
{
  "id": "lin-interrupt",
  "kind": "interruptToast",
  "npcVerb": "interrupt",
  "from": "小林老师",
  "text": "小砸，我在听。先别在直播里把「手艺人」三个字骂脏——有话私下说。"
}
```

玩家可「稍后处理」或「回一句」：
- `ack-protect-trade`：「收到，先对表不骂行。」→ inventory `lin-temper`
- `push-anyway`：「表上的列比行规重要。」→ 回拨时 caller 更紧（guard↑）

#### 女客私信 CONFLICT（复用 hook `tony-other-caller-dm`，前移幕间）

回一句（逐字选项）：

```json
"replyChoices": [
  { "id": "side-other", "label": "支持她拉群要说法", "grantsInventory": ["side-other-caller"] },
  { "id": "side-caller", "label": "劝她先止损别闹店", "grantsInventory": ["side-caller-stop"] }
]
```

回拨 opener：

- 有 `side-other-caller`：host「后台那位也收到同款表，她想闹到店里。你怎么看？」
- 有 `side-caller-stop`：host「有人想拉你出头。你刚才挂断，是不是也在躲这件事？」

### 2.3 回拨姿态

`stanceSnapshot` 选项映射 defensive/open/neutral（与案1同构）。  
`hostWoundHook` 改为喂假解，逐字：

```text
行业都这样，别上纲上线
```

### 2.4 店长 hook 前移

`tony-manager-training-note` 可在幕间 `reopen-training` 后以摘要到达（全文仍可收麦再读）。回拨 opener「店长说模板没有那一列」。

---

## 任务 3：案 3 两连线 + 介绍链主动化（15c）

文件：`03-profile.json`

### 3.1 结构

- segment1: `[0, 1, 2, 3, 4]`（到 MBA 口径）
- hangup 逐字：

```json
"hangup": {
  "afterSceneIndex": 4,
  "speaker": "咨询者",
  "line": "我妈在家里群 @ 我了。你别挂节目——我回完她马上打回来。",
  "hostLine": "去。学历和流水的事，台上先搁着。",
  "stageDirection": "忙音。介绍人的名字还停在弹幕里。"
}
```

- segment2: `[5, 6]` —— **太短**。处理：把现 scene5–6 扩成 3 拍，或把原 scene4 后半（流水动机）挪入 segment2 作为 index 重建。推荐：segment2 用 `[5, 6]` 并**扩写**各场，把「她先提流水 / 婚后管钱」做成回拨后才全亮的反转（幕间先到家里群截图摘要）。

### 3.2 幕间行动

| id | 作用 |
|---|---|
| `send-appraisal` | 张法医委托（已有 strong） |
| `zhang-refuse` | 张追加：聊天截图不算，要学信网/原件口径——REFUSE fetch |
| `call-lin-grey` | 小林护行 CONFLICT：「先追流水会更黄」 |
| `introducer-early` | 介绍人双面话 hook 前移 |
| `cousin-early` | 表姐说明前移；拒答收入 |
| `family-chat-early` | 家里群「她先提流水」前移——**本案主反转种子** |

#### 张 REFUSE（逐字）

```json
{
  "id": "zhang-refuse",
  "label": "追问张法医",
  "kind": "advisorCall",
  "npcVerb": "refuse",
  "script": {
    "open": "图你看过了。还能不能再往下鉴定？",
    "reply": "哥们的忙照帮，检测费照记。聊天截图不进我的链条。要学信网或原件口径，让她回拨自己去要——我这边到此为止。",
    "followupQuestion": "那 MBA 到底算不算假？",
    "followupReply": "像素没动过，不等于话没动过。真假我只答到图。"
  }
}
```

#### 小林 CONFLICT（逐字选项）

```json
{
  "id": "call-lin-grey",
  "kind": "advisorConflict",
  "npcVerb": "conflict",
  "options": [
    {
      "id": "chase-flow",
      "label": "先追流水",
      "advisorLine": "你先追流水，她家里更急，事更黄。介绍人这行，催不成是常态——别把同行骂成骗子。",
      "grantsInventory": ["chase-flow"]
    },
    {
      "id": "chase-introducer",
      "label": "先拆介绍人双面话",
      "advisorLine": "双面抬价是行规，不是恩情。你要拆，就拆干净——但别指望我在直播里帮你骂同行。",
      "grantsInventory": ["chase-introducer"]
    }
  ]
}
```

### 3.3 补 `respondentNote`

```json
"respondentNote": {
  "appearsNowBecause": "收麦后，男方给后台留了字，不上麦。",
  "teaseDuringSegment2": true,
  "text": "MBA 是真读的，学费谁出的我懒得在节目辩。存款证明是我主动开的，想把饭局圆下去。她家问流水、问工资卡，问得像审犯人——条件两个字，从来不是单方的。介绍人两边说的话，我后来也听说了。"
}
```

### 3.4 扩写短场

scene0 / scene2 / scene5 若仍 <70 字：各补 **一个具体物件动作**（谁先发图、谁先提流水、群里谁顶行），禁止空泛心情句。种子必须能被幕间家里群截图重估。

`hostWoundHook` 改为：

```text
先别只骂一方，两边都有戏
```

---

## 任务 4：案 4 两连线 + 包级 CONFLICT 主场（15d）

文件：`04-workplace.json`

### 4.1 结构

- segment1: `[0, 1, 2, 3]`
- hangup 逐字：

```json
"hangup": {
  "afterSceneIndex": 3,
  "speaker": "咨询者",
  "line": "复盘材料弹了条新批注。我截一下——你别挂，我马上回来。",
  "hostLine": "去截。审批图先留台上。",
  "stageDirection": "忙音。付款状态那一栏仍然是空的。"
}
```

- segment2: `[4, 5, 6]`

### 4.2 幕间核心：赵 vs 周互斥（包级 CONFLICT）

```json
{
  "id": "zhao-zhou-work",
  "label": "今晚只问得动一个家人",
  "summary": "赵要债权留痕，周要付款回单号。预算不够两个都深挖。",
  "cost": 2,
  "kind": "advisorConflict",
  "npcVerb": "conflict",
  "options": [
    {
      "id": "work-frame-zhao",
      "label": "问赵：群里原话+转账",
      "advisorLine": "群里「让我垫」的原话，加上转账记录，债权凭证够了。回拨逼他补一句欠条措辞——口说的不算，落纸的算数。",
      "grantsInventory": ["work-frame-zhao"],
      "routeAxis": "process-control"
    },
    {
      "id": "work-frame-zhou",
      "label": "问周：只要回单号",
      "advisorLine": "别问感受。回拨只问财务要这单的付款回单号——报得出是真在走，报不出就是没付。钱只认路径。",
      "grantsInventory": ["work-frame-zhou"],
      "routeAxis": "money-flow"
    }
  ]
}
```

对应两个 opener（逐字 hostLine）：

- zhao：「回拨了。群里那句「让我垫」，你有没有留屏？他补过欠条没有？」
- zhou：「回拨了。别跟我谈财务慢——付款回单号，你问过没有？」

### 4.3 领导 INTERRUPT

```json
{
  "id": "leader-interrupt",
  "kind": "interruptToast",
  "npcVerb": "interrupt",
  "from": "领导批注（后台同步）",
  "text": "季度复盘别节外生枝。主责按名单走，流程按老规矩补齐。",
  "choices": [
    { "id": "bring-to-callback", "label": "带回拨质问「老规矩」", "grantsInventory": ["leader-note-hot"] },
    { "id": "hold-back", "label": "先压下，怕影响她署名", "grantsInventory": ["leader-note-cold"] }
  ]
}
```

有 `leader-note-hot` 时，segment2 scene5 领导夸奖段改为**冲突版**：她必须回应批注与垫款的错位。  
有 `leader-note-cold` 时，保持现稿，但 deepFollowup 多一句「你刚才为什么不把批注拿上台」。

### 4.4 其他幕间

- `send-appraisal`（现有委托）
- `reopen-timeline`：前移 `work-budget-timeline`「延后通知晚九天」
- `assistant-sample`：前移助理样本；可回一句「请在群里补预算确认」→ fetch
- `listen-pad`：回放「让我垫」

### 4.5 scene5 去重

领导夸奖与 hook `work-leader-recap-note` 合并信息增量：正片只留「批注无金额」；hook 收麦补「只要结果」。

`hostWoundHook`：

```text
财务慢很常见，别先定罪
```

---

## 任务 5：收麦层降噪（避免「解释员堆叠」）

四案 `advisorNotes` 规则：

- 若该顾问已在幕间以 `advisorCall` / `advisorConflict` 出场，收麦 `advisorNotes` **删掉重复专业核心**，只留一句家常收尾（或整段删除）。
- 每案收麦顾问信 ≤1 条；优先留给**未在幕间出场**的顾问。
- `followupTwist`：案2 拉群分裂改为由幕间女客抉择触发不同 twist 文案（两版），不再是不可玩元数据。

---

## 任务 6：验收

1. `npm run content:index && npm run check`
2. `npm run verify:pack -- steam-demo-01`
3. `npm run smoke:browser`  
   - 案1：赵拒猜 + respondentNote tease  
   - 案2：挂断「店里来电」+ 小林 interrupt + 女客回一句  
   - 案3：挂断「我妈 @」+ 家里群前移影响回拨  
   - 案4：赵周互斥 + 领导 interrupt
4. 人工自检三动词：
   - `rg "npcVerb" content/packs/steam-demo-01/cases` 至少含 refuse / interrupt / conflict 各 ≥1
5. 手感标准：每案至少一次「NPC 逼我做了取舍，回拨因此不一样」。

---

## 不要做的事

- 不让对方实时上麦或幕间接通。
- 不让顾问说出圈点位置。
- 不指认 8 号付款人；不解决「老规矩」一词两义。
- 不把四案都加成 10 场空对话——宁肯压缩复读，也不加无效拍。
- 不解释「赵姐」；家常梗每案 ≤1。
- 不改 V2 立绘管线（另单）。
- 不 git commit，除非用户另嘱。

---

## 建议落地顺序

```
0 引擎小扩展（conflict / interruptToast / replyChoices / tease）
1 案1 closeout（压缩 + 赵 + respondentNote）
2 案2 nightStructure + 小林/女客/店长
3 案4 nightStructure + 赵周冲突 + 领导打断  （包级 CONFLICT 优先于案3）
4 案3 nightStructure + 介绍链前移 + 短场扩写
5 收麦降噪 + verify 文案分叉
6 verify / smoke / 三动词自检
```

## 完成时回报（中文）

- 改动文件列表
- 四案三动词对照表（哪案哪拍）
- 每案「回拨因幕间而变」的一例
- verify / smoke 结果
- 仍偏薄的场次（若有）
