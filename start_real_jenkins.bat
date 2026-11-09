@echo off
REM ==============================================================================
REM DIT University CSN-452 DevOps - Launch Real Jenkins Server
REM Jenkins Version: 2.452.3 LTS (Java 17 Compatible)
REM URL: http://localhost:8080
REM Initial Admin Password: 5f98dd96a25041a7af1bdb68de273725
REM ==============================================================================

echo ==========================================================
echo [JENKINS SERVER] Real Jenkins Server on http://localhost:8080
echo Initial Admin Password: 5f98dd96a25041a7af1bdb68de273725
echo Job Created: Deployment-Automation
echo ==========================================================
echo.

java -jar "%~dp0jenkins.war" --httpPort=8080
