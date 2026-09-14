// data.md 0장의 키워드 매칭 엔진.
//
// data.md 초안은 입력에서 조사를 지운 뒤에만 키워드를 비교했는데,
// 그러면 "어린이보호구역"처럼 조사("이")가 단어 안에 들어있는 말이 쪼개져서
// 정답이 있는데도 매칭에 실패합니다.
// 그래서 여기서는 (1) 조사를 제거한 문장과 (2) 공백만 지운 원문
// 두 가지를 모두 보고 점수가 높은 쪽을 씁니다.

// 간단한 조사/어미 제거용 불용어 목록 (형태소 분석기 대신 경량 매칭용)
export const STOPWORDS = [
  '은', '는', '이', '가', '을', '를', '의', '에', '에서', '으로', '로',
  '과', '와', '도', '만', '까지', '부터', '이나', '나', '요', '죠',
  '인가요', '인가', '예요', '이에요', '해요', '나요', '되나요', '하나요',
  '무엇', '뭐', '어떻게', '어떤',
];

// 긴 불용어부터 지워야 "하나요"가 "하" + "나" 로 잘못 쪼개지지 않습니다.
const SORTED_STOPWORDS = [...STOPWORDS].sort((a, b) => b.length - a.length);

/** 조사·어미를 제거한 문장을 돌려줍니다. */
export function preprocess(text) {
  let t = String(text || '').trim().toLowerCase();
  SORTED_STOPWORDS.forEach((w) => {
    t = t.split(w).join(' ');
  });
  return t.replace(/\s+/g, ' ').trim();
}

/** 공백·문장부호만 지운 원문 (조사는 그대로 둠) */
export function compact(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[\s.,!?~"'()[\]{}<>·…]/g, '');
}

/**
 * 한 Q&A 항목의 점수를 계산합니다.
 * - 키워드가 들어있으면 1점
 * - 동점일 때 더 구체적인(긴) 키워드가 이기도록 글자 수를 보조 점수로 함께 돌려줍니다.
 */
function scoreQa(qa, processed, compacted) {
  let hits = 0;
  let length = 0;
  qa.keywords.forEach((k) => {
    const key = k.toLowerCase();
    if (processed.includes(key) || compacted.includes(key)) {
      hits += 1;
      length += key.length;
    }
  });
  return { hits, length };
}

/**
 * 사용자 입력과 가장 잘 맞는 Q&A 항목을 찾습니다.
 * @returns 매칭된 Q&A 객체, 실패하면 null
 */
export function matchAnswer(userInput, qaList) {
  const processed = preprocess(userInput);
  const compacted = compact(userInput);
  if (!compacted) return null;

  let best = null;
  let bestHits = 0;
  let bestLength = 0;

  qaList.forEach((qa) => {
    const { hits, length } = scoreQa(qa, processed, compacted);
    // 맞은 키워드 개수 우선, 같으면 더 긴(구체적인) 키워드를 맞춘 쪽을 선택
    if (hits > bestHits || (hits === bestHits && hits > 0 && length > bestLength)) {
      bestHits = hits;
      bestLength = length;
      best = qa;
    }
  });

  // 임계값(1점) 미만이면 매칭 실패로 처리
  return bestHits >= 1 ? best : null;
}

/** 배열에서 무작위로 하나를 고릅니다. */
export function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/** 추천 질문 중 n개를 무작위로 뽑습니다. (폴백 메시지와 함께 노출) */
export function pickSuggestions(list, n = 3) {
  const copy = [...list];
  const picked = [];
  while (copy.length && picked.length < n) {
    picked.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return picked;
}
