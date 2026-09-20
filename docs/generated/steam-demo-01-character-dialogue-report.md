# 《Steam 试玩版》按角色台词报告

> 本文档由内容包自动生成。它把分散在夜 A、白天、夜 B、顾问回流和结案中的台词重新按人物聚合，供遮名辨人、知识边界和句长节奏审稿。请修改 JSON 真源后运行 `npm run content:dialogue-report`，不要手改本文档。

## 汇总

- 固定人物卡：39
- 收录台词／玩家可见人物材料：1070
- 本包实际出声人物：33
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
- `$manifest.nightShell.interludes[1].lines[1]` 老周，几个部门都等着付款，还在催人办活动。栖行平时到底靠什么挣钱？有公开的经营资料吗？
- `$manifest.nightShell.interludes[1].lines[5]` 收费低一半，还经常免费。维护、给店里的分成，拿什么付？
- `$manifest.nightShell.interludes[1].lines[7]` 这么做根本不挣钱，还拼命加点位。他们收的押金放在哪儿了？
- `$manifest.nightShell.interludes[1].lines[10]` 押金收进来，又拿去做别的生意了。宸直怎么也在这儿？
- `$manifest.nightShell.interludes[1].lines[13]` 又是宸直。押金拿去做地产，几个部门的报销还拖着。栖行自己手里还有多少能用的钱？
- `$manifest.nightShell.interludes[1].lines[15]` 这些公开页我给陈发过去。明天他去交原件，也得问清楚，这次到底排没排付款。
- `$manifest.nightShell.interludes[1].lines[18]` 好，付款那栏有变化就发我。
- `$manifest.nightShell.interludes[1].broadcastRecap.lines[2]` 前几天那个垫钱办活动的小伙子，后来跟我私下聊了。原件补齐了，钱还没到。他这次没再垫。
- `$manifest.nightShell.interludes[1].broadcastRecap.lines[3]` 顺着他们公开的广告和经营资料往下看，租金连成本都盖不住，还在不停加点位。每多一个用户，却先多收一笔押金。
- `$manifest.nightShell.interludes[1].broadcastRecap.lines[4]` 融资材料里写得很明白，押金进了关联平台，拿去给地产这些项目周转。充电宝做得越便宜，用的人越多，他们能拿去周转的钱就越多。
- `$manifest.nightShell.interludes[1].broadcastRecap.lines[5]` 他一开始以为只是主管拖着报销。问到最后，公司连旧费用都等着后面的进款。他那六万八什么时候能拿回来，还得接着盯。
- `$manifest.nightShell.interludes[2].lines[3]` 我只看见持有页，三十万，写着九月底到期。合同没上屏。
- `$manifest.nightShell.interludes[2].lines[5]` 没发。她爸那笔是留给女儿自己的，婚宴首饰照样让男方出。
- `$manifest.nightShell.interludes[2].lines[10]` 还是会去。可那顿饭吃完，我有多少钱、愿意怎么花，得由我自己说。
- `$manifest.nightShell.interludes[3].lines[2]` 我洗。你站旁边监督。
- `$manifest.nightShell.cafePrologue.cafe.openingLines[2]` 行，赵同学。人都等着了，回家再数落我。
- `$manifest.nightShell.cafePrologue.cafe.openingLines[4]` 就昨天电话里聊的那些？
- `$manifest.nightShell.cafePrologue.cafe.openingLines[6]` 先用桌边架好的手机录，省得后面谁说了又不承认。
- `$manifest.nightShell.cafePrologue.cafe.openingLines[10]` 行，不拍脸。后续剪完的片子也会给你们看，你们不点头，我们也不会发。
- `$manifest.nightShell.cafePrologue.cafe.evidencePair[0].hitLines[2]` 这是你自己发的，“我到澜桥酒店了”。你刚说那晚没去，这两句话怎么回事？
- `$manifest.nightShell.cafePrologue.cafe.evidencePair[1].hitLines[2]` 这张订单状态是已入住，入住人写的是你。你刚说那晚没去，怎么对得上？
- `$manifest.nightShell.cafePrologue.cafe.revisedPresentLeadLines[0]` 你刚才说得很清楚：你跟顾*之间没转过钱。
- `$manifest.nightShell.cafePrologue.cafe.transferHitLines[0]` 等一下。那你跟顾*来往的这三笔钱是怎么回事？
- `$manifest.nightShell.cafePrologue.aftermath.openingLines[4]` 我把一家鉴定机构的公开联系方式发给你。受理需要谁到场，带哪些材料，你先问清。
- `$manifest.nightShell.cafePrologue.aftermath.openingLines[5]` 家里还留着孩子用过的东西吗？哪些能用，也先问机构。
- `$manifest.nightShell.cafePrologue.aftermath.openingLines[7]` 嗯，到家给我打个电话。
- `$manifest.nightShell.cafePrologue.aftermath.routes[0].lines[1]` 你问过机构了吗？
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[1]` 你发来吧。我请平时帮节目核账的周会计一起看。
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[4]` 又耽误你吃饭了，回头请你。车贷呢？
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[6]` 十八号那笔备注写的什么？
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[8]` 你自己的卡，电子回单能下载吗？
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].handoffLines[0]` 下载好了发给赵律师，我们一起看。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[12]` 你先坐着，我给你倒杯水。
- `$manifest.nightShell.cafePrologue.forensic.accountClueLines[5]` 你以前看过这个名字吗？

## 老方

- **固定性格：** 急躁的结果主义者
- **受压反应：** 数据越差，句子越像截止日期和命令。
- **防御动作：** 把关心包装成指标，把认可包装成下一项要求。
- **知识边界：** 只知道节目运营、后台曲线和公开播出内容，不知道案件麦外真相。

### 其他出声面

- `$manifest.nightShell.prologue.lines[1]` 老林，到屋了？你那张旧工牌怎么还压着线。跟你说正事，深夜档的数据再这么下去，就并进娱乐区。改版的事，你得想想了。
- `$manifest.nightShell.interludes[2].lines[7]` 有个自称买过婚恋课的观众私信我，说听了今晚这通，想找卖课的人退款，问我能不能帮她看看。她只肯发一页打码课纲，怕被认出来；标题和来源都遮了，只剩安全感、态度、向上社交、退出这四个词。

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
- `$manifest.nightShell.cafePrologue.cafe.cameraBreakLines[1]` 你关掉桌边录像。妻子推开椅子，表哥跟着站起来。
- `$manifest.nightShell.cafePrologue.cafe.cameraBreakLines[3]` 表哥把自己的手机举起来。屏幕上的录制计时还在走，镜头朝着窗外。
- `$manifest.nightShell.cafePrologue.aftermath.openingLines[0]` 妻子和表哥先走了。你和赵律师把男方送到停车场。半小时后，妻子发来一条语音。
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[2]` 你在微信里建了个临时群，把男方和周会计加进来，发起群语音。周会计接通后，你将男方刚发来的明细转给他。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[0]` 9 月 23 日上午，工作室没有开播。距离咖啡厅那晚已经过去三周。赵把男方带到桌边，他手里拿着昨晚收到的报告。这期间，妻子同意双方带孩子到机构，工作人员核对身份、完成现场采样。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[3]` 赵拨通张法医的视频。你把桌上的台灯转向报告，男方把纸摊平。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[6]` 男方把手机扣在桌上，手还压着，许久没有说话。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[13]` 男方点了点头，从文件袋里又抽出一张回单，递给赵。
- `$manifest.nightShell.cafePrologue.forensic.accountClueLines[2]` 赵律师打开周会计核对这份回单后发来的语音。
- `$manifest.nightShell.cafePrologue.forensic.accountClueLines[6]` 男方看着遮住的名字，没有接话。赵把回单放在鉴定报告旁边。窗外，送孩子上学的人正从楼下经过。

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
- `$manifest.nightShell.interludes[0].lines[7]` 让他把产品名字也发来，我看看是不是我手里这几款。
- `$manifest.nightShell.interludes[0].lines[8]` 他还以为有十五万呢。她这一年多，居然一直没跟他说。
- `$manifest.nightShell.interludes[0].lines[10]` 你还笑，先把汤喝了。
- `$manifest.nightShell.interludes[0].lines[11]` 那我问个不用证据的。我要是也这么爱面子、花钱没数，你会不会什么都给我买？
- `$manifest.nightShell.interludes[2].lines[2]` 你刚才说的那笔宸直，女方家买的是哪一款？
- `$manifest.nightShell.interludes[2].lines[4]` 持有页写的是九月底。合同还没发来？
- `$manifest.nightShell.interludes[2].lines[8]` 她想退课，先让她把购买记录和完整课纲发来。四个词，看不出对方到底教了什么。
- `$manifest.nightShell.interludes[2].lines[9]` 先别替人家发愁。你第一次去我家的时候，我爸妈要是先问你能拿多少，你还会来吗？
- `$manifest.nightShell.interludes[3].lines[1]` 今晚这些杯子，谁洗？
- `$manifest.nightShell.interludes[3].lines[3]` 不监督。我在门口等你。
- `$manifest.nightShell.cafePrologue.cafe.openingLines[1]` 站好，领子又卷了。大学到现在，一出门就得给你理。
- `$manifest.nightShell.cafePrologue.cafe.openingLines[8]` 孩子的事后面再说。你们愿意的话，你们也可以拍。
- `$manifest.nightShell.cafePrologue.cafe.legalClaimLines[3]` 他请我来，是想把离婚和账目的事当面说清。完整流水你愿意拿，我们就对；这些截图先留好，钱怎么算，要核完材料再谈。
- `$manifest.nightShell.cafePrologue.cafe.cameraBreakLines[5]` 那今天就先这样。也确实没什么好谈的了。
- `$manifest.nightShell.cafePrologue.aftermath.openingLines[2]` 钱的材料先留好，你发来以后我再看。
- `$manifest.nightShell.cafePrologue.aftermath.routes[0].lines[3]` 机构给你的说明和结果都留着，到时候发给我。我看过材料，再跟你谈法院那边怎么申请。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[2]` 我有个朋友是法医，姓张。我问过他了，他这会儿有空。你把报告翻到意见那一页，我接通给他看。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[8]` 你一晚上没睡吧？坐会儿，后面的事等你缓一缓再谈。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[11]` 不能直接改。你要提出亲子关系异议，就把这份意见和相关材料交给法院审查。是否还要由法院委托鉴定，得由法院决定。
- `$manifest.nightShell.cafePrologue.forensic.accountClueLines[4]` 回单我留下了。你知道这笔钱是给谁的吗？

## 周会计

- **固定性格：** 冷静的数字理性派
- **受压反应：** 听到数字不对就打断，让对方翻到对应那一页；只解释眼前真正卡住的地方。
- **防御动作：** 按日期排列，拒绝替数字添故事。
- **知识边界：** 只读材料中已经出现的账目与流程，不认定未知付款人身份。

### 其他出声面

- `$manifest.nightShell.interludes[1].lines[3]` 我从他们官网翻到的。做共享充电宝的，广告和融资稿发你了，先看它怎么收费。
- `$manifest.nightShell.interludes[1].lines[6]` 融资稿有个试点月报。租金收了三万，点位分成、维护和设备折旧加起来五万二，还没算总部的人。
- `$manifest.nightShell.interludes[1].lines[8]` 融资稿后面有张关联往来表，你往后翻。
- `$manifest.nightShell.interludes[1].lines[12]` 你问的那家平台在这页。栖行的大股东背后是同一个实控人，名下还有地产公司、资产管理公司。宣传册里说这些业务一起发展。
- `$manifest.nightShell.interludes[1].lines[14]` 租金连成本都不够，押金又拿走了。大家要是都来退，他们拿什么还？
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[3]` 老林，你这下班语音，比上班还准时。明细我收到了，五号是房贷，十八号还有一笔固定转出。
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[5]` 四个月前就结清了，跟十八号这笔对不上。
- `$manifest.nightShell.cafePrologue.aftermath.routes[1].lines[7]` ‘私教课时’。连续四个月，都是同一天、同一个数。收款人的名字没显示全。
- `$manifest.nightShell.cafePrologue.forensic.accountClueLines[3]` 我看过了。十八号那笔，收款人不是顾*。

## 张法医

- **固定性格：** 技术洁癖型理性派
- **受压反应：** 碰到来源不全的材料会停止讨论结论。
- **防御动作：** 先查链条，再谈内容。
- **知识边界：** 只判断证据链与技术可检验性，不认定关系或动机。

### 其他出声面

- `$manifest.nightShell.cafePrologue.forensic.openingLines[4]` 看得清。我先把这一句念给你听。
- `$manifest.nightShell.cafePrologue.forensic.openingLines[5]` 这次用的是到场核对身份后提取的样本，没有用那只咬胶。这份鉴定意见排除生物学父子关系。它是你们双方委托的，不是法院委托的。

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
- `$case.openingDialogue[11]` 他今晚还催，你准备怎么回他？
- `$case.sceneVersions[0].beforeVersion.lines[0]` 以前花过的钱他也要翻出来？你们平时住一起吗？钱是怎么安排的？
- `$case.sceneVersions[0].sceneCloser.lines[0]` 以前每个月都按时到？
- `$case.sceneVersions[1].beforeVersion.lines[0]` 这个月的钱没来，他怎么跟你解释的？
- `$case.sceneVersions[1].afterVersion.lines[0]` 他让你拿八万出来，却没给工资记录。把他发你的那份社保记录转到后台，我看看具体断在哪个月。
- `$case.sceneVersions[1].afterVersion.lines[3]` 停缴这两个月，他给你看过工资到账吗？
- `$case.sceneVersions[1].questionOptions[0].lines[1]` 那以前他转给你的钱呢，你打算怎么跟他说？
- `$case.sceneVersions[2].beforeVersion.lines[0]` 后台有个人说是你男朋友，发来了账单。你看看，是他的账号吗？
- `$case.sceneVersions[2].beforeVersion.lines[2]` 他不上麦，那我把他发的账单打开，姓名卡号遮掉。
- `$case.sceneVersions[2].questionOptions[0].lines[1]` 那你挑他的衣服贵，这些送你的、你们一起花的，就都不算了？
- `$case.sceneVersions[2].questionOptions[0].lines[3]` 那你自己这一年花了多少，算过吗？
- `$case.sceneVersions[2].questionOptions[0].lines[5]` 就说这几笔吧，你自己出了多少？
- `$case.sceneVersions[2].questionOptions[1].lines[1]` 你也在听吧？其余三万五的明细，还有工作和奖金的通知，能说的发来。
- `$case.sceneVersions[3].beforeVersion.lines[0]` 云栖这家店，你以前去过吗？
- `$case.sceneVersions[3].sceneCloser.lines[0]` 后台有个观众发来一张你的旧朋友圈，说以前加过你。定位是云栖，你看看。
- `$case.nightStructure.hangup.hostLine` 材料收到了。明晚把钱的用途和当初的约定一起说清楚。
- `$case.sceneVersions[0].questionOptions[0].question` 每个月转你一半，这事当初怎么说的？
- `$case.sceneVersions[0].questionOptions[1].question` 没住一起，吃饭出去玩这些，是各付各的，还是从你卡里出？
- `$case.sceneVersions[1].questionOptions[0].question` 他拿漏缴解释过去，你现在还信吗？
- `$case.sceneVersions[2].questionOptions[0].question` 云栖这顿酒水是谁点的，你平时吃饭也按这个标准？
- `$case.sceneVersions[2].questionOptions[1].question` 那剩下的三万多，他跟你说花在哪儿了吗？
- `$case.sceneVersions[3].questionOptions[0].question` 跟朋友只去过一次？

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[1]` 她一直拿共同花销解释，自己的账还没拿来。
- `$case.overnightStructure.dayScenes[0].body.beats[3]` 工资还在发就借钱投资？他图什么？
- `$case.overnightStructure.dayScenes[0].body.beats[5]` 我问问他。这笔借款，还有他说快发的奖金，都得让他自己回。
- `$case.overnightStructure.dayScenes[0].body.beats[7]` 这广告光说收益高，什么时候能拿钱倒找不着。他借的钱可是每个月都要还利息的。

### 夜 B

- `$case.sceneVersions[6].beforeVersion.lines[0]` 你还是不肯拿以前转给你的钱，对吧？
- `$case.sceneVersions[6].beforeVersion.lines[3]` 他回我了，那二十万是借来买宸直的。你说的奖金，他发来的却是离职结算通知，十万五，预计月底发。这些他跟你讲过吗？
- `$case.sceneVersions[7].beforeVersion.lines[0]` 把你们当时的聊天发来看看吧。
- `$case.sceneVersions[7].beforeVersion.lines[2]` 十四个月都转了，房租也是他另付的。这个没错吧？
- `$case.sceneVersions[7].beforeVersion.lines[4]` 他留言说，以为你至少存了十五万，才向你要八万。你让他看过余额吗？
- `$case.sceneVersions[7].testimonyWall.acts[0].decisivePresent.hostLine` 你当时明明说替两个人存着。现在钱要用了，怎么变成从没答应过？
- `$case.sceneVersions[7].testimonyWall.acts[0].inquiry.options[0].lines[1]` 他答应的是让你存着，你怎么就当成随便花了？
- `$case.sceneVersions[7].testimonyWall.acts[1].openerLines[0]` 转给你的钱，除了用于共同生活，你房租也不用出，剩下的钱呢？
- `$case.sceneVersions[7].testimonyWall.acts[1].openerLines[3]` 这是他刚发来的，你看看。
- `$case.sceneVersions[7].testimonyWall.acts[1].decisivePresent.hostLine` 那说好存着的钱呢？总不能全花在这些上面吧？
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.openingLines[0]` 转给你的钱，除了用于共同生活，你房租也不用出，剩下的钱呢？
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.openingLines[2]` 共同花的，和你自己买东西的分开说。男方，你说提醒过她少花，原话也发来。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.openingLines[4]` 这是他刚发来的，你看看。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.options[1].lines[1]` 现在接的合作，够补你花出去的这些吗？
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.options[1].lines[3]` 你自己付的饭钱，商家答应报销了吗？
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.options[1].lines[5]` 明白，钱反正已经花出去了，什么时候能见回头钱咱也不知道。
- `$case.sceneVersions[7].afterVersion.lines[0]` 那现在还留了多少？
- `$case.sceneVersions[7].afterVersion.lines[2]` 他还以为你存着十五万呢。你跟他说过没存下来吗？
- `$case.sceneVersions[7].afterVersion.lines[4]` 可钱没存下来，你也一直没告诉他啊。
- `$case.overnightStructure.linearCallback.lines[0]` 嗯，我把昨晚的聊天打开了。
- `$case.sceneVersions[6].questionOptions[0].question` 他有没有说过，为什么偏偏让你拿八万？
- `$case.sceneVersions[6].questionOptions[1].question` 他当时说过，这些钱你可以随便花吗？

### 终局

- `$case.stageJudgement` 你答应替两个人存钱，后来花了，也没告诉他。

### 其他出声面

- `$case.sceneVersions[4].questionOptions[0].lines[1]` 那你当时以为这笔钱怎么付？
- `$case.sceneVersions[4].questionOptions[0].lines[3]` 分期你签过吗？
- `$case.sceneVersions[4].sceneCloser.lines[0]` 这一万二先单独记下来。我们把整张账单重新加一遍。
- `$case.careChoices[0].hostLine` 你有什么话当着直播间直接跟他说吧。
- `$case.sceneVersions[4].entryQuestion` 那一万二买了什么？
- `$case.sceneVersions[4].casualQuestions[0].question` 你念叨探店号的时候，有没有说过缺灯、缺稳定器？
- `$case.sceneVersions[4].casualQuestions[1].question` 他说这是在投资你。你当时有没有问，这一万二怎么付？
- `$case.sceneVersions[4].questionOptions[0].question` 那套灯和稳定器，买完以后送到谁那里了？
- `$case.sceneVersions[4].questionOptions[1].question` 他说投资你。投资是送你，还是要你一起还？
- `$case.sceneVersions[4].questionOptions[2].question` 你说自己这两天才知道是分期。买的时候，你到底看了什么？
- `$case.sceneVersions[4].reviewProbes[0].question` 所以你已经辞职专门做账号了？
- `$case.sceneVersions[5].entryQuestion` 他买衣服一共五千左右。可账单里另外四万左右，都跟你有关。你开头为什么只拿衣服说事？
- `$case.sceneVersions[5].casualQuestions[0].question` 四万里有你一份。你那份当时是你先付，还是他刷完再跟你说？
- `$case.sceneVersions[5].questionOptions[0].question` 你加完还差至少三万五，这个数对不上。你当时怎么问他的？
- `$case.sceneVersions[5].questionOptions[1].question` 这三万五，你当时当他还你，还是当他又转给你花？
- `$case.sceneVersions[5].dialogueOptions[0].question` 你当时已经准备转了吗？
- `$case.sceneVersions[5].dialogueOptions[1].question` 他后来为什么又改口？
- `$case.sceneVersions[5].reviewProbes[0].question` 那剩下的钱也都是你们俩花的？

## 案一咨询者·沈

- **固定性格：** 敏感的体面维护者
- **受压反应：** 越紧张句子越长，堆很多场面细节；一说到自己收过的钱和催过的电话就突然变短。
- **防御动作：** 先把半薪说成男方自愿给花的。代存聊天出现后，承认说过存着，仍拿他以前没拦过消费来反问；承认拿不出八万，却拒报当前余额。
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
- `$case.sceneVersions[1].noClueReaction` 这个我真不知道。他当时就说奖金，我手里没有别的话。
- `$case.sceneVersions[1].afterVersion.lines[1]` 好，发过去了，就是他给我的那份。
- `$case.sceneVersions[1].afterVersion.lines[4]` 我问过他。他说工资明细太私密，停两个月只是漏缴。可八万我更觉得不该转。
- `$case.sceneVersions[1].questionOptions[0].lines[0]` 不信。他还天天说加班，有一回我说送吃的，他让我别去，说门禁严。可我不信他，就更不想拿以前给我的钱去填他的卡。
- `$case.sceneVersions[1].questionOptions[0].lines[2]` 以前给我的，我凭什么吐？他自己刷的卡，现在倒要从我这里拿回去。
- `$case.sceneVersions[2].noClueReaction` 你问哪一笔？我刚翻开账单，先看见的就是那几件男装。
- `$case.sceneVersions[2].beforeVersion.lines[1]` 是他。我把直播链接发给他了，省得我再解释。
- `$case.sceneVersions[2].questionOptions[0].lines[0]` 酒是他挑的，我还说太贵了。店是我想去的，平时探店也会去这种地方。
- `$case.sceneVersions[2].questionOptions[0].lines[2]` 一起出去又不是只有我享受。他愿意付，我还能每次抢着结账？
- `$case.sceneVersions[2].questionOptions[0].lines[4]` 我没算全年。谈恋爱谁还拿计算器啊。
- `$case.sceneVersions[2].questionOptions[0].lines[6]` 这几笔是他付的。可他当时又没拦我。
- `$case.sceneVersions[2].questionOptions[1].lines[0]` 没解释。问起来就说奖金快发了，让我先把卡还上。
- `$case.sceneVersions[2].questionOptions[1].lines[3]` 可这些是他当时愿意花的。怎么一缺钱就都要找我？
- `$case.sceneVersions[3].noClueReaction` 那晚就这些。别的我现在想不起来。
- `$case.sceneVersions[3].questionOptions[0].lines[0]` 就那一次。这跟他现在找我要钱有什么关系？
- `$case.nightStructure.hangup` 他把材料都发你了吧？那你看，我明晚再来。
- `$case.sceneVersions[0].version` 工资卡他自己拿着，每个月转我一半，已经一年多了。不住在一起，他住他的，我住我的。以前吃饭出去玩也都是他付，他从没说吃力。就是这个月没转，我才去问他。结果自己的钱没等到，他倒让我先拿八万。我就想问，之前愿意给我的，现在还能反过来逼我还吗？
- `$case.sceneVersions[1].version` 这个月那笔没来，我就问他怎么回事，他还是说奖金晚发。我不放心，才让他把工资记录发来。工资记录没发，只给了我一份从电子社保卡导出的缴费记录，说公司漏缴了两个月。我翻到最后，才发现缴费停在四月。可四月以后，他还天天跟我说加班。
- `$case.sceneVersions[2].version` 账单八万出头。男装就五千左右，一件大衣两千多，奖金都没发，还买这些。餐厅、酒店和礼物也有，都是我们一起出去的。云栖那顿纪念日晚餐最贵，主要贵在酒，店和靠窗位是我让他订的。还有一万二的拍摄设备，在我家。我没把每一笔都加起来。
- `$case.sceneVersions[3].version` 我俩第一次去那家餐厅。靠窗那排好拍照，我才让他订。认识他以前跟朋友去过一次，没别的了。

### 夜 B

- `$case.sceneVersions[6].noClueReaction` 他的事都没说清，怎么又只问我？
- `$case.sceneVersions[6].beforeVersion.lines[1]` 对。给我的时候愿意，现在不能说要就要。
- `$case.sceneVersions[6].questionOptions[0].lines[0]` 他说以前转给我的那些，留一部分也够了。可那是以前的事，谈恋爱愿意给我的，现在又拿来算。
- `$case.sceneVersions[6].questionOptions[1].lines[0]` 他又没说不许花。钱都转给我了，用的时候还得一笔笔问他？
- `$case.sceneVersions[7].beforeVersion.lines[3]` 数没错，房租也是他另外付的。
- `$case.sceneVersions[7].beforeVersion.lines[5]` 没有。我的账户干嘛天天给他看？
- `$case.sceneVersions[7].beforeVersion.lines[7]` 他连这么久以前的聊天都翻出来了？
- `$case.sceneVersions[7].testimonyWall.acts[0].decisivePresent.callerLine` 是说过存着，可也没说一分不能花啊。做脸买衣服他以前也知道，我们出去的时候他也没说不让我花。现在怎么全变成我的问题了？
- `$case.sceneVersions[7].testimonyWall.acts[0].inquiry.openingLines[0]` 可那时候又没定哪天结婚，也没规定每月必须留多少。我穿什么、去哪儿，他都知道，从前不说，现在急用了就让我全拿出来。每个月那笔我收了，可那是他给我花的。我从没答应替两个人存起来。
- `$case.sceneVersions[7].testimonyWall.acts[0].inquiry.options[0].lines[0]` 是说过存着，可也没说一分不能花啊。做脸买衣服他以前也知道，我们出去的时候他也没说不让我花。现在怎么全变成我的问题了？
- `$case.sceneVersions[7].testimonyWall.acts[0].inquiry.options[0].lines[2]` 以后一起生活又没说哪天。他现在急用了，才来抓我以前那句话。
- `$case.sceneVersions[7].testimonyWall.acts[0].inquiry.options[1].lines[0]` 没有。他不问，我也不主动报。
- `$case.sceneVersions[7].testimonyWall.acts[0].inquiry.options[2].lines[0]` 没有。他以前又没叫我往回转。
- `$case.sceneVersions[7].testimonyWall.acts[1].openerLines[1]` 一起吃喝、出去玩不都得花钱？现在怎么都来问我。
- `$case.sceneVersions[7].testimonyWall.acts[1].openerLines[4]` 他说什么就是什么？你先听我讲完。
- `$case.sceneVersions[7].testimonyWall.acts[1].decisivePresent.callerLine` 做脸、衣服、探店，哪样不要钱？我做账号，探店的钱先垫着，等合作下来就回来了。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.openingLines[1]` 一起吃喝、出去玩不都得花钱？现在怎么都来问我。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.openingLines[5]` 他说什么就是什么？你先听我讲完。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.openingLines[6]` 衣服做脸是我用的，可我跟他出去也得体面。这些也算两个人过日子的花销。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.options[0].lines[0]` 出去吃他刷得多。可做脸买衣服那些，不是饭局。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.options[1].lines[0]` 做脸、衣服、探店，哪样不要钱？我做账号，探店的钱先垫着，等合作下来就回来了。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.options[1].lines[2]` 还没。就接过几次。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.options[1].lines[4]` 大部分没有。我得先拍，账号做起来才有人找。工资不够，就用他每个月转来的。我也不能一条没接到广告，就立刻不拍了。
- `$case.sceneVersions[7].testimonyWall.acts[1].inquiry.options[2].lines[0]` 答应过啊。可买的时候，我也没觉得就多花了多少。
- `$case.sceneVersions[7].afterVersion.lines[1]` 剩多少我不想在这里报。反正八万拿不出来。我的工资也基本花完了。
- `$case.sceneVersions[7].afterVersion.lines[3]` 没说。他自己连失业都瞒着我，凭什么只问我？
- `$case.sceneVersions[7].afterVersion.lines[5]` 他愿意给我的，怎么现在都成我的错了？
- `$case.sceneVersions[6].version` 说过想投资，没说钱是借的。没钱还每天跟我说加班，找我要八万的时候又说奖金快来了。他这些都不告诉我，我凭什么先把自己的钱拿出来？
- `$case.sceneVersions[7].testimonyWall.acts[0].statements[0].text` 每个月那笔我收了，可那是他给我花的。我从没答应替两个人存起来。
- `$case.sceneVersions[7].testimonyWall.acts[0].statements[0].pressResponse` 他以前又不查账。怎么今天要用钱了，就全得躺在那儿等着他？
- `$case.sceneVersions[7].testimonyWall.acts[0].statements[1].text` 他今晚要的八万，不能因为以前花过钱就算成我欠他的。
- `$case.sceneVersions[7].testimonyWall.acts[0].statements[1].pressResponse` ‘八万不是我的卡。以前的钱……那是以前。’
- `$case.sceneVersions[7].testimonyWall.acts[0].statements[2].text` 我手里剩多少一直没给他看，因为那是我的账户。
- `$case.sceneVersions[7].testimonyWall.acts[0].statements[2].pressResponse` ‘我没给他看过余额。十五万是他自己猜的。’
- `$case.sceneVersions[7].testimonyWall.acts[1].statements[0].text` 衣服做脸是我用的，可我跟他出去也得体面。这些也算两个人过日子的花销。
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
- `$case.sceneVersions[4].questionOptions[1].missReaction` 我当时听见的就是送我做账号。一起还这件事，他没提过。
- `$case.sceneVersions[5].noClueReaction` ……这几笔我现在不想一条条念。让我先把这页看完。
- `$case.sceneVersions[5].questionOptions[1].missReaction` 我没当他还我。缺口那几笔，他当时根本没跟我报用途。
- `$case.careChoices[0].lines[0]` 反正八万我不转，之前给我的就是主动赠与。
- `$case.sceneVersions[4].version` 那一万二买的是拍视频用的灯和稳定器。他当时跟我说：“账号做起来，你就不用看别人脸色。”还说这是在投资我。我以前念叨过想做探店号，听到这句确实挺高兴，也一直以为那是他全款买来送我的。这两天看到账单，我才知道那一万二走的是分期。
- `$case.sceneVersions[4].casualQuestions[0].answer` 说过。我盯过好几个博主，老觉得差一盏灯。真要拍又总说没设备。现在灯倒是有了。
- `$case.sceneVersions[4].casualQuestions[1].answer` 没问。我只听见他要支持我做账号，觉得他认真把我的事当事。
- `$case.sceneVersions[4].questionOptions[0].guardedAnswer` 送到我这儿了，一直是我用。可他说的是给我做账号，我怎么知道他刷的是分期。
- `$case.sceneVersions[4].questionOptions[1].answer` 没有。我当时听见的是他要支持我做账号。东西送到我这儿以后，我也一直在用，可我真以为是他全款买来送我的，没想过还款会落到我头上。
- `$case.sceneVersions[4].questionOptions[2].answer` 我只看了他挑的那套设备，没看怎么付的钱。东西送到我这儿，我就用了。
- `$case.sceneVersions[4].reviewProbes[0].answer` 没辞，我现在还上班。他是这么劝我的，又不是我已经做到了。
- `$case.sceneVersions[5].version` ……这些不是全花在我一个人身上。可四万里，确实有我那一份。
- `$case.sceneVersions[5].casualQuestions[0].answer` 差不多都是他先刷。我点过菜，也让他订过靠窗。钱从哪张卡出，我当时没盯。
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

- `$manifest.nightShell.prologue.coldOpen.line` 这次先帮我顶几天，我会还你的。

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
- **受压反应：** 听到数字不对就打断，让对方翻到对应那一页；只解释眼前真正卡住的地方。
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
- `$case.openingDialogue[9]` 群里不敢发，你是怕得罪谁？
- `$case.openingDialogue[11]` 六万八是谁让你垫的？没批，还是你自己先刷的？
- `$case.sceneVersions[0].sceneCloser.lines[0]` 六万八还得临时提额，你也真敢接。
- `$case.sceneVersions[1].questionOptions[2].lines[1]` 钱压在你卡里，你还怕催急了得罪主管？
- `$case.sceneVersions[1].questionOptions[2].lines[3]` 你现在打算怎么催？下周再让你先垫呢？
- `$case.sceneVersions[2].sceneCloser.lines[0]` 把他发你的原页给我看看。
- `$case.nightStructure.hangup.hostLine` 财务怎么回的，明晚跟我说。别又只带回来这张立项图。
- `$case.sceneVersions[0].casualQuestions[0].question` 会上说能接的时候，他有没有当场定是你办？
- `$case.sceneVersions[0].casualQuestions[1].question` 他私聊让你先垫的时候，有没有说钱什么时候能报回来？
- `$case.sceneVersions[0].casualQuestions[2].question` 六万八的数，是你刷卡前就知道的？
- `$case.sceneVersions[0].questionOptions[0].question` 六万八不是小数，你当时怎么凑出来的？
- `$case.sceneVersions[1].entryQuestion` 你刚才说活动是争来的。垫这么多钱，别人也愿意？
- `$case.sceneVersions[1].casualQuestions[0].question` 上回结算有单子吗？
- `$case.sceneVersions[1].casualQuestions[1].question` 有人专门问下个月还有几场。问的是还能不能先垫，还是只问业绩怎么记？
- `$case.sceneVersions[1].casualQuestions[2].question` 主办能算业绩。签到和客户跟进，是记在垫钱的人名下吗？
- `$case.sceneVersions[1].questionOptions[0].question` 别人愿意先垫，是光算业绩，还是结算时还有钱？
- `$case.sceneVersions[1].questionOptions[1].question` 上回多出来一万二，主办能拿多少？
- `$case.sceneVersions[1].questionOptions[2].question` 那你这次六万八，他也答应多报、再分给你？
- `$case.sceneVersions[2].entryQuestion` 这六万八刷出去以后，他拿什么让你继续等？
- `$case.sceneVersions[2].casualQuestions[0].question` 你问什么时候回来，他三次都发同一张。有没有一次写过哪天付？
- `$case.sceneVersions[2].casualQuestions[1].question` 以前垫打车费，第二天就能报。这次他三次发同一张图，有没有一张是付款回单？
- `$case.sceneVersions[2].questionOptions[0].question` 你问的是付款，他一直发旧图。财务受理了没有，你直接问过吗？

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[1]` 谢了。他要还是只拿立项截图回来，今天就算白问了。
- `$case.overnightStructure.dayScenes[0].body.beats[3]` 好。晚上听听他到底问到了什么。
- `$case.overnightStructure.dayScenes[1].body.beats[1]` 以前多出来的这些钱，是谁提的？
- `$case.overnightStructure.dayScenes[1].body.beats[3]` 哪几层？
- `$case.overnightStructure.dayScenes[1].body.beats[5]` 这些也算在卖给栖行的物料价里？
- `$case.overnightStructure.dayScenes[1].body.beats[8]` 那就麻烦你找一下，看以前到底付给谁了。
- `$case.overnightStructure.dayScenes[1].body.beats[10]` 那条语音也发给小陈吧，我一起听听。
- `$case.overnightStructure.dayScenes[2].body.beats[1]` 主办为什么都要先垫？
- `$case.overnightStructure.dayScenes[2].body.beats[3]` 八万是陈这一个人的额度？
- `$case.overnightStructure.dayScenes[2].body.beats[5]` 多出来的怎么处理？
- `$case.overnightStructure.dayScenes[2].body.beats[7]` 陈，你把主管给你填的单子找出来再看一眼。
- `$case.overnightStructure.dayScenes[2].body.beats[9]` 陈，你记得再找财务的人对一下，看看主管交上去的单子到底怎么填的。晚上咱们单独聊。

### 夜 B

- `$case.sceneVersions[3].questionOptions[0].lines[1]` 把你和她们的受理页放一起，看财务究竟回了什么。
- `$case.sceneVersions[4].testimonyWall.acts[0].decisivePresent.hostLine` 财务跟你提过优先付款吗？
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.openingLines[0]` 你那六万八登记了。再看运营和维修这两张，财务有没有叫她们补材料？
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[1]` 财务跟你提过优先付款吗？
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[3]` 那不还是主管嘴上说的吗？下周他再叫你垫，你怎么办？
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[7]` 你这场都办完了，报销为什么要等下一场的钱？你不垫下一场，这笔还能不能下来？
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[1]` 比你早，材料也齐，照样没付。他答应优先，财务给过确认吗？
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[3]` 那不还是主管嘴上说的吗？下周他再叫你垫，你怎么办？
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[7]` 你这场都办完了，报销为什么要等下一场的钱？你不垫下一场，这笔还能不能下来？
- `$case.sceneVersions[4].testimonyWall.acts[0].openerLines[0]` 你那六万八登记了。再看运营和维修这两张，财务有没有叫她们补材料？
- `$case.sceneVersions[4].beforeVersion.lines[1]` 先看三张受理页。你们的钱，各卡在哪儿？
- `$case.sceneVersions[4].sceneCloser.lines[0]` 当然要催。你把草单和他说怎么分的消息一起交上去，别替他藏着。下周他还要办，就让公司先拿钱。
- `$case.overnightStructure.linearCallback.lines[0]` 就咱们两个人，你慢慢说。
- `$case.sceneVersions[3].entryQuestion` 后来问到新的情况了吗？
- `$case.sceneVersions[3].casualQuestions[0].question` 她们怎么知道你也被欠着？
- `$case.sceneVersions[3].casualQuestions[1].question` 这些受理页能给我看吗？
- `$case.sceneVersions[3].casualQuestions[2].question` 以前她们也给公司垫过钱？
- `$case.sceneVersions[3].casualQuestions[3].question` 其他部门的垫款，是这次问同事才知道的？
- `$case.sceneVersions[3].questionOptions[0].question` 主管说优先办你的，财务给你定了哪天付款？

### 终局

- `$case.stageJudgement` 六万八还没还，下场先垫钱的通知倒比付款日期来得快。又准备拿旧立项页顶一个月？

### 其他出声面

- `$case.careChoices[0].hostLine` 原件明天补上，收件记录和付款回复留好。有消息再跟我说。
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 月底结算，那具体哪天到账？他写了吗？
- `$case.overnightStructure.liveCounterBeats[1].lines[4]` 他提到八万草单了，把那页也打开。

## 第二通咨询者·陈

- **固定性格：** 想证明能扛事的焦虑新人
- **受压反应：** 害怕失去活动机会时，会搬出主管的原话自保，也会急着打听付款日期。
- **防御动作：** 先只讲业绩，后来用以前都能结和部门包干替私人分配辩护。
- **知识边界：** 知道自己垫款、主管分配和他人授权提供的受理页，不知道公司押金去了哪里。

### 夜 A

- `$case.openingDialogue[0]` 主播，我想问个工作上的事。
- `$case.openingDialogue[2]` 我替公司垫了六万八，一个月了，还没报下来。
- `$case.openingDialogue[4]` 用我的信用卡刷的。这个月还款账单都出了，钱还没回来。
- `$case.openingDialogue[6]` 招商会的场地和礼品。场地四万八，礼品两万。
- `$case.openingDialogue[8]` 我差点在公司群里问：公司报销什么时候能下来？可我没敢发。
- `$case.openingDialogue[10]` 怕影响后续给我活动。这次城市合伙人的招商会是我刚争来的。一发出去，以后铁定不让我碰客户活动了。
- `$case.openingDialogue[12]` 主管私聊让我先垫，说活动批了，费用单他来补。
- `$case.sceneVersions[0].noClueReaction` 我先说能做活动，垫钱是他后来私聊提的。
- `$case.sceneVersions[0].questionOptions[0].lines[0]` 信用卡啊，额度还不够，我又申请了临时提额。上一场都结了，我想着这回也就是周转几天。
- `$case.sceneVersions[1].noClueReaction` 业绩也要啊。可光为了业绩，哪会人人都愿意先掏钱。
- `$case.sceneVersions[1].questionOptions[0].lines[0]` 他们叫协调费，也算忙前忙后的辛苦钱。上回垫五万八，最后结了七万。
- `$case.sceneVersions[1].questionOptions[1].lines[0]` 主办拿四千，主管留八千。上回主办跟我说的，还给我看了到账。
- `$case.sceneVersions[1].questionOptions[2].lines[0]` 也按八万报，报下来分我四千。以前都能回来，我才接的。
- `$case.sceneVersions[1].questionOptions[2].lines[2]` 我就想把钱要回来，没想跟主管翻脸。以后还得在他手底下干呢。
- `$case.sceneVersions[1].questionOptions[2].lines[4]` 先私下问他。我还是想接下周的，前一笔能回来就接。进来才多久，我不想一催就把机会催没了。
- `$case.sceneVersions[2].noClueReaction` 我现在就是拿不出日期。他每次只说‘在走’。
- `$case.sceneVersions[2].casualQuestions[1].lines[0]` 没有。这么大一笔我是第一次垫。以前最多垫过打车费，第二天就能报。
- `$case.sceneVersions[2].casualQuestions[1].lines[2]` 这次六万八，他还是那张旧图。
- `$case.sceneVersions[2].questionOptions[0].lines[0]` 没问过。不是找不到财务……主管说他统一报，我怕绕过他，这四千也不好再提。
- `$case.nightStructure.hangup` 我把那三张图找齐。明天直接问财务，再问问以前办过的人。
- `$case.sceneVersions[0].version` 小会上，我当着他面说，城市合伙人的招商会我能接。别人也在争，主管说谁先把场地礼品钱安排了，客户就归谁跟。我刚进这个组，总得办出一场给他看。会后他就私聊过来：“你先把场地和礼品费垫了，这场就交给你。”六万八我也不是随手拿得出，可上一场的人已经结了，我就想着撑这几天。现在卡账单来了，他却一直叫我等，我在群里打了又删，连句什么时候付都不敢问。
- `$case.sceneVersions[0].casualQuestions[0].answer` 会上就点了个头，没当场定人。散会才私聊我。
- `$case.sceneVersions[0].casualQuestions[1].answer` 只说这场交给我。什么时候付，他当时没给日子。我信他会办，才刷的卡。
- `$case.sceneVersions[0].casualQuestions[2].answer` 知道，报价发给我了。我嫌贵，但还是想接。这么大的活动以前轮不到我。
- `$case.sceneVersions[1].version` 愿意啊，有人专门问下个月还有几场。主办能算业绩，主管也说不会让垫钱的人白忙。上回主办结完还请了我们吃饭，跟我说有机会就接，别光等公司打钱。
- `$case.sceneVersions[1].revisedVersion` 报下来的比先垫的多，我是知道的。就是没把那四千当成什么见不得人的钱。
- `$case.sceneVersions[1].casualQuestions[0].answer` 上回主办发给我的，还在聊天里。我把名字遮了发后台。
- `$case.sceneVersions[1].casualQuestions[1].answer` 问的是还能不能垫。不轮着办，谁接得起谁接。前阵子一个同事卡没还上，还问我能不能替他先刷。
- `$case.sceneVersions[1].casualQuestions[2].answer` 记主办。谁先垫、谁主办，签到和客户跟进都记他。下个月分客户也占便宜。
- `$case.sceneVersions[2].version` 活动后，我把发票照片和刷卡记录都交给主管了，原件他让我先留着。他发来一张审批页，顶上写着“审批通过”。我问什么时候回来，他又发一次。第二天再问，还是它。就这一张图，他发了三次，每次都说“流程在走”。
- `$case.sceneVersions[2].casualQuestions[0].answer` 没有。每次都是那张“审批通过”，没日子。卡账单已经来了，我才越来越慌。

### 夜 B

- `$case.sceneVersions[3].noClueReaction` 我今天才知道她们也在催。昨晚还觉得催快一点就轮到我了。
- `$case.sceneVersions[3].questionOptions[0].lines[0]` 没定，受理页还是待通知。主管让我先别催财务，说他去打招呼。我想着下周还得跟他干，就没再追问。
- `$case.sceneVersions[4].testimonyWall.acts[0].decisivePresent.callerLine` 真不用补啊？那这两笔到底在等什么？我这笔还说要补原件。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.openingLines[1]` 我没细看她们缺什么。我就想知道，我这笔到底哪天能下来。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[0]` 真不用补啊？那这两笔到底在等什么？我这笔还说要补原件。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[2]` 财务没说优先。是主管自己跟我保证的。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[4]` 现在肯定不垫。他说能先办，我就等着看钱到底到不到。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[6]` 他说：“下周招商会照排，场地礼品还是负责人先垫。下一场预收款进了公司，才有钱排你们上个月的报销；活动停了，前面的更没法结。”
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[8]` ……照他这话，活动不接着办，前面的更没法结。我以前只看见上回的人拿到了，才敢跟着垫。可我真垫出去的六万八，总不能就算了吧？
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[1].lines[0]` 没有。我只听他说打过，财务页上什么都没写。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[0]` 受理时间比我早，钱也没到。我只知道主管说先办我的。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[2]` 没有。财务只说等通知，我听到的优先都是主管说的。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[4]` 现在肯定不垫。他说能先办，我就等着看钱到底到不到。
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[6]` 他说：“下周招商会照排，场地礼品还是负责人先垫。下一场预收款进了公司，才有钱排你们上个月的报销；活动停了，前面的更没法结。”
- `$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[8]` ……照他这话，活动不接着办，前面的更没法结。我以前只看见上回的人拿到了，才敢跟着垫。可我真垫出去的六万八，总不能就算了吧？
- `$case.sceneVersions[4].testimonyWall.acts[0].openerLines[1]` 我没细看她们缺什么。我就想知道，我这笔到底哪天能下来。
- `$case.sceneVersions[4].beforeVersion.lines[0]` 她们两个人同意把受理页给你看，名字已经遮了。主管那张费用草单，我也发了。
- `$case.sceneVersions[4].sceneCloser.lines[1]` 不垫了。我现在就去群里问，六万八到底哪天付。下周谁爱接谁接，反正我不拿自己的钱了。
- `$case.sceneVersions[4].sceneCloser.lines[3]` 发了。群里一个都没回，平时催我倒挺快。
- `$case.sceneVersions[3].version` 问到了。早上我拿日期和金额去查，六万八登记着，付款日期还是待通知。财务问我外部协调的一万二给谁，我一下没答上来。中午找运营部的姐姐问，她也没收到，维修那边也有。下午她们把各自的受理页发过来，连几千块的物料费都挂着。可主管私下还说会优先办我的，让我别跟着起哄。我是真不信他了。下周又排了活动，我拿什么继续垫？
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
- `$case.overnightStructure.postures.againstCaller` 我承认想多拿四千。可六万八现在压在卡里，也是真的。
- `$case.overnightStructure.postures.withCaller` 今天拿到新的受理页了，你看完再问我。
- `$case.nightStructure.returnStance.lines.defensive` 我承认想多拿四千。可六万八现在压在卡里，也是真的。
- `$case.nightStructure.returnStance.lines.open` 今天拿到新的受理页了，你看完再问我。
- `$case.nightStructure.returnStance.lines.neutral` 我回来了，今天直接问了财务。

### 其他出声面

- `$case.careChoices[0].lines[0]` 行，知道了。这次还不见钱，肯定跟他们完不了。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 工作群刚弹出一条，是他说的。我念给你听吧。
- `$case.overnightStructure.liveCounterBeats[0].lines[1]` “各部门别单独催，费用月底一起结算，下周活动照常。谁能垫钱，活动就归谁。”
- `$case.overnightStructure.liveCounterBeats[0].lines[3]` 没写。他撤回了，还好截图截到了。
- `$case.overnightStructure.liveCounterBeats[1].lines[0]` 主管又发语音了。
- `$case.overnightStructure.liveCounterBeats[1].lines[3]` 你听听，我催个钱，他又拿以后的活动压我。

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

## 职场案供应商项目员

- **固定性格：** 不愿替客户背差额的谨慎经办
- **受压反应：** 问题越敏感越退回对公记录。
- **防御动作：** 先给自己经手的旧结算和工作语音；实际付款先问本方财务，找到回执后才经陈转来。
- **知识边界：** 亲历客户如何要求返费，保留本方旧结算与工作语音。白天尚未拿到回执；第二夜经本方财务补回去名回执，才确认旧批次三笔个人收款。看不到栖行内部报销，也不知道集团押金去向。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 小陈，你别让我证明这都是正常成本。我们卖多少货收多少钱，现在又要替你解释那一万二？
- `$case.overnightStructure.dayScenes[1].body.beats[2]` 客户提的。还不止一个人来要，我们接一批货，好几层都得算。
- `$case.overnightStructure.dayScenes[1].body.beats[4]` 招商主管要点位协调费，区域经理要渠道维护费，采购经办又要采购配合费。我把以前那张表发来，你看。
- `$case.overnightStructure.dayScenes[1].body.beats[6]` 算。不加进去，我们给谁垫？
- `$case.overnightStructure.dayScenes[1].body.beats[7]` 表是我做的。你要看到账回执的话，得等我找财务。
- `$case.overnightStructure.dayScenes[1].body.beats[9]` 当时怎么叫我们报的，工作群里还留着一条语音。我和这张三栏表一起存着。
- `$case.overnightStructure.dayScenes[1].body.beats[11]` 行，我发给小陈。“每一层的返费结完，下一批点位才往下走”，当时就是这么催我们的。回执找到了也给他。

## 职场案原部门助理

- **固定性格：** 规则型自保者
- **受压反应：** 逐字复述模板，不评价任何私聊。
- **防御动作：** 只给群模板与样本，拒绝解释人的意思。
- **知识边界：** 只掌握离职前亲自发过的活动通知、预算页及自己留的消息；离职后没有系统权限，不知当前付款状态、主管私聊和钱的去向。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[0]` 小陈，我月初就走了。走了还老有人来问。通知我当时发给你了，旧消息还在，你看日期。
- `$case.overnightStructure.dayScenes[2].body.beats[2]` 当时就是谁能垫钱，活动就归谁。费用让各部门主管并起来报。
- `$case.overnightStructure.dayScenes[2].body.beats[4]` 是这一场的部门包干预算。主办实际花了多少，还得附单。
- `$case.overnightStructure.dayScenes[2].body.beats[6]` 那你还不如当面问他。
- `$case.overnightStructure.dayScenes[2].body.beats[8]` 对，我只负责转发走流程，具体细节真别问我。

## 职场案领导

- **固定性格：** 冷硬的结果主义者
- **受压反应：** 出现流程事故时，只催项目交付和活动总结。
- **防御动作：** 把旧规矩当执行细节，只认结果和汇报。
- **知识边界：** 知道活动总结与负责人署名，不知道垫款金额、公司付款账户和供应商返利归属。

### 收麦幕间

- `$case.nightStructure.interlude.actions[1].text` 二十九号，下周一照常排下一轮活动。各部门按包干额度先顶，旧费用月底一起处理。

## 周会计

- **固定性格：** 冷静的数字理性派
- **受压反应：** 听到数字不对就打断，让对方翻到对应那一页；只解释眼前真正卡住的地方。
- **防御动作：** 按日期排列，拒绝替数字添故事。
- **知识边界：** 只读材料中已经出现的账目与流程，不认定未知付款人身份。

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 老林，你发的图我看了。昨晚问受理号是对的。他今天去查，就带刷卡日期和金额，别重新报一遍。
- `$case.overnightStructure.dayScenes[0].body.beats[2]` 让他把财务要补什么也记下来。卡在哪一步、找谁补，别只带回来一句等通知。

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
- `$case.sceneVersions[1].questionOptions[0].lines[1]` 他当面说了不是，你回去还这么讲？
- `$case.sceneVersions[2].questionOptions[0].lines[1]` 那你开头怎么说自己不知道，都是你妈先报出去的？
- `$case.nightStructure.hangup.hostLine` 你先看家里怎么说。介绍人那边也联系一下，明天把原话带来。
- `$case.sceneVersions[1].entryQuestion` 第一次正式吃饭时，本科学历说清楚了吗？
- `$case.sceneVersions[1].casualQuestions[0].question` 他说完那几句话，你当时先记住了哪一句？
- `$case.sceneVersions[1].casualQuestions[1].question` 开口问本科以前，你已经觉得那张学校图有问题了吗？
- `$case.sceneVersions[1].casualQuestions[2].question` 他承认本科不是那所以后，介绍人当时有没有把“名校毕业”圆回去？
- `$case.sceneVersions[1].casualQuestions[3].question` 服务员走了以后，你们又聊本科了吗？
- `$case.sceneVersions[1].casualQuestions[4].question` 他问审计加班的时候，你怎么说的？
- `$case.sceneVersions[1].questionOptions[0].question` 那顿饭以后，你把本科的事跟家里说了吗？
- `$case.sceneVersions[2].entryQuestion` 你回家以后是怎么跟家里说的？
- `$case.sceneVersions[2].casualQuestions[0].question` 介绍人是他妈的老同事。她说收入稳、家里省心，这些有没有让你核对过材料？
- `$case.sceneVersions[2].casualQuestions[1].question` “家里省心”这话你怎么理解？
- `$case.sceneVersions[2].casualQuestions[2].question` 你把本科说清以后，你妈妈当时怎么回的？
- `$case.sceneVersions[2].casualQuestions[3].question` 她说收入稳。有没有给过一个月多少的工资单，还是只报了这个词？
- `$case.sceneVersions[2].questionOptions[0].question` 你妈说彩礼多拿一点，你当时怎么回她的？

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[1]` 男方家这么讲，你就直接转给她家了？工资、流水，你一样都没见过？
- `$case.overnightStructure.dayScenes[0].body.beats[3]` 你还替女方说过什么？
- `$case.overnightStructure.dayScenes[0].body.beats[5]` 你知道女方家准备给她多少吗？
- `$case.overnightStructure.dayScenes[0].body.beats[7]` 她计不计较学历，你也没问啊。你就不怕两个人一见面，全对不上？
- `$case.overnightStructure.dayScenes[1].body.beats[1]` 那张工资卡，是谁挑的？
- `$case.overnightStructure.dayScenes[1].body.beats[3]` 那你当时怎么说的？
- `$case.overnightStructure.dayScenes[1].body.beats[5]` 他家里也觉得只发这一张就够了？

### 夜 B

- `$case.sceneVersions[0].questionOptions[1].lines[1]` 到今天也没回？
- `$case.sceneVersions[5].testimonyWall.acts[0].decisivePresent.hostLine` 那就问他接不接受这些条件。
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.options[1].lines[1]` 他要是只肯放共同账户，这婚还谈吗？
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.options[2].lines[1]` 他要是只肯放共同账户，这婚还谈吗？
- `$case.sceneVersions[5].beforeVersion.lines[4]` 你怎么回的？
- `$case.sceneVersions[5].beforeVersion.lines[7]` 你家的二十万可以等九月底，为什么他必须领证前转给你？
- `$case.sceneVersions[6].afterVersion.lines[1]` 她问过其他账户，你为什么一直没答？
- `$case.sceneVersions[6].questionOptions[0].lines[1]` 这六万准备什么时候拿出来？
- `$case.sceneVersions[6].questionOptions[0].lines[7]` 那婚宴和首饰呢，你准备怎么出？
- `$case.overnightStructure.linearCallback.lines[0]` 好，那咱们接着昨晚说。
- `$case.sceneVersions[0].entryQuestion` 昨晚说到查完家境就加价。他只给一张工资卡，你们后来怎么聊的？
- `$case.sceneVersions[0].casualQuestions[0].question` 如果流水上真没有这笔钱，你肯少要一点吗？
- `$case.sceneVersions[0].casualQuestions[1].question` 你把工资卡转给你妈以后，她先问的是余额够不够，还是你们相处得怎么样？
- `$case.sceneVersions[0].casualQuestions[2].question` 你妈妈看到那张工资卡的余额以后，问过这是不是他的全部账户吗？
- `$case.sceneVersions[0].casualQuestions[3].question` 你问其他账户，他怎么回的？
- `$case.sceneVersions[0].questionOptions[0].question` 昨晚你说自己也觉得该多拿一点。他说拿不出，你为什么还非要看流水？
- `$case.sceneVersions[0].questionOptions[1].question` 你觉得他留着钱，那其他账户，你后来追着问过吗？
- `$case.sceneVersions[6].entryQuestion` 他提共同账户，你先说说自己的钱准备怎么放？
- `$case.sceneVersions[6].casualQuestions[0].question` 婚宴和首饰另算。你身边有没有婚后一起管这些钱的例子？
- `$case.sceneVersions[6].questionOptions[0].question` 那你自己准备拿多少？

### 终局

- `$case.stageJudgement` 二十八万八一分不改，还得让他对外说是自己忙。人家不同意，你连不去了都要替他编一句？

### 其他出声面

- `$case.careChoices[0].hostLine` 你还要按原来的条件谈，就回去跟你父母说。他不愿意，你让他说忙也没用啊。
- `$case.overnightStructure.liveCounterBeats[0].lines[5]` 表妹发的整页我删了，只留你同意公开的那几句。你要先打电话，我们就等一会儿。
- `$case.overnightStructure.liveCounterBeats[1].lines[3]` 礼物我退回去。你要上麦，就把愿意公开谈的范围说清楚。
- `$case.overnightStructure.liveCounterBeats[1].lines[6]` 你同意按这个范围当面谈吗？
- `$case.overnightStructure.liveCounterBeats[2].lines[4]` 那你能接受怎么出？当着她说。
- `$case.overnightStructure.liveCounterBeats[2].lines[6]` 行，两边的钱都谈，你先听她说。
- `$case.sceneVersions[3].entryQuestion` 你妈妈把二十八万八递过去时，介绍人有没有问过你家准备出多少？
- `$case.sceneVersions[3].casualQuestions[0].question` 男方家的那张聊天，你以前见过吗？
- `$case.sceneVersions[3].casualQuestions[1].question` 你当时觉得介绍人偏谁？
- `$case.sceneVersions[3].questionOptions[0].question` 两边都挑好听的说，她急着把这事撮合成，是想落个人情，还是还有别的好处？
- `$case.sceneVersions[3].questionOptions[1].question` 二十八万八是介绍人加的，还是你妈妈的原话？
- `$case.sceneVersions[3].questionOptions[2].question` 介绍人只说“学校不错”。你回家时，把这句话说成了什么？
- `$case.sceneVersions[4].entryQuestion` 那顿饭以后，你又问过本科吗？
- `$case.sceneVersions[4].casualQuestions[0].question` 他解释 MBA 的时候，有没有主动把本科院校说出来？
- `$case.sceneVersions[4].casualQuestions[1].question` 你自己学历跟那张学校图对不上。你回家转述的时候，有没有把这层落差一起说？
- `$case.sceneVersions[4].casualQuestions[2].question` 学校和缴费记录，你给家里看过吗？
- `$case.sceneVersions[4].questionOptions[0].question` 只看那张学校图，能看出他本科在哪儿读吗？
- `$case.sceneVersions[4].questionOptions[1].question` 后来问清的本科和学费，你怎么告诉家里的？

## 案三咨询者·林

- **固定性格：** 把家里的婚恋规矩当成常理，重保障和面子，不觉得自己的要求需要逐条争取同意。
- **受压反应：** 问到自己出多少钱时会反问为什么总让她退让，提起家里的钱又搬出母亲的安排。
- **防御动作：** 先说彩礼是母亲定的，把家境调查说成父母替她操心；只转达金额，不说付款时点、收款账户和额外支出，也不主动计算男方已经承担的饭钱、展票、接送和倾听。
- **知识边界：** 知道 MBA 学费由男方本人承担、父母托人查到的普通家境、自己收到的材料、家庭群、完整彩礼条件和父母二十万元的预定用途；不知道对方连续收入、其他账户余额，也不知道宸直能否按约兑付。

### 夜 A

- `$case.openingDialogue[0]` 主播你好，我想请你帮我听听一件事。
- `$case.openingDialogue[2]` 我这周末本来要带相亲对象见父母。前几天他问我，二十八万八是谁定的，我才知道我妈已经先托介绍人去问了彩礼。
- `$case.openingDialogue[4]` 不知道。饭店还没订，她已经把数报出去了。上周我才告诉她，男方本科不是她以为的那所名校。
- `$case.openingDialogue[6]` 他说二十八万八拿不出来，也不能把手里的钱全拿去做彩礼。
- `$case.openingDialogue[8]` 没信。我让他打流水，他只发来一份工资账户流水。
- `$case.openingDialogue[10]` 二十八万六。
- `$case.sceneVersions[1].noClueReaction` 那顿饭已经够尴尬了。你还想问什么？
- `$case.sceneVersions[1].questionOptions[0].lines[0]` 没有。回家我还是说他是那所学校本科毕业。那时候我妈挺满意的，我没想再改口。
- `$case.sceneVersions[1].questionOptions[0].lines[2]` 介绍人那张学校图摆在那儿，谁看了不以为是本科？我总不能在饭桌上跟他查户口吧。
- `$case.sceneVersions[2].noClueReaction` 介绍人的话我就听到这些。再让我念，也还是这几句。
- `$case.sceneVersions[2].questionOptions[0].lines[0]` 我当时也觉得他该多拿一点。这个数是我妈提的……但我只说别把人吓跑，没让她撤回二十八万八。
- `$case.sceneVersions[2].questionOptions[0].lines[2]` 数是她先报的啊。我后来觉得可以，又不等于我让她去加的。
- `$case.nightStructure.hangup` 家里群一直在 @ 我。最上面那几句……我得自己再看一遍。今晚先到这儿吧，明天我回来。
- `$case.sceneVersions[1].version` 第一次正式吃饭，介绍人订了窗边。他先问我审计是不是总加班，我问他平时出差多不多。吃到一半，我还是问了：“你发的材料是那所学校，本科也是在那儿读的吗？”他筷子停了一下，才说：“本科不是。我工作以后去读的 MBA，学费二十三万八，是我自己出的。”正好服务员来添水，我没有接着问，之前那句“名校毕业”到底是谁说出来的。
- `$case.sceneVersions[1].casualQuestions[0].answer` 学费。二十三万八。我脑子里先过的是这个数，本科那句反而没追下去。
- `$case.sceneVersions[1].casualQuestions[1].answer` 还没有。我只是想把介绍人那句“学校好”问得具体一点。结果他一停，我才觉得这事可能没说全。
- `$case.sceneVersions[1].casualQuestions[2].answer` 没有。服务员来添水，话就断了。他付的账，用了团购券和积分。学历那句，谁都没再捡起来。
- `$case.sceneVersions[1].casualQuestions[3].answer` 没有。他说菜快凉了，我也就跟着聊别的。那顿饭是我催着约的，我也怕当场问僵。
- `$case.sceneVersions[1].casualQuestions[4].answer` 我说忙季是要加班，平常还好。
- `$case.sceneVersions[2].version` 其实“名校毕业”最早也不是他说的。介绍人跟我家说的是：“学校好、收入稳，家里也省心。”我回去以后，把“学校好”说成了“名校毕业”。我是说得顺了一点，也没想到家里会按本科去听。 我爸妈后来托人查了他家。我妈说：“他父母都是普通上班的，老家那套房自己要住，婚房也帮不上，以后真有事还得你们自己扛，彩礼就多问一点，至少钱先在你手里。”
- `$case.sceneVersions[2].casualQuestions[0].answer` 没有。他妈的老同事，话肯定挑好的说，这我懂。可收入稳那句，我当时没要材料。
- `$case.sceneVersions[2].casualQuestions[1].answer` 就是独生子，爸妈有退休金，平时不用他贴钱。我妈一听这四个字，后面都没细问。
- `$case.sceneVersions[2].casualQuestions[2].answer` 她先怪我没问清，又托人问他家里的情况。知道婚房帮不上以后，就说彩礼得多留一点。
- `$case.sceneVersions[2].casualQuestions[3].answer` 没有。她说工作稳，我就没再问具体数字。

### 夜 B

- `$case.sceneVersions[0].noClueReaction` 我妈怎么想，你得问她。她没跟我解释。
- `$case.sceneVersions[0].questionOptions[0].lines[0]` 他只甩一句拿不出，我怎么信？总得让我看到诚意。条件我不想改，不然我妈那边也没法说。
- `$case.sceneVersions[0].questionOptions[1].lines[0]` 问过，他没回。我才觉得奇怪，给得出这张，就给不出别的？
- `$case.sceneVersions[0].questionOptions[1].lines[2]` 没有。你看，问我的时候谁都挺来劲，他不答就过去了。
- `$case.sceneVersions[5].testimonyWall.acts[0].decisivePresent.callerLine` 两千倒不至于掏不出来吧。行，你说卡上看不出，我就问他本人，他到底肯不肯。
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.openingLines[0]` 就差两千，我当然会往态度上想。钱先到我自己卡里，两家才好往下谈。不然等领了证，他变卦怎么办？
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.options[0].lines[0]` 没问。我要先放自己卡里，也是怕婚后说不清。
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.options[1].lines[0]` 共同账户我不接受。彩礼得先进我自己卡，不答应这个，我怎么往下谈？
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.options[1].lines[2]` 那就让他再想想。我都说了，彩礼要给我的，这个也要我让？
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.options[2].lines[0]` 他就说拿不出，没报具体能给多少。我要的还是二十八万八，先进我的卡，共同账户我不接受。
- `$case.sceneVersions[5].testimonyWall.acts[0].inquiry.options[2].lines[2]` 那就让他再想想。我都说了，彩礼要给我的，这个也要我让？
- `$case.sceneVersions[5].beforeVersion.lines[0]` 家里那几句我自己截好了，发给你们了，可以念。别把整页都放出去。
- `$case.sceneVersions[5].beforeVersion.lines[1]` 今天下午，介绍人又来问我。
- `$case.sceneVersions[5].beforeVersion.lines[3]` 男方家想知道，我家除了要二十八万八，准备给我多少。
- `$case.sceneVersions[5].beforeVersion.lines[5]` 我说我家也出二十万，她又问什么时候到。我爸都答应了，还得一天追着问啊？
- `$case.sceneVersions[5].beforeVersion.lines[8]` 那是我爸啊。他是还没领证的相亲对象，能一样吗？二十八万八，我妈说了，我也同意。工资卡都二十八万六了，就差两千，他一直跟我磨。
- `$case.sceneVersions[6].noClueReaction` 他怎么花钱，我有我的感受。你别一句话替我算完。
- `$case.sceneVersions[6].afterVersion.lines[0]` 可你老问我的钱，自己的其他账户还是没给我看啊。
- `$case.sceneVersions[6].questionOptions[0].lines[0]` 我现在有八万四，最多拿六万。剩下的我得留点。
- `$case.sceneVersions[6].questionOptions[0].lines[2]` 领证以后啊，添家电、搬家总要花钱。
- `$case.sceneVersions[6].questionOptions[0].lines[4]` 那是我爸给我的。怎么一到账就得算我们俩的？
- `$case.sceneVersions[6].questionOptions[0].lines[6]` 彩礼本来就是给女方的。我爸给我的，又不是彩礼。
- `$case.sceneVersions[6].questionOptions[0].lines[8]` 他家出吧。我一直以为是这样办的。
- `$case.sceneVersions[6].questionOptions[0].lines[10]` 平时吃饭、买展票都是你付，我就以为你也这么想。你来接我下班的时候，也没跟我算过这些啊。
- `$case.sceneVersions[6].questionOptions[0].lines[12]` 行，那现在商量嘛。干嘛说得像我故意占你便宜一样。
- `$case.sceneVersions[0].version` 他已经说拿不出，我还是让他打了流水。发来以后，我先问：“只有这一张？”过了十几分钟，他才回：“你不是要看收入吗？工资卡最清楚。”我又问其他账户，他没接；到昨晚，我手里就这一张。我把这张转给我妈，她看过。
- `$case.sceneVersions[0].casualQuestions[0].answer` 我不信就差两千他都拿不出。我们见过四次，他平时又不像没钱的人。
- `$case.sceneVersions[0].casualQuestions[1].answer` 先盯着数。她比我急。我 28，虚岁 29，她逢人就说我不挑，其实是她挑。上个月她把我照片发给三个介绍人，像素还调高了。我说妈，你这是发简历呢。她说简历怎么了，你爸当年也是我筛出来的。……她真这么说。我当时半天没接上。
- `$case.sceneVersions[0].casualQuestions[2].answer` 没有。她只盯着二十八万六，说跟她要的就差两千。
- `$case.sceneVersions[0].casualQuestions[3].answer` 他没回，后来也没再给我发别的。
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[0].text` 我家规矩就是先看他愿不愿意拿出来。他工资卡有二十八万六，只差两千，不是拿不出，就是不肯。
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[0].pressResponse` ‘就差两千。你让我怎么不往态度上想？’
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[1].text` 我问别的账户他不答，你们怎么不催他？
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[1].pressResponse` ‘别的账户我不知道。可这张卡上的二十八万六总是真的。’
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[2].text` 我妈要他领证前把二十八万八打进我卡，婚宴首饰另算，这就是她开出的条件。
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[2].pressResponse` ‘领证前进我卡，婚宴首饰另算。是我家开的条件，我没说他答应了。’
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[3].text` 我爸都答应二十万了，就等到九月底，有那么难等吗？
- `$case.sceneVersions[5].testimonyWall.acts[0].statements[3].pressResponse` ‘九月底以后，给我留着。现在确实还没到。’
- `$case.sceneVersions[6].version` 我自己也会出钱啊。又不是结了婚就什么都让他掏。
- `$case.sceneVersions[6].casualQuestions[0].answer` 我表姐家就是一起管。可她挣得比姐夫多，跟我们又不一样。我不想结了婚，连给自己买点东西都得商量。
- `$case.overnightStructure.postures.againstCaller` 二十八万八是我妈定的，我知道以后没叫停。今晚我自己答。
- `$case.overnightStructure.postures.withCaller` 我又看了家里群。他们到现在还觉得我没错。你要问就问吧。
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
- `$case.sceneVersions[4].casualQuestions[0].answer` 没有。校名和项目名，他一口气就说完了。问到本科，他才停了一下。
- `$case.sceneVersions[4].casualQuestions[1].answer` 没说我自己。我普通一本。我妈听见他名校毕业以后，逢人就说我眼光好。我没纠正，可能也舍不得她把这句收回去。
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

- `$case.sceneVersions[6].afterVersion.lines[2]` 我就是不想给她看别的卡。我妈让我发工资卡，我觉得这张就够了。其他账户我不公开，难道我都给她看了，她就肯改条件？
- `$case.sceneVersions[6].questionOptions[0].lines[3]` 那你爸说的二十万呢？
- `$case.sceneVersions[6].questionOptions[0].lines[5]` 我的就得领证前打进你的卡，你家的你自己留着？
- `$case.sceneVersions[6].questionOptions[0].lines[9]` 你问过我家没有？你这边倒给我安排好了。
- `$case.sceneVersions[6].questionOptions[0].lines[11]` 吃顿饭跟办婚礼能一样吗？

### 后台／材料回流

- `$case.respondentNote.text` 学校页、MBA 缴费和工资卡是我发的，你们可以问。别的账户我没给她，那些账户的情况也不想在直播里说。当时她要看收入，我就挑了工资卡，其他账户她问了，我没有回。饭、展票、接她下班，是我愿意做，不是因为我家境普通就欠她。卡上有二十八万六，也不代表我要拿二十八万八，更不代表后面婚宴首饰都我出。

### 其他出声面

- `$case.overnightStructure.liveCounterBeats[1].lines[1]` 我是她说的那个人。介绍人把直播片段转给我了，我才进来的。礼物你先收着。
- `$case.overnightStructure.liveCounterBeats[1].lines[2]` 我只问一句：你家要我领证前把二十八万八打进你的卡，你爸答应你的二十万却要等到九月底，宸直那三十万到期，拿到以后还说是留给你自己的。这些话，你有没有一起告诉我？
- `$case.overnightStructure.liveCounterBeats[1].lines[5]` 学校、学费、工资卡和彩礼可以说，其他账户不公开。她家就谈已经同意公开的那几句。
- `$case.overnightStructure.liveCounterBeats[2].lines[1]` 我说拿不出来，你就让我打流水。打了又问还有没有别的卡。我现在最烦的就是这个，给你看多少才算完？
- `$case.overnightStructure.liveCounterBeats[2].lines[3]` 我说拿不出，不是差那两千，是我不接受领证前全打进她个人卡里。你们别再拿那张工资卡——
- `$case.overnightStructure.liveCounterBeats[2].lines[5]` 行。二十八万八真要谈，就放共同账户。她家九月底那笔怎么放、婚宴和首饰谁出，也一起写清。只让我先打进她卡里，我不接受。
- `$case.overnightStructure.liveCounterBeats[3].lines[0]` 周末的饭先取消吧。我回去跟我爸妈说，你也跟你家里说。我不想带着二十八万八去见你父母。
- `$case.overnightStructure.liveCounterBeats[3].lines[2]` 我不忙。我不接受刚才那几条，为什么不能照实说？
- `$case.overnightStructure.liveCounterBeats[3].lines[4]` 那二十八万八进你卡这条，你准备改吗？
- `$case.overnightStructure.liveCounterBeats[3].lines[6]` 可我真不是因为忙。你让我撒这个谎，下次见面怎么办？

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
- `$case.overnightStructure.dayScenes[0].body.beats[8]` 我想着见了面，觉得人不错，这些就好谈了。谁知道两家连饭店都没订，就吵成这样。

### 后台／材料回流

- `$case.investigationHooks[1].material` 介绍人留言：“‘收入稳’是听男方家说完，我顺嘴夸的；‘她不太计较学历’，我也没问过本人。二十八万八是她妈妈让我原话问的。我当时只想着先把人约到桌上，没拦，也没让两个孩子先谈。”

## 案三男方表姐

- **固定性格：** 护家的感性防守者
- **受压反应：** 先拒答；确认只问资料整理后才给半句。
- **防御动作：** 说明自己参与的选卡过程；拒答其他账户和表弟愿意支付的金额。
- **知识边界：** 在家里群亲历选卡过程，知道自己提醒过表弟说明仅为工资账户，也知道学费由他自付；不知道他的其他账户和女方家的宸直情况。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 怎么又把我扯进来了？我就帮他看过那几张材料。他的学费是自己交的，回单他也答应给你们看。
- `$case.overnightStructure.dayScenes[1].body.beats[2]` 他在家里群问过该发哪张。姑姑说工资卡最规整，别的卡不用给。他就照着发了。
- `$case.overnightStructure.dayScenes[1].body.beats[4]` 我说问收入就发工资卡呗。可她后来问别的卡，我让他自己回。他倒好，又把问题转给我。
- `$case.overnightStructure.dayScenes[1].body.beats[6]` 姑姑就是这么想的，给人家看了工资还不够？我说人家现在问的是结婚拿多少钱，你光给一张卡有什么用。他愿意拿多少，还得他自己开口。
- `$case.overnightStructure.dayScenes[1].body.beats[7]` 你们晚上聊的时候，让他自己把话说明白。别又让他转给我，我也不知道他另外存了多少。

## 小林老师

- **固定性格：** 热络的感性现实派
- **受压反应：** 同行被一概骂时会反驳，也会埋怨具体介绍人把事情办坏了。
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

- `$case.openingDialogue[2]` 你在的，请讲。
- `$case.openingDialogue[4]` 他是谁？
- `$case.openingDialogue[6]` 你们是什么关系？
- `$case.openingDialogue[8]` 名单上写了什么？
- `$case.openingDialogue[10]` 钱是什么钱，怎么给他的？
- `$case.openingDialogue[12]` 行。那名单你是怎么看见的？
- `$case.openingDialogue[14]` 把名单发过来，名字遮掉。
- `$case.sceneVersions[0].questionOptions[0].lines[1]` 每一行都在同一个地方断。这不是截急了，是你自己裁的吧？
- `$case.sceneVersions[2].questionOptions[0].lines[1]` 你要把钱追回来，那半张总得拿出来吧。
- `$case.sceneVersions[2].sceneCloser.lines[1]` 行，那说说你们俩。
- `$case.sceneVersions[3].questionOptions[0].lines[1]` 就这一句？
- `$case.sceneVersions[3].questionOptions[0].lines[3]` 我就想问，这个高息跟你转给他的钱有没有关系？
- `$case.nightStructure.hangup.hostLine` 我听见敲门了。你先确认安全，方便的时候给后台留句话。
- `$case.sceneVersions[0].entryQuestion` 你怎么确定名单上的名字都是他在谈的人？
- `$case.sceneVersions[0].casualQuestions[0].question` 你发来的图，是整屏截的，还是先框了一块？
- `$case.sceneVersions[0].casualQuestions[1].question` 一排名字全是女的。你当时是按女朋友数的，还是按客人？
- `$case.sceneVersions[0].casualQuestions[2].question` 你按灭屏幕以前，有没有把右边几列一起截进去？
- `$case.sceneVersions[0].casualQuestions[3].question` 亲密度这一栏，Tony 有没有说过是按女朋友排的？
- `$case.sceneVersions[0].casualQuestions[4].question` 你看到自己那一行时，右边那些钱数也在吗？
- `$case.sceneVersions[0].questionOptions[0].question` 你发来的图，每一行怎么都在右边同一个地方断了？
- `$case.sceneVersions[0].questionOptions[1].question` 你看到亲密度那栏，最在意哪一行？
- `$case.sceneVersions[1].entryQuestion` 你们俩是怎么走到一起的？
- `$case.sceneVersions[1].casualQuestions[0].question` 他叫你自己人、留晚档。你当时有没有问过，店里别人是不是也这样？
- `$case.sceneVersions[1].casualQuestions[1].question` 你固定找他，是因为手艺，还是因为他把最晚那档留给你？
- `$case.sceneVersions[1].casualQuestions[2].question` 他有没有当着别人维护过你？
- `$case.sceneVersions[1].casualQuestions[3].question` 最晚那档他给你留了多久，是从第一次剪头就开始，还是后来才有？
- `$case.sceneVersions[1].casualQuestions[4].question` 约会也是真的。第一次吃饭，是你下班去等他，还是他收店后来找你？
- `$case.sceneVersions[1].casualQuestions[5].question` 叫你自己人的时候，是当着客人，还是私下发语音？
- `$case.sceneVersions[1].casualQuestions[6].question` 他总给你留最晚那档。留号的时候，有没有说过只给你留？
- `$case.sceneVersions[1].casualQuestions[7].question` 他叫你自己人时，你怎么回的？
- `$case.sceneVersions[1].questionOptions[0].question` 名单上其他人，你见过谁跟他约会吗？
- `$case.sceneVersions[2].entryQuestion` 你裁掉的右半边，写的是什么？
- `$case.sceneVersions[2].casualQuestions[0].question` 小姐妹为什么让你留原图？
- `$case.sceneVersions[2].casualQuestions[1].question` 你裁图的时候，知道右边跟钱有关吗？
- `$case.sceneVersions[2].casualQuestions[2].question` 你说名字和亲密度还不够，她后来回你了吗？
- `$case.sceneVersions[2].casualQuestions[3].question` 没发的那几列，原图还留着吗？
- `$case.sceneVersions[2].casualQuestions[4].question` 她没回以后，你还问过她吗？
- `$case.sceneVersions[2].questionOptions[0].question` 跟钱有关的几列，为什么偏偏没发过来？
- `$case.sceneVersions[3].entryQuestion` 小姐妹让你留原图，她之前跟你聊过钱的事吗？
- `$case.sceneVersions[3].casualQuestions[0].question` 她说利息挺高。有没有说过起投要多少，还是只报了息？
- `$case.sceneVersions[3].casualQuestions[1].question` 你只记住息挺高。当时有没有问，是谁在卖、要从哪转？
- `$case.sceneVersions[3].casualQuestions[2].question` 她提这一嘴的时候，有没有把产品和 Tony 的店放在一起说？
- `$case.sceneVersions[3].questionOptions[0].question` 小姐妹当时到底跟你说了多少？

### 白天

- `$case.overnightStructure.dayScenes[0].body.beats[1]` 你当时怎么跟她说的？
- `$case.overnightStructure.dayScenes[0].body.beats[3]` 你说了不够，她就不问了？
- `$case.overnightStructure.dayScenes[0].body.beats[5]` 后来你们还聊过这个产品吗？
- `$case.overnightStructure.dayScenes[1].body.beats[1]` 如果钱先转到别人户头，再由他来买呢？

### 夜 B

- `$case.sceneVersions[4].questionOptions[0].lines[1]` 高息也是这个小姐妹告诉你的？
- `$case.sceneVersions[5].questionOptions[0].lines[1]` 这句话你们聊天里留着吗？
- `$case.sceneVersions[6].beforeVersion.lines[0]` 名单上的周呢，她到底是来剪头的，还是你说的那种女朋友？
- `$case.sceneVersions[6].beforeVersion.lines[2]` 这两列你昨晚就看见了。
- `$case.sceneVersions[6].testimonyWall.acts[0].decisivePresent.hostLine` 留晚档、陪你聊天，这些你说过了。代投的聊天也已经在这儿，不能省掉。他对合同和退钱到底怎么答的？
- `$case.sceneVersions[6].testimonyWall.acts[0].inquiry.openingLines[0]` 那就把你们谈买东西的聊天也放出来，从转钱之前看。
- `$case.sceneVersions[6].testimonyWall.acts[0].inquiry.options[1].lines[1]` 那几句是你自己发的。要钱就得删掉？
- `$case.sceneVersions[6].testimonyWall.acts[1].decisivePresent.hostLine` 十二万收得挺痛快，问个合同倒嫌你催了？
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.options[1].lines[1]` 没买成又不肯退，他总得告诉你钱在哪儿吧？光发个“已提交”就完了？
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.options[2].lines[1]` 合同催过没有，退钱的日期他给了吗？
- `$case.sceneVersions[6].sceneCloser.lines[1]` 合同拿不到就继续找他要，别再往里转了。
- `$case.overnightStructure.linearCallback.lines[1]` 没事就好。材料我收到了。
- `$case.sceneVersions[4].entryQuestion` 昨晚后来怎么样，你先说吧。
- `$case.sceneVersions[4].casualQuestions[0].question` 他们核实的是你自己那笔借款，还是也问了 Tony 这十二万？
- `$case.sceneVersions[4].questionOptions[0].question` 十二万已经转过去了，什么事让你开始怕拿不回来？
- `$case.sceneVersions[5].entryQuestion` 你补来的转账我看了，十二万，怎么到他手里的？
- `$case.sceneVersions[5].casualQuestions[0].question` 走他的户，你想过以后要找谁要钱吗？
- `$case.sceneVersions[5].casualQuestions[1].question` 你当时想过自己凑够一百万再买吗？
- `$case.sceneVersions[5].casualQuestions[2].question` 他又对你好。十二万转出去以前，染发护理这些，是你自己结，还是记在他账上？
- `$case.sceneVersions[5].casualQuestions[3].question` 转完以后，你还当自己在跟他谈吗？
- `$case.sceneVersions[5].questionOptions[0].question` 你说并进他的户。他当时是怎么保证这十二万能算到你头上的？

### 终局

- `$case.stageJudgement` 店里忙着发函划清业务，Tony 还没把合同回单给她。十二万收走了，总得有人回答买成了什么吧。

### 其他出声面

- `$case.careChoices[0].hostLine` 他回了消息再来。
- `$case.overnightStructure.liveCounterBeats[0].lines[0]` 周发来的那几张图，你手里也有吗？
- `$case.overnightStructure.liveCounterBeats[0].lines[2]` 你能确定回单就是她转的那一百万吗？
- `$case.overnightStructure.liveCounterBeats[1].choices[0].lines[1]` 函是店里寄给平台的。行，收钱的是 Tony，那就请他本人把合同拿出来。

## 第四通咨询者·何

- **固定性格：** 渴望被尊重的社交型人格
- **受压反应：** 引用他的原话前会停；别人拿酒吧工作定性她时立刻变硬；问到自己花过多少钱时不再铺垫。
- **防御动作：** 第一夜只砸裁过的名单和要钱，把左半张图读成女友名册；问到恋爱就承认他帅、自己也要这个位置。敲门时突然下线，不说警察是因涉案放款人来核实。开场不说十二万是自己让他代投。
- **知识边界：** 知道自己的聊天、十二万转账、不够一百万起投、走他户的口头约定，也知道高息是自己先在酒吧听说的，并知道自己向放贷人借过钱。第二夜知道周是剪头客户并见过她转发的认购回单。她没有合同原件，不知道十二万是否已经买成宸直，也不知道 Tony 有没有代销资格；不知道警察把她当证人还是另有调查。

### 夜 A

- `$case.openingDialogue[1]` 主播，我在线上吗？
- `$case.openingDialogue[3]` 我昨晚在一个男的手机里看见张名单，上面全是女的。我一晚上没睡。
- `$case.openingDialogue[5]` 给我剪头的那个，我平时叫他 Tony。我今天轮休，现在在家。一直没敢找他。
- `$case.openingDialogue[7]` 在谈，没公开过。他一直叫我自己人。
- `$case.openingDialogue[9]` 亲密度、下次约，一排女人的名字。越看越不对。我当时就觉得，他是不是拿谈恋爱吊着一串人。而且我还有一笔钱在他那里。
- `$case.openingDialogue[11]` 你先听这张名单行不行？钱我会讲。我就想知道，他是不是对谁都这样。
- `$case.openingDialogue[13]` 他去洗澡，手机亮着，备忘录没锁。
- `$case.openingDialogue[15]` 我已经发后台了。那笔钱，我就是想拿回来。
- `$case.sceneVersions[0].noClueReaction` 名单上的人我不认识。我只能说我那一行。
- `$case.sceneVersions[0].casualQuestions[1].lines[0]` 我数过，八……不对，九个。
- `$case.sceneVersions[0].casualQuestions[1].lines[2]` 连我。
- `$case.sceneVersions[0].questionOptions[0].lines[0]` 截得急……我就先发了我最在意的那半边。
- `$case.sceneVersions[0].questionOptions[0].lines[2]` ……我裁过。右边几列没发。
- `$case.sceneVersions[1].noClueReaction` 他就是这么叫的。别的我现在不想说。
- `$case.sceneVersions[1].casualQuestions[6].lines[0]` 没说过只给我。
- `$case.sceneVersions[1].casualQuestions[6].lines[2]` 他自己说二十九，晚档也确实留了。
- `$case.sceneVersions[1].questionOptions[0].lines[0]` 我又不可能天天跟着他。可他也给别人留晚档、叫自己人，我看着就恶心。
- `$case.sceneVersions[2].noClueReaction` 右边我没发，我承认。先看我发来的这半张行不行？
- `$case.sceneVersions[2].questionOptions[0].lines[0]` 那几列是钱的事。我想先说他怎么对我，放一起，你们又要先问我为什么转钱。
- `$case.sceneVersions[2].questionOptions[0].lines[2]` 我会发。可他叫自己人、留晚档，那些也不是我编的啊。
- `$case.sceneVersions[3].noClueReaction` 她就提过一句。那晚还有谁，我不想说。
- `$case.sceneVersions[3].sceneCloser.lines[1]` 等一下。
- `$case.sceneVersions[3].sceneCloser.lines[3]` 我先去看看。
- `$case.sceneVersions[3].questionOptions[0].lines[0]` 她说有个东西利息高。
- `$case.sceneVersions[3].questionOptions[0].lines[2]` 她还说，不是我手里那点钱能买的。你别问着问着，又成我自己的问题了。
- `$case.sceneVersions[3].questionOptions[0].lines[4]` 听过收益高就算我该知道？我昨晚看见一排女人才觉得不对，你别又全问钱。
- `$case.nightStructure.hangup` 我这边真有事。明天再说。
- `$case.sceneVersions[0].version` 我往下划，一排名字，全是女的。备注写着亲密度、下次约。我那行也在。我把截图发到后台了，钱还在他那儿，我才打进来。
- `$case.sceneVersions[0].revisedVersion` 我看到的名字都是女的。我发的确实只有左半边。
- `$case.sceneVersions[0].casualQuestions[0].answer` 我框过。发给你们的是左边名字和亲密度。
- `$case.sceneVersions[0].casualQuestions[2].answer` 没有。我截的是左边。他出来还问我晚上吃什么。
- `$case.sceneVersions[0].casualQuestions[3].answer` 没有。我看到那些备注，就觉得他跟这些人都不一般。
- `$case.sceneVersions[0].casualQuestions[4].answer` 在。但我发给小姐妹的只有左半边。
- `$case.sceneVersions[0].questionOptions[1].answer` 我自己的。他平时把我当自己人，手机里倒跟别的女人排在一起了。
- `$case.sceneVersions[1].version` 我一开始就觉得他长得好看，他总给我留最晚那档，也叫我自己人。约会也是真的，不是只有剪头的时候见。
- `$case.sceneVersions[1].revisedVersion` 我确实想跟他谈。他没带我见朋友，我就一直没追问。可自己人是他叫的，晚档他也留了。
- `$case.sceneVersions[1].casualQuestions[0].answer` 没问。同事推荐我去剪头，只说技术好。我第一次去就觉得他长得好看，后来一直找他。
- `$case.sceneVersions[1].casualQuestions[1].answer` 两样都有。手艺好，我上班时间跟别人不太一样，经常要见人，头发隔一阵就得弄。他肯给我留最晚的号。
- `$case.sceneVersions[1].casualQuestions[2].answer` 旁边有个客人说，女孩子半夜下班不像正经工作。他当场回了一句：“人家上自己的班，关你什么事。”我那时候真挺感激他的。
- `$case.sceneVersions[1].casualQuestions[3].answer` 一年多。最开始就是普通剪头，最近几个月才越走越近。
- `$case.sceneVersions[1].casualQuestions[4].answer` 他收店后来找我。大概三个月前，我也刚下班，就在旁边吃了碗面。后来又吃过两次。
- `$case.sceneVersions[1].casualQuestions[5].answer` 私下也有。有次他说店长又骂他了，最后来一句：“也就你肯听我说这些。”那条语音我一直留着。
- `$case.sceneVersions[1].casualQuestions[7].answer` 我回他，有事就找我。我也想跟他多聊一会儿。
- `$case.sceneVersions[2].version` 右边记的是钱。我没把那几列发给你们。小姐妹让我把原图留好，我跟她说，名字和亲密度还不够吗？她没理我。
- `$case.sceneVersions[2].casualQuestions[0].answer` 她只说别光留名字，原图别删。我问她什么意思，她说等见面再讲。
- `$case.sceneVersions[2].casualQuestions[1].answer` 知道。可我当时就想先让你们看他怎么记这些女的。
- `$case.sceneVersions[2].casualQuestions[2].answer` 没再回。前面她只让我把原图留好。
- `$case.sceneVersions[2].casualQuestions[3].answer` 留着，我只是没截进去。
- `$case.sceneVersions[2].casualQuestions[4].answer` 没有，我就来找你了。
- `$case.sceneVersions[3].version` 听过。小姐妹提过一嘴，说有个东西利息挺高。我当时就听了个热闹，没跟她细问。
- `$case.sceneVersions[3].casualQuestions[0].answer` 说过我那点钱不够。我当时也没问到底差多少，觉得跟我没什么关系。
- `$case.sceneVersions[3].casualQuestions[1].answer` 没问。她随口一说，我也没当场追着问。我只记住息挺高。
- `$case.sceneVersions[3].casualQuestions[2].answer` 没有。是在外面聚会时听的。具体在哪儿，我不想在直播里说。

### 夜 B

- `$case.sceneVersions[4].noClueReaction` 我现在就想拿回那十二万，别又扯到其他借款上。
- `$case.sceneVersions[4].questionOptions[0].lines[0]` 小姐妹说，那个产品赎回在排队，让我别再转。我越想越怕，才去翻他的手机。结果钱没找着，看见那么一排名单。
- `$case.sceneVersions[4].questionOptions[0].lines[2]` 对。我在酒吧做营销，订台卖酒，她在酒桌上跟我说的。Tony 没先给我讲这个，是我后来去问他。
- `$case.sceneVersions[5].noClueReaction` 我跟他在一起的时候，他对我真的挺好的。你不能因为这笔钱就说那些全是假的。
- `$case.sceneVersions[5].questionOptions[0].lines[0]` 他说聊天转账都留着，钱不会不认。
- `$case.sceneVersions[5].questionOptions[0].lines[2]` 留着。是我先发的“帮我买”，他才回这些。转账记录我也有。
- `$case.sceneVersions[6].beforeVersion.lines[1]` ……来剪头的。她那行没有亲密度，只有一百万和已买。
- `$case.sceneVersions[6].beforeVersion.lines[3]` 看见了。一百万就一定只是客户了？他把亲密度跟钱记在一张表上，你不觉得更恶心吗？
- `$case.sceneVersions[6].testimonyWall.acts[0].decisivePresent.callerLine` 我找他帮忙，是因为我跟他那种关系。你把代投两个字摆出来，好像我跟他只剩买卖了，那他哄我的话就不算了？
- `$case.sceneVersions[6].testimonyWall.acts[0].inquiry.openingLines[1]` 那段能不能别一上来就放？你一说“帮我买”，大家肯定觉得全是我自己活该。
- `$case.sceneVersions[6].testimonyWall.acts[0].inquiry.options[0].lines[0]` 写的是帮我买。可我跟他那种关系，才肯转。
- `$case.sceneVersions[6].testimonyWall.acts[0].inquiry.options[1].lines[0]` 我找他帮忙，是因为我跟他那种关系。你把代投两个字摆出来，好像我跟他只剩买卖了，那他哄我的话就不算了？
- `$case.sceneVersions[6].testimonyWall.acts[0].inquiry.options[1].lines[2]` 是我先说要买的，可他要不跟我谈恋爱，我会把钱交给他？这层关系你也得说。
- `$case.sceneVersions[6].testimonyWall.acts[0].inquiry.options[2].lines[0]` 是啊，先说了帮我买，接着就转了。可钱过去以后，合同一直没给我。
- `$case.sceneVersions[6].testimonyWall.acts[1].openerLines[0]` 我把催合同和退钱的聊天、他给的提交页一起发来。你们看他怎么回的。
- `$case.sceneVersions[6].testimonyWall.acts[1].decisivePresent.callerLine` 提交页也是他发的，又不是我做的。他拿这个应付我，你怎么倒问起我来了？合同我催过两遍了！
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.openingLines[0]` 我把催合同和退钱的聊天、他给的提交页一起发来。你们看他怎么回的。
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.openingLines[3]` 我现在也不知道买成没有。他让我等产品那边消息，我除了等，还能找谁？可合同他总该给我看看吧。
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.options[0].lines[0]` 没有，他只说已经提交，让我等。
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.options[1].lines[0]` 没给过日期。我问急了，他就说当初是我让他帮忙的。
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.options[1].lines[2]` 我就要他正面回这几句。合同我催过两遍了。
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.options[2].lines[0]` 合同、回单，买成了就给我看对应哪一笔。没买成就把钱退回来，别再让我空等。
- `$case.sceneVersions[6].testimonyWall.acts[1].inquiry.options[2].lines[2]` 合同催过两遍，退钱也没给日期。每次都是等，我不想再等了。
- `$case.sceneVersions[6].sceneCloser.lines[0]` 上礼拜他给我修刘海，手特别轻。我问两遍嫌不嫌烦，他说不烦。问两遍合同，倒成了催他。
- `$case.sceneVersions[6].sceneCloser.lines[2]` 完整截图和转账我一起留着。这次不发半张了，省得他又拿这个岔开。
- `$case.overnightStructure.linearCallback.lines[0]` 我现在在我妈家，没事。完整截图和转账都补发了。
- `$case.sceneVersions[4].version` 昨晚是警察来核实我另外一笔借款，没问 Tony。我借钱也是想多凑点跟着买，多少今晚不说。那十二万转进他户里了，我现在只想拿回来。
- `$case.sceneVersions[4].casualQuestions[0].answer` 只问我自己那笔。十来分钟，问我什么时候借的、怎么联系上的。Tony 那笔他们没问。
- `$case.sceneVersions[5].version` 是我转的。我先问能不能跟着买，他说我这十二万可以并进他的户。我知道不够一百万，可小姐妹都说收益高，他又对我那么好，我想他不会坑我。
- `$case.sceneVersions[5].casualQuestions[0].answer` 找他啊。他说钱不会不认，我才敢转。
- `$case.sceneVersions[5].casualQuestions[1].answer` 哪凑得够。我就这十二万，他肯帮我并进去，我才转的。
- `$case.sceneVersions[5].casualQuestions[2].answer` 我自己结。我下班晚，他肯留最后的号。染发、护理我都找他，酒吧一晚的提成有时候当晚就结，我花钱也快。
- `$case.sceneVersions[5].casualQuestions[3].answer` 我那时候还想跟他谈。这十二万，我也以为他会替我办好。
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[0].text` 我看到一排女人和亲密度，第一反应当然是他拿谈恋爱吊着人。
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[0].pressResponse` ‘那排名字就是全是女的。右边的钱……我等会儿说。’
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[1].text` 转钱以前，小姐妹提过高息档一百万起投，我只当听个热闹。
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[1].pressResponse` ‘小姐妹是提过一百万。后来……后来我确实问过 Tony，能不能让我跟着买。’
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[2].text` 十二万是我自己转的，备注没写，但聊天里有‘帮我买’。
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[2].pressResponse` ‘钱是我转的。可他收了以后，合同呢？’
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[3].text` 我裁掉金额和‘走我户’，是怕原图一发，大家先问我为什么把钱转给他。
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[3].pressResponse` ‘我不想一发出来就被围着骂。右边是我裁的。’
- `$case.sceneVersions[6].testimonyWall.acts[0].statements[4].text` 那段能不能别一上来就放？你一说“帮我买”，大家肯定觉得全是我自己活该。
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
- `$case.overnightStructure.liveCounterBeats[0].lines[1]` 有。她从预约群加了我，转了三张图：她给他的一百万、他说先放进宸直的聊天，还有一张认购回单。
- `$case.overnightStructure.liveCounterBeats[0].lines[3]` 不能。我手里只有她转来的图。是不是同一笔钱，我看不出来。我那十二万进没进产品，更看不见。
- `$case.overnightStructure.liveCounterBeats[1].choices[1].lines[1]` 对，我问的是他收钱以后干了什么。店里不认这项业务，总能叫他自己回我吧。

## Tony

- **固定性格：** 讨喜的即兴交易者
- **受压反应：** 面对其他客户关系的追问时退回服务和店务，把同样的情绪词说成维护。
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

- `$case.overnightStructure.dayScenes[0].body.beats[0]` 她是不是跟你说成我劝她买的了？我可没劝，她那点钱根本就不够。
- `$case.overnightStructure.dayScenes[0].body.beats[2]` 酒桌上聊起来的，我说利息是高，可那档一百万起。她问自己能不能买，我还笑她想得美。
- `$case.overnightStructure.dayScenes[0].body.beats[4]` 反正当着我没再问。后来怎么跟 Tony 聊的，我哪知道。
- `$case.overnightStructure.dayScenes[0].body.beats[6]` 最近有人说赎回要排队。我怕她已经转了，才让她别再转。她回我一句：我去翻他手机。

## Tony 案店长

- **固定性格：** 急躁的防守型管理者
- **受压反应：** 追问私表越深，越快结束谈话并关门。
- **防御动作：** 承认培训，不承认自己知道私人推进。
- **知识边界：** 知道培训、会员制度和员工指标，不知道Tony全部私人对话。

### 白天

- `$case.overnightStructure.dayScenes[2].body.beats[4]` 来了？刚才在忙。培训卡原页在这儿，店里没教过起投、走谁的户。Tony 私下收的钱你问他，别写成在我们店里买的。

### 后台／材料回流

- `$case.investigationHooks[0].material` 小何把回放发进预约群后，店长给节目发来了说明和培训卡。群里一位熟客也发来自己的聊天：“别把我也算成女朋友，我是去剪头的。” 门店培训卡只写‘记需求、约下次、晚档优先’。熟客补来的上周截图里，Tony 问：‘上周那个，你听完了吗？自己人，晚档给你留。’对方回：‘听过了，没钱。剪头就剪头，别又跟我说那个。’店长另说：‘我们店只做美发，也没让员工替客人收这种钱。Tony 私下跟客人说了什么，你们问他本人，别把店也写进去。’

## Tony 案另一位女客

- **固定性格：** 受伤后外放的感性派
- **受压反应：** 越被拒绝越想把个人尴尬变成共同指控。
- **防御动作：** 只给自己的记录，不替何证明十二万已入产品，也不去店里堵人。
- **知识边界：** 知道自己转过一百万、名单行写已买、Tony 发来的聊天和一张认购回单；不知道咨询者的十二万是否入了同一产品，也不知道其他顾客是否投过钱。

### 后台／材料回流

- `$case.investigationHooks[1].material` 周看到了同一预约群里的回放，从节目入口发来私信：“我也是顾客，我想查的是自己的钱。” 周女士说：“我就是名单上写一百万、已买的那位客人。他给我发过一张回单。我不去店里闹，材料可以交警方。回单是不是对应我那笔钱，让他们查。”

## Tony 案宸直柜员

- **固定性格：** 守窗口权限的程序执行者
- **受压反应：** 一碰到代持代购就不再回答，没有合同编号就结束谈话。
- **防御动作：** 只报高息档起投，其余推给系统户名。
- **知识边界：** 只知道高息档个人认购起投一百万；代持代购、具体合同和兑付结果不在窗口可答范围。

### 白天

- `$case.overnightStructure.dayScenes[1].body.beats[0]` 你问的那类产品，单笔认购至少一百万，还要做投资者资格和风险匹配。
- `$case.overnightStructure.dayScenes[1].body.beats[2]` 系统只认合同上的委托人。你没有产品全名和合同编号，我查不了。
- `$case.overnightStructure.dayScenes[1].body.beats[3]` 这边只能答业务规则。你要问具体哪笔，还是请合同上的委托人来联系。

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
- `$quick.turns[4].host` 你现在是租房，还是跟家里住？
- `$quick.turns[5].host` 一百万从家里出，你现在还有贷。这笔钱当时怎么说的？
- `$quick.turns[6].host` 房贷是钱的事。你前面说遇事别一听就走，还怕什么？
- `$quick.turns[7].host` 这笔钱你不想说，那你想找的这个对象，要什么条件？
- `$quick.turns[8].host` 登记表上有个，二十九，月薪六千，在物流公司做调度，没房。要不要先认识一下？
- `$quick.turns[9].host` 那什么样的介绍，你会更放心？
- `$quick.turns[10].host` 还得帮你还房贷啊。你那房子多少钱，贷了多少？
- `$quick.turns[11].host` 你为什么一定想让我来介绍？
- `$quick.issueOptions[0].question` 你在店里，客人试了半天又不买，你也这么直说？
- `$quick.issueOptions[1].question` 你爸不是伤了腰，连重活都干不了了吗？他哪来的一百万？
- `$quick.issueOptions[2].question` 你说月薪四五千也行，自己的工资还完房贷又剩不了多少。你希望对方每月替你还多少？
- `$quick.issueOptions[3].question` 怎么会想到拿自己不能生孩子举例？你很担心这个吗？
- `$quick.issueOptions[4].question` 我今天才认识你，怎么跟人家保证你可靠？
- `$quick.confrontations[0].lines[0]` 你在店里，客人试了半天又不买，你也这么直说？
- `$quick.confrontations[0].lines[2]` 工作里能耐着性子，回家就不想再这么说了？
- `$quick.confrontations[1].lines[0]` 你爸不是伤了腰，连重活都干不了了吗？他哪来的一百万？
- `$quick.confrontations[1].lines[2]` 我只问一句，他是不是你亲生父亲？
- `$quick.confrontations[1].lines[4]` 给这一百万的，跟你是什么关系？
- `$quick.confrontations[2].lines[0]` 怎么会想到拿自己不能生孩子举例？你很担心这个吗？
- `$quick.confrontations[2].lines[2]` 这事你打算什么时候跟对方说？
- `$quick.confrontations[3].lines[0]` 你说月薪四五千也行，自己的工资还完房贷又剩不了多少。你希望对方每月替你还多少？
- `$quick.confrontations[3].lines[2]` 如果他四五千只够自己生活，拿不出钱帮你还贷，你还愿意见吗？
- `$quick.confrontations[4].lines[0]` 我今天才认识你，怎么跟人家保证你可靠？
- `$quick.confrontations[4].lines[2]` 可人家听的是我说你好，回头不合适，还不得来找我？
- `$quick.ending.summaryPages[0].lines[0]` 你这忙我帮不了。今天就到这儿吧。

## 快案来电人·罗

- **固定性格：** 擅长用低姿态和亲近感争取入口的机会主义自保者
- **受压反应：** 被追到钱源时先坚持长期父女称呼、反问为什么非要分清，被逼着回答是否亲生以后才最小承认，再用隐私和自愿赠与转题；被回问为什么拿自己不能生孩子举例时先反问“你怎么能这么问”，直到主播再追一句才承认做过检查。
- **防御动作：** 把恋爱里不愿说好话说成不会，两个出资背景都用爸爸串起来，把检查顾虑放进假设，最后才说月供分担。
- **知识边界：** 知道亲生父亲的身体与家庭经历、一百万元的真实给款人、自己的检查结果和择偶目标；不会公开给款者的身份。她不知道父母和前任会怎样解释旧事，也不能用检查结果证明任何性经历。

### 其他出声面

- `$quick.turns[0].caller` 能听见。那个……我这事从哪儿说呢。
- `$quick.turns[1].caller` 我想找个对象，也想让你帮我看看，我这样的适合找什么样的。你手里要真有合适的，也可以给我介绍一下。
- `$quick.turns[2].caller` 我二十四，在商场卖衣服，底薪加提成一个月六七千，自己能养活自己。以前谈过两个，一个去了外地，另一个嫌我脾气不好。我脾气确实不好，好听的也不会讲。现在想找个踏实的，别赌，别动手。家里遇上事，别瞒着我，也别转身就跑。
- `$quick.turns[3].caller` 我妈就是这么走的。我爸以前给人开货车，后来伤了腰，重活干不了，家里收入就断了。我妈收拾东西就走了，那年我还在上小学。后来我爸一个人把我带大的。现在亲爸偶尔替人看店，也挣不了多少。我就觉得，两个人碰上没法上班，总该一起想办法。
- `$quick.turns[4].caller` 我自己有套小两居，还有一点贷款。去年买的时候，爸爸给了我一百万，我又添了一点才买下来。以后男方没房，也可以先住我这里。
- `$quick.turns[5].caller` 他在我身上一直挺舍得的。钱的事其实都不是重点，我也不会让男方养我。
- `$quick.turns[6].caller` 遇上事不光是钱的事。哪怕以后他身体不好，或者是我不能生孩子，也能商量着过，别一听就走。
- `$quick.turns[7].caller` 还是想让你介绍啊。以前是谁帮我，跟我现在找对象有什么关系？一个月四五千就行，年龄大我五岁以内，没房也可以。学历、长相我真不挑，人品好就行。
- `$quick.turns[8].caller` 先别急吧。就这么几句话，我也不知道他平时是什么样的人。加了以后不合适，再删也挺麻烦的。
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
- `$quick.turns[6].host` 早上七点多才回那条消息。你当时人在哪？
- `$quick.turns[7].host` 最后那轮还是你点的？
- `$quick.turns[8].host` 那第二天，你跟男方提桌上这个人了吗？
- `$quick.turns[9].host` 你说自己很久没出去。近两个月的动态还能找着吗？
- `$quick.turns[10].host` 十号你还发了一组 KTV 的照片，那是哪天拍的？
- `$quick.turns[11].host` 八号你也出去喝酒了？
- `$quick.issueOptions[0].question` 那束花是你自己开口要的，还是他先送的？
- `$quick.issueOptions[1].question` 花是你先开口要的。他真送来以后，你还是觉得缺点什么？
- `$quick.issueOptions[1].confrontationOpeningLines[0].text` 花是你先开口要的。他真送来以后，你还是觉得缺点什么？
- `$quick.issueOptions[2].question` 十一点五十二你回的是‘还行’，六分钟以后就没再回。你回‘还行’的时候，身体到底怎么样？
- `$quick.issueOptions[3].question` 你刚说有些酒是别人点的。这个‘别人’是谁？
- `$quick.issueOptions[4].question` 这两个月六次酒吧、KTV，上个月三个周末都有。你说很久没出去，是这些都不算？
- `$quick.issueOptions[5].question` 前一条你还回着，后一条为什么没看见？手机那会儿放哪儿？
- `$quick.issueOptions[6].question` 你说解释过了，当时怎么跟他讲的？
- `$quick.issueOptions[7].question` 你发那组 KTV 照片的时候，写了是八号拍的吗？
- `$quick.confrontations[0].lines[0]` 花是你先开口要的。他真送来以后，你还是觉得缺点什么？
- `$quick.confrontations[0].lines[2]` 朋友圈截图我看了，朋友都在猜你是不是谈了。你跟他说过这些评论吗？
- `$quick.confrontations[1].lines[0]` 十一点五十二你回的是‘还行’，六分钟以后就没再回。你回‘还行’的时候，身体到底怎么样？
- `$quick.confrontations[1].lines[2]` 都快吐了，怎么还跟他说还行？
- `$quick.confrontations[2].lines[0]` 你刚说有些酒是别人点的。这个‘别人’是谁？
- `$quick.confrontations[2].lines[2]` 男的还是女的？
- `$quick.confrontations[2].lines[4]` 你前面只提了妹妹，我刚还以为就你们俩。这个朋友，你为什么没提？
- `$quick.confrontations[3].lines[0]` 这两个月六次酒吧、KTV，上个月三个周末都有。你说很久没出去，是这些都不算？
- `$quick.confrontations[3].lines[2]` 八号 KTV、九号清吧，连着两晚。你说偶尔出去一次，把前一晚也没算进去？
- `$quick.confrontations[4].lines[0]` 你说解释过了，当时怎么跟他讲的？
- `$quick.confrontations[4].lines[2]` 说到妹妹那个朋友，他才知道还有个人？
- `$quick.confrontations[4].lines[4]` 你前面只提妹妹，忽然又有个朋友，他当然要问啊。
- `$quick.confrontations[5].lines[0]` 你发那组 KTV 照片的时候，写了是八号拍的吗？
- `$quick.confrontations[5].lines[2]` 没写日期，他真看到也未必知道是旧图。你后来单独跟他解释过八号、九号吗？
- `$quick.ending.summaryPages[0].lines[0]` 你今天还打算联系他吗？
- `$quick.ending.summaryPages[0].lines[2]` 那他不先道歉，你就不联系了？

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
- `$quick.issueOptions[5].missReaction.text` 回完就塞包里了。后来不舒服，是妹妹帮我拿着包，我没再翻手机。
- `$quick.confrontations[0].lines[1]` 我高兴啊，可也想知道他为什么愿意送。他就说你喜欢就买了，后面又没话。
- `$quick.confrontations[0].lines[3]` 说过，我还截给他看了。有人羡慕我也高兴啊。但总不能有花有包，就不用好好聊天了吧。
- `$quick.confrontations[1].lines[1]` 已经有点难受了。我当时想着马上就走，没必要让他跟着担心。谁知道几分钟以后会吐成那样。
- `$quick.confrontations[1].lines[3]` 我怕他知道我喝多了又来问，才说还行。可第二天一醒我就解释了，也没有故意晾他。
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
- `$quick.ending.summaryPages[0].lines[3]` 先不发了。我都解释过一次了，总不能一直是我找他。

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
- `$quick.turns[2].host` 文末这个“纯属虚构”，你们看见没有？
- `$quick.turns[2].source` 正文指向现实人物并配图，文末却留了一句『纯属虚构』。
- `$quick.turns[3].host` 再看钱。他说已经转了多少？
- `$quick.turns[3].source` 长文说，谈婚期间三千万打进女方家里账户，他已经为这笔钱起诉；男方的原话是，她嫌一天限额一百万太慢，让我准备五张卡一起打。
- `$quick.turns[4].host` 后面还有一笔更大的数。
- `$quick.turns[4].source` 他又写，后来女方开口要五千万美元；他的回答是『让我想想』，这笔钱没有转出去。
- `$quick.turns[5].host` 女方怎么回的？
- `$quick.turns[5].source` 女方说自己从没因为金钱出卖爱情，但对三千万，一个字没回。
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
- `$quick.issueOptions[1].question` 她靠演出和品牌合作吃饭。这事一直挂着，片方和品牌方会不会继续找她，她能不着急吗？
- `$quick.issueOptions[2].question` 名字和照片都指向一个人，末尾又写“纯属虚构”。看的人到底该按哪句信？
- `$quick.issueOptions[3].question` 五张卡、催得急、后来又开大价，这些都是男方在文里讲的。
- `$quick.issueOptions[4].question` 三千万，他说转了，也起诉了。五千万美元，他说对方要过，可自己没转。
- `$quick.issueOptions[5].question` 男方把三千万说得这么具体，女方只回一句“不拿金钱换爱情”，这哪儿答上了？
- `$quick.issueOptions[6].question` 他觉得她是怕丢工作，才找人来谈。
- `$quick.issueOptions[7].question` “她愿意谈”是谁的原话？
- `$quick.issueOptions[8].question` 他把有人来谈紧接在传闻后面，再补一句“她怕了”。
- `$quick.issueOptions[9].question` 照男方自己说的，诉状里是三千万，撤声明、认全文都没写进去。
- `$quick.issueOptions[10].question` “我手里还有”——那他打算什么时候拿出来？
- `$quick.issueOptions[11].question` 最让我不信的是这儿：他自己给文章写虚构，却要她公开认全文。
- `$quick.confrontations[0].lines[0]` 男方自己把长文发出来，说明至少这一次，他愿意让大家都来谈。
- `$quick.confrontations[0].lines[1]` 长文是他自己发的，名字照片也都放了。他就是要让她的观众和合作方看见。
- `$quick.confrontations[1].lines[0]` 她靠演出和品牌合作吃饭。这事一直挂着，片方和品牌方会不会继续找她，她能不着急吗？
- `$quick.confrontations[1].lines[1]` 我要是她，现在最想知道的恐怕是：这篇东西到底还要挂多久？
- `$quick.confrontations[2].lines[0]` 名字照片都点了这个人，末尾写虚构。谁信啊？
- `$quick.confrontations[3].lines[0]` 五张卡、催得急、后来又开大价，这些都是男方在文里讲的。
- `$quick.confrontations[3].lines[1]` 他说三千万已经起诉，法院要查的是这笔钱。其他私下细节，不会因为他起诉了就自动变真。
- `$quick.confrontations[4].lines[0]` 三千万，他说转了，也起诉了。五千万美元，他说对方要过，可自己没转。
- `$quick.confrontations[4].lines[1]` 两笔别加在一起算她拿了多少。三千万该不该退，交给法院判。
- `$quick.confrontations[5].lines[0]` 男方把三千万说得这么具体，女方只回一句“不拿金钱换爱情”，这哪儿答上了？
- `$quick.confrontations[5].lines[1]` 我想听的是，她认不认这笔钱，怎么解释。这个回应说服不了我。
- `$quick.confrontations[6].lines[0]` 他觉得她是怕丢工作，才找人来谈。
- `$quick.confrontations[6].lines[1]` 可这个中间人到底是谁找的？她本人回过这件事吗？
- `$quick.confrontations[7].lines[0]` “她愿意谈”是谁的原话？
- `$quick.confrontations[7].lines[1]` 现在是男方说，中间人传的是她的意思。我还没看见中间人怎么说，更没看见她怎么委托的。
- `$quick.confrontations[8].lines[0]` 他把有人来谈紧接在传闻后面，再补一句“她怕了”。
- `$quick.confrontations[8].lines[1]` 这样读下来，来谈就像已经认了前面那些事。可这个结论是他加的。
- `$quick.confrontations[9].lines[0]` 照男方自己说的，诉状里是三千万，撤声明、认全文都没写进去。
- `$quick.confrontations[9].lines[1]` 钱要她退，文章还得让她全认。他自己写的“虚构”，这会儿又不算了？
- `$quick.confrontations[10].lines[0]` “我手里还有”——那他打算什么时候拿出来？
- `$quick.confrontations[10].lines[1]` 东西还没见着，倒先让她把整篇认了。
- `$quick.confrontations[11].lines[0]` 最让我不信的是这儿：他自己给文章写虚构，却要她公开认全文。
- `$quick.confrontations[11].lines[1]` 这句虚构到底只准谁用啊？
- `$quick.ending.summaryPages[0].lines[0]` 这篇先聊到这里。

# 未在本报告捕获到台词的人物卡

- V哥（v-bro）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。
- 案一男方前同事（case1-ex-coworker）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。
- Tony 案前台（case2-front-desk）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。
- 做企业财务的朋友（case4-finance）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。
- 职场案仓库管理员（case4-warehouse）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。
- 快案长文作者·顾（quick3-caller-gu）：可能只存在于非台词元数据、未进入本包或需要补结构化归属。

# 句长节奏人工复核

以下只是朗读提醒，不自动判错。三句服务于不同防御动作时可以保留。

- _shell／旁白／other：22、24、21 字（$manifest.nightShell.cafePrologue.forensic.openingLines[6]；$manifest.nightShell.cafePrologue.forensic.openingLines[13]；$manifest.nightShell.cafePrologue.forensic.accountClueLines[2]）
- _shell／林旭阳／other：27、28、25 字（$manifest.nightShell.interludes[1].lines[5]；$manifest.nightShell.interludes[1].lines[7]；$manifest.nightShell.interludes[1].lines[10]）
- _shell／林旭阳／other：33、35、33 字（$manifest.nightShell.cafePrologue.cafe.openingLines[10]；$manifest.nightShell.cafePrologue.cafe.evidencePair[0].hitLines[2]；$manifest.nightShell.cafePrologue.cafe.evidencePair[1].hitLines[2]）
- 01-credit／案一咨询者·沈／other：26、24、25 字（$case.sceneVersions[4].questionOptions[1].missReaction；$case.sceneVersions[5].noClueReaction；$case.sceneVersions[5].questionOptions[1].missReaction）
- _shell／咖啡厅男方／other：30、30、30 字（$manifest.nightShell.cafePrologue.cafe.evidencePair[0].remainingLines[1]；$manifest.nightShell.cafePrologue.cafe.evidencePair[0].hitLines[1]；$manifest.nightShell.cafePrologue.cafe.evidencePair[1].remainingLines[1]）
- _shell／咖啡厅男方／other：30、30、30 字（$manifest.nightShell.cafePrologue.cafe.evidencePair[0].hitLines[1]；$manifest.nightShell.cafePrologue.cafe.evidencePair[1].remainingLines[1]；$manifest.nightShell.cafePrologue.cafe.evidencePair[1].hitLines[1]）
- _shell／咖啡厅男方／other：25、25、24 字（$manifest.nightShell.cafePrologue.cafe.transferHitLines[2]；$manifest.nightShell.cafePrologue.cafe.legalClaimLines[0]；$manifest.nightShell.cafePrologue.cafe.legalClaimLines[1]）
- 01-credit／案一咨询者·沈／nightB：25、21、22 字（$case.sceneVersions[7].testimonyWall.acts[0].statements[1].text；$case.sceneVersions[7].testimonyWall.acts[0].statements[1].pressResponse；$case.sceneVersions[7].testimonyWall.acts[0].statements[2].text）
- 01-credit／案一咨询者·沈／nightB：21、22、21 字（$case.sceneVersions[7].testimonyWall.acts[0].statements[1].pressResponse；$case.sceneVersions[7].testimonyWall.acts[0].statements[2].text；$case.sceneVersions[7].testimonyWall.acts[0].statements[2].pressResponse）
- 04-workplace／第二通咨询者·陈／nightA：29、26、29 字（$case.sceneVersions[1].questionOptions[1].lines[0]；$case.sceneVersions[1].questionOptions[2].lines[0]；$case.sceneVersions[1].questionOptions[2].lines[2]）
- 04-workplace／第二通咨询者·陈／nightB：27、27、27 字（$case.sceneVersions[4].testimonyWall.acts[0].decisivePresent.callerLine；$case.sceneVersions[4].testimonyWall.acts[0].inquiry.openingLines[1]；$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[0].lines[0]）
- 04-workplace／第二通咨询者·陈／nightB：21、25、24 字（$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[1].lines[0]；$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[0]；$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[2]）
- 04-workplace／第二通咨询者·陈／nightB：25、24、25 字（$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[0]；$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[2]；$case.sceneVersions[4].testimonyWall.acts[0].inquiry.options[2].lines[4]）
- 03-profile／案三咨询者·林／nightA：37、37、39 字（$case.sceneVersions[2].casualQuestions[0].answer；$case.sceneVersions[2].casualQuestions[1].answer；$case.sceneVersions[2].casualQuestions[2].answer）
- 03-profile／案三咨询者·林／nightB：23、23、22 字（$case.sceneVersions[6].noClueReaction；$case.sceneVersions[6].afterVersion.lines[0]；$case.sceneVersions[6].questionOptions[0].lines[0]）
- 03-profile／案三咨询者·林／nightB：24、21、23 字（$case.sceneVersions[5].testimonyWall.acts[0].statements[3].text；$case.sceneVersions[5].testimonyWall.acts[0].statements[3].pressResponse；$case.sceneVersions[6].version）
- 02-tony／第四通咨询者·何／nightA：22、19、22 字（$case.sceneVersions[0].revisedVersion；$case.sceneVersions[0].casualQuestions[0].answer；$case.sceneVersions[0].casualQuestions[2].answer）
- 02-tony／林旭阳／nightA：26、22、25 字（$case.sceneVersions[0].casualQuestions[1].question；$case.sceneVersions[0].casualQuestions[2].question；$case.sceneVersions[0].casualQuestions[3].question）
- 02-tony／林旭阳／nightA：21、25、25 字（$case.sceneVersions[3].entryQuestion；$case.sceneVersions[3].casualQuestions[0].question；$case.sceneVersions[3].casualQuestions[1].question）
- 02-tony／第四通咨询者·何／nightB：35、31、32 字（$case.sceneVersions[6].testimonyWall.acts[0].inquiry.options[1].lines[2]；$case.sceneVersions[6].testimonyWall.acts[0].inquiry.options[2].lines[0]；$case.sceneVersions[6].testimonyWall.acts[1].openerLines[0]）
- 02-tony／第四通咨询者·何／nightB：26、28、25 字（$case.sceneVersions[5].casualQuestions[3].answer；$case.sceneVersions[6].testimonyWall.acts[0].statements[0].text；$case.sceneVersions[6].testimonyWall.acts[0].statements[0].pressResponse）
- 02-tony／第四通咨询者·何／nightB：28、25、27 字（$case.sceneVersions[6].testimonyWall.acts[0].statements[0].text；$case.sceneVersions[6].testimonyWall.acts[0].statements[0].pressResponse；$case.sceneVersions[6].testimonyWall.acts[0].statements[1].text）
- 02-tony／第四通咨询者·何／nightB：29、26、25 字（$case.sceneVersions[6].testimonyWall.acts[1].statements[1].text；$case.sceneVersions[6].testimonyWall.acts[1].statements[1].pressResponse；$case.sceneVersions[6].testimonyWall.acts[1].statements[2].text）
- 02-tony／Tony 案宸直柜员／day：32、30、32 字（$case.overnightStructure.dayScenes[1].body.beats[0]；$case.overnightStructure.dayScenes[1].body.beats[2]；$case.overnightStructure.dayScenes[1].body.beats[3]）
