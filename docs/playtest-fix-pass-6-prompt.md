# 第 6 批·案 1 实测修复执行单（playtest fix pass 6）

你是本仓库的实施工程师。本单来自 2026-07-06 案 1 真人实测的 8 条反馈。其中 3 条内容修复（S1 误加的分期关键选项已删除并改为闲聊闪避、回流补图第二人称与动词已改、回流谜语腔 feedback 已改）**已在当前工作区完成且校验全绿**——你的第一件事是确认这些改动存在（`rg "那笔短视频平台的分期是怎么回事" content/`）并把它们纳入本批第一个提交，不要覆盖。

剩余 5 项任务如下。语言标准以 `project-skills/case-scriptwriting/SKILL.md` 的 Language Rules 为准。

## 任务 1：运行时文案池纳入去 AI 味机械审查（病根修复，最优先）

实测揪出的三句（「这一问给了对方台阶，现场声音又起来了」「后台这页咬住了，弹幕短暂安静」「关键几句和材料都压上来了，弹幕没能把话题带散」）共同病根：`src/runtime/livePressure.js` 与 `src/runtime/recapModel.js` 里的生成文案从未过内容 JSON 那套禁词扫描。

- `scripts/verify-logic.js` 新增测试：提取这两个文件（后续可扩到 `src/ui/`）中的全部中文字符串字面量，跑 DAILY-009 同款禁词正则，并追加"氛围动词黑名单"：`咬住`、`压住`、`带散`、`麦温`、`人声`。现有违例随本批一并清理。
- 「真正」一词在 `livePressure.js` 的收麦行里仍存在（「真正的压力没有完全顶上来」），属禁词，一并修。

## 任务 2：氛围反应句去冗（实测问题 1 与 5）

原则：反应句只在**具体的事**发生时出现；对选择质量的点评（"给了台阶"）和纯氛围填充（"咬住了""短暂安静"）一律清空。

- `livePressure.js` `questionPressureReaction`：`softening` / `detour` 通用分支返回空字符串；`pressure-point` / `trust-but-verify` 通用分支的「这句咬住了，直播间的人声压低了一点」同为氛围填充，也返回空。保留按内容正则命中的具体反应（它们说的是事实）。
- `recapModel.js:446` `investigationPickReaction` 的「后台这页咬住了，弹幕短暂安静。」返回空——回流的 feedback 文本已承载实质，氛围句是重复。
- 渲染端确认：空反应不渲染气泡/条（不出现空框）。
- `verify-logic.js:302` 钉住「给了对方台阶」的断言同步改为断言空串；相关断言一并梳理。

## 任务 3：现场压力卡文案重写（实测问题 7）

「现场压力 / 压住了 / 关键几句和材料都压上来了」是设计师黑话套娃。整卡改为平实陈述（逐字使用）：

- 卡标题「现场压力」→「这通麦」。
- 标签与收麦行替换表（`livePressure.js` `pressureRecapLabel` / `pressureRecapLine`）：
  - 「压住了」→「稳住了」；
    - guard 分支行 →「对面的事你问到了，来电人自己没说满的地方，你也没放过。」
    - found≥2 分支行 →「该问的几句问到了，材料也圈中了，弹幕没跑题。」
    - 其余分支行 →「没吵起来，几处要紧的都问到了。」
  - 「差点断麦」行 →「有两次差点把人问挂了，后面靠材料圆了回来。」
  - 「跑偏过」行 →「中间被闲话带走过几次，后来拉了回来。」
  - 「还在听」行 →「这通问得少，听得多。」
- 故事集级 `pressurePackLine` / `pressurePackComment` 按同一原则重写（把「压住/带散/咬住」全部换成"问到了/跑题/问挂了"这类具体动词），并通过任务 1 的机械扫描。

## 任务 4：账单板排版（实测问题 3）

材料板 bill 版式当前把整段散文 material 塞进账单样式，排版怪。改为结构化行：

- 内容契约：`evidenceChecks[]` 可选字段 `materialRows: []`（字符串数组）；bill/table 版式优先渲染 rows 为逐行条目，`material` 降为板下一句说明；无 rows 的板保持现状。
- 案 1 账单板 `materialRows`（逐字）：

```json
["纪念日晚餐 · 断缴后", "礼物分期 · 断缴后", "酒店消费 ×2 · 断缴后", "短视频平台分期 · 1.2 万", "本期最低还款 · 待还"]
```

- 圈选目标仍是四个选项按钮，不改交互；排版细节按 `docs/playtest-report-template.md` 截图流程自查一遍。

## 任务 5：开场账单实物化（实测问题 8）

玩家问"怎么知道有分期的摄影器材"——现在 1.2 万分期只活在台词里。让材料在被提到的当刻**以实物出现**：

- 引擎契约：`sceneVersions[].showsCard: "<evidenceCards id>"`（可选）。该场景播出时，在来电人气泡下方渲染对应 evidenceCard 的只读展示（type/title/front），作为"她甩出来的图"。纯展示，不可圈，不影响后面的材料板。
- 案 1 接线：场景 0 `showsCard: "daily-credit-social-security"`；场景 1 `showsCard: "daily-credit-card-bill"`。
- 更新 `daily-credit-card-bill` 卡 `front`（逐字，注意只露平台名和金额，**不写摄影器材**——那是场景 3 的揭示）：

> 餐厅、礼物分期、两次酒店集中在断缴后一个月内；另有“短视频平台分期 1.2 万”一笔。

- 这样玩家在 S1 就亲眼看到那笔分期（反讽窗口可视化），刚加的 S1 闲聊闪避（「那笔短视频平台的分期是怎么回事？」→ 她岔开）就有了自然的触发动机。
- `verify:pack` 校验 `showsCard` 引用的卡 id 存在。

## 验收

1. 顺序：确认工作区已有修复 → 任务 1 → 2 → 3 → 4 → 5。每步 `npm run content:index && npm run check`。
2. 全部完成：`npm run verify:pack -- steam-demo-01`；`npm run smoke:browser`（回放若钉了被改文案需同步）。
3. `rg "给了对方台阶|咬住|压上来了|麦温" src/runtime/ src/ui/` 零命中（生成索引除外）。
4. 手动过案 1 前两场：S0 出现社保截图卡、S1 出现账单卡且能看到 1.2 万分期一行、闲聊问分期得到岔开回答、外围问硬撑不再出现分期选项。
5. 提交拆分：`fix: case1 playtest content repairs`（含工作区既有改动）、`fix: strip atmosphere filler and de-jargon pressure recap`（任务 1-3）、`feat: structured bill rows and in-scene material cards`（任务 4-5）。

## 不要做的事

- 不动案 2-4 的任何内容（同类问题等案 1 模式定型后统一过）。
- 反应句清空后不要补新的氛围句；空着比硬写好。
- `showsCard` 展示卡不加点击交互、不加高亮提示。
- 账单行文案不出现"摄影器材/灯/稳定器"字样。
