# 受控自由追问 Intent Schema

这份文档只定义后续实验口径，不代表当前试玩版要接入 AI 服务。当前可玩版本仍以固定编剧内容为准。

## 原则

- AI 不新增事实，不新增人物、金额、截图、时间线、证据和分支。
- 玩家自然语言只映射到当前 `sceneVersion` 已写好的追问、材料操作或无效输入。
- 低置信度不回答案情，只按直播间规则消耗听众忍耐或提示这句没接上。
- 离线试玩版必须能不依赖 AI 服务运行；第一阶段使用本地 intent matcher。
- 所有路由结果必须可记录、可回放、可测试。

## 内容字段

每个可自由追问的 scene 可以增加：

```json
{
  "allowedIntents": [
    {
      "id": "ask_layoff_timeline",
      "answerId": "scene-0-option-0",
      "mapsToOptionIndex": 0,
      "kind": "critical_hit",
      "aliases": ["什么时候失业", "断缴多久了", "工作什么时候不稳定"],
      "routeAxis": "money-flow",
      "routeTone": "trust-but-verify",
      "confidenceThreshold": 0.72,
      "spendOnMiss": false
    }
  ],
  "blockedTopics": [
    {
      "id": "future_material",
      "aliases": ["后面那张图", "最终真相", "结局"],
      "result": "blocked",
      "spend": true
    }
  ]
}
```

## 路由结果

运行时只接受这些分类：

- `critical_hit`：映射到当前节点核心追问，按已写答案推进。
- `dialogue_hit`：映射到当前节点外围追问，按已写答案推进。
- `partial`：话题相关但没有命中当前可问角度，消耗忍耐。
- `premature`：问到了后面才会出现的事实，不回答，消耗忍耐。
- `repeat`：重复问已处理节点，不新增信息。
- `off_topic`：和当前案情无关，消耗忍耐。
- `blocked`：要求 AI 生成事实、结局、证据或未出现人物，拒绝并消耗忍耐。

## 本地 matcher 第一阶段

1. 规范化玩家输入：全角/半角、标点、空白和常见口语词。
2. 用 `allowedIntents[].aliases` 做包含、分词重叠和同义词表匹配。
3. 只输出 `{ result, intentId, answerId, confidence, spend }`。
4. 命中后仍调用现有 `sceneQuestionPicks`、`routeChoiceLog`、`lastPressureSignal` 流程。

## 可选 AI router 第二阶段

只有本地 matcher 稳定后才允许接入。请求体只包含：

- 当前 scene 的公开文本。
- 当前 scene 的 `allowedIntents` 标题、aliases 和 blockedTopics。
- 玩家输入。

请求体不得包含未来 scene、真相字段、未解锁材料、结局文案。模型只能返回 JSON，不允许返回自然语言案情解释。

## 标注日志

用于后续训练或规则调优的日志不能含真实玩家隐私，建议结构：

```json
{
  "packId": "steam-demo-01",
  "caseId": "credit-card-debt-transfer",
  "sceneId": "opening-layoff",
  "inputHash": "sha256...",
  "normalizedInput": "工作什么时候不稳定",
  "result": "critical_hit",
  "intentId": "ask_layoff_timeline",
  "answerId": "scene-0-option-0",
  "confidence": 0.84,
  "spend": false,
  "routeAxis": "money-flow",
  "routeTone": "trust-but-verify"
}
```

## 禁止项

- 不把玩家输入直接拼进来电人回答。
- 不让 AI 写“更自然”的临场解释。
- 不在低置信度时给案情提示。
- 不把 future facts 当作语义检索库。
- 不用 AI 结果覆盖编剧写好的 `truthBoundary`、材料判定或结局。
