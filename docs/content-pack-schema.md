# 内容包 Schema

内容包用于把《直播间大侦探》的四案故事集从运行时代码里拆出来。当前第一步只要求故事包骨架、每案压力系统、评论种子和路线原型可校验；完整台词仍暂时保留在 `src/caseEngine.js`，后续再迁移到 case JSON。

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
- `size`：试玩包固定为 `4`。
- `theme`：`id`、`title`、`intro`、`thesis`、`commentPrompt`。
- `caseLabels`：案内可见称呼，当前统一为 `匿名来电`。
- `sequence`：四案顺序，每项包含 `caseId`、`plotId`、`sceneId`、`complainantId`、`respondentId`、`act`、`objectLabel`、`bridge`。

通话流程内不能直接显示 `act`、`title` 或 `1/4` 这类目录结构。案间页可以使用 `objectLabel` 做下一通钩子。

## cases/*.json

当前每案 JSON 是压力系统，不是最终台词文件。

必填字段：

- `caseId`、`plotId`
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
- 四案顺序、plotId、人物、物件和桥接句完整。
- 每案压力系统字段完整。
- 不把“下一案 / 下一通来电 / 1/4”这类目录话术写进案间标题字段。
