# 工程结构收口执行单（2026-09-04）

> 依据：2026-09-04 对构建链、存档链、桌面壳与 CI 的通读 + 实测。
> 五张独立单，互不依赖，可分别执行、分别提交。**单 4 需要用户先拍板，不要自作主张执行。**
> 性质：**收口，不是重构。** 不改玩法、不改内容、不动 `ARCH-001/002/003` 已经锁住的屏幕模块架构。

## 先记住哪些已经是对的（不要"顺手优化"）

- `ARCH-001/002/003` 把「屏幕模块不许 import app.js」「memoized 工厂必须逐次 `ctx.getState()`」写成了测试。**这是 pass-28 的教训固化，任何改动不得让这三条失效。**
- `smoke:quick`（单路线，实测 25s）和 `[browser-smoke +22.4s] PASS route 1/1` 进度日志都已存在。**不要再"优化"smoke 的输出格式。**
- `.github/workflows/ci.yml`（Behavior Gate）已在 push/PR 跑 `test:pr`，超时与 Chromium 安装都配好了。
- 模板注入全部走 `escapeHtml`，抽查零破口。**不要引入新的裸模板插值。**
- `src/runtime/questionRewind.js` 的 `STATIC_STATE_KEYS` 是本仓库处理"静态案件内容不进快照"的**正确范式**，单 2 照它写。

---

# 单 1｜构建只拷游戏真正引用的资产（P0，先做这张）

## 现状（实测）

`assets/` 970MB，但游戏加载的只有约 12MB：

| 目录 | 体积 | 运行时加载 |
| --- | --- | --- |
| `assets/audio/unchanged` | 497M | 否（Udio 原始下载，含日志标记"淘汰"的样本） |
| `assets/audio/source` | 270M | 否（已 gitignore） |
| `assets/audio/review` | 109M | 否（已 gitignore） |
| `assets/generated/characters-key` | 8.8M | 否（已 gitignore） |
| `assets/generated/art-direction-v2-candidates` | 5.7M | 否（美术候选稿） |
| bgm+ambience+sfx+voice | 12M | **是**（`src/audioCatalog.js` 34 条 cue） |

而 [scripts/build-playable.js:14](scripts/build-playable.js#L14) 是 `copyTree(resolve(root, "assets"), …)` 整包拷；[scripts/build-desktop.js:18](scripts/build-desktop.js#L18) 再把整个 `dist/playable` 拷进 electron 目录；`desktop/electron-builder.json` 的 `files: ["**/*"]` 全打进 asar，还开着 `compression: "maximum"`（对已压缩的 wav 纯烧 CPU）。[scripts/build-static.js:16](scripts/build-static.js#L16) 同型。

**实测 `dist/playable` = 973MB。这是要发 Steam 的包。**

## 关键前提（已核实，可以放心用引用扫描）

全仓库**没有动态拼接的资产路径**——`rg '"\./assets/[^"]*\$\{|`\./assets/[^`]*\$\{'` 零命中。所有被引用的资产都以完整字符串字面量出现在三处之一：打包后的 bundle（`contentPackIndex.js` 已编译进去）、内联的 `styles.css`、`index.html`。**所以"扫描产物里的 `./assets/…` 字面量，只拷这些文件"是精确的，不会漏。**

## 改法

在 `scripts/build-playable.js` 里：

1. 先生成 `bundle` 和 `playableCss`（现有逻辑不动），**拼出 `html` 之后、写盘之前**，从 `html` 全文扫出所有 `./assets/...` 引用，去重成一个路径集合。
2. 把 `copyTree(assets)` 换成"按集合逐个 `copyFile`"。目录结构照原样建。
3. **加一道自检**：集合里任何一个路径在源 `assets/` 下不存在 → 抛错，构建失败。这条比少拷几 MB 重要得多——它把"资产引用写错"从运行时 404 提前成构建期报错。
4. 顺手删掉 [build-playable.js:15](scripts/build-playable.js#L15) 的 `copyTree(content)`：**全仓库没有任何 `fetch()`**，内容是编译进 `contentPackIndex.js` 的，`dist/playable/content`(948KB) 是死重。删之前再确认一次 `rg "fetch\(" src/` 为空。
5. `scripts/build-static.js:16` 用同一套逻辑（可把扫描+拷贝提成一个共享函数，放在 `scripts/` 下，两处都用）。

`build-desktop.js` 不用改——它拷的是已经瘦下来的 `dist/playable`。

## 边界

- **不要改 `audioCatalog.js`、不要改任何资产文件本身、不要删源 `assets/` 里的东西。** 这张单只改"构建时拷什么"。
- 不要用"排除列表"（`unchanged`/`source`/`review` 硬编码）代替引用扫描——排除列表下次加个新目录就会漏。扫描是自维护的。
- `assets/favicon.svg` 由 `index.html` 的 `<link rel="icon">` 引用，扫描会覆盖到；若发现有资产只被 `manifest`/图标配置间接引用而扫不到，**列出来报告，不要偷偷加白名单**。

## 验收

```
npm run build:playable && du -sh dist/playable dist/playable/assets
```
预期 `dist/playable` 从 973MB 降到 **50MB 以内**。然后：

```
npm run smoke:browser     # 全绿，一条路线都不能少
npm run smoke:desktop     # 桌面壳照样起得来
```

smoke 里任何一处图片/音频 404 都说明扫描漏了——**修扫描，不要退回整包拷**。

## 提交

`build: ship only the assets the game actually references`

---

# 单 2｜存档瘦身 + 删掉已死的内容迁移（P1）

## 现状（实测）

**（a）存档每次写 ~278KB 内容，而这些内容开机就被丢掉。**

[src/runtime/contentCase.js:97](src/runtime/contentCase.js#L97) `applyRuntimeCaseContent` 把 48 个内容字段整个 spread 进 brief。实测四案进入 `state.caseBriefs` 的内容 **217KB**；[src/app.js:355](src/app.js#L355) `caseBrief: caseBriefs[0]` 让第一案再被 `JSON.stringify` 一遍（JSON 没有引用），合计约 **278KB**。

但 [src/app.js:83](src/app.js#L83) 开机就调 `refreshSavedCaseContent`，用当前内容包**整体替换** `caseBriefs` 和 `caseBrief`（`STATE-002` 正是在测这件事）。**所以写进存档的每一句台词，读档时都被扔掉。**

`saveState()` 有 **143 个调用点**；桌面端每次都是同步 IPC + `fs.writeFileSync`。

**（b）`QUESTION_COPY_MIGRATIONS` 已经是死代码。**

[src/state.js:361](src/state.js#L361) 有 15 条逐句迁移表（`"你当时是不是先心疼他了？" → "你当时有没有起疑心？"`），`migrateOpeningDialogue` 里还硬编码着已删除的台词。它们迁移的是存档里的问句/答句文本——**开机即被 refresh 覆盖，一行都用不上**。

真正的危险不是浪费：**它看起来是活的**。下一轮改台词时，很自然会有人往里加第 16 条，为一个不存在的问题维护一张越来越长的表——而这个项目每周都在改台词。

## 改法

### (a) 存档只存进度，不存台本

照 [src/runtime/questionRewind.js:3](src/runtime/questionRewind.js#L3) 的 `STATIC_STATE_KEYS` 范式（那里已经因为同样的理由把 `caseBrief`/`caseBriefs` 排除在快照之外，见 `REWIND-001` 的测试名："without cloning static case content"）。

在 `src/state.js` 的 `saveStateSnapshot` 落盘前，把 `caseBriefs` 降成**存根**，只保留 `refreshSavedCaseContent` 重建时真正要读的键。**必须保留的键（已逐个核对 `savedContentRefresh.js`，少一个就重建不出来）：**

- `id`（`reconcileSavedOvernightProgress` 按它建 Map）
- `storyKey`、`weeklyKey`（refresh 读 `firstBrief.storyKey ?? firstBrief.weeklyKey`）
- `dailyKey`、`plotId`、`complainantId`、`respondentId`（daily 模式分支）
- `caseId`、`runtimeContentCaseId`（`runtimeCaseId` 回退链）
- `caseMode`

`caseBrief` 不单独持久化（`normalizeRuntimeState` 会用 `caseBriefs[chapter-1]` 补回来，见 `state.js:156`）。

存根构造放在 `state.js` 里，命名与 `questionRewind.js` 同族（例如 `SAVED_BRIEF_KEYS`），**不要写成一个 48 字段的排除表**——白名单，不是黑名单。

### (b) 删死迁移

删掉 `QUESTION_COPY_MIGRATIONS`、`migrateQuestionOptionCopy`、`migrateOpeningDialogue`，以及 `migrateSceneRouteAxes` 里**只改文案**的部分。

**保留**：`migrateCaseBrief` 的字段改名（`weekly*` → `story*`）——refresh 自己要读 `firstBrief.storyKey ?? firstBrief.weeklyKey`，这条链不能断；`RETIRED_INTERLUDE_CHOICES`、`RETIRED_DELEGATION_MATERIALS` 迁的是**玩家选择记录**不是台词，也保留。

`migrateSceneRouteAxes` 若还负责补 `routeAxis`：确认 refresh 后的新 brief 本来就带 `routeAxis`（`routeAxisForChoice` 在生成期就跑过）。**确认不了就先别删这一条，在交付里说明。**

## 边界

- **不要改 `refreshSavedCaseContent` 本身。** 它是对的。
- 不要动 `saveLoadError` / `content-refresh-failed` 的可见恢复态（`STATE-001B` 在守）。
- 不要为了瘦身牺牲"老存档还能继续"：改完必须能读**旧格式**（带全量 brief 的）存档——`normalizeRuntimeState` 里补一句"存根缺字段时从旧 brief 里取"即可，或依赖 refresh 本来就整体重建。**这一点必须有测试。**

## 验收

1. `npm run test:logic`：`STATE-001 / 001A / 001B / 002 / 002B / 003`、`REWIND-001` 全绿。
2. **新增两条测试**（缺一不可）：
   - 存档往返：满进度 state → `saveStateSnapshot` 序列化 → `parseStateSnapshot` → `refreshSavedCaseContent` → 断言台本内容完整回来了，且玩家进度（`sceneAnswers`/`contradictionLog`/`caseOvernights`）一字未丢。
   - 体积：序列化结果不含案件台词（例如断言不出现某句已知台词），且长度低于一个阈值（建议 30KB）。
3. `npm run smoke:browser` 全绿，尤其 `state-replacement` 和 `new-game` 相关路线。
4. 手测一次：开一局 → 推进到第二夜 → 刷新页面 → 进度和台词都在。

## 提交

- `perf(state): persist progress without the authored script`
- `refactor(state): drop save migrations for copy the loader already refreshes`

---

# 单 3｜桌面写盘护栏 + 渲染进程兜底（P1）

## 现状

护栏装在了风险最低的一侧：

- **浏览器路径有**：`src/platformRuntime.js` 的 `browserStorage.set` 有 try/catch，注释写着"embedded browsers 可能禁存储，保证游戏能继续"。
- **桌面路径全程裸奔**：`desktop/electron/preload.cjs` 的 `sendSync` → [desktop/electron/main.cjs:142](desktop/electron/main.cjs#L142) `ipcMain.on(CHANNELS.write)` **无 try/catch** → [desktop/electron/main.cjs:59](desktop/electron/main.cjs#L59) `writeSave` 直接 `fs.writeFileSync`。

磁盘满、杀毒软件占用、OneDrive 锁 `%APPDATA%`、只读目录，都会抛。主进程 handler 抛了 → `event.returnValue` 不被赋值 → 渲染进程卡在同步 IPC 上。而渲染进程**没有 `window.onerror`**（只有主进程有 `uncaughtException` 写崩溃日志）。

`saveState()` 有 143 个调用点。Windows 便携版正是要发的形态。

## 改法

1. `main.cjs` 五个 `ipcMain.on` handler 全部包 try/catch，失败时 `event.returnValue = null`（read/list/export）或 `false`（write/remove），并复用现有的 `writeCrashLog` 记一条。**永远要给 `returnValue` 赋值**——否则渲染进程挂死，这比存档失败严重得多。
2. `src/platform/saveStore.js` 的 `createFileSaveBackend`：`write` 检查返回值，失败时**返回 false 而不是抛**，与 `browserStorage` 行为对齐。
3. `src/state.js` 的 `saveStateSnapshot`：拿到失败结果时，在 state 上落一个可见标志（复用 `saveLoadError` 那套机制，值用 `save-write-failed`），让标题栏/暂停页能提示"本次进度没能写入存档"。**不要静默吞掉**——那是另一种坏。
4. 渲染进程加一个 `window.addEventListener("error", …)` / `unhandledrejection` 兜底：把错误写进桌面崩溃日志通道（`platformRuntime.postMessage` 已有），并**保证屏幕上至少留下一句可读的提示**，而不是半渲染的死界面。

## 边界

- 不要改同步 IPC 为异步（那会牵动 143 个调用点的时序，风险远大于收益）。**这张单只补护栏，不改架构。**
- 不要加自动重试循环——磁盘满的时候重试只会卡得更久。
- 不要动 `PLATFORM-001/002` 已经断言的桥接形状。

## 验收

1. `npm run test:logic`（`PLATFORM-001/002` 绿）、`npm run smoke:desktop` 绿。
2. **新增测试**：给 `createSaveStore` 注入一个 `write` 必抛的 `saveFiles`，断言 `write` 返回 false 且不抛、断言游戏状态里出现 `save-write-failed`。
3. 人工验一次（可选但强烈建议）：把存档目录设成只读，启动桌面版，确认**能继续玩**且有可见提示，不是白屏或卡死。

## 提交

`fix(desktop): keep the game alive when the save file cannot be written`

---

# 单 4｜仓库瘦身（P0，**需要用户先选档，不要自行执行**）

## 现状

`.git` = **745MB**。`assets/audio/unchanged/` **没有进 .gitignore**，21 个原始 Udio wav 已被 commit，每个约 24MB。git 里最大的对象前 12 名全是它们。

对照 `docs/bgm-generation-log.md`，其中多个是日志自己标记**淘汰**的样本：`63715782-…`（曲7 v1B「噪、乱，全部淘汰」）、`5c95284e-…`（曲8 v3A「太燥，淘汰」）、`e6c431e7-…`（曲8 v3B「第二兜底」）。

后果：`git clone` 拉 745MB；CI 每次 `actions/checkout` 都付这个钱。

## A 档｜止血（安全，随时可做）

1. `.gitignore` 增 `assets/audio/unchanged/`。
2. `git rm --cached -r assets/audio/unchanged` —— **只从索引移除，本地文件保留**。
3. 母版另行归档（外置硬盘 / 对象存储 / Git LFS），在 `docs/bgm-generation-log.md` 顶部写清母版现在放哪、怎么取回。**不要因为"仓库里没有了"就删本地文件**——那是不可再生的 Udio 输出。
4. 这一档**不改历史**：clone 体积照旧 745MB，但不再增长，且单 1 之后构建也不会再打包它们。

## B 档｜彻底清（破坏性，**必须用户明确点头才做**）

`git filter-repo` 把 `assets/audio/unchanged/` 从全部历史抹掉，`.git` 预期降到 250MB 以下。

代价，先说清楚：
- **所有已有 clone 全部失效**，必须重新 clone。
- 所有 commit hash 改变；已推的分支、PR、以及 changelog / 执行单里引用过的 commit hash（例如 `cbac2537`、`92f21525`、`27e9df00`）**全部对不上**。
- 需要 force-push，远端如有保护分支要先解锁。

**不要替用户做这个决定，也不要"先做 A 档顺便做了 B 档"。** 用户没有明确说做 B 档，就只做 A 档，并在交付里把 B 档的代价原样列出来等回复。

## 验收

A 档：`git ls-files assets/audio/unchanged | wc -l` 为 0；本地文件仍在；`npm run check` 绿（注意 `verify:audio` 读的是 `bgm-production.json` 和 `audio/voice/*.json`，不读 `unchanged/`，但还是跑一遍确认）。

## 提交

`chore(repo): stop tracking raw Udio masters`

---

# 单 5｜杂项（P2，可合成一个提交）

按性价比排，做不完就按顺序停：

1. **`engines.node`**：`package.json` 加 `"engines": { "node": ">=22.12.0" }`，并加 `.nvmrc` 写 `22.12.0`。现在 Node 版本只钉在 CI 的 workflow 里，本地无约束。
2. **`output/` 进 .gitignore**：目录存在但没有跟踪文件，属于漏配。
3. **`electron-builder.json` 的 `compression`**：单 1 之后包里几乎没有大体积不可压缩文件了，`"maximum"` 可保留；但若打包时间仍长，降到 `"normal"` 的收益/代价比更好。**先测再改，不要盲调。**
4. **超长文件**：`src/ui/screens/sceneScreens.js` 1311 行、`recapScreens.js` 1112 行，超 800 行上限。sceneScreens 已经是 17 个导出的门面，自然的切法是把「证词墙 + 决定性 PRESENT」那组（`renderTestimonyPrelude` / `renderTestimonyWall` / `renderTestimonyMaterials` / `renderDecisivePresentTarget` / `renderDecisivePresentHit`）抽成 `testimonyWallScreens.js`，走和 `overnightDocumentScreens.js` 完全一样的 `(ctx, callbacks)` 工厂形状。**抽完 `ARCH-001/002/003` 必须仍绿**，并把新模块加进 `ARCH-003` 的清单。
5. **smoke 并行（可选）**：`smoke-browser-replay.js` 已有 11 个命名子目标，但 `routes[1..11]` 没有对应子目标。若要并行，做法是加 `--route=<name>` 参数，然后在 `ci.yml` 用 `strategy.matrix` 分片跑——**不要改成 worker 池**，那会动到 12 条路线的共享浏览器状态。实测单路线 22s、全量约 5-6 分钟，目前 CI 20 分钟预算够用，**这条不急，除非 CI 开始超时**。

## 提交

`chore: pin node version and tidy build config`（1-3）
`refactor(ui): split the testimony wall out of sceneScreens`（4，单独提交）

---

# 通用铁律（五张单都适用）

1. **一次一张单，一张单一次提交。** 不要把构建改动和存档改动混在一个 diff 里。
2. 每张单收尾跑 `npm run check && npm run smoke:browser`；改了桌面壳再加 `npm run smoke:desktop`。
3. 测试若因旧断言失败：**先判断是不是断言本身过时**。断言过时就改断言并在交付里说明理由；**不许删断言，也不许把实现改回去迁就断言**。
4. `ARCH-001/002/003`、`STATE-001B`、`PLATFORM-001/002`、`REWIND-001` 是架构护栏，**任何一条变红都必须停下来报告**，不要自行放宽。
5. 发现本单没点名的问题：**列进交付，不要顺手改**。

# 交付只报这些

- 做了哪几张单，每张单改了哪些文件
- 单 1：`dist/playable` 前后体积；扫描是否报出过缺失资产
- 单 2：存根保留了哪些键；序列化后体积；新增的两条测试怎么写的
- 单 3：新增测试如何模拟写盘失败
- 单 4：只做了 A 档（除非用户明确要 B 档）；B 档代价原样转述等回复
- 跑了哪些测试、是否全绿；有没有改过任何断言，改了哪条、为什么
- 本单外发现的问题，单列

不要写"已全面优化"。不要重构没点名的模块。
