# Gemini Suggestions Review

Review date: 2026-07-03

This review checks the Gemini suggestion list against the current codebase and the project rules in `livestream-game-flow-review`, `detective-plot-coupling-review`, and the deslop checklist.

## Verdict

Several suggestions are useful in spirit, but a few are already implemented or based on older code. The next safe direction is not to add new UI systems immediately. The next content pass should first add detective clue metadata, then rewrite case dialogue around false solution, missing edge, reversal, and quote payoff.

## Gameplay

### Heat / viewer count

Decision: partially accept as presentation, not as a second failure meter.

Current state:

- The live deck already shows `LIVE 01:24:55` and a viewer count through `src/ui/liveFrameView.js`.
- Audience patience, crowd drift, caller guard, comments, and expression state already come from `src/runtime/livePressure.js`.

Keep:

- Viewer count can visually fluctuate with the existing pressure profile.
- Comments can react more concretely when pressure drops.

Do not do now:

- Do not add a separate heat economy on top of audience patience. Two parallel meters would blur the current rule: wrong direction costs the room's patience and can end the call.

### Diegetic clue logbook

Decision: accept as P2 design, not quick P0 implementation.

Current state:

- The game already has "上一问" as a call-log drawer, and material nodes appear in route recap.
- The current line must stay linear. A free clue folder can easily become a walkthrough panel.

Better version:

- Add a locked "后台夹" that only contains materials the player has actually opened or callback materials already earned.
- It should show images and prior markings, not summaries or recommended next questions.
- It should not expose the full transcript or future facts.

### Static routeAxis data

Decision: already implemented for runtime-loaded content.

Current state:

- `content/packs/steam-demo-01/cases/*.json` already declares `routeAxis` and `routeTone` for scene questions, material targets, and backflow options.
- `scripts/verify-pack.js` requires `routeAxis` and `routeTone` for runtime-loaded cases.
- `src/runtime/routeLog.js` still has regex fallback for old saves, daily fallback templates, and defensive migration.

Action:

- Do not move new content back into `src/caseEngine.js`.
- Long-term cleanup should reduce fallback dependence only after old templates are retired.

### Case 2 / Case 3 correct markers

Decision: reject as stale finding.

Current state:

- Case 2 and Case 3 content JSON both have exactly one `correct: true` per scene.
- `verify:pack` enforces exactly one core question per scene.

Action:

- No fix needed.

## Plot / Story

### Cross-case conspiracy / Easter eggs

Decision: accept only after clue metadata pass.

Problem with direct implementation:

- If background people are tied together too early, the game becomes a conspiracy wall and weakens the live-call realism.
- The current hidden thread is stronger as a repeated pressure mechanism: respectable words and documents shift cost, responsibility, face, or opportunity.

Better version:

- Use recurring institutions, suppliers, agencies, platforms, or introducer networks as late callbacks.
- Keep each single case solvable without knowing the hidden thread.
- Reveal the cross-case pattern in callback materials and final story-pack recap, not in opening copy.

Next prerequisite:

- Add `sceneVersions[].id`, `clueRole`, `falseFrame`, and `payoffFor` before writing the conspiracy layer.

### Defensive lie vs manipulative lie

Decision: accept.

This fits the game's value baseline. It lets the player judge behavior without flattening everyone into villain/victim roles.

How to use:

- Defensive lie: protects dignity, delays shame, hides fear, or avoids family pressure.
- Manipulative lie: moves money, risk, public blame, labor, or opportunity cost onto someone else.
- Mixed case: a defensive lie becomes manipulative once the person keeps using it after the cost is clear.

This should feed truth boundaries and final quote-pick responses, not become moral lecture text.

## Dialogue

### Caller speech with pauses and fragments

Decision: accept, but apply case by case.

Good use:

- Break caller lines when the person is remembering, defending, or realizing something.
- Use pauses sparingly: "我……", "哎", "不是，我当时真没这么想", "我就卡在这儿".

Avoid:

- Sprinkling filler into every line.
- Making all callers sound like the same anxious internet voice.
- Replacing logic with stammering.

### Barrage slang

Decision: mostly reject for main UI, selectively accept for comment-wall flavor.

Why:

- "家人们谁懂啊", "纯纯大冤种", "建议锁死" are high-noise platform slang. They can make the game feel cheaper and push it toward gender-war/rage-bait traffic.
- The current goal is not to harvest outrage. It is to let the room argue over concrete behavior and responsibility.

Better version:

- Use short real comments tied to the case object: "这账单时间不对", "这表不是排班吧", "审批过了不等于到账", "学历不是唯一的问题".
- Keep a few hotter lines for final comment wall only, never as answer hints during play.

## UI / UX

### Virtual phone scrolling for materials

Decision: defer to a separate design pass.

Problem:

- A full phone simulator can fight the host control-desk identity.
- It can make mobile screens cramped and may hide text or targets.

Better version:

- Use phone-frame treatment only for chat screenshots, not every material.
- Bills, schedules, approvals, and profile packets should keep distinct document boards.
- If added, it must pass mobile and Steam Deck readability checks.

### Chat drawer

Decision: already partially implemented.

Current state:

- "上一问" uses a call-log drawer style through `src/ui/callFlowView.js` and `src/styles.css`.

Next:

- Keep it limited to the latest relevant exchange. Do not turn it into a full transcript archive.

### Focus visual

Decision: already implemented.

Current state:

- `focusCurrent` exists in CSS and is covered by UI tests.

Action:

- Keep the effect subtle. Do not make focus look like a recommended answer.

## Art / Aesthetics

### LIVE red dot, scanline, viewer count

Decision: already implemented in first pass.

Current state:

- The live deck includes LIVE time and viewer count.
- Portrait layer has broadcast scan overlay.
- Title and live screens now read more like a control desk.

### Portrait cross-fade

Decision: already implemented as CSS motion, but image variants remain future art work.

Current state:

- `portraitCrossFade` and expression-specific micro-motion exist in CSS.

Next:

- Generate real expression variants later if the art pass needs higher fidelity.

### Material degradation

Decision: accept as optional polish, not core gameplay.

Good use:

- Light glare, finger smudge, compression, scan noise on screenshot/chat material.

Avoid:

- Reducing readability.
- Turning material boards into photorealistic fake evidence with real platform branding.

## Priority After Review

1. Do not spend P0 time on `correct: true`; it is already fixed.
2. Do not move route metadata into `src/caseEngine.js`; runtime content JSON is the source of truth.
3. Add detective clue metadata to content JSON: scene ids, clue roles, false frames, and payoff links.
4. Rewrite dialogue after the clue ledger is explicit.
5. Design, but do not immediately implement, a locked backend clue folder.
6. Keep virtual phone UI and dynamic barrage waterfall as separate design tasks.


## De-AI Scriptwriting Skill (2026-07-03)

Gemini also proposed a scriptwriting skill (`.agents/skills/de-ai-scriptwriting/SKILL.md`). Reviewed and merged; the original file is removed.

Decision: adopt about seventy percent, after revision, into `project-skills/case-scriptwriting/SKILL.md`. That skill also absorbs the writing sections previously inside `livestream-game-flow-review` (screenwriter contract, writers-room passes, integrated writing loop, dialogue rewrite rules), so the three project skills now split cleanly: case-scriptwriting writes, detective-plot-coupling-review checks structure, livestream-game-flow-review reviews the played flow.

Adopted from the Gemini draft:

- Verbal clue techniques: cognitive-dissonance slips, euphemism downgrade, pronominal shift chains.
- Physical clue techniques: accidental attachment, intentional crop, metadata discrepancy (markable-on-board only).
- Casual seeds with later recontextualization, and cross-beat joint verification.
- Guard-state emotional continuity tied to `guardedAnswer`.
- Diegetic comment hints, but gated: pointed hints fire only after a wrong material pick or in the low-patience band; never name the clickable region before the first attempt.
- Rashomon and Gone Girl structures, added to `detective-plot-coupling-review/references/detective-patterns.md`.

Rejected or corrected:

- The translation-table examples that swapped AI flavor for short-video melodrama flavor (`脑子嗡的一声`, `把我当提款机`). Replaced with the plain-register rule.
- Hint-comment examples that named the correct evidence region outright; they would break the single-shot material puzzle.
- Added the missing iron rule the draft lacked: callers report perception and feeling, never the deduction — conclusions belong to the player.
- Its banned-word list is subordinated to the mechanical bans in `scripts/verify-logic.js`; no second authority list.
- Example facts (timestamps, amounts, new materials) are technique demos only; new facts must pass `truthBoundary`, the coupling ledger, and pack QA before entering a case.
