# 故事包开发流程

本流程维护内容包的接入和交付；创作判断统一见 [项目方向](../project-skills/case-scriptwriting/references/current-project-direction.md)。局部改稿不必重新立项一个故事包。

## 来源与包结构

新包先确认目标、人物关系、案件之间的衔接与采用的模式。当前 `steam-demo-01` 是四主案、三快案；规模、两夜配置与已批准的跨案线只约束本包，不自动成为未来新案配额。

公开素材可以启发冲突、话术或材料形态。核对来源、去除可识别个案的组合并原创改写；不要求每案拼入三四张热点。`content/intelligence/plot-template-pool.json` 是素材种子，`verify:content-pipeline` 校验这个池的现有配置，不能证明案件已经可玩。

## 起稿或改稿

按 [编剧工作流](script-generation-agent-playbook.md) 串读人物诉求、前后说法和实际行动。选择适合案件的陈述、证言、材料或口播模式，不以五段、固定两问、满格深问或强制复盘作为通用结构。

信息按发现顺序进入 JSON。先统一前后互斥的行为，材料先有取得过程，再查阅和发问。玩家可以不询问当前原句；已经听过的答案和状态在后文保持。人物的抵赖和迟疑由实际动机决定。

## 数据与构建

字段契约见 [内容 Schema](content-pack-schema.md)，保存与刷新见 [运行时接入](../project-skills/case-scriptwriting/references/runtime-content-integration.md)。包级顺序和演出在 manifest；案件对白在 cases；快案在 quick-cases；人物以 cast 为真源。生成索引与阅读稿只由脚本更新。

`metadata-only` 保持为未接入设计；只有消费者和必要字段就绪，才标 `runtime-loaded`。这不是要求任何局部修改重新退回草案。

```bash
npm run content:index
npm run content:script
npm run check
npm run build:playable
```

## 验证与交付

检查分开报告：结构／引用、实际播放顺序、存档恢复、PC 可见布局、人工语义连读、目标平台运行。选择受影响浏览器目标，见 [验收指南](qa-test-guide.md)。只改规范不必发布构建；改对白也不自动要求制作 Windows 包。

发行按 [Windows 手册](windows-exe-build-guide.md) 与 [桌面计划](desktop-steam-build-plan.md) 验收。测试通过不等于真人朗读、配音、Windows 原生或完整盲玩已完成。未执行、失败、因环境受阻分别记录。
