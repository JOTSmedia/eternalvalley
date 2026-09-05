  _moorishMosque() {
    const g = new THREE.Group();
    const mx = WORLD.mosque.x, mz = WORLD.mosque.z;
    const my = terrainHeight(mx, mz); // perfectly grounded foundation
    g.position.set(mx, my, mz);

    const marble = material('honedCarraraMarble', { repeat: 2.0, color: 0xfffcf8, roughness: 0.12, metalness: 0.05, physical: true, clearcoat: 0.4, clearcoatRoughness: 0.2 });
    const stone = material('agedCaenLimestone', { repeat: 3.0, color: 0xc4b7a6, roughness: 0.8, metalness: 0.0, normalScale: 1.5, aoMapIntensity: 1.3 });
    const zellij = Surfaces.moorishZellij(3.8);
    const carvedStucco = material('stuccoMuqarnas', { repeat: 2.5, color: 0xfdfaf4, roughness: 0.9, metalness: 0.0, normalScale: 2.2, aoMapIntensity: 1.8 });
    const turquoiseTile = material('moorishZellij', {
      repeat: 6.0, color: 0x1292a2, roughness: 0.04, metalness: 0.0, physical: true, clearcoat: 1.0, clearcoatRoughness: 0.01, ior: 1.65, reflectivity: 0.95, clearcoatNormalScale: 0.5
    });
    const gold = Surfaces.gold(1.0);
//     gold.color.setHex(0xffd700);
//     gold.roughness = 0.15;
//     gold.clearcoat = 0.8;
//     gold.clearcoatRoughness = 0.1;
    const darkCedar = material('timber', { repeat: 3.0, color: 0x2e1a10, roughness: 0.7, metalness: 0.0, physical: true, clearcoat: 0.1, clearcoatRoughness: 0.5, normalScale: 1.4 });
    const brass = material('bronze', { repeat: 2.0, color: 0xb5a642, roughness: 0.3, metalness: 0.8, physical: true, clearcoat: 0.3, clearcoatRoughness: 0.4 });

    // 1. Terraced Carrara Marble & Limestone Foundation Platform
    const platformGeo = new THREE.BoxGeometry(40, 4.0, 58);
    const platform = new THREE.Mesh(platformGeo, stone);
    platform.position.set(0, 0.2, 7);
    platform.receiveShadow = platform.castShadow = true;
    g.add(platform);

    const courtyardFloor = new THREE.Mesh(new THREE.PlaneGeometry(38, 56), marble);
    courtyardFloor.rotation.x = -Math.PI / 2;
    courtyardFloor.position.set(0, 2.21, 7);
    courtyardFloor.receiveShadow = true;
    g.add(courtyardFloor);

    // Decorative Zellij Mosaic Runner Borders across courtyard
    const zellijRunnerGeo = new THREE.PlaneGeometry(36, 1.4);
    zellijRunnerGeo.rotateX(-Math.PI / 2);
    [0, 18, 34].forEach(rz => {
      const runner = new THREE.Mesh(zellijRunnerGeo, zellij);
      runner.position.set(0, 2.24, rz);
      g.add(runner);
    });

    // 2. Grand Rectangular Carrara Marble Reflecting Pool (Patio de los Arrayanes style)
    const poolGroup = new THREE.Group();
    poolGroup.position.set(0, 2.2, 17); // Centered in the open court

    const poolLength = 28;
    const poolWidth = 10.5;
    const poolDepth = 0.75;

    // Sunken Basin Walls & Zellij Tiled Interior Floor
    const basinGeo = new THREE.BoxGeometry(poolWidth + 1.2, poolDepth + 0.4, poolLength + 1.2);
    const basinOuter = new THREE.Mesh(basinGeo, marble);
    basinOuter.position.y = -poolDepth * 0.5 + 0.1;
    poolGroup.add(basinOuter);

    const poolWaterGeo = new THREE.PlaneGeometry(poolWidth, poolLength);
    poolWaterGeo.rotateX(-Math.PI / 2);
    const poolWater = new THREE.Mesh(poolWaterGeo, this.world._waterPoolMat || new THREE.MeshPhysicalMaterial({
      color: 0x145262, roughness: 0.05, metalness: 0.4
    }));
    poolWater.position.y = 0.08;
    poolGroup.add(poolWater);
    if (this.world._reflectiveMeshes) this.world._reflectiveMeshes.push(poolWater);

    // Molded Carrara Marble Coping Rims with Beveled Edge
    const curbLongGeo = new THREE.BoxGeometry(0.8, 0.28, poolLength + 1.6);
    [-poolWidth / 2 - 0.4, poolWidth / 2 + 0.4].forEach(cx => {
      const curb = new THREE.Mesh(curbLongGeo, marble);
      curb.position.set(cx, 0.14, 0);
      curb.castShadow = true;
      poolGroup.add(curb);
    });

    const curbShortGeo = new THREE.BoxGeometry(poolWidth + 1.6, 0.28, 0.8);
    [-poolLength / 2 - 0.4, poolLength / 2 + 0.4].forEach(cz => {
      const curb = new THREE.Mesh(curbShortGeo, marble);
      curb.position.set(0, 0.14, cz);
      curb.castShadow = true;
      poolGroup.add(curb);
    });

    // Bubbling Scalloped Marble Fountain Bowls & Runnels at North and South Pool Ends
    [-poolLength / 2 + 1.8, poolLength / 2 - 1.8].forEach(fz => {
      const fountain = new THREE.Group();
      fountain.position.set(0, 0, fz);

      const fBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.9, 0.45, 24), marble);
      fBase.position.y = 0.22;
      fountain.add(fBase);

      const fBowl = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 0.8, 0.5, 24), marble);
      fBowl.position.y = 0.65;
      fBowl.castShadow = true;
      fountain.add(fBowl);

      // Bubbling Water Dome inside fountain bowl
      const fWater = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.45), this.world._waterPoolMat || new THREE.MeshPhysicalMaterial({
        color: 0x22889e, roughness: 0.04, metalness: 0.35, transparent: true, logarithmicDepthBuffer: true, opacity: 0.88
      }));
      fWater.position.y = 0.68;
      fountain.add(fWater);

      const fSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 0.6, 16), brass);
      fSpout.position.y = 1.05;
      fountain.add(fSpout);

      // Water Runnel Channel (Al-Saqiya) connecting fountain to pool
      const runnel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 3.2), marble);
      runnel.position.set(0, 0.10, fz > 0 ? -1.8 : 1.8);
      fountain.add(runnel);

      poolGroup.add(fountain);
    });

    // Floating Water Lilies & Lotus Blossoms on Reflecting Pool
    const lilyPadGeo = new THREE.CircleGeometry(0.55, 12, 0, Math.PI * 1.85);
    lilyPadGeo.rotateX(-Math.PI / 2);
    const lilyPadMat = new THREE.MeshPhysicalMaterial({ color: 0x2d6330, roughness: 0.75, side: THREE.DoubleSide });

    const lilyPositions = [
      { x: -2.5, z: -6.0 }, { x: 3.0, z: -4.5 }, { x: -3.2, z: 2.0 },
      { x: 2.8, z: 5.5 }, { x: -2.0, z: 8.0 }, { x: 1.5, z: -9.5 }
    ];
    lilyPositions.forEach((lp, li) => {
      const pad = new THREE.Mesh(lilyPadGeo, lilyPadMat);
      pad.position.set(lp.x, 0.09, lp.z);
      pad.rotation.y = li * 1.1;
      poolGroup.add(pad);

      const blossomMat = new THREE.MeshPhysicalMaterial({
        color: li % 2 === 0 ? 0xffffff : 0xf8b4d8, emissive: 0xffe2f0, emissiveIntensity: 0.6, roughness: 0.3
      });
      const blossom = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 0), blossomMat);
      blossom.position.set(lp.x + 0.1, 0.18, lp.z + 0.1);
      poolGroup.add(blossom);
    });

    // Sunken Parterres with Geometric Myrtle Hedges & Stately Columnar Mediterranean Cypresses
    const cypressBark = Surfaces.bark(1.5);
    const cypressFoliageMat = Surfaces.cypressFoliage();
    if (this.world._windMaterials) this.world._windMaterials.push(cypressFoliageMat);

    const createCurvedCypressCardGeo = (w, h, curveDepth = 0.35) => {
      const geo = new THREE.PlaneGeometry(w, h, 2, 2);
      const cpos = geo.attributes.position;
      for (let i = 0; i < cpos.count; i++) {
        const x = cpos.getX(i), y = cpos.getY(i);
        const u = x / (w * 0.5), v = y / (h * 0.5);
        cpos.setZ(i, (1.0 - u * u) * curveDepth * (1.0 - v * 0.25));
      }
      geo.computeVertexNormals();
      return geo;
    };

    const cypressTrunkGeo = (() => {
      const parts = [];
      const base = new THREE.CylinderGeometry(0.55, 1.1, 1.8, 8);
      base.translate(0, 0.9, 0);
      parts.push(base);

      const trunk = new THREE.CylinderGeometry(0.28, 0.55, 5.5, 8);
      trunk.translate(0, 4.25, 0);
      parts.push(trunk);
      return safeMerge(parts, false) || base;
    })();

    const cypressCanopyGeo = (() => {
      const parts = [];
      const numSprigs = 56;
      const goldenAngle = 2.39996;
      for (let i = 0; i < numSprigs; i++) {
        const frac = i / (numSprigs - 1);
        const y = 1.4 + frac * 16.5;
        const ang = i * goldenAngle;
        const profile = Math.sin(Math.pow(frac, 0.45) * Math.PI);
        const radius = (0.65 * profile + 0.18);
        
        const cardW = 1.45 * (1.0 - frac * 0.30);
        const cardH = 2.4 * (1.0 - frac * 0.30);
        const q1 = createCurvedCypressCardGeo(cardW, cardH, 0.28);
        q1.rotateX(0.18 + (1.0 - frac) * 0.20);
        q1.rotateY(ang);
        q1.translate(Math.cos(ang) * radius, y, Math.sin(ang) * radius);
        parts.push(q1);
      }
      const merged = safeMerge(parts, false) || parts[0];
      if (merged && merged.attributes.position && merged.attributes.normal) {
        const pos = merged.attributes.position;
        const norm = merged.attributes.normal;
        for (let i = 0; i < pos.count; i++) {
          const px = pos.getX(i), pz = pos.getZ(i);
          const rad = Math.hypot(px, pz) || 1.0;
          const nx = (px / rad) * 0.85 + norm.getX(i) * 0.15;
          const ny = 0.15 + norm.getY(i) * 0.15;
          const nz = (pz / rad) * 0.85 + norm.getZ(i) * 0.15;
          const len = Math.hypot(nx, ny, nz) || 1.0;
          norm.setXYZ(i, nx / len, ny / len, nz / len);
        }
        norm.needsUpdate = true;
      }
      return merged;
    })();

    // Flanking East and West Sunken Flower Beds & Cypress Columns
    [-11.5, 11.5].forEach(px => {
      // Sunken planter curb
      const planter = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.35, 32), marble);
      planter.position.set(px, 0.18, 0);
      poolGroup.add(planter);

      const planterSoil = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 31.4), new THREE.MeshPhysicalMaterial({
        color: 0x3d3226, roughness: 0.95
      }));
      planterSoil.rotation.x = -Math.PI / 2;
      planterSoil.position.set(px, 0.36, 0);
      poolGroup.add(planterSoil);

      // Manicured Boxwood / Myrtle Hedge
      const hedge = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.65, 31), new THREE.MeshPhysicalMaterial({
        color: 0x224e24, roughness: 0.85
      }));
      hedge.position.set(px, 0.68, 0);
      hedge.castShadow = true;
      poolGroup.add(hedge);

      // 4 Columnar Mediterranean Cypresses along each side
      for (let cyZ = -12; cyZ <= 12; cyZ += 8) {
        const cypressTree = new THREE.Group();
        cypressTree.position.set(px, 0.36, cyZ);

        const trunkMesh = new THREE.Mesh(cypressTrunkGeo, cypressBark);
        trunkMesh.castShadow = true;
        cypressTree.add(trunkMesh);

        const canopyMesh = new THREE.Mesh(cypressCanopyGeo, cypressFoliageMat);
        canopyMesh.castShadow = false;
        canopyMesh.receiveShadow = true;
        cypressTree.add(canopyMesh);

        poolGroup.add(cypressTree);
      }
    });

    g.add(poolGroup);

    // 3. Alhambra Grand Hypostyle Horseshoe & Polylobed Arcade Portico (North Sanctuary)
    const hallGroup = new THREE.Group();
    hallGroup.position.set(0, 2.2, -10);

    // Sanctuary Floor with Carrara Marble & Zellij Inlays
    const hallFloor = new THREE.Mesh(new THREE.BoxGeometry(34, 0.6, 20), zellij);
    hallFloor.position.y = 0.3;
    hallFloor.receiveShadow = true;
    hallGroup.add(hallFloor);

    // Sanctuary Enclosure Walls
    const rearWall = new THREE.Mesh(new THREE.BoxGeometry(34, 11.0, 1.8), marble);
    rearWall.position.set(0, 5.8, -9.2);
    rearWall.castShadow = rearWall.receiveShadow = true;
    hallGroup.add(rearWall);

    // Side Sanctuary Walls (West Wall solid; East Wall has Open Horseshoe Exit Arch at z = 2 to 6 leading to eastern arcade)
    const sideW_West = new THREE.Mesh(new THREE.BoxGeometry(1.8, 11.0, 20), marble);
    sideW_West.position.set(-17, 5.8, 0);
    sideW_West.castShadow = sideW_West.receiveShadow = true;
    hallGroup.add(sideW_West);

    // East Wall sections flanking the open exit portal (world x = -455, z = -195)
    const sideW_East_Rear = new THREE.Mesh(new THREE.BoxGeometry(1.8, 11.0, 11.0), marble);
    sideW_East_Rear.position.set(17, 5.8, -4.5);
    sideW_East_Rear.castShadow = sideW_East_Rear.receiveShadow = true;
    hallGroup.add(sideW_East_Rear);

    const sideW_East_Front = new THREE.Mesh(new THREE.BoxGeometry(1.8, 11.0, 3.0), marble);
    sideW_East_Front.position.set(17, 5.8, 8.5);
    sideW_East_Front.castShadow = sideW_East_Front.receiveShadow = true;
    hallGroup.add(sideW_East_Front);

    const sideW_East_Top = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.5, 6.0), marble);
    sideW_East_Top.position.set(17, 9.55, 4.0);
    sideW_East_Top.castShadow = true;
    hallGroup.add(sideW_East_Top);

    // 2.4m High Continuous Zellij Geometric Mosaic Dado along interior walls
    const dadoGeo = new THREE.BoxGeometry(33.8, 2.6, 0.1);
    const dadoRear = new THREE.Mesh(dadoGeo, zellij);
    dadoRear.position.set(0, 1.6, -8.2);
    hallGroup.add(dadoRear);

    // Carved Golden Mihrab Niche (Nicho del Mihrab) in Rear Wall
    const mihrabGroup = new THREE.Group();
    mihrabGroup.position.set(0, 0, -8.1);

    const mihrabFrame = new THREE.Mesh(new THREE.BoxGeometry(5.2, 8.2, 0.4), carvedStucco);
    mihrabFrame.position.y = 4.1;
    mihrabGroup.add(mihrabFrame);

    const mihrabNiche = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 6.2, 24, 1, false, 0, Math.PI), zellij);
    mihrabNiche.rotation.y = Math.PI / 2;
    mihrabNiche.position.y = 3.6;
    mihrabGroup.add(mihrabNiche);

    const mihrabDome = new THREE.Mesh(new THREE.SphereGeometry(1.8, 24, 12, 0, Math.PI, 0, Math.PI / 2), gold);
    mihrabDome.position.y = 6.7;
    mihrabGroup.add(mihrabDome);

    const mihrabLight = new THREE.PointLight(0xffe4a0, 3.6, 25);
    mihrabLight.position.set(0, 4.5, 0.8);
    mihrabGroup.add(mihrabLight);
    
    // Sadaqah (Charity Donation Box)
    const sadaqahGroup = new THREE.Group();
    sadaqahGroup.position.set(3.2, 0.0, -7.0);
    const sadaqahBox = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 1.0), darkCedar);
    sadaqahBox.position.y = 0.6;
    sadaqahBox.castShadow = true;
    sadaqahGroup.add(sadaqahBox);
    
    const sadaqahLid = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 1.1), brass);
    sadaqahLid.position.y = 1.25;
    sadaqahGroup.add(sadaqahLid);
    
    const sadaqahHitbox = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshBasicMaterial({ visible: false }));
    sadaqahHitbox.position.y = 1.0;
    sadaqahHitbox.userData = { action: 'donation_mosque', label: 'Offer Sadaqah (Charity)' };
    this.world.pickables.push(sadaqahHitbox);
    sadaqahGroup.add(sadaqahHitbox);
    
    hallGroup.add(sadaqahGroup);
    hallGroup.add(mihrabGroup);

    // Carved Plaster Stucco Muqarnas Corbels (Mocárabes Honeycomb Stalactites)
    const muqarnasClusterGeo = (() => {
      const parts = [];
      const tiers = 4;
      const width = 1.4;
      const height = 1.2;
      const depth = 0.8;
      for (let t = 0; t < tiers; t++) {
        const ty = (t / tiers) * height;
        const stepH = height / tiers;
        const count = t + 2;
        const cellW = width / count;
        const proj = ((t + 1) / tiers) * depth;
        for (let c = 0; c < count; c++) {
          const cx = -width / 2 + (c + 0.5) * cellW;
          const cell = new THREE.BoxGeometry(cellW * 0.94, stepH * 0.94, proj);
          cell.translate(cx, ty + stepH * 0.5, proj * 0.5);
          parts.push(cell);
        }
      }
      return safeMerge(parts, false) || parts[0];
    })();

    // Sebka Diamond Lattice Tracery Screen Geometry
    const sebkaPanelGeo = (() => {
      const parts = [];
      const pw = 3.4, ph = 2.4;
      const border = new THREE.BoxGeometry(pw + 0.2, ph + 0.2, 0.15);
      parts.push(border);
      const diagLen = 1.4;
      const diagAngle = 0.85;
      for (let ix = -3; ix <= 3; ix++) {
        const s1 = new THREE.BoxGeometry(diagLen, 0.08, 0.12);
        s1.rotateZ(diagAngle);
        s1.translate(ix * 0.55, 0, 0.04);
        parts.push(s1);
        const s2 = new THREE.BoxGeometry(diagLen, 0.08, 0.12);
        s2.rotateZ(-diagAngle);
        s2.translate(ix * 0.55, 0, 0.04);
        parts.push(s2);
      }
      return safeMerge(parts, false) || parts[0];
    })();

    // Slender Paired & Single Marble Columns with Fluted Bases and Carved Capitals
    const colGeo = new THREE.CylinderGeometry(0.30, 0.36, 6.2, 16);
    const capGeo = new THREE.BoxGeometry(0.95, 0.55, 0.95);
    const baseGeo = new THREE.BoxGeometry(0.95, 0.35, 0.95);

    // Horseshoe Keyhole Arch Geometry (Arco de Herradura)
    const horseshoeGeo = (() => {
      const shape = new THREE.Shape();
      const rInner = 1.65;
      const rOuter = 2.15;
      const startAng = -0.26;
      const endAng = Math.PI + 0.26;
      const segs = 24;
      const pts = [];
      for (let i = 0; i <= segs; i++) {
        const a = startAng + (i / segs) * (endAng - startAng);
        pts.push(new THREE.Vector2(Math.cos(a) * rInner, Math.sin(a) * rInner));
      }
      for (let i = segs; i >= 0; i--) {
        const a = startAng + (i / segs) * (endAng - startAng);
        pts.push(new THREE.Vector2(Math.cos(a) * rOuter, Math.sin(a) * rOuter));
      }
      shape.setFromPoints(pts);
      return new THREE.ExtrudeGeometry(shape, { depth: 0.8, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 });
    })();

    // Central Multi-foil Lobed Portal Arch (Arco Polilobulado - 7 Lobes)
    const multifoilPortalGeo = (() => {
      const shape = new THREE.Shape();
      const mainR = 2.4;
      const numLobes = 7;
      const lobeR = (mainR * Math.PI) / (numLobes * 2.1);
      const startAng = -0.15;
      const totalAng = Math.PI + 0.30;
      const pts = [];

      for (let l = 0; l < numLobes; l++) {
        const midLobeAng = startAng + ((l + 0.5) / numLobes) * totalAng;
        const lcx = Math.cos(midLobeAng) * mainR;
        const lcy = Math.sin(midLobeAng) * mainR;
        for (let s = 0; s <= 6; s++) {
          const la = midLobeAng - Math.PI / 2 + (s / 6) * Math.PI;
          pts.push(new THREE.Vector2(lcx + Math.cos(la) * lobeR, lcy + Math.sin(la) * lobeR));
        }
      }
      // Outer rectangular frame
      pts.push(new THREE.Vector2(mainR * 1.35, -0.4));
      pts.push(new THREE.Vector2(mainR * 1.35, mainR * 1.45));
      pts.push(new THREE.Vector2(-mainR * 1.35, mainR * 1.45));
      pts.push(new THREE.Vector2(-mainR * 1.35, -0.4));
      shape.setFromPoints(pts);
      return new THREE.ExtrudeGeometry(shape, { depth: 0.85, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 });
    })();

    // Front Arcade Colonnade (Z = 8.8) with Central Grand Multi-Foil Portal & Flanking Horseshoe Arches
    const colPositions = [-14, -10, -6, -2.5, 2.5, 6, 10, 14];
    colPositions.forEach((cx, ci) => {
      // Column Base & Shaft & Capital
      const cBase = new THREE.Mesh(baseGeo, marble);
      cBase.position.set(cx, 0.48, 8.8);
      hallGroup.add(cBase);

      const col = new THREE.Mesh(colGeo, marble);
      col.position.set(cx, 3.4, 8.8);
      col.castShadow = true;
      hallGroup.add(col);

      const cap = new THREE.Mesh(capGeo, carvedStucco);
      cap.position.set(cx, 6.7, 8.8);
      hallGroup.add(cap);

      // Muqarnas Stalactite Corbel beneath Arch Spandrel
      const muq = new THREE.Mesh(muqarnasClusterGeo, carvedStucco);
      muq.position.set(cx, 6.9, 8.4);
      hallGroup.add(muq);

      // Arches connecting columns
      if (ci < colPositions.length - 1) {
        const nextX = colPositions[ci + 1];
        const midX = (cx + nextX) / 2;

        if (Math.abs(midX) < 1.0) {
          // Central Multi-foil Lobed Portal (z = -195 fly-through arch)
          const portalArch = new THREE.Mesh(multifoilPortalGeo, carvedStucco);
          portalArch.position.set(0, 6.6, 8.4);
          hallGroup.add(portalArch);
        } else {
          // Horseshoe Keyhole Arch
          const arch = new THREE.Mesh(horseshoeGeo, carvedStucco);
          arch.position.set(midX, 6.7, 8.4);
          hallGroup.add(arch);
        }
      }
    });

    // Side Return Colonnades (X = -14 and X = 14) with Open Eastern Arcade Exit Arch
    for (let rz = -4; rz <= 6; rz += 4) {
      [-14, 14].forEach(rx => {
        const cBase = new THREE.Mesh(baseGeo, marble);
        cBase.position.set(rx, 0.48, rz);
        hallGroup.add(cBase);

        const col = new THREE.Mesh(colGeo, marble);
        col.position.set(rx, 3.4, rz);
        col.castShadow = true;
        hallGroup.add(col);

        const cap = new THREE.Mesh(capGeo, carvedStucco);
        cap.position.set(rx, 6.7, rz);
        hallGroup.add(cap);

        const muq = new THREE.Mesh(muqarnasClusterGeo, carvedStucco);
        muq.position.set(rx, 6.9, rz - 0.4);
        hallGroup.add(muq);

        if (rx === 14 && rz >= 2) {
          // Open Eastern Arcade Exit Arch (world x = -455, z = -195) with ZERO blocking screens!
          const exitArch = new THREE.Mesh(horseshoeGeo, carvedStucco);
          exitArch.position.set(rx, 6.7, rz + 2.0);
          exitArch.rotation.y = Math.PI / 2;
          hallGroup.add(exitArch);
        } else {
          // Carved Arabesque Mashrabiya Latticework Screen between outer bays
          const mashrabiya = new THREE.Mesh(sebkaPanelGeo, carvedStucco);
          mashrabiya.position.set(rx > 0 ? rx + 0.1 : rx - 0.1, 4.2, rz + 2.0);
          mashrabiya.rotation.y = Math.PI / 2;
          hallGroup.add(mashrabiya);
        }
      });
    }

    // Carved Entablature & Sebka Tracery Frieze above Arches
    const frieze = new THREE.Mesh(new THREE.BoxGeometry(34, 2.6, 18), zellij);
    frieze.position.set(0, 9.4, 0);
    frieze.castShadow = true;
    hallGroup.add(frieze);

    // Carved Cedar Wood Coffered Ceiling Beams (Alfarje)
    for (let bz = -7; bz <= 7; bz += 2.8) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(33.6, 0.45, 0.35), darkCedar);
      beam.position.set(0, 8.2, bz);
      hallGroup.add(beam);
    }

    // 4. Sculpted Ribbed Central Dome (Qubba / Gumbad) & Octagonal Drum
    const domeDrumGeo = new THREE.CylinderGeometry(7.2, 7.6, 2.8, 8);
    const domeDrum = new THREE.Mesh(domeDrumGeo, carvedStucco);
    domeDrum.position.set(0, 11.8, 0);
    domeDrum.castShadow = true;
    hallGroup.add(domeDrum);

    // 8 Horseshoe Arched Drum Clerestory Windows with warm lantern radiance
    for (let w = 0; w < 8; w++) {
      const wAng = (w / 8) * Math.PI * 2;
      const wx = Math.cos(wAng) * 7.4;
      const wz = Math.sin(wAng) * 7.4;
      const windowMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.0), new THREE.MeshPhysicalMaterial({
        color: 0xfff0cc, emissive: 0xffaa24, emissiveIntensity: 2.2
      }));
      windowMesh.position.set(wx, 11.8, wz);
      windowMesh.rotation.y = -wAng - Math.PI / 2;
      hallGroup.add(windowMesh);
    }

    // Classic Ribbed Ogival Dome Profile Curve
    const domePoints = [];
    for (let i = 0; i <= 24; i++) {
      const u = i / 24;
      const r = Math.sin(u * Math.PI * 0.78) * 7.0 * (1.0 - Math.pow(u, 2.2) * 0.52);
      const y = u * 9.8;
      domePoints.push(new THREE.Vector2(Math.max(0.01, r), y));
    }
    const domeGeo = new THREE.LatheGeometry(domePoints, 32);
    const domeMesh = new THREE.Mesh(domeGeo, turquoiseTile);
    domeMesh.position.set(0, 13.2, 0);
    domeMesh.castShadow = true;
    hallGroup.add(domeMesh);

    // 16 Meridian Sculpted Golden Ribs on Dome
    const ribPts = domePoints.map(p => new THREE.Vector3(p.x * 1.02, p.y + 13.2, 0));
    const ribCurve = new THREE.CatmullRomCurve3(ribPts);
    const ribGeo = new THREE.TubeGeometry(ribCurve, 20, 0.14, 8, false);

    for (let r = 0; r < 16; r++) {
      const ribAng = (r / 16) * Math.PI * 2;
      const ribMesh = new THREE.Mesh(ribGeo, gold);
      ribMesh.rotation.y = ribAng;
      hallGroup.add(ribMesh);
    }

    // Andalusian Gilded Yamur (3 Descending Celestial Spheres) & Grand Crescent (Hilal) Finial
    const domeFinialGroup = new THREE.Group();
    domeFinialGroup.position.set(0, 23.0, 0);

    const spireMast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.32, 4.2, 12), gold);
    spireMast.position.y = 2.1;
    domeFinialGroup.add(spireMast);

    // 3 Yamur Golden Spheres
    [0.9, 2.1, 3.1].forEach((sy, si) => {
      const sRad = 0.52 - si * 0.11;
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(sRad, 16, 16), gold);
      sphere.position.y = sy;
      domeFinialGroup.add(sphere);
    });

    // Soaring Gilded Crescent (Hilal)
    const domeCrescent = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.16, 10, 24, Math.PI * 1.5), gold);
    domeCrescent.position.set(0, 4.4, 0);
    domeCrescent.rotation.y = Math.PI / 4;
    domeFinialGroup.add(domeCrescent);

    const domeLight = new THREE.PointLight(0xffeed0, 2.8, 50);
    domeLight.position.y = 4.4;
    domeFinialGroup.add(domeLight);
    hallGroup.add(domeFinialGroup);

    // 5. Slender Octagonal Moorish Minaret Tower on North-West Corner (Alminar)
    const minaret = new THREE.Group();
    minaret.position.set(-17, 0, -8);

    // Solid Square Stone Plinth with Zellij Band
    const mBase = new THREE.Mesh(new THREE.BoxGeometry(5.2, 5.0, 5.2), stone);
    mBase.position.y = 2.5;
    minaret.add(mBase);

    const mBaseZellij = new THREE.Mesh(new THREE.BoxGeometry(5.25, 1.2, 5.25), zellij);
    mBaseZellij.position.y = 4.4;
    minaret.add(mBaseZellij);

    // Soaring Octagonal Tower Shaft with Multi-Tier Windows
    const mTower = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 2.3, 26, 8), marble);
    mTower.position.y = 18;
    mTower.castShadow = true;
    minaret.add(mTower);

    // 3 Tiers of Twin Horseshoe Arched Ajimez Windows
    [10, 16, 22].forEach(wy => {
      const winGeo = new THREE.BoxGeometry(1.1, 1.8, 0.3);
      [-1, 1].forEach(side => {
        const win = new THREE.Mesh(winGeo, zellij);
        win.position.set(side * 0.7, wy, 2.0);
        minaret.add(win);
      });
    });

    // Muezzin Balcony with Carved Muqarnas Honeycomb Corbels & Pierced Balustrade
    const mMuqarnas = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.0, 1.6, 8), carvedStucco);
    mMuqarnas.position.y = 31.2;
    minaret.add(mMuqarnas);

    const mBalcony = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.8, 0.9, 8), marble);
    mBalcony.position.y = 32.4;
    minaret.add(mBalcony);

    // Upper Octagonal Lantern Pavilion Cupola with Turquoise Zellij Roof
    const mCupolaPillars = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 3.2, 8, 1, true), marble);
    mCupolaPillars.position.y = 34.2;
    minaret.add(mCupolaPillars);

    const mCupolaRoof = new THREE.Mesh(new THREE.ConeGeometry(1.9, 4.2, 8), turquoiseTile);
    mCupolaRoof.position.y = 37.8;
    mCupolaRoof.castShadow = true;
    minaret.add(mCupolaRoof);

    // Gilded Minaret Yamur & Crescent
    const mCrescentGroup = new THREE.Group();
    mCrescentGroup.position.set(0, 40.2, 0);

    const mSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 2.4, 8), gold);
    mSpire.position.y = 1.2;
    mCrescentGroup.add(mSpire);

    const mSphere = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), gold);
    mSphere.position.y = 1.4;
    mCrescentGroup.add(mSphere);

    const mCrescent = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.11, 8, 18, Math.PI * 1.5), gold);
    mCrescent.position.set(0, 2.6, 0);
    mCrescent.rotation.y = Math.PI / 4;
    mCrescentGroup.add(mCrescent);
    minaret.add(mCrescentGroup);

    hallGroup.add(minaret);

    // 6. Hanging Pierced Moroccan Brass Filigree Lanterns (Fanoos) along Front Arcade & Prayer Hall Nave
    const hangingLampMat = new THREE.MeshPhysicalMaterial({
      color: 0xfffae0,
      emissive: 0xffb540,
      emissiveIntensity: 2.8,
      roughness: 0.25,
      metalness: 0.85,
    });

    // Arcade & Nave Lantern Placements guiding the eye to the Golden Mihrab
    const lanternPositions = [
      // Front arcade row (Z = 8.8)
      { x: -10, y: 6.2, z: 8.8 }, { x: -5, y: 6.2, z: 8.8 }, { x: 0, y: 6.2, z: 8.8 }, { x: 5, y: 6.2, z: 8.8 }, { x: 10, y: 6.2, z: 8.8 },
      // Central nave aisle row leading into prayer hall towards Mihrab
      { x: 0, y: 7.2, z: 3.5 }, { x: -4.5, y: 7.0, z: 0.0 }, { x: 4.5, y: 7.0, z: 0.0 },
