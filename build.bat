@echo off
chcp 65001 > nul
title 학생 배포용 파일 만들기
echo.
echo ==========================================
echo   학생 배포용 파일 만들기
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
  echo [1/2] 처음이라 준비 작업을 합니다. 시간이 조금 걸려요...
  call npm install
  if errorlevel 1 (
    echo.
    echo [!] 준비에 실패했습니다. 인터넷 연결을 확인해 주세요.
    pause
    exit /b 1
  )
) else (
  echo [1/2] 준비 완료 상태입니다. 건너뜁니다.
)

echo.
echo [2/2] 배포용 파일을 만듭니다...
call npm run build
if errorlevel 1 (
  echo.
  echo [!] 만들기에 실패했습니다.
  pause
  exit /b 1
)

echo.
echo ==========================================
echo   완료!
echo ==========================================
echo.
echo   dist 폴더 안에 index.html 파일 하나가 만들어졌습니다.
echo   이 파일 하나만 USB나 학교 PC에 복사하면 됩니다.
echo   학생은 그 파일을 더블클릭하면 바로 실행됩니다. (인터넷 불필요)
echo.
explorer "%~dp0dist"
pause
