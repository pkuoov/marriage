# UI / Portrait / Scene Asset Review

Review date: 2026-07-03

Reviewed:

- Current playable title, live-call, choice, answer, and material screens on mobile `390x844`.
- Current playable title and live-call screens on desktop `1366x768`.
- Runtime background mapping in `src/styles.css`.
- Runtime portrait mapping through `CHARACTER_ART` and `portraitLayer`.
- Existing generated background and portrait asset sheets.

## V2 验收标准

- 匿名感（三分之二侧脸、不直视镜头、五官信息简化）
- 面部一致性（暖色可读，不使用常驻眼部光带、遮罩或重阴影）
- 每案双色调纯度
- 颗粒密度统一

三层清晰度原则：来电人保持匿名化但可读，临时上麦者与来电人同级，主播以固定像素形象出现；顾问仍以后台身份为主，不与直播舞台抢镜。

2026-08-13 P0 更新：主播四态、案 3 男方双态、两宗快案来电人补充态、四案材料合成图和六套承重反转演出已经接入运行时。下文“缺少主播形象”“材料仍为纯文本”等段落保留为历史诊断，现状以本段和 `docs/pixel-art-transition-and-portrait-direction.md` 为准。

2026-08-13 P1 更新：赵律师 `日常 / 揶揄 / 认真` 三态、关掉直播灯后的双人广告间隙、案间材料退场/进场动画、宸直新闻推送 CG 和 2019 文件袋 CG 已接入运行时。旧婚恋 AVG 背景继续只作未引用素材，不回到试玩路线。

2026-07-18 方向更新：案 1 通过复审的暖色侧脸方向已经扩展到四案。四案三态像素立绘均取消常驻眼部光带，改以侧脸角度和简化五官保持匿名；规格与验收门见 `docs/pixel-art-transition-and-portrait-direction.md`。旧半写实立绘和遮罩样张仅保留为制作参考，不再作为试玩运行时主图。

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

2026-07-18 update: all four callers now ship `neutral / guarded / pause` as transparent `256x512` masters plus nearest-neighbor `1024x2048` runtime assets. Runtime and pack validation cover every case; physical-device readability remains a release QA gate rather than a migration blocker.

### P1: Missing Host-Side Visual Identity（已完成）

The title background shows a studio, but in the live call the visible portrait is only the caller. The player is the host, yet the host has no persistent visual presence except UI text.

Recommended addition:

- Add a small host monitor or host silhouette layer in the control deck, not a second full portrait.
- Use it as diegetic UI: mic light, hand on tablet, small waveform, not a talking-head confrontation.
- Avoid making the host image compete with caller portrait.

Suggested assets:

- `assets/generated/host/host_monitor_idle.png`
- `assets/generated/host/host_monitor_thinking.png`
- `assets/generated/host/host_monitor_pressed.png`

2026-08-13 update: the live stage now uses a persistent full-body host identity with listening, questioning, pressing, and verdict states. Active-speaker focus keeps the host dim while callers speak, so the player is visibly present without competing with the current line.

### P1: Material Assets Are Still Text-Only（已完成）

The material board works mechanically, but the "documents" are still text lines styled as bills/tables. For Steam, the materials should feel like real objects without becoming unreadable screenshots.

Add fixed material thumbnails:

- Bill slip / card statement for case 1.
- Schedule sheet / membership card note for case 2.
- Profile screenshot stack / bank-flow cover page for case 3.
- Reimbursement approval / payment status page for case 4.

These should remain stylized UI assets, not real screenshots. No personal data, no readable real platform names.

2026-07-03 update: first foreground prop layer is implemented in CSS through `scene-evidence-props`. It changes shape by material type and scene class, stays under the portrait, and avoids readable text or answer hints. This does not replace final material art, but it gives every live-call screen a concrete case object before the player opens the material board.

2026-08-13 update: all four cases now ship a fixed 1600×900 pixel-art evidence composite and the material modal renders that image behind the verified text label. The composites remain illustrative and cannot introduce facts beyond the authored rows.

### P1: Background Set Still Carries Old Marriage-AVG DNA（运行时已去强调）

Existing unused backgrounds include wedding hotel, parents home, hospital, school gate, married home. These are useful for an older relationship-life sim direction, but they now dilute the Steam-first "live public incident detective" identity.

Action:

- Move old marriage-life backgrounds to an archive or keep them unused.
- Prioritize public-life assets: finance office, rental room, refund counter, platform support desk, community group-buy chat board, co-working desk, salon counter.

2026-08-13 update: no old marriage-life background is referenced by the Steam demo runtime. Files remain in place only as archive/reference assets so existing user work and Git history are not destructively rewritten. New P1 interludes reuse the broadcast studio instead of adding another marriage-AVG location.

## Recommended Priority

1. Replace the four case backgrounds with object-specific public-incident backgrounds.
2. 先用案 2 制作 `neutral / guarded / pause` 三态像素样张；验收通过后再决定是否把四案匿名立绘整体迁移。
3. Add material thumbnails / foreground evidence props for each case. CSS foreground prop pass complete; final bespoke image thumbnails remain optional polish.
4. Add a small host monitor layer to strengthen "player as broadcaster". First CSS pass complete; future PNG monitor variants are optional polish.
5. Archive or de-emphasize old marriage-route backgrounds.

## Prompt Direction

新图只使用 [pixel-art-transition-and-portrait-direction.md](pixel-art-transition-and-portrait-direction.md) 的现行标准。旧的写实全身、半剪影和眼部光带 Prompt 已删除，不得从 Git 历史复制回生产流程。

- Less dating venue, more live-room evidence handling.
- Less fashion full-body character sheet, more anonymous caller pressure state.
- More object-specific case staging: bill, schedule, profile stack, approval/payment page.
- Keep realism grounded, but use stronger 2D-game shapes and cleaner color blocking.
