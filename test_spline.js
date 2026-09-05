import { terrainHeight } from './js/terrain.js';

class Vector3 {
    constructor(x, y, z) { this.x = x; this.y = y; this.z = z; }
    distanceToSquared(v) {
        const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
        return dx*dx + dy*dy + dz*dz;
    }
}

function calcCatmullRom(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    
    const v0 = (p2.x - p0.x) * 0.5;
    const v1 = (p3.x - p1.x) * 0.5;
    const x = (2 * (p1.x - p2.x) + v0 + v1) * t3 + (-3 * (p1.x - p2.x) - 2 * v0 - v1) * t2 + v0 * t + p1.x;
    
    const v0y = (p2.y - p0.y) * 0.5;
    const v1y = (p3.y - p1.y) * 0.5;
    const y = (2 * (p1.y - p2.y) + v0y + v1y) * t3 + (-3 * (p1.y - p2.y) - 2 * v0y - v1y) * t2 + v0y * t + p1.y;
    
    const v0z = (p2.z - p0.z) * 0.5;
    const v1z = (p3.z - p1.z) * 0.5;
    const z = (2 * (p1.z - p2.z) + v0z + v1z) * t3 + (-3 * (p1.z - p2.z) - 2 * v0z - v1z) * t2 + v0z * t + p1.z;
    
    return new Vector3(x, y, z);
}

// Three.js Centripetal Catmull-Rom uses a different knot parameterization.
// A simpler way: just approximate it or use actual centripetal logic.
// For centripetal Catmull-Rom:
function getCurvePoint(pts, t) {
    let p = (pts.length) * t;
    let intPoint = Math.floor(p);
    let weight = p - intPoint;
    
    let p0 = pts[(intPoint - 1 + pts.length) % pts.length];
    let p1 = pts[intPoint % pts.length];
    let p2 = pts[(intPoint + 1) % pts.length];
    let p3 = pts[(intPoint + 2) % pts.length];
    
    // Centripetal parameterization
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

// Instead of curve(t) spanning 0 to 1 based on arc length, we span index parameterization.
// Three.js CatmullRomCurve3 without specific knot type maps arc lengths if we ask for it.
// To find clipping, we can just step through index parameterization in small increments.
const steps = 10000;
let clippings = [];
let maxDives = [];
for(let i=0; i<steps; i++) {
    const t = i / steps;
    const pt = getCurvePoint(tourPoints, t);
    const th = terrainHeight(pt.x, pt.z);
    
    let objectHeight = th;
    // Check Mosque
    if (Math.hypot(pt.x - -480, pt.z - -200) < 65) {
       objectHeight = Math.max(objectHeight, 165);
    }
    // Check Pagoda
    if (Math.hypot(pt.x - 560, pt.z - -540) < 65) {
       objectHeight = Math.max(objectHeight, 268);
    }
    // Check Lake
    if (Math.hypot(pt.x - 430, pt.z - -260) < 295) {
       objectHeight = Math.max(objectHeight, 12);
    }

    if (pt.y < objectHeight) {
        clippings.push(`pt=(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}, ${pt.z.toFixed(1)}) objH=${objectHeight.toFixed(1)}`);
        maxDives.push(objectHeight - pt.y);
    }
}
if (clippings.length > 0) {
    console.log("Found clippings!");
    console.log("First clip:", clippings[0]);
    console.log("Max dive depth:", Math.max(...maxDives));
    console.log("Last clip:", clippings[clippings.length - 1]);
} else {
    console.log("No clipping detected!");
}
