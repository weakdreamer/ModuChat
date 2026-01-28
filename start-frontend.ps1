# 前端启动脚本
# 用于启动ModuChat前端开发服务器

Write-Host "Starting ModuChat frontend server..." -ForegroundColor Green

# 切换到前端目录
Set-Location -Path ".\frontend"

# 检查是否安装了依赖
if (-Not (Test-Path ".\node_modules")) {
    Write-Host "Dependencies not found, installing..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Dependency installation failed, please check network or npm configuration." -ForegroundColor Red
        exit 1
    }
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
}

# 启动开发服务器
Write-Host "Starting Vite development server..." -ForegroundColor Cyan
npm run dev

# 检查启动是否成功
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend server failed to start, please check error messages." -ForegroundColor Red
    exit 1
}
