// ============================================================
// ETERNAL VALLEY — Interactive Veo Drone Tour & Photoreal Sanctuary Engine
// Provides interactive 4K video flight over the sanctuary, live spatial radar,
// clickable landmark waypoints, seamless area blending, and interactive plot pins.
// Geographically interwoven: Each underwater realm appears seamlessly following
// its corresponding terrestrial water landmark (Falls -> Plunge Pool,
// Mirror Lake -> Koi Shallows, Kaya Island -> Coral Reef -> Ocean Abyss).
// ============================================================

export const VEO_LANDMARKS = [
  {
    id: 'valley-panorama',
    stage: 0,
    name: 'Eternal Valley Panorama & Horizon',
    districtKey: 'meadows',
    sub: 'Establishing celestial aerial flight revealing the connected sanctuary basin.',
    tStart: 0.0,
    tEnd: 3.5,
    radarX: 0.50,
    radarY: 0.50,
    extImg: 'images/photoreal/veo_valley_panorama_1788571618596.jpg',
    intImg: null,
    extLabel: 'Sanctuary Panorama',
    intLabel: null,
    lore: 'From high above the southern mountain crest, the entirety of Eternal Valley unfolds in unbroken dawn: the Grand Triumphal Gate at the southern threshold, the crystalline Rainbow Bridge curving over the turquoise river, the tiered fountains of Central Plaza, the glacial cataract waterfall thundering into mist, the perched Hohenzollern Universal Cathedral crowned in gold, and across the azure waters, the sentinel bluffs of Kaya Island.',
    plots: ['plot-m-01', 'plot-m-02', 'plot-w-01', 'plot-c-01', 'plot-k-01'],
    videoPlots: [
      {
        id: 'plot-m-01',
        code: 'OV-01',
        title: 'Valley Crest Overlook',
        tier: 'Founder Pinnacle',
        price: 5800,
        status: 'available',
        x: 35,
        y: 55,
        highlight: true
      },
      {
        id: 'plot-c-01',
        code: 'OV-02',
        title: 'Northern Ridge Panorama',
        tier: 'Grand Horizon',
        price: 4900,
        status: 'available',
        x: 68,
        y: 48
      }
    ]
  },
  {
    id: 'grand-gate',
    stage: 1,
    name: 'The Grand Triumphal Gate',
    districtKey: 'meadows',
    sub: 'Monumental southern archway welcoming all souls into paradise.',
    tStart: 3.5,
    tEnd: 7.5,
    radarX: 0.50,
    radarY: 0.88,
    extImg: 'images/photoreal/veo_grand_gate_1788571463630.jpg',
    intImg: 'images/photoreal/veo_closed_gate_1788571951195.jpg',
    extLabel: 'Triumphal Arch',
    intLabel: 'Gilded Portals',
    lore: 'Carved from monolithic white travertine and banded with celestial gold, the Grand Triumphal Gate stands at the southern threshold of Eternal Valley. As souls pass beneath its soaring arch, all earthly sorrow dissolves into radiant peace.',
    plots: ['plot-m-01', 'plot-m-02', 'plot-m-03', 'plot-m-04'],
    videoPlots: [
      {
        id: 'plot-m-01',
        code: 'M-01',
        title: 'Meadow Portal Sanctuary',
        tier: 'Meadow Tier',
        price: 1200,
        status: 'available',
        x: 36,
        y: 64,
        highlight: true
      },
      {
        id: 'plot-m-03',
        code: 'M-03',
        title: 'Travertine Arch Garden',
        tier: 'Heritage',
        price: 1450,
        status: 'available',
        x: 65,
        y: 58
      }
    ]
  },
  {
    id: 'rainbow-bridge',
    stage: 2,
    name: 'The Rainbow Bridge Crest',
    districtKey: 'meadows',
    sub: 'Prismatic crystalline arch spanning the tranquil Rainbow River.',
    tStart: 7.5,
    tEnd: 11.5,
    radarX: 0.50,
    radarY: 0.70,
    extImg: 'images/photoreal/veo_rainbow_bridge_1788571479328.jpg',
    intImg: null,
    extLabel: 'Bridge Skyway',
    intLabel: null,
    lore: 'The legendary Rainbow Bridge arches over the turquoise waters of the valley river. Its luminous surface refracts the eternal dawn, creating iridescent ribbons of light that guide companions home.',
    plots: ['plot-m-05', 'plot-m-06', 'plot-m-07', 'plot-m-08'],
    videoPlots: [
      {
        id: 'plot-m-05',
        code: 'M-05',
        title: 'Rainbow Crest Memorial',
        tier: 'Prismatic Tier',
        price: 2200,
        status: 'available',
        x: 45,
        y: 48,
        highlight: true
      },
      {
        id: 'plot-m-07',
        code: 'M-07',
        title: 'Riverbank Blossom Plot',
        tier: 'Meadow Tier',
        price: 1800,
        status: 'available',
        x: 70,
        y: 66
      }
    ]
  },
  {
    id: 'central-plaza',
    stage: 3,
    name: 'Central Plaza & Living Fountain',
    districtKey: 'meadows',
    sub: 'Heart of the sanctuary with celestial starburst mosaics and tiered cascades.',
    tStart: 11.5,
    tEnd: 15.5,
    radarX: 0.50,
    radarY: 0.52,
    extImg: 'images/photoreal/veo_central_plaza_1788571496051.jpg',
    intImg: null,
    extLabel: 'Plaza Basin',
    intLabel: null,
    lore: 'The gathering crossroads of the sanctuary, where companions run and play in endless sunshine around the tiered lion fountain. Golden mosaic starbursts gleam through crystal water.',
    plots: ['plot-m-09', 'plot-m-10', 'plot-m-11', 'plot-m-12'],
    videoPlots: [
      {
        id: 'plot-m-09',
        code: 'M-09',
        title: 'Star Fountain Garden',
        tier: 'Celestial Tier',
        price: 3000,
        status: 'available',
        x: 42,
        y: 55,
        highlight: true
      },
      {
        id: 'plot-m-11',
        code: 'M-11',
        title: 'Living Promenade Plot',
        tier: 'Piazza Tier',
        price: 2600,
        status: 'available',
        x: 62,
        y: 62
      }
    ]
  },
  {
    id: 'waterfall',
    stage: 4,
    name: 'Great Cataract Waterfall',
    districtKey: 'waterfall',
    sub: '182-meter glacial cascade thundering down the northern granite wall.',
    tStart: 15.5,
    tEnd: 19.5,
    radarX: 0.42,
    radarY: 0.35,
    extImg: 'images/photoreal/veo_waterfall_1788571511375.jpg',
    intImg: 'images/photoreal/veo_underwater_plunge_pool.jpg',
    extLabel: 'Glacial Cataract',
    intLabel: 'Plunge Pool Shallows (UW)',
    lore: 'Fed by ancient alpine snowmelt from the northern peaks, the Great Cataract plunges 182 meters into an effervescent turquoise gorge, casting perpetual rainbow mist before the flight dives directly into the plunge pool.',
    plots: ['plot-w-01', 'plot-w-02', 'plot-w-03', 'plot-w-04'],
    videoPlots: [
      {
        id: 'plot-w-01',
        code: 'W-01',
        title: 'Rainbow Mist Overlook',
        tier: 'Glacial Sanctuary',
        price: 3500,
        status: 'available',
        x: 38,
        y: 50,
        highlight: true
      },
      {
        id: 'plot-w-03',
        code: 'W-03',
        title: 'Cataract Cliff Perch',
        tier: 'Cascades Tier',
        price: 3800,
        status: 'available',
        x: 68,
        y: 44
      }
    ]
  },
  {
    id: 'underwater-plunge-pool',
    stage: 5,
    name: 'Cataract Plunge Pool & Glacial Shallows',
    districtKey: 'waterfall',
    isUnderwater: true,
    sub: 'Drone plunges beneath the cataract into bubbling turquoise pools with swimming trout.',
    tStart: 19.5,
    tEnd: 23.0,
    radarX: 0.43,
    radarY: 0.36,
    extImg: 'images/photoreal/veo_underwater_plunge_pool.jpg',
    intImg: 'images/photoreal/veo_waterfall_1788571511375.jpg',
    extLabel: 'Plunge Pool Shallows',
    intLabel: 'Glacial Waterfall Vista',
    lore: 'Swooping beneath the foaming impact of the 182-meter cataract. Effervescent micro-bubbles illuminate crystalline cold-water shallows, ancient glacial quartz boulders, and cold-water trout resting in celestial waters before ascending to the cathedral.',
    plots: ['plot-w-uw1', 'plot-w-uw2', 'plot-w-01', 'plot-w-02'],
    videoPlots: [
      {
        id: 'plot-w-uw1',
        code: 'UW-W1',
        title: 'Glacial Cataract Crystal Grotto',
        tier: 'Submerged Sanctuary',
        price: 4200,
        status: 'available',
        x: 42,
        y: 58,
        highlight: true
      },
      {
        id: 'plot-w-uw2',
        code: 'UW-W2',
        title: 'Plunge Pool Pebble Vault',
        tier: 'Aquatic Memorial',
        price: 3900,
        status: 'available',
        x: 68,
        y: 64
      }
    ]
  },
  {
    id: 'cathedral',
    stage: 6,
    name: 'Universal Cathedral & Citadel',
    districtKey: 'cathedral',
    sub: 'Camera surges up from the misty gorge to the perched Hohenzollern fortress ramparts.',
    tStart: 23.0,
    tEnd: 27.0,
    radarX: 0.50,
    radarY: 0.20,
    extImg: 'images/photoreal/veo_cathedral_exterior_1788571528669.jpg',
    intImg: 'images/photoreal/veo_cathedral_interior_1788571546191.jpg',
    extLabel: 'Fortress Citadel',
    intLabel: 'Rococo Nave',
    lore: 'Crowning the highest northern granite bluff, the Universal Cathedral combines the towering towers of Hohenzollern with the divine gilded Solomonic marble colonnades and celestial frescoes of Asamkirche.',
    plots: ['plot-c-01', 'plot-c-02', 'plot-c-03', 'plot-c-04'],
    videoPlots: [
      {
        id: 'plot-c-01',
        code: 'C-01',
        title: 'Citadel Solomonic Colonnade',
        tier: 'Cathedral Pinnacle',
        price: 5500,
        status: 'available',
        x: 44,
        y: 46,
        highlight: true
      },
      {
        id: 'plot-c-02',
        code: 'C-02',
        title: 'Hohenzollern Spire Terrace',
        tier: 'Founder Sanctuary',
        price: 6000,
        status: 'available',
        x: 64,
        y: 40
      }
    ]
  },
  {
    id: 'desert-canyon',
    stage: 7,
    name: 'Grand Canyon, Pueblo Kiva & The Phantasm Tree',
    districtKey: 'desert',
    sub: 'Ancient sandstone mesa crowned by the mystical bioluminescent Phantasm Tree.',
    tStart: 27.0,
    tEnd: 31.0,
    radarX: 0.25,
    radarY: 0.40,
    extImg: 'images/photoreal/veo_desert_phantasm_tree.jpg',
    intImg: 'images/photoreal/omni_pueblo_interior_1788572582730.jpg',
    extLabel: 'The Phantasm Tree & Mesa',
    intLabel: 'Ancestral Sun-Kiva',
    lore: 'Rising above the terracotta red-rock amphitheater, the legendary Phantasm Tree blooms atop the highest canyon mesa. Its gnarled silver roots grip the sandstone cliff while glowing crystalline boughs shimmer with ethereal violet and golden light, releasing spirit motes across the desert breeze. Below in the canyon hollow, the stone Ancestral Pueblo Kiva offers eternal peace.',
    plots: ['plot-d-01', 'plot-d-02', 'plot-d-03', 'plot-d-04'],
    videoPlots: [
      {
        id: 'plot-pt-01',
        code: 'PT-01',
        title: 'Phantasm Tree Bough Sanctuary',
        tier: 'Spectral Pinnacle',
        price: 4800,
        status: 'available',
        x: 72,
        y: 45,
        highlight: true
      },
      {
        id: 'plot-d-01',
        code: 'D-01',
        title: 'Sun-Kiva Cliff Chamber',
        tier: 'Canyon Mesa',
        price: 3200,
        status: 'available',
        x: 32,
        y: 68,
        highlight: true
      },
      {
        id: 'plot-d-03',
        code: 'D-03',
        title: 'Sandstone Mesa Vista',
        tier: 'Red Rock Sanctuary',
        price: 2900,
        status: 'available',
        x: 52,
        y: 56
      }
    ]
  },
  {
    id: 'moorish-oasis',
    stage: 8,
    name: 'Moorish Alhambra Oasis',
    districtKey: 'mosque',
    sub: 'Tranquil palace courtyard with reflecting pool, palms, and muqarnas dome.',
    tStart: 31.0,
    tEnd: 35.0,
    radarX: 0.28,
    radarY: 0.58,
    extImg: 'images/photoreal/veo_moorish_oasis_1788571564882.jpg',
    intImg: 'images/photoreal/omni_moorish_interior_1788572556838.jpg',
    extLabel: 'Palace Courtyard',
    intLabel: 'Muqarnas Vault',
    lore: 'An oasis of eternal serenity inspired by the Alhambra. Slender marble colonnades frame a serene reflecting basin lined with date palms, leading to a soaring honeycomb muqarnas dome decorated in lapis lazuli and gold.',
    plots: ['plot-q-01', 'plot-q-02', 'plot-q-03', 'plot-q-04'],
    videoPlots: [
      {
        id: 'plot-q-01',
        code: 'Q-01',
        title: 'Reflecting Pool Arcade',
        tier: 'Oasis Pavilion',
        price: 4200,
        status: 'available',
        x: 42,
        y: 58,
        highlight: true
      },
      {
        id: 'plot-q-02',
        code: 'Q-02',
        title: 'Muqarnas Colonnade',
        tier: 'Alhambra Tier',
        price: 4800,
        status: 'available',
        x: 62,
        y: 50
      }
    ]
  },
  {
    id: 'mirror-lake',
    stage: 9,
    name: 'Mirror Lake Surface & Lotus Basin',
    districtKey: 'lake',
    sub: 'Crystal-clear alpine lake beneath weeping willows before diving into the aquatic realm.',
    tStart: 35.0,
    tEnd: 38.5,
    radarX: 0.70,
    radarY: 0.45,
    extImg: 'images/photoreal/veo_waterfall_lake_1788571971638.jpg',
    intImg: 'images/photoreal/veo_underwater_koi_shallows.jpg',
    extLabel: 'Mirror Waters',
    intLabel: 'Submerged Koi Realm (UW)',
    lore: 'Still, crystalline lake waters reflect the surrounding alpine peaks, weeping willows, and floating water lilies. As the camera glides across the glass-smooth surface, it dips downward to submerge directly into the underwater koi sanctuary.',
    plots: ['plot-l-01', 'plot-l-02', 'plot-l-03', 'plot-l-04'],
    videoPlots: [
      {
        id: 'plot-l-01',
        code: 'L-01',
        title: 'Golden Koi Shallows',
        tier: 'Mirror Waters',
        price: 3600,
        status: 'available',
        x: 36,
        y: 62,
        highlight: true
      },
      {
        id: 'plot-l-03',
        code: 'L-03',
        title: 'Willow Glade Sanctuary',
        tier: 'Lake Sanctuary',
        price: 3400,
        status: 'available',
        x: 65,
        y: 54
      }
    ]
  },
  {
    id: 'underwater-koi',
    stage: 10,
    name: 'Underwater Koi Shallows & Lotus Pedestals',
    districtKey: 'lake',
    isUnderwater: true,
    sub: 'Camera plunges beneath Mirror Lake among shimmering golden koi and submerged marble pedestals.',
    tStart: 38.5,
    tEnd: 42.5,
    radarX: 0.71,
    radarY: 0.46,
    extImg: 'images/photoreal/veo_underwater_koi_shallows.jpg',
    intImg: 'images/photoreal/veo_waterfall_lake_1788571971638.jpg',
    extLabel: 'Underwater Koi Shallows',
    intLabel: 'Lake Surface Reflection',
    lore: 'Gliding beneath the surface of Mirror Lake into an ethereal aquatic sanctuary. Sun shafts filter through the crystal turquoise depth illuminating floating lotus root tendrils, schools of glowing golden koi, and submerged white marble memorial pedestals.',
    plots: ['plot-l-uw1', 'plot-l-uw2', 'plot-l-01', 'plot-l-02'],
    videoPlots: [
      {
        id: 'plot-l-uw1',
        code: 'UW-L1',
        title: 'Sunken Marble Lotus Pedestal',
        tier: 'Aquatic Memorial',
        price: 4400,
        status: 'available',
        x: 32,
        y: 52,
        highlight: true
      },
      {
        id: 'plot-l-uw2',
        code: 'UW-L2',
        title: 'Golden Koi Glade Crypt',
        tier: 'Deep Water Sanctuary',
        price: 4100,
        status: 'available',
        x: 68,
        y: 64
      }
    ]
  },
  {
    id: 'zen-pagoda',
    stage: 11,
    name: 'Five-Tiered Zen Pagoda',
    districtKey: 'pagoda',
    sub: 'Camera surfaces into the tranquil Japanese cedar grove with curved eaves and golden Buddha.',
    tStart: 42.5,
    tEnd: 46.0,
    radarX: 0.75,
    radarY: 0.32,
    extImg: 'images/photoreal/veo_zen_pagoda_1788571581239.jpg',
    intImg: 'images/photoreal/omni_pagoda_interior_1788572569485.jpg',
    extLabel: 'Pagoda Eaves',
    intLabel: 'Buddha Sanctuary',
    lore: 'Rising out of the water onto the eastern forested terrace among blossoming cherry trees, the Five-Tiered Zen Pagoda radiates quiet contemplation. Inside, tatami mats and incense frame a radiant golden Buddha watching over rested spirits.',
    plots: ['plot-p-01', 'plot-p-02', 'plot-p-03', 'plot-p-04'],
    videoPlots: [
      {
        id: 'plot-p-01',
        code: 'P-01',
        title: 'Lotus Terrace Sanctuary',
        tier: 'Zen Sanctuary',
        price: 4500,
        status: 'available',
        x: 42,
        y: 48,
        highlight: true
      },
      {
        id: 'plot-p-03',
        code: 'P-03',
        title: 'Cedar Grove Sanctuary',
        tier: 'Pagoda Tier',
        price: 4200,
        status: 'available',
        x: 64,
        y: 60
      }
    ]
  },
  {
    id: 'kaya-island',
    stage: 12,
    name: 'Kaya Island & Female Siberian Husky Monument',
    districtKey: 'kaya_island',
    sub: 'Offshore coastal headland honoring the guardian spirit of female Siberian Husky Kaya.',
    tStart: 46.0,
    tEnd: 50.5,
    radarX: 0.50,
    radarY: 0.95,
    extImg: 'images/photoreal/veo_kaya_island_husky_statue.jpg',
    intImg: 'images/photoreal/veo_underwater_coral_reef.jpg',
    extLabel: 'Kaya Husky Monument',
    intLabel: 'Submerged Coral Reef (UW)',
    lore: 'An offshore island bathed in turquoise surf and sea spray, honoring the eternal spirit of female Siberian Husky Kaya. Her towering stone and bronze statue stands sentinel over the open southern ocean before the flight dives off the cliffs into the coral reef.',
    plots: ['plot-k-01', 'plot-k-02', 'plot-k-03', 'plot-k-04'],
    videoPlots: [
      {
        id: 'plot-k-01',
        code: 'K-01',
        title: 'Kaya Headland Memorial',
        tier: 'Founder Sanctuary',
        price: 7500,
        status: 'available',
        x: 48,
        y: 38,
        highlight: true
      },
      {
        id: 'plot-k-02',
        code: 'K-02',
        title: 'Ocean Sentinel Bluff',
        tier: 'Celestial Tier',
        price: 6800,
        status: 'available',
        x: 28,
        y: 58
      },
      {
        id: 'plot-k-03',
        code: 'K-03',
        title: 'Turquoise Surf Crest',
        tier: 'Heritage Tier',
        price: 5900,
        status: 'available',
        x: 74,
        y: 52
      }
    ]
  },
  {
    id: 'underwater-coral-reef',
    stage: 13,
    name: 'Sunken Coral Reef Sea Sanctuary',
    districtKey: 'underwater',
    isUnderwater: true,
    sub: 'The drone plunges off the sea cliff into a vibrant turquoise coral reef sanctuary.',
    tStart: 50.5,
    tEnd: 54.5,
    radarX: 0.50,
    radarY: 0.97,
    extImg: 'images/photoreal/veo_underwater_coral_reef.jpg',
    intImg: 'images/photoreal/veo_underwater_abyssal_trench.jpg',
    extLabel: 'Coral Reef Lagoon',
    intLabel: 'Abyssal Descent (UW)',
    lore: 'Just off the southern headland of Kaya Island, the crystal-clear ocean drops into a magnificent turquoise marine preserve. Intricate coral formations, luminous crystal memorial obelisks, swimming green sea turtles, and colorful reef fish celebrate water-loving companions in perpetual harmony.',
    plots: ['plot-k-uw1', 'plot-k-uw2', 'plot-k-uw3'],
    videoPlots: [
      {
        id: 'plot-k-uw1',
        code: 'UW-K1',
        title: 'Turquoise Coral Garden Vault',
        tier: 'Marine Sanctuary',
        price: 5200,
        status: 'available',
        x: 38,
        y: 62,
        highlight: true
      },
      {
        id: 'plot-k-uw2',
        code: 'UW-K2',
        title: 'Crystal Reef Obelisk',
        tier: 'Oceanic Tier',
        price: 4900,
        status: 'available',
        x: 65,
        y: 50
      }
    ]
  },
  {
    id: 'underwater-abyss',
    stage: 14,
    name: 'Oceanic Abyssal Trench & Bioluminescent Vaults',
    districtKey: 'underwater',
    isUnderwater: true,
    sub: 'Deep oceanic abyss illuminated by bioluminescent sea creatures and sunken crystal spires.',
    tStart: 54.5,
    tEnd: 60.0,
    radarX: 0.50,
    radarY: 0.99,
    extImg: 'images/photoreal/veo_underwater_abyssal_trench.jpg',
    intImg: 'images/photoreal/veo_underwater_coral_reef.jpg',
    extLabel: 'Abyssal Trench',
    intLabel: 'Shallow Coral Reef (UW)',
    lore: 'Descending into the deep sapphire abyss off the southern continental shelf. Bioluminescent dolphins and giant manta rays glide through ancient volcanic spires crowned with radiant cyan crystals, holding the deepest eternal memories of the sanctuary.',
    plots: ['plot-k-uw4', 'plot-k-uw5'],
    videoPlots: [
      {
        id: 'plot-k-uw4',
        code: 'UW-K4',
        title: 'Bioluminescent Abyss Vault',
        tier: 'Abyssal Pinnacle',
        price: 6500,
        status: 'available',
        x: 44,
        y: 56,
        highlight: true
      },
      {
        id: 'plot-k-uw5',
        code: 'UW-K5',
        title: 'Deep Ocean Crystal Spire',
        tier: 'Abyssal Tier',
        price: 5800,
        status: 'available',
        x: 72,
        y: 48
      }
    ]
  }
];

class VeoTourController {
  constructor() {
    this.container = null;
    this.video = null;
    this.radarCanvas = null;
    this.radarCtx = null;
    this.activeStage = VEO_LANDMARKS[0];
    this.isPlaying = false;
    this.isMuted = true;
    this.currentViewMode = 'exterior';
    this.activeInspectionLandmark = null;
    this._rafId = null;
    this._initialized = false;
    this._renderedStageId = null;
  }

  init() {
    if (this._initialized) return;
    this.container = document.getElementById('veoDroneTourContainer');
    this.video = document.getElementById('veoDroneTourVideo');
    this.radarCanvas = document.getElementById('veoRadarCanvas');
    if (this.radarCanvas) {
      this.radarCtx = this.radarCanvas.getContext('2d');
    }

    if (!this.container || !this.video) {
      console.warn('[VeoTourController] DOM elements not ready, deferred.');
      return;
    }

    this._bindVideoEvents();
    this._bindOverlayEvents();
    this._drawRadar(0.0);
    this._updateVideoPlots(this.activeStage);
    this._initialized = true;
    console.log('[VeoTourController] Initialized successfully with 15 geographically interwoven land-and-water stages.');
  }

  _bindVideoEvents() {
    if (!this.video) return;

    this.video.addEventListener('timeupdate', () => {
      const t = this.video.currentTime;
      this._updateProgress(t);
      this._updateActiveStage(t);
      this._updateVideoPlots(this.activeStage);
      this._drawRadar(t / (this.video.duration || 60.0));
    });

    this.video.addEventListener('play', () => {
      this.isPlaying = true;
      this._updatePlayButton(true);
    });

    this.video.addEventListener('pause', () => {
      this.isPlaying = false;
      this._updatePlayButton(false);
    });

    this.video.addEventListener('ended', () => {
      this.video.currentTime = 0;
      this.video.play().catch(() => {});
    });
  }

  _bindOverlayEvents() {
    const clickSurface = document.getElementById('veoClickSurface');
    if (clickSurface) {
      clickSurface.addEventListener('click', (e) => {
        if (
          e.target.closest('#veoFlightControls') ||
          e.target.closest('#veoValleyRadar') ||
          e.target.closest('.veo-plot-pin') ||
          e.target.closest('.veo-no-click')
        ) {
          return;
        }
        this.openAreaInspection(this.activeStage.id);
      });
    }

    const playBtn = document.getElementById('veoPlayBtn');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePlay();
      });
    }

    const soundBtn = document.getElementById('veoSoundBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMute();
      });
    }

    const exitBtn = document.getElementById('veoExitBtn');
    if (exitBtn) {
      exitBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.exitTourTo3D();
      });
    }

    const switch3dBtn = document.getElementById('veoSwitch3dBtn');
    if (switch3dBtn) {
      switch3dBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.exitTourTo3D();
      });
    }

    const mapBtn = document.getElementById('veoOpenMapBtn');
    if (mapBtn) {
      mapBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.UI && typeof window.UI.show2D === 'function') {
          window.UI.show2D();
        }
      });
    }

    const v2dTourBtn = document.getElementById('view2dReturnTourBtn');
    if (v2dTourBtn) {
      v2dTourBtn.addEventListener('click', () => {
        if (window.UI && typeof window.UI.startDroneTour === 'function') {
          window.UI.startDroneTour(this.activeStage?.stage || 0);
        }
      });
    }

    const v2d3dBtn = document.getElementById('view2dReturn3dBtn');
    if (v2d3dBtn) {
      v2d3dBtn.addEventListener('click', () => {
        if (window.UI && typeof window.UI.show3D === 'function') {
          window.UI.show3D();
        }
      });
    }

    const scrubBar = document.getElementById('veoScrubBar');
    if (scrubBar) {
      scrubBar.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = scrubBar.getBoundingClientRect();
        const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const targetTime = frac * (this.video.duration || 60.0);
        this.video.currentTime = targetTime;
        if (!this.isPlaying) this.video.play().catch(() => {});
      });
    }

    const pillsContainer = document.getElementById('veoLandmarkPills');
    if (pillsContainer) {
      pillsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.veo-landmark-pill');
        if (!btn) return;
        e.stopPropagation();
        const id = btn.dataset.landmarkId;
        this.jumpToLandmark(id);
      });
    }

    const modalClose = document.getElementById('veoModalClose');
    if (modalClose) {
      modalClose.addEventListener('click', () => this.closeAreaInspection());
    }

    const modalBackdrop = document.getElementById('veoModalBackdrop');
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', () => this.closeAreaInspection());
    }

    const modalResume = document.getElementById('veoModalResumeTour');
    if (modalResume) {
      modalResume.addEventListener('click', () => {
        this.closeAreaInspection();
        this.video.play().catch(() => {});
      });
    }

    const modal3d = document.getElementById('veoModalExplore3d');
    if (modal3d) {
      modal3d.addEventListener('click', () => {
        const lm = this.activeInspectionLandmark || this.activeStage;
        this.closeAreaInspection();
        this.exitTourTo3D(lm.districtKey);
      });
    }

    const viewExtBtn = document.getElementById('veoToggleExterior');
    const viewIntBtn = document.getElementById('veoToggleInterior');
    if (viewExtBtn && viewIntBtn) {
      viewExtBtn.addEventListener('click', () => this.setModalView('exterior'));
      viewIntBtn.addEventListener('click', () => this.setModalView('interior'));
    }
  }

  start(stageIdOrIndex = 0) {
    if (!this._initialized) this.init();
    if (!this.container || !this.video) {
      this.container = document.getElementById('veoDroneTourContainer');
      this.video = document.getElementById('veoDroneTourVideo');
      if (!this._initialized && this.container && this.video) this.init();
    }
    if (!this.container || !this.video) return;

    const stage = document.getElementById('stage');
    if (stage) {
      stage.classList.remove('hidden');
      stage.classList.add('is-active');
    }
    const view3d = document.getElementById('view3d');
    if (view3d) {
      view3d.classList.remove('hidden');
      view3d.classList.add('is-active');
    }

    this.container.classList.remove('hidden');
    this.container.classList.add('is-active');
    this.container.style.display = 'block';

    let targetTime = 0.0;
    if (typeof stageIdOrIndex === 'number' && VEO_LANDMARKS[stageIdOrIndex]) {
      targetTime = VEO_LANDMARKS[stageIdOrIndex].tStart;
      this.activeStage = VEO_LANDMARKS[stageIdOrIndex];
    } else if (typeof stageIdOrIndex === 'string') {
      const found = VEO_LANDMARKS.find(l => l.id === stageIdOrIndex || l.districtKey === stageIdOrIndex);
      if (found) {
        targetTime = found.tStart;
        this.activeStage = found;
      }
    }

    this.video.currentTime = targetTime;
    this._updateHUD(this.activeStage);
    this._updateVideoPlots(this.activeStage);

    const playPromise = this.video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this._updatePlayButton(true);
        })
        .catch(err => {
          console.warn('[VeoTourController] Autoplay prevented, waiting for user click:', err);
          this.isPlaying = false;
          this._updatePlayButton(false);
        });
    }

    const topBtn = document.getElementById('btnDroneTour');
    if (topBtn) {
      document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
      topBtn.classList.add('active');
    }
  }

  stop() {
    if (!this.container || !this.video) return;
    this.video.pause();
    this.isPlaying = false;
    this._updatePlayButton(false);
    this.container.classList.add('hidden');
    this.container.classList.remove('is-active');
    this.container.style.display = 'none';
    this.closeAreaInspection();
    this._renderedStageId = null;
    const overlay = document.getElementById('veoVideoPlotsOverlay');
    if (overlay) overlay.innerHTML = '';
  }

  togglePlay() {
    if (!this.video) return;
    if (this.video.paused) {
      this.video.play().catch(() => {});
    } else {
      this.video.pause();
    }
  }

  toggleMute() {
    if (!this.video) return;
    this.isMuted = !this.isMuted;
    this.video.muted = this.isMuted;
    const soundBtn = document.getElementById('veoSoundBtn');
    if (soundBtn) {
      soundBtn.innerHTML = this.isMuted 
        ? '<span class="veo-icon">🔇</span>' 
        : '<span class="veo-icon">🔊</span>';
      soundBtn.title = this.isMuted ? 'Unmute Audio' : 'Mute Audio';
    }
  }

  jumpToLandmark(landmarkId) {
    const lm = VEO_LANDMARKS.find(l => l.id === landmarkId || l.districtKey === landmarkId);
    if (!lm || !this.video) return;
    this.video.currentTime = lm.tStart + 0.05;
    this._updateVideoPlots(lm);
    if (this.video.paused) this.video.play().catch(() => {});
  }

  jumpToStage(stageIndex) {
    const lm = VEO_LANDMARKS.find(l => l.stage === stageIndex);
    if (!lm || !this.video) return;
    this.video.currentTime = lm.tStart + 0.05;
    this._updateVideoPlots(lm);
    if (this.video.paused) this.video.play().catch(() => {});
  }

  exitTourTo3D(districtKey = null) {
    this.stop();
    if (window.UI?.show3D) {
      window.UI.show3D('orbit');
      if (districtKey && window.world?.flyToDistrict) {
        setTimeout(() => {
          window.world.flyToDistrict(districtKey);
        }, 300);
      }
    }
  }

  _updatePlayButton(isPlaying) {
    const playBtn = document.getElementById('veoPlayBtn');
    if (playBtn) {
      playBtn.innerHTML = isPlaying 
        ? '<span class="veo-icon">⏸</span>' 
        : '<span class="veo-icon">▶</span>';
      playBtn.title = isPlaying ? 'Pause Tour' : 'Resume Tour';
    }
  }

  _updateProgress(currentTime) {
    const total = this.video.duration || 60.0;
    const pct = Math.max(0, Math.min(100, (currentTime / total) * 100));

    const fill = document.getElementById('veoScrubFill');
    if (fill) fill.style.width = `${pct}%`;

    const timeText = document.getElementById('veoTimeText');
    if (timeText) {
      const curM = Math.floor(currentTime / 60);
      const curS = Math.floor(currentTime % 60).toString().padStart(2, '0');
      const totM = Math.floor(total / 60);
      const totS = Math.floor(total % 60).toString().padStart(2, '0');
      timeText.textContent = `${curM}:${curS} / ${totM}:${totS}`;
    }
  }

  _updateActiveStage(t) {
    let matched = VEO_LANDMARKS[0];
    for (let i = 0; i < VEO_LANDMARKS.length; i++) {
      const lm = VEO_LANDMARKS[i];
      if (t >= lm.tStart && (t < lm.tEnd || i === VEO_LANDMARKS.length - 1)) {
        matched = lm;
        break;
      }
    }

    if (this.activeStage.id !== matched.id) {
      this.activeStage = matched;
      this._updateHUD(matched);
      this._updateVideoPlots(matched);
    }
  }

  _updateHUD(lm) {
    const badge = document.getElementById('veoBeaconBadge');
    if (badge) {
      const stageStr = lm.stage === 0 
        ? 'SANCTUARY OVERVIEW' 
        : (lm.isUnderwater ? `UNDERWATER REALM · STAGE ${lm.stage}/14` : `STAGE ${lm.stage}/14`);
      badge.innerHTML = `
        <div class="veo-beacon-pill ${lm.isUnderwater ? 'is-underwater' : ''}">
          <span class="veo-beacon-dot ${lm.isUnderwater ? 'dot-uw' : ''}"></span>
          <span class="veo-beacon-stage">${stageStr}</span>
          <span class="veo-beacon-title">${lm.name}</span>
        </div>
        <div class="veo-beacon-hint">✦ Click video or plot pins to inspect 4K vision & reserve plots</div>
      `;
    }

    document.querySelectorAll('.veo-landmark-pill').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.landmarkId === lm.id);
    });
  }

  _updateVideoPlots(currentStage) {
    const overlay = document.getElementById('veoVideoPlotsOverlay');
    if (!overlay) return;

    if (this._renderedStageId === currentStage.id) return;
    this._renderedStageId = currentStage.id;

    overlay.innerHTML = '';
    const plots = currentStage.videoPlots || [];
    if (plots.length === 0) return;

    plots.forEach(plot => {
      const pin = document.createElement('div');
      pin.className = `veo-plot-pin ${plot.highlight ? 'is-highlight' : ''} ${currentStage.isUnderwater ? 'is-uw-pin' : ''}`;
      pin.style.left = `${plot.x}%`;
      pin.style.top = `${plot.y}%`;
      pin.setAttribute('data-plot-id', plot.id);
      pin.setAttribute('role', 'button');
      pin.setAttribute('tabindex', '0');
      pin.setAttribute('aria-label', `Plot ${plot.code}: ${plot.title}, $${plot.price}`);

      pin.innerHTML = `
        <div class="veo-pin-beacon">
          <span class="veo-pin-core"></span>
          <span class="veo-pin-ripple"></span>
          <span class="veo-pin-ripple delay"></span>
        </div>
        <div class="veo-pin-card">
          <div class="vpc-top">
            <span class="vpc-code">PLOT ${plot.code}</span>
            <span class="vpc-tier">${plot.tier || 'Sanctuary'}</span>
          </div>
          <div class="vpc-title">${plot.title}</div>
          <div class="vpc-bottom">
            <span class="vpc-price">$${plot.price.toLocaleString()}</span>
            <span class="vpc-cta">Inspect & Reserve →</span>
          </div>
        </div>
      `;

      const triggerPlot = (e) => {
        e.stopPropagation();
        this.openAreaInspection(currentStage.id, plot.id);
      };

      pin.addEventListener('click', triggerPlot);
      pin.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerPlot(e);
        }
      });

      overlay.appendChild(pin);
    });
  }

  _drawRadar(normProgress) {
    if (!this.radarCtx || !this.radarCanvas) return;
    const ctx = this.radarCtx;
    const w = this.radarCanvas.width;
    const h = this.radarCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Radar Circular Border & Grid
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(10, 14, 18, 0.75)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Concentric sweep rings
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, (w / 2 - 4) * 0.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(w / 2, 4);
    ctx.lineTo(w / 2, h - 4);
    ctx.moveTo(4, h / 2);
    ctx.lineTo(w - 4, h / 2);
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
    ctx.stroke();
    ctx.restore();

    // 2. Continuous Topographical Flight River & Path
    ctx.save();
    ctx.beginPath();
    const pts = [
      { x: 0.50, y: 0.50 }, // 0. Overview
      { x: 0.50, y: 0.88 }, // 1. Grand Gate
      { x: 0.50, y: 0.70 }, // 2. Rainbow Bridge
      { x: 0.50, y: 0.52 }, // 3. Central Plaza
      { x: 0.42, y: 0.35 }, // 4. Waterfall
      { x: 0.43, y: 0.36 }, // 5. Plunge Pool Shallows (UW)
      { x: 0.50, y: 0.20 }, // 6. Cathedral
      { x: 0.25, y: 0.40 }, // 7. Canyon
      { x: 0.28, y: 0.58 }, // 8. Moorish Oasis
      { x: 0.70, y: 0.45 }, // 9. Mirror Lake Surface
      { x: 0.71, y: 0.46 }, // 10. Koi Shallows (UW)
      { x: 0.75, y: 0.32 }, // 11. Zen Pagoda
      { x: 0.50, y: 0.95 }, // 12. Kaya Island
      { x: 0.50, y: 0.97 }, // 13. Coral Reef (UW)
      { x: 0.50, y: 0.99 }, // 14. Abyssal Trench (UW)
    ];

    ctx.moveTo(pts[0].x * w, pts[0].y * h);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x * w, pts[i].y * h);
    }
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.28)';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // 3. Landmark Nodes on Radar
    VEO_LANDMARKS.forEach((lm) => {
      const lx = lm.radarX * w;
      const ly = lm.radarY * h;
      const isCur = lm.id === this.activeStage.id;

      ctx.beginPath();
      ctx.arc(lx, ly, isCur ? 4 : 2, 0, Math.PI * 2);
      ctx.fillStyle = isCur 
        ? (lm.isUnderwater ? '#38d9d2' : '#e8c04a') 
        : (lm.isUnderwater ? 'rgba(56, 217, 210, 0.55)' : 'rgba(255, 255, 255, 0.45)');
      ctx.fill();

      if (isCur) {
        ctx.beginPath();
        ctx.arc(lx, ly, 7, 0, Math.PI * 2);
        ctx.strokeStyle = lm.isUnderwater ? 'rgba(56, 217, 210, 0.65)' : 'rgba(232, 192, 74, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // 4. Smooth Interpolated Live Drone Position
    const totalDuration = this.video.duration || 60.0;
    const curTime = normProgress * totalDuration;
    
    let activeIdx = 0;
    for (let i = 0; i < VEO_LANDMARKS.length; i++) {
      if (curTime >= VEO_LANDMARKS[i].tStart && (curTime <= VEO_LANDMARKS[i].tEnd || i === VEO_LANDMARKS.length - 1)) {
        activeIdx = i;
        break;
      }
    }
    const currentLM = VEO_LANDMARKS[activeIdx];
    const span = Math.max(0.01, currentLM.tEnd - currentLM.tStart);
    const stageFrac = Math.max(0, Math.min(1, (curTime - currentLM.tStart) / span));

    const p1 = pts[Math.min(pts.length - 1, activeIdx)];
    const p2 = pts[Math.min(pts.length - 1, activeIdx + 1)];
    const curX = (p1.x + (p2.x - p1.x) * stageFrac) * w;
    const curY = (p1.y + (p2.y - p1.y) * stageFrac) * h;

    // Glowing Drone Pip
    ctx.save();
    const isUW = currentLM.isUnderwater;
    const grad = ctx.createRadialGradient(curX, curY, 0, curX, curY, 12);
    grad.addColorStop(0, isUW ? 'rgba(200, 255, 250, 0.95)' : 'rgba(255, 240, 160, 0.9)');
    grad.addColorStop(0.4, isUW ? 'rgba(56, 217, 210, 0.65)' : 'rgba(232, 192, 74, 0.6)');
    grad.addColorStop(1, isUW ? 'rgba(56, 217, 210, 0)' : 'rgba(232, 192, 74, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(curX, curY, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  openAreaInspection(landmarkOrDistrictId, targetPlotId = null) {
    const lm = VEO_LANDMARKS.find(l => l.id === landmarkOrDistrictId || l.districtKey === landmarkOrDistrictId) || this.activeStage;
    this.activeInspectionLandmark = lm;
    this.currentViewMode = 'exterior';

    if (this.video && !this.video.paused) {
      this.video.pause();
    }

    const modal = document.getElementById('veoAreaInspectionModal');
    if (!modal) return;

    const imgEl = document.getElementById('veoModalHeroImg');
    if (imgEl) {
      imgEl.src = lm.extImg;
      imgEl.alt = lm.name;
    }

    const titleEl = document.getElementById('veoModalTitle');
    if (titleEl) titleEl.textContent = lm.name;

    const subEl = document.getElementById('veoModalSub');
    if (subEl) {
      subEl.textContent = `${lm.sub} · District: ${lm.districtKey.toUpperCase()}${lm.isUnderwater ? ' · AQUATIC REALM' : ''}`;
    }

    const loreEl = document.getElementById('veoModalLore');
    if (loreEl) loreEl.textContent = lm.lore;

    const toggleContainer = document.getElementById('veoModalViewToggle');
    const viewExtBtn = document.getElementById('veoToggleExterior');
    const viewIntBtn = document.getElementById('veoToggleInterior');

    if (lm.intImg) {
      if (toggleContainer) toggleContainer.style.display = 'flex';
      if (viewExtBtn) viewExtBtn.textContent = lm.extLabel || 'Primary Architecture';
      if (viewIntBtn) viewIntBtn.textContent = lm.intLabel || 'Submerged/Interior View';
      this.setModalView('exterior');
    } else {
      if (toggleContainer) toggleContainer.style.display = 'none';
    }

    this._populateModalPlots(lm, targetPlotId);

    modal.classList.remove('hidden');
    modal.classList.add('is-active');
  }

  setModalView(mode) {
    this.currentViewMode = mode;
    const lm = this.activeInspectionLandmark;
    if (!lm) return;

    const imgEl = document.getElementById('veoModalHeroImg');
    const viewExtBtn = document.getElementById('veoToggleExterior');
    const viewIntBtn = document.getElementById('veoToggleInterior');

    if (imgEl) {
      imgEl.style.opacity = '0.3';
      setTimeout(() => {
        imgEl.src = (mode === 'interior' && lm.intImg) ? lm.intImg : lm.extImg;
        imgEl.style.opacity = '1';
      }, 150);
    }

    if (viewExtBtn) viewExtBtn.classList.toggle('is-active', mode === 'exterior');
    if (viewIntBtn) viewIntBtn.classList.toggle('is-active', mode === 'interior');
  }

  _populateModalPlots(lm, targetPlotId = null) {
    const listContainer = document.getElementById('veoModalPlotsList');
    if (!listContainer) return;

    const allPlots = window.plots || window.UI?.plots || window.world?.plots || [];
    let districtPlots = [];
    if (lm.isUnderwater || lm.districtKey === 'underwater') {
      districtPlots = allPlots.filter(p => p.district === 'underwater' || (p.id && p.id.includes('UW')));
    } else {
      districtPlots = allPlots.filter(p => p.district === lm.districtKey);
    }
    districtPlots = districtPlots.slice(0, 6);

    if (targetPlotId) {
      const targetP = allPlots.find(p => p.id === targetPlotId);
      if (targetP && !districtPlots.some(p => p.id === targetPlotId)) {
        districtPlots.unshift(targetP);
      }
    }

    if (districtPlots.length === 0) {
      if (lm.isUnderwater) {
        districtPlots = [
          {
            id: `${lm.id}-01`,
            code: `UW-${lm.stage}A`,
            title: `${lm.name.split('&')[0].trim()} Vault`,
            tier: 'Aquatic Memorial',
            district: 'underwater',
            status: 'available',
            price: 4900,
            epitaph: 'Resting in eternal bioluminescent turquoise peace.'
          },
          {
            id: `${lm.id}-02`,
            code: `UW-${lm.stage}B`,
            title: 'Sunken Crystal Spire Sanctum',
            tier: 'Deep Marine Sanctum',
            district: 'underwater',
            status: 'available',
            price: 5500,
            epitaph: 'Cradled in crystal coral gardens and swimming mantas.'
          }
        ];
      } else {
        districtPlots = (lm.plots || []).map((pid, idx) => ({
          id: pid,
          code: pid.toUpperCase(),
          title: `${lm.name} Memorial Garden ${idx + 1}`,
          tier: idx === 0 ? 'Founder Pinnacle' : 'Celestial Tier',
          district: lm.districtKey,
          status: 'available',
          price: 2500 + idx * 750,
          epitaph: 'An eternal resting sanctuary honoring unbroken love.'
        }));
      }
    }

    listContainer.innerHTML = '';
    districtPlots.forEach(plot => {
      const isTarget = targetPlotId && plot.id === targetPlotId;
      const card = document.createElement('div');
      card.className = `veo-plot-card ${isTarget ? 'is-target' : ''}`;
      card.innerHTML = `
        <div class="vpc-card-header">
          <span class="vpc-card-badge">${plot.tier || 'Sanctuary'}</span>
          <span class="vpc-card-status status-${plot.status || 'available'}">${(plot.status || 'available').toUpperCase()}</span>
        </div>
        <div class="vpc-card-title">${plot.title || plot.name || `Memorial Plot ${plot.code}`}</div>
        <div class="vpc-card-epitaph">"${plot.epitaph || 'Somewhere over the rainbow bridge.'}"</div>
        <div class="vpc-card-footer">
          <span class="vpc-card-price">$${(plot.price || 2500).toLocaleString()}</span>
          <button class="btn btn-sm btn-gold vpc-reserve-btn" data-plot-id="${plot.id}">
            Reserve Plot →
          </button>
        </div>
      `;

      const reserveBtn = card.querySelector('.vpc-reserve-btn');
      if (reserveBtn) {
        reserveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.reservePlot(plot);
        });
      }

      listContainer.appendChild(card);
    });
  }

  reservePlot(plot) {
    this.closeAreaInspection();
    if (window.UI && typeof window.UI.openConsecrateModal === 'function') {
      window.UI.openConsecrateModal(plot);
    } else if (window.UI && typeof window.UI.showPurchaseModal === 'function') {
      window.UI.showPurchaseModal(plot);
    } else {
      alert(`Plot Reservation Initialized for ${plot.title || plot.code} ($${plot.price}). Connecting to consecration gateway...`);
    }
  }

  closeAreaInspection() {
    const modal = document.getElementById('veoAreaInspectionModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('is-active');
    }
    this.activeInspectionLandmark = null;
  }
}

export const veoTourController = new VeoTourController();
export const veoTour = veoTourController;
export const VeoTour = veoTourController;
if (typeof window !== 'undefined') {
  window.veoTourController = veoTourController;
  window.veoTour = veoTourController;
  window.VeoTourController = veoTourController;
}
