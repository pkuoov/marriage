# BGM 生成日志·全量 Prompt 存档(标题曲战役)

日期:2026-07-19
姊妹文档:[bgm-brief-and-prompts.md](bgm-brief-and-prompts.md)(Brief 模板与迭代规范——写新 prompt 前先读它)
成品:`assets/audio/bgm/title-neon-rain.ogg`(2:22,opus 160k;源档见 `assets/audio/source/bgm-title-neon-rain/`,已 gitignore)

## 一、九曲家族总表(初版 prompt,曲 1 已完成,余 8 首待做)

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
