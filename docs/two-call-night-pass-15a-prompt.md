# 第 15a 批·两连线之夜竖切（案 1 only）

你是本仓库的实施工程师。本单依据 `docs/two-call-night-design.md` 与综合审查结论，把 **案 1（`01-credit.json`）** 从「单连线按时发牌」改成「一夜两连线」：第一段挂断 → 幕间调查台（玩家回合）→ 回拨开场由玩家携带物决定。

**范围铁律：只做案 1 竖切 + 支撑它的引擎。** 案 2–4 不改结构。不改 V2 立绘接入。不堆新事实。台词与 JSON 凡本单给出的，逐字使用。

前置必读（只读，不扩写）：

- `docs/two-call-night-design.md`
- `project-skills/detective-plot-coupling-review/SKILL.md`（线性禁令 / NPC 三动词）
- `src/runtime/sceneAdvance.js`、`src/app.js`（现有 `sceneReview → stanceSnapshot → evidenceCheck → delegation → accusation → investigationBackflow`）
- `content/packs/steam-demo-01/cases/01-credit.json`

---

## 目标手感（验收标准，先写死）

玩完案 1 后，玩家必须能感到：

1. **她挂断了**——不是系统切场，是戏。
2. **幕间我在选做什么**——时间预算不够全做，取舍改变第二段信息态。
3. **回拨第一句是我带回去的东西**——不同幕间收获 → 不同开场变体。
4. **中段立场影响她回拨姿态**——指责她 → 防御拉满；同情/灰区 → 更松。

若只做成「多了几个按钮但信息态相同」，本单失败。

---

## 任务 0：引擎状态机（`15-engine` 最小集）

在 `src/runtime/sceneAdvance.js` + `src/app.js` + 必要 UI 中落地夜结构。案 1 启用；其他案无 `nightStructure` 字段时保持旧单链。

### 0.1 新场景枚举

增加（命名可微调，但语义必须对齐）：

| scene id | 含义 |
|---|---|
| `callSegment1` | 第一段连线（复用 sceneReview 渲染，索引范围由 JSON 定） |
| `hangupBeat` | 挂断拍（短演出，不可跳过） |
| `interludeDesk` | 幕间调查台 |
| `callSegment2` | 第二段连线（回拨） |
| （既有）`stanceSnapshot` / `evidenceCheck` / `delegation` / `accusation` / `investigationBackflow` / `caseSolved` | 按下方时序重挂 |

### 0.2 案 1 默认时序（必须实现）

```text
callSegment1 (scenes 0–3)
  → hangupBeat
  → interludeDesk（时间预算 3，行动位 5，必选 2–3）
  → callSegment2 开场变体（由携带物决定）
  → callSegment2 余下拍 (scenes 4–6，含姿态开关)
  → stanceSnapshot（若尚未做；见任务 2）
  → 剩余 evidenceCheck（幕间未圈完的）
  → accusation
  → investigationBackflow（仅收麦余味；幕间已到件的 hook 不再重复）
  → caseSolved
```

**委托时机修正（本单硬要求）：**  
`delegation.moment` 从「accusation 前」改为幕间行动位「送鉴定」。回单进入 `interludeInventory`，供回拨开场选用。旧路径 `moveScene("accusation")` 里自动弹委托的逻辑，对启用 `nightStructure` 的案子必须关掉。

### 0.3 状态字段（建议）

在 case runtime state 增加（持久化进存档）：

```js
night: {
  segment: "segment1" | "interlude" | "segment2" | "done",
  hangupDone: boolean,
  interludeBudget: { max: 3, remaining: 3, used: 0 },
  interludeActionsDone: string[],          // action ids
  inventory: string[],                     // 可带回拨的携带物 ids
  callbackOpenerId: string | null,         // 玩家选的开场
  callerStanceOnReturn: "defensive" | "open" | "neutral"
}
```

### 0.4 兼容

- 无 `nightStructure` 的案子：零行为变化。
- `verify:pack`：有 `nightStructure` 时校验行动位、预算、开场变体、挂断文案齐全；无则跳过。
- `smoke:browser`：案 1 增加一条两连线路线（挂断 → 幕间选送鉴定+重看材料 → 带回委托回单开场 → 走完选句）。

---

## 任务 1：案 1 内容契约 `nightStructure`（写入 `01-credit.json`）

在案 1 根级追加（字段名保持一致；文案逐字）：

```json
"nightStructure": {
  "enabled": true,
  "segment1SceneIndexes": [0, 1, 2, 3],
  "segment2SceneIndexes": [4, 5, 6],
  "hangup": {
    "afterSceneIndex": 3,
    "speaker": "咨询者",
    "line": "……八万这个数，我得缓缓。你先别挂节目，我——我过几分钟打回来。",
    "hostLine": "好。你缓缓。材料先放这儿，我们等你。",
    "stageDirection": "忙音。控台只剩材料灯还亮着。"
  },
  "interlude": {
    "title": "幕间·调查台",
    "kicker": "她不在线。时间只够做两三件事。",
    "budget": 3,
    "minActions": 2,
    "maxActions": 3,
    "continueLabel": "回拨她",
    "actions": [
      {
        "id": "send-appraisal",
        "label": "送鉴定",
        "summary": "把往期账单那几页送给一位顾问。",
        "cost": 1,
        "kind": "delegation",
        "grantsInventory": ["delegation-return"]
      },
      {
        "id": "call-family",
        "label": "打给周会计",
        "summary": "不问完整委托，先追一句：8 号还入像不像工资。",
        "cost": 1,
        "kind": "advisorCall",
        "advisorId": "zhou-accountant",
        "grantsInventory": ["zhou-hint-path"],
        "script": {
          "open": "周会计，我截了几页往期账单。8 号那笔，你一眼能看出什么？",
          "reply": "代发抬头没有。私人转的。谁转的我看不见——路径断的那天，才是这案子开始的那天。",
          "followupQuestion": "能再往下追付款人吗？",
          "followupReply": "不能。钱只认路径，不认人。你别逼我猜。"
        }
      },
      {
        "id": "reopen-material",
        "label": "重看材料",
        "summary": "把第一段没圈完的边角再翻一遍。",
        "cost": 1,
        "kind": "evidencePass",
        "grantsInventory": ["material-edge-deadline"],
        "focusCheckIds": ["credit-history-pages"]
      },
      {
        "id": "listen-playback",
        "label": "听回放",
        "summary": "回听她说「都是他安排的那种店」那一段。",
        "cost": 1,
        "kind": "playback",
        "grantsInventory": ["playback-he-arranged"],
        "script": {
          "clipLabel": "回放·账单段",
          "clipLine": "大头是餐厅、礼物和两次酒店，都是他安排的那种店。",
          "hostNote": "「他安排的」——订座记录还没对上这句。"
        }
      },
      {
        "id": "backend-dm",
        "label": "回后台私信",
        "summary": "闺蜜那条删评私信现在到了，可以回一句。",
        "cost": 1,
        "kind": "backflowEarly",
        "hookId": "credit-friend-dm",
        "grantsInventory": ["friend-dm-seen"]
      }
    ]
  },
  "callbackOpeners": [
    {
      "id": "opener-delegation",
      "requiresAny": ["delegation-return", "zhou-hint-path"],
      "label": "用顾问回单开场",
      "hostLine": "你缓过来了的话，我先说一件事：往期账单里，8 号那笔还入——不是工资代发。",
      "callerRevisedOpening": "……你已经找人看过了？那几页我以为只有我跟他看过。私人转的——我之前不敢往那想。",
      "appliesRevisedOnScenes": [4]
    },
    {
      "id": "opener-playback",
      "requiresAny": ["playback-he-arranged"],
      "label": "用回放矛盾开场",
      "hostLine": "回拨前我又听了一遍。你说餐厅都是他安排的——可订座会员号是你的。",
      "callerRevisedOpening": "……那句「他安排的」，我说顺了。店，有几家是我自己挑的。我挂断之前其实就想改口。",
      "appliesRevisedOnScenes": [4]
    },
    {
      "id": "opener-deadline",
      "requiresAny": ["material-edge-deadline"],
      "label": "用期限边角开场",
      "hostLine": "材料边上还有一件：账单还有几天到期，他却要你今晚就动。",
      "callerRevisedOpening": "对。不是卡已经爆了——是他要我今晚先转。这个我刚才挂断的时候，自己也越想越不对。",
      "appliesRevisedOnScenes": [4]
    },
    {
      "id": "opener-friend-dm",
      "requiresAny": ["friend-dm-seen"],
      "label": "用闺蜜私信开场",
      "hostLine": "你挂着的时候，你闺蜜私信过来了。她删那条起哄评论，不是怕你尴尬那么简单。",
      "callerRevisedOpening": "她跟你说了？……那条评论，她当时是真的起哄，后来才怕。我挂断，一半也是因为不想在直播里把她扯进来。",
      "appliesRevisedOnScenes": [4]
    },
    {
      "id": "opener-soft",
      "requiresAny": [],
      "label": "软开场（未带回硬物）",
      "hostLine": "你回来了。八万这个数，我们从你挂断的地方继续。",
      "callerRevisedOpening": "嗯。我缓过一点了。你问吧——我尽量说清楚。",
      "appliesRevisedOnScenes": []
    }
  ],
  "returnStance": {
    "fromSnapshotOptionIds": {
      "caller-benefited": "defensive",
      "respondent-shifted-debt": "open",
      "both-performed": "neutral"
    },
    "default": "neutral",
    "lines": {
      "defensive": "我差点不打回来。刚才弹幕……我都听到了。你要是也觉得是我贪体面，这通我讲不下去。",
      "open": "我回来了。八万的事，你继续问——我不怕对账。",
      "neutral": "我回来了。你刚才等的时候，我自己也把账单又翻了一遍。"
    }
  }
}
```

### 1.1 挂断锚点

- 第一段在 **scene index 3**（设备开箱夜）问完后进入 `hangupBeat`，**不要**再自动进 scene 4。
- 现有 scene 4–6 文案保留，作为第二段主体；开场变体的 `callerRevisedOpening` 插在 segment2 第一句之前（或替换 scene 4 的首屏 version 前导）。

### 1.2 立场快照位置

现有 `stanceSnapshot.afterScene: 4` 落在第一段末（scene 3 之后、挂断前）更合理——玩家带着快照进入幕间，回拨姿态才有开关。

改动：

```json
"stanceSnapshot": {
  "afterScene": 4,
  ...
}
```

保持 `afterScene: 4` 的语义（= scene index 3 完成后触发）——即挂断前先快照，再挂断。若现引擎 `afterScene: 4` 已是「第 4 场结束后」，则**不要改数字**，只保证时序为：

`scene3 done → stanceSnapshot → hangupBeat → interlude → segment2`

### 1.3 hostWoundHook 改写（顺手，逐字）

把案 1 的：

```text
他就是渣，别听解释
```

改为喂养假解，不直接定罪：

```text
失业慌了也正常，别逼太紧
```

---

## 任务 2：幕间 UI（最小可玩）

新建或扩展 UI（建议 `src/ui/interludeDeskView.js`）：

- 标题 / kicker / 剩余预算
- 5 个行动按钮；已做的标记完成；预算不足禁用
- 选满 `minActions` 后可点「回拨她」；超过 `maxActions` 禁止
- 「送鉴定」复用现有 `delegationScreenHtml` 流程，但结果写入 `night.inventory` 而非跳到 accusation
- 「重看材料」打开指定 `evidenceCheck`，圈完返回幕间
- 「回后台私信」复用该 hook 的选项 UI，选完标记 hook 已消费，收麦 backflow 列表跳过该条
- 「听回放 / 打给周会计」用简单对话卡（open→reply，可选 followup 一问）

视觉：延续直播控台语言（ON AIR 熄灭或改为「广告中 / 等待回拨」），不要做成全新 AVG 地图。

---

## 任务 3：回拨开场分发

玩家点「回拨她」后：

1. 根据 `inventory` 过滤可用 `callbackOpeners`（`requiresAny` 有交集；`opener-soft` 始终可用）。
2. 若多个可用，让玩家**选一个**带回的东西（这是第二段的第一句选择）。
3. 播放：`returnStance.lines[stance]` → `hostLine` → `callerRevisedOpening`。
4. 若 opener 含 `appliesRevisedOnScenes`，对这些 scene 优先显示已有 `revisedVersion`（scene 1 已有账单修订版），或把 `callerRevisedOpening` 记为本局覆盖首句。
5. 然后进入 `segment2SceneIndexes` 正常 sceneReview。

姿态计算：读本案已选的 `stanceSnapshot` option id → `returnStance.fromSnapshotOptionIds`；若玩家跳过快照（不应发生；快照不可跳），用 `default`。

---

## 任务 4：NPC 三动词——案 1 至少落地「拒绝」

在幕间「打给周会计」的 `followupReply` 已是拒答。再加一条硬拒绝（逐字写入 `call-family` 或独立小分支）：

若玩家幕间**没**送鉴定、却想在回拨里用「8 号不是工资」压她——不可用。只有 inventory 含 `delegation-return` 或 `zhou-hint-path` 时，对应 opener 才可选。

（打断 / 冲突抉择留给 15b+；本竖切只强制「拒绝」可感。）

---

## 任务 5：案 1 小清理（不扩写，只去重）

审查指出 scene 3 与 scene 5 分期信息重复。在**不改变事实**前提下：

- 保留 scene 3（index 3）开箱物理链为第一段挂断前的高潮。
- scene 5（index 5，第二段）若仍大段重复「灯和稳定器在我这儿」，压缩为至多两句，把篇幅让给「八万缺口 + 8 号还入 + 期限」；可用 `revisedVersion` 或在 version 末尾用一句带过设备。

不要新增五万缺口的新材料边（审查 P2，本单不做）。

---

## 任务 6：校验与测试

1. `nightStructure` schema：`verify-pack.js` 校验 enabled 案必须有 hangup / interlude.actions≥4 / budget / callbackOpeners含 soft / returnStance。
2. 单元或纯函数测试（若仓库有 sceneAdvance 测试习惯）：预算扣减、inventory 授予、opener 过滤、无 nightStructure 旧路径回归。
3. `npm run content:index && npm run check`
4. `npm run verify:pack -- steam-demo-01`
5. `npm run smoke:browser`——案 1 两连线路由断言：
   - 出现挂断文案「我得缓缓」
   - 幕间预算从 3 扣到 ≤1
   - 选择送鉴定后 inventory 含 delegation-return
   - 回拨开场 hostLine 匹配 opener-delegation
   - 仍能走到 accusation 与 caseSolved

---

## 不要做的事

- 不改案 2/3/4 的 scene 结构或加 `nightStructure`。
- 不接入 V2 立绘、不生成顾问立绘、不改背景图。
- 不新增案 1 事实（五万来历、8 号付款人、新 hook 正文）。
- 不把幕间做成无限探索；预算与行动位必须死。
- 不让对方（男方）在幕间接通——单连线人铁律。
- 不把委托回单深度写过「私人转的 / 不是工资」——8 号收窄阶梯仍有效。
- 不提交 git，除非用户另嘱。

---

## 建议实现顺序

1. 任务 0 状态机骨架 + 旧案兼容  
2. 任务 1 JSON 写入  
3. 任务 2 幕间 UI  
4. 任务 3 回拨分发 + 姿态  
5. 任务 1.3 + 5 文案小改  
6. 任务 4 拒绝可感确认  
7. 任务 6 校验与 smoke  

## 完成时回报

用中文简短列出：

- 改了哪些文件
- 案 1 新时序是否可手玩通关
- smoke / verify 结果
- 已知限制（若有）
- 下一步 15b（案 2）需要从本案复制的样板点
