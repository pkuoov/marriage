# AI 问答改造方案

审查日期：2026-06-30

## 结论

可以改成 AI 问答，但不建议把核心玩法改成“玩家随便问，AI 随便答”。

更稳的方案是：

```text
玩家输入自然语言
-> AI 判断这句话最接近哪个已授权追问意图
-> 系统展示将要采用的主播追问
-> 玩家确认
-> 进入已经写好的回答和分支记录
```

这样既有自由输入的爽感，又保留 Steam 叙事游戏最重要的确定性、可测性和作者表达。

## 为什么不能完全自由生成

这类游戏的爽点不是“AI 聊天很像真人”，而是：

- 玩家问到了没说全的半句话。
- 系统承认这个追问切中了事实链。
- 后面的复盘能证明玩家为什么问得对。

如果 AI 可以随便生成新事实，会破坏：

- 事实链一致性。
- 最终结论可解释性。
- 复盘公平性。
- 内容评级和平台审核。
- 测试覆盖。
- 玩家隐私和成本控制。

所以发售版核心要坚持：事实由编剧写死，AI 只能做“理解玩家问法”和“语言转译”。

## 推荐形态：受控自由追问

### 前台体验

页面上仍然保留明确按钮：

- 询问对话。
- 关键追问。

在关键追问区域旁边增加一个实验入口：

```text
自由追问
```

玩家输入：

```text
她为什么非要看流水，是不是想知道婚后钱归谁管？
```

系统返回：

```text
识别为：钱流结构线
将采用追问：你要流水，是想确认他有没有骗你，还是想确认婚后工资能不能放一起管？
```

玩家确认后，仍然走既有 `questionOptionId`，不生成新剧情。

### 后台结构

每个 scene 的 `questionOptions` 增加 AI 路由字段：

```json
{
  "id": "income-control-line",
  "kind": "critical",
  "question": "你要流水，是想确认他有没有骗你，还是想确认婚后工资能不能放一起管？",
  "routeAxis": "钱流结构线",
  "routeTone": "反问来电人隐藏诉求",
  "intentAliases": [
    "想看收入",
    "工资够不够花",
    "婚后钱归谁管",
    "流水到底证明什么"
  ],
  "factsUnlocked": ["caller-income-stake", "wage-card-control"],
  "forbiddenNewFacts": true
}
```

AI 返回结构必须类似：

```json
{
  "matchedOptionId": "income-control-line",
  "confidence": 0.86,
  "reason": "玩家追问工资流水背后的控制权，命中钱流结构线。",
  "safeRewrite": "你看流水，是想确认真假，还是想确认婚后工资怎么管？",
  "outOfScope": false
}
```

当 `confidence` 不足时：

```json
{
  "matchedOptionId": null,
  "confidence": 0.38,
  "reason": "玩家问题涉及未出现的新人物，当前场景没有授权事实。",
  "safeRewrite": "",
  "outOfScope": true
}
```

UI 应提示：

```text
这句现在还问不到关键处。你可以先问材料缺了哪一边，或者问这句话最后让谁承担成本。
```

## 相关对话如何判别

不能让 AI 直接决定“这句算相关”。相关性必须由当前 scene 的内容结构决定，AI 只做语义归类。

每个 scene 需要显式写出四类可判别对象：

```json
{
  "sceneId": "case3-scene4-income-proof",
  "visibleFacts": ["男方提供了 MBA 材料", "女方要过流水", "男方不高兴"],
  "allowedIntents": [
    {
      "id": "income-control-line",
      "kind": "critical",
      "routeAxis": "钱流结构线",
      "question": "你要流水，是想确认他有没有骗你，还是想确认婚后工资能不能放一起管？",
      "answerId": "income-control-answer",
      "aliases": ["流水想证明什么", "工资够不够花", "婚后谁管钱", "她是不是更在意收入"]
    },
    {
      "id": "mba-truth-line",
      "kind": "dialogue",
      "routeAxis": "材料真实性线",
      "question": "MBA 这件事，你是一开始完全不知道，还是之前就感觉不太对？",
      "answerId": "mba-truth-answer",
      "aliases": ["学历是不是骗她", "MBA 算不算正式学历", "她之前知道吗"]
    }
  ],
  "futureLockedIntents": ["family-economy-deep-followup"],
  "blockedTopics": ["法律建议", "现实人肉", "辱骂性别", "未出现的新证据"]
}
```

判别顺序：

1. **越界过滤**：辱骂、人肉、法律/心理/维权建议、现实个人信息，直接 blocked。
2. **当前场景过滤**：只允许匹配当前 scene 的 `allowedIntents`，不能提前解锁后文事实。
3. **本地词表匹配**：先用关键词、别名、证据名、金额、人物关系做本地匹配。
4. **AI 语义归类**：本地不够时，让 AI 在候选 intent 里选一个，不允许输出候选外的 intent。
5. **置信度门槛**：高置信度才执行；中置信度让玩家确认；低置信度按无效追问处理。
6. **重复检查**：已经问过的方向不能重复拿奖励，最多给一句“这条刚才已经问过”。

AI 返回结构应该比第一版多一个 `classification`：

```json
{
  "classification": "critical_hit",
  "matchedIntentId": "income-control-line",
  "matchedAnswerId": "income-control-answer",
  "confidence": 0.88,
  "evidence": ["流水", "工资", "婚后谁管钱"],
  "safeRewrite": "你要流水，是想确认他有没有骗你，还是想确认婚后工资能不能放一起管？",
  "penalty": 0,
  "advanceScene": true
}
```

分类表：

```text
critical_hit
命中当前 scene 的关键追问。采用已写好的关键问题和回答，推进剧情，记录 routeAxis。

dialogue_hit
命中当前 scene 的普通询问。采用已写好的短回答，不推进关键节点，不扣血。

partial_relevant
和当前证据有关，但问法太泛，例如“他是不是有问题”。给一句主持人压缩提示，轻微消耗耐心，不解锁事实。

premature_relevant
问到了后文才该问的方向，例如第一段就问“你自己工资够花吗”。回答“这句现在还早”，轻微消耗耐心，不解锁后文。

repeat
重复问已处理过的方向。提示刚才已经问过，扣少量耐心。

off_topic
和本 scene 无关，或要求 AI 生成新事实。扣血/扣耐心，不给剧情信息。

blocked
辱骂、人肉、现实咨询、违法建议、群体攻击。直接拦截，可扣较多耐心。
```

血量/耐心建议：

```text
critical_hit: 0
dialogue_hit: 0
partial_relevant: -0.5
premature_relevant: -0.5
repeat: -1
off_topic: -1
blocked: -2
```

“相关但不回答”的情况尤其重要。比如玩家在第三案第一段就输入：

```text
她是不是自己也缺钱？
```

这确实相关，但如果当前 scene 还没有出现流水、家庭经济、工资够不够花，就不能提前给事实。系统应判为 `premature_relevant`：

```text
这句有方向，但现在证据还没露出来。先问她要这些材料到底想证明什么。
```

等到后面 scene 出现“流水”“工资卡”“家里也在看条件”，同一句输入才可以命中 `critical_hit` 或满格后的 `deep_followup`。

## 回答如何生成

回答不能由 AI 现场编。每个 intent 都必须绑定一个已写好的 `answerId`：

```json
{
  "answers": {
    "income-control-answer": {
      "callerText": "我当时嘴上说是确认学历有没有水分，其实也想知道他工资到底剩多少。要是以后真结婚，我不可能连他每个月怎么花都不知道。",
      "unlocks": ["caller-income-stake", "wage-card-control"],
      "recapNote": "来电人不是只查 MBA，她也在借材料确认婚后钱流控制权。"
    }
  }
}
```

AI 最多做两件事：

- 把玩家输入改写成主播会说的话。
- 从当前候选 `answerId` 里选一个。

AI 不能做：

- 改写来电人的事实回答。
- 新增金额、截图、人物、时间线。
- 直接给“真相”。
- 替玩家生成结论。

## 技术架构

建议新增：

```text
src/ai/
  questionRouter.js
  localMatcher.js
  aiSchemas.js
  guardrails.js
  providerClient.js
server/
  ai-proxy/
    index.js
```

AI 服务器、token 预算、模型选择和训练路线单独维护在 `docs/ai-server-token-training-plan.md`。原则是：主流程离线可玩，远程 AI 只做低频意图路由；训练先从匿名标注和 eval 开始，不把 fine-tuning 当成第一阶段依赖。

### `questionRouter.js`

职责：

- 接收玩家输入、当前 case、scene、可问选项。
- 先跑 `localMatcher`。
- 本地置信度足够时不请求 AI。
- 置信度不足时请求服务端 AI proxy。
- 返回一个已存在的 `questionOptionId`，或返回 out-of-scope。

### `localMatcher.js`

职责：

- 关键词和同义词匹配。
- 支持离线和无网络。
- 支持 Steam demo 默认体验。

本地匹配要覆盖常见玩家说法：

```text
钱 / 流水 / 工资 / 够花 / 谁管钱
截图 / 少了哪边 / 截掉 / 上下文
房本 / 还贷 / 装修 / 分开怎么算
主责 / 报销 / 垫款 / 审批
```

### `guardrails.js`

硬规则：

- AI 不能新增事实。
- AI 不能替玩家判案。
- AI 不能输出法律、心理、职场维权建议。
- AI 只能选择当前 scene 已授权的 option。
- AI 必须引用 `option.id`，不能编造 id。
- 如果玩家问到本案未出现的人、金额、证据，必须 out-of-scope。

### `providerClient.js`

Steam 客户端不能内置 API key。应走开发者自有服务端 proxy：

```text
Steam 客户端
-> 自有 AI proxy
-> OpenAI API
```

proxy 做：

- API key 保管。
- 限流。
- 日志脱敏。
- 地区/网络失败 fallback。
- 模型和 schema 版本管理。

## OpenAI 接入建议

优先使用结构化输出，让模型只能返回固定 JSON 字段。OpenAI 官方 Structured Outputs 文档说明它可以让模型输出符合开发者提供的 JSON Schema 的结果，适合这里的“输入问题 -> 匹配意图”任务：https://platform.openai.com/docs/guides/structured-outputs

如果后续要做低延迟语音直播感，再考虑 Realtime API；但 Steam demo 第一版不应该先做语音自由聊天。参考 OpenAI Realtime 文档：https://platform.openai.com/docs/guides/realtime

API key 安全上，OpenAI 官方建议不要在客户端暴露密钥，应放在安全位置并定期轮换；Steam 客户端属于可被解包环境，必须走服务端 proxy。参考 OpenAI API key safety：https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety

## AI 在本项目里的三个合理用途

### 1. 玩家自由追问路由器

上线优先级：中。

作用：

- 让玩家可以用自己的话问。
- 系统映射到已写好的关键追问。
- 不改变事实链。

适合 Steam demo 的“实验设置”，不应是唯一玩法。

### 2. 编剧工作流 Agent

上线优先级：高，但只在开发侧。

作用：

- 搜集热点后抽象成素材卡。
- 合成四案故事集主题。
- 检查双方隐藏信息。
- 检查事实链和 AI 味。
- 生成多版主播追问，然后人工筛选。

这部分已经在 `docs/script-generation-agent-playbook.md` 里有基础，可以继续加强为工具链。

### 3. 玩家复盘改写器

上线优先级：低。

作用：

- 根据玩家路线生成更口语化的评论墙。
- 根据玩家抓到的关键点生成个性化收麦。

风险：

- 容易生成说教腔。
- 容易对现实事件给出过度建议。
- 需要更强的内容审核和回归测试。

建议先用模板组合，不要第一版就接 AI。

## 最小可行版本

第一版不要接远程 AI，先实现本地自由追问路由：

1. 给每个 `questionOption` 增加 `id` 和 `intentAliases`。
2. 写 `localMatcher.js`，把玩家输入匹配到 option。
3. UI 加一个“自由追问”输入框。
4. 匹配成功后展示系统采用的问题，玩家确认再推进。
5. 匹配失败时推荐两个当前可选方向。
6. 把匹配结果写入 `routeChoiceLog`。
7. 测试每案每段至少 5 个常见问法能命中正确选项。

第二版再接 OpenAI：

1. 建服务端 proxy。
2. 加 JSON Schema。
3. 用小流量灰度。
4. 保留本地 matcher fallback。
5. 默认关闭，设置里标成实验功能。

## 对玩法的影响

AI 问答不是为了增加分支数量，而是为了减少按钮感。

改造后，一段来电可以有三种玩家路径：

```text
直接点关键追问
-> 传统稳定玩法

先问询问对话，再点关键追问
-> 当前逆转裁判式节奏

输入自由追问，被系统映射到关键追问
-> 更像真的在直播间接话
```

三条路径最后都回到同一个已写好的回答。差别只体现在：

- routeAxis。
- routeTone。
- 玩家复盘。
- 评论墙。
- 是否触发“你自己也没说全”的深问。

## 不建议做的版本

不要做：

```text
玩家随便问
-> AI 扮演来电人现场编
-> AI 即兴产生证据
-> AI 即兴给结论
```

这会让游戏变成不稳定聊天机器人，也会破坏“现实版逆转裁判”的核心爽点。

本作的方向应该是：

```text
作者写事实。
玩家问角度。
AI 帮系统听懂玩家。
复盘证明玩家为什么问得准。
```
