# 编剧 Agent 生成 Playbook

## 参考方法

本项目吸收网上成熟剧本/互动叙事方法，但不照搬传统电影模板。

- 传统剧本结构强调 setup / confrontation / resolution，以及故事目标、行动路径、冲突和风险。本项目把它翻译成：为什么今晚来电、材料为什么出现、谁承担成本、如果说清会失去什么。
- Pixar 式故事规则强调先知道结尾、明确“为什么必须讲这个故事”、角色要有立场、风险要清楚。本项目把它翻译成：先写本案最终评论区争点，再倒推五段来电。
- Ink 的互动写作强调文本流、选择、分支、回收和状态追踪。本项目把它翻译成：每个选择只改变追问路线和揭示程度，前台仍线性推进，后台记录路线图。
- Twine 的 passage / link / variable 思路提醒我们：互动叙事要把节点、选择、状态分清。本项目把它翻译成：scene beat、question option、route axis、issue reveal 是四种不同字段。
- LLM 剧本生成论文里的 director / actor 协作、分支图生成和多维评估，适合变成 agent 工作流：导演 agent 控制主题和结构，角色 agent 检查当事人立场，审稿 agent 检查逻辑、情绪深度和冲突处理。

参考入口：

- Screenwriting structural theories: https://en.wikipedia.org/wiki/Screenwriting
- Pixar storytelling rules overview: https://www.creativebloq.com/art/animation/why-the-pixar-rules-of-storytelling-are-as-relevant-in-2026-as-they-were-15-years-ago
- Ink writing documentation: https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md
- Twine Cookbook: https://twinery.org/cookbook/
- IBSEN director-actor drama generation: https://arxiv.org/abs/2407.01093
- GENEVA branching narrative graph generation: https://arxiv.org/abs/2311.09213
- WHAT-IF branching narrative meta-prompting: https://arxiv.org/abs/2412.10582
- DramaBench script continuation evaluation: https://arxiv.org/abs/2512.19012

## Agent 分工

编剧生成不再由一个 prompt 一次性完成，而是分五个角色：

```text
Hotspot Curator Agent：搜集近期网络热点，拆成抽象素材卡。
Showrunner Agent：把 3-4 张热点卡融合成一个原创案件，再决定本集主题、四案组合、价值边界。
Case Writer Agent：写每案压力系统和 stitched transcript。
Actor Consistency Agent：分别站在咨询者、对方、第三方压力位置，检查每句话是否保护自己的利益。
Continuity QA Agent：检查 5-6 段来电、选择后果、路线图、满格深问、复盘和评论墙。
```

五个角色可以由同一个模型分阶段扮演，但输出必须分阶段保存，不能直接跳到字段 JSON。

## 热点融合

故事集不直接改编单个热点。每个原创案件先选 3-4 张近期热点素材卡：

```text
主热点：提供案件骨架。
旁支热点 A：提供话术。
旁支热点 B：提供材料形态。
旁支热点 C：提供误读风险或第三方压力。
```

融合规则：

- 只取结构，不取原人物、原账号、原时间线、原金额、原话。
- 每张热点卡只能承担一个功能，不能把几条新闻摘要堆在同一个案子里。
- 合成后必须换关系阶段和证据出现方式。
- 观众能感觉“像最近网上会吵的事”，但不能反推出具体来源。
- 如果一张热点卡本身已经足够完整，也要至少加入一个外部话术或材料形态，避免单源改写。

## 单案生成顺序

每案按这个顺序写：

1. **热点融合**：写 `hotspotFusion`，说明主冲突、旁支话术、材料形态、误读风险分别来自哪类素材。
2. **结尾先行**：先写评论区最终会吵什么。
3. **压力系统**：写 whyTonight、dramaticAnchor、objectPurpose、callerStake、otherStake、thirdPressure、truthBoundary。
4. **五段 beat ladder**：
   - Beat 1：材料或原话第一次出现，玩家只能看到表层不对劲。
   - Beat 2：材料边缘缺失，玩家知道它不能证明完整结论。
   - Beat 3：利益路径出现，谁受益、谁承担成本开始清楚。
   - Beat 4：来电人自我修剪暴露，咨询者也不是完全透明。
   - Beat 5：责任落点或关系施压出现，进入最终挑句。
5. **选择设计**：每段 2-3 个主播追问。每个选项都能成立，但只有部分能抓核心。
6. **分支回收**：每段回答后都回到下一段来电，不能让玩家扫同节点剩余选项。
7. **满格深问**：只有五段核心都抓到，才多问咨询者自己的利益、成本、面子或隐藏诉求。
8. **最终原话**：最终按钮必须是已经出现过或高度贴近的原话，不是抽象判词。
9. **复盘分层**：先给玩家路线和揭示率，再给事实真相、双方责任和下一步边界。

## 生成质量评分

每个草稿入库前给 0-2 分：

```text
结构：是否有 5-6 段完整 beat ladder。
冲突：每段是否都增加新压力，而不是重复同一个疑点。
角色：咨询者、对方、第三方压力是否各自有利益。
互动：每个选项是否都像主播会问的话，且有不同后果。
回收：分支是否回到主线而不造成断裂。
现实：是否像评论区会吵的真实公共事件，而不是悬浮短剧。
价值：是否打击具体坏行为，不制造性别或群体对立。
原创：是否融合多个热点结构，且不能还原任何单一真实事件。
```

低于 10 分不得入库；任一项 0 分必须重写，不允许靠局部润色通过。

## 禁止项

- 先写字段再倒推故事。
- 只给 3 个疑点就说能撑 20 分钟。
- 每段只是换说法重复“截图不完整”。
- 让外部材料自己说话，而不是咨询者拿出、念出、转述。
- 把选择写成对/错阅读理解。
- 让价值观把互害磨成“两边都有问题”。
- 把评论墙写成宣传语，而不是玩家路线的二次讨论。
