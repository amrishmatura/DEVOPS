@echo off
REM ==============================================================================
REM DIT University CSN-452 DevOps - Launch Real Jenkins Server
REM Jenkins Version: 2.580.2 (Matches Figures 4.2, 4.3, 4.4 of the Project Report)
REM Port: http://localhost:8080
REM ==============================================================================

echo ==========================================================
echo [JENKINS SERVER] Starting Real Jenkins on http://localhost:8080
echo ==========================================================
echo.

REM Verify Java is installed
java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java 17 is required to run Jenkins. Please ensure Java is in PATH.
    pause
    exit /b 1
)

REM Check if jenkins.war exists, download if missing
if not exist "%~dp0jenkins.war" (
    echo [SETUP] jenkins.war not found. Downloading Jenkins LTS (v2.580.2)...
    echo Please wait a moment while the package is downloaded...
    curl.exe -L -o "%~dp0jenkins.war" "https://get.jenkins.io/war-stable/latest/jenkins.war"
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to download jenkins.war. Please check your internet connection.
        pause
        exit /b 1
    )
    echo [SETUP] jenkins.war downloaded successfully!
    echo.
)

echo Starting Jenkins server...
echo Once started, open your browser and navigate to: http://localhost:8080
echo Press Ctrl+C in this terminal window whenever you wish to stop Jenkins.
echo.

java -jar "%~dp0jenkins.war" --httpPort=8080
