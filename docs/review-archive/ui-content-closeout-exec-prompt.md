# 大改后收口执行 Prompt

> 归档状态（2026-08-10）：已选择执行 CSS 变量、改名加固、案2口播和检查覆盖；快案02“降温”因与作者已确认判断冲突而拒绝执行。

> 复制整份给执行 agent。范围只打下列刀；禁止顺手扩写主案 spine、开场、夜B、宸直设定。

## 背景

UI 已控台化（标题减负、直播双人立绘、快案对决、改名、追问 rewind）；内容已过 spine / 口语化。本轮只收口上线前 P0：CSS 变量、改名贯通、案2结案口播、快案02道德温度、`check` 覆盖。

## 硬约束

1. 不改四案作者事实 / 伪装链 / `logicContract` / adjacency 真相字段。
2. 不改「不点名 8 号付款人」「Tony 不上麦」「sitIn 仅案1」「宸直损失不可追回」等已定规则。
3. 案1/3/4 的 `stageJudgement`、开场、夜B峰值句默认不动；除非改名贯通必须动 speaker 字符串。
4. 改完：`npm run content:index && npm run check`（至少跑到 syntax/`content:index:check`/`verify:pack`；全量 check 若太慢，先保证新增文件进 `check` 脚本并 `node --check` 通过）。
5. 不碰 `~/.cursor/plans`；不大改 `styles.css` 布局（本轮不拆顶栏/控场台密度）。

---

## P0-1 CSS：补 `--mint`

**问题：** `src/styles.css` 多处 `var(--mint)`，`:root` 未定义。

**做：**

- 在 `:root`（约第 1–19 行，已有 `--accent` / `--gold` / `--green`）增加：
  - `--mint: <与现有青绿体系统一的实色>`  
  - 建议贴近 `--accent: #65d6c2` 或略亮一档（如 `#7ee0cf`），**禁止**改成紫色系。
- 打开标题页、快案对决、强调标签，目测 `var(--mint)` 不再无效。

**验收：** 全文 `var(--mint)` 可解析；无新增未定义 CSS 变量。

---

## P0-2 改名贯通（半残 → 可玩）

已有：`src/playerIdentity.js`（`normalizePlayerName` / `personalizeHostHtml` / `personalizeHostText`），`app.js` 多数 `innerHTML` 外包 `personalizeHostHtml`。

**仍坏的典型点：**

| 位置 | 问题 |
|------|------|
| `src/ui/liveCallView.js` figcaption | 写死 `<b>林旭阳</b>`；应吃 `host.name` / `playerName`（即使外层 replace 能顶，也改为显式传参，避免漏路径） |
| `src/ui/quickDetectiveView.js` | 多处 `speaker: "林旭阳"` / fallback `"林旭阳"`；气泡与立绘 caption 应统一用 `packet.presentation?.host?.name` 或传入的 `hostName` |
| `src/ui/screens/overnightScreens.js` `dayBeatsHtml` | `isHost = /你\|主播\|林旭阳/.test(speaker)` — 玩家改名后白天 beat 角色错位 |
| `src/runtime/dialoguePresentation.js` | `speaker === "林旭阳"` 需与传入 `hostName` 对齐 |
| `src/runtime/careChoiceModel.js` / `hostDisclosureModel.js` / `src/ui/careChoiceView.js` | 构造 speaker 时写死默认名；改完后仍应用 `DEFAULT_PLAYER_NAME` 常量，并由渲染层 personalize |

**做：**

1. 所有「判断是否主播」逻辑：同时认 `你` / `主播` / `DEFAULT_PLAYER_NAME` / **当前 `state.playerName`（或传入 hostName）**。
2. 所有 UI figcaption / 气泡默认 speaker：禁止裸写 `"林旭阳"`；用参数或 `DEFAULT_PLAYER_NAME`。
3. 冒烟：标题改成「周明」→ 正案立绘名、对话气泡主播名、白天旁听 beat 仍标 host；快案 01/02 立绘与气泡一致。内容包 JSON 里的「林旭阳」可继续靠 `personalizeHost*` 替换，不必批量改包。

**验收：** 改名后无残留默认「林旭阳」出现在**运行时 HUD/气泡/立绘 caption**（存档/调试字段除外）。

---

## P0-3 案2 `stageJudgement` 腰斩

**文件：** `content/packs/steam-demo-01/cases/02-tony.json` → `"stageJudgement"`

**现状（过长，口播糊）：** 一段里塞：酒桌/花双轨、照顾真、折扣真、民警另案、取消预约、不退四万六、书面删名、十万交原件。

**目标结构（≤3 短句动作 + 最多 1 句关系定性）：**

1. 关系：不是单方推进；照顾与折扣是真的，但不能抵身份被写进项目介绍。  
2. 立刻做：取消后续预约、别再带人；书面要求删姓名手机号并留回复/民警记录。  
3. 钱与十万：十八次做完的服务不因关系落空全退；三张十万是否同笔交给民警看原件。

**对齐：** `caseClosing.verdict` 已较干净，结案口播向它对齐，不要引入新指控（尤其不坐实十万去向）。

**验收：** 字数约压到现稿 40–55%；读一遍能一口气说完；不删 `caseClosing` 要点。

---

## P0-4 快案02结案温度对齐主线

**文件：** `content/packs/steam-demo-01/quick-cases/02-one-missed-message.json` → `ending.summaryPages` 最后一页「高概率判断」+ `riskReading`（若有「骑驴找马」字样一并改）。

**问题：** 「骑驴找马」「供养者」「玩的心思」相对主案克制口吻过冲；证据边界（不猜酒局细节）是对的，语气要收。

**改法：**

- 保留：开场版本失真、分层补充、男方有理由退出、不建议再圆谎。  
- 删/改：脏话级标签与道德宣判句；改成「她想要被理解的说法，和这周末实际做的事对不上；条件与被看见的部分她也在意，但麦上证明不了更多动机词」。  
- `riskReading` 若写「足以判断她仍在骑驴找马」→ 改为可证明的行为判断（版本失真 + 退出理由成立），不升级成定性骂名。

**验收：** 快案02仍判「别再遮、对方可退出」，但不比主案案3/4 更像网暴旁白。

---

## P0-5 `check` 覆盖新文件

**补进 `package.json` 的 `check`（或 `precheck`）：**

- `node --check src/runtime/questionRewind.js`
- `node --check src/runtime/quickDetectiveModel.js`
- `node --check src/ui/quickDetectiveView.js`

（`playerIdentity.js` 若已在 check 中则跳过。）

**验收：** `npm run check` 会语法检查上述文件；本地改一处故意语法错误能被拦下。

---

## 明确不做（本轮）

- 顶栏 + control-deck 移动端减密、拆 `.title-screen` 双份 CSS  
- 案1/3 开场数字密度大改、材料层「只能证明」通麦清理  
- Rewind 跨会话 / 心智文案大改  
- 快案结算「问穿了什么」信息架构加厚  
- 新案、新系统、新美术

以上可进下一轮 backlog，不要塞进本 Prompt。

---

## 执行顺序

1. P0-1 `--mint`  
2. P0-2 改名贯通 + 手动冒烟「周明」  
3. P0-3 案2 judgement  
4. P0-4 快案02 语气  
5. P0-5 check 脚本  
6. `npm run content:index && npm run check`（或等价子集）  

## 交付

- 改动文件列表（UI / content 分开）  
- 案2新旧 `stageJudgement` 对照（各贴终稿一句摘要即可）  
- 冒烟记录：改名、案2结案页、快案02最后一页  
- 未做项一句带过（指「明确不做」）
