---
name: case-scriptwriting
description: Use when writing or rewriting 《直播间大侦探》 case content — openings, scene beats, question options, guarded answers, materials, comment seeds, recap/share copy, and case-length enrichment. Covers de-AI language rules, the story-packet → stitched-transcript → field-split workflow, dialogue rewrite rules, clue insertion techniques, gated diegetic comment hints, and how to make a case feel like a 20-minute playable call without filler.
---

# Case Scriptwriting

Use this skill for any case creation or dialogue change larger than typo polish. It is the writing-side companion to two review skills:

- [detective-plot-coupling-review](../detective-plot-coupling-review/SKILL.md) checks whether the mystery structure works: case ledger, false solutions, missing edges, coupling, fair play, story-pack threads. Run its ledger before writing and its checks after writing.
- [livestream-game-flow-review](../livestream-game-flow-review/SKILL.md) checks the played flow: playtest loop, UI regressions, continuity checklist. Run it after content lands.

Authority order when rules conflict:

1. Mechanical bans in `scripts/verify-logic.js` (DAILY-009 family and related copy tests) — these fail the build.
2. Value boundaries in [game-philosophy.md](../../docs/game-philosophy.md) and the value baseline below.
3. [dialogue-continuity-audit.md](../../docs/dialogue-continuity-audit.md) and the flow-review regression checklist.
4. The techniques in this skill.

Examples in this skill are technique demonstrations, not content patches. Any new fact they imply — a timestamp, an amount, a new material, a new third party — must pass the case `truthBoundary`, the coupling-review ledger, and the pack `qa-report.md` before it enters a shipped case.

## Language Rules (De-AI)

The goal is not "colorful" speech. It is a caller who sounds like a real person under pressure, in plain spoken Chinese, anchored to specific objects and numbers.

Two targets must hold at the same time, and they fail differently:
- 口语化: the line sounds spoken, not composed. This lives in syntax and rhythm, not in exclamation.
- 语意连贯: every line hooks the previous one. A line can be perfectly colloquial and still answer nothing; a line can connect logically and still sound like an essay. Write for both, audit for both.

真人口语门禁（禁会议纪要腔）:
- 审查所有玩家可见的说话面时，先问：这个具体人物在这个场合、对这个听众、不打草稿会这样说吗？像复盘纪要、办案记录、产品需求或作者批注的句子，即使语法正确也必须改。
- `核/核验/复盘/推进/承接/落点/口径/路径/兑现/对齐/闭环/归因/交付/复现` 是候选警报，不是无条件禁词。职业角色谈本职对象时可以用；主播和普通咨询者谈日常问题时，优先说 `看一下/对一遍/查到哪儿/接着聊/问清楚/又听见`。先看说话人和对象，再决定留不留专业词。
- 禁止把多个操作压成一句，如「能核的先核清」「把路径对齐后回来谈」。真人通常会拆成具体动作：「我先去找回单，再把那几栏对一遍」「明晚接着聊」。
- 不做逐词替换。一个书面词往往会带出整句的公文节奏；替换后必须重读前后两句，把连接词、名词化表达和收尾一起改顺。
- 主播不能用审讯命令、结案判断或工作流短语抢跑。先接住上一句，再问一个具体的人、钱、物件或动作；咨询者的回答要回应这个问题，或让闪躲本身清楚可闻。
- 每次修改同时检查重复源字段、opener/hangup 镜像和生成阅读版。旧句不得只在某个副本里残留。

口语形状与反例见 [spoken-corpus-patterns.md](references/spoken-corpus-patterns.md)。词表只能找候选，最终判定必须靠角色声纹、相邻话轮和朗读。

Canonical repair:
- Bad: 「流水我会先核，但那五万的去向，明晚我们还得回来谈。」
- Good: 「流水我先看一下。那五万到底去了哪儿，明晚我们还得接着聊。」

Caller vocabulary:
- No clinical or jargon speech in the caller's mouth: `核心风险`, `成本转移`, `转嫁债务`, `信用背书`, `认知偏差`, `流程空挡`, `洗房边界`. Callers argue in `钱`, `面子`, `责任`, `吃亏`, `谁占便宜`.
- No machine clichés: `心里咯噔一下`, `不由得倒吸一口凉气`, `不得不承认`, `听到这里`, `真正…的不是…而是…`. These are already banned mechanically; do not reintroduce them through paraphrase.
- Do not replace AI flavor with short-video melodrama flavor. `我当时脑子嗡的一声`, `这哪是爱我，这是把我当提款机啊` is the same failure in different clothes. When in doubt, go plainer: a concrete object, a time, an amount, and one feeling.

Spoken syntax (口语感靠句法，不靠感叹):
- 语气词 are calibrated per character and state, not sprinkled: `吧` softens or admits uncertainty, `嘛` claims the obvious, `啊` warms or protests, `呢` dangles a question. A guarded caller uses fewer particles, not more. Uniform particle density across characters is an AI tell.
- Ellipsis over completeness: drop subjects and objects the context already carries — 「问过。没敢再问。」 beats 「我问过他这个问题，但我没敢再问下去。」 Spoken Chinese runs on short clauses in a topic chain, not on complete sentences.
- Afterthought placement (追补句): real speakers finish the point first and patch the frame after — 「挺吓人的，那张表。」「我没答应，当场就没答应。」 Use 1-2 per case at high-pressure moments; it reads as thinking-while-talking.
- Lopsided recall instead of neat lists: a caller remembers one vivid item and trails off — 「他就总说店里压力大，别的……反正就那些。」 Never let a caller enumerate in tidy triples (「他会说A、说B、还说C」); inventory speech is essay speech.
- Vary sentence length hard: a three-character burst next to a long rambling clause. Uniform medium-length sentences are the strongest single AI tell in dialogue.
- Self-repair now serves two different jobs and must not be conflated when counting: (1) a caller's dramatic self-repair that does clue or characterization work — the cognitive-dissonance slip — stays capped at one per case; stacking more collapses back into a verbal tic. (2) The 语言噪声律 texture minimum (≥1 factual misstatement corrected mid-sentence, e.g. 「七万九……不对，八万」) and the host's own 主播狼狈配额 corrections are texture noise, not characterization payload, and are not bound by the one-per-case cap — a case can legally contain one caller clue-repair plus one host date-correction plus one caller number-correction without violating this rule. Tag every self-repair beat with which job it is doing before counting it against either rule.
- Keep object names stable per character: pick what this caller would call the thing (「那张表」) and hold it. Cycling synonyms (表格/资源表/排班表/名单) inside one speech is elegant-variation slop — a label change must mean something, like the pronominal shift.

Coherence (连贯靠接话头，不靠连接词):
- Every turn picks up the previous turn: echo its word, answer its question, resist it, or visibly dodge it. A visible dodge is a connection — the audience hears the swerve. A topic jump is not.
- Question-answer adjacency runs both ways: the host may only ask what the last caller line makes askable; the caller must address — or audibly evade — the question actually asked. An answer that would fit under any question answers none; rewrite it around one word from the question.
- Anchor by repetition, not pronouns: when a referent could blur across turns, a stressed caller repeats the object — 「那八万」「那张表」 — instead of 「它」「这个事」. This is simultaneously more spoken and more coherent; it is the cheap trick that resolves the 口语化-vs-连贯 tension.
- Discourse markers (`后来`, `反正`, `就是`, `要不`) are structural signals, at most one per turn: `后来` returns to the timeline, `反正` closes an argument the speaker refuses to itemize, `要不` raises an option they are half-committed to. Never use them as sentence lubricant.
- Do not polish lines in isolation. A pass that makes each line individually colloquial but breaks who-answers-what is a regression. Coherence is audited at transcript level — see the pickup audit in the writing workflow.

### Dialogue Humanization Closure (双层人话闭环)

Run these passes in order on every changed spoken line. Both must pass: deleting a summary is not the same as making speech colloquial, and adding particles is not the same as removing authorial summary.

1. **Summary-removal pass (删总结)**: remove conclusions, theme lines, camera captions, retrospective labels, and tidy psychological diagnoses that the character would not volunteer in that moment. Keep the concrete action, quotation, amount, object, or sensory fact that lets the listener reach the conclusion. Move genuine blocking to `stage`; delete a sentence whose only job is to tell the audience what the scene means.
2. **Spoken-realization pass (口语复述)**: after the deletion, make the remaining event sound like a person recalling it rather than a case-note timeline. When a past action crosses a sentence boundary, restore only the time or sequence marker the listener needs (`当时`, `那会儿`, `后来`, `然后`, `结果`) and repeat the actor or object when its reference would otherwise float. Do not sprinkle markers as decoration.
3. **Five-turn read**: read the changed turn with the two spoken turns before and after it. Each question must arise from a word or fact already available; each answer must answer, resist, or audibly dodge that exact question; the last turn must leave one identifiable open edge.
4. **Surface sync**: update normal and guarded answers, runtime `lines`, openers/closers, adjacency anchors, source treatment, and generated reading scripts. Search for the rejected wording across the whole repository; a cleaner primary field with a stale shadow copy is a failed repair.
5. **Mechanical closure**: run the content builders and `npm run check`. If the edit changes scene order, paging, choices, or runtime rendering, also run the production build and browser replay smoke test.

Canonical compressed-retelling repair:
- Bad: 「问过一次。他愣了一下，说‘反正不是乱来的钱’。我再问，他就把话岔开了。」
- Good: 「问过一次。他当时愣了一下，说‘反正不是乱来的钱’。然后我再问，他就把话岔开了。」

The extra words are not filler: `当时` separates remembered event-time from the caller's present narration, and `然后` makes the second question a consequence in the same recalled exchange. More summary-removal and retelling shapes live in [spoken-corpus-patterns.md](references/spoken-corpus-patterns.md).

### Human Causality and Evidence Gate (逐句人类因果与证据来源门禁)

Apply this gate to every player-visible spoken surface, not only the mainline. Audit `openingDialogue`, fixed scene lines, every free/key option, normal and guarded answers, closers, materials, callback openers, advisor/NPC speech, recap quotes, and generated reading scripts.

- **Referent before interpretation**: name the concrete person, object, purchase, message, or event before discussing its nickname, meaning, emotion, or motive. A caller must say what the 12,000 yuan bought before explaining why someone called it an “investment”. An isolated conclusion whose object arrives later is reversed causality.
- **Speaker-view only**: spoken dialogue contains what this person would naturally remember, notice, say, refuse, or infer in the moment. Delete camera blocking, balanced literary montage, author captions, and after-the-fact taglines from a character's mouth. 「我看窗外，他看酒」 and 「那两个字卡在这儿，投资」 belong to a director or essayist, not a caller.
- **Evidence-source ledger**: for every factual host premise, name the exact visible source: caller statement, bill row, screenshot, audio, public post, prior confirmed answer, or professional common knowledge. A bill proves merchant, amount, and date only if those fields are present; it does not magically contain booking membership, motive, ownership, or off-screen history. Material copy says only what the artifact visibly contains.
- **Row-identity conservation**: adjacent dates and similar amounts do not prove that the same money moved from one row to another. State each row with its date, direction, amount, and counterparty before drawing an inference. Write 「7 月 5 号信贷放款五万；7 月 19 号向 3301 转出 49,800」 unless the material can truly prove 「这五万转去了 3301」. Keep temporal proximity separate from fund identity.
- **Amount-bucket conservation**: before a character or recap assigns moral responsibility for a bill, divide the total by visible use and beneficiary: shared/relationship spending, one party's personal spending, and still-unexplained remainder. Every bucket needs itemized support, and the arithmetic must survive the total. Do not compress restaurant booking, social posting, and a content account into three separate accusations when they are one social-performance event; do not call the whole bill “spent on her” when rows also show his personal vanity. Ask the person to confirm or dispute one bucket, then discuss responsibility.
- **Unresolved-identity budget**: count every distinct "who received/sent this and we don't know" thread in a case — unknown payee, unknown account, unnamed institution, unconfirmed relative. A tier-1/opener case should carry at most two; a later or capstone case may carry more only if it is the pack's deliberate density peak. Two threads that share the same shape (an opaque lump-sum transfer to an unnamed recipient, repeated with different numbers and institution names) read as one puzzle wearing two costumes unless the case gives them visibly different textures, stakes, or resolution paths — collapse or clearly differentiate them before shipping, and never stack a new cross-case seed thread onto a case that is already at budget.
- A named institution already registered in `crossCasePromises` is an institution-result thread, not another anonymous identity. Its remaining questions are limited to product, payment status, contract terms, and recoverability. Do not restage it as a third “who received the money” mystery.
- A masked surname that only labels one recurring date pattern belongs to that supply line. Count the broken pattern once; do not turn “王**” and “每月 8 号” into two separate unknown people. Tier-1 and opener-facing anonymous identity threads still stay at two or fewer. For case 1 they are the 8th-day supply pattern and account suffix 3301; 宸直 remains a named institutional payoff thread.
- **Speaker-and-evidence conservation**: keep every fact attached to the person or artifact that actually supplied it. A third party's refusal to confirm proves only that they refused; the host may not compress it into a quoted shorthand such as 「店里不肯说」 and then speak a conclusion on the third party's behalf. Name the carried item after the observed boundary (`餐厅拒绝核对`), not the hoped-for fact (`她的会员号`). Promote the fact only when its owner, a visible document, or another valid source confirms it later.
- **Observation → hypothesis → confirmation → derived question**: when the source supports only an inference, the host asks it as a hypothesis. The caller or material must confirm it before the host asks a question that presupposes it. Example: hard-to-book seat → “Are either of you a long-time member?” → caller admits membership → only then ask about earlier visits and spending power.
- **No redundant interrogation**: once invariant dialogue has already named who booked, who ordered, what was bought, or who posted, the next host turn may not ask the same fact again. Ask the next unresolved edge: destination, payer, prior pattern, timing, or why it was withheld.
- **No plot-scheduled withholding**: a caller may refuse only when the audience can hear the human cost of answering: shame, money, safety, status, or fear of being blamed. Do not use lines such as 「今晚还不想说」「先让我把账算完」「后面再讲」merely to save a known fact for a later scene. When directly asked about an object the caller knows, let them answer with their self-serving interpretation (for example, 「东西在我这儿，但我当时以为是他买来送我的」); a later beat should deepen the action or responsibility, not reveal the same ownership fact after an artificial delay.
- **Complete action before reaction**: a social reaction needs its triggering action and subject in the same local chain. Do not drop 「照片是我发的」 as a floating answer. Say who posted, who did not, and only then what friends saw or said.
- **One inferential step per turn**: a host turn asks one question. Do not bundle identity, ownership, motive, history, and affordability into one leap. If the answer creates a new premise, put the derived question in the next turn or fixed follow-up exchange.
- **Responsibility question before judgement**: the key moral question must be spoken, not left for recap copy to imply. Once the bill buckets are visible, the host may state the narrow calculation and ask the caller which item in the caller-related bucket is actually unrelated to them. The caller must be allowed to dispute the premise, admit benefit without accepting another person's whole debt, or visibly refuse. Only after that exchange may the host separate shared spending, personal display, and unexplained money in `stageJudgement`.
- **Branch independence**: fixed follow-ups and `sceneCloser` lines may use only invariant facts or facts established on every route. A branch answer cannot secretly become the premise of a later fixed question.
- **Local-chain repair**: after changing one line, reread at least the two preceding and two following spoken turns, then update doubt/contradiction metadata, materials, adjacency anchors, and generated scripts. A clean sentence inside a broken five-turn chain is still a failed edit.

For each factual host question, write a private five-column audit before shipping: `spoken premise | exact source | source proves | source does not prove | next legal question`. If the exact source cell is blank, move or rewrite the question. Concrete before/after shapes live in [spoken-corpus-patterns.md](references/spoken-corpus-patterns.md).

### Micro-Logic Closure Contract (剧本小逻辑闭环合同)

Treat each load-bearing choice as a typed state transition, not a good-sounding question. Every `questionOptions[]` item with `correct: true` must carry a `logicContract`:

```json
{
  "premiseAnchor": "an exact phrase already spoken in this scene",
  "sourceKind": "caller-statement | quoted-message | document-readout | audio-playback | host-calculation | confirmed-followup",
  "sourceProves": "the narrow fact now available",
  "sourceDoesNotProve": "the tempting conclusion still unavailable",
  "answerAnchor": "an exact phrase in the normal answer",
  "answerAdds": "the new fact or admitted boundary",
  "nextLegalQuestion": "the furthest follow-up now licensed"
}
```

- `premiseAnchor` must exist in invariant `beforeVersion + version + afterVersion`, never in a sibling option.
- `answerAnchor` must exist in the answer. A refusal still adds a boundary: what the caller will not yet say.
- `sourceProves` and `sourceDoesNotProve` must describe different scopes. If the latter is empty, the question is probably smuggling in a conclusion.
- `nextLegalQuestion` is a ceiling, not mandatory dialogue. Any later fixed line that goes beyond it needs a new source or confirmation.
- Any load-bearing `sceneCloser` also needs `closureContract: { entryAnchor, closerAnchor, adds, openEdge, routeIndependent: true }`. `entryAnchor` names the invariant thread or the caller's audible interruption; `closerAnchor` must occur in the fixed closer; `adds` states what changed; `openEdge` names the one question deliberately left alive. A closer that depends on a chosen answer cannot declare route independence.
- Scan all spoken roles for camera terms, external body-language captions, balanced montage, and author taglines. Move genuine blocking to `role: stage`; convert knowable content to first-person action or direct quotation; delete the rest. Never replace a deleted narrator line with another summary line.
- After a deletion, rebuild the five-turn window: two turns before, the changed turn, and two turns after. The window passes only when every question has a premise, every answer responds or visibly refuses, and the last turn leaves one identifiable open edge.

#### Ambient Promise Closure（偶发细节闭环）

声音、物件、陌生来电、地点变化和被打断的话，只要被角色单独注意，就不再是用来占时长的气氛句。落笔前必须把它分进三类之一：

1. `disposable texture`：一次性的普通生活声，不停、不回头、不改变人物动作；可以标 `nonLoadBearing: true`。
2. `local promise`：本案内被注意的异常，必须登记 `plant -> openEdge -> payoff -> proves / doesNotProve`，并在材料、回拨或结案中回收。
3. `cross-case promise`：会在后案改变理解的公共事件，进入包级承诺账本，按“个案种子 -> 职业见闻加固 -> 后案玩家动作 -> 公共结果”推进。

- 警笛只是远处掠过，可以是生活噪声；警笛靠近、停在楼下，紧接着有人敲门并迫使连线中断，就已经让人物和玩家产生问题，禁止再标 `nonLoadBearing`。
- 第一夜只种动作，不许当场自解。敲门导致挂断时，咨询者只能说“突然有事”；第二夜由主播先问为何挂断、来人是谁，再逐步问出对方问了什么。不要让旁白说“原来昨天那声就是……”。
- 回收优先通过可见变化触发：第二夜换了地点、人物承认昨晚被问话、桌上多出一张回单。让主播顺着变化问，不让咨询者无缘无故提交完整答案。
- 回收只回答原先留下的那条开放边。新材料若只证明“转账、聊天、同额回单先后出现”，不得因为戏剧上顺滑就写成“同一笔钱已经坐实”。
- 若一个被强调的偶发细节既不改变人物决定，也没有回收价值，降成不被注意的普通环境声，或直接删除。

Run the pack validator and generated micro-logic table. A missing contract, stale anchor, narration leak, or unsupported fixed follow-up blocks shipping.

Voice fingerprint:
- Plan 2-3 speech fingerprints per caller in the story packet and hold them for the whole call: a pet filler, a sentence-length habit, what they call the other party (and where that label shifts), and which topic makes them go short.
- Guard state modulates the fingerprint — guarded means shorter turns, fewer particles, more object-name repetition — it does not replace it.

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

摘要即回归 (compression is regression):
- Per-line/AVG display is achieved by SHORT SENTENCES, never by SHORT SCENES — the chunker splits long speech; it never licenses deleting texture. Any edit that raises information density by removing emotional beats, direct quotes, verb texture, or connective breath is a content regression regardless of intent (the 15d5749b incident: 「他把截图丢给我…那一刻我不是生气，是懵」 became 「他发办材料截图…我当时没接上这件事」 — that is a log line, not a person).
- Per-scene texture floor: every `version` keeps at least one direct quote OR one afterthought/particle beat, AND at least one non-load-bearing sentence. A scene where every sentence carries plot is a synopsis.
- 发现权守恒 (conservation of discovery): anything the player is designed to earn — document rows, laundering catches, replay finds, mid-case turns — may never be pre-narrated by the caller or any surface. A refactor that surfaces hidden agency early, or has the caller recite exhibit rows, breaks the case even if every sentence reads fine.
- Any rewrite pass must ship a texture diff: count of direct quotes, emotional beats, and breath sentences before/after per scene. Net loss requires explicit sign-off, not a commit message.

## Manufacturing Doubt, Questions, and Turns (疑点、问题点、转折点的制造方法)

Doubt points are not invented; they are computed. Run this method between the pressure-system pass and the beat-ladder pass. Its checking-side counterparts (A/B story, suspense check, promise ledger) live in `detective-plot-coupling-review`.

### The Truth Ledger with Numbers (真相账本)

Before any dialogue, write the B story's full accounting — every amount, every date, every money path, every object's history — **including the parts that will never appear on screen**. The demo's best turn only became findable when 八万 was decomposed into three buckets: 不到三万的共同消费、约一万五的男方男装、至少三万五未说明; its second turn (每月 8 号还入) only existed because someone wrote the debt's repayment history that no scene had ever needed. The unstated ledger is where turns hide. A case whose B story is only prose has no turns to find.

### The Six Operations (六种运算)

Run each operation over the case's own objects. Any operation whose output contradicts the A story is a candidate turn:

1. 加总 — do the stated parts sum to the stated whole, and have they been grouped by actual beneficiary? (八万里共同消费不到三万，男方男装约一万五，至少三万五仍未说明)
2. 日期差 — subtract any two dates, but publish the quantity only when both endpoints exist in the same evidence ledger. Prefer the row dates themselves when the case date is not explicit. (工资停发早于贷款入账；供血停止早于开口)
3. 往前翻 — every object has history pages: last month's bill, older chat logs, the schedule before this one. (往期账单上的交往前同款消费)
4. 主语核对 — for each action, who actually performed it? (订座的会员号是她的；群里"要不要问流水"是她先发的)
5. 覆盖检查 — does the excuse cover every path it claims to cover? (财务延后盖得住报销，盖不住供应商返款)
6. 模式比对 — the same pattern elsewhere, elsewhen, or to others; and against the institutional template. (同款话术发给多人；维护表店里都有，"下一次推进"列只有他有)

Hidden-in-plain-sight rule (藏在明处守则): prefer operations the player could have run themselves, and ensure **every input to the operation was on screen before the operation is executed**. The aha of "我怎么没算过" is the fair-play form of 意料之外、情理之中.

### The Processing Chain (疑点 → 问题点 → 转折点)

- 疑点 is the perceivable form of an unexecuted operation: the caller can report it without interpreting it (「他非要我当晚转，我就开始不踏实了」 is the perceivable form of a date subtraction nobody has done yet).
- 问题点 is the one natural question that names the operation (「跟你们有关的不到三万，他自己的男装一万五左右，剩下那三万五你问过是什么吗？」 names the 分桶加总). Every 疑点 must own exactly one askable question — a 疑点 without its question is an unfired gun; a question without its 疑点 is unfair. Question points become key options; the answer either converts an A-piece or dodges visibly.
- 转折点 is the operation executed on screen, and its output must change the case's **subject, nature, coverage, or timeline — never merely its weight**. The escalation test: if the player's verdict sentence survives with a bigger adjective (「他更渣了」), you wrote escalation; if the sentence's subject or predicate changes (「这不是消费债，是旧洞借恋爱叙事递账」), you wrote a turn.

### The Four Flip Axes and Two Closure Types

A real turn flips one of four axes:
- 主语翻转 — who benefited or initiated (分期的受益账号是她的)
- 性质翻转 — what kind of case this is (消费债 → 旧洞包装)
- 覆盖翻转 — the excuse covers less than claimed (延后通知只盖一条钱路；八万里共同消费不到三万，另有个人男装与未说明金额)
- 时间线翻转 — the story started earlier than told (交往之前的同款消费)

And closes in one of two ways:
- 确认型 — the turn closes into one reading. At most one per case, and packs must vary which case gets it (案 2 确认多线；案 1 因此不得再确认多线).
- 开放型 — the turn opens 2-3 readings and closes none (8 号还入让拆东墙/多线/化债全部立起又都不落死). Strongest at case end. The share question is the only surface allowed to invite the speculation; live copy, recap verdicts, comments, and advisors must leave all readings standing.

### Placement Rhythm (布点节奏)

- 疑点 land early and must split between hypotheses — some feed the false solution, or the case becomes a confirmation march (the polarity rule).
- 问题点 occupy the mid-case key options.
- 转折点 land after the midpoint, with all operation inputs pre-shown.
- The ending is the question the turn opens but tonight cannot close. 留白必须有形状: "他还有问题" is dust; "信用卡里至少三万五由哪些消费构成" and "每月 8 号的入账为什么在七月断了" are shaped unknowns — they name exactly what we now know we don't know, while keeping the two documents separate.

## Writing Workflow

### Screenwriter Contract

Before writing UI fields, write the case as a small pressure system, not as a mystery answer. The player should feel they are listening to someone slowly reveal a messy relationship or public-life conflict, while the live room argues over which sentence is off.

Two governing clauses (宗旨):
- **Mainline first, branches second**: write the spine — the complete mainline story, beginning to aftermath — before designing any choice, branch, or variant. Branches are camera angles on a finished story; they are never patches on an unfinished one. If a branch needs a fact the mainline doesn't own, the mainline is not done. This ordering applies at every scale: pack before case, case before scene, scene before options.
- **Everyone is flesh and blood**: every speaking being — caller, advisor, off-mic voice, the host, even one line of crowd chatter — has 七情六欲 before it has a function. Appetites, tempers, shames, wants. Before writing any line, name what its speaker wants in that moment; if a line could be delivered by "an NPC", its speaker doesn't have a want yet — stop and give them one. Stance cards, voice fingerprints, and the family web exist to serve this clause, not to replace it.

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
6. Actor-consistency / stake-alignment pass: separately ask what the caller, the other party, and the third-pressure source each gain by saying less than the full truth. For every visible line, name whose face, money, status, safety, or convenience the line protects; if it only delivers background to the player, fold it into a material, host prompt, or later confession.
7. No-pristine-victim pass: when the caller gets a highly sympathetic or pitiful line, immediately plant the caller's tolerated convenience, benefit, face-saving, or shortcut in `selfServingOmission`, an early verb choice, a visible material edge, or a later deep question. A caller can be more harmed than guilty, but they cannot be written as morally spotless until the recap suddenly says otherwise.
8. Evidence-verbal deadlock pass: identify the material-board edge that locks against a spoken claim. If the core reveal can be reached by host questioning alone, add or rework a physical clue: a missing half of a screenshot, a date on a bill, a cropped approval page, a stray account name, a private column, or a backflow material. The deep question should feel forced open by this deadlock, not by the host being clever.
9. Continuity QA pass: read the whole call aloud and check that every reveal follows from what is already on screen. A small clue may open one local question; it may not instantly become a full motive, scam label, or final judgement.
10. Length QA pass: estimate what the player actually does. If the case has only live reading plus one quote-pick, it is underbuilt for Steam. Add authored interaction, not prose bulk.

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

Double-layer question economy:
- The live-call screen may have a free context layer and a committed pursuit layer, but they must not be the same option list twice.
- `dialogueOptions` are authored free asks: chronology, caller self-protection, relationship context, document origin, or a concrete "how did that line happen" probe. They can add texture, loosen or tighten the caller, and surface a small human excuse, but they must not solve the node.
- `questionOptions` are committed pursuit routes. Each current node should have 2-3 plausible host angles with different reveal depth: one closest to the load-bearing gap, one socially tempting detour, and one caller-side or document-side pressure when the beat supports it.
- A committed route may expose a short `suspicionLabel` instead of its full `question` when the player's decision is the doubt direction, not the protagonist's wording. Keep `question` mandatory: after selection, 林旭阳 speaks that natural full sentence and the caller answers it. `suspicionLabel` names only an already-visible person, object, action, number, or mismatch; it must not contain a conclusion, route-axis term, or answer.
- Direction-only display is a node-level presentation mode, not a correctness badge. If one sibling option in a node has `suspicionLabel`, give every committed sibling one of similar specificity and visual weight. Never put short labels only on core/correct routes.
- Free asks are not a spoiler mode. Asking around can make the caller more guarded, reduce later answer texture, or leave the live room noisier. Do not let the player sweep free asks to identify the correct committed route for no cost.
- Do not write the free ask by copying the committed option and changing one word. The player should feel they asked a side question, not previewed the answer key.
- Visible UI labels must stay clear before they stay stylish. Avoid `soft ask`, `hard ask`, `核心`, `正确`, `最佳`, route-axis labels, and vague process labels like "先问两句", "接着追", or "选一句往下追". Because the game has two different economies on the same screen, the panel may explicitly say "普通提问" and "关键选择"; each button should carry the same kind marker so the player never has to infer the rule from color alone.

Material board writing:
- Material text says what is visible, not what is missing. Put the gap in the selectable marks and feedback.
- Bad: "看不到连续流水、收入构成" when the correct mark is "连续流水和收入构成".
- Good: "资料里有一张当日存款证明，余额停在 28.6 万；另一张收入截图只露出本月到账和公司抬头." The player then chooses whether the missing flow, sender, timestamp, or account edge matters.
- A material board is strongest when every miss is genuinely suspicious but less load-bearing than the correct mark.
- Every case needs at least one **实物-言语死锁**: a material-board detail must contradict, limit, or reframe a spoken claim so tightly that neither side can talk around it. Examples: a bill date that outlives the "I had no choice tonight" line, a missing payment page that breaks "approval passed", a private "next push" column that breaks "store template", or a group-chat top line that breaks "my mom asked". Do not let the host solve the case through oral questioning alone.
- A prose-only `evidenceChecks` board does not satisfy 呈堂律/行派生律 by itself. Every case in a demo pack must also ship at least one interactive row-level `documents` entry (dated rows with `rowQuestions`/cross-row questions the player can mark) — the row IS the clue, not a paragraph describing what the row would say. Before closing a content pass, check `documents` presence per case id; a case with an `evidenceChecks` board but zero `documents` rows is under-built regardless of how many material boards it has.
- Row-level documents are not limited to bank statements. For approvals, chats, medical records, booking logs, or process timelines, define explicit player-visible `columns` and use `dateMode: "relative"` when the source only establishes relative time. Do not invent an `MM-DD` date to satisfy a bank-statement schema. Preserve the source's own time language (`前一天 14:22`, `九天后`, `截至第二晚`) and validate each row against the established evidence.
- An execution prompt's proposed dialogue is still draft material, even when it says “逐字使用”. Before inserting it, run the same adjacent-turn and human-speech checks as every other line. Rewrite author shorthand such as “旧洞 / 新洞 / 压的注 / 两条都要问” into a concrete question-and-answer exchange that names the visible dates and lets the caller agree to the next question.

Runtime-length plan hygiene:
- `runtimeLengthPlan` is not decorative metadata. When it exists, review must compare it against actual JSON counts: live beats, material boards, backflow items, truth-boundary prompts, and what the player does besides reading.
- If automated verification is available, wire these counts into `verify:pack` as warnings. Until then, every content pass must check them manually so the field does not become another shadow asset.

Do not enrich by:
- adding a second live caller in the daily/unit case;
- adding freeform AI evidence or new facts not authored in JSON;
- adding tutorial text, route-axis labels, "look here" hints, or hidden score explanations;
- lengthening every answer into a monologue;
- repeating the same contradiction in different words;
- turning the host into a judge, therapist, lawyer, or lecturer.

### Expansion Playbook (把 10 分钟做成 20 分钟)

Nine expansion methods, ordered by cost. Every added minute must carry an A/B conversion, a value turn, or a live hypothesis — an added minute that carries none is prose bulk wearing a mechanic. Never expand by adding a second live caller.

Content-only (no engine work):

1. **Authored press layer** (from Ace Attorney's press-any-statement design: pressing is never punished, rewards the curious, and occasionally shakes loose real texture). Give each scene 2-3 authored 随意提问 questions — background, feelings, the other party's habits — written separately from key options, never recycled from them. Pressing yields characterization and guard shifts, not contradictions. Curious players roughly double their dialogue time; the main path stays untouched. This is depth-on-demand, the safest minutes in the game.
2. **In-call act structure** (from TV act craft: every act is a mini-arc and every act break is a hook). Group 5-6 beats into 2-3 mini-acts. Each act ends on an open hook — a withheld object, a half-question, a friend's silence — and each act break is where a material board or backflow item wants to sit. A beat may not end an act on closure.
3. **Intensity alternation with one legal breather** (from TV pacing: high-intensity scenes reveal, low-intensity scenes let the audience process). One low-intensity beat per act — the caller catching her breath, a lighter crowd exchange — is legitimate content that makes the next reveal land harder. Maximum one per act; two breathers in a row is sag.

Small engine (one field plus render):

4. **Evidence reaction lines** (`evidenceChecks[].options[].reactionLine`): the caller answers the player's mark in voice. Turns each board pick into a dramatic beat. (Contracted in drama pass 3.)
5. **Testimony revision** (the single strongest AA borrow: pressing forces the witness to modify testimony). After a core hit or board hit, the caller restates an earlier version with 1-2 sentences changed — field like `revisedVersion` anchored to a scene. The player replays the comparison in their head; spot-the-difference is gameplay made of pure dialogue. +2-3 minutes per case, and it converts confession-driven reveals into detection-driven ones.
6. **Mid-call material anchoring** (`evidenceChecks[].afterScene`): alternate testimony segments and material segments instead of all-scenes-then-board — AA's trial rhythm. Expands play through rhythm, and it is the structural fix for boards being an epilogue instead of a turning weapon.
7. **Multi-mark boards** (`marksRequired: 2`): one rich material, two or three required marks in sequence — 先圈时间列，再圈用途行. Each mark gets its own feedback and reaction line. Doubles the time a board carries without adding a board.

Larger engine (new interaction, design first):

8. **Timeline assembly**: order 4-5 dated events (断缴 → 分期开通 → 借钱 → 催款). Native to this pack's 时间诡计 load-bearing layer — the case's whole trick made into a hands-on beat. One-shot like the boundary sort; misses count at the finale.
9. **Live-room B-runner** (from TV A/B/C story ratios — roughly 9 main beats to 2-3 runner beats, and the runner resolves before the A-story climax): 2-3 interruption micro-beats inside the live room itself — a 黑粉 thread the host must answer once, a platform warning strip. The runner must stay host-versus-room diegesis; it never becomes a second case party and never violates the single-caller contract. Resolve it before the final quote-pick so the ending belongs to the A story.

Budget sketch for a 20-minute case: base linear call ~10 minutes; authored press layer +2-3 (opt-in); testimony revision +2-3; mid-call board rhythm +1-2; multi-mark or timeline +1-2; act hooks and breather pacing make the same minutes feel fuller rather than longer. Prefer methods 1-5 before 6-9; prefer any of them over longer answers.

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
   - Pickup audit (接话头): for every turn, name the exact word, question, or claim from the previous turn that it picks up — or the visible dodge it performs. A turn that could follow any previous line equally well connects to none; rewrite it around one word from the turn before it.
   - Voice audit: check each caller turn against the packet's `callerVoice` fingerprint — filler, sentence habit, name for the other party, shutdown topic — and check that guard state tightens the fingerprint instead of replacing it.

3. Only then split into data fields.
   - Each UI field must be traceable back to the story packet.
   - No field may introduce a motive, fact, object, or conclusion that did not appear in the stitched transcript.
   - An outer branch can reveal less, but it must still point at the same case core. Do not use generic emotional outer angles such as "do you still like them" unless the case core is actually emotional attachment.
   - Quote-pick choices must be copied from disclosed lines or compressed from disclosed lines. They are not labels for hidden conclusions.
   - For a direction-only node, preserve both layers: `suspicionLabel` is what the player chooses; `question` is what 林旭阳 actually says. Read the question-answer exchange aloud without the label before shipping it.

4. After any line edit, rerun local coherence.
   - Ask: whose face, money, status, safety, or convenience does this sentence protect?
   - Ask: did this sentence change who pushed the dramatic object into the call?
   - Ask: did this sentence make an earlier option or later conclusion incoherent?
   - If yes, update the whole affected chain, not just the sentence.

### Adjacent-Turn Contract (逐话轮承接合同)

整体因果成立，不代表电话听起来成立。字段拆分完成后，必须按运行时真实顺序再审一次相邻话轮，不得拿大纲解释句间跳跃。

For every player-visible question and answer, record four concrete items in the pack's `dialogue-adjacency-review.json`:

1. `contextAnchor`: the exact word, object, amount, action, or claim already present in invariant dialogue. It may come from the opening or an earlier fixed scene, but never from an optional sibling answer the player may not have heard.
2. `questionAnchor`: the exact phrase in the host's question that picks up or deliberately resumes that context.
3. `answerAnchor`: the exact phrase that answers the question, refuses it, corrects its premise, or visibly dodges it. `guardedAnswer` needs its own anchor because pressure can change the rendered answer.
4. `relation`: one plain sentence explaining the cause-and-response link. Labels such as `承接上文`, `回应问题`, `自然过渡`, and `继续追问` do not count.

Local rules:

- After a life-noise aside, pause, playback, or stage direction, the next host line must name the thread it is resuming. The audience should not have to remember which JSON field came before the interruption.
- Optional free questions can be chosen in any order. Each one must re-enter through invariant scene context and may not depend on another free answer.
- A question may introduce a topic only by asking whether it exists. It may not quote a phrase, person, motive, or action that no invariant line has disclosed yet.
- A caller answer can refuse, but it must refuse the asked thing. Changing subjects without a visible dodge line is missing dialogue, not characterization.
- `sceneCloser` is rendered after every committed option. It must make sense after every possible answer and guarded answer; a closer may not assume the player selected the core route.
- When an option carries both `answer` and authored `lines`, runtime displays `lines`. Treat `answer` as a shadow copy: update both in the same patch or remove the stale copy. A clean `answer` field does not count if the player still hears an older fact from `lines`.
- A cross-scene jump must be labeled `continue`, `resumed-thread`, or `interrupt`. `resumed-thread` names the older unresolved thread in the spoken line. `interrupt` needs an in-scene event such as a new message, a person entering, or the call dropping.
- Read the generated adjacency table vertically and aloud. If a relation needs author-only facts to sound plausible, rewrite the dialogue rather than expanding the note.

Run `npm run content:adjacency-report` after dialogue changes. `npm run check` rejects stale reports, missing reviewed scenes, stale anchors, unreviewed guarded answers, and route-dependent closers in cases already marked as reviewed. The report does not claim to understand semantics; a human still approves each `relation`.

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
  "callerVoice": {
    "filler": "",
    "sentenceHabit": "",
    "nameForOther": "",
    "nameShiftsAt": "",
    "shutdownTopic": ""
  },
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
- If the caller's line is especially委屈 or可怜, do not leave it clean. Within the same local chain, plant the benefit, face, convenience, or fear that made them tolerate the situation longer than they now want to admit. Store that pressure in `selfServingOmission` and pay it off through a material edge, backflow item, or deep question.
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
- Each display page carries at most one host question and one caller answer. Never pack two host questions into one turn just to move faster. If an opening needs relationship stage, trigger, and material source, add alternating turns and let each answer make the next question possible.
- When one answer is too long for a page, split it across consecutive caller pages at a breath, self-correction, or detail shift. Do not shrink the scene or raise information density to satisfy pagination.
- If every core node is hit, insert exactly one non-choice "深入一问" before the final "选一句往下追" moment. This question should surface the caller's own stake, cost, family pressure, money position, or hidden ask.
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
- Conversational Phrasing Rules (直播连线拟真话语权与对话承接规范):
  - Do not use abrupt, clinical, or command-style speech for the host or caller. It must feel like a real phone-in talk show, not a rigid script or a police interrogation.
  - **Caller openings must be conversational and progressive**: Instead of keyword-heavy statements like `“我们谈了半年，之前约会一直挺体面。前几天他突然说信用卡要周转...”` (abrupt and robotic), write it with natural spoken transitions: `“我们谈了半年多，平时约会消费什么的都挺体面的，我也没觉得有什么问题。结果前几天他突然跟我说信用卡需要周转，想让我先帮他顶一下。”` (colloquial, natural pace).
  - **Host transitions must be warm and inquiry-based**: Instead of abrupt commands like `“先说第一次提钱，他原话怎么讲？”` (sounds like an interrogator), write it as an empathetic inquiry: `“晚上好。我想问一下，他提钱的时候，原话是怎么讲的？”` (natural hosting transition).
  - Avoid any Host or Caller lines that sound like system placeholders or prompt labels.
  - **Pack-level opening variance**: a story pack must not let its opening first caller line collapse into one shared template with only the topic noun swapped (「主播你好，我想问一段...的事」×4). Vary the entry energy per caller: one blurts the number before the greeting, one apologizes for calling this late, one has clearly rehearsed a neutral line, one gets interrupted by the host before finishing a sentence. Read all four openings back to back before shipping — if you can predict word six of case 3's opening from case 1's template, rewrite it.
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
- Final quote choices must be ungated under the one-commit question economy. Every `accusationChoices[].label` must have a source in text all routes can see: opening dialogue, `sceneVersions[].version`, material board text, or investigation/backflow material. A quote that exists only inside one branch answer is unfair after the player can hear only one answer per node.
- When an audit finds a gated final quote, repair the local chain rather than just swapping the button: weave the quote into the ungated scene version if it belongs there, then rewrite the branch answer to avoid repetition; or replace the final quote with a line already present on the public surface.
- `quotePickCandidates` is a planning ledger for the shipped final choices. It must match `accusationChoices` in order and wording after punctuation normalization. Drift is a planning debt and should fail pack verification.
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
- Buttons should feel like a linear call: "继续", "选一句往下追", and short case-specific questions for the current point.
- Avoid mechanical labels: "阶段判断", "资料核验", "通话回放", "内容提示".
- In daily cases, avoid "接哪边的麦", "让另一方补话", or any copy implying two-sided mediation.
- Case-specific summary buttons should reflect the case: screenshot source, missing edge, evasive wording, timing, party switch.
- Investigation copy should sound like live-room backflow, not task UI. Prefer "后台进来一条私信", "有人补了一张图", "这页刚翻出来", or "对方没上麦，只留了这句". Avoid "new clue unlocked", "verification succeeded", "evidence chain complete", "correct route", or any copy that tells the player the system has found the answer.
- Choice-panel helper notes must pass the rule-clarity test before the read-aloud test. Dressing a rule explanation in stream slang is still a rule explanation — "这段只能定一次。问偏了，弹幕会散。" fails the same way "问偏会掉耐心" does. But hiding the rule behind "随口问问" or "选一句往下追" also fails if the player cannot tell which button advances the scene. Use direct labels for the two economies: 「普通提问 / 不推进剧情，可以多问。」 and 「关键选择 / 会推进剧情，只选一句。」. This is allowed mechanical copy because it prevents a real misclick, not because it helps solve the mystery.

## Clue Insertion Techniques

Clues must be embedded so the player earns the discovery. Never let a character state the lie directly; let it leak through weakness, guard, or accident. Every technique below is fair-play only if the leaked detail is on screen and can be traced back at recap.

Verbal clues (in the caller's retelling or quoted lines):
- Cognitive-dissonance slip: the caller or quoted party says half a truth, then scrambles to re-wrap it. 「我当时只是想，既然他工资卡交给我……啊不是，我的意思是，以后一起过日子，钱合着管比较好……」 The slip must be small, human, and recoverable — one per case at most.
- Euphemism downgrade: vocabulary drops from packaged to raw as pressure rises. Early: 「他在做一个周转」. Under pressure: 「我哪知道那是拆东墙补西墙啊」. Plan the word pair in the story packet so the downgrade lands as a beat, not an accident.
- Pronominal shift: the caller's label for the other party tracks their心理防线: 「我男朋友」 (opening, defended) → 「他」 (doubt) → 「那个人 / 对方」 (cut). Do not force the full chain into every case; even one visible shift late in the call reads loudly. Keep recap wording consistent with wherever the chain ended.
- Agency laundering (春秋笔法): the caller's early lines wash their own initiative out of shared actions through verb choice — 「他带我去的那种店」 when the reservation was on her member account, 「他手机上弄的分期」 when the equipment sits in her room, 「我妈想看流水」 when she forwarded the screenshot herself. This is the catchable form of the unreliable narrator: the bias lives in verbs and attributions from the opening, and a later material, backflow item, or slip exposes the true subject of the sentence. Every case needs at least one laundered verb planted early and one surface that exposes it; a caller whose edit is only confessed at the end was never catchable, and the Rashomon collapses into a diary.

Physical clues (materials on the board):
- Accidental attachment: the material enters the call through a believable slip — 发错表、多选了一张图、转发时带上了上一条. The sender's intended message and the accidental payload should both be nameable.
- Intentional crop: the material is real but cut where cost or responsibility lives — 审批图裁掉付款回执、账单只截上半页、聊天记录从第二句开始. The crop line itself is the clue; the evidence check should let the player mark the missing edge, not the visible content.
- Metadata discrepancy: timestamps, battery/signal bars, weekday vs claimed context, background details that contradict the story. Use sparingly, and only when the discrepancy is markable in the material board (an `evidenceChecks` option), not prose-only trivia.
- Audio tells (听觉线索, voice-call native): the microphone carries clues the caller did not choose to send — typing sounds while claiming to be off work, a second voice in the background, the echo of an emptied apartment, a lighter clicking during a "我早戒了". Fair-play rules: the sound must be authored into the scene (the crowd or host may notice it — 「刚才背景音里是不是有人翻东西」), the crowd may only report what it heard and never interpret it into a verdict, and per the two-source rule an audio tell alone convicts nothing — it needs the caller's acknowledgment or a material to corroborate. On voice calls this is the only clue channel the crowd owns outright; use it to make the room feel like a thousand ears.

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

当事人的“防御闪躲”与推诿话术机制 (Evasion & Deflection Mechanics):
当连线人在核心疑点被 Host 戳中或面对矛盾材料时，决不能立即坦白或爽快承认，必须表现出强烈的心理防御，采用以下三种口语化闪躲话术以制造对话张力：
1.  **打感情/道德牌 (The Emotional Shield)**：用感情深度或无辜动机转移视线。`“我们平时感情一直挺好的，他真不是那种人，可能就是一时想岔了……”` 或 `“我只是怕他走弯路，我有什么错呢？”`。
2.  **责任分担/借口盾牌 (The Excuse Shield)**：将责任转嫁给客观环境或第三方。`“这也是我妈非要问的，我其实无所谓的，我也就是顺口替家里问了一句……”`（案3）或 `“这都是因为公司流程太死板，当时要是不垫，答谢会就砸了……”`（案4）。
3.  **强行转移焦点 (Focus Shifting)**：将对“事实”的追问引向“解决当下急迫问题”。`“现在最低还款日期马上到了是事实，我们不该先想办法把钱转过去吗？纠结他从哪天开始失业有什么意义？”`（案1）。

弹幕舆论的“极化与反转”张力轨迹 (Comment Polarization & Reversal Trajectory):
直播间的弹幕评论不仅是氛围背景，其情感倾向必须随着剧情疑点和转折呈现“极化 → 起疑 → 反转/争吵”的张力曲线：
*   **开场极化期 (Initial Polarization)**：弹幕水友根据来电人的一面之词，迅速站队并情绪化声讨另一方。`“渣男，妥妥的软饭硬吃！”` / `“心疼小姐姐，赶紧分！”`。
*   **中段起疑期 (The Seeds of Doubt)**：随着材料展示或言语纰漏被指出，部分敏锐的水友开始察觉不对，风向出现分化。`“等等，那套一万二的设备不是在她屋里摆着吗？”` / `“这理发师备注里写的‘能投店’是啥意思？”`。
*   **尾声反转/交锋期 (The Revaluation / Clash)**：真相大白或进入开放式结局时，弹幕不再有统一标准答案，而是分裂成两个立场对等的阵营剧烈交锋。`“这女的也太有心机了，白拿了设备还上麦带节奏！”` / `“两边都是千年的狐狸，玩什么聊斋啊”`。
Codex 在编写弹幕配置时，必须根据玩家的路线选择（Route Axis）动态拟真出这种极具网络特征的争论张力。

## De-AI & Anti-Robotic Scripting Guide (避坑指南：识破并消除“非人类/AI式”剧情与台词)

AI 或机械化剧本编写容易引入特定的“非人类思路”模板。Codex 在重构或审查时，必须对照以下三维坐标，彻底消除非人类逻辑缺陷，并向编写者提出针对性建议：

### 1. 剧情与逻辑层面的“非人类思路”
*   **A. 顿悟式信息跃迁 (The Telepathic Leap)**
    *   *机械表现*：仅凭一个孤立微弱的线索（如看到理发店排班表发错），Host 或 Caller 瞬间推理出对方的庞大心机或商业阴谋。
    *   *人类思路*：线索仅引出一个“切实的疑点”（如“备注栏不像剪头”）。必须通过后续对话的拉扯、第二块物证对比、或者是下播私信的证据拼图，最后在 Quote-pick 阶段由玩家自己提炼出最终结论。
*   **B. 极善与极恶的强行对立 (The Cartoon Villain / Perfect Victim Trap)**
    *   *机械表现*：来电人是 100% 被欺骗、被利用的无辜天使；另一方是处心积虑、没有丝毫人性温度的诈骗魔王。
    *   *人类思路*：连线充满灰区（Grey-Zone）。来电人一定隐瞒了自己虚荣、贪小便宜、或者极力逃避自身责任的部分。而另一方也有在自我利益受损时的防御性自我合理化话术（如“我只是太想跟你结婚了”）。
    *   *执行要求*：绝不提供“无瑕受害者”。当 Caller 开始讲出听着十分委屈、可怜的台词时，必须立刻在 `selfServingOmission`、早期动词、材料边角或 deepFollowup 里埋下“因为贪图某种便利 / 好处 / 面子而纵容了事态发展”的伏笔。
*   **C. 判决书/心理学报告式的 Host 选项 (The Clinical Judge Trap)**
    *   *机械表现*：Host 给出充满大词和定性的抽象选项（如 `“他是在进行债务转移”`、`“这属于职场霸凌”`、`“你需要运用法律武器”`）。
    *   *人类思路*：Host 讲的是人话，是直播间老水友的日常交流话术。Host 的追问应该是具体行为的撕开点（如 `“那你当时就没问问他，这笔钱到底花哪去了？”`、`“所以这顿大餐，你当时也吃得挺高兴的对吧？”`）。
*   **D. 平淡无奇的说明文剧情 (The Flat Narrative Trap)**
    *   *机械表现*：剧情线索单一，一眼望底；案件只有平铺直叙的交代，毫无剧场性冲突。
    *   *人类思路（三大硬性剧作标准）*：每个案件在重构和创作时，必须确保具备以下“三大剧情性特征”中的 **至少两项**：
        1.  **引人入胜（信息绝不说全）**：开局隐去核心症结，仅留局部反常，真相如同剥洋葱般，由玩家操作层层剥开至最后一幕。
        2.  **罗生门（Caller自利性隐瞒）**：连线人（Complainant）只挑对自己道德高地或财产有利的信息陈述，极力遮掩和美化自己贪心、虚荣、或违规的真相（必须包含 `selfServingOmission` 并有对应材料击碎）。
        3.  **多头并行（多线线索缠绕咬合）**：线索构成不能单一。必须由“言语纰漏（口头线索） + 材料数据存疑（实物线索） + 下播私信/粉丝群物证（外围反转）”三者交织成网。
        4.  **实物-言语死锁（physical-verbal lock）**：核心矛盾不能只靠 Host 选项里的口头追问破案。材料板上的物理疑点必须和 Caller/Respondent 的一句话互相卡死，并逼出 deep question 里的心理防线松动。

### 2. 文本台词层面的“AI机写味”
*   **A. 平铺直叙的“剧情汇报说明书” (The Info-Dump Paragraph)**
    *   *机械表现*：人物一上麦，一口气说完了“相遇背景、相处半年、约会体面、突然借钱、看到截图、非常懵”的完整前因后果，台词像项目工作总结。
    *   *人类思路*：口语说话是“挤牙膏式”的，需要有语气词、口癖和情绪缓冲（如 `“平时约会消费什么的都挺体面的，我也没觉得有什么问题。结果前几天...”`）。
*   **B. melo-drama 腔调的夸张情感排比 (Melodramatic Parallels)**
    *   *机械表现*：宣泄高频使用 `“我脑子嗡的一声”`、`“这哪是爱我，这是把我当提款机”`。
    *   *人类思路*：普通人在诉苦时，往往会通过对“极其具体的物理数字、日常事件”的描述来表达难受（如 `“他就差把那张最低还款单贴我脸上了，我真的连看都不想看”`）。
*   **C. 机械的因果逻辑词 (Robotic Transitions)**
    *   *机械表现*：句式中充满 `“其实”`、`“并不是...而是...”`、`“真正...的...”`。
    *   *人类思路*：口语更零碎、更偏向感知陈述（如 `“那会儿我脑子有点乱……”`，`“我当时真是……”`），而不是严丝合缝的说明文因果过渡。

### 3. 给 Codex 的审查与重构建议 (Codex Audit Guidelines)
在进行剧本的 De-AI 重构时，Codex 必须强制执行以下工作流：
1.  **角色互换测试 (Role-Swap Test)**：尝试将 Host 选项的问句与 Caller 的答句互换，或者将这起案件套在另外两个不同性格的角色身上。如果没有任何违和感，说明台词缺乏特定人设，过于泛化，必须打磨其口语特征。
2.  **一口气朗读测试 (The Read-Aloud Test)**：所有翻译或重写的 JSON 台词，必须在脑中模拟真人电话朗读。如果一个句子过长、包含复杂的从句、修饰词，必须无条件拆分为 2-3 个碎片句。
3.  **利益归属审查 (Stake Alignment Review)**：每一句台词，Codex 都必须回答一个问题：*“咨询者说出这句话，是在极力粉饰他自己的什么诉求？或者保护他什么面子？”* 如果一句话仅仅是为了给玩家交代背景事实而存在，那就是“非人类思路的说明书”，必须废除或融合。

## Diegetic Comment Hints

Comments are crowd noise first, hints second. They must never sound like a tutorial, name a clickable region before the player's first attempt, or use system voice ("快去点击社保截图" is banned).

Default layer (always allowed): atmosphere and route-axis reactions via `routeAxisComments` — the crowd reacting to the player's questioning style, arguing among themselves, confidently wrong. 「弹幕开始算账了」, 「钱路比委屈快」.

Pity layer (gated): a sideways, in-character nudge that points at the neighborhood of the gap without naming the answer. It may fire only when:
- the player has already made a wrong material pick on this board, or
- patience is in the low band and the case is stalling.

Pity-layer register — a sharp viewer thinking out loud, not an oracle: 「审批过了就完了？我们公司过审和打款差着仨签字呢」 (after a miss on the approval screenshot). Compare the banned direct version: 「去圈付款回执那一栏」.

Cross-case callbacks: in a story pack, later-case comments may echo only cases the player has already finished — 「这跟刚才那单一个味,先给身份后要钱」 — to make the pack thread felt during play. Hard spoiler boundary: a comment for the current case must never mention, foreshadow, title, object-label, or quote any case that appears later in the pack sequence. If the engine cannot prove a prior case is completed in state, use a case-local comment instead.

Sensor bandwidth (感知带宽 — the crowd is a microphone, not a camera):
- The room's knowledge is bounded by the stream medium. Anonymous hotline calls are **voice-only** (`callMedium: "voice"`, the default): the crowd hears voice, tone, pauses, and background sound — it cannot see the caller's room, face, hands, or equipment. A comment like 「她背后那个环形灯不便宜啊」 is an epistemic violation on a voice call; on a declared `"video"` call it becomes legal, but only for what a webcam frame would plausibly show.
- The caller portrait and expression beats (「指尖停在屏幕上」「连眨了两下」) are **player-facing visualization, not the room's camera feed**. Comments must never reference visual tells unless the case declares video.
- What the crowd CAN know: the call audio, whatever the host has already put on stream (a material becomes crowd-visible only after its board/card shows), their own life experience and trade knowledge (the pity layer), and the host's public history. What it can NEVER know: off-stream facts, unshown materials, the parties' identities (the show anonymizes; no doxxing plots), and anything later in the pack.
- Write the bandwidth into the truth ledger: when planning comments, list what the microphone has actually carried so far. A comment that knows too much is the crowd version of a host question that assumes an unheard fact.
Portrait art is canonically the host's mind's-eye rendering of a voice — the V2 semi-silhouette direction (docs/art-direction-v2-prompts.md) is this rule made visible; art acceptance includes the anonymity check.

## Advisor NPCs and Off-Mic Surfaces

Design reference: `docs/advisor-npc-and-offmic-design.md`. Four fixed advisors (赵律师/周会计/小林老师/张法医), recurring across cases with stable domains and voice fingerprints.

The effect/detection iron line:
- Advisors judge **effect**, never **detection**: they say what counts, what does not count, and what class of thing one generally needs to look at — 「口说的不算，落纸的算数」「审批、付款、到账，是三张纸」. They never say where to mark: 「圈」「那一栏」「哪一块」 and any spot-naming phrasing are banned in advisor copy.
- Advisor knowledge in their own domain is reliable (their law/procedure statements are true); what stays arguable is applicability. Exception by design: 小林老师 is deliberately grey — she exposes matchmaking tricks while defending the trade, so her advice carries a visible professional tilt the player learns to discount. Her tilt is 护行不护人, never dishonesty about facts.
- Advisors interpret materials; they never testify about this case's parties beyond what authored materials show. Advisor-unlocked materials are authored JSON that passes `truthBoundary` and the promise ledger like any other evidence.
- Delivery surfaces, in cost order: post-recap backflow persona (`investigationHooks[].source: "advisor"` + `advisorId`), miss-gated pity layer in persona voice, act-break consult retold by the caller, and — only as a designed scarce resource — a once-per-case guest mic. Advisors never replace the host's questioning and never speak inside scene beats.
- Act-break consults come back through the caller's mouth, and her retelling may itself be edited (she quotes the half of the advice that helps her) — advisor input passes through the Rashomon filter like everything else.

The absent party's half mouth (对方后台留言):
- The other party still never joins the live room. Post-recap, they may leave exactly one one-way message (text or voice note, `source: "respondent-note"`), not questionable, not answerable.
- The note must carry its own catchable edit: their version trims different places than the caller's version, and the gap between the two edits is playable Rashomon. A note that merely denies or merely apologizes is wasted surface.
- At most one per case (complex family packs may allow a second from a third party).

Evidence delegation (证据委托 — the scene-switch turn):
- The loop: the caller deposits an artifact backstage (照片、报告、账单页), the player chooses **which advisor** to send it to, and the advisor's reply comes back as a new authored fact before the final quote-pick — early enough to change the judgment, or it is scenery.
- Choosing the advisor IS the deduction: matching the material to the right domain is the trick taxonomy made playable. The strong lead exists only for the right pairing; mismatched pairings return an honest, in-character partial read (「图我看不出花头，链条上这类截图造假成本高，大概率是真的」) — never nothing, never mockery, never the strong lead leaked.
- One delegation per case. The choice logs a route axis (周会计=money-flow, 赵律师=process/responsibility, 小林老师=identity-wording, 张法医=document-edge) — who you trust to look is who you are.
- The reply is a **new authored fact** (a report), not a hint: it must never point at an existing board's correct option (no detection-by-proxy). It is usually one of the six operations executed by a professional — 周会计 on repayment rows performs the 主语核对 (「工资入账有代发抬头，这笔是私人打的」).
- Reports prefer the open closure type: they sharpen the unknown's shape without naming anyone (「私人转账」 makes 8 号那笔的刀刃更利，仍不指认付款人). A confirming report counts against the pack's confirmation quota.
- All delegation outcomes are authored JSON passing `truthBoundary` and the promise ledger; the caller's deposit line and the report's return are both promise-ledger entries.

Character bible:
- Before writing or revising any spoken line, load `content/characters/cast.json` and resolve the speaker by **case id plus surface name**. Generic runtime actor ids such as `shen` or `chen` are casting slots and may represent different people in different cases; they are never a cross-case identity source.
- Every recurring caller and advisor gets a fixed card in `content/characters/cast.json`: desire, fear, defense, core personality, pressure response, voice rhythm, vocabulary, habits, avoid-list, and knowledge boundary. `content/characters/voice-bible.md` is the human-readable review view. All `casualQuestions`, scene dialogue, off-mic lines, advisor copy, helper hints, messages, and callback lines must resolve to one card. Daily-rotation reuse of the same character must not contradict it.
- Host, callers, and primary respondents must also define `voiceArc.nightA / day / nightB / ending`. When revising a load-bearing line, check its phase and preserve how far that phase allows the character's defense to loosen.
- Cross-act change must be audible in sentence length, subject choice, form of address, or target of evasion. A new catchphrase is not an arc, and an arc never grants facts outside the character's knowledge boundary.
- Before drafting an NPC line, write three private notes: surface fact, protected stake, and current tactic. The spoken line should perform the tactic; do not paste the three notes into expository dialogue.
- Every player-visible voice must resolve structurally. Use `speaker` for direct beats and `speakerProfileId` for an authored DM, note, or relayed NPC material. Use `voiceAttribution: document` only when the artifact itself is the source and no new NPC is speaking. A generic `source: dm` is not voice attribution.
- Personality changes expression, never fact access. An impatient witness may interrupt and a sensitive caller may over-explain, but neither may cross `knowledgeBoundary`, `truthBoundary`, or the sensor contract. Do not use a personality label to justify omniscience.
- Pressure must be audible. At each character's load-bearing pressure point, apply the registered `stressResponse` through sentence length, subject choice, evasion, or vocabulary. Repeating a catchphrase without the registered defense action does not count as characterization.
- Run the role-swap test: hide names and swap a line with another speaker in the same case. If it still reads naturally without changing syntax or defense, rewrite it. At least one of rhythm, action, or omission must identify the speaker; do not merely paste a catchphrase onto generic exposition.
- Every named off-mic voice (friend, cousin, store manager, team lead, introducer, the other woman) gets a three-line stance card before it speaks: 立场 (what it wants the room to believe), 遮掩 (what it hides or softens), 利益 (what it gains from its version). A voice that exists only to confirm the mainline is a prop — cut it or arm it. Two victims who want different things (说法 vs 止损) are drama; two witnesses who agree are furniture. Stance cards feed the sensor contract audit: what the voice knows must fit its life, and what it says must serve its stake.
- After editing dialogue, run `npm run content:dialogue-report`. Review one character vertically across phases and then one scene horizontally across speakers. The generated rhythm warnings are reading prompts, not automatic rewrite orders; the forbidden-template and attribution failures are hard errors.

The host is a person (design: `docs/host-character-design.md`):
- Fixed past, player-expressed present: the host's wounds, loves, and hates are canon (bible card); his present tendencies are whatever the player's route choices make them. Never write host lines that pre-decide the player's route.
- 心热、嘴稳、手上使计: the host has open loves and hates — he wants to help the wronged and it shows. But his wound (he once helped a live room convict the wrong man on an edited bill) gates the timing: feeling fires early, verdict fires only after facts lock. His 爱憎 is allowed to aim at the wrong target early — that is `hostWoundHook`, misdirection sourced from the player's own chair — and the case must correct him along with the player.
- Signature syntax: the host thinks in 「X 归 X，Y 是 Y」 — it already runs through every shipped recap. New host copy prefers this mold; it separates, it does not sentence.
- Self-disclosure budget: at most one host self-disclosure per case, at that case's resonance point, feelings and history only, never conclusions — the perception-not-conclusion iron rule applies to the host's own mouth and inner voice.
- 奇正相生 (stratagem beats): the host helps the caller obtain evidence through small, legal stratagems — 正 is asking straight, 奇 is the clever route: prompting the caller to make an innocent request whose refusal pattern is itself evidence, a designed callback that stays silent on X to see if the other party volunteers it, an advisor-routed request that an honest counterparty could satisfy in one screenshot. Iron rules for stratagems: 阳谋不阴谋 — a stratagem is a touchstone, not a trap: it only reveals what is already true, an innocent party passes it harmlessly, and it never entraps anyone into new wrongdoing, never impersonates authority, never crosses recording/privacy law. The reaction it fishes back is authored material passing `truthBoundary` and the promise ledger like all evidence.
- Hard limits: host bias touches tone, self-disclosure, and stratagem flavor — never materials, boundaries, or scoring; wound details are never fully told; the host never personally knows this case's parties (same script as his past, never the same people); one host-history comment from the crowd per case at most. The protagonist of a case is the caller; a host who overshares is stealing the mic.
- The family web is canon: 赵律师 is the host's partner (the far end of the wrongful-verdict episode — she was that man's lawyer), 张法医 is his oldest friend (哥们归哥们，发票归发票), 周会计 is 张's partner and the keeper of the one dinner table where the show is never discussed; 小林老师 stays outside the web by design. Host gender stays unspecified — write 对象/另一半, never gendered terms for the host.
- Domestic register enters only openers and closing half-lines; the professional core of any advice stays word-for-word professional. At most one family/couple beat per case. Relationships never bend facts or verdicts — 赵's disclaimers got stricter, not softer, when she became family.
- The room half-knows: regulars dare to type "赵姐" and never dare to ask; on-air copy never explains why she always answers. The apology-turned-dinner origin is bible-only.

## 人味法条

### 总原则

1. 两条轴并行:**语言噪声**(人怎么说话)与**行为非理性**(人怎么做事)。前者治句子,后者治剧情。
2. 所有笑点的判据:**让人笑完叹气**(sad-funny)。不写段子,不写卡通;每个无厘头必须有现实锚——现实中真实存在的产品、行为、话术(满减券/表情包/群红包/砍一刀),不许发明现实里没有的滑稽。
3. 喜剧禁区:深问、结案、挂断拍、对手反制拍保持严肃。噪声与非理性加在自由追问、弹幕、开场收场、回流、顾问段、幕间。
4. 承重结构不动:事实边界、收窄阶梯、反转交付、四翻轴全部保持;非理性是表面摩擦,不是新事实。

### 第一轴:行为非理性律(剧情层,新立法)

#### 1. 比例失真律

每案至少 1 处:人物在大事上平静,在小事上炸毛。**炸毛的点=人物真相的侧写**(她不问五万,先问那家店带没带过别人——自尊线比钱的线粗)。错位方向必须与人物欲望一致,不许随机。

#### 2. 迁怒律

每案至少 1 次:情绪打在不该打的人身上(主播/闺蜜/介绍人/她妈),且**当拍不道歉**——道歉要么迟到半场,要么永远不来。被迁怒者的反应也要真实:憋屈、回嘴、或假装没听见。

#### 3. 廉价补救律(对方的 low 操作)

每案对方 1 次成本极低的"补救",廉价度即人物:优惠券当道歉、表情包接催款、群红包平事。这是对方在夜 B 之外唯一的加戏配额,走合法传感器(来电人转读)。

#### 4. 弹幕跑偏配额

每案 ≥3 条与案情无关的直播间原生弹幕:蹲链接、修灯、课代表、刚下夜班求前情。复用现有弹幕压力系统——跑偏弹幕就是"带散"信号的血肉,不再只用案情弹幕。

#### 5. 顾问退场摩擦

每案 1 次顾问以不专业的方式退场或打断:外卖到了先挂、孩子哭了、看球分心。专业内容照常给,退场方式是人。家人网既有口径不变(家常只落在开场收场,情侣拍每案 ≤1)。

#### 6. 主播狼狈配额

每晚(整包)≥2 次主播的小事故：念错日期后自己看回材料并改口、把广告弹幕当提问念出来、打翻水。主播的权威从“不会错”改为“错了就当场认”。当前节目是个人直播，不得用导播、耳返或控制室工作人员替他纠错。

#### 7. 情商地板律

每案 ≥1 句身边人的"安慰"实为二次伤害(「至少你没领证」「过了年你就 29 了」),且说话人是**好意的**——低情商不是恶意,是笨拙的爱。被安慰者的反应写"我知道她是好意"这一层。

#### 8. 无理取闹的应对选择(玩法接口)

来电人炸毛拍后,给玩家一个小选择:**哄 / 顶 / 不接话**。不判对错,进立场与路线口气。这是"情绪劳动"第一次成为玩法动词。

### 第二轴:语言噪声律(台词层,新立法)

每案硬指标(可脚本统计,进 verify-logic 纹理检查):

1. **长度方差**:≥3 句五字以内的答句(「嗯。」「没有。」「你说。」);≥2 段 120 字以上收不住的车轱辘话(絮叨里埋信息)。
2. **抢话**:≥2 次台词中断——一方说到半句被掐断,渲染层支持断句符(——)。
3. **不承重句**:≥3 句纯生活噪声(信号不好/喝口水/那边救护车过去了/咳嗽)。
4. **口误自纠**:≥1 人把事实说错再自己改口(「六月……不对,五月底」)。改口本身可以是线索肌理。
5. **语气词专属**:每个主要角色分配专属口头禅/语气词(她:「就是说」;何:「反正」;陈:「呃」;林:精确到不用语气词——零语气词也是指纹),互不串用。
6. **起步失败**:每案 ≥2 处话头起两次才起来(「他那个……就是他上个月,呃,不对,我从头说」)。

- **书面纹理律**:弹幕、私信、群聊、备注属"打字面",用半角标点、允许口语化打字风;台词与旁白属"说话面",维持全角。案 1 driftComments 的半角标点是正确示范,禁止"修复"为全角。
- **负指纹条款**:`voiceTics` 支持零语气词指纹——角色声明空口癖表时,校验断言其台词不出现任何通用语气词;可另声明 `oneTimeTic`(全案唯一一次的语气词),该词只许出现一次,落点即人物破防拍。
- **支线收束律**:炸毛应对选择的每条支线 ≤3 行收束回主线,不产生新事实;只记立场与路线口气,不判对错。
- **噪声弧线律**:不流畅必须有分布设计并随 `voiceTics` 注明弧线(例:沈=夜 A 密、夜 B 干净;陈=全程密、最后一句干净)。均匀撒噪声视同未做。
- **补救物即人物律**:廉价补救必须出自对方的职业或人格域——补救物是人物测验(理发师=券,材料型相亲对象=新开的存款证明,老油条同事=群红包)。
- **自纠方向条款**:口误自纠的方向也是指纹——沈:说错改对;林(审计):模糊改精确(「百分之三十几……不对,三十七」)。
- **呼吸差异律**:省略号/停顿(……)不是全员通用的呼吸方式——配额机械执行后最容易长出的新齐整感,就是每个角色都在用同一个符号换气。每案至少安排一位角色几乎不停顿、语速直给(常见于职业角色:财务经办/仓库管理员/前台/顾问),用密不透风的短句或专业术语的连续性反衬其他角色的停顿;停顿本身也要分快慢——惊慌的停顿短而破碎,盘算的停顿长而完整,不能所有停顿都是同一个长度、同一种情绪。
- **生活噪声不得伪装伏笔**：只有“掠过且无人追问”的救护车、咳嗽、喝水等能计入不承重配额。声音靠近后停住、紧接敲门并导致人物换地点或中断行动时，必须撤掉 `nonLoadBearing`，登记偶发细节闭环并回收。
- **职业因果律**：非固定坐班、夜场、零工或其他容易被污名化的职业，正文只写角色具体做什么、怎么结算、身体或外形要付出什么成本。禁止由主播或旁白贴“不正经”标签。职业至少推动两项可见行动，例如必须约晚档、频繁补染、提成到账后消费；所谓“情绪价值”至少落成一句原话或一次动作，例如替她挡住职业玩笑，不能只写进人物小传。
- **真实照顾不得倒销**：后续发现销售动机或私表，不得把先前真实发生的维护和尊重全部改判为假。结案应同时保留照顾确实发生、照顾后来被接入消费推进这两层事实。

### 主题松绑(两轴共用)

- 评论种子与路线评论里**直接陈述中心思想**的句子删一半,换成歪的、偏的、跑题的真实观众反应。
- 每案保留 1-2 拍与主题无关的真实生活(她提了一嘴换季咳嗽,没人接,话题过去了)。

## 对抗性法条

- **金句配额律**:主播每案格言句 ≤3,只许落在深问、结案与金句拍;其余追问用工作语言(短问、实指、可重复)。判定法:一句话删掉案件名词后仍像格言,即计入配额。
- **潜台词律**:来电人不得当场剖析自己的心理防御机制;自我洞察由行为、拒答或他人说破交付。每案"完美自知句"≤2,且只许出现在深问之后。
- **答非所问配额**:每案至少 3 处来电人的回答是答非所问、反问或沉默;沉默用舞台指示承接,不许用台词填平。
- **抵抗拍配额**:每案至少 1 拍来电人把矛头指向主播或节目本身;主播接话不得用格言,允许接不住(接不住要记账,后拍归还)。
- **对手在场律**:对方不上麦铁律不变;但每案至少 1 次对方的实时反制经合法传感器进入(来电人转读、后台函件、第三方转话),且发生在夜 B 进行中,不许全部堆到收麦后。
- **反转交付律**:反转不得由来电人自白首发;首发权属于玩家动作(圈行、带回物、排序、回放)。自白只作为玩家触发后的重述。同一故事包内四案反转型不得重复(钱路/规模/方向/权力)。
- **押注归还律**:中段立场快照必须在夜 B 被回应——每个选项配一句回应拍,或打脸或加固;只记不用视同未接话头。

## Multi-Scene and Offline Rashomon (多元场景)

Design source: `docs/multi-scene-rashomon-design.md`. The show is titled for the livestream, but plot-driving stages must diversify.

- Write daytime locations as scenes with casts and beats, not as one-sentence souvenirs. A visit that only returns a label for the callback opener is underwritten.
- DayScene kinds beyond `visit`/`studio`/`document`: `observe` (same room, different table — watch, do not intervene), `sitIn` (licensed eavesdrop co-presence — host silent by caller request), `doorstep` (refusal at the threshold).
- At most one face-to-face privilege with the other party per pack; other cases use mediated Rashomon. The host does not interrogate the other party on the player's behalf during sitIn — notes feed the night-B callback.
- Every day location still obeys bring-back law: `earnedItemId` must unlock a distinct `callbackOpeners` line the player could not have gotten from the console alone.
- Keep the interlude short and the city day long: when both surfaces exist, spend interlude budget on one or two console-scale actions and put walking, observing, doorstep refusals, and document visits in `dayScenes`.
- With `overnightStructure`, write night-B openings only in `overnightStructure.callbackOpeners`. Any interlude result intended to change that opening must be copied into `earnedItems` by the same id or an explicit inventory map; never leave a player-facing "carried" item outside the opener pool.
- Every night-B `callbackOpeners` entry must carry either `firstConflict.hostLine + callerLine` or an alternating `firstConflict.lines` sequence containing both roles. Use `lines` when a material needs several short questions; each host turn still asks one thing. The earned item changes the first confrontation, not only the greeting: two different carried items may not collapse into the same host question with nouns swapped.
- Do not write parallel hangup or opener prose for `nightStructure` and `overnightStructure`. Align the hangup seam and maintain one callback-opening source of truth.
- When the interlude continues into a daytime map, `continueLabel` must say that the player is entering daytime investigation, never imply an immediate callback. Keep the duplicated hangup seam byte-for-byte aligned: `nightStructure.hangup.stageDirection === overnightStructure.hangupLine` and `nightStructure.hangup.hostLine === overnightStructure.hostHoldLine`.
- Give at least one off-console scene per case a consequential `choice`: different branches grant different information state, route state, or `grantsEarnedItemId`; cosmetic branch labels do not satisfy the scene.
- Before shipping, audit NPC ownership and document wiring: one load-bearing NPC beat lives in one scene only, and every callback-changing document grants an earned item with a matching opener.

## 温情与尾巴法条

- **互惠律**:每包主角至少被照顾 2 次,其中 1 次来自声纹最意想不到的表面;关怀须有物件载体(汤/水/便签),物件要走完整弧线(留下→在场→收尾,≥3 拍)。只给不收的关系网视同道具,不算关系。
- **回访律**:结案不等于人物结束。尾声必须让每案传回一条非案件信息(未读),内容只许生活与关系,不许携带新事实、新证据、新指认。
- **关怀动词律**:玩家每案至少一个非侦探动词(最后一句三选),不判分,但必须有回声——未读措辞随选择变化。没有回声的关怀选项视同装饰,不许写。
- **破例即温情条款**:声纹破例是最强温情载体,每包 ≤1 次,破例者须是全包声纹最窄的角色;破例后立刻回归原声纹。
- **活性尾巴律**:钩子=再来动因+信物+兑现形态,三件齐才算;只进未决清单的不算钩子。每包 ≥3 根活性尾巴 + 1 根主线尾巴（文件袋级）。尾巴只约定形态(专场/再谈/再打),不约定未设计的答案;不许为悬念透支未来案件的真相。

## 结构性冲击与个人选择

- 信托兑付、房屋停工、保健品机构卷款等公共事件可以串联多案，但先在个案里留下可见种子，再由职业见闻加固，最后才用新闻或公告回收。不得让新闻按作者日程自动到场；玩家至少执行一次“听 / 看 / 读”的动作。
- 机构的违法、误导或违约责任，与当事人的借款、加杠杆和追求超额收益必须分开写。人物的贪念不用主播贴“贪婪”标签，而用他实际借了多少、期待多少收益、拒绝一般回报的原话和押注动作让玩家自己判断。
- 禁止写成“因为他贪，所以被骗活该”。合格结案要同时保留两句意思：借钱追高收益是他的决定；机构若误导或违约，责任仍归机构。后来的公开危机不能把旧案每一笔损失自动坐实，也不能替他的借款决定免责。
- 同一个公共事件进入不同案件时，只能充当共同压力源，不能复制同一条因果链。烂尾房要有购房合同、交付节点和家庭决定；保健品卷款要有付款、承诺、老人现金缺口与婚事冲突；缺少各自材料链时只登记未来承诺，不写进现有正文。
- 跨案伏笔也要逐句过小逻辑合同。每条种子流水都要有本行追问，登记 `sourceRows / sourceProves / sourceDoesNotProve / answerAnchor / answerAdds / nextLegalQuestion`；跨行问题必须先说清“相邻不等于同一笔”，再允许人物补充自己亲耳听过的原话。
- 同一机构第二次进入别案时，必须产生不同的本地冲突，并登记为 `secondarySeed` 或等价账目。它可以让旧线变重，不能抢走当前案件的主物件；案尾公开冲击要同时写明它对每个旧案“重新说明了什么”和“仍不能证明什么”。
- 带回物只重开一个时间块。若玩家带回三月借款与信托认购，第二夜就按“借款有没有提过 -> 两笔认购什么时候看到 -> 机构和收益期待是否听过”分成短问答；不得顺便在同一句重念五月、六月、七月和其他账户。

## Theatrical License (戏剧性特许)

This is a game, and a night of theater beats a panel discussion. Realism discipline (fair play, sensor contracts, value baseline) governs FACTS; it does not require every voice to be reasonable or every event to be probable. Budget the improbable deliberately:

- **One theatrical license per case**: one moment slightly too staged for reality — the wrong attachment, the deleted comment, the word collision, the accused sitting silently in the viewer list. The license buys improbability, never unfairness: the moment must still pass truth ledger, sensor contract, and promise ledger. Its in-world justification is the show's mythology: 深夜热线专收这种夜晚.
- **One unreasonable voice per case**: among the off-mic voices, at least one wants something too much — the co-victim who wants a crusade when the caller wants closure, the manager who defends too loudly. Measured voices establish facts; the immoderate one creates scenes. If every voice in a case is fair, arm one.
- **The show is a character**: the hotline carries light urban-legend gravity — the room that hears everything, advisors who answer at 2 a.m., a host whose old wound the regulars all know. Mythology lives in flavor and interludes, never in evidence.
- **Experts may collide**: two advisors reading the same fact through different frames (法律说是赠与，会计说是路径) is licensed courtroom theater — it dramatizes ambiguity instead of resolving it, so it protects openness rather than spending it.
- License audit: if a case's most memorable beat could appear unchanged in a documentary, the case is under-licensed; if its facts could not survive a skeptical replay, it is over-licensed. Aim between.

## Structure Archetypes

For case and pack skeletons drawn from classic detective fiction — false solutions, missing edges, distributed responsibility, weaponized narration — use [detective-patterns.md](../detective-plot-coupling-review/references/detective-patterns.md). It includes the Rashomon multi-version self-edit and the Gone Girl-style "caller weaponizes the live room" patterns alongside the canon table. Use archetypes when designing new cases and packs; do not retrofit shipped demo cases onto a template.

## Validation

After content edits:

```bash
npm run check
npm run verify:pack -- <pack-id>
npm run test:narrative
```

Run `npm run smoke:browser` if the change touches flow, options, materials, or recap structure. Then hand off to `livestream-game-flow-review` for a played-through review — content is not done when the JSON validates; it is done when the call plays well.
