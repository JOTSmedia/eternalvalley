import { terrainHeight } from './js/terrain.js';

let maxH = -1000;
let maxPt = null;

// The drone path from Pagoda (580, 340, -550) to Kaya Island (400, 220, 800)
// We are evaluating straight line approximation first.
for (let t=0; t<=1; t+=0.01) {
    let x = 580 + t * (400 - 580);
    let z = -550 + t * (800 - -550);
    let h = terrainHeight(x, z);
    if (h > maxH) { maxH = h; maxPt = {x, z}; }
}
console.log("Max terrain straight line Pagoda->Kaya:", maxH, "at", maxPt);

