# 《Steam 试玩版》按角色台词报告

> 本文档由内容包自动生成。它把分散在夜 A、白天、夜 B、顾问回流和结案中的台词重新按人物聚合，供遮名辨人、知识边界和句长节奏审稿。请修改 JSON 真源后运行 `npm run content:dialogue-report`，不要手改本文档。

## 汇总

- 固定人物卡：35
- 收录台词／玩家可见人物材料：1107
- 本包实际出声人物：32
- 句长节奏人工复核提示：17
- 构建时硬拦截：未归属说话人、越案人物 ID，以及“我现在想知道的是／本质上／更重要的是／一方面另一方面”高密度模板。

# 全集外壳

## 林旭阳

- **固定性格：** 温热、有分寸，也有明确好恶
- **受压反应：** 事实没闭合时先缩短句子，把混在一起的事拆开；证据已经对齐，对方还在把自己的代价甩给别人时，他会收笑、直说，火气只落在具体做法上。
- **防御动作：** 把感情和责任分开问，事实不够时不用火气补证据；事实够了，也不拿中立当成不表态的借口。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 其他出声面

- `$manifest.nightShell.prologue.lines[0]` 我叫林旭阳，三十三岁。以前在一家互联网大厂做法务。失业以后，阴差阳错开了这个直播间。不温不火，也做了两年半。我老婆姓赵，我们俩是大学同学。她现在是执业律师。
- `$manifest.nightShell.prologue.hostLine` 改版又催上了，先让他催着。又要打 PK，又要搞团播，真烦啊。开播了哈，今天继续连麦。
- `$manifest.nightShell.interludes[0].lines[1]` 已经兑不出来了？
- `$manifest.nightShell.interludes[0].lines[3]` 我记得这家公司什么都做，盘子也很大。
- `$manifest.nightShell.interludes[0].lines[5]` 那今天这二十万呢？
- `$manifest.nightShell.interludes[0].lines[7]` 行，我收回。
- `$manifest.nightShell.interludes[0].lines[9]` 可她只剩一万一千六百多，还一直没告诉他。
- `$manifest.nightShell.interludes[0].lines[12]` 真那样的话，我们俩大概一开始就看不上对方。
- `$manifest.nightShell.interludes[1].lines[1]` 可那六万八也不会自己回来。
- `$manifest.nightShell.interludes[1].lines[3]` 她下麦前又发来一页供应商返费表。招商主管、区域经理、采购经办，三层都有一栏。
- `$manifest.nightShell.interludes[1].lines[5]` 对。她那六万八还是走公司报销，这张表另存。可这公司这么搞，早晚得出事。
- `$manifest.nightShell.interludes[1].lines[7]` 押金二十九，一次一块五。押金还得退，不能当收入。柜机、铺设、维护、场地方分成，哪个不要钱？
- `$manifest.nightShell.interludes[1].lines[11]` 八卦不能拿来算公司的账。可公开融资稿和这张返费表，已经够难看了。
- `$manifest.nightShell.interludes[2].lines[1]` 我只看见持有页，三十万，写着九月底到期。合同没上屏。
- `$manifest.nightShell.interludes[2].lines[3]` 她爸原话是给女儿自己留着，不是拿来办婚礼。九月底到底能不能兑，还得等。
- `$manifest.nightShell.interludes[2].lines[5]` 会。饭还是吃完了，钱也得我自己说。
- `$manifest.nightShell.interludes[3].lines[1]` 我洗。你站旁边监督。

## 老方

- **固定性格：** 急躁的结果主义者
- **受压反应：** 数据越差，句子越像截止日期和命令。
- **防御动作：** 把关心包装成指标，把认可包装成下一项要求。
- **知识边界：** 只知道节目运营、后台曲线和公开播出内容，不知道案件麦外真相。

### 其他出声面

- `$manifest.nightShell.prologue.lines[1]` 深夜档这个月再不达标，就并进娱乐区。改版方案，下周一前给我。
- `$manifest.nightShell.interludes[1].lines[0]` 刚才贴片再晚十秒，就自己切进来了。
- `$manifest.nightShell.interludes[1].lines[2]` 行。下周的改版方案里别写这句。
- `$manifest.nightShell.interludes[1].lines[6]` 我刚翻到栖行共享科技的融资稿。宸直是主要股东之一，两轮融资都在往上抬估值，讲得最多的是又铺了多少点位。
- `$manifest.nightShell.interludes[1].lines[9]` 老板儿子倒挺忙。八卦号拍到他跟宸直老板的儿子一起泡吧，身边的人换得比柜机广告还快。

## 旁白

- **固定性格：** 克制的观察者
- **受压反应：** 不用结论，只留下声音、灯和动作。
- **防御动作：** 只写可感知物和动作后果。
- **知识边界：** 可描写舞台与玩家可见画面，不新增角色不知道的案情事实。

### 其他出声面

- `$manifest.nightShell.prologue.lines[2]` 晚上八点，你推开直播间的门。走廊坏着半截灯，桌上的显示器还亮着。
- `$manifest.nightShell.prologue.lines[4]` 你点下“开始直播”。屏幕上的三秒倒计时归零，开播提示音响了一声。

## 赵律师

- **固定性格：** 锋利的理性派
- **受压反应：** 听见无证据定性会立刻打断，并补适用条件。
- **防御动作：** 短句、免责、拒猜动机。
- **知识边界：** 只解释法律与责任效果，不替案件当事人作证，不指点玩家圈哪一栏。

### 其他出声面

- `$manifest.nightShell.prologue.lines[3]` 吃饭没有？汤在冰箱，记得热。还有个东西我塞你包里了，忙完再看。
- `$manifest.nightShell.interludes[0].lines[0]` 你今天直播里提到的宸直信托，我知道。最近我手上就有好几起跟他们有关的兑付纠纷。
- `$manifest.nightShell.interludes[0].lines[2]` 有纠纷，不等于全线违约。不过我看过几份合同，收益写得很高，钱又去了商场、地产，还有几家关联公司。
- `$manifest.nightShell.interludes[0].lines[4]` 老板路子很广，业务铺得也开。可盘子大，不等于自己的钱多。至少我经手的几个项目，主要靠一轮一轮往外融。
- `$manifest.nightShell.interludes[0].lines[6]` 产品、合同、到期日都没看见。现在只能说风险高，你别先替人宣布拿不回。
- `$manifest.nightShell.interludes[0].lines[8]` 不过那姑娘也不能躲在‘没住一起’后面。十四个月就是二十四万五，房租还没算。他觉得她至少能剩十五万，不算瞎猜。
- `$manifest.nightShell.interludes[0].lines[10]` 她得先把自己的花销收住。至于那八万，他签的贷款和信托合同照样得拿出来。
- `$manifest.nightShell.interludes[0].lines[11]` 那我问个不用证据的。我要是也这么爱面子、花钱没数，你会不会什么都给我买？
- `$manifest.nightShell.interludes[1].lines[4]` 名目还不一样吧？点位协调、渠道维护、采购配合。写得像三件事，钱是一层一层往经手人手里返。
- `$manifest.nightShell.interludes[1].lines[8]` 按他们自己写的使用率，单个点位连维护费和场地分成都盖不住。再让各级主管抽一遍，摊子铺得越大，窟窿只会越大。
- `$manifest.nightShell.interludes[1].lines[10]` 宸直那位更出名。前后跟大网红、女明星闹过绯闻，上个月还被拍到坐私人飞机去法国看酒庄。
- `$manifest.nightShell.interludes[2].lines[0]` 你刚才说的那笔宸直，女方家买的是哪一款？
- `$manifest.nightShell.interludes[2].lines[2]` 那现在只能说没到期，不能说拿不回来。宸直老板确实挺能折腾，商场、地产、理财，什么都做。摊子看着大，里面不少钱都是融来的。
- `$manifest.nightShell.interludes[2].lines[4]` 先别替人家发愁。你第一次去我家的时候，我爸妈要是先问你能拿多少，你还会来吗？
- `$manifest.nightShell.interludes[3].lines[0]` 今晚这些杯子，谁洗？
- `$manifest.nightShell.interludes[3].lines[2]` 不监督。我在门口等你。

# 账单里的八万

## 林旭阳

- **固定性格：** 温热、有分寸，也有明确好恶
- **受压反应：** 事实没闭合时先缩短句子，把混在一起的事拆开；证据已经对齐，对方还在把自己的代价甩给别人时，他会收笑、直说，火气只落在具体做法上。
- **防御动作：** 把感情和责任分开问，事实不够时不用火气补证据；事实够了，也不拿中立当成不表态的借口。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 夜 A

- `$case.openingDialogue[1]` 你转了没有？
- `$case.openingDialogue[3]` 他怎么跟你开的口？
- `$case.openingDialogue[5]` 你现在是不敢转，还是不想转？
- `$case.openingDialogue[7]` 你们在一起多久了？
- `$case.sceneVersions[0].beforeVersion.lines[0]` 你们平时住在一起吗？
- `$case.sceneVersions[0].questionOptions[0].lines[1]` 他会固定转钱给你吗？
- `$case.sceneVersions[0].questionOptions[0].lines[3]` 转了多久？
- `$case.sceneVersions[0].sceneCloser.lines[0]` 以前每个月都按时到？
- `$case.sceneVersions[1].beforeVersion.lines[0]` 那八万，他有没有说哪天还你？
- `$case.sceneVersions[1].afterVersion.lines[0]` 那你后来怎么没转？
- `$case.sceneVersions[2].beforeVersion.lines[0]` 工资记录没发，社保早就停了。那张信用卡账单，你后来要到完整的吗？
- `$case.sceneVersions[2].beforeVersion.lines[2]` 把姓名和卡号遮一下，发到后台。
- `$case.nightStructure.hangup.hostLine` 好，就看他发来的这几页。三万五不知道就是不知道，明晚把他怎么说的告诉我。
- `$case.sceneVersions[0].questionOptions[0].question` 他平时发了工资，会交给你吗？
- `$case.sceneVersions[0].questionOptions[1].question` 你们没住一起，平时的钱也完全分开吗？
- `$case.sceneVersions[1].casualQuestions[0].question` 他丢工作前，加班是什么样子？
- `$case.sceneVersions[1].questionOptions[0].question` 借钱以前，他跟你提过工作出了问题吗？
- `$case.sceneVersions[1].questionOptions[1].question` 他为什么拿社保记录代替工资记录？
- `$case.sceneVersions[1].dialogueOptions[0].question` 他当时只说差多少钱吗？
- `$case.sceneVersions[1].dialogueOptions[1].question` 你当时为什么没接着问工作？
- `$case.sceneVersions[2].casualQuestions[0].question` 那些餐厅是什么档次？
- `$case.sceneVersions[2].casualQuestions[1].question` 礼物都送了些什么？
- `$case.sceneVersions[2].casualQuestions[2].question` 他开口的时候，要你垫的就是整整八万吗？
- `$case.sceneVersions[2].questionOptions[0].question` 我把账单加了一下。两个人一起花的差不多四万，他自己的衣服五千左右。八万里还剩至少三万五没说清。你问过他吗？
- `$case.sceneVersions[2].questionOptions[1].question` 后面男装加起来也就五千，一件大衣两千多。单看这些，能说明他平时挥霍吗？
- `$case.sceneVersions[2].dialogueOptions[0].question` 你第一眼先看到哪一栏？

### 夜 B

- `$case.sceneVersions[3].beforeVersion.lines[0]` 账单里有一笔餐厅消费特别高，挺舍得花。是纪念日那晚吗？
- `$case.sceneVersions[3].afterVersion.lines[0]` 先等等。靠窗位提前两周也未必订得到。你们俩是不是有人是那里的老会员？
- `$case.sceneVersions[3].questionOptions[0].lines[1]` 那会员等级怎么攒起来的？
- `$case.sceneVersions[3].sceneCloser.lines[0]` 纪念日这顿先放这儿。你刚才还提到一万二的分期。
- `$case.sceneVersions[6].beforeVersion.lines[0]` 昨晚你只说，账单里有一套放在你家的拍摄设备。那一万二，到底是给谁买的？
- `$case.sceneVersions[6].questionOptions[0].lines[1]` 我现在只问这一万二。
- `$case.sceneVersions[6].questionOptions[0].lines[3]` 分期呢？
- `$case.sceneVersions[7].beforeVersion.lines[3]` 抱抱来得挺是时候。先看他后面还说什么。
- `$case.sceneVersions[7].beforeVersion.lines[8]` 他说你住的房租也是另外付的。这个数没算错吧？
- `$case.sceneVersions[7].afterVersion.lines[0]` 所以这份通知昨晚就发给你了？
- `$case.sceneVersions[7].afterVersion.lines[2]` 所以他说的奖金，是这笔补偿金？
- `$case.sceneVersions[7].afterVersion.lines[4]` 补偿金是真的，可他后面紧接着发了最低还款金额。你当时怎么想的？
- `$case.sceneVersions[7].afterVersion.lines[9]` 到现在，你说的还是拿不出来，不是不想给。
- `$case.sceneVersions[7].questionOptions[0].lines[1]` 说完以后呢？
- `$case.sceneVersions[7].questionOptions[0].lines[3]` 前面十四个月的钱，你准备怎么解释？
- `$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.lines[0]` 五月、六月都有一万进来，七月 8 号却空了。给你的那两笔也是这个月一起停的吗？
- `$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.lines[2]` 那你昨晚为什么只说他奖金晚发？
- `$case.overnightStructure.callbackOpeners.两个月一次的房租.firstConflict.lines[0]` 那是你住的房子，还是他住的？
- `$case.overnightStructure.callbackOpeners.两个月一次的房租.firstConflict.lines[2]` 这件事你昨晚为什么没说？
- `$case.overnightStructure.callbackOpeners.房租是不是另外付的.firstConflict.lines[0]` 房租算在每月一万七千五里面吗？
- `$case.overnightStructure.callbackOpeners.房租是不是另外付的.firstConflict.lines[2]` 你自己的八千多工资呢？
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[0]` 这二十万，他以前跟你提过吗？
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[2]` 后面两笔宸直信托呢？
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[4]` 宸直这个名字，他以前说过吗？
- `$case.overnightStructure.callbackOpeners.往期账页.firstConflict.hostLine` 前两笔是谁转的，你知道吗？
- `$case.overnightStructure.callbackOpeners.闺蜜删掉的那条评论.firstConflict.hostLine` 她起哄，你也发了照片。可这些跟你今晚要不要转八万，不是一回事。
- `$case.sceneVersions[3].casualQuestions[0].question` 你自己一个人去过那家店吗？
- `$case.sceneVersions[3].casualQuestions[1].question` 他没发朋友圈，你当时问过他吗？
- `$case.sceneVersions[3].casualQuestions[2].question` 那晚的照片删了吗？
- `$case.sceneVersions[3].questionOptions[0].question` 刚才还是他说提前两周订的，现在又成了你订的。那时候只靠自己的收入，你会来这家吃吗？
- `$case.sceneVersions[3].questionOptions[1].question` 那晚他说过手头紧吗？
- `$case.sceneVersions[3].questionOptions[2].question` 朋友羡慕你时，你有没有说过那个位置其实是你订的？
- `$case.sceneVersions[6].casualQuestions[0].question` 探店号你做起来了吗？
- `$case.sceneVersions[6].casualQuestions[1].question` 那套设备现在还用吗？
- `$case.sceneVersions[6].questionOptions[0].question` 昨晚你只说那套设备放在你家，没说东西就是给你买的。为什么把这件事省了？
- `$case.sceneVersions[6].questionOptions[1].question` 他买设备的时候，有没有跟你说过要一起还分期？
- `$case.sceneVersions[6].dialogueOptions[0].question` 他说投资你的时候，你怎么回的？
- `$case.sceneVersions[7].entryQuestion` 接着呢？
- `$case.sceneVersions[7].casualQuestions[0].question` 你朋友现在知道多少？
- `$case.sceneVersions[7].casualQuestions[1].question` 他以前有没有说过，怕失业以后配不上你？
- `$case.sceneVersions[7].casualQuestions[2].question` “怕你离开”那句，他是打字还是语音？
- `$case.sceneVersions[7].casualQuestions[3].question` 你发朋友圈的那些朋友，后来有人来问过吗？
- `$case.sceneVersions[7].casualQuestions[4].question` 那条语音你还留着？
- `$case.sceneVersions[7].questionOptions[0].question` 你今晚打进来，是想问清这八万，还是想让我替你说一句别转？
- `$case.sceneVersions[7].questionOptions[1].question` 如果我现在只说一句‘别转’，你准备怎么跟他谈前面那些钱？
- `$case.overnightStructure.callerQuestion.options[0].label` 八万别转。但你收过多少钱、花到哪，要自己跟他说。
- `$case.overnightStructure.callerQuestion.options[1].label` 这八万是他的债；以前给你的钱怎么算，你们另外谈。
- `$case.overnightStructure.callerQuestion.options[2].label` 我只能告诉你今晚别转，不能替你证明自己一分钱都不欠。

### 终局

- `$case.deepFollowup.resistanceBeat.lines[1]` 十四个月的钱呢？
- `$case.deepFollowup.resistanceBeat.lines[3]` 花在哪儿？
- `$case.hostDisclosure.text` “先帮我垫几天”，这话我听过。以前也有人这么跟我借钱，那笔后来没要回来。你刚才一重复，我手心还是会冒汗。
- `$case.deepFollowup.question` 他按十四个月算，觉得你手里至少有十五万。你一直没给他看余额。那张卡现在还有多少？
- `$case.stageJudgement` 八万先别转。他签下的债，还是他还。你也别只盯那五千块男装：四万多共同消费，还有一万二的设备，都跟你有关。现在的余额和这一年多的钱花在哪儿，你自己告诉他。没说清的三万五，让他把账单讲清楚。你想让我替你把这些省掉，这个忙我不帮。

### 其他出声面

- `$case.sceneVersions[4].questionOptions[0].lines[1]` 那你当时以为这笔钱怎么付？
- `$case.sceneVersions[4].questionOptions[0].lines[3]` 分期你签过吗？
- `$case.sceneVersions[4].sceneCloser.lines[0]` 这一万二先单独记下来。我们把整张账单重新加一遍。
- `$case.careChoices[0].hostLine` 回去先把转账页关了。饭吃了吗？没吃煮个面。
- `$case.careChoices[1].hostLine` 今晚先别把八万全算到自己头上。你收过东西，这一块可以谈；没答应替他还债，是另一回事。
- `$case.careChoices[2].hostLine` 不急着决定。热线明晚还开，我们都在。
- `$case.sceneVersions[4].entryQuestion` 那一万二买了什么？
- `$case.sceneVersions[4].casualQuestions[0].question` 你以前真想过做探店号？
- `$case.sceneVersions[4].casualQuestions[1].question` 那句“投资你”，你当时怎么听？
- `$case.sceneVersions[4].questionOptions[0].question` 那套灯和稳定器，买完以后送到谁那里了？
- `$case.sceneVersions[4].questionOptions[1].question` 他把这笔分期叫“投资”。你当时有没有觉得，自己也该担一点？
- `$case.sceneVersions[4].questionOptions[2].question` 你说自己这两天才知道是分期。买的时候，你到底看了什么？
- `$case.sceneVersions[5].entryQuestion` 他买衣服一共五千左右。可账单里另外四万左右，都跟你有关。你开头为什么只拿衣服说事？
- `$case.sceneVersions[5].casualQuestions[0].question` 他以前跟你开过口借钱吗？
- `$case.sceneVersions[5].questionOptions[0].question` 你加完还差至少三万五，这个数对不上。你当时怎么问他的？
- `$case.sceneVersions[5].questionOptions[1].question` 这些账单上的日子，你们当时在一起吗？
- `$case.sceneVersions[5].dialogueOptions[0].question` 你当时已经准备转了吗？
- `$case.sceneVersions[5].dialogueOptions[1].question` 他后来为什么又改口？

## 案一咨询者·沈

- **固定性格：** 敏感的体面维护者
- **受压反应：** 越紧张句子越长，堆很多场面细节；一说到自己收过的钱和催过的电话就突然变短。
- **防御动作：** 先强调没有同住、工资卡不在自己手里，第一夜完全不提房租；第二天流水出现周期住房支出后，被玩家追问才承认受益人是自己。她始终把‘不想给’说成‘拿不出来’，希望主播替她完成拒绝，并继续淡化实际余额和花销。
- **知识边界：** 知道十四个月固定转账累计二十四万五、自己只剩一万一千六百多，也知道自己的消费、催款动作、见过的流水与对方说法；不知道尾号 3301 的主人。

### 夜 A

- `$case.openingDialogue[0]` 主播，我想咨询个事。我男朋友突然让我替他还八万块信用卡。
- `$case.openingDialogue[2]` 没有。转账页面都打开了，我还是没按下去。
- `$case.openingDialogue[4]` 说奖金晚发，让我先垫几天。
- `$case.openingDialogue[6]` 不想。他还一直提以前给我花过的钱。可这八万，我就是不想给。
- `$case.openingDialogue[8]` 一年半左右。
- `$case.sceneVersions[0].questionOptions[0].lines[0]` 工资卡没给我。
- `$case.sceneVersions[0].questionOptions[0].lines[2]` 会。工资一到账，转我一半。
- `$case.sceneVersions[0].questionOptions[0].lines[4]` 一年多。十四个月。
- `$case.sceneVersions[0].sceneCloser.lines[1]` 对。就这个月第一次没来。
- `$case.sceneVersions[1].afterVersion.lines[1]` 八万太多，我先让他把账单发来。工资记录他没发，只给了我一份从电子社保卡导出的缴费记录，说公司漏缴了两个月。我看了一下，最后一笔其实停在四月。可四月以后，他还天天跟我说加班。
- `$case.sceneVersions[2].beforeVersion.lines[1]` 要到了。他一开始只发最低还款那一栏，我说想看明细，他才补给我。
- `$case.sceneVersions[2].beforeVersion.lines[3]` 好，等我一下。
- `$case.sceneVersions[2].casualQuestions[2].lines[0]` 嗯。
- `$case.sceneVersions[2].casualQuestions[2].lines[2]` 一分没少。
- `$case.nightStructure.hangup` 他刚又发来一个文件，说我既然不信，就拿给你们看。姓名和卡号都遮了，只截了几个月的关键交易。我现在转后台。那三万五……我确实不知道，他不肯告诉我。我今晚再问一遍，明晚回来。
- `$case.sceneVersions[0].version` 不住在一起。他住他的，我住我的。
- `$case.sceneVersions[0].questionOptions[0].guardedAnswer` 工资卡没给我。他每个月会转一半，转了一年多。
- `$case.sceneVersions[0].questionOptions[1].answer` 也不是。他每个月固定转我一笔，转了一年多。我一直按月等。
- `$case.sceneVersions[0].questionOptions[1].guardedAnswer` 没有完全分开。他每个月固定转我一笔，转了一年多。
- `$case.sceneVersions[1].version` 没说具体哪天。他只说：“你先帮我垫几天，钱下来就还你。”我问是哪笔钱，他才说奖金。我当时就信了，以为真是临时周转。
- `$case.sceneVersions[1].casualQuestions[0].answer` 天天说忙。可几点下班、跟谁吃饭，我都不知道。我们没住一起，他说加班，我就回“早点睡”。
- `$case.sceneVersions[1].questionOptions[0].answer` 没有。他还是天天说忙，项目要上线。有一回我说给他送点吃的，他让我别去，说公司门禁严。可那阵子，他可能已经不去公司了。
- `$case.sceneVersions[1].questionOptions[0].guardedAnswer` 他说忙，我就信了。我们没住一起，我也不想天天问他在哪。
- `$case.sceneVersions[1].questionOptions[1].answer` 他说工资明细太私密，社保那张就够了，停两个月只是漏缴。我盯着那页看了半天，最后还是没拿到工资记录。
- `$case.sceneVersions[1].dialogueOptions[0].answer` 一开始没有。他就说先帮他垫一下，别让卡逾期。我追问，他才把最低还款那一栏截给我看。
- `$case.sceneVersions[1].dialogueOptions[1].answer` 我问到‘是不是工作出问题了’，他脸一下就沉了。我就没往下问。
- `$case.sceneVersions[2].version` 我先看见右上角那个数，七万九……不对，八万零几百，反正是八万出头。往下翻，男装一共五千左右，光一件大衣就两千多。我当时就想，他都没工作了，怎么还给自己买这些。别的我没细算，只看到餐厅、礼物、两次酒店，还有一套放在我家的拍摄设备，账上写着一万二分期。
- `$case.sceneVersions[2].revisedVersion` ……那些也不是我一个人花的啊，都是两个人一起出去。可你这么加，餐厅、酒店、礼物，还有设备……差不多四万，是跟我有关。
- `$case.sceneVersions[2].casualQuestions[0].answer` 人均四五百。有两家是我收藏过的，他记住了。纪念日那家靠窗，他说提前两周才订到。
- `$case.sceneVersions[2].casualQuestions[1].answer` 香水，还有一条项链。项链那次他自己发朋友圈，写“她值得”。我朋友全点赞，我还截图留着。
- `$case.sceneVersions[2].questionOptions[0].answer` 问过一次。他当时愣了一下，说‘反正不是乱来的钱’。然后我再问，他就把话岔到‘别拖，今晚先转’上去了。
- `$case.sceneVersions[2].questionOptions[0].guardedAnswer` 问过，他没细说，只说不是我该管的那部分。
- `$case.sceneVersions[2].questionOptions[1].answer` 单看五千，确实说不上挥霍。可他那时候已经没工作了，我看到以后还是会不舒服。
- `$case.sceneVersions[2].dialogueOptions[0].answer` 先看到最低还款。八千多，我手都停了一下。再往下翻，才看到那些消费明细。

### 夜 B

- `$case.sceneVersions[3].afterVersion.lines[1]` ……那家店确实难订。你等一下。会员……会员是我的。跟他在一起以前就办了。那晚也用了我的号。
- `$case.sceneVersions[3].casualQuestions[2].lines[0]` 没删。
- `$case.sceneVersions[3].casualQuestions[2].lines[2]` 舍不得。里面那盏灯拍得挺好看的。
- `$case.sceneVersions[3].questionOptions[0].lines[0]` 我一个月八千多，自己不会这么吃。
- `$case.sceneVersions[3].questionOptions[0].lines[2]` 认识他以前，我跟前任也来过几次，基本都是对方结账。那时候……约会不都这样吗。
- `$case.sceneVersions[6].questionOptions[0].lines[0]` 你们一听是给我买的，肯定就要把八万都算我头上。
- `$case.sceneVersions[6].questionOptions[0].lines[2]` ……行。这一万二是花在我身上。
- `$case.sceneVersions[6].questionOptions[0].lines[4]` 不是我签的。
- `$case.sceneVersions[7].beforeVersion.lines[0]` 等下……他又发消息了。一个『抱抱』表情包，企鹅那个。
- `$case.sceneVersions[7].beforeVersion.lines[2]` 他知道这是直播。他知道你们都看着。
- `$case.sceneVersions[7].beforeVersion.lines[4]` 有。十二点四十，又来了一条。
- `$case.sceneVersions[7].beforeVersion.lines[6]` ……跟着又来一句：『账单 26 号出』。前面还是『抱抱』，后面就变成还款日了。
- `$case.sceneVersions[7].beforeVersion.lines[7]` 还有一条：『这一年多，我每个月都给你一半，你住的房租也是我另外付。你手里少说有十五万，我只让你先拿八万。』
- `$case.sceneVersions[7].beforeVersion.lines[9]` 没算错。房租是他另外付的，余额我也一直没给他看。
- `$case.sceneVersions[7].afterVersion.lines[1]` 嗯。我当时只看到文件名，没敢点开。刚才他同意展示，我才打开。上面写着月工资三万五，待发的是解除劳动合同补偿金，预计七月底到账。
- `$case.sceneVersions[7].afterVersion.lines[3]` 对。他又发了一句：“我怕你一听我被裁了着急，也怕你马上问那两笔钱，才说成奖金。”
- `$case.sceneVersions[7].afterVersion.lines[5]` 我第一反应是，他以后是不是连结婚都不敢跟我提了。
- `$case.sceneVersions[7].afterVersion.lines[7]` 结婚……不是，他没提结婚。是我听到失业，自己往那儿想了。
- `$case.sceneVersions[7].afterVersion.lines[8]` 我以前总跟朋友夸他对我好。真到他没工作，头一回找我，就是八万。我没转，也不敢把‘不想转’说出口。
- `$case.sceneVersions[7].afterVersion.lines[10]` ……对。
- `$case.sceneVersions[7].questionOptions[0].lines[0]` ……想让你替我说。
- `$case.sceneVersions[7].questionOptions[0].lines[2]` 我会把回放发给他。
- `$case.sceneVersions[7].questionOptions[0].lines[4]` 那些我不想再跟他一笔一笔讲。
- `$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.callerLine` ……说成断了，话就重了。
- `$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.lines[1]` 对。一万七千五没来。我那天问了他好几次，他一直拿奖金晚发搪塞。
- `$case.overnightStructure.callbackOpeners.两个月一次的房租.firstConflict.lines[1]` 是我住的。他两个月替我交一万，房租不在一万七千五里面。他自己住的地方也要另外花钱。
- `$case.overnightStructure.callbackOpeners.两个月一次的房租.firstConflict.lines[3]` 我昨天只想着八万不是我欠的。我知道一说房租，弹幕肯定要骂我。
- `$case.overnightStructure.callbackOpeners.房租是不是另外付的.firstConflict.lines[1]` 不算。他每个月转一万七千五，两个月再替我交一万房租。可他当时说，房租算他帮我，不是我逼他给的。
- `$case.overnightStructure.callbackOpeners.房租是不是另外付的.firstConflict.lines[3]` 也基本花完了。我平时没算过这些，真以为他手里还有钱。
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[1]` 没有。他只说自己在看一个投资机会，没说钱是借来的。
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[3]` 我也是昨天才看到。十二号十万，十四号又十万。
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[5]` 说过。他嫌十来个点太慢，说真想翻身就得找能翻倍的。我以为他只是嘴上说说。
- `$case.overnightStructure.callbackOpeners.往期账页.firstConflict.callerLine` 不知道。他不肯说，流水上也只看得到一个姓。
- `$case.overnightStructure.callbackOpeners.闺蜜删掉的那条评论.firstConflict.callerLine` 他在拿。我昨晚也差点拿它替自己装无辜。八万不抵。
- `$case.overnightStructure.callerQuestion.options[0].lines[0]` ……我本来还想把你说的‘别转’直接发给他。可行，前面那些钱我自己跟他讲。
- `$case.overnightStructure.callerQuestion.options[1].callerLine` 好。八万我不转，之前的钱我也不拿这通直播直接堵他。我把花销列出来再谈。
- `$case.overnightStructure.callerQuestion.options[2].callerLine` ……明白。贷款让他解释，我拿过的钱和剩下的钱，我自己说。
- `$case.sceneVersions[3].version` 对。那晚坐的是靠窗位，他说两周前订的。主要贵在酒。他看中一瓶，我说太贵了。他说：“都纪念日了，总不能太寒酸。”他还是点了，我没再拦。当天只有我发朋友圈，他没发，身边朋友都挺羡慕我的。
- `$case.sceneVersions[3].casualQuestions[0].answer` 没有。不是约会就是朋友聚餐，我自己不会订靠窗那排。
- `$case.sceneVersions[3].casualQuestions[1].answer` 问过。他说自己不爱发这些，叫我发就好。我那时候没多想。
- `$case.sceneVersions[3].questionOptions[0].guardedAnswer` 我一个月八千多，自己不会常来。以前有人请，会员等级是这么攒起来的。
- `$case.sceneVersions[3].questionOptions[1].answer` 没有。他还说这顿算他的，叫我别看价格。我还挺高兴，真没看。现在账单摆出来，我才知道那句话也是刷卡。
- `$case.sceneVersions[3].questionOptions[2].answer` 没有。她们都说我没看错人，我听着挺高兴，就没解释。
- `$case.sceneVersions[6].version` 是给我买的。送到我家以后，也一直是我在用。可我当时真以为他付的全款，分期那两个字，我是这两天才在账单上看见的。
- `$case.sceneVersions[6].casualQuestions[0].answer` 发了十几条。最高一条八百多赞。他每条都转。
- `$case.sceneVersions[6].casualQuestions[1].answer` 灯上个月还开过。现在拍不动了，一开灯就想起这事。
- `$case.sceneVersions[6].questionOptions[0].guardedAnswer` 设备是在我这儿。可你们一听这个，八万是不是又都要算到我头上？分期又不是我开的。
- `$case.sceneVersions[6].questionOptions[1].answer` 没有。他说的是买来支持我做账号。我没签，也没答应一起还。这一万二确实花给了我，可他办分期的时候没跟我商量。
- `$case.sceneVersions[6].dialogueOptions[0].answer` 我没拦。还挺高兴的。那时候我真以为他是买来送我的。
- `$case.sceneVersions[7].version` 现在又来了一条语音。他说：“我只是怕你知道我失业后就离开我。”语音放完，下一条还是最低还款金额。昨晚他还发过一份文件，我一直没点开。他刚才才说，那是离职结算通知，名字已经遮了，可以给节目看。
- `$case.sceneVersions[7].casualQuestions[0].answer` 知道我们在闹别扭，不知道钱的事。我还没想好怎么开口。
- `$case.sceneVersions[7].casualQuestions[1].answer` 说过一次，喝了酒。他说自己要是混不好，就低我一头。那时候我当情话听的。
- `$case.sceneVersions[7].casualQuestions[2].answer` 语音。声音很低，我听了三遍。……然后金额是打字发的，很整齐。
- `$case.sceneVersions[7].casualQuestions[3].answer` 我闺蜜来问了。她劝我想开点，说至少没领证，她表姐那种才叫惨。……我听完更想哭了。但她是好意，我知道她是好意。
- `$case.sceneVersions[7].casualQuestions[4].answer` 留着。
- `$case.sceneVersions[7].questionOptions[0].guardedAnswer` 我想把回放发给他。前面那些钱，我不想跟他讲。
- `$case.sceneVersions[7].questionOptions[1].answer` 我可能就把回放发给他，别的先不说。至少让他别再催。余额……我还没想好怎么讲。
- `$case.overnightStructure.callbackOpeners.周会计的时间线.line` 周会计那张时间线，我看了好几遍。五月 8 号、六月 8 号都有一万，翻到七月 8 号，空的。
- `$case.overnightStructure.callbackOpeners.两个月一次的房租.line` 我又看了一遍流水。三月和五月那两笔一万，我知道你会问。
- `$case.overnightStructure.callbackOpeners.房租是不是另外付的.line` 我又看了一遍流水。一万七千五的转账后面，还跟着一笔房租。
- `$case.overnightStructure.callbackOpeners.流水圈注.line` 三月十一号那行我看见了。澄川金融打进来二十万，备注写的是借款。
- `$case.overnightStructure.callbackOpeners.往期账页.line` 前几个月还有两笔。五月 8 号、六月 8 号各进过一万，到了七月 8 号，那天是空的。
- `$case.overnightStructure.callbackOpeners.闺蜜删掉的那条评论.line` 闺蜜把删掉的评论发回来了。我看着那句‘这才像被认真对待’，脸有点烫。那场面，我也撑过。
- `$case.overnightStructure.callbackFallback.line` 我想了一晚上，还是得把话说完——你接着问吧。
- `$case.overnightStructure.postures.againstCaller` 我差点不打回来。刚才弹幕……我都听到了。你要是也觉得是我贪体面，这通我讲不下去。
- `$case.overnightStructure.postures.withCaller` 我回来了。八万的事，你继续问。我把白天重新看过的流水也带来了。
- `$case.nightStructure.returnStance.lines.defensive` 我差点不打回来。弹幕说我贪体面……我认过探店，可八万我不替他还。
- `$case.nightStructure.returnStance.lines.open` 我回来了。那三万五我又问了一遍。他怎么答的，我原话告诉你。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。隔了一天，那三万五他还是没说清。
- `$case.overnightStructure.callerQuestion.prompt` 你都问到这里了，总不能还让我把这八万转过去吧？

### 终局

- `$case.deepFollowup.resistanceBeat.lines[0]` 一万……一万一千六百多。
- `$case.deepFollowup.resistanceBeat.lines[2]` 花了。
- `$case.deepFollowup.resistanceBeat.lines[4]` 衣服、做脸，平时出门……你别让我一笔一笔念。
- `$case.deepFollowup.answer` 我自己的工资也没存下来。余额没给他看。

### 其他出声面

- `$case.sceneVersions[4].questionOptions[0].lines[0]` 送到我这儿了，东西也一直是我在用。
- `$case.sceneVersions[4].questionOptions[0].lines[2]` 我真以为那是他全款买来送我的。
- `$case.sceneVersions[4].questionOptions[0].lines[4]` 没有，也没答应替他还。
- `$case.careChoices[0].lines[0]` ……嗯。我现在就关。
- `$case.careChoices[0].lines[2]` 面就算了，我现在吃不下。
- `$case.careChoices[1].lines[0]` ……这句我存下了。语音的那种存。
- `$case.careChoices[2].lines[0]` 明晚……明晚我大概不打了。但我会听。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 等等——他刚发我消息。
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 一张截图。上面还有一句：‘你闺蜜把链接发我了。’他在听。
- `$case.overnightStructure.liveCounterBeats[0].choices[0].lines[0]` 继续。我本来就是来问这笔账的，不能他一听见，我就不敢说了。
- `$case.overnightStructure.liveCounterBeats[0].choices[1].lines[1]` 继续吧。我不回他，先把这笔账说完。
- `$case.overnightStructure.liveCounterBeats[0].choices[2].lines[0]` 要。后面他再发什么，我只念我愿意念的。
- `$case.sceneVersions[4].version` 那一万二买的是拍视频用的灯和稳定器。他当时跟我说：“账号做起来，你就不用看别人脸色。”还说这是在投资我。我以前念叨过想做探店号，听到这句，确实挺高兴。我一直以为那是他全款买来送我的。这两天看到账单，我才知道那一万二走的是分期。
- `$case.sceneVersions[4].casualQuestions[0].answer` 想过，断断续续念了几个月。我关注了好些博主，有个杭州的姑娘，拍面馆的，就一个手机加个小支架，拍得特别香，她粉丝可多了。我还研究过转场，就那种一挥手换一家店的……哎，说这个干嘛。反正，真要拍我又总说没设备。现在设备倒是有了。
- `$case.sceneVersions[4].casualQuestions[1].answer` 很甜，也很有面子。像他认真把我的事当事。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 送到我这儿了，一直是我用。可他说的是给我做账号，我怎么知道他刷的是分期。
- `$case.sceneVersions[4].questionOptions[1].answer` 没有。我当时听见的是他要支持我做账号。东西送到我这儿以后，我也一直在用，可我真以为是他全款买来送我的，没想过还款会落到我头上。
- `$case.sceneVersions[4].questionOptions[2].answer` 我只看了他挑的那套设备，没看怎么付的钱。东西送到我这儿，我就用了。
- `$case.sceneVersions[5].version` ……那些也不是我一个人花的。可四万里，确实有我那一份。
- `$case.sceneVersions[5].casualQuestions[0].answer` 没有。一次都没有，所以这次我才慌。他那个人，以前连打车钱都不让我掏。
- `$case.sceneVersions[5].questionOptions[0].answer` 问过一次。他当时愣了一下，说“反正不是乱来的钱”。然后我再问，他就把话岔到“别拖，今晚先转”上去了。
- `$case.sceneVersions[5].questionOptions[0].guardedAnswer` 问过，他没细说。只说不是我该管的那部分。
- `$case.sceneVersions[5].questionOptions[1].answer` 近几个月能对上。再往前……我把页面关了。一个人没敢看完。
- `$case.sceneVersions[5].dialogueOptions[0].answer` 差一点。页面都打开了。就是看到到期日那里，我才停住。
- `$case.sceneVersions[5].dialogueOptions[1].answer` 他说我别紧张，这几天转也行。可前面那句“今晚就要”已经把我吓到了。

## 案一男友

- **固定性格：** 羞耻驱动的防御者
- **受压反应：** 被问金额时把问题改写成信任和离开。
- **防御动作：** 把离职补偿说成奖金，把二十四万五累计给付算成女友至少还有十五万，再用她的催款和关系词解释自己的冒险。
- **知识边界：** 知道自己的失业、贷款、十四个月转账与八万元请求，也知道自己只是估算女友至少还有十五万；对她的真实余额和他人账户身份不能装作早已知道。

### 后台／材料回流

- `$case.respondentNote.text` 十四个月就是二十四万五。我以为她最少能剩十五万，才开口要八万。奖金那句……不是奖金，是离职补偿。我不敢说自己被裁。三月那二十万是从澄川借的，后来买了宸直的产品。我当时真觉得能翻倍。借款是我签的，宸直也是我自己买的。三万五那部分，我不在这里说。

## 案一闺蜜

- **固定性格：** 爱热闹又怕丢脸
- **受压反应：** 先强调自己只是起哄，再缩短回答。
- **防御动作：** 把自己的动作说成气氛到了。
- **知识边界：** 只知道朋友圈、饭局和自己删过的评论，不知道男方账目。

### 后台／材料回流

- `$case.investigationHooks[0].material` 闺蜜补来的朋友圈截图发在纪念日晚餐那晚，定位是她常去的那家店，配文写“终于有人把日子过得体面一点”。闺蜜补了句话：“那晚我跟着起哄了，‘这才像被认真对待’是我评的。昨天删了，怕她看见难堪。还有，她那阵子天天拍探店，灯和稳定器……是不是那笔分期买的？”

## 案一男方前同事

- **固定性格：** 谨慎的人情债务人
- **受压反应：** 问题靠近钱的去向时只剩一句拒答。
- **防御动作：** 承认早年的阔，不谈后来钱路。
- **知识边界：** 只知道失业前的阔绰与旧账，不知道咨询者和男方的现在。

### 后台／材料回流

- `$case.investigationHooks[1].material` 前同事说：“他以前阔过，阔得早。请客、送礼、订酒店，真不是认识她以后才学会的。欠过他人情，我只能说到这儿。钱后来去哪儿、五月六月那两笔怎么回事，我不说，也别问我。”

## V哥

- **固定性格：** 沉着的直觉教练
- **受压反应：** 玩家越急，他越让人停一下，只比较两件已知事物。
- **防御动作：** 短句，先停，再分开看。
- **知识边界：** 只知道玩家当前已经听见或看见的内容。

### 夜 A

- `$case.sceneVersions[0].helperHint` 没住在一起，只说明住址分开。她每个月等的是哪笔钱，得继续问。
- `$case.sceneVersions[1].helperHint` 先把“奖金晚发”和“社保停了两个月”分开看：他开口借钱前，哪件事没说。
- `$case.sceneVersions[2].helperHint` 先别替这八万找理由。问她哪些钱她认，哪些连她也不知道花到哪儿了。

### 夜 B

- `$case.sceneVersions[3].helperHint` 她承认是老会员以后，先别急着评价。看看长期消费和她当时的收入能不能对上。
- `$case.sceneVersions[6].helperHint` 先问清这笔钱买给了谁，再把受益和还款责任分开。
- `$case.sceneVersions[7].helperHint` 她一直说‘拿不出来’，却没说过自己其实不想给。问她这一晚到底想从主播这里带走什么。

### 其他出声面

- `$case.sceneVersions[4].helperHint` “投资”是称呼，不是证据。先看东西最后在哪、谁实际用过。
- `$case.sceneVersions[5].helperHint` 八万已经按餐厅、酒店、礼物、设备和男装分开算了。只看还有多少钱没说明用途，先别替他猜。

# 职场报销截图

## 林旭阳

- **固定性格：** 温热、有分寸，也有明确好恶
- **受压反应：** 事实没闭合时先缩短句子，把混在一起的事拆开；证据已经对齐，对方还在把自己的代价甩给别人时，他会收笑、直说，火气只落在具体做法上。
- **防御动作：** 把感情和责任分开问，事实不够时不用火气补证据；事实够了，也不拿中立当成不表态的借口。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 夜 A

- `$case.openingDialogue[1]` 写的什么？
- `$case.openingDialogue[3]` 信用卡账单已经出了？
- `$case.openingDialogue[5]` 那你为什么还没发？
- `$case.openingDialogue[7]` 你们公司做什么？
- `$case.openingDialogue[9]` 这次也是铺点的活动？
- `$case.openingDialogue[11]` 可这张卡你也得还。
- `$case.openingDialogue[13]` 垫钱这件事，当时是谁先提的？
- `$case.sceneVersions[0].questionOptions[0].lines[1]` 后面呢？
- `$case.sceneVersions[0].questionOptions[0].lines[3]` 你回了什么？
- `$case.sceneVersions[0].questionOptions[0].lines[5]` 额度不够呢？
- `$case.sceneVersions[0].questionOptions[1].lines[1]` 你回了什么？
- `$case.sceneVersions[0].questionOptions[1].lines[3]` 后来问了吗？
- `$case.sceneVersions[1].questionOptions[1].lines[1]` 为什么？
- `$case.sceneVersions[1].questionOptions[1].lines[3]` 你问过他吗？
- `$case.sceneVersions[2].questionOptions[0].lines[1]` 那你每次看了什么？
- `$case.sceneVersions[2].questionOptions[1].lines[1]` 你没再问？
- `$case.nightStructure.hangup.hostLine` 你先把图和发票找齐。明天问完，再把对方怎么回的原话告诉我。
- `$case.sceneVersions[0].entryQuestion` 你当时为什么答应先垫？
- `$case.sceneVersions[0].casualQuestions[0].question` 你主动说能接，是在群里说的，还是当面说的？
- `$case.sceneVersions[0].casualQuestions[1].question` 那位同事平时对你怎么样？
- `$case.sceneVersions[0].questionOptions[0].question` 他那条私聊，是先说让你负责这次活动，还是先说要你垫钱？
- `$case.sceneVersions[0].questionOptions[1].question` 你答应先垫时，有没有问这钱最后谁来还？
- `$case.sceneVersions[1].entryQuestion` 你说活动后补流程。活动前一天，群里发过正式流程吗？
- `$case.sceneVersions[1].casualQuestions[0].question` 那张流程表现在还在群里吗？
- `$case.sceneVersions[1].casualQuestions[1].question` 你以前自己走过这套流程吗？
- `$case.sceneVersions[1].questionOptions[0].question` 流程表明明写着个人垫付要先报备。你为什么还是刷了自己的卡？
- `$case.sceneVersions[1].questionOptions[1].question` 你回了‘收到’，当时以为表里空着的预算会由谁补？
- `$case.sceneVersions[2].entryQuestion` 这六万八刷出去以后，他拿什么让你继续等？
- `$case.sceneVersions[2].casualQuestions[0].question` 信用卡账单出来以后，你准备怎么还？
- `$case.sceneVersions[2].casualQuestions[1].question` 财务那边你认识人吗？
- `$case.sceneVersions[2].casualQuestions[2].question` 你以前用个人信用卡垫过公司的钱吗？
- `$case.sceneVersions[2].questionOptions[0].question` 三次发来的图，有没有哪一次多了新的内容？
- `$case.sceneVersions[2].questionOptions[1].question` 他每次把这张图发回来，有没有说过具体哪天到账？

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[1]` 公司抬头，原件还在她手里。
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[0]` 那我让她先拿公司抬头发票提报销，拿到申请编号。
- `$case.overnightStructure.dayScenes[0].body.choice.options[1].resultBeats[0]` 只有 LX 开头的立项单号，窗口查不了她的个人报销。
- `$case.overnightStructure.dayScenes[1].body.beats[1]` 每一层都要返？
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[0]` 我把三栏一起拍下来。只拍岗位和名目，姓名、支付状态、账户全遮掉。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[0]` 那我把语音原句带回去：“每一层的返费结完，下一批点位才往下走。”
- `$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[1]` 明白。我把单据类型原样拍下来，不把立项写成报销。
- `$case.overnightStructure.dayScenes[2].body.choice.options[1].resultBeats[1]` 那我把缺的这句拍下来，别的回去再问。

### 夜 B

- `$case.sceneVersions[3].questionOptions[0].lines[1]` 公司抬头的发票原件呢？
- `$case.sceneVersions[3].questionOptions[0].lines[3]` 那你为什么不自己提报销？
- `$case.overnightStructure.callbackOpeners.她整理的报销时间线.firstConflict.hostLine` 先看十四点二十二分。财务那时还没说延后，他让你别问，你怎么回的？
- `$case.overnightStructure.callbackOpeners.财务窗口补报销要求.firstConflict.hostLine` 正式报销都还没提，你这三个星期在等什么？
- `$case.overnightStructure.callbackOpeners.立项单号拒查记录.firstConflict.hostLine` 你手里连报销编号都没有。明天第一件事做什么？
- `$case.overnightStructure.callbackOpeners.供应商返费原话.firstConflict.hostLine` 这句话能让你确认什么？
- `$case.overnightStructure.callbackOpeners.供应商返费三层表.firstConflict.hostLine` 三层都有返费。他那一层到底拿没拿，你今晚要他补什么？
- `$case.overnightStructure.callbackOpeners.茶水间立项缺口.firstConflict.hostLine` 公司抬头发票一直在你手里。你为什么没自己提报销？
- `$case.overnightStructure.callbackOpeners.茶水间责任对照.firstConflict.hostLine` 活动总结写了你负责。有没有人书面写过谁负责催付款？
- `$case.overnightStructure.callbackOpeners.立项页不是报销单.firstConflict.hostLine` 你问了三次报销，对方为什么一直拿立项页回你？
- `$case.overnightStructure.callbackOpeners.预算时间线复核.firstConflict.hostLine` 他当时拿什么让你别在群里问？
- `$case.overnightStructure.callbackOpeners.领导批注.firstConflict.hostLine` 那句夸奖落下来时，你有没有问六万八什么时候回？
- `$case.overnightStructure.callbackOpeners.垫款回放.firstConflict.hostLine` 你回“我来扛”时，知道自己要垫六万八吗？
- `$case.sceneVersions[3].entryQuestion` 后来公司有人公开提过这次活动吗？
- `$case.sceneVersions[3].casualQuestions[0].question` 领导当场知道你刷了个人卡吗？
- `$case.sceneVersions[3].casualQuestions[1].question` 那句老规矩是谁先接的话？
- `$case.sceneVersions[3].casualQuestions[2].question` 会后他单独回过你吗？
- `$case.sceneVersions[3].questionOptions[0].question` 领导那句里，提没提这六万八什么时候还？
- `$case.sceneVersions[3].questionOptions[1].question` 被点名以后，你为什么又等了一天？
- `$case.sceneVersions[4].entryQuestion` 他们发来让你确认的那张表，最后怎么写的？
- `$case.sceneVersions[4].casualQuestions[0].question` 表发回来以后，你先看了哪一栏？
- `$case.sceneVersions[4].casualQuestions[1].question` 如果重来一次，你还接这个活吗？
- `$case.sceneVersions[4].questionOptions[0].question` 这张表一确认，活动要是出了问题，公司先找谁？
- `$case.sceneVersions[4].questionOptions[1].question` 你想过在那张表里加一句‘个人垫款还没报销’吗？

### 终局

- `$case.deepFollowup.resistanceBeat.lines[1]` 只写你现在能证明的。
- `$case.deepFollowup.resistanceBeat.lines[3]` 行，发。
- `$case.hostDisclosure.text` 我听见你把‘公司一直不给我报销’打进群里，第一下也想替你骂。可你连正式报销都没提，这句话真发出去，只会把六万八又绕进一场吵架。
- `$case.deepFollowup.question` 群输入框里那句‘公司一直不给我报销’还在。现在你准备怎么写？
- `$case.stageJudgement` 你看过报备，“我来扛”也是你回的。这个得认。可他拿“来不及”催你刷个人卡，三个星期只发立项页，就是看准你想表现。明天带上发票，自己走正式报销。拿到单号以后，直接问财务哪天付款。

### 其他出声面

- `$case.careChoices[0].hostLine` 明天到公司，先把刷卡记录和那条消息发进去。有人问为什么没报备，你照实说。
- `$case.careChoices[1].hostLine` 你想接活动没问题。可六万八是六万八，别因为怕难看就一直不问。
- `$case.careChoices[2].hostLine` 下周一开会前，你要是又想把那句话删掉，就打过来。
- `$case.overnightStructure.liveCounterBeats[1].choices[0].lines[1]` 他只认了你垫过，没说报销单在哪儿，也没说月底是提交还是打钱。
- `$case.overnightStructure.liveCounterBeats[1].choices[1].lines[2]` 截图只认了你垫过。报销单、提交日期和打款日期，还是一项都没有。

## 第二通咨询者·陈

- **固定性格：** 想证明能扛事的焦虑新人
- **受压反应：** 害怕时句子越来越短；复述公司话时给流程词加引号。
- **防御动作：** 把主动承担说成‘让我垫’，用流程词遮住个人选择。
- **知识边界：** 知道公司做共享充电柜和储物柜、宸直是主要股东之一，也知道自己参与的项目、私聊、垫款和收到的截图；下麦前拿到三层供应商返费表，但不知道各笔是否实际支付及最终账户。

### 夜 A

- `$case.openingDialogue[0]` 主播你好，我想问件公司里的事。我有句话打在工作群输入框里，一直没敢发。
- `$case.openingDialogue[2]` “公司一直不给我报销。”
- `$case.openingDialogue[4]` 出了。六万八，我自己的卡。钱还没回来。
- `$case.openingDialogue[6]` 这次活动是我刚争来的。我怕一发出去，以后就不让我碰客户活动了。
- `$case.openingDialogue[8]` 栖行共享科技，做共享充电柜和储物柜。宸直是主要股东之一，公司最近又在讲估值涨了、点位铺得快。
- `$case.openingDialogue[10]` 城市合伙人的招商会，老板会到。我才想把它接下来。
- `$case.openingDialogue[12]` 所以我才不知道怎么开口。
- `$case.openingDialogue[14]` 一个同事私聊我，说今天来不及走流程，让我先垫上。
- `$case.sceneVersions[0].casualQuestions[1].lines[0]` 有回我加班到十点，他给我留了盏灯，桌上还贴了张“早点回”。
- `$case.sceneVersions[0].casualQuestions[1].lines[2]` 那张便利贴我留着，夹在工牌套后面。后来他让我别去群里问预算，我也更愿意信他会补流程。
- `$case.sceneVersions[0].questionOptions[0].lines[0]` 先说垫钱。
- `$case.sceneVersions[0].questionOptions[0].lines[2]` 说活动总结会写我负责。
- `$case.sceneVersions[0].questionOptions[0].lines[4]` ‘我来扛。’报销怎么走，我没问。
- `$case.sceneVersions[0].questionOptions[0].lines[6]` 我自己申请了临时提额。那时候我是真想让老板把这次活动交给我。
- `$case.sceneVersions[0].questionOptions[1].lines[0]` 没有。他说活动后补流程。
- `$case.sceneVersions[0].questionOptions[1].lines[2]` “我来扛。”
- `$case.sceneVersions[0].questionOptions[1].lines[4]` 我把“这钱谁还”打了一遍，最后删了。
- `$case.sceneVersions[1].questionOptions[0].lines[0]` 14：22，他私聊我，说比价来不及，让我别在群里问预算，先刷自己的卡，活动结束再补。
- `$case.sceneVersions[1].questionOptions[0].lines[1]` 后面又来一句，‘别让领导觉得你不担事。’我看着输入框里的‘预算多少’，最后还是删了。
- `$case.sceneVersions[1].questionOptions[1].lines[0]` 我以为是他。
- `$case.sceneVersions[1].questionOptions[1].lines[2]` 供应商是他找的，预算也在他手里。
- `$case.sceneVersions[1].questionOptions[1].lines[4]` 没有。
- `$case.sceneVersions[2].casualQuestions[2].lines[0]` 没有。以前最多垫过打车，第二天就能报。
- `$case.sceneVersions[2].casualQuestions[2].lines[2]` 六万八，是第一次。
- `$case.sceneVersions[2].questionOptions[0].lines[0]` 没有，三张一模一样。
- `$case.sceneVersions[2].questionOptions[0].lines[2]` 就看见上面写着“审批通过”。我根本没往下翻。
- `$case.sceneVersions[2].questionOptions[1].lines[0]` 没有。每次就那四个字：“流程在走。”
- `$case.sceneVersions[2].questionOptions[1].lines[2]` 没有。我真没往下看。后来财务一说延后，我更觉得只是晚几天。
- `$case.nightStructure.hangup` 等一下，我把那三张图重新找出来。发票我明天也带去问问。
- `$case.sceneVersions[0].version` 小会上，我刚当着老板的面说，城市合伙人的招商会我能接。他私聊过来：“你先把场地和礼品费垫了。活动总结里，我写你是负责人。”我几乎马上就回了。
- `$case.sceneVersions[0].casualQuestions[0].answer` 部门小会上说的，老板也在。我说这活我能接。
- `$case.sceneVersions[0].questionOptions[0].guardedAnswer` 他先提垫钱。我看到后面会写我负责，就……回了。额度不够，也是我自己去提的。
- `$case.sceneVersions[1].version` 发过。客户把日子提前了两天。14：05，部门助理在大群发了流程表，上面写着预算要填金额，个人垫付要先报备。我点开了，也回了“收到”。
- `$case.sceneVersions[1].revisedVersion` 等一下，时间不对。两点二十二，他就让我别在群里问了。财务说延后，是九天后的事。那时候我还没看见通知，已经把群关了。
- `$case.sceneVersions[1].casualQuestions[0].answer` 在。我回完“收到”以后就没再点开，刚才已经截下来了。
- `$case.sceneVersions[1].casualQuestions[1].answer` 没有。以前最多垫过打车费，这么大的活动是第一次。
- `$case.sceneVersions[1].questionOptions[0].guardedAnswer` 14：22，他私聊让我别在群里问预算，还拿领导压我。我把那句‘预算多少’删了。
- `$case.sceneVersions[2].version` 活动后，他发来一张审批页，顶上写着“审批通过”。我问什么时候回来，他又发一次。第二天再问，还是它。就这一张图，他发了三次，每次都说“流程在走”。
- `$case.sceneVersions[2].casualQuestions[0].answer` 我还没想好。手头的钱不够一次还清，又不想做最低还款，所以才越来越慌。
- `$case.sceneVersions[2].casualQuestions[1].answer` 不认识。入职培训见过一面。真要问，也得同事引荐，又绕回他。
- `$case.sceneVersions[2].questionOptions[0].guardedAnswer` 没有，三次都是同一张。我当时没往下看。

### 夜 B

- `$case.sceneVersions[3].questionOptions[0].lines[0]` 没提。谁来还、哪天还，都没说。我当时只顾着截自己的名字。
- `$case.sceneVersions[3].questionOptions[0].lines[2]` 还在我抽屉里。三个星期了，一直没交。
- `$case.sceneVersions[3].questionOptions[0].lines[4]` 我怕财务先问我为什么没报备。也总觉得，他既然说会补，就会替我办。
- `$case.overnightStructure.callbackOpeners.她整理的报销时间线.firstConflict.callerLine` 我回“我来扛”。他让我别问，我也真没问。
- `$case.overnightStructure.callbackOpeners.财务窗口补报销要求.firstConflict.callerLine` 我在等他替我办。可发票一直在我手里，我也没问报销单号。
- `$case.overnightStructure.callbackOpeners.立项单号拒查记录.firstConflict.callerLine` 拿发票去提正式报销，把申请编号发到群里。
- `$case.overnightStructure.callbackOpeners.供应商返费原话.firstConflict.callerLine` 返费不是只经过一个人。可哪一笔真的付了、最后进谁账户，我还是看不出来。
- `$case.overnightStructure.callbackOpeners.供应商返费三层表.firstConflict.callerLine` 供应商的支付记录。得有支付状态和收款账户。
- `$case.overnightStructure.callbackOpeners.茶水间立项缺口.firstConflict.callerLine` 我一直等他补。等了三个星期，发票还夹在我抽屉里。
- `$case.overnightStructure.callbackOpeners.茶水间责任对照.firstConflict.callerLine` 没有。负责人的位置有我的名字，催款的人没写。
- `$case.overnightStructure.callbackOpeners.立项页不是报销单.firstConflict.callerLine` 他说流程在走，我就没往下看。到底有没有替我提过报销，我现在真不知道。
- `$case.overnightStructure.callbackOpeners.预算时间线复核.firstConflict.callerLine` 就说来不及，还说别让领导觉得我不担事。财务慢，是我后来替他补的。
- `$case.overnightStructure.callbackOpeners.领导批注.firstConflict.callerLine` 没有。我先截图发给朋友了。
- `$case.overnightStructure.callbackOpeners.垫款回放.firstConflict.callerLine` 不知道具体金额。我以为只是先把活接下来，真让我刷卡时，我也没敢追问这算谁的责任。
- `$case.sceneVersions[3].version` 活动结束以后，部门开了个小会。领导当众说：“客户反馈不错，这次活动负责人写小陈，流程该补的补齐。”我一听见自己的名字，马上截了图发给朋友，后半句根本没细看。今天再往前翻，14：05 那张流程表还在，我回的“收到”也还在。
- `$case.sceneVersions[3].revisedVersion` 批注我又看了一遍。活动负责人是我，付款那一栏空着。下周一开会前要确认，可我点了确认，六万八也回不到信用卡里。
- `$case.sceneVersions[3].casualQuestions[0].answer` 我不确定。会上没人说“个人卡”三个字。说的都是执行效率、客户反馈。
- `$case.sceneVersions[3].casualQuestions[1].answer` 他回得最快，说会补齐。可我后来问了几次，还是只有他发来的活动立项页。正式报销谁来提，我一句都没问到。
- `$case.sceneVersions[3].casualQuestions[2].answer` 没有。他在会上说会补流程，散会以后就没再找我。
- `$case.sceneVersions[3].questionOptions[0].guardedAnswer` 写了我名字。我那时候只顾着截图。
- `$case.sceneVersions[3].questionOptions[1].answer` ……因为我高兴。领导念到我名字，我先截图了。可真要追钱，别人就会问我为什么没报备。我一想到这儿，又拖了一天。
- `$case.sceneVersions[4].version` 这份表的初稿是我写的。写到凌晨两点多，呃，写完还挺兴奋的。我给我妈发消息，说老板第一次让我独立负责这么大的活动。她第二天回了个大拇指。后来他拿去改，发回来让我确认：活动负责人写的是我，付款经办人写的是他。下周一开会前就得确认，我现在还没点。群里那句‘公司一直不给我报销’，我打好了，也一直没敢发。
- `$case.sceneVersions[4].casualQuestions[0].answer` 先看负责人。还是我。付款经办人那一栏，我是今晚才认真看。
- `$case.sceneVersions[4].casualQuestions[1].answer` 接。但会先在群里问一句预算。就一句，够了。
- `$case.sceneVersions[4].questionOptions[0].answer` 先找我，因为表上写我是活动负责人。可我要催付款，还得找他。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 先找我。写着我负责啊。
- `$case.sceneVersions[4].questionOptions[1].answer` 想过。可一加，别人先问的就是我为什么私下垫钱。写上去，我先挨问；不写，信用卡账单还是我的。
- `$case.overnightStructure.callbackOpeners.她整理的报销时间线.line` 14：05 助理发流程，14：22 他就让我别在群里问。财务说延后，是九天以后才来的。
- `$case.overnightStructure.callbackOpeners.财务窗口补报销要求.line` 财务窗口看了一眼就说，那三张都是活动立项，不是我的报销。我手里的公司抬头发票，原件还没交。
- `$case.overnightStructure.callbackOpeners.立项单号拒查记录.line` 窗口拿那串 LX 单号查不了个人报销。那是立项编号，不是报销编号。
- `$case.overnightStructure.callbackOpeners.供应商返费原话.line` 供应商那句语音很短：‘每一层的返费结完，下一批点位才往下走。’哪笔付了、最后进谁账户，还是没说。
- `$case.overnightStructure.callbackOpeners.供应商返费三层表.line` 供应商返费表列了三层：点位协调、渠道维护、采购配合。他在采购经办那一栏，可支付状态和账户都遮着。这张表和公司报销不是一回事。
- `$case.overnightStructure.callbackOpeners.茶水间立项缺口.line` 助理把三页摊在桌上。私聊叫我别问预算，领导批注只写我负责，剩下那张又只是活动立项。我的报销单，根本不在里面。
- `$case.overnightStructure.callbackOpeners.茶水间责任对照.line` 私聊让我别问预算，领导后来只写了我负责。我来回看了几遍，也没找到谁负责催付款。
- `$case.overnightStructure.callbackOpeners.立项页不是报销单.line` 我又看了那三张图。单据类型全是活动立项，编号也都是 LX 开头，连报销申请编号都没有。
- `$case.overnightStructure.callbackOpeners.预算时间线复核.line` 他让我别在群里问预算时，财务还没发延后通知。我把日期看岔了，昨晚那句不算。
- `$case.overnightStructure.callbackOpeners.领导批注.line` 领导那条批注，我又看了。只写了我负责，一个钱字都没有。我当时高兴，是真的。账也还在。
- `$case.overnightStructure.callbackOpeners.垫款回放.line` 那句私聊我重新放了。‘你先把场地和礼品费垫了。活动总结里，我写你是负责人。’钱在前，负责人在后。可我当时只顾着高兴，马上回了“我来扛”。
- `$case.overnightStructure.callbackFallback.line` 我回来了。新批注还在手机里。你白天先看了哪份材料？
- `$case.overnightStructure.postures.againstCaller` 这次活动是我先争取的，“我来扛”也是我回的。我认。可钱还是没回来。
- `$case.overnightStructure.postures.withCaller` 那三张立项页我都留着，群里的流程表也翻出来了。你问吧。
- `$case.nightStructure.returnStance.lines.defensive` 我差点没敢再打。弹幕说得也没错，这次活动是我自己想接的。可那六万八不能就这么算了。
- `$case.nightStructure.returnStance.lines.open` 我回来了。白天财务一眼就看出来，那三张是立项页，不是我的报销。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。新批注还在手机里，那张立项页也还在。正式报销单还是没有。

### 终局

- `$case.deepFollowup.resistanceBeat.lines[0]` 我先把‘公司一直不给我报销’删了。
- `$case.deepFollowup.resistanceBeat.lines[2]` 六万八是我个人卡刷的，发票原件在我这儿。我要正式报销单号，还有预计付款日期。这样行吗？
- `$case.deepFollowup.answer` 发了。周一老板怎么问，我自己答。

### 其他出声面

- `$case.careChoices[0].lines[0]` ……呃，行。我明天早点去。
- `$case.careChoices[1].lines[0]` ……嗯。
- `$case.careChoices[1].lines[2]` 我就是怕一说钱，别人觉得我不配负责这么大的活动。
- `$case.careChoices[2].lines[0]` 你还真知道我会删。
- `$case.careChoices[2].lines[2]` 你们也早点睡吧。
- `$case.overnightStructure.returnBeat.lines[0]` 等一下，我把工作群的提示音关了。它一响，我就以为钱回来了。……关了，你说。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 弹幕里有人说我蠢。
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 看见了。你们肯定觉得，六万八怎么能就这么刷出去。可他当时说会在活动总结里写我负责，我脑子里就只剩这句话了。
- `$case.overnightStructure.liveCounterBeats[0].lines[4]` 这六万八，我刷卡的时候连报备都没做。你们骂得难听，可这句我没法反驳。
- `$case.overnightStructure.liveCounterBeats[0].choices[0].lines[0]` ……好。
- `$case.overnightStructure.liveCounterBeats[0].choices[1].lines[0]` ……嗯。对账。
- `$case.overnightStructure.liveCounterBeats[0].choices[2].lines[1]` ……行。
- `$case.overnightStructure.liveCounterBeats[0].choices[2].lines[3]` 行，继续。
- `$case.overnightStructure.liveCounterBeats[1].lines[0]` 工作群刚弹出一条，是他说的。我正要念。
- `$case.overnightStructure.liveCounterBeats[1].choices[0].lines[0]` ‘陈先垫的六万八，等月底财务集中报销时一起办，大家辛苦。’他终于肯在群里认这六万八了。那我是不是就不用再单独发了？
- `$case.overnightStructure.liveCounterBeats[1].choices[1].lines[1]` 刚才那条撤回了。我截到了，已经发后台。

## 职场案同事

- **固定性格：** 圆滑的责任切割者
- **受压反应：** 被问到账和署名时，会反复强调活动是对方主动争取的，再把付款推给财务。
- **防御动作：** 只回答眼前被问到的那一步，随后把选择说成咨询者自愿，把延迟推给财务。
- **知识边界：** 知道自己发出的私聊、审批和署名安排，也知道栖行的点位项目存在多层返费；未有材料时不替财务付款、各层支付状态或供应商返费账户作证。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[0]` 立项批了，别再往大群里问。

### 后台／材料回流

- `$case.respondentNote.text` 六万八我没赖。她问进度时，我手里只有那张立项页，就先发给她了。正式报销还得拿发票去提。活动是她自己要接的，“我来扛”也是她回的，不能全算我逼她。

## 职场案财务经办

- **固定性格：** 冷静的程序理性派
- **受压反应：** 争执越大越只报节点和缺件。
- **防御动作：** 不给评价，只列系统状态。
- **知识边界：** 只知道通用财务节点与经办材料，不知道私聊动机和供应商项目返利归属。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 这不是报销审批，是活动立项。单据类型和 LX 编号都写着。发票抬头开的谁？
- `$case.overnightStructure.dayScenes[0].body.beats[2]` 那先拿发票提正式报销。报销单出来，再问预计付款日期和回单。
- `$case.overnightStructure.dayScenes[0].body.beats[3]` 拿着立项页等不到账。下一位。
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[1]` 对。有报销单，再问什么时候付。
- `$case.overnightStructure.dayScenes[0].body.choice.options[1].resultBeats[1]` 对。报销申请都没有，先别往付款和收款人上猜。

## 职场案供应商项目员

- **固定性格：** 谨慎的中立执行者
- **受压反应：** 问题越敏感越退回对公记录。
- **防御动作：** 只确认本方收款与联系人。
- **知识边界：** 只知道供应商一侧的项目联系人、内部结算页和工作语音；不知道返利是否支付或最终账户，也看不到客户公司的报销。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 以前不是只找一个项目联系人。招商主管一栏叫点位协调费，区域经理叫渠道维护费，采购经办叫采购配合费。
- `$case.overnightStructure.dayScenes[1].body.beats[2]` 表上是这么列的。这个项目里，他在采购经办那一栏。哪一笔付了、最后进谁账户，我没经手。
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[1]` 可以。表能看出各层都要返费，看不出钱最后进了谁的口袋。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[1]` 原话带走。哪笔付了、给了谁，还得另查。

## 职场案仓库管理员

- **固定性格：** 朴实的记录主义者
- **受压反应：** 只让人翻页、对日期，不接关系判断。
- **防御动作：** 认单、认页、不认口头身份。
- **知识边界：** 只知道仓库收货、出入库单与日期。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[3]` 这张表是供应商返费。她那六万八是公司报销，两件事别混着问。

## 职场案部门助理

- **固定性格：** 规则型自保者
- **受压反应：** 逐字复述模板，不评价任何私聊。
- **防御动作：** 只给群模板与样本，拒绝解释人的意思。
- **知识边界：** 只知道公开群流程与样本，不知道私聊和钱的去向。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[1]` 领导批注我只核过这一句：这次活动负责人写小陈，流程该补的补齐。
- `$case.overnightStructure.dayScenes[2].body.beats[2]` 这张是活动立项，LX 开头。报销单不归我看，那句私聊也不是我发的。
- `$case.overnightStructure.dayScenes[2].body.beats[3]` 流程表我那天在群里发过。个人垫付要先报备，供应商走对公还得附报价比较。
- `$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[0]` 这三页我都翻过了，只有活动立项，没有她的报销申请。别的你别问我，我也不知道。
- `$case.overnightStructure.dayScenes[2].body.choice.options[1].resultBeats[0]` 私聊让她别问预算，领导后来只写了她负责活动。谁负责催付款，我这儿没看到。

### 后台／材料回流

- `$case.investigationHooks[0].material` 部门助理补充：正常客户活动单先由执行人填预算，个人垫付需要提前报备；供应商走对公时要附报价比较。她说“我只按模板发流程，不判断谁私下说了什么”。

## 职场案领导

- **固定性格：** 冷硬的结果主义者
- **受压反应：** 出现流程事故时，只催项目交付和活动总结。
- **防御动作：** 把旧规矩当执行细节，只认结果和汇报。
- **知识边界：** 知道活动总结与负责人署名，不知道垫款金额、公司付款账户和供应商返利归属。

### 收麦幕间

- `$case.nightStructure.interlude.actions[1].text` 下周一照常开季度总结会，负责人就按现在这份名单写。你们没报备的那几项，开会前自己补上。

### 后台／材料回流

- `$case.investigationHooks[1].material` 领导批注：“客户反馈不错，这次活动负责人写小陈；流程该补的补齐。别让这点流程问题影响部门这季度的成绩。”批注里没有垫款金额、付款账户、供应商联系人。

## V哥

- **固定性格：** 沉着的直觉教练
- **受压反应：** 玩家越急，他越让人停一下，只比较两件已知事物。
- **防御动作：** 短句，先停，再分开看。
- **知识边界：** 只知道玩家当前已经听见或看见的内容。

### 夜 A

- `$case.sceneVersions[0].helperHint` 把私聊拆成两半：他给了什么身份，又让她先承担什么。
- `$case.sceneVersions[1].helperHint` 流程表已经写了个人垫付要先报备。她为什么没照着做，这里还没讲清。
- `$case.sceneVersions[2].helperHint` 同一张图发了三次。先问三次有没有多出新内容，或者他有没有给过到账日期。

### 夜 B

- `$case.sceneVersions[3].helperHint` 领导一句话同时给了署名和流程要求。她先听进去了哪半句？
- `$case.sceneVersions[4].helperHint` 表上有两个位置：活动负责人和付款经办人。她的群消息必须只写自己能证明的刷卡和未到账，不能替缺失的报销单先判责任。

# 彩礼与流水

## 林旭阳

- **固定性格：** 温热、有分寸，也有明确好恶
- **受压反应：** 事实没闭合时先缩短句子，把混在一起的事拆开；证据已经对齐，对方还在把自己的代价甩给别人时，他会收笑、直说，火气只落在具体做法上。
- **防御动作：** 把感情和责任分开问，事实不够时不用火气补证据；事实够了，也不拿中立当成不表态的借口。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 夜 A

- `$case.openingDialogue[1]` 二十八万八，问的什么钱？
- `$case.openingDialogue[3]` 你们本来谈到哪一步了？
- `$case.openingDialogue[5]` 这个数怎么来的？
- `$case.openingDialogue[7]` 那她怎么会把数开到二十八万八？
- `$case.openingDialogue[9]` 男方怎么回？
- `$case.openingDialogue[11]` 你信了？
- `$case.openingDialogue[13]` 他发了什么？
- `$case.openingDialogue[15]` 上面余额多少？
- `$case.sceneVersions[0].questionOptions[0].lines[1]` 那张卡我会问。可在看流水以前，他已经说拿不出。你信了吗？
- `$case.sceneVersions[0].questionOptions[0].lines[3]` 为什么觉得他在压价？
- `$case.sceneVersions[1].questionOptions[0].lines[1]` 为什么？
- `$case.sceneVersions[1].questionOptions[0].lines[3]` 他又说学费是自己出的，你当时想到什么？
- `$case.sceneVersions[2].afterVersion.lines[0]` 你把本科学历改过来以后，你爸妈又查了什么？
- `$case.sceneVersions[2].afterVersion.lines[2]` 他们说男方骗了你？
- `$case.sceneVersions[2].afterVersion.lines[4]` 你怎么回的？
- `$case.sceneVersions[2].questionOptions[0].lines[1]` 你自己也认这个理由？
- `$case.nightStructure.hangup.hostLine` 好。你先回群里看看。学费那句往后，每个人到底说了什么，明天回来我们再问。
- `$case.sceneVersions[0].entryQuestion` 他把工资账户流水发来以后，你们怎么聊的？
- `$case.sceneVersions[0].casualQuestions[0].question` 你们相亲见了几次？
- `$case.sceneVersions[0].casualQuestions[1].question` 你跟你妈平时什么都聊吗？
- `$case.sceneVersions[0].questionOptions[0].question` 他已经说拿不出二十八万八，你为什么还是不信，非要他把流水打出来？
- `$case.sceneVersions[0].questionOptions[1].question` 你要看的是他的银行流水，他为什么只发工资账户？
- `$case.sceneVersions[0].questionOptions[2].question` 你妈妈看到那张工资卡的余额以后，问过这是不是他的全部账户吗？
- `$case.sceneVersions[1].entryQuestion` 他说这些材料能省掉饭桌上的解释。你们吃饭时，学历真的说清楚了吗？
- `$case.sceneVersions[1].casualQuestions[0].question` 他说完那几句话，你当时先记住了哪一句？
- `$case.sceneVersions[1].casualQuestions[1].question` 开口问本科以前，你已经觉得那张学校图有问题了吗？
- `$case.sceneVersions[1].questionOptions[0].question` 他已经承认本科不是那所。你当时为什么没接着问，前面那句“名校毕业”到底怎么来的？
- `$case.sceneVersions[1].questionOptions[1].question` 服务员走了以后，你们又聊本科了吗？
- `$case.sceneVersions[1].questionOptions[2].question` 那顿饭谁结的账？
- `$case.sceneVersions[2].entryQuestion` 你回家以后是怎么跟家里说的？
- `$case.sceneVersions[2].casualQuestions[0].question` 介绍人跟男方家什么关系？
- `$case.sceneVersions[2].casualQuestions[1].question` “家里省心”这话你怎么理解？
- `$case.sceneVersions[2].questionOptions[0].question` 后来你妈还是把彩礼加到二十八万八。你拦过吗？
- `$case.sceneVersions[2].questionOptions[1].question` 你把本科说清以后，你妈妈当时怎么回的？

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[1]` 男方家这么讲，你就直接转给她家了？工资、流水，你一样都没见过？
- `$case.overnightStructure.dayScenes[0].body.beats[3]` 你还替女方说过什么？
- `$case.overnightStructure.dayScenes[0].body.beats[5]` 你知道女方家准备给她多少吗？
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[0]` 两边聊天和彩礼传话我都留着，前后几句也一起截。
- `$case.overnightStructure.dayScenes[0].body.choice.options[1].resultBeats[0]` 我先把“收入挺稳”“不太计较学历”和二十八万八标出来。前两句你没问本人，最后一句你没问女方家现在能拿多少。
- `$case.overnightStructure.dayScenes[1].body.beats[1]` 我只问他发给女方的那份流水。为什么最后只发工资账户？

### 夜 B

- `$case.sceneVersions[5].beforeVersion.lines[3]` 你怎么回的？
- `$case.sceneVersions[5].questionOptions[0].lines[1]` 后面那几条为什么不一起发？
- `$case.sceneVersions[5].questionOptions[0].lines[3]` 那你自己同意这些条件吗？
- `$case.sceneVersions[5].questionOptions[1].lines[1]` 你跟男方怎么说的？
- `$case.sceneVersions[5].questionOptions[1].lines[3]` “给你留着”说了吗？
- `$case.sceneVersions[6].afterVersion.lines[2]` 先停一下。今晚看见的只有这张工资卡，其他账户有多少，谁也不知道。他已经说了拿不出二十八万八；卡上差两千，不等于他答应把这笔钱交出来。
- `$case.sceneVersions[6].afterVersion.lines[5]` 彩礼呢？
- `$case.sceneVersions[6].afterVersion.lines[7]` 这些你都说过吗？
- `$case.sceneVersions[6].questionOptions[0].lines[1]` 所以婚宴和首饰，你默认谁出？
- `$case.sceneVersions[6].questionOptions[0].lines[3]` 跟他说过吗？
- `$case.sceneVersions[6].questionOptions[0].lines[5]` 饭钱、展票、接你下班，这些你怎么没算进去？
- `$case.sceneVersions[6].questionOptions[0].lines[7]` 为什么？
- `$case.sceneVersions[6].questionOptions[1].lines[1]` 那你为什么连团购和停车费也记上？
- `$case.overnightStructure.callbackOpeners.两边的完整聊天.firstConflict.hostLine` 介绍人传二十八万八的时候，知道你家现在能拿多少吗？
- `$case.overnightStructure.callbackOpeners.她没核实的两句话.firstConflict.hostLine` 先不谈介绍人。你知道家里的钱还在宸直以后，为什么没让妈妈撤回二十八万八？
- `$case.overnightStructure.callbackOpeners.表姐门口口供.firstConflict.hostLine` 你看到只有工资账户，为什么还是把它当成他的全部家底？
- `$case.overnightStructure.callbackOpeners.双份材料圈注.firstConflict.hostLine` 你爸说的二十万，是准备拿来付婚宴和首饰吗？
- `$case.overnightStructure.callbackOpeners.家里群原话.firstConflict.hostLine` 完整条件里，男方的钱什么时候给、给谁、还要另付什么都很清楚。你自己的钱怎么用，为什么没一起告诉他？
- `$case.overnightStructure.callbackOpeners.饭局停顿回放.firstConflict.hostLine` 一笔花出去的学费，为什么在你们家变成了还能拿出来的彩礼？
- `$case.sceneVersions[5].entryQuestion` 你妈妈去找介绍人以前，家里群还说过什么？
- `$case.sceneVersions[5].casualQuestions[0].question` 那顿饭，他算钱时会跟你解释吗？
- `$case.sceneVersions[5].casualQuestions[1].question` 你爸那二十万要等到九月底。彩礼为什么非得领证前进你的卡，不能等两边的钱都能拿出来再谈？
- `$case.sceneVersions[5].casualQuestions[2].question` 你妈现在什么态度？
- `$case.sceneVersions[5].questionOptions[0].question` 你把二十八万八告诉男方时，有没有把“领证前进你卡、婚宴和首饰另算”也一起说清楚？
- `$case.sceneVersions[5].questionOptions[1].question` 你爸说以后给你二十万。那笔钱是拿来付婚宴，还是给你自己留着？
- `$case.sceneVersions[6].entryQuestion` 男方现在承认只发了工资账户。你收到那份流水时，是怎么理解的？
- `$case.sceneVersions[6].casualQuestions[0].question` 他问你家准备出多少以后，你多久没回？
- `$case.sceneVersions[6].casualQuestions[1].question` 你身边有婚后一起管钱的例子吗？
- `$case.sceneVersions[6].casualQuestions[2].question` 他现在还给你发消息吗？
- `$case.sceneVersions[6].casualQuestions[3].question` 周末那顿饭，你还想见吗？
- `$case.sceneVersions[6].questionOptions[0].question` 二十八万八不含婚宴和首饰。你看到他工资卡只有二十八万六时，有没有想过彩礼给完以后，后面的钱怎么出？
- `$case.sceneVersions[6].questionOptions[1].question` 他算得细，能证明收入有问题吗？

### 终局

- `$case.deepFollowup.resistanceBeat.lines[1]` 准备先拿多少？
- `$case.deepFollowup.resistanceBeat.lines[3]` 什么时候拿出来，用在哪儿？
- `$case.deepFollowup.question` 你把他工资卡上的二十八万六看得这么细。那你自己现在有多少存款，真结婚愿意先拿多少？
- `$case.stageJudgement` 周末那顿饭先取消。你回去把自己的意思跟父母说，别再让介绍人替你报二十八万八。你妈查到他家境普通，转头把彩礼往上加；你知道，也没拦。你心里还觉得自己条件更好，他就该多花钱、多听你说。那今天就别再说全是父母的意思。彩礼怎么给、婚宴首饰谁出、你自己的六万什么时候拿，都用你自己的话谈。你可以开条件，他也可以不答应。不能因为他不答应，就说他骗你。其他账户里有什么，宸直那笔钱什么时候能拿到，今晚不知道。

### 其他出声面

- `$case.careChoices[0].hostLine` 两个人谈的时候，把你那张表带上。别念，放包里就行。
- `$case.careChoices[0].lines[1]` 放包里，不是放台上。
- `$case.careChoices[1].hostLine` 想把条件问清楚不丢人。下次别借你妈的嘴，自己问。
- `$case.careChoices[2].hostLine` 谈完什么结果，都可以来说一声。不用带材料。
- `$case.overnightStructure.liveCounterBeats[2].lines[4]` 你们俩都愿意说，我才继续。礼物不算谁更有理。她先说自己能拿多少，你再说为什么只发工资卡。别再拿一张图，让对方猜剩下的。
- `$case.overnightStructure.liveCounterBeats[3].lines[2]` 那就先取消。你们把自己的钱说清楚，再决定下一步。
- `$case.sceneVersions[3].entryQuestion` 你妈妈把二十八万八递过去时，介绍人有没有问过你家准备出多少？
- `$case.sceneVersions[3].casualQuestions[0].question` 男方家的那张聊天，你以前见过吗？
- `$case.sceneVersions[3].casualQuestions[1].question` 你当时觉得介绍人偏谁？
- `$case.sceneVersions[3].questionOptions[0].question` 她为什么这么急着把你们撮合到一起？
- `$case.sceneVersions[3].questionOptions[1].question` 二十八万八是介绍人加的，还是你妈妈的原话？
- `$case.sceneVersions[3].questionOptions[2].question` 介绍人只说“学校不错”。你回家时，把这句话说成了什么？
- `$case.sceneVersions[4].entryQuestion` 那顿饭以后，你又问过本科吗？
- `$case.sceneVersions[4].casualQuestions[0].question` 他解释 MBA 的时候，语气什么样？
- `$case.sceneVersions[4].casualQuestions[1].question` 你自己学历怎么样？
- `$case.sceneVersions[4].questionOptions[0].question` 只看那张学校图，能看出他本科在哪儿读吗？
- `$case.sceneVersions[4].questionOptions[1].question` 后来问清的本科和学费，你怎么告诉家里的？

## 案三咨询者·林

- **固定性格：** 数字化自保的理性派
- **受压反应：** 更爱报精确数字、减少语气词；问到自己的八万四和父母那笔理财时句子骤短。
- **防御动作：** 先说彩礼是母亲定的，把家境调查说成父母替她操心；只转达金额，不说付款时点、收款账户和额外支出，也不主动计算男方已经承担的饭钱、展票、接送和倾听。
- **知识边界：** 知道 MBA 学费由男方本人承担、父母托人查到的普通家境、自己收到的材料、家庭群、完整彩礼条件和父母二十万元的预定用途；不知道对方连续收入、其他账户余额，也不知道宸直能否按约兑付。

### 夜 A

- `$case.openingDialogue[0]` 主播你好。我这周末本来要带相亲对象见父母，结果我妈背着我，把二十八万八先问出去了。
- `$case.openingDialogue[2]` 彩礼。她先托介绍人去问，男方今天才来找我。
- `$case.openingDialogue[4]` 这周末第一次正式见父母，双方家里都来。饭店还没订。
- `$case.openingDialogue[6]` 我妈一直以为他是名校本科。上周我才告诉她，本科不是那所。
- `$case.openingDialogue[8]` 她说有她的理由，没先跟我商量。到底怎么算的，我也是后来翻家里群才看明白。
- `$case.openingDialogue[10]` 他说二十八万八拿不出来，也不能把手里的钱全拿去做彩礼。
- `$case.openingDialogue[12]` 没信。我让他把银行流水打出来。
- `$case.openingDialogue[14]` 只发来一份工资账户流水。
- `$case.openingDialogue[16]` 二十八万六。
- `$case.sceneVersions[0].questionOptions[0].lines[0]` 我妈一直这么说。你别只问我，先问他为什么卡上正好二十八万六。
- `$case.sceneVersions[0].questionOptions[0].lines[2]` 没有。我当时觉得，他是在跟我压价。
- `$case.sceneVersions[0].questionOptions[0].lines[4]` 二十三万八的学费都是他自己交的。我妈就说，能把这笔钱交清，不可能连彩礼都拿不出。
- `$case.sceneVersions[1].questionOptions[0].lines[0]` ……没问。
- `$case.sceneVersions[1].questionOptions[0].lines[2]` ‘名校毕业’是我先跟家里说的。再问下去，我妈就知道我没问清。
- `$case.sceneVersions[1].questionOptions[0].lines[4]` 觉得他手里应该还有钱。就这个。
- `$case.sceneVersions[2].afterVersion.lines[1]` 我爸妈托人去问了。问回来，我妈就一句：“他父母都是普通上班的，老家那套房自己要住，婚房也帮不上。”
- `$case.sceneVersions[2].afterVersion.lines[3]` 没有。她说：“家里帮不上，以后真有事还得你们自己扛。彩礼就多问一点，至少钱先在你手里。”又拿他二十三万八的学费说，他手上不至于没有。
- `$case.sceneVersions[2].afterVersion.lines[5]` 我就说，别一下把人吓跑。可真让她把二十八万八收回来……我没开口。
- `$case.sceneVersions[2].questionOptions[0].lines[0]` 没有。我就说了一句，别把人吓跑。
- `$case.sceneVersions[2].questionOptions[0].lines[2]` ……我觉得我工作和家里都比他稳一点。他多拿一点，我当时没觉得不对。
- `$case.nightStructure.hangup` 家里群一直在 @ 我。最上面那几句……我得自己再看一遍。今晚先到这儿吧，明天我回来。
- `$case.sceneVersions[0].version` 他已经说拿不出，我还是让他打了流水。发来以后，我先问：“只有这一张？”过了十几分钟，他才回：“你不是要看收入吗？工资卡最清楚。”我又问其他账户，他没接。到昨晚，我手里就这一张。我把这张转给我妈，她看过。
- `$case.sceneVersions[0].casualQuestions[0].answer` 四次。两次饭，一次展，一次他接我下班。节奏不快不慢。
- `$case.sceneVersions[0].casualQuestions[1].answer` 大事聊。她比我急。我 28，虚岁 29，她逢人就说我不挑，其实是她挑。上个月她把我照片发给三个介绍人，像素还调高了。我说妈，你这是发简历呢。她说简历怎么了，你爸当年也是我筛出来的。……筛出来的。她原话。
- `$case.sceneVersions[0].questionOptions[0].guardedAnswer` 我妈一直这么说。你别只问我，先问他为什么卡上正好二十八万六。
- `$case.sceneVersions[0].questionOptions[1].answer` 我只说了“把流水给我看”，没限定哪张。他发工资卡，我问还有没有别的，他没回。到现在，我手里就这一张。其他账户……我真不知道。
- `$case.sceneVersions[0].questionOptions[1].guardedAnswer` 我问了，他没回。你要说我只看见一张，那就一张。
- `$case.sceneVersions[0].questionOptions[2].answer` 没有。她只盯着那两千块，说：“差这么一点，怎么会拿不出？”我知道那只是工资卡，没提醒她。
- `$case.sceneVersions[1].version` 第一次正式吃饭，介绍人订了窗边。他先问我审计是不是总加班，我问他平时出差多不多。吃到一半，我还是问了：“你发的材料是那所学校，本科也是在那儿读的吗？”他筷子停了一下，才说：“本科不是。我工作以后去读的 MBA，学费二十三万八，是我自己出的。”正好服务员来添水，我没有接着问，之前那句“名校毕业”到底是谁说出来的。
- `$case.sceneVersions[1].casualQuestions[0].answer` 学费。二十三万八。我脑子里先过的是这个数，本科那句反而没追下去。
- `$case.sceneVersions[1].casualQuestions[1].answer` 还没有。我只是想把介绍人那句“学校好”问得具体一点。结果他一停，我才觉得这事可能没说全。
- `$case.sceneVersions[1].questionOptions[0].guardedAnswer` 没问。服务员一来，我就顺势把话停了。
- `$case.sceneVersions[1].questionOptions[1].answer` 没有。他说菜快凉了，我也就跟着聊别的。那顿饭是我催着约的，我也怕当场问僵。
- `$case.sceneVersions[1].questionOptions[2].answer` 他付的，用了团购券和积分。停车费一百多，他问我要不要 AA。单看都没问题。后来再想他的收入，我总会想起那张券。
- `$case.sceneVersions[2].version` 其实“名校毕业”最早也不是他说的。介绍人跟我家说的是：“学校好、收入稳，家里也省心。”我回去以后，把“学校好”说成了“名校毕业”。
- `$case.sceneVersions[2].casualQuestions[0].answer` 他妈的老同事。所以话肯定挑好的说，这我懂。
- `$case.sceneVersions[2].casualQuestions[1].answer` 就是独生子，爸妈有退休金，平时不用他贴钱。我妈一听这四个字，后面都没细问。
- `$case.sceneVersions[2].questionOptions[0].guardedAnswer` 没说骗。她说家里帮不上，钱更得先留在我手里。我……没叫她收。
- `$case.sceneVersions[2].questionOptions[1].answer` 她先说我没问清，又托人去问他家。知道他父母普通上班、婚房也帮不上以后，她没再提被骗，只说彩礼得多问一点。第二天她去找介绍人，我没拦。

### 夜 B

- `$case.sceneVersions[5].beforeVersion.lines[0]` 今天下午，介绍人又来问我。
- `$case.sceneVersions[5].beforeVersion.lines[2]` 男方家想知道，我家除了要二十八万八，准备给我多少。
- `$case.sceneVersions[5].beforeVersion.lines[4]` 我没回。我爸妈说以后会给我二十万，可那笔钱现在还在宸直。就算九月底拿出来，他们原话也是给我自己留着。
- `$case.sceneVersions[5].questionOptions[0].lines[0]` 没有。只发了二十八万八。
- `$case.sceneVersions[5].questionOptions[0].lines[2]` 我怕他看完，周末这顿饭就不去了。
- `$case.sceneVersions[5].questionOptions[0].lines[4]` ……同意。彩礼先到我卡里，我才踏实。
- `$case.sceneVersions[5].questionOptions[1].lines[0]` 我爸原话，是给我自己留着。
- `$case.sceneVersions[5].questionOptions[1].lines[2]` 我说我家也会出二十万。
- `$case.sceneVersions[5].questionOptions[1].lines[4]` 没有。
- `$case.sceneVersions[6].afterVersion.lines[1]` 我说的是银行流水。你只给工资卡，也没有说其他账户不在里面。你前面说拿不出，卡上又有二十八万六，我当然觉得你是在跟我压价。
- `$case.sceneVersions[6].afterVersion.lines[4]` 我爸妈说以后给我二十万，让我自己留着。
- `$case.sceneVersions[6].afterVersion.lines[6]` 我妈说进我卡，婚宴和首饰另算。
- `$case.sceneVersions[6].afterVersion.lines[8]` ……没有。
- `$case.sceneVersions[6].casualQuestions[2].lines[0]` 发。
- `$case.sceneVersions[6].casualQuestions[2].lines[2]` 间隔很规律。
- `$case.sceneVersions[6].questionOptions[0].lines[0]` 我当时就觉得，他还有别的钱。
- `$case.sceneVersions[6].questionOptions[0].lines[2]` 他家。
- `$case.sceneVersions[6].questionOptions[0].lines[4]` 没说。
- `$case.sceneVersions[6].questionOptions[0].lines[6]` 我没觉得那算多大付出。
- `$case.sceneVersions[6].questionOptions[0].lines[8]` 我工作比他稳，家里也比他家好一点。我觉得他多花一点、多听我说一点……挺正常的。
- `$case.sceneVersions[6].questionOptions[1].lines[0]` 不能。
- `$case.sceneVersions[6].questionOptions[1].lines[2]` 我那时候已经认定他在压价。看什么都觉得不对。
- `$case.overnightStructure.callbackOpeners.两边的完整聊天.firstConflict.callerLine` 不知道。我妈只说不会亏待我，没说那笔钱还在宸直。
- `$case.overnightStructure.callbackOpeners.她没核实的两句话.firstConflict.callerLine` 因为我也觉得，他能自己交二十三万八学费，应该拿得出来。
- `$case.overnightStructure.callbackOpeners.表姐门口口供.firstConflict.callerLine` 因为我先认定他是在压价。二十八万六又离二十八万八太近，我只顾着看那个数字。
- `$case.overnightStructure.callbackOpeners.双份材料圈注.firstConflict.callerLine` 不是。他说到期以后给我自己留着。以前我只跟男方说，我家也会给钱。
- `$case.overnightStructure.callbackOpeners.家里群原话.firstConflict.callerLine` 因为我想先把彩礼谈下来。自己的钱准备怎么用，我那时候根本没跟他说。
- `$case.overnightStructure.callbackOpeners.饭局停顿回放.firstConflict.callerLine` 我妈一说‘他都能拿二十三万八读书’，我就顺着算下去了。可那是已经交掉的学费，不是他卡里还放着的钱。
- `$case.sceneVersions[5].version` 我妈先发了一句：“彩礼领证前打到她自己的卡里，婚宴和首饰另算。”我爸紧跟着说，宸直那三十万九月底到期，拿二十万给我留着。我当时看见了。就这么看过去了。
- `$case.sceneVersions[5].revisedVersion` ……我以前只告诉他，我妈说‘彩礼先问二十八万八’，我家以后也会给我二十万。领证前打进我卡、婚宴和首饰另算，还有那二十万是让我自己留着，这几句我都没说。
- `$case.sceneVersions[5].casualQuestions[0].answer` 会。券怎么用、积分抵了多少、停车费怎么 AA，他都说得很清楚。我当时觉得这叫会过日子。
- `$case.sceneVersions[5].casualQuestions[1].answer` 我问过。我妈说：“他先把彩礼给了，咱家的钱九月底到期再说。”她不肯等。我那时候听着，也没觉得哪里不对。
- `$case.sceneVersions[5].casualQuestions[2].answer` 就一句：『过了年你就 29 了，先别把人得罪死。』……这话她今年说了四回。我记着次数呢。你看，职业病。
- `$case.sceneVersions[5].questionOptions[0].guardedAnswer` 我只把二十八万八发给他。后面的……我当时觉得还没谈到，不用一起说。
- `$case.sceneVersions[6].version` 工资账户结余二十八万六，只比彩礼少两千。他说‘拿不出’，我就认定他是不想给。直到刚才上麦，他才承认还有其他账户，只是不愿意交出来。里面有多少，我不知道。平时饭钱、展票大多是他出；我加班晚，他来接过几次。我跟我妈吵了，他也能听我讲很久。可他一用团购、积分，停车费跟我 AA，我还是会觉得他在跟我算。
- `$case.sceneVersions[6].casualQuestions[0].answer` 到现在都没回。我爸说的是以后给我二十万，让我自己留着。那笔钱最快也要等九月底。我怕一说，他会问：那婚宴和首饰到底谁出？
- `$case.sceneVersions[6].casualQuestions[1].answer` 我表姐。管得挺好，但她挣得比姐夫多。多百分之三十几吧，具体没算过——不对，我算过。百分之三十七。你看，我就是这样的人。这话我没跟我妈说过。我们家饭桌上，账是不能上桌的。
- `$case.sceneVersions[6].casualQuestions[3].answer` 不知道。
- `$case.sceneVersions[6].questionOptions[0].guardedAnswer` 我当时就觉得他还有钱。婚宴首饰，不都是后面再谈的吗？
- `$case.overnightStructure.callbackOpeners.两边的完整聊天.line` 我把介绍人两边的聊天都看完了。她替两边说过好话，也把我妈那句二十八万八原样转给了男方家。
- `$case.overnightStructure.callbackOpeners.她没核实的两句话.line` 我把介绍人没问过的几句话标出来了。她没看过男方工资，也没问我家现在能拿多少，就把二十八万八递了过去。
- `$case.overnightStructure.callbackOpeners.表姐门口口供.line` 表姐没让进门，只隔着防盗链说，男方家商量过发哪张卡，最后只挑了工资账户。她提醒过要说清范围，那句话没有跟着流水一起发出来。
- `$case.overnightStructure.callbackOpeners.双份材料圈注.line` 那两份材料我又看了几遍。二十三万八的学费是他自己交的，我当时一听就觉得他手里肯定有钱。后来工资卡上又正好是二十八万六，我和我妈就盯着这个数，谁也没再问这是不是他全部的钱。
- `$case.overnightStructure.callbackOpeners.家里群原话.line` 家里群我重新从头看了。我妈说，二十八万八领证前进我卡，婚宴首饰另算；我爸下一句却是，宸直到期后拿二十万给我自己留着。
- `$case.overnightStructure.callbackOpeners.饭局停顿回放.line` 饭局那十几秒我又听了一遍。我问本科，他承认不是那所，又说二十三万八学费是自己交的。我当时已经不再想学历，开始想他是不是很有钱。
- `$case.overnightStructure.callbackFallback.line` 我回来了。二十八万八和宸直那三十万，我都愿意说。你白天查到什么了？
- `$case.overnightStructure.postures.againstCaller` 二十八万八是我妈定的，我知道以后没叫停。今晚我自己答。
- `$case.overnightStructure.postures.withCaller` 家里群我没删。彩礼和宸直那几句，你看到哪儿，就问到哪儿吧。
- `$case.nightStructure.returnStance.lines.defensive` 我差点没打回来。弹幕说我家问得太多，这话我听见了。群聊我带来了，你接着问吧。
- `$case.nightStructure.returnStance.lines.open` 我回来了。昨晚挂完电话，我又看了学校图，也去找了介绍人。今天都带来了。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。昨晚群里吵到很晚，我把那几张图又看了一遍。

### 终局

- `$case.deepFollowup.resistanceBeat.lines[0]` 八万四。
- `$case.deepFollowup.resistanceBeat.lines[2]` 六万。剩下的我得留着。
- `$case.deepFollowup.resistanceBeat.lines[4]` 领证以后。添家电、搬家。婚宴和首饰不从这里出。
- `$case.deepFollowup.answer` 唉，这些我也没跟他说。

### 其他出声面

- `$case.sceneVersions[4].sceneCloser.lines[0]` 我把学费那句发进群以后，我妈回了句：“这事你别插嘴，我问介绍人。”她没说要问什么。
- `$case.careChoices[0].lines[0]` 带表……你不是让我别发后台吗。
- `$case.careChoices[0].lines[2]` ……嗯。
- `$case.careChoices[1].lines[0]` ……谢谢。这句，我妈应该听听。
- `$case.careChoices[2].lines[0]` 不带材料。
- `$case.careChoices[2].lines[2]` 好。我试试。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 等一下。那页群聊……是我表妹发给你们的？
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 她把我家的群发给一个直播间？
- `$case.overnightStructure.liveCounterBeats[0].lines[4]` 你们等我一下，我要先给她打个电话。
- `$case.overnightStructure.liveCounterBeats[0].choices[0].lines[0]` 后台先删。不是，电话先别断，我把这段说完。播完我再找她。
- `$case.overnightStructure.liveCounterBeats[0].choices[1].lines[0]` 先不打了。她多半跟我妈在一块儿，我现在打过去，最后还是我妈接。你先让我把这段说完。
- `$case.overnightStructure.liveCounterBeats[0].choices[2].lines[1]` 继续吧。截图从后台删掉，直播里也别提内容。
- `$case.overnightStructure.liveCounterBeats[2].lines[0]` 我的工资我自己说，存款也由我说。家里群那几句可以念。可我问你要流水，你只发工资卡，没告诉我别的账户不在里面。
- `$case.overnightStructure.liveCounterBeats[2].lines[2]` 二十八万八要在领证前进我卡，婚宴和首饰另算。这个……我也同意。以前没一起告诉你。
- `$case.overnightStructure.liveCounterBeats[3].lines[1]` 好。我也得跟家里说清楚：这套条件他没有答应。还有那二十万，我爸原话是给我自己留着，不是拿来付婚宴和首饰。
- `$case.sceneVersions[3].version` 没有问。她把我妈那条语音原样转给了男方家。后来她把两边聊天都发给我，我才知道，她在男方家那边也替我说过“工作稳定、家里事少、不太计较学历”。可她给我家的原话，只有“学校不错”。
- `$case.sceneVersions[3].casualQuestions[0].answer` 没有。介绍人这次一起发出来，我才第一次看见。“家里事少”那句挺刺的，我家什么情况，她根本没认真问过。
- `$case.sceneVersions[3].casualQuestions[1].answer` 当时觉得她偏男方。看完另一段，我又觉得她就是太想把这顿饭约成，哪边难听就替哪边改一句。
- `$case.sceneVersions[3].questionOptions[0].answer` 男方家以前帮过她，她一直想还这个人情。她说彩礼只是先问问，自己不好替我妈把数字压回去。我听着却觉得，她既然愿意替两家介绍，就不该只负责传最刺激人的那一句。
- `$case.sceneVersions[3].questionOptions[0].guardedAnswer` 她说男方家以前帮过她，想把这个人情还上。别的她没细讲。
- `$case.sceneVersions[3].questionOptions[1].answer` 我妈的原话。她说他能自己拿二十三万八读书，家里不会差；别按我表姐十八万八那份谈，先问二十八万八。介绍人原样转过去了。
- `$case.sceneVersions[3].questionOptions[2].answer` 我跟我妈说：“名校毕业，条件不错。”后面这两个判断都是我自己加的。我妈一听，马上开始催我带人回家。
- `$case.sceneVersions[4].version` 后来我在微信上又问了一次。他说本科不是那所，读的是那所学校的 MBA，学费二十三万八，是工作以后分三次交清的。学校查询页和缴费回单我都看了，项目是真的，钱也是从他账户出去的。我把这些发进家里群，本来是想把“名校毕业”纠正过来，没想到我妈盯住的是二十三万八。
- `$case.sceneVersions[4].casualQuestions[0].answer` 校名和项目名，他一口气就说完了。问到本科，他才停了一下。
- `$case.sceneVersions[4].casualQuestions[1].answer` 普通一本。我妈听见他名校毕业以后，逢人就说我眼光好。我没纠正，可能也舍不得她把这句收回去。
- `$case.sceneVersions[4].questionOptions[0].answer` 看不出来。图上只有校名和 MBA 项目，本科、项目性质、读了多久都没有。那些是我后来一项一项问出来的。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 看不出来。图上只有校名和 MBA 项目。
- `$case.sceneVersions[4].questionOptions[1].answer` 我原样发了。本科不是那所，MBA 二十三万八是他自己交的。我妈先说我没问清，过一会儿又说，能自己花这么多读书，家里总不会差。她后来去找介绍人，我那时候还不知道。

## 案三相亲对象

- **固定性格：** 受冒犯的条件维护者
- **受压反应：** 被质疑时按项目、学费和工资账户逐项举证；被追问其他账户时明确拒绝公开。
- **防御动作：** 用每个局部真实抵挡整体概括的问题。
- **知识边界：** 知道自己的项目、缴费、账户和家人整理材料过程；第二夜才从群聊得知女方父母的三十万元在宸直，不知道最终能否兑付。

### 夜 B

- `$case.sceneVersions[6].afterVersion.lines[0]` 你先说我拿不出是在骗你，又让我打流水。我发工资卡，是因为你问的是收入。其他账户是我的私事，我从来没答应全交给你。
- `$case.sceneVersions[6].afterVersion.lines[3]` 那她家呢？一开口二十八万八，自己准备给她多少？那三十万宸直，为什么现在才说？

### 后台／材料回流

- `$case.respondentNote.text` 学校页、MBA 缴费和工资卡是我发的，你们可以问。别的账户我没给她，也不想上直播。当时她要看收入，我就挑了工资卡，没提醒她这不是全部。饭、展票、接她下班，是我愿意做，不是因为我家境普通就欠她。卡上有二十八万六，也不代表我要拿二十八万八，更不代表后面婚宴首饰都我出。

### 其他出声面

- `$case.overnightStructure.liveCounterBeats[1].lines[1]` 我是她说的那个人。介绍人把直播片段转给我了，我才进来的。礼物你先收着。
- `$case.overnightStructure.liveCounterBeats[1].lines[2]` 我只问一句：你家要我领证前把二十八万八打进你的卡，你们家的三十万却要等到九月底，拿到以后还说是留给你自己的。这些话，你有没有一起告诉我？
- `$case.overnightStructure.liveCounterBeats[1].choices[0].lines[0]` 行。她手里那些材料，这几页可以：学校、学费、工资卡，还有彩礼那几句。其他账户不公开。她家的钱，也只说群里已经提过的。
- `$case.overnightStructure.liveCounterBeats[1].choices[1].lines[0]` 范围我打后台了。她已经拿到的学校图、学费单、工资卡，这几页可以；彩礼原话也能谈。其他账户不公开。她家的钱，只说群里那一句。
- `$case.overnightStructure.liveCounterBeats[1].choices[2].lines[0]` 可以，你先问她。我这边同意谈学校、学费、那张工资卡和彩礼，这几页可以。其他账户不公开。她家的钱也只念群里出现过的。
- `$case.overnightStructure.liveCounterBeats[2].lines[1]` 你们查完我家，转头就把彩礼加到二十八万八。我都说拿不出，你还觉得我在压价，非要查收入。你们到底是在谈结婚，还是看我还能拿多少？
- `$case.overnightStructure.liveCounterBeats[2].lines[3]` 我说拿不出，不只是差两千，是我不接受这么给。二十八万八不是不能谈，真要结婚，就放共同账户里。你家九月底那笔怎么放、婚宴和首饰谁出，也一起摊开。只让我领证前打进你卡里，我不接受。
- `$case.overnightStructure.liveCounterBeats[3].lines[0]` 周末包间的定金我来认。我回去跟我爸妈说，你也跟你家里说。饭先取消吧。我不想带着二十八万八去见你父母。

## 案三介绍人

- **固定性格：** 嘴快、怕砸媒人的热心撮合者
- **受压反应：** 越被两家围攻，越急着翻聊天记录；被问到依据时，先辩一句，再认自己没核实的具体话。
- **防御动作：** 先划掉不是自己说的那一句，再把没核实的话解释成“想让他们先见一面”。
- **知识边界：** 知道两家给她的条件、女方母亲的二十八万八和自己转述过的话；转达彩礼时不知道女方家的三十万元锁在宸直，也不知道父亲准备把其中二十万元只留给女儿本人。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 你先看聊天。她妈妈现在一口一个我骗她，可“名校毕业”真不是我说的。我当时只说他学校不错。至于“收入挺稳”，是男方家先这么跟我讲的。
- `$case.overnightStructure.dayScenes[0].body.beats[2]` ……没见过。这个是我话说快了。可我也不是只替男方说话。
- `$case.overnightStructure.dayScenes[0].body.beats[4]` 我说她做审计，工作稳定，家里事少。男方家问她会不会嫌学历，我还说了句“她不太计较这个”。后来她妈妈听说 MBA 二十三万八是他自己交的，又让我去问二十八万八。我一个字没改，全转了。
- `$case.overnightStructure.dayScenes[0].body.beats[6]` 不知道。她妈妈只说家里不会亏待女儿。今天她又给我打电话，解释到最后才说，那笔钱还没到期。早知道是这样，我至少会先问一句：现在拿得出来吗？
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[1]` 行。名校毕业我没说，二十八万八也不是我定的。可话都是从我这儿递过去的，这个躲不了。
- `$case.overnightStructure.dayScenes[0].body.choice.options[1].resultBeats[1]` 对。我先把人约到桌上，别的都没问。现在桌还没坐下，钱先把两家掀了。

### 后台／材料回流

- `$case.investigationHooks[1].material` 介绍人留言：“‘收入稳’是听男方家说完，我顺嘴夸的；‘她不太计较学历’，我也没问过本人。二十八万八是她妈妈让我原话问的。我当时只想着先把人约到桌上，没拦，也没让两个孩子先谈。”

## 案三男方表姐

- **固定性格：** 护家的感性防守者
- **受压反应：** 先拒答；确认只问资料整理后才给半句。
- **防御动作：** 使用‘大家一起整理’稀释主导者。
- **知识边界：** 知道资料如何整理，也知道 MBA 学费由男方本人承担；不知道收入构成，不知道女方家的宸直情况。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 先说好，他其他账户里有多少，我不知道。学费是他自己交的，回单他已经同意给你们看，别再问我为什么读。
- `$case.overnightStructure.dayScenes[1].body.beats[2]` 他在家里群问过该发哪张。姑姑说工资卡最规整，别的卡不用给。我还提醒过他，至少跟人家说清这只是工资账户。他最后只把这张发了，没带那句话。
- `$case.overnightStructure.dayScenes[1].body.beats[3]` 我能说的就这些。其他账户是什么、他愿意拿多少，你去问他，我不替他答。

## 小林老师

- **固定性格：** 热络的感性现实派
- **受压反应：** 先替行业解释一句，再把行话翻成人话。
- **防御动作：** 笑着纠偏，拆一次话术就补一次行业辩护。
- **知识边界：** 只解释婚恋行业话术和流程，不知道本案人物私下做过什么。

### 后台／材料回流

- `$case.advisorNotes[0].text` 我做婚介的，最怕两家隔着中间人传彩礼数字。你们俩要是还想往下谈，就自己见面，把能拿多少说清楚。家里答应的那份什么时候到，也别含糊。

## V哥

- **固定性格：** 沉着的直觉教练
- **受压反应：** 玩家越急，他越让人停一下，只比较两件已知事物。
- **防御动作：** 短句，先停，再分开看。
- **知识边界：** 只知道玩家当前已经听见或看见的内容。

### 夜 A

- `$case.sceneVersions[0].helperHint` 她不信男方说拿不出，男方又只交工资账户。先分开问：为什么不信，以及这一张卡能不能代表全部账户。
- `$case.sceneVersions[1].helperHint` 停顿本身不是答案。你要找的是她在那十几秒后有没有把本科问到底。
- `$case.sceneVersions[2].helperHint` 父母把学费当家底的原因已经问出来。现在要看的是，她知道二十八万八怎么来的以后做了什么。

### 夜 B

- `$case.sceneVersions[5].helperHint` 别先争彩礼高低。问清钱什么时候给、进谁的账户，婚宴首饰是否包含在内，女方家的二十万又准备怎么用。
- `$case.sceneVersions[6].helperHint` 不要只算两千元差额。先让两边各说清：现在能拿多少，未来可能有多少，分别是谁的钱。

### 其他出声面

- `$case.sceneVersions[3].helperHint` 先分清谁定数字、谁传话。再问自费读书为什么会被当成现成的彩礼钱。
- `$case.sceneVersions[4].helperHint` 先别算家底。问问她，那张学校图里到底有没有本科。

# 那张名单

## 林旭阳

- **固定性格：** 温热、有分寸，也有明确好恶
- **受压反应：** 事实没闭合时先缩短句子，把混在一起的事拆开；证据已经对齐，对方还在把自己的代价甩给别人时，他会收笑、直说，火气只落在具体做法上。
- **防御动作：** 把感情和责任分开问，事实不够时不用火气补证据；事实够了，也不拿中立当成不表态的借口。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 夜 A

- `$case.openingDialogue[1]` 他是谁？
- `$case.openingDialogue[3]` 他也认你这个女朋友？
- `$case.openingDialogue[5]` 名单上写了什么？
- `$case.openingDialogue[7]` 你打来，是想问他是不是在养鱼？
- `$case.openingDialogue[9]` 名单怎么到你手里的？
- `$case.openingDialogue[11]` 钱的事等会儿说。你先把名单发过来，名字遮掉。
- `$case.sceneVersions[0].questionOptions[0].lines[1]` 不是截得急。每一行都断在同一个地方。
- `$case.sceneVersions[1].questionOptions[0].lines[1]` 所以是你当自己在谈。
- `$case.sceneVersions[2].questionOptions[0].lines[1]` 钱跟这张名单没有关系？
- `$case.sceneVersions[3].questionOptions[0].lines[1]` 就这一句？
- `$case.nightStructure.hangup.hostLine` 我听见敲门了。你先确认安全，方便的时候给后台留句话。
- `$case.sceneVersions[0].entryQuestion` 你怎么确定名单上的名字都是他在谈的人？
- `$case.sceneVersions[0].casualQuestions[0].question` 备忘录你存下来了吗？
- `$case.sceneVersions[0].casualQuestions[1].question` 上面大概几个人？
- `$case.sceneVersions[0].casualQuestions[2].question` 他回来以后发现你看了吗？
- `$case.sceneVersions[0].questionOptions[0].question` 你发来的图，每一行怎么都在右边同一个地方断了？
- `$case.sceneVersions[0].questionOptions[1].question` 钱在他那儿，是你转的，还是他从你卡里划的？
- `$case.sceneVersions[1].entryQuestion` 你说你当自己在谈。他怎么对你的？
- `$case.sceneVersions[1].casualQuestions[0].question` 你们最早怎么认识的？
- `$case.sceneVersions[1].casualQuestions[1].question` 你为什么一直固定找他？
- `$case.sceneVersions[1].casualQuestions[2].question` 他有没有当着别人维护过你？
- `$case.sceneVersions[1].casualQuestions[3].question` 你在他们店剪了多久头发？
- `$case.sceneVersions[1].casualQuestions[4].question` 除了剪头，你们单独出去过吗？
- `$case.sceneVersions[1].casualQuestions[5].question` 他会不会私下找你说话？
- `$case.sceneVersions[1].casualQuestions[6].question` 他多大？
- `$case.sceneVersions[1].questionOptions[0].question` 他亲口说过你们在谈吗？
- `$case.sceneVersions[1].questionOptions[1].question` 他叫你自己人时，你怎么回的？
- `$case.sceneVersions[2].entryQuestion` 你裁掉的右半边，写的是什么？
- `$case.sceneVersions[2].casualQuestions[0].question` 小姐妹为什么让你留原图？
- `$case.sceneVersions[2].casualQuestions[1].question` 你裁图的时候，知道右边跟钱有关吗？
- `$case.sceneVersions[2].questionOptions[0].question` 你为什么偏偏把金额和产品那几列裁掉？
- `$case.sceneVersions[2].questionOptions[1].question` 你把左半张发给小姐妹以后，她说了什么？
- `$case.sceneVersions[3].entryQuestion` 你刚才说产品那一列。高息这件事，你以前听过吗？
- `$case.sceneVersions[3].casualQuestions[0].question` 小姐妹当时说了哪家吗？
- `$case.sceneVersions[3].casualQuestions[1].question` 你当时为什么没问是哪家？
- `$case.sceneVersions[3].questionOptions[0].question` 小姐妹当时到底跟你说了多少？
- `$case.sceneVersions[3].questionOptions[1].question` 你是在店里听她说的，还是别处？

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[1]` 你先告诉我，她当时听完什么反应？
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[1]` 行。她什么时候动心想买，我回去问她。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[1]` 明白。翻名单的时机，让她自己说。
- `$case.overnightStructure.dayScenes[2].body.beats[1]` 如果钱先转到别人户头，再由他来买呢？

### 夜 B

- `$case.sceneVersions[4].sceneCloser.lines[0]` 你为什么会去借这种钱？
- `$case.sceneVersions[4].sceneCloser.lines[2]` 你到底做什么工作？
- `$case.sceneVersions[4].sceneCloser.lines[4]` 钱来得快，也花得快？
- `$case.sceneVersions[4].sceneCloser.lines[6]` 高息也是在酒桌上听的？
- `$case.sceneVersions[4].sceneCloser.lines[8]` 好。你后来问了什么，接着说。
- `$case.sceneVersions[4].questionOptions[0].lines[1]` 为什么找你？
- `$case.sceneVersions[5].questionOptions[0].lines[1]` 你问的原话？
- `$case.sceneVersions[6].sceneCloser.lines[0]` 行，我看到你那一行了。今晚先到——
- `$case.sceneVersions[6].sceneCloser.lines[4]` 我明白。先说到这儿。
- `$case.sceneVersions[6].questionOptions[0].lines[1]` 原图里有你的什么？
- `$case.sceneVersions[6].questionOptions[0].lines[3]` 直接发出去呢？
- `$case.overnightStructure.callbackOpeners.门边那句自己人.firstConflict.hostLine` 他跟熟客也这么说。你以前听见自己人，后面的话还听吗？
- `$case.overnightStructure.callbackOpeners.他写下的跟进.firstConflict.hostLine` 他刚让熟客坐下，就在备忘录里写跟进。你以前被照顾时，问过他在记什么吗？
- `$case.overnightStructure.callbackOpeners.完整名单与转账.firstConflict.hostLine` 十二万是你转的。你为什么还是在草稿里写养鱼骗钱？
- `$case.overnightStructure.callbackOpeners.吹风机回放.firstConflict.hostLine` 这句听着很亲密。它能证明名单上的别人也在跟他谈吗？
- `$case.overnightStructure.callbackOpeners.周发来的材料.firstConflict.hostLine` 你支持她留表，却不肯站到店门口。怕闹大，还是怕别人问你自己也转过？
- `$case.overnightStructure.callbackOpeners.先要回单.firstConflict.hostLine` 你劝她要回单，自己也取消了预约。要是她把名单发出来，你会不会又劝她算了？
- `$case.overnightStructure.callbackOpeners.门店的说明.firstConflict.hostLine` 所以这不是店里的项目。你把钱转给谁了？
- `$case.overnightStructure.callbackOpeners.一百万门槛.firstConflict.hostLine` 现在再看，你还觉得高息是他后来才塞给你的吗？
- `$case.overnightStructure.callbackOpeners.翻手机的时间.firstConflict.hostLine` 风声在前，翻手机在后。你还要把今晚说成刚发现被骗吗？
- `$case.overnightStructure.callbackOpeners.宸直窗口答复.firstConflict.hostLine` 窗口只认合同。他给过你合同吗？
- `$case.sceneVersions[4].entryQuestion` 昨晚是谁敲门？
- `$case.sceneVersions[4].casualQuestions[0].question` 他们问了多久？
- `$case.sceneVersions[4].casualQuestions[1].question` 你为什么搬到妈妈家？
- `$case.sceneVersions[4].questionOptions[0].question` 你一直说只是临时有事。昨晚敲门的到底是谁？
- `$case.sceneVersions[4].questionOptions[1].question` 你现在住妈妈家，是怕对方还会再来？
- `$case.sceneVersions[5].entryQuestion` 你那十二万，怎么到他手里的？
- `$case.sceneVersions[5].casualQuestions[0].question` 转钱以前，你见过产品合同吗？
- `$case.sceneVersions[5].casualQuestions[1].question` 转完他给你看过什么？
- `$case.sceneVersions[5].casualQuestions[2].question` 你为什么一直找他做头发？
- `$case.sceneVersions[5].questionOptions[0].question` 是你开口让他帮你买，还是他先劝你把钱给他？
- `$case.sceneVersions[5].questionOptions[1].question` 转完以后，你还当自己在跟他谈吗？
- `$case.sceneVersions[6].entryQuestion` 昨晚你已经看见这张名单了。现在把你自己那行念完。
- `$case.sceneVersions[6].casualQuestions[0].question` 你现在还去那家店吗？
- `$case.sceneVersions[6].casualQuestions[1].question` 小姐妹后来还找过你吗？
- `$case.sceneVersions[6].casualQuestions[2].question` 这张名单你还转给过谁？
- `$case.sceneVersions[6].questionOptions[0].question` 这张表如果发出去，你让他代投、不够起投、走他户也会跟着出来。你想过吗？
- `$case.sceneVersions[6].questionOptions[1].question` 小姐妹说产品在拖，是在你转钱之前，还是之后？

### 终局

- `$case.hostDisclosure.lines[1]` 这两列你昨晚就看见了。
- `$case.deepFollowup.resistanceBeat.lines[1]` 你那行写的是走我户，还是女朋友？
- `$case.deepFollowup.resistanceBeat.lines[3]` 那先说你现在最要紧的。
- `$case.hostDisclosure.text` 昨晚敲门的是警察。名单上的周呢，她到底是来剪头的，还是你说的那种女朋友？
- `$case.deepFollowup.question` 如果他明天给你一张他名下的认购回单，却不退十二万，你还会把那半张截图发出去，说自己碰上了恋爱诈骗吗？
- `$case.stageJudgement` 先别再给他转钱。让他把产品全名、合同、回单和实际下单账户发给你，“走我户”走的哪张卡，也写清楚。你那半张名单证明不了名单上每个人都在跟他谈，金额栏还是你自己裁的。你就是看中他长得好看，也享受他留晚档、叫你自己人。后来听说产品可能出事，你又把主动找他代投改成恋爱诈骗。这个说法我不认。他也别躲。十二万收进自己账户，还说已经提交，就得把钱去了哪儿交代清楚。这十二万到底有没有买成产品，等合同和回单。没有原件，今晚谁都别替它下结论。

### 其他出声面

- `$case.careChoices[0].hostLine` 别再转钱。产品名、合同、回单和下单账户，一样一样让他发。头发还得剪——换家店。
- `$case.careChoices[1].hostLine` 他总给你留晚档，也会叫自己人。你会往那边想，不奇怪。
- `$case.careChoices[2].hostLine` 材料先要。等他回了什么，你再来。
- `$case.overnightStructure.returnLead.lines[1]` 昨晚窗外突然亮了一下，接着有人敲门。到底谁来了？
- `$case.overnightStructure.returnLead.lines[3]` 你今天换到妈妈家，我先确认一句：你现在安全吗？
- `$case.overnightStructure.returnLead.lines[5]` 行，店名和你现在住哪儿都不说。等会儿我只问谁来过、为什么来；不该公开的地方就停。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 周后来把材料转你了吗？
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 你能确定回单就是她转的那一百万吗？

## 第四通咨询者·何

- **固定性格：** 渴望被尊重的社交型人格
- **受压反应：** 引用他的原话前会停；别人拿酒吧工作定性她时立刻变硬；问到自己花过多少钱时不再铺垫。
- **防御动作：** 第一夜只砸裁过的名单和要钱，把左半张图读成女友名册；问到恋爱就承认他帅、自己也要这个位置。敲门时突然下线，不说警察是因涉案放款人来核实。开场不说十二万是自己让他代投。
- **知识边界：** 知道自己的聊天、十二万转账、不够一百万起投、走他户的口头约定，也知道高息是自己先在酒吧听说的，并知道自己向放贷人借过钱。第二夜知道周是剪头客户并见过她转发的认购回单。她没有合同原件，不知道十二万是否已经买成宸直，也不知道 Tony 有没有代销资格；不知道警察把她当证人还是另有调查。

### 夜 A

- `$case.openingDialogue[0]` 主播，我有个事想找你分析一下。昨晚我在一个男的手机里看见一张名单，上面全是女的。我一晚上没睡。
- `$case.openingDialogue[2]` 给我剪头的那个，我平时叫他 Tony。我今天轮休，现在在家。一直没敢找他。
- `$case.openingDialogue[4]` 没公开过。可他一直叫我自己人。
- `$case.openingDialogue[6]` 亲密度、下次约，一排女人的名字。越看越不对。
- `$case.openingDialogue[8]` 也不只是这个。我还有一笔钱在他那里，想拿回来。
- `$case.openingDialogue[10]` 他去洗澡，手机亮着，备忘录没锁。
- `$case.openingDialogue[12]` 我已经发后台了。那笔钱，我就是想拿回来。
- `$case.sceneVersions[0].casualQuestions[1].lines[0]` 我数过，八……不对，九个。
- `$case.sceneVersions[0].casualQuestions[1].lines[2]` 连我。
- `$case.sceneVersions[0].questionOptions[0].lines[0]` 截得急。
- `$case.sceneVersions[0].questionOptions[0].lines[2]` ……我裁过。右边几列没发。
- `$case.sceneVersions[1].casualQuestions[6].lines[0]` 二十九。
- `$case.sceneVersions[1].casualQuestions[6].lines[2]` 他自己说的。
- `$case.sceneVersions[1].questionOptions[0].lines[0]` 说过自己人。带我吃饭。没带见朋友。
- `$case.sceneVersions[1].questionOptions[0].lines[2]` 我要这个位置，你知道吧。不是他一个人在演。
- `$case.sceneVersions[2].questionOptions[0].lines[0]` 因为一发全，你肯定先问钱。
- `$case.sceneVersions[2].questionOptions[0].lines[2]` 有。可我今晚不想先解释那一笔。
- `$case.sceneVersions[3].sceneCloser.lines[1]` 等一下。
- `$case.sceneVersions[3].sceneCloser.lines[3]` 我这边真有事。明天再说。
- `$case.sceneVersions[3].questionOptions[0].lines[0]` 她说有个东西利息高。
- `$case.sceneVersions[3].questionOptions[0].lines[2]` 她还说，不是我手里那点钱能买的。后来我又问过谁，今晚不说。
- `$case.nightStructure.hangup` 我这边真有事。明天再说。
- `$case.sceneVersions[0].version` 我往下划，一排名字，全是女的。备注写着亲密度、下次约。我那行也在。我把截图发到后台了，钱还在他那儿，我才打进来。
- `$case.sceneVersions[0].revisedVersion` 全是女的这一层是真的。可我发的只有左半边，右边几列没发。
- `$case.sceneVersions[0].casualQuestions[0].answer` 截了。
- `$case.sceneVersions[0].casualQuestions[2].answer` 没有。我把屏幕按灭了。他出来还问我晚上吃什么。
- `$case.sceneVersions[0].questionOptions[0].guardedAnswer` 右边我没发。
- `$case.sceneVersions[0].questionOptions[1].answer` 我转的。多少我今晚不想说。你先看名单。
- `$case.sceneVersions[0].questionOptions[1].guardedAnswer` 我转的。
- `$case.sceneVersions[1].version` 我一开始就是觉得他长得好看。后来他总给我留最晚那档，也叫我自己人。
- `$case.sceneVersions[1].revisedVersion` 我要这个位置，不是他单方面拖着我。他没带我见朋友，可自己人是他叫的。
- `$case.sceneVersions[1].casualQuestions[0].answer` 同事推荐的，说他技术好。我第一次去就觉得他长得好看，后来剪头一直找他。
- `$case.sceneVersions[1].casualQuestions[1].answer` 手艺好。我上班时间跟别人不太一样，经常要见人，头发隔一阵就得弄。他肯给我留最晚的号。
- `$case.sceneVersions[1].casualQuestions[2].answer` 说女孩子半夜下班不像正经工作。他当场回了一句：“人家上自己的班，关你什么事。”我那时候真挺感激他的。
- `$case.sceneVersions[1].casualQuestions[3].answer` 一年多。最开始就是普通剪头，最近几个月才越走越近。
- `$case.sceneVersions[1].casualQuestions[4].answer` 大概三个月前。他收店晚，我也刚下班，就在旁边吃了碗面。后来又吃过两次。
- `$case.sceneVersions[1].casualQuestions[5].answer` 会。有次他说店长又骂他了，最后来一句：“也就你肯听我说这些。”那条语音我一直留着。
- `$case.sceneVersions[1].questionOptions[0].guardedAnswer` 叫过自己人。没公开。
- `$case.sceneVersions[1].questionOptions[1].answer` 我没追问到底算什么，只会回他：有事你就找我。晚档他也留，我愿意信。
- `$case.sceneVersions[2].version` 金额、产品、后面怎么跟。我没把那几列发给你们。小姐妹让我把原图留好，我跟她说，名字和亲密度还不够吗？她没理我。
- `$case.sceneVersions[2].casualQuestions[0].answer` 她只说别光留名字，原图别删。我问她什么意思，她说等见面再讲。
- `$case.sceneVersions[2].casualQuestions[1].answer` 知道。可我当时就想先让你们看他怎么记这些女的。
- `$case.sceneVersions[2].questionOptions[0].guardedAnswer` 我不想先谈钱。
- `$case.sceneVersions[2].questionOptions[1].answer` 她让我留原图，别只发名字。别的没说。
- `$case.sceneVersions[3].version` 听过。小姐妹提过一嘴，说有个东西利息挺高。我当时就听了个热闹，没跟她细问。
- `$case.sceneVersions[3].casualQuestions[0].answer` 没有，就说最近有人在买。
- `$case.sceneVersions[3].casualQuestions[1].answer` 她随口一说，我也没当场追着问。我只记住息挺高。
- `$case.sceneVersions[3].questionOptions[0].guardedAnswer` 她说利息高。别的不说。
- `$case.sceneVersions[3].questionOptions[1].answer` 别处。人多。今晚先不说哪。

### 夜 B

- `$case.sceneVersions[4].sceneCloser.lines[1]` 那阵子手里正好空了。具体借了多少，我今晚不想说。
- `$case.sceneVersions[4].sceneCloser.lines[3]` 我在酒吧做营销。订台、看桌，客人开的酒我有提成。
- `$case.sceneVersions[4].sceneCloser.lines[5]` 嗯。有时候当晚结，第二天就花了。
- `$case.sceneVersions[4].sceneCloser.lines[7]` 嗯。酒桌上听的。我后来才去问他。
- `$case.sceneVersions[4].questionOptions[0].lines[0]` 警察。
- `$case.sceneVersions[4].questionOptions[0].lines[2]` 给我放高利贷的那个人涉案了。他们来问借过钱的人。
- `$case.sceneVersions[5].questionOptions[0].lines[0]` 我先问的。
- `$case.sceneVersions[5].questionOptions[0].lines[2]` 我说自己不够一百万，能不能跟着买。他说他那边已经够门槛，我这十二万可以并进去，走他户。
- `$case.sceneVersions[6].sceneCloser.lines[1]` 最后说个事。跟名单没关系。
- `$case.sceneVersions[6].sceneCloser.lines[3]` 上礼拜他还给我修过刘海，手特别轻。我就想不明白，他给我剪头发那么仔细，怎么又能一边跟我谈、一边让别人走他户。
- `$case.sceneVersions[6].questionOptions[0].lines[0]` 想过。所以我才裁图。
- `$case.sceneVersions[6].questionOptions[0].lines[2]` 十二万，不够起投，走我户。
- `$case.sceneVersions[6].questionOptions[0].lines[4]` 我先找他代投的事，也会出来。
- `$case.overnightStructure.callbackOpeners.门边那句自己人.firstConflict.callerLine` 有时候不听。我想听成关系。
- `$case.overnightStructure.callbackOpeners.他写下的跟进.firstConflict.callerLine` 没问。他说自己人，我就没往下问。
- `$case.overnightStructure.callbackOpeners.完整名单与转账.firstConflict.callerLine` 我一看名单就来气。可走他户是我点过头的，真让我一字一字说，也不能都算他偷的。
- `$case.overnightStructure.callbackOpeners.吹风机回放.firstConflict.callerLine` 不能。只能证明他对我说过。
- `$case.overnightStructure.callbackOpeners.周发来的材料.firstConflict.callerLine` 都怕。十二万是我转的。我不想领头装成什么都没做。
- `$case.overnightStructure.callbackOpeners.先要回单.firstConflict.callerLine` 不会。我就是不想带头去店里堵人。
- `$case.overnightStructure.callbackOpeners.门店的说明.firstConflict.callerLine` 转给他个人。
- `$case.overnightStructure.callbackOpeners.一百万门槛.firstConflict.callerLine` 不觉得了。是我先动心。他只是说可以走他户。
- `$case.overnightStructure.callbackOpeners.翻手机的时间.firstConflict.callerLine` ……我就是怕拿不回，才去翻的。
- `$case.overnightStructure.callbackOpeners.宸直窗口答复.firstConflict.callerLine` 没有。只有一张提交页面。
- `$case.sceneVersions[4].version` 就是有人来问了几句话。跟他没直接关系。我现在不想说是谁。
- `$case.sceneVersions[4].casualQuestions[0].answer` 十来分钟。问我什么时候借的、怎么联系上的。
- `$case.sceneVersions[4].casualQuestions[1].answer` 昨晚那一下把我吓着了。一个人待着心里发慌。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 来问我几句话的人。
- `$case.sceneVersions[4].questionOptions[1].answer` 不是躲警察。给我放高利贷的那个人涉案了，他们昨晚来问过。我就是被吓着了，一个人待着慌。
- `$case.sceneVersions[5].version` 是我转的。他当时说可以帮忙，我就信了。
- `$case.sceneVersions[5].casualQuestions[0].answer` 没有。他说先把钱并进去，材料后面给。
- `$case.sceneVersions[5].casualQuestions[1].answer` 他发过一张提交页面，说已经帮我下了。产品全名、合同和回单，我手里都没有。
- `$case.sceneVersions[5].casualQuestions[2].answer` 我下班晚，他肯留最后的号。染发、护理我都找他，酒吧一晚的提成有时候当晚就结，我花钱也快。
- `$case.sceneVersions[5].questionOptions[0].guardedAnswer` 我先问的。
- `$case.sceneVersions[5].questionOptions[1].answer` 当。他还是留晚档，还是叫自己人。我没把这十二万从恋爱里拆出来。
- `$case.sceneVersions[6].version` 完整名单我昨晚就看完了。我那行写着十二万、不够起投、走我户。周那行是一百万、已买。我发给后台时把这些都裁掉了。
- `$case.sceneVersions[6].casualQuestions[0].answer` 号还留着，人没去。头发长了，随便找了家快剪。
- `$case.sceneVersions[6].casualQuestions[1].answer` 找了。她说这产品最近在拖，让我别再转。我才翻他手机的。
- `$case.sceneVersions[6].casualQuestions[2].answer` 只发给小姐妹和你们后台。给你们之前我遮了名字，还没发到网上。
- `$case.sceneVersions[6].questionOptions[0].guardedAnswer` ……会。走我户三个字在上面。
- `$case.sceneVersions[6].questionOptions[1].answer` 之后。转的时候我还觉得息高。她一说拖，我才翻他手机，才打进来要钱。
- `$case.overnightStructure.callbackOpeners.门边那句自己人.line` 门边那句我听见了。他也叫别人自己人。那个熟客一听他要聊别的，马上就拦了。
- `$case.overnightStructure.callbackOpeners.他写下的跟进.line` 隔着玻璃，只看见他让熟客提前做，自己又在备忘录里写跟进。没听见他怎么叫她。我就是觉得这两件事连得太快。
- `$case.overnightStructure.callbackOpeners.完整名单与转账.line` 我把完整图补上了。我那行是十二万、不够起投、走他户，下面就是我自己的转账。
- `$case.overnightStructure.callbackOpeners.吹风机回放.line` 吹风机那段我听清了。那句“也就你肯听我说这些”是他发的，背景一直是店里。
- `$case.overnightStructure.callbackOpeners.周发来的材料.line` 她要拉人去对材料。我不去店里。我只要回单。那张名单，她要留就留。
- `$case.overnightStructure.callbackOpeners.先要回单.line` 我劝她先要回单，别去堵门。我自己的预约也取消了。可我没让她删名单，这事他得自己说。
- `$case.overnightStructure.callbackOpeners.门店的说明.line` 门店那段我看了。他们说店里没让员工收这种钱。他私下做的事，让他自己解释。
- `$case.overnightStructure.callbackOpeners.一百万门槛.line` 小姐妹说，一百万门槛是她在酒桌上讲的。我听完就问自己那点钱够不够。
- `$case.overnightStructure.callbackOpeners.翻手机的时间.line` 她说产品在拖，让我别再转。我回她：我去翻他手机。名单是那之后看见的。
- `$case.overnightStructure.callbackOpeners.宸直窗口答复.line` 窗口只说，你问的那类产品单笔至少一百万，还要核投资者资格；没有产品全名和合同编号，查不了他说的那一笔。
- `$case.overnightStructure.callbackFallback.line` 我回来了。那张名单我又看了一遍。你白天先查了哪一处？
- `$case.overnightStructure.postures.againstCaller` 代投是我问的，这我认。可我没答应被写成女朋友名册拿去养鱼。
- `$case.overnightStructure.postures.withCaller` 昨晚下线以后，我折腾到很晚。白天你查到什么，等我先把昨晚的消息说完。
- `$case.nightStructure.returnStance.lines.defensive` 我差点不打回来。昨晚那张图是我裁的，这个我认。可他为什么收我的钱，也得问。
- `$case.nightStructure.returnStance.lines.open` 我回来了。名单的事你继续问。这回我不先说他养鱼。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。完整名单和转账都发后台了。

### 终局

- `$case.hostDisclosure.lines[0]` ……来剪头的。她那行没有亲密度，只有一百万和已买。
- `$case.hostDisclosure.lines[2]` 看见了。可我那时候气疯了，就想让你们先看那一排女人。现在让我再说周是他女朋友……我说不出口。
- `$case.deepFollowup.resistanceBeat.lines[0]` ……我还是想发。
- `$case.deepFollowup.resistanceBeat.lines[2]` 走我户。
- `$case.deepFollowup.answer` 先把回单和合同户名给我。名单我先不发。十二万怎么处理，等他把材料交出来再说。

### 其他出声面

- `$case.careChoices[0].lines[0]` ……嗯。楼下新开了家，十五块快剪。就是不聊天。
- `$case.careChoices[0].lines[2]` 不聊挺好。
- `$case.careChoices[1].lines[0]` ……我还真怕你也说我活该。你这么讲，我能听进去。
- `$case.careChoices[2].lines[0]` 行。想不好我就再打。
- `$case.overnightStructure.returnLead.lines[0]` 我现在在我妈家，她电视还开着。要是吵，你跟我说。
- `$case.overnightStructure.returnLead.lines[2]` 有人来问了几句话。我现在不太想说。
- `$case.overnightStructure.returnLead.lines[4]` 安全。可再往下说，直播间里可能有人认出我。你先问别的，行吗？
- `$case.overnightStructure.liveCounterBeats[0].lines[1]` 转了三张图：她给他的一百万、他说先放进宸直的聊天，还有一张认购回单。
- `$case.overnightStructure.liveCounterBeats[0].lines[3]` 不能。我手里只有她转来的图。是不是同一笔钱，我看不出来。我那十二万进没进产品，更看不见。
- `$case.overnightStructure.liveCounterBeats[1].lines[0]` 等会儿。刚那条弹幕我看见了——『收了好处装什么受害者』。
- `$case.overnightStructure.liveCounterBeats[1].lines[2]` 谁装了？！息是我自己想买的！你们倒是来一个人凑一百万试试啊！
- `$case.overnightStructure.liveCounterBeats[1].choices[0].lines[0]` ……嗯。你问吧。
- `$case.overnightStructure.liveCounterBeats[1].choices[1].lines[0]` ……我先问的。行了吧。
- `$case.overnightStructure.liveCounterBeats[1].choices[1].lines[2]` 往下问。
- `$case.overnightStructure.liveCounterBeats[1].choices[2].lines[1]` ……算了。当我没看见。

## Tony

- **固定性格：** 讨喜的即兴交易者
- **受压反应：** 被逼着定义关系时退回服务和店务，把情绪词说成维护。
- **防御动作：** 先认自己人、晚档、走我户和已经提交，再把名单说成跟进不是女朋友；声称产品材料只给何本人，不向节目交代。不上麦。
- **知识边界：** 知道自己的聊天、会员记录、私人名单、何转到自己户头的十二万，以及自己把钱实际送去了哪里；不知道产品最终能否兑付，也不能代表门店对外卖理财。节目没有拿到他所称的产品全名、合同和回单。他不上麦。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 姐，先坐会儿。
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[0]` 自己人还排什么队啊。我把手上这个做完就轮你。
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[2]` 行，不说那个。你先坐，我这边马上好。

### 后台／材料回流

- `$case.respondentNote.text` 是她先问能不能跟着买。十二万过到我户，我说过走我户，也跟她说过已经提交。名单是我记的客户跟进，不是女朋友名册。她叫我自己人，晚档我也留过。产品全名、合同和回单，我只给她本人，不发直播间。我不上麦。

## Tony 案邻桌常客

- **固定性格：** 厌烦套路的直肠子
- **受压反应：** 听见熟悉话术就直接复述自己听过的版本。
- **防御动作：** 只说耳朵听见的，不负责解释。
- **知识边界：** 只知道同席时听见的当面话，不知道麦外私聊。

### 白天

- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[1]` 你可少来。今天就补颜色，别又跟我说那个。我没钱。

## Tony 案小姐妹

- **固定性格：** 酒桌知情却不愿当证人的朋友
- **受压反应：** 先划清自己只说过门槛，再把后续动作推回何。
- **防御动作：** 只认酒桌上说过一百万起，不认自己让她买。
- **知识边界：** 知道自己在酒吧酒桌说过高息档一百万起，也知道何听完就问自己那点钱够不够；后来听说赎回要排队才让何别再转。不知道 Tony 名单全文、十二万是否入产品、Tony 有无代销资格。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 息高那档我在酒桌上说过。一百万起。我没让她买。
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[0]` 门槛是我听来的，不是 Tony 教我的。何听完就问够不够自己那点钱。我当时还笑她。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[0]` 最近有人说赎回要排队。我怕她已经转了，才让她别再转。她回我一句：我去翻他手机。

## Tony 案店长

- **固定性格：** 急躁的防守型管理者
- **受压反应：** 追问私表越深，越快结束谈话并关门。
- **防御动作：** 承认培训，不承认自己知道私人推进。
- **知识边界：** 知道培训、会员制度和员工指标，不知道Tony全部私人对话。

### 后台／材料回流

- `$case.investigationHooks[0].material` 店长说：“我们店只做美发，也没让员工替客人收钱。Tony 私下聊过什么、手机里记了什么，你们直接问他，别把整家店带进去。”

## Tony 案另一位女客

- **固定性格：** 受伤后外放的感性派
- **受压反应：** 越被拒绝越想把个人尴尬变成共同指控。
- **防御动作：** 用‘不止我一个’压过自己的受用。
- **知识边界：** 知道自己转过一百万、名单行写已买、Tony 发来的聊天和一张认购回单；不知道咨询者的十二万是否入了同一产品，也不知道其他顾客是否投过钱。

### 后台／材料回流

- `$case.investigationHooks[1].material` 周说：“我那行写一百万、已买。他给我发过一张回单。我不去店里闹，材料可以交警方。回单是不是对应我那笔钱，让他们查。”

## Tony 案宸直柜员

- **固定性格：** 守窗口权限的程序执行者
- **受压反应：** 一碰到代持代购就收口，没有合同编号就结束谈话。
- **防御动作：** 只报高息档起投，其余推给系统户名。
- **知识边界：** 只知道高息档个人认购起投一百万；代持代购、具体合同和兑付结果不在窗口可答范围。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[0]` 你问的那类产品，单笔认购至少一百万，还要做投资者资格和风险匹配。
- `$case.overnightStructure.dayScenes[2].body.beats[2]` 系统只认合同上的委托人。你没有产品全名和合同编号，我查不了。
- `$case.overnightStructure.dayScenes[2].body.beats[3]` 后面还有人办业务，先这样。

## 老方

- **固定性格：** 急躁的结果主义者
- **受压反应：** 数据越差，句子越像截止日期和命令。
- **防御动作：** 把关心包装成指标，把认可包装成下一项要求。
- **知识边界：** 只知道节目运营、后台曲线和公开播出内容，不知道案件麦外真相。

### 其他出声面

- `$case.overnightStructure.liveCounterBeats[2].text` 店家商务函到平台了，点名这通。法务让缓。你要继续，数据得扛住。——方

## V哥

- **固定性格：** 沉着的直觉教练
- **受压反应：** 玩家越急，他越让人停一下，只比较两件已知事物。
- **防御动作：** 短句，先停，再分开看。
- **知识边界：** 只知道玩家当前已经听见或看见的内容。

### 夜 A

- `$case.sceneVersions[0].helperHint` 先看她发来的图到哪里为止，再问她为什么把这些名字读成女友。
- `$case.sceneVersions[1].helperHint` 约会和帅都可以是真的。先问他有没有亲口说过在谈，再看这能不能撑起养鱼。
- `$case.sceneVersions[2].helperHint` 先问她为什么只让节目看到像约会的部分，不急着逼出金额。
- `$case.sceneVersions[3].helperHint` 她听过高息，却还没说门槛，也没说自己后来做了什么。

### 夜 B

- `$case.sceneVersions[4].helperHint` 先问昨晚来人是谁，再追她为什么借过这笔钱；不要替警方定性。
- `$case.sceneVersions[5].helperHint` 先问是谁提出代投，再问她何时开始觉得要翻脸。
- `$case.sceneVersions[6].helperHint` 她昨晚已经看完全表。今晚要问的是：公开名单会带出她自己的哪一层。

# 快案：什么都不图

## 林旭阳

- **固定性格：** 温热、有分寸，也有明确好恶
- **受压反应：** 事实没闭合时先缩短句子，把混在一起的事拆开；证据已经对齐，对方还在把自己的代价甩给别人时，他会收笑、直说，火气只落在具体做法上。
- **防御动作：** 把感情和责任分开问，事实不够时不用火气补证据；事实够了，也不拿中立当成不表态的借口。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 其他出声面

- `$quick.turns[0].host` 你好，能听见吗？
- `$quick.turns[1].host` 那你今天什么问题？
- `$quick.turns[2].host` 先把你自己的情况，还有以前谈过的，大概说一下。
- `$quick.turns[3].host` 你为什么把这个看得这么重？
- `$quick.turns[4].host` 你刚才说自己能养活自己。现在是租房，还是跟家里住？
- `$quick.turns[5].host` 那你爸还挺疼你的，自己身体这样，还先把你的房子解决了。
- `$quick.turns[6].host` 那你愿意见什么样的？你一次说完。
- `$quick.turns[7].host` 我这边正好有个登记过的听众。三十一，月薪六千，没房，在物流公司做调度。条件跟你刚才说的差不多，要不要先留个联系方式？
- `$quick.turns[8].host` 那什么样的介绍，你会更放心？
- `$quick.turns[9].host` 你那套房买下来一共多少钱？
- `$quick.turns[10].host` 你为什么一定想让我来介绍？
- `$quick.confrontations[0].lines[0]` 先说买房那一百万。你亲爸伤了腰，现在只能偶尔替人看店。后面你又说“爸爸”给了你一百万。我顺着亲爸往下说，你也没纠正。给钱的到底是不是你亲爸？
- `$quick.confrontations[0].lines[2]` 我只问一句，他是不是你亲生父亲？
- `$quick.confrontations[0].lines[4]` 区别是你亲爸一个月挣不了多少钱，另一个人却能一次拿出一百万。他到底是你什么人？
- `$quick.confrontations[1].lines[0]` 还有一句，我刚才没接。你说两个人遇上事别散，偏偏举了“哪怕是我不能生孩子”。你这个年纪，想到的顶多是以后他有钱了会不会变心，怎么会先想到自己不能生孩子？
- `$quick.confrontations[1].lines[2]` 那到底有没有嘛？
- `$quick.confrontations[2].lines[0]` 你说月薪四五千、没房、大你五岁以内都可以。我真给你一个月薪六千、没房的，你又不愿意留联系方式。
- `$quick.confrontations[2].lines[2]` 可下一句你就要我介绍自己做生意、家里稳定的，最好还能帮你减轻房贷。你那套房总价两百万。这些才是你的要求，前面一直没说。
- `$quick.confrontations[3].lines[0]` 你说那段感情慢慢散了，是因为自己不会讲好听话，吵完也不会哄人。可一到让我帮忙，你马上夸我看人准，叫我旭阳哥，还想让我先替你说好话。你明明知道什么时候该把话说软。
- `$quick.confrontations[3].lines[2]` 当然不一样。可你明明知道什么时候该把话说软。那段感情最后散了，根本原因真是你不会说好听话吗？
- `$quick.ending.summaryPages[0].lines[0]` 给你一百万的不是亲爸。你主动拿自己不能生孩子举例，问回去才承认做过检查。想找条件好的人可以直接说，可你还要借我的信誉去认识人，这个忙我不能帮。
- `$quick.ending.summaryPages[0].lines[2]` 那就不介绍。今天到这儿。
- `$quick.ending.summaryPages[1].lines[0]` 我们来把这次这个连线复个盘。
- `$quick.ending.summaryPages[1].lines[1]` 电话挂了，我们把她刚才的话放在一起。亲爸伤了腰，只能偶尔替人看店；买房的一百万，却是另一个她也叫“爸爸”的人给的。我顺着亲爸往下说时，她没有纠正，直到被问住才承认不是同一个人。
- `$quick.ending.summaryPages[1].lines[2]` 她说月薪四五千、没房也能谈，还说不会让男方养她。真给她一个月薪六千的普通上班族，她却不肯接，下一句就要我介绍自己做生意、家里稳定的，最好还能帮她减轻房贷。她来这里，是想借我的名字接触条件更好的人。
- `$quick.ending.summaryPages[1].lines[3]` 她说找对象最怕别人瞒着她。可说到两个人遇上事别走散，她偏偏拿自己不能生孩子举例。我回头问，她第一反应是“你怎么能这么问”，然后才承认做过检查。
- `$quick.ending.summaryPages[2].lines[0]` 按现有信息，我能确认的是：她把亲生父亲和出资买房的另一位“爸爸”混在一起说，直到被追问才拆开。那一百万元从哪里来、双方是什么关系、现在是否还有往来，她都没有解释清楚。
- `$quick.ending.summaryPages[2].lines[1]` 她先把分手归到不会哄人，继续问才补出自己脾气不好、吵架时双方都不让步。求我帮忙时，她也知道怎么夸人、把话说软。至少可以判断，开场那句“不会说好听话”不是一段完整的分手原因。
- `$quick.ending.summaryPages[2].lines[2]` 她现在想从我认识的人里找一个条件不错的，还希望我先替她背书。可出资人的关系、她真正接受的对象条件，以及需要由她本人向未来伴侣说明的婚育信息都没有讲完整。这个背书我不能做。
- `$quick.ending.summaryPages[2].lines[3]` 她主动拿自己不能生孩子举例，回问以后才承认做过检查。检查究竟说明什么，要由医生和她本人说清；直播间不能替她下医学结论，更不能由此猜她的经历。能要求的只有一件事：进入认真关系前，相关信息要由她自己如实沟通。
- `$quick.ending.summaryPages[2].lines[4]` 信息没有讲完整之前，我不会替任何一方做婚恋背书。
- `$quick.ending.summaryPages[2].lines[5]` 这通电话足够让我拒绝介绍，但不够让我替她编出一段没有证据的人生。

## 快案来电人·罗

- **固定性格：** 擅长用低姿态和亲近感争取入口的机会主义自保者
- **受压反应：** 被追到钱源时先坚持长期父女称呼、反问为什么非要分清，被逼着回答是否亲生以后才最小承认，再用隐私和自愿赠与转题；被回问为什么拿自己不能生孩子举例时先反问“你怎么能这么问”，直到主播再追一句才承认做过检查。
- **防御动作：** 先把择偶条件压到极低，把两位不同男性都称为“爸爸”；把检查结果藏在看似随口的假设里，被回问后先反驳提问方式。
- **知识边界：** 知道亲生父亲的身体与家庭经历、一百万元的真实给款人、自己的检查结果和择偶目标；不会公开年长给款者的身份。她不知道父母和前任会怎样解释旧事，也不能用检查结果证明任何性经历。

### 其他出声面

- `$quick.turns[0].caller` 能听见。
- `$quick.turns[1].caller` 我想问下我的择偶定位。您这儿有合适的资源，当然更好。
- `$quick.turns[2].caller` 我二十四，在商场卖衣服，底薪加提成一个月六七千，自己能养活自己。以前谈过两个，一个去了外地，另一个总说我脾气硬。我不太会讲好听的，吵完也拉不下脸哄人，后来就散了。现在就想找个踏实点的，别赌，别动手，家里真遇上事也别瞒着我、转身就跑。
- `$quick.turns[3].caller` 我爸以前给人开货车，后来伤了腰，坐久一点都疼，重活也干不了。家里本来就没什么钱，他一伤，收入也断了。我妈看这日子过不下去，连句话都没多说，收拾东西就走了。那年我还在上小学，后来是我爸一个人把我带大的。现在他偶尔替熟人看看店，也挣不了多少。所以我就觉得，两个人真碰上病啊、没法上班啊，别说散就散。哪怕以后是他身体不好，或者是我不能生孩子，也能商量着过。
- `$quick.turns[4].caller` 我自己有套小两居，还有一点贷款。去年买的时候，我爸爸给了我一百万，我又添了一点才买下来。以后男方没房，也可以先住我这里。
- `$quick.turns[5].caller` 嗯，他在我身上一直挺舍得的。钱的事您就别替我操心了，我不会让男方养我。
- `$quick.turns[6].caller` 一个月四五千也行，年龄大我五岁以内，没房也可以。学历、长相我真不挑。合适的话相处一两年就结婚。商场下班晚，我平时也没什么机会认识人，要不然也不会来找您。
- `$quick.turns[7].caller` 先别急吧。就这么几句话，我也不知道他平时是什么样的人。加了以后不合适，再删也挺麻烦的。
- `$quick.turns[8].caller` 最好是您认识久一点、知道底细的。工作稳定当然好，要是自己做点生意，家里也省心，就更合适。不是非得有钱，我主要是怕遇到不靠谱的。能帮我减轻点房贷压力，那就更好了。
- `$quick.turns[9].caller` 总价两百万。
- `$quick.turns[10].caller` 您做这个两年多了，看人肯定比我准。您要是先跟他说一句，我这人还可以，他至少愿意见我一面。旭阳哥，我条件真没那么多，您就帮我留意一下吧。
- `$quick.confrontations[0].lines[1]` 我一直叫他爸爸，他也一直把我当女儿。钱是他愿意给我的，你们为什么非要分得这么清？
- `$quick.confrontations[0].lines[3]` ……不是亲爸。可我叫了这么多年，跟亲爸有什么区别？
- `$quick.confrontations[0].lines[5]` 这是我的私事，我没必要在直播里全说。反正钱是他自愿给的，不是我偷的抢的，房子也在我名下。
- `$quick.confrontations[1].lines[1]` 你怎么能这么问？我就是顺嘴举个例子。
- `$quick.confrontations[1].lines[3]` ……我以前确实查过。医生说自然怀孕的机会低一点，又没说一定不能。我还年轻，后面也可以再复查。
- `$quick.confrontations[2].lines[1]` 我没说不要，我就是觉得只听几句话不稳妥。
- `$quick.confrontations[2].lines[3]` 我也没说一定要他替我还啊。以后两个人一起住，一起承担一点不是很正常吗？能找条件好一点的，谁会故意找差的？
- `$quick.confrontations[3].lines[1]` 我求人帮忙，客气一点怎么了？谈恋爱和求人能一样吗？
- `$quick.confrontations[3].lines[3]` 感情里的事哪有一句两句说得清。我脾气也不好，吵起来谁都不让谁，后来就散了。你非要算我骗你，我也没办法。
- `$quick.ending.summaryPages[0].lines[1]` 我就是想让你帮忙介绍一下，又没让你替我保证一辈子。你不愿意就算了。

# 快案：那晚没回消息

## 林旭阳

- **固定性格：** 温热、有分寸，也有明确好恶
- **受压反应：** 事实没闭合时先缩短句子，把混在一起的事拆开；证据已经对齐，对方还在把自己的代价甩给别人时，他会收笑、直说，火气只落在具体做法上。
- **防御动作：** 把感情和责任分开问，事实不够时不用火气补证据；事实够了，也不拿中立当成不表态的借口。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 其他出声面

- `$quick.turns[0].host` 你好，能听见吗？
- `$quick.turns[1].host` 你说吧，遇上什么事了？
- `$quick.turns[2].host` 你先把你们俩的情况大概说一下。
- `$quick.turns[3].host` 这一个月怎么相处的？你为什么觉得他不懂你？
- `$quick.turns[4].host` 花发出去以后呢？那条动态还找得到吗？
- `$quick.turns[5].host` 他是从哪件事以后不联系的？那晚你从头说一下。
- `$quick.turns[6].host` 刚才那晚重新讲一遍。你回了‘还行’以后，发生了什么？
- `$quick.turns[7].host` 后面又点的那一轮，你还记得自己喝了多少吗？
- `$quick.turns[8].host` 你说自己很久没出去。近两个月的动态还能找着吗？
- `$quick.turns[9].host` 第二天他怎么知道桌上还有别人？
- `$quick.turns[10].host` 十号你还发了一组 KTV 的照片，那是哪天拍的？
- `$quick.turns[11].host` 八号你也出去喝酒了？
- `$quick.turns[12].host` 所以你现在希望我帮你判断什么？
- `$quick.confrontations[0].lines[0]` 你发来的花那张里，旁边那个新包也是他送的吧？
- `$quick.confrontations[0].lines[2]` 你刚发来的朋友圈截图我看了。朋友问你是不是谈恋爱了，下面有人点赞，有人说羡慕，你回得挺开心。再往前几条，也都是漂亮饭、演唱会这些。看得出来，你很在意别人觉得你过得好不好。
- `$quick.confrontations[0].lines[4]` 我们不脱离感情只谈钱。你希望他懂你，可以；可你也喜欢他送花、送包，还希望别人羡慕他给你的生活。这部分不能不说，别只剩一句他听不懂你的歌。
- `$quick.confrontations[1].lines[0]` 十一点五十二你还能回‘还行’，六分钟以后就不回了。那时候你已经喝得难受，只是不想让他知道，对吗？
- `$quick.confrontations[1].lines[2]` 你喝多了，还跟他说没事。可你开场只剩一句‘漏看了消息’，真正让他担心的那一段没了。
- `$quick.confrontations[2].lines[0]` 你刚说有些酒是别人点的。这个‘别人’是谁？
- `$quick.confrontations[2].lines[2]` 男的还是女的？
- `$quick.confrontations[2].lines[4]` 你前面一直说是姐妹俩小聚。现在桌上多出一个男的。男的在场不能证明你们发生过什么，可这件事不该问到这里才有。
- `$quick.confrontations[3].lines[0]` 你说朋友圈只是几张照片。可近两个月有六次酒吧或者 KTV，三条发在凌晨四点以后，照片里也不是每次都跟同一拨人。你都跟谁去的，那几次回宿舍了吗？
- `$quick.confrontations[3].lines[2]` 婚介跟他说你生活简单，你刚接通又说自己很久没出去，只碰巧喝多一次。可照你自己说的，读研以后一直跟不同的人喝酒、唱歌，有几次还玩到天亮。到现在你还往‘偶尔一次’上说。男方看到了当然不可能信啊。
- `$quick.confrontations[4].lines[0]` 你不是主动告诉他的，是解释时先说漏了一个‘他’，对吧？
- `$quick.confrontations[4].lines[2]` 他问这个‘他’是谁，你才把桌上那个人补上。不是他凭空怀疑。
- `$quick.confrontations[5].lines[0]` 十号你跟他解释九号喝多了。同一天，你又发了八号在 KTV 的照片。他看见的就是：你刚为一晚喝酒道歉，转头又在展示另一晚。
- `$quick.confrontations[5].lines[2]` 可他看到的是你十号发了一组 KTV 的照片，哪知道那是八号拍的？你刚为喝断片道歉，转头又在发喝酒的照片。对方又不傻，你这道歉还能有多少分量？
- `$quick.confrontations[5].lines[4]` 当然能发。只是他也能据此决定，这是不是自己想认真走下去的关系。
- `$quick.ending.summaryPages[0].lines[0]` 我不建议你再拿‘你为什么不懂我’去问他。你真要联系，就把八号、九号、桌上那个人，还有你当时已经喝到什么程度，一次说清。他信不信、还愿不愿意继续，这次也一起问清楚，别再来回猜了。
- `$quick.ending.summaryPages[0].lines[2]` 你是每问到一步才多说一点，这跟一开始就把事情说完整是两码事。他要不要继续是他的选择。你要做的，是别再遮遮掩掩，拿一个谎话去圆另一个谎话。
- `$quick.ending.summaryPages[1].lines[0]` 我们来把这次这个连线复个盘。
- `$quick.ending.summaryPages[1].lines[1]` 我还是那句话：动作倒推发心，逻辑要闭环。
- `$quick.ending.summaryPages[1].lines[2]` 八号，她和师姐去 KTV。九号，她跟妹妹以及妹妹的一名男性朋友去酒吧，混着喝到吐；十一点五十二还回‘还行’，六分钟后不再回。十号，她道歉，当天又发了八号的 KTV 照片。
- `$quick.ending.summaryPages[1].lines[3]` 婚介跟男方说她生活简单，她今晚也先说自己很久没出去。对质以后，桌上多出一个男的；再看她发来的旧动态截图，近两个月有六次酒吧或者 KTV。继续问，她才承认读研以后聚会一直不少，同行的男男女女也不是固定一拨。
- `$quick.ending.summaryPages[1].lines[4]` 再往前看，她说自己只想要深度交流，可花是她开口要的，包也是对方送的，花、包和车又被她放进了同一条动态。她不只想被理解，也很享受男方的条件和这段关系被别人看见。
- `$quick.ending.summaryPages[2].lines[0]` 男方原本按认真结婚的方向慢慢相处，婚介告诉他的也是学历好、生活简单。这个周末以后，他先问出酒桌上的第三个人，又在她道歉那天看见一组 KTV 照片。我再看她发来的旧动态，近两个月有六次夜场；继续问，她才承认读研以后聚会一直不少。问题不在她是学生还是女性，而在她把长期生活状态说成了一次偶然。
- `$quick.ending.summaryPages[2].lines[1]` 她今晚想让我把原因归到男方不理解她，再帮她想办法复合。可她开场把醉酒程度、第三个人和长期聚会频率都缩小了，后面也是问到一步才多说一点。这种解释很难让对方继续信任。
- `$quick.ending.summaryPages[2].lines[2]` 酒桌上有没有发生别的事，不用猜，也不影响现在的判断。她嘴里说的自己，和那个周末做的事对不上，男方有足够理由退出。我说实话，也建议男方退出。
- `$quick.ending.summaryPages[2].lines[3]` 这只能说明两个人对生活方式和坦诚程度的期待可能不合，不能证明她出轨、把谁当备选，或者由谁供养。男方可以选择退出，她也该先把自己的生活说完整。

## 快案来电人·周女士

- **固定性格：** 很会把自己放在重感情的位置上，却总把不利事实拆开讲的体面自保者
- **受压反应：** 第一轮先坚持自己只是漏回一条消息；被问酒是谁点的时，把第三个人缩成‘别人’和‘妹妹的朋友’，直到主播问性别才承认是男性；第二天对男方解释时，她也先只说妹妹，直到自己说漏一个‘他’才被追问出第三个人；她说明朋友圈现在三天可见，再自己翻出两批旧动态截图发给后台。等主播问到凌晨照片和近两个月的夜场频率，她才承认读研以后聚会一直不少、同行男的女的都有，却仍把长期状态缩成普通聚会。
- **防御动作：** 先把问题放到情绪交流，说明朋友圈现在三天可见，再自己翻出经过挑选的花、包、车、漂亮饭和演唱会截图自证只是正常分享；主播问到包时，她强调自己没有开口要。随后把分开压成漏回一条消息；第二轮用‘别人’和‘妹妹的朋友’回避性别；第三轮承认自己对男方也是说漏一个‘他’以后才补出男性同行者，再翻出近两个月带时间的动态并截屏发来，想证明平时不这样。看到凌晨照片以后，她才把口径改成读研以后聚会一直不少，却继续用‘普通聚会’和‘不是天天出去’淡化长期状态。
- **知识边界：** 知道八号 KTV、九号酒吧、十号发动态的真实顺序，也知道九号酒桌上的全部人员、自己的醉酒程度、读研以来聚会一直不少、同行有不同圈子的男女，以及近两个月朋友圈里的六次夜场记录和其中两三次彻夜不归；不知道男方退出时最看重哪个因素，不能证明酒局里发生过未播行为。肩臂大片纹身是男方初见时已知的背景，不能单独当成生活方式证据。

### 其他出声面

- `$quick.turns[0].caller` 能听见。
- `$quick.turns[1].caller` 我跟一个男生接触了一个月，本来都挺好的，最近突然不联系了。我觉得他什么都肯做，就是不太懂我的感受。我想问，是不是我对交流要求太高了。
- `$quick.turns[2].caller` 我二十六，研三，本科和硕士都在一所985高校。他三十五，自己开公司，是婚恋机构介绍的。机构跟他说我学历好、生活简单，也跟我说他想认真结婚。他至少中A8，本地两套平层。我们家就普通家庭，A7吧。家里能支持我，所以找对象也不是指望他养我。
- `$quick.turns[3].caller` 我们一周见两三次，吃饭、散步，他也会开车来接我。我说累，他就把餐厅换到学校附近。可我发一首歌给他，他隔很久只回一句‘听了’，从来不问我为什么发。我有次刷到一束花，顺口问他能不能也送我一束，下次他真带了一大束来。花是有了，可两个人还是聊不到里面去。
- `$quick.turns[4].caller` 我挺高兴的，坐在他车里拍了照片。朋友在下面问是不是谈恋爱了，还有人说羡慕，我回了几个表情。现在朋友圈三天可见。你这边看不到以前的。我自己还能翻。我把花那条和前面几条都截了，刚发后台，前面就是吃饭、演唱会这些。
- `$quick.turns[5].caller` 我妹妹叫我出去坐坐。我已经很久没出去了，正好她想喝一点，我们就去了一家清吧。十一点五十二，他问我喝得怎么样，我回‘还行’；十一点五十八，他又问我准备几点回去。后面那条我没看见，早上七点多才回。第二天我解释了，他还是越来越冷。
- `$quick.turns[6].caller` 那时候我其实已经有点晕了，怕他知道我喝多，才回了‘还行’。桌上混着点了几种鸡尾酒，还有龙舌兰，后面又有人点了一轮。我后来吐了，回去那段也记不太清，醒来已经在妹妹家。
- `$quick.turns[7].caller` 记不清了。就是有人又加了酒，我那时候已经开始晕，后来还吐了。
- `$quick.turns[8].caller` 我又截了一批发后台了。里面是有六次酒吧或者 KTV，上个月三个周末都有，最晚一张发到凌晨五点十七分，可有的是生日，有的是毕业聚会。照片里也能看见我胳膊上那片纹身，他第一次见我就看见了，这个我没藏。发得晚也不等于我每次都喝醉。
- `$quick.turns[9].caller` 我一开始只说自己喝多了，妹妹把我送回去。后来解释的时候顺嘴说了句‘他也不知道我会吐成那样’，男方就问这个‘他’是谁。后来他追着问，我才把那个人也说了。
- `$quick.turns[10].caller` 十号我发过一组 KTV 的照片。他可能以为是喝断片那晚拍的，其实不是，那是八号的照片，我晚了两天才发。
- `$quick.turns[11].caller` 我跟师姐去唱歌，包厢套餐里带了六杯鸡尾酒。那天就我们两个，我也没喝醉，和九号不是一回事。
- `$quick.turns[12].caller` 我想知道他是不是把这件事看得太重，也想问我还要不要联系。他条件确实合适，我也是真想认真谈。可如果在一起以后连跟妹妹出去都要这样，我也会累。
- `$quick.confrontations[0].lines[1]` 嗯。第一次逛街时我在柜台前多看了几眼，他后来自己买的。我可没开口跟他要。
- `$quick.confrontations[0].lines[3]` 朋友圈不就发这些吗？我总不能把两个人私下聊什么也发上去。我喜欢拍照，不代表我不想好好交流。
- `$quick.confrontations[0].lines[5]` ……行。花和包我都喜欢，有人说羡慕，我也挺高兴。但我也不是只看这些。
- `$quick.confrontations[1].lines[1]` 我当时想着马上就走了，没必要让他跟着担心。谁知道那几分钟以后我会那么不舒服。
- `$quick.confrontations[1].lines[3]` 好，我那句‘还行’确实逞强了。但我第二天一醒就说了，也没有故意晾他。
- `$quick.confrontations[2].lines[1]` 我妹妹的一个朋友。他本来就在附近，后来过来坐了一会儿。
- `$quick.confrontations[2].lines[3]` ……男的。但我跟他不熟，也不是我叫来的。
- `$quick.confrontations[2].lines[5]` ……我是不想被误会，不是想骗人。
- `$quick.confrontations[3].lines[1]` 同学、师兄师姐都有，男的女的都有。有两三次太晚了，我就在妹妹那里睡了。读研以后聚会一直不少，但也不能说我天天在外面玩吧。
- `$quick.confrontations[3].lines[3]` 我没觉得聚会多就等于不认真。再说我单身的时候怎么玩，跟认真谈对象又不是一回事。
- `$quick.confrontations[4].lines[1]` 我当时急着解释，哪会每句话都说得那么严谨。他听见了就一直问。
- `$quick.confrontations[4].lines[3]` ……是。但那个人就是我妹妹的朋友，我不想说得好像我专门去见他一样。
- `$quick.confrontations[5].lines[1]` 可那不是同一天。我照片早就修好了，不发也浪费。他要是问，我完全可以解释。
- `$quick.confrontations[5].lines[3]` 那我总不能因为他不高兴，什么都不发、哪里也不去吧？
- `$quick.confrontations[5].lines[5]` ……所以你也觉得，他不联系不是冲动。
- `$quick.ending.summaryPages[0].lines[1]` 可这些我后来都解释了。他不肯回，我还能怎么办？
- `$quick.ending.summaryPages[0].lines[3]` ……好，我知道了。

# 未在本报告捕获到台词的人物卡

- 周会计（zhou-accountant）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。
- 张法医（zhang-forensic）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。
- Tony 案前台（case2-front-desk）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。

# 句长节奏人工复核

以下只是朗读提醒，不自动判错。三句服务于不同防御动作时可以保留。

- 01-credit／林旭阳／nightB：19、18、20 字（$case.sceneVersions[7].casualQuestions[1].question；$case.sceneVersions[7].casualQuestions[2].question；$case.sceneVersions[7].casualQuestions[3].question）
- 01-credit／林旭阳／nightB：28、28、24 字（$case.sceneVersions[7].questionOptions[0].question；$case.sceneVersions[7].questionOptions[1].question；$case.overnightStructure.callerQuestion.options[0].label）
- 01-credit／林旭阳／nightB：28、24、24 字（$case.sceneVersions[7].questionOptions[1].question；$case.overnightStructure.callerQuestion.options[0].label；$case.overnightStructure.callerQuestion.options[1].label）
- 01-credit／林旭阳／nightB：24、24、26 字（$case.overnightStructure.callerQuestion.options[0].label；$case.overnightStructure.callerQuestion.options[1].label；$case.overnightStructure.callerQuestion.options[2].label）
- 01-credit／案一咨询者·沈／nightB：26、25、22 字（$case.overnightStructure.callbackOpeners.房租是不是另外付的.firstConflict.lines[3]；$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[1]；$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[3]）
- 01-credit／案一咨询者·沈／nightB：27、28、31 字（$case.overnightStructure.callbackOpeners.两个月一次的房租.line；$case.overnightStructure.callbackOpeners.房租是不是另外付的.line；$case.overnightStructure.callbackOpeners.流水圈注.line）
- 01-credit／案一咨询者·沈／nightB：31、32、29 字（$case.overnightStructure.postures.withCaller；$case.nightStructure.returnStance.lines.defensive；$case.nightStructure.returnStance.lines.open）
- 04-workplace／第二通咨询者·陈／nightB：21、24、22 字（$case.overnightStructure.callbackOpeners.供应商返费三层表.firstConflict.callerLine；$case.overnightStructure.callbackOpeners.茶水间立项缺口.firstConflict.callerLine；$case.overnightStructure.callbackOpeners.茶水间责任对照.firstConflict.callerLine）
- 04-workplace／第二通咨询者·陈／nightB：45、43、45 字（$case.sceneVersions[4].questionOptions[1].answer；$case.overnightStructure.callbackOpeners.她整理的报销时间线.line；$case.overnightStructure.callbackOpeners.财务窗口补报销要求.line）
- 04-workplace／林旭阳／nightB：26、24、25 字（$case.overnightStructure.callbackOpeners.供应商返费三层表.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.茶水间立项缺口.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.茶水间责任对照.firstConflict.hostLine）
- 04-workplace／林旭阳／nightB：24、25、22 字（$case.overnightStructure.callbackOpeners.茶水间立项缺口.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.茶水间责任对照.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.立项页不是报销单.firstConflict.hostLine）
- 04-workplace／职场案部门助理／day：31、33、35 字（$case.overnightStructure.dayScenes[2].body.beats[1]；$case.overnightStructure.dayScenes[2].body.beats[2]；$case.overnightStructure.dayScenes[2].body.beats[3]）
- 04-workplace／职场案部门助理／day：35、38、36 字（$case.overnightStructure.dayScenes[2].body.beats[3]；$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[0]；$case.overnightStructure.dayScenes[2].body.choice.options[1].resultBeats[0]）
- 02-tony／第四通咨询者·何／nightA：33、34、35 字（$case.sceneVersions[1].version；$case.sceneVersions[1].revisedVersion；$case.sceneVersions[1].casualQuestions[0].answer）
- 02-tony／第四通咨询者·何／nightB：36、33、34 字（$case.overnightStructure.callbackOpeners.门店的说明.line；$case.overnightStructure.callbackOpeners.一百万门槛.line；$case.overnightStructure.callbackOpeners.翻手机的时间.line）
- quick-02-one-missed-message／林旭阳／other：21、18、22 字（$quick.turns[3].host；$quick.turns[4].host；$quick.turns[5].host）
- quick-02-one-missed-message／快案来电人·周女士／other：34、38、34 字（$quick.confrontations[0].lines[5]；$quick.confrontations[1].lines[1]；$quick.confrontations[1].lines[3]）
