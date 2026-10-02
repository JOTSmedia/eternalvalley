// Compile the actual onBeforeCompile output with Mesa EGL; this is not a browser FPS test.
import * as THREE from 'three';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
// Texture pixels are irrelevant to compilation. Preserve real material wiring while
// preventing asynchronous DOM image loading in this offline compiler.
THREE.TextureLoader.prototype.load = function(url) {
  const t = new THREE.Texture(); t.userData.sourceURL = url; return t;
};
const { createTerrainMaterial } = await import('../js/terrainMaterial.js');
const shader = {
  uniforms: THREE.UniformsUtils.clone(THREE.ShaderLib.standard.uniforms),
  vertexShader: THREE.ShaderLib.standard.vertexShader,
  fragmentShader: THREE.ShaderLib.standard.fragmentShader,
};
createTerrainMaterial({ capabilities: { getMaxAnisotropy: () => 8 } }).onBeforeCompile(shader);
function expand(source) {
  return source.replace(/#include <([\w]+)>/g, (_, name) => {
    if (!(name in THREE.ShaderChunk)) throw new Error(`Unknown chunk ${name}`);
    return expand(THREE.ShaderChunk[name]);
  }).replace(/NUM_DIR_LIGHTS/g, '1')
    .replace(/NUM_POINT_LIGHTS|NUM_SPOT_LIGHTS|NUM_RECT_AREA_LIGHTS|NUM_HEMI_LIGHTS|NUM_DIR_LIGHT_SHADOWS|NUM_POINT_LIGHT_SHADOWS|NUM_SPOT_LIGHT_SHADOWS|NUM_SPOT_LIGHT_MAPS|NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS|NUM_CLIPPING_PLANES|UNION_CLIPPING_PLANES/g, '0')
    .replace(/#pragma unroll_loop_(?:start|end)/g, '');
}
const common = '#version 330\n#define STANDARD\n#define HIGH_PRECISION\n';
const vertex = common + `#define attribute in\n#define varying out\nuniform mat4 modelMatrix, modelViewMatrix, projectionMatrix, viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nuniform bool isOrthographic;\nin vec3 position, normal;\nin vec2 uv;\n` + expand(shader.vertexShader);
const fragment = common + `#define varying in\n#define texture2D texture\n#define textureCube texture\nout vec4 pc_fragColor;\n#define gl_FragColor pc_fragColor\nuniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\nuniform bool isOrthographic;\nvec4 linearToOutputTexel(vec4 v) { return v; }\n` + expand(shader.fragmentShader);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ev-terrain-shader-'));
fs.writeFileSync(path.join(dir, 'terrain.vert'), vertex);
fs.writeFileSync(path.join(dir, 'terrain.frag'), fragment);
const renderIndex = process.argv.indexOf('--render');
if (renderIndex >= 0) {
  const { createTerrainGeometry } = await import('../js/terrainGeometry.js');
  const geometry = await createTerrainGeometry({ segments: 640, yieldWork: async () => {} });
  for (const name of ['position', 'normal', 'aCreviceAO']) {
    const a = geometry.getAttribute(name).array;
    fs.writeFileSync(path.join(dir, name + '.bin'), Buffer.from(a.buffer));
  }
  fs.writeFileSync(path.join(dir, 'index.bin'), Buffer.from(geometry.index.array.buffer));
  const camera = new THREE.PerspectiveCamera(35, 16 / 9, 1, 20000);
  camera.position.set(160, 120, 740); camera.lookAt(0, 65, -250); camera.updateMatrixWorld();
  const matrix = x => Array.from(x.elements);
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(camera.matrixWorldInverse);
  fs.writeFileSync(path.join(dir, 'render.json'), JSON.stringify({
    output: path.resolve(process.argv[renderIndex + 1] || 'terrain-validation.png'),
    matrices: { modelMatrix: matrix(new THREE.Matrix4()), modelViewMatrix: matrix(camera.matrixWorldInverse),
      viewMatrix: matrix(camera.matrixWorldInverse), projectionMatrix: matrix(camera.projectionMatrix), normalMatrix: matrix(normalMatrix) },
    textures: Object.fromEntries(Object.entries(shader.uniforms).filter(([, v]) => v.value?.userData?.sourceURL)
      .map(([name, v]) => [name, { filename: path.resolve(v.value.userData.sourceURL), srgb: v.value.colorSpace === THREE.SRGBColorSpace }])),
    camera: camera.position.toArray(), snowRange: shader.uniforms.snowRange.value.toArray(),
  }));
}
const result = spawnSync(process.env.PYTHON || 'python3', [path.resolve('scripts/validate_terrain_shader.py'), dir], { encoding: 'utf8' });
process.stdout.write(result.stdout || ''); process.stderr.write(result.stderr || '');
if (result.status !== 0) { console.error(`Expanded shaders retained at ${dir}`); process.exit(result.status || 1); }
fs.rmSync(dir, { recursive: true });
