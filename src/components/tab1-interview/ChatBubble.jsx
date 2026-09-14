import { useAppState } from '../../state/useAppState.jsx';

/** 브라우저 내장 음성 합성(Web Speech API)으로 답변을 읽어줍니다. */
function speak(text) {
  if (!('speechSynthesis' in window)) {
    alert('이 브라우저는 음성 읽어주기를 지원하지 않아요. 크롬이나 엣지에서 열어보세요.');
    return;
  }
  window.speechSynthesis.cancel(); // 이전에 읽던 것 중단
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ko-KR';
  utter.rate = 0.95; // 초등학생이 따라 듣기 좋게 살짝 느리게
  window.speechSynthesis.speak(utter);
}

export default function ChatBubble({ message, institution, onSuggestionClick }) {
  const { state, dispatch } = useAppState();

  if (message.role === 'student') {
    return (
      <div className="bubble-row bubble-row--student">
        <div className="bubble bubble--student">{message.text}</div>
      </div>
    );
  }

  const scraps = state.scraps[institution.id] || [];
  const alreadyScrapped = message.qaId && scraps.some((s) => s.qaId === message.qaId);

  function handleScrap() {
    dispatch({
      type: 'ADD_SCRAP',
      institutionId: institution.id,
      item: {
        qaId: message.qaId,
        question: message.question,
        answer: message.text,
      },
    });
  }

  return (
    <div className="bubble-row bubble-row--officer">
      <span className="bubble__avatar" aria-hidden="true">
        {institution.icon}
      </span>

      <div className="bubble-group">
        <div className="bubble bubble--officer">{message.text}</div>

        <div className="bubble__actions">
          {message.qaId && (
            <button
              className={`chip-btn ${alreadyScrapped ? 'chip-btn--done' : 'chip-btn--scrap'}`}
              onClick={handleScrap}
              disabled={alreadyScrapped}
            >
              {alreadyScrapped ? '✅ 스크랩 완료' : '📎 학습지에 스크랩'}
            </button>
          )}
          <button className="chip-btn" onClick={() => speak(message.text)}>
            🔊 음성 듣기
          </button>
        </div>

        {/* 매칭 실패했을 때 함께 보여주는 추천 질문 3개 */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="bubble__suggestions">
            {message.suggestions.map((q) => (
              <button key={q} className="suggest-chip" onClick={() => onSuggestionClick(q)}>
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
