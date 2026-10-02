import { createTerrainGeometry } from './terrainGeometry.js';

if (typeof self !== 'undefined' && typeof document === 'undefined') {
  self.onmessage = async event => {
    try {
      // Worker work can run continuously without occupying the UI thread.
      const geometry = await createTerrainGeometry({ ...event.data, yieldWork: async () => {} });
      const payload = {};
      const buffers = [];
      for (const name of ['position', 'normal', 'uv', 'aCreviceAO']) {
        payload[name] = geometry.attributes[name].array.buffer;
        buffers.push(payload[name]);
      }
      payload.index = geometry.index.array.buffer;
      buffers.push(payload.index);
      payload.min = geometry.boundingBox.min.toArray();
      payload.max = geometry.boundingBox.max.toArray();
      payload.center = geometry.boundingSphere.center.toArray();
      payload.radius = geometry.boundingSphere.radius;
      self.postMessage(payload, buffers);
      geometry.dispose();
    } catch (error) {
      self.postMessage({ error: error.message || String(error) });
    }
  };
}
