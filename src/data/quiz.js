// data.md 9~10장 — 퀴즈 문제 풀(기관별 2문항, 총 14문항)과 기관 역할 요약 카드

export const quizQuestions = [
  // 동 주민센터
  { id: 'q-cc-1', institutionId: 'community-center', type: 'multiple',
    question: '주민자치위원회는 누가 참여할까요?',
    options: ['대통령이 임명한 사람', '주민들이 스스로 뽑은 대표', '시장님 혼자', '외국인 관광객'],
    answerIndex: 1, relatedQaId: 'cc-2' },
  { id: 'q-cc-2', institutionId: 'community-center', type: 'ox',
    question: '주민센터에서는 주민등록등본을 발급받을 수 있다.',
    options: ['O', 'X'], answerIndex: 0, relatedQaId: 'cc-3' },

  // 시청/구청
  { id: 'q-ch-1', institutionId: 'city-hall', type: 'multiple',
    question: '주민참여예산제란 무엇일까요?',
    options: ['시장님이 혼자 정하는 예산', '시민이 직접 예산 사용처를 제안하고 투표하는 제도', '세금을 안 내는 제도', '다른 나라의 예산 제도'],
    answerIndex: 1, relatedQaId: 'ch-4' },
  { id: 'q-ch-2', institutionId: 'city-hall', type: 'ox',
    question: '조례는 우리나라 전체에 적용되는 법이다.',
    options: ['O', 'X'], answerIndex: 1, relatedQaId: 'ch-5' },

  // 경찰서
  { id: 'q-po-1', institutionId: 'police', type: 'multiple',
    question: '위급한 상황이나 범죄를 목격했을 때 신고하는 번호는?',
    options: ['119', '112', '110', '114'],
    answerIndex: 1, relatedQaId: 'po-2' },
  { id: 'q-po-2', institutionId: 'police', type: 'ox',
    question: '112에 장난 전화를 해도 괜찮다.',
    options: ['O', 'X'], answerIndex: 1, relatedQaId: 'po-14' },

  // 소방서
  { id: 'q-fi-1', institutionId: 'fire', type: 'multiple',
    question: '불이 나거나 위급한 상황일 때 신고하는 번호는?',
    options: ['112', '119', '110', '117'],
    answerIndex: 1, relatedQaId: 'fi-2' },
  { id: 'q-fi-2', institutionId: 'fire', type: 'ox',
    question: '구급차나 소방차가 지나갈 때는 길을 비켜줘야 한다.',
    options: ['O', 'X'], answerIndex: 0, relatedQaId: 'fi-10' },

  // 보건소
  { id: 'q-he-1', institutionId: 'health-center', type: 'multiple',
    question: '보건소에서 받을 수 있는 것은 무엇일까요?',
    options: ['예방접종', '자동차 검사', '건축 허가', '재판'],
    answerIndex: 0, relatedQaId: 'he-2' },
  { id: 'q-he-2', institutionId: 'health-center', type: 'ox',
    question: '보건소의 서비스는 모두 병원보다 비싸다.',
    options: ['O', 'X'], answerIndex: 1, relatedQaId: 'he-13' },

  // 우체국
  { id: 'q-pf-1', institutionId: 'post-office', type: 'multiple',
    question: '중요한 우편물을 안전하게 보내는 방법은?',
    options: ['등기', '엽서', '택배 상자만 사용', '전화로 알리기'],
    answerIndex: 0, relatedQaId: 'pf-3' },
  { id: 'q-pf-2', institutionId: 'post-office', type: 'ox',
    question: '우체국에서는 예금(저금)도 할 수 있다.',
    options: ['O', 'X'], answerIndex: 0, relatedQaId: 'pf-7' },

  // 도서관
  { id: 'q-li-1', institutionId: 'library', type: 'multiple',
    question: '도서관에서 책을 빌리려면 무엇이 필요할까요?',
    options: ['회원증', '입장권', '수능 성적표', '여권'],
    answerIndex: 0, relatedQaId: 'li-3' },
  { id: 'q-li-2', institutionId: 'library', type: 'ox',
    question: '빌린 책을 늦게 반납해도 아무 문제가 없다.',
    options: ['O', 'X'], answerIndex: 1, relatedQaId: 'li-7' },
];

export const summaryCards = [
  { institutionId: 'community-center', summary: '주민들의 생활 편의와 주민자치를 돕는 동네 행정기관' },
  { institutionId: 'city-hall', summary: '도시 전체의 예산과 정책을 계획하고 실행하는 기관' },
  { institutionId: 'police', summary: '범죄를 예방하고 시민의 안전을 지키는 기관' },
  { institutionId: 'fire', summary: '화재를 진압하고 위급한 사람을 구조·구급하는 기관' },
  { institutionId: 'health-center', summary: '예방접종과 건강 관리로 주민 건강을 지키는 기관' },
  { institutionId: 'post-office', summary: '편지와 소포를 배달하고 우편 금융 서비스를 제공하는 기관' },
  { institutionId: 'library', summary: '책과 정보를 무료로 이용하고 배울 수 있게 돕는 기관' },
];
