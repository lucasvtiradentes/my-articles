' open with Windows Terminal.vbs
Dim objShell
Dim folderToOpen
Set objShell = WScript.CreateObject("WScript.Shell")

If (WScript.Arguments.Count = 0) Then

  objShell.Run ("wt -d .")

else

  If (Len(WScript.Arguments(0)) = 3) Then
    folderToOpen = Replace(WScript.Arguments(0), "\", "")
  Else
    folderToOpen = WScript.Arguments(0)
  End If

  objShell.Run ("wt -d " & Chr(34) & folderToOpen & Chr(34))

End If