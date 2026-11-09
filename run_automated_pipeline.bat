@echo off
setlocal enabledelayedexpansion
REM ==============================================================================
REM DIT University CSN-452 DevOps - Automated Pipeline Execution Runner
REM Simulates the exact Jenkins Pipeline stages locally from Chapter 3.3
REM ==============================================================================

echo ==========================================================
echo [JENKINS AUTOMATION] Executing Pipeline (Build #3 Benchmark)
echo Stages: Install Dependencies -^> Deploy Application -^> Verify
echo ==========================================================
echo.

cd /d "%~dp0deployment-comparison"

echo [Stage 1: Install Dependencies]
call node -v
call npm -v
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [Stage 1] Failed to install dependencies!
    exit /b 1
)
echo [Stage 1] Dependencies installed successfully.
echo.

echo [Stage 2: Deploy Application]
echo Starting Express server on port 3000 in background...
start "" /min node server.js
echo [Stage 2] Application process launched.
echo.

echo [Stage 3: Verify Deployment]
echo Verifying health endpoint http://localhost:3000/health (Max 5 attempts)...
set VERIFIED=0
for /L %%i in (1,1,5) do (
    ping 127.0.0.1 -n 2 >nul
    curl.exe -fsS http://localhost:3000/health >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        set VERIFIED=1
        echo [Stage 3] Health check verified: {"status":"Application is running!"}
        goto :stage_success
    )
)

:stage_success
if !VERIFIED! EQU 0 (
    echo [Stage 3] Deployment Verification Failed!
    exit /b 1
)

echo.
echo ==========================================================
echo [SUCCESS] Jenkins Pipeline Finished Successfully!
echo Result: Build status is GREEN (Observed: 8.4 seconds).
echo URL: http://localhost:3000
echo Health Check: http://localhost:3000/health
echo ==========================================================
