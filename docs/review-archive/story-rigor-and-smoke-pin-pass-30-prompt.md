# 第 30 批·剧情严谨性修补 + 修绿 smoke 陈旧断言(并补闸门)

> 归档状态：已于 2026-07-29 完成评审与执行；更新案一餐厅回拨 smoke pin，消除案三婚礼资金双计歧义，并说清案二语音来源。第 29 批建立的 `test:pr` 行为闸门已存在，无需重复修改。

你是本仓库的实施工程师。判决来源:全量连续台本冷读(2026-07-29,聚焦台词连续性与剧情严谨性)+ 复现 `smoke:browser` 红。

现状:`npm run test:full` **红**——`restaurant-document` 路线在 `smoke-browser-replay.js:320` 抛「should render the selected opener and its first conflict」。已核实是**内容-测试漂移**(与前两批同型):案1回拨开场「餐厅拒绝核对」的台词被重写过,原来的 `那晚的座是你订的` 现在是 `座是我订的`,而 smoke 路线里 pin 的 `openerText` 没跟着更新。**内容是对的,pin 过时。**

## 铁律

1. 台词层只做本单列出的最小修改;其余内容、结构、路线一律不动。
2. 收尾 `npm run test:full` **全绿**(check + smoke:browser + smoke:desktop)。
3. 改内容后必跑 `npm run content:script` 重新生成台本。

## 去 AI 味 · 口语化约束(本单及后续任何新写/改写的角色台词一律遵守)

不是新规,是执行现有立法。任何被你落笔或改动的**角色口语台词**必须过三关:

1. **禁写清单(AI 指纹)**——对照 `project-skills/case-scriptwriting/references/spoken-corpus-patterns.md` 的「禁写清单」:一句/一段里不得两组对仗;不得句句承重(要留松句、废话、生活噪声);人物不得当场剖析自己的心理动机;不得用漂亮短句收尾装深刻;比喻不得工整。动笔前先读该文件的起头/绕/收不住/被打断/口误自纠等口语形状——**照真人怎么说话写,不照顺滑书面语写**。
2. **声纹专属**——尊重案件已登记的 `voiceTics`(案2 说话人「何」= 「你知道吧」)。改写不得抹掉本案已达标的语气词/短答句/长絮叨拍,不得给某角色串用别人的口癖。改完该案必须仍过 `verify-logic` 的 `assertDialogueTexture`(texturePass 门控:短答句数、语气词分布、絮叨拍数不得因改写掉线)。
3. **禁语表**——不得触发 `scripts/verify-logic.js` 的库存 AI 用语正则(「听到这里」「真正」「不是…而是」「心里咯噔一下」「你把这句记下」等)。`npm run test:logic` 必须绿。

判据一句话:**改完的句子念出来像深夜连麦里一个真人随口说的,不像编剧写的漂亮台词。** 本单逐字文本若与本约束冲突,以本约束为准,按角色口语声纹调整并在报告里注明偏离。C 的文档行 memo 不是口语台词,保持现有文档登记体(简短、事实化),同样不得加 AI 润色腔。

---

## A. 修绿 smoke 陈旧 pin(阻塞项,先做)

`scripts/smoke-browser-replay.js`:两条路线 `restaurant-document`(第 18 行)与 `gamepad-restaurant-document`(第 21 行)都 pin 了 `openerText: "那晚的座是你订的"`。案1开场「餐厅拒绝核对」当前 `firstConflict.callerLine` 是「那句是我说顺嘴了。**座是我订的**,酒是他点的,朋友圈也是我发的…」。

- 把这两处 `openerText: "那晚的座是你订的"` 改为当前稳定子串 **`"座是我订的"`**(取自现行 callerLine,语义等价)。
- **不要**改案1内容去迁就旧 pin;是 pin 追内容。
- 改完**单跑** `npm run smoke:browser` 全绿;若还有其它路线因同类台词重写而 `openerText`/`dayChoiceText`/`callerQuestion` 等 pin 失配,一并核对更新(逐条对照现行内容,只改 pin,不改内容)。

## B. 把 smoke:browser 纳入行为闸门(堵住复发)

这已是第三次"内容重写跑赢 smoke pin、带红提交"。根因:提交前只跑 `check`(不含 smoke:browser)。落地**其一**(择与现状最省事者),若第 29 批已做则核对是否真的生效:

- 有 CI:PR/push 工作流把 `npm run test:full`(至少 `npm run smoke:browser`)设为必过 job。
- 无 CI:`package.json` 增 `"test:pr": "npm run check && npm run smoke:browser"`,并在 `docs/README.md`/贡献说明写明:**改 `content/`、`src/ui`、`src/app.js`、场景/开场/反制拍流程后,提交前必须 `npm run test:pr`**。
- 不把 smoke:browser 塞进 `check`(它要浏览器构建+Playwright,会拖慢静态校验)。

---

## C. 剧情严谨性:案3 文档双计消歧(本轮唯一实质剧情修)

`content/packs/steam-demo-01/cases/03-profile.json` 的流水文档里,两行邀请玩家在圈行时误把家里的钱重复计算:

- `p06`(06-19,¥200,000,女方父亲口头安排,memo=「称宸直到期后用于女儿婚礼」)
- `p05`(09-30,¥300,000,女方父母·宸直产品,memo=「持有页列明到期日;当前不能取」)

台词已说明这 20万 是那 30万宸直里划出来的(「去年他买了三十万宸直的产品…到期以后给我添二十万办婚礼」),但两行分列、各挂一个金额,圈行玩家易读成"家里有 20万+30万=50万"。**修 p06 的 memo,点明它是 p05 那 30万的一部分**(逐字):

`p06.memo`:「称宸直到期后用于女儿婚礼」→ 改为:
```
从下述30万宸直中划出，称到期后用于女儿婚礼
```

`p05`、其余行、行派生问答一律不动。跑 `verify:pack` 确认行-证言校验仍过。

## D. 台词连续性:案2 一处措辞消歧(可选小改)

`content/packs/steam-demo-01/cases/02-tony.json` `sceneVersions` 中(含「那阵子我留过一条语音」的 version):「留过一条语音」中的「留」有"录/存"歧义,而该语音实为 Tony 发来的(回放带吹风机背景)。逐字改:

原句片段:「…那阵子我留过一条语音。我已经传到节目后台了，可我现在不想听。」
改为:「…那阵子他给我发过一条语音，我一直留着。我已经传到节目后台了，可我现在不想听。」

仅改这一句,同 version 其余不动。

> 说明:案1「转账页/语音条」相邻动作经复读判定可自洽(先在语音条上蹭、没播放,随后点开转账页),**本单不改**。

---

## 验收

1. `npm run content:index && npm run content:script && npm run check && npm run verify:pack -- steam-demo-01 && npm run smoke:browser && npm run smoke:desktop` **全绿**。
2. `git diff -- content/` 只含 C、D 两处;`git diff -- scripts/smoke-browser-replay.js` 只含 pin 更新与(如有)闸门相关。
3. 台本重生成后抽读:案3文档 p06 行显示"从下述30万宸直中划出";案2该 version 措辞已消歧。
4. 提交切分:A(smoke pin)、B(闸门)、C(案3文档)、D(案2措辞)各一个提交,A 先行确保主干先回绿。
5. 不确定处停下报告,不自行扩大范围。
