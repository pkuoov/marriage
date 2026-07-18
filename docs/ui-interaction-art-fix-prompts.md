# UI / 交互 / 场景 / 立绘 · 修改执行 Prompt 包

> 2026-07-18 立绘方向勘误：本文中的“半剪影／眼部光带”要求已废止。四案来电人以 `docs/pixel-art-transition-and-portrait-direction.md` 的暖色三分之二侧脸、简化五官标准为准；旧段落仅保留为历史执行记录。

日期：2026-07-15

本包基于最新 canvas 审计 `ui-interaction-art-audit`（复核 `docs/ui-gameplay-art-review-2026-07-12.md` 与运行时壳层），把「要修什么」拆成可直接复制粘贴的执行 Prompt。

相关链接：

- [art-direction-v2-prompts.md](./art-direction-v2-prompts.md) — 声音的剪影 / 光带过眼 / 顾问半身 / 风格前缀与负面
- [ui-art-expansion-prompts-2026-07-12.md](./ui-art-expansion-prompts-2026-07-12.md) — UI 改版、来电人 guarded/pause、顾问与新场景生成文
- [ui-art-asset-review.md](./ui-art-asset-review.md) — 资产验收标准
- [case12-drama-rewrite-blueprint.md](./case12-drama-rewrite-blueprint.md) — 案 1/2 内容已重写；**本包只做呈现与接线，不改剧情**

---

## 1. 用法

| Prompt | 角色 | 做什么 |
|---|---|---|
| **U** | UI / 交互工程师 | 选项成本可读、白天底图 CSS、幕间预算、Recap 压缩、保留输入与 reduced-motion |
| **W** | 资产接线工程师 | V2 来电人进 `callerArt` / `portraitLayerHtml`；白天 class→PNG；顾问头像槽占位 |
| **G** | 仅图像生成 | 只生成仍缺的白天底图与四顾问半身；风格严格跟 V2 |
| **E** | 表情差分 + 表演接线 | 基于 V2 neutral 出 guarded/pause，并接到 `expression.kind` |

**推荐顺序：U → W →（若槽位仍缺图则 G）→ E。**

约束：

- **不要**编辑 `~/.cursor/plans` 或任何 plan 文件。
- **不要**改案件剧情 JSON（除必要时仅改 `backdropClass` 字符串以对齐已有 CSS class）。
- 内容包剧情已按 blueprint 重写过；本包只修呈现、交互与美术接线。

---

## 2. 审计基线（勿重做 / 要修）

### 已够用（勿重做一轮）

- 标题页：首屏可读，深夜节目身份成立
- 四案夜班直播底图齐全，夜班壳可演示
- 控台 HUD / z-index 分层（scene→HUD→dialogue→choice→material→court）已有底线
- 白天预算 / 已消耗 UI 骨架存在（可读性仍差，见下）
- 回拨开场 UX 可用
- 手机 HUD 已收缩到短标签方向（继续守，勿再塞满四列长文）

### 必须修（本包目标）

| # | 问题 | 表面 |
|---|---|---|
| 1 | **白天调查视觉塌缩**：地点/顾问像配置表，不像场景 | Day / Interlude |
| 2 | **`.day-studio` / `.day-office` 静默回退**：JSON 已写 class，但 `styles.css` **无对应规则** → 无专属底图 | Day |
| 3 | **选项成本不可读**：耐心/次数/互斥藏在文案，自由问与关键问外观雷同 | Live / Day |
| 4 | **V2 候选未进 `callerArt`**：`assets/generated/art-direction-v2-candidates/` 已有 shen/he/lin/chen，运行时仍用旧明亮全脸 PNG | Live / Portrait |
| 5 | **顾问无脸**：赵/周/小林（及张）分歧只剩长文本按钮 | Day / Callback |
| 6 | **Recap 过长**：`solvedRecapPagesHtml` 页数偏多，拖掉收束感 | Recap |
| 7 | **餐厅 CSS 无视已有图**：`.day-restaurant` / `.day-cafe` 仍绑 `livestream_studio_v2.png`，而 `assets/generated/backgrounds/cafe_date.png` 已存在 | Day |

审计总分提示（勿重审计）：视觉身份 3 · 交互负担 2 · 场景多样性 2 · 立绘 2 · 状态反馈 4 · 响应式 4。

---

## 3. 完整 Prompt U — UI / 交互

把下面整段复制给工程师 Agent：

```text
你是《直播间大侦探》Steam 试玩包（steam-demo-01）的 UI / 交互工程师。
日期基线：2026-07-15。审计来源：canvas ui-interaction-art-audit + docs/ui-gameplay-art-review-2026-07-12.md。
美术方向只读参考：docs/art-direction-v2-prompts.md。本任务不做图像生成、不接线 V2 立绘文件名（那是 Prompt W）。

【硬约束】
- 不要编辑 ~/.cursor/plans 或任何 plan 文件。
- 不要新增分数/等级/隐藏数值系统；只把已有耐心、次数、互斥后果做得一眼可读。
- 不要给主播加正脸立绘；主播身份继续由控台背影/监视器承担。
- 不要改案件剧情、选项文案语义、结局分支；除必要时仅允许改 day 场景的 backdropClass 字符串以对齐已有 CSS class。
- 保留全部故事字段、存档结构、键盘 / 手柄导航、prefers-reduced-motion。
- 中文 UI 文案保持克制，像直播间提示，不要 SaaS 仪表盘口吻。

【优先改动文件】
- src/ui/sceneQuestions.js
- src/ui/interludeDeskView.js
- src/ui/recapView.js
- src/ui/liveFrameView.js（若白天框/标签层相关）
- src/styles.css
- src/app.js（仅 dayFrame / 幕间 / recap 挂载所需的最小改动）

【任务 1 — 场景追问成本可读】
在 sceneQuestions（及渲染它的 live 选择层）中：
1. 把「自由追问」与「关键追问」在视觉上分组（分区标题或轻微分隔即可），不要混成一排同款按钮。
2. 给非剧透的成本提示。禁止写「正确答案 / 加分 / 必选」。允许类似：
   - 题组旁：「关键追问会推进原话；绕开关键处可能掉耐心」
   - 单题旁短 hint：「深层追问可能掉耐心」或「耗时 1」这类已有资源语言
3. 选完后的耐心/进度反馈继续走现有 HUD；不要另造一套分数条。
4. 保留所有现有 story / choice 字段与 id；只改呈现层。

【任务 2 — 幕间调查预算一行化】
在 interludeDeskView（及白天行动卡）中：
1. 顶栏预算收成一行主信息：例如「剩余 N」（或「剩余 N 格」），不要同时堆「剩余 / 已做 / 至少 / 最多」长说明。
2. 每张行动卡只标「耗时 1」或「耗时 2」一类短标签。
3. 删掉或折叠过度规格说明散文；规则细节可放二次展开，默认不占首屏。

【任务 3 — 修复白天底图静默回退】
现状：案件 JSON 已使用 backdropClass "day-studio"、"day-office"，但 styles.css 没有 .day-studio / .day-office 规则，运行时等于无专属底图。
优先方案：在 styles.css 为 .day-studio 与 .day-office 补齐 background 规则，接到仓库里已有、气质匹配的 PNG（可临时复用）：
- 工作室/后台控制感：可考虑 livestream_studio_v2.png 或同类控台图，但必须与 .day-city 有可辨差异（色偏/叠层不同）
- 办公室：可考虑 agency_office.png / office_finance_reimbursement.png / profile_verification_desk.png 等已有室内图
备选方案（仅当 CSS 接线不可行）：把 JSON 的 backdropClass 改成已有 class（day-city / day-document 等）——尽量少改 JSON。
验收：进入含 day-studio / day-office 的白天场景时，背景不是「空/纯黑/与默认完全不可区分」。

【任务 4 — 餐厅/咖啡馆接线 cafe_date.png】
现状：.day-restaurant 与 .day-cafe 仍指向 livestream_studio_v2.png。
请改为（至少 restaurant，cafe 若语义合适一并改）：
  url("../assets/generated/backgrounds/cafe_date.png")（可加 cache-bust ?v=…）
并保留一层低对比 gradient 叠层，保证底部对白区可读。不要在图里烧字。

【任务 5 — 区分 .day-lab / .day-document / .day-city】
即使暂时没有完美专属图，也要用「不同 gradient 叠层 + 不同已有 PNG」做出可辨差异。候选资产目录：
  assets/generated/backgrounds/
可用参考：profile_verification_desk.png、agency_office.png、office_finance_reimbursement.png、contact_sheet.png、housing_sales.png 等。
禁止：在图片上发明可读假文书/假 UI 字；禁止三处看起来几乎一样。

【任务 6 — Recap 压缩到 ≤3 页】
修改 src/ui/recapView.js 的 solvedRecapPagesHtml（及调用方若依赖页数）：
目标结构（建议）：
  页1 — 直播成绩 / 路线 / 压力
  页2 — 事实边界
  页3 — 回拨结果 / 麦外来信 / 下一案入口
不要删关键事实字段；合并展示即可。手机 390 与桌面 1440 都要能翻完且无横向溢出。

【任务 7 — 无障碍与输入】
保留：键盘、手柄（含 B 关闭类交互）、prefers-reduced-motion。
不要破坏现有 z-index 单一层级约定（scene 0 / HUD 10 / dialogue 20 / choice 30 / material 40 / court 50）。

【明确不做】
- 不生成新立绘、不改 callerArt 文件名（Prompt W）
- 不重做标题页品牌大改、不重做夜班四案底图
- 不把白天改成卡片仪表盘；白天应像「进了一个地方」

【验收】
1. npm run check
2. 视觉/流程 smoke（可用 npm run smoke:browser 或手工）：标题 → 夜班 live → 追问 → 材料 → 白天调查 → 回拨
3. 视口：390×844 与 1440×900
4. 确认：day-studio/day-office 有可见底图；restaurant/cafe 使用 cafe_date；追问分组+成本 hint；幕间「剩余 N」+卡上耗时；Recap ≤3 页
```

---

## 4. 完整 Prompt W — 接线立绘与白天底图

把下面整段复制给接线工程师 Agent：

```text
你是《直播间大侦探》资产接线工程师（非剧情、非纯 UI 文案）。
基线：2026-07-15 canvas ui-interaction-art-audit。美术宪法：docs/art-direction-v2-prompts.md（半剪影 + 眼部光带；禁止发明新脸）。
本任务把已有图接到运行时；缺图只记录槽位留给 Prompt G，不要用主播正脸冒充来电人。

【硬约束】
- 不要编辑 ~/.cursor/plans。
- 不要改案件剧情 JSON（manifest 的 callerArt 路径与 cache-bust 除外；backdropClass 仅当与 CSS 对齐必需时改）。
- 匿名来电人路径禁止回退到 meng_host_v2 全脸。主播只出现在控台/监视器语境，不进来电人 portrait 槽。
- 方向：silhouette + horizontal eye-light band；旧明亮全脸必须被 V2 替换，不能双轨并存误导验收。

【任务 1 — V2 来电人候选入库并挂 callerArt】
源目录（已有中性候选）：
  assets/generated/art-direction-v2-candidates/
    shen_neutral_v2_candidate.png
    he_neutral_v2_candidate.png
    lin_neutral_v2_candidate.png
    chen_neutral_v2_candidate.png

步骤：
1. 如需去底：处理为透明背景 PNG（保持构图与光带，勿重绘脸）。
2. 复制到 assets/generated/callers/，可用发运名或明确 v2 文件名，例如：
   - caller_credit_shen_neutral_v2.png（案1 沈）
   - caller_salon_he_neutral_v2.png（案2 何）
   - caller_profile_lin_neutral_v2.png（案3 林）
   - caller_work_chen_neutral_v2.png（案4 陈）
   （若团队更想覆盖旧 caller_*.png，必须同步所有引用并升 cache-bust；优先新文件名更安全。）
3. 更新 content/packs/steam-demo-01/manifest.json 四处 callerArt，带新的 ?v= cache-bust。
4. 检查 src/state.js 的 CHARACTER_ART 与任何硬编码旧 callers 路径；来电人中性图应指向 V2，旧明亮全脸退出默认路径。

【任务 2 — portraitLayerHtml / 匿名回退】
检查 src/ui/liveCallView.js 的 portraitLayerHtml、src/app.js 中解析 caller 图的逻辑（含 CHARACTER_ART[npc.id] ?? CHARACTER_ART.meng 一类回退）：
- 匿名来电人 / 缺图时：使用中性剪影占位、空槽或案件默认 V2，**禁止** fallback 到 meng_host_v2 正脸。
- 主播图仅用于 host/deck monitor 相关 UI。
- 为后续 Prompt E 预留 expression.kind → 变体文件名的映射钩子（neutral/guarded/pause），即使 guarded/pause 暂缺也可先指向 neutral。

【任务 3 — 白天 CSS class → 最佳已有底图】
与 Prompt U 对齐（若 U 已改则复核，未改则补齐），在 src/styles.css 映射：
| class | 建议资产（仓库现有） | 备注 |
| day-restaurant / day-cafe | cafe_date.png | 当前错误绑 livestream_studio_v2，必须改 |
| day-studio | livestream_studio_v2.png 或控台/后台气质图 | 必须有独立规则，禁止静默缺失 |
| day-office | agency_office.png / office_finance_reimbursement.png / profile_verification_desk.png | 与 studio 可辨 |
| day-lab | 档案/实验室气质；可暂用 desk/archive 类已有图 + 独特叠色 | 与 document/city 区分 |
| day-document | profile_verification_desk.png 等 | 偏案头 |
| day-city | 保持或强化户外/城市感叠层 | 勿与室内三处撞车 |

列出仍缺、必须 Prompt G 新画的槽位（例如真正的 archive/lab 专属、studio backstage 若现图不够）。不要用可读假字图凑数。

【任务 4 — 顾问头像槽（可占位）】
在 interludeDeskView 的 advisorConflict（及回拨同屏顾问区若有）：
- 每人：圆形/方形头像槽 + 姓名 + 短领域/立场一句；完整长文案选中后再展开。
- 若尚无顾问 art：用纯色/剪影圆 + 姓名字母或姓氏，结构先成立。
- 不要只渲染一组长按钮字墙。

【验收】
1. npm run verify:pack 与 npm run check
2. 视觉 smoke：四案 live 来电人应为 V2 剪影光带，而非旧明亮证件照风；缺案时不出现主播正脸
3. 白天 restaurant/cafe 能看出 cafe_date；studio/office 不再「没 class」
4. 顾问分歧至少有头像槽结构
5. 在 PR/笔记中留下「仍缺 → Prompt G」清单
```

---

## 5. 完整 Prompt G — 缺图生成

把下面整段复制给**仅做图像生成**的 Agent / 绘图流程（不改代码）：

```text
你只负责按美术方向生成仍缺失的图像资产，不修改游戏代码、不改 JSON 剧情、不编辑 ~/.cursor/plans。
生成完成后把文件路径与命名交给 Prompt W 接线。

【风格宪法】（必须整段使用）
正向前缀（来自 docs/art-direction-v2-prompts.md）：
cinematic 2AM mood, single-source dramatic lighting, heavy 35mm film grain, halation glow, duotone color grading, chiaroscuro, urban Chinese midnight interior, muted shadows with one saturated accent light, painterly semi-realistic illustration (NOT photoreal, NOT anime), quiet tension, negative space, for a live-radio detective visual novel

统一负面：
no text, no readable letters, no watermark, no logo, no extra limbs, no deformed hands, no oversexualized, no childlike, no fantasy, no cyberpunk city, no horror gore, no busy background, no full-face bright even lighting, no photorealism, no anime cel style, no cropped body parts (unless specified)

额外：画面内禁止任何可读中文/英文/单据正文；底部约 28% 留给对白 UI 的低细节区（背景类）。

【只生成缺失项 — 跳过已有】
已存在且应由 W 接线、本 Prompt 默认跳过：
- assets/generated/backgrounds/cafe_date.png（餐厅/咖啡馆）
- 四案夜班直播底图
- 四张来电人 V2 neutral 候选（art-direction-v2-candidates）

请确认仓库后，仅生成下列仍缺槽位（若 W 已用临时图顶上且验收可辨，可标「暂缓」）：

A) 白天 · 档案室 / 实验室室内（供 .day-lab 或档案调查）
规格：2048×1152，16:9，无人物，无可读文字。
可用扩写参考（docs/ui-art-expansion-prompts-2026-07-12.md §5「周会计的档案室」）：
An archive room converted from an old Chinese factory office in late afternoon. Rows of dull steel filing cabinets, one white incandescent tube, a worn wooden desk with two iron document clips, a metal calculator, four blank date cards arranged into a timeline, dust visible in the side light. No people. Moss green shadows with restrained amber paper light, practical and slightly cold, composition leaves the lower 28 percent and right side quiet for dialogue UI, cinematic visual novel background, no readable documents, no modern luxury office.
建议文件名：assets/generated/backgrounds/day_archive_lab.png

B) 白天 · 咖啡馆
若 cafe_date.png 已由 W 接到 .day-restaurant/.day-cafe → 跳过。
仅当需要「另一角度/打烊后」变体时再画，命名 day_cafe_afterhours.png，勿重复同构图。

C) 白天 · 工作室后台 / 控制室（供 .day-studio，若现有 livestream_studio_v2 差异不足）
参考扩写（同文档 §5「三路同时进后台的控制室」）：
The back control room of a Chinese late-night call-in studio during an advertising break. A closed studio door on the left, one remote spreadsheet monitor with abstract rows and no readable data, a legal file on a side console, an audio waveform channel lit on a compact mixer, three distinct empty speaking positions implied by chair, monitor and speakerphone. No people. Phosphor grey-green monitor light with warning amber accents, deep black negative space, lower 28 percent quiet for dialogue UI, cinematic visual novel background, no futuristic cyberpunk equipment, no broadcast logos, no readable text.
建议文件名：assets/generated/backgrounds/day_studio_backstage.png

D) 四顾问腰上半身 vignette（docs/art-direction-v2-prompts.md 第五节 + expansion §4）
规格：透明背景 PNG，2048×2048，腰部以上；台灯/工作灯单侧主光；脸可读但边缘溶进颗粒；小尺寸头像仍能靠轮廓/道具区分。
共用段：
trusted late-night confidant, waist-up portrait, warm tungsten desk-lamp key light, face clearly readable but edges dissolving into grain and shadow, one occupational prop lit by the lamp, quiet domestic 2AM atmosphere
（张法医改用冷白工作灯——他是唯一偏冷光的顾问。）

1) 赵律师 → advisor_zhao_waistup_v2.png
Adult Chinese woman in her late 30s, partner at a family-law firm, composed and unsentimental. Short practical hair, dark burgundy suit with a plain high-neck inner shirt, one thin case file held closed against her ribs, the other hand holding a black pen without gesturing. She looks slightly past the camera as if choosing the legal boundary of a sentence. One-side warm desk-lamp key light, cool shadow side, visible natural skin texture, restrained expression, waist-up, transparent background, painterly semi-realistic illustration, no headset, no courtroom robe, no glamour pose.

2) 周会计 → advisor_zhou_waistup_v2.png
Adult Chinese woman around 50, former manufacturing finance director, practical and severe about numbers. Short greying hair, dark moss cardigan over a clean collared shirt, reading glasses low on the nose, one hand holding a narrow ledger and the other resting on a metal calculator. Her gaze is on the transaction path, not the viewer. Phosphor green monitor light with muted amber rim, waist-up, transparent background, painterly semi-realistic illustration, no corporate stock-photo smile, no luxury accessories.

3) 小林老师 → advisor_lin_waistup_v2.png
Adult Chinese woman in her early 40s, owner of a neighborhood matchmaking shop, warm but protective of her trade. Soft rust-red knit jacket over a practical blouse, sleeves rolled once, a stack of two mismatched client cards and a whiteboard marker in her hands. Open stance with one shoulder angled forward, expression says she will explain the trade but will not excuse a person. Coral practical lamp light against deep navy shadow, waist-up, transparent background, painterly semi-realistic illustration, no youthful idol styling, no readable text on cards.

4) 张法医 → advisor_zhang_waistup_v2.png
Adult Chinese man in his early 40s, forensic documentation specialist with strict chain-of-custody habits. Lean build, short hair, charcoal work jacket over a pale shirt, nitrile gloves tucked into one pocket, holding a sealed evidence sleeve by its edge and checking the seal rather than the camera. Cold white lab side light with a narrow desaturated blue rim, waist-up, transparent background, painterly semi-realistic illustration, no gore, no corpse, no police badge, no dramatic detective pose.

建议输出目录：
  assets/generated/advisors/   （顾问）
  assets/generated/backgrounds/ （白天底图）

【禁止】
- 不要画来电人新脸；来电人变体是 Prompt E，且必须锁 V2 neutral 参考图
- 不要在图内写 UI 字、节目 Logo、可读账单
- 不要生成主播正脸

【交接】
生成后列出：文件路径、用途 class/角色、是否透明、分辨率。交给 Prompt W 更新 CSS / manifest / interludeDeskView 头像 src。
```

---
## 6. 完整 Prompt E — 表情差分与表演

在 Prompt W 完成中性 V2 接线后执行。把下面整段复制给「生成 + 接线」Agent：

```text
你在 Prompt W 已把四案来电人 V2 neutral 接到运行时之后，补齐表情差分并接到表演层。
参考：docs/ui-art-expansion-prompts-2026-07-12.md §3；docs/art-direction-v2-prompts.md 差分规格（neutral / guarded / pause）。
不要编辑 ~/.cursor/plans。不要改剧情 JSON。不要发明新脸——每张变体必须以对应 *_neutral_v2_candidate.png（或已发运的 V2 neutral）为唯一角色参考。

【生成规格】
- 透明背景 PNG，2048×4096，全身 1:2；人物约占高度 86%–90%
- 眼部水平光带高度与中性稿一致；身份/发型/服装/手机/身材锁死
- 情绪靠肩线、手、下颌，不靠五官特写；禁止哭崩大脸

【逐案 Prompt — 直接使用】

案1 沈 guarded：
Use the supplied Shen neutral V2 candidate as the exact character reference. Same adult Chinese woman, same face silhouette, bun, long dark coat and phone. Guarded reaction after the host asks about installment payments: shoulders pull inward, free hand grips the envelope inside her coat pocket, chin turns slightly away from the microphone, lips pressed before answering. Eyes remain completely hidden by one horizontal amber screen-light strip. Deep scarlet rim light, amber key light, transparent background, full-body silhouette, restrained posture, no melodramatic crying.

案1 沈 pause：
Use the supplied Shen neutral V2 candidate as the exact character reference. Same identity, hair, coat and phone. A long pause after hearing the bank-flow timeline: phone lowers two centimeters from her ear, shoulders stop moving, free hand loosens around the envelope, head tilts down as if counting dates. Eyes fully hidden by the same amber light strip. Deep scarlet and amber duotone, transparent background, full-body silhouette, quiet shock, no tears, no open-mouth expression.

案2 何 guarded：
Use the supplied He neutral V2 candidate as the exact character reference. Same adult Chinese woman, same messy bun, loose home clothes and phone. Guarded after the host asks what benefits she accepted: one arm folds across her waist, weight shifts away, phone held tighter, jaw set, shoulders slightly raised. Eyes completely hidden by the same cold teal screen-light strip. Neon pink rim light, teal shadow mass, transparent background, full-body silhouette, everyday clothing, no fashion pose.

案2 何 pause：
Use the supplied He neutral V2 candidate as the exact character reference. Same identity and clothing. She stops before quoting his exact words: phone stays at her ear, raised shoulder drops, free hand opens and then freezes beside the trouser seam, head turns toward an empty chair outside frame. Eyes hidden by the same teal light strip. Teal and neon pink duotone, transparent background, full-body silhouette, hesitation shown through posture, no crying.

案3 林 guarded：
Use the supplied Lin neutral V2 candidate as the exact character reference. Same 28-year-old Chinese audit assistant, same tied hair, blue shirt, dark high-waisted trousers and phone. Guarded when asked about her own salary: spine becomes rigid, free hand slips behind her back, chin lifts by a few degrees, feet close together as if returning to a formal interview stance. Eyes fully hidden by the same ice-blue screen-light strip. Navy shadow mass, cold blue edge light, transparent background, full-body silhouette, precise restrained posture.

案3 林 pause：
Use the supplied Lin neutral V2 candidate as the exact character reference. Same identity and office clothing. A numerical answer catches in her throat: phone lowers slightly, free hand counts once against her trouser seam and stops, chin dips, body remains otherwise controlled. Eyes hidden by the same ice-blue light strip. Ice blue and navy duotone, transparent background, full-body silhouette, silence expressed by stillness, no exaggerated emotion.

案4 陈 guarded：
Use the supplied Chen neutral V2 candidate as the exact character reference. Same young adult Chinese project employee, same short hair, rolled sleeves, vest, lanyard and phone. Guarded after the host separates approval from payment: one hand closes around the lanyard badge, shoulders square defensively, weight shifts to the back foot, face turns slightly away. Eyes fully hidden by the same pale phosphor screen-light strip. Grey-green shadows and warning amber edge light, transparent background, full-body silhouette, tired office posture.

案4 陈 pause：
Use the supplied Chen neutral V2 candidate as the exact character reference. Same identity and work clothes. He pauses after hearing the phrase “old rule”: phone remains at his ear, free hand releases the badge, shoulders sink, gaze direction drops behind the eye-light strip, desk monitor glow barely catches one sleeve. Phosphor grey-green and warning amber duotone, transparent background, full-body silhouette, contained fear, no dramatic collapse.

建议命名（放入 assets/generated/callers/）：
  caller_*_guarded_v2.png / caller_*_pause_v2.png
（* 与各案发运前缀一致，并升 cache-bust。）

【接线任务】
1. 在 portraitLayerHtml（src/ui/liveCallView.js）及 livePressure / callerExpressionForView 路径中：
   将 expression.kind（或等价字段：neutral / guarded / pause / shift 等）映射到对应 PNG。
2. 当艺术变体存在时：立绘切换为主要反馈；文本 chip 可保留为辅助，但不得再作为唯一反馈。
3. 缺变体时安全回退到该案 V2 neutral——仍禁止回退 meng_host_v2。
4. 保留 reduced-motion：可减弱切换动画，但不取消姿态图替换。

【验收】
- 追问触发防备/停顿时，立绘与状态一致变化
- npm run check；四案各至少抽一镜确认 guarded 与 pause
- 光带高度四态一致；无新脸、无可读烧字
```

---

## 7. 建议执行顺序 + 验收命令

```text
顺序：Prompt U → Prompt W →（缺槽则 Prompt G → 再回 W）→ Prompt E

每步后最低命令：
  npm run check
  npm run verify:pack

建议加跑：
  npm run smoke:browser

手工视口：
  390×844、1440×900
  路径：标题 → live → 追问 → 材料 → 白天（含 restaurant/studio/office）→ 顾问分歧 → 回拨 → Recap（≤3 页）

完成定义（DoD）：
  [x] .day-studio / .day-office 有可见专属规则与底图
  [x] .day-restaurant（及合适时 .day-cafe）使用 cafe_date.png
  [x] .day-lab / .day-document / .day-city 可辨
  [x] 追问分组 + 非剧透成本 hint
  [x] 幕间「剩余 N」+ 卡上「耗时」
  [x] Recap ≤3 页
  [~] 四案 callerArt 统一方向：旧 V2 全量替换已被 2026-07-16 的像素迁移决策取代；案 2 像素三态已接入，其余三案等真人样张验收
  [x] 顾问分歧有头像槽（当前为姓氏剪影占位）
  [x] 案 2 guarded/pause 接到 expression.kind，并保留 neutral 安全回退；其余三案不在样张验收前批量生产
```

---

## 8. 相关链接

| 文档 | 用途 |
|---|---|
| [art-direction-v2-prompts.md](./art-direction-v2-prompts.md) | V2 风格前缀、负面、光带、顾问、主播背影 |
| [ui-art-expansion-prompts-2026-07-12.md](./ui-art-expansion-prompts-2026-07-12.md) | 2026-07-12 UI 改版与 guarded/pause/顾问/场景扩写 |
| [ui-art-asset-review.md](./ui-art-asset-review.md) | 资产验收（匿名感、光带、双色调、颗粒） |
| [ui-gameplay-art-review-2026-07-12.md](./ui-gameplay-art-review-2026-07-12.md) | 玩法+UI 复核原文（P0/P1 明细） |
| [case12-drama-rewrite-blueprint.md](./case12-drama-rewrite-blueprint.md) | 案1/2 内容已重写；本包只做呈现 |
| canvas `ui-interaction-art-audit` | 2026-07-15 维度得分与 Top8 |

资产速查：

- V2 候选：`assets/generated/art-direction-v2-candidates/`
- 来电人发运：`assets/generated/callers/`
- 白天/场景底图：`assets/generated/backgrounds/`（含 `cafe_date.png`）
