# 《直播间大侦探》设计总纲索引

本文件保留是为了兼容旧引用。旧的“婚恋/每日来电”总纲已经不再作为主方向。

当前主设计请看：

```text
docs/weekly-livestream-design-bible.md
```

## 当前方向

《直播间大侦探》主模式是 Steam 更适合的“四案故事集”：

- 一集四案，约八十到一百分钟游戏量。
- 每案是一通匿名直播来电。
- 前台保持线性追问，每个关键节点只能问一个选项。
- 后台记录路线图，结算生成本案路线和本集主播倾向。
- 每个故事集有主题，四案互相照应。
- 结尾有评论区审判墙，把玩家路线转化成可传播的复盘语感。

`daily` 仍然是内容单元、单案兼容入口和校验对象，但不是主产品叙事。

## 创作底线

价值观正，不代表剧情净化。

本作不靠性别对立收割流量，不把具体行为偷换成群体标签。但现实中的双方互害、互相试探、互相包装和成本转嫁必须被写出来。互害案不能用“两边都有问题”草草收场，而要拆清楚：

```text
谁说了半句真话？
谁隐瞒了关键事实？
谁利用了谁的善意？
谁把自己的利益包装成道德要求？
谁承担了实际成本？
下一步边界是什么？
```

## 落地入口

- 产品/玩法总纲：`docs/weekly-livestream-design-bible.md`
- 编剧 Agent 生成 Playbook：`docs/script-generation-agent-playbook.md`
- 游戏宗旨：`docs/game-philosophy.md`
- 情报与内容管线：`docs/daily-case-intelligence.md`
- 自动测试清单：`docs/game-unit-test-cases.md`
- 编剧/流程审查 skill：`project-skills/livestream-game-flow-review/SKILL.md`
