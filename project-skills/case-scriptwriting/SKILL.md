---
name: case-scriptwriting
description: Use when writing or rewriting 《直播间大侦探》 case content — openings, scene beats, question options, guarded answers, materials, comment seeds, recap/share copy, and case-length enrichment. Covers de-AI language rules, the story-packet → stitched-transcript → field-split workflow, dialogue rewrite rules, clue insertion techniques, gated diegetic comment hints, and how to make a case feel like a 20-minute playable call without filler.
---

# Case Scriptwriting

Use this skill for any case creation or dialogue change larger than typo polish. It is the writing-side companion to two review skills:

- [detective-plot-coupling-review](/Users/pkuiloveoov/code/love/project-skills/detective-plot-coupling-review/SKILL.md) checks whether the mystery structure works: case ledger, false solutions, missing edges, coupling, fair play, story-pack threads. Run its ledger before writing and its checks after writing.
- [livestream-game-flow-review](/Users/pkuiloveoov/code/love/project-skills/livestream-game-flow-review/SKILL.md) checks the played flow: playtest loop, UI regressions, continuity checklist. Run it after content lands.

Authority order when rules conflict:

1. Mechanical bans in `scripts/verify-logic.js` (DAILY-009 family and related copy tests) — these fail the build.
2. Value boundaries in [game-philosophy.md](/Users/pkuiloveoov/code/love/docs/game-philosophy.md) and the value baseline below.
3. [dialogue-continuity-audit.md](/Users/pkuiloveoov/code/love/docs/dialogue-continuity-audit.md) and the flow-review regression checklist.
4. The techniques in this skill.

Examples in this skill are technique demonstrations, not content patches. Any new fact they imply — a timestamp, an amount, a new material, a new third party — must pass the case `truthBoundary`, the coupling-review ledger, and the pack `qa-report.md` before it enters a shipped case.

## Language Rules (De-AI)

The goal is not "colorful" speech. It is a caller who sounds like a real person under pressure, in plain spoken Chinese, anchored to specific objects and numbers.

Caller vocabulary:
- No clinical or jargon speech in the caller's mouth: `核心风险`, `成本转移`, `转嫁债务`, `信用背书`, `认知偏差`, `流程空挡`, `洗房边界`. Callers argue in `钱`, `面子`, `责任`, `吃亏`, `谁占便宜`.
- No machine clichés: `心里咯噔一下`, `不由得倒吸一口凉气`, `不得不承认`, `听到这里`, `真正…的不是…而是…`. These are already banned mechanically; do not reintroduce them through paraphrase.
- Do not replace AI flavor with short-video melodrama flavor. `我当时脑子嗡的一声`, `这哪是爱我，这是把我当提款机啊` is the same failure in different clothes. When in doubt, go plainer: a concrete object, a time, an amount, and one feeling.

Iron rule — perception, not conclusion:
- The caller reports what they saw, heard, and felt. The deduction is the player's job. Emotional self-evaluation is allowed; deductive conclusions about the other party's motive are not, unless the beat is explicitly the caller's late realization and the facts supporting it are already on screen.
- Bad (caller does the player's reasoning): 「他越催我当晚转钱，我越觉得不对：他可能更怕我把账单明细翻完。」
- Good (perception only, conclusion left open): 「可账单还有三天，他非要我当晚转，我就开始不踏实了。」

Subjective recall over recap:
- When a caller refers back to earlier facts, they remember with emotion, regret, or excuse — they do not reassemble the puzzle like an answer sheet.
- Bad: 「那张社保截图还是他让我帮忙看材料时露出来的，上面两个月前就断缴了。」
- Good: 「要不是他发那张材料截图让我帮忙看一眼，我做梦也想不到他其实早就失业了。」

Detour options are not stupid options:
- A wrong-side option should be the caller (or host) reaching for a plausible, socially common, or self-protective reading — 极力替对方解释、给自己台阶 — never a joke answer or an obvious no-click.

## Writing Workflow

### Screenwriter Contract

Before writing UI fields, write the case as a small pressure system, not as a mystery answer. The player should feel they are listening to someone slowly reveal a messy relationship or public-life conflict, while the live room argues over which sentence is off.

Never generate or repair case text one field or one sentence at a time. A case must be written as one integrated call first, then split into UI fields. If one line changes the motive, pressure, object purpose, or responsibility balance, regenerate the whole local chain around it: opening, scene beat, current-node options, feedback, optional full-hit deep question, final quote-pick, recap/share copy, and migration copy.

### Writers-Room Passes

Use online screenwriting and interactive-fiction methods as process inspiration, not as formulas to copy:
- From screenplay beat outlines: a case needs setup, pressure, reversal, cost, and resolution, but each beat must stay inside a live call.
- From story-spine thinking: know the final audience argument before drafting the middle. The case is not ready until the writer can say what the comment section will fight about.
- From Ink/Twine-style interactive writing: choices can branch briefly, but they must rejoin the linear call with state tracked. Do not create an uncontrolled branch tree for a story-pack case.
- From LLM writers-room research: split generation into roles. A single pass that writes fields directly is not acceptable.

Required passes:
1. Showrunner pass: define the story-pack theme, value boundary, case count, and why these cases belong together.
2. Ending-first pass: write the final audience argument and the behavior chain before writing dialogue.
3. Pressure-system pass: define why tonight, dramatic anchor, object purpose, caller stake, other stake, third pressure, and truth boundary.
4. Beat-ladder pass: draft 5-6 caller statements that each add a new pressure, not a restatement.
5. Branch-design pass: for each beat, write 2-3 plausible host questions with different route axes and reveal depth.
6. Actor-consistency pass: separately ask what the caller, the other party, and the third-pressure source each gain by saying less than the full truth.
7. Continuity QA pass: read the whole call aloud and check that every reveal follows from what is already on screen.
8. Length QA pass: estimate what the player actually does. If the case has only live reading plus one quote-pick, it is underbuilt for Steam. Add authored interaction, not prose bulk.

Five-beat minimum for a 20-minute case:
1. Surface oddness: material, quote, bill, screenshot, or action first appears.
2. Missing edge: the object proves something, but not what someone wants it to prove.
3. Interest path: money, status, face, opportunity, process control, or emotional leverage appears.
4. Caller edit: the caller admits, softens, or exposes their own self-serving version.
5. Responsibility point: the cost or boundary lands, enabling the final quote-pick.

If a generated case cannot fill these five beats without repetition, it is not a 20-minute story-pack case. Combine it with another material, add a third-pressure source, or reject it.

Runtime richness target:
- A story-pack case should not feel "long" because lines are longer. It should feel longer because the player performs more distinct kinds of reading: live call, one-at-a-time host question, material mark, backstage/backflow material, fact-boundary sort, quote-pick, and recap route memory.
- Default playable shape for a full demo case: 5-6 live-call beats, 1-2 material boards, 1 fixed investigation/backflow item, 5-6 truth-boundary prompts, 1 conditional deep question, 1 quote-pick page, 1 route-colored recap. A lighter prologue case may be shorter only if the pack deliberately uses it as an opener.
- Each added beat must carry one new function: new object edge, new false frame, new cost, new third-pressure source, caller self-edit, respondent excuse, or responsibility landing. "Another example of the same thing" is not a beat.
- If a case still feels short, enrich in this order: add a second material angle, add a third-pressure source, add a backflow DM that revalues an earlier line, add a stronger false solution, then add a new live-call beat. Do not first add longer answers.
- Later cases in a pack should increase density, not just line count: tighter patience, more boundary prompts, a second material board, a stronger caller edit, or a case-specific mechanic such as "only one document can be checked before the call clock runs out."

Playable enrichment menu:
- **Object double-use**: the same screenshot has an intended social use and an accidental clue use. The player first sees what it was meant to prove, then marks what it cannot prove.
- **Caller self-protection**: one outer branch should let the caller defend themselves plausibly; a core branch should reveal what that defense leaves out.
- **Counterparty excuse**: include one quoted line or retold excuse that would make a reasonable viewer hesitate. It becomes the false solution, not the answer.
- **Third-pressure mouth**: parent, boss, friend, platform, matchmaker, group chat, deadline, or public image can push the caller to package the story. Use this to widen the case beyond two-person blame.
- **Backflow after the call**: a DM, forwarded screenshot, supplier note, friend correction, or platform record appears only after a relevant contradiction has been heard. It should revalue an earlier beat and still leave one unknown alive.
- **Route-specific crowd echo**: comments react to the player's chosen route axis after the choice. They can be confidently wrong, sharp, or funny, but they never announce the answer before the player acts.
- **Fact-boundary pressure**: final sorting should include true, edited, and unknown statements in uneven counts. The player commits once; the game does not correct them until aftermath.

Do not enrich by:
- adding a second live caller in the daily/unit case;
- adding freeform AI evidence or new facts not authored in JSON;
- adding tutorial text, route-axis labels, "look here" hints, or hidden score explanations;
- lengthening every answer into a monologue;
- repeating the same contradiction in different words;
- turning the host into a judge, therapist, lawyer, or lecturer.

### Integrated Writing Loop

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
   - While reading, run the coupling questions: does Scene 4's number get seeded by Scene 1? Does Scene 3's turn follow Scene 2's emotion? If a beat could be removed with nothing breaking, merge it or give it a missing edge.

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
	  "runtimeLengthPlan": {
	    "liveBeatCount": 0,
	    "materialBoardCount": 0,
	    "backflowCount": 0,
	    "truthBoundaryPromptCount": 0,
	    "caseSpecificPressure": "",
	    "whatPlayerDoesBesidesRead": []
	  },
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

## Case Data Requirements

Every daily case must have:
- `whyTonight`: why the caller phones in today, not last week or next month.
- `objectPurpose`: why the screenshot, proof, bill, contract, voice note, table, or chat log exists in the relationship.
- `callerBenefit`: what the caller gains by telling the story this way.
- `otherBenefit`: what the other party gains by showing, cropping, delaying, wording, or hiding something.
- `thirdPressure`: whose mouth or expectation is being borrowed: parents, friends, platform, ex, matchmaker, boss, money deadline, public image.
- `truthGradient`: at least three layers: true, edited, and still unknowable.
- `audienceArgument`: what viewers will argue about after sharing, not what lesson they learned.
- `runtimeLengthPlan`: what makes the case playable for roughly 20 minutes: beats, materials, backflow, boundary sort, pressure/risk, and route replay value.

Case-length QA:
- Count only player-visible actions: opening read, current-node choice, answer read, material mark, backflow mark, truth-boundary commit, quote pick, recap page. Internal data does not add playtime.
- A case with fewer than five live-call beats must compensate with a richer material/backflow sequence or be treated as a short opener.
- A case with only one material board should make that board do real work: one correct mark, at least two plausible misses, and a later line or backflow that revalues the mark.
- If all options lead to near-identical answers, the case has low replay value even if it has many buttons. Rewrite route answers so one route gives clearer facts, one route preserves caller comfort, and one route pressures the caller's own edit.
- If fact-boundary prompts are all obvious one-to-one labels, they become a worksheet. Mix statement types and avoid equal counts per category.

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

Unknown suspension rule:
- `truthBoundary.unknown` is not a dumping ground for weak writing. It must preserve facts that cannot be solved by this live call: future behavior, whether the other party planned fraud from the start, what they would have done if confronted privately, whether the relationship/workplace arrangement can still recover, or what a missing off-mic person truly intended.
- The host may name what tonight can and cannot confirm, but must not close unknown facts with a moral lesson, forced happy ending, or "everyone learned something" wrap-up.
- Unknowns are part of the suspense aftertaste. Keep at least one meaningful unknown alive unless the case is deliberately a clean proof case.
- Do not use recap or share copy to smuggle an unknown into certainty. If the player did not hear or mark proof, the result should say "tonight cannot settle this", not invent closure.

Value baseline (see `docs/game-philosophy.md` for the full statement):
- Do not harvest gender conflict. A case may involve dating, marriage, family, work, money, or identity, but the conclusion must not imply "men are like this" or "women are like this".
- Unite decent people: people who communicate honestly, respect boundaries, take responsibility, and correct themselves when facts become clear.
- Hit harmful behavior: lying, manipulation, exploiting goodwill, shifting costs, borrowing family/status/platform pressure, using affection or opportunity as leverage, and refusing accountability.
- Gray-zone writing is allowed only to separate sincerity, weakness, self-protection, avoidance, mutual harm, and harmful conduct more accurately. It is not permission to excuse bad behavior or flatten different levels of responsibility.
- Mutual-harm cases are allowed and often desirable. If both sides harm each other, name the concrete behavior chain on each side, who started or escalated the imbalance, who carried the actual cost, and which boundary would stop the harm from continuing.
- Point criticism at choices, incentives, responsibility, and concrete behavior, not at gender, class, job, age, region, or other identity labels.

Grey-zone character checks:
- The caller is never a perfect victim. They must be hiding vanity, self-interest, luck-riding, or convenience somewhere in the opening — surfaced in the back half or the deep question.
- The other party is never a cartoon villain. Every cost-shifting move has an internally "reasonable" excuse in their own logic: 「我只是怕你离开我」, 「这是让你在老板面前展现执行力」.
- The host peels, never sentences. Options move from fact gaps toward the caller's own stake; the non-choice deep question lands on the caller's sorest money or face point.

## Call Loop and Reveal Rules

Material inspection is a playable beat, not a hint panel. A correct material pick should add a contradiction and keep audience patience unchanged. A wrong material pick may consume patience, but it must not reveal the correct answer. The route map should mark material beats as material, not as a fake sixth dialogue scene.

Host investigation and evidence backflow may expand the reasoning range, but only after the player has already heard the relevant contradiction. Treat these as a controlled extension of the material system: backstage verification, post-call direct messages, or limited off-mic inquiries can add fixed materials, not freeform facts. They must never turn into open-world investigation, AI-generated evidence, or a second-party live debate. Every backflow item must state why it appears now, which heard contradiction it relates to, what it proves, and what it still cannot prove.

Use an "Ace Attorney-style reveal" only when the host asks a natural question the caller has already made possible. The reveal should answer a practical why:
- Why did this person need a bank flow instead of a balance screenshot?
- Why did this proof appear before the meal, meeting, transfer, cohabitation, or family talk?
- What later arrangement, money ask, face-saving need, or deadline was hiding behind the innocent wording?

The reveal must add a new disclosed fact, not a narrator lesson. After the reveal, update the final quote-pick and share copy around that fact.

For the main playable beat, use a linear call loop:
- Let the caller advance one statement at a time.
- At each statement, ask only about this current point.
- Offer 2-3 plausible host angles for that statement. None should be completely wrong; they differ by how close they get to the core issue.
- The caller answer should reveal a new detail, a softened responsibility, or a pressure shift. It should not tell the player the lesson.
- The player may choose exactly one angle per statement. After that answer, the route moves forward; do not allow sweeping the remaining options on the same node.
- Each on-screen exchange should be at most two back-and-forth turns. If the text is long, collapse it to one host question and one caller answer.
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
- Comment-wall recap should be sharp but grounded. It may say a route was biased, incomplete, or unusually clear, but it must not attack gender or identity groups, and it must not invent facts the player did not reveal.
- If an audience-patience or health-like meter exists, verify it can actually run out and end a case. A health bar that never threatens failure will feel ornamental.

Hidden clue pacing:
- Early lines should expose observable oddness, not the final category.
- Middle lines can reveal concrete missing pieces.
- Final lines can expose intent or responsibility, but still through what someone says or refuses to say.
- A story-pack single case's main scene should usually be 5-6 caller statements advanced one at a time, enough to support at least 20 minutes with recap and route comparison. Each statement gets one current-node choice before the call moves forward, so the player is reading the live call rather than managing a menu.

UI copy:
- Buttons should feel like a linear call: "继续", "选一句原话", and short case-specific questions for the current point.
- Avoid mechanical labels: "阶段判断", "资料核验", "通话回放", "内容提示".
- In daily cases, avoid "接哪边的麦", "让另一方补话", or any copy implying two-sided mediation.
- Case-specific summary buttons should reflect the case: screenshot source, missing edge, evasive wording, timing, party switch.
- Investigation copy should sound like live-room backflow, not task UI. Prefer "后台进来一条私信", "有人补了一张图", "这页刚翻出来", or "对方没上麦，只留了这句". Avoid "new clue unlocked", "verification succeeded", "evidence chain complete", "correct route", or any copy that tells the player the system has found the answer.

## Clue Insertion Techniques

Clues must be embedded so the player earns the discovery. Never let a character state the lie directly; let it leak through weakness, guard, or accident. Every technique below is fair-play only if the leaked detail is on screen and can be traced back at recap.

Verbal clues (in the caller's retelling or quoted lines):
- Cognitive-dissonance slip: the caller or quoted party says half a truth, then scrambles to re-wrap it. 「我当时只是想，既然他工资卡交给我……啊不是，我的意思是，以后一起过日子，钱合着管比较好……」 The slip must be small, human, and recoverable — one per case at most.
- Euphemism downgrade: vocabulary drops from packaged to raw as pressure rises. Early: 「他在做一个周转」. Under pressure: 「我哪知道那是拆东墙补西墙啊」. Plan the word pair in the story packet so the downgrade lands as a beat, not an accident.
- Pronominal shift: the caller's label for the other party tracks their心理防线: 「我男朋友」 (opening, defended) → 「他」 (doubt) → 「那个人 / 对方」 (cut). Do not force the full chain into every case; even one visible shift late in the call reads loudly. Keep recap wording consistent with wherever the chain ended.

Physical clues (materials on the board):
- Accidental attachment: the material enters the call through a believable slip — 发错表、多选了一张图、转发时带上了上一条. The sender's intended message and the accidental payload should both be nameable.
- Intentional crop: the material is real but cut where cost or responsibility lives — 审批图裁掉付款回执、账单只截上半页、聊天记录从第二句开始. The crop line itself is the clue; the evidence check should let the player mark the missing edge, not the visible content.
- Metadata discrepancy: timestamps, battery/signal bars, weekday vs claimed context, background details that contradict the story. Use sparingly, and only when the discrepancy is markable in the material board (an `evidenceChecks` option), not prose-only trivia.

Placement rules:
- A physical clue's flaw should read as a common life mistake, not a puzzle-maker's plant.
- Each material clue must revalue at least one earlier spoken line (couple it via the coupling-review `revalues` field).
- New physical details invented for a technique must be added to `truthBoundary` and the pack QA report — a clue that exists only in one answer string will drift.

## Callbacks, Guard Continuity, and Guarded Answers

Casual seeds: early beats must contain 1-2 details that sound like atmosphere — a晒朋友圈的纪念日晚餐, a mentioned deadline, an offhand nickname — which later materials, DMs, or the deep question recontextualize into load-bearing facts. A case where every early line is obviously important has no reveal left.

Cross-beat verification: the core contradiction should never rest on one beat. It is assembled from an earlier statement + a later material edge + a side confirmation (backflow DM, quoted line). When rewriting any one leg, re-check the other two.

Guard continuity: the caller's guard state moves with the player's questioning, organically and in one direction at a time:
- Hitting a core gap early makes later answers slightly defensive — shorter sentences, one withheld specific, a deflection to feelings.
- Drifting on outer questions keeps the caller relaxed and self-assured — until the final quote-pick confronts them, where the dissonance should be audible.

Guarded answers are not bonus confessions. A `guardedAnswer` must withhold: fewer specifics, hedging, subject changes, a half-answer that still contains the beat's contradiction but with less texture. It must never pre-spend the deepFollowup confession, the recap conclusion, or the final quote payoff. If the normal answer names three details, the guarded answer names one and resists the other two.

## Diegetic Comment Hints

Comments are crowd noise first, hints second. They must never sound like a tutorial, name a clickable region before the player's first attempt, or use system voice ("快去点击社保截图" is banned).

Default layer (always allowed): atmosphere and route-axis reactions via `routeAxisComments` — the crowd reacting to the player's questioning style, arguing among themselves, confidently wrong. 「弹幕开始算账了」, 「钱路比委屈快」.

Pity layer (gated): a sideways, in-character nudge that points at the neighborhood of the gap without naming the answer. It may fire only when:
- the player has already made a wrong material pick on this board, or
- patience is in the low band and the case is stalling.

Pity-layer register — a sharp viewer thinking out loud, not an oracle: 「审批过了就完了？我们公司过审和打款差着仨签字呢」 (after a miss on the approval screenshot). Compare the banned direct version: 「去圈付款回执那一栏」.

Cross-case callbacks: in a story pack, later-case comments may echo only cases the player has already finished — 「这跟刚才那单一个味,先给身份后要钱」 — to make the pack thread felt during play. Hard spoiler boundary: a comment for the current case must never mention, foreshadow, title, object-label, or quote any case that appears later in the pack sequence. If the engine cannot prove a prior case is completed in state, use a case-local comment instead.

## Structure Archetypes

For case and pack skeletons drawn from classic detective fiction — false solutions, missing edges, distributed responsibility, weaponized narration — use [detective-patterns.md](/Users/pkuiloveoov/code/love/project-skills/detective-plot-coupling-review/references/detective-patterns.md). It includes the Rashomon multi-version self-edit and the Gone Girl-style "caller weaponizes the live room" patterns alongside the canon table. Use archetypes when designing new cases and packs; do not retrofit shipped demo cases onto a template.

## Validation

After content edits:

```bash
npm run check
npm run verify:pack -- <pack-id>
npm run test:narrative
```

Run `npm run smoke:browser` if the change touches flow, options, materials, or recap structure. Then hand off to `livestream-game-flow-review` for a played-through review — content is not done when the JSON validates; it is done when the call plays well.
