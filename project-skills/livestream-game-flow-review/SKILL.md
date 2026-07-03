---
name: livestream-game-flow-review
description: Use when reviewing or improving a dialogue-driven livestream mystery game flow, especially to find preachy copy, broken conversation logic, premature spoilers, speaker/portrait mismatch, generic UI leftovers, weak story-pack pacing, or anything that blocks a satisfying live-call playthrough.
---

# Livestream Game Flow Review

Use this skill when the task is to review, debug, or improve a playable live-call flow for a dialogue mystery game. The current main product shape is a Steam-first story-pack collection: the demo pack currently has four anonymous call-in cases, but future packs can have any count that fits the theme. Each case still uses the single-caller daily-case contract as its playable unit. The goal is not just correctness. The goal is a replayable, shareable flow that feels like a live emotional-host call-in room: tense, natural, and satisfying.

## Core Principle

This is a game and a narrative text experience, not a tutorial, worksheet, consulting product, or pass-helper. Do not add copy or logic that actively helps the player clear the case. Let the player read, suspect, choose, miss, and replay. Guidance, route axes, scoring, and conclusions should stay off the live-call screen. A pressure meter is allowed only when it represents diegetic live-room attention, such as audience patience, and it must create risk rather than reveal answers.

Before continuing broad optimization work, read `docs/unfinished-backlog.md`, `docs/roadmap.md`, and `docs/game-unit-test-cases.md`. For a large playtest pass, also use `docs/playtest-report-template.md` so actual screen text, route, AI-flavored lines, UI overlap, and retry/failure behavior are captured in the same format. Do not rely on chat memory for unfinished work. Promote any repeated complaint into one of those files or this skill before ending the turn.

For large story-coupling work, hidden-thread design, or detective-plot rewrites, also use `project-skills/detective-plot-coupling-review/SKILL.md`. This flow skill catches live-call/UI problems; the detective skill checks false solutions, missing edges, clue payoffs, fair-play reveals, and story-pack coupling.

For broad "continue optimizing" requests, choose exactly one active direction before editing. Current active direction is the livestream control system: material operation first, live-room pressure second, recap payoff third. Do not mix this with AI free questioning, desktop shell work, new story expansion, or unrelated UI polish in the same pass unless the user explicitly asks for that combination.

UI identity is part of the livestream control system, not decorative polish. The first live-call screen must read as a broadcast control desk before it reads as a visual novel: ON AIR signal, current call segment, audience patience, backend material, and the call monitor should be visible as diegetic live-room surfaces. Do not solve UI weakness by adding tutorials, route hints, case-file exposition, or "how to play" text.

Do not review from code alone. Play the flow like a first-time player, capture what is actually on screen, then patch code only after the lived flow reveals the problem.

For all case creation and any dialogue change larger than typo polish — story packet, stitched transcript, field split, dialogue rewrite rules, de-AI language rules, clue insertion, guarded answers, and comment-hint gating — use `project-skills/case-scriptwriting/SKILL.md`. Its integrated writing loop is mandatory for any change that touches motive, pressure, object purpose, or responsibility balance: never generate or repair case text one field or one sentence at a time. This flow skill owns the played-through review: playtest loop, UI regressions, and continuity checks.

## Review Loop

1. Start from the new-player path.
   - Open the exact local URL with a fresh cache key, for example `?ui=01852&dailyKey=YYYY-MM-DD`.
   - Use "重开" if local state is mid-flow.
   - Walk through homepage, entry page, opening call, every current-node question set, every feedback line, conditional deep question, quote-pick page, recap/share pages, retry/failure if present.
   - For a story-pack single case with 5-6 scene beats, do not stop at the happy path. Reopen/retry enough times to click every scene option and verify each answer advances forward. Also run one perfect core-hit route to verify the single non-choice deep question appears, and one outer route to verify it is skipped.
   - In every large playtest pass, inspect at least three current-node choice panels across different cases. Confirm they are one panel, contain only host questions as buttons, use equal visual weight for all current-node choices, and do not contain explainer tags, route-axis hints, or "how to play" copy.

2. Capture raw screen text.
   - Use browser DOM text, not memory.
   - Save or mentally group each screen as: opening, choice set, answer feedback, next beat, summary.
   - If the page has portraits or speaker labels, check the active speaker against the current line.
   - If a case assigns a caller/respondent id with known gender, check recap, deep-followup, and treatment docs for pronouns that contradict the visible portrait. Prefer role terms such as "咨询者 / 同事 / 对方" when the text should survive role swaps.

3. Audit each screen with the fixed checklist.
   - Does the speaker know the thing they are responding to? If not, reorder the line.
- Does the caller explain why a document/screenshot/audio exists? If not, add a natural trigger in dialogue.
- Does the hidden/cropped/changed information have a clear purpose? If not, add the pressure, desired outcome, and benefit before treating it as a clue.
   - Is this a daily case? Then every `sceneVersion` and `deepFollowup.answer` beat must be spoken by the anonymous caller. Materials can appear only because the caller pulls them out, reads them, forwards them, or explains how they got them.
   - Is the case answer already stated in the setup? If yes, replace the answer with visual or conversational clues.
   - Are all choices plausible things a host might say? If no, rewrite the weak outer option as a tempting but less revealing route.
   - Would a real player ever choose this option? If it says "是真的就先相信", "别纠结", "别聊僵", or any obvious throwaway answer, replace it with a plausible outer angle.
   - Is the caller's version too clean? Add a self-protective omission, softened responsibility, or partial truth unless the case is a pure scammer scenario.
   - Is feedback written in the same speaker perspective? If the label says "咨询者", use first-person or direct quoted speech, not "她说".
   - Does another party appear in a daily case as a live speaker? If yes, rewrite it as caller retelling, chat text, call recording, submitted material, or later callback relayed by the caller. Do not add a second portrait or mic.
   - Do generic buttons mention irrelevant axes such as money/resources in a screenshot case? If yes, make them case-specific.
   - Does any page sound like a tutorial, worksheet, legal analysis, or moral lecture? If yes, convert it back into live-room dialogue.
   - Does a replay/backlog expose more than the last key choice and its answer, or final facts the player has not heard yet? If yes, clamp the recap to the opening on first choice and to the latest key-choice exchange afterward.
   - After a player clicks a branch, does the response appear as a caller line rather than a naked note or toast? If no, render it as a `咨询者` dialogue bubble.
   - Does the recap first page feel like a played narrative ending instead of a grading sheet? It may show the route, selected final line, and aftertaste, but it must not expose missing answers or feel like a pass-helper.
   - Does the score still include early core issues after the player reaches later statements? If not, the clue log is being truncated or overwritten and the recap will feel unfair.
   - Does the player have to click through optional follow-ups or material menus before finishing the daily case? If yes, remove those menus from the playable route and keep only the conditional full-hit deep question.
   - Does the screen clearly separate listening, current-node choice, and final response selection? If not, return to the linear call loop: caller statement, one current-node question choice, caller answer, next statement.
   - Does a current-node choice split into two groups that each contain only one button? If yes, merge them into one question panel. Keep the ask-type distinction in hidden route data only, not in explanatory text, color, border, size, or priority styling.
   - Does the current-node choice panel explain the buttons with labels such as "soft ask / hard ask", route axes, or designer terms? If yes, remove the labels. The visible button text should be the host's actual next question.
   - Do current-node buttons use different colors, side bars, card treatments, or emphasis that make one look recommended? If yes, flatten them to the same visual style. The player should choose by reading the question, not by following UI priority.
   - Does a host question label the caller's psychology too directly, such as "你当时是不是先心疼他了" or "你是不是也怕自己显得太现实"? Does it sound like edited outline copy, such as "关系一直没说死，你当时怎么接的"? If yes, rewrite it as a natural live question that either follows the fact ("你当时有没有起疑心"), points to the concrete gap ("那你为什么一直绕着说要看账单"), or asks for the caller's actual reply ("话当时没说死，你当时怎么回他的").
   - Does a multi-turn opening end on a host question that the caller has not answered yet? If yes, either add the caller answer before the break or move the host question into the next scene. A two-line hook where the host simply asks the caller to continue is allowed.
   - Do live-room prompt strips or helper notes repeat the same template sentence across scenes? If yes, make them reflect current progress, route tone, or case material.
   - Do portraits feel too stiff or documentary-real while the writing is doing livestream drama? If yes, add light stylization and expression beats such as blinking, pausing, looking away, gripping the phone, or taking a breath. These are performance cues, not player hints.
   - Are live-room pressure hooks, caller guard state, or expression beats inferred by runtime regex over case dialogue? If yes, move them into `sceneVersions[].pressureHint` and let runtime consume structured route/material signals only.
   - Does daily mode show different lines/options from the runtime-loaded story-pack case with the same `plotId`? If yes, route daily through the same content JSON and leave templates only as fallback for unmigrated cases.
   - Do live-room comments stay generic after the player chooses different route axes? If yes, add or tune `routeAxisComments`; keep them as crowd noise, not answer hints.
   - Does a non-romance / workplace / process case still use exactly the same one-material rhythm as the romance cases? If yes, add a content-level material layer or another fixed evidence source before changing the whole engine.
   - Does a story-pack bridge, chapter thesis, or marketing-style explanation appear under live-call dialogue? If yes, move it to the title, interlude, or summary screen. The call screen should contain call content and controls only.
   - Does the title screen display a thesis, moral judgement, number of cases, or a table of case titles before the player hears the cases? If yes, replace it with a live-room hook. The theme and structure can appear after the story has been played.
   - After the player enters the first call, do the HUD, dialogue eyebrow, interlude, or next button still expose pack structure, such as "four-case story collection", "case 1/4", named act labels, or "next case"? If yes, rewrite those as live-room language: "热线连线", "匿名来电", "接入下一通", "今晚收麦". Interlude card titles should use dramatic objects, not "下一通来电".
   - Does a main-flow continue button or helper label imply replay, recap, or audio review, such as "continue listening to original audio" or "call replay"? If yes, use neutral dialogue-forward copy like "continue" and "previous dialogue".
   - Does a main-flow action area add labels or notes that only explain the UI, such as "麦上动作" or "麦还连着"? If yes, remove the label layer and let the buttons stand on their own.
   - Does a collapsed review/backlog affordance use archive labels such as "前文对话", "开场对话", or "上一轮追问后"? If yes, replace it with one plain live-call phrase such as "上一问".
   - Do background live-room chips sound like AI workflow instructions, such as "continue chasing the original quote", "listen to the next original line", or "key original quote"? If yes, rewrite them as natural audience/host atmosphere: "麦里有回声", "话没说满", "弹幕压一压".
   - Does a current-choice hint tell the player which hidden route axis to use, such as "first look at money flow/material edge/process control"? If yes, remove the axis hint from the play screen. Route tendencies belong in recap, not before the choice.
   - Does the deep-question screen show scoring or completion copy such as "full-hit follow-up" or "key points connected"? If yes, remove it and let the host question itself carry the moment.
   - Does the recap or conclusion page sound like a grading rubric, lesson, or best-answer comparison, with words like "sharper conclusion", "best answer", "full score", "badge", or "problem reveal rate"? If yes, rewrite it as host wrap-up and live-room aftertaste.
   - Does the recap score label use abstract AI-flavored copy such as "the taste left in the mic"? If yes, replace it with a plain diegetic phrase like "话头收住".
   - Does a result card or share line use essay-like psychology framing such as "what stopped me was..." or "what made me uneasy was not..."? If yes, remove the self-report frame and state the live fact directly: "审批图过了，可付款状态和收款账户都没露。"
   - Does the route map show a material inspection as a numbered dialogue beat? If yes, label it as material so the player remembers it was a different action.
- Does the story-pack final small print explain the mechanics, such as "different hosts take different routes"? If yes, generate a line from the actual route result instead.
- Does the interlude summarize the previous case with generic bookkeeping text, such as "just note that call", or title the next card "next call/case"? If yes, rewrite it around the previous case object, player route, and next dramatic object.
- Does the live-call HUD or result card actively help the player clear the case, such as showing "caught x/y", "asked x/y", "one line missing", route-axis instructions, or missing core issues? If yes, remove those from the playable route. Keep route and tendency data for aftermath only, and do not list the answers the player missed.
- Does the route-map recap show five identical axis labels with no memory of the actual questions? If yes, add per-beat question summaries or route tones so the player can recognize their path.
- Does the choice-group hint name the wrong route axis, such as calling a wording/identity question "money flow" only because the scene mentions income? If yes, adjust route metadata or inference priority.
- If the player picked the strongest final quote, does the recap duplicate the same quote/response as both "picked" and "better"? If yes, collapse it into one confirmation card.
- Does a story-pack hidden thread appear before the player finishes the pack? If yes, move it to the final recap. The hidden thread should connect repeated pressure patterns after play, not spoil the cases up front.
- Are dynamic barrage waterfalls or a full phone simulator being added as quick polish? If yes, stop and design them separately first; both can easily occlude text, harm performance, or make the live-call UI feel like a phone shell instead of a host control desk.

4. Patch narrowly.
   - Edit the source template and any normalization/migration copy that can overwrite old saves.
   - If a stale local state can preserve bad text, add a migration trigger that detects old phrases and replaces the case data.
   - If a new screen imports changed JS modules, bump all cache query versions in `index.html`, `src/*.js`, and `scripts/verify-logic.js`.

5. Validate mechanically.
   - Run `npm run check`.
   - Run `npm run build:h5`.
   - Run `npm run smoke:browser` after playable flow, bundler, route, material, recap, input focus, or content-pack runtime changes. It must cover perfect, outer-only, material-miss, keyboard-perfect, and gamepad-perfect routes.
   - Run `npm run build:steam` and `npm run smoke:desktop` after any build, desktop, save, input, or packaging-adjacent change.
   - For content-pack edits, run `npm run verify:pack -- <pack-id>` and confirm `PACK-005` passes. Runtime-loaded cases must have playable nested content, not only top-level metadata.
   - For keyboard or controller changes, keep the pure input model covered by `INPUT-001`; browser/device replay is still required before calling Steam Deck support done.
   - Search for removed phrases with `rg`.
   - Treat old phrases found only inside migration triggers as acceptable; anything user-visible must be removed.

6. Validate experientially.
   - Reopen the browser with the new cache key.
   - Replay the path from the start.
   - Click at least one strong route and one outer route; for branch-heavy edits, sweep all scene options, but verify each run remains linear and never lets the player sweep leftover options in-place.
   - Confirm the actual screen text, not just the source code.

7. Promote repeated findings into regression standards.
   - If a playtest issue would apply to more than the current line, add it to this skill before or alongside the fix.
   - If it is mechanically detectable, add a check in `scripts/verify-logic.js` or `scripts/verify-narrative-flow.js`.
   - If it is a writing or pacing standard, add it to `docs/dialogue-continuity-audit.md` and the checklist below.
   - Do not leave recurring issues as one-off notes in chat.

## Dialogue Continuity Regression Checklist

Use this checklist whenever playtesting exposes a bad-feeling call flow:

- The first screen gives only the event hook, not the answer.
- The story-pack title screen should sell the incoming call, not explain the thesis or show a case list. Do not reveal the number of cases, titles, act labels, or later objects on the first screen.
- Story-pack live screens should also avoid directory language. The player can know a new call is coming, but should not see act names, case titles, "case 1/4", or package labels while still inside the live-call flow.
- Story-pack interludes should feel like a live program cut, not a content directory. The previous card should name what changed in the last call; the next card should use a dramatic object such as "表格", "资料图", or "审批截图", not "下一案 / 下一通来电" as a title.
- Each scene adds one new pressure or fact. If two major facts appear in the same caller statement, split or move one later.
- The dramatic object should be layered: first the object appears, then its missing edge, then its purpose or payoff.
- Caller self-interest belongs in the back half or the full-hit deep question unless the case is explicitly about the caller's opening confession.
- Host questions can only use facts already visible on screen. If a host question assumes a later reveal, move the question later or seed the fact earlier.
- Multi-turn opening dialogue must not end on an unanswered host question. A two-line hook can end with the host asking the caller to continue, but once the opening has already included a caller answer, the next visible break should land on caller speech.
- Outer options must still be plausible host questions. They can reveal less, but should not feel like intentionally bad answers.
- Guarded answers are not bonus confessions. If pressure made the caller defensive, the answer should withhold, hedge, or give fewer specifics. It must not reuse the deep-followup confession, recap conclusion, or final quote payoff.
- The deep question must refer to at least two facts already heard in the call and should expose the caller's own stake, cost, face-saving edit, money position, or hidden ask.
- The final quote-pick must be a line the player already heard or a tight compression of heard lines.
- The recap may name the pattern, but only after the route has disclosed the facts that support it.
- Live-room status text should help the player read progress. It should not look like unexplained system judgement, and repeated helper notes should change by route tone, material type, or progress.
- Live-room status text must not help the player pass. Avoid real-time hit counts, missing-answer hints, route-axis names, and "look at money/material/process first" instructions during play.
- Portrait and expression text should make the caller feel alive: small physical tells, pauses, and mic-side reactions. Keep them short and varied; do not use them to reveal the correct question.
- Recap and deep-followup wording must match the visible caller/respondent assignment. If a case may swap roles, avoid hard-coded "他/她" and use "咨询者 / 同事 / 对方" instead.
- Training-script or impure-intent hooks are useful, but they must be diegetic and grounded in visible text: "话太顺了", "甜话后面接要求", "流程词说得太熟". Do not derive these hooks from hidden contradictions, unseen answers, or route metadata the player has not earned.
- Route-map recap must preserve player memory: each beat should show at least the route axis plus a short trace of the actual question or tone.
- Material inspection belongs in route-map memory too, but it should be marked as material. Do not number it like another dialogue statement.
- Choice-group hints must match the player's actual question intent. Material, identity wording, money flow, process control, and caller credibility are different axes even when they appear in the same scene.
- Current-node choices must not render as two lonely one-button groups. A small choice set should live in one panel, and the buttons should read as host questions, not as UI categories explaining the question type.
- Button text is not a legend. Do not label choices with route categories, difficulty categories, or designer shorthand. If the player can ask it, show the question. If it only explains the design, keep it out of the live-call UI.
- Current-node buttons should have equal visual weight. Hidden core/outer route data must not leak through color, border, card style, placement labels, or "recommended" emphasis.
- Main-flow button groups do not need a heading. Avoid filler labels such as "麦上动作" and "麦还连着"; they make the screen sound like a prototype.
- Backlog/review affordances should not sound like document categories. Prefer "上一问" over "前文对话 / 开场对话 / 上一轮追问后".
- Host options should not sound like psychological labels or edited outline copy. Prefer "你当时有没有起疑心", "你为什么没继续问", "这句话后面接了什么", or "话当时没说死，你当时怎么回他的" over "你是不是先心疼/你是不是也怕/关系一直没说死，你当时怎么接的".
- If a user points out a bad feeling during playtest, immediately classify it as: early spoiler, repeated beat, unsupported host leap, caller too clean, weak outer option, recap overreach, UI confusion, route-map blur, template prompt repetition, or platform/control friction.
- Live-room reaction copy must name a concrete thing that happened. Avoid abstract atmosphere meters unless the line also tells the player what was actually pulled off course.
- Audience patience depletion is a failed attempt for the current call. Do not jump to the next call or the story-pack summary from that screen; let the player retry from the step that broke the call.

## Writing Work

The screenwriter contract, writers-room passes, integrated writing loop, story packet template, and dialogue rewrite rules now live in `project-skills/case-scriptwriting/SKILL.md`. Use that skill to write or rewrite content, then return here to review the played flow.

## Common Bugs From This Project

- Host asked "哪里让你不踏实" before the caller had said she felt 不踏实.
- Caller mentioned "证明" without a natural reason for why proof was being sent.
- A supposedly playable clue screen stated the answer directly: 学制, 合同主体, 收入完整页.
- Feedback under "咨询者" used third-person narration: "她想了一下".
- Branch feedback appeared as an unlabelled paragraph instead of a caller bubble, making the click feel like a system note rather than a live call.
- `通话回放` leaked later facts during early scene-review screens. Replays must only include already visited beats.
- A respondent line appeared while the active portrait still showed the caller.
- A daily case used "回拨新情况 / 后台账单 / 主播记事" as standalone speakers. These must be rewritten as caller actions.
- A generic evidence page showed "钱和资源谁承担" inside a screenshot-authenticity case.
- "条件听着已经不错" was an obvious no-click answer, making the player feel tested rather than clever.
- "三张图都是真的，先认下来" was also a no-click answer. It was replaced with a plausible outer angle: asking whether the caller would still mind if the original images were later completed.
- "阶段判断" and "资料核验不是势利" made the flow feel like instruction instead of a livestream.
- Do not use internal mechanics as visible copy. Prefer clear player actions such as "听下一段", "选一句原话", and case-specific host lines.
- The recap page once read like a normal text page, then over-corrected into a score loop. Keep aftermath flavorful, but do not turn it into a grading sheet.
- The contradiction log was capped too tightly, so later material notes pushed out early core issues and a full-feeling run scored only 50%. Score validation must happen after a full linear path, not immediately after the first correct branch.
- The old daily flow forced players through extra statement/material pages before the final response, making a short case feel cumbersome. The current route should finish after every key scene has exactly one chosen answer, with only one conditional full-hit deep question before final quote-pick.

## Standard Verification Commands

```bash
npm run check
npm run build:h5
npm run smoke:browser
npm run build:steam
npm run smoke:desktop
npm run verify:pack -- steam-demo-01
rg -n "old phrase 1|old phrase 2|old phrase 3" index.html src scripts/verify-logic.js
```

Build notes:
- `build:desktop` owns playable generation and desktop staging in one locked script. Do not split it back into chained npm commands; concurrent `build:steam` and `smoke:desktop` must not trample `dist/playable` or `dist/desktop-electron`.
- `package:win` still needs a Node 22.12+ Windows-capable environment for real packaging validation.

## Final Response Pattern

Report:
- what was reviewed
- the main classes of friction found
- what changed
- the exact validation commands run
- whether browser replay passed

Keep it short. The user mainly needs confidence that the flow was actually played, not just inspected.
