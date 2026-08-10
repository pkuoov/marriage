# Windows EXE 制作与验包手册

本项目当前生成的是 **Windows x64 便携版 EXE**，不是带安装向导的安装包。正式产物必须在原生 Windows 或 GitHub 的 Windows Runner 上生成；macOS 只能构建桌面 staging、运行浏览器与 Electron 烟测，不能把跨平台打出的文件当成正式 Windows 验收包。

## 产物与环境

- 系统：Windows 10 或 Windows 11，x64。
- Node.js：22.12.0 或更高的 22.x／更新版本。
- 安装方式：使用仓库锁定的 `npm ci`，不要手工升级 Electron 或 `electron-builder`。
- 当前目标：Electron portable x64。
- 输出目录：`dist\steam\`。

正常完成后应得到：

```text
dist\steam\LivestreamDetectiveDemo-0.1.0-x64.exe
dist\steam\LivestreamDetectiveDemo-0.1.0-x64.exe.sha256
dist\steam\windows-package-report.json
dist\steam\windows-runtime-smoke.json
```

文件名中的版本来自 `package.json`，以后修改版本号时会自动变化。

## 方案一：在原生 Windows 电脑制作

在仓库根目录打开 PowerShell。先确认拿到的是准备发布的干净提交：

```powershell
git status --short
git pull --ff-only
node --version
npm --version
```

`node --version` 必须不低于 `v22.12.0`。工作区如有未提交改动，先确认来源，不要用清理命令覆盖本机改动。

安装锁定依赖并完成源码验收：

```powershell
npm ci
npm run check
```

如果上一次打包留下了旧 EXE，确认其中没有需要保留的文件后再清理输出目录：

```powershell
if (Test-Path dist\steam) { Remove-Item dist\steam -Recurse -Force }
```

生成便携版 EXE，并检查文件名、体积、PE 文件头和 SHA-256：

```powershell
npm run package:win
npm run verify:win-package
```

不要绕过 `package:win` 直接执行 `electron-builder --win`。项目的入口会先确认当前系统确实是 Windows，也会拦截不满足要求的 Node 版本。

## 在正式 EXE 上运行自动烟测

普通 `smoke:desktop` 检查的是打包前 staging。正式交付前还必须实际启动刚生成的 EXE，验证离线标题页和文件存档桥：

```powershell
$exe = Get-ChildItem dist\steam\*.exe | Select-Object -First 1
$report = Join-Path (Resolve-Path dist\steam) "windows-runtime-smoke.json"
$process = Start-Process -FilePath $exe.FullName -ArgumentList "--release-smoke-report=$report" -Wait -PassThru
if ($process.ExitCode -ne 0) { throw "Windows runtime smoke failed: $($process.ExitCode)" }
npm run verify:win-runtime-smoke
```

这一步会验证：

1. EXE 从本地 `file:` 页面启动，不依赖 localhost 或开发服务器。
2. 标题页正常加载。
3. Electron preload 存档桥存在。
4. 临时存档可以写入、读取、列出、导出并删除。
5. 运行平台确实是 Windows x64。

## 方案二：使用 GitHub Windows 工作流

仓库已经提供 `.github/workflows/windows-package.yml`。它会在 `windows-latest` 上依次执行：

1. 安装 Node 22.12.0。
2. `npm ci`。
3. `npm run check`。
4. `npm run package:win`。
5. `npm run verify:win-package`。
6. 实际启动 EXE并生成 `windows-runtime-smoke.json`。
7. 上传经过验证的 EXE、校验和与两份报告。

使用方法：

1. 将已经通过本地测试的提交推送到远端。
2. 打开 GitHub 仓库的 **Actions**。
3. 选择 **Windows Portable Package**。
4. 点击 **Run workflow**，选择要制作的分支。
5. 工作流成功后下载 `LivestreamDetectiveDemo-windows-x64` artifact。

发布标签 `v*` 也会自动触发该工作流。不要在内容还没确认时为了打包随意创建正式版本标签。

## 下载后核对 SHA-256

在下载并解压 artifact 后执行：

```powershell
(Get-FileHash .\LivestreamDetectiveDemo-0.1.0-x64.exe -Algorithm SHA256).Hash.ToLower()
Get-Content .\LivestreamDetectiveDemo-0.1.0-x64.exe.sha256
```

两处哈希必须完全一致。`windows-package-report.json` 里的 `sha256` 也应相同。

## Windows 实机手工验收

自动报告通过以后，还要在一台普通 Windows 电脑上检查：

1. 断网启动 EXE，确认不会弹出 localhost、命令行窗口或开发服务器。
2. 新开一局，完成标题页、快案选择和主案第一段连线。
3. 退出再打开，确认能够继续上次进度。
4. 检查 BGM、音效、音量分路和静音状态。
5. 用键盘完成一段追问，检查焦点框与返回上次追问。
6. 切换全屏和缩放，重启后窗口仍可操作。
7. 接入实际手柄，检查方向键／左摇杆、A、B等主要操作。
8. 记录 SmartScreen 提示。当前如果没有代码签名，Windows 可能显示未知发布者；这不是程序崩溃，但公开发行前必须决定签名方案。

## 常见失败

### 在 Mac 上执行 `npm run package:win` 被拒绝

这是有意设置的保护，不是打包脚本故障。Mac 可以运行：

```bash
npm run build:desktop
npm run smoke:desktop
npm run steam:preflight
```

正式 EXE 转到原生 Windows 或 GitHub Windows 工作流制作。

### Node 版本过低

Electron 43 的打包环境要求 Node 22.12 或更高版本。升级 Node 后删除旧的 `node_modules`，重新执行 `npm ci`。

### `verify:win-package` 报告不止一个 EXE

`dist\steam\` 混入了旧版本。确认旧产物不再需要后清空该目录，再重新执行打包和验证。

### EXE 能生成，但运行报告缺失

仅生成文件不算验收完成。必须按“在正式 EXE 上运行自动烟测”启动一次隐藏验收入口，并执行 `npm run verify:win-runtime-smoke`。

### SmartScreen 阻止启动

内部测试可以记录提示并由测试人员确认文件哈希后继续；面向公众发布时应使用 Windows 代码签名证书，或明确接受未签名便携版的分发风险。

## 当前边界

- 当前产物是 portable EXE，不是 NSIS／MSI 安装器。
- 自动烟测不替代真实声卡、手柄、休眠恢复、Steam Overlay和SmartScreen测试。
- Steam App ID、Depot、Cloud映射和代码签名仍属于正式发行配置。
- 如果以后改成安装器，必须新增安装、卸载、覆盖升级和用户存档保留测试，不能直接把 portable 配置改名为安装包。

更完整的Steam发行边界见[桌面与 Steam 构建计划](desktop-steam-build-plan.md)。
