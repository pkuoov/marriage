# 第 17 批·线下罗生门与多元场景执行单（17-engine + 17a 案 1 竖切）

你是本仓库的实施工程师。本单落实 `docs/multi-scene-rashomon-design.md`：白天城市要从「拿一句 earnedItem 回麦」升级为有戏、有第二视角、有当场碰撞的舞台；包级落地案 1 特许同席（sitIn）。台词与结构以设计文档为准；本单只先做引擎与案 1，案 2–4 待 17a 真人手感后再铺。

## 上下文

- 作品：《直播间大侦探》Steam demo（内容包 `steam-demo-01`）。
- 设计源：`docs/multi-scene-rashomon-design.md`。
- 上游节奏：夜 A → 短幕间（可选）→ 白天城市 → 夜 B（回拨）；见 `docs/two-call-night-design.md` / 隔夜白天（15v2）。
- 立法要点：
  - **场景配额**：每案 ≥2 个非控台地点；包级 ≥1 次特许同席。
  - **带回律**：每个日间地点必须产出能改回拨第一句的东西；纯氛围砍掉。
  - **罗生门律**：同席是为了让两份剪辑当场咬住，不是为了问出标准答案。
  - **单连线人**：仅约束 ON AIR；线下旁听/同席 ≠ 上麦。
- 本包当面特许落点：**案 1 咖啡厅旁听（sitIn）**。

## 目标

1. **17-engine**：引擎与校验承认 `observe` / `sitIn` / `doorstep`，日间场景可渲染 `cast` / `beats` / `choice`。
2. **17a**：案 1 加厚餐厅 + 新增咖啡厅 sitIn；白天地点预算 2 / 可选 ≥3（设计为 4 选 2）。
3. **17b–d**（本单只写大纲，内容等 17a playtest 后另开）：案 2–4 日间地图按设计文档铺开。

## 硬约束

- ON AIR 仍只有来电人上麦；对方永不实时连线。
- 本批不做 V2 立绘 / 新肖像资源。
- 不指认「8 号付款人」；收窄阶梯与既有 truthBoundary 不可破。
- **不要编辑**任何计划文件 / plan 文件（含用户挂起的 plan）。
- 主播在 sitIn 中不代玩家质问对方——旁听笔记只喂夜 B 回拨开场。
- 案 2–4 在 17a 过真人手感前，本单不落内容 JSON（可留大纲于本文件，不改案文件）。

## 任务 1：引擎（17-engine）

1. **`scripts/verify-pack.js`**
   - `dayScenes[].kind` 允许集加入：`observe`、`sitIn`、`doorstep`（保留既有 `studio` / `visit` / `home` / `lab` / `document` 等）。
   - 若场景带 `earnedItemId`，仍须被 `callbackOpeners` 覆盖（与现网一致）。
   - sitIn / observe / doorstep 若含 `beats` / `choice`，做轻度形状校验（数组非空、choice.options 有 id/label）。

2. **`src/app.js`（及日间渲染相关路径）**
   - `renderDayScene`（或等价入口）支持：
     - `cast[]`：在场名牌展示
     - `beats[]`：`{ speaker, text }` 短对话序列推进
     - `choice`：`{ prompt, options: [{ id, label, grantsEarnedItemId? }] }` — 选完才能记下离开
   - 产出仍走 `earnedItemId` → 回拨开场选择。
   - sitIn：默认强调「主播不露脸 / 不插话」的 UI 提示（文案级即可，不加新系统）。

3. **安静白天章节标签**
   - `quietDayChapter`（或现有白天眉题）对 observe / sitIn / doorstep 给出可读标签（如「观察」「旁听」「门口」），与 visit/lab 区分。

4. **CSS**
   - 若需要：补 `day-cafe`（或设计文档指定的 backdrop class）占位样式；可复用日光滤镜类，不强制新美术。

## 任务 2：案 1 竖切（17a）

文件：`content/packs/steam-demo-01/cases/01-credit.json`

### 2a 加厚 `day-restaurant`

- 不要停在一句旁白 souvenir。
- 写入 `cast` + `beats`（服务员 / 常客暗示等，对齐设计文档「餐厅靠窗位」）。
- 保留带回律：`earnedItemId` 须解锁一条控台 alone 拿不到的 `callbackOpeners` 线。

### 2b 新增 `day-cafe-sitin`

- `kind`: `sitIn`
- `earnedItemId`: 旁听笔记（id 与现网命名风格一致，如 `sitin-notes`；若包内已有惯例则跟随包内）
- 逐字节拍以设计文档「案 1 特许同席 · 逐字节拍」为准：来电人约对方只对账；主播戴耳机旁听；对方半句（灯是真心 / 五万不讲清 / 订座是她的号）；来电人僵住；主播用旁听笔记回拨。
- 对应 `callbackOpeners` 条目：回拨第一句必须能听出「我听见两个人对同一物件说了两套话」。

### 2c 白天预算

- 地点总数按设计：**档案室 / 餐厅 / 审流水 / 咖啡厅旁听**（4 选 2）。
- `dayBudget: 2`；`dayBudget < dayScenes.length`。
- 与短幕间并存时：合并叙事预算，勿「幕间满台 + 白天满图」叠满。

### 2d 合规自查

- sitIn 不算上麦；正片 ON AIR 仍单来电人。
- 不指认 8 号付款人；对方半句不得写成「付款人就是某某」。
- 新事实入 `truthBoundary` / 伏笔账本（旁听半句、订座号口径冲突等）按设计文档边界登记。

## 任务 3：案 2–4 大纲（17b–d，内容后置）

**仅在 17a playtest 通过后**再改对应 case JSON。本阶段只按设计文档锁地图：

| 批次 | 案件 | 日间舞台（摘要） |
| --- | --- | --- |
| 17b | 案 2 · 自己人 | ①店外观察（`observe`）②开过店朋友工作室（对照表）③会员系统文档；无当面对方；回拨「我看见你对别人也那样叫」 |
| 17c | 案 3 · 条件 | ①介绍人茶馆 ②表姐门口拒答（`doorstep`）③学信网+存款证明对读；间接罗生门三份剪辑 |
| 17d | 案 4 | 按 `docs/multi-scene-rashomon-design.md` 四案地图剩余条目落地（保持 ≥2 非控台地点、带回律） |

包级特许同席配额已由案 1 sitIn 消耗；案 2–4 用观察 / 门口 / 双份材料，不追加第二次当面。

## 验收命令

```bash
npm run content:index
npm run check
npm run verify:pack -- steam-demo-01
```

引擎先行全绿后再提交案 1 内容；有浏览器烟测则补一条：夜 A → 白天选咖啡厅 sitIn → 夜 B 用旁听笔记开场。

## 成功标准（摘自设计文档）

- 每案玩家至少离开控台两次（体感）。
- 至少一案有「我听见两个人对同一物件说了两套话」的当场戏（案 1 sitIn）。
- 回拨第一句能明显来自日间地点。
- 直播单连线人契约 playtest 仍成立。

## 不要做的事

- 不做 V2 肖像 / 大美术包。
- 不在 sitIn 里让主播替玩家审对方。
- 不指认 8 号付款人；不打穿既有收窄阶梯。
- 不编辑 plan 文件。
- 17a 未过手感前，不改案 2–4 内容 JSON。
- 不把线下同席写成 ON AIR 双麦。

## 建议提交信息（实施完成后）

- `feat: dayScene kinds — observe, sitIn, doorstep`
- `feat: case1 cafe sit-in — offline rashomon privilege`


## 后续执行

案 2–4 白天地图与「评审→剧本/skill」完整可复制 prompt 见 [offline-rashomon-exec-prompts.md](offline-rashomon-exec-prompts.md)。
