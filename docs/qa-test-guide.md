# 开发测试组验收入口

## 一键启动

首次拉取项目后只需执行：

```bash
npm ci
npm start
```

以后启动只需 `npm start`。命令会自动寻找可用端口、清空旧进度并打开浏览器；修改源码或内容后页面自动刷新。

Windows 非开发测试人员可双击 `play-windows.bat`，脚本会在需要时自动构建离线版并打开。

## 一键测试

开发提交前执行：

```bash
npm test
```

Windows 也可双击 `test-windows.bat`。完整测试依次覆盖：

1. 内容索引、内容包结构和脚本语法。
2. 逻辑单测与剧情连续性。
3. 浏览器全部既有路线，包括隔夜、文档、键盘、手柄、逐句推进和 reduced-motion。
4. Electron 桌面 staging 构建与烟测。

只想快速检查内容和逻辑时执行 `npm run test:quick`。

## Windows EXE 验收

Windows 发布候选包还必须通过 `npm run package:win`、`npm run verify:win-package` 和真实打包运行时烟测。验收时应同时检查：

- EXE、SHA-256 文件、打包报告和运行时报告四项产物齐全。
- 禁止联网时仍能从 `file:` 打开标题页，并能完成文件存档的写入、读取、列出、导出和删除。
- `Get-AuthenticodeSignature` 的结果与发布标签一致；未签名包只能标记为内部测试版。
- 应用使用正式图标与元数据，没有 electron-builder 的默认图标、`author` 或 `description` 警告。
- 在干净 Windows 机器上手工复查 SmartScreen、音频设备、窗口状态和崩溃日志。

完整命令及 Steam/Steam Deck 外部发布门槛见 [Desktop and Steam Build Plan](desktop-steam-build-plan.md)。

## 手工完整过案

自动化通过后，从 `npm start` 打开的全新存档至少完成一次案 1 完整夜班：

- 打字中点击只补全当前句，再点击才推进；Space、Enter 行为一致。
- 句尾显示 `▼`；选项出现时自动模式停止。
- 打开和关闭案卷，检查材料、文档、收获、对话记录没有未播内容。
- 检查“先聊聊”、关键选择覆盖层、材料卡放大和返回主流程。
- 切换字速和自动模式，刷新页面后设置仍保留。
- 系统开启“减少动态效果”后重新进入：没有逐字打字、白闪或震动，仍能完成流程。

报告问题时附上：系统和浏览器版本、入口命令、案件/场景、操作步骤、预期结果、实际结果及截图。
