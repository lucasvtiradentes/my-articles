Dim userprofile
Dim vscodeLocation
Dim wls_args

Dim objfso
Dim objShell

Dim originalFolder
Dim folderDrive
Dim formatedFolder
Dim commandToRun

Set objfso = CreateObject("Scripting.FileSystemObject")
Set objShell = CreateObject("WScript.Shell")

userprofile = objShell.ExpandEnvironmentStrings("%USERPROFILE%")
vscodeLocation= userprofile & "\AppData\Local\Programs\Microsoft VS Code\Code.exe"
wls_args = "--remote wsl+Ubuntu"

if (WScript.Arguments.Count = 0) then
  msgbox "No folder was selected!"
  WScript.Quit
end if

if Not (objfso.FolderExists(WScript.Arguments(0))) then
  msgbox "Folder was not found!"
  WScript.Quit
end if

originalFolder = WScript.Arguments(0)
folderDrive = objfso.GetDriveName(originalFolder)
formatedFolder = Replace(originalFolder, folderDrive, Lcase(folderDrive))
formatedFolder = Replace(formatedFolder, "\","/")
formatedFolder = Replace(formatedFolder, ":","")
formatedFolder = "mnt/" & formatedFolder

commandToRun = Chr(34) & vscodeLocation & Chr(34) & " " & wls_args & " " & Chr(34) & formatedFolder & Chr(34)
'  Wscript.Echo commandToRun
objShell.Run commandToRun, 0

Set objfso = Nothing
Set objShell = Nothing
