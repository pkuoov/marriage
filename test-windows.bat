@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo [QA] 未找到 npm，请安装项目要求的 Node.js 后重试。
  pause
  exit /b 1
)

echo [QA] 开始完整测试：内容、逻辑、剧情、浏览器流程、桌面 staging。
call npm test
if errorlevel 1 (
  echo.
  echo [QA] 测试失败。请保留本窗口并把首个报错发给开发组。
  pause
  exit /b 1
)

echo.
echo [QA] 全部自动化测试通过。
pause
