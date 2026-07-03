# 内容包 Schema

内容包用于把《直播间大侦探》的章节式案件包从运行时代码里拆出来。当前已经接通 manifest 运行时索引和单案 JSON loader；`steam-demo-01` 四案已切到 `runtime-loaded`，完整台词、追问、材料判定、最终收麦、复盘文案、事实边界和评论种子都由内容包进入运行时。daily 模式会按 `plotId` 优先复用已迁移的 runtime-loaded JSON，未迁移案才回落到旧模板。

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
- `title`：内部构建标题，不直接出现在通话中。
- `size`：当前内容包包含的案件数。当前 `steam-demo-01` 是 `4`，但运行时不应把 4 当成固定规则。
- `theme`：`id`、`title`、`intro`、`thesis`、`commentPrompt`。
- `caseLabels`：案内可见称呼，当前统一为 `匿名来电`。
- `sequence`：案件顺序，每项包含 `caseId`、`plotId`、`sceneId`、`complainantId`、`respondentId`、`act`、`objectLabel`、`backdropClass`、`bridge`。

通话流程内不能直接显示 `act`、`title` 或 `1/4` 这类目录结构。案间页可以使用 `objectLabel` 做下一通钩子。

## comments.json

- `themeId`：必须和 manifest 的 `theme.id` 一致。
- `commentSeeds`：本集评论区底色，生成案件时会进入 `storyCommentSeeds`。
- `lowRevealTone` / `highRevealTone`：低揭示率和高揭示率时的评论区口吻。

评论墙仍会根据玩家路线、现场压力、材料圈点、事实边界和原话选择替换局部评论；`comments.json` 负责让同一包的弹幕/评论像同一晚直播，而不是运行时模板的通用总结。

## cases/*.json

每案 JSON 分两种状态：`metadata-only` 只记录策划压力系统；`runtime-loaded` 会接管该案完整台词、追问、材料判定、满格深问和复盘文案。

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

每案至少要有三个 `quotePickCandidates` 和三句 `accusationChoices`。`quotePickCandidates` 是素材池，`accusationChoices` 是最终收麦按钮，必须包含 `label`、`accuse` 或 `accuseRole`、`response`。`truthBoundary` 三层都不能为空。

运行时会从 `truthBoundary.true / edited / unknown` 里抽多句做一次性归位判断。玩家放完即可继续，错放不会当场给标准答案，只会在后一页回看和故事集终局里影响边界标签与评论区反应；因此不要把三栏都写成刚好一条。

`metadata-only` 案件不能写 `openingDialogue`、`sceneVersions`、`evidenceChecks`、`investigationHooks`、`deepFollowup` 这类运行时字段。写了这些字段却不切到 `runtime-loaded`，会变成影子资产。`runtime-loaded` 案件必须包含完整运行时必填字段。

### runtime-loaded 字段

`runtime-loaded` 不是“多写几句台词”，而是让该案完整接管运行时。最低字段如下：

- `openingComplaint`：来电人开口的压缩版，用于旧兼容和摘要。
- `openingDialogue`：开场麦上来回，至少两句；每句包含 `role`、`text`。日案仍是单来电人结构，另一方只能通过转述、截图、语音摘录或回流材料出现。
- `sceneVersions`：主追问段落，试玩包标准是 5 段；每段包含 `speakerId`、`version`、`doubt`、`contradiction`、`reliability`、`pressureHint`、`questionOptions`。
- `sceneVersions[].pressureHint`：直播现场表演数据，不给玩家当提示。包含 `intentHook`、`callerGuard`（`guarded` / `tense` / `listening`）和 `expression.kind/text`（`blink` / `pause` / `shift`）。不要在运行时代码里用案件台词正则判断表情。
- `routeAxisComments`：按玩家最近一次路线轴显示的直播弹幕短句池，只用于现场表演反馈，不写成过关提示。至少覆盖本案主要路线轴。
- `questionOptions`：每段至少两个 host 问法；每项包含 `question`、`answer`、`routeAxis`、`routeTone`。必须且只能有一个核心追问，核心追问用 `correct: true` 和 `contradiction` 标出。其他选项也要像主播会问的话，不能写成故意错选。
- `evidenceChecks`：材料圈点，至少一个；每项包含 `id`、`title`、`prompt`、`material`、`options`。`options` 至少三个，必须且只能一个 `correct: true`，正确项要写 `contradiction`。职场/流程案可以用两份材料制造流程压力，例如先看审批图，再看供应商返款入口。
- `investigationHooks`：案后回流，至少一个；字段和材料圈点一致，并额外包含 `source`、`triggerContradiction`、`proves`、`stillCannotProve`。回流必须关联玩家已经听到的矛盾，不能凭空爆答案。
- `deepFollowup`：全核心命中后自动出现的一问，包含 `question`、`answer`、`note`。它不是奖励提示，要像主播顺着已经听到的事实多问了一句。
- `stageJudgement`、`storyInterludeRecap`、`followupTwist`、`truth`：收麦、案间和后续余味文案。
- `dailyShareTitle`、`dailyShareBody`、`dailyShareQuestion`：单案分享卡文案。
- `conclusionWhenCleared` / `conclusionBranches`：可选。用于把某案的特殊结论从代码迁到 JSON；分支条件写成已揭示矛盾或最终原话，不写 `plotId` 特判。

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

1. 先写压力系统：`whyTonight`、`objectPurpose`、`callerStake`、`otherStake`、`thirdPressure`、`truthBoundary`、`selfServingOmission`。
2. 再写整通电话：开场、5 段来电、每段 2-3 个主播问法、材料、回流、深问、原话收麦、复盘余味。
3. 把整通电话拆进 JSON 字段，不要直接在代码里补台词。
4. `runtimeContentStatus` 保持 `metadata-only`，直到完整运行时字段都写完。
5. 切到 `runtime-loaded` 后运行：

```bash
npm run content:index
npm run verify:pack -- <pack-id>
npm run check
npm run smoke:browser
```

6. 如果只改 manifest 顺序、主题、案数或桥接字段，也要运行 `npm run content:index`；`npm run content:index:check` 会在 CI/本地检查索引是否过期。

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
- `runtime-loaded` 案件会继续校验嵌套结构：开场对话、追问段落、双选项且只有一个核心追问、材料圈点、后台回流、深入追问、结算和分享文案都必须可被运行时消费。
- 不把“下一案 / 下一通来电 / 1/4”这类目录话术写进案间标题字段。
