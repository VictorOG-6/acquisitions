@echo off
chcp 65001 >nul
REM =========================================================
REM Development startup script for Acquisition App with Neon Local
REM Starts the application in development mode with Neon Local
REM =========================================================

echo 🚀 Starting Acquisition App in Development Mode
echo ========================================================

REM Check if .env.development exists
if not exist ".env.development" (
    echo ❌ Error: .env.development file not found!
    echo    Please copy .env.development from the template and update with your Neon credentials.
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker is not running!
    echo    Please start Docker Desktop and try again.
    exit /b 1
)

REM Create .neon_local directory if it doesn't exist
if not exist ".neon_local" (
    mkdir .neon_local
)

REM Add .neon_local to .gitignore if not already present
if not exist ".gitignore" (
    echo .neon_local/>.gitignore
    echo ✅ Added .neon_local/ to .gitignore
) else (
    findstr /C:".neon_local/" .gitignore >nul 2>&1
    if errorlevel 1 (
        echo .neon_local/>>.gitignore
        echo ✅ Added .neon_local/ to .gitignore
    )
)

echo 📦 Building and starting development containers...
echo    - Neon Local proxy will create an ephemeral database branch
echo    - Application will run with hot reload enabled
echo.

REM Run migrations with Drizzle
echo 📜 Applying latest schema with Drizzle...
npm run db:migrate

REM Wait for the database to be ready
echo ⏳ Waiting for the database to be ready...
docker compose exec neon-local psql -U neon -d neondb -c "SELECT 1"

REM Start development environment
docker compose -f docker-compose.dev.yml up --build

echo.
echo 🎉 Development environment started!
echo    Application: http://localhost:5173
echo    Database: postgres://neon:npg@localhost:5432/neondb
echo.
echo To stop the environment, press Ctrl+C or run: docker compose down
