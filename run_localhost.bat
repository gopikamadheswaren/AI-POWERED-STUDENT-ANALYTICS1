@echo off
title NexusEdu AI Success Platform - Localhost Server
echo ====================================================================
echo Starting NexusEdu AI Platform on http://localhost:5000/
echo ====================================================================
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0run_localhost.ps1"
pause
