# UI / Portrait / Scene Asset Review

Review date: 2026-07-03

Reviewed:

- Current playable title, live-call, choice, answer, and material screens on mobile `390x844`.
- Current playable title and live-call screens on desktop `1366x768`.
- Runtime background mapping in `src/styles.css`.
- Runtime portrait mapping through `CHARACTER_ART` and `portraitLayer`.
- Existing generated background and portrait asset sheets.

## V2 验收标准

- 匿名感(来电人脸不可全见)
- 光带一致性(宽度与倾角跨差分统一)
- 每案双色调纯度
- 颗粒密度统一

三层清晰度原则:来电人>朦胧,顾问>清晰,主播永不露脸。

## Current Strengths

- The title screen has a strong broadcast desk signal. `livestream_studio_v2.png` works better than the older dating/marriage backgrounds because it immediately says live room, mic, files, screens, and investigation.
- The in-call UI now reads more like a control desk than a plain visual novel: ON AIR, patience, segment, backend material, floating comments, and material board are all visible.
- The live-call stage now has a lightweight foreground evidence-prop layer. Bills, tables, screenshots, and approval-flow materials read as objects on the desk instead of only as background texture or text in the material board.
- The material board is visually distinct from dialogue. The bill/table layout communicates "circle a material point" without needing tutorial text.
- The current SVG portraits are lightweight and stylized enough to avoid raw photo-realism, and expression chips add some performance.

## Main Problems

### P0: Case Backgrounds Do Not Match The New Steam Direction

Current mappings:

| Case | CSS class | Current image | Problem |
| --- | --- | --- | --- |
| Credit / job loss | `backdrop-credit` | `cafe_date.png` | Looks like a dating cafe. The actual case object is credit card bill + social security cutoff. |
| Tony / salon | `backdrop-tony` | `lounge_date.png` | Looks like an upscale date/lounge. The actual case needs salon counter, schedule sheet, membership card pressure. |
| Profile / income | `backdrop-profile` | `family_banquet.png` | Reads like meeting parents. The actual object is profile screenshots, MBA wording, income/bank flow. |
| Workplace reimbursement | `backdrop-work` | `agency_office.png` | Too clean and client-service-like. Needs finance/admin office, reimbursement stack, payment status, supplier deadline. |

Needed replacements:

- `assets/generated/backgrounds/credit_bill_room.png`
- `assets/generated/backgrounds/salon_counter_schedule.png`
- `assets/generated/backgrounds/profile_verification_desk.png`
- `assets/generated/backgrounds/office_finance_reimbursement.png`

2026-07-03 update: these four backgrounds have been generated and connected in `src/styles.css`. The old cafe/lounge/banquet/agency assets remain in the repo as archive candidates, but no longer drive the Steam demo case backdrops.

Keep `livestream_studio_v2.png` as title/default broadcast shell.

### P0: Runtime Portraits Are Too Generic For Anonymous Callers

The current live-call portrait always uses the complainant NPC art. In the first case it shows a polished suit figure, which makes the anonymous caller feel like "a character from another dating sim" rather than someone calling into a live room.

Needed:

- Add anonymous caller portrait variants by case pressure, not only named NPC archetypes:
  - `caller_credit_anxious.png`
  - `caller_salon_guarded.png`
  - `caller_profile_controlled.png`
  - `caller_work_reimbursement_tired.png`
- Keep names hidden in UI. File names can be production-facing, but the screen should continue showing `咨询者 / 匿名来电`.
- Style should be semi-cartoon, less photo-model, with bolder silhouette and cleaner edges than the generated realistic PNGs.

2026-07-03 update: first-pass anonymous caller portraits have been generated under `assets/generated/callers/` and wired through content-pack `sequence.callerArt`. `portraitLayer` now uses the pack-specific caller art before falling back to named NPC portraits.

### P0: Asset Resolution And Style Consistency

- Backgrounds are `1672x941`, close to 16:9 but below the prompt target of `1920x1080`.
- Current runtime SVG portraits are only `320x720`. They scale acceptably on mobile, but feel thin on desktop.
- Generated PNG portraits are higher resolution but too photo-real / fashion-catalog for the current UI.

Upgrade target:

- Backgrounds: `1920x1080` or `2048x1152`, no readable text, no people, center/right negative space for portrait, bottom clear enough for dialogue.
- Portraits: transparent PNG, at least `1024x2048`, semi-cartoon with strong edge readability, 3/4 front angle, multiple expression variants.

2026-07-03 update: without adding new image files, the runtime now gives anonymous portraits a stronger stage integration pass: contact shadow, broadcast scan overlay, expression-specific micro-motion, and mobile-safe expression placement. Dedicated PNG expression variants remain a later art-production pass.

### P1: Missing Host-Side Visual Identity

The title background shows a studio, but in the live call the visible portrait is only the caller. The player is the host, yet the host has no persistent visual presence except UI text.

Recommended addition:

- Add a small host monitor or host silhouette layer in the control deck, not a second full portrait.
- Use it as diegetic UI: mic light, hand on tablet, small waveform, not a talking-head confrontation.
- Avoid making the host image compete with caller portrait.

Suggested assets:

- `assets/generated/host/host_monitor_idle.png`
- `assets/generated/host/host_monitor_thinking.png`
- `assets/generated/host/host_monitor_pressed.png`

2026-07-03 update: the first host-side layer is implemented as a diegetic CSS monitor inside `src/ui/liveFrameView.js`, with mic-light, small face silhouette, and waveform states. It deliberately avoids a second full portrait or another live speaker. Dedicated PNG host monitor variants can still be generated later if the final art pass needs higher fidelity.

### P1: Material Assets Are Still Text-Only

The material board works mechanically, but the "documents" are still text lines styled as bills/tables. For Steam, the materials should feel like real objects without becoming unreadable screenshots.

Add fixed material thumbnails:

- Bill slip / card statement for case 1.
- Schedule sheet / membership card note for case 2.
- Profile screenshot stack / bank-flow cover page for case 3.
- Reimbursement approval / payment status page for case 4.

These should remain stylized UI assets, not real screenshots. No personal data, no readable real platform names.

2026-07-03 update: first foreground prop layer is implemented in CSS through `scene-evidence-props`. It changes shape by material type and scene class, stays under the portrait, and avoids readable text or answer hints. This does not replace final material art, but it gives every live-call screen a concrete case object before the player opens the material board.

### P1: Background Set Still Carries Old Marriage-AVG DNA

Existing unused backgrounds include wedding hotel, parents home, hospital, school gate, married home. These are useful for an older relationship-life sim direction, but they now dilute the Steam-first "live public incident detective" identity.

Action:

- Move old marriage-life backgrounds to an archive or keep them unused.
- Prioritize public-life assets: finance office, rental room, refund counter, platform support desk, community group-buy chat board, co-working desk, salon counter.

## Recommended Priority

1. Replace the four case backgrounds with object-specific public-incident backgrounds.
2. Upgrade anonymous caller portraits with expression variants.
3. Add material thumbnails / foreground evidence props for each case. CSS foreground prop pass complete; final bespoke image thumbnails remain optional polish.
4. Add a small host monitor layer to strengthen "player as broadcaster". First CSS pass complete; future PNG monitor variants are optional polish.
5. Archive or de-emphasize old marriage-route backgrounds.

## Prompt Direction

Use the existing `docs/background-prompts.txt` and `docs/character-prompts.txt`, but update the emphasis:

- Less dating venue, more live-room evidence handling.
- Less fashion full-body character sheet, more anonymous caller pressure state.
- More object-specific case staging: bill, schedule, profile stack, approval/payment page.
- Keep realism grounded, but use stronger 2D-game shapes and cleaner color blocking.
