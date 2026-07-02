# 未完成项目清单

这份清单记录《直播间大侦探》从当前可玩原型走到 Steam 试玩版、再到正式章节式案件包发版还缺什么。它不是灵感池，而是每轮继续优化前要先看的工作台。

## 当前唯一优化主线

**直播控场系统：玩家作为主播，在听众耐心、连线人防备和材料缺口之间做选择。**

竞品参考和昨天的工程改造都收束到这条主线，不同时开“AI 自由问答 / 桌面壳 / 大量新剧情 / 多线职业模拟”。每轮继续优化只能选择一个子项，并在本文件里标明它属于哪一层。

2026-07-01 已完成的支撑项：

- 内容包骨架：`content/packs/steam-demo-01/`、`src/storyPacks.js`、`npm run verify:pack`。
- 路线运行时拆分：`src/runtime/routeLog.js`，路线轴、语气和画像已能纯函数测试。

当前下一步只做：**资料操作模型**。它是直播控场系统的第一层，不和 AI 问答、桌面壳、新故事扩写同时推进。

2026-07-02 已完成的支撑项：

- 竞品参考已归档到 `docs/competitive-reference-on-air-taxi.md`，只吸收职业场景压力，不转向出租车或 AI 身份。
- 资料操作底座已拆到 `src/runtime/materialOperation.js`，命中/误指、忍耐消耗、路线记录和矛盾泄露规则可纯函数测试。
- 材料检视已改成材料板内圈点：文件行、可圈区域、命中/误指圈痕都在同一个台面里，不再是正文段落加普通按钮。
- 账单、表格、截图、审批流已经有不同材料版式，不再共用同一种文字材料卡。
- 案后私信回流最小版已接入：每案有固定 `investigationHooks`，触发自已听到的矛盾，复用材料操作台并在路线图标成“回”。
- 案件包架构开始从“四案固定”改为“内容包决定案数”：当前 demo 包仍是四案，但 `episode` 存档、包校验和故事生成不再把 4 当成运行时铁律。
- Web 存档已抽到 `src/platform/saveStore.js`：当前仍是单槽 localStorage，但已有 `read/write/removeMany/list/exportForCloud` 接口，后续桌面壳可替换为文件存档。
- 键盘焦点底座已接入：渲染后自动落到主操作，方向键 / WASD 切换按钮，Enter / Space 确认，Esc 返回标题或重试入口。
- 内容包 manifest 元数据已接到运行时生成索引：`npm run content:index` 从 `content/packs/*/manifest.json` 生成 `src/generated/contentPackIndex.js`，`storyPacks.js` 不再手写一份故事包镜像。
- 完整案件 JSON loader 入口已接上：生成索引会输出 `CONTENT_CASES`，`runtime-loaded` 案件可通过 `src/runtime/contentCase.js` 覆盖模板字段；当前 demo 前两案已切到 `runtime-loaded`，其余两案仍保持 `metadata-only`。
- 路线轴和语气推断已收口到 `src/runtime/routeLog.js`：`caseEngine` 不再维护第二套 `inferRouteAxis / inferRouteTone`。
- H5 构建和离线 playable 构建已隔离输出目录：`build:h5` 不再删除整个 `dist`，避免并行构建时踩掉 `dist/playable`。

## P0：试玩版必须补齐

### 桌面可玩形态

- 现在已经有 `build:playable`、Windows 双击脚本和 Web `saveStore` 抽象，但还没有真正桌面壳。
- 需要确定 Electron / Tauri / 其他 runtime。
- 需要文件存档、窗口/全屏、缩放、离线启动、崩溃日志。
- Steam 试玩不能依赖本地端口，也不能最终只靠浏览器 localStorage；下一步需要让桌面壳把 `saveStore` 接到文件系统。

验收：

- Windows 双击启动进入离线包。
- 无网络也能进入完整试玩。
- 存档写入本地文件，能重启恢复。
- 构建产物里没有开发服务器依赖。

### 输入和焦点

- 基础键盘操作已接入：方向键 / WASD 切换选项，Enter / Space 确认，Esc 返回标题或重试入口。
- 已有默认焦点和焦点环，大 test 会校验全局键盘入口、焦点移动和渲染后默认落焦。
- 仍需补 Steam Input / 手柄映射，以及 Tab / Y 回看这类平台快捷键。

验收：

- 不用鼠标也能从标题页打完第一案。
- 每个页面只有一个清楚的默认焦点。
- 选项、回看、重开、继续都能键盘操作。
- 手柄 B/Y 或 Steam Input 映射完成后，再把该项从 P0 移出。

### 内容包数据化

- 2026-07-02 复查结论：`content/packs/steam-demo-01/cases/*.json` 不能再做影子资产。前两案已是运行时台词来源；其余 `metadata-only` 案件仍只能写策划压力包，`npm run verify:pack` 会阻止它们夹带运行时字段。
- 第一层故事包 manifest 已经由 `content/packs/steam-demo-01/` 生成运行时索引，构建和校验会检查索引是否过期。
- 第二层 loader 入口已经存在：如果某个 case JSON 标成 `runtime-loaded`，构建索引会校验完整字段并嵌入运行时，`caseEngine` 会用它覆盖模板字段。
- 当前 demo 包前两案完整台词、追问、材料判定和结算已迁入内容包；其余两案仍写在 `src/caseEngine.js`，下一步继续逐案迁移。
- 新增或替换一个案子仍要同时碰 `src/caseEngine.js`、`src/dailyChoices.js`、`content/packs/...`，以及 `src/app.js` 里的若干 `plotId` 文案分支。这是内容扩量前最高优先级的架构债。
- 长期目标是运行时代码只负责加载和校验。

建议结构：

```text
content/packs/steam-demo-01/
  manifest.json
  cases/
    01-credit.json
    02-tony.json
    03-profile.json
    04-workplace.json
  comments.json
  route-archetypes.json
  qa-report.md
```

验收：

- 改故事集顺序、主题和压力系统不改 `src/app.js`。
- 改故事集顺序、主题、案数只改 `content/packs/*/manifest.json` 并运行 `npm run content:index`；`npm run check` 会拦截过期索引。
- `runtimeContentStatus` 从 `metadata-only` 切到 `runtime-loaded` 以后，JSON 必须包含完整 `openingDialogue`、`sceneVersions`、`evidenceChecks`、`investigationHooks`、`deepFollowup`、收麦和复盘字段，并由运行时读取。
- `runtime-loaded` 迁移必须一案一案做；每迁一案都要保证 `EPISODE-002` 自动回放和叙事流测试不变。
- `npm run verify:pack` 能单独检查当前案件包结构和运行时定义一致性。
- 新故事包可以新增目录接入；正式迁移后完整台词也不再写在 `src/caseEngine.js`。

### 运行时拆分

- `src/app.js` 仍然承担渲染、状态推进、路线图、收麦、平台桥接。
- 路线轴和路线画像纯逻辑已拆到 `src/runtime/routeLog.js`，但 HTML 复盘渲染和状态写入仍在 `src/app.js`。
- 路由/语气推断规则已从 `caseEngine` 收口到 `routeLog.js`；剩余债务是旧存档迁移规则和模板校验还要继续复用同一套 route schema。
- 短期可继续迭代，但 Steam demo 前需要拆。

优先拆：

- `src/runtime/sceneAdvance.js`
- 继续补强 `src/runtime/routeLog.js`，把路线图模型和故事集路线统计也完全纯函数化。
- `src/runtime/recapModel.js`
- `src/ui/renderSceneReview.js`
- `src/ui/renderRecap.js`
- `src/platform/saveStore.js` 已有 Web 抽象；下一步接桌面文件实现。

验收：

- UI 文案调整不需要碰状态推进。
- 路线图和结算逻辑能用纯函数测试。

## P1：玩法丰满度

P1 只承接“直播控场系统”，不再散成多个方向。当前顺序固定为：

1. 资料操作模型。
2. 现场压力模型。
3. 收麦回看模型。

### 每案 20 分钟体量

当前每案已经有 5 段来电、材料检视、深问、原话收麦，但实际体量还偏精简。

需要补：

- 每案至少 2 份可读材料，其中 1 份进入“圈哪一处”玩法，另 1 份进入回看/复盘。
- 每案至少 1 个“来电人藏着自己的不利信息”的后半程揭示。
- 每案至少 1 个第三压力源：父母、朋友、老板、平台、介绍人、供应商、期限。
- 外围选项要有真实诱惑，不能只是弱答案。

验收：

- 快速通关第一案不少于 12 分钟。
- 正常读完材料和回看，每案目标 20 分钟。
- 玩家至少有一次“我刚才站早了”的体验。

### 材料检视继续增强

当前材料检视已经可玩，并开始按材料类型区分版式。

当前唯一进行中的玩法方向：资料操作模型。

- 已支持截图、账单、表格、审批流的基础差异版式；下一步要让正确/误指反馈牵动现场压力和弹幕反应。
- 新增设计文档 `docs/host-investigation-loop.md`：把主播探索收束为后台核实、案后私信回流和有限线下问询，不做开放调查模拟。
- 已支持案后私信回流最小版；下一步要让回流命中/误指改变案间余味和弹幕压力。
- 错误材料选择给现场反应，而不是只给一句说明。
- 复盘路线图中保留材料节点，并显示为“料”。
- 不新增额外推理菜单；材料操作仍接在当前线性来电之后。

验收：

- 玩家不用读题也能看出这是一份材料。
- 选中后有“圈出来”的视觉反馈。
- 错选不告诉正确答案，只让玩家知道这条没有咬住。

### 主播探索与证据回流

这是资料操作模型的下一层，不另开新方向。玩家在通话里发现矛盾后，可以把某条线交给后台核实，或在收麦后收到私信回流，扩大证据来源。

先做最小版本：

- 每案 1 个 `investigationHook`，触发条件来自核心追问或材料命中。已完成最小版。
- 首版只做“案后私信回流”，复用现有材料操作台。已完成最小版。
- 回流证据必须关联玩家已经听到的矛盾，不能凭空爆新事实。
- 私信、补页、第三人转述只能作为材料出现，不能让另一方直接上麦对峙。
- 回流可以补强、反咬或制造噪音，但不能显示“正确路线 / 新线索解锁 / 核验成功”等任务提示。

验收：

- 玩家先听到矛盾，再看到回流材料。
- 回流材料能证明一件事，也保留一件不能证明的事。
- 路线图能记录这是“回流/核实”节点，而不是第六段对话。
- 低命中路线也能看到不同余味，不只是少拿一份提示。

### 原话收麦的爽点

当前最终选择已经是“选一句原话”，但还可以更像逆转裁判式收束。

需要补：

- 每个最终原话都要来自前文，不能是抽象立场。
- 最强原话选择后，主播回应要短、准、像直播间接话。
- 选择非最强原话时，不判死错，但要生成不同余味。
- 结果页不能给“最佳答案教程”，只能做对照和余波。

验收：

- 玩家能记得那句原话出现过。
- 收麦回应不能超过两句。
- 不出现“正确答案 / 最佳答案 / 结论更锋利”等文字。

### 故事集整体感

当前已做案间过渡和四案总结，但还需要更有“同一集节目”的感觉。

需要补：

- 每案收麦后带出下一案问题，但不能剧透目录。
- 四案总结要回收四案物件，而不只是路线轴。
- 评论区审判墙要更像真实评论，不像功能说明。
- 失败/低揭示路线也要有完整余味，不要只像没通关。

验收：

- 第一案后能自然想进第二案。
- 终局能看出四案共享一个主题。
- 低分路线也能产出可分享的结果卡。

## P2：内容扩展

### 模板池扩容

当前模板池 5 个，正式内容生产不够。

目标：

- 扩到至少 9-12 个不同 plot id。
- 非婚恋至少占一半。
- 每个故事包四案题材不能同质化。

优先题材：

- 消费退款 / 预付卡 / 课程退费。
- 租房押金 / 维修 / 合租责任。
- 平台交易 / 客服截图 / 代运营履约。
- 熟人借贷 / 借赠边界 / 转账备注。
- 职场署名 / 返款 / 流程入口。
- 家庭财务 / 共同账户 / 保险受益人。

### 采风和编剧管线

- 网络热点只能做素材，不直接搬真实案。
- 每个热点要抽象成压力系统：物件、目的、缺口、成本、边界。
- 每个故事包先写主题，再选四案。

需要补：

- `docs/story-pack-development-pipeline.md`
- `content/intelligence/` 原始素材摘要目录。
- 每案 `qa-report.md`：逻辑链、AI 味检查、价值观检查、事实边界。

## P3：AI 问答实验

P3 暂停作为当前实现方向。只有当资料操作模型和现场压力模型稳定后，才进入受控自由追问。AI 不能抢在直播控场系统前面。

### 受控自由追问

AI 问答值得做，但不能让 AI 生成事实。

推荐顺序：

1. 先做本地 intent matcher。
2. 每个 scene 增加 `allowedIntents`、`aliases`、`blockedTopics`。
3. 低置信度不答，只转成已写好的追问或扣忍耐。
4. 再接可选 AI router。

验收：

- 玩家自然语言只能映射到当前 scene 已写好的追问。
- AI 不新增金额、人物、时间线、证据。
- 离线试玩版不依赖 AI 服务。
- 路由结果可记录、可回放、可测试。

### 标注和训练

训练不是先训练大模型，而是先积累标注集：

- 玩家输入。
- 当前 scene。
- 命中的 intent。
- 分类：critical_hit / dialogue_hit / partial / premature / repeat / off_topic / blocked。
- 是否消耗忍耐。

## P4：文档和 skill 还要补

### 需要新增或补强的文档

- `docs/unfinished-backlog.md`：本文件，作为未完成项目总入口。
- `docs/story-pack-development-pipeline.md`：故事包从热点采风到上线的流程。
- `docs/content-pack-schema.md`：内容包 JSON 字段、校验规则、示例。
- `docs/desktop-steam-build-plan.md`：桌面壳、存档、Steam Cloud、Steam Input。
- `docs/controlled-ai-intent-schema.md`：受控自由追问 intent / alias / answerId 结构。
- `docs/playtest-report-template.md`：每次大测试的记录模板。

### `project-skills/livestream-game-flow-review/SKILL.md` 需要持续补的规则

- 每轮大测试前先读本 backlog。
- 案间过渡不能写目录标题，要用上一通路线和下一通物件连接。
- 结算页不能像评分表，路线图和百分比只能作为余味，不可提示通关。
- 材料节点要有可视化目标，正确不扣忍耐，误指才扣。
- 受控 AI 只做 intent 映射，不写事实。
- 新增剧情前必须先写压力系统，再拆字段。

### 自动测试还缺

- `verify:pack <pack-id>`：独立校验内容包。
- 浏览器自动回放：至少一条 perfect route、一条 outer route、一条材料错选 route。
- 键盘导航测试。
- 结果页/案间页截图对比。
- 内容字段 schema 校验。

## 当前建议顺序

1. 资料操作模型：把材料检视从文字三选一升级为可视化圈点数据结构。
2. 现场压力模型：把听众耐心、连线人防备、弹幕跑偏归到同一套控场反馈里。
3. 收麦回看模型：结果页回收材料圈点、原话选择和路线画像。
4. 再继续 P0 技术债：完整案件内容 JSON loader、`recapModel`、`sceneAdvance`、桌面文件版 `saveStore`。
5. 然后做桌面壳、键盘/手柄输入和内容包完整迁移。
6. 最后再做受控自由追问和 AI router。
