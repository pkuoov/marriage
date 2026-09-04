# BGM 生成日志·全量 Prompt 存档(标题曲战役)

日期:2026-07-19
制作参数与当前可用 Prompt：[udio-bgm-production-prompts-v2.md](udio-bgm-production-prompts-v2.md)
成品:`assets/audio/bgm/title-neon-rain.ogg`(2:22,opus 160k;源档见 `assets/audio/source/bgm-title-neon-rain/`,已 gitignore)

> 2026-09-04 母带归档：7 个已采用的非标题曲源 WAV 已逐文件核对 SHA-256，并复制到 `~/Documents/love-audio-archive/2026-09-04/selected-masters/`。仓库内本地副本保留但不再由 Git 跟踪；5 个备用母版继续跟踪；9 个明确淘汰母版已删除。未重写 Git 历史。

> 2026-07-21 更新：下面的“九曲家族总表”保留为历史记录。当前运行时九槽位和可直接投喂 Udio 的细化参数，以 [udio-bgm-production-prompts-v2.md](udio-bgm-production-prompts-v2.md) 为准。

> 2026-07-21 时长纠偏：此前出现的 32 秒文件是完整成曲的 Udio Remix 片段，不是原曲长度，也不是后续 BGM 的统一交付规格。完整曲保留为母版；32 秒 Remix 只用于局部方向验收，最终循环时长按实际场景重新设计。

## 2026-07-22 · 六槽位正式接入

- 标题槽位已从工程占位切换到 `assets/audio/bgm/title-neon-rain.ogg`。
- `music_2_2 / music_2_1 / music_4_3 / music_5_2 / music_6_2` 已分别晋升为 `live-call / pressure-stem / offair-desk / day-investigation / callback-return` 的正式循环。
- 五个 approved 配方直接输出到 `assets/audio/bgm/`，统一为 48 kHz、Ogg/Opus、约 -20 LUFS，并通过循环接缝自动验收。
- 第二夜进入连续对白、材料核对和实时反压后继续使用 `callback-return`；只有耐心偏低时才由 `pressure-stem` 覆盖，不再错误切回夜 A。
- 剩余 Udio 工作缩减为曲 7 最终追问、曲 8 单案回看、曲 9 天亮前。曲 7 首轮两个 UUID 文件仍保留为淘汰样本，不进入游戏。

## 2026-07-21 · 曲 2 `live-call` 首轮实听

- v1：淘汰。听感杂乱无章，和声、低音和质感层都在轮流证明 Prompt 里的细节，无法安静托住对白。
- 诊断：约束密度过高，不是简单的配器选错。
- v2：参数保持不变；Describe 压缩为四句，Style Reduction 只保留十个直接冲突项。生成原档保留在 `assets/audio/unchanged/music_2_1.wav` 与 `music_2_2.wav`。
- 人工听感：`music_2_1` 气氛更紧张，`music_2_2` 更舒缓。普通连麦优先采用 `music_2_2`；`music_2_1` 不淘汰，保留为压力段或夜 B 的方向参考。
- 工程复核：`music_2_2` 的对白敏感频段占用更低，中段约 43–103 秒最稳定。`music_2_1` 的 11.903375–45.903375 秒与曲 2 review 循环的和声轮廓相似度约为 0.93，已由程序直接剪成 30 秒压力层候选，不再 Udio Remix。
- 规则推广：仍需生成的曲 4–9 的 Describe 已统一压缩到约 30–50 个英文词，Style Reduction 缩为 6–8 个直接失败模式。循环、频段、响度和文件收尾全部移交工程后处理，不再要求 Udio 同时解决。

## 2026-07-22 · 曲 4 `offair-desk` 首轮实听

- v1 A：`music_4_1.wav` 稍好，响度范围约 3.8 LU，保留为回退候选但暂不剪辑。
- v1 B：`music_4_2.wav` 淘汰。人工听感混乱；工程测得响度范围约 21.9 LU，整首由极弱持续堆到很响，明显不适合长时间看材料。
- 诊断：失败轴是宏观发展和层次累积，不是单纯频段拥挤。
- v2：只改 Describe，去掉容易触发类型片编排的 `investigative` 与 `steady pulse`，改为从头到尾保持同一小织体。参数和 Style Reduction 不动。

### v2 结果

- `music_4_3.wav`、`music_4_4.wav` 都明显改善，方向稳定为 late-night 慵懒风；响度范围分别约为 3.2 LU、2.9 LU。
- `music_4_3` 的重复脉冲更弱，定为 `offair-desk` 首选；`music_4_4` groove 更明显，保留为备用。
- `offair-desk-v2-review` 已从 `music_4_3` 的 11.508–105.508 秒生成 90 秒循环，成品 -20.00 LUFS，循环边缘能量差约 0.41 dB。
- Prompt 冻结。下一步验证的是游戏内材料阅读感，不再继续生成。

## 2026-07-22 · 曲 5 `day-investigation` 首轮实听

- 人工选择：`music_5_2.wav` 明显优于 `music_5_1.wav`，定为首选。
- 工程复核：`music_5_1` 的主要脉冲接近 60 BPM，已经失去白天走访感；`music_5_2` 约 88.6 BPM，基本服从 88 BPM 设定，动态和立体声也更适合多地点连续使用。
- 两首都有母版换段；`music_5_2` 不硬裁成长循环，取 12.673–60.013 秒来源，生成约 16 小节、43.34 秒的稳定循环。
- `day-investigation-v1-review` 成品为 -20.00 LUFS，接缝端点约 -73.7 dBFS。Prompt 冻结，下一步只做游戏内多地点试听。
- 本轮同时修正处理程序：低通改在分段前作用于连续母版，避免文件首尾继承不同滤镜状态。此前三个 review 已全部重建并重新通过接缝验收。

## 2026-07-22 · 曲 6 `callback-return` 首轮实听

- `music_6_1.wav` 淘汰：人工听感偏阴间、灵异；工程上前半极弱、后半大幅抬升，结构不适合作为第二晚长对话底乐。
- `music_6_2.wav` 入选：听感慵懒但稳定，实际约 63.75 BPM、响度范围约 1.9 LU，低频占比约 60%，比普通连麦更沉。
- 曲 2 与曲 6 中间隔着白天调查，不要求二者按同一实际拍速直接交叉淡化；不对 `music_6_2` 做明显拉伸。
- `callback-return-v1-review` 取 6.9–101.25 秒来源生成 90.35 秒循环，成品 -19.99 LUFS，接缝端点约 -58.9 dBFS，边缘能量差约 0.33 dB。
- Prompt 冻结。只有游戏内夜 B 实测仍太松时，才考虑从同母版后段改剪；不恢复 `music_6_1`。

## 2026-07-22 · 曲 7 `accusation` 首轮实听

- v1 两个结果均噪、乱，全部淘汰。原始文件实际已在 `assets/audio/unchanged/`，只是没有使用 `music_*` 前缀；按落盘时间分别记为 v1 A `971ea0f2-1825-44b9-a475-ed45435f8f0c.wav`、v1 B `63715782-9244-4b36-b0ca-c53fb611d675.wav`。
- 两首实际时长分别为 131.84 秒、133.01 秒。v1 A 的 6 kHz 以上能量约 16.63%，频谱质心 90 分位约 10.7 kHz，并出现满幅采样与 +4.69 dBTP 真峰值；高频毛刺和亮瞬态是主要问题。
- v1 B 的高频占比只有约 3.80%，但整体达到 -12.69 LUFS，秒级能量跳变 95 分位约 8.06 dB；主要问题是持续过响、织体过满和段落起伏，而不是单纯高频噪声。
- 诊断修正：旧 Describe 的加法会同时诱发两类失败。源压力曲已经紧张，再增加 felt-piano dyads 与 Rhodes dissonance，A 会把它做成高频活动，B 会把它做成能量与层次累积。
- v2 改用短减法描述；Style Reduction 明确禁止新乐器、打击乐、亮瞬态、失真、噪声纹理和发展段。Prompt Strength 从 72% 降到 58%，Clarity 从 36% 降到 24%，优先保住源曲而不是让 Udio 重新编曲。
- 若 v2 仍同时噪乱，停止重抽，改由工程程序从压力层派生。

## 2026-07-23 · 曲 7 v2 与曲 8 `recap-afterhours` 首轮实听

- 曲 7 v2 的两份结果为 `b8ab6093-e42b-4b0e-93b8-07c89763d584.wav` 与 `333133c7-66fc-4e5d-a666-72662ea6b83d.wav`。人工初听均可用，保留到工程选段阶段，不再与曲 8 混记。
- 曲 8 v1 的两份结果为当天最新落盘的 `98386987-dbbd-4468-ae03-ff7ecebf9edb.wav` 与 `10bff78d-d89c-4b3e-ae5a-ccb809b2666a.wav`。人工听感均为背景杂乱、节奏不协调，全部淘汰。
- 工程观察与人工听感一致：`98386987…` 约 52 秒后才进入连续密集脉冲，前后像两套编排；`10bff78d…` 几乎全曲都有等间距瞬态，并在约 59–69 秒另做一次拆段。两首响度范围仅约 3–4 LU，因此“动态不大”不能作为对白底乐可用的依据。
- 原因定位：旧 Describe 同时指定 `quiet rounded bass`、`four-note phrase` 和 `small steady texture`，Udio 把三项分别实现成低音运动、短动机和持续脉冲，形成互相抢拍的三个节奏主体。
- 曲 8 v2 删除低音线和四音型，只保留长时值 Rhodes 和模拟 Pad；Clip Timing 从 65% 调到 50%，Prompt Strength 从 68% 调到 62%，Clarity 从 30% 调到 20%。Style Reduction 明确排除鼓、打击乐、低音 Groove、琶音、固定音型和切分。
- 曲 9 同步取消复用四音型的要求，只继承 Rhodes / Pad 音色，避免曲 8 的失败机制沿用到全局尾声。

### 曲 7 v2 封版

- 两份 v2 均通过人工初听；工程比较后选择动态和段落更稳定的 `b8ab6093…`，`333133c7…` 继续保留为可用备选。
- 正式配方 `accusation-v2` 从 `b8ab6093…` 的 56 秒开始，制作 30 秒循环，使用 4 秒环形交叉淡化、15 kHz 低通和 -20 LUFS 归一化。
- 成品约 -19.99 LUFS、LRA 2.0 LU，接缝两端能量差约 0.43 dB，通过自动验收并接入 `assets/audio/bgm/accusation.ogg`。
- 曲 7 到此冻结，不再生成。

### 曲 8 v2 结果与 v3 修正

- v2 两个结果只有一份进入仓库：`bf9c2027-6025-493c-9aab-98e8f5a6d8f1.wav`。另一份完全没有曲调，人工当场淘汰，不要求为归档再下载。
- `bf9c2027…` 有可辨旋律，可作为兜底；但频谱显示规则瞬态贯穿大部分曲子，编排也分成数个能量块，因此暂不接入游戏。技术数据为 132.52 秒、约 -12.0 LUFS、LRA 2.9 LU、真峰值 -0.4 dBFS。
- v2 的问题不是继续做减法就能解决：完全取消运动主体会生成无曲调底色，模型也可能自行用门控 Pad 或规则脉冲填补空缺。
- v3 明确只让一条稀疏 Rhodes 旋律承担运动，长时值 Pad 只托和声；Prompt Strength 调至 64%，Clarity 调至 22%，Style Reduction 增加 `rhythmic tremolo`。如果 v3 仍失败，先用 `bf9c2027…` 做低音量游戏内试听，不再盲目增加 Prompt 约束。

### 曲 8 v3 结果与 v4 修正

- v3 A 为 `5c95284e-4137-4ab4-ab9a-6fd35c66979e.wav`，人工听感仍然太燥，淘汰。文件长 132.67 秒、约 -10.1 LUFS、LRA 3.3 LU，真峰值达到 +0.3 dBFS；6 kHz 以上频段约 -25.7 LUFS，宽频规则瞬态贯穿全曲。
- v3 B 为 `e6c431e7-db5a-43a0-8745-60b14754d136.wav`，人工听感稍好，降为第二兜底。文件长 134.70 秒、约 -11.1 LUFS、LRA 3.2 LU、真峰值 -0.4 dBFS；6 kHz 以上频段约 -32.2 LUFS，比 A 低约 6.5 LU，但前约 100 秒仍有连续规则脉冲。
- 原因修正：只在文字上禁止节奏还不够；“稀疏旋律 + 持续 Pad + BPM 网格”仍给了模型组织伴奏层的空间。v4 去掉 Pad 与所有伴奏，只生成自由速度的独奏 Rhodes。
- v4 工作母版缩短到约 1:20，BPM 降到 60，Prompt Strength 66%，Clarity 18%。若这一轮仍失败，停止生成，转为两份兜底素材的游戏内低音量盲选。

### 曲 8 v4 封版

- v4 A 为 `c077d327-3120-404e-9fe0-4bd48f7841be.wav`，人工确认可用，正式入选。源文件长 98.50 秒、约 -13.0 LUFS、LRA 6.1 LU、真峰值 -0.1 dBFS。
- v4 B 为 `85d90004-e44e-4d2b-b34d-8beacbc3d7c2.wav`，人工确认不可用，淘汰；不再围绕曲 8 修改 Prompt。
- 工程配方 `recap-afterhours-v4` 从 A 的 43.25 秒开始，制作 46 秒循环，使用 8 秒环形交叉淡化、13.5 kHz 低通和 -20 LUFS 归一化。成品接缝能量差约 1.31 dB，已通过自动验收。
- 正式成品接入 `assets/audio/bgm/recap-afterhours.ogg`。曲 8 Prompt 到此冻结；后续只允许调整播放增益或工程母带，不再生成新曲。

## 一、九曲家族总表(历史初版，已被 v2 制作单取代)

| # | 曲目 | 状态 | Prompt |
| --- | --- | --- | --- |
| 1 | 主题曲/标题 | **完成**(拼接工艺,见下) | `lo-fi noir, late night radio show theme, warm Rhodes electric piano, tape hiss, vinyl crackle, soft boom bap drums, deep sub bass, muted trumpet melody, radio static sweep intro, melancholic but warm, city at 1am, neon rain, 72 BPM, instrumental` |
| 2 | 夜A倾听底垫 | 待做(可考虑《1AM Neon》降级候选) | `minimal lo-fi ambient, sparse Rhodes chords with long gaps, soft tape hiss, subtle sub bass pulse, no melody, no drums, patient and attentive mood, dimly lit radio studio, background music for dialogue, very quiet dynamics, 60 BPM, instrumental` |
| 3 | 追问压力层 | 待做(与曲2同调同速) | `tense lo-fi noir underscore, muted pulsing bass, ticking rim clicks, dissonant Rhodes stabs, low string drone, held breath tension, interrogation pressure, slowly building, no release, dark minimal, 70 BPM, instrumental` |
| 4 | 材料板/文档 | 待做 | `minimal investigative groove, soft ticking percussion like a clock, plucked muted guitar, cold electric piano arpeggio, paper shuffling texture, focused late night desk work, methodical, hypnotic loop, detective examining documents, 78 BPM, instrumental` |
| 5 | 白天调查 | 待做 | `daytime lo-fi city pop, hazy jazzy guitar, warm bass, brushed drums, distant traffic ambience, tired but hopeful afternoon light, walking through the city after a sleepless night, bittersweet, mellow groove, 92 BPM, instrumental` |
| 6 | 夜B回拨 | 待做(建议 remix 曲1) | `lo-fi noir reprise, same warm Rhodes theme but slower and heavier, thicker sub bass, sparse piano notes, rain on window, emotional weight, second phone call at midnight, everything unsaid, 64 BPM, instrumental` |
| 7 | 结案/判词 | 待做 | `bittersweet resolution, warm piano and Rhodes duet, soft strings swell, tape saturation, radio static fading in and out, quiet dignity, no easy answers, closing statement at 3am, gentle and grounded, 68 BPM, instrumental` |
| 8 | 收播后/天亮 | 待做 | `dawn lo-fi, tender music box and soft piano, warm analog pad, birds faintly starting, tape hiss like breathing, exhausted tenderness, first light through blinds, going home after the night shift, quiet gratitude, hopeful ending, 60 BPM, instrumental` |
| 9 | sting 组 | 待做(brief 文档有升级版三分法) | `sudden tension sting, low piano cluster hit, string scrape, radio static burst, heartbeat bass drop into silence, dramatic interruption, short cue, dark, instrumental` |

## 二、标题曲战役全记录(成功路径:区域 remix 拼接链)

### 素材起点

- Mureka《1AM Neon》(3:18):质感对,laid-back 风险;保留为曲 2 候选,未再加工。
- Udio《Neon Rain Nights》(2:15,`00-original-neon-rain-nights.mp3`):结构好(稀疏 45s→断口→和声主段→淡出),缺 motif、淡出不可循环。**选为拼接基底。**
- 路线 A(全新一次成型)prompt 试过被否:`late night radio noir theme song, opens with an AM radio dial static sweep tuning into the station, then warm Rhodes chords and a dusty laid-back boom bap groove enter, a melancholic muted trumpet arrives within the first 20 seconds playing one simple hummable 8-note motif, the motif returns three times with small variations, a short mid-track breakdown of just tape hiss and sub bass, then the full band returns, ends cold on the trumpet's final phrase with one breath of radio static — no fade out. Vinyl crackle, tape saturation, intimate close mix with open midrange, minor key, 72 BPM, around two minutes and fifteen seconds, instrumental`
- **结论:拼接 > 全新生成**(保留已认可质感,逐段控制变量)。

### 段 1·主段加 motif(region 0:48-1:22,Variance 0.4,源=原曲)

```text
add a melancholic muted trumpet lead melody over the existing arrangement — one simple hummable 8-note motif, stated once, unhurried. Keep the Rhodes chords, boom bap groove and chord progression underneath completely unchanged. Late night radio noir, instrumental
```

- 两 take:A(炫技型,一处爆发)/ **B(多乐句陈述+揉音,选用)**。频谱判据:分布式旋律线 > 单点爆发。

### 段 2·motif 复述(region 1:20-1:52,Variance 0.4,源=splice-v2)

```text
the muted trumpet motif from the previous section returns one more time, slightly varied and softer, sitting a little further back in the mix, as if echoing from across the room. Keep the Rhodes chords, boom bap groove and chord progression underneath completely unchanged, instrumental
```

- 两 take:1(伴奏变厚,违反 softer 指令)/ **2(织体退后、主奏清晰,选用)**。判据:复述要认亲,不要炫技。

### 段 3·冷结尾(region 1:50-end,Variance 0.6,源=splice-v3)

```text
replace the fade-out with a cold ending: the muted trumpet plays the motif's final phrase once, slowing slightly, then the whole band stops together on one last chord, leaving only a breath of tape hiss and faint AM radio static for about one second, then silence. Instrumental
```

- 两 take:1(满幅顶到文件边缘,无停顿,弃)/ **2(安静尾奏+末句起落,选用)**;"骤停+呼吸"由后期工程补(0.6s 平方淡出+0.7s 静音垫)。

### 拼接与母带工艺(可复用管线)

1. 每个 take:裁 -50dBFS 以下头尾静音(Udio 区域导出自带 2-4s 静音垫,不裁必出空洞);
2. 互相关对齐(首 3 秒探针;重复段落会让相关锁错小节——收窄搜索窗到速度暗示点 ±0.7s,分数低时信任速度网格);
3. 0.8s 等功率交叉淡化缝合;逐缝频谱验收(节拍网格连续、无空洞、无重拍);
4. 母带一次性:`lowpass=f=15000`(切生成伪影线)+ `loudnorm=I=-16:TP=-1:LRA=11` + **`-ar 48000`(loudnorm 会偷偷升到 192k,必须显式拉回)**;
5. 编码:libopus 160k 进 .ogg(本机无 libvorbis;Chromium 系桌面壳支持 ogg/opus。注:仓库旧资产为 vorbis,若发现目标环境不认 opus,用带 libvorbis 的 ffmpeg 重编 `20-master.wav` 即可)。

### 成品指标

- 时长 2:22;结构:稀疏开场(0-47s)→ 小号主陈述(47-79s)→ 轻声复述(84-116s)→ 渐弱尾奏 → 工程化轻收+静音(致敬"轻轻挂断");
- -16.8 LUFS / 真峰值 -1.0 dBTP / 48kHz;两处主拼缝(46.68s/83.56s)+ 尾段缝(108.28s)频谱验收通过。

## 三、待办

1. `audioCatalog` 接线:`bgm.title-neon-rain` 登记,与现有 `bgm.title-nightshift` 二选一或做日夜双版(留给 Codex,一行 readyLoop);
2. 余 8 首按九曲表+Brief 模板逐首生成;曲 6(夜B回拨)优先——直接用 `20-master.wav` 做 remix 源,家族感免费;
3. 曲 2 决策:《1AM Neon》降级试用 vs 全新生成;
4. Downloads 里的过程文件已归档至 `assets/audio/source/bgm-title-neon-rain/`(270MB,已 gitignore),Downloads 原件可自行清理。
