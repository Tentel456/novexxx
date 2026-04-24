@echo off
echo Starting local web server...
echo.
echo Your site will be available at:
echo http://localhost:8000/auth-page/auth.html
echo.
echo Press Ctrl+C to stop the server
echo.

REM Try Python 3 first
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python 3...
    python -m http.server 8000
    goto :end
)

REM Try Python 2
python2 --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python 2...
    python2 -m SimpleHTTPServer 8000
    goto :end
)

REM Try PHP
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using PHP...
    php -S localhost:8000
    goto :end
)

echo ERROR: No suitable server found!
echo Please install Python or PHP, or use VS Code Live Server extension
pause

:end
