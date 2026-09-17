# 内容包 Schema

现行入口：[标准索引](standards-index.md)。本文件区分当前主案运行时合同与创作建议；下面的主案字段不是快案 Schema。`lineReplay`、`testimonyWall`、快案来电和 `solo-commentary` 由各自消费者决定交互，不能共用旧“一次选择后不准再问”规则。

内容包用于把《深夜热线：直播间侦探》的章节式案件包从运行时代码里拆出来。当前已经接通 manifest 运行时索引和单案 JSON loader；`steam-demo-01` 四案已切到 `runtime-loaded`，完整台词、追问、材料判定、最终收麦、复盘文案、事实边界和评论种子都由内容包直接进入运行时，不再先走长模板再覆盖。daily 模式会按 `plotId` 优先复用已迁移的 runtime-loaded JSON；自动 daily 轮换只出已迁移 JSON 内容，旧模板只作为显式兼容入口兜底。

## 目录

```text
content/packs/<pack-id>/
  manifest.json
  cases/
    01-*.json
    02-*.json
    03-*.json
    04-*.json
  comments.json
  route-archetypes.json
  qa-report.md
```

## manifest.json

必填字段：

- `id`：内容包 id，例如 `steam-demo-01`。
- `title`：内容包标题，是否展示由当前入口消费者决定。
- `size`：当前内容包包含的案件数。当前 `steam-demo-01` 是 `4`，但运行时不应把 4 当成固定规则。
- `theme`：`id`、`title`、`intro`、`thesis`、`commentPrompt`。
- `caseLabels`：案内可见称呼，当前统一为 `匿名来电`。
- `sequence`：案件顺序，每项包含 `caseId`、`plotId`、`sceneId`、`complainantId`、`respondentId`、`castProfileIds`、`act`、`objectLabel`、`backdropClass`、`bridge`。

`castProfileIds` 必须列出本案所有逐案角色卡，引用 `content/characters/cast.json`。写台词时以 `caseId + surfaceNames` 解析说话人；`complainantId`、`respondentId` 是运行时演员槽位，不表示不同案件里的同名 ID 是同一个角色。常驻主播、顾问和 V哥使用 `caseIds: ["*"]` 的全局卡。当前节目是个人直播，不设置导播角色。

通话流程内不能直接显示 `act`、`title` 或 `1/4` 这类目录结构。案间页可以使用 `objectLabel` 做下一通钩子。

## comments.json

- `themeId`：必须和 manifest 的 `theme.id` 一致。
- `commentSeeds`：本集评论区底色，生成案件时会进入 `storyCommentSeeds`。
- `lowRevealTone` / `highRevealTone`：低揭示率和高揭示率时的评论区口吻。

这些是旧评论消费者的兼容数据。当前设计删除弹幕插话和评论裁判；保留数据不授权增加玩家页面，也不要求每案填评论。

## cases/*.json

主案 JSON 分两种状态：`metadata-only` 只记录策划压力系统；`runtime-loaded` 会接管该案完整台词、追问和材料等运行时字段；是否播放由模式与消费者决定。

必填字段：

- `caseId`、`plotId`
- `runtimeContentStatus`：`metadata-only` 或 `runtime-loaded`。只有完整字段通过校验并进入运行时索引以后，才能改成 `runtime-loaded`。
- `dramaticAnchor`
- `whyTonight`
- `objectPurpose`
- `callerStake`
- `otherStake`
- `thirdPressure`
- `truthBoundary.true`
- `truthBoundary.edited`
- `truthBoundary.unknown`
- `selfServingOmission`
- `quotePickCandidates`
- `accusationChoices`

`quotePickCandidates` 与 `accusationChoices` 是旧原话收麦的数据，不设三个候选配额。集中简短收尾不显示原话评分；尚未迁移的旧收麦消费者至少需要一个可用项。已配置项保留 `label`、`accuse` 或 `accuseRole`、`response` 及真实引用。`truthBoundary` 各栏为数组，可以为空，数量由实际事实决定；仍启用旧题目时，素材数须覆盖配置题量。

`verify:pack` 会把 `quotePickCandidates` 与 `accusationChoices[].label` 归一化后逐项比对，并检查每句最终原话在无门控正文中确有出处。`runtimeLengthPlan` 的 `liveBeatCount / materialBoardCount / backflowCount / truthBoundaryPromptCount` 也必须分别等于实际段落、材料板、回流数和 manifest 的事实边界出题上限；规划字段不是可漂移的备注。

`truthBoundary` 保留作者已知／修剪／未知记录。旧消费者曾抽题评分；当前方向取消把这套记录当必经收尾。`compactClosing` 模式题量为零，不为填池子编造事实、未知或隐瞒。

`metadata-only` 案件不能写 `openingDialogue`、`sceneVersions`、`evidenceChecks`、`investigationHooks`、`deepFollowup` 这类运行时字段。写了这些字段却不切到 `runtime-loaded`，会变成影子资产。`runtime-loaded` 案件必须包含完整运行时必填字段。

### runtime-loaded 字段

`runtime-loaded` 不是“多写几句台词”，而是让该案完整接管运行时。最低字段如下：

- `openingComplaint`：来电人开口的压缩版，用于旧兼容和摘要。
- `openingDialogue`：开场麦上来回，至少两句；每句包含 `role`、`text`。说话人数服从具体模式和演员表；另一方可直接后台回应，已配置的双人连麦也可保留，不能让来电人承担所有对方说法。
- `sceneVersions`：主追问段落，数量由实际内容决定，不规定五段；每段包含 `speakerId`、`version`、`doubt`、`contradiction`、`reliability`、`pressureHint`、`questionOptions`。
- `sceneVersions[].pressureHint`：直播现场表演数据，不给玩家当提示。包含 `intentHook`、`callerGuard`（`guarded` / `tense` / `listening`）和 `expression.kind/text`（`blink` / `pause` / `shift`）。不要在运行时代码里用案件台词正则判断表情。
- `routeAxisComments`：旧评论兼容对象，可为空；当前设计不再展示弹幕插话，不要求覆盖路线轴。
- `questionOptions`：保存本场实际问答，每项包含稳定 `id`、`question`、`answer` 及所需路线数据。顺序场景用 `questionSequence` 引用 ID；可有多条成立追问，不编造凑数的错问。`correct` 与 `contradiction` 是内部判定字段，不是玩家的“关键选择”标签。多人物实际对白在 `lines`，不能同时再播放备用 `answer`。
- `evidenceChecks`：材料检视数组，可为空；每项包含 `id`、`title`、`prompt`、`material`、`options`。现行选项用 `question` 写完整问句，`label` 仅作旧数据兼容。选项数量与正确项按实际材料玩法校验，成立项须有对应事实，不把多选、圈行和单项推进混为一谈。材料数量由当前争议需要决定，不为制造流程压力增加关卡。
- `testimonyWall.acts[].inquiry`：现行关键证据问询。`openingLines` 是必播对白；`options` 各含稳定 `id`、完整 `question`、内部 `correct` 和回应 `lines`（`role/text`）。材料读取同幕 `decisivePresent.materialCards`，问清后继续下一幕。旧 `statements`、`decisivePresent` 保留来源、结果与存档身份，不再要求玩家配对或 PRESS 解锁。
- `sceneVersions[].afterScene`：可选的幕间材料板锚点。当前支持 `{ "kind": "evidenceCheck", "checkId": "" }`，`checkId` 必须指向本案 `evidenceChecks[].id`。它会在该句追问完成后立刻打开对应材料；材料仍按普通 `evidenceChecks` 记录并进入路线图；集中问询不扣耐心、不限尝试次数。配置后核对接收时点，不为保留旧字段增设材料页面。
- `stanceSnapshot`：可选的中段立场快照，形如 `{ "afterScene": 2, "prompt": "现在这通麦，你先站哪边？", "options": [{ "id": "", "label": "", "summary": "" }] }`。`afterScene` 是一基场景序号；`options` 配置实际可选项，**不得写 `correct`**，记录不判分，只在回看中展示玩家当时的判断弧线。
- `investigationHooks`：后台补充材料数组，可为空；字段和材料问询一致，并额外包含 `source`、`triggerContradiction`、`proves`、`stillCannotProve`。回流必须关联玩家已经听到的矛盾，不能凭空爆答案。
- `delegation`：可选的证据委托，形如 `{ "moment": "actBreak:2", "material": { "id": "", "label": "" }, "outcomes": { "<advisorId>": { "tone": "strong|partial|offDomain", "text": "" } } }`。当前每案一件材料、一次委托；玩家可选一位顾问，也可点「先不送」。选顾问的回单须在会引用它的后续对白之前，跳过不惩罚、终局不提。
- `deepFollowup`：兼容字段。loader 当前仍要求字段存在，可保留空对象；不要求满格追问。若旧内容仍配置追问，问题、回答与来源需完整，但新改稿应把必要问题放到相应问询段。
- `stageJudgement`、`storyInterludeRecap`、`followupTwist`、`truth`：收麦、案间和后续余味文案。
- `dailyShareTitle`、`dailyShareBody`、`dailyShareQuestion`：单案分享卡文案。
- `conclusionWhenCleared` / `conclusionBranches`：可选。用于把某案的特殊结论从代码迁到 JSON；分支条件写成已揭示矛盾或最终原话，不写 `plotId` 特判。
- `advisorNotes` / `respondentNote`：麦外声音。`advisorNotes` 每案最多两条；`respondentNote` 兼容旧对象写法，也可写数组，扩容包每案最多两条。所有麦外声音只能进入材料、回流、留言、顾问单等合法表面，不能替玩家点圈点位置。

### 行级 documents

`documents` 承载可读原件，当前试玩包有文档。不要为新案强加表格；使用文档时保留 `id`、`title`、`intro`、`rows` 等实际消费者需要的字段。`rowQuestions / crossQuestions / markLimit` 是旧标注接口，集中问询只读原件，可保留空问答容器；不显示标注按钮和额度，不要求跨行组合。

- 银行流水可沿用默认五列：`date / kind / amount / party / memo`。日期用 `MM-DD`，行按日期升序，`kind` 使用 `入账 / 支出 / 提醒 / 空行`。
- 非银行文档应显式写 `columns: [{ "key": "date", "label": "时间" }, ...]`。每一行都必须为每个已声明列提供非空值；运行时和阅读版会按这些列渲染。
- 只有相对时间来源时写 `dateMode: "relative"`，保留 `前一天 14:22`、`九天后`、`截至第二晚` 等原始表达。不得为了通过银行流水校验伪造具体月日，也不得把“九天后”机械改成容易产生基准歧义的 `D+9`。
- `rowQuestions` 以 `rowId` 为键；`crossQuestions[].rows` 至少引用两行。当前正式字段是 `crossQuestions / rows / markLimit`，不是旧草案里的 `crossRowQuestions / rowIds / maxMarks`。
- 每个追问只能说材料能证明的内容。需要从当事人口中补出的事实放在 `answer` 与 `logicContract.answerAdds`；`sourceDoesNotProve` 必须保留账户归属、是否到账、是否故意等尚未成立的边界。

### 兼容计划字段

`runtimeLengthPlan` 是现有数据投影，不是扩容配额，不要求增加场次、材料或回流：

- `runtimeLengthPlan.liveBeatCount` 必须等于实际 `sceneVersions.length`。
- `runtimeLengthPlan.materialBoardCount` 必须等于实际 `evidenceChecks.length`，中置材料仍计入这里。
- `runtimeLengthPlan.backflowCount` 必须等于实际 `investigationHooks.length`。
- 新增现场拍优先落在 `sceneVersions`，并用 `afterScene` 把材料板插到幕间。
- 有立场的麦外声音写入 `advisorNotes`、`respondentNote`、`investigationHooks` 或材料文本；新增具名声音需要同步角色圣经。
- 中段误判用 `stanceSnapshot` 表达，必须由前文真证据喂出来，后续材料负责 revalue。

### 路线字段

`routeAxis` 和 `routeTone` 是隐藏路线图数据，不在直播中显示。推荐轴包括：

- `money-flow`：钱、垫付、返款、债务、共同账户。
- `document-edge`：截图少边、证明缺页、表格字段、审批状态。
- `caller-credibility`：来电人自我修剪、先站队、隐藏自身收益。
- `process-control`：谁控制流程入口、话术顺序、付款/见面/审批节奏。
- `identity-wording`：学历、身份、关系名分、职位称呼。
- `outer-thread`：合理但不够咬住核心的外围问法。

路线字段只能影响复盘、终局评论和压力画像，不能在选择按钮旁显示成攻略提示。

## 新增或修改内容包流程

1. 按当前诉求与可见来源整理内部事实；以下是现有字段，不为填满它们制造情节：`whyTonight`、`objectPurpose`、`callerStake`、`otherStake`、`thirdPressure`、`truthBoundary`、`selfServingOmission`。
2. 按当前模式写完整交流：接通、集中问询、材料、必要转场与自然收麦。轮数随事实披露需要决定，结案不强制凑复盘页。
3. 把整通电话拆进 JSON 字段，不要直接在代码里补台词。
4. `runtimeContentStatus` 保持 `metadata-only`，直到完整运行时字段都写完。
5. 切到 `runtime-loaded` 后生成真源投影并做结构检查；涉及播放或交互时再构建 playable、验证受影响路线。整包提交运行完整行为闸门：

```bash
npm run content:index
npm run content:script
npm run verify:pack -- <pack-id>
npm run check
npm run smoke:browser
```

6. 如果只改 manifest 顺序、主题、案数或桥接字段，也要运行 `npm run content:index`；`npm run content:index:check` 会在 CI/本地检查索引是否过期。
7. `npm run content:script` 会生成三份视图：`<pack-id>-full-readable-script.md`、`<pack-id>-director-script.md` 与 `<pack-id>-character-dialogue-report.md`。前者完整汇编源文本，中者保留排演需要的台词和动作，后者按人物和幕次聚合实际出声位置。`content:script:check` 会阻止任一版本落后于 JSON 真源。
8. 玩家可见的 NPC 私信、留言或转述材料必须声明 `speakerProfileId`；只有原始截图、群聊或表格可用 `voiceAttribution: "document"`。`PACK-011` 会检查这条归属链，并要求带 `advisorLine` 的选项明确写 `advisorId`。

不要把同一个字段写两份：故事包级别的顺序、物件和桥接在 `manifest.json`，单案可玩内容在 `cases/*.json`，评论底色在 `comments.json`，路线原型在 `route-archetypes.json`。

## 校验

```bash
npm run verify:pack
```

默认校验 `steam-demo-01`。也可以指定包：

```bash
node scripts/verify-pack.js steam-demo-01
npm run verify:pack -- steam-demo-01
```

校验内容：

- 内容包目录和所有 JSON 文件存在。
- `manifest.json` 与 `src/storyPacks.js` 的运行时故事包定义一致。
- 案件顺序、plotId、人物、物件和桥接句完整，`sequence.length` 必须等于 `size`。
- 每案压力系统字段完整。
- 每案显式标记 `runtimeContentStatus`。`metadata-only` 不得夹带运行时台词字段，`runtime-loaded` 必须包含完整运行时必填字段。
- `runtime-loaded` 案件会继续校验嵌套结构：开场对话、追问段落、按各交互模式配置的有效问答、材料圈点、后台回流、深入追问、结算和分享文案都必须可被运行时消费。
- 不把“下一案 / 下一通来电 / 1/4”这类目录话术写进案间标题字段。

## 逐句、材料与跨夜的接入边界

- `questionSequence` 记录必要先后。主案与来电快案按集中问询设计，本段问清推进，错问本段重问；不强制返回原句。`dialoguePresentation.focusedInquiry / compactClosing` 已在案一启用；其他旧案迁移须同时改稿、核对消费者与存档，不只打开标志。
- `sourceAnchor` 和 `revisedSourceAnchor` 必须绑定当时已播文本，不能从尚未解锁的全量 JSON 中取依据。陈述阶段覆盖实际可玩场景，不能跨材料门槛、挂断或现场插入。
- `clueRole / falseFrame / payoffFor / revalues` 是可选写作账本；配置后检查类型与引用，不要求每一场都有假解、每一份材料都反转。不强制每场 `guardedAnswer`，防备可写在正在播放的完整交换里。
- 材料驱动发问时，以 `materialRows` 和材料标题交付可点原件，问题绑定对应行。银行流水可用 `presentation: "transactionCards"` 与 `focusRowIds` 提供重点交易，原表另供查看；不能把整张长表与完整反馈同时挤在屏幕内。
- `timelineSort` 属旧兼容接口，不是新案必需玩法。仍支持的旧入口须保持 `cards / correctOrder` 与存档一致；不为校验增加排序关卡。
- 第二夜转换同时切换背景、时间、顶部状态与操作；`night2TransitionSeen` 等一次性进度与普通读页状态分别处理。普通下一句不重播整段过场。
- `caseClosing`、事实边界、路线轴、`body.access` 是内部合同。保留字段不等于强制显示报表、授权声明或弹幕风向标签。玩家需要的是自然来源交代、当前对白与可执行操作。
