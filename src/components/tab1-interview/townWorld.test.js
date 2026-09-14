import test from 'node:test';
import assert from 'node:assert/strict';
import { PLACES, ROADS, SPAWN, PLAYER_RADIUS, canStand, canTalk, movePlayer } from './townWorld.js';

test('every building has a separate plot outside the roads', () => {
  const intersects = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x &&
    a.y < b.y + b.depth && a.y + a.depth > b.y;
  PLACES.forEach((p, i) => {
    ROADS.forEach((r) => assert.equal(intersects(p.bounds, r), false, p.name));
    PLACES.slice(i + 1).forEach((other) => assert.equal(intersects(p.bounds, other.bounds), false));
  });
});
test('movement stops at walls, NPCs and world edges even for large steps', () => {
  for (const p of PLACES) {
    assert.equal(canStand(p), false);
    assert.equal(canStand(p.npc), false);
    const hit = movePlayer({ x: p.x, y: p.npc.y + 40 }, 0, -500);
    assert.ok(canStand(hit));
    assert.ok(hit.y >= p.npc.y + PLAYER_RADIUS * 2);
    const wall = movePlayer({ x: p.x, y: p.y - 55 }, 0, 30);
    assert.ok(wall.y <= p.bounds.y - PLAYER_RADIUS);
  }
  assert.ok(canStand(movePlayer(SPAWN, 2000, -2000)));
});
test('all seven officers are reachable from spawn without crossing an obstacle', () => {
  const queue = [SPAWN];
  const visited = new Set([`${SPAWN.x},${SPAWN.y}`]);
  const reached = new Set();
  for (let i = 0; i < queue.length; i++) {
    const point = queue[i];
    PLACES.forEach((p) => { if (canTalk(point, p.npc)) reached.add(p.name); });
    for (const [dx, dy] of [[5, 0], [-5, 0], [0, 5], [0, -5]]) {
      const next = { x: point.x + dx, y: point.y + dy };
      const key = `${next.x},${next.y}`;
      if (!visited.has(key) && canStand(next)) { visited.add(key); queue.push(next); }
    }
  }
  assert.equal(reached.size, 7);
  assert.equal(canTalk(SPAWN, PLACES[0].npc), false);
});
