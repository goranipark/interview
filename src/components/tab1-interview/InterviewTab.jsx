import { useState } from 'react';
import InstitutionList from './InstitutionList.jsx';
import ChatPanel from './ChatPanel.jsx';
import { institutions } from '../../data/institutions.js';
import '../../styles/interview.css';

export default function InterviewTab() {
  const [selectedId, setSelectedId] = useState(institutions[0].id);
  const institution = institutions.find((i) => i.id === selectedId);

  return (
    <>
      <div className="notice">
        <span className="notice__icon" aria-hidden="true">ℹ️</span>
        <div>
          <strong>여러분은 오늘 '어린이 탐구 기자'예요.</strong> 왼쪽에서 기관을 고르고,
          담당관님께 궁금한 것을 자유롭게 물어보세요. 좋은 답변을 들으면{' '}
          <strong>📎 학습지에 스크랩</strong> 버튼을 눌러 두었다가 ② 학습지 탭에서 정리하면 됩니다.
        </div>
      </div>

      <div className="interview-layout">
        <InstitutionList selectedId={selectedId} onSelect={setSelectedId} />
        <ChatPanel key={institution.id} institution={institution} />
      </div>
    </>
  );
}
