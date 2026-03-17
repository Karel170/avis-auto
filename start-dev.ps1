$ErrorActionPreference = "Stop"

$root = "c:\Users\paink\Desktop\avis-auto"

Write-Host "Démarrage API + Frontend (2 terminaux)..." -ForegroundColor Cyan

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd `"$root`"; pnpm --filter @workspace/api-server run dev"
)

Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "cd `"$root`"; pnpm --filter @workspace/avisauto run dev"
)

Write-Host "Ouvrir: http://localhost:5173" -ForegroundColor Green

