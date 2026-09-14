// Ground coordinates are shared by drawing, collision and conversation checks.
export const WORLD_SIZE = 600;
export const PLAYER_RADIUS = 18;
export const TALK_DISTANCE = 58;
export const SPAWN = { x: 320, y: 285 };
export const ROADS = [
  { x: 0, y: 230, width: 600, depth: 80 },
  { x: 290, y: 0, width: 60, depth: 600 },
];
export const PLACES = [
  { x: 65, y: 100, name: '주민센터', color: '#6784c8' },
  { x: 205, y: 100, name: '시청', color: '#7975ba' },
  { x: 405, y: 100, name: '경찰서', color: '#5388b9' },
  { x: 545, y: 100, name: '소방서', color: '#d66d58' },
  { x: 445, y: 425, name: '보건소', color: '#58a18d' },
  { x: 220, y: 425, name: '우체국', color: '#cc726c' },
  { x: 85, y: 425, name: '도서관', color: '#b19360' },
].map((place) => ({
  ...place,
  bounds: { x: place.x - 44, y: place.y - 35, width: 88, depth: 70 },
  npc: { x: place.x, y: place.y + 88 },
}));

export function project({ x, y }, height = 0) {
  return { x: 520 + (x - y) * 0.78, y: 72 + (x + y) * 0.4 - height };
}
export function distance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
export function canStand(point) {
  if (point.x < PLAYER_RADIUS || point.y < PLAYER_RADIUS ||
      point.x > WORLD_SIZE - PLAYER_RADIUS || point.y > WORLD_SIZE - PLAYER_RADIUS) return false;
  return PLACES.every(({ bounds: b, npc }) => {
    const closest = { x: Math.max(b.x, Math.min(point.x, b.x + b.width)),
      y: Math.max(b.y, Math.min(point.y, b.y + b.depth)) };
    return distance(point, closest) >= PLAYER_RADIUS && distance(point, npc) >= PLAYER_RADIUS * 2;
  });
}
export function movePlayer(current, dx, dy) {
  // Substeps prevent crossing thin obstacles, even after a delayed frame.
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 4));
  let next = { ...current };
  for (let i = 0; i < steps; i++) {
    const xStep = { ...next, x: next.x + dx / steps };
    if (canStand(xStep)) next = xStep;
    const yStep = { ...next, y: next.y + dy / steps };
    if (canStand(yStep)) next = yStep;
  }
  return next;
}
export function canTalk(player, npc) {
  if (distance(player, npc) > TALK_DISTANCE) return false;
  // A building must never sit between the player and the officer.
  return !PLACES.some(({ bounds: b }) => {
    for (let t = 0; t <= 1; t += 0.05) {
      const x = player.x + (npc.x - player.x) * t;
      const y = player.y + (npc.y - player.y) * t;
      if (x > b.x && x < b.x + b.width && y > b.y && y < b.y + b.depth) return true;
    }
    return false;
  });
}
