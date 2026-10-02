import test from 'node:test';
import assert from 'node:assert/strict';
import { terrainHeight } from '../js/terrain.js';

test('coastal pass, island shelves, waterfall and cathedral grading have continuous joins', () => {
  // Locations independently identified by the old surface's discontinuity scan.
  for (const [x, z, axis] of [[445,915,'z'],[-220,2205,'z'],[-390,1905,'x'],
    [190,-610,'z'],[-34,-340,'z'],[72,-370,'z'],[0,-980,'z']]) {
    const before = terrainHeight(x - (axis === 'x' ? 0.01 : 0), z - (axis === 'z' ? 0.01 : 0));
    const after = terrainHeight(x + (axis === 'x' ? 0.01 : 0), z + (axis === 'z' ? 0.01 : 0));
    assert.ok(Math.abs(after - before) < 0.2, `discontinuous join at ${x}, ${z}: ${before} -> ${after}`);
  }
});
