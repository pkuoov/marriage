# 案1 / 案2 · 戏剧残余抛光完整修改 Prompt

**Date:** 2026-07-15

**依据：** 剧情复审 2026-07-15 — 案1/案2 **戏剧重写已落地**（幕间、白天分 earned、`firstConflict`、挂断对齐、案1 sitIn）；本单只做 **POLISH（残余抛光）**，不是二次全案重写。

**关联文档（只读，勿改 plan）：**

- [`docs/case12-drama-rewrite-blueprint.md`](case12-drama-rewrite-blueprint.md) — 脊柱、当场化、非线性锁（已实施基线）
- [`docs/case34-drama-fix-prompt.md`](case34-drama-fix-prompt.md) — 案3/案4 接线 Prompt；可与本单并行/先后
- [`docs/multi-scene-rashomon-design.md`](multi-scene-rashomon-design.md) — 多元场景与夜 B opener 源
- `project-skills/detective-plot-coupling-review/` — 侦探非线性 / 带回律
- `project-skills/case-scriptwriting/` — Multi-Scene / Theatrical License

**目标文件：**

- `content/packs/steam-demo-01/cases/01-credit.json`
- `content/packs/steam-demo-01/cases/02-tony.json`

**不要做：** 不编辑 `~/.cursor/plans/` 或任何 `*.plan.md`；不重做案1 sitIn 节拍 / 餐厅双 earned / 赵周幕间 / 不指认 8 号；不给案2 加 sitIn、Tony 不上麦；不做案3/案4（见 case34）。

---

## 1. 用法

| Prompt | 范围 | 说明 |
|--------|------|------|
| **Prompt 1** | 仅 `01-credit.json` | 设备/灯 **LIVE** 抛光；夜 A 种子守恒 |
| **Prompt 2** | 仅 `02-tony.json` | 孤儿 inventory；嫂子/年卡轻量当场化 |

**与 case34 的关系（推荐顺序二选一）：**

1. **先 3/4 再抛光 2→1：** Prompt 3 → Prompt 4 → Prompt 2 → Prompt 1  
2. **3/4 验收后并行抛光：** Prompt 2 与 Prompt 1 可并行（不同 JSON），仍建议 **先 2 后 1**（案2 孤儿是硬接线债）

**本单性质：** 戏剧重写已在蓝图落地；本 Prompt **只修复审残留**，禁止借机重写整晚台词链。

---

## 2. 基线勿砍（与 blueprint 同表）

### 案1（信用 / 垫款）脊柱

- 垫八万；断缴早于借钱；可见消费 &lt;3 万缺口。
- 订座会员号与设备受益灰区；sitIn 旁听半句（**包级唯一 sitIn**）。
- **不指认 8 号付款人**；ON AIR **单连线**。
- 夜 B opener 唯一源：`overnightStructure.callbackOpeners` ∩ `earnedItems`。
- 已有且 **本单勿重做：** 幕间（赵周框架 / 闺蜜私信 / 送鉴定）、餐厅两 earned、sitIn 两 earned、流水圈注、全部 opener 已有 `firstConflict`、挂断双轨对齐。

### 案2（Tony / 推进表）脊柱

- 发错表 +「下一次推进」私加列；培训模板无该列。
- 「自己人」+ 插号免单六折灰区；**observe only（无 sitIn、Tony 不上麦）**。
- 确认型多线误判；`unknown`（真心、群、几张表）不点穿。
- 已有且 **本单勿重做：** 幕间互斥池、白天 observe/工作室/门口/document 分 earned、hangup 双轨文案应对齐核验、全部现网 opener 已有 `firstConflict`。

### 灰区

保留既有 `truthBoundary` / `selfServingOmission` / `unknown`；不点穿 8 号账户归属、Tony「真心」、群是否真拉成等。

---

## 复审残留（本单只打这些）

### 案1

- 设备/灯拍仍主要落在夜 B 口述告白：`credit-bank-flow`（`sceneVersions[5]`）—「灯和稳定器一直在我屋里」偏 **回忆告白**，不够「在台上当场找灯」。
- 可选：收紧夜 A `credit-device-benefit`，只种种子、不全盘招供（发现权守恒）。
- 若 `流水圈注` / `旁听记下的两句` / 设备受益路径夜 B 第一拳撞车，应用不同 `firstConflict.hostLine` 区分（订座灯 vs 流水 vs 设备在屋）。

### 案2

- 孤儿：幕间 `other-caller-dm` 授予 `other-caller-dm-seen`，但 `interludeEarnedItemMap` 只映射 `side-other-caller` → `女客拉群立场`、`side-caller-stop` → `咨询者止损立场`；**打开私信本身是死 earn**。`replyChoices`（在 `investigationHooks.tony-other-caller-dm`）才是真正进 opener 的路径。
- `listen-dryer` 授予 `吹风机回放`（与 opener 键同名）— **保持**；确认 `firstConflict` 仍在。
- 嫂子/年卡压力仍偏重 `tony-store-card-pressure` 夜 A 口述；需 **轻量** 当场化（加厚 observe 白天一拍，或把一句口述挪到门口/隔窗，且 **不重复店长培训揭秘**）。

---

## 3. 完整 Prompt 1

把下面整段复制到 Codex / Cursor（**仅改案1 · POLISH**）：

```text
你是本仓库《直播间大侦探》的实施工程师。本单是案1戏剧残余抛光（POLISH），
不是全案重写。只改：
  content/packs/steam-demo-01/cases/01-credit.json
戏剧重写已落地：幕间、白天分 earned、sitIn、全部 callbackOpeners.firstConflict、
挂断双轨。本单只修复审残留：设备/灯拍不够 LIVE；夜 A 设备场景可种子化。
不要动案2/案3/案4（除非 verify 回归证明共享脚本被误伤且 diff 极小）。

## 必读

1. docs/case12-drama-fix-prompt.md（本单规格；§2 脊柱、复审残留）
2. docs/case12-drama-rewrite-blueprint.md（已实施基线；勿砍脊柱）
3. docs/case34-drama-fix-prompt.md（并行案3/4；勿混改）
4. docs/multi-scene-rashomon-design.md
5. 目标：content/packs/steam-demo-01/cases/01-credit.json
   - sceneVersions[3] = credit-device-benefit（夜 A，segment1）
   - sceneVersions[5] = credit-bank-flow（夜 B，segment2）— 现网仍是「灯在屋里」口述告白
   - overnightStructure.callbackOpeners 已全部含 firstConflict（保留；按需微调分化）
   - nightStructure.segment1SceneIndexes / segment2SceneIndexes / hangup / interlude 已接线

## 硬约束

- 不要编辑 ~/.cursor/plans/ 或任何 *.plan.md。
- 禁止重做 / 拆掉：sitIn 节拍、餐厅两 earned（她的会员号 / 常客的轮订规律）、
  赵周幕间框架冲突、闺蜜私信、送鉴定、流水圈注、不指认 8 号、ON AIR 单连线、
  包级唯一 sitIn。
- 不砍脊柱：垫八万、断缴早于借钱、可见消费<3万缺口、订座会员号与设备受益灰区。
- 保留 truthBoundary / selfServingOmission / unknown；不点穿 8 号付款人。
- 优先改夜 B LIVE，不要为了设备再开一个白天地点、不要加第二次 sitIn。
- 台词避开 scripts/verify-logic.js 的 stockAiForbiddenCopyRegex
  （听到这里、真正、不是…而是、心里咯噔一下、你把这句记下、抓到的关键、
   核心风险、提款机、白莲花、处心积虑、脑子嗡、满格以后、这通电话 等）。
- 夜 B opener 唯一来源：overnightStructure.callbackOpeners + 玩家 earnedItems；
  幕间 grantsInventory 必须进 interludeEarnedItemMap（或同 id）；禁止新孤儿。
- 验收必须全绿：
  npm run content:index
  npm run check
  npm run verify:pack -- steam-demo-01

## 任务 A · 设备物理-言语锁改成 LIVE（推荐主路径）

目标：玩家感到「她在回拨台上找灯/稳定器」，而不是「她又讲了一遍昨晚开箱故事」。

推荐方案 A1（优先落地）：重写 credit-bank-flow（sceneVersions[5]）

1) version / questionOptions / casualQuestions / dialogueOptions（若有）改为当场动作：
   - 回拨 ON AIR 时，她共享屏幕 / 转镜头 / 起身在房间里翻找灯与稳定器；
   - 主持人可追问「谁按的发布」「快递在谁家拆」「灯现在还靠哪面墙」；
   - 仍是单来电人 ON AIR；禁止第二方上麦，禁止把开箱拍成完整罪案闪回。
2) 保留承重信息：设备在她屋里用过、探店号她发过、分期操作主语与受益主语可拆——
   但用「正在找 / 正在指给控台看」承载，而不是纯过去时告白。
3) contradiction / doubt / pressureHint 同步改成「当场指认受益」张力，
   不要写成「终于承认」事后总结腔。
4) 若 dialogueOptions 的 routeAxis 仍可用，保留；文案改成当场反应。

备选方案 A2（仅当 A1 不够且预算允许）：
   - 可加极短白天 beat，但禁止新地点挤掉现有 dayBudget 关键路径；
   - 禁止第二个 sitIn；禁止用白天重复讲完五万细节。
   - 默认仍选 A1，不要轻易开 A2。

## 任务 B · 夜 A credit-device-benefit 种子守恒（可选但推荐）

现状：夜 A 已把「投资你 / 一万二 / 探店号」说得很满，夜 B 再告白时发现权偏薄。

要求：
1) 缩短 credit-device-benefit 的 version 与高压答，只种「投资你」与分期操作的刺，
   不把「灯在我屋里 / 我架灯他调稳定器」在夜 A 讲完。
2) 完整「屋里找灯 + 受益主语」留给任务 A 的夜 B LIVE。
3) 不要把五万缺口对质提前讲完（hangup 仍挂在五万后）。
4) casualQuestions 可留 1–2 条浅问；高压选项避免夜 A 就把受益认满。

## 任务 C · firstConflict 分化核验（设备路径 vs 流水 vs 订座灯）

规则：每个 callbackOpeners 条目必须仍有 firstConflict.{hostLine,callerLine}。
若任务 A 改变了「设备在屋」的舞台位置，检查以下 opener 的 hostLine 是否撞车：

- 流水圈注 — 承重应仍是：流水证顺序，不证尾号归属
- 旁听记下的两句 / 他对五万的沉默 — 承重应仍是：灯/号 vs 五万拒答的护短选择
- 她的会员号 / 常客的轮订规律 — 承重应仍是：订座店证边界，不是设备分期
- 若存在或你新增任何「设备/开箱/受益」相关 opener（一般不新增）：
  hostLine 必须问「设备在屋 / 谁按发布 / 受益主语」，与订座灯、流水三路可辨

允许微调已有 firstConflict 文案以完成分化；禁止删除 firstConflict；
禁止所有 earned 共用同一句 host 质问。

示例分化方向（可改写，须合规）：
- 订座灯：「店里拒绝核对会员号。你开场为什么仍把订座说成他安排？」
- 流水：「流水能钉停缴与借款顺序；它不能替尾号认人。你守哪条边？」
- 设备在屋（若夜 B 台词已 LIVE）：「灯就在你镜头后面。你要先认受益，还是先认分期不是你签的？」

## 任务 D · 明确不做

- 不重写 hangup / continueLabel（现网已对齐：hostLine===hostHoldLine，
  stageDirection===hangupLine；continueLabel 应为进入白天调查类）。
- 不改 interludeEarnedItemMap 既有四键，除非你误伤校验需要最小修复。
- 不指认 8 号；不加第二来电人；不加白天第二 sitIn。
- 不编辑 plan 文件；不改案2/3/4 JSON。

## 验收自检（改完自跑）

1) credit-bank-flow 读起来是「台上找灯/共享屏幕」，不是「第二遍开箱故事」。
2) credit-device-benefit 未抢先讲完屋里受益细节（种子 < 夜 B 发现）。
3) 全部 callbackOpeners 仍有 firstConflict；抽三条不同 earned，hostLine 问题轴不同。
4) npm run content:index && npm run check && npm run verify:pack -- steam-demo-01 全绿。
5) git diff 应集中在 01-credit.json 的设备相关 scene + 必要的 firstConflict 微调。

输出：简述改了哪些字段；贴三条不同 opener 的 firstConflict.hostLine；贴验收命令结果。
```

---

## 4. 完整 Prompt 2

把下面整段复制到 Codex / Cursor（**仅改案2 · POLISH**）：

```text
你是本仓库《直播间大侦探》的实施工程师。本单是案2戏剧残余抛光（POLISH），
不是全案重写。只改：
  content/packs/steam-demo-01/cases/02-tony.json
戏剧重写已落地：幕间互斥、白天分 earned、全部 callbackOpeners.firstConflict、
hangup 双轨文案。本单只修复审残留：孤儿 other-caller-dm-seen；嫂子/年卡偏口述。
不要动案1/案3/案4（除非 verify 回归证明共享脚本被误伤且 diff 极小）。

## 必读

1. docs/case12-drama-fix-prompt.md（本单规格；§2 脊柱、复审残留）
2. docs/case12-drama-rewrite-blueprint.md（案2 脊柱：observe only / Tony 不上麦）
3. docs/case34-drama-fix-prompt.md（并行案3/4；勿混改）
4. docs/multi-scene-rashomon-design.md
5. 目标：content/packs/steam-demo-01/cases/02-tony.json
   - 幕间 other-caller-dm：grantsInventory=["other-caller-dm-seen"]（孤儿）
   - investigationHooks.tony-other-caller-dm.replyChoices：
       side-other → grantsInventory side-other-caller → map → 女客拉群立场
       side-caller → grantsInventory side-caller-stop → map → 咨询者止损立场
   - listen-dryer → grantsInventory ["吹风机回放"]（与 opener 键同名，应保留）
   - overnightStructure.interludeEarnedItemMap 现含：
       delegation-return / side-other-caller / side-caller-stop / training-no-column
       （无 other-caller-dm-seen）
   - 夜 A tony-store-card-pressure：嫂子称呼 + 店长年卡话术仍偏口述
   - 白天 day-tony-shop-observe / day-tony-manager-doorstep 已有隔窗与门口拒答

## 硬约束

- 不要编辑 ~/.cursor/plans/ 或任何 *.plan.md。
- 禁止 sitIn；禁止 Tony / 店长 / 女客 ON AIR 上麦（观察与门口可以，不上麦）。
- 不砍脊柱：发错表+推进列、培训模板无该列、自己人+插号免单六折灰区、
  确认型多线误判、unknown（真心/群/几张表）。
- 保留 truthBoundary / selfServingOmission / unknown；不点穿真心与群是否拉成。
- 台词避开 scripts/verify-logic.js 的 stockAiForbiddenCopyRegex
  （听到这里、真正、不是…而是、心里咯噔一下、你把这句记下、抓到的关键、
   核心风险、提款机、白莲花、处心积虑、脑子嗡、满格以后、这通电话 等）。
- 幕间 grantsInventory 若要改夜 B，必须进 interludeEarnedItemMap（或同 id opener）；
  否则删授予。禁止半吊子「拿到却改不了夜 B」。
- 验收必须全绿：
  npm run content:index
  npm run check
  npm run verify:pack -- steam-demo-01

## 任务 A · 修孤儿 other-caller-dm-seen（强制 · 推荐方案）

现状：打开幕间「回女客私信」就授予 other-caller-dm-seen，但无 opener、无 map。
真正改夜 B 的是 hook 上 replyChoices 的 side-other-caller / side-caller-stop。

推荐方案 A1（优先）：删除死授予
1) 从 nightStructure.interlude.actions 的 other-caller-dm 上
   删除 grantsInventory（或改为 [] / 去掉该字段）。
2) 打开私信本身不再 earn；玩家必须在 hook 里做 replyChoices，
   才获得 side-other-caller 或 side-caller-stop，再经 map 进入：
   女客拉群立场 / 咨询者止损立场。
3) 确认 replyChoices 两岔仍授予 side-*，map 仍指向上述两个 opener，
   且两 opener 的 firstConflict 仍在且 hostLine 可辨（拉群公开 vs 止损压表）。
4) 全文搜索 other-caller-dm-seen：若无其它消费者，删除残留引用；
   不要留下「授予了但没人读」的 inventory id。

备选方案 A2（不推荐，除非产品坚持「打开即earn」）：
1) 新增 opener「女客私信已读」+ firstConflict
   （承重：只读到同款表、尚未选立场时，夜 B 第一问钉「你读了却不选边」）。
2) interludeEarnedItemMap 增加 other-caller-dm-seen → 女客私信已读。
3) 仍保留 replyChoices → side-* → 既有立场 opener（打开与选边是两条锋利度）。
默认落地 A1；只有明确需要「已读」独立夜 B 锋时才用 A2。

## 任务 B · 核验 listen-dryer ↔ 吹风机回放

1) listen-dryer.grantsInventory 必须仍是 ["吹风机回放"]（与 callbackOpeners 键同名）。
2) opener「吹风机回放」必须仍有 firstConflict；可微调但不可删除。
3) 不要把吹风机改成「存在但她不想听」永久推迟发现权。
4) 若 map 需要同名键，同 id 即可，不必强行改英文 id。

## 任务 C · 嫂子 / 年卡压力轻量当场化（一拍即可）

目标：少一口头回忆，多一拍白天可看见的压力；不要重复「店长培训页揭秘」。

任选其一（只做一处，禁止三处同时加戏）：

方案 C1（推荐）：加厚 day-tony-shop-observe
  - 在现有隔窗 beats / 某条 choice 的 resultBeats 里，加一句可闻可见的
    「嫂子」起哄或年卡话术擦边（门开漏一句即可）；
  - 不要让 observe 变成进店对质；仍 kind=observe。
  - 两条 choice（店外称呼观察 / 店外服务序列）的 earned 与 firstConflict 轴保持可辨：
    称呼关系 vs 插位+登记序列；新增的嫂子/年卡句应服务其中一条，勿两条同态。

方案 C2：挪一句到 day-tony-manager-doorstep
  - 店长门口可拒答「完整私表」，并带一句「自己人/年卡是店里话术」的边界；
  - 禁止把门口水位写成培训页精读（培训页已有 day-tony-member-docs / 幕间 reopen-training）。
  - 不要因此把 earnedItemId「店长门口拒答」改成第二个培训 opener。

同时：可略缩 tony-store-card-pressure 夜 A 里与白天将重复的那 1–2 句口述，
避免夜 A 讲完 + 白天再讲同一告白；保留咨询者「没否认嫂子」的自我污点一句即可。

## 任务 D · 挂断双轨再对齐（核验级）

确认并在必要时最小修复：
- nightStructure.hangup.stageDirection === overnightStructure.hangupLine
- nightStructure.hangup.hostLine === overnightStructure.hostHoldLine
- continueLabel 语义是「进入白天调查」，不得写成「回拨」
- 不借机重写整段 hangup 情绪，除非双轨不一致。

## 任务 E · 明确不做

- 不加 sitIn；Tony 永不进热线麦序。
- 不重做朋友工作室双 earned、培训页圈注、幕间送鉴定。
- 不删除女客拉群/止损两个 opener；不合并成一条。
- 不编辑 plan 文件；不改案1/3/4 JSON。

## 验收自检（改完自跑）

1) 全文无 other-caller-dm-seen 死授予；或（若选 A2）有 opener+map+firstConflict 闭环。
2) 打开私信后，唯有 replyChoices 能把 side-* 送进夜 B 立场 opener。
3) 吹风机回放：grant id == opener 键，且 firstConflict 存在。
4) 白天 observe 或门口多了一拍嫂子/年卡压力；夜 A 未与白天双份复读同一长段。
5) 挂断双轨字段相等；npm 三命令绿。
6) git diff 应集中在 02-tony.json 的幕间授予、少量 day beats、必要 hangup 对齐。

输出：说明选了 A1 还是 A2；贴 other-caller-dm 最终 JSON 片段；贴吹风机 opener 的 firstConflict；
贴验收命令结果。
```

---

## 5. 验收

### 推荐顺序（与 §1 一致）

1. （若尚未做）**Prompt 3 → Prompt 4**（见 [`case34-drama-fix-prompt.md`](case34-drama-fix-prompt.md)）  
2. **Prompt 2** → `02-tony.json` → npm 三命令绿  
3. **Prompt 1** → `01-credit.json` → npm 三命令绿  

### Smoke（人工）

- **案1：** 夜 B 进入 `credit-bank-flow` 时，能感到她在找灯/共享屏幕；夜 A 设备段未抢先认满屋里受益。  
- **案1：** 抽 `流水圈注` vs `旁听记下的两句` vs `她的会员号` → `firstConflict.hostLine` 三轴可辨。  
- **案2：** 幕间只「打开」女客私信、不选 reply → **不应**凭空获得夜 B 立场 opener；选拉群 vs 止损 → hostLine 不同。  
- **案2：** 听吹风机 → 夜 B `吹风机回放` + firstConflict。  
- **案2：** 白天隔窗或门口能碰到嫂子/年卡压力一拍；Tony 仍不上麦。  
- **双案：** 挂断 `stageDirection===hangupLine`、`hostLine===hostHoldLine`；`continueLabel` 非「回拨」。

### 明确不做

- 不重写案1 sitIn / 餐厅架构；不重写案2 observe 架构。  
- 不做第二次全案戏剧重写；不编辑任何 plan 文件。  
- 不点穿 unknown（8 号付款人、Tony 真心、群是否拉成）。

### 验收命令（每案落地后）

```bash
npm run content:index
npm run check
npm run verify:pack -- steam-demo-01
```
