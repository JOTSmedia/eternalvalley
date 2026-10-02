import * as THREE from 'three';
import { TOUR_WAYPOINTS } from './valleyRoute.js';
import { terrainHeight } from './terrain.js?v=26';

// Constant-distance motion on the same closed Catmull-Rom route drawn by Map2D.
export class ValleyFlight {
  constructor(world) {
    this.world = world;
    this.curve = new THREE.CatmullRomCurve3(TOUR_WAYPOINTS.map(p =>
      new THREE.Vector3(p.x, Math.max(p.y + 55, terrainHeight(p.x, p.z) + 65), p.z)), true, 'catmullrom', 0.5);
    this.curve.arcLengthDivisions = 4096;
    this.length = this.curve.getLength();
    this.distance = 0;
    this.active = false;
    this.paused = false;
    this.position = new THREE.Vector3();
    this.look = new THREE.Vector3();
    this.matrix = new THREE.Matrix4();
    this.rotation = new THREE.Quaternion();
    this.up = new THREE.Vector3(0, 1, 0);
  }
  sample(distance, out) {
    this.curve.getPointAt(((distance / this.length) % 1 + 1) % 1, out);
    out.y = Math.max(out.y, terrainHeight(out.x, out.z) + 45);
    return out;
  }
  start(stage) {
    if (Number.isInteger(stage)) {
      const index = Math.max(0, Math.min(TOUR_WAYPOINTS.length - 1, stage));
      this.distance = this.curve.getLengths()[Math.round(index / TOUR_WAYPOINTS.length * this.curve.arcLengthDivisions)];
      this.sample(this.distance, this.world.camera.position);
    }
    this.active = true;
    this.paused = false;
    this.world.controls.enabled = false;
    this.world.camera.up.copy(this.up);
    this.mountControls();
  }
  update(dt) {
    if (!this.active) return;
    const delta = Math.max(0, Math.min(0.1, dt));
    if (!this.paused) this.distance = (this.distance + delta * 22) % this.length;
    this.sample(this.distance, this.position);
    this.sample(this.distance + 95, this.look);
    const camera = this.world.camera;
    camera.position.lerp(this.position, 1 - Math.exp(-3 * delta));
    camera.position.y = Math.max(camera.position.y, terrainHeight(camera.position.x, camera.position.z) + 15);
    this.matrix.lookAt(camera.position, this.look, this.up);
    this.rotation.setFromRotationMatrix(this.matrix);
    camera.quaternion.slerp(this.rotation, 1 - Math.exp(-2 * delta));
    this.world.controls.target.copy(this.look);
    if (window.UI?.map) window.UI.map.dronePosition = camera.position;
  }
  stop() {
    this.active = false;
    this.world.controls.enabled = true;
    document.getElementById('liveFlightControls')?.classList.add('hidden');
  }
  mountControls() {
    let panel = document.getElementById('liveFlightControls');
    if (!panel) {
      panel = document.createElement('div'); panel.id = 'liveFlightControls';
      panel.className = 'live-flight-controls';
      const select = document.createElement('select'); select.setAttribute('aria-label', 'Flight landmark');
      TOUR_WAYPOINTS.forEach((point, index) => { const option = document.createElement('option'); option.value = index; option.textContent = point.name; select.append(option); });
      select.onchange = () => this.start(Number(select.value));
      panel.append(select);
      for (const [label, action] of [
        ['Pause flight', event => { this.paused = !this.paused; event.currentTarget.textContent = this.paused ? 'Resume flight' : 'Pause flight'; }],
        ['Free roam', () => window.UI?.show3D('orbit')],
        ['Layout map', () => window.UI?.show2D()],
      ]) {
        const button = document.createElement('button'); button.textContent = label; button.onclick = action; panel.append(button);
      }
      document.getElementById('view3d').append(panel);
    }
    panel.classList.remove('hidden');
  }
}
