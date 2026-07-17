# 本地生产部署脚本（Windows PowerShell）
# 用法：在项目根目录执行  .\scripts\local-deploy.ps1
# 可选：.\scripts\local-deploy.ps1 -Port 3000 -SkipBuild

param(
  [int]$Port = 3000,
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

Write-Host "==> 工作目录: $(Get-Location)" -ForegroundColor Cyan

if (-not (Test-Path "package.json")) {
  Write-Error "未找到 package.json，请在 grokdemo 项目中运行"
}

if (-not (Test-Path "node_modules")) {
  Write-Host "==> 安装依赖..." -ForegroundColor Cyan
  npm.cmd install
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if (-not $SkipBuild) {
  Write-Host "==> 生产构建 (npm run build)..." -ForegroundColor Cyan
  npm.cmd run build
  if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败" -ForegroundColor Red
    exit $LASTEXITCODE
  }
  Write-Host "==> 构建成功" -ForegroundColor Green
} else {
  Write-Host "==> 跳过构建（-SkipBuild）" -ForegroundColor Yellow
}

# 释放端口
$conns = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($conns) {
  $pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($procId in $pids) {
    if ($procId -and $procId -ne 0) {
      Write-Host "==> 释放端口 $Port (PID $procId)" -ForegroundColor Yellow
      Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
    }
  }
  Start-Sleep -Seconds 1
}

Write-Host "==> 启动生产服务: http://localhost:$Port" -ForegroundColor Cyan
Write-Host "    按 Ctrl+C 停止" -ForegroundColor DarkGray
$env:PORT = "$Port"
npm.cmd run start -- -p $Port
