@echo off
setlocal enabledelayedexpansion
title Automated CI/CD Pipeline Execution
echo ========================================================
echo   Automated CI/CD Pipeline Simulator
echo   Job: Deployment-Automation
echo   Pipeline: 3 Stages (Install - Deploy - Verify)
echo ========================================================
echo.

cd /d "%~dp0deployment-comparison"

echo [Pipeline] stage('Install Dependencies')
echo [Pipeline] dir('deployment-comparison')
node -v
npm -v
call npm install --no-audit --no-fund
if %errorlevel% neq 0 (
    echo [ERROR] Pipeline Failed at Stage: Install Dependencies
    pause
    exit /b 1
)
echo [Pipeline] Stage 'Install Dependencies' completed successfully.
echo.

echo [Pipeline] stage('Deploy Application')
start "Node.js Web App" cmd /c "node server.js"
echo [Pipeline] Background process dispatched.
echo [Pipeline] Stage 'Deploy Application' completed successfully.
echo.

echo [Pipeline] stage('Verify Deployment')
echo Polling http://localhost:3000/health (Max 5 attempts)...

set HEALTH_OK=0
for /l %%i in (1, 1, 5) do (
    if !HEALTH_OK! equ 0 (
        ping 127.0.0.1 -n 2 >nul
        curl.exe -fsS http://localhost:3000/health >nul 2>&1
        if !errorlevel! equ 0 (
            set HEALTH_OK=1
            echo Attempt %%i: Health check OK [HTTP 200]
        ) else (
            echo Attempt %%i: Waiting for application...
        )
    )
)

if !HEALTH_OK! equ 1 (
    echo.
    echo ========================================================
    echo   [Pipeline] End of Pipeline: SUCCESS
    echo   Jenkins Build Finished: SUCCESS
    echo   Dashboard: http://localhost:3000
    echo   Health:    http://localhost:3000/health
    echo ========================================================
) else (
    echo.
    echo [ERROR] Pipeline Failed at Stage: Verify Deployment
)

echo.
pause
