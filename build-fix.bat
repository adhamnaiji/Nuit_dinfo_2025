@echo off
REM build-fix.bat - Windows batch script for clean build

echo.
echo ===============================================
echo   NIRD STL Vision - Complete Build Fix
echo ===============================================
echo.

echo [1/4] Cleaning old files...
if exist node_modules rmdir /s /q node_modules
if exist .next rmdir /s /q .next
if exist dist rmdir /s /q dist
if exist out rmdir /s /q out
del /f /q package-lock.json 2>nul
del /f /q pnpm-lock.yaml 2>nul
echo ✓ Cleaned!

echo.
echo [2/4] Installing dependencies...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ✗ Installation failed!
    pause
    exit /b 1
)
echo ✓ Dependencies installed!

echo.
echo [3/4] Building project...
call npm run build
if errorlevel 1 (
    echo ✗ Build failed!
    pause
    exit /b 1
)
echo ✓ Build successful!

echo.
echo [4/4] Done!
echo.
echo ===============================================
echo   ✓ Ready to run!
echo   
echo   Next command:
echo   npm run dev
echo   
echo   Then open: http://localhost:3000
echo ===============================================
echo.
pause
