#!/usr/bin/env bash
# 在 VPS 上切换 dist 软链（回滚/切换版本）
# 用法: ./server-switch-release.sh dist-024cd61
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/opt/cncg-website}"
RELEASE_NAME="${1:-}"

if [[ -z "$RELEASE_NAME" ]]; then
  echo "Usage: DEPLOY_PATH=/opt/cncg-website $0 dist-<sha7>"
  echo "Available:"
  ls -1 "$DEPLOY_PATH/releases" 2>/dev/null || true
  exit 1
fi

TARGET="$DEPLOY_PATH/releases/$RELEASE_NAME"
if [[ ! -d "$TARGET" ]]; then
  echo "Release not found: $TARGET"
  exit 1
fi

ln -sfn "$TARGET" "$DEPLOY_PATH/dist"
nginx -t
systemctl reload nginx
echo "Switched dist -> $TARGET"
