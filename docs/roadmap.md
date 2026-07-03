# 版本路线

## 当前方向：章节式案件包

产品已经从多模式故事游戏转向更适合 Steam 的“章节式案件包”。玩法参考《逆转裁判》的章节结构：一次发版是一组有共同主题和递进关系的案件，但不固定必须四案。当前 Steam demo 包暂定四案，约八十到一百分钟；每案仍然是一通匿名来电、若干接话分支、材料检视、原话挑句、来电回看、结果分享。`daily` 保留为单案兼容入口和内容生产单元。

未完成项目总入口见 [unfinished-backlog.md](unfinished-backlog.md)。每轮大改前先对照该文件，避免只根据聊天记录继续堆功能。

当前唯一优化主线是“直播控场系统”：玩家作为主播，在听众耐心、连线人防备和材料缺口之间做选择。竞品学习、昨天的内容包骨架和路线运行时拆分，都只作为这条主线的支撑，不同时开 AI 问答、桌面壳和大规模新剧情。

已完成：

- 首页和入口收敛为“Steam demo 案件包”，不提前暴露目录。
- 默认入口生成 `episode` 案件包，显式 `mode=daily` 仍可进入单案。
- 案件包使用 `storyKey` 稳定生成，旧 `weeklyKey` 只做兼容；单案仍支持 UTC+8 `dailyKey`。
- `caseModes.js` 支持 `episode` 与 `daily`，未知模式默认回到 `episode`。
- 删除故事模式入口、旧视图模块和长线章节常量。
- 单人连线规则写入设计文档：直播间只和咨询者对话，另一方只能通过转述、截图、录音或后续补充出现。
- 结果卡加入玩家类型、问题揭示率、所选原话和今日瓜点；最终原话只决定结果角度，不再一票否决核心问题揭示。
- 后台路线图已加入：每次追问记录路线轴和语气倾向，例如来电人可信度线、材料缺口线、钱流结构线。
- 试玩主线已调整为 8 万信用卡周转、理发店排班表、存款证明、职场报销截图，降低婚恋题材占比。
- 首个内容包骨架已拆到 `content/packs/steam-demo-01/`，并新增 `npm run verify:pack` 校验内容包与运行时故事包定义一致。
- `episode` 已开始支持可变案数：当前 demo 包是四案，但存档迁移、包校验和生成器不再把 4 当成引擎规则。
- 内容包 manifest 元数据已生成到 `src/generated/contentPackIndex.js` 并由运行时读取；`src/storyPacks.js` 不再手写 demo 包镜像。
- 完整案件 JSON loader 入口已接入：`CONTENT_CASES` 会记录每案 `runtimeContentStatus`；试玩包四案已切到 `runtime-loaded` 并由内容包覆盖模板字段。
- 任务画像已进入 runtime-loaded 内容包：四案的 `taskProfile` 会随 JSON 覆盖 brief，减少 `caseEngine.js` 的 `plotId` 文案表职责。
- daily 模式已接入同一内容源：已迁移的试玩案按 `plotId` 复用 runtime-loaded JSON，旧模板只作为未迁移轮换案兜底。
- 案间物件名和下一案桥接句已从 manifest `sequence.objectLabel/bridge` 进入运行时，减少 `app.js` 的 `plotId` 文案映射。
- 案间上一通收束句已迁入每案 JSON 的 `storyInterludeRecap`，`app.js` 不再按 `plotId` 维护这组文案。
- 案件背景 class 已从 `app.js` 的 `plotId` 映射迁入日案定义和 manifest `sequence.backdropClass`。
- 存款证明案的特殊结算分支已迁入内容 JSON 的 `conclusionWhenCleared/conclusionBranches`，分享卡也改回读取 `dailyShare*` 字段。
- 存档已拆出 `src/platform/saveStore.js`：Web 保持单槽 localStorage，桌面壳可通过 `platformRuntime.saveFiles` 接文件存档和 Steam Cloud 导出。
- 路线轴、路线语气和路线画像已拆到 `src/runtime/routeLog.js`，`caseEngine` 不再维护第二套路线推断。
- 每案加入材料检视节点，玩家要指出账单、截图、表格或审批图里的具体缺口；关键追问和材料命中不扣听众忍耐，外围绕问或误指材料才扣。
- 材料检视已升级为材料板内圈点：玩家在文件行、候选圈点和命中/误指圈痕之间完成动作，不再只是读文字后点普通选项。
- 材料板已按账单、表格、截图、审批流切换不同版式，让资料操作更像直播间后台动作。
- 主播探索与证据回流已形成设计边界：后台核实、案后私信和有限线下问询只扩大证据来源，不改成开放调查或 AI 生成事实。
- 案后私信回流最小版已接入：玩家收麦后可看到由已发现矛盾触发的固定补充材料，路线图以“回”记录。
- 回流材料命中/误指已影响案间余味和现场弹幕反应：圈中会让后台私信补强前文缺口，误指会让弹幕跑散。
- 现场压力模型第一层已拆成纯函数：听众耐心、弹幕跑偏/压住、连线人防备和人物表情钩子开始读取同一份压力画像；追问语气和材料命中/误指也开始从这里生成现场反应，并已进入单案结算和故事集终局。
- 现场压力表演数据已进入内容包：`sceneVersions[].pressureHint` 控制弹幕短钩子、来电人防备和微表情，运行时不再用案件台词正则判断这些状态。
- 现场防备已开始影响回答：如果上一拍把麦带散，下一拍可以切到内容包写好的 `guardedAnswer`，压力不再只是弹幕/表情表现。
- 中途弹幕开始按路线轴反应：内容包 `routeAxisComments` 会根据玩家最近一次追问/材料轴插入短弹幕，避免直播现场只剩通用短语。
- 职场案已用两份材料检视拉开机制形状：审批图之后还要看供应商报价和返款入口，流程案不再完全照前三案的一材料节奏。
- 事实边界已进入收麦回看：每案会要求玩家把多句话一次性归到“能确认 / 被修剪 / 今晚定不了”，放完即可继续，错放不当场纠正。
- 事实边界已进入故事集终局：四案归位是否放稳、是否放早，会影响终局边界标签、分享卡和评论区审判墙。
- 故事包难度曲线已接入 manifest：每案 `difficultyProfile` 可调整听众耐心预算和事实边界题量，后段案件能更紧而不用在运行时代码写案名分支。
- 案件包完成后生成试玩总结，汇总每案路线、平均揭示率和主播倾向。
- 故事集终局已回收路线画像、现场压力、事实边界、材料圈点和收麦原话，不再只看揭示率。
- 故事集终局评价模型已从 `app.js` 拆到 `src/runtime/recapModel.js`：主题、路线画像、评论墙、分享标题和收麦余味都能纯函数测试。
- 故事集终局 profile 收集已拆到 `src/runtime/storyPackSummaryModel.js`：事实边界、现场压力、材料圈点、原话、物件和评论墙由纯模型汇总，`app.js` 只提供存档选择器。
- 对话段落推进已从 `renderSceneReview` 抽成 `src/runtime/sceneAdvance.js` 的 `sceneReviewModel`，最后一段去材料、深入追问还是原话选择都能纯函数测试。
- 材料检视和后台私信回流推进也已拆到 `src/runtime/sceneAdvance.js`，当前材料、未处理回流和下一步按钮不再由 `app.js` 临时判断。
- 直播 HUD/弹幕/来电人立绘 HTML 已拆到 `src/ui/liveCallView.js`，并有单元断言覆盖；`app.js` 继续收状态，UI 细节开始脱离 god file。
- 直播主舞台和控场台外壳已拆到 `src/ui/liveFrameView.js`，topbar、control deck 和 `live-console-shell` 可由纯 UI 模块测试。
- 通用通话气泡、流程按钮组和上一段回看已拆到 `src/ui/callFlowView.js`，直播文本通用 DOM 不再散在 `app.js`。
- 案间过渡文案模型已拆到 `src/runtime/storyInterludeModel.js`，上一通收束、下一通物件名和桥接句不再作为纯文本判断留在 `app.js`。
- 标题页 HTML 已拆到 `src/ui/titleView.js`，直播信号、热线 hook 和不剧透目录都有纯 UI 断言。
- 对话回合 HTML 已拆到 `src/ui/sceneReviewView.js`，当前/已完成对话正文、追问气泡组装和继续按钮都有纯 UI 断言。
- 单案收麦回看 HTML 已拆到 `src/ui/recapView.js`，事实边界归位、最终原话对比、回看页面组和分页/按钮 flow 都有纯 UI 断言。
- 路线图 HTML 已拆到 `src/ui/routeTrailView.js`，普通追问、材料圈点和私信回流仍复用 `routeTrailModel`，避免 recap UI 继续长在 `app.js`。
- 今日单案结果卡已拆到 `src/ui/dailyCompleteView.js`，结果卡 HTML、复制按钮和复制文案都有纯 UI 断言。
- 案间过渡 HTML 已拆到 `src/ui/storyInterludeView.js`，上一通余味、下一通物件和接麦按钮都有纯 UI 断言。
- 故事集终局 HTML 已拆到 `src/ui/storyPackCompleteView.js`，结果卡、评论区审判墙和复制文案都有纯 UI 断言。
- 本集主题已接入生成数据和 UI，总结页会展示主题论点。
- 评论区审判墙已接入故事集总结，会根据玩家路线、揭示率和本集主题生成复盘评论。
- 桌面键盘底座已接入：默认焦点、方向键 / WASD、Enter / Space 和 Esc 能支撑无鼠标游玩。
- 基础手柄和回看快捷键已接入：Tab 切换当前回看面板，十字键/左摇杆移动焦点，A 确认，B 返回，Y 切换回看/复盘入口；后续还要上 Steam Deck/控制器实测手感。
- 输入导航规则已拆到 `src/runtime/inputNavigation.js`：键盘意图、焦点循环和摇杆方向/冷却都有纯函数测试。
- Electron 桌面壳源码已落到 `desktop/electron/`，`build:desktop` 会生成 `dist/desktop-electron`，并通过 preload 暴露文件存档桥；已补 `package:win`、electron-builder portable 配置、窗口状态、全屏/缩放快捷键、崩溃日志和单实例锁，安装器/签名和实机验包仍未完成。
- 桌面 staging 构建已收口到同一个带锁脚本：`build:desktop` 会生成 playable 和 desktop staging，临时目录替换避免并发构建互踩。
- `verify:pack -- <pack-id>` 已支持指定内容包，并新增 `PACK-005` 运行时嵌套结构校验。
- Playwright 浏览器回放 smoke 已接入：`smoke:browser` 用离线 playable 跑 perfect、outer、material-miss、keyboard-perfect 和 gamepad-perfect 五条单案路线，并能捕获离线 bundler alias、后台回流页、键盘/手柄焦点这类运行时错误。
- 手机端主流程保留视觉人物层，并显示核心问题/追问进度。
- 增加 unit test 和 narrative flow 验证，覆盖当前 demo 包、日案兼容、UTC+8、匿名来电、单人来电、戏剧灰区、无废选项、存款证明逻辑链、路线图字段和非婚恋公共事件模板。

下一步优先级：

- 只推进一条玩法主线：继续打磨资料操作模型，让圈点反馈、证据回流、回看记录更像直播间后台动作。
- 资料操作、现场压力和收麦回看第一层已稳定；下一步按技术债支撑顺序推进：补桌面依赖/打包和真实手柄设备 QA；残余内容特判继续数据化。
- 内容包管线仍是 P0 架构债：manifest 和 loader 入口已接运行时生成索引，试玩包四案已从 JSON 读取完整内容，事实边界、最终收麦原话、评论种子和运行时 schema 校验已进入内容包。下一步把故事集余味和残余 `plotId` 文案特判继续数据化。
- AI 只保留为后期受控 intent router，不进入当前实现队列。
