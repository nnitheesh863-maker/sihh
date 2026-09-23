# Build verification script
Write-Host "Verifying Backend and Frontend builds..." -ForegroundColor Cyan

cd backend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Backend build failed."
    exit 1
}

cd ../frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend build failed."
    exit 1
}

Write-Host "Build verification passed successfully!" -ForegroundColor Green
