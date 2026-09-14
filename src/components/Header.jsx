import { useState } from 'react';
import { useAppState, completedCount } from '../state/useAppState.jsx';
import { institutions } from '../data/institutions.js';

export const TABS = [
  { id: 'interview', label: '① 면담하기' },
  { id: 'worksheet', label: '② 학습지 작성' },
  { id: 'quiz', label: '③ 개념정리 & 퀴즈' },
  { id: 'report', label: '④ 기자증 & 보고서' },
];

export default function Header({ activeTab, onTabChange }) {
  const { state, dispatch } = useAppState();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(state.reporterName);

  const done = completedCount(state);

  function saveName() {
    dispatch({ type: 'SET_NAME', name: draft.trim() });
    setEditing(false);
  }

  return (
    <header className="header">
      <div className="header__top">
        <span className="header__badge">🏛️ 초등 4학년 사회</span>
        <h1 className="header__title">공공기관 주민자치 탐구 면담실</h1>

        <span className="header__spacer" />

        <div className="header__reporter">
          <span>어린이 탐구 기자</span>
          {editing ? (
            <>
              <input
                className="header__nameinput"
                value={draft}
                autoFocus
                maxLength={10}
                placeholder="이름을 적어요"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveName();
                  if (e.key === 'Escape') setEditing(false);
                }}
              />
              <button className="header__namebtn" onClick={saveName}>
                저장
              </button>
            </>
          ) : (
            <>
              <span className="header__name">
                {state.reporterName || '이름을 정해요'}
              </span>
              <button
                className="header__namebtn"
                onClick={() => {
                  setDraft(state.reporterName);
                  setEditing(true);
                }}
              >
                ✏️ 이름 변경
              </button>
            </>
          )}
        </div>

        <span className="header__count">
          완료 {done}/{institutions.length}
        </span>
      </div>

      <nav className="tabs" aria-label="학습 단계">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'tab--active' : ''}`}
            aria-current={activeTab === tab.id ? 'page' : undefined}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
