---
name: livestream-game-flow-review
description: Use when reviewing or improving a dialogue-driven livestream mystery game flow, especially to find preachy copy, broken conversation logic, premature spoilers, speaker/portrait mismatch, generic UI leftovers, or anything that blocks a fast, satisfying daily-case playthrough.
---

# Livestream Game Flow Review

Use this skill when the task is to review, debug, or improve a playable daily-case flow for a dialogue mystery game. The goal is not just correctness. The goal is a short, replayable, shareable flow that feels like a live emotional-host call-in room: tense, natural, and satisfying.

## Core Principle

Do not review from code alone. Play the flow like a first-time player, capture what is actually on screen, then patch code only after the lived flow reveals the problem.

Do not generate or repair daily-case text one field or one sentence at a time. Daily cases must be written as one integrated call first, then split into UI fields. If one line changes the motive, pressure, object purpose, or responsibility balance, regenerate the whole local chain around it: opening, scene beat, options, feedback, testimony, final open, recap/share copy, and migration copy.

Prefer:
- conversation over instruction
- live-room tension over case-file analysis
- delayed disclosure over early explanation
- plausible choices over obvious right/wrong answers
- in-character feedback over narrator diagnosis
- single-caller daily cases over two-sided confrontation
- every speaker having self-interest, omissions, or face-saving edits

Avoid:
- teaching words such as "核验", "证据链", "阶段判断", "正确", "错误", "必须", unless the current screen truly needs them
- buttons that describe mechanics instead of dialogue intent
- giving away the hidden issue before the player earns it
- one obviously bad choice that turns the game into a reading-comprehension quiz
- generic case buttons bleeding into a specific daily case
- writing the relative victim as a perfectly reliable narrator unless the case is intentionally about a pure scammer
- letting the other party enter the daily live room as a direct speaker
- inserting "后台账单", "回拨新情况", "主播记事", or other system/material speakers inside daily scene/testimony beats

## Review Loop

1. Start from the new-player path.
   - Open the exact local URL with a fresh cache key, for example `?ui=01852&dailyKey=YYYY-MM-DD`.
   - Use "重开" if local state is mid-flow.
   - Walk through homepage, entry page, opening call, every question set, every feedback line, follow-up dialogue, summary/decision pages, retry/failure if present.

2. Capture raw screen text.
   - Use browser DOM text, not memory.
   - Save or mentally group each screen as: opening, choice set, answer feedback, next beat, summary.
   - If the page has portraits or speaker labels, check the active speaker against the current line.

3. Audit each screen with the fixed checklist.
   - Does the speaker know the thing they are responding to? If not, reorder the line.
- Does the caller explain why a document/screenshot/audio exists? If not, add a natural trigger in dialogue.
- Does the hidden/cropped/changed information have a clear purpose? If not, add the pressure, desired outcome, and benefit before treating it as a clue.
   - Is this a daily case? Then every `sceneVersion` and `testimony` beat must be spoken by the anonymous caller. Materials can appear only because the caller pulls them out, reads them, forwards them, or explains how they got them.
   - Is the case answer already stated in the setup? If yes, replace the answer with visual or conversational clues.
   - Are all choices plausible things a host might say? If no, rewrite the bad option as a tempting but less useful route.
   - Would a real player ever choose this option? If it says "是真的就先相信", "别纠结", "别聊僵", or any obvious throwaway answer, replace it with a plausible detour.
   - Is the caller's version too clean? Add a self-protective omission, softened responsibility, or partial truth unless the case is a pure scammer scenario.
   - Is feedback written in the same speaker perspective? If the label says "咨询者", use first-person or direct quoted speech, not "她说".
   - Does another party appear in a daily case as a live speaker? If yes, rewrite it as caller retelling, chat text, call recording, submitted material, or later callback relayed by the caller. Do not add a second portrait or mic.
   - Do generic buttons mention irrelevant axes such as money/resources in a screenshot case? If yes, make them case-specific.
   - Does any page sound like a tutorial, worksheet, legal analysis, or moral lecture? If yes, convert it back into live-room dialogue.

4. Patch narrowly.
   - Edit the source template and any normalization/migration copy that can overwrite old saves.
   - If a stale local state can preserve bad text, add a migration trigger that detects old phrases and replaces the case data.
   - If a new screen imports changed JS modules, bump all cache query versions in `index.html`, `src/*.js`, `src/views/*.js`, and `scripts/verify-logic.js`.

5. Validate mechanically.
   - Run `npm run check`.
   - Run `npm run build:h5`.
   - Search for removed phrases with `rg`.
   - Treat old phrases found only inside migration triggers as acceptable; anything user-visible must be removed.

6. Validate experientially.
   - Reopen the browser with the new cache key.
   - Replay the path from the start.
   - Click at least one strong route and one later-route transition.
   - Confirm the actual screen text, not just the source code.

## Integrated Writing Loop

Use this loop when creating a new daily case or making any narrative change larger than typo polish.

1. Write the unified story packet before touching UI fields.
   - `relationshipStage`: why this call happens today.
   - `pressurePoint`: what family, money, status, timing, platform, or relationship pressure creates the call.
   - `dramaticAnchor`: the concrete object, quote, screenshot, proof, bill, agreement, table, or transfer record that makes the live room argue.
   - `callerStake`: what the caller gains by telling it this way and what they are hiding, softening, or afraid to admit.
   - `otherStake`: what the other party gains by showing/hiding/wording things this way and what they would lose if fully exposed.
   - `thirdPressure`: parent, friend, platform, ex, family role, or public image pressure if it exists.
   - `truthBoundary`: which parts are real, which are edited, and which remain unknown.
   - `finalQuestion`: what the audience should argue about after the case, not a lesson.

2. Write the stitched transcript.
   - Opening must be a caller line, host bridge, caller answer.
   - Opening should be stair-stepped, not bundled. The caller's first line should only give the call reason. The host then asks for relationship source and current stage. The caller then gives "how they met" and "where the relationship has progressed." The host only asks about the suspicious trigger after that trigger is named.
   - Then write each scene beat as `caller line -> host options -> caller feedback`.
   - Then write testimony as `caller line -> host follow-up -> caller answer`.
   - Read it aloud as one phone call before splitting it into `openingDialogue`, `sceneVersions`, `questionOptions`, `testimony`, and `followups`.

3. Only then split into data fields.
   - Each UI field must be traceable back to the story packet.
   - No field may introduce a motive, fact, object, or conclusion that did not appear in the stitched transcript.
   - A detour branch can be less useful, but it must still point at the same case core. Do not use generic emotional detours such as "do you still like them" unless the case core is actually emotional attachment.

4. After any line edit, rerun local coherence.
   - Ask: whose face, money, status, safety, or convenience does this sentence protect?
   - Ask: did this sentence change who pushed the dramatic object into the call?
   - Ask: did this sentence make an earlier option or later conclusion incoherent?
   - If yes, update the whole affected chain, not just the sentence.

Hard rule: a daily case is not assembled from interchangeable good-sounding lines. It is a small pressure system. Every question, answer, option, and recap must preserve the same pressure system.

### Integrated Story Packet Template

```json
{
  "relationshipStage": "",
  "pressurePoint": "",
  "dramaticAnchor": "",
  "callerStake": "",
  "otherStake": "",
  "thirdPressure": "",
  "truthBoundary": "",
  "mainAudienceArgument": "",
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
    "testimony": "which later caller lines map here",
    "accusationChoices": "which audience arguments become choices",
    "shareCopy": "which argument is safe to share without spoiling"
  }
}
```

## Dialogue Rewrite Rules

Daily case contract:
- Daily mode is one live call: host + one anonymous caller.
- No real NPC names are shown in the live room. Use "咨询者", "对方", or role-neutral descriptions.
- The other party never directly joins the daily live room. They can only exist as quoted chat text, voice recording, screenshot, forwarded message, receipt, contract, callback relayed by the caller, or another anonymous submission reported by the caller.
- `sceneVersions` and `testimony` must all be in the caller's mouth. Do not use "后台账单", "购房材料", "回拨新情况", "主播记事", "聊天截图", or similar labels as speakers inside the flow.
- If a material is important, write the caller action: "我把账单翻出来", "我手里有合同照片", "我把他后来那句回复念一下", "我后来拿到另外两段截图".
- The game is not a courtroom confrontation. The host discovers truth by slowing down one person's account, not by making two parties debate.
- Final judgement can point to "对方" or "这段关系里都有隐瞒", but the gameplay path still comes from the caller's disclosures.

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
- Avoid joke-bad options. A wrong route should sound emotionally tempting or socially common.
- Do not include "please believe / since it is true, accept it" options. No one clicks these. A detour should offer comfort, compromise, social face-saving, or a narrower question.
- When possible, make two routes useful in different ways and one route a detour.

Feedback:
- If displayed under "咨询者", write as first-person or direct caller speech.
- In daily cases, do not display feedback under "对方". Convert direct defensive speech into something the caller reads or quotes.
- Do not summarize the lesson in the feedback line. Let the response expose attitude, evasion, timing, or missing context.

Hidden clue pacing:
- Early lines should expose observable oddness, not the final category.
- Middle lines can reveal concrete missing pieces.
- Final lines can expose intent or responsibility, but still through what someone says or refuses to say.

UI copy:
- Buttons should feel like live-room actions: "继续听她说", "那后来呢？", "把问题点标出来".
- Avoid mechanical labels: "阶段判断", "资料核验", "通话回放", "内容提示".
- In daily cases, avoid "接哪边的麦", "让另一方补话", or any copy implying two-sided mediation.
- Case-specific summary buttons should reflect the case: screenshot source, missing edge, evasive wording, timing, party switch.

## Common Bugs From This Project

- Host asked "哪里让你不踏实" before the caller had said she felt 不踏实.
- Caller mentioned "证明" without a natural reason for why proof was being sent.
- A supposedly playable clue screen stated the answer directly: 学制, 合同主体, 收入完整页.
- Feedback under "咨询者" used third-person narration: "她想了一下".
- A respondent line appeared while the active portrait still showed the caller.
- A daily case used "回拨新情况 / 后台账单 / 主播记事" as standalone speakers. These must be rewritten as caller actions.
- A generic evidence page showed "钱和资源谁承担" inside a screenshot-authenticity case.
- "条件听着已经不错" was an obvious wrong answer, making the player feel tested rather than clever.
- "三张图都是真的，先认下来" was also a no-click answer. It was replaced with a plausible detour: asking whether the caller would still mind if the original images were later completed.
- "阶段判断" and "资料核验不是势利" made the flow feel like instruction instead of a livestream.

## Standard Verification Commands

```bash
npm run check
npm run build:h5
rg -n "old phrase 1|old phrase 2|old phrase 3" index.html src scripts/verify-logic.js
```

## Final Response Pattern

Report:
- what was reviewed
- the main classes of friction found
- what changed
- the exact validation commands run
- whether browser replay passed

Keep it short. The user mainly needs confidence that the flow was actually played, not just inspected.
