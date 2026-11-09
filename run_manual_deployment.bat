@echo off
setlocal
title Manual Software Deployment Execution
echo ========================================================
echo   Manual Software Deployment Workflow
echo   Target: Node.js Express REST Service (Port 3000)
echo ========================================================
echo.

cd /d "%~dp0deployment-comparison"

echo [Step 1/4] Checking Node.js and npm environment...
node -v
npm -v
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in PATH!
    pause
    exit /b 1
)

echo.
echo [Step 2/4] Installing application dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed!
    pause
    exit /b 1
)

echo.
echo [Step 3/4] Starting application server (Port 3000)...
start "Node.js Web App" cmd /c "node server.js"

echo Waiting for server to initialize...
ping 127.0.0.1 -n 3 >nul

echo.
echo [Step 4/4] Verifying deployment health...
curl.exe -fsS http://localhost:3000/health
if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo   [SUCCESS] Application manually deployed successfully!
    echo   Dashboard: http://localhost:3000
    echo   Health:    http://localhost:3000/health
    echo ========================================================
) else (
    echo.
    echo [WARNING] Health check failed or still starting. Check http://localhost:3000/health manually.
)

echo.
pause
