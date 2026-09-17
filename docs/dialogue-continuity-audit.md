# 对话连贯性审查

现行创作约定统一维护在 [当前项目方向](../project-skills/case-scriptwriting/references/current-project-direction.md)，不在本文件复制另一套规则。2026-09-12 已撤销旧单选、说辞层数、固定长回答和强制结案总结要求。

## 查什么

从实际播放的完整交换出发，区分人物有意答偏与作者接错话。核对说话人、引用、来源、时间、已执行动作和下一句前提；不要强制每句复述关键词或新增事实。

顺序下一问可以依赖前一步必经回答；可选材料或未走分支的事实仍不能偷渡到固定续文。已知归属不重复揭露，来电人被点中后继续争用途和责任，不能变成配合主播的自我总结。

妻子、朋友和业务伙伴的寒暄、生活约定与已有伏笔有独立价值，不以“没增加证据”删除。第三方拒答保持原说话人和原证据强度，不转成主播替他证明了另一件事。

## 怎么改

见 [审读与接入流程](../project-skills/case-scriptwriting/references/story-review-workflow.md)。先定位原句及所有实际副本，修改完整交换，再同步备用回答、场尾、回拨、结尾引用与人物知识。去掉作者总结后，仅补必要的主语和时间，不机械扩写或缩句。

来源与稳定 ID 等技术约束见 [运行时内容接入](../project-skills/case-scriptwriting/references/runtime-content-integration.md)。保留内部事实合同，不把 `sourceDoesNotProve` 等字段作为玩家必须听的一段解释。

## 审查记录与验证

邻接审查源为 `content/packs/steam-demo-01/dialogue-adjacency-review.json`；运行 `npm run content:adjacency-report` 生成可读表。锚点、reviewedCaseIds 或生成文件通过，仅证明审查记录与该版本对应，不证明对白已自然或所有路线已经人工走通。

改动后生成索引和台本，运行 `npm run check`。模式、顺序或存档变化需浏览器验证中途保存与继续；UI问题需实际截图。按实际覆盖报告人工串读、自动定点检查和完整路径，不把一项替代另一项。

历史评审留在 `docs/review-archive/`，记录当时发现和处理，不作为恢复旧交互或旧句式的命令。验收应围绕可观察行为与来源关系，除用户锁定的文字外，不逐字冻结 skill、文风或旧判词。
