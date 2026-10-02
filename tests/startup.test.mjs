import test from 'node:test';
import { execFileSync } from 'node:child_process';

test('the production bundle boots and navigation works without WebGL or external services', () => {
  execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: new URL('../', import.meta.url), stdio: 'pipe' });
  execFileSync(process.execPath, ['tests/fixtures/built-startup.mjs'], { cwd: new URL('../', import.meta.url), stdio: 'pipe', timeout: 15000 });
});
