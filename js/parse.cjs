const fs = require('fs');
const acorn = require('./acorn.js');

const code = fs.readFileSync('WorldTerrain.js', 'utf8');
const ast = acorn.parse(code, { ecmaVersion: 2022, sourceType: 'module' });

// We can do a rudimentary scope analysis, or just look for typical undefined vars.
// Let's do a simple walker.
function walk(node, visitor) {
  if (!node) return;
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visitor);
    return;
  }
  visitor(node);
  for (const key in node) {
    if (typeof node[key] === 'object' && key !== 'loc' && key !== 'range') {
      walk(node[key], visitor);
    }
  }
}

const globals = new Set([
  'THREE', 'Math', 'console', 'window', 'document', 'WORLD', 'DISTRICTS', 'ROADS', 'RIVER', 'RIVER_INLET', 'RIVER_OUTLET', 'terrainHeight', 'backgroundMountainElevation', 'distToRoads', 'distToRiver', 'getRiverInfo', 'riverWaterElevation', 'fbm', 'ridgeNoise', 'mulberry32', 'SIZE_DIMS', 'Surfaces', 'waterNormalTexture', 'textures', 'material', 'createBotanicalFoliageMaterial', 'clearCache', 'mergeGeometries'
]);

let declared = new Set();
let used = new Set();

// A real scope analyzer is complex, but let's just find anything used that isn't declared ANYWHERE in the file.
walk(ast, (node) => {
  if (node.type === 'VariableDeclarator') {
    if (node.id.type === 'Identifier') declared.add(node.id.name);
    // Add destructuring handling if needed
  }
  if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
    if (node.id && node.id.type === 'Identifier') declared.add(node.id.name);
    if (node.params) {
      node.params.forEach(p => {
        if (p.type === 'Identifier') declared.add(p.name);
      });
    }
  }
  if (node.type === 'ClassDeclaration' || node.type === 'ClassExpression') {
    if (node.id) declared.add(node.id.name);
  }
  if (node.type === 'MethodDefinition') {
    // Methods are declared
  }
  if (node.type === 'ImportDeclaration') {
    node.specifiers.forEach(spec => {
      declared.add(spec.local.name);
    });
  }
  if (node.type === 'Identifier') {
    used.add(node.name);
  }
});

for (const u of used) {
  if (!declared.has(u) && !globals.has(u)) {
    // Filter out some obvious object properties... wait, Identifier can be a property.
    // We should only look at Identifiers that are not property names!
  }
}
