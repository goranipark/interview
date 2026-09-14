#!/bin/sh
# Mac / Linux 용 실행 스크립트
cd "$(dirname "$0")" || exit 1

echo "=========================================="
echo "  공공기관 주민자치 탐구 면담실"
echo "=========================================="
echo

if ! command -v node > /dev/null 2>&1; then
  echo "[!] Node.js가 설치되어 있지 않습니다."
  echo "    https://nodejs.org 에서 LTS 버전을 설치한 뒤 다시 실행해 주세요."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "[1/2] 필요한 프로그램을 설치합니다. 처음 한 번만 시간이 좀 걸려요..."
  npm install || { echo "[!] 설치 실패. 인터넷 연결을 확인해 주세요."; exit 1; }
else
  echo "[1/2] 이미 설치되어 있습니다. 건너뜁니다."
fi

echo
echo "[2/2] 앱을 실행합니다. 브라우저에서 http://localhost:5173 으로 접속하세요."
echo "     (종료하려면 Ctrl+C)"
echo
npm run dev
