# 《Steam 试玩版》按角色台词报告

> 本文档由内容包自动生成。它把分散在夜 A、白天、夜 B、顾问回流和结案中的台词重新按人物聚合，供遮名辨人、知识边界和句长节奏审稿。请修改 JSON 真源后运行 `npm run content:dialogue-report`，不要手改本文档。

## 汇总

- 固定人物卡：33
- 收录台词／玩家可见人物材料：804
- 本包实际出声人物：32
- 句长节奏人工复核提示：23
- 构建时硬拦截：未归属说话人、越案人物 ID，以及“我现在想知道的是／本质上／更重要的是／一方面另一方面”高密度模板。

# 全集外壳

## 林旭阳

- **固定性格：** 温热而克制
- **受压反应：** 担心误判时先缩短句子，把混在一起的事实拆开。
- **防御动作：** 把感情和判决分开，用小而合法的试探代替情绪宣判。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 其他出声面

- `$manifest.nightShell.prologue.hostLine` 这里是《深夜热线》，我是林旭阳。先听完，账和话一件件对。第一通，接进来。
- `$manifest.nightShell.interludes[0].lines[0]` 有位朋友问……『九块九三支的眉笔靠谱吗』。这位朋友,你走错直播间了。下一通。

## 老方

- **固定性格：** 急躁的结果主义者
- **受压反应：** 数据越差，句子越像截止日期和命令。
- **防御动作：** 把关心包装成指标，把认可包装成下一项要求。
- **知识边界：** 只知道节目运营、后台曲线和公开播出内容，不知道案件麦外真相。

### 其他出声面

- `$manifest.nightShell.prologue.lines[0]` 深夜档这个月再不达标，就并进娱乐区。改版方案，下周一前给我。

## 导播

- **固定性格：** 冷静精确
- **受压反应：** 越忙越只报必要指令。
- **防御动作：** 不用评价，只给时间和状态。
- **知识边界：** 只处理直播技术状态和已经进线的音频。

### 其他出声面

- `$manifest.nightShell.prologue.lines[3]` 三、二、一。ON AIR。

## 旁白

- **固定性格：** 克制的观察者
- **受压反应：** 不用结论，只留下声音、灯和动作。
- **防御动作：** 只写可感知物和动作后果。
- **知识边界：** 可描写舞台与玩家可见画面，不新增角色不知道的案情事实。

### 其他出声面

- `$manifest.nightShell.prologue.lines[1]` 凌晨一点，林旭阳推开直播间的门。走廊坏着半截灯，控台的显示器还亮着。

## 赵律师

- **固定性格：** 锋利的理性派
- **受压反应：** 听见无证据定性会立刻打断，并补适用条件。
- **防御动作：** 短句、免责、拒猜动机。
- **知识边界：** 只解释法律与责任效果，不替案件当事人作证，不指点玩家圈哪一栏。

### 其他出声面

- `$manifest.nightShell.prologue.lines[2]` 吃饭没有？你的包在椅背上。我放了一份以前经手的案卷，收播后再看。

# 今日来电：8 万信用卡周转

## 林旭阳

- **固定性格：** 温热而克制
- **受压反应：** 担心误判时先缩短句子，把混在一起的事实拆开。
- **防御动作：** 把感情和判决分开，用小而合法的试探代替情绪宣判。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 夜 A

- `$case.openingDialogue[1]` 八万。好，先别替他解释。他第一次提钱，原话怎么说？
- `$case.sceneVersions[2].sceneCloser.lines[0]` 订座的事，等账单翻完再说。
- `$case.sceneVersions[2].sceneCloser.lines[2]` 这跟八万比——
- `$case.nightStructure.hangup.hostLine` 五万还空着。白天核流水，明晚回来把它说完。
- `$case.sceneVersions[0].casualQuestions[0].question` 你们平时谁管钱多一点？
- `$case.sceneVersions[0].casualQuestions[1].question` 他丢工作前，加班是什么样子？
- `$case.sceneVersions[0].questionOptions[0].question` 他找你垫钱以前，提过工作出问题吗？
- `$case.sceneVersions[0].questionOptions[1].question` 你看见断缴，当场问了吗？
- `$case.sceneVersions[0].dialogueOptions[0].question` 他当时只说差多少钱吗？
- `$case.sceneVersions[0].dialogueOptions[1].question` 你当时为什么没接着问工作？
- `$case.sceneVersions[1].casualQuestions[0].question` 那些餐厅是什么档次？
- `$case.sceneVersions[1].casualQuestions[1].question` 礼物都送了些什么？
- `$case.sceneVersions[1].casualQuestions[2].question` 那笔短视频平台的分期是怎么回事？
- `$case.sceneVersions[1].casualQuestions[3].question` 八万，他原话就要这么多?
- `$case.sceneVersions[1].questionOptions[0].question` 社保停了以后，账单又刷了哪些？
- `$case.sceneVersions[1].questionOptions[1].question` 他是不是一直在硬撑给你看？
- `$case.sceneVersions[1].dialogueOptions[0].question` 你第一眼先看到哪一栏？
- `$case.sceneVersions[1].dialogueOptions[1].question` 那几页账单是完整的吗？
- `$case.sceneVersions[2].casualQuestions[0].question` 那家店你以前去过吗？
- `$case.sceneVersions[2].casualQuestions[1].question` 照片发出去以后，朋友怎么说？
- `$case.sceneVersions[2].casualQuestions[2].question` 那晚的照片删了吗?
- `$case.sceneVersions[2].questionOptions[0].question` 那晚谁订座、谁点酒、谁发圈？
- `$case.sceneVersions[2].questionOptions[1].question` 那晚他说过手头紧吗？
- `$case.sceneVersions[2].questionOptions[2].question` 朋友夸他时，你有没有解释订座和发圈是谁做的？
- `$case.sceneVersions[3].casualQuestions[0].question` 你以前真想过做探店号？
- `$case.sceneVersions[3].casualQuestions[1].question` 那句“投资你”，你当时怎么听？
- `$case.sceneVersions[3].questionOptions[0].question` 开箱和首拍那晚，设备到底怎么用起来的？
- `$case.sceneVersions[3].questionOptions[1].question` 那套设备现在还在，能把一万二抵掉吗？
- `$case.sceneVersions[3].questionOptions[2].question` 你为什么反复说“他手机上弄的”？
- `$case.sceneVersions[4].casualQuestions[0].question` 他以前跟你开过口借钱吗？
- `$case.sceneVersions[4].questionOptions[0].question` 剩下那五万多，你问过他是什么吗？
- `$case.sceneVersions[4].questionOptions[1].question` 这些账单上的日子，你们当时在一起吗？
- `$case.sceneVersions[4].dialogueOptions[0].question` 你当时已经准备转了吗？
- `$case.sceneVersions[4].dialogueOptions[1].question` 他后来为什么又改口？

### 白天

- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[0]` 会员号能对一下吗？她说号是她的。
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[2]` 好。我只记下你拒绝核对，不把拒绝当成确认。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[0]` 刚才那句「今天第三拨」，都在问同一排位子？

### 夜 B

- `$case.sceneVersions[6].beforeVersion.lines[3]` 几点发的?
- `$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.lines[0]` 六月 8 号那笔没来，八万就开口了。你昨晚——
- `$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.lines[2]` ……对，七月，我念岔了。你昨晚为什么只说『奖金晚发』?
- `$case.overnightStructure.callbackOpeners.她的会员号.firstConflict.hostLine` 会员号在你手上。你开场那句“都是他安排的”，还算数吗？
- `$case.overnightStructure.callbackOpeners.常客的轮订规律.firstConflict.hostLine` 他只说提前订了，还是亲口说过‘只为你’？
- `$case.overnightStructure.callbackOpeners.旁听记下的两句.firstConflict.hostLine` 五万没说，你却先把灯护住了。还舍不得哪一块？
- `$case.overnightStructure.callbackOpeners.他对五万的沉默.firstConflict.hostLine` 这句现在敢当着他再说一遍吗？
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.hostLine` 3301，流水上没名字。先别猜。你想问他什么？
- `$case.overnightStructure.callbackOpeners.顾问回单.firstConflict.hostLine` 回单就到这一步。你今晚还想问什么？
- `$case.overnightStructure.callbackOpeners.性质框架.firstConflict.hostLine` 没有备注，没有还款约定。你当时凭什么准备转？
- `$case.overnightStructure.callbackOpeners.路径框架.firstConflict.hostLine` 他今晚再说‘你不信我’，你拿哪一行问他？
- `$case.overnightStructure.callbackOpeners.闺蜜删掉的那条评论.firstConflict.hostLine` 她起哄，你发圈，这些都过去了。八万是现在的事，分开算。
- `$case.sceneVersions[5].casualQuestions[0].question` 探店号你做起来了吗？
- `$case.sceneVersions[5].casualQuestions[1].question` 那套设备现在还用吗？
- `$case.sceneVersions[5].questionOptions[0].question` 那套设备为什么开场只说“他手机上弄的”？
- `$case.sceneVersions[5].questionOptions[1].question` 设备进你家，一万二就该算你的债吗？
- `$case.sceneVersions[5].dialogueOptions[0].question` 那套东西现在还用吗？
- `$case.sceneVersions[5].dialogueOptions[1].question` 他说投资你的时候，你怎么回的？
- `$case.sceneVersions[6].casualQuestions[0].question` 你朋友现在知道多少？
- `$case.sceneVersions[6].casualQuestions[1].question` “低你一头”这话，他以前说过吗？
- `$case.sceneVersions[6].casualQuestions[2].question` “怕你离开”那句，他是打字还是语音？
- `$case.sceneVersions[6].casualQuestions[3].question` 你闺蜜后来还说什么了?
- `$case.sceneVersions[6].casualQuestions[4].question` 那条语音你还留着?
- `$case.sceneVersions[6].questionOptions[0].question` 他说怕你离开，那最低还款为什么要你先转？
- `$case.sceneVersions[6].questionOptions[1].question` 你一直说要看账单，那句不好说出口的话是什么？
- `$case.overnightStructure.callerQuestion.options[0].label` 别垫。至少今晚别转。
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[0].label` 我不是这个意思。你先喝口水。
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[1].label` 我是主播，不是你男朋友。这句我照直说。
- `$case.overnightStructure.callerQuestion.options[1].label` 八万先别谈，先让他把那五万多说清楚。
- `$case.overnightStructure.callerQuestion.options[2].label` 我不替你答。我只把转钱前必须说清的东西留给你。

### 终局

- `$case.hostDisclosure.text` “先帮我挡几天”——这话我也听过一次，原版的。那笔钱我后来没再提。所以下面这些，我问她，也问我自己当年为什么没问。
- `$case.deepFollowup.question` 那我多问一句。那笔信用卡上一万二分期买的灯和稳定器，现在还摆在你屋里，你心里把它算成谁花的钱？
- `$case.stageJudgement` 这通麦别只数他撒了几个谎。账单摊开，吃住玩加分期不到三万，八万的大头到收麦都没有名字；她这边，订座的会员号、纪念日朋友圈、探店的账号，也都是她自己的。
- `$case.caseClosing.verdict` 林旭阳没有替她决定要不要分手，只把今晚能做的事说清：八万先别替人垫，先把每一笔欠款、还款人和转账去向拆开。

### 其他出声面

- `$case.careChoices[0].hostLine` 回去先把转账页关了。饭吃了吗？没吃煮个面。
- `$case.careChoices[1].hostLine` 今晚你没做错什么。八万的事，不是你把日子过坏了。
- `$case.careChoices[2].hostLine` 不急着决定。热线明晚还开，我们都在。
- `$case.overnightStructure.liveCounterBeats[0].lines[3]` 让他听。
- `$case.overnightStructure.returnBeat.lines[1]` 清楚。

## 案一咨询者·沈

- **固定性格：** 敏感的体面维护者
- **受压反应：** 越紧张句子越长，堆很多场面细节；一说到分期就突然变短。
- **防御动作：** 用被动句隐藏主动选择，把男友先说成安排者。
- **知识边界：** 知道共同生活、自己见过的流水和对方说法，不知道尾号 3301 的主人。

### 夜 A

- `$case.openingDialogue[0]` 主播你好。我跟男朋友谈了半年多，他以前连打车钱都不让我出。前几天突然开口，说信用卡要周转，让我垫。八万。
- `$case.sceneVersions[0].afterVersion.lines[0]` ……你等我一下，我把窗关了。楼下有车在报警，吵。
- `$case.sceneVersions[1].casualQuestions[3].lines[0]` 嗯。
- `$case.sceneVersions[1].casualQuestions[3].lines[2]` 一分没少。
- `$case.sceneVersions[2].casualQuestions[2].lines[0]` 没删。
- `$case.sceneVersions[2].casualQuestions[2].lines[2]` 舍不得。里面那盏灯拍得挺好看的。
- `$case.sceneVersions[2].sceneCloser.lines[1]` 等等。我就问一句，这句你帮我问不了……那个靠窗位，他是不是也带别人坐过。
- `$case.sceneVersions[2].sceneCloser.lines[3]` 你别管跟八万比!
- `$case.sceneVersions[2].sceneCloser.lines[5]` ……人均四五百的店，我记住的是位置。可笑吧。我也觉得。
- `$case.sceneVersions[3].sceneCloser.lines[0]` ……不好意思，咳两声。换季。
- `$case.nightStructure.hangup` 那五万……今晚我说不出来。流水发后台。白天去核，明晚这个点，我再打。
- `$case.openingComplaint` 咨询者连线说：“我男朋友说信用卡要周转，想让我先帮他顶几天。这几天我翻他那份账单，越翻越睡不着，今天想让主播帮我听听。”
- `$case.sceneVersions[0].version` 他先说：“奖金晚发，帮我挡几天。”我真当成手头紧。后来他发了张办材料的截图，我瞄见社保那栏，停了两个多月——那张图还是他上个月办材料时截的。可他每天还跟我说加班。那张图我盯了半天，没回他。
- `$case.sceneVersions[0].casualQuestions[0].answer` 各花各的。约会基本他出，我偶尔抢着买单，他不让，说“跟我你还客气什么”。
- `$case.sceneVersions[0].casualQuestions[1].answer` 天天说忙。可几点下班、跟谁吃饭，我都不知道。我们没住一起，他说加班，我就回“早点睡”。
- `$case.sceneVersions[0].questionOptions[0].answer` 没有。就……嘴里一直是忙，加班，项目上线，说什么服务器凌晨得盯着，我也听不懂，反正就很忙。有一回我说下楼给你送个粥吧，他说别，公司门禁严。现在想想，门禁严——他那阵子都不在公司了，哪来的门禁。……哎，我说到哪了。对，工作出问题，他一个字没提过。
- `$case.sceneVersions[0].questionOptions[0].guardedAnswer` 他说忙，我就信了。我们没住一起，我也不想天天问他在哪。
- `$case.sceneVersions[0].questionOptions[1].answer` 问了句“这是什么意思”。他说公司材料没更新，让我别跟着添乱。具体哪天不去上班的，他一直没说。
- `$case.sceneVersions[0].dialogueOptions[0].answer` 一开始没有。他就说先帮他挡一下，别让卡逾期。我追问，他才把最低还款那一栏截给我看。
- `$case.sceneVersions[0].dialogueOptions[1].answer` 我怕问重了像查岗。那会儿我还把他当男朋友，不是当一个要对账的人。
- `$case.sceneVersions[1].version` 账单翻出来，我先看见右上角那个数。七万九……不对，八万零几百，反正八万出头。我往下划，餐厅、礼物，两次酒店。再下一行是一万二，短视频平台。我在那儿停了几秒，还是划走了。分期从他手机上开的，我就拿这句话挡着，没再看。
- `$case.sceneVersions[1].revisedVersion` ……这张账我重说。八万出头。餐厅、礼物、酒店，社保停了以后照刷。有几家店，是我挑的。那笔一万二，我当时看见了。我没敢往下问。
- `$case.sceneVersions[1].casualQuestions[0].answer` 人均四五百。有两家是我收藏过的，他记住了。纪念日那家靠窗，他说提前两周才订到。
- `$case.sceneVersions[1].casualQuestions[1].answer` 香水，还有一条项链。项链那次他自己发朋友圈，写“她值得”。我朋友全点赞，我还截图留着。
- `$case.sceneVersions[1].casualQuestions[2].answer` ……分期在他手机上开的。买了什么，我现在不想说。先看餐厅和酒店。
- `$case.sceneVersions[1].questionOptions[0].answer` 纪念日晚餐、礼物分期，两次酒店。那阵子我还在朋友圈夸他会安排。一万二也是那以后开的，买了什么……这句我先不说。
- `$case.sceneVersions[1].questionOptions[0].guardedAnswer` 就那几笔。具体哪天刷的，我没逐条对，他只说别把他逼太紧。
- `$case.sceneVersions[1].questionOptions[1].answer` 可能。我那时候只觉得他肯花心思。账单到我手里，才发现我坐过的那些店，一笔没少。
- `$case.sceneVersions[1].dialogueOptions[0].answer` 先看到最低还款。八千多，我手都停了一下。再往下翻，才看到那些消费明细。
- `$case.sceneVersions[1].dialogueOptions[1].answer` 他一开始没发完整的。我说要看明细，他才补。补出来以后，我就有点不想看了。
- `$case.sceneVersions[2].version` 纪念日那晚，靠窗位。他说提前两周才订到，又把酒单推给我：“都纪念日了，总不能太寒酸。”我看窗外，他看酒。卡还剩多少，谁都没提。照片是我发的。朋友一条条夸，我每条都回了。
- `$case.sceneVersions[2].casualQuestions[0].answer` 去过两次。靠窗那排总要等，我知道。那晚坐下以后，我还跟他说这位置挺难订。
- `$case.sceneVersions[2].casualQuestions[1].answer` 都在夸，说那顿饭看着很有心。我那时看得挺高兴，没去想是谁在替谁撑。
- `$case.sceneVersions[2].questionOptions[0].answer` 我先说酒，酒是他点的。订座记录和朋友圈，我……我想等账单翻完再说。那晚我没觉得自己也在做什么，只觉得被安排得很周到。
- `$case.sceneVersions[2].questionOptions[0].guardedAnswer` 酒是他点的。别的我不想现在拆。那晚已经够难看了。
- `$case.sceneVersions[2].questionOptions[1].answer` 没有。他还说这顿算他的，叫我别看价格。我当时觉得被宠，现在看账单，才知道那句话也刷在卡上。
- `$case.sceneVersions[2].questionOptions[2].answer` 没有。她们说我没看错人，我听着高兴。手机一亮，我就点开。
- `$case.sceneVersions[3].version` 那一万二，他后来总叫“投资”。他说：“账号做起来，你就不用看别人脸色。”我以前念叨过探店号，听到这句……挺高兴的。谁签的分期，我没问。现在那两个字卡在这儿，投资。
- `$case.sceneVersions[3].casualQuestions[0].answer` 想过，断断续续念了几个月。我关注了好些博主，有个杭州的姑娘，拍面馆的，就一个手机加个小支架，拍得特别香，她粉丝可多了。我还研究过转场，就那种一挥手换一家店的……哎，说这个干嘛。反正，真要拍我又总说没设备。现在设备倒是有了。
- `$case.sceneVersions[3].casualQuestions[1].answer` 很甜，也很有面子。像他认真把我的事当事。
- `$case.sceneVersions[3].questionOptions[0].answer` 这件事我今晚说不动，先让我把账说完。现在只说那一万二，分期不是我签的。……可你问到这儿，我也没法再说自己完全不知情。
- `$case.sceneVersions[3].questionOptions[0].guardedAnswer` 分期不是我签的。设备那边，我现在不想说。
- `$case.sceneVersions[3].questionOptions[1].answer` 不能。我没签分期，也没答应还。东西最后到了哪……你先别逼我说，我今晚会补。
- `$case.sceneVersions[3].questionOptions[2].answer` 因为确实是他手机开的。说到这儿，我就能装作后面的事没发生。等流水翻完吧。我会说。
- `$case.sceneVersions[4].version` 我又加了一遍。社保停了以后，吃饭、酒店，再加那笔分期，不到三万。可他要八万。剩下五万多，我一提，他就绕开。还有，账单还有三天才到期，他先催“今晚就要”，过一会儿又说“这几天都行”。主播，我今晚到这儿。流水发后台了。那五万……让我过一晚。明晚这个点，我再打。
- `$case.sceneVersions[4].casualQuestions[0].answer` 没有。一次都没有，所以这次我才慌。他那个人，以前连打车钱都不让我掏。
- `$case.sceneVersions[4].questionOptions[0].answer` 问过一次。他愣了一下，说“反正不是乱来的钱”。我再问，他就把话岔到“别拖，今晚先转”上去了。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 问过，他没细说。只说不是我该管的那部分。
- `$case.sceneVersions[4].questionOptions[1].answer` 近几个月能对上。再往前……我把页面关了。一个人没敢看完。
- `$case.sceneVersions[4].dialogueOptions[0].answer` 差一点。页面都打开了。就是看到到期日那里，我才停住。
- `$case.sceneVersions[4].dialogueOptions[1].answer` 他说我别紧张，这几天转也行。可前面那句“今晚就要”已经把我吓到了。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[0]` 八万里，可见的吃住玩加分期不到三万。中间那五万多，你到底干什么用了。
- `$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[0]` 那订座呢？会员号是我的。你开口第一句还说都是你安排的。
- `$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[2]` 真心买灯，和叫我垫八万，哪一句算数。

### 夜 B

- `$case.sceneVersions[5].questionOptions[0].resistanceBeat.lines[0]` 林老师，你们是不是就等我这句？灯一响，弹幕就好看了。
- `$case.sceneVersions[6].beforeVersion.lines[0]` 等下……他又发消息了。一个『抱抱』表情包，企鹅那个。
- `$case.sceneVersions[6].beforeVersion.lines[2]` 他知道这是直播。他知道你们都看着。
- `$case.sceneVersions[6].beforeVersion.lines[4]` 就刚才。十二点四十。
- `$case.sceneVersions[6].beforeVersion.lines[6]` ……跟着又来一句：『账单 26 号出』。跟上回一模一样，连间隔都像卡着表的。
- `$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.callerLine` ……说成断了，话就重了。
- `$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.lines[1]` 七月。六月是有的。
- `$case.overnightStructure.callbackOpeners.她的会员号.firstConflict.callerLine` 不算全。酒是他点的，座是我订的。那晚好不好看，我也出了力。
- `$case.overnightStructure.callbackOpeners.常客的轮订规律.firstConflict.callerLine` 他说‘这位子难订’。后面那句，是我听出来的。
- `$case.overnightStructure.callbackOpeners.旁听记下的两句.firstConflict.callerLine` 舍不得承认那些好也全是假的。可这跟替他还八万不是一回事。
- `$case.overnightStructure.callbackOpeners.他对五万的沉默.firstConflict.callerLine` 敢。先说五万，再说八万。我不垫。
- `$case.overnightStructure.callbackOpeners.流水圈注.firstConflict.callerLine` 那我不填。我只问他，这笔为什么从来没跟我提。
- `$case.overnightStructure.callbackOpeners.顾问回单.firstConflict.callerLine` ……想拿那八万。可八万里也有我收下的东西。先问钱吧。
- `$case.overnightStructure.callbackOpeners.性质框架.firstConflict.callerLine` 凭他说怕我走。现在听着挺丢人的。
- `$case.overnightStructure.callbackOpeners.路径框架.firstConflict.callerLine` 先问 8 号。再问 3301。别的等他答。
- `$case.overnightStructure.callbackOpeners.闺蜜删掉的那条评论.firstConflict.callerLine` 他在拿。我昨晚也差点拿它替自己装无辜。八万不抵。
- `$case.overnightStructure.callerQuestion.options[0].lines[0]` ……你和我闺蜜说得一样。你们都不用陪他过日子。
- `$case.overnightStructure.callerQuestion.options[0].lines[2]` 你凭什么说得这么轻巧?你是不是也觉得，我这种人就活该碰上这种事?
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[0].lines[0]` ……水在手边放凉一晚上了。
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[0].lines[2]` 你接着说吧。
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[1].lines[0]` ……行。你们做节目的，嘴都硬。
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[1].lines[2]` 硬点好。你继续。
- `$case.overnightStructure.callerQuestion.options[0].hostChoices[2].lines[1]` ……对不起。我不该冲你来。你接着问。
- `$case.overnightStructure.callerQuestion.options[1].callerLine` 好。我不先答应，也不先拒绝。我让他把那五万多说清楚。
- `$case.overnightStructure.callerQuestion.options[2].callerLine` 她沉默很久：「那你说。说完，我自己选。」
- `$case.sceneVersions[5].version` 第二晚，我先把自己那一笔补上。等一下，那盏灯还在墙边，我拖过来。……听见了吗？金属刮地。灯架、稳定器一直在我屋里。箱子就在这间屋拆的，第一条探店视频拍到凌晨一点。他蹲地上调了很久，还说：“我来投资你。”我当时很高兴。第二天就发了开箱。现在灯挨着麦克风。我昨晚说这笔跟我没关系，那话站不住。
- `$case.sceneVersions[5].casualQuestions[0].answer` 发了十几条。最高一条八百多赞。他每条都转。
- `$case.sceneVersions[5].casualQuestions[1].answer` 灯上个月还开过。现在拍不动了，一开灯就想起这事。
- `$case.sceneVersions[5].questionOptions[0].answer` ……快递在我家拆。我架灯，他调稳定器。昨晚那句“他手机上弄的”，你们就当我没说过。
- `$case.sceneVersions[5].questionOptions[0].guardedAnswer` 设备在我屋里。开场没说，是我不想先讲。
- `$case.sceneVersions[5].questionOptions[1].answer` 我没签分期，也没答应还，这债不能直接落我头上。可东西确实在我屋里。我收下的那一块，得认。
- `$case.sceneVersions[5].dialogueOptions[0].answer` 灯上个月还开过。现在拍不动了，一开灯就想起这事。
- `$case.sceneVersions[5].dialogueOptions[1].answer` 我没拦。还挺高兴的。现在说这个很难听，但当时我真的觉得他是在支持我。
- `$case.sceneVersions[6].version` 他后来发了条语音：“我只是怕你知道我失业后就离开我。”语音一停，最低还款金额就跳出来。整整齐齐一行数字。还有一句，“以后他可能就不敢跟我谈结婚了。”这句是我说的。纪念日的座，我用会员号订；照片也是我发。我也怕别人觉得我找了个撑不住场面的人。我更怕承认，自己其实很吃那种体面。
- `$case.sceneVersions[6].casualQuestions[0].answer` 知道我们在闹别扭，不知道钱的事。我还没想好怎么开口。
- `$case.sceneVersions[6].casualQuestions[1].answer` 说过一次，喝了酒。那时候我当情话听的。
- `$case.sceneVersions[6].casualQuestions[2].answer` 语音。声音很低，我听了三遍。……然后金额是打字发的，很整齐。
- `$case.sceneVersions[6].casualQuestions[3].answer` 安慰我。说想开点，至少没领证，她表姐那种才叫惨。……我听完更想哭了。但她是好意，我知道她是好意。
- `$case.sceneVersions[6].casualQuestions[4].answer` 留着。
- `$case.sceneVersions[6].questionOptions[0].answer` 那句“怕你离开”，我听了三遍。下一条就是最低还款金额。我盯着那行数字，手已经点进转账页了。
- `$case.sceneVersions[6].questionOptions[0].guardedAnswer` 他说怕我走。后面跟着什么，我现在不想再念了；我一念，就像又在替那句话找理由。
- `$case.sceneVersions[6].questionOptions[1].answer` 怕背债。就这句，我一直说不出口。一拒绝，像我嫌他穷；前面又把他夸得那么好，现在改口，我自己也挂不住。于是我拖，反复说先看账单。
- `$case.overnightStructure.callbackOpeners.周会计的时间线.line` 「周会计那张时间线，我看了。最扎眼的是 8 号。五月有，六月有，七月没了。王**是谁……先别问我，我真不知道。」
- `$case.overnightStructure.callbackOpeners.她的会员号.line` 「餐厅说会员资料不外传。可订座短信在我手机里，号……是我的。昨晚我把这几个字吞了。」
- `$case.overnightStructure.callbackOpeners.常客的轮订规律.line` 「靠窗那排，常客也会轮着订。提前两周是真的。‘只为我’这三个字……是我自己往里加的。」
- `$case.overnightStructure.callbackOpeners.旁听记下的两句.line` 「他在隔壁说，号是我的，灯是真心买的。听见‘真心’那两个字，我还是……算了，五万他没说。」
- `$case.overnightStructure.callbackOpeners.他对五万的沉默.line` 「隔壁那通话绕了半天，五万还是没名字。我不拿灯挡了。那笔钱，他不说，我就不转。」
- `$case.overnightStructure.callbackOpeners.流水圈注.line` 「流水我圈完了。8 号那笔七月没来，五万进来，又去了 3301。看到最后那串号，我手心全是汗。」
- `$case.overnightStructure.callbackOpeners.顾问回单.line` 「回单上没写‘骗’。就几个日子，一条钱路。我本来盼着它替我把话说死的。」
- `$case.overnightStructure.callbackOpeners.性质框架.line` 「赵律师不肯给那笔钱起名字。借的、送的，他说都得有东西落下来。我手里没有。」
- `$case.overnightStructure.callbackOpeners.路径框架.line` 「周会计把人情话都划掉了，只留日期。我看完反倒不会说了。每月 8 号，七月停；五万进来，又转走。」
- `$case.overnightStructure.callbackOpeners.闺蜜删掉的那条评论.line` 「闺蜜把删掉的评论发回来了。我看着那句‘这才像被认真对待’，脸有点烫。那场面，我也撑过。」
- `$case.overnightStructure.callbackFallback.line` 「我想了一晚上，还是得把话说完——你接着问吧。」
- `$case.overnightStructure.postures.againstCaller` 我差点不打回来。刚才弹幕……我都听到了。你要是也觉得是我贪体面，这通我讲不下去。
- `$case.overnightStructure.postures.withCaller` 我回来了。八万的事，你继续问——我不怕对账。控台那点短查，你先说给我听。
- `$case.nightStructure.returnStance.lines.defensive` 我差点不打回来。弹幕说我贪体面……我认过探店，可八万我不替他还。
- `$case.nightStructure.returnStance.lines.open` 我回来了。五万多的事你继续问——这回我不先替他挡。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。隔了一天，那五万多还在。
- `$case.overnightStructure.callerQuestion.prompt` 主播，你说……我该不该垫？

### 终局

- `$case.deepFollowup.answer` ……说不出口的就是这个。算他的，那是他失业以后刷的卡；算我的，我又没签过一个字。朋友都觉得他工作稳定、出手大方，我一拒绝这八万，就像亲手把这层撕开。可难看归难看，账不能就这么变成我的。

### 其他出声面

- `$case.careChoices[0].lines[0]` ……嗯。我现在就关。
- `$case.careChoices[0].lines[2]` 面看心情。
- `$case.careChoices[1].lines[0]` ……这句我存下了。语音的那种存。
- `$case.careChoices[2].lines[0]` 明晚……明晚我大概不打了。但我会听。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 等等——他刚发我消息。
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 一张截图。是这个直播间，你们现在的画面。他在听。
- `$case.overnightStructure.returnBeat.lines[0]` 今晚信号好像不太好，我换了个房间。你那边听得清吧?

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

- `$case.respondentNote.text` 失业是真的，账单也是真的。八万里有她也想去的店，订座是她的会员号——这她自己清楚。五万多那块，不是乱来的钱，但细节我不会在节目里讲。她上麦把灯说成「他手机上弄的」的时候，开箱那天她笑得可开心了。

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

- `$case.investigationHooks[1].material` 前同事说：“他以前阔过，阔得早。请客、送礼、订酒店，真不是认识她以后才学会的。欠过他人情，我只能说到这儿。钱后来去哪儿、每月 8 号那笔是谁，我不说，也别问我。”

## 案一服务员

- **固定性格：** 职业性谨慎
- **受压反应：** 追问熟客时用礼貌套话封口。
- **防御动作：** 只说自己能确认的服务动作。
- **知识边界：** 只知道店内自己经手的座位与服务，不知道客人私下关系。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 靠窗那排？最少提前两周。……您也是听了直播来的？今天第三拨了。
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[1]` 会员号不能给。您拿直播里一句话来对，我更不能说。
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

- `$case.delegation.outcomes.zhou-accountant.text` 五月、六月都在 8 号进一万，七月停；这能证明一条规律断了，不能证明王**是谁。49,800 去了 3301，也只能证明钱离开，不证明用途。钱只认路径，不替人起名字。

## 小林老师

- **固定性格：** 热络的感性现实派
- **受压反应：** 先替行业解释一句，再把行话翻成人话。
- **防御动作：** 笑着纠偏，拆一次话术就补一次行业辩护。
- **知识边界：** 只解释婚恋行业话术和流程，不知道本案人物私下做过什么。

### 后台／材料回流

- `$case.delegation.outcomes.lin-matchmaker.text` 这个账单我看不出门道。但一个人肯按月替另一个人填窟窿，在我们行里，这叫“关系没断干净”。当笑话听吧。

## 张法医

- **固定性格：** 技术洁癖型理性派
- **受压反应：** 碰到来源不全的材料会停止讨论结论。
- **防御动作：** 先查链条，再谈内容。
- **知识边界：** 只判断证据链与技术可检验性，不认定关系或动机。

### 后台／材料回流

- `$case.delegation.outcomes.zhang-forensic.text` 流水单不是我的领域。链条上说，银行流水造假成本极高，这几页大概率是真的——所以更值得认真对。……先挂了啊，外卖在敲门，再不接汤就洒楼道了。

## V哥

- **固定性格：** 沉着的直觉教练
- **受压反应：** 玩家越急，他越让人停一下，只比较两件已知事物。
- **防御动作：** 短句，先停，再分开看。
- **知识边界：** 只知道玩家当前已经听见或看见的内容。

### 夜 A

- `$case.sceneVersions[0].helperHint` 先把“奖金晚发”和“社保停了两个月”分开看：他开口借钱前，哪件事没说。
- `$case.sceneVersions[1].helperHint` 八万先别当成一团。按失业前后切一刀，再看大额消费落在哪边。
- `$case.sceneVersions[2].helperHint` 别急着评价那顿饭。把订座、点单、发照片三个动作分别找主语。
- `$case.sceneVersions[3].helperHint` “投资”是称呼，不是证据。先看东西最后在哪、谁实际用过。
- `$case.sceneVersions[4].helperHint` 把八万减去已经说清的消费，剩下那块才是这一段没解释的。

### 夜 B

- `$case.sceneVersions[5].helperHint` 先听她为什么拖到第二晚才说这段。设备在谁屋里，改变了她前一晚的哪句话？
- `$case.sceneVersions[6].helperHint` 两句话挨得很近：先说怕失去她，后面紧接着要她做什么？

# 理发店排班表

## 林旭阳

- **固定性格：** 温热而克制
- **受压反应：** 担心误判时先缩短句子，把混在一起的事实拆开。
- **防御动作：** 把感情和判决分开，用小而合法的试探代替情绪宣判。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 夜 A

- `$case.openingDialogue[1]` 先说你们平时怎么相处。那张表出来以后，哪一栏又让你停住了？
- `$case.nightStructure.hangup.hostLine` 好。表留下。明晚别只带他的解释回来，也把你愿意承认的带回来。
- `$case.sceneVersions[0].casualQuestions[0].question` 你在他们店剪了多久头发？
- `$case.sceneVersions[0].casualQuestions[1].question` 相亲那次是谁牵的线？
- `$case.sceneVersions[0].casualQuestions[2].question` 他多大?
- `$case.sceneVersions[0].questionOptions[0].question` 你们到底说没说过在一起？
- `$case.sceneVersions[0].questionOptions[1].question` 关系没说死，你为什么一直等？
- `$case.sceneVersions[1].casualQuestions[0].question` 店长骂他，他都怎么跟你说？
- `$case.sceneVersions[1].casualQuestions[1].question` 帮他转活动，你朋友什么反应？
- `$case.sceneVersions[1].questionOptions[0].question` 他说完受委屈，下一句通常是什么？
- `$case.sceneVersions[1].questionOptions[1].question` 你替他转活动时，觉得自己在帮谁？
- `$case.sceneVersions[2].casualQuestions[0].question` 那天你办卡了吗？
- `$case.sceneVersions[2].casualQuestions[1].question` 小妹喊嫂子，他什么反应？
- `$case.sceneVersions[2].questionOptions[0].question` “自己人”怎么就接到年卡上了？
- `$case.sceneVersions[2].questionOptions[1].question` 小妹喊嫂子，你为什么不否认？
- `$case.sceneVersions[3].casualQuestions[0].question` 那张表你存下来了吗？
- `$case.sceneVersions[3].casualQuestions[1].question` 备注里“稳情绪”三个字，你第一眼什么感觉？
- `$case.sceneVersions[3].questionOptions[0].question` 这张表记的是发型，还是人能派什么用？
- `$case.sceneVersions[3].questionOptions[1].question` 看到自己那行“稳情绪”，你先想了什么？

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[1]` 标准表和她拿过的好处，你先拆哪件？
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[1]` 那就只带回边界：旧表能说明行业怎么服务，说明不了 Tony 为什么那样记人。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[1]` 好处留着，私表也留着。两边不互相抵。
- `$case.overnightStructure.dayScenes[2].body.beats[1]` 我只问一件：Tony 私下那张表，你见过完整原表吗？

### 夜 B

- `$case.sceneVersions[4].beforeVersion.lines[5]` 他还说别的没有?
- `$case.sceneVersions[5].questionOptions[0].resistanceBeat.lines[1]` ……这句我接不住。先记下。
- `$case.sceneVersions[6].sceneCloser.lines[0]` 表念完了。今晚就到——
- `$case.sceneVersions[6].sceneCloser.lines[6]` 嗯。这句记下了。
- `$case.overnightStructure.callbackOpeners.店外称呼观察.firstConflict.hostLine` 他跟熟客也这么说。你再听一遍，那句话后面接的是什么？
- `$case.overnightStructure.callbackOpeners.店外服务序列.firstConflict.hostLine` 插位完就登记。你以前享受这个顺序时，问过为什么吗？
- `$case.overnightStructure.callbackOpeners.培训页圈注.firstConflict.hostLine` 那五个字不在标准表里。昨晚你为什么还说‘店里都这样’？
- `$case.overnightStructure.callbackOpeners.顾问回单.firstConflict.hostLine` 表是真的。你最怕他今晚怎么解释那一列？
- `$case.overnightStructure.callbackOpeners.吹风机回放.firstConflict.hostLine` 你把吹风机剪掉以后，那句话听起来像只给谁的？
- `$case.overnightStructure.callbackOpeners.女客拉群立场.firstConflict.hostLine` 你支持她留表，却不肯站到店门口。怕闹大，还是怕别人问你拿过什么？
- `$case.overnightStructure.callbackOpeners.咨询者止损立场.firstConflict.hostLine` 你说止损。要是她把表公开，你会不会又劝她算了？
- `$case.overnightStructure.callbackOpeners.培训模板说明.firstConflict.hostLine` 拿它垫着，你就不用问什么了？
- `$case.overnightStructure.callbackOpeners.店里的标准表.firstConflict.hostLine` 旧表没那一列。你还打算用‘店里规矩’替它挡吗？
- `$case.overnightStructure.callbackOpeners.那次六折.firstConflict.hostLine` 好处都摆完了。表的事，你还问不问？
- `$case.overnightStructure.callbackOpeners.店长门口拒答.firstConflict.hostLine` 他只是关了门。别替他补成心虚。你想接着问哪块？
- `$case.sceneVersions[4].casualQuestions[0].question` 老板娘那句话之后，店里人怎么看你？
- `$case.sceneVersions[4].casualQuestions[1].question` 年卡多少钱？
- `$case.sceneVersions[4].casualQuestions[2].question` 你姨知道这事了吗?
- `$case.sceneVersions[4].questionOptions[0].question` “老板娘”后面，他紧接着聊了什么？
- `$case.sceneVersions[4].questionOptions[1].question` 他说“老板娘”时，你信了多少？
- `$case.sceneVersions[5].casualQuestions[0].question` 你闺蜜后来还去过吗？
- `$case.sceneVersions[5].casualQuestions[1].question` 那次折扣是谁主动说的？
- `$case.sceneVersions[5].questionOptions[0].question` 那次六折，你当人情收，还是当带客算？
- `$case.sceneVersions[5].questionOptions[1].question` 闺蜜知道你们没确认关系吗？
- `$case.sceneVersions[6].casualQuestions[0].question` 你现在还去那家店吗？
- `$case.sceneVersions[6].casualQuestions[1].question` 那个开过店的朋友，怎么认识的？
- `$case.sceneVersions[6].casualQuestions[2].question` 那个号，你退了吗?
- `$case.sceneVersions[6].questionOptions[0].question` 最后那列排的是班，还是人的下一步？
- `$case.sceneVersions[6].questionOptions[1].question` 你觉得会不会只是店里的玩笑备注？

### 终局

- `$case.hostDisclosure.text` 我做节目这些年，最怕的就是“自己人”这三个字。它不收钱，收的都比钱贵。
- `$case.deepFollowup.question` 那我多问一句，看到排班表里写投店、带客以后，你自己当时为什么还愿意接那些店里的事？
- `$case.stageJudgement` 这案卡在两层：话术和维护表是店里教的没错，可培训页里没有“下一次推进”；她说自己只是心软，可免费剪发、插号和带客折扣，她都收过。
- `$case.caseClosing.verdict` 林旭阳没有替她给这段关系定性，只把“自己人”后面接着的办卡、带客和投店拆开了。

### 其他出声面

- `$case.careChoices[0].hostLine` 年卡别办，号先留着。头发该剪还得剪——换家店。
- `$case.careChoices[1].hostLine` 受用不丢人。想被人当自己人，谁都想。
- `$case.careChoices[2].hostLine` 群里的事不急。想不好，就来节目里想。

## 案二咨询者·何

- **固定性格：** 渴望特殊性的社交型人格
- **受压反应：** 引用他的原话前会停；问到办卡金额时突然不再铺垫。
- **防御动作：** 把得到的好处说成顺手帮忙。
- **知识边界：** 知道自己的聊天、消费、带客和听过的回放，不知道Tony给多少人做过同样标记。

### 夜 A

- `$case.openingDialogue[0]` 主播你好。相亲认识的，理发师，暧昧了几个月。昨天他本来要发预约时间，手一滑，给了我一张店里的表。我先当排班看。看着看着，不像。
- `$case.sceneVersions[0].casualQuestions[2].lines[0]` 二十九。
- `$case.sceneVersions[0].casualQuestions[2].lines[2]` 说的。
- `$case.sceneVersions[1].sceneCloser.lines[0]` ……等下，我外卖到了，搁门口就行——嗯，你继续。
- `$case.sceneVersions[3].sceneCloser.lines[0]` 今天降温，我在阳台说的，冷。我去拿件外套，你等我十秒。
- `$case.nightStructure.hangup` ……他一直打。我今晚不接了。那张表我现在再往下看，只会先替自己找理由。明晚这个点，我回来。
- `$case.openingComplaint` 咨询者连线说：“我和相亲认识的一个发型师暧昧了几个月，本来以为快要往前走一步了。结果他昨晚手滑发错一张店里的表，我盯着看了半个钟头，到现在说不上来哪里怪。”
- `$case.sceneVersions[0].version` 他一下班就找我。只有我能接住他——原话是：“只有你能接住我。”别人都不懂。我们没正式说在一起，可天天聊到凌晨。店里剪头不收我钱，号满了也给我插。我就……替他转过几次活动。别人问，我嘴上说还没有，心里想的是，快了吧。
- `$case.sceneVersions[0].revisedVersion` ……“只有你能接住我”，我当宝贝存了半年。那张表一圈，我再听，像店里一键发出去的。
- `$case.sceneVersions[0].casualQuestions[0].answer` 一年多。最早是同事推荐的，后来就只找他。
- `$case.sceneVersions[0].casualQuestions[1].answer` 我姨。她就说人家手艺人踏实。现在想想，介绍完第二周，他就开始给我留最晚的号。
- `$case.sceneVersions[0].questionOptions[0].answer` 没有。他只说“你跟别人不一样”。我一问算什么，他就笑，说慢慢来。
- `$case.sceneVersions[0].questionOptions[0].guardedAnswer` 他说慢慢来。我就等了。
- `$case.sceneVersions[0].questionOptions[1].answer` 他叫我自己人，剪头不收钱，满号也留位置。我承认，我听着受用。再问下去，万一他说我就是顾客呢？
- `$case.sceneVersions[1].version` 后来我往回翻，才看出顺序。他先发语音，说店长又骂他了，末了补一句：只跟我讲。我跟朋友提他，也只会说“他说我像店里自己人”。我一心软，他就让我帮忙转活动。我转了。过两天，他又问我哪个朋友要剪头。那阵子我留过一条语音，先放后台吧，我现在听不了。店里确实教客户维护，我拿这句话哄了自己很久。
- `$case.sceneVersions[1].casualQuestions[0].answer` 多半是语音。有时候发完又撤一条，你知道吧，就那种撤回，你看见小红点了但内容没了，我就猜他是不是说了重话又后悔。有回凌晨一点多，连着七条，最长那条五十九秒，我躺被窝里听完，又倒回去听了一遍。……哎，反正那阵子手机一亮，我就怕他又挨骂了。
- `$case.sceneVersions[1].casualQuestions[1].answer` 有个闺蜜真去剪了，还说不错。后来她办没办卡，我没好意思问。
- `$case.sceneVersions[1].questionOptions[0].answer` 先让我转活动。过几天又问，哪个朋友要剪头。……年卡也提过。不是每次都挨得那么紧，可现在往回翻，我躲不开那个顺序。
- `$case.sceneVersions[1].questionOptions[0].guardedAnswer` 活动、剪头这些。我那时当成自己人的事。
- `$case.sceneVersions[1].questionOptions[1].answer` 帮他，也像在帮“我们以后”。他叫我自己人，给折扣、送护理。我不肯往拉客上想。真想了，我就得问：那我到底算谁？
- `$case.sceneVersions[2].version` 办卡那天最怪。店长在前台，他先说我“不是普通顾客”。旁边小妹就喊“嫂子”。我没接，也没否认。店长马上跟一句：自己人办年卡划算，反正以后常来。我当时脑子里只剩“嫂子”。年卡那半句，像没听见。
- `$case.sceneVersions[2].casualQuestions[0].answer` 没有，当场没办。我说回去想想。可那天之后，他再提年卡，我就没那么排斥了。
- `$case.sceneVersions[2].casualQuestions[1].answer` 他笑了一下，说别闹。不是否认，是那种大家都懂的笑。
- `$case.sceneVersions[2].questionOptions[0].answer` 他先说我不是普通顾客，小妹喊嫂子，店长就接“自己人办年卡最划算”。我听的是自己人，店里听的，大概是年卡。
- `$case.sceneVersions[2].questionOptions[0].guardedAnswer` 先叫自己人，再说年卡。我没办，可那一下确实被架住了。
- `$case.sceneVersions[2].questionOptions[1].answer` 因为我不想。很虚荣，也很受用。可我没否认一句玩笑，不等于我答应被他们往年卡那边推。
- `$case.sceneVersions[3].version` 昨天那张表，表头写预约。可备注里不是“烫发”“修刘海”，是“情绪稳定”“办卡意向强”“朋友多”。我那行三个字：稳情绪。我先截图，才敢往下看。后来发给开过店的大学室友，她没骂人，只让我把店里会记的东西，跟最后一列分开看。
- `$case.sceneVersions[3].casualQuestions[0].answer` 截了。当时手比脑子快。我还顺手发给我室友了，就开过店那个。她那会儿在带娃，凌晨才回我，先回了个问号，又打电话过来……你知道吧，她一打电话，我反而不敢接了。缓了十分钟才回过去。
- `$case.sceneVersions[3].casualQuestions[1].answer` 说不上来。就是觉得……我在他那儿是个项目。这话我没跟人说过。
- `$case.sceneVersions[3].questionOptions[0].answer` 写的全是我能不能哄、会不会办卡、能不能带朋友。发型那一栏反倒空着。
- `$case.sceneVersions[3].questionOptions[0].guardedAnswer` 发型那栏是空的。别的，我不想替他念。
- `$case.sceneVersions[3].questionOptions[1].answer` 先想是不是全店都这么写。店里确实教统一话术，也有客户维护表。只要大家都有，我还能骗自己是我多心。

### 夜 B

- `$case.sceneVersions[4].beforeVersion.lines[0]` 他凌晨发来一张券。满三百减一百二，烫染通用。
- `$case.sceneVersions[4].beforeVersion.lines[2]` 配的字是：气消了来店里，我给你弄好看点。
- `$case.sceneVersions[4].beforeVersion.lines[4]` 我气的是表，他给我发券。
- `$case.sceneVersions[4].beforeVersion.lines[6]` 没了。就一张券。
- `$case.sceneVersions[5].questionOptions[0].resistanceBeat.lines[0]` 你这问法，跟他那张表一样，把我也分了类。
- `$case.sceneVersions[6].sceneCloser.lines[1]` 最后说个事。跟表没关系。
- `$case.sceneVersions[6].sceneCloser.lines[3]` 上礼拜他还给我修过刘海，手特别轻。
- `$case.sceneVersions[6].sceneCloser.lines[5]` ……一个把我写成『稳情绪』的人，手上怎么能那么轻。
- `$case.overnightStructure.callbackOpeners.店外称呼观察.firstConflict.callerLine` 我听成关系。插号、免单都有，我也愿意那么听。
- `$case.overnightStructure.callbackOpeners.店外服务序列.firstConflict.callerLine` 没问。我怕一问，自己也成了普通客户。
- `$case.overnightStructure.callbackOpeners.培训页圈注.firstConflict.callerLine` 那句话好用。我一说，‘自己人’还能留着。
- `$case.overnightStructure.callbackOpeners.顾问回单.firstConflict.callerLine` 怕他说，都是为了业绩。那我连生气都像不懂店里规矩。
- `$case.overnightStructure.callbackOpeners.吹风机回放.firstConflict.callerLine` 像只给我的。我就是想这么听。
- `$case.overnightStructure.callbackOpeners.女客拉群立场.firstConflict.callerLine` 都怕。免费剪、插号，我拿过。我不想领头装成什么都没拿。
- `$case.overnightStructure.callbackOpeners.咨询者止损立场.firstConflict.callerLine` 不会劝她删。我只是不替她带头。
- `$case.overnightStructure.callbackOpeners.培训模板说明.firstConflict.callerLine` 不用问，他到底把我当什么。
- `$case.overnightStructure.callbackOpeners.店里的标准表.firstConflict.callerLine` 不挡了。谁加的，让他拿原件说。
- `$case.overnightStructure.callbackOpeners.那次六折.firstConflict.callerLine` 敢。好处归我认，私表归他答。
- `$case.overnightStructure.callbackOpeners.店长门口拒答.firstConflict.callerLine` 能。他只划清了店里的责任。私表还是空着。
- `$case.sceneVersions[4].version` 我拿表问他。他第一句就是：“我从来没说只有你一个。”可聊天还在。他明明发过：“以后店开起来，你就是老板娘。”不是求婚，我知道。可听过这句，再听年卡、投一点，我的防备就是会松。
- `$case.sceneVersions[4].casualQuestions[0].answer` 有个小妹叫过我一次“嫂子”。他没接话，也没否认。
- `$case.sceneVersions[4].casualQuestions[1].answer` 三千六……不对，三千八。带两次护理那种。我没办。不是舍不得，是那天刚好看到那张表。
- `$case.sceneVersions[4].casualQuestions[2].answer` 知道了。她第一句是：『手艺人也分好坏，回头我再给你踅摸一个。』……我还没说我难受呢，她已经在找下一个了。她是怕我卡在这儿。我懂。
- `$case.sceneVersions[4].questionOptions[0].answer` 年卡。没隔多久，说我以后常来，办了方便。后来又提，店要扩大，我可以先投一点。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 提过办卡。投店那句，他后来就岔开了。
- `$case.sceneVersions[4].questionOptions[1].answer` 深夜说的。我没当求婚，可我愿意往那边信。现在把后面的年卡、投店接上，我有点犯恶心。
- `$case.sceneVersions[5].version` 我也不是一点便宜没拿。带闺蜜去剪头，他给她六折，我那次护理直接免了。闺蜜一出门就说：“你这关系可以啊。”我嘴上没有没有，心里可受用了。直到看见表上“朋友多，带客”，我才又想起那张六折单。
- `$case.sceneVersions[5].casualQuestions[0].answer` 去过一次。她说剪得还行，问我能不能还按上次那个价。我当时没多想。
- `$case.sceneVersions[5].casualQuestions[1].answer` 他主动。他说我的朋友就按自己人价，店长也在旁边点了头。
- `$case.sceneVersions[5].questionOptions[0].answer` ……当时只当人情。可表上写着“朋友多，带客”，我没法装看不见。折扣是真的，我受用也是真的。
- `$case.sceneVersions[5].questionOptions[0].guardedAnswer` 有折扣，也有免单。具体怎么算的，我没问。
- `$case.sceneVersions[5].questionOptions[1].answer` 知道一点，可她以为快成了。她还说，他这么给面子，总不能只拿你当普通客户吧。我没纠正。
- `$case.sceneVersions[6].version` 最后那一列，叫“下一次推进”。我那行：年卡已聊，可稳情绪。另一个：能投店，约饭再谈。还有一个：朋友多，带客。我盯了很久。原来不止我一个人在等一句准话。昨晚我还拿“店里都这样”垫脚。今天不垫了。那列不是预约。
- `$case.sceneVersions[6].casualQuestions[0].answer` 号还留着，人没去。头发长了，随便找了家快剪。
- `$case.sceneVersions[6].casualQuestions[1].answer` 大学室友。她开过两年美容店，后来累垮了转行。她看东西毒。
- `$case.sceneVersions[6].casualQuestions[2].answer` 还没。
- `$case.sceneVersions[6].questionOptions[0].answer` 人的下一步。我的名字后面是“年卡已聊、稳情绪”；别人的也不是班次，是“能投店”“能带客”。
- `$case.sceneVersions[6].questionOptions[0].guardedAnswer` 不像只排员工。再往下我不想替他念。
- `$case.sceneVersions[6].questionOptions[1].answer` 只有我一个，我还能这么骗。可每个人后面都有一个用处，还有下一步。我骗不下去了。
- `$case.overnightStructure.callbackOpeners.店外称呼观察.line` 「门边那句我听见了。他也叫别人‘自己人’。我昨晚只抓住这三个字，后面那句续护理，像没进耳朵。」
- `$case.overnightStructure.callbackOpeners.店外服务序列.line` 「隔着玻璃，只看见他插位，转头又登记会员。没听见称呼。两个动作挨得太近，我看着不舒服。」
- `$case.overnightStructure.callbackOpeners.培训页圈注.line` 「店里的培训页有办卡，也有下次预约。翻到最后，我又看了一遍。‘下一次推进’真没有。」
- `$case.overnightStructure.callbackOpeners.顾问回单.line` 「顾问只肯认表是真的。至于他对谁真，我拿着那张表也问不出来。」
- `$case.overnightStructure.callbackOpeners.吹风机回放.line` 「吹风机那段，我听清了。那晚他还在店里。背景一直没消失，是我把它剪掉，只留了‘只有你能接住我’。」
- `$case.overnightStructure.callbackOpeners.女客拉群立场.line` 「她要拉群，还要去店里。我不去。我先退卡，把带过去的朋友叫回来……那张表，她要留就留。」
- `$case.overnightStructure.callbackOpeners.咨询者止损立场.line` 「我劝她先退卡，别去堵门。他的电话我也没接。可我没让她删表，这事他得自己说。」
- `$case.overnightStructure.callbackOpeners.培训模板说明.line` 「培训页我来回看了三遍。店里会教人办卡，这是真的。可‘下一次推进’……没有。我昨晚拿前半张纸给自己垫台阶。」
- `$case.overnightStructure.callbackOpeners.店里的标准表.line` 「两张表摆一起，旧表挺干净的。项目、时间、备注。那张私表多出来的，全是人。」
- `$case.overnightStructure.callbackOpeners.那次六折.line` 「六折那次我记得。她们都夸我有面子，我也没说这是店里活动。好处我拿了。」
- `$case.overnightStructure.callbackOpeners.店长门口拒答.line` 「店长把门挡着，只认维护、办卡。完整私表，他说没见过。再问，他就不说了。」
- `$case.overnightStructure.callbackFallback.line` 「我回来了。那张表我又看了一遍。你白天先查了哪一处？」
- `$case.overnightStructure.postures.againstCaller` 「插号、免单、朋友六折，我都认。可我没答应被写成下一步生意。」
- `$case.overnightStructure.postures.withCaller` 「我没接他的电话。你白天去了哪里，先说给我听。」
- `$case.nightStructure.returnStance.lines.defensive` 我差点不打回来。弹幕说我也有份……我自己人那点儿好处，我又没否认。可那列推进，不是我自己写上去的。
- `$case.nightStructure.returnStance.lines.open` 我回来了。表的事你继续问——这回我不替行业开脱。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。隔了一天再看，那一列还在。

### 终局

- `$case.deepFollowup.answer` 剪头不要钱，号随便插，带闺蜜去还有六折，活动我顺手就转了。因为我也吃了那个“自己人”的感觉。他说以后店里有我一个位置，我就觉得办卡、转活动、带朋友过去都像在帮我们。现在看，他不承认关系，我也没逼他说清楚，投店、带客这些难听话就被我们一起往后拖了。

### 其他出声面

- `$case.careChoices[0].lines[0]` ……嗯。楼下新开了家，十五块快剪。就是不聊天。
- `$case.careChoices[0].lines[2]` 不聊挺好。
- `$case.careChoices[1].lines[0]` ……你这句，比他半年说的都实在。
- `$case.careChoices[2].lines[0]` 行。想不好我就再打。
- `$case.overnightStructure.returnBeat.lines[0]` 我妈屋里电视还开着，吵的话你说一声。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 等会儿。刚那条弹幕我看见了——『收了好处装什么受害者』。
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 谁装了?!我免单那次是他硬免的!你们倒是来一个人剪头试试啊!
- `$case.overnightStructure.liveCounterBeats[0].choices[0].lines[0]` ……嗯。你问吧。
- `$case.overnightStructure.liveCounterBeats[0].choices[1].lines[0]` ……收了。行了吧。
- `$case.overnightStructure.liveCounterBeats[0].choices[1].lines[2]` 往下问。
- `$case.overnightStructure.liveCounterBeats[0].choices[2].lines[1]` ……算了。当我没看见。

## Tony

- **固定性格：** 讨喜的即兴交易者
- **受压反应：** 被逼着定义关系时退回服务和店务，把情绪词说成维护。
- **防御动作：** 给每个人定制一句专属感，却拒绝承诺身份。
- **知识边界：** 知道自己的聊天、会员记录与剪辑动作，不代表门店制度之外的人。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 姐，稍等。我给你插个位。
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[0]` 姐，你还是自己人。晚点我给你插一位。
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[2]` 不续就不续，先坐。

### 后台／材料回流

- `$case.respondentNote.text` 表的事，是我做事糙，认。但话说清楚：我没跟谁说过是女朋友，一个都没有。办卡带客是店里的活，谁对我好我记着，这两码事。老板娘那句是酒话，当真我也没办法。

## 案二邻桌常客

- **固定性格：** 厌烦套路的直肠子
- **受压反应：** 听见熟悉话术就直接复述自己听过的版本。
- **防御动作：** 只说耳朵听见的，不负责解释。
- **知识边界：** 只知道同席时听见的当面话，不知道麦外私聊。

### 白天

- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[1]` 又自己人？上回那护理我不续。你别拿这句哄我。

## 案二开店朋友

- **固定性格：** 务实的行业老手
- **受压反应：** 把关系争论压回标准字段和业绩归属。
- **防御动作：** 只比字段、权限和收益。
- **知识边界：** 知道理发店常规运营，不知道这家店和Tony的全部事实。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 水温、发型、忌讳、办卡可能，我们都会记。熟客多，忘一次就丢人。
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[0]` 我那张表记到下次护理就停。Tony 那张谁加的，我没在店里。别借我的表给他作证。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[0]` 插号、免单、朋友六折，她都拿过。拿过不等于同意进私表。可她回麦再说自己只是普通顾客，我不认。

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
- **知识边界：** 只知道自己收到的话、表和投入，不知道咨询者完整经历。

### 后台／材料回流

- `$case.investigationHooks[1].material` 她发来的表里，她那栏写着“能投店”，后面跟着“约见朋友、聊分红”。另一栏写“情绪稳住，年卡下次推”。她留言说：“我不退群，也不想算了。我要当面问他，这张表到底还写过几个人。你们要去，叫上我。”

## 老方

- **固定性格：** 急躁的结果主义者
- **受压反应：** 数据越差，句子越像截止日期和命令。
- **防御动作：** 把关心包装成指标，把认可包装成下一项要求。
- **知识边界：** 只知道节目运营、后台曲线和公开播出内容，不知道案件麦外真相。

### 其他出声面

- `$case.overnightStructure.liveCounterBeats[1].text` 店家商务函到平台了，点名这通。法务让缓。你要继续，数据得扛住。——方

## 赵律师

- **固定性格：** 锋利的理性派
- **受压反应：** 听见无证据定性会立刻打断，并补适用条件。
- **防御动作：** 短句、免责、拒猜动机。
- **知识边界：** 只解释法律与责任效果，不替案件当事人作证，不指点玩家圈哪一栏。

### 后台／材料回流

- `$case.delegation.outcomes.zhao-lawyer.text` “老板娘”这种话在法律上一文不值。可它值三千八——这句不归我管，归她自己管。

## 周会计

- **固定性格：** 冷静的数字理性派
- **受压反应：** 删掉形容词，只报金额、时间和路径。
- **防御动作：** 按日期排列，拒绝替数字添故事。
- **知识边界：** 只读材料中已经出现的账目与流程，不认定未知付款人身份。

### 后台／材料回流

- `$case.delegation.outcomes.zhou-accountant.text` 年卡三千八进的是店收银还是个人码，让她查下支付记录的商户名。进店的算业绩，进个人的算什么，她该想清楚。

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

- `$case.delegation.outcomes.zhang-forensic.text` 截图链条完整，没有拼接痕迹。表是真表，字是一次录入——这张图本身干净，脏的不在图上。

## V哥

- **固定性格：** 沉着的直觉教练
- **受压反应：** 玩家越急，他越让人停一下，只比较两件已知事物。
- **防御动作：** 短句，先停，再分开看。
- **知识边界：** 只知道玩家当前已经听见或看见的内容。

### 夜 A

- `$case.sceneVersions[0].helperHint` 每天聊天、免费剪发都能让人默认关系。你要追的是：他有没有亲口给关系起过名字。
- `$case.sceneVersions[1].helperHint` 先不判真心假意。只看每次他说压力大以后，下一步总落到什么行动。
- `$case.sceneVersions[2].helperHint` 把“嫂子”“自己人”和“办年卡”按顺序排，看看是谁把哪一步往前推。
- `$case.sceneVersions[3].helperHint` 预约表本该记服务。把正常服务信息和那列人的特征分开看。

### 夜 B

- `$case.sceneVersions[4].helperHint` “老板娘”可以是玩笑，也可以有作用。看它后面紧跟着什么要求。
- `$case.sceneVersions[5].helperHint` 折扣让她得了便宜，这点不能抹掉；再看这份便宜有没有被记进带客逻辑。
- `$case.sceneVersions[6].helperHint` 别被“预约”两个字挡住。逐行看最后一列安排的是发型，还是对人的下一步。

# 存款证明

## 林旭阳

- **固定性格：** 温热而克制
- **受压反应：** 担心误判时先缩短句子，把混在一起的事实拆开。
- **防御动作：** 把感情和判决分开，用小而合法的试探代替情绪宣判。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 夜 A

- `$case.openingDialogue[1]` 见了几次？还有，先开口要材料的是谁？
- `$case.nightStructure.hangup.hostLine` 去。群聊主语先留在台上；白天对原话，别拿谁想看代替谁先开口。
- `$case.sceneVersions[0].casualQuestions[0].question` 你们相亲见了几次？
- `$case.sceneVersions[0].casualQuestions[1].question` 你跟你妈平时什么都聊吗？
- `$case.sceneVersions[0].questionOptions[0].question` 你到底让他准备了什么？
- `$case.sceneVersions[0].questionOptions[1].question` 没问的存款来了，你第一反应是怀疑吗？
- `$case.sceneVersions[0].questionOptions[2].question` 那张存款证明，究竟能证明多久？
- `$case.sceneVersions[1].casualQuestions[0].question` 那顿饭是谁约的地方？
- `$case.sceneVersions[1].casualQuestions[1].question` 谁先把条件聊成问题的？
- `$case.sceneVersions[1].questionOptions[0].question` 他说“也算吧”，你下一句问了什么？
- `$case.sceneVersions[1].questionOptions[1].question` 服务员一来，你怎么就不问了？
- `$case.sceneVersions[1].questionOptions[2].question` 那顿饭谁结的账？
- `$case.sceneVersions[2].casualQuestions[0].question` 介绍人跟男方家什么关系？
- `$case.sceneVersions[2].casualQuestions[1].question` “家里省心”这话你怎么理解？
- `$case.sceneVersions[2].questionOptions[0].question` 你为什么只回“学校是真的”？
- `$case.sceneVersions[2].questionOptions[1].question` 你妈看到原图，没问本科？
- `$case.sceneVersions[3].casualQuestions[0].question` 你怎么知道她跟男方家怎么说的？
- `$case.sceneVersions[3].casualQuestions[1].question` 你当时觉得介绍人偏谁？
- `$case.sceneVersions[3].questionOptions[0].question` 她为什么把两边都说得那么省心？
- `$case.sceneVersions[3].questionOptions[1].question` 她有没有替他的收入作过证？
- `$case.sceneVersions[3].questionOptions[2].question` 你回家时，又多说了哪两个词？
- `$case.sceneVersions[4].casualQuestions[0].question` 他解释 MBA 的时候，语气什么样？
- `$case.sceneVersions[4].casualQuestions[1].question` 你自己学历怎么样？
- `$case.sceneVersions[4].questionOptions[0].question` 那张学校图，哪三样没放在一起？
- `$case.sceneVersions[4].questionOptions[1].question` 这三样，你补给家里了吗？

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[2]` 哪几句是材料里没有的？
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[0]` 两边的原话都留。给女方家是「收入稳」，给男方家是「不计较学历」，不替任何一边省掉半句。
- `$case.overnightStructure.dayScenes[0].body.choice.options[1].resultBeats[0]` 我只圈材料里没有的两句：「收入稳」和「不计较学历」。校名、项目和存款图先原样留下。
- `$case.overnightStructure.dayScenes[1].body.beats[1]` 资料是他一个人整理的吗？

### 夜 B

- `$case.sceneVersions[5].beforeVersion.lines[5]` 多了四千。
- `$case.sceneVersions[6].sceneCloser.lines[0]` 材料就对到这儿。
- `$case.sceneVersions[6].sceneCloser.lines[6]` ……那张就别发后台了。
- `$case.overnightStructure.callbackOpeners.介绍人双边记录.firstConflict.hostLine` 她替你家添了‘收入稳’。这三个字，你当时信了多少？
- `$case.overnightStructure.callbackOpeners.介绍人添话标记.firstConflict.hostLine` 把她添的两句划掉。剩下的，你还跟家里怎么说？
- `$case.overnightStructure.callbackOpeners.表姐门口口供.firstConflict.hostLine` 门里那句是“家里一起挑的”。你昨晚把这几张图全算在谁头上？
- `$case.overnightStructure.callbackOpeners.双份材料圈注.firstConflict.hostLine` 你把两张纸接成一句话，最先拿去说给谁听？
- `$case.overnightStructure.callbackOpeners.家里群原话.firstConflict.hostLine` 你先问的流水。为什么非要借你妈的嘴再问一遍？
- `$case.overnightStructure.callbackOpeners.饭局停顿回放.firstConflict.hostLine` 你没追本科。怕什么，自己说。
- `$case.sceneVersions[5].casualQuestions[0].question` 团购那顿饭，最后谁付的？
- `$case.sceneVersions[5].casualQuestions[1].question` 你妈见过他照片吗？
- `$case.sceneVersions[5].casualQuestions[2].question` 你妈现在什么态度?
- `$case.sceneVersions[5].questionOptions[0].question` 为什么一直说是你妈想看流水？
- `$case.sceneVersions[5].questionOptions[1].question` “以后钱一起管”，你原样告诉他了吗？
- `$case.sceneVersions[6].casualQuestions[0].question` 工资卡那句，他说完你们冷场了多久？
- `$case.sceneVersions[6].casualQuestions[1].question` 你身边有婚后一起管钱的例子吗？
- `$case.sceneVersions[6].casualQuestions[2].question` 他现在还给你发消息吗?
- `$case.sceneVersions[6].casualQuestions[3].question` 周末那顿饭，你还想见吗?
- `$case.sceneVersions[6].questionOptions[0].question` 他问工资卡，你怎么回的？
- `$case.sceneVersions[6].questionOptions[1].question` 他算得细，能证明收入有问题吗？

### 终局

- `$case.hostDisclosure.text` 接下来这个问题有点冒犯。我先说一句：当年有人这么问过我，我恼了半年，后来谢了人家。
- `$case.deepFollowup.question` 你要看他的收入和工资卡。那你自己的工资，一个月到底多少？
- `$case.stageJudgement` 真图归真图，真图能证明什么是另一回事。他把本科和持续收入留在图外，她把流水的起头人留在话外；介绍人再给两边各垫一句好听的，这顿饭才走到今天。
- `$case.caseClosing.verdict` 林旭阳把资料的真和资料的全分开：校名、项目和余额都能是真的，仍不足以替谁承诺长期收入和婚后安排。

### 其他出声面

- `$case.careChoices[0].hostLine` 两个人谈的时候，把你那张表带上。别念，放包里就行。
- `$case.careChoices[0].lines[1]` 放包里，不是放台上。
- `$case.careChoices[1].hostLine` 你查得不过分。想看清楚一个人，不丢人。
- `$case.careChoices[2].hostLine` 谈完什么结果，都可以来说一声。不用带材料。

## 案三咨询者·林

- **固定性格：** 数字化自保的理性派
- **受压反应：** 更爱报精确数字、减少语气词；问到自己的工资时句子骤短。
- **防御动作：** 省略主语，把自己的要求放进‘我妈’名下。
- **知识边界：** 知道自己收到的材料、家庭群和私聊，不知道对方收入构成与MBA学费来源。

### 夜 A

- `$case.openingDialogue[0]` 林旭阳，我这边是相亲。那些图，单看都是真的。可这个周末要见父母，我反而不敢带他去。
- `$case.openingDialogue[2]` 四次。这个周末要见父母。我先跟家里说，他名校毕业，收入也不错。又跟他提了一嘴，我妈会问学校和工作。第二天，三张图一起发过来。我还没问完，晚上又来一张存款证明。那张没人要过。
- `$case.sceneVersions[1].sceneCloser.lines[0]` 你等一下，我把台灯换个档。刺眼。
- `$case.sceneVersions[3].sceneCloser.lines[0]` 我水杯见底了。不管它，继续。
- `$case.nightStructure.hangup` 家里群还在 @ 我。最上面那句是谁先发的，我今晚说不清。白天把整页原话和材料对完，明晚再打进来。
- `$case.openingComplaint` 咨询者连线说：“我们周末要见父母。他发来的图都是真的，可那张没人问过的存款证明，我越看越不敢把饭局定死。”
- `$case.sceneVersions[0].version` 见父母以前，我妈说怕我吃亏。我只提醒他一句：“我妈可能会问学校和工作。”第二天中午，学校、公司、当月收入，三张图一块来了。晚上又补二十八万六的存款证明，说省得饭桌上解释。可收入和存款，我都没问。手机亮了四次，我一张张点开，最后不知道该回哪张。
- `$case.sceneVersions[0].casualQuestions[0].answer` 四次。两次饭，一次展，一次他接我下班。节奏不快不慢。
- `$case.sceneVersions[0].casualQuestions[1].answer` 大事聊。她比我急。我 28，虚岁 29，她逢人就说我不挑，其实是她挑。上个月她把我照片发给三个介绍人，像素还调高了。我说妈，你这是发简历呢。她说简历怎么了，你爸当年也是我筛出来的。……筛出来的。她原话。
- `$case.sceneVersions[0].questionOptions[0].answer` 原话是：“我妈可能会问学校和工作，你别被问住。”没提收入，更没提存款。可这话递过去，就是告诉他，这顿饭要看条件。他全备了。
- `$case.sceneVersions[0].questionOptions[0].guardedAnswer` 只说学校和工作。收入、存款不是我开口要的。
- `$case.sceneVersions[0].questionOptions[1].answer` 不是，是省事。饭桌上不用替他圆。我妈前一天还在催，说多知道一点没坏处。过了半天我才反应过来：没人问，他为什么先答？
- `$case.sceneVersions[0].questionOptions[2].answer` 一天。只证明开出来那天，账上有二十八万六。前一天呢？下个月呢？看不出来。我做审计的，天天挑这种毛病。可那天看到这个数，我先松了口气。
- `$case.sceneVersions[1].version` 第一次正式吃饭，开头还行。介绍人订的靠窗位，说那排要提前两周。他问我审计忙不忙，我问他出差多不多。绕了半天，我才问：“你说的名校，是本科吗？”他夹着一筷子菜，停了十几秒。“也算吧，MBA。”正好服务员来加水。我就让这句话过去了。
- `$case.sceneVersions[1].casualQuestions[0].answer` 介绍人推荐的，说那家包间安静，适合第一次正式聊。最后没有坐包间，坐了窗边那桌。
- `$case.sceneVersions[1].casualQuestions[1].answer` 我。准确说，是我把我妈的话换了个说法问出来。
- `$case.sceneVersions[1].questionOptions[0].answer` 没问。本来该问本科在哪儿读。我听出不对了，可“名校毕业”是我先跟家里说的。一追，先露怯的是我。
- `$case.sceneVersions[1].questionOptions[0].guardedAnswer` 他只说“读过”。我没把本科那句逼出来，服务员一来就算了。
- `$case.sceneVersions[1].questionOptions[1].answer` 他顺势说菜快凉了。我也怕尴尬，就吃菜。那顿饭是我催着往见父母走的，当场拆开，难看的不只他。
- `$case.sceneVersions[1].questionOptions[2].answer` 他付的，用了团购券和积分。一百多块停车费问我 AA。每一笔都说得过去；只是跟他嘴里的收入放在一起，我后来总想起那张券。
- `$case.sceneVersions[2].version` 还有一截，我前面没说。介绍人一开始夸他：“学校好、收入稳、家里也省心。”我回家顺着说成了“名校毕业”。学校图发来，校名有，MBA 项目也有，本科没有。我只说他学校那边确实是真的。那句名校毕业，我没收回来。
- `$case.sceneVersions[2].casualQuestions[0].answer` 他妈的老同事。所以话肯定挑好的说，这我懂。
- `$case.sceneVersions[2].casualQuestions[1].answer` 就是独生子、爸妈有退休金、不用他贴钱。相亲市场上这四个字值钱。
- `$case.sceneVersions[2].questionOptions[0].answer` 因为改口难看。介绍人说学校好，我顺成名校毕业，我妈又跟亲戚夸了。我再补“本科不是那所”，先承认的是我自己没问清。
- `$case.sceneVersions[2].questionOptions[0].guardedAnswer` 校名是真的。别的，我当时不想拆。
- `$case.sceneVersions[2].questionOptions[1].answer` 没问。她看见校名就放心了，我也没提醒。她都夸出去了，我怎么再说，妈，不是你以为的那种名校？那晚我们母女俩，挑的是同一块好看的。
- `$case.sceneVersions[3].version` 后来我妈在群里说介绍人偏男方。她直接甩来两张长截图，语音说得很快：“我偏谁？给你家是学校好、收入稳、家里省心；给他家是女生稳定、家里不折腾、对学历不太计较。两边原话都在，别只截顺耳的。”她两头都挑顺耳的说，就想把这事做成。
- `$case.sceneVersions[3].casualQuestions[0].answer` 后来吵起来，他转过一段聊天给我看，说我也不是一点包装没有。那段里介绍人说我“家里不折腾”。我看完挺刺的。
- `$case.sceneVersions[3].casualQuestions[1].answer` 她偏自己那桩媒。饭能约成就行。
- `$case.sceneVersions[3].questionOptions[0].answer` 她欠男方家一个人情，也想把这事做成。被我妈追着问，她语速更快：“相亲谁不先报个好价？我两边都报了。”两家听完，都觉得自己捡着了。
- `$case.sceneVersions[3].questionOptions[0].guardedAnswer` 她说两边都省心。具体怎么跟他家讲的，我不知道。
- `$case.sceneVersions[3].questionOptions[1].answer` 没有。只说“收入稳”。稳多少、钱从哪儿来，她一句没说。她是不知道，还是根本没问过，我也不清楚。
- `$case.sceneVersions[3].questionOptions[2].answer` “名校毕业、条件不错。”介绍人只说学校好，是我往前顺了一步。我妈一听，就开始催见父母。
- `$case.sceneVersions[4].version` 他一直说名校毕业，细问才说是 MBA。再问，才变成读过名校的 MBA 项目。本科很普通，这段一开始没有。我把学校图放大三遍：校名是真的，项目也是真的。本科和学制没跟校名摆在一起，项目性质也没有。我跟家里只回“学校是真的”。本科那句，还是没说。
- `$case.sceneVersions[4].casualQuestions[0].answer` 不躲。就是说得很顺，顺得像回答过很多遍。
- `$case.sceneVersions[4].casualQuestions[1].answer` 普通一本。所以“名校”两个字我提的时候，其实也在给自己贴金。
- `$case.sceneVersions[4].questionOptions[0].answer` 本科、项目性质、学制。校名和项目都真，可“名校毕业”听起来像本科就在那儿读。剩下的，是我追问才一点点出来。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 本科、项目、学制。我后来才补问。
- `$case.sceneVersions[4].questionOptions[1].answer` 没有。只说学校是真的。“名校毕业”已经讲出去了，再说本科普通，我妈当场得变脸。我当时想，流水要是稳，这一截就算了。

### 夜 B

- `$case.sceneVersions[5].beforeVersion.lines[0]` 今天下午，他又发来一张。
- `$case.sceneVersions[5].beforeVersion.lines[2]` 新的存款证明。日期是今天，金额多了四千。
- `$case.sceneVersions[5].beforeVersion.lines[4]` 我们吵的是本科和流水。他给我开了张新的余额。
- `$case.sceneVersions[5].beforeVersion.lines[6]` 嗯。可能发了工资吧。
- `$case.sceneVersions[6].casualQuestions[2].lines[0]` 发。
- `$case.sceneVersions[6].casualQuestions[2].lines[2]` 间隔很规律。
- `$case.sceneVersions[6].sceneCloser.lines[1]` 还有一份，你们没见过。
- `$case.sceneVersions[6].sceneCloser.lines[3]` 我给这四次见面建了个表。每次的花销、聊的话题、冷场秒数。
- `$case.sceneVersions[6].sceneCloser.lines[5]` 冷场秒数。打出这五个字，我自己都觉得有病。可我停不下来。
- `$case.overnightStructure.callbackOpeners.介绍人双边记录.firstConflict.callerLine` 信了。校名一张，余额一张，我自己把第三个词“稳”补上了。
- `$case.overnightStructure.callbackOpeners.介绍人添话标记.firstConflict.callerLine` 不敢。校名和当天余额还在，‘收入稳’不在。
- `$case.overnightStructure.callbackOpeners.表姐门口口供.firstConflict.callerLine` 我原先把主语全放在他身上。现在得改：材料是他们家一起挑的。
- `$case.overnightStructure.callbackOpeners.双份材料圈注.firstConflict.callerLine` 我妈。说得特别顺，像我早问清了。
- `$case.overnightStructure.callbackOpeners.家里群原话.firstConflict.callerLine` 她是我妈。她问，总比我问好看。
- `$case.overnightStructure.callbackOpeners.饭局停顿回放.firstConflict.callerLine` 后一个。‘名校毕业’是我先说给家里听的。
- `$case.sceneVersions[5].version` 我开始不踏实，是他嘴上收入不错，花钱又每一笔都算。不是没钱，就是……团购、积分，停车费再 AA。我妈在群里问见父母定哪天，往上翻，还有半页在吵流水。谁先提的……先放一放。你们先问他的图。
- `$case.sceneVersions[5].revisedVersion` ……整页我看见了。流水是我先提的。两分钟后，我妈才说婚后管钱。这个顺序，我一直没讲。
- `$case.sceneVersions[5].casualQuestions[0].answer` 他。用了券，又用了会员积分。他算得很快，我坐对面看着，有点走神。
- `$case.sceneVersions[5].casualQuestions[1].answer` 见过。第一句问的是“个子多高”，第二句就是“做什么的”。
- `$case.sceneVersions[5].casualQuestions[2].answer` 就一句：『过了年你就 29 了，先别把人得罪死。』……这话她今年说了四回。我记着次数呢。你看，职业病。
- `$case.sceneVersions[5].questionOptions[0].answer` 我不想显得只看钱。拿我妈挡着，随时还能往后退。可最先想知道他每月到底赚多少的人，是我。
- `$case.sceneVersions[5].questionOptions[0].guardedAnswer` 流水是我先提。后面那句，才是我妈接的。
- `$case.sceneVersions[5].questionOptions[1].answer` 没有。我只说家里想确认稳定。真把那句原样递过去，这顿饭可能当场就散。连我自己听着都重。
- `$case.sceneVersions[6].version` 团购是真的，积分也是真的。停车 AA，也是真的。我当时盯的都是这些小钱。饭后他发微信：“再问下去，是不是工资卡也要交出来？”我没回。因为我妈真说过，结婚以后钱最好一起管，至少得透明，最好交一部分。这半句，我没递给他。
- `$case.sceneVersions[6].casualQuestions[0].answer` 十几秒吧。后来是服务员来加水解的围。
- `$case.sceneVersions[6].casualQuestions[1].answer` 我表姐。管得挺好，但她挣得比姐夫多。多百分之三十几吧，具体没算过——不对，我算过。百分之三十七。你看，我就是这样的人。这话我没跟我妈说过。我们家饭桌上，账是不能上桌的。
- `$case.sceneVersions[6].casualQuestions[3].answer` 不知道。
- `$case.sceneVersions[6].questionOptions[0].answer` 我说：“你别把话说那么难听，我只是想看稳定。”钱以后放不放一起，我没接。那才是我们一直没谈的。
- `$case.sceneVersions[6].questionOptions[0].guardedAnswer` 我只说想看稳定。钱以后怎么管，我没敢接。
- `$case.sceneVersions[6].questionOptions[1].answer` 我现在不敢这么说。见父母前就问流水、问工资怎么管，换谁都不舒服。我拿团购和停车费往收入上猜，是在给自己找证据。
- `$case.overnightStructure.callbackOpeners.介绍人双边记录.line` 「介绍人把两边的记录摊开了。‘收入稳’，她给我家加的；‘不计较学历’，她给他家加的。我妈说名校的时候，我也没拦。」
- `$case.overnightStructure.callbackOpeners.介绍人添话标记.line` 「纸上就多了两句。她把他往高了说，也把我往好说。我看见以后第一反应……居然是，难怪这顿饭约得这么顺。」
- `$case.overnightStructure.callbackOpeners.表姐门口口供.line` 「表姐没让进门。隔着门只说，资料是家里一起挑的。收入，她不答；学费，也不答。」
- `$case.overnightStructure.callbackOpeners.双份材料圈注.line` 「核验页管项目，存款证明管那一天。我把两张纸摆一起看了很久。‘学历好、收入稳’……纸上没有这整句。」
- `$case.overnightStructure.callbackOpeners.家里群原话.line` 「群里最上面那句，是我发的：‘要不要把流水也问了？’两分钟后我妈才回。昨晚我把这两分钟藏了。」
- `$case.overnightStructure.callbackOpeners.饭局停顿回放.line` 「饭局那十几秒，我又听了一遍。我问本科，他没答，转头去算停车费。那时候我就觉得卡住了，可下一句没追。」
- `$case.overnightStructure.callbackFallback.line` 「我回来了。群里还在吵。你白天先去了哪一处？」
- `$case.overnightStructure.postures.againstCaller` 「流水是我先问的。今晚我不再拿我妈挡这句话。」
- `$case.overnightStructure.postures.withCaller` 「我把家里群留着没删。你查到哪一截，就从哪一截问。」
- `$case.nightStructure.returnStance.lines.defensive` 我差点不打回来。弹幕说我妈查太深……可查太深那半句，流水是我先开的口。
- `$case.nightStructure.returnStance.lines.open` 我回来了。他的图你继续拆——介绍人那边我也摊。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。群里吵完，我自己也把那几张图又翻了一遍。

### 终局

- `$case.deepFollowup.resistanceBeat.lines[0]` 查他查到我头上了？我的工资，跟他造没造假没关系。
- `$case.deepFollowup.answer` 唉。……一万出头。忙季多一点，不稳定。所以三万一那张图，我盯了很久。不是只怕被骗，是怕以后两个人都扛不住。

### 其他出声面

- `$case.careChoices[0].lines[0]` 带表……你不是让我别发后台吗。
- `$case.careChoices[0].lines[2]` ……嗯。
- `$case.careChoices[1].lines[0]` ……谢谢。这句，我妈应该听听。
- `$case.careChoices[2].lines[0]` 不带材料。
- `$case.careChoices[2].lines[2]` 好。我试试。
- `$case.overnightStructure.returnBeat.lines[0]` 楼上不知道在装修还是怎么，有电钻声。你听不到就行，那是我这边的事。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 等一下。那页群聊，是我表妹拍给你们的?
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 她拍我家的群。给一个直播间。
- `$case.overnightStructure.liveCounterBeats[0].lines[4]` 你们等我一下，我要先给她打个电话。
- `$case.overnightStructure.liveCounterBeats[0].choices[0].lines[0]` ……困不困的，轮不到她替我拍板。
- `$case.overnightStructure.liveCounterBeats[0].choices[0].lines[2]` 算了。继续。
- `$case.overnightStructure.liveCounterBeats[0].choices[1].lines[0]` ……行。播完的。
- `$case.overnightStructure.liveCounterBeats[0].choices[2].lines[1]` ……不打了。打了也是我妈接。
- `$case.overnightStructure.liveCounterBeats[1].lines[1]` ……知道了。
- `$case.overnightStructure.liveCounterBeats[1].lines[3]` 你接着问吧。饭没了，话还没对完。

## 案三相亲对象

- **固定性格：** 受冒犯的条件维护者
- **受压反应：** 被质疑时按项目、余额、家里安排逐项举证，却避开连续收入。
- **防御动作：** 用每个局部真实抵挡整体概括的问题。
- **知识边界：** 知道自己的项目、账户和家人整理材料过程，不知道咨询者家庭内部如何解释。

### 后台／材料回流

- `$case.respondentNote.text` MBA 项目是真的，存款证明也是真的，还是我主动开的。她可以说这些不够，别把“不够”说成“假”。她家见父母前就问流水、问工资卡，问得像审人。介绍人给两边说了什么，我后来才知道。

## 案三介绍人

- **固定性格：** 热络的交易型调和者
- **受压反应：** 说得更快，拿自己留过全量记录证明没撒谎。
- **防御动作：** 把加工说成行规，把责任摊给两家。
- **知识边界：** 知道两家给她的条件和自己转述过的话，不知道两人私下相处。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 先别一句一个骗。手机在这儿，先看我到底说了什么。给女方家，原话三句：学校好，收入稳，家里省心。名校两个字，我没说过。
- `$case.overnightStructure.dayScenes[0].body.beats[1]` 给男方家：她工作稳定，不计较学历，家里也好说话。两段都在，别只截一边。
- `$case.overnightStructure.dayScenes[0].body.beats[3]` “收入稳”是我说高了，“不计较学历”是我替她压低了要求。说高、说低，两边都有。你要骂，按句骂，别替我多认。
- `$case.overnightStructure.dayScenes[0].body.beats[4]` 我承认添话，不认凭空造人。谁把“学校好”顺成“名校毕业”，回去问他们自己。
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[1]` 行，两套报价并排。谁捡了哪句顺耳话，回去自己认；别再拿我一边的截图当全场。
- `$case.overnightStructure.dayScenes[0].body.choice.options[1].resultBeats[1]` 这两句我认。项目和余额是纸上的，别因为我添了两句，就把整页都判成假的。

### 后台／材料回流

- `$case.investigationHooks[1].material` 介绍人说：“我就是两头做人。女方家问条件，我说学校好、收入稳、家里省心；男方家怕学历被嫌，我说女生稳定、家里不折腾、对学历不会太计较。相亲谁不先报个好价？谢媒人情要还，我也想把事办成。”

### 其他出声面

- `$case.overnightStructure.liveCounterBeats[1].lines[0]` 男方家刚跟我说，周末的饭先不吃了。他们也看了直播。……你们要的清楚，先把饭吃没了。

## 案三男方表姐

- **固定性格：** 护家的感性防守者
- **受压反应：** 先拒答；确认只问资料整理后才给半句。
- **防御动作：** 使用‘大家一起整理’稀释主导者。
- **知识边界：** 知道资料如何整理，不知道收入构成和MBA学费来源。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 收入别问我，我没见过他工资卡。MBA 学费谁出的，我也不说。
- `$case.overnightStructure.dayScenes[1].body.beats[2]` 不是。姑姑、我、他都在群里挑过。哪张存款图、项目图截到哪儿，家里一起弄的。你要问谁一个人做的——没有。
- `$case.overnightStructure.dayScenes[1].body.beats[3]` 我只认资料这句。收入和学费别往我嘴里塞。你再问，门也只开到这儿。

## 赵律师

- **固定性格：** 锋利的理性派
- **受压反应：** 听见无证据定性会立刻打断，并补适用条件。
- **防御动作：** 短句、免责、拒猜动机。
- **知识边界：** 只解释法律与责任效果，不替案件当事人作证，不指点玩家圈哪一栏。

### 后台／材料回流

- `$case.delegation.outcomes.zhao-lawyer.text` 恋爱里把 MBA 说成名校毕业，不犯法；婚姻登记处也不查学历。法律管骗婚财，不管吹牛皮——所以这事只能在饭桌上算，算之前先把话留好底。

## 周会计

- **固定性格：** 冷静的数字理性派
- **受压反应：** 删掉形容词，只报金额、时间和路径。
- **防御动作：** 按日期排列，拒绝替数字添故事。
- **知识边界：** 只读材料中已经出现的账目与流程，不认定未知付款人身份。

### 后台／材料回流

- `$case.delegation.outcomes.zhou-accountant.text` 图我不看。要看看流水——收入这种事，纸上写的都是形容词，到账的才是名词。

## 小林老师

- **固定性格：** 热络的感性现实派
- **受压反应：** 先替行业解释一句，再把行话翻成人话。
- **防御动作：** 笑着纠偏，拆一次话术就补一次行业辩护。
- **知识边界：** 只解释婚恋行业话术和流程，不知道本案人物私下做过什么。

### 后台／材料回流

- `$case.advisorNotes[0].text` 介绍人抬话是行规，“学校好条件好”你听七成就行。真要提醒一句：相亲里最该聊清楚的不是流水，是钱以后怎么管——这话两边都没先说，倒都去查对方的图了。行里人说句公道话，这不怪介绍人。
- `$case.delegation.outcomes.lin-matchmaker.text` “名校毕业”这四个字在相亲市场上有牌价。他这么说，介绍人这么传，女方家这么听——三方都没吃亏，直到有人当真。行里的话，得翻译着听。

## 张法医

- **固定性格：** 技术洁癖型理性派
- **受压反应：** 碰到来源不全的材料会停止讨论结论。
- **防御动作：** 先查链条，再谈内容。
- **知识边界：** 只判断证据链与技术可检验性，不认定关系或动机。

### 收麦幕间

- `$case.nightStructure.interlude.actions[0].script.reply` 不能。像素真假我答过了，学历口径让当事人自己去学信网核。别拿复印件替人作证。……行了，今天真收了。我家那位喊我对发票呢。你说这日子。

### 后台／材料回流

- `$case.delegation.outcomes.zhang-forensic.text` 哥们的忙照帮，检测费照记。图是原图，像素没动过——她验得对。但鉴定书只管图，不管图外之意：这类项目学位，学信网三分钟能验真伪。真问题从来不是图的真假，是口径——像素没动过，不等于话没动过。链条不全，报告就是纸。

## V哥

- **固定性格：** 沉着的直觉教练
- **受压反应：** 玩家越急，他越让人停一下，只比较两件已知事物。
- **防御动作：** 短句，先停，再分开看。
- **知识边界：** 只知道玩家当前已经听见或看见的内容。

### 夜 A

- `$case.sceneVersions[0].helperHint` 图都可能是真的。先分清：她说了什么，和他主动多证明了什么。
- `$case.sceneVersions[1].helperHint` 停顿本身不是答案。你要找的是她在那十几秒后有没有把本科问到底。
- `$case.sceneVersions[2].helperHint` 一句“学校是真的”覆盖不了整句话。看看她省掉的是哪个限定。
- `$case.sceneVersions[3].helperHint` 介绍人的两边话术都在减轻阻力。先问她的收益是什么，不必先判她撒谎。
- `$case.sceneVersions[4].helperHint` 校名、项目、本科是三件事。别让一张图替三件事一起作证。

### 夜 B

- `$case.sceneVersions[5].helperHint` 先找聊天记录里的第一主语：流水是谁先提，妈妈又是在什么时候接上的。
- `$case.sceneVersions[6].helperHint` 会省钱能证明习惯，不能自动证明收入。把工资卡问题和日常消费方式分开。

# 职场报销截图

## 林旭阳

- **固定性格：** 温热而克制
- **受压反应：** 担心误判时先缩短句子，把混在一起的事实拆开。
- **防御动作：** 把感情和判决分开，用小而合法的试探代替情绪宣判。
- **知识边界：** 只知道节目已经收到、玩家已经看见或对方在麦上说出的内容。

### 夜 A

- `$case.openingDialogue[1]` 先别说审批。部门活动，怎么刷到你个人卡上的？从第一句私聊开始。
- `$case.nightStructure.hangup.hostLine` 去。审批图先留台上。拿不到付款回单号，就别把通过说成到账。
- `$case.sceneVersions[0].casualQuestions[0].question` 你进这家公司多久了？
- `$case.sceneVersions[0].casualQuestions[1].question` 那位同事平时人缘怎么样？
- `$case.sceneVersions[0].questionOptions[0].question` “写你主责”和“你先垫”，中间隔了几句？
- `$case.sceneVersions[0].questionOptions[1].question` 你答应时，问过谁还钱吗？
- `$case.sceneVersions[1].casualQuestions[0].question` 大群里一般谁管预算？
- `$case.sceneVersions[1].casualQuestions[1].question` 你当时看懂那张流程表了吗？
- `$case.sceneVersions[1].questionOptions[0].question` 流程表就在群里，你为什么不问预算？
- `$case.sceneVersions[1].questionOptions[1].question` 你以为谁会替你报备？
- `$case.sceneVersions[2].casualQuestions[0].question` 那条私聊你留着吗？
- `$case.sceneVersions[2].casualQuestions[1].question` 他当时提过财务延后吗？
- `$case.sceneVersions[2].questionOptions[0].question` 他哪一句，让你把群聊关了？
- `$case.sceneVersions[2].questionOptions[1].question` 你真在群里问预算，最坏能怎样？
- `$case.sceneVersions[3].casualQuestions[0].question` 垫的钱是多少？
- `$case.sceneVersions[3].casualQuestions[1].question` 财务那边你认识人吗？
- `$case.sceneVersions[3].casualQuestions[2].question` 垫款用的哪张卡?
- `$case.sceneVersions[3].questionOptions[0].question` 三张同样的图，你实际看懂了哪一格？
- `$case.sceneVersions[3].questionOptions[1].question` 财务说延后。你等了三个星期，手里多过一张付款回单吗？

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[1]` 对方把同一页发了三次。
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[0]` 我只带回窗口的回单要求。没有回单号，审批页就停在通过。
- `$case.overnightStructure.dayScenes[0].body.choice.options[1].resultBeats[0]` 账户后四位也拿不到。我把窗口拒查和缺少核验条件一起带回去。
- `$case.overnightStructure.dayScenes[1].body.beats[1]` 这张单上的对接人还是那位同事？
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[0]` 我只拍对接栏，不拿「老规矩」往账户上猜。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[0]` 我只带回语音原句：「按老规矩返给对接人。」
- `$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[1]` 那就把托话、批注、审批页并排，不替任何一页补付款。
- `$case.overnightStructure.dayScenes[2].body.choice.options[1].resultBeats[1]` 我带回责任空白，不拿流程样本替具体人作证。

### 夜 B

- `$case.sceneVersions[4].beforeVersion.lines[1]` ……没事。纸干了再翻。你说。
- `$case.sceneVersions[5].beforeVersion.lines[3]` 一块九。
- `$case.sceneVersions[5].beforeVersion.lines[5]` 继续。
- `$case.sceneVersions[6].sceneCloser.lines[0]` 三栏念完了。今晚——
- `$case.sceneVersions[6].sceneCloser.lines[6]` 四十三页，记下了。
- `$case.overnightStructure.callbackOpeners.财务窗口回单要求.firstConflict.hostLine` 三次问到账，只换回同一张图。你第三次为什么还收了？
- `$case.overnightStructure.callbackOpeners.财务窗口账户拒查.firstConflict.hostLine` 财务没替你查，不等于谁收了钱。你手里还缺什么？
- `$case.overnightStructure.callbackOpeners.供应商对接补话.firstConflict.hostLine` 你原样念。哪个词让你最不敢往下猜？
- `$case.overnightStructure.callbackOpeners.供应商对接人栏.firstConflict.hostLine` 名字在，对账的东西不在。你今晚要他补哪一张？
- `$case.overnightStructure.callbackOpeners.茶水间回单缺口.firstConflict.hostLine` 三页都让你等。谁答应过具体哪天把钱给你？
- `$case.overnightStructure.callbackOpeners.茶水间责任对照.firstConflict.hostLine` 主责有名字，催款没有。这块谁来管，你打算怎么办？
- `$case.overnightStructure.callbackOpeners.赵律师边界框架.firstConflict.hostLine` 六万八比难看重。你为什么还是没开口？
- `$case.overnightStructure.callbackOpeners.周会计钱路框架.firstConflict.hostLine` 下一次他再发审批图，你回哪一句？
- `$case.overnightStructure.callbackOpeners.小林主责框架.firstConflict.hostLine` 你认‘我来扛’。他最可能抓着这句赖掉什么？
- `$case.overnightStructure.callbackOpeners.预算时间线复核.firstConflict.hostLine` 他当时拿什么让你别在群里问？
- `$case.overnightStructure.callbackOpeners.领导批注.firstConflict.hostLine` 那句夸奖落下来时，你有没有问六万八什么时候回？
- `$case.overnightStructure.callbackOpeners.顾问回单.firstConflict.hostLine` 顾问只认到审批。往后那截，你还替他接吗？
- `$case.overnightStructure.callbackOpeners.垫款回放.firstConflict.hostLine` 回放停在你那句“我来扛”。六万八，前后谁都没说。你现在还拿这四个字认垫款吗？
- `$case.sceneVersions[4].casualQuestions[0].question` 服务协调费，行价一般多少？
- `$case.sceneVersions[4].casualQuestions[1].question` 供应商是谁选的？
- `$case.sceneVersions[4].casualQuestions[2].question` 家里知道吗?
- `$case.sceneVersions[4].questionOptions[0].question` 报价单哪一行写了钱往谁那儿走？
- `$case.sceneVersions[4].questionOptions[1].question` 只看“服务协调费”，能定他拿钱吗？
- `$case.sceneVersions[5].casualQuestions[0].question` 领导当场知道你刷了个人卡吗？
- `$case.sceneVersions[5].casualQuestions[1].question` 那句老规矩是谁先接的话？
- `$case.sceneVersions[5].casualQuestions[2].question` 他今晚在群里说话了吗?
- `$case.sceneVersions[5].questionOptions[0].question` 领导写了你什么；钱，又写了什么？
- `$case.sceneVersions[5].questionOptions[1].question` 被点名以后，你为什么又等了一天？
- `$case.sceneVersions[6].casualQuestions[0].question` 复盘材料是谁写？
- `$case.sceneVersions[6].casualQuestions[1].question` 如果重来一次，你还接这个活吗？
- `$case.sceneVersions[6].questionOptions[0].question` 你按表上的顺序，把三栏念一遍。先别总结。
- `$case.sceneVersions[6].questionOptions[1].question` 归档前，你最怕补哪七个字？

### 终局

- `$case.deepFollowup.resistanceBeat.lines[1]` 对。写不写，我不替你选。
- `$case.hostDisclosure.text` 我上一份工作丢的时候，也是流程词最多的那个月。所以这通我容易先烦说流程的人——先把这口气压住。
- `$case.deepFollowup.question` 公司流程要归档，审批图又发了三遍：你愿不愿意写入“个人垫款未返”？
- `$case.stageJudgement` 想要主责归想要主责，替公司垫款是另一回事。她回过“收到”，也回过“我来扛”，这部分不能抹；可审批页没有付款，返款又写给对接人，这两条也不能拿她的野心抵掉。

### 其他出声面

- `$case.careChoices[0].hostLine` 明天上班，先补报备，再提回单号。一件一件来。
- `$case.careChoices[1].hostLine` 想要主责没错。错的不是这个。
- `$case.careChoices[2].hostLine` 周一归档前，有事随时打。夜里也开。
- `$case.overnightStructure.liveCounterBeats[1].lines[1]` 月底，在归档以后。

## 案四咨询者·陈

- **固定性格：** 想证明能扛事的焦虑新人
- **受压反应：** 害怕时句子越来越短；复述公司话时给流程词加引号。
- **防御动作：** 把主动承担说成‘让我垫’，用流程词遮住个人选择。
- **知识边界：** 知道自己参与的项目、私聊、垫款和收到的截图，不知道返点最终归属。

### 夜 A

- `$case.openingDialogue[0]` 林旭阳，公司里的事。客户答谢会，刷了我个人卡大半额度。活动早办完了，同事把同一张“审批通过”发给我三遍。钱，一分没回。
- `$case.sceneVersions[0].casualQuestions[1].lines[0]` 好。谁都能聊两句，领导也喜欢。呃，他工位在我斜对面，桌上一盆多肉，谁路过都逗两句。就是说……有一回我加班到十点，他给我留了盏灯，贴了张便利贴：早点回。我当时觉得，这人真好。
- `$case.sceneVersions[0].casualQuestions[1].lines[2]` 便利贴我还留着。你说我留它干嘛。
- `$case.sceneVersions[0].sceneCloser.lines[0]` 呃，我先把工牌摘了，硌得慌。……嗯，没事了。
- `$case.sceneVersions[2].sceneCloser.lines[0]` 等我一下，我妈敲门问我跟谁打电话。……说是同学。继续。
- `$case.sceneVersions[3].casualQuestions[2].lines[0]` 工资卡。
- `$case.sceneVersions[3].casualQuestions[2].lines[2]` 就那一张。
- `$case.nightStructure.hangup` 新批注和审批页对不上。付款状态今晚仍是空的；我白天把回单、批注和对接栏能核的先核清，再打进来。……还有，你之前问金额。六万八。这个数我说出来，就收不回去了。
- `$case.openingComplaint` 咨询者连线说：“一场客户答谢会刷掉我个人卡大半额度。同事把同一张‘审批通过’发了三遍，钱一分没回。”
- `$case.sceneVersions[0].version` 我不是完全被迫。入职八个月，刚转正两个月，我想让老板看见我。前面还主动说过，这活我能接。他私聊：“你先顶上，复盘材料里可以写你主责。”我回得很快。主责，我确实想要。
- `$case.sceneVersions[0].casualQuestions[0].answer` 八个月。试用期转正第二个月，就接了这个活。
- `$case.sceneVersions[0].questionOptions[0].answer` 没隔，就一句。他说缺执行负责人，让我先垫场地和礼品费，复盘写我主责。我听见“主责”，后半句就没细抠。
- `$case.sceneVersions[0].questionOptions[0].guardedAnswer` 同一句。写我主责，我就答应先顶。
- `$case.sceneVersions[0].questionOptions[1].answer` 没问。他说活动后补流程，我回：“我来扛。”我想要主责，也怕一开口问钱怎么还，显得斤斤计较。这四个字，是我自己打的。
- `$case.sceneVersions[1].version` 活动前一天，14：05，部门助理在大群发了张流程表。我点开过。预算先填金额，供应商走对公；个人垫付，得提前报备。群里很快刷了一串“收到”。我也看见了。可场地在催，礼品也在催，我没去群里问预算。
- `$case.sceneVersions[1].casualQuestions[0].answer` 部门助理发流程，财务出数。以前都这么走，就这次说来不及。
- `$case.sceneVersions[1].casualQuestions[1].answer` 看懂了大概。预算、审批、对公付款这些字都在，只是我当时觉得自己刚接活，先别显得太麻烦。
- `$case.sceneVersions[1].questionOptions[0].answer` 刚跟老板说完我能主责，转头就在群里问钱，像流程都没摸清。我怕别人觉得我只会嘴上扛，就等他私下给数。
- `$case.sceneVersions[1].questionOptions[0].guardedAnswer` 看见了，没问。刚接主责，我不想第一句就问预算。
- `$case.sceneVersions[1].questionOptions[1].answer` 他。供应商是他对接，预算也在他手里。我以为自己只先刷一下，后面他补。可这个“以为”，没有一个字留在群里。
- `$case.sceneVersions[2].version` 流程表发完十七分钟，14：22，他私聊我：“先别在大群问预算，来不及，复盘再补。刚接主责，别让领导觉得你不担事。”我看见“不担事”，就没问。九天后财务群真发了延后通知。我把九天后的通知，倒贴到前面去了。
- `$case.sceneVersions[2].revisedVersion` 时间我改口。两点二十二，是他说来不及。财务九天后才通知延后。财务还没慢，我们先躲进私聊了。
- `$case.sceneVersions[2].casualQuestions[0].answer` 留着。我之前不敢拿出来，是因为里面也有我自己说“我来扛”。
- `$case.sceneVersions[2].casualQuestions[1].answer` 没有。他那天只说来不及、别问。财务延后通知是后面才发的。
- `$case.sceneVersions[2].questionOptions[0].answer` “刚接主责，别让领导觉得你不担事。”他说先私下办成，复盘再补。我怕老板觉得我推活，也怕别人看出我不熟。群聊打开了，又关掉。
- `$case.sceneVersions[2].questionOptions[0].guardedAnswer` 他说别让领导觉得我不担事。我就没问。
- `$case.sceneVersions[2].questionOptions[1].answer` 最多有人觉得我准备不足，不好看。可群里会留下话：谁批、谁还、谁对接。活动不会毁，我也不会丢工作。我当时把面子看得太大。
- `$case.sceneVersions[3].version` 钱就是那次“你先顶上”刷进我个人卡的。活动后，他发来一张审批页，抬头是“报销审批通过”。我问什么时候回来，他又发一次。第二天再问，还是它。一共三次。每张下面都是“流程在走”。我在相册里来回滑，跟没动一样。
- `$case.sceneVersions[3].casualQuestions[0].answer` ……不方便说具体。我一张卡刷了大半额度，下个月账单要来了。
- `$case.sceneVersions[3].casualQuestions[1].answer` 不认识。入职培训见过一面。真要问，也得同事引荐，又绕回他。
- `$case.sceneVersions[3].questionOptions[0].answer` 就“审批通过”四个字。再往下能确认什么，我说不准。把那页摆出来看吧，别听我替它说。
- `$case.sceneVersions[3].questionOptions[0].guardedAnswer` 只看懂审批过了。再往下，我不替它说。
- `$case.sceneVersions[3].questionOptions[1].answer` 没有。每次问钱，他发回来的还是那张审批页。我把财务通知和它摞在一起，自己听成了“钱在路上”。

### 夜 B

- `$case.sceneVersions[4].casualQuestions[2].lines[0]` 我妈知道个大概。她说：『垫就垫了，就当买个教训，别跟领导闹。』
- `$case.sceneVersions[4].casualQuestions[2].lines[2]` 呃，六万八的教训。我们家，教训真贵。
- `$case.sceneVersions[5].beforeVersion.lines[0]` 今晚他在群里发了二十个红包，一共十六块八，配文『辛苦大家』。
- `$case.sceneVersions[5].beforeVersion.lines[2]` 抢到最大那个的是老板。一块九。
- `$case.sceneVersions[6].sceneCloser.lines[1]` 等下，还有个特小的事。
- `$case.sceneVersions[6].sceneCloser.lines[3]` 复盘 PPT 是我熬的，四十……呃，四十三页，我数过。他把关，就是改了个字体。
- `$case.sceneVersions[6].sceneCloser.lines[5]` 署名页，把关人排我前面。字体啊!就改了个字体!
- `$case.overnightStructure.callbackOpeners.财务窗口回单要求.firstConflict.callerLine` 第三次……我把图存进了相册。存完，就当问过了。
- `$case.overnightStructure.callbackOpeners.财务窗口账户拒查.firstConflict.callerLine` 回单号，或者收款账户。都没有。
- `$case.overnightStructure.callbackOpeners.供应商对接补话.firstConflict.callerLine` ‘对接人’。单上写的是他，可账户没写。
- `$case.overnightStructure.callbackOpeners.供应商对接人栏.firstConflict.callerLine` 供应商付款确认。上面得有收款账户。
- `$case.overnightStructure.callbackOpeners.茶水间回单缺口.firstConflict.callerLine` 没人。每次我问，话就回到主责。
- `$case.overnightStructure.callbackOpeners.茶水间责任对照.firstConflict.callerLine` 替我自己。主责是我张口要来的。
- `$case.overnightStructure.callbackOpeners.赵律师边界框架.firstConflict.callerLine` 刚拿到主责，怕别人说我只盯钱。
- `$case.overnightStructure.callbackOpeners.周会计钱路框架.firstConflict.callerLine` 回单号给我。别的先不聊。
- `$case.overnightStructure.callbackOpeners.小林主责框架.firstConflict.callerLine` 赖我连钱也一起扛了。可我答应的是活，不是替公司出六万八。
- `$case.overnightStructure.callbackOpeners.预算时间线复核.firstConflict.callerLine` 只说来不及。‘财务’两个字，是我后来替他补的。
- `$case.overnightStructure.callbackOpeners.领导批注.firstConflict.callerLine` 没有。我先截图发给朋友了。
- `$case.overnightStructure.callbackOpeners.顾问回单.firstConflict.callerLine` 不会。没有回单，我就说没有。
- `$case.overnightStructure.callbackOpeners.垫款回放.firstConflict.callerLine` 不认。我接的是活。六万八算不算进去，我当时没敢问。
- `$case.sceneVersions[4].version` 第二晚，我把供应商报价单翻到最后一页。礼品下面多一项“服务协调费”。他说是正常费用。可备注还有一句：“按老规矩返给对接人。”对接人栏，是他。别的页我没拿到。划到这行，我不敢再往下猜。
- `$case.sceneVersions[4].casualQuestions[0].answer` 我查过。有的有，有的没有，查完更乱了。
- `$case.sceneVersions[4].casualQuestions[1].answer` 他定的，说合作过。我连对接人微信都没有。
- `$case.sceneVersions[4].questionOptions[0].answer` “返给对接人。”名字没落，位置落了；这个活动的对接人一直是他。我只能念到这儿。最后进哪个账户，单子没写。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 写着返给对接人。名字没落，别的页我也没有。
- `$case.sceneVersions[4].questionOptions[1].answer` 不能。我查过，有的单子有，有的没有。这几个字定不了人。能看见的只有“返给对接人”，账户还是看不见。
- `$case.sceneVersions[5].version` 活动后小复盘，领导点名：“客户反馈不错，执行主责记陈；流程按老规矩补齐。”看到自己的姓，我真松了口气。后半句都没细看。第二晚我才把群翻回 14：05。那张流程表，我看见了，也回过“收到”。规矩就摆在那儿。我当时不想让它拦我。
- `$case.sceneVersions[5].revisedVersion` 批注看见了吗？主责写我。钱往哪走，一个字没有。……我截图时手在抖。下周一一归档，名字写死，钱还卡在他那儿。
- `$case.sceneVersions[5].casualQuestions[0].answer` 我不确定。会上没人说“个人卡”三个字。说的都是执行效率、客户反馈。
- `$case.sceneVersions[5].casualQuestions[1].answer` 他接得最快，说会补齐。后来我才发现，补齐这两个字也要经过他。
- `$case.sceneVersions[5].casualQuestions[2].answer` 没。
- `$case.sceneVersions[5].questionOptions[0].answer` 写了客户反馈，写了我主责。钱是谁垫、谁补流程、谁对接供应商，一个没写。我当时只顾着看自己的名字。
- `$case.sceneVersions[5].questionOptions[0].guardedAnswer` 写了主责。钱怎么回，没写。
- `$case.sceneVersions[5].questionOptions[1].answer` 因为我高兴。可一开口追钱，大家先问的就是流程怎么走、我为什么没报备。主责跑来追款，听着像我自己没把活办明白。我就又压了一天。
- `$case.sceneVersions[6].version` 复盘材料出来了。执行主责：我。付款对接人：他。供应商确认人：还是他。出问题先找我，钱什么时候回来，我还得等他一句。下周一归档，主责就写死了。我的卡账单，还在。
- `$case.sceneVersions[6].casualQuestions[0].answer` 我写初稿。写到凌晨两点多，呃，写完还挺兴奋的，给我妈发消息说我第一次主责，她第二天早上回了个大拇指。然后他把关。就是说……把关。字体那事我刚说了。反正，把关俩字，是他自己说的。
- `$case.sceneVersions[6].casualQuestions[1].answer` 接。但会先在群里问一句预算。就一句，够了。
- `$case.sceneVersions[6].questionOptions[0].answer` 执行主责，陈。付款对接人，他。供应商确认人，还是他。……三栏里，只有责任落在我这边。出了事，模板让人先找的，也是我。
- `$case.sceneVersions[6].questionOptions[0].guardedAnswer` 主责是我，付款对接是他。最后一栏……我不想念。
- `$case.sceneVersions[6].questionOptions[1].answer` “个人垫款未返。”我怕别人顺着问：你私下垫的钱，流程怎么走的？写上去，先挨问的是我。不写，卡账单还是我的。
- `$case.overnightStructure.callbackOpeners.财务窗口回单要求.line` 「财务窗口问我回单号。我张不开口。三张一模一样的审批图，回单号一张都没有。」
- `$case.overnightStructure.callbackOpeners.财务窗口账户拒查.line` 「窗口不肯查账户。说我没有回单号，也没有账户后四位。那扇窗一关，我差点又想怪财务。」
- `$case.overnightStructure.callbackOpeners.供应商对接补话.line` 「供应商那句语音很短：‘按老规矩返给对接人。’就这一句。账户没说，我不往后接。」
- `$case.overnightStructure.callbackOpeners.供应商对接人栏.line` 「报价单的对接栏写他。翻到付款那页，没有收款账户。我盯着那个名字看了半天，还是不敢把两处接上。」
- `$case.overnightStructure.callbackOpeners.茶水间回单缺口.line` 「助理把三页摊开：私聊叫我别问，批注写我主责，审批页停在通过。回单号？没有。」
- `$case.overnightStructure.callbackOpeners.茶水间责任对照.line` 「我先留下那句‘别在群里问’，又看见领导只写我主责。至于谁催付款……两页都空着。」
- `$case.overnightStructure.callbackOpeners.赵律师边界框架.line` 「赵律师先问：留屏没有，欠条有没有。留屏有。欠条……没有。我当时觉得一提欠条，太难看。」
- `$case.overnightStructure.callbackOpeners.周会计钱路框架.line` 「周会计只问回单号。我报不出来。审批图倒有三张，像复制粘贴。」
- `$case.overnightStructure.callbackOpeners.小林主责框架.line` 「小林老师把‘主责’拆开了。位置，是我想要的；垫款，是他塞在后面的。我还回了‘我来扛’。这句我认。」
- `$case.overnightStructure.callbackOpeners.预算时间线复核.line` 「时间线对完了。他说‘来不及’那天，财务还没发延后通知。我昨晚把后来的通知挪到前面，替他圆了。」
- `$case.overnightStructure.callbackOpeners.领导批注.line` 「领导那条批注，我又看了。只写我主责，一个钱字都没有。我当时高兴，是真的。账也还在。」
- `$case.overnightStructure.callbackOpeners.顾问回单.line` 「顾问回单很短，只认到那一步。后面的付款、返款账户，全没替我补。」
- `$case.overnightStructure.callbackOpeners.垫款回放.line` 「那句私聊我重新放了。‘你先顶上，复盘可以写你主责。’主责在前，刷卡在后。我听见前半句，就回了‘我来扛’。」
- `$case.overnightStructure.callbackFallback.line` 「我回来了。新批注还在手机里。你白天先核了哪一处？」
- `$case.overnightStructure.postures.againstCaller` 「主责是我先要的，我来扛也是我回的。可这两句不能替付款回单。」
- `$case.overnightStructure.postures.withCaller` 「我把三张审批图都留着。你查到哪一页，就从哪一页问。」
- `$case.nightStructure.returnStance.lines.defensive` 我差点不打回来。弹幕说我也想要主责……我是想要。可钱不能一直卡在他手里。
- `$case.nightStructure.returnStance.lines.open` 我回来了。流程和截图你继续问——这回我不替财务慢开脱。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。批注截完，我自己又把审批图看了一眼。少的那页还在。

### 终局

- `$case.deepFollowup.resistanceBeat.lines[0]` 你说得轻。这七个字一写，周一先被复盘的是我，不是他。
- `$case.deepFollowup.answer` ……写。主责我还想留，钱也得回来。这七个字不写，月底账单只找我。

### 其他出声面

- `$case.careChoices[0].lines[0]` 呃，我记下了。报备，回单。
- `$case.careChoices[0].lines[2]` 像考试划重点。
- `$case.careChoices[1].lines[0]` ……嗯。
- `$case.careChoices[1].lines[2]` 这句我想哭。忍住了。
- `$case.careChoices[2].lines[0]` 夜里也开……
- `$case.careChoices[2].lines[2]` 你们也早点睡吧。
- `$case.overnightStructure.returnBeat.lines[0]` 我这边空调滴水，滴在纸箱上，咚，咚的。你听见了别管。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 那条『你蠢』的，呃，我看见了。
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 对，我蠢。入职八个月，我请全组喝过三次奶茶，一次三百多。我蠢得可有规律了。
- `$case.overnightStructure.liveCounterBeats[0].lines[4]` 你们谁没蠢过啊?!
- `$case.overnightStructure.liveCounterBeats[0].choices[0].lines[0]` ……呃，真留着。你还真让我记。
- `$case.overnightStructure.liveCounterBeats[0].choices[1].lines[0]` ……嗯。对账。
- `$case.overnightStructure.liveCounterBeats[0].choices[2].lines[1]` ……哈。
- `$case.overnightStructure.liveCounterBeats[0].choices[2].lines[3]` 行，继续。
- `$case.overnightStructure.liveCounterBeats[1].lines[0]` 他在大群发了：“陈垫的钱月底统一走，大家辛苦。”……你看，他连还钱，都得像他在照顾我。

## 案四同事

- **固定性格：** 圆滑的责任切割者
- **受压反应：** 被问到账和署名时把主责拆成执行主责与流程把关。
- **防御动作：** 每次只承认一个流程片段，强调自己也在替新人争取。
- **知识边界：** 知道自己发出的私聊、审批和署名安排；未有材料时不替财务或返点账户作证。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[0]` 审批过了，别再往大群里问。

### 后台／材料回流

- `$case.respondentNote.text` 垫款我认，月底肯定结。审批本来就走完了，是财务节奏的事。主责署名是人家自己开口要的，这话敢不敢认？返款是供应商这边的老规矩，跟垫款两码事。

## 案四财务经办

- **固定性格：** 冷静的程序理性派
- **受压反应：** 争执越大越只报节点和缺件。
- **防御动作：** 不给评价，只列系统状态。
- **知识边界：** 只知道财务系统与经办材料，不知道私聊动机和返点归属。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 这页只有审批。核付款，报回单号；没有，就报收款账户后四位。
- `$case.overnightStructure.dayScenes[0].body.beats[2]` 发十次也还是审批页。付款一张凭据，到账另一张，别混。
- `$case.overnightStructure.dayScenes[0].body.beats[3]` 没回单号，先别报付款。下一位。
- `$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[1]` 记缺回单号。别记未付款，这两个不是一回事。
- `$case.overnightStructure.dayScenes[0].body.choice.options[1].resultBeats[1]` 窗口拒查，是你条件不全。跟收款人是谁没关系。

## 案四供应商项目员

- **固定性格：** 谨慎的中立执行者
- **受压反应：** 问题越敏感越退回对公记录。
- **防御动作：** 只确认本方收款与联系人。
- **知识边界：** 只知道供应商一侧的联系人、交付和收款记录。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 我只复述语音原话：服务协调费按老规矩返给对接人。
- `$case.overnightStructure.dayScenes[1].body.beats[2]` 单上对接人写的是他。账户我没经手，这句你别让我接。
- `$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[1]` 你拍单。照片只到对接人，钱去了哪儿不在我们这页。
- `$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[1]` 原话你可以带。对接人看单；账户，问收款那边。

### 后台／材料回流

- `$case.investigationHooks[2].material` 供应商说“服务协调费按老规矩返给对接人”。同一张表里，对接人还是那位同事，付款确认页没有发给咨询者。

## 案四仓库管理员

- **固定性格：** 朴实的记录主义者
- **受压反应：** 只让人翻页、对日期，不接关系判断。
- **防御动作：** 认单、认页、不认口头身份。
- **知识边界：** 只知道仓库收货、出入库单与日期。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[3]` 我这儿只认出货单。协调费、公司报销，是另外两张。你手上正好都没有。

## 案四部门助理

- **固定性格：** 规则型自保者
- **受压反应：** 逐字复述模板，不评价任何私聊。
- **防御动作：** 只给群模板与样本，拒绝解释人的意思。
- **知识边界：** 只知道公开群流程与样本，不知道私聊和钱的去向。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[1]` 领导原文就这一句：执行主责记陈，流程按老规矩补齐。
- `$case.overnightStructure.dayScenes[2].body.beats[2]` 这三页我给你并着看。审批只到通过；那句私聊，别问我。
- `$case.overnightStructure.dayScenes[2].body.beats[3]` 模板写得很清楚：个人垫付先报备，供应商优先走对公。
- `$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[0]` 我只替你核字：三页都没回单号。再多一句不说。
- `$case.overnightStructure.dayScenes[2].body.choice.options[1].resultBeats[0]` 托话叫她别问，大群批她主责。谁催付款、谁给回单，模板里没有。

### 后台／材料回流

- `$case.investigationHooks[0].material` 部门助理补充：正常客户活动单先由执行人填预算，个人垫付需要提前报备，供应商付款优先走对公。她说“我只按模板发流程，不判断谁私下说了什么”。

## 案四领导

- **固定性格：** 冷硬的结果主义者
- **受压反应：** 出现流程事故时把讨论压回交付和复盘。
- **防御动作：** 把旧规矩当执行细节，只认结果和汇报。
- **知识边界：** 知道复盘与署名，不知道垫款金额、付款账户和返点归属。

### 收麦幕间

- `$case.nightStructure.interlude.actions[2].text` 季度复盘别节外生枝。主责按名单走，流程按老规矩补齐。

### 后台／材料回流

- `$case.investigationHooks[1].material` 领导批注：“客户反馈不错，执行主责记陈；流程按老规矩补齐，不要影响季度复盘数据。”批注里没有垫款金额、付款账户、供应商对接人。

## 赵律师

- **固定性格：** 锋利的理性派
- **受压反应：** 听见无证据定性会立刻打断，并补适用条件。
- **防御动作：** 短句、免责、拒猜动机。
- **知识边界：** 只解释法律与责任效果，不替案件当事人作证，不指点玩家圈哪一栏。

### 收麦幕间

- `$case.nightStructure.interlude.actions[1].options[0].advisorLine` 公司名遮住。群里原话和刷卡记录能证明她垫过；返款给谁，材料不够。

### 后台／材料回流

- `$case.delegation.outcomes.zhao-lawyer.text` 群里“让我垫”的原话，加上她的转账记录，债权凭证已经够了。走不走那一步是她的事，但料要现在留好——口说的不算，落纸的算数。

## 周会计

- **固定性格：** 冷静的数字理性派
- **受压反应：** 删掉形容词，只报金额、时间和路径。
- **防御动作：** 按日期排列，拒绝替数字添故事。
- **知识边界：** 只读材料中已经出现的账目与流程，不认定未知付款人身份。

### 收麦幕间

- `$case.nightStructure.interlude.actions[1].options[1].advisorLine` 审批页先放下。我要付款回单号；没有，就还没到到账这一步。

### 后台／材料回流

- `$case.advisorNotes[0].text` 审批、付款、到账，是三张纸。看见第一张就当有了第三张，垫钱的人最容易吃这个亏。这一单，第三张纸到收麦都没露过面。钱只认路径，不认说法。
- `$case.delegation.outcomes.zhou-accountant.text` 对公付款都有回单号。让她别问“钱怎么还没到”，就问财务要这单的付款回单号——报得出，是真在走；报不出，就是根本没付。一句话的事，比吵十次管用。……先这样。老张点的外卖送我这儿了，地址又填错。验了半辈子指纹的人，自己家门牌号记不住。

## 小林老师

- **固定性格：** 热络的感性现实派
- **受压反应：** 先替行业解释一句，再把行话翻成人话。
- **防御动作：** 笑着纠偏，拆一次话术就补一次行业辩护。
- **知识边界：** 只解释婚恋行业话术和流程，不知道本案人物私下做过什么。

### 收麦幕间

- `$case.nightStructure.interlude.actions[1].options[2].advisorLine` 她想要主责，这句得认。对方把垫款塞进主责里，也别替他藏。

### 后台／材料回流

- `$case.delegation.outcomes.lin-matchmaker.text` 职场不是我的场。但“想表现”这个东西我熟——我们行里叫“客户自己想成交”，最好的销售从来不推销，只递台阶。

## 张法医

- **固定性格：** 技术洁癖型理性派
- **受压反应：** 碰到来源不全的材料会停止讨论结论。
- **防御动作：** 先查链条，再谈内容。
- **知识边界：** 只判断证据链与技术可检验性，不认定关系或动机。

### 后台／材料回流

- `$case.delegation.outcomes.zhang-forensic.text` 这张截图是完整截屏，底部没有裁切痕迹——它不是被剪过，它本来就只走到审批这一步。图没撒谎，撒谎的是拿图当回执用的人。

## V哥

- **固定性格：** 沉着的直觉教练
- **受压反应：** 玩家越急，他越让人停一下，只比较两件已知事物。
- **防御动作：** 短句，先停，再分开看。
- **知识边界：** 只知道玩家当前已经听见或看见的内容。

### 夜 A

- `$case.sceneVersions[0].helperHint` 把私聊拆成两半：他给了什么身份，又让她先承担什么。
- `$case.sceneVersions[1].helperHint` 公开流程已经出现。先追她为什么看见了，却没有用它保护自己。
- `$case.sceneVersions[2].helperHint` 把 14:05 和 14:22 分开：公开规则说什么，私聊又让她别做什么。
- `$case.sceneVersions[3].helperHint` 审批、付款、到账不是同一步。先问这张图到底停在哪一格。

### 夜 B

- `$case.sceneVersions[4].helperHint` 费用名称可以正常，收款路径是另一件事。只看备注和对接人写了什么。
- `$case.sceneVersions[5].helperHint` 领导一句话同时给了署名和流程要求。她先听进去了哪半句？
- `$case.sceneVersions[6].helperHint` 主责、付款对接、供应商确认是三个位置。别让“主责”替另外两处背书。

# 未在本报告捕获到台词的人物卡

- 案二前台（case2-front-desk）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。

# 句长节奏人工复核

以下只是朗读提醒，不自动判错。三句服务于不同防御动作时可以保留。

- 01-credit／案一咨询者·沈／nightA：39、35、36 字（$case.sceneVersions[1].questionOptions[1].answer；$case.sceneVersions[1].dialogueOptions[0].answer；$case.sceneVersions[1].dialogueOptions[1].answer）
- 01-credit／案一咨询者·沈／nightB：21、24、23 字（$case.overnightStructure.callbackOpeners.路径框架.firstConflict.callerLine；$case.overnightStructure.callbackOpeners.闺蜜删掉的那条评论.firstConflict.callerLine；$case.overnightStructure.callerQuestion.options[0].lines[0]）
- 01-credit／案一咨询者·沈／nightB：42、43、45 字（$case.overnightStructure.callbackOpeners.她的会员号.line；$case.overnightStructure.callbackOpeners.常客的轮订规律.line；$case.overnightStructure.callbackOpeners.旁听记下的两句.line）
- 01-credit／林旭阳／nightB：23、27、27 字（$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.lines[0]；$case.overnightStructure.callbackOpeners.周会计的时间线.firstConflict.lines[2]；$case.overnightStructure.callbackOpeners.她的会员号.firstConflict.hostLine）
- 01-credit／V哥／nightA：29、29、28 字（$case.sceneVersions[1].helperHint；$case.sceneVersions[2].helperHint；$case.sceneVersions[3].helperHint）
- 01-credit／V哥／nightA：29、28、27 字（$case.sceneVersions[2].helperHint；$case.sceneVersions[3].helperHint；$case.sceneVersions[4].helperHint）
- 02-tony／林旭阳／nightA：21、18、19 字（$case.sceneVersions[3].casualQuestions[1].question；$case.sceneVersions[3].questionOptions[0].question；$case.sceneVersions[3].questionOptions[1].question）
- 02-tony／案二咨询者·何／nightB：22、18、20 字（$case.overnightStructure.callbackOpeners.店外称呼观察.firstConflict.callerLine；$case.overnightStructure.callbackOpeners.店外服务序列.firstConflict.callerLine；$case.overnightStructure.callbackOpeners.培训页圈注.firstConflict.callerLine）
- 02-tony／案二咨询者·何／nightB：38、36、37 字（$case.overnightStructure.callbackOpeners.店里的标准表.line；$case.overnightStructure.callbackOpeners.那次六折.line；$case.overnightStructure.callbackOpeners.店长门口拒答.line）
- 02-tony／林旭阳／nightB：26、25、27 字（$case.overnightStructure.callbackOpeners.店外称呼观察.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.店外服务序列.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.培训页圈注.firstConflict.hostLine）
- 03-profile／案三咨询者·林／nightB：28、28、28 字（$case.sceneVersions[6].sceneCloser.lines[3]；$case.sceneVersions[6].sceneCloser.lines[5]；$case.overnightStructure.callbackOpeners.介绍人双边记录.firstConflict.callerLine）
- 03-profile／案三咨询者·林／nightB：50、47、51 字（$case.overnightStructure.callbackOpeners.双份材料圈注.line；$case.overnightStructure.callbackOpeners.家里群原话.line；$case.overnightStructure.callbackOpeners.饭局停顿回放.line）
- 03-profile／案三咨询者·林／nightB：23、23、26 字（$case.overnightStructure.callbackFallback.line；$case.overnightStructure.postures.againstCaller；$case.overnightStructure.postures.withCaller）
- 03-profile／案三介绍人／day：37、37、35 字（$case.overnightStructure.dayScenes[0].body.beats[4]；$case.overnightStructure.dayScenes[0].body.choice.options[0].resultBeats[1]；$case.overnightStructure.dayScenes[0].body.choice.options[1].resultBeats[1]）
- 03-profile／V哥／nightA：29、31、29 字（$case.sceneVersions[0].helperHint；$case.sceneVersions[1].helperHint；$case.sceneVersions[2].helperHint）
- 03-profile／V哥／nightA：31、29、33 字（$case.sceneVersions[1].helperHint；$case.sceneVersions[2].helperHint；$case.sceneVersions[3].helperHint）
- 04-workplace／林旭阳／nightB：22、20、24 字（$case.overnightStructure.callbackOpeners.供应商对接人栏.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.茶水间回单缺口.firstConflict.hostLine；$case.overnightStructure.callbackOpeners.茶水间责任对照.firstConflict.hostLine）
- 04-workplace／案四咨询者·陈／nightB：38、42、40 字（$case.overnightStructure.callbackOpeners.财务窗口回单要求.line；$case.overnightStructure.callbackOpeners.财务窗口账户拒查.line；$case.overnightStructure.callbackOpeners.供应商对接补话.line）
- 04-workplace／林旭阳／day：21、25、21 字（$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[0]；$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[1]；$case.overnightStructure.dayScenes[2].body.choice.options[1].resultBeats[1]）
- 04-workplace／案四供应商项目员／day：24、25、24 字（$case.overnightStructure.dayScenes[1].body.beats[0]；$case.overnightStructure.dayScenes[1].body.beats[2]；$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[1]）
- 04-workplace／案四供应商项目员／day：25、24、22 字（$case.overnightStructure.dayScenes[1].body.beats[2]；$case.overnightStructure.dayScenes[1].body.choice.options[0].resultBeats[1]；$case.overnightStructure.dayScenes[1].body.choice.options[1].resultBeats[1]）
- 04-workplace／案四部门助理／day：25、26、25 字（$case.overnightStructure.dayScenes[2].body.beats[1]；$case.overnightStructure.dayScenes[2].body.beats[2]；$case.overnightStructure.dayScenes[2].body.beats[3]）
- 04-workplace／案四部门助理／day：26、25、22 字（$case.overnightStructure.dayScenes[2].body.beats[2]；$case.overnightStructure.dayScenes[2].body.beats[3]；$case.overnightStructure.dayScenes[2].body.choice.options[0].resultBeats[0]）
