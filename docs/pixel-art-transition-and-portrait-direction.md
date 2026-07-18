# 像素风过场与立绘迁移方向

日期：2026-07-16

## 本轮已经落地

- 在开麦、挂断、白天调查、第二晚回拨、案间与收麦等大切点加入代码生成的像素块过场。
- 过场不承载线索、不接受操作，同一场景只播放一次，并尊重系统 `prefers-reduced-motion`。
- V哥先使用像素字块头像，不生产未验收的人脸资产。
- 案 2 来电人已经完成 `neutral / guarded / pause` 三态像素样张，并通过 `manifest.sequence[].callerArtVariants` 接到真实直播舞台；旧半写实立绘只保留为其他三案回退。
- 三态同时保留 `256x512` 真透明母版和 `1024x2048` 最近邻放大发运版；`verify:pack` 会校验三态齐全、尺寸与 alpha，浏览器 smoke 会确认实际切图。

## 四案立绘已经统一

2026-07-18 的 P1 美术批次已将案 1、3、4 迁移到案 2 的像素舞台语言。四案现在都使用 `neutral / guarded / pause` 三态透明立绘；每态同时保留 `256x512` 母版和 `1024x2048` 最近邻发运版。旧写实 PNG 不再进入试玩运行时，但暂留仓库作为身份、服装和道具参考。

新资产目录：

- `assets/generated/callers/pixel-case01/`
- `assets/generated/callers/pixel-sample-case02/`
- `assets/generated/callers/pixel-case03/`
- `assets/generated/callers/pixel-case04/`

生成采用内置 imagegen 的 style-transfer 工作流。每案以旧来电人图作为服装与道具参考，以案 2 像素样张作为光色和像素密度参考；一次生成同人物三态横向母表，再以绿色键背景去背、切片和最近邻缩放。共同 prompt 约束如下：

> authored 2D pixel art, 24–32 dominant colors, crisp hand-placed clusters, dark teal shadows and coral rim light; three equal full-body columns for neutral, guarded and pause; identical identity, outfit, prop, scale and baseline; cyan-white eye-light strip; no text, shadow, photorealism or identity-revealing eyes.

样张规格：

- 原生像素画布 `256x512`，透明背景；交付时可最近邻放大到 `1024x2048`，不得用柔化插值。
- 每案控制在 24–32 个主色，轮廓、肤色、衣着与场景双色调共用稳定色板。
- 保留匿名来电人的脸部遮挡和眼部光带，不因像素化变成清晰证件照。
- 三态只改变可读动作：视线、肩颈、握持物、停顿姿势；不得靠换脸或夸张表情泄露正确选项。
- 运行时使用 `image-rendering: pixelated`；在 `390x844`、`1366x768` 和 Steam Deck 尺寸分别检查边缘抖动、对白遮挡和轮廓辨识。

验收门：

1. 缩到实际舞台尺寸仍能一眼区分三态。
2. 与材料板、控场台和像素过场同屏时属于同一个游戏，不像贴入另一套素材。
3. 不增加人物身份信息，不削弱匿名感。
4. 过场不频繁盖住阅读；减少动态效果时完全静默退出。
5. 自动 smoke 证明接线、切图和最近邻渲染；最终发布前仍需在真实 Steam Deck 与 `390x844` 手机上做一次人工可读性验收。

## 明确不做

- 不对现有写实 PNG 直接套马赛克或降采样滤镜冒充像素画。
- 不在同一角色的三态中混用写实与像素资源。
- 不把每次问答切换都做成过场。
- 不在真人样张验收前重命名或删除其余三案现有 `callerArt`。
