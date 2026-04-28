@echo off
set "NODE24_DIR=%~dp0..\.tools\node-v24.15.0-win-x64"
set "PATH=%NODE24_DIR%;%PATH%"
call "%NODE24_DIR%\npm.cmd" %*
