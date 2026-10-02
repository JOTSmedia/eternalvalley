// Shared, testable budgets. Start conservatively; never benchmark at maximum load.
export const QUALITY = Object.freeze({
  low:    { dpr: 1,    shadowSize: 512,  cascades: 2, post: false, terrain: 384, mountain: 128 },
  medium: { dpr: 1.25, shadowSize: 1024, cascades: 2, post: false, terrain: 512, mountain: 160 },
  high:   { dpr: 1.5,  shadowSize: 2048, cascades: 3, post: true,  terrain: 640, mountain: 224 },
  ultra:  { dpr: 1.75, shadowSize: 2048, cascades: 3, post: true,  terrain: 768, mountain: 256 },
});

export function initialQuality({ width = 1280, memory = 8, cores = 8, saveData = false } = {}) {
  if (saveData || memory <= 2 || cores <= 2) return 'low';
  return width <= 768 || memory <= 4 || cores <= 4 ? 'medium' : 'high';
}

export function adaptiveScale(scale, frameMs) {
  // Wide dead band prevents oscillation and repeated framebuffer reallocations.
  if (frameMs > 24) return Math.max(0.65, +(scale - 0.10).toFixed(2));
  if (frameMs < 15) return Math.min(1, +(scale + 0.05).toFixed(2));
  return scale;
}

export function readQuality() {
  try { return localStorage.getItem('ev_quality') || 'auto'; } catch { return 'auto'; }
}

export function supportsWebGL2() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch { return false; }
}
