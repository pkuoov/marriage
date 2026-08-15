# Narrative Flow Validation

This workflow checks whether single live-call cases read like coherent livestream calls, not just valid data objects. In the current product, these cases are the units inside a weekly livestream collection.

## Command

Run this before major narrative changes:

```bash
npm run test:narrative
```

It is also included in:

```bash
npm run check
```

The script writes a branch extraction report to:

```text
docs/generated/narrative-flow-report.md
```

## What Gets Extracted

For each single-call case in the current rotation, the script extracts:

- opening dialogue
- every `sceneVersion`
- every scene question and feedback branch
- the conditional `deepFollowup` question and answer
- every final quote-pick/result branch
- evidence cards
- stage judgement
- truth and expected responsibility

The report is meant to be readable by humans. It is the text packet a reviewer or LLM can inspect without clicking through the UI.

## Text Pattern

Daily cases use a strict livestream dialogue pattern:

```text
caller gives one piece of context
-> host asks only the next logical question
-> caller answer directly bridges from that question
-> player option asks one playable direction
-> feedback answers that exact option before revealing any new fact
```

The caller may be messy, defensive, emotional, or self-serving. The host and UI cannot be messy. Host copy must not:

- repeat a fact the caller already gave
- ask A and receive an answer to B
- jump from “proof / persuasion” directly to a later result such as meeting parents, borrowing money, or signing
- use system-teaching language such as “先听”, “你要判断”, or “正确做法”
- reveal the case conclusion before the player asks through the line

Because each call is short and branch-sensitive, every generated case must be reviewed as a stitched transcript, not as isolated fields.

Story-pack cases should also be generated as a stitched transcript first. If a reviewer changes a line that affects motive, face-saving, the purpose of a material, who pushed the dramatic object into the call, or how a mutual-harm chain works, the reviewer must re-check the full local chain rather than patching that sentence alone.

## Logic Chain Rules

Each case should satisfy this chain:

```text
relationship stage
-> pressure point
-> suspicious material / speech / event
-> dramatic gray-zone object or quote
-> actor purpose
-> unclear initiator / shared face-saving pressure
-> player question
-> feedback reveals or fails to reveal a fact
-> conclusion reuses facts already surfaced
```

The validator checks for:

- caller speaks first
- daily live room stays single-caller: only the host and anonymous caller are present
- the other party appears only through caller retelling, chat logs, recordings, callbacks, or other materials
- materials cannot interrupt as their own speaker inside scene/deep-question beats; the caller must pull them out, read them, or explain how they got them
- no NPC real names appear in daily livestream text
- opening has relationship context
- suspicious materials do not appear from nowhere
- each daily case has at least one dramatic object, quote, bill, screenshot, proof, table, agreement, or transfer record that can make the live room argue
- the dramatic object has gray-zone authorship: it should be unclear whether it was pushed by the caller, the other party, parents, friends, platform pressure, or mutual face-saving
- hidden/cropped/changed information has purpose
- host questions advance one logic step at a time: first ask what a line proves or who it tries to persuade, then infer the later action it makes easier
- host questions must not ask for facts the caller already gave in the immediately preceding line
- host questions and the immediately following caller answer must connect without a missing bridge
- the risk of full disclosure is legible
- opening length fits mobile
- daily scene count stays short
- choices sound like host questions
- no no-click throwaway options
- no early spoilers
- deep follow-up continues facts already surfaced and only appears after a full core-hit route
- recap/Truth reuses previously surfaced motive or contradiction
- no tutorial/debug/legalistic leftover copy
- no gender-war or group-attack framing; mutual harm must be concrete behavior, not identity judgement
- route-map fields exist for playable choices, so weekly recap can name how the player actually asked
- story-pack title screens use a live-room hook, not thesis, moral judgement, case count, or case-title lists
- every scene option and the full-hit deep question can be stitched into a short readable walkthrough
- each walkthrough checks `caller line -> host option -> caller feedback` for missing bridges
- edits preserve one integrated pressure system; options, feedback, recap, truth, and share copy must not drift into a different case question
- current-node choice UI is one panel, not two lonely one-button groups
- choice buttons read as the host's actual questions, not as labels that explain the design
- current-node choice UI does not show route axes, difficulty labels, "soft/hard" tags, or other how-to-play copy

## Large Playtest UI Gate

Run this gate during every large manual test, especially after changing `src/app.js`, `src/styles.css`, case templates, or route metadata.

1. Open a fresh cache key and start from the title screen.
2. Confirm the title screen hook sounds like a live room opening, not a story-pack table of contents.
3. Confirm the title screen does not reveal the number of cases, later case titles, route theme, or final thesis.
4. Visit at least three current-node choice panels across different cases.
5. Copy the visible DOM text for each choice panel.
6. Confirm the panel has one short heading and the buttons are only host questions.
7. Confirm the visual difference between outer/core choices does not become explanatory text.
8. Search the visible text for banned helper labels: route axes, "how to play" instructions, and designer shorthand.
9. Click one outer option and one core option. Both answers must return as caller dialogue and then move forward linearly.

If any panel needs a label to explain what the buttons mean, the UI is carrying design notes instead of drama. Rewrite the buttons or remove the label.

## Using LLM Review Later

The current script is deterministic and offline. It also writes `Branch Walkthroughs` to the report. A later LLM pass can use `docs/generated/narrative-flow-report.md` as input and ask:

```text
For each branch walkthrough, identify any missing motivation chain,
speaker knowledge mismatch, question-answer mismatch,
abrupt material appearance, premature spoiler,
or conclusion not earned by prior dialogue.
Return blocking issues only.
```

Keep deterministic checks as the gate. Use LLM review as a second reader, not the only test.
