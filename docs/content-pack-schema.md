# 内容包 Schema

内容包用于把《直播间大侦探》的章节式案件包从运行时代码里拆出来。当前已经接通 manifest 运行时索引和单案 JSON loader；`steam-demo-01` 前两案已切到 `runtime-loaded`，其余案件仍保留在 `src/caseEngine.js`，按案逐步迁移。

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
- `sequence`：案件顺序，每项包含 `caseId`、`plotId`、`sceneId`、`complainantId`、`respondentId`、`act`、`objectLabel`、`bridge`。

通话流程内不能直接显示 `act`、`title` 或 `1/4` 这类目录结构。案间页可以使用 `objectLabel` 做下一通钩子。

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

每案至少要有三个 `quotePickCandidates`。`truthBoundary` 三层都不能为空。

`metadata-only` 案件不能写 `openingDialogue`、`sceneVersions`、`evidenceChecks`、`investigationHooks`、`deepFollowup` 这类运行时字段。写了这些字段却不切到 `runtime-loaded`，会变成影子资产。`runtime-loaded` 案件必须包含完整运行时必填字段。

## 校验

```bash
npm run verify:pack
```

默认校验 `steam-demo-01`。也可以指定包：

```bash
node scripts/verify-pack.js steam-demo-01
```

校验内容：

- 内容包目录和所有 JSON 文件存在。
- `manifest.json` 与 `src/storyPacks.js` 的运行时故事包定义一致。
- 案件顺序、plotId、人物、物件和桥接句完整，`sequence.length` 必须等于 `size`。
- 每案压力系统字段完整。
- 每案显式标记 `runtimeContentStatus`。`metadata-only` 不得夹带运行时台词字段，`runtime-loaded` 必须包含完整运行时必填字段。
- 不把“下一案 / 下一通来电 / 1/4”这类目录话术写进案间标题字段。
