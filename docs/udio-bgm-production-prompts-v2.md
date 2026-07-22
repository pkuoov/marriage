# Udio BGM 全套制作单 v2.9（六槽位已接入）

日期：2026-07-22

用途：按当前运行时的九个 BGM 槽位制作正式音乐。旧九曲表只作历史记录，本文件是下一轮 Udio 生成的执行真源。

## 先看结论

- 不是九首彼此独立的“氛围歌”，而是一套共用配器、速度区间和广播混音语言的节目声纹。
- 已完成的 `title-neon-rain` 已接入标题页与开播前；它也继续作为人工听觉参照。
- Udio 的两个文本区是 `Describe your song` 与 `Style Reduction`；当前可调参数为 BPM、Clip Timing、Song Length、Prompt Strength、Lyrics Strength、Clarity 和 Generation Quality。
- 新生成曲最长 2:10。`pressure-stem` 直接剪辑同轮生成的紧张版，只有 `accusation` 使用 32 秒 Remix；其余曲目直接新生成完整曲，不再假设可以 Extend。
- 所有环境声继续走 ambience 总线。BGM 内禁止烘焙雨声、车流、鸟叫、电话铃、纸张声和人声广播。
- 除标题曲外，BGM 的首要任务是托住中文对白。任何会让人停下来听旋律的 take，都不适合作为案内底垫。
- 曲 2 已验证：Describe 过长会让 Udio 把每条要求都变成一个音乐事件。剩余曲 7–9 继续使用短 Describe；工程规格不再塞进生成文本。

## 与代码一致的九个槽位

| 顺序 | Cue ID | 游戏用途 | 当前状态 | 本轮动作 |
| --- | --- | --- | --- | --- |
| 1 | `bgm.title-nightshift` | 首页、开播前序章 | **ready**：`title-neon-rain.ogg` | 已接入，不重生成 |
| 2 | `bgm.live-call` | 夜 A、普通直播连线 | **ready**：`music_2_2` 的 60 秒循环 | 已接入 |
| 3 | `bgm.pressure-stem` | 耐心偏低、追问压力 | **ready**：`music_2_1` 的 30 秒循环 | 已接入 |
| 4 | `bgm.offair-desk` | 挂断后、幕间、后台审材料 | **ready**：`music_4_3` 的 90 秒循环 | 已接入 |
| 5 | `bgm.day-investigation` | 白天走访、查材料 | **ready**：`music_5_2` 的 43.34 秒循环 | 已接入 |
| 6 | `bgm.callback-return` | 第二晚回拨与连续追问 | **ready**：`music_6_2` 的 90.35 秒循环 | 已接入完整夜 B |
| 7 | `bgm.accusation` | 最终追问 | **待生成 v2**；v1 两份均淘汰 | 用压力层做 32 秒减法 Remix |
| 8 | `bgm.recap-afterhours` | 单案回看、案间、下一通标题 | **待生成** | 新生成，使用克制四音型 |
| 9 | `bgm.epilogue-dawn` | 全部收麦、天亮前 | **待生成** | 新生成，复用同一四音型 |

旧表里的“材料板”归入 `offair-desk`；“sting 组”仍属于 SFX，不再占一个 BGM 槽位。旧表缺少的“最终追问”和“单案回看”已经补回。

## 实际 Udio 页面规则

每首曲先填写两个文本区：

1. 把曲目卡中的英文全文复制到 `Describe your song`。
2. 把紧随其后的否定词复制到 `Style Reduction`。

从 v2.3 起，投喂文本必须遵守以下上限：

- Describe 只写用途、核心音色、情绪和节奏行为，控制在 3–4 个短句、约 30–50 个英文词；短 Outro 可以更短。
- Style Reduction 只留会直接毁掉用途的 6–8 项，不再把所有不想要的东西列一遍。
- `无缝循环、低通、响度、真峰值、淡入淡出、采样率、立体声宽度` 属于后期任务，交给 `scripts/process-bgm.js`，不写进 Describe。
- 不在同一段里同时规定几秒进乐器、每几小节变一次、具体频段和十余项禁止词。生成阶段只决定音乐，剪辑阶段再决定文件。

再按每首曲卡填写以下七项：BPM、Clip Timing、Song Length、Prompt Strength、Lyrics Strength、Clarity 和 Generation Quality。BPM 同时保留在 Describe 中，减少模型忽略控制值的概率。下载后仍需实测节拍；偏离目标超过约 3% 的结果直接淘汰，避免为对齐其他曲目做明显拉伸。

参数含义与本项目用法：

- Clip Timing 表示这段音乐处在假想完整歌曲中的位置。0% 更像开头，50% 更像中段，90% 更像尾段。循环底垫通常放在 40%-70%，避免自动生成明显前奏或收尾。
- Prompt Strength 越高越服从描述，但过高可能让音乐生硬。本项目从 65%-72% 起步。
- Lyrics Strength 对纯器乐统一设为 0% 或页面允许的最低值。
- Clarity 的官方公开文档没有给出固定甜点位。本项目的低值用于保留磁带和 Rhodes 的温度，白天与材料曲稍高，下面的百分比是首轮经验起点。
- Generation Quality 正式生产统一设为最高。不要先用低质量选 take 再期待高质量重生成能得到同一首。

除标题曲外，长曲使用 2:10；最终追问和独立 Outro 使用 0:32。压力层不再生成，直接从 `music_2_1.wav` 工程剪辑。每轮生成两个结果，保留原始 WAV。返工时只改一项参数或两个文本区中的一个短语。

下载 WAV，保持平台原始采样率与位深，不先转 MP3。若生成结果出现人声，把 `vocals, singing, humming, spoken word` 放到 Style Reduction 最前面重新生成。

如果两个结果仍然杂乱，不要继续加句子：保留两栏文本，只把 Prompt Strength 降低 8–10 个百分点再生成。若只是某一种乐器过强，只改对应的一个配器短语。

### 时长重新设计

Udio 的 32 秒 Remix 是局部改写结果，不是所有游戏曲目的目标长度。已有完整曲时保留完整母版。需要长时间播放的曲目直接生成 2:10，再由工程端按完整乐句裁运行时循环。

这里区分两个时长：

- 工作母版：保留足够段落供挑选、返工和后续派生，不直接放进游戏。
- 运行时循环：实际编码为 OGG 的稳定段，按整小节裁切，优先保证循环听不出接缝。

| Cue ID | 主要停留情形 | 工作母版目标 | 运行时交付目标 |
| --- | --- | --- | --- |
| `bgm.title-nightshift` | 标题页、开播前 | 已完成 2:22，不因 Remix 截成 32 秒 | 保留完整结构；另做循环版时不得破坏标题 motif |
| `bgm.live-call` | 每案最长的普通连线 | 新生成 2:10 | 24 小节，约 1:28-1:32 |
| `bgm.pressure-stem` | 一段追问或耐心下降 | `music_2_1.wav` 完整母版 | 程序直接裁成 30 秒循环 |
| `bgm.offair-desk` | 挂断后看材料、幕间行动 | 新生成 2:10 | 32 小节，约 1:36-1:44 |
| `bgm.day-investigation` | 多地点连续走访 | `music_5_2.wav` 完整母版 | 约 16 小节、43.34 秒稳定循环；不跨母版换段 |
| `bgm.callback-return` | 第二晚连续回拨 | 新生成 2:10 | 24 小节，约 1:28-1:32 |
| `bgm.accusation` | 最终选择与追问 | Remix 固定 32 秒 | 8 小节，约 29-31 秒 |
| `bgm.recap-afterhours` | 单案回看、案间衔接 | 新生成 2:10 | 32 小节，约 1:48-1:58 |
| `bgm.epilogue-dawn` | 全部收麦后的阅读段 | 新生成 2:10 | 24 小节，约 1:34-1:38；Outro 另生成 20-35 秒 |

### 参数总表

| Cue ID | BPM | Clip Timing | Song Length | Prompt Strength | Lyrics Strength | Clarity | Generation Quality |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| `bgm.live-call` | 64 | 50% | 2:10 | 66% | 0% | 24% | Highest |
| `bgm.pressure-stem` | — | — | 不生成 | — | — | — | 直接剪辑 `music_2_1` |
| `bgm.offair-desk` | 76 | 45% | 2:10 | 70% | 0% | 34% | Highest |
| `bgm.day-investigation` | 88 | 40% | 2:10 | 66% | 0% | 40% | Highest |
| `bgm.callback-return` | 64 | 55% | 2:10 | 72% | 0% | 28% | Highest |
| `bgm.accusation` | 64 | 60% | 0:32 | 58% | 0% | 24% | Highest |
| `bgm.recap-afterhours` | 68 | 65% | 2:10 | 68% | 0% | 30% | Highest |
| `bgm.epilogue-dawn` | 60 | 70% | 2:10 | 68% | 0% | 26% | Highest |
| `epilogue-dawn` 独立 Outro | 60 | 90% | 0:32 | 75% | 0% | 30% | Highest |

当前播放器换曲时，旧曲约 260ms 淡出，新曲从 0 秒开始约 320ms 淡入，不继承上一首的播放位置。`pressure-stem` 因此不需要复制 `live-call` 的文件长度；它需要一个没有起奏感、能从普通连线任意位置接入的开头。

### 32 秒 Remix 的正确用法

1. 当前只把 Remix 用在最终追问，不拿它代替普通连线或压力层。
2. 从正式压力层选和声、配器都稳定的区域做 Remix，原完整曲继续保留。
3. 工程端从 32 秒结果中裁一个完整的 8 小节循环。文件若带头尾空白或自动淡出，不能直接整段循环。
4. 如果 8 小节内已经明显重复，重新 Remix，不复制粘贴凑到一分钟。

### 标题曲的三个人工参考窗口

参考源：`assets/audio/source/bgm-title-neon-rain/20-master.wav`

| 名称 | 参考区间 | 主要用途 |
| --- | --- | --- |
| `REF-A / 音色底盘` | `00:08-00:40` | Rhodes、磁带质感、午夜节目声纹；避开主奏 |
| `REF-B / 标题 motif` | `00:47-01:19` | 小号主题和节目辨识度 |
| `REF-C / 柔和复述` | `01:24-01:56` | 回看、尾声所需的退后质感 |

这些区间只供制作时人工对照音色和 motif。当前页面没有可依赖的 Style Reference 参数，不把区间填写进 Udio。

### 全局声纹

```text
late-evening personal call-in livestream, intimate analog radio color, warm Rhodes electric piano, restrained low end, faint tape saturation and wow/flutter, slightly compressed broadcast texture, humane urban melancholy, close studio perspective, open center for Mandarin dialogue
```

“电台感”只用音色、动态和频宽表达。不要在每首里塞明显的调频扫频、静电爆点或电话声；这些已经有独立 SFX 和 ambience。

### 全局否定项

每首的 Style Reduction 使用专属条目。以下内容是整理专属条目时的总词库，不需要再额外粘贴一遍：

```text
vocals, singing, humming, spoken word, radio announcer, phone ringing, notification sound, rain ambience, traffic ambience, birds, paper foley, cinematic trailer, epic orchestral, horror jump scare, EDM riser, EDM drop, trap hi-hats, glossy pop mastering, wall of sound
```

## 曲 1：标题曲 / 开播前

### 状态

不重生成。正式母版已经完成并接入：

- 成品：`assets/audio/bgm/title-neon-rain.ogg`
- 母版：`assets/audio/source/bgm-title-neon-rain/20-master.wav`
- 时长：2:22
- 响度：约 -16.7 LUFS，True Peak 约 -0.8 dBFS
- 原始 Udio 素材就是此前 Downloads 中的 `f7c4de55-efd3-40ed-ae5b-40118277323c.mp3`

### 原始基底 Prompt（留档）

```text
lo-fi noir, late night radio show theme, warm Rhodes electric piano, tape hiss, vinyl crackle, soft boom bap drums, deep sub bass, muted trumpet melody, radio static sweep intro, melancholic but warm, neon rain, 72 BPM, instrumental
```

### 现在的用途

不要继续重抽完整标题曲。制作其他曲目时人工对照 `REF-A / REF-B / REF-C`，用相同的 Rhodes、磁带质感、低频克制和近距离广播混音筛选结果。

## 曲 2：普通直播连线 `bgm.live-call`

生成方式：新生成，时长选择 2:10。工程目标是从成品中裁出约 1:30 的 24 小节循环。

### v1 实听结论

首版淘汰：音乐杂乱、各层不断抢着出现。原因是 Describe 同时规定了和弦间隔、低音频率、磁带细节、立体声、瞬态、频段、循环首尾和大量禁止项；Udio 把这些约束生成成了连续事件。v2 只降低约束密度，下面的参数保持不变。

### v2 两个候选的用途判定

- 原始文件：`assets/audio/unchanged/music_2_1.wav`、`assets/audio/unchanged/music_2_2.wav`，均保持原样，不在该目录做后处理。
- 人工听感：`music_2_1` 更紧张，`music_2_2` 更舒缓。
- `bgm.live-call` 需要先让玩家愿意听完来电，因此以 `music_2_2` 为首选；工程上它的人声敏感频段也更干净，中段约 43–103 秒相对稳定。
- `music_2_1` 直接作为曲 3 的原始母版。程序扫描后选取 11.903375–45.903375 秒作为 30 秒循环及 4 秒环形接缝的来源；该区间与曲 2 review 循环的和声轮廓相似度约为 0.93。仍需在游戏里听实际交叉淡化，但不再重新生成 Remix。
- 两首母版响度都约为 -14.3 至 -14.4 LUFS，明显高于对白底垫目标。定稿后再裁循环、处理接缝并归一到约 -20 LUFS；不要改写 `unchanged` 中的原始文件。

```text
BPM: 64
Clip Timing: 50%
Song Length: 2:10
Prompt Strength: 66%
Lyrics Strength: 0%
Clarity: 24%
Generation Quality: 100% / Highest
```

### Describe your song

```text
Minimal ambient jazz underscore for a late-night call-in show, instrumental, 64 BPM. Warm sustained Rhodes over soft rounded bass and faint analog tape texture. Sparse, patient, intimate and slightly uneasy, with open space for Mandarin dialogue. A simple steady two-chord loop.
```

### Style Reduction

```text
vocals, spoken word, drums, percussion, lead melody, solo, arpeggio, cinematic swell, dramatic intro, final cadence
```

### 选片标准

- 播放 30 秒后，能感到房间有人，但记不住具体旋律。
- 和台词同时响时，不会让中文辅音变糊。
- 不能像“学习 lo-fi”；必须带一点没问完的轻微不安。
- 前后都没有明显开场和收尾，方便循环。

### 单变量返工

- 太抓耳：Describe 不动，只在 Style Reduction 增加 `memorable melody, melodic hook`。
- 仍然杂乱：两个文本区不动，只把 Prompt Strength 从 66% 降到 56%。
- 太空、像纯环境声：Style Reduction 不动，在 Describe 末尾增加 `A faint sustained analog pad under the Rhodes.`。
- 鼓点太明显：Describe 不动，Style Reduction 增加 `drum groove, rim click, percussion loop`。

## 曲 3：追问压力层 `bgm.pressure-stem`

曲 2 同一轮生成的两个结果已经自然形成一舒一紧：`music_2_2` 用于普通连麦，`music_2_1` 用于压力层。因此曲 3 不再占一次 Udio 生成或 Remix，直接交工程程序剪辑。

### 工程配方

```text
Recipe: pressure-stem-v2
Input: assets/audio/unchanged/music_2_1.wav
Start: 11.903375s
Runtime duration: 30s
Circular crossfade source: 4s
Target loudness: -20 LUFS
Output: assets/audio/bgm/pressure-stem.ogg
```

执行命令：

```text
npm run audio:bgm -- build pressure-stem-v2 --force
npm run audio:bgm -- verify pressure-stem-v2
```

当前工程验收结果为 30.0065 秒、-20.01 LUFS；循环端点跳变低于曲内普通采样变化，不存在程序可测的硬切爆点。

### 选片标准

- 从曲 2 交叉淡入 1 秒时，听不出换了曲，只觉得空气收紧。
- 不产生“马上归零”的倒计时误解。
- 不能比曲 2 快，也不能靠音量制造压力。

### 返工顺序

- 气氛合适但切入突兀：只调整配方的 `startSeconds` 或游戏交叉淡化，不重新生成音乐。
- 循环接缝可闻：只调整 `startSeconds` 和 `crossfadeSeconds`，继续使用原母版。
- 只有确认整首 `music_2_1` 都不适合压力段时，才恢复 Udio Remix 方案。

## 曲 4：收麦调查台 `bgm.offair-desk`

用于挂断后、幕间行动和后台看材料。它要让玩家感觉“手开始动了”，但不能变成传统侦探片。

生成方式：新生成，时长选择 2:10。工程目标是从成品中裁出约 1:41 的 32 小节循环。

### v1 A/B 诊断

- 原始文件：`assets/audio/unchanged/music_4_1.wav`、`music_4_2.wav`。
- 人工听感：`music_4_1` 稍好；`music_4_2` 混乱，不能使用。
- 工程复核：`music_4_1` 的响度范围约 3.8 LU；`music_4_2` 达到约 21.9 LU，并从极弱持续堆到很响。失败点是整曲不断发展、换层和抬升，不是简单的中频过满。
- v2 只改 Describe。参数与 Style Reduction 原样保留，避免无法判断是哪项调整起作用。

### v2 A/B 结论

- `music_4_3.wav` 与 `music_4_4.wav` 都明显改善，保留了 late-night 的慵懒感，宏观响度范围分别约为 3.2 LU 和 2.9 LU。
- `music_4_4` 的重复脉冲更明确，长时间播放更容易被听成一首 groove；`music_4_3` 的脉冲较弱，更适合边看材料边听，因此定为首选。
- Prompt 与七项参数在本轮冻结，不再为了追求“更侦探”继续增加描述。`music_4_4` 只作为备用母版保留。

### 工程配方

```text
Recipe: offair-desk-v2
Input: assets/audio/unchanged/music_4_3.wav
Start: 11.508s
Runtime duration: 90s
Circular crossfade source: 4s
Target loudness: -20 LUFS
Output: assets/audio/bgm/offair-desk.ogg
```

当前工程结果为 90.0065 秒、-20.00 LUFS；循环两端半秒能量差约 0.41 dB，接缝检测通过。

```text
BPM: 76
Clip Timing: 45%
Song Length: 2:10
Prompt Strength: 70%
Lyrics Strength: 0%
Clarity: 34%
Generation Quality: 100% / Highest
```

### Describe your song

```text
Low-key late-night desk-work jazz bed, instrumental, 76 BPM. Dry warm Rhodes and rounded bass with a faint repeating two-note guitar figure. Focused, steady and unobtrusive, keeping the same small texture throughout.
```

### Style Reduction

```text
vocals, detective pizzicato, spy music, funk, lead solo, ticking clock, sound effects, cinematic reveal
```

### 选片标准

- 比普通连线更有行动感，但玩家仍能长时间看表格。
- 不能出现“福尔摩斯”“潜行游戏”或“办公室效率歌单”的味道。
- 任何类似纸张、键盘的生成拟音都淘汰，避免与真实 SFX 混淆。

### 单变量返工

- 当前不返工 Prompt。先在后台材料、幕间行动和长表格阅读三个实际页面试听 `music_4_3` review。
- 若只在游戏里显得太困：其余不动，把配方切到 `music_4_4` 做等响度 A/B，不重新生成。
- 只有 `music_4_3` 与 `music_4_4` 都不能托住操作时，才恢复文本返工。

## 曲 5：白天调查 `bgm.day-investigation`

这首同时覆盖咖啡厅、办公室、工作室、街上、住宅楼和茶馆，因此不得把任何具体地点的环境声烘焙进音乐。

生成方式：新生成，时长选择 2:10。首轮母版存在明显换段，工程端不再硬凑 40 小节，而是优先保留换段前约 16 小节的稳定循环。

### v1 A/B 结论

- 原始文件：`assets/audio/unchanged/music_5_1.wav`、`music_5_2.wav`。
- 人工听感：`music_5_2` 优于 `music_5_1`，定为首选。
- 工程复核：`music_5_1` 的主要脉冲接近 60 BPM，偏离目标太大；`music_5_2` 约为 88.6 BPM，符合白天走访的推进速度，而且整体动态更稳定、立体声更开。
- `music_5_2` 中段仍有明显换层，因此不把整首强行变成一个长循环。Prompt 与七项参数冻结，不再重生。

### 工程配方

```text
Recipe: day-investigation-v1
Input: assets/audio/unchanged/music_5_2.wav
Start: 12.673s
Runtime duration: 43.34s
Circular crossfade source: 4s
Target loudness: -20 LUFS
Output: assets/audio/bgm/day-investigation.ogg
```

当前工程结果为 43.3465 秒、-20.00 LUFS；接缝端点约 -73.7 dBFS，循环两侧半秒能量差约 0.94 dB，自动验收通过。

```text
BPM: 88
Clip Timing: 40%
Song Length: 2:10
Prompt Strength: 66%
Lyrics Strength: 0%
Clarity: 40%
Generation Quality: 100% / Highest
```

### Describe your song

```text
Understated daytime urban investigation cue, instrumental, 88 BPM. Soft Wurlitzer, restrained clean guitar, warm bass and light brushed drums. Tired but alert, bittersweet and gently moving forward, with no location ambience.
```

### Style Reduction

```text
vocals, glossy city pop, funk, saxophone solo, guitar solo, commercial jingle, field recording, dramatic modulation
```

### 选片标准

- 一听能和夜间场景区分，但仍像同一个游戏。
- 在咖啡厅和办公室都成立，不偏向某个具体地点。
- 有步行推进感，但不能让读材料变得急。

### 返工边界

- 当前不改 Prompt。先在咖啡厅、办公室和街道三种页面连续试听 `music_5_2` review。
- 若 43 秒循环感太明显：优先从同一母版另找稳定乐句做第二循环，不跨过明显换段，也不复制粘贴凑长度。
- `music_5_1` 只作备用素材，不作为白天调查正式候选。

## 曲 6：第二晚回拨 `bgm.callback-return`

它需要让玩家立刻感到“还是那通电话，但人已经带着白天查到的东西回来”。

生成方式：新生成，时长选择 2:10。当前页面不能依赖 Style Blend，因此用与曲 2 完全相同的 64 BPM、Rhodes、两和弦和广播混音描述维持家族感。工程目标是裁出约 1:30 的 24 小节循环。

### v1 A/B 结论

- 原始文件：`assets/audio/unchanged/music_6_1.wav`、`music_6_2.wav`。
- 人工听感：`music_6_1` 偏阴间、灵异，方向错误；`music_6_2` 更慵懒，定为首选。
- 工程复核：`music_6_1` 前半极弱、后半大幅抬升，频谱与能量持续变形，淘汰。`music_6_2` 主要脉冲约 63.75 BPM、响度范围约 1.9 LU，低频占比约 60%，明显重于普通连麦的约 33%，所以“慵懒”里仍有第二晚所需的重量。
- 曲 2 与曲 6 中间隔着白天调查，不在同一场景直接硬切；不为了追随曲 2 偏快的实际脉冲而拉伸 `music_6_2`。Prompt 与参数冻结。

### 工程配方

```text
Recipe: callback-return-v1
Input: assets/audio/unchanged/music_6_2.wav
Start: 6.9s
Runtime duration: 90.35s
Circular crossfade source: 4s
Target loudness: -20 LUFS
Output: assets/audio/bgm/callback-return.ogg
```

当前工程结果为 90.3565 秒、-19.99 LUFS；接缝端点约 -58.9 dBFS，循环两侧半秒能量差约 0.33 dB，自动验收通过。

```text
BPM: 64
Clip Timing: 55%
Song Length: 2:10
Prompt Strength: 72%
Lyrics Strength: 0%
Clarity: 28%
Generation Quality: 100% / Highest
```

### Describe your song

```text
Late-night callback underscore, instrumental, 64 BPM. Warm Rhodes and deep rounded bass over a patient two-chord cycle, heavier and more spacious than the first call. Intimate, unresolved and quietly burdened, with only a faint descending two-note echo.
```

### Style Reduction

```text
vocals, trumpet solo, drums, lead melody, heroic reprise, cinematic swell, sentimental strings, final cadence
```

### 选片标准

- 前 10 秒能认出和普通连线属于同一个节目，但不会抢来电人的第一句话。
- 比曲 2 更沉，但不是更响、更快。
- 小号只能是残句，出现长 solo 直接淘汰。

### 返工边界

- 当前不改 Prompt。先在四案夜 B 开场与连续追问中试听 `music_6_2` review。
- 若实机显得太松：优先调整游戏内 `callback-return` cue gain，或从同一母版后段另剪较重区域；不恢复 `music_6_1`。
- 只有 `music_6_2` 在全部夜 B 场景都缺乏重量时，才重新生成，并删除容易诱发灵异感的 `distant echo` 描述。

## 曲 7：最终追问 `bgm.accusation`

这是“把问题说完整”的音乐，不是法庭宣判，也不是反派揭晓。

生成方式：用曲 3 最稳定的区域做 Remix，输出 32 秒。工程目标是裁出约 30 秒的 8 小节循环。

Remix 源使用 `assets/audio/unchanged/music_2_1.wav` 的约 `00:11.9–00:43.9`。不要上传已经做过环形接缝的 `pressure-stem.ogg`，避免 Udio 把接缝也当成编曲特征。

### v1 A/B 诊断

- 已找到两个未按 `music_*` 命名的原始文件；按落盘时间记为 v1 A `971ea0f2-1825-44b9-a475-ed45435f8f0c.wav`、v1 B `63715782-9244-4b36-b0ca-c53fb611d675.wav`。两首均约 2:10，并非计划中的 32 秒交付。
- v1 A 的 6 kHz 以上能量约 16.63%，频谱质心 90 分位约 10.7 kHz，并出现满幅采样与 +4.69 dBTP 真峰值；它的“噪”主要是亮瞬态、毛刺和高频活动过多。
- v1 B 的高频不算突出，但整体达到 -12.69 LUFS，秒级能量跳变 95 分位约 8.06 dB；它的“乱”主要是织体太满、段落起伏太大。
- 对照压力母版 `music_2_1.wav`，两首都没有保住原曲的小织体：A 把频谱活动向上扩散，B 把能量和层次一起堆高。因此不能靠低通或压响度抢救，继续淘汰。
- v2 改用减法描述，并在 Style Reduction 直接禁止新乐器、强瞬态、噪声纹理和发展段。Prompt Strength 与 Clarity 同时下调，让 Remix 更依赖源曲而不是重新编曲。

```text
BPM: 64
Clip Timing: 60%
Song Length: 0:32
Prompt Strength: 58%
Lyrics Strength: 0%
Clarity: 24%
Generation Quality: 100% / Highest
```

### Describe your song

```text
Minimal instrumental remix for a final question. Keep the source tempo, harmony, Rhodes and bass. Use fewer notes, a darker softer mix and more empty space. Stay unresolved without building.
```

### Style Reduction

```text
vocals, percussion, bright transients, distortion, noisy texture, arpeggios, cinematic rise
```

### 选片标准

- 玩家会更认真，但不会误以为游戏已替他判案。
- 停在最终选项一分钟仍然能忍受，没有不断上升的 riser。
- 不能在末尾解决和弦，否则循环会像重复宣布结论。

### 单变量返工

- v2 仍有高频毛刺：其他不动，只把 Clarity 从 24% 降到 16%。
- v2 不噪但仍然太满：其他不动，只把 Prompt Strength 从 58% 降到 48%。
- v2 太像曲 3、差异不足：先接受，不额外加乐器；最终追问可以靠运行时音量、低通和场景切入方式完成区分。
- v2 再次同时出现噪与乱：停止 Udio 重抽，直接用工程程序从正式压力层派生较暗版本。

## 曲 8：单案回看 / 案间 `bgm.recap-afterhours`

这首既要收住上一案，又要能托住下一通标题，所以不能写成全剧大结局。

生成方式：新生成，时长选择 2:10。柔和四音型和收麦后的克制感直接写进描述。工程目标是裁出约 1:53 的 32 小节循环。

```text
BPM: 68
Clip Timing: 65%
Song Length: 2:10
Prompt Strength: 68%
Lyrics Strength: 0%
Clarity: 30%
Generation Quality: 100% / Highest
```

### Describe your song

```text
Reflective after-call underscore, instrumental, 68 BPM. Soft Rhodes and quiet rounded bass with a restrained four-note phrase appearing occasionally. Warm, clear-eyed and unresolved, with a small steady texture for reading.
```

### Style Reduction

```text
vocals, drums, lead solo, lush strings, music box, cinematic swell, final cadence
```

### 选片标准

- 能回味上一案，也能接下一通，不能有“今晚结束了”的封口感。
- 四音型只负责节目辨识度，不负责替剧情作总结。
- 结算文字较多，旋律密度必须明显低于标题曲。

## 曲 9：天亮前 / 全部收麦 `bgm.epilogue-dawn`

先做可循环的尾声底垫。可选的最终落点另做 Outro，不要把不可循环结尾焊死在主文件里。

生成方式：新生成，时长选择 2:10。工程目标是裁出约 1:36 的 24 小节循环。独立 Outro 作为另一首短曲单独生成，不使用 Extend。

```text
BPM: 60
Clip Timing: 70%
Song Length: 2:10
Prompt Strength: 68%
Lyrics Strength: 0%
Clarity: 26%
Generation Quality: 100% / Highest
```

### Describe your song（循环底垫）

```text
Pre-dawn epilogue underscore, instrumental, 60 BPM. Soft Rhodes, felt piano and a faint analog pad. Tired and gently warming, with long gaps and a small incomplete four-note phrase. Keep the texture sparse.
```

### Style Reduction

```text
vocals, birds, rain, music box, lullaby, lush strings, inspirational anthem
```

### 可选 Outro 的 Describe your song

循环底垫定稿后，另开一次新生成，目标 20-35 秒。若页面仍固定输出更长文件，只取前半分钟内自然结束的完整乐句：

```text
BPM: 60
Clip Timing: 90%
Song Length: 0:32
Prompt Strength: 75%
Lyrics Strength: 0%
Clarity: 30%
Generation Quality: 100% / Highest
```

```text
Short understated instrumental outro, 60 BPM, with felt piano and warm Rhodes. Play the four-note figure once, then settle on a warm slightly open chord and stop gently.
```

### 选片标准

- 温暖但不煽情，不像“治愈系片尾曲”。
- 不用鸟叫告诉玩家天亮了；画面和文字会完成这件事。
- 循环版和独立 Outro 必须分开交付。

## 剩余制作顺序

现在只剩三首，按依赖关系生成：

1. 曲 7 `accusation`：从已经接入的曲 3 稳定区间做 32 秒 Remix，只做减法。
2. 曲 8 `recap-afterhours`：新生成，先确定回看与尾声共用的克制四音型。
3. 曲 9 `epilogue-dawn`：新生成，复用曲 8 的四音型完成全局收束；可选 Outro 等循环版入选后再做。

## 每轮只记录这张表

```text
Cue ID:
Udio song URL / song name:
Mode: New generation / Remix
Remix source region:
Original full source:
Describe your song:
Style Reduction:
BPM:
Clip Timing:
Song Length:
Prompt Strength:
Lyrics Strength:
Clarity:
Generation Quality:
Runtime loop bars / target duration:
Take A:
Take B:
Take C:
Take D:
本轮只验证的变量:
入选 take:
淘汰原因:
下一轮只改一个变量:
是否下载 WAV:
```

## 工程交付要求

Udio 生成完成后先交原始 WAV，不要自行覆盖仓库中的 `.ogg`：

```text
assets/audio/source/bgm-live-call/
assets/audio/source/bgm-offair-desk/
assets/audio/source/bgm-day-investigation/
assets/audio/source/bgm-callback-return/
assets/audio/source/bgm-accusation/
assets/audio/source/bgm-recap-afterhours/
assets/audio/source/bgm-epilogue-dawn/
```

每个目录按实际产物保留以下层级，不存在的阶段可以跳号：

```text
01-original-full.wav
02-remix-32s.wav
10-working-master.wav
20-runtime-loop.wav
30-separate-outro.wav
```

`02-remix-32s.wav` 只用于最终追问。压力层直接使用 `assets/audio/unchanged/music_2_1.wav` 的配方输出。游戏最终只接工程验收后的运行时循环转码版本；完整母版继续保留，供返工和同族曲派生。

最终工程处理再统一完成：

- 裁掉 Udio 自动附带的头尾空白；
- 按乐句找循环点，不按文件长度硬切；
- 循环缝使用等功率交叉淡化并听节拍是否重拍；
- 低通约 15 kHz，处理生成伪影；
- 转 48 kHz OGG；
- 对话底垫以游戏内实听为准，不追求和标题曲一样响；
- 替换后跑 `npm run verify:audio`、浏览器回放和桌面回放。

## 本轮实际功能边界

- 每首曲卡包含 `Describe your song`、`Style Reduction` 和七项可调参数，按页面原名逐项列出。
- 新生成最长 2:10。长对白曲从这 2:10 中裁循环，不再规划超过上限的工作母版。
- Remix 输出按 32 秒处理，当前只承担最终追问短循环；压力层由程序直接剪辑。
- 当前页面没有的参数不进入执行单。返工一次只改一个滑杆值，或只改一个文本区中的一个短语。

官方说明：

- [Prompt Like a Master](https://help.udio.com/en/articles/10716541-prompt-like-a-master)
- [Two-Minute Model, New Controls, and More](https://www.udio.com/blog/two-minute-model-new-controls)
- [Remixing Your Music](https://help.udio.com/en/articles/10694179-remixing-your-music)
