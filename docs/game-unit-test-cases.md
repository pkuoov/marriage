# Game Unit Test Cases

This document records the automated unit/contract tests that must run before every major gameplay or UI release.

## Required Release Commands

Run these before tagging or shipping a major version:

```bash
npm run test:unit
npm run verify:pack
npm run check
npm run build:h5
npm run build:playable
npm run smoke:browser
npm run smoke:desktop
```

`npm run check` already includes `npm run test:logic`, which points to the same unit runner. `npm run test:unit` exists so release checklists can name the intent directly.

## Test Inventory

| ID | Area | Case | Guards Against |
| --- | --- | --- | --- |
| MODE-001 | Mode routing | Unknown modes normalize to `episode`; explicit `daily` still expects one case; legacy `weekly` links migrate. | Steam 主入口被旧 daily 默认值拉回去，或单案兼容入口丢失。 |
| PACK-001 | Content pack contract | `content/packs/steam-demo-01/manifest.json` matches the runtime story-pack definition, and each case pressure packet has truth boundaries, stakes, object purpose, self-serving omission, and quote candidates. | 故事包目录和运行时定义脱节，或新故事包只有标题顺序、没有编剧压力系统。 |
| PACK-005 | Runtime content schema | Runtime-loaded cases must expose playable nested content: task profile, opening dialogue, five scene beats, exactly one core question per beat, at least two readable materials, investigation backflow, caller omission, third pressure, thick truth-boundary pools, deep follow-up, conclusion, share copy, and truth text. | 内容包看着完整，实际缺少可被引擎消费的任务画像、台词、选项、材料、回流、结算字段，事实边界退回三栏各一，或体量退回短问答。 |
| BROWSER-SMOKE | Playable route replay | `npm run smoke:browser` opens the offline playable and replays perfect, outer-only, material-miss, keyboard-perfect, and gamepad-perfect routes to the recap. | 离线包语法能过但真实按钮无响应、import alias 丢失、后台回流页崩溃、外围追问无法线性推进、材料误圈路线死路，或键盘/手柄焦点无法实际通关。 |
| UI-001 | Choice UI contract | Current-node questions render in one panel without explainer tags; buttons are host questions, not route labels, same-panel buttons have equal visual weight, the material inspection stage remains in the runtime, and recap/interlude copy avoids scoring slang. | `顺着问`、`按住问`、路线轴提示、双分组单按钮、核心追问高亮、`半口瓜`、`闻到味`、`主播倾向`、`接入下一通` 等设计稿或评分腔残留回到玩家界面，或玩法退回纯问答。 |
| UI-002 | Broadcast identity | Title and live-call screens preserve a livestream control-desk shell: signal strip, ON AIR state, host monitor, audience patience, current call segment, background material panel, scene evidence props, and caller expression motion. | UI 退回普通文字剧情游戏：一张背景图、一块对话卡、没有直播间控场职业感，案情物件只剩文字，或玩家作为主播的视觉存在消失。 |
| EPISODE-001 | Story pack contract | A `storyKey` deterministically generates four live-call cases with stable order, visible in-run progress, one shared theme, a non-spoiler title intro, per-case bridge text, at least one material inspection node per case, and a post-run hidden thread sourced from manifest theme data. | 故事集变成随机拼盘、乱序、重复题材、标题页剧透目录、开场说教、无主题、无法回放同一集、缺少可操作材料，或串案暗线硬写在 UI 里。 |
| EPISODE-001B | Story interlude contract | Story-pack interludes should summarize the previous call from the played route and introduce the next call through a dramatic object, not a directory title. | 案间页退回“上一通记下 / 下一案 / 下一通来电”这种模板感。 |
| EPISODE-001A | In-run spoiler guard | Story-pack live screens use neutral call labels instead of act names, case titles, `1/4` package progress, or "next case" copy. | 首页刚清干净，玩家一进第一通又看到目录式剧透。 |
| EPISODE-001D | Role/pronoun consistency | The workplace case checks assigned caller/respondent ids against recap and deep-followup wording. | 男性来电人用男性头像上麦，结算却写成“她想拿表现”；女性缺席同事被写成“他就有办法一直拖”。 |
| EPISODE-004 | Daily content source | Explicit daily plots reuse runtime-loaded JSON when available, automatic daily rotation only draws migrated JSON cases, and legacy templates remain explicit fallback only. | 今日来电和故事包同 plot 重新维护两套台词，或自动轮换抽到未迁移模板案导致内容漂移。 |
| DAILY-001 | Daily contract | Generated daily case has one playable case with scene beats, question options, deep follow-up, evidence notes, material inspection, and clue threshold. | Empty UI from incomplete brief data, or单案只有口述没有可操作证据。 |
| DAILY-002 | Determinism | Same `dailyKey` generates the same case, plot, and opening. | Share links showing different cases to different players. |
| DAILY-003 | Date boundary | Default daily key uses fixed UTC+8 day boundary. | Cross-timezone players getting different "today" cases. |
| DAILY-004 | Template guard | Explicit unsupported daily plot IDs throw. | Untemplated plots falling through to broken daily cases. |
| DAILY-005 | Rotation completeness | Eight-day rotation produces complete, playable cases and avoids repeating the same plot/role combination. | Structural gaps or direct same-case repeats in the current limited template set. |
| DAILY-006 | Choice quality | Daily choices reject no-click throwaway options. | Fake choices like "just believe it" returning. |
| DAILY-006B | Host question voice | Host questions avoid leading caller psychology labels and edited-outline phrasing; they ask concrete live-call follow-ups. | `你是不是先心疼/你是不是也怕/关系一直没说死` 这类不像主播问出口的选项回流。 |
| DAILY-007 | Case 4 structure | "三张截图" keeps motive chain and `halfTruth` stance. | Regressing to abrupt screenshots or one-sided victim framing. |
| DAILY-008 | Livestream contract | Daily cases stay anonymous and single-caller; every scene beat and deep follow-up answer is spoken by the caller, with materials only retold or read aloud. | Real names, system-inserted evidence beats, or two-sided confrontation leaking back into the live room. |
| DAILY-009 | Drama and gray zone | Every daily case has a concrete dramatic object/quote and at least one unclear initiator or shared face-saving pressure. | Future generated cases becoming flat “check the clue” exercises with obvious villains. |
| DAILY-009B | Value baseline | Case copy avoids gender-war labels and group attacks while allowing concrete mutual harm. | 用性别对立收割流量，或把双方互害偷换成男女群体攻击。 |
| DAILY-009C | Copy voice | Playable case and share copy avoids stock AI-summary phrasing, including essay-like `让我……的是/不是……` result-card sentences. | 结果卡和来电台词退回作文式心理总结、二元转折、教程腔或 AI 复盘腔。 |
| DETECTIVE-001 | Detective plot coupling | The project keeps a detective-structure skill and improvement plan with false solution, missing edge, fair-play reveal, clue ledger, truth boundary, and quote payoff requirements. | 剧情优化退回单句润色、临时反转、作者讲道理，或串案暗线没有线索/误导/回收结构。 |
| DAILY-010 | Scene question shape | Each daily scene beat has exactly one core issue question; other options are plausible outer angles. | Strong clue angles disappearing because several buttons all reveal the same core point. |
| DAILY-011 | Quote-pick accusation | Case 4's final beat uses quoted-line choices; the gray-zone answer is not the first button. | Players passing by position or reading abstract conclusions instead of listening to the call. |
| DAILY-015 | Content breadth | Daily engine supports non-romance public incident cases such as workplace reimbursement screenshots. | Product scope collapsing back into marriage-only cases. |
| ROUTE-001 | Hidden route map | Every playable choice records a route axis and tone. | 玩家选择无法生成路线图、回溯和主播倾向。 |
| ROUTE-002 | Route-log helpers | Route axis, tone, and dominant profile are pure runtime helpers covered outside DOM rendering. | 路线图逻辑继续堆在 `app.js`，后续 UI 改文案时误伤路线画像。 |
| MATERIAL-001 | Material operation model | Material hit/miss produces a reusable operation outcome: hit records contradiction without patience loss, miss spends patience without revealing the answer. | 资料操作继续散在 UI 事件里，后续做圈点时重复实现并误泄露正确答案。 |
| MATERIAL-002 | Material board UI | Material inspection renders as a markable document board with file lines, in-board targets, hit/miss annotations, and page-level HTML owned by `ui/evidenceView`. | 材料检视退回纯段落、普通按钮列表，整页模板长回 `app.js`，或点击后没有“圈出来”的游戏反馈。 |
| MATERIAL-003 | Material type skins | Bills, tables, screenshots, approval flows, and generic files render with distinct document bodies. | 账单、表格、截图和审批流又退回同一种普通文字卡，试玩 UI 缺少操作感。 |
| INVESTIGATION-001 | Evidence source expansion | Investigation hooks only unlock from already heard contradictions, render as fixed materials through `ui/evidenceView`, and never create freeform facts or second-party live debate. | 后台核实变成任务提示、AI 编事实、另一方上麦吵架、页面模板散回 `app.js`，或未先发现矛盾就直接发答案。 |
| STATE-001 | Save migration | Legacy saves migrate into episode-compatible shape while preserving explicit daily saves and settings. | Old saves breaking after refactors. |
| RUNTIME-001 | Outcome math | Internal carryover scores clamp correctly for wins/failures. | Run result values drifting out of range. |
| RUNTIME-002 | Pacing and difficulty | Daily budget has a floor and hint count stays at one; story-pack cases can use manifest difficulty profiles to vary patience budget and truth-boundary prompt count. | Mobile short-case pacing getting too long or too guided, or story-pack difficulty staying flat across every case. |
| RUNTIME-003 | Accusation logic | Stance, structure, clue threshold, and expected accusation remain stable for underlying case math. | Responsibility layer drifting while the daily UI uses reveal ratio. |
| RUNTIME-004 | Daily reveal flow | Daily quoted-line picks should not override the reveal-ratio result; the visible result is based on core issue completion. | Players feeling punished by a wrong-answer model instead of seeing completion. |
| NARRATION-001 | Copy helpers | Core labels and narration helper outputs remain stable. | Share/recap copy losing key terms. |
| DOCS-001 | Project process docs | Controlled AI intent schema, large playtest template, and livestream review skill stay linked and explicit. | AI 问答实验变成自由生成事实，大测试只靠聊天记忆，或 AI 味 / UI 遮挡 / 耐心耗尽问题没有统一记录入口。 |
| CLUE-001 | Clue aggregation | Contradictions dedupe across scene and evidence-note sources. | Duplicate clues inflating progress. |
| CLUE-002 | Hint selection | Inspiration skips already discovered contradictions. | Daily hint repeating information the player already found. |

## Manual Smoke Checks

Automated tests do not replace one short browser replay after large narrative/UI changes:

1. Open `http://localhost:5174/?ui=<new>&storyKey=steam-demo-01`.
2. For a large pass, fill `docs/playtest-report-template.md` while playing instead of summarizing from memory.
3. Confirm the title card does not reveal there are four cases, list case titles, or show the story-pack thesis.
4. Start a fresh run and confirm in-run progress appears only after the first call is entered, and that the live screen does not show case names, act labels, `1/4`, or "下一案".
5. Confirm the opening explains why suspicious materials exist.
6. Confirm only "你" and "咨询者" are present in the live room; no real NPC names or second-party portrait/mic appears.
7. Confirm recap/deep-followup wording matches the assigned caller and respondent, or uses role terms such as "咨询者 / 同事 / 对方" instead of fragile gender pronouns.
8. On at least three current-node choice panels, confirm there is one panel and every button is a host question, not a route label or UI explainer.
9. Confirm same-panel current-node buttons have equal color, border, card treatment, and emphasis; no button should look recommended by UI priority.
10. Confirm the page does not show "how to play" hints, route axes, or designer shorthand inside the live-call choice area.
11. Confirm the first live-call screen reads as a livestream control desk: visible ON AIR state, host monitor/mic control, current segment, audience patience, scene evidence props, and backend material panel before it reads as a generic visual-novel text box.
12. Pick one core issue question and one tempting outer-angle question.
13. Confirm outer-angle feedback is in-character and live comments react.
14. Confirm a correct core issue question keeps audience patience unchanged, while an outer-angle question can consume it.
15. After the last scene, enter material inspection; confirm the material appears as a document/table/screenshot board, not a paragraph above ordinary choice buttons.
16. Pick one material target and confirm the selected area gets a visible circle/annotation inside the board.
17. Confirm a correct material pick keeps audience patience unchanged and wrong material picks consume it.
18. Confirm material hit feedback appears once, not again as a separate reaction line.
19. Solve the first case and confirm the recap shows the hidden route map.
20. Confirm the route map marks material inspection as material, not as a fake sixth dialogue beat.
21. Confirm the recap does not use scoring slang such as "半口瓜", "闻到味", "瓜心", "主播倾向", "最佳答案", or "结论更锋利".
22. Continue to the interlude. Confirm the previous-card copy references the played case or route, and the next-card title is a dramatic object such as "表格", not "下一通来电".
23. Enter the second case, then finish or jump through enough flow to confirm the final story-pack summary can aggregate case routes.
24. Confirm the story-pack summary shows the story theme and a comment-wall block tied to the route.

## Maintenance Rules

- Add a test whenever a bug repeats twice or a design rule becomes product-critical.
- Prefer testing pure modules (`caseEngine`, `caseRuntime`, `caseNarration`, `state`) over DOM-heavy flows.
- Keep browser-only assertions in manual smoke checks unless a stable DOM contract is introduced.
- When changing cache query versions, keep `scripts/verify-logic.js` imports in sync with the rest of the source.
- Content breadth is not solved by `EPISODE-001`: before shipping paid story packs, expand the template pool to at least nine distinct plot IDs, then tighten the pack test to enforce story-pack theme variety.
- Any playtest complaint about strange choice labels must be promoted into either `UI-001`, the manual smoke checks above, or `project-skills/livestream-game-flow-review/SKILL.md` before the turn ends.
- Any large story-coupling complaint must be promoted into `DETECTIVE-001`, `docs/detective-coupling-improvement-plan.md`, or `project-skills/detective-plot-coupling-review/SKILL.md` before rewriting dialogue.
- Broad "continue optimizing" work should first check `docs/unfinished-backlog.md`; if the work discovers a new repeated gap, add it there instead of leaving it only in chat.
- Content-pack changes must update both `content/packs/<pack-id>/` and the runtime pack definition until full JSON loading replaces the temporary mirror in `src/storyPacks.js`; `npm run verify:pack` is the guardrail.
