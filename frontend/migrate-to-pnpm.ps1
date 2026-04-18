param(
  [switch]$Force
)

# migrate-to-pnpm.ps1
# Non-destructive migration script: migrate npm project to pnpm using global store.
# Default shows what will run. Add -Force to perform destructive steps (remove node_modules and package-lock.json).

function Has-Command([string]$Name) {
  return $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

Write-Host "Working directory: $(Get-Location)" -ForegroundColor Cyan

if (-not (Test-Path package.json)) {
  Write-Host "No package.json found in current directory. Run this script in project root." -ForegroundColor Red
  exit 1
}

if (-not (Has-Command pnpm)) {
  Write-Host "pnpm not found. Please install pnpm first (recommended):" -ForegroundColor Yellow
  Write-Host "  1) Using corepack (Node 16+):" -ForegroundColor Gray
  Write-Host "     corepack enable; corepack prepare pnpm@latest --activate" -ForegroundColor Gray
  Write-Host "  2) Or install via npm globally:" -ForegroundColor Gray
  Write-Host "     npm install -g pnpm" -ForegroundColor Gray
  Write-Host "After installing, re-run this script. This script will NOT modify system/user environment variables." -ForegroundColor Yellow
  exit 1
}

Write-Host "Detected pnpm, version: " -NoNewline -ForegroundColor Cyan
pnpm --version

Write-Host "`nMigration steps to be executed (preview):" -ForegroundColor Cyan
Write-Host "  1) Run 'pnpm import' to convert package-lock.json to pnpm-lock.yaml (if exists)." -ForegroundColor Gray
Write-Host "  2) Remove node_modules/ and package-lock.json (only when -Force is used)." -ForegroundColor Gray
Write-Host "  3) Run 'pnpm install' to use pnpm global store and generate pnpm-lock.yaml." -ForegroundColor Gray
Write-Host "  4) Optional: run 'pnpm store prune' to clean unreferenced packages." -ForegroundColor Gray

if (-not $Force) {
  Write-Host "`nPreview mode. To perform migration, re-run with -Force:" -ForegroundColor Yellow
  Write-Host "  .\migrate-to-pnpm.ps1 -Force" -ForegroundColor Gray
  exit 0
}

# Perform migration
Write-Host "`nPerforming migration (running with -Force)..." -ForegroundColor Green

if (Test-Path "package-lock.json") {
  Write-Host "Running: pnpm import" -ForegroundColor Gray
  pnpm import
}

if (Test-Path "node_modules") {
  Write-Host "Removing node_modules/..." -ForegroundColor Gray
  Remove-Item -LiteralPath .\node_modules -Recurse -Force -ErrorAction SilentlyContinue
}

if (Test-Path "package-lock.json") {
  Write-Host "Removing package-lock.json..." -ForegroundColor Gray
  Remove-Item -LiteralPath .\package-lock.json -Force -ErrorAction SilentlyContinue
}

Write-Host "Running: pnpm install" -ForegroundColor Gray
pnpm install

Write-Host "Migration complete. Please review and commit pnpm-lock.yaml and update docs to note pnpm usage." -ForegroundColor Green
Write-Host "Optional: run 'pnpm store prune' to clean up unreferenced packages." -ForegroundColor Yellow
