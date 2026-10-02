import * as THREE from 'three';
import { terrainHeight } from './terrain.js';

/** One continuous surface, built in bounded batches rather than blocking startup.
 * Increasing the sampling density retains the exact shared world height function;
 * walking, map positions, landmarks and the flight path remain aligned.
 */
export async function createTerrainGeometry({
  width = 4600, depth = 5200, segments = 640,
  heightAt = terrainHeight,
  batchVertices = 2048,
  normalStep = 3,
  yieldWork = () => new Promise(resolve => setTimeout(resolve, 0)),
  signal,
} = {}) {
  if (!Number.isInteger(segments) || segments < 2 || segments > 768) {
    throw new RangeError('Terrain segments must be an integer between 2 and 768');
  }
  if (!(width > 0 && depth > 0 && batchVertices >= 1 && normalStep > 0)) {
    throw new RangeError('Terrain dimensions and batch size must be positive');
  }
  const stride = segments + 1, count = stride * stride;
  const positions = new Float32Array(count * 3);
  const normals = new Float32Array(count * 3);
  const uv = new Float32Array(count * 2);
  const ao = new Float32Array(count);
  const indices = new Uint32Array(segments * segments * 6);
  const stepX = width / segments, stepZ = depth / segments;
  async function checkpoint(i) {
    if (i % batchVertices !== 0) return;
    if (signal?.aborted) throw signal.reason || new Error('Terrain generation aborted');
    await yieldWork();
  }
  for (let i = 0; i < count; i++) {
    if (i % batchVertices === 0) await checkpoint(i);
    const row = Math.floor(i / stride), col = i % stride;
    const x = col * stepX - width / 2, z = row * stepZ - depth / 2;
    positions[i * 3] = x;
    positions[i * 3 + 1] = heightAt(x, z);
    positions[i * 3 + 2] = z;
    uv[i * 2] = col / segments;
    uv[i * 2 + 1] = 1 - row / segments;
  }
  for (let i = 0; i < count; i++) {
    if (i % batchVertices === 0) await checkpoint(i);
    const row = Math.floor(i / stride), col = i % stride;
    const h = positions[i * 3 + 1];
    const x = positions[i * 3], z = positions[i * 3 + 2];
    const hx = (heightAt(x + normalStep, z) - heightAt(x - normalStep, z)) / (normalStep * 2);
    const hz = (heightAt(x, z + normalStep) - heightAt(x, z - normalStep)) / (normalStep * 2);
    const length = Math.hypot(hx, 1, hz);
    normals[i * 3] = -hx / length;
    normals[i * 3 + 1] = 1 / length;
    normals[i * 3 + 2] = -hz / length;
    // AO is measured at a fixed physical radius, so higher density does not
    // accidentally remove the crevice shading used by the terrain material.
    const radius = Math.max(1, Math.round(24 / Math.min(stepX, stepZ)));
    const nr = Math.max(0, row - radius), sr = Math.min(segments, row + radius);
    const lc = Math.max(0, col - radius), rc = Math.min(segments, col + radius);
    const mean = (positions[(nr * stride + col) * 3 + 1] + positions[(sr * stride + col) * 3 + 1]
      + positions[(row * stride + lc) * 3 + 1] + positions[(row * stride + rc) * 3 + 1]) / 4;
    ao[i] = Math.max(0.55, 1 - Math.max(0, mean - h) * 0.055);
    if (row < segments && col < segments) {
      const offset = (row * segments + col) * 6;
      indices[offset] = i;
      indices[offset + 1] = i + stride;
      indices[offset + 2] = i + 1;
      indices[offset + 3] = i + stride;
      indices[offset + 4] = i + stride + 1;
      indices[offset + 5] = i + 1;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geometry.setAttribute('aCreviceAO', new THREE.BufferAttribute(ao, 1));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  return geometry;
}

/** Off-thread sampling; callers compiling this module supply the worker asset URL. */
export async function createTerrainGeometryInWorker(options = {}) {
  const { workerURL = new URL('./terrainWorker.js', import.meta.url), workerTimeout = 20000,
    signal, ...geometryOptions } = options;
  const abortReason = () => signal?.reason || new Error('Terrain generation aborted');
  if (signal?.aborted) throw abortReason();
  // Custom callbacks are intentionally handled locally: functions cannot be cloned.
  if (typeof Worker === 'undefined' || geometryOptions.heightAt || geometryOptions.yieldWork) {
    return createTerrainGeometry({ ...geometryOptions, signal });
  }
  try {
    return await new Promise((resolve, reject) => {
      const worker = new Worker(workerURL, { type: 'module' });
      let finished = false;
      const cleanup = () => {
        clearTimeout(timeout);
        signal?.removeEventListener('abort', abort);
        worker.terminate();
      };
      const fail = error => {
        if (finished) return;
        finished = true;
        cleanup();
        reject(error);
      };
      const abort = () => fail(abortReason());
      const timeout = setTimeout(() => fail(new Error('Terrain worker timed out')), workerTimeout);
      signal?.addEventListener('abort', abort, { once: true });
      worker.onerror = event => fail(new Error(event.message || 'Terrain worker failed'));
      worker.onmessageerror = () => fail(new Error('Terrain worker response could not be decoded'));
      worker.onmessage = event => {
        if (finished) return;
        const data = event.data;
        if (data.error) { fail(new Error(data.error)); return; }
        try {
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(data.position), 3));
          geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.normal), 3));
          geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.uv), 2));
          geometry.setAttribute('aCreviceAO', new THREE.BufferAttribute(new Float32Array(data.aCreviceAO), 1));
          geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(data.index), 1));
          geometry.boundingBox = new THREE.Box3(new THREE.Vector3(...data.min), new THREE.Vector3(...data.max));
          geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(...data.center), data.radius);
          finished = true;
          cleanup();
          resolve(geometry);
        } catch (error) { fail(error); }
      };
      try { worker.postMessage(geometryOptions); } catch (error) { fail(error); }
    });
  } catch (error) {
    if (signal?.aborted) throw abortReason();
    // Worker asset/CSP failures must not prevent the world from opening.
    return createTerrainGeometry({ ...geometryOptions, signal });
  }
}

/** Frustum-cullable tiles share vertex buffers: only their indices and bounds differ.
 * Keep the source geometry alive while tiles are in use. Dispose all tiles and the
 * source together on teardown, since Three's attribute disposal is shared too.
 */
export function createTerrainTiles(source, { tileSegments = 64 } = {}) {
  const position = source.attributes.position;
  const stride = Math.round(Math.sqrt(position.count));
  const segments = stride - 1;
  if (stride * stride !== position.count || source.index?.count !== segments * segments * 6) {
    throw new Error('Terrain tiles require a square indexed terrain grid');
  }
  if (!Number.isInteger(tileSegments) || tileSegments < 1) {
    throw new RangeError('Tile segments must be a positive integer');
  }
  const tiles = [];
  const point = new THREE.Vector3();
  for (let row = 0; row < segments; row += tileSegments) {
    for (let col = 0; col < segments; col += tileSegments) {
      const endRow = Math.min(segments, row + tileSegments);
      const endCol = Math.min(segments, col + tileSegments);
      const geometry = new THREE.BufferGeometry();
      for (const [name, attribute] of Object.entries(source.attributes)) geometry.setAttribute(name, attribute);
      const indices = new Uint32Array((endRow - row) * (endCol - col) * 6);
      let offset = 0;
      for (let r = row; r < endRow; r++) {
        const start = (r * segments + col) * 6;
        const length = (endCol - col) * 6;
        indices.set(source.index.array.subarray(start, start + length), offset);
        offset += length;
      }
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      const bounds = new THREE.Box3();
      for (let r = row; r <= endRow; r++) {
        for (let c = col; c <= endCol; c++) {
          point.fromBufferAttribute(position, r * stride + c);
          bounds.expandByPoint(point);
        }
      }
      geometry.boundingBox = bounds;
      // Bounding-box enclosing sphere is conservative and contains every tile
      // triangle, without scanning the shared whole-world position attribute.
      geometry.boundingSphere = bounds.getBoundingSphere(new THREE.Sphere());
      geometry.boundingSphere.radius += 0.000001;
      geometry.userData.terrainTile = { row, col, endRow, endCol };
      tiles.push(geometry);
    }
  }
  return tiles;
}
