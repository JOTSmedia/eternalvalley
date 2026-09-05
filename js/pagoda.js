  _buddhistPagoda() {
    const g = new THREE.Group();
    const px = WORLD.buddhistTemple.x, pz = WORLD.buddhistTemple.z;
    const py = terrainHeight(px, pz); // Perfectly grounded foundation
    g.position.set(px, py, pz);

    const vermilion = material('ceramic', { repeat: 2.0, color: 0xba2418, roughness: 0.1, metalness: 0.0, physical: true, clearcoat: 1.0, clearcoatRoughness: 0.05, ior: 1.6 });
    const vermilionDark = material('ceramic', { repeat: 2.0, color: 0x7c140c, roughness: 0.15, metalness: 0.0, physical: true, clearcoat: 0.9, clearcoatRoughness: 0.08, ior: 1.6 });
    const whitePlaster = Surfaces.stuccoMuqarnas(3.0);
    const ebonyWood = material('timber', { repeat: 2.0, color: 0x1c1511, roughness: 0.65, metalness: 0.0, physical: true, clearcoat: 0.15, clearcoatRoughness: 0.6, normalScale: 1.4 });
    const shojiScreen = new THREE.MeshPhysicalMaterial({
      color: 0xfff6e4,
      emissive: 0xffe4b8,
      emissiveIntensity: 1.2,
      roughness: 0.75,
      metalness: 0.0,
      transparent: true, logarithmicDepthBuffer: true,
      opacity: 0.90,
      side: THREE.DoubleSide
    });
    const cedar = Surfaces.wood(1.4);
    const slateRoof = Surfaces.pagodaTile(3.8);
    const stone = material('agedCaenLimestone', { repeat: 4.0, color: 0x90897f, roughness: 0.9, metalness: 0.0, normalScale: 1.8, aoMapIntensity: 1.5 });
    const granite = Surfaces.granite(1.5);
    const gold = Surfaces.celestialGold(1.0);
    const bronze = Surfaces.verdigrisBronze(1.0);
    const mossMat = Surfaces.forestFloor(3.0);

    // 1. Zen Rock Garden Terrace & Karesansui Landscape (枯山水)
    const terraceGeo = new THREE.CylinderGeometry(28, 30, 4.0, 36);
    const terrace = new THREE.Mesh(terraceGeo, stone);
    terrace.position.y = -0.4;
    terrace.receiveShadow = terrace.castShadow = true;
    g.add(terrace);

    // Tiered Granite Foundation Curb
    const curbGeo = new THREE.TorusGeometry(27.8, 0.45, 8, 36);
    curbGeo.rotateX(Math.PI / 2);
    const curb = new THREE.Mesh(curbGeo, granite);
    curb.position.y = 1.6;
    g.add(curb);

    // Raked White Granite Gravel Bed (Shirakawa Sand)
    const gravelMat = new THREE.MeshPhysicalMaterial({
      color: 0xedeae2, roughness: 0.90, bumpScale: 0.18,
      });
    const gravel = new THREE.Mesh(new THREE.RingGeometry(0, 27.5, 64), gravelMat);
    gravel.rotation.x = -Math.PI / 2;
    gravel.position.y = 1.65;
    gravel.receiveShadow = true;
    g.add(gravel);

    // Geometric Raked Sand Lines (Karesansui ripples)
    const rakedGeo = new THREE.RingGeometry(0.5, 27.5, 64, 48); // 48 segments radially
    // Displace vertices to create physical ripples
    const posAttribute = rakedGeo.attributes.position;
    for(let i=0; i<posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        const dist = Math.sqrt(x*x + y*y);
        // Sinusoidal ripple based on distance
        const ripple = Math.sin(dist * 6.0) * 0.08;
        posAttribute.setZ(i, posAttribute.getZ(i) + ripple);
    }
    rakedGeo.computeVertexNormals();
    const rakedSand = new THREE.Mesh(rakedGeo, gravelMat);
    rakedSand.rotation.x = -Math.PI / 2;
    rakedSand.position.y = 1.66; // Slightly above the base gravel
    rakedSand.receiveShadow = true;
    g.add(rakedSand);


    // Outer Moss Garden Perimeter Band
    const mossBorder = new THREE.Mesh(new THREE.RingGeometry(24.2, 27.6, 48), mossMat);
    mossBorder.rotation.x = -Math.PI / 2;
    mossBorder.position.y = 1.62;
    g.add(mossBorder);

    // Granite Stepping Stones Path (Tobi-ishi 飛石) winding gracefully to entrance
    const pathPoints = [
      [0, 27], [-0.8, 25.2], [-1.2, 23.4], [-0.5, 21.6], [0.8, 19.8],
      [1.6, 18.0], [1.4, 16.2], [0.4, 14.4], [-0.6, 12.6], [0, 10.8], [0, 9.2]
    ];
    pathPoints.forEach(([sx, sz], pi) => {
      const sRad = 0.85 + Math.sin(pi * 1.7) * 0.15;
      const stepMesh = new THREE.Mesh(new THREE.CylinderGeometry(sRad, sRad * 1.08, 0.18, 10), granite);
      stepMesh.position.set(sx, 1.68, sz);
      stepMesh.rotation.y = pi * 0.45;
      stepMesh.receiveShadow = stepMesh.castShadow = true;
      g.add(stepMesh);
    });

    // Authentic Sansonzon-gumi Monolithic Zen Rock Arrangements with Moss Skirts & Ripple Rings
    const rockGroups = [
      // NW Mountain Trinity (Main Sanzon Group: Master upright, attendant angled, low guardian)
      { cx: -15, cz: -11, items: [{ x: 0, z: 0, s: 3.4, sy: 1.5 }, { x: 2.2, z: 1.2, s: 2.1, sy: 1.0 }, { x: -1.8, z: 1.5, s: 1.5, sy: 0.75 }] },
      // SE Crane Island Group
      { cx: 16, cz: 11, items: [{ x: 0, z: 0, s: 3.0, sy: 1.35 }, { x: -1.6, z: 1.4, s: 1.8, sy: 0.9 }, { x: 1.8, z: -1.2, s: 1.4, sy: 0.7 }] },
      // SW Tortoise Island Group (Flat meditation boulder + twin flanking stones)
      { cx: -14, cz: 14, items: [{ x: 0, z: 0, s: 2.6, sy: 0.65 }, { x: 2.0, z: -1.0, s: 1.5, sy: 1.1 }, { x: -1.6, z: -1.2, s: 1.3, sy: 0.8 }] },
      // NE Solitary Sentinel Rock
      { cx: 14, cz: -15, items: [{ x: 0, z: 0, s: 2.8, sy: 1.4 }, { x: -1.4, z: 1.6, s: 1.3, sy: 0.8 }] }
    ];

    rockGroups.forEach(rg => {
      // Concentric Raked Ripple Rings (Samon 波紋) around rock island
      const rippleRings = new THREE.Mesh(new THREE.RingGeometry(3.5, 5.8, 32), new THREE.MeshPhysicalMaterial({
        color: 0xe2ded6, roughness: 0.95
      }));
      rippleRings.rotation.x = -Math.PI / 2;
      rippleRings.position.set(rg.cx, 1.62, rg.cz);
      g.add(rippleRings);

      // Lush Velvet Moss Base Skirt
      const mossMound = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 4.2, 0.28, 20), mossMat);
      mossMound.position.set(rg.cx, 1.66, rg.cz);
      g.add(mossMound);

      // Monolithic Boulders
      rg.items.forEach(rk => {
        const rockMesh = new THREE.Mesh(new THREE.DodecahedronGeometry(rk.s, 1), Surfaces.photogrammetryRock(1.5));
        rockMesh.scale.set(1.0, rk.sy, 1.0);
        rockMesh.position.set(rg.cx + rk.x, 1.6 + rk.s * rk.sy * 0.65, rg.cz + rk.z);
        rockMesh.rotation.set(0.15, (rg.cx + rk.x) * 0.4, 0.1);
        rockMesh.castShadow = true;
        g.add(rockMesh);
      });
    });

    // 4 Traditional Japanese Stone Toro Lanterns (Kasuga-dōrō / Yukimi-dōrō)
    const toroPositions = [{ x: -18, z: -14 }, { x: 18, z: 14 }, { x: -15, z: 18 }, { x: 16, z: -16 }];
    toroPositions.forEach(tp => {
      const toro = new THREE.Group();
      toro.position.set(tp.x, 1.6, tp.z);

      // Hexagonal Carved Base Pedestal (Kiso)
      const tBase = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.95, 0.45, 6), granite);
      tBase.position.y = 0.22;
      tBase.castShadow = true;
      toro.add(tBase);

      // Fluted Stone Column Shaft (Sao) with Central Node
      const tShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 1.6, 8), granite);
      tShaft.position.y = 1.25;
      tShaft.castShadow = true;
      toro.add(tShaft);

      const tNode = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 0.25, 6), granite);
      tNode.position.y = 1.35;
      toro.add(tNode);

      // Middle Platform (Chūdai)
      const tPlatform = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.60, 0.32, 6), granite);
      tPlatform.position.y = 2.2;
      toro.add(tPlatform);

      // Light Chamber Firebox (Hibukuro) with pierced windows & warm lantern glow
      const tBox = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.85, 0.95), new THREE.MeshPhysicalMaterial({
        color: 0xffeed0, emissive: 0xffaa24, emissiveIntensity: 2.6, roughness: 0.4
      }));
      tBox.position.y = 2.78;
      toro.add(tBox);

      // Flared Hexagonal Roof (Kasa) with upturned corner tips
      const tRoof = new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.75, 6), slateRoof);
      tRoof.position.y = 3.55;
      tRoof.castShadow = true;
      toro.add(tRoof);

      // Sacred Lotus Jewel Finial (Hōju)
      const tJewel = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 12), gold);
      tJewel.position.y = 4.08;
      toro.add(tJewel);

      g.add(toro);
    });

    // Traditional Tsukubai / Chōzubachi Water Purification Basin (手水鉢)
    const tsukubai = new THREE.Group();
    tsukubai.position.set(2.8, 1.6, 11.5);
    const tRock = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.1, 0.85, 12), Surfaces.mossyStone(1.5));
    tRock.position.y = 0.42;
    tRock.castShadow = true;
    tsukubai.add(tRock);

    const tWater = new THREE.Mesh(new THREE.CircleGeometry(0.55, 16), this.world._waterPoolMat || new THREE.MeshPhysicalMaterial({
      color: 0x184c56, roughness: 0.1, metalness: 0.2
    }));
    tWater.rotation.x = -Math.PI / 2;
    tWater.position.y = 0.86;
    tsukubai.add(tWater);

    const kakehi = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8), cedar);
    kakehi.rotation.z = -0.35;
    kakehi.position.set(-0.45, 1.0, 0);
    tsukubai.add(kakehi);

    const ladle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 8), cedar);
    ladle.position.set(0.15, 0.92, 0);
    tsukubai.add(ladle);
    g.add(tsukubai);

    // 2. 5-Tiered Japanese Gojūnotō Pagoda (五重塔)
    const pagodaGroup = new THREE.Group();
    pagodaGroup.position.set(0, 1.6, 0);

    const furinGeo = (() => {
      const parts = [];
      const hook = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 6);
      hook.translate(0, 0.18, 0);
      parts.push(hook);
      const bell = new THREE.CylinderGeometry(0.12, 0.22, 0.32, 12, 1, true);
      bell.translate(0, -0.05, 0);
      parts.push(bell);
      const dome = new THREE.SphereGeometry(0.12, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2);
      dome.translate(0, 0.11, 0);
      parts.push(dome);
      const rod = new THREE.CylinderGeometry(0.015, 0.015, 0.55, 6);
      rod.translate(0, -0.30, 0);
      parts.push(rod);
      const leaf = new THREE.BoxGeometry(0.14, 0.38, 0.01);
      leaf.translate(0, -0.62, 0);
      parts.push(leaf);
      return safeMerge(parts, false) || parts[0];
    })();

    const tierSpecs = [
      { w: 12.0, h: 5.2, eaveOverhang: 4.0, verandaW: 14.8 }, // Tier 0 (Ground)
      { w: 10.7, h: 4.8, eaveOverhang: 3.6, verandaW: 13.0 }, // Tier 1
      { w: 9.5,  h: 4.4, eaveOverhang: 3.2, verandaW: 11.4 }, // Tier 2
      { w: 8.3,  h: 4.0, eaveOverhang: 2.8, verandaW: 9.9 },  // Tier 3
      { w: 7.2,  h: 3.6, eaveOverhang: 2.5, verandaW: 8.6 }   // Tier 4 (Top)
    ];

    let currentY = 0;

    for (let t = 0; t < 5; t++) {
      const spec = tierSpecs[t];
      const w = spec.w;
      const h = spec.h;
      const halfW = w / 2;
      const ty = currentY;

      // Engawa Veranda & Vermilion Railings (Balustrade / Kōran)
      const verandaDeck = new THREE.Mesh(new THREE.BoxGeometry(spec.verandaW, 0.45, spec.verandaW), ebonyWood);
      verandaDeck.position.y = ty + 0.22;
      verandaDeck.receiveShadow = true;
      pagodaGroup.add(verandaDeck);

      // Veranda Balustrades & Rail Posts
      const railH = 0.75;
      const railThick = 0.12;
      const balustradeGroup = new THREE.Group();
      balustradeGroup.position.y = ty + 0.45;

      // Edge Handrails (Tier 0 leaves South entrance wide open for walkthrough)
      const halfV = spec.verandaW / 2 - 0.15;
      [
        { x: 0, z: halfV, rotY: 0, len: spec.verandaW - 0.3, isSouth: true },
        { x: 0, z: -halfV, rotY: 0, len: spec.verandaW - 0.3, isSouth: false },
        { x: halfV, z: 0, rotY: Math.PI / 2, len: spec.verandaW - 0.3, isSouth: false },
        { x: -halfV, z: 0, rotY: Math.PI / 2, len: spec.verandaW - 0.3, isSouth: false }
      ].forEach(r => {
        if (t === 0 && r.isSouth) {
          // Open South central entrance portal on Ground Veranda
          [-spec.verandaW * 0.32, spec.verandaW * 0.32].forEach(hx => {
            const sideLen = spec.verandaW * 0.32;
            const topRail = new THREE.Mesh(new THREE.BoxGeometry(sideLen, railThick, railThick * 1.5), vermilionDark);
            topRail.position.set(hx, railH, r.z);
            balustradeGroup.add(topRail);
            for (let b = 0; b <= 4; b++) {
              const u = hx + (b / 4 - 0.5) * (sideLen - 0.4);
              const baluster = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, railH, 8), vermilion);
              baluster.position.set(u, railH / 2, r.z);
              balustradeGroup.add(baluster);
            }
          });
        } else {
          const topRail = new THREE.Mesh(new THREE.BoxGeometry(r.len, railThick, railThick * 1.5), vermilionDark);
          topRail.position.set(r.x, railH, r.z);
          topRail.rotation.y = r.rotY;
          balustradeGroup.add(topRail);

          // Balusters
          const count = 8;
          for (let b = 0; b <= count; b++) {
            const u = (b / count - 0.5) * (r.len - 0.4);
            const baluster = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, railH, 8), vermilion);
            if (r.rotY === 0) baluster.position.set(u, railH / 2, r.z);
            else baluster.position.set(r.x, railH / 2, u);
            balustradeGroup.add(baluster);
          }
        }
      });
      pagodaGroup.add(balustradeGroup);

      // Sanctuary Core Walls: Ground Tier 0 is hollowed for magnificent open interior & Golden Buddha Altar
      if (t === 0) {
        // Polished Hinoki / Cedar Sanctuary Floor
        const sanctuaryFloor = new THREE.Mesh(new THREE.BoxGeometry(w - 0.8, 0.12, w - 0.8), cedar);
        sanctuaryFloor.position.set(0, ty + 0.28, 0);
        sanctuaryFloor.receiveShadow = true;
        pagodaGroup.add(sanctuaryFloor);

        // Rear North Wall
        const wallNorth = new THREE.Mesh(new THREE.BoxGeometry(w - 0.4, h - 0.2, 0.4), whitePlaster);
        wallNorth.position.set(0, ty + h / 2 + 0.2, -halfW + 0.2);
        wallNorth.castShadow = wallNorth.receiveShadow = true;
        pagodaGroup.add(wallNorth);

        // West Wall
        const wallWest = new THREE.Mesh(new THREE.BoxGeometry(0.4, h - 0.2, w - 0.4), whitePlaster);
        wallWest.position.set(-halfW + 0.2, ty + h / 2 + 0.2, 0);
        wallWest.castShadow = wallWest.receiveShadow = true;
        pagodaGroup.add(wallWest);

        // East Wall
        const wallEast = new THREE.Mesh(new THREE.BoxGeometry(0.4, h - 0.2, w - 0.4), whitePlaster);
        wallEast.position.set(halfW - 0.2, ty + h / 2 + 0.2, 0);
        wallEast.castShadow = wallEast.receiveShadow = true;
        pagodaGroup.add(wallEast);

        // Front South Facade Panels (leaving central 5.2m entrance portal wide open!)
        [-halfW + 1.6, halfW - 1.6].forEach(fx => {
          const wallFrontSide = new THREE.Mesh(new THREE.BoxGeometry(3.2, h - 0.2, 0.4), whitePlaster);
          wallFrontSide.position.set(fx, ty + h / 2 + 0.2, halfW - 0.2);
          wallFrontSide.castShadow = wallFrontSide.receiveShadow = true;
          pagodaGroup.add(wallFrontSide);
        });

        // Entrance Porch Transom Beam & Carved Ranma Latticework Screen over Portal
        const transomBeam = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.45, 0.5), vermilionDark);
        transomBeam.position.set(0, ty + 3.8, halfW + 0.05);
        pagodaGroup.add(transomBeam);

        const ranmaScreen = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.95, 0.12), gold);
        ranmaScreen.position.set(0, ty + 4.35, halfW + 0.05);
        pagodaGroup.add(ranmaScreen);

        // Karahafu Entrance Porch Cusped Gable Canopy
        const porchGable = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 1.2, 16, 1, false, 0, Math.PI), slateRoof);
        porchGable.rotation.x = Math.PI / 2;
        porchGable.position.set(0, ty + 4.0, halfW + 0.6);
        pagodaGroup.add(porchGable);

        // Carved Ebony & Vermilion Sliding Temple Doors (Maitogido) — SLID WIDE OPEN against side walls (Clear 5.2m width)
        [-3.2, 3.2].forEach(dx => {
          const door = new THREE.Mesh(new THREE.BoxGeometry(1.8, 3.4, 0.12), ebonyWood);
          door.position.set(dx, ty + 1.9, halfW + 0.12);
          door.castShadow = true;
          pagodaGroup.add(door);

          const doorGoldTrim = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.16, 0.14), gold);
          doorGoldTrim.position.set(dx, ty + 3.5, halfW + 0.13);
          pagodaGroup.add(doorGoldTrim);
        });

        // =========================================================================
        // MAGNIFICENT GOLDEN BUDDHA ALTAR (Butsudan / Daibutsu 仏壇)
        // =========================================================================
        const altarGroup = new THREE.Group();
        altarGroup.position.set(0, ty + 0.28, -2.8);

        // Multi-tiered Black Lacquer & Gold Shumidan Altar Dais (須弥壇)
        const dais1 = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.45, 2.8), ebonyWood);
        dais1.position.y = 0.22;
        dais1.receiveShadow = true;
        altarGroup.add(dais1);

        const daisTrim1 = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.08, 2.9), gold);
        daisTrim1.position.y = 0.45;
        altarGroup.add(daisTrim1);

        const dais2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.45, 2.2), ebonyWood);
        dais2.position.y = 0.67;
        altarGroup.add(dais2);

        const daisTrim2 = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.08, 2.3), gold);
        daisTrim2.position.y = 0.90;
        altarGroup.add(daisTrim2);

        // Layered Carved Golden Lotus Throne (Rengeza 蓮華座)
        const lotusBase = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.2, 0.45, 16), gold);
        lotusBase.position.y = 1.12;
        lotusBase.castShadow = true;
        altarGroup.add(lotusBase);

        for (let p = 0; p < 12; p++) {
          const pAng = (p / 12) * Math.PI * 2;
          const petal = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), gold);
          petal.scale.set(1.2, 0.5, 1.8);
          petal.position.set(Math.cos(pAng) * 1.45, 1.32, Math.sin(pAng) * 1.45);
          petal.rotation.y = -pAng;
          altarGroup.add(petal);
        }

        // Sculpted Golden Meditating Buddha (Amida Nyorai / Shakyamuni)
        // Padmasana Crossed-Legs Lotus Base
        const legs = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.55, 12), gold);
        legs.position.y = 1.55;
        legs.castShadow = true;
        altarGroup.add(legs);

        // Robed Torso
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.60, 0.90, 1.35, 12), gold);
        torso.position.y = 2.45;
        torso.castShadow = true;
        altarGroup.add(torso);

        // Arms in Dhyana Meditation Mudra
        const mudraArms = new THREE.Mesh(new THREE.TorusGeometry(0.80, 0.18, 8, 16, Math.PI), gold);
        mudraArms.rotation.x = Math.PI / 2;
        mudraArms.position.set(0, 2.05, 0.32);
        altarGroup.add(mudraArms);

        const mudraHands = new THREE.Mesh(new THREE.SphereGeometry(0.20, 8, 8), gold);
        mudraHands.position.set(0, 2.05, 0.48);
        altarGroup.add(mudraHands);

        // Buddha Head with Serene Countenance & Ushnisha Wisdom Crown
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.35, 8), gold);
        neck.position.y = 3.25;
        altarGroup.add(neck);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.46, 16, 16), gold);
        head.position.y = 3.75;
        head.castShadow = true;
        altarGroup.add(head);

        const ushnisha = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), gold);
        ushnisha.position.y = 4.22;
        altarGroup.add(ushnisha);

        [-0.48, 0.48].forEach(ex => {
          const ear = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.10), gold);
          ear.position.set(ex, 3.65, 0);
          altarGroup.add(ear);
        });

        // Radiating Gilded Halo / Mandorla (Kōhai 光背) with Flame Motifs
        const mandorlaDisc = new THREE.Mesh(new THREE.CircleGeometry(2.3, 32), gold);
        mandorlaDisc.position.set(0, 3.3, -0.45);
        altarGroup.add(mandorlaDisc);

        const mandorlaRim = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.12, 8, 32), gold);
        mandorlaRim.position.set(0, 3.3, -0.42);
        altarGroup.add(mandorlaRim);

        for (let ray = 0; ray < 12; ray++) {
          const rAng = (ray / 12) * Math.PI * 2;
          const flameRay = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.1, 4), gold);
          flameRay.position.set(Math.cos(rAng) * 2.5, 3.3 + Math.sin(rAng) * 2.5, -0.42);
          flameRay.rotation.z = rAng - Math.PI / 2;
          altarGroup.add(flameRay);
        }

        // Flanking Sacred Offerings
        // Brass Flower Vases (Kabin) with Lotus Blooms
        [-1.6, 1.6].forEach(vx => {
          const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 0.75, 12), gold);
          vase.position.set(vx, 1.25, 0.4);
          altarGroup.add(vase);

          const blossom = new THREE.Mesh(new THREE.DodecahedronGeometry(0.24, 0), new THREE.MeshPhysicalMaterial({
            color: 0xffe8f4, emissive: 0xff88c0, emissiveIntensity: 1.8
          }));
          blossom.position.set(vx, 1.75, 0.4);
          altarGroup.add(blossom);
        });

        // Bronze Candle Stands (Rōsokutate) with Glowing Flame Points
        [-1.1, 1.1].forEach(cx => {
          const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.16, 0.85, 8), bronze);
          stand.position.set(cx, 1.30, 0.8);
          altarGroup.add(stand);

          const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.35, 8), whitePlaster);
          candle.position.set(cx, 1.85, 0.8);
          altarGroup.add(candle);

          const candleFlame = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 6), new THREE.MeshBasicMaterial({ color: 0xffaa22 }));
          candleFlame.position.set(cx, 2.08, 0.8);
          altarGroup.add(candleFlame);
        });

        // Suspended Overhead Gilded Temple Canopy (Tengai 天蓋)
        const tengai = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, 0.25, 8), gold);
        tengai.position.set(0, 4.6, 0);
        altarGroup.add(tengai);

        // Serene Divine Golden Altar Illumination radiating through open entrance porch
        const altarGlow = new THREE.PointLight(0xffdf99, 4.2, 28);
        altarGlow.position.set(0, 3.2, 0.5);
        altarGroup.add(altarGlow);

        pagodaGroup.add(altarGroup);
      } else {
        // Upper Tiers 1-4: Sanctuary Core Walls (White Shikkui Plaster Bays)
        const plasterCore = new THREE.Mesh(new THREE.BoxGeometry(w - 0.2, h - 0.2, w - 0.2), whitePlaster);
        plasterCore.position.y = ty + h / 2 + 0.2;
        plasterCore.castShadow = plasterCore.receiveShadow = true;
        pagodaGroup.add(plasterCore);
      }

      // Traditional Vermilion Lacquer Structural Corner & Intermediate Pillars (Sumi-bashira)
      const pillarRadius = 0.36 - t * 0.03;
      const pillarGeo = new THREE.CylinderGeometry(pillarRadius * 0.95, pillarRadius, h, 16);
      const pillarOffsets = [
        [-halfW, -halfW], [0, -halfW], [halfW, -halfW],
        [-halfW, halfW], [0, halfW], [halfW, halfW],
        [-halfW, 0], [halfW, 0]
      ];
      pillarOffsets.forEach(([cx, cz]) => {
        const pillar = new THREE.Mesh(pillarGeo, vermilion);
        pillar.position.set(cx, ty + h / 2 + 0.2, cz);
        pillar.castShadow = true;
        pagodaGroup.add(pillar);
      });

      // Horizontal Vermilion Tie-Beams (Nageshi & Kashiranuki)
      [-halfW, halfW].forEach(zSide => {
        const beamMid = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 0.35, 0.35), vermilionDark);
        beamMid.position.set(0, ty + h * 0.55, zSide);
        const beamTop = new THREE.Mesh(new THREE.BoxGeometry(w + 0.8, 0.40, 0.40), vermilionDark);
        beamTop.position.set(0, ty + h - 0.1, zSide);
        pagodaGroup.add(beamMid, beamTop);
      });
      [-halfW, halfW].forEach(xSide => {
        const beamMid = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, w + 0.6), vermilionDark);
        beamMid.position.set(xSide, ty + h * 0.55, 0);
        const beamTop = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.40, w + 0.8), vermilionDark);
        beamTop.position.set(xSide, ty + h - 0.1, 0);
        pagodaGroup.add(beamMid, beamTop);
      });

      // Shoji Screen Lattices (For Tier 0, South screens are on outer side bays leaving central 5.2m entrance portal wide open)
      const screenGeo = new THREE.PlaneGeometry(w * 0.38, h * 0.62);
      const screenGeoTier0South = new THREE.PlaneGeometry(w * 0.22, h * 0.62);
      const screenConfigs = [
        { x: -w * (t === 0 ? 0.36 : 0.28), z: halfW + 0.08, ry: 0, isSouthTier0: t === 0 },
        { x: w * (t === 0 ? 0.36 : 0.28), z: halfW + 0.08, ry: 0, isSouthTier0: t === 0 },
        { x: -w * 0.24, z: -halfW - 0.08, ry: Math.PI, isSouthTier0: false },
        { x: w * 0.24, z: -halfW - 0.08, ry: Math.PI, isSouthTier0: false },
        { x: halfW + 0.08, z: -w * 0.24, ry: Math.PI / 2, isSouthTier0: false },
        { x: halfW + 0.08, z: w * 0.24, ry: Math.PI / 2, isSouthTier0: false },
        { x: -halfW - 0.08, z: -w * 0.24, ry: -Math.PI / 2, isSouthTier0: false },
        { x: -halfW - 0.08, z: w * 0.24, ry: -Math.PI / 2, isSouthTier0: false },
      ];
      screenConfigs.forEach(sp => {
        const geo = sp.isSouthTier0 ? screenGeoTier0South : screenGeo;
        const screen = new THREE.Mesh(geo, shojiScreen);
        screen.position.set(sp.x, ty + h * 0.45, sp.z);
        screen.rotation.y = sp.ry;
        pagodaGroup.add(screen);
      });

      // Authentic Tokyō / Dougong Interlocking Bracket System (斗栱 - 3-Step Mitesaki Brackets)
      const bracketLevels = 3;
      const bracketGroup = new THREE.Group();
      bracketGroup.position.y = ty + h;

      pillarOffsets.forEach(([px, pz]) => {
        const nx = px === 0 ? 0 : Math.sign(px);
        const nz = pz === 0 ? 0 : Math.sign(pz);

        for (let b = 0; b < bracketLevels; b++) {
          const by = b * 0.32;
          const proj = (b + 1) * 0.38;

          // Bearing Block (Daito / Shoto)
          const block = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.18, 0.46), ebonyWood);
          block.position.set(px + nx * (proj - 0.18), by, pz + nz * (proj - 0.18));
          bracketGroup.add(block);

          // Stepped Cantilever Arms (Hijiki)
          if (nx !== 0 && nz === 0) {
            const hijikiZ = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 1.3 + b * 0.4), vermilion);
            hijikiZ.position.set(px + nx * proj, by + 0.10, pz);
            bracketGroup.add(hijikiZ);
          } else if (nz !== 0 && nx === 0) {
            const hijikiX = new THREE.Mesh(new THREE.BoxGeometry(1.3 + b * 0.4, 0.18, 0.28), vermilion);
            hijikiX.position.set(px, by + 0.10, pz + nz * proj);
            bracketGroup.add(hijikiX);
          } else if (nx !== 0 && nz !== 0) {
            const cornerHijiki = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 1.5 + b * 0.45), vermilion);
            cornerHijiki.rotation.y = (Math.PI / 4) * (nx * nz);
            cornerHijiki.position.set(px + nx * proj * 0.72, by + 0.10, pz + nz * proj * 0.72);
            bracketGroup.add(cornerHijiki);
          }
        }
      });

      // Perimeter Eave Support Purlin Beam
      const purlin = new THREE.Mesh(new THREE.BoxGeometry(w + 2.8, 0.32, w + 2.8), ebonyWood);
      purlin.position.y = bracketLevels * 0.32 + 0.05;
      bracketGroup.add(purlin);
      pagodaGroup.add(bracketGroup);

      // Flared 4-Sided Roof with Authentic Japanese Sori Curvature (反り)
      const roofSpan = (w + spec.eaveOverhang * 2) * 0.7071;
      const roofH = 2.4 + t * 0.1;
      const roofGeo = new THREE.CylinderGeometry(0.12, roofSpan, roofH, 4, 16);
      roofGeo.rotateY(Math.PI / 4);

      const rPos = roofGeo.attributes.position;
      for (let i = 0; i < rPos.count; i++) {
        const py = rPos.getY(i);
        const yFrac = Math.max(0.0, Math.min(1.0, (py + roofH * 0.5) / roofH)); // 0 at eave edge, 1 at ridge peak
        const hDist = Math.hypot(rPos.getX(i), rPos.getZ(i));

        // Bell flare curvature along roof slopes
        const flare = Math.pow(Math.max(0.0, 1.0 - yFrac), 1.7) * 1.25;
        rPos.setX(i, rPos.getX(i) * (1.0 + flare));
        rPos.setZ(i, rPos.getZ(i) * (1.0 + flare));

        // Dramatic upward corner sweep (Authentic Sori hip tip lift)
        if (yFrac < 0.35 && roofSpan > 0.001) {
          const cornerDist = Math.min(2.0, hDist / roofSpan);
          const soriLift = Math.pow(cornerDist, 2.6) * Math.pow(Math.max(0.0, 1.0 - yFrac / 0.35), 1.4) * (roofH * 0.42);
          if (!isNaN(soriLift) && isFinite(soriLift)) {
            rPos.setY(i, py + soriLift);
          }
        }
      }
      roofGeo.computeVertexNormals();
      if (roofGeo.computeBoundingSphere) roofGeo.computeBoundingSphere();
      if (roofGeo.computeBoundingBox) roofGeo.computeBoundingBox();

      const roofMesh = new THREE.Mesh(roofGeo, slateRoof);
      roofMesh.position.y = ty + h + bracketLevels * 0.32 + roofH * 0.5 + 0.1;
      roofMesh.castShadow = roofMesh.receiveShadow = true;
      pagodaGroup.add(roofMesh);

      // 4 Golden Hip Ridge Caps & Ornamental Onigawara Finials
      const ridgeY = ty + h + bracketLevels * 0.32 + roofH * 0.5 + 0.1;
      for (let c = 0; c < 4; c++) {
        const cAng = (c / 4) * Math.PI * 2 + Math.PI / 4;
        const crad = roofSpan * 1.34;
        const cornerX = Math.cos(cAng) * crad;
        const cornerZ = Math.sin(cAng) * crad;
        const cornerY = ridgeY - roofH * 0.35 + (roofH * 0.28);

        // Golden Hip Ridge line
        const hipPts = [
          new V3(0, ridgeY + roofH * 0.48, 0),
          new V3(cornerX * 0.5, ridgeY + roofH * 0.1, cornerZ * 0.5),
          new V3(cornerX, cornerY, cornerZ)
        ];
        const hipCurve = new THREE.CatmullRomCurve3(hipPts);
        const hipGeo = new THREE.TubeGeometry(hipCurve, 12, 0.18, 6, false);
        const hipMesh = new THREE.Mesh(hipGeo, gold);
        pagodaGroup.add(hipMesh);

        // Gilded Onigawara Demon-Tile / Shibi Finial at Corner Tip
        const onigawara = new THREE.Mesh(new THREE.OctahedronGeometry(0.42, 1), gold);
        onigawara.position.set(cornerX, cornerY + 0.15, cornerZ);
        pagodaGroup.add(onigawara);

        // Hanging Bronze Wind Bell (Furin / Fūtakaku 風鐸) under eave tip
        const bellMesh = new THREE.Mesh(furinGeo, bronze);
        bellMesh.position.set(cornerX * 0.95, cornerY - 0.25, cornerZ * 0.95);
        bellMesh.castShadow = true;
        pagodaGroup.add(bellMesh);
      }

      currentY += h + bracketLevels * 0.32 + roofH * 0.35;
    }

    // 3. Soaring Golden Sōrin Finial Spire (相輪) atop Tier 5
    const sorinGroup = new THREE.Group();
    sorinGroup.position.set(0, currentY + 0.8, 0);

    // Roban (Square tiered base pedestal)
    const roban1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.45, 2.2), gold);
    roban1.position.y = 0.22;
    sorinGroup.add(roban1);

    const roban2 = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.35, 1.7), gold);
    roban2.position.y = 0.62;
    sorinGroup.add(roban2);

    // Fukubachi (Inverted bronze-gold hemisphere bowl)
    const fukubachi = new THREE.Mesh(new THREE.SphereGeometry(0.88, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), gold);
    fukubachi.position.y = 0.80;
    sorinGroup.add(fukubachi);

    // Ukebana (Sacred Lotus Petal Collar)
    const ukebana = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.55, 0.48, 16), gold);
    ukebana.position.y = 1.85;
    sorinGroup.add(ukebana);

