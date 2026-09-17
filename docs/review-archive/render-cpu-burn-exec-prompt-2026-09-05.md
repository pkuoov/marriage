# 渲染 CPU 空烧收口执行单（2026-09-05）

> 判据来源：2026-09-05 实机性能剖析。headed Chromium + `--enable-gpu` + `--force-device-scale-factor=2`，
> 用 `ps -o %cpu` 统计**全部 Chromium 进程合计**（含 GPU 进程），每档取 7 个 1 秒样本的中位数。
> 症状：玩一段时间后风扇狂转。**已定位，不是猜测。**

## 一句话根因

**只要页面上还有一个 `infinite` CSS 动画在跑，渲染管线就每帧全走一遍，整局不进入空闲。**
在 120Hz 屏上就是每秒 120 次 style→paint→composite→present，永不停止。

## 实测基线（照抄，改完要按这个复测）

| 场景 | 现状 | 关掉全部 CSS 无限动画 | 再关 pollGamepads |
| --- | --- | --- | --- |
| 标题屏（焦点环已激活） | **41.7%** | 1.5% | — |
| 游戏内第一夜对白屏静置 | **24.7%** | 10.0% | **4.4%** |

**目标：游戏内静置从 24.7% 降到 5% 附近（降幅 ~80%）。**

## 最反直觉的一条：成本与面积无关

游戏内那 8 个动画元素**总面积只有 436 px²**（`avg-continue` 324px² + 7 个 `stageSignal` 共 112px²，比一个图标还小），却吃掉 **14.7 个百分点**。
**不要试图"把动画元素做小"或"减少动画元素数量"来省 CPU——贵的是"每帧都要走一遍完整管线"这件事本身，不是像素量。**
判据只有一条：**这一帧到底需不需要重画。**

## 已实测否掉的假设 —— 不要去追

1. **`backdrop-filter`（32 处 blur）不是元凶**，只占 2.2pp。静态的，栅格化一次就缓存。**不要动它，不要"优化"它。**
2. **静态 `filter` 不是元凶**。6 层 drop-shadow 的立绘静态摆着只要 +1.1pp。**贵的是"动"，不是滤镜本身。**
3. **"影子数量对齐能让 box-shadow 动画变快"是错的** —— 实测反而更差（43.8% vs 33.9%）。别走这条路。
4. **存档体积不是本单问题**。实测单次写档 3KB、120 次操作后仍是 3KB。
   （附带更正：`engineering-shipsize-and-save-exec-prompt-2026-09-04.md` 单 2 里"每次写 278KB"在实机未复现，**执行那张单前先复测**。）

---

# 单 1｜焦点环：去掉 box-shadow 动画（收益最大，先做）

## 现状

[src/styles/00-foundation-and-title.css:96](src/styles/00-foundation-and-title.css#L96)：

```css
button:focus-visible {
  outline: 3px solid rgba(101, 214, 194, .72);
  outline-offset: 3px;
  box-shadow: 0 0 0 6px rgba(101, 214, 194, .14), 0 12px 28px rgba(0, 0, 0, .24);
  animation: focusCurrent .95s ease-in-out infinite alternate;   /* ← 元凶 */
}
```

keyframes 在 [src/styles/10-live-stage-shell.css:1204](src/styles/10-live-stage-shell.css#L1204)，动的是 **`box-shadow`**——非合成属性，每帧强制重绘元素及其背后区域。

**单独一个聚焦按钮 = 37 个百分点。**

**为什么整局不停**：[src/ui/focusInputControl.js:28](src/ui/focusInputControl.js#L28) `queueDefaultFocus()` 在每次渲染后自动聚焦一个按钮（app.js:500 / 1061 / 1091 及各 screen 模块）。玩家一旦用过键盘或手柄，`:focus-visible` 就命中，且**换屏也不会消失**——这正是"玩一段时间之后"的由来。
实测复现：全程鼠标 7.1% → 碰一次键盘后换屏 **28.9%，8 个动画在跑**。

## 改法

**删掉 `animation: focusCurrent ...` 这一行，保留 `outline` 和静态 `box-shadow`。**

实测三种方案，**最优解就是不动**：

| 方案 | CPU |
| --- | --- |
| 现状（box-shadow 动画） | 33.9% |
| 影子数量对齐 | 43.8%（更差） |
| 改成 ::after + opacity 脉冲 | 27.8%（仍然贵） |
| **完全不动，只留静态描边** | **6.8%** |

`@keyframes focusCurrent` 若无其它引用，一并删除（先 `rg focusCurrent` 确认）。

## 边界

- **`outline: 3px solid` 和 `outline-offset` 必须保留**——那是键盘/手柄玩家唯一的焦点指示，删了就是可访问性回退。这张单只删"呼吸"，不删"焦点看得见"。
- 不要改 `queueDefaultFocus()` 的自动聚焦行为（手柄导航依赖它）。
- 不要用 `::after` + opacity 替代（实测只降到 27.8%，不值）。

## 验收

标题屏聚焦一个按钮后静置，CPU 应从 ~41% 降到 **10% 以内**。

---

# 单 2｜立绘：让 filter 只在眨眼那一瞬间动

## 现状

[src/styles/10-live-stage-shell.css:1073](src/styles/10-live-stage-shell.css#L1073)：

```css
.case-portrait img {
  filter: saturate(1.18) brightness(1.02) contrast(1.08)
    /* 6 层 drop-shadow，含 0 30px 42px 大模糊 */;
  animation: portraitBlink 6.8s infinite;      /* ← 每帧重算整条 filter */
}
.case-portrait img:last-of-type {
  animation: portraitBlink 6.8s infinite, portraitCrossFade .25s ease-out;
}
```

**两张立绘 = +30 个百分点。**
而 keyframes 的 `0%, 92%, 100%` 三个停顿点 filter **完全一致**——**92% 的时间在重算一模一样的画面**。真正的眨眼只发生在 92%→96% 那 0.27 秒。

## 改法

把"常驻动画"改成"偶发触发"，二选一（**选哪个都要在交付里说明**）：

- **首选（纯 CSS）**：`.case-portrait img` 只保留**静态** filter，不挂 animation。眨眼交给一个**只动 `transform`** 的短动画（`transform` 是合成属性，便宜），filter 在整个眨眼过程保持不变。视觉上眨眼靠 `scaleY` 压扁已经成立——现有 keyframes 里 94% 那帧本来就是 `scaleY(.985)`。
- **次选（JS 触发）**：保持静态 filter，用一个随机间隔的 timer 给元素加一个 ~0.3s 的一次性 class，动画结束移除。**必须在切屏/销毁时清掉 timer**，否则就是新的常驻循环，得不偿失。

`portraitCrossFade`（0.25s 一次性）不受影响，保留。

## 边界

- **不要删那 6 层 drop-shadow**——静态时只要 1.1pp，是美术效果的一部分，删了是画面回退不是性能修复。
- 不要把 `filter` 换成 `box-shadow`（更贵，见单 1）。
- 立绘切换/表情切换的既有一次性动画不动。

## 验收

对白屏两张立绘在场时静置，相对无立绘的增量应从 **+30pp 降到 5pp 以内**。

---

# 单 3｜pollGamepads：没插手柄就不要起循环

## 现状

[src/ui/focusInputControl.js:132](src/ui/focusInputControl.js#L132)：

```js
function pollGamepads() {
  const gamepad = firstActiveGamepad();
  if (gamepad) handleGamepadInput(gamepad);
  requestAnimationFrame(pollGamepads);        // ← 无条件续帧，永不停止
}
```

实测：**页面完全空闲时仍以 ~120 次/秒调度 rAF**（rAF 来源统计只有这一处）。
每次还做一遍 `Array.from(navigator.getGamepads())`，即 120 次/秒的数组分配。

**注意归因顺序**：单 1、单 2 没修之前，这个循环几乎**不花钱**（合成器本来就被动画唤醒着，被掩盖了）。
**一旦动画修好，它就变成阻止页面进入空闲的主因**——实测额外占 **5.6 个百分点**（10.0% → 4.4%）。
所以：**必须排在单 1、单 2 之后做，否则测不出收益，会误以为没用。**

## 改法

1. `startGamepadPolling()` 增加条件：当前**确实有已连接的手柄**才启动循环（复用现成的 `firstActiveGamepad()`）。
2. `pollGamepads()` 里：若已无手柄连接，**停止续帧**并把 `gamepadPollingStarted` 置回 `false`，让后续 `gamepadconnected` 能重新拉起。
3. 补 `gamepaddisconnected` 监听（app.js:250 旁边已有 `gamepadconnected`），拔手柄后确保循环收敛。

## 边界 —— 这条最容易把 smoke 打红，已核实过，照做就安全

`scripts/smoke-browser-replay.js` 的 gamepad 路线是这样跑的：
- 在 `addInitScript` 里就定义好 `navigator.getGamepads`，**开局返回 `[]`**；
- `page.goto()` **之后**才调 `connectGamepad(page)`。

而 `connectGamepad`（[smoke-browser-replay.js:2282](scripts/smoke-browser-replay.js#L2282)）**确实会 `dispatchEvent(new Event("gamepadconnected"))`**，app.js:250 也确实在监听它。

**所以本改法对 smoke 是安全的**：开局不起循环 → smoke 派发 `gamepadconnected` → 循环拉起 → 手柄路线照常通过。
**但前提是你必须保留 app.js:250 那个 `gamepadconnected` 监听，并确保它能在"开局没起循环"的情况下真正拉起循环。** 这是本单唯一的风险点，改完**必须单独跑 `npm run smoke:browser -- --target=gamepad` 验证**。

## 验收

1. `npm run smoke:browser -- --target=gamepad` 绿。
2. 无手柄时，页面空闲 3 秒内应用自己调度的 rAF 次数 **为 0**。

---

# 单 4｜补 prefers-reduced-motion 全局兜底

现在只有 7 处零散覆盖（`avg-continue`、部分卡片等），**`focusCurrent` / `portraitBlink` / `stageSignal` / `hostWave` / `liveCommentFloat` 都没被覆盖到**。

加一条全局规则：`@media (prefers-reduced-motion: reduce)` 下，把所有 `infinite` 动画停掉（`animation: none`）。
既是可访问性要求，也是给低配机器和笔记本用户的一个真实逃生口。

**边界**：不要用 `*{animation:none}` 一刀切掉**一次性**过渡动画（转场、淡入），那会让界面变得突兀。只针对无限循环的那批。
`src/runtime/dialoguePresentation.js:185` 已有 JS 侧的 `reduceMotion` 读取，保持一致即可。

---

# 单 5｜加一条防回归测试（固化这次教训）

照本仓库 `ARCH-001/002/003` 的路子，在 `scripts/verify-logic.js` 加一条 CSS 静态检查，例如 `PERF-001`：

**扫描 `src/styles/*.css`，若某个 `@keyframes` 被 `infinite` 引用，则该 keyframes 内不得出现非合成属性：`box-shadow` / `filter` / `width` / `height` / `top` / `left` / `margin` / `padding` / `border` / `font-size` / `background-position`。**

只允许 `transform` 和 `opacity`。

这条测试会**直接钉死单 1 和单 2**，也防止下一轮做美术效果时把同样的坑再挖一遍。
现有违例若有本单未处理的（如 `statement-phase-signal` 动 `filter: brightness`），**先列进交付，不要顺手改**——除非它同样在跑无限循环且实测有成本。

---

# 复测脚本（改完用它验收，别凭感觉）

放 `tmp/`（已 gitignore），验收完删掉。**必须 headed + GPU，headless 测不出合成成本**（我第一次用 headless 测，结论完全错了）。

```js
// tmp/perf-check.mjs   ——  node tmp/perf-check.mjs
import { chromium } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
const url = pathToFileURL(resolve("dist/playable/index.html")).href;
async function run(label, { noAnim = false } = {}) {
  const browser = await chromium.launch({ headless: false, args: ["--enable-gpu", "--force-device-scale-factor=2"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url); await page.waitForTimeout(1600);
  await page.keyboard.press("Tab");                       // 激活 :focus-visible
  const s = page.locator("[data-start-story]");
  if (await s.count()) await s.first().click({ timeout: 1500 }).catch(() => {});
  await page.waitForTimeout(2500);                        // 进到对白屏
  if (noAnim) await page.addStyleTag({ content: `*,*::before,*::after{animation:none!important;}` });
  await page.waitForTimeout(1200);
  const pids = execSync(`pgrep -f "Chromium|Google Chrome for Testing" | tr '\\n' ' '`).toString().trim().split(/\s+/);
  const cpu = () => pids.reduce((t, p) => { try { return t + parseFloat(execSync(`ps -p ${p} -o %cpu= 2>/dev/null`).toString().trim() || "0"); } catch { return t; } }, 0);
  cpu(); await page.waitForTimeout(1000);
  const x = []; for (let i = 0; i < 7; i++) { await page.waitForTimeout(1000); x.push(cpu()); }
  x.sort((a, b) => a - b);
  const anims = await page.evaluate(() => document.getAnimations().filter(a => a.playState === "running")
    .map(a => a.animationName).reduce((o, n) => (o[n] = (o[n] || 0) + 1, o), {}));
  const raf = await page.evaluate(() => new Promise(r => { let n = 0; const t0 = performance.now();
    const f = () => { n++; performance.now() - t0 < 1000 ? requestAnimationFrame(f) : r(n); }; requestAnimationFrame(f); }));
  console.log(`${label.padEnd(30)} CPU=${x[3].toFixed(1)}%  可调度帧率≈${raf}fps  运行中动画=${JSON.stringify(anims)}`);
  await browser.close(); return x[3];
}
const cur = await run("改后 · 现状");
const off = await run("改后 · 强制关掉所有动画", { noAnim: true });
console.log(`\n剩余动画成本: ${(cur - off).toFixed(1)} pp   （目标 < 3pp）`);
console.log(`静置总 CPU: ${cur.toFixed(1)}%   （目标 < 8%，修前是 24.7%）`);
```

跑之前先 `npm run build:playable`。

---

# 通用铁律

1. **顺序不能乱**：单 1 → 单 2 → 单 3。单 3 的收益只有在 1、2 做完后才测得出来。
2. **每张单单独提交，每张单改完各跑一次复测脚本**，把数字写进交付。
3. 改完跑 `npm run check && npm run smoke:browser`；单 3 额外单跑 `--target=gamepad`。
4. **不要为了性能牺牲画面**：静态 filter、静态 outline、backdrop-filter 全部保留。这次要删的只有"永不停止的重绘"。
5. 发现本单没点名的无限动画（`hostWave` / `liveCommentFloat` / `expressionFloat` / `quickCallWave` / `line-monitor-pulse` / `statement-phase-signal`）：**先实测它在真实屏幕上的成本，再决定**。列进交付，不要顺手改。
6. 任一测试变红先停下报告，不要放宽断言。

# 交付只报这些

- 改了哪些文件
- 单 1 / 单 2 / 单 3 各自改完后的复测数字（CPU% + 运行中动画列表 + 空闲 rAF 次数）
- 单 2 用了首选（纯 CSS）还是次选（JS 触发），为什么
- 单 3 的 `--target=gamepad` 是否绿
- 单 5 那条 PERF-001 扫出了哪些本单未处理的违例
- 最终：游戏内静置 CPU 从 24.7% 降到了多少

不要写"已全面优化"。不要动 backdrop-filter。不要删静态 filter 和 outline。
