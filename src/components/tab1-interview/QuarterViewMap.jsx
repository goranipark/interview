import { useEffect, useMemo, useRef, useState } from 'react';
import { institutions } from '../../data/institutions.js';
import { isCompleted, useAppState } from '../../state/useAppState.jsx';
import ChatPanel from './ChatPanel.jsx';

import VoxelScene from './VoxelScene.jsx';
import { PLACES, SPAWN, canTalk, distance, movePlayer, project } from './townWorld.js';

const STEP = 9;

export default function QuarterViewMap() {
  const { state } = useAppState();
  const [player, setPlayer] = useState(SPAWN);
  const [talkingId, setTalkingId] = useState(null);
  const [walking, setWalking] = useState(false);
  const [hint, setHint] = useState('NPC 가까이 가면 대화할 수 있어요');
  const walkingTimer = useRef(null);
  const mapRef = useRef(null);
  const viewportRef = useRef(null);
  const dialogRef = useRef(null);
  const heldKeys = useRef(new Set());

  const npcs = useMemo(
    () => institutions.map((institution, index) => ({ ...PLACES[index], institution })),
    [],
  );

  const nearby = useMemo(() => {
    const sorted = npcs
      .map((npc) => ({ ...npc, distance: distance(player, npc.npc) }))
      .sort((a, b) => a.distance - b.distance);
    return sorted.find((npc) => canTalk(player, npc.npc)) || null;
  }, [npcs, player]);

  const nearbyRef = useRef(null);
  nearbyRef.current = nearby;

  const talkingInstitution = talkingId
    ? institutions.find((institution) => institution.id === talkingId)
    : null;

  useEffect(() => {
    const viewport = viewportRef.current;
    function follow() {
      const scene = viewport.querySelector('svg');
      const playerX = project(player).x;
      const officer = nearbyRef.current;
      const centerX = officer ? (playerX + project(officer.npc).x) / 2 : playerX;
      viewport.scrollLeft = centerX * scene.clientWidth / 1040 - viewport.clientWidth / 2;
    }
    follow();
    const observer = new ResizeObserver(follow);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [player]);

  function move(dx, dy) {
    if (talkingId) return;
    setPlayer((current) => movePlayer(current, dx, dy));
    setWalking(true);
    window.clearTimeout(walkingTimer.current);
    walkingTimer.current = window.setTimeout(() => { setWalking(false); walkingTimer.current = null; }, 180);
  }

  function startTalk(npc = nearby) {
    if (!npc) {
      setHint('조금 더 가까이 가볼까요?');
      return;
    }
    setTalkingId(npc.institution.id);
  }

  useEffect(() => {
    const directions = {
      ArrowUp: [-1, -1], w: [-1, -1],
      ArrowDown: [1, 1], s: [1, 1],
      ArrowLeft: [-1, 1], a: [-1, 1],
      ArrowRight: [1, -1], d: [1, -1],
    };
    function keyDown(event) {
      if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || talkingId) return;
      if (event.target.closest('input, textarea, select, [role="textbox"], [contenteditable]:not([contenteditable="false"])')) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (directions[key] && !talkingId) {
        event.preventDefault();
        if (!heldKeys.current.has(key)) {
          const [dx, dy] = directions[key];
          setPlayer((current) => movePlayer(current, dx * 3, dy * 3));
        }
        heldKeys.current.add(key);
      }
      if ((key === 'Enter' || key === ' ') && !event.target.closest('button, [role="button"], a')) {
        event.preventDefault();
        startTalk(nearbyRef.current);
      }
    }
    function keyUp(event) { heldKeys.current.delete(event.key.length === 1 ? event.key.toLowerCase() : event.key); }
    function clear() { heldKeys.current.clear(); setWalking(false); }
    let frame;
    let previous = 0;
    function tick(time) {
      const dt = Math.min((time - (previous || time)) / 1000, 0.04);
      previous = time;
      let dx = 0, dy = 0;
      if (!talkingId) heldKeys.current.forEach((key) => { dx += directions[key][0]; dy += directions[key][1]; });
      const length = Math.hypot(dx, dy);
      if (length) {
        setPlayer((current) => movePlayer(current, dx / length * 135 * dt, dy / length * 135 * dt));
        setWalking(true);
      } else if (!walkingTimer.current) setWalking(false);
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    // This listener exists only while the interview map is mounted.
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    window.addEventListener('blur', clear);
    window.addEventListener('focusin', clear);
    document.addEventListener('visibilitychange', clear);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
      window.removeEventListener('blur', clear);
      window.removeEventListener('focusin', clear);
      document.removeEventListener('visibilitychange', clear);
      heldKeys.current.clear();
    };
  }, [talkingId]);

  useEffect(() => () => window.clearTimeout(walkingTimer.current), []);

  useEffect(() => {
    if (!talkingId) return;
    const previousFocus = document.activeElement;
    const panel = dialogRef.current;
    panel.querySelector('button')?.focus();
    function handleDialogKey(event) {
      if (event.key === 'Escape') { event.preventDefault(); setTalkingId(null); }
      if (event.key !== 'Tab') return;
      const focusable = [...panel.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea, [tabindex="0"]')];
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    panel.addEventListener('keydown', handleDialogKey);
    return () => { panel.removeEventListener('keydown', handleDialogKey); previousFocus?.focus(); };
  }, [talkingId]);

  useEffect(() => {
    if (nearby) {
      setHint(`${nearby.institution.officer.name} ${nearby.institution.officer.title}님을 만났어요!`);
    } else {
      setHint('NPC 가까이 가면 대화할 수 있어요');
    }
  }, [nearby]);

  function handleNpcClick(npc) {
    if (canTalk(player, npc.npc)) {
      startTalk(npc);
    } else {
      setHint(`${npc.name} 앞까지 캐릭터를 이동해 주세요`);
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

      <div className="town-map" tabIndex="0" ref={mapRef}
        onPointerDown={(event) => { if (!event.target.closest('button, [role="button"]')) mapRef.current.focus(); }}>
        <div className="town-map__caption"><span>우리 동네 탐험</span><small>방향키 · WASD로 바로 이동 / 가까이에서 Enter 대화</small></div>
        <div className="town-viewport" ref={viewportRef}><VoxelScene player={player} npcs={npcs} nearby={nearby} walking={walking}
          onNpcClick={handleNpcClick} completed={(npc) => isCompleted(state, npc.institution.id)} /></div>

        <div className="town-map__controls">
        <div className={`encounter-hint ${nearby ? 'encounter-hint--active' : ''}`}>
          <span aria-hidden="true">{nearby ? '💬' : '🧭'}</span>
          <span role="status" aria-live="polite">{hint}</span>
          {nearby && (
            <button onClick={() => startTalk(nearby)}>
              대화하기 <kbd>Enter</kbd>
            </button>
          )}
        </div>

        <div className="move-pad" aria-label="캐릭터 이동 버튼">
          <button className="move-pad__up" onClick={() => move(-STEP, -STEP)} aria-label="위로 이동">▲</button>
          <button className="move-pad__left" onClick={() => move(-STEP, STEP)} aria-label="왼쪽으로 이동">◀</button>
          <button className="move-pad__down" onClick={() => move(STEP, STEP)} aria-label="아래로 이동">▼</button>
          <button className="move-pad__right" onClick={() => move(STEP, -STEP)} aria-label="오른쪽으로 이동">▶</button>
        </div>
        </div>
      </div>

      {talkingInstitution && (
        <div className="dialog-layer" role="dialog" aria-modal="true" aria-label={`${talkingInstitution.name} 면담 창`}>
          <button className="dialog-layer__backdrop" onClick={() => setTalkingId(null)} aria-label="대화 닫기" />
          <div className="dialog-layer__panel" ref={dialogRef}>
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
