# Game Unit Test Cases

This document records the automated unit/contract tests that must run before every major gameplay or UI release.

## Required Release Commands

Run these before tagging or shipping a major version:

```bash
npm run test:unit
npm run check
npm run build:h5
```

`npm run check` already includes `npm run test:logic`, which points to the same unit runner. `npm run test:unit` exists so release checklists can name the intent directly.

## Test Inventory

| ID | Area | Case | Guards Against |
| --- | --- | --- | --- |
| MODE-001 | Mode routing | Unknown modes normalize to `daily` and daily expects one case. | Old multi-mode routes leaking back into the mini-program build. |
| DAILY-001 | Daily contract | Generated daily case has one playable case with scene, testimony, evidence, and clue threshold. | Empty UI from incomplete brief data. |
| DAILY-002 | Determinism | Same `dailyKey` generates the same case, plot, and opening. | Share links showing different cases to different players. |
| DAILY-003 | Date boundary | Default daily key uses fixed UTC+8 day boundary. | Cross-timezone players getting different "today" cases. |
| DAILY-004 | Template guard | Explicit unsupported daily plot IDs throw. | Untemplated plots falling through to broken daily cases. |
| DAILY-005 | Rotation completeness | Eight-day rotation produces complete, playable cases and avoids repeating the same plot/role combination. | Structural gaps or direct same-case repeats in the current limited template set. |
| DAILY-006 | Choice quality | Daily choices reject no-click throwaway options. | Fake choices like "just believe it" returning. |
| DAILY-007 | Case 4 structure | "三张截图" keeps motive chain and `halfTruth` stance. | Regressing to abrupt screenshots or one-sided victim framing. |
| DAILY-008 | Livestream contract | Daily cases stay anonymous and single-caller; every scene/testimony beat is spoken by the caller, with materials only retold or read aloud. | Real names, system-inserted evidence beats, or two-sided confrontation leaking back into the live room. |
| DAILY-009 | Drama and gray zone | Every daily case has a concrete dramatic object/quote and at least one unclear initiator or shared face-saving pressure. | Future generated cases becoming flat “check the clue” exercises with obvious villains. |
| DAILY-010 | Scene question shape | Each daily scene beat has exactly one main advancing question; other options can be detours but cannot silently close the beat. | Strong clue angles disappearing because several buttons are all marked correct. |
| DAILY-011 | Accusation order | Case 4's gray-zone answer is not the first button; tempting partial reads appear before the full answer. | Players passing by position rather than by listening. |
| STATE-001 | Save migration | Legacy saves migrate into daily-compatible shape and preserve settings. | Old saves breaking after refactors. |
| RUNTIME-001 | Outcome math | Internal carryover scores clamp correctly for wins/failures. | Run result values drifting out of range. |
| RUNTIME-002 | Daily pacing | Daily budget has a floor and hint count stays at one. | Mobile short-case pacing getting too long or too guided. |
| RUNTIME-003 | Accusation logic | Stance, structure, clue threshold, and expected accusation interact correctly. | Correct guesses passing without enough clues or wrong responsibility layer. |
| NARRATION-001 | Copy helpers | Core labels and narration helper outputs remain stable. | Share/recap copy losing key terms. |
| CLUE-001 | Clue aggregation | Contradictions dedupe across scene, testimony, and evidence. | Duplicate clues inflating progress. |
| CLUE-002 | Hint selection | Inspiration skips already discovered contradictions. | Daily hint repeating information the player already found. |

## Manual Smoke Checks

Automated tests do not replace one short browser replay after large narrative/UI changes:

1. Open `http://localhost:5174/?ui=<new>&dailyKey=2026-06-24`.
2. Start a fresh daily case.
3. Confirm the opening explains why suspicious materials exist.
4. Confirm only "你" and "咨询者" are present in the live room; no real NPC names or second-party portrait/mic appears.
5. Pick one useful question and one tempting detour.
6. Confirm detour feedback is in-character and live comments react.
7. Solve or fail once and confirm the share card references the actual route or first found contradiction.

## Maintenance Rules

- Add a test whenever a bug repeats twice or a design rule becomes product-critical.
- Prefer testing pure modules (`caseEngine`, `caseRuntime`, `caseNarration`, `state`) over DOM-heavy flows.
- Keep browser-only assertions in manual smoke checks unless a stable DOM contract is introduced.
- When changing cache query versions, keep `scripts/verify-logic.js` imports in sync with the rest of the source.
- Content breadth is not solved by `DAILY-005`: before pushing daily retention, expand the daily template pool to at least seven distinct plot IDs, then tighten the rotation test to enforce weekly uniqueness.
