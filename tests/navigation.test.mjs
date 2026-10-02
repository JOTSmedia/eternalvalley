import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { createCanvas } from '@napi-rs/canvas';

const dom = new JSDOM(readFileSync(new URL('../index.html', import.meta.url), 'utf8'), {
  url: 'https://jotsmedia.github.io/eternalvalley/', pretendToBeVisual: true,
});
for (const key of ['window', 'document', 'location', 'localStorage', 'sessionStorage', 'navigator', 'Image', 'HTMLElement']) {
  Object.defineProperty(globalThis, key, { configurable: true, value: dom.window[key] });
}
globalThis.requestAnimationFrame = fn => setTimeout(fn, 0);
globalThis.cancelAnimationFrame = clearTimeout;
globalThis.addEventListener = dom.window.addEventListener.bind(dom.window);
globalThis.removeEventListener = dom.window.removeEventListener.bind(dom.window);
globalThis.fetch = async () => ({ ok: true, json: async () => [] });
const canvases = new WeakMap();
dom.window.HTMLCanvasElement.prototype.getContext = function(type) {
  if (type !== '2d') return null; // Explicitly exercise a device without WebGL.
  if (!canvases.has(this)) canvases.set(this, createCanvas(this.width || 300, this.height || 150));
  return canvases.get(this).getContext('2d');
};
dom.window.HTMLMediaElement.prototype.play = async function() { this.dispatchEvent(new dom.window.Event('play')); };
dom.window.HTMLMediaElement.prototype.pause = function() { this.dispatchEvent(new dom.window.Event('pause')); };
dom.window.HTMLMediaElement.prototype.load = function() {};

const { UI } = await import('../js/ui.js');
const { veoTour } = await import('../js/VeoTourController.js');
const { supportsWebGL2 } = await import('../js/renderQuality.js');
const THREE = await import('three');
const { WorldTourController } = await import('../js/WorldTourController.js');
const { terrainHeight } = await import('../js/terrain.js');
window.UI = UI;
UI.toast = () => {};
UI.map = { _resize() {}, draw() {} };
veoTour.init();

test('drone tour and free roam use the same world and never start the prerecorded video', async () => {
  let requested = 0, started = 0;
  const modes = [];
  UI._ensureWorld = async () => { requested++; return { world: null }; };
  UI.world = { start() { started++; }, stop() {}, setMode(mode) { modes.push(mode); } };
  await UI.show3D('tour');
  await UI.show3D('orbit');
  assert.equal(requested, 0);
  assert.deepEqual(modes, ['tour', 'orbit']);
  assert.ok(started >= 2);
  assert.equal(veoTour.container.classList.contains('hidden'), true);
  assert.equal(veoTour.isPlaying, false);
});

test('returning from the map preserves a paused flight and the current camera', async () => {
  let changed = 0;
  const camera = { position: { x: 120, y: 80, z: 440 } };
  UI.world = {
    camera, cameraMode: 'tour', flight: { active: true, paused: true },
    start() {}, stop() {}, setMode() { changed++; },
  };
  await UI.show2D();
  await UI.show3D();
  assert.equal(changed, 0);
  assert.equal(UI.world.flight.paused, true);
  assert.equal(UI.world.camera, camera);
  assert.equal(UI._currentView, 'view3d');
  assert.equal(document.getElementById('btn3d').classList.contains('active'), true);
});

test('clicking a map memorial enters the same world before selecting it', async () => {
  const calls = [];
  const plot = { id: 'plot-test', x: 10, z: 20 };
  UI.world = { start() {}, stop() {}, setMode(mode) { calls.push(mode); }, selectPlot(p) { calls.push(p); } };
  const original = UI.openPlot;
  UI.openPlot = p => calls.push(['open', p]);
  await UI.show2D();
  await UI.visitWorldPlot(plot);
  assert.equal(UI._currentView, 'view3d');
  assert.deepEqual(calls, ['orbit', plot, ['open', plot]]);
  UI.openPlot = original;
});

test('walking begins at the current location and exploring retains the walking view direction', () => {
  const pill = document.createElement('div');
  pill.id = 'sanctuaryWalkPill'; document.getElementById('view3d').append(pill);
  const camera = new THREE.PerspectiveCamera();
  camera.position.set(120, 150, 380); camera.lookAt(170, 130, 320);
  const direction = camera.getWorldDirection(new THREE.Vector3());
  const target = new THREE.Vector3();
  const world = { camera, controls: { target, update() { camera.lookAt(target); } } };
  const controller = new WorldTourController(world);
  controller.walkPos = new THREE.Vector3(0, 4, 310); controller.eyeHeight = 2.4;
  controller.setMode('walk');
  assert.equal(camera.position.x, 120); assert.equal(camera.position.z, 380);
  assert.equal(camera.position.y, terrainHeight(120, 380) + 2.4);
  assert.ok(Math.abs(controller.walkYaw - Math.atan2(-direction.x, -direction.z)) < 1e-8);
  controller.setMode('orbit');
  assert.ok(camera.getWorldDirection(new THREE.Vector3()).distanceTo(direction) < 1e-8);
  pill.remove();
});

test('a missing WebGL context gives a usable layout instead of another GPU fallback', async () => {
  assert.equal(supportsWebGL2(), false);
  UI.world = null; window.world = null; UI._ensureWorldPromise = null;
  UI._ensureWorld = async () => ({ world: null });
  await UI.show3D('orbit');
  assert.equal(UI._currentView, 'view2d');
  assert.equal(document.getElementById('view2d').classList.contains('hidden'), false);
  assert.equal(veoTour.container.classList.contains('hidden'), true);
});

test('finishing 3D in the background does not steal the selected layout', async () => {
  let resolveWorld, started = 0;
  UI.world = null; window.world = null; UI._ensureWorldPromise = null;
  UI._ensureWorld = () => new Promise(resolve => { resolveWorld = resolve; });
  const opening = UI.show3D('orbit');
  await UI.show2D();
  resolveWorld({ world: { start() { started++; }, stop() {}, setMode() {} } });
  await opening;
  assert.equal(UI._currentView, 'view2d');
  assert.equal(started, 0);
});

test('moving from the real-time tour to the layout stops the shared renderer', async () => {
  let stopped = 0;
  UI.world = { start() {}, stop() { stopped++; }, setMode() {} };
  window.world = UI.world;
  await UI.show3D('tour');
  UI._setView({ view: 'view2d', btn: 'btn2d' });
  assert.ok(stopped > 0);
  assert.equal(veoTour.isPlaying, false);
  assert.equal(veoTour.container.classList.contains('hidden'), true);
});

test.after(() => { dom.window.close(); });

test('failed globe initialization leaves its fallback visible instead of returning to an empty globe', async () => {
  const original = UI.showEarth;
  let fallback = 0;
  UI.globe = null; UI._globePromise = null;
  UI.showEarth = async function() { fallback++; this._setView({ view: 'viewEarth', btn: 'btnEarth' }); };
  await UI.showGlobe();
  assert.equal(fallback, 1);
  assert.equal(UI._currentView, 'viewEarth');
  assert.equal(document.getElementById('viewGlobe').classList.contains('hidden'), true);
  assert.equal(UI._globePromise, null);
  UI.showEarth = original;
});
