# Backend startup script
# For starting ModuChat backend server

Write-Host "Starting ModuChat backend server..." -ForegroundColor Green

# Change to backend directory
cd backend

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Cyan
if (Test-Path ".\venv\Scripts\Activate.ps1") {
    .\venv\Scripts\Activate.ps1
    Write-Host "Virtual environment activated" -ForegroundColor Green
} else {
    Write-Host "Virtual environment not found" -ForegroundColor Red
    exit 1
}

# Start backend server
Write-Host "Starting FastAPI server..." -ForegroundColor Cyan
Write-Host "Server will run at http://localhost:5173" -ForegroundColor Yellow
python main.py
