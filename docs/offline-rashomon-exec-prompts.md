# 线下罗生门：完整执行 Prompt 包

Date: 2026-07-14  
性质：给 Codex / Cursor 直接粘贴的执行 prompt（非设计摘要）。  
上游设计：

- [multi-scene-rashomon-design.md](multi-scene-rashomon-design.md)（场景配额 / 带回律 / 罗生门律 / 四案日间地图）
- [offline-rashomon-pass-17-prompt.md](offline-rashomon-pass-17-prompt.md)（17-engine + 17a 案 1 基线；本文件承接 17b–d）
- [two-call-night-design.md](two-call-night-design.md)（夜 A → 短幕间 → 白天 → 夜 B）

---

## 1. 用法

| Prompt | 角色 | 何时用 |
| --- | --- | --- |
| **Prompt A** | 实施工程师 | 案 2–4 白天地图落地（17b / 17c / 17d），改 case JSON；引擎仅必要时补丁 |
| **Prompt B** | 侦探剧情评审 + skill 立法 | 先评四案耦合与立法缺口；默认只出报告，用户说「直接改」才动文件 |

建议顺序：**可先跑 Prompt B**（评审→处方）→ 再跑 **Prompt A**（按处方改案 2–4）→ 验收命令 → 若处方要求 skill，再开 skill 补丁回合。  
也可只跑 A（若设计文档地图已足够清晰）。  

**禁止**编辑 `~/.cursor/plans/` 下任何 `*.plan.md` 或其它 plan 文件。

---

## 2. 基线：已完成 / 勿重做

### 已完成（勿重复大改）

- 引擎承认 `observe` / `sitIn` / `doorstep`；日间可渲染 `cast` / `beats` / `choice`（17-engine）。
- 案 1（`01-credit.json`）咖啡厅旁听 `sitIn` 竖切；白天 `dayBudget: 2`、可选 ≥3（现网 4 选 2）。
- 设计文档与 skill 条款已写入：场景配额、带回律、罗生门律、ON AIR 单来电人。

### 未完成（本 prompt 包目标）

- 案 2–4 的 `dayScenes` 白天地图（按设计文档：观察 / 门口 / 双份材料等；**不再**加第二次 `sitIn`）。
- 幕间（`nightStructure.interlude`）与白天预算合并：缩行走式幕间动作，把「离台戏」迁进 `dayScenes`。
- 其它手感修补仅在验收失败或 Prompt B 处方点名时做。

---

## 3. 完整 Prompt A

把下面整段复制到 Codex / Cursor（工程师会话）：

```text
你是本仓库《直播间大侦探》的实施工程师。本单落实 docs/multi-scene-rashomon-design.md 的案 2–4 白天地图（批次 17b / 17c / 17d）。17-engine 与案 1 sitIn（17a）已完成，不要重做案 1 大改，不要重写引擎契约除非现网跑不通。

## 必读

1. docs/multi-scene-rashomon-design.md（四案线下地图、引擎 kinds、带回律、成功标准）
2. docs/offline-rashomon-pass-17-prompt.md（已完成基线；本单只做 17b–d）
3. docs/two-call-night-design.md（夜 A → 短幕间 → 白天 → 夜 B）
4. 样板：content/packs/steam-demo-01/cases/01-credit.json 的 overnightStructure.dayScenes（body.earnedItemId / cast / beats / choice → callbackOpeners）
5. 目标案：
   - content/packs/steam-demo-01/cases/02-tony.json
   - content/packs/steam-demo-01/cases/03-profile.json
   - content/packs/steam-demo-01/cases/04-workplace.json
   现网使用 nightStructure（hangup / interlude / callbackOpeners）。优先复用案 1 的 overnight / dayMap 渲染路径；为案 2–4 增加最小 overnightStructure（或等价 dayScenes 挂载），并与既有 nightStructure.hangup 对齐，不要拆掉现有挂断戏。

## 硬约束

- 不要编辑 ~/.cursor/plans/ 下任何文件，也不要编辑其它 *.plan.md。
- ON AIR 仍只有来电人上麦；对方永不实时连线。线下 observe / doorstep / visit ≠ 上麦。
- 包级特许同席配额已被案 1 sitIn 消耗；案 2–4 禁止第二次 sitIn / 当面审对方。
- 不指认「8 号付款人」；不打穿案 1 既有 truthBoundary / 收窄阶梯。
- 不做 V2 立绘 / 新肖像 / 大美术包；backdropClass 可复用日光滤镜占位。
- 台词避开 scripts/verify-logic.js 的 stockAiForbiddenCopyRegex 命中短语，包括但不限于：听到这里、真正、不是…而是、心里咯噔一下、你把这句记下、抓到的关键、核心风险、提款机、白莲花、处心积虑、脑子嗡、满格以后、这通电话 等。旁听 choice.prompt 用「旁听至此」一类，不要用「听到这里」。
- 每个能带回的日间产出必须能改回拨第一句：body.earnedItemId（或 choice.grantsEarnedItemId）须有对应 callbackOpeners 条目；纯氛围地点砍掉。

## 架构目标

节奏：夜 A（挂断）→ 短幕间（预算收紧到 1–2 个非行走动作：送鉴定 / 回放 / 顾问短呼等）→ dayScenes（预算 2，可选地点 ≥3）→ 夜 B（回拨，开场来自日间带回物）。

- Prefer 复用现网 overnight dayMap 路径（参考案 1）。
- 为案 2–4 增加最小 overnightStructure（hangupAnchor / hangupLine 或从 nightStructure.hangup 映射；dayBudget: 2；dayScenes ≥3；callbackOpeners 覆盖每个 earnedItemId），与既有 hangup 台词一致，不要另写第二套挂断。
- 把幕间里「出门走路」类 actions 收缩进 dayScenes；幕间保留控台短动作，避免「幕间满台 + 白天满图」叠预算。
- 每个 earnedItemId 必须有独立 callback opener（控台 alone 拿不到的第一句）。
## 17b · 案 2 · 02-tony.json（自己人）

按设计文档日间舞台落地（无 sitIn）：

1. 店外观察（kind: observe）——对方只在店内被看见/听见半句；玩家不进店审人。
2. 开过店朋友工作室（visit / studio）——对照「标准表 vs 私表 / 推进列」。
3. 会员系统 / 培训文档（document）——模板有没有「下一次推进」列。

dayBudget: 2；dayScenes.length ≥ 3。  
回拨气质示例（须自写合规台词，勿照抄禁词）：能听出「我在店外看见你对别人也那样叫 / 推进列不在培训页」之类，而不是控台复读。  
把 nightStructure.interlude 里偏行走的门店对照迁进 dayScenes；幕间预算降到 1–2 个非行走位。

## 17c · 案 3 · 03-profile.json（条件）

1. 介绍人茶馆 / 婚介（visit）——两套报价剪辑。
2. 表姐门口（kind: doorstep）——拒答收入/学费，只认「家里一起整理资料」。
3. 学信网 + 存款证明对读（document）——间接罗生门：介绍人 vs 表妹群 vs「我妈想看」。

预算：2 / 可选 ≥3。禁止 sitIn。合并现有「只能去一处」幕间登门与白天地图，避免双系统抢同一戏。

## 17d · 案 4 · 04-workplace.json（主责）

1. 财务窗要回单号（visit / studio）。
2. 供应商语音 / 补话（visit 或带 beats 的短现场）。
3. 茶水间观察助理（observe）——同事托话 vs 领导批注 vs 审批页，间接罗生门。

顾问（赵/周/小林）框架冲突留在短幕间，不要再铺成第三个「满地图」。禁止 sitIn。

## 引擎补丁

仅当 verify / 运行时证明 dayScenes 挂载或 kinds 渲染在案 2–4 路径上失败时，才改 src/ 与 scripts/verify-pack.js。不要为了「整齐」重构两连线状态机。

## 验收命令（必须全绿）

npm run content:index
npm run check
npm run verify:pack -- steam-demo-01

建议：动手案 2–4 前，先手工或 smoke 跑通案 1：夜 A → 白天选咖啡厅 sitIn → 夜 B 旁听笔记开场，确认 dayMap 路径健康。

## 不要做的事

- 不编辑 plan 文件。
- 不给案 2–4 加第二次 sitIn / 双麦 ON AIR。
- 不指认 8 号付款人；不写穿既有灰区收窄。
- 不做 V2 美术。
- 不把幕间预算与白天预算叠满。
- 不重写案 1，除非为修回归且 diff 极小。
- 不引入 stockAiForbiddenCopyRegex 命中句式。

## 建议提交信息（做完后）

- feat: case2 day map — observe shop, studio contrast, member docs
- feat: case3 day map — tea house, cousin doorstep, credential read
- feat: case4 day map — finance window, supplier, break-room observe
- chore: shrink interludes — merge walking budget into dayScenes（若同批）
```

---

## 4. 完整 Prompt B

把下面整段复制到 Codex / Cursor（评审 / 立法会话）：

```text
你是《直播间大侦探》的侦探剧情评审员 + skill 立法委员。默认只出报告与处方，不要改仓库文件，除非用户明确说「直接改」或「按处方改 skill / 剧本」。

## 硬约束

- 不要编辑 ~/.cursor/plans/ 下任何文件，也不要编辑其它 *.plan.md。
- ON AIR 单来电人契约不可破；线下同席/旁听/观察 ≠ 上麦。
- 不指认 8 号付款人；不写穿既有 truthBoundary。
- 不做 V2 美术方案。
- 处方里的示例台词必须避开 stockAiForbiddenCopyRegex（听到这里、真正、不是…而是、心里咯噔一下等）。
- Skill 正文禁止剧透具体案情物件名到「玩前可知答案」的程度；立法写律，不写谜底。

## 必读

设计与流程：
- docs/multi-scene-rashomon-design.md
- docs/offline-rashomon-pass-17-prompt.md
- docs/two-call-night-design.md
- docs/gameplay-story-rereview-2026-07-12.md
- docs/npc-drama-expansion-pass-16-prompt.md

Skill：
- project-skills/detective-plot-coupling-review/SKILL.md
- project-skills/case-scriptwriting/SKILL.md
- project-skills/story-dialogue-staging/SKILL.md（若涉及白天/回拨接力）

四案 JSON：
- content/packs/steam-demo-01/cases/01-credit.json
- content/packs/steam-demo-01/cases/02-tony.json
- content/packs/steam-demo-01/cases/03-profile.json
- content/packs/steam-demo-01/cases/04-workplace.json

## 评分（每案 1–5，必须给证据：文件路径 + 字段/节选）

对四案分别打分并简述证据：

1. 舞台多样性（是否真的离开控台，地点是否可辨）
2. 现场 vs 回忆（当场碰撞 vs 纯口述复盘）
3. 带回律（earnedItem / inventory → 回拨第一句是否可变）
4. 罗生门（两份以上剪辑是否在同空间或同对照台上咬住）
5. 选择戏剧性（取舍是否改变信息态，而非换皮按钮）
6. NPC 动词（拒绝 / 打断 / 冲突是否仍是行动者）
7. 单来电人契约（ON AIR 是否干净；线下是否误写成双麦）
8. 灰区与边界（是否提前点破不该点破的身份/付款人/罪名）
## 检查清单（逐项勾选 ✓/✗ + 一句证据）

- [ ] 每案玩家体感至少离开控台两次
- [ ] 包级 ≥1 次特许同席（案 1 sitIn）且案 2–4 无第二次当面
- [ ] 每案 day 可选地点 ≥3 且 dayBudget < 地点数（或明确等价取舍）
- [ ] 每个日间产出都能改回拨 opener
- [ ] 幕间与白天预算未叠满
- [ ] 禁词 / 机械句式未回流
- [ ] 直播单连线人 playtest 契约仍成立
- [ ] NPC 三动词包级配额仍可指认

## 处方模板（每个主要问题一条）

病：…  
证：…（证据）  
药-剧本：…（改哪份 case JSON、改什么结构）  
药-skill：…（是否立法；见升级规则）  
不做：…

## Skill 升级规则

- ≥2 案复发同一缺口，或违反已立法的硬律 → 升级 skill（写律不写谜底）。
- 仅单案问题 → 只改正文内容，不动 skill。
- Skill diff 草案须可粘贴；标明目标 SKILL.md 路径。

## 交付物（按此顺序输出）

1. 一段话总判（整包白天/罗生门是否达标）
2. 四案评分表（上列 8 维）
3. 检查清单勾选结果
4. Top 5 问题（按伤害排序）
5. Skill diff 草案（若需要；否则写「本轮不改 skill」）
6. 下一步：指向 docs/offline-rashomon-exec-prompts.md 的 Prompt A（17b–d 实施），列出建议优先案序

记住：未获「直接改」授权前，只报告不改码。
```

---

## 5. 建议执行顺序

1. （可选）跑 **Prompt B** → 拿到评分、清单、Top 5、skill/剧本处方。  
2. 案 1 sitIn 烟测通过后，跑 **Prompt A**（17b→17c→17d，或按 B 的优先序）。  
3. 跑验收：`npm run content:index` → `npm run check` → `npm run verify:pack -- steam-demo-01`。  
4. 若 B 判定需立法：另开一轮只改 skill（仍可用 Prompt B +「直接改 skill」）。  
5. 需要时再补浏览器 smoke：各案夜 A → 白天两处 → 夜 B opener 可区分。  
6. 复审改稿：按 [offline-rashomon-pass-19-fix-prompt.md](offline-rashomon-pass-19-fix-prompt.md) 跑 **Prompt C**（内容/接线）→ **Prompt D**（skill 立法）。

---

## 6. 相关链接

- [multi-scene-rashomon-design.md](multi-scene-rashomon-design.md)
- [offline-rashomon-pass-17-prompt.md](offline-rashomon-pass-17-prompt.md)
- [offline-rashomon-pass-19-fix-prompt.md](offline-rashomon-pass-19-fix-prompt.md)
- [two-call-night-design.md](two-call-night-design.md)
- [gameplay-story-rereview-2026-07-12.md](gameplay-story-rereview-2026-07-12.md)
- [npc-drama-expansion-pass-16-prompt.md](npc-drama-expansion-pass-16-prompt.md)
- [demo2-pass-16-prompt.md](demo2-pass-16-prompt.md)
