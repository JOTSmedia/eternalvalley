import * as THREE from 'three';
import { textures } from './materials.js?v=26';

// Photographic albedo stays unlit. Three's BRDF supplies the sunlight exactly once.
// World-space mapping keeps cliffs and flat ground at a consistent physical scale.
export function createTerrainMaterial(renderer, { snowMin = 285, snowMax = 365 } = {}) {
  const grass = textures('meadowLush');
  const rock = textures('photogrammetryRock');
  const soil = textures('woodlandSoil');
  const sand = textures('coastalSand');
  for (const set of [grass, rock, soil, sand]) {
    for (const tex of Object.values(set)) {
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    }
  }
  const material = new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 });
  material.name = 'Photographic terrain';
  material.userData.ready = Promise.all([grass.ready, rock.ready, soil.ready, sand.ready]);
  material.userData.ready.catch(() => {});
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, {
      snowRange: { value: new THREE.Vector2(snowMin, snowMax) },
      grassMap: { value: grass.map }, grassNormal: { value: grass.normalMap },
      grassRough: { value: grass.roughnessMap },
      rockMap: { value: rock.map }, rockNormal: { value: rock.normalMap },
      rockRough: { value: rock.roughnessMap }, soilMap: { value: soil.map },
      sandMap: { value: sand.map }, sandNormal: { value: sand.normalMap }, sandRough: { value: sand.roughnessMap },
    });
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        attribute float aCreviceAO;
        varying vec3 terrainPosition;
        varying vec3 terrainNormal;
        varying float terrainAO;`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        terrainPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        terrainNormal = normalize(mat3(modelMatrix) * normal);
        terrainAO = aCreviceAO;`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform vec2 snowRange;
        uniform sampler2D grassMap, grassNormal, grassRough;
        uniform sampler2D rockMap, rockNormal, rockRough, soilMap;
        uniform sampler2D sandMap, sandNormal, sandRough;
        varying vec3 terrainPosition;
        varying vec3 terrainNormal;
        varying float terrainAO;
        vec3 weights(vec3 n) {
          vec3 w = pow(abs(n), vec3(4.0));
          return w / max(w.x + w.y + w.z, 0.0001);
        }
        float terrainHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float terrainNoise(vec2 p) {
          vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
          return mix(mix(terrainHash(i), terrainHash(i+vec2(1.0,0.0)), f.x),
            mix(terrainHash(i+vec2(0.0,1.0)), terrainHash(i+vec2(1.0,1.0)), f.x), f.y);
        }
        // Two offset samples share a continuous blend across the landscape.
        // Every PBR channel uses the same coordinates so its detail stays aligned.
        vec3 untiled(sampler2D tex, vec2 uv) {
          float k = terrainNoise(uv * 0.075) * 8.0;
          float i = floor(k), f = fract(k);
          vec2 a = vec2(terrainHash(vec2(i, 1.0)), terrainHash(vec2(i, 2.0))) * 17.0;
          vec2 b = vec2(terrainHash(vec2(i+1.0, 1.0)), terrainHash(vec2(i+1.0, 2.0))) * 17.0;
          return mix(texture2D(tex, uv+a).rgb, texture2D(tex, uv+b).rgb, smoothstep(0.15,0.85,f));
        }
        vec3 triColor(sampler2D tex, vec3 p, vec3 w) {
          vec3 c = vec3(0.0);
          if (w.x > 0.002) c += untiled(tex, p.zy) * w.x;
          if (w.y > 0.002) c += untiled(tex, p.xz) * w.y;
          if (w.z > 0.002) c += untiled(tex, p.xy) * w.z;
          return c;

        }
        vec3 triNormal(sampler2D tex, vec3 p, vec3 n, vec3 w) {
          vec3 a = untiled(tex, p.zy) * 2.0 - 1.0;
          vec3 b = untiled(tex, p.xz) * 2.0 - 1.0;
          vec3 c = untiled(tex, p.xy) * 2.0 - 1.0;
          // Reorient each tangent perturbation onto its projection plane.
          vec3 detail = vec3(0.0, a.y, a.x) * w.x
            + vec3(b.x, 0.0, b.y) * w.y + vec3(c.x, c.y, 0.0) * w.z;
          detail -= n * dot(detail, n);
          return normalize(n + detail * 0.38);
        }`)
      .replace('#include <map_fragment>', `
        vec3 tn = normalize(terrainNormal);
        vec3 tw = weights(tn);
        float ecology = terrainNoise(terrainPosition.xz * 0.013);
        float grassWeight = smoothstep(0.60, 0.88, tn.y + (ecology - 0.5) * 0.10);
        vec3 gp = terrainPosition * 0.7142857;
        vec3 rp = terrainPosition * 0.02;
        // A rotated second scale breaks visible texture repetition.
        vec2 macroUV = mat2(0.8, -0.6, 0.6, 0.8) * terrainPosition.xz * 0.023;
        float macro = dot(texture2D(soilMap, macroUV).rgb, vec3(0.2126, 0.7152, 0.0722));
        vec3 grassAlbedo = untiled(grassMap, gp.xz);
        vec3 rockAlbedo = triColor(rockMap, rp, tw);
        float coastal = smoothstep(900.0, 980.0, terrainPosition.z)
          * (1.0 - smoothstep(1.0, 8.0, terrainPosition.y));
        grassWeight *= 1.0 - coastal;
        vec3 groundAlbedo = mix(rockAlbedo, grassAlbedo, grassWeight);
        groundAlbedo = mix(groundAlbedo, untiled(sandMap, terrainPosition.xz * 0.0666667), coastal);
        float soilWeight = (1.0 - smoothstep(0.2, 0.62, ecology)) * grassWeight * 0.35;
        groundAlbedo = mix(groundAlbedo, untiled(soilMap, terrainPosition.xz * 0.5), soilWeight);
        float damp = (1.0 - smoothstep(0.6, 3.2, terrainPosition.y)) * coastal;
        groundAlbedo *= mix(0.80, 1.07, smoothstep(0.05, 0.45, macro));
        groundAlbedo *= 1.0 - damp * 0.28;
        float snowWeight = smoothstep(snowRange.x, snowRange.y, terrainPosition.y + (ecology - 0.5) * 35.0)
          * smoothstep(0.52, 0.86, tn.y);
        groundAlbedo = mix(groundAlbedo, vec3(0.72, 0.76, 0.78) * mix(0.91, 1.06, terrainNoise(terrainPosition.xz * 0.5)), snowWeight);
        diffuseColor.rgb *= groundAlbedo;
      `)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        vec3 rockN = triNormal(rockNormal, rp, tn, tw);
        vec3 gn = untiled(grassNormal, gp.xz) * 2.0 - 1.0;
        vec3 grassN = normalize(tn + vec3(gn.x, 0.0, gn.y) * 0.28);
        vec3 detailN = normalize(mix(rockN, grassN, grassWeight));
        vec3 sn = untiled(sandNormal, terrainPosition.xz * 0.0666667) * 2.0 - 1.0;
        detailN = normalize(mix(detailN, normalize(tn + vec3(sn.x,0.0,sn.y)*0.18), coastal));
        detailN = normalize(mix(detailN, tn, snowWeight * 0.65));
        normal = normalize(mat3(viewMatrix) * detailN);
      `)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        float rr = dot(triColor(rockRough, rp, tw), vec3(0.333333));
        float gr = untiled(grassRough, gp.xz).g;
        roughnessFactor = clamp(mix(mix(rr, gr, grassWeight), untiled(sandRough, terrainPosition.xz * 0.0666667).g, coastal) - damp * 0.18, 0.52, 1.0);
      `)
      .replace('#include <aomap_fragment>', `#include <aomap_fragment>
        reflectedLight.indirectDiffuse *= mix(0.65, 1.0, clamp(terrainAO, 0.0, 1.0));
      `);
  };
  material.customProgramCacheKey = () => 'natural-terrain-v2';
  return material;
}
