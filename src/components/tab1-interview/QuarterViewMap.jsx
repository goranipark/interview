import { useEffect, useMemo, useRef, useState } from 'react';
import { institutions } from '../../data/institutions.js';
import { isCompleted, useAppState } from '../../state/useAppState.jsx';
import BlockCharacter from './BlockCharacter.jsx';
import ChatPanel from './ChatPanel.jsx';

const STEP = 3.5;
const TALK_DISTANCE = 11;

const NPC_PLACES = [
  { x: 17, y: 29, building: '주민센터', color: '#5472c8', roof: '#8299de', palette: { shirt: '#f2c84b', pants: '#3a5688' } },
  { x: 42, y: 22, building: '시청', color: '#5b73be', roof: '#91a5e0', palette: { shirt: '#5d7cdb', pants: '#293e67' } },
  { x: 75, y: 27, building: '경찰서', color: '#507fbe', roof: '#7ca8dc', palette: { shirt: '#83aef0', pants: '#263e6d', accent: '#f5d34d' } },
  { x: 85, y: 55, building: '소방서', color: '#df5b4d', roof: '#f08a77', palette: { shirt: '#e75946', pants: '#433b48', accent: '#ffd159' } },
  { x: 69, y: 78, building: '보건소', color: '#54aa7a', roof: '#82c99e', palette: { shirt: '#f1f6f2', pants: '#4a8770', accent: '#e85658' } },
  { x: 39, y: 78, building: '우체국', color: '#db5b55', roof: '#ed8b83', palette: { shirt: '#de5a50', pants: '#354a69', accent: '#f6df60' } },
  { x: 13, y: 64, building: '도서관', color: '#9c7657', roof: '#c99e76', palette: { shirt: '#7eb39a', pants: '#4c536c', accent: '#fff4c7' } },
];

const PLAYER_PALETTE = {
  skin: '#f2b68a',
  hair: '#302b35',
  shirt: '#ffd34f',
  pants: '#486da8',
  accent: '#ffffff',
};

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function QuarterViewMap() {
  const { state } = useAppState();
  const [player, setPlayer] = useState({ x: 50, y: 50 });
  const [talkingId, setTalkingId] = useState(null);
  const [walking, setWalking] = useState(false);
  const [hint, setHint] = useState('NPC 가까이 가면 대화할 수 있어요');
  const walkingTimer = useRef(null);

  const npcs = useMemo(
    () => institutions.map((institution, index) => ({ ...NPC_PLACES[index], institution })),
    [],
  );

  const nearby = useMemo(() => {
    const sorted = npcs
      .map((npc) => ({ ...npc, distance: distance(player, npc) }))
      .sort((a, b) => a.distance - b.distance);
    return sorted[0]?.distance <= TALK_DISTANCE ? sorted[0] : null;
  }, [npcs, player]);

  const talkingInstitution = talkingId
    ? institutions.find((institution) => institution.id === talkingId)
    : null;

  function move(dx, dy) {
    if (talkingId) return;
    setPlayer((current) => ({
      x: clamp(current.x + dx, 5, 95),
      y: clamp(current.y + dy, 12, 90),
    }));
    setWalking(true);
    window.clearTimeout(walkingTimer.current);
    walkingTimer.current = window.setTimeout(() => setWalking(false), 180);
  }

  function startTalk(npc = nearby) {
    if (!npc) {
      setHint('조금 더 가까이 가볼까요?');
      return;
    }
    setTalkingId(npc.institution.id);
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.target.matches('input, textarea')) return;
      if (event.key === 'Escape' && talkingId) {
        setTalkingId(null);
        return;
      }
      if ((event.key === 'Enter' || event.key === ' ') && nearby && !talkingId) {
        event.preventDefault();
        startTalk(nearby);
        return;
      }

      const keyMoves = {
        ArrowUp: [0, -STEP],
        w: [0, -STEP],
        W: [0, -STEP],
        ArrowDown: [0, STEP],
        s: [0, STEP],
        S: [0, STEP],
        ArrowLeft: [-STEP, 0],
        a: [-STEP, 0],
        A: [-STEP, 0],
        ArrowRight: [STEP, 0],
        d: [STEP, 0],
        D: [STEP, 0],
      };
      const nextMove = keyMoves[event.key];
      if (nextMove && !talkingId) {
        event.preventDefault();
        move(...nextMove);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(walkingTimer.current);
    };
  }, [nearby, talkingId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (nearby) {
      setHint(`${nearby.institution.officer.name} ${nearby.institution.officer.title}님을 만났어요!`);
    } else {
      setHint('NPC 가까이 가면 대화할 수 있어요');
    }
  }, [nearby]);

  function handleNpcClick(npc) {
    if (distance(player, npc) <= TALK_DISTANCE) {
      startTalk(npc);
    } else {
      setHint(`${npc.building} 앞까지 캐릭터를 이동해 주세요`);
    }
  }

  return (
    <section className="town-game" aria-label="우리 동네 공공기관 탐험 지도">
      <div className="town-game__topbar">
        <div>
          <span className="town-game__eyebrow">오늘의 탐구 미션</span>
          <h2>마을을 탐험하고 담당관을 만나 보세요!</h2>
        </div>
        <div className="town-game__keys" aria-label="조작 안내">
          <span className="keycap">W</span>
          <span className="keycap">A</span>
          <span className="keycap">S</span>
          <span className="keycap">D</span>
          <span>또는 방향키로 이동</span>
        </div>
      </div>

      <div className="town-map" tabIndex="0">
        <div className="town-map__sky" />
        <div className="town-map__ground">
          <span className="road road--horizontal" />
          <span className="road road--vertical" />
          <span className="crosswalk crosswalk--north" />
          <span className="crosswalk crosswalk--south" />
          <span className="pond" />
          <span className="flower-bed" />
          {[8, 25, 57, 91].map((left, index) => (
            <span key={left} className={`tree tree--${index + 1}`} style={{ left: `${left}%` }}>
              <span className="tree__top" />
              <span className="tree__trunk" />
            </span>
          ))}

          {npcs.map((npc) => {
            const completed = isCompleted(state, npc.institution.id);
            const isNear = nearby?.institution.id === npc.institution.id;
            return (
              <div
                className="map-place"
                key={npc.institution.id}
                style={{ left: `${npc.x}%`, top: `${npc.y}%`, zIndex: Math.round(npc.y) }}
              >
                <div
                  className="voxel-building"
                  style={{ '--building': npc.color, '--roof': npc.roof }}
                  aria-hidden="true"
                >
                  <span className="voxel-building__sign">{npc.institution.icon}</span>
                  <span className="voxel-building__door" />
                  <span className="voxel-building__window voxel-building__window--left" />
                  <span className="voxel-building__window voxel-building__window--right" />
                </div>

                <button
                  className={`map-npc ${isNear ? 'map-npc--near' : ''}`}
                  onClick={() => handleNpcClick(npc)}
                  aria-label={`${npc.institution.officer.name} ${npc.institution.officer.title}에게 대화하기`}
                >
                  {completed && <span className="map-npc__done">✓ 면담 완료</span>}
                  {isNear && <span className="map-npc__talk">대화하기</span>}
                  <BlockCharacter palette={npc.palette} npc />
                  <span className="map-npc__label">
                    <strong>{npc.building}</strong>
                    <small>{npc.institution.officer.name} {npc.institution.officer.title}</small>
                  </span>
                </button>
              </div>
            );
          })}

          <div
            className="map-player"
            style={{ left: `${player.x}%`, top: `${player.y}%`, zIndex: Math.round(player.y) + 2 }}
            aria-label="내 캐릭터"
          >
            <span className="map-player__tag">나</span>
            <BlockCharacter palette={PLAYER_PALETTE} walking={walking} />
          </div>
        </div>

        <div className={`encounter-hint ${nearby ? 'encounter-hint--active' : ''}`}>
          <span aria-hidden="true">{nearby ? '💬' : '🧭'}</span>
          <span>{hint}</span>
          {nearby && (
            <button onClick={() => startTalk(nearby)}>
              대화하기 <kbd>Enter</kbd>
            </button>
          )}
        </div>

        <div className="move-pad" aria-label="캐릭터 이동 버튼">
          <button className="move-pad__up" onClick={() => move(0, -STEP)} aria-label="위로 이동">▲</button>
          <button className="move-pad__left" onClick={() => move(-STEP, 0)} aria-label="왼쪽으로 이동">◀</button>
          <button className="move-pad__down" onClick={() => move(0, STEP)} aria-label="아래로 이동">▼</button>
          <button className="move-pad__right" onClick={() => move(STEP, 0)} aria-label="오른쪽으로 이동">▶</button>
        </div>
      </div>

      {talkingInstitution && (
        <div className="dialog-layer" role="dialog" aria-modal="true" aria-label={`${talkingInstitution.name} 면담 창`}>
          <button className="dialog-layer__backdrop" onClick={() => setTalkingId(null)} aria-label="대화 닫기" />
          <div className="dialog-layer__panel">
            <div className="dialog-layer__titlebar">
              <div>
                <span>📍 {talkingInstitution.shortName} 앞</span>
                <strong>담당관과 면담 중</strong>
              </div>
              <button onClick={() => setTalkingId(null)} aria-label="대화창 닫기">✕</button>
            </div>
            <ChatPanel key={talkingInstitution.id} institution={talkingInstitution} />
          </div>
        </div>
      )}
    </section>
  );
}
