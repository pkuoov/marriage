# 现行标准索引

更新：2026-09-20。本页管理规则归属与适用范围，具体规则只在对应源文件维护。

## 优先级与真源

用户当前要求和本任务已确认的修改优先。跨技能共识维护在[当前项目方向](../project-skills/case-scriptwriting/references/current-project-direction.md)；专项文档与 skill 负责落地，不另设相反规则。代码用于确认实际字段、模式与行为，已知 bug 不能反过来成为标准。测试必须能追溯到当前需求或真实数据合同。

| 范围 | 维护入口 | 不能由它推导的要求 |
| --- | --- | --- |
| 剧情、来源、集中问询与逐句承接 | [当前方向](../project-skills/case-scriptwriting/references/current-project-direction.md)、[谎盖谎](../project-skills/case-scriptwriting/references/caller-shameless-demand.md)、[二次改稿](../project-skills/case-scriptwriting/references/second-revision-dialogue.md)、[复审流程](../project-skills/case-scriptwriting/references/story-review-workflow.md) | 每案固定段数、每句新事实、人人认错、凑语气词；给妄人硬编难言之隐 |
| 技能触发与工作范围 | `project-skills/*/SKILL.md`、各自 `agents/openai.yaml` | 一句修订也重做整案、默认召集多个代理 |
| JSON、播放顺序、存档 | [Schema](content-pack-schema.md)、[运行时接入](../project-skills/case-scriptwriting/references/runtime-content-integration.md) | 有内部字段就必须增加玩家页面；所有模式共用按钮规则 |
| 当前主案与快案 | [主案设计](weekly-livestream-design-bible.md)、[快案模式](quick-detective-mode.md)、manifest 与案件 JSON | 当前某案的轮数成为所有未来案件配额 |
| 人物事实与声音 | `content/characters/cast.json`、`voice-bible.md`、`offmic-voices.md` | 职业吞掉私人关系、每场固定声线切换 |
| 开发与交付 | [内容管线](story-pack-development-pipeline.md)、[编剧工作流](script-generation-agent-playbook.md) | 历史五阶段评审或每次完整发布成为局部改字前置 |
| PC 验证 | [QA](qa-test-guide.md)、[试玩记录](playtest-report-template.md)、[校验覆盖说明](narrative-flow-validation.md) | DOM 可见等于无遮挡、静态通过等于真人剧情验收 |

主案是四案，按 manifest 为信用卡、职场报销、存款证明、理发店；快案三案。daily 的日期样本数、旧模板数量、拟议案型数分别记录，不能充当可玩案件数。

## 专项标准与提案

音频处理、录音授权、像素资产、桌面构建与 Windows 验包规范按各自交付范围继续生效。PC 优先不取消真实 Windows 发布验收，也不降低材料来源或录音授权要求。`daily-case-intelligence`、社区投稿、AI 意图和服务计划、微信适配属于各自管线或后续方案，不决定当前固定剧情的事实与交互。

`characters/`、`scenes/`、`plot/`、`continuity/` 是人物与故事工程索引；与运行时 JSON 不一致时追溯当前用户决定，再同步投影，不能默默覆盖已修正文稿。生成阅读稿仅供审阅，不手改。

## 历史与规则更新

旧双夜、多场景、Demo 2 蓝图、主播声线、侦探改进、调查循环、顾问方案、P1 盲测计划、主播角色方案和情报台旧稿已保留为明确标注的历史入口；原稿在 [归档目录](review-archive/standards-before-2026-09-14/README.md)。历史案例、语料和评审只解释来由，不参与当前规则优先级。

修改共性标准时同步查四处：源规则、skill 提示词、文档入口、实际校验。记录受影响模式和验证结果；场景特例留在本案，不升格成全局禁词或创作配额。本轮证据见[标准审计](review-archive/project-standards-audit-2026-09-14.md)。

## 2026-09-16 人工修改归纳与六案复审

当前方向 S1–S9 统一了集中问询、本段重问、材料直接核对、来源与知情、口语、简短收尾，以及以小见大、一段一层的剥雾节奏。案一男方不上麦与匿名朋友圈留在本案，不推广成其他案件事实。

[清理记录](review-archive/standards-cleanup-2026-09-16.md)列出源规则和校验变更；[六案复审](review-archive/remaining-cases-review-2026-09-16.md)覆盖其余三主案及全部三快案。六案正文与集中问询迁移已接入，实施与验收见复审报告末尾；历史通读完成不替代当前版本验收。
