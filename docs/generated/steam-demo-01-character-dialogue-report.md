# 《Steam 试玩版》按角色台词报告

> 本文档由内容包自动生成。它把分散在夜 A、白天、夜 B、顾问回流和结案中的台词重新按人物聚合，供遮名辨人、知识边界和句长节奏审稿。请修改 JSON 真源后运行 `npm run content:dialogue-report`，不要手改本文档。

## 汇总

- 固定人物卡：35
- 收录台词／玩家可见人物材料：967
- 本包实际出声人物：34
- 句长节奏人工复核提示：19
- 构建时硬拦截：未归属说话人、越案人物 ID，以及“我现在想知道的是／本质上／更重要的是／一方面另一方面”高密度模板。

# 全集外壳

## 林旭阳

- **固定性格：** 温热而克制
- **受压反应：** 担心误判时先缩短句子，把混在一起的事实拆开。
- **防御动作：** 把感情和判决分开，用小而合法的试探代替情绪宣判。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 其他出声面

- `$manifest.nightShell.prologue.lines[0]` 我叫林旭阳，三十三岁。以前在一家互联网大厂做法务。失业以后，阴差阳错开了这个直播间。不温不火，也做了两年半。我老婆是我大学同学，现在是执业律师。
- `$manifest.nightShell.prologue.hostLine` 改版又催上了，先让他催着。开播了哈，今天继续连麦。
- `$manifest.nightShell.interludes[0].lines[1]` 已经兑不出来了？
- `$manifest.nightShell.interludes[0].lines[3]` 我记得这家公司什么都做，盘子也很大。
- `$manifest.nightShell.interludes[0].lines[5]` 那今天这二十万呢？
- `$manifest.nightShell.interludes[0].lines[7]` 行，我收回。
- `$manifest.nightShell.interludes[0].lines[9]` 真那样的话，我们俩大概一开始就看不上对方。
- `$manifest.nightShell.interludes[1].lines[1]` 你真想剪就正常约。别为了六折，顺便认个自己人。
- `$manifest.nightShell.interludes[2].lines[1]` 我只看见持有页，三十万，写着九月底到期。合同没上屏。
- `$manifest.nightShell.interludes[2].lines[3]` 她家已经把九月底的钱算进婚礼了。希望到时候真能回来吧。
- `$manifest.nightShell.interludes[2].lines[5]` 会。饭还是吃完了，钱也得我自己说。
- `$manifest.nightShell.interludes[3].lines[1]` 我洗。你站旁边监督。

## 老方

- **固定性格：** 急躁的结果主义者
- **受压反应：** 数据越差，句子越像截止日期和命令。
- **防御动作：** 把关心包装成指标，把认可包装成下一项要求。
- **知识边界：** 只知道节目运营、后台曲线和公开播出内容，不知道案件麦外真相。

### 其他出声面

- `$manifest.nightShell.prologue.lines[1]` 深夜档这个月再不达标，就并进娱乐区。改版方案，下周一前给我。
- `$manifest.nightShell.interludes[1].lines[0]` 他店里那个六折，我现在去还算数吗？
- `$manifest.nightShell.interludes[1].lines[2]` 那算了。别把我加群里。

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
- `$manifest.nightShell.interludes[0].lines[8]` 那我问个不用证据的。我要是也这么爱面子、花钱没数，你会不会什么都给我买？
- `$manifest.nightShell.interludes[2].lines[0]` 你刚才说的那笔宸直，女方家买的是哪一款？
- `$manifest.nightShell.interludes[2].lines[2]` 那现在只能说没到期，不能说拿不回来。宸直老板确实挺能折腾，商场、地产、理财，什么都做。摊子看着大，里面不少钱都是融来的。
- `$manifest.nightShell.interludes[2].lines[4]` 先别替人家发愁。你第一次去我家的时候，我爸妈要是先问你能拿多少，你还会来吗？
- `$manifest.nightShell.interludes[3].lines[0]` 今晚这些杯子，谁洗？
- `$manifest.nightShell.interludes[3].lines[2]` 不监督。我在门口等你。

# 账单里的八万

## 林旭阳

- **固定性格：** 温热而克制
- **受压反应：** 担心误判时先缩短句子，把混在一起的事实拆开。
- **防御动作：** 把感情和判决分开，用小而合法的试探代替情绪宣判。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 夜 A

- `$case.openingDialogue[1]` 八万不是随手帮个忙，换我也得先把手缩回来。先别怪自己多想。
- `$case.openingDialogue[2]` 你们在一起多久了，他当时是怎么开口的？
- `$case.sceneVersions[0].beforeVersion.lines[0]` “先垫着”我听见了。他有没有说最晚哪天还你？
- `$case.sceneVersions[0].afterVersion.lines[0]` “钱下来”是哪笔钱、哪天下来，他都没说。你后来为什么没转？
- `$case.sceneVersions[1].beforeVersion.lines[0]` 工资记录没发，社保早就停了。你后来把完整账单要来了吗？
- `$case.sceneVersions[2].beforeVersion.lines[0]` 账单里有一笔餐厅消费特别高，挺舍得花。是纪念日那晚吗？
- `$case.sceneVersions[2].afterVersion.lines[0]` 先等等。靠窗位提前两周也未必订得到。你们俩是不是有人是那里的老会员？
- `$case.sceneVersions[2].sceneCloser.lines[0]` 纪念日这顿先放这儿。你刚才还提到一万二的分期。
- `$case.sceneVersions[3].sceneCloser.lines[1]` 不着急，喝口水。账单还有几页，又不会趁这会儿跑。
- `$case.nightStructure.hangup.hostLine` 行，流水我先看。你不知道的别替他补。明晚回来，把他怎么答的原话带上。
- `$case.sceneVersions[0].casualQuestions[0].question` 你们平时谁管钱多一点？
- `$case.sceneVersions[0].casualQuestions[1].question` 他丢工作前，加班是什么样子？
- `$case.sceneVersions[0].questionOptions[0].question` 四月以后他还天天讲加班。借钱以前，他提过工作出了问题吗？
- `$case.sceneVersions[0].questionOptions[1].question` 他为什么拿社保记录代替工资记录？
- `$case.sceneVersions[0].dialogueOptions[0].question` 他当时只说差多少钱吗？
- `$case.sceneVersions[0].dialogueOptions[1].question` 你当时为什么没接着问工作？
- `$case.sceneVersions[1].casualQuestions[0].question` 那些餐厅是什么档次？
- `$case.sceneVersions[1].casualQuestions[1].question` 礼物都送了些什么？
- `$case.sceneVersions[1].casualQuestions[2].question` 看到“短视频平台分期”这几个字时，你先注意到什么？
- `$case.sceneVersions[1].casualQuestions[3].question` 他开口的时候，要你垫的就是整整八万吗？
- `$case.sceneVersions[1].questionOptions[0].question` 后面那一万五男装，是给谁买的？
- `$case.sceneVersions[1].questionOptions[1].question` 你看到这些消费时，第一反应是什么？
- `$case.sceneVersions[1].dialogueOptions[0].question` 你第一眼先看到哪一栏？
- `$case.sceneVersions[1].dialogueOptions[1].question` 那几页账单是完整的吗？
- `$case.sceneVersions[2].casualQuestions[0].question` 你自己一个人去过那家店吗？
- `$case.sceneVersions[2].casualQuestions[1].question` 他没发朋友圈，你当时问过他吗？
- `$case.sceneVersions[2].casualQuestions[2].question` 那晚的照片删了吗？
- `$case.sceneVersions[2].questionOptions[0].question` 刚才还是他说提前两周订的，现在又成了你订的。那时候只靠自己的收入，你会来这家吃吗？
- `$case.sceneVersions[2].questionOptions[1].question` 那晚他说过手头紧吗？
- `$case.sceneVersions[2].questionOptions[2].question` 朋友羡慕你时，你有没有说过那个位置其实是你订的？
- `$case.sceneVersions[3].entryQuestion` 那一万二买了什么？
- `$case.sceneVersions[3].casualQuestions[0].question` 你以前真想过做探店号？
- `$case.sceneVersions[3].casualQuestions[1].question` 那句“投资你”，你当时怎么听？
- `$case.sceneVersions[3].questionOptions[0].question` 那套灯和稳定器，买完以后送到谁那里了？
- `$case.sceneVersions[3].questionOptions[1].question` 他把这笔分期叫“投资”。你当时有没有觉得，自己也该担一点？
- `$case.sceneVersions[3].questionOptions[2].question` 你前面提过，分期是从他手机上开的。你为什么一直抓着这一点说？
- `$case.sceneVersions[4].entryQuestion` 这些消费，你自己重新加过一遍吗？
- `$case.sceneVersions[4].casualQuestions[0].question` 他以前跟你开过口借钱吗？
- `$case.sceneVersions[4].questionOptions[0].question` 你加完还差至少三万五，这个数对不上。你当时怎么问他的？
- `$case.sceneVersions[4].questionOptions[1].question` 这些账单上的日子，你们当时在一起吗？
- `$case.sceneVersions[4].dialogueOptions[0].question` 你当时已经准备转了吗？
- `$case.sceneVersions[4].dialogueOptions[1].question` 他后来为什么又改口？

### 白天

- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[0]` 今天第三拨？行，我不跟着查号码。她说那晚是她订的，这句话能确认吗？
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[2]` 明白，我回去问她本人。餐厅这边不打听了。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[0]` 刚才那句「今天第三拨」，都在问同一排位子？

### 夜 B

- `$case.sceneVersions[5].beforeVersion.lines[0]` 昨晚那笔一万二，设备在你家，也一直是你在用。可你没说开箱那晚。那天你们做了什么？
- `$case.sceneVersions[6].beforeVersion.lines[3]` 抱抱来得挺是时候。先看他后面还说什么。
- `$case.sceneVersions[6].afterVersion.lines[0]` “怕你离开”后面紧跟最低还款金额。他把两件事绑在一起了。你听完先想到什么？
- `$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.lines[0]` 六月 8 号那笔没来，八万就开口了。你昨晚——
- `$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.lines[2]` ……对，七月，我念岔了。你昨晚为什么只说『奖金晚发』？
- `$case.overnightStructure.callbackOpeners.餐厅拒绝核对.firstConflict.hostLine` 你昨晚说“他两周前订的”。现在订座短信在你手机里，这句话怎么回事？
- `$case.overnightStructure.callbackOpeners.常客的轮订规律.firstConflict.hostLine` 他只说提前订了，还是亲口说过‘只为你’？
- `$case.overnightStructure.callbackOpeners.旁听记下的两句.firstConflict.hostLine` 他没说账单里那三万五，你怎么先说起那盏灯了？
- `$case.overnightStructure.callbackOpeners.他对三万五的沉默.firstConflict.hostLine` 这句现在敢当着他再说一遍吗？
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[0]` 这二十万，他以前跟你提过吗？
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[2]` 后面两笔宸直信托呢？
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[4]` 宸直这个名字，他以前说过吗？
- `$case.overnightStructure.callbackOpeners.顾问的回话.firstConflict.hostLine` 纸上只写了钱什么时候进、什么时候出。你最想先问哪一笔？
- `$case.overnightStructure.callbackOpeners.赵律师的回话.firstConflict.hostLine` 没有备注，没有还款约定。你当时凭什么准备转？
- `$case.overnightStructure.callbackOpeners.周会计排的日子.firstConflict.hostLine` 七月 8 号这笔没来。你最想问他什么？
- `$case.overnightStructure.callbackOpeners.闺蜜删掉的那条评论.firstConflict.hostLine` 她起哄，你发圈，这些都过去了。八万是现在的事，分开算。
- `$case.sceneVersions[5].casualQuestions[0].question` 探店号你做起来了吗？
- `$case.sceneVersions[5].casualQuestions[1].question` 那套设备现在还用吗？
- `$case.sceneVersions[5].questionOptions[0].question` 设备进了你家，这个你昨晚说了。一起拍到凌晨，为什么没告诉我们？
- `$case.sceneVersions[5].questionOptions[1].question` 设备进你家，一万二就该算你的债吗？
- `$case.sceneVersions[5].dialogueOptions[0].question` 他说投资你的时候，你怎么回的？
- `$case.sceneVersions[6].entryQuestion` 接着呢？
- `$case.sceneVersions[6].casualQuestions[0].question` 你朋友现在知道多少？
- `$case.sceneVersions[6].casualQuestions[1].question` 他以前有没有说过，怕失业以后配不上你？
- `$case.sceneVersions[6].casualQuestions[2].question` “怕你离开”那句，他是打字还是语音？
- `$case.sceneVersions[6].casualQuestions[3].question` 你发朋友圈的那些朋友，后来有人来问过吗？
- `$case.sceneVersions[6].casualQuestions[4].question` 那条语音你还留着？
- `$case.sceneVersions[6].questionOptions[0].question` 账单还有三天才到期，你听完却把转账页点开了。为什么还想转？
- `$case.sceneVersions[6].questionOptions[1].question` 你一直说要先看账单。你最怕这八万最后落到谁头上？
- `$case.overnightStructure.callerQuestion.options[0].label` 别垫。至少今晚别转。
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[0].label` 我不是这个意思。你先喝口水。
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[1].label` 我是主播，不是你男朋友。这句我照直说。
- `$case.overnightStructure.callerQuestion.options[1].label` 八万先不谈。他先把那三万五说清楚。
- `$case.overnightStructure.callerQuestion.options[2].label` 今晚别转。先让他把三月借的二十万说全。

### 终局

- `$case.hostDisclosure.text` “先帮我挡几天”，这话我听过。以前也有人这么跟我借钱，那笔后来没要回来。你刚才一重复，我手心还是会冒汗。
- `$case.deepFollowup.question` 先不问该不该垫。信用卡这八万里，哪些钱你愿意跟他坐下来谈？
- `$case.stageJudgement` 他把直播截图发给你以后，你的手还停在转账页上。你怕一拒绝，就像承认自己会离开他。可这八万先别转。你收过的礼物和设备，可以跟他谈；他自己的消费和没说明的钱，不能先放到你头上。他拿借款买信托，是他自己的决定。合同和回单让他自己拿出来。七月那笔钱转给谁，我们现在也不知道。

### 其他出声面

- `$case.careChoices[0].hostLine` 回去先把转账页关了。饭吃了吗？没吃煮个面。
- `$case.careChoices[1].hostLine` 今晚先别把八万全算到自己头上。你收过东西，这一块可以谈；没答应替他还债，是另一回事。
- `$case.careChoices[2].hostLine` 不急着决定。热线明晚还开，我们都在。
- `$case.overnightStructure.returnBeat.lines[0]` 昨晚那三万五还没说清。
- `$case.overnightStructure.returnBeat.lines[2]` 清楚。

## 案一咨询者·沈

- **固定性格：** 敏感的体面维护者
- **受压反应：** 越紧张句子越长，堆很多场面细节；一说到分期就突然变短。
- **防御动作：** 用被动句隐藏主动选择，把男友先说成安排者。
- **知识边界：** 知道共同生活、自己见过的流水和对方说法，不知道尾号 3301 的主人。

### 夜 A

- `$case.openingDialogue[0]` 主播，我男朋友以前连打车钱都不让我出，这两天却突然让我替他还八万块信用卡。我没敢转，是不是我太防着他了？
- `$case.openingDialogue[3]` 半年多。他说最近奖金晚发，信用卡得周转一下，让我先替他垫着。可他开口就是八万。
- `$case.sceneVersions[0].afterVersion.lines[1]` 八万太多，我让他把这期账单和最近的工资记录发来。工资记录没发，他只发来一张从电子社保卡导出的缴费记录，说公司这两个月只是漏缴。我把月份往前翻，最后一笔停在四月。可四月以后，他每天还在跟我说加班。
- `$case.sceneVersions[0].afterVersion.lines[2]` ……你等我一下，我把窗关了。楼下大排档还没散，吵。
- `$case.sceneVersions[1].casualQuestions[3].lines[0]` 嗯。
- `$case.sceneVersions[1].casualQuestions[3].lines[2]` 一分没少。
- `$case.sceneVersions[2].afterVersion.lines[1]` ……是我。我没跟他在一起的时候就办了会员。那晚也是我用自己的号订的。刚才说他提前两周才订到，是我说顺嘴了。
- `$case.sceneVersions[2].casualQuestions[2].lines[0]` 没删。
- `$case.sceneVersions[2].casualQuestions[2].lines[2]` 舍不得。里面那盏灯拍得挺好看的。
- `$case.sceneVersions[3].sceneCloser.lines[0]` ……不好意思，咳两声。换季。
- `$case.nightStructure.hangup` 我知道。流水已经发到后台了。那三万五不是我不说，是他不说。我今晚再问他一遍。明晚这个时间，我回来告诉你他怎么答。
- `$case.sceneVersions[0].version` 没说具体哪天。他只说：“你先帮我挡几天，钱下来就还你。”我问是哪笔钱，他才说奖金。我当时就信了，以为真是临时周转。
- `$case.sceneVersions[0].casualQuestions[0].answer` 各花各的。约会基本他出，我偶尔抢着买单，他不让，说“跟我你还客气什么”。
- `$case.sceneVersions[0].casualQuestions[1].answer` 天天说忙。可几点下班、跟谁吃饭，我都不知道。我们没住一起，他说加班，我就回“早点睡”。
- `$case.sceneVersions[0].questionOptions[0].answer` 没有。他每天说的都是忙、加班、项目要上线，还说服务器凌晨得有人盯着。有一回我说给他送点吃的，他让我别去，说公司门禁严。现在回头看，那时候他可能已经不去公司了。可工作出了问题，他一个字都没跟我提。
- `$case.sceneVersions[0].questionOptions[0].guardedAnswer` 他说忙，我就信了。我们没住一起，我也不想天天问他在哪。
- `$case.sceneVersions[0].questionOptions[1].answer` 他说工资明细太私密，社保足够证明公司还在给他办手续，停两个月只是漏缴。可那张记录里没写他还在职，也没写奖金什么时候发。
- `$case.sceneVersions[0].dialogueOptions[0].answer` 一开始没有。他就说先帮他挡一下，别让卡逾期。我追问，他才把最低还款那一栏截给我看。
- `$case.sceneVersions[0].dialogueOptions[1].answer` 我怕问重了像查岗。那会儿我还把他当男朋友，不是当一个要对账的人。
- `$case.sceneVersions[1].version` 要了。他一开始只发了最低还款那一栏，我说想看明细，他才把完整账单补给我。我先看见右上角那个数，七万九……不对，八万零几百，反正是八万出头。往下是餐厅、礼物和两次酒店，再下一行是一万二的短视频平台分期。后面还有几笔男装，加起来一万五左右，都是他平时会买的牌子。我在那儿停了几秒，还是划走了。分期是从他手机上开的，我就拿这句话挡着自己，没再细看。
- `$case.sceneVersions[1].revisedVersion` ……这张账我重说。八万出头。餐厅、礼物、酒店，社保停了以后照刷。有几家店，是我挑的。那笔一万二，我当时看见了。后面一万五左右的男装，是他自己的。我没敢往下算。
- `$case.sceneVersions[1].casualQuestions[0].answer` 人均四五百。有两家是我收藏过的，他记住了。纪念日那家靠窗，他说提前两周才订到。
- `$case.sceneVersions[1].casualQuestions[1].answer` 香水，还有一条项链。项链那次他自己发朋友圈，写“她值得”。我朋友全点赞，我还截图留着。
- `$case.sceneVersions[1].casualQuestions[2].answer` 先盯着“从他手机上开的”。我那时就想，反正不是我签的。东西最后送到哪儿，我故意没往下想。
- `$case.sceneVersions[1].questionOptions[0].answer` 他自己。都是他平时会穿的牌子，我没陪他买，也没收过。看到那几笔时我才觉得不对，工作都没了，衣服怎么还照买。
- `$case.sceneVersions[1].questionOptions[0].guardedAnswer` 他自己买的。那几个牌子我认识，我没收过。
- `$case.sceneVersions[1].questionOptions[1].answer` 我第一反应是，他是不是一直在硬撑。可那时候我只觉得他肯花心思。账单到我手里，才发现我坐过的那些店，一笔没少。
- `$case.sceneVersions[1].dialogueOptions[0].answer` 先看到最低还款。八千多，我手都停了一下。再往下翻，才看到那些消费明细。
- `$case.sceneVersions[1].dialogueOptions[1].answer` 他一开始没发完整的。我说要看明细，他才补。补出来以后，我就有点不想看了。
- `$case.sceneVersions[2].version` 对。那晚坐的是靠窗位，他说两周前订的。主要贵在酒。他看中一瓶，我说太贵了。他说：“都纪念日了，总不能太寒酸。”他还是点了，我没再拦。当天只有我发朋友圈，他没发，身边朋友都挺羡慕我的。
- `$case.sceneVersions[2].casualQuestions[0].answer` 没有。不是约会就是朋友聚餐，我自己不会订靠窗那排。
- `$case.sceneVersions[2].casualQuestions[1].answer` 问过。他说自己不爱发这些，叫我发就好。我那时候没多想。
- `$case.sceneVersions[2].questionOptions[0].answer` 我自己不会这么吃。认识他以前，我跟前任也来过几次，基本都是对方结账。会员等级也是那时候慢慢攒起来的。我当时觉得，约会不都这样吗。
- `$case.sceneVersions[2].questionOptions[0].guardedAnswer` 我自己不会常来。以前有人请，会员等级是慢慢攒起来的。
- `$case.sceneVersions[2].questionOptions[1].answer` 没有。他还说这顿算他的，叫我别看价格。我当时觉得被宠，现在看账单，才知道那句话也刷在卡上。
- `$case.sceneVersions[2].questionOptions[2].answer` 没有。她们都说我没看错人，我听着挺高兴，就没解释。
- `$case.sceneVersions[3].version` 那一万二买的是拍视频用的灯和稳定器。他当时跟我说：“账号做起来，你就不用看别人脸色。”还说这是在投资我。我以前念叨过想做探店号，听到这句，确实挺高兴。我一直以为那是他全款买来送我的。这两天翻账单我才知道，分期是从他手机上开的。
- `$case.sceneVersions[3].casualQuestions[0].answer` 想过，断断续续念了几个月。我关注了好些博主，有个杭州的姑娘，拍面馆的，就一个手机加个小支架，拍得特别香，她粉丝可多了。我还研究过转场，就那种一挥手换一家店的……哎，说这个干嘛。反正，真要拍我又总说没设备。现在设备倒是有了。
- `$case.sceneVersions[3].casualQuestions[1].answer` 很甜，也很有面子。像他认真把我的事当事。
- `$case.sceneVersions[3].questionOptions[0].answer` 送到我这儿了，东西也一直是我在用。可他当时说的是支持我做探店号，我真以为那是他全款买来送我的。分期不是我签的，我也没答应过要替他还。
- `$case.sceneVersions[3].questionOptions[0].guardedAnswer` 送到我这儿了，也一直是我在用。可我当时以为是他买来送我的，根本不知道走的是分期。
- `$case.sceneVersions[3].questionOptions[1].answer` 没有。我当时听见的是他要支持我做账号。东西送到我这儿以后，我也一直在用，可我真以为是他全款买来送我的，没想过还款会落到我头上。
- `$case.sceneVersions[3].questionOptions[2].answer` 因为我当时根本不知道是分期。我一直抓着这点，是因为这笔不是我们商量着办的。他说买套设备支持我做账号，东西送到我这儿，我就用了。
- `$case.sceneVersions[4].version` 我昨晚拿计算器按了好几遍。餐厅、酒店、礼物和那套设备，这些我都认；他买衣服的钱是他自己的。这些加起来，离八万还差至少三万五。账单还有三天才到期，可他先说“今晚就要”，过了一会儿又改成“这几天都行”。我就是从那儿不敢转了。
- `$case.sceneVersions[4].casualQuestions[0].answer` 没有。一次都没有，所以这次我才慌。他那个人，以前连打车钱都不让我掏。
- `$case.sceneVersions[4].questionOptions[0].answer` 问过一次。他当时愣了一下，说“反正不是乱来的钱”。然后我再问，他就把话岔到“别拖，今晚先转”上去了。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 问过，他没细说。只说不是我该管的那部分。
- `$case.sceneVersions[4].questionOptions[1].answer` 近几个月能对上。再往前……我把页面关了。一个人没敢看完。
- `$case.sceneVersions[4].dialogueOptions[0].answer` 差一点。页面都打开了。就是看到到期日那里，我才停住。
- `$case.sceneVersions[4].dialogueOptions[1].answer` 他说我别紧张，这几天转也行。可前面那句“今晚就要”已经把我吓到了。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[0]` 八万里，跟我们俩有关的不到三万。你自己的男装一万五左右。剩下那三万五，你到底干什么用了？
- `$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[0]` 那订座呢？会员号是我的。你开口第一句还说都是你安排的。
- `$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[2]` 真心买灯，和叫我垫八万，哪一句算数。

### 夜 B

- `$case.sceneVersions[5].beforeVersion.lines[1]` 你等一下，我把灯拖过来。
- `$case.sceneVersions[5].questionOptions[0].resistanceBeat.lines[0]` 主播，你问这个，是不是觉得我用了这套设备，这笔分期就该算在我头上？
- `$case.sceneVersions[6].beforeVersion.lines[0]` 等下……他又发消息了。一个『抱抱』表情包，企鹅那个。
- `$case.sceneVersions[6].beforeVersion.lines[2]` 他知道这是直播。他知道你们都看着。
- `$case.sceneVersions[6].beforeVersion.lines[4]` 有。十二点四十，又来了一条。
- `$case.sceneVersions[6].beforeVersion.lines[6]` ……跟着又来一句：『账单 26 号出』。前面还是『抱抱』，后面就变成还款日了。
- `$case.sceneVersions[6].afterVersion.lines[1]` 我第一反应是：“以后他可能就不敢跟我谈结婚了。”……可这句是我自己想出来的，他没说。我也怕别人觉得我找了个撑不住场面的人。然后我就把转账页点开了。
- `$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.callerLine` ……说成断了，话就重了。
- `$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.lines[1]` 七月。六月是有的。
- `$case.overnightStructure.callbackOpeners.餐厅拒绝核对.firstConflict.callerLine` 那句是我说顺嘴了。座是我订的，酒是他点的，朋友圈也是我发的。我当时确实想让别人羡慕。
- `$case.overnightStructure.callbackOpeners.常客的轮订规律.firstConflict.callerLine` 他说‘这位子难订’。后面那句，是我听出来的。
- `$case.overnightStructure.callbackOpeners.旁听记下的两句.firstConflict.callerLine` 舍不得承认那些好也全是假的。可这跟替他还八万不是一回事。
- `$case.overnightStructure.callbackOpeners.他对三万五的沉默.firstConflict.callerLine` 敢。先让他把三万五说清，再谈八万。我不垫。
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[1]` 没有。他只说自己在看一个投资机会，没说钱是借来的。
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[3]` 我也是昨天才看到。十二号十万，十四号又十万。
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[5]` 说过。他嫌十来个点太慢，说真想翻身就得找能翻倍的。我以为他只是嘴上说说。
- `$case.overnightStructure.callbackOpeners.顾问的回话.firstConflict.callerLine` 那八万。……可里面也有我用过的东西。先问他没说清的三万五。
- `$case.overnightStructure.callbackOpeners.赵律师的回话.firstConflict.callerLine` 凭他说怕我走。现在听着挺丢人的。
- `$case.overnightStructure.callbackOpeners.周会计排的日子.firstConflict.callerLine` 为什么停。五月六月都有，到了七月突然没了，我只想先把这个问清楚。
- `$case.overnightStructure.callbackOpeners.闺蜜删掉的那条评论.firstConflict.callerLine` 他在拿。我昨晚也差点拿它替自己装无辜。八万不抵。
- `$case.overnightStructure.callerQuestion.options[0].lines[0]` ……你和我闺蜜说得一样。你们都不用陪他过日子。
- `$case.overnightStructure.callerQuestion.options[0].lines[2]` 你凭什么说得这么轻巧？你是不是也觉得，我这种人就活该碰上这种事？
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[0].lines[0]` ……水在手边放凉一晚上了。
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[0].lines[2]` 你接着说吧。
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[1].lines[0]` ……行。你们做节目的，嘴都硬。
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[1].lines[2]` 硬点好。你继续。
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[2].lines[1]` ……对不起。我不该冲你来。你接着问。
- `$case.overnightStructure.callerQuestion.options[1].callerLine` 好。我不先答应，也不先拒绝。我先让他把那三万五说清楚。
- `$case.overnightStructure.callerQuestion.options[2].callerLine` 好。我先不转。三月那二十万，我现在就让他讲清楚。
- `$case.sceneVersions[5].version` 听见了吗？灯架和稳定器一直在我屋里，现在就停在麦克风旁边。箱子也是在这间屋拆的。那天我架灯，他蹲在地上调稳定器，我们把第一条探店视频拍到凌晨一点。他还说：“我来投资你。”我当时很高兴，第二天就发了开箱。昨晚我说了东西是我在用。开箱那晚这段，我没说。
- `$case.sceneVersions[5].casualQuestions[0].answer` 发了十几条。最高一条八百多赞。他每条都转。
- `$case.sceneVersions[5].casualQuestions[1].answer` 灯上个月还开过。现在拍不动了，一开灯就想起这事。
- `$case.sceneVersions[5].questionOptions[0].answer` ……我怕一说拍到凌晨，你们就会觉得分期是我们俩一起商量的。可我真没跟他商量过。他说买来送我，我就当礼物收了。视频是一起拍的，这个我认。分期怎么开的，我当时确实不知道。
- `$case.sceneVersions[5].questionOptions[0].guardedAnswer` 昨晚没说开箱那晚。我们一起拍过，但分期真不是我提的。
- `$case.sceneVersions[5].questionOptions[1].answer` 我没签，也没答应还，所以不能说设备在我家，分期就成了我的。可东西我确实收了，也用了，这一点我不躲。
- `$case.sceneVersions[5].dialogueOptions[0].answer` 我没拦。还挺高兴的。那时候我真以为他是买来送我的。
- `$case.sceneVersions[6].version` 现在又来了一条语音。他说：“我只是怕你知道我失业后就离开我。”语音放完，下一条就是最低还款金额，整整齐齐一行数字。
- `$case.sceneVersions[6].casualQuestions[0].answer` 知道我们在闹别扭，不知道钱的事。我还没想好怎么开口。
- `$case.sceneVersions[6].casualQuestions[1].answer` 说过一次，喝了酒。他说自己要是混不好，就低我一头。那时候我当情话听的。
- `$case.sceneVersions[6].casualQuestions[2].answer` 语音。声音很低，我听了三遍。……然后金额是打字发的，很整齐。
- `$case.sceneVersions[6].casualQuestions[3].answer` 我闺蜜来问了。她劝我想开点，说至少没领证，她表姐那种才叫惨。……我听完更想哭了。但她是好意，我知道她是好意。
- `$case.sceneVersions[6].casualQuestions[4].answer` 留着。
- `$case.sceneVersions[6].questionOptions[0].answer` 因为那句“怕你离开”。我一拒绝，就像在证明他说对了。我知道还没到期，可手还是停在金额框里。
- `$case.sceneVersions[6].questionOptions[0].guardedAnswer` 账单还没到期，我知道。可那句“怕你离开”，我现在听不了第二遍。
- `$case.sceneVersions[6].questionOptions[1].answer` 我。怕它最后成了我的债。这句我一直说不出口。一拒绝，像我嫌他穷；前面又把他夸得那么好，现在改口，我自己也挂不住。于是我拖，反复说先看账单。
- `$case.overnightStructure.callbackOpeners.周会计的时间线.line` 周会计那张时间线，我看了好几遍。五月 8 号、六月 8 号都有一万，翻到七月 8 号，空的。
- `$case.overnightStructure.callbackOpeners.餐厅拒绝核对.line` 你下午是不是去过餐厅？算了，别让店员为难。我自己说：订座短信在我手机里，号……是我的。昨晚我把这几个字吞了。
- `$case.overnightStructure.callbackOpeners.常客的轮订规律.line` 靠窗那排，常客也会轮着订。提前两周是真的。‘只为我’这三个字……是我自己往里加的。
- `$case.overnightStructure.callbackOpeners.旁听记下的两句.line` 他在隔壁说，号是我的，灯是真心买的。听见‘真心’那两个字，我还是……算了，账单里那三万五他没说。
- `$case.overnightStructure.callbackOpeners.他对三万五的沉默.line` 隔壁那通话绕了半天，账单里那三万五还是没说清。我不拿灯挡了。他不说，我就不转。
- `$case.overnightStructure.callbackOpeners.流水圈注.line` 我把流水从头翻了一遍。三月十一号，澄川金融打进来二十万，备注写的是借款。
- `$case.overnightStructure.callbackOpeners.顾问的回话.line` 顾问只让我看日子，没有替我说他骗了我。我原来还盼着，拿到一张纸，事情就能简单一点。
- `$case.overnightStructure.callbackOpeners.赵律师的回话.line` 赵律师不肯给那笔钱起名字。借的、送的，她说都得有东西落下来。我手里没有。
- `$case.overnightStructure.callbackOpeners.周会计排的日子.line` 周会计让我别看摘要，只看日子。我翻到七月，8 号那天是空的。前两个月，王姓的人都在这天转来一万。
- `$case.overnightStructure.callbackOpeners.闺蜜删掉的那条评论.line` 闺蜜把删掉的评论发回来了。我看着那句‘这才像被认真对待’，脸有点烫。那场面，我也撑过。
- `$case.overnightStructure.callbackFallback.line` 我想了一晚上，还是得把话说完——你接着问吧。
- `$case.overnightStructure.postures.againstCaller` 我差点不打回来。刚才弹幕……我都听到了。你要是也觉得是我贪体面，这通我讲不下去。
- `$case.overnightStructure.postures.withCaller` 我回来了。八万的事，你继续问。我把白天重新看过的流水也带来了。
- `$case.nightStructure.returnStance.lines.defensive` 我差点不打回来。弹幕说我贪体面……我认过探店，可八万我不替他还。
- `$case.nightStructure.returnStance.lines.open` 我回来了。那三万五我又问了一遍。他怎么答的，我原话告诉你。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。隔了一天，那三万五他还是没说清。
- `$case.overnightStructure.callerQuestion.prompt` 主播，你说……我该不该垫？

### 终局

- `$case.deepFollowup.answer` 那套设备的分期，我愿意跟他谈。饭是我们两个人吃的，酒店也是。礼物……东西还在我这儿，我不能说跟我没关系。可他的衣服，还有那三万五，不该让我先垫。

### 其他出声面

- `$case.careChoices[0].lines[0]` ……嗯。我现在就关。
- `$case.careChoices[0].lines[2]` 面就算了，我现在吃不下。
- `$case.careChoices[1].lines[0]` ……这句我存下了。语音的那种存。
- `$case.careChoices[2].lines[0]` 明晚……明晚我大概不打了。但我会听。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 等等——他刚发我消息。
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 一张截图。是这个直播间，你们现在的画面。他在听。
- `$case.overnightStructure.liveCounterBeats[0].choices[0].lines[0]` 继续。我本来就是来问这笔账的，不能他一听见，我就不敢说了。
- `$case.overnightStructure.liveCounterBeats[0].choices[1].lines[1]` 继续吧。我不回他，先把这笔账说完。
- `$case.overnightStructure.liveCounterBeats[0].choices[2].lines[0]` 要。后面他再发什么，我只念我愿意念的。
- `$case.overnightStructure.returnBeat.lines[1]` 今晚信号好像不太好，我换了个房间。你那边听得清吧？

## 案一男友

- **固定性格：** 羞耻驱动的防御者
- **受压反应：** 被问金额时把问题改写成信任和离开。
- **防御动作：** 用关系词替代交易词，用临时周转替代去向。
- **知识边界：** 知道自己的失业、贷款、转账与请求；对他人账户身份只说自己能证明的部分。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[1]` 不是乱来的钱。细节我不在这儿讲。
- `$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[1]` ……号是你的。灯是我真心买的。这两句我认。
- `$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[3]` 你要是只为了在直播间赢，我们没必要坐这儿。

### 后台／材料回流

- `$case.respondentNote.text` 三月那二十万是我从澄川借的，拿去买了宸直的产品。销售说做得好能翻倍，我信了。这事跟她没关系。剩下三万五别在节目里问，我不会讲。

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

## 案一服务员

- **固定性格：** 职业性谨慎
- **受压反应：** 追问熟客时用礼貌套话封口。
- **防御动作：** 只说自己能确认的服务动作。
- **知识边界：** 只知道店内自己经手的座位与服务，不知道客人私下关系。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 靠窗那排？最少提前两周。……您也是听了直播来的？今天第三拨了。
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[1]` 这个也不能。您拿直播里一句话来对，我们不能替客人作证。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[2]` 提前订，这个我能说。谁为了谁，不归我们店里答。

## 案一熟客

- **固定性格：** 直率的不耐烦者
- **受压反应：** 越解释越打断，直接说自己见过什么。
- **防御动作：** 用现场经验划线。
- **知识边界：** 只知道自己在店里见过的座位、灯和熟客行为。

### 白天

- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[1]` 那排我上个月也订过。熟客轮着用，位置难订是真的，专门给哪一对就说不准。

## 赵律师

- **固定性格：** 锋利的理性派
- **受压反应：** 听见无证据定性会立刻打断，并补适用条件。
- **防御动作：** 短句、免责、拒猜动机。
- **知识边界：** 只解释法律与责任效果，不替案件当事人作证，不指点玩家圈哪一栏。

### 收麦幕间

- `$case.nightStructure.interlude.actions[1].options[0].advisorLine` 先找落纸的。没备注、没聊天、没还款约定，我不给这笔钱起名字。

### 后台／材料回流

- `$case.delegation.outcomes.zhao-lawyer.text` 每月 8 号固定进账，七月停了。先把这条记住。备注、聊天、返还约定都没齐，我不替这笔钱叫借款，也不替它叫赠与。

## 周会计

- **固定性格：** 冷静的数字理性派
- **受压反应：** 删掉形容词，只报金额、时间和路径。
- **防御动作：** 按日期排列，拒绝替数字添故事。
- **知识边界：** 只读材料中已经出现的账目与流程，不认定未知付款人身份。

### 收麦幕间

- `$case.nightStructure.interlude.actions[1].options[1].advisorLine` 把摘要收起来。给我原件日期和到账顺序，名字我不猜。

### 后台／材料回流

- `$case.delegation.outcomes.zhou-accountant.text` 五月、六月都在 8 号进一万，七月停。我只能说这条规律断了，不能替这两笔私人入账找付款人。49,800 去了 3301，也只说明钱转出去了，不能说明用途。

## 小林老师

- **固定性格：** 热络的感性现实派
- **受压反应：** 先替行业解释一句，再把行话翻成人话。
- **防御动作：** 笑着纠偏，拆一次话术就补一次行业辩护。
- **知识边界：** 只解释婚恋行业话术和流程，不知道本案人物私下做过什么。

### 后台／材料回流

- `$case.delegation.outcomes.lin-matchmaker.text` 账单我看不出门道。只说关系话术：一个人长期替另一个人补钱，外人很容易听成关系还没断。这只能算一种猜法，不能拿来认付款人。

## 张法医

- **固定性格：** 技术洁癖型理性派
- **受压反应：** 碰到来源不全的材料会停止讨论结论。
- **防御动作：** 先查链条，再谈内容。
- **知识边界：** 只判断证据链与技术可检验性，不认定关系或动机。

### 后台／材料回流

- `$case.delegation.outcomes.zhang-forensic.text` 流水单不是我的领域。我只能看图片有没有明显拼接，不能替银行验真。这几页没看见明显改动；日期和金额，还是得拿原件或银行导出再对。……先挂了啊，外卖在敲门，再不接汤就洒楼道了。

## V哥

- **固定性格：** 沉着的直觉教练
- **受压反应：** 玩家越急，他越让人停一下，只比较两件已知事物。
- **防御动作：** 短句，先停，再分开看。
- **知识边界：** 只知道玩家当前已经听见或看见的内容。

### 夜 A

- `$case.sceneVersions[0].helperHint` 先把“奖金晚发”和“社保停了两个月”分开看：他开口借钱前，哪件事没说。
- `$case.sceneVersions[1].helperHint` 先别替这八万找理由。问她哪些钱她认，哪些连她也不知道花到哪儿了。
- `$case.sceneVersions[2].helperHint` 她承认是老会员以后，先别急着评价。看看长期消费和她当时的收入能不能对上。
- `$case.sceneVersions[3].helperHint` “投资”是称呼，不是证据。先看东西最后在哪、谁实际用过。
- `$case.sceneVersions[4].helperHint` 八万已经按餐厅、酒店、礼物、设备和男装分开算了。只看还有多少钱没说明用途，先别替他猜。

### 夜 B

- `$case.sceneVersions[5].helperHint` 把昨晚的“我以为是他送的”和今晚的开箱过程放在一起听。先别替任何一边算债。
- `$case.sceneVersions[6].helperHint` 两句话挨得很近：先说怕失去她，后面紧接着要她做什么？

# 理发店排班表

## 林旭阳

- **固定性格：** 温热而克制
- **受压反应：** 担心误判时先缩短句子，把混在一起的事实拆开。
- **防御动作：** 把感情和判决分开，用小而合法的试探代替情绪宣判。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 夜 A

- `$case.openingDialogue[1]` 一张店里的表把你折腾了一夜。那先说这张表。
- `$case.openingDialogue[2]` 谁发的？你们平时是什么关系？
- `$case.openingDialogue[4]` 你说后来不太像普通顾客，具体是从哪件事开始的？
- `$case.openingDialogue[6]` 他原本要发你什么？
- `$case.nightStructure.hangup.hostLine` 我听见敲门了。你先处理，确认安全以后给后台留句话。
- `$case.sceneVersions[0].entryQuestion` 你们平时到底怎么相处？
- `$case.sceneVersions[0].casualQuestions[0].question` 你在他们店剪了多久头发？
- `$case.sceneVersions[0].casualQuestions[1].question` 相亲那次是谁牵的线？
- `$case.sceneVersions[0].casualQuestions[2].question` 他多大？
- `$case.sceneVersions[0].questionOptions[0].question` 你们到底说没说过在一起？
- `$case.sceneVersions[0].questionOptions[1].question` 他每次说“也就你肯听”的时候，你通常怎么回？
- `$case.sceneVersions[1].entryQuestion` 他跟你诉苦以后，通常还会聊什么？
- `$case.sceneVersions[1].casualQuestions[0].question` 店长骂他，他都怎么跟你说？
- `$case.sceneVersions[1].casualQuestions[1].question` 帮他转活动，你朋友什么反应？
- `$case.sceneVersions[1].questionOptions[0].question` 这些诉苦和店里的请求，每次都挨得这么紧吗？
- `$case.sceneVersions[1].questionOptions[1].question` 你帮他转活动时，觉得自己是在帮谁？
- `$case.sceneVersions[2].entryQuestion` 办卡那天发生了什么？
- `$case.sceneVersions[2].casualQuestions[0].question` 那天之后，他再提年卡时，你还像当场那么排斥吗？
- `$case.sceneVersions[2].casualQuestions[1].question` 小妹喊嫂子，他什么反应？
- `$case.sceneVersions[2].questionOptions[0].question` 店长把“自己人”接到年卡上时，你当时怎么回的？
- `$case.sceneVersions[2].questionOptions[1].question` 小妹喊嫂子，你为什么不否认？
- `$case.sceneVersions[3].entryQuestion` 那张表里具体写了什么？
- `$case.sceneVersions[3].casualQuestions[0].question` 那张表你存下来了吗？
- `$case.sceneVersions[3].casualQuestions[1].question` 备注里“稳情绪”三个字，你第一眼什么感觉？
- `$case.sceneVersions[3].questionOptions[0].question` 这些备注里，哪一项跟剪头有关？
- `$case.sceneVersions[3].questionOptions[1].question` 看到自己那行“稳情绪”，你先想了什么？

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[1]` 你先帮我看看，正常的会员表一般会记到哪儿？
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[1]` 行。我把两张表的不同拍下来。Tony 那几列是谁加的，回去问他。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[1]` 明白。她拿过什么，让她自己说；那张表也照样问。
- `$case.overnightStructure.dayScenes[2].body.beats[1]` 我只问一件：Tony 私下那张表，你见过完整原表吗？

### 夜 B

- `$case.sceneVersions[4].sceneCloser.lines[0]` 好，来人是民警。那他们为什么会拿着你的手机号找上门？
- `$case.sceneVersions[4].sceneCloser.lines[2]` 你第一夜只说上班时间特殊。你到底做什么工作？
- `$case.sceneVersions[4].sceneCloser.lines[4]` Tony 知道你做什么工作吗？
- `$case.sceneVersions[4].sceneCloser.lines[6]` 合作介绍说你能替新店联系客人。他以前问过你手里有哪些客人吗？
- `$case.sceneVersions[4].sceneCloser.lines[8]` 联络人的事，你把自己的意思说完整。
- `$case.sceneVersions[5].beforeVersion.lines[5]` 他还说别的没有？
- `$case.sceneVersions[6].questionOptions[0].resistanceBeat.lines[1]` 对。但我问的是，他有没有明确拿折扣换你带客。没说过，就不能这么算。
- `$case.sceneVersions[7].sceneCloser.lines[0]` 行，我看到你那一行了。今晚先到——
- `$case.sceneVersions[7].sceneCloser.lines[4]` 我明白。先说到这儿。
- `$case.overnightStructure.callbackOpeners.店外称呼观察.firstConflict.hostLine` 他跟熟客也这么说。你再听一遍，那句话后面接的是什么？
- `$case.overnightStructure.callbackOpeners.店外服务序列.firstConflict.hostLine` 他刚让熟客提前做，前台就登记会员。你以前也这样被照顾时，问过为什么吗？
- `$case.overnightStructure.callbackOpeners.培训页圈注.firstConflict.hostLine` 那五个字不在标准表里。昨晚你为什么还说‘店里都这样’？
- `$case.overnightStructure.callbackOpeners.顾问回单.firstConflict.hostLine` 表是真的。你最怕他今晚怎么解释那一列？
- `$case.overnightStructure.callbackOpeners.吹风机回放.firstConflict.hostLine` 你把吹风机的声音剪掉以后，再听那句话，跟原来有什么不一样？
- `$case.overnightStructure.callbackOpeners.女客拉群立场.firstConflict.hostLine` 你支持她留表，却不肯站到店门口。怕闹大，还是怕别人问你拿过什么？
- `$case.overnightStructure.callbackOpeners.咨询者止损立场.firstConflict.hostLine` 你说止损。要是她把表公开，你会不会又劝她算了？
- `$case.overnightStructure.callbackOpeners.培训模板说明.firstConflict.hostLine` 昨晚你为什么那么急着说‘店里都这样’？
- `$case.overnightStructure.callbackOpeners.店里的标准表.firstConflict.hostLine` 现在再看，你还觉得那几列只是店里的普通备注吗？
- `$case.overnightStructure.callbackOpeners.那次六折.firstConflict.hostLine` 好处都摆完了。表的事，你还问不问？
- `$case.overnightStructure.callbackOpeners.店长门口拒答.firstConflict.hostLine` 他没见过整张。你还打算拿店长的话替 Tony 解释吗？
- `$case.sceneVersions[4].entryQuestion` 昨晚敲门的人到底是谁？
- `$case.sceneVersions[4].casualQuestions[0].question` 你昨晚为什么说可能是物业？
- `$case.sceneVersions[4].casualQuestions[1].question` 你为什么不想说自己在哪儿上班？
- `$case.sceneVersions[4].questionOptions[0].question` 先别解释有没有违法。昨晚那阵强光和敲门，是同一拨人吗？
- `$case.sceneVersions[4].questionOptions[1].question` 你突然搬到你妈家，是 Tony 又去找你了吗？
- `$case.sceneVersions[5].entryQuestion` 你拿那张表问过他吗？
- `$case.sceneVersions[5].casualQuestions[0].question` 那句“老板娘”，你现在还留着吗？
- `$case.sceneVersions[5].casualQuestions[1].question` 年卡多少钱？
- `$case.sceneVersions[5].casualQuestions[2].question` 你姨知道这事了吗？
- `$case.sceneVersions[5].questionOptions[0].question` 那句“老板娘”说完以后，他多久又提到年卡？
- `$case.sceneVersions[5].questionOptions[1].question` 他发“老板娘”那句时，你怎么回的？
- `$case.sceneVersions[6].entryQuestion` 弹幕那句先别管。你前面说他给你免过单、插过号，除此以外还有吗？
- `$case.sceneVersions[6].casualQuestions[0].question` 你闺蜜后来还去过吗？
- `$case.sceneVersions[6].casualQuestions[1].question` 那次折扣是谁主动说的？
- `$case.sceneVersions[6].questionOptions[0].question` 他给你闺蜜六折的时候，有没有提过让你继续带人？
- `$case.sceneVersions[6].questionOptions[1].question` 闺蜜知道你们没确认关系吗？
- `$case.sceneVersions[7].entryQuestion` 最后一列写了什么？
- `$case.sceneVersions[7].casualQuestions[0].question` 你现在还去那家店吗？
- `$case.sceneVersions[7].casualQuestions[1].question` 那个开过店的朋友，怎么认识的？
- `$case.sceneVersions[7].casualQuestions[2].question` 那个号为什么一直没退？
- `$case.sceneVersions[7].questionOptions[0].question` 先看你自己那行。他下一步想让你做什么？
- `$case.sceneVersions[7].questionOptions[1].question` 你觉得会不会只是店里的玩笑备注？

### 终局

- `$case.hostDisclosure.text` 昨晚你突然去拉帘子，紧接着又有人敲门，我确实担心你出事。现在知道来的是民警，我只想问一句：别人的合作介绍里，为什么会有你的名字和手机号？另一个女生的十万，还得看原始记录，今晚先别往下猜。
- `$case.deepFollowup.question` 表里写你“朋友多，带客”。你当时为什么会替他转活动，还把朋友带去店里？
- `$case.stageJudgement` 他给你修刘海时手很轻，也给你留过最晚的号。这些照顾都是真的。第一夜你没说自己在酒吧上班，民警敲门时又说成物业，这两句你得认。你拿过六折，跟警察找上门没关系。警察来，是因为他没问过你，就把你的名字和手机号写进了别人的合作介绍。另一个女生的十万后来去了哪儿，几张转发图还说不清，等警方查。

### 其他出声面

- `$case.careChoices[0].hostLine` 年卡别办，号先留着。头发该剪还得剪——换家店。
- `$case.careChoices[1].hostLine` 他总给你留最晚那档，还替你挡过店里的话。你会往那边想，不奇怪。
- `$case.careChoices[2].hostLine` 群里的事不急。想不好，就来节目里想。
- `$case.overnightStructure.returnLead.lines[1]` 昨晚你先去拉帘子，后来麦里又响了敲门声。到底出了什么事？
- `$case.overnightStructure.returnLead.lines[3]` 你今天换到妈妈家，我先确认一句：你现在安全吗？
- `$case.overnightStructure.returnLead.lines[5]` 好，店名和你现在住哪儿都别说。等会儿我只问来人为什么找你，不想公开的先打住。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 那十万的材料，民警后来让你看了吗？
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 你能确定认购用的就是她转的那十万吗？

## 案二咨询者·何

- **固定性格：** 渴望被尊重的社交型人格
- **受压反应：** 引用他的原话前会停；别人拿酒吧工作定性她时立刻变硬；问到自己花过多少钱时不再铺垫。
- **防御动作：** 第一夜先说对方替她挡过一句没有念全的职业玩笑，再把持续消费和带客说成顺手；民警敲门时拿物业作借口。
- **知识边界：** 知道自己的聊天、消费、带客和听过的回放；第二夜知道民警为何联系自己，也见过另一位女客转来的投店款、聊天与回单截图。她没有原件，不知道三张图是否对应同一笔实际资金，也不知道 Tony 给多少人做过同样标记。

### 夜 A

- `$case.openingDialogue[0]` 他昨晚发错一张店里的表。我看了半个钟头，越看越不对，一晚上没睡。我今天轮休，在家，正好能打进来。
- `$case.openingDialogue[3]` 一个相亲认识的理发师，认识几个月了。我上班时间跟别人不太一样，又经常要见人，头发隔一阵就得弄。最早我只是去他店里剪，后来才不太像普通顾客。
- `$case.openingDialogue[5]` 他知道我一般下午才醒，总把最晚那档给我留着。临时要补发根，他也能给我插进去，有几次连剪发的钱都没收。店里忙完以后，我们还单独吃过饭。可他一直没把关系说清楚。
- `$case.openingDialogue[7]` 昨天他本来要发预约时间，手一滑，发来一张店里的表。我先当排班看，后来越看越不对。
- `$case.sceneVersions[0].afterVersion.lines[0]` 我喝口水。你问吧。
- `$case.sceneVersions[0].casualQuestions[2].lines[0]` 二十九。
- `$case.sceneVersions[0].casualQuestions[2].lines[2]` 他自己说的。
- `$case.sceneVersions[1].sceneCloser.lines[0]` ……等下，我外卖到了，搁门口就行——嗯，你继续。
- `$case.sceneVersions[3].sceneCloser.lines[1]` 等一下，外面怎么这么亮。我把帘子拉上。
- `$case.nightStructure.hangup` 我这边……临时有点事。可能是物业。今天先不说了。
- `$case.sceneVersions[0].version` 我那份工作下班晚。有回我在店里接工作电话，旁边一个客人拿我的上班时间开玩笑。他当场回了一句：“人家上自己的班，关你什么事。”从那以后，我就在他店里剪头，染发护理也只找他。他知道我下午才醒，总把最晚那档留给我。晚上我收工，他也会发语音，说店长又骂他了，最后总来一句：“也就你肯听我说这些。”我听多了，真以为自己对他不一样。我们没正式在一起，这个我知道。可店里要转活动的时候，他说一句“就帮我这一次”，我还是会转。
- `$case.sceneVersions[0].revisedVersion` 那句“也就你肯听我说这些”，我把语音存了半年。看见那张表以后再听，就像他顺手发给熟客的话。
- `$case.sceneVersions[0].casualQuestions[0].answer` 一年多。最早是同事推荐的，后来就只找他。
- `$case.sceneVersions[0].casualQuestions[1].answer` 我姨。她就说人家手艺人踏实。现在想想，介绍完第二周，他就开始给我留最晚的号。
- `$case.sceneVersions[0].questionOptions[0].answer` 没有。他只说“你跟别人不一样”。我一问算什么，他就笑，说慢慢来。
- `$case.sceneVersions[0].questionOptions[0].guardedAnswer` 他说慢慢来。我就等了。
- `$case.sceneVersions[0].questionOptions[1].answer` 我会回他：“有事你就找我。”他叫我自己人，剪头不收钱，满号也留位置，我当然愿意信。可我一直没敢接着问，我们到底算什么。
- `$case.sceneVersions[1].version` 以前我没往一块想。他说店长骂他，我就陪他聊；后来让我转活动、问哪个朋友要剪头，我也照做。昨晚我把聊天一条条翻回来，才发现这几件事总是挨着。那阵子他给我发过一条语音，我一直留着。我已经传到节目后台了，可我现在不想听。
- `$case.sceneVersions[1].casualQuestions[0].answer` 多半是语音。有时候发完又撤一条，你知道吧，就那种撤回，你看见小红点了但内容没了，我就猜他是不是说了重话又后悔。有回凌晨一点多，连着七条，最长那条五十九秒，我躺被窝里听完，又倒回去听了一遍。……哎，反正那阵子手机一亮，我就怕他又挨骂了。
- `$case.sceneVersions[1].casualQuestions[1].answer` 有个闺蜜真去剪了，还说不错。后来她办没办卡，我没好意思问。
- `$case.sceneVersions[1].questionOptions[0].answer` 不是每次。最近一次是先让我转活动，过几天又问哪个朋友要剪头。年卡也提过。昨晚我往前翻才发现，聊着聊着，他总会把话带回店里。不是转活动，就是问我能不能带人过去。
- `$case.sceneVersions[1].questionOptions[0].guardedAnswer` 不是每次都挨着。可活动、剪头、年卡，后来都提过。
- `$case.sceneVersions[1].questionOptions[1].answer` 帮他呗。那时候我还跟闺蜜说，等他以后开店，我能不帮吗？现在想想，我们连关系都没说清楚，我已经先把“以后”说出来了。
- `$case.sceneVersions[2].version` 办卡那天最怪。店长在前台，他先说我“不是普通顾客”。旁边小妹就喊“嫂子”。我没接，也没否认。店长马上跟一句：自己人办年卡划算，反正以后常来。我当时脑子里只剩“嫂子”。年卡那半句，像没听见。
- `$case.sceneVersions[2].casualQuestions[0].answer` 没那么排斥了。当场我没办，只说回去想想。可那天以后，他再提年卡，我就会多听两句。
- `$case.sceneVersions[2].casualQuestions[1].answer` 他笑了一下，说别闹。不是否认，是那种大家都懂的笑。
- `$case.sceneVersions[2].questionOptions[0].answer` 我说再想想，没办。可我那时候根本没顾上年卡，只顾着想，他为什么没有否认那句“嫂子”。
- `$case.sceneVersions[2].questionOptions[0].guardedAnswer` 没办。我说再想想。那时候我只顾着听他们叫我自己人。
- `$case.sceneVersions[2].questionOptions[1].answer` 因为我不想。我听着挺受用的。可我没回那句“嫂子”，也不是说年卡我就得办。
- `$case.sceneVersions[3].version` 那张表表头写着预约。我往下看，发型、项目那几格没怎么填，备注倒写得很满：“情绪稳定”“办卡意向强”“朋友多”。我那行是“稳情绪”。我截了图，发给以前开过店的大学室友。她回我：先别哭，把最后一列拍全。
- `$case.sceneVersions[3].casualQuestions[0].answer` 截了。当时手比脑子快。我还顺手发给我室友了，就开过店那个。她那会儿在带娃，凌晨才回我，先回了个问号，又打电话过来……你知道吧，她一打电话，我反而不敢接了。缓了十分钟才回过去。
- `$case.sceneVersions[3].casualQuestions[1].answer` 说不上来。就觉得他平时哄我、让我少等一会儿，可能全算在这三个字里了。这话我没跟人说过。
- `$case.sceneVersions[3].questionOptions[0].answer` 没有。发型那格是空的。我看到的就是“稳情绪”“办卡”这些词。
- `$case.sceneVersions[3].questionOptions[0].guardedAnswer` 发型那格是空的。别的，我不想念。
- `$case.sceneVersions[3].questionOptions[1].answer` 我先想，他是不是给熟客都这么写。要是大家都一样，至少不是我一个人看走眼。

### 夜 B

- `$case.sceneVersions[4].sceneCloser.lines[1]` 另一个女生报了警。她给他转过十万，说是一起开新店。可他给她看的合作介绍里，联络人写的是我，手机号也是我的，上面还说我能帮店里联系客人。
- `$case.sceneVersions[4].sceneCloser.lines[3]` 我在酒吧做营销，主要替客人订台、照看桌台。忙的时候客人那边缺人，我也得过去坐一会儿。收入除了底薪，还看桌台和酒水提成，有时周末当晚就结。我昨晚不想说，是怕弹幕一听酒吧两个字，就先觉得我活该。
- `$case.sceneVersions[4].sceneCloser.lines[5]` 知道。他给我留最晚的号，就是因为我下午才醒。第一夜我没把店里那句玩笑念全，那个人问的是我是不是天天陪人喝酒，他才替我挡回去。
- `$case.sceneVersions[4].sceneCloser.lines[7]` 问过。他问哪些客人平时舍得花钱，我当时只当他随口聊天，没想到他会把我写成新店联络人。
- `$case.sceneVersions[4].sceneCloser.lines[9]` 都没有。我连那份介绍都没见过。民警拿着手机问我是不是这个号码，我当时腿都软了。
- `$case.sceneVersions[5].beforeVersion.lines[0]` 他凌晨发来一张券。满三百减一百二，烫染通用。
- `$case.sceneVersions[5].beforeVersion.lines[2]` 配的字是：气消了来店里，我给你弄好看点。
- `$case.sceneVersions[5].beforeVersion.lines[4]` 我气的是表，他给我发券。
- `$case.sceneVersions[5].beforeVersion.lines[6]` 没了。就一张券。
- `$case.sceneVersions[6].afterVersion.lines[0]` 我把窗关一下，外面风大。好了。
- `$case.sceneVersions[6].questionOptions[0].resistanceBeat.lines[0]` 你是想问，六折是不是换我带客？
- `$case.sceneVersions[7].sceneCloser.lines[1]` 最后说个事。跟表没关系。
- `$case.sceneVersions[7].sceneCloser.lines[3]` 上礼拜他还给我修过刘海，手特别轻。我就想不明白，他给我剪头发那么仔细，怎么又能在表里把我写成那样。
- `$case.overnightStructure.callbackOpeners.店外称呼观察.firstConflict.callerLine` 我听成关系。少等一会儿、免单都有，我也愿意那么听。
- `$case.overnightStructure.callbackOpeners.店外服务序列.firstConflict.callerLine` 没问。我怕一问，自己也成了普通客户。
- `$case.overnightStructure.callbackOpeners.培训页圈注.firstConflict.callerLine` 那句话好用。我一说，‘自己人’还能留着。
- `$case.overnightStructure.callbackOpeners.顾问回单.firstConflict.callerLine` 怕他说，都是为了业绩。那我连生气都像不懂店里规矩。
- `$case.overnightStructure.callbackOpeners.吹风机回放.firstConflict.callerLine` 就像他已经下班了，专门在陪我。那时候我想听成这样。
- `$case.overnightStructure.callbackOpeners.女客拉群立场.firstConflict.callerLine` 都怕。免费剪、让我先做，我都拿过。我不想领头装成什么都没拿。
- `$case.overnightStructure.callbackOpeners.咨询者止损立场.firstConflict.callerLine` 不会。我就是不想带头去店里堵人。
- `$case.overnightStructure.callbackOpeners.培训模板说明.firstConflict.callerLine` 这么说，我就不用问他为什么单独记那一列了。
- `$case.overnightStructure.callbackOpeners.店里的标准表.firstConflict.callerLine` 不觉得了。他要说是店里的，就把原表拿出来。
- `$case.overnightStructure.callbackOpeners.那次六折.firstConflict.callerLine` 问。六折我拿过，这个我不赖。可那张表不是我写的，他得说清楚。
- `$case.overnightStructure.callbackOpeners.店长门口拒答.firstConflict.callerLine` 不了。店长只认店里那张，Tony 的表还得 Tony 自己说。
- `$case.sceneVersions[4].version` 你非要问的话……他们就是来了解一点情况。我没有被带走，也没做违法的事。昨晚我说可能是物业，就是不想让你接着问。可我也不想把自己在哪儿上班，当着这么多人讲出来。
- `$case.sceneVersions[4].casualQuestions[0].answer` 我那时候已经看见楼下的车了。说物业，是想让你别继续问，也怕直播间顺着问到我在哪儿上班。
- `$case.sceneVersions[4].casualQuestions[1].answer` 怕直播间一听工作地点，就先猜我是做什么的。昨晚我已经看见楼下的车了，更不想让人顺着问。
- `$case.sceneVersions[4].questionOptions[0].answer` 是。楼下停的是警车，敲门的是民警。他们让我带上手机下楼，说要问一件跟那家理发店有关的事。我一看见车灯就怕直播间听出来，才去拉帘子，又拿物业当借口。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 是同一拨人。来的是民警，问的事跟那家店有关。别的你一会儿再问。
- `$case.sceneVersions[4].questionOptions[1].answer` 不是 Tony。来的是民警。他们问完以后，我脑子一直乱，总觉得门还会再响，就到我妈这儿了。你先别问他们为什么找我。
- `$case.sceneVersions[5].version` 我拿表问他。他第一句就是：“我从来没说只有你一个。”可聊天还在。他明明发过：“以后店开起来，你就是老板娘。”不是求婚，我知道。可我听了这句，再听他提年卡、投一点，就真的没那么防着他了。
- `$case.sceneVersions[5].casualQuestions[0].answer` 还在聊天记录里。我昨晚翻那张表的时候，又把这句话翻出来看了一遍。
- `$case.sceneVersions[5].casualQuestions[1].answer` 三千六……不对，三千八。带两次护理那种。当时我说再想想，后来也一直没办。
- `$case.sceneVersions[5].casualQuestions[2].answer` 知道了。她第一句是：『手艺人也分好坏，回头我再给你踅摸一个。』……我还没说我难受呢，她已经在找下一个了。她是怕我卡在这儿。我懂。
- `$case.sceneVersions[5].questionOptions[0].answer` 没几天。他说我以后常来，办了方便。再往后才提到开店，说我也可以先投一点。
- `$case.sceneVersions[5].questionOptions[0].guardedAnswer` 提过办卡。投店那句，他后来就岔开了。
- `$case.sceneVersions[5].questionOptions[1].answer` 我发了个捂脸的表情，没问他是不是认真的。后来他提年卡，我也没把这两件事分开。
- `$case.sceneVersions[6].version` 我刚才说了，我在酒吧做营销。周末一场做顺了，提成有时当晚就结，钱刚到手，我第二天下午就去找他，染发加护理能花掉一大半。可他也给过我便宜：剪发有时不收，号满了照样插，带闺蜜去那次，他给她六折，我那次护理也免了。闺蜜一出门就说：“你这关系可以啊。”我嘴上说没有，心里当然受用。直到看见表上“朋友多，带客”，我才又想起那张六折单。
- `$case.sceneVersions[6].casualQuestions[0].answer` 去过一次。她说剪得还行，问我能不能还按上次那个价。我当时没多想。
- `$case.sceneVersions[6].casualQuestions[1].answer` 他主动。他说我的朋友就按自己人价，店长也在旁边点了头。
- `$case.sceneVersions[6].questionOptions[0].answer` 当时没有。他只说我的朋友按自己人价，店长也点了头。后来他确实问过，哪个朋友还要剪头。可六折那天，他没说这是拿来换人的。
- `$case.sceneVersions[6].questionOptions[0].guardedAnswer` 没有明说。折扣我拿了，后来他也问过谁还要剪头。
- `$case.sceneVersions[6].questionOptions[1].answer` 知道一点，可她以为快成了。她还说，他这么给面子，总不能只拿你当普通客户吧。我没纠正。
- `$case.sceneVersions[7].version` 最后一列，我看了半天才敢点开。我那行后面写：“年卡已聊，可稳情绪。”下面一个是“能投店，约饭再谈”，还有一个是“朋友多，带客”。我把手机扣在桌上，过了几分钟，又翻回来确认了一遍。
- `$case.sceneVersions[7].casualQuestions[0].answer` 号还留着，人没去。头发长了，随便找了家快剪。
- `$case.sceneVersions[7].casualQuestions[1].answer` 大学室友。她开过两年美容店，后来累垮了转行。她看东西毒。
- `$case.sceneVersions[7].casualQuestions[2].answer` 拖着。预约页打开过好几次，一直没点退。
- `$case.sceneVersions[7].questionOptions[0].answer` 办年卡。“可稳情绪”要怎么稳，我不知道。反正那一行不是在约我下次剪头。
- `$case.sceneVersions[7].questionOptions[0].guardedAnswer` 办年卡。后面那几个字，我不想念。
- `$case.sceneVersions[7].questionOptions[1].answer` 可下面不止我一行。有人后面写办卡，有人写带客，还有人写投店。我再说是玩笑，连我自己都不信。
- `$case.overnightStructure.callbackOpeners.店外称呼观察.line` 门边那句我听见了。他也叫别人‘自己人’。我昨晚只抓住这三个字，后面那句续护理，像没进耳朵。
- `$case.overnightStructure.callbackOpeners.店外服务序列.line` 隔着玻璃，只看见他让熟客提前做，前台接着登记会员。没听见他怎么叫她。我就是觉得这两件事连得太快。
- `$case.overnightStructure.callbackOpeners.培训页圈注.line` 店里的培训页有办卡，也有下次预约。翻到最后，我又看了一遍。‘下一次推进’真没有。
- `$case.overnightStructure.callbackOpeners.顾问回单.line` 顾问只肯认表是真的。至于他对谁真，我拿着那张表也问不出来。
- `$case.overnightStructure.callbackOpeners.吹风机回放.line` 吹风机那段，我听清了。那晚他还在店里。背景一直没消失，是我把它剪掉，只留了“也就你肯听我说这些”。
- `$case.overnightStructure.callbackOpeners.女客拉群立场.line` 她要拉群，还要去店里。我不去。我先退卡，把带过去的朋友叫回来……那张表，她要留就留。
- `$case.overnightStructure.callbackOpeners.咨询者止损立场.line` 我劝她先退卡，别去堵门。他的电话我也没接。可我没让她删表，这事他得自己说。
- `$case.overnightStructure.callbackOpeners.培训模板说明.line` 培训页我翻了两遍，办卡、预约都有。我一直翻到最后，也没找到‘下一次推进’。昨晚那句‘店里都这样’，我可能说早了。
- `$case.overnightStructure.callbackOpeners.店里的标准表.line` 两张表我放在一起看了。旧表写项目、时间、怕烫这些；Tony 那张多出来的，都是‘稳情绪’‘办卡’‘带客’。
- `$case.overnightStructure.callbackOpeners.那次六折.line` 六折那次我记得。她们都夸我有面子，我也没说这是店里活动。好处我拿了。
- `$case.overnightStructure.callbackOpeners.店长门口拒答.line` 店长没让你进门，只说店里有维护表、有办卡指标。你问到 Tony 那张，他说没见过整张，然后就把门关了。
- `$case.overnightStructure.callbackFallback.line` 我回来了。那张表我又看了一遍。你白天先查了哪一处？
- `$case.overnightStructure.postures.againstCaller` 让我先做、免单、朋友六折，我都认。可我没答应被写成下一步生意。
- `$case.overnightStructure.postures.withCaller` 我没接他的电话。白天你查到什么，等我先把昨晚的事说完。
- `$case.nightStructure.returnStance.lines.defensive` 我差点不打回来。弹幕说我也有份……他给过我的便宜，我没否认。可“下一次推进”不是我让他写的。
- `$case.nightStructure.returnStance.lines.open` 我回来了。表的事你继续问。这回我不先替他说话。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。隔了一天再看，那一列还在。

### 终局

- `$case.deepFollowup.answer` 因为我真把自己当成他那边的人了。店里活动缺转发，我顺手就发；闺蜜要剪头，我直接把他的微信推过去。她们夸我有面子，我还挺高兴。后来他提开店，我第一反应也不是问钱，是想：他是不是终于把我算进以后了。关系我一直没敢问，他也一直不说。

### 其他出声面

- `$case.careChoices[0].lines[0]` ……嗯。楼下新开了家，十五块快剪。就是不聊天。
- `$case.careChoices[0].lines[2]` 不聊挺好。
- `$case.careChoices[1].lines[0]` ……我还真怕你也说我活该。你这么讲，我能听进去。
- `$case.careChoices[2].lines[0]` 行。想不好我就再打。
- `$case.overnightStructure.returnLead.lines[0]` 我现在在我妈家，她电视还开着。要是吵，你跟我说。
- `$case.overnightStructure.returnLead.lines[2]` 就是有人来找我问点事。跟那家店有一点关系。我现在不太想说。
- `$case.overnightStructure.returnLead.lines[4]` 安全。昨晚的人已经走了。不是物业，来问的事也跟那家店有关。再往下说，直播间里有人会认出我。你先问别的，行吗？
- `$case.overnightStructure.liveCounterBeats[0].lines[1]` 做完情况说明，那个女生把三张图转给我：给他的十万、他说先放进宸直的聊天，还有第二天同额的认购回单。
- `$case.overnightStructure.liveCounterBeats[0].lines[3]` 不能。我手里只有她转来的图，原件已经交给民警。他们也没说是不是同一笔钱。
- `$case.overnightStructure.liveCounterBeats[1].lines[0]` 等会儿。刚那条弹幕我看见了——『收了好处装什么受害者』。
- `$case.overnightStructure.liveCounterBeats[1].lines[2]` 谁装了？！我免单那次是他硬免的！你们倒是来一个人剪头试试啊！
- `$case.overnightStructure.liveCounterBeats[1].choices[0].lines[0]` ……嗯。你问吧。
- `$case.overnightStructure.liveCounterBeats[1].choices[1].lines[0]` ……收了。行了吧。
- `$case.overnightStructure.liveCounterBeats[1].choices[1].lines[2]` 往下问。
- `$case.overnightStructure.liveCounterBeats[1].choices[2].lines[1]` ……算了。当我没看见。

## Tony

- **固定性格：** 讨喜的即兴交易者
- **受压反应：** 被逼着定义关系时退回服务和店务，把情绪词说成维护。
- **防御动作：** 先替人挡一句难听话，再把专属感接回服务和店务；被问关系时拒绝给出明确身份。
- **知识边界：** 知道自己的聊天、会员记录、剪辑动作，以及自己如何安排那笔十万元；不知道警方调查结果和宸直后续兑付情况，也不能代表门店制度之外的人。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 姐，先坐会儿。
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[0]` 自己人还排什么队啊。我把手上这个做完就轮你。
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[2]` 行，今天就补颜色。你先坐，我这边马上好。

### 后台／材料回流

- `$case.respondentNote.text` 那张表我写得难看，这个我认。可我没说过她是我女朋友。“老板娘”是喝酒时开玩笑，她真当了，我也没办法。办卡、带客本来就是我的工作。十万那件事我也跟对方说过，先买一款两个月到期的宸直产品，到期以后再把本金和收益投进店里。现在店没开起来，不能就说我吞了钱。

## 案二邻桌常客

- **固定性格：** 厌烦套路的直肠子
- **受压反应：** 听见熟悉话术就直接复述自己听过的版本。
- **防御动作：** 只说耳朵听见的，不负责解释。
- **知识边界：** 只知道同席时听见的当面话，不知道麦外私聊。

### 白天

- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[1]` 你可少来，上回你也是这么说的。那套护理我才刚做完，不续了啊。今天就补个颜色，你别待会儿又劝我办套餐。

## 案二开店朋友

- **固定性格：** 务实的行业老手
- **受压反应：** 把关系争论压回标准字段和业绩归属。
- **防御动作：** 只比字段、权限和收益。
- **知识边界：** 知道理发店常规运营，不知道这家店和Tony的全部事实。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 水温、发型、客人不喜欢聊什么，我们都会记。熟客一多，记岔一次人家就不来了。
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[0]` 我这张最多写到下次护理。Tony 那张谁加的，我又没在他店里上过班，你得去问他。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[0]` 让她少等、给她免过单，她朋友也拿过六折，这些别装没发生。可拿了店里的便宜，跟 Tony 能不能在私表里那样写她，不是一回事。

## 案二店长

- **固定性格：** 急躁的防守型管理者
- **受压反应：** 追问私表越深，越快结束谈话并关门。
- **防御动作：** 承认培训，不承认自己知道私人推进。
- **知识边界：** 知道培训、会员制度和员工指标，不知道Tony全部私人对话。

### 收麦幕间

- `$case.nightStructure.interlude.actions[4].text` 别来拍店门，也别把店名带进直播。Tony 私下怎么记人，你们问他；今晚我不接电话。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[0]` 昨晚那条微信你看见了。培训页我让人转了，页上写什么就看页，别拿我当 Tony 的证人。
- `$case.overnightStructure.dayScenes[2].body.beats[2]` 没见过完整的。我确认店里有维护和办卡指标；他把谁写进哪一列，我不替他答。
- `$case.overnightStructure.dayScenes[2].body.beats[3]` 就这一句。门我要关了。

### 后台／材料回流

- `$case.investigationHooks[0].material` 店长说：“维护表、会员指标、话术培训，我教的。业绩压死人，我也不装。Tony 那张私表我没看过整张；写谁、怎么写，去问他。别把他的表扣全店头上。”

## 案二另一位女客

- **固定性格：** 受伤后外放的感性派
- **受压反应：** 越被拒绝越想把个人尴尬变成共同指控。
- **防御动作：** 用‘不止我一个’压过自己的受用。
- **知识边界：** 知道自己的转账、Tony 发来的聊天、Tony 名下回单和报案经过，原件已经交给民警；不知道咨询者的完整经历，也不知道其他顾客是否投过钱。

### 后台／材料回流

- `$case.investigationHooks[1].material` 她发来的表里，她那栏写着“能投店”，后面跟着“约见朋友、聊分红”。另一栏写“情绪稳住，年卡下次推”。她留言说：“我不退群，也不想算了。我要当面问他，这张表到底还写过几个人。你们要去，叫上我。”

## 老方

- **固定性格：** 急躁的结果主义者
- **受压反应：** 数据越差，句子越像截止日期和命令。
- **防御动作：** 把关心包装成指标，把认可包装成下一项要求。
- **知识边界：** 只知道节目运营、后台曲线和公开播出内容，不知道案件麦外真相。

### 其他出声面

- `$case.overnightStructure.liveCounterBeats[2].text` 店家商务函到平台了，点名这通。法务让缓。你要继续，数据得扛住。——方

## 赵律师

- **固定性格：** 锋利的理性派
- **受压反应：** 听见无证据定性会立刻打断，并补适用条件。
- **防御动作：** 短句、免责、拒猜动机。
- **知识边界：** 只解释法律与责任效果，不替案件当事人作证，不指点玩家圈哪一栏。

### 后台／材料回流

- `$case.delegation.outcomes.zhao-lawyer.text` “老板娘”在法律上不是关系承诺。那张三千八的年卡后来也没办；这句话让她放松了多少防备，是另一回事。

## 周会计

- **固定性格：** 冷静的数字理性派
- **受压反应：** 删掉形容词，只报金额、时间和路径。
- **防御动作：** 按日期排列，拒绝替数字添故事。
- **知识边界：** 只读材料中已经出现的账目与流程，不认定未知付款人身份。

### 后台／材料回流

- `$case.delegation.outcomes.zhou-accountant.text` 年卡没办成，就没有支付记录可查。账上现在能说的，是她拿过六折和护理免单；这些证明她收过优惠，证明不了私表是谁写的。

## 小林老师

- **固定性格：** 热络的感性现实派
- **受压反应：** 先替行业解释一句，再把行话翻成人话。
- **防御动作：** 笑着纠偏，拆一次话术就补一次行业辩护。
- **知识边界：** 只解释婚恋行业话术和流程，不知道本案人物私下做过什么。

### 后台／材料回流

- `$case.advisorNotes[0].text` 表的事你们台上对过了。我只补一句：别把整行手艺人跟着一个人骂脏。
- `$case.delegation.outcomes.lin-matchmaker.text` 标准维护表会记服务偏好、到店频率和办卡可能。我没见过把人写成“稳情绪、能投店”，再接“下一次推进”的。能说这不是标准模板，不能替你说他没有真心。……哎呀先这样，我这边有个姑娘相亲相到一半跑出来了，我得去劝。行里的事，行里人命苦。

## 张法医

- **固定性格：** 技术洁癖型理性派
- **受压反应：** 碰到来源不全的材料会停止讨论结论。
- **防御动作：** 先查链条，再谈内容。
- **知识边界：** 只判断证据链与技术可检验性，不认定关系或动机。

### 后台／材料回流

- `$case.delegation.outcomes.zhang-forensic.text` 截图链条完整，没有拼接痕迹。只能确认这张表是真的、文字是一次录入；谁让他这么记人，图上看不出来。

## V哥

- **固定性格：** 沉着的直觉教练
- **受压反应：** 玩家越急，他越让人停一下，只比较两件已知事物。
- **防御动作：** 短句，先停，再分开看。
- **知识边界：** 只知道玩家当前已经听见或看见的内容。

### 夜 A

- `$case.sceneVersions[0].helperHint` 把你听出来的关系，和他亲口说过的称呼分开。别替任何一边补答案。
- `$case.sceneVersions[1].helperHint` 他说完店长骂他以后，有没有接着让她转活动、带朋友来，或者办年卡？先看顺序，别急着判真心。
- `$case.sceneVersions[2].helperHint` 把“嫂子”“自己人”和“办年卡”按顺序排，看看是谁把哪一步往前推。
- `$case.sceneVersions[3].helperHint` 预约表本该记服务。把正常服务信息和那列人的特征分开看。

### 夜 B

- `$case.sceneVersions[4].helperHint` 先别猜她做了什么。把强光、敲门、换住处和她不肯说的工作按先后问清。
- `$case.sceneVersions[5].helperHint` “老板娘”可以是玩笑，也可以有作用。看它后面紧跟着什么要求。
- `$case.sceneVersions[6].helperHint` 她确实花过钱，也拿过折扣。再看晚档、免单和六折有没有被记进带客逻辑。
- `$case.sceneVersions[7].helperHint` 先把服务备注和最后一列分开看。两边各自在安排什么？

# 彩礼与流水

## 林旭阳

- **固定性格：** 温热而克制
- **受压反应：** 担心误判时先缩短句子，把混在一起的事实拆开。
- **防御动作：** 把感情和判决分开，用小而合法的试探代替情绪宣判。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 夜 A

- `$case.openingDialogue[1]` 饭店还没订，彩礼倒先问过去了。那先说彩礼。
- `$case.openingDialogue[2]` 你妈让介绍人报了多少？
- `$case.openingDialogue[4]` 你已经把本科说清楚了，她还是把这个数递过去了。男方怎么回的？
- `$case.nightStructure.hangup.hostLine` 好。你先回群里看看。学费那句往后，每个人到底说了什么，明天回来我们再问。
- `$case.sceneVersions[0].entryQuestion` 他把工资账户流水发来以后，你们怎么聊的？
- `$case.sceneVersions[0].casualQuestions[0].question` 你们相亲见了几次？
- `$case.sceneVersions[0].casualQuestions[1].question` 你跟你妈平时什么都聊吗？
- `$case.sceneVersions[0].questionOptions[0].question` 他已经说拿不出二十八万八，你为什么还是不信，非要他把流水打出来？
- `$case.sceneVersions[0].questionOptions[1].question` 你要看的是他的银行流水，他为什么只发工资账户？
- `$case.sceneVersions[0].questionOptions[2].question` 你妈妈看到那张工资卡的余额以后，问过这是不是他的全部账户吗？
- `$case.sceneVersions[1].entryQuestion` 他说这些材料能省掉饭桌上的解释。你们吃饭时，学历真的说清楚了吗？
- `$case.sceneVersions[1].casualQuestions[0].question` 介绍人为什么推荐那家店？
- `$case.sceneVersions[1].casualQuestions[1].question` 开口问本科以前，你已经觉得那张学校图有问题了吗？
- `$case.sceneVersions[1].questionOptions[0].question` 他已经承认本科不是那所。你当时为什么没接着问，前面那句“名校毕业”到底怎么来的？
- `$case.sceneVersions[1].questionOptions[1].question` 服务员走了以后，你们又聊本科了吗？
- `$case.sceneVersions[1].questionOptions[2].question` 那顿饭谁结的账？
- `$case.sceneVersions[2].entryQuestion` 你回家以后是怎么跟家里说的？
- `$case.sceneVersions[2].casualQuestions[0].question` 介绍人跟男方家什么关系？
- `$case.sceneVersions[2].casualQuestions[1].question` “家里省心”这话你怎么理解？
- `$case.sceneVersions[2].questionOptions[0].question` 你知道妈妈拿那笔学费去抬彩礼以后，有没有劝她把二十八万八收回来？
- `$case.sceneVersions[2].questionOptions[1].question` 你把本科说清以后，你妈妈当时怎么回的？
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

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[1]` 男方家这么讲，你就直接转给她家了？工资、流水，你一样都没见过？
- `$case.overnightStructure.dayScenes[0].body.beats[3]` 你还替女方说过什么？
- `$case.overnightStructure.dayScenes[0].body.beats[5]` 你知道女方家准备给她多少吗？
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[0]` 两边聊天和彩礼传话我都留着，前后几句也一起截。
- `$case.overnightStructure.dayScenes[0].body.choice.options[1].resultBeats[0]` 我先把“收入挺稳”“不太计较学历”和二十八万八标出来。前两句你没问本人，最后一句你没问女方家现在能拿多少。
- `$case.overnightStructure.dayScenes[1].body.beats[1]` 我只问他发给女方的那份流水。为什么最后只发工资账户？

### 夜 B

- `$case.sceneVersions[5].beforeVersion.lines[3]` 你怎么回的？
- `$case.sceneVersions[6].afterVersion.lines[2]` 先停一下。我们现在只看得到这张工资卡，别的账户里有多少，没人知道。至于二十八万八，他已经说过拿不出。不能因为工资卡上有这个余额，就当他已经答应了。
- `$case.sceneVersions[6].sceneCloser.lines[0]` 你刚才说自己也算过。除了彩礼，你还算过什么？
- `$case.sceneVersions[6].sceneCloser.lines[5]` 你连哪次冷场都记着。那张表先别发，你们刚说好公开到哪里。
- `$case.overnightStructure.callbackOpeners.两边的完整聊天.firstConflict.hostLine` 介绍人传二十八万八的时候，知道你家现在能拿多少吗？
- `$case.overnightStructure.callbackOpeners.她没核实的两句话.firstConflict.hostLine` 先不谈介绍人。你知道家里的钱还在宸直以后，为什么没让妈妈撤回二十八万八？
- `$case.overnightStructure.callbackOpeners.表姐门口口供.firstConflict.hostLine` 你看到只有工资账户，为什么还是把它当成他的全部家底？
- `$case.overnightStructure.callbackOpeners.双份材料圈注.firstConflict.hostLine` 那女方家的三十万，眼下能算进婚礼预算吗？
- `$case.overnightStructure.callbackOpeners.家里群原话.firstConflict.hostLine` 你家要男方现在拿二十八万八，自己却准备等九月底。这一点，你事前知道吗？
- `$case.overnightStructure.callbackOpeners.饭局停顿回放.firstConflict.hostLine` 一笔花出去的学费，为什么在你们家变成了还能拿出来的彩礼？
- `$case.sceneVersions[5].entryQuestion` 你妈妈去找介绍人以前，家里群还说过什么？
- `$case.sceneVersions[5].casualQuestions[0].question` 那顿饭，他算钱时会跟你解释吗？
- `$case.sceneVersions[5].casualQuestions[1].question` 你妈见过他照片吗？
- `$case.sceneVersions[5].casualQuestions[2].question` 你妈现在什么态度？
- `$case.sceneVersions[5].questionOptions[0].question` 二十八万八是谁先提的？
- `$case.sceneVersions[5].questionOptions[1].question` 你爸妈说给你的婚礼钱，现在能拿出来吗？
- `$case.sceneVersions[6].entryQuestion` 男方现在承认只发了工资账户。你收到那份流水时，是怎么理解的？
- `$case.sceneVersions[6].casualQuestions[0].question` 他问你家准备出多少以后，你多久没回？
- `$case.sceneVersions[6].casualQuestions[1].question` 你身边有婚后一起管钱的例子吗？
- `$case.sceneVersions[6].casualQuestions[2].question` 他现在还给你发消息吗？
- `$case.sceneVersions[6].casualQuestions[3].question` 周末那顿饭，你还想见吗？
- `$case.sceneVersions[6].questionOptions[0].question` 你知道家里的钱暂时拿不出来，为什么没让妈妈撤回二十八万八？
- `$case.sceneVersions[6].questionOptions[1].question` 他算得细，能证明收入有问题吗？

### 终局

- `$case.hostDisclosure.text` 我先说句自己的。我以前也被人追着问过工资，当时觉得特别难堪，直接把门摔了。后来真缺钱交房租，我又想过，要是那天肯好好说，也许不用闹成那样。
- `$case.deepFollowup.question` 你问过他的收入，也要求看过他的银行流水。现在先不算你父母那笔理财，你自己现在有多少存款，愿意拿多少出来办婚礼？
- `$case.stageJudgement` 你给四次见面做了张表，连哪句话没说下去都记着。问题拖了不止一顿饭。彩礼和周末见父母都先停。男方只发工资卡，其他账户没说；你自己的存款和家里那笔还没到期的钱，也是今晚才告诉他。别再隔着介绍人传话了。你们俩把现在能拿多少、愿意拿多少当面说清楚，再决定还见不见。

### 其他出声面

- `$case.careChoices[0].hostLine` 两个人谈的时候，把你那张表带上。别念，放包里就行。
- `$case.careChoices[0].lines[1]` 放包里，不是放台上。
- `$case.careChoices[1].hostLine` 想把条件问清楚不丢人。下次别借你妈的嘴，自己问。
- `$case.careChoices[2].hostLine` 谈完什么结果，都可以来说一声。不用带材料。
- `$case.overnightStructure.liveCounterBeats[2].lines[2]` 好。你们俩都愿意说，我就多占几分钟。她先把自己的钱说完，你再答为什么只发工资卡。礼物不算谁更有理，谁也别拿它抢话。
- `$case.overnightStructure.liveCounterBeats[3].lines[1]` 先听他自己怎么说。
- `$case.overnightStructure.liveCounterBeats[3].lines[4]` 那就先取消。你们把自己现在能拿的钱说完，再决定还见不见。

## 案三咨询者·林

- **固定性格：** 数字化自保的理性派
- **受压反应：** 更爱报精确数字、减少语气词；问到自己的八万四和父母那笔理财时句子骤短。
- **防御动作：** 先说彩礼是母亲定的，把自己的默许和对男方财力的推断放到后面。
- **知识边界：** 知道 MBA 学费由男方本人承担、自己收到的材料、家庭群和彩礼传话；不知道对方连续收入，也不知道宸直能否按约兑付。

### 夜 A

- `$case.openingDialogue[0]` 这个周末本来要带他回家见父母，饭店还没订，我妈已经托介绍人去问彩礼了。我知道以后，突然不想去了。
- `$case.openingDialogue[3]` 二十八万八。是我妈让介绍人去问的。她事先没告诉我，男方来找我时，我才知道她已经把数字递过去了。她原先一直把他当成名校本科，我上周明明纠正过：本科不是那所，只是工作以后去那里读过 MBA。
- `$case.openingDialogue[5]` 他说二十八万八拿不出来，还说结婚不能把手里的钱全拿去做彩礼。我不信，让他把银行流水打出来。第二天下午，他只发来一份工资账户流水，截止那天余额二十八万六。他说：“你不是要看收入吗？这张你先看。”
- `$case.sceneVersions[1].sceneCloser.lines[0]` 你等一下，我把台灯换个档。刺眼。
- `$case.sceneVersions[3].sceneCloser.lines[0]` 等一下，我倒点水。……好了，接着问吧。
- `$case.sceneVersions[4].sceneCloser.lines[0]` 我把学费那句发进群以后，我妈回了句：“这事你别插嘴，我问介绍人。”她没说要问什么。
- `$case.nightStructure.hangup` 家里群一直在 @ 我。最上面那几句……我得自己再看一遍。今晚先到这儿吧，明天我回来。
- `$case.sceneVersions[0].version` 他前面已经说拿不出，我还是让他打了流水。发来以后，我先问：“只有这一张？”过了十几分钟，他回我：“你不是要看收入吗？工资卡最清楚。”我又问其他账户呢，他没有接。我把这张转给我妈，她看完只说：“这不是有吗？”我当时也盯着那个余额，没有再问这是不是他的全部账户。后来男方家反过来问介绍人，我们家准备给我多少，我妈没有回。
- `$case.sceneVersions[0].casualQuestions[0].answer` 四次。两次饭，一次展，一次他接我下班。节奏不快不慢。
- `$case.sceneVersions[0].casualQuestions[1].answer` 大事聊。她比我急。我 28，虚岁 29，她逢人就说我不挑，其实是她挑。上个月她把我照片发给三个介绍人，像素还调高了。我说妈，你这是发简历呢。她说简历怎么了，你爸当年也是我筛出来的。……筛出来的。她原话。
- `$case.sceneVersions[0].questionOptions[0].answer` 因为我和我妈都盯着那句“二十三万八学费是他自己交的”。我妈说，能自己花这么多钱读书，不可能连彩礼都拿不出。我当时也这么想。他说拿不出，我没想着先听他的，反倒觉得他在跟我压价。
- `$case.sceneVersions[0].questionOptions[0].guardedAnswer` 我妈觉得他能自己交二十三万八学费，手里不可能没钱。我当时也觉得他说拿不出是在压价。
- `$case.sceneVersions[0].questionOptions[1].answer` 我当时说的是“把流水给我看”，没限定哪张卡。他挑了工资账户发过来。我问“只有这一张吗”，他没回。到昨晚为止，我手里就这一张。别的账户有没有、里面有多少，我都不知道。
- `$case.sceneVersions[0].questionOptions[1].guardedAnswer` 我让他发流水，他只发了工资账户。我问过还有没有别的，他没有回答。其他账户里有多少，我不知道。
- `$case.sceneVersions[0].questionOptions[2].answer` 没有。她只说，差那么一点就够彩礼，说明他不是拿不出，是不愿意拿。我当时也没有提醒她，这只是工资账户。
- `$case.sceneVersions[1].version` 第一次正式吃饭，介绍人订了窗边。他先问我审计是不是总加班，我问他平时出差多不多。吃到一半，我还是问了：“你发的材料是那所学校，本科也是在那儿读的吗？”他筷子停了一下，才说：“本科不是。我工作以后去读的 MBA，学费二十三万八，是我自己出的。”正好服务员来添水，我没有接着问，之前那句“名校毕业”到底是谁说出来的。
- `$case.sceneVersions[1].casualQuestions[0].answer` 她说那家安静，第一次正式聊不会太吵。可那天包间没排到，最后坐了窗边。
- `$case.sceneVersions[1].casualQuestions[1].answer` 还没有。我只是想把介绍人那句“学校好”问得具体一点。结果他一停，我才觉得这事可能没说全。
- `$case.sceneVersions[1].questionOptions[0].answer` 因为“名校毕业”是我先跟家里说的。再往下问，就得承认是我自己没问清。加上他说二十三万八是自己出的，我第一反应居然是，他应该挺有钱。前面那句到底怎么来的，我就没有再提。
- `$case.sceneVersions[1].questionOptions[0].guardedAnswer` 没问。服务员一来，我就顺势把话停了。
- `$case.sceneVersions[1].questionOptions[1].answer` 没有。他说菜快凉了，我也就跟着聊别的。那顿饭是我催着约的，我也怕当场问僵。
- `$case.sceneVersions[1].questionOptions[2].answer` 他付的，用了团购券和积分。停车费一百多，他问我要不要 AA。单看都没问题。后来再想他的收入，我总会想起那张券。
- `$case.sceneVersions[2].version` 其实“名校毕业”最早也不是他说的。介绍人当时跟我家夸他：“学校好、收入稳，家里也省心。”我回去跟我妈说的时候，把“学校好”说成了“名校毕业”。饭后我只在群里补了一句：“本科不是那所，是后来读的 MBA，二十三万八他自己出的。”第二天，我妈就让介绍人问二十八万八，比我表姐当年多了整整十万。我知道以后，没有让她把话收回来。
- `$case.sceneVersions[2].casualQuestions[0].answer` 他妈的老同事。所以话肯定挑好的说，这我懂。
- `$case.sceneVersions[2].casualQuestions[1].answer` 就是独生子，爸妈有退休金，平时不用他贴钱。我妈一听这四个字，后面都没细问。
- `$case.sceneVersions[2].questionOptions[0].answer` 没有。她说能自己交二十三万八学费，手里肯定还有积蓄。我当时也觉得男方应该拿得出来，所以虽然这个数不是我定的，我也没有让她收回来。
- `$case.sceneVersions[2].questionOptions[0].guardedAnswer` 没有。二十八万八不是我定的，可我知道以后，没有让她收回来。
- `$case.sceneVersions[2].questionOptions[1].answer` 她先说我没问清。隔了一会儿，她又问：“二十三万八真是他自己交的？”我说是，她就觉得他手里应该还有钱。第二天她去找介绍人，我那时候只顾着松了口气，觉得她总算不再追着问学历。
- `$case.sceneVersions[3].version` 介绍人把两边聊天都发给我了。她给我家只讲过“学校不错”，又先跟男方家说我工作稳定、家里事少，还替我说过“不太计较学历”。后来我妈知道 MBA 学费是他自己出的，又单独给她发语音：“他能自己拿二十三万八读书，家里不会差。彩礼别按她表姐十八万八那份谈，先问二十八万八。”介绍人没有劝，原样转给了男方家。
- `$case.sceneVersions[3].casualQuestions[0].answer` 没有。介绍人这次一起发出来，我才第一次看见。“家里事少”那句挺刺的，我家什么情况，她根本没认真问过。
- `$case.sceneVersions[3].casualQuestions[1].answer` 当时觉得她偏男方。看完另一段，我又觉得她就是太想把这顿饭约成，哪边难听就替哪边改一句。
- `$case.sceneVersions[3].questionOptions[0].answer` 男方家以前帮过她，她一直想还这个人情。她说彩礼只是先问问，自己不好替我妈把数字压回去。我听着却觉得，她既然愿意替两家介绍，就不该只负责传最刺激人的那一句。
- `$case.sceneVersions[3].questionOptions[0].guardedAnswer` 她说男方家以前帮过她，想把这个人情还上。别的她没细讲。
- `$case.sceneVersions[3].questionOptions[1].answer` 我妈的原话。介绍人连十八万八那句也一起转了。男方家知道这不是她随口报的，是我妈在跟我表姐比较。
- `$case.sceneVersions[3].questionOptions[2].answer` 我跟我妈说：“名校毕业，条件不错。”后面这两个判断都是我自己加的。我妈一听，马上开始催我带人回家。
- `$case.sceneVersions[4].version` 后来我在微信上又问了一次。他说本科不是那所，读的是那所学校的 MBA，学费二十三万八，是工作以后分三次交清的。学校查询页和缴费回单我都看了，项目是真的，钱也是从他账户出去的。我把这些发进家里群，本来是想把“名校毕业”纠正过来，没想到我妈盯住的是二十三万八。
- `$case.sceneVersions[4].casualQuestions[0].answer` 校名和项目名，他一口气就说完了。问到本科，他才停了一下。
- `$case.sceneVersions[4].casualQuestions[1].answer` 普通一本。我妈听见他名校毕业以后，逢人就说我眼光好。我没纠正，可能也舍不得她把这句收回去。
- `$case.sceneVersions[4].questionOptions[0].answer` 看不出来。图上只有校名和 MBA 项目，本科、项目性质、读了多久都没有。那些是我后来一项一项问出来的。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 看不出来。图上只有校名和 MBA 项目。
- `$case.sceneVersions[4].questionOptions[1].answer` 我原样发了。本科不是那所，MBA 二十三万八是他自己交的。我妈先说我没问清，过一会儿又说，能自己花这么多读书，家里总不会差。她后来去找介绍人，我那时候还不知道。

### 夜 B

- `$case.sceneVersions[5].beforeVersion.lines[0]` 今天下午，介绍人又来问我。
- `$case.sceneVersions[5].beforeVersion.lines[2]` 男方家想知道，我家除了要二十八万八，准备给我多少。
- `$case.sceneVersions[5].beforeVersion.lines[4]` 我没回。我爸妈以前说过会给我二十万，可那笔钱现在还在宸直。我不知道九月底到底能不能拿出来。
- `$case.sceneVersions[6].afterVersion.lines[1]` 我说的是银行流水。你只给工资卡，也没有说其他账户不在里面。你前面说拿不出，卡上又有二十八万六，我当然觉得你是在跟我压价。
- `$case.sceneVersions[6].afterVersion.lines[4]` 我爸妈原来答应给我二十万。我知道那笔钱还没到期，也知道我妈去问了二十八万八。这个我没告诉你，是我的问题。
- `$case.sceneVersions[6].casualQuestions[2].lines[0]` 发。
- `$case.sceneVersions[6].casualQuestions[2].lines[2]` 间隔很规律。
- `$case.sceneVersions[6].sceneCloser.lines[2]` 我给我们见面的四次都记了账。花了多少，聊过什么，哪次话没说下去。
- `$case.sceneVersions[6].sceneCloser.lines[4]` 我当面说不出来。每次回家又怕自己漏了什么，只好记。
- `$case.overnightStructure.callbackOpeners.两边的完整聊天.firstConflict.callerLine` 不知道。我妈只说不会亏待我，没说那笔钱还在宸直。
- `$case.overnightStructure.callbackOpeners.她没核实的两句话.firstConflict.callerLine` 因为我也觉得，他能自己交二十三万八学费，应该拿得出来。
- `$case.overnightStructure.callbackOpeners.表姐门口口供.firstConflict.callerLine` 因为我先认定他是在压价。二十八万六又离二十八万八太近，我只顾着看那个数字。
- `$case.overnightStructure.callbackOpeners.双份材料圈注.firstConflict.callerLine` 不能。还没到期，九月底能不能兑付也不知道。
- `$case.overnightStructure.callbackOpeners.家里群原话.firstConflict.callerLine` 知道宸直没到期，不知道我妈已经把二十八万八问过去。后来知道了，我也没叫停。
- `$case.overnightStructure.callbackOpeners.饭局停顿回放.firstConflict.callerLine` 因为我妈这么算的时候，我也觉得有道理。现在看，是我们把两件事当成了一件。
- `$case.sceneVersions[5].version` 我爸在群里说，结婚的钱不用我操心，家里给我准备了。可他没说那笔钱现在拿不出来。去年他买了三十万宸直的产品，页面上写九月底到期。他一直说，到期以后给我添二十万办婚礼。我妈去问二十八万八的时候，没有把这件事告诉介绍人。
- `$case.sceneVersions[5].revisedVersion` ……整页我看见了。我妈说：“MBA 二十三万八都是他自己出的，彩礼先问二十八万八。”我爸紧接着说：“咱家宸直那三十万九月底到期，先别提，到时候再给她添。”这两句话挨在一起。我以前只把前一句当成替我争取。
- `$case.sceneVersions[5].casualQuestions[0].answer` 会。券怎么用、积分抵了多少、停车费怎么 AA，他都说得很清楚。我当时觉得这叫会过日子。
- `$case.sceneVersions[5].casualQuestions[1].answer` 见过。第一句问的是“个子多高”，第二句就是“做什么的”。
- `$case.sceneVersions[5].casualQuestions[2].answer` 就一句：『过了年你就 29 了，先别把人得罪死。』……这话她今年说了四回。我记着次数呢。你看，职业病。
- `$case.sceneVersions[5].questionOptions[0].answer` 我妈。她听说 MBA 二十三万八是他自己交的，就说他不可能没积蓄，彩礼不能比我表姐的十八万八还低。我没有让她去问，可我知道以后，也没有叫她收回来。
- `$case.sceneVersions[5].questionOptions[0].guardedAnswer` 我妈定的。介绍人只是把她的原话传了过去。
- `$case.sceneVersions[5].questionOptions[1].answer` 不能。三十万在宸直，页面写九月底到期。我爸说到时候给我二十万，剩下的留着养老。男方只知道我家会出钱，不知道这钱现在还动不了。
- `$case.sceneVersions[6].version` 我那时候已经认定他是在躲。工资账户结余二十八万六，只比彩礼少两千，我就觉得他说“拿不出”其实是“不想给”。直到刚才上麦，他才承认还有其他账户，只是不愿意交出来。我不知道那些账户里有多少。可他当时一句都没提，我和我妈就盯着这一个数字，真把它当成了他手里所有的钱。前几次吃饭，他会找团购、用积分，停车费还要跟我 AA。后来我连这些小钱都拿来怀疑他的收入。
- `$case.sceneVersions[6].casualQuestions[0].answer` 到现在都没回。我知道我爸妈答应的是二十万，可那笔钱最快也要等九月底。我怕一说，他就会觉得我们想拿他的彩礼先把婚礼办了。
- `$case.sceneVersions[6].casualQuestions[1].answer` 我表姐。管得挺好，但她挣得比姐夫多。多百分之三十几吧，具体没算过——不对，我算过。百分之三十七。你看，我就是这样的人。这话我没跟我妈说过。我们家饭桌上，账是不能上桌的。
- `$case.sceneVersions[6].casualQuestions[3].answer` 不知道。
- `$case.sceneVersions[6].questionOptions[0].answer` 因为我也动过那个念头：他既然能自己花二十三万八读 MBA，工资卡里又有二十八万六，也许这个数拿得出来。现在说出来很难听，可我当时确实这么算过。
- `$case.sceneVersions[6].questionOptions[0].guardedAnswer` 我没定那个数，但知道以后没有让她撤回。
- `$case.sceneVersions[6].questionOptions[1].answer` 不能。他可能只是会算钱。是我先怀疑他收入不稳，所以他连用团购、算停车费，我都往收入上猜。
- `$case.overnightStructure.callbackOpeners.两边的完整聊天.line` 我把介绍人两边的聊天都看完了。她替两边说过好话，也把我妈那句二十八万八原样转给了男方家。
- `$case.overnightStructure.callbackOpeners.她没核实的两句话.line` 我把介绍人没问过的几句话标出来了。她没看过男方工资，也没问我家现在能拿多少，就把二十八万八递了过去。
- `$case.overnightStructure.callbackOpeners.表姐门口口供.line` 表姐没让进门，只隔着防盗链说，男方家商量过发哪张卡，最后只挑了工资账户。她提醒过要说清范围，那句话没有跟着流水一起发出来。
- `$case.overnightStructure.callbackOpeners.双份材料圈注.line` 我重新看那两份材料，才发现自己一直在往一块儿算。看到二十三万八是他自己交的，我就觉得他肯定有钱；工资卡上又正好有二十八万六，我干脆把它当成了他的全部。
- `$case.overnightStructure.callbackOpeners.家里群原话.line` 家里群我重新从头看了。二十八万八后面，紧跟着就是我爸那句“宸直九月底到期”。
- `$case.overnightStructure.callbackOpeners.饭局停顿回放.line` 饭局那十几秒我又听了一遍。我问本科，他承认不是那所，又说二十三万八学费是自己交的。我当时已经不再想学历，开始想他是不是很有钱。
- `$case.overnightStructure.callbackFallback.line` 我回来了。二十八万八和宸直那三十万，我都愿意说。你白天查到什么了？
- `$case.overnightStructure.postures.againstCaller` 二十八万八是我妈定的，我知道以后没叫停。今晚我自己答。
- `$case.overnightStructure.postures.withCaller` 家里群我没删。彩礼和宸直那几句，你看到哪儿，就问到哪儿吧。
- `$case.nightStructure.returnStance.lines.defensive` 我差点没打回来。弹幕说我家问得太多，这话我听见了。群聊我带来了，你接着问吧。
- `$case.nightStructure.returnStance.lines.open` 我回来了。昨晚挂完电话，我又看了学校图，也去找了介绍人。今天都带来了。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。昨晚群里吵到很晚，我把那几张图又看了一遍。

### 终局

- `$case.deepFollowup.resistanceBeat.lines[0]` 我说自己的八万四，不等于他那张二十八万六就算答应彩礼吧？
- `$case.deepFollowup.answer` 唉。我一个月一万出头，现在自己存了八万四。真要结婚，我最多愿意拿六万，剩下的得留应急。我一直追着看他的二十八万六，却从来没把自己的八万四告诉他。

### 其他出声面

- `$case.careChoices[0].lines[0]` 带表……你不是让我别发后台吗。
- `$case.careChoices[0].lines[2]` ……嗯。
- `$case.careChoices[1].lines[0]` ……谢谢。这句，我妈应该听听。
- `$case.careChoices[2].lines[0]` 不带材料。
- `$case.careChoices[2].lines[2]` 好。我试试。
- `$case.overnightStructure.returnBeat.lines[0]` 楼上在打电钻。声音要是太大，你跟我说，我换个房间。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 等一下。那页群聊，是我表妹拍给你们的？
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 她拍我家的群。给一个直播间。
- `$case.overnightStructure.liveCounterBeats[0].lines[4]` 你们等我一下，我要先给她打个电话。
- `$case.overnightStructure.liveCounterBeats[0].choices[0].lines[0]` 先别停。你先撤，我把话说完。播完我再找她。
- `$case.overnightStructure.liveCounterBeats[0].choices[1].lines[0]` 先不打了。她多半跟我妈在一块儿，我现在打过去，最后还是我妈接。你先让我把这段说完。
- `$case.overnightStructure.liveCounterBeats[0].choices[2].lines[1]` 继续吧。截图先撤下来，别让弹幕再转。
- `$case.overnightStructure.liveCounterBeats[2].lines[0]` 我的工资我自己说，存款也由我说。家里群那几句可以念。可我问你要流水，你只发工资卡，没告诉我别的账户不在里面。
- `$case.overnightStructure.liveCounterBeats[3].lines[3]` 我也不想带着那笔还没到期的二十万去见你。

## 案三相亲对象

- **固定性格：** 受冒犯的条件维护者
- **受压反应：** 被质疑时按项目、学费和余额逐项举证；被问二十八万八时会把二十八万六说成自己的底线。
- **防御动作：** 用每个局部真实抵挡整体概括的问题。
- **知识边界：** 知道自己的项目、缴费、账户和家人整理材料过程；第二夜才从群聊得知女方父母的三十万元在宸直，不知道最终能否兑付。

### 夜 B

- `$case.sceneVersions[6].afterVersion.lines[0]` 你先说我拿不出是在骗你，又让我打流水。我发工资卡，是因为你问的是收入。其他账户是我的私事，我从来没答应全交给你。
- `$case.sceneVersions[6].afterVersion.lines[3]` 那她家呢？一开口二十八万八，自己准备给她多少？那三十万宸直，为什么现在才说？
- `$case.sceneVersions[6].sceneCloser.lines[3]` 你还给我做了张表？那四次吃饭，你当面什么也没说啊。

### 后台／材料回流

- `$case.respondentNote.text` 学校、MBA 缴费和那份工资账户流水是我自己发的，我同意你们照着问。其他账户我没给她，也不想拿到直播间晒。当时她问收入，我才给了工资卡；我没说清只有这一张，这点我认。可二十八万六不是我答应拿二十八万八。她家那三十万什么时候能取，也别再拿一句“到期就有”带过去。

### 其他出声面

- `$case.overnightStructure.liveCounterBeats[1].lines[1]` 我是她说的那个人。礼物你先收着——你们说了半天，我从头听到现在。我只想问一句：她家开口二十八万八的时候，有没有告诉她，那三十万还在宸直，眼下根本拿不出来？
- `$case.overnightStructure.liveCounterBeats[1].choices[0].lines[0]` 行。她手里那些材料，这几页可以：学校、学费、工资卡，还有彩礼那几句。其他账户不公开。她家的钱，也只说群里已经提过的。
- `$case.overnightStructure.liveCounterBeats[1].choices[1].lines[0]` 范围我打后台了。她已经拿到的学校图、学费单、工资卡，这几页可以；彩礼原话也能谈。其他账户不公开。她家的钱，只说群里那一句。
- `$case.overnightStructure.liveCounterBeats[1].choices[2].lines[0]` 可以，你先问她。我这边同意谈学校、学费、那张工资卡和彩礼，这几页可以。其他账户不公开。她家的钱也只念群里出现过的。
- `$case.overnightStructure.liveCounterBeats[2].lines[1]` 你妈一听 MBA 学费是我自己交的，转头就问二十八万八。我都说拿不出，你还非要查收入。我发工资卡怎么了？其他账户凭什么全交给你？
- `$case.overnightStructure.liveCounterBeats[3].lines[2]` 饭先不吃也好。我不想带着二十八万八去见人。

## 案三介绍人

- **固定性格：** 嘴快、怕砸媒人的热心撮合者
- **受压反应：** 越被两家围攻，越急着翻聊天记录；被问到依据时，先辩一句，再认自己没核实的具体话。
- **防御动作：** 先划掉不是自己说的那一句，再把没核实的话解释成“想让他们先见一面”。
- **知识边界：** 知道两家给她的条件、女方母亲的二十八万八和自己转述过的话；转达彩礼时不知道女方家的婚礼钱锁在宸直。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 你先看聊天。她妈妈现在一口一个我骗她，可“名校毕业”真不是我说的。我当时只说他学校不错。至于“收入挺稳”，是男方家先这么跟我讲的。
- `$case.overnightStructure.dayScenes[0].body.beats[2]` ……没见过。这个是我话说快了。可我也不是只替男方说话。
- `$case.overnightStructure.dayScenes[0].body.beats[4]` 我说她做审计，工作稳定，家里事少。男方家问她会不会嫌学历，我还说了句“她不太计较这个”。后来她妈妈听说 MBA 二十三万八是他自己交的，又让我去问二十八万八。我一个字没改，全转了。
- `$case.overnightStructure.dayScenes[0].body.beats[6]` 不知道。她妈妈只说家里不会亏待女儿。我今天看直播才知道，那笔钱还在宸直。早知道是这样，我至少会先问她一句：现在拿得出来吗？
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[1]` 行。“名校毕业”不是我说的，二十八万八也不是我定的；可我把两句话都递了出去，这个我认。
- `$case.overnightStructure.dayScenes[0].body.choice.options[1].resultBeats[1]` 对。我当时只想先把人约到桌上。现在桌还没坐下，钱先把两家掀了。

### 后台／材料回流

- `$case.investigationHooks[1].material` 介绍人留言：“‘收入稳’和‘她不太计较学历’，都是我没问本人就说的，我认。二十八万八不是我加的，是她妈妈听说 MBA 学费由他自己出以后，让我原话问男方家。我当时只想着先把两家约到桌上，没劝她把彩礼留到孩子们自己谈。”

### 其他出声面

- `$case.overnightStructure.liveCounterBeats[3].lines[0]` 男方家刚给我打电话，周末那顿饭不吃了。彩礼要多少、他愿意给多少，先让你们两个自己谈。两边家长都别再让我传。

## 案三男方表姐

- **固定性格：** 护家的感性防守者
- **受压反应：** 先拒答；确认只问资料整理后才给半句。
- **防御动作：** 使用‘大家一起整理’稀释主导者。
- **知识边界：** 知道资料如何整理，也知道 MBA 学费由男方本人承担；不知道收入构成，不知道女方家的宸直情况。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 先说好，他其他账户里有多少，我不知道。学费是他自己交的，回单他已经同意给你们看，别再问我为什么读。
- `$case.overnightStructure.dayScenes[1].body.beats[2]` 他在家里群问过该发哪张。姑姑说工资卡最规整，别的卡不用给。我还提醒过他，至少跟人家说清这只是工资账户。他最后只把这张发了，没带那句话。
- `$case.overnightStructure.dayScenes[1].body.beats[3]` 我能说的就这些。其他账户是什么、他愿意拿多少，你去问他，我不替他答。

## 赵律师

- **固定性格：** 锋利的理性派
- **受压反应：** 听见无证据定性会立刻打断，并补适用条件。
- **防御动作：** 短句、免责、拒猜动机。
- **知识边界：** 只解释法律与责任效果，不替案件当事人作证，不指点玩家圈哪一栏。

### 后台／材料回流

- `$case.delegation.outcomes.zhao-lawyer.text` MBA 说成“名校毕业”，单看这句话，不能直接推出骗婚。婚姻登记也不会替两个人核学历。真要谈责任，先把谁说过哪句、有没有因此发生财产处分留好。

## 周会计

- **固定性格：** 冷静的数字理性派
- **受压反应：** 删掉形容词，只报金额、时间和路径。
- **防御动作：** 按日期排列，拒绝替数字添故事。
- **知识边界：** 只读材料中已经出现的账目与流程，不认定未知付款人身份。

### 后台／材料回流

- `$case.delegation.outcomes.zhou-accountant.text` 工资账户流水只到这个月。真要看稳不稳，就看连续几个月的工资到账；真要看全部家底，这一张卡更不够。

## 小林老师

- **固定性格：** 热络的感性现实派
- **受压反应：** 先替行业解释一句，再把行话翻成人话。
- **防御动作：** 笑着纠偏，拆一次话术就补一次行业辩护。
- **知识边界：** 只解释婚恋行业话术和流程，不知道本案人物私下做过什么。

### 后台／材料回流

- `$case.advisorNotes[0].text` 我做婚介的，最怕两家隔着中间人传彩礼数字。你们俩要是还想往下谈，就自己见面，把能拿多少说清楚。家里答应的那份什么时候到，也别含糊。
- `$case.delegation.outcomes.lin-matchmaker.text` “名校毕业”不是材料上的原话。介绍人只说学校好，她回家又顺成了名校毕业。每个人都往好听里加了一点，饭局真问本科，差别就出来了。

## 张法医

- **固定性格：** 技术洁癖型理性派
- **受压反应：** 碰到来源不全的材料会停止讨论结论。
- **防御动作：** 先查链条，再谈内容。
- **知识边界：** 只判断证据链与技术可检验性，不认定关系或动机。

### 收麦幕间

- `$case.nightStructure.interlude.actions[0].script.reply` 不能。图有没有改，我已经答了。这个项目到底算什么学历，让他们自己去学信网查。别拿一张复印件让我替人作证。……行了，今天真收了。我家那位喊我对发票呢。你说这日子。

### 后台／材料回流

- `$case.delegation.outcomes.zhang-forensic.text` 哥们的忙照帮，检测费照记。图没改过，这一点她验对了。可我的鉴定书只写图片本身。项目算什么学历，去学信网查；他拿图跟别人怎么说，问当事人。学历和说法，我都不签。

## V哥

- **固定性格：** 沉着的直觉教练
- **受压反应：** 玩家越急，他越让人停一下，只比较两件已知事物。
- **防御动作：** 短句，先停，再分开看。
- **知识边界：** 只知道玩家当前已经听见或看见的内容。

### 夜 A

- `$case.sceneVersions[0].helperHint` 她不信男方说拿不出，男方又只交工资账户。先分开问：为什么不信，以及这一张卡能不能代表全部账户。
- `$case.sceneVersions[1].helperHint` 停顿本身不是答案。你要找的是她在那十几秒后有没有把本科问到底。
- `$case.sceneVersions[2].helperHint` 父母把学费当家底的原因已经问出来。现在要看的是，她知道二十八万八怎么来的以后做了什么。
- `$case.sceneVersions[3].helperHint` 先分清谁定数字、谁传话。再问自费读书为什么会被当成现成的彩礼钱。
- `$case.sceneVersions[4].helperHint` 先别算家底。问问她，那张学校图里到底有没有本科。

### 夜 B

- `$case.sceneVersions[5].helperHint` 把“一张工资卡里有钱”和“全部账户有多少”分开，也把“持有一笔理财”和“现在能拿出来”分开。
- `$case.sceneVersions[6].helperHint` 不要只算两千元差额。先让两边各说清：现在能拿多少，未来可能有多少，分别是谁的钱。

# 职场报销截图

## 林旭阳

- **固定性格：** 温热而克制
- **受压反应：** 担心误判时先缩短句子，把混在一起的事实拆开。
- **防御动作：** 把感情和判决分开，用小而合法的试探代替情绪宣判。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 夜 A

- `$case.openingDialogue[1]` 先别急着往上报。我先听听，这六万八是怎么刷到你卡上的。
- `$case.openingDialogue[2]` 是谁让你垫的，他当时答应走什么流程？
- `$case.nightStructure.hangup.hostLine` 去问清楚。明晚打回来，拿不到回单号就直接说拿不到，别再拿这张图当钱到账。
- `$case.sceneVersions[0].entryQuestion` 你当时为什么答应先垫？
- `$case.sceneVersions[0].casualQuestions[0].question` 你主动说能接，是在群里说的，还是当面说的？
- `$case.sceneVersions[0].casualQuestions[1].question` 那张“早点回”的便利贴，你现在还留着？
- `$case.sceneVersions[0].questionOptions[0].question` 他那条私聊，是先说让你负责这次活动，还是先说要你垫钱？
- `$case.sceneVersions[0].questionOptions[1].question` 你答应先垫时，有没有问这钱最后谁来还？
- `$case.sceneVersions[1].entryQuestion` 公开流程里是怎么写的？
- `$case.sceneVersions[1].casualQuestions[0].question` 大群里一般谁管预算？
- `$case.sceneVersions[1].casualQuestions[1].question` 你当时看懂那张流程表了吗？
- `$case.sceneVersions[1].questionOptions[0].question` 流程表就在群里，你为什么不问预算？
- `$case.sceneVersions[1].questionOptions[1].question` 你以为谁会替你报备？
- `$case.sceneVersions[2].entryQuestion` 他私下又是怎么说的？
- `$case.sceneVersions[2].casualQuestions[0].question` 那条私聊你留着吗？
- `$case.sceneVersions[2].casualQuestions[1].question` 他当时提过财务延后吗？
- `$case.sceneVersions[2].questionOptions[0].question` 你看到哪句话以后，没再回大群？
- `$case.sceneVersions[2].questionOptions[1].question` 你当时真在群里问一句预算，老板就会不让你负责这个活动吗？
- `$case.sceneVersions[3].entryQuestion` 这六万八刷出去以后，他拿什么让你继续等？
- `$case.sceneVersions[3].casualQuestions[0].question` 信用卡账单出来以后，你准备怎么还？
- `$case.sceneVersions[3].casualQuestions[1].question` 财务那边你认识人吗？
- `$case.sceneVersions[3].casualQuestions[2].question` 你以前用个人信用卡垫过公司的钱吗？
- `$case.sceneVersions[3].questionOptions[0].question` 这张图除了“审批通过”，有没有写什么时候付款？
- `$case.sceneVersions[3].questionOptions[1].question` 他每次把这张图发回来，有没有说过具体哪天到账？

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[1]` 对方把同一页发了三次。
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[0]` 那我回去只问回单号。
- `$case.overnightStructure.dayScenes[0].body.choice.options[1].resultBeats[0]` 回单号、账户后四位我都没有，窗口不给查。我只拿到一张拒查记录。
- `$case.overnightStructure.dayScenes[1].body.beats[1]` 这张单上的对接人还是那位同事？
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[0]` 我把对接栏拍下来。账户那部分不在这张单上。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[0]` 那我把语音原句带回去：“按老规矩返给对接人。”
- `$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[1]` 明白。我把三页原样拍下来，不往里补付款。
- `$case.overnightStructure.dayScenes[2].body.choice.options[1].resultBeats[1]` 那我把缺的这句拍下来，别的回去再问。

### 夜 B

- `$case.sceneVersions[4].beforeVersion.lines[1]` ……没事，洒台本上了。你接着说。
- `$case.sceneVersions[5].beforeVersion.lines[3]` 后来公司有人公开提过这次活动吗？
- `$case.sceneVersions[6].sceneCloser.lines[0]` 我听明白了。你先——
- `$case.sceneVersions[6].sceneCloser.lines[6]` 难怪你气到现在。
- `$case.overnightStructure.callbackOpeners.她整理的报销时间线.firstConflict.hostLine` 先看十四点二十二分。财务那时还没说延后，他让你别问，你怎么回的？
- `$case.overnightStructure.callbackOpeners.财务窗口回单要求.firstConflict.hostLine` 三次问到账，只换回同一张图。第三次看到它，你为什么没再追问钱到底什么时候到？
- `$case.overnightStructure.callbackOpeners.财务窗口账户拒查.firstConflict.hostLine` 财务没替你查，不等于谁收了钱。你手里还缺什么？
- `$case.overnightStructure.callbackOpeners.供应商对接补话.firstConflict.hostLine` 你原样念。哪个词让你最不敢往下猜？
- `$case.overnightStructure.callbackOpeners.供应商对接人栏.firstConflict.hostLine` 名字在，对账的东西不在。你今晚要他补哪一张？
- `$case.overnightStructure.callbackOpeners.茶水间回单缺口.firstConflict.hostLine` 这三页都没有日期。那之前，有没有谁答应过具体哪天还？
- `$case.overnightStructure.callbackOpeners.茶水间责任对照.firstConflict.hostLine` 活动总结写了你负责。有没有人书面写过谁负责催付款？
- `$case.overnightStructure.callbackOpeners.赵律师边界框架.firstConflict.hostLine` 六万八还在你卡上。你为什么一直没让他把“公司会返”写清楚？
- `$case.overnightStructure.callbackOpeners.周会计钱路框架.firstConflict.hostLine` 下一次他再发审批图，你回哪一句？
- `$case.overnightStructure.callbackOpeners.扛活还是扛钱.firstConflict.hostLine` 现在你愿意认哪一件？
- `$case.overnightStructure.callbackOpeners.预算时间线复核.firstConflict.hostLine` 他当时拿什么让你别在群里问？
- `$case.overnightStructure.callbackOpeners.领导批注.firstConflict.hostLine` 那句夸奖落下来时，你有没有问六万八什么时候回？
- `$case.overnightStructure.callbackOpeners.顾问回单.firstConflict.hostLine` 顾问只肯确认审批过了。没有付款回单，你现在还觉得钱已经在走吗？
- `$case.overnightStructure.callbackOpeners.垫款回放.firstConflict.hostLine` 你说“我来扛”时，六万八还没出现。那四个字，当时指的是把活接下来吗？
- `$case.sceneVersions[4].casualQuestions[0].question` 服务协调费，行价一般多少？
- `$case.sceneVersions[4].casualQuestions[1].question` 供应商是谁选的？
- `$case.sceneVersions[4].casualQuestions[2].question` 家里知道吗？
- `$case.sceneVersions[4].questionOptions[0].question` 这张单只写了他是对接人。最后收钱的账户，单上有吗？
- `$case.sceneVersions[4].questionOptions[1].question` 他说这是正常费用。你查过这项收费本身吗？
- `$case.sceneVersions[5].casualQuestions[0].question` 领导当场知道你刷了个人卡吗？
- `$case.sceneVersions[5].casualQuestions[1].question` 那句老规矩是谁先接的话？
- `$case.sceneVersions[5].casualQuestions[2].question` 红包发完以后，他单独回你了吗？
- `$case.sceneVersions[5].questionOptions[0].question` 领导那句里，提没提这六万八什么时候还？
- `$case.sceneVersions[5].questionOptions[1].question` 被点名以后，你为什么又等了一天？
- `$case.sceneVersions[6].entryQuestion` 他们发来让你确认的那张表，最后怎么写的？
- `$case.sceneVersions[6].casualQuestions[0].question` 这份活动总结是谁写的？
- `$case.sceneVersions[6].casualQuestions[1].question` 如果重来一次，你还接这个活吗？
- `$case.sceneVersions[6].questionOptions[0].question` 这张表一确认，活动要是出了问题，公司先找谁？
- `$case.sceneVersions[6].questionOptions[1].question` 你想过在那张表里加一句“个人垫款还没返”吗？

### 终局

- `$case.deepFollowup.resistanceBeat.lines[1]` 是，我不在你公司，后果不是我扛。你自己决定。
- `$case.hostDisclosure.text` 刚才一听见“老规矩”，我先冒火了。等我喝口水。
- `$case.deepFollowup.question` 这六万八是你替公司垫的钱，到现在还没报销。那张表下周一开会前就得确认，你准备把这句话发进群里吗？
- `$case.stageJudgement` 你当时想接这次活动，也确实回过“我来扛”。他给你留过“早点回”的便利贴；这一次，四十三页 PPT 是你熬的，他只改了字体。六万八还在你卡上，也没有回单。明天先在群里写清这笔钱是谁垫的，再要付款凭证。供应商的返款，等收款账户出来再说。

### 其他出声面

- `$case.careChoices[0].hostLine` 明天到公司，把“六万八是我个人垫的，到现在没回来”发进群。有人问，你就照实说。
- `$case.careChoices[1].hostLine` 想让老板看见你没错。别因为想出头，就把六万八也一起忍了。
- `$case.careChoices[2].hostLine` 下周一开会前，你要是又想把那句话删掉，就打过来。
- `$case.overnightStructure.liveCounterBeats[1].lines[1]` 他说等月底一起办报销。可你刚才说，下周一开会前，那张活动总结表就得确认。

## 案四咨询者·陈

- **固定性格：** 想证明能扛事的焦虑新人
- **受压反应：** 害怕时句子越来越短；复述公司话时给流程词加引号。
- **防御动作：** 把主动承担说成‘让我垫’，用流程词遮住个人选择。
- **知识边界：** 知道自己参与的项目、私聊、垫款和收到的截图，不知道返点最终归属。

### 夜 A

- `$case.openingDialogue[0]` 六万八，刷的我自己的信用卡。活动早办完了，公司一分钱没还。主播，我现在往上报，老板会不会不让我继续负责这个活动了？
- `$case.openingDialogue[3]` 一个同事私聊我，说今天来不及走流程，让我先垫上。他说报销很快就能批，还说活动总结会在“执行主责”那一栏写我的名字。
- `$case.sceneVersions[0].casualQuestions[1].lines[0]` 留着，夹在工牌套后面。我那时候觉得，他是少数会看见我加班的人。
- `$case.sceneVersions[0].casualQuestions[1].lines[2]` 后来他让我别去群里问预算，我也更愿意信他会补流程。
- `$case.sceneVersions[0].sceneCloser.lines[0]` 呃，我先把工牌摘了，硌得慌。……嗯，没事了。
- `$case.sceneVersions[2].sceneCloser.lines[0]` 等我一下，我妈敲门问我跟谁打电话。……说是同学。继续。
- `$case.sceneVersions[3].casualQuestions[2].lines[0]` 没有。以前最多垫过打车，第二天就能报。
- `$case.sceneVersions[3].casualQuestions[2].lines[2]` 六万八，是第一次。
- `$case.nightStructure.hangup` 这页下面是空的。我明天去问财务。六万八刷出去的时候，我一直跟自己说“先垫一下”。现在账单出来了，哪有这么轻。
- `$case.sceneVersions[0].version` 我前面刚在小会上说过，这活我能接。入职八个月，转正才两个月，我当然想让老板看见我。那位同事平时也挺会照顾人，有回我加班到十点，他给我留了盏灯，桌上贴着“早点回”。后来他私聊：“你先把场地和礼品费垫了。活动总结的‘执行主责’一栏，可以写你的名字。”我几乎马上就回了。那时候我是真想让老板把这次活动交给我。
- `$case.sceneVersions[0].casualQuestions[0].answer` 部门小会上说的，老板也在。我说这活我能接。
- `$case.sceneVersions[0].questionOptions[0].answer` 先说垫钱，后面才说活动总结会在“执行主责”那一栏写我的名字。可我当时就盯着“执行主责”那四个字，钱的事反倒没细问。
- `$case.sceneVersions[0].questionOptions[0].guardedAnswer` 先说垫钱。后面那句“执行主责”，我听进去了。
- `$case.sceneVersions[0].questionOptions[1].answer` 没有。他说活动后补流程，我回了句：“我来扛。”我怕刚说完能接活，转头就问钱怎么还，别人会觉得我只惦记钱。
- `$case.sceneVersions[1].version` 活动前一天，14：05，部门助理在大群发了张流程表。我点开过：预算先填金额，供应商走对公；真要个人垫，得提前报备。群里很快刷了一串“收到”。我也跟着回了一个。可场地和礼品那边一直催，我没在群里问预算。
- `$case.sceneVersions[1].casualQuestions[0].answer` 部门助理发流程，财务出数。以前都这么走，就这次说来不及。
- `$case.sceneVersions[1].casualQuestions[1].answer` 看懂了大概。预算、审批、对公付款这些字都在，只是我当时觉得自己刚接活，先别显得太麻烦。
- `$case.sceneVersions[1].questionOptions[0].answer` 我刚在小会上拍过胸口，说这活我能做。转头就在群里问预算，我怕人家觉得我连流程都没弄懂，就想着先等他私下把数发我。
- `$case.sceneVersions[1].questionOptions[0].guardedAnswer` 看见了，没问。活动刚交给我，我不想开口第一句就问预算。
- `$case.sceneVersions[1].questionOptions[1].answer` 我以为是他。供应商是他找的，预算也在他手里。我想着自己先刷，回头他会补。现在去翻群，我一句都没留。
- `$case.sceneVersions[2].version` 我后来才注意到，只隔了十七分钟。14：22，他私聊我：“先别在大群问预算了，今天来不及。活动结束再补报备。这次活动刚交给你，别让领导觉得你不担事。”我看到“不担事”，就把群关了。九天后财务真发了延后通知，我还拿那条通知劝自己：你看，他没骗你，财务确实慢。
- `$case.sceneVersions[2].revisedVersion` 时间我改口。两点二十二，是他说来不及。财务九天后才通知延后。财务那时候还没发通知，可我已经听他的话，没在群里问了。
- `$case.sceneVersions[2].casualQuestions[0].answer` 留着。我之前不敢拿出来，是因为里面也有我自己说“我来扛”。
- `$case.sceneVersions[2].casualQuestions[1].answer` 没有。他那天只说来不及、别问。财务延后通知是后面才发的。
- `$case.sceneVersions[2].questionOptions[0].answer` “这次活动刚交给你，别让领导觉得你不担事。”我怕老板觉得我推活，也怕别人看出我不熟，就真没在群里问。
- `$case.sceneVersions[2].questionOptions[0].guardedAnswer` 他说别让领导觉得我不担事。我就没问。
- `$case.sceneVersions[2].questionOptions[1].answer` 不会吧。最多有人觉得我流程不熟，难看一会儿。可我那时候连这一会儿都不想难看。
- `$case.sceneVersions[3].version` 活动后，他发来一张审批页，抬头是“报销审批通过”。我问什么时候回来，他又发一次。第二天再问，还是它。一共三次。每张下面都是“流程在走”。我在相册里来回滑，跟没动一样。
- `$case.sceneVersions[3].casualQuestions[0].answer` 我还没想好。手头的钱不够一次还清，又不想做最低还款，所以才越来越慌。
- `$case.sceneVersions[3].casualQuestions[1].answer` 不认识。入职培训见过一面。真要问，也得同事引荐，又绕回他。
- `$case.sceneVersions[3].questionOptions[0].answer` 没有。我其实只看得懂“审批通过”四个字，付款时间和回单号都没看见。你们直接看图吧，我怕自己又把它想多了。
- `$case.sceneVersions[3].questionOptions[0].guardedAnswer` 没有。图上只写了审批通过。
- `$case.sceneVersions[3].questionOptions[1].answer` 没有。每次都是“流程在走”。后来财务又说延后，我就把两边的话拼到一起，觉得钱早晚会来。

### 夜 B

- `$case.sceneVersions[4].casualQuestions[2].lines[0]` 我妈知道个大概。她说：『垫就垫了，就当买个教训，别跟领导闹。』
- `$case.sceneVersions[4].casualQuestions[2].lines[2]` 呃，六万八的教训。我们家，教训真贵。
- `$case.sceneVersions[5].beforeVersion.lines[0]` 今晚他在群里发了二十个红包，一共十六块八，配文『辛苦大家』。
- `$case.sceneVersions[5].beforeVersion.lines[2]` 抢到最大那个的是老板。一块九。
- `$case.sceneVersions[6].sceneCloser.lines[1]` 等下，还有个特小的事。
- `$case.sceneVersions[6].sceneCloser.lines[3]` 活动总结的 PPT 是我熬的，四十……呃，四十三页，我数过。他把关，就是改了个字体。
- `$case.sceneVersions[6].sceneCloser.lines[5]` 署名页，把关人排我前面。字体啊！就改了个字体！
- `$case.overnightStructure.callbackOpeners.她整理的报销时间线.firstConflict.callerLine` 我回“我来扛”。他让我别问，我也真没问。
- `$case.overnightStructure.callbackOpeners.财务窗口回单要求.firstConflict.callerLine` 第三次……我把图存进了相册。存完，就当问过了。
- `$case.overnightStructure.callbackOpeners.财务窗口账户拒查.firstConflict.callerLine` 回单号，或者收款账户。都没有。
- `$case.overnightStructure.callbackOpeners.供应商对接补话.firstConflict.callerLine` ‘对接人’。单上写的是他，可账户没写。
- `$case.overnightStructure.callbackOpeners.供应商对接人栏.firstConflict.callerLine` 供应商付款确认。上面得有收款账户。
- `$case.overnightStructure.callbackOpeners.茶水间回单缺口.firstConflict.callerLine` 没人。每次我问，话就绕回这次活动是我自己要接的。
- `$case.overnightStructure.callbackOpeners.茶水间责任对照.firstConflict.callerLine` 没有。负责人的位置有我的名字，催款的人没写。
- `$case.overnightStructure.callbackOpeners.赵律师边界框架.firstConflict.callerLine` 老板刚把活动交给我，我怕别人说我只盯着钱。
- `$case.overnightStructure.callbackOpeners.周会计钱路框架.firstConflict.callerLine` 回单号给我。别的先不聊。
- `$case.overnightStructure.callbackOpeners.扛活还是扛钱.firstConflict.callerLine` 活动我认。六万八不是我该替公司出的。
- `$case.overnightStructure.callbackOpeners.预算时间线复核.firstConflict.callerLine` 就说来不及，还说别让领导觉得我不担事。财务慢，是我后来替他补的。
- `$case.overnightStructure.callbackOpeners.领导批注.firstConflict.callerLine` 没有。我先截图发给朋友了。
- `$case.overnightStructure.callbackOpeners.顾问回单.firstConflict.callerLine` 不觉得。没有回单，我就说没有。
- `$case.overnightStructure.callbackOpeners.垫款回放.firstConflict.callerLine` 是。我接的是活。六万八算不算进去，我当时没敢问。
- `$case.sceneVersions[4].version` 我今天下午才拿到供应商报价单。礼品下面多了一项“服务协调费”。我问他这是什么，他说正常费用。可那行备注还有一句：“按老规矩返给对接人。”我再往旁边看，对接人写的是他。后面的付款页，我没拿到。
- `$case.sceneVersions[4].casualQuestions[0].answer` 我查过。有的有，有的没有，查完更乱了。
- `$case.sceneVersions[4].casualQuestions[1].answer` 他定的，说合作过。我连对接人微信都没有。
- `$case.sceneVersions[4].questionOptions[0].answer` 没有。单上只写他是对接人，最后进哪个账户没写。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 没有。它只写到对接人，账户没写。
- `$case.sceneVersions[4].questionOptions[1].answer` 查过。有的单子有，有的没有。光看“服务协调费”，定不了谁拿了钱。
- `$case.sceneVersions[5].version` 活动结束以后，部门开了个小会。领导当众说：“客户反馈不错，执行主责记陈；流程按老规矩补齐。”我一听见自己的姓，马上截了图发给朋友，后半句根本没细看。今天再往前翻，14：05 那张流程表还在，我回的“收到”也还在。
- `$case.sceneVersions[5].revisedVersion` 我把批注放大了。“执行主责”那一栏写的是我，可付款那一栏空着。……下周一开会前，这张表就得确认。可这张表就算确认了，六万八还是挂在我的信用卡账单上。
- `$case.sceneVersions[5].casualQuestions[0].answer` 我不确定。会上没人说“个人卡”三个字。说的都是执行效率、客户反馈。
- `$case.sceneVersions[5].casualQuestions[1].answer` 他接得最快，说会补齐。后来我才发现，补齐这两个字也要经过他。
- `$case.sceneVersions[5].casualQuestions[2].answer` 没有。群里发完，他就没再找我。
- `$case.sceneVersions[5].questionOptions[0].answer` 没提。谁来还、哪天还，都没说。我当时只顾着截自己的名字。
- `$case.sceneVersions[5].questionOptions[0].guardedAnswer` 写了我负责。钱怎么回，没写。
- `$case.sceneVersions[5].questionOptions[1].answer` 因为我高兴。可一开口追钱，大家先问的就是我为什么没报备。活动刚交给我，我就没按规定报备，太难看。我就又拖了一天。
- `$case.sceneVersions[6].version` 活动总结表发来让我确认。执行主责那格是我，付款对接人写的是他，供应商确认人还是他。我盯着这三格看了半天。下周一开会前就得点确认，我现在还没点。
- `$case.sceneVersions[6].casualQuestions[0].answer` 我写初稿。写到凌晨两点多，呃，写完还挺兴奋的，给我妈发消息，说老板第一次让我独立负责这么大的活动。她第二天早上回了个大拇指。后来他拿去把关，改了什么，我当时没细看。
- `$case.sceneVersions[6].casualQuestions[1].answer` 接。但会先在群里问一句预算。就一句，够了。
- `$case.sceneVersions[6].questionOptions[0].answer` 先找我，因为那张表的“执行主责”一栏写的是我。可我要催付款，还得找他。
- `$case.sceneVersions[6].questionOptions[0].guardedAnswer` 先找我。表上写的是我负责。
- `$case.sceneVersions[6].questionOptions[1].answer` 想过。可一加，别人先问的就是我为什么私下垫钱。写上去，我先挨问；不写，卡账单还是我的。
- `$case.overnightStructure.callbackOpeners.她整理的报销时间线.line` 我把群聊按时间重新翻了一遍。14：05 助理发流程，14：22 他就让我别在群里问。财务说延后，是九天以后。
- `$case.overnightStructure.callbackOpeners.财务窗口回单要求.line` 财务窗口问我回单号。我张不开口。三张一模一样的审批图，回单号一张都没有。
- `$case.overnightStructure.callbackOpeners.财务窗口账户拒查.line` 窗口不肯查账户。说我没有回单号，也没有账户后四位。那扇窗一关，我差点又想怪财务。
- `$case.overnightStructure.callbackOpeners.供应商对接补话.line` 供应商那句语音很短：‘按老规矩返给对接人。’就这一句。账户没说，我不往后接。
- `$case.overnightStructure.callbackOpeners.供应商对接人栏.line` 报价单的对接栏写他。翻到付款那页，没有收款账户。我盯着那个名字看了半天，还是不敢把两处接上。
- `$case.overnightStructure.callbackOpeners.茶水间回单缺口.line` 助理把三页摊在桌上。私聊叫我别问预算，领导批注只写了我负责，审批页还是停在“通过”。我当时有点想笑——哪一页都没说钱什么时候回。
- `$case.overnightStructure.callbackOpeners.茶水间责任对照.line` 私聊让我别问预算，领导后来只写了我负责。我来回看了几遍，也没找到谁负责催付款。
- `$case.overnightStructure.callbackOpeners.赵律师边界框架.line` 赵律师让我先把公司名遮住，又问私聊和刷卡记录还在不在。都在。她再问：公司会返这六万八，谁写过？没人。
- `$case.overnightStructure.callbackOpeners.周会计钱路框架.line` 周会计只问回单号。我报不出来。审批图倒有三张，像复制粘贴。
- `$case.overnightStructure.callbackOpeners.扛活还是扛钱.line` 小林老师翻到我那句“我来扛”，问我说的是活动，还是那六万八。我卡了半天，一个字都没回。
- `$case.overnightStructure.callbackOpeners.预算时间线复核.line` 我把那几天的消息重新翻了一遍。他让我别在群里问预算的时候，财务根本没发延后通知。昨晚我还拿后面那张通知替他解释。
- `$case.overnightStructure.callbackOpeners.领导批注.line` 领导那条批注，我又看了。只写了我负责，一个钱字都没有。我当时高兴，是真的。账也还在。
- `$case.overnightStructure.callbackOpeners.顾问回单.line` 顾问问我回单在哪儿。我拿不出来。那张图，他只认审批过了，再往下一个字也没说。
- `$case.overnightStructure.callbackOpeners.垫款回放.line` 那句私聊我重新放了。‘你先把场地和礼品费垫了。活动总结的“执行主责”一栏，可以写你的名字。’钱在前，“执行主责”在后。可我当时就盯着后面那四个字，马上回了“我来扛”。
- `$case.overnightStructure.callbackFallback.line` 我回来了。新批注还在手机里。你白天先看了哪份材料？
- `$case.overnightStructure.postures.againstCaller` 这次活动是我先争取的，“我来扛”也是我回的。我认。可钱还是没回来。
- `$case.overnightStructure.postures.withCaller` 那三张审批图我都留着。你先问吧，我不躲了。
- `$case.nightStructure.returnStance.lines.defensive` 我差点没敢再打。弹幕说得也没错，这次活动是我自己想接的。可那六万八不能就这么算了。
- `$case.nightStructure.returnStance.lines.open` 我回来了。白天我问了财务。那三张图，我现在不敢当成钱了。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。新批注还在手机里，那张审批图也还在。少的东西还是没拿到。

### 终局

- `$case.deepFollowup.resistanceBeat.lines[0]` 你说得轻。我往群里一发，下周一开会，领导第一个问的一定是我，不是他。
- `$case.deepFollowup.answer` ……发。这个活动我还想继续负责，可这句话也得写。再不写，月底信用卡只会找我。

### 其他出声面

- `$case.careChoices[0].lines[0]` ……呃，行。我明天早点去。
- `$case.careChoices[1].lines[0]` ……嗯。
- `$case.careChoices[1].lines[2]` 我就是怕一说钱，别人觉得我不配负责这么大的活动。
- `$case.careChoices[2].lines[0]` 你还真知道我会删。
- `$case.careChoices[2].lines[2]` 你们也早点睡吧。
- `$case.overnightStructure.returnBeat.lines[0]` 我这边空调滴水，滴在纸箱上，咚，咚的。你听见了别管。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 弹幕里有人说我蠢。我看见了。
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 我知道你们会觉得，六万八怎么能就这么刷出去。可他当时说会在活动总结里写我负责，我脑子里就只剩这句话了。
- `$case.overnightStructure.liveCounterBeats[0].lines[4]` 现在回头看，我也想骂我自己。
- `$case.overnightStructure.liveCounterBeats[0].choices[0].lines[0]` ……好。
- `$case.overnightStructure.liveCounterBeats[0].choices[1].lines[0]` ……嗯。对账。
- `$case.overnightStructure.liveCounterBeats[0].choices[2].lines[1]` ……行。
- `$case.overnightStructure.liveCounterBeats[0].choices[2].lines[3]` 行，继续。
- `$case.overnightStructure.liveCounterBeats[1].lines[0]` 他在大群发了：“陈先垫的六万八，等月底财务集中报销时一起办，大家辛苦。”我把这句来回看了两遍。一起办，是月底提交，还是月底打钱？他还是没说。

## 案四同事

- **固定性格：** 圆滑的责任切割者
- **受压反应：** 被问到账和署名时把主责拆成执行主责与流程把关。
- **防御动作：** 只回答眼前被问到的那一步，随后把选择说成咨询者自愿，把延迟推给财务。
- **知识边界：** 知道自己发出的私聊、审批和署名安排；未有材料时不替财务或返点账户作证。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[0]` 审批过了，别再往大群里问。

### 后台／材料回流

- `$case.respondentNote.text` 六万八我没不认。财务月底处理这批报销，她那笔也会一起办。这次活动是她自己在会上争着要负责的，她也回过“我来扛”，现在不能全说成我逼她。审批已经过了，财务慢我能怎么办？供应商那边是他们自己的老规矩，我没拿她垫的钱。

## 案四财务经办

- **固定性格：** 冷静的程序理性派
- **受压反应：** 争执越大越只报节点和缺件。
- **防御动作：** 不给评价，只列系统状态。
- **知识边界：** 只知道财务系统与经办材料，不知道私聊动机和返点归属。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 这页只写着审批通过。真付了，就让他们报回单号；报不出，再问收款账户后四位。
- `$case.overnightStructure.dayScenes[0].body.beats[2]` 发十次也没用。你先问回单号；真有回单，再看收款账户。
- `$case.overnightStructure.dayScenes[0].body.beats[3]` 没回单号，先别报付款。下一位。
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[1]` 对。问不到就说问不到，别自己写成没付。
- `$case.overnightStructure.dayScenes[0].body.choice.options[1].resultBeats[1]` 材料不够，别拿它猜收款人。

## 案四供应商项目员

- **固定性格：** 谨慎的中立执行者
- **受压反应：** 问题越敏感越退回对公记录。
- **防御动作：** 只确认本方收款与联系人。
- **知识边界：** 只知道供应商一侧的联系人、交付和收款记录。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 那段工作语音我可以再放一遍，原话就是：服务协调费按老规矩返给对接人。
- `$case.overnightStructure.dayScenes[1].body.beats[2]` 单上对接人写的是他。账户我没经手，这句你别让我接。
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[1]` 拍吧。账户不在这张单上。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[1]` 原话带走。至于账户，得去问收款那边。

### 后台／材料回流

- `$case.investigationHooks[2].material` 供应商说“服务协调费按老规矩返给对接人”。同一张表里，对接人还是那位同事，付款确认页没有发给咨询者。

## 案四仓库管理员

- **固定性格：** 朴实的记录主义者
- **受压反应：** 只让人翻页、对日期，不接关系判断。
- **防御动作：** 认单、认页、不认口头身份。
- **知识边界：** 只知道仓库收货、出入库单与日期。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[3]` 协调费我这儿不管，公司报销我也看不见。你要找这两样，别在仓库找。

## 案四部门助理

- **固定性格：** 规则型自保者
- **受压反应：** 逐字复述模板，不评价任何私聊。
- **防御动作：** 只给群模板与样本，拒绝解释人的意思。
- **知识边界：** 只知道公开群流程与样本，不知道私聊和钱的去向。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[1]` 领导批注我只核过这一句：执行主责记陈，流程按老规矩补齐。
- `$case.overnightStructure.dayScenes[2].body.beats[2]` 审批页只写到通过。那句私聊不是我发的，你别问我是什么意思。
- `$case.overnightStructure.dayScenes[2].body.beats[3]` 流程表我那天在群里发过。个人垫付要先报备，供应商优先走对公。
- `$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[0]` 这三页我都翻过了，确实没有回单号。别的你别问我，我也不知道。
- `$case.overnightStructure.dayScenes[2].body.choice.options[1].resultBeats[0]` 私聊让她别问预算，领导后来只写了她负责活动。谁负责催付款，我这儿没看到。

### 后台／材料回流

- `$case.investigationHooks[0].material` 部门助理补充：正常客户活动单先由执行人填预算，个人垫付需要提前报备，供应商付款优先走对公。她说“我只按模板发流程，不判断谁私下说了什么”。

## 案四领导

- **固定性格：** 冷硬的结果主义者
- **受压反应：** 出现流程事故时，只催项目交付和活动总结。
- **防御动作：** 把旧规矩当执行细节，只认结果和汇报。
- **知识边界：** 知道活动总结与署名，不知道垫款金额、付款账户和返点归属。

### 收麦幕间

- `$case.nightStructure.interlude.actions[2].text` 下周一照常开季度总结会，负责人就按现在这份名单写。你们没报备的那几项，开会前自己补上。

### 后台／材料回流

- `$case.investigationHooks[1].material` 领导批注：“客户反馈不错，执行主责记陈；流程按老规矩补齐。别让这点流程问题影响部门这季度的成绩。”批注里没有垫款金额、付款账户、供应商对接人。

## 赵律师

- **固定性格：** 锋利的理性派
- **受压反应：** 听见无证据定性会立刻打断，并补适用条件。
- **防御动作：** 短句、免责、拒猜动机。
- **知识边界：** 只解释法律与责任效果，不替案件当事人作证，不指点玩家圈哪一栏。

### 收麦幕间

- `$case.nightStructure.interlude.actions[1].options[0].advisorLine` 公司名先遮住。私聊和刷卡记录都留好。至于返款给了谁，现在这些东西还不够。

### 后台／材料回流

- `$case.delegation.outcomes.zhao-lawyer.text` 私聊里让她先垫的原话、刷卡记录、后续催款，都先完整留好。能向谁主张、走哪一步，还要看经办主体和公司后续材料；现在别只留一张审批图。

## 周会计

- **固定性格：** 冷静的数字理性派
- **受压反应：** 删掉形容词，只报金额、时间和路径。
- **防御动作：** 按日期排列，拒绝替数字添故事。
- **知识边界：** 只读材料中已经出现的账目与流程，不认定未知付款人身份。

### 收麦幕间

- `$case.nightStructure.interlude.actions[1].options[1].advisorLine` 审批页看到了。付款回单号呢？拿不出来，就先别说已经付了。

### 后台／材料回流

- `$case.advisorNotes[0].text` 我只问一句：付款回单在哪儿？审批过了，钱也可能还没付；真付了，也得看进了哪个账户。今晚没有回单，就别替它往下走。
- `$case.delegation.outcomes.zhou-accountant.text` 对公付款通常会有回单号。让她别再问“钱怎么还没到”，就问这单的付款回单号。报得出，就沿回单查；报不出，至少不能说已经付了。……先这样。老张点的外卖送我这儿了，地址又填错。验了半辈子指纹的人，自己家门牌号记不住。

## 小林老师

- **固定性格：** 热络的感性现实派
- **受压反应：** 先替行业解释一句，再把行话翻成人话。
- **防御动作：** 笑着纠偏，拆一次话术就补一次行业辩护。
- **知识边界：** 只解释婚恋行业话术和流程，不知道本案人物私下做过什么。

### 收麦幕间

- `$case.nightStructure.interlude.actions[1].options[2].advisorLine` 她想让老板把活动交给她，不丢人。可对方一句话把负责活动和先垫钱捆在一块儿了，这得拆开说。

### 后台／材料回流

- `$case.delegation.outcomes.lin-matchmaker.text` 职场不是我的场。我只听见一件事：她想让老板把活动交给她，对方就把“先垫”跟在后面。她自己想往前走，不等于这笔钱不用说清。

## 张法医

- **固定性格：** 技术洁癖型理性派
- **受压反应：** 碰到来源不全的材料会停止讨论结论。
- **防御动作：** 先查链条，再谈内容。
- **知识边界：** 只判断证据链与技术可检验性，不认定关系或动机。

### 后台／材料回流

- `$case.delegation.outcomes.zhang-forensic.text` 这张截图是完整截屏，底部没有裁切痕迹。它本来就只走到审批这一步。能确认审批过了，不能拿它当付款回执。

## V哥

- **固定性格：** 沉着的直觉教练
- **受压反应：** 玩家越急，他越让人停一下，只比较两件已知事物。
- **防御动作：** 短句，先停，再分开看。
- **知识边界：** 只知道玩家当前已经听见或看见的内容。

### 夜 A

- `$case.sceneVersions[0].helperHint` 把私聊拆成两半：他给了什么身份，又让她先承担什么。
- `$case.sceneVersions[1].helperHint` 公开流程已经出现。先追她为什么看见了，却没有用它保护自己。
- `$case.sceneVersions[2].helperHint` 把 14:05 和 14:22 分开：公开规则说什么，私聊又让她别做什么。
- `$case.sceneVersions[3].helperHint` 别跟着“审批通过”往下想。先问她，钱到底有没有回到卡里。

### 夜 B

- `$case.sceneVersions[4].helperHint` 把费用名称和对接信息分开看。一处正常，不替另一处作证。
- `$case.sceneVersions[5].helperHint` 领导一句话同时给了署名和流程要求。她先听进去了哪半句？
- `$case.sceneVersions[6].helperHint` 表上有三个不同的位置：执行主责、付款对接人、供应商确认人。先别用第一栏替后两栏作证。

# 快案：什么都不图

## 林旭阳

- **固定性格：** 温热而克制
- **受压反应：** 担心误判时先缩短句子，把混在一起的事实拆开。
- **防御动作：** 把感情和判决分开，用小而合法的试探代替情绪宣判。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 其他出声面

- `$quick.turns[0].host` 你好，连上了。今天想聊什么？
- `$quick.turns[1].host` 以前谈过吗？你觉得为什么没走下去？
- `$quick.turns[2].host` 收入、房子、年龄呢？总得有个范围吧。
- `$quick.turns[3].host` 你把条件说得这么宽，我反而不太敢随便介绍。真要介绍，我也得先了解你一点。你家里是什么情况？
- `$quick.turns[4].host` 你现在跟父亲一起住吗？
- `$quick.turns[5].host` 你亲爸不是一直没法干重活吗？这一百万也是他给的？
- `$quick.turns[6].host` 我问的是一百万。你怎么突然说到生孩子？
- `$quick.turns[7].host` 报告不用给节目看。真开始谈了，你准备什么时候告诉对方？
- `$quick.turns[8].host` 弹幕里刚有个普通上班族说愿意认识你。三十一，月薪六千，没房，都在你刚才说的范围里。要不要让他给后台留个联系方式？
- `$quick.turns[9].host` 四五千也行、没房也行，是你刚才自己说的。为什么真有一个，你又不要？
- `$quick.quoteOptions[0].hostLine` 这句现在还不能算。年龄范围宽，只能说明她愿意这样说，不能证明她为什么这样说。
- `$quick.quoteOptions[1].hostLine` 房子和一百万可以是真的。但你前面说的亲爸，和后来给钱的这个人不是同一个，对吧？你能说说你们到底是什么关系吗？
- `$quick.quoteOptions[2].hostLine` 报告不用给节目看。我只问一件事：如果它会影响对方要不要结婚，你会不会在确定关系以前告诉他？
- `$quick.quoteOptions[3].hostLine` 我照你的条件说了一个人，你没见就拒绝；转头只问做生意、家里稳定的。你说的“没要求”，到底是说给谁听的？
- `$quick.quoteOptions[4].hostLine` 这句可以解释她为什么怕穷，但不能替她父母把离婚原因定下来。
- `$quick.quoteOptions[5].hostLine` 你说前两段散了，是因为自己太直、不会哄人。现在又说，只要我替你说句好话，见面以后你会哄。这两句哪句是真的？
- `$quick.ending.hostLead` 这通电话一开始，连我都被你吓了一下。四五千、没房、大十岁都行，听着像你什么都不挑。
- `$quick.ending.hostVerdict` 可真有一个符合这些话的人，你不要。你要的是我说过做生意、家里稳的人，还希望我先替你说一句“这个姑娘人不错”。一百万是谁给的、那份报告什么时候说，你又都准备往后放。
- `$quick.ending.hostClose` 你不肯说明一百万是谁给的，也准备把婚育报告往后放，却要我先跟别人保证“这个姑娘靠谱”。这些已经够了。我不会替你背书，也不会把听众介绍给你。

## 快案来电人·罗

- **固定性格：** 擅长用低姿态和亲近感争取入口的机会主义自保者
- **受压反应：** 被追到钱源或报告时先叫“哥”软化气氛，再换话题；前后原话并排后，会承认自己知道怎样让特定对象喜欢。
- **防御动作：** 先把择偶条件压到极低，把两位不同男性都称为“爸爸”；受压时撒娇、转题，并把延后披露解释成争取了解机会。
- **知识边界：** 知道亲生父亲的身体与家庭经历、一百万元的真实给款人、自己的检查结果和择偶目标；不会公开年长给款者的身份。她不知道父母和前任会怎样解释旧事，也不能用检查结果证明任何性经历。

### 其他出声面

- `$quick.turns[0].caller` 主播哥，我想让你帮我介绍个对象。我二十四，要求真的不高，人老实、对我好就行。
- `$quick.turns[1].caller` 谈过两个。可能我说话太直吧。我不会撒娇，也不会哄人，有什么就说什么。
- `$quick.turns[2].caller` 一个月挣四五千也行，没房也行。大我十来岁，我也能接受。只要别赌、别动手，能正常过日子就行。
- `$quick.turns[3].caller` 我爸妈很早就离了，就是没钱，天天吵。我跟我亲爸过。他腰不好，干不了重活，这些年家里条件一直一般。
- `$quick.turns[4].caller` 没有，我自己有套小两居。去年我爸爸给了我一百万，我添了一点买的。所以男方没房也不要紧，可以住我这儿。
- `$quick.turns[5].caller` 哎呀，哥，你别问这么细嘛。反正是一个我叫爸爸的人给的，他不愿意露面。我拿到钱是真的。再说我也不图男方房子，以后有没有孩子，我都不强求，两个人开心不就行了。
- `$quick.turns[6].caller` 以前相亲，人家总问这个。我身体没什么大问题，就是医生说自然怀孕的机会低一点。那份报告我不想一开始就跟男方说，不然还怎么聊啊。
- `$quick.turns[7].caller` 感情稳一点再说吧。第一次见面就讲这个，谁还愿意认识我？我可以在别的地方对他好啊。
- `$quick.turns[8].caller` 这个先不用。哥，你以前不是说过，听众里有几个自己做生意、家里也稳定的吗？你觉得靠谱的，帮我挑一个呗。
- `$quick.turns[9].caller` 我不是只看钱，我是信你。你介绍的人会先听你一句。你就说我人挺好的，让他愿意见一面。见了以后我会跟他聊，哄人我还是会的。哥，你就帮我一次嘛。
- `$quick.quoteOptions[1].callerLine` 不是同一个。他年纪比我大很多，对我一直挺好。别的我不想在直播里说。
- `$quick.quoteOptions[2].callerLine` 确定关系以前……我尽量吧。可要是说得太早，我真的一个机会都没有。
- `$quick.quoteOptions[3].callerLine` 我就是觉得，你都说过他条件好了，那至少靠谱一点。要谈结婚，谁不想找稳一点的？
- `$quick.quoteOptions[5].callerLine` 我不是对谁都那样。真想让一个人喜欢我，我当然知道该怎么说。
- `$quick.ending.callerReply` 我就是想先有个见面的机会。条件好一点有什么错？我把这些一上来都说了，谁会选我？

# 未在本报告捕获到台词的人物卡

- 案二前台（case2-front-desk）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。

# 句长节奏人工复核

以下只是朗读提醒，不自动判错。三句服务于不同防御动作时可以保留。

- _shell／林旭阳／other：23、26、27 字（$manifest.nightShell.interludes[1].lines[1]；$manifest.nightShell.interludes[2].lines[1]；$manifest.nightShell.interludes[2].lines[3]）
- 01-credit／林旭阳／nightA：29、27、27 字（$case.sceneVersions[0].afterVersion.lines[0]；$case.sceneVersions[1].beforeVersion.lines[0]；$case.sceneVersions[2].beforeVersion.lines[0]）
- 01-credit／林旭阳／nightB：19、18、20 字（$case.sceneVersions[6].casualQuestions[1].question；$case.sceneVersions[6].casualQuestions[2].question；$case.sceneVersions[6].casualQuestions[3].question）
- 01-credit／案一咨询者·沈／nightB：21、25、22 字（$case.overnightStructure.callbackOpeners.他对三万五的沉默.firstConflict.callerLine；$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[1]；$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.lines[3]）
- 01-credit／案一咨询者·沈／nightB：31、32、29 字（$case.overnightStructure.postures.withCaller；$case.nightStructure.returnStance.lines.defensive；$case.nightStructure.returnStance.lines.open）
- 01-credit／V哥／nightA：35、32、36 字（$case.sceneVersions[0].helperHint；$case.sceneVersions[1].helperHint；$case.sceneVersions[2].helperHint）
- 02-tony／林旭阳／nightB：23、19、23 字（$case.overnightStructure.callbackOpeners.咨询者止损立场.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.培训模板说明.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.店里的标准表.firstConflict.hostLine）
- 02-tony／案二咨询者·何／nightB：45、45、48 字（$case.sceneVersions[7].questionOptions[1].answer；$case.overnightStructure.callbackOpeners.店外称呼观察.line；$case.overnightStructure.callbackOpeners.店外服务序列.line）
- 02-tony／V哥／nightB：33、30、34 字（$case.sceneVersions[4].helperHint；$case.sceneVersions[5].helperHint；$case.sceneVersions[6].helperHint）
- 03-profile／案三咨询者·林／nightB：25、24、27 字（$case.sceneVersions[6].sceneCloser.lines[4]；$case.overnightStructure.callbackOpeners.两边的完整聊天.firstConflict.callerLine；$case.overnightStructure.callbackOpeners.她没核实的两句话.firstConflict.callerLine）
- 04-workplace／林旭阳／nightB：22、26、25 字（$case.overnightStructure.callbackOpeners.供应商对接人栏.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.茶水间回单缺口.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.茶水间责任对照.firstConflict.hostLine）
- 04-workplace／林旭阳／nightB：26、25、29 字（$case.overnightStructure.callbackOpeners.茶水间回单缺口.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.茶水间责任对照.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.赵律师边界框架.firstConflict.hostLine）
- 04-workplace／案四咨询者·陈／nightB：23、20、23 字（$case.sceneVersions[6].sceneCloser.lines[5]；$case.overnightStructure.callbackOpeners.她整理的报销时间线.firstConflict.callerLine；$case.overnightStructure.callbackOpeners.财务窗口回单要求.firstConflict.callerLine）
- 04-workplace／案四咨询者·陈／nightB：24、22、21 字（$case.overnightStructure.callbackOpeners.茶水间回单缺口.firstConflict.callerLine；$case.overnightStructure.callbackOpeners.茶水间责任对照.firstConflict.callerLine；$case.overnightStructure.callbackOpeners.赵律师边界框架.firstConflict.callerLine）
- 04-workplace／案四咨询者·陈／nightB：19、20、23 字（$case.sceneVersions[4].casualQuestions[0].answer；$case.sceneVersions[4].casualQuestions[1].answer；$case.sceneVersions[4].questionOptions[0].answer）
- 04-workplace／案四咨询者·陈／nightB：36、40、38 字（$case.overnightStructure.callbackOpeners.财务窗口回单要求.line；$case.overnightStructure.callbackOpeners.财务窗口账户拒查.line；$case.overnightStructure.callbackOpeners.供应商对接补话.line）
- 04-workplace／林旭阳／day：21、23、20 字（$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[0]；$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[0]；$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[1]）
- 04-workplace／案四部门助理／day：28、29、30 字（$case.overnightStructure.dayScenes[2].body.beats[1]；$case.overnightStructure.dayScenes[2].body.beats[2]；$case.overnightStructure.dayScenes[2].body.beats[3]）
- 04-workplace／案四部门助理／day：29、30、30 字（$case.overnightStructure.dayScenes[2].body.beats[2]；$case.overnightStructure.dayScenes[2].body.beats[3]；$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[0]）
