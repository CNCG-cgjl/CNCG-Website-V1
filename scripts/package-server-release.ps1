# CNCG 服务器静态发布包 — 安全打包脚本
# 原则：仅打包 dist/（构建产物），绝不包含密钥与源码
# 用法：在 CNNG-Website-Production 目录执行
#   powershell -ExecutionPolicy Bypass -File .\scripts\package-server-release.ps1

$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

$Stamp = Get-Date -Format 'yyyyMMdd-HHmm'
$ReleaseName = "cncg-server-dist-$Stamp"
$BuildRoot = Join-Path $ProjectRoot 'build'
$StageDir = Join-Path $BuildRoot $ReleaseName
$DistDir = Join-Path $ProjectRoot 'dist'

Write-Host '== CNCG server release packager ==' -ForegroundColor Cyan

# 1. 干净构建
if (Test-Path $DistDir) {
    Remove-Item -Recurse -Force $DistDir
}
Write-Host '[1/5] npm run build...'
npm run build | Out-Host
if (-not (Test-Path (Join-Path $DistDir 'index.html'))) {
    throw 'Build failed: dist/index.html missing'
}

# 2. 安全扫描 dist（禁止服务端密钥进包）
Write-Host '[2/5] scanning dist for forbidden secret patterns...'
# 仅匹配「真实密钥形态」，避免误报 FeishuTestPage 中的示例文案 "FEISHU_APP_SECRET=你的App Secret"
$ForbiddenPatterns = @(
    'SUPABASE_SERVICE_ROLE_KEY',
    '"role"\s*:\s*"service_role"',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+',
    'FEISHU_APP_SECRET=[A-Za-z0-9]{16,}',
    'ADMIN_REVIEW_TOKEN=[A-Za-z0-9_]{12,}',
    'QMSG_KEY=[a-f0-9]{16,}'
)
$Hits = @()
Get-ChildItem -Path $DistDir -Recurse -File | ForEach-Object {
    $content = Get-Content -LiteralPath $_.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { return }
    foreach ($pat in $ForbiddenPatterns) {
        if ($content -match $pat) {
            $Hits += [pscustomobject]@{ File = $_.FullName; Pattern = $pat }
        }
    }
}
if ($Hits.Count -gt 0) {
    $Hits | Format-Table -AutoSize
    throw 'SECURITY: forbidden secret pattern found in dist. Aborting package.'
}

# 3. 复制到 staging
Write-Host '[3/5] staging release files...'
if (Test-Path $StageDir) { Remove-Item -Recurse -Force $StageDir }
New-Item -ItemType Directory -Path $StageDir -Force | Out-Null
Copy-Item -Path (Join-Path $DistDir '*') -Destination $StageDir -Recurse -Force

# 4. 写入清单（不含任何密钥）
$FileList = Get-ChildItem -Path $StageDir -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($StageDir.Length + 1)
    $hash = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash.ToLower()
    [pscustomobject]@{ path = $rel; bytes = $_.Length; sha256 = $hash }
}
$VersionFile = Join-Path $ProjectRoot 'VERSION'
$AppVersion = if (Test-Path $VersionFile) { (Get-Content $VersionFile -Raw).Trim() } else { 'unknown' }

$Manifest = @{
    package     = $ReleaseName
    version     = $AppVersion
    builtAt     = (Get-Date).ToString('o')
    target      = 'nginx static root: /opt/cncg-website/dist/'
    apiBackend  = 'Vercel /api/* (nginx reverse proxy)'
    fileCount   = $FileList.Count
    files       = $FileList
}
$Manifest | ConvertTo-Json -Depth 5 | Set-Content -Path (Join-Path $StageDir 'RELEASE_MANIFEST.json') -Encoding UTF8

@'
CNCG 服务器静态发布包
=====================
解压后将所有文件放到: /opt/cncg-website/dist/

不要上传:
- .env.local / .env
- api/ src/ node_modules/ .git/

API 由 Vercel 提供，Nginx 需配置 /api/ 反代。
详见 build/SERVER_DEPLOY_AUDIT.md
'@ | Set-Content -Path (Join-Path $StageDir 'DEPLOY_README.txt') -Encoding UTF8

# 5. 压缩
Write-Host '[4/5] creating archives...'
if (-not (Test-Path $BuildRoot)) { New-Item -ItemType Directory -Path $BuildRoot | Out-Null }

$ZipPath = Join-Path $BuildRoot "$ReleaseName.zip"
if (Test-Path $ZipPath) { Remove-Item -Force $ZipPath }
Compress-Archive -Path (Join-Path $StageDir '*') -DestinationPath $ZipPath -Force

$RarPath = Join-Path $BuildRoot "$ReleaseName.rar"
$WinRar = @(
    "${env:ProgramFiles}\WinRAR\WinRAR.exe",
    "${env:ProgramFiles(x86)}\WinRAR\WinRAR.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($WinRar) {
    Write-Host '[5/5] creating RAR via WinRAR...'
    if (Test-Path $RarPath) { Remove-Item -Force $RarPath }
    & $WinRar a -r -ep1 $RarPath $StageDir | Out-Host
} else {
    Write-Host '[5/5] WinRAR not found — only ZIP created. Install WinRAR or unzip ZIP on server.' -ForegroundColor Yellow
}

Write-Host ''
Write-Host 'Done.' -ForegroundColor Green
Write-Host "  Staging: $StageDir"
Write-Host "  ZIP:     $ZipPath"
if (Test-Path $RarPath) { Write-Host "  RAR:     $RarPath" }
Write-Host "  Files:   $($FileList.Count)"
