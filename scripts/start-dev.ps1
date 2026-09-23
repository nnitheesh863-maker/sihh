# PowerShell Dev Runner for SIH Onion Quality System
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Starting SIH26031 Onion Quality System" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Development servers launched in separate terminal windows." -ForegroundColor Yellow
