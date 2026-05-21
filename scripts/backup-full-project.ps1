# 整体项目备份（源码 + Doc 文档，排除 node_modules / dist / .git）
# 输出: ../backups/cncg-full-backup-v1.1.0-YYYYMMDD-HHMM.zip
param(
  [string]$Version = '1.1.0'
)

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $PSScriptRoot
$WorkspaceRoot = Split-Path -Parent $RepoRoot
$BackupRoot = Join-Path $WorkspaceRoot 'backups'
$Stamp = Get-Date -Format 'yyyyMMdd-HHmm'
$ArchiveName = "cncg-full-backup-v$Version-$Stamp.zip"
$ArchivePath = Join-Path $BackupRoot $ArchiveName

New-Item -ItemType Directory -Path $BackupRoot -Force | Out-Null

$TempDir = Join-Path $env:TEMP "cncg-backup-$Stamp"
if (Test-Path $TempDir) { Remove-Item -Recurse -Force $TempDir }
New-Item -ItemType Directory -Path $TempDir | Out-Null

# 复制生产仓库
$ProdDest = Join-Path $TempDir 'CNNG-Website-Production'
robocopy $RepoRoot $ProdDest /E /XD node_modules dist dist-ssr .git build backups `
  /XF *.zip *.rar *.tar.gz .env .env.local .env.*.local /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed: $LASTEXITCODE" }

# 复制同级 Doc 文档（若存在）
$DocSrc = Join-Path $WorkspaceRoot 'Doc'
if (Test-Path $DocSrc) {
  robocopy $DocSrc (Join-Path $TempDir 'Doc') /E /NFL /NDL /NJH /NJS /nc /ns /np | Out-Null
}

@{
  version   = $Version
  createdAt = (Get-Date).ToString('o')
  includes  = @('CNNG-Website-Production', 'Doc')
  excludes  = @('node_modules', 'dist', '.env*', 'build/*.zip')
  gitCommit = try {
    (git -C $RepoRoot rev-parse HEAD 2>$null)
  } catch { $null }
} | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $TempDir 'BACKUP_MANIFEST.json') -Encoding UTF8

if (Test-Path $ArchivePath) { Remove-Item -Force $ArchivePath }
Compress-Archive -Path (Join-Path $TempDir '*') -DestinationPath $ArchivePath -Force
Remove-Item -Recurse -Force $TempDir

Write-Host "Backup created: $ArchivePath" -ForegroundColor Green
Get-Item $ArchivePath | Select-Object Name, Length, LastWriteTime
