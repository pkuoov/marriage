# 台词去 AI 味 · 执行 Prompt 包

Date: 2026-07-17

## 诊断结论（先写给人看）

`verify-logic` 禁词大多已过；用户仍觉得 AI 味，主因不是「真正 / 不是而是」，而是：

1. **句长均一的中句排比**——一口气三五句差不多长，像排版过的摘要，不像人说话。
2. **开场像汇报包**——日期 + 金额 + 感受一次说完，缺少卡壳、补刀、后悔说漏嘴。
3. **回拨 opener 同模板**：「你……了？……所以……」或「你……了？……那我现在想知道的是」。
4. **firstConflict `hostLine` 像测验题**——在考「正确读法」，不像直播间施压追问。
5. **顾问句像说明书**——「只能说明 / 要看 / 回拨先问」连接词密，像操作手册。
6. **来电人「感知不结论」不够**——爱替玩家算账、替证据下定义。
7. **四案声口指纹弱**——体面 / 自己人 / 条件 / 主责 的咬字差异不够尖。

### 现稿实例句（摘自当前 JSON）

- **01 scene1 账单段 · 句长均一**（`credit-eight-wan-bill`）：
  「我把那张信用卡账单翻出来才知道，不是小几千，是 8 万出头。大头是餐厅、礼物和两次酒店，都是他安排的那种店。往下还有一笔一万二的分期，写着什么短视频平台，我没细看，反正也是他手机上弄的。」——三句几乎同长，信息一次卸完。

- **01 赵舟 `advisorLine` · 说明文**（`zhao-zhou-frame`）：
  「固定入账停了，只能说明一条钱路断了。借来的、送的、代付还是还款，要看备注、聊天和有没有约定返还。回拨先问凭据够不够，别让任何一方先给它起名字。」——连接词密，像说明书。

- **02 scene0 默认暧昧 · 汇报包**：
  「他每次下班后都陪我聊天，总说只有我能接住他，还说别人都不懂。我们没正式说男女朋友，可每天聊到凌晨，我就默认是在往那边走。去店里剪头他从来不收我钱，号再满也给我插进去。我就顺手帮他转过几次店里的活动。」——关系定义 + 好处 + 自己付出一次说完。

- **03 opener · 一边…一边 工整对仗**（`介绍人添话标记`）：
  「你只圈了她添的两句？……一边被说成收入稳，一边被说成不计较学历。她想把事办成，我们也都捡了顺耳的那半句。」——对仗过整，像写好的总结句。

另见 01 回拨模板：「你去餐厅追会员号了？……他们不外传。**那我现在想知道的是**：号是我的……」；firstConflict 测验题感：「四个日子里，哪一个断点让他第一次开口？」

---

## 用法

| Prompt | 范围 | 何时用 |
|--------|------|--------|
| **D2** | 只改 openers + firstConflict + advisor / hangup 高密度位 | **先做**（AI 味密度最高） |
| **D1** | 按案重写 caller/host 口语：`sceneVersions` + `openingDialogue` + 问答 | D2 后再做 nightA 全案口吻 |
| **D3** | 扩 `stockAiForbidden` + skill 声口指纹 | 可选，防回归 |

**顺序：先 D2，再 D1（nightA 版本）。** 不要改计划文档；只改台词字段。保留全部 `earnedItem` id、`firstConflict` keys、情节事实、`truthBoundary`。

验收：`npm run check` 全绿。

---

## § 完整 Prompt D2

复制以下整块到执行 agent：

```text
你是本仓库的台词去 AI 味执行员。只做 Prompt D2：高密度位快修。不要改 docs 计划、blueprint、或无关系统代码。

## 范围（只改这些字段）
四案：content/packs/steam-demo-01/cases/{01-credit,02-tony,03-profile,04-workplace}.json

1. overnightStructure.callbackOpeners.*.line
2. overnightStructure.callbackOpeners.*.firstConflict.hostLine / callerLine
3. nightStructure 里 interludes 的 advisorLine（及同结构 hangup / 收束口播若存在）
4. 若有独立 hangupLine / 回拨收束句，一并口语化

不要改：earnedItem ids、firstConflict 的 key 名、证据图结构、plot 事实、truthBoundary、contradiction 元数据、sceneVersions 正文（留给 D1）。

## 诊断（必须对着改）
禁词大多已过；AI 味来自：
- 句长均一的中句排比
- 开场/回拨像汇报包
- opener 模板：「你……了？……所以……」或「那我现在想知道的是」
- hostLine 像测验题（考正确读法）
- advisor 像说明书（只能说明/要看/回拨先问 连用）
- 来电人爱下结论、替玩家算账

现稿坏例（改掉同类，勿原样保留）：
- 01：「你去餐厅追会员号了？……那我现在想知道的是：号是我的……」
- 01 hostLine：「四个日子里，哪一个断点让他第一次开口？」
- 01 advisor：「固定入账停了，只能说明一条钱路断了。借来的、送的……要看备注……回拨先问……」
- 03：「一边被说成收入稳，一边被说成不计较学历。」

## 规则（对齐 project-skills/case-scriptwriting/SKILL.md → Language Rules (De-AI)）
1. 口语句法；句长必须硬拉开（短钉 + 中叙 + 偶发长句，禁止三句同长排比）。
2. 来电人：感知不结论——说听见/看见/卡住，不替证据命名、不算账给玩家听。
3. 物件名复读：那八万 / 那张表 / 那张审批页 / 那句自己人——用物件钉住，不空谈「关系/真相」。
4. 禁止 opener 模板：你 X 了？……所以 Y；你 X 了？……那我现在想知道的是。
5. hostLine = 带着具体物件的施压问，不是「正确读法」测验题。
6. advisor = 一句拒绝或一个框，不讲课；砍掉说明连接词堆叠。
7. 避开 stock 正则禁词，并避开：本质上 / 更重要的是 / 一方面另一方面 / 我现在想知道的是 / 一边…一边…（工整对仗）。

## 声口提醒（D2 也要沾一点）
- 案1：体面/怕丢脸；短；吞「号是我的」
- 案2：自己人；顺嘴接好处；怕被当客户
- 案3：条件；利落；材料口；卡在收入
- 案4：主责；早认利；流程词

## 执行步骤
1. 按 01→02→03→04 打开 JSON，先只扫 callbackOpeners + firstConflict + advisorLine。
2. 每条 opener 朗读：若像模板/汇报，整句重写；保留情节事实与 earned 路线含义。
3. 每条 hostLine：改成「物件 + 压力」，禁止选择题考纲语气。
4. 每条 advisorLine：压成一句框或一句拒绝。
5. 跑 npm run check；红则修到绿。
6. 交付：每案挑 3 组 before→after（opener / hostLine / advisor 各至少覆盖一类），并声明未新增剧情事实。

开始执行。
```

---

## § 完整 Prompt D1

复制以下整块到执行 agent（建议在 D2 完成后、针对 nightA 版本）：

```text
你是本仓库的台词去 AI 味执行员。只做 Prompt D1：按案重写来电人/主持人口语。不要改 docs 计划或 blueprint。

## 范围
四案 JSON：01-credit → 02-tony → 03-profile → 04-workplace

重写：
- sceneVersions.*.version / revisedVersion（若有）
- openingDialogue[*].text（caller/host 口播）
- 各题 question / answer / reactionLine 等「说出口」字段
- 默认夜场/A 线相关口播若与上列重叠，一并纳入

保留：
- contradictions / metadata / falseFrame 结构与含义
- earnedItem ids、证据 id、truthBoundary、情节事实（日期、金额、物件）
- D2 已改过的 opener/firstConflict/advisor（可微调用语，勿回退成模板）

## 诊断
AI 味主因不是禁词，而是：句长均一、开场汇报包、来电人替玩家下结论、四案声口糊成一种「清楚叙述」。

坏例（同类必须打散）：
- 01 账单段三句同长卸货（credit-eight-wan-bill）
- 02 scene0 关系+好处+付出一次说完
- 开场把日期+金额+感受打成摘要包

## 规则（case-scriptwriting Language Rules / De-AI）
1. 口语句法；句长硬变化；允许吞字、改口、不敢说完。
2. 来电人感知不结论；物件名复读（那八万/那张表/会员号/审批页）。
3. Role-swap 测试：把两句对调说话人，必须立刻听出来谁在怕什么。
4. 禁止汇报包开场；禁止测验题式 host 旁白混进 caller 口吻。
5. 避开 stock 禁词 + 本质上/更重要的是/一方面另一方面/我现在想知道的是/工整「一边…一边」。

## 声口指纹（必须可听辨）
- 案1 体面/怕丢脸：短句；关键处吞「号是我的」；先护场面再露受益。
- 案2 自己人：顺嘴接好处；怕被当客户；「店里都这样」听成理所当然。
- 案3 条件：利落、材料口；卡在收入/流水；数字记得太牢会丢人。
- 案4 主责：早认利；流程词多；怕写死主责、卡账单还在。

## 每案工作流（强制）
1. 把该案相关口播拼成一份「综合 transcript」先通读朗读。
2. 按声口指纹整段去 AI 味（先听感，再拆回字段）。
3. 拆回 sceneVersions / openingDialogue / Q&A，保持 id 与分支不变。
4. 做 role-swap 抽查 2–3 处。
5. 四案都做完后：npm run check。

## 交付
- 每案 sample before/after 各 3 行（最好覆盖：开场一句、冲突中一句、收束/认份一句）
- 声明：无新增剧情事实；metadata/contradiction 未改坏
- check 全绿

按 01→02→03→04 开始。
```

---

## § 完整 Prompt D3（可选）

```text
可选维护：扩大去 AI 味回归网，不改剧情正文除非为了示范。

1. 在 scripts/verify-logic（或现有 stockAiForbidden 数据源）中，评估是否追加高密度套话：
   - 我现在想知道的是
   - 本质上 / 更重要的是
   - 一方面……另一方面……
   - 工整「一边A，一边B」总结句（慎用误伤；优先人工 review 列表）
2. 在 project-skills/case-scriptwriting/SKILL.md 的 De-AI / 声口指纹段，补四案指纹短表（体面/自己人/条件/主责），与 D1 对齐。
3. 跑 npm run check；若新禁词误伤合法口语，收窄为 warning 或加白名单语境。

不要改计划文档。交付：禁词 diff + 是否误伤说明。
```

---

## § 验收

- 每案各给 **3 行** before → after 对照（D2 与 D1 可分开贴）。
- **无新增剧情事实**（日期、金额、谁做了什么不变）。
- `npm run check` 全绿。
- 抽听：opener 不再同模板；hostLine 不像考题；advisor 不再像说明书；四案声口可辨。

---

相关规则见：[`project-skills/case-scriptwriting/SKILL.md`](../project-skills/case-scriptwriting/SKILL.md) → **Language Rules (De-AI)** / **De-AI & Anti-Robotic Scripting Guide**。

残留抛光 List Prompt：[`docs/plot-dialogue-residual-fix-prompt.md`](plot-dialogue-residual-fix-prompt.md)（2026-07-17 复审后）。
