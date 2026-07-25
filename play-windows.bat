@echo off
setlocal

set "ROOT=%~dp0"
set "PLAYABLE=%ROOT%dist\playable\index.html"

cd /d "%ROOT%"

if /I "%~1"=="--build" goto build
if exist "%PLAYABLE%" goto launch

:build
where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo [深夜热线：直播间侦探] 未找到 npm，且离线可玩包不存在。
  echo 请先安装 Node.js，或让开发者提供 dist\playable 目录。
  echo.
  pause
  exit /b 1
)

echo.
echo [深夜热线：直播间侦探] 正在生成离线可玩版...
call npm run build:playable
if errorlevel 1 (
  echo.
  echo [深夜热线：直播间侦探] 构建失败，请把上面的报错发给开发者。
  echo.
  pause
  exit /b 1
)

:launch
if not exist "%PLAYABLE%" (
  echo.
  echo [深夜热线：直播间侦探] 没找到 %PLAYABLE%
  echo.
  pause
  exit /b 1
)

echo.
echo [深夜热线：直播间侦探] 正在打开离线可玩版...
start "" "%PLAYABLE%"
exit /b 0
