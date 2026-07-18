# UI 改版与美术增补 prompts

> 2026-07-18 立绘方向勘误：本文中的“眼部光带”要求已废止。四案来电人以 `docs/pixel-art-transition-and-portrait-direction.md` 的暖色三分之二侧脸、简化五官标准为准；旧段落仅保留为历史执行记录。

日期：2026-07-12

以下提示词沿用 [art-direction-v2-prompts.md](/Users/pkuiloveoov/code/love/docs/art-direction-v2-prompts.md) 的“声音的剪影”方向。来电人变体必须使用对应的 V2 中性候选作为角色参考图，不能重新发明脸型、发型、服装和身材。

## 1. UI 改版执行 prompt

```text
你正在修改一款中文深夜热线侦探视觉小说的现有 Web UI。保留全部剧情、选项、状态字段和存档结构，只处理布局、交互层级与反馈，不新增数值系统。

目标视口：390×844、860px 断点、1440×900。

当前严重问题：
1. 桌面容器是 280px + 1fr 两栏，但 control-deck 被后置 CSS 改成 absolute，vn-stage 仍落在第一栏，主舞台只剩 280px。
2. 手机端把匿名热线、进度、耐心和完整材料摘要塞进四列，中文逐字竖排。
3. avg-material-card 会压住对白和选项，展开后没有明确关闭按钮。
4. avg-choice-overlay、材料模态和案卷层可以同时获得交互焦点。
5. 标题切入序章时，正文层与 AVG 分页层切换不同步，短暂出现空黑画面。

请完成：
- 统一 .story-grid.case-vn-grid.live-console-shell、.control-deck、.vn-stage 的职责，删除或收拢文件末尾重复覆盖规则。
- 桌面端采用清晰的主舞台布局。若保留左侧控台，控台固定 240-280px，主舞台占剩余空间且不小于 900px；若改为浮动 HUD，主舞台跨满全部网格。
- 手机端 HUD 只保留 ON AIR、1/7、耐心 8/8 三项。材料入口显示“材料 1”，完整摘要放入抽屉或模态层。
- 对白框在底部，人物和场景仍可见。选项出现时，不被材料卡遮挡，首个选项在 390×844 下无需横向滚动即可阅读。
- 建立单一层级：scene 0、HUD 10、dialogue 20、choice 30、material modal 40、court record 50。
- 材料模态提供标题、关闭按钮、遮罩、Esc 和手柄 B 关闭；选择层打开时自动收起材料卡。
- 转场时先挂载场景和 AVG 文本框，再隐藏源对白；不允许出现只剩顶栏的纯黑画面。
- 保留键盘、手柄与 reduced-motion 支持。

视觉要求：深夜直播控制台、黑绿底、低饱和青色状态光、少量警示红；减少玻璃卡片数量；重要数字可以亮，说明文字不要全部高亮；不改成通用 SaaS 仪表盘。

验收：
- 1440×900 下 vn-stage 可用宽度 >= 900px，无逐字竖排，无右侧大面积空白。
- 390×844 下 HUD 每项至少能完整显示一行短标签和一行数字。
- 材料、选择、案卷任意时刻只有一层可交互。
- 展开材料后能用点击关闭、Esc、手柄 B 回到原选择。
- 标题、序章、直播、追问、材料板、调查台、回看均无横向溢出。
```

## 2. 统一美术基底

所有场景和角色 prompt 末尾加入：

```text
cinematic 2AM mood, single-source dramatic lighting, heavy 35mm film grain, subtle halation glow, controlled duotone color grading, chiaroscuro, urban Chinese interior, muted shadows with one saturated accent light, painterly semi-realistic illustration, quiet tension, clear negative space, for a live-radio detective visual novel
```

统一 negative prompt：

```text
no text, no readable letters, no watermark, no logo, no extra limbs, no deformed hands, no oversexualized pose or clothing, no childlike face, no fantasy, no cyberpunk city, no horror gore, no busy background, no glossy beauty retouch, no bright even face lighting, no photorealism, no anime cel style, no plastic skin, no generic corporate stock-photo look
```

## 3. 来电人状态变体

输出规格：透明背景 PNG，2048 × 4096，人物占画面高度 86% 至 90%，脚底和头顶留安全边，眼部光带高度与中性候选一致。每张都使用对应 `*_neutral_v2_candidate.png` 作为唯一角色参考。

### 案 1 沈

guarded：

```text
Use the supplied Shen neutral V2 candidate as the exact character reference. Same adult Chinese woman, same face silhouette, bun, long dark coat and phone. Guarded reaction after the host asks about installment payments: shoulders pull inward, free hand grips the envelope inside her coat pocket, chin turns slightly away from the microphone, lips pressed before answering. Eyes remain completely hidden by one horizontal amber screen-light strip. Deep scarlet rim light, amber key light, transparent background, full-body silhouette, restrained posture, no melodramatic crying.
```

pause：

```text
Use the supplied Shen neutral V2 candidate as the exact character reference. Same identity, hair, coat and phone. A long pause after hearing the bank-flow timeline: phone lowers two centimeters from her ear, shoulders stop moving, free hand loosens around the envelope, head tilts down as if counting dates. Eyes fully hidden by the same amber light strip. Deep scarlet and amber duotone, transparent background, full-body silhouette, quiet shock, no tears, no open-mouth expression.
```

### 案 2 何

guarded：

```text
Use the supplied He neutral V2 candidate as the exact character reference. Same adult Chinese woman, same messy bun, loose home clothes and phone. Guarded after the host asks what benefits she accepted: one arm folds across her waist, weight shifts away, phone held tighter, jaw set, shoulders slightly raised. Eyes completely hidden by the same cold teal screen-light strip. Neon pink rim light, teal shadow mass, transparent background, full-body silhouette, everyday clothing, no fashion pose.
```

pause：

```text
Use the supplied He neutral V2 candidate as the exact character reference. Same identity and clothing. She stops before quoting his exact words: phone stays at her ear, raised shoulder drops, free hand opens and then freezes beside the trouser seam, head turns toward an empty chair outside frame. Eyes hidden by the same teal light strip. Teal and neon pink duotone, transparent background, full-body silhouette, hesitation shown through posture, no crying.
```

### 案 3 林

guarded：

```text
Use the supplied Lin neutral V2 candidate as the exact character reference. Same 28-year-old Chinese audit assistant, same tied hair, blue shirt, dark high-waisted trousers and phone. Guarded when asked about her own salary: spine becomes rigid, free hand slips behind her back, chin lifts by a few degrees, feet close together as if returning to a formal interview stance. Eyes fully hidden by the same ice-blue screen-light strip. Navy shadow mass, cold blue edge light, transparent background, full-body silhouette, precise restrained posture.
```

pause：

```text
Use the supplied Lin neutral V2 candidate as the exact character reference. Same identity and office clothing. A numerical answer catches in her throat: phone lowers slightly, free hand counts once against her trouser seam and stops, chin dips, body remains otherwise controlled. Eyes hidden by the same ice-blue light strip. Ice blue and navy duotone, transparent background, full-body silhouette, silence expressed by stillness, no exaggerated emotion.
```

### 案 4 陈

guarded：

```text
Use the supplied Chen neutral V2 candidate as the exact character reference. Same young adult Chinese project employee, same short hair, rolled sleeves, vest, lanyard and phone. Guarded after the host separates approval from payment: one hand closes around the lanyard badge, shoulders square defensively, weight shifts to the back foot, face turns slightly away. Eyes fully hidden by the same pale phosphor screen-light strip. Grey-green shadows and warning amber edge light, transparent background, full-body silhouette, tired office posture.
```

pause：

```text
Use the supplied Chen neutral V2 candidate as the exact character reference. Same identity and work clothes. He pauses after hearing the phrase “old rule”: phone remains at his ear, free hand releases the badge, shoulders sink, gaze direction drops behind the eye-light strip, desk monitor glow barely catches one sleeve. Phosphor grey-green and warning amber duotone, transparent background, full-body silhouette, contained fear, no dramatic collapse.
```

## 4. 顾问半身立绘

输出规格：透明背景 PNG，2048 × 2048，腰部以上，人物朝画面内侧，脸部可见但只用一侧主光。四人需要能在小尺寸头像中靠轮廓、服装和手中物区分。

### 赵律师

```text
Adult Chinese woman in her late 30s, partner at a family-law firm, composed and unsentimental. Short practical hair, dark burgundy suit with a plain high-neck inner shirt, one thin case file held closed against her ribs, the other hand holding a black pen without gesturing. She looks slightly past the camera as if choosing the legal boundary of a sentence. One-side warm desk-lamp key light, cool shadow side, visible natural skin texture, restrained expression, waist-up, transparent background, painterly semi-realistic illustration, no headset, no courtroom robe, no glamour pose.
```

### 周会计

```text
Adult Chinese woman around 50, former manufacturing finance director, practical and severe about numbers. Short greying hair, dark moss cardigan over a clean collared shirt, reading glasses low on the nose, one hand holding a narrow ledger and the other resting on a metal calculator. Her gaze is on the transaction path, not the viewer. Phosphor green monitor light with muted amber rim, waist-up, transparent background, painterly semi-realistic illustration, no corporate stock-photo smile, no luxury accessories.
```

### 小林老师

```text
Adult Chinese woman in her early 40s, owner of a neighborhood matchmaking shop, warm but protective of her trade. Soft rust-red knit jacket over a practical blouse, sleeves rolled once, a stack of two mismatched client cards and a whiteboard marker in her hands. Open stance with one shoulder angled forward, expression says she will explain the trade but will not excuse a person. Coral practical lamp light against deep navy shadow, waist-up, transparent background, painterly semi-realistic illustration, no youthful idol styling, no readable text on cards.
```

### 张法医

```text
Adult Chinese man in his early 40s, forensic documentation specialist with strict chain-of-custody habits. Lean build, short hair, charcoal work jacket over a pale shirt, nitrile gloves tucked into one pocket, holding a sealed evidence sleeve by its edge and checking the seal rather than the camera. Cold white lab side light with a narrow desaturated blue rim, waist-up, transparent background, painterly semi-realistic illustration, no gore, no corpse, no police badge, no dramatic detective pose.
```

## 5. 新场景背景

输出规格：2048 × 1152，16:9，无人物，无可读文字；画面下方 28% 保留低细节区给对白框，左右至少一侧保留人物立绘空间。

### 周会计的档案室

```text
An archive room converted from an old Chinese factory office in late afternoon. Rows of dull steel filing cabinets, one white incandescent tube, a worn wooden desk with two iron document clips, a metal calculator, four blank date cards arranged into a timeline, dust visible in the side light. No people. Moss green shadows with restrained amber paper light, practical and slightly cold, composition leaves the lower 28 percent and right side quiet for dialogue UI, cinematic visual novel background, no readable documents, no modern luxury office.
```

### 打烊后的婚介门店

```text
A small neighborhood matchmaking shop in a Chinese city just after closing. Half-lit storefront glow through frosted glass, a whiteboard with mostly erased marks and only abstract smudges, shallow drawers for client cards, two blank profile cards held under a ceramic tea cup, a thermos, stacked folding chairs, one desk lamp still on. No people. Coral practical light against deep navy shadows, intimate and slightly worn, lower 28 percent kept quiet for dialogue UI, cinematic visual novel background, no readable text, no wedding-photo showroom, no luxury agency.
```

### 三路同时进后台的控制室

```text
The back control room of a Chinese late-night call-in studio during an advertising break. A closed studio door on the left, one remote spreadsheet monitor with abstract rows and no readable data, a legal file on a side console, an audio waveform channel lit on a compact mixer, three distinct empty speaking positions implied by chair, monitor and speakerphone. No people. Phosphor grey-green monitor light with warning amber accents, deep black negative space, lower 28 percent quiet for dialogue UI, cinematic visual novel background, no futuristic cyberpunk equipment, no broadcast logos, no readable text.
```

## 6. 资产接入约束

```text
Do not generate UI text inside images. Do not make the four callers face the camera. Keep the horizontal eye-light strip at the same relative face height across all caller variants. Neutral, guarded and pause variants must preserve identical identity, clothing, phone model and body proportions. Scene backgrounds must leave the dialogue area readable and cannot place a bright face-like object behind the portrait slot. Advisors may show their faces, but lighting stays directional and skin retains natural texture.
```
