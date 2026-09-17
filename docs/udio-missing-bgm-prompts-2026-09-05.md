# Udio 缺曲补全：三首主方案与三个备选

最新状态（2026-09-06）：三个目录共五份原始素材已到位，三首完成工程选剪并接入，11 个 BGM 槽位均有可播放文件；听感签收仍待完成。选段、备选和与原提示词的差异见 [选剪记录](review-archive/bgm-selection-2026-09-06.md)。

以下保留 2026-09-05 的生成阶段记录，当时为 8 首已交付、3 首 planned；其中“现状回退”“待制作”和“尚无源文件”等描述仅指当时，不再代表当前目录状态。无需为了满足旧 Prompt 重新生成。

## 先确认交付条件

Udio 官方帮助页（2026-02-17 更新，本轮可读取）仍注明音频、视频和分轨下载已停用。会员额度可以用于站内创作，但不据此保证文件能够导出进游戏。以下提示词可用于试听选方向；正式交付仍需账户实际支持下载，并确认该次生成适用的游戏使用条款。[官方说明](https://help.udio.com/en/articles/12683565-changes-associated-with-the-universal-music-group-umg-partnership)。

生成界面选择 Instrumental。把下面英文贴进 Describe；如果当前界面提供 Style Reduction，再填写对应排除项。时长和强度以账户实际可见选项为准，不照抄旧制作单的固定百分比或假设所有账号都有 Remix / Styles。官方的简短提示结构、参考风格和 Remix 区分见：[提示组织](https://help.udio.com/en/articles/12232112-the-brick-method-making-udio-work-for-you)、[Styles](https://help.udio.com/en/articles/11003046-styles)、[Remix](https://help.udio.com/en/articles/10694179-remixing-your-music)。

保留现有 Rhodes、克制低频和近距离广播质感。新提示词不用雨、鸟、翻纸、电话、广播人声等场景声，这些由环境和音效轨承担。不要额外堆一长段“全局风格前缀”。

## 1. 第一幕证词墙 · `bgm.live-call-allegro`

现状回退：`bgm.live-call`。设计要求是普通连线同旋律、1.25 倍速并加鼓点。现有连线目标 64 BPM，因此本曲目标 80 BPM；Allegro 是槽位名，不按古典术语拉到 120 BPM。

### A：保留源曲的 Remix

仅在账号允许使用原 `live-call` 对应源曲作 Remix 时采用。选旋律、和声都稳定的一段，生成后实际对照。纯文字不能保证“同旋律”。

```text
Instrumental remix of the reference, 80 BPM. Preserve its Rhodes melody, two-chord harmony and warm rounded bass. Add a restrained dry drum pulse. Focused late-night investigation, compact repeating arrangement, steady energy from the first beat, ample space for dialogue.
```

Style Reduction：

```text
vocals, choir, new lead melody, drum fills, cymbal crashes, risers, drops, orchestral hits, rain, radio static
```

### B：只生成节奏层，再与原曲制作

若 Remix 改坏旋律，用此段做鼓点源。工程端从现有可用源曲保持音高变速到 1.25 倍，再对齐节奏层；不直接加快播放采样率，否则音高也会升高。鼓点源不能单独当作整首交付。

```text
Instrumental percussion-only loop, 80 BPM. One restrained dry brushed-drum groove with soft kick and closed snare, steady and understated. Constant pattern from the first beat, spacious late-night radio underscore, no fills or ending flourish.
```

Style Reduction：

```text
vocals, melody, piano, bass, pads, hi-hat rolls, cymbal crashes, drum solos, fills, reverb wash
```

选片：听得出与普通连线同源；节奏变紧但仍容许读材料。没有可用参考功能时，先留作待制作，不能拿一首风格相似的新歌标成“同旋律完成”。建议循环 48–72 秒，按完整小节裁切；进入时就有节拍，不留长前奏。

## 2. 第二幕证词墙 · `bgm.pursuit`

现状回退：`bgm.accusation`。这里是另一条事实线被追出来，音乐要比第一幕更有方向，但人物还在说话。工程要求 60–90 秒，无前奏，可紧接指认提示音。

### v2：按“普遍比较噪”的试听反馈重写

用户反馈：追索音乐多次生成都比较噪。当前追索目录没有对应原始文件，因此本轮不把问题断言为底噪、削波或某个频段超标。旧提示中的 `noir jazz`、`tense`、`bass pulse` 和备用版刷鼓，都可能让生成结果增加节奏和质感层；这是重写假设，需新一轮试听验证。

旧 A / B 停用。本轮先生成干净的独奏源，让短乐句带来推进。不要附加旧版全局前缀，也不要在主描述里补回追逐、悬疑、电影感或磁带质感。响度、循环和空间感在工程端处理。

### A：干净电钢琴独奏，84 BPM

```text
Clean solo electric piano instrumental, 84 BPM. A short three-note phrase repeats with small variations and clear gaps. Soft rounded attacks, short natural decay, middle register, dry close recording. Measured and attentive, the same small arrangement throughout.
```

Style Reduction：

```text
vocals, drums, percussion, bass, synth pads, distortion, tape hiss, vinyl crackle
```

### B：A 的电钢琴泛音仍刺耳时，换成柔和钢琴

```text
Soft solo felt piano instrumental, 84 BPM. A brief middle-register phrase returns at a measured pace, with a little space between each repetition. Gentle rounded notes, short decay and a clean close recording. Restrained and focused, with small melodic changes throughout.
```

Style Reduction：

```text
vocals, drums, percussion, bass, synth pads, distortion, tape hiss, vinyl crackle
```

先生成 A 一组。检查独奏是否保持到结尾、音符间是否有空隙、是否自行加入沙沙声或低频伴奏。若只是音量较大，先等响度对齐后再比较；若是层次拥挤或失真，不靠压低音量凑合。A / B 选一，不叠加。若干净但推进稍弱，先保留源文件，下一轮只调乐句间隔，不同时补鼓和贝斯。

无前奏、60–90 秒循环和接指认提示音仍是工程交付目标，不要求模型在主提示里一次完成；84 BPM 是本轮创作起点。音乐的变化靠重复乐句及和声制造，与第一幕的加鼓版区分。现有追索回退继续有效。

## 3. 天亮前 · `bgm.epilogue-dawn`

现状回退：`bgm.recap-afterhours`。用于八晚终局及数周后的回告。与单案复盘相比，和声可稍暖、稍开阔，保留事情尚未全好的余味。沿用复盘 v4 已验证的稀疏思路，避免旧尾声提示同时要求钢琴、Rhodes、Pad 后又长出固定脉冲。

### A：独奏 Rhodes，先做阅读循环

```text
Sparse free-time solo Rhodes instrumental for a pre-dawn epilogue. Warm open voicings and a small unhurried phrase, each note decaying into silence. Tired and gently hopeful, close and plain, with an even quiet texture for continued reading.
```

Style Reduction：

```text
vocals, choir, drums, percussion, bass groove, arpeggios, ostinato, strings, pads, dramatic climax, birds, rain
```

### B：A 与复盘过于相似时，换成毡音钢琴

```text
Sparse free-time solo felt-piano instrumental for an early-morning epilogue. Low warm open chords and a few soft upper notes, natural decay and long breathing spaces. Modest relief after a difficult night, intimate and unsentimental, an even texture for a reading scene.
```

Style Reduction：

```text
vocals, choir, drums, metronomic pulse, arpeggios, ostinato, strings, pads, sentimental ballad, grand finale, birds, street noise
```

选片：能感觉松了一口气，但不能像大团圆片尾。先找 60–90 秒音色和响度稳定的段落；自由速度不再强求 60 BPM / 24 小节。循环在音符自然衰减处人工拼接，提示词不保证无缝。独立结束尾音等循环版入选后再做，避免阅读未结束时音乐反复“谢幕”。

## 生成和入库顺序

1. 先每首 A 生成一组并记下候选链接。只有出现对应问题时才用 B，不必一次把六种全部抽满。
2. 先听 20 秒判断音色，再完整听是否加人声、突然起鼓、换段或抬高动态。Allegro 额外核对原旋律，pursuit 核对首拍。
3. 若可合法导出，保存原始最高质量文件、生成日期、完整 prompt、源曲 ID、模型/界面设置及适用条款。不要用压缩试听件冒充无损母版。
4. 按 `assets/audio/bgm-production.json` 的处理链做候选配方：48 kHz、目标约 -20 LUFS、真峰值不高于 -1 dBTP。交叠长度按乐句试听，不把默认 4 秒机械套进每个鼓点循环。
5. 连听两轮，再与案 2 / 案 4 对白合播，检查外放低音量下是否盖字、接缝是否吞拍。通过后才写正式路径并修改 catalog；本轮三个槽位仍保持 planned。

## 本轮收到的候选素材

- 第一幕：`assets/audio/source/bgm-live-call-allegro/late night 1.wav`、`late night 2.wav`。
- 天亮尾声：`assets/audio/source/bgm-epilogue-dawn/quiet dawn.wav`。

这两组先进入素材检查与试听候选制作，不继续要求重新生成。原始文件保留；收到候选不等于已确认 Allegro 与原连线同旋律，也不等于循环听感已经通过。

原始素材实测均为 48 kHz、双声道、16-bit PCM WAV：

| 原文件 | 时长 | LUFS | 真峰值 dBTP | 响度范围 LU |
| --- | ---: | ---: | ---: | ---: |
| late night 1.wav | 132.91 秒 | -13.02 | +0.28 | 3.0 |
| late night 2.wav | 131.41 秒 | -11.26 | +0.05 | 10.0 |
| quiet dawn.wav | 132.89 秒 | -16.37 | -0.68 | 7.9 |

第一幕 1 号整曲动态更稳定，可以先听；这不是旋律或表演质量的结论。两份第一幕原文件真峰值略高于 0 dBTP，不直接进包；真峰值超零也不能单独证明源文件已有可闻削波失真。三个文件开头半秒均为静音，原始首尾能量差不作为循环评价。

统一响度试听文件放在 `assets/audio/review/`：`live-call-allegro-take1-level-review.ogg`、`live-call-allegro-take2-level-review.ogg`、`epilogue-dawn-take1-level-review.ogg`。对应同名 JSON 测量报告在 `assets/audio/reports/`。这些是目标 -20 LUFS 的全曲试听版，保留前奏、结尾和原曲编排，没有将未试听确认的裁切点写成正式循环。

现有八首母版不因本单重新生成。标题循环和复盘 v4 的既有候选、冻结决定继续有效。
