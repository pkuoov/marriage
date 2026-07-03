# 未完成项目清单

这份清单记录《直播间大侦探》从当前可玩原型走到 Steam 试玩版、再到正式章节式案件包发版还缺什么。它不是灵感池，而是每轮继续优化前要先看的工作台。

## 当前唯一优化主线

**直播控场系统：玩家作为主播，在听众耐心、连线人防备和材料缺口之间做选择。**

竞品参考和昨天的工程改造都收束到这条主线，不同时开“AI 自由问答 / 桌面壳 / 大量新剧情 / 多线职业模拟”。每轮继续优化只能选择一个子项，并在本文件里标明它属于哪一层。

2026-07-01 已完成的支撑项：

- 内容包骨架：`content/packs/steam-demo-01/`、`src/storyPacks.js`、`npm run verify:pack`。
- 路线运行时拆分：`src/runtime/routeLog.js`，路线轴、语气和画像已能纯函数测试。

当前下一步只做：**Steam 试玩版底座收口**。现场压力、材料圈点、案后回流、事实边界、内容包和桌面壳都已接入第一版；接下来优先补可验证的工程底座，不和 AI 问答、新故事扩写同时推进。

2026-07-02 已完成的支撑项：

- 竞品参考已归档到 `docs/competitive-reference-on-air-taxi.md`，只吸收职业场景压力，不转向出租车或 AI 身份。
- 资料操作底座已拆到 `src/runtime/materialOperation.js`，命中/误指、忍耐消耗、路线记录和矛盾泄露规则可纯函数测试。
- 材料检视已改成材料板内圈点：文件行、可圈区域、命中/误指圈痕都在同一个台面里，不再是正文段落加普通按钮。
- 账单、表格、截图、审批流已经有不同材料版式，不再共用同一种文字材料卡。
- 案后私信回流已接入并开始咬住现场：每案有固定 `investigationHooks`，触发自已听到的矛盾，复用材料操作台并在路线图标成“回”；命中/误指会影响案间余味和弹幕反应。
- 现场压力模型第一层已拆到 `src/runtime/livePressure.js`：听众耐心、弹幕跑偏/压住、连线人防备和人物表情钩子开始由同一份纯函数画像生成；追问语气和材料命中/误指也开始从这里生成现场反应，并已进入单案结算和故事集终局。
- 现场压力表演钩子已迁入内容包 `sceneVersions[].pressureHint`：弹幕短钩子、连线人防备和人物微表情不再靠运行时代码扫描案件台词；跑偏/压住状态由结构化 `lastPressureSignal` 驱动。
- 中途弹幕已接入内容包 `routeAxisComments`：玩家最近一次路线轴会影响三条直播短弹幕中的一条，但不写成过关提示。
- 第四案职场报销已增加第二份材料检视：审批图只证明流程到过一站，供应商报价继续追返款入口，让职场案有流程压力差异。
- 故事集终局已回收路线画像、现场压力、事实边界、材料圈点和收麦原话，不再只看揭示率。
- 故事集终局评价模型已拆到 `src/runtime/recapModel.js`：主题、路线画像、评论墙、分享标题和收麦余味有纯函数测试，`app.js` 只负责收集当前存档和渲染。
- 故事集终局已新增物件回收：`storyObjectProfile` 会把每案的账单、表格、资料图、审批图等物件串起来，评论墙也能围绕物件发声。
- 路线图节点模型已拆到 `src/runtime/routeMapModel.js`：普通追问、材料圈点和后台回流的节点标记由纯函数输出，`app.js` 只渲染 HTML。
- 对话段落推进已拆出 `sceneReviewModel`：当前段落、完成态、最后一段后的材料/深入追问/原话选择分支都在 `src/runtime/sceneAdvance.js` 里纯函数测试。
- 材料检视和后台私信回流推进已拆出 `evidenceCheckModel` / `investigationBackflowModel`：当前材料、未处理回流、缺省态和下一步按钮都可纯函数测试。
- 案件包架构开始从“四案固定”改为“内容包决定案数”：当前 demo 包仍是四案，但 `episode` 存档、包校验和故事生成不再把 4 当成运行时铁律。
- 存档已抽到 `src/platform/saveStore.js`：Web 仍是单槽 localStorage；桌面壳可通过 `platformRuntime.saveFiles` 提供 `read/write/remove/list/exportForCloud` 文件存档接口，后续接 Steam Cloud。
- 键盘焦点底座已接入：渲染后自动落到主操作，方向键 / WASD 切换按钮，Enter / Space 确认，Esc 返回标题或重试入口。
- 基础手柄和回看快捷键已接入：Tab 切换当前回看面板；标准 Gamepad API 轮询支持十字键/左摇杆移动焦点、A 确认、B 返回、Y 回看/复盘入口；下一步需要真实 Steam Deck/控制器设备 QA。
- 输入导航规则已拆到 `src/runtime/inputNavigation.js`：键盘意图、焦点循环和摇杆方向/冷却都有纯函数测试，`app.js` 只负责把意图落到按钮。
- 内容包 manifest 元数据已接到运行时生成索引：`npm run content:index` 从 `content/packs/*/manifest.json` 生成 `src/generated/contentPackIndex.js`，`storyPacks.js` 不再手写一份故事包镜像。
- 完整案件 JSON loader 入口已接上：生成索引会输出 `CONTENT_CASES`，`runtime-loaded` 案件可通过 `src/runtime/contentCase.js` 覆盖模板字段；当前 demo 四案均已切到 `runtime-loaded`。
- daily 模式已优先加载 runtime-loaded JSON：同一 `plotId` 的试玩案不再在故事集和今日来电里维护两套台词，未迁移的轮换案继续走模板兜底。
- `verify:pack` 已支持指定 pack id，并新增运行时内容 schema 检查：开场、追问、材料、回流、深入追问、收束和分享字段都必须是可玩的嵌套结构。
- 已新增 Playwright 浏览器回放 smoke：`npm run smoke:browser` 会打开离线 playable，覆盖 perfect route、外围追问后继续主线、材料误圈、纯键盘 perfect 和模拟 Gamepad API perfect 五条单案路线，并走到收麦回看。
- 案间物件名和下一案桥接句已从 manifest `sequence.objectLabel/bridge` 进入运行时，`app.js` 不再用 `plotId` 表维护这一组文案。
- 案间上一通收束句已迁入每案 JSON 的 `storyInterludeRecap`，并纳入 runtime-loaded 必填字段，避免 `app.js` 继续按 `plotId` 写剧本文案。
- 案件背景 class 已迁入日案定义和 manifest `sequence.backdropClass`，案内视觉背景不再由 `app.js` 的 `plotId` 表决定。
- 存款证明案的特殊结算分支已迁入内容 JSON 的 `conclusionWhenCleared/conclusionBranches`，分享卡也改回读取 `dailyShare*` 字段，减少 runtime `plotId` 文案特判。
- 事实边界已进入收麦回看和故事集终局：每案 `truthBoundary` 会要求玩家一次性归位多句话；放完即可继续，错放不当场纠正，会在下一页回看和终局标签、分享卡、评论区审判墙里体现。
- `comments.json` 已进入内容索引和终局评论墙：内容包可以控制本集评论区底色，高低揭示率、压力、材料和原话选择仍由运行时模型替换局部评论。
- 路线轴和语气推断已收口到 `src/runtime/routeLog.js`：`caseEngine` 不再维护第二套 `inferRouteAxis / inferRouteTone`。
- 日案模板分发已收口到 `DAILY_TEMPLATE_BUILDERS` registry：新增 daily 兜底模板不再改一串 `plotId` if 链。
- H5 构建和离线 playable 构建已隔离输出目录：`build:h5` 不再删除整个 `dist`，避免并行构建时踩掉 `dist/playable`。
- P2 内容生产池已新增 `content/intelligence/plot-template-pool.json`：12 个压力系统种子、非婚恋过半，并由 `npm run verify:content-pipeline` 校验。

## P0：试玩版必须补齐

### 桌面可玩形态

- 现在已经有 `build:playable`、Windows 双击脚本、`saveStore` 抽象、桌面文件存档桥接口，以及 `desktop/electron/` 桌面壳源码。
- 已先选 Electron 骨架验证静态 H5 结构：`build:desktop` 会生成 `dist/desktop-electron`，包含 `main.cjs`、`preload.cjs`、桌面壳 `package.json` 和离线 playable。
- 已有 preload 文件存档 IPC，运行时通过 `platformRuntime.saveFiles` 写入用户数据目录。
- 已补 Electron / electron-builder devDependencies 和 `package:win` Windows portable 打包入口；Electron 43 打包环境需要 Node 22.12 或更高版本，当前仍需在有依赖和目标平台的环境里实际跑一次打包验收。
- 已补桌面窗口状态保存、全屏/缩放快捷键、单实例锁和 crash log 文件输出。
- 桌面 staging 构建已改成同脚本生成 playable + desktop，并使用临时目录和锁目录，避免 `build:steam` / `smoke:desktop` 并发时互相踩 `dist/playable` 或 `dist/desktop-electron/playable`。
- 已补 `docs/desktop-steam-build-plan.md` 和 `npm run steam:preflight`：本地可检查 package 入口、electron-builder 输出目录、portable x64、desktop staging、文件存档桥、crash log 和 Node/Electron 打包版本要求。
- 仍需补 Steam overlay/Cloud 接入、安装器、签名和真实 Windows/Steam Deck 验包。

验收：

- Windows 双击启动进入离线包。
- 无网络也能进入完整试玩。
- 存档写入本地文件，能重启恢复。当前源码和 IPC 已具备，待 Electron 运行时/打包验证。
- 窗口状态、缩放和崩溃日志有桌面 smoke/源码校验；还需要真实桌面运行确认。
- 构建产物里没有开发服务器依赖。`build:desktop` 已生成离线桌面目录，`package:win` 会把它打到 `dist/steam`，待实机验包。

### 输入和焦点

- 基础键盘操作已接入：方向键 / WASD 切换选项，Enter / Space 确认，Esc 返回标题或重试入口。
- 已有默认焦点和焦点环，大 test 会校验全局键盘入口、焦点移动、渲染后默认落焦和输入意图纯函数。
- 基础手柄映射已接：十字键 / 左摇杆切换选项，A 确认，B 返回，Y 回看/复盘入口；Tab 已能切换当前回看面板。Playwright 已用模拟 Gamepad API 跑通第一案，仍需 Steam Deck/控制器实机手感验证。

验收：

- 不用鼠标也能从标题页打完第一案。
- 每个页面只有一个清楚的默认焦点。
- 选项、回看、重开、继续都能键盘操作。
- Steam Deck/控制器实机验证完成后，再把该项从 P0 移出。

### 内容包数据化

- 2026-07-02 复查结论：`content/packs/steam-demo-01/cases/*.json` 不能再做影子资产。试玩包四案已是运行时台词来源；未来新增 `metadata-only` 案件仍只能写策划压力包，`npm run verify:pack` 会阻止它们夹带运行时字段。
- 第一层故事包 manifest 已经由 `content/packs/steam-demo-01/` 生成运行时索引，构建和校验会检查索引是否过期。
- 第二层 loader 入口已经存在：如果某个 case JSON 标成 `runtime-loaded`，构建索引会校验完整字段并嵌入运行时，`caseEngine` 会用它覆盖模板字段。
- 当前 demo 包四案完整台词、追问、材料判定、最终收麦原话和结算已迁入内容包；`truthBoundary` 也随运行时 brief 输出，并已接到收麦回看的归位交互。
- 新增或替换一个故事包案子主要改 `content/packs/...`；`src/dailyChoices.js` 已只负责角色指向解析和通用兜底。`src/caseEngine.js` 里的日案模板仍支撑 daily 轮换，`src/app.js` 仍有少量渲染侧文案分支，后续要继续把日案和文案特判拆到数据层。
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
- 路由/语气推断规则已从 `caseEngine` 和旧存档迁移收口到 `routeLog.js`；剩余债务是模板校验和内容 QA 要继续复用同一套 route schema。
- 短期可继续迭代，但 Steam demo 前需要拆。

优先拆：

- `src/runtime/sceneAdvance.js` 已接管动作扣耐心、当前对话段落推进、材料检视推进、回流页面推进、收麦前守门和回流解锁；下一步只补缺口，不再把页面推进判断写回 `app.js`。
- 继续补强 `src/runtime/routeLog.js` / `src/runtime/routeMapModel.js`，故事集路线统计已走纯函数，后续只补新增路线轴。
- `src/runtime/recapModel.js` 已接管单案结算、事实边界、材料/原话故事集汇总和故事集终局评价；下一步只补缺口，不再把终局模型写回 `app.js`。
- `src/ui/renderSceneReview.js`
- `src/ui/renderRecap.js`
- `src/platform/saveStore.js` 已有 Web 抽象和桌面文件桥入口；`desktop/electron/preload.cjs` 已接同步文件存档 IPC，下一步接 Electron 依赖和打包器。

验收：

- UI 文案调整不需要碰状态推进。
- 路线图和结算逻辑能用纯函数测试。

## P1：玩法丰满度

P1 只承接“直播控场系统”，不再散成多个方向。当前顺序固定为：

1. 资料操作模型。
2. 现场压力模型。
3. 收麦回看模型。

### UI 和美术资产

2026-07-03 已完成一轮素材审查，详见 `docs/ui-art-asset-review.md`。

需要优先做：

- 已替换四案背景：信用卡/社保账单、理发表格/会员卡、资料核验桌、财务报销办公室。后续只做质量升级，不再回退到咖啡馆/酒廊/家宴旧方向。
- 已增加四个匿名来电人半卡通立绘，并通过内容包 `sequence.callerArt` 接入，不再只复用命名 NPC 约会/职场 archetype。
- 继续补紧张、停顿、防备、松动等表情差分，让连线动作不只靠文字气泡表现。
- 给每案补材料缩略图，让材料检视不只是一块文字板。
- 增加小型主播监看/麦控视觉，不做第二人上麦。

### 每案 20 分钟体量

当前每案已经有 5 段来电、材料检视、深问、原话收麦，但实际体量还偏精简。

需要补：

- 每案至少 2 份可读材料，其中 1 份进入“圈哪一处”玩法，另 1 份进入回看/复盘。
- 每案至少 1 个“来电人藏着自己的不利信息”的后半程揭示。
- 每案至少 1 个第三压力源：父母、朋友、老板、平台、介绍人、供应商、期限。
- 外围选项要有真实诱惑，不能只是弱答案。
- 这些要求已进入 `verify:pack` 的 `PACK-005`：runtime-loaded 案件至少 5 段来电、2 份可读材料、2600 字以上文本体量、来电人自我修剪和第三压力源。

验收：

- 快速通关第一案不少于 12 分钟。
- 正常读完材料和回看，每案目标 20 分钟。
- 玩家至少有一次“我刚才站早了”的体验。

### 材料检视继续增强

当前材料检视已经可玩，并开始按材料类型区分版式。

当前唯一进行中的玩法方向：现场压力模型。

- 已支持截图、账单、表格、审批流的基础差异版式；正确/误指反馈已开始牵动现场反应，并已接入现场压力模型第一层。
- 新增设计文档 `docs/host-investigation-loop.md`：把主播探索收束为后台核实、案后私信回流和有限线下问询，不做开放调查模拟。
- 已支持案后私信回流最小版；回流命中/误指已改变案间余味和弹幕压力。
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
- 事实边界归位已影响最终收话余味和故事集终局：放稳、放早、仍未归位，会得到不同边界标签和评论区反应。回流材料的命中/误指也已接进案间余味和弹幕压力，压力画像、材料圈点和原话选择已进入结算和终局路线画像。

验收：

- 玩家能记得那句原话出现过。
- 收麦回应不能超过两句。
- 不出现“正确答案 / 最佳答案 / 结论更锋利”等文字。

### 故事集整体感

当前已做案间过渡和故事包总结，但还需要更有“同一集节目”的感觉。

需要补：

- 每案收麦后带出下一案问题，但不能剧透目录。
- 故事包总结已回收每案物件，而不只是路线轴。
- 评论区审判墙要更像真实评论，不像功能说明。
- 失败/低揭示路线也要有完整余味，不要只像没通关。

验收：

- 第一案后能自然想进第二案。
- 终局能看出本包所有案件共享一个主题。
- 低分路线也能产出可分享的结果卡。

## P2：内容扩展

### 模板池扩容

运行时 daily 兜底模板仍是 5 个；内容生产池已经扩到 12 个压力系统种子，正式内容生产不再从空白开始。

目标：

- 内容生产池扩到至少 9-12 个不同 plot id。已完成，当前 12 个。
- 非婚恋至少占一半。已完成，当前 8 个非婚恋。
- 每个故事包内的案件题材不能同质化。

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
- 每个故事包先写主题，再按节奏选择案数和题材。

需要补：

- `docs/story-pack-development-pipeline.md`
- `content/intelligence/` 原始素材摘要目录。已新增 README 和 plot template pool；真实采风摘要后续继续进该目录，但不能含可反推原案的信息。
- 每案 `qa-report.md`：逻辑链、AI 味检查、价值观检查、事实边界。当前 demo 包已有 `content/packs/steam-demo-01/qa-report.md`，后续新包必须同样保留。

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
- `docs/story-pack-development-pipeline.md`：已新增，故事包从热点采风到上线的流程。
- `docs/content-pack-schema.md`：已补内容包 JSON 字段、runtime-loaded 嵌套结构、路线字段、校验规则和改包流程；后续随 schema 演进继续更新示例。
- `docs/desktop-steam-build-plan.md`：已新增，覆盖桌面壳、Windows portable、Steam Cloud、Steam Deck/Steam Input、签名和实机验包。
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

- 真实手柄流程测试：键盘和模拟 Gamepad API 已补 Playwright 级回放；仍缺 Steam Deck/控制器实机回放。
- 结果页/案间页截图对比。

## 当前建议顺序

1. 资料操作模型：把材料检视从文字三选一升级为可视化圈点数据结构。
2. 现场压力模型：第一层已接入，追问语气、材料误指和回流结果已开始共同影响听众耐心、连线人防备、弹幕跑偏。
3. 收麦回看模型：第一层已接入，结果页已回收材料圈点、原话选择和路线画像。
4. 再继续 P0 技术债：Electron 依赖/打包器、残余内容特判数据化、Steam Deck/控制器实机 QA。
5. 然后做桌面壳打包验收、真实浏览器键盘/手柄回放和内容包完整迁移。
6. 最后再做受控自由追问和 AI router。
