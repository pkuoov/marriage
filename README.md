# 深夜热线：直播间侦探

> Steam 优先的章节式直播侦探游戏。玩家作为主持人，从匿名来电、材料和后续回拨中追问缺口，在证据边界内判断谁隐瞒了什么、成本最终落在谁身上。

当前版本为 `steam-demo-01` 试玩包。新成员先看 [启动说明](docs/startup-guide.md)，剧情修改从 [故事工程总入口](story.md) 开始，测试与验收见 [开发测试组验收入口](docs/qa-test-guide.md)。

## 当前试玩版

主线由四通匿名来电组成，顺序以内容包为准：

1. 失业、信用卡与借款认购。
2. 职场活动、审批截图与报销责任。
3. 学历收入、家庭资产与婚前条件。
4. 理发店名单、代投与资金去向。

每案沿着“夜间来电 → 收麦调查 → 白天取舍 → 夜间回拨 → 最终追问 → 单案回看”推进，四案还会回收同一条跨案资金线。标题页另有两通直播快案，用于短局判断和路线复盘。

游戏要求玩家区分“已经证明”“仍待核对”和“不能从现有材料推出”的内容。最终选择记录的是玩家的切入角度，不是覆盖前面推理的标准答案。本作关注撒谎、操控、失责与成本转嫁，不用性别或身份标签代替行为判断。

更完整的创作边界见 [游戏价值边界](docs/game-philosophy.md) 和 [直播案件包设计圣经](docs/weekly-livestream-design-bible.md)。

## 快速开始

环境要求：Node.js 22.12 或更高版本，以及随 Node.js 安装的 npm。

首次拉取：

```bash
npm ci
npm start
```

以后日常启动只需 `npm start`。它会从全新进度打开浏览器，并在源码或内容变化后自动刷新。

Windows 非开发测试人员也可以直接双击：

- `play-windows.bat`：构建并打开离线试玩版。
- `test-windows.bat`：运行完整自动化测试。

其他启动方式和常见问题见 [启动说明](docs/startup-guide.md)。

## 测试

```bash
# 内容索引、逻辑单测和剧情连续性
npm run test:quick

# 提交前检查，并回放浏览器完整流程
npm run test:pr

# 完整检查：追加桌面 staging 烟测
npm test
```

修改 `content/`、`src/ui/`、`src/app.js`、反制拍或场景流程后，提交前必须运行 `npm run test:pr`。涉及 Electron、桌面打包或发行流程时运行 `npm test`，并按 Windows 手册补正式 EXE 验证。

## 构建

| 目标 | 命令 | 输出 |
| --- | --- | --- |
| 静态 H5 | `npm run build:h5` | `dist/` |
| 单页离线试玩 | `npm run build:playable` | `dist/playable/` |
| Electron 桌面 staging | `npm run build:desktop` | `dist/desktop-electron/` |
| Windows x64 便携版 | `npm run package:win` | `dist/steam/*.exe` |

Windows 产物生成后先核对文件头和 SHA-256：

```bash
npm run verify:win-package
```

然后必须实际启动 EXE 生成运行报告，再执行 `npm run verify:win-runtime-smoke`。正式 EXE 只能在原生 Windows 或 GitHub Windows Runner 上验收。当前打包流程使用项目图标、文件存档桥、SHA-256 报告和打包后运行时烟测；启动参数与完整步骤见 [Windows EXE 制作与验包手册](docs/windows-exe-build-guide.md)。`dist/` 是本地构建输出，不提交到 Git。

## 内容与代码真源

```text
content/packs/steam-demo-01/   玩家可见的四案内容与内容包清单
content/characters/            运行时角色、知识边界与声纹真源
src/runtime/                   状态写入、结算和运行时规则
src/ui/screens/                完整屏幕与场景渲染器
src/generated/                 由内容脚本生成的运行时索引
desktop/                       Electron 主进程、preload 与打包配置
scripts/                       构建、校验、烟测和内容生成脚本
story.md                       故事工程总入口
characters/ scenes/ plot/      人物、场景和剧情结构投影
continuity/                    跨案状态与伏笔投影
docs/                          现行设计、制作、测试和发行文档
```

玩家可见台词和事实必须修改案件 JSON，不要直接修改 `docs/generated/` 或另建台词副本。内容修改后运行：

```bash
npm run content:index
npm run content:script
npm run check
```

新增完整屏幕放在 `src/ui/screens/`，通过 `create*Screens(ctx)` 接收能力，并在使用时读取当前状态；不要把新屏幕重新堆回 `src/app.js`，也不要从屏幕模块反向导入 `app.js`。

## 当前发行边界

代码、浏览器离线包、Electron 桌面壳和 Windows 便携版流水线已经接通。正式发行前仍需要：

- 真人盲测与真人定向录音。
- 补齐 `epilogue-dawn` BGM，并在真实声卡上完成混音验收。
- Windows 干净机器、Steam Deck／控制器和手机实机测试。
- Steamworks App ID、Depot、Cloud、Overlay、Input 与签名决策。

当前阶段不凭主观感觉继续扩写四案，也不新增第二套压力或失败经济。最新状态只以 [版本路线](docs/roadmap.md) 和 [未完成项目清单](docs/unfinished-backlog.md) 为准。

## 文档入口

- [文档总目录](docs/README.md)
- [内容包开发管线](docs/story-pack-development-pipeline.md)
- [内容包 Schema](docs/content-pack-schema.md)
- [音频录制交接单](docs/audio-recording-handoff.md)
- [Amphion 对话语音管线](docs/amphion-dialogue-voice-pipeline.md)
- [Windows Amphion 交接单](docs/windows-amphion-voice-handoff.md)
- [桌面与 Steam 构建计划](docs/desktop-steam-build-plan.md)
- [Windows EXE 制作与验包手册](docs/windows-exe-build-guide.md)

## 内容声明

本作是虚构游戏，不提供法律、心理、婚恋、职场或消费维权结论。案例会参考常见公共讨论并进行抽象、改写和混合，不对应任何单一真实人物或具体案件。游戏里的重试是用于练习观察、沟通和止损的机制，不表示现实选择可以重来。
