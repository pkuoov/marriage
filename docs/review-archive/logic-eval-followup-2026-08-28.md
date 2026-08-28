# 8/25–8/27 逻辑审查跟进核验（2026-08-28）

## 1. 总判

Grok 的审查框架基本有效，但旧结论不能原样当成当前结论：序章教学与 8/26 四主案、序章逻辑项已经修齐或可按设计放行；当前仍有 **7 条**没有闭合，全部集中在两则快案，其中 **4 条是上场逻辑仍在**（Q1–Q4），**3 条是章节卡、角色卡或时间线没有跟上可玩真源**（Q5–Q7）。未发现超出 D1–D5 的新一类硬伤。

D 类剩余分布：D1 作者账本双开为 Q2、Q6；D2 同一句两次发行已由 L3 修掉；D3 知情不接力为 Q3、Q4；D4 试金石不合格为 Q1；D5 文档比上场多一场戏为 Q5、Q6、Q7。

## 2. 逐项核验表

| ID | 状态 | 现稿位置（文件 + 字段或引句） | 现句摘录 | 归类 | 备注 |
| --- | --- | --- | --- | --- | --- |
| T1 | 已修 | `src/ui/screens/recapScreens.js:247-270,323-339`；`content/packs/steam-demo-01/manifest.json` → `cafePrologue.cafe.claimStatements/evidencePair` | 原句含「我没去澜桥酒店。」；材料按钮为「把这张材料压上去」 | 教学 | 玩家先选原句，再从两张材料中亲手选一张；错句会触发妻子的挡回台词，不是只禁用按钮。按钮没有替玩家点名正确材料。 |
| T2 | 已修 | `scripts/smoke-browser-replay.js:295-303`；`src/ui/screens/recapScreens.js:247-270` | 页面不再出现「教学 ·」 | 教学 | 当前没有 `教学 · 1/2` 或同类徽章；smoke 还反向禁止该字样。 |
| T3 | 已修 | `src/ui/screens/recapScreens.js:247-280`；`manifest.json` → `cafePrologue.cafe.transferEvidence` | 流水只在钱款否认后进入桌面 | 教学 | 酒店原句与材料阶段只显示聊天、酒店两张卡；第三张流水在酒店对质完成并出现钱款说法后才渲染。 |
| T4 | 已修 | `src/ui/screens/recapScreens.js:411-438`；`src/runtime/prologueCafeModel.js:49-50` | 只播放玩家所选路线的回告 | 教学 | 「两边都会查」已删除；`cafePrologueOrder` 只存并播放所选路线，开播前存在信息差。 |
| T5 | 已修 | `manifest.json` → `cafePrologue.cafe.evidencePair.secondHitLines`；`scripts/smoke-browser-replay.js:339` | 「上面只有我，没有顾*。」／「没有他上楼的东西。」 | 教学 | 林旭阳没有再越权说调监控；现有材料只打穿「没去过」，没有把「一个人住」自动定死。 |
| T6 | 已修 | `cases/01-credit.json` → `credit-living-arrangement`；`scripts/verify-logic.js:3145-3154` | 「一年多。每个月都转。」 | 教学 | 第一夜只交付固定转钱和一年多；测试明确禁止墙前出现「十四个月」「一万七千五」「17500」。 |
| L1 | 已修 | `manifest.json` → `cafePrologue.cafe.legalRequests.zhaoRole/legalClaimLines`；`characters/zhao-lawyer.md:24`；`scenes/chapter-06-scene-01.md:24-30` | 「他请我来……我不是他的诉讼代理人。」 | D1 | 角色卡、上场台词、场景卡和 verify/smoke pin 已统一为：接受当场咨询，协助理账，不代理诉讼。已搜不到「她没有接受男方委托」这套互斥口径。 |
| L2 | 已修 | `cases/01-credit.json` → `openingDialogue`、`credit-layoff-gap`；`scripts/verify-pack.js:2311-2321` | 「我刚转到后台那段，你听见了吧？」／「后半段他还在催你今晚转。」 | D3 | 接通双方都记得冷开场语音；随后问信用卡类型和八万是补充信息，不再是假装第一次听见催转。第一夜后段也改成回放核对。 |
| L3 | 已修 | `cases/01-credit.json` → `credit-loyalty-test.version`；`scripts/verify-pack.js:2398` | 「他又把开播前那条语音发了一遍。」 | D2 | 第二夜明确是旧句再发，下一条才是最低还款金额；测试反向禁止「现在又来了一条语音」。 |
| L4 | 已修 | `cases/03-profile.json` → `openingDialogue`、`rageBaitContract.debts[].issue.quote`；`scripts/verify-logic.js:3200` | 「我才知道我妈已经先托介绍人去问了彩礼。」 | D1 | 开场和债务字段已使用同一实词；手写真源未再搜到「我妈背着我」。 |
| L5 | 已修 | `chapters/chapter-06.md:29-39`；`scenes/chapter-06-scene-01.md:24-30`；`plot/timeline.md:26-28`；`characters/prologue-cafe-cousin.md:14` | 咖啡厅逼问鉴定；散场后停车场才谈个人委托初检；压力来自录像、录屏和剪辑 | D5 | 文档不再多出见孩子安排、孩子出镜、桌上初检或礼物施压。 |
| L6 | 设计通过 | `manifest.json` → `cafePrologue.cafe.evidencePair.chat/hotel`；`cases/01-credit.json` 的四月、七月缴费口径 | 「预订邮件同步到家里的平板，订单还在。」 | D3 | 酒店订单已有来源；21:18/21:24 及三笔流水仍守住材料边界。五月、六月对应漏缴两个月，和七月停转不冲突。 |
| Q1 | 仍在 | `quick-cases/01-no-conditions.json` → `turns[1]`、`turns[2]`、`confrontations.no-house-low-income` | 「年龄大我五岁以内。」／介绍对象「三十一」／对质仍称「符合条件」 | D4 | 来电人二十四岁，口头上限是二十九；三十一岁的试金石本身不合格，拒绝它不能证明她另有隐藏门槛。 |
| Q2 | 仍在 | `quick-cases/02-one-missed-message.json` → `turns[3]`、`ending.summaryPages[1]`；`scripts/verify-logic.js:989` | 上场：「隔很久只回一句『听了』。」复盘：「他不回歌，倒是回了花。」 | D1 | 复盘把“回得慢且只回听了”写成“不回”；测试仍在 pin 错误复盘句，形成可玩原句与作者总结双账本。 |
| Q3 | 仍在 | `quick-cases/02-one-missed-message.json` → `turns[8]`、`confrontations.nightlife-pattern.lines[0]` | 已报：「最晚一张凌晨五点十七分。」对质：「三次过了凌晨四点。」 | D3 | 对质前玩家只听见一个明确时间，三次的其他时间没有被人物或材料念出；主播引用了尚未上场的数据。 |
| Q4 | 仍在 | `quick-cases/02-one-missed-message.json` → `confrontations.drunk-silence.lines[0]`、`logicContract.sourceDoesNotProve` | 「那时候你已经喝得难受，只是不想让他知道，对吗？」 | D3 | 合同明写六分钟不能独立证明醉酒；问句却把“已经难受”和“故意不说”一起当作前提。末尾加“对吗”没有消除预设宣判。 |
| Q5 | 未齐 | `quick-cases/01-no-conditions.json` → `disclosureRounds[0].requiredConfrontationIds`；`chapters/chapter-05.md:30` | JSON：首轮同时要求 `two-fathers`、`fertility-slip`；章节卡：等整通电话结束后再选 | D5 | 上场时机已经明确在第一轮，章节卡仍平白多等一整通电话；不是人物改口，而是文档时序离群。 |
| Q6 | 未齐 | 两则 quick-case 的 `ending`；`chapters/chapter-05.md:35`；`docs/quick-detective-mode.md:22,39`；`characters/quick1-caller-luo.md:32-34`；`characters/quick2-caller-zhou.md:6,20,53`；`plot/timeline.md:29-30` | 上场保留 unknown；文档写「经济交换」「供养者」「骑驴找马」；快案 2 角色卡同时写二十七和二十六 | D1 / D5 | 章节卡、模式说明、角色卡和时间线的判断重于可玩结案；快案 2 年龄也在同一角色卡内双开。JSON 和现有逻辑测试反而明确禁止把“供养”坐实。 |
| Q7 | 未齐 | `scenes/chapter-05-scene-01.md:18-19`；`plot/timeline.md:29`；对照 `docs/quick-detective-mode.md:5,13,28` | scene：十组问答且评论区补线索；timeline：前十组、后七组；现模式：无弹幕裁判，6+5 / 6+2+5 | D5 | 可玩结构和模式说明已更新，scene 与 timeline 仍多出评论区接力并沿用旧话轮数。 |
| Q8 | 设计通过 | `quick-cases/01-no-conditions.json` → `two-fathers`；`quick-cases/02-one-missed-message.json` → 日期、时间与第三人追问 | 「亲爸一个，继父一个。」／八号照片、九号断片、十号发图／「这个『他』是谁？」 | D3 | 两个爸爸是接得上的解释；八、九、十号和 23:52–23:58 成立；第三人是从来电人先说漏的“他”追出，不是主播越权知道。 |

## 3. skill 过刚表

| 条文 | 是否仍在指挥现稿 | 一句话建议（本次不改文件） |
| --- | --- | --- |
| `project-skills/case-scriptwriting/SKILL.md:1315-1316`：冷开场后「仍按完整因果首次取证」 | 部分。L2/L3 的现稿和测试已优先执行知情接力，不再服从“同一句还能首次听见”的有害读法；但条文原句仍容易让下一轮改稿把旧信息当新信息。 | 把“首次取证”拆成两件事：已听见的原话必须被人物记住；尚未出现的金额、材料与因果仍由玩家首次取得。 |
| `project-skills/lawyer-speech/SKILL.md:23`：「必须听出替谁办事」 | 是，但当前没有造成冲突。赵律师已经说清男方请她做当场咨询，同时明确不代理诉讼。 | 明写“咨询方是谁”不等于“诉讼代理谁”，不要要求每场都复读固定身份句。 |
| `project-skills/case-scriptwriting/SKILL.md:283-284`：结案三段律、判断不能被边界句撤销 | 是，而且仍在把角色卡/章节卡推向“经济交换、供养者、骑驴找马”等重判断，和 quick-case 的 `unknown` 对打（Q6）。 | 增加上限：判断不得超过 `confirmed`，也不得与 `unknown` 冲突；拒绝介绍、停止联系等行动结论可以独立成立，不必补一套隐藏人生动机。 |
| `project-skills/case-scriptwriting/SKILL.md:276,438` 与 `scripts/verify-pack.js:1424-1425`：`sourceAnchor` / rageBait 逐字匹配 | 是。L4 已因此保持开场和债务字段一致，目前没有冲突；风险在于把索引字段误当成第二份台词真源。 | `sourceAnchor` 对当前播出句继续硬校验；rageBait quote 降为引用索引或自动取当前原句，避免另存一份逐字化石。 |
| `project-skills/case-scriptwriting/SKILL.md:272`：异常可在当前轮初始陈述后追问 | 是。JSON 正确放在第一轮；章节卡却把“首轮后”误读成“整通电话后”（Q5）。 | 将“首轮”改写为“当前 disclosure round 的初始陈述阶段结束后，不是整通电话结束后”。 |
| `project-skills/audit-case-spine/SKILL.md:61` 的单次揭示账 vs `case-scriptwriting/SKILL.md:1316` 的冷开场未来切片 | 部分。现稿靠“旧句再发”避开了冲突，但两条规则仍可能分别要求同一句既已揭示、又在后文首次取证。 | 单次揭示账优先；冷开场出现过的句子，后文只能重放、补材料或改意义，不能再次写成首次听见。 |
| `scripts/verify-pack.js:2311-2321` 的 PACK-017A 开场 pin | 是，但已不再强迫 L2 失败：它先校验“记得后台语音”，再校验信用卡信息位于八万之前，并未要求主播装作没听见。 | 保留信息顺序和知情连续性的语义断言，逐步减少对固定行号、固定句形的绑定。 |

## 4. 剩余 P0 清单

- Q1：把快案 1 的试金石年龄放回「大五岁以内」的有效区间，再核对质仍只证明她拒绝了一个确实符合口头条件的人。
- Q2：把快案 2 复盘改回“歌隔很久只回了听了”，并移除 `verify-logic` 对「他不回歌」的旧 pin。
- Q3：在“三次过凌晨四点”进入主播嘴前，让来电人或材料先把三张时间交给玩家；否则主播只引用已经报出的 5:17。
- Q4：把“已经喝得难受、故意不说”的预设拆成真正的追问，不让问句先替来电人承认。
- Q5：章节卡跟上 JSON，把生育异常的追问时机写回第一轮，不再额外等待整通电话结束。
- Q6：角色卡、章节卡、模式说明和时间线降回 playable `unknown`；统一快案 2 来电人年龄，删掉已坐实式的“经济交换、供养者、骑驴找马”。
- Q7：scene 与 timeline 跟上当前无弹幕裁判和 6+5 / 6+2+5 话轮结构，删掉评论区接力及旧十组/七组计数。
