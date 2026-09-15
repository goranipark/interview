import { useState } from 'react';
import Header from './components/Header.jsx';
import InterviewTab from './components/tab1-interview/InterviewTab.jsx';
import WorksheetAccordion from './components/tab2-worksheet/WorksheetAccordion.jsx';
import QuizTab from './components/tab3-quiz/QuizTab.jsx';
import ReportTab from './components/tab4-report/ReportTab.jsx';
import './styles/app.css';

export default function App() {
  const [tab, setTab] = useState('interview');

  return (
    <div className="app">
      <Header activeTab={tab} onTabChange={setTab} />

      <main className={`main ${tab === 'interview' ? 'main--interview' : ''}`}>
        {tab === 'interview' && <InterviewTab />}
        {tab === 'worksheet' && <WorksheetAccordion />}
        {tab === 'quiz' && <QuizTab />}
        {tab === 'report' && <ReportTab />}
      </main>

      <footer className="footer">
        <p className="footer__note">
          이 자료는 교육용으로 제작되었습니다. 수업 목적으로 자유롭게 쓰고 고쳐 쓸 수 있습니다.
        </p>
        <p className="footer__credit">© 2026 goranipark</p>
      </footer>
    </div>
  );
}
