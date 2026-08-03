# Windows GPT 交接单：Amphion 对话语音试制

> 把本文全文交给 Windows 端 GPT。本文只负责语音试制接力，不授权改变剧情、正式配音状态或商业发行许可。

## 给 Windows GPT 的任务

你正在 Windows 上接手《直播间侦探事务所》的 Amphion 对话语音内部试制。先读取仓库文件和当前状态，不要凭这份摘要重写已有工具。

仓库：`https://github.com/pkuoov/marriage.git`

分支：`codex/story-mode-review-fixes`

本批开始前的远端基线：`d7a59624`

Mac 端本批新增/修改的关键文件：

- `assets/audio/voice/amphion-production.json`
- `scripts/amphion-generate-voice.py`
- `scripts/process-dialogue-voice.js`
- `scripts/verify-audio-assets.js`
- `docs/amphion-dialogue-voice-pipeline.md`
- `docs/audio-recording-handoff.md`
- `docs/voice-reference-consent-template.md`
- `assets/audio/README.md`
- `package.json`

这些改动在编写本交接单时仍只存在于 Mac 工作区。如果拉取分支后找不到 `assets/audio/voice/amphion-production.json`，立即停止，不要自行重建；告诉用户“Mac 端语音流水线尚未提交/推送”。

## 不可越过的边界

1. Amphion 代码为 MIT，但清单中固定的官方 Vevo、MaskGCT checkpoint 带非商用限制。其生成物只能作为内部试听候选，不能作为 Steam 商业版正式配音。
2. 参考声线必须由说话人明确同意用于语音生成。不得使用明星、公众人物、影视/直播片段、陌生人语音或未经授权的演员样本。
3. 不得把参考 WAV、参考逐字稿、模型权重、原始 take、review 候选或报告提交 Git。它们分别位于已经忽略的 `assets/audio/source/`、`assets/audio/review/`、`assets/audio/reports/`。
4. 不得覆盖 `assets/audio/voice/*.ogg`，不得把 `src/audioCatalog.js` 的语音改成 ready，不得把 `recording-manifest.json` 改成 `approved-actor-master`。
5. 当前只处理六条关键“语音材料”，不是给约四百段主对话全量配音。全语音还缺顺序播放、跳过、自动推进和存档恢复设计。
6. 不要在没有 NVIDIA CUDA 的情况下假装完成生成；MPS 不是 Windows 路径，CPU 推理默认禁止。

## 一、同步并确认仓库

在 PowerShell 中执行：

```powershell
git clone https://github.com/pkuoov/marriage.git D:\work\love
Set-Location D:\work\love
git switch codex/story-mode-review-fixes
git pull --ff-only
Test-Path assets\audio\voice\amphion-production.json
git status --short
```

如果仓库已经存在，使用 `git fetch origin` 后切换并拉取该分支。不要覆盖 Windows 工作区里用户已有的未提交改动。

## 二、检查基础环境

```powershell
node --version
npm --version
python --version
git --version
where.exe ffmpeg
where.exe ffprobe
nvidia-smi
```

然后安装项目 Node 依赖并验证现有流水线：

```powershell
npm ci
npm run audio:voice -- validate
npm run verify:audio
```

FFmpeg/FFprobe 必须在 `PATH`。Python 应使用 Amphion 的独立 Conda 环境，不要把其大型依赖装进游戏项目。

## 三、重新生成本地参考录音稿

Mac 上生成的 `reference.txt` 被 Git 忽略，不会随仓库传过来。Windows 必须重新生成：

```powershell
npm run audio:voice -- prepare all
npm run audio:voice -- list
```

六套目录为：

| `speakerProfileId` | 本地 WAV 路径 |
|---|---|
| `case1-respondent` | `assets\audio\source\voice\references\case1-respondent\reference.wav` |
| `case2-tony` | `assets\audio\source\voice\references\case2-tony\reference.wav` |
| `case3-female-elder` | `assets\audio\source\voice\references\case3-female-elder\reference.wav` |
| `case4-colleague` | `assets\audio\source\voice\references\case4-colleague\reference.wav` |
| `case4-supplier` | `assets\audio\source\voice\references\case4-supplier\reference.wav` |
| `zhang-forensic` | `assets\audio\source\voice\references\zhang-forensic\reference.wav` |

每个演员必须原样朗读同目录的 `reference.txt`。WAV 要求：8–20 秒、48 kHz、mono、16/24/32-bit PCM、干声、无音乐/混响/电话滤波/吹风机声。参考同意记录使用 `docs/voice-reference-consent-template.md`，真实姓名和签字件保存在仓库外。

录音放好后再次运行：

```powershell
npm run audio:voice -- list
npm run audio:voice -- validate
```

只有显示 `reference-ready` 的角色可以进入生成。不要为了让检查变绿而伪造 WAV。

## 四、准备固定版本 Amphion

Amphion 必须在游戏仓库外单独克隆：

```powershell
git clone https://github.com/open-mmlab/Amphion.git D:\tools\Amphion
git -C D:\tools\Amphion checkout 26f6883110181f1dbfe95c70a7c7dbaf4de5f42a
git -C D:\tools\Amphion rev-parse HEAD
```

应输出：

```text
26f6883110181f1dbfe95c70a7c7dbaf4de5f42a
```

先阅读这个固定 revision 的官方安装说明和 `models/vc/vevo/infer_vevotts.py`，按其要求建立独立 Conda/CUDA 环境。不要改用 Amphion main 的最新依赖，也不要擅自升级生产清单中的模型 revision：

- Vevo：`amphion/Vevo@7edf4640c400c20542aa39c45b63f60e6c7baba0`
- MaskGCT 备选：`amphion/MaskGCT@265c6cef07625665d0c28d2faafb1415562379dc`

本批生成包装器只执行 Vevo-TTS。MaskGCT 只是清单中的备选，不要临时接入。

进入 Amphion Conda 环境后确认：

```powershell
python -c "import torch; print(torch.cuda.is_available()); print(torch.version.cuda); print(torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'NO CUDA')"
```

`torch.cuda.is_available()` 必须为 `True` 才开始正式批量生成。

## 五、先做单条 dry-run

优先验证案2托尼语音：

```powershell
python scripts\amphion-generate-voice.py --cue voice.case2.dryer-message --amphion-root D:\tools\Amphion --dry-run
```

dry-run 必须确认：

- 游戏仓库和 Amphion revision 正确；
- 参考 WAV 为 48 kHz mono PCM，时长 8–20 秒；
- `reference.txt` 与固定参考稿一致；
- 输出路径位于 `assets\audio\source\voice\amphion\`；
- 模型许可证和 `commercialReleaseAllowed: false` 没有被改变。

## 六、一次加载模型批量生成

确认所有已就绪参考都具有书面同意后执行：

```powershell
python scripts\amphion-generate-voice.py --all-ready --amphion-root D:\tools\Amphion --acknowledge-noncommercial-evaluation --confirm-reference-consent
```

工具应只加载一次 Vevo，再为每个 `reference-ready` 角色生成四个固定 seed：`7400`、`7401`、`7402`、`7403`。缺参考 WAV 的角色会跳过。不得删除这两个明确确认参数，也不得添加绕过 revision、许可证或参考同意检查的开关。

六条 cue 的优先顺序：

1. `voice.case2.dryer-message`
2. `voice.case3.dinner-pause`
3. `voice.case4.pad-message`
4. `voice.case4.supplier-message`
5. `voice.case1.loyalty-message`
6. `voice.advisor.zhang-closed`

## 七、人工选 take，再做候选后期

不要自动认定 `take-7400.wav` 最好。每条比较四个 take，先检查误读、吞字、音色漂移、金属尾音、双声和人物表演。选定后，例如案2：

```powershell
npm run audio:voice -- stage voice.case2.dryer-message --input assets\audio\source\voice\amphion\voice-case2-dryer-message\take-7400.wav
```

输出应进入：

- 候选：`assets\audio\review\voice\`
- 报告：`assets\audio\reports\voice\`

后期会输出 48 kHz mono OGG，约 -18 LUFS，true peak 不高于 -3 dBTP。案3会自动补 11 秒饭桌停顿。电话滤波、吹风机、杯碟和办公室环境都保持 `effectsDeferred`，先选表演，再另行混音。

## 八、最终校验与回报

```powershell
npm run audio:voice -- validate
npm run verify:audio
npm run check
git status --short
```

向用户汇报：

1. 实际使用的 GPU、CUDA、Python、PyTorch 和 Amphion revision。
2. 哪些角色 reference-ready，哪些被跳过。
3. 每条生成了哪些 seed、人工选中了哪一个及理由。
4. 是否存在误读或合成伪影；不要隐瞒失败 take。
5. review 候选和 JSON 报告的完整路径。
6. 明确重申这些文件是非商用内部试听候选，正式游戏母版没有被覆盖。

未经用户明确要求，不提交或推送任何参考录音、模型输出、review 文件或报告。
