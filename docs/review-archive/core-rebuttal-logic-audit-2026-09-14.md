# 《深夜热线：直播间侦探》核心反驳专项审查

审查日期：2026-09-14。交付类型：只读审查与改法建议。没有改写源剧本、生成文件或存档，没有启动、重置或接管用户试玩。

## 总体结论

**当前尚不能认定所有核心反驳合格。最需要修的是案一末段：两次限次出示均没有用材料击穿正在维护的说法，真正承重的“代存约定”和“续给钱才继续谈”是在命中以后靠人物补出来的；之后还撤回了已经承认的代存事实。** 这会让玩家觉得选中标准组合只是领取作者安排的招认。

其次是咖啡厅聊天图与开房否认之间的证明缺口、餐厅经历与案一资金主线的连接不足，以及快案中把正常沟通差异、个人顾虑放成必中的反驳。部分段落已修好证据边界，却仍沿用唯一正确、限次失败的交互合同。

并非所有必经询问都应改成谎言。居住安排、问谁先提出代投、核对受理页等可以承担铺垫；本报告只要求它们问到玩家选的那句话。真正的反驳则须让新事实改变当前主线判断，不能只新增一条人物私事。

严重度：P1＝会改变核心判断、破坏承重闭环或强迫击中不成立的矛盾；P2＝定位、证明范围、同样成立材料被判错或接续问题。没有把未进行的浏览器验证写成通过。

## 覆盖及实际顺序

覆盖咖啡厅序章两幕；四主案按 manifest 的 **案一→案四→案三→案二** 顺序，共 23 个现行场景，其中 19 个逐句回放场景、28 个顺序必经问题、4 面证词墙的 8 次正式出示；另审三个可玩的快案，共 12 轮、23 组对质／评论。快案一、二每轮要求指定对质全部完成；快案三每轮三项任选其一，检查了所有候选。

同时读了挂断、固定白天调查、可选圈注问答、第二夜开头、场尾材料、插话、收麦与结案回收。12 个主案 evidenceChecks 的题面及反馈纳入邻接核对，不把材料题一律算作逐句反驳。

排除当前不可玩旧场景：案一 `credit-device-benefit`、`credit-five-wan-gap`；案三 `profile-introducer-two-prices`、`profile-mba-wording`。证词墙的 `legacyQuestionOptions` 也不算实际必经问答。它们只用于辨认遗留内容，没有拿旧错误冒充当前错误。

运行时依据：`statementStages` 会先读一组陈述，再回放；回放只拆 `version`，不是任意把 `afterVersion` 或刚回答的话加入可选原句；`questionSequence` 控制同场下一问。证词墙先读 `beforeVersion`，再经场前材料进入 `testimonyWall.acts`，各幕命中后继续，最终才读场后交流。线性回拨用 `linearCallback`，不会自动播放旧 `callbackOpeners`。白天文档只须圈至少一行，因此某条 rowQuestion 不能一概当必经事实。

源入口：[主案顺序](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/manifest.json:138)。消费者：

- [逐句回放与下一问题](/Users/pkuiloveoov/code/love/src/ui/screens/sceneScreens.js:445)、[锚点映射](/Users/pkuiloveoov/code/love/src/ui/statementReviewView.js:109)、[一组陈述的播放](/Users/pkuiloveoov/code/love/src/ui/sceneReviewView.js:71)。
- [证词墙入场及材料](/Users/pkuiloveoov/code/love/src/ui/screens/testimonyWallScreens.js:54)、[正式出示按唯一 ID 对判断](/Users/pkuiloveoov/code/love/src/runtime/decisivePresentModel.js:215)。`outcomeKind: clarification` 没有取消答错扣次数。
- [线性回拨](/Users/pkuiloveoov/code/love/src/ui/screens/overnightScreens.js:449)、[白天文档最少圈一行](/Users/pkuiloveoov/code/love/src/ui/screens/overnightDocumentScreens.js:45)、[快案 all／any 完成规则](/Users/pkuiloveoov/code/love/src/runtime/quickDetectiveModel.js:307)。

## 按严重程度列出的主要问题

### F01 · P1 · 案一第一幕：累计转入没有反驳共同消费，代存约定在命中后才出现

定位：[credit-loyalty-test / act1 / credit-consumption-gloss](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:1642)；[正式材料 credit-fixed-support:summary](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:1679)。

目标原句：“每个月那笔我收了。可吃饭、出去玩也都从里面花，不能光说钱进了我的卡。”

她维护的是“收到的钱有共同花销，不能按总入账追我”。此前已承认固定半薪、设备与探店受益，已知道房租另付、14 个月累计 24.5 万。**累计转账与这句完全可以同时为真**；目标没有说全都用于共同消费。命中后“衣服、账号也花钱”也没推翻“吃饭也花了”。同屏更关键的是旧钱能否不交代用途，而不是她是否收过钱。

主线真正需要的“钱放我这里，我替我们存着”直到 act2 开头才由她自述。玩家没有在正式出示前抓住这项约定，因而不能靠自己的选择拆穿“自愿给付等于自由支配”的辩解。

具体改法：保留半薪、房租为铺垫，把“以前只答应他自己愿意给，从没说过替两个人存”设为此幕承重说法；在进入该幕前，经现有男友手机消息渠道给出一段带上下文的当初代存约定，由她确认是双方聊天，再让玩家出示。她只须争“说存着也没说不能花”，无需招认骗钱。后面核实际花销、余额和披露情况。若不新增可核对的约定原文，就把这一幕改成普通问当初安排，取消唯一正确的正式反驳。

### F02 · P1 · 案一第二幕：缺转记录不证明催钱动机，关键回拨原话未实际附入材料

定位：[credit-loyalty-test / act2 / credit-transfer-was-his-idea](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:1788)；[正式材料 case1-bank-flow:r09](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:1821)。

目标原句：“是说替我们存着，可他也愿意养我。七月没来，我问他，是怕他又瞒事，不是催他给钱。”

她保护的是问钱的动机。r09 证明七月固定转账和房租没出现，恰好也是她已承认的前提；担心隐瞒、关心钱是否继续，两者并不互斥。材料种类写“流水圈注＋原话回放”，实际 excerpt 只有缺转，没有能击穿“不是催他给钱”的原话。旧 `callbackOpeners` 的催问回答不能当线性路径已经播放过。第一夜“钱没来才去问”足以怀疑，不能独自坐实以续款决定关系。

命中以后她才补“以后还能照常给，我们当然可以再谈”，因此当前结果依赖新增口供，材料动作本身没有完成揭露。

具体改法：把“还能继续给就再谈”先放在普通追问或现有消息交流中，让她随后维护“分不分只看诚不诚实，跟继续给钱没关系”；正式材料回放她刚说过的条件句，并保留 r09 为背景。命中追问“工作的谎没变，为什么续给钱就能再谈”，她可继续争现实生活，不必认动机。不要用 r09 单独当心理证据。

### F03 · P1 · 案一收尾撤回了已承认事实

定位：[overnightStructure.callerQuestion](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:3032)，稳定选项 `not-your-debt`；前置 [credit-loyalty-test / act2](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:1724) 与该场 `afterVersion`。

目标回收句：“他给的时候也没说要我存着啊。现在缺钱了，倒要查我怎么花的？”

实际顺序中，这句在两幕证词墙、承认代存及报余额 11600 多之后。她已明确说“是我说的……我替我们存着”，这里又把约定重置成不存在。随后主播还用“没告诉他花光了”的旧状态接话，继续追“别只拎男装五千”，使末段退回第一夜。

具体改法：保留 `callerQuestion` 的反抗功能，改为“我是说过替我们存，可也没说一分都不花。余额刚才讲了，八万还是不转。”主播顺接“他已经听到余额，接下来愿不愿意把共同支出和自己的花销说明白”，不重复首次逼出代存、余额、设备受益。收麦和 deepFollowup 一并承认“余额已经在直播讲了”；深问可追她打算怎样解释用途。

### F04 · P1 · 咖啡厅：到店聊天被当作开房否认的有效反证

定位：[prologue-cafe-opening / hotel-denial](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/manifest.json:932)；[cafe.evidencePair / chat、hotel](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/manifest.json:947)。

目标原句：“我没在外面开过房。”`chat` 只有“我到澜桥酒店了”；`hotel` 是入住人本人、大床房一间的订单。当前两张任选都进入妻子承认自己住了一晚的第二幕。

到酒店可以是见人、吃饭或进入公共区域，不能单凭聊天否定没开房。问题“房是谁开的”可以问，但不能把聊天选中算作反驳已完成。此前同屏还有钱款否认，酒店被安排先查可以成立，问题在材料强度不等价。

具体改法：保留现行目标时，酒店订单才完成本轮；聊天用于询问到店目的、锁定日期，不解锁“已经承认开房”。或把初始否认明确改回“那晚没去澜桥酒店”，让聊天打穿到店否认，接着用订单核实际住宿，不能直接由到店推出谁开房。两种选一种，后续维持顾*是否上楼未知。第二幕转账反驳本身通过。

### F05 · P1 · 案一餐厅：到店次数已能击穿，但尚未闭回资金主线

定位：[credit-anniversary-agency](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:738)；[questionOptions:1](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:1004)；[credit-anniversary-footprint / option:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:906)。

核心原句从“我俩第一次去那家餐厅”收窄成“认识他以前朋友叫我吃一次”，再经第三问确认“一共两回”。两年前“第三次来”与男朋友评论确能反驳后者，匿名图第一夜已取得，且时间早于现任一年半关系。这部分修复成立，**不能退回用到店图片证明她本人付款或平时高消费**。

断点有二：第二问仍点“主要贵在酒，他看中一瓶，我说太贵了”，实际问“之前去的那次也是过纪念日？”；更根本地，反驳目前只揭出前任和去过几次。她最初未否认指定座位，也没说贵酒由自己选择。就算证明前任多次请客，仍不影响这次谁点酒、她支配半薪、代存亏空或八万诉求。材料后的辩解“不想在直播提前任”有独立成立的理由，下一场只接喜欢拍照，没有把这条发现闭回主线。

具体改法：保留用户指定的首次去→承认一次→旧图顺序，把第二、第三问接成第一次目标句下的后续交流，或把改口后的经历真正加入可回放文本。若仍作为主案核心反驳，前置必须明确她借“第一次”维护的资金说法，例如“这次店和消费档次全是他临时定的，我没有持续要求这种开销”；旧图最多证明熟悉餐厅，随后须用**现任这次的订店／预算交流**核她是否主动要求，并回到同一份账单。不得新编证据直接断言她付款。若不拟补这条承重关系，将餐厅保留为人物隐瞒与普通核对，降低为非核心出示；主线反驳交给真实的代存用途冲突。

### F06 · P1 · 快案一：销售沟通与生育举例被设为必中过关点

定位：[sales-version → sales-voice → sales-soft-talk](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/01-no-conditions.json:159)；[personal-concern → report-disclosure → fertility-slip](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/01-no-conditions.json:200)。

目标原句分别是“我脾气确实不好，好听的也不会讲”和“哪怕以后他身体不好，或者是我不能生孩子，也能商量着过，别一听就走”。两轮都没有其他核心问题可替代，必须完成指定对质才能继续。

第一处发生在恋爱经历语境，工作上会招呼顾客并不反驳亲密关系里不会／不愿哄人；她的“上班才这么说，下班够累了”成立。第二处主动举例足以温和问顾虑，但没有前置检查痕迹，唯一真相靠她承认检查得到。它是角色信息披露，不是当时最重要的自相矛盾，更没有改变介绍人应否替她担保的核心判断。

具体改法：两组作为普通问答保留，允许人物解释成立并继续。不把“职业会说话”和“不能生育的假设”做成必须抓住的破绽。把强制反驳集中到两个‘爸爸’的指代与房款来源，以及借主播信用、隐去月供条件。若保留检查话题，只问“这是你自己的担心吗，介绍前希望怎么谈”，不要求提供敏感经历才算玩家成功；后文“检查这件事我听到了”随是否谈过调整。

### F07 · P1 · 快案二：交流需求被礼物与朋友圈强制对质，却没有矛盾

定位：[surface-story / emotion-or-display、flower-request → care-or-display](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/02-one-missed-message.json:197)。

目标是“还有人说羡慕”或“顺口问他能不能也送我一束”；正式问答开头却问照片旁的包是谁送的。此前她已明说要过花、收到高兴、发朋友圈、回表情，并用分享歌曲没人回应说明交流不足。喜欢礼物与要求深入聊天可以同时成立，命中后的“总不能有花有包，就不用好好聊天”也成立。新增包来源、把评论转给男方，并未解释为什么一个月后冷淡。

具体改法：改为可选的关系背景询问，不作为 `surface-story` 必须完成的对质；保留该轮真正有承重作用的 23:52 ‘还行’与后来身体状态。若保留包问题，先在可见截图／叙述中让玩家注意到包，把它接到图像材料询问，不能借‘羡慕’的原句要求玩家猜一个尚未知道的问题。

### F08 · P2 · 跨场目标句错位：玩家点的是事实 A，主播问事实 B

- [案一 credit-bank-flow:questionOptions:1](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:1441)：目标“设备的分期我可没答应过，那是他自己选的付款方式”，问题却是“自己选的探店，没人付的部分拿什么填”。第一问已经合理揭示没有合作兜底；第二问应接在“探店先垫”改口下，用已听回答追工资／半薪，不把未承诺设备分期判成资金来源问题。当前核心改写方向正确，残留的是交互锚点。
- [案三 profile-caller-repeats-label:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/03-profile.json:816)：目标“把学校好说成名校毕业”，实际问母亲要求多拿彩礼、她是否同意。母亲家境调查与彩礼说辞放在必播 `afterVersion`，玩家知道这件事，但该说辞不在可回放 `version`。把“我妈说家里帮不上，彩礼多留一点，我当时没反对”接入本轮可选陈述；学历转述留普通询问，避免为了问彩礼重审已认过的学历。
- [快案一 actual-standard → hidden-standards](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/01-no-conditions.json:230) / `mortgage-pressure`：当前轮次已主动补经商、房贷期望，目标“先别急吧”是合理谨慎；对质核心却在以前分手还因月供。`actual-standard` 独有开场可解释候选顾虑，但共用对质仍突然跳旧分手。将“前任只是嫌我脾气不好”作为本轮明确回放原话，与月供要求并看；不再把更高偏好本身判作欺骗。

### F09 · P2 · 案三第一幕：付钱先后是已明确的争议，材料并未推翻它；更直接的持有页反而判错

定位：[profile-family-chat-origin / act1 / profile-equal-conditions](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/03-profile.json:1159)。

目标原句：“我爸已经答应给二十万了。我跟他说我家也出钱，他就别再拿钱还没到当理由拖着领证了。”同屏已说父亲的钱九月底以后给女儿留着，PRESS 更明说要男方先出。指定 `p04+p06+p07` 再讲婚前付款、父亲未来给、婚宴另算，支持追问不对称安排，但没有打穿她声称的事实；人物也没有撤回条件。它与本案主线紧密，可作为核心协商，不能伪装成事实谎言。

还有操作公允性：同屏 `p05` 正写“30 万、09-30 到期、当前不能取”，用于质疑“把没到款当理由拖延”至少同样相关。实际纯函数验证此组合仍返回 `miss`，不是只看字段猜测。

具体改法：若保留事实反驳，先让她维护“我家二十万现在也能拿来一起付婚宴”，再用现有到期日与给她个人留着的原文打穿时间／用途；须让人物确实说这句，不能对现有句强加“已经到账”。更小改法是保留现行协商内容，去掉限次唯一答题；同时允许 p05 进入时间追问，组合材料进入时间＋用途追问。

### F10 · P2 · 案四第二幕：包干正常与费用造假之间还缺一个可反驳的明确说法

定位：[work-split-ownership / act2 / work-handler-promise-cleared-her](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/04-workplace.json:1061)，材料 `case4-department-ledger:q08`。

目标原句：“八万是他部门的包干额度。花不完他拿一点，我跟着忙也拿一点，这不是很正常吗？”前一夜已认主办四千、主管八千；白天又确认八万包干。q08 的“外部协调、主办四千主管八千、服务方未填”确实提供核心疑点，但**空白字段只能支持问谁提供服务，不能单凭它证明不存在外部服务，包干本身也不证明不得按规则奖励员工**。命中后才首次承认“没找外面的人”。

具体改法：先普通问名目，让她维护“这笔一万二是付给外部协调，没进我们自己的分配”；再用她交来的主管分配附注打穿，问服务是谁做、为何主管拿八千。或保持现有目标，把结果定位为“需说明这项费用”，不判解释已经被反证。不新增全公司不得发奖金的规定来补洞；后文按财务实际要求解释草单、分开六万八实垫与未付四千，现有收麦发送可保留。

### F11 · P2 · 案二第一幕：目标维护诉求成立，但代投聊天被错误排除

定位：[tony-next-push-column / act1 / tony-romance-only-claim](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/02-tony.json:1332)。目标：“这十二万我当然要追回来。你就按他借谈恋爱收我钱来说，帮我买产品那段先别提了。”

这次没有重复把代投当第一次发现，目标是她要求节目省略已经知道的事实，值得击中，主线连接好。但指定 m03“走 Tony 户”与 m05“她转十二万＋聊天写帮我买”都能反对省略代投，后者更直接。纯函数验证 m05＋正确原句会 `miss`。另外，代投成立并不能反驳感情误导同时存在，现行反馈已留住这一点，应保留。

具体改法：接受 m03、m05 各自支撑的追问；m03 追账户安排，m05 追完整委托聊天；都汇入现有 act2 的提交结果核对。若坚持唯一材料，应改题为确实只有该材料能回答的账户安排问题，不能把 m05 说成无关。

### F12 · P2 · 快案二末轮：最重要的冲突原句已经离开本轮可选陈述

定位：[social-feed / nightlife-pattern、apology-post](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/02-one-missed-message.json:239)。

`nightlife-pattern` 目标是已经主动承认的“六次酒吧或者 KTV”，真正反驳的是第一轮“很久没出去了”。本轮又明确说八号 KTV、九号清吧，因此反驳有实质内容；但点六次并不是击中她仍维护的缩小说法。命中后她改定义为“生日毕业不算、没喝醉不算”，这才是值得追的防线。

具体改法：本轮带回此前完整原话“我已经很久没出去了”，让玩家与八号／九号并列核对；问“你的很久是按什么算”。保留生日聚会等真实解释，击中的是对男方和主播省略关键信息，不是夜生活本身。

`apology-and-post` 目标“那是八号的照片”，对质也承认真是旧图，只追没标日期、有没有说明。此处可作普通沟通询问，不能把真实拍摄日期当错误；男方是否看过、是否误会仍未知，不能独占为必须击中的挽回关键。改为可选后续；或提供确实由男方发来的日期误解，才有必要以这条去纠正具体误会。

## 逐环节记录：四主案

每一行按现行顺序列出稳定问题 ID、玩家实际点到的完整句子、实际问法及结论。“铺垫通过”表示问题值得问、能够接主线，但无需制造事实反驳；“反驳／推断纠偏通过”仍受该行列出的证明边界约束。表内同屏比较以本轮全部 `version`／`statements` 为准。

### 案一｜八万与半薪代存

| 顺序问题／源位置 | 被点击的完整原句与实际提问 | 判断、前置与主线回收 |
|---|---|---|
| [credit-living-arrangement:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:513) | 原句：工资卡他自己拿着，每个月转我一半，已经一年多了。<br>问：每个月转你一半，这事当初怎么说的？ | 铺垫通过。她明确说每月给一半，工资卡谁拿没有隐瞒；问当初怎么约直接连到半薪性质，后面 act2 应回收约定，而非把没交卡当矛盾。 |
| [credit-living-arrangement:questionOptions:1](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:539) | 原句：不住在一起，他住他的，我住我的。<br>问：没住一起，平时的其他的钱就是各花各的？ | 铺垫通过。分住与共同吃饭可以同真；补共同开销，为账单分项、房租另付作准备，比追住址本身有用，不算抓谎。 |
| [credit-layoff-gap:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:665) | 原句：可四月以后，他还天天跟我说加班。<br>问：借钱以前，他跟你提过工作出了问题吗？ | 有据追问通过。社保停缴、拒发工资记录与持续加班说法同屏，较其他生活细节更关系奖金周转可信度；回答只到可能不去公司，确切失业由后续结算通知落地。 |
| [credit-layoff-gap:questionOptions:1](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:675) | 原句：我翻到最后，才发现缴费停在四月。<br>问：那四月断缴，是你最近才查到的？ | 铺垫通过。核她何时知情，避免把停缴时间当知情时间；与前问有重叠但尚未重复揭露另一笔秘密。不要把单独停缴当正式离职证明。 |
| [credit-eight-wan-bill:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:859) | 原句：别的我没细算。<br>问：我按着这张账单算过了。两个人一起花的差不多四万，他自己的衣服五千左右。还剩至少三万五，你问过这笔吗？ | 通过（追未说明用途）。账单已取得，四万与五千之外三万五比衣服贵不贵更承重；问用途却得到奖金日期，揭示催款回避。后续留索明细、结案仍未说明，不算已经追出资金去向。 |
| [credit-anniversary-agency:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:994) | 原句：我俩第一次去那家餐厅，纪念日嘛，想吃好一点。<br>问：第一次去，怎么就认准靠窗那一排了？ | 局部可问、核心闭环不合格，见 F05。指定靠窗只是起疑线索，第一次同现任去也可能为真；先接受澄清，不能此刻就说旧图打穿首次同去。 |
| [credit-anniversary-agency:questionOptions:1](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:1004) | 原句：主要贵在酒，他看中一瓶，我说太贵了。<br>问：你之前去的那次，也是过纪念日？ | P1/F05。前问已承认一次，追时间和同行可成立；但本轮酒价目标无关，逼玩家点错事情。 |
| [credit-anniversary-agency:questionOptions:2](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:1038) | 原句：当天只有我发朋友圈，他没发，身边朋友都挺羡慕我的。<br>问：所以你发照片的时候，朋友都以为你头一回来？ | 确认阶段可用，整体仍 F05。朋友羡慕不是“都以为第一次”的证据；实际交流最后锁定两回，才为旧图第三次制造未撤回的矛盾。 |
| [credit-bank-flow:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:1431) | 原句：探店也就是先垫点钱，等合作下来就回来了。<br>问：你说先垫，账号现在挣的钱够把这些开销补回来吗？ | 通过（纠正把未知收益当回款）。设备受益已公开，核心转向“先垫就会回来”；问现有收入及是否所有饭钱有合作承诺，答无合作部分，是对用途解释的有效收窄。后文余额亏空可回收，不能借此否定创业尝试本身。 |
| [credit-bank-flow:questionOptions:1](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:1441) | 原句：设备的分期我可没答应过，那是他自己选的付款方式。<br>问：设备分期是他的。那你自己选的这些探店，没人付的部分，现在拿什么填？ | P2/F08。资金来源值得追，前问已铺好；目标却在设备付款方式，成立的赠礼／分期解释不能替代探店支出目标。 |
| [credit-loyalty-test / act1 / credit-consumption-gloss](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:1642) | 原句：每个月那笔我收了。可吃饭、出去玩也都从里面花，不能光说钱进了我的卡。<br>材料：`credit-fixed-support:summary` | 不合格。F01：转入总额与共同花销不冲突，代存约定尚无前置可核材料。 |
| [credit-loyalty-test / act2 / credit-transfer-was-his-idea](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/01-credit.json:1788) | 原句：是说替我们存着，可他也愿意养我。七月没来，我问他，是怕他又瞒事，不是催他给钱。<br>材料：`case1-bank-flow:r09` | 不合格。F02：缺转不能独证催款动机，命中后才给出续款条件；F03又在收尾撤回承认。 |

### 案四｜六万八垫款与多报分配

| 顺序问题／源位置 | 被点击的完整原句与实际提问 | 判断、前置与主线回收 |
|---|---|---|
| [work-title-for-advance:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/04-workplace.json:454) | 原句：会后他就私聊过来：“你先把场地和礼品费垫了，这场就交给你。”<br>问：到底是你先说能垫钱，他才给你这个活，还是活本来归你，后来才让你垫？ | 铺垫通过。先垫才主办是已说清的交换条件，追她争机会和提额而非被迫独自垫款；后续四千利益与不敢得罪主管回收。不要把争主办本身定成矛盾。 |
| [work-private-process:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/04-workplace.json:543) | 原句：愿意啊，有人专门问下个月还有几场。<br>问：别人愿意先垫，是光算业绩，还是结算时还有钱？ | 铺垫通过。她已提多报款，抢主办比一般业绩更能引出协调费；补五万八结七万，不是反驳她否认有差额。 |
| [work-private-process:fee-followup:1](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/04-workplace.json:570) | 原句：主办能算业绩，主管也说不会让垫钱的人白忙。<br>问：上回多出来一万二，主办能拿多少？ | 通过（接续分配核实）。同句“不会让垫钱的人白忙”可承接谁拿多少；四千/八千让不敢绕过主管有动机，后续 q08 核分配。不应只把锚点短语“主办能算业绩”解作此问完全无关。 |
| [work-private-process:fee-followup:2](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/04-workplace.json:605) | 原句：上回他们的结算单我见过，报下来的比先垫的多。<br>问：那你这次六万八，他也答应多报、再分给你？ | 通过（由旧单追本场）。不把上一场结算当本场到账；本场六万八拟报八万、分四千，直接改变追回哪些钱的判断。 |
| [work-approval-only:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/04-workplace.json:727) | 原句：就这一张图，他发了三次，每次都说“流程在走”。<br>问：三次发来的图，有没有哪一次多了新的内容？ | 通过（重复旧图→查新状态）。原话已经说三次同图，第一句确认可短些；真正新增是没直接查财务、怕四千不好提。材料页再核立项类型，白天去查受理，主线有行动回收。 |
| [work-leader-note:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/04-workplace.json:825) | 原句：下午她们把各自的受理页发过来，连几千块的物料费都挂着。<br>问：她们给你的是什么单，跟主管发的那张一样吗？ | 铺垫通过。她已知其他部门也欠，不能再当首次揭露；问是否同类单据，补财务新页与协调费待解释，合理导向两幕。 |
| [work-split-ownership / act1 / work-process-complete](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/04-workplace.json:924) | 原句：立项和报销不是一回事，我知道了。可她们那几笔会不会也是手续没补完？<br>材料：`case4-department-ledger:q06` | 通过（有边界）。q06 补件要求无、待付而无日期，能纠正“她们也因手续不全”的假设；比旧立项截图更能解释跨部门拖欠。她改争主管答应优先；随后群消息统一月底、继续先垫，收麦改为按受理号催且停止垫款。不能由无补件直接断定公司已无钱。 |
| [work-split-ownership / act2 / work-handler-promise-cleared-her](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/04-workplace.json:1061) | 原句：八万是他部门的包干额度。花不完他拿一点，我跟着忙也拿一点，这不是很正常吗？<br>材料：`case4-department-ledger:q08` | 需要修正。F10：费用名目和私人分配有真实疑点，但“不正常”需先明确外部服务说法，不能以未填字段替代存在与否。 |

### 案三｜彩礼付法与资料范围

| 顺序问题／源位置 | 被点击的完整原句与实际提问 | 判断、前置与主线回收 |
|---|---|---|
| [profile-proof-before-dinner:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/03-profile.json:543) | 原句：他已经说拿不出，我还是让他打了流水。<br>问：他已经说拿不出二十八万八，你为什么还是不信，非要他把流水打出来？ | 通过（问判断依据）。目标含她明知拒绝仍要流水；学费23.8万被当现有支付能力是主线错误推断，后续学费材料纠正。没有直接推出男方确无资产。 |
| [profile-proof-before-dinner:questionOptions:1](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/03-profile.json:577) | 原句：发来以后，我先问：“只有这一张？”<br>问：你觉得他留着钱，那其他账户，你后来追着问过吗？ | 铺垫通过。只给工资卡与不回其他账户已在陈述中，问到今天是否仍不答，固定证据范围；后面表姐说明挑卡、男方上麦回应，保留双方问题。 |
| [profile-dinner-pause:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/03-profile.json:693) | 原句：他筷子停了一下，才说：“本科不是。我工作以后去读的 MBA，学费二十三万八，是我自己出的。”<br>问：他已经承认本科不是那所。你当时为什么没接着问，前面那句“名校毕业”到底怎么来的？ | 通过（追学历误解转成积蓄预期）。原句同时含本科更正和学费；没有把已承认本科不同再设成真相，实际追为何不问来源及学费如何影响判断，材料回收过去支出≠现有钱。 |
| [profile-caller-repeats-label:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/03-profile.json:816) | 原句：我回去以后，把“学校好”说成了“名校毕业”。<br>问：你妈说家里帮不上，彩礼就多拿一点。你也这么想？ | P2/F08。母亲说辞已必播，不是缺信息；问题针对认可加彩礼，目标却是已承认的学历转述。 |
| [profile-family-chat-origin / act1 / profile-equal-conditions](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/03-profile.json:1159) | 原句：我爸已经答应给二十万了。我跟他说我家也出钱，他就别再拿钱还没到当理由拖着领证了。<br>材料：`case3-credential-balance:p04+p06+p07` | 需要修正。F09：核心诉求相关，但已明说未来/先付，属于协商，不是材料反驳；p05同样相关却被判错。 |
| [profile-family-chat-origin / act2 / profile-family-rule-proves-attitude](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/03-profile.json:1284) | 原句：我家规矩就是先看他愿不愿意拿出来。他工资卡有二十八万六，只差两千，不是拿不出，就是不肯。<br>材料：`case3-credential-balance:p03` | 通过（纠正推断）。p03只给28.6万工资卡，不能证明“只差两千就是不肯”。这是对已知资料推断范围的反驳，不是证明他没钱；命中后问本人接不接受，男方上麦明确拒绝付法，并承认不想交全部家底；终局条件未谈拢。 |
| [profile-income-and-card:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/03-profile.json:1715) | 原句：我有八万四，最多拿六万，领证以后添家电、搬家，剩下的我得留着。<br>问：你的六万留到领证后，彩礼要先进你卡里。那婚宴和首饰的钱，你本来打算谁出？ | 通过（协商核实）。同屏她保留余额、婚后出六万，另有男方回应；问婚宴谁出能直指双方出资时点与用途，比停车AA更主线。后面取消饭局和不改条件回收，不拿团购证明品行。 |

### 案二｜裁图、代投与十二万

| 顺序问题／源位置 | 被点击的完整原句与实际提问 | 判断、前置与主线回收 |
|---|---|---|
| [tony-list-as-dating:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/02-tony.json:584) | 原句：我把截图发到后台了，钱还在他那儿，我才打进来。<br>问：你发来的图，每一行怎么都在右边同一个地方断了？ | 通过（材料完整性）。已交裁图有同一边界截断，问原图是否完整有可见理由；承认裁右栏，后续必须追其内容/动机，不能再揭一次裁图。 |
| [tony-list-as-dating:questionOptions:1](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/02-tony.json:604) | 原句：我往下划，一排名字，全是女的。<br>问：你看到亲密度那栏，最在意哪一行？ | 铺垫通过。全女名字没有被反驳；问她在意自己那行，补关系诉求，与后面仍不愿省去感情因素衔接。 |
| [tony-exclusive-voice:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/02-tony.json:742) | 原句：后来他总给我留最晚那档，也叫我自己人。<br>问：他亲口说过你们在谈吗？ | 通过（核关系说法范围）。自己人、留晚档足以问是否确认恋爱；回答没有证明排他承诺。白天观察他也叫熟客自己人，后面不能据此否定真实照顾或一概排除恋爱误导。 |
| [tony-list-columns:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/02-tony.json:848) | 原句：金额、产品、后面怎么跟。<br>问：你为什么偏偏把金额和产品那几列裁掉？ | 通过（追省略的作用）。裁图已承认，本次问为何裁金额/产品，新增加怕被追问为何转钱；直接服务代投/恋爱追款冲突。 |
| [tony-bar-rumor-hangup:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/02-tony.json:967) | 原句：小姐妹提过一嘴，说有个东西利息挺高。<br>问：小姐妹当时到底跟你说了多少？ | 有据追问通过。她已说钱在Tony处，却把高息说成只听热闹；追“只提一嘴”补门槛与另问过人。白天小姐妹核她主动问够不够，第二夜追委托，敲门由警方核借款回收。 |
| [tony-who-messaged:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/02-tony.json:1071) | 原句：昨晚来的是警察，说借钱给我的人涉嫌放高利贷，来核实借款。<br>问：是你自己的借款。那跟 Tony 这十二万，你为什么要先分开说？ | 通过（关联核实）。警方核借款与Tony无直接案情关系可以为真；问题不应否认警方未查Tony，而是问为何把自身借钱省略。场尾补想多凑钱、工作来源，借款金额仍未知。十二万此前已在补交材料出现。 |
| [tony-caller-benefits:questionOptions:0](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/02-tony.json:1189) | 原句：是我转的。<br>问：是你开口让他帮你买，还是他先劝你把钱给他？ | 通过（委托起因）。转账已知，问谁先开口、说了什么、收到什么凭据，是钱款主线最有用信息；后续不得把主动买当Tony已履行代投。 |
| [tony-next-push-column / act1 / tony-romance-only-claim](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/02-tony.json:1332) | 原句：这十二万我当然要追回来。你就按他借谈恋爱收我钱来说，帮我买产品那段先别提了。<br>材料：`case2-member-training:m03` | 需要修正。目标省略代投确为核心；PRESS tony-heard-threshold-before 解锁隐句有门槛旧线索，代投已认也不冲突。F11所列m05被判错须修，不能把恋爱与代投设成互斥。 |
| [tony-next-push-column / act2 / tony-atmosphere-was-his-alone](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/cases/02-tony.json:1472) | 原句：他既然发了已提交，那就是买进去了吧。现在退不出来，应该是产品那边卡着。<br>材料：`tony-submission:status` | 通过（纠正推断）。已提交页缺产品、户名、份额、成交日期，不能支持“所以买进去了/卡在产品”。同屏其他句承认主动转账、没拿到合同，均未被误当谎言；正确行动转向要求收款人交合同和正式回单，尾声继续追十二万而非断定产品内已亏损。 |

## 逐环节记录：咖啡厅与三个快案

### 咖啡厅序章

| 环节 | 目标、前置和同屏比较 | 结论与回收 |
|---|---|---|
| `hotel-denial` → `chat`／`hotel` | “我没在外面开过房。”酒店相关材料可见，优先查具体可证的住宿而非直接证明“其他关系”，顺序合理。 | F04：订单支路可核住宿；聊天支路不能等同。后文承认独自住宿，保留顾*是否上楼未知。 |
| `money-denial` → `parallel-transfer-ledger` | “我跟顾*之间没转过钱。”第一幕也提过但尚未解决；改口后继续坚持，而三笔双向流水直接相反。 | 通过。比已认住宿、没人证明上楼更值得打。她转辩“借款、已经平”，玩家只确认存在往来；未借三笔去证明情感性质、钱已平、孩子生父。后续家庭账／亲子调查各有自己的来源。 |

### 快案一｜什么都不图

| 轮次／对质 ID／源位置 | 可选目标原句（各入口） | 结论、信息增量与回收 |
|---|---|---|
| `sales-version` / [sales-soft-talk](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/01-no-conditions.json:361) | `sales-voice`：我脾气确实不好，好听的也不会讲。 | F06，不适合作为必中核心。恋爱语境的不会哄人可与销售技能同真；本轮更应正常了解她希望如何相处，后面再回收推荐请求。 |
| `family-version` / [two-fathers](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/01-no-conditions.json:392) | `benefactor-source`：去年买的时候，爸爸给了我一百万，我又添了一点才买下来。<br>`benefactor-generosity`：他在我身上一直挺舍得的。 | 通过（核指代）。前述亲爸收入有限并不能数学上排除积蓄，但主播已明确把购房者理解成伤腰亲爸，她继续顺应“他很舍得”；问是否同一个人有依据。回答确认非亲生后仍拒绝解释关系，改变替她介绍时能确认哪些资助事实。不能推出性交易或持续每月资助。 |
| `personal-concern` / [fertility-slip](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/01-no-conditions.json:440) | `report-disclosure`：哪怕以后他身体不好，或者是我不能生孩子，也能商量着过，别一听就走。 | F06，不适合作为必中核心。没有检查前置，举例可正常解释；靠承认检查才让这一轮成功，后文不应把生育问题当人品或可信度证据。 |
| `actual-request` / [hidden-standards](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/01-no-conditions.json:471) | `mortgage-pressure`：能帮我减轻点房贷压力，那就更好了。<br>`actual-standard`：我也看了，先别急吧。 | F08。本轮月供压力是已主动补充的要求，真正新增的是前任与她因月供分歧。改锁“前任只嫌脾气”的旧原话，回收成介绍前说明住房与分担约定，不否定拒绝一个候选人的合理性。 |
| `actual-request` / [useful-soft-talk](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/01-no-conditions.json:506) | `soft-talk`：您要是先跟他说一句，我这人还可以，他至少愿意见我一面。 | 通过（拒绝无依据背书）。本轮她要求新认识的主播评价可靠，与介绍诉求直接相连；此前出资人和月供条件不清。她争只要先见面，后文主播要求先说清再决定介绍，角色即使不服也完成闭环。不要把客气称呼当“原来会哄人”的证明。 |

### 快案二｜只是一条消息没回

| 轮次／对质 ID／源位置 | 可选目标原句（各入口） | 结论、信息增量与回收 |
|---|---|---|
| `surface-story` / [care-or-display](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/02-one-missed-message.json:496) | `emotion-or-display`：朋友在下面问是不是谈恋爱了，还有人说羡慕，我回了几个表情。<br>`flower-request`：我有次刷到一束花，顺口问他能不能也送我一束，下次他真带了一大束来。 | F07，不适合作为必中的反驳。已知她要花、喜欢羡慕，包来源是新增背景；不推翻沟通需求，不能解释冷淡。 |
| `surface-story` / [message-or-drunkenness](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/02-one-missed-message.json:528) | `missed-message-state`：十一点五十二，他问我喝得怎么样，我回‘还行’；十一点五十八，他又问我准备几点回去。 | 通过（有据询问后收窄）。23:52回还行、六分钟后断联，精确时间足以问当时状态；承认不舒服却装没事，改变“只漏一条消息”的框架。单凭间隔不能预先证明吐/断片，下一轮回程记不清才补齐。 |
| `changed-version` / [third-person-at-table](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/02-one-missed-message.json:560) | `third-person`：桌上混着点了几种鸡尾酒，还有龙舌兰，后面又有人点了一轮。 | 通过。刚才只讲妹妹，忽然出现“别人加一轮”；问是谁比追酒种更影响不完整交代。回答为妹妹男性朋友，继而解释为何省略，后轮核男方获知时间；不推出越界。 |
| `explanation-to-him` / [how-he-knew](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/02-one-missed-message.json:304) | `how-he-knew`：后来也解释过了啊。 | 通过（接续）。第三人已认，此轮击中“后来都解释了”的范围，问原话后发现是在说漏口中带出；影响挽回时是否愿一次讲完整，非重复发现男性。 |
| `social-feed` / [nightlife-pattern](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/02-one-missed-message.json:317) | `nightlife-pattern`：不对，我刚重新数了，是六次酒吧或者 KTV。 | F12。八号/九号能反驳旧“很久没出去”；当前被点的是她已经承认的次数，应让旧原话重新可选。后续只揭缩小经历，不把生日/聚会当行为过错。 |
| `social-feed` / [apology-and-post](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/02-one-missed-message.json:681) | `apology-post`：他可能以为是喝断片那晚拍的，其实不是，那是八号的照片，我晚了两天才发。 | F12。旧照片解释成立，追未标日期可作沟通铺垫；没有男方看图和误会的证据，不能把道歉当天发旧图认作核心矛盾。 |

### 快案三｜纯属虚构

| 轮次／对质 ID／源位置 | 可选目标原句（各入口） | 结论、信息增量与回收 |
|---|---|---|
| `people-and-post` / [attention-asymmetry](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/03-labeled-fiction.json:406) | `attention-asymmetry`：这篇长文由他公开发布，很快被大量转发。 | 普通评论，通过。作者主动发布说明想让公众看，不证明净获益或私密指控；给后续舆论施压作背景，本轮不必强改成说谎。 |
| `people-and-post` / [career-asymmetry](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/03-labeled-fiction.json:412) | `career-asymmetry`：女方是曾经站在流量顶端的演员，播出平台、品牌和公众形象都是她的职业资产。 | 普通评论，通过。职业风险是可能想平息争议的背景，后续仍不把它当授权中间人或承认指控。 |
| `people-and-post` / [labeled-fiction](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/03-labeled-fiction.json:418) | `labeled-fiction`：正文指向现实人物并配图，文末却留了一句『纯属虚构』。 | 核心冲突铺垫，通过。点名配图却标虚构，材料内可见；后面要求认全文完成回收，不能以此认定私下事实。 |
| `money-and-reply` / [single-source-money](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/03-labeled-fiction.json:424) | `single-source-money`：长文说，谈婚期间三千万打进女方家里账户，他已经为这笔钱起诉；男方的原话是，她嫌一天限额一百万太慢，让我准备五张卡一起打。 | 来源核对，通过。五张卡等细节来自同一作者，起诉不自动为全文保真；后文仍把已转的主张和未转分开。 |
| `money-and-reply` / [money-split](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/03-labeled-fiction.json:430) | `money-split`：他又写，后来女方开口要五千万美元；他的回答是『让我想想』，这笔钱没有转出去。 | 普通核账，通过。五千万美元明确没转，不能与三千万相加；对钱款主线有用，无须假造反驳。 |
| `money-and-reply` / [reply-avoids-money](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/03-labeled-fiction.json:436) | `reply-avoids-money`：女方说自己从没因为金钱出卖爱情，但对三千万，一个字没回，代孕与更大开价也没有逐项回应。 | 核心回应缺口，通过。钱款指控与只谈感情的声明不接题；只评价没回应，不推定收到的钱必须退或其余指控属实。 |
| `settlement-rumor` / [settlement-inference](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/03-labeled-fiction.json:442) | `settlement-inference`：男方写，她有演出、平台和品牌合作，事情闹大了会影响工作，所以她想尽早平息争议。 | 普通推断核对，通过。职业影响可以解释急着谈，但不能证明授权；跟下一项相接且不依赖一定选下一项。 |
| `settlement-rumor` / [mediation-authorization](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/03-labeled-fiction.json:448) | `mediation-authorization`：现有材料是男方对这次传话的描述，没有中间人的独立原话。 | 核心来源缺口，通过。现有只是男方转述中间人，没有独立原话；目标已把缺口说出，玩法是材料点评而非发现隐藏矛盾，保留这种定位。 |
| `settlement-rumor` / [rumor-as-leverage](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/03-labeled-fiction.json:454) | `rumor-as-leverage`：在这篇长文刷屏前，网上已经出现代孕传闻，也传出有人提前找中间人谈。 | 核心推断纠偏，通过。传闻与来谈不等于本人认账；后文逼认全文把施压意图落到公开条件，未靠招认。 |
| `settlement-scope` / [settlement-scope](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/03-labeled-fiction.json:258) | `settlement-scope`：撤声明、认长文都不在。 | 核心冲突，通过。诉状三千万与公开撤声明/认全文的加项并列，直指追钱之外的叙事控制诉求。 |
| `settlement-scope` / [public-leverage](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/03-labeled-fiction.json:466) | `public-leverage`：文末写着虚构，收尾却说她自己清楚；我手里还有，今晚先不放。 | 核心冲突，通过。未公布材料却要求先认全文，实际公开动作足以评价施压；不能猜未公开内容。 |
| `settlement-scope` / [moral-conclusion](/Users/pkuiloveoov/code/love/content/packs/steam-demo-01/quick-cases/03-labeled-fiction.json:472) | `moral-conclusion`：他开出三条：退三千万、撤回公开声明、公开承认整篇长文都是真的。 | 核心冲突，通过。虚构标注与要求对方认全文，同一来源内相撞；结尾只评价公开双重标准，没有补出外部私密真相。 |

快案三的 12 项不是 12 次强制反驳。每轮 `completionMode: any`，普通背景评论也可推进；末轮三个入口都落到诉外施压与“虚构/认全文”的主矛盾。未把前几轮的人物背景、证据来源点评误判成必须具备独立谎言的关卡。各轮先读完本轮 turns，后续又复述必要的公开材料，所以跳过同轮另两条评论不会凭空得知新的私密事实。

### 普通追问、干扰项的核对

这些不增加核心反驳计数。当前主案逐句回放按钮实际额外读取的 `reviewProbes` 共五项；其他写在 `casualQuestions` 的旧询问不能自动当作玩家必经信息。

| 稳定 ID | 目标／具体行为 | 结论 |
|---|---|---|
| `credit-layoff-gap:reviewProbes:0` | “这个月那笔没来”→问等奖金却催今晚转款；不扣耐心 | 可用的普通主线追问，重复知情不作为新揭露。 |
| `credit-layoff-gap:reviewProbes:1` | “我不放心”→问是否以前每月查工资；会扣耐心 | 原话明确是这次才要，否定主播擅自推广范围合理，不是把成立解释判错。 |
| `credit-anniversary-agency:reviewProbes:0` | “主要贵在酒”→在顺序不匹配时可能问她是否非要酒；会扣耐心 | 她此前已说自己嫌贵、男方点，驳回该强加责任合理；但这同一目标又承载必经的旧到店问题，F05 的错位会使实际选择更不直观。 |
| `credit-anniversary-agency:reviewProbes:1` | “我没再拦”→断言不拦就是她让点；会扣耐心 | 她解释拦过一次成立，作为错误追问的反馈合理。 |
| `credit-bank-flow:reviewProbes:device` | “设备的分期我可没答应过”→问是否谈过一起还；不扣耐心 | 普通边界核实，可保留；答末“这个我昨晚也说了”缺必经原话。昨夜只说设备在家，不等于说过赠礼和未约定共同还款，宜删“昨晚也说了”。 |
| 快案二 `founder-busy` | “自己开公司”→问会不会忙得顾不上听歌 | 非主线假设，未提供近期工作变化，不能解释突然冷淡；不宜写成已证明他就是忙，当前未这样定论。可作普通背景询问；若保留扣分，应说明与突然变化缺关联，而不是仅以她不愿谈作失败依据。 |
| 快案二 `family-level` | “我们家就普通家庭，A7吧”→问家庭条件具体差距 | 此时未击中冷淡事件，作为非关键项可识别；普通背景问题本身不等于错，别用其失败证明她只图钱。 |
| 快案二 `age-gap` | “我二十六”→问九岁年龄差是否有关 | 年龄没有新变化，优先级低于当晚事件；她答“这不是这次不回的理由”仅是她判断，结案保持男方真实原因未知，不应由错误反馈认证原因已排除。 |

## 材料、可跳过信息与回收补查

| 检查点 | 当前判断 |
|---|---|
| 案一匿名旧图的时间与来源 | 第一夜 hangup 提供匿名来信；线性 interlude 查看旧图，第二夜原图保留“第三次”和评论。不是临时补发。两年前早于现任一年半，无法反驳首次与现任同去，只能反驳后续说的总次数/同行类型。 |
| 案一设备受益、合作开销 | 现行 scene 6 已明确“给我买、一直用”，没有再次追设备送谁；旧 scene 4 不可玩。问无合作的饭钱由谁填有主线价值，问题是第二问锚点，见 F08。 |
| 案一房租及代存 | 白天房租已必经看到；具体是谁住、是否另付由证词墙 beforeVersion 必播确认，未依赖可选旧回拨。代存约定则仍到 act2 才出现，见 F01。 |
| 案一借款与信托 | `credit-leveraged-trust` 正确反馈保持相邻进出≠同一笔，需保留。但后续证词“他借钱买信托”和主播“借钱买理财”先于案后 respondentNote 的明确承认。人物可怀疑，宜改成“那两笔信托/他那笔借款”，不要先当已核定。不是 r09 反驳动机的补证。 |
| 案一所有材料题 | `credit-after-layoff-spend` 留三万五待追；`credit-anniversary-footprint` 局部能打次数；`credit-fixed-support` 只解释十五万预期；`credit-leveraged-trust` 保留钱路未知；`credit-history-pages` 核入账中断，不能替 r09 证明她动机。共5题。 |
| 案四材料来源 | `work-budget-timeline` 上一场多报结算与本场未付分开；`work-approval-missing` 立项不等于报销/付款。白天供应商先说名目，第二夜才提供此前批次回执；未把此前返费当本场四千已到账。两题通过边界检查。 |
| 案四第一幕是否重复立项发现 | 墙上承认“立项和报销不是一回事”，新追其他部门手续齐全仍拖，不是再发现旧图性质；后续主管威胁与继续垫款推动她按受理号催、停止垫款，回收成立。 |
| 案三母亲说辞 | 家境调查与加彩礼理由在 `afterVersion` 必播，不是可选问答独占。问题是不能点到该段，见 F08。`profile-mba-gap` 纠正过去学费→当前积蓄，成立；`profile-income-flow-gap` 回收付钱时间/账户/用途，成立。 |
| 案三介绍链材料题 | `profile-introducer-double-speak` 问“哪件还要向本人问清”，却将“稳定是多少钱”判错；与正确项“有没有看过工资/流水”都属合理核实。宜允许普通追问，或把题面改成“这两段能否说明核实过收入”。这是次要公允性问题，未升级为主案核心断裂。 |
| 案三父亲二十万与自己六万 | 父亲资金时点、用途由幕内材料明确，后面上麦又问她自己的钱；未把六万设成在父亲二十万之外已共同投入。男方何时知道完整条件由上麦指出，只能认未谈拢，不能总结双方已接受共同账户。 |
| 案二提前知道十二万 | 白天完整名单 m03/m05 和第二夜先对圈注提供12万，因此警方段提12万不是凭空知道。各圈注可以不同，但基本金额在必经材料中。 |
| 案二合同缺失与产品风险 | scene 5 必问已说只有提交页；act2 新增的是她把提交当买成、Tony面对买成哪笔仍回避，并非首次发现合同缺失。`tony-roster-column`、`tony-spend-and-referrals` 在尾段整理完整材料而非再次揭露裁图/谁开口；两题可以保留。 |
| 案二 PRESS 重复语气 | `tony-heard-threshold-before` 的“后来我确实问过”在 scene 5 已认，作为解锁她要求删代投的入口可用，但宜直接问“你既然主动问过，为什么现在想省掉”，避免又演第一次承认。不是主线事实缺失。 |
| 快案一月供与持续资助 | 九十万为原贷款，不是已核当前余额；亲爸与购房出资人不同有口供，出资关系仍未知。最后“找人接续供养”只可作为主播有依据的怀疑，不能当已证实持续资助中断。现行复盘用“我更信”保留了推断口吻，重点应继续落在介绍前说明条件。 |
| 快案二晚发图与熬夜 | 发布凌晨5:17不能独自证明每次喝醉或玩到天亮；旧图发布日期不能当拍摄日。当前对质允许八号旧图解释成立；结案回收应限定她实际说的“有两三次太晚住妹妹处”，不要扩大成每次深夜照片对应彻夜未归。 |

## 建议的修订次序及复验标准

1. 先修案一 F01–F03，让代存约定在正式反驳前有可核原话、把动机条件先问出，再保持承认到收麦。同步检查所有“你刚才说”、`callerQuestion`、`deepFollowup` 和最终引用。
2. 修咖啡厅 F04 的两张证据强度不等价；再决定餐厅 F05 是补主线责任链，还是保留为普通人物核对。不要为了保住反驳数量补无来源的付款结论。
3. 修主案锚点及替代材料判定 F08–F11；先写出玩家能读到的目标原句，再接具体问答，不能只把 sourceAnchor 换成恰好命中的任意文字。
4. 快案一、二先把成立解释归回普通交流，缩减不成立的必须击中点；保留两个爸爸、消息状态、第三人、旧原话缩小及推荐背书这些真正影响诉求的环节。
5. 修改后的内容校验只证明结构一致；语义复验须逐条回答：目标维护什么、当前可见哪条证据与它不相容、命中后撤回哪一部分、什么仍成立、后文哪一步因此改变。再独立跑受影响路径、错误但合理的材料、跳过可选问答路径及中途读档。此次没有执行这些修改和浏览器复验。

## 验证记录与未验证范围

- 已阅读项目现行 `case-scriptwriting`、`audit-case-spine`、`detective-plot-coupling-review`，以及前者的当前方向、运行时接入、审读流程；近期 `credit-replay-repairs-2026-09-14.md` 仅作背景，旧人物卡与旧评审中的“待接入”没有替代当前源内容。
- 已核当前 JSON、当前生成连续台本与运行时消费者。`node scripts/build-content-index.js --check`、`node scripts/build-readable-script.js --check` 均成功，未重建或改写生成物。
- 直接调用 `decisivePresentOutcome`，在独立内存对象中验证案三 act1 的 p05＋正确目标、案二 act1 的 m05＋正确目标均返回 `miss`；没有使用或写入浏览器存档。
- 未新跑 `npm run check` 全套、浏览器真实点击、视口、音频、存档迁移、每条耐心耗尽分支、桌面包。报告的“通过”是当前文本和消费者下的叙事判断，不等于当前版本已完成试玩验收。未验证所有不同圈注组合的完整 UI 路线；已按最少圈一行的规则检查关键固定续文是否有独立来源。
- 系统 git 命令因未接受 Xcode 许可而无法执行，未改系统许可、未操作 git。基于工作目录现有文件审查，包含当前未提交内容；没有用 HEAD 覆盖任何文件，也未声称核出了完整 git diff。
- 本次不判断剧中现实法律、金融或医疗规则的外部准确性，不对宸直后续未公开案件补事实；本报告只检验当前可玩叙述的来源、反驳与闭环。

### 内容快照

以下为审查交付时八份真源文件的 SHA-256，供后续复审区分版本；场景名、问题 ID 与链接位置才是修订定位，不以固定整句测试锁死文风。

- content/packs/steam-demo-01/cases/01-credit.json：`946ca4b212d28334c7e2a70c3152256c9e6469f4b14ff462fb2e98c6bc1d1193`

- content/packs/steam-demo-01/cases/04-workplace.json：`a9f974a4a941f0664ec15724b6198e637f4f900c47ed06ee270bf76d121f1a33`

- content/packs/steam-demo-01/cases/03-profile.json：`deba0d0b15e0b575daa1ef3e0a998a952898c31898c35072ff9f5ce3e5e63d5f`

- content/packs/steam-demo-01/cases/02-tony.json：`e7916cbd75e280ae811741155acf289b1b9bc6b03fc64ac28e7e186e0ca62e30`

- content/packs/steam-demo-01/quick-cases/01-no-conditions.json：`d91595453b55955ddb9841375b2964ea523d4813c14334bbf9bc6534e3c2fe32`

- content/packs/steam-demo-01/quick-cases/02-one-missed-message.json：`5d22c71b70e4ff40a5d60a0c9d9d0efcbdb1db9fdefe3b8e1c45c68650d68cd2`

- content/packs/steam-demo-01/quick-cases/03-labeled-fiction.json：`ab5e327e672ac0aba7b64fcc88b08ee7decb3a40d8a25d235ac7e65338dac514`

- content/packs/steam-demo-01/manifest.json：`664e0aa05275c6d3ba43653946b48dd5d576b38363bbf6eda437eb06acd0769e`
