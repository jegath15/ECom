@echo off
echo Starting ChefSupply B2B Marketplace...

:: Start the .NET Core API Backend
echo Starting Backend API (Port 5180)...
cd /d "%~dp0\ChefSupply.API"
start "ChefSupply Backend API" cmd /c "dotnet run"

:: Wait for a few seconds to let the backend start up
timeout /t 5 /nobreak >nul

:: Start the React Frontend
echo Starting React Frontend (Port 3000)...
cd /d "%~dp0\frontend"
start "ChefSupply Frontend" cmd /c "npm start"

echo.
echo ==================================================
echo.
echo Application started successfully!
echo.
echo Backend API available at: http://localhost:5180
echo Swagger UI available at:  http://localhost:5180/swagger
echo React Frontend running at: http://localhost:3000
echo.
echo ==================================================
pause
