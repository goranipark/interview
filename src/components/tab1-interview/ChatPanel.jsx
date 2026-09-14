import { useEffect, useRef, useState } from 'react';
import ChatBubble from './ChatBubble.jsx';
import { useAppState } from '../../state/useAppState.jsx';
import { FALLBACK_MESSAGES } from '../../data/institutions.js';
import { matchAnswer, pickRandom, pickSuggestions } from '../../utils/matchAnswer.js';

let messageSeq = 0;
const nextId = () => `m${Date.now()}-${messageSeq++}`;

/** 기관을 처음 열었을 때 보여줄 인사말 메시지 */
function makeIntroMessage(institution) {
  return { id: nextId(), role: 'officer', text: institution.intro };
}

export default function ChatPanel({ institution }) {
  const { state, dispatch } = useAppState();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const messages = state.chats[institution.id] || [];

  // 이 기관을 처음 열었으면 담당관 인사말로 대화를 시작
  useEffect(() => {
    if (!state.chats[institution.id]) {
      dispatch({
        type: 'RESET_CHAT',
        institutionId: institution.id,
        messages: [makeIntroMessage(institution)],
      });
    }
  }, [institution.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // 새 말풍선이 생기면 아래로 자동 스크롤
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, institution.id]);

  function send(rawText) {
    const question = rawText.trim();
    if (!question) return;

    const studentMsg = { id: nextId(), role: 'student', text: question };
    const hit = matchAnswer(question, institution.qa);

    const officerMsg = hit
      ? {
          id: nextId(),
          role: 'officer',
          text: hit.answer,
          qaId: hit.id,
          question, // 스크랩할 때 "학생이 한 질문"으로 함께 저장
        }
      : {
          id: nextId(),
          role: 'officer',
          text: pickRandom(FALLBACK_MESSAGES),
          suggestions: pickSuggestions(institution.suggestedQuestions, 3),
        };

    dispatch({
      type: 'ADD_MESSAGES',
      institutionId: institution.id,
      messages: [studentMsg, officerMsg],
    });
    setInput('');
  }

  function handleReset() {
    if (!window.confirm('이 기관과의 대화를 처음부터 다시 시작할까요?\n(스크랩한 내용은 그대로 남아요)')) return;
    dispatch({
      type: 'RESET_CHAT',
      institutionId: institution.id,
      messages: [makeIntroMessage(institution)],
    });
  }

  return (
    <section className="chat" aria-label={`${institution.name} 면담`}>
      {/* 담당관 헤더 — 정부 누리집의 '담당부서/담당자 표기' 관례 차용 */}
      <header className="chat__header">
        <span
          className="chat__avatar"
          style={{ background: `var(--c-inst-${institution.id})` }}
          aria-hidden="true"
        >
          {institution.icon}
        </span>
        <div className="chat__who">
          <strong className="chat__officer">
            {institution.officer.name} {institution.officer.title}
          </strong>
          <span className="chat__inst">{institution.name}</span>
        </div>
        <button className="chat__reset" onClick={handleReset}>
          ↺ 대화 다시 시작
        </button>
      </header>

      {/* 말풍선 영역 */}
      <div className="chat__log" ref={scrollRef}>
        {messages.map((m) => (
          <ChatBubble
            key={m.id}
            message={m}
            institution={institution}
            onSuggestionClick={send}
          />
        ))}
      </div>

      {/* 입력 영역 */}
      <form
        className="chat__form"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          className="chat__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`${institution.officer.name} ${institution.officer.title}께 궁금한 것을 물어보세요`}
          aria-label="질문 입력"
        />
        <button className="chat__send" type="submit" disabled={!input.trim()}>
          전송
        </button>
      </form>

      {/* 추천 질문 칩 — 클릭하면 바로 전송 */}
      <div className="chat__suggests">
        <span className="chat__suggests-label">추천 질문</span>
        {institution.suggestedQuestions.map((q) => (
          <button key={q} className="suggest-chip" onClick={() => send(q)}>
            {q}
          </button>
        ))}
      </div>
    </section>
  );
}
