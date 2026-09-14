import { useMemo, useState } from 'react';
import { institutions, getInstitution } from '../../data/institutions.js';
import { quizQuestions } from '../../data/quiz.js';
import { useAppState, isCompleted } from '../../state/useAppState.jsx';

/**
 * 출제 순서를 정합니다.
 * data.md 기준 전체 14문항을 모두 내되,
 * "내가 면담한 기관"의 문제를 앞쪽에 배치해 학생이 아는 것부터 풀도록 합니다.
 */
function orderQuestions(state) {
  const mine = [];
  const rest = [];
  quizQuestions.forEach((q) => {
    (isCompleted(state, q.institutionId) ? mine : rest).push(q);
  });
  return [...mine, ...rest];
}

/** 해당 문제의 근거가 된 담당관 답변(해설) 찾기 */
function findExplanation(question) {
  const inst = getInstitution(question.institutionId);
  const qa = inst?.qa.find((item) => item.id === question.relatedQaId);
  return qa ? qa.answer : '';
}

export default function QuizPanel({ onGoToCard }) {
  const { state, dispatch } = useAppState();
  // 탭에 들어온 시점의 면담 현황으로 순서를 한 번만 정합니다.
  const ordered = useMemo(() => orderQuestions(state), []); // eslint-disable-line react-hooks/exhaustive-deps

  const [index, setIndex] = useState(0);
  const question = ordered[index];
  const total = ordered.length;

  const picked = state.quizAnswers[question?.id];
  const answered = picked !== undefined;
  const correct = answered && picked === question.answerIndex;

  const solvedCount = ordered.filter((q) => state.quizAnswers[q.id] !== undefined).length;
  const correctCount = ordered.filter(
    (q) => state.quizAnswers[q.id] === q.answerIndex
  ).length;
  const finished = solvedCount === total;

  const inst = question ? getInstitution(question.institutionId) : null;

  function choose(optionIndex) {
    if (answered) return; // 한 문제당 한 번만 선택
    dispatch({ type: 'SET_QUIZ_ANSWER', questionId: question.id, optionIndex });
  }

  function handleReset() {
    if (!window.confirm('퀴즈를 처음부터 다시 풀까요?')) return;
    dispatch({ type: 'RESET_QUIZ' });
    setIndex(0);
  }

  if (!question) return null;

  return (
    <section className="quiz" aria-label="개념 확인 퀴즈">
      <h2 className="section-title">🧠 확인 퀴즈</h2>

      {/* 진행 바 */}
      <div className="quiz__progress">
        <div className="quiz__bar" aria-hidden="true">
          <span style={{ width: `${(solvedCount / total) * 100}%` }} />
        </div>
        <span className="quiz__progress-text">
          {index + 1} / {total}번 문제 · 맞힌 개수 {correctCount}개
        </span>
      </div>

      <article className="quiz__card">
        <header className="quiz__head">
          <span
            className="quiz__badge"
            style={{ background: `var(--c-inst-${inst.id})` }}
          >
            {inst.icon} {inst.shortName}
          </span>
          <span className="quiz__type">
            {question.type === 'ox' ? 'O/X 문제' : '4지선다'}
          </span>
        </header>

        <p className="quiz__question">{question.question}</p>

        <ul className={`quiz__options ${question.type === 'ox' ? 'quiz__options--ox' : ''}`}>
          {question.options.map((opt, i) => {
            let cls = 'quiz__option';
            if (answered) {
              if (i === question.answerIndex) cls += ' quiz__option--correct';
              else if (i === picked) cls += ' quiz__option--wrong';
              else cls += ' quiz__option--dim';
            }
            return (
              <li key={opt}>
                <button className={cls} onClick={() => choose(i)} disabled={answered}>
                  {question.type === 'ox' ? (
                    <span className="quiz__ox">{opt}</span>
                  ) : (
                    <>
                      <span className="quiz__num">{i + 1}</span>
                      {opt}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* 채점 결과 */}
        {answered && (
          <div className={`quiz__result ${correct ? 'quiz__result--ok' : 'quiz__result--no'}`}>
            <strong>{correct ? '⭕ 정답이에요!' : '❌ 아쉬워요, 다시 확인해볼까요?'}</strong>
            <p className="quiz__explain">{findExplanation(question)}</p>
            {!correct && (
              <button
                className="quiz__gocard"
                onClick={() => onGoToCard(question.institutionId)}
              >
                📖 {inst.shortName} 개념 카드 보러 가기
              </button>
            )}
          </div>
        )}

        {/* 이동 버튼 */}
        <footer className="quiz__nav">
          <button
            className="quiz__navbtn"
            onClick={() => setIndex((i) => i - 1)}
            disabled={index === 0}
          >
            ← 이전 문제
          </button>
          <button className="quiz__navbtn quiz__navbtn--reset" onClick={handleReset}>
            ↺ 다시 풀기
          </button>
          <button
            className="quiz__navbtn quiz__navbtn--next"
            onClick={() => setIndex((i) => i + 1)}
            disabled={index === total - 1}
          >
            다음 문제 →
          </button>
        </footer>
      </article>

      {finished && (
        <div className="quiz__done">
          🎉 {total}문제를 모두 풀었어요! <strong>{total}문제 중 {correctCount}문제</strong>를
          맞혔습니다.
          {correctCount < total && ' 틀린 문제는 위 개념 카드를 다시 읽어보세요.'}
        </div>
      )}
    </section>
  );
}
