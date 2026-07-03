# Case Scriptwriting Review 2026-07-03

Scope: `content/packs/steam-demo-01`, `src/caseEngine.js` fallback text, and the updated `project-skills/case-scriptwriting/SKILL.md`.

## Skill Consolidation

`project-skills/case-scriptwriting/SKILL.md` is now the single writing standard for:

- de-AI caller speech;
- story packet -> stitched transcript -> JSON field split;
- 20-minute case enrichment;
- material boards, backflow materials, truth-boundary sorting, quote-pick payoff;
- route-specific comments and guarded-answer behavior.

The missing Gemini file path `.agents/skills/de-ai-scriptwriting/SKILL.md` is not present in this workspace, so the consolidation used the currently visible project rules plus the de-AI principles already discussed.

## Pack-Level Finding

The demo pack is structurally coherent: four calls share the hidden thread of "good-sounding identity/relationship/process words pushing money or responsibility onto someone else."

The remaining issue is not scene count. All four cases have 5 live-call beats. The shortness comes from interaction density:

| Case | Live beats | Material boards | Backflow | Truth prompts | Current feel |
| --- | ---: | ---: | ---: | ---: | --- |
| 01-credit | 5 | 1 | 1 | 7 | Strong opener, slightly light on playable material |
| 02-tony | 5 | 1 | 1 | 7 | Good emotional hook, material interaction could be richer |
| 03-profile | 5 | 1 | 1 | 7 | Best gray-zone conflict, but too much weight sits in recap/backflow |
| 04-workplace | 5 | 2 | 1 | 7 | Densest and closest to Steam-case target |

## Case Reviews

### 01-credit

Strengths:
- Clear false frame: "temporary credit-card turnover."
- Strong self-edit: caller enjoyed the "decent/体面" relationship image.
- Backflow朋友圈图 cleanly revalues the spending line.

Weaknesses:
- Only one material board. The payment-deadline contradiction is still handled as dialogue, not a playable mark.
- Recap text was slightly lecture-like; patched this pass.

Recommended enrichment:
- Add a second material board around the minimum-payment screenshot: mark "账单还有三天" vs "今晚就要".
- Let the wrong mark be emotionally tempting: "他说怕被分手".
- Use a backflow comment from a friend only after the player has seen both spending and deadline.

### 02-tony

Strengths:
- Strong dramatic object: salon roster pretending to be appointment data.
- Caller self-interest is alive: she liked being treated as "自己人".
- Good backflow: another woman's row proves this is not a one-person misunderstanding.

Weaknesses:
- Some material feedback still reads like answer explanation rather than live-room reaction; patched the most obvious lines.
- Only one material board. The "老板娘 -> 年卡/投店" line is a good second board candidate.

Recommended enrichment:
- Add a second material board for chat sequence: "老板娘" followed by "年卡 / 投店".
- Make one wrong option plausible: "深夜聊天语境" or "店里玩笑".
- Route-specific comments should let viewers argue whether "暧昧" itself is the issue, then let the table undercut that frame.

### 03-profile

Strengths:
- Strongest gray-zone design: neither side is clean.
- The mother's wording and family pressure make the caller's edit believable.
- The deep question is pointed and fits the user's requested direction.

Weaknesses:
- Too much of the real conflict lands in `conclusionWhenCleared` and `followupTwist`; the playable middle still centers on学历图 more than income flow.
- Only one material board. For a 20-minute case, the income/stability side needs its own interaction.
- Some recap/conclusion lines still risk sounding like host essay copy if rendered directly.

Recommended enrichment:
- Add a second material board for the income/stability proof: balance screenshot vs monthly流水 vs spending behavior.
- Let the material wrong options be "存款数字" and "截图真假"; the correct edge is "长期收入/钱从哪里来".
- Backflow should stay as family chat, but its correct mark could be "后面主要看收入流水" plus a follow-up route if the player previously chased money flow.

### 04-workplace

Strengths:
- Best current density: 5 beats, 2 material boards, 1 backflow.
- Mechanically breaks the romance-case rhythm.
- The caller's ambition and the coworker's process control are both present.

Weaknesses:
- Some top-level planning fields still use design-language terms like "风险"; not player-facing, but future writers may copy the register into visible text.
- The final truth is clearer after this pass, but it could become sharper if the route recap reacts to whether the player chased approval, money flow, or caller ambition.

Recommended enrichment:
- Keep as the benchmark for case density.
- Add route-colored final private message: money-flow route gets payment account detail; identity-wording route gets boss/主责 phrasing; caller-credibility route gets the caller's own earlier boast.

## Text Changes Made In This Pass

- Rewrote several recap/feedback lines that sounded like "case lesson" copy:
  - `这案别只问穷不穷` -> live-call phrasing.
  - `预约时间本身正常，真正不对的是...` -> concrete mark feedback.
  - `这句有用，但...` / `这句很刺耳，但...` -> less rubric-like wording.
- Synced the same changes into `src/caseEngine.js`.
- Rebuilt `src/generated/contentPackIndex.js`.

## Next Content Priority

1. Add second material board to 03-profile. It has the richest argument and the clearest need for more playable depth.
2. Add second material board to 02-tony. This will turn "老板娘" from a good line into an actual deduction beat.
3. Add deadline/payment screenshot board to 01-credit only if the opener still feels short after playtest.
4. Keep 04-workplace as the density target; do not add more unless playtest shows a real gap.

## Regression Standard

For every future case edit, use `project-skills/case-scriptwriting/SKILL.md` first. A case is not "long enough" because it has five statements. It is long enough when the player has heard, chosen, marked, received backflow, committed to boundaries, picked a line, and then sees an aftermath that remembers their route.
