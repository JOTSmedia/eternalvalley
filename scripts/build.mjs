import { build } from 'esbuild';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
// Preserve the existing multi-page site and its relative GitHub Pages paths.
for (const entry of await readdir('.', { withFileTypes: true })) {
  if ((entry.isFile() && /\.(html|json|ico|svg|png|txt)$/.test(entry.name) && !entry.name.startsWith('package')) ||
      ['css', 'images', 'js', 'trailer'].includes(entry.name)) {
    await cp(entry.name, `dist/${entry.name}`, { recursive: true });
  }
}
// All site pages now use the streaming-optimized tour; keep its old master in source only.
await rm('dist/images/eternal_valley_drone_tour.mp4', { force: true });
await build({ entryPoints: ['js/terrainWorker.js'], bundle: true, minify: true,
  format: 'esm', platform: 'browser', target: ['es2022'], outfile: 'dist/assets/terrain-worker.js' });
const result = await build({
  entryPoints: ['js/main.js'], bundle: true, splitting: true, minify: true,
  format: 'esm', platform: 'browser', target: ['es2022'], outdir: 'dist/assets',
  entryNames: '[name]-[hash]', chunkNames: '[name]-[hash]', metafile: true,
  external: ['https://*', 'firebase/*'], legalComments: 'linked',
  // Normalize cache-busting suffixes before resolving local/npm modules.
  plugins: [{ name: 'canonical-module-urls', setup(build) {
    build.onResolve({ filter: /\?v=\d+$/ }, async args => {
      const request = args.path.replace(/\?v=\d+$/, '');
      return build.resolve(request, { resolveDir: args.resolveDir, kind: args.kind });
    });
  } }],
});
const [entry] = Object.entries(result.metafile.outputs).find(([, v]) => v.entryPoint === 'js/main.js');
const relativeEntry = path.relative('dist', entry).split(path.sep).join('/');
let html = await readFile('index.html', 'utf8');
html = html.replace(/src="js\/main\.js\?v=\d+"/, `src="${relativeEntry}"`);
// Every runtime dependency used by the main application, including Three, is local.
html = html.replace(/<script type="importmap">[\s\S]*?<\/script>/, '');
await writeFile('dist/index.html', html);
await writeFile('dist/.nojekyll', '');
await writeFile('dist/build-meta.json', JSON.stringify(result.metafile, null, 2));
const seen = new Set();
function critical(file) {
  if (seen.has(file)) return;
  seen.add(file);
  for (const dep of result.metafile.outputs[file]?.imports || []) {
    if (!dep.external && dep.kind !== 'dynamic-import') critical(dep.path);
  }
}
critical(entry);
let bytes = 0, gzip = 0;
for (const file of seen) { const content = await readFile(file); bytes += content.length; gzip += gzipSync(content).length; }
console.log(JSON.stringify({ initialJavaScriptFiles: seen.size, initialJavaScriptBytes: bytes, initialJavaScriptGzipBytes: gzip, threeOnInitialPath: [...seen].some(f => Object.keys(result.metafile.outputs[f].inputs).some(i => i.includes('node_modules/three/'))) }, null, 2));
