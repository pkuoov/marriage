# 第 19 批·复审改稿执行单（Prompt C 内容 + Prompt D skill）

Date: 2026-07-14  
性质：复审后的改稿执行 prompt（内容工程师 + skill 立法），非设计摘要。  
上游 / 关联：

- [multi-scene-rashomon-design.md](multi-scene-rashomon-design.md)（场景配额 / 带回律 / 罗生门律 / 四案日间地图）
- [offline-rashomon-exec-prompts.md](offline-rashomon-exec-prompts.md)（Prompt A/B：17b–d 落地与初评审）
- [offline-rashomon-pass-17-prompt.md](offline-rashomon-pass-17-prompt.md)（17-engine + 17a 案 1 sitIn 基线）

---

## 1. 用法

| Prompt | 角色 | 何时用 |
| --- | --- | --- |
| **Prompt C** | 实施工程师 | 按复审 Top5 改四案 JSON + 必要时最小引擎补丁（幕间 inventory → overnight `earnedItems` 同步） |
| **Prompt D** | skill 立法（只改 skill） | 把已复发的架构律写入 `detective-plot-coupling-review`（Non-linearity）与可选 `case-scriptwriting`（Multi-Scene）；**不写案情谜底** |

建议顺序：

1. 先跑 **Prompt C**（修内容与接线）。
2. 验收全绿后，再跑 **Prompt D**（立法固化，避免下次再断线）。
3. 也可 **C 与 D 同会话但先 C 后 D**；禁止只改 skill 却不修现网断线。

**禁止**编辑 `~/.cursor/plans/` 下任何 `*.plan.md` 或其它 plan 文件。本批 **不** 重做 sitIn / **不** 第二次 sitIn。

---

## 2. 复审基线（勿重做）

### 已完成（勿重复大改）

- 案 1（`01-credit.json`）咖啡厅旁听 `sitIn` 竖切已落地（17a）。
- 案 2–4 已有 `dayScenes` / overnight 白天地图骨架（17b–d / Prompt A 路径）。
- 引擎已承认 `observe` / `sitIn` / `doorstep` 等日间 kinds；`availableOvernightCallbackOpeners` 已存在。

### 本批要修的问题（复审 Top 向）

不是「再铺一张白天地图」，而是 **接线与戏剧取舍**：

1. **幕间 inventory 与隔夜回拨开场断线**：幕间拿到的物/笔记若要改夜 B 第一句，现网却进不了 overnight 开场池。
2. **日间场景缺 choice**：观察/门口/茶馆等仍偏「点进即记」，缺少当场取舍。
3. **双轨挂断 / 双轨 opener**：`nightStructure` 与 `overnightStructure` 各写一套 hangup / opener，玩家体感分裂。
4. **案 3 表姐戏重复**：幕间 `profile-cousin-message` 与白天门口表姐拍叠戏。
5. **案 1 `day-bank-flow` 缺 `earnedItemId`**：流水圈注场景未正式进入 overnight 带回 → opener 链。

### 引擎事实（改稿前提）

`src/runtime/sceneAdvance.js` 中：

```text
availableOvernightCallbackOpeners(brief, earnedItems)
```

**只读** overnight 的 `callbackOpeners`，并用传入的 **`earnedItems` 集合**过滤。  
幕间 `inventory` / interlude 单独记账 **不会**自动变成夜 B opener，除非：

- 同 id（或明确映射）进入 overnight `earnedItems`，或
- 该「必须改开场」的产出迁到 `dayScenes`（`body.earnedItemId` / `choice.grantsEarnedItemId`）并有对应 `callbackOpeners` 条目。

---

## 3. 完整 Prompt C

把下面整段复制到 Codex / Cursor（工程师会话）：

```text
你是本仓库《直播间大侦探》的实施工程师。本单是第 19 批·复审改稿（Prompt C）：在案 1 sitIn 与案 2–4 dayScenes 已存在的前提下，修「幕间 inventory ↔ 隔夜 opener 断线、日间缺 choice、双轨 hangup/opener、案 3 表姐重复、案 1 流水缺 earnedItemId」。不要重做 17a sitIn，不要再铺第二张白天地图。

## 必读

1. docs/offline-rashomon-pass-19-fix-prompt.md（本单；§2 复审基线）
2. docs/multi-scene-rashomon-design.md
3. docs/offline-rashomon-exec-prompts.md（Prompt A/B 已完成目标；本单承接复审后修）
4. docs/offline-rashomon-pass-17-prompt.md（sitIn / engine kinds 基线——勿重做）
5. docs/two-call-night-design.md
6. 引擎事实：src/runtime/sceneAdvance.js → availableOvernightCallbackOpeners 只读 earnedItems（不是幕间 inventory）
7. 目标案：
   - content/packs/steam-demo-01/cases/01-credit.json
   - content/packs/steam-demo-01/cases/02-tony.json
   - content/packs/steam-demo-01/cases/03-profile.json
   - content/packs/steam-demo-01/cases/04-workplace.json

## 硬约束

- 不要编辑 ~/.cursor/plans/ 下任何文件，也不要编辑其它 *.plan.md。
- 不要重做案 1 sitIn 竖切；不要给任何案加第二次 sitIn / 当面审对方。
- ON AIR 仍只有来电人上麦；线下 observe / doorstep / visit ≠ 上麦。
- 不指认「8 号付款人」；不打穿案 1 既有 truthBoundary / 收窄阶梯。
- 不做 V2 立绘 / 新肖像 / 大美术包。
- 台词避开 scripts/verify-logic.js 的 stockAiForbiddenCopyRegex 命中短语，包括但不限于：听到这里、真正、不是…而是、心里咯噔一下、你把这句记下、抓到的关键、核心风险、提款机、白莲花、处心积虑、脑子嗡、满格以后、这通电话 等。旁听 / 观察 choice.prompt 用「旁听至此」「看到这里」一类，不要用「听到这里」若会撞禁词表——以 verify-logic 现网表为准。
- 验收必须全绿：
  npm run content:index && npm run check && npm run verify:pack -- steam-demo-01

## 架构目标（本批核心）

当案件存在 overnightStructure 时：

- 夜 B 回拨开场 **只能** 来自 overnight `callbackOpeners` + 玩家已持有的 `earnedItems`。
- 幕间（nightStructure.interlude）里任何「必须改夜 B 第一句」的 inventory / 产出，必须：
  (a) 以相同 id（或显式 map）同步进 overnight `earnedItems` 路径，并有对应 callbackOpeners 条目；或
  (b) 从幕间删除 / 迁到 dayScenes（earnedItemId / grantsEarnedItemId）。
- 案 2、案 4：把 interlude.budget 收到 **1**（只留控台短动作：送鉴定 / 回放 / 顾问冲突等），行走式离台戏归 dayScenes。
- 禁止两套互不接线的 opener 表（nightStructure.callbackOpeners 与 overnightStructure.callbackOpeners 并存且语义分裂）。挂断台词也要统一：overnight hangup 与 nightStructure.hangup 对齐，不要玩家看到两套挂断。

## C1 · 案 2 · 02-tony.json

1. 给 `day-tony-shop-observe` 加当场 `choice`（至少两岔；取舍须改变带回物或信息态，不要换皮按钮）。
2. 幕间 `listen-dryer`：要么 map 进 overnight earnedItems + callbackOpeners（同 id 或显式映射），要么删除并把吹风机回放发现权完全交给白天路径——禁止幕间拿到却改不了夜 B 开场。
3. `interlude.budget` → **1**。
4. 统一 hangup：overnight 与 nightStructure 挂断台词一致，不另写第二套。

## C2 · 案 3 · 03-profile.json

1. 移除或禁用幕间 `profile-cousin-message`（及其 hook 若仅服务该拍），避免与白天表姐门口 `day-profile-cousin-doorstep` 重复 NPC 拍。
2. 在茶馆 **或** 双份材料 document 日间场景上加 `choice`（至少一处）；document 若产出带回物，必须有 earnedItemId + opener。

## C3 · 案 4 · 04-workplace.json

1. 给 `day-work-breakroom-observe` 加 `choice`。
2. `interlude.budget` → **1**。
3. 保留幕间 `advisorConflict` + `leader-interrupt`（这是控台短冲突，不是第二张地图）。
4. 镜框 / 帧 inventory：若要连夜 B opener，同步进 earnedItems；否则迁 dayScenes 或删掉「假带回」。

## C4 · 案 1 · 01-credit.json

1. `day-bank-flow`：补 `earnedItemId`（建议语义：流水圈注；id 跟包内命名风格），并写对应 overnight `callbackOpeners` 条目（控台 alone 拿不到的第一句）。
2. sitIn 的 `choice`：语气 / 笔记侧重分岔即可（仍只产出旁听笔记类带回），不要重做整场 sitIn，不要第二次当面。

## 引擎（最小补丁）

若内容侧无法只靠 JSON 对齐：允许在 overnight + interlude **同时存在**时，把幕间 inventory 中「已标记为可改 opener」的条目同步进 overnight `earnedItems`（同 id 优先）。

- 改动面要小：不要重写整段夜流程 / 两连线状态机。
- 优先改接线函数或 overnight 进入回拨前的 earnedItems 聚合；verify-pack 若需轻度形状校验可跟一刀。
- 若纯内容映射已够用，可以不改引擎——但必须在交付说明里写清「未改引擎的理由」。

## 不要做的事

- 不编辑 plan 文件。
- 不重做 sitIn；不加第二次 sitIn。
- 不指认 8 号付款人。
- 不引入 stockAiForbiddenCopyRegex 命中句式。
- 不把幕间预算与白天预算重新叠满。
- 不保留「幕间有物、夜 B 开场池看不见」的假带回。
- 不写第二套互不相关的 hangup / opener 表。
- 不做 V2 美术。
- Skill 立法留给 Prompt D；本单以内容 + 最小引擎为主。

## 验收命令（必须全绿）

npm run content:index
npm run check
npm run verify:pack -- steam-demo-01

建议烟测：各案夜 A → 短幕间（预算 1）→ 白天两处（含至少一处带 choice）→ 夜 B opener 可区分且能对应白天/已同步的 earnedItems。

## 建议提交信息（做完后，按实际拆分）

- fix: sync interlude inventory into overnight earnedItems for night-B openers
- fix(case2): shop-observe choice, dryer map-or-cut, interlude budget 1, unify hangup
- fix(case3): drop duplicate cousin interlude beat; add tea/document choice
- fix(case4): breakroom choice, interlude budget 1, frame inventory → overnight or day
- fix(case1): day-bank-flow earnedItemId + opener; sitIn choice tone split
- chore: verify pack after pass-19 fix-up
```

---

## 4. 完整 Prompt D

把下面整段复制到 Codex / Cursor（**只改 skill** 会话）：

```text
你是《直播间大侦探》的 skill 立法委员。本单是第 19 批·Prompt D：只改 skill，不改 case JSON、不改 plan、不重做内容竖切。目标是把复审已确认的架构律写进现有章节，防止「幕间假带回 / 双轨 opener / 日间无 choice / NPC 拍重复」复发。

## 硬约束

- 不要编辑 ~/.cursor/plans/ 或任何 *.plan.md。
- 不要改 content/packs/** 下的 case JSON（内容改动属 Prompt C）。
- 不要改 src/ 引擎，除非用户另开工程单（本单默认不动代码）。
- Skill 正文 **禁止剧透**：不写具体案情物件名到「玩前可知答案」的程度；立法写律，不写谜底；示例用抽象占位（「观察点 choice」「document 带回物」）。
- 不指认「8 号付款人」；不在 skill 里展开案 1 付款人收窄。

## 必读

- docs/offline-rashomon-pass-19-fix-prompt.md（§2 基线与架构事实）
- docs/multi-scene-rashomon-design.md
- docs/two-call-night-design.md
- project-skills/detective-plot-coupling-review/SKILL.md（重点：Non-linearity Law）
- project-skills/case-scriptwriting/SKILL.md（重点：Multi-Scene and Offline Rashomon；可选补丁）

## 必做：detective-plot-coupling-review · Non-linearity

在 Non-linearity（或紧邻 overnight / 两连线节奏的条款）中立法，至少覆盖：

1. **夜 B opener 唯一来源**：当存在 overnightStructure 时，夜 B 回拨开场只能由 overnight `callbackOpeners` + 玩家 `earnedItems` 决定；幕间 inventory 若要改开场，必须同步进 earnedItems（同 id 或显式映射），否则视为无效带回。
2. **禁止双轨 opener / 双轨 hangup**：nightStructure 与 overnightStructure 不得维护两套互不接线的挂断或开场表；应映射对齐或单一真相来源。
3. **禁止重复 NPC 拍**：同一 NPC 的承重拍不要同时活在幕间 action 与 dayScene（观察/门口）里——保留一处，另一处删或降级为非承重。
4. **document / 可带回日间点**：凡声称能改回拨第一句的 dayScene，必须有 earnedItemId（或 choice.grantsEarnedItemId）且 callbackOpeners 有对应条目。
5. **推荐（包级手感）**：每案至少一处 observe / doorstep / visit（或同等离台 kind）带当场 choice；choice 须改变信息态或带回物，禁止换皮按钮。

## 可选：case-scriptwriting · Multi-Scene

若 Multi-Scene 节尚未写清「幕间短、白天长、带回必须接线」，补 3–6 条操作律，与上列对齐；仍不写具体案谜底。

## 交付

1. 指出修改的 SKILL.md 路径与章节标题。
2. 给出可粘贴的 diff 或完整新增段落。
3. 自检：无剧透物件名；无要求第二次 sitIn；无要求重做案 1 旁听竖切。
4. 不要顺手改 JSON。

## 建议提交信息

- docs(skill): legislate overnight earnedItems-only night-B openers and no duplicate offline beats
```

---

## 5. 执行顺序

1. 确认案 1 sitIn 与案 2–4 dayScenes 已在现网（勿回滚 17a / 17b–d 骨架）。
2. 跑 **Prompt C**：按 C1→C4 修四案；需要时做「幕间 inventory → overnight earnedItems」最小引擎补丁。
3. 验收：`npm run content:index` → `npm run check` → `npm run verify:pack -- steam-demo-01`。
4. 跑 **Prompt D**：只改 skill（Non-linearity 必做；Multi-Scene 可选）。
5. 需要时再补浏览器 smoke：各案夜 A → 幕间（budget 1）→ 白天两处 → 夜 B opener 可区分且对应 earnedItems。

也可在同一工程师会话内 **先 C 后 D**；不要只立法不修断线。

---

## 6. 相关链接

- [multi-scene-rashomon-design.md](multi-scene-rashomon-design.md)
- [offline-rashomon-exec-prompts.md](offline-rashomon-exec-prompts.md)
- [offline-rashomon-pass-17-prompt.md](offline-rashomon-pass-17-prompt.md)
- [two-call-night-design.md](two-call-night-design.md)
- [gameplay-story-rereview-2026-07-12.md](gameplay-story-rereview-2026-07-12.md)
- [texture-restoration-pass-18-prompt.md](texture-restoration-pass-18-prompt.md)
