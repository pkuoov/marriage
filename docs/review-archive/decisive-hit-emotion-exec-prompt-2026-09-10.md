# 指认命中后的反应与边界说明执行单（2026-09-10，复核修订）

> 状态：本次修订的是执行单，以下游戏内容及 UI 改动尚未实施。
> 目标：让命中后的反应符合人物受到的冲击，保持主播下一句能接得上；证据边界可查阅，同时减少与对白争夺注意力。
> 不改事实、金额、日期、材料链、路线轴或结案判断。命中不一定意味着来电人撒谎，更不意味着每次都应崩溃。

## 复核基线

四案证词墙目前各有两幕，共 8 个 `decisivePresent.callerLine`。下文序号按文件排序，不是玩家经历的章节顺序。

旧单“8 次零反问、零回避”的结论不准确：第 2 句已有“我还不能走了？”，第 5 句已有“那不就又得拖到九月底？”，第 6 句以“两千倒不至于掏不出来吧”起头，第 3 句也明确想阻止主播谈代投。不能据此要求全部重写成第一句否认。

第 7 条确认的是其他部门材料齐全仍待付款，不是陈撒谎被揭穿；第 8 条涉及当前拟分但尚未支付的协调费，不能写成已经拿到或已经分赃。

旧单的 2672 行、逐幕台词数和情绪率未附提取版本、分支口径与标注公式，本轮不作为验收指标。以当前内容及运行时代码为基线，执行前核对是否又有改稿。其它场景的激烈台词只能参考声口，不能脱离其触发原因直接挪到命中页。

---

# 单 1｜逐条调整 8 个命中反应

## 当前落点

文件均位于 `content/packs/steam-demo-01/cases/`。先按 scene id 和 act id 定位，再核对下表索引；不要只按下标批量修改。四个 scene id 分别为 `credit-loyalty-test`、`tony-next-push-column`、`profile-family-chat-origin`、`work-split-ownership`；act id 为 `act1` / `act2`。

| # | 文件 | 路径 |
| --- | --- | --- |
| 1 | `01-credit.json` | `sceneVersions[7].testimonyWall.acts[0].decisivePresent.callerLine` |
| 2 | `01-credit.json` | `sceneVersions[7].testimonyWall.acts[1].decisivePresent.callerLine` |
| 3 | `02-tony.json` | `sceneVersions[6].testimonyWall.acts[0].decisivePresent.callerLine` |
| 4 | `02-tony.json` | `sceneVersions[6].testimonyWall.acts[1].decisivePresent.callerLine` |
| 5 | `03-profile.json` | `sceneVersions[5].testimonyWall.acts[0].decisivePresent.callerLine` |
| 6 | `03-profile.json` | `sceneVersions[5].testimonyWall.acts[1].decisivePresent.callerLine` |
| 7 | `04-workplace.json` | `sceneVersions[4].testimonyWall.acts[0].decisivePresent.callerLine` |
| 8 | `04-workplace.json` | `sceneVersions[4].testimonyWall.acts[1].decisivePresent.callerLine` |

**注意文件名和幕号不对应**：`02-tony.json` 是**第四幕·那张名单**，`04-workplace.json` 是**第二幕·职场报销**。别照文件名排序理解剧情。

## ⚠️ 落点陷阱一：acts[0] 必须改两处

`scripts/verify-pack.js:1730`：

```js
assertDeepEqual(act1.decisivePresent, scene.decisivePresent, "act1 必须原样沿用旧 decisivePresent 落点");
```

**每个 acts[0] 的 `decisivePresent` 必须和 `sceneVersions[N].decisivePresent` 逐字相同。**
所以第 1、3、5、7 条改完，**必须把 `sceneVersions[N].decisivePresent.callerLine` 同步改成一模一样**，否则 `verify:pack` 直接红。acts[1] 没有这个约束。

## ⚠️ 落点陷阱二：第 8 条有 pin

第 8 条的 **「没找外面的人协调」** 必须逐字保留，并继续表达她的事实承认。不能加否定词或包成他人引语来改变含义。

相关断言在 `verify-pack.js` 的 `revisionMarkers`、`verify-logic.js` 的素材检查与 `STORY-WORKPLACE-003` 的先后顺序检查中。按短语和测试标识查找，不依赖会漂移的行号。其它七句也受事实、声口和连续性约束，并非“完全自由”。不为改得顺而放宽现有断言。

## 怎么写（这是本单的核心）

先判断这一拍冲击了什么，再决定是否改写。可以辩解、反问、停顿，也可以直接承认；不强制所有人否认或崩溃。已经有效的句子可以保留，交付说明原因，不为了凑齐 8 条 diff 而改。

| # | 反应方向 | 必须保留的语义与下一句前提 |
| --- | --- | --- |
| 1 | 沈急着缩小自己花钱的范围，维持“也为两个人花过”的说法 | 个人与共同消费均有，不能把二十四万五全算成共同消费或现存余额；主播仍要问固定半薪的名目。 |
| 2 | 沈护住旧钱和退出关系的理由；原句已有防御性 | 能继续给就愿意再谈、给不了就追究隐瞒，两个条件均保留，承接“钱照来就再谈”；不新增债务归属。 |
| 3 | 何怕谈代投后自己的追款诉求被忽略，可以急着打断 | 保留她想让主播省去代投安排的意思，不能改成从未同意代投，也不能替 Tony 免除交代责任。 |
| 4 | 何发现提交页不足以证明成交，焦虑转向“那我的钱呢” | 她此前已经问过买成没有，不能写成现在才想到问；保留要求 Tony 交代的诉求，承接“当然得管”，不新增已买入、未买入或侵吞结论。 |
| 5 | 林不愿等父亲承诺兑现，对领证被拖延不满 | 她早已承认二十万未到账。本拍讨论要求男方先付、先接受安排，不能再演一次未到账被揭穿。 |
| 6 | 林仍用“只差两千”解释男方态度，但不得不面对本人是否接受条件 | 保留“应问男方接不接受”的语义，才能接固定 hostLine“那就问条件他接不接受”。可以说得勉强，不能删光前提后留下悬空的“那就”。 |
| 7 | 陈发现其他部门手续齐全也拿不到钱，补手续就能解决的希望落空 | 可写焦急、失望或停顿，不强制反咬主播；保留多部门无补件要求仍待付款，不下破产结论。 |
| 8 | 陈面对虚列外部服务的名目，怕难看、试图分摊责任 | 仍明确无外部协调服务、当前协调费拟分给她和主管、她知情；当前一万二未支付，不与过去已结批次混同。 |

沈通常护体面，陈怕难看及失去以后活动机会，林拿家庭承诺与婚期争辩，何容易急着追问。作为声口参考，不锁成四种固定崩法。不能为增加情绪新增母亲托话、私下约定等来源，也不靠成串感叹号或省略号代替反应。

每条按“前两轮 → 改句 → hostLine → 后两轮”检查：这一拍已经知道什么、承认了什么、下一句需要什么前提。不能把材料文字自动升级为角色已承认的事实。

## 边界

- **只改这 8 句（+ 4 句 acts[0] 的镜像）。** `hostLine`、`contradiction`、`materialCards`、`statements`、`missFeedback` 一律不动。
- 主播这 8 句 `hostLine` 本单保持不变。新 callerLine 若接不上，就重写 callerLine 或保留原句；不靠改主播补洞，也不把缺失前提推迟到本单不修改的下一拍。
- 走既有去 AI 味约束：不对仗、不漂亮收尾、不当场自我剖析、不工整比喻。参照 `project-skills/case-scriptwriting/references/spoken-corpus-patterns.md` 的禁写清单。
- 尊重各案已登记的 `voiceTics`，改完仍须过 `assertDialogueTexture`。它是回归约束，不是人物真实感的自动证明。

## 当前并没有命中页逐字播放

`decisivePresentHitHtml` 虽写有 `data-text-speed-tier="stalled"`，但 [dialoguePresentation.js](../../src/runtime/dialoguePresentation.js) 仅挂载 `.call-dialogue`、`.night-shell-card`、`.cafe-prologue-dialogue` 等来源，命中页 `.present-hit-dialogue` 不在其中。

当前是整句 CSS 淡入。[decisiveHitPresentation.js](../../src/runtime/decisiveHitPresentation.js) 在完整特效下等待 1400ms、减少特效下等待 400ms 后开放继续；即时文字、关闭特效或系统减少动态时立即开放。这是演出等待，不是读完检测，不随文字长度变化。

本单保留整句显示及可跳过机制，不以“已有慢速逐字机”为写作前提。若后续要逐句播放，应另行接入完成事件和控制器，补验自动、即时、跳过及离场清理；不能只加 data 属性或延长定时器。

---

# 单 2｜命中页保留可展开的证据边界

## 现状

`decisivePresentHitHtml` 的渲染顺序（[decisivePresentView.js](../../src/ui/decisivePresentView.js)）是：

```
callerLine（她的反应）
hostLine（主播接）
<small>boundaryLine</small>      ← 紧贴着，同一个 section
```

边界用于限定材料能证明什么，不等于“这次指认什么也没证明”。目前它在两句对白下方常显，可能与反应争夺注意力；本单改展示方式，保留原文及命中页查阅入口。

## ⚠️ 不要改 boundaryLine 的文本

`verify-pack.js:1780-1782` 有短语锁：

```js
assert((act2.decisivePresent?.boundaryLineKeyPhrases ?? []).length >= 1, "act2 必须登记 boundaryLine 关键短语锁");
(act2.decisivePresent?.boundaryLineKeyPhrases ?? []).forEach((phrase) => {
  assert(act2.decisivePresent.boundaryLine.includes(phrase), ...);
});
```

例如案2 act2 锁的是 `["当前一万二未支付", "不能据此证明押金去向"]`。**这些是公平机制的承重件，不许删、不许软化。**

## 选定方案：按钮展开，默认收起

1. 在 `src/ui/decisivePresentView.js` 中，将原 `<small>` 改为“这份材料能证明什么”按钮与对应内容区域。按钮使用 `type="button"`、`aria-expanded="false"`、`aria-controls`；内容初始 `hidden`，展开后显示完整原文，沿用 HTML 转义和字段缺失时的原回退文案。
2. 在 `src/ui/screens/testimonyWallScreens.js` 命中页绑定按钮，只切换区域可见性及 aria-expanded。不调用 render，不保存剧情进度，不重启演出计时，不与继续或指认操作共用处理函数。
3. 当前 `focusInputControl.js` 的可导航集合是 `button:not(:disabled)`。使用真正的按钮接入现有导航；本轮不使用未经手柄适配的裸 `details/summary`。
4. 展开/收起后焦点留在按钮上；入口始终可见，不依赖 hover。文字保持可读字号与对比度，手机可以滚动读完，不靠缩小、淡化或裁切降权。
5. “跳过演出”仍只取消等待、显示完整回应并恢复继续按钮；不跳场景，不强制展开边界。“继续”仍按原逻辑进入下一幕或后续对白，不增加第二次确认。
6. 使用命中页独立 class，核对原 `.decisive-present-hit > small` 样式更换标签后的影响，不扩大到全站 small 或所有折叠区。

`continueAfterDecisivePresent` 当前会立即修改 scene 并 render。不能采用“点继续后才在旧页淡入边界”：旧 DOM 会消失。本轮也不后移到结案卡，不改 `recapView.js`，不新增另一份重复文本。

保留 boundaryLine 字段、完整文本及关键短语。不能用保留字段但没有可操作入口的方式绕过要求。

---

# 单 3｜职场案三个具体反应落点（优先级低于单 1、单 2）

不要求陈每次都炸，也不以情绪率达标验收。文件为 `content/packs/steam-demo-01/cases/04-workplace.json`，单 3 仅允许调整下表指定回应，已有表达足够时可保留。

| 落点 | 定位方式 | 验收边界 |
| --- | --- | --- |
| 主管威胁语音之后 | `overnightStructure.liveCounterBeats` 中 `work-private-warning-voice`，陈的“这句是他说的。我就怕这个。” | 体现怕失去以后活动机会、怕公开草单的压力；仍明确威胁来自主管，不改语音原话，不新增威胁或行动。下一句主播仍能要求打开八万草单。 |
| 弹幕质疑多报四千之后 | 同一 liveCounterBeats 中 `work-comment-stupid-blowup`，以“那时候我哪觉得有问题”开头的陈的回应 | 保留她当时觉得有利、曾想下月多接活动、现在卡还不上的信息；可以羞恼或辩解，不能洗掉获利动机。不改弹幕引语、分支选项和路线效果。 |
| 财务要求解释当前协调费 | 当前 `sceneVersions[3].questionOptions[0].lines`，以“查了。财务给我发了新页”开头的陈的回应 | 保留财务发来新页、要求解释一万二、她已把回复交后台；可体现被追问的慌张。不能提前承认无外部服务，把第 8 条的揭示挪到跨部门受理页之前。 |

执行前核对 id、原文和前后对白。主管语音虽然使用 role=caller，实际 speaker/speakerProfileId 属于主管，不能当成陈的情绪台词改。单 3 与第 8 条承担不同阶段的信息，不能重复让她“第一次承认”同一事实。

---

# 验收

1. `npm run content:index && npm run content:script && npm run check && npm run verify:pack -- steam-demo-01` 全绿。
   —— 特别盯 `verify:pack` 的 `act1 必须原样沿用旧 decisivePresent 落点`（陷阱一）和 `boundaryLine 必须包含登记短语`（单 2）。
2. `npm run smoke:browser` 全绿。
3. 执行前保存基线，按字段路径比对内容：只允许单 1 的 callerLine、act1 镜像和单 3 指定的三处回应变化。金额、日期、已发生/未发生状态、材料行、`truth`、`caseClosing`、`hostLine` 和路线效果不变。不要把整行 diff 中出现旧金额误判为金额被修改。
4. 逐条通读“前两轮 → 改句 → hostLine → 后两轮”，按单 1 表格判断冲击、来源、承认事实与下一句前提。第 6 条不能丢“问本人接不接受”，第 7 条不能写成撒谎败露，第 8 条不能写成当前已分款。真人朗读可作为进一步验收；只做文本通读时如实报告，不声称已经真人朗读。
5. 单 3 按三个具体落点逐条核验，确认先揭跨部门待付、再揭包干虚列服务，不验收没有定义的情绪率。

## UI 定点回归（不能只靠旧冒烟）

- 新增展开行为验证：默认收起，按钮可展开/收起，aria 状态一致，内容为原文，展开不推进剧情。复用现有测试工具，不新增测试框架。
- 保留 `scripts/tests/visual-polish.test.js` 对跳过、即时文字、减少动态、离场计时器及焦点恢复的检查，不放宽断言；可以新增必要测试。
- 在完整/减少/关闭特效、即时文字、系统减少动态设置下，验证跳过演出、继续和边界入口可操作，没有隐藏的第二次确认或重新等待。
- 实际检查鼠标、手机触屏、键盘、手柄导航：边界按钮可找到、可激活，原继续按钮仍可达。缺少手柄实测条件就记录未完成，不以鼠标点击替代。
- 在 1440×900、390×844 下覆盖短边界及 Tony act2 的长边界；展开不遮挡或裁掉对白、继续按钮，手机可以读完，无横向溢出。
- 旧 `smoke:browser` 若未操作新增按钮，不能用“冒烟全绿”声称覆盖了展开交互。分别报告自动检查与定点实测结果。

# 提交切分

- 单 1（实际需要调整的命中反应 + act1 镜像）独立修改、核验与提交。
- 单 2（边界展开 UI）独立修改、核验与提交。
- 单 3（职场案指定回应）独立修改、核验与提交。

# 交付只报这些

- 单 1：8 句 before/after 全列，保留原句的说明原因；第 8 条关键短语与明确承认是否保留，act1 镜像是否一致。
- 单 1：各条反应对应的事实与下一句承接，不以“每个人都崩了”证明完成。
- 单 2：按钮展开的实现文件、原文保留、焦点、跳过/继续行为，以及实际验证的输入方式。
- 单 3：三个落点改了什么或为什么保留，确认没有提前泄露虚列服务的承认，不报告未定义的情绪率。
- 新增测试、现有检查结果、未完成的实机和朗读项。不得为了通过检查放宽事实和公平机制断言。

本轮不实施整套打字机重构，不新增人物事实，不替八次命中统一规定情绪结局。
