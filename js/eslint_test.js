const fs = require('fs');
const eslint = require('eslint');

async function main() {
  const cli = new eslint.ESLint({
    useEslintrc: false,
    overrideConfig: {
      env: { browser: true, es2021: true, node: true },
      parserOptions: { ecmaVersion: 12, sourceType: 'module' },
      rules: {
        'no-undef': 'error'
      }
    }
  });

  const results = await cli.lintFiles(['WorldTerrain.js', 'WorldLighting.js', 'WorldCore.js', 'ui.js', 'api.js', 'main.js']);
  const formatter = await cli.loadFormatter('stylish');
  const resultText = formatter.format(results);
  console.log(resultText);
}
main().catch(console.error);
