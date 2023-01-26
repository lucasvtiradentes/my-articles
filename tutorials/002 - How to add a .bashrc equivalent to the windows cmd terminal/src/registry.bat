@echo off
color 04
title Add cmd rc to registry

set "OpenCurrentFolderKey=HKLM\SOFTWARE\Microsoft\Command Processor"
set "cmdRcPath=C:\scripts\cmd rc.bat"
REG ADD "%OpenCurrentFolderKey%" /v "AutoRun" /t REG_EXPAND_SZ /d "\"%cmdRcPath%\""

pause>nul
exit /b