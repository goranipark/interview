import { useState } from 'react';
import { institutions } from '../../data/institutions.js';
import { useAppState, isCompleted, completedCount } from '../../state/useAppState.jsx';
import '../../styles/worksheet.css';

export default function WorksheetAccordion() {
  const { state } = useAppState();
  // 처음 열었을 때 이미 면담한 기관은 펼쳐서 보여줍니다.
  const [openIds, setOpenIds] = useState(() =>
    institutions.filter((i) => isCompleted(state, i.id)).map((i) => i.id)
  );

  const done = completedCount(state);

  function toggle(id) {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <>
      <div className="notice">
        <span className="notice__icon" aria-hidden="true">📝</span>
        <div>
          <strong>면담에서 스크랩한 내용이 여기에 자동으로 모입니다.</strong> 기관 이름을 눌러
          펼친 뒤, 아래 <strong>'내 생각 적어보기'</strong> 칸에 알게 된 점이나 느낀 점을 적어
          보세요. 적은 내용은 ④ 보고서에 그대로 실립니다.
        </div>
      </div>

      {done === 0 && (
        <div className="panel-placeholder" style={{ marginBottom: 'var(--space-5)' }}>
          아직 스크랩한 내용이 없어요. <strong>① 면담하기</strong> 탭에서 담당관님께 질문하고
          <strong> 📎 학습지에 스크랩</strong> 버튼을 눌러 보세요.
        </div>
      )}

      <div className="worksheet">
        {institutions.map((inst) => (
          <WorksheetCard
            key={inst.id}
            institution={inst}
            open={openIds.includes(inst.id)}
            onToggle={() => toggle(inst.id)}
          />
        ))}
      </div>
    </>
  );
}

function WorksheetCard({ institution, open, onToggle }) {
  const { state, dispatch } = useAppState();
  const scraps = state.scraps[institution.id] || [];
  const done = scraps.length > 0;
  const reflection = state.reflections[institution.id] || '';

  return (
    <section className={`ws-card ${done ? '' : 'ws-card--empty'}`}>
      <h3 className="ws-card__headwrap">
        <button
          className="ws-card__head"
          onClick={onToggle}
          disabled={!done}
          aria-expanded={done ? open : undefined}
        >
          <span
            className="ws-card__icon"
            style={{ background: done ? `var(--c-inst-${institution.id})` : '#C9D0DE' }}
            aria-hidden="true"
          >
            {institution.icon}
          </span>
          <span className="ws-card__name">{institution.shortName}</span>
          {done ? (
            <>
              <span className="ws-card__count">스크랩 {scraps.length}개</span>
              <span className="ws-card__arrow" aria-hidden="true">{open ? '▾' : '▸'}</span>
            </>
          ) : (
            <span className="ws-card__todo">아직 면담 전이에요</span>
          )}
        </button>
      </h3>

      {done && open && (
        <div className="ws-card__body">
          <ol className="ws-qa">
            {scraps.map((s, idx) => (
              <li key={s.qaId} className="ws-qa__item">
                <div className="ws-qa__q">
                  <span className="ws-qa__label">질문 {idx + 1}</span>
                  {s.question}
                </div>
                <div className="ws-qa__a">
                  <span className="ws-qa__label ws-qa__label--a">
                    {institution.officer.name} {institution.officer.title}
                  </span>
                  {s.answer}
                </div>
                <button
                  className="ws-qa__remove"
                  onClick={() => {
                    if (window.confirm('이 스크랩을 학습지에서 지울까요?')) {
                      dispatch({
                        type: 'REMOVE_SCRAP',
                        institutionId: institution.id,
                        qaId: s.qaId,
                      });
                    }
                  }}
                >
                  🗑 지우기
                </button>
              </li>
            ))}
          </ol>

          <label className="ws-reflect">
            <span className="ws-reflect__label">
              ✏️ 내 생각 적어보기
              <em>
                — {institution.shortName}은(는) 우리 생활에 어떤 도움을 주나요? 새로 알게 된 점은
                무엇인가요?
              </em>
            </span>
            <textarea
              className="ws-reflect__input"
              rows={4}
              value={reflection}
              placeholder="예) 주민센터가 서류만 떼주는 곳인 줄 알았는데, 주민들이 직접 동네 일을 의논하는 것도 돕는다는 걸 알게 되었다."
              onChange={(e) =>
                dispatch({
                  type: 'SET_REFLECTION',
                  institutionId: institution.id,
                  text: e.target.value,
                })
              }
            />
            <span className="ws-reflect__hint">
              {reflection.trim()
                ? '✅ 자동으로 저장되었어요.'
                : '적은 내용은 자동으로 저장됩니다.'}
            </span>
          </label>
        </div>
      )}
    </section>
  );
}
