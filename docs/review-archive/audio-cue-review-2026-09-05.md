# 音乐节点与本轮测量 · 2026-09-05

本表由当前 audioScenePlan 与 catalog 计算；两幕音乐参数来自 testimonyWallScreens。原始测量保存在 output/repair-2026-09-05-stage5-9/audio-*.json。测量不能代替试听。

| 场景 | 设计 BGM | 当前实际 BGM | 当前环境底 |
| --- | --- | --- | --- |
| 标题／开场 | bgm.title-nightshift | bgm.title-nightshift | ambience.studio-room |
| 咖啡厅 | bgm.day-investigation | bgm.day-investigation | ambience.city-afternoon |
| 散场后 | bgm.offair-desk | bgm.offair-desk | ambience.studio-room |
| 普通连线／快案听述与追问 | bgm.live-call | bgm.live-call | ambience.studio-room |
| 连线材料 | bgm.live-call | bgm.live-call | ambience.studio-room |
| 低耐心连线 | bgm.pressure-stem | bgm.pressure-stem | ambience.studio-room |
| 第一幕证词墙 | bgm.live-call-allegro | bgm.live-call | ambience.studio-room |
| 第二幕证词墙 | bgm.pursuit | bgm.accusation | ambience.studio-room |
| 指认命中 | 静音 | 无 | ambience.studio-room |
| 收麦调查 | bgm.offair-desk | bgm.offair-desk | ambience.studio-room |
| 白天调查 | bgm.day-investigation | bgm.day-investigation | ambience.studio-room |
| 次晚回拨 | bgm.callback-return | bgm.callback-return | ambience.studio-room |
| 结案／快案复盘 | bgm.recap-afterhours | bgm.recap-afterhours | ambience.studio-room |
| 案间收播谈话 | bgm.recap-afterhours | bgm.recap-afterhours | ambience.studio-room |
| 八晚终局／数周后回告 | bgm.epilogue-dawn | bgm.recap-afterhours | ambience.studio-room |

指认命中停止 BGM，保留环境底，并触发合成的命中提示音；错误出示用独立失误提示。语音播放压低 BGM 与环境底，暂停释放压低，恢复再次压低。本轮保留 T03 的真实模块和浏览器音量回归。快案的 verdict 已切到收麦回看音乐。

## 八首现有循环重新测量

| 文件 | 时长（秒） | LUFS | 真峰值 dBTP | 首尾半秒 RMS 差 dB | 接缝跳变高于常规差分 dB |
| --- | ---: | ---: | ---: | ---: | ---: |
| accusation.ogg | 30.01 | -19.99 | -9.12 | 0.43 | -0.74 |
| callback-return.ogg | 90.36 | -19.99 | -5.42 | 0.33 | -15.61 |
| day-investigation.ogg | 43.35 | -20 | -6.62 | 0.94 | -27.50 |
| live-call.ogg | 60.01 | -20.01 | -6.49 | 0.45 | -7.21 |
| offair-desk.ogg | 90.01 | -20 | -6.71 | 0.41 | -9.16 |
| pressure-stem.ogg | 30.01 | -20.01 | -6.65 | 2.63 | -6.84 |
| recap-afterhours.ogg | 46.01 | -19.99 | -6.71 | 1.31 | 4.65 |
| title-neon-rain.ogg | 141.79 | -16.79 | -0.83 | 静音端点，不适用 | 静音端点，不适用 |

## 本轮候选版的回退决定

Allegro、pursuit、epilogue-dawn 继续保持 planned，未制作新母带。当前内部候选版分别使用 live-call、accusation、recap-afterhours：保证各场景有可用音乐，允许继续验证剧情和操作。第一幕的加速变化、专属追索旋律和尾声天亮主题尚未交付，不把回退当作三首新曲已完成。

饭局问句改由咨询者林录制，采用原场景逐字稿；职场私聊由采购经办同事说，catalog、录音 manifest、Amphion 任务与回放字幕已同步。五条真人录音仍未收到；Tony 的唯一系统声线继续明确标作 temporary-system-master，不作为正式配音放行。

## 尚需人工完成

- 每首连续播放两轮，耳机与外放分别记录接缝、对白可懂度、入拍与疲劳；默认音量和调低音量各听一次。当前没有真人试听记录，不写试听通过。
- 取得正式配音、说话人同意和发行使用记录后再替换母版。现有文件的技术可用状态不等于素材权利已经完成审查。
- 三支未交付 BGM 在发行前逐支选择正式制作或书面接受回退；不要把 catalog 改成 ready 来消除待办。

## 标题循环候选

现有标题文件在开头约 5.824 秒、末尾约 0.764 秒低于 −60 dB。首尾统计碰到数字静音时会产生极端分贝差，表中标为不适用，不能把原始报告的巨大负数当作接缝优秀。

已从现有 20-master.wav 制作独立循环候选，保留主体，去掉空档并用四秒交叠连接。配方 title-neon-rain-loop-review 可复现，产物未覆盖现有标题母版，未接入发行包。

候选实测时长 131.01 秒，响度 -16.81 LUFS，真峰值 -0.94 dBTP，首尾半秒 RMS 差 3.59 dB；工程接缝校验通过，乐句衔接仍待试听。

[标题循环候选](/Users/pkuiloveoov/code/love/assets/audio/review/title-neon-rain-loop-review.ogg) · [候选测量报告](/Users/pkuiloveoov/code/love/assets/audio/reports/title-neon-rain-loop-review.json)
