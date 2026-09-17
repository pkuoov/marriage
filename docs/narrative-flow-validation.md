# 叙事检查的范围与工作流

现行方向见 [项目方向](../project-skills/case-scriptwriting/references/current-project-direction.md)。`npm run test:narrative` 是确定性检查，不是中文对白自然度或 UI 验收。

## 自动检查实际覆盖

脚本 `scripts/verify-narrative-flow.js` 按八个日期调用 daily 入口，复用已接入的案件并生成 `docs/generated/narrative-flow-report.md`。八个日期不等于八个独立案件，也不证明序章、跨夜、快案或整包全程已走通。字段抽取中的兼容问答不等于当前舞台一定播放它。

它检查非空内容、问题与回答存在、明显占位／来源问题等；文字启发式只能发现候选问题，不能凭词表保证承接成立。段数、字数或包含“多少／为什么”不能证明好不好问，不能靠凑这些量通过创作验收。

完整内容与稳定 ID 由 `verify:pack` 等检查；台本和实播对照分别用 `--target=script-reading`、`--target=testimony-reading`；三个快案使用 `--target=quick-detective`。来源先后、可选信息和说话人仍需人工连读实际交换。

## 语义审读

按照 [对白审读流程](../project-skills/case-scriptwriting/references/story-review-workflow.md) 看完整上下文。人物可能答偏、反复和迟疑；需要判断他在保护什么，而不是要求下一句直接回答完全部问题。主持人可据实际异常猜测和施压，材料和系统不能把猜测认证成事实。

按集中问询检查必要来源和问答承接，没问清留在本段，问清推进。口播任一有效点评即可。旧回放、深问和材料配对的现有用例只描述兼容行为，不要求新案保留；旧案例定点断言也不能锁住用户未指定的字句或段数。

## UI 与测试结论

按 [验收指南](qa-test-guide.md) 使用隔离存档，PC 优先验证可见边界、点击后的状态与实际截图。查询参数不隔离存档，能定位按钮不等于按钮在窗口内。

报告区分结构通过、实播内容一致、路径可达、布局通过与人工语义审读。旧整句断言失效时先核对用户锁定文本和现行剧情；用户没锁定的自然问法允许修改，来源与进度等硬约束继续验证。只改规范不需重新跑游戏的全部浏览器路线。

词汇与句式启发式输出为 `severity: review` 的人工复审候选，缺正文、缺回答、来源不成立等结构问题为 `severity: error` 并阻断。候选不能当作“自然／不自然”的机器定论；没有候选也不表示语义审读完成。新增规则回归由 `authoring-policy.test.js` 验证，已接入 `npm run check`。
