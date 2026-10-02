import test from 'node:test';
import assert from 'node:assert/strict';
import { QUALITY, initialQuality, adaptiveScale } from '../js/renderQuality.js';

test('constrained devices never start at desktop maximum settings', () => {
  assert.equal(initialQuality({ width: 1440, cores: 2 }), 'low');
  assert.equal(initialQuality({ width: 390, memory: 8, cores: 8 }), 'medium');
  assert.equal(initialQuality({ saveData: true }), 'low');
  assert.equal(initialQuality({ width: 1440, cores: 8, memory: 8 }), 'high');
});
test('adaptive resolution degrades under sustained load and recovers within bounds', () => {
  let scale = 1;
  for (let i = 0; i < 20; i++) scale = adaptiveScale(scale, 40);
  assert.equal(scale, 0.65);
  assert.equal(adaptiveScale(scale, 20), 0.65);
  for (let i = 0; i < 20; i++) scale = adaptiveScale(scale, 12);
  assert.equal(scale, 1);
});
test('desktop shadow budget stays below the original four 4096 maps', () => {
  for (const p of Object.values(QUALITY)) assert.ok(p.cascades * p.shadowSize ** 2 <= 3 * 2048 ** 2);
});
