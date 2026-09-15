// 면담 데이터가 매칭 엔진과 어긋나지 않는지 지키는 테스트입니다.
// 실행: npm test
import test from 'node:test';
import assert from 'node:assert/strict';
import { institutions } from './institutions.js';
import { quizQuestions, summaryCards } from './quiz.js';
import { matchAnswer } from '../utils/matchAnswer.js';

test('추천 질문은 하나도 빠짐없이 답변에 매칭된다', () => {
  // 학생이 추천 질문 칩을 눌렀는데 "못 알아들었어요"가 나오면 안 됩니다.
  for (const inst of institutions) {
    for (const question of inst.suggestedQuestions) {
      assert.ok(matchAnswer(question, inst.qa), `${inst.shortName}: "${question}"`);
    }
  }
});

test('Q&A id는 전체에서 유일하다', () => {
  const seen = new Set();
  for (const inst of institutions) {
    for (const qa of inst.qa) {
      assert.equal(seen.has(qa.id), false, `중복 id: ${qa.id}`);
      seen.add(qa.id);
    }
  }
});

test('기관 이름은 그 기관의 키워드로 쓰지 않는다', () => {
  // 담당관을 이미 고른 뒤에 하는 질문이라 기관 이름은 정보가 없는 낱말인데,
  // 글자 수가 길어서 동점 비교 때 구체적인 주제 키워드를 전부 이겨버립니다.
  // (예: "주민센터에 견학 갈 수 있나요?" → '주민센터'(4자)가 '견학'(2자)을 이김)
  const ownNames = {
    'community-center': ['주민센터'],
    'city-hall': ['시청', '구청'],
    police: ['경찰서'],
    fire: ['소방서'],
    'health-center': ['보건소'],
    'post-office': ['우체국'],
    library: ['도서관'],
  };
  for (const inst of institutions) {
    for (const qa of inst.qa) {
      for (const name of ownNames[inst.id]) {
        assert.equal(qa.keywords.includes(name), false, `${qa.id}에 '${name}'`);
      }
    }
  }
});

test('퀴즈가 가리키는 해설 답변과 기관이 실제로 있다', () => {
  const qaIds = new Set(institutions.flatMap((inst) => inst.qa.map((qa) => qa.id)));
  const instIds = new Set(institutions.map((inst) => inst.id));
  for (const q of quizQuestions) {
    assert.ok(instIds.has(q.institutionId), `${q.id}: 없는 기관 ${q.institutionId}`);
    assert.ok(qaIds.has(q.relatedQaId), `${q.id}: 없는 해설 ${q.relatedQaId}`);
    assert.ok(q.options[q.answerIndex] !== undefined, `${q.id}: 정답 번호가 보기 밖`);
  }
  for (const card of summaryCards) {
    assert.ok(instIds.has(card.institutionId), `요약 카드: 없는 기관 ${card.institutionId}`);
  }
});
