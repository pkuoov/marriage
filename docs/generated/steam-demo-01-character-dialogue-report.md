# 《Steam 试玩版》按角色台词报告

> 本文档由内容包自动生成。它把分散在夜 A、白天、夜 B、顾问回流和结案中的台词重新按人物聚合，供遮名辨人、知识边界和句长节奏审稿。请修改 JSON 真源后运行 `npm run content:dialogue-report`，不要手改本文档。

## 汇总

- 固定人物卡：39
- 收录台词／玩家可见人物材料：1078
- 本包实际出声人物：35
- 句长节奏人工复核提示：24
- 构建时硬拦截：未归属说话人、越案人物 ID，以及“我现在想知道的是／本质上／更重要的是／一方面另一方面”高密度模板。

# 全集外壳

## 林旭阳

- **固定性格：** 见得多、反应快，能接住情绪，也敢抓着绕答继续问
- **受压反应：** 听见用途偷换、关键人被省掉或对方答非所问，就收笑、打断，直接追他在躲哪一件事；不等材料全部到齐才施压。
- **防御动作：** 旧误判使他更会核对原话，不使他放弃判断。先从具体异常提出最可能的解释，再看对方怎样否认、补充或转题。
- **知识边界：** 现场信息来自已听见或已获得的内容；经验让他能从遗漏、利益与辩解推断隐藏路线并主动试探，无需先获确凿证据。尚未出现的具体身份、金额与材料不能被他说成已知事实。

### 其他出声面

- `$manifest.nightShell.prologue.coldOpen.setupLines[1]` 晚上好，我是林旭阳。第一位来电人还没接进来，她先把男朋友刚发来的一段语音转到了后台。
- `$manifest.nightShell.prologue.coldOpen.interestLines[0]` 她把后半段也转来了。她问钱都花哪去了，男友没答。
- `$manifest.nightShell.prologue.lines[2]` 少惦记我工牌。改版的事，等下播再说。
- `$manifest.nightShell.interludes[0].lines[2]` 白天周会计提醒我看那笔认购。我把宣传页和官网介绍都翻了，收益写得很显眼，旁边全是项目和签约照片。难怪他觉得借钱也能赚。
- `$manifest.nightShell.interludes[0].lines[4]` 还没收到。广告讲到期返本，借款每月要还，他却想靠这个撑消费。等不到到期怎么办？
- `$manifest.nightShell.interludes[0].lines[6]` 我给他补个消息：合同、到期日、借款利息一起发来。得看看他以为能赚到的钱，够不够先付利息。
- `$manifest.nightShell.interludes[0].lines[9]` 还都等着对方有钱。
- `$manifest.nightShell.interludes[0].lines[12]` 真那样的话，我们俩大概一开始就看不上对方。
- `$manifest.nightShell.interludes[1].lines[2]` 白天让你找的融资稿，有了？陈说柜子铺多了就赚钱，我想看看他们自己报的成本。
- `$manifest.nightShell.interludes[1].lines[4]` 收三块，光这几项就三块五？
- `$manifest.nightShell.interludes[1].lines[6]` 那不停铺点，是等以后使用率上去？
- `$manifest.nightShell.interludes[1].lines[9]` 用户随时能退的二十九，怎么会转到主要股东那边？
- `$manifest.nightShell.interludes[2].lines[3]` 我只看见持有页，三十万，写着九月底到期。合同没上屏。
- `$manifest.nightShell.interludes[2].lines[5]` 没发。她爸那笔是留给女儿自己的，婚宴首饰照样让男方出。
- `$manifest.nightShell.interludes[2].lines[9]` 还是会去。可那顿饭吃完，我有多少钱、愿意怎么花，得由我自己说。
- `$manifest.nightShell.interludes[3].lines[2]` 我洗。你站旁边监督。
- `$manifest.nightShell.cafePrologue.cafe.openingLines[2]` 行，赵同学。人都等着了，回家再数落我。
- `$manifest.nightShell.cafePrologue.cafe.openingLines[4]` 就昨天电话里聊的那些？
- `$manifest.nightShell.cafePrologue.cafe.openingLines[6]` 先用桌边架好的手机录，省得后面谁说了又不承认。
- `$manifest.nightShell.cafePrologue.cafe.openingLines[10]` 行，不拍脸。后续剪完的片子也会给你们看，你们不点头，我们也不会发。
- `$manifest.nightShell.cafePrologue.cafe.evidencePair[0].hitLines[2]` 这是你自己发的，“我到澜桥酒店了”。你刚说那晚没去，这两句话怎么回事？
- `$manifest.nightShell.cafePrologue.cafe.evidencePair[1].hitLines[2]` 这张订单状态是已入住，入住人写的是你。你刚说那晚没去，怎么对得上？
- `$manifest.nightShell.cafePrologue.cafe.revisedPresentLeadLines[0]` 你刚才说得很清楚：你跟顾*之间没转过钱。
- `$manifest.nightShell.cafePrologue.cafe.transferHitLines[0]` 你刚说没转过钱。流水里有三笔，交易对手都是顾*。这个怎么说？
- `$manifest.nightShell.cafePrologue.aftermath.openingLines[4]` 你先去问我给你的那家机构，受理需要谁到场，带哪些材料都先问清。
- `$manifest.nightShell.cafePrologue.aftermath.openingLines[5]` 孩子大部分东西估计她都带走了，你可能得仔细找下家里还能去做鉴定的东西。
- `$manifest.nightShell.cafePrologue.aftermath.openingLines[7]` 嗯，到家给我打个电话。
- `$manifest.nightShell.cafePrologue.aftermath.routes[0].lines[1]` 你问过机构了吗？
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[1]` 你发来吧。我请平时帮节目核账的周会计一起看。
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[4]` 又耽误你吃饭了，回头请你。车贷呢？
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[6]` 十八号那笔备注写的什么？
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[8]` 你自己的卡，电子回单能下载吗？
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].handoffLines[0]` 那你把回单发给赵律师。拿到之后，我们再一起看。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[8]` 结果我们听到了。生父是谁，不猜；孩子以后怎么安排，你们跟律师私下谈。这段不公开。
- `$manifest.nightShell.cafePrologue.forensic.accountClueLines[4]` 那就先别把这笔钱也算到顾*头上。

## 老方

- **固定性格：** 急躁的结果主义者
- **受压反应：** 数据越差，句子越像截止日期和命令。
- **防御动作：** 把关心包装成指标，把认可包装成下一项要求。
- **知识边界：** 只知道节目运营、后台曲线和公开播出内容，不知道案件麦外真相。

### 其他出声面

- `$manifest.nightShell.prologue.lines[1]` 老林，到屋了？你那张旧工牌怎么还压着线。跟你说正事，深夜档这个月再不达标，就并进娱乐区。二十三号早上九点，改版方案给我。
- `$manifest.nightShell.interludes[1].lines[1]` （嗦面声）前一场谁先垫谁主办，这一场谁先报谁着急。
- `$manifest.nightShell.interludes[1].lines[3]` 找到了。栖行自己披露的试点，单柜一天平均三块使用费。场地分成八毛，维护一块二，折旧一块五。还没算总部开销。
- `$manifest.nightShell.interludes[1].lines[7]` 稿子是这么说的。可它下一页重点写新增注册和押金余额，使用率一笔带过。押金二十九，收进来算应退的钱。
- `$manifest.nightShell.interludes[1].lines[10]` 我也卡这儿。先把原页存着，跟前一通的认购分开。别看都叫宸直，就算成同一笔。
- `$manifest.nightShell.interludes[1].lines[11]` 先吃吧。我这面已经能整块夹起来了。
- `$manifest.nightShell.interludes[2].lines[6]` 后台有人丢来一页打码课纲，标题和来源都遮了，只剩四个词：安全感、态度、向上社交、退出。

## 旁白

- **固定性格：** 克制的观察者
- **受压反应：** 不用结论，只留下声音、灯和动作。
- **防御动作：** 只写可感知物和动作后果。
- **知识边界：** 可描写舞台与玩家可见画面，不新增角色不知道的案情事实。

### 其他出声面

- `$manifest.nightShell.prologue.coldOpen.setupLines[0]` 你点下“开始直播”。屏幕上的三秒倒计时归零，开播提示音响了一声。
- `$manifest.nightShell.prologue.lines[0]` 2024 年 7 月 15 日，晚上八点，你推开直播间的门。老方正站在桌边，低头看着压住转接线的旧工牌。显示器已经亮了。
- `$manifest.nightShell.prologue.lines[4]` 你把工牌挪到一边。老方指了指时间，带上门出去了。你看完老婆的微信，收起手机，戴上耳机。
- `$manifest.nightShell.cafePrologue.cafe.openingLines[0]` 傍晚。你和妻子赵律师按约来到咖啡厅。她替你捋平卷起的领口。男方的妻子和她表哥已经坐在靠窗那桌。几张遮过名字的材料压在咖啡杯下，桌边的手机已经架好。
- `$manifest.nightShell.cafePrologue.cafe.parentageBlockLines[5]` 妻子猛地推开椅子。表哥也跟着站了起来。
- `$manifest.nightShell.cafePrologue.cafe.cameraBreakLines[1]` 表哥把自己的手机举起来。屏幕上的录制计时还在走，镜头朝着窗外。
- `$manifest.nightShell.cafePrologue.aftermath.openingLines[0]` 妻子和表哥先走了。你和赵律师把男方送到停车场。半小时后，妻子发来一条语音。
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[2]` 你在微信里建了个临时群，把男方和周会计加进来，发起群语音。周会计接通后，你将男方刚发来的明细转给他。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[0]` 回忆结束，时间回到现在。距离咖啡厅那晚已经过去数周。录制关闭。赵律师带来一份新的委托记录：妻子要求孩子的信息不得公开，随后同意双方带孩子到机构。工作人员核对身份、完成现场采样，今天才回告结果。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[2]` 男方把手机扣在桌上，手还压着，许久没有说话。

## 赵律师

- **固定性格：** 锋利的理性派
- **受压反应：** 听到说错的具体事实会打断纠正；涉及工作时问当前缺哪份材料，不在每次判断后自动补条件。
- **防御动作：** 遇到夸大的指控直接指出哪件事说错了；被催着许诺结果时拒绝，平常不用免责套话。
- **知识边界：** 在咖啡厅协助男方理清已有材料，但不代理诉讼；只解释法律与责任效果，不替案件当事人作证，不指点玩家圈哪一栏。

### 其他出声面

- `$manifest.nightShell.prologue.lines[3]` 吃饭没有？汤在冰箱，记得热。还有个东西我塞你包里了，等这几天忙完了再看。
- `$manifest.nightShell.interludes[0].lines[1]` 汤在这儿。别盯着宸直信托的页面了，先吃。
- `$manifest.nightShell.interludes[0].lines[3]` 你看他合同里的兑付安排了吗？
- `$manifest.nightShell.interludes[0].lines[5]` 我手上已经有几起宸直的兑付纠纷，约定的时间到了还在拖。那几笔投向商场、地产和关联项目，资产卖不掉，广告再好看也变不出现钱。
- `$manifest.nightShell.interludes[0].lines[7]` 嗯。别把我经手的几笔，直接当成他这只已经出事。
- `$manifest.nightShell.interludes[0].lines[8]` 他说她能拿八万，她只剩一万一千六百多。两个人倒是都挺敢想。
- `$manifest.nightShell.interludes[0].lines[10]` 你还笑，先把汤喝了。
- `$manifest.nightShell.interludes[0].lines[11]` 那我问个不用证据的。我要是也这么爱面子、花钱没数，你会不会什么都给我买？
- `$manifest.nightShell.interludes[1].lines[5]` 供应商的已结回执也对上了。三层返费还压在物料价里，采购越多，这笔越大。
- `$manifest.nightShell.interludes[1].lines[8]` 附注还有一行，押金账户转关联往来，接收方是宸直体系的资金平台。这里只列了归集，没有写归集后拿去干什么。
- `$manifest.nightShell.interludes[2].lines[2]` 你刚才说的那笔宸直，女方家买的是哪一款？
- `$manifest.nightShell.interludes[2].lines[4]` 持有页写的是九月底。合同还没发来？
- `$manifest.nightShell.interludes[2].lines[7]` 四个词，裁得连抬头都不剩了。叫老方找找原图吧。
- `$manifest.nightShell.interludes[2].lines[8]` 先别替人家发愁。你第一次去我家的时候，我爸妈要是先问你能拿多少，你还会来吗？
- `$manifest.nightShell.interludes[3].lines[1]` 今晚这些杯子，谁洗？
- `$manifest.nightShell.interludes[3].lines[3]` 不监督。我在门口等你。
- `$manifest.nightShell.cafePrologue.cafe.openingLines[1]` 站好，领子又卷了。大学到现在，一出门就得给你理。
- `$manifest.nightShell.cafePrologue.cafe.openingLines[8]` 孩子的事后面再说。你们愿意的话，你们也可以拍。
- `$manifest.nightShell.cafePrologue.cafe.legalClaimLines[3]` 他请我来，是想把离婚和账目的事当面说清。你愿意拿完整流水，我们现在就对；不愿意，今天就先谈能谈的。
- `$manifest.nightShell.cafePrologue.cafe.parentageBlockLines[4]` 你俩先别吵。孩子是不是他的，在这儿也掰扯不明白。
- `$manifest.nightShell.cafePrologue.cafe.cameraBreakLines[3]` 那今天就先这样。也确实没什么好谈的了。
- `$manifest.nightShell.cafePrologue.aftermath.openingLines[2]` 她不肯做鉴定，吵再多也没用。孩子是不是亲生的，我们现在手上什么都没有，拿对方没办法。真要打到法庭上，你手上必须要有相对确凿的证据才行。
- `$manifest.nightShell.cafePrologue.aftermath.routes[0].lines[3]` 先拿到材料，我再帮你看能不能向法院提出亲子关系异议，申请鉴定。
- `$manifest.nightShell.cafePrologue.aftermath.routes[0].lines[5]` 我们有必要证据，她拿不出相反证据又拒绝鉴定，法院可以支持你否认亲子关系的主张。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[4]` 那些日子不会因为这张纸就没发生过。今天不用把以后的事全决定。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[7]` 不能直接改。你要提出亲子关系异议，就把这份意见和相关材料交给法院审查。是否还要由法院委托鉴定，得由法院决定。
- `$manifest.nightShell.cafePrologue.forensic.accountClueLines[3]` 回单留好。这笔钱为什么每月都转，后面再查。

## 周会计

- **固定性格：** 冷静的数字理性派
- **受压反应：** 删掉形容词，只报金额、时间和路径。
- **防御动作：** 按日期排列，拒绝替数字添故事。
- **知识边界：** 只读材料中已经出现的账目与流程，不认定未知付款人身份。

### 其他出声面

- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[3]` 老林，你这下班语音，比上班还准时。明细我收到了，五号是房贷，十八号还有一笔固定转出。
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[5]` 四个月前就结清了，跟十八号这笔对不上。
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[7]` ‘私教课时’。连续四个月，都是同一天、同一个数。收款人的名字没显示全。
- `$manifest.nightShell.cafePrologue.forensic.accountClueLines[2]` 我看过了。十八号那笔，收款人不是顾*。

## 张法医

- **固定性格：** 技术洁癖型理性派
- **受压反应：** 碰到来源不全的材料会停止讨论结论。
- **防御动作：** 先查链条，再谈内容。
- **知识边界：** 只判断证据链与技术可检验性，不认定关系或动机。

### 其他出声面

- `$manifest.nightShell.cafePrologue.forensic.openingLines[1]` 这次用的是到场核对身份后提取的样本，没有用那只咬胶。这份鉴定意见排除生物学父子关系。它是你们双方委托的，不是法院委托的。

# 账单里的八万

## 林旭阳

- **固定性格：** 见得多、反应快，能接住情绪，也敢抓着绕答继续问
- **受压反应：** 听见用途偷换、关键人被省掉或对方答非所问，就收笑、打断，直接追他在躲哪一件事；不等材料全部到齐才施压。
- **防御动作：** 旧误判使他更会核对原话，不使他放弃判断。先从具体异常提出最可能的解释，再看对方怎样否认、补充或转题。
- **知识边界：** 现场信息来自已听见或已获得的内容；经验让他能从遗漏、利益与辩解推断隐藏路线并主动试探，无需先获确凿证据。尚未出现的具体身份、金额与材料不能被他说成已知事实。

### 夜 A

- `$case.openingDialogue[1]` 你好，我在听。你说。
- `$case.openingDialogue[3]` 听见了。后半段他还在催你今晚转。你转了吗？
- `$case.openingDialogue[5]` 那先别转。是什么钱？
- `$case.openingDialogue[7]` 要你垫多少？
- `$case.openingDialogue[9]` 他说什么时候还？
- `$case.openingDialogue[11]` 那你自己怎么想？
- `$case.sceneVersions[0].beforeVersion.lines[0]` 以前花过的钱他也要翻出来？你们平时住一起吗？钱是怎么安排的？
- `$case.sceneVersions[0].sceneCloser.lines[0]` 以前每个月都按时到？
- `$case.sceneVersions[1].beforeVersion.lines[0]` 这个月的钱没来，他怎么跟你解释的？
- `$case.sceneVersions[1].afterVersion.lines[0]` 他让你拿八万出来，却没给工资记录。把他发你的那份社保记录转到后台，我看看具体断在哪个月。
- `$case.sceneVersions[1].afterVersion.lines[3]` 你拿这张社保记录问过他吗？
- `$case.sceneVersions[2].beforeVersion.lines[0]` 后台有个人说是你男朋友。他说刚看到直播，听见你说他拿以前的钱逼你，所以来补材料。你确认一下，是他的账号吗？
- `$case.sceneVersions[2].beforeVersion.lines[2]` 他不上麦，发来的是你们的聊天和完整账单。姓名卡号我遮住了，现在看。
- `$case.sceneVersions[2].questionOptions[0].lines[1]` 你盯着他五千块衣服，可这张卡上，你们吃饭、住酒店、送你的礼物和设备就花了四万。你的消费也不低。
- `$case.sceneVersions[2].questionOptions[0].lines[3]` 店是你选的，设备在你家，平时也按这个标准花。五千块男装你一笔笔挑，你自己的这一年花了多少，算过吗？
- `$case.sceneVersions[2].questionOptions[0].lines[5]` 你可以不喜欢他瞒着工作，但不能把自己享受的全略过去，只拿他的衣服说他乱花钱。
- `$case.sceneVersions[2].questionOptions[1].lines[1]` 你也在听吧？其余三万五的明细发后台，工作和奖金究竟怎么回事，也把通知准备好。
- `$case.sceneVersions[2].questionOptions[1].lines[3]` 你这边也把收了多少、自己花了多少想清楚。明晚别再只拿他的五千块衣服说事。
- `$case.nightStructure.hangup.hostLine` 材料收到了。明晚把钱的用途和当初的约定一起说清楚。
- `$case.sceneVersions[0].questionOptions[0].question` 每个月转你一半，这事当初怎么说的？
- `$case.sceneVersions[0].questionOptions[1].question` 没住一起，平时的其他的钱就是各花各的？
- `$case.sceneVersions[1].questionOptions[0].question` 借钱以前，他跟你提过工作出了问题吗？
- `$case.sceneVersions[2].questionOptions[0].question` 云栖这顿酒水是谁点的，你平时吃饭也按这个标准？
- `$case.sceneVersions[2].questionOptions[1].question` 共同消费四万，男装五千，还有至少三万五没说清。他给你解释过吗？

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[1]` 她说都花在两个人身上了，自己的账还没拿来。
- `$case.overnightStructure.dayScenes[0].body.beats[3]` 工资还在发就借钱投资？他图什么？
- `$case.overnightStructure.dayScenes[0].body.beats[5]` 我给他留个言，让他把借款用途、产品介绍和离职通知一起准备好。
- `$case.overnightStructure.dayScenes[0].body.beats[7]` 有意思，广告全在说赚多少、摊子多大。借款利息每个月得还，产品的钱什么时候回来，这页倒没写清。晚上问他本人。

### 夜 B

- `$case.sceneVersions[3].beforeVersion.lines[0]` 云栖这家店，你以前去过吗？
- `$case.sceneVersions[3].sceneCloser.lines[0]` 昨晚有位匿名观众发来你两年前的朋友圈，定位也是云栖。你看一下。
- `$case.sceneVersions[6].beforeVersion.lines[0]` 不问你前任。就问现在，你自己一个月挣多少？
- `$case.sceneVersions[6].beforeVersion.lines[2]` 工资八千多，探店和这些消费花多少？
- `$case.sceneVersions[6].beforeVersion.lines[4]` 那就先说账单上这一万二的灯和稳定器。为什么也要花这笔？
- `$case.sceneVersions[6].questionOptions[0].lines[1]` 那你自己付的饭钱，有商家答应报销吗？
- `$case.sceneVersions[6].questionOptions[1].lines[1]` 明白，钱反正已经花出去了，什么时候能见回头钱咱也不知道。
- `$case.sceneVersions[6].sceneCloser.lines[1]` 白天我问他三月那三笔钱。他现在回复：“三月我借了二十万，分两次各十万买了宸直的产品，想着赚点把开销撑住。”这件事他跟你说过吗？
- `$case.sceneVersions[7].beforeVersion.lines[0]` 你说是他愿意给，男方说是放你这里存着。当初怎么约定的，把前后原话发来，不只发转账数字。
- `$case.sceneVersions[7].beforeVersion.lines[2]` 他发来的记录是一万七千五，十四个月，二十四万五。房租还另外付。这些你认吗？
- `$case.sceneVersions[7].beforeVersion.lines[4]` 他留言说，以为你至少存了十五万，才向你要八万。你让他看过余额吗？
- `$case.sceneVersions[7].beforeVersion.lines[7]` 这是你们当时商量钱怎么用的聊天。
- `$case.sceneVersions[7].testimonyWall.acts[0].decisivePresent.hostLine` 你当时明明说替两个人存着。现在钱要用了，怎么变成从没答应过？
- `$case.sceneVersions[7].testimonyWall.acts[0].inquiry.options[0].lines[1]` 一分不能花，和花得差不多却让他以为还存着，是一回事吗？
- `$case.sceneVersions[7].testimonyWall.acts[1].openerLines[0]` 转给你的钱，除了用于共同生活，你房租也不用出，剩下的钱呢？
- `$case.sceneVersions[7].testimonyWall.acts[1].openerLines[3]` 这是他刚发来的，你看看。
- `$case.sceneVersions[7].testimonyWall.acts[1].decisivePresent.hostLine` 你自己买衣服做脸的钱，也要全说成两个人一起花的？
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.openingLines[0]` 转给你的钱，除了用于共同生活，你房租也不用出，剩下的钱呢？
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.openingLines[2]` 共同花的，和你自己买东西的分开说。男方，你说提醒过她少花，原话也发来。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.openingLines[4]` 这是他刚发来的，你看看。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.options[1].lines[1]` 衣服做脸是你自己用，出去吃饭还让他另付。你把两头都说成共同生活，这二十四万五到底替你们存下多少？
- `$case.sceneVersions[7].afterVersion.lines[0]` 报个现在的余额。
- `$case.sceneVersions[7].afterVersion.lines[2]` 他以为还有十五万，你只剩这点，为什么不告诉他？
- `$case.sceneVersions[7].afterVersion.lines[5]` 他把离职通知发来了，十万五的补偿金预计月底发。他工作上的事骗了你。可你其实心里门清这些钱都花哪了，就想在我这讨个说辞糊弄人家。
- `$case.sceneVersions[7].afterVersion.lines[7]` 你有什么话当着直播间直接跟他说吧。
- `$case.sceneVersions[7].afterVersion.lines[9]` 主动赠与是你现在的说法。可“我替我们存着”也是你自己说的。拿钱时说为两个人存着，自己花的时候不讲，到他用钱就只剩自愿给的？
- `$case.sceneVersions[7].afterVersion.lines[11]` 你想要高消费、要人给你花钱，还要把自己说成什么都没要。店是你挑的，衣服做脸是你花的，余额你也一直知道。说到底就是虚荣、舍不得自己掏钱。你来找我，是想讨句好听的去堵他，不是来把账讲明白。
- `$case.overnightStructure.linearCallback.lines[0]` 昨晚的材料都收到了。接着说云栖这家店。
- `$case.sceneVersions[3].questionOptions[0].question` 跟朋友只去过一次？
- `$case.sceneVersions[6].questionOptions[0].question` 你说先垫，账号现在挣的钱够把这些开销补回来吗？
- `$case.sceneVersions[6].questionOptions[1].question` 这些探店没有约定报酬的部分，现在拿什么填？

### 终局

- `$case.stageJudgement` 你自己收的钱花在哪儿，心里门清。就想在我这讨个说辞糊弄人家。

### 其他出声面

- `$case.sceneVersions[4].questionOptions[0].lines[1]` 那你当时以为这笔钱怎么付？
- `$case.sceneVersions[4].questionOptions[0].lines[3]` 分期你签过吗？
- `$case.sceneVersions[4].sceneCloser.lines[0]` 这一万二先单独记下来。我们把整张账单重新加一遍。
- `$case.careChoices[0].hostLine` 当初答应存的钱，你得自己向他交代。
- `$case.sceneVersions[4].entryQuestion` 那一万二买了什么？
- `$case.sceneVersions[4].casualQuestions[0].question` 你以前真想过做探店号？
- `$case.sceneVersions[4].casualQuestions[1].question` 那句“投资你”，你当时怎么听？
- `$case.sceneVersions[4].questionOptions[0].question` 那套灯和稳定器，买完以后送到谁那里了？
- `$case.sceneVersions[4].questionOptions[1].question` 他把这笔分期叫“投资”。你当时有没有觉得，自己也该担一点？
- `$case.sceneVersions[4].questionOptions[2].question` 你说自己这两天才知道是分期。买的时候，你到底看了什么？
- `$case.sceneVersions[4].reviewProbes[0].question` 所以你已经辞职专门做账号了？
- `$case.sceneVersions[5].entryQuestion` 他买衣服一共五千左右。可账单里另外四万左右，都跟你有关。你开头为什么只拿衣服说事？
- `$case.sceneVersions[5].casualQuestions[0].question` 他以前跟你开过口借钱吗？
- `$case.sceneVersions[5].questionOptions[0].question` 你加完还差至少三万五，这个数对不上。你当时怎么问他的？
- `$case.sceneVersions[5].questionOptions[1].question` 这些账单上的日子，你们当时在一起吗？
- `$case.sceneVersions[5].dialogueOptions[0].question` 你当时已经准备转了吗？
- `$case.sceneVersions[5].dialogueOptions[1].question` 他后来为什么又改口？
- `$case.sceneVersions[5].reviewProbes[0].question` 那剩下的钱也都是你们俩花的？

## 案一咨询者·沈

- **固定性格：** 敏感的体面维护者
- **受压反应：** 越紧张句子越长，堆很多场面细节；一说到自己收过的钱和催过的电话就突然变短。
- **防御动作：** 先说男方自愿养她。房租另付和本人收入让半薪用途解释不通后，才说当初自己提出替两个人存钱，随即辩称没说一分不能花。实际余额只在固定尾段自报一次。
- **知识边界：** 知道十四个月固定转账累计二十四万五、自己只剩一万一千六百多，也知道自己的消费、催款动作、见过的流水与对方说法；不知道尾号 3301 的主人。知道当初由自己提出半薪代存，不是男方单方面猜用途。

### 夜 A

- `$case.openingDialogue[0]` 主播你好，我想问个自己的事。
- `$case.openingDialogue[2]` 我刚转到后台那段，你听见了吧？我男朋友刚才找我，就是想让我先垫一笔钱。
- `$case.openingDialogue[4]` 没有。我把转账页面打开过，后来又退了。
- `$case.openingDialogue[6]` 他信用卡该还了。说奖金晚发，让我帮他顶几天。
- `$case.openingDialogue[8]` 八万。
- `$case.openingDialogue[10]` 没说准，就说过几天。
- `$case.openingDialogue[12]` 我不想转。他还提以前给我花过的钱，说得像我今天不转，这一年半都是我欠他的。
- `$case.sceneVersions[0].noClueReaction` 我们没住一起，平时还是一起花钱的。
- `$case.sceneVersions[0].questionOptions[0].lines[0]` 这是他追我的时候承诺的，我又没要。我也没像其他人一样扣着工资卡。
- `$case.sceneVersions[0].questionOptions[1].lines[0]` 也不是。吃饭出去玩，我们日常都是一起花销的。总不能因为没住一起，又交了一部分工资，剩下的就都得我花吧。
- `$case.sceneVersions[0].sceneCloser.lines[1]` 对。就这个月第一次没来。
- `$case.sceneVersions[0].afterVersion.lines[0]` 就是这个月没转，我才去问他。
- `$case.sceneVersions[1].noClueReaction` 这个我真不知道。他当时就说奖金，我手里没有别的话。
- `$case.sceneVersions[1].afterVersion.lines[1]` 好，发过去了，就是他给我的那份。
- `$case.sceneVersions[1].afterVersion.lines[4]` 问了。他说工资明细太私密，停两个月只是漏缴。我还是觉得不对，八万也没转。
- `$case.sceneVersions[2].noClueReaction` 你问哪一笔？我刚翻开账单，先看见的就是那几件男装。
- `$case.sceneVersions[2].beforeVersion.lines[1]` 是他。我把直播链接发给他了，省得我再解释。
- `$case.sceneVersions[2].questionOptions[0].lines[0]` 酒是他挑的，我还说太贵了。店是我想去的，平时探店也会去这种地方。
- `$case.sceneVersions[2].questionOptions[0].lines[2]` 一起出去又不是只有我享受。他愿意付，我还能每次抢着结账？
- `$case.sceneVersions[2].questionOptions[0].lines[4]` 我没算全年。谈恋爱谁还拿计算器啊。
- `$case.sceneVersions[2].questionOptions[0].lines[6]` 我也没说自己一分钱没花。可他当时又没拦我。
- `$case.sceneVersions[2].questionOptions[1].lines[0]` 没解释。问起来就说奖金快发了，让我先把卡还上。
- `$case.sceneVersions[2].questionOptions[1].lines[4]` 行，明晚我说。可别因为他发了几张图，就把账都算我头上。
- `$case.nightStructure.hangup` 他把材料都发你了吧？那你看，我明晚再来。
- `$case.sceneVersions[0].version` 工资卡他自己拿着，每个月转我一半，已经一年多了。不住在一起，他住他的，我住我的。以前吃饭出去玩也都是他付，他从没说吃力。就是这个月没转，我才去问他。结果自己的钱没等到，他倒让我先拿八万。我就想问，之前愿意给我的，现在还能反过来逼我还吗？
- `$case.sceneVersions[1].version` 这个月那笔没来，我就问他怎么回事，他还是说奖金晚发。我不放心，才让他把工资记录发来。工资记录没发，只给了我一份从电子社保卡导出的缴费记录，说公司漏缴了两个月。我翻到最后，才发现缴费停在四月。可四月以后，他还天天跟我说加班。
- `$case.sceneVersions[1].questionOptions[0].answer` 没有。他还是天天说忙，项目要上线。有一回我说给他送点吃的，他让我别去，说公司门禁严。可那阵子，他可能已经不去公司了。
- `$case.sceneVersions[2].version` 账单八万出头。男装就五千左右，一件大衣两千多，他都没工作了，还买这些。餐厅、酒店和礼物也有，都是我们一起出去的。云栖那顿纪念日晚餐最贵，主要贵在酒，店和靠窗位是我让他订的。还有一万二的拍摄设备，在我家。我没把每一笔都加起来。

### 夜 B

- `$case.sceneVersions[3].noClueReaction` 那晚就这些。别的我现在想不起来。
- `$case.sceneVersions[3].questionOptions[0].lines[0]` 就那一次。这跟他现在找我要钱有什么关系？
- `$case.sceneVersions[6].noClueReaction` 我做这个号也不是一天两天了，总得先试试吧。
- `$case.sceneVersions[6].beforeVersion.lines[1]` 八千多。
- `$case.sceneVersions[6].beforeVersion.lines[3]` 没固定数，有时候拍一顿饭，有时候买衣服，零零碎碎的。我又不是天天买大件。
- `$case.sceneVersions[6].questionOptions[0].lines[0]` 还没。合作只接过几次，钱不多。
- `$case.sceneVersions[6].questionOptions[0].lines[2]` 大部分没有。我得先拍，账号做起来才有人找。
- `$case.sceneVersions[6].questionOptions[1].lines[0]` 工资啊，还有……他每个月给我的。我也不能拍一条没接到广告，就立刻不拍了。
- `$case.sceneVersions[6].sceneCloser.lines[2]` 说过想投资，没说钱是借的。
- `$case.sceneVersions[7].beforeVersion.lines[3]` 数没错，房租也是他另外付的。
- `$case.sceneVersions[7].beforeVersion.lines[5]` 没有。我的账户干嘛天天给他看？
- `$case.sceneVersions[7].beforeVersion.lines[8]` 他连这么久以前的聊天都翻出来了？
- `$case.sceneVersions[7].testimonyWall.acts[0].decisivePresent.callerLine` 是说过存着，可也没说一分不能花啊。我穿得好看，陪他出去，他不也有面子？
- `$case.sceneVersions[7].testimonyWall.acts[0].inquiry.openingLines[0]` 是我收的，每个月那一半都在我卡里。可谈恋爱的时候说以后一起生活，又没定哪天结婚，也没规定每月必须留多少。我穿什么、去哪儿，他都知道，从前不说，现在急用了就让我全拿出来。每个月那笔我收了，可那是他给我花的。我从没答应替两个人存起来。
- `$case.sceneVersions[7].testimonyWall.acts[0].inquiry.options[0].lines[0]` 是说过存着，可也没说一分不能花啊。我穿得好看，陪他出去，他不也有面子？
- `$case.sceneVersions[7].testimonyWall.acts[0].inquiry.options[0].lines[2]` 我没天天给他报余额。他自己也不问，我为什么总得先交代？
- `$case.sceneVersions[7].testimonyWall.acts[0].inquiry.options[1].lines[0]` 只说以后生活用，没定每个月非得剩多少。
- `$case.sceneVersions[7].testimonyWall.acts[0].inquiry.options[2].lines[0]` 没说。他说这本来就是给我们存着的钱。
- `$case.sceneVersions[7].testimonyWall.acts[1].openerLines[1]` 一起吃喝、出去玩不都得花钱？现在怎么都来问我。
- `$case.sceneVersions[7].testimonyWall.acts[1].openerLines[4]` 他说什么就是什么？你先听我讲完。
- `$case.sceneVersions[7].testimonyWall.acts[1].decisivePresent.callerLine` 是花了，做脸、衣服、探店，哪样不要钱？他当时愿意给，现在急用了才来翻账。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.openingLines[1]` 一起吃喝、出去玩不都得花钱？现在怎么都来问我。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.openingLines[5]` 他说什么就是什么？你先听我讲完。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.openingLines[6]` 每个月转给我的钱，全是两个人一起花的，我没单独拿去给自己消费。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.options[0].lines[0]` 能找几张，可光看账单，也看不出是谁付的钱。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.options[1].lines[0]` 是花了，做脸、衣服、探店，哪样不要钱？他当时愿意给，现在急用了才来翻账。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.options[2].lines[0]` 那会儿没有。是这次急用钱才来要的。
- `$case.sceneVersions[7].afterVersion.lines[1]` 一万一千六百多。我的工资也基本花完了。
- `$case.sceneVersions[7].afterVersion.lines[3]` 他又没问。再说他自己连失业都瞒着我。
- `$case.sceneVersions[7].afterVersion.lines[6]` 他愿意给我的，怎么现在都成我的错了？
- `$case.sceneVersions[7].afterVersion.lines[8]` 反正八万我不转，之前给我的就是主动赠与。
- `$case.sceneVersions[7].afterVersion.lines[10]` 那我跟他这一年多呢？陪他出去、替他撑面子，这些你怎么不算？
- `$case.sceneVersions[7].afterVersion.lines[12]` 行，你已经这么看我了。我也不想再解释。
- `$case.sceneVersions[3].version` 我俩第一次去那家餐厅。靠窗那排好拍照，我才让他订。认识他以前跟朋友去过一次，没别的了。
- `$case.sceneVersions[6].version` 灯和稳定器，是给我买的，也一直是我在用。我拿来拍探店，吃饭、买衣服都能当素材。以前也接过合作，我是想把账号做起来，不是光顾着自己享受。探店也就是先垫点钱，等合作下来就回来了。他也知道我在做这个，从前还帮我拍。现在卡还不上了，连设备都算到我头上。设备的分期我可没答应过，那是他自己选的付款方式。
- `$case.sceneVersions[7].testimonyWall.acts[0].statements[0].text` 每个月那笔我收了，可那是他给我花的。我从没答应替两个人存起来。
- `$case.sceneVersions[7].testimonyWall.acts[0].statements[0].pressResponse` 他以前又不查账。怎么今天要用钱了，就全得躺在那儿等着他？
- `$case.sceneVersions[7].testimonyWall.acts[0].statements[1].text` 他今晚要的八万，不能因为以前花过钱就算成我欠他的。
- `$case.sceneVersions[7].testimonyWall.acts[0].statements[1].pressResponse` ‘八万不是我的卡。以前的钱……那是以前。’
- `$case.sceneVersions[7].testimonyWall.acts[0].statements[2].text` 我手里剩多少一直没给他看，因为那是我的账户。
- `$case.sceneVersions[7].testimonyWall.acts[0].statements[2].pressResponse` ‘我没给他看过余额。十五万是他自己猜的。’
- `$case.sceneVersions[7].testimonyWall.acts[1].statements[0].text` 每个月转给我的钱，全是两个人一起花的，我没单独拿去给自己消费。
- `$case.sceneVersions[7].testimonyWall.acts[1].statements[0].pressResponse` 一起出去的时候，我穿得好看，他也有面子。
- `$case.sceneVersions[7].testimonyWall.acts[1].statements[1].text` 设备是他送我的，分期是他自己选的。
- `$case.sceneVersions[7].testimonyWall.acts[1].statements[1].pressResponse` 这件事我没改口，东西在我家。
- `$case.overnightStructure.postures.againstCaller` 我回来了，你问吧。
- `$case.overnightStructure.postures.withCaller` 我回来了，你问吧。
- `$case.nightStructure.returnStance.lines.defensive` 我回来了。你接着问吧。
- `$case.nightStructure.returnStance.lines.open` 我回来了。你接着问吧。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。你接着问吧。

### 其他出声面

- `$manifest.nightShell.prologue.coldOpen.interestLines[1]` 他就回我：‘我又没拿钱出去乱花，奖金这两天就发了。你先帮我把这期卡还上，别真拖到逾期，今晚转我行不行？’
- `$case.sceneVersions[4].noClueReaction` 账号的事先别扯远。灯在我家，这个我认。
- `$case.sceneVersions[4].questionOptions[0].lines[0]` 送到我这儿了，东西也一直是我在用。
- `$case.sceneVersions[4].questionOptions[0].lines[2]` 我真以为那是他全款买来送我的。
- `$case.sceneVersions[4].questionOptions[0].lines[4]` 没有，也没答应替他还。
- `$case.sceneVersions[4].questionOptions[1].missReaction` 我当时真不知道是分期，也没跟他谈过要一起还。
- `$case.sceneVersions[5].noClueReaction` ……这几笔我现在不想一条条念。让我先把这页看完。
- `$case.sceneVersions[5].questionOptions[1].missReaction` 有些时候在一起，有些我记不清。你现在让我一笔笔对，我对不上。
- `$case.careChoices[0].lines[0]` 我自己跟他说，挂了。
- `$case.sceneVersions[4].version` 那一万二买的是拍视频用的灯和稳定器。他当时跟我说：“账号做起来，你就不用看别人脸色。”还说这是在投资我。我以前念叨过想做探店号，听到这句确实挺高兴，也一直以为那是他全款买来送我的。这两天看到账单，我才知道那一万二走的是分期。
- `$case.sceneVersions[4].casualQuestions[0].answer` 想过，断断续续念了几个月。我关注了好些博主，有个杭州的姑娘，拍面馆的，就一个手机加个小支架，拍得特别香，她粉丝可多了。我还研究过转场，就那种一挥手换一家店的……哎，说这个干嘛。反正，真要拍我又总说没设备。现在设备倒是有了。
- `$case.sceneVersions[4].casualQuestions[1].answer` 很甜，也很有面子。像他认真把我的事当事。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 送到我这儿了，一直是我用。可他说的是给我做账号，我怎么知道他刷的是分期。
- `$case.sceneVersions[4].questionOptions[1].answer` 没有。我当时听见的是他要支持我做账号。东西送到我这儿以后，我也一直在用，可我真以为是他全款买来送我的，没想过还款会落到我头上。
- `$case.sceneVersions[4].questionOptions[2].answer` 我只看了他挑的那套设备，没看怎么付的钱。东西送到我这儿，我就用了。
- `$case.sceneVersions[4].reviewProbes[0].answer` 没辞，我现在还上班。他是这么劝我的，又不是我已经做到了。
- `$case.sceneVersions[5].version` ……这些不是全花在我一个人身上。可四万里，确实有我那一份。
- `$case.sceneVersions[5].casualQuestions[0].answer` 没有。一次都没有，所以这次我才慌。他那个人，以前连打车钱都不让我掏。
- `$case.sceneVersions[5].questionOptions[0].answer` 我追着问用途。他没接，反过来问我八万到底转不转。我就没再往下问。
- `$case.sceneVersions[5].questionOptions[0].guardedAnswer` 问过，他没细说。只说不是我该管的那部分。
- `$case.sceneVersions[5].questionOptions[1].answer` 近几个月能对上。再往前……我把页面关了。一个人没敢看完。
- `$case.sceneVersions[5].dialogueOptions[0].answer` 差一点。页面都打开了。就是看到到期日那里，我才停住。
- `$case.sceneVersions[5].dialogueOptions[1].answer` 他说我别紧张，这几天转也行。可前面那句“今晚就要”已经把我吓到了。
- `$case.sceneVersions[5].reviewProbes[0].answer` 我说的是已经看见的这几笔。剩下的我还不知道，不能又都算我。

## 案一男友

- **固定性格：** 羞耻驱动的防御者
- **受压反应：** 被问金额时把问题改写成信任和离开。
- **防御动作：** 隐瞒失业，把补偿金说成奖金；代存约定使他预期有存款，但不能替他免除自己签下的借款和信托风险。
- **知识边界：** 知道自己的失业、贷款、十四个月转账与八万元请求，也知道自己只是估算女友至少还有十五万；对她的真实余额和他人账户身份不能装作早已知道。

### 后台／材料回流

- `$case.respondentNote.text` 我发来的流水、聊天和离职通知都可以遮名展示。借款和投资是我做的，三万五的明细我不想公开。

### 其他出声面

- `$manifest.nightShell.prologue.coldOpen.line` 我只是怕你知道我失业后就离开我。

## 案一闺蜜

- **固定性格：** 爱热闹又怕丢脸
- **受压反应：** 先强调自己只是起哄，再缩短回答。
- **防御动作：** 把自己的动作说成气氛到了。
- **知识边界：** 只知道朋友圈、饭局和自己删过的评论，不知道男方账目。

### 后台／材料回流

- `$case.investigationHooks[0].material` 第一夜匿名私信附来的旧截图：发布于本案第一夜的两年前，定位云栖餐厅。她的配文是“第三次来啦，他每次都订靠窗这排，知道我爱拍照。”朋友评论“你男朋友也太会挑地方了”。

## 旁白

- **固定性格：** 克制的观察者
- **受压反应：** 不用结论，只留下声音、灯和动作。
- **防御动作：** 只写可感知物和动作后果。
- **知识边界：** 可描写舞台与玩家可见画面，不新增角色不知道的案情事实。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[6]` 男方先回了一张当时保存的宣传页：高收益、到期返本，下面排列着地产和商业项目。你打开机构介绍，满页都是新项目签约。

## 周会计

- **固定性格：** 冷静的数字理性派
- **受压反应：** 删掉形容词，只报金额、时间和路径。
- **防御动作：** 按日期排列，拒绝替数字添故事。
- **知识边界：** 只读材料中已经出现的账目与流程，不认定未知付款人身份。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 昨晚那通还没问完？我看看。每月三万五，转她一万七千五，房租另外付。
- `$case.overnightStructure.dayScenes[0].body.beats[2]` 往下看。他居然也买理财了。三月十一号借二十万，十二号、十四号各买十万宸直。是不是借来买的，得问他。
- `$case.overnightStructure.dayScenes[0].body.beats[4]` 你问问他当时看了什么介绍。别光算她那八万。

# 职场报销截图

## 林旭阳

- **固定性格：** 见得多、反应快，能接住情绪，也敢抓着绕答继续问
- **受压反应：** 听见用途偷换、关键人被省掉或对方答非所问，就收笑、打断，直接追他在躲哪一件事；不等材料全部到齐才施压。
- **防御动作：** 旧误判使他更会核对原话，不使他放弃判断。先从具体异常提出最可能的解释，再看对方怎样否认、补充或转题。
- **知识边界：** 现场信息来自已听见或已获得的内容；经验让他能从遗漏、利益与辩解推断隐藏路线并主动试探，无需先获确凿证据。尚未出现的具体身份、金额与材料不能被他说成已知事实。

### 夜 A

- `$case.openingDialogue[1]` 嗯，你说。
- `$case.openingDialogue[3]` 钱花哪儿了？
- `$case.openingDialogue[5]` 我问你用在哪了。
- `$case.openingDialogue[7]` 那你催过吗？
- `$case.openingDialogue[9]` 怕被领导骂吧。
- `$case.openingDialogue[11]` 你们公司做什么的？
- `$case.openingDialogue[13]` 柜子铺这么多，公司靠什么挣钱？
- `$case.openingDialogue[15]` 押金得退给用户。光收使用费，现在能盖住租场地、维修这些成本吗？
- `$case.openingDialogue[17]` 宸直是吧。现在满世界都是他家的新闻。那你垫钱，是没给你批让你先垫，还是你来不及报批主动垫的？
- `$case.sceneVersions[1].questionOptions[2].lines[1]` 所以四千你想拿，后面的活动也想接，催钱又不想把他得罪了？
- `$case.sceneVersions[2].sceneCloser.lines[0]` 把他发你的原页给我看看。
- `$case.nightStructure.hangup.hostLine` 好，问完把原话和单子带回来。
- `$case.sceneVersions[0].casualQuestions[0].question` 你说能接的时候，他怎么回的？
- `$case.sceneVersions[0].casualQuestions[1].question` 主管平时对你怎么样？
- `$case.sceneVersions[0].casualQuestions[2].question` 六万八的数，是你刷卡前就知道的？
- `$case.sceneVersions[0].questionOptions[0].question` 你是想争这场活动，才答应先垫这六万八，对吗？
- `$case.sceneVersions[1].entryQuestion` 你刚才说活动是争来的。垫这么多钱，别人也愿意？
- `$case.sceneVersions[1].casualQuestions[0].question` 上回结算有单子吗？
- `$case.sceneVersions[1].casualQuestions[1].question` 是你们部门几个人轮着办？
- `$case.sceneVersions[1].casualQuestions[2].question` 算谁的业绩，怎么记？
- `$case.sceneVersions[1].questionOptions[0].question` 别人愿意先垫，是光算业绩，还是结算时还有钱？
- `$case.sceneVersions[1].questionOptions[1].question` 上回多出来一万二，主办能拿多少？
- `$case.sceneVersions[1].questionOptions[2].question` 那你这次六万八，他也答应多报、再分给你？
- `$case.sceneVersions[2].entryQuestion` 这六万八刷出去以后，他拿什么让你继续等？
- `$case.sceneVersions[2].casualQuestions[0].question` 信用卡账单出来以后，你准备怎么还？
- `$case.sceneVersions[2].casualQuestions[1].question` 你以前用个人信用卡垫过公司的钱吗？
- `$case.sceneVersions[2].questionOptions[0].question` 你问的是付款，他一直发旧图。财务受理了没有，你直接问过吗？

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[1]` 桌上这杯。还有个问题：他们说铺的柜子多了就赚钱，可租金现在够不够成本，没人答。
- `$case.overnightStructure.dayScenes[0].body.beats[3]` 我让老方找原稿。晚上先听小陈在财务问到了什么。
- `$case.overnightStructure.dayScenes[1].body.beats[1]` 这些也算在卖给栖行的物料价里？
- `$case.overnightStructure.dayScenes[1].body.beats[4]` 陈那笔还没报下来。你们以前这三笔付给谁了，回执还找得到吗？
- `$case.overnightStructure.dayScenes[1].body.beats[6]` 三栏表和那条工作语音一起发给我。晚上回执到了，再对每笔到底付给谁。
- `$case.overnightStructure.dayScenes[2].body.beats[0]` 主办为什么都要先垫？
- `$case.overnightStructure.dayScenes[2].body.beats[2]` 八万是陈这一个人的额度？
- `$case.overnightStructure.dayScenes[2].body.beats[4]` 多出来的怎么处理？
- `$case.overnightStructure.dayScenes[2].body.beats[6]` 通知发我吧。主管到底怎么填的，我找陈要那张草单。

### 夜 B

- `$case.sceneVersions[3].questionOptions[0].lines[1]` 受理页和草单都发来。先看他答应你的，财务到底认不认。
- `$case.sceneVersions[4].testimonyWall.acts[0].decisivePresent.hostLine` 他答应你先办，财务给这几个部门的回复，也是先办？
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[1]` 他答应你先办，财务给这几个部门的回复，也是先办？
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[3]` 你现在拿他的保证，替没有付款日期找理由。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[1]` 比你早，材料也齐，照样没付。他答应优先，财务给过确认吗？
- `$case.sceneVersions[4].testimonyWall.acts[1].openerLines[1]` 到这时候还让你们垫？
- `$case.sceneVersions[4].testimonyWall.acts[1].openerLines[3]` 这一万二，有外面的人做过服务吗？
- `$case.sceneVersions[4].testimonyWall.acts[1].decisivePresent.hostLine` 发给你的分配写了，给财务的草单没写，还换成外部协调。你刚说财务都知道，是从哪儿看出来的？
- `$case.sceneVersions[4].testimonyWall.acts[1].inquiry.openingLines[1]` 到这时候还让你们垫？
- `$case.sceneVersions[4].testimonyWall.acts[1].inquiry.openingLines[3]` 这一万二，有外面的人做过服务吗？
- `$case.sceneVersions[4].testimonyWall.acts[1].inquiry.options[1].lines[1]` 单不是你填的，但多报一万二、你分四千，你转钱前就知道。现在不能把自己说成只替公司垫款，其他全不知情。
- `$case.sceneVersions[4].testimonyWall.acts[1].inquiry.options[1].lines[3]` 所以真实垫款照实催，那一万二也照实说，不能为了分到钱，就替外部协调这四个字打掩护。
- `$case.sceneVersions[4].beforeVersion.lines[1]` 先把她们的受理页放上来。
- `$case.sceneVersions[4].sceneCloser.lines[0]` 下周活动还让先垫。你准备怎么回？
- `$case.sceneVersions[4].sceneCloser.lines[2]` 财务问那一万二，你怎么答？
- `$case.overnightStructure.linearCallback.lines[0]` 供应商的返费表和部门预算我看过了。你今天补的受理页，先对一下，接着说财务怎么回你的。
- `$case.sceneVersions[3].entryQuestion` 今天问到新的情况了吗？
- `$case.sceneVersions[3].casualQuestions[0].question` 她们怎么知道你也被欠着？
- `$case.sceneVersions[3].casualQuestions[1].question` 这些受理页能给后台看吗？
- `$case.sceneVersions[3].casualQuestions[2].question` 以前她们也给公司垫过钱？
- `$case.sceneVersions[3].casualQuestions[3].question` 其他部门的垫款，是这次问同事才知道的？
- `$case.sceneVersions[3].questionOptions[0].question` 财务问到那一万二，你当时怎么回的？

### 终局

- `$case.stageJudgement` 六万八还没还，下场先垫钱的通知倒比付款日期来得快。又准备拿旧立项页顶一个月？

### 其他出声面

- `$case.careChoices[0].hostLine` 有付款消息再说。
- `$case.overnightStructure.liveCounterBeats[0].choices[0].lines[1]` 月底打钱，还是月底再议？他还是没说。
- `$case.overnightStructure.liveCounterBeats[1].lines[4]` 他提到八万草单了，把那页也打开。

## 第二通咨询者·陈

- **固定性格：** 想证明能扛事的焦虑新人
- **受压反应：** 害怕时句子越来越短；复述公司话时给流程词加引号。
- **防御动作：** 先只讲业绩，后来用以前都能结和部门包干替私人分配辩护。
- **知识边界：** 知道自己垫款、主管分配和他人授权提供的受理页，不知道公司押金去了哪里。

### 夜 A

- `$case.openingDialogue[0]` 主播，我想问个工作上的事。
- `$case.openingDialogue[2]` 我替公司垫了六万八，三个星期了，还没报下来。
- `$case.openingDialogue[4]` 用我的信用卡刷的。这个月还款账单都出了，钱还没回来。
- `$case.openingDialogue[6]` 招商会的场地和礼品。场地四万八，礼品两万。
- `$case.openingDialogue[8]` 我差点在公司群里问：公司报销什么时候能下来？可我没敢发。
- `$case.openingDialogue[10]` 怕影响后续给我活动。这次城市合伙人的招商会是我刚争来的。一发出去，以后铁定不让我碰客户活动了。
- `$case.openingDialogue[12]` 栖行，做商场里的共享充电柜和储物柜的。最近一直催着铺点。主要股东之一是现在最火的宸直。
- `$case.openingDialogue[14]` 使用费，还有城市合伙人进来的钱。用户注册交二十九押金，主管说规模起来就赚钱，商场里摆得越多越好谈。
- `$case.openingDialogue[16]` 这我真没看过账。公司会上都是讲新增多少点，宸直又投了多少。主管说先占住地方，后来就好赚了。
- `$case.openingDialogue[18]` 主管私聊让我先垫，说活动批了，费用单他来补。
- `$case.sceneVersions[0].noClueReaction` 我先说能做活动，垫钱是他后来私聊提的。
- `$case.sceneVersions[0].questionOptions[0].lines[0]` 对，我想争。谁能先出钱，就让谁办。额度不够，我还申请了临时提额。
- `$case.sceneVersions[1].noClueReaction` 业绩也要啊。可光为了业绩，哪会人人都愿意先掏钱。
- `$case.sceneVersions[1].questionOptions[0].lines[0]` 他们叫协调费，也算忙前忙后的辛苦钱。上回垫五万八，最后结了七万。
- `$case.sceneVersions[1].questionOptions[1].lines[0]` 主办拿四千，主管留八千。上回主办跟我说的，还给我看了到账。
- `$case.sceneVersions[1].questionOptions[2].lines[0]` 也按八万报，报下来分我四千。以前都能回来，我才接的。
- `$case.sceneVersions[1].questionOptions[2].lines[2]` 我就想把钱要回来，没想跟主管翻脸。以后还得在他手底下干呢。
- `$case.sceneVersions[2].noClueReaction` 我现在就是拿不出日期。他每次只说‘在走’。
- `$case.sceneVersions[2].casualQuestions[1].lines[0]` 这么大一笔没有。以前最多垫过打车费，第二天就能报。
- `$case.sceneVersions[2].casualQuestions[1].lines[2]` 六万八，是第一次。
- `$case.sceneVersions[2].questionOptions[0].lines[0]` 没问过。不是找不到财务……主管说他统一报，我怕绕过他，这四千也不好再提。
- `$case.nightStructure.hangup` 我把那三张图找齐。明天直接问财务，再问问以前办过的人。
- `$case.sceneVersions[0].version` 小会上，我当着他面说，城市合伙人的招商会我能接。别人也在争，主管说谁先把场地礼品钱安排了，客户就归谁跟。我刚进这个组，总得办出一场给他看。会后他就私聊过来：“你先把场地和礼品费垫了，这场就交给你。”六万八我也不是随手拿得出，可上一场的人已经结了，我就想着撑这几天。现在卡账单来了，他却一直叫我等，我在群里打了又删，连句什么时候付都不敢问。
- `$case.sceneVersions[0].casualQuestions[0].answer` 会上就点了个头，没当场定人。散会才私聊我。
- `$case.sceneVersions[0].casualQuestions[1].answer` 有回我加班，他给我留了盏灯，贴了张“早点回”。平时还算照顾我，所以让我先垫，我也信他会给我办。
- `$case.sceneVersions[0].casualQuestions[2].answer` 知道，报价发给我了。我嫌贵，但还是想接。这么大的活动以前轮不到我。
- `$case.sceneVersions[1].version` 愿意啊，有人专门问下个月还有几场。主办能算业绩，主管也说不会让垫钱的人白忙。上回主办结完还请了我们吃饭，跟我说有机会就接，别光等公司打钱。
- `$case.sceneVersions[1].revisedVersion` 报下来的比先垫的多，我是知道的。就是没把那四千当成什么见不得人的钱。
- `$case.sceneVersions[1].casualQuestions[0].answer` 上回主办发给我的，还在聊天里。我把名字遮了发后台。
- `$case.sceneVersions[1].casualQuestions[1].answer` 不轮。谁接得起谁接。前阵子一个同事卡没还上，还问我能不能替他先刷。
- `$case.sceneVersions[1].casualQuestions[2].answer` 签到和客户跟进都记主办。能接活动的人，下个月分客户也占便宜。
- `$case.sceneVersions[2].version` 活动后，我把发票照片和刷卡记录都交给主管了，原件他让我先留着。他发来一张审批页，顶上写着“审批通过”。我问什么时候回来，他又发一次。第二天再问，还是它。就这一张图，他发了三次，每次都说“流程在走”。
- `$case.sceneVersions[2].casualQuestions[0].answer` 我还没想好。手头的钱不够一次还清，又不想做最低还款，所以才越来越慌。

### 夜 B

- `$case.sceneVersions[3].noClueReaction` 我今天才知道她们也在催。昨晚还觉得催快一点就轮到我了。
- `$case.sceneVersions[3].questionOptions[0].lines[0]` 我先说费用单是主管填的。财务让我把他说怎么分的钱也交过去。我还没交，怕他以后不让我碰活动。
- `$case.sceneVersions[4].testimonyWall.acts[0].decisivePresent.callerLine` 她们那栏是没写补件。可我这一单主管答应过先办，总不能还跟她们一起等吧？
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.openingLines[0]` 运营、维修都在等，我看见了。可主管说我替他办了这场，他肯定先顾我。别人没交齐手续也说不定，我不想因为她们催得急，就跟着把主管得罪了。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[0]` 她们那栏是没写补件。可我这一单主管答应过先办，总不能还跟她们一起等吧？
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[2]` 财务没说优先。是主管自己跟我保证的。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[1].lines[0]` 我催过，他说已经打过招呼。我没听到他们怎么说的。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[0]` 受理时间比我早，钱也没到。我只知道主管说先办我的。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[2]` 没有。财务只说等通知，我听到的优先都是主管说的。
- `$case.sceneVersions[4].testimonyWall.acts[1].openerLines[0]` 七月四号，财务发过一条供应商付款延后的通知。现在员工也等着。主管还让我们别停活动，说负责人先顶着，月底一起结。
- `$case.sceneVersions[4].testimonyWall.acts[1].openerLines[2]` 他说各部门包干，活动照办。八万的费用草单是交财务的，分配那几句是他另发给我的，我都转后台了。
- `$case.sceneVersions[4].testimonyWall.acts[1].openerLines[4]` 没有，是说给我四千、给他八千。各部门包干，忙完拿点钱有什么问题？
- `$case.sceneVersions[4].testimonyWall.acts[1].decisivePresent.callerLine` 他发我的时候明明写了！交上去为什么换成外部协调，我怎么知道？又不是我填的。
- `$case.sceneVersions[4].testimonyWall.acts[1].inquiry.openingLines[0]` 七月四号，财务发过一条供应商付款延后的通知。现在员工也等着。主管还让我们别停活动，说负责人先顶着，月底一起结。
- `$case.sceneVersions[4].testimonyWall.acts[1].inquiry.openingLines[2]` 他说各部门包干，活动照办。八万的费用草单是交财务的，分配那几句是他另发给我的，我都转后台了。
- `$case.sceneVersions[4].testimonyWall.acts[1].inquiry.openingLines[4]` 没有，是说给我四千、给他八千。各部门包干，忙完拿点钱有什么问题？
- `$case.sceneVersions[4].testimonyWall.acts[1].inquiry.openingLines[5]` 交给财务的草单已经把我四千、主管八千写明白了，她们都知道这是给我们俩的。
- `$case.sceneVersions[4].testimonyWall.acts[1].inquiry.options[0].lines[0]` 去掉名字了，我认不出来。我知道的是他跟我说过怎么分这一万二。
- `$case.sceneVersions[4].testimonyWall.acts[1].inquiry.options[1].lines[0]` 他发我的时候明明写了！交上去为什么换成外部协调，我怎么知道？又不是我填的。
- `$case.sceneVersions[4].testimonyWall.acts[1].inquiry.options[1].lines[2]` 四千我确实想拿。可六万八也是我真刷出去的。
- `$case.sceneVersions[4].testimonyWall.acts[1].inquiry.options[2].lines[0]` 先发给我的。他之后交上去那张，我也是这次问财务才看到。
- `$case.sceneVersions[4].beforeVersion.lines[0]` 她们两个人同意把受理页给你看，名字已经遮了。主管那张费用草单，我也发了。
- `$case.sceneVersions[4].sceneCloser.lines[1]` 不垫了。六万八还没回来，再让我刷卡，我真扛不住。我现在就在群里问付款日期，下周让公司先安排钱。
- `$case.sceneVersions[4].sceneCloser.lines[3]` 主管填的费用草单和发给我的分配消息，我一起交。草单里写外部协调，可他跟我说的是我四千、他八千，不能到最后全推给我。
- `$case.sceneVersions[4].sceneCloser.lines[5]` 发了。群里一个都没回，平时催我倒挺快。
- `$case.sceneVersions[3].version` 问到了。早上我拿日期和金额去查，六万八登记着，付款日期还是待通知。财务问我外部协调的一万二给谁，我一下没答上来。中午找运营部的姐姐问，她也没收到，维修那边也有。下午她们把各自的受理页发过来，连几千块的物料费都挂着。可主管私下还说会优先办我的，让我别跟着起哄。我是真想信他，不然下周又排了活动，我拿什么继续垫？
- `$case.sceneVersions[3].casualQuestions[0].answer` 我中午找她问怎么催，她把维修那位也拉进来了。三个人一报数，谁也没安慰成谁。
- `$case.sceneVersions[3].casualQuestions[1].answer` 她们同意了，姓名和账号都遮了，只留部门、金额和状态。
- `$case.sceneVersions[3].casualQuestions[2].answer` 运营那个姐姐办过好几场，之前都报了。这次她拿自己的旧到账记录跟新单号挨个对，越对越慌。
- `$case.sceneVersions[3].casualQuestions[3].answer` 对，之前我不知道。
- `$case.sceneVersions[4].testimonyWall.acts[0].statements[0].text` 立项和报销不是一回事，我知道了。可她们那几笔会不会也是手续没补完？
- `$case.sceneVersions[4].testimonyWall.acts[0].statements[0].pressResponse` 我想着各自补齐了，就能各自拿钱。
- `$case.sceneVersions[4].testimonyWall.acts[0].statements[1].text` 他发给我的还是那张旧立项页。财务今天给的受理页，我以前没见过。
- `$case.sceneVersions[4].testimonyWall.acts[0].statements[1].pressResponse` 我催了三回，他都没把新单号给我。
- `$case.sceneVersions[4].testimonyWall.acts[0].statements[2].text` 这回主办是我，下回还得他分。我也不想把他彻底得罪了。
- `$case.sceneVersions[4].testimonyWall.acts[0].statements[2].pressResponse` 他管活动，我还在他下面做事。
- `$case.sceneVersions[4].testimonyWall.acts[0].statements[3].text` 活动负责人写的是我，付款经办人写的是他。费用草单也是他交的。
- `$case.sceneVersions[4].testimonyWall.acts[0].statements[3].pressResponse` 我交了发票照片和刷卡记录，八万的草单是他填的。
- `$case.sceneVersions[4].testimonyWall.acts[0].statements[4].text` 我想先让主管把我这笔办掉，其他部门的事她们自己催。
- `$case.sceneVersions[4].testimonyWall.acts[0].statements[4].pressResponse` 三个人一起等，难道就能快一点？
- `$case.sceneVersions[4].testimonyWall.acts[1].statements[0].text` 交给财务的草单已经把我四千、主管八千写明白了，她们都知道这是给我们俩的。
- `$case.sceneVersions[4].testimonyWall.acts[1].statements[0].pressResponse` 他发给我的分配就是这么写的，交上去还能两样？
- `$case.sceneVersions[4].testimonyWall.acts[1].statements[1].text` 费用单写的是八万，但我实际刷了六万八，这两个数我知道。
- `$case.sceneVersions[4].testimonyWall.acts[1].statements[1].pressResponse` 我没多刷，后面一万二是另填的协调费。
- `$case.sceneVersions[4].testimonyWall.acts[1].statements[2].text` 供应商那三笔返费，我没收过。我只等他答应给我的四千。
- `$case.sceneVersions[4].testimonyWall.acts[1].statements[2].pressResponse` 上面怎么分我不管，我才第一次办。
- `$case.sceneVersions[4].testimonyWall.acts[1].statements[3].text` 现在四千我不要了，先把我卡上的六万八还回来行不行？
- `$case.sceneVersions[4].testimonyWall.acts[1].statements[3].pressResponse` 以前说报得多，我觉得划算。真压住卡了，谁还能睡着。
- `$case.overnightStructure.postures.againstCaller` 我承认想多拿四千。可六万八现在压在卡里，也是真的。
- `$case.overnightStructure.postures.withCaller` 今天拿到新的受理页了，你看完再问我。
- `$case.nightStructure.returnStance.lines.defensive` 我承认想多拿四千。可六万八现在压在卡里，也是真的。
- `$case.nightStructure.returnStance.lines.open` 今天拿到新的受理页了，你看完再问我。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了，今天直接问了财务。

### 其他出声面

- `$case.careChoices[0].lines[0]` 行。别又拿张旧图打发我。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 工作群刚弹出一条，是他说的。我正要念。
- `$case.overnightStructure.liveCounterBeats[0].choices[0].lines[0]` 他发的是：“各部门别单独催，费用月底一起办。下周活动照排，先垫的还是主办。”
- `$case.overnightStructure.liveCounterBeats[0].choices[1].lines[0]` 发了。撤回有什么用，我每天盯着这个群，就等他说什么时候还钱。
- `$case.overnightStructure.liveCounterBeats[1].lines[0]` 主管又发语音了。
- `$case.overnightStructure.liveCounterBeats[1].lines[3]` 这句是他说的。我就怕这个。

## 职场案主管

- **固定性格：** 圆滑的责任切割者
- **受压反应：** 被问到账和署名时，会反复强调活动是对方主动争取的，再把付款推给财务。
- **防御动作：** 只回答眼前被问到的那一步，随后把选择说成咨询者自愿，把延迟推给财务。
- **知识边界：** 知道自己经手的活动、费用与分配，不掌握宸直集团押金杠杆账。

### 后台／材料回流

- `$case.respondentNote.text` 八万本来就是我们部门包干的，别的部门也这么办。他没垫之前，我就跟他说过给他四千。现在钱下不来，都成我一个人的事了？运营维修也没付，你们也看到了吧。

### 其他出声面

- `$case.overnightStructure.liveCounterBeats[1].lines[2]` 你跟财务说六万八就行，八万草单别往大群发。以后还要不要活动了？
- `$case.overnightStructure.liveCounterBeats[1].lines[2].text` 你跟财务说六万八就行，八万草单别往大群发。以后还要不要活动了？

## 做企业财务的朋友

- **固定性格：** 冷静的程序理性派
- **受压反应：** 被追问小陈的报销结果时，会说明自己没有栖行的受理记录。
- **防御动作：** 只解释自己看到的单据，不替主管答应付款。
- **知识边界：** 不在栖行任职，只看过主播转交的材料。可以解释通用财务流程，不能查看栖行的受理记录，也不知道供应商返费归属。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 老林，咖啡给我留了吧？你昨晚问受理号是对的。他今天去查，就带刷卡日期和金额，别重新报一遍。
- `$case.overnightStructure.dayScenes[0].body.beats[2]` 查融资时自己披露的经营数。看使用费和维护成本，别拿押金当收入。

## 职场案供应商项目员

- **固定性格：** 谨慎的中立执行者
- **受压反应：** 问题越敏感越退回对公记录。
- **防御动作：** 只确认本方收款与联系人。
- **知识边界：** 只知道供应商一侧的项目联系人、内部结算页和工作语音；不知道返利是否支付或最终账户，也看不到客户公司的报销。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 以前不是只找一个联系人。招商主管要点位协调费，区域经理要渠道维护费，采购经办又算采购配合费。
- `$case.overnightStructure.dayScenes[1].body.beats[2]` 算。不加进去，我们给谁垫？
- `$case.overnightStructure.dayScenes[1].body.beats[5]` 当时怎么叫我们报的，工作群里还留着一条语音。我和这张三栏表一起存着。
- `$case.overnightStructure.dayScenes[1].body.beats[7]` 行。语音里那句“每一层的返费结完，下一批点位才往下走”，也是我们当时催结算说的。回执整理好就补。

## 职场案仓库管理员

- **固定性格：** 朴实的记录主义者
- **受压反应：** 只让人翻页、对日期，不接关系判断。
- **防御动作：** 认单、认页、不认口头身份。
- **知识边界：** 只知道仓库收货、出入库单与日期。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[3]` 我经手发货，不经手打款。哪一笔付了、最后进谁账户，我没经手。回执得找项目组。

## 职场案部门助理

- **固定性格：** 规则型自保者
- **受压反应：** 逐字复述模板，不评价任何私聊。
- **防御动作：** 只给群模板与样本，拒绝解释人的意思。
- **知识边界：** 只知道公开群流程与样本，不知道私聊和钱的去向。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[1]` 分活动就看谁能先垫。费用让各部门主管并起来报，我发通知。
- `$case.overnightStructure.dayScenes[2].body.beats[3]` 是这一场的部门包干预算。主办实际花了多少，还得附单。
- `$case.overnightStructure.dayScenes[2].body.beats[5]` 费用单由主管填，你问他。我不替他解释。
- `$case.overnightStructure.dayScenes[2].body.beats[7]` 我发的通知可以给你。费用草单你找他要。

## 职场案领导

- **固定性格：** 冷硬的结果主义者
- **受压反应：** 出现流程事故时，只催项目交付和活动总结。
- **防御动作：** 把旧规矩当执行细节，只认结果和汇报。
- **知识边界：** 知道活动总结与负责人署名，不知道垫款金额、公司付款账户和供应商返利归属。

### 收麦幕间

- `$case.nightStructure.interlude.actions[1].text` 二十二号，下周一照常排下一轮活动。各部门按包干额度先顶，旧费用月底一起处理。

# 彩礼与流水

## 林旭阳

- **固定性格：** 见得多、反应快，能接住情绪，也敢抓着绕答继续问
- **受压反应：** 听见用途偷换、关键人被省掉或对方答非所问，就收笑、打断，直接追他在躲哪一件事；不等材料全部到齐才施压。
- **防御动作：** 旧误判使他更会核对原话，不使他放弃判断。先从具体异常提出最可能的解释，再看对方怎样否认、补充或转题。
- **知识边界：** 现场信息来自已听见或已获得的内容；经验让他能从遗漏、利益与辩解推断隐藏路线并主动试探，无需先获确凿证据。尚未出现的具体身份、金额与材料不能被他说成已知事实。

### 夜 A

- `$case.openingDialogue[1]` 好，你说。
- `$case.openingDialogue[3]` 你之前不知道？
- `$case.openingDialogue[5]` 男方怎么回？
- `$case.openingDialogue[7]` 你信了？
- `$case.openingDialogue[9]` 上面余额多少？
- `$case.sceneVersions[0].questionOptions[1].lines[1]` 到今天也没回？
- `$case.sceneVersions[1].questionOptions[0].lines[1]` 为什么？
- `$case.sceneVersions[1].questionOptions[0].lines[3]` 他又说学费是自己出的，你当时想到什么？
- `$case.nightStructure.hangup.hostLine` 好。你先回群里看看。学费那句往后，每个人到底说了什么，明天回来我们再问。
- `$case.sceneVersions[0].entryQuestion` 他把工资账户流水发来以后，你们怎么聊的？
- `$case.sceneVersions[0].casualQuestions[0].question` 你们相亲见了几次？
- `$case.sceneVersions[0].casualQuestions[1].question` 你跟你妈平时什么都聊吗？
- `$case.sceneVersions[0].casualQuestions[2].question` 你妈妈看到那张工资卡的余额以后，问过这是不是他的全部账户吗？
- `$case.sceneVersions[0].casualQuestions[3].question` 你问其他账户，他怎么回的？
- `$case.sceneVersions[0].questionOptions[0].question` 他已经说拿不出二十八万八，你为什么还是不信，非要他把流水打出来？
- `$case.sceneVersions[0].questionOptions[1].question` 你觉得他留着钱，那其他账户，你后来追着问过吗？
- `$case.sceneVersions[1].entryQuestion` 第一次正式吃饭时，本科学历说清楚了吗？
- `$case.sceneVersions[1].casualQuestions[0].question` 他说完那几句话，你当时先记住了哪一句？
- `$case.sceneVersions[1].casualQuestions[1].question` 开口问本科以前，你已经觉得那张学校图有问题了吗？
- `$case.sceneVersions[1].casualQuestions[2].question` 那顿饭谁结的账？
- `$case.sceneVersions[1].casualQuestions[3].question` 服务员走了以后，你们又聊本科了吗？
- `$case.sceneVersions[1].casualQuestions[4].question` 他问审计加班的时候，你怎么说的？
- `$case.sceneVersions[1].questionOptions[0].question` 他已经承认本科不是那所。你当时为什么没接着问，前面那句“名校毕业”到底怎么来的？
- `$case.sceneVersions[2].entryQuestion` 你回家以后是怎么跟家里说的？
- `$case.sceneVersions[2].casualQuestions[0].question` 介绍人跟男方家什么关系？
- `$case.sceneVersions[2].casualQuestions[1].question` “家里省心”这话你怎么理解？
- `$case.sceneVersions[2].casualQuestions[2].question` 你把本科说清以后，你妈妈当时怎么回的？
- `$case.sceneVersions[2].casualQuestions[3].question` 介绍人说收入稳，你当时有没有问一个月多少？
- `$case.sceneVersions[2].questionOptions[0].question` 你妈说家里帮不上，彩礼就多拿一点。你也这么想？

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[1]` 男方家这么讲，你就直接转给她家了？工资、流水，你一样都没见过？
- `$case.overnightStructure.dayScenes[0].body.beats[3]` 你还替女方说过什么？
- `$case.overnightStructure.dayScenes[0].body.beats[5]` 你知道女方家准备给她多少吗？
- `$case.overnightStructure.dayScenes[0].body.beats[7]` 两边聊天和彩礼传话我都留着。“收入挺稳”“不计较学历”，你都没问过本人；二十八万八你倒是一字不落地传过去了。
- `$case.overnightStructure.dayScenes[1].body.beats[1]` 我只问他发给女方的那份流水。为什么最后只发工资账户？

### 夜 B

- `$case.sceneVersions[5].testimonyWall.acts[0].decisivePresent.hostLine` 那就问他接不接受这些条件。
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.options[1].lines[1]` 那就问他接不接受这些条件。
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.options[2].lines[1]` 那他说的是不接受条件，不能拿一张卡的余额替他回答。接进来，让他自己说能接受什么。
- `$case.sceneVersions[5].beforeVersion.lines[4]` 你怎么回的？
- `$case.sceneVersions[5].beforeVersion.lines[7]` 你家的二十万可以等九月底，为什么他必须领证前转给你？
- `$case.sceneVersions[6].afterVersion.lines[4]` 你表姐说提醒过你，要说明只给的是工资账户。为什么发的时候不说清，还一直不答她？
- `$case.sceneVersions[6].questionOptions[0].lines[2]` 你的六万婚后出，婚宴又算他家出。这个安排，你跟他商量过吗？
- `$case.overnightStructure.linearCallback.lines[0]` 介绍人和男方表姐我都问过了。你家那几句，还是你自己来说。
- `$case.sceneVersions[6].entryQuestion` 他提共同账户，你先说说自己的钱准备怎么放？
- `$case.sceneVersions[6].casualQuestions[0].question` 你身边有婚后一起管钱的例子吗？
- `$case.sceneVersions[6].questionOptions[0].question` 你的六万留到领证后，彩礼要先进你卡里。那婚宴和首饰的钱，你本来打算谁出？

### 终局

- `$case.stageJudgement` 二十八万八一分不改，还得让他对外说是自己忙。人家不同意，你连不去了都要替他编一句？

### 其他出声面

- `$case.careChoices[0].hostLine` 那今天就到这儿吧。
- `$case.overnightStructure.liveCounterBeats[0].lines[5]` 表妹发的整页我删了，只留你同意公开的那几句。你要先打电话，我们就等一会儿。
- `$case.overnightStructure.liveCounterBeats[1].lines[3]` 礼物我退回去。你要上麦，就把愿意公开谈的范围说清楚。
- `$case.overnightStructure.liveCounterBeats[1].lines[6]` 你同意按这个范围当面谈吗？
- `$case.overnightStructure.liveCounterBeats[2].lines[4]` 那你能接受怎么出？当着她说。
- `$case.overnightStructure.liveCounterBeats[2].lines[6]` 行，两边的钱都谈，你先听她说。
- `$case.overnightStructure.liveCounterBeats[3].lines[7]` 条件不改，却要他编个忙的理由替你应付家里，这不叫再商量。你自己的要求，自己跟父母说清楚。
- `$case.sceneVersions[3].entryQuestion` 你妈妈把二十八万八递过去时，介绍人有没有问过你家准备出多少？
- `$case.sceneVersions[3].casualQuestions[0].question` 男方家的那张聊天，你以前见过吗？
- `$case.sceneVersions[3].casualQuestions[1].question` 你当时觉得介绍人偏谁？
- `$case.sceneVersions[3].questionOptions[0].question` 两边都挑好听的说，她急着把这事撮合成，是想落个人情，还是还有别的好处？
- `$case.sceneVersions[3].questionOptions[1].question` 二十八万八是介绍人加的，还是你妈妈的原话？
- `$case.sceneVersions[3].questionOptions[2].question` 介绍人只说“学校不错”。你回家时，把这句话说成了什么？
- `$case.sceneVersions[4].entryQuestion` 那顿饭以后，你又问过本科吗？
- `$case.sceneVersions[4].casualQuestions[0].question` 他解释 MBA 的时候，语气什么样？
- `$case.sceneVersions[4].casualQuestions[1].question` 你自己学历怎么样？
- `$case.sceneVersions[4].casualQuestions[2].question` 学校和缴费记录，你给家里看过吗？
- `$case.sceneVersions[4].questionOptions[0].question` 只看那张学校图，能看出他本科在哪儿读吗？
- `$case.sceneVersions[4].questionOptions[1].question` 后来问清的本科和学费，你怎么告诉家里的？

## 案三咨询者·林

- **固定性格：** 数字化自保的理性派
- **受压反应：** 更爱报精确数字、减少语气词；问到自己的八万四和父母那笔理财时句子骤短。
- **防御动作：** 先说彩礼是母亲定的，把家境调查说成父母替她操心；只转达金额，不说付款时点、收款账户和额外支出，也不主动计算男方已经承担的饭钱、展票、接送和倾听。
- **知识边界：** 知道 MBA 学费由男方本人承担、父母托人查到的普通家境、自己收到的材料、家庭群、完整彩礼条件和父母二十万元的预定用途；不知道对方连续收入、其他账户余额，也不知道宸直能否按约兑付。

### 夜 A

- `$case.openingDialogue[0]` 主播你好，我想请你帮我听听一件事。
- `$case.openingDialogue[2]` 我这周末本来要带相亲对象见父母。前几天他问我，二十八万八是谁定的，我才知道我妈已经先托介绍人去问了彩礼。
- `$case.openingDialogue[4]` 不知道。饭店还没订，她已经把数报出去了。上周我才告诉她，男方本科不是她以为的那所名校。
- `$case.openingDialogue[6]` 他说二十八万八拿不出来，也不能把手里的钱全拿去做彩礼。
- `$case.openingDialogue[8]` 没信。我让他打流水，他只发来一份工资账户流水。
- `$case.openingDialogue[10]` 二十八万六。
- `$case.sceneVersions[0].noClueReaction` 我妈怎么想，你得问她。她没跟我解释。
- `$case.sceneVersions[0].questionOptions[0].lines[0]` 我当时觉得，他是在跟我压价。二十三万八的学费都自己交了，彩礼差两千就拿不出？
- `$case.sceneVersions[0].questionOptions[1].lines[0]` 问过，他没回。我才觉得奇怪，给得出这张，就给不出别的？
- `$case.sceneVersions[0].questionOptions[1].lines[2]` 没有。你看，问我的时候谁都挺来劲，他不答就过去了。
- `$case.sceneVersions[1].noClueReaction` 那顿饭已经够尴尬了。你还想问什么？
- `$case.sceneVersions[1].questionOptions[0].lines[0]` 那个……当时桌上还有介绍人，我没接着问。
- `$case.sceneVersions[1].questionOptions[0].lines[2]` 介绍人那张学校图摆在那儿，谁看了不以为是本科？我总不能在饭桌上跟他查户口吧。
- `$case.sceneVersions[1].questionOptions[0].lines[4]` 自己拿二十三万八读书，还能没积蓄？我又没让他借钱读。
- `$case.sceneVersions[2].noClueReaction` 介绍人的话我就听到这些。再让我念，也还是这几句。
- `$case.nightStructure.hangup` 家里群一直在 @ 我。最上面那几句……我得自己再看一遍。今晚先到这儿吧，明天我回来。
- `$case.sceneVersions[0].version` 他已经说拿不出，我还是让他打了流水。发来以后，我先问：“只有这一张？”过了十几分钟，他才回：“你不是要看收入吗？工资卡最清楚。”我又问其他账户，他没接；到昨晚，我手里就这一张。我把这张转给我妈，她看过。
- `$case.sceneVersions[0].casualQuestions[0].answer` 四次。两次饭，一次展，一次他接我下班。节奏不快不慢。
- `$case.sceneVersions[0].casualQuestions[1].answer` 大事聊。她比我急。我 28，虚岁 29，她逢人就说我不挑，其实是她挑。上个月她把我照片发给三个介绍人，像素还调高了。我说妈，你这是发简历呢。她说简历怎么了，你爸当年也是我筛出来的。……她真这么说。我当时半天没接上。
- `$case.sceneVersions[0].casualQuestions[2].answer` 没有。她只盯着二十八万六，说跟她要的就差两千。
- `$case.sceneVersions[0].casualQuestions[3].answer` 他没回，后来也没再给我发别的。
- `$case.sceneVersions[1].version` 第一次正式吃饭，介绍人订了窗边。他先问我审计是不是总加班，我问他平时出差多不多。吃到一半，我还是问了：“你发的材料是那所学校，本科也是在那儿读的吗？”他筷子停了一下，才说：“本科不是。我工作以后去读的 MBA，学费二十三万八，是我自己出的。”正好服务员来添水，我没有接着问，之前那句“名校毕业”到底是谁说出来的。
- `$case.sceneVersions[1].casualQuestions[0].answer` 学费。二十三万八。我脑子里先过的是这个数，本科那句反而没追下去。
- `$case.sceneVersions[1].casualQuestions[1].answer` 还没有。我只是想把介绍人那句“学校好”问得具体一点。结果他一停，我才觉得这事可能没说全。
- `$case.sceneVersions[1].casualQuestions[2].answer` 他付的，用了团购券和积分。停车费一百多，他问我要不要 AA。单看都没问题。后来再想他的收入，我总会想起那张券。
- `$case.sceneVersions[1].casualQuestions[3].answer` 没有。他说菜快凉了，我也就跟着聊别的。那顿饭是我催着约的，我也怕当场问僵。
- `$case.sceneVersions[1].casualQuestions[4].answer` 我说忙季是要加班，平常还好。
- `$case.sceneVersions[2].version` 其实“名校毕业”最早也不是他说的。介绍人跟我家说的是：“学校好、收入稳，家里也省心。”我回去以后，把“学校好”说成了“名校毕业”。我是说得顺了一点，也没想到家里会按本科去听。 我爸妈后来托人查了他家。我妈说：“他父母都是普通上班的，老家那套房自己要住，婚房也帮不上，以后真有事还得你们自己扛，彩礼就多问一点，至少钱先在你手里。”
- `$case.sceneVersions[2].casualQuestions[0].answer` 他妈的老同事。所以话肯定挑好的说，这我懂。
- `$case.sceneVersions[2].casualQuestions[1].answer` 就是独生子，爸妈有退休金，平时不用他贴钱。我妈一听这四个字，后面都没细问。
- `$case.sceneVersions[2].casualQuestions[2].answer` 她先怪我没问清，又托人问他家里的情况。知道婚房帮不上以后，就说彩礼得多留一点。
- `$case.sceneVersions[2].casualQuestions[3].answer` 没有。她说工作稳，我就没再问具体数字。
- `$case.sceneVersions[2].questionOptions[0].answer` 我当时也觉得他该多拿一点。这个数是我妈提的……但我只说别把人吓跑，没让她撤回二十八万八。

### 夜 B

- `$case.sceneVersions[5].testimonyWall.acts[0].decisivePresent.callerLine` 两千倒不至于掏不出来吧。行，你说卡上看不出，我就问他本人，他到底肯不肯。
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.openingLines[0]` 我家不是不出钱，我爸答应那二十万肯定给我。可他跟我还没领证，我得先看他肯不肯拿出来。我要先放自己卡里，也是怕婚后说不清。他一听就说拿不出，连怎么安排都不跟我谈。我家规矩就是先看他愿不愿意拿出来。他工资卡有二十八万六，只差两千，不是拿不出，就是不肯。
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.options[0].lines[0]` 能商量。可他领证前给我的钱，是另一件事。
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.options[1].lines[0]` 两千倒不至于掏不出来吧。行，你说卡上看不出，我就问他本人，他到底肯不肯。
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.options[2].lines[0]` 他只说这套条件接不了。我要的还是二十八万八。
- `$case.sceneVersions[5].beforeVersion.lines[0]` 家里那几句我自己截好了，发给你们了，可以念。别把整页都放出去。
- `$case.sceneVersions[5].beforeVersion.lines[1]` 今天下午，介绍人又来问我。
- `$case.sceneVersions[5].beforeVersion.lines[3]` 男方家想知道，我家除了要二十八万八，准备给我多少。
- `$case.sceneVersions[5].beforeVersion.lines[5]` 我说我家也出二十万，她又问什么时候到。我爸都答应了，还得一天追着问啊？
- `$case.sceneVersions[5].beforeVersion.lines[8]` 那是我爸啊。他是还没领证的相亲对象，能一样吗？二十八万八，我妈说了，我也同意。工资卡都二十八万六了，就差两千，他一直跟我磨。
- `$case.sceneVersions[6].noClueReaction` 他怎么花钱，我有我的感受。你别一句话替我算完。
- `$case.sceneVersions[6].afterVersion.lines[1]` 婚宴和首饰本来就另算。这个……我以为大家都知道，不用特意说。
- `$case.sceneVersions[6].afterVersion.lines[3]` 是，我没说全。可你只给工资卡，我也问过别的账户啊。
- `$case.sceneVersions[6].questionOptions[0].lines[0]` 他家。我觉得他还有别的钱，可我没问过他家肯出多少。
- `$case.sceneVersions[6].questionOptions[0].lines[3]` 我以为都这么办的。现在一项项拿出来说，好像全是我占他便宜。
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[0].text` 我家规矩就是先看他愿不愿意拿出来。他工资卡有二十八万六，只差两千，不是拿不出，就是不肯。
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[0].pressResponse` ‘就差两千。你让我怎么不往态度上想？’
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[1].text` 我问别的账户他不答，你们怎么不催他？
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[1].pressResponse` ‘别的账户我不知道。可这张卡上的二十八万六总是真的。’
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[2].text` 我妈要他领证前把二十八万八打进我卡，婚宴首饰另算，这就是她开出的条件。
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[2].pressResponse` ‘领证前进我卡，婚宴首饰另算。是我家开的条件，我没说他答应了。’
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[3].text` 我爸都答应二十万了，就等到九月底，有那么难等吗？
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[3].pressResponse` ‘九月底以后，给我留着。现在确实还没到。’
- `$case.sceneVersions[6].version` 我有八万四，最多拿六万，领证以后添家电、搬家，剩下的我得留着。我爸那二十万也是给我的，不能一到账就算我们共同的。二十八万八，我还是想进自己的卡。平时饭钱、展票大多是他出，我加班晚他也来接过。可他一用团购、积分，停车费跟我 AA，我还是会觉得他在跟我算。
- `$case.sceneVersions[6].casualQuestions[0].answer` 我表姐。管得挺好，但她挣得比姐夫多。多百分之三十几吧，具体没算过——不对，我算过。百分之三十七。你看，我就是这样的人。这话我没跟我妈说过。我们家饭桌上，账是不能上桌的。
- `$case.overnightStructure.postures.againstCaller` 二十八万八是我妈定的，我知道以后没叫停。今晚我自己答。
- `$case.overnightStructure.postures.withCaller` 家里群我没删。彩礼和宸直那几句，你看到哪儿，就问到哪儿吧。
- `$case.nightStructure.returnStance.lines.defensive` 我差点没打回来。弹幕说我家问得太多，这话我听见了。群聊我带来了，你接着问吧。
- `$case.nightStructure.returnStance.lines.open` 我回来了。昨晚挂完电话，我又看了学校图，也去找了介绍人。今天都带来了。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。昨晚群里吵到很晚，我把那几张图又看了一遍。

### 其他出声面

- `$case.sceneVersions[3].noClueReaction` 谁先开的口，我得看聊天。别让我凭记忆说。
- `$case.sceneVersions[3].questionOptions[1].missReaction` 聊天在后台，你们自己看。我现在分不清她们谁先说的。
- `$case.sceneVersions[4].noClueReaction` 群里一长串，我现在不想从头念。让我先把学费这句说完。
- `$case.sceneVersions[4].sceneCloser.lines[0]` 我把学费那句发进群以后，我妈回了句：“这事你别插嘴，我问介绍人。”她没说要问什么。
- `$case.sceneVersions[4].questionOptions[1].missReaction` 群里一长串，我现在不想从头念。让我先把学费这句说完。
- `$case.careChoices[0].lines[0]` 我自己跟我妈说。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 等一下。我自己只给了那几句，后台怎么还有整页群聊……是我表妹发给你们的？
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 她把我家的群发给一个直播间？
- `$case.overnightStructure.liveCounterBeats[0].lines[4]` 你们等我一下，我要先给她打个电话。
- `$case.overnightStructure.liveCounterBeats[0].lines[6]` 她多半跟我妈在一起。打过去又是我妈接，说都是为我好。烦死了。
- `$case.overnightStructure.liveCounterBeats[0].lines[8]` 先说完吧。播完我自己找她。
- `$case.overnightStructure.liveCounterBeats[1].lines[7]` 接进来。我的工资存款我自己说，家里群只说那几句。
- `$case.overnightStructure.liveCounterBeats[2].lines[2]` 二十八万八要在领证前进我卡，婚宴和首饰另算。我们家就是这么谈的，我也同意。见面还可以聊，你现在就说不去了？
- `$case.overnightStructure.liveCounterBeats[3].lines[1]` 饭可以先不吃。可你跟介绍人别说是因为彩礼，就说你最近忙，往后放一放。
- `$case.overnightStructure.liveCounterBeats[3].lines[3]` 你这么一说，我妈肯定觉得是我没跟你谈好。你先把这次见面往后推，我再跟她说。
- `$case.overnightStructure.liveCounterBeats[3].lines[5]` 我没说改。我只是让你别把话说得那么难听。
- `$case.sceneVersions[3].version` 没有问。她把我妈那条语音原样转给了男方家。后来她把两边聊天都发给我，我才知道，她在男方家那边也替我说过“工作稳定、家里事少、不太计较学历”。可她给我家的原话，只有“学校不错”。
- `$case.sceneVersions[3].casualQuestions[0].answer` 没有。介绍人这次一起发出来，我才第一次看见。“家里事少”那句挺刺的，我家什么情况，她根本没认真问过。
- `$case.sceneVersions[3].casualQuestions[1].answer` 当时觉得她偏男方。看完另一段，我又觉得她就是太想把这顿饭约成，哪边难听就替哪边改一句。
- `$case.sceneVersions[3].questionOptions[0].answer` 男方家以前帮过她，她一直想还这个人情。她说彩礼只是先问问，自己不好替我妈把数字压回去。我听着却觉得，她既然愿意替两家介绍，就不该只负责传最刺激人的那一句。
- `$case.sceneVersions[3].questionOptions[0].guardedAnswer` 她说男方家以前帮过她，想把这个人情还上。别的她没细讲。
- `$case.sceneVersions[3].questionOptions[1].answer` 我妈的原话。她说他能自己拿二十三万八读书，家里不会差；别按我表姐十八万八那份谈，先问二十八万八。介绍人原样转过去了。
- `$case.sceneVersions[3].questionOptions[2].answer` 我跟我妈说：“名校毕业，条件不错。”这两句都是我自己添的。我妈一听，马上开始催我带人回家。
- `$case.sceneVersions[4].version` 后来我在微信上又问了一次。他说本科不是那所，读的是那所学校的 MBA，学费二十三万八，是工作以后分三次交清的。学校查询页和缴费回单我都看了，项目是真的，钱也是从他账户出去的。我把这些发进家里群，本来是想把“名校毕业”纠正过来，没想到我妈盯住的是二十三万八。
- `$case.sceneVersions[4].casualQuestions[0].answer` 校名和项目名，他一口气就说完了。问到本科，他才停了一下。
- `$case.sceneVersions[4].casualQuestions[1].answer` 普通一本。我妈听见他名校毕业以后，逢人就说我眼光好。我没纠正，可能也舍不得她把这句收回去。
- `$case.sceneVersions[4].casualQuestions[2].answer` 给我妈看过。
- `$case.sceneVersions[4].questionOptions[0].answer` 看不出来。图上只有校名和 MBA 项目，本科、项目性质、读了多久都没有。那些是我后来一项一项问出来的。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 看不出来。图上只有校名和 MBA 项目。
- `$case.sceneVersions[4].questionOptions[1].answer` 我原样发了。本科不是那所，MBA 二十三万八是他自己交的。我妈先说我没问清，过一会儿又说，能自己花这么多读书，家里总不会差。她后来去找介绍人，我那时候还不知道。

## 案三相亲对象

- **固定性格：** 受冒犯的条件维护者
- **受压反应：** 被质疑时按项目、学费和工资账户逐项举证；被追问其他账户时明确拒绝公开。
- **防御动作：** 用每个局部真实抵挡整体概括的问题。
- **知识边界：** 知道自己的项目、缴费、账户和家人整理材料过程；第二夜才从群聊得知女方父母的三十万元在宸直，不知道最终能否兑付。

### 夜 B

- `$case.sceneVersions[6].afterVersion.lines[0]` 你的六万领证后再出，我的二十八万八领证前就要交，还不能放共同账户。那婚宴怎么办？
- `$case.sceneVersions[6].afterVersion.lines[2]` 介绍人只报了二十八万八，我说拿不出，你就要流水。这些条件你今天才一起说。
- `$case.sceneVersions[6].afterVersion.lines[5]` 我妈让我挑工资卡，我也想少交代一点。只发这一张，确实没说清楚。其他账户我不公开，但刚才那些付款条件，我也不接受。
- `$case.sceneVersions[6].questionOptions[0].lines[1]` 有别的钱也不等于都给这场婚礼。你说婚宴另算，算在谁头上，我还没答应。

### 后台／材料回流

- `$case.respondentNote.text` 学校页、MBA 缴费和工资卡是我发的，你们可以问。别的账户我没给她，那些账户的情况也不想在直播里说。当时她要看收入，我就挑了工资卡，其他账户她问了，我没有回。饭、展票、接她下班，是我愿意做，不是因为我家境普通就欠她。卡上有二十八万六，也不代表我要拿二十八万八，更不代表后面婚宴首饰都我出。

### 其他出声面

- `$case.overnightStructure.liveCounterBeats[1].lines[1]` 我是她说的那个人。介绍人把直播片段转给我了，我才进来的。礼物你先收着。
- `$case.overnightStructure.liveCounterBeats[1].lines[2]` 我只问一句：你家要我领证前把二十八万八打进你的卡，你爸答应你的二十万却要等到九月底，宸直那三十万到期，拿到以后还说是留给你自己的。这些话，你有没有一起告诉我？
- `$case.overnightStructure.liveCounterBeats[1].lines[5]` 学校、学费、工资卡和彩礼可以说，其他账户不公开。她家就谈已经同意公开的那几句。
- `$case.overnightStructure.liveCounterBeats[2].lines[1]` 你们查完我家，转头就把彩礼加到二十八万八。我都说拿不出，你还觉得我在压价，非要查收入。你们到底是在谈结婚，还是看我还能拿多少？
- `$case.overnightStructure.liveCounterBeats[2].lines[3]` 我说拿不出，不是差那两千，是我不接受领证前全打进她个人卡里。你们别再拿那张工资卡——
- `$case.overnightStructure.liveCounterBeats[2].lines[5]` 行。二十八万八真要谈，就放共同账户。她家九月底那笔怎么放、婚宴和首饰谁出，也一起写清。只让我先打进她卡里，我不接受。
- `$case.overnightStructure.liveCounterBeats[3].lines[0]` 周末的饭先取消吧。我回去跟我爸妈说，你也跟你家里说。我不想带着二十八万八去见你父母。
- `$case.overnightStructure.liveCounterBeats[3].lines[2]` 我不忙。我不接受刚才那几条，为什么不能照实说？
- `$case.overnightStructure.liveCounterBeats[3].lines[4]` 那二十八万八进你卡这条，你准备改吗？
- `$case.overnightStructure.liveCounterBeats[3].lines[6]` 条件没变，换我去说忙。以后不还是得谈这几条？

## 案三介绍人

- **固定性格：** 嘴快、怕砸媒人的热心撮合者
- **受压反应：** 越被两家围攻，越急着翻聊天记录；被问到依据时，先辩一句，再认自己没核实的具体话。
- **防御动作：** 先划掉不是自己说的那一句，再把没核实的话解释成“想让他们先见一面”。
- **知识边界：** 知道女方母亲提出二十八万八、领证前进女方卡和婚宴首饰另算；向男方先只问了金额。她当时不知道女方父亲二十万的来源与用途，完整条件也未一起转达。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 你先看聊天。她妈妈现在一口一个我骗她，可“名校毕业”真不是我说的。我当时只说他学校不错。至于“收入挺稳”，是男方家先这么跟我讲的。
- `$case.overnightStructure.dayScenes[0].body.beats[2]` 工资条是没看，老同事介绍自己儿子，我还能先让她拿证明？我给女方说的也都是好话。
- `$case.overnightStructure.dayScenes[0].body.beats[4]` 我说她做审计，工作稳定，家里事少。男方家问她会不会嫌学历，我还说了句“她不太计较这个”。后来她妈妈听说 MBA 二十三万八是他自己交的，又让我去问二十八万八。我一个字没改，全转了。
- `$case.overnightStructure.dayScenes[0].body.beats[6]` 不知道。她妈妈只说家里不会亏待女儿。今天她又给我打电话，解释到最后才说，那笔钱还没到期。早知道是这样，我至少会先问一句：现在拿得出来吗？
- `$case.overnightStructure.dayScenes[0].body.beats[8]` 我想着先把人约到桌上嘛。现在倒好，人还没坐下，钱先把两家掀了。

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

- `$case.advisorNotes[0].text` 老林，忙完回我电话，你那边相亲登记我还等着呢。刚才这通听得我茶都凉了。介绍人两头都能说，怎么真让这俩人坐下，一句也接不上？

# 那张名单

## 林旭阳

- **固定性格：** 见得多、反应快，能接住情绪，也敢抓着绕答继续问
- **受压反应：** 听见用途偷换、关键人被省掉或对方答非所问，就收笑、打断，直接追他在躲哪一件事；不等材料全部到齐才施压。
- **防御动作：** 旧误判使他更会核对原话，不使他放弃判断。先从具体异常提出最可能的解释，再看对方怎样否认、补充或转题。
- **知识边界：** 现场信息来自已听见或已获得的内容；经验让他能从遗漏、利益与辩解推断隐藏路线并主动试探，无需先获确凿证据。尚未出现的具体身份、金额与材料不能被他说成已知事实。

### 夜 A

- `$case.openingDialogue[1]` 你在的，请讲。
- `$case.openingDialogue[3]` 他是谁？
- `$case.openingDialogue[5]` 你们是什么关系？
- `$case.openingDialogue[7]` 名单上写了什么？
- `$case.openingDialogue[9]` 钱是什么钱，怎么给他的？
- `$case.openingDialogue[11]` 行，钱这件事还没答。先说名单，它怎么到你手里的？
- `$case.openingDialogue[13]` 把名单发过来，名字遮掉。
- `$case.sceneVersions[0].questionOptions[0].lines[1]` 原图右边还有内容吗？你发过来的是整张？
- `$case.sceneVersions[1].questionOptions[0].lines[1]` 所以他一直没正面答应。那你先把整张表发来，不能只靠称呼判断其他人跟他的关系。
- `$case.sceneVersions[2].questionOptions[0].lines[1]` 你要把钱追回来，那半张总得拿出来吧。
- `$case.sceneVersions[3].questionOptions[0].lines[1]` 就这一句？
- `$case.nightStructure.hangup.hostLine` 我听见敲门了。你先确认安全，方便的时候给后台留句话。
- `$case.sceneVersions[0].entryQuestion` 你怎么确定名单上的名字都是他在谈的人？
- `$case.sceneVersions[0].casualQuestions[0].question` 备忘录你存下来了吗？
- `$case.sceneVersions[0].casualQuestions[1].question` 上面大概几个人？
- `$case.sceneVersions[0].casualQuestions[2].question` 他回来以后发现你看了吗？
- `$case.sceneVersions[0].casualQuestions[3].question` 亲密度这一栏，Tony 跟你解释过吗？
- `$case.sceneVersions[0].casualQuestions[4].question` 你看到自己那一行时，右边那些钱数也在吗？
- `$case.sceneVersions[0].questionOptions[0].question` 你发来的图，每一行怎么都在右边同一个地方断了？
- `$case.sceneVersions[0].questionOptions[1].question` 你看到亲密度那栏，最在意哪一行？
- `$case.sceneVersions[1].entryQuestion` 你说你当自己在谈。他怎么对你的？
- `$case.sceneVersions[1].casualQuestions[0].question` 你们最早怎么认识的？
- `$case.sceneVersions[1].casualQuestions[1].question` 你为什么一直固定找他？
- `$case.sceneVersions[1].casualQuestions[2].question` 他有没有当着别人维护过你？
- `$case.sceneVersions[1].casualQuestions[3].question` 你在他们店剪了多久头发？
- `$case.sceneVersions[1].casualQuestions[4].question` 第一次单独吃饭是什么时候？
- `$case.sceneVersions[1].casualQuestions[5].question` 他会不会私下找你说话？
- `$case.sceneVersions[1].casualQuestions[6].question` 他多大？
- `$case.sceneVersions[1].casualQuestions[7].question` 他叫你自己人时，你怎么回的？
- `$case.sceneVersions[1].questionOptions[0].question` 这些照顾你都记得。可你问过他，你们到底算什么关系吗？
- `$case.sceneVersions[2].entryQuestion` 你裁掉的右半边，写的是什么？
- `$case.sceneVersions[2].casualQuestions[0].question` 小姐妹为什么让你留原图？
- `$case.sceneVersions[2].casualQuestions[1].question` 你裁图的时候，知道右边跟钱有关吗？
- `$case.sceneVersions[2].casualQuestions[2].question` 你说名字和亲密度还不够，她后来回你了吗？
- `$case.sceneVersions[2].casualQuestions[3].question` 没发的那几列，原图还留着吗？
- `$case.sceneVersions[2].casualQuestions[4].question` 她没回以后，你还问过她吗？
- `$case.sceneVersions[2].questionOptions[0].question` 你为什么偏偏把金额和产品那几列裁掉？
- `$case.sceneVersions[3].entryQuestion` 你刚才说产品那一列。那是什么产品，你以前听过吗？
- `$case.sceneVersions[3].casualQuestions[0].question` 小姐妹当时说了哪家吗？
- `$case.sceneVersions[3].casualQuestions[1].question` 你当时为什么没问是哪家？
- `$case.sceneVersions[3].casualQuestions[2].question` 你是在店里听她说的，还是别处？
- `$case.sceneVersions[3].questionOptions[0].question` 小姐妹当时到底跟你说了多少？

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[1]` 她听完什么反应？
- `$case.overnightStructure.dayScenes[0].body.beats[3]` 后来你们还聊过这个产品吗？
- `$case.overnightStructure.dayScenes[1].body.beats[1]` 如果钱先转到别人户头，再由他来买呢？

### 夜 B

- `$case.sceneVersions[4].sceneCloser.lines[0]` 没人说你活该。我问先后：你那时候为什么去借这笔钱？
- `$case.sceneVersions[4].sceneCloser.lines[2]` 你平时做什么工作？
- `$case.sceneVersions[5].questionOptions[0].lines[1]` 认收过钱，和产品里确实有你这份，是两回事。合同、回单你问了吗？
- `$case.sceneVersions[6].beforeVersion.lines[0]` 名单上的周呢，她到底是来剪头的，还是你说的那种女朋友？
- `$case.sceneVersions[6].beforeVersion.lines[2]` 这两列你昨晚就看见了。
- `$case.sceneVersions[6].testimonyWall.acts[0].decisivePresent.hostLine` 留晚档、陪你聊天，这些你说过了。代投的聊天也已经在这儿，不能省掉。他对合同和退钱到底怎么答的？
- `$case.sceneVersions[6].testimonyWall.acts[0].inquiry.openingLines[0]` 这十二万你要追回来，打算让我怎么替你说？
- `$case.sceneVersions[6].testimonyWall.acts[0].inquiry.options[1].lines[1]` 我今天在店外也听见他叫别的客人自己人。照顾可能是真的，但这称呼不是认购凭据，代投聊天也不能省掉。他对合同和退钱到底怎么答的？
- `$case.sceneVersions[6].testimonyWall.acts[1].decisivePresent.hostLine` 十二万收得挺痛快，问个合同倒嫌你催了？
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.options[1].lines[1]` 那就让他把合同和对应回单拿出来；没买成，说明钱在哪儿、什么时候退。不能拿一张提交页让你一直等。
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.options[2].lines[1]` 这就对了。十二万收得痛快，问到去向就只剩一句等，不能这么应付。
- `$case.sceneVersions[6].sceneCloser.lines[0]` 你还有什么想说的？
- `$case.sceneVersions[6].sceneCloser.lines[2]` 留晚档哄你高兴，问到十二万就只剩一句已经提交。他还欠你个交代。
- `$case.overnightStructure.linearCallback.lines[1]` 完整截图收到了。先对一下你交来的这几行，昨晚门口的事也还没说完。
- `$case.sceneVersions[4].entryQuestion` 昨晚是谁敲门？
- `$case.sceneVersions[4].casualQuestions[0].question` 他们问了多久？
- `$case.sceneVersions[4].casualQuestions[1].question` 你为什么搬到妈妈家？
- `$case.sceneVersions[4].casualQuestions[2].question` 你现在住妈妈家，是怕对方还会再来？
- `$case.sceneVersions[4].questionOptions[0].question` 是你自己的借款。那跟 Tony 这十二万，你为什么要先分开说？
- `$case.sceneVersions[5].entryQuestion` 你补来的转账我看了，十二万，怎么到他手里的？
- `$case.sceneVersions[5].casualQuestions[0].question` 转钱以前，你见过产品合同吗？
- `$case.sceneVersions[5].casualQuestions[1].question` 你收到的提交页面，能看出这十二万买的是什么吗？
- `$case.sceneVersions[5].casualQuestions[2].question` 你为什么一直找他做头发？
- `$case.sceneVersions[5].casualQuestions[3].question` 转完以后，你还当自己在跟他谈吗？
- `$case.sceneVersions[5].questionOptions[0].question` 你说并进他的户。他当时是怎么保证这十二万能算到你头上的？

### 终局

- `$case.stageJudgement` 店里忙着发函划清业务，Tony 还没把合同回单给她。十二万收走了，总得有人回答买成了什么吧。

### 其他出声面

- `$case.careChoices[0].hostLine` 他回了消息再来。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 周后来把材料转你了吗？
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 你能确定回单就是她转的那一百万吗？
- `$case.overnightStructure.liveCounterBeats[1].choices[0].lines[1]` 函是店里寄给平台的。行，收钱的是 Tony，那就请他本人把合同拿出来。

## 第四通咨询者·何

- **固定性格：** 渴望被尊重的社交型人格
- **受压反应：** 引用他的原话前会停；别人拿酒吧工作定性她时立刻变硬；问到自己花过多少钱时不再铺垫。
- **防御动作：** 第一夜只砸裁过的名单和要钱，把左半张图读成女友名册；问到恋爱就承认他帅、自己也要这个位置。敲门时突然下线，不说警察是因涉案放款人来核实。开场不说十二万是自己让他代投。
- **知识边界：** 知道自己的聊天、十二万转账、不够一百万起投、走他户的口头约定，也知道高息是自己先在酒吧听说的，并知道自己向放贷人借过钱。第二夜知道周是剪头客户并见过她转发的认购回单。她没有合同原件，不知道十二万是否已经买成宸直，也不知道 Tony 有没有代销资格；不知道警察把她当证人还是另有调查。

### 夜 A

- `$case.openingDialogue[0]` 主播，我在线上吗？
- `$case.openingDialogue[2]` 我昨晚在一个男的手机里看见张名单，上面全是女的。我一晚上没睡。
- `$case.openingDialogue[4]` 给我剪头的那个，我平时叫他 Tony。我今天轮休，现在在家。一直没敢找他。
- `$case.openingDialogue[6]` 没公开过。可他一直叫我自己人。
- `$case.openingDialogue[8]` 亲密度、下次约，一排女人的名字。越看越不对。我当时就觉得，他是不是拿谈恋爱吊着一串人。而且我还有一笔钱在他那里。
- `$case.openingDialogue[10]` 你先听这张名单行不行？钱我会讲。我就想知道，他是不是对谁都这样。
- `$case.openingDialogue[12]` 他去洗澡，手机亮着，备忘录没锁。
- `$case.openingDialogue[14]` 我已经发后台了。那笔钱，我就是想拿回来。
- `$case.sceneVersions[0].noClueReaction` 名单上的人我不认识。我只能说我那一行。
- `$case.sceneVersions[0].casualQuestions[1].lines[0]` 我数过，八……不对，九个。
- `$case.sceneVersions[0].casualQuestions[1].lines[2]` 连我。
- `$case.sceneVersions[0].questionOptions[0].lines[0]` 截得急……我就先发了我最在意的那半边。
- `$case.sceneVersions[0].questionOptions[0].lines[2]` ……我裁过。右边几列没发。
- `$case.sceneVersions[1].noClueReaction` 他就是这么叫的。别的我现在不想说。
- `$case.sceneVersions[1].casualQuestions[6].lines[0]` 二十九。
- `$case.sceneVersions[1].casualQuestions[6].lines[2]` 他自己说的。
- `$case.sceneVersions[1].questionOptions[0].lines[0]` 问过。他老说我们这样不是挺好，还带我吃饭。非得拿个喇叭宣布了才算？
- `$case.sceneVersions[2].noClueReaction` 右边我没发，我承认。先看我发来的这半张行不行？
- `$case.sceneVersions[2].questionOptions[0].lines[0]` 那几列是钱的事。我想先说他怎么对我，放一起，你们又要先问我为什么转钱。
- `$case.sceneVersions[2].questionOptions[0].lines[2]` 我会发。可他叫自己人、留晚档，那些也不是我编的啊。
- `$case.sceneVersions[3].noClueReaction` 她就提过一句。那晚还有谁，我不想说。
- `$case.sceneVersions[3].sceneCloser.lines[1]` 等一下。
- `$case.sceneVersions[3].sceneCloser.lines[3]` 我先去看看。
- `$case.sceneVersions[3].questionOptions[0].lines[0]` 她说有个东西利息高。
- `$case.sceneVersions[3].questionOptions[0].lines[2]` 她还说，不是我手里那点钱能买的。后来我又问过谁，今晚不说。
- `$case.nightStructure.hangup` 我这边真有事。明天再说。
- `$case.sceneVersions[0].version` 我往下划，一排名字，全是女的。备注写着亲密度、下次约。我那行也在。我把截图发到后台了，钱还在他那儿，我才打进来。
- `$case.sceneVersions[0].revisedVersion` 全是女的这一层是真的。可我发的只有左半边，右边几列没发。
- `$case.sceneVersions[0].casualQuestions[0].answer` 截了。
- `$case.sceneVersions[0].casualQuestions[2].answer` 没有。我把屏幕按灭了。他出来还问我晚上吃什么。
- `$case.sceneVersions[0].casualQuestions[3].answer` 没有。我看到那些备注，就觉得他跟这些人都不一般。
- `$case.sceneVersions[0].casualQuestions[4].answer` 在。但我发给小姐妹的只有左半边。
- `$case.sceneVersions[0].questionOptions[1].answer` 我自己的。他平时把我当自己人，手机里倒跟别的女人排在一起了。
- `$case.sceneVersions[1].version` 我一开始就是觉得他长得好看。后来他总给我留最晚那档，也叫我自己人。我下班晚，别人都收东西了，他还等着，剪完带我去吃宵夜。那次我说心情不好，他坐路边听了半个多小时，也没催我办卡。后来我就觉得，我们这不就是在谈吗？所以看到手机里那张表，我才受不了。
- `$case.sceneVersions[1].revisedVersion` 我确实想跟他谈。他没带我见朋友，我就一直没追问。可自己人是他叫的，晚档他也留了。
- `$case.sceneVersions[1].casualQuestions[0].answer` 同事推荐的，说他技术好。我第一次去就觉得他长得好看，后来剪头一直找他。
- `$case.sceneVersions[1].casualQuestions[1].answer` 手艺好。我上班时间跟别人不太一样，经常要见人，头发隔一阵就得弄。他肯给我留最晚的号。
- `$case.sceneVersions[1].casualQuestions[2].answer` 旁边有个客人说，女孩子半夜下班不像正经工作。他当场回了一句：“人家上自己的班，关你什么事。”我那时候真挺感激他的。
- `$case.sceneVersions[1].casualQuestions[3].answer` 一年多。最开始就是普通剪头，最近几个月才越走越近。
- `$case.sceneVersions[1].casualQuestions[4].answer` 大概三个月前。他收店晚，我也刚下班，就在旁边吃了碗面。后来又吃过两次。
- `$case.sceneVersions[1].casualQuestions[5].answer` 会。有次他说店长又骂他了，最后来一句：“也就你肯听我说这些。”那条语音我一直留着。
- `$case.sceneVersions[1].casualQuestions[7].answer` 我回他，有事就找我。我也想跟他多聊一会儿。
- `$case.sceneVersions[2].version` 金额、产品、后面怎么跟。我没把那几列发给你们。小姐妹让我把原图留好，我跟她说，名字和亲密度还不够吗？她没理我。
- `$case.sceneVersions[2].casualQuestions[0].answer` 她只说别光留名字，原图别删。我问她什么意思，她说等见面再讲。
- `$case.sceneVersions[2].casualQuestions[1].answer` 知道。可我当时就想先让你们看他怎么记这些女的。
- `$case.sceneVersions[2].casualQuestions[2].answer` 没再回。前面她只让我把原图留好。
- `$case.sceneVersions[2].casualQuestions[3].answer` 留着，我只是没截进去。
- `$case.sceneVersions[2].casualQuestions[4].answer` 没有，我就来找你了。
- `$case.sceneVersions[3].version` 听过。小姐妹提过一嘴，说有个东西利息挺高。我当时就听了个热闹，没跟她细问。
- `$case.sceneVersions[3].casualQuestions[0].answer` 没有，就说最近有人在买。
- `$case.sceneVersions[3].casualQuestions[1].answer` 她随口一说，我也没当场追着问。我只记住息挺高。
- `$case.sceneVersions[3].casualQuestions[2].answer` 在外面聚会时听的。具体在哪儿，我不想在直播里说。

### 夜 B

- `$case.sceneVersions[4].noClueReaction` 我说了，现在不想讲是谁。你别逼我。
- `$case.sceneVersions[4].sceneCloser.lines[1]` 手里正好空了，又想多凑点跟着买。借了多少，今晚我不想说。
- `$case.sceneVersions[4].sceneCloser.lines[3]` 酒吧营销，帮客人订台，卖酒有提成。高息也是在酒桌上听的，我后来才去问 Tony。
- `$case.sceneVersions[4].questionOptions[0].lines[0]` 警察没问 Tony 收的那十二万。我是不想一说借钱，你们就觉得后面全是我活该。
- `$case.sceneVersions[5].noClueReaction` 钱是钱，关系是关系。你别一句话把两件事并了。
- `$case.sceneVersions[5].questionOptions[0].lines[0]` 他说聊天转账都留着，钱不会不认。
- `$case.sceneVersions[5].questionOptions[0].lines[2]` 问了。他只给提交页。我手里没有产品全名、合同和认购回单。
- `$case.sceneVersions[6].beforeVersion.lines[1]` ……来剪头的。她那行没有亲密度，只有一百万和已买。
- `$case.sceneVersions[6].beforeVersion.lines[3]` 看见了。一百万就一定只是客户了？他把亲密度跟钱记在一张表上，你不觉得更恶心吗？
- `$case.sceneVersions[6].beforeVersion.lines[4]` 还有，我不是无缘无故翻手机。小姐妹先说产品在拖，让我别再转，我这才去看的。这个我昨晚也没讲。
- `$case.sceneVersions[6].testimonyWall.acts[0].decisivePresent.callerLine` 我找他帮忙，是因为我跟他那种关系。你把代投两个字摆出来，好像我跟他只剩买卖了，那他哄我的话就不算了？
- `$case.sceneVersions[6].testimonyWall.acts[0].inquiry.openingLines[1]` 这十二万我当然要追回来。你就按他借谈恋爱收我钱来说，帮我买产品那段先别提了。
- `$case.sceneVersions[6].testimonyWall.acts[0].inquiry.options[0].lines[0]` 她有过一张回单。我这十二万的合同，他还没给。
- `$case.sceneVersions[6].testimonyWall.acts[0].inquiry.options[1].lines[0]` 我找他帮忙，是因为我跟他那种关系。你把代投两个字摆出来，好像我跟他只剩买卖了，那他哄我的话就不算了？
- `$case.sceneVersions[6].testimonyWall.acts[0].inquiry.options[2].lines[0]` 没人叫我空着。聊天里已经说过帮我买，我就直接转了。
- `$case.sceneVersions[6].testimonyWall.acts[1].openerLines[0]` 我把催合同和退钱的前后几句一起发来。别光看他那句已经提交。
- `$case.sceneVersions[6].testimonyWall.acts[1].decisivePresent.callerLine` 提交页也是他发的，又不是我做的。他拿这个应付我，你怎么倒问起我来了？合同我催过两遍了！
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.openingLines[0]` 我把催合同和退钱的前后几句一起发来。别光看他那句已经提交。
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.openingLines[3]` 我现在也不知道买成没有。他让我等产品那边消息，我除了等，还能找谁？可合同他总该给我看看吧。
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.options[0].lines[0]` 没有，他只说已经提交，让我等。
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.options[1].lines[0]` 没给过日期。我问急了，他就说当初是我让他帮忙的。
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.options[1].lines[2]` 我就要他正面回这几句。合同我催过两遍了。
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.options[2].lines[0]` 合同、回单，买成了就给我看对应哪一笔。没买成就把钱退回来，别再让我空等。
- `$case.sceneVersions[6].sceneCloser.lines[1]` 上礼拜他给我修刘海，手特别轻。我问两遍嫌不嫌烦，他说不烦。问两遍合同，倒成了催他。
- `$case.sceneVersions[6].sceneCloser.lines[3]` 完整截图和转账我一起留着。这次不发半张了，省得他又拿这个岔开。
- `$case.overnightStructure.linearCallback.lines[0]` 我现在在我妈家，没事。昨晚突然挂了，门口的事我还没说。
- `$case.sceneVersions[4].version` 昨晚来的是警察，说借钱给我的人涉嫌放高利贷，来核实借款。这跟 Tony 没直接关系。我自己的借款细节，今晚不想说。
- `$case.sceneVersions[4].casualQuestions[0].answer` 十来分钟。问我什么时候借的、怎么联系上的。
- `$case.sceneVersions[4].casualQuestions[1].answer` 昨晚那一下把我吓着了。一个人待着心里发慌。
- `$case.sceneVersions[4].casualQuestions[2].answer` 住两天。我妈在家，我能踏实点。
- `$case.sceneVersions[5].version` 是我转的。我先问能不能跟着买，他说我这十二万可以并进他的户。我知道不够一百万，可小姐妹都说收益高，他又对我那么好，我想他不会坑我。钱转完就给了我一张提交页面，合同一直没给。到现在我也不知道买成没有。昨晚裁掉的就是这部分，我怕一说是我先问，你们就只笑我贪。
- `$case.sceneVersions[5].casualQuestions[0].answer` 没有。他说先把钱并进去，材料后面给。
- `$case.sceneVersions[5].casualQuestions[1].answer` 看不出来。上面就说提交了，下面写的我也看不懂。我问他，他让我等。
- `$case.sceneVersions[5].casualQuestions[2].answer` 我下班晚，他肯留最后的号。染发、护理我都找他，酒吧一晚的提成有时候当晚就结，我花钱也快。
- `$case.sceneVersions[5].casualQuestions[3].answer` 我那时候还想跟他谈。这十二万，我也以为他会替我办好。
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[0].text` 我看到一排女人和亲密度，第一反应当然是他拿谈恋爱吊着人。
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[0].pressResponse` ‘那排名字就是全是女的。右边的钱……我等会儿说。’
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[1].text` 转钱以前，小姐妹提过高息档一百万起投，我只当听个热闹。
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[1].pressResponse` ‘小姐妹是提过一百万。后来……后来我确实问过 Tony，能不能让我跟着买。’
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[2].text` 十二万是我自己转的，备注没写，但聊天里有‘帮我买’。
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[2].pressResponse` ‘钱是我转的。可他收了以后，合同呢？’
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[3].text` 我裁掉金额和‘走我户’，是怕原图一发，大家先问我为什么把钱转给他。
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[3].pressResponse` ‘我不想一发出来就被围着骂。右边是我裁的。’
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[4].text` 这十二万我当然要追回来。你就按他借谈恋爱收我钱来说，帮我买产品那段先别提了。
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[4].pressResponse` ‘一说代投，大家就只骂我贪利息，谁还帮我追钱？’
- `$case.sceneVersions[6].testimonyWall.acts[1].statements[0].text` 他既然发了已提交，那就是买进去了吧。现在退不出来，应该是产品那边卡着。
- `$case.sceneVersions[6].testimonyWall.acts[1].statements[0].pressResponse` ‘我就是觉得，没买成他干吗不退？可你问这张图哪里写了买成，我找不到。’
- `$case.sceneVersions[6].testimonyWall.acts[1].statements[1].text` 十二万是我转的，聊天里的‘帮我买’也是我发的，这些我不改。
- `$case.sceneVersions[6].testimonyWall.acts[1].statements[1].pressResponse` ‘钱是我转的，话也是我发的。可他收了以后，合同呢？’
- `$case.sceneVersions[6].testimonyWall.acts[1].statements[2].text` 合同和正式回单，他说都在他那儿。我问了，他没给我。
- `$case.sceneVersions[6].testimonyWall.acts[1].statements[2].pressResponse` ‘我问买成哪笔，他就回是我先要买的。我没说不是我先问，他能不能别再绕这句？’
- `$case.sceneVersions[6].testimonyWall.acts[1].statements[3].text` 右半边是我裁的。我怕大家一上来先骂我贪利息。
- `$case.sceneVersions[6].testimonyWall.acts[1].statements[3].pressResponse` ‘右边是我裁的，这点我不躲。可“自己人”是他说的。’
- `$case.overnightStructure.postures.againstCaller` 让他帮我买是我问的，这我认。可我没答应被写成女朋友名册拿去养鱼。
- `$case.overnightStructure.postures.withCaller` 昨晚下线以后，我折腾到很晚。白天你查到什么，等我先把昨晚的消息说完。
- `$case.nightStructure.returnStance.lines.defensive` 我差点不打回来。昨晚那张图是我裁的，这个我认。可他为什么收我的钱，也得问。
- `$case.nightStructure.returnStance.lines.open` 我回来了。名单的事你继续问。这回我不先说他养鱼。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了。完整名单和转账都发后台了。

### 其他出声面

- `$case.careChoices[0].lines[0]` 行。别我一走，你们就只剩笑我了。
- `$case.overnightStructure.liveCounterBeats[0].lines[1]` 转了三张图：她给他的一百万、他说先放进宸直的聊天，还有一张认购回单。
- `$case.overnightStructure.liveCounterBeats[0].lines[3]` 不能。我手里只有她转来的图。是不是同一笔钱，我看不出来。我那十二万进没进产品，更看不见。
- `$case.overnightStructure.liveCounterBeats[1].choices[1].lines[1]` 对，我问的是他收钱以后干了什么。店里不认这项业务，总能叫他自己回我吧。

## Tony

- **固定性格：** 讨喜的即兴交易者
- **受压反应：** 被逼着定义关系时退回服务和店务，把情绪词说成维护。
- **防御动作：** 把走他户说成替自己人凑门槛的顺手帮忙；先认自己人、晚档、走我户和已经提交，再把名单说成客户跟进。声称材料只给何本人，不向节目交代。不上麦。
- **知识边界：** 知道自己的聊天、会员记录、私人名单、何转到自己户头的十二万，以及自己把钱实际送去了哪里；不知道产品最终能否兑付，也不能代表门店对外卖理财。节目没有拿到他所称的产品全名、合同和回单。他不上麦。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[0]` 姐，先坐会儿。
- `$case.overnightStructure.dayScenes[2].body.beats[1]` 自己人还排什么队啊。我把手上这个做完就轮你。
- `$case.overnightStructure.dayScenes[2].body.beats[3]` 行，不说那个。你先坐，我这边马上好。

### 后台／材料回流

- `$case.respondentNote.text` 十二万过到我户没错，可先问能不能跟着买的是她。我说过走我户，也说过已经提交。名单就是我记客户的，不是什么女朋友名册。‘自己人’我叫过，晚档我也留过，怎么了？钱走我户，材料当然先在我这儿。她要看，我会发给她本人，不发直播间。我不上麦。

## Tony 案邻桌常客

- **固定性格：** 厌烦套路的直肠子
- **受压反应：** 听见熟悉话术就直接复述自己听过的版本。
- **防御动作：** 只说耳朵听见的，不负责解释。
- **知识边界：** 只知道同席时听见的当面话，不知道麦外私聊。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[2]` 你可少来。今天就补颜色，别又跟我说那个。我没钱。

## Tony 案小姐妹

- **固定性格：** 酒桌知情却不愿当证人的朋友
- **受压反应：** 先划清自己只说过门槛，再把后续动作推回何。
- **防御动作：** 只认酒桌上说过一百万起，不认自己让她买。
- **知识边界：** 知道自己在酒吧酒桌说过高息档一百万起，也知道何听完就问自己那点钱够不够；后来听说赎回要排队才让何别再转。不知道 Tony 名单全文、十二万是否入产品、Tony 有无代销资格。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 息高那档我在酒桌上说过，一百万起。我没让她买。
- `$case.overnightStructure.dayScenes[0].body.beats[2]` 就问她自己那点钱够不够。我当时还笑她。
- `$case.overnightStructure.dayScenes[0].body.beats[4]` 最近有人说赎回要排队。我怕她已经转了，才让她别再转。她回我一句：我去翻他手机。

## Tony 案店长

- **固定性格：** 急躁的防守型管理者
- **受压反应：** 追问私表越深，越快结束谈话并关门。
- **防御动作：** 承认培训，不承认自己知道私人推进。
- **知识边界：** 知道培训、会员制度和员工指标，不知道Tony全部私人对话。

### 后台／材料回流

- `$case.investigationHooks[0].material` 门店培训卡只写‘记需求、约下次、晚档优先’。熟客补来的上周截图里，Tony 问：‘上周那个，你听完了吗？自己人，晚档给你留。’对方回：‘听过了，没钱。剪头就剪头，别又跟我说那个。’店长另说：‘我们店只做美发，也没让员工替客人收这种钱。Tony 私下跟客人说了什么，你们问他本人，别把店也写进去。’

## Tony 案另一位女客

- **固定性格：** 受伤后外放的感性派
- **受压反应：** 越被拒绝越想把个人尴尬变成共同指控。
- **防御动作：** 用‘不止我一个’压过自己的受用。
- **知识边界：** 知道自己转过一百万、名单行写已买、Tony 发来的聊天和一张认购回单；不知道咨询者的十二万是否入了同一产品，也不知道其他顾客是否投过钱。

### 后台／材料回流

- `$case.investigationHooks[1].material` 周女士说：“我就是名单上写一百万、已买的那位客人。他给我发过一张回单。我不去店里闹，材料可以交警方。回单是不是对应我那笔钱，让他们查。”

## Tony 案宸直柜员

- **固定性格：** 守窗口权限的程序执行者
- **受压反应：** 一碰到代持代购就不再回答，没有合同编号就结束谈话。
- **防御动作：** 只报高息档起投，其余推给系统户名。
- **知识边界：** 只知道高息档个人认购起投一百万；代持代购、具体合同和兑付结果不在窗口可答范围。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 你问的那类产品，单笔认购至少一百万，还要做投资者资格和风险匹配。
- `$case.overnightStructure.dayScenes[1].body.beats[2]` 系统只认合同上的委托人。你没有产品全名和合同编号，我查不了。
- `$case.overnightStructure.dayScenes[1].body.beats[3]` 后面还有人办业务，先这样。

## 老方

- **固定性格：** 急躁的结果主义者
- **受压反应：** 数据越差，句子越像截止日期和命令。
- **防御动作：** 把关心包装成指标，把认可包装成下一项要求。
- **知识边界：** 只知道节目运营、后台曲线和公开播出内容，不知道案件麦外真相。

### 其他出声面

- `$case.overnightStructure.liveCounterBeats[1].text` 店家商务函到平台了，要求别把 Tony 的私人收款说成门店业务，也别再挂店名。法务让缓。你要继续，数据得扛住。——方

# 快案：什么都不图

## 林旭阳

- **固定性格：** 见得多、反应快，能接住情绪，也敢抓着绕答继续问
- **受压反应：** 听见用途偷换、关键人被省掉或对方答非所问，就收笑、打断，直接追他在躲哪一件事；不等材料全部到齐才施压。
- **防御动作：** 旧误判使他更会核对原话，不使他放弃判断。先从具体异常提出最可能的解释，再看对方怎样否认、补充或转题。
- **知识边界：** 现场信息来自已听见或已获得的内容；经验让他能从遗漏、利益与辩解推断隐藏路线并主动试探，无需先获确凿证据。尚未出现的具体身份、金额与材料不能被他说成已知事实。

### 其他出声面

- `$quick.turns[0].host` 你好，能听见吗？
- `$quick.turns[1].host` 好，你今天想问什么事？
- `$quick.turns[2].host` 我这确实有一些登记的候选男生，看你要什么样的了。先说说你自己吧，以前的情感经历最好也说说。
- `$quick.turns[3].host` 你刚才说家里遇事别转身就跑。为什么这么在意这一点？
- `$quick.turns[4].host` 你刚才说自己能养活自己。现在是租房，还是跟家里住？
- `$quick.turns[5].host` 那你爸还挺疼你的，自己身体这样，还先把你的房子解决了。
- `$quick.turns[6].host` 你说遇上事一起想办法，具体是指什么？
- `$quick.turns[7].host` 家里的情况和检查这件事，我听到了。再说找人，你现在具体想找什么样的？
- `$quick.turns[8].host` 我这还真有个，二十九，月薪六千，在物流公司做调度，没房。要不要先认识一下？
- `$quick.turns[9].host` 那什么样的介绍，你会更放心？
- `$quick.turns[10].host` 那你还是有要求的嘛，不是没要求。房子多少钱，贷了多少？
- `$quick.turns[11].host` 你为什么一定想让我来介绍？
- `$quick.issueOptions[0].question` 你在店里，客人试了半天又不买，你也这么直说？
- `$quick.issueOptions[1].question` 你前面说亲爸伤了腰，只能偶尔替人看店。后面又说‘爸爸’给了你一百万。我问清楚：给钱的到底是不是你亲爸？
- `$quick.issueOptions[2].question` 你说到生孩子。这是希望找人前先谈清的事，还是你现在正有这个顾虑？
- `$quick.issueOptions[3].question` 你说月薪四五千也行，自己的工资还完房贷又剩不了多少。你希望对方每月替你还多少？
- `$quick.issueOptions[4].question` 我连你的真实要求都才问明白，凭什么跟人家保证你可靠？
- `$quick.confrontations[0].lines[0]` 你在店里，客人试了半天又不买，你也这么直说？
- `$quick.confrontations[0].lines[2]` 工作里能耐着性子，回家就不想再这么说了？
- `$quick.confrontations[1].lines[0]` 你前面说亲爸伤了腰，只能偶尔替人看店。后面又说‘爸爸’给了你一百万。我问清楚：给钱的到底是不是你亲爸？
- `$quick.confrontations[1].lines[2]` 我只问一句，他是不是你亲生父亲？
- `$quick.confrontations[1].lines[4]` 那刚才我说你亲爸身体这样还给你买房，你怎么不纠正？给钱这位跟你是什么关系？
- `$quick.confrontations[2].lines[0]` 你说到生孩子。这是希望找人前先谈清的事，还是你现在正有这个顾虑？
- `$quick.confrontations[2].lines[2]` 不用在这里交检查。你想让我介绍人，这个顾虑准备什么时候跟对方谈？
- `$quick.confrontations[3].lines[0]` 你说月薪四五千也行，自己的工资还完房贷又剩不了多少。你希望对方每月替你还多少？
- `$quick.confrontations[3].lines[2]` 如果他四五千只够自己生活，拿不出钱帮你还贷，你还愿意见吗？
- `$quick.confrontations[4].lines[0]` 我连你的真实要求都才问明白，凭什么跟人家保证你可靠？
- `$quick.confrontations[4].lines[2]` 介绍之前我不了解你，这句话我说不了。
- `$quick.ending.summaryPages[0].lines[0]` 介绍的事先算了。真要找对象，把房贷和要求当面跟人家说。

## 快案来电人·罗

- **固定性格：** 擅长用低姿态和亲近感争取入口的机会主义自保者
- **受压反应：** 被追到钱源时先坚持长期父女称呼、反问为什么非要分清，被逼着回答是否亲生以后才最小承认，再用隐私和自愿赠与转题；被回问为什么拿自己不能生孩子举例时先反问“你怎么能这么问”，直到主播再追一句才承认做过检查。
- **防御动作：** 把恋爱里不愿说好话说成不会，两个出资背景都用爸爸串起来，把检查顾虑放进假设，最后才说月供分担。
- **知识边界：** 知道亲生父亲的身体与家庭经历、一百万元的真实给款人、自己的检查结果和择偶目标；不会公开给款者的身份。她不知道父母和前任会怎样解释旧事，也不能用检查结果证明任何性经历。

### 其他出声面

- `$quick.turns[0].caller` 能听见。那个……我这事从哪儿说呢。
- `$quick.turns[1].caller` 我想找个对象，也想让你帮我看看，我这样的适合找什么样的。你手里要真有合适的，也可以给我介绍一下。
- `$quick.turns[2].caller` 我二十四，在商场卖衣服，底薪加提成一个月六七千，自己能养活自己。以前谈过两个，一个去了外地，另一个嫌我脾气不好。我脾气确实不好，好听的也不会讲。现在想找个踏实的，别赌，别动手。家里遇上事，别瞒着我，也别转身就跑。
- `$quick.turns[3].caller` 我刚才说，家里遇事别转身就跑，是因为我爸妈的事。我爸以前给人开货车，后来伤了腰，重活干不了，家里收入就断了。我妈收拾东西就走了，那年我还在上小学。后来我爸一个人把我带大的。现在亲爸偶尔替人看店，也挣不了多少。我就觉得，两个人碰上没法上班，总该一起想办法。
- `$quick.turns[4].caller` 我自己有套小两居，还有一点贷款。去年买的时候，爸爸给了我一百万，我又添了一点才买下来。以后男方没房，也可以先住我这里。
- `$quick.turns[5].caller` 他在我身上一直挺舍得的。钱的事其实都不是重点，我也不会让男方养我。
- `$quick.turns[6].caller` 遇上事不光是钱的事。哪怕以后他身体不好，或者是我不能生孩子，也能商量着过，别一听就走。
- `$quick.turns[7].caller` 一个月四五千就行，年龄大我五岁以内，没房也可以。学历、长相我真不挑，人品好就行。
- `$quick.turns[8].caller` 您节目里之前提过一个，二十九，月薪六千。我也看了，先别急吧。就这么几句话，我也不知道他平时是什么样的人。加了以后不合适，再删也挺麻烦的。
- `$quick.turns[9].caller` 最好是您认识久一点的，自己做点生意，家里也省心。能帮我减轻点房贷压力，那就更好了。
- `$quick.turns[10].caller` 房子总价两百万。爸爸给了一百万，我添了十万，贷了九十万。每个月还完，工资也剩不了多少。
- `$quick.turns[11].caller` 您做这个两年多了，看人肯定比我准。您要是先跟他说一句，我这人还可以，他至少愿意见我一面。旭阳哥，我条件真没那么多，您就帮我留意一下吧。
- `$quick.confrontations[0].lines[1]` 那怎么会。我就说姐，您再搭这件试试，这个颜色显气色。真不买，我也得笑着送出去。
- `$quick.confrontations[0].lines[3]` 上班才这么说啊。下班找个对象，还得让我哄？我一天都够累了。
- `$quick.confrontations[1].lines[1]` 我一直叫他爸爸，他也一直把我当女儿。钱是他愿意给我的，你们为什么非要分得这么清？
- `$quick.confrontations[1].lines[3]` ……不是亲爸。可我叫了这么多年，跟亲爸有什么区别？
- `$quick.confrontations[1].lines[5]` 这是我的私事，我没必要在直播里全说。反正钱是他自愿给的，不是我偷的抢的，房子也在我名下。
- `$quick.confrontations[2].lines[1]` 我怕对方一听就走。可现在才刚说介绍，总不能先把检查都交上去吧。
- `$quick.confrontations[2].lines[3]` 见面聊得来，我会跟他说。我以前查过，医生说自然怀孕的机会低一点，又没说一定不能。我还年轻，后面也可以再复查。
- `$quick.confrontations[3].lines[1]` 我又没让他全包。以后住我的房子，帮着还一点不是应该的吗？
- `$quick.confrontations[3].lines[3]` 那我也得考虑啊。两个人过日子，总不能比我一个人还紧吧。
- `$quick.confrontations[4].lines[1]` 又没让你担保。你先说一句好话，后面我自己跟他聊。
- `$quick.confrontations[4].lines[3]` 那你就直说不想介绍呗。
- `$quick.ending.summaryPages[0].lines[1]` 行，那不麻烦你了。

# 快案：那晚没回消息

## 林旭阳

- **固定性格：** 见得多、反应快，能接住情绪，也敢抓着绕答继续问
- **受压反应：** 听见用途偷换、关键人被省掉或对方答非所问，就收笑、打断，直接追他在躲哪一件事；不等材料全部到齐才施压。
- **防御动作：** 旧误判使他更会核对原话，不使他放弃判断。先从具体异常提出最可能的解释，再看对方怎样否认、补充或转题。
- **知识边界：** 现场信息来自已听见或已获得的内容；经验让他能从遗漏、利益与辩解推断隐藏路线并主动试探，无需先获确凿证据。尚未出现的具体身份、金额与材料不能被他说成已知事实。

### 其他出声面

- `$quick.turns[0].host` 你好，能听见吗？
- `$quick.turns[1].host` 你说吧，遇上什么事了？
- `$quick.turns[2].host` 你先把你们俩的情况大概说一下。
- `$quick.turns[3].host` A8、A7，你报得挺顺。先不聊房，你刚才说他不懂你的感受，哪件事让你这么觉得？
- `$quick.turns[4].host` 收到花的时候，你高兴吗？
- `$quick.turns[5].host` 他从什么时候开始不联系的？
- `$quick.turns[6].host` 你后来怎么回去的？
- `$quick.turns[7].host` 最后那轮还是你点的？
- `$quick.turns[8].host` 那第二天，你跟男方提桌上这个人了吗？
- `$quick.turns[9].host` 你说自己很久没出去。近两个月的动态还能找着吗？
- `$quick.turns[10].host` 十号你还发了一组 KTV 的照片，那是哪天拍的？
- `$quick.turns[11].host` 八号你也出去喝酒了？
- `$quick.issueOptions[0].question` 花那张照片旁边的包，是你自己买的，还是他送的？
- `$quick.issueOptions[1].question` 花那张照片旁边的包，是你自己买的，还是他送的？
- `$quick.issueOptions[1].confrontationOpeningLines[0].text` 花是你先开口要的。他真送来以后，你还是觉得缺点什么？
- `$quick.issueOptions[2].question` 十一点五十二你回的是‘还行’，六分钟以后就没再回。你回‘还行’的时候，身体到底怎么样？
- `$quick.issueOptions[3].question` 你刚说有些酒是别人点的。这个‘别人’是谁？
- `$quick.issueOptions[4].question` 这两个月六次酒吧、KTV，上个月三个周末都有。你说很久没出去，是这些都不算？
- `$quick.issueOptions[5].question` 创业者是不是都没时间听歌
- `$quick.issueOptions[6].question` 你说解释过了，当时怎么跟他讲的？
- `$quick.issueOptions[7].question` 十号你为九号喝多道歉，又发了八号在 KTV 的照片。你发的时候，有没有写清是哪天拍的？
- `$quick.confrontations[0].lines[0]` 花那张照片旁边的包，是你自己买的，还是他送的？
- `$quick.confrontations[0].lines[2]` 朋友圈截图我看了，朋友都在猜你是不是谈了。你跟他说过这些评论吗？
- `$quick.confrontations[0].lines[4]` 嗯，收到礼物高兴，还是觉得聊不进去，这两个我听明白了。再看九号那段消息。
- `$quick.confrontations[1].lines[0]` 十一点五十二你回的是‘还行’，六分钟以后就没再回。你回‘还行’的时候，身体到底怎么样？
- `$quick.confrontations[1].lines[2]` 那就别只说漏看了一条消息。你当时已经难受，还回他‘还行’，后面才断掉。这一段他当时不知道。
- `$quick.confrontations[2].lines[0]` 你刚说有些酒是别人点的。这个‘别人’是谁？
- `$quick.confrontations[2].lines[2]` 男的还是女的？
- `$quick.confrontations[2].lines[4]` 你前面只提了妹妹，我刚还以为就你们俩。这个朋友，你为什么没提？
- `$quick.confrontations[3].lines[0]` 这两个月六次酒吧、KTV，上个月三个周末都有。你说很久没出去，是这些都不算？
- `$quick.confrontations[3].lines[2]` 八号 KTV、九号清吧，连着两晚。你说偶尔出去一次，把前一晚也没算进去？
- `$quick.confrontations[4].lines[0]` 你说解释过了，当时怎么跟他讲的？
- `$quick.confrontations[4].lines[2]` 说到妹妹那个朋友，他才知道还有个人？
- `$quick.confrontations[4].lines[4]` 你前面只提妹妹，忽然又有个朋友，他当然要问啊。
- `$quick.confrontations[5].lines[0]` 十号你为九号喝多道歉，又发了八号在 KTV 的照片。你发的时候，有没有写清是哪天拍的？
- `$quick.confrontations[5].lines[2]` 没写日期，他真看到也未必知道是旧图。你后来单独跟他解释过八号、九号吗？
- `$quick.ending.summaryPages[0].lines[0]` 经过我听明白了。接下来你准备跟他说什么？
- `$quick.ending.summaryPages[0].lines[2]` 你漏掉同桌的人，第二天也没把经过讲全，现在却要他先为口气道歉。你说想挽回，又只肯讲对自己有利的那半段，我没法替你把这话圆过去。

## 快案来电人·周女士

- **固定性格：** 很会把自己放在重感情的位置上，却总把不利事实拆开讲的体面自保者
- **受压反应：** 第一轮先坚持自己只是漏回一条消息；被问酒是谁点的时，把第三个人缩成‘别人’和‘妹妹的朋友’，直到主播问性别才承认是男性；第二天对男方解释时，她也先只说妹妹，直到自己说漏‘妹妹那个朋友’才被追问出第三个人；她说明朋友圈现在三天可见，再自己翻出两批旧动态截图发给后台。等主播问到凌晨照片和近两个月的夜场频率，她才承认读研以后聚会一直不少、同行男的女的都有，却仍把长期状态缩成普通聚会。
- **防御动作：** 先把问题放到情绪交流，说明朋友圈现在三天可见，再自己翻出经过挑选的花、包、车、漂亮饭和演唱会截图自证只是正常分享；主播问到包时，她强调自己没有开口要。随后把分开压成漏回一条消息；第二轮用‘别人’和‘妹妹的朋友’回避性别；第三轮承认自己对男方也是说漏‘妹妹那个朋友’以后才补出男性同行者，再翻出近两个月带时间的动态并截屏发来，想证明平时不这样。看到凌晨照片以后，她才把口径改成读研以后聚会一直不少，却继续用‘普通聚会’和‘不是天天出去’淡化长期状态。
- **知识边界：** 知道八号 KTV、九号酒吧、十号发动态的真实顺序，也知道九号酒桌上的全部人员、自己的醉酒程度、读研以来聚会一直不少、同行有不同圈子的男女，以及近两个月朋友圈里的六次夜场记录和其中两三次彻夜不归；不知道男方退出时最看重哪个因素，不能证明酒局里发生过未播行为。肩臂大片纹身是男方初见时已知的背景，不能单独当成生活方式证据。

### 其他出声面

- `$quick.turns[0].caller` 能听见。我……先说啊，我不是来骂他的。
- `$quick.turns[1].caller` 我跟一个男生接触了一个月，本来都挺好的，最近突然不联系了。我觉得他什么都肯做，就是不太懂我的感受。我想问，是不是我对交流要求太高了。
- `$quick.turns[2].caller` 我二十六，研三，本科和硕士都在一所985高校。他三十五，自己开公司，是婚恋机构介绍的。机构跟他说我学历好、生活简单，也跟我说他想认真结婚。他至少中A8，本地两套平层。我们家就普通家庭，A7吧。家里能支持我，所以找对象也不是指望他养我。
- `$quick.turns[3].caller` 我们一周见两三次，吃饭、散步，他也会开车来接我。我说累，他就把餐厅换到学校附近。可我发一首歌给他，他隔很久只回一句‘听了’，从来不问我为什么发。我有次刷到一束花，顺口问他能不能也送我一束，下次他真带了一大束来。花是有了，可两个人还是聊不到里面去。
- `$quick.turns[4].caller` 我挺高兴的，坐在他车里拍了照片。朋友在下面问是不是谈恋爱了，还有人说羡慕，我回了几个表情。现在朋友圈三天可见。你这边看不到以前的。我自己还能翻。我把花那条和前面几条都截了，刚发后台，前面就是吃饭、演唱会这些。
- `$quick.turns[5].caller` 九号那晚，我妹妹叫我出去坐坐。我已经很久没出去了，正好她想喝一点，我们就去了一家清吧。我后来翻记录数过。十一点五十二，他问我喝得怎么样，我回‘还行’；十一点五十八，他又问我准备几点回去。后面那条我没看见，早上七点多才回。第二天我解释了，也跟他道歉了，他还是越来越冷。
- `$quick.turns[6].caller` 醒来已经在妹妹家了，回去那段记不太清。桌上混着点了几种鸡尾酒，还有龙舌兰，后面又有人点了一轮。
- `$quick.turns[7].caller` 不是我，别人加的。我已经喝不下了。
- `$quick.turns[8].caller` 后来也解释过了啊。我不是都没说。他一直问，我当时也急。
- `$quick.turns[9].caller` 那几次动态我找到了，发给你。生日、毕业这些也算啊？我说很久没出去没说错。
- `$quick.turns[10].caller` 他可能以为是喝断片那晚拍的，其实不是，那是八号的照片，我晚了两天才发。
- `$quick.turns[11].caller` 我跟师姐去唱歌，包厢套餐里带了六杯鸡尾酒。那天就我们两个，我也没喝醉，和九号不是一回事。
- `$quick.issueOptions[1].confrontationOpeningLines[1].text` 我高兴啊，可也想知道他为什么愿意送。他就说你喜欢就买了，后面又没话。
- `$quick.issueOptions[5].missReaction.text` 他创业是忙，可我打来不是替他解释工作的。
- `$quick.confrontations[0].lines[1]` 他送的。第一次逛街时我在柜台前多看了几眼，他后来自己买的。我可没开口跟他要。
- `$quick.confrontations[0].lines[3]` 说过，我还截给他看了。有人羡慕我也高兴啊。但总不能有花有包，就不用好好聊天了吧。
- `$quick.confrontations[1].lines[1]` 已经有点难受了。我当时想着马上就走，没必要让他跟着担心。谁知道几分钟以后会吐成那样。
- `$quick.confrontations[1].lines[3]` 好，我那句‘还行’确实逞强了。但我第二天一醒就说了，也没有故意晾他。
- `$quick.confrontations[2].lines[1]` 我妹妹的一个朋友。他本来就在附近，后来过来坐了一会儿。
- `$quick.confrontations[2].lines[3]` 你听我——是男的。但我跟他不熟，也不是我叫来的。
- `$quick.confrontations[2].lines[5]` ……我是不想被误会，不是想骗人。
- `$quick.confrontations[3].lines[1]` 有生日，有毕业聚会。跟同学见面也算玩啊？又不是每次都喝成九号那样。
- `$quick.confrontations[3].lines[3]` 八号主要是送师姐，我没喝多少。九号才是我自己想出去坐坐。
- `$quick.confrontations[4].lines[1]` 先说我喝多了，妹妹把我送回去。说着说着，就说我妹妹那个朋友也不知道我会吐成那样。
- `$quick.confrontations[4].lines[3]` 对，他就问什么朋友。我当时急着解释，哪会每句话都说得那么严谨。
- `$quick.confrontations[4].lines[5]` 可那就是我妹妹的朋友。我不想说得好像我专门去见他一样。
- `$quick.confrontations[5].lines[1]` 没写。可那不是同一天。我照片早就修好了，不发也浪费。他要是问，我完全可以解释。
- `$quick.confrontations[5].lines[3]` 那我总不能因为他不高兴，什么都不发、哪里也不去吧？
- `$quick.ending.summaryPages[0].lines[1]` 我可以解释。可他那样问我，他也得先为自己的口气道歉吧。你帮我想一句，别弄得像我求他。
- `$quick.ending.summaryPages[0].lines[3]` 那我再想想吧。

# 快案：写给女演员的长文

## 林旭阳

- **固定性格：** 见得多、反应快，能接住情绪，也敢抓着绕答继续问
- **受压反应：** 听见用途偷换、关键人被省掉或对方答非所问，就收笑、打断，直接追他在躲哪一件事；不等材料全部到齐才施压。
- **防御动作：** 旧误判使他更会核对原话，不使他放弃判断。先从具体异常提出最可能的解释，再看对方怎样否认、补充或转题。
- **知识边界：** 现场信息来自已听见或已获得的内容；经验让他能从遗漏、利益与辩解推断隐藏路线并主动试探，无需先获确凿证据。尚未出现的具体身份、金额与材料不能被他说成已知事实。

### 其他出声面

- `$quick.turns[0].host` 先看写这篇长文的人。
- `$quick.turns[0].source` 男方是科技创业者，有自己的高关注度账号。这篇长文由他公开发布，很快被大量转发。
- `$quick.turns[1].host` 再看看被他写进文里的女方。
- `$quick.turns[1].source` 女方是曾经站在流量顶端的演员，播出平台、品牌和公众形象都是她的职业资产。
- `$quick.turns[2].host` 他在文里追三千万，也写到代孕指控。先记住末尾这句。
- `$quick.turns[2].source` 正文指向现实人物并配图，文末却留了一句『纯属虚构』。
- `$quick.turns[3].host` 再看钱。他说已经转了多少？
- `$quick.turns[3].source` 长文说，谈婚期间三千万打进女方家里账户，他已经为这笔钱起诉；男方的原话是，她嫌一天限额一百万太慢，让我准备五张卡一起打。
- `$quick.turns[4].host` 后面还有一笔更大的数。
- `$quick.turns[4].source` 他又写，后来女方开口要五千万美元；他的回答是『让我想想』，这笔钱没有转出去。
- `$quick.turns[5].host` 女方怎么回的？
- `$quick.turns[5].source` 女方说自己从没因为金钱出卖爱情，但对三千万，一个字没回，代孕与更大开价也没有逐项回应。
- `$quick.turns[6].host` 钱还没对清，他又说女方怕了。凭什么这么说？把时间倒回长文发布以前。
- `$quick.turns[6].source` 在这篇长文刷屏前，网上已经出现代孕传闻，也传出有人提前找中间人谈。
- `$quick.turns[7].host` 这段“有人来谈”，是谁说的？
- `$quick.turns[7].source` 男方称，中间人来传话，说女方愿意谈，希望事情不要继续扩大。现有材料是男方对这次传话的描述，没有中间人的独立原话。
- `$quick.turns[8].host` 他还拿女方的工作来解释这次来谈。
- `$quick.turns[8].source` 男方写，她有演出、平台和品牌合作，事情闹大了会影响工作，所以她想尽早平息争议。
- `$quick.turns[9].host` 那他让中间人带回去的，只有退钱这件事吗？
- `$quick.turns[9].source` 他开出三条：退三千万、撤回公开声明、公开承认整篇长文都是真的。
- `$quick.turns[10].host` 这些要求，都写进诉状了吗？
- `$quick.turns[10].source` 但他自己也承认：三千万在状子里。撤声明、认长文都不在。
- `$quick.turns[11].host` 把第一段的虚构标注翻回来，再读他的最后一句。
- `$quick.turns[11].source` 文末写着虚构，收尾却说她自己清楚；我手里还有，今晚先不放。
- `$quick.issueOptions[0].question` 男方自己把长文发出来，说明至少这一次，他愿意让大家都来谈。
- `$quick.issueOptions[1].question` 她靠演出和品牌合作吃饭。评论区吵起来，合作方可不会陪她慢慢等。
- `$quick.issueOptions[2].question` 名字和照片都指向一个人，末尾又写“纯属虚构”。看的人到底该按哪句信？
- `$quick.issueOptions[3].question` 五张卡、催得急、后来又开大价，这些都是男方在文里讲的。
- `$quick.issueOptions[4].question` 三千万，他说转了，也起诉了。五千万美元，他说对方要过，可自己没转。
- `$quick.issueOptions[5].question` 男方把三千万说得这么具体，女方只回一句“不拿金钱换爱情”，这哪儿答上了？
- `$quick.issueOptions[6].question` 怕工作受影响，所以想赶紧谈，这个解释听着很顺。
- `$quick.issueOptions[7].question` “她愿意谈”是谁的原话？
- `$quick.issueOptions[8].question` 他把有人来谈紧接在传闻后面，再补一句“她怕了”。
- `$quick.issueOptions[9].question` 照男方自己说的，诉状里是三千万，撤声明、认全文都没写进去。
- `$quick.issueOptions[10].question` 前面写虚构，后面又说“我手里还有”，还要对方认下全文。他是在给对方加压力。
- `$quick.issueOptions[11].question` 最让我不信的是这儿：他自己给文章写虚构，却要她公开认全文。
- `$quick.confrontations[0].lines[0]` 男方自己把长文发出来，说明至少这一次，他愿意让大家都来谈。
- `$quick.confrontations[0].lines[1]` 这条热度是他主动要的。他想让人看的事，直接摆到了她的观众和合作方面前。
- `$quick.confrontations[1].lines[0]` 她靠演出和品牌合作吃饭。评论区吵起来，合作方可不会陪她慢慢等。
- `$quick.confrontations[1].lines[1]` 我要是她，现在最想知道的恐怕是：这篇东西到底还要挂多久？
- `$quick.confrontations[2].lines[0]` 名字和照片都指向一个人，末尾又写“纯属虚构”。看的人到底该按哪句信？
- `$quick.confrontations[2].lines[1]` 你想让大家相信这些指控，就把材料拿出来。一个虚构标注，不能替你解释前面的内容。
- `$quick.confrontations[3].lines[0]` 五张卡、催得急、后来又开大价，这些都是男方在文里讲的。
- `$quick.confrontations[3].lines[1]` 他说三千万已经起诉，法院要查的是这笔钱。其他私下细节，不会因为他起诉了就自动变真。
- `$quick.confrontations[4].lines[0]` 三千万，他说转了，也起诉了。五千万美元，他说对方要过，可自己没转。
- `$quick.confrontations[4].lines[1]` 两笔别加在一起算她拿了多少。三千万该不该退，交给法院判。
- `$quick.confrontations[5].lines[0]` 男方把三千万说得这么具体，女方只回一句“不拿金钱换爱情”，这哪儿答上了？
- `$quick.confrontations[5].lines[1]` 我想听的是，她认不认这笔钱，怎么解释。代孕和后面的开价，她也没有逐项答。这个回应说服不了我。
- `$quick.confrontations[6].lines[0]` 怕工作受影响，所以想赶紧谈，这个解释听着很顺。
- `$quick.confrontations[6].lines[1]` 可顺归顺，中间人是不是她找的，还没有她本人的话。
- `$quick.confrontations[7].lines[0]` “她愿意谈”是谁的原话？
- `$quick.confrontations[7].lines[1]` 现在是男方说，中间人传的是她的意思。我还没看见中间人怎么说，更没看见她怎么委托的。
- `$quick.confrontations[8].lines[0]` 他把有人来谈紧接在传闻后面，再补一句“她怕了”。
- `$quick.confrontations[8].lines[1]` 这样读下来，来谈就像已经认了前面那些事。可这个结论是他加的。
- `$quick.confrontations[9].lines[0]` 照男方自己说的，诉状里是三千万，撤声明、认全文都没写进去。
- `$quick.confrontations[9].lines[1]` 退钱是一条，替全文背书又是两条。他自己写了虚构，对方为什么就得整篇认？
- `$quick.confrontations[10].lines[0]` 前面写虚构，后面又说“我手里还有”，还要对方认下全文。他是在给对方加压力。
- `$quick.confrontations[10].lines[1]` “我手里还有”，那就等拿出来再看。东西还没见着，倒先让她把整篇认了。
- `$quick.confrontations[11].lines[0]` 最让我不信的是这儿：他自己给文章写虚构，却要她公开认全文。
- `$quick.confrontations[11].lines[1]` 这句虚构到底只准谁用啊？
- `$quick.ending.summaryPages[0].lines[0]` 这篇先聊到这里。

# 未在本报告捕获到台词的人物卡

- V哥（v-bro）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。
- 案一男方前同事（case1-ex-coworker）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。
- Tony 案前台（case2-front-desk）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。
- 快案长文作者·顾（quick3-caller-gu）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。

# 句长节奏人工复核

以下只是朗读提醒，不自动判错。三句服务于不同防御动作时可以保留。

- _shell／林旭阳／other：23、26、27 字（$manifest.nightShell.interludes[1].lines[9]；$manifest.nightShell.interludes[2].lines[3]；$manifest.nightShell.interludes[2].lines[5]）
- _shell／林旭阳／other：33、35、33 字（$manifest.nightShell.cafePrologue.cafe.openingLines[10]；$manifest.nightShell.cafePrologue.cafe.evidencePair[0].hitLines[2]；$manifest.nightShell.cafePrologue.cafe.evidencePair[1].hitLines[2]）
- _shell／咖啡厅男方／other：30、30、30 字（$manifest.nightShell.cafePrologue.cafe.evidencePair[0].remainingLines[1]；$manifest.nightShell.cafePrologue.cafe.evidencePair[0].hitLines[1]；$manifest.nightShell.cafePrologue.cafe.evidencePair[1].remainingLines[1]）
- _shell／咖啡厅男方／other：30、30、30 字（$manifest.nightShell.cafePrologue.cafe.evidencePair[0].hitLines[1]；$manifest.nightShell.cafePrologue.cafe.evidencePair[1].remainingLines[1]；$manifest.nightShell.cafePrologue.cafe.evidencePair[1].hitLines[1]）
- _shell／咖啡厅男方／other：25、25、24 字（$manifest.nightShell.cafePrologue.cafe.transferHitLines[2]；$manifest.nightShell.cafePrologue.cafe.legalClaimLines[0]；$manifest.nightShell.cafePrologue.cafe.legalClaimLines[1]）
- 01-credit／林旭阳／nightA：38、38、36 字（$case.sceneVersions[2].questionOptions[0].lines[5]；$case.sceneVersions[2].questionOptions[1].lines[1]；$case.sceneVersions[2].questionOptions[1].lines[3]）
- 01-credit／案一咨询者·沈／nightB：19、18、18 字（$case.sceneVersions[7].afterVersion.lines[1]；$case.sceneVersions[7].afterVersion.lines[3]；$case.sceneVersions[7].afterVersion.lines[6]）
- 01-credit／案一咨询者·沈／nightB：18、18、20 字（$case.sceneVersions[7].afterVersion.lines[3]；$case.sceneVersions[7].afterVersion.lines[6]；$case.sceneVersions[7].afterVersion.lines[8]）
- 01-credit／案一咨询者·沈／nightB：25、21、22 字（$case.sceneVersions[7].testimonyWall.acts[0].statements[1].text；$case.sceneVersions[7].testimonyWall.acts[0].statements[1].pressResponse；$case.sceneVersions[7].testimonyWall.acts[0].statements[2].text）
- 01-credit／案一咨询者·沈／nightB：21、22、21 字（$case.sceneVersions[7].testimonyWall.acts[0].statements[1].pressResponse；$case.sceneVersions[7].testimonyWall.acts[0].statements[2].text；$case.sceneVersions[7].testimonyWall.acts[0].statements[2].pressResponse）
- 01-credit／林旭阳／nightB：30、27、29 字（$case.sceneVersions[7].testimonyWall.acts[0].decisivePresent.hostLine；$case.sceneVersions[7].testimonyWall.acts[0].inquiry.options[0].lines[1]；$case.sceneVersions[7].testimonyWall.acts[1].openerLines[0]）
- 04-workplace／第二通咨询者·陈／nightA：29、26、29 字（$case.sceneVersions[1].questionOptions[1].lines[0]；$case.sceneVersions[1].questionOptions[2].lines[0]；$case.sceneVersions[1].questionOptions[2].lines[2]）
- 04-workplace／第二通咨询者·陈／nightB：24、25、24 字（$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[1].lines[0]；$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[0]；$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[2]）
- 04-workplace／第二通咨询者·陈／nightB：25、25、25 字（$case.sceneVersions[4].testimonyWall.acts[1].statements[3].text；$case.sceneVersions[4].testimonyWall.acts[1].statements[3].pressResponse；$case.overnightStructure.postures.againstCaller）
- 04-workplace／林旭阳／nightB：26、24、24 字（$case.sceneVersions[3].questionOptions[0].lines[1]；$case.sceneVersions[4].testimonyWall.acts[0].decisivePresent.hostLine；$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[1]）
- 04-workplace／林旭阳／nightB：24、24、20 字（$case.sceneVersions[4].testimonyWall.acts[0].decisivePresent.hostLine；$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[1]；$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[3]）
- 03-profile／林旭阳／nightA：23、19、19 字（$case.sceneVersions[0].questionOptions[1].question；$case.sceneVersions[1].entryQuestion；$case.sceneVersions[1].casualQuestions[0].question）
- 03-profile／林旭阳／nightA：19、21、23 字（$case.sceneVersions[2].casualQuestions[2].question；$case.sceneVersions[2].casualQuestions[3].question；$case.sceneVersions[2].questionOptions[0].question）
- 03-profile／案三咨询者·林／nightB：25、25、29 字（$case.sceneVersions[6].afterVersion.lines[3]；$case.sceneVersions[6].questionOptions[0].lines[0]；$case.sceneVersions[6].questionOptions[0].lines[3]）
- 02-tony／林旭阳／nightA：19、20、23 字（$case.sceneVersions[0].casualQuestions[3].question；$case.sceneVersions[0].casualQuestions[4].question；$case.sceneVersions[0].questionOptions[0].question）
- 02-tony／第四通咨询者·何／nightB：26、28、25 字（$case.sceneVersions[5].casualQuestions[3].answer；$case.sceneVersions[6].testimonyWall.acts[0].statements[0].text；$case.sceneVersions[6].testimonyWall.acts[0].statements[0].pressResponse）
- 02-tony／第四通咨询者·何／nightB：28、25、27 字（$case.sceneVersions[6].testimonyWall.acts[0].statements[0].text；$case.sceneVersions[6].testimonyWall.acts[0].statements[0].pressResponse；$case.sceneVersions[6].testimonyWall.acts[0].statements[1].text）
- 02-tony／第四通咨询者·何／nightB：29、26、25 字（$case.sceneVersions[6].testimonyWall.acts[1].statements[1].text；$case.sceneVersions[6].testimonyWall.acts[1].statements[1].pressResponse；$case.sceneVersions[6].testimonyWall.acts[1].statements[2].text）
- quick-01-no-conditions／林旭阳／other：25、25、27 字（$quick.turns[3].host；$quick.turns[4].host；$quick.turns[5].host）
