# 文档入口

更新时间：2026-09-14

`docs/` 顶层只保留现行规范、生产交接、发行计划和可再生成的审查稿。已经执行完的 pass Prompt、外部模型复审、被 skill/测试吸收的方案和废止美术方向不在顶层保留执行正文；少量旧链接保留明确的历史跳转；需要保留复审来源时统一放进 `review-archive/`，其余追溯使用 Git 历史。

## 从这里开始

- [现行标准索引与适用范围](standards-index.md)
- [本轮技能、标准与校验审计](review-archive/project-standards-audit-2026-09-14.md)
- [更新标准后的全剧本、台词与选项问题清单](review-archive/full-script-choice-review-2026-09-14.md)

- [启动说明](startup-guide.md)
- [当前路线](roadmap.md)
- [未完成项目](unfinished-backlog.md)
- [9 月 14 日 PC 修复与全案连贯性复审](review-archive/playtest-common-fixes-2026-09-14.md)
- [本轮逐句审读与修订](review-archive/line-by-line-review-2026-09-05.md)
- [开发测试组验收入口](qa-test-guide.md)
- [故事工程总入口](../story.md)
- [当事人诉求主线与快案四题材记录](review-archive/caller-request-spines-2026-09-08.md)
- [各案主线、对话宗旨与目标匹配续审](review-archive/case-goal-dialogue-alignment-2026-09-08.md)
- 前两主案先定主线：[信用卡](review-archive/credit-mainline-2026-09-08.md)、[职场报销](review-archive/workplace-mainline-2026-09-08.md)

## 故事与玩法真源

当前试玩包为四个主案、三个快案。叙事验证报告中的八条记录是按日期生成的测试样例，不是八个独立案件。

- [游戏价值边界](game-philosophy.md)
- [直播案件包设计圣经](weekly-livestream-design-bible.md)
- [内容包 Schema](content-pack-schema.md)
- [内容包开发管线](story-pack-development-pipeline.md)
- [编剧 Agent 工作流](script-generation-agent-playbook.md)
- [台词相邻回合审计规则](dialogue-continuity-audit.md)
- [本地台词审阅工具](dialogue-editor.md)
- [直播快案：主播对质模式](quick-detective-mode.md)

人物性格、场景功能、伏笔和跨案状态分别维护在 `characters/`、`scenes/`、`plot/`、`continuity/`；玩家实际看到的文本维护在 `content/packs/steam-demo-01/`。

## 人物

- [主播人物设计](host-character-design.md)
- `content/characters/`：运行时角色真源与声纹圣经
- `characters/`：供人阅读和结构检索的人物投影

## 音频与美术

- [Udio BGM 当前制作单](udio-bgm-production-prompts-v2.md)
- [Udio 缺曲补充单与追索降噪 Prompt](udio-missing-bgm-prompts-2026-09-05.md)
- [BGM 生成记录](bgm-generation-log.md)
- [三首新增 BGM 选剪与接入](review-archive/bgm-selection-2026-09-06.md)
- [BGM 处理管线](bgm-processing-pipeline.md)
- [真人录音交接单](audio-recording-handoff.md)
- [Amphion 对话语音管线](amphion-dialogue-voice-pipeline.md)
- [Windows Amphion 语音试制交接单](windows-amphion-voice-handoff.md)
- [声音参考授权与同意模板](voice-reference-consent-template.md)
- [像素立绘与过场现行标准](pixel-art-transition-and-portrait-direction.md)
- [UI／立绘／场景资产状态](ui-art-asset-review.md)

Udio 总制作单与缺曲补充单目前仍在使用；追索音乐以补充单中的降噪版为准。旧写实立绘、半剪影、眼部光带和已完成 BGM 批次 Prompt 均已删除。

## QA 与发行

- [游戏测试用例](game-unit-test-cases.md)
- [剧情流校验说明](narrative-flow-validation.md)
- [本轮修复进度与验证](review-archive/repair-progress-2026-09-05.md)
- [原话、材料与信息披露修订账本](review-archive/narrative-repair-ledger-2026-09-05.md)
- [音乐节点、实测与试听待办](review-archive/audio-cue-review-2026-09-05.md)
- [通用试玩记录模板](playtest-report-template.md)
- [综合重估与发行建议报告 (2026-09)](steam-demo-01-comprehensive-evaluation-2026-09.md)
- [桌面与 Steam 构建计划](desktop-steam-build-plan.md)
- [Windows EXE 制作与验包手册](windows-exe-build-guide.md)
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

## 提交前行为闸门

修改 `content/`、`src/ui/`、`src/app.js`、反制拍或场景流程后，提交前必须运行：

```bash
npm run test:pr
```

`npm run check` 负责静态结构、内容边界和叙事路径；`npm run test:pr` 会在此基础上追加浏览器完整回放。涉及 Electron、桌面打包或发布流程时，再运行 `npm run test:full`。

## 运行时屏幕纪律

新增完整屏幕时放进 `src/ui/screens/`，由 `create*Screens(ctx)` 工厂接收能力；事件触发时再通过 `ctx.getState()` 读取当前状态。不要把新屏幕重新堆回 `src/app.js`，也不要从屏幕模块反向导入 `app.js`。

## 文档生命周期

新增文档前先判断内容属于哪里：

1. 长期规则写入现有设计文档或 `project-skills/`。
2. 玩家可见内容写入案件 JSON，不另建台词副本。
3. 未完成事项写入 `unfinished-backlog.md`。
4. 一次性评审意见执行后应转成代码、测试、skill 或 backlog 条目，不再放在 `docs/` 顶层。确需保留外部复审来源时，只在 `review-archive/` 留一个标明执行状态的最终版本；同一批的截断稿、v2 副本和临时改名稿必须合并。
5. 可由脚本重建的报告放在 `docs/generated/`，并由检查命令防止过期。

## 历史设计

[旧标准归档](review-archive/standards-before-2026-09-14/README.md)保留双夜、Demo 2、顾问与主播早期方案及旧 P1 验收稿，只用于追溯，不作为新改稿指令。专项提案与现行交付规范的适用范围见标准索引。
