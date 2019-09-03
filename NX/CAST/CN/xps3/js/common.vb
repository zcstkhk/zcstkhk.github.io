Dim WM_detect_through_vb
WM_detect_through_vb = 0

If ScriptEngineMajorVersion >= 2 then
    WM_detect_through_vb = 1
End If

Function WM_activeXDetect(activeXname)
    on error resume next
    If ScriptEngineMajorVersion >= 2 then
      WM_activeXDetect = False
      WM_activeXDetect = IsObject(CreateObject(activeXname))
      If (err) then
        WM_activeXDetect = False
      End If
    Else
      WM_activeXDetect = False
    End If
End Function