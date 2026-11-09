@echo off
REM ==============================================================================
REM DIT University CSN-452 DevOps - Manual Deployment Script
REM Commands directly from Chapter 4.1 of the Project Report
REM ==============================================================================

echo ==========================================================
echo [MANUAL DEPLOYMENT] Initiating Manual Deployment Workflow
echo ==========================================================
echo.
echo Step 1: Changing directory to deployment-comparison...
cd /d "%~dp0deployment-comparison"
if %ERRORLEVEL% NEQ 0 (
    echo Error: Could not find deployment-comparison directory!
    pause
    exit /b 1
)

echo.
echo Step 2: Installing dependencies manually...
call npm install

echo.
echo Step 3: Starting server manually with node server.js...
echo Application will start on http://localhost:3000
echo Check health check at http://localhost:3000/health
echo.
call node server.js
