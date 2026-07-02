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
```

`npm run check` already includes `npm run test:logic`, which points to the same unit runner. `npm run test:unit` exists so release checklists can name the intent directly.

## Test Inventory

| ID | Area | Case | Guards Against |
| --- | --- | --- | --- |
| MODE-001 | Mode routing | Unknown modes normalize to `episode`; explicit `daily` still expects one case; legacy `weekly` links migrate. | Steam 主入口被旧 daily 默认值拉回去，或单案兼容入口丢失。 |
| PACK-001 | Content pack contract | `content/packs/steam-demo-01/manifest.json` matches the runtime story-pack definition, and each case pressure packet has truth boundaries, stakes, object purpose, self-serving omission, and quote candidates. | 故事包目录和运行时定义脱节，或新故事包只有标题顺序、没有编剧压力系统。 |
| UI-001 | Choice UI contract | Current-node questions render in one panel without explainer tags; buttons are host questions, not route labels, same-panel buttons have equal visual weight, and the material inspection stage remains in the runtime. | `顺着问`、`按住问`、路线轴提示、双分组单按钮、核心追问高亮等设计稿残留回到玩家界面，或玩法退回纯问答。 |
| UI-002 | Broadcast identity | Title and live-call screens preserve a livestream control-desk shell: signal strip, ON AIR state, audience patience, current call segment, and background material panel. | UI 退回普通文字剧情游戏：一张背景图、一块对话卡、没有直播间控场职业感。 |
| EPISODE-001 | Story pack contract | A `storyKey` deterministically generates four live-call cases with stable order, visible in-run progress, one shared theme, a non-spoiler title intro, per-case bridge text, and at least one material inspection node per case. | 故事集变成随机拼盘、乱序、重复题材、标题页剧透目录、开场说教、无主题、无法回放同一集，或缺少可操作材料。 |
| EPISODE-001B | Story interlude contract | Story-pack interludes should summarize the previous call from the played route and introduce the next call through a dramatic object, not a directory title. | 案间页退回“上一通记下 / 下一案 / 下一通来电”这种模板感。 |
| EPISODE-001A | In-run spoiler guard | Story-pack live screens use neutral call labels instead of act names, case titles, `1/4` package progress, or "next case" copy. | 首页刚清干净，玩家一进第一通又看到目录式剧透。 |
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
| DAILY-010 | Scene question shape | Each daily scene beat has exactly one core issue question; other options are plausible outer angles. | Strong clue angles disappearing because several buttons all reveal the same core point. |
| DAILY-011 | Quote-pick accusation | Case 4's final beat uses quoted-line choices; the gray-zone answer is not the first button. | Players passing by position or reading abstract conclusions instead of listening to the call. |
| DAILY-015 | Content breadth | Daily engine supports non-romance public incident cases such as workplace reimbursement screenshots. | Product scope collapsing back into marriage-only cases. |
| ROUTE-001 | Hidden route map | Every playable choice records a route axis and tone. | 玩家选择无法生成路线图、回溯和主播倾向。 |
| ROUTE-002 | Route-log helpers | Route axis, tone, and dominant profile are pure runtime helpers covered outside DOM rendering. | 路线图逻辑继续堆在 `app.js`，后续 UI 改文案时误伤路线画像。 |
| MATERIAL-001 | Material operation model | Material hit/miss produces a reusable operation outcome: hit records contradiction without patience loss, miss spends patience without revealing the answer. | 资料操作继续散在 UI 事件里，后续做圈点时重复实现并误泄露正确答案。 |
| MATERIAL-002 | Material board UI | Material inspection renders as a markable document board with file lines, in-board targets, and hit/miss annotations. | 材料检视退回纯段落、普通按钮列表，或点击后没有“圈出来”的游戏反馈。 |
| STATE-001 | Save migration | Legacy saves migrate into episode-compatible shape while preserving explicit daily saves and settings. | Old saves breaking after refactors. |
| RUNTIME-001 | Outcome math | Internal carryover scores clamp correctly for wins/failures. | Run result values drifting out of range. |
| RUNTIME-002 | Daily pacing | Daily budget has a floor and hint count stays at one. | Mobile short-case pacing getting too long or too guided. |
| RUNTIME-003 | Accusation logic | Stance, structure, clue threshold, and expected accusation remain stable for underlying case math. | Responsibility layer drifting while the daily UI uses reveal ratio. |
| RUNTIME-004 | Daily reveal flow | Daily quoted-line picks should not override the reveal-ratio result; the visible result is based on core issue completion. | Players feeling punished by a wrong-answer model instead of seeing completion. |
| NARRATION-001 | Copy helpers | Core labels and narration helper outputs remain stable. | Share/recap copy losing key terms. |
| CLUE-001 | Clue aggregation | Contradictions dedupe across scene and evidence-note sources. | Duplicate clues inflating progress. |
| CLUE-002 | Hint selection | Inspiration skips already discovered contradictions. | Daily hint repeating information the player already found. |

## Manual Smoke Checks

Automated tests do not replace one short browser replay after large narrative/UI changes:

1. Open `http://localhost:5174/?ui=<new>&storyKey=steam-demo-01`.
2. Confirm the title card does not reveal there are four cases, list case titles, or show the story-pack thesis.
3. Start a fresh run and confirm in-run progress appears only after the first call is entered, and that the live screen does not show case names, act labels, `1/4`, or "下一案".
4. Confirm the opening explains why suspicious materials exist.
5. Confirm only "你" and "咨询者" are present in the live room; no real NPC names or second-party portrait/mic appears.
6. On at least three current-node choice panels, confirm there is one panel and every button is a host question, not a route label or UI explainer.
7. Confirm same-panel current-node buttons have equal color, border, card treatment, and emphasis; no button should look recommended by UI priority.
8. Confirm the page does not show "how to play" hints, route axes, or designer shorthand inside the live-call choice area.
9. Confirm the first live-call screen reads as a livestream control desk: visible ON AIR state, current segment, audience patience, and backend material panel before it reads as a generic visual-novel text box.
10. Pick one core issue question and one tempting outer-angle question.
11. Confirm outer-angle feedback is in-character and live comments react.
12. Confirm a correct core issue question keeps audience patience unchanged, while an outer-angle question can consume it.
13. After the last scene, enter material inspection; confirm the material appears as a document/table/screenshot board, not a paragraph above ordinary choice buttons.
14. Pick one material target and confirm the selected area gets a visible circle/annotation inside the board.
15. Confirm a correct material pick keeps audience patience unchanged and wrong material picks consume it.
16. Confirm material hit feedback appears once, not again as a separate reaction line.
17. Solve the first case and confirm the recap shows the hidden route map.
18. Confirm the route map marks material inspection as material, not as a fake sixth dialogue beat.
19. Continue to the interlude. Confirm the previous-card copy references the played case or route, and the next-card title is a dramatic object such as "表格", not "下一通来电".
20. Enter the second case, then finish or jump through enough flow to confirm the final story-pack summary can aggregate case routes.
21. Confirm the story-pack summary shows the story theme and a comment-wall block tied to the route.

## Maintenance Rules

- Add a test whenever a bug repeats twice or a design rule becomes product-critical.
- Prefer testing pure modules (`caseEngine`, `caseRuntime`, `caseNarration`, `state`) over DOM-heavy flows.
- Keep browser-only assertions in manual smoke checks unless a stable DOM contract is introduced.
- When changing cache query versions, keep `scripts/verify-logic.js` imports in sync with the rest of the source.
- Content breadth is not solved by `EPISODE-001`: before shipping paid story packs, expand the template pool to at least nine distinct plot IDs, then tighten the pack test to enforce story-pack theme variety.
- Any playtest complaint about strange choice labels must be promoted into either `UI-001`, the manual smoke checks above, or `project-skills/livestream-game-flow-review/SKILL.md` before the turn ends.
- Broad "continue optimizing" work should first check `docs/unfinished-backlog.md`; if the work discovers a new repeated gap, add it there instead of leaving it only in chat.
- Content-pack changes must update both `content/packs/<pack-id>/` and the runtime pack definition until full JSON loading replaces the temporary mirror in `src/storyPacks.js`; `npm run verify:pack` is the guardrail.
