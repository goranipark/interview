import { institutions } from '../../data/institutions.js';
import { useAppState, isCompleted } from '../../state/useAppState.jsx';

export default function InstitutionList({ selectedId, onSelect }) {
  const { state } = useAppState();

  return (
    <nav className="inst-list" aria-label="면담할 공공기관 선택">
      <h2 className="inst-list__title">어디를 면담할까요?</h2>
      <ul className="inst-list__items">
        {institutions.map((inst) => {
          const done = isCompleted(state, inst.id);
          const active = inst.id === selectedId;
          const scrapCount = (state.scraps[inst.id] || []).length;

          return (
            <li key={inst.id}>
              <button
                className={`inst-item ${active ? 'inst-item--active' : ''}`}
                aria-current={active ? 'true' : undefined}
                onClick={() => onSelect(inst.id)}
              >
                <span
                  className="inst-item__icon"
                  style={{ background: `var(--c-inst-${inst.id})` }}
                  aria-hidden="true"
                >
                  {inst.icon}
                </span>
                <span className="inst-item__text">
                  <span className="inst-item__name">{inst.shortName}</span>
                  <span className="inst-item__officer">
                    {inst.officer.name} {inst.officer.title}
                  </span>
                </span>
                {done && (
                  <span className="inst-item__done" title={`스크랩 ${scrapCount}개`}>
                    ✅
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
