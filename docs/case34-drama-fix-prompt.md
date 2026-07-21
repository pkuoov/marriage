# 案3 / 案4 · 戏剧接线完整修改 Prompt

**Date:** 2026-07-15

**依据：** 剧情复审 2026-07-15 — 案3/案4 全部 `callbackOpeners` 缺 `firstConflict`；幕间孤儿 inventory；白天 choice 信息态偏薄；`continueLabel` 误导成「回拨」；挂断偏软。

**关联文档（只读，勿改 plan）：**

- [`docs/case12-drama-rewrite-blueprint.md`](case12-drama-rewrite-blueprint.md) — `firstConflict` / 带回律样板（以案1现网为准）
- [`docs/multi-scene-rashomon-design.md`](multi-scene-rashomon-design.md) — 多元场景与夜 B opener 源
- [`docs/offline-rashomon-pass-19-fix-prompt.md`](offline-rashomon-pass-19-fix-prompt.md) — opener 唯一源、幕间 map、挂断双轨对齐
- `project-skills/detective-plot-coupling-review/` — 侦探非线性 / 带回律评审口径

**目标文件：**

- `content/packs/steam-demo-01/cases/03-profile.json`
- `content/packs/steam-demo-01/cases/04-workplace.json`
- （可选）`project-skills/case-scriptwriting/SKILL.md`、`project-skills/detective-plot-coupling-review/`

**不要做：** 不编辑 `~/.cursor/plans/` 或任何 `*.plan.md`；不重写案1 sitIn / 案2 observe 架构。

---

## 1. 用法

| Prompt | 范围 | 说明 |
|--------|------|------|
| **Prompt 3** | 仅 `03-profile.json` | 先做 |
| **Prompt 4** | 仅 `04-workplace.json` | Prompt 3 验收后再做 |
| **Prompt S**（可选） | skill 条款 | 可与 3/4 并行或事后立法 |

**样板：** 从 `01-credit.json` 的 `overnightStructure.callbackOpeners` 抄字段形状（见 §3），不要抄案情台词。

**执行顺序：** Prompt 3 → 验收绿 → Prompt 4 → 验收绿 →（可选）Prompt S。

---

## 2. 基线勿砍

### 案3（条件 / 学历·流水）脊柱

- **材料边界：** 核验页只管项目、存款证明管当天余额；两张图不能直接接成「学历好、收入稳」。
- **家里群主语翻转：** 最先问流水的人是咨询者自己，不是「我妈想看」单独主语。
- **介绍人两套价格：** 给女方家抬男方、给男方家压女方要求；添话可圈可分。
- **表姐门口拒答钱：** 不进门；不认收入/学费；只认「资料家里一起挑」。
- **禁止 sitIn**；**ON AIR 仅咨询者单来电人**（介绍人/表姐不上麦）。

### 案4（主责 / 审批≠付款）脊柱

- **审批 ≠ 付款：** 窗口只认回单号 / 账户后四位；同一张审批图发三次仍不是到账。
- **开场早认主责：** 想要位置是她的；拿位置压她刷卡是他的——勿改回「晚认」。
- **三顾问框架：** 赵边界 / 周钱路 / 小林主责拆句，幕间冲突保留。
- **领导打断（未邀）** 保留；hot/cold 带回语义要接线。
- **禁止 sitIn**；供应商/财务/助理均不上麦。

### 灰区

保留既有 `truthBoundary` / `selfServingOmission` / `unknown`；不点穿账户归属、学费出资人、老板知情等 unknown。

---

## 3. firstConflict 字段形状（强制）

**现网案1形状**（`overnightStructure.callbackOpeners.<earnedId>`；2026-07-15 实测）：

```json
"流水圈注": {
  "line": "「你把流水圈过了？……每月 8 号那笔一停，他才来找我借八万。钱从哪儿来，我今晚还是不知道；先把这条顺序留住。」",
  "firstConflict": {
    "hostLine": "流水能证明钱停、贷款进、随后转出；它不能证明尾号 3301 是谁。你能守住这条边吗？",
    "callerLine": "能。我只问他为什么不说，不替那串尾号认人。"
  }
}
```

**运行时消费**（`src/app.js`）：夜 B 开场在 `opener.line` 之后，若存在则追加：

- `firstConflict.hostLine` → host
- `firstConflict.callerLine` → caller

**案1 现网 `firstConflict` 内只有 `hostLine` + `callerLine`。**  
日间 choice 上的 `routeAxis` / `routeTone` 是另一条轨（记路线），**不要**误以为必须写进 `firstConflict`；若某案日后要在 firstConflict 挂路线，可选用：

```json
"firstConflict": {
  "hostLine": "…",
  "callerLine": "…",
  "routeAxis": "money-flow",
  "routeTone": "callback-first-punch"
}
```

**硬规则：**

1. **凡能在夜 B 出现的 opener（`callbackOpeners` 每一条）必须有 `firstConflict`。**
2. **夜 B 第一句对峙必须随 `earnedItem` 变**——不能只改 `line`、所有 earned 共用同一句 host 质问。
3. 每个 opener 的 `hostLine` 必须问**不同的承重问题**（见 Prompt 3/4 任务 A 轴）。
4. 台词避开 `scripts/verify-logic.js` 的 `stockAiForbiddenCopyRegex`。

**案1 可读样例键（抄形状不抄谜底）：** `周会计的时间线`、`流水圈注`、`顾问回单`、`餐厅拒绝核对`。

---

## 4. 完整 Prompt 3

把下面整段复制到 Codex / Cursor（**仅改案3**）：

```text
你是本仓库《直播间大侦探》的实施工程师。本单只改
content/packs/steam-demo-01/cases/03-profile.json
的戏剧接线：给全部 overnightStructure.callbackOpeners 补 firstConflict；
处理幕间孤儿 inventory；加厚白天 choice 信息态；改写挂断与 continueLabel。
不要动案1/案2/案4（除非 verify 回归证明共享脚本被误伤且 diff 极小）。

## 必读

1. docs/case34-drama-fix-prompt.md（本单规格；§2 脊柱、§3 字段形状）
2. docs/case12-drama-rewrite-blueprint.md（firstConflict / 带回律）
3. docs/multi-scene-rashomon-design.md
4. docs/offline-rashomon-pass-19-fix-prompt.md（opener 唯一源、幕间 map、挂断双轨）
5. 样板：content/packs/steam-demo-01/cases/01-credit.json
   → overnightStructure.callbackOpeners.* .line + .firstConflict{hostLine,callerLine}
6. 目标：content/packs/steam-demo-01/cases/03-profile.json
   现网 opener 五键（皆无 firstConflict）：
   介绍人双边记录 / 介绍人添话标记 / 表姐门口口供 / 双份材料圈注 / 家里群原话
   interludeEarnedItemMap 现仅：family-chat-seen → 家里群原话
   幕间孤儿：profile-dinner-pause-playback（profile-listen-dinner-pause 授予）
   nightStructure.interlude.continueLabel 现为「带着这一页回拨」（误导）

## 硬约束

- 不要编辑 ~/.cursor/plans/ 或任何 *.plan.md。
- 禁止 sitIn；禁止 ON AIR 第二方（介绍人/表姐/家人不上麦）。
- 不砍 §2 案3脊柱：材料边界、群主语翻转、介绍人两价、表姐拒答钱。
- 保留 truthBoundary / selfServingOmission / unknown；不点穿学费出资人、持续收入真伪等 unknown。
- 台词避开 scripts/verify-logic.js 的 stockAiForbiddenCopyRegex
  （听到这里、真正、不是…而是、心里咯噔一下、你把这句记下、抓到的关键、
   核心风险、提款机、白莲花、处心积虑、脑子嗡、满格以后、这通电话 等）。
- 夜 B opener 唯一来源：overnightStructure.callbackOpeners + 玩家 earnedItems；
  幕间 grantsInventory 若要改夜 B，必须进 interludeEarnedItemMap（或同 id），
  否则删授予 / 改发现权到白天。
- 验收必须全绿：
  npm run content:index
  npm run check
  npm run verify:pack -- steam-demo-01

## 任务 A · 全部 callbackOpeners 补 firstConflict（强制）

对以下每一条保留/微调现有 line，并新增 firstConflict。
五条 hostLine 必须问五个不同承重问题（不可换皮同义）：

1) 介绍人双边记录
   轴：双边报价原话是否同时成立、谁在捡顺耳半句
   示例（可改写，须合规）：
   hostLine: 「两边记录都摊开了。你现在要先钉哪一边被抬高、哪一边被压低？」
   callerLine: 「先钉收入稳和不计较学历——两句都是她添的。我妈把名校说顺，那是我没拦。」

2) 介绍人添话标记
   轴：只圈添话时，材料原句与介绍人添句如何拆开
   示例：
   hostLine: 「你只圈了她添的两句。材料原文还站得住吗，还是添话一拆整页都晃？」
   callerLine: 「材料还在。晃的是我们听顺耳的那半句，不是纸本身。」

3) 表姐门口口供
   轴：拒答收入/学费后，还剩哪一句能上舞台（家里一起挑资料）
   示例：
   hostLine: 「她拒答钱和学费。你能带回台上的，是不是只剩『资料家里一起挑』？」
   callerLine: 「对。那份周到不是他一个人做的——我也不再说成只被他一个人说服。」

4) 双份材料圈注
   轴：核验页 vs 存款证明对读——两张图不能接成一句话
   示例：
   hostLine: 「一张管项目，一张管当天余额。你还要把『学历好、收入稳』接成一句吗？」
   callerLine: 「不接。昨晚接成一句的是我们，不是那两张图。」

5) 家里群原话
   轴：群聊主语——最先问流水的人是谁
   示例：
   hostLine: 「群里原话还在。最先问流水的人是你，还是你妈？」
   callerLine: 「是我。两分钟后我妈才接话。昨晚我把我的问题说成了她的问题。」

规则：firstConflict 必须让夜 B 第一对峙随 earnedItem 变，不能只依赖 opener.line。

## 任务 B · 孤儿 inventory：profile-dinner-pause-playback

现状：nightStructure.interlude.actions 里 profile-listen-dinner-pause
grantsInventory: ["profile-dinner-pause-playback"]，但无 callbackOpeners、无 map。

二选一（择一落地，禁止半吊子）：

方案 B1（推荐）：新增 opener「饭局停顿回放」
  - line：回听饭局冷场后咨询者改口的第一句（控台 alone 说不出的停顿主语）
  - firstConflict：承重问停顿里她没说出口的那句（学历口径或流水主语二选一钉死，勿两问搅在一起）
  - interludeEarnedItemMap 增加：profile-dinner-pause-playback → 饭局停顿回放
  - 保留幕间回听动作

方案 B2：删除该幕间回听动作及其 grantsInventory；
  饭局停顿发现权完全交给白天/其它已接线路径；禁止「幕间拿到却改不了夜 B」。

## 任务 C · 茶馆 choice 加 resultBeats（信息态分叉）

day-profile-teahouse 的 body.choice.options 现有：
  keep-both-records → grantsEarnedItemId 介绍人双边记录
  mark-added-claims → grantsEarnedItemId 介绍人添话标记
目前几乎只换 label/earned，缺当场分叉。

为每个 option 增加 resultBeats（参考 01-credit 餐厅 choice 的 resultBeats 形状：
speaker/text 数组），使：
  - 选双边原话：台上留下「两套报价并排」的当场确认
  - 选添话标记：台上留下「哪两句是材料没有的」的当场确认
两条路径的信息态必须可辨别，不能只换按钮皮。

## 任务 D · 可选：白天再加 ≥1 个强后果 choice

若茶馆分叉仍偏弱，可在下列之一补 choice（互斥 earned 或不同 tone）：
  - day-profile-credential-docs：对读后选「先钉项目口径」vs「先钉余额不能当收入」
    （若拆成两个 earned，须各有 opener+firstConflict；或同 opener 不同 routeTone——优先各有 opener）
  - day-profile-cousin-doorstep：门口再逼一句被拒 vs 收手只留「家里一起挑」
目标：白天至少一处强后果 choice（选了就改夜 B 第一拳），不只明信片打卡。

## 任务 E · 挂断改硬：锁谜眼 + 双轨对齐

现状偏软：咨询者说「你别挂节目——我回完她马上打回来」，像短暂离席而非进入白天城市场。

改写要求：
1. 挂断必须锁住谜眼之一（二选一写死本案主眼，全案一致）：
   - 学历口径（项目/学信 vs「名校」说法），或
   - 流水主语（谁先问流水）
2. 双轨对齐（字段相等，勿各写各的）：
   nightStructure.hangup.stageDirection === overnightStructure.hangupLine
   nightStructure.hangup.hostLine === overnightStructure.hostHoldLine
3. hangup.line（咨询者）与 hostLine（主持人）要承认：今晚台上先搁，白天去查；
   不要写成「马上回来继续同一段 ON AIR」。

示例方向（须自写合规台词，可改）：
  咨询者：家里群还在 @ 我。学历和流水我今晚说不清——我白天把原话和材料对完再打进来。
  主持人：去。台上先留「口径」和「主语」，别急着定谁骗谁。
  stageDirection / hangupLine：忙音。介绍人的名字还停在弹幕里。（可保留氛围，但 hangup 主句要硬）

## 任务 F · continueLabel

把 nightStructure.interlude.continueLabel
从「带着这一页回拨」改为明确进入白天城市场的文案，例如：
  「进入白天调查」
禁止再暗示幕间结束=立刻回拨夜 B。

## 任务 G · interludeEarnedItemMap 覆盖

- family-chat-seen → 家里群原话（已有，保留）
- 若选 B1：profile-dinner-pause-playback → 饭局停顿回放
- 凡 grantsInventory 声称改夜 B 的，必须在 map 中有目标 opener；否则删授予

## 不要做的事

- 不编辑 plan 文件
- 不加 sitIn / 双麦
- 不重写案1 sitIn、案2 observe 架构
- 不把全部 opener 写成同一句 host 质问
- 不引入 stockAiForbiddenCopyRegex 命中句式
- 不扩大 unknown 点穿面

## 验收（本单）

1. 五个（或 B1 后六个）callbackOpeners 均有 firstConflict.hostLine + callerLine
2. 任意两个不同白天路径（如双边记录 vs 添话标记；或材料 vs 表姐）
   → 夜 B 第一条 host 对峙文案不同（firstConflict.hostLine 不同）
3. 无孤儿 grantsInventory（或已删动作）
4. continueLabel = 进入白天调查（或等价「白天」语义，绝非「回拨」）
5. hangup 双轨字段相等；谜眼被锁
6. npm run content:index && npm run check && npm run verify:pack -- steam-demo-01 全绿

## 建议提交信息

fix: case3 drama wiring — firstConflict on openers, orphan map, day beats, hangup/continueLabel
```

---

## 5. 完整 Prompt 4

把下面整段复制到 Codex / Cursor（**仅改案4**；建议 Prompt 3 已绿后再跑）：

```text
你是本仓库《直播间大侦探》的实施工程师。本单只改
content/packs/steam-demo-01/cases/04-workplace.json
的戏剧接线：给全部 9 条 overnightStructure.callbackOpeners 补 firstConflict；
处理幕间孤儿 inventory；财务窗/供应商补强后果 choice；挂断双轨与 continueLabel。
不要动案1/案2/案3（除非共享校验误伤且 diff 极小）。不要重写案1 sitIn / 案2 observe。

## 必读

1. docs/case34-drama-fix-prompt.md（§2 案4脊柱、§3 firstConflict 形状）
2. docs/case12-drama-rewrite-blueprint.md
3. docs/multi-scene-rashomon-design.md
4. docs/offline-rashomon-pass-19-fix-prompt.md
5. 样板：01-credit.json 的 callbackOpeners.*.firstConflict
6. 目标：04-workplace.json
   现网 9 opener（皆无 firstConflict）：
   财务窗口回单要求 / 供应商对接补话 / 茶水间回单缺口 / 茶水间责任对照 /
   赵律师边界框架 / 周会计钱路框架 / 小林主责框架 / 预算时间线复核 / 领导批注
   interludeEarnedItemMap 现有：
   work-frame-zhao→赵律师边界框架
   work-frame-zhou→周会计钱路框架
   work-frame-lin→小林主责框架
   timeline-delay-gap→预算时间线复核
   leader-note-hot→领导批注
   孤儿：delegation-return（send-appraisal）、playback-pad（listen-pad）、
         leader-note-cold（hold-back）——cold 有授予、无 opener/map
   continueLabel 现为「回拨她」（误导）
   白天财务窗/供应商多为明信片 visit（有 earned 但无 choice 分叉）

## 硬约束

- 不要编辑 ~/.cursor/plans/ 或任何 *.plan.md。
- 禁止 sitIn；禁止 ON AIR 第二方（财务/供应商/助理/领导不上麦）。
- 不砍脊柱：审批≠付款；开场早认主责；三顾问框架冲突；领导打断。
- 保留 truthBoundary / SSO / unknown（尤其：钱进谁账户、老板是否知情、老规矩起源）。
- 避开 stockAiForbiddenCopyRegex。
- 保留幕间 zhao-zhou-work 三选一冲突 + leader-interrupt；不要拆成第三个满地图。
- 验收：
  npm run content:index
  npm run check
  npm run verify:pack -- steam-demo-01

## 任务 A · 全部 9 opener 补 firstConflict（强制）

每条 hostLine 问不同第一拳（不可同义换皮）：

1) 财务窗口回单要求
   轴：审批页 vs 回单号——没有回单号能不能说「钱已付」
   例：
   hostLine: 「窗口只认回单号。你还要把同一张审批图说成到账吗？」
   callerLine: 「不。我问了他三遍到账，回单号一次都没问到。」

2) 供应商对接补话
   轴：对接人写在单上 ≠ 账户已入；停在哪一句
   例：
   hostLine: 「单上对接人是他。你要停在『返给对接人』，还是非要猜进了谁的账户？」
   callerLine: 「停在对接人。账户那句我不替语音往下补。」

3) 茶水间回单缺口
   轴：三页都在仍缺回单号——托话/批注/审批谁也没给付款凭据
   例：
   hostLine: 「三页都摊开了，哪一页写出了付款回单号？」
   callerLine: 「没有。同事让我别问，领导只写主责，审批页没有付款。」

4) 茶水间责任对照
   轴：托话「别问」vs 批注「主责记陈」——催付款/给回单职责空白
   例：
   hostLine: 「托话让你别问，批注把主责记给你。谁负责催付款、谁负责给回单？」
   callerLine: 「两页都没写。我只知道主责落到我头上，钱路仍是空的。」

5) 赵律师边界框架
   轴：留屏有、欠条无——边界停在能证明垫付、不能证明返款归属
   例：
   hostLine: 「赵律师先问留屏和欠条。你有哪一张？」
   callerLine: 「留屏有，欠条没有。当时怕一追就像斤斤计较，主责我都接了。」

6) 周会计钱路框架
   轴：付款回单号优先；报不出就别拿审批页当到账
   例：
   hostLine: 「周会计要的是付款回单号。你报得出吗？」
   callerLine: 「报不出。财务我不熟人；同一张截图我倒是收了三遍。」

7) 小林主责框架
   轴：拆句——想要位置 vs 被压刷卡，两句都留、互不销账
   例：
   hostLine: 「小林让你拆开『主责』。哪一句是你的，哪一句是他的？」
   callerLine: 「想要这个位置是我的；拿位置压我刷卡是他的。谁也别替谁销账。」

8) 预算时间线复核
   轴：他说来不及那天 vs 财务延后通知——两件事勿混
   例：
   hostLine: 「预算时间线对过了。『来不及』和『财务延后通知』还是一件事吗？」
   callerLine: 「不是。我一直把两件混在一起；延后通知盖不住不走财务的那条路。」

9) 领导批注
   轴：主责写我、钱路无字；夸奖≠保护伞
   例：
   hostLine: 「批注主责写你，钱路一个字没有。你还把夸奖听成保护伞吗？」
   callerLine: 「听成过。高兴完才看见垫款没落纸。」

茶水间两条 earned（回单缺口 / 责任对照）的 firstConflict 已含在 3)4)；勿漏。

## 任务 B · 孤儿三件套

B1) delegation-return（send-appraisal 授予）
  方案：map → 新建或复用 opener「顾问回单」（案4职场语义：路径/断点确认，不写穿账户）
  并写 firstConflict；或删除送鉴定授予（若本案鉴定戏弱且无白天承接）。
  推荐：保留送鉴定 + map 到「顾问回单」+ firstConflict（问：回单能证明什么/不能证明什么）。

B2) playback-pad（listen-pad）
  map 到新 opener「垫款回放」类（第一拳钉：她何时回「我来扛」/主责主动段）+ firstConflict；
  或删除听回放动作与授予。

B3) leader-note-cold（hold-back）
  现状：leader-note-hot → 领导批注；cold 孤儿。
  方案甲：为 cold 新建 opener「压下的批注」/「领导批注（冷）」——firstConflict 问「你为什么不敢带上台」；
  方案乙：hold-back 不再 grantsInventory（只改 posture/tone），仅 hot 授予领导批注。
  禁止：继续授予 cold 却改不了夜 B。

## 任务 C · 财务窗 AND/OR 供应商补强后果 choice

day-work-finance-window、day-work-supplier-visit 现多为线性 beats + 单一 earnedItemId（明信片升级不足）。

至少在一处（推荐两处都做）增加 body.choice：
  - 财务窗：互斥或强分叉
    例：「先钉窗口回单要求」vs「先追账户后四位被拒的当场记录」
    → 不同 grantsEarnedItemId 或同 earned 不同 routeTone；若新 earned 必须新 opener+firstConflict
  - 供应商：互斥
    例：「只带回对接人栏」vs「只带回『按老规矩返给对接人』语音原句」
    → 信息态分叉；可共用「供应商对接补话」但必须有 resultBeats 让当场确认不同；
      若拆 earned，则各有 opener+firstConflict
每个 option 建议带 resultBeats（参考案1），避免 label-only。

目标：白天路径升级到「选了就改夜 B 第一拳」，不是打卡点赞。

## 任务 D · 保留幕间冲突

- 保留 zhao-zhou-work 三顾问 options（已有 map + 本单 A 补 firstConflict）
- 保留 leader-interrupt 的 bring-to-callback / hold-back（按任务 B3 接线）
- 不要把顾问冲突搬进第三个 dayScenes 满地图

## 任务 E · 挂断双轨 + continueLabel

1. continueLabel：nightStructure.interlude.continueLabel
   从「回拨她」改为「进入白天调查」（或等价白天语义；禁止「回拨」）

2. 挂断改硬 + 对齐：
   nightStructure.hangup.stageDirection === overnightStructure.hangupLine
   nightStructure.hangup.hostLine === overnightStructure.hostHoldLine
   咨询者挂断句应进入白天核查（回单/批注/钱路），不要「截一下马上回来」的软离席。

示例方向（自写合规）：
  咨询者：批注和付款状态我今晚对不齐——我白天去窗口和材料页核完再打进来。
  主持人：去。审批图先留台上；回单号问不到，就别把通过说成到账。
  hangupLine/stageDirection：忙音。付款状态那一栏仍然是空的。

## 任务 F · 茶水间

breakroom 已有双 earned（茶水间回单缺口 / 茶水间责任对照）——由任务 A 覆盖 firstConflict。
可选：为 options 补 resultBeats 加厚当场分叉（若时间够）。

## 不要做的事

- 不编辑 plan
- 不加 sitIn / 双麦
- 不重写案1 sitIn、案2 observe
- 不点穿 unknown 账户归属
- 不让 9 条 hostLine 写成同一句
- 不引入禁词表句式

## 验收（本单）

1. 9 条（+ 若新增顾问回单/垫款回放/冷批注）全部有 firstConflict
2. 两条不同白天路径 → 夜 B firstConflict.hostLine 不同
3. 无孤儿 inventory（delegation-return / playback-pad / leader-note-cold 均 map 或停授）
4. continueLabel 进入白天调查；hangup 双轨相等
5. zhao-zhou-work + leader-interrupt 仍在
6. npm 三条验收命令全绿

## 建议提交信息

fix: case4 drama wiring — firstConflict on 9 openers, orphan maps, day choices, hangup/continueLabel
```

---

## 6. Optional Prompt S（skill 条款）

短粘贴版（立法会话；默认可只改 skill，不改四案 JSON）：

```text
你是《直播间大侦探》的 skill 立法委员。本单只补条款，不改四案剧情 JSON（除非用户另下实施单）。

硬约束：不编辑 ~/.cursor/plans/ 或 *.plan.md；skill 正文写律不写谜底；不点穿具体案情答案。

必读：
- project-skills/case-scriptwriting/SKILL.md（Multi-Scene and Offline Rashomon 一节）
- project-skills/detective-plot-coupling-review/SKILL.md 与 references
- docs/case34-drama-fix-prompt.md §3
- docs/offline-rashomon-pass-19-fix-prompt.md（opener 唯一源）

请追加/修订如下可检查律（中英键名可保留代码标识）：

1) Multi-Scene / Overnight：凡 overnightStructure.callbackOpeners 中可在夜 B 出现的 opener，必须含 firstConflict.{hostLine, callerLine}；夜 B 第一对峙随 earnedItem 变，禁止只改 line。
2) Detective Non-linearity / 带回律：幕间 interlude 的 grantsInventory 若意图改变夜 B 开场，必须出现在 overnightStructure.interludeEarnedItemMap（或与 opener 同 id）且目标 opener 存在；否则视为不合格（应删授予或补 map+opener+firstConflict）。
3) continueLabel 语义：幕间结束进入白天调查时，文案不得写成「回拨」；挂断双轨 stageDirection===hangupLine、hostLine===hostHoldLine。

输出：对上述 skill 文件的具体补丁段落（可直接 apply），并给一条评审检查清单（✓/✗）。
```

---

## 7. 验收 + 顺序

### 推荐顺序

1. **Prompt 3** → `03-profile.json` → npm 三命令绿  
2. **Prompt 4** → `04-workplace.json` → npm 三命令绿  
3. **Prompt S**（可选）→ skill 立法  

### Smoke（人工或脚本）

- 案3：白天选「介绍人双边记录」vs「介绍人添话标记」→ 夜 B `firstConflict.hostLine` 不同。  
- 案3：再抽「双份材料圈注」vs「家里群原话」→ hostLine 仍不同。  
- 案4：白天选财务窗路径 vs 茶水间「回单缺口」→ hostLine 不同。  
- 案4：幕间选赵框架 vs 周框架 → 夜 B 第一拳不同。  
- 确认 `continueLabel` 为「进入白天调查」类；确认挂断不再「马上回来」软离席。  

### 明确不做

- 不重写 **案1 sitIn** 架构。  
- 不重写 **案2 observe** 架构。  
- 不编辑任何 plan 文件。  

### 验收命令（每案落地后）

```bash
npm run content:index
npm run check
npm run verify:pack -- steam-demo-01
```


---

## 相关

- [`case12-drama-fix-prompt.md`](case12-drama-fix-prompt.md) — 案1/案2 戏剧残余抛光（重写已落地后的 POLISH）
