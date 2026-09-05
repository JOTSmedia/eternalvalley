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

      // --- Tier 5: Soaring Octagonal High French Gothic Spire (y = 76 to 102m) ---
      const spireBaseOct = new THREE.Mesh(new THREE.CylinderGeometry(5.4, 6.0, 5.0, 8), stone);
      spireBaseOct.position.set(0, 73.8, 0);
      spireBaseOct.castShadow = true;
      towerGroup.add(spireBaseOct);

      const spireNeedle = new THREE.Mesh(new THREE.ConeGeometry(5.4, 28.0, 8), copperRoof);
      spireNeedle.position.set(0, 90.3, 0);
      spireNeedle.castShadow = true;
      towerGroup.add(spireNeedle);

      // Crockets & Gable Dormers (Lucarnes) on the 4 cardinal faces of the Spire
      [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach(lang => {
        const lucarne = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.8, 4), stone);
        lucarne.position.set(Math.sin(lang) * 4.2, 81.3, Math.cos(lang) * 4.2);
        lucarne.rotation.y = lang + Math.PI / 4;
        towerGroup.add(lucarne);
      });

      // Multifaceted Gilded Celestial Starburst Finial atop needle apex (y = 104.8m to 106.6m) — NO CROSS!
      const finialSphere = new THREE.Mesh(new THREE.SphereGeometry(0.9, 12, 12), gold);
      finialSphere.position.set(0, 104.8, 0);
      towerGroup.add(finialSphere);

      const starburst = new THREE.Mesh(new THREE.IcosahedronGeometry(2.0, 1), gold);
      starburst.position.set(0, 106.6, 0);
      towerGroup.add(starburst);

      g.add(towerGroup);
    });

    // =========================================================================
    // 3. CENTRAL WEST FACADE BAY: OPEN TRIPLE PORTALS, GALERIE & GREAT ROSE WINDOW
    // =========================================================================
    // Upper Central Facade Wall (y = 14.5 to 39.0, leaving grand portal archway hollow below)
    const centralBayWallUpper = new THREE.Mesh(new THREE.BoxGeometry(26.4, 24.5, 2.2), stone);
    centralBayWallUpper.position.set(0, 26.75, 39.5);
    centralBayWallUpper.castShadow = centralBayWallUpper.receiveShadow = true;
    g.add(centralBayWallUpper);

    // Left Facade Pier Wall (x = -13.2 to -4.8, y = 2.0 to 14.5)
    const centralBayWallLeft = new THREE.Mesh(new THREE.BoxGeometry(8.4, 12.5, 2.2), stone);
    centralBayWallLeft.position.set(-9.0, 8.25, 39.5);
    centralBayWallLeft.castShadow = centralBayWallLeft.receiveShadow = true;
    g.add(centralBayWallLeft);

    // Right Facade Pier Wall (x = 4.8 to 13.2, y = 2.0 to 14.5)
    const centralBayWallRight = new THREE.Mesh(new THREE.BoxGeometry(8.4, 12.5, 2.2), stone);
    centralBayWallRight.position.set(9.0, 8.25, 39.5);
    centralBayWallRight.castShadow = centralBayWallRight.receiveShadow = true;
    g.add(centralBayWallRight);

    // Monumental Portal Header Lintel (Spanning over portal opening at y = 14.2)
    const portalLintel = new THREE.Mesh(new THREE.BoxGeometry(9.6, 1.2, 2.4), darkStone);
    portalLintel.position.set(0, 14.2, 39.5);
    portalLintel.castShadow = true;
    g.add(portalLintel);

    // Inner Vault Arch Lining above Grand Portal (apex at y = 14.2m)
    const portalInnerArch = new THREE.Mesh(new THREE.TorusGeometry(4.8, 0.45, 10, 24, Math.PI), stone);
    portalInnerArch.position.set(0, 9.4, 39.5);
    portalInnerArch.castShadow = true;
    g.add(portalInnerArch);

    // --- A. TRIPLE GRAND RECESSED PORTALS (z = 40.5 to 43.5) ---
    const portalGroup = new THREE.Group();
    portalGroup.position.set(0, 2.0, 40.6);

    // 1. Central Grand Portal of All Souls (Portail Central, x = 0) - Open Splayed Jamb Walls (Clear 6.8m span)
    const jambLeft = new THREE.Mesh(new THREE.BoxGeometry(1.6, 12.2, 2.4), darkStone);
    jambLeft.position.set(-4.2, 6.1, 0.8);
    jambLeft.rotation.y = 0.22;
    jambLeft.castShadow = jambLeft.receiveShadow = true;
    portalGroup.add(jambLeft);

    const jambRight = new THREE.Mesh(new THREE.BoxGeometry(1.6, 12.2, 2.4), darkStone);
    jambRight.position.set(4.2, 6.1, 0.8);
    jambRight.rotation.y = -0.22;
    jambRight.castShadow = jambRight.receiveShadow = true;
    portalGroup.add(jambRight);

    // Concentric Stepped Pointed Archivolts soaring overhead (y = 7.0 to 12.4 in portalGroup)
    [3.8, 4.4, 5.0, 5.6].forEach((rad, ri) => {
      const archivolt = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.42, 10, 28, Math.PI), stone);
      archivolt.position.set(0, 6.8, 0.4 + ri * 0.45);
      portalGroup.add(archivolt);
    });

    // Openwork Carved Tympanum Arch & Paradise Mandala Ring (Framing above doorway with ZERO solid blockage)
    const tympanumRing = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.28, 8, 32), stone);
    tympanumRing.position.set(0, 9.8, 0.7);
    portalGroup.add(tympanumRing);

    const tympanumEmblem = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.25, 8, 24), gold);
    tympanumEmblem.position.set(0, 9.8, 0.75);
    portalGroup.add(tympanumEmblem);

    // =========================================================================
    // AUTHENTIC FRENCH HIGH GOTHIC CARVED TWIN PORTAL DOORS (West Portal, z = 40.6 local)
    // Swung open at an inviting ~38° ceremonial angle with clear >6.0m drone passage
    // =========================================================================
    const bogOak = Surfaces.wood(3.0);
//     bogOak.color.setHex(0x241911); // Deep ancient bog-oak / dark walnut
//     bogOak.roughness = 0.82;
//     bogOak.metalness = 0.04;

    const forgedIron = new THREE.MeshPhysicalMaterial({ color: 0x141619, roughness: 0.65, metalness: 0.85 });

    const sculptedBronze = new THREE.MeshPhysicalMaterial({ color: 0x9c7a42, roughness: 0.35, metalness: 0.95, clearcoat: 0.35, clearcoatRoughness: 0.25 });

    // Twin Portal Doors: Left Leaf (sign = -1, hinge at x = -4.3) and Right Leaf (sign = 1, hinge at x = +4.3)
    [-1, 1].forEach((sign) => {
      const dir = -sign; // Inward towards doorway opening from hinge
      const doorGroup = new THREE.Group();
      // Anchor hinge pivot on stone portal jamb reveal
      doorGroup.position.set(sign * 4.3, 0, 0.35);
      // Swung open at natural ceremonial angle (~38°), leaving >6.0m clear central passage for drone
      doorGroup.rotation.y = sign * 0.66;

      // 1. Heavy Bog-Oak Main Door Slab (1.62m wide x 7.2m high x 0.22m thick)
      const doorSlab = new THREE.Mesh(new THREE.BoxGeometry(1.62, 7.2, 0.22), bogOak);
      doorSlab.position.set(dir * 0.81, 3.6, 0);
      doorSlab.castShadow = doorSlab.receiveShadow = true;
      doorGroup.add(doorSlab);

      // 2. Heavy Molded Framing Stiles & Rails
      // Outer hinge stile & meeting stile
      const stileHinge = new THREE.Mesh(new THREE.BoxGeometry(0.20, 7.2, 0.28), bogOak);
      stileHinge.position.set(dir * 0.10, 3.6, 0);
      stileHinge.castShadow = true;
      doorGroup.add(stileHinge);

      const stileMeeting = new THREE.Mesh(new THREE.BoxGeometry(0.20, 7.2, 0.28), bogOak);
      stileMeeting.position.set(dir * 1.52, 3.6, 0);
      stileMeeting.castShadow = true;
      doorGroup.add(stileMeeting);

      // Horizontal Rails: Bottom Kick Rail, Middle Lock Rail, and Top Header Rail
      [0.25, 3.6, 6.95].forEach((ry, rIndex) => {
        const railH = rIndex === 0 ? 0.50 : (rIndex === 1 ? 0.44 : 0.48);
        const rail = new THREE.Mesh(new THREE.BoxGeometry(1.62, railH, 0.28), bogOak);
        rail.position.set(dir * 0.81, ry, 0);
        rail.castShadow = true;
        doorGroup.add(rail);
      });

      // 3. Recessed Blind Lancet Gothic Tracery Moldings (Front & Back Faces)
      [-0.12, 0.12].forEach((fz) => {
        // Lower & Upper Tracery Registers
        [
          { baseY: 0.55, h: 2.5, archY: 2.45 },
          { baseY: 3.90, h: 2.5, archY: 5.80 }
        ].forEach((reg) => {
          // Twin slender gothic lancets in each register
          [0.45, 1.17].forEach((lx) => {
            const lancetBack = new THREE.Mesh(new THREE.BoxGeometry(0.48, reg.h - 0.4, 0.04), darkStone);
            lancetBack.position.set(dir * lx, reg.baseY + (reg.h - 0.4) * 0.5, fz);
            doorGroup.add(lancetBack);

            // Torus pointed Gothic arch head
            const lancetArch = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.035, 8, 16, Math.PI), bogOak);
            lancetArch.position.set(dir * lx, reg.archY, fz + (fz > 0 ? 0.02 : -0.02));
            doorGroup.add(lancetArch);

            // Trefoil cusps
            const cusp = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 6, 12), gold);
            cusp.position.set(dir * lx, reg.archY - 0.08, fz + (fz > 0 ? 0.025 : -0.025));
            doorGroup.add(cusp);
          });
        });

        // Carved Rosette Medallions in upper and lower spandrels
        [2.0, 5.4, 6.45].forEach((rosetteY) => {
          const rosetteRing = new THREE.Mesh(new THREE.TorusGeometry(0.20, 0.035, 8, 20), gold);
          rosetteRing.position.set(dir * 0.81, rosetteY, fz + (fz > 0 ? 0.02 : -0.02));
          doorGroup.add(rosetteRing);

          const rosetteBoss = new THREE.Mesh(new THREE.OctahedronGeometry(0.10, 1), sculptedBronze);
          rosetteBoss.position.set(dir * 0.81, rosetteY, fz + (fz > 0 ? 0.03 : -0.03));
          doorGroup.add(rosetteBoss);
        });

        // Pyramidal Antique Iron Clavos / Studs along framing stiles & rails
        [0.8, 1.6, 2.4, 3.2, 4.0, 4.8, 5.6, 6.4].forEach((sy) => {
          [0.10, 1.52].forEach((sx) => {
            const stud = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.04, 4), forgedIron);
            stud.position.set(dir * sx, sy, fz + (fz > 0 ? 0.025 : -0.025));
            stud.rotation.x = fz > 0 ? Math.PI / 2 : -Math.PI / 2;
            stud.rotation.z = Math.PI / 4;
            doorGroup.add(stud);
          });
        });
      });

      // 4. Monumental Hand-Forged Iron Strap Scrollwork Hinges (3 tiers: y = 1.2, 3.6, 5.8)
      [1.2, 3.6, 5.8].forEach((hy) => {
        // Hinge knuckle pintle on the jamb
        const pintle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.36, 12), forgedIron);
        pintle.position.set(0, hy, 0);
        pintle.castShadow = true;
        doorGroup.add(pintle);

        const jambPlate = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.32, 0.14), forgedIron);
        jambPlate.position.set(-dir * 0.06, hy, 0);
        doorGroup.add(jambPlate);

        [-0.13, 0.13].forEach((sz) => {
          // Horizontal forged iron strap
          const strap = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.13, 0.03), forgedIron);
          strap.position.set(dir * 0.71, hy, sz);
          strap.castShadow = true;
          doorGroup.add(strap);

          // Gothic bifurcated scrollwork flourishes (volutes branching off strap)
          const voluteUp = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.024, 8, 16, Math.PI * 1.3), forgedIron);
          voluteUp.position.set(dir * 0.92, hy + 0.16, sz);
          doorGroup.add(voluteUp);

          const voluteDn = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.024, 8, 16, Math.PI * 1.3), forgedIron);
          voluteDn.position.set(dir * 0.92, hy - 0.16, sz);
          voluteDn.rotation.x = Math.PI;
          doorGroup.add(voluteDn);

          // Arrowhead / Fleur-de-lis finial at strap terminus
          const tipFinial = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.18, 4), forgedIron);
          tipFinial.position.set(dir * 1.45, hy, sz);
          tipFinial.rotation.z = dir > 0 ? -Math.PI / 2 : Math.PI / 2;
          doorGroup.add(tipFinial);
        });
      });

      // 5. Sculpted Bronze Lion-Head Ring Knocker (Front face at ergonomic height y = 3.2m)
      const knockerGroup = new THREE.Group();
      knockerGroup.position.set(dir * 1.18, 3.2, 0.14);

      // Bronze Backplate Escutcheon
      const escutcheon = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.04, 16), sculptedBronze);
      escutcheon.rotation.x = Math.PI / 2;
      knockerGroup.add(escutcheon);

      // Sculpted Lion Head Boss
      const lionSkull = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 10), sculptedBronze);
      lionSkull.scale.set(1.1, 0.95, 1.1);
      lionSkull.position.set(0, 0.04, 0.08);
      knockerGroup.add(lionSkull);

      const lionSnout = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.08, 0.09), sculptedBronze);
      lionSnout.position.set(0, -0.03, 0.16);
      knockerGroup.add(lionSnout);

      // Lion Mane Curls
      for (let m = 0; m < 8; m++) {
        const mAng = (m / 8) * Math.PI * 2;
        const maneCurl = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.14, 4), sculptedBronze);
        maneCurl.rotation.z = -mAng + Math.PI / 2;
        maneCurl.position.set(Math.cos(mAng) * 0.16, Math.sin(mAng) * 0.16 + 0.02, 0.06);
        knockerGroup.add(maneCurl);
      }

      // Heavy Bronze Knocker Pendant Ring
      const knockerRing = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.038, 10, 20), sculptedBronze);
      knockerRing.position.set(0, -0.10, 0.16);
      knockerGroup.add(knockerRing);

      // Bronze Strike Anvil Stud
      const strikeStud = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), sculptedBronze);
      strikeStud.position.set(0, -0.25, 0.04);
      knockerGroup.add(strikeStud);

      doorGroup.add(knockerGroup);

      portalGroup.add(doorGroup);
    });

    // Sculpted Stepped Jamb Statues flanking the open portal threshold
    [-4.6, -3.8, 3.8, 4.6].forEach((jx) => {
      const jStatue = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 2.8, 8), stone);
      jStatue.position.set(jx, 2.8, 1.2 + Math.abs(jx) * 0.15);
      jStatue.castShadow = true;
      portalGroup.add(jStatue);

      const jCol = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 6.5, 8), darkStone);
      jCol.position.set(jx, 3.25, 1.0 + Math.abs(jx) * 0.15);
      portalGroup.add(jCol);

      const jCanopy = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.75, 6), stone);
      jCanopy.position.set(jx, 6.6, 1.2 + Math.abs(jx) * 0.15);
      portalGroup.add(jCanopy);
    });

    // High French Gothic Wimperg Gable Pediment soaring over Central Portal
    const wimpergGroup = new THREE.Group();
    wimpergGroup.position.set(0, 12.4, 1.8);

    const wimpergShape = new THREE.Shape();
    wimpergShape.moveTo(-5.6, 0);
    wimpergShape.lineTo(5.6, 0);
    wimpergShape.lineTo(0, 5.4);
    wimpergShape.closePath();
    const wimpergExtrude = new THREE.ExtrudeGeometry(wimpergShape, { depth: 0.9, bevelEnabled: false });
    const wimpergMesh = new THREE.Mesh(wimpergExtrude, stone);
    wimpergMesh.castShadow = true;
    wimpergGroup.add(wimpergMesh);

    // Molded Ashlar Raking Coping Cornices with Cascading Crockets
    [-1, 1].forEach(sign => {
      const rakeAngle = sign * 0.77;
      const coping = new THREE.Mesh(new THREE.BoxGeometry(0.45, 7.8, 1.1), darkStone);
      coping.position.set(sign * 2.8, 2.7, 0.45);
      coping.rotation.z = rakeAngle;
      coping.castShadow = true;
      wimpergGroup.add(coping);

      // Cascading Crockets along the pediment rake
      for (let cr = 1; cr <= 4; cr++) {
        const cFrac = cr / 5;
        const cx = sign * (5.4 * (1 - cFrac));
        const cy = 5.4 * cFrac;
        const crocket = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.8, 4), gold);
        crocket.position.set(cx + sign * 0.22, cy + 0.15, 0.6);
        crocket.rotation.z = -rakeAngle;
        wimpergGroup.add(crocket);
      }
    });

    // Relief Blind Trefoil Arcade & Medallion inside Tympanum
    const tympMedallion = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.16, 8, 24), gold);
    tympMedallion.position.set(0, 2.5, 0.95);
    wimpergGroup.add(tympMedallion);

    const tympEmblem = new THREE.Mesh(new THREE.IcosahedronGeometry(0.45, 1), gold);
    tympEmblem.position.set(0, 2.5, 1.0);
    wimpergGroup.add(tympEmblem);

    [-1.8, 1.8].forEach(lx => {
      const blindArch = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.12, 6, 16, Math.PI), stone);
      blindArch.position.set(lx, 1.1, 0.95);
      wimpergGroup.add(blindArch);
    });

    // Crocketed Gable Apex Pinnacle & Finial
    const apexPin = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.8, 8), darkStone);
    apexPin.position.set(0, 6.2, 0.45);
    apexPin.castShadow = true;
    wimpergGroup.add(apexPin);

    const wimpergFinial = new THREE.Mesh(new THREE.OctahedronGeometry(0.85, 1), gold);
    wimpergFinial.position.set(0, 7.8, 0.45);
    wimpergGroup.add(wimpergFinial);

    portalGroup.add(wimpergGroup);

    // 2. Flanking Left Portal (x = -9.2) & Right Portal (x = +9.2) — Also Open
    [-9.2, 9.2].forEach((px, pi) => {
      const sign = px > 0 ? 1 : -1;
      const sideDoor = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.4, 0.28), darkWood);
      sideDoor.position.set(px + sign * 0.8, 2.2, 0.2);
      sideDoor.rotation.y = sign * Math.PI * 0.40; // Swung open against side wall
      sideDoor.castShadow = true;
      portalGroup.add(sideDoor);

      [2.2, 2.8, 3.4].forEach((srad, si) => {
        const sideArchivolt = new THREE.Mesh(new THREE.TorusGeometry(srad, 0.32, 8, 20, Math.PI), stone);
        sideArchivolt.position.set(px, 3.8, 0.3 + si * 0.35);
        portalGroup.add(sideArchivolt);
      });

      const sideTympanum = new THREE.Mesh(new THREE.CircleGeometry(2.1, 16, 0, Math.PI), stone);
      sideTympanum.position.set(px, 4.4, 0.5);
      portalGroup.add(sideTympanum);

      [-1.8, 1.8].forEach(sjx => {
        const sideJamb = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 4.0, 8), stone);
        sideJamb.position.set(px + sjx, 2.0, 0.9);
        sideJamb.castShadow = true;
        portalGroup.add(sideJamb);
      });
    });

    g.add(portalGroup);

    // --- B. GALERIE DES ROIS / CELESTIAL STATUE FRIEZE (y = 19 to 23, z = 41.2) ---
    const galleryBase = new THREE.Mesh(new THREE.BoxGeometry(26.0, 1.4, 1.8), darkStone);
    galleryBase.position.set(0, 19.2, 41.0);
    galleryBase.castShadow = true;
    g.add(galleryBase);

    for (let k = -5; k <= 5; k++) {
      const kx = k * 2.3;
      const kArc = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.18, 6, 12, Math.PI), stone);
      kArc.position.set(kx, 22.8, 41.8);
      g.add(kArc);

      const kStatue = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 2.4, 8), stone);
      kStatue.position.set(kx, 21.2, 41.6);
      kStatue.castShadow = true;
      g.add(kStatue);

      const kHead = new THREE.Mesh(new THREE.SphereGeometry(0.2, 6, 6), stone);
      kHead.position.set(kx, 22.5, 41.6);
      g.add(kHead);
    }

    const galleryCorniceTop = new THREE.Mesh(new THREE.BoxGeometry(26.4, 1.2, 2.0), darkStone);
    galleryCorniceTop.position.set(0, 23.8, 41.0);
    galleryCorniceTop.castShadow = true;
    g.add(galleryCorniceTop);

    // --- C. MONUMENTAL 16m GREAT ROSE WINDOW WITH STONE & LEAD TRACERY & BACKLIT GLOW ---
    const roseGroup = new THREE.Group();
    roseGroup.position.set(0, 31.0, 40.8);

    // Deep Splayed Caen Limestone Embrasure Reveal (Concentric Torus Steps stepping inward into nave)
    const embrasureOuter = new THREE.Mesh(new THREE.TorusGeometry(9.2, 0.65, 12, 64), darkStone);
    embrasureOuter.position.set(0, 0, -0.15);
    roseGroup.add(embrasureOuter);

    const embrasureMid = new THREE.Mesh(new THREE.TorusGeometry(8.6, 0.55, 12, 64), stone);
    embrasureMid.position.set(0, 0, 0.05);
    roseGroup.add(embrasureMid);

    const embrasureInner = new THREE.Mesh(new THREE.TorusGeometry(8.0, 0.48, 12, 64), darkStone);
    embrasureInner.position.set(0, 0, 0.20);
    roseGroup.add(embrasureInner);

    // Stained Glass Mandala Dial (1024x1024 Authentic French High Gothic Stained Glass)
    const roseGlass = new THREE.Mesh(new THREE.CircleGeometry(7.8, 64), stainedGlassRose);
    roseGlass.position.set(0, 0, 0.1);
    roseGroup.add(roseGlass);

    // Rayonnant Gothic Stone Tracery Matrix
    // Central Octofoil / 8-Petal Rosette Ring
    const roseRimInner = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.22, 10, 36), gold);
    roseRimInner.position.set(0, 0, 0.28);
    roseGroup.add(roseRimInner);

    const roseCenterBoss = new THREE.Mesh(new THREE.IcosahedronGeometry(0.65, 1), gold);
    roseCenterBoss.position.set(0, 0, 0.32);
    roseGroup.add(roseCenterBoss);

    // Middle 16-Lobe Arcade Ring with Lead Came Moldings
    const roseRimMid = new THREE.Mesh(new THREE.TorusGeometry(4.3, 0.28, 10, 48), stone);
    roseRimMid.position.set(0, 0, 0.26);
    roseGroup.add(roseRimMid);

    const roseRimMidCame = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.14, 8, 48), leadCame);
    roseRimMidCame.position.set(0, 0, 0.24);
    roseGroup.add(roseRimMidCame);

    // Outer 32-Lancet Stone Perimeter Rim
    const roseRimOuter = new THREE.Mesh(new THREE.TorusGeometry(7.8, 0.42, 12, 64), stone);
    roseRimOuter.position.set(0, 0, 0.25);
    roseGroup.add(roseRimOuter);

    // 16 Primary Chamfered Stone Mullion Spokes & Intermediate Tracery
    for (let s = 0; s < 16; s++) {
      const sAng = (s / 16) * Math.PI * 2;
      const cosA = Math.cos(sAng), sinA = Math.sin(sAng);

      // Primary radiating stone mullion
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.22, 6.0, 0.30), stone);
      spoke.position.set(cosA * 4.85, sinA * 4.85, 0.24);
      spoke.rotation.z = sAng - Math.PI / 2;
      roseGroup.add(spoke);

      // Molded Capital Node at middle ring
      const nodeCap = new THREE.Mesh(new THREE.CylinderGeometry(0.30, 0.22, 0.55, 8), darkStone);
      nodeCap.position.set(cosA * 4.3, sinA * 4.3, 0.28);
      nodeCap.rotation.z = sAng - Math.PI / 2;
      roseGroup.add(nodeCap);

      // Gilded Trefoil Roundel at Outer Perimeter
      const trefoil = new THREE.Mesh(new THREE.TorusGeometry(0.80, 0.14, 8, 20), gold);
      trefoil.position.set(cosA * 6.5, sinA * 6.5, 0.26);
      roseGroup.add(trefoil);

      // Secondary intermediate outer mullions (32 subdivisions at outer band)
      const subAng = sAng + Math.PI / 16;
      const subSpoke = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.4, 0.22), stone);
      subSpoke.position.set(Math.cos(subAng) * 6.1, Math.sin(subAng) * 6.1, 0.22);
      subSpoke.rotation.z = subAng - Math.PI / 2;
      roseGroup.add(subSpoke);
    }

    // Backlit Sacred God-Ray Divine Point Lights (Radiating through stained glass from nave interior)
    const centralDivineBacklight = new THREE.PointLight(0xffe8aa, 5.5, 65);
    centralDivineBacklight.position.set(0, 0, -2.5); // Inside high nave shining outward
    roseGroup.add(centralDivineBacklight);

    // Multi-Spectrum Divine Backlights creating rich jewel-tone transmission
    const sapphireBacklight = new THREE.PointLight(0x5599ff, 3.6, 45);
    sapphireBacklight.position.set(0, 3.2, -2.0);
    roseGroup.add(sapphireBacklight);

    const amberBacklight = new THREE.PointLight(0xffaa22, 3.6, 45);
    amberBacklight.position.set(0, -3.2, -2.0);
    roseGroup.add(amberBacklight);

    const rubyBacklight = new THREE.PointLight(0xff3366, 3.2, 40);
    rubyBacklight.position.set(-3.2, 0, -2.0);
    roseGroup.add(rubyBacklight);

    const amethystBacklight = new THREE.PointLight(0x9944ff, 3.2, 40);
    amethystBacklight.position.set(3.2, 0, -2.0);
    roseGroup.add(amethystBacklight);

    // Soft Forward Exterior Divine Luminous Aura
    const roseForwardGlow = new THREE.PointLight(0xffeedd, 2.2, 30);
    roseForwardGlow.position.set(0, 0, 1.2);
    roseGroup.add(roseForwardGlow);

    // Flanking Twin Tall Gothic Lancet Windows with Backlights
    [-10.8, 10.8].forEach(flx => {
      const lancetMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 9.5), stainedGlassLancet);
      lancetMesh.position.set(flx, 0, 0.1);
      roseGroup.add(lancetMesh);

      const lFrame = new THREE.Mesh(new THREE.BoxGeometry(3.0, 10.0, 0.4), darkStone);
      lFrame.position.set(flx, 0, 0.05);
      roseGroup.add(lFrame);

      const lArch = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.32, 8, 20, Math.PI), stone);
      lArch.position.set(flx, 4.75, 0.2);
      roseGroup.add(lArch);

      // Lancet Backlight Point Light
      const lBacklight = new THREE.PointLight(0x66aaff, 2.8, 30);
      lBacklight.position.set(flx, 0, -2.0);
      roseGroup.add(lBacklight);
    });

    g.add(roseGroup);

    // --- D. HIGH FACADE GABLE PEDIMENT & APEX PINNACLE (y = 40 to 58) ---
    const gableGroup = new THREE.Group();
    gableGroup.position.set(0, 39.8, 38.6);

    const gableShape = new THREE.Shape();
    gableShape.moveTo(-13.4, 0);
    gableShape.lineTo(13.4, 0);
    gableShape.lineTo(0, 14.2);
    gableShape.closePath();
    const gableGeo = new THREE.ExtrudeGeometry(gableShape, { depth: 2.4, bevelEnabled: false });
    const facadeGable = new THREE.Mesh(gableGeo, stone);
    facadeGable.castShadow = true;
    gableGroup.add(facadeGable);

    // Molded Ashlar Raking Coping Cornices with Crockets
    [-1, 1].forEach(sign => {
      const rakeAngle = sign * 0.815;
      const coping = new THREE.Mesh(new THREE.BoxGeometry(0.65, 20.0, 2.8), darkStone);
      coping.position.set(sign * 6.7, 7.1, 1.2);
      coping.rotation.z = rakeAngle;
      coping.castShadow = true;
      gableGroup.add(coping);

      // Cascading Crockets on Pediment Slopes
      for (let cr = 1; cr <= 7; cr++) {
        const cFrac = cr / 8;
        const cx = sign * (13.4 * (1 - cFrac));
        const cy = 14.2 * cFrac;
        const crocket = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.2, 4), gold);
        crocket.position.set(cx + sign * 0.35, cy + 0.2, 1.4);
        crocket.rotation.z = -rakeAngle;
        gableGroup.add(crocket);
      }
    });

    // Horizontal Molded Ashlar Corbel Table along Gable Base
    const corbelBase = new THREE.Mesh(new THREE.BoxGeometry(27.2, 0.8, 2.8), darkStone);
    corbelBase.position.set(0, 0.4, 1.2);
    corbelBase.castShadow = true;
    gableGroup.add(corbelBase);

    for (let cb = -6; cb <= 6; cb++) {
      const corbel = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.9), stone);
      corbel.position.set(cb * 2.0, -0.2, 2.2);
      corbel.castShadow = true;
      gableGroup.add(corbel);
    }

    // Blind Arcade Gallery of 5 Graduated Lancet Niches with Statuettes
    const nicheHeights = [4.2, 6.2, 8.4, 6.2, 4.2];
    const nichePositions = [-6.4, -3.2, 0, 3.2, 6.4];
    nichePositions.forEach((nx, ni) => {
      const nh = nicheHeights[ni];
      const nFrame = new THREE.Mesh(new THREE.BoxGeometry(1.8, nh, 0.4), darkStone);
      nFrame.position.set(nx, nh * 0.5 + 1.2, 2.45);
      gableGroup.add(nFrame);

      const nArch = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.18, 6, 16, Math.PI), stone);
      nArch.position.set(nx, nh + 1.2, 2.45);
      gableGroup.add(nArch);

      const nStatue = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, nh * 0.6, 8), stone);
      nStatue.position.set(nx, nh * 0.35 + 1.2, 2.55);
      nStatue.castShadow = true;
      gableGroup.add(nStatue);
    });

    // High Relief Rosette Medallion near Gable Apex
    const apexRosette = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.22, 8, 24), gold);
    apexRosette.position.set(0, 10.8, 2.5);
    gableGroup.add(apexRosette);

    // Apex Gilded Crocketed Pinnacle
    const apexPinnacle = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.4, 5.0, 8), stone);
    apexPinnacle.position.set(0, 16.5, 1.2);
    apexPinnacle.castShadow = true;
    gableGroup.add(apexPinnacle);

    const apexSpirelet = new THREE.Mesh(new THREE.ConeGeometry(0.8, 4.5, 8), darkStone);
    apexSpirelet.position.set(0, 20.8, 1.2);
    apexSpirelet.castShadow = true;
    gableGroup.add(apexSpirelet);

    const apexFinial = new THREE.Mesh(new THREE.OctahedronGeometry(1.2, 1), gold);
    apexFinial.position.set(0, 23.5, 1.2);
    gableGroup.add(apexFinial);

    g.add(gableGroup);

    // =========================================================================
    // 4. HIGH NAVE, SIDE AISLES, TRANSEPT CROSSING & APSE (CHEVET)
    // =========================================================================
    // High Clerestory Main Nave Walls (Split around 16m Transept Crossing at z = -4)
    // Left Nave Clerestory (West section z = 4 to 37, East section z = -45 to -12, Crossing Arch above y = 32)
    const naveWallL_West = new THREE.Mesh(new THREE.BoxGeometry(1.8, 36, 33), stone);
    naveWallL_West.position.set(-11, 20, 20.5);
    naveWallL_West.castShadow = naveWallL_West.receiveShadow = true;
    g.add(naveWallL_West);

    const naveWallL_East = new THREE.Mesh(new THREE.BoxGeometry(1.8, 36, 33), stone);
    naveWallL_East.position.set(-11, 20, -28.5);
    naveWallL_East.castShadow = naveWallL_East.receiveShadow = true;
    g.add(naveWallL_East);

    const naveWallL_Top = new THREE.Mesh(new THREE.BoxGeometry(1.8, 6.0, 16), stone);
    naveWallL_Top.position.set(-11, 35, -4);
    naveWallL_Top.castShadow = true;
    g.add(naveWallL_Top);

    // Right Nave Clerestory (West section z = 4 to 37, East section z = -45 to -12, Crossing Arch above y = 32)
    const naveWallR_West = new THREE.Mesh(new THREE.BoxGeometry(1.8, 36, 33), stone);
    naveWallR_West.position.set(11, 20, 20.5);
    naveWallR_West.castShadow = naveWallR_West.receiveShadow = true;
    g.add(naveWallR_West);

    const naveWallR_East = new THREE.Mesh(new THREE.BoxGeometry(1.8, 36, 33), stone);
    naveWallR_East.position.set(11, 20, -28.5);
    naveWallR_East.castShadow = naveWallR_East.receiveShadow = true;
    g.add(naveWallR_East);

    const naveWallR_Top = new THREE.Mesh(new THREE.BoxGeometry(1.8, 6.0, 16), stone);
    naveWallR_Top.position.set(11, 35, -4);
    naveWallR_Top.castShadow = true;
    g.add(naveWallR_Top);

    // High Nave Clerestory Lancet Stained Glass Windows
    for (let wz = -34; wz <= 26; wz += 12) {
      if (wz >= -10 && wz <= 2) continue; // Transept opening gap
      [-11.95, 11.95].forEach(wx => {
        const clereWindow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 9.5), stainedGlassLancet);
        clereWindow.position.set(wx, 26.0, wz);
        clereWindow.rotation.y = wx > 0 ? -Math.PI / 2 : Math.PI / 2;
        g.add(clereWindow);

        const clereArch = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.35, 8, 16, Math.PI), stone);
        clereArch.position.set(wx, 30.75, wz);
        clereArch.rotation.y = wx > 0 ? -Math.PI / 2 : Math.PI / 2;
        g.add(clereArch);
      });
    }

    // Lower Side Aisle Walls (Split around Transept Crossing)
    const aisleWallL_West = new THREE.Mesh(new THREE.BoxGeometry(1.6, 18, 32), stone);
    aisleWallL_West.position.set(-19, 11, 20);
    aisleWallL_West.castShadow = aisleWallL_West.receiveShadow = true;
    g.add(aisleWallL_West);

    const aisleWallL_East = new THREE.Mesh(new THREE.BoxGeometry(1.6, 18, 32), stone);
    aisleWallL_East.position.set(-19, 11, -28);
    aisleWallL_East.castShadow = aisleWallL_East.receiveShadow = true;
    g.add(aisleWallL_East);

    const aisleWallL_Top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.0, 16), stone);
    aisleWallL_Top.position.set(-19, 18.5, -4);
    aisleWallL_Top.castShadow = true;
    g.add(aisleWallL_Top);

    const aisleWallR_West = new THREE.Mesh(new THREE.BoxGeometry(1.6, 18, 32), stone);
    aisleWallR_West.position.set(19, 11, 20);
    aisleWallR_West.castShadow = aisleWallR_West.receiveShadow = true;
    g.add(aisleWallR_West);

    const aisleWallR_East = new THREE.Mesh(new THREE.BoxGeometry(1.6, 18, 32), stone);
    aisleWallR_East.position.set(19, 11, -28);
    aisleWallR_East.castShadow = aisleWallR_East.receiveShadow = true;
    g.add(aisleWallR_East);

    const aisleWallR_Top = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.0, 16), stone);
    aisleWallR_Top.position.set(19, 18.5, -4);
    aisleWallR_Top.castShadow = true;
    g.add(aisleWallR_Top);

    // Sloping Slate Lean-to Roofs over Lower Side Aisles (Split around Transept)
    const aisleRoofL_West = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.8, 33), slateRoof);
    aisleRoofL_West.position.set(-15, 19.5, 20.5);
    aisleRoofL_West.rotation.z = -0.32;
    aisleRoofL_West.castShadow = aisleRoofL_West.receiveShadow = true;
    g.add(aisleRoofL_West);

    const aisleRoofL_East = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.8, 33), slateRoof);
    aisleRoofL_East.position.set(-15, 19.5, -28.5);
    aisleRoofL_East.rotation.z = -0.32;
    aisleRoofL_East.castShadow = aisleRoofL_East.receiveShadow = true;
    g.add(aisleRoofL_East);

    const aisleRoofR_West = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.8, 33), slateRoof);
    aisleRoofR_West.position.set(15, 19.5, 20.5);
    aisleRoofR_West.rotation.z = 0.32;
    aisleRoofR_West.castShadow = aisleRoofR_West.receiveShadow = true;
    g.add(aisleRoofR_West);

    const aisleRoofR_East = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.8, 33), slateRoof);
    aisleRoofR_East.position.set(15, 19.5, -28.5);
    aisleRoofR_East.rotation.z = 0.32;
    aisleRoofR_East.castShadow = aisleRoofR_East.receiveShadow = true;
    g.add(aisleRoofR_East);

    // High Gabled Nave Verdigris Copper Roof (Ridge at y = 46.5m)
    const naveRoofL = new THREE.Mesh(new THREE.BoxGeometry(15.2, 1.2, 84), copperRoof);
    naveRoofL.position.set(-6.2, 42.2, -4);
    naveRoofL.rotation.z = 0.62;
    naveRoofL.castShadow = naveRoofL.receiveShadow = true;
    g.add(naveRoofL);

    const naveRoofR = new THREE.Mesh(new THREE.BoxGeometry(15.2, 1.2, 84), copperRoof);
    naveRoofR.position.set(6.2, 42.2, -4);
    naveRoofR.rotation.z = -0.62;
    naveRoofR.castShadow = naveRoofR.receiveShadow = true;
    g.add(naveRoofR);

    // Gilded Gothic Roof Ridge Cresting running full Nave Length
    for (let rz = -44; rz <= 36; rz += 2.4) {
      const crestTooth = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.2, 4), gold);
      crestTooth.position.set(0, 47.4, rz);
      crestTooth.rotation.y = Math.PI / 4;
      g.add(crestTooth);
    }

    // --- MONUMENTAL TRANSEPT CROSSING & WINGS (Hollow Architecture with Open Gothic Portals) ---
    // North Transept Wing (x = -11 to -34.2, z = -12 to +4)
    const northTranseptNorthWall = new THREE.Mesh(new THREE.BoxGeometry(23.2, 36, 1.8), stone);
    northTranseptNorthWall.position.set(-22.6, 20, -12);
    northTranseptNorthWall.castShadow = northTranseptNorthWall.receiveShadow = true;
    g.add(northTranseptNorthWall);

    const northTranseptSouthWall = new THREE.Mesh(new THREE.BoxGeometry(23.2, 36, 1.8), stone);
    northTranseptSouthWall.position.set(-22.6, 20, 4);
    northTranseptSouthWall.castShadow = northTranseptSouthWall.receiveShadow = true;
    g.add(northTranseptSouthWall);

    const northTranseptFloor = new THREE.Mesh(new THREE.PlaneGeometry(35.8, 16), marble);
    northTranseptFloor.rotation.x = -Math.PI / 2;
    northTranseptFloor.position.set(-28.0, 2.05, -4);
    northTranseptFloor.receiveShadow = true;
    g.add(northTranseptFloor);

    // South Transept Wing (x = 11 to 34.2, z = -12 to +4)
    const southTranseptNorthWall = new THREE.Mesh(new THREE.BoxGeometry(23.2, 36, 1.8), stone);
    southTranseptNorthWall.position.set(22.6, 20, -12);
    southTranseptNorthWall.castShadow = southTranseptNorthWall.receiveShadow = true;
    g.add(southTranseptNorthWall);

    const southTranseptSouthWall = new THREE.Mesh(new THREE.BoxGeometry(23.2, 36, 1.8), stone);
    southTranseptSouthWall.position.set(22.6, 20, 4);
    southTranseptSouthWall.castShadow = southTranseptSouthWall.receiveShadow = true;
    g.add(southTranseptSouthWall);

    const southTranseptFloor = new THREE.Mesh(new THREE.PlaneGeometry(25.0, 16), marble);
    southTranseptFloor.rotation.x = -Math.PI / 2;
    southTranseptFloor.position.set(22.6, 2.05, -4);
    southTranseptFloor.receiveShadow = true;
    g.add(southTranseptFloor);

    // High Transept Roofs
    const transeptRoofNorth = new THREE.Mesh(new THREE.BoxGeometry(68, 1.2, 11.2), copperRoof);
    transeptRoofNorth.position.set(0, 42.2, -8.6);
    transeptRoofNorth.rotation.x = -0.62;
    transeptRoofNorth.castShadow = true;
    g.add(transeptRoofNorth);

    const transeptRoofSouth = new THREE.Mesh(new THREE.BoxGeometry(68, 1.2, 11.2), copperRoof);
    transeptRoofSouth.position.set(0, 42.2, 0.6);
    transeptRoofSouth.rotation.x = 0.62;
    transeptRoofSouth.castShadow = true;
    g.add(transeptRoofSouth);

    // North & South Transept Facade Portals, Ashlar Pediments & 10m Transept Rose Windows
    [-34.2, 34.2].forEach(tx => {
      const isNorth = tx < 0;
      const tGableGroup = new THREE.Group();
      tGableGroup.position.set(tx, 38.0, -4.0);
      tGableGroup.rotation.y = tx > 0 ? Math.PI / 2 : -Math.PI / 2;

      const tGableShape = new THREE.Shape();
      tGableShape.moveTo(-8.4, 0);
      tGableShape.lineTo(8.4, 0);
      tGableShape.lineTo(0, 9.6);
      tGableShape.closePath();
      const tGableGeo = new THREE.ExtrudeGeometry(tGableShape, { depth: 1.8, bevelEnabled: false });
      const tGable = new THREE.Mesh(tGableGeo, stone);
      tGable.castShadow = true;
      tGableGroup.add(tGable);

      // Molded Ashlar Raking Coping with Crockets
      [-1, 1].forEach(sign => {
        const rakeAngle = sign * 0.72;
        const coping = new THREE.Mesh(new THREE.BoxGeometry(0.55, 13.5, 2.0), darkStone);
        coping.position.set(sign * 4.2, 4.8, 0.9);
        coping.rotation.z = rakeAngle;
        tGableGroup.add(coping);

        for (let cr = 1; cr <= 4; cr++) {
          const cFrac = cr / 5;
          const cx = sign * (8.4 * (1 - cFrac));
          const cy = 9.6 * cFrac;
          const crocket = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.0, 4), gold);
          crocket.position.set(cx + sign * 0.25, cy + 0.15, 1.1);
          crocket.rotation.z = -rakeAngle;
          tGableGroup.add(crocket);
        }
      });

      // Blind Trefoil Arcade in Transept Pediment
      [-2.4, 0, 2.4].forEach((ax, ai) => {
        const ah = ai === 1 ? 4.5 : 3.2;
        const aFrame = new THREE.Mesh(new THREE.BoxGeometry(1.4, ah, 0.3), darkStone);
        aFrame.position.set(ax, ah * 0.5 + 0.8, 1.85);
        tGableGroup.add(aFrame);

        const aArch = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.15, 6, 16, Math.PI), stone);
        aArch.position.set(ax, ah + 0.8, 1.85);
        tGableGroup.add(aArch);
      });

      // Transept Pediment Apex Pinnacle
      const tApexPin = new THREE.Mesh(new THREE.ConeGeometry(0.8, 4.2, 8), darkStone);
      tApexPin.position.set(0, 11.7, 0.9);
      tGableGroup.add(tApexPin);

      const tApexFinial = new THREE.Mesh(new THREE.OctahedronGeometry(0.7, 1), gold);
      tApexFinial.position.set(0, 14.0, 0.9);
      tGableGroup.add(tApexFinial);

      g.add(tGableGroup);

      // Upper Transept End Facade Wall (y = 20 to 38, framing above the open transept portal)
      const tUpperWall = new THREE.Mesh(new THREE.BoxGeometry(1.8, 18.0, 16.0), stone);
      tUpperWall.position.set(tx, 29.0, -4);
      tUpperWall.castShadow = tUpperWall.receiveShadow = true;
      g.add(tUpperWall);

      // Flanking Lower Portal Pier Walls (leaving 8.0m wide central portal archway open: z = -8 to 0)
      const tPierSouth = new THREE.Mesh(new THREE.BoxGeometry(1.8, 18.0, 4.0), stone);
      tPierSouth.position.set(tx, 11.0, 2.0);
      tPierSouth.castShadow = tPierSouth.receiveShadow = true;
      g.add(tPierSouth);

      const tPierNorth = new THREE.Mesh(new THREE.BoxGeometry(1.8, 18.0, 4.0), stone);
      tPierNorth.position.set(tx, 11.0, -10.0);
      tPierNorth.castShadow = tPierNorth.receiveShadow = true;
      g.add(tPierNorth);

      // Soaring Open Pointed Gothic Transept Portal Archway (Clear fly-through width 8.0m, height y = 2 to 17m)
      [3.8, 4.5, 5.2].forEach((rad, ri) => {
        const tArchivolt = new THREE.Mesh(new THREE.TorusGeometry(rad, 0.38, 8, 28, Math.PI), stone);
        tArchivolt.position.set(tx + (tx > 0 ? 0.35 + ri * 0.25 : -0.35 - ri * 0.25), 11.8, -4);
        tArchivolt.rotation.y = tx > 0 ? Math.PI / 2 : -Math.PI / 2;
        tArchivolt.castShadow = true;
        g.add(tArchivolt);
      });

      // Clustered Gothic Transept Jamb Columns
      [-8.0, 0.0].forEach(jz => {
        const jCol = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.40, 14.0, 8), darkStone);
        jCol.position.set(tx + (tx > 0 ? 0.4 : -0.4), 9.0, jz);
        jCol.castShadow = true;
        g.add(jCol);

        const jCap = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.32, 1.2, 8), stone);
        jCap.position.set(tx + (tx > 0 ? 0.4 : -0.4), 16.6, jz);
        g.add(jCap);
      });

      // 10m High Gothic Transept Rose Window Assembly
      const tRoseGroup = new THREE.Group();
      tRoseGroup.position.set(tx, 29.0, -4);
      tRoseGroup.rotation.y = tx > 0 ? Math.PI / 2 : -Math.PI / 2;

      // Deep Splayed Caen Limestone Embrasure Reveal
      const tEmbrasureOuter = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.45, 10, 48), darkStone);
      tEmbrasureOuter.position.set(0, 0, 0.75);
      tRoseGroup.add(tEmbrasureOuter);

      const tEmbrasureMid = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.38, 10, 48), stone);
      tEmbrasureMid.position.set(0, 0, 0.85);
      tRoseGroup.add(tEmbrasureMid);

      const tRoseRim = new THREE.Mesh(new THREE.TorusGeometry(4.8, 0.34, 10, 48), stone);
      tRoseRim.position.set(0, 0, 0.95);
      tRoseGroup.add(tRoseRim);

      // Stained Glass Mandala Dial
      const tRose = new THREE.Mesh(new THREE.CircleGeometry(4.8, 48), stainedGlassRose);
      tRose.position.set(0, 0, 0.90);
      tRoseGroup.add(tRose);

      // Concentric Gothic Stone Tracery Matrix
      const tCenterRing = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.18, 8, 24), gold);
      tCenterRing.position.set(0, 0, 0.98);
      tRoseGroup.add(tCenterRing);

      const tMidCameRing = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.14, 8, 36), leadCame);
      tMidCameRing.position.set(0, 0, 0.96);
      tRoseGroup.add(tMidCameRing);

      // 12 Radiating Stone Mullion Spokes with Gilded Roundels
      for (let s = 0; s < 12; s++) {
        const sAng = (s / 12) * Math.PI * 2;
        const cosA = Math.cos(sAng), sinA = Math.sin(sAng);

        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.6, 0.22), stone);
        spoke.position.set(cosA * 3.0, sinA * 3.0, 0.96);
        spoke.rotation.z = sAng - Math.PI / 2;
        tRoseGroup.add(spoke);

        const trefoil = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.10, 6, 16), gold);
        trefoil.position.set(cosA * 4.0, sinA * 4.0, 0.98);
        tRoseGroup.add(trefoil);
      }

      // Divine Backlight Point Lights (Positioned inside transept shining outward through the rose)
      if (isNorth) {
        // North Transept: Celestial Sapphire & Divine White Radiance
        const northBacklight = new THREE.PointLight(0x7ec8ff, 4.8, 50);
        northBacklight.position.set(0, 0, -2.5); // inside transept wing
        tRoseGroup.add(northBacklight);

        const northWarmAccent = new THREE.PointLight(0xffe0a0, 3.2, 35);
        northWarmAccent.position.set(0, 0, -1.8);
        tRoseGroup.add(northWarmAccent);
      } else {
        // South Transept: Radiant Golden Noon Sunlight & Ruby Glow
        const southBacklight = new THREE.PointLight(0xffd280, 4.8, 50);
        southBacklight.position.set(0, 0, -2.5); // inside transept wing
        tRoseGroup.add(southBacklight);

        const southRubyAccent = new THREE.PointLight(0xff6688, 3.2, 35);
        southRubyAccent.position.set(0, 0, -1.8);
        tRoseGroup.add(southRubyAccent);
      }

      // Soft Forward Exterior Illuminance
      const tForwardGlow = new THREE.PointLight(0xffeedd, 1.8, 22);
      tForwardGlow.position.set(0, 0, 1.8);
      tRoseGroup.add(tForwardGlow);

      g.add(tRoseGroup);
    });

    // --- SEMICIRCULAR APSE / CHEVET & RADIATING CHAPELS (z = -45 to -55) ---
    const apseWallGeo = new THREE.CylinderGeometry(11.0, 11.0, 36, 16, 1, true, Math.PI / 2, Math.PI);
    const apseWall = new THREE.Mesh(apseWallGeo, stone);
    apseWall.position.set(0, 20, -45);
    apseWall.castShadow = apseWall.receiveShadow = true;
    g.add(apseWall);

    const apseRoof = new THREE.Mesh(new THREE.ConeGeometry(11.2, 9.5, 16), copperRoof);
    apseRoof.position.set(0, 42.6, -45);
    apseRoof.castShadow = true;
    g.add(apseRoof);

    // 5 Radiating Ambulatory Chevet Chapels
    for (let cp = 0; cp < 5; cp++) {
      const cpAng = Math.PI * 0.25 + (cp / 4) * Math.PI * 0.5;
      const cpx = Math.cos(cpAng) * 16.5;
      const cpz = -45 - Math.sin(cpAng) * 16.5;

      const chapel = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.8, 14, 12), stone);
      chapel.position.set(cpx, 9.0, cpz);
      chapel.castShadow = chapel.receiveShadow = true;
      g.add(chapel);

      const chapelRoof = new THREE.Mesh(new THREE.ConeGeometry(3.9, 6.0, 12), copperRoof);
      chapelRoof.position.set(cpx, 19.0, cpz);
      chapelRoof.castShadow = true;
      g.add(chapelRoof);

      const chapelFinial = new THREE.Mesh(new THREE.OctahedronGeometry(0.5, 1), gold);
      chapelFinial.position.set(cpx, 22.5, cpz);
      g.add(chapelFinial);
    }

    // =========================================================================
    // 5. INTRICATE GOTHIC FLYING BUTTRESS SYSTEM WITH CROCKETED PINNACLES & GARGOYLES
    // =========================================================================
    const buttressZPlacements = [-44, -32, -20, 8, 20, 32];
    buttressZPlacements.forEach(bz => {
      [-23.5, 23.5].forEach(bx => {
        const sign = bx > 0 ? 1 : -1;
        const buttressGroup = new THREE.Group();
        buttressGroup.position.set(bx, 2.0, bz);

        // --- Stepped Outer Buttress Pier (Culée, y = 0 to 28m) ---
        const pierBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 12, 3.2), darkStone);
        pierBase.position.set(0, 6, 0);
        pierBase.castShadow = true;
        buttressGroup.add(pierBase);

        const pierMid = new THREE.Mesh(new THREE.BoxGeometry(2.0, 10, 2.8), stone);
        pierMid.position.set(-sign * 0.2, 17, 0);
        pierMid.castShadow = true;
        buttressGroup.add(pierMid);

        const pierTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 8, 2.4), stone);
        pierTop.position.set(-sign * 0.4, 26, 0);
        pierTop.castShadow = true;
        buttressGroup.add(pierTop);

        // --- Soaring Crocketed Pinnacle on Top of Pier (y = 30 to 44m) ---
        const pinShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.1, 7.0, 8), stone);
        pinShaft.position.set(-sign * 0.4, 33.5, 0);
        pinShaft.castShadow = true;
        buttressGroup.add(pinShaft);

        const pinSpire = new THREE.Mesh(new THREE.ConeGeometry(0.85, 6.5, 8), darkStone);
        pinSpire.position.set(-sign * 0.4, 40.25, 0);
        pinSpire.castShadow = true;
        buttressGroup.add(pinSpire);

        const pinGoldFinial = new THREE.Mesh(new THREE.OctahedronGeometry(0.55, 1), gold);
        pinGoldFinial.position.set(-sign * 0.4, 44.0, 0);
        buttressGroup.add(pinGoldFinial);

        // --- Double-Tier Arched Flying Flyers (Arcs-Boutants) ---
        // Upper flyer bracing high clerestory wall (Springing from pier y=25.5m to clerestory y=33.2m)
        const upperFlyerCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-sign * 0.4, 25.5, 0),
          new THREE.Vector3(-sign * 5.8, 29.8, 0),
          new THREE.Vector3(-sign * 11.6, 33.2, 0)
        ]);
        const upperFlyer = new THREE.Mesh(new THREE.TubeGeometry(upperFlyerCurve, 16, 0.44, 8, false), stone);
        upperFlyer.castShadow = true;
        buttressGroup.add(upperFlyer);

        // Lower flyer bracing vault thrust (Springing from pier y=15.2m to clerestory/aisle junction y=22.0m)
        const lowerFlyerCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-sign * 0.4, 15.2, 0),
          new THREE.Vector3(-sign * 5.6, 18.8, 0),
          new THREE.Vector3(-sign * 11.6, 22.0, 0)
        ]);
        const lowerFlyer = new THREE.Mesh(new THREE.TubeGeometry(lowerFlyerCurve, 16, 0.40, 8, false), stone);
        lowerFlyer.castShadow = true;
        buttressGroup.add(lowerFlyer);

        // Intermediate Openwork Tracery Strut Brace between Flyers
        const flyerStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 10.5, 8), stone);
        flyerStrut.position.set(-sign * 5.8, 24.3, 0);
        flyerStrut.castShadow = true;
        buttressGroup.add(flyerStrut);

        // --- Sculpted Zoomorphic Gargoyle Rainwater Spout ---
        const gargoyleSpout = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 2.6), darkStone);
        gargoyleSpout.position.set(sign * 1.6, 28.5, 0);
        gargoyleSpout.rotation.y = sign > 0 ? Math.PI / 2 : -Math.PI / 2;
        gargoyleSpout.castShadow = true;
        buttressGroup.add(gargoyleSpout);

        const gargoyleHead = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42, 0), darkStone);
        gargoyleHead.position.set(sign * 2.9, 28.5, 0);
        buttressGroup.add(gargoyleHead);

        g.add(buttressGroup);
      });
    });

    // =========================================================================
    // 6. SOARING CENTRAL CROSSING FLÈCHE SPIRE (Rising to y = 140.0m!)
    // =========================================================================
    const crossingGroup = new THREE.Group();
    crossingGroup.position.set(0, 46.0, -4); // Atop the crossing ridge

    // --- Tier 1: Octagonal Lead / Copper Base Pedestal (y = 46 to 62) ---
    const flecheBase = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 6.2, 16.0, 8), darkStone);
    flecheBase.position.y = 8.0;
    flecheBase.castShadow = true;
    crossingGroup.add(flecheBase);

    // 8 Satellite Flying Spurs around Spire Base
    for (let f = 0; f < 8; f++) {
      const fAng = (f / 8) * Math.PI * 2;
      const spur = new THREE.Mesh(new THREE.BoxGeometry(0.6, 12.0, 2.4), copperRoof);
      spur.position.set(Math.cos(fAng) * 5.6, 8.0, Math.sin(fAng) * 5.6);
      spur.rotation.y = -fAng;
      spur.rotation.z = Math.cos(fAng) * 0.25;
      crossingGroup.add(spur);

      const sPin = new THREE.Mesh(new THREE.ConeGeometry(0.55, 4.0, 6), gold);
      sPin.position.set(Math.cos(fAng) * 5.8, 16.0, Math.sin(fAng) * 5.8);
      crossingGroup.add(sPin);
    }

    // --- Tier 2: Openwork Gothic Belfry Lantern (y = 62 to 84) ---
    const lanternStage1 = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.4, 22.0, 8), copperRoof);
    lanternStage1.position.y = 27.0;
    lanternStage1.castShadow = true;
    crossingGroup.add(lanternStage1);

    const lanternMolding1 = new THREE.Mesh(new THREE.TorusGeometry(3.8, 0.45, 8, 24), gold);
    lanternMolding1.rotation.x = Math.PI / 2;
    lanternMolding1.position.y = 38.0;
    crossingGroup.add(lanternMolding1);

    // --- Tier 3: Slender Open Fluted Lantern (y = 84 to 106) ---
    const lanternStage2 = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.4, 22.0, 8), copperRoof);
    lanternStage2.position.y = 49.0;
    lanternStage2.castShadow = true;
    crossingGroup.add(lanternStage2);

    const lanternMolding2 = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.35, 8, 24), gold);
    lanternMolding2.rotation.x = Math.PI / 2;
    lanternMolding2.position.y = 60.0;
    crossingGroup.add(lanternMolding2);

    // --- Tier 4: Soaring Crocketed Needle Spire (y = 106 to 134) ---
    const needleSpire = new THREE.Mesh(new THREE.ConeGeometry(2.4, 28.0, 8), copperRoof);
    needleSpire.position.y = 74.0;
    needleSpire.castShadow = true;
    crossingGroup.add(needleSpire);

    // Crockets on 4 Spire Tiers
    [64, 72, 80, 86].forEach((cy, ci) => {
      const rad = 2.2 - ci * 0.45;
      for (let cr = 0; cr < 8; cr++) {
        const cAng = (cr / 8) * Math.PI * 2;
        const crocket = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.2, 4), gold);
        crocket.position.set(Math.cos(cAng) * rad, cy, Math.sin(cAng) * rad);
        crocket.rotation.z = Math.cos(cAng) * 0.4;
        crossingGroup.add(crocket);
      }
    });

    // --- Tier 5: Gilded Celestial Starburst Finial & Beacon (Reaching y = 140.0m!) ---
    const finialCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.7, 3.2, 8), gold);
    finialCrown.position.y = 89.6;
    crossingGroup.add(finialCrown);

    const celestialOrb = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), gold);
    celestialOrb.position.y = 92.0;
    crossingGroup.add(celestialOrb);

    const grandStarburst = new THREE.Mesh(new THREE.IcosahedronGeometry(2.6, 1), gold);
    grandStarburst.position.y = 94.0; // 46 + 94 = 140.0m exact!
    crossingGroup.add(grandStarburst);

    // Omnidirectional Starlight Beacon Light at Spire Apex
    const spireBeacon = new THREE.PointLight(0xfff5c0, 5.5, 160);
    spireBeacon.position.y = 94.0;
    crossingGroup.add(spireBeacon);

    g.add(crossingGroup);

    // =========================================================================
    // 7. WALKABLE INTERIOR SANCTUARY (La Sagrada Família & Sistine Chapel)
    // =========================================================================
    // Honed Carrara & Porphyry Marble Nave Floor (36m wide, 80m long)
    const floorGeo = new THREE.PlaneGeometry(20.2, 80);
    floorGeo.rotateX(-Math.PI / 2);
    const interiorFloor = new THREE.Mesh(floorGeo, marble);
    interiorFloor.position.set(0, 2.08, -4);
    interiorFloor.receiveShadow = true;
    g.add(interiorFloor);

    // Soaring Vaulted Ceiling divided into purchasable grid plots
    const vaultZSegments = 26;
    const vaultThetaSegments = 12;
    const vaultRadius = 11;
    const vaultLength = 78;
    const plotZLen = vaultLength / vaultZSegments;
    const plotThetaLen = Math.PI / vaultThetaSegments;
    
    const vaultGroup = new THREE.Group();
    vaultGroup.position.set(0, 25.0, -4);
    
    const sistineMat = Surfaces.sistineVault();
    
    for(let z=0; z<vaultZSegments; z++) {
      for(let t=0; t<vaultThetaSegments; t++) {
        const plotGeo = new THREE.CylinderGeometry(vaultRadius - 0.05, vaultRadius - 0.05, plotZLen, 2, 1, true, t * plotThetaLen, plotThetaLen);
        plotGeo.rotateZ(Math.PI / 2);
        plotGeo.rotateY(Math.PI / 2);
        
        // Correct global UV mapping so the fresco spans the entire ceiling seamlessly
        const uvs = plotGeo.attributes.uv;
        for(let i=0; i<uvs.count; i++) {
          let u = uvs.getX(i);
          let v = uvs.getY(i);
          let globalU = (t + u) / vaultThetaSegments;
          let globalV = (z + v) / vaultZSegments;
          uvs.setXY(i, globalU, globalV);
        }
        
        const plotMat = sistineMat.clone();
        const plotMesh = new THREE.Mesh(plotGeo, plotMat);
        const zPos = -vaultLength / 2 + (z + 0.5) * plotZLen;
        plotMesh.position.set(0, 0, zPos);
        
        // Setup plot data for picking system
        const plotId = `CATHEDRAL_VAULT_${z}_${t}`;
        const fakePlot = {
          id: plotId,
          status: 'available', // Ready to be bought and swap texture to client's animal
          district: 'highland_sanctuary',
          size: 'vault',
          price: 999
        };
        
        this.world.pickables.push(plotMesh);
        // Intercept WorldCore raycaster hit.instanceId (which is undefined for standard Meshes)
        this.world.plotMeshIndex.set(plotMesh, { undefined: fakePlot });
        
        vaultGroup.add(plotMesh);
      }
    }
    g.add(vaultGroup);

    // Gaudí Helicoidal Tree Columns & Clustered Compound Piers (Nave Bays, Choir Bays & 4 Massive Crossing Piers)
    const cathedralPierLocations = [
      { x: -9.8, z: 24, isCrossing: false }, { x: 9.8, z: 24, isCrossing: false },
      { x: -9.8, z: 10, isCrossing: false }, { x: 9.8, z: 10, isCrossing: false },
      // 4 Monumental Crossing Corner Piers (Piliers de la Croisée, framing the open 16m crossing & flèche spire)
      { x: -11.0, z: 4, isCrossing: true },   { x: 11.0, z: 4, isCrossing: true },
      { x: -11.0, z: -12, isCrossing: true }, { x: 11.0, z: -12, isCrossing: true },
      // Choir & Sanctuary Bays
      { x: -9.8, z: -18, isCrossing: false }, { x: 9.8, z: -18, isCrossing: false },
      { x: -9.8, z: -32, isCrossing: false }, { x: 9.8, z: -32, isCrossing: false },
    ];

    cathedralPierLocations.forEach(loc => {
      const colTree = new THREE.Group();
      colTree.position.set(loc.x, 2.0, loc.z);

      const baseRad = loc.isCrossing ? 2.0 : 1.6;
      const topRad = loc.isCrossing ? 2.6 : 2.2;
      const shaftRad1 = loc.isCrossing ? 1.5 : 1.2;
      const shaftRad2 = loc.isCrossing ? 1.8 : 1.5;

      // Fluted Stone Plinth Base
      const plinthMesh = new THREE.Mesh(new THREE.CylinderGeometry(baseRad, topRad, 2.0, 16), stone);
      plinthMesh.position.y = 1.0;
      colTree.add(plinthMesh);

      // Clustered Shaft Pier
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(shaftRad1, shaftRad2, 24.0, 16), stone);
      trunk.position.y = 2.0 + 12.0;
      trunk.castShadow = true;
      colTree.add(trunk);

      // Sculpted Foliate Capital
      const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(loc.isCrossing ? 2.8 : 2.4, shaftRad1 * 1.1, 1.8, 16), darkStone);
      capMesh.position.y = 26.9;
      colTree.add(capMesh);

      // Curved Gothic Vault Ribs arching into Sistine ceiling
      for (let b = 0; b < 6; b++) {
        const bAng = (b / 6) * Math.PI * 2;
        const curvePts = [
          new V3(0, 27.6, 0),
          new V3(Math.cos(bAng) * 3.6, 31.2, Math.sin(bAng) * 3.6),
          new V3(Math.cos(bAng) * 8.2, 34.8, Math.sin(bAng) * 8.2),
        ];
        const ribCurve = new THREE.CatmullRomCurve3(curvePts);
        const ribGeo = new THREE.TubeGeometry(ribCurve, 12, 0.35, 8, false);
        const ribMesh = new THREE.Mesh(ribGeo, stone);
        colTree.add(ribMesh);
      }

      g.add(colTree);
    });

    // Carved Walnut Nave Pews with Molded End Stanchions & Contoured Seats
    const pewEndGeo = new THREE.BoxGeometry(0.24, 1.6, 1.2);
    const pewSeatGeo = new THREE.BoxGeometry(5.2, 0.14, 0.85);
    const pewBackGeo = new THREE.BoxGeometry(5.2, 1.3, 0.14);
    const pewKneelerGeo = new THREE.BoxGeometry(5.0, 0.10, 0.35);

    for (let pz = -22; pz <= 26; pz += 4.6) {
      [-5.6, 5.6].forEach(px => {
        const pewGroup = new THREE.Group();
        pewGroup.position.set(px, 2.0, pz);

        const endL = new THREE.Mesh(pewEndGeo, darkWood);
        endL.position.set(-2.6, 0.8, 0);
        endL.castShadow = true;
        pewGroup.add(endL);

        const endR = new THREE.Mesh(pewEndGeo, darkWood);
        endR.position.set(2.6, 0.8, 0);
        endR.castShadow = true;
        pewGroup.add(endR);

        const seat = new THREE.Mesh(pewSeatGeo, darkWood);
        seat.position.set(0, 0.72, 0.05);
        seat.castShadow = true;
        pewGroup.add(seat);

        const back = new THREE.Mesh(pewBackGeo, darkWood);
        back.position.set(0, 1.35, -0.32);
        back.rotation.x = 0.12;
        back.castShadow = true;
        pewGroup.add(back);

        const kneeler = new THREE.Mesh(pewKneelerGeo, darkWood);
        kneeler.position.set(0, 0.15, -0.65);
        pewGroup.add(kneeler);

        g.add(pewGroup);
      });
    }

    // Apse Sanctuary & High Celestial Altar (North End at z = -38)
    const apseAltar = new THREE.Group();
    apseAltar.position.set(0, 2.0, -38);

    // Breathtaking Byzantine Mosaic Apse Half-Dome (Cul-de-four)
    const apseDomeGeo = new THREE.SphereGeometry(11, 32, 16, Math.PI, Math.PI, 0, Math.PI / 2);
    const apseDome = new THREE.Mesh(apseDomeGeo, byzantineMosaic);
    apseDome.position.set(0, 25.0, -3.5);
    apseDome.material.side = THREE.BackSide; // Viewable from inside
    apseAltar.add(apseDome);

    // Mosaic Apse Floor
    const apseFloorGeo = new THREE.CircleGeometry(11, 32, Math.PI, Math.PI);
    const apseFloor = new THREE.Mesh(apseFloorGeo, byzantineMosaic);
    apseFloor.rotation.x = -Math.PI / 2;
    apseFloor.position.set(0, 0.02, -3.5);
    apseFloor.receiveShadow = true;
    apseAltar.add(apseFloor);

    // Grand Triumphal Arch framing the apse
    const archGeo = new THREE.TorusGeometry(11.2, 0.6, 16, 48, Math.PI);
    const triumphalArch = new THREE.Mesh(archGeo, darkStone);
    triumphalArch.position.set(0, 25.0, 0);
    apseAltar.add(triumphalArch);

    const altarStep1 = new THREE.Mesh(new THREE.BoxGeometry(16, 0.45, 9), marble);
    altarStep1.position.y = 0.22;
    apseAltar.add(altarStep1);

    const altarStep2 = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.45, 7), marble);
    altarStep2.position.y = 0.67;
    apseAltar.add(altarStep2);

    // Intricate High Altar Table
    const altarTable = new THREE.Mesh(new THREE.BoxGeometry(8.2, 1.3, 2.8), marble);
    altarTable.position.set(0, 1.55, 0);
    altarTable.castShadow = true;
    apseAltar.add(altarTable);

    // Gold trim on Altar
    const altarTrimGeo = new THREE.BoxGeometry(8.3, 0.1, 2.9);
    const altarTrim = new THREE.Mesh(altarTrimGeo, gold);
    altarTrim.position.set(0, 2.15, 0);
    apseAltar.add(altarTrim);

    // Carved Gilded Reredos Screen behind Altar (Magnificent detail)
    const reredosGeo = new THREE.BoxGeometry(11.2, 9.5, 0.8);
    const reredos = new THREE.Mesh(reredosGeo, gold);
    reredos.position.set(0, 5.65, -3.2); 
    reredos.castShadow = true;
    apseAltar.add(reredos);

    // Radiant Celestial Starburst Beacon above Altar
    const altarStarburst = new THREE.Mesh(new THREE.IcosahedronGeometry(2.0, 2), gold);
    altarStarburst.position.set(0, 14.0, -2.4);
    apseAltar.add(altarStarburst);

    const altarLight = new THREE.PointLight(0xfff0cc, 6.2, 90);
    altarLight.position.set(0, 14.0, -2.4);
    apseAltar.add(altarLight);

    // Stained Glass Reflections (Colorful ambient light pools on the floor)
    const sgLight1 = new THREE.PointLight(0xff3366, 2.5, 30);
    sgLight1.position.set(-8, 3.0, 10);
    apseAltar.add(sgLight1);
    
    const sgLight2 = new THREE.PointLight(0x3366ff, 2.5, 30);
    sgLight2.position.set(8, 3.0, 10);
    apseAltar.add(sgLight2);

    const sgLight3 = new THREE.PointLight(0x33cc33, 2.0, 40);
    sgLight3.position.set(0, 4.0, -10);
    apseAltar.add(sgLight3);

    g.add(apseAltar);

    // Interactive Votive Candle Lighting Alcoves (Left & Right Side Chapels)
    [-15.0, 15.0].forEach((vx) => {
      const candleStand = new THREE.Group();
      candleStand.position.set(vx, 2.0, -4);

      // Central Pillar connecting to the floor
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.4, 8), darkWood);
      pillar.position.y = 1.0;
      candleStand.add(pillar);

      for (let t = 0; t < 3; t++) {
        const ty = 0.8 + t * 0.65;
        const trad = 2.6 - t * 0.55;
        const tierMesh = new THREE.Mesh(new THREE.CylinderGeometry(trad, trad, 0.15, 16), gold);
        tierMesh.position.y = ty;
        candleStand.add(tierMesh);

        const count = 10 - t * 2;
        for (let k = 0; k < count; k++) {
          const kang = (k / count) * Math.PI * 2;
          const kx = Math.cos(kang) * (trad - 0.35);
          const kz = Math.sin(kang) * (trad - 0.35);

          const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.10, 0.22, 8), new THREE.MeshPhysicalMaterial({
            color: 0xffe8a0, roughness: 0.2, metalness: 0.1
          }));
          cup.position.set(kx, ty + 0.11, kz);
          candleStand.add(cup);

          const flame = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 6), new THREE.MeshBasicMaterial({
            color: 0xffaa22
          }));
          flame.position.set(kx, ty + 0.28, kz);
          candleStand.add(flame);
        }
      }
      
      const hitbox = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 6), new THREE.MeshBasicMaterial({ visible: false }));
      hitbox.position.copy(candleStand.position);
      hitbox.position.y += 2.0;
      hitbox.userData = { 
        action: 'light_candle', 
        label: 'Light a Votive Candle'
      };
      this.world.pickables.push(hitbox);
      g.add(hitbox);
      
      g.add(candleStand);
    });

    // ------------------------------------------------------------------------
    // ARCHITECTURAL PRESERVATION: Robust Geometry Consolidation with Attribute Normalization
    // ------------------------------------------------------------------------
    const matsMap = new Map();
    g.updateMatrixWorld(true);

    g.traverse((child) => {
      if (child.isMesh && child.geometry && child.material && !child.userData.action && !child.userData.noMerge) {
        const mat = child.material;
        if (!matsMap.has(mat)) matsMap.set(mat, []);
        
        const geom = child.geometry.clone();
        // Normalize vertex attributes so mergeGeometries never fails
        if (!geom.attributes.normal) geom.computeVertexNormals();
        if (!geom.attributes.uv) {
          const uvs = new Float32Array(geom.attributes.position.count * 2);
          geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        }
        
        const relMatrix = new THREE.Matrix4().copy(g.matrixWorld).invert().multiply(child.matrixWorld);
        geom.applyMatrix4(relMatrix);
        
        matsMap.get(mat).push({ geom, child });
      }
    });

    // Merge meshes by material safely
    for (const [mat, items] of matsMap.entries()) {
      if (items.length > 0) {
        const geoms = items.map(it => it.geom);
        let mergedGeo = null;
        try {
          mergedGeo = safeMerge(geoms, false);
        } catch (e) {
          console.warn('[cathedral] merge failed for material, keeping separate', e);
        }
        if (mergedGeo) {
          // Remove merged individual meshes only when merge succeeds
          items.forEach(it => { if (it.child.parent) it.child.parent.remove(it.child); });
          const mergedMesh = new THREE.Mesh(mergedGeo, mat);
          mergedMesh.castShadow = true;
          mergedMesh.receiveShadow = true;
          g.add(mergedMesh);
        }
      }
    }

    this.world.scene.add(g);
  }

