import { terrainHeight } from './js/terrain.js';

class Vector3 {
    constructor(x, y, z) { this.x = x; this.y = y; this.z = z; }
    distanceToSquared(v) {
        const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
        return dx*dx + dy*dy + dz*dz;
    }
}

function getCurvePoint(pts, t) {
    let p = (pts.length) * t;
    let intPoint = Math.floor(p);
    let weight = p - intPoint;
    
    let p0 = pts[(intPoint - 1 + pts.length) % pts.length];
    let p1 = pts[intPoint % pts.length];
    let p2 = pts[(intPoint + 1) % pts.length];
    let p3 = pts[(intPoint + 2) % pts.length];
    
    let dt0 = Math.pow(p0.distanceToSquared(p1), 0.25);
    let dt1 = Math.pow(p1.distanceToSquared(p2), 0.25);
    let dt2 = Math.pow(p2.distanceToSquared(p3), 0.25);
    
    if (dt1 < 1e-4) dt1 = 1.0;
    if (dt0 < 1e-4) dt0 = dt1;
    if (dt2 < 1e-4) dt2 = dt1;

    let t1 = (p1.x - p0.x) / dt0 - (p2.x - p0.x) / (dt0 + dt1) + (p2.x - p1.x) / dt1;
    let t2 = (p2.x - p1.x) / dt1 - (p3.x - p1.x) / (dt1 + dt2) + (p3.x - p2.x) / dt2;
    t1 *= dt1;
    t2 *= dt1;
    const x = (2*p1.x - 2*p2.x + t1 + t2)*weight*weight*weight + (-3*p1.x + 3*p2.x - 2*t1 - t2)*weight*weight + t1*weight + p1.x;

    t1 = (p1.y - p0.y) / dt0 - (p2.y - p0.y) / (dt0 + dt1) + (p2.y - p1.y) / dt1;
    t2 = (p2.y - p1.y) / dt1 - (p3.y - p1.y) / (dt1 + dt2) + (p3.y - p2.y) / dt2;
    t1 *= dt1;
    t2 *= dt1;
    const y = (2*p1.y - 2*p2.y + t1 + t2)*weight*weight*weight + (-3*p1.y + 3*p2.y - 2*t1 - t2)*weight*weight + t1*weight + p1.y;

    t1 = (p1.z - p0.z) / dt0 - (p2.z - p0.z) / (dt0 + dt1) + (p2.z - p1.z) / dt1;
    t2 = (p2.z - p1.z) / dt1 - (p3.z - p1.z) / (dt1 + dt2) + (p3.z - p2.z) / dt2;
    t1 *= dt1;
    t2 *= dt1;
    const z = (2*p1.z - 2*p2.z + t1 + t2)*weight*weight*weight + (-3*p1.z + 3*p2.z - 2*t1 - t2)*weight*weight + t1*weight + p1.z;

    return new Vector3(x, y, z);
}

const tourPoints = [
  new Vector3(0, 50.0, 1300),
  new Vector3(0, 36.5, 885),
  new Vector3(0, 75.0, 600),
  new Vector3(0, 70.0, 300),
  new Vector3(80, 140.0, 50),
  new Vector3(-80, 150.0, -100),
  new Vector3(-20, 140.0, -300),
  new Vector3(0, 260.0, -480),
  new Vector3(0, 290.0, -560),
  new Vector3(40, 310.0, -600),
  new Vector3(-100, 360.0, -700),
  new Vector3(-200, 330.0, -550),
  new Vector3(-350, 240.0, -350),
  new Vector3(-500, 210.0, -150),
  new Vector3(-300, 120.0, -100),
  new Vector3(200, 90.0, -250),
  new Vector3(450, 310.0, -350),
  new Vector3(580, 340.0, -550),
  new Vector3(400, 220.0, 800),
  new Vector3(100, 140.0, 2100),
  new Vector3(-100, 120.0, 1500),
  new Vector3(0, 100.0, 1300),
];

const steps = 10000;
let minMosqueDist = Infinity;
let minMosquePt = null;

let minPagodaDist = Infinity;
let minPagodaPt = null;

for(let i=0; i<steps; i++) {
    const t = i / steps;
    const pt = getCurvePoint(tourPoints, t);
    
    // Mosque (-480, -200)
    let dMosque = Math.hypot(pt.x - -480, pt.z - -200);
    if (dMosque < minMosqueDist) {
        minMosqueDist = dMosque;
        minMosquePt = pt;
    }
    
    // Pagoda (560, -540)
    let dPagoda = Math.hypot(pt.x - 560, pt.z - -540);
    if (dPagoda < minPagodaDist) {
        minPagodaDist = dPagoda;
        minPagodaPt = pt;
    }
}

console.log("Mosque nearest approach:");
console.log(`Dist: ${minMosqueDist.toFixed(1)}m`);
console.log(`Drone y: ${minMosquePt.y.toFixed(1)}m`);
console.log(`Clearance (assuming dome 165m): ${(minMosquePt.y - 165).toFixed(1)}m`);

console.log("\nPagoda nearest approach:");
console.log(`Dist: ${minPagodaDist.toFixed(1)}m`);
console.log(`Drone y: ${minPagodaPt.y.toFixed(1)}m`);
console.log(`Clearance (assuming roof 268m): ${(minPagodaPt.y - 268).toFixed(1)}m`);

