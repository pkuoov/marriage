# 第 4+5 批合并执行单（闲聊层 + 证言更新 + 顾问 P1 + 对方留言）

你是本仓库的实施工程师。本单合并两部分：A 部分是尚未执行的第 4 批（`docs/expansion-pass-4-prompt.md`）；B 部分是顾问 NPC 与麦外表面的 P1 试水（设计依据 `docs/advisor-npc-and-offmic-design.md`，边界规则见 `project-skills/case-scriptwriting/SKILL.md` 的「Advisor NPCs and Off-Mic Surfaces」）。台词逐字使用，不要润色。

开工前自检：`rg "casualQuestions|revisedVersion|advisorNotes|respondentNote" content/ src/ | grep -v generated` ——已存在的部分跳过对应任务，不要重复实施。第 3 批（reactionLine 引擎）已落地，可直接依赖。

---

## A 部分：执行第 4 批原文

打开 `docs/expansion-pass-4-prompt.md`，按其任务 1→2→3→4 原文执行（闲聊层引擎、四案 40 条闲聊问答、证言更新引擎、案 1 重述文本），遵守其验收与"不要做的事"。该文档对这四个任务仍是唯一权威，本单不复述。

与已落地第 3 批的衔接确认（执行时自查）：
- 证言更新的渲染顺序是 `reactionLine` 气泡 → `revisedVersion` 气泡 → 继续按钮。
- 案 1 场景 1 正文仍含「都是他安排的那种店」「没细看」两处原措辞（重述找不同的对照基准），若已被改动，停下来报告，不要自行改重述文本。

## B 部分：顾问 P1 + 对方留言（新任务 5-7）

### 任务 5：顾问注册表

新建 `content/characters/advisors.json`：

```json
{
  "advisors": [
    { "id": "zhao-lawyer", "name": "赵律师", "domain": "家事与债务", "catchphrase": "口说的不算，落纸的算数" },
    { "id": "zhou-accountant", "name": "周会计", "domain": "钱路与流程", "catchphrase": "钱只认路径，不认说法" },
    { "id": "lin-matchmaker", "name": "小林老师", "domain": "婚恋介绍", "catchphrase": "行里的话，得翻译着听" },
    { "id": "zhang-forensic", "name": "张法医", "domain": "司法鉴定", "catchphrase": "链条不全，报告就是纸" }
  ]
}
```

注册表随现有内容索引管线进运行时（`npm run content:index` 生成，不在 `src/` 里手写第二份）。本批只用到前两位；四位全部注册。

### 任务 6：麦外来信引擎（小改）

内容契约：

- 案件可选字段：`advisorNotes: [{ "advisorId": "", "appearsNowBecause": "", "text": "" }]`（0-2 条）；`respondentNote: { "appearsNowBecause": "", "text": "" }`（至多 1 个）。
- 渲染：收麦回看流程中，在「后续回拨」页之后、「事实边界」页之前插入一页「麦外来信」（仅当任一字段存在时出现）。顾问条目带名牌（姓名+领域，取自注册表），对方条目带「对方留言」名牌。纯阅读页，无交互。
- 校验（`verify:pack` 或 `verify-logic`）：`advisorId` 必须存在于注册表；**顾问 `text` 不得含「圈」「那一栏」「哪一块」**（效力/侦查铁线的机械化）；`respondentNote` 每案至多一个。
- `npm run smoke:browser` 回看页数断言同步更新。
- 这些是复盘阅读面，不计入 `runtimeLengthPlan.backflowCount`，不要改动该字段。

### 任务 7：试水内容（逐字）

试水分布：顾问进案 1、案 4；对方留言进案 2、案 4。案 1 不加对方留言（其 `followupTwist` 已承载对方回拨的声音，避免同一表面重复）；案 3 本批不动。

案 1（01-credit.json）`advisorNotes`：

```json
[{ "advisorId": "zhao-lawyer",
   "appearsNowBecause": "收麦后，后台一位常来的律师听友留了几句。",
   "text": "这笔要是真转了，往后想按垫付要回来，就得留痕：转账备注写清楚用途，让对方补张欠条。口说的不算，落纸的算数。具体还得看证据，我只说一般情况。" }]
```

案 4（04-workplace.json）`advisorNotes`：

```json
[{ "advisorId": "zhou-accountant",
   "appearsNowBecause": "收麦后，后台做财务的听友补了一段话。",
   "text": "审批、付款、到账，是三张纸。看见第一张就当有了第三张，垫钱的人最容易吃这个亏。这一单，第三张纸到收麦都没露过面。钱只认路径，不认说法。" }]
```

案 2（02-tony.json）`respondentNote`：

```json
{ "appearsNowBecause": "收麦后，他给节目后台留了一段文字，说不上麦，就说这几句。",
  "text": "表的事，是我做事糙，认。但话说清楚：我没跟谁说过是女朋友，一个都没有。办卡带客是店里的活，谁对我好我记着，这两码事。老板娘那句是酒话，当真我也没办法。" }
```

案 4（04-workplace.json）`respondentNote`：

```json
{ "appearsNowBecause": "收麦后，那位同事托人给后台带了话。",
  "text": "垫款我认，月底肯定结。审批本来就走完了，是财务节奏的事。主责署名是人家自己开口要的，这话敢不敢认？返款是供应商这边的老规矩，跟垫款两码事。" }
```

写作依据自查（不要改文本，只需核对理解）：两条对方留言各自带可抓的剪辑——案 2 的「这两码事」把表格证明的耦合重新拆开、「酒话」对冲深夜语境；案 4 的「两码事」正是覆盖谎言本体、「人家自己开口要的」把她的自认武器化、「月底肯定结」是不可验证的许诺。这些错位就是罗生门的第二层，复盘页不加任何点评。

### qa-report 更新

- 伏笔账本追加：两条 respondentNote 的可抓剪辑各自对应的已揭示事实（案 2 表格耦合、案 4 两条钱路）。
- 记录顾问铁线执行方式：机械禁词 + 效力层措辞。

## 统一验收

1. 顺序：A 部分（任务 1→2→3→4）→ B 部分（任务 5→6→7）。每个任务后 `npm run content:index && npm run check`。
2. 全部完成：`npm run verify:pack -- steam-demo-01`；`npm run smoke:browser`。
3. `rg` 终查：
   - `rg "casualQuestions" content/` 命中四案二十个场景。
   - `rg "revisedVersion" content/` 只命中案 1。
   - `rg "advisorNotes|respondentNote" content/` 命中案 1/2/4，案 3 零命中。
   - `rg "圈|那一栏|哪一块" content/characters/ ` 及两条 advisor text 零命中。
4. 手动过案 1 全程：闲聊→关键→圈板→反应台词→重述气泡→深问→原话→回看里「麦外来信」页出现赵律师名牌。
5. 提交拆分：`feat: authored casual question layer for all demo cases`、`feat: testimony revision after evidence hit`、`feat: off-mic letters from advisors and the absent party`（共三次）。

## 不要做的事

- 第 4 批原文的"不要做的事"全部继续有效。
- 顾问文案不得点位置、不得预测未揭示事实；对方留言不得变成可追问的对话。
- 不给案 3 加任何麦外来信；不给案 1 加 respondentNote。
- 「麦外来信」页不加系统点评、不标注"注意他没提什么"——错位让玩家自己咂摸。
