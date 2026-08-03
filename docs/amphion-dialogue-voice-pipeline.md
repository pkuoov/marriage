# Amphion 对话语音内部试制流程

本流程用于给试玩版现有的六条“语音材料”做可比较的内部试音，不等于给约四百段主对话自动配音。主对话若要全语音化，还需要另做逐页顺序播放、跳过、自动推进和存档恢复；当前运行时在同一页连续触发两条 voice cue 时，后一条会停止前一条，不能直接批量铺满。

## 权利边界

截至 2026-08-03，本项目采用的 Amphion 代码版本为 MIT；清单所列官方 Vevo、MaskGCT checkpoint 均带非商用限制。由这些 checkpoint 生成的文件只能进入本地忽略目录 `assets/audio/source/` 和 `assets/audio/review/`，不能直接替换 `assets/audio/voice/` 中的游戏母版，也不能作为 Steam 商业版正式配音。

每个声线参考还必须由说话人明确同意用于语音生成。不得使用明星、公众人物、陌生人语音，或从影视、直播、短视频中截取的未授权表演。准备商业发布前，需要重新核对上游当时的许可证，并采用已取得商业授权的模型/服务或演员录音。

上游资料：

- [Amphion 代码仓库](https://github.com/open-mmlab/Amphion)
- [Vevo 模型页](https://huggingface.co/amphion/Vevo)
- [MaskGCT 模型页](https://huggingface.co/amphion/MaskGCT)

版本、许可证、人物声线和六条台词都固定在 `assets/audio/voice/amphion-production.json`。`npm run verify:audio` 会阻止清单把官方非商用 checkpoint 标成可发布资产。

## 为什么主用 Vevo-TTS

这些短句首先要求同一 NPC 的声音身份和说话习惯稳定。Vevo-TTS 可分别控制风格参考和音色参考，也支持中文；本批先让同一条已授权参考同时承担二者，减少变量。MaskGCT 暂时只作为时长控制实验的备选，不进入自动包装器。推理建议放在 Linux + NVIDIA CUDA 环境，Mac 只做清单、试听和 FFmpeg 后期。

## 一、准备已授权参考

每个角色准备一段 8–20 秒、安静环境下的 48 kHz mono WAV 干声。语气应接近角色，但不要直接朗读目标台词；停顿自然，不加混响、音乐、电话滤波或吹风机声。六段录音稿已经固定在生产清单中，先运行以下命令生成本地 `reference.txt`：

```bash
npm run audio:voice -- prepare all
```

演员必须原样朗读对应文本，不能临场改词。录完后把 `reference.wav` 放进同一目录；工具会同时检查录音稿是否仍与清单一致。

例如案2：

```text
assets/audio/source/voice/references/case2-tony/reference.wav
assets/audio/source/voice/references/case2-tony/reference.txt
```

这些目录已被 `.gitignore` 排除。不要把演员原始录音或同意文件提交到仓库；同意记录应参考 `docs/voice-reference-consent-template.md`，保存在项目受控的合同/制作档案中。

先检查六条任务：

```bash
npm run audio:voice -- validate
npm run audio:voice -- list
npm run audio:voice -- plan voice.case2.dryer-message
```

`list` 中显示 `reference-ready` 才能生成；缺 WAV、缺逐字稿和空逐字稿会分别显示。

## 二、在 Linux/NVIDIA 上生成

Amphion 放在游戏仓库之外，避免权重进入版本控制。必须使用清单钉住的代码 revision：

```bash
git clone https://github.com/open-mmlab/Amphion.git /opt/Amphion
git -C /opt/Amphion checkout 26f6883110181f1dbfe95c70a7c7dbaf4de5f42a
```

依照该 revision 的官方 Vevo 安装说明建立独立 Python/Conda 环境。先做不导入模型、不下载权重的检查：

```bash
python3 scripts/amphion-generate-voice.py \
  --cue voice.case2.dryer-message \
  --amphion-root /opt/Amphion \
  --dry-run
```

确认计划、参考录音权利和非商用边界后再生成：

```bash
python3 scripts/amphion-generate-voice.py \
  --cue voice.case2.dryer-message \
  --amphion-root /opt/Amphion \
  --acknowledge-noncommercial-evaluation \
  --confirm-reference-consent
```

工具会一次加载模型，按清单的四个固定 seed 输出 `take-7400.wav` 等文件。它会检查 Amphion checkout 和 Hugging Face snapshot 的完整 revision；没有 CUDA 时默认停止，只有显式传 `--allow-cpu` 才会尝试极慢的 CPU 推理。不要把 MPS 当作已验证路径。

多个角色都准备好后，用一次模型加载完成整个批次；缺少 `reference.wav` 的角色会被跳过：

```bash
python3 scripts/amphion-generate-voice.py \
  --all-ready \
  --amphion-root /opt/Amphion \
  --acknowledge-noncommercial-evaluation \
  --confirm-reference-consent
```

## 三、试听与候选后期

先比较原始 takes，选中后在 Mac 或 Linux 执行：

```bash
npm run audio:voice -- stage voice.case2.dryer-message \
  --input assets/audio/source/voice/amphion/voice-case2-dryer-message/take-7400.wav
```

后期工具会：

- 输出 48 kHz mono OGG Vorbis；
- 对话归一化到约 -18 LUFS，true peak 不高于 -3 dBTP；
- 按清单补最短头尾留白；案3问句后补 11 秒桌面停顿；
- 把试听文件放进 `assets/audio/review/voice/`，把探测和响度报告放进 `assets/audio/reports/voice/`；
- 拒绝把输出写进正式 `assets/audio/voice/` 路径。

电话滤波、吹风机、杯碟声等都标在 `effectsDeferred`，生成时不烘焙。先选表演，再混环境，避免噪声掩盖关键词或被误认作模型伪影。

## 四、人工验收

每条至少听四遍：耳机、笔记本扬声器、游戏内正常 BGM、游戏内静音字幕兜底。逐项判断：

1. 台词是否逐字正确，数字、专名、重音没有误读。
2. 是否符合 `recording-manifest.json` 的人物动机，而不是“播音腔”或反派自白。
3. 是否有音色漂移、吞字、金属尾音、双声、异常呼吸或背景复制。
4. 加电话/环境效果后，关键字是否仍一遍可听清。
5. 不播放语音时，屏幕逐字稿能否独立传递事实。

通过仅代表“内部候选可用”。正式母版仍按 `docs/audio-recording-handoff.md` 的收件流程处理；本工具有意不提供 promote 命令。

## 当前六条顺序

1. `voice.case2.dryer-message`：先与现有系统声线 A/B，比角色可信度；吹风机后混。
2. `voice.case3.dinner-pause`：验证普通问句加真实停顿是否成立。
3. `voice.case4.pad-message`：避免威胁腔，保持忙碌同事口吻。
4. `voice.case4.supplier-message`：一句话说普通，关键性留给上下文。
5. `voice.case1.loyalty-message`：解释后露怯，不演成自白。
6. `voice.advisor.zhang-closed`：短、快、边界明确。
