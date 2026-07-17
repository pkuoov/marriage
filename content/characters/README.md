# Characters

角色卡是写作与运行时边界的共同参照；`casualQuestions`、顾问台词与求助提示必须与卡一致。

- `advisors.json`：四位专业顾问注册表，可进入委托与顾问冲突玩法。
- `helper-npcs.json`：场下求助 NPC 注册表，只能进入玩家主动触发的提示接口，不能混入专业顾问列表。
- `cast.json`：全试玩包固定角色、逐案身份、性格、声纹、压力反应与知识边界的结构化真源。主播、咨询者与对方另有 `voiceArc`，固定夜 A、白天、夜 B、结案四阶段的声音变化。写作时必须用 `caseId + surfaceNames` 匹配，不能把跨案复用的运行时演员 ID 当成同一个人。
- `voice-bible.md`：供人阅读的角色声音速查表与台词验收法。
- `docs/generated/steam-demo-01-character-dialogue-report.md`：构建时按角色、幕次和 JSON 路径聚合的实际台词索引；用来朗读、做角色互换测试和定位句长过齐的位置。
- `host.md`、`callers.md`、`offmic-voices.md`、`advisors.md`、`helper-npcs.md`：扩展背景与关系说明；若与结构化字段冲突，先修正 `cast.json`，再同步这些文档。
