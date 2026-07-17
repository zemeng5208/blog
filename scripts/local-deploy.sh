#!/usr/bin/env bash
# 本地生产部署（macOS / Linux）
# 用法：bash scripts/local-deploy.sh
# 可选：PORT=3000 SKIP_BUILD=1 bash scripts/local-deploy.sh

set -euo pipefail
cd "$(dirname "$0")/.."

PORT="${PORT:-3000}"
SKIP_BUILD="${SKIP_BUILD:-0}"

echo "==> 工作目录: $(pwd)"

if [[ ! -f package.json ]]; then
  echo "未找到 package.json" >&2
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "==> 安装依赖..."
  npm install
fi

if [[ "$SKIP_BUILD" != "1" ]]; then
  echo "==> 生产构建..."
  npm run build
  echo "==> 构建成功"
else
  echo "==> 跳过构建"
fi

echo "==> 启动生产服务: http://localhost:${PORT}"
echo "    按 Ctrl+C 停止"
PORT="$PORT" npm run start -- -p "$PORT"
