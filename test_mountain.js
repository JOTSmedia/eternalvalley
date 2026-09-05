import { terrainHeight } from './js/terrain.js';

let maxH_ML = -1000;
let maxPt_ML = null;
// from (-500, -150) to (-300, -100)
for (let t=0; t<=1; t+=0.01) {
    let x = -500 + t * (-300 - -500);
    let z = -150 + t * (-100 - -150);
    let h = terrainHeight(x, z);
    if (h > maxH_ML) { maxH_ML = h; maxPt_ML = {x, z}; }
}

let maxH_LP = -1000;
let maxPt_LP = null;
// from (200, -250) to (450, -350)
for (let t=0; t<=1; t+=0.01) {
    let x = 200 + t * (450 - 200);
    let z = -250 + t * (-350 - -250);
    let h = terrainHeight(x, z);
    if (h > maxH_LP) { maxH_LP = h; maxPt_LP = {x, z}; }
}

console.log("Max terrain between (-500, -150) and (-300, -100):", maxH_ML, "at", maxPt_ML);
console.log("Max terrain between (200, -250) and (450, -350):", maxH_LP, "at", maxPt_LP);
