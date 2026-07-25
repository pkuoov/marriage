# 文档入口

更新时间：2026-07-25

`docs/` 只保留现行规范、生产交接、发行计划和可再生成的审查稿。已经执行完的 pass Prompt、外部模型复审、被 skill/测试吸收的方案和废止美术方向不继续保留；需要追溯时使用 Git 历史。

## 从这里开始

- [启动说明](startup-guide.md)
- [当前路线](roadmap.md)
- [未完成项目](unfinished-backlog.md)
- [开发测试组验收入口](qa-test-guide.md)
- [故事工程总入口](../story.md)

## 故事与玩法真源

- [游戏价值边界](game-philosophy.md)
- [直播案件包设计圣经](weekly-livestream-design-bible.md)
- [内容包 Schema](content-pack-schema.md)
- [内容包开发管线](story-pack-development-pipeline.md)
- [编剧 Agent 工作流](script-generation-agent-playbook.md)
- [台词相邻回合审计规则](dialogue-continuity-audit.md)
- [侦探结构改进规则](detective-coupling-improvement-plan.md)
- [材料呈堂与文档玩法蓝图](demo2-rebuild-blueprint.md)
- [双夜结构](two-call-night-design.md)
- [多场景罗生门结构](multi-scene-rashomon-design.md)
- [主播调查与证据回流](host-investigation-loop.md)

人物性格、场景功能、伏笔和跨案状态分别维护在 `characters/`、`scenes/`、`plot/`、`continuity/`；玩家实际看到的文本维护在 `content/packs/steam-demo-01/`。

## 人物

- [主播人物设计](host-character-design.md)
- [顾问 NPC 与麦外声音](advisor-npc-and-offmic-design.md)
- `content/characters/`：运行时角色真源与声纹圣经
- `characters/`：供人阅读和结构检索的人物投影

## 音频与美术

- [Udio BGM 当前制作单](udio-bgm-production-prompts-v2.md)
- [BGM 生成记录](bgm-generation-log.md)
- [BGM 处理管线](bgm-processing-pipeline.md)
- [真人录音交接单](audio-recording-handoff.md)
- [像素立绘与过场现行标准](pixel-art-transition-and-portrait-direction.md)
- [UI／立绘／场景资产状态](ui-art-asset-review.md)

`udio-bgm-production-prompts-v2.md` 是目前唯一仍在使用的生成 Prompt。旧写实立绘、半剪影、眼部光带和已完成 BGM 批次 Prompt 均已删除。

## QA 与发行

- [游戏测试用例](game-unit-test-cases.md)
- [剧情流校验说明](narrative-flow-validation.md)
- [真人盲玩验收单](p1-blind-playtest-2026-07-18.md)
- [通用试玩记录模板](playtest-report-template.md)
- [桌面与 Steam 构建计划](desktop-steam-build-plan.md)
- [微信小程序适配](wechat-miniapp-adaptation.md)

## 后续内容生产

- [案例来源与改写边界](case-library-sources.md)
- [每日案例情报管线](daily-case-intelligence.md)
- [社区投稿方案](community-case-submissions.md)
- [受控 AI 问题模式](ai-question-mode-design.md)
- [AI 服务与训练计划](ai-server-token-training-plan.md)
- [受控意图 Schema](controlled-ai-intent-schema.md)

## 生成稿

`docs/generated/` 由脚本生成，只用于阅读、朗读和审查，禁止直接改稿：

- 连续故事版
- 完整阅读版
- 纯故事台本
- 导演台本
- 角色台词报告
- 相邻问答报告
- 剧情流报告

台词或结构修改后运行：

```bash
npm run content:index
npm run content:script
npm run check
```

## 文档生命周期

新增文档前先判断内容属于哪里：

1. 长期规则写入现有设计文档或 `project-skills/`。
2. 玩家可见内容写入案件 JSON，不另建台词副本。
3. 未完成事项写入 `unfinished-backlog.md`。
4. 一次性评审意见执行后应转成代码、测试、skill 或 backlog 条目，不长期保留 Prompt。
5. 可由脚本重建的报告放在 `docs/generated/`，并由检查命令防止过期。
