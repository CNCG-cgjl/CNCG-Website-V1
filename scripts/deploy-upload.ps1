# 本机上传发布 ZIP 到 VPS 并解压覆盖 dist（无 Actions Secrets 时的备用方案）
# 用法: .\scripts\deploy-upload.ps1 [-Server root@154.219.108.233] [-RemotePath /opt/cncg-website]
param(
  [string]$Server = $env:CNCG_DEPLOY_SERVER,
  [string]$RemotePath = '/opt/cncg-website'
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

if (-not $Server) {
  $Server = 'root@154.219.108.233'
  Write-Host "Tip: set CNCG_DEPLOY_SERVER or pass -Server" -ForegroundColor Yellow
}

$Zip = Get-ChildItem (Join-Path $ProjectRoot 'build\cncg-server-dist-*.zip') -ErrorAction SilentlyContinue |
  Sort-Object LastWriteTime -Descending |
  Select-Object -First 1

if (-not $Zip) {
  Write-Host 'No release zip found. Running release:pack...' -ForegroundColor Cyan
  npm run release:pack
  $Zip = Get-ChildItem (Join-Path $ProjectRoot 'build\cncg-server-dist-*.zip') | Sort-Object LastWriteTime -Descending | Select-Object -First 1
}

$RemoteZip = "$RemotePath/cncg-release.zip"
Write-Host "Upload: $($Zip.FullName) -> ${Server}:$RemoteZip"
scp $Zip.FullName "${Server}:${RemoteZip}"

$RemoteScript = @"
set -e
cd $RemotePath
mkdir -p dist backups
cp -a dist backups/dist-before-`$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
rm -rf dist/*
unzip -o $RemotePath/cncg-release.zip -d $RemotePath/dist/
nginx -t && systemctl reload nginx
echo 'Deploy OK:' \$(ls dist/index.html)
"@

ssh $Server $RemoteScript
Write-Host 'Server deploy finished.' -ForegroundColor Green
