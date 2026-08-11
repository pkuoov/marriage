# 执行单·结构重构(抽 quick 屏幕 + 对白去重 + 死代码清扫)

你是本仓库的实施工程师。判决来源:代码/结构复审(2026-08-11)。**纯行为保持型**重构:不改游戏可观察行为,每步单独可提交、可回滚,提交前 smoke 必绿。核心架构(状态安全、日间屏幕 ctx 工厂)是好的且完好;本单治"新功能没按纪律走导致的回潮"。

## 铁律(与历次重构一致)

1. 行为保持:不改任何游戏可观察输出;`smoke:browser` 是唯一行为判据,每个提交都要 `npm run check && npm run smoke:browser` 绿。
2. **打包器约束**:抽出的屏幕模块**绝不 import app.js 内部符号**(build-playable 会把 `import{x}` 转成 `const x=x;` 自引用崩溃)。所有共享状态/能力经 **ctx 参数**传入;屏幕里**用时读 `ctx.getState()`**,不在工厂顶部捕获(守 pass-28 状态安全)。
3. 不改内容(`content/`)、不改 mutation 语义、不改事实层。
4. 不引入新运行时依赖/打包器/框架。
5. 先跑基线:`npm run check && npm run smoke:browser && npm run smoke:desktop` 全绿,记为基线,再动手。

---

## Part A|把 quick-detective 抽进屏幕模块(治 app.js 回潮,最高优先)

app.js 已涨回 2072,主因是评论区快案内联在 app.js。把这 7 个函数搬进新模块 `src/ui/screens/quickDetectiveScreens.js`,照日间屏幕的 `createXScreens(ctx)` 工厂模式:

- `openQuickDetectiveSelect`(app.js:323)
- `startQuickDetective`(:333)
- `activeQuickDetectiveCase`(:443)
- `renderQuickDetectiveSelect`(:447)
- `renderQuickDetective`(:475)
- `updateQuickDetective`(:525)
- `quickRevealTransition`(:531)

做法:
1. 新建 `createQuickDetectiveScreens(ctx)`,把上列函数搬入,签名改为闭包内函数;函数体对 `state`/`render`/`saveState`/`playSfx`/`bind` 等的引用全改走 `ctx.*`,`state` 一律 `const state = ctx.getState();` 在**每个入口函数体内**读(不在工厂顶部)。
2. app.js 的 render 分发(约 394–395:`state.screen === "quickDetectiveSelect"/"quickDetective"`)改为调 `quickScreens.renderX()`;把 quick 相关的 ctx 能力并进现有 ctx 构造;`createQuickDetectiveScreens(ctx)` 与日间四屏一样在 `createDailyScreenRenderers`(或同级)里 memoize 化构建。
3. app.js 删除已搬的 7 个函数及其 import 冗余。
4. **立纪律**(写进 `docs/README.md` 或 `project-skills` 合适处一行):新屏幕渲染进 `ui/screens/*`,经 ctx,不进 app.js。
5. `npm run check && npm run smoke:browser` 绿 → 提交 `refactor(app): extract quick-detective into ui/screens`。

## Part C|死代码清扫(先做,独立、零风险)

已确认内容里 **0 引用**、代码里仍有 handler 的两个 kind(其余 playback/evidencePass/backflowEarly 内容仍在用,**不许动**):

- `sitIn`:`src/ui/screens/overnightScreens.js:341` 的 `if (dayScene.kind === "sitIn")` 分支 + `:627` 的 `sitIn: "白天·旁听同席"` 标签,删除(先 `rg -n '"kind": "sitIn"|sitIn' content/` 复确认为 0 再删)。
- `advisorConflict`:内容 0 引用;删除各文件里仅服务 advisorConflict 的分支/标签/样式(`rg -n advisorConflict src/` 逐处核对,只删**仅**为它服务的死分支;若某处与 live 逻辑纠缠,停下报告)。

删完 `npm run check && npm run smoke:browser` 绿 → 提交 `refactor: remove dead sitIn and advisorConflict handlers`。

## Part B|对白渲染去重(谨慎,放最后)

`src/ui/quickDetectiveView.js` 自己重实现了 AVG 风格行渲染,没用 `src/runtime/dialoguePresentation.js` 的共享件(它已导出 `splitDialogueSentences`/`dialoguePagesFrom`/`mountDialoguePresentation`/`createDialogueController` 等)。目标:**只把"通用的一行对白呈现"(名牌+转义+分句/打字机)共享化**,消掉两套并行、防未来漂移。

**谨慎边界**:
1. 只共享**明确通用**的原子件(分句、转义、名牌行、打字机控制器);快案专属的舞台(圈句、对质 duel-stage、backdrop)保持各自实现,不强行合并。
2. 先做一次**逐行对照**:列出 quickDetectiveView 里与 dialoguePresentation 重复的具体渲染逻辑,判断哪些**语义完全等价**可直接换成共享导出;语义有差异处**不动**。
3. **若换用共享件会改变快案可观察行为**(排版、断句、打字机节奏与现状不一致)——**停下报告,不强行统一**。宁可只共享一两个最安全的原子件,也不为"少一份代码"冒行为回归的险。
4. smoke 里 quick2 的 positional 对质断言对布局敏感;改完必须 `smoke:browser` 绿,quick-detective 路线通过。

绿 → 提交 `refactor(ui): share dialogue line rendering between quick and main`。若 B 判定风险大于收益,**只提交对照报告 + 最安全的一两处共享**,其余留待。

## 收尾(不在本单强制,记录)

- `caseEngine.js`(1078)、`overnightScreens.js`(1039)仍超 800;overnightScreens 混了 hangup/dayMap/dayScene/callback/document 五类,可后续按类再拆。
- `src/generated/contentPackIndex.js`(11314)仍提交进 git,建议 gitignore + 构建时生成(改贡献流程,单独决策)。
- 二者本单不动,只记录。

## 验收

1. `npm run test:full` 全绿(check + smoke:browser + smoke:desktop)+ CI/test:pr 绿。
2. app.js 行数明显下降(quick 抽出后);`rg 'sitIn|advisorConflict' src/` 归零(死分支清完)。
3. 抽出的 quick 屏幕模块**不 import app.js**、用时读 `ctx.getState()`。
4. `git diff -- content/` 为空(纯代码重构)。
5. 分片提交:C(死代码)、A(抽 quick)、B(对白去重或对照报告)各独立提交,各自过 check+smoke。
6. Part B 或死代码清扫中遇到"与 live 逻辑纠缠、动了可能改行为"处,**停下报告,不自行取舍**。
