@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo ========================================
echo   Blog - 本地 Cloudflare 生产预览
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
  echo 正在安装依赖...
  call npm.cmd install --legacy-peer-deps
  if errorlevel 1 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
  )
)

if not exist ".dev.vars" (
  echo [提示] 缺少 .dev.vars，从 .env.example 生成模板...
  (
    for /f %%s in ('powershell -NoProfile -Command "$b=New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); -join ($b ^| ForEach-Object { $_.ToString(''x2'') })"') do echo POST_WRITE_SECRET=%%s
    echo NEXT_PUBLIC_SITE_URL=http://localhost:3000
  ) > .dev.vars
)

echo [1/4] 生产构建 vinext...
call npm.cmd run build
if errorlevel 1 (
  echo [错误] 构建失败
  pause
  exit /b 1
)

if not exist "dist\server\index.js" (
  echo [错误] 缺少 dist\server\index.js
  pause
  exit /b 1
)

copy /Y .dev.vars dist\server\.dev.vars >nul 2>&1

echo [2/4] 应用本地 D1 迁移（含种子）...
call npx.cmd wrangler d1 migrations apply blog --local --config dist/server/wrangler.json
if errorlevel 1 (
  echo [警告] 迁移可能已应用或失败，继续启动...
)

echo [3/4] 释放 3000 端口...
netstat -ano | findstr :3000 | findstr LISTENING >nul 2>&1
if not errorlevel 1 (
  echo [错误] 端口 3000 已被占用。请自行确认并关闭对应程序后重试。
  exit /b 1
)
timeout /t 1 /nobreak >nul

echo [4/4] 启动 wrangler 本地预览（D1 + R2）...
echo.
echo   打开浏览器访问: http://127.0.0.1:3000
echo   停止服务: 在本窗口按 Ctrl+C
echo ========================================
echo.

call npm.cmd run preview:cf

echo.
echo 服务已退出。
pause
