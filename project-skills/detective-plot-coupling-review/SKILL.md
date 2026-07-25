---
name: detective-plot-coupling-review
description: Use when designing, reviewing, or revising 《深夜热线：直播间侦探》 cases through detective-fiction structure: clue coupling, fair-play reveals, false solutions, witness self-interest, reversal timing, quote-pick payoff, and hidden story-pack threads.
---

# Detective Plot Coupling Review

Use this skill when a case needs more than smoother dialogue. It is for checking whether the mystery itself works: whether each clue changes meaning later, whether the wrong path is tempting, whether the final reveal was fairly earned, and whether the story pack feels like one designed collection instead of separate advice calls.

For major story rewrites or new story-pack design, also read `references/detective-patterns.md`. For tiny copy fixes, use the checklist below without loading the reference. For line-level writing — language rules, clue insertion, guarded answers, comment hints, and the stitched-transcript workflow — use `project-skills/case-scriptwriting/SKILL.md`; this skill judges whether the structure holds, that one judges whether the lines are worth hearing.

## Core Rule

This game is not about murder, police work, or genius deduction. Translate detective structures into livestream social evidence: bills, screenshots, work documents, introductions, schedules, receipts, voice notes, family pressure, platform rules, and a caller who is editing the story for a reason.

No reveal may depend on a fact the player could not have noticed, and no recap should lecture the player into the answer. A good reveal revalues an earlier line.

## Case Ledger

Before changing dialogue, write the case ledger in this order:

1. Surface claim: what the caller wants the room to believe first.
2. Dramatic object: the bill, screenshot, table, proof, or quote that anchors the case.
3. False solution: the tempting explanation that feels enough but is not enough.
4. Missing edge: what the object does not show.
5. Interest path: who saves money, face, time, opportunity, status, or responsibility if the surface claim is accepted.
6. Caller edit: what the caller softened, delayed, cropped, or framed to protect themselves.
7. Third pressure: whose deadline, mouth, workplace rule, family expectation, or public image is being borrowed.
8. Physical-verbal lock: which material-board edge makes a spoken claim impossible to smooth over.
9. Reversal: the moment when an earlier sentence changes meaning.
10. Boundary: what can be confirmed, what was edited, and what remains unknowable tonight.
11. Quote payoff: the final line the player can pick because they heard it earlier.

If a case cannot fill these ten slots, do not add more dialogue yet. Fix the pressure system first.

## Trick Taxonomy (诡计分层)

Name what kind of trick carries the case's false solution. A case usually has one primary trick; a pack should vary the type across cases instead of repeating one.

- 感性诡计 (emotional misdirection): sympathy, face, or outrage steers the room away from the load-bearing question. The caller's grievance is real; the direction it points is not. Counter-clue: an interest path that survives the emotion.
- 理性诡计 (logical gap): the surface claim quietly assumes a step nobody verified — approval means payment, a balance means income, a title means the claimed history. Counter-clue: the missing verification named as a material edge.
- 时间诡计 (timeline trick): dates, deadlines, and sequence are compressed or reordered — a due date moved to tonight, spending continuing after the job stopped, proof issued before the question was asked. Counter-clue: two dated facts the player can put side by side.
- 材料边界诡计 (material-frame trick): the document is real but its frame does the lying — a crop, a missing column, an off-screen recipient, a page that stops one line early. Counter-clue: the markable edge on the material board.

A case has two layers, and they usually use different trick types:
- Cover layer (误导层): what keeps the room from looking — almost always 感性诡计. The false solution lives here.
- Load-bearing layer (承重层): what the reveal is actually made of — 理性, 时间, or 材料边界. The missing edge and the reversal must both belong to this one type.

Declare both layers. The failure mode is not "emotional false solution + timeline reveal" — that pairing is the normal good shape (demo case 1: 怕分手 covers 断缴早于借钱). The failure mode is a load-bearing layer that switches type mid-case: a missing edge built on timeline facts whose reversal suddenly hangs on a cropped document nobody dated. One cover emotion, one load-bearing trick type, per case.

## Promise Ledger (伏笔账本)

Track every planted detail the way continuity engines track promises: each seed has a planting beat and a payoff beat, and both failures are real failures.

- Unfired gun: a seeded detail (an amount, a nickname, a deadline, an odd column) that no later beat, material, backflow, or recap ever revalues. Cut it or pay it off.
- Payoff before setup: a reveal that lands before its supporting detail is on screen. Move the seed earlier or the reveal later. This is the mechanical form of the fair-play rule.
- Ledger form: list `seedId -> planted at (beat/material) -> paid off at (beat/material/recap) -> what it revalues`. Keep it in the case QA report; wire `payoffFor` / `revalues` fields so `verify:pack` can eventually flag orphans mechanically.
- Quote mapping is part of the ledger: every `accusationChoices` label maps to the ungated line it quotes, and `quotePickCandidates` in the planning packet must match the shipped `accusationChoices` — candidates that drift from choices are planning debt, the same failure as a metadata-only content pack.
- Aftermath completeness: the recap and truth-boundary sort must touch every paid-off promise and explicitly park the unpaid ones in `unknown`. A clue the recap never mentions reads as author forgetfulness, not mystery.
- Cross-case common-cause ledger: a public shock reused across cases must declare `seed -> professional reinforcement -> public payoff -> revalues -> does not prove`. Seed and payoff may be several cases apart, but the payoff must occur later in story order and behind a player action. A later default, construction halt, or company flight may widen the social cause; it may not retroactively identify an account, establish an old product's exact loss, or excuse a character's earlier choice.
- Shared events must produce different local conflicts. “信托兑付危机” may expose leveraged yield-chasing in one case and a family cash shortfall in another; it cannot serve as a universal explanation pasted onto unrelated debts. Each case still needs its own document rows, testimony, decision, and unknown boundary.
- Ambient promises count too. A siren that approaches and stops, urgent knocking, a suddenly changed room, an object the speaker hides, or an interrupted sentence that the camera/dialogue singles out must appear in the ledger. Classify it as disposable texture, a same-case promise, or a cross-case promise. If it is disposable, no character may point at it; if a character points at it, pay it off or cut it.
- Ambient payoff must be causal, not editorial. Prefer “night A siren + knock force hangup -> night B host questions the hangup -> caller reveals who came and what they asked” over a narrator explaining that yesterday's sound was foreshadowing. Record the narrow `proves` and `doesNotProve` at the payoff beat.

## Suspense Structure Check (悬疑感)

A case has no mystery if the player finishes forming their verdict in scene 1-2 and every later beat only adds weight to it. The generative counterpart of this check — how to compute doubt points and turns from a numbered truth ledger via the six operations — lives in `case-scriptwriting`'s "Manufacturing Doubt, Questions, and Turns". Check three things:

- The false solution must be fed real evidence. If nothing on screen ever genuinely supports "他只是慌了" or "流程真的慢", it was never a live hypothesis and the case is a confirmation march, not a mystery. Give the false solution at least one true fact that survives until the reversal.
- At least one load-bearing fact after the midpoint must flip the reading of an early line, not extend it. "More of the same, worse" is escalation; "that line meant something else" is a reversal. A case needs the second kind.
- The caller's edit must be catchable from the opening (春秋笔法), not only confessed at the end. Plant initiative-hiding wording in the caller's early lines — 「他带我去的那种店」 when the reservation was hers — and let a material or backflow item expose the verb, so the player can catch the narrator instead of waiting for the narrator to surrender. A late confession that was never catchable earlier is a diary, not a Rashomon.
- No pristine victims: a caller may be truly harmed, but the case must still name what convenience, benefit, face, status, or avoided embarrassment made them cooperate with the bad setup longer than their opening version admits. If the caller sounds perfectly clean through the whole live call, the case is not grey-zone writing; it is a verdict with scenery.

## Non-linearity Law (线性禁令)

Structure verdict from live playtest: a case that is one continuous call with NPCs arriving on schedule to explain clues is a reading, not a game — no matter how good the lines are. Laws:

- Every case must contain at least one node where the player decides **what to do next**, not what to say next — and different doings must produce different information states (order and trade-offs, not just flavor).
- At least one stretch of each case's information must be earnable out of order.
- Any proposed new surface that "arrives on schedule and requires no player action" is rejected by default — reposition it behind a player action or cut it.
- NPC three-verb quota, per pack: at least one **refusal** (an NPC demands something the player must go get — through the caller), one **interruption** (an NPC acts unprompted mid-call), one **conflict requiring a choice** (two NPCs' frames collide and the player must adopt one). An NPC whose lifecycle is arrive→explain→exit may not be written.
- Reference structure: the two-call night (`docs/two-call-night-design.md`) — segment 1 → the player's interlude turn → callback whose opening the player assembles.
- Multi-scene quota (场景配额, design: `docs/multi-scene-rashomon-design.md`): every case needs at least two non-console locations (city day / doorstep / observe / sit-in). A pack needs at least one licensed co-presence beat (特许同席). The livestream is one stage in the night, not the only stage.
- Bring-back law (带回律): every daytime location must produce something that can change the callback's first line — a material edge, a bystander's quote, or a table that contradicts testimony on the spot. Atmosphere-only locations are cut.
- Rashomon law (罗生门律): a co-presence beat exists to make two edits collide in the same room (her line vs his half-line vs a third mouth), not to extract a correct answer. Offline co-presence is not "on mic"; the single-caller-on-air contract still holds for ON AIR only.
- Lurker echo exception (同席特许): 「同席特许的当面句允许在麦外来信复现一次，复现即人物。」This exception licenses one exact echo of a line already spoken face-to-face; it does not license a second new sentence, another appearance, or a return in live comments or the final comment wall.
- Preferred overnight rhythm when both interlude and day city exist: night A → short interlude (1–2) → day city (budget 2 of ≥3 places) → night B. Do not stack a full interlude desk and a full day map without merging narrative budget.
- Night-B opener source of truth: when `overnightStructure` exists, callback openings come only from `overnightStructure.callbackOpeners` filtered by the player's `earnedItems`. Interlude inventory that must alter the first callback line must enter `earnedItems` under the same id or an explicit map; otherwise it is an invalid bring-back and must be cut or demoted to non-opening state.
- Night-B first-conflict law: every reachable opener must include either one `firstConflict.hostLine + callerLine` exchange or an alternating `firstConflict.lines` sequence containing both host and caller. Each host question must test the distinct load-bearing issue carried by that item, one question per turn. Changing only `opener.line`, or reusing one generic confrontation across items, fails the bring-back law.
- No dual callback track: `nightStructure` and `overnightStructure` may not maintain disconnected opener tables or competing hangup copy. Use one source of truth, or an explicit mapping whose hangup line and host hold line are identical at the player-facing seam.
- Day-transition seam: if the interlude exits into daytime investigation, its `continueLabel` must name daytime rather than callback. Require exact duplication at the compatibility seam: `nightStructure.hangup.stageDirection === overnightStructure.hangupLine` and `nightStructure.hangup.hostLine === overnightStructure.hostHoldLine`.
- No duplicate load-bearing NPC beat: the same NPC may not carry the same reveal in both an interlude action and a `dayScene` (observe, doorstep, visit, or equivalent). Keep the dramatic beat in one place; delete the duplicate or reduce it to non-load-bearing texture.
- Wired daytime documents: any `dayScene` claimed to alter the callback's first line must grant an `earnedItemId` (or `choice.grantsEarnedItemId`), and that id must have a matching `callbackOpeners` entry. A document with no state-and-opener wire is scenery, not investigation.
- Package feel recommendation: every case should give at least one observe, doorstep, visit, or equivalent off-console scene an in-scene choice. Its branches must change the information state or the carried item; relabeled buttons that converge on the same state do not count.

## Evidence Chain Shape and the Misjudgment Beat (三段证据链与误判拍)

呈堂律 (the exhibit law): core evidence must be entered as a row-level simulated document — dates, amounts, counterparties, memos, rendered as the artifact itself (`docs/demo2-rebuild-blueprint.md`). Prose summaries may only introduce a document, never replace it. A key contradiction with no document beneath it may not be written. 行派生律: key follow-up questions derive from rows the player marked (single-row questions and two-row cross-examinations); a question option with no row or testimony behind it is an unearned question. Empty rows are evidence too; two rows read together beat one — the cross-reference is the soul of document play.

Three-stage evidence chain: a case's core materials should form 支持 → 部分推翻 → 拖入灰区 — the first piece backs the caller's version, the second overturns part of it, the third drags both sides into the grey. Each stage must revalue the previous one (wire via `revalues` / the promise ledger); three pieces that all point the same way are one piece with extra steps. Demo calibration: 账单 → 往期账单 → 会员记录＋朋友圈.

The engineered misjudgment (误判拍): a mystery earns its late turns by letting the player genuinely commit to a wrong reading mid-case, not just hear about one. Rules:

- The misjudgment must be evidence-fed: the wrong reading peaks because real, honest material supports it (the fed false solution at full dose) — never because information was withheld unfairly.
- Give the commitment a surface: a mid-case stance snapshot (无惩罚的阶段性判断, recorded, revisable) turns the misjudgment from a private hunch into an arc the finale can mirror. The snapshot never scores; being overturned by later evidence is its design goal, and the recap shows the player's judgment arc without mocking it.
- The crowd may lead the misjudgment (弹幕带节奏toward the magnetic wrong reading) — this is the sanctioned use of the room's confident wrongness, and the host's wound hook may pull the same direction.
- The correction must not excuse: when the reading flips back, the previously-suspected party keeps whatever genuine faults the middle stage established. A misjudgment that ends in full exoneration is melodrama; one that ends in re-weighting is a mystery.

## Scene Turns, Information Gaps, and the A/B Story

Three scene-level tools, borrowed from screenwriting and courtroom-game design, that turn a confirmation march into a mystery:

A/B story model (from Ace Attorney's case grammar):
- Write both stories in the ledger before dialogue: the A story is what the opening makes the room believe; the B story is what actually happened. Every core question and material mark must convert exactly one A-piece into a B-piece. A beat that converts nothing is filler even if the dialogue is good.
- Order the conversions so the last one flips subject or coverage, not just weight — "who benefited" or "which path the excuse fails to cover" — because the final conversion is the twist, and a twist that only adds more of the same is an escalation wearing a twist's clothes.

Scene value turns (from McKee: a scene that does not turn a value is a nonevent):
- Track 2-3 live values per case — 信对方 / 信来电人 / 责任在谁 — and annotate each beat with the polarity it flips (+/-). A beat must flip at least one.
- Two same-direction beats in a row is escalation; three is a monotone march — restructure or interleave the other value. The demo's original sin was five beats all flipping 信对方 downward.

Information configurations (from Hitchcock: suspense is the audience knowing more):
- Synchronized (player learns exactly when the caller tells) is the default and the weakest. Rotate in the other two:
- Player-ahead (irony window): at least once per case, a material edge or comment is visible before the caller names it, so the player sits on a bomb the caller has not admitted — this is what makes the material board feel like detection instead of confirmation.
- Caller-ahead (pull-forward): a beat may end on a withheld object — 「还有一张图……先不说了」 — but the debt must be paid within two beats.
- Scene endings prefer an open hook over closure: a question raised, an object半露, a friend's silence. Closure belongs to the recap only.

## Two-Source Rule (不能靠猜)

A genre mystery works only if the puzzle is real and the solution is earned. For this game:

- The surface claim must genuinely puzzle: a reasonable viewer could hold the false solution without being stupid.
- Every evidence-check correct answer and final quote-pick must be derivable from at least two independent on-screen sources — a spoken line plus a material edge, or two materials, or a line plus a backflow item. One-source answers are guesses with extra steps.
- The two sources must triangulate, not repeat: each rules out a different wrong reading.
- At least one load-bearing reveal per case must form a **实物-言语死锁**: a physical material edge and a spoken claim trap each other. The material alone is not just "suspicious", and the line alone is not just "fishy"; together they make the old reading untenable. Examples: a bill date against a pressure deadline, a cropped payment page against "approval passed", a private table column against "store template", or a chat top line against "my mom asked".
- If a case can be solved by asking the caller the right question without ever needing the material board, it fails this rule. Rewrite the material, the spoken claim, or the deep question so the psychological break follows from the physical-verbal lock.

## Knowledge Ledger (谁知道什么)

For Rashomon-style cases, drift in who-knows-what is the most common continuity break. Keep a three-column ledger per beat:

- 玩家已知: what is on screen so far.
- 来电人已说: what the caller has actually stated (a subset, self-servingly framed).
- 来电人实际知道: what the caller knows but has not said — this column powers guarded answers, the deep question, and the caller-edit reveal.

Host questions may only draw on column one. Caller slips and guarded answers draw on column three. If a line needs column-three knowledge to make sense but plays before the caller would plausibly reveal it, move it.

The ledger generalizes to every speaking surface — each has a sensor contract:
- 弹幕 knows the call audio, materials already shown on stream, life experience, and the host's public history — never visuals on a voice call, never unshown materials, never identities (see `case-scriptwriting`'s sensor-bandwidth rules).
- Advisors know only what was shown or delegated to them, plus their trade knowledge.
- Backflow senders know only what their own life plausibly carries: the friend knows the朋友圈, the cousin is in the family group, the other woman holds her own copy of the table. A sender whose material exceeds their life is a plausibility break (the 案 3 表妹 fix was exactly this class).
- The absent party knows what they did — and says only the half that serves them.
Audit any new line against its speaker's contract before checking its content.

## Fair-Play Checks

- Every final accusation or quote-pick must point back to an on-screen line, material mark, or callback material.
- Quote-pick source lines must be ungated: the quoted words must live in caller version text, opening dialogue, or another surface every route hears — never only inside one branch's answer. Under one-shot key choices, a branch-gated quote means some players face a "line they heard" that they never heard.
- The strongest answer cannot rely on narrator authority, moral slogans, or a hidden fact introduced only in the recap.
- The wrong or outer choices should be plausible false frames, not obviously stupid answers.
- A missed choice may cost patience, guard the caller, or hide a sharper answer, but it should not make the story incoherent.
- The caller is allowed to be sincere and self-serving at the same time.
- The other party is allowed to be harmful without becoming a cartoon villain.
- The unknown column must stay alive. If tonight cannot prove a thing, the host should not pretend it can.

## Coupling Checks

For each scene beat, ask:

- What earlier line does this beat reframe?
- What later beat needs this information?
- What false solution does this beat temporarily support?
- What cost or pressure becomes more concrete after this beat?
- What physical material edge, if any, locks against the spoken claim in this beat?
- What would break if this beat were removed?

If the answer is "nothing breaks," merge the beat, replace it with a material action, or make it carry a missing edge.

## Story-Pack Checks

A story pack needs a hidden thread, but it must not announce itself early.

- Each case should have a different surface world and object, while repeating one deeper pressure mechanism.
- The player should feel the echo during play through objects, callbacks, route consequences, and comments, not through an opening thesis.
- The final recap may name the pattern only after the player has finished the pack.
- Do not force every case into the same villain shape. A collection is stronger when the same pressure produces different levels of harm.
- If a later case is meant to break the pattern, it needs a mechanical difference too: extra material, a tighter deadline, a different false solution, or a different way the caller edits themselves.
- Meta-reversal (from anthology game design): the pack itself teaches the player a caller-pattern — e.g. three cases in a row where the caller under-reports their own gain — and a late case must break the taught pattern, not just vary the surface. A caller who confesses her stake in the first beat, after three who hid theirs, flips the pack's question from "what is this caller hiding" to "does confessing your stake settle your bill". The break must be both mechanical and thematic, and the finale wall may name it.
- 草蛇灰线 (buried-thread echo, from chapter-novel craft): one concrete formula — a sentence grammar, an object class, a bargain shape — recurs across cases in different skins (老板娘 / 投资你 / 一家人 / 主责署名: a future identity issued against present money). During play each case only shows its own skin; the finale wall collapses the four skins into one grammar. Never let mid-pack copy point at the echo.

## Rewrite Order

1. Fix the ledger, and declare the case's primary trick type from the taxonomy above.
2. Mark each clue as setup, misdirect, missing-edge, reversal, or payoff, and fill the promise ledger: every seed gets a planting beat and a payoff beat, or it gets cut.
3. Rewrite scene statements so each one naturally exposes its clue role.
4. Rewrite host options as natural questions that test competing interpretations.
5. Rewrite guarded answers only after the normal answers work.
6. Move any lesson, thesis, or hidden-thread explanation out of the live call.
7. Update truth boundaries, quote choices, callback materials, and share/recap copy together.

## Data Suggestions

When editing content JSON, prefer adding explicit structure over encoding detective logic in prose:

- `sceneVersions[].clueRole`: `setup`, `misdirect`, `missing-edge`, `reversal`, or `payoff`.
- `sceneVersions[].falseFrame`: the tempting but incomplete explanation.
- `sceneVersions[].payoffFor`: earlier or later clue ids that this beat changes.
- `evidenceChecks[].revalues`: scene ids or quote ids the material changes.
- `accusationChoices[].quoteSourceSceneId`: where the final line was first heard.

These fields should guide writing and validation. They must not show up as player-facing labels.
