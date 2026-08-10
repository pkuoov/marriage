# 语音与重点音效交付单

本单只处理会影响试玩理解或质感的声音，不把“所有 planned cue 都做完”误当发布条件。运行时真源仍是 `src/audioCatalog.js`，演员逐条录音合同是 `assets/audio/voice/recording-manifest.json`。

## 当前可直接进包

- 案 1 旧版灯架拖地拟音不再承担剧情线索，运行时已经撤下。设备是否买给咨询者由本人回答，不靠现场拖动物件证明。
- 案 2 吹风机回放保留可玩的系统声线母版，状态必须写作 `temporary-system-master`，不能对外称正式配音。
- 所有线索语音都保留玩家可见逐字稿；静音不会丢事实。

## 演员录音顺序

1. 案 2 吹风机回放：替换当前系统声线，混音时再叠吹风机，不让环境声盖住关键词。
2. 案 3 饭局停顿：重点不是把问句演重，而是问完后桌面真的空十到十二秒。
3. 案 4 垫款私聊：项目负责人应像在赶项目，不像预谋反派；不要使用主播林旭阳的声线。
4. 案 4 供应商补话：把“老规矩”说得普通，关键性由上下文产生。
5. 案 1 怕你离开、张法医停止收件：不阻塞当前试玩，可随同一录音批次补齐。开播使用现有平台提示音，不录制人声倒数。

## 收件流程

1. 演员交 48 kHz / 24-bit mono WAV 干声，每条前后各留约 500 ms room tone。
2. 按 manifest 的 `cueId`、`transcript`、`direction` 和 `editNotes` 审表演，不临场改词。
3. 剪辑、降噪和线路处理后转 48 kHz OGG，写入 manifest 的 `targetPath`。
4. 把该条 `status` 改成 `approved-actor-master`，并把 `src/audioCatalog.js` 对应 cue 改成 `readyVoice`。
5. 跑 `npm run verify:audio`、浏览器回放和桌面 smoke；确认静音、分轨、压低 BGM 与逐字稿仍成立。

未经过第 4、5 步的文件只能是试音，不得覆盖仓库母版。

## Amphion 内部试音

六条语音材料现已有一套可复现的 Amphion 试制清单和离线工具。它只用于内部 A/B，不改变上面的演员交付合同：

- `npm run audio:voice -- validate` 检查角色、台词、路径、上游 revision 和非商用边界；
- `npm run audio:voice -- prepare all` 把六段固定参考录音稿写进本地忽略目录，演员照稿录制同目录的 `reference.wav`；
- `npm run audio:voice -- plan <cue-id>` 给出该句的参考录音、固定 seed 和输出位置；
- `scripts/amphion-generate-voice.py` 在仓库外的 Linux/NVIDIA Amphion 环境生成原始 takes；
- `npm run audio:voice -- stage <cue-id> --input <take.wav>` 只写入被忽略的 review 目录，不会晋升正式母版。

官方 Vevo/MaskGCT checkpoint 当前带非商用限制，且克隆声线必须取得参考说话人的明确同意。完整安装、生成、试听和授权说明见 `docs/amphion-dialogue-voice-pipeline.md`。
