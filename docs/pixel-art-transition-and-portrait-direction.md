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

2026-07-18 人脸方向复审后，四案再次统一为“暖色三分之二侧脸”：常驻立绘取消眼部光带、遮罩和上半脸重阴影，匿名感改由侧脸角度、简化五官与不直视镜头共同承担。信号断帧只允许出现在接通、断线等瞬间过场，不常驻人物身上。

## 2026-08-13 P0 演出补齐

- 主播从单张静态立绘扩成 `listening / questioning / pressing / verdict` 四态。来电人说话时回到 listening，主播普通追问使用 questioning，关键追问使用 pressing，结案复盘使用 verdict。
- 案 3 男方不再复用女方立绘。礼物与连麦申请出现后，舞台进入主播、咨询者、男方三人布局；男方使用独立 `neutral / guarded` 双态。
- 两宗快案来电人均补齐 `neutral / guarded / pause`，对质和结论阶段按现场状态切换，不再从头到尾固定一张图。
- 第三宗快案新增匿名男性来电人三态，重击过场使用文末“虚构”与正文“点名”对撞。
- 六个核心反转使用六套独立演出：案 1 金额缺口、案 2 警灯敲门、案 3 礼物与第二路麦克风、案 4 负责人/付款人拆分、快案 1 两个“爸爸”、快案 2 第三把椅子。
- 核心反转只在对应承重节点播放一次，时长统一为 2.2 秒；普通问答和次要疑点不使用全屏反转。
- 四案新增 1600×900 固定材料合成图，材料弹窗以图为主、标题和事实边界仍由文本层负责。合成图不包含真实姓名、平台标识或可被误读为新证据的细字。

新增资产目录：

- `assets/generated/host/`
- `assets/generated/respondents/pixel-case03/`
- `assets/generated/materials/`
- `assets/generated/quick-detective/`（快案补充态）

自动门禁会检查主播四态、快案三态、案 3 男方双态的透明通道与 1024×2048 / 256×512 双规格，并检查四张材料图均为 1600×900。

## 2026-08-13 P1 案间与尾声舞台

- 赵律师新增 `daily / teasing / serious` 三态。三态共享同一身份、服装和像素密度：日常态拿热水，揶揄态带保温盒，认真态拿合同。每态交付 `256×512` 真透明母版与 `1024×2048` 最近邻发运版。
- 广告间隙不再显示成脱离场景的文字卡。舞台仍是同一间直播工作室，但 `ON AIR` 已熄灭；主播和赵律师同屏时用人物状态、热水、保温盒和杯子承接夫妻关系。案 3 的赵律师是语音通话，画面必须有远程信号区别，不能误导成她在现场。
- 案间名言与物件交接合并：上一案材料合成图逐渐退场，下一案材料合成图逐渐进入，名言压在两件物件之间。不得再附加下一案概括、主题词或作者式指引。
- 两张 16:9 像素 CG 已接到运行时：宸直暂停兑付的手机新闻推送，以及 2019 年牛皮纸文件袋。CG 图面不承载可核验正文，机构名、日期和钩子句仍由 HTML 文本层显示。
- `prefers-reduced-motion` 下取消物件移动，只保留清楚的前后层级；移动端回到全宽文字层，避免侧栏挤压正文。

新增资产目录：

- `assets/generated/advisors/zhao-lawyer/`
- `assets/generated/cg/`
- `docs/art-source/zhao-lawyer-sprite-sheet-key.png`（三态同身份原始键色母表，不进入运行时）

自动门禁会额外检查赵律师三态双规格、透明通道、两张 CG 的 1672×941 画幅，以及 manifest 中的实际引用；浏览器回放会确认广告间隙、案间双物件、宸直 CG 和文件袋 CG 都能抵达。

生成采用内置 imagegen 的 style-transfer 工作流。每案以旧来电人图作为服装与道具参考，以案 1 通过复审的暖色侧脸样张作为面部光色和像素密度参考；同案三态尽量在同一张横向母表中生成，再以绿色键背景去背、切片和最近邻缩放。共同 prompt 约束如下：

> authored 2D pixel art, crisp hand-placed clusters, dark teal shadows, restrained coral rim light and warm natural facial light; three equal full-body columns for neutral, guarded and pause; identical identity, outfit, prop, scale and baseline; readable three-quarter side profile with simplified eye pixels; no mask, visor, eye-light strip, deep facial shadow, text or photorealism.

样张规格：

- 原生像素画布 `256x512`，透明背景；交付时可最近邻放大到 `1024x2048`，不得用柔化插值。
- 每案控制在 24–32 个主色，轮廓、肤色、衣着与场景双色调共用稳定色板。
- 来电人保持三分之二侧脸，不直视镜头；五官可读但眼睛只用简化像素形，不画细瞳孔、高光、睫毛等身份化细节。
- 禁止常驻眼部遮罩、光带、墨镜和上半脸重阴影；也不得为了“匿名”把整体压暗成审讯或恐怖气氛。
- 三态只改变可读动作：视线、肩颈、握持物、停顿姿势；不得靠换脸或夸张表情泄露正确选项。
- 运行时使用 `image-rendering: pixelated`；在 `390x844`、`1366x768` 和 Steam Deck 尺寸分别检查边缘抖动、对白遮挡和轮廓辨识。

验收门：

1. 缩到实际舞台尺寸仍能一眼区分三态。
2. 与材料板、控场台和像素过场同屏时属于同一个游戏，不像贴入另一套素材。
3. 不增加具体身份信息；匿名感来自视角与信息简化，而不是遮脸。
4. 过场不频繁盖住阅读；减少动态效果时完全静默退出。
5. 自动 smoke 已覆盖 `390x844`、`1366x768`、`1280x800` 的接线、最近邻渲染、横向溢出、最大宽度和人物层不拦截操作；最终发布前仍需在真实 Steam Deck 与手机上做一次人工可读性验收。

## 明确不做

- 不对现有写实 PNG 直接套马赛克或降采样滤镜冒充像素画。
- 不在同一角色的三态中混用写实与像素资源。
- 不把信号断帧、扫描线或像素错位常驻叠在脸上或全身；这些效果只属于接通、断线过场。
- 不把每次问答切换都做成过场。
- 不在真人样张验收前重命名或删除其余三案现有 `callerArt`。
