# app.js 职责下沉执行单（2026-09-10，复核修订）

> 本轮按“review，有 bug 就修改”处理：完成 URL 适配器提取及 `fresh=1` 修复；其余下沉保留为后续重构计划。
> 原始基线为 app.js 1404 行。行数是参考数据，不是正确性验收条件。

## 复核发现

原单将“没有直接出现 state”误判为纯函数。实际依赖如下，不能直接剪切到一个无状态模块：

| 函数 | 实际依赖 / 副作用 | 正确处理 |
| --- | --- | --- |
| `dailyKeyFromUrl` / `storyKeyFromUrl` / `modeFromUrl` | 默认读取浏览器 location | 已移至 `src/runtime/urlMode.js`；可显式传 search 测试，默认调用保持原行为 |
| `hasFreshStartParam` | 读取 location，调用 `history.replaceState` 修改地址栏 | 已移至同一浏览器适配模块；不是纯解析器 |
| `sceneWithShownCard` | brief/scene 参数及静态材料查找 | 可独立下沉 |
| `sceneWithCallbackRevision` | `ensureNight`、`ensureOvernight`、回访解锁及反问覆盖 | 先在调用方初始化状态，再把需要的数据传入派生函数 |
| `sceneRevisionUnlocked` | `ensureOvernight(brief)` 会给 `state.caseOvernights` 写入默认值 | 不得把 ensure 当成只读 selector 搬走 |
| `sceneWithLiveCounterQuestionOverride` | `liveCounterPickForState(brief, beatId)` 名称虽有 ForState，实际仍闭包读取 app 的 state | 传入当前 picks 或当前 state，禁止捕获旧快照 |
| `nightShellForStoryKey` | 静态故事包查找 | 可下沉至 nightShellModel |
| `nightShellInterludeForBrief` | 静态故事包查找及 URL fallback | 显式传入 fallbackStoryKey 才能脱离浏览器上下文 |
| `isStoryPackMode` | `state.caseMode` | state 首参 selector |
| `nightShellForBrief` | state 模式及 URL fallback | state、brief、fallbackStoryKey 均需显式传入 |
| `nightShellGoodEnding` | caseBriefs，以及闭包 `normalizedDailyResult` → 当前 accusationHistory、issueCompletion 等 | 仅给函数增加 state 参数不够；先生成本次结果再交给纯模型，或完整显式化结果计算依赖 |
| `nightShellEndingKey` | liveCounterPicks、上述结局结果 | 显式传当前 picks 与本次结局计算结果 |

`createCaseStateWrites` 中的 ensure 方法确实会写状态。这是现有惰性初始化行为；重构若漏掉初始化，可能改变材料修订及回访解锁结果。不能一边宣称零行为变化，一边直接改成空对象读取。

## 已修复的 bug

原 `hasFreshStartParam` 将 URL 解析和地址栏清理放在同一个 try 中。若 `replaceState` 抛异常，`fresh=1` 返回 false，启动流程会读取旧存档。

现在解析成功即保留重开意图；地址栏清理单独容错。保留非 fresh 参数和 hash，未设置 `fresh=1` 时不调用 history。若浏览器不允许清理，地址栏会保留 fresh 参数，再次加载仍会重开，这是该参数的原有含义。

URL 模块提供可显式传入的 search / href / history，便于直接验证受限浏览器场景。它是浏览器适配器，不标为“全部纯函数”。app.js 从 1404 行变为 1367 行。

## 后续重构顺序

1. URL 适配器已完成，不要重复创建或恢复旧实现。
2. 为场景修订补行为基线：未初始化夜间状态、有/无材料标记、回访触发、guardedAnswer、反问选项覆盖、无匹配时原场景保持不变。再拆分“准备状态”和“派生显示内容”。
3. 下沉静态 nightShell 查询，URL fallback 由调用者显式传入。
4. 最后下沉结局计算，确保 normalizedDailyResult 及其依赖使用同一次调用的当前状态。覆盖新游戏/重试整体替换 state 后的结果。

每阶段保持可独立核验，运行 `npm run test:logic`。不要为达到 1200 行而继续拆不相关函数。

## 必须保留的边界

- 新模块不许 import app.js。当前单文件打包器可能把同名导入转成 `const state = state`，产生自引用；更根本的问题是循环依赖和隐藏状态。
- 保留 `dailyScreenRenderers ??= createDailyScreenRenderers()`、`quickScreenRenderers ??= createQuickScreenRenderers()`。
- 屏幕模块必须在每次调用时读取 `ctx.getState()`。新游戏、重试会整体替换 state，工厂顶层捕获会过期。
- `caseStateSelectors.js` 的 state 首参约定可复用，但不能据此忽略间接依赖或写入副作用。
- `ARCH-001` 当前检查工厂边界、反向导入等具体条件，并不是对“只负责组装”的完整语义证明。不能用测试通过代替依赖审查。
- 不拆 `recapScreens.js`，不改剧情、样式或屏幕 DOM，不引入依赖。
- 重构与 bug 修复分别说明。用户已授权修 bug，无需按旧单“只列不修”的限制搁置确认的问题。

## 验收

1. `npm run check`；重点保留 `ARCH-001/002/003`、`FLOW-000`、`STATE-SELECTOR-001`，不放宽断言。
2. `npm run build:playable` 并实际打开产物，确认导入转换没有破坏启动。完整发布仍需 `npm run smoke:browser`。
3. 新增直接行为测试应覆盖边界及状态替换，不以“每函数一条”作为充分条件。
4. 已新增 `URL-MODE-001/002/003`：模式及别名默认行为、history 拒绝时 fresh 仍有效、参数清理及不应重开的输入。
5. 交付报告实际完成范围、测试结果与未执行项，不以行数宣称全面解耦。
