# 第三批台词生产与回归网

日期：2026-07-17

## 交付

第三批没有继续大面积改台词，而是把前两批的审稿方法做成构建产物和硬校验。

- `scripts/build-character-dialogue-report.js` 从内容包收集直接对白、场景问答、回拨 opener、顾问回单、对方留言和带 `speakerProfileId` 的后台材料。
- `docs/generated/steam-demo-01-character-dialogue-report.md` 按案件、人物和幕次列出台词与 JSON 路径。当前固定人物卡 33 张，捕获 640 条台词或玩家可见人物材料，32 人实际出声。
- 唯一没有台词的角色是案二前台。她只在隔窗观察里翻预约册，没有为了“凑全员”新增一句说明性废话；性格卡和知识边界仍保留。
- `npm run content:script` 现在同时更新全量剧本、导演版和角色台词报告；`content:script:check` 会检查三份文档是否过期。

## 硬校验

新增 `PACK-011`：

1. 每条后台人物材料必须有 `speakerProfileId`，或明确声明它是原始文档。
2. 顾问冲突选项只要出现 `advisorLine`，必须同时给出 `advisorId`。
3. `speakerProfileId` 必须存在，并属于本案演员表。

台词报告生成器另行拦截四种高密度模板：“我现在想知道的是”“本质上”“更重要的是”“一方面……另一方面……”。这些是硬错误。连续三句长度接近只进入人工朗读提示，不自动改写，以免机器为了长短变化破坏人物节奏。

## 采用的写作方法

外部对白方法被压成三个写前问题：人物表面交付什么事实，暗中保护什么利益，这一刻用什么策略。项目仍以 `cast.json`、案件 JSON 和验证器为真源，没有引入第二套故事工程。

角色互换测试分两次做：

- 纵向看同一人：夜 A、白天、夜 B、结案是否仍是一个人，防御是否逐步松动。
- 横向看同一场：不同人物即使提供同一事实边界，句法和利益是否不同。

## 维护入口

```bash
npm run content:dialogue-report
npm run content:dialogue-report:check
npm run verify:pack
```

报告是审稿台，不是第四份真源。所有修改仍回到 `content/packs/.../*.json` 和 `content/characters/cast.json`。
