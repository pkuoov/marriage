---
name: detective-plot-coupling-review
description: Use when designing, reviewing, or revising 《直播间大侦探》 cases through detective-fiction structure: clue coupling, fair-play reveals, false solutions, witness self-interest, reversal timing, quote-pick payoff, and hidden story-pack threads.
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
8. Reversal: the moment when an earlier sentence changes meaning.
9. Boundary: what can be confirmed, what was edited, and what remains unknowable tonight.
10. Quote payoff: the final line the player can pick because they heard it earlier.

If a case cannot fill these ten slots, do not add more dialogue yet. Fix the pressure system first.

## Fair-Play Checks

- Every final accusation or quote-pick must point back to an on-screen line, material mark, or callback material.
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
- What would break if this beat were removed?

If the answer is "nothing breaks," merge the beat, replace it with a material action, or make it carry a missing edge.

## Story-Pack Checks

A story pack needs a hidden thread, but it must not announce itself early.

- Each case should have a different surface world and object, while repeating one deeper pressure mechanism.
- The player should feel the echo during play through objects, callbacks, route consequences, and comments, not through an opening thesis.
- The final recap may name the pattern only after the player has finished the pack.
- Do not force every case into the same villain shape. A collection is stronger when the same pressure produces different levels of harm.
- If a later case is meant to break the pattern, it needs a mechanical difference too: extra material, a tighter deadline, a different false solution, or a different way the caller edits themselves.

## Rewrite Order

1. Fix the ledger.
2. Mark each clue as setup, misdirect, missing-edge, reversal, or payoff.
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

