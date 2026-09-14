// 앱 전체가 함께 쓰는 상태(스크랩, 기자 이름, 소감, 퀴즈 결과)를
// React Context + useReducer 로 관리합니다. 별도 상태 관리 라이브러리는 쓰지 않습니다.
// 새로고침해도 유지되도록 localStorage에 저장합니다.

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const STORAGE_KEY = 'gonggong-interview-v1';

const initialState = {
  reporterName: '',
  // { [기관id]: [{ qaId, question, answer }] }
  scraps: {},
  // { [기관id]: '내 생각 서술형 답변' }
  reflections: {},
  // { [문제id]: 고른 보기 index }
  quizAnswers: {},
  // { [기관id]: [{ id, role, text, ... }] } — 기관별 채팅 기록
  chats: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...initialState, ...action.payload };

    case 'SET_NAME':
      return { ...state, reporterName: action.name };

    case 'ADD_SCRAP': {
      const { institutionId, item } = action;
      const list = state.scraps[institutionId] || [];
      // 같은 답변을 두 번 스크랩하지 않도록 방지
      if (list.some((s) => s.qaId === item.qaId)) return state;
      return {
        ...state,
        scraps: { ...state.scraps, [institutionId]: [...list, item] },
      };
    }

    case 'REMOVE_SCRAP': {
      const { institutionId, qaId } = action;
      const list = state.scraps[institutionId] || [];
      return {
        ...state,
        scraps: {
          ...state.scraps,
          [institutionId]: list.filter((s) => s.qaId !== qaId),
        },
      };
    }

    case 'SET_REFLECTION':
      return {
        ...state,
        reflections: { ...state.reflections, [action.institutionId]: action.text },
      };

    case 'ADD_MESSAGES': {
      const { institutionId, messages } = action;
      const list = state.chats[institutionId] || [];
      return {
        ...state,
        chats: { ...state.chats, [institutionId]: [...list, ...messages] },
      };
    }

    // 한 기관의 대화를 인사말만 남기고 처음부터 다시 시작
    case 'RESET_CHAT':
      return {
        ...state,
        chats: { ...state.chats, [action.institutionId]: action.messages },
      };

    case 'SET_QUIZ_ANSWER':
      return {
        ...state,
        quizAnswers: { ...state.quizAnswers, [action.questionId]: action.optionIndex },
      };

    case 'RESET_QUIZ':
      return { ...state, quizAnswers: {} };

    case 'RESET_ALL':
      return { ...initialState };

    default:
      return state;
  }
}

function loadFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // 저장소를 못 쓰는 환경(사생활 보호 모드 등)에서도 앱은 그냥 동작해야 함
    return null;
  }
}

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = loadFromStorage();
    return saved ? { ...init, ...saved } : init;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* 저장 실패는 무시 (메모리 상태로만 동작) */
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState는 AppStateProvider 안에서만 쓸 수 있습니다.');
  return ctx;
}

/** 스크랩이 1개 이상인 기관 = 면담 완료 */
export function isCompleted(state, institutionId) {
  return (state.scraps[institutionId] || []).length > 0;
}

/** 완료한 기관 수 */
export function completedCount(state) {
  return Object.values(state.scraps).filter((list) => list && list.length > 0).length;
}
