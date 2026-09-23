# Database seeding runner
Write-Host "Resetting and seeding PostgreSQL database with Mandi data..." -ForegroundColor Cyan
cd backend
npx prisma migrate reset --force
npx prisma db seed
Write-Host "Database successfully seeded." -ForegroundColor Green
