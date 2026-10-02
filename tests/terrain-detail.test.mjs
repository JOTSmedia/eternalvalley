import test from 'node:test';
import assert from 'node:assert/strict';
import { createTerrainGeometry, createTerrainGeometryInWorker, createTerrainTiles } from '../js/terrainGeometry.js';
import { terrainHeight } from '../js/terrain.js';
import { Worker as NodeWorker } from 'node:worker_threads';
import * as THREE from 'three';

test('continuous terrain retains shared height, world UVs, upward triangles and bounded work', async () => {
  let yields = 0;
  const geometry = await createTerrainGeometry({ segments: 32, batchVertices: 128, yieldWork: async () => yields++ });
  const p = geometry.attributes.position, n = geometry.attributes.normal;
  assert.equal(p.count, 33 * 33);
  assert.equal(geometry.index.count, 32 * 32 * 6);
  assert.ok(yields >= 16);
  for (let i = 0; i < p.count; i++) {
    assert.ok(Math.abs(p.getY(i) - terrainHeight(p.getX(i), p.getZ(i))) < 0.001);
    assert.ok(n.getY(i) > 0);
    assert.ok(Math.abs(Math.hypot(n.getX(i), n.getY(i), n.getZ(i)) - 1) < 0.00001);
  }
  assert.equal(geometry.attributes.uv.getY(0), 1);
  assert.equal(geometry.attributes.uv.getY(p.count - 1), 0);
  const [a, b, c] = geometry.index.array;
  const up = (p.getZ(b) - p.getZ(a)) * (p.getX(c) - p.getX(a))
    - (p.getX(b) - p.getX(a)) * (p.getZ(c) - p.getZ(a));
  assert.ok(up > 0);
  geometry.dispose();
});

test('terrain generation supports cancellation before expensive sampling', async () => {
  const controller = new AbortController();
  controller.abort(new Error('view changed'));
  let samples = 0;
  await assert.rejects(createTerrainGeometry({ signal: controller.signal,
    heightAt: () => { samples++; return 0; } }), /view changed/);
  assert.equal(samples, 0);
});

test('worker generation falls back in environments without browser workers', async () => {
  const geometry = await createTerrainGeometryInWorker({ segments: 8, yieldWork: async () => {} });
  assert.equal(geometry.attributes.position.count, 81);
  assert.ok(geometry.boundingSphere.radius > 2500);
  geometry.dispose();
});

test('real worker transfers terrain buffers and reconstructs the same shared surface', async () => {
  const original = globalThis.Worker;
  let terminated = false;
  class BrowserWorkerAdapter {
    constructor(url) {
      this.thread = new NodeWorker(`
        const { parentPort } = require('node:worker_threads');
        globalThis.self = { postMessage: (data, transfer) => parentPort.postMessage(data, transfer) };
        const ready = import(${JSON.stringify(new URL('../js/terrainWorker.js', import.meta.url).href)});
        parentPort.on('message', async data => { await ready; self.onmessage({data}); });
      `, { eval: true });
      assert.ok(String(url).includes('terrainWorker.js'));
      this.thread.on('message', data => this.onmessage?.({ data }));
      this.thread.on('error', error => this.onerror?.({ message: error.message }));
    }
    postMessage(data) { this.thread.postMessage(data); }
    terminate() { terminated = true; this.thread.terminate(); }
  }
  globalThis.Worker = BrowserWorkerAdapter;
  try {
    const geometry = await createTerrainGeometryInWorker({ segments: 16 });
    assert.equal(geometry.attributes.position.count, 289);
    assert.equal(geometry.index.count, 16 * 16 * 6);
    const p = geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      assert.ok(Math.abs(p.getY(i) - terrainHeight(p.getX(i), p.getZ(i))) < 0.001);
    }
    assert.ok(terminated);
    geometry.dispose();
  } finally {
    if (original === undefined) delete globalThis.Worker;
    else globalThis.Worker = original;
  }
});

test('terrain tiles cover every triangle once, share boundary vertices, and cull to local bounds', async () => {
  const source = await createTerrainGeometry({ segments: 17, yieldWork: async () => {} });
  const tiles = createTerrainTiles(source, { tileSegments: 8 });
  assert.equal(tiles.length, 9);
  assert.equal(tiles.reduce((sum, tile) => sum + tile.index.count, 0), source.index.count);
  const expected = new Set();
  for (let i = 0; i < source.index.count; i += 3) expected.add([...source.index.array.subarray(i, i + 3)].join(','));
  const actual = new Set();
  const point = new THREE.Vector3();
  for (const tile of tiles) {
    for (const name of Object.keys(source.attributes)) assert.equal(tile.attributes[name], source.attributes[name]);
    assert.ok(tile.boundingBox.max.x - tile.boundingBox.min.x < 4600);
    assert.ok(tile.boundingBox.max.z - tile.boundingBox.min.z < 5200);
    for (const index of tile.index.array) {
      point.fromBufferAttribute(tile.attributes.position, index);
      assert.ok(tile.boundingBox.containsPoint(point));
      assert.ok(tile.boundingSphere.containsPoint(point));
    }
    for (let i = 0; i < tile.index.count; i += 3) {
      const triangle = [...tile.index.array.subarray(i, i + 3)].join(',');
      assert.ok(!actual.has(triangle));
      actual.add(triangle);
    }
  }
  assert.deepEqual(actual, expected);
  const left = new Set(tiles[0].index.array), right = new Set(tiles[1].index.array);
  assert.equal([...left].filter(index => right.has(index)).length, 9);
  for (const tile of tiles) tile.dispose();
  source.dispose();
});
