# 第 15 批·两连线之夜执行单（15-engine + 15a 案 1 竖切）

> 头注：已被 v2 取代。请改用 `docs/overnight-day-pass-15v2-prompt.md`。

你是本仓库的实施工程师。本单是 playtest 判决（"还是线性"）驱动的流程层改革，设计依据 `docs/two-call-night-design.md`，立法见 `detective-plot-coupling-review` 的「Non-linearity Law」。台词与 JSON 逐字使用。本单只改引擎与案 1；案 2-4 待竖切过真人手感后另出。

## 任务 1：夜结构引擎（15-engine）

内容契约（案件可选字段，无此字段的案件保持旧单链流程——案 2-4 暂不迁移）：

```json
"nightStructure": {
  "hangupAnchor": "<场景内容锚点，见 15a>",
  "hangupLine": "", "hostHoldLine": "", "interludeIntro": "",
  "actionBudget": 2,
  "interludeActions": [ { "id": "", "label": "", "kind": "delegate|familyCall|remark|replay|dmReply", "body": {} } ],
  "callbackOpeners": { "<earnedItemId>": { "line": "" } },
  "callbackFallback": { "line": "" },
  "postures": { "againstCaller": "", "withCaller": "" }
}
```

- 流程状态机：段 1（开场→挂断锚点场景）→ 幕间调查台（行动位网格，预算内自由选序，选满或点「接回拨」进入下一段）→ 段 2（回拨：姿态行→开场变体→其余场景照旧→板/深问/原话/边界/收麦不变）。
- 幕间行动结果写入存档（含所选顺序）；每个行动记路线轴；行动位支持简单状态变体（如「若已委托」换文案）。
- 回拨开场：从本次幕间实际取得的 earnedItem 列表让玩家选一件带回；一件都没有→ `callbackFallback`。
- 姿态行：读误判快照方向，回拨第一句前插入对应 posture 行；无快照记录→不插。
- 校验：`verify:pack` 校验 nightStructure 完整性（锚点存在、openers 覆盖全部可获得 earnedItem、actions≥4、budget<actions 数）；`smoke:browser` 增加夜结构路线（段1→选2行动→带回单开场→走到收麦）。
- 委托系统整体迁入幕间行动位（案 1 原 `delegation.moment` 废弃，矩阵原样复用）；advisorNotes/lurker/respondent-note 仍在收麦后（夜的最后一层不动）。

## 任务 2：案 1 竖切内容（15a，全部逐字）

### 2a 段落切分与挂断戏

- `hangupAnchor`：审计拍（version 含「五万多」的那一场）。段 1 = 开场至该场；段 2 = 其余场景。
- 审计拍 version 末尾追加（挂断戏）：

> ……主播，这个数我现在有点站不住。你让我缓缓，我去阳台站一会儿，一定回来。

- `hangupLine`：「电话轻轻挂了。没有摔，就是轻轻的。」
- `hostHoldLine`：「去吧。热线不掐，我们等你。」
- `interludeIntro`：「麦空了，控台的灯还亮着。她回来之前，你还能做两件事。」

### 2b 五个幕间行动位

1. **送鉴定**（kind: delegate）：复用现有委托矩阵，label「把往期账单送出去看」。earnedItemId: `zhou-report`（仅周会计 strong 产出可带回；其余顾问回单记录在案但不成为开场项）。
2. **打给赵律师**（kind: familyCall）label「打给赵律师」body：

> 她接得快。「嗯，我在听你节目。……垫付和赠与那套我信里写过了。你现在该想的不是法条，是她回来以后第一句问什么——别拿数字砸她，数字她自己会怕。」
> 可追一问（二选一）：
> 「如果她不回来了呢？」→「那就说明她去找他对质了。那你今晚的节目，才刚开始。」
> 「那我该拿什么开场？」→「拿你最不忍心拿的那件。别的她都接得住。」

3. **打给周会计**（kind: familyCall）label「打给周会计」body（状态变体）：

> 未委托时：「张在洗碗，长话短说。往期账单发我了吗？没有？那你打来干什么——先送鉴定再打电话，顺序都不会了。」（挂断。此行动位不耗预算，算一次免费教训。）
> 已委托时：「回单看了？那笔不是工资。剩下的别问我，问她。」

4. **重看材料**（kind: remark）label「把往期账单再翻一遍」：对往期账单板开放第二圈，目标「交往之前的同款消费」，圈中文案：

> 交往之前，同款餐厅、同款礼物分期，一直都有。这套体面，不是为她定制的。

earnedItemId: `pre-relationship-pattern`。

5. **听回放**（kind: replay）label「重听她刚才那段」：

> 回放停在「没细看」那一句：停顿两秒半。背景里，有纸页翻动的声音——那几页，一直就在她手里。

earnedItemId: `paper-sound`。

6. **回后台私信**（kind: dmReply）label「回闺蜜的私信」，闺蜜消息：

> 「她还在你节目里吗？让她别垫。还有……我删过的那条评论，别让她知道是我。」
> 回复二选一：
> 「删的什么？」→「就……最早起哄他大方的那条。我不想当见证人。」
> 「我不替人传话。」→「行。那当我没说。」

（本行动无 earnedItem，产出的是闺蜜立场卡的兑现与路线轴记录。）

`actionBudget: 2`（周会计的免费教训不计）。

### 2c 回拨开场三变体＋兜底

- `zhou-report`：

> 她回来了。你念了回单。她沉默了几秒：「不是工资……我知道你们想让我问什么。8 号，准时，一万。我现在只想知道，轮到我这里，算第几个。」

- `pre-relationship-pattern`：

> 「……不是为我一个人练的，对吧。你圈出来的那些日子，我还没认识他。行，那我重新问我自己：我到底是第几家'这家你肯定喜欢'。」

- `paper-sound`：

> 「……你们听得真细。对，账单一直在我手里。'没细看'是假的，我看了一夜。'没敢细看'是真的——看懂了，就得做决定了。」

- `callbackFallback`：

> 「我在阳台把烟戒了又点上。还是得把话说完——你接着问吧。」

### 2d 姿态行（读误判快照）

- `againstCaller`：「你们直播间刚才说我的话，我都看见了。我还是打回来了——不是服气，是不想让他觉得我怕对账。」
- `withCaller`：「谢谢刚才替我说话的人。但先别急着心疼我，听完再说。」

### 2e 合规自查

- 三个开场变体均不越 8 号收窄阶梯（「不是工资」只在委托线出现；她的「算第几个」是对自己的猜想，不指认付款人）。
- `paper-sound` 开场即证言修订：核对原 `revisedVersion` 是否与其重复，重复则由本开场变体取代旧字段（报告后执行）。
- 新事实入账：翻纸声、交往前同款第二圈、闺蜜删评论 → `truthBoundary` 与伏笔账本同步（翻纸声入 true：「回放背景里有纸页声，账单一直在她手里」；闺蜜删评入闺蜜立场卡，不入案件边界）。

## 验收

1. 任务 1 落地后先跑全套（check / verify:pack / smoke:browser——案 2-4 无 nightStructure 必须完全走旧流程零回归）。
2. 任务 2 落地后手动过案 1 三遍：①委托线（周回单开场）②回放线（翻纸声开场）③零行动线（fallback 开场），确认三遍的段 2 信息态不同、姿态行按快照切换。
3. `rg "算第几个" content/` 只命中回拨开场；`rg "翻纸|纸页" content/` 命中回放行动、开场变体、truthBoundary 三处。
4. 提交：`feat: two-call night engine — the player gets a turn`、`feat: case1 vertical slice — hangup, interlude, callback`。

## 不要做的事

- 案 2-4 本单零改动（无 nightStructure 走旧流程）。
- 幕间不加倒计时压力、不加行动推荐标记；预算显示为「还能做 N 件事」即可。
- 对方在幕间永不可拨通；闺蜜回复不追加第三轮。
- 挂断戏不渲染成失败态（这不是断线，是呼吸）。
