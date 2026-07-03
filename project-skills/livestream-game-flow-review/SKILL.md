---
name: livestream-game-flow-review
description: Use when reviewing or improving a dialogue-driven livestream mystery game flow, especially to find preachy copy, broken conversation logic, premature spoilers, speaker/portrait mismatch, generic UI leftovers, weak story-pack pacing, or anything that blocks a satisfying live-call playthrough.
---

# Livestream Game Flow Review

Use this skill when the task is to review, debug, or improve a playable live-call flow for a dialogue mystery game. The current main product shape is a Steam-first story-pack collection: the demo pack currently has four anonymous call-in cases, but future packs can have any count that fits the theme. Each case still uses the single-caller daily-case contract as its playable unit. The goal is not just correctness. The goal is a replayable, shareable flow that feels like a live emotional-host call-in room: tense, natural, and satisfying.

## Core Principle

This is a game and a narrative text experience, not a tutorial, worksheet, consulting product, or pass-helper. Do not add copy or logic that actively helps the player clear the case. Let the player read, suspect, choose, miss, and replay. Guidance, route axes, scoring, and conclusions should stay off the live-call screen. A pressure meter is allowed only when it represents diegetic live-room attention, such as audience patience, and it must create risk rather than reveal answers.

Before continuing broad optimization work, read `docs/unfinished-backlog.md`, `docs/roadmap.md`, and `docs/game-unit-test-cases.md`. Do not rely on chat memory for unfinished work. Promote any repeated complaint into one of those files or this skill before ending the turn.

For broad "continue optimizing" requests, choose exactly one active direction before editing. Current active direction is the livestream control system: material operation first, live-room pressure second, recap payoff third. Do not mix this with AI free questioning, desktop shell work, new story expansion, or unrelated UI polish in the same pass unless the user explicitly asks for that combination.

UI identity is part of the livestream control system, not decorative polish. The first live-call screen must read as a broadcast control desk before it reads as a visual novel: ON AIR signal, current call segment, audience patience, backend material, and the call monitor should be visible as diegetic live-room surfaces. Do not solve UI weakness by adding tutorials, route hints, case-file exposition, or "how to play" text.

Do not review from code alone. Play the flow like a first-time player, capture what is actually on screen, then patch code only after the lived flow reveals the problem.

Do not generate or repair daily-case text one field or one sentence at a time. Daily cases must be written as one integrated call first, then split into UI fields. If one line changes the motive, pressure, object purpose, or responsibility balance, regenerate the whole local chain around it: opening, scene beat, current-node options, feedback, optional full-hit deep question, final quote-pick, recap/share copy, and migration copy.

## Screenwriter Contract

Before writing UI fields, write the case as a small pressure system, not as a mystery answer. The player should feel they are listening to someone slowly reveal a messy relationship or public-life conflict, while the live room argues over which sentence is off.

## Network-Informed Script Generation Model

Use online screenwriting and interactive-fiction methods as process inspiration, not as formulas to copy.

Borrow these principles:
- From screenplay beat outlines: a case needs setup, pressure, reversal, cost, and resolution, but each beat must stay inside a live call.
- From Pixar-style story-spine thinking: know the final audience argument before drafting the middle. The case is not ready until the writer can say what the comment section will fight about.
- From Ink/Twine-style interactive writing: choices can branch briefly, but they must rejoin the linear call with state tracked. Do not create an uncontrolled branch tree for a story-pack case.
- From LLM writers-room research: split generation into roles. A single pass that writes fields directly is not acceptable.

Required writers-room passes:
1. Showrunner pass: define the story-pack theme, value boundary, case count, and why these cases belong together.
2. Ending-first pass: write the final audience argument and the behavior chain before writing dialogue.
3. Pressure-system pass: define why tonight, dramatic anchor, object purpose, caller stake, other stake, third pressure, and truth boundary.
4. Beat-ladder pass: draft 5-6 caller statements that each add a new pressure, not a restatement.
5. Branch-design pass: for each beat, write 2-3 plausible host questions with different route axes and reveal depth.
6. Actor-consistency pass: separately ask what the caller, the other party, and the third-pressure source each gain by saying less than the full truth.
7. Continuity QA pass: read the whole call aloud and check that every reveal follows from what is already on screen.

Five-beat minimum for a 20-minute case:
1. Surface oddness: material, quote, bill, screenshot, or action first appears.
2. Missing edge: the object proves something, but not what someone wants it to prove.
3. Interest path: money, status, face, opportunity, process control, or emotional leverage appears.
4. Caller edit: the caller admits, softens, or exposes their own self-serving version.
5. Responsibility point: the cost or boundary lands, enabling the final quote-pick.

If a generated case cannot fill these five beats without repetition, it is not a 20-minute story-pack case. Combine it with another material, add a third-pressure source, or reject it.

Value baseline:
- Do not harvest gender conflict. A case may involve dating, marriage, family, work, money, or identity, but the conclusion must not imply "men are like this" or "women are like this".
- Unite decent people: people who communicate honestly, respect boundaries, take responsibility, and correct themselves when facts become clear.
- Hit harmful behavior: lying, manipulation, exploiting goodwill, shifting costs, borrowing family/status/platform pressure, using affection or opportunity as leverage, and refusing accountability.
- Gray-zone writing is allowed only to separate sincerity, weakness, self-protection, avoidance, mutual harm, and harmful conduct more accurately. It is not permission to excuse bad behavior or flatten different levels of responsibility.
- Mutual-harm cases are allowed and often desirable. If both sides harm each other, name the concrete behavior chain on each side, who started or escalated the imbalance, who carried the actual cost, and which boundary would stop the harm from continuing.
- Point criticism at choices, incentives, responsibility, and concrete behavior, not at gender, class, job, age, region, or other identity labels.

Every daily case must have:
- `whyTonight`: why the caller phones in today, not last week or next month.
- `objectPurpose`: why the screenshot, proof, bill, contract, voice note, table, or chat log exists in the relationship.
- `callerBenefit`: what the caller gains by telling the story this way.
- `otherBenefit`: what the other party gains by showing, cropping, delaying, wording, or hiding something.
- `thirdPressure`: whose mouth or expectation is being borrowed: parents, friends, platform, ex, matchmaker, boss, money deadline, public image.
- `truthGradient`: at least three layers: true, edited, and still unknowable.
- `audienceArgument`: what viewers will argue about after sharing, not what lesson they learned.

Every story collection must have:
- a deliberate case count with distinct dramatic anchors or pressure systems; the demo has four, but the rule is theme-fit, not fixed quantity
- one clear story-pack theme and thesis that every case echoes
- a stable `storyKey` so players can replay or share the same set
- each case preserving the single-caller linear loop
- hidden route-map data for every playable choice, such as caller credibility, counterparty credibility, material edge, money flow, process control, identity wording, or outer detour
- a final story-pack recap that summarizes the player's dominant route tendency without pretending that a different route was never possible
- a comment-wall recap that sounds like real discussion, but is generated from the player's actual route, issue reveal ratio, and story-pack theme
- interlude screens that connect the previous case to the next through player route, case object, and story pressure, not through directory titles such as "next case" or "case 2/4"
- no visible act labels, case directory labels, or pack structure while the player is still inside the live-call flow

For material-centered cases, write a clear truth boundary before writing dialogue:
- `true`: what the screenshot, balance, diploma, bill, chat, or proof actually establishes.
- `edited`: which missing edge changes the social meaning: project type, contract body, income composition, money source, account freeze, timeline, sender intent.
- `possiblyFalse`: which implied claim may be false even if the image is real.
- `unknown`: what the current call still cannot prove and should remain arguable.

Material inspection is a playable beat, not a hint panel. A correct material pick should add a contradiction and keep audience patience unchanged. A wrong material pick may consume patience, but it must not reveal the correct answer. The route map should mark material beats as material, not as a fake sixth dialogue scene.

Host investigation and evidence backflow may expand the reasoning range, but only after the player has already heard the relevant contradiction. Treat these as a controlled extension of the material system: backstage verification, post-call direct messages, or limited off-mic inquiries can add fixed materials, not freeform facts. They must never turn into open-world investigation, AI-generated evidence, or a second-party live debate. Every backflow item must state why it appears now, which heard contradiction it relates to, what it proves, and what it still cannot prove.

Use an "Ace Attorney-style reveal" only when the host asks a natural question the caller has already made possible. The reveal should answer a practical why:
- Why did this person need a bank flow instead of a balance screenshot?
- Why did this proof appear before the meal, meeting, transfer, cohabitation, or family talk?
- What later arrangement, money ask, face-saving need, or deadline was hiding behind the innocent wording?

The reveal must add a new disclosed fact, not a narrator lesson. After the reveal, update the final quote-pick and share copy around that fact.

For the main playable beat, use a linear Ace Attorney-style call loop:
- Let the caller advance one statement at a time.
- At each statement, ask only about this current point, using copy like "这个点最该深入问什么".
- Offer 2-3 plausible host angles for that statement.
- None of the angles should be completely wrong. They should differ by how close they get to the core issue.
- The caller answer should reveal a new detail, a softened responsibility, or a pressure shift. It should not tell the player the lesson.
- The player may choose exactly one angle per statement. After that answer, the route moves forward; do not allow sweeping the remaining options on the same node.
- Each on-screen exchange should be at most two back-and-forth turns. If the text is long, collapse it to one host question and one caller answer.
- After answering, move forward to the next statement. Do not let the player return to the first choice menu and sweep old statements.
- If every core node is hit, insert exactly one non-choice "深入一问" before the final "选一句原话" moment. This question should surface the caller's own stake, cost, family pressure, money position, or hidden ask.
- If the player misses one or more core nodes, skip the deep question and move to the final quote-pick after all statements have received one choice.
- Avoid "上一句", "后来呢", and player-like transport controls in the main route. The flow should feel like a call progressing, not a menu being managed.

The host's logic must be cleaner than the caller's logic. Caller speech can jump, defend, omit, and self-justify. Host questions must follow only from what has already been said on screen. If the host asks a question that assumes a later reveal, rewrite the preceding caller line or move the question later.

Do not use "motive" as a vague label. Name the concrete payoff:
- protect face with family
- pass a parent screening
- reduce follow-up questions
- push a meal, meeting, transfer, cohabitation, wedding step, or apology to happen
- delay a hard disclosure
- keep an already-defended relationship from making the caller look foolish
- turn a mutual negotiation into a one-sided grievance

Prefer:
- conversation over instruction
- live-room tension over case-file analysis
- delayed disclosure over early explanation
- plausible choices over obvious right/wrong answers; current daily flow has no wrong answers, only core issue hits and outer-angle misses
- a short main path with one conditional deepening beat; after each scene statement receives exactly one choice, the player proceeds to the final live-room response without being forced through follow-up menus or material questions
- in-character feedback over narrator diagnosis
- single-caller daily cases over two-sided confrontation
- every speaker having self-interest, omissions, or face-saving edits
- conclusions that protect sincere people and identify harmful conduct clearly
- mutual-harm conclusions that separate both sides' behavior, severity, cost, and next boundary instead of using a vague "both are wrong"

Avoid:
- gender-war framing, rage-bait labels, or copy that invites players to attack men/women as a group
- making gender, class, job, age, region, or appearance the causal answer to a case
- teaching words such as "核验", "证据链", "阶段判断", "正确", "错误", "必须", unless the current screen truly needs them
- buttons that describe mechanics instead of dialogue intent
- giving away the hidden issue before the player earns it
- one obviously bad choice that turns the game into a reading-comprehension quiz
- generic case buttons bleeding into a specific daily case
- writing the relative victim as a perfectly reliable narrator unless the case is intentionally about a pure scammer
- letting the other party enter the daily live room as a direct speaker
- inserting "后台账单", "回拨新情况", "主播记事", or other system/material speakers inside daily scene/deep-question beats

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
   - Does a story-pack bridge, chapter thesis, or marketing-style explanation appear under live-call dialogue? If yes, move it to the title, interlude, or summary screen. The call screen should contain call content and controls only.
   - Does the title screen display a thesis, moral judgement, number of cases, or a table of case titles before the player hears the cases? If yes, replace it with a live-room hook. The theme and structure can appear after the story has been played.
   - After the player enters the first call, do the HUD, dialogue eyebrow, interlude, or next button still expose pack structure, such as "four-case story collection", "case 1/4", named act labels, or "next case"? If yes, rewrite those as live-room language: "热线连线", "匿名来电", "接入下一通", "今晚收麦". Interlude card titles should use dramatic objects, not "下一通来电".
   - Does a main-flow continue button or helper label imply replay, recap, or audio review, such as "continue listening to original audio" or "call replay"? If yes, use neutral dialogue-forward copy like "continue" and "previous dialogue".
   - Does a main-flow action area add labels or notes that only explain the UI, such as "麦上动作" or "麦还连着"? If yes, remove the label layer and let the buttons stand on their own.
   - Does a collapsed review/backlog affordance use archive labels such as "前文对话", "开场对话", or "上一轮追问后"? If yes, replace it with one plain live-call phrase such as "刚才说到".
   - Do background live-room chips sound like AI workflow instructions, such as "continue chasing the original quote", "listen to the next original line", or "key original quote"? If yes, rewrite them as natural audience/host atmosphere: "麦里有回声", "话没说满", "弹幕压一压".
   - Does a current-choice hint tell the player which hidden route axis to use, such as "first look at money flow/material edge/process control"? If yes, remove the axis hint from the play screen. Route tendencies belong in recap, not before the choice.
   - Does the deep-question screen show scoring or completion copy such as "full-hit follow-up" or "key points connected"? If yes, remove it and let the host question itself carry the moment.
   - Does the recap or conclusion page sound like a grading rubric, lesson, or best-answer comparison, with words like "sharper conclusion", "best answer", "full score", "badge", or "problem reveal rate"? If yes, rewrite it as host wrap-up and live-room aftertaste.
   - Does the recap score label use abstract AI-flavored copy such as "the taste left in the mic"? If yes, replace it with a plain diegetic phrase like "话头收住".
   - Does the route map show a material inspection as a numbered dialogue beat? If yes, label it as material so the player remembers it was a different action.
   - Does the story-pack final small print explain the mechanics, such as "different hosts take different routes"? If yes, generate a line from the actual route result instead.
   - Does the interlude summarize the previous case with generic bookkeeping text, such as "just note that call", or title the next card "next call/case"? If yes, rewrite it around the previous case object, player route, and next dramatic object.
   - Does the live-call HUD or result card actively help the player clear the case, such as showing "caught x/y", "asked x/y", "one line missing", route-axis instructions, or missing core issues? If yes, remove those from the playable route. Keep route and tendency data for aftermath only, and do not list the answers the player missed.
   - Does the route-map recap show five identical axis labels with no memory of the actual questions? If yes, add per-beat question summaries or route tones so the player can recognize their path.
   - Does the choice-group hint name the wrong route axis, such as calling a wording/identity question "money flow" only because the scene mentions income? If yes, adjust route metadata or inference priority.
   - If the player picked the strongest final quote, does the recap duplicate the same quote/response as both "picked" and "better"? If yes, collapse it into one confirmation card.

4. Patch narrowly.
   - Edit the source template and any normalization/migration copy that can overwrite old saves.
   - If a stale local state can preserve bad text, add a migration trigger that detects old phrases and replaces the case data.
   - If a new screen imports changed JS modules, bump all cache query versions in `index.html`, `src/*.js`, and `scripts/verify-logic.js`.

5. Validate mechanically.
   - Run `npm run check`.
   - Run `npm run build:h5`.
   - Run `npm run smoke:browser` after playable flow, bundler, route, material, recap, input focus, or content-pack runtime changes. It must cover perfect, outer-then-core, material-miss, keyboard-perfect, and gamepad-perfect routes.
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
- Backlog/review affordances should not sound like document categories. Prefer "刚才说到" over "前文对话 / 开场对话 / 上一轮追问后".
- Host options should not sound like psychological labels or edited outline copy. Prefer "你当时有没有起疑心", "你为什么没继续问", "这句话后面接了什么", or "话当时没说死，你当时怎么回他的" over "你是不是先心疼/你是不是也怕/关系一直没说死，你当时怎么接的".
- If a user points out a bad feeling during playtest, immediately classify it as: early spoiler, repeated beat, unsupported host leap, caller too clean, weak outer option, recap overreach, UI confusion, route-map blur, template prompt repetition, or platform/control friction.

## Integrated Writing Loop

Use this loop when creating a new daily case or making any narrative change larger than typo polish.

1. Write the unified story packet before touching UI fields.
   - `whyTonight`: why the call happens now.
   - `relationshipStage`: why this call happens today.
   - `pressurePoint`: what family, money, status, timing, platform, or relationship pressure creates the call.
   - `dramaticAnchor`: the concrete object, quote, screenshot, proof, bill, agreement, table, or transfer record that makes the live room argue.
   - `objectPurpose`: what the object is trying to prove, soften, excuse, delay, or force.
   - `callerStake`: what the caller gains by telling it this way and what they are hiding, softening, or afraid to admit.
   - `otherStake`: what the other party gains by showing/hiding/wording things this way and what they would lose if fully exposed.
   - `thirdPressure`: parent, friend, platform, ex, family role, or public image pressure if it exists.
   - `truthBoundary`: which parts are real, which are edited, and which remain unknown.
   - `quotePickCandidates`: 3 short lines the player could later press and argue about.
   - `finalQuestion`: what the audience should argue about after the case, not a lesson.

2. Write the stitched transcript.
   - Opening must be a caller line, host bridge, caller answer.
   - Opening should be stair-stepped, not bundled. The caller's first line should only give the call reason. The host then asks for relationship source and current stage. The caller then gives "how they met" and "where the relationship has progressed." The host only asks about the suspicious trigger after that trigger is named.
   - Then write each scene beat as `caller statement -> one host option chosen -> caller feedback -> next caller statement`.
   - Then write the full-hit deep question as `host deep question -> caller answer`. This is not a choice set and only appears when every core node was hit.
   - Place the best quote-pick line late enough that it feels earned. Early dialogue may contain bait lines, but it should not state the full answer.
   - Read it aloud as one phone call before splitting it into `openingDialogue`, `sceneVersions`, `questionOptions`, `deepFollowup`, and final quote-pick choices.

3. Only then split into data fields.
   - Each UI field must be traceable back to the story packet.
   - No field may introduce a motive, fact, object, or conclusion that did not appear in the stitched transcript.
   - An outer branch can reveal less, but it must still point at the same case core. Do not use generic emotional outer angles such as "do you still like them" unless the case core is actually emotional attachment.
   - Quote-pick choices must be copied from disclosed lines or compressed from disclosed lines. They are not labels for hidden conclusions.

4. After any line edit, rerun local coherence.
   - Ask: whose face, money, status, safety, or convenience does this sentence protect?
   - Ask: did this sentence change who pushed the dramatic object into the call?
   - Ask: did this sentence make an earlier option or later conclusion incoherent?
   - If yes, update the whole affected chain, not just the sentence.

Hard rule: a daily case is not assembled from interchangeable good-sounding lines. It is a small pressure system. Every question, answer, option, and recap must preserve the same pressure system.

### Integrated Story Packet Template

```json
{
  "whyTonight": "",
  "relationshipStage": "",
  "pressurePoint": "",
  "dramaticAnchor": "",
  "objectPurpose": "",
  "callerStake": "",
  "otherStake": "",
  "thirdPressure": "",
  "investigationBackflow": [
    {
      "source": "dm|backstage|off-mic-inquiry",
      "triggeredBy": "",
      "appearsNowBecause": "",
      "proves": "",
      "stillCannotProve": ""
    }
  ],
  "truthBoundary": {
    "true": [],
    "edited": [],
    "unknown": []
  },
  "mainAudienceArgument": "",
  "quotePickCandidates": [
    { "quote": "", "surfaceRead": "", "hiddenPressure": "", "responsibility": "respondent|caller|both|none" }
  ],
  "stitchedTranscript": [
    {
      "beat": "opening",
      "caller": "",
      "host": "",
      "callerReply": ""
    },
    {
      "beat": "scene-1",
      "caller": "",
      "options": [
        { "question": "", "role": "main", "callerFeedback": "" },
        { "question": "", "role": "detour", "callerFeedback": "" }
      ]
    }
  ],
  "fieldSplitNotes": {
    "openingDialogue": "which transcript lines map here",
    "sceneVersions": "which caller beats map here",
    "deepFollowup": "which full-hit host question and caller answer map here",
    "accusationChoices": "which disclosed quotes become line-pick choices",
    "shareCopy": "which argument is safe to share without spoiling"
  }
}
```

## Dialogue Rewrite Rules

Daily case contract:
- Daily mode is one live call: host + one anonymous caller.
- No real NPC names are shown in the live room. Use "咨询者", "对方", or role-neutral descriptions.
- The other party never directly joins the daily live room. They can only exist as quoted chat text, voice recording, screenshot, forwarded message, receipt, contract, callback relayed by the caller, or another anonymous submission reported by the caller.
- `sceneVersions` must all be in the caller's mouth. `deepFollowup.answer` must also be first-person caller speech. Do not use "后台账单", "购房材料", "回拨新情况", "主播记事", "聊天截图", or similar labels as speakers inside the flow.
- If a material is important, write the caller action: "我把账单翻出来", "我手里有合同照片", "我把他后来那句回复念一下", "我后来拿到另外两段截图".
- Match the action to the material. A screenshot, balance image, chat log, or proof image is seen, opened, forwarded, cropped, saved, or followed up on; it is not "received/accepted" like a paper document. Do not ask "why did you accept the proof" when the object is just an image. Ask why they did not keep asking, why they forwarded it, why they treated it as enough, or what the image helped them avoid.
- The game is not a courtroom confrontation. The host discovers truth by slowing down one person's account, not by making two parties debate.
- Final judgement can point to "对方" or "这段关系里都有隐瞒", but the gameplay path still comes from the caller's disclosures.
- Backstage verification, post-call private messages, and off-mic inquiries are allowed only as material backflow. They can introduce screenshots, quoted messages, platform records, call notes, or third-party descriptions, but the other party still does not join the live room.

Narrator reliability:
- Assume every person protects their own interest, image, and emotional position.
- A relative victim can still omit inconvenient details, soften their own responsibility, exaggerate injury, or frame a mutual conflict as one-sided.
- Most lines should be "true but edited", not simply true or false.
- Pure scammers can lie more cleanly, but ordinary relationship cases should contain mixed motives and self-serving narration on both sides.
- The host should not instantly believe the first caller. The host can soothe them while still keeping room for what they did not say.

Motive chain:
- Every suspicious material or omission needs a complete logic chain: relationship stage -> pressure point -> hidden action -> intended gain -> risk if exposed.
- A screenshot should not appear because the plot needs evidence. It should appear because someone wants to manage an impression, pass a parent/friend screen, reduce follow-up questions, push a meeting, secure money, protect face, or delay a difficult explanation.
- The other party's hidden information must also have a purpose. Ask what they gain by hiding it now and what they would lose if they said it fully.
- The caller can also have a purpose: protecting face, avoiding "I misjudged them", keeping parents/friends from questioning them, or preserving a relationship they already defended.
- If behavior has no obvious strategic gain, classify it deliberately as a different case type: spoiled entitlement, conflict avoidance, low responsibility, pretending not to understand, genuine incompetence, or malicious but impulsive harm. Do not force every messy behavior into premeditated fraud.

Opening:
- Caller speaks first and gives relationship context.
- Host asks a neutral continuation question.
- Do not pack relationship source, relationship stage, family reaction, suspicious material, and caller doubt into the first caller line. Split them into beats:
  - caller: call reason only
  - host: how did you meet / where has it progressed
  - caller: relationship source + current stage
  - host: what exactly happened at that stage
  - caller: trigger material / quote / pressure point
- The trigger for suspicious material appears naturally, for example: "聊到见父母/以后安排时，对方主动发截图".
- The material's purpose appears naturally too, for example: "对方想先把饭局定下来", "怕父母第一眼把 TA 筛掉", or "想让你先替 TA 向家里解释".
- Caller only names unease after the preceding line gives a reason.

Choice sets:
- Write options as possible host questions or conversation directions.
- Do not use meta options like "找问题点", "分析细节", "开始回放".
- Avoid joke-weak options. A non-core route should sound emotionally tempting or socially common.
- Do not include "please believe / since it is true, accept it" options. No one clicks these. An outer angle should offer comfort, compromise, social face-saving, or a narrower question.
- When possible, make two routes revealing in different ways and one route an outer angle.

Live-room response beats:
- A limited "select the line to respond to" beat can replace abstract final judgement after enough dialogue has been heard.
- Keep it as livestream behavior, not courtroom behavior. The player is choosing how the host/live room responds, not "presenting evidence" or cross-examining another speaker.
- Quote choices should be actual caller lines or very close paraphrases of lines already shown. Do not introduce a new conclusion inside the button.
- Do not mix caller quotes and host conclusions in the same final choice set. The visible choice is the caller quote; the host's response belongs in a separate response/result field after selection.
- Internally the chosen quote can map to respondent, caller, both, or no-premeditated responsibility, but the visible button should feel like selecting line 1 / line 2 / line 3.
- The correct quote should not always be first. Partial-but-tempting quotes should be plausible enough that players argue about them.
- A quote can be suspicious for different reasons: what it assumes, what it skips, who it borrows authority from, what it treats as already settled, or how it shifts the question.
- Do not let the winning quote appear too early in complete form. If the first scene already says the whole answer, rewrite it as a smaller unease and let the decisive wording surface later.
- After selection, explain why that line matters through live-room reaction or caller follow-up, not as a moral lesson.

Feedback:
- If displayed under "咨询者", write as first-person or direct caller speech.
- In daily cases, do not display feedback under "对方". Convert direct defensive speech into something the caller reads or quotes.
- Do not summarize the lesson in the feedback line. Let the response expose attitude, evasion, timing, or missing context.
- Do not render branch feedback as an unlabelled paragraph. On a dialogue screen, clicked branch feedback should become a caller bubble so the player feels the call continued.

- The full-hit deep question should not accuse from nowhere. It should ask the next natural thing after the player has already exposed the core nodes, usually the caller's own financial position, benefit, hidden ask, family pressure, or cost if the truth is fully named.

Replay and recap:
- Backlog/replay must be strictly chronological and state-aware. Before the first key choice, replay may only return to the opening. After a key choice, replay may only show the most recent key choice exchange. It must not expose future nodes, deep follow-up, or final facts.
- The first recap page is aftermath, not a grading sheet. Show the selected final line, route flavor, and live-room aftertaste. Do not show issue percentage, found/total core issues, or missing answers as pass-help.
- The judgement recap must adapt to the player's chosen nodes. A perfect route can name the deeper relationship structure; a partial route should summarize the angle the player actually pursued and the core points still missed.
- Route-map recap must reflect the actual choices made. If the player mostly trusted the caller, questioned the caller, chased money flow, or拆 a screenshot edge, the recap should name that tendency and list the per-beat route trail.
- Weekly comment-wall recap should be sharp but grounded. It may say a route was biased, incomplete, or unusually clear, but it must not attack gender or identity groups, and it must not invent facts the player did not reveal.
- Avoid duplicate recap headings such as "回看 1/5 连线回看"; use a small page counter plus one clear section title.
- If an audience-patience or health-like meter exists, verify it can actually run out and end a case. A health bar that never threatens failure will feel ornamental.

Hidden clue pacing:
- Early lines should expose observable oddness, not the final category.
- Middle lines can reveal concrete missing pieces.
- Final lines can expose intent or responsibility, but still through what someone says or refuses to say.
- A story-pack single case's main scene should usually be 5-6 caller statements advanced one at a time, enough to support at least 20 minutes with recap and route comparison. Each statement gets one current-node choice before the call moves forward, so the player is reading the live call rather than managing a menu.

UI copy:
- Buttons should feel like a linear call: "继续", "选一句原话", and short case-specific questions for the current point.
- Avoid mechanical labels: "阶段判断", "资料核验", "通话回放", "内容提示".
- Avoid product-design labels in choice groups. Prefer one current-question panel with buttons that are just the host's next questions.
- During every big test, read the choice panel aloud. If it sounds like a UI explaining itself instead of a host deciding what to ask next, rewrite it.
- In daily cases, avoid "接哪边的麦", "让另一方补话", or any copy implying two-sided mediation.
- Case-specific summary buttons should reflect the case: screenshot source, missing edge, evasive wording, timing, party switch.
- Investigation copy should sound like live-room backflow, not task UI. Prefer "后台进来一条私信", "有人补了一张图", "这页刚翻出来", or "对方没上麦，只留了这句". Avoid "new clue unlocked", "verification succeeded", "evidence chain complete", "correct route", or any copy that tells the player the system has found the answer.

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
