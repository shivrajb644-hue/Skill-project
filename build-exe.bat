@echo off
title Build Soft Skills Platform .exe
echo.
echo ========================================================
echo   Soft Skills Platform - Windows .EXE Packaging Wizard
echo ========================================================
echo.
echo  This tool builds a standalone Windows executable.
echo  Your source code and existing student data are 100%% safe.
echo.
cd /d "%~dp0"

echo [Step 1/3] Building Next.js production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Next.js build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo [Step 2/3] Preparing standalone assets...
call node ./electron/copy-standalone.js
if %errorlevel% neq 0 (
    echo [ERROR] Asset preparation failed.
    pause
    exit /b %errorlevel%
)

echo.
echo [Step 3/3] Packaging Windows .exe with electron-builder...
call npx electron-builder --win
if %errorlevel% neq 0 (
    echo [ERROR] Electron packaging failed.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo   Build Successful!
echo ========================================================
echo.
echo   Your executables are ready in:
echo   - Installer: dist\Soft Skills Platform Setup 0.1.0.exe
echo   - Portable / Unpacked: dist\win-unpacked\Soft Skills Platform.exe
echo.
echo   * Note: Student data is stored safely in:
echo     %%APPDATA%%\SoftSkillsPlatformData
echo.
pause
