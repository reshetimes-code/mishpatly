@echo off
echo Setting up daily import task at 08:00 AM...
schtasks /create /tn "MishpatlyDailyImport" /tr "node C:\Users\computer\Desktop\mishpatly\scripts\daily-import.js" /sc daily /st 08:00 /f
echo Done! Task "MishpatlyDailyImport" created.
echo It will run every day at 08:00 AM automatically.
pause
