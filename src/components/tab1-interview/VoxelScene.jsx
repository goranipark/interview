import { PLACES, ROADS, project } from './townWorld.js';

function points(vertices) { return vertices.map((p) => `${p.x},${p.y}`).join(' '); }
function Tile({ x, y, width, depth, fill, ...props }) {
  return <polygon points={points([{ x, y }, { x: x + width, y },
    { x: x + width, y: y + depth }, { x, y: y + depth }].map((p) => project(p)))} fill={fill} {...props} />;
}
function Cube({ x, y, width, depth, height, base = 0, color }) {
  const corners = [{ x, y }, { x: x + width, y }, { x: x + width, y: y + depth }, { x, y: y + depth }];
  const top = corners.map((p) => project(p, height + base));
  const bottom = corners.map((p) => project(p, base));
  return <g>
    <polygon points={points([top[1], top[2], bottom[2], bottom[1]])} fill={color} />
    <polygon points={points([top[1], top[2], bottom[2], bottom[1]])} fill="#152a45" opacity=".23" />
    <polygon points={points([top[2], top[3], bottom[3], bottom[2]])} fill={color} />
    <polygon points={points(top)} fill={color} />
    <polygon points={points(top)} fill="white" opacity=".22" />
  </g>;
}
function Person({ point, color, walking = false, player = false }) {
  const foot = project(point);
  return <g>
    <ellipse cx={foot.x} cy={foot.y + 2} rx="17" ry="7" fill="#294633" opacity=".22" />
    {player && <ellipse cx={foot.x} cy={foot.y + 2} rx="22" ry="10" fill="none" stroke="#fff5b1" strokeWidth="3" />}
    <g className={walking ? 'voxel-person voxel-person--walking' : 'voxel-person'}>
      <Cube x={point.x - 10} y={point.y - 5} width={8} depth={10} height={12} color="#344866" />
      <Cube x={point.x + 2} y={point.y - 5} width={8} depth={10} height={12} color="#344866" />
      <Cube x={point.x - 12} y={point.y - 8} width={24} depth={16} height={20} base={12} color={color} />
      <Cube x={point.x - 17} y={point.y - 5} width={5} depth={10} height={15} base={13} color="#f0bc95" />
      <Cube x={point.x + 12} y={point.y - 5} width={5} depth={10} height={15} base={13} color="#f0bc95" />
      <Cube x={point.x - 13} y={point.y - 12} width={26} depth={24} height={21} base={34} color="#f0bc95" />
      <Cube x={point.x - 14} y={point.y - 13} width={28} depth={26} height={7} base={55} color="#3c3642" />
      <circle cx={foot.x - 13} cy={foot.y - 39} r="2" fill="#303344" />
      <circle cx={foot.x - 4} cy={foot.y - 35} r="2" fill="#303344" />
    </g>
  </g>;
}
export default function VoxelScene({ player, npcs, nearby, walking, onNpcClick, completed }) {
  const entities = PLACES.map((place, index) => ({ type: 'building', point: { x: place.x, y: place.y + 35 }, place, index }));
  npcs.forEach((npc, index) => entities.push({ type: 'npc', point: npc.npc, npc, index }));
  entities.push({ type: 'player', point: player });
  entities.sort((a, b) => (a.point.x + a.point.y) - (b.point.x + b.point.y));
  return <svg className="town-scene" viewBox="0 0 1040 690" role="group" aria-label="쿼터뷰 마을 지도. 방향키로 이동하고 담당관 가까이에서 Enter로 대화하세요.">
    <path d="M52 312L520 552L988 312V330L520 570L52 330Z" fill="#73965c" />
    <Tile x={0} y={0} width={600} depth={600} fill="#b9d893" />
    {Array.from({ length: 12 }, (_, i) => Array.from({ length: 12 }, (_, j) =>
      <Tile key={`${i}-${j}`} x={i * 50} y={j * 50} width={50} depth={50} fill={(i + j) % 2 ? '#ffffff08' : '#688d4208'} />))}
    {ROADS.map((road, i) => <Tile key={i} {...road} fill="#a6b3b5" stroke="#e8e4ce" strokeWidth="7" />)}
    {Array.from({ length: 15 }, (_, i) => <Tile key={i} x={i * 40} y={269} width={18} depth={2} fill="#fff4ba" />)}
    {[213, 318].map((y) => Array.from({ length: 6 }, (_, i) => <Tile key={`${y}-${i}`} x={294 + i * 9} y={y} width={5} depth={15} fill="#fffbea" />))}
    {PLACES.map((p) => <g key={p.name}>
      <Tile x={p.x - 51} y={p.y - 42} width={102} depth={87} fill="#dce4bb" />
      <Tile x={p.x - 13} y={p.y + 42} width={26} depth={p.y < 230 ? 230 - p.y - 42 : 60} fill="#ede4c8" />
    </g>)}
    {entities.map((entity) => {
      const at = project(entity.point);
      if (entity.type === 'building') {
        const p = entity.place;
        const sign = project({ x: p.x, y: p.y + 36 }, 44);
        return <g key={`building-${entity.index}`} aria-hidden="true">
          <Cube {...p.bounds} height={59} color={p.color} />
          <Cube x={p.bounds.x - 4} y={p.bounds.y - 4} width={96} depth={78} height={9} base={59} color={p.color} />
          <polygon points={points([{ x: p.x - 10, y: p.y + 35 }, { x: p.x + 10, y: p.y + 35 }].map((v) => project(v, 30)).concat([{ x: p.x + 10, y: p.y + 35 }, { x: p.x - 10, y: p.y + 35 }].map((v) => project(v))))} fill="#e4f5f6" stroke="#ffffff88" strokeWidth="2" />
          <rect x={sign.x - 34} y={sign.y - 12} width="68" height="20" rx="4" fill="#fffdf0" />
          <text x={sign.x} y={sign.y + 2} textAnchor="middle" fontSize="12" fontWeight="800" fill="#31435c">{p.name}</text>
        </g>;
      }
      if (entity.type === 'player') return <g key="player" data-player-x={player.x} data-player-y={player.y} aria-label="내 캐릭터">
        <Person point={player} color="#ffcc49" walking={walking} player />
        <text x={at.x} y={at.y - 73} textAnchor="middle" fill="#73521e" fontSize="13" fontWeight="900">▼ 나</text>
      </g>;
      const npc = entity.npc;
      const isNear = nearby?.institution.id === npc.institution.id;
      return <g key={npc.institution.id} className="town-officer" role="button" tabIndex={0}
        aria-label={`${npc.name} ${npc.institution.officer.name}에게 대화하기`}
        onClick={() => onNpcClick(npc)} onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onNpcClick(npc); }
        }}>
        <ellipse cx={at.x} cy={at.y} rx="23" ry="11" fill={isNear ? '#ffe591' : '#ffffff66'} />
        <Person point={npc.npc} color={npc.color} />
        <rect x={at.x - 50} y={at.y + 12} width="100" height="30" fill="transparent" />
      </g>;
    })}
    {/* Labels are drawn after all world objects so characters cannot cover names. */}
    <g className="town-labels" pointerEvents="none" aria-hidden="true">
      {npcs.map((npc) => {
        const at = project(npc.npc);
        const isNear = nearby?.institution.id === npc.institution.id;
        const name = `${completed(npc) ? '✓ ' : ''}${npc.institution.officer.name}`;
        const width = Math.max(100, [...name].length * 15 + 28);
        return <g key={npc.institution.id}>
          <rect className="town-officer__label" x={at.x - width / 2} y={at.y + 12} width={width} height="30" rx="10" fill={isNear ? '#316d57' : '#344962'} stroke="#fffdf0" strokeWidth="1.5" />
          <text x={at.x} y={at.y + 32} textAnchor="middle" fill="white" fontSize="14" fontWeight="700">{name}</text>
          {isNear && <g><rect x={at.x - 44} y={at.y - 91} width="88" height="25" rx="12" fill="#fff5ce" /><text x={at.x} y={at.y - 74} textAnchor="middle" fontSize="12" fill="#684a19" fontWeight="800">대화 · Enter</text></g>}
        </g>;
      })}
    </g>
  </svg>;
}
