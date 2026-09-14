import { institutions } from '../../data/institutions.js';
import { quizQuestions, summaryCards } from '../../data/quiz.js';
import { useAppState, completedCount } from '../../state/useAppState.jsx';

/** ② 학습지 내용을 취합한 최종 탐구 보고서 */
export default function ReportSummary() {
  const { state } = useAppState();

  const visited = institutions.filter((inst) => (state.scraps[inst.id] || []).length > 0);
  const done = completedCount(state);
  const name = state.reporterName.trim() || '어린이 탐구 기자';

  const solved = quizQuestions.filter((q) => state.quizAnswers[q.id] !== undefined).length;
  const correct = quizQuestions.filter(
    (q) => state.quizAnswers[q.id] === q.answerIndex
  ).length;

  return (
    <section className="report" aria-label="탐구 보고서">
      <header className="report__head">
        <h2 className="report__title">공공기관 탐구 보고서</h2>
        <p className="report__meta">
          작성자 <strong>{name}</strong> · 면담한 기관 {done}곳
          {solved > 0 && ` · 퀴즈 ${solved}문제 중 ${correct}문제 정답`}
        </p>
      </header>

      {visited.length === 0 ? (
        <div className="panel-placeholder">
          아직 면담한 기관이 없어요. <strong>① 면담하기</strong> 탭에서 담당관님을 만나고
          답변을 스크랩하면 보고서가 자동으로 만들어집니다.
        </div>
      ) : (
        <>
          {visited.map((inst) => {
            const scraps = state.scraps[inst.id] || [];
            const reflection = (state.reflections[inst.id] || '').trim();
            const summary = summaryCards.find((c) => c.institutionId === inst.id)?.summary;

            return (
              <article key={inst.id} className="report__inst">
                <h3 className="report__inst-name">
                  <span
                    className="report__inst-icon"
                    style={{ background: `var(--c-inst-${inst.id})` }}
                    aria-hidden="true"
                  >
                    {inst.icon}
                  </span>
                  {inst.shortName}
                  <em className="report__inst-officer">
                    {inst.officer.name} {inst.officer.title} 면담
                  </em>
                </h3>

                <p className="report__lead">{summary}</p>

                <h4 className="report__sub">알아낸 내용</h4>
                <ul className="report__facts">
                  {scraps.map((s) => (
                    <li key={s.qaId}>
                      <span className="report__q">{s.question}</span>
                      <span className="report__a">{s.answer}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="report__sub">내 생각</h4>
                {reflection ? (
                  <p className="report__reflect">{reflection}</p>
                ) : (
                  <p className="report__reflect report__reflect--empty">
                    (② 학습지 탭에서 '내 생각 적어보기'를 작성하면 여기에 실립니다.)
                  </p>
                )}
              </article>
            );
          })}

          <footer className="report__foot">
            이 보고서는 학생이 직접 면담하고 스크랩한 내용으로 만들어졌습니다. ·
            공공기관 주민자치 탐구 면담실
          </footer>
        </>
      )}
    </section>
  );
}
