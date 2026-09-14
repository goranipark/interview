import { useState } from 'react';
import Header from './components/Header.jsx';
import InterviewTab from './components/tab1-interview/InterviewTab.jsx';
import WorksheetAccordion from './components/tab2-worksheet/WorksheetAccordion.jsx';
import QuizTab from './components/tab3-quiz/QuizTab.jsx';
import './styles/app.css';

export default function App() {
  const [tab, setTab] = useState('interview');

  return (
    <div className="app">
      <Header activeTab={tab} onTabChange={setTab} />

      <main className="main">
        {tab === 'interview' && <InterviewTab />}
        {tab === 'worksheet' && <WorksheetAccordion />}
        {tab === 'quiz' && <QuizTab />}
        {tab === 'report' && <Placeholder name="④ 기자증 & 보고서" phase="Phase 5" />}
      </main>

      <footer className="footer">이 자료는 교육용으로 제작되었습니다.</footer>
    </div>
  );
}

function Placeholder({ name, phase }) {
  return (
    <div className="panel-placeholder">
      <p style={{ fontSize: 'var(--fs-h2)', fontWeight: 700, color: 'var(--c-text)' }}>
        {name}
      </p>
      <p>이 화면은 {phase}에서 만듭니다.</p>
    </div>
  );
}
