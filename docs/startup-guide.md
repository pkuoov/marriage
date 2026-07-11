# 启动说明

## 环境要求

- Node.js 22.12 或更高版本。
- npm（随 Node.js 安装）。
- Chrome、Edge 或其他现代浏览器。

在项目根目录确认环境：

```bash
node --version
npm --version
```

## 首次启动

首次拉取项目后，在项目根目录执行：

```bash
npm install
npm start
```

`npm start` 会完成以下操作：

- 从全新存档进入，避免旧测试进度影响结果。
- 优先使用 `5174` 端口；端口占用时自动寻找下一个可用端口。
- 自动打开默认浏览器。
- 监听源码、内容和样式改动，并自动刷新页面。

终端窗口必须保持运行。需要停止服务时，在终端按 `Ctrl+C`。

## 日常开发启动

通常只需：

```bash
npm start
```

如需保留浏览器中的现有进度：

```bash
npm run play
```

只启动服务、不自动打开浏览器：

```bash
npm run dev
```

指定起始端口：

```bash
npm run dev -- --port 5200
```

## 测试组启动

测试人员从全新进度开始时使用：

```bash
npm start
```

完整自动化测试使用：

```bash
npm test
```

快速检查内容、逻辑和剧情连续性：

```bash
npm run test:quick
```

完整测试包含内容校验、脚本语法、逻辑单测、剧情连续性、浏览器全流程和桌面 staging 烟测。详细手工验收项目见 [开发测试组验收入口](qa-test-guide.md)。

## Windows 双击启动

不熟悉命令行的 Windows 测试人员可以使用：

- 双击 `play-windows.bat`：构建并打开离线试玩版。
- 双击 `test-windows.bat`：运行完整自动化测试。

如果窗口提示找不到 npm，需要先安装符合版本要求的 Node.js，然后重新双击脚本。

## 离线试玩与桌面版

生成浏览器离线可玩版：

```bash
npm run build:playable
```

入口文件为：

```text
dist/playable/index.html
```

生成 Electron 桌面 staging：

```bash
npm run build:desktop
```

桌面 staging 输出到：

```text
dist/desktop-electron/
```

## 常见问题

### 页面仍显示旧进度

关闭当前服务后重新执行 `npm start`。该命令使用全新进度参数启动。

### 5174 端口被占用

无需处理，启动脚本会自动尝试后续端口，并在终端打印实际地址。

### 浏览器没有自动打开

复制终端输出的“从头试玩”地址，手动粘贴到浏览器。

### 修改后页面没有刷新

先确认启动服务的终端仍在运行，再手动刷新浏览器。若终端显示文件监听失败，重新执行 `npm start`。

### `npm test` 的浏览器阶段无法启动 Chrome

确认 Chrome 或 Playwright 浏览器可用。CI 或受限沙箱需要允许启动无头浏览器进程；这不是游戏依赖本地服务器。

### 如何报告启动问题

请提供操作系统、Node.js 版本、执行的命令、完整首个报错，以及终端打印的实际地址。
