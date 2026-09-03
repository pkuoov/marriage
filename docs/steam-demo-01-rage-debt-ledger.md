# steam-demo-01 拱火债务表

> 本表由咖啡厅序章、四主案和三快案的 JSON 真源自动生成。发债是让玩家生气或产生确定预判的原句；付息是同场或同段的小反转；本金是玩家亲手触发的决定性指认、对质或判词；挂钩只发行下一笔债，不提前替未知事实下结论。

## 试玩序章｜prologue-cafe-opening｜序章

- 投放层级：Tier 2 → Tier 3
- Tier 4 资产：无

| 债务 | 层级 | 发债 | 首期付息 | 持债上限 | 本金结清 | 下一笔债 |
|---|---|---|---|---|---|---|
| cafe-only-close-chat | Tier 2 | cafePrologue.cafe.openingLines：“那晚我没去澜桥酒店。” | cafePrologue.cafe.evidencePair（player-input）：玩家先点出她否认去酒店的原话，再亲手压上一张能直接反驳它的材料；她被迫承认房是自己开的。 | 同一场 | cafePrologue.cafe.transferEvidence（player-input）：玩家打开三笔双向转账，主播让她解释‘没跟顾*转过钱’，同时保留借款性质与酒店内行为未知。 | cafePrologue.cafe.cameraBreakLines：“大主播也不过如此。” |
| cafe-recording-control | Tier 3 | cafePrologue.cafe.cameraBreakLines：“你们敢只剪问赢的那几句，我就把这份原片发出去。” | cafePrologue.cafe.pressureChoices（player-input）：玩家亲手关掉桌边录像，随后继续谈；未确认的片段不进入剪辑和发布。 | 同一屏 | cafePrologue.forensic（player-input）：玩家先查咬胶，数日后只收到支持亲子怀疑的初步排除意见；先查家庭卡，则只收到十八日回单。两条都不在同一关同时兑付。 | cafePrologue.forensic.accountClueLines：“十八号那笔，收款人不是顾*。” |

## 主案｜01-credit｜账单里的八万

- 投放层级：Tier 1 → Tier 2
- 主动复读：credit-loyalty-test
- Tier 4 资产：无

| 债务 | 层级 | 发债 | 首期付息 | 持债上限 | 本金结清 | 下一笔债 |
|---|---|---|---|---|---|---|
| credit-lost-job-voice | Tier 1 | nightShell.prologue.coldOpen：“我只是怕你知道我失业后就离开我。” | nightShell.prologue.coldOpen（player-input）：玩家听完整条语音，最低还款金额随即出现，先前的同情开始动摇。 | 同一屏 | credit-loyalty-test:act2（player-input）：两次决定性指认后，判词拒绝替她做公开赦免。 | 01-credit:hangup：“拿了他一年多的钱，这八万就该转。” |
| credit-separate-homes | Tier 2 | credit-living-arrangement：“不住在一起。他住他的，我住我的。” | credit-night-b-first-interest（fixed-beat）：弹幕追问房租，她把答案留到男友随后发来的消息。 | 夜 B 第一场后 | credit-loyalty-test:act1（player-input）：玩家把十四个月流水压到共同消费说法上。 | credit-loyalty-test:act2：“钱是他自己说要给的。” |

## 主案｜04-workplace｜职场报销截图

- 投放层级：Tier 1 → Tier 2 → Tier 3
- 主动复读：work-leader-note
- Tier 4 资产：无

| 债务 | 层级 | 发债 | 首期付息 | 持债上限 | 本金结清 | 下一笔债 |
|---|---|---|---|---|---|---|
| work-company-wont-reimburse | Tier 1 | 04-workplace:opening：“公司一直不给我报销。” | work-comment-stupid-blowup（player-input）：玩家追到报备后，她承认刷卡时没有报备，带偏观众撤回原话。 | 夜 B 第一场后 | work-split-ownership:act1（player-input）：玩家把缺失付款栏压到‘流程都走完了’上。 | work-split-ownership:act2：“经办说活动后会补，我按他的安排等就行。” |
| work-process-finished | Tier 3 | work-split-ownership:act1：“流程都走完了，就是公司一直不给我报销。” | work-split-ownership:act1（player-input）：玩家正式指认后，她承认没有报销编号、回单和日期。 | 同一场景 | 04-workplace:stageJudgement（player-input）：判词直说这是假话，并让她带发票走正式报销。 | 04-workplace:stageJudgement：“每笔返费进了谁的账户，今晚不知道。” |

## 主案｜03-profile｜彩礼与流水

- 投放层级：Tier 1 → Tier 2 → Tier 3
- 主动复读：profile-caller-repeats-label
- Tier 4 资产：无

| 债务 | 层级 | 发债 | 首期付息 | 持债上限 | 本金结清 | 下一笔债 |
|---|---|---|---|---|---|---|
| profile-mother-did-it | Tier 2 | 03-profile:opening：“我才知道我妈已经先托介绍人去问了彩礼。” | profile-caller-repeats-label（player-input）：玩家重放‘名校毕业是我自己加的’，她承认知道加价却没有叫停。 | 夜 A 同一段 | profile-family-chat-origin:act1（player-input）：玩家用家里群与工资卡打穿‘两边对等’。 | profile-family-chat-origin:act2：“只差两千，不是拿不出，就是不肯。” |
| profile-two-thousand-attitude | Tier 3 | profile-family-chat-origin:act2：“只差两千，不是拿不出，就是不肯。” | profile-family-chat-origin:act2（player-input）：玩家压上另一行材料，主播让她收回‘差两千就是态度’。 | 同一场景 | 03-profile:stageJudgement（player-input）：判词点名查完普通家境加价，她本人赞成。 | 03-profile:hangup：“家里群的新消息还在往外跳。” |

## 主案｜02-tony｜那张名单

- 投放层级：Tier 1 → Tier 2 → Tier 3 → Tier 4
- 主动复读：tony-next-push-column
- Tier 4 资产：名单反转（第 2 案结束后可投放）——预判“一排女人就是一串女友。”；反转“名单右半边是金额、起投门槛与代投状态，周是已经买入的熟客。”

| 债务 | 层级 | 发债 | 首期付息 | 持债上限 | 本金结清 | 下一笔债 |
|---|---|---|---|---|---|---|
| tony-girlfriend-list | Tier 4 | 02-tony:opening：“他是不是拿谈恋爱吊着一串人。” | tony-list-columns（player-input）：玩家追问截图右边，她承认裁掉金额、产品和跟进列。 | 夜 A 内 | tony-next-push-column:act1（player-input）：玩家补回右半边，打穿她把主动代投全改口成恋爱诈骗的说法。 | tony-next-push-column:act2：“那天不跟，好像就我一个人不识货。” |
| tony-atmosphere-made-me | Tier 3 | tony-next-push-column:act2：“那天不跟，好像就我一个人不识货。” | tony-next-push-column:act2（player-input）：玩家用转账前的门槛提醒打穿‘都是他营造气氛’。 | 同一场景 | 02-tony:stageJudgement（player-input）：判词拒绝恋爱诈骗改口，同时要求 Tony 给出产品原件。 | 02-tony:hangup：“她没有解释门外是谁，电话很快断了。” |

## 快案｜01-no-conditions｜什么都不图

- 投放层级：Tier 2 → Tier 4
- Tier 4 资产：‘什么都不图’反转（第 2 案结束后可投放）——预判“她的低要求只是普通客套。”；反转“符合口头条件的普通对象出现后，她不接，转而要经商、家里省心并能分担房贷的人。”

| 债务 | 层级 | 发债 | 首期付息 | 持债上限 | 本金结清 | 下一笔债 |
|---|---|---|---|---|---|---|
| quick1-million-from-dad | Tier 2 | million-from-dad：“去年买的时候，我爸爸给了我一百万。” | two-fathers（player-input）：玩家追问同一个称呼对应的收入落差，她承认出资人不是亲爸。 | 第一轮内 | quick1:ending（player-input）：主播拒绝替她介绍和背书。 | quick1:ending：“那一百万元从哪里来、双方是什么关系，仍然未知。” |
| quick1-low-standards | Tier 4 | low-standards：“一个月四五千也行，没房也可以。” | hidden-standards（player-input）：普通对象递到面前后，玩家追出经商、家里省心和分担房贷的真实门槛。 | 第二轮内 | quick1:ending（player-input）：主播直说她想借自己的名字接触条件更好的人。 | quick1:ending：“她真正接受的择偶条件仍未全部说清。” |

## 快案｜02-one-missed-message｜那晚没回消息

- 投放层级：Tier 1 → Tier 2
- Tier 4 资产：无

| 债务 | 层级 | 发债 | 首期付息 | 持债上限 | 本金结清 | 下一笔债 |
|---|---|---|---|---|---|---|
| quick2-one-message | Tier 2 | help-request：“最近突然不联系了。我想问，是不是我对交流要求太高了。” | message-or-drunkenness（player-input）：玩家对上十一点五十二与六分钟后的记录，她承认‘还行’不是真实状态。 | 第一轮内 | quick2:ending（player-input）：主播判断问题不只是一条未回消息，而是连续缩小当晚事实。 | quick2:ending：“男方退出时最看重哪一项，今晚不知道。” |
| quick2-rare-night-out | Tier 1 | missed-message-version：“我已经很久没出去了。” | nightlife-pattern（player-input）：玩家对照朋友圈，追出近两个月六次夜场和连续两晚外出。 | 第三轮内 | quick2:ending（player-input）：主播直说她把长期生活状态说成一次偶然。 | quick2:ending：“酒桌上有没有发生别的事，不用猜。” |

## 快案｜03-labeled-fiction｜某流量明星的小作文

- 投放层级：Tier 1 → Tier 2
- Tier 4 资产：无

| 债务 | 层级 | 发债 | 首期付息 | 持债上限 | 本金结清 | 下一笔债 |
|---|---|---|---|---|---|---|
| quick3-labeled-fiction | Tier 2 | essay-label：“正文指向现实人物并配图，文末却留了一句『纯属虚构』。” | labeled-fiction（player-input）：玩家选择先看长文怎样一面指向真人、一面给作者留退路。 | 第一段内 | public-leverage（player-input）：玩家把虚构标注和认全文条件放回同一张桌上，主播直接评价这种舆论打法。 | quick3:ending：“三千万该不该退，法院判。” |
| quick3-five-cards | Tier 1 | money-transferred：“让我准备五张卡一起打。” | money-split（player-input）：玩家选择把已转出的三千万、未转出的五千万美元与女方未回应的数字拆开。 | 第二段内 | quick3:ending（player-input）：主播既不接受女方绕开三千万，也不把男方单方写下的更大开价当成第二份材料。 | quick3:ending：“这笔钱没有转出去。” |
| quick3-public-leverage | Tier 2 | early-rumor：“网上已经出现代孕传闻。” | settlement-inference（player-input）：玩家可以先说求和推断为什么可信，再由主播补上本人授权仍缺材料。 | 第四段内 | quick3:ending（player-input）：主播把高概率推断与已经确认的公开动作分开，再给出个人结论。 | quick3:ending：“但高概率推断仍不是本人授权。” |
