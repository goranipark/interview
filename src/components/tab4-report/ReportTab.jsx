import ReporterCard from './ReporterCard.jsx';
import ReportSummary from './ReportSummary.jsx';
import { useAppState, completedCount } from '../../state/useAppState.jsx';
import '../../styles/report.css';

export default function ReportTab() {
  const { state } = useAppState();
  const hasContent = completedCount(state) > 0;

  return (
    <>
      <div className="notice no-print">
        <span className="notice__icon" aria-hidden="true">🪪</span>
        <div>
          <strong>오늘의 탐구를 마무리해요.</strong> 왼쪽은 나의 기자증, 오른쪽은 지금까지
          면담하고 적은 내용을 모은 보고서입니다. 아래 <strong>🖨 인쇄하기</strong> 버튼을 누르면
          기자증과 보고서만 깔끔하게 인쇄됩니다.
        </div>
      </div>

      <div className="report-layout">
        <ReporterCard />
        <ReportSummary />
      </div>

      <div className="print-bar no-print">
        <button
          className="print-btn"
          onClick={() => window.print()}
          disabled={!hasContent}
          title={hasContent ? '' : '면담을 먼저 진행해 주세요'}
        >
          🖨 기자증 · 보고서 인쇄하기
        </button>
        <span className="print-hint">
          {hasContent
            ? '인쇄 창에서 「PDF로 저장」을 고르면 파일로도 보관할 수 있어요.'
            : '① 면담하기에서 스크랩을 하면 인쇄할 수 있어요.'}
        </span>
      </div>
    </>
  );
}
