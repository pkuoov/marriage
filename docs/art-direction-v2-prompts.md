# 美术方向 V2.1 · 暖色侧脸「声音的剪影」Prompt 包

日期：2026-07-08
人脸方向修订：2026-07-18
取代：`docs/character-prompts.txt` / `docs/background-prompts.txt` 的"轻现实主义"方向（旧包封存不删）。
用途：交给图像模型生成人物立绘、表情差分与场景背景。

## 一、方向宣言（为什么换）

旧方向"轻现实主义、干净精致、情绪克制"= 普通的配方。更要命的是它和世界观打架：**这是匿名热线，直播间里只有声音**（感知带宽 canon）——写实清晰的全身像等于给匿名者拍了证件照。

新方向：**立绘不是"人长什么样"，是"这个声音在主播脑内的成像"。**

- 来电人 = 暖色三分之二侧脸。轮廓仍受直播间冷暖双色光影响，但面部保持可读，不再用遮罩或重阴影制造匿名。
- 签名装置：**不直视镜头的侧脸**——五官简化，眼睛没有细瞳孔、高光和睫毛；匿名来自观看角度和信息带宽，而不是赛博光带。
- 表情不靠五官靠体态：肩线、指尖、下颌角度——正好对齐引擎的表演钩子（pause／shift／blink 本来就是姿态动词）。
- 每案一组双色调：视觉即案件调性，四案并排即是海报。
- 三层清晰度 = 三层关系：来电人最朦胧（陌生的声音）＞顾问较清晰（台灯下的熟人）＞主播永不露脸（玩家自己）。

## 二、统一正向风格 Prompt（所有人物与场景共用前缀）

> cinematic 2AM mood, single-source dramatic lighting, heavy 35mm film grain, halation glow, duotone color grading, chiaroscuro, urban Chinese midnight interior, muted shadows with one saturated accent light, painterly semi-realistic illustration (NOT photoreal, NOT anime), quiet tension, negative space, for a live-radio detective visual novel
>
> 中文说明：凌晨两点氛围、单光源强明暗、重胶片颗粒与光晕、双色调分级、半写实插画（拒绝照片感与日式动画感）、留白与安静的张力。

## 三、统一负面 Prompt

> no text, no watermark, no logo, no extra limbs, no deformed hands, no oversexualized, no childlike, no fantasy, no cyberpunk city, no horror gore, no busy background, no full-face bright even lighting, no photorealism, no anime cel style, no cropped body parts (unless specified)

## 四、来电人立绘（四案 × 各 3 差分）

产线约束沿用：透明背景 PNG，全身 1:2 竖图（2048×4096），正面偏三分之二。命名对齐现有资产：`{id}_{variant}.png`，variant ∈ neutral / guarded / pause。

**来电人共用段**（接统一前缀之后）：

> anonymous caller, warm readable three-quarter side profile looking away from camera, simplified pixel-art eyes without detailed pupils or catchlights, restrained backlit rim light tracing the outline, holding a phone, emotion carried by posture and hands, no mask, no visor, no eye-light strip, no deep upper-face shadow

差分规格（三档对齐引擎表演钩子）：

- `neutral`（listening）：站姿放松偏疲惫，三分之二侧脸，手机贴耳，面部暖光稳定。
- `guarded`（shift／防备收紧）：肩线收紧，另一只手抱臂、攥衣角或把文件抱紧；下颌略收，但不遮脸。
- `pause`（低头停顿）：手机短暂离耳或举到眼前，视线随手机下移，肩膀略松；不用压暗面部表达停顿。

各案专属段：

- **shen（案 1 信用卡）**duotone amber × deep scarlet：
  > young urban woman in a tasteful but tired date-night coat, amber lamp glow against scarlet-red shadow, a folded paper bill glowing faintly in her coat pocket, ring light stand barely visible as a dark halo behind her
- **he（案 2 理发店）**duotone teal × neon pink：
  > woman in soft casual wear with freshly styled hair that catches the only light, teal shadow with a thin neon-pink salon glow along one side, phone screen showing a blurred table, one strand of hair perfectly in place while everything else dissolves into grain
- **lin（案 3 存款证明）**duotone ice blue × navy：
  > composed woman in an audit-office blouse, ice-white phone glow from below against navy darkness, posture straight as a column, holding the phone like a document, breath of cold precision
- **chen（案 4 报销）**duotone phosphor grey-green × warning amber：
  > young office worker, shirt collar loosened after overtime, monitor phosphor glow on one side and a small amber warning light on the other, lanyard silhouette, shoulders carrying the shape of a person who volunteered too fast

## 五、顾问立绘（台灯下的熟人，四张半身 vignette）

更清晰一档（他们对主播是真实的人），半身 2048×2048，暖钨丝台灯主光，边缘仍溶进颗粒暗部。共用段：

> trusted late-night confidant, waist-up portrait, warm tungsten desk-lamp key light, face clearly readable but edges dissolving into grain and shadow, one occupational prop lit by the lamp, quiet domestic 2AM atmosphere

- **赵律师**：> woman in her 30s-40s, sharp tired eyes with reading glasses pushed up, a case file and a cooling cup of tea in lamp light, wine-red accent, expression of someone who answers at 2AM and pretends it's a bother
- **周会计**：> woman, calm and precise, an old desktop calculator and a ledger under the lamp, moss-green accent, the face of someone who trusts numbers and exactly three people
- **小林老师**：> warm middle-aged matchmaker, tea thermos and a wall of red client notes softly out of focus, coral accent, professional smile with something guarded behind it
- **张法医**：> man with meticulous posture, cool white examination light (the ONE cool-lit advisor — his lamp is a work light), sealed evidence bag and labeled folders, slate-blue accent, the face of a man who never skips a step

## 六、主播（玩家的身体，永不露脸）

> host seen ONLY from behind, sitting at a live-radio console, headphones on, silhouetted against the mixing desk's small warm lights and one tall window of 2AM city glow, posture leaning slightly toward the mic, face never visible, 16:9

（替换 `meng_host_v2` 用途；主播是玩家的椅子，不是一张脸。）

## 七、场景背景包（16:9，无人物，底部留对话框区）

共用前缀 + 统一负面照旧。

- **主舞台·直播控台 POV**：> first-person view over a radio console at 2AM, warm console LEDs, one desk lamp, a tall window with distant city lights, empty guest chair implied by negative space, duotone amber-navy
- **案 1 底**：amber × scarlet ——> the same console scene tinted amber-scarlet, a faint suggestion of receipts and a ring-light halo in the window reflection
- **案 2 底**：teal × neon pink ——> tinted teal with a thin neon-pink reflection like a salon sign across the window
- **案 3 底**：ice × navy ——> tinted ice-navy, window frost, the city lights arranged almost like ledger columns
- **案 4 底**：phosphor × amber ——> tinted grey-green with one amber alert glow, faint monitor grid reflection
- **材料台面**：> top-down leather desk mat under a single lamp cone, space for documents, heavy grain, vignette edges（材料板底图，四案各按 duotone 出一版）

## 八、落地顺序建议

1. 先出 4 张来电人 neutral 验方向（三分之二侧脸、暖色可读面部和简化眼睛是关键；匿名不足时先调头部角度与眼睛细节，不加遮罩）。
2. 过审后补 guarded/pause 差分与顾问四张。
3. 场景包最后（它最便宜，也最不容易错）。
4. `docs/ui-art-asset-review.md` 增补一节记录 V2.1 验收标准：**不直视镜头、五官信息简化、面部亮度统一、每案双色调纯度、颗粒密度统一**。
