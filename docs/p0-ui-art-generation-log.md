# P0 UI 美术生成记录

日期：2026-08-13

本批使用内置 ImageGen 生成，再以洋红键色去背；人物交付为 1024×2048 运行图和 256×512 最近邻母版，材料图统一裁切为 1600×900。所有人物沿用既有暖色三分之二侧脸像素标准。

## 共同人物 Prompt

> Authored 2D pixel-art full-body game portrait, crisp hand-placed pixel clusters, transparent-ready subject on a single flat #ff00ff chroma-key background, no floor and no shadow. Match the existing late-night livestream detective game: dark teal shadows, restrained warm coral rim light, natural readable face light, three-quarter side profile, simplified eyes, no mask, no visor, no eye-light strip, no photorealism, no text. Keep identity, hairstyle, clothes, prop, proportions and baseline consistent with the supplied reference. One character only, centered, head-to-toe, generous empty border.

在共同 Prompt 后分别追加：

- 主播 questioning：右手自然摊开追问，神情专注但不凶。
- 主播 pressing：身体略前倾，一手握笔、一手拿平板，目光更紧。
- 主播 verdict：站姿放松，平板垂在身侧，像结束复盘后的最后一句。
- 案 3 男方 neutral：二十多岁中国男性，浅蓝衬衫、深色长裤、手机贴耳，克制上麦。
- 案 3 男方 guarded：保持同一身份服装，空手抬起作制止动作，防备但不夸张。
- 快案 1 guarded / pause：保持原橙色针织衫、白衬衫、深色长裤；分别为抱臂防御和低头看手机停顿。
- 快案 2 guarded / pause：保持原绿色针织衫、浅色内搭、深色长裤；分别为一手辩解和握手机沉默。

## 四张材料 Prompt

共同约束：

> 16:9 top-down authored pixel-art evidence desk, no people, no real names, no logos, no readable personal data, no extra narrative facts. Warm desk lamp against dark teal night shadows, crisp game-asset pixel clusters, restrained coral and gold annotations, designed as an illustrative material composite rather than a literal screenshot.

案件追加内容：

- 案 1：信用卡账单、工资流水、双月房租、离职补偿金和信托认购痕迹；重点是金额与用途分区，不能替尾号账户命名。
- 案 2：预约表、会员卡、顾客维护私表与开店项目页；保留空白/遮蔽的姓名电话，不画警方结论。
- 案 3：MBA 学费材料、工资账户流水、家族群聊、信托持有摘要，并留出“其他账户未知”的空位。
- 案 4：活动审批页、发票、未完成报销页和付款状态页；突出活动负责人和付款经办人位于不同栏位。

## 输出映射

- 主播：`assets/generated/host/`
- 案 3 男方：`assets/generated/respondents/pixel-case03/`
- 快案补充态：`assets/generated/quick-detective/`
- 材料合成图：`assets/generated/materials/`

案 3 男方 guarded 的首张候选发生服装漂移，已废弃；运行时使用基于 neutral 参考重做的第二版。
