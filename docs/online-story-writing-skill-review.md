# 在线编故事 / 写剧本 Skill 无上下文评估

日期：2026-07-17

## 评估方式

这里的“无上下文”指：不给 skill 本项目的四案、角色卡、JSON schema 和既有写作规范，只给一个普通创作任务，观察它能否自己问到必要信息、产出可执行结构并守住人物连续性。评价对象只看公开仓库或公开 skill 正文，不用本项目现状替它补分。

Agent Skills 的官方规范把 skill 定义为一个含 `SKILL.md` 的目录，可按需附带脚本、参考资料和资产；推荐渐进披露，而不是一次把所有背景塞进提示词。本评估因此不只看“文采提示”，也看是否有输入契约、步骤、产物和校验。基线来源：[Agent Skills 规范](https://github.com/agentskills/agentskills)、[Anthropic Skills](https://github.com/anthropics/skills)。

六个维度各 10 分：

1. 结构：能否从前提走到场景、节拍、转折和收束。
2. 人物：能否建立欲望、恐惧、矛盾、声纹和人物弧。
3. 冷启动：没有项目上下文时，能否先收集信息或给出可靠默认值。
4. 可执行：是否规定输入、步骤、输出和失败处理，而不只是写作常识清单。
5. 连续性：是否会读旧稿、维护注册表、检查时间线和知识边界。
6. 剧本适配：是否真正处理场景、对白、舞台动作和可演性，而不只是小说 prose。

## 结论表

| Skill | 结构 | 人物 | 冷启动 | 可执行 | 连续性 | 剧本适配 | 无上下文总评 |
|---|---:|---:|---:|---:|---:|---:|---|
| [danjdewhurst/story-skills](https://github.com/danjdewhurst/story-skills) 整套 | 9 | 8 | 4 | 9 | 10 | 5 | 适合长期项目，不适合真正空白对话直接开写 |
| [plot-structure](https://github.com/danjdewhurst/story-skills/tree/main/skills/plot-structure) | 9 | 6 | 4 | 8 | 9 | 5 | 结构强，但依赖既有 `story.md` 工程 |
| [chapter-writing](https://github.com/danjdewhurst/story-skills/tree/main/skills/chapter-writing) | 8 | 8 | 3 | 9 | 10 | 4 | 章节连续性强，小说工程倾向明显 |
| [jwynia/story-collaborator](https://github.com/jwynia/agent-skills/tree/main/skills/creative/fiction/core/story-collaborator) | 7 | 8 | 8 | 8 | 5 | 6 | 最适合即席共创和短场景试写 |
| [jwynia/dialogue](https://github.com/jwynia/agent-skills/tree/main/skills/creative/fiction/character/dialogue) | 5 | 9 | 9 | 8 | 5 | 8 | 对白诊断最强，但不是完整故事系统 |
| [jwynia/outline-collaborator](https://github.com/jwynia/agent-skills/tree/main/skills/creative/fiction/structure/outline-collaborator) | 9 | 8 | 8 | 7 | 6 | 6 | 空白阶段搭骨架最好，不能直接当成成稿器 |
| [SkillMD Story Writer](https://skillmd.ai/skills/story-writer) | 6 | 6 | 8 | 5 | 4 | 3 | 宽泛检查表，可入门，难支撑生产项目 |

## 分项判断

### 1. danjdewhurst/story-skills

这是最完整的“故事工程系统”：角色、世界、结构、章节、连续性和维护工具都被拆成技能，且会更新注册表。它最像可长期使用的生产管线。

盲评扣分点也很明确：多个 skill 预设当前目录已经有 `story.md`、角色文件和项目注册表。若完全不给上下文，它首先遇到的不是创作问题，而是工程不存在。因此它是“有仓库以后最强”，不是“空白对话里最稳”。另一个缺口是它主要面向长篇 Markdown 小说；镜头、舞台调度、可演对白和互动分支不是核心。

适合：新增长篇故事工程，或把已有小说项目纳入严格连续性管理。

不适合直接套用：本项目已经有自己的 JSON 运行时、事实边界和验证器，强迁移到 `story.md` 会制造第二套真源。

### 2. jwynia 的三项创作技能

`outline-collaborator` 善于从空白任务提出替代结构、场景节拍和人物弧，是本轮冷启动第一名。它保留多种方案，不会太早把一个概念锁死。

`story-collaborator` 更像现场搭档：能接着已有声音写一小段场景、给替代措辞和局部修订。它适合“先试 200—500 字看这个人活不活”，不适合独自维护四案几十个分支的状态。

`dialogue` 把台词拆为表层信息、潜台词和策略，并要求一句话同时承担多种功能。这对本项目的 NPC 个性化最有直接价值。问题是它不负责整案结构，也不自带固定人物注册表；即使单句诊断很好，跨四案的身份与知识边界仍要由项目自己维护。

最合理的无上下文组合：`outline-collaborator` 搭骨架 → `dialogue` 做声纹和潜台词 → `story-collaborator` 试写场景。三者合用仍需项目自己的连续性验证。

### 3. SkillMD Story Writer

优点是门槛低：故事开发、人物弧、场景写作和修订都有一轮检查，完全空白时也能开工。缺点是规则停在通用常识层，没有脚本、参考资料、确定的产物 schema 或自动校验；“适合 novel/screenplay”的声明也没有落实为剧本格式、舞台动作和可演性规则。

它可以当一次性提问清单，不应当成为本项目的权威编剧 skill。

## 对本项目的采用建议

不安装、不整体迁移任何一套在线 skill。保留本项目 `project-skills/case-scriptwriting` 作为权威入口，只吸收三种可验证能力：

1. 从 `outline-collaborator` 吸收“先给场景方案和代价，再落成稿”，用于新案骨架。
2. 从 `dialogue` 吸收“表层信息 + 潜台词 + 角色策略”和遮名换角测试，用于 NPC 声纹。
3. 从 `story-skills` 吸收结构化人物注册表与连续性维护，但接到现有 `content/characters/cast.json` 和 `verify:pack`，不另建 `story.md` 真源。

目前公开候选里没有一项同时满足互动剧本分支、证据发现权、NPC 知识边界、逐案角色声纹和运行时 JSON 校验。本项目应继续使用“外部方法作参考、内部 schema 作真源”的组合。

## 安装前复测题

以后若要正式安装候选 skill，先不给它任何本项目背景，只投以下三题：

1. “写一个深夜热线案件，咨询者隐瞒了自己得到的好处。”看它会不会先问媒介、人物利益、事实边界和玩家动词。
2. “同一事实分别让急躁店长、理性会计和感性受害者说。”遮住名字后做人声辨认，三人句法不能只差口癖。
3. 给一页含时间线矛盾的旧稿，要求续写第二幕。看它是否先核对旧事实、人物知道什么，再写新台词。

任何一题出现无来源新事实、全员同声、把小说段落冒充剧本或忽略既有时间线，都不进入生产链。
