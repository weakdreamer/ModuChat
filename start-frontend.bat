@echo off
REM ModuChat Frontend Startup Script
REM Compatible with Windows Server 2019

echo ========================================
echo ModuChat Frontend Server Starting...
echo ========================================
echo.

REM Change to frontend directory
cd /d "%~dp0frontend"
if %errorlevel% neq 0 (
    echo ERROR: Failed to change to frontend directory
    pause
    exit /b 1
)

echo Current directory: %CD%
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Node modules not found, installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

REM Start frontend development server
echo Starting Vite development server...
echo Server will run at: http://localhost:8765
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev

REM Check if npm run dev failed
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Frontend server failed to start
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo Frontend server stopped
pause