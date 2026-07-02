# steam-demo-01 QA Report

## Pack Spine

四通来电都围绕“好听的身份或关系词，最后让谁承担钱和责任”展开。第一通是体面消费和债务，第二通是自己人话术和办卡，第三通是条件标签和资料缺口，第四通是主责、流程和垫付款。

## Required Checks

- 每案必须有一个具体物件：账单、店表、资料图、审批截图。
- 每案必须写出来电人自己的不利信息，不能只写对方有问题。
- 案间页标题使用物件钩子，不使用“下一案 / 下一通来电”当标题。
- 结果页不能写成教程、评分表或最佳答案解析。
- 当前试玩包的 manifest 已经通过 `npm run content:index` 生成运行时索引，`src/storyPacks.js` 不再手写一份包定义。
- 生成索引同时输出 `CONTENT_CASES`；`01-credit` 和 `02-tony` 已切到 `runtime-loaded`，其余两案仍只暴露 `metadata-only` 摘要。
- 未迁移案件仍复用 `src/caseEngine.js` 完整台词模板；`metadata-only` JSON 只记录故事压力、物件和评论种子，不能写成看似已接入的台词字段。
- 新增案件时，运行时内容和 `content/packs/steam-demo-01/` 仍要同步更新，直到对应 case JSON 切到 `runtime-loaded` 接管完整台词、追问、材料判定和复盘文案。
- 结算、满格深问和剧本文档要按当前 caller/respondent 指派检查代词；角色可能换人时，用“咨询者 / 同事 / 对方”。
