import { readdir, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { Linter } from 'eslint';
const linter = new Linter();
let errors = 0;
for (const name of await readdir('js')) {
  if (!name.endsWith('.js')) continue;
  const file = `js/${name}`;
  execFileSync(process.execPath, ['--check', file]);
  const source = await readFile(file, 'utf8');
  const messages = linter.verify(source, {
    parserOptions: { ecmaVersion: 2022, sourceType: 'module' }, env: { browser: true, es2022: true },
    globals: { google: 'readonly', L: 'readonly' },
    rules: { 'no-undef': 'error', 'no-unreachable': 'error', 'no-dupe-class-members': 'error' },
  });
  for (const m of messages) { console.error(`${file}:${m.line} ${m.message}`); errors++; }
}
if (errors) process.exitCode = 1;
else console.log('JavaScript syntax and reference checks passed.');
