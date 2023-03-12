@echo off
color 04
title Add Open With Windows Terminal to Context Window Options

set "scriptLocation=C:\scripts\open with Windows Terminal.vbs"
set "windowsTerminalIcon=C:\scripts\windows_terminal_LVz_icon.ico"
set "registryKeyName=Windows Terminal"
set "ContextMenuCommandName=Open with Windows Terminal"

set "OpenSpecifiedFolderKey=HKCR\Directory\shell\%registryKeyName%"
set "OpenSpecifiedFolderKeyValue= "\"%windir%\system32\wscript.exe\" \"%scriptLocation%\" "\"%%1\""

REG ADD "%OpenSpecifiedFolderKey%" /v "Icon" /t REG_EXPAND_SZ /d "%windowsTerminalIcon%"
REG ADD "%OpenSpecifiedFolderKey%" /ve /t REG_EXPAND_SZ /d "%ContextMenuCommandName%"
REG ADD "%OpenSpecifiedFolderKey%\command" /ve /t REG_EXPAND_SZ /d %OpenSpecifiedFolderKeyValue%

set "OpenCurrentFolderKey=HKCR\Directory\Background\shell\%registryKeyName%"
set "OpenCurrentFolderKeyValue= "\"%windir%\system32\wscript.exe\" \"%scriptLocation%\" "\"%%V\""

REG ADD "%OpenCurrentFolderKey%" /v "Icon" /t REG_EXPAND_SZ /d "%windowsTerminalIcon%"
REG ADD "%OpenCurrentFolderKey%" /ve /t REG_EXPAND_SZ /d "%ContextMenuCommandName%"
REG ADD "%OpenCurrentFolderKey%\command" /ve /t REG_EXPAND_SZ /d %OpenCurrentFolderKeyValue%

pause>nul
exit /b