@echo off
REM ModuChat Backend Startup Script
REM Compatible with Windows Server 2019

echo ========================================
echo ModuChat Backend Server Starting...
echo ========================================
echo.

REM Change to backend directory
cd /d "%~dp0backend"
if %errorlevel% neq 0 (
    echo ERROR: Failed to change to backend directory
    pause
    exit /b 1
)

echo Current directory: %CD%
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo Virtual environment not found!
    echo Please create virtual environment first:
    echo   python -m venv venv
    echo   venv\Scripts\activate
    echo   pip install -r requirements.txt
    pause
    exit /b 1
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)
echo Virtual environment activated
echo.

REM Check if requirements are installed
echo Checking Python dependencies...
python -c "import fastapi" 2>nul
if %errorlevel% neq 0 (
    echo Dependencies not found, installing...
    call pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

REM Start backend server
echo Starting FastAPI server...
echo Server will run at: http://0.0.0.0:5173
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python main.py

REM Check if python main.py failed
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Backend server failed to start
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo Backend server stopped
pause