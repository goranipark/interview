import { useState } from 'react';
import { institutions } from '../../data/institutions.js';
import { useAppState, completedCount } from '../../state/useAppState.jsx';

function todayText() {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/** 어린이 탐구 기자증 카드 */
export default function ReporterCard() {
  const { state, dispatch } = useAppState();
  const [draft, setDraft] = useState('');

  const done = completedCount(state);
  const total = institutions.length;
  const name = state.reporterName.trim();

  return (
    <section className="press" aria-label="어린이 탐구 기자증">
      <div className="press__card">
        <header className="press__top">
          <span className="press__badge">🏛️ 초등 4학년 사회</span>
          <span className="press__no">제 {String(done).padStart(2, '0')}-{total} 호</span>
        </header>

        <h2 className="press__title">어린이 탐구 기자증</h2>

        <div className="press__body">
          <div className="press__avatar" aria-hidden="true">🧑‍💼</div>
          <div className="press__info">
            <span className="press__label">이름</span>
            {name ? (
              <strong className="press__name">{name}</strong>
            ) : (
              <form
                className="press__nameform"
                onSubmit={(e) => {
                  e.preventDefault();
                  dispatch({ type: 'SET_NAME', name: draft.trim() });
                }}
              >
                <input
                  className="press__nameinput"
                  value={draft}
                  maxLength={10}
                  placeholder="이름을 적어요"
                  onChange={(e) => setDraft(e.target.value)}
                  aria-label="기자 이름"
                />
                <button className="press__namebtn" type="submit" disabled={!draft.trim()}>
                  발급
                </button>
              </form>
            )}

            <span className="press__label">소속</span>
            <strong className="press__dept">우리 반 탐구 기자단</strong>
          </div>
        </div>

        <div className="press__stats">
          <div className="press__stat">
            <span className="press__stat-num">{done}</span>
            <span className="press__stat-label">면담한 기관</span>
          </div>
          <div className="press__stat">
            <span className="press__stat-num">{total - done}</span>
            <span className="press__stat-label">남은 기관</span>
          </div>
        </div>

        {/* 완료 진행 바 */}
        <div className="press__progress" aria-hidden="true">
          <span style={{ width: `${(done / total) * 100}%` }} />
        </div>
        <p className="press__progress-text">
          {done === total
            ? '🎉 7개 기관 면담을 모두 마쳤어요!'
            : `${total}개 기관 중 ${done}개 완료`}
        </p>

        <footer className="press__foot">
          <span>발급일 {todayText()}</span>
          <span>공공기관 주민자치 탐구 면담실</span>
        </footer>
      </div>
    </section>
  );
}
