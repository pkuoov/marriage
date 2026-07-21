# 语音与重点音效交付单

本单只处理会影响试玩理解或质感的声音，不把“所有 planned cue 都做完”误当发布条件。运行时真源仍是 `src/audioCatalog.js`，演员逐条录音合同是 `assets/audio/voice/recording-manifest.json`。

## 当前可直接进包

- 案 1 灯架拖地已完成原创拟音，目标文件为 `assets/audio/sfx/case1-lamp-drag.ogg`。它只证明“金属灯架确实在房里”，不替台词下结论。
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
