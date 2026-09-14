# 공공기관 주민자치 탐구 면담실 — ToDo

## 0. 기술 결정 사항

### React 사용 여부 → **사용함 (Vite + React)**
- 근거: 4개 탭이 서로 상태를 공유(면담 스크랩 → 학습지 자동 반영 → 퀴즈 출제 → 기자증/보고서 취합)하는 구조라 순수 JS로 짜면 상태 동기화 코드가 금방 복잡해짐
- 기존 방침("복잡한 UI는 React")에 부합하는 케이스로 판단
- 단, 배포는 `npm run build` 결과(정적 HTML/JS/CSS 묶음)로 하기 때문에 학생들이 최종적으로 받는 것은 여전히 "설치 없이 여는" 정적 파일 — 개발 단계에서만 React/Vite를 씀

### DB / 서버 필요 여부 → **불필요 (완전 정적 사이트)**
- 데이터는 data.md에 정리한 고정 데이터(기관·Q&A·퀴즈)뿐이라 서버에서 관리할 "변하는 데이터"가 없음
- 로그인/계정 없음, 학생별 서버 저장 없음 (진행 상태는 브라우저 메모리/localStorage로 충분)
- API 키를 쓰지 않기로 한 원래 제약과도 일치 — 외부 통신 자체가 없음
- 결론: React 앱을 빌드해서 나온 정적 파일을 학교 PC 로컬, 학급 USB, 또는 GitHub Pages 등 정적 호스팅에 올리면 끝

## 1. 로컬 설치 & 실행 (setup 스크립트)

프로젝트 스캐폴드와 실행 스크립트를 만들어 첨부했습니다 (`project-starter.zip`).

```
project/
├─ package.json       # React + Vite 최소 의존성
├─ vite.config.js      # base: './' 로 설정 — 로컬에서 index.html 직접 열기 대비
├─ index.html
├─ setup.bat            # Windows용 — 더블클릭하면 설치+실행
├─ setup.sh              # Mac/Linux용
└─ src/
   ├─ main.jsx
   └─ App.jsx           # 지금은 빈 껍데기, Phase 1부터 채움
```

**사용법**
1. `project-starter.zip` 압축 해제
2. Windows: `setup.bat` 더블클릭 / Mac·Linux: 터미널에서 `./setup.sh`
3. Node.js가 없으면 스크립트가 자동으로 안내 후 종료 → nodejs.org에서 LTS 설치
4. 설치 후 자동으로 `npm run dev` 실행 → `http://localhost:5173` 접속
5. 배포용 정적 파일이 필요할 때는 `npm run build` → `dist/` 폴더를 그대로 학교 PC나 USB에 복사

## 2. 폴더/컴포넌트 구조 설계 (Phase 1 진입 전 확정)

```
src/
├─ App.jsx                 # 탭 상태(현재 탭) 관리, 공통 헤더
├─ data/
│  └─ institutions.js       # data.md 내용을 그대로 옮긴 데이터 파일
├─ utils/
│  └─ matchAnswer.js         # data.md의 키워드 매칭 함수
├─ components/
│  ├─ Header.jsx              # 상단 배지 + 탭 네비게이션
│  ├─ tab1-interview/
│  │  ├─ InstitutionList.jsx
│  │  ├─ ChatPanel.jsx
│  │  └─ ChatBubble.jsx
│  ├─ tab2-worksheet/
│  │  └─ WorksheetAccordion.jsx
│  ├─ tab3-quiz/
│  │  ├─ SummaryCards.jsx
│  │  └─ QuizPanel.jsx
│  └─ tab4-report/
│     ├─ ReporterCard.jsx
│     └─ ReportSummary.jsx
└─ state/
   └─ useAppState.js        # 스크랩 목록, 완료 기관 수, 기자 이름 등 전역 상태 (useState/useReducer)
```

- 상태 관리는 별도 라이브러리 없이 React Context + useReducer로 충분 (규모상 Redux 등 불필요)

## 3. 단계별 체크리스트

### Phase 1 — 프로젝트 기반 ✅ 완료
- [x] 프로젝트 스캐폴드 생성(zip 대신 interview 폴더에 직접 생성) + `setup.bat`/`setup.sh` 작성
- [x] `data.md`의 JS 데이터를 `src/data/institutions.js`, `src/data/quiz.js`로 옮기기
- [x] `matchAnswer` 함수를 `src/utils/matchAnswer.js`로 분리 (조사 제거본 + 원문 동시 비교로 보강, 샘플 11문항 검증 통과)
- [x] design.md 색상표를 `src/styles/tokens.css`(CSS 변수)로 정리
- [x] 전역 상태 `src/state/useAppState.jsx` (Context + useReducer, localStorage 저장)
- [x] 공통 헤더 + 4개 탭 전환 (`src/components/Header.jsx`, `src/App.jsx`)

### Phase 2 — 탭 1: 면담하기 ✅ 완료
- [x] 좌측 기관 리스트 컴포넌트 (7개, 완료 체크 표시)
- [x] 우측 채팅 패널: 담당관 헤더, 말풍선 렌더링
- [x] 자유 입력창 + 전송 버튼 → matchAnswer 연동
- [x] 매칭 실패시 폴백 메시지 + 추천 질문 3개 노출
- [x] 추천 질문 칩 클릭 시 즉시 전송
- [x] [학습지에 스크랩] 버튼 → 전역 상태에 Q&A 저장 (중복 스크랩 방지, 완료 시 버튼 비활성)
- [x] [음성 듣기] 버튼 → Web Speech API 연결 (ko-KR)
- [x] 기관을 **처음** 열면 intro 메시지로 시작 — 단, 기관을 전환했다 돌아와도 대화가 유지되도록 변경하고,
      대신 [↺ 대화 다시 시작] 버튼을 추가함 (학생이 실수로 기관을 눌러 대화를 통째로 잃는 것을 막기 위함)

### Phase 3 — 탭 2: 학습지 작성 ✅ 완료
- [x] 기관별 아코디언 카드 (완료 기관만 펼침 가능, 미완료는 "아직 면담 전이에요" 회색 처리)
- [x] 스크랩된 Q&A 리스트 표시 (질문 번호 + 담당관 이름 라벨)
- [x] "내 생각 적어보기" 서술형 입력창 (입력 즉시 자동 저장)
- [x] (추가) 스크랩 개별 [🗑 지우기] 버튼 — 잘못 스크랩한 항목 정리용
- [x] (추가) 스크랩이 하나도 없을 때 ① 탭으로 안내하는 빈 화면 문구

### Phase 4 — 탭 3: 개념 정리 & 퀴즈 ✅ 완료
- [x] 7개 기관 요약 카드 그리드 (summaryCards 데이터 사용, 면담 완료 기관에 ✅ 표시)
- [x] 퀴즈 진행 로직 (14문항 순차 출제, 진행 바 + 맞힌 개수 실시간 표시, 답안 자동 저장)
- [x] 오답 시 관련 요약 카드로 부드럽게 스크롤 이동 + 2.5초간 주황 테두리 강조
- [x] 스크랩한(면담한) 기관의 문제를 앞쪽에 배치 — 선택 사항이었으나 구현함
- [x] (추가) 정답/오답 즉시 채점 + 근거가 된 담당관 답변을 해설로 표시
- [x] (추가) 전체 완료 시 최종 점수 안내, [↺ 다시 풀기] 버튼

### Phase 5 — 탭 4: 기자증 & 보고서 ✅ 완료
- [x] 기자증 카드 (이름 입력 연동 — 카드에서 직접 발급 가능, 면담/남은 기관 수, 진행 바, 발급일)
- [x] 학습지 내용 취합해 보고서 자동 생성 (기관별 한 줄 요약 + Q&A + 내 생각 + 퀴즈 점수)
- [x] 인쇄 버튼 (`window.print()`) + 인쇄용 CSS(@media print — 헤더·탭·안내문·버튼 숨김, 기관 카드 페이지 분할 방지)
- [x] (추가) 면담 전에는 인쇄 버튼 비활성 + 안내 문구

### Phase 6 — 마감 ✅ 완료
- [x] design.md 기준 전체 스타일 점검 — 텍스트/배경 24개 조합 WCAG AA(4.5:1) 전수 계산, 미달 3건 수정 후 24/24 통과
      (보조텍스트 #767676→#6B6B6B, 초록 배지에 `--c-accent-dark` 추가, 주황 버튼 흰 글자→`--c-warning-text`)
- [x] 태블릿(768px)·모바일(375px) 레이아웃 확인 — 4개 탭 모두 가로 넘침 없음, 좁은 화면 채팅 헤더 줄바꿈 보완
- [x] 빌드 → **오프라인(file://) 동작 확인** — headless Edge로 실제 렌더링 검증 완료
- [x] 학생용 배포 방법: **단일 HTML 파일** 로 확정 (아래 참고)
- [x] GitHub Pages 배포 설정 — `.github/workflows/deploy.yml` (main 푸시 시 자동 빌드·배포)
      주소: https://goranipark.github.io/interview/

#### 빌드 방식 변경 (중요)
기존 방식(JS·CSS를 별도 파일로 분리)으로 빌드한 `index.html`은 더블클릭(file://)으로 열면
브라우저 CORS 정책에 막혀 **빈 화면**이 나옵니다. (실제로 재현 확인함)
→ `vite-plugin-singlefile` 을 넣어 **모든 코드를 index.html 안에 인라인**하도록 변경.
   결과: `dist/index.html` 파일 1개(212KB), 더블클릭으로 정상 실행, localStorage 저장도 동작.
   비개발자용 `build.bat`(더블클릭 → dist 폴더 자동 열림)과 `README.md` 추가.

## 4. 배포 옵션 메모 (서버 불필요 확정에 따른 선택지)

| 방법 | 장점 | 비고 |
|---|---|---|
| 학교 PC 로컬 `dist/` 폴더 | 인터넷 불필요, 가장 단순 | PC마다 폴더 복사 필요 |
| 학급 USB 배포 | 학생 개인 PC/태블릿에서도 실행 가능 | `index.html` 더블클릭으로 열림 (vite.config.js에 `base:'./'` 설정 완료) |
| GitHub Pages (무료 정적 호스팅) | 링크 하나로 어디서든 접속 | 최초 배포 시 Git 지식 약간 필요 — 이미 GitHub Desktop 사용 중이므로 무리 없음 |

## 다음 단계

- 위 체크리스트를 따라 Phase 1부터 순차 구현
- 구현 중 궁금한 부분이나 막히는 Phase가 있으면 해당 컴포넌트부터 같이 작성 가능
