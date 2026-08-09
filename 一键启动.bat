@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo ========================================
echo   Blog - 一键启动
echo   目录: %cd%
echo ========================================
echo.

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [错误] 未找到 npm，请先安装 Node.js
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo [1/3] 首次运行，正在安装依赖...
  call npm.cmd install
  if errorlevel 1 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
  )
) else (
  echo [1/3] 依赖已存在，跳过安装
)

echo [2/3] 释放 3000 端口（若被占用）...
netstat -ano | findstr :3000 | findstr LISTENING >nul 2>&1
if not errorlevel 1 (
  echo [错误] 端口 3000 已被占用。请自行确认并关闭对应程序后重试。
  exit /b 1
)
timeout /t 1 /nobreak >nul

echo [3/3] 启动开发服务器...
echo.
echo   打开浏览器访问: http://localhost:3000
echo   停止服务: 在本窗口按 Ctrl+C
echo ========================================
echo.

call npm.cmd run dev

echo.
echo 服务已退出。
pause
