const fs = require('fs');
function extractWords(file) {
  const content = fs.readFileSync(file, 'utf8');
  const clean = content.replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/['"\`][\s\S]*?['"\`]/g, '');
  const words = clean.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
  return [...new Set(words)].sort();
}
console.log("Mosque:", extractWords('mosque.js').join(', '));
