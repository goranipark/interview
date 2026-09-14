import { institutions } from '../../data/institutions.js';
import { summaryCards } from '../../data/quiz.js';
import { useAppState, isCompleted } from '../../state/useAppState.jsx';

/** 기관 역할 한 줄 요약 카드 그리드 (오답 시 이 카드로 스크롤 이동) */
export default function SummaryCards({ highlightId }) {
  const { state } = useAppState();

  return (
    <section className="summary" aria-label="공공기관 역할 정리">
      <h2 className="section-title">📖 공공기관 역할 한눈에 보기</h2>
      <div className="summary__grid">
        {summaryCards.map((card) => {
          const inst = institutions.find((i) => i.id === card.institutionId);
          const done = isCompleted(state, inst.id);

          return (
            <article
              key={card.institutionId}
              id={`summary-${card.institutionId}`}
              className={`sum-card ${highlightId === card.institutionId ? 'sum-card--highlight' : ''}`}
            >
              <span
                className="sum-card__icon"
                style={{ background: `var(--c-inst-${inst.id})` }}
                aria-hidden="true"
              >
                {inst.icon}
              </span>
              <h3 className="sum-card__name">
                {inst.shortName}
                {done && <span className="sum-card__done" title="면담 완료">✅</span>}
              </h3>
              <p className="sum-card__text">{card.summary}</p>
              <p className="sum-card__officer">
                담당관 · {inst.officer.name} {inst.officer.title}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
