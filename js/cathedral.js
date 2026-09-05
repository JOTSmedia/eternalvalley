  _universalCathedral() {
    const g = new THREE.Group();



    const cx = WORLD.cathedral.x, cz = WORLD.cathedral.z;
    const cy = terrainHeight(cx, cz); // ensure perfectly grounded foundation
    g.position.set(cx, cy, cz);

    // Master Material Palette
    const stone = Surfaces.agedCaenLimestone(14.0);
    // Enhanced photorealistic stone and ambient occlusion
    const darkStone = material('agedCaenLimestone', { repeat: 12.0, color: 0x847966, roughness: 0.86, metalness: 0.02, normalScale: 2.0, aoMapIntensity: 1.65 });
    // Enhanced weathered copper
    const copperRoof = material('weatheredVerdigrisBronze', { repeat: 4.0, color: 0x347060, roughness: 0.25, metalness: 0.9, physical: true, clearcoat: 0.35, clearcoatRoughness: 0.45, normalScale: 1.5 });
    const slateRoof = Surfaces.pagodaTile(4.0);
    // Enhanced celestially reflective bronze & gold
    const bronze = Surfaces.verdigrisBronze(1.4);
    const gold = Surfaces.gold(1.0);
//     gold.color.setHex(0xffd700);
//     gold.roughness = 0.15;
//     gold.clearcoat = 0.8;
//     gold.clearcoatRoughness = 0.1;
    const darkWood = Surfaces.wood(2.4);
    const marble = material('honedCarraraMarble', { repeat: 2.5, color: 0xffffff, roughness: 0.08, metalness: 0.0, physical: true, ior: 1.53, clearcoat: 1.0, clearcoatRoughness: 0.04, normalScale: 1.15, envMapIntensity: 2.0 });
    const stainedGlassRose = Surfaces.stainedGlassRose();
    const byzantineMosaic = Surfaces.byzantineMosaic(12.0); // Add mosaic

    
    // Multi-layer chromatic refraction and iridescent liquid glass
    const stainedGlassLancet = new THREE.MeshPhysicalMaterial({
      color: 0x1848a4,
      emissive: 0x2458d4,
      emissiveIntensity: 4.5,
      roughness: 0.08,
      metalness: 0.1,
      transparent: true, logarithmicDepthBuffer: true,
      opacity: 0.88,
      side: THREE.DoubleSide
    });
    const leadCame = new THREE.MeshPhysicalMaterial({ color: 0x101214, roughness: 0.75, metalness: 0.95 });

    // =========================================================================
    // 1. FOUNDATION PODIUM & CASCADING CEREMONIAL STAIRS (z = 44 to 62)
    // =========================================================================
    const lowerTerrace = new THREE.Mesh(new THREE.BoxGeometry(72, 4.0, 124), darkStone);
    lowerTerrace.position.set(0, -0.6, -4);
    lowerTerrace.receiveShadow = lowerTerrace.castShadow = true;
    g.add(lowerTerrace);

    const upperPodium = new THREE.Mesh(new THREE.BoxGeometry(60, 0.65, 110), stone);
    upperPodium.position.set(0, 1.725, -4);
    upperPodium.receiveShadow = upperPodium.castShadow = true;
    g.add(upperPodium);

    // Extended North Transept Terrace out to x = -48 for seamless drone approach
    const northTerracePlatform = new THREE.Mesh(new THREE.BoxGeometry(20, 4.0, 28), darkStone);
    northTerracePlatform.position.set(-40, -0.6, -4);
    northTerracePlatform.receiveShadow = northTerracePlatform.castShadow = true;
    g.add(northTerracePlatform);

    const northTerraceUpper = new THREE.Mesh(new THREE.BoxGeometry(18, 0.65, 24), stone);
    northTerraceUpper.position.set(-39, 1.725, -4);
    northTerraceUpper.receiveShadow = northTerraceUpper.castShadow = true;
    g.add(northTerraceUpper);

    // North Transept Step Approach (x = -48 down to mountain terrace)
    for (let st = 0; st < 6; st++) {
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.22, 16 - st * 1.2), stone);
      stepMesh.position.set(-47.2 - st * 0.8, 0.2 + st * 0.32, -4);
      stepMesh.receiveShadow = stepMesh.castShadow = true;
      g.add(stepMesh);
    }

    // Cascading Semicircular / Stepped Grand West Approach Stairs
    for (let st = 0; st < 10; st++) {
      const stepWidth = 44 - st * 1.6;
      const stepDepth = 2.0;
      const stepY = 0.2 + st * 0.20;
      const stepZ = 58 - st * 1.5;
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(stepWidth, 0.22, stepDepth), stone);
      stepMesh.position.set(0, stepY, stepZ);
      stepMesh.receiveShadow = stepMesh.castShadow = true;
      g.add(stepMesh);
    }

    // =========================================================================
    // 2. MONUMENTAL FRENCH GOTHIC WEST FACADE & TWIN BELL TOWERS (z = 41)
    // =========================================================================
    // Twin Western Bell Towers: Southwest (x = -20) and Southeast (x = +20)
    [-20, 20].forEach((tx, ti) => {
      const sign = tx > 0 ? 1 : -1;
      const towerGroup = new THREE.Group();
      towerGroup.position.set(tx, 2.0, 39);

      // --- Tier 1: Heavy Ashlar Base with Clustered Angle Buttresses (y = 0 to 22) ---
      const baseShaft = new THREE.Mesh(new THREE.BoxGeometry(13.6, 22, 13.6), stone);
      baseShaft.position.set(0, 11, 0);
      baseShaft.castShadow = baseShaft.receiveShadow = true;
      towerGroup.add(baseShaft);

      // Stepped Angle Buttress Projections on Exterior Corners
      [[-7.2, 7.2], [-7.2, -7.2], [7.2, 7.2], [7.2, -7.2]].forEach(([bx, bz]) => {
        const buttress = new THREE.Mesh(new THREE.BoxGeometry(2.4, 23, 2.4), stone);
        buttress.position.set(bx, 11.5, bz);
        buttress.castShadow = true;
        towerGroup.add(buttress);

        const buttressCap = new THREE.Mesh(new THREE.ConeGeometry(1.6, 4.0, 4), darkStone);
        buttressCap.position.set(bx, 24.5, bz);
        buttressCap.rotation.y = Math.PI / 4;
        buttressCap.castShadow = true;
        towerGroup.add(buttressCap);
      });

      // Molded Cornice Band Level 1
      const cornice1 = new THREE.Mesh(new THREE.BoxGeometry(14.8, 1.4, 14.8), darkStone);
      cornice1.position.set(0, 22.7, 0);
      cornice1.castShadow = true;
      towerGroup.add(cornice1);

      // --- Tier 2: Intermediate Blind Arcade & Statue Niches (y = 22 to 38) ---
      const midShaft = new THREE.Mesh(new THREE.BoxGeometry(12.8, 16, 12.8), stone);
      midShaft.position.set(0, 30.7, 0);
      midShaft.castShadow = midShaft.receiveShadow = true;
      towerGroup.add(midShaft);

      // Traceried Ashlar Lancet Niches & Sculpted Statues on Tower Faces
      [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach(ang => {
        const rad = 6.45;
        const nx = Math.sin(ang) * rad, nz = Math.cos(ang) * rad;

        // Recessed Dark Ashlar Niche Wall
        const nicheBack = new THREE.Mesh(new THREE.BoxGeometry(3.2, 10.5, 0.5), darkStone);
        nicheBack.position.set(nx, 30.8, nz);
        nicheBack.rotation.y = ang;
        towerGroup.add(nicheBack);

        // Molded Caen Limestone Bracket Corbel Base
        const nicheCorbel = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.9, 1.2), stone);
        nicheCorbel.position.set(nx + Math.sin(ang) * 0.35, 25.5, nz + Math.cos(ang) * 0.35);
        nicheCorbel.rotation.y = ang;
        nicheCorbel.castShadow = true;
        towerGroup.add(nicheCorbel);

        // Flanking Splayed Colonnettes with Molded Capitals
        [-1.45, 1.45].forEach(cx => {
          const colX = nx + Math.sin(ang) * 0.3 + Math.cos(ang) * cx;
          const colZ = nz + Math.cos(ang) * 0.3 - Math.sin(ang) * cx;
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.20, 10.0, 8), stone);
          col.position.set(colX, 30.5, colZ);
          col.castShadow = true;
          towerGroup.add(col);

          const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.16, 0.7, 8), darkStone);
          cap.position.set(colX, 35.5, colZ);
          towerGroup.add(cap);
        });

        // Pointed Gothic Molded Archivolt Arch & Trefoil Head
        const nicheArch = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.32, 8, 20, Math.PI), stone);
        nicheArch.position.set(nx + Math.sin(ang) * 0.3, 35.5, nz + Math.cos(ang) * 0.3);
        nicheArch.rotation.y = ang;
        towerGroup.add(nicheArch);

        // High Gothic Wimperg Gable Canopy & Crocket Finial
        const canopyGable = new THREE.Mesh(new THREE.ConeGeometry(1.8, 2.8, 4), stone);
        canopyGable.position.set(nx + Math.sin(ang) * 0.35, 37.6, nz + Math.cos(ang) * 0.35);
        canopyGable.rotation.y = ang + Math.PI / 4;
        canopyGable.castShadow = true;
        towerGroup.add(canopyGable);

        const canopyFinial = new THREE.Mesh(new THREE.OctahedronGeometry(0.4, 1), gold);
        canopyFinial.position.set(nx + Math.sin(ang) * 0.4, 39.2, nz + Math.cos(ang) * 0.4);
        towerGroup.add(canopyFinial);

        // Sculpted Caen Limestone Celestial Statuary Figure
        const statueBody = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 4.6, 8), stone);
        statueBody.position.set(nx + Math.sin(ang) * 0.25, 28.3, nz + Math.cos(ang) * 0.25);
        statueBody.castShadow = true;
        towerGroup.add(statueBody);

        const statueHead = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), stone);
        statueHead.position.set(nx + Math.sin(ang) * 0.25, 31.0, nz + Math.cos(ang) * 0.25);
        towerGroup.add(statueHead);

        const statueHalo = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 6, 16), gold);
        statueHalo.position.set(nx + Math.sin(ang) * 0.22, 31.2, nz + Math.cos(ang) * 0.22);
        statueHalo.rotation.y = ang;
        towerGroup.add(statueHalo);
      });

      // Molded Cornice Band Level 2
      const cornice2 = new THREE.Mesh(new THREE.BoxGeometry(13.8, 1.4, 13.8), darkStone);
      cornice2.position.set(0, 38.7, 0);
      cornice2.castShadow = true;
      towerGroup.add(cornice2);

      // --- Tier 3: Grand Belfry Stage with Open Gothic Louvers & Antique Bronze Bells (y = 38 to 70) ---
      const belfryPiers = new THREE.Mesh(new THREE.BoxGeometry(12.0, 30, 12.0), stone);
      belfryPiers.position.set(0, 53.7, 0);
      belfryPiers.castShadow = true;
      towerGroup.add(belfryPiers);

      // Open Louvered Arches on all 4 faces
      [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach(ang => {
        [-2.4, 2.4].forEach(lx => {
          const louverOpening = new THREE.Mesh(new THREE.BoxGeometry(2.0, 18, 1.2), darkWood);
          const rad = 6.1;
          louverOpening.position.set(
            Math.sin(ang) * rad + Math.cos(ang) * lx,
            53.5,
            Math.cos(ang) * rad - Math.sin(ang) * lx
          );
          louverOpening.rotation.y = ang;
          towerGroup.add(louverOpening);

          const louverArch = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.3, 8, 16, Math.PI), stone);
          louverArch.position.set(
            Math.sin(ang) * rad + Math.cos(ang) * lx,
            62.5,
            Math.cos(ang) * rad - Math.sin(ang) * lx
          );
          louverArch.rotation.y = ang;
          towerGroup.add(louverArch);
        });
      });

      // Visibly Suspended Cast Antique Bronze Cathedral Bell & Timber Yoke
      const bellYoke = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.8, 0.8), darkWood);
      bellYoke.position.set(0, 59.5, 0);
      towerGroup.add(bellYoke);

      const bellYokeStrapL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.85), darkStone);
      bellYokeStrapL.position.set(-1.8, 59.5, 0);
      towerGroup.add(bellYokeStrapL);

      const bellYokeStrapR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.85), darkStone);
      bellYokeStrapR.position.set(1.8, 59.5, 0);
      towerGroup.add(bellYokeStrapR);

      const bellDome = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 2.2, 3.4, 20), bronze);
      bellDome.position.set(0, 56.8, 0);
      bellDome.castShadow = true;
      towerGroup.add(bellDome);

      const bellRim = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.35, 12, 24), bronze);
      bellRim.rotation.x = Math.PI / 2;
      bellRim.position.set(0, 55.1, 0);
      towerGroup.add(bellRim);

      const clapper = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.28, 2.8, 8), darkStone);
      clapper.position.set(0, 55.6, 0);
      towerGroup.add(clapper);

      // --- Tier 4: Galerie des Chimères, Openwork Balustrade & Corner Tourelles (y = 70 to 76) ---
      const parapet = new THREE.Mesh(new THREE.BoxGeometry(13.2, 2.2, 13.2), stone);
      parapet.position.set(0, 69.8, 0);
      parapet.castShadow = true;
      towerGroup.add(parapet);

      const balustradeRail = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.6, 13.6), darkStone);
      balustradeRail.position.set(0, 71.7, 0);
      towerGroup.add(balustradeRail);

      // 4 Corner Gargoyle Water Spouts projecting from Balustrade
      [[-6.8, 6.8], [-6.8, -6.8], [6.8, 6.8], [6.8, -6.8]].forEach(([gx, gz]) => {
        const gargoyle = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 2.8), stone);
        const gAng = Math.atan2(gz, gx);
        gargoyle.position.set(gx + Math.cos(gAng) * 1.2, 70.8, gz + Math.sin(gAng) * 1.2);
        gargoyle.rotation.y = -gAng + Math.PI / 2;
        gargoyle.castShadow = true;
        towerGroup.add(gargoyle);
      });

      // 4 Corner Tourelle Pinnacles
      [[-5.8, 5.8], [-5.8, -5.8], [5.8, 5.8], [5.8, -5.8]].forEach(([px, pz]) => {
        const pinBase = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.2, 6.0, 8), stone);
        pinBase.position.set(px, 74.3, pz);
        towerGroup.add(pinBase);

        const pinCone = new THREE.Mesh(new THREE.ConeGeometry(0.9, 5.5, 8), copperRoof);
        pinCone.position.set(px, 80.0, pz);
        towerGroup.add(pinCone);
      });
