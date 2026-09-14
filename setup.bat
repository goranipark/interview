@echo off
chcp 65001 > nul
title 공공기관 주민자치 탐구 면담실 - 실행
echo.
echo ==========================================
echo   공공기관 주민자치 탐구 면담실
echo ==========================================
echo.

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo [!] Node.js가 설치되어 있지 않습니다.
  echo     https://nodejs.org 에서 LTS 버전을 설치한 뒤 다시 실행해 주세요.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo [1/2] 필요한 프로그램을 설치합니다. 처음 한 번만 시간이 좀 걸려요...
  call npm install
  if errorlevel 1 (
    echo.
    echo [!] 설치에 실패했습니다. 인터넷 연결을 확인해 주세요.
    pause
    exit /b 1
  )
) else (
  echo [1/2] 이미 설치되어 있습니다. 건너뜁니다.
)

echo.
echo [2/2] 앱을 실행합니다. 브라우저에서 http://localhost:5173 으로 접속하세요.
echo      (종료하려면 이 창에서 Ctrl+C 를 누르거나 창을 닫으세요.)
echo.
call npm run dev
pause
