# Steam 商品级架构审查

审查日期：2026-06-30

## 结论

当前工程已经适合做玩法验证和 H5 试玩串读，但还不是 Steam 商品级架构。它现在更像一个“可运行的静态互动叙事原型”：内容生成、渲染、存档、平台桥接和测试都已经有雏形；但要按 Steam 首发试玩上线，需要先补一层桌面产品架构，而不是继续在 `src/app.js` 里加功能。

优先级应该是：

1. 先确立一个玩法主线：直播控场系统。
2. 拆内容包和运行层，为控场系统提供可测数据。
3. 做资料操作模型，而不是同时做 AI、桌面壳和新剧情。
4. 控场系统稳定后，再做桌面壳、存档和输入标准。
5. 最后再接 AI 自由追问实验。

AI 可以接，但不能让 AI 直接生成事实和分支。Steam demo 的核心体验必须是可测、可回放、可复盘的确定性剧情。

## 当前不重叠原则

竞品《On Air! Taxi Detective Casebook DEMO》证明“职业场景包装 + 对话推理 + 场内压力”在 Steam 上成立。它的参考价值不是让本项目转向出租车、AI 身份或多线职业模拟，而是提醒我们把直播间职业场景做成系统。

因此当前只做一条路线：

```text
直播控场系统
-> 资料操作模型
-> 现场压力模型
-> 收麦回看模型
```

桌面壳、AI 问答、新故事扩写都排在这条路线之后。每轮优化如果不能明确落在上面三层之一，就先不做。

## 当前工程优点

- `episode` 已经成为默认主模式，方向是章节式案件包；当前 demo 是四案，但架构不应依赖四案。
- `caseModes.js` 把案件包和单案兼容入口分开，后续能继续收敛。
- `platformRuntime.js` 已经开始抽象 Steam / 微信 / Web 的平台差异。
- `verify-logic.js` 和 `verify-narrative-flow.js` 已经覆盖剧情结构、匿名规则、无废选项、路线轴、事实链等关键规则。
- `docs/weekly-livestream-design-bible.md` 已经把案件包、价值观、玩法循环、内容生产管线写清楚。
- 现在的静态构建可以离线跑，符合 Steam demo 需要稳定可复现的基本方向。

## Steam 标准下的主要缺口

### 1. 内容和代码仍然绑在一起

问题：

- `src/caseEngine.js` 仍然承担大量内容模板和生成逻辑。
- 内容包还没有落到 `content/packs/<pack-id>/`。
- 未来每次发章节式案件包时，改内容会碰运行时代码，风险太高。

建议结构：

```text
content/
  packs/
    steam-demo-01/
      manifest.json
      cases/
        01-face.json
        02-family.json
        03-condition.json
        04-responsibility.json
      comments.json
      route-archetypes.json
      qa-report.json
src/
  content/
    packLoader.js
    validators.js
```

Steam demo 应该锁定一个 pack id，例如 `steam-demo-01`。正式版每次发版增加新 pack，旧 pack 进入 archive。

### 2. `app.js` 已经过大

现状：

- `src/app.js` 超过 1500 行。
- 渲染、事件绑定、状态推进、复盘计算、分享、故事集总结都混在一个文件。

建议拆分：

```text
src/runtime/
  gameSession.js
  sceneAdvance.js
  routeLog.js
  recapModel.js
src/ui/
  renderTitle.js
  renderCaseOpen.js
  renderSceneReview.js
  renderRecap.js
  renderStoryComplete.js
  bindEvents.js
src/platform/
  saveStore.js
  steamRuntime.js
  webRuntime.js
```

拆分目标不是炫技，而是让每次剧情/UI修改不碰整局推进逻辑。

### 3. 存档还只是浏览器单槽

现状：

- `activeSaveSlot()` 固定返回 `slot1`。
- 存档写在 `localStorage`。
- 没有显式版本号、内容包 id、最近关键选择指针、回看游标。

Steam 版建议：

```json
{
  "schemaVersion": 2,
  "buildId": "0.2.0-demo",
  "packId": "steam-demo-01",
  "slotId": "slot1",
  "chapter": 2,
  "scene": "sceneReview",
  "lastCriticalChoice": {
    "caseId": "education-income-fake-profile",
    "sceneIndex": 3
  },
  "routeChoiceLog": {},
  "settings": {}
}
```

平台层需要提供：

- `platformRuntime.saveFiles.read(key)`
- `platformRuntime.saveFiles.write(key, payload)`
- `platformRuntime.saveFiles.remove(key)`
- `platformRuntime.saveFiles.list()`
- `platformRuntime.saveFiles.exportForCloud(keys)`
- 游戏运行时继续通过 `saveStore.read/write/removeMany/list/exportForCloud` 调用，不直接碰文件系统。

Web 可以继续用 `localStorage`，Steam 桌面壳应该写文件，以便接 Steam Cloud。

### 4. Steam 壳已有源码骨架，并已有 Windows portable 打包入口

`package.json` 里的 `build:steam` 现在指向 `build:desktop`。`build:desktop` 会先生成离线 playable，再生成 `dist/desktop-electron`，其中包含 Electron 主进程、preload 和桌面壳 `package.json`。

`package:win` 会在安装 devDependencies 后调用 `electron-builder --win portable --config desktop/electron-builder.json`，把 `dist/desktop-electron` 打成 Windows portable，输出到 `dist/steam`。当前锁定 Electron 43，打包环境需要 Node 22.12 或更高版本。没有把这个步骤并入 `build:steam`，是为了让离线 staging 构建不依赖网络安装和本机打包环境。

当前桌面壳结构：

```text
desktop/
  electron-builder.json
  electron/
    main.cjs
    preload.cjs
dist/
  desktop-electron/
    main.cjs
    preload.cjs
    package.json
    playable/
```

已经具备：

- 窗口启动离线 playable。
- preload 暴露 `livestreamDetectiveDesktop.saveFiles`。
- 主进程把存档写入 `app.getPath("userData")/saves`。
- 根 `package.json` 声明 Electron / electron-builder devDependencies。
- Windows portable 打包配置，输入 `dist/desktop-electron`，输出 `dist/steam`。
- 桌面窗口状态保存到 `desktop-settings.json`，支持 F11 / Alt+Enter 全屏、Ctrl+0/加减号缩放。
- 主进程和渲染进程异常写入 `app.getPath("userData")/crash-logs`。
- 单实例锁，避免多个桌面实例同时抢同一份存档。

仍需补齐：

- Steam overlay 兼容。
- 成就和统计。
- Steam Cloud 文件映射。
- Steam Deck/手柄实机输入 QA。
- Windows 打包实机验收、安装器和签名。

### 5. 输入标准还没有按 Steam Deck / 手柄设计

当前 UI 更偏手机点击。

Steam 试玩应额外支持：

- 方向键 / WASD 切换选项。
- Enter / Space 确认。
- Esc / B 返回。
- Tab 打开回看。
- 手柄十字键 / 左摇杆导航。
- A 确认，B 返回，Y 回看。

UI 上要有 focus ring，并保证每个页面都有唯一默认焦点。

### 6. 回看系统应该变成运行时能力

现在回看逻辑主要依附在页面渲染里。按当前设计规则：

- 第一次关键选择前只能回到开头。
- 后续只能看上一次关键选择之后。
- 对话每屏最多两个来回。

这应该落到 `runtime/replayWindow.js`，由状态层提供：

```text
getReplayWindow(caseId, currentSceneIndex, lastCriticalChoice)
```

UI 只负责展示，不自己判断能看哪里。

### 7. 构建缺少 Steam 发版检查

建议增加：

```bash
npm run check
npm run build:h5
npm run build:playable
npm run build:steam
npm run build:desktop
npm run smoke:desktop
npm run verify:pack steam-demo-01
```

`build:playable` 生成 `dist/playable/index.html`，用于不依赖本地端口的试玩验证；`build:desktop` 生成 `dist/desktop-electron`；`build:steam` 当前指向桌面壳构建；`package:win` 在 Node 22.12+ 和 devDependencies 就绪后生成 Windows portable。下一步是补 `smoke:desktop`、实机验包和 Steam Cloud/overlay 检查。

`verify:pack` 应检查：

- 每案 5-6 个 beat。
- 每段只有一个关键选择能推进。
- 每段可选询问和关键追问区分明确。
- 每个关键选择有 `routeAxis` 和 `routeTone`。
- 每案有 caller hidden stake。
- 每案有 dramatic object。
- 最终原话来自前文。
- 案件包有起承转合或等价的章节递进桥接，不限定必须四案。

## 官方资料约束

- Steam demo 应作为独立应用配置，有自己的 App ID、商店配置和构建管理；不要把 demo 当成主游戏的一个菜单页来临时拼。参考 Steamworks demo 文档：https://partner.steamgames.com/doc/store/application/demos
- Steam 内容发布应按 depot/build 管理。内容包数据化后更容易把试玩、正式版和后续故事集拆到不同构建节奏里。参考 Steamworks depots 文档：https://partner.steamgames.com/doc/store/application/depots
- 存档如果要同步到玩家设备，应提前按 Steam Cloud 的文件模型设计，而不是后期从 `localStorage` 硬迁。参考 Steam Cloud 文档：https://partner.steamgames.com/doc/features/cloud
- Steam Deck / 控制器体验需要把键鼠、手柄、焦点导航作为一等输入。参考 Steam Input 文档：https://partner.steamgames.com/doc/features/steam_controller

## 建议改造顺序

### 阶段 A：先不动玩法，整理架构

- 新建 `src/runtime/`，把推进、路线记录、复盘计算从 `app.js` 拆出。
- 新建 `src/ui/`，把页面渲染拆出。
- 新建 `src/platform/saveStore.js`，统一 Web/Steam 存档接口。
- 保持现有测试通过。

### 阶段 B：内容包落地

- 新建 `content/packs/steam-demo-01/manifest.json`。
- 把当前 demo 包案件从 `caseEngine.js` 抽成 JSON；loader 必须支持非四案包。
- `caseEngine.js` 只负责兼容旧 daily 和加载 pack。
- 给 pack 加独立校验脚本。

### 阶段 C：Steam 桌面壳

- Electron 壳源码已经建立，当前静态 H5 结构先用 Electron 快速验证。
- `platformRuntime` 已接桌面 preload bridge，并暴露 `saveFiles`。
- 存档通过 `saveFiles` 写文件，Web 继续用 `localStorage` fallback。
- `build:desktop` 已建立 Steam demo 桌面构建目录；下一步接 Electron 依赖和打包器。

### 阶段 D：输入和 QA

- 加键盘/手柄导航。
- 所有按钮支持 focus。
- 做 720p、1080p、Steam Deck 分辨率截图检查。
- 做一遍完整故事集自动回放。

### 阶段 E：AI 问答实验

AI 只作为“自然语言追问路由器”和“内部编剧工具”，不要作为发售版剧情事实生成器。
