import * as THREE from 'three';
import { textures } from './materials.js?v=26';

// Photographic albedo stays unlit. Three's BRDF supplies the sunlight exactly once.
// World-space mapping keeps cliffs and flat ground at a consistent physical scale.
export function createTerrainMaterial(renderer, { snowMin = 285, snowMax = 365 } = {}) {
  const grass = textures('meadowLush');
  const rock = textures('photogrammetryRock');
  const soil = textures('mossyScree');
  for (const set of [grass, rock, soil]) {
    for (const tex of Object.values(set)) {
      tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    }
  }
  const material = new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 });
  material.name = 'Natural terrain';
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, {
      snowRange: { value: new THREE.Vector2(snowMin, snowMax) },
      grassMap: { value: grass.map }, grassNormal: { value: grass.normalMap },
      grassRough: { value: grass.roughnessMap },
      rockMap: { value: rock.map }, rockNormal: { value: rock.normalMap },
      rockRough: { value: rock.roughnessMap }, soilMap: { value: soil.map },
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
        varying vec3 terrainPosition;
        varying vec3 terrainNormal;
        varying float terrainAO;
        vec3 weights(vec3 n) {
          vec3 w = pow(abs(n), vec3(4.0));
          return w / max(w.x + w.y + w.z, 0.0001);
        }
        vec3 triColor(sampler2D tex, vec3 p, vec3 w) {
          return texture2D(tex, p.zy).rgb * w.x
            + texture2D(tex, p.xz).rgb * w.y
            + texture2D(tex, p.xy).rgb * w.z;
        }
        vec3 triNormal(sampler2D tex, vec3 p, vec3 n, vec3 w) {
          vec3 a = texture2D(tex, p.zy).xyz * 2.0 - 1.0;
          vec3 b = texture2D(tex, p.xz).xyz * 2.0 - 1.0;
          vec3 c = texture2D(tex, p.xy).xyz * 2.0 - 1.0;
          // Reorient each tangent perturbation onto its projection plane.
          vec3 detail = vec3(0.0, a.y, a.x) * w.x
            + vec3(b.x, 0.0, b.y) * w.y + vec3(c.x, c.y, 0.0) * w.z;
          detail -= n * dot(detail, n);
          return normalize(n + detail * 0.38);
        }`)
      .replace('#include <map_fragment>', `
        vec3 tn = normalize(terrainNormal);
        vec3 tw = weights(tn);
        float grassWeight = smoothstep(0.60, 0.88, tn.y);
        vec3 gp = terrainPosition * 0.22;
        vec3 rp = terrainPosition * 0.075;
        // A rotated second scale breaks visible texture repetition.
        vec2 macroUV = mat2(0.8, -0.6, 0.6, 0.8) * terrainPosition.xz * 0.023;
        float macro = dot(texture2D(soilMap, macroUV).rgb, vec3(0.2126, 0.7152, 0.0722));
        vec3 grassAlbedo = texture2D(grassMap, gp.xz).rgb;
        vec3 rockAlbedo = triColor(rockMap, rp, tw);
        float coastal = smoothstep(900.0, 980.0, terrainPosition.z)
          * (1.0 - smoothstep(1.0, 8.0, terrainPosition.y));
        grassWeight *= 1.0 - coastal;
        vec3 groundAlbedo = mix(rockAlbedo, grassAlbedo, grassWeight);
        groundAlbedo = mix(groundAlbedo, vec3(0.40, 0.34, 0.24), coastal);
        groundAlbedo *= mix(0.86, 1.08, smoothstep(0.05, 0.45, macro));
        float snowWeight = smoothstep(snowRange.x, snowRange.y, terrainPosition.y)
          * smoothstep(0.52, 0.86, tn.y);
        groundAlbedo = mix(groundAlbedo, vec3(0.72, 0.76, 0.78), snowWeight);
        diffuseColor.rgb *= groundAlbedo;
      `)
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        vec3 rockN = triNormal(rockNormal, rp, tn, tw);
        vec3 gn = texture2D(grassNormal, gp.xz).xyz * 2.0 - 1.0;
        vec3 grassN = normalize(tn + vec3(gn.x, 0.0, gn.y) * 0.28);
        vec3 detailN = normalize(mix(rockN, grassN, grassWeight));
        detailN = normalize(mix(detailN, tn, snowWeight * 0.65));
        normal = normalize(mat3(viewMatrix) * detailN);
      `)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        float rr = dot(triColor(rockRough, rp, tw), vec3(0.333333));
        float gr = texture2D(grassRough, gp.xz).g;
        roughnessFactor = clamp(mix(rr, gr, grassWeight), 0.68, 1.0);
      `)
      .replace('#include <aomap_fragment>', `#include <aomap_fragment>
        reflectedLight.indirectDiffuse *= mix(0.65, 1.0, clamp(terrainAO, 0.0, 1.0));
      `);
  };
  material.customProgramCacheKey = () => 'natural-terrain-v1';
  return material;
}
