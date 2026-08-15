# 大改后收口执行 Prompt（UI + 内容）

> 归档状态（2026-08-10）：与同批收口单合并执行；采用 UI 工程债、案2口播和检查覆盖，拒绝快案02降温建议。

把下面整段交给执行 agent。目标：修掉 review 里性价比最高的三刀，**不扩 scope、不重开 spine、不重写全案**。

---

## 你的任务

仓库：`/Users/pkuiloveoov/code/love`  
内容包：`content/packs/steam-demo-01/`  
正案：`01-credit` / `02-tony` / `03-profile` / `04-workplace`  
快案：`content/packs/steam-demo-01/quick-detective/`（或当前实际路径）

上一轮大改方向正确。本 Prompt **只收口**，不要再做大 UI 重设计或四案重写。

### 本轮只做 3 刀

| # | 刀 | 验收 |
|---|-----|------|
| A | CSS `--mint` 补定义 + 主播改名贯通 | 强调色不漂；改名后立绘/快案不再写死「林旭阳」 |
| B | 案2 `stageJudgement` 腰斩可口播 | ≤3 短句动作；不丢证明边界 |
| C | `check` 覆盖 rewind/quick + 冒烟清单 | `npm run check` 过；清单可手测 |

---

## 硬约束（违反即失败）

1. **不重开** spine 审计结论；不改四案核心伪装链 / 作者事实 / 来电口径。
2. **不回退** 已口语化的开场与案1结案短句。
3. **不识别** 案1「8号付款人」；Tony **不上麦**；sitIn **仅案1**。
4. **不宣称** 宸直亏损可追回；案2「十万图」不坐实同一笔；案4返利不坐实已进他账户。
5. **不同步改** `~/.cursor/plans`；不擅自 commit / push。
6. 文案改完必须：`npm run content:index && npm run check`（若有 `verify:pack` 也跑）。
7. 改 JSON 时同步相邻字段：`logicContract` / `shadow*` / `adjacency` / `hostLines` 等同义句，避免只改一处留泄漏。

---

## A. UI 工程债（必做）

### A1. 定义 `--mint`

- 文件：`src/styles.css`
- 现状：`--mint` 被引用约 8 处，`:root` **未定义** → 强调色失效/漂色。
- 动作：在 `:root`（或现有色板变量旁）补上与夜控台青绿体系一致的 `--mint`（可参考现有 `--teal` / 强调色，选一个确定值，不要再引入紫色系）。
- 验收：引用 `--mint` 的按钮/标签在浏览器里可见为稳定色。

### A2. 主播改名贯通

- 已有：`src/playerIdentity.js`（标题页可改名）
- 查并修：**所有仍硬编码「林旭阳」** 的 UI 文案，至少包括：
  - `liveCallView`（或等价直播壳）立绘 `figcaption`
  - 快案对质舞台旁白 / 标签（若有）
  - 任何 `alt` / `aria` / 结算页称呼
- 规则：显示名一律走 identity API；缺省可仍是「林旭阳」，但改名后全站一致。
- 验收：标题页改成任意名 → 进正案直播壳 + 快案，不再出现旧名。

### A3.（可选、有余力再做）

- 顶栏 + control-deck 移动端拥挤：只做 **小幅间距/折叠**，禁止重做布局。
- `styles.css` 旧 `.title-screen` 双份：只删确认无引用的死代码，不做视觉大改。

---

## B. 内容：案2结案腰斩（必做）

### 现状问题

`content/packs/steam-demo-01/cases/02-tony.json` 的 `stageJudgement` 仍约 300 字：照顾真、折扣真、开店介绍另案、十八次服务不退全款、删名留证、十万图交民警……口播会糊。

### 目标结构（必须）

压成 **≤3 短句**，顺序固定：

1. **关系边界**：不是单方推进；照顾与折扣是真的，但后面预约取消、别再带人。
2. **钱的边界**：十八次服务已做完 → **不能**因关系没成要求全退四万六（可保留金额或改「这笔服务费」看节奏）。
3. **另案动作**：名字/手机号书面要求删除并留证；十万图是否同一笔交民警看原件——**不在结案坐实**。

### 禁止

- 不要写成「不是A也不是B是C」判决腔。
- 不要在结案里复读整段夜B证据链。
- 不要把「闺蜜六折 / 免护理 / 手很轻」全塞进结案（可留一句「照顾是真的」）。

### 同步

若 `endingSummary` / `hostLines` / materials 结案旁白有同义长段，一并压短，避免舞台短了旁白又念长版。

### 快案02语气（同刀附带，小改）

- 快案 `02-one-missed-message`（或当前 id）结案若出现「骑驴找马」等过狠判决，**下调一档**，靠近主案克制：先停错误动作 + 证明边界，不道德审判。
- 不要重写整案 transcript。

---

## C. 校验与冒烟（必做）

### C1. check 覆盖

把新模块纳入既有检查（`package.json` scripts / `scripts/check*` 等现有入口，**跟仓库惯例**，不要新发明一套）：

- `src/runtime/questionRewind.js`
- 快案相关入口（`quickDetective*` / `src/**/quick*` 以仓库为准）

至少：`node --check` 语法过；若已有 import/图检查，一并挂上。

### C2. 命令

```bash
npm run content:index
npm run check
# 若存在：
npm run verify:pack
```

全绿才算完。

### C3. 冒烟清单（写进 PR/回复即可，不必自动化）

1. 标题页改主播名 → 进 `01-credit` 直播壳，立绘/称呼是新名。
2. 正案内追问 → 用 rewind 返回 → 状态不炸、不串到标题。
3. 快案02：intro → transcript → 圈矛盾 → 对质 → verdict 能通关；结案无过狠人格判决。
4. 案2正案走到结案：口播 ≤3 拍，听得清「不退全款 + 删名 + 图交民警」。

---

## 明确不做

- 不重写案1/3/4 spine 或开场。
- 不解决案1/3「数字密度」（可另开 Prompt）。
- 不做 CSS 大瘦身 / 设计系统翻新。
- 不改 Steam 文案、不扩第三案快探。
- 不 commit，除非用户另指令。

---

## 交付格式

回复用中文，短：

1. **改了什么**（文件路径列表）
2. **案2新 `stageJudgement` 全文**（贴出）
3. **`--mint` 取值**
4. **改名贯通点位**（改了哪些选择器/组件）
5. **check 结果**（过/未过）
6. **未做项**（若 A3 跳过，写明）

---

## 开始前自检

先 `rg` 确认：

```bash
rg --mint src/styles.css
rg '林旭阳' src/
rg stageJudgement content/packs/steam-demo-01/cases/02-tony.json
rg '骑驴找马|只能证明' content/packs/steam-demo-01/
```

再动手；改完重跑上述命令做回归。
