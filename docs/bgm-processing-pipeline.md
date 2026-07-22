# BGM 剪辑与母版处理程序

`scripts/process-bgm.js` 把 Udio 原始母版转换成可试听、可复现、可验证的游戏循环资产。原始文件只作为输入，程序不会覆盖 `assets/audio/unchanged/` 中的内容。

## 为什么需要配方

手工剪一次只能留下结果，不能留下决定。配方会明确记录：

- 从母版哪一秒开始；
- 最终循环多长；
- 首尾交叉淡化多长；
- 低通、响度、真峰值和输出编码；
- 候选输出与运行时正式输出分别放在哪里。

默认规格为 48 kHz 双声道、约 -20 LUFS、真峰值不高于 -1 dBTP、15 kHz 低通和 Ogg/Opus 160 kbps。单曲可以在 `assets/audio/bgm-production.json` 中覆盖这些值。

## 命令

```text
npm run audio:bgm -- list
npm run audio:bgm -- validate
npm run audio:bgm -- plan live-call-v2
npm run audio:bgm -- inspect assets/audio/unchanged/music_2_2.wav
npm run audio:bgm -- build live-call-v2
npm run audio:bgm -- verify live-call-v2
```

如果目标文件已经存在，程序会停止。确认需要替换时显式增加 `--force`：

```text
npm run audio:bgm -- build live-call-v2 --force
```

临时试跑可以覆盖输出和报告位置，不污染仓库：

```text
npm run audio:bgm -- build live-call-v2 \
  --output /tmp/live-call-v2.ogg \
  --report /tmp/live-call-v2-report.json \
  --force
```

## 循环处理方式

配方中的 `durationSeconds` 是最终输出时长。存在交叉淡化时，程序会多读取一段 `crossfadeSeconds`：保留主体，把母版末段与母版开头交叉淡化，再把接缝放在文件末尾。播放器从末尾回到开头时，回到的是母版中连续的下一采样位置，避免只在文件两端各加淡入淡出造成周期性“喘气”。

低通与其他音色滤镜会在分段之前作用于连续母版，保证循环开头和结尾继承同一滤波状态；不能在拼完循环后再让滤镜从文件开头重新起算。完成裁切后，程序执行两遍 EBU R128 loudnorm：第一遍测量，第二遍使用测量值生成母版。随后自动复核编码、采样率、声道、时长、综合响度、真峰值以及循环两端的能量差，并可保存 JSON 报告。

## 候选与正式资产

生成阶段遵守三层目录：

1. `assets/audio/unchanged/`：Udio 原始下载，只读保留；
2. `assets/audio/review/`：剪辑后的人工试听候选；
3. `assets/audio/bgm/`：通过对白混音和循环试听后才进入的正式运行时资产。

`review/` 与自动质检报告属于可重复生成的本地文件，默认不提交 Git；正式母版和它采用的配方才进入版本控制。

2026-07-22 已完成首轮晋升：`live-call-v2` 使用较舒缓的 `music_2_2.wav`；`pressure-stem-v2` 直接使用同轮生成、气氛更紧张的 `music_2_1.wav`；`offair-desk-v2` 使用稳定且脉冲较弱的 `music_4_3.wav`；`day-investigation-v1` 使用速度正确的 `music_5_2.wav`；`callback-return-v1` 使用稳定、低频更重的 `music_6_2.wav`。五个配方状态均为 `approved`，直接输出到 `assets/audio/bgm/`；以后更换入选 take 仍必须先出 review 试听，再改 approved 配方。

## Windows 注意事项

程序只调用 Node、ffmpeg 和 ffprobe，不依赖 bash、`say` 或 macOS 路径语法。Windows 制作机可以通过环境变量指定可执行文件：

```text
set FFMPEG_BIN=C:\tools\ffmpeg\bin\ffmpeg.exe
set FFPROBE_BIN=C:\tools\ffmpeg\bin\ffprobe.exe
npm run audio:bgm -- build live-call-v2
```

ffmpeg 是制作依赖，不进入游戏运行包。Windows 打包与玩家运行时不需要安装 ffmpeg。
