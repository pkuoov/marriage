---
name: case-scriptwriting
description: Use when writing, restructuring, or reviewing 《深夜热线：直播间侦探》 case content. Resolve mainline causality and conflict first, then fair player discovery, evidence boundaries, character-specific emotional dialogue, and only then optional livestream atmosphere such as comments, winks, recurring IDs, jokes, and life noise.
---

# Case Scriptwriting

Use this skill for any case creation or dialogue change larger than typo polish. It is the writing-side companion to two review skills:

- [detective-plot-coupling-review](../detective-plot-coupling-review/SKILL.md) checks whether the mystery structure works: case ledger, false solutions, missing edges, coupling, fair play, story-pack threads. Run its ledger before writing and its checks after writing.
- [livestream-game-flow-review](../livestream-game-flow-review/SKILL.md) checks the played flow: playtest loop, UI regressions, continuity checklist. Run it after content lands.

Authority order when rules conflict:

1. Facts, safety, runtime reachability, and value boundaries: `truthBoundary`, evidence-source contracts, save/runtime contracts, `scripts/verify-logic.js`, and [game-philosophy.md](../../docs/game-philosophy.md).
2. Mainline causality and conflict: what the caller wants, what blocks it, what each person did, why the situation changes now, and what the player earns.
3. [dialogue-continuity-audit.md](../../docs/dialogue-continuity-audit.md), character voice, and emotional delivery.
4. Atmosphere techniques: comments, jokes, winks, recurring IDs, life noise, rituals, and other flavor.

Mechanical tests are executable copies of these priorities, not a fifth creative authority. When a test only preserves an obsolete P3 quota or an exact sentence with no wording lock, update the test instead of bending the mainline around it.

## Decision Priority（冲突时从上到下裁决）

| Priority | Must answer | Shipping standard |
| --- | --- | --- |
| **P0 主线与矛盾** | 谁来求什么；谁做了什么；哪项利益冲突；A 版本怎样被 A′ 整体改写；什么事实把它推到 B；今晚能做什么 | 删掉弹幕、笑话、演出和顾问后，因果仍完整，冲突仍尖；A 与 A′ 都能各自连成同一事件的一套完整说法，没看过案的人能说清双方争的是什么 |
| **P1 玩家发现与证据公平** | 玩家凭什么怀疑；用什么动作验证；选择怎样改变局面；哪些结论仍不能下 | 承重事实先有来源，再有玩家动作，后有反应；错选可玩但不泄题；结论不越过证据 |
| **P2 人物与情绪交付** | 这个人此刻想保什么；被碰到哪里；为什么这样说；主播为什么生气或保护 | 台词具体、接话、带人物利益。允许愤怒、讽刺、难听和失控；尖锐必须指向已见行为、原话和责任，不得靠人格羞辱代替证据 |
| **P3 氛围与纹理** | 此处是否真的需要弹幕、眨眼、固定 ID、跑题、玩笑、生活声或仪式 | 全部可选。只有能加压、显人、换气或留下回声时才保留；不得为了配额打断 P0-P2 |

裁决例：一句评论很好笑，却提前说破矛盾，删评论；一段温情让判词撤回已经证明的责任，删温情；一处强烈责问准确抓住人物刚做过的事，即使不“温和”，可以保留；一个案件没有眨眼台词或固定反派，但主线、发现和情绪都成立，视为完整。

### P0 主线最小合同

写任何场景前，先用口语写出五句作者答案：

1. 来电人今晚要林旭阳替 TA 做什么？
2. TA 公开版本里最有利于自己的那一截是什么？
3. 另一方和第三压力分别在争什么现实利益？没有第三压力就不硬加。
4. 玩家哪一次动作会改变对责任、对象、性质或时间线的理解？
5. 结案后，已成立的判断、眼前动作和唯一重要未知分别是什么？

五句答不清，先修故事，不写弹幕、不补口癖、不加场面。P3 不能救一条没有因果主语的主线。

Examples in this skill are technique demonstrations, not content patches. Any new fact they imply — a timestamp, an amount, a new material, a new third party — must pass the case `truthBoundary`, the coupling-review ledger, and the pack `qa-report.md` before it enters a shipped case.

## 第一台词法条：先像人在说话（所有说话面第一门禁）

所有玩家可见台词先过这一条，再检查金句、信息量、证据边界和戏剧功能。作者的事实链必须严密，人物的当场表达不必像证明合同一样严丝合缝。人物可以少说一截、答得不完整、暂时想不明白、把情绪当回答，甚至留下轻微矛盾；这些都是人话。**语言的逻辑必须连贯**：听众始终要听得出这句在回答、接续、反驳、纠正，还是故意躲开紧邻上一句。

执行规则：

1. **允许事实逻辑暂时不闭环**：来电人可以只认一半、说不清动机、先护住结果，或用一个并不充分的理由安慰自己。不要把每一句都润色成完整论证，也不要强迫人物当场解释自己所有前后矛盾。作者在 `truthBoundary` 和因果账本里知道完整答案即可。
2. **不允许话轮无承接**：上一句刚问金额，下一句可以报金额、拒绝报、嫌主播只盯钱，不能突然总结关系本质；上一句刚出现一张表，下一句只能先说谁发的、看见了什么或为什么不肯往下说，不能直接跳到幕后目的。
3. **一次只跨一个台阶**：人物先说眼前动作或原话，主播再问由它产生的最近缺口。新答案成为下一问的前提。需要跨主语、时间、因果或责任时，补一个真实话轮或材料动作，不用“所以／说到底／这说明”把中间过程吞掉。
4. **普通话轮不随时总结**：人物和主播不在每个材料、改口或情绪拍后归纳“这件事说明了什么”“现在可以确定什么”“问题已经变成什么”。总结只在确有现实用途的时刻出现：主播需要把一个问题压回去、收麦前约定下一步、第二天逐项整理证据，或正式结案。即使到了这些位置，也只总结当前要用的一项，不朗读全案清单。
5. **允许明显的躲，不允许看不见的跳**：答非所问若能让听众听见人物在保护钱、脸面、关系或安全，就是连贯的防御；一句台词如果既不接上一问，也没有让人物的躲闪可闻，只是作者想进入下一场，就是跳跃，必须补接话或重排。
6. **先串读，再润色**：任何台词改动都要连读前两轮和后两轮。单句很口语，但换到这里回答不了上一句，仍判失败；局部不严密，却能听出人物为什么这样接，允许保留。

### 口语不是电报，也不是口头报告

去掉作者总结，不等于把句子削成标签。真人说话会把对象说出来，也常会带一个自然的态度尾巴。`这个背书我不做` 像写在判词卡上的结论；`我不会做这种背书的` 才像林旭阳在回应眼前这个人。`这期对账，不给话术`、`八万不转，余额也得说` 同样属于功能正确、说话感不足：它们省掉了“你要我做什么”“谁该把什么说给谁听”，只剩作者替这一拍命名。

反过来，人话也不是把作者的整条推导链塞进一句。一个话轮同时重报前提、解释动机、作判断、给行动、补未知，哪怕每个词都口语，听起来仍像口头报告。修改时按下面的顺序处理：

1. **先找这句正在回谁**：写清说话人正在拒绝哪件事、反驳哪句话、接住哪个情绪，或准备做哪个动作。回应对象不明确时，不准只靠“这个／这句／先记／先留”糊过去。
2. **再补必要的人称和对象**：`不介绍` 改成 `我不会替你介绍`，`余额也得说` 改成 `她账户还剩多少，也得由她自己跟男友说清楚`。已经清楚的主语可以省，可能混淆的主语必须说出来。
3. **允许自然落尾**：`的／了／吧／呢`、`我不会……的`、`你得……才行` 可以让拒绝、提醒和犹豫落到人物态度上。语气尾巴按角色和压力使用，不为每句统一加粒子；高压峰值确实会突然变短，也不能把整场都写成峰值。
4. **一次只完成一个主要意思**：拒绝以后可以紧接一句理由，但不要在同一口气里继续列证据、行动和三个未知。需要都说时，拆成相邻话轮；证据整理阶段则一项一项拿起，处理完再拿下一项。
5. **删掉“为了表达而表达”**：若一句只是把观众已经听懂的内容重新命名为“问题／核心／版本／风险”，删掉。若删后下一句缺前提，补一个人物会真的说的动作或追问，不补作者总结。

朗读门禁：遮住字段名，只听这一句和前后各一句。听众应知道“谁在对谁说什么”，但不该觉得角色在宣读这一拍的写作功能。短句若只能做按钮标题，补回回应感；长句若能拆出两个以上独立判断，拆开让对方有机会接话。

坏：

> 来电人：他每个月都给我钱。
>
> 主播：所以你已经把他的支持当成长期收入，也想让直播间替你免掉解释。

主播一步跳完了稳定性、人物动机和来电用途。

可用：

> 来电人：他每个月都给。
>
> 主播：给了多久？
>
> 来电人：十四个月。中间没断过。
>
> 主播：七月断了以后，你先问的是什么？

人物仍可能给出不充分的解释，但每一问都从上一答长出来，结论留给后面的玩家动作。

## P2 Language Rules (De-AI without De-Emotion)

The goal is not "polite" speech. It is a caller who sounds like a real person under pressure, anchored to specific objects, actions, and numbers. Emotional language is welcome when the event has earned it. Do not flatten anger into neutral audit copy merely to sound responsible.

Two targets must hold at the same time, and they fail differently:
- 口语化: the line sounds spoken, not composed. This lives in syntax and rhythm, not in exclamation. 说媒/律师连麦的口播模版见 `matchmaker-speech` 与 `lawyer-speech` 的 `references/oral-broadcast.md`；那两份管像不像口播，本表仍管像不像这个人。
- 语意连贯: every line hooks the previous one. A line can be perfectly colloquial and still answer nothing; a line can connect logically and still sound like an essay. Write for both, audit for both.

力度边界：
- 可以说「你这句就是在拿他替你背书」「七月一断你就追着问，你不是只是收着」；这是对已见行为和原话的判断。
- 可以让来电人迁怒、嘴硬、反问，或让主播一时火大。人物有情绪不等于作者赞成 TA。
- 禁止把性别、职业、出身、年龄、外貌、创伤、贫穷或求助时的脆弱当笑点和惩罚；禁止用羞辱绰号、性化辱骂或号召弹幕围攻来代替追问。
- “是否过度冒犯”按对象、证据和比例判断，不按语气强弱判断。证据越窄，评价越窄；人物已经承认的具体行为，可以直说。

真人口语门禁（禁会议纪要腔）:
- 审查所有玩家可见的说话面时，先问：这个具体人物在这个场合、对这个听众、不打草稿会这样说吗？像复盘纪要、办案记录、产品需求或作者批注的句子，即使语法正确也必须改。
- `核/核验/复盘/推进/承接/落点/口径/路径/兑现/对齐/闭环/归因/交付/复现` 是候选警报，不是无条件禁词。职业角色谈本职对象时可以用；主播和普通咨询者谈日常问题时，优先说 `看一下/对一遍/查到哪儿/接着聊/问清楚/又听见`。先看说话人和对象，再决定留不留专业词。
- **职业词不等于口头审查表**：财务可以说“回单号”，部门助理可以说“个人垫付要报备”，但一次只能回答眼前这一问。禁止让一个职业 NPC 顺手把审批、付款、到账、责任人和未知项全部分栏总结，再让主播复述一遍。完整流程应放在原始材料或结案页；人物只说自己岗位看得见的当前状态，并保留排队、怕越权、怕担责、赶时间等说话摩擦。
- **材料可以列，人物不要替材料归纳**：角色可以逐字读一行，也可以翻到下一格后产生反应；不能刚读完三行，就自己总结成“分别是办卡、投店、带客”或“主责在我、付款和供应商在他”的标准答案。主播下一问只抓其中一个当前缺口，另一行留给下一拍或材料板。
- **作者的衔接动词不能进人物嘴**：`替谁收口／紧跟着／紧接着／顺着往下` 常是编剧在描述两句材料怎么排列，不是人物在当场说话。人物要说可听见的先后动作，例如「语音刚停，他就把最低还款金额发来了」「我爸又发了一句」。舞台说明也优先写画面或声音的实际变化，不拿连接词替代动作。
- **证明边界分层**：咨询者回拨时只说自己看见了什么、当时怎么想、现在为什么难堪，不得完整复述「能证明／不能证明／只代表」三段式证据边界。主播可以把其中一个缺口问回来，财务、律师等职业顾问可以回答本岗位的一步，完整的 `sourceProves/sourceDoesNotProve` 留在材料板和内部逻辑合同。扫禁词时必须区分人物口播、玩家可见板文和内部元数据，禁止为了去 AI 腔改坏证据合同。
- **事实边界不许由主播宣读**：普通攻防里，禁止让主播用「今天没人替你们定」「这只能说明」「结果先到这里」「我只问下一件」代替接话。边界要落在他停在哪一问、接着问哪件具体事。先回应上一人的阻拦或改口，再往前追一步；例如对方说「别往后说」，主播可以回「我没往后说。她刚才说没去，现在改成一个人住。那钱呢？」
- 禁止把多个操作压成一句，如「能核的先核清」「把路径对齐后回来谈」。真人通常会拆成具体动作：「我先去找回单，再把那几栏对一遍」「明晚接着聊」。
- **流程简称必须展开**：人物第一次提到「统一走」「复盘」「归档」「按名单走」一类内部说法时，必须让听众知道在说哪件东西、谁要做什么、什么时候做。写「下周一开季度总结会，这张活动总结表会在会前确认」，不要写「复盘下周一归档」。如果角色故意用「月底一起办」拖延，下一话轮必须追清这是月底提交报销、财务审核，还是实际打款；含糊本身可以是人物策略，作者不能跟着含糊。
- **职位标签不能拿来当口语动词**：材料表头里的「执行主责」「付款对接人」「供应商确认人」可以保留，人物却不能说「刚接主责」「拿主责」「给你主责」「第一次主责」。先说具体工作和关系，例如「活动刚交给我」「老板第一次让我独立负责这么大的活动」「他答应在活动总结里写我负责」；确实要引用材料时，再明确说「‘执行主责’那一栏写了我的名字」。人物是在讲自己做什么，不是在给岗位状态打标签。
- **万能情绪容器必须落地**：把「接住我／托住我／兜住我的情绪／给足情绪价值」当作候选警报。这些词把倾听、回消息、陪聊和替人说话压成了作者总结；人物要说对方实际做了什么，例如「也就你肯听我说这些」「我回他‘有事你就找我’」「他被店长骂了就给我发语音」。只有角色明确引用已经建立的网络热词时，才保留抽象说法。
- **模糊代词和作者调度词也必须展开**：把「这边／那边／这块／这个事／往回收／先放一下／后面再看／怎么走」当作候选警报。若新玩家只听这一问一答，不能指出它指向哪笔钱、哪张表、哪个角色或什么动作，就重复对象名并说出动作，例如「那十万元后来是不是买了宸直产品」「我还能说是家里想问，不是我非要查他」。人物可以故意回避，但听众必须知道他在回避什么；下一话轮要追清，作者不能拿含糊代词充当转场。
- **材料原词可以保留，人物总结不能借词偷懒**：证据表头、聊天原话或职业材料里的「下一次推进」可以原样保留；第一次引用时要说明它是表头或备注，并追问具体要求谁办卡、带客或投钱。不要把它改没，也不要让人物说「推进走完，人就往后放」替材料下结论。
- **动词和量词必须能当场说出口**：AI 常把行业动作和量词硬拼成语法正确、真人不会说的搭配，例如理发师说「晚点我给你插一位」。先还原人物眼前正在做什么，写成「我把手上这个做完就轮你」；材料总结可以使用「加号」，人物对客说话优先说等待时间、先后顺序和手上的活。
- **短句不是口语通行证**：不能把“接熟话—回忆上次—提出眼前要求”切成三截电报句，例如「又自己人？上回那护理我不续。你别拿这句哄我」。人物说得急，也会把缘由和当下要求连起来：「上回你也是这么说的。我那套护理刚做完，不续了啊，今天就补个颜色。」下一话轮还要接住“今天做什么”，不能用「不续就不续」把交流掐断。
- 不做逐词替换。一个书面词往往会带出整句的公文节奏；替换后必须重读前后两句，把连接词、名词化表达和收尾一起改顺。
- 主播不能用审讯命令、结案判断或工作流短语抢跑。先接住上一句，再问一个具体的人、钱、物件或动作；咨询者的回答要回应这个问题，或让闪躲本身清楚可闻。
- 关怀选择不能套用「你愿意相信不是因为你傻」「换谁都会」一类通用治疗文案。说出这个人实际收到的照顾或付出的代价，再给一句当场能执行的回应；删掉案件名词后仍可原样送给任何来电人的安慰句，视为未完成。
- `stanceSnapshot.afterPickLine` 和第二夜 opener 不是作者提纲。禁止用「还有三件事」「把审批、付款、返款拆开」列出后续任务；只捡上一拍已经出现的一个物件或一句话，给下一场留下一个明确问题。
- `stageJudgement` 先给眼前动作，再留一个未知边界。已经在材料板出现过的金额不连续复报，行动建议不超过两组；`caseClosing.verdict` 不再把同一套判断换词念一遍，而是保存事实状态，方便后续案件接续。
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
- Afterthought placement (追补句): real speakers sometimes finish the point first and patch the frame after — 「挺吓人的，那张表。」「我没答应，当场就没答应。」 Use it when the speaker is visibly thinking while talking, not as a per-case texture count.
- Lopsided recall instead of neat lists: a caller remembers one vivid item and trails off — 「他就总说店里压力大，别的……反正就那些。」 Never let a caller enumerate in tidy triples (「他会说A、说B、还说C」); inventory speech is essay speech.
- Vary sentence length hard: a three-character burst next to a long rambling clause. Uniform medium-length sentences are the strongest single AI tell in dialogue.
- Self-repair has two possible jobs: a clue-bearing slip, or ordinary speech texture. Use either only where this speaker would really correct themself. Repeated corrections quickly become a visible author tic; there is no minimum quota, and a case with no useful correction is not missing a beat.
- Keep object names stable per character: pick what this caller would call the thing (「那张表」) and hold it. Cycling synonyms (表格/资源表/排班表/名单) inside one speech is elegant-variation slop — a label change must mean something, like the pronominal shift.

Coherence (连贯靠接话头，不靠连接词):
- Every turn picks up the previous turn logically: answer its question, pursue the next missing detail, resist it, or visibly dodge it. A visible dodge is a connection — the audience hears the swerve. A topic jump is not.
- **默认信息跳跃律**：接上话头不等于把上一句的关键词再说一遍。双方都已听见、指代也清楚时，直接进入下一问；删去开头复述后若问题含义完全不变，那段复述就是 AI 接缝。不要写 `“先垫着”我听见了。他有没有说最晚哪天还你？`，直接问 `他有没有说哪天还你？`；对方答完没有日期后，也不要先归纳缺项，再问为什么没转。只有纠正原词、确认歧义、当面对质、从插曲中恢复旧话题或呈现真实情绪反应时，复述才有新功能。
- Question-answer adjacency runs both ways: the host may only ask what the last caller line makes askable; the caller must address — or audibly evade — the question actually asked. An answer that would fit under any question answers none; rewrite it around one word from the question.
- Anchor by repetition only when the referent could blur across turns: a stressed caller may repeat the object — 「那八万」「那张表」 — instead of 「它」「这个事」. When the referent is already unambiguous, trust the listener and omit it; object repetition must solve ambiguity, not prove that the speaker was listening.
- Discourse markers (`后来`, `反正`, `就是`, `要不`) are structural signals, at most one per turn: `后来` returns to the timeline, `反正` closes an argument the speaker refuses to itemize, `要不` raises an option they are half-committed to. Never use them as sentence lubricant.
- **悬时校验律**: any backward reference such as 「跟上次一样」「又是老样子」「这套路我熟」 must point to a concrete beat the player has already heard, or carry its own minimal anchor in the same turn (for example, 「上个月他也先发表情包，再催还款」). The characters may have a shared past, but the script cannot ask a first-time player to supply it. If neither anchor exists, replace the comparison with the concrete contrast happening now.
- **顶重反应律**: when a beat suddenly raises the case above its original register — police contact, another victim, systemic collapse, or immediate personal-safety risk — the next adjacent host turn must first acknowledge the person's immediate cost or safety before continuing the factual question. The closing spoken surfaces (`hostDisclosure`, `stageJudgement`, or `deepFollowup`) must also separate what this heavier event establishes from what the original object still cannot prove. Do not leave the event only in `caseClosing.unresolved`, and do not summarize it with 「事情没这么简单」.
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
- **Evidence must arrive on stage**: a title card,案间页或接通前页面都不概括来电人的问题，也不摆出材料。标题以后直接接人物开口，由第一组问答建立求助；当咨询者在通话中提供账单、流水、截图或录音时，必须先写主播提出请求、当事人同意或遮名、文件到达后台，再显示材料。“证据已经在这里”不能替代人的动作。
- **Title-card restraint**: a case subtitle is optional. Omit it when it only restates the title, turns a later discovery into an opening tease, or tells the player who is supporting whom before the dialogue has established that responsibility. A title card orients the player; it does not argue the case.
- **Row-identity conservation**: adjacent dates and similar amounts do not prove that the same money moved from one row to another. State each row with its date, direction, amount, and counterparty before drawing an inference. Write 「7 月 5 号信贷放款五万；7 月 19 号向 3301 转出 49,800」 unless the material can truly prove 「这五万转去了 3301」. Keep temporal proximity separate from fund identity.
- **Amount-bucket conservation**: before a character or recap assigns moral responsibility for a bill, divide the total by visible use and beneficiary: shared/relationship spending, one party's personal spending, and still-unexplained remainder. Every bucket needs itemized support, and the arithmetic must survive the total. Do not compress restaurant booking, social posting, and a content account into three separate accusations when they are one social-performance event; do not call the whole bill “spent on her” when rows also show his personal vanity. Ask the person to confirm or dispute one bucket, then discuss responsibility.
- **Cumulative transfer is not current balance**: whenever one character assumes another can pay because money was transferred over time, keep three figures separate: cumulative inflow, the character's estimated savings, and the holder's current balance. The first can explain why a request was made; it cannot prove the other two. Ask for spending or balance before judging ability to pay, and do not turn a mistaken balance estimate into the holder's debt.
- **婚事资金双边表**：剧情一旦出现彩礼、嫁妆、婚房或父母承诺，必须分开登记四件事：谁先提出金额、双方本人现在各能拿多少、双方家庭现在各能拿多少、哪些只是未来可能兑付或变现的资产。自费学历只能证明历史支出，不能直接推出当前家底；单日余额不能自动视为彩礼承诺；尚未到期的理财、待售房产或口头承诺不能提前写成婚礼现金。人物可以故意混说，主播和结案不能跟着混，且不得用“双方都有问题”抹平一方开价、一方含糊回应、另一方隐瞒期限这些不同动作。
- **家境调查四问**：父母以“替孩子把关”为名调查对象时，必须拆开问：查到了什么、是否真的构成欺骗、父母据此采取什么动作、来电人知情后有没有叫停。查到“父母普通、婚房帮不上”不能自动写成被骗；若父母借这个落差加价，来电人嘴上说无奈却继续让报价传递，就要登记为本人支持。若来电人又把对方花钱、接送或情绪劳动当成条件较弱一方应付的差价，主播必须把这份高低判断问回本人，不能只做彩礼数字审计。
- **商业腐烂两张账**：公司案同时出现个人报销与供应商返费时，必须分成两条证据链。个人垫款只看授权、报销申请、付款和回单；层层返费只看岗位、名目、计算方式、支付状态和收款账户。公开融资稿、单点经济与返费规则可以支持“商业模式撑不住”的判断，老板或公子的八卦只能塑造环境，不能替具体挪用或入账作证。
- **Unresolved-identity budget**: count every distinct "who received/sent this and we don't know" thread in a case — unknown payee, unknown account, unnamed institution, unconfirmed relative. A tier-1/opener case should carry at most two; a later or capstone case may carry more only if it is the pack's deliberate density peak. Two threads that share the same shape (an opaque lump-sum transfer to an unnamed recipient, repeated with different numbers and institution names) read as one puzzle wearing two costumes unless the case gives them visibly different textures, stakes, or resolution paths — collapse or clearly differentiate them before shipping, and never stack a new cross-case seed thread onto a case that is already at budget.
- A named institution already registered in `crossCasePromises` is an institution-result thread, not another anonymous identity. Its remaining questions are limited to product, payment status, contract terms, and recoverability. Do not restage it as a third “who received the money” mystery.
- A masked surname that only labels one recurring date pattern belongs to that supply line. Count the broken pattern once; do not turn “王**” and “每月 8 号” into two separate unknown people. Tier-1 and opener-facing anonymous identity threads still stay at two or fewer. For case 1 they are the 8th-day supply pattern and account suffix 3301; 宸直 remains a named institutional payoff thread.
- **Speaker-and-evidence conservation**: keep every fact attached to the person or artifact that actually supplied it. A third party's refusal to confirm proves only that they refused; the host may not compress it into a quoted shorthand such as 「店里不肯说」 and then speak a conclusion on the third party's behalf. Name a carried item after the observed boundary, not the hoped-for fact. If the caller has already admitted the fact, cut the third-party trip entirely instead of restaging the same reveal. Promote a still-unknown fact only when its owner, a visible document, or another valid source confirms it later.
- **第三方拒答也要像工作现场**：证据边界写在内部合同里，不要让服务员、前台或财务把它念成作者判词。第三方只回答眼前的业务问题，再用本岗位会说的话说明限制，例如「靠窗位确实要提前订。至于哪位客人带谁来过，我们不能往外说」。禁用「这个我能说／不归我们答／谁为了谁」这类把权限边界和关系判断压成口号的句式。
- **Observation → hypothesis → confirmation → derived question**: when the source supports only an inference, the host asks it as a hypothesis. The caller or material must confirm it before the host asks a question that presupposes it. Example: hard-to-book seat → “Are either of you a long-time member?” → caller admits membership → only then ask about earlier visits and spending power.
- **No redundant interrogation**: once invariant dialogue has already named who booked, who ordered, what was bought, or who posted, the next host turn may not ask the same fact again. Ask the next unresolved edge: destination, payer, prior pattern, timing, or why it was withheld.
- **No spoken audit table**: a witness, host, or NPC may not turn a live disagreement into a balanced evidence report. Lines such as 「给甲方三句、给乙方三句」「说高说低两边都有」「按句认」「两套报价并排」 make characters perform the author's classification work. Let one person read or defend one concrete message, let the host ask what basis they had for it, then let the next message enter only when that answer makes it relevant. Preserving a full record is an action (`stage`, material capture, or a short choice result), not a speech that recites every category again.
- **Admission needs pressure**: an NPC should not arrive with a perfect inventory of what they exaggerated, minimized, and cannot prove. First ask about one concrete claim and its source. The admission should be lopsided and self-protective — 「我没看过工资，这句是我嘴快」 — before a second question exposes the other side. A complete self-audit delivered before resistance is author summary disguised as honesty.
- **Do not mirror the list**: after a speaker reads several items, the host must not repeat the same items in the same order as a conclusion. Pick the one unresolved word that matters now. If the player chooses to keep a complete chat, the host says what they will do with the record; they do not re-perform the record aloud.
- **No plot-scheduled withholding**: a caller may refuse only when the audience can hear the human cost of answering: shame, money, safety, status, or fear of being blamed. Do not use lines such as 「今晚还不想说」「先让我把账算完」「后面再讲」merely to save a known fact for a later scene. When directly asked about an object the caller knows, let them answer with their self-serving interpretation (for example, 「东西在我这儿，但我当时以为是他买来送我的」); a later beat should deepen the action or responsibility, not reveal the same ownership fact after an artificial delay.
- **Cross-night knowledge isolation**: audit every player-visible line before an overnight hangup against what that speaker knows at that moment. A night-A answer cannot say 「直到今晚上麦」 or cite a night-B admission. Keep the first-night line at the unresolved observation; let the later scene supply the admission after it happens.
- **Hangup does not preview the payoff**: a host may send the caller back to material already on screen, but cannot name the unrevealed person, institution, account, or consequence that the next act is designed to uncover. A hangup line points to where to look, not what the answer will be.
- **Quoted lines must be traceable**: quotation marks in a host challenge require a player-visible earlier line with the same wording and speaker. If only the meaning appeared, paraphrase without quotation marks. Never invent a cleaner quote so the callback sounds sharper.
- **一次揭示律**：为承重事实分别登记 `firstTrace / firstQuestion / firstAdmission / laterUse`。回拨 opener 可以提醒“有一条短信要问”，不能先把短信里的答案完整说出，再让固定场景把同一答案演成反转；夜 B、尾声和复盘再次提到它时，只能新增人物反应、行动后果或旧句的新含义。
- **可选路线兜底律**：白天可选调查若独占一条事实，后续固定台词不得默认玩家已经知道。需要所有路线都知道时，另放一条可信的共通来源（当事人消息、固定材料、对方可归因的回复）；否则为不同带回物写条件台词。兜底来源可以交付同一事实，不能冒充玩家已经完成过那次调查。
- **尾声引语同源律**：关怀选择、未读回访和案间回声里的引号内容，必须能在触发它的那条选择中找到原词。只保留意思时去掉引号并改成自然转述，禁止为尾声临时发明一句更像金句的旧话。
- **对方回应承重指控律**：`respondentNote` 先回应让处置发生变化的那项最重指控，再谈自己的辩解。对方可以只认最小事实、争论责任或补充咨询者的删减，但不得绕开姓名被擅用、金额未到账、材料范围或是否同意这些核心问题，只回答旁枝。
- **入场来源律**：对方实时发消息、刷礼物上麦或第三方突然补材料时，正文必须交代他如何找到直播或为什么此刻回复。优先使用已经存在的闺蜜、介绍人、工作询问或后台转发；不得让角色因为作者需要反制就自动知道匿名直播间。
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

### 主播对质快案律

快案不是自动播放结论的短剧。玩家先整段听来电人把当前公开版本说完；找问题时，系统把同一段原话逐句拉回，玩家按住其中一句，主播再把它问成自然的完整问题。对质可以逼出来电人换一套口径，新口径随后成为下一段陈述的合法前提。戏剧性来自同一句话在“第一次听”和“回头细听”时含义变化，以及来电人刚才的从容与此刻的支吾，不是评论区或系统替主播宣布答案。

- **分段披露律**：一宗快案分成二至三轮“整段听麦 -> 原句回放 -> 短问对质”。每轮先播完一个能独立理解的局部经历，再把这段拆成句条；未来轮次才会出现的人、材料和矛盾必须隐藏。对质逼出的新事实可以成为下一轮陈述前提，不能让玩家在事实尚未出现时预选答案。
- **三种播放律**：同一段 `statement` 必须有三种听法。首次听麦时按整块播放，来电人主场；回放时只调用逐句切分，不新增、不摘要；打断后只播放玩家按住的 `sourceAnchor` 所对应的主播 `question` 和人物攻防。每轮首次听麦前必须用全屏大字进入「来电人陈述」，回放前再用全屏大字进入「逐句追问」；大字只切换舞台节奏，不解释规则或暗示正确句。若白天材料会把 `version` 换成 `revisedVersion`，必须另给 `revisedSourceAnchor`，并逐字落在实际播出的改口陈述里；不能让回拨后只剩错误句可点。对质后的新长答回到下一段听麦，不能一直停在一问一答节拍器里。每次连线至少有两轮，主案每个夜次也至少安排两轮。
- **耐心归属律**：快案耐心按陈述轮重置，主案耐心按夜共用并在第二夜重置。浏览、左右翻句和重复听不扣耐心；逐句回放中的每一句都可确认，只有完全没有可追问线索的原句才扣一格。句条下仍只显示 `这句没有可追问的线索 · 耐心 −1`，不得在条下写作者归纳或教程。玩家确认该句或点中带 `sourceAnchor` 的错问之后，必须接角色反应（见失败即传感器律），不得只扣一格就回到选句。耗尽后才允许直播间失去耐心的反馈与本段重听入口。界面不显示 `2/4` 或答对数。
- **字段时序守恒**：主案固定场的实际顺序是 `beforeVersion -> entryQuestion -> version -> afterVersion -> casualQuestions / questionOptions`。因此 `afterVersion` 只能续完玩家尚未介入的初始陈述，不能承载“玩家问中以后才出现”的二次陈述。若一个事实必须由玩家指出方向后才能出现，把它写进正确项的 `lines` / `guardedAnswer`；下一拍的日期差或材料结论交给 `afterScene`、`revisedVersion` 或下一场追问。`casualQuestions` 只能依赖 `version` 及更早的公共表面，禁止询问尚未出现的私聊、人物或材料。
- **首轮静默律**：每一轮第一次听问答时只显示主播与来电人的原话，不显示实时评论，也不写“先记着”“这很可疑”“重点是……”一类作者提示。普通寒暄、真实经历和暂时无法核验的话都要保留，不能让每一页都像故意递出破绽。
- **常规问答成对写，反驳不受一问一答限制**：普通咨询按“上一句怎样合法引出下一句”审查，一问一答只是控制信息量的常用节奏，不是所有场景的固定格式。进入反驳或对质以后，按人物真实攻防写成问、否认、追问、改口、再反驳等必要拍数；每多一拍都必须回应紧邻上一句，并带来新事实或新的防御。运行时仍一屏只显示当前一方的一段台词，当前说话人的立绘提亮，另一方压暗但不离场。
- **咨询因果先于破绽清单**：每一问必须从上一答的经历、诉求或用词里长出来。接通后的第一页可以只完成问候，下一页再问来意；家庭经历若解释了“想找能相互扶持的人”，下一问才可以顺着择偶条件问房子。若去掉对质标记后整通电话不像真人咨询，顺序必须重写。
- **咨询者不得替主播破案**：来电人开头先建立可信的公开形象，并至少说出三条真实、普通、不会直接定性的生活信息。每个核心漏洞第一次出现时都带一层当场说得通的保护，例如模糊称呼、只答一半、合理顾虑或改换披露时点。两处承重原话之间至少隔一个正常问答；她不能主动完成动机自白。
- **对质延迟律**：主播在当前轮原始问话阶段只了解具体情况，不提前说“你其实就是……”；当前轮铺垫问答结束后才进入该轮 `confrontations`。每一项对质必须用 `basisTurnIds` 指向本轮结束前已经播出的原话，不得引入职业黑料、私聊截图或任何麦外事实。若矛盾本身是一个尚未回答的空缺，`basisTurnIds` 可以登记“原说法 + 追问空缺”，真正的新事实必须由对质里的最小承认产生，并登记在 `answerAdds`，之后才能供下一轮使用。
- **异常举例延迟回问律**：来电人若在普通经历里突然拿自己的敏感问题举例，主播首轮可以自然换到下一项生活信息，不必当场追问“你为什么这么说”。这个异常例子必须原样留在首次陈述中，不能直接等同于答案；玩家在回放里按住该句以后，主播才把原话问回去，检查结果或其他事实只能从来电人的反驳、辩解或最小承认中出现。
- **否认后短追问律**：来电人的第一句若只是“你怎么能这么问”或“我只是随口说说”，不能把事实承认硬接在同一个长回答里。主播可以用“那到底有没有”一类短话继续追问，再由来电人交出最小事实；若她再次换理由，还可以继续攻防，但每一拍都要推进事实或防御，不能为了显得激烈空转。
- **重大隐瞒不得首问直认**：若某个事实正是人物整通来电都在掩饰的核心，她被第一次正面问到时不能立刻交出答案。先让她重定义称呼、反问提问动机、淡化区别或强调结果合法；主播把问题收窄到只能回答的是非项以后，她才作最小承认，随后再用隐私、对方自愿或“这不影响求助”转移。狡辩每一层都要保护她的现实利益，不能只为拖长对话。
- **一次对质只打一个矛盾**：这里限制的是问题范围，不是问答轮数。主播不能一口气复述四组问题，也不能把四个结论压成一张成片卡；同一个矛盾内部可以连续否认、追问和改口。主播可以把逻辑说清，但不能把未知身份和未经证实的经历说成事实。
- **先回放再对质**：每轮原始陈述结束后必须把控制权交给玩家。可点项就是刚才说过的每一句原话，不另写答案摘要；每个承重点用 `sourceAnchor` 逐字绑定原句，用 `question` 保存主播随后说出的完整问题；存在改口版时，`revisedSourceAnchor` 必须绑定改口版的句面。可以保留听来可疑但当前尚不能互证的原句。无线索句的条下仍只标“这句没有可追问的线索 · 耐心 −1”；确认之后走失败即传感器律，不靠评论区补答案。承重正确项和可点错问都必须有 `sourceAnchor`；无锚点的 `correct:false` 选项不得进入玩家可见稿。
- **改口带出下一轮**：对质不是结案复读。它应让人物否认、缩小问题或作最小承认，并留下一个新的可问名词、日期、同行人或材料入口。下一轮主播只能顺着这个刚获得的入口继续问；不得突然调出此前未获授权的朋友圈、账户或职业资料。
- **最小承认与转题**：被问住的人优先承认最小、最不伤自己的部分，随后改换理由、强调隐私、反问主播或把问题说成对方误解。她可以支吾、重复、突然变短，但不能顺势提交完整自我审计。四次回应应有递进：含混否认、为双重标准找理由、露出真实偏好、最后恼羞或结束通话。
- **删除群体答案与数字进度机制**：不得设置评论接力或弹幕裁判。评论可以作为直播间环境，但不能提供答案、教玩家价值观或替人物认罪。快案的核心动作是整段听麦、逐句回放、主播当面追问；UI保留同一直播间背景和两张立绘，但不显示预计时长、“第 X/Y 屏”“对质 X/Y”“本轮 X/Y”或完成比例。流程进度由人物改口、新陈述和舞台状态自然表达。
- **问清即续播，恢复也能续播**：当前段的所有必要方向问清后，必须直接进入由新口径带出的下一段普通问话，不再让玩家回到只剩“已经问过”的选择页。成立方向即使因刷新或旧存档丢失了正在播放的对质状态，也必须允许重新进入；恢复时若当前段实际上已经完成，则自动跳到下一段，不能出现按钮可点但流程不动。
- **开场不讲玩法，也不替玩家概括案情**：快案入口只使用接通前观众和主播已经知道的信息，例如“一个姑娘打进电话，想问问她和男朋友接下来该怎么办”。删掉“这次怎么玩”、轮次与按钮说明、对质会怎样推进、让玩家寻找隐瞒等游戏概念；也不得提前写出学历、职业、认识渠道、消费行为、失联导火索或当事人的归因。人物和案情必须在连线中由玩家逐句听出来，第一处判断层自然出现时再让界面教会操作。
- **结案不能越界**：`confirmed / unknown` 继续作为作者校验，不直接渲染成结论卡。主播可以基于三组以上同向矛盾拒绝介绍或背书，但必须明确哪些事实没有查清。未知项防止捏造，不负责冲淡已经成立的风险。
- **结案三段律**：快案结尾不能停在“拒绝帮忙”。先让主播结束通话，再用玩家已经问出的矛盾复盘“不合理在哪里”，最后说出目前最能解释这些矛盾的高概率经历版本。三段都由主播逐句说，不用静态结论卡代替。来电结束后进入 `stageLabel: 结案复盘` 的第一句固定为主播口播「我们来把这次这个连线复个盘。」；这句话只负责从通话切到复盘，不得提前放在来电仍在线的收尾页，也不得被案情摘要替换。
- **判断不能被边界句撤销**：高概率版本至少要由三处同向的已播事实支撑，并把推导链说给玩家听。事实层和判断层分开，不等于主播只能说“很像”“无法坐实”；证据已经支持经济交换、利益筛选或成本转嫁时，主播应直接说“我判断这是……”。`unknown` 只保留真正没问到的具体身份、当前状态或成因，不能紧跟在判断后面把整段判断撤回。结尾行动依据是主播是否愿意让听众承担已经看见的风险。
- **素材改编先锁因果事实**：用户要求“依据某段公开视频内容做案件”时，动笔前先列一张不含原句的素材账本：来电人的表面求助、事件实际顺序、每次被追问才补出的事实、现实利益、让判断改变的承重细节、高概率结论。公开事件事实与时间顺序不是原视频台词；凡是支撑反转的饮酒、送花、同行人、金额、日期、动作或利益关系，除非用户要求删去或存在安全问题，必须保留其因果功能。不得为了证明“原创”而同时更换人物性别、职业、关系、事件场景和利益入口，最后只留下一个抽象改口机制；若确需替换承重事实，必须重新证明每层隐瞒为什么发生、痕迹从哪里出现、结论怎样推出。
- **原创边界**：素材账本保留因果，成稿仍须匿名化并重新组织表达。人物姓名、可识别机构、非承重金额、聊天措辞、主播问法、对质台词和舞台结论重新创作，不逐句复刻视频，也不把公开评论中的攻击性猜测写成事实；在快案数据登记 `sourceBoundary`，明确哪些承重事实被保留、哪些身份与措辞已改写。

快案最小闭环：`整段听麦 -> 同段原句回放 -> 玩家按住一句 -> 主播完整质问 -> 来电人最小承认或改口 -> 新口径进入下一段听麦 -> 再回放与对质 -> 主播结束求助并作结案判断 -> confirmed / unknown 作者校验`。任何对质若需要一个屏幕外事实才能成立、`sourceAnchor` 不在刚才的陈述里、未来事实提前可见，或无需玩家动作便自动播放，关卡不合格。

主案使用同一披露纪律，但按跨夜节奏展开：第一夜只让玩家确认二至三个问题，并留下具体开放边；白天材料只能回答这些开放边或合法带回新的入口；第二夜再确认二至三个问题。第一夜不得为了显得“案情丰富”一次交出全案，第二夜也不得只是复述第一夜已经成立的结论。

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
- 可点的错问必须能被运行时命中：`sourceAnchor` 逐字落在当前播出的那句上，长度不得被同场更长锚点整段吞掉。写了却点不到，视为未完成，不是静默设计。

摘要即回归 (compression is regression):
- Per-line/AVG display is achieved by SHORT SENTENCES, never by SHORT SCENES — the chunker splits long speech; it never licenses deleting texture. Any edit that raises information density by removing emotional beats, direct quotes, verb texture, or connective breath is a content regression regardless of intent (the 15d5749b incident: 「他把截图丢给我…那一刻我不是生气，是懵」 became 「他发办材料截图…我当时没接上这件事」 — that is a log line, not a person).
- Texture check: a `version` should not read like a synopsis. Keep the direct quote, afterthought, hesitation, or ordinary reaction that makes this specific recollection human when it also carries voice, pressure, or relationship state. Do not add a non-load-bearing sentence just to satisfy a floor.
- 发现权守恒 (conservation of discovery): anything the player is designed to earn — document rows, laundering catches, replay finds, mid-case turns — may never be pre-narrated by the caller or any surface. A refactor that surfaces hidden agency early, or has the caller recite exhibit rows, breaks the case even if every sentence reads fine.
- 标题静默律: 主案标题卡只显示案号和案名。不要用一句“她还停在转账页”、案情摘要、材料预告、主题句或操作指引替剧情开口；来电人的求助必须在接通后的第一组问答里成立。案间名言页只显示名言和出处，不再追加作者写的承上启下句。`openingComplaint` 只允许作为内部索引，`manifest.sequence` 不写玩家可见的 `bridge`；全量阅读版、导演版和其他派生稿也不得在人物开口前重新插入“来电摘要”或案情旁白。
- 原句回放静默律: 承重判断页只显示刚才说过的逐句原话，不在句条下附作者归纳、教程或“这句才对”。成立原句由主播把完整问题问出来。无线索原句的条下只标“这句没有可追问的线索 · 耐心 −1”。阶段标题不许写“她改了说法／真正想要什么”等作者结论。
- **失败即传感器律**: 玩家确认无线索原句，或点中 `correct:false` 且带 `sourceAnchor` 的追问之后，必须有角色反应：来电人防御、主播接不住、或一条不泄题弹幕。禁止只有 `耐心 −1` 就回到选句。反应只许交付“这个人此刻不愿往这边走 / 这个问题问早了 / 问法让对方抓住话头”；禁止交付正确锚点、正确金额、正确人名，或“你该点另一句”。不得用 `missLine`、提示段或弹幕讲解为什么不成立，也不得借错误反馈反向排除其他答案。直播间失去耐心、重听入口仍只在本段耐心耗尽后出现。无 `sourceAnchor` 的错选项不得出货。
- Any rewrite pass must compare direct quotes, emotional beats, and breathing room before/after. A numerical loss is a review signal, not an automatic failure: reject it when the scene became a synopsis; accept it when duplicated texture had been blocking the conflict.

## P0/P1 Manufacturing Doubt, Questions, and Turns (疑点、问题点、转折点)

Doubt points are not invented; they are computed. Run this method between the pressure-system pass and the beat-ladder pass. Its checking-side counterparts (A/B story, suspense check, promise ledger) live in `detective-plot-coupling-review`.

### The Truth Ledger with Numbers (真相账本)

Before any dialogue, write the B story's full accounting — every amount, every date, every money path, every object's history — **including the parts that will never appear on screen**. The demo's best turn only became findable when 八万 was decomposed into three buckets: 不到三万的共同消费、约一万五的男方男装、至少三万五未说明; its second turn (每月 8 号还入) only existed because someone wrote the debt's repayment history that no scene had ever needed. The unstated ledger is where turns hide. A case whose B story is only prose has no turns to find.

### Pressure, Decision, and Responsibility (压力—决定—责任三层账)

When two flawed people share a money conflict, never compress causality into “A forced B, therefore B is excused” or “A benefited, therefore A owns B's debt.” Write three separate ledgers:

1. **Pressure** — what repeated demand, dependency, family expectation, status anxiety, or cash shortage made the bad option attractive? Put it on screen through countable behavior: fixed monthly transfers, who paid rent, how often someone called after a missed payment, what spending was treated as normal.
2. **Decision** — who signed, borrowed, invested, spent, lied, forwarded, or demanded? Emotional pressure can explain this verb; it cannot replace its subject.
3. **Responsibility** — which amount, contract, benefit, or harm attaches to which person, and which part remains unknown? Shared lifestyle benefit may justify a later conversation about that benefit; it does not silently co-sign another person's loan or investment.

The host and recap must name the layers concretely, not hide behind “both sides have problems.” In the credit case, her treating half his salary plus rent as her own budget and repeatedly chasing after a missed payment is one responsibility; his borrowing to chase a promised doubling return is another. Her pressure is part of his motive and still not his signature.

When a packaged money word later changes meaning — `奖金` → `离职补偿`, `报销款` → `供应商返款`, `投资` → `分期购买` — the payoff needs a second source that can verify the raw category: settlement notice, contract heading, remittance slip, or the responsible person's attributable admission. Record four boundaries: who supplied it, whether public use was authorized, what it proves, and what it does not prove. A notice saying “预计月底支付” never becomes proof that money arrived.

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

## P0/P1 Writing Workflow

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

Run the passes that apply. Passes 2, 3, 6, 8, and 9 are load-bearing for a playable evidence case; the others are scope and richness tools, not excuses to delay a clear spine:
1. Showrunner pass: define the story-pack theme, value boundary, case count, and why these cases belong together.
2. Ending-first pass: write the final audience argument and the behavior chain before writing dialogue.
3. Pressure-system pass: define why tonight, dramatic anchor, object purpose, caller stake, other stake, third pressure, and truth boundary.
4. Beat-ladder pass: draft 5-6 caller statements that each add a new pressure, not a restatement.
5. Branch-design pass: for each beat, write 2-3 plausible host questions with different route axes and reveal depth.
6. Actor-consistency / stake-alignment pass: separately ask what the caller, the other party, and the third-pressure source each gain by saying less than the full truth. For every visible line, name whose face, money, status, safety, or convenience the line protects; if it only delivers background to the player, fold it into a material, host prompt, or later confession.
7. Agency-without-forced-blame pass: give the caller a concrete choice, need, delay, fear, or self-protective edit when the facts support one. Do not manufacture vanity or complicity merely to avoid a “perfect victim”; responsibility may be sharply asymmetrical. If the caller has no advice-changing omission, make the mystery rest on the other party, the system, or an external fact rather than planting a fake stain.
8. Evidence-verbal deadlock pass: identify the material-board edge that locks against a spoken claim. If the core reveal can be reached by host questioning alone, add or rework a physical clue: a missing half of a screenshot, a date on a bill, a cropped approval page, a stray account name, a private column, or a backflow material. The deep question should feel forced open by this deadlock, not by the host being clever.
9. Continuity QA pass: read the whole call aloud and check that every reveal follows from what is already on screen. A small clue may open one local question; it may not instantly become a full motive, scam label, or final judgement.
10. Length QA pass: estimate what the player actually does. If the case has only live reading plus one quote-pick, it is underbuilt for Steam. Add authored interaction, not prose bulk.

Five-beat target for a full-length case:
1. Surface oddness: material, quote, bill, screenshot, or action first appears.
2. Missing edge: the object proves something, but not what someone wants it to prove.
3. Interest path: money, status, face, opportunity, process control, or emotional leverage appears.
4. Caller edit: the caller admits, softens, or exposes their own self-serving version.
5. Responsibility point: the cost or boundary lands, enabling the final quote-pick.

If a generated case cannot fill these functions without repetition, shorten it, combine it, or reject it. Do not add a third pressure, another victim flaw, or a crowd subplot only to reach a count.

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
- Every committed `questionOptions[]` route in the main cases and quick cases must expose an exact `sourceAnchor` copied from the statement the player just heard. Keep `question` mandatory: after the player holds that source line, the player-character speaks the authored natural question and the caller answers it. `suspicionLabel` may remain as an internal editor index, but the replay UI must not substitute it for the source sentence.
- Direction-only display is a node-level presentation rule, not a correctness badge. Give every committed sibling a label of similar specificity and visual weight. Never put short labels only on core/correct routes, and never expose the finished `question` on the decision button. Authored `casualQuestions` may remain short spoken questions because they are conversational background asks rather than deductions that commit the route.
- If a case uses `revealTransition`, mark exactly one load-bearing committed route. It plays after the player selects the doubt direction and immediately before the player-character says the authored full question. Use it only for the case's largest reinterpretation, never for every correct clue, a decoy, a fixed autoplay reveal, or a conclusion the player has not earned. Keep it under one second, non-interactive, non-expository, and reduced-motion safe; a minimal natural beat such as `等等` plus an existing portrait focus change is enough.
- Free asks are not a spoiler mode. Asking around can make the caller more guarded, reduce later answer texture, or leave the live room noisier. Do not let the player sweep free asks to identify the correct committed route for no cost.
- Do not write the free ask by copying the committed option and changing one word. The player should feel they asked a side question, not previewed the answer key.
- Visible UI labels must stay clear before they stay stylish. Avoid `soft ask`, `hard ask`, `核心`, `正确`, `最佳`, route-axis labels, and vague process labels like "先问两句", "接着追", or "选一句往下追". Because the game has two different economies on the same screen, the panel may explicitly say "普通提问" and "关键选择"; each button should carry the same kind marker so the player never has to infer the rule from color alone.

Material board writing:
- **教学信息退出人物嘴**：材料有几页、玩家先点哪张、按钮会做什么、哪些卡已经选中，统一交给材料托盘、选中反馈和操作按钮。人物只说现实中的同意、拒绝、隐私或争执，例如「孩子不上镜」「我的手机别拍」；若一句话删掉以后只少了教程提示，没有少人物目的或冲突，就从对白中删除。教学关可以把提示做得明显，但不能让当事人替界面报菜单。
- **原始字段先于跨页推断**：可点材料只呈现单页上真实可见的日期、原句、方向、户名和栏位，不在卡面直接写「与另一页同名」「两笔时间相隔六分钟」「正好反驳她刚才那句」等跨材料结论，也不把正确目标引语贴在证据卡旁边。玩家先打开、并排或出示，随后才由人物反应或主播追问交付推断。点击必须立刻出现放大、移位、选中标记、音效或下一步解锁中的至少一种反馈；“状态变了但玩家看不见”视为不可玩。
- Material text says what is visible, not what is missing. Put the gap in the selectable marks and feedback.
- Bad: "看不到连续流水、收入构成" when the correct mark is "连续流水和收入构成".
- Good: "资料里只有一份工资账户流水，覆盖本月，期末余额 28.6 万；其他账户没有提供." The player then chooses whether the account scope, missing flow, sender, or timestamp matters.
- **Material arrival needs a human trigger**: an intrusive artifact cannot appear only because the plot needs evidence. Establish who asked for it, what was said immediately before the request, why the requester believed they were entitled to see it, and how the owner responded. For example: one party asks for a high bride price, the other says they cannot afford it, the first party disbelieves them and asks for bank statements; only then can a statement enter the story.
- **Requested scope and delivered scope stay separate**: record what was requested and what was actually supplied. If a character asks for bank statements but receives only one salary-account statement, that document proves only that account during its stated period. It cannot establish the owner's other-account balances, total wealth, liquidity, or willingness to use the money for the disputed purpose. The selective disclosure may itself be questioned, but unseen accounts remain unknown until a valid source reveals them.
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

### Help Request and Major-Omission Gate (求助与重大隐瞒门禁)

- Keep authorial truth and caller testimony separate. The B-story chronology must close, but the caller's A-story may contradict itself on purpose. Preserve a contradiction when it comes from a protected interest, is fairly planted, can be tested by the player, and changes the answer to the request; repair it only when the writer cannot state which version is edited or how the player could discover that edit.
- Treat every playable call as a request for help, not as a delivery vehicle for a prepared case file. Register `helpRequest.kind` as either `explanation` (the caller wants to know why or what an event means) or `interest` (the caller wants an action, decision, resource, introduction, repayment, or outcome). Write the request in one sentence the caller could actually say.
- **现实诉求优先于道德概括**：不要把「我不想转这八万块，行不行」润色成「不转是不是不讲情分」，也不要把「我想让他还钱」升格成「我是否有资格维护边界」。先写来电人希望主播批准、阻止、追回、介绍或代说的现实结果；只有人物本人确实会拿「情分／孝顺／懂事／诚意」当作防守包装时，才让抽象道德词进入台词。作者知道她在索取道德支持，不等于人物会用作者的术语说出来。
- **表面求助与真实用途分拍揭示**：来电人可以在开场直说「我不想转，行不行」，但不能顺便自白「我想拿你的回放去压他」。前者是她愿意公开承认的结果，后者是她使用这通直播的隐藏办法。把隐藏用途登记进 `callerStake / selfServingOmission / deceptionChain`，先留一处可听见的痕迹，再由后续玩家追问逼出。开场说清求助，不等于开场说穿案件。
- **能力与意愿分账**：`拿不出来`、`不想给`、`不认为该由自己给` 是三件事。允许来电人在不同话轮中同时说出前两件，它们之间的落差可以成为后续问题；不得用一句「我拿不出来」替她遮掉意愿，也不得因为她说了「不想给」就自动证明债务责任。后续追问要问她想让主播替她做什么，而不是重复问她转没转。
- Keep four functions separate: `helpRequest` says what the caller wants from the host; `whyTonight` says why they call now; `callerStake` says what benefit, relationship, status, or self-image they want to protect; `selfServingOmission` names the most consequential fact they withhold or soften.
- Use the advice-changing test: reveal the omission and answer the original `helpRequest` again. If the advice, refusal, next action, or risk judgment would not materially change, the omission is texture rather than the case core. A playable case normally hides the fact that matters most to the requested help, not a minor embarrassment saved for a late twist.
- Plant a fair trace before the reveal: a verb choice, inconsistent amount, material edge, refusal, or consequence. Let a player action expose it. The caller may defend, minimize, or reinterpret the fact after discovery; do not let a convenient confession introduce it first.
- Do not equate concealment with villainy. Shame, fear, financial need, status, safety, or the wish to keep a relationship can explain the edit. Judge the concrete act and its effect on the requested help. If there is no advice-changing omission, keep the call as a warm interlude or ordinary consultation instead of inflating it into a detective case.

#### Consultation Benefit Engine（咨询获益发动机）

Before writing scenes, name four things for every side: `already obtained`, `still wants`, `does not want to pay or surrender`, and `moral wrapper`. Convert at least one benefit into countable behavior—money, visits, contacts, labor, account control, payment timing, public endorsement, or access to a social circle. “图感情 / 图安全感 / 图诚意” alone is too thin for a playable case.

The caller normally arrives in one of three states: seeking permission to avoid reciprocal cost; discovering that the other party extracted more than first admitted; or asking the host to legitimize a one-sided allocation. The other party needs its own concrete gain or defense. Do not make either side's benefit symmetrical merely for neatness.

Run the **remedy-split test** after the omission is exposed. Separate completed exchange from unauthorized use, shared benefit from personal debt, and a proposed term from an accepted agreement. The reveal must change what the host can reasonably advise: what may be stopped, requested, refunded, refused, preserved as evidence, or left unknown. If the same generic advice still works, the benefit engine has not reached the case core.

Let the caller's early version remain imperfect when the contradiction protects that benefit. Do not rewrite testimony into a polished summary. Require a fair trace and a player action that exposes what the caller hoped the host would not price into the answer.

#### Caller Intent and Pain-Point Response Map（连线目的与痛点反应表）

Before writing dialogue, combine three layers: the speaker's fixed personality, this call's concrete purpose, and the current threat to that purpose. Keep fixed personality and knowledge boundaries in `content/characters/cast.json`; keep the case-specific intent and pressure map in author metadata. Do not treat a broad label such as “急躁 / 理智 / 感性” as finished characterization.

For every caller, predefine:

- `openGoal`: what they openly ask the host to explain, permit, recover, introduce, refuse, or say for them;
- `preferredAnswer`: the concrete answer or outcome they hope the room will give them;
- `audienceTilt`: whom they want viewers to trust, blame, pity, pressure, or contact;
- `protectedInterest`: the money, relationship, face, status, safety, convenience, or self-image they cannot afford to lose;
- `defaultTactic`: their habitual way of controlling the call — charm, precision, grievance, moral pressure, minimization, counter-questioning, over-explanation, or silence;
- `concessionLimit`: the most damaging fact they can admit while still pursuing the preferred answer;
- `painPoints[]`: the concrete topic that threatens the preferred answer, why it hurts, the first defensive reaction, the response after proof, and the minimum fact that may leak.

Write each load-bearing exchange as `baseline voice -> pain-point hit -> audible reaction -> narrowed pressure -> minimum revision`. The first line after a hit must sound different from the caller's baseline; a stage direction alone does not count. Let the character go shorter, colder, faster, unusually detailed, repetitive, flattering, sarcastic, silent, or suddenly formal according to the fixed card and current tactic. Do not give every caller the same ellipsis, stammer, or three-stage confession.

Make emotion alter disclosure without altering truth. The first reaction may deny, grab one word, question the host's right to ask, shrink the amount, change the subject, or defend the immediate result. After evidence closes one escape route, force only the smallest survivable revision. On a second hit, escalate or switch tactic; do not reset to the same generic `……` response. If the body is panicking while the spoken line remains a polished psychological summary, rewrite the spoken line.

Every emotional change must have a traceable cause. Do not make a caller flare up merely because the beat needs drama, and do not make every painful question loud: a controlled person becoming extremely exact or going abruptly quiet can be the stronger rise. The author should be able to state what the question threatened, what reaction protected, and what changed in the next legal question.

Store this author-only map as `callerIntentProfile` when the content format permits it; otherwise map it explicitly into `helpRequest`, `callerStake`, `selfServingOmission`, `deceptionChain`, the character card's `stressResponse`, and the affected scene notes. Never render the map itself as dialogue or recap analysis.

#### Layered Disguise Chain（多层伪装链）

A full-length playable caller normally does not protect the case core with one clean lie and one late confession. Build a chain of **surface versions**: direct falsehood, omission, euphemism, amount-shrinking, beneficiary erasure, agency shift, or a technically true sentence used to imply a false whole. Flagship cases should normally carry 3–5 stages including the opening frame; a short warm call may use fewer. Do not add contradictions merely to meet a count.

Keep one authorially stable `protectedPurpose` behind the chain. Every stage must register:

- `pressureTrigger`: what visible question, consequence, line, or material made the previous version unsafe;
- `surfaceVersion`: what the caller is willing to say at this stage, in language they could actually use;
- `editedFact`: the specific actor, amount, beneficiary, timing, consent, cost, or motive being removed or renamed;
- `immediateUtility`: what this version helps the caller obtain or avoid **right now**;
- `fairTrace`: the earlier word, number, refusal, behavior, or document edge that makes the edit discoverable;
- `playerTest`: the authored action that can press this exact gap;
- `forcedRevision`: the narrower version the caller falls back to after that test;
- `adviceImpact`: how pricing in this layer changes the host's advice, refusal, next action, or risk boundary.

The author's B story must be rigorous even when the caller's A story is not. A caller may contradict themself, forget what they implied, defend one lie with a second half-truth, or reveal only the minimum forced by the current evidence. The writer must still know why each version appears and which fact remains protected. “People are inconsistent” is not a motive.

Run these chain checks before line polish:

1. **Same-purpose test:** every stage protects the same outcome or self-image. A contradiction with a different utility is a separate subplot, not automatically part of the chain.
2. **Pressure-link test:** Stage N+1 exists because Stage N was made unsafe. If the new version could have appeared anywhere, the stages are only a list of twists.
3. **Minimum-concession test:** discovery usually forces the smallest survivable admission, not a villain monologue or a complete case summary. The next layer may narrow scale, rename the benefit, move agency, or concede conduct while disputing responsibility.
4. **Rising-cost test:** each patch should become harder to maintain because the player now holds more visible facts. Do not reset the conversation with an unrelated new secret.
5. **Advice-changing test:** at least two exposed layers in a flagship case must materially change what the host can endorse, refuse, separate, preserve, or leave unknown. Pure credibility damage is not enough.
6. **Human-speech test:** keep the chain in author metadata and scene causality. Do not make the host recite “you first hid A, then B, then C” unless a real person in that moment would need that list.

Store the chain as author-only case metadata when the content format permits it:

```json
{
  "deceptionChain": {
    "owner": "caller",
    "protectedPurpose": "the outcome or self-image every stage protects",
    "stages": [
      {
        "id": "opening-frame",
        "pressureTrigger": "what makes this version appear or fail",
        "surfaceVersion": "what is said now",
        "editedFact": "what is removed, renamed, minimized, or reassigned",
        "immediateUtility": "what this buys now",
        "fairTrace": "what the player could already notice",
        "playerTest": "which question, row, or action tests it",
        "forcedRevision": "the next survivable version",
        "adviceImpact": "what changes once exposed"
      }
    ]
  }
}
```

`deceptionChain` is not player-visible exposition. It is a causal contract for scene order, evidence placement, and revision behavior. If dialogue and this ledger disagree, repair the dialogue or the ledger before generating reading scripts.
When deterministic validation is available, make every `playerTest` name an existing scene, document, row question, or deep-followup beat, and pin at least one spoken anchor from each `forcedRevision`. A beautifully filled ledger that is not reachable in the playable script is a shadow asset.

#### Whole-Account Revision and Overnight Evidence Review（整套改口与跨夜整理律）

逆转式递进不是主播逐句把来电人驳倒，也不是来电人每被问一句就补一块补丁。主案的高潮单位是两套围绕**同一事件、同一物件和同一现实诉求**的完整叙述：第一套 A 被玩家打穿以后，来电人为了保住原来的利益和自我形象，带着情绪重新夺回话语权，连续讲完一套新的 A′；玩家再从 A′ 里找到新的承重谎言，把案件推到 B。

把局部改口和整幕改口分开：

- **局部改口**发生在普通 PRESS 或追问里，只允许澄清称呼、缩小范围、承认一个最小事实或把一句话说得更硬。它可以积累 A 的裂缝，但不能一问一答地提前拼出 A′。
- **整幕改口**只发生在若干裂缝已经可见、玩家用第一次决定性 PRESENT 打穿 A 的共同承重框架之后。它必须重新解释前面那一组事实，不能靠另抛警察、私生子、第三个账户或其他新秘密换题。

第一幕 A 的合同：

1. A 由四至六句可连续听懂的陈述组成，共享一个自利因果框架；玩家第一次听时先完整听完，再进入逐句 PRESS / PRESENT。
2. 普通 PRESS 用来让人物补细节、坚持措辞、暴露闪躲或交出最小承认。主播可以追问，但不在每句后宣布“这句不成立”。
3. 第一幕可以暴露两处以上小矛盾或删减；它们共同增加压力。只有决定性 PRESENT 负责打断 A 的承重柱，并触发整套重述。

A → A′ 的接缝合同：

1. 命中后先让来电人出现人物特有的情绪变化：抢话、反问、发冷、变得异常精确、迁怒主播或短暂失语。舞台差分不能代替口播变化。
2. 来电人可以说“行，那我从头说”一类夺回解释权的话，随后连续交付 A′。主播不得在 A′ 说完以前插入结论或逐条反驳。
3. A′ 讲完后，主播只接一条短授权，例如“好，按你刚才这版来问”。此时禁止说“两版不能同时成立”或列举来电人已经改过哪几次；那会替玩家提前解题。

第二幕 A′ 的合同：

1. A′ 通常由三至四句组成，必须承认第一幕已经钉死的事实，同时用新的动机、主语、责任分配、覆盖范围或先后顺序重讲**同一事件**。
2. A′ 必须形成一套暂时自洽的完整因果，不是把 A 的每一句分别修补。删掉其中的新承重句后，其余句应仍能看出这个人正在讲哪一版故事；换成另一案件的名词仍成立，视为模板失败。
3. 进入第二幕时，先按顺序完整播放 A′ 一次，再把同一组原句铺成证词墙。`openerLines` 只承担情绪接缝和“从头重说”，不替 `statements` 摘要答案。
4. A′ 的普通 PRESS 继续扩写或加固这套说法，不得泄露正确材料、替玩家指出新承重句，或当场把它驳倒。第二次决定性 PRESENT 才负责击穿 A′。
5. 第二次命中后的来电人交付破碎承认、否认失败或一句最低限度的新事实，不能忽然冷静地替作者朗读 `boundaryLine`。完整证明边界由主播短句、材料板和内部合同分别承担。
6. 主播可以在第二次命中后强硬点名反复改口，例如“你前面这么说，材料出来又换了一套。再这么聊，这通电话没法往下走”。火力必须落在已经证明的原话和改口行为上，不得扩大成人格、性别、职业或求助资格羞辱。

跨夜整理不是第二场审讯，也不是顾问口播清单。第一夜收麦后到第二夜接通前，玩家可以把第一夜已经听见的**原话和材料一项一项摆出来**，形成第二夜能带回麦上的问题：

1. 一次只处理一张原话卡、一个材料行、一个日期差或一个缺栏。先回放原句，再让玩家圈行、并排、排序或决定是否带回；处理完才进入下一项。
2. 每项只产生一种清楚状态：`已经确认`、`仍需追问`、`材料够不到`，或获得一个明确的 `earnedItemId`。不得让人物把三项结果压成“审批、付款、到账都要核”一类工作汇报。
3. 整理阶段只能准备对 A 的追问、保存玩家已经获得的事实和塑造一个具体开放边，不能预知来电人第二夜会怎样编 A′，也不能自动替玩家完成下一次 PRESENT。
4. 顾问若参与，一次只回答本职范围内的一件事；主播或赵律师不得把所有证据、诉讼动作和未知项一次列完。完整清单留在材料板或内部账本，角色口播只拿起眼前这一项。
5. 每个带回物必须改变第二夜的一处实际开口、可选材料或可问范围。只增加“整理完成”提示、没有改变回拨内容的项目应删除。
6. 整理界面使用第一夜的原句和真实物件，不使用“疑点一／责任二／核心矛盾”这类作者标签。玩家是在回忆自己听过什么、准备下一通电话，不是在看案件答案目录。

跨夜最小循环：`第一夜完整听见 A 的公开版本并留下可疑措辞 -> 收麦后逐项整理第一夜原话与材料 -> 第二夜用带回物把 A 问实 -> 玩家通过 PRESS 累积裂缝并用第一次决定性 PRESENT 打穿 A -> 来电人失控后连续讲完整套 A′ -> 玩家重新 PRESS / PRESENT -> 第二次命中 -> B 与行动边界`。第一夜可以有普通材料命中和局部改口，但不要提前交付整套 A′；如果白天整理已经宣布 A′ 为什么错，第二夜就只剩走流程。

### Expansion Playbook (把 10 分钟做成 20 分钟)

Nine expansion methods, ordered by cost. Every added minute must carry an A/B conversion, a value turn, or a live hypothesis — an added minute that carries none is prose bulk wearing a mechanic. Never expand by adding a second live caller.

Content-only (no engine work):

1. **Authored press layer** (from Ace Attorney's press-any-statement design: pressing is never punished, rewards the curious, and occasionally shakes loose real texture). Give each scene 2-3 authored 随意提问 questions — background, feelings, the other party's habits — written separately from key options, never recycled from them. Pressing yields characterization and guard shifts, not contradictions. Curious players roughly double their dialogue time; the main path stays untouched. This is depth-on-demand, the safest minutes in the game.
2. **In-call act structure** (from TV act craft: every act is a mini-arc and every act break is a hook). Group 5-6 beats into 2-3 mini-acts. Each act ends on an open hook — a withheld object, a half-question, a friend's silence — and each act break is where a material board or backflow item wants to sit. A beat may not end an act on closure.
3. **Intensity alternation with one legal breather** (from TV pacing: high-intensity scenes reveal, low-intensity scenes let the audience process). One low-intensity beat per act — the caller catching her breath, a lighter crowd exchange — is legitimate content that makes the next reveal land harder. Maximum one per act; two breathers in a row is sag.

Small engine (one field plus render):

4. **Evidence reaction lines** (`evidenceChecks[].options[].reactionLine`): the caller answers the player's mark in voice. Turns each board pick into a dramatic beat. (Contracted in drama pass 3.)
5. **Whole-account testimony revision** (the strongest AA borrow). Several presses may expose cracks, but the first decisive hit collapses the shared frame; the caller then restates the same event as one coherent A′ of 3-4 statements with a new load-bearing explanation. Play A′ through once before reopening the wall. Do not patch only 1-2 isolated sentences or let the host rebut each line as it arrives. The player earns the second reversal by comparing two complete accounts. +2-3 minutes per case, and it converts confession-driven reveals into detection-driven ones.
6. **Mid-call material anchoring** (`evidenceChecks[].afterScene`): alternate testimony segments and material segments instead of all-scenes-then-board — AA's trial rhythm. Expands play through rhythm, and it is the structural fix for boards being an epilogue instead of a turning weapon.
7. **Multi-mark boards** (`marksRequired: 2`): one rich material, two or three required marks in sequence — 先圈时间列，再圈用途行. Each mark gets its own feedback and reaction line. Doubles the time a board carries without adding a board.

Larger engine (new interaction, design first):

8. **Timeline assembly**: order 4-5 dated events (断缴 → 分期开通 → 借钱 → 催款). Native to this pack's 时间诡计 load-bearing layer — the case's whole trick made into a hands-on beat. One-shot like the boundary sort; misses count at the finale.
9. **Live-room B-runner** (from TV A/B/C story ratios — roughly 9 main beats to 2-3 runner beats, and the runner resolves before the A-story climax): 2-3 interruption micro-beats inside the live room itself — a 黑粉 thread the host must answer once, a platform warning strip. The runner must stay host-versus-room diegesis; it never becomes a second case party and never violates the single-caller contract. Resolve it before the final quote-pick so the ending belongs to the A story.

Budget sketch for a 20-minute case: base linear call ~10 minutes; authored press layer +2-3 (opt-in); testimony revision +2-3; mid-call board rhythm +1-2; multi-mark or timeline +1-2; act hooks and breather pacing make the same minutes feel fuller rather than longer. Prefer methods 1-5 before 6-9; prefer any of them over longer answers.

### Integrated Writing Loop

1. Write the unified story packet before touching UI fields.
   - `helpRequest`: `explanation` or `interest`, plus the one-sentence help the caller openly seeks.
   - `whyTonight`: why the call happens now.
   - `relationshipStage`: why this call happens today.
   - `pressurePoint`: what family, money, status, timing, platform, or relationship pressure creates the call.
   - `dramaticAnchor`: the concrete object, quote, screenshot, proof, bill, agreement, table, or transfer record that makes the live room argue.
   - `objectPurpose`: what the object is trying to prove, soften, excuse, delay, or force.
   - `callerStake`: what the caller gains by telling it this way and what they are hiding, softening, or afraid to admit.
   - `callerIntentProfile`: the caller's open goal, preferred answer, audience tilt, protected interest, default tactic, concession limit, and pain-point reactions for this call.
   - `deceptionChain`: for a full case, the staged surface versions that protect one purpose, including each trigger, edit, fair trace, player test, forced revision, and advice impact.
   - `otherStake`: what the other party gains by showing/hiding/wording things this way and what they would lose if fully exposed.
   - `thirdPressure`: parent, friend, platform, ex, family role, or public image pressure if it exists.
   - `truthBoundary`: which parts are real, which are edited, and which remain unknown.
   - `quotePickCandidates`: 3 short lines the player could later press and argue about.
   - `finalQuestion`: what the audience should argue about after the case, not a lesson.

2. Write the stitched transcript.
   - Opening must make the connection and the practical request audible in a normal caller-host exchange.
   - Opening should be stair-stepped, not bundled. After the caller states why they called, the host asks the most urgent missing fact created by that line. Relationship source, current stage, amount, deadline, and material origin enter only when the immediately previous answer makes them relevant; never run a fixed intake questionnaire.
   - Then write each scene beat as `caller statement -> one host option chosen -> caller feedback -> next caller statement`.
   - Then write the full-hit deep question as `host deep question -> caller answer`. This is not a choice set and only appears when every core node was hit.
   - Place the best quote-pick line late enough that it feels earned. Early dialogue may contain bait lines, but it should not state the full answer.
   - Read it aloud as one phone call before splitting it into `openingDialogue`, `sceneVersions`, `questionOptions`, `deepFollowup`, and final quote-pick choices.
   - While reading, run the coupling questions: does Scene 4's number get seeded by Scene 1? Does Scene 3's turn follow Scene 2's emotion? If a beat could be removed with nothing breaking, merge it or give it a missing edge.
   - Pickup audit (接话头): for every turn, name the exact word, question, or claim from the previous turn that it picks up — or the visible dodge it performs. A turn that could follow any previous line equally well connects to none; rewrite it around one word from the turn before it.
   - Voice audit: check each caller turn against the packet's `callerVoice` fingerprint — filler, sentence habit, name for the other party, shutdown topic — and check that guard state tightens the fingerprint instead of replacing it.
   - Pain-point audit: for every load-bearing question, compare the caller's line immediately before and after it. Confirm that the hit threatens a registered interest, produces an audible character-specific change, and yields no more than the minimum fact current evidence can force.

3. Only then split into data fields.
   - Each UI field must be traceable back to the story packet.
   - No field may introduce a motive, fact, object, or conclusion that did not appear in the stitched transcript.
   - An outer branch can reveal less, but it must still point at the same case core. Do not use generic emotional outer angles such as "do you still like them" unless the case core is actually emotional attachment.
   - Quote-pick choices must be copied from disclosed lines or compressed from disclosed lines. They are not labels for hidden conclusions.
   - For every committed node, preserve all three layers: `sourceAnchor` is the exact phrase the player holds in replay; `question` is what the player-character actually says; `suspicionLabel` is only an editor/search index. Read the original statement and the following question-answer exchange aloud before shipping it.
   - Mark the one core reversal with `revealTransition`, then replay the miss and detour routes to confirm that the impact beat cannot fire before that direction is selected and cannot repeat on ordinary hits.

4. After any line edit, rerun local coherence.
   - Ask: whose face, money, status, safety, or convenience does this sentence protect?
   - Ask: did this sentence change who pushed the dramatic object into the call?
   - Ask: did this sentence make an earlier option or later conclusion incoherent?
   - Read the next reply for accidental agreement. After 「行不行／可不可以／该不该」, a bare 「行／可以／好」 sounds like the host has already ruled, even when the following sentence intends only to continue the interview. Delete the ambiguous acknowledgment or replace it with the next concrete question.
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
  "helpRequest": { "kind": "explanation|interest", "request": "" },
  "whyTonight": "",
  "relationshipStage": "",
  "pressurePoint": "",
  "dramaticAnchor": "",
  "objectPurpose": "",
  "callerStake": "",
  "callerIntentProfile": {
    "openGoal": "",
    "preferredAnswer": "",
    "audienceTilt": "",
    "protectedInterest": "",
    "defaultTactic": "",
    "concessionLimit": "",
    "painPoints": [
      {
        "topic": "",
        "threatens": "",
        "firstResponse": "",
        "afterProof": "",
        "minimumLeak": ""
      }
    ]
  },
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

## P0 Case Data Requirements

Every daily case must have a clear request, present-tense pressure, conflict object, benefit structure, and truth boundary. The fields below are the preferred authoring map; conditional fields stay empty rather than being filled with invented drama:
- `helpRequest`: either an explanation request or an interest request that the opening exchange makes audible.
- `whyTonight`: why the caller phones in today, not last week or next month.
- `objectPurpose`: why the screenshot, proof, bill, contract, voice note, table, or chat log exists in the relationship.
- `callerBenefit`: what the caller gains by telling the story this way.
- `callerIntentProfile` or an explicit equivalent: what answer the caller wants, which interest they protect, how they normally steer the call, and how each load-bearing pain point changes their spoken behavior.
- `otherBenefit`: what the other party gains by showing, cropping, delaying, wording, or hiding something.
- `thirdPressure`: when a real third force changes the decision, name whose mouth or expectation is being borrowed: parents, friends, platform, ex, matchmaker, boss, money deadline, public image. Do not add one only to widen the cast.
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
- Do not confuse “not a perfect narrator” with “must deserve some blame”. A caller may omit, misread, freeze, delay, or protect face; they may also be substantially truthful and harmed. Register only the agency and edits supported by the case facts. Never plant greed, vanity, or complicity to force symmetry.
- The caller's core omission must change the answer to `helpRequest`. If it only makes them look slightly worse while the same advice still follows, it is not the case's hidden center.
- A sympathetic line may stay sympathetic. If the case already establishes a benefit, face concern, convenience, or fear that affected the caller's choices, let it surface in the local chain; otherwise do not invent one.
- The other party needs a human incentive or defense, not an exculpatory speech. A person can knowingly manipulate while still having an intelligible motive; intelligible is not innocent.
- Before the evidence closes, the host peels rather than sentences. After the evidence closes, he may state the confirmed behavior and responsibility plainly. He does not pronounce legal guilt, invent motive, or soften a proven act into “both sides”.

## P1 Call Loop and Reveal Rules

材料检视必须是可玩的剧情拍，不是提示面板。正确选择要增加矛盾且不扣耐心，判断由当前主播以署名台词说出，不显示“圈中了／先问这一处”等无署名判卷卡。错误选择可以扣耐心，但不能泄露正确答案：主播只说“这条先放着”一类收住话头的短句，不播放该选项的 `feedback`、`reactionLine` 或 `revisedVersion`。路线图把它记为材料动作，不伪装成第六段对话。

Host investigation and evidence backflow may expand the reasoning range, but only after the player has already heard the relevant contradiction. Treat these as a controlled extension of the material system: backstage verification, post-call direct messages, or limited off-mic inquiries can add fixed materials, not freeform facts. They must never turn into open-world investigation, AI-generated evidence, or a second-party live debate. Every backflow item must state why it appears now, which heard contradiction it relates to, what it proves, and what it still cannot prove.

Use an "Ace Attorney-style reveal" only when the host asks a natural question the caller has already made possible. The reveal should answer a practical why:
- Why did this person need a bank flow instead of a balance screenshot?
- Why did this proof appear before the meal, meeting, transfer, cohabitation, or family talk?
- What later arrangement, money ask, face-saving need, or deadline was hiding behind the innocent wording?

The reveal must add a new disclosed fact, not a narrator lesson. After the reveal, update the final quote-pick and share copy around that fact.

For ordinary live-call nodes, use the following linear call loop. A testimony-wall act is the exception: first play the act's complete A or A′ without interruption, then let the player PRESS / PRESENT individual statements under the whole-account revision contract above.

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

## P2 Dialogue Rewrite Rules

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
- Caller speaks first and gives only enough relationship context to make the request intelligible.
- Host asks a neutral continuation question.
- **自然接通税**：每通电话的第一句都要让“人已经接进直播间”成立。可以用「主播你好」「我想咨询个事」「想找你帮我分析一下」或符合该人物声口的同类短句，再进入金额、文件或眼前动作。禁止为了制造冲击直接用「八万」「二十八万八」「工作群输入框」起句；这会像剪掉了电话开头。接通句不是案情摘要，一句里仍只能承担一个主要问题。
- Conversational Phrasing Rules (直播连线拟真话语权与对话承接规范):
  - Do not use abrupt, clinical, or command-style speech for the host or caller. It must feel like a real phone-in talk show, not a rigid script or a police interrogation.
  - **Caller openings must be conversational and progressive**: Instead of keyword-heavy statements like `“我们谈了半年，之前约会一直挺体面。前几天他突然说信用卡要周转...”` (abrupt and robotic), write it with natural spoken transitions: `“我们谈了半年多，平时约会消费什么的都挺体面的，我也没觉得有什么问题。结果前几天他突然跟我说信用卡需要周转，想让我先帮他顶一下。”` (colloquial, natural pace).
  - **Host transitions must be warm and inquiry-based**: Instead of abrupt commands like `“先说第一次提钱，他原话怎么讲？”` (sounds like an interrogator), write it as an empathetic inquiry: `“晚上好。我想问一下，他提钱的时候，原话是怎么讲的？”` (natural hosting transition).
  - Avoid any Host or Caller lines that sound like system placeholders or prompt labels.
  - **同节奏、不同措辞**：同一档热线里的来电可以共享正常的接线节奏，例如「问候／确认在线 → 主播请讲 → 来电人说明来意」。差别应来自人物会不会客气、会不会犹豫、用什么词称呼自己的事，而不是每案强造一种“独特开场能量”。四案一字不差、只替换案情名词，判模板化；为了躲模板而硬写正在按确认键、突然甩文件或谜语式冷开场，也判失败。交付前把四案首轮并排朗读：节奏可以相近，句子必须像四个人各自正常开口。
- Do not pack relationship source, relationship stage, family reaction, suspicious material, and caller doubt into the first caller line. One possible split for a relationship-stage call is:
  - caller: call reason only
  - host: how did you meet / where has it progressed
  - caller: relationship source + current stage
  - host: what exactly happened at that stage
  - caller: trigger material / quote / pressure point
- **Opening turn information budget**: a caller's first turn may do one job only: ask for help, name the amount, report the other person's reaction, or ask for a concrete decision. If one turn contains three or more of these jobs, split it into at least two or three alternating host-caller exchanges. The host asks for one missing piece at a time; the caller adds one layer at a time. Sentence pagination does not satisfy this rule: breaking an information dump into several bubbles without giving the other person a chance to respond is still an information dump.
- **紧急动作只在真的发生时闭环**：只有来电人此刻确实停在转账、删除、公开材料或拨号页面，主播才先叫停，来电人下一句只确认已经停下。不能为了制造开场钩子，把已经退出的页面改写成正在按确认键。没有即时危险时，按普通咨询电话接线，让来电人先说来意。
- **前十句不是案情压缩器，也不是行数配额**：逐句交替不等于节奏自然，但也不要为了把金额硬拖到第十一句而增写动作戏。关系、用途、金额、期限可以在正常追问中依次出现；判断标准是每一问都承接上一答，中间有人类会有的确认、迟疑或态度，而不是某个字段必须落在第几句。
- **开场前十句冷读门禁**：审核时不要只看 `openingDialogue[0..1]`。从第一句人物口播开始，连同首场 `beforeVersion / version` 往后取满十个实际播放话轮，去掉标题、字段名和作者说明，单独朗读。十句内应让接通成立、让主播接住来意、让问题逐层具体；不能从第二句起机械执行“金额／原话／意愿／时长／同住”的登记表。主播前四次开口必须各自由紧邻上一答产生，至少一次是正常确认或回应，而不只是抽取新字段。十句结束时，新听众应知道谁为什么打来，但不应已经听完隐藏用途和最终判断。任何一项不成立，整段重排，不做逐句润色。
- **开场阶梯按眼前缺口走，不按固定问卷走**：来电人说「男朋友找我借钱」以后，最自然的下一问可能是「借多少」，不是一律先问怎么认识、交往多久；金额出来以后再问转没转，施压方式出来以后再问她今天想要什么。关系时长、同住情况和材料来源在它们真正变得必要时进入。判断标准是上一答是否让下一问成为现场最想问的那一句，而不是模板字段是否已经填满。
- **求助问句不许被主播提前批准**：当来电人用「行不行／可不可以／我该不该」索取决定，而事实尚未展开，主播不要用「行」「可以」「你没错」接话。直接追问一个会改变答案的事实，例如交往多久、钱由谁欠、是否已经转出。主播可以晚些给明确立场，但不能在开场用口头应答词无意中替玩家和证据下结论。
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
- Buttons should feel like a live call: "继续听", "把刚才那段拉回来", and "重新听这段". Source-line rows carry the actual words already spoken; do not add a second abstract choice label beside them.
- Avoid mechanical labels: "阶段判断", "资料核验", "通话回放", "内容提示".
- In daily cases, avoid "接哪边的麦", "让另一方补话", or any copy implying two-sided mediation.
- Case-specific summary buttons should reflect the case: screenshot source, missing edge, evasive wording, timing, party switch.
- Investigation copy should sound like live-room backflow, not task UI. Prefer "后台进来一条私信", "有人补了一张图", "这页刚翻出来", or "对方没上麦，只留了这句". Avoid "new clue unlocked", "verification succeeded", "evidence chain complete", "correct route", or any copy that tells the player the system has found the answer.
- Choice-panel helper notes must pass the rule-clarity test before the read-aloud test. Dressing a rule explanation in stream slang is still a rule explanation — "这段只能定一次。问偏了，弹幕会散。" fails the same way "问偏会掉耐心" does. The statement/replay/interrupt surfaces must explain themselves through layout, `MIC / REC / LINE`, portrait focus, and the direct source-line affordance; do not add prose that tells the player what the button will become.

## P1 Clue Insertion Techniques

Clues must be embedded so the player earns the discovery. Never let a character state the lie directly; let it leak through weakness, guard, or accident. Every technique below is fair-play only if the leaked detail is on screen and can be traced back at recap.

Verbal clues (in the caller's retelling or quoted lines):
- Cognitive-dissonance slip: the caller or quoted party says half a truth, then scrambles to re-wrap it. 「我当时只是想，既然他工资卡交给我……啊不是，我的意思是，以后一起过日子，钱合着管比较好……」 The slip must be small, human, and recoverable — one per case at most.
- Euphemism downgrade: vocabulary drops from packaged to raw as pressure rises. Early: 「他在做一个周转」. Under pressure: 「我哪知道那是拆东墙补西墙啊」. Plan the word pair in the story packet so the downgrade lands as a beat, not an accident.
- Pronominal shift: the caller's label for the other party tracks their心理防线: 「我男朋友」 (opening, defended) → 「他」 (doubt) → 「那个人 / 对方」 (cut). Do not force the full chain into every case; even one visible shift late in the call reads loudly. Keep recap wording consistent with wherever the chain ended.
- Agency laundering (春秋笔法): when the case turns on who initiated an action, plant that bias in the early verb — 「他带我去的那种店」 when the reservation was on her member account, 「我妈想看流水」 when she forwarded the screenshot herself — and later expose the true subject through a material or answer. Cases that turn on amount, timing, consent, or coverage do not need a laundered verb; they still need an equally fair early trace for their own axis.
- Beneficiary omission (受益人省略): a material may show a real expense without identifying who benefited — for example, a bank statement shows `03-09 / 05-09 · 房租 ¥10,000` after the caller has already established that the couple lives apart. The host must not invent a dedicated spoken setup such as 「还有别的固定钱吗」 merely to deliver this clue. Let the object and amount first appear on the material surface, then offer an optional player question about owner, recipient or beneficiary. The answer may reveal that the recurring rent was for the caller's home and paid in addition to a fixed transfer. Do not expose that beneficiary in fixed narration, mandatory recap, helper copy, or an earlier answer and then pretend the player discovered it. If the clue is optional, route-independent closing copy must remain valid even when the player never asked it.

Physical clues (materials on the board):
- Accidental attachment: the material enters the call through a believable slip — 发错表、多选了一张图、转发时带上了上一条. The sender's intended message and the accidental payload should both be nameable.
- Intentional crop: the material is real but cut where cost or responsibility lives — 审批图裁掉付款回执、账单只截上半页、聊天记录从第二句开始. The crop line itself is the clue; the evidence check should let the player mark the missing edge, not the visible content.
- Metadata discrepancy: timestamps, battery/signal bars, weekday vs claimed context, background details that contradict the story. Use sparingly, and only when the discrepancy is markable in the material board (an `evidenceChecks` option), not prose-only trivia.
- Audio tells (听觉线索, voice-call native): the microphone carries clues the caller did not choose to send — typing sounds while claiming to be off work, a second voice in the background, the echo of an emptied apartment, a lighter clicking during a "我早戒了". Fair-play rules: the sound must be authored into the scene (the crowd or host may notice it — 「刚才背景音里是不是有人翻东西」), the crowd may only report what it heard and never interpret it into a verdict, and per the two-source rule an audio tell alone convicts nothing — it needs the caller's acknowledgment or a material to corroborate. On voice calls this is the only clue channel the crowd owns outright; use it to make the room feel like a thousand ears.

Placement rules:
- A physical clue's flaw should read as a common life mistake, not a puzzle-maker's plant.
- Each material clue must revalue at least one earlier spoken line (couple it via the coupling-review `revalues` field).
- New physical details invented for a technique must be added to `truthBoundary` and the pack QA report — a clue that exists only in one answer string will drift.

## P1/P2 Callbacks, Guard Continuity, and Guarded Answers

Casual seeds: early beats must contain 1-2 details that sound like atmosphere — a晒朋友圈的纪念日晚餐, a mentioned deadline, an offhand nickname — which later materials, DMs, or the deep question recontextualize into load-bearing facts. A case where every early line is obviously important has no reveal left.

Cross-beat verification: the core contradiction should never rest on one beat. It is assembled from an earlier statement + a later material edge + a side confirmation (backflow DM, quoted line). When rewriting any one leg, re-check the other two.

Guard continuity: the caller's guard state moves with the player's questioning, organically and in one direction at a time:
- Hitting a core gap early makes later answers slightly defensive — shorter sentences, one withheld specific, a deflection to feelings.
- Drifting on outer questions keeps the caller relaxed and self-assured — until the final quote-pick confronts them, where the dissonance should be audible.

Guarded answers are not bonus confessions. A `guardedAnswer` must withhold: fewer specifics, hedging, subject changes, a half-answer that still contains the beat's contradiction but with less texture. It must never pre-spend the deepFollowup confession, the recap conclusion, or the final quote payoff. If the normal answer names three details, the guarded answer names one and resists the other two.

- **防备回答要换策略，不只删字**：普通回答承认事实时，`guardedAnswer` 不能只是删掉数字和例子后留下同一个标准答案。让人物按人设选择反问、缩小范围、抓住措辞、转向眼前损失或只承认无法再否认的一层；下一轮追问再逼出下一层。
- **高压失稳不能四案同模**：不要把所有被戳穿都写成统一的“短否认→自我修正→完整坦白”。爱体面的人会改口保脸，防御强的人会反咬问题，精确型人物会把范围越说越窄，职场新人会先复述流程再漏出害怕。失稳方式必须来自人物长期声线。
- **一轮只塌一层**：证据出现后的第一反应最多交出一个新事实或一个防守动作。若一句话同时交代事实、动机、心理总结和证据边界，应拆给相邻追问、沉默或主播；来电人不能替作者把自己分析完。

当事人的“防御闪躲”与推诿话术机制 (Evasion & Deflection Mechanics):
当承认会让连线人失去钱、关系、体面、安全或公开版本时，第一反应通常应保护这项利益，而不是替作者爽快交代。下面三种是候选策略，不是每案清单；证据已经封死、人物本就直率，或承认成本很低时，可以直接认：
1.  **打感情/道德牌 (The Emotional Shield)**：用感情深度或无辜动机转移视线。`“我们平时感情一直挺好的，他真不是那种人，可能就是一时想岔了……”` 或 `“我只是怕他走弯路，我有什么错呢？”`。
2.  **责任分担/借口盾牌 (The Excuse Shield)**：将责任转嫁给客观环境或第三方。`“这也是我妈非要问的，我其实无所谓的，我也就是顺口替家里问了一句……”`（案3）或 `“这都是因为公司流程太死板，当时要是不垫，答谢会就砸了……”`（案4）。
3.  **强行转移焦点 (Focus Shifting)**：将对“事实”的追问引向“解决当下急迫问题”。`“现在最低还款日期马上到了是事实，我们不该先想办法把钱转过去吗？纠结他从哪天开始失业有什么意义？”`（案1）。

### P3 可选：弹幕舆论的极化与反转

弹幕可以用“极化 → 起疑 → 反转/争吵”放大一条已经成立的情绪曲线，但不承担主线披露，也不要求每案完整走一遍：
*   **开场极化期 (Initial Polarization)**：弹幕水友根据来电人的一面之词，迅速站队并情绪化声讨另一方。`“渣男，妥妥的软饭硬吃！”` / `“心疼小姐姐，赶紧分！”`。
*   **中段起疑期 (The Seeds of Doubt)**：随着材料展示或言语纰漏被指出，部分敏锐的水友开始察觉不对，风向出现分化。`“等等，那套一万二的设备不是在她屋里摆着吗？”` / `“这理发师备注里写的‘能投店’是啥意思？”`。
*   **尾声反转/交锋期 (The Revaluation / Clash)**：新信息出现后，有人改口，有人嘴硬，也可以没人接话。不要为了“阵营对等”硬写双方一样有理，更不要让弹幕替证据判案。

只有路线选择确实改变观众所听信息时，才写路线化评论；没有变化就省略。评论删掉以后，人物攻防和玩家发现必须照常成立。

## P2 De-AI & Anti-Robotic Scripting Guide

AI 或机械化剧本编写容易引入特定的“非人类思路”模板。Codex 在重构或审查时，必须对照以下三维坐标，彻底消除非人类逻辑缺陷，并向编写者提出针对性建议：

### 1. 剧情与逻辑层面的“非人类思路”
*   **A. 顿悟式信息跃迁 (The Telepathic Leap)**
    *   *机械表现*：仅凭一个孤立微弱的线索（如看到理发店排班表发错），Host 或 Caller 瞬间推理出对方的庞大心机或商业阴谋。
    *   *人类思路*：线索仅引出一个“切实的疑点”（如“备注栏不像剪头”）。必须通过后续对话的拉扯、第二块物证对比、或者是下播私信的证据拼图，最后在 Quote-pick 阶段由玩家自己提炼出最终结论。
*   **B. 扁平善恶与强行端水 (The Cartoon Villain / Forced Symmetry Trap)**
    *   *机械表现*：一方只负责受苦，另一方只负责作恶；或为了显得复杂，作者临时给受害方安一条贪心，把两边写成一样坏。
    *   *人类思路*：分别写清利益、选择、能力与代价。来电人可以有自利删减，也可以只是误判、害怕或没反应过来；另一方可以有可理解的动机，但动机不抵消操控和伤害。责任允许不对称。
    *   *执行要求*：只登记事实支持的 omission。若它不改变建议，不把它抬成反转；若没有 caller omission，把侦探核心放在材料、对方版本或制度缺口上。
*   **C. 判决书/心理学报告式的 Host 选项 (The Clinical Judge Trap)**
    *   *机械表现*：Host 给出充满大词和定性的抽象选项（如 `“他是在进行债务转移”`、`“这属于职场霸凌”`、`“你需要运用法律武器”`）。
    *   *人类思路*：Host 讲的是人话，是直播间老水友的日常交流话术。Host 的追问应该是具体行为的撕开点（如 `“那你当时就没问问他，这笔钱到底花哪去了？”`、`“所以这顿大餐，你当时也吃得挺高兴的对吧？”`）。
*   **D. 平淡无奇的说明文剧情 (The Flat Narrative Trap)**
    *   *机械表现*：剧情线索单一，一眼望底；案件只有平铺直叙的交代，毫无剧场性冲突。
    *   *人类思路*：从下列剧情能力中选择真正服务本案主线的组合。至少要有递进披露和一项玩家可验证的矛盾；不要为了凑类型同时塞满所有机制：
        1.  **引人入胜（信息绝不说全）**：开局隐去核心症结，仅留局部反常，真相如同剥洋葱般，由玩家操作层层剥开至最后一幕。
        2.  **罗生门（叙述经过修剪）**：某个叙述者只说对自己有利的部分，材料或另一来源暴露被删掉的主语、金额、时间或利益。修剪者不固定为 Caller，也不预设其贪心或违规。
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
2.  **一口气朗读测试 (The Read-Aloud Test)**：所有翻译或重写的 JSON 台词都要按真人电话朗读。句长由人物状态决定；听众会丢失主语、动作或时间线时就拆，人物正在失控絮叨且承接清楚时可以保留长句。
3.  **利益归属审查 (Stake Alignment Review)**：每一句台词，Codex 都必须回答一个问题：*“咨询者说出这句话，是在极力粉饰他自己的什么诉求？或者保护他什么面子？”* 如果一句话仅仅是为了给玩家交代背景事实而存在，那就是“非人类思路的说明书”，必须废除或融合。
4.  **开场十句盲听测试 (Opening Ten-Turn Blind Read)**：复制实际播放的前十个口播话轮；`openingDialogue` 不足十句时，继续取首场 `beforeVersion / version`，不准用标题卡、`openingComplaint` 或作者元数据补语境。逐句标出 `接通 / 接住 / 新事实 / 求助收窄 / 首个必要追问`。若首句同时报关系、金额、道德防守和情绪，或主播前四次开口只是轮流抽取金额、原话、意愿、时长、同住等字段，即判失败。合格结果应让陌生听众在第十句前说清“谁卡在什么眼前动作上、为什么打来”，同时仍不知道本案的隐藏删减和最终判断。
5.  **开场同节奏异措辞测试 (Shared Rhythm, Distinct Wording)**：把同一包的来电首轮并排读。允许它们都按正常热线的节奏完成「问候或确认在线 → 主播请讲 → 来电人说来意」，不必为了差异强造事故现场。检查差别是否来自人物声口、迟疑方式和用词；若只是复制同一句再替换案情名词，判模板化。再检查每个主播追问是否承接紧邻上一答；若为了凑“前十句不报金额”之类配额增写无事实依据的紧急动作，同样判失败。

## P3 Diegetic Comment Hints（可选氛围）

Comments are optional crowd noise first, hints second. A scene does not need comments to prove it is a livestream. When used, they must never sound like a tutorial, name a clickable region before the player's first attempt, or use system voice ("快去点击社保截图" is banned).

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
Portrait art is canonically the host's mind's-eye rendering of a voice. The current warm pixel-art, three-quarter-profile standard (`docs/pixel-art-transition-and-portrait-direction.md`) makes that rule visible; art acceptance includes the anonymity check.

## P1 Advisor NPCs and Off-Mic Surfaces

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
- Evidence delegation is optional and limited to at most one per case. Use it only when matching the material to a professional domain is itself a deduction and the reply adds a new authored fact. If the player can perform the same date sort, addition, or source comparison on screen, let the player do it; do not outsource the detective verb to an advisor.
- **角色出场税**：每个具名顾问或场外 NPC 出场前，必须提供至少一项不可替代的东西：本职才能给出的新事实或边界、玩家不能自行完成的方法，或会在后续产生人物关系后果的选择。删掉此人后，若材料、玩家动作和第二夜开场都不变，就删掉该角色。禁止在幕间与白天让同一顾问重复做一次同样的日期排序或材料归纳；两位专家只是换词同意，也不构成冲突。
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
- Separate the permanent card from the temporary call motive. The same proud person may charm when seeking endorsement, become precise when protecting money, and turn cold when face is threatened; those variations must still share the card's rhythm, vocabulary, defense, and knowledge boundary. For every pain-point exchange, verify `baseline -> trigger -> reaction -> minimum concession`; if the post-hit line could be moved under another question or spoken by another caller unchanged, the reaction is not designed yet.
- Run the role-swap test: hide names and swap a line with another speaker in the same case. If it still reads naturally without changing syntax or defense, rewrite it. At least one of rhythm, action, or omission must identify the speaker; do not merely paste a catchphrase onto generic exposition.
- Every named off-mic voice (friend, cousin, store manager, team lead, introducer, the other woman) gets a three-line stance card before it speaks: 立场 (what it wants the room to believe), 遮掩 (what it hides or softens), 利益 (what it gains from its version). A voice that exists only to confirm the mainline is a prop — cut it or arm it. Two victims who want different things (说法 vs 止损) are drama; two witnesses who agree are furniture. Stance cards feed the sensor contract audit: what the voice knows must fit its life, and what it says must serve its stake.
- After editing dialogue, run `npm run content:dialogue-report`. Review one character vertically across phases and then one scene horizontally across speakers. The generated rhythm warnings are reading prompts, not automatic rewrite orders; the forbidden-template and attribution failures are hard errors.

The host is a person (design: `docs/host-character-design.md`):
- **Player embodiment is first-person action, not proxy control.** In content truth, `你` and the default host 林旭阳 are the same person. Runtime dialogue bubbles use the player's saved display name (default `林旭阳`), while stage directions, action prompts, and off-air movement use second person. A custom name changes display only, never biography, relationships, personality, evidence access, or knowledge boundaries. After the player holds a source line, play the host question directly. Never explain this mapping with “由林旭阳开口”, “按下以后会变成完整问句”, “只选怀疑方向” or similar tutorial copy; the replay and following dialogue must make the behavior clear by themselves.
- **Keep embodiment in generated reading copies.** Continuous/player-readable scripts preserve `你` in stage directions and `你选择` at decisions. Do not let a generator rewrite them as `林旭阳选择`, which turns the player back into a proxy. Personal-stream stage copy says `开播` or `直播中`; `ON AIR` may remain a compact HUD status label, never a spoken or scripted production cue.
- **Every player choice must name an in-world host verb.** Valid verbs include 接线、追问、静音、求助、退回礼物、约见、看获准材料、带一部分回麦上、说最后一句. Avoid choices whose only meaning is a design category, route axis, or content-management action.
- **High-pressure identity beats need player control.** If the moment defines what kind of host 林旭阳 is — paid mic requests, privacy leaks, caller panic, a demand to expose an unconsenting party — facts and legal boundaries may stay fixed, but at least one handling choice must be playable. Do not auto-resolve the defining moral action and leave the player only minor evidence questions.
- **Off-air access must be authored, visible, and scoped.** Every `overnightStructure.dayScenes[]` needs a player-visible `body.access` stating who contacted the show, who consented, which material may be seen, and what remains off limits. An unsolicited private screenshot may enter the off-air inbox, but it cannot go on screen or become a public fact until the affected person gets a playable privacy/withdrawal choice. The host has no investigative authority: no private account lookup, company-system access, surprise doorstep interrogation, or witness cooperation merely because “the program needs it”.
- **Close every branch of the identity loop.** A daytime choice must alter the callback opener or night question. Every option in a non-scored live-pressure choice must author its own later echo in recap, a message, partner dialogue, or platform consequence; do not give only the preferred branch a `recapAftertaste`. Recap wording uses 林旭阳's first person, not “主播”. If pressing a button changes only hidden route data, it does not express the protagonist.
- **Establish livelihood pressure once per continuous night.** The title/prologue explains why 林旭阳 still opens the room tonight. Do not repeat his biography or invent a fresh problem before every call in the same broadcast; add a new pressure beat only when an actual platform message, household interruption, or physical change occurs.
- Fixed past, player-expressed present: the host's wounds, loves, and hates are canon (bible card); his present tendencies are whatever the player's route choices make them. Never write host lines that pre-decide the player's route.
- 心热、嘴稳、手上使计: the host has open loves and hates — he wants to help the wronged and it shows. But his wound (he once helped a live room convict the wrong man on an edited bill) gates the timing: feeling fires early, verdict fires only after facts lock. His 爱憎 is allowed to aim at the wrong target early — that is `hostWoundHook`, misdirection sourced from the player's own chair — and the case must correct him along with the player.
- Signature syntax is a tendency, not a template. 林旭阳常把两件事拆开说，但连续案件不得反复套「X 归 X，Y 是 Y」。能用一个具体动作或一句原话说清，就不用口号式对称句。
- Self-disclosure budget: at most one host self-disclosure per case, at that case's resonance point, feelings and history only, never conclusions — the perception-not-conclusion iron rule applies to the host's own mouth and inner voice.
- 奇正相生 (stratagem beats): the host helps the caller obtain evidence through small, legal stratagems — 正 is asking straight, 奇 is the clever route: prompting the caller to make an innocent request whose refusal pattern is itself evidence, a designed callback that stays silent on X to see if the other party volunteers it, an advisor-routed request that an honest counterparty could satisfy in one screenshot. Iron rules for stratagems: 阳谋不阴谋 — a stratagem is a touchstone, not a trap: it only reveals what is already true, an innocent party passes it harmlessly, and it never entraps anyone into new wrongdoing, never impersonates authority, never crosses recording/privacy law. The reaction it fishes back is authored material passing `truthBoundary` and the promise ledger like all evidence.
- Hard limits: host bias touches tone, self-disclosure, and stratagem flavor — never materials, boundaries, or scoring; wound details are never fully told; the host never personally knows this case's parties (same script as his past, never the same people); one host-history comment from the crowd per case at most. The protagonist of a case is the caller; a host who overshares is stealing the mic.
- The family web is canon: 林旭阳 is male, 33, a former internet-company legal counsel; 赵律师 is his wife and partner (the far end of the wrongful-verdict episode — she was that man's lawyer), 张法医 is his oldest friend (哥们归哥们，发票归发票), 周会计 is 张's partner and the keeper of the one dinner table where the show is never discussed; 小林老师 stays outside the web by design. Never restore the obsolete TV/radio producer identity.
- Domestic register enters only openers and closing half-lines; the professional core of any advice stays word-for-word professional. At most one family/couple beat per case. Relationships never bend facts or verdicts — 赵's disclaimers got stricter, not softer, when she became family.
- The room half-knows: regulars dare to type "赵姐" and never dare to ask; on-air copy never explains why she always answers. The apology-turned-dinner origin is bible-only.

### P2 主播情绪与加压

林旭阳可以松、暖、损，也可以真生气。寄存器由当前事实和关系决定，不设“每案几拍风趣、几拍变脸”的配额。

1. **先问后判**：事实未闭合时，追问只走到当前证据允许的位置；事实闭合后，必须点名已经成立的动作和责任，不能躲进材料清单，也不能用“双方都有问题”抹平轻重。
2. **尖锐对行为**：主播可以打断、反问、要求收回原话，也可以说得难听。攻击对象是当前矛盾、具体粉饰、成本转嫁或已经发生的伤害，不是来电人的身份、外貌、职业、出身、创伤和求助姿态。
3. **情绪要有来因**：上一拍必须给出让他发火、护人、失望或警惕的事实。不能因为到了高潮就突然加重语气，也不能靠弹幕起哄替主播提供立场。
4. **不强制回暖**：加压后只在人物安全、继续披露或下一步行动确实需要时给台阶。已经成立的判断不因安慰被撤回；人物若仍在利用脆弱躲问题，主播可以不软。
5. **判词有人格、边界留后台**：价值峰值用短句、第二人称和生活词，通常一案一处足够。`confirmed / unknown / nextStep` 的完整分栏留给结案卡，口播只说判断、动作和一件重要未知。
6. **整包有变化，不硬造对称**：跨案检查林旭阳是否永远同一温度，也检查责任是否总被写成五五开。案四可以以保护为主，案一、案三可以压得更紧；这种差异来自事实和人物，不来自预设“每包必须几种受害者”。

#### 抓破绽的现场形状

来电人前后不一时，主播直接把两句并在一起问：「等等，你刚说是他订的，这会儿又说是你订的。到底是谁？」同一轮只压一个矛盾，允许否认、抢话、沉默和再追问。目标是逼出可验证的最小修正，不是把人逼到崩溃，也不是让主播展示口才。

## P3 人味与生活纹理工具箱（可选，不按案配额）

### 总原则

1. 语言噪声和行为非理性只在能暴露人物、压力或关系时使用。删掉后完全不影响人物和局面的装饰，优先删。
2. 笑点要有现实锚，可以损、可以冷、可以尴尬；不要写成编剧段子。严肃对质和判词不靠梗完成。
3. 本节全部是候选库，不是“每案都要有”的检查表。先完成 P0-P2，再从中挑最省、最贴人的一两项。
4. 纹理不得新增承重事实，不得改变证据边界，不得替玩家交付反转。

### 急压失稳（按人物选用）

急压来临时，若人物的利益确实受威胁，可以让说话方式失稳；控制型、职业化人物也可能反而更精确、更冷。选择与人物一致的变化：

1. **语气/语调跳档**:短程内在 防御↔求饶↔发冷↔过度解释↔突然闭嘴 之间跳,不是一条平滑弧线。慌的人不是一个调门。
2. **细节露馅**：只有案件已经登记了可被压力挤出的修剪事实，才让主语、时间或措辞滑动，并留给玩家或主播抓。不要为“失稳”临时制造矛盾。
3. **失稳落在她的"自利删减/粉饰"上,不落在承重事实上**:露的是她原先的 spin 裂了(例如"他订的"松动成"我订的"这类既定反转),或一个**非承重细节**在慌里滑一下;**案件承重事实、真相边界、收窄阶梯、行-证言一致性一律不动**(verify:pack 仍须过)。不许制造会破坏案件解算或知识账本的真矛盾。

没有最低配额。验收看压力是否改变了人物策略，不看省略号、口误或露馅数量。

### 行为非理性候选

#### 1. 比例失真律

人物可以在大事上平静、在小事上炸毛；只有这个错位能侧写其真正欲望时才用，不许随机安排。

#### 2. 迁怒律

迁怒可以让压力变得可见，但必须来自已建立的关系与痛点。被迁怒者要有真实反应；不要求每案迁怒，也不规定必须道歉或不道歉。

#### 3. 廉价补救律(对方的 low 操作)

廉价补救适合暴露人物如何估价伤害：优惠券当道歉、表情包接催款、群红包平事。只有它会改变来电人的反应或责任判断时才写，并走合法传感器。

#### 4. 弹幕跑偏

跑偏弹幕可以表现观众流失、夜班生态或主播注意力被拉走。没有最低数量；如果它不改变节奏或状态，删掉。

#### 5. 顾问退场摩擦

只有已经通过「角色出场税」的顾问段才考虑生活摩擦：外卖到了先挂、孩子哭了、看球分心。专业内容照常给，退场方式可以是人；不为摩擦强行安排顾问。

#### 6. 主播狼狈

主播偶尔念错日期、误读弹幕或打翻水，可以表现“错了就当场认”。不要为了人味定时出事故；当前节目是个人直播，不得用导播、耳返或控制室工作人员替他纠错。

#### 7. 情商地板律

低情商安慰可用来表现笨拙的爱或二次伤害，但只有该关系本来就在场时才写。不要为了凑人物缺点再增加一名亲友。

#### 8. 无理取闹的应对选择(玩法接口)

来电人炸毛后，若“怎么接”会改变继续披露、guarded 或关系状态，可以给玩家一个主播动作选择，例如安抚、顶回去、停一下。若三个按钮只换口气，不改变局面，就不做。

### 语言噪声候选

语言噪声按声纹和压力选用，不进每案数量验收：

1. **长度方差**：短答、长段、追补句可以并存，但长段必须真的承担回忆、失控或复杂事实，短答必须来自人物状态。
2. **抢话**：只有一方急于阻止某句话、夺回主导或纠正事实时才打断；破折号不是人味贴纸。
3. **不承重句不是配额**：允许 0 句；整案最多 2 句。信号不好、喝口水、外卖到了、随手关窗等动作，若删除后人物、材料和下一问都不变，就优先删除，禁止为了“人味”或测试门槛硬塞。真正保留的生活动作必须至少暴露人物习惯、现实压力或关系状态；做到这一点就不再标成 `nonLoadBearing`。
4. **口误自纠**：事实容易记混、人物确实慌乱时可以自纠；不要求每案有人说错数字。
5. **语气词与口癖**：声纹靠句长、称呼、回避方式和用词共同成立。口头禅可以没有，也不能为了区分角色机械互斥。
6. **起步失败**：确实难说出口时可以话头起两次；无压力的普通信息直接说。

- **书面纹理律**:弹幕、私信、群聊、备注属"打字面",用半角标点、允许口语化打字风;台词与旁白属"说话面",维持全角。案 1 driftComments 的半角标点是正确示范,禁止"修复"为全角。
- **负指纹条款**:`voiceTics` 支持零语气词指纹——角色声明空口癖表时,校验断言其台词不出现任何通用语气词;可另声明 `oneTimeTic`(全案唯一一次的语气词),该词只许出现一次,落点即人物破防拍。
- **支线收束律**:炸毛应对选择的每条支线 ≤3 行收束回主线,不产生新事实;只记立场与路线口气,不判对错。
- **噪声弧线律**：用了不流畅，就让分布随压力变化；均匀撒噪声会变成新模板。无需为没有噪声的场景补弧线。
- **补救物即人物律**:廉价补救必须出自对方的职业或人格域——补救物是人物测验(理发师=券,习惯用材料说话的相亲对象=选择性发一份工资账户流水,老油条同事=群红包)。补救物仍受证据范围约束；“给了真的”不等于“给全了”。
- **自纠方向条款**:口误自纠的方向也是指纹——沈:说错改对;林(审计):模糊改精确(「百分之三十几……不对,三十七」)。
- **呼吸差异律**：省略号不是全员通用的呼吸方式。停顿、密不透风的短句、完整长句都要来自人物状态；不要求每案专门安排一个不停顿的人作对照。
- **生活噪声不得伪装伏笔，也不得反向凑数**：只有“掠过且无人追问”的救护车、咳嗽、喝水等才可以标 `nonLoadBearing`，但没有最低数量要求。声音靠近后停住、紧接敲门并导致人物换地点或中断行动时，必须撤掉 `nonLoadBearing`，登记偶发细节闭环并回收；工作群提示音让人物躲避消息、电话铃引出特定来电等动作也属于承重反应，不能伪装成纯噪声。
- **职业因果律**：非固定坐班、夜场、零工或其他容易被污名化的职业，正文只写角色具体做什么、怎么结算、身体或外形要付出什么成本。禁止由主播或旁白贴“不正经”标签。职业至少推动两项可见行动，例如必须约晚档、频繁补染、提成到账后消费；所谓“情绪价值”至少落成一句原话或一次动作，例如替她挡住职业玩笑，不能只写进人物小传。
- **职业延迟揭示律**：若具体职业被设计成第二夜才发现，第一夜只能留下真实但不完整的后果，例如下午才醒、要见很多人、需要晚档和妆造；不得让来电摘要、开场台词或顾问提前报出职位。第二夜回拨先让人物用“有人来问点事”等自利说法闪躲，再由玩家沿第一夜已出现的强光、敲门、账单、地点或联系方式问出具体职责、结算方式和隐瞒原因。职业揭示可以降低叙述可信度，不能自动证明违法、道德低下或“活该被骗”；后续判断仍须回到人物实际做过的动作。
- **真实照顾不得倒销**：后续发现销售动机或私表，不得把先前真实发生的维护和尊重全部改判为假。结案应同时保留照顾确实发生、照顾后来被接入消费推进这两层事实。

### 主题松绑

- 评论种子与路线评论不要直接陈述中心思想。能改成具体观众反应就改；不能就删。
- 主题无关的生活拍没有保底数量。只有它让人物更具体或为下一次高压换气时才留。

## P1/P2 对抗与选择重量

- **金句配额律**:主播每案格言句 ≤3,只许落在深问、结案与金句拍;其余追问用工作语言(短问、实指、可重复)。判定法:一句话删掉案件名词后仍像格言,即计入配额。
- **潜台词律**:来电人不得当场剖析自己的心理防御机制;自我洞察由行为、拒答或他人说破交付。每案"完美自知句"≤2,且只许出现在深问之后。
- **自我注释审计**:全文检索“现在回头看／我才发现／这么说我就不用／我就没把自己当／我怕这样显得”等句式。来电人如果在替作者命名自己的逃避方式，改成一个可见动作或被删掉的话，例如打完问题又删掉、把材料停在某一页、听见某个称呼后没有再问；需要点破机制时，把命名权交给主播，来电人只承认、否认或沉默。即时好恶和人物惯用的自嘲可以保留，不能把所有“我觉得”机械删除。
- **压力线必须付账**:平台、礼物、商务函或家庭压力若连续出现两次以上，至少一次必须改变当场局面或后续结果。可见代价包括退出推荐、被迫贴片、失去一段公开原话或让尾声数据落到较差分支；只留下回看文案而不改变任何状态，视为假压力。代价不得改写证据真值或把平台处罚当成正确答案奖励。
- **先问哪个材料板**:材料圈选不必全部是唯一正解。承重材料存在两个都成立的入口时，可标为 `selectionMode: priority`：恰好两个方向成立、玩家只能先带一个上麦，未选项不自动补发；两项必须证明不同缺口，不能把同一句结论拆成同义按钮。其余材料板仍保持单一正确项，避免所有题都退化成无差别选择。
- **答非所问**：当问题威胁已登记利益时，来电人可以反问、沉默或抓住措辞；不设数量。每一次闪躲都要让玩家听见她在躲什么，不能只占一拍。
- **抵抗拍**：人物若认为主播越界或正在失去直播间支持，可以把矛头转向主播或节目。没有这个现实动机就不强塞；主播可以接不住，但后续要让局面继续变化。
- **对手在场律**：默认对方不上麦。只有对方的实时反制会改变夜 B 决定时，才经合法传感器进入；纯重复否认可放到收麦后或删除。若个案明确需要双人调解，必须登记为一次性特许：双方分别口头授权可公开范围，主播先说明付费不购买站队，未授权材料不上屏；礼物或打赏只能提高拒绝压力，不能充当证据、同意或结论。特许只在当前案件成立，不得悄悄改写全包制作规模。
- **反转交付律**:反转不得由来电人自白首发;首发权属于玩家动作(圈行、带回物、排序、回放)。自白只作为玩家触发后的重述。同一故事包内四案反转型不得重复(钱路/规模/方向/权力)。
- **押注归还律**:中段立场快照必须在夜 B 被回应——每个选项配一句回应拍,或打脸或加固;只记不用视同未接话头。

## P2 情绪债与爽点兑付（“拱火契约”）

玩家可以明知节目在蓄力，仍期待矛盾被亲手打穿。核心是主线债务，不是弹幕仪式：气人原话提出一笔未解决的责任，玩家动作让局面变化，后续判词结清已经证明的部分。只有案件主动使用 rage-bait 长段时才附债务表；普通咨询不为合同硬造气人句。

### 法条一：兑付律（气必有偿，分期兑付）

- 每一次拱火都是节目向玩家借的一笔情绪债。气人原话负责发债，玩家戳穿后得到的最小承认、可用材料或局面变化负责付息，判词直给负责结清。弹幕反转只是可选表现，不是债务成立条件。
- 从发债到第一次付息不得跨过一个完整场景，按正常点读不得超过约十五分钟。连续对质达到六十行时，即使场景没有切换，也必须在中间放一次可见付息拍。
- 付息不能只换 BGM、立绘或抽象提示。至少让来电人承认一个被压住的小事实、让玩家拿到一项可用材料，或让下一段开口和处置发生可见改变。
- 债务表逐笔登记 `发债句／发债位置／付息位置／本金结清位置／预计持债时长`。一句发债可以分两次还，但不能没有第一次付息；判词不得用“仍然复杂”把已证明的债重新挂回去。

### 法条二：亲手律（承重转折由玩家执行）

- 决定性指认和承重转折必须由玩家输入触发，禁止自动演出替玩家完成发现。操作后的第一屏就交付人物、材料或局面变化；判词可以在随后收束中自然播出，不必另造一个“判词按钮”。
- **选择重量律**：决定性选择必须改变当场可见状态（弹幕风向、来电人 guarded、镜头/礼物压力、下一段开口），不能只换一句旁白。删掉按钮文案后若局面无变化，视为点一下。
- 主动回放是可选实现：可以重放原话、读全裁图、并排前后两句，也可以用圈行、排序、材料出示完成同一发现。按钮写主播当场做的具体动作；禁止统一写成“放给弹幕听”，也不要解释节目机制。
- 玩家动作后优先出现来电人应激或信息状态变化。弹幕若反应，只留针对新信息的自然句，不要求任何账号整齐改口。普通 press、普通出示和错误方向仍遵守原有惩罚合同，不能借拱火另造一套失败经济。
- 主动回放只许使用玩家已经听过的原话。按钮不得提前泄露下一轮回答、后台动机或尚未公开的材料行。

### P3 可选：同谋感（承认现场，不表演默契）

- 不得按配额安排主播对弹幕眨眼。只有上一屏确有一条具体评论给主播造成了压力、打断或误读，主播才会接那一条；没有现场来因，就直接说“等一下，我把原图打开”或保持沉默。
- 禁止“弹幕别催／课代表先歇／别替我选／我知道你们盯哪一栏”这类编导式默契台词。它们既替玩家预告动作，也让直播间像排练好的合唱团。
- 判词和事实边界不靠戏谑完成；严肃对质里可以出现人物本来的讽刺或火气，但不能把伤害当梗。若主播接弹幕，必须由已经出现的具体评论触发，不能由作者定时提醒玩家“现在该爽了”。

### P3 可选：双层身份与固定 ID

- 当弹幕确实参与了误读，一个循环可以同时服务两层身份：玩家作为观众先形成判断，再作为主播纠正现场。没有弹幕参与时，玩家和来电人的直接攻防已经足够。
- 固定听众 ID 是可选的熟悉感，不是反派编制。一个 ID 只有在跨案声口确实成立时才复用；不得让两个账号在每案发债期准时出现、付息拍准时败退。
- 弹幕不是合唱队。允许有人改口、有人嘴硬、有人只问新细节，也允许原先带偏的人直接消失。验收看风向是否因新信息改变，不看固定账号是否完成规定动作。

### 变奏等级（包级工具，不是单案配额）

- Tier 1 是如约打脸：玩家知道气人话会被收回。Tier 2 是玩家亲手打脸。Tier 3 是主播或弹幕承认共同期待，建立同谋感。Tier 4 是佯攻：玩家憋足劲出手，结果发现自己打中了预判，真正矛盾从另一边翻出来。
- 新玩家尚未理解基础循环时，优先用 Tier 1-2；Tier 3 只在现场关系已经建立后使用。Tier 4 不宜早于第二案结案，除非序章已经完整教会并兑付过基础契约。
- Tier 4 必须遵守发现权守恒。翻转所需输入先在屏幕上出现，玩家只是先按熟悉模板解释错了；作者不得靠临时人物、临时材料或后台真相宣布玩家被骗。
- 骨架同形可以形成仪式，也可能暴露模板。是否返工看矛盾、佯攻、证据运算和人物防御是否真的不同，不因“同形”自动保留，也不要求每包必有 Tier 4。

### 冷开场例外与验收

- 试玩黄金九十秒可以从已获授权、后文有来源的案内原话冷切，并在首个玩家输入后补齐紧邻的反证原话。冷切只借一句情绪债，不展示材料谜底、人物结论或整案目录；付息以后必须回到正常接线节奏。
- 冷开场复用后文原话时，在债务表标注“未来切片”，后文仍按完整因果首次取证。冷切不能让主播据此提前问出尚未获得的材料事实。
- 使用冷开场时同时串读债务表和实机路径：首次付息是否在一个场景内；变化是否在玩家操作后的第一屏；若有弹幕，它是否只对刚出现的新信息反应；若基础契约尚未教会，是否过早使用 Tier 3-4。

## P1 玩家身份门禁

玩家始终是主播林旭阳。新玩法、新选项、新白天动作，先回答：做完这一下，玩家更像在播，还是更像受害者、律师、侦探或来电人本人。

- 禁止第一人称代入来电人做选择；禁止用「你被骗了吗」当按钮。按钮形状是主播当场能做的动作：追问这句、重放原话、把原图读全、先盖镜头、调解还是播出。
- 删掉案件名词后仍像通用侦探题的选项，视为未完成。
- 新功能必须放大旧循环（听原话、形成怀疑、玩家验证、人物反应、材料改变判断），禁止为新题材单开平行主案。弹幕反转可以服务这条循环，但不是新功能的必备证明。堆了白天小游戏、第二套 UI、第三种结局，却没有改变玩家怎样发现或处置矛盾，视为堆量。

## P1 Multi-Scene and Offline Rashomon (多元场景)

Design source: `docs/multi-scene-rashomon-design.md`. The show is titled for the livestream, but plot-driving stages must diversify.

- Write daytime locations as scenes with casts and beats, not as one-sentence souvenirs. A visit that only returns a label for the callback opener is underwritten.
- DayScene kinds beyond `visit`/`studio`/`document`: `observe` (same room, different table — watch, do not intervene), `sitIn` (licensed eavesdrop co-presence — host silent by caller request), `doorstep` (refusal at the threshold).
- At most one face-to-face privilege with the other party per pack; other cases use mediated Rashomon. The host does not interrogate the other party on the player's behalf during sitIn — notes feed the night-B callback.
- 删除 `sitIn` 时要连同它的取证功能一起删除，不能只把 `kind` 改成 `visit`，再让服务员认出直播、邻桌陌生人主动搭话，继续交付同一条证言。任何偶遇 NPC 都必须有当场开口的现实理由，并且提供来电人和现有材料尚未给过的新事实；否则整场砍掉，换成真正未回答的缺口。
- Every day location still obeys bring-back law: `earnedItemId` must unlock a distinct `callbackOpeners` line the player could not have gotten from the console alone.
- Keep the interlude short and the city day long: when both surfaces exist, spend interlude budget on one or two console-scale actions and put walking, observing, doorstep refusals, and document visits in `dayScenes`.
- With `overnightStructure`, write night-B openings only in `overnightStructure.callbackOpeners`. Any interlude result intended to change that opening must be copied into `earnedItems` by the same id or an explicit inventory map; never leave a player-facing "carried" item outside the opener pool.
- Every night-B `callbackOpeners` entry must carry either `firstConflict.hostLine + callerLine` or an alternating `firstConflict.lines` sequence containing both roles. Use `lines` when a material needs several short questions; each host turn still asks one thing. The earned item changes the first confrontation, not only the greeting: two different carried items may not collapse into the same host question with nouns swapped.
- Do not write parallel hangup or opener prose for `nightStructure` and `overnightStructure`. Align the hangup seam and maintain one callback-opening source of truth.
- When the interlude continues into a daytime map, `continueLabel` must say that the player is entering daytime investigation, never imply an immediate callback. Keep the duplicated hangup seam byte-for-byte aligned: `nightStructure.hangup.stageDirection === overnightStructure.hangupLine` and `nightStructure.hangup.hostLine === overnightStructure.hostHoldLine`.
- Give at least one off-console scene per case a consequential `choice`: different branches grant different information state, route state, or `grantsEarnedItemId`; cosmetic branch labels do not satisfy the scene.
- Before shipping, audit NPC ownership and document wiring: one load-bearing NPC beat lives in one scene only, and every callback-changing document grants an earned item with a matching opener.

## P3 温情与尾巴（包级可选资产）

- **互惠**：主角也应偶尔被照顾，最好有汤、水、便签等物件承载。只有包级关系线需要这层时才安排；不设次数，也不把每件物品强行走满三拍。
- **回访**：需要证明人物在结案后仍生活时，可传回一条生活或关系信息。它不得携带新证据、新指认，也不要求每案回访。
- **关怀动词**：非侦探动作只有会改变关系回声时才做成选择。没有后果的“最后一句三选”是装饰，删除。
- **声纹破例**：破例可以承载温情，但越少越有效。使用后要让玩家听得出它为什么只在此刻发生。
- **活性尾巴**：包级钩子仍需“再来动因 + 信物 + 兑现形态”。数量由后续内容计划决定；只约定已设计的兑现形态，不为悬念透支未来真相。

## P0/P1 结构性冲击与个人选择

- 信托兑付、房屋停工、保健品机构卷款等公共事件可以串联多案，但先在个案里留下可见种子，再由职业见闻加固，最后才用新闻或公告回收。不得让新闻按作者日程自动到场；玩家至少执行一次“听 / 看 / 读”的动作。
- 机构的违法、误导或违约责任，与当事人的借款、加杠杆和追求超额收益必须分开写。人物的贪念不用主播贴“贪婪”标签，而用他实际借了多少、期待多少收益、拒绝一般回报的原话和押注动作让玩家自己判断。
- 禁止写成“因为他贪，所以被骗活该”。合格结案要同时保留两句意思：借钱追高收益是他的决定；机构若误导或违约，责任仍归机构。后来的公开危机不能把旧案每一笔损失自动坐实，也不能替他的借款决定免责。
- 同一个公共事件进入不同案件时，只能充当共同压力源，不能复制同一条因果链。烂尾房要有购房合同、交付节点和家庭决定；保健品卷款要有付款、承诺、老人现金缺口与婚事冲突；缺少各自材料链时只登记未来承诺，不写进现有正文。
- 跨案伏笔也要逐句过小逻辑合同。每条种子流水都要有本行追问，登记 `sourceRows / sourceProves / sourceDoesNotProve / answerAnchor / answerAdds / nextLegalQuestion`；跨行问题必须先说清“相邻不等于同一笔”，再允许人物补充自己亲耳听过的原话。
- 同一机构第二次进入别案时，必须产生不同的本地冲突，并登记为 `secondarySeed` 或等价账目。它可以让旧线变重，不能抢走当前案件的主物件；案尾公开冲击要同时写明它对每个旧案“重新说明了什么”和“仍不能证明什么”。
- 带回物只重开一个时间块。若玩家带回三月借款与信托认购，第二夜就按“借款有没有提过 -> 两笔认购什么时候看到 -> 机构和收益期待是否听过”分成短问答；不得顺便在同一句重念五月、六月、七月和其他账户。

## P3 Theatrical License (戏剧性特许，可选预算)

This is a game, and a night of theater beats a panel discussion. Realism discipline (fair play, sensor contracts, value baseline) governs FACTS; it does not require every voice to be reasonable or every event to be probable. Budget the improbable deliberately:

- **Theatrical-license budget**: a case may spend at most one deliberately heightened coincidence or arrangement — the wrong attachment, the deleted comment, the word collision, the accused sitting silently in the viewer list. Zero is valid. The license buys improbability, never unfairness: the moment must still pass truth ledger, sensor contract, and promise ledger.
- **Unreasonable voices are earned, not assigned**: an off-mic person may want something too much when that desire already drives the event. Do not arm a measured witness merely because the scene lacks noise.
- **The show is a character**: the hotline carries light urban-legend gravity — the room that hears everything, advisors who answer at 2 a.m., a host whose old wound the regulars all know. Mythology lives in flavor and interludes, never in evidence.
- **Experts may collide**: two advisors reading the same fact through different frames (法律说是赠与，会计说是路径) is licensed courtroom theater — it dramatizes ambiguity instead of resolving it, so it protects openness rather than spending it.
- License audit: if heightened staging is doing the work that conflict, evidence, or player action should do, remove it. If the heightened moment makes an already sound conflict more memorable and survives skeptical replay, keep it.

## Structure Archetypes

For case and pack skeletons drawn from classic detective fiction — false solutions, missing edges, distributed responsibility, weaponized narration — use [detective-patterns.md](../detective-plot-coupling-review/references/detective-patterns.md). It includes the Rashomon multi-version self-edit and the Gone Girl-style "caller weaponizes the live room" patterns alongside the canon table. Use archetypes when designing new cases and packs; do not retrofit shipped demo cases onto a template.

## Validation

Before mechanical checks, run a priority audit in this order:

1. **First-law spoken read**: hide field names and read every spoken turn in runtime order. Allow an incomplete or self-protective answer, but require each turn to answer, continue, resist, correct, or audibly dodge the adjacent turn. Mark every sudden summary and every jump across more than one inferential step; delete it or restore the missing human exchange before any other polish.
2. **P0 spine read**: hide comments, stage effects, jokes, advisor color, and recurring-listener copy. Read only request, testimony, evidence, player action, revisions, and judgement. If the conflict becomes vague or the reveal no longer changes advice, stop and repair the spine.
3. **P0 whole-account read**: read A and A′ separately as uninterrupted caller testimony. Each must explain the same event through a distinct coherent frame. Confirm the seam contains an earned emotional strategy change, not line-by-line patching, and that the host does not solve A′ before the player acts.
4. **P1 overnight review replay**: traverse first-night hangup, each interlude/day evidence action, every earned item, and the second-night opener. Confirm evidence and wording are handled one item at a time, each action changes what can be asked, and no organizer or advisor announces A′'s answer in advance.
5. **P1 fairness replay**: for every load-bearing conclusion, point to the earlier visible source and the player action that licensed it. Confirm wrong routes remain playable without leaking the answer.
6. **P2 pressure read**: read the five turns around each escalation. Confirm the emotion has a concrete trigger, changes the character's strategy, and attacks behavior rather than identity. Pay special attention to the A → A′ seam and the second decisive hit: the caller may lose control, but must not become a polished author summary.
7. **P3 deletion test**: remove each comment exchange, wink, recurring ID, joke, life-noise beat, care choice, and theatrical flourish in turn. If nothing meaningful changes, leave it deleted. If removing it damages pressure, character, pacing, or a later echo, keep it without creating a pack-wide quota.

Contradiction rules:

- Mainline clarity beats mystery fog; preserve unknown facts, not unknown subjects and verbs.
- Evidence boundary beats emotional certainty; emotional certainty may be as strong as the proved behavior, never stronger.
- Clear responsibility beats forced mutual blame; mutual responsibility appears only when both behavior chains are supported.
- Character-specific resistance beats a fixed confession ladder; direct admission is legal when its human cost is low or evidence has closed the exits.
- Player discovery beats autoplay spectacle; atmosphere may amplify a discovery but never own it.
- Specific scene need beats every universal atmosphere quota. “Every case needs a wink / fixed antagonist / off-topic comment / host accident / comfort beat” is not a valid rejection reason.

After content edits:

```bash
npm run content:index
npm run content:script
npm run verify:pack -- <pack-id>
npm run test:narrative
npm run check
```

Run builders before narrative tests: runtime reports read `src/generated/contentPackIndex.js`, so testing before `content:index` can validate stale dialogue and leave rejected wording in `docs/generated/narrative-flow-report.md`. Afterward search the repository for the rejected phrase, including generated reports.

Write semantic tests around stable structure. Locate a beat by case id, scene id, option id, or `suspicionLabel`, then assert the intended behavior. Do not locate it only by an old full sentence that the test itself prevents editors from improving. Reserve exact player-visible string assertions for deliberate wording locks and banned regressions.

Run `npm run smoke:browser` if the change touches flow, options, materials, or recap structure. Then hand off to `livestream-game-flow-review` for a played-through review — content is not done when the JSON validates; it is done when the call plays well.
