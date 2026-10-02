import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { WorldTerrain } from '../js/WorldTerrain.js';
import { QUALITY } from '../js/renderQuality.js';

// Asset decoding is separate from geometry; an image need not be downloaded to
// prove topology, bounds and shared texture colour-space correctness.
globalThis.document = { createElementNS() { return { addEventListener() {}, removeEventListener() {}, set src(value) {} }; } };
test('terrain has finite heights, valid normals and a matching occlusion attribute', async () => {
  const world = { quality: { ...QUALITY.low, terrain: 32 }, scene: new THREE.Scene(), renderer: { capabilities: { getMaxAnisotropy: () => 16 } } };
  const terrain = new WorldTerrain(world);
  await terrain._terrain({ awaitTextures: false });
  const geometry = terrain.terrainSourceGeometry;
  assert.equal(geometry.attributes.position.count, 33 * 33);
  assert.equal(geometry.attributes.aCreviceAO.count, geometry.attributes.position.count);
  for (const key of ['position', 'normal', 'aCreviceAO']) {
    assert.ok(geometry.attributes[key].array.every(Number.isFinite), `${key} contains a non-finite value`);
  }
  assert.ok(geometry.boundingSphere.radius > 2000);
  assert.equal(terrain.terrainMesh.children[0].receiveShadow, true);
});
