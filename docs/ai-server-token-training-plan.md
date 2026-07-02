# AI 服务器、Token 与模型训练规划

审查日期：2026-06-30

## 结论

游戏本体不应该依赖 AI 服务器才能玩。Steam 试玩版的主流程必须离线可玩，固定按钮、固定剧情、固定复盘都能完整跑完。

但只要上线“自由追问”，就需要一个轻量 AI 服务器。这个服务器不是用来生成剧情，而是用来保护 API key、限流、控成本、记录匿名标注、切换模型和做质量评估。

推荐形态：

```text
Steam 客户端
-> 本地关键词/向量匹配
-> 命中则不请求服务器
-> 未命中才请求 AI Router Server
-> AI 只返回 classification + intentId + answerId
-> 客户端二次校验 answerId 是否属于当前 scene
-> 使用本地已写好的回答推进
```

## 是否需要 AI 服务器

### 不需要服务器的部分

这些必须本地完成：

- 案件包主流程。
- 按钮式询问和关键追问。
- 回看。
- 结算。
- 评论墙基础模板。
- 本地 `localMatcher`。
- 离线 fallback。

这样做的好处是：玩家断网、服务器宕机、API 费用超预算，都不会毁掉核心体验。

### 需要服务器的部分

只要接远程模型，就需要服务器：

- API key 不能放在 Steam 客户端。
- 需要限制单用户请求频率。
- 需要每日/月度预算闸门。
- 需要按版本切换模型和 prompt。
- 需要记录匿名问法用于后续标注。
- 需要防止玩家用自由输入刷成本或试探越界内容。
- 需要在模型输出后做服务端 schema 校验。

服务器最小接口：

```text
POST /v1/route-question
POST /v1/report-routing-label
GET  /v1/ai-config
POST /v1/admin/eval-routing
```

第一版只开放 `/v1/route-question` 和 `/v1/ai-config`。

## Token 使用规划

### 玩家侧：只做意图路由

每次自由追问请求只发送当前 scene 的最小上下文：

```json
{
  "packId": "steam-demo-01",
  "caseId": "education-income-fake-profile",
  "sceneId": "case3-scene4-income-proof",
  "playerText": "她是不是更想知道他工资够不够花？",
  "visibleFacts": ["MBA 材料", "要过流水", "男方不高兴"],
  "allowedIntents": [
    {
      "id": "income-control-line",
      "kind": "critical",
      "aliases": ["流水想证明什么", "工资够不够花", "婚后谁管钱"]
    },
    {
      "id": "mba-truth-line",
      "kind": "dialogue",
      "aliases": ["学历真假", "MBA 是不是正式学历", "她之前知不知道"]
    }
  ],
  "futureLockedIntents": ["family-economy-deep-followup"]
}
```

不要发送：

- 全案剧本。
- 后文真相。
- 未解锁回答。
- 玩家真实身份信息。
- 完整日志历史。

预算目标：

```text
单次输入：600-1200 tokens
单次输出：80-180 tokens
单案自由追问上限：10-20 次
当前四案 demo 自由追问上限：40-60 次；正式案件包按案数线性调整
首发默认体验目标：本地 matcher 解决 60%-80% 请求
远程 AI 实际调用目标：每个完整故事集 10-25 次
```

如果玩家一直乱问，先扣耐心，再触发本地冷却，不要把每一句都发服务器。

### 服务器侧成本闸门

需要三层限额：

```text
per-scene: 每个 scene 最多 2 次远程 AI
per-case: 每案最多 8-12 次远程 AI
per-run: 当前四案 demo 最多 25-30 次远程 AI；正式案件包按案数设上限
```

超过后：

```text
自由追问现在先收一下。你可以从当前两条追问里选一句继续。
```

这不是惩罚玩家，而是把 AI 从“无限聊天”拉回“主持追问”。

### 内部编剧侧：可用更大上下文

内部工具可以用更多 token，因为它不是按玩家并发烧钱：

```text
热点卡抽象：2k-6k 输入，500-1200 输出
单案压力系统：4k-10k 输入，1k-3k 输出
事实链 QA：8k-20k 输入，1k-3k 输出
台词去 AI 味：2k-8k 输入，1k-4k 输出
四案整体审稿：20k-60k 输入，3k-8k 输出
```

内部生成要走 Batch 或离线队列，不能和玩家实时接口共用预算池。

## 模型选择规划

### 玩家实时路由

目标：便宜、快、稳定 JSON。

推荐：

```text
第一层：本地 matcher，不调用模型。
第二层：低成本小模型，做 classification / intent routing。
第三层：中等模型，仅用于低置信度但玩家明显相关的句子。
```

不建议把大模型放在每次玩家追问上。这个任务不是写小说，而是在有限候选里做分类。

### 内部编剧与审稿

目标：理解复杂事实链、隐藏动机和四案主题。

推荐：

```text
普通改写/去 AI 味：中小模型。
事实链审查/四案结构审查：高质量推理模型。
最终入库：人工审稿，不自动入库。
```

### 价格和模型要做成远程配置

模型价格和能力会变，不能写死在客户端。服务器配置应支持：

```json
{
  "routingModel": "low-cost-json-model",
  "fallbackModel": "mid-tier-reasoning-model",
  "authoringModel": "high-quality-reasoning-model",
  "maxRemoteCallsPerRun": 25,
  "disableRemoteAi": false
}
```

OpenAI 官方价格页会随模型变化更新，预算表只能按发布时价格重算：https://platform.openai.com/docs/pricing

## 是否需要模型训练

第一阶段不需要训练。

更准确地说：不要一开始 fine-tune 远程大模型。先做三件更有价值的事：

1. 写好 `allowedIntents`、`aliases`、`blockedTopics`。
2. 做本地 matcher 和结构化输出。
3. 收集匿名问法，人工标注正确 intent。

等真实玩家数据足够后，再决定训练什么。

## 数据闭环

每次自由追问记录匿名样本：

```json
{
  "schemaVersion": 1,
  "packId": "steam-demo-01",
  "caseId": "education-income-fake-profile",
  "sceneId": "case3-scene4-income-proof",
  "playerTextHash": "sha256...",
  "playerTextRedacted": "她是不是更想知道工资够不够花",
  "modelClassification": "critical_hit",
  "matchedIntentId": "income-control-line",
  "confidence": 0.88,
  "playerConfirmed": true,
  "finalOutcome": "advanced",
  "needsReview": false
}
```

隐私规则：

- 默认不保存原文，保存脱敏文本和 hash。
- 玩家可关闭 AI 日志。
- 不保存 Steam ID 到训练样本。
- 不把辱骂、人肉、现实咨询文本进入训练集。
- 人工审核后才进入 `routing-dataset.jsonl`。

## 训练路线

### 阶段 0：无训练

上线前：

- 本地 matcher。
- 结构化输出。
- 人工写 aliases。
- 自动 eval。

这是试玩版最稳的方案。

### 阶段 1：训练本地轻量分类器

当有 2000-5000 条已标注玩家问法后，可以训练一个小分类器：

```text
输入：playerText + sceneId
输出：classification + intentId
```

用途：

- 提高离线命中率。
- 降低服务器调用。
- 让 Steam Deck / 弱网体验更稳。

它可以是传统文本分类、embedding kNN 或小型本地模型，不必一开始就是大模型 fine-tune。

### 阶段 2：评估是否 fine-tune

只有满足这些条件才考虑 fine-tune：

- 路由准确率卡在 90% 以下。
- 错误主要来自中文口语和反讽表达，而不是内容结构没写清。
- 已有 1 万条以上高质量标注。
- 自动 eval 能稳定复现问题。
- 成本测算证明 fine-tune 比 prompt + 小模型更划算。

如果问题是 aliases 不够、scene 结构不清、选项本身混淆，fine-tune 解决不了，应该先改内容结构。

OpenAI fine-tuning 是可选能力，不应作为第一阶段依赖。官方 fine-tuning 文档：https://platform.openai.com/docs/guides/fine-tuning

## Eval 规划

每个故事集都要有路由测试集：

```text
每个 scene:
  每个 critical intent 10 条玩家问法
  每个 dialogue intent 5 条玩家问法
  partial_relevant 5 条
  premature_relevant 5 条
  off_topic 5 条
  blocked 3 条
```

当前四案 demo 通常 20-24 个 scene，测试集约 600-800 条；正式案件包按 scene 数扩缩。

验收线：

```text
critical_hit 准确率 >= 95%
dialogue_hit 准确率 >= 90%
premature_relevant 召回 >= 90%
blocked 召回 = 100%
候选外 intent 幻觉 = 0
answerId 不属于当前 scene = 0
```

AI 返回后必须做 deterministic validator：

```text
classification 是否在枚举内
matchedIntentId 是否属于当前 scene
matchedAnswerId 是否属于 matchedIntent
futureLockedIntent 是否被提前触发
penalty 是否在允许范围
advanceScene 是否符合 kind
```

## 推荐上线节奏

### Steam 试玩版

- 不强依赖 AI 服务器。
- 本地 matcher 默认开启。
- 远程 AI 默认隐藏在实验设置里。
- 完整故事集可离线通关。

### 首个正式内容包

- 开启 AI Router Server。
- 每个玩家每局远程调用封顶。
- 收集匿名标注。
- 每周跑一次 eval。

### 数据稳定后

- 训练本地轻量分类器。
- 继续保留按钮式主玩法。
- 只在必要时考虑 fine-tuning。

## 官方资料

- OpenAI Structured Outputs 适合强制模型返回固定 JSON schema：https://platform.openai.com/docs/guides/structured-outputs
- OpenAI Batch API 适合内部离线生成、审稿和评估队列，不适合玩家实时追问：https://platform.openai.com/docs/guides/batch
- OpenAI API key 安全建议要求不要把 key 暴露在客户端环境：https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
- OpenAI pricing 需要按上线日期重新核算：https://platform.openai.com/docs/pricing
- OpenAI fine-tuning 可以作为后期选择，但不是第一版必需：https://platform.openai.com/docs/guides/fine-tuning
