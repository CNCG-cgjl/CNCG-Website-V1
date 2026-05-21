# 本地开发：Vite 热更新 + 可选 API 代理说明
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

if (-not (Test-Path '.env.local') -and -not (Test-Path '.env')) {
  Write-Host 'Warning: no .env.local — Feishu /doc may be empty locally.' -ForegroundColor Yellow
  Write-Host 'Copy .env.example if present, or use production API via vite proxy.' -ForegroundColor Yellow
}

Write-Host 'Starting Vite dev server (HMR)...' -ForegroundColor Cyan
Write-Host '  http://localhost:5173/' -ForegroundColor Green
npm run dev
