# 第 26 批·代码架构重构执行单(缓存戳根除 + app.js 拆分)

你是本仓库的实施工程师。判决来源:架构复审(2026-07-25)。本单只做**行为保持型**重构:任何一步都不得改变游戏可观察行为,每一步单独可提交、可回滚,且提交前 smoke 必须绿。**不改内容(`content/`)、不改台词、不改玩法数值。**

本单**不触碰** mutation/`innerHTML` 全量重渲模型——那是另一项高风险改造,须在 app.js 拆分之后单独立项。本单只做两件事:Phase 1 根除 `?v=` 缓存戳,Phase 2 把 app.js 从上帝对象拆成协调器。Phase 3 仅作决策项列出,不强制执行。

## 已核实的机制(重构依据,勿推翻)

- **dev-server** 对所有响应发 `Cache-Control: no-cache / no-store`(scripts/dev-server.js:42/69/77)→ 本地开发完全不需要 `?v=`。
- **build-playable** 打包时 `specifier.split("?")[0]` 剥掉 query(scripts/build-playable.js:69)→ 桌面/可玩构建根本不看 `?v=`。
- **build-static** 只是 `cp` 整个 `src/`(scripts/build-static.js:12)→ **`?v=` 只对这一条部署路径(静态网页托管)有缓存意义。**
- **Node 18 与浏览器 ESM** 解析时忽略 query 定位文件,但**把 query 计入模块缓存键**:同一文件被不同 `?v=` 引用会被实例化多份。当前 23 个版本并存 = 潜在的重复实例化隐患(现在因多为纯函数未暴露 bug)。
- 结论:`?v=` 是纯负债 + 潜在 footgun,唯一真实用途是静态网页缓存刷新——应在 build-static 时统一盖一个 token,而非手维护 128 处。

## Phase 0|基线护栏(先做,不改代码)

1. 跑三件套并确认全绿,记录为基线:
   ```
   npm run check
   npm run smoke:browser
   npm run smoke:desktop
   ```
2. **smoke:browser 是本次重构的唯一行为回归判据**(app.js 无直接单测,靠 Playwright 全流程回放兜底)。此后每一个提交都必须重跑 `npm run check && npm run smoke:browser`,红了就停、回滚、报告,不许带病前进。

---

## Phase 1|根除 `?v=` 缓存戳(机械、低风险、一个提交)

### 1.1 从所有源码 import 说明符中删除 `?v=…`

- 范围:`src/**/*.js` 的所有 `import ... from "...?v=x.x.x"` → 去掉 `?v=x.x.x`,保留纯路径。
- `index.html` 的 `<script type="module" src="./src/app.js?v=0.27.0">` → `./src/app.js`。
- `src/*.js` 里 `import "./styles.css?v=…"` 之类同样去版本。
- `scripts/**/*.js` 中所有 `from "../src/....js?v=…"` 也一并去版本(Node 现在靠忽略 query 才正常,去掉后语义不变且消除重复实例化)。
- 机械替换正则参考:`(\bfrom\s+["']\.{1,2}\/[^"']+?)\?v=[0-9.]+(["'])` → `$1$2`;`(<script[^>]+src="\.\/src\/app\.js)\?v=[0-9.]+"` → `$1"`。逐文件核对无残留:`rg -n '\?v=' src index.html scripts` 应为空。

### 1.2 build-static 统一盖一个 token(保住唯一需要缓存刷新的部署)

- 修改 `scripts/build-static.js`:`cp` 完 `src/` 到 `dist/` 后,新增一遍处理——对 dist 内所有 `.js` 的相对 import 说明符、以及 `dist/index.html` 的入口 script src,统一追加 `?v=<TOKEN>`。
- `<TOKEN>` 取值优先级:`process.env.BUILD_ID` → `package.json` 的 version + 短 git hash(`git rev-parse --short HEAD`,取不到则用时间戳)。全站同一个 token,不再 per-module。
- 只处理相对说明符(以 `.` 开头),不碰裸模块名。
- 实现要稳:用与 build-playable 同源的 import 正则匹配,只在说明符尾部注入 query,不改其余字符。

### 1.3 验收

- `npm run check`(含 `node --check` 全链 + verify-logic/verify-pack/verify-narrative)绿。
- `npm run smoke:browser` 绿、`npm run smoke:desktop` 绿。
- `npm run build:h5`(即 build-static)后,抽查 `dist/src/app.js` 的 import 与 `dist/index.html` 入口都带同一个 `?v=<TOKEN>`;抽查 `dist` 下同一被引用文件在不同引用点的 token 一致(消除重复实例化)。
- 提交:`refactor(build): stamp one cache token at static build, drop 128 hand-maintained ?v= strings`。

---

## Phase 2|拆分 app.js(上帝对象 → 协调器,分组增量,每组一个提交)

app.js 现 4086 行 / 228 个本地函数,违反本仓 coding-style.md 的 800 行上限。目标:抽出各屏 `render*` 及其绑定/挂载子函数到 `src/ui/screens/` 下的模块,app.js 退化为"状态初始化 + 事件接线 + ctx 构造 + render 分发 switch + 少量共享 helper",争取 **≤1200 行**。

### 2.0 硬约束(违反即打包失败,务必遵守)

**抽出的模块绝不允许 `import ... from "../app.js"` 或 `"../../app.js"`。** 原因:build-playable 的 `stripModuleSyntax` 把 `import {state} from '...'` 转成 `const state = state;`,若跨模块引用 app.js 的可变绑定会产生自引用 `const` → 运行时崩溃。因此:

**所有抽出的 render/bind/mount 函数必须改为接收一个 `ctx` 参数,通过 ctx 访问 app.js 的共享状态与能力;不得 import app.js 内部符号。** 抽出的模块只允许 import 现有的 `runtime/`、`ui/` 叶子模块和第三方无。

### 2.1 在 app.js 定义并冻结 ctx 契约

在 app.js 构造一个 ctx(渲染前构造一次,或每次 render 传入),字段至少覆盖被抽函数实际用到的共享面(按实抽函数据实增删,勿臆造):

```js
const ctx = {
  app,                          // 根节点
  getState: () => state,        // 读
  setScene: (s) => { state.scene = s; },  // 或更细的 mutate 帮手,按需
  saveState, render,            // 存档 / 触发重渲
  bind, bindChoiceActivation,   // 事件绑定
  queueDefaultFocus, preferredDefaultButton,
  playSfx, playAudioCueOnce, getAudioSettings,
  mountCurrentDialogue, mountMaterialPanel, syncSceneAudio,
  // …其余按被抽函数的实际依赖补齐
};
```

> 注意:被抽函数目前直接闭包读写模块级 `let state`。抽出后一律改成 `ctx.getState()` 读、通过明确的 mutate helper(或 `const s = ctx.getState(); s.x = …; ctx.saveState();`)写。**不改 mutation 语义本身**(仍是就地改 + saveState + render),只是把访问路径从闭包换成 ctx 参数——这样才能跨文件且过打包器。

### 2.2 分组抽取(每组独立提交,组间顺序无强依赖,但建议由简到繁)

将 `render*` 及其**专属**的 `bind*`/`renderXHelper` 子函数**成组整体搬迁**(一个 render 的调用子图必须随它一起走,不能半拆):

- **组 A** `src/ui/screens/overnightScreens.js`:renderOvernightHangup / OvernightPostLive / DayActOpening / DayMap / DayScene / DocumentDayScene / DocumentReconcile / OvernightCallback / CallbackOpener / CallbackOpenerBeat + 其专属 bind。
- **组 B** `src/ui/screens/interludeScreens.js`:renderInterludeDesk / AfterSceneEvidence / EvidenceCheck / Delegation / InvestigationBackflow + `bindEvidenceCheckButtons` / `bindInvestigationButtons`。
- **组 C** `src/ui/screens/sceneScreens.js`:renderSceneReview / SceneQuestionMenu / SceneQuestionAnswer / StanceSnapshot / HangupBeat / LiveCounterBeat / CallerQuestion / DeepFollowup + `bindSceneButtons`。
- **组 D** `src/ui/screens/recapScreens.js`:renderSolved / recap 流 / caseClosing / storyPackComplete / epilogueUnread / careChoice / caseOpen / nightShell 前后 / caseBridge / caseTitle。

每组做法:
1. 新建屏幕模块,把该组函数原样搬入,签名统一改为 `export function renderX(ctx, brief) { … }`;函数体内对 `state`/`render`/`bind`/`saveState`/`playSfx`/mount* 的引用全部改走 `ctx.*`。
2. app.js 删除已搬函数,在 `renderDailyCase()` 的分发处改为 `if (state.scene === "…") return renderX(ctx, brief);`,并 `import { renderX } from "./ui/screens/xxx.js";`。
3. 跑 `npm run check && npm run smoke:browser`。绿 → 提交 `refactor(app): extract <group> screens into ui/screens/*`。红 → 停,回滚该组,报告卡点。

### 2.3 收尾

- app.js 只剩:状态/meta 初始化、全局事件监听(click/keydown/gamepad)、ctx 构造、`render()`+`renderTitle()`+`renderDailyCase()` 分发、以及被多组共用的底层 helper(`bind`/`queueDefaultFocus`/`mount*` 等——这些留在 app.js 并进 ctx 暴露)。
- 目标行数 ≤1200;若仍超,把共用底层 helper 再抽到 `src/ui/screens/screenKit.js`,由 app.js import 后装进 ctx。
- 全量 `npm run check && npm run smoke:browser && npm run smoke:desktop` 绿。

---

## Phase 3|决策项(本单不执行,仅记录待定)

`src/generated/contentPackIndex.js`(9830 行构建产物)当前提交进 git。可选方案:改为 gitignore + 装机/构建时由 `content:index` 生成,消除巨型 diff。**代价**:改变贡献者与 CI 工作流(clone 后必须先 build 才能跑)。本单不动;留给用户决定后另出执行单。

---

## 全局铁律

1. 行为保持:不改任何游戏可观察输出;smoke:browser 是判据。
2. 每个提交独立可回滚,提交前必过 `check + smoke:browser`。
3. 不改 mutation 语义、不改 innerHTML 重渲模型、不改 `content/`、不改台词。
4. 不引入任何新的运行时依赖、不引入打包器/框架。
5. 不确定处停下报告,不自行扩大范围。
