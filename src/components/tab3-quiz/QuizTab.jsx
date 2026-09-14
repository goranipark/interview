import { useState } from 'react';
import SummaryCards from './SummaryCards.jsx';
import QuizPanel from './QuizPanel.jsx';
import '../../styles/quiz.css';

export default function QuizTab() {
  const [highlightId, setHighlightId] = useState(null);

  /** 오답일 때 해당 기관의 개념 카드로 스크롤 이동 + 잠시 강조 */
  function goToCard(institutionId) {
    const el = document.getElementById(`summary-${institutionId}`);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightId(institutionId);
    window.setTimeout(() => setHighlightId(null), 2500);
  }

  return (
    <>
      <div className="notice">
        <span className="notice__icon" aria-hidden="true">🧠</span>
        <div>
          <strong>면담에서 알게 된 내용을 정리하고 확인해 봐요.</strong> 아래 카드로 7개 기관의
          역할을 한눈에 살펴본 뒤, 퀴즈를 풀어 보세요. 틀린 문제는{' '}
          <strong>'개념 카드 보러 가기'</strong> 버튼으로 바로 확인할 수 있어요.
        </div>
      </div>

      <SummaryCards highlightId={highlightId} />
      <QuizPanel onGoToCard={goToCard} />
    </>
  );
}
