import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { ValleyFlight } from '../js/ValleyFlight.js';
import { TOUR_WAYPOINTS } from '../js/valleyRoute.js';
import { terrainHeight } from '../js/terrain.js';

globalThis.window = { UI: { map: {} } };
function flight() {
  const world = { camera: new THREE.PerspectiveCamera(), controls: { target: new THREE.Vector3() } };
  const controller = new ValleyFlight(world);
  controller.sample(0, world.camera.position);
  controller.active = true;
  return controller;
}
test('flight uses map landmarks and maintains terrain clearance around the complete route', () => {
  const controller = flight();
  assert.equal(controller.curve.points.length, TOUR_WAYPOINTS.length);
  for (let i = 0; i < 300; i++) {
    const p = controller.sample(controller.length * i / 300, new THREE.Vector3());
    assert.ok([p.x, p.y, p.z].every(Number.isFinite));
    assert.ok(p.y >= terrainHeight(p.x, p.z) + 44.99);
  }
});
test('drone distance is time-based at different frame rates and the map tracks the real camera', () => {
  const slow = flight(), fast = flight();
  for (let i = 0; i < 300; i++) slow.update(1 / 30);
  for (let i = 0; i < 600; i++) fast.update(1 / 60);
  assert.ok(Math.abs(slow.distance - fast.distance) < 0.00001);
  assert.ok(slow.world.camera.position.distanceTo(fast.world.camera.position) < 2);
  assert.equal(window.UI.map.dronePosition, fast.world.camera.position);
  const distance = fast.distance;
  fast.paused = true; fast.update(0.1);
  assert.equal(fast.distance, distance);
});

test('entering flight joins near the camera and never teleports it', () => {
  globalThis.document = { querySelector() { return null; } };
  const controller = flight();
  controller.mountControls = () => {};
  const expected = controller.sample(controller.length * 0.6, new THREE.Vector3());
  controller.world.camera.position.copy(expected);
  controller.start();
  assert.ok(controller.world.camera.position.equals(expected));
  assert.ok(controller.sample(controller.distance, new THREE.Vector3()).distanceTo(expected) < 30);
  controller.start(0);
  assert.ok(controller.world.camera.position.equals(expected));
});
