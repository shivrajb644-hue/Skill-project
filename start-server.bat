@echo off
title Soft Skills Learning Platform
echo.
echo ========================================================
echo   Soft Skills Platform - Local Server Launcher
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/3] Checking port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Freeing port 3000 from hanging process (PID: %%a)...
    taskkill /f /pid %%a >nul 2>&1
)

echo [2/3] Checking production build...
if not exist ".next\BUILD_ID" (
    echo Production build not found. Compiling now...
    call npm run build
    if errorlevel 1 (
        echo [ERROR] Build failed. Please inspect errors above.
        pause
        exit /b 1
    )
)

echo [3/3] Starting server at http://localhost:3000...
echo.
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000"
npm start
pause
