# 第 10 批·六运算与感知带宽落地执行单（expansion pass 10）

你是本仓库的实施工程师。本单来自 2026-07-07 按最新 skill（六运算／感知带宽／信息差配置）的全案重审，四个任务：任务 1-3 纯内容＋既有引擎，任务 4 是唯一引擎项。前置：第 9 批任务 1-4 已落地，任务 5-7 若未完成先收尾。台词与 JSON 逐字使用，不要润色。

## 任务 1：案 3 引爆"主动的存款证明"（纯内容）

种子已在出货文本里：开场白「他**主动**补了张存款证明」＋材料「**当日**存款证明」——没人问存款，他先开好了证明。这是已埋未爆的时间诡计（抢答式补位），给它配齐加工链。

### 1a `sceneVersions[0].questionOptions` 追加第三个选项（第二核心，与现有核心不同矛盾）

```json
{
  "question": "存款证明是家里要求的，还是他自己发的？",
  "answer": "没人提存款。学校收入的图发完，隔了半天，他又补了张当日的存款证明。我那会儿还觉得他周到，现在想，那份周到我说不清哪里怪。",
  "contradiction": "没人索要，TA 先开好当日存款证明补位。",
  "correct": true,
  "routeAxis": "document-edge",
  "routeTone": "trust-but-verify"
}
```

安全阀：若引擎的矛盾计数或 UI 假设"每场景单核心"，先报告，不要自行改判定逻辑。

### 1b `truthBoundary` 增改

- `true` 追加：「存款证明没人要求，是他当天开好主动发来的」
- `edited` 追加：「对方用抢答式的“周到”把材料包装成稳定人设」

### 1c 收麦两处替换

`stageJudgement` 整段替换：

> 别只盯他的图。学历是细问才挤出来的，存款证明是没人问就递来的——一个藏，一个抢答。流水那一问是谁先开的口，今晚也上桌了；两边都在给对方递体面，也都在给自己留退路。

`truth` 中「他的：“名校毕业”四个字留足想象空间，收入只肯给单月截图，流水一问就往后缩——图都是真的，口径全是挑过的。」替换为：

> 他的：“名校毕业”四个字留足想象空间，没人问存款他先把当日证明开好了，收入却只肯给单月截图——图都是真的，口径全是挑过的：肯抢答的抢答，怕追问的往后缩。

## 任务 2：`showsCard` 铺开案 2-4（既有引擎，纯内容）

反讽窗口均等化：材料在被提到的当刻以实物卡出现。各案若已有对应 `evidenceCards` 条目则直接引用其 id；没有则按下述新建（type/title/front 逐字，detail 沿用同案同类卡风格补一句即可）：

- 案 2 `sceneVersions[2].showsCard` → 排班表卡（已有 `daily-tony-roster` 则用之）。front 保持既有文本，不得提前出现「下一次推进」四字（那是 S4 与材料板的揭示）。
- 案 3 `sceneVersions[0].showsCard` → 存款证明卡（无则新建 `daily-profile-deposit`）：type「存款证明」，title「当日存款证明」，front「当日开具的存款证明，余额 28.6 万。」——与任务 1 同拍亮出，抢答的实物感。
- 案 4 `sceneVersions[2].showsCard` → 审批图卡（已有则用之，无则新建 `daily-workplace-approval`）：type「审批截图」，title「报销审批页」，front「抬头写着“报销审批通过”，下方是审批流转记录。」——只写有什么，不写缺什么。

## 任务 3：`callMedium` 声明 + 听觉线索首发（案 2 推子声）

### 3a 四案 JSON 顶层各加 `"callMedium": "voice"`；`verify:pack` schema 允许 `voice|video` 枚举，缺省按 voice。

### 3b 案 2 `sceneVersions[1].version` 整段替换（放语音＋她的迟到听觉发现；纯文本表现，**不引入任何真实音频资源**）

> 后来我翻聊天，发现一个节奏特别明显。他先说“店里压力大”“今晚又被店长说了”，还说这些只跟我讲。我跟朋友提起他，都是这么说的：“他说我像店里自己人。”我一心软，他就接让我帮忙发活动、带朋友去剪头，或者问我下次要不要直接办年卡。我放一条他那阵子的语音你们听听——就这条。……听到了吧，背景里吹风机一直响。他说的下班陪我，是他手上正做着别人的头。

### 3c 案 2 `sceneVersions[1].pressureHint.intentHook` 替换为：

> 背景音里是不是有吹风机

（弹幕只报告听到了什么，不解读。）

### 3d `truthBoundary` 增改

- `true` 追加：「他的深夜语音背景里一直有店内做头发的声音」
- `edited` 追加：「“下班陪你聊天”是店里接客的间隙」

双源自查：语音条（材料）＋她的当场确认（version 内），听觉线索不单独定罪，符合双源规则。

## 任务 4：怜悯层引擎（唯一引擎项）

skill「Diegetic Comment Hints」承诺的 pity layer 至今无引擎。契约：

- 内容字段：`evidenceChecks[].pityLine`（可选字符串，顾问/懂行观众口吻的侧向提示）。
- 触发：玩家在该板**误圈一次之后**，或耐心进入低档且该板未完成时，在弹幕条位置展示一次（每板至多一次）；首次尝试前绝不出现。
- 文本过禁词与"圈/那一栏/哪一块"扫描；`verify:pack` 允许该可选字段。
- 本批内容只配案 1 两块板（案 2-4 的 pityLine 下批随各案顾问口吻统一写）：
  - 板 1（账单检视）：`我家那位断缴那阵，连外卖都戒了——这卡上像戒了的样子吗？`
  - 板 2（往期账单检视）：`工资打款和人情打款，日子的性子不一样。`

## 验收

1. 顺序：任务 1→2→3→4。每个任务后 `npm run content:index && npm run check`。
2. 全部完成：`npm run verify:pack -- steam-demo-01`；`npm run smoke:browser`（案 2 S1 文本变了、案 3 S0 多一个选项，回放脚本钉了旧文本需同步；material-miss 路线补 pityLine 出现断言）。
3. `rg "callMedium" content/` 命中四案；`rg "吹风机" content/` 命中案 2 的 version、intentHook、truthBoundary 三处。
4. `rg "存款证明" content/packs/steam-demo-01/cases/03-profile.json` 应命中开场、S0 新选项、truthBoundary、stageJudgement、truth、材料卡——抢答线全贯通。
5. 手动过案 1：板 1 首次尝试前无 pityLine，误圈一次后出现且只出现一次。
6. qa-report：案 3 A/B 表补一行（A「材料是配合审查发的」→ B「存款证明是没人问就备好的」）；案 4 账本备档候选转折「延后通知发布日 vs 他首次引用日」，**本批不实施**。
7. 提交拆分：`feat: preemptive deposit cert, in-scene cards, and the clipper sound`（任务 1-3）、`feat: miss-gated pity lines in advisor voice`（任务 4）。

## 不要做的事

- 不实施案 4 的日期差候选（只入账）；不给案 2-4 写 pityLine。
- 听觉线索是台词与弹幕文本层的表现，不找音效文件、不加音频系统。
- 案 3 新选项不得削弱原核心（两个都是 correct:true，各带各的矛盾）；若引擎不支持先报告。
- 案 2 排班表卡 front 不得出现「下一次推进」；案 4 审批卡 front 只写有什么。
- pityLine 永不在首次尝试前出现；文本不得点位。
