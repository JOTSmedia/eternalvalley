import { terrainHeight } from './js/terrain.js';

let maxH = -1000;
let maxPt = null;
for (let t=0; t<=1; t+=0.01) {
    let x = -350 + t * (-100 - -350);
    let z = -350 + t * (-100 - -350);
    let h = terrainHeight(x, z);
    if (h > maxH) { maxH = h; maxPt = {x, z}; }
}
console.log("Max terrain between (-350, -350) and (-100, -100):", maxH, "at", maxPt);

maxH = -1000; maxPt = null;
for (let t=0; t<=1; t+=0.01) {
    let x = -100 + t * (580 - -100);
    let z = -100 + t * (-550 - -100);
    let h = terrainHeight(x, z);
    if (h > maxH) { maxH = h; maxPt = {x, z}; }
}
console.log("Max terrain between (-100, -100) and (580, -550):", maxH, "at", maxPt);

