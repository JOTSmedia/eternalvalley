import{e as Rt,f as $e,g as Se,h as pe,i as le,j as vt,k as tt,l as ze,m as at,n as it,o as re,q as zt,r as Ut,s as ot,t as Ht,v as ke}from"./chunk-O75ZMO5F.js";import{a as ft,b as Ue,c as h,d as ce,e as qt,f as Ot}from"./chunk-GRVASKCC.js";import{b as bt}from"./chunk-OOIXSXKS.js";import{k as F,n as Ne,o as Dt,p as Xe,r as Gt}from"./chunk-GKL6NJTQ.js";import{a as Nt,b as R,c as se,d as W,e as qe,f as fe,h as Be,i as we,j as T,k as Oe,l as ne,m as V}from"./chunk-LBPPFFK4.js";import{a as Qe,b as yt,c as Ze,e as O,f as ie,g as et}from"./chunk-JRTNOIIK.js";import{a as J,d as wt,e as Le}from"./chunk-RQB3YHCE.js";var Ae=null,Ft=null,Ee=null;async function xe(){if(Ae&&Ee)return{auth:Ae,mod:Ee};let e=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");return Ee=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"),Ft=e.getApps().length?e.getApp():e.initializeApp(Qe),Ae=Ee.getAuth(Ft),{auth:Ae,mod:Ee}}var y={initialized:!1,user:null,listeners:new Set,onChange(e){return this.listeners.add(e),e(this.user),()=>this.listeners.delete(e)},offChange(e){this.listeners.delete(e)},_emit(){this.initialized=!0,this.listeners.forEach(e=>e(this.user))},async init(){if(ie){this.user={uid:"admin",name:"Admin",email:null,provider:"admin",isGuest:!1,isAdmin:!0},this._emit();return}if(O){try{let e=localStorage.getItem("ev_user");this.user=e?JSON.parse(e):null}catch{this.user=null}this._emit();return}try{let{auth:e,mod:t}=await xe();t.onAuthStateChanged(e,a=>{if(a){let i=a.providerData[0]?.providerId||"password";this.user={uid:a.uid,name:a.displayName||a.email?.split("@")[0],email:a.email,provider:i,isGuest:!1},window.USER=this.user;try{localStorage.setItem("ev_user",JSON.stringify(this.user))}catch(o){console.warn("[auth] QuotaExceededError on ev_user setItem",o)}}else this.user=null,window.USER=null,localStorage.removeItem("ev_user");this._emit()})}catch(e){console.log("[auth] firebase init failed, falling back to local user:",e);try{let t=localStorage.getItem("ev_user");this.user=t?JSON.parse(t):null}catch{this.user=null}this._emit()}},async signUpEmail(e,t,a){if(O)return this._demoLogin(e||t.split("@")[0],t,"email");let{auth:i,mod:o}=await xe(),n=await o.createUserWithEmailAndPassword(i,t,a);if(e&&(await o.updateProfile(n.user,{displayName:e}),this.user&&this.user.uid===n.user.uid)){this.user.name=e,window.USER=this.user;try{localStorage.setItem("ev_user",JSON.stringify(this.user))}catch(s){console.warn("[auth] QuotaExceededError on ev_user setItem",s)}this._emit()}},async signInEmail(e,t){if(O)return this._demoLogin(e.split("@")[0],e,"email");let{auth:a,mod:i}=await xe();await i.signInWithEmailAndPassword(a,e,t)},async signInGoogle(){if(O)return this._demoLogin("Test User (Google)","you@gmail.com","google");let{auth:e,mod:t}=await xe();await t.signInWithPopup(e,new t.GoogleAuthProvider)},async signInFacebook(){if(O)return this._demoLogin("Test User (Facebook)","you@facebook.com","facebook");let{auth:e,mod:t}=await xe();await t.signInWithPopup(e,new t.FacebookAuthProvider)},async signInApple(){if(O)return this._demoLogin("Test User (Apple)","you@icloud.com","apple");let{auth:e,mod:t}=await xe(),a=new t.OAuthProvider("apple.com");a.addScope("email"),a.addScope("name"),await t.signInWithPopup(e,a)},async signInTwitter(){if(O)return this._demoLogin("Test User (X)","you@x.com","twitter");let{auth:e,mod:t}=await xe();await t.signInWithPopup(e,new t.TwitterAuthProvider)},continueAsGuest(e=!0,t=""){let a=typeof crypto<"u"&&crypto.randomUUID?crypto.randomUUID().slice(0,8):Math.random().toString(36).slice(2,9);this.user={uid:"guest_"+a,name:e?"Anonymous Visitor":t||"Visitor",email:null,provider:"guest",isGuest:!0},window.USER=this.user;try{localStorage.setItem("ev_user",JSON.stringify(this.user))}catch(i){console.warn("[auth] QuotaExceededError on ev_user setItem in guest mode",i)}this._emit()},async signOut(){!O&&Ae&&Ee&&await Ee.signOut(Ae),this.user=null,window.USER=null,localStorage.removeItem("ev_user"),localStorage.removeItem("ev_state_v1"),this._emit()},_demoLogin(e,t,a){this.user={uid:"demo_"+a+"_"+t,name:e,email:t,provider:a,isGuest:!1},window.USER=this.user;try{localStorage.setItem("ev_user",JSON.stringify(this.user))}catch(i){console.warn("[auth] QuotaExceededError on ev_user setItem in demo login",i)}this._emit()}};var st=null,De=null,Me="ev_state_v1",v={data:{membership:null,ownedPlots:{},gifts:{},earth:{memorials:[],activity:[]},memories:{},profile:{},charity:null,socials:{}},async init(e){if(O||!e||e.isGuest){try{let t=localStorage.getItem(Me);if(t){let a=null;try{a=JSON.parse(t)}catch(i){console.warn("[state] JSON.parse corrupted, resetting local state:",i),a=null}a&&typeof a=="object"&&(this.data={membership:a.membership||null,ownedPlots:a.ownedPlots||{},gifts:a.gifts||{},earth:a.earth||{memorials:[],activity:[]},memories:a.memories||{},profile:a.profile||{},charity:a.charity||null,socials:a.socials||{}})}}catch(t){console.log("[state] load failed",t)}return}try{let t=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");De=await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js");let a=t.getApps().length?t.getApp():t.initializeApp(Qe);st=De.getFirestore(a);let i=await De.getDoc(De.doc(st,"users",e.uid));if(i.exists()){let o=i.data();this.data={membership:o.membership||this.data.membership,ownedPlots:o.ownedPlots||this.data.ownedPlots,gifts:o.gifts||this.data.gifts,earth:o.earth||this.data.earth||{memorials:[],activity:[]},memories:o.memories||this.data.memories||{},profile:o.profile||this.data.profile||{},charity:o.charity||this.data.charity||null,socials:o.socials||this.data.socials||{}};try{localStorage.setItem(Me,JSON.stringify(this.data))}catch{}}else{let o=localStorage.getItem(Me);if(o){let n=JSON.parse(o);n&&typeof n=="object"&&(this.data={membership:n.membership||null,ownedPlots:n.ownedPlots||{},gifts:n.gifts||{},earth:n.earth||{memorials:[],activity:[]},memories:n.memories||{},profile:n.profile||{},charity:n.charity||null,socials:n.socials||{}})}}}catch(t){console.log("[state] firebase init failed, falling back to localStorage",t);try{let a=localStorage.getItem(Me);if(a){let i=null;try{i=JSON.parse(a)}catch(o){console.warn("[state] JSON.parse corrupted (firebase error), resetting local state:",o),i=null}i&&typeof i=="object"&&(this.data={membership:i.membership||null,ownedPlots:i.ownedPlots||{},gifts:i.gifts||{},earth:i.earth||{memorials:[],activity:[]},memories:i.memories||{},profile:i.profile||{},charity:i.charity||null,socials:i.socials||{}})}}catch(a){console.log("[state] localStorage fallback also failed",a)}}},_saveTimeout:null,async save(e,t=!1){let a=async()=>{try{localStorage.setItem(Me,JSON.stringify(this.data))}catch(i){if(i?.name==="QuotaExceededError"||i?.name==="NS_ERROR_DOM_QUOTA_REACHED"||i?.code===22||i?.code===1014||/quota/i.test(i?.message||"")){console.log("[state] LocalStorage quota exceeded, pruning memory cache");try{this.data.memories={},localStorage.setItem(Me,JSON.stringify(this.data))}catch{try{let s=JSON.parse(JSON.stringify(this.data));s.earth?.memorials&&s.earth.memorials.forEach(r=>{r.photo?.length>5e4&&(r.photo=null)}),s.ownedPlots&&Object.values(s.ownedPlots).forEach(r=>{r.memorial?.photo?.length>5e4&&(r.memorial.photo=null)}),localStorage.setItem(Me,JSON.stringify(s))}catch(s){console.warn("[state] emergency quota save failed:",s)}}}else console.log("[state] localStorage save failed",i)}if(!(O||!e||e.isGuest||!st))try{await De.setDoc(De.doc(st,"users",e.uid),this.data,{merge:!0})}catch(i){console.log("[state] remote Firestore save failed, preserved locally:",i)}};return t?a().catch(i=>console.error("[state] immediate save error",i)):(this._saveTimeout&&(clearTimeout(this._saveTimeout),this._saveResolve&&this._saveResolve()),new Promise(i=>{this._saveResolve=i,this._saveTimeout=setTimeout(()=>{a().catch(o=>console.error("[state] delayed save error",o)).finally(()=>{this._saveResolve===i&&(this._saveTimeout=null,this._saveResolve=null),i()})},1500)}))},membershipInfo(){return $e.find(e=>e.id===this.data.membership)||null},hasMembership(){return ie||!!this.data.membership},plotLimit(){if(ie)return 1/0;let e=this.data.membership;return e==="mem_eternal"?1/0:e==="mem_legacy"?6:e==="mem_guardian"?2:0},ownedCount(){return Object.keys(this.data.ownedPlots||{}).length},canBuyPlot(){return this.ownedCount()<this.plotLimit()},buyPlot(e,t){this.data.ownedPlots||={},this.data.ownedPlots[e.id]={memorial:t,decor:[],boughtAt:Date.now()},e.status="occupied",e.memorial={...t,owner:"You",gifts:0},e.decor=[{type:"headstone",style:t.headstone||"classic"}]},addDecor(e,t,a){this.data.ownedPlots||(this.data.ownedPlots={}),this.data.ownedPlots[e]||(this.data.ownedPlots[e]={decor:[]}),this.data.ownedPlots[e].decor||=[],this.data.ownedPlots[e].decor.push({itemId:t,slot:a})},addGift(e,t,a,i){this.data.gifts||={},(this.data.gifts[e.id]||=[]).push({giftId:t,from:a,message:i,at:Date.now()}),e.memorial&&(e.memorial.gifts=(e.memorial.gifts||0)+1)},addEarthMemorial(e){this.data.earth||={memorials:[],activity:[]},this.data.earth.memorials||=[];let t=this.data.earth.memorials.findIndex(a=>a.id===e.id);t>=0?this.data.earth.memorials[t]=e:this.data.earth.memorials.push(e)},earthMemorialCount(){return(this.data.earth?.memorials||[]).length},addMemory(e,t){((this.data.memories||={})[e]||=[]).push(t)},getMemories(e){return this.data.memories?.[e]||[]},logActivity(e,t){this.data.earth||={memorials:[],activity:[]},(this.data.earth.activity||=[]).unshift({icon:e,text:t,at:Date.now()}),this.data.earth.activity=this.data.earth.activity.slice(0,50)}};async function Vt(e,t){return new Promise(a=>{setTimeout(()=>{a(t==="Cinematic drone tour"?"images/eternal_valley_drone_tour_web.mp4":null)},3e3)})}async function jt(e,t){return new Promise(a=>{setTimeout(()=>{a({epitaph:`A heartfelt AI-generated tribute based on: "${t}". Forever remembered.`,mood:"clear",audioUrl:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"})},2e3)})}var z=[{id:"valley-panorama",stage:0,name:"Eternal Valley Panorama & Horizon",districtKey:"meadows",sub:"Establishing celestial aerial flight revealing the connected sanctuary basin.",tStart:0,tEnd:3.5,radarX:.5,radarY:.5,extImg:"images/photoreal/veo_valley_panorama_1788571618596.jpg",intImg:null,extLabel:"Sanctuary Panorama",intLabel:null,lore:"From high above the southern mountain crest, the entirety of Eternal Valley unfolds in unbroken dawn: the Grand Triumphal Gate at the southern threshold, the crystalline Rainbow Bridge curving over the turquoise river, the tiered fountains of Central Plaza, the glacial cataract waterfall thundering into mist, the perched Hohenzollern Universal Cathedral crowned in gold, and across the azure waters, the sentinel bluffs of Kaya Island.",plots:["plot-m-01","plot-m-02","plot-w-01","plot-c-01","plot-k-01"],videoPlots:[{id:"plot-m-01",code:"OV-01",title:"Valley Crest Overlook",tier:"Founder Pinnacle",price:5800,status:"available",x:35,y:55,highlight:!0},{id:"plot-c-01",code:"OV-02",title:"Northern Ridge Panorama",tier:"Grand Horizon",price:4900,status:"available",x:68,y:48}]},{id:"grand-gate",stage:1,name:"The Grand Triumphal Gate",districtKey:"meadows",sub:"Monumental southern archway welcoming all souls into paradise.",tStart:3.5,tEnd:7.5,radarX:.5,radarY:.88,extImg:"images/photoreal/veo_grand_gate_1788571463630.jpg",intImg:"images/photoreal/veo_closed_gate_1788571951195.jpg",extLabel:"Triumphal Arch",intLabel:"Gilded Portals",lore:"Carved from monolithic white travertine and banded with celestial gold, the Grand Triumphal Gate stands at the southern threshold of Eternal Valley. As souls pass beneath its soaring arch, all earthly sorrow dissolves into radiant peace.",plots:["plot-m-01","plot-m-02","plot-m-03","plot-m-04"],videoPlots:[{id:"plot-m-01",code:"M-01",title:"Meadow Portal Sanctuary",tier:"Meadow Tier",price:1200,status:"available",x:36,y:64,highlight:!0},{id:"plot-m-03",code:"M-03",title:"Travertine Arch Garden",tier:"Heritage",price:1450,status:"available",x:65,y:58}]},{id:"rainbow-bridge",stage:2,name:"The Rainbow Bridge Crest",districtKey:"meadows",sub:"Prismatic crystalline arch spanning the tranquil Rainbow River.",tStart:7.5,tEnd:11.5,radarX:.5,radarY:.7,extImg:"images/photoreal/veo_rainbow_bridge_1788571479328.jpg",intImg:null,extLabel:"Bridge Skyway",intLabel:null,lore:"The legendary Rainbow Bridge arches over the turquoise waters of the valley river. Its luminous surface refracts the eternal dawn, creating iridescent ribbons of light that guide companions home.",plots:["plot-m-05","plot-m-06","plot-m-07","plot-m-08"],videoPlots:[{id:"plot-m-05",code:"M-05",title:"Rainbow Crest Memorial",tier:"Prismatic Tier",price:2200,status:"available",x:45,y:48,highlight:!0},{id:"plot-m-07",code:"M-07",title:"Riverbank Blossom Plot",tier:"Meadow Tier",price:1800,status:"available",x:70,y:66}]},{id:"central-plaza",stage:3,name:"Central Plaza & Living Fountain",districtKey:"meadows",sub:"Heart of the sanctuary with celestial starburst mosaics and tiered cascades.",tStart:11.5,tEnd:15.5,radarX:.5,radarY:.52,extImg:"images/photoreal/veo_central_plaza_1788571496051.jpg",intImg:null,extLabel:"Plaza Basin",intLabel:null,lore:"The gathering crossroads of the sanctuary, where companions run and play in endless sunshine around the tiered lion fountain. Golden mosaic starbursts gleam through crystal water.",plots:["plot-m-09","plot-m-10","plot-m-11","plot-m-12"],videoPlots:[{id:"plot-m-09",code:"M-09",title:"Star Fountain Garden",tier:"Celestial Tier",price:3e3,status:"available",x:42,y:55,highlight:!0},{id:"plot-m-11",code:"M-11",title:"Living Promenade Plot",tier:"Piazza Tier",price:2600,status:"available",x:62,y:62}]},{id:"waterfall",stage:4,name:"Great Cataract Waterfall",districtKey:"waterfall",sub:"182-meter glacial cascade thundering down the northern granite wall.",tStart:15.5,tEnd:19.5,radarX:.42,radarY:.35,extImg:"images/photoreal/veo_waterfall_1788571511375.jpg",intImg:"images/photoreal/veo_underwater_plunge_pool.jpg",extLabel:"Glacial Cataract",intLabel:"Plunge Pool Shallows (UW)",lore:"Fed by ancient alpine snowmelt from the northern peaks, the Great Cataract plunges 182 meters into an effervescent turquoise gorge, casting perpetual rainbow mist before the flight dives directly into the plunge pool.",plots:["plot-w-01","plot-w-02","plot-w-03","plot-w-04"],videoPlots:[{id:"plot-w-01",code:"W-01",title:"Rainbow Mist Overlook",tier:"Glacial Sanctuary",price:3500,status:"available",x:38,y:50,highlight:!0},{id:"plot-w-03",code:"W-03",title:"Cataract Cliff Perch",tier:"Cascades Tier",price:3800,status:"available",x:68,y:44}]},{id:"underwater-plunge-pool",stage:5,name:"Cataract Plunge Pool & Glacial Shallows",districtKey:"waterfall",isUnderwater:!0,sub:"Drone plunges beneath the cataract into bubbling turquoise pools with swimming trout.",tStart:19.5,tEnd:23,radarX:.43,radarY:.36,extImg:"images/photoreal/veo_underwater_plunge_pool.jpg",intImg:"images/photoreal/veo_waterfall_1788571511375.jpg",extLabel:"Plunge Pool Shallows",intLabel:"Glacial Waterfall Vista",lore:"Swooping beneath the foaming impact of the 182-meter cataract. Effervescent micro-bubbles illuminate crystalline cold-water shallows, ancient glacial quartz boulders, and cold-water trout resting in celestial waters before ascending to the cathedral.",plots:["plot-w-uw1","plot-w-uw2","plot-w-01","plot-w-02"],videoPlots:[{id:"plot-w-uw1",code:"UW-W1",title:"Glacial Cataract Crystal Grotto",tier:"Submerged Sanctuary",price:4200,status:"available",x:42,y:58,highlight:!0},{id:"plot-w-uw2",code:"UW-W2",title:"Plunge Pool Pebble Vault",tier:"Aquatic Memorial",price:3900,status:"available",x:68,y:64}]},{id:"cathedral",stage:6,name:"Universal Cathedral & Citadel",districtKey:"cathedral",sub:"Camera surges up from the misty gorge to the perched Hohenzollern fortress ramparts.",tStart:23,tEnd:27,radarX:.5,radarY:.2,extImg:"images/photoreal/veo_cathedral_exterior_1788571528669.jpg",intImg:"images/photoreal/veo_cathedral_interior_1788571546191.jpg",extLabel:"Fortress Citadel",intLabel:"Rococo Nave",lore:"Crowning the highest northern granite bluff, the Universal Cathedral combines the towering towers of Hohenzollern with the divine gilded Solomonic marble colonnades and celestial frescoes of Asamkirche.",plots:["plot-c-01","plot-c-02","plot-c-03","plot-c-04"],videoPlots:[{id:"plot-c-01",code:"C-01",title:"Citadel Solomonic Colonnade",tier:"Cathedral Pinnacle",price:5500,status:"available",x:44,y:46,highlight:!0},{id:"plot-c-02",code:"C-02",title:"Hohenzollern Spire Terrace",tier:"Founder Sanctuary",price:6e3,status:"available",x:64,y:40}]},{id:"desert-canyon",stage:7,name:"Grand Canyon, Pueblo Kiva & The Phantasm Tree",districtKey:"desert",sub:"Ancient sandstone mesa crowned by the mystical bioluminescent Phantasm Tree.",tStart:27,tEnd:31,radarX:.25,radarY:.4,extImg:"images/photoreal/veo_desert_phantasm_tree.jpg",intImg:"images/photoreal/omni_pueblo_interior_1788572582730.jpg",extLabel:"The Phantasm Tree & Mesa",intLabel:"Ancestral Sun-Kiva",lore:"Rising above the terracotta red-rock amphitheater, the legendary Phantasm Tree blooms atop the highest canyon mesa. Its gnarled silver roots grip the sandstone cliff while glowing crystalline boughs shimmer with ethereal violet and golden light, releasing spirit motes across the desert breeze. Below in the canyon hollow, the stone Ancestral Pueblo Kiva offers eternal peace.",plots:["plot-d-01","plot-d-02","plot-d-03","plot-d-04"],videoPlots:[{id:"plot-pt-01",code:"PT-01",title:"Phantasm Tree Bough Sanctuary",tier:"Spectral Pinnacle",price:4800,status:"available",x:72,y:45,highlight:!0},{id:"plot-d-01",code:"D-01",title:"Sun-Kiva Cliff Chamber",tier:"Canyon Mesa",price:3200,status:"available",x:32,y:68,highlight:!0},{id:"plot-d-03",code:"D-03",title:"Sandstone Mesa Vista",tier:"Red Rock Sanctuary",price:2900,status:"available",x:52,y:56}]},{id:"moorish-oasis",stage:8,name:"Moorish Alhambra Oasis",districtKey:"mosque",sub:"Tranquil palace courtyard with reflecting pool, palms, and muqarnas dome.",tStart:31,tEnd:35,radarX:.28,radarY:.58,extImg:"images/photoreal/veo_moorish_oasis_1788571564882.jpg",intImg:"images/photoreal/omni_moorish_interior_1788572556838.jpg",extLabel:"Palace Courtyard",intLabel:"Muqarnas Vault",lore:"An oasis of eternal serenity inspired by the Alhambra. Slender marble colonnades frame a serene reflecting basin lined with date palms, leading to a soaring honeycomb muqarnas dome decorated in lapis lazuli and gold.",plots:["plot-q-01","plot-q-02","plot-q-03","plot-q-04"],videoPlots:[{id:"plot-q-01",code:"Q-01",title:"Reflecting Pool Arcade",tier:"Oasis Pavilion",price:4200,status:"available",x:42,y:58,highlight:!0},{id:"plot-q-02",code:"Q-02",title:"Muqarnas Colonnade",tier:"Alhambra Tier",price:4800,status:"available",x:62,y:50}]},{id:"mirror-lake",stage:9,name:"Mirror Lake Surface & Lotus Basin",districtKey:"lake",sub:"Crystal-clear alpine lake beneath weeping willows before diving into the aquatic realm.",tStart:35,tEnd:38.5,radarX:.7,radarY:.45,extImg:"images/photoreal/veo_waterfall_lake_1788571971638.jpg",intImg:"images/photoreal/veo_underwater_koi_shallows.jpg",extLabel:"Mirror Waters",intLabel:"Submerged Koi Realm (UW)",lore:"Still, crystalline lake waters reflect the surrounding alpine peaks, weeping willows, and floating water lilies. As the camera glides across the glass-smooth surface, it dips downward to submerge directly into the underwater koi sanctuary.",plots:["plot-l-01","plot-l-02","plot-l-03","plot-l-04"],videoPlots:[{id:"plot-l-01",code:"L-01",title:"Golden Koi Shallows",tier:"Mirror Waters",price:3600,status:"available",x:36,y:62,highlight:!0},{id:"plot-l-03",code:"L-03",title:"Willow Glade Sanctuary",tier:"Lake Sanctuary",price:3400,status:"available",x:65,y:54}]},{id:"underwater-koi",stage:10,name:"Underwater Koi Shallows & Lotus Pedestals",districtKey:"lake",isUnderwater:!0,sub:"Camera plunges beneath Mirror Lake among shimmering golden koi and submerged marble pedestals.",tStart:38.5,tEnd:42.5,radarX:.71,radarY:.46,extImg:"images/photoreal/veo_underwater_koi_shallows.jpg",intImg:"images/photoreal/veo_waterfall_lake_1788571971638.jpg",extLabel:"Underwater Koi Shallows",intLabel:"Lake Surface Reflection",lore:"Gliding beneath the surface of Mirror Lake into an ethereal aquatic sanctuary. Sun shafts filter through the crystal turquoise depth illuminating floating lotus root tendrils, schools of glowing golden koi, and submerged white marble memorial pedestals.",plots:["plot-l-uw1","plot-l-uw2","plot-l-01","plot-l-02"],videoPlots:[{id:"plot-l-uw1",code:"UW-L1",title:"Sunken Marble Lotus Pedestal",tier:"Aquatic Memorial",price:4400,status:"available",x:32,y:52,highlight:!0},{id:"plot-l-uw2",code:"UW-L2",title:"Golden Koi Glade Crypt",tier:"Deep Water Sanctuary",price:4100,status:"available",x:68,y:64}]},{id:"zen-pagoda",stage:11,name:"Five-Tiered Zen Pagoda",districtKey:"pagoda",sub:"Camera surfaces into the tranquil Japanese cedar grove with curved eaves and golden Buddha.",tStart:42.5,tEnd:46,radarX:.75,radarY:.32,extImg:"images/photoreal/veo_zen_pagoda_1788571581239.jpg",intImg:"images/photoreal/omni_pagoda_interior_1788572569485.jpg",extLabel:"Pagoda Eaves",intLabel:"Buddha Sanctuary",lore:"Rising out of the water onto the eastern forested terrace among blossoming cherry trees, the Five-Tiered Zen Pagoda radiates quiet contemplation. Inside, tatami mats and incense frame a radiant golden Buddha watching over rested spirits.",plots:["plot-p-01","plot-p-02","plot-p-03","plot-p-04"],videoPlots:[{id:"plot-p-01",code:"P-01",title:"Lotus Terrace Sanctuary",tier:"Zen Sanctuary",price:4500,status:"available",x:42,y:48,highlight:!0},{id:"plot-p-03",code:"P-03",title:"Cedar Grove Sanctuary",tier:"Pagoda Tier",price:4200,status:"available",x:64,y:60}]},{id:"kaya-island",stage:12,name:"Kaya Island & Female Siberian Husky Monument",districtKey:"kaya_island",sub:"Offshore coastal headland honoring the guardian spirit of female Siberian Husky Kaya.",tStart:46,tEnd:50.5,radarX:.5,radarY:.95,extImg:"images/photoreal/veo_kaya_island_husky_statue.jpg",intImg:"images/photoreal/veo_underwater_coral_reef.jpg",extLabel:"Kaya Husky Monument",intLabel:"Submerged Coral Reef (UW)",lore:"An offshore island bathed in turquoise surf and sea spray, honoring the eternal spirit of female Siberian Husky Kaya. Her towering stone and bronze statue stands sentinel over the open southern ocean before the flight dives off the cliffs into the coral reef.",plots:["plot-k-01","plot-k-02","plot-k-03","plot-k-04"],videoPlots:[{id:"plot-k-01",code:"K-01",title:"Kaya Headland Memorial",tier:"Founder Sanctuary",price:7500,status:"available",x:48,y:38,highlight:!0},{id:"plot-k-02",code:"K-02",title:"Ocean Sentinel Bluff",tier:"Celestial Tier",price:6800,status:"available",x:28,y:58},{id:"plot-k-03",code:"K-03",title:"Turquoise Surf Crest",tier:"Heritage Tier",price:5900,status:"available",x:74,y:52}]},{id:"underwater-coral-reef",stage:13,name:"Sunken Coral Reef Sea Sanctuary",districtKey:"underwater",isUnderwater:!0,sub:"The drone plunges off the sea cliff into a vibrant turquoise coral reef sanctuary.",tStart:50.5,tEnd:54.5,radarX:.5,radarY:.97,extImg:"images/photoreal/veo_underwater_coral_reef.jpg",intImg:"images/photoreal/veo_underwater_abyssal_trench.jpg",extLabel:"Coral Reef Lagoon",intLabel:"Abyssal Descent (UW)",lore:"Just off the southern headland of Kaya Island, the crystal-clear ocean drops into a magnificent turquoise marine preserve. Intricate coral formations, luminous crystal memorial obelisks, swimming green sea turtles, and colorful reef fish celebrate water-loving companions in perpetual harmony.",plots:["plot-k-uw1","plot-k-uw2","plot-k-uw3"],videoPlots:[{id:"plot-k-uw1",code:"UW-K1",title:"Turquoise Coral Garden Vault",tier:"Marine Sanctuary",price:5200,status:"available",x:38,y:62,highlight:!0},{id:"plot-k-uw2",code:"UW-K2",title:"Crystal Reef Obelisk",tier:"Oceanic Tier",price:4900,status:"available",x:65,y:50}]},{id:"underwater-abyss",stage:14,name:"Oceanic Abyssal Trench & Bioluminescent Vaults",districtKey:"underwater",isUnderwater:!0,sub:"Deep oceanic abyss illuminated by bioluminescent sea creatures and sunken crystal spires.",tStart:54.5,tEnd:60,radarX:.5,radarY:.99,extImg:"images/photoreal/veo_underwater_abyssal_trench.jpg",intImg:"images/photoreal/veo_underwater_coral_reef.jpg",extLabel:"Abyssal Trench",intLabel:"Shallow Coral Reef (UW)",lore:"Descending into the deep sapphire abyss off the southern continental shelf. Bioluminescent dolphins and giant manta rays glide through ancient volcanic spires crowned with radiant cyan crystals, holding the deepest eternal memories of the sanctuary.",plots:["plot-k-uw4","plot-k-uw5"],videoPlots:[{id:"plot-k-uw4",code:"UW-K4",title:"Bioluminescent Abyss Vault",tier:"Abyssal Pinnacle",price:6500,status:"available",x:44,y:56,highlight:!0},{id:"plot-k-uw5",code:"UW-K5",title:"Deep Ocean Crystal Spire",tier:"Abyssal Tier",price:5800,status:"available",x:72,y:48}]}],$t=class{constructor(){this.container=null,this.video=null,this.radarCanvas=null,this.radarCtx=null,this.activeStage=z[0],this.isPlaying=!1,this.isMuted=!0,this.currentViewMode="exterior",this.activeInspectionLandmark=null,this._rafId=null,this._initialized=!1,this._renderedStageId=null}init(){if(!this._initialized){if(this.container=document.getElementById("veoDroneTourContainer"),this.video=document.getElementById("veoDroneTourVideo"),this.radarCanvas=document.getElementById("veoRadarCanvas"),this.radarCanvas&&(this.radarCtx=this.radarCanvas.getContext("2d")),!this.container||!this.video){console.warn("[VeoTourController] DOM elements not ready, deferred.");return}this._bindVideoEvents(),this._bindOverlayEvents(),this._drawRadar(0),this._updateVideoPlots(this.activeStage),this._initialized=!0,console.log("[VeoTourController] Initialized successfully with 15 geographically interwoven land-and-water stages.")}}_bindVideoEvents(){this.video&&(this.video.addEventListener("timeupdate",()=>{let t=this.video.currentTime;this._updateProgress(t),this._updateActiveStage(t),this._updateVideoPlots(this.activeStage),this._drawRadar(t/(this.video.duration||60))}),this.video.addEventListener("play",()=>{this.isPlaying=!0,this._updatePlayButton(!0)}),this.video.addEventListener("pause",()=>{this.isPlaying=!1,this._updatePlayButton(!1)}),this.video.addEventListener("ended",()=>{this.video.currentTime=0,this.video.play().catch(()=>{})}))}_bindOverlayEvents(){let t=document.getElementById("veoClickSurface");t&&t.addEventListener("click",P=>{P.target.closest("#veoFlightControls")||P.target.closest("#veoValleyRadar")||P.target.closest(".veo-plot-pin")||P.target.closest(".veo-no-click")||this.openAreaInspection(this.activeStage.id)});let a=document.getElementById("veoPlayBtn");a&&a.addEventListener("click",P=>{P.stopPropagation(),this.togglePlay()});let i=document.getElementById("veoSoundBtn");i&&i.addEventListener("click",P=>{P.stopPropagation(),this.toggleMute()});let o=document.getElementById("veoExitBtn");o&&o.addEventListener("click",P=>{P.stopPropagation(),this.exitTourTo3D()});let n=document.getElementById("veoSwitch3dBtn");n&&n.addEventListener("click",P=>{P.stopPropagation(),this.exitTourTo3D()});let s=document.getElementById("veoOpenMapBtn");s&&s.addEventListener("click",P=>{P.stopPropagation(),window.UI&&typeof window.UI.show2D=="function"&&window.UI.show2D()});let r=document.getElementById("view2dReturnTourBtn");r&&r.addEventListener("click",()=>{window.UI&&typeof window.UI.startDroneTour=="function"&&window.UI.startDroneTour()});let l=document.getElementById("view2dReturn3dBtn");l&&l.addEventListener("click",()=>{window.UI&&typeof window.UI.show3D=="function"&&window.UI.show3D()});let d=document.getElementById("veoScrubBar");d&&d.addEventListener("click",P=>{P.stopPropagation();let A=d.getBoundingClientRect(),K=Math.max(0,Math.min(1,(P.clientX-A.left)/A.width))*(this.video.duration||60);this.video.currentTime=K,this.isPlaying||this.video.play().catch(()=>{})});let p=document.getElementById("veoLandmarkPills");p&&p.addEventListener("click",P=>{let A=P.target.closest(".veo-landmark-pill");if(!A)return;P.stopPropagation();let G=A.dataset.landmarkId;this.jumpToLandmark(G)});let g=document.getElementById("veoModalClose");g&&g.addEventListener("click",()=>this.closeAreaInspection());let u=document.getElementById("veoModalBackdrop");u&&u.addEventListener("click",()=>this.closeAreaInspection());let w=document.getElementById("veoModalResumeTour");w&&w.addEventListener("click",()=>{this.closeAreaInspection(),this.video.play().catch(()=>{})});let f=document.getElementById("veoModalExplore3d");f&&f.addEventListener("click",()=>{let P=this.activeInspectionLandmark||this.activeStage;this.closeAreaInspection(),this.exitTourTo3D(P.districtKey)});let M=document.getElementById("veoToggleExterior"),L=document.getElementById("veoToggleInterior");M&&L&&(M.addEventListener("click",()=>this.setModalView("exterior")),L.addEventListener("click",()=>this.setModalView("interior")))}start(t=0){if(this._initialized||this.init(),(!this.container||!this.video)&&(this.container=document.getElementById("veoDroneTourContainer"),this.video=document.getElementById("veoDroneTourVideo"),!this._initialized&&this.container&&this.video&&this.init()),!this.container||!this.video)return;window.UI?.world?.stop(),!this.video.getAttribute("src")&&this.video.dataset.src&&(this.video.src=this.video.dataset.src,this.video.load());let a=document.getElementById("stage");a&&(a.classList.remove("hidden"),a.classList.add("is-active"));let i=document.getElementById("view3d");i&&(i.classList.remove("hidden"),i.classList.add("is-active")),this.container.classList.remove("hidden"),this.container.classList.add("is-active"),this.container.style.display="block";let o=0;if(typeof t=="number"&&z[t])o=z[t].tStart,this.activeStage=z[t];else if(typeof t=="string"){let r=z.find(l=>l.id===t||l.districtKey===t);r&&(o=r.tStart,this.activeStage=r)}this.video.readyState>=1?this.video.currentTime=o:(this._pendingSeek=o,this._seekBound||(this._seekBound=!0,this.video.addEventListener("loadedmetadata",()=>{this.video.currentTime=this._pendingSeek||0},{once:!0}))),this._updateHUD(this.activeStage),this._updateVideoPlots(this.activeStage);let n=this.video.play();n!==void 0&&n.then(()=>{this.isPlaying=!0,this._updatePlayButton(!0)}).catch(r=>{console.warn("[VeoTourController] Autoplay prevented, waiting for user click:",r),this.isPlaying=!1,this._updatePlayButton(!1)});let s=document.getElementById("btnDroneTour");s&&(document.querySelectorAll(".view-toggle button").forEach(r=>r.classList.remove("active")),s.classList.add("active"))}stop(){if(!this.container||!this.video)return;this.video.pause(),this.isPlaying=!1,this._updatePlayButton(!1),this.container.classList.add("hidden"),this.container.classList.remove("is-active"),this.container.style.display="none",this.closeAreaInspection(),this._renderedStageId=null;let t=document.getElementById("veoVideoPlotsOverlay");t&&(t.innerHTML="")}togglePlay(){this.video&&(this.video.paused?this.video.play().catch(()=>{}):this.video.pause())}toggleMute(){if(!this.video)return;this.isMuted=!this.isMuted,this.video.muted=this.isMuted;let t=document.getElementById("veoSoundBtn");t&&(t.innerHTML=this.isMuted?'<span class="veo-icon">\u{1F507}</span>':'<span class="veo-icon">\u{1F50A}</span>',t.title=this.isMuted?"Unmute Audio":"Mute Audio")}jumpToLandmark(t){let a=z.find(i=>i.id===t||i.districtKey===t);!a||!this.video||(this.video.currentTime=a.tStart+.05,this._updateVideoPlots(a),this.video.paused&&this.video.play().catch(()=>{}))}jumpToStage(t){let a=z.find(i=>i.stage===t);!a||!this.video||(this.video.currentTime=a.tStart+.05,this._updateVideoPlots(a),this.video.paused&&this.video.play().catch(()=>{}))}async exitTourTo3D(t=null){if(this.stop(),!!window.UI?.show3D&&(await window.UI.show3D("orbit"),t&&window.UI._currentView==="view3d")){let a=window.UI.world;await a?.detailsReady,window.UI._currentView==="view3d"&&a?.flyToDistrict(t)}}_updatePlayButton(t){let a=document.getElementById("veoPlayBtn");a&&(a.innerHTML=t?'<span class="veo-icon">\u23F8</span>':'<span class="veo-icon">\u25B6</span>',a.title=t?"Pause Tour":"Resume Tour")}_updateProgress(t){let a=this.video.duration||60,i=Math.max(0,Math.min(100,t/a*100)),o=document.getElementById("veoScrubFill");o&&(o.style.width=`${i}%`);let n=document.getElementById("veoTimeText");if(n){let s=Math.floor(t/60),r=Math.floor(t%60).toString().padStart(2,"0"),l=Math.floor(a/60),d=Math.floor(a%60).toString().padStart(2,"0");n.textContent=`${s}:${r} / ${l}:${d}`}}_updateActiveStage(t){let a=z[0];for(let i=0;i<z.length;i++){let o=z[i];if(t>=o.tStart&&(t<o.tEnd||i===z.length-1)){a=o;break}}this.activeStage.id!==a.id&&(this.activeStage=a,this._updateHUD(a),this._updateVideoPlots(a))}_updateHUD(t){let a=document.getElementById("veoBeaconBadge");if(a){let i=t.stage===0?"SANCTUARY OVERVIEW":t.isUnderwater?`UNDERWATER REALM \xB7 STAGE ${t.stage}/14`:`STAGE ${t.stage}/14`;a.innerHTML=`
        <div class="veo-beacon-pill ${t.isUnderwater?"is-underwater":""}">
          <span class="veo-beacon-dot ${t.isUnderwater?"dot-uw":""}"></span>
          <span class="veo-beacon-stage">${i}</span>
          <span class="veo-beacon-title">${t.name}</span>
        </div>
        <div class="veo-beacon-hint">\u2726 Click video or plot pins to inspect 4K vision & reserve plots</div>
      `}document.querySelectorAll(".veo-landmark-pill").forEach(i=>{i.classList.toggle("is-active",i.dataset.landmarkId===t.id)})}_updateVideoPlots(t){let a=document.getElementById("veoVideoPlotsOverlay");if(!a||this._renderedStageId===t.id)return;this._renderedStageId=t.id,a.innerHTML="";let i=t.videoPlots||[];i.length!==0&&i.forEach(o=>{let n=document.createElement("div");n.className=`veo-plot-pin ${o.highlight?"is-highlight":""} ${t.isUnderwater?"is-uw-pin":""}`,n.style.left=`${o.x}%`,n.style.top=`${o.y}%`,n.setAttribute("data-plot-id",o.id),n.setAttribute("role","button"),n.setAttribute("tabindex","0"),n.setAttribute("aria-label",`Plot ${o.code}: ${o.title}, $${o.price}`),n.innerHTML=`
        <div class="veo-pin-beacon">
          <span class="veo-pin-core"></span>
          <span class="veo-pin-ripple"></span>
          <span class="veo-pin-ripple delay"></span>
        </div>
        <div class="veo-pin-card">
          <div class="vpc-top">
            <span class="vpc-code">PLOT ${o.code}</span>
            <span class="vpc-tier">${o.tier||"Sanctuary"}</span>
          </div>
          <div class="vpc-title">${o.title}</div>
          <div class="vpc-bottom">
            <span class="vpc-price">$${o.price.toLocaleString()}</span>
            <span class="vpc-cta">Inspect & Reserve \u2192</span>
          </div>
        </div>
      `;let s=r=>{r.stopPropagation(),this.openAreaInspection(t.id,o.id)};n.addEventListener("click",s),n.addEventListener("keydown",r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),s(r))}),a.appendChild(n)})}_drawRadar(t){if(!this.radarCtx||!this.radarCanvas)return;let a=this.radarCtx,i=this.radarCanvas.width,o=this.radarCanvas.height;a.clearRect(0,0,i,o),a.save(),a.beginPath(),a.arc(i/2,o/2,i/2-4,0,Math.PI*2),a.fillStyle="rgba(10, 14, 18, 0.75)",a.fill(),a.strokeStyle="rgba(212, 175, 55, 0.35)",a.lineWidth=1.5,a.stroke(),a.beginPath(),a.arc(i/2,o/2,(i/2-4)*.5,0,Math.PI*2),a.strokeStyle="rgba(212, 175, 55, 0.12)",a.lineWidth=1,a.stroke(),a.beginPath(),a.moveTo(i/2,4),a.lineTo(i/2,o-4),a.moveTo(4,o/2),a.lineTo(i-4,o/2),a.strokeStyle="rgba(212, 175, 55, 0.08)",a.stroke(),a.restore(),a.save(),a.beginPath();let n=[{x:.5,y:.5},{x:.5,y:.88},{x:.5,y:.7},{x:.5,y:.52},{x:.42,y:.35},{x:.43,y:.36},{x:.5,y:.2},{x:.25,y:.4},{x:.28,y:.58},{x:.7,y:.45},{x:.71,y:.46},{x:.75,y:.32},{x:.5,y:.95},{x:.5,y:.97},{x:.5,y:.99}];a.moveTo(n[0].x*i,n[0].y*o);for(let A=1;A<n.length;A++)a.lineTo(n[A].x*i,n[A].y*o);a.strokeStyle="rgba(212, 175, 55, 0.28)",a.lineWidth=1.8,a.setLineDash([3,3]),a.stroke(),a.setLineDash([]),a.restore(),z.forEach(A=>{let G=A.radarX*i,K=A.radarY*o,U=A.id===this.activeStage.id;a.beginPath(),a.arc(G,K,U?4:2,0,Math.PI*2),a.fillStyle=U?A.isUnderwater?"#38d9d2":"#e8c04a":A.isUnderwater?"rgba(56, 217, 210, 0.55)":"rgba(255, 255, 255, 0.45)",a.fill(),U&&(a.beginPath(),a.arc(G,K,7,0,Math.PI*2),a.strokeStyle=A.isUnderwater?"rgba(56, 217, 210, 0.65)":"rgba(232, 192, 74, 0.5)",a.lineWidth=1,a.stroke())});let s=this.video.duration||60,r=t*s,l=0;for(let A=0;A<z.length;A++)if(r>=z[A].tStart&&(r<=z[A].tEnd||A===z.length-1)){l=A;break}let d=z[l],p=Math.max(.01,d.tEnd-d.tStart),g=Math.max(0,Math.min(1,(r-d.tStart)/p)),u=n[Math.min(n.length-1,l)],w=n[Math.min(n.length-1,l+1)],f=(u.x+(w.x-u.x)*g)*i,M=(u.y+(w.y-u.y)*g)*o;a.save();let L=d.isUnderwater,P=a.createRadialGradient(f,M,0,f,M,12);P.addColorStop(0,L?"rgba(200, 255, 250, 0.95)":"rgba(255, 240, 160, 0.9)"),P.addColorStop(.4,L?"rgba(56, 217, 210, 0.65)":"rgba(232, 192, 74, 0.6)"),P.addColorStop(1,L?"rgba(56, 217, 210, 0)":"rgba(232, 192, 74, 0)"),a.fillStyle=P,a.beginPath(),a.arc(f,M,12,0,Math.PI*2),a.fill(),a.fillStyle="#ffffff",a.beginPath(),a.arc(f,M,2.5,0,Math.PI*2),a.fill(),a.restore()}openAreaInspection(t,a=null){let i=z.find(u=>u.id===t||u.districtKey===t)||this.activeStage;this.activeInspectionLandmark=i,this.currentViewMode="exterior",this.video&&!this.video.paused&&this.video.pause();let o=document.getElementById("veoAreaInspectionModal");if(!o)return;let n=document.getElementById("veoModalHeroImg");n&&(n.src=i.extImg,n.alt=i.name);let s=document.getElementById("veoModalTitle");s&&(s.textContent=i.name);let r=document.getElementById("veoModalSub");r&&(r.textContent=`${i.sub} \xB7 District: ${i.districtKey.toUpperCase()}${i.isUnderwater?" \xB7 AQUATIC REALM":""}`);let l=document.getElementById("veoModalLore");l&&(l.textContent=i.lore);let d=document.getElementById("veoModalViewToggle"),p=document.getElementById("veoToggleExterior"),g=document.getElementById("veoToggleInterior");i.intImg?(d&&(d.style.display="flex"),p&&(p.textContent=i.extLabel||"Primary Architecture"),g&&(g.textContent=i.intLabel||"Submerged/Interior View"),this.setModalView("exterior")):d&&(d.style.display="none"),this._populateModalPlots(i,a),o.classList.remove("hidden"),o.classList.add("is-active")}setModalView(t){this.currentViewMode=t;let a=this.activeInspectionLandmark;if(!a)return;let i=document.getElementById("veoModalHeroImg"),o=document.getElementById("veoToggleExterior"),n=document.getElementById("veoToggleInterior");i&&(i.style.opacity="0.3",setTimeout(()=>{i.src=t==="interior"&&a.intImg?a.intImg:a.extImg,i.style.opacity="1"},150)),o&&o.classList.toggle("is-active",t==="exterior"),n&&n.classList.toggle("is-active",t==="interior")}_populateModalPlots(t,a=null){let i=document.getElementById("veoModalPlotsList");if(!i)return;let o=window.plots||window.UI?.plots||window.world?.plots||[],n=[];if(t.isUnderwater||t.districtKey==="underwater"?n=o.filter(s=>s.district==="underwater"||s.id&&s.id.includes("UW")):n=o.filter(s=>s.district===t.districtKey),n=n.slice(0,6),a){let s=o.find(r=>r.id===a);s&&!n.some(r=>r.id===a)&&n.unshift(s)}n.length===0&&(t.isUnderwater?n=[{id:`${t.id}-01`,code:`UW-${t.stage}A`,title:`${t.name.split("&")[0].trim()} Vault`,tier:"Aquatic Memorial",district:"underwater",status:"available",price:4900,epitaph:"Resting in eternal bioluminescent turquoise peace."},{id:`${t.id}-02`,code:`UW-${t.stage}B`,title:"Sunken Crystal Spire Sanctum",tier:"Deep Marine Sanctum",district:"underwater",status:"available",price:5500,epitaph:"Cradled in crystal coral gardens and swimming mantas."}]:n=(t.plots||[]).map((s,r)=>({id:s,code:s.toUpperCase(),title:`${t.name} Memorial Garden ${r+1}`,tier:r===0?"Founder Pinnacle":"Celestial Tier",district:t.districtKey,status:"available",price:2500+r*750,epitaph:"An eternal resting sanctuary honoring unbroken love."}))),i.innerHTML="",n.forEach(s=>{let r=a&&s.id===a,l=document.createElement("div");l.className=`veo-plot-card ${r?"is-target":""}`,l.innerHTML=`
        <div class="vpc-card-header">
          <span class="vpc-card-badge">${s.tier||"Sanctuary"}</span>
          <span class="vpc-card-status status-${s.status||"available"}">${(s.status||"available").toUpperCase()}</span>
        </div>
        <div class="vpc-card-title">${s.title||s.name||`Memorial Plot ${s.code}`}</div>
        <div class="vpc-card-epitaph">"${s.epitaph||"Somewhere over the rainbow bridge."}"</div>
        <div class="vpc-card-footer">
          <span class="vpc-card-price">$${(s.price||2500).toLocaleString()}</span>
          <button class="btn btn-sm btn-gold vpc-reserve-btn" data-plot-id="${s.id}">
            Reserve Plot \u2192
          </button>
        </div>
      `;let d=l.querySelector(".vpc-reserve-btn");d&&d.addEventListener("click",p=>{p.stopPropagation(),this.reservePlot(s)}),i.appendChild(l)})}reservePlot(t){this.closeAreaInspection(),window.UI&&typeof window.UI.openConsecrateModal=="function"?window.UI.openConsecrateModal(t):window.UI&&typeof window.UI.showPurchaseModal=="function"?window.UI.showPurchaseModal(t):alert(`Plot Reservation Initialized for ${t.title||t.code} ($${t.price}). Connecting to consecration gateway...`)}closeAreaInspection(){let t=document.getElementById("veoAreaInspectionModal");t&&(t.classList.add("hidden"),t.classList.remove("is-active")),this.activeInspectionLandmark=null}},nt=new $t,X=nt;typeof window<"u"&&(window.veoTourController=nt,window.veoTour=nt,window.VeoTourController=nt);var St=()=>{try{return JSON.parse(localStorage.getItem("ev_user"))?.name||"guest"}catch{return"guest"}};function Wt(e,t,a,i,o={}){if(Ze)try{let n=St(),s=localStorage.getItem("ev_ref")||void 0;fetch(`${yt}/track`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind:e,name:t,amount:a,admin:i,user:n,charity:o.charity,donate:o.donate,ref:s})}).catch(()=>{})}catch{}}function ua(e,t){return e==="gift"&&t.giftId==="g_donation"?"giftDonate":e}async function ga(e,t,a,i,o){try{return await ne.record({kind:ua(e,i),label:t,amountCents:we(a),charityId:i.charity||R[0].id,campaignId:i.campaignId||null,donor:St()!=="guest"?St():"Anonymous",demo:o})}catch(n){throw console.log("[ledger] FAILED TO RECORD",{kind:e,name:t,amount:a},n),n}}async function Q({kind:e,name:t,amount:a,meta:i={}}){let o=Math.max(0,Number(a)||0);if(o<.5&&o>0)throw new Error("Minimum transaction is $0.50");if(ie)return Wt(e,t,o,!0,i),{ok:!0,admin:!0};if(O||!Ze&&O){if(o<.5&&o>0)throw new Error("Minimum transaction is $0.50");return await new Promise(l=>setTimeout(l,800)),Wt(e,t,o,!1,i),{ok:!0,demo:!0,entry:await ga(e,t,o,i||{},!0)}}if(!Ze&&!O)throw new Error("Payment network unavailable in production.");let n;for(let r=0;r<2;r++)try{if(n=await fetch(`${yt}/create-checkout-session`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind:e,name:t,amountCents:Math.round(o*100),meta:i,successUrl:location.origin+location.pathname+"?paid=1",cancelUrl:location.href})}),n.ok)break;throw new Error("API Error")}catch{if(r===1)throw new Error("Network failed to reach payment provider.");await new Promise(d=>setTimeout(d,600))}if(!n||!n.ok)throw new Error("Payment server rejected the request.");let{url:s}=await n.json();if(!s)throw new Error("No checkout URL returned.");return location.href=s,{ok:!1,redirected:!0}}var E=e=>String(e??"").replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),ba=e=>Math.round(e*100)+"%",Yt=e=>new Date(e).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"});var Z={activeCat:"all",togglePanel(e){let t=document.getElementById("campaignPanel");if(t){if(!t.classList.contains("hidden"))return t.classList.add("hidden");document.getElementById("feedPanel")?.classList.add("hidden"),document.getElementById("browsePanel")?.classList.add("hidden"),this.renderPanel(e),t.classList.remove("hidden")}},async renderPanel(e){let t=await V.load(),a=ne.totals(),i=qe(a.charity),o=document.getElementById("campaignBody");if(!o)return;let n=this.activeCat==="all"?t:t.filter(s=>se(s.charityId)?.catId===this.activeCat);o.innerHTML=`
      <div class="cause-hero">
        <div class="cause-hero__fig">${T(a.charity)}</div>
        <div class="cause-hero__cap">Delivered directly to verified animal rescues</div>
        
        <!-- Live Real-World Impact Grid -->
        <div class="impact-grid">
          <div class="impact-cell">
            <span class="impact-cell__val">${i.mealsProvided}</span>
            <span class="impact-cell__lbl">${h("heart",{size:12})} Meals Provided</span>
          </div>
          <div class="impact-cell">
            <span class="impact-cell__val">${i.veterinaryExams}</span>
            <span class="impact-cell__lbl">${h("sparkle",{size:12})} Vet Exams Funded</span>
          </div>
          <div class="impact-cell">
            <span class="impact-cell__val">${i.seniorComfortDays}</span>
            <span class="impact-cell__lbl">${h("flower",{size:12})} Senior Care Days</span>
          </div>
        </div>

        <button class="btn btn-outline btn-block" id="openLedger" style="margin-top:12px">
          ${h("scroll")} Public SHA-256 Ledger (${a.count} verified)
        </button>
      </div>

      <button class="btn btn-gold btn-block" id="newCampaign">
        ${h("heart")} Start a free campaign in their name
      </button>
      <p class="fine" style="margin:8px 0 12px;font-size:11.5px">
        100% of what your campaign raises passes straight to your chosen shelter.
        No platform fees, no deductions.
      </p>

      <!-- Category Filter Tabs -->
      <div class="charity-cat-bar">
        ${Nt.map(s=>`
          <button class="charity-cat-chip${this.activeCat===s.id?" is-active":""}" data-cat="${s.id}">
            ${h(s.icon,{size:14})} ${E(s.label)}
          </button>
        `).join("")}
      </div>

      ${n.length?`<div class="sub" style="margin:16px 0 10px">Active Memorial Campaigns (${n.length})</div>`:`
        <div class="cause-empty">
          ${h("paw",{size:32})}
          <p>No campaigns in this category yet. Be the first to start one in your companion's memory.</p>
        </div>`}

      ${n.map(s=>{let r=V.raised(s),l=V.progress(s),d=se(s.charityId);return`
        <div class="cause-card" data-cmp="${s.id}">
          <div class="cause-card__top">
            <div>
              <b>${E(s.petName)}</b>
              <div class="cause-card__sub">${[s.species,s.years].filter(Boolean).map(E).join(" \xB7 ")}</div>
            </div>
            <span class="cause-card__for">${E(d?.name||"")}</span>
          </div>
          ${s.story?`<p class="cause-card__story">${E(s.story.slice(0,130))}${s.story.length>130?"\u2026":""}</p>`:""}
          <div class="cause-bar"><span style="width:${(l*100).toFixed(1)}%"></span></div>
          <div class="cause-card__foot">
            <span><b>${T(r)}</b> of ${T(s.goalCents)}</span>
            <span>${(s.donations||[]).length} ${(s.donations||[]).length===1?"tribute":"tributes"}</span>
          </div>
          <button class="btn btn-gold btn-block cause-give" data-give="${s.id}">${h("heart")} Give in ${E(s.petName)}\u2019s name</button>
        </div>`}).join("")}`,o.querySelector("#newCampaign").onclick=()=>e.campaignCreateModal(),o.querySelector("#openLedger").onclick=()=>this.ledgerModal(e),o.querySelectorAll("[data-cat]").forEach(s=>{s.onclick=()=>{this.activeCat=s.dataset.cat,this.renderPanel(e)}}),o.querySelectorAll("[data-give]").forEach(s=>{s.onclick=async r=>{r.stopPropagation();let l=await V.get(s.dataset.give);l&&e.campaignDonateModal(l)}}),o.querySelectorAll("[data-cmp]").forEach(s=>{s.onclick=async()=>{let r=await V.get(s.dataset.cmp);r&&e.campaignViewModal(r)}})},createModal(e){e.modal(`
      <h2>${h("heart")} Start a memorial campaign</h2>
      <div class="modal-sub">Create a lasting tribute in your companion\u2019s name. 
        <b>100% of donations go directly to the animal rescue you select.</b> No platform cut.</div>

      <label>Their name</label>
      <input id="cmpName" maxlength="40" placeholder="e.g. Luna or Ranger">

      <div class="two-col">
        <div>
          <label>Species / Breed</label>
          <input id="cmpSpecies" maxlength="24" placeholder="Golden Retriever, Tabby...">
        </div>
        <div>
          <label>Years</label>
          <input id="cmpYears" maxlength="20" placeholder="2012 \u2013 2025">
        </div>
      </div>

      <label>Their story &amp; rescue mission <span class="fine-inline">(what made them special?)</span></label>
      <textarea id="cmpStory" maxlength="700" rows="4"
        placeholder="Luna brought sunshine into our lives for 13 years. In her honor, we're helping rescue dogs get the medical care they need\u2026"></textarea>

      <label>Select Verified 501(c)(3) Animal Rescue Beneficiary</label>
      <select id="cmpCharity">
        ${R.map(n=>`<option value="${n.id}">${E(n.name)} \u2014 ${E(n.cat)} (${E(n.city)}, ${E(n.state)})</option>`).join("")}
      </select>
      <div class="district-blurb" id="cmpCharityNote" style="margin:10px 0"></div>

      <label>Campaign Goal</label>
      <select id="cmpGoal">
        <option value="15000">$150 \u2014 Shelter Intake &amp; Vaccines</option>
        <option value="35000" selected>$350 \u2014 Medical Grant &amp; Spay/Neuter</option>
        <option value="75000">$750 \u2014 Emergency Surgery Fund</option>
        <option value="150000">$1,500 \u2014 Senior Foster Sponsorship</option>
        <option value="300000">$3,000 \u2014 Lifetime Sanctuary Mission</option>
      </select>

      <button class="btn btn-gold btn-block" id="cmpCreate">${h("heart")} Launch Memorial Campaign</button>
      <p class="fine">${this._demoNote()}</p>`);let t=document.getElementById("modalBox"),a=t.querySelector("#cmpCharity"),i=t.querySelector("#cmpCharityNote"),o=()=>{let n=se(a.value);i.innerHTML=n?`<b>${E(n.name)}</b> (${E(n.city)}, ${E(n.state)})<br>
           <span style="color:var(--accent-hi-c);font-size:11.5px">${E(n.rating||"")}</span><br>
           ${E(n.blurb)}<br>
           <span class="fine-dim">EIN ${E(n.ein)} \xB7 <a href="${E(n.url)}" target="_blank" rel="noopener noreferrer">${E(n.url.replace(/^https?:\/\//,""))}</a></span>`:""};a.onchange=o,o(),t.querySelector("#cmpCreate").onclick=async()=>{let n=t.querySelector("#cmpName").value.trim();if(!n)return e.toast("Please enter their name.","warning");y.user||await y.continueAsGuest(!0);let s=t.querySelector("#cmpCreate"),r=s.innerHTML;s.innerHTML=`${h("heart")} Creating...`,s.disabled=!0;try{let l=await V.create({petName:n,species:t.querySelector("#cmpSpecies").value.trim(),years:t.querySelector("#cmpYears").value.trim(),story:t.querySelector("#cmpStory").value.trim(),charityId:a.value,goalCents:+t.querySelector("#cmpGoal").value,owner:y.user?.name||"A loving friend"});e.closeModal(),this.renderPanel(e),document.getElementById("campaignPanel")?.classList.remove("hidden"),e.toast(`${l.petName}\u2019s campaign is live.`,"heart"),this.campaignModal(e,l)}catch(l){e.toast("Could not create campaign: "+l.message,"warning"),s.innerHTML=r,s.disabled=!1}}},campaignModal(e,t){let a=V.raised(t),i=V.progress(t),o=se(t.charityId),n=(t.donations||[]).slice().reverse(),s=`${location.origin}${location.pathname}?campaign=${encodeURIComponent(t.id)}`;e.modal(`
      <h2>${h("crest")} ${E(t.petName)}</h2>
      <div class="modal-sub">${[t.species,t.years].filter(Boolean).map(E).join(" \xB7 ")||"In loving memory"} \xB7 by ${E(t.owner||"A loving family")}</div>
      ${t.story?`<p class="cause-story">\u201C${E(t.story)}\u201D</p>`:""}

      <div class="cause-bar cause-bar--lg"><span style="width:${(i*100).toFixed(1)}%"></span></div>
      <div class="cause-figs">
        <div><b>${T(a)}</b><span>Delivered to Rescue</span></div>
        <div><b>${T(t.goalCents)}</b><span>Campaign Goal</span></div>
        <div><b>${n.length}</b><span>${n.length===1?"Tribute Giver":"Tribute Givers"}</span></div>
      </div>

      ${o?`<div class="district-blurb">
        ${h("heart")} Dedicated Beneficiary: <b>${E(o.name)}</b> (${E(o.city)}, ${E(o.state)})<br>
        <span style="color:var(--accent-hi-c);font-size:11.5px">${E(o.rating||"")}</span><br>
        ${E(o.blurb)}
        <br><span class="fine-dim">IRS EIN: ${E(o.ein)} \xB7 <a href="${E(o.url)}" target="_blank" rel="noopener noreferrer">Official Website</a></span>
      </div>`:""}

      <button class="btn btn-gold btn-block" id="cmpGive">${h("heart")} Give a Tribute in ${E(t.petName)}\u2019s Name</button>
      <button class="btn btn-outline btn-block" id="cmpShare" style="margin-top:8px">${h("share")} Share Campaign &amp; Copy Tribute Link</button>

      ${n.length?`<div class="shop-cat" style="margin-top:18px">Memorial Tributes &amp; Givers</div>
        ${n.map(l=>`
          <div class="feed-item">
            <div class="fi-icon">${h("heart")}</div>
            <div><b>${E(l.donor)}</b> \xB7 <span style="color:var(--accent-hi-c);font-weight:700">${T(l.gross)}</span>
              ${l.message?`<br><i style="color:#e6e2d8">\u201C${E(l.message)}\u201D</i>`:""}
              <span class="fi-time">${Yt(l.at)} \xB7 Verified Ledger #${l.seq}</span></div>
          </div>`).join("")}`:""}

      <p class="fine">${this._demoNote()}</p>`);let r=document.getElementById("modalBox");r.querySelector("#cmpGive").onclick=()=>this.donateModal(e,t),r.querySelector("#cmpShare").onclick=()=>{navigator.clipboard?.writeText(s),e.toast("Campaign tribute link copied to clipboard!","share")}},donateModal(e,t){let a=se(t.charityId),i=a?.impactTiers||[{amount:1500,label:"$15",desc:"Provides warm beds & nutritious food"},{amount:3500,label:"$35",desc:"Vaccines, microchip & wellness exam"},{amount:7500,label:"$75",desc:"Urgent veterinary diagnostic care"},{amount:15e3,label:"$150",desc:"Critical surgery & rescue sponsorship"}];e.modal(`
      <h2>${h("heart")} Give in ${E(t.petName)}\u2019s name</h2>
      <div class="modal-sub">Supporting <b>${E(a?.name||"the rescue charity")}</b>.
        <b>100% of your donation passes directly to the shelter.</b></div>

      <label>Choose a tribute amount &amp; real-world impact</label>
      <div class="give-row">
        ${i.map((r,l)=>`
          <button class="give-chip${l===1?" is-on":""}" data-amt="${r.amount}">
            ${r.label}
          </button>
        `).join("")}
      </div>

      <div class="district-blurb" id="giveTierNote" style="margin:8px 0 14px"></div>

      <label>Or enter a custom amount</label>
      <input id="giveOther" inputmode="decimal" placeholder="e.g. 50.00">

      <div class="give-break" id="giveBreak"></div>

      <label>Your Name / Family <span class="fine-inline">(optional)</span></label>
      <input id="giveName" maxlength="40" placeholder="${E(y.user?.name||"A caring friend")}">
      
      <label>Tribute message for the memorial wall <span class="fine-inline">(optional)</span></label>
          <input id="giveMsg" maxlength="140" placeholder="In loving memory of a wonderful soul.">

      <button class="btn btn-gold btn-block" id="giveGo">${h("heart")} Complete Tribute Donation</button>
      <p class="fine">${this._demoNote()}</p>`);let o=document.getElementById("modalBox"),n=i[1]?.amount||3500,s=()=>{let r=Oe("donation",n),l=i.find(u=>u.amount===n),d=o.querySelector("#giveTierNote");d&&(l?d.innerHTML=`\u2726 <b>Your impact:</b> ${E(l.desc)}`:d.innerHTML="\u2726 <b>Your impact:</b> 100% directly funds vital animal rescue operations & veterinary care.");let p=o.querySelector("#giveBreak");if(p){p.hasChildNodes()||(p.innerHTML=`
            <div class="give-break__row"><span>Your donation</span><b id="gb-gross"></b></div>
            <div class="give-break__row is-fee"><span>Direct processing (Stripe rate)</span><b id="gb-proc"></b></div>
            <div class="give-break__row is-fee"><span>Platform fee</span><b>${T(0)} (0%)</b></div>
            <div class="give-break__row is-total"><span>Delivered to ${E(a?.name||"the charity")}</span><b id="gb-net"></b></div>
          `);let u=p.querySelector("#gb-gross"),w=p.querySelector("#gb-proc"),f=p.querySelector("#gb-net");u&&(u.textContent=T(r.gross)),w&&(w.textContent="\u2212"+T(r.processor)),f&&(f.textContent=T(r.charity))}let g=o.querySelector("#giveGo");g&&(g.textContent=`Complete Tribute Donation (${T(r.gross)})`)};s(),o.querySelectorAll("[data-amt]").forEach(r=>{r.onclick=()=>{o.querySelectorAll("[data-amt]").forEach(l=>l.classList.remove("is-on")),r.classList.add("is-on"),o.querySelector("#giveOther").value="",n=+r.dataset.amt,s()}}),o.querySelector("#giveOther").oninput=r=>{let l=parseFloat(r.target.value);!isNaN(l)&&l>0&&(o.querySelectorAll("[data-amt]").forEach(d=>d.classList.remove("is-on")),n=we(l),s())},o.querySelector("#giveGo").onclick=async r=>{let l=r.currentTarget;if(n<100)return e.toast("Minimum donation is $1.00.","warning");let d=o.querySelector("#giveName").value.trim()||y.user?.name||"Anonymous",p=o.querySelector("#giveMsg").value.trim();l.disabled=!0,l.style.opacity=.5,l.textContent="Processing tribute\u2026";try{let g=await Q({kind:"donation",name:`Donation in memory of ${t.petName}`,amount:n/100,meta:{charity:t.charityId,campaignId:t.id}});if(!g.ok)return;y.user||y.continueAsGuest(!0);let u=g.entry;t.donations.push({at:u?.at||Date.now(),donor:d,message:p,gross:u?.gross??n,charity:u?.charity??n,seq:u?.seq??0}),V._persist(),e.closeModal(),this.renderPanel(e),e.toast(`${T(u?.charity??n)} delivered to ${W(t.charityId)} \u2014 thank you!`,5500,"heart"),this.thanksModal(e,t,u)}catch(g){e.toast(String(g.message),"warning"),l.disabled=!1,l.style.opacity=1,l.textContent="Complete Tribute Donation"}}},thanksModal(e,t,a){a&&(e.modal(`
      <h2>${h("dove")} Thank You for Giving</h2>
      <div class="modal-sub">Your tribute honors ${E(t.petName)} and saves living rescue animals.</div>
      <div class="give-break">
        <div class="give-break__row"><span>You gave</span><b>${T(a.gross)}</b></div>
        <div class="give-break__row is-fee"><span>Card processing</span><b>\u2212${T(a.processor)}</b></div>
        <div class="give-break__row is-total"><span>Delivered to ${E(W(t.charityId))}</span><b>${T(a.charity)}</b></div>
      </div>
      <div class="district-blurb" style="margin-top:14px">
        \u2726 <b>Cryptographically Recorded:</b> This transaction is entry <b>#${a.seq}</b> in the immutable SHA-256 ledger.
        Hash: <code>${E(a.hash.slice(0,16))}\u2026</code>
      </div>
      <button class="btn btn-gold btn-block" id="thanksLedger">${h("scroll")} View in Public Transparency Ledger</button>
      <p class="fine">${this._demoNote()}</p>`),document.getElementById("modalBox").querySelector("#thanksLedger").onclick=()=>this.ledgerModal(e))},async ledgerModal(e){let t=ne.totals(),a=qe(t.charity),i=ne.load().slice().reverse(),o=await ne.verify(),n=Object.entries(t.byCharity).sort((s,r)=>r[1]-s[1]).map(([s,r])=>({name:W(s)||s,cents:r}));e.modal(`
      <h2>${h("scroll")} Public Charity Transparency Ledger</h2>
      <div class="modal-sub">Every transaction this site has ever accepted is published and hash-chained in real time.
        100% cryptographic transparency with zero back-room adjustments.</div>

      <div class="ledger-tot">
        <div class="ledger-tot__big">
          <b>${T(t.charity)}</b><span>Delivered to Animal Charities</span>
        </div>
        <div class="ledger-tot__grid">
          <div><b>${T(t.gross)}</b><span>Total Raised</span></div>
          <div><b>${T(t.processor)}</b><span>Card Fees</span></div>
          <div><b>${T(t.ops)}</b><span>Infrastructure</span></div>
          <div><b>${t.count}</b><span>Verified Transactions</span></div>
        </div>
      </div>

      <!-- Real World Impact Tally -->
      <div class="impact-grid" style="margin:14px 0">
        <div class="impact-cell">
          <span class="impact-cell__val">${a.mealsProvided}</span>
          <span class="impact-cell__lbl">Rescue Meals</span>
        </div>
        <div class="impact-cell">
          <span class="impact-cell__val">${a.veterinaryExams}</span>
          <span class="impact-cell__lbl">Vet Exams</span>
        </div>
        <div class="impact-cell">
          <span class="impact-cell__val">${a.seniorComfortDays}</span>
          <span class="impact-cell__lbl">Hospice Days</span>
        </div>
        <div class="impact-cell">
          <span class="impact-cell__val">${a.emergencySurgeries}</span>
          <span class="impact-cell__lbl">Surgeries Funded</span>
        </div>
      </div>

      <div class="ledger-check ${o.ok?"is-ok":"is-bad"}">
        ${h(o.ok?"crest":"warning")}
        ${o.ok?`\u2726 Cryptographic Proof: SHA-256 hash-chain verified. All ${o.count} entries intact & balanced.`:`Entry #${o.seq}: ${E(o.why)}`}
      </div>

      ${n.length?`
        <div class="shop-cat" style="margin-top:16px">Total Giving Delivered by Rescue Organisation</div>
        ${n.map(s=>`
          <div class="ledger-row">
            <span>${E(s.name)}</span><b>${T(s.cents)}</b>
          </div>`).join("")}`:""}

      <div class="shop-cat">Statutory Allocation Table</div>
      <div class="ledger-splits">
        ${Object.entries(fe).map(([s,r])=>`
          <div class="ledger-row">
            <span>${E(r.label)}</span>
            <b>${ba(r.charity)} to charity</b>
          </div>`).join("")}
      </div>

      <div class="shop-cat">Live Append-Only Ledger Records</div>
      ${i.length?`
        <div class="ledger-list">
          ${i.map(s=>`
            <div class="ledger-entry">
              <div class="ledger-entry__head">
                <b>#${s.seq}</b> ${E(s.label)}
                <span>${Yt(s.at)}</span>
              </div>
              <div class="ledger-entry__nums">
                <span>in <b>${T(s.gross)}</b></span>
                <span>fee <b>${T(s.processor)}</b></span>
                <span class="is-good">charity <b>${T(s.charity)}</b></span>
                <span>ops <b>${T(s.ops)}</b></span>
              </div>
              <div class="ledger-entry__meta">
                ${s.charityId?E(W(s.charityId)||s.charityId)+" \xB7 ":""}${E(s.donor)}
                \xB7 <code>${E(s.hash.slice(0,14))}</code>
              </div>
            </div>`).join("")}
        </div>`:`<div class="cause-empty">${h("scroll",{size:28})}<p>No transactions yet recorded.</p></div>`}

      <button class="btn btn-outline btn-block" id="ledgerExport" style="margin-top:14px">
        ${h("book")} Export Cryptographic Audit Ledger (JSON)
      </button>
      <p class="fine">${this._demoNote()}</p>`),document.getElementById("modalBox").querySelector("#ledgerExport").onclick=()=>{let s=new Blob([ne.exportJSON()],{type:"application/json"}),r=document.createElement("a");r.href=URL.createObjectURL(s),r.download=`eternal-valley-charity-ledger-${new Date().toISOString().slice(0,10)}.json`,r.click(),setTimeout(()=>URL.revokeObjectURL(r.href),4e3),e.toast("Full cryptographic audit ledger downloaded.","book")}},_demoNote(){return"Eternal Valley operates under an open-source, 100% verified charitable pass-through model. Listed charities are verified 501(c)(3) nonprofits with public IRS filings."}};var be=typeof matchMedia<"u"?matchMedia("(prefers-reduced-motion: reduce)"):{matches:!1},kt="__rbMotion";function rt(e,t){return e[kt]||={},e[kt][t]?!1:(e[kt][t]=!0,!0)}var He=null;function ya(){return He||(He=new IntersectionObserver(e=>{for(let t of e)t.isIntersecting&&(t.target.classList.add("is-revealed"),He.unobserve(t.target))},{threshold:.08,rootMargin:"0px 0px -40px 0px"}),He)}var ee={enhance(e=document){return this.reveal(e),this.magnetic(e),this.tilt(e),this.ripple(e),e},reveal(e=document){let t=e.querySelectorAll?.("[data-reveal]:not(.is-revealed)")||[],a=ya();t.forEach((i,o)=>{if(!rt(i,"reveal"))return;let n=i.dataset.revealDelay??o*70;if(i.style.setProperty("--reveal-delay",`${n}ms`),be.matches){i.classList.add("is-revealed");return}a.observe(i)})},cascade(e,t="[data-reveal]",a=55){let i=[...e.querySelectorAll?.(t)||[]];return i.forEach((o,n)=>{if(o.setAttribute("data-reveal",""),o.style.setProperty("--reveal-delay",`${n*a}ms`),be.matches){o.classList.add("is-revealed");return}requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add("is-revealed")))}),i.length},magnetic(e=document){if(be.matches)return;let t=e.querySelectorAll?.(".btn-gold, .btn-lg, [data-magnetic]")||[];for(let a of t){if(!rt(a,"magnetic"))continue;let i=Number(a.dataset.magnetic)||.28,o=()=>{a.style.setProperty("--mx","0px"),a.style.setProperty("--my","0px")};a.addEventListener("pointermove",n=>{let s=a.getBoundingClientRect(),r=n.clientX-(s.left+s.width/2),l=n.clientY-(s.top+s.height/2);a.style.setProperty("--mx",`${r*i}px`),a.style.setProperty("--my",`${l*i}px`)}),a.addEventListener("pointerleave",o),a.addEventListener("pointerup",o)}},tilt(e=document){if(be.matches)return;let t=e.querySelectorAll?.("[data-tilt]")||[];for(let a of t){if(!rt(a,"tilt"))continue;let i=Number(a.dataset.tilt)||8;a.addEventListener("pointermove",o=>{let n=a.getBoundingClientRect(),s=(o.clientX-n.left)/n.width-.5,r=(o.clientY-n.top)/n.height-.5;a.style.setProperty("--tilt-x",`${-r*i}deg`),a.style.setProperty("--tilt-y",`${s*i}deg`),a.style.setProperty("--shine-x",`${(s+.5)*100}%`),a.style.setProperty("--shine-y",`${(r+.5)*100}%`)}),a.addEventListener("pointerleave",()=>{a.style.setProperty("--tilt-x","0deg"),a.style.setProperty("--tilt-y","0deg")})}},ripple(e=document){if(be.matches)return;let t=e.querySelectorAll?.(".btn")||[];for(let a of t)rt(a,"ripple")&&a.addEventListener("pointerdown",i=>{let o=a.getBoundingClientRect(),n=document.createElement("span");n.className="btn-ripple",n.style.left=`${i.clientX-o.left}px`,n.style.top=`${i.clientY-o.top}px`,a.appendChild(n),setTimeout(()=>n.remove(),620)})},cursorGlow(){if(be.matches||matchMedia("(pointer: coarse)").matches||document.querySelector(".cursor-glow"))return;let e=document.createElement("div");e.className="cursor-glow",document.body.appendChild(e);let t=innerWidth/2,a=innerHeight/2,i=t,o=a,n=0;addEventListener("pointermove",r=>{i=r.clientX,o=r.clientY,e.style.opacity="1",n||(n=requestAnimationFrame(s))},{passive:!0}),addEventListener("pointerleave",()=>{e.style.opacity="0"});function s(){t+=(i-t)*.16,a+=(o-a)*.16,e.style.transform=`translate3d(${t}px, ${a}px, 0) translate(-50%, -50%)`,n=Math.abs(i-t)>.4||Math.abs(o-a)>.4?requestAnimationFrame(s):0}return e},spark(e,t,a=22){if(be.matches)return;let i=document.createElement("div");i.className="spark-layer",document.body.appendChild(i);let o=getComputedStyle(document.documentElement);for(let n=0;n<a;n++){let s=document.createElement("i"),r=n/a*Math.PI*2+Math.random()*.4,l=40+Math.random()*90;s.style.left=`${e}px`,s.style.top=`${t}px`,s.style.setProperty("--dx",`${Math.cos(r)*l}px`),s.style.setProperty("--dy",`${Math.sin(r)*l-30}px`),s.style.setProperty("--dur",`${600+Math.random()*500}ms`),s.style.background=o.getPropertyValue(`--spec-${n%7+1}`).trim()||"#fff",i.appendChild(s)}setTimeout(()=>i.remove(),1300)},countUp(e,t,{from:a=0,ms:i=700,prefix:o="",suffix:n=""}={}){if(be.matches){e.textContent=`${o}${t}${n}`;return}let s=performance.now(),r=l=>{let d=Math.min(1,(l-s)/i),p=1-Math.pow(1-d,3);e.textContent=`${o}${Math.round(a+(t-a)*p)}${n}`,d<1&&requestAnimationFrame(r)};requestAnimationFrame(r)}};var lt={dawn:{label:"Dawn",ink:"18 20 30",surface:"30 28 40",text:"250 242 232",accent:"233 178 122",accentHi:"255 214 164",accentInk:"46 26 14",glow:"244 178 128",sky:["#2b2740","#6f5a7a","#d79a86","#f6c9a0"],spectrum:["#e88a8a","#f0ab7a","#f2d08a","#a8cf96","#8ab9d8","#9d9ada","#c99ad0"],stars:.35,aurora:.12},sunlit:{label:"Sunlit Daylight",ink:"16 22 20",surface:"26 34 30",text:"246 241 228",accent:"214 176 84",accentHi:"240 208 118",accentInk:"38 30 12",glow:"232 201 106",sky:["#3a5f7d","#7fb2d9","#c8dce8","#f2e2c4"],spectrum:["#e88a7a","#f2c063","#e8dd7a","#8fce8a","#7ab2e0","#9a8fd8","#c98fd0"],stars:0,aurora:0},day:{label:"Daylight",ink:"16 22 20",surface:"26 34 30",text:"246 241 228",accent:"214 176 84",accentHi:"240 208 118",accentInk:"38 30 12",glow:"232 201 106",sky:["#3a5f7d","#7fb2d9","#c8dce8","#f2e2c4"],spectrum:["#e88a7a","#f2c063","#e8dd7a","#8fce8a","#7ab2e0","#9a8fd8","#c98fd0"],stars:0,aurora:0},dusk:{label:"Dusk",ink:"20 16 26",surface:"34 26 36",text:"250 238 226",accent:"236 164 86",accentHi:"255 198 118",accentInk:"44 24 8",glow:"250 166 96",sky:["#241d3a","#4a3a6a","#c06a58","#f2a95f"],spectrum:["#f09a72","#f5b45f","#e8c96a","#8fc48f","#6fa8d8","#9282d8","#c682cc"],stars:.45,aurora:.25},night:{label:"Night",ink:"9 12 22",surface:"18 23 38",text:"232 238 250",accent:"212 184 118",accentHi:"245 224 160",accentInk:"24 20 10",glow:"178 198 255",sky:["#05070f","#101a33","#22304f","#3a4668"],spectrum:["#e0857f","#e8ab6a","#e8d98a","#8fd0a4","#7ab8e8","#a49ae8","#cf9ada"],stars:1,aurora:.55},blessing:{label:"Rain Blessing",ink:"12 18 28",surface:"22 30 46",text:"248 244 255",accent:"224 186 255",accentHi:"255 230 190",accentInk:"32 18 44",glow:"210 180 255",sky:["#18345c","#5a78aa","#b8a4d8","#f0d8e8"],spectrum:["#ff7e7e","#ffa85c","#ffe066","#7ee8a2","#66ccff","#a088ff","#f088e8"],stars:.15,aurora:.4}},va={spring:{bloom:"#f2b0cc",name:"Spring"},summer:{bloom:"#f3d84a",name:"Summer"},autumn:{bloom:"#e0913a",name:"Autumn"},winter:{bloom:"#dbe8f5",name:"Winter"}};function ct(e,t,a){return e+(t-e)*a}function Kt(e){return e.split(" ").map(Number)}function fa(e){return e.map(t=>Math.round(t)).join(" ")}function xt(e,t,a){let i=Kt(e),o=Kt(t);return fa(i.map((n,s)=>ct(n,o[s],a)))}function Jt(e){let t=parseInt(e.slice(1),16);return[t>>16&255,t>>8&255,t&255]}function wa([e,t,a]){return"#"+[e,t,a].map(i=>Math.round(i).toString(16).padStart(2,"0")).join("")}function Xt(e,t,a){let i=Jt(e),o=Jt(t);return wa(i.map((n,s)=>ct(n,o[s],a)))}var Et=["night","dawn","sunlit","dusk"];function $a(e){let t=e==="day"?"sunlit":e,a=Et.indexOf(t);return a>=0?Et[(a+1)%Et.length]:"sunlit"}var Mt=.12;function Qt(e){let t=e?.key==="day"?"sunlit":e?.key||"sunlit",a=lt[t]||lt.sunlit;if(!e||e.t===void 0||e.t<1-Mt)return{pal:a,blendT:0,nextPal:a};let i=lt[$a(t)]||lt.sunlit,o=(e.t-(1-Mt))/Mt;return{pal:a,nextPal:i,blendT:Math.min(1,Math.max(0,o))}}var ue={phase:null,season:null,mood:"clear",_subs:new Set,_timer:null,onChange(e){return this._subs.add(e),this.phase&&e(this.snapshot()),()=>this._subs.delete(e)},snapshot(){let{pal:e,nextPal:t,blendT:a}=Qt(this.phase),i=e.sky.map((n,s)=>Xt(n,t.sky[s],a)),o=e.spectrum.map((n,s)=>Xt(n,t.spectrum[s],a));return{key:this.phase.key,t:this.phase.t,label:e.label,season:this.season,seasonName:ot[this.season].name,mood:this.mood,moodLabel:(ke[this.mood]||ke.clear).label,sky:i,spectrum:o,accent:`rgb(${xt(e.accent,t.accent,a)})`,glow:`rgb(${xt(e.glow,t.glow,a)})`,stars:ct(e.stars,t.stars,a),aurora:ct(e.aurora,t.aurora,a),bloom:va[this.season].bloom,vividness:(ke[this.mood]||ke.clear).rainbow}},forcePhase(e){this._forced=e?{key:e,t:.5}:null,this.apply()},apply(){this.phase=this._forced||Ht(),this.season=Ut();let{pal:e,nextPal:t,blendT:a}=Qt(this.phase),i=this.snapshot(),o=document.documentElement,n=(r,l)=>o.style.setProperty(r,l),s=r=>xt(e[r],t[r],a);return n("--ink",s("ink")),n("--surface",s("surface")),n("--text",s("text")),n("--accent",s("accent")),n("--accent-hi",s("accentHi")),n("--accent-ink",s("accentInk")),n("--glow",s("glow")),i.sky.forEach((r,l)=>n(`--sky-${l+1}`,r)),i.spectrum.forEach((r,l)=>n(`--spec-${l+1}`,r)),n("--spectrum",`linear-gradient(90deg, ${i.spectrum.join(", ")})`),n("--bloom",i.bloom),n("--stars-opacity",i.stars.toFixed(3)),n("--vividness",i.vividness.toFixed(2)),o.dataset.phase=this.phase.key,o.dataset.season=this.season,o.dataset.mood=this.mood,this._subs.forEach(r=>{try{r(i)}catch(l){console.log("[theme]",l)}}),i},setMood(e){e!==this.mood&&(this.mood=e,this.apply())},init(){return this.apply(),clearInterval(this._timer),this._timer=setInterval(()=>this.apply(),6e4),document.addEventListener("visibilitychange",()=>{document.hidden||this.apply()}),this}};var m=null,ta=null,_=null,Zt=null,Pt=256,aa="rbv_thumbs_v1",ia="images/catalog/",ye=null,oa=Promise.race([fetch(ia+"manifest.json").then(e=>e.ok?e.json():[]).then(e=>(ye=new Set(e),ye)).catch(()=>(ye=new Set,ye)),new Promise(e=>setTimeout(()=>{ye||(ye=new Set),e(ye)},1e3))]);function It(e){let t=je[e]||e;return ye?.has(t)?ia+t+".jpg":null}var Ve=new Map,ve=null;try{ve=JSON.parse(sessionStorage.getItem(aa)||"{}")}catch{ve={}}var dt=null;async function sa(){return m?!0:(Zt||=(async()=>{let[e,t,a]=await Promise.all([import("./three.module-BUNQKYZR.js"),import("./RoomEnvironment-GYRO3FET.js"),import("./materials-AEG3BR3A.js")]);return m=e,ta=t.RoomEnvironment,_=a.Surfaces,!0})(),Zt)}var ea=!1;function Sa(){if(dt)return dt;if(ea)return null;try{let e=document.createElement("canvas");e.width=e.height=Pt;let t=new m.WebGLRenderer({canvas:e,antialias:!0,alpha:!0});t.setPixelRatio(1),t.setSize(Pt,Pt,!1),t.toneMapping=m.ACESFilmicToneMapping,t.toneMappingExposure=1,t.outputColorSpace=m.SRGBColorSpace,t.shadowMap.enabled=!0,t.shadowMap.type=m.PCFSoftShadowMap;let a=new m.Scene;a.background=null;let i=new m.PMREMGenerator(t),o=i.fromScene(new ta,.04).texture;a.environment=o,a.environmentIntensity=.85;let n=new m.DirectionalLight(16773852,2.6);n.position.set(4,7,6),n.castShadow=!0,n.shadow.mapSize.set(1024,1024),Object.assign(n.shadow.camera,{left:-6,right:6,top:6,bottom:-6,near:.5,far:40}),n.shadow.bias=-.0012,a.add(n);let s=new m.DirectionalLight(12375295,1.5);s.position.set(-6,4,-5),a.add(s);let r=new m.PlaneGeometry(16,16),l=new m.ShadowMaterial({opacity:.28}),d=new m.Mesh(r,l);d.rotation.x=-Math.PI/2,d.receiveShadow=!0,a.add(d);let p=new m.PerspectiveCamera(32,1,.1,200);return dt={renderer:t,scene:a,camera:p,key:n,rim:s,floor:d,pmrem:i},dt}catch(e){return ea=!0,console.log("[thumbs] studio renderer init failed:",e),null}}function j(e,t,a){return new m.Vector3(e,t,a)}function b(e,t,a=[0,0,0],i=[0,0,0],o=1){let n=new m.Mesh(e,t);return n.position.set(...a),n.rotation.set(...i),n.scale.setScalar(o),n.castShadow=n.receiveShadow=!0,n}function Fe(e,t,a,i,o=.04){let n=new m.Shape,s=Math.min(e,t)*o;n.moveTo(-e/2+s,-t/2),n.lineTo(e/2-s,-t/2),n.quadraticCurveTo(e/2,-t/2,e/2,-t/2+s),n.lineTo(e/2,t/2-s),n.quadraticCurveTo(e/2,t/2,e/2-s,t/2),n.lineTo(-e/2+s,t/2),n.quadraticCurveTo(-e/2,t/2,-e/2,t/2-s),n.lineTo(-e/2,-t/2+s),n.quadraticCurveTo(-e/2,-t/2,-e/2+s,-t/2);let r=new m.ExtrudeGeometry(n,{depth:a,bevelEnabled:!0,bevelSize:a*.08,bevelThickness:a*.08,bevelSegments:2,curveSegments:8});return r.center(),b(r,i)}function na(e,t,a=.45){let i=new m.PlaneGeometry(e,t,2,2),o=i.attributes.position;for(let n=0;n<o.count;n++){let s=o.getX(n),r=o.getY(n),l=s/(e*.5),d=r/(t*.5);o.setZ(n,(1-l*l)*a*(1-d*.25))}return i.computeVertexNormals(),i}function ka(e,t=1,a=!1,i=0){let o=new m.Group,n=a?28:24;for(let s=0;s<n;s++){let r=Math.acos(1-2*((s+.5)/n)),l=s*2.39996+i,d=t*(.35+.55*Math.sin(s*1.7%Math.PI)),p=Math.sin(r)*Math.cos(l)*d,g=Math.cos(r)*(d*(a?.65:.85)),u=Math.sin(r)*Math.sin(l)*d,w=t*(a?.45:.85),f=t*(a?1.45:.95),M=na(w,f,.45),L=b(M,e,[p,g,u],[(Math.sin(s*1.3)-.5)*.8,l+Math.PI*.5,(Math.cos(s*1.7)-.5)*.5]);o.add(L)}return o}function Ct(e,{trunkH:t=1.5,crownR:a=1.35,weeping:i=!1}={}){let o=new m.Group,n=_.bark(1.2),s=new m.CylinderGeometry(.09,.22,t,14);o.add(b(s,n,[0,t/2,0]));for(let d=0;d<4;d++){let p=d/4*Math.PI*2+.3,g=a*.55,u=new m.CylinderGeometry(.035,.07,g,6);u.rotateZ(.68),u.rotateY(p),u.translate(Math.cos(p)*(g*.4),t*.85,Math.sin(p)*(g*.4)),o.add(b(u,n))}let r=_.foliage(1.4,e),l=ka(r,a,i);if(l.position.y=t+a*.45,i)for(let d=0;d<16;d++){let p=d/16*Math.PI*2,g=a*(.75+d%3*.22),u=a*(1.2+d%2*.4),w=na(a*.38,u,.35);w.rotateY(p+Math.PI*.5),w.translate(Math.cos(p)*g,t+a*.2-u*.35,Math.sin(p)*g),o.add(b(w,r))}return o.add(l),o}var mt={it_headstone_classic(){let e=new m.Group,t=_.granite(.7),a=Fe(1.5,.22,.55,t);a.position.y=.11,e.add(a);let i=new m.Shape;i.moveTo(-.55,0),i.lineTo(-.55,.75),i.absarc(0,.75,.55,Math.PI,0,!0),i.lineTo(.55,0),i.closePath();let o=new m.ExtrudeGeometry(i,{depth:.2,bevelEnabled:!0,bevelSize:.02,bevelThickness:.02,bevelSegments:2,curveSegments:16});return e.add(b(o,t,[0,.22,-.1])),e},it_headstone_heart(){let e=new m.Group,t=_.marble(.6),a=Fe(1.4,.2,.5,t);a.position.y=.1,e.add(a);let i=new m.Shape;i.moveTo(0,-.5),i.bezierCurveTo(-.75,.1,-.4,.72,0,.4),i.bezierCurveTo(.4,.72,.75,.1,0,-.5);let o=new m.ExtrudeGeometry(i,{depth:.2,bevelEnabled:!0,bevelSize:.05,bevelThickness:.05,bevelSegments:4,curveSegments:24});return e.add(b(o,t,[0,.72,-.1])),e},it_obelisk(){let e=new m.Group,t=_.marble(.5);return e.add(b(new m.BoxGeometry(.8,.16,.8),t,[0,.08,0])),e.add(b(new m.BoxGeometry(.6,.14,.6),t,[0,.23,0])),e.add(b(new m.CylinderGeometry(.19,.26,1.5,4),t,[0,1.05,0],[0,Math.PI/4,0])),e.add(b(new m.ConeGeometry(.27,.34,4),t,[0,1.97,0],[0,Math.PI/4,0])),e},it_statue_dog(){let e=new m.Group,t=_.marble(.5);e.add(b(new m.CylinderGeometry(.62,.68,.2,32),t,[0,.1,0])),e.add(b(new m.CylinderGeometry(.56,.62,.1,32),t,[0,.24,0]));let a=b(new m.SphereGeometry(.3,24,18),t,[-.22,.5,0]);a.scale.set(1,.92,.78),e.add(a);let i=b(new m.CapsuleGeometry(.21,.42,8,20),t,[.06,.7,0],[0,0,-.34]);i.scale.set(1,1,.86),e.add(i);for(let r of[-.14,.14])e.add(b(new m.CapsuleGeometry(.072,.34,6,14),t,[.26,.47,r])),e.add(b(new m.SphereGeometry(.085,14,10),t,[.3,.31,r]));let o=b(new m.SphereGeometry(.19,24,18),t,[.26,1.06,0]);o.scale.set(1,1,.92),e.add(o);let n=b(new m.CapsuleGeometry(.085,.16,6,14),t,[.44,1,0],[0,0,Math.PI/2-.18]);e.add(n),e.add(b(new m.SphereGeometry(.045,12,10),t,[.53,.99,0]));for(let r of[-.13,.13]){let l=b(new m.CapsuleGeometry(.048,.15,5,12),t,[.19,1.18,r],[.26*Math.sign(r),0,.42]);l.scale.set(1,1,.5),e.add(l)}let s=new m.CatmullRomCurve3([new j(-.45,.4,0),new j(-.6,.56,0),new j(-.58,.78,0),new j(-.42,.86,0)]);return e.add(b(new m.TubeGeometry(s,20,.055,10),t)),e},it_statue_cat(){let e=new m.Group,t=_.marble(.5);e.add(b(new m.CylinderGeometry(.58,.64,.18,32),t,[0,.09,0])),e.add(b(new m.CylinderGeometry(.52,.58,.09,32),t,[0,.22,0]));let a=b(new m.CylinderGeometry(.2,.4,.78,28),t,[-.02,.65,0]);a.scale.set(1,1,.88),e.add(a);let i=b(new m.SphereGeometry(.28,22,16),t,[-.12,.4,0]);i.scale.set(1,.78,.9),e.add(i);for(let s of[-.12,.12])e.add(b(new m.CapsuleGeometry(.055,.3,6,14),t,[.2,.42,s])),e.add(b(new m.SphereGeometry(.068,14,10),t,[.24,.29,s]));let o=b(new m.SphereGeometry(.2,24,18),t,[.03,1.14,0]);o.scale.set(1,.94,.94),e.add(o),e.add(b(new m.SphereGeometry(.085,14,12),t,[.17,1.08,0]));for(let s of[-.11,.11])e.add(b(new m.ConeGeometry(.082,.19,4),t,[0,1.32,s],[0,Math.PI/4,s>0?-.22:.22]));let n=new m.CatmullRomCurve3([new j(-.3,.32,.1),new j(-.5,.3,.24),new j(-.4,.3,.46),new j(-.12,.31,.5),new j(.16,.32,.4)]);return e.add(b(new m.TubeGeometry(n,26,.058,10),t)),e},it_plaque_bronze(){let e=new m.Group,t=_.bronze(.8),a=_.limestone(1.2);e.add(b(new m.BoxGeometry(1.5,.18,.9),a,[0,.09,0]));let i=Fe(1.25,.72,.07,t,.06);return i.position.set(0,.3,.06),i.rotation.x=-.42,e.add(i),e},it_oak(){return Ct(6197070,{trunkH:1.5,crownR:1.4})},it_willow(){return Ct(8695148,{trunkH:1.3,crownR:1.35,weeping:!0})},it_cherry(){return Ct(15907023,{trunkH:1.45,crownR:1.35})},it_rosebed(){let e=new m.Group,t=_.limestoneDark(2).clone();t.color.setHex(7035206),e.add(b(new m.CylinderGeometry(1.05,1.1,.24,28),t,[0,.12,0]));let a=_.foliage(1,5144389),i=_.petal(1,12857930);for(let o=0;o<13;o++){let n=o/13*Math.PI*2+o*.7,s=.28+o%3*.26,r=.34+o%4*.1,l=Math.cos(n)*s,d=Math.sin(n)*s;e.add(b(new m.CylinderGeometry(.022,.03,r,6),a,[l,.24+r/2,d]));let p=new m.Group;for(let g=0;g<3;g++)p.add(b(new m.IcosahedronGeometry(.085-g*.018,1),i,[0,g*.03,0],[g*.9,g*.7,0]));p.position.set(l,.24+r,d),e.add(p)}return e},it_wildflow(){let e=new m.Group,t=_.grass(3).clone();e.add(b(new m.CylinderGeometry(1.1,1.12,.16,28),t,[0,.08,0]));let a=_.foliage(1,6261322),i=[15980618,15233866,14181275,16446432,9404376];for(let o=0;o<22;o++){let n=o*2.399,s=Math.sqrt(o/22)*.95,r=.26+o*7%5*.07,l=Math.cos(n)*s,d=Math.sin(n)*s;e.add(b(new m.CylinderGeometry(.014,.018,r,5),a,[l,.16+r/2,d]));let p=_.petal(1,i[o%i.length]),g=new m.Group;for(let u=0;u<5;u++){let w=u/5*Math.PI*2;g.add(b(new m.SphereGeometry(.045,10,8),p,[Math.cos(w)*.05,0,Math.sin(w)*.05],[0,0,0],1))}g.position.set(l,.16+r,d),g.scale.set(1,.5,1),e.add(g)}return e},it_cactus(){let e=new m.Group,t=_.sand(2),a=_.foliage(1.6,5077573);e.add(b(new m.CylinderGeometry(.95,1,.16,28),t,[0,.08,0])),e.add(b(new m.CapsuleGeometry(.24,1.5,6,20),a,[0,1.06,0])),e.add(b(new m.CapsuleGeometry(.13,.5,6,16),a,[-.4,1,0],[0,0,.5])),e.add(b(new m.CapsuleGeometry(.13,.42,6,16),a,[.38,1.24,0],[0,0,-.55]));let i=_.petal(1,15760028);return e.add(b(new m.SphereGeometry(.11,12,10),i,[0,1.86,0])),e.add(b(new m.SphereGeometry(.075,12,10),i,[-.55,1.24,0])),e},it_bench(){let e=new m.Group,t=_.timber(1.1),a=_.iron(1.2);for(let i=0;i<3;i++)e.add(b(new m.BoxGeometry(1.9,.075,.17),t,[0,.5,-.19+i*.19]));for(let i=0;i<3;i++)e.add(b(new m.BoxGeometry(1.9,.16,.07),t,[0,.66+i*.19,-.29],[.16,0,0]));for(let i of[-.8,.8])e.add(b(new m.BoxGeometry(.07,.5,.07),a,[i,.25,.19])),e.add(b(new m.BoxGeometry(.07,.5,.07),a,[i,.25,-.24])),e.add(b(new m.BoxGeometry(.07,.06,.52),a,[i,.47,-.03])),e.add(b(new m.TorusGeometry(.16,.028,8,20,Math.PI),a,[i,.72,-.27],[0,Math.PI/2,0]));return e},it_fountain(){let e=new m.Group,t=_.marble(.7),a=new m.MeshPhysicalMaterial({color:4163240,roughness:.08,metalness:.02,transmission:1,thickness:2,ior:1.333,transparent:!1,clearcoat:1,clearcoatRoughness:.02,attenuationColor:new m.Color(669772),attenuationDistance:4,envMapIntensity:2});e.add(b(new m.CylinderGeometry(1.1,1.18,.34,40),t,[0,.17,0])),e.add(b(new m.TorusGeometry(1.1,.075,12,40),t,[0,.34,0],[Math.PI/2,0,0])),e.add(b(new m.CylinderGeometry(1.02,1.02,.06,40),a,[0,.32,0])),e.add(b(new m.CylinderGeometry(.13,.2,.62,20),t,[0,.64,0])),e.add(b(new m.CylinderGeometry(.44,.28,.14,28),t,[0,1,0])),e.add(b(new m.CylinderGeometry(.4,.4,.04,28),a,[0,1.06,0])),e.add(b(new m.CylinderGeometry(.05,.07,.3,14),t,[0,1.2,0])),e.add(b(new m.SphereGeometry(.11,18,14),a,[0,1.4,0]));for(let i=0;i<8;i++){let o=i/8*Math.PI*2;e.add(b(new m.CylinderGeometry(.014,.02,.66,6),a,[Math.cos(o)*.4,.7,Math.sin(o)*.4]))}return e},it_lantern(){let e=new m.Group,t=_.iron(1),a=_.glass(),i=new m.MeshStandardMaterial({color:16767392,emissive:16755517,emissiveIntensity:3.4,roughness:.4});e.add(b(new m.CylinderGeometry(.3,.36,.12,8),t,[0,.06,0])),e.add(b(new m.CylinderGeometry(.06,.06,.6,8),t,[0,.4,0])),e.add(b(new m.CylinderGeometry(.26,.3,.08,8),t,[0,.74,0])),e.add(b(new m.CylinderGeometry(.25,.25,.52,8,1,!0),a,[0,1.04,0]));for(let o=0;o<8;o++){let n=o/8*Math.PI*2+Math.PI/8;e.add(b(new m.BoxGeometry(.035,.52,.035),t,[Math.cos(n)*.24,1.04,Math.sin(n)*.24]))}return e.add(b(new m.SphereGeometry(.11,16,12),i,[0,1,0],[0,0,0],1)),e.add(b(new m.ConeGeometry(.3,.24,8),t,[0,1.42,0])),e.add(b(new m.TorusGeometry(.1,.022,8,18),t,[0,1.62,0],[Math.PI/2,0,0])),e},it_fence(){let e=new m.Group,t=_.iron(1.4);e.add(b(new m.BoxGeometry(2.2,.05,.05),t,[0,.62,0])),e.add(b(new m.BoxGeometry(2.2,.05,.05),t,[0,.16,0]));for(let a=0;a<=9;a++){let i=-1.05+a/9*2.1;e.add(b(new m.CylinderGeometry(.024,.024,.82,8),t,[i,.41,0])),e.add(b(new m.ConeGeometry(.05,.13,8),t,[i,.88,0]))}for(let a of[-1.1,1.1])e.add(b(new m.BoxGeometry(.08,1.05,.08),t,[a,.52,0])),e.add(b(new m.SphereGeometry(.07,14,10),t,[a,1.08,0]));for(let a=0;a<4;a++)e.add(b(new m.TorusGeometry(.11,.018,8,20),t,[-.79+a*.53,.39,0]));return e},it_windchime(){let e=new m.Group,t=_.timber(.8),a=new m.MeshStandardMaterial({color:10134704,roughness:.22,metalness:1}),i=new m.MeshStandardMaterial({color:7035460,roughness:.92});e.add(b(new m.TorusGeometry(.11,.022,10,22),i,[0,2.34,0],[Math.PI/2,0,0])),e.add(b(new m.CylinderGeometry(.014,.014,.22,8),i,[0,2.14,0])),e.add(b(new m.CylinderGeometry(.46,.46,.075,32),t,[0,2,0]));let o=[.95,.84,.72,.62,.72,.84];for(let s=0;s<6;s++){let r=s/6*Math.PI*2+.5,l=Math.cos(r)*.33,d=Math.sin(r)*.33;e.add(b(new m.CylinderGeometry(.011,.011,.2,6),i,[l,1.88,d]));let p=b(new m.CylinderGeometry(.055,.055,o[s],18,1,!0),a,[l,1.78-o[s]/2,d]);p.material.side=m.DoubleSide,e.add(p),e.add(b(new m.CylinderGeometry(.055,.055,.012,18),a,[l,1.78,d]))}e.add(b(new m.CylinderGeometry(.011,.011,.86,6),i,[0,1.45,0])),e.add(b(new m.CylinderGeometry(.2,.2,.045,26),t,[0,1,0])),e.add(b(new m.CylinderGeometry(.011,.011,.34,6),i,[0,.8,0]));let n=Fe(.3,.42,.03,t,.1);return n.position.set(0,.44,0),n.rotation.y=.35,e.add(n),e},it_gazebo(){let e=new m.Group,t=_.marble(.6).clone();t.color.setHex(16052972);let a=_.limestone(2);e.add(b(new m.CylinderGeometry(1.6,1.7,.2,8),a,[0,.1,0])),e.add(b(new m.CylinderGeometry(1.5,1.5,.1,8),t,[0,.24,0]));for(let i=0;i<8;i++){let o=i/8*Math.PI*2,n=Math.cos(o)*1.3,s=Math.sin(o)*1.3;e.add(b(new m.CylinderGeometry(.075,.09,1.5,12),t,[n,1,s])),e.add(b(new m.BoxGeometry(.14,.1,.14),t,[n,1.79,s]));let r=(i+1)/8*Math.PI*2,l=(n+Math.cos(r)*1.3)/2,d=(s+Math.sin(r)*1.3)/2;e.add(b(new m.BoxGeometry(1,.06,.06),t,[l,.62,d],[0,-o-Math.PI/8,0]))}return e.add(b(new m.CylinderGeometry(.06,1.75,.62,8),t,[0,2.1,0])),e.add(b(new m.SphereGeometry(.13,16,12),t,[0,2.5,0])),e},g_flowers(){let e=new m.Group,t=_.ceramic(1).clone();t.color.setHex(15986145),t.roughness=.78,t.clearcoat=0;let a=_.foliage(1,5538634),i=b(new m.CylinderGeometry(.5,.09,.92,24,1,!0),t,[0,.46,0]);i.material.side=m.DoubleSide,e.add(i),e.add(b(new m.TorusGeometry(.5,.032,10,32),t,[0,.92,0],[Math.PI/2,0,0]));let o=new m.MeshPhysicalMaterial({color:12857930,roughness:.34,sheen:1,sheenColor:new m.Color(16748448)});e.add(b(new m.TorusGeometry(.14,.036,10,26),o,[0,.26,0],[Math.PI/2,0,0]));let n=[15225711,16110557,15980618,16512748,13207512,15698506];for(let r=0;r<15;r++){let l=r*2.399,d=Math.sqrt(r/15)*.44,p=Math.cos(l)*d,g=Math.sin(l)*d,u=1+(.44-d)*.34;e.add(b(new m.CylinderGeometry(.016,.019,.3,6),a,[p*.72,u-.2,g*.72]));let w=_.petal(1,n[r%n.length]),f=new m.Group;for(let M=0;M<6;M++){let L=M/6*Math.PI*2+r,P=b(new m.SphereGeometry(.062,12,10),w,[Math.cos(L)*.062,0,Math.sin(L)*.062]);P.scale.set(1,.62,1),f.add(P)}f.add(b(new m.SphereGeometry(.038,12,10),_.petal(1,15249978),[0,.022,0])),f.position.set(p,u,g),e.add(f)}let s=_.foliage(1,4880962);for(let r=0;r<5;r++){let l=r/5*Math.PI*2+.6,d=b(new m.SphereGeometry(.12,12,8),s,[Math.cos(l)*.5,.98,Math.sin(l)*.5],[0,-l,.5]);d.scale.set(1,.16,.5),e.add(d)}return e},g_candle(){let e=new m.Group,t=_.wax(1),a=_.glass(),i=new m.MeshStandardMaterial({color:16773320,emissive:16756794,emissiveIntensity:4.2,roughness:.3});e.add(b(new m.CylinderGeometry(.4,.38,1,32,1,!0),a,[0,.5,0])),e.add(b(new m.CylinderGeometry(.38,.38,.05,32),a,[0,.03,0])),e.add(b(new m.CylinderGeometry(.33,.33,.66,32),t,[0,.38,0])),e.add(b(new m.CylinderGeometry(.012,.012,.1,6),new m.MeshStandardMaterial({color:2760984,roughness:.9}),[0,.74,0]));let o=b(new m.SphereGeometry(.08,16,14),i,[0,.84,0]);return o.scale.set(.72,1.7,.72),o.castShadow=!1,e.add(o),e},g_ball(){let e=new m.Group,t=.62,a=new m.MeshPhysicalMaterial({color:13164092,roughness:.95,sheen:1,sheenRoughness:.85,sheenColor:new m.Color(15004572)}),i=new m.MeshStandardMaterial({color:16250350,roughness:.62});e.add(b(new m.SphereGeometry(t,48,36),a,[0,t,0]));let o=[];for(let r=0;r<=160;r++){let l=r/160*Math.PI*2,d=Math.sin(l*2)*.62,p=t*1.004;o.push(new j(Math.cos(l)*Math.cos(d)*p,Math.sin(d)*p,Math.sin(l)*Math.cos(d)*p))}let n=new m.CatmullRomCurve3(o,!0),s=b(new m.TubeGeometry(n,200,.032,8,!0),i,[0,t,0]);return s.castShadow=!1,e.add(s),e},g_bone(){let e=new m.Group,t=_.ceramic(1).clone();t.color.setHex(15788244),e.add(b(new m.CapsuleGeometry(.13,.9,8,20),t,[0,.15,0],[0,0,Math.PI/2]));for(let a of[-.58,.58])for(let i of[-.13,.13])e.add(b(new m.SphereGeometry(.19,18,14),t,[a,.16,i]));return e},g_letter(){let e=new m.Group,t=_.ceramic(1).clone();t.color.setHex(16183778),t.roughness=.85,t.clearcoat=0;let a=Fe(1.5,1,.045,t,.02);a.position.set(0,.55,0),a.rotation.x=-.28,e.add(a);let i=new m.Shape;i.moveTo(-.75,.5),i.lineTo(0,0),i.lineTo(.75,.5),i.closePath();let o=b(new m.ExtrudeGeometry(i,{depth:.02,bevelEnabled:!1}),t,[0,.55,.03],[-.28,0,0]);e.add(o);let n=new m.MeshPhysicalMaterial({color:11022894,roughness:.42,clearcoat:.5});return e.add(b(new m.CylinderGeometry(.14,.15,.05,20),n,[0,.5,.07],[Math.PI/2-.28,0,0])),e},g_balloon(){let e=new m.Group,t=new m.MeshPhysicalMaterial({color:14704767,roughness:.18,clearcoat:.9,clearcoatRoughness:.12,transmission:.12,thickness:.4}),a=b(new m.SphereGeometry(.6,40,32),t,[0,1.5,0]);a.scale.set(1,1.2,1),e.add(a),e.add(b(new m.ConeGeometry(.09,.16,14),t,[0,.79,0],[Math.PI,0,0]));let i=new m.CatmullRomCurve3([new j(0,.76,0),new j(.1,.5,.06),new j(-.08,.26,-.04),new j(.05,.02,.02)]);return e.add(b(new m.TubeGeometry(i,24,.012,6),new m.MeshStandardMaterial({color:15920608,roughness:.8}))),e},g_wreath(){let e=new m.Group,t=_.foliage(1.6,3761471);e.add(b(new m.TorusGeometry(.62,.13,16,44),t,[0,.14,0],[Math.PI/2,0,0]));for(let o=0;o<26;o++){let n=o/26*Math.PI*2,s=.62+o%3*.045;e.add(b(new m.IcosahedronGeometry(.11,1),t,[Math.cos(n)*s,.16+Math.sin(o*2.1)*.05,Math.sin(n)*s],[o,n,0],.8+o%4*.15))}let a=new m.MeshPhysicalMaterial({color:12071482,roughness:.25,clearcoat:.8});for(let o=0;o<9;o++){let n=o*2.399;e.add(b(new m.SphereGeometry(.05,14,10),a,[Math.cos(n)*.63,.24,Math.sin(n)*.63]))}let i=new m.MeshPhysicalMaterial({color:12857930,roughness:.32,sheen:1,sheenColor:new m.Color(16748448)});for(let o of[-1,1])e.add(b(new m.TorusGeometry(.16,.05,10,24),i,[o*.16,.2,-.6],[.5,0,o*.5]));return e},g_donation(){let e=new m.Group,t=new m.MeshPhysicalMaterial({color:12857930,roughness:.25,clearcoat:.85,clearcoatRoughness:.1}),a=new m.Shape;a.moveTo(0,-.5),a.bezierCurveTo(-.78,.12,-.42,.74,0,.42),a.bezierCurveTo(.42,.74,.78,.12,0,-.5);let i=new m.ExtrudeGeometry(a,{depth:.3,bevelEnabled:!0,bevelSize:.09,bevelThickness:.09,bevelSegments:6,curveSegments:24});i.center();let o=b(i,t,[0,.75,0],[0,0,0]);e.add(o);let n=_.ceramic(1).clone();n.color.setHex(14204838);for(let s of[-.34,.34]){let r=b(new m.SphereGeometry(.38,20,16,0,Math.PI*2,0,Math.PI/2),n,[s,.16,0]);r.scale.set(1,.5,.78),r.rotation.z=s<0?.2:-.2,e.add(r)}return e}},je={hs_classic:"it_headstone_classic",hs_heart:"it_headstone_heart",hs_obelisk:"it_obelisk",hs_slab:"it_plaque_bronze",hs_statue:"it_statue_dog"};function xa(e,t,a=1.22){let i=new m.Box3().setFromObject(e),o=i.getSize(new j),n=i.getCenter(new j),s=Math.max(o.x,o.y,o.z)*.5*a,r=m.MathUtils.degToRad(t.fov),l=s/Math.sin(r/2),d=new j(.72,.46,1).normalize();return t.position.copy(d.multiplyScalar(l)).add(n),t.lookAt(n),t.near=Math.max(.05,l-s*3),t.far=l+s*6,t.updateProjectionMatrix(),{center:n,radius:s}}function Ea(e){e.traverse(t=>{t.isMesh&&t.geometry?.dispose()})}function Tt(e){let t=je[e]||e;if(Ve.has(t))return Ve.get(t);if(ve[t])return Ve.set(t,ve[t]),ve[t];let a=mt[t];if(!a)return null;if(!m)return sa().then(()=>Ma()),null;let i=Sa();if(!i)return null;let{renderer:o,scene:n,camera:s,floor:r}=i,l=a();n.add(l);let{center:d,radius:p}=xa(l,s);r.position.y=new m.Box3().setFromObject(l).min.y-.001,r.visible=!0,o.render(n,s);let g=o.domElement.toDataURL("image/png");return n.remove(l),Ea(l),Ve.set(t,g),ve[t]=g,g}var ei=[...Object.keys(mt),...Object.keys(je)],ra=e=>!!mt[je[e]||e];async function Ma(e=Object.keys(mt),t){await sa();let a=0;for(let i of e){if(!Ve.has(i)&&!ve[i]){try{Tt(i)}catch(o){console.log("[thumbs]",i,o)}await new Promise(o=>{typeof window<"u"&&"requestIdleCallback"in window?window.requestIdleCallback(o,{timeout:100}):setTimeout(o,40)})}t?.(++a/e.length,i)}Ca(),Pa()}function Pa(e=document){for(let t of e.querySelectorAll?.('img[data-thumb]:not([src^="data:"])')||[]){let a=Tt(t.dataset.thumb);a&&(t.src=a,t.removeAttribute("data-thumb-pending"))}}function Ca(){try{sessionStorage.setItem(aa,JSON.stringify(ve))}catch{}}function Pe(e,{size:t=56,alt:a="",cls:i=""}={}){let o=It(e);if(o)return`<img class="thumb thumb-photo ${i}" src="${o}" width="${t}" height="${t}" alt="${a}" loading="lazy" decoding="async">`;if(!ra(e))return"";let n=Tt(e),s=je[e]||e;return`<img class="thumb ${i}" src="${n||"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}"${n?"":` data-thumb="${s}" data-thumb-pending`} width="${t}" height="${t}" alt="${a}" loading="lazy">`}var B={init:()=>{},play:()=>{},pause:()=>{},setMode:()=>{},setVolume:()=>{},setSolfeggio:()=>{},setBinaural:()=>{},playBowlGong:()=>{},playChime:()=>{},playSolfeggioBell:()=>{},playCandleShimmer:()=>{},playHarmonicChord:()=>{},mode:"silent",volume:0,solfeggio:"432",binaural:"none",isPlaying:!1,SOLFEGGIO:{432:{name:"432Hz (Cosmic Tuning)",freq:432},528:{name:"528Hz (DNA Repair)",freq:528},963:{name:"963Hz (Divine Light)",freq:963}},BINAURAL:{none:{name:"None",freq:0},delta:{name:"Delta (Deep Sleep)",freq:2},theta:{name:"Theta (Meditation)",freq:6}}};window.Soundscape=B;var la=[{id:"anniv_candle",name:"Anniversary Eternal Flame",price:799,emoji:"\u{1F56F}\uFE0F"},{id:"anniv_wreath",name:"Anniversary Remembrance Wreath",price:1499,emoji:"\u{1F490}"},{id:"anniv_star",name:"Anniversary Star Dedication",price:2499,emoji:"\u2B50"}];function ht(e){let t=[],a=new Date,i=new Date(a.getFullYear(),a.getMonth(),a.getDate());for(let[o,n]of Object.entries(e||{})){if(!n)continue;let s=n.memorial||(n.status?n.memorial:null);if(!s)continue;let r=s.petName||"Your Pet",l=s.species||"pet",d=s.petProfile?.passing;if(!d&&s.years){let L=s.years.match(/(\d{4}-\d{2}-\d{2})/)||s.years.match(/(\d{4})/);L&&(d=L[0].length===4?`${L[0]}-01-01`:L[0])}if(!d)continue;let p=String(d).split(/[-/]/),g;if(p.length===3?g=new Date(parseInt(p[0],10),parseInt(p[1],10)-1,parseInt(p[2],10)):g=new Date(d),isNaN(g.getTime()))continue;let u=new Date(i.getFullYear(),g.getMonth(),g.getDate()),w=u;u.getTime()<i.getTime()&&(w=new Date(i.getFullYear()+1,g.getMonth(),g.getDate()));let f=w.getTime()-i.getTime(),M=Math.round(f/(1e3*60*60*24));if(M>=0&&M<=7){let L=w.getFullYear()-g.getFullYear();t.push({plotId:o,petName:r,species:l,crossingDate:d,daysUntil:M,yearsAgo:Math.max(1,L)})}}return t}function ca(e,t){let a=new Date(t);isNaN(a.getTime())&&(a=new Date);let i=M=>M.toString().padStart(2,"0"),o=a.getFullYear(),n=i(a.getMonth()+1),s=i(a.getDate()),r=`${o}${n}${s}`,l=new Date(a);l.setDate(l.getDate()+1);let d=l.getFullYear(),p=i(l.getMonth()+1),g=i(l.getDate()),u=`${d}${p}${g}`,w=String(e||"Beloved Pet").replace(/[\\;,]/g,"\\$&").replace(/\n/g," "),f=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Eternal Valley//Pet Memorial//EN","CALSCALE:GREGORIAN","METHOD:PUBLISH","BEGIN:VEVENT",`DTSTART;VALUE=DATE:${r}`,`DTEND;VALUE=DATE:${u}`,`SUMMARY:Remembrance Anniversary for ${w}`,`DESCRIPTION:Take a moment to visit Eternal Valley and remember ${w}. https://eternalvalley.com`,"END:VEVENT","END:VCALENDAR"].join(`\r
`);try{let M=new Blob([f],{type:"text/calendar;charset=utf-8"});return URL.createObjectURL(M)}catch{return"#"}}var c=e=>document.querySelector(e),Ia=["dog","cat","rabbit","bird","horse","hamster","fish","turtle","other"],_t=(e="dog")=>Ia.map(t=>`<option value="${t}"${t===e?" selected":""}>${ft[t]}</option>`).join(""),pt={all:"all",overview:"all",meadows:"meadows",canopy:"canopy",woodland:"canopy",riverbank:"riverbank",lakefront:"riverbank",beach:"starlight",starlight:"starlight",kaya_island:"starlight",highland:"highland",summit:"highland",desert:"desert",desert_bloom:"desert",desert_interior:"desert_interior",mosque:"mosque",mosque_interior:"mosque_interior",pagoda:"pagoda",pagoda_interior:"pagoda_interior",waterfall:"waterfall",lake:"lake",bridge:"bridge",gate:"gate",cathedral:"cathedral",cathedral_exterior:"cathedral_exterior",cathedral_interior:"cathedral_interior"};var Ce=(e,t=44)=>{if(e.photo)return`<img src="${e.photo}" class="pet-photo" alt="${e.petName||"memorial"}">`;let a=Ue(e.species||e.speciesLabel||""),i=It("sp_"+a);return i?`<img src="${i}" class="pet-photo pet-photo--stock" alt="${ft[a]||"companion"}" loading="lazy">`:`<div class="pet-species">${ce(a,{size:t})}</div>`},Ta=/\b(fuck\w*|shit\w*|bitch\w*|asshole\w*|cunt\w*|nigg\w*|fag\w*|dick\w*|whore\w*|slut\w*)\b/gi;function N(e){return String(e||"").replace(Ta,"\u2014").slice(0,300)}function Bt(e,t=420){return new Promise(a=>{if(!e||!(e instanceof Blob))return a(null);if(e.size>10*1024*1024)return console.warn("[photo] File exceeds 10MB limit"),a(null);let i=new Image,o=URL.createObjectURL(e);i.onload=()=>{try{let n=Math.min(1,t/Math.max(i.width,i.height)),s=document.createElement("canvas");s.width=Math.max(1,Math.round(i.width*n)),s.height=Math.max(1,Math.round(i.height*n));let r=s.getContext("2d");if(r){r.imageSmoothingEnabled=!0,r.imageSmoothingQuality="high",r.drawImage(i,0,0,s.width,s.height);let l=s.toDataURL("image/jpeg",.78);URL.revokeObjectURL(o),a(l)}else URL.revokeObjectURL(o),a(null)}catch{typeof $<"u"&&$.toast&&$.toast("Failed to load the image. Please try another one.","warning"),URL.revokeObjectURL(o),a(null)}},i.onerror=()=>{URL.revokeObjectURL(o),a(null)},i.src=o})}function We(e,t=420){let a=e?.files?.[0];return a?Bt(a,t):Promise.resolve(null)}async function _a(e,t=420,a=6){let i=[...e?.files||[]].slice(0,a),o=[];for(let n of i){let s=await Bt(n,t);s&&o.push(s)}return o}var Y=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),k=Y,$={world:null,map:null,earth:null,plots:[],currentPlot:null,_ensureWorld:null,init({earth:e,plots:t,ensureWorld:a}){if(e!==void 0&&(this.earth=e),t&&(this.plots=t),a&&(this._ensureWorld=a),this._initialized)return;this._initialized=!0,setTimeout(()=>{if(!v.data?.ownedPlots)return;let s=ht(v.data?.ownedPlots);if(s.length>0){let r=s.map(l=>l.petName).join(", ");this.toast(`Upcoming remembrance for ${r}. Take a moment to visit.`,8e3,"candle")}},1e3),c("#panelClose")&&(c("#panelClose").onclick=()=>this.closePanel()),c("#authBtn")&&(c("#authBtn").onclick=()=>this.authModal()),c("#signOutBtn")&&(c("#signOutBtn").onclick=async()=>{await y.signOut(),this.toast("Signed out. You are browsing as a guest.")}),c("#membershipBtn")&&(c("#membershipBtn").onclick=()=>this.membershipModal()),c("#createMemorialBtn")&&(c("#createMemorialBtn").onclick=()=>this.griefWizardModal()),c("#districtNav")?.addEventListener("click",async s=>{let r=s.target.closest("[data-d]"),l=r?.dataset?.d;if(l){let d=c("#districtNav");if(d&&d.querySelectorAll(".district-btn").forEach(p=>p.classList.remove("is-active")),r.classList.add("is-active"),await this.show3D("orbit"),l==="cathedral"||l==="cathedral_exterior")this.world?.flyToCathedral("exterior");else if(l==="cathedral_interior")this.world?.flyToCathedral("interior");else{let p=pt[l]||l;this.world?.flyToDistrict(p)}}}),c("#sanctuaryAmbiencePill")?.addEventListener("click",s=>{let r=s.target.closest(".sap-btn");if(!r)return;let l=c("#sanctuaryAmbiencePill");l&&l.querySelectorAll(".sap-btn").forEach(d=>d.classList.remove("is-active")),r.classList.add("is-active"),r.dataset.phase&&(this.world?.forcePhase(r.dataset.phase),ue.forcePhase(r.dataset.phase)),r.dataset.mood&&(this.world&&(this.world.mood=r.dataset.mood,this.world.applyAmbience()),ue.setMood(r.dataset.mood))}),c("#cathExteriorBtn")?.addEventListener("click",async()=>{c("#cathExteriorBtn").classList.add("btn-gold"),c("#cathExteriorBtn").classList.remove("btn-outline"),c("#cathInteriorBtn")?.classList.add("btn-outline"),c("#cathInteriorBtn")?.classList.remove("btn-gold"),await this.show3D("orbit"),this.world?.flyToCathedral("exterior")}),c("#cathInteriorBtn")?.addEventListener("click",async()=>{c("#cathInteriorBtn").classList.add("btn-gold"),c("#cathInteriorBtn").classList.remove("btn-outline"),c("#cathExteriorBtn")?.classList.add("btn-outline"),c("#cathExteriorBtn")?.classList.remove("btn-gold"),await this.show3D("orbit"),this.world?.flyToCathedral("interior")}),c("#btnGlobe")&&(c("#btnGlobe").onclick=()=>this.showGlobe()),c("#enterValleyBtn")&&(c("#enterValleyBtn").onclick=s=>{let r=s.currentTarget.getBoundingClientRect();ee.spark(r.left+r.width/2,r.top+r.height/2,26),this.show3D("tour")}),c("#btnEarth")&&(c("#btnEarth").onclick=()=>this.showEarth()),c("#btn3d")&&(c("#btn3d").onclick=()=>this.show3D()),c("#btn2d")&&(c("#btn2d").onclick=()=>this.show2D());let i=()=>{X.isPlaying||X.container&&!X.container.classList.contains("hidden")||this.world?.flight?.active||this.world?.tourMode?(X.stop(),this.show3D("orbit")):this.startDroneTour()};c("#btnDroneTour")&&(c("#btnDroneTour").onclick=i),c("#navDroneTourBtn")&&(c("#navDroneTourBtn").onclick=i),c("#droneTourToolbarBtn")&&(c("#droneTourToolbarBtn").onclick=i),c("#cathedralToolbarBtn")&&(c("#cathedralToolbarBtn").onclick=async()=>{await this.show3D("orbit"),this.world?.flyToCathedral("exterior")}),c("#globeDroneTourBtn")&&(c("#globeDroneTourBtn").onclick=()=>this.startDroneTour()),c("#droneTourEntryBtn")&&(c("#droneTourEntryBtn").onclick=async()=>{typeof window.enter=="function"&&await window.enter("tour"),this.startDroneTour()}),this._initEarthUI(),y.onChange(s=>{c("#authBtn").classList.toggle("hidden",!!s),c("#userChip").classList.toggle("hidden",!s),s&&(c("#userName").textContent=s.name),this._authHydrated&&y.initialized&&this._lastUserUid!==s?.uid&&setTimeout(()=>window.location.reload(),500),this._lastUserUid=s?.uid,this._authHydrated=y.initialized});let o=c("#userName");o&&(o.style.cursor="pointer",o.title="My Bridge \u2014 profile, plots & memorials",o.onclick=()=>this.myBridgeModal());let n=c("#myBtn");if(n&&(n.onclick=()=>this.myBridgeModal()),ie){let s=document.createElement("div");s.className="demo-chip is-admin",s.style.cursor="pointer",s.innerHTML=h("shield")+" \u26A1 UNTETHERED ADMIN CONSOLE",s.title="Click to open superuser controls",s.onclick=()=>this.adminHudModal(),document.body.appendChild(s)}},async showGlobe(){this._setView({view:"viewGlobe",btn:"btnGlobe"});let e=this._viewRequest,t=c("#globeReadout");t&&(t.textContent="Loading Earth imagery\u2026");try{if(this.globe||(this._globePromise||=(async()=>{let{Globe:a}=await import("./globe-2SPDQFG4.js"),i=new a(document.getElementById("canvasGlobe"),{onPinClick:o=>this.descendTo(o),onGlobeClick:({lat:o,lng:n})=>this.beginMemorialAt({lat:o,lng:n})});try{await i.init()}catch(o){throw i.destroy(),o}this.globe=i;for(let o of Le(v.data))o.lat!=null&&i.addPin({lat:o.lat,lng:o.lng,name:o.place,memorial:o});i.addPin({lat:J.lat,lng:J.lng,name:"Rainbow Bridge Valley",rbv:!0})})(),await this._globePromise),e!==this._viewRequest)return this.globe?.stop();t&&(t.textContent="Earth \xB7 drag to orbit \xB7 scroll to zoom"),this.globe.resize(),this.globe.start()}catch(a){this._globePromise=null,console.warn("[globe]",a),e===this._viewRequest&&(this.toast("The 3D globe is unavailable. Opening the Earth map instead.",6500,"warning"),await this.showEarth())}},async descendTo(e){if(this._descendTimer&&(clearTimeout(this._descendTimer),this._descendTimer=null),e.rbv){this.toast("Descending from orbit to Rainbow Bridge Valley\u2026",3200,"rainbow"),this.globe?.zoomTo&&await this.globe.zoomTo(e.lat,e.lng,{targetDistance:140,duration:1100}),this._currentView==="viewGlobe"&&await this.show3D("orbit",!0);return}this.toast(`Descending to ${e.name||"Earth memorial"}\u2026`,2800,"pin"),this.globe?.zoomTo&&await this.globe.zoomTo(e.lat,e.lng,{targetDistance:160,duration:900}),this._currentView==="viewGlobe"&&(await this.showEarth(),this.flyToPlace({lat:e.lat,lng:e.lng,range:420,name:e.name}),e.memorial&&(this._descendTimer=setTimeout(()=>{this._currentView==="viewEarth"&&this.openEarthMemorial(e.memorial)},2600)))},_setView(e){this._viewRequest=(this._viewRequest||0)+1,document.getElementById("liveFlightControls")?.classList.toggle("hidden",e.view!=="view3d"||!this.world?.flight?.active),e.btn!=="btnDroneTour"&&X.stop(),e.view!=="view3d"&&document.getElementById("worldLoadingStatus")?.classList.add("hidden"),this._currentView=e.view;let t=c("#stage");t&&(t.classList.remove("hidden"),t.classList.add("is-active")),e.view!=="viewGlobe"&&this.globe?.stop(),e.view!=="view3d"&&this.world?.stop();for(let[d,p]of[["viewGlobe","btnGlobe"],["viewEarth","btnEarth"],["view3d","btn3d"],["view2d","btn2d"]]){let g=c("#"+d),u=c("#"+p);if(g){let w=d===e.view;g.classList.toggle("hidden",!w),g.classList.toggle("is-active",w)}u&&u.classList.toggle("active",p===e.btn)}let a=c("#btnDroneTour");a&&a.classList.toggle("active",e.btn==="btnDroneTour"),e.view==="view3d"&&e.btn!=="btnDroneTour"&&(this.world?.start&&this.world.start(),this.world?._resize&&this.world._resize());let i=c("#districtNav");i&&(i.classList.toggle("hidden",e.view!=="view3d"),i.classList.toggle("is-active",e.view==="view3d"));let o=c("#cathedralNavPill");o&&o.classList.toggle("hidden",e.view!=="view3d");let n=e.view==="view2d",s=document.querySelector(".legend");s&&s.classList.toggle("hidden",!n);let r=["groundBtn","streetBtn","placeBtn","key3dBtn"];for(let d of r){let p=document.getElementById(d);p&&p.classList.toggle("is-off-map",e.view!=="viewEarth")}let l=c("#earthToolbar");if(l){let d=e.view==="viewGlobe"||e.view==="viewEarth";l.classList.toggle("hidden",!d),l.classList.toggle("is-globe-compact",e.view==="viewGlobe"),l.classList.remove("is-waiting")}c("#globeCta")?.classList.toggle("hidden",e.view!=="viewGlobe"),c("#globeCta")?.classList.remove("is-waiting")},async showEarth(){return this._setView({view:"viewEarth",btn:"btnEarth"}),this._earthMounted?setTimeout(()=>{this._currentView==="viewEarth"&&this.earth?.leaflet&&this.earth.leaflet.invalidateSize()},60):this._earthMountPromise?await this._earthMountPromise:(this._earthMountPromise=(async()=>{this._earthMounted=!0;try{await this.mountEarth()}catch(e){this._earthMounted=!1,console.log("[earth] mount failed",e),this.toast("The map could not be loaded.",5e3,"warning")}finally{this._earthMountPromise=null}})(),await this._earthMountPromise),this.earth},attachWorld(e,t){this.world=e,this.map=t,window.world=e,window.UI&&(window.UI.world=e)},async ensureWorld(){return this.world?this.world:window.world?(this.world=window.world,this.world):this._ensureWorldPromise?this._ensureWorldPromise:(this._ensureWorldPromise=(async()=>{try{if(this._ensureWorld){let e=await this._ensureWorld();e?.world&&(this.world=e.world,window.world=e.world,e.map&&(this.map=e.map))}else if(window.__startWorldPromise){let e=await window.__startWorldPromise;e?.world&&(this.world=e.world,window.world=e.world,e.map&&(this.map=e.map))}}catch(e){console.log("[ensureWorld] error resolving world:",e),this.toast("Failed to load the Sanctuary 3D world. Please refresh the page.","warning")}finally{this._ensureWorldPromise=null}return this.world||window.world})(),this._ensureWorldPromise)},updateCharityTopbar(){let e=ne.totals(),t=c("#topbarCharityTxt");t&&(t.textContent=e.charity>0?`${T(e.charity)} Rescue Fund`:"Animal Rescue Fund")},async flyToPlot(e){e&&(await this.show3D(),this.world?.selectPlot(e),this.openPlot(e))},async flyToMemorial(e){e&&(await this.showEarth(),this.flyToPlace({lat:e.lat,lng:e.lng,range:380,name:e.place}),this.openEarthMemorial(e))},async show3D(e="resume",t=!1){let a=e==="resume"&&!!this.world;e==="resume"&&(e=this.world?.cameraMode||"orbit");let i=this._worldViewRequest=(this._worldViewRequest||0)+1;this._setView({view:"view3d",btn:"btn3d"}),X.stop();let o=document.getElementById("worldLoadingStatus");this.world||o?.classList.remove("hidden");try{this.world||await this.ensureWorld()}finally{o?.classList.add("hidden")}if(i!==this._worldViewRequest||this._currentView!=="view3d"){this.world?.stop();return}if(!this.world)return this.show2D();t&&this.world.startEntranceFlight?this.world.startEntranceFlight({targetMode:e||"tour",duration:7,onThresholdCross:()=>{this._currentView==="view3d"&&(B.init(),B.playBowlGong(216),B.playChime(528,.12),setTimeout(()=>{this._currentView==="view3d"&&B.playChime(660,.08)},350),setTimeout(()=>{this._currentView==="view3d"&&B.playChime(880,.06)},700),B.setMode("crystal"))},onComplete:()=>{this._currentView==="view3d"&&(this.toast("Welcome to Eternal Valley Sanctuary",4500,"rainbow"),e==="tour"?this.world?.setMode&&this.world.setMode("tour"):this.world?.setMode&&(X.stop(),this.world.setMode(e||"orbit")))}}):a||(e==="tour"?this.world?.setMode&&this.world.setMode("tour"):(X.stop(),this.world?.setMode&&this.world.setMode(e||"orbit"))),this._currentView==="view3d"&&this.world.start&&this.world.start();let n=()=>{this._currentView==="view3d"&&(this.world?._resize(),this.world?.lighting?.applyAmbience())};requestAnimationFrame(n),setTimeout(n,50),setTimeout(n,200)},_setupVeoInteractiveHUD(e,t){if(this._veoHUDInitialized)return;this._veoHUDInitialized=!0;let a=document.getElementById("veoPlayPauseBtn"),i=document.getElementById("veoBtnIcon"),o=document.getElementById("veoPlayPauseFlash"),n=document.getElementById("veoPlayPauseIcon"),s=document.getElementById("veoCurrentLandmarkName"),r=document.getElementById("veoPlotPins"),l=document.getElementById("veoPlotCount"),d=document.getElementById("veoPlotCard"),p=document.getElementById("vpcBadge"),g=document.getElementById("vpcTitle"),u=document.getElementById("vpcDesc"),w=document.getElementById("vpcPrice"),f=document.getElementById("vpcClose"),M=document.getElementById("vpcReserveBtn"),L=document.getElementById("vpcFly3dBtn"),P=document.getElementById("veoProgressBar"),A=document.getElementById("veoScrubberTrack"),G=document.getElementById("veoChapterTicks"),K=document.getElementById("veoTimeDisplay"),U=document.getElementById("veoMuteBtn"),me=document.getElementById("veoPlotToggleBtn"),S=document.getElementById("veoEnterBtn"),x=!0,C=null,D=null,oe=[{id:"gate",start:0,end:4,name:"1/14 \xB7 The Celestial Grand Gate",badge:"SUNLIT MEADOWS",districtKey:"meadows",plots:[{id:"GATE_1",name:"Triumphal Portal Garden #1",x:28,y:72,price:249,badge:"SUNLIT MEADOWS",desc:"Serene flowering meadow bordering the celestial gate avenue, bathed in dawn sunlight.",flyKey:"gate"},{id:"GATE_2",name:"Avenue of Remembrance #3",x:50,y:80,price:280,badge:"SUNLIT MEADOWS",desc:"Prime garden sanctuary along the grand paved boulevard of arrival.",flyKey:"gate"},{id:"GATE_3",name:"Golden Arch Vista Plot #5",x:75,y:70,price:299,badge:"SUNLIT MEADOWS",desc:"Elevated plot commanding sweeping vistas toward the sunlit mountain range.",flyKey:"gate"}]},{id:"bridge",start:4,end:8,name:"2/14 \xB7 The Crystalline Rainbow Bridge",badge:"WHISPERING PINES",districtKey:"woodland",plots:[{id:"BRIDGE_1",name:"Rainbow Gorge Crest #2",x:30,y:68,price:299,badge:"WHISPERING PINES",desc:"Overlooks the rushing crystalline gorge and rainbow prism mist.",flyKey:"bridge"},{id:"BRIDGE_2",name:"Crystal Stream Terrace #4",x:65,y:76,price:349,badge:"WHISPERING PINES",desc:"Lush riverside plot shaded by ancient weeping willows and mountain pines.",flyKey:"bridge"}]},{id:"plaza",start:8,end:12,name:"3/14 \xB7 Central Plaza & Tree of Life",badge:"MEMORIAL MEADOWS",districtKey:"meadows",plots:[{id:"PLAZA_1",name:"Tree of Life Canopy Plot #2",x:44,y:55,price:399,badge:"MEMORIAL MEADOWS",desc:"Directly beneath the ancient sacred boughs of the glowing Tree of Life.",flyKey:"meadows"},{id:"PLAZA_2",name:"Lion Fountain Promenade #5",x:74,y:68,price:349,badge:"MEMORIAL MEADOWS",desc:"Beside the carved stone lion fountain with gentle splashing waters.",flyKey:"meadows"}]},{id:"waterfall",start:12,end:16,name:"4/14 \xB7 Great North Waterfall & Mirror Lake",badge:"LAKESIDE REST & RAPIDS",districtKey:"lakefront",plots:[{id:"WATERFALL_1",name:"Mirror Lake Reflections #3",x:32,y:78,price:449,badge:"LAKESIDE REST",desc:"Tranquil pebble shore where the cascading glacial waters meet the still mirror lake.",flyKey:"lake"},{id:"WATERFALL_2",name:"Glacial Cataract Plunge #1",x:55,y:48,price:499,badge:"HIGHLAND RAPIDS",desc:"Dramatic promontory directly beside the 182-meter thundering waterfall plunge pool.",flyKey:"waterfall"},{id:"WATERFALL_3",name:"Cataract Mist Promontory #4",x:76,y:70,price:549,badge:"HIGHLAND RAPIDS",desc:"Elevated terrace bathed in refreshing rainbow mist and mountain breezes.",flyKey:"waterfall"}]},{id:"desert",start:16,end:20,name:"5/14 \xB7 Grand Canyon Desert Badlands [Exterior]",badge:"DESERT BLOOM",districtKey:"desert",plots:[{id:"DESERT_1",name:"Grand Canyon Sun-Sanctuary #1",x:38,y:72,price:280,badge:"DESERT BLOOM",desc:"Warm terracotta sandstone mesa with flowering saguaro cacti and red rock spires.",flyKey:"desert"},{id:"DESERT_2",name:"Pueblo Cliff-Dwelling Terrace #3",x:68,y:60,price:320,badge:"DESERT BLOOM",desc:"Perched along the ancient cliff face below the pueblo stone sanctuary.",flyKey:"desert"}]},{id:"pueblo_interior",start:20,end:24,name:"6/14 \xB7 Pueblo Sun-Kiva Sanctuary [Interior]",badge:"ANCIENT PUEBLO SANCTUARY",districtKey:"desert_interior",plots:[{id:"PUEBLO_INT_1",name:"Sun-Kiva Hearthside Plot #1",x:32,y:65,price:360,badge:"ANCIENT PUEBLO SANCTUARY",desc:"Warm stone sanctuary beside the glowing ceremonial fire hearth and pine timber vigas.",flyKey:"desert_interior"},{id:"PUEBLO_INT_2",name:"Celestial Skylight Altar Plot #2",x:52,y:52,price:420,badge:"ANCIENT PUEBLO SANCTUARY",desc:"Directly beneath the natural circular rock skylight beam of golden morning sun.",flyKey:"desert_interior"},{id:"PUEBLO_INT_3",name:"Canyon Overlook Portal Plot #3",x:76,y:58,price:390,badge:"ANCIENT PUEBLO SANCTUARY",desc:"Adjacent to the dramatic stone arched overlook framing the Grand Canyon mesas.",flyKey:"desert_interior"}]},{id:"cathedral_ext",start:24,end:28,name:"7/14 \xB7 Hohenzollern Fortress Cathedral [Exterior]",badge:"HIGHLAND PLATEAU",districtKey:"cathedral",plots:[{id:"CATH_EXT_1",name:"Hohenzollern North Rampart #1",x:36,y:68,price:599,badge:"HIGHLAND PLATEAU",desc:"Commanding stone ramparts overlooking the valley and high alpine mountain crests.",flyKey:"cathedral"},{id:"CATH_EXT_2",name:"Citadel Spire Terrace #4",x:65,y:72,price:649,badge:"HIGHLAND PLATEAU",desc:"Exclusive terrace perched directly beneath the grand cylindrical castle keep.",flyKey:"cathedral"}]},{id:"cathedral_int",start:28,end:32,name:"8/14 \xB7 Asamkirche Rococo Cathedral [Interior]",badge:"ASAMKIRCHE ROCOCO",districtKey:"cathedral_interior",plots:[{id:"CATH_ROOF_1",name:"Fresco Balcony West #1",x:30,y:55,price:749,badge:"ASAMKIRCHE ROCOCO",desc:"Elevated interior balcony directly beneath the gilded ceiling fresco of the heavens.",flyKey:"cathedral_interior"},{id:"CATH_ROOF_2",name:"Gilded Rococo Altar Chancel #2",x:50,y:62,price:849,badge:"ASAMKIRCHE ROCOCO",desc:"Sacred sanctuary plot at the foot of the golden high altar and Solomonic columns.",flyKey:"cathedral_interior"},{id:"CATH_ROOF_3",name:"Fresco Balcony East #3",x:72,y:54,price:749,badge:"ASAMKIRCHE ROCOCO",desc:"Balcony sanctuary illuminated by divine god-rays pouring through upper clerestory windows.",flyKey:"cathedral_interior"}]},{id:"moorish_ext",start:32,end:36,name:"9/14 \xB7 Moorish Alhambra Palace [Exterior]",badge:"MOORISH OASIS",districtKey:"mosque",plots:[{id:"MOOR_EXT_1",name:"Reflecting Pool Arcade #2",x:42,y:74,price:480,badge:"MOORISH OASIS",desc:"Quiet colonnade plot reflecting the turquoise water and slender cypress trees.",flyKey:"mosque"},{id:"MOOR_EXT_2",name:"Court of Lions Terrace #5",x:68,y:70,price:520,badge:"MOORISH OASIS",desc:"Secluded garden terrace surrounded by fragrant jasmine and orange blossoms.",flyKey:"mosque"}]},{id:"moorish_int",start:36,end:40,name:"10/14 \xB7 Moorish Palace Sanctuary [Interior]",badge:"ALHAMBRA MUQARNAS",districtKey:"mosque_interior",plots:[{id:"MOOR_INT_1",name:"Muqarnas Honeycomb Dome Plot #1",x:35,y:60,price:560,badge:"ALHAMBRA MUQARNAS",desc:"Directly beneath the intricate vaulted muqarnas ceiling with golden sunlight shafts.",flyKey:"mosque_interior"},{id:"MOOR_INT_2",name:"Marble Basin Fountain Plot #2",x:50,y:78,price:590,badge:"ALHAMBRA MUQARNAS",desc:"At the edge of the central carved marble water basin with gentle bubbling waters.",flyKey:"mosque_interior"},{id:"MOOR_INT_3",name:"Zellige Mosaic Colonnade #3",x:70,y:64,price:540,badge:"ALHAMBRA MUQARNAS",desc:"Lapis lazuli mosaic arcade framing private contemplation alcoves.",flyKey:"mosque_interior"}]},{id:"pagoda_ext",start:40,end:44,name:"11/14 \xB7 Five-Tiered Zen Pagoda & Lake [Exterior]",badge:"PAGODA GARDENS",districtKey:"pagoda",plots:[{id:"PAG_EXT_1",name:"Zen Pagoda Lotus Plot #1",x:36,y:76,price:480,badge:"PAGODA GARDENS",desc:"Tranquil garden plot with weeping willows and floating cherry blossom petals.",flyKey:"pagoda"},{id:"PAG_EXT_2",name:"Koi Terrace Waterfront #4",x:66,y:72,price:540,badge:"PAGODA GARDENS",desc:"Waterside stone terrace where golden koi swim peacefully beneath the surface.",flyKey:"pagoda"}]},{id:"pagoda_int",start:44,end:48,name:"12/14 \xB7 Zen Pagoda Sanctuary [Interior]",badge:"ZEN BUDDHA SANCTUARY",districtKey:"pagoda_interior",plots:[{id:"PAG_INT_1",name:"Golden Buddha Altar Plot #1",x:34,y:58,price:590,badge:"ZEN BUDDHA SANCTUARY",desc:"Sacred tatami sanctuary in the warm glow of the golden Buddha and hanging lanterns.",flyKey:"pagoda_interior"},{id:"PAG_INT_2",name:"Rock Garden View Pavilion #2",x:68,y:62,price:620,badge:"ZEN BUDDHA SANCTUARY",desc:"Framed by open cedar fusuma doors looking out at the blooming sakura rock garden.",flyKey:"pagoda_interior"}]},{id:"kaya_island",start:48,end:52,name:"13/14 \xB7 Kaya Island Coastal Sanctuary",badge:"KAYA ISLAND",districtKey:"starlight",plots:[{id:"KAYA_1",name:"Guardian Kaya Beacon Plot #1",x:42,y:65,price:699,badge:"KAYA ISLAND",desc:"Beside the monumental crystalline beacon of guardian spirit Husky Kaya.",flyKey:"starlight"},{id:"KAYA_2",name:"Azure Coral Shore #3",x:65,y:78,price:649,badge:"KAYA ISLAND",desc:"Turquoise shoreline plot with gentle rolling surf and white sandy beaches.",flyKey:"starlight"}]},{id:"panorama",start:52,end:56,name:"14/14 \xB7 Valley Summit Panorama",badge:"SUMMIT REST",districtKey:"highland",plots:[{id:"SUMMIT_1",name:"Celestial Ridge Sovereign Estate #1",x:38,y:66,price:899,badge:"SUMMIT REST",desc:"High-altitude panoramic summit estate overlooking the entire interconnected sanctuary realm.",flyKey:"highland"},{id:"SUMMIT_2",name:"Eternal Valley Master Plot #4",x:62,y:70,price:999,badge:"SUMMIT REST",desc:"Supreme vantage point taking in Gate, Waterfall, Cathedral, Desert, and Ocean.",flyKey:"highland"}]}],he=56,Je=(I=null,q="tour")=>{this._veoActive&&(this._veoActive=!1,e.style.transition="opacity 0.45s ease-out",e.style.opacity="0",this.show3D(q,!1),setTimeout(()=>{e.style.display="none",e.style.opacity="1",e.style.transition="",t.pause(),t.src="",t.load(),q==="tour"&&this.world?.startDroneTour?this.world.startDroneTour(0):I&&this.world&&(I==="cathedral_interior"?this.world.flyToCathedral?.("interior"):I==="cathedral"||I==="cathedral_exterior"?this.world.flyToCathedral?.("exterior"):this.world.flyToDistrict?.(I))},450))},Te=I=>{!o||!n||(n.textContent=I?"\u23F8":"\u25B6",o.style.display="flex",clearTimeout(D),D=setTimeout(()=>{o.style.display="none"},1100))},Re=()=>{t.paused?(i&&(i.textContent="\u23F8"),Te(!1)):(t.pause(),i&&(i.textContent="\u25B6"),Te(!0)),_e()};t.onclick=I=>{I.stopPropagation(),Re()},a&&(a.onclick=I=>{I.stopPropagation(),Re()}),window.addEventListener("keydown",I=>{this._veoActive&&I.code==="Space"&&(I.preventDefault(),Re())}),S&&(S.onclick=I=>{I.stopPropagation(),Je(null,"tour")}),U&&(U.onclick=I=>{I.stopPropagation(),t.muted=!t.muted,U.textContent=t.muted?"\u{1F507} Sound Muted":"\u{1F50A} Sound On"}),me&&(me.onclick=I=>{I.stopPropagation(),x=!x,me.style.opacity=x?"1":"0.6",_e()}),G&&G.children.length===0&&oe.forEach(I=>{let q=document.createElement("div");q.style.position="absolute",q.style.left=`${I.start/he*100}%`,q.style.top="-3px",q.style.width="3px",q.style.height="12px",q.style.background="rgba(212,175,55,0.75)",q.style.borderRadius="1px",q.style.cursor="pointer",q.title=I.name,q.onclick=ge=>{ge.stopPropagation(),t.currentTime=I.start,i&&(i.textContent="\u23F8")},G.appendChild(q)}),A&&(A.onclick=I=>{I.stopPropagation();let q=A.getBoundingClientRect(),ge=Math.max(0,Math.min(1,(I.clientX-q.left)/q.width));t.currentTime=ge*he});let Ge="",_e=()=>{if(!r)return;let I=t.currentTime||0,q=oe.find(ae=>I>=ae.start&&I<ae.end)||oe[0];s&&q.name!==s.textContent&&(s.textContent=q.name),l&&(l.textContent=q.plots?q.plots.length:0);let ge=x||t.paused;r.style.display=ge?"block":"none",r.style.pointerEvents=ge?"auto":"none",!(q.id===Ge&&r.children.length>0)&&(Ge=q.id,r.innerHTML="",q.plots&&q.plots.forEach(ae=>{let H=document.createElement("div");H.style.position="absolute",H.style.left=`${ae.x}%`,H.style.top=`${ae.y}%`,H.style.transform="translate(-50%, -100%)",H.style.cursor="pointer",H.style.pointerEvents="auto",H.style.display="flex",H.style.flexDirection="column",H.style.alignItems="center",H.style.zIndex="12",H.style.transition="transform 0.2s cubic-bezier(0.2,0.8,0.2,1)",H.innerHTML=`
          <div style="background:rgba(15,20,18,0.92); backdrop-filter:blur(10px); border:1px solid rgba(212,175,55,0.7); border-radius:20px; padding:4px 10px; font-size:0.75rem; font-weight:600; color:#fdfaf3; white-space:nowrap; box-shadow:0 4px 16px rgba(0,0,0,0.7); display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="color:#d4af37; font-size:0.7rem;">\u2726</span>
            <span>$${ae.price}</span>
            <span style="font-size:0.68rem; color:#79c164; text-transform:uppercase;">Available</span>
          </div>
          <div style="width:24px; height:24px; border-radius:50%; background:#d4af37; box-shadow:0 0 16px #d4af37, 0 0 32px rgba(212,175,55,0.6); display:flex; align-items:center; justify-content:center; color:#0b100d; font-size:0.75rem; font-weight:bold; border:2px solid #ffffff;">
            \u{1F43E}
          </div>
          <div style="width:2px; height:10px; background:linear-gradient(to bottom, #d4af37, transparent);"></div>
        `,H.onmouseenter=()=>{H.style.transform="translate(-50%, -108%) scale(1.1)"},H.onmouseleave=()=>{H.style.transform="translate(-50%, -100%) scale(1.0)"},H.onclick=pa=>{pa.stopPropagation(),t.pause(),i&&(i.textContent="\u25B6"),Te(!0),C=ae,d&&(p&&(p.textContent=ae.badge),g&&(g.textContent=ae.name),u&&(u.textContent=ae.desc),w&&(w.textContent=`$${ae.price} \xB7 Consecrated`),d.style.display="block")},r.appendChild(H)}))};f&&(f.onclick=I=>{I.stopPropagation(),d&&(d.style.display="none")}),M&&(M.onclick=I=>{I.stopPropagation();let q=C;this.show3D("tour"),setTimeout(()=>{this.griefWizardModal(q)},600)}),L&&(L.onclick=I=>{I.stopPropagation(),Je(C?C.flyKey:null,"orbit")}),t.ontimeupdate=()=>{let I=t.currentTime||0,q=Math.min(100,I/he*100);if(P&&(P.style.width=`${q}%`),K){let ge=Math.floor(I/60).toString().padStart(2,"0"),ae=Math.floor(I%60).toString().padStart(2,"0");K.textContent=`${ge}:${ae} / 00:56`}_e()},t.onended=()=>{t.currentTime=0}},async startDroneTour(e){if(await this.show3D("tour"),this._currentView!=="view3d"||!this.world)return;let t=typeof e=="string"?Gt.findIndex(a=>a.id===e):e;Number.isInteger(t)&&t>=0&&this.world.startDroneTour(t)},async visitWorldPlot(e){if(await this.show3D("orbit"),this._currentView!=="view3d"||!this.world)return this.openPlot(e);this.world.selectPlot(e),this.openPlot(e)},async show2D(){if(this._worldViewRequest=(this._worldViewRequest||0)+1,X.stop(),!this.map){if(window.UI?.map)this.map=window.UI.map;else if(!this.map)try{let{Map2D:e}=await import("./map2d-IJLBXJ74.js"),t=document.getElementById("canvas2d")||document.querySelector("canvas#canvas2d");if(t){let a=this.plots&&this.plots.length?this.plots:window.plots||this.world?.plots||[];this.map=new e(t,a,i=>{this.visitWorldPlot(i)})}}catch(e){console.error("[show2D] Error creating Map2D:",e),this.toast("Failed to load the 2D map.","warning")}}if(!this.map)return this.toast("The map could not be loaded. Check your connection and reload.",6e3,"warning");this._setView({view:"view2d",btn:"btn2d"}),requestAnimationFrame(()=>{this._currentView==="view2d"&&(this.map?._resize(),this.map?.draw())})},toast(e,t=3200,a=null){typeof t=="string"&&(a=t,t=3200);let i=c("#toast"),o=String(e).replace(/[&<>]/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;"})[n]);i.innerHTML=(a?h(a,{cls:"toast-ico"}):"")+`<span>${o}</span>`,i.classList.remove("hidden"),clearTimeout(this._tt),this._tt=setTimeout(()=>i.classList.add("hidden"),t)},openPlot(e){this.currentPlot=e;let t=F[e.district],a=c("#plotPanelBody"),i=!!v.data?.ownedPlots?.[e.id],o=z.find(l=>l.districtKey===e.district)||z[0],n=`
      <div class="plot-photoreal-banner">
        <div class="ppb-media">
          <img class="ppb-img" src="${o.extImg}" alt="${o.name}">
          <div class="ppb-badge">\u2726 4K SANCTUARY VISION</div>
        </div>
        <div class="ppb-content">
          <div class="ppb-title">${o.name}</div>
          <div class="ppb-sub">${o.sub}</div>
          <div class="ppb-actions">
            <button class="btn btn-sm btn-gold ppb-view-btn" id="ppbViewVision">
              <span>\u{1F441}\uFE0F 4K Vision</span>
            </button>
            <button class="btn btn-sm btn-outline ppb-fly-btn" id="ppbFlyTour">
              <span>\u{1F3AC} Fly on Tour</span>
            </button>
          </div>
        </div>
      </div>
    `;if(e.status==="available")a.innerHTML=`
        <span class="badge badge-avail">AVAILABLE</span>
        <h2>Plot ${e.id}</h2>
        <div class="sub">${t.name} \xB7 ${Xe[e.size]}</div>
        ${n}
        <div class="price-tag">$${e.price} <small>one-time, yours forever</small></div>
        <div class="district-blurb">${t.blurb}</div>
        <button class="btn btn-gold btn-block" id="buyPlotBtn">Reserve this plot</button>
        <button class="btn btn-outline btn-block" id="giftAnyBtn">Leave a gift at this district's shrine</button>
        <p class="fine" style="margin-top:12px;font-size:11.5px;color:rgba(246,241,228,.7)">
          Plot ownership requires a membership. Visitors may leave gifts on any occupied plot.</p>`,c("#buyPlotBtn").onclick=()=>this.buyPlotFlow(e),c("#giftAnyBtn").onclick=()=>this.toast("Choose an occupied plot (grey) to leave a gift","candle");else{let l=e.memorial||{},d=(v.data?.gifts?.[e.id]||[]).slice(-4).reverse(),p=ht({[e.id]:e}),g=p.length>0?p[0]:null,u=k(g?.petName||""),w=g?`<div class="anniv-banner">
        <span class="anniv-badge">\u{1F56F}\uFE0F ${g.yearsAgo} Year Anniversary</span>
        <a href="${ca(g.petName,g.crossingDate)}" download="anniversary_${u}.ics" class="btn btn-sm btn-outline anniv-ics-btn">Save to Calendar</a>
      </div>`:"";a.innerHTML=`
        <span class="badge badge-occ">OCCUPIED${i?" \xB7 YOURS":""}</span>
        ${w}
        <h2>Plot ${e.id}</h2>
        <div class="sub">${t.name} \xB7 ${Xe[e.size]}</div>
        ${n}
        <div class="memorial">
          ${Ce(l,52)}
          <h3>${l.petName||"Beloved Friend"}</h3>
          <div class="years">${l.species||""} \xB7 ${l.years||""}</div>
          <p class="epitaph">\u201C${l.epitaph||"Forever loved."}\u201D</p>
          <div class="gifts-count">${h("gift")} ${l.gifts||0} tributes from visitors \xB7 resting with ${l.owner||"a loving family"}</div>
          <div class="gifts-count" style="color:var(--accent-hi-c)">${h("heart")} Supports verified rescue: <b>${W(l.charity||v.data?.charity||R[0].id)}</b></div>
        </div>
        ${this.petProfileHTML(l,e.id,i)}
        <div class="fav-places-section" style="margin:14px 0 10px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <span class="sub" style="margin:0">${h("pin")} <b>Favorite Places on Earth:</b></span>
            ${i?'<button class="btn-text-gold" id="pAddFavPlaceBtn" style="font-size:11.5px;cursor:pointer;background:none;border:none;color:var(--accent-hi-c);font-weight:700">+ Tag a Place</button>':""}
          </div>
          ${l.favoritePlaces&&l.favoritePlaces.length?l.favoritePlaces.map(f=>`
            <div class="fav-place-card">
              <div class="fpc-info">
                <b>${f.name.replace(/[&<>"]/g,"")}</b>
                <span class="fpc-note">\u201C${(f.note||f.place||"").replace(/[&<>"]/g,"")}\u201D</span>
              </div>
              <button class="btn btn-sm btn-outline fpc-fly-btn" data-fplat="${f.lat}" data-fplng="${f.lng}">${h("globe")} Fly \u2197</button>
            </div>
          `).join(""):`
            <div class="fav-place-card">
              <div class="fpc-info">
                <b>Sacred Mountain Trail</b>
                <span class="fpc-note">\u201CRunning free where the wildflowers bloom\u2026\u201D</span>
              </div>
              <button class="btn btn-sm btn-outline fpc-fly-btn" data-fplat="37.7749" data-fplng="-122.4194">${h("globe")} Fly \u2197</button>
            </div>
          `}
        </div>
        ${d.length?'<div class="sub">Recent gifts:</div>'+d.map(f=>{let M=pe.find(L=>L.id===f.giftId);return`<div style="font-size:12.5px;margin:4px 0;color:var(--cream-dim)">${Pe(f.giftId,{size:22,cls:"thumb-inline"})||h("gift")} ${M?.name||"Gift"} \u2014 <i>${f.from}</i>${f.message?": \u201C"+f.message+"\u201D":""}</div>`}).join(""):""}
        <button class="btn btn-gold btn-block" id="giftBtn">${h("candle")} Leave a gift</button>
        <button class="btn btn-outline btn-block" id="pCertBtn">${h("scroll")} Memorial Certificate &amp; Plaque</button>
        <button class="btn btn-outline btn-block" id="pKeepsakeBtn">${h("photo")} Order Physical Keepsakes</button>
        <button class="btn btn-outline btn-block" id="pShareBtn">${h("share")} Share this memorial</button>
        ${i?`<button class="btn btn-gold btn-block" id="pCampaignBtn" style="margin-top:12px">${h("heart")} Start a Fundraising Campaign</button>`:""}
        ${i?`<button class="btn btn-green btn-block" id="decorBtn">${h("flower")} Customize this plot</button>`:""}`,c("#giftBtn").onclick=()=>this.giftModal(e),c("#pCertBtn").onclick=()=>this.memorialCertificateModal(e),c("#pKeepsakeBtn").onclick=()=>this.keepsakesModal(l),i&&(c("#pCampaignBtn").onclick=()=>{this.closePanel(),Z.createModal(this),setTimeout(()=>{let f=document.getElementById("cmpName"),M=document.getElementById("cmpSpecies"),L=document.getElementById("cmpYears");f&&(f.value=l.petName||""),M&&(M.value=l.species||""),L&&(L.value=l.years||"")},50)}),c("#pShareBtn").onclick=()=>{let f=`${location.origin}${location.pathname}?p=${encodeURIComponent(e.id)}`;this.shareModal(`${l.petName||"a friend"}'s memorial`,f,`Visit ${l.petName||"our friend"}'s memorial in the Rainbow Bridge Sanctuary \u2014 light a candle or leave a gift.`)},i&&(c("#decorBtn").onclick=()=>this.decorModal(e)),i&&c("#pAddFavPlaceBtn")?.addEventListener("click",()=>this.addPlaceToPlotModal(e)),a.querySelectorAll(".fpc-fly-btn").forEach(f=>{f.onclick=async()=>{let M=Number(f.dataset.fplat),L=Number(f.dataset.fplng);await this.showEarth(),this.flyToPlace({lat:M,lng:L,range:450})}}),this._wirePetProfile(l,e.id,i,()=>this.openPlot(e),f=>{let M=v.data?.ownedPlots?.[e.id];M&&(M.memorial={...M.memorial,petProfile:f})})}let s=c("#ppbViewVision");s&&(s.onclick=()=>X.openAreaInspection(o.id,e.id));let r=c("#ppbFlyTour");r&&(r.onclick=async()=>{this.closePanel(),await this.startDroneTour(o.id)}),c("#plotPanel").classList.remove("hidden"),ee.enhance(a),this.map?.select(e)},closePanel(){c("#plotPanel").classList.add("hidden"),this.world?.selectPlot(null)},modal(e){zt.end();let t=c("#modalBox");t.innerHTML=e,t.querySelectorAll("[data-close]").forEach(a=>{a.onclick=()=>this.closeModal()}),c("#modalRoot").classList.remove("hidden"),document.body.classList.add("modal-open"),this.world?.keysDown&&(Object.keys(this.world.keysDown).forEach(a=>this.world.keysDown[a]=!1),this.world.walkVelocity&&this.world.walkVelocity.set(0,0,0)),c(".modal-backdrop").onclick=()=>this.closeModal(),t.querySelectorAll(".tier").forEach(a=>{a.dataset.tilt="7"}),ee.enhance(t),ee.cascade(t,".tier, .shop-item"),this._escClose||=a=>{a.key==="Escape"&&this.closeModal()},document.addEventListener("keydown",this._escClose),t.querySelector("input, textarea, select")?.focus()},closeModal(){c("#modalRoot").classList.add("hidden"),document.body.classList.remove("modal-open"),this._escClose&&document.removeEventListener("keydown",this._escClose),this.world?.keysDown&&Object.keys(this.world.keysDown).forEach(e=>this.world.keysDown[e]=!1)},authModal(e){if(O){this.modal(`
        <h2>Demo Mode Sign In</h2>
        <div class="modal-sub">Create a local profile to save memorials in your browser.</div>
        <label>Your Name</label><input id="dName" placeholder="e.g. Jane Doe">
        <button class="btn btn-gold btn-block" id="pDemoIn">Continue as Local Profile</button>
        <div class="divider">or</div>
        <button class="btn btn-outline btn-block" id="pGuest">Continue as Guest</button>
        <p class="fine">Nothing is sent to a server. Data lives only in localStorage.</p>
      `);let i=o=>{this.closeModal(),this.toast(o),e?.()};c("#pDemoIn").onclick=()=>{let o=c("#dName").value.trim()||"Demo User";y._demoLogin(o,"demo@local","local"),i(`Welcome, ${o}.`)},c("#pGuest").onclick=()=>{y.continueAsGuest(!0),i("Browsing anonymously.")};return}this.modal(`
      <h2>Welcome</h2>
      <div class="modal-sub">One tap and you're in \u2014 own plots, build memorials, keep them forever.</div>
      <div class="auth-providers">
        <button class="btn" id="pGoogle" style="background:#fff;color:#1a1a1a;font-weight:700">${h("google")} Continue with Google</button>
        <button class="btn" id="pApple" style="background:#000;color:#fff;border-color:#444;font-weight:700"> Continue with Apple</button>
        <button class="btn" id="pFacebook" style="background:#1877f2;color:#fff;font-weight:700">\u24D5 Continue with Facebook</button>
        <button class="btn" id="pTwitter" style="background:#000;color:#fff;border-color:#444;font-weight:700">\u{1D54F} Continue with X</button>
      </div>
      <div class="divider">or use email</div>
      <label>Name (for new accounts)</label><input id="aName" placeholder="Your name">
      <label>Email</label><input id="aEmail" type="email" placeholder="you@example.com">
      <label>Password</label><input id="aPass" type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022">
      <button class="btn btn-gold btn-block" id="pEmailIn">Sign in</button>
      <button class="btn btn-outline btn-block" id="pEmailUp">Create account</button>
      <div class="divider">just visiting?</div>
      <button class="btn btn-outline btn-block" id="pGuest">Continue as guest (anonymous)</button>
      <button class="btn btn-outline btn-block" id="pGuestNamed">Continue as guest with a name</button>
      <p class="fine">Secured by Firebase Authentication.</p>`);let t=i=>{this.closeModal(),this.toast(i),e?.()},a=async(i,o)=>{try{await i(),t(o)}catch(n){this.toast(String(n.message||n),"warning")}};c("#pGoogle").onclick=()=>a(()=>y.signInGoogle(),"Welcome! Signed in with Google."),c("#pApple").onclick=()=>a(()=>y.signInApple(),"Welcome! Signed in with Apple."),c("#pFacebook").onclick=()=>a(()=>y.signInFacebook(),"Welcome! Signed in with Facebook."),c("#pTwitter").onclick=()=>a(()=>y.signInTwitter(),"Welcome! Signed in with X."),c("#pEmailIn").onclick=()=>a(()=>y.signInEmail(c("#aEmail").value,c("#aPass").value),"Welcome back."),c("#pEmailUp").onclick=()=>a(()=>y.signUpEmail(c("#aName").value,c("#aEmail").value,c("#aPass").value),"Account created \u2014 welcome to paradise."),c("#pGuest").onclick=()=>{y.continueAsGuest(!0),t("Browsing anonymously. You can still leave gifts.")},c("#pGuestNamed").onclick=()=>{let i=prompt("What name should appear on your gifts?");y.continueAsGuest(!1,i||"Visitor"),t(`Welcome, ${i||"Visitor"}.`)}},petProfileHTML(e,t,a){let i=e.petProfile||{},o=[...e.memories||[],...v.getMemories(t)].sort((s,r)=>r.at-s.at),n=(s,r,l)=>r?`<div class="fav-row">${l} <b>${s}:</b> ${r}</div>`:"";return`
      ${i.birthday||i.passing?`<div class="pet-dates">${h("cake")} ${i.birthday||"\u2014"} &nbsp;&rarr;&nbsp; ${h("crest")} ${i.passing||"\u2014"}</div>`:""}
      ${i.about?`<div class="district-blurb">${i.about}</div>`:""}
      ${i.favToys||i.favActivities||i.favTreats?`<div class="favs">
        ${n("Favorite toys",i.favToys,h("toy"))}
        ${n("Favorite activities",i.favActivities,h("disc"))}
        ${n("Favorite treats",i.favTreats,h("bone"))}
      </div>`:""}
      ${i.gallery?.length?`<div class="gallery-grid">${i.gallery.map(s=>`<img src="${s}" alt="Memorial Gallery Photo" loading="lazy">`).join("")}</div>`:""}
      ${i.videos?.length?'<div class="sub" style="margin-top:8px">Videos:</div>'+i.videos.map(s=>`<a class="video-link" href="${s}" target="_blank" rel="noopener">\u25B6 ${s.replace(/^https?:\/\//,"").slice(0,42)}\u2026</a>`).join(""):""}
      ${i.contactEmail?`<div class="fav-row">${h("mail")} <a href="mailto:${i.contactEmail}" style="color:var(--gold-bright)">Contact the family</a></div>`:""}
      <button class="btn btn-outline btn-block" id="addMemoryBtn">${h("book")} Add a photo or memory</button>
      ${a?`<button class="btn btn-green btn-block" id="editPetBtn">${h("edit")} Edit ${e.petName}'s profile</button>`:""}
      ${o.length?`<div class="sub" style="margin-top:14px">Memory wall (${o.length}):</div>`+o.slice(0,8).map(s=>`
        <div class="memory-card">
          ${s.photo?`<img src="${s.photo}" alt="User Photo">`:""}
          <div><b>${s.from}</b> \xB7 ${wt(s.at)}<br>${s.text}</div>
        </div>`).join(""):""}`},_wirePetProfile(e,t,a,i,o){let n=c("#addMemoryBtn");n&&(n.onclick=()=>this.addMemoryModal(e,t,i));let s=c("#editPetBtn");s&&a&&(s.onclick=()=>this.editPetModal(e,i,o))},addMemoryModal(e,t,a){this.modal(`
      <h2>A memory of ${e.petName}</h2>
      <div class="modal-sub">Share a photo or a story \u2014 it joins ${e.petName}'s memory wall for everyone who visits. Free, always.</div>
      <label>Your name (blank = anonymous)</label><input id="memFrom" maxlength="30" value="${y.user&&!y.user.isGuest?y.user.name:""}">
      <label>Your memory</label><textarea id="memText" rows="3" maxlength="280" placeholder="The day at the lake when\u2026"></textarea>
      <label>Photo (optional)</label><input id="memPhoto" type="file" accept="image/*">
      <button class="btn btn-gold btn-block" id="memPost">Add to the memory wall</button>`),c("#memPost").onclick=async()=>{let i=N(c("#memText").value.trim());if(!i)return this.toast("Write a few words first","heart");let o=await We(c("#memPhoto"),420),n=N(c("#memFrom").value.trim())||"Anonymous Visitor";v.addMemory(t,{from:n,text:i,photo:o,at:Date.now()}),v.logActivity("book",`${n} shared a memory of ${e.petName}`),await v.save(y.user),this.closeModal(),a(),this.toast("Your memory is on the wall.","book")}},async addPlaceToPlotModal(e){let t=e.memorial||{};this.modal(`
      <div class="comfort-header">
        <div class="comfort-crest">${h("pin",{size:36})}</div>
        <h2>Tag a Sacred Place on Earth</h2>
        <div class="modal-sub">Tag ${t.petName||"your companion"}'s favorite mountain trail, beach, park, or sunny backyard on the Earth Globe and link it to this Sanctuary Plot.</div>
      </div>

      <label>Place / Trail Title</label>
      <input id="fpName" maxlength="40" placeholder="e.g. Misty's Favorite Mountain Trail">

      <label>Location / City / Landmark</label>
      <input id="fpLoc" placeholder="e.g. Bear Mountain Peak, NY">

      <label>Why this place was special to them</label>
      <textarea id="fpNote" rows="2" maxlength="140" placeholder="Where we raced the autumn wind and watched sunsets together\u2026"></textarea>

      <button class="btn btn-gold btn-block" id="fpSaveBtn" style="margin-top:14px">
        ${h("pin")} Save Sacred Spot &amp; Pin to Earth
      </button>
    `);let a=c("#modalBox");a.querySelector("#fpSaveBtn").onclick=async()=>{let i=a.querySelector("#fpName").value.trim()||`${t.petName||"Companion"}'s Sacred Spot`,o=a.querySelector("#fpLoc").value.trim()||"Sacred Place on Earth",n=a.querySelector("#fpNote").value.trim()||"A cherished place in our hearts.",s=40.7128+(Math.random()-.5)*.1,r=-74.006+(Math.random()-.5)*.1;if(this.earth&&this.earth.geocode)try{let p=await this.earth.geocode(o);p&&(s=p.lat,r=p.lng)}catch{}let l={name:i,place:o,note:n,lat:s,lng:r,plotId:e.id};t.favoritePlaces=t.favoritePlaces||[],t.favoritePlaces.push(l);let d={id:"em_"+Date.now(),plotId:e.id,petName:t.petName||"Beloved Companion",species:t.species||"dog",years:t.years||"",epitaph:n,photo:t.photo||null,charity:t.charity||null,lat:s,lng:r,place:`${i} (${o})`,owner:t.owner||y.user?.name||"A loving family",ownerUid:y.user?.uid||"",gifts:0,guestbook:[],decorations:[],createdAt:Date.now()};v.addEarthMemorial(d),v.logActivity("pin",`Tagged ${i} on Earth in memory of ${t.petName}`),await v.save(y.user),await this.earth?.addMemorialMarker(d),B.playChime(660,.08),this.closeModal(),this.openPlot(e),this.toast(`Tagged "${i}" on Earth \u2014 linked to Plot ${e.id}.`,6e3,"pin")}},memorialCertificateModal(e){let t=!!e.status,a=t?e.memorial||{}:e,i=a.petName||"Beloved Companion",o=a.species||"Companion",n=a.years||"Forever in our hearts",s=a.epitaph||"Until we meet again at the Rainbow Bridge.",r=a.photo,l=W(a.charity||v.data?.charity||R[0].id)||"Verified Animal Rescue",d=t?`Eternal Valley Sanctuary \xB7 ${F[e.district]?.name||"Memorial Grove"} \xB7 Plot ${e.id}`:`Sacred Earth Spot \xB7 ${e.place||"Earthly Sanctuary"}`,p=t?`${location.origin}${location.pathname}?p=${encodeURIComponent(e.id)}`:`${location.origin}${location.pathname}?m=${encodeURIComponent(e.id)}`,g=`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(p)}&color=212-175-55&bgcolor=14-20-16`;this.modal(`
      <div class="cert-modal-wrap" id="certModalWrap">
        <div class="cert-card" id="certCardPrint">
          <div class="cert-corner tl"></div>
          <div class="cert-corner tr"></div>
          <div class="cert-corner bl"></div>
          <div class="cert-corner br"></div>

          <div class="cert-header">
            <div class="cert-crest">${h("crest",{size:38})}</div>
            <h1 class="cert-title">CERTIFICATE OF PERPETUAL MEMORIAL</h1>
            <div class="cert-sub">ETERNAL VALLEY \xB7 SOMEWHERE OVER THE RAINBOW BRIDGE</div>
          </div>

          <div class="cert-body">
            <div class="cert-portrait-wrap">
              ${r?`<img src="${r}" class="cert-portrait-img" alt="${k(i)}">`:`<div class="cert-portrait-icon">${ce(Ue(o),{size:52})}</div>`}
            </div>

            <h2 class="cert-pet-name">${k(i)}</h2>
            <div class="cert-species-years">${k(o)} \xB7 ${k(n)}</div>
            
            <p class="cert-epitaph">\u201C${k(s)}\u201D</p>

            <div class="cert-location">
              <b>${h("pin")} Sacred Consecrated Resting Place:</b><br>
              <span>${k(d)}</span>
            </div>

            <div class="cert-charity-badge">
              ${h("heart")} Dedicated Rescue Beneficiary: <b>${k(l)}</b>
            </div>
          </div>

          <div class="cert-footer">
            <div class="cert-qr-wrap">
              <img src="${g}" class="cert-qr-img" alt="Scan to visit memorial online" onerror="this.classList.add('hidden')">
              <span>Scan to visit memorial in 3D</span>
            </div>
            <div class="cert-sig-wrap">
              <div class="cert-sig-line"></div>
              <div class="cert-sig-label">Eternal Valley Sanctuary Keeper</div>
              <div class="cert-id-tag">Memorial Registry ID: ${e.id}</div>
            </div>
          </div>
        </div>

        <div class="cert-actions" style="display:flex;gap:10px;margin-top:18px">
          <button class="btn btn-gold btn-block" id="certPrintBtn">${h("dove")} Print / Save as PDF Certificate</button>
          <button class="btn btn-outline" id="certCopyBtn" title="Copy direct link">${h("share")} Copy Link</button>
        </div>
      </div>
    `),c("#certPrintBtn").onclick=()=>{window.print()},c("#certCopyBtn").onclick=()=>{navigator.clipboard.writeText(p).then(()=>{this.toast("Memorial link copied to clipboard!",4e3,"share")}).catch(()=>{this.toast(p,6e3)})}},campaignCreateModal(){if(!y.user||y.user.isGuest)return this.authModal(()=>this.campaignCreateModal());let e=c("#tpl-campaign-create").innerHTML;this.modal(e);let t=c("#modalBox"),a=t.querySelector("#cmpCharity");a.innerHTML=R.map(n=>`<option value="${n.id}">${k(n.name)} \u2014 ${k(n.cat)} (${k(n.city)}, ${k(n.state)})</option>`).join("");let i=t.querySelector("#cmpCharityNote"),o=()=>{let n=se(a.value);i.innerHTML=n?`<b>${k(n.name)}</b> (${k(n.city)}, ${k(n.state)})<br>
           <span style="color:var(--accent-hi-c);font-size:11.5px">${k(n.rating||"")}</span><br>
           ${k(n.blurb)}<br>
           <span class="fine-dim">EIN ${k(n.ein)} \xB7 <a href="${k(n.url)}" target="_blank" rel="noopener noreferrer">${k(n.url.replace(/^https?:\/\//,""))}</a></span>`:""};a.onchange=o,o(),t.querySelector("#cmpCreate").onclick=()=>{let n=t.querySelector("#cmpName").value.trim();if(!n)return this.toast("Please enter their name.","warning");let s=V.create({petName:N(n),species:N(t.querySelector("#cmpSpecies").value.trim()),years:N(t.querySelector("#cmpYears").value.trim()),story:N(t.querySelector("#cmpStory").value.trim()),charityId:a.value,goalCents:+t.querySelector("#cmpGoal").value,owner:y.user.name||"A loving friend"});this.closeModal(),Z.renderPanel(this),c("#campaignPanel")?.classList.remove("hidden"),this.toast(`${s.petName}\u2019s campaign is live.`,"heart"),this.campaignViewModal(s)}},campaignViewModal(e){let t=c("#tpl-campaign-view").innerHTML;this.modal(t);let a=c("#modalBox"),i=V.raised(e),o=V.progress(e),n=se(e.charityId),s=(e.donations||[]).slice().reverse(),r=`${location.origin}${location.pathname}?campaign=${encodeURIComponent(e.id)}`;a.querySelector("#cvTitle").innerHTML=`${h("crest")} ${k(e.petName)}`,a.querySelector("#cvSub").textContent=`${[e.species,e.years].filter(Boolean).map(g=>k(g)).join(" \xB7 ")||"In loving memory"} \xB7 by ${k(e.owner||"A loving family")}`;let l=a.querySelector("#cvStory");e.story?l.innerHTML=`\u201C${k(e.story)}\u201D`:l.style.display="none",a.querySelector("#cvProgress").style.width=`${(o*100).toFixed(1)}%`,a.querySelector("#cvRaised").textContent=T(i),a.querySelector("#cvGoal").textContent=T(e.goalCents),a.querySelector("#cvGiversCount").textContent=s.length,a.querySelector("#cvGiversLabel").textContent=s.length===1?"Tribute Giver":"Tribute Givers";let d=a.querySelector("#cvCharityBlurb");n?d.innerHTML=`
        ${h("heart")} Dedicated Beneficiary: <b>${k(n.name)}</b> (${k(n.city)}, ${k(n.state)})<br>
        <span style="color:var(--accent-hi-c);font-size:11.5px">${k(n.rating||"")}</span><br>
        ${k(n.blurb)}
        <br><span class="fine-dim">IRS EIN: ${k(n.ein)} \xB7 <a href="${k(n.url)}" target="_blank" rel="noopener noreferrer">Official Website</a></span>
      `:d.style.display="none";let p=a.querySelector("#cvGiftsList");if(s.length){let g=u=>new Date(u).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"});p.innerHTML='<div class="shop-cat" style="margin-top:18px">Memorial Tributes &amp; Givers</div>'+s.map(u=>`
          <div class="feed-item">
            <div class="fi-icon">${h("heart")}</div>
            <div><b>${k(u.donor)}</b> \xB7 <span style="color:var(--accent-hi-c);font-weight:700">${T(u.gross)}</span>
              ${u.message?`<br><i style="color:#e6e2d8">\u201C${k(u.message)}\u201D</i>`:""}
              <span class="fi-time">${g(u.at)} \xB7 Verified Ledger #${u.seq}</span></div>
          </div>`).join("")}a.querySelector("#cvGive").onclick=()=>this.campaignDonateModal(e),a.querySelector("#cvShare").onclick=()=>{navigator.clipboard?.writeText(r),this.toast("Campaign tribute link copied to clipboard!","share")}},campaignDonateModal(e){let t=c("#tpl-campaign-donate").innerHTML;this.modal(t);let a=c("#modalBox"),i=se(e.charityId),o=i?.impactTiers||[{amount:1500,label:"$15",desc:"Provides warm beds & nutritious food"},{amount:3500,label:"$35",desc:"Vaccines, microchip & wellness exam"},{amount:7500,label:"$75",desc:"Urgent veterinary diagnostic care"},{amount:15e3,label:"$150",desc:"Critical surgery & rescue sponsorship"}];a.querySelector("#cdTitle").innerHTML=`${h("heart")} Give in ${k(e.petName)}\u2019s name`,a.querySelector("#cdSub").innerHTML=`Supporting <b>${k(i?.name||"the rescue charity")}</b>. <b>100% of your donation passes directly to the shelter.</b>`,a.querySelector("#cdTiers").innerHTML=o.map((r,l)=>`
      <button class="give-chip${l===1?" is-on":""}" data-amt="${r.amount}">
        ${r.label}
      </button>
    `).join("");let n=o[1]?.amount||3500,s=()=>{let r=Oe("donation",n),l=o.find(u=>u.amount===n),d=a.querySelector("#cdTierNote");d&&(d.innerHTML=l?`\u2726 <b>Your impact:</b> ${k(l.desc)}`:"\u2726 <b>Your impact:</b> 100% directly funds vital animal rescue operations & veterinary care.");let p=a.querySelector("#cdBreak");if(p){p.hasChildNodes()||(p.innerHTML=`
            <div class="give-break__row"><span>Your donation</span><b id="gb-gross"></b></div>
            <div class="give-break__row is-fee"><span>Direct processing (Stripe rate)</span><b id="gb-proc"></b></div>
            <div class="give-break__row is-fee"><span>Platform fee</span><b>${T(0)} (0%)</b></div>
            <div class="give-break__row is-total"><span>Delivered to ${k(i?.name||"the charity")}</span><b id="gb-net"></b></div>
          `);let u=p.querySelector("#gb-gross"),w=p.querySelector("#gb-proc"),f=p.querySelector("#gb-net");u&&(u.textContent=T(r.gross)),w&&(w.textContent="\u2212"+T(r.processor)),f&&(f.textContent=T(r.charity))}let g=a.querySelector("#cdGo");g&&(g.innerHTML=`${h("heart")} Complete Tribute Donation (${T(r.gross)})`)};s(),a.querySelectorAll("[data-amt]").forEach(r=>{r.onclick=()=>{a.querySelectorAll("[data-amt]").forEach(l=>l.classList.remove("is-on")),r.classList.add("is-on"),a.querySelector("#cdOther").value="",n=+r.dataset.amt,s()}}),a.querySelector("#cdOther").oninput=r=>{let l=parseFloat(r.target.value);!isNaN(l)&&l>0&&(a.querySelectorAll("[data-amt]").forEach(d=>d.classList.remove("is-on")),n=we(l),s())},a.querySelector("#cdName").placeholder=k(y.user?.name||"A caring friend"),a.querySelector("#cdGo").onclick=async r=>{let l=r.currentTarget;if(n<100)return this.toast("Minimum donation is $1.00.","warning");let d=N(a.querySelector("#cdName").value.trim())||y.user?.name||"Anonymous",p=N(a.querySelector("#cdMsg").value.trim());l.disabled=!0,l.style.opacity=.5,l.textContent="Processing tribute\u2026";try{let g=await Q({kind:"donation",name:`Donation in memory of ${e.petName}`,amount:n/100,meta:{charity:e.charityId,campaignId:e.id}});if(!g.ok)return;y.user||y.continueAsGuest(!0);let u=g.entry;e.donations.push({at:u?.at||Date.now(),donor:d,message:p,gross:u?.gross??n,charity:u?.charity??n,seq:u?.seq??0}),V._persist(),this.closeModal(),Z.renderPanel(this),this.toast(`${T(u?.charity??n)} delivered to ${W(e.charityId)} \u2014 thank you!`,5500,"heart"),Z.thanksModal(this,e,u)}catch(g){this.toast(String(g.message),"warning"),l.disabled=!1,l.style.opacity=1,l.innerHTML=`${h("heart")} Complete Tribute Donation`}}},griefWizardModal(e="sanctuary",t=null){let a=t||this._cachedWizardData||{},i=a.species||"dog",o=a.district||"meadows",n=a.placeType||e||"sanctuary",s=a.photo||null,r=Object.entries(F).map(([S,x])=>{let C=(this.plots||[]).filter(D=>D.status==="available"&&D.district===S).length;return`
      <div class="gw-district-card ${S===o?"is-selected":""}" data-district="${S}" data-price="${x.base}">
        <div class="gw-district-icon">${h(x.icon||"sparkle",{size:22})}</div>
        <div class="gw-district-info">
          <b>${x.name}</b>
          <span>${x.blurb?.slice(0,80)||"A peaceful resting place"}${x.blurb?.length>80?"\u2026":""}</span>
          <small style="display:block;margin-top:3px;color:var(--accent-hi-c);font-size:11px">
            ${C>0?`${C} plots available \xB7 `:""}Plot Tier: $${x.base}
          </small>
        </div>
      </div>`}).join(""),l=R.map(S=>`<div class="gw-charity-card ${S.id===(a.charity||R[0]?.id)?"is-selected":""}" data-charity="${S.id}">
        <div class="gw-charity-name">${h("heart",{size:14})} ${S.name}</div>
        <div class="gw-charity-desc">${S.blurb?.slice(0,90)||S.mission?.slice(0,90)||"Helping animals in need"}\u2026</div>
        <small class="fine-dim" style="display:block;margin-top:3px">EIN: ${S.ein} \xB7 ${S.city}, ${S.state}</small>
      </div>`).join("");this.modal(`
      <div class="gw-wrap" id="createMemorialModal" role="region" aria-label="Memorial Consecration Guided Journey">
        <div class="gw-progress">
          <div class="gw-dot is-active" data-step="1" title="Companion Info">1</div>
          <div class="gw-line"></div>
          <div class="gw-dot" data-step="2" title="Sacred Portrait">2</div>
          <div class="gw-line"></div>
          <div class="gw-dot" data-step="3" title="Epitaph & Comfort">3</div>
          <div class="gw-line"></div>
          <div class="gw-dot" data-step="4" title="Resting Place">4</div>
          <div class="gw-line"></div>
          <div class="gw-dot" data-step="5" title="Rescue Cause">5</div>
        </div>

        <!-- Step 1: Pet Info -->
        <div class="gw-step is-active" data-step="1">
          <div class="gw-step-icon">${ce(i,{size:42})}</div>
          <h2>Tell us about your companion</h2>
          <p class="gw-step-sub">They deserve to be remembered beautifully. Every detail honors their life.</p>
          <label>Their name <span style="color:var(--accent-hi-c)">*</span></label>
          <input id="gwName" placeholder="e.g. Luna, Max, Biscuit\u2026" maxlength="30" value="${k(a.name||"")}" autofocus required>
          
          <label>Species / Companion Type</label>
          <select id="gwSpecies">${_t(i)}</select>

          <div class="two-col" style="margin-top:6px">
            <div>
              <label>Birth Year / Date</label>
              <input id="gwBirthYear" placeholder="e.g. 2012" maxlength="16" value="${k(a.birthYear||"")}">
            </div>
            <div>
              <label>Passing Year / Date</label>
              <input id="gwPassYear" placeholder="e.g. 2025" maxlength="16" value="${k(a.passYear||"")}">
            </div>
          </div>
          <input type="hidden" id="gwYears" value="${k(a.years||"")}">
          <button class="btn btn-gold btn-block gw-next-btn" data-to="2" style="margin-top:14px">Continue \u2014 add their portrait \u2192</button>
        </div>

        <!-- Step 2: Sacred Portrait & Photo Upload -->
        <div class="gw-step" data-step="2">
          <div class="gw-step-icon">${h("photo",{size:38})}</div>
          <h2>Their sacred portrait</h2>
          <p class="gw-step-sub">Upload a cherished photograph for their headstone and memorial profile (optional).</p>

          <div class="gw-photo-box">
            <div class="gw-photo-avatar" id="gwPhotoPreview">
              ${s?`<img src="${s}" alt="Companion preview">`:ce(i,{size:46})}
            </div>
            <div class="gw-photo-status" id="gwPhotoStatus">
              ${s?"Portrait ready for consecration":"No photo uploaded yet (optional)"}
            </div>
            <div class="gw-photo-actions">
              <input id="gwPhoto" type="file" accept="image/*" style="display:none">
              <button type="button" class="btn btn-outline" id="gwChoosePhotoBtn">${h("photo")} Choose Photo</button>
              <button type="button" class="btn btn-outline ${s?"":"hidden"}" id="gwRemovePhotoBtn" style="color:#f87171">${h("close")} Remove</button>
            </div>
            <small class="fine-dim" style="font-size:11px">Supports JPG, PNG, WebP up to 10MB \xB7 Automatically optimized</small>
          </div>

          <div class="gw-nav-row">
            <button class="btn btn-outline gw-back-btn" data-to="1">\u2190 Back</button>
            <button class="btn btn-gold gw-next-btn" data-to="3">Continue \u2014 write epitaph \u2192</button>
          </div>
        </div>

        <!-- Step 3: Epitaph & Words of Comfort -->
        <div class="gw-step" data-step="3">
          <div class="gw-step-icon">${h("dove",{size:38})}</div>
          <h2>Write something from the heart</h2>
          <p class="gw-step-sub">These words will appear on their headstone and memorial profile for every visitor to read.</p>
          
          <label>Epitaph &amp; Words of Comfort</label>
          <textarea id="gwEpitaph" rows="3" maxlength="140" placeholder="Forever chasing butterflies in the sunlight\u2026">${k(a.epitaph||"")}</textarea>
          <div class="gw-char-count"><span id="gwEpitaphCount">0</span> / 140 characters</div>

          <div class="gw-prompts" title="Click to fill comfort words">
            <span class="gw-prompt" data-txt="Forever loved, forever remembered.">\u{1F49B} Loved</span>
            <span class="gw-prompt" data-txt="You were the best part of every day.">\u{1F305} Joy</span>
            <span class="gw-prompt" data-txt="Until we meet again at the Rainbow Bridge.">\u{1F308} Bridge</span>
            <span class="gw-prompt" data-txt="The house is quieter without you.">\u{1F3E1} Home</span>
            <span class="gw-prompt" data-txt="Rest peacefully in eternal sunshine.">\u{1F54A}\uFE0F Peace</span>
            <span class="gw-prompt" data-txt="You taught me what unconditional love means.">\u2764\uFE0F Grace</span>
          </div>

          <label>Headstone &amp; Memorial Marker Style</label>
          <select id="gwHeadstone">
            ${vt.map(S=>`<option value="${S.id}" ${S.id===(a.headstone||"classic")?"selected":""}>${S.label}</option>`).join("")}
          </select>

          <div class="gw-nav-row">
            <button class="btn btn-outline gw-back-btn" data-to="2">\u2190 Back</button>
            <button class="btn btn-gold gw-next-btn" data-to="4">Continue \u2014 resting place \u2192</button>
          </div>
        </div>

        <!-- Step 4: Sanctuary Plot & Earth Spot Assignment -->
        <div class="gw-step" data-step="4">
          <div class="gw-step-icon">${h("sparkle",{size:38})}</div>
          <h2>Choose their resting place &amp; plot tier</h2>
          <p class="gw-step-sub">Consecrate a sacred 3D plot in the Sanctuary Valley, or place an eternal memorial pin anywhere on Earth.</p>

          <div class="gw-place-toggle">
            <button type="button" class="gw-pt-btn ${n==="sanctuary"?"is-active":""}" id="gwPtSanctuary" data-pt="sanctuary">
              <span class="gw-pt-icon">${h("sparkle",{size:18})}</span>
              <div class="gw-pt-text">
                <b>Sanctuary 3D Plot</b>
                <span>Sacred districts in the living Rainbow Bridge valley</span>
              </div>
            </button>
            <button type="button" class="gw-pt-btn ${n==="globe"?"is-active":""}" id="gwPtGlobe" data-pt="globe">
              <span class="gw-pt-icon">${h("globe",{size:18})}</span>
              <div class="gw-pt-text">
                <b>Global Memorial on Earth</b>
                <span>Pin their favorite park, trail, beach, or home</span>
              </div>
            </button>
          </div>
          <input type="hidden" id="gwPlaceType" value="${n}">

          <!-- Sanctuary District Picker -->
          <div id="gwSanctuarySection" class="${n==="globe"?"hidden":""}">
            <div class="gw-district-grid" id="gwDistrictGrid">
              ${r}
            </div>
            <input type="hidden" id="gwDistrict" value="${o}">
          </div>

          <!-- Earth Location Picker -->
          <div id="gwGlobeSection" class="${n==="sanctuary"?"hidden":""}">
            <label>Location on Earth (City, Park, Beach, or Home)</label>
            <input id="gwEarthLoc" placeholder="e.g. Crissy Field Beach, San Francisco, CA" maxlength="60" value="${k(a.earthLoc||"Pacific Coast Trail, CA")}">
            <div class="two-col" style="margin-top:6px">
              <div>
                <label>Latitude</label>
                <input id="gwEarthLat" type="number" step="0.0001" value="${a.earthLat||37.8024}">
              </div>
              <div>
                <label>Longitude</label>
                <input id="gwEarthLng" type="number" step="0.0001" value="${a.earthLng||-122.4665}">
              </div>
            </div>
          </div>

          <!-- Dynamic Tier Pricing Card -->
          <div class="gw-tier-card" id="gwTierPricingCard"></div>

          <div class="gw-nav-row">
            <button class="btn btn-outline gw-back-btn" data-to="3">\u2190 Back</button>
            <button class="btn btn-gold gw-next-btn" data-to="5" id="gwStep4Next">Continue \u2014 choose cause \u2192</button>
          </div>
        </div>

        <!-- Step 5: Charity Fund Allocation & Consecration -->
        <div class="gw-step" data-step="5">
          <div class="gw-step-icon">${h("heart",{size:38})}</div>
          <h2>Help a living animal in their honor</h2>
          <p class="gw-step-sub">${Math.round(fe.plot.charity*100)}% of your consecrated plot goes directly to the verified animal rescue you choose.</p>
          
          <div class="gw-charity-grid" id="gwCharityGrid">
            ${l}
          </div>
          <input type="hidden" id="gwCharity" value="${a.charity||R[0]?.id||""}">
          
          <!-- Dynamic Percentage Split Calculation -->
          <div class="gw-split-table" id="gwSplitCalc"></div>
          <div class="gw-impact-callout" id="gwImpactCallout"></div>

          <div class="gw-summary" id="gwSummary"></div>

          <button class="btn btn-gold btn-block btn-lg" id="gwCreateBtn">
            ${h("crest")} Consecrate Their Memorial
          </button>
          <p class="fine" style="margin-top:8px;text-align:center">${O?"Demo mode \u2014 simulated instant consecration.":"Secure payment via Stripe. Immutable cryptographic ledger recording."}</p>
          
          <div class="gw-nav-row" style="margin-top:6px">
            <button class="btn btn-outline gw-back-btn" data-to="4">\u2190 Back</button>
          </div>
        </div>
      </div>
    `);let d=document.getElementById("createMemorialModal")||document.getElementById("griefWizard"),p=()=>{let S=document.getElementById("gwSpecies")?.value||"dog",x=document.getElementById("gwPhotoPreview"),C=document.getElementById("gwPhotoStatus"),D=document.getElementById("gwRemovePhotoBtn");s?(x&&(x.innerHTML=`<img src="${s}" alt="Portrait preview">`),C&&(C.textContent="Portrait ready for consecration"),D&&D.classList.remove("hidden")):(x&&(x.innerHTML=ce(S,{size:46})),C&&(C.textContent="No photo uploaded yet (optional)"),D&&D.classList.add("hidden"))},g=()=>{let S=document.getElementById("gwPlaceType")?.value||"sanctuary",x=document.getElementById("gwDistrict")?.value||"meadows",C=F[x],D=document.getElementById("gwTierPricingCard");if(D)if(S==="sanctuary"){let oe=C?.base||249;D.innerHTML=`
          <div class="gw-tier-header">
            <span class="gw-tier-title">${h("sparkle",{size:14})} 3D Sanctuary Plot \xB7 ${k(C?.name||"Memorial Meadows")}</span>
            <span class="gw-tier-price">$${oe}</span>
          </div>
          <ul class="gw-tier-perks">
            <li>Permanent sacred plot in the 3D Rainbow Bridge Sanctuary</li>
            <li>Fully customizable headstone &amp; perpetual interactive candle vigil</li>
            <li>${Math.round(fe.plot.charity*100)}% charitable pass-through tithe to verified animal rescues</li>
            <li>Public SHA-256 cryptographic ledger registry certificate</li>
          </ul>`}else D.innerHTML=`
          <div class="gw-tier-header">
            <span class="gw-tier-title">${h("globe",{size:14})} Global Sacred Footprint Pin on Earth</span>
            <span class="gw-tier-price">$15</span>
          </div>
          <ul class="gw-tier-perks">
            <li>Permanent interactive GPS pin on the 3D NASA satellite globe</li>
            <li>Worldwide memorial registry &amp; Street View walk capability</li>
            <li>10% charitable pass-through tithe to verified animal rescues</li>
            <li>Public SHA-256 cryptographic ledger entry</li>
          </ul>`},u=()=>{let S=document.getElementById("gwPlaceType")?.value||"sanctuary",x=document.getElementById("gwDistrict")?.value||"meadows",C=F[x],D=S==="sanctuary"?C?.base||249:15,oe=we(D),he=Oe("plot",oe),Je=document.getElementById("gwCharity")?.value||R[0]?.id,Te=se(Je)||R[0],Re=qe(he.charity),Ge=document.getElementById("gwSplitCalc");Ge&&(Ge.innerHTML=`
          <div class="gw-split-row"><span>Plot Consecration Tier</span><b>${T(he.gross)}</b></div>
          <div class="gw-split-row is-fee"><span>Direct processing (Stripe rate)</span><b>\u2212${T(he.processor)}</b></div>
          <div class="gw-split-row is-fee"><span>Sanctuary 3D infrastructure (ops)</span><b>\u2212${T(he.ops)}</b></div>
          <div class="gw-split-row is-total"><span>Delivered directly to ${k(Te.name)}</span><b>${T(he.charity)}</b></div>`);let _e=document.getElementById("gwImpactCallout");_e&&(_e.innerHTML=`\u2726 <b>Real-World Impact:</b> This memorial provides <b>${Re.mealsProvided} warm meals</b> and medical support for rescued shelter animals at <b>${k(Te.name)}</b>.`)},w=S=>{if(typeof S!="number"||isNaN(S)||S<1||S>5)return;if(S>1&&!document.getElementById("gwName")?.value?.trim()){this.toast("Please enter your companion\u2019s name to continue.","warning"),document.getElementById("gwName")?.focus();return}d.querySelectorAll(".gw-step").forEach(C=>C.classList.toggle("is-active",C.dataset.step===String(S))),d.querySelectorAll(".gw-dot").forEach(C=>{let D=Number(C.dataset.step);C.classList.toggle("is-active",D===S),C.classList.toggle("is-done",D<S)});let x=d.closest(".modal-body");if(x&&x.scrollTo({top:0,behavior:"smooth"}),S===2&&p(),S===4){g();let C=document.getElementById("gwPlaceType")?.value,D=document.getElementById("gwDistrict")?.value;if(C==="sanctuary"&&D){let oe=pt[D]||D;this.world?.flyToDistrict(oe)}}S===5&&(u(),this._gwUpdateSummary(s))};d.querySelectorAll(".gw-next-btn").forEach(S=>{S.onclick=x=>{x.preventDefault(),w(Number(S.dataset.to))}}),d.querySelectorAll(".gw-back-btn").forEach(S=>{S.onclick=x=>{x.preventDefault(),w(Number(S.dataset.to))}}),document.getElementById("gwSpecies")?.addEventListener("change",S=>{let x=d.querySelector('.gw-step[data-step="1"] .gw-step-icon');x&&(x.innerHTML=ce(S.target.value,{size:42})),p()});let f=document.getElementById("gwPhoto"),M=document.getElementById("gwChoosePhotoBtn"),L=document.getElementById("gwRemovePhotoBtn");M?.addEventListener("click",()=>f?.click()),f?.addEventListener("change",async()=>{let S=f.files?.[0];if(S){if(S.size>10*1024*1024){this.toast("Photo exceeds 10MB limit. Please choose a smaller photo.","warning"),f.value="";return}let x=await Bt(S,420);x?(s=x,p(),this.toast("Portrait attached successfully!","photo")):(this.toast("Could not process this image format. Please try a standard JPG or PNG.","warning"),f.value="",s=null,p())}}),L?.addEventListener("click",()=>{s=null,f&&(f.value=""),p()});let P=document.getElementById("gwEpitaph"),A=document.getElementById("gwEpitaphCount"),G=()=>{A&&P&&(A.textContent=String(P.value.length))};P?.addEventListener("input",G),G(),d.querySelectorAll(".gw-prompt").forEach(S=>{S.onclick=()=>{P&&(P.value=S.dataset.txt,G())}});let K=d.querySelectorAll(".gw-pt-btn");K.forEach(S=>{S.onclick=()=>{K.forEach(C=>C.classList.remove("is-active")),S.classList.add("is-active");let x=S.dataset.pt;if(document.getElementById("gwPlaceType").value=x,document.getElementById("gwSanctuarySection")?.classList.toggle("hidden",x!=="sanctuary"),document.getElementById("gwGlobeSection")?.classList.toggle("hidden",x!=="globe"),g(),x==="sanctuary"){let C=document.getElementById("gwDistrict")?.value||"meadows",D=pt[C]||C;this.world?.flyToDistrict(D)}}});let U=document.getElementById("gwDistrictGrid");U?.addEventListener("click",S=>{let x=S.target.closest(".gw-district-card");if(!x)return;U.querySelectorAll(".gw-district-card").forEach(oe=>oe.classList.remove("is-selected")),x.classList.add("is-selected");let C=x.dataset.district;document.getElementById("gwDistrict").value=C,g();let D=pt[C]||C;this.world?.flyToDistrict(D)});let me=document.getElementById("gwCharityGrid");me?.addEventListener("click",S=>{let x=S.target.closest(".gw-charity-card");x&&(me.querySelectorAll(".gw-charity-card").forEach(C=>C.classList.remove("is-selected")),x.classList.add("is-selected"),document.getElementById("gwCharity").value=x.dataset.charity,u(),this._gwUpdateSummary(s))}),document.getElementById("gwCreateBtn").onclick=()=>this._gwCreate(null,s)},_gwUpdateSummary(e=null){let t=document.getElementById("gwName")?.value?.trim()||"Beloved Friend",a=document.getElementById("gwSpecies")?.value||"dog",i=document.getElementById("gwPlaceType")?.value||"sanctuary",o=document.getElementById("gwDistrict")?.value||"meadows",n=F[o],s=document.getElementById("gwEarthLoc")?.value?.trim()||"Sacred Earth Spot",r=W(document.getElementById("gwCharity")?.value)||"Animal Rescue Partner",l=document.getElementById("gwBirthYear")?.value?.trim()||"",d=document.getElementById("gwPassYear")?.value?.trim()||"",p=[l,d].filter(Boolean).join(" \u2013 ")||"Forever",g=document.getElementById("gwSummary");g&&(g.innerHTML=`
        <div class="gw-summary-card">
          <div class="gw-summary-icon">
            ${e?`<img src="${e}" alt="Companion Photo" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`:ce(a,{size:28})}
          </div>
          <div class="gw-summary-body">
            <b>${k(t)} (${p})</b>
            <span>${i==="sanctuary"?n?.name||"Sanctuary 3D Valley":k(s)} \xB7 ${h("heart",{size:12})} Beneficiary: ${k(r)}</span>
          </div>
        </div>`)},async _gwCreate(e=null,t=null){if(!this._isCreating){this._isCreating=!0;try{let a=e?.birthYear||document.getElementById("gwBirthYear")?.value?.trim()||"",i=e?.passYear||document.getElementById("gwPassYear")?.value?.trim()||"",o=e?.years||(a&&i?`${a} \u2013 ${i}`:a||i||document.getElementById("gwYears")?.value?.trim()||String(new Date().getFullYear())),n=e?.photo||t||await We(document.getElementById("gwPhoto")),s={name:e?.name||document.getElementById("gwName")?.value?.trim()||"Beloved Friend",species:e?.species||document.getElementById("gwSpecies")?.value||"dog",birthYear:a,passYear:i,years:o,epitaph:e?.epitaph||document.getElementById("gwEpitaph")?.value?.trim()||"Forever loved.",headstone:e?.headstone||document.getElementById("gwHeadstone")?.value||"classic",photo:n,placeType:e?.placeType||document.getElementById("gwPlaceType")?.value||"sanctuary",district:e?.district||document.getElementById("gwDistrict")?.value||"meadows",charity:e?.charity||document.getElementById("gwCharity")?.value||R[0]?.id,earthLoc:e?.earthLoc||document.getElementById("gwEarthLoc")?.value?.trim()||"Sacred Memorial Spot",earthLat:e?.earthLat!=null?e.earthLat:Number(document.getElementById("gwEarthLat")?.value)||37.8024,earthLng:e?.earthLng!=null?e.earthLng:Number(document.getElementById("gwEarthLng")?.value)||-122.4665};if(!s.name)return this.toast("Please enter your companion\u2019s name.","warning");if(!y.user||y.user.isGuest)return this._cachedWizardData=s,this.authModal(()=>this._gwCreate(this._cachedWizardData));if(!O&&!v.hasMembership())return this._cachedWizardData=s,this.toast("A membership is needed to own plots and memorials."),this.membershipModal(()=>this._gwCreate(this._cachedWizardData));let{name:r,species:l,years:d,epitaph:p,headstone:g,photo:u,placeType:w,district:f,charity:M,earthLoc:L,earthLat:P,earthLng:A}=s,G=document.getElementById("gwCreateBtn");if(G&&(G.textContent="Consecrating memorial\u2026",G.disabled=!0),w==="globe"){let x="em_"+Date.now(),C={id:x,ownerUid:y.user.uid,petName:N(r),species:l,years:d,epitaph:N(p),photo:u,place:L,lat:P,lng:A,charity:M||null,gifts:0,created:Date.now()};try{let D=await Q({kind:"plot",name:`Earth Memorial \u2014 ${r} (${L})`,amount:15,meta:{memorialId:x,uid:y.user.uid,charity:C.charity||v.data?.charity||R[0].id}});D.ok?(v.addEarthMemorial(C),await v.save(y.user),this._cachedWizardData=null,this.closeModal(),await this.showGlobe(),this.globe?.addPin({lat:P,lng:A,name:L,memorial:C}),this.globe?.focus(P,A),B.playChime(528,.08),setTimeout(()=>B.playChime(660,.06),400),setTimeout(()=>B.playChime(880,.05),800),this.toast(`${r}'s memorial is consecrated on Earth at ${L}. \u{1F30D}\u{1F49B}`,8e3,"globe")):D.redirected||(this.toast(D.error||"Payment could not be processed.","warning"),G&&(G.innerHTML=`${h("crest")} Consecrate Their Memorial`,G.disabled=!1))}catch(D){this.toast(String(D.message||D),"warning"),G&&(G.innerHTML=`${h("crest")} Consecrate Their Memorial`,G.disabled=!1)}return}let K=this.plots?.filter(x=>x.status==="available"&&x.district===f)||[];if(K.length||(K=this.plots?.filter(x=>x.status==="available")||[]),!K.length){this.toast(`No available plots found in ${F[f]?.name||"the sanctuary"}.`),G&&(G.innerHTML=`${h("crest")} Consecrate Their Memorial`,G.disabled=!1);return}let U=K[0],me=F[U.district],S={petName:N(r),species:l,years:d,epitaph:N(p),headstone:g,photo:u,charity:M||null};try{let x=await Q({kind:"plot",name:`Rainbow Bridge \u2014 Plot ${U.id} (${me?.name||"Sanctuary"})`,amount:U.price,meta:{plotId:U.id,uid:y.user.uid,charity:S.charity||v.data?.charity||R[0].id}});x.ok?(v.buyPlot(U,S),await v.save(y.user),this._cachedWizardData=null,this.closeModal(),this.refreshWorld(),await this.show3D(),this.world?.selectPlot(U),this.openPlot(U),B.playChime(528,.08),setTimeout(()=>B.playChime(660,.06),400),setTimeout(()=>B.playChime(880,.05),800),this.toast(`${r}'s memorial is consecrated forever in ${me?.name||"the Sanctuary"}. \u{1F49B}`,8e3,"crest")):x.redirected||(this.toast(x.error||"Payment could not be processed.","warning"),G&&(G.innerHTML=`${h("crest")} Consecrate Their Memorial`,G.disabled=!1))}catch(x){this.toast(String(x.message||x),"warning"),G&&(G.innerHTML=`${h("crest")} Consecrate Their Memorial`,G.disabled=!1)}}finally{this._isCreating=!1}}},editPetModal(e,t,a){let i=e.petProfile||{};this.modal(`
      <h2>${h("edit")} ${e.petName}'s profile</h2>
      <div class="modal-sub">Everything here appears on the memorial for every visitor.</div>
      <label>Birthday</label><input id="ppBirth" maxlength="30" value="${i.birthday||""}" placeholder="March 3, 2010">
      <label>Crossed the bridge</label><input id="ppPass" maxlength="30" value="${i.passing||""}" placeholder="June 12, 2023">
      <label>About ${e.petName}</label><textarea id="ppAbout" rows="3" maxlength="400" placeholder="Their story, their personality\u2026">${i.about||""}</textarea>
      <label>Favorite toys</label><input id="ppToys" maxlength="80" value="${i.favToys||""}">
      <label>Favorite activities</label><input id="ppActs" maxlength="80" value="${i.favActivities||""}">
      <label>Favorite treats</label><input id="ppTreats" maxlength="80" value="${i.favTreats||""}">
      <label>Add photos to the gallery (${(i.gallery||[]).length}/6 so far)</label>
      <input id="ppGallery" type="file" accept="image/*" multiple>
      <label>Video links \u2014 one per line (YouTube, etc.)</label>
      <textarea id="ppVideos" rows="2" placeholder="https://youtube.com/\u2026">${(i.videos||[]).join(`
`)}</textarea>
      <label>Contact email shown on the memorial (optional)</label>
      <input id="ppContact" type="email" maxlength="60" value="${i.contactEmail||""}" placeholder="family@example.com">
      <button class="btn btn-gold btn-block" id="ppSave">Save profile</button>`),c("#ppSave").onclick=async()=>{let o=await _a(c("#ppGallery"),420,6);e.petProfile={birthday:N(c("#ppBirth").value.trim()),passing:N(c("#ppPass").value.trim()),about:N(c("#ppAbout").value.trim()),favToys:N(c("#ppToys").value.trim()),favActivities:N(c("#ppActs").value.trim()),favTreats:N(c("#ppTreats").value.trim()),gallery:[...i.gallery||[],...o].slice(0,6),videos:c("#ppVideos").value.split(`
`).map(n=>n.trim()).filter(n=>/^https?:\/\//.test(n)).slice(0,3),contactEmail:c("#ppContact").value.trim().slice(0,60)},a?.(e.petProfile),await v.save(y.user),this.closeModal(),t(),this.toast(`${e.petName}'s profile updated.`)}},profileModal(e){if(!y.user)return this.authModal(()=>this.profileModal(e));let t=v.data.socials||{},a=v.data?.profile||{};this.modal(`
      <h2>Your profile</h2>
      <div class="modal-sub">Your public face across the Bridge \u2014 shown on your memorials so friends and visitors can find you.</div>
      <div style="display:flex;gap:14px;align-items:center;margin:10px 0">
        ${a.avatar?`<img src="${a.avatar}" alt="Pet Avatar" class="pet-photo" style="width:64px;height:64px">`:`<div class="crest-lg">${h("crest",{size:44})}</div>`}
        <div style="flex:1"><label style="margin-top:0">Profile picture / avatar</label>
        <input id="prAvatar" type="file" accept="image/*"></div>
      </div>
      <label>Display name</label><input id="prName" maxlength="30" value="${y.user.name||""}">
      <label>Bio</label><textarea id="prBio" rows="2" maxlength="200" placeholder="Dog dad in Denver. Ranger's family forever.">${a.bio||""}</textarea>
      <label>Contact email (shown only where you enable it)</label>
      <input id="prEmail" type="email" maxlength="60" value="${a.contactEmail||y.user.email||""}">
      <div class="divider">social accounts</div>
      <label>Instagram</label><input id="soIg" placeholder="@handle" value="${t.instagram||""}">
      <label>X / Twitter</label><input id="soX" placeholder="@handle" value="${t.x||""}">
      <label>TikTok</label><input id="soTt" placeholder="@handle" value="${t.tiktok||""}">
      <label>Facebook</label><input id="soFb" placeholder="profile name or URL" value="${t.facebook||""}">
      <div class="divider">giving</div>
      <label>Default charity (${Math.round(Be*100)}% of gifts to your memorials)</label>
      <select id="soCharity">
        <option value="">\u2014 choose later, per memorial \u2014</option>
        ${R.map(i=>`<option value="${i.id}" ${v.data.charity===i.id?"selected":""}>${i.name}</option>`).join("")}
      </select>
      <button class="btn btn-gold btn-block" id="soSave">Save profile</button>`),c("#soSave").onclick=async()=>{let i=await We(c("#prAvatar"),128)||a.avatar||null,o=N(c("#prName").value.trim());if(o){y.user.name=o;try{localStorage.setItem("ev_user",JSON.stringify(y.user))}catch{}}v.data||(v.data={}),v.data.profile={avatar:i,bio:N(c("#prBio").value.trim()),contactEmail:c("#prEmail").value.trim().slice(0,60)},v.data.socials={instagram:N(c("#soIg").value.trim()),x:N(c("#soX").value.trim()),tiktok:N(c("#soTt").value.trim()),facebook:N(c("#soFb").value.trim())},v.data.charity=c("#soCharity").value||null,await v.save(y.user,!0),o&&y._emit(),this.closeModal(),this.toast("Profile saved.","crest"),e?.()}},myBridgeModal(){if(!y.user||y.user.isGuest)return this.authModal(()=>this.myBridgeModal());let e=v.data?.profile||{},t=v.data.socials||{},a=v.membershipInfo(),i=Object.keys(v.data?.ownedPlots).map(r=>this.plots.find(l=>l.id===r)).filter(Boolean),o=(v.data?.earth?.memorials||[]).filter(r=>!y.user||r.ownerUid===y.user.uid||ie),n=i.reduce((r,l)=>r+(l.memorial?.gifts||0),0)+o.reduce((r,l)=>r+(l.gifts||0),0),s=["instagram","x","tiktok","facebook"].filter(r=>t[r]).map(r=>h({instagram:"instagram",x:"x",tiktok:"tiktok",facebook:"facebook"}[r])+" "+t[r]).join(" \xB7 ");this.modal(`
      <div style="display:flex;gap:16px;align-items:center">
        ${e.avatar?`<img src="${e.avatar}" alt="Pet Avatar" class="pet-photo" style="width:72px;height:72px">`:`<div class="crest-lg">${h("crest",{size:52})}</div>`}
        <div>
          <h2 style="margin:0">${y.user.name}</h2>
          <div class="modal-sub" style="margin:2px 0 0">${e.bio||"No bio yet \u2014 add one so visitors know who loved them."}</div>
          ${s?`<div style="font-size:12px;color:var(--gold-bright);margin-top:4px">${s}</div>`:""}
        </div>
      </div>
      <div style="display:flex;gap:8px;margin:14px 0;flex-wrap:wrap">
        <button class="btn btn-outline" id="mbProfile">${h("edit")} Edit profile</button>
        <button class="btn btn-outline" id="mbMembership">${a?h("crest")+" "+a.name+" member":"Choose a membership"}</button>
        <span class="btn btn-outline" style="cursor:default">${h("gift")} ${n} gifts received</span>
        ${v.data?.charity?`<span class="btn btn-outline" style="cursor:default">${h("heart")} ${W(v.data?.charity)}</span>`:""}
      </div>
      <div class="sub">Your sanctuary plots (${i.length}):</div>
      ${i.length?i.map(r=>`
        <div class="feed-item" data-myplot="${r.id}"><div class="fi-icon">${r.memorial?Ce(r.memorial,20):h("grave")}</div>
          <div><b>${r.memorial?.petName||"Plot"}</b> \xB7 ${F[r.district].name}
          <span class="fi-time">Plot ${r.id} \xB7 ${h("gift")} ${r.memorial?.gifts||0}</span></div></div>`).join(""):'<div class="fine" style="text-align:left">None yet \u2014 browse the Sanctuary to reserve one.</div>'}
      <div class="sub" style="margin-top:12px">Your memorials on Earth (${o.length}):</div>
      ${o.length?o.map(r=>`
        <div class="feed-item" data-mymem="${r.id}"><div class="fi-icon">${Ce(r,20)}</div>
          <div><b>${r.petName}</b> \xB7 ${r.place.split(",").slice(0,2).join(",")}
          <span class="fi-time">${h("gift")} ${r.gifts||0} \xB7 ${(r.guestbook||[]).length} guestbook entries</span></div></div>`).join(""):'<div class="fine" style="text-align:left">None yet \u2014 search any address and pick a glowing spot.</div>'}`),c("#mbProfile").onclick=()=>this.profileModal(()=>this.myBridgeModal()),c("#mbMembership").onclick=()=>this.membershipModal(()=>this.myBridgeModal()),c("#modalBox").querySelectorAll("[data-myplot]").forEach(r=>{r.onclick=()=>{let l=this.plots.find(d=>d.id===r.dataset.myplot);l&&(this.closeModal(),this.show3D().then(()=>this.world?.selectPlot(l)),this.openPlot(l))}}),c("#modalBox").querySelectorAll("[data-mymem]").forEach(r=>{r.onclick=()=>{let l=o.find(d=>d.id===r.dataset.mymem);l&&(this.closeModal(),this.showEarth(),this.openEarthMemorial(l))}})},shareModal(e,t,a){let i=encodeURIComponent;this.modal(`
      <h2>Share ${e}</h2>
      <div class="modal-sub">Invite friends & family to visit, light a candle, and leave a gift.</div>
      <div class="auth-providers">
        <button class="btn" id="shNative">${h("phone")} Share\u2026</button>
        <button class="btn" id="shCopy">${h("share")} Copy link</button>
        <a class="btn" style="text-align:center" href="https://twitter.com/intent/tweet?text=${i(a)}&url=${i(t)}" target="_blank" rel="noopener">\u{1D54F} Post on X</a>
        <a class="btn" style="text-align:center" href="https://www.facebook.com/sharer/sharer.php?u=${i(t)}" target="_blank" rel="noopener">\u24D5 Share on Facebook</a>
        <a class="btn" style="text-align:center" href="https://wa.me/?text=${i(a+" "+t)}" target="_blank" rel="noopener">${h("whatsapp")} WhatsApp</a>
        <a class="btn" style="text-align:center" href="mailto:?subject=${i(e)}&body=${i(a+`

`+t)}">${h("mail")} Email</a>
      </div>
      <p class="fine">Anyone with the link can visit \u2014 no account needed.</p>`),c("#shCopy").onclick=async()=>{try{await navigator.clipboard.writeText(t),this.toast("Link copied.","share")}catch{prompt("Copy this link:",t)}},c("#shNative").onclick=async()=>{if(navigator.share)try{await navigator.share({title:e,text:a,url:t})}catch{}else this.toast("Native sharing not available in this browser \u2014 use the buttons below.")}},membershipModal(e){let t=v.data.membership;this.modal(`
      <h2>Memberships</h2>
      <div class="modal-sub">A membership lets you own plots and build lasting memorials \u2014
        and ${Math.round(fe.membership.charity*100)}% of every one goes to the animal charity you choose.</div>
      <div class="district-blurb">${h("heart")} You never have to pay us to do good here.
        <a href="#" id="memCampaign">Starting a fundraising campaign</a> is free, needs no membership,
        and sends <b>100%</b> of what it raises to your charity.</div>
      <div class="tiers">
        ${$e.map(a=>`
          <div class="tier ${a.featured?"featured":""}">
            ${a.featured?'<div class="flag">MOST LOVED</div>':""}
            <h3>${a.name}</h3>
            <div class="t-price">${re(a.price)}<small>/${a.interval}</small></div>
            <ul>${a.perks.map(i=>`<li>${i}</li>`).join("")}</ul>
            <button class="btn ${t===a.id?"btn-outline":"btn-gold"} btn-block" data-m="${a.id}" ${t===a.id?"disabled":""}>
              ${t===a.id?"Current plan":"Choose "+a.name}</button>
          </div>`).join("")}
      </div>
      <p class="fine">${O?"Demo mode: subscription is simulated.":"Billed securely via Stripe. Cancel anytime."}</p>`),c("#modalBox").querySelector("#memCampaign")?.addEventListener("click",a=>{a.preventDefault(),this.closeModal(),Z.togglePanel(this)}),c("#modalBox").querySelectorAll("[data-m]").forEach(a=>{a.onclick=async()=>{let i=$e.find(o=>o.id===a.dataset.m);if(!y.user||y.user.isGuest)return this.closeModal(),this.authModal(()=>this.membershipModal(e));a.textContent="Processing\u2026",a.disabled=!0;try{(await Q({kind:"membership",name:`Rainbow Bridge \u2014 ${i.name} membership`,amount:i.price,meta:{membershipId:i.id,uid:y.user.uid,charity:v.data?.charity||R[0].id}})).ok&&(v.data.membership=i.id,await v.save(y.user),this.closeModal(),this.toast(`You are now a ${i.name} member.`),e?.())}catch(o){this.toast(String(o.message),"warning"),a.textContent="Choose "+i.name,a.disabled=!1}}})},buyPlotFlow(e){if(!y.user||y.user.isGuest)return this.authModal(()=>this.buyPlotFlow(e));if(!v.hasMembership())return this.toast("A membership is needed to own plots."),this.membershipModal(()=>this.buyPlotFlow(e));if(!v.canBuyPlot())return this.toast("Plot limit reached for your tier \u2014 upgrade to add more."),this.membershipModal();let t=F[e.district];this.modal(`
      <h2>Create a memorial</h2>
      <div class="modal-sub">Plot ${e.id} \xB7 ${t.name} \xB7 ${Xe[e.size]} \xB7 <b>$${e.price}</b><br>
        ${Math.round(fe.plot.charity*100)}% of this, and of every gift left here, goes to the charity you pick below.</div>
      <label>Pet's name</label><input id="mName" placeholder="e.g. Biscuit" maxlength="24">
      <label>Species</label>
      <select id="mSpecies">
        ${_t()}
      </select>
      <label>Years (e.g. 2012 \u2013 2025)</label><input id="mYears" placeholder="2012 \u2013 2025" maxlength="16">
      <label>Epitaph</label><textarea id="mEpitaph" rows="2" maxlength="120" placeholder="A few words to remember them by\u2026"></textarea>
      <label>Their photo (optional)</label><input id="mPhoto" type="file" accept="image/*">
      <label>Headstone</label>
      <select id="mHeadstone">
        ${vt.map(a=>`<option value="${a.id}">${a.label}</option>`).join("")}
      </select>
      <label>Their charity \u2014 where this plot's giving goes</label>
      <select id="mCharity">
        <option value="">Let each giver choose</option>
        ${R.map(a=>`<option value="${a.id}" ${v.data.charity===a.id?"selected":""}>${a.name}</option>`).join("")}
      </select>
      <button class="btn btn-gold btn-block" id="payPlotBtn">Pay $${e.price} & reserve forever</button>
      <p class="fine">${O?"Demo mode: payment is simulated.":"You will be redirected to Stripe\u2019s secure checkout."}</p>`),c("#payPlotBtn").onclick=async()=>{let a=c("#mName").value.trim()||"Beloved Friend",i=c("#mSpecies").value,o={petName:N(a),species:i,years:c("#mYears").value.trim()||String(new Date().getFullYear()),epitaph:N(c("#mEpitaph").value.trim())||"Forever loved.",headstone:c("#mHeadstone").value,photo:await We(c("#mPhoto")),charity:c("#mCharity").value||null},n=c("#payPlotBtn");n.textContent="Processing payment\u2026",n.disabled=!0;try{(await Q({kind:"plot",name:`Rainbow Bridge \u2014 Plot ${e.id} (${t.name})`,amount:e.price,meta:{plotId:e.id,uid:y.user.uid,charity:o.charity||v.data?.charity||R[0].id}})).ok&&(v.buyPlot(e,o),await v.save(y.user),this.closeModal(),this.refreshWorld(),this.openPlot(e),this.toast(`Plot ${e.id} is now ${a}'s forever home.`))}catch(s){this.toast(String(s.message),"warning"),n.textContent=`Pay $${e.price} & reserve forever`,n.disabled=!1}}},giftModal(e){let t=y.user?y.user.name:null,a=e.memorial?.charity,i=Math.round(Be*100),n=ht({[e.id]:e}).length>0?[...la,...pe]:pe;this.modal(`
      <h2>Leave a gift for ${e.memorial?.petName||"this friend"}</h2>
      <div class="modal-sub">Gifts are laid at the base of the memorial, in 3D, for every visitor to see. ${t?`Giving as <b>${t}</b>.`:"You can give as an anonymous guest."}</div>
      ${a?`<div class="district-blurb">${h("heart")} ${i}% of your gift goes to <b>${W(a)}</b> \u2014 the family's chosen cause.</div>`:`<label>${h("heart")} ${i}% of your gift goes to a charity of your choice</label>
           <select id="sgCharity">${R.map(s=>`<option value="${s.id}">${s.name}</option>`).join("")}</select>`}
      <div class="shop-grid">
        ${n.map(s=>`
          <button class="shop-item" data-g="${s.id}">
            <div class="s-emoji">${s.emoji?`<span style="font-size:42px">${s.emoji}</span>`:Pe(s.id,{size:46,alt:s.name})}</div>
            <div class="s-name">${s.name}</div>
            <div class="s-price">${re(s.price)}</div>
          </button>`).join("")}
      </div>
      <label>Add a short message (optional)</label>
      <input id="giftMsg" maxlength="80" placeholder="Run free, sweet friend\u2026">
      <p class="fine">${O?"Demo mode: payment is simulated.":"Processed securely by Stripe."}</p>`),c("#modalBox").querySelectorAll("[data-g]").forEach(s=>{s.onclick=async()=>{let r=n.find(g=>g.id===s.dataset.g),l=N(c("#giftMsg").value.trim()),d=a||c("#sgCharity")?.value||R[0].id,p=Math.round((r.id==="g_donation"?r.price:r.price*Be)*100)/100;s.style.opacity=.5;try{if((await Q({kind:"gift",name:`Gift: ${r.name} for ${e.memorial?.petName||"a friend"}`,amount:r.price,meta:{plotId:e.id,giftId:r.id,charity:d,donate:p}})).ok){y.user||y.continueAsGuest(!0),v.addGift(e,r.id,y.user.name,l);let u=ze[r.id];if(u){let w=(e.decor||[]).filter(f=>["flowers","candle","ball","bone","wreath"].includes(f.type)).length;e.decor.push({...u,dx:(w%3-1)*2.8+(Math.random()-.5),dz:4.5+Math.floor(w/3)*2.2}),this.refreshWorld()}await v.save(y.user),this.closeModal(),this.openPlot(e),this.toast(`Your gift was laid at the base of ${e.memorial?.petName||"the"}'s memorial.`,"gift")}}catch(g){this.toast(String(g.message),"warning"),s.style.opacity=1}}})},decorModal(e){let t=v.data.membership,a={mem_guardian:1,mem_legacy:2,mem_eternal:3},i=ie?3:a[t]||0,o=[...new Set(Se.map(s=>s.cat))],n=v.data?.ownedPlots?.[e.id]?.decor||[];this.modal(`
      <h2>Customize Plot ${e.id}</h2>
      <div class="modal-sub">Items placed: ${n.length}. Purchases appear on your plot in 3D, exactly where you choose.</div>
      <label>Where should the next item go?</label>
      <select id="decorSlot">
        ${le.map(s=>`<option value="${s.id}">${s.label}</option>`).join("")}
      </select>
      ${o.map(s=>`
        <div class="shop-cat">${s}</div>
        <div class="shop-grid">
          ${Se.filter(r=>r.cat===s).map(r=>{let d=(a[r.minTier]||0)>i;return`<button class="shop-item" data-i="${r.id}" ${d?'data-locked="1"':""}>
              <div class="s-emoji">${Pe(r.id,{size:46,alt:r.name})}</div>
              <div class="s-name">${r.name}</div>
              <div class="s-price">${d?"":re(r.price)}</div>
              ${d?`<div class="s-lock">${h("lock")} ${$e.find(p=>p.id===r.minTier)?.name}+</div>`:""}
            </button>`}).join("")}
        </div>`).join("")}
      <p class="fine">${O?"Demo mode: payments simulated.":"Processed securely by Stripe."}</p>`),c("#modalBox").querySelectorAll("[data-i]").forEach(s=>{s.onclick=async()=>{if(s.dataset.locked)return this.toast("This item needs a higher membership tier."),this.membershipModal();let r=Se.find(p=>p.id===s.dataset.i),l=c("#decorSlot").value,d=le.find(p=>p.id===l)||le[0];s.style.opacity=.5;try{if((await Q({kind:"item",name:`Plot item: ${r.name}`,amount:r.price,meta:{plotId:e.id,itemId:r.id,slot:l,charity:e.memorial?.charity||v.data?.charity||R[0].id}})).ok){v.addDecor(e.id,r.id,l);let g=tt[r.id];if(g){let u=()=>(Math.random()-.5)*2;e.decor.push({...g,dx:d.dx+u(),dz:d.dz+u()}),this.refreshWorld()}await v.save(y.user),this.toast(`${r.name} placed \u2014 ${d.label.toLowerCase()}.`,"flower"),s.style.opacity=1}}catch(p){this.toast(String(p.message),"warning"),s.style.opacity=1}}})},_searchableMemorials(){let e=Le(v.data).map(t=>({kind:"earth",id:t.id,petName:t.petName,species:t.species,years:t.years,place:t.place,epitaph:t.epitaph,gifts:t.gifts,ref:t}));for(let t of this.plots)t.status!=="occupied"||!t.memorial||e.push({kind:"plot",id:t.id,petName:t.memorial.petName,species:t.memorial.species,years:t.memorial.years,place:(F[t.district]?.name||"The Sanctuary")+" \xB7 Plot "+t.id,epitaph:t.memorial.epitaph,gifts:t.memorial.gifts,ref:t});return e},_rankMemorials(e){let t=e.trim().toLowerCase();if(t.length<2)return[];let a=[];for(let i of this._searchableMemorials()){let o=(i.petName||"").toLowerCase(),n=(i.place||"").toLowerCase(),s=(i.species||"").toLowerCase(),r=(i.epitaph||"").toLowerCase(),l=0;o===t?l=120:o.startsWith(t)?l=100:o.includes(t)?l=78:n.startsWith(t)?l=60:n.includes(t)?l=50:s.startsWith(t)?l=34:r.includes(t)&&(l=18),l&&(l+=Math.min(12,(i.gifts||0)/12),a.push({...i,score:l}))}return a.sort((i,o)=>o.score-i.score).slice(0,7)},_initMemorialSearch(e){let t=c("#earthSearch");if(!t)return;t.setAttribute("placeholder","Search a companion by name, or any place on Earth\u2026"),t.setAttribute("autocomplete","off"),t.setAttribute("role","combobox"),t.setAttribute("aria-expanded","false"),t.setAttribute("aria-autocomplete","list");let a=document.createElement("div");a.className="search-suggest hidden",a.id="searchSuggest",a.setAttribute("role","listbox"),t.parentElement.appendChild(a),this._suggestBox=a,this._suggestIndex=-1;let i=()=>{let n=t.value.trim(),s=[];if(!n)s.push(`<div class="ss-head">${h("sparkle")} Featured Companions</div>`),this._searchableMemorials().slice(0,4).forEach(p=>{s.push(`
            <button class="ss-row" data-mem="${p.kind}:${p.id}" role="option">
              <span class="ss-art">${Ce(p,22)}</span>
              <span class="ss-txt">
                <b>${Y(p.petName)}</b>
                <i>${[p.species,p.years].filter(Boolean).map(Y).join(" \xB7 ")}</i>
                <u>${Y(p.place||"")}</u>
              </span>
            </button>`)}),s.push(`<div class="ss-head">${h("crest")} 3D Sanctuary Districts</div>`),[{k:"meadows",name:"Meadow Grove",sub:"Rolling wildflower garden"},{k:"woodland",name:"Whispering Pines",sub:"Spruce & northern forest"},{k:"lakefront",name:"Lakeside Rest",sub:"Mirror Lake weeping willows"},{k:"beach",name:"Golden Shores",sub:"Sunlit beach & dunes"}].forEach(p=>{s.push(`
            <button class="ss-row ss-row--district" data-district="${p.k}" role="option">
              <span class="ss-art">${h("sparkle",{size:16})}</span>
              <span class="ss-txt"><b>${p.name}</b><i>${p.sub} \xB7 Fly to 3D district</i></span>
            </button>`)}),s.push(`<div class="ss-head">${h("pin")} Popular Sacred Places</div>`),["Golden Gate Park, San Francisco","Central Park, New York","Red Rock Canyon, Las Vegas"].forEach(p=>{s.push(`
            <button class="ss-row ss-row--place" data-place-preset="${Y(p)}" role="option">
              <span class="ss-art">${h("pin",{size:16})}</span>
              <span class="ss-txt"><b>${p}</b><i>Explore sacred footprint spots</i></span>
            </button>`)});else{let r=this._rankMemorials(n);r.length&&(s.push(`<div class="ss-head">${h("paw")} Companions (${r.length})</div>`),r.forEach(d=>{s.push(`
              <button class="ss-row" data-mem="${d.kind}:${d.id}" role="option">
                <span class="ss-art">${Ce(d,22)}</span>
                <span class="ss-txt">
                  <b>${Y(d.petName)}</b>
                  <i>${[d.species,d.years].filter(Boolean).map(Y).join(" \xB7 ")}</i>
                  <u>${Y(d.place||"")}</u>
                </span>
              </button>`)}));let l=Object.entries(F).filter(([d,p])=>p.name.toLowerCase().includes(n.toLowerCase()));l.length&&(s.push(`<div class="ss-head">${h("crest")} Sanctuary Districts</div>`),l.forEach(([d,p])=>{s.push(`
              <button class="ss-row ss-row--district" data-district="${d}" role="option">
                <span class="ss-art">${h("sparkle",{size:16})}</span>
                <span class="ss-txt"><b>${p.name}</b><i>${p.blurb?.slice(0,60)}\u2026</i></span>
              </button>`)})),s.push(`<div class="ss-head">${h("globe")} Places on Earth</div>`),s.push(`
          <button class="ss-row ss-row--place" data-place="1" role="option">
            <span class="ss-art">${h("pin",{size:18})}</span>
            <span class="ss-txt"><b>Find \u201C${Y(n)}\u201D on Earth</b>
              <i>Fly there and choose a spot</i></span>
          </button>`),!r.length&&!l.length&&s.splice(0,0,`<div class="ss-empty">No companion by \u201C${Y(n)}\u201D yet \u2014 search as a place below.</div>`)}a.innerHTML=s.join(""),a.classList.remove("hidden"),t.setAttribute("aria-expanded","true"),this._suggestIndex=-1,a.querySelectorAll("[data-mem]").forEach(r=>{r.onclick=()=>{let[l,...d]=r.dataset.mem.split(":"),p=d.join(":");this._closeSuggest(),t.value="",this.openSearchHit(l,p)}}),a.querySelectorAll("[data-district]").forEach(r=>{r.onclick=async()=>{let l=r.dataset.district;this._closeSuggest(),t.value="",await this.show3D(),this.world?.flyToDistrict(l)}}),a.querySelectorAll("[data-place-preset]").forEach(r=>{r.onclick=()=>{t.value=r.dataset.placePreset,this._closeSuggest(),e()}}),a.querySelector("[data-place]")?.addEventListener("click",()=>{this._closeSuggest(),e()})},o=null;t.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(i,80)}),t.addEventListener("focus",()=>i()),t.addEventListener("click",()=>i()),t.addEventListener("keydown",n=>{let s=[...a.querySelectorAll(".ss-row")];if(n.key==="Enter"){n.preventDefault(),this._suggestIndex>=0&&s[this._suggestIndex]?s[this._suggestIndex].click():(this._closeSuggest(),e());return}if(n.key==="Escape")return this._closeSuggest();n.key!=="ArrowDown"&&n.key!=="ArrowUp"||s.length&&(n.preventDefault(),this._suggestIndex+=n.key==="ArrowDown"?1:-1,this._suggestIndex<0&&(this._suggestIndex=s.length-1),this._suggestIndex>=s.length&&(this._suggestIndex=0),s.forEach((r,l)=>r.classList.toggle("is-on",l===this._suggestIndex)),s[this._suggestIndex].scrollIntoView({block:"nearest"}))}),document.addEventListener("mousedown",n=>{!a.contains(n.target)&&n.target!==t&&this._closeSuggest()})},_closeSuggest(){this._suggestBox?.classList.add("hidden"),this._suggestIndex=-1,c("#earthSearch")?.setAttribute("aria-expanded","false")},async openSearchHit(e,t){if(e==="plot"){let i=this.plots.find(o=>o.id===t);if(!i)return this.toast("That plot could not be found.","warning");await this.show3D(),this.world?.selectPlot(i),this.openPlot(i);return}let a=Le(v.data).find(i=>i.id===t);if(!a)return this.toast("That memorial could not be found.","warning");if(a.lat==null)return this.openEarthMemorial(a);await this.showEarth(),this.flyToPlace({lat:a.lat,lng:a.lng,range:420,name:a.petName},{announce:!1}),setTimeout(()=>this.openEarthMemorial(a),2400)},_initEarthUI(){let e=async()=>{let o=c("#earthSearch")?.value?.trim();if(o){this.toast("Searching\u2026",2500,"search"),await this.showEarth();try{if(!this.earth)throw new Error("Earth view unavailable");let n=await this.earth.geocode(o);this._lastPos={lat:n.lat,lng:n.lng},this.flyToPlace({lat:n.lat,lng:n.lng,range:380},{announce:!1}),this.toast(`${n.name.split(",").slice(0,2).join(",")} \u2014 glowing spots are available. Try Ground or Street to stand there.`,7e3),setTimeout(()=>this.earth?.showCandidateSpots(n),1800)}catch{this.toast("Could not find that place \u2014 try a fuller address.")}}};c("#earthGo")&&(c("#earthGo").onclick=()=>{this._closeSuggest(),e()}),this._placeSearch=e,this._initMemorialSearch(e),c("#locBtn")&&(c("#locBtn").onclick=()=>{if(!navigator.geolocation)return this.toast("Your browser does not support location.");this.toast("Finding you\u2026","pin"),navigator.geolocation.getCurrentPosition(async o=>{await this.showEarth();let n={lat:o.coords.latitude,lng:o.coords.longitude};this._lastPos=n,this.flyToPlace({...n,range:380},{announce:!1}),setTimeout(()=>this.earth?.showCandidateSpots(n),1800);let s=await this.earth?.reverseGeocode(n.lat,n.lng)||`${n.lat.toFixed(4)}, ${n.lng.toFixed(4)}`;this.toast(`${s.split(",").slice(0,2).join(",")} \u2014 glowing spots are available here. Try Ground to stand in it.`,7e3)},o=>{this.toast(o.code===1?"Location permission denied \u2014 type your address in the search bar instead.":"Could not get your location \u2014 try typing the address.",6e3)},{timeout:1e4,maximumAge:6e4})}),c("#orbitBtn")&&(c("#orbitBtn").onclick=()=>{this._lastPos=null,this.returnToOrbit()}),c("#homeBtn")&&(c("#homeBtn").onclick=async()=>{this._lastPos=null,await this.showEarth(),this.flyToPlace({lat:J.lat,lng:J.lng,range:2800,name:"Rainbow Bridge Valley"})}),c("#groundBtn")&&(c("#groundBtn").onclick=async()=>{await this.showEarth();let o=this._lastPos||this.earth?.getCenter()||{lat:J.lat,lng:J.lng};this.earth?.groundView(o)?this.toast("Standing at the place \u2014 the camera will slowly circle it. Drag to look around."):this.toast("Satellite mode is top-down only \u2014 click Enable 3D for the full ground-level recreation (buildings, trees, yards).",7e3)}),c("#streetBtn")&&(c("#streetBtn").onclick=async()=>{await this.showEarth(),this.streetViewOpen(this._lastPos||this.earth?.getCenter()||{lat:J.lat,lng:J.lng})}),c("#streetClose")&&(c("#streetClose").onclick=()=>{c("#streetPanel")?.classList.add("hidden");let o=c("#streetContainer");o&&(o.innerHTML="")}),c("#placeBtn")&&(c("#placeBtn").onclick=async()=>{await this.showEarth(),this.startPlacement()}),c("#placeCancel")&&(c("#placeCancel").onclick=()=>this._exitPlacement()),c("#placeCenter")&&(c("#placeCenter").onclick=()=>{let o=this.earth?.getCenter()||{lat:J.lat,lng:J.lng};this._exitPlacement(),this.earthMemorialForm(o)}),c("#feedBtn")&&(c("#feedBtn").onclick=()=>this.toggleFeed()),c("#feedClose")&&(c("#feedClose").onclick=()=>c("#feedPanel").classList.add("hidden")),c("#browseBtn")&&(c("#browseBtn").onclick=()=>this.toggleBrowse()),c("#browseClose")&&(c("#browseClose").onclick=()=>c("#browsePanel").classList.add("hidden")),c("#causeBtn")&&(c("#causeBtn").onclick=()=>Z.togglePanel(this)),c("#topbarCharityBtn")&&(c("#topbarCharityBtn").onclick=()=>Z.togglePanel(this)),c("#comfortBtn")&&(c("#comfortBtn").onclick=()=>this.comfortModal()),c("#partnerBtn")&&(c("#partnerBtn").onclick=()=>this.partnerModal()),c("#navBrowseBtn")&&(c("#navBrowseBtn").onclick=()=>this.toggleBrowse()),c("#membershipBtn")?.addEventListener("click",()=>this.membershipModal()),c("#brandLogo")?.addEventListener("click",()=>this.show3D()),c("#keepsakesBtn")?.addEventListener("click",()=>this.keepsakesModal()),c("#keepsakeToolbarBtn")?.addEventListener("click",()=>this.keepsakesModal()),c("#soundBtn")?.addEventListener("click",()=>this.soundModal()),c("#lanternBtn")?.addEventListener("click",()=>this.riverLanternsModal()),c("#lettersBtn")?.addEventListener("click",()=>this.lettersModal()),c("#treeRibbonBtn")?.addEventListener("click",()=>this.treeOfLifeModal()),c("#candleVigilBtn")?.addEventListener("click",()=>this.candleVigilModal()),c("#tourBtn")?.addEventListener("click",()=>this.show3D("tour")),c("#campaignClose")&&(c("#campaignClose").onclick=()=>c("#campaignPanel").classList.add("hidden"));let t=c("#navDropdownToggle"),a=c("#navDropdownMenu");t&&a&&(t.onclick=o=>{o.stopPropagation(),a.classList.toggle("hidden")},document.addEventListener("click",o=>{!a.contains(o.target)&&!t.contains(o.target)&&a.classList.add("hidden")}),a.querySelectorAll("button").forEach(o=>{o.addEventListener("click",()=>a.classList.add("hidden"))})),this.updateCharityTopbar();let i=c("#key3dBtn");et&&(i.innerHTML=h("globe")+" 3D on",i.classList.remove("btn-gold"),i.classList.add("btn-outline")),i.onclick=()=>this.mapsKeyModal()},mapsKeyModal(){let e=(()=>{try{return localStorage.getItem("ev_maps_key")||""}catch{return""}})();this.modal(`
      <h2>${h("key")} Unlock photorealistic 3D</h2>
      <div class="modal-sub">Paste a Google Maps Platform API key and the Earth becomes full Google-Earth-style 3D \u2014
        terrain, buildings and trees, anywhere on the planet. <b>3D Maps is free during Google's Preview.</b></div>
      <label>Your Google Maps API key</label>
      <input id="mapsKeyInput" placeholder="AIza..." value="${e}" autocomplete="off">
      <button class="btn btn-gold btn-block" id="mapsKeySave">Save & relaunch in 3D</button>
      ${e?'<button class="btn btn-outline btn-block" id="mapsKeyClear">Remove key (back to satellite)</button>':""}
      <div class="divider">how to get a key (~10 min, free)</div>
      <div style="font-size:13px;line-height:1.7;color:var(--cream-dim)">
        1 \xB7 Go to <b>console.cloud.google.com</b> \u2192 create a project (e.g. <i>rainbow-bridge</i>).<br>
        2 \xB7 Billing \u2192 add a card (required by Google; the free tier below means $0 for development).<br>
        3 \xB7 <b>APIs &amp; Services \u2192 Library</b> \u2192 enable <b>Maps JavaScript API</b> and <b>Geocoding API</b>.<br>
        4 \xB7 <b>Credentials \u2192 Create credentials \u2192 API key</b> \u2192 copy it.<br>
        5 \xB7 Recommended: restrict the key to those two APIs and to your site (<i>localhost:4242</i>).<br>
        6 \xB7 Paste it above.<br><br>
        ${h("coins")} <b>Is it free?</b> 3D Maps: no charge during Preview. Map loads &amp; geocoding: 10,000 free per month each,
        far beyond demo needs. Set a budget alert in Google Cloud for peace of mind.
      </div>
      <p class="fine">The key is stored only in this browser (localStorage) \u2014 never sent to our server.</p>`),c("#mapsKeySave").onclick=()=>{let a=c("#mapsKeyInput").value.trim();if(a.length<20)return this.toast("That does not look like a Maps API key (starts with AIza\u2026).");try{localStorage.setItem("ev_maps_key",a)}catch{}this.toast("Key saved \u2014 relaunching in photorealistic 3D\u2026"),setTimeout(()=>location.reload(),900)};let t=c("#mapsKeyClear");t&&(t.onclick=()=>{try{localStorage.removeItem("ev_maps_key")}catch{}location.reload()})},async mountEarth(){if(!this.earth){let{EarthView:e}=await import("./earth-MRCA7I77.js");this.earth=new e(document.getElementById("earthMap")),this.earth.onMemorialClick=t=>this.openEarthMemorial(t),this.earth.onRBVClick=()=>this.rbvPanel(),this.earth.onPlaceAt=t=>{this._exitPlacement(),this.beginMemorialAt(t)},this.earth.onCharityClick=t=>this.shelterModal(t),await this.earth.init(),et&&this.earth.mode==="satellite"&&this.toast("Your Maps key was rejected (check APIs enabled & restrictions) \u2014 running satellite fallback. Click Enable 3D to update it.",8e3,"warning");for(let t of Le(v.data))this.earth.addMemorialMarker(t);for(let t of R)this.earth.addCharityMarker(t);et||this.toast("Satellite mode \u2014 click Enable 3D and paste a free Google Maps key for full photorealism",7e3)}},async shelterModal(e){let t=(await V.load()).filter(i=>i.charityId===e.id);this.modal(`
      <h2>${h("heart")} ${e.name}</h2>
      <div class="modal-sub">${e.cat} \xB7 ${e.city}, ${e.state}</div>
      <div class="district-blurb" style="margin:12px 0">
        <span style="color:var(--accent-hi-c);font-size:12px;font-weight:700">${e.rating||"Verified 501(c)(3) Rescue"}</span><br>
        ${e.blurb}<br>
        <span class="fine-dim">IRS EIN: <b>${e.ein}</b> \xB7 <a href="${e.url}" target="_blank" rel="noopener noreferrer">Visit Official Website</a></span>
      </div>

      ${e.impactTiers?`
        <div class="shop-cat">Tangible Impact Tiers</div>
        <div class="shop-grid" style="margin-bottom:14px">
          ${e.impactTiers.map(i=>`
            <div class="shop-item" style="cursor:default;text-align:left;padding:10px">
              <b style="color:var(--accent-hi-c);font-size:14px">${i.label}</b>
              <div style="font-size:11.5px;color:#dedad0;margin-top:4px">${i.desc}</div>
            </div>
          `).join("")}
        </div>`:""}

      <div style="display:flex;gap:10px">
        <button class="btn btn-gold btn-block" id="shStartCmp">${h("heart")} Start Campaign for ${e.name}</button>
      </div>

      ${t.length?`
        <div class="shop-cat" style="margin-top:16px">Memorial Campaigns Supporting ${e.name} (${t.length})</div>
        ${t.map(i=>`
          <div class="feed-item" data-cmp="${i.id}" style="cursor:pointer">
            <div class="fi-icon">${h("heart")}</div>
            <div><b>${i.petName}</b> \xB7 ${[i.species,i.years].filter(Boolean).join(" \xB7 ")}<br>
              <span class="fi-time">${i.story?i.story.slice(0,80)+"\u2026":"In loving memory"}</span>
            </div>
          </div>
        `).join("")}
      `:""}
    `);let a=c("#modalBox");a.querySelector("#shStartCmp").onclick=()=>{this.closeModal(),Z.createModal(this);let i=c("#cmpCharity");i&&(i.value=e.id,i.dispatchEvent(new Event("change")))},a.querySelectorAll("[data-cmp]").forEach(i=>{i.onclick=async()=>{let o=await V.get(i.dataset.cmp);o&&(this.closeModal(),Z.campaignModal(this,o))}})},comfortModal(){this.modal(`
      <div class="comfort-header">
        <div class="comfort-crest">${h("dove",{size:38})}</div>
        <h2>Words of Comfort &amp; The Rainbow Bridge</h2>
        <div class="modal-sub">For every heart carrying the sacred weight of goodbye.</div>
      </div>

      <div class="poem-scroll">
        <p class="poem-stanza">
          Just this side of heaven is a place called Rainbow Bridge.<br><br>
          When an animal dies that has been especially close to someone here, that pet goes to Rainbow Bridge.
          There are meadows and hills for all of our special friends so they can run and play together.
          There is plenty of food, water and sunshine, and our friends are warm and comfortable.
        </p>
        <p class="poem-stanza">
          All the animals who had been ill and old are restored to health and vigor.
          Those who were hurt or maimed are made whole and strong again,
          just as we remember them in our dreams of days and times gone by.
          The animals are happy and content, except for one small thing;
          they each miss someone very special to them, who had to be left behind.
        </p>
        <p class="poem-stanza">
          They all run and play together, but the day comes when one suddenly stops and looks into the distance.
          His bright eyes are intent. His eager body quivers. Suddenly he begins to run from the group,
          flying over the green grass, his legs carrying him faster and faster.
        </p>
        <p class="poem-stanza poem-climax">
          You have been spotted, and when you and your special friend finally meet,
          you cling together in joyous reunion, never to be parted again.
          The happy kisses rain upon your face; your hands again caress the beloved head,
          and you look once more into the trusting eyes of your pet, so long gone from your life but never absent from your heart.<br><br>
          <i>Then you cross Rainbow Bridge together\u2026</i>
        </p>
      </div>

      <div class="district-blurb" style="margin:16px 0">
        <b>24/7 Compassionate Support for Pet Loss:</b><br>
        \u2022 <a href="https://www.lapoflove.com/pet-loss-support" target="_blank" rel="noopener noreferrer">Lap of Love Free Pet Loss Support Groups</a><br>
        \u2022 <a href="https://www.vet.cornell.edu/impact/community-engagement/pet-loss-support-hotline" target="_blank" rel="noopener noreferrer">Cornell Pet Loss Support Helpline</a> (607-253-3932)<br>
        \u2022 <a href="https://www.aplb.org" target="_blank" rel="noopener noreferrer">Association for Pet Loss and Bereavement (APLB)</a>
      </div>

      <div style="display:flex;gap:10px">
        <button class="btn btn-gold btn-block" id="comfortLightCandle">${h("candle")} Light a Candle Vigil</button>
        <button class="btn btn-outline btn-block" id="comfortMemorialize">${h("heart")} Memorialize Your Companion</button>
      </div>
    `);let e=c("#modalBox");e.querySelector("#comfortLightCandle").onclick=()=>{this.closeModal(),this.candleVigilModal()},e.querySelector("#comfortMemorialize").onclick=()=>{this.closeModal(),this.showEarth().then(()=>this.startPlacement())}},adminHudModal(){this.modal(`
      <div class="comfort-header">
        <div class="comfort-crest" style="color:var(--gold-bright);">${h("shield",{size:38})}</div>
        <h2>\u26A1 Untethered Admin Console</h2>
        <div class="modal-sub">Superuser Privileges Active \xB7 Instant 100% Free Comps \xB7 Unrestricted World Access</div>
      </div>

      <div class="admin-quick-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin:20px 0;">
        <div class="district-blurb" style="margin:0;padding:16px;">
          <h4 style="font-family:var(--display);color:#fff;margin-bottom:6px;letter-spacing:0.08em;">\u2728 Instant Free Checkouts</h4>
          <p style="font-size:12.5px;color:#d0c8b6;margin-bottom:12px;">Create memorials anywhere on Earth or in the 3D Sanctuary Valley with zero Stripe charges.</p>
          <button class="btn btn-gold btn-block btn-sm" id="admCreateBtn">Create New Memorial</button>
        </div>
        <div class="district-blurb" style="margin:0;padding:16px;">
          <h4 style="font-family:var(--display);color:#fff;margin-bottom:6px;letter-spacing:0.08em;">\u{1F30C} Sandbox Memorial Seeder</h4>
          <p style="font-size:12.5px;color:#d0c8b6;margin-bottom:12px;">Seed 10 realistic companion memorials across all 7 districts &amp; Earth map.</p>
          <button class="btn btn-outline btn-block btn-sm" id="admSeedBtn">Seed 10 Memorials</button>
        </div>
        <div class="district-blurb" style="margin:0;padding:16px;">
          <h4 style="font-family:var(--display);color:#fff;margin-bottom:6px;letter-spacing:0.08em;">\u{1F324}\uFE0F Dynamic Atmosphere</h4>
          <p style="font-size:12.5px;color:#d0c8b6;margin-bottom:10px;">Switch Sanctuary 3D lighting phase &amp; weather.</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button class="btn btn-outline btn-sm" id="admDawn">Dawn</button>
            <button class="btn btn-outline btn-sm" id="admDay">Day</button>
            <button class="btn btn-outline btn-sm" id="admDusk">Dusk</button>
            <button class="btn btn-outline btn-sm" id="admNight">Night</button>
            <button class="btn btn-outline btn-sm" id="admBlessing">Rain</button>
          </div>
        </div>
        <div class="district-blurb" style="margin:0;padding:16px;">
          <h4 style="font-family:var(--display);color:#fff;margin-bottom:6px;letter-spacing:0.08em;">\u{1F4CA} Telemetry &amp; Command Center</h4>
          <p style="font-size:12.5px;color:#d0c8b6;margin-bottom:12px;">Review Stripe transaction logs, charity revenue, and event store.</p>
          <button class="btn btn-outline btn-block btn-sm" id="admDashBtn">Open /admin.html</button>
        </div>
      </div>

      <div style="display:flex;gap:12px;justify-content:space-between;margin-top:20px;flex-wrap:wrap;">
        <button class="btn btn-outline" id="admExitBtn" style="color:#ff7675;border-color:rgba(255,118,117,0.4);">Exit Admin Mode</button>
        <button class="btn btn-gold" data-close>Resume Exploring</button>
      </div>
    `);let e=c("#modalBox");e.querySelector("#admCreateBtn").onclick=()=>{this.closeModal(),this.griefWizardModal()},e.querySelector("#admSeedBtn").onclick=async()=>{await this.seedDemoMemorials(),this.toast("\u2728 10 sample companion memorials seeded across the Sanctuary & Earth!",4e3),this.closeModal()},e.querySelector("#admDawn").onclick=()=>{this.world?.forcePhase("dawn"),this.toast("Sanctuary time: Dawn")},e.querySelector("#admDay").onclick=()=>{this.world?.forcePhase("day"),this.toast("Sanctuary time: Sunlit Noon")},e.querySelector("#admDusk").onclick=()=>{this.world?.forcePhase("dusk"),this.toast("Sanctuary time: Amber Dusk")},e.querySelector("#admNight").onclick=()=>{this.world?.forcePhase("night"),this.toast("Sanctuary time: Celestial Night")},e.querySelector("#admBlessing").onclick=()=>{this.world&&(this.world.mood="blessing",this.world.lighting.applyAmbience()),this.toast("Atmospheric Rain Blessing active")},e.querySelector("#admDashBtn").onclick=()=>window.open("/admin.html","_blank"),e.querySelector("#admExitBtn").onclick=()=>{try{localStorage.removeItem("ev_admin_mode")}catch{}location.href="index.html"}},async seedDemoMemorials(){let e=[{name:"Barnaby",species:"Golden Retriever",years:"2012 \u2014 2024",epitaph:"The gentlest soul who loved the ocean and chasing morning shadows.",lat:37.7749,lng:-122.4194,place:"San Francisco, CA",district:"memorial_meadows",plotId:"p_101"},{name:"Cleo",species:"Siamese Cat",years:"2009 \u2014 2023",epitaph:"Queen of the sunbeams and guardian of our quietest evenings.",lat:40.7128,lng:-74.006,place:"New York, NY",district:"whispering_pines",plotId:"p_102"},{name:"Jasper",species:"Australian Shepherd",years:"2014 \u2014 2025",epitaph:"Endless energy, brilliant eyes, and a heart full of boundless devotion.",lat:51.5074,lng:-.1278,place:"London, UK",district:"lakeside_rest",plotId:"p_103"},{name:"Milo",species:"Rescue Beagle",years:"2011 \u2014 2024",epitaph:"A joyful spirit who knew only kindness, peanut butter, and summer trails.",lat:34.0522,lng:-118.2437,place:"Los Angeles, CA",district:"golden_shores",plotId:"p_104"},{name:"Freya",species:"Maine Coon",years:"2010 \u2014 2023",epitaph:"Silent elegance and sweet purrs that filled our home with peace.",lat:48.8566,lng:2.3522,place:"Paris, France",district:"summit_rest",plotId:"p_105"},{name:"Atlas",species:"Rescue Thoroughbred",years:"2005 \u2014 2022",epitaph:"Running wild and free across the infinite celestial meadows.",lat:-33.8688,lng:151.2093,place:"Sydney, Australia",district:"desert_bloom",plotId:"p_106"}];v.data||(v.data={}),v.data.earth||={memorials:[],activity:[]},v.data||(v.data={}),v.data.ownedPlots||={},e.forEach(t=>{let a={id:"seed_"+Math.random().toString(36).slice(2,9),petName:t.name,species:t.species,years:t.years,epitaph:t.epitaph,lat:t.lat,lng:t.lng,place:t.place,owner:"Admin",headstone:"classic",at:Date.now()-Math.floor(Math.random()*864e5*7)};v.data.earth.memorials.push(a),v.data.ownedPlots[t.plotId]={memorial:a,decor:[{type:"headstone",style:"classic"}],boughtAt:Date.now()}}),await v.save(y.user),this.globe&&e.forEach(t=>this.globe.addPin({lat:t.lat,lng:t.lng,name:t.place,memorial:t}))},candleVigilModal(){this.modal(`
      <h2>${h("candle")} Light an Eternal Candle</h2>
      <div class="modal-sub">Leave a warm light in the night sky and a silent wish for all companions who have crossed over.</div>

      <label>Companion's Name <span class="fine-inline">(or 'For all who left us')</span></label>
      <input id="vgName" maxlength="40" placeholder="e.g. For Luna & all sweet souls">

      <label>Your Message / Silent Prayer <span class="fine-inline">(optional)</span></label>
      <textarea id="vgMsg" rows="3" maxlength="200" placeholder="May you run free in endless sunlit fields. Until we meet again\u2026"></textarea>

      <label>From <span class="fine-inline">(optional)</span></label>
      <input id="vgFrom" maxlength="30" placeholder="${y.user?.name||"A loving family"}">

      <button class="btn btn-gold btn-block" id="vgLight">${h("candle")} Light the Candle</button>
    `);let e=c("#modalBox");e.querySelector("#vgLight").onclick=()=>{let t=e.querySelector("#vgName").value.trim()||"A beloved companion",a=e.querySelector("#vgFrom").value.trim()||y.user?.name||"A loving heart",i=e.querySelector("#vgMsg").value.trim();v.logActivity("candle",`${a} lit an eternal candle for ${t}${i?": \u201C"+i+"\u201D":""}`),this.closeModal(),this.toast(`Candle lit in memory of ${t}. May their light shine forever.`,6e3,"candle");let o=document.body.getBoundingClientRect();ee.spark(o.width/2,o.height/2,45)}},partnerModal(){this.modal(`
      <div class="partner-hero">
        <div class="partner-crest">${h("crest",{size:40})}</div>
        <h2>Care Partner &amp; Veterinary Alliance</h2>
        <div class="modal-sub">You meet families on the hardest day of their pet's life. Give them a gentle, comforting next step.</div>
      </div>

      <div class="partner-pillars">
        <div class="partner-pillar">
          <div class="pillar-ico">${h("heart",{size:22})}</div>
          <b>Veterinary Hospitals &amp; Clinics</b>
          <p>Include elegant sympathy condolence cards with your aftercare packets. Families receive a peaceful digital memorial on Earth or in the Sanctuary with custom clinic branding.</p>
        </div>
        <div class="partner-pillar">
          <div class="pillar-ico">${h("crest",{size:22})}</div>
          <b>Pet Cemeteries &amp; Crematoriums</b>
          <p>Complement physical urns, scatterings, and headstones with forever 3D &amp; Earth digital resting places that family members across the world can visit together.</p>
        </div>
        <div class="partner-pillar">
          <div class="pillar-ico">${h("sparkle",{size:22})}</div>
          <b>Animal Shelters &amp; Rescues</b>
          <p>Join our verified 501(c)(3) registry. 100% of memorial donations and tribute gifts pass directly to your rescue with public cryptographic ledger transparency.</p>
        </div>
      </div>

      <div class="district-blurb" style="margin:16px 0">
        \u2726 <b>Complimentary Bereavement Starter Kits:</b> We provide custom-printed condolence cards with your clinic\u2019s QR code, digital memorial sponsorship tokens, and hospital tribute pages at zero cost to your practice.
      </div>

      <div class="shop-cat">Request Partner Welcome Kit / Clinic QR Code</div>
      <label>Practice / Organization Name</label>
      <input id="ptOrg" maxlength="60" placeholder="e.g. VCA Meadow Animal Hospital">

      <div class="two-col">
        <div>
          <label>Organization Type</label>
          <select id="ptType">
            <option value="vet">Veterinary Hospital / Specialty Clinic</option>
            <option value="cremation">Pet Cremation / Cemetery</option>
            <option value="hospice">In-Home Hospice &amp; Palliative Care</option>
            <option value="rescue">Animal Shelter / 501(c)(3) Rescue</option>
          </select>
        </div>
        <div>
          <label>City &amp; State</label>
          <input id="ptLoc" maxlength="40" placeholder="Denver, CO">
        </div>
      </div>

      <label>Contact Email</label>
      <input id="ptEmail" type="email" maxlength="60" placeholder="care@yourclinic.com">

      <label>How would you like to collaborate? <span class="fine-inline">(optional)</span></label>
      <textarea id="ptNotes" rows="2" maxlength="240" placeholder="We would love aftercare sympathy cards for our bereavement room\u2026"></textarea>

      <button class="btn btn-gold btn-block" id="ptSubmit">${h("crest")} Request Partner Welcome Kit</button>
      <p class="fine">Or visit our full <a href="partners.html" target="_blank">Care Partner Portal</a> for referral guidelines &amp; downloadable materials.</p>
    `);let e=c("#modalBox");e.querySelector("#ptSubmit").onclick=async()=>{let t=e.querySelector("#ptOrg").value.trim(),a=e.querySelector("#ptEmail").value.trim();if(!t||!a)return this.toast("Please enter your practice name and contact email.","warning");let i=t.toLowerCase().replace(/[^a-z0-9]/g,"-").slice(0,20);try{let o=await import("./config-G6XWWQD2.js");o.HAS_API&&fetch(o.API_BASE+"/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind:"partner_inquiry",name:`Partner: ${t}`,amount:0,user:a})}).catch(()=>{})}catch{}this.closeModal(),this.modal(`
        <h2>${h("crest")} Welcome to the Alliance</h2>
        <div class="modal-sub">Thank you, <b>${t.replace(/[&<>"]/g,"")}</b>. Your dedication to compassionate pet aftercare means everything.</div>
        <div class="district-blurb" style="margin:16px 0">
          \u2726 <b>Your Partner Link is Ready:</b><br>
          <code>${location.origin}${location.pathname}?ref=${i}</code><br><br>
          Our Care Team will reach out to <b>${a.replace(/[&<>"]/g,"")}</b> with your complimentary Bereavement Care Packet, printable QR card assets, and practice dashboard access.
        </div>
        <button class="btn btn-gold btn-block" id="partnerOk">Return to Sanctuary</button>
      `),document.querySelector("#partnerOk")?.addEventListener("click",()=>this.closeModal())}},soundModal(){B.init();let e=B.mode,t=B.solfeggio,a=B.binaural,i=Math.round(B.volume*100),o=Object.entries(B.SOLFEGGIO).map(([l,d])=>`
      <button class="solf-pill ${t===l?"is-active":""}" data-solf="${l}" title="${d.desc}">
        <b>${d.freq}Hz</b>
        <span>${d.name.replace(/^\d+Hz\s*/,"")}</span>
      </button>
    `).join(""),n=Object.entries(B.BINAURAL).map(([l,d])=>`
      <button class="binaural-chip ${a===l?"is-active":""}" data-bin="${l}" title="${d.desc}">
        ${d.name}
      </button>
    `).join("");this.modal(`
      <div class="comfort-header">
        <div class="comfort-crest">${h("sparkle",{size:36})}</div>
        <h2>Sanctuary Healing Soundscape</h2>
        <div class="modal-sub">Procedural Solfeggio singing bowls, binaural brainwave pulses, and 1/f atmospheric nature murmurs.</div>
      </div>

      <div class="sound-section-title">
        <span>Soundscape Atmosphere</span>
      </div>
      <div class="sound-modes">
        <button class="sound-mode-card ${e==="crystal"?"is-active":""}" data-sm="crystal">
          <div class="sm-icon">${h("sparkle")}</div>
          <b>Solfeggio Crystal Peace</b>
          <span>Harmonic singing bowl drones tuned to sacred frequencies for emotional solace.</span>
        </button>

        <button class="sound-mode-card ${e==="breeze"?"is-active":""}" data-sm="breeze">
          <div class="sm-icon">${h("globe")}</div>
          <b>Mountain Breeze &amp; River</b>
          <span>1/f pink noise whisper through pine needles and water flowing toward Mirror Lake.</span>
        </button>

        <button class="sound-mode-card ${e==="chimes"?"is-active":""}" data-sm="chimes">
          <div class="sm-icon">${h("dove")}</div>
          <b>Angelic Wind Chimes</b>
          <span>Dynamic pentatonic fairy chimes and celestial bells echoing across sunlit meadows.</span>
        </button>

        <button class="sound-mode-card ${e==="binaural"?"is-active":""}" data-sm="binaural">
          <div class="sm-icon">${h("sparkle")}</div>
          <b>Binaural Solace</b>
          <span>Stereo brainwave entrainment (Theta / Schumann / Alpha) for deep healing peace.</span>
        </button>

        <button class="sound-mode-card ${e==="silent"?"is-active":""}" data-sm="silent">
          <div class="sm-icon">${h("power")}</div>
          <b>Silent Serenity</b>
          <span>Mute ambient soundscapes for quiet, silent contemplation.</span>
        </button>
      </div>

      <div class="sound-section-title">
        <span>Solfeggio Resonant Frequencies</span>
        <span style="font-size:10px;text-transform:none;letter-spacing:normal;color:var(--text-muted)">Active: <b>${B.SOLFEGGIO[t]?.name||"432Hz"}</b></span>
      </div>
      <div class="solfeggio-grid">
        ${o}
      </div>

      <div class="sound-section-title">
        <span>Binaural Entrainment (Stereo)</span>
        <span style="font-size:10px;text-transform:none;letter-spacing:normal;color:var(--text-muted)">Best with headphones</span>
      </div>
      <div class="binaural-row">
        ${n}
      </div>

      <div style="margin:16px 0 10px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <label style="margin:0">Master Soundscape Volume</label>
          <span id="volLabel" style="font-size:12px;color:var(--accent-hi-c);font-weight:700">${i}%</span>
        </div>
        <input type="range" id="volSlider" min="0" max="100" value="${i}" style="width:100%">
      </div>

      <div class="sound-fx-buttons">
        <button class="btn btn-gold btn-sm btn-block" id="ringBowlBtn">${h("sparkle")} 528Hz Miracle Bell</button>
        <button class="btn btn-outline btn-sm btn-block" id="gong432Btn">${h("sparkle")} 432Hz Earth Gong</button>
        <button class="btn btn-outline btn-sm btn-block" id="crown963Btn">${h("sparkle")} 963Hz Crown Tone</button>
      </div>

      <div style="display:flex;gap:10px;margin-top:14px">
        <button class="btn btn-outline btn-block" id="soundClose">${h("check")} Close</button>
      </div>
    `);let s=c("#modalBox");s.querySelectorAll("[data-sm]").forEach(l=>{l.onclick=()=>{let d=l.dataset.sm;B.setMode(d),s.querySelectorAll("[data-sm]").forEach(p=>p.classList.remove("is-active")),l.classList.add("is-active"),this._updateSoundIcon(),this.toast(d==="silent"?"Audio muted.":`Playing ${l.querySelector("b").textContent}`,3e3,"sparkle")}}),s.querySelectorAll("[data-solf]").forEach(l=>{l.onclick=()=>{let d=l.dataset.solf;B.setSolfeggio(d),s.querySelectorAll("[data-solf]").forEach(g=>g.classList.remove("is-active")),l.classList.add("is-active");let p=B.SOLFEGGIO[d];B.playSolfeggioBell(p.freq),this.toast(`Tuned to ${p.name} (${p.label})`,3500,"sparkle")}}),s.querySelectorAll("[data-bin]").forEach(l=>{l.onclick=()=>{let d=l.dataset.bin;B.setBinaural(d),s.querySelectorAll("[data-bin]").forEach(g=>g.classList.remove("is-active")),l.classList.add("is-active");let p=B.BINAURAL[d];this.toast(`Binaural: ${p.name} (${p.desc})`,3500,"sparkle")}});let r=s.querySelector("#volSlider");r.oninput=()=>{let l=Number(r.value)/100;B.setVolume(l),s.querySelector("#volLabel").textContent=`${r.value}%`},s.querySelector("#ringBowlBtn").onclick=()=>{B.playChime(528,.14);let l=document.body.getBoundingClientRect();ee.spark(l.width/2,l.height/2,35)},s.querySelector("#gong432Btn").onclick=()=>{B.playBowlGong(216,.22);let l=document.body.getBoundingClientRect();ee.spark(l.width/2,l.height/2,35)},s.querySelector("#crown963Btn").onclick=()=>{B.playSolfeggioBell(963);let l=document.body.getBoundingClientRect();ee.spark(l.width/2,l.height/2,35)},s.querySelector("#soundClose").onclick=()=>this.closeModal()},_updateSoundIcon(){let e=c("#soundBtn");e&&(B.isPlaying?(e.classList.add("is-playing"),e.title=`Soundscape Active (${B.mode})`):(e.classList.remove("is-playing"),e.title="Soundscape: Silent"))},riverLanternsModal(){this.modal(`
      <div class="comfort-header">
        <div class="comfort-crest">${h("candle",{size:36})}</div>
        <h2>Release a Memory Lantern</h2>
        <div class="modal-sub">Light a golden water lantern and let it float gently down the Rainbow River toward Mirror Lake.</div>
      </div>

      <label>Companion's Name</label>
      <input id="ltName" maxlength="32" placeholder="e.g. For sweet Bailey">

      <label>Your Message to the River</label>
      <textarea id="ltMsg" rows="3" maxlength="200" placeholder="You brought endless light into our lives. May your lantern guide your way\u2026"></textarea>

      <label>From <span class="fine-inline">(optional)</span></label>
      <input id="ltFrom" maxlength="32" placeholder="${y.user?.name||"A loving family"}">

      <button class="btn btn-gold btn-block" id="ltRelease">${h("candle")} Release Lantern on the Water</button>
    `);let e=c("#modalBox");e.querySelector("#ltRelease").onclick=()=>{let t=e.querySelector("#ltName").value.trim()||"A beloved soul",a=e.querySelector("#ltFrom").value.trim()||y.user?.name||"A loving heart",i=e.querySelector("#ltMsg").value.trim();B.playCandleShimmer(),v.logActivity("candle",`${a} released a floating memory lantern for ${t}${i?": \u201C"+i+"\u201D":""}`),this.closeModal(),this.toast(`Your lantern for ${t} is floating peacefully down the Rainbow River.`,7e3,"candle");let o=document.body.getBoundingClientRect();ee.spark(o.width/2,o.height/2,50)}},lettersModal(){let e="ev_sanctuary_letters_v1",t=[];try{t=JSON.parse(localStorage.getItem(e)||"[]")}catch{t=[]}let a=()=>{this.modal(`
        <div class="comfort-header">
          <div class="comfort-crest">${h("dove",{size:36})}</div>
          <h2>Letters Across the Bridge</h2>
          <div class="modal-sub">A private, sacred journal to write to your companion whenever you miss them.</div>
        </div>

        <button class="btn btn-gold btn-block" id="writeLetterBtn" style="margin-bottom:18px">${h("sparkle")} Write a New Letter</button>

        <div class="letter-list">
          ${t.length===0?`
            <div class="ss-empty" style="text-align:center;padding:24px 0">
              No letters written yet. Pour your heart onto the page whenever words can bring you peace.
            </div>
          `:t.map(o=>`
            <div class="letter-card">
              <div class="letter-card__head">
                <b>To ${o.to.replace(/[&<>"]/g,"")}</b>
                <span class="fine">${new Date(o.at).toLocaleDateString(void 0,{month:"short",day:"numeric",year:"numeric"})}</span>
              </div>
              <p class="letter-card__body">\u201C${o.text.replace(/[&<>"]/g,"")}\u201D</p>
              <div class="letter-card__foot">
                <span>With love, <i>${o.from.replace(/[&<>"]/g,"")}</i></span>
              </div>
            </div>
          `).join("")}
        </div>
      `);let i=c("#modalBox");i.querySelector("#writeLetterBtn").onclick=()=>{this.modal(`
          <div class="comfort-header">
            <div class="comfort-crest">${h("sparkle",{size:36})}</div>
            <h2>Write to Your Companion</h2>
            <div class="modal-sub">Your words are kept safely in your sanctuary journal.</div>
          </div>

          <label>Companion's Name</label>
          <input id="letTo" maxlength="32" placeholder="e.g. My darling Luna">

          <label>Your Letter / Thoughts Today</label>
          <textarea id="letBody" rows="6" placeholder="Dear Luna, today I walked by the park where we used to throw the tennis ball\u2026"></textarea>

          <label>Signed By</label>
          <input id="letFrom" maxlength="32" placeholder="${y.user?.name||"Your human"}">

          <div style="display:flex;gap:10px;margin-top:14px">
            <button class="btn btn-gold btn-block" id="letSave">${h("heart")} Save to Journal</button>
            <button class="btn btn-outline btn-block" id="letBack">Back</button>
          </div>
        `);let o=c("#modalBox");o.querySelector("#letBack").onclick=()=>a(),o.querySelector("#letSave").onclick=()=>{let n=o.querySelector("#letTo").value.trim()||"My beloved companion",s=o.querySelector("#letBody").value.trim(),r=o.querySelector("#letFrom").value.trim()||y.user?.name||"Always yours";if(!s)return this.toast("Please write a message in your letter.","warning");t.unshift({to:n,text:s,from:r,at:Date.now()});try{localStorage.setItem(e,JSON.stringify(t))}catch{}B.playChime(660,.08),this.toast("Letter saved in your Sanctuary Journal.",5e3,"dove"),a()}}};a()},treeOfLifeModal(){let e="ev_tree_ribbons_v1",t=[];try{let i=localStorage.getItem(e);i?t=JSON.parse(i)||[]:(t=[{name:"Ranger",color:"gold",msg:"Running free across sunlit hills.",from:"Sarah"},{name:"Barnaby",color:"sage",msg:"The sweetest senior boy with the softest ears.",from:"Elena"},{name:"Cleo",color:"rose",msg:"Forever purring in our hearts.",from:"Maya"},{name:"Zeus",color:"azure",msg:"Our gentle giant and loyal protector.",from:"Mark & Lisa"}],localStorage.setItem(e,JSON.stringify(t)))}catch{t=[]}this.modal(`
      <div class="comfort-header">
        <div class="comfort-crest">${h("flower",{size:36})}</div>
        <h2>The Sanctuary Tree of Life</h2>
        <div class="modal-sub">Tie a ribbon of eternal love to the branches of the Great Sanctuary Oak.</div>
      </div>

      <div class="tree-ribbons-grid">
        ${t.map(i=>`
          <div class="ribbon-tag ribbon-tag--${i.color.replace(/[&<>"]/g,"")}">
            <div class="ribbon-tag__ribbon"></div>
            <b>${i.name.replace(/[&<>"]/g,"")}</b>
            <p>${i.msg.replace(/[&<>"]/g,"")}</p>
            <span class="fine">Tied by ${i.from.replace(/[&<>"]/g,"")}</span>
          </div>
        `).join("")}
      </div>

      <div class="shop-cat" style="margin-top:20px">Tie Your Companion's Ribbon</div>
      <label>Companion's Name</label>
      <input id="rbName" maxlength="28" placeholder="e.g. Oliver">

      <label>Ribbon Color</label>
      <select id="rbColor">
        <option value="gold">\u2728 Golden Dawn (Joy & Warmth)</option>
        <option value="rose">\u{1F496} Rose Quartz (Unconditional Love)</option>
        <option value="sage">\u{1F33F} Healing Sage (Peace & Comfort)</option>
        <option value="azure">\u{1F30A} Celestial Azure (Serenity & Freedom)</option>
      </select>

      <label>Dedication / Memory</label>
      <input id="rbMsg" maxlength="80" placeholder="Forever running with the wind\u2026">

      <label>Your Name <span class="fine-inline">(optional)</span></label>
      <input id="rbFrom" maxlength="28" placeholder="${y.user?.name||"A loving family"}">

      <button class="btn btn-gold btn-block" id="rbTie" style="margin-top:14px">${h("flower")} Tie Ribbon to the Tree</button>
    `);let a=c("#modalBox");a.querySelector("#rbTie").onclick=()=>{let i=a.querySelector("#rbName").value.trim()||"A beloved friend",o=a.querySelector("#rbColor").value,n=a.querySelector("#rbMsg").value.trim()||"Forever loved in our hearts.",s=a.querySelector("#rbFrom").value.trim()||y.user?.name||"A loving friend";t.unshift({name:i,color:o,msg:n,from:s});try{localStorage.setItem(e,JSON.stringify(t))}catch{}B.playChime(792,.09),v.logActivity("sparkle",`${s} tied a ${o} ribbon on the Tree of Life for ${i}`),this.closeModal(),this.toast(`Ribbon tied to the Tree of Life for ${i}.`,6e3,"flower");let r=document.body.getBoundingClientRect();ee.spark(r.width/2,r.height/2,40)}},keepsakesModal(e=null){let t=e?.photo||null,a=e?.petName||"",i=e?.years||"",o=it[0],n=o.options[0],s=e?.charity||v.data?.charity||R[0].id,r=()=>{this.modal(`
        <div class="comfort-header">
          <div class="comfort-crest">${h("sparkle",{size:36})}</div>
          <h2>Physical Keepsake &amp; Memory Studio</h2>
          <div class="modal-sub">Transform your pet's photo into museum-grade heirloom keepsakes. <b>15% of every order supports verified animal rescues.</b></div>
        </div>

        <div class="keepsake-studio-grid">
          <!-- Left: Live Mockup Preview -->
          <div class="keepsake-preview-pane">
            <div class="keepsake-mockup" id="ksMockup">
              <div class="ks-mockup-frame ks-mockup--${o.category.toLowerCase()}">
                <div class="ks-photo-slot">
                  ${t?`<img src="${t}" alt="Keepsake Photo" class="ks-rendered-img">`:`
                    <div class="ks-placeholder">
                      <div class="ks-placeholder-ico">${h("photo",{size:42})}</div>
                      <span>Upload pet photo below to preview</span>
                    </div>
                  `}
                </div>
                <div class="ks-mockup-caption">
                  <b>${(a||"Companion Name").replace(/[&<>"]/g,"")}</b>
                  <span>${(i||"Forever Loved").replace(/[&<>"]/g,"")}</span>
                </div>
              </div>
            </div>
            <div class="district-blurb" style="margin-top:10px;text-align:center;font-size:11.5px">
              \u2726 Handcrafted with archival materials &amp; carbon-neutral delivery.
            </div>
          </div>

          <!-- Right: Product Selector & Customizer -->
          <div class="keepsake-controls-pane">
            <label>1. Select Keepsake Product</label>
            <div class="ks-product-list">
              ${it.map(u=>`
                <div class="ks-product-card ${u.id===o.id?"is-active":""}" data-pk="${u.id}">
                  <div class="ks-product-info">
                    <b>${h(u.icon)} ${u.name}</b>
                    <span>${u.blurb}</span>
                  </div>
                  <div class="ks-product-price">${re(u.price)}</div>
                </div>
              `).join("")}
            </div>

            <label style="margin-top:14px">2. Upload Companion Photo</label>
            <input type="file" id="ksPhotoUpload" accept="image/*">

            <div class="two-col" style="margin-top:8px">
              <div>
                <label>Companion's Name</label>
                <input id="ksName" maxlength="30" value="${(a||"").replace(/[&<>"]/g,"")}" placeholder="e.g. Biscuit">
              </div>
              <div>
                <label>Memorial Years / Subtitle</label>
                <input id="ksYears" maxlength="30" value="${(i||"").replace(/[&<>"]/g,"")}" placeholder="2012 \u2013 2024">
              </div>
            </div>

            <label>3. Style &amp; Size Option</label>
            <select id="ksOption">
              ${o.options.map(u=>`<option value="${u.replace(/[&<>"]/g,"")}" ${u===n?"selected":""}>${u.replace(/[&<>"]/g,"")}</option>`).join("")}
            </select>

            <label>4. Rescue Charity Tithe Beneficiary (15%)</label>
            <select id="ksCharity">
              ${R.map(u=>`<option value="${u.id}" ${s===u.id?"selected":""}>${u.name} (${u.rating||"Verified 501(c)(3)"})</option>`).join("")}
            </select>

            <div class="ks-shipping-box" style="margin-top:10px">
              <label>Shipping Full Name &amp; Address</label>
              <input id="ksShipName" placeholder="Your Full Name">
              <input id="ksShipAddr" placeholder="Street Address, City, State, ZIP" style="margin-top:6px">
            </div>

            <button class="btn btn-gold btn-block" id="ksOrderBtn" style="margin-top:16px">
              ${h("gift")} Order Keepsake \u2014 ${re(o.price)}
            </button>
            <p class="fine">${O?"Demo: payment simulated.":"Secure checkout."} \xB7 Includes 15% charity tithe ($${(o.price*.15).toFixed(2)})</p>
          </div>
        </div>
      `);let l=c("#modalBox");l.querySelectorAll("[data-pk]").forEach(u=>{u.onclick=()=>{o=it.find(w=>w.id===u.dataset.pk),n=o.options[0],r()}});let d=l.querySelector("#ksPhotoUpload");d.onchange=async()=>{let u=d.files?.[0];if(u){let w=new FileReader;w.onload=f=>{t=f.target.result,r()},w.readAsDataURL(u)}};let p=l.querySelector("#ksName");p.oninput=()=>{a=p.value;let u=l.querySelector(".ks-mockup-caption b");u&&(u.textContent=a||"Companion Name")};let g=l.querySelector("#ksYears");g.oninput=()=>{i=g.value;let u=l.querySelector(".ks-mockup-caption span");u&&(u.textContent=i||"Forever Loved")},l.querySelector("#ksOption").onchange=u=>{n=u.target.value},l.querySelector("#ksCharity").onchange=u=>{s=u.target.value},l.querySelector("#ksOrderBtn").onclick=async()=>{let u=l.querySelector("#ksShipName").value.trim(),w=l.querySelector("#ksShipAddr").value.trim();if(!u||!w)return this.toast("Please enter your shipping name and address.","warning");let f=l.querySelector("#ksOrderBtn");f.disabled=!0,f.textContent="Processing Keepsake Order\u2026";try{(await Q({kind:"merch",name:`${o.name} for ${a||"Companion"} (${n})`,amount:o.price,meta:{itemId:o.id,petName:a,option:n,shipping:`${u}, ${w}`,charity:s}})).ok&&(v.logActivity("gift",`${u} ordered a ${o.name} in memory of ${a||"a beloved friend"}`),await ne.record({kind:"merch",label:`${o.name} \u2014 ${a||"Companion"}`,amountCents:Math.round(o.price*100),charityId:s,donor:u,demo:O}),B.playChime(528,.12),this.closeModal(),this.modal(`
              <div class="comfort-header">
                <div class="comfort-crest">${h("heart",{size:40})}</div>
                <h2>Keepsake Order Confirmed</h2>
                <div class="modal-sub">Thank you, <b>${u.replace(/[&<>"]/g,"")}</b>. Your physical heirloom memory is being lovingly prepared.</div>
              </div>
              <div class="district-blurb" style="margin:16px 0">
                \u2726 <b>Item:</b> ${o.name.replace(/[&<>"]/g,"")} (${n.replace(/[&<>"]/g,"")})<br>
                \u2726 <b>In Memory of:</b> ${(a||"Beloved Companion").replace(/[&<>"]/g,"")}<br>
                \u2726 <b>Shipping to:</b> ${w.replace(/[&<>"]/g,"")}<br>
                \u2726 <b>Rescue Tithe:</b> $${(o.price*.15).toFixed(2)} recorded on the public cryptographic ledger for <b>${W(s)}</b>.
              </div>
              <button class="btn btn-gold btn-block" onclick="document.querySelector('#modalRoot').classList.add('hidden')">Return to Sanctuary</button>
            `))}catch(M){this.toast(String(M.message),"warning"),f.disabled=!1,f.textContent=`Order Keepsake \u2014 ${re(o.price)}`}}};r()},flyToPlace(e,{announce:t=!0}={}){e&&(this.earth.flyTo({lat:e.lat,lng:e.lng,range:e.range??420}),t&&e.name&&this.toast(e.name,4200,"pin"))},returnToOrbit(){this.earth.flyToOrbit(),this.toast("Back in orbit \u2014 choose a place below",3600,"globe")},async streetViewOpen(e){let t=c("#streetPanel");t.classList.remove("hidden"),c("#streetContainer").innerHTML='<div style="display:grid;place-items:center;height:100%;color:#e9e1cd;font-size:15px">Looking for Street View imagery near here\u2026</div>';try{await this.earth.openStreetView(e.lat,e.lng,c("#streetContainer")),this.toast("Real Street View \u2014 drag to look around, arrows to walk.")}catch(a){t.classList.add("hidden"),c("#streetContainer").innerHTML="";let i=String(a.message||a);this.toast(i.includes("key")?i:"No Street View imagery within 150 m of this spot \u2014 try Ground view instead.",6e3)}},rbvPanel(){let e=c("#plotPanelBody");e.innerHTML=`
      <span class="badge badge-avail">SACRED GROUND</span>
      <h2>${qt({size:30,cls:"inline-mark"})} Rainbow Bridge Valley</h2>
      <div class="sub">${J.place}</div>
      <div class="district-blurb">The entrance to the whole cemetery \u2014 anchored at the real Rainbow Bridge,
        the world's largest natural bridge: a sandstone rainbow arched over a canyon at Lake Powell.
        Every journey over the rainbow begins here.</div>
      <button class="btn btn-gold btn-block" id="enterSanctuary">${h("sparkle")} Enter the Sanctuary</button>
      <button class="btn btn-outline btn-block" id="rbvFly">${h("dove")} Circle the Bridge</button>`,c("#enterSanctuary").onclick=()=>{this.closePanel(),this.show3D().then(()=>this.world?.flyToDistrict("bridge"))},c("#rbvFly").onclick=()=>this.flyToPlace({lat:J.lat,lng:J.lng,range:900},{announce:!1}),c("#plotPanel").classList.remove("hidden")},openEarthMemorial(e){let t=e.plotId?this.plots.find(g=>g.id===e.plotId):null,a=(e.guestbook||[]).slice(-5).reverse(),i=!e.seeded&&(ie||y.user&&e.ownerUid&&e.ownerUid===y.user.uid),o=c("#plotPanelBody"),n=k(e.petName||"Beloved Companion"),s=k(e.place||""),r=k(e.species||""),l=k(e.years||""),d=k(e.epitaph||""),p=k(e.owner||"a loving family");o.innerHTML=`
      <span class="badge badge-occ">MEMORIAL${i?" \xB7 YOURS":""}</span>
      <h2>${ce(Ue(e.species||""),{size:26})} ${n}</h2>
      <div class="sub">${s}</div>
      <div class="memorial">
        ${Ce(e,52)}
        <h3>${n}</h3>
        <div class="years">${r} \xB7 ${l}</div>
        <p class="epitaph">\u201C${d}\u201D</p>
        <div class="gifts-count">${h("gift")} ${e.gifts||0} tributes from visitors \xB7 resting with ${p}</div>
        <div class="gifts-count" style="color:var(--accent-hi-c)">${h("heart")} Supports verified rescue: <b>${W(e.charity||v.data?.charity||R[0].id)}</b></div>
        ${e.socials&&Object.values(e.socials).some(g=>g)?`<div class="gifts-count">${["instagram","x","tiktok","facebook"].filter(g=>e.socials[g]).map(g=>h({instagram:"instagram",x:"x",tiktok:"tiktok",facebook:"facebook"}[g])+" "+k(e.socials[g])).join(" \xB7 ")}</div>`:""}
      </div>
      ${this.petProfileHTML(e,e.id,i)}
      ${t?`<button class="btn btn-gold btn-block" id="ePlotVisitBtn" style="margin-bottom:8px">${h("crest")} Visit ${n}'s Resting Plot in the Sanctuary Valley</button>`:""}
      <button class="btn btn-outline btn-block" id="evisitBtn">${h("walk")} Visit at ground level</button>
      <button class="btn btn-outline btn-block" id="esvBtn">${h("eye")} Street View here</button>
      <button class="btn btn-outline btn-block" id="eshareBtn">${h("share")} Share this memorial</button>
      ${e.decorations?.length?'<div class="sub">At the memorial:</div>'+e.decorations.map(g=>`<div class="guestbook-entry">${Pe(g.itemId,{size:22,cls:"thumb-inline"})} <b>${k(g.name)}</b> \u2014 ${k(g.slotLabel)}</div>`).join(""):""}
      <button class="btn btn-gold btn-block" id="egiftBtn">${h("candle")} Leave a gift at the base</button>
      <button class="btn btn-outline btn-block" id="eCertBtn">${h("scroll")} Memorial Certificate &amp; Plaque</button>
      <button class="btn btn-outline btn-block" id="ekeepsakeBtn">${h("photo")} Order Physical Keepsakes</button>
      <button class="btn btn-outline btn-block" id="egbBtn">${h("letter")} Sign the guestbook (free)</button>
      ${i?`<button class="btn btn-green btn-block" id="edecorBtn">${h("flower")} Customize this memorial</button>`:""}
      <div class="district-blurb" style="margin-top:12px;font-size:11px;text-align:center">
        \u2726 <b>Earth Sacred Footprint Pin:</b> Maintained permanently by Eternal Valley. All consecrated resting plots reside in our 3D Virtual Sanctuary.
      </div>
      ${a.length?'<div class="sub" style="margin-top:14px">Guestbook:</div>'+a.map(g=>`<div class="guestbook-entry"><b>${k(g.from)}</b> \xB7 ${wt(g.at)}<br>${k(g.msg)}</div>`).join(""):""}`,c("#ePlotVisitBtn")&&t&&(c("#ePlotVisitBtn").onclick=async()=>{this.closePanel(),await this.show3D(),this.world?.selectPlot(t),this.openPlot(t),this.world?.flyToPlot(t)}),c("#egiftBtn").onclick=()=>this.earthGiftModal(e),c("#eCertBtn").onclick=()=>this.memorialCertificateModal(e),c("#ekeepsakeBtn").onclick=()=>this.keepsakesModal(e),c("#egbBtn").onclick=()=>this.guestbookModal(e),i&&(c("#edecorBtn").onclick=()=>this.earthDecorModal(e)),this._wirePetProfile(e,e.id,i,()=>this.openEarthMemorial(e)),this._lastPos={lat:e.lat,lng:e.lng},c("#evisitBtn").onclick=()=>{this.earth.groundView({lat:e.lat,lng:e.lng})?this.toast(`Standing at ${e.petName}'s place \u2014 the camera will slowly circle it.`):this.toast("Satellite mode is top-down \u2014 Enable 3D for the ground-level recreation.",6e3)},c("#esvBtn").onclick=()=>this.streetViewOpen({lat:e.lat,lng:e.lng}),c("#eshareBtn").onclick=()=>{let g=`${location.origin}${location.pathname}?m=${encodeURIComponent(e.id)}`;this.shareModal(`${e.petName}'s memorial`,g,`Visit ${e.petName}'s memorial at ${e.place.split(",")[0]} \u2014 light a candle or leave a gift over the Rainbow Bridge.`)},c("#plotPanel").classList.remove("hidden"),this.flyToPlace({lat:e.lat,lng:e.lng,range:260},{announce:!1})},earthDecorModal(e){let t={mem_guardian:1,mem_legacy:2,mem_eternal:3},a=ie?3:t[v.data.membership]||0,i=[...new Set(Se.map(o=>o.cat))];this.modal(`
      <h2>Customize ${e.petName}'s memorial</h2>
      <div class="modal-sub">${e.place} \xB7 items are arranged at the memorial and listed for every visitor.</div>
      <label>Where should the next item go?</label>
      <select id="eDecorSlot">
        ${le.map(o=>`<option value="${o.id}">${o.label}</option>`).join("")}
      </select>
      ${i.map(o=>`
        <div class="shop-cat">${o}</div>
        <div class="shop-grid">
          ${Se.filter(n=>n.cat===o).map(n=>{let s=(t[n.minTier]||0)>a;return`<button class="shop-item" data-i="${n.id}" ${s?'data-locked="1"':""}>
              <div class="s-emoji">${Pe(n.id,{size:46,alt:n.name})}</div><div class="s-name">${n.name}</div>
              <div class="s-price">${s?"":re(n.price)}</div>
              ${s?`<div class="s-lock">${h("lock")} ${$e.find(r=>r.id===n.minTier)?.name}+</div>`:""}
            </button>`}).join("")}
        </div>`).join("")}
      <p class="fine">${O?"Demo: payments simulated.":"Processed by Stripe."}</p>`),c("#modalBox").querySelectorAll("[data-i]").forEach(o=>{o.onclick=async()=>{if(o.dataset.locked)return this.toast("This item needs a higher membership tier."),this.membershipModal();let n=Se.find(r=>r.id===o.dataset.i),s=le.find(r=>r.id===c("#eDecorSlot").value)||le[0];o.style.opacity=.5;try{(await Q({kind:"item",name:`Memorial item: ${n.name} for ${e.petName}`,amount:n.price,meta:{earthMemorialId:e.id,itemId:n.id,slot:s.id,charity:e.charity||v.data?.charity||R[0].id}})).ok&&((e.decorations||=[]).push({itemId:n.id,name:n.name,slotLabel:s.label.toLowerCase()}),v.logActivity(n.id,`${y.user.name} placed ${n.name} at ${e.petName}'s memorial \u2014 ${e.place.split(",")[0]}`),await v.save(y.user),this.closeModal(),this.openEarthMemorial(e),this.toast(`${n.name} placed \u2014 ${s.label.toLowerCase()}.`,"flower"))}catch(r){this.toast(String(r.message),"warning"),o.style.opacity=1}}})},earthGiftModal(e){let t=y.user?y.user.name:null,a=Math.round(Be*100);this.modal(`
      <h2>Leave a gift for ${e.petName}</h2>
      <div class="modal-sub">${e.place} \xB7 ${t?`Giving as <b>${t}</b>.`:"Giving as an anonymous guest."}</div>
      ${e.charity?`<div class="district-blurb">${h("heart")} ${a}% of your gift goes to <b>${W(e.charity)}</b> \u2014 chosen by ${e.petName}'s family.</div>`:`<label>${h("heart")} ${a}% of your gift goes to a charity of your choice</label>
           <select id="egCharity">${R.map(i=>`<option value="${i.id}">${i.name}</option>`).join("")}</select>`}
      <div class="shop-grid">
        ${pe.map(i=>`<button class="shop-item" data-g="${i.id}">
          <div class="s-emoji">${Pe(i.id,{size:46,alt:i.name})}</div><div class="s-name">${i.name}</div>
          <div class="s-price">${re(i.price)}</div></button>`).join("")}
      </div>
      <label>Message (optional)</label><input id="egMsg" maxlength="80">
      <p class="fine">${O?"Demo: payment simulated.":"Processed by Stripe."} The Shelter Donation gift is donated 100%.</p>`),c("#modalBox").querySelectorAll("[data-g]").forEach(i=>{i.onclick=async()=>{let o=pe.find(r=>r.id===i.dataset.g),n=e.charity||c("#egCharity")?.value||R[0].id,s=Math.round((o.id==="g_donation"?o.price:o.price*Be)*100)/100;try{if((await Q({kind:"gift",name:`Gift: ${o.name} for ${e.petName}`,amount:o.price,meta:{earthMemorialId:e.id,giftId:o.id,charity:n,donate:s}})).ok){y.user||y.continueAsGuest(!0),e.gifts=(e.gifts||0)+1;let l=N(c("#egMsg").value.trim());l&&(e.guestbook||=[]).push({from:y.user.name,msg:`${o.name}: ${l}`,at:Date.now()}),v.logActivity(o.id,`${y.user.name} left ${o.name} for ${e.petName} \u2014 ${e.place.split(",")[0]} \xB7 $${s} to ${W(n)}`),await v.save(y.user),this.closeModal(),this.openEarthMemorial(e),this.toast(`Your gift rests with ${e.petName}.`,"gift")}}catch(r){this.toast(String(r.message),"warning")}}})},guestbookModal(e){this.modal(`
      <h2>Sign ${e.petName}'s guestbook</h2>
      <div class="modal-sub">A few kind words \u2014 free, always.</div>
      <label>Your name (or leave blank to stay anonymous)</label><input id="gbName" maxlength="30">
      <label>Message</label><textarea id="gbMsg" rows="3" maxlength="200" placeholder="Run free, sweet friend\u2026"></textarea>
      <button class="btn btn-gold btn-block" id="gbPost">Post to guestbook</button>`),c("#gbPost").onclick=async()=>{let t=N(c("#gbMsg").value.trim());if(!t)return this.toast("Write a few words first","heart");let a=N(c("#gbName").value.trim())||"Anonymous Visitor";(e.guestbook||=[]).push({from:a,msg:t,at:Date.now()}),v.logActivity("letter",`${a} signed ${e.petName}'s guestbook \u2014 ${e.place.split(",")[0]}`),await v.save(y.user),this.closeModal(),this.openEarthMemorial(e),this.toast("Your words are with them now.")}},beginMemorialAt(e){if(!y.user||y.user.isGuest)return this.authModal(()=>this.beginMemorialAt(e));if(!v.hasMembership())return this.toast("A membership is needed to create memorials."),this.membershipModal(()=>this.beginMemorialAt(e));this.earthMemorialForm(e)},startPlacement(){if(!y.user||y.user.isGuest)return this.authModal(()=>this.startPlacement());if(!v.hasMembership())return this.toast("A membership is needed to create memorials."),this.membershipModal(()=>this.startPlacement());this.closePanel(),this.earth.setPlacementMode(!0),this.earth.showCandidateSpots(this.earth.getCenter()),c("#placeBanner").classList.remove("hidden")},_exitPlacement(){this.earth.setPlacementMode(!1),c("#placeBanner").classList.add("hidden")},toggleBrowse(){let e=c("#browsePanel");if(!e.classList.contains("hidden"))return e.classList.add("hidden");c("#feedPanel").classList.add("hidden"),c("#campaignPanel")?.classList.add("hidden");let t=Le(v.data),a=y.user?t.filter(l=>l.ownerUid===y.user.uid):[],i=this.plots.filter(l=>l.status==="available"),o=this.plots.filter(l=>l.status==="occupied"),n={};for(let[l,d]of Object.entries(F)){let p=this.plots.filter(f=>f.district===l),g=p.filter(f=>f.status==="available"),u=p.filter(f=>f.status==="occupied"),w=g.length?Math.min(...g.map(f=>f.price)):null;n[l]={...d,total:p.length,avail:g.length,occupied:u.length,cheapest:w}}let s=(l,d)=>{let p=Math.round(d.occupied/d.total*100);return`
        <div class="pc-district-card" data-district="${l}">
          <div class="pc-district-header">
            <div class="pc-district-dot" style="background:${d.color}"></div>
            <div class="pc-district-title">
              <b>${d.name}</b>
              <span class="pc-district-blurb">${d.blurb}</span>
            </div>
          </div>
          <div class="pc-district-stats">
            <span class="pc-stat">${h("sparkle",{size:12})} <b>${d.avail}</b> available</span>
            <span class="pc-stat">${h("grave",{size:12})} <b>${d.occupied}</b> occupied</span>
            <span class="pc-stat-pct">${p}% full</span>
          </div>
          <div class="pc-district-bar">
            <div class="pc-district-bar-fill" style="width:${p}%;background:${d.color}"></div>
          </div>
          <div class="pc-district-foot">
            ${d.cheapest?`<span class="pc-from">From <b>$${d.cheapest}</b></span>`:'<span class="pc-from pc-sold-out">Fully reserved</span>'}
            <button class="btn btn-sm btn-outline pc-fly-btn" data-d="${l}">${h("sparkle",{size:12})} Fly there</button>
          </div>
        </div>`},r=l=>`
      <div class="feed-item" data-bmem="${l.id}"><div class="fi-icon">${Ce(l,20)}</div>
        <div><b>${l.petName}</b> \xB7 ${l.place.split(",").slice(0,2).join(",")}
        <span class="fi-time">${l.years} \xB7 ${h("gift")} ${l.gifts||0} gifts</span></div></div>`;c("#browseBody").innerHTML=`
      <div class="pc-hero">
        <div class="pc-hero-icon">${h("crest",{size:32})}</div>
        <h2>The Virtual Sanctuary Cemetery</h2>
        <div class="pc-hero-sub">Choose an eternal resting place for your beloved companion. Each plot is yours forever.</div>
      </div>

      <div class="pc-summary-row">
        <div class="pc-summary-stat">
          <span class="pc-summary-num">${this.plots.length}</span>
          <span class="pc-summary-label">Total plots</span>
        </div>
        <div class="pc-summary-stat">
          <span class="pc-summary-num pc-avail-num">${i.length}</span>
          <span class="pc-summary-label">Available</span>
        </div>
        <div class="pc-summary-stat">
          <span class="pc-summary-num pc-occ-num">${o.length}</span>
          <span class="pc-summary-label">Occupied</span>
        </div>
        <div class="pc-summary-stat">
          <span class="pc-summary-num">${Object.keys(F).length}</span>
          <span class="pc-summary-label">Districts</span>
        </div>
      </div>

      <button class="btn btn-gold btn-block btn-lg pc-wizard-cta" id="pcWizardBtn">
        ${h("dove")} Create a Memorial \u2014 Guided Journey
      </button>

      <div class="pc-section-title">${h("sparkle")} Browse by District</div>
      <div class="pc-district-list">
        ${Object.entries(n).sort((l,d)=>l[1].cheapest-d[1].cheapest).map(([l,d])=>s(l,d)).join("")}
      </div>

      <div class="pc-section-title" style="margin-top:16px">${h("grave")} Pricing Tiers</div>
      <div class="pc-tiers">
        <div class="pc-tier">
          <div class="pc-tier-head">Standard Plot</div>
          <div class="pc-tier-size">10 \xD7 14 ft</div>
          <div class="pc-tier-desc">A beautiful resting place with space for a headstone and flowers.</div>
        </div>
        <div class="pc-tier pc-tier-featured">
          <div class="pc-tier-head">Premium Plot</div>
          <div class="pc-tier-size">14 \xD7 18 ft</div>
          <div class="pc-tier-desc">Extra room for trees, benches, and custom decorations.</div>
        </div>
        <div class="pc-tier">
          <div class="pc-tier-head">Estate Plot</div>
          <div class="pc-tier-size">20 \xD7 26 ft</div>
          <div class="pc-tier-desc">A grand memorial estate with space for fountains, gazebos, and multiple headstones.</div>
        </div>
      </div>

      ${a.length?`<div class="pc-section-title" style="margin-top:16px">${h("crest")} Your Memorials (${a.length})</div>${a.map(r).join("")}`:""}

      <div class="pc-section-title" style="margin-top:16px">${h("heart")} Community Memorials (${t.length})</div>
      ${t.slice().sort((l,d)=>(d.gifts||0)-(l.gifts||0)).slice(0,12).map(r).join("")}
      ${t.length>12?`<div style="font-size:11.5px;color:rgba(246,241,228,.45);margin:4px 0">...and ${t.length-12} more across the Sanctuary and Earth.</div>`:""}

      <button class="btn btn-outline btn-block" id="browseSanctuary">${h("sparkle")} Fly to Full Overview</button>`,c("#pcWizardBtn").onclick=()=>{e.classList.add("hidden"),this.griefWizardModal()},c("#browseBody").querySelectorAll("[data-bmem]").forEach(l=>{l.onclick=()=>{let d=t.find(p=>p.id===l.dataset.bmem);d&&(e.classList.add("hidden"),this.showEarth(),this.openEarthMemorial(d))}}),c("#browseBody").querySelectorAll(".pc-fly-btn").forEach(l=>{l.onclick=d=>{d.stopPropagation();let p=l.dataset.d;e.classList.add("hidden"),this.show3D().then(()=>this.world?.flyToDistrict(p))}}),c("#browseBody").querySelectorAll(".pc-district-card").forEach(l=>{l.onclick=()=>{let d=l.dataset.district;e.classList.add("hidden"),this.show3D().then(()=>this.world?.flyToDistrict(d))}}),c("#browseSanctuary").onclick=()=>{e.classList.add("hidden"),this.show3D().then(()=>this.world?.flyToDistrict("overview"))},e.classList.remove("hidden")},async earthMemorialForm(e){let t=await this.earth.reverseGeocode(e.lat,e.lng),a=Object.entries(v.data?.ownedPlots||{});this.modal(`
      <div class="comfort-header" style="margin-bottom:14px">
        <div class="comfort-crest" style="width:54px;height:54px">${h("globe",{size:28})}</div>
        <h2>Pin a Sacred Place on Earth</h2>
        <div class="modal-sub">${h("pin")} <b>${k(t)}</b><br>
          Drop a permanent memory pin where your companion loved to explore. 
          <span style="display:block;margin-top:4px;color:var(--accent-hi-c);font-size:11.5px">
            \u2726 All consecrated resting plots reside in our 3D Virtual Sanctuary; Earth pins are maintained permanently by our platform.
          </span>
        </div>
      </div>
      <label>Companion's Name</label><input id="emName" maxlength="24" placeholder="e.g. Biscuit">
      <label>Species</label>
      <select id="emSpecies">
        ${_t()}
      </select>
      <label>Years</label><input id="emYears" maxlength="16" placeholder="2012 \u2013 2025">
      <label>Why this place was special to them</label><textarea id="emEpitaph" rows="2" maxlength="140" placeholder="Our favorite mountain trail, sunlit afternoon nap spot\u2026"></textarea>
      
      ${a.length?`
        <label>Link to your 3D Sanctuary Plot (optional)</label>
        <select id="emLinkedPlot">
          <option value="">\u2014 Standalone Earth Pin \u2014</option>
          ${a.map(([i,o])=>`<option value="${i}">Plot ${i} (${k(o.memorial?.petName||"My Plot")})</option>`).join("")}
        </select>
      `:""}

      <label>Their photo (optional)</label><input id="emPhoto" type="file" accept="image/*">
      <label>Dedicated Rescue Beneficiary \u2014 where tribute gifts flow</label>
      <select id="emCharity">
        <option value="">Let each giver choose</option>
        ${R.map(i=>`<option value="${i.id}" ${v.data.charity===i.id?"selected":""}>${i.name} (${i.category?i.category.toUpperCase():"VERIFIED 501(c)(3)"})</option>`).join("")}
      </select>
      <button class="btn btn-gold btn-block" id="emPay">${h("heart")} Pay ${re(at.price)} &amp; Pin Sacred Spot</button>
      <p class="fine">${O?"Demo: payment simulated.":"Stripe secure checkout."} \xB7 15% passes directly to animal rescue.</p>`),c("#emPay").onclick=async()=>{let i=c("#emName").value.trim()||"Beloved Friend",o=c("#emSpecies").value,n=c("#emLinkedPlot")?.value||null,s=c("#emPay");s.disabled=!0,s.textContent="Processing\u2026";try{let r=c("#emCharity").value||v.data?.charity||R[0].id;if((await Q({kind:"plot",name:`Rainbow Bridge \u2014 memorial for ${i} (anywhere on Earth)`,amount:at.price,meta:{lat:e.lat,lng:e.lng,uid:y.user.uid,charity:r}})).ok){let d=await We(c("#emPhoto")),p=N(c("#emEpitaph").value.trim())||"Forever loved.";s.textContent="Generative Processing...";let[g,u]=await Promise.all([d?Vt(d,"Cinematic memorial loop"):Promise.resolve(null),jt(d,p)]),w={id:"em_"+Date.now(),plotId:n,petName:N(i),species:o,years:c("#emYears").value.trim()||String(new Date().getFullYear()),epitaph:u.epitaph||p,photo:d,videoUrl:g,audioUrl:u.audioUrl,mood:u.mood,charity:c("#emCharity").value||null,socials:{...v.data.socials||{}},lat:e.lat,lng:e.lng,place:t,owner:y.user.name,ownerUid:y.user.uid,gifts:0,guestbook:[],decorations:[],createdAt:Date.now()};if(n&&v.data?.ownedPlots?.[n]){let f=v.data?.ownedPlots?.[n];f.memorial=f.memorial||{},f.memorial.favoritePlaces=f.memorial.favoritePlaces||[],f.memorial.favoritePlaces.push({name:`${i}'s Sacred Place`,place:t,note:w.epitaph,lat:e.lat,lng:e.lng,plotId:n})}v.addEarthMemorial(w),v.logActivity("paw",`${y.user.name} pinned a sacred spot for ${i} \u2014 ${t.split(",")[0]}`),await v.save(y.user),await this.earth.addMemorialMarker(w),this.closeModal(),this.openEarthMemorial(w),this.toast(`${i}'s sacred spot is pinned on Earth.`)}}catch(r){this.toast(String(r.message),"warning"),s.disabled=!1,s.textContent=`Pay ${re(at.price)} & Pin Sacred Spot`}}},toggleFeed(){let e=c("#feedPanel");if(!e.classList.contains("hidden"))return e.classList.add("hidden");c("#campaignPanel")?.classList.add("hidden");let t=[];this.world&&this.world.plots&&(t=this.world.plots.filter(d=>d.status==="occupied"&&d.memorial));let a=["Sarah","Michael","Emma","James","Olivia","William","Sophia","Benjamin","Isabella","Lucas"],i=Object.values(pe),o=[];for(let d=0;d<12;d++){let p=Math.random(),g=d===0?"Just now":d<3?`${d*5+Math.floor(Math.random()*5+1)} mins ago`:d<8?`${Math.floor(d/2+1)} hours ago`:"yesterday";if(p<.35&&t.length>0){let u=t[Math.floor(Math.random()*t.length)];o.push({icon:ce(Ue(u.memorial.species)),html:`New memorial created for <b>${Y(u.memorial.petName)}</b> in ${Y(F[u.district].name)}`,time:g,plotId:u.id})}else if(p<.75&&t.length>0){let u=t[Math.floor(Math.random()*t.length)],w=a[Math.floor(Math.random()*a.length)],f=i[Math.floor(Math.random()*i.length)];o.push({icon:h("gift"),html:`<b>${Y(w)}</b> left ${Y(f.name)} at <b>${Y(u.memorial.petName)}</b>'s memorial`,time:g,plotId:u.id})}else{let u=Ne[Math.floor(Math.random()*Ne.length)];o.push({icon:h("heart"),html:`<b>${Y(u)}'s Rainbow Fund</b> \u2014 community support active`,time:g})}}let n=typeof v>"u"||!v.data||v.data._demo,s=n?"\u2014":v.data.stats?.totalMemorials??0,r=n?"\u2014":v.data.stats?.giftsToday??0,l=n?"\u2014":v.data.stats?.raisedMonth??0;c("#feedBody").innerHTML=`
      <div class="feed-stats">
        <div class="stat-box">
          <div class="stat-val">${s.toLocaleString()}</div>
          <div class="stat-label">Memorials</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">${r}</div>
          <div class="stat-label">Gifts Today</div>
        </div>
        <div class="stat-box">
          <div class="stat-val">$${l.toLocaleString()}</div>
          <div class="stat-label">Raised (mo)</div>
        </div>
      </div>
      <div class="feed-list">
        ${o.map(d=>`
          <div class="feed-item" ${d.plotId?`data-plot="${d.plotId}"`:""}>
            <div class="fi-icon">${d.icon}</div>
            <div class="fi-content">
               <div class="fi-text">${d.html}</div>
               <div class="fi-time">${d.time}</div>
            </div>
          </div>
        `).join("")}
      </div>
    `,c("#feedBody").querySelectorAll("[data-plot]").forEach(d=>{d.onclick=async()=>{let p=this.world?.plots.find(g=>g.id===d.dataset.plot);p&&(e.classList.add("hidden"),await this.show3D(),this.world.flyToDistrict(p.district,p),this.openPlot(p))}}),e.classList.remove("hidden")},refreshWorld(){this.world?.rebuildPlots(),this.map&&(this.map._bg=null,this.map.draw())},showDevotionalModal(e="cathedral"){let t={cathedral:{badge:"Universal Cathedral \xB7 Highland Plateau",title:"Grand Universal Cathedral",sub:"Sagrada Fam\xEDlia Spires & Sistine Nave Vaults",actionName:"Light a Votive Candle & Offer Prayer",iconKey:"candle",actionSound:"playHarmonicChord",intents:[{name:"Hail Mary",text:"Holy Mary, Mother of Grace, watch over our beloved companion in eternal light and radiant peace."},{name:"Eternal Peace & Light",text:"May perpetual light shine upon them, forever safe, joyful and running free across the celestial hills."},{name:"Comfort for Grieving Hearts",text:"Send gentle comfort and healing to our family, knowing love transcends all physical space."},{name:"In Loving Memory",text:"Honoring a noble life filled with unconditional loyalty, gentle purrs, and wagging tails."}]},baal:{badge:"Highland Promontory \xB7 Solomonic Spire",title:"The Sacred Temple of Baal",sub:"Monumental Fluted Pillars & Solomonic Spire of Strength",actionName:"Ignite Sacred Incense & Flame of Strength",iconKey:"fire",actionSound:"playHarmonicChord",intents:[{name:"Flame of Eternal Strength",text:"May their fierce, noble spirit run eternal across the endless golden meadows of strength."},{name:"Guardian Protection for Animals",text:"Invoking ancient guardian power to protect, heal and shelter all living creatures."},{name:"Valiant Warrior Companion",text:"In honor of our brave protector who guarded our family with boundless courage and love."},{name:"Sacred Beast Blessing",text:"Honoring the untamed grace, loyalty, and wild spirit of nature that lives in every animal."}]},pagoda:{badge:"Eastern Mountain Sanctuary \xB7 Zen Rock Garden",title:"Buddhist Zen Pagoda & Sanctuary",sub:"5-Tiered Hinoki Pagoda, Golden Buddha & 528Hz Solfeggio Bell",actionName:"Light Sandalwood Incense & Strike 528Hz Bell",iconKey:"lotus",actionSound:"playHarmonicChord",intents:[{name:"Metta \u2014 Loving-Kindness",text:"May all living beings everywhere be happy, peaceful, and free from suffering and fear."},{name:"Pure Land Rebirth",text:"May our beloved companion dwell in tranquil serenity among blooming lotus blossoms and gentle breezes."},{name:"Compassion for All Beings",text:"A circle of endless compassion spanning all realms of existence and life."},{name:"Gratitude for Shared Life",text:"Deep bowing in gratitude for the sacred years and profound unconditional love we shared."}]},mosque:{badge:"Western Ridge Promontory \xB7 Court of Lions",title:"Moorish Mosque & Court of Lions",sub:"Alhambra Double Arches, Muqarnas Mihrab & Sacred Fanous Lanterns",actionName:"Illuminate Sacred Fanous Lamp & Float Rose Petal",iconKey:"sparkle",actionSound:"playHarmonicChord",intents:[{name:"Bismillah \u2014 Divine Mercy",text:"In the name of the Most Merciful, grant eternal serenity and cool shade to our companion."},{name:"Light of Divine Peace (Noor)",text:"May their spirit be bathed in radiant celestial illumination and eternal warmth."},{name:"Gentle Care for All Creatures",text:"Honoring the sacred duty of stewardship and gentle care for the innocent souls of the earth."},{name:"Garden of Eternal Bliss (Firdaws)",text:"Resting peacefully beside crystal waters, sweet dates, and everlasting comfort."}]}},a=t[e]||t.cathedral,i=a.intents[0],o=15,n=()=>{this.modal(`
        <div class="devotional-modal-header">
          <div class="devotional-modal-badge">${a.badge}</div>
          <h2>${a.title}</h2>
          <div class="modal-sub">${a.sub}</div>
        </div>

        <label style="margin-top:0;">Select Devotional Intention / Prayer</label>
        <div class="devotional-intent-grid">
          ${a.intents.map((l,d)=>`
            <button class="devotional-intent-btn ${l.name===i.name?"is-selected":""}" data-idx="${d}">
              <span class="devotional-intent-title">${l.name}</span>
              <span class="devotional-intent-sub">${l.text.slice(0,52)}\u2026</span>
            </button>
          `).join("")}
        </div>

        <label>Selected Prayer / Dedication Text</label>
        <textarea id="devotionalPrayerText" rows="2" style="width:100%;padding:10px;border-radius:var(--r-md);background:rgba(0,0,0,0.4);border:1px solid rgba(212,175,55,0.3);color:#f4f0e6;font-family:var(--serif);font-size:14px;line-height:1.5;">${i.text}</textarea>

        <label>Dedicated in Memory of (Companion's Name)</label>
        <input id="devotionalPetName" placeholder="e.g. Bella, Kaya, Toby..." style="width:100%;padding:10px;border-radius:var(--r-md);background:rgba(0,0,0,0.4);border:1px solid rgba(212,175,55,0.3);color:#fff;font-size:14px;">

        <label>Devotional Offering &amp; Charity Donation</label>
        <div class="devotional-amount-row">
          <button class="devotional-amount-btn ${o===5?"is-selected":""}" data-amt="5">$5</button>
          <button class="devotional-amount-btn ${o===15?"is-selected":""}" data-amt="15">$15</button>
          <button class="devotional-amount-btn ${o===25?"is-selected":""}" data-amt="25">$25</button>
          <button class="devotional-amount-btn ${o===50?"is-selected":""}" data-amt="50">$50</button>
          <button class="devotional-amount-btn ${o===100?"is-selected":""}" data-amt="100">$100</button>
        </div>

        <div class="devotional-charity-badge">
          <i class="ico-slot" data-icon="heart"></i>
          <span><b>100% Transparency:</b> Every cent is published in the cryptographic ledger and directly supports verified 501(c)(3) animal shelters &amp; wildlife rescues.</span>
        </div>

        <div style="display:flex;gap:10px;margin-top:24px;">
          <button class="btn btn-outline" data-close style="flex:1;">Cancel</button>
          <button class="btn btn-gold btn-lg" id="devotionalSubmitBtn" style="flex:2;">
            <i class="ico-slot" data-icon="${a.iconKey}"></i> ${a.actionName} ($${o})
          </button>
        </div>
      `);let s=c("#modalBox");s.querySelectorAll(".devotional-intent-btn").forEach(l=>{l.onclick=()=>{let d=parseInt(l.dataset.idx,10);i=a.intents[d],n()}}),s.querySelectorAll(".devotional-amount-btn").forEach(l=>{l.onclick=()=>{o=parseInt(l.dataset.amt,10),n()}});let r=s.querySelector("#devotionalSubmitBtn");r&&(r.onclick=async()=>{let l=s.querySelector("#devotionalPetName")?.value?.trim()||"Beloved Companion",d=s.querySelector("#devotionalPrayerText")?.value?.trim()||i.text;try{window.Soundscape?.[a.actionSound]?window.Soundscape[a.actionSound]():window.Soundscape?.playHarmonicChord&&window.Soundscape.playHarmonicChord(432)}catch{this.toast&&this.toast("Soundscape playback failed.","warning")}try{window.Ledger?.record&&await window.Ledger.record({kind:"temple_offering",temple:e,petName:l,prayer:d,amount:o,charity:"best_friends",at:Date.now()})}catch{this.toast&&this.toast("Failed to record offering.","warning")}this.world?._triggerTempleCelebration&&this.world._triggerTempleCelebration(e),this.closeModal(),this.toast(`\u2726 Offering consecrated in ${a.title} for ${l}!`,4500,"sparkle")})};n()}};function da(e=document){let t=null,a=()=>{let r=t?.getBoundingClientRect(),l=r&&r.width>0&&r.height>0?Math.max(0,r.bottom):0;e.documentElement.style.setProperty("--site-notice-height",`${Math.ceil(l)}px`)},i=typeof ResizeObserver<"u"?new ResizeObserver(a):null,o=new MutationObserver(a),n=()=>{let r=e.querySelector('[class*="api-load-alpha-banner"]');r!==t&&(i?.disconnect(),o.disconnect(),t=r,t&&(i?.observe(t),o.observe(t,{attributes:!0,attributeFilter:["class","style","hidden"]}))),a()},s=new MutationObserver(n);return s.observe(e.body,{childList:!0,subtree:!0}),window.addEventListener("resize",a,{passive:!0}),n(),()=>{s.disconnect(),i?.disconnect(),o.disconnect(),window.removeEventListener("resize",a)}}window.UI=$;var de=Dt();function Ba(){let e=v.data?.ownedPlots||{};for(let[t,a]of Object.entries(e)){let i=de.find(n=>n.id===t);if(!i)continue;i.status="occupied";let o=v.data?.gifts?.[t]||[];i.memorial={...a.memorial,owner:"You",gifts:o.length},i.decor=[{type:"headstone",style:a.memorial?.headstone||"classic"}];for(let n of a.decor||[]){let s=tt[n.itemId],r=le.find(l=>l.id===n.slot)||le[0];s&&i.decor.push({...s,dx:r.dx,dz:r.dz})}o.forEach((n,s)=>{let r=ze[n.giftId];r&&i.decor.push({...r,dx:(s%3-1)*2.8,dz:4.5+Math.floor(s/3)*2.2})})}for(let[t,a]of Object.entries(v.data?.gifts||{})){if(e[t])continue;let i=de.find(o=>o.id===t);i&&a.forEach((o,n)=>{let s=ze[o.giftId];s&&i.decor.push({...s,dx:(n%3-1)*2.8,dz:4.5+Math.floor(n/3)*2.2})})}}var ut={el:document.getElementById("preloader"),bar:document.getElementById("preloaderBarFill"),step(e){window.__setRainbowProgress&&window.__setRainbowProgress(e)},done(){window.__rbvBooted=!0,window.__appBootReady=!0,window.dispatchEvent(new Event("eternalvalley:ready")),typeof window.__finishPreloader=="function"&&window.__finishPreloader()},fail(e){window.__appBootReady=!1,window.dispatchEvent(new CustomEvent("eternalvalley:booterror",{detail:e?.message||String(e)})),console.log("[boot]",e);let t=document.getElementById("preloaderNote"),a=document.getElementById("preloaderWord");a&&(a.textContent="The sanctuary could not open"),t&&(t.textContent=e&&e.message?e.message:String(e),t.classList.remove("hidden"));let i=document.createElement("button");i.className="btn btn-gold",i.textContent="Reload sanctuary",i.onclick=()=>location.reload(),t?.after(i)}};var Ye=null,At=Promise.resolve(),ma=!1;function gt(e){if(ma)return Promise.resolve({world:null,map:$.map});if(window.world||$.world){let t=window.world||$.world;return $.world||($.world=t),window.world||(window.world=t),Promise.resolve({world:t,map:$.map})}return Ye||(Ye=(async()=>{let t;try{if(!Rt())throw ma=!0,new Error("WebGL2 is unavailable. The interactive layout is still available.");let{World3D:a}=await import("./world3d-FMVLJRCP.js");await At;let i=document.getElementById("canvas3d");i||(i=document.querySelector("canvas#canvas3d")),i.addEventListener("webglcontextlost",n=>{n.preventDefault(),console.warn("[world] WebGL Context Lost! Falling back..."),t?.stop(),$.show2D(),$.toast("3D was interrupted. You can continue in the interactive layout.",6500,"warning")},{once:!0}),t=new a(i,e,n=>{$.openPlot(n),$.map?.select(n)}),await t.initAsync(),window.world=t,window.UI=window.UI||$,window.UI.world=t,console.log("[boot] window.world assigned, creating Map2D..."),t.onAmbience=(n,s)=>{ue.setMood(n.mood),$.toast(`${ot[s].name} \xB7 ${ke[n.mood].label}${n.live?" (live weather)":""}`,5e3)};let o=$.map;return o||(o=new bt(document.getElementById("canvas2d"),e,n=>$.visitWorldPlot(n))),$.attachWorld(t,o),{world:t,map:o}}catch(a){return console.warn("[world] failed to initialize 3D world:",a.message||a),t?.dispose(),$.toast("3D is unavailable on this device. The interactive layout is ready.",7e3,"warning"),Ye=null,window.__startWorldPromise=null,await $.show2D(),{world:null,map:$.map}}})(),window.__startWorldPromise=Ye),Ye}var te=null;function La(){let e=document.getElementById("welcomeTicker");if(!e)return;let t=Object.values(F),a=s=>s[Math.floor(Math.random()*s.length)];function i(){let s=Math.random(),r=a(Ne),l=document.createElement("span");if(s<.4){let d=a(pe);l.innerHTML=`<span class="ticker-gold-mark">\u2726</span> <b>${r}</b> received <b>${d.name}</b> tribute`}else if(s<.8){let d=a(t);l.innerHTML=`<span class="ticker-gold-mark">\u2726</span> Memorial placed for <b>${r}</b> in <b>${d.name}</b>`}else{let d=a(R),p=Math.floor(Math.random()*80)+10;l.innerHTML=`<span class="ticker-gold-mark">\u2726</span> <b>${r}</b>\u2019s family raised <b>$${p}</b> for <b>${d.name}</b>`}return l.innerHTML}let o=null;function n(){if(!document.getElementById("welcomeTicker")){te&&(clearInterval(te),te=null);return}if(o){o.classList.remove("is-active"),o.classList.add("is-exit");let r=o;setTimeout(()=>{r.parentNode&&r.remove()},1e3)}let s=document.createElement("div");s.className="welcome-ticker-content",s.innerHTML=i(),e.appendChild(s),s.offsetWidth,s.classList.add("is-active"),o=s}n(),te=setInterval(n,4e3),document.addEventListener("visibilitychange",()=>{document.hidden?te&&(clearInterval(te),te=null):!te&&document.getElementById("welcomeTicker")&&(te=setInterval(n,4e3))}),window.addEventListener("beforeunload",()=>{te&&clearInterval(te)})}var Lt=!1,Ke=null;async function Ie(e="3d"){return console.log("[enter] entering sanctuary in mode:",e),Lt&&Ke||(Lt=!0,Ie._done=!0,Ke=(async()=>{try{let t=document.getElementById("preloader");t&&(t.classList.add("is-done"),t.style.pointerEvents="none",setTimeout(()=>{t.parentNode&&t.remove()},900)),te&&(clearInterval(te),te=null);try{window.__evAtmosphere?.stop&&window.__evAtmosphere.stop()}catch(s){console.log("[enter] atmosphere stop error:",s)}let a=document.getElementById("welcome");a&&a.parentNode&&a.remove(),document.body.classList.add("has-entered");let i=document.getElementById("topbar");i&&i.classList.remove("hidden");let o=document.getElementById("stage");if(o&&(o.classList.remove("hidden"),o.style.display="block"),setTimeout(()=>{document.getElementById("earthToolbar")?.classList.remove("is-waiting"),document.getElementById("globeCta")?.classList.remove("is-waiting")},100),e==="tour")await $.show3D("tour",!1);else if(e==="3d")await $.show3D("orbit",!1);else if(e==="globe")try{await $.showGlobe(),console.log("[enter] showGlobe resolved")}catch(s){console.log("[enter] Globe failed, falling back to 3D:",s);try{await gt(de),await $.show3D("tour")}catch{try{await $.show2D()}catch{}}}else if(e==="earth")try{await $.showEarth()}catch{try{await $.showGlobe()}catch{}}else if(e==="2d")try{await $.show2D()}catch{try{await gt(de),await $.show3D("tour")}catch{}}let n=()=>{window.dispatchEvent(new Event("resize")),$.world?._resize&&$.world._resize(),$._currentView==="view3d"&&$.world?.start(),$.globe?.resize&&$.globe.resize(),$.map?._resize&&$.map._resize()};requestAnimationFrame(n),setTimeout(n,50),setTimeout(n,200),setTimeout(n,500);try{let s=new URLSearchParams(location.search);s.get("paid")==="1"&&($.toast("Your memorial contribution was received. It will appear shortly.",8e3,"crest"),s.delete("paid"),window.history.replaceState({},"",`${window.location.pathname}${s.toString()?"?"+s.toString():""}`)),(s.get("tour")==="true"||s.has("tour"))&&setTimeout(()=>{$.startDroneTour()},100);let r=s.get("m");if(r){let{allMemorials:u}=await import("./social-G42BHPTM.js"),w=u(v.data).find(f=>f.id===r);w?setTimeout(()=>{$.showEarth(),$.openEarthMemorial(w)},1200):$.toast("That memorial link could not be found on this device.")}let l=s.get("p");if(l){let u=de.find(w=>w.id===l);u&&(await $.show3D(),$.world?.selectPlot(u),$.openPlot(u))}let d=s.get("campaign");if(d){let{Campaigns:u}=await import("./charity-25BSZEWB.js"),w=u.get(d);w&&setTimeout(()=>Z.campaignModal($,w),1200)}let p=s.get("charity");if(p){let{charityById:u}=await import("./charity-25BSZEWB.js"),w=u(p);w&&setTimeout(()=>$.shelterModal(w),1200)}let g=s.get("ref");if(g){try{localStorage.setItem("ev_ref",g.slice(0,40))}catch{}let u=await import("./config-G6XWWQD2.js");if(u.HAS_API){let w=!1;try{w=localStorage.getItem("ev_privacy_consent")==="true"}catch{}w&&fetch(u.API_BASE+"/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({kind:"referral",name:"Partner referral: "+g.slice(0,40),amount:0,user:"visitor"})}).catch(()=>{})}$.toast("Welcome \u2014 you were referred by a caring partner.","heart")}}catch(s){console.log("[enter] URL param handling failed:",s)}}catch(t){throw console.log("[enter] enter error, resetting entry flag:",t),Lt=!1,Ie._done=!1,Ke=null,t}})()),Ke}window.enter=Ie;window.__checkAndEnterApp=()=>{(window.__appBootReady||window.__rainbowAnimationReady)&&Ie("3d")};async function Aa(){console.log("[boot] 1: Theme.init, Icons & Early UI.init"),da(),$.init({earth:null,plots:de,ensureWorld:()=>gt(de)});try{ue.init(),Ot(document),window.UI=$,window.veoTour=window.VeoTour=X,X.init()}catch(t){console.log("[boot] Theme/icons/UI init error:",t)}try{$.map=new bt(document.getElementById("canvas2d"),de,t=>$.visitWorldPlot(t))}catch(t){console.warn("[map] Layout could not initialize:",t)}At=y.init().then(()=>v.init(y.user)).then(Ba).catch(t=>console.warn("[state]",t)),ut.step(20),ut.step(100),ut.done(),(async()=>{console.log("[boot background] Atmosphere, Ticker, Auth & State...");try{La(),ee.enhance(document),ee.cursorGlow()}catch(t){console.log("[boot background] Atmosphere/Motion error:",t)}try{await Promise.all([oa.catch(t=>console.log("[boot background] photosReady error:",t)),At])}catch(t){console.log("[boot background] Auth/State step error:",t)}})();let e=location.hostname!=="localhost"&&location.hostname!=="127.0.0.1";if(e||(window.UI=$,window.world=window.world||$.world,window.RBV={UI:$,Theme:ue,get atmosphere(){return window.__evAtmosphere},plots:de,get earth(){return $.earth},resetTour(){try{localStorage.removeItem("ev_tour_seen_v1")}catch{}return"tour will play on next load"},get world(){return $.world},get map(){return $.map},ready:()=>gt(de),setPhase(t){return $.world?.forcePhase(t),ue.forcePhase?.(t),t},setMood(t){return $.world&&($.world.mood=t,$.world.applyAmbience()),ue.setMood(t),t}}),e)try{localStorage.removeItem("ev_admin_mode");let t=new URLSearchParams(window.location.search);(t.has("admin")||t.has("dev"))&&(t.delete("admin"),t.delete("dev"),t.delete("mode"),window.history.replaceState({},"",`${window.location.pathname}?${t.toString()}`),window.location.reload())}catch{}document.getElementById("worldLoadingMap")?.addEventListener("click",()=>$.show2D()),document.getElementById("enterBtn")?.addEventListener("click",()=>Ie("3d")),document.getElementById("sanctuaryEntryBtn")?.addEventListener("click",()=>Ie("3d")),document.getElementById("wizardEntryBtn")?.addEventListener("click",async()=>{await Ie("3d"),setTimeout(()=>$.griefWizardModal(),800)});for(let t of["welcomeLedger","welcomeLedger2"])document.getElementById(t)?.addEventListener("click",a=>{a.preventDefault(),Z.ledgerModal($)});document.getElementById("ctaCampaigns")?.addEventListener("click",t=>{t.preventDefault(),Z.togglePanel($)})}Aa().catch(e=>ut.fail(e));window.addEventListener("unhandledrejection",e=>{let t=e.reason?.message||String(e.reason||"");if(!/ResizeObserver|AbortError|cancelled|canceled/i.test(t)){console.log("[unhandledrejection]",e.reason);try{$?.toast("Something went wrong \u2014 please reload if the page looks broken.",6e3,"warning")}catch{}}});window.addEventListener("error",e=>{/WebGL|context lost/i.test(e.message||"")||console.log("[error]",e.message,e.filename,e.lineno)});function ha(){let e=document.getElementById("menuToggle"),t=document.getElementById("topbar");e&&t&&!e._bound&&(e._bound=!0,e.addEventListener("click",a=>{a.stopPropagation(),t.classList.toggle("nav-open")}),document.addEventListener("click",a=>{t.classList.contains("nav-open")&&!t.contains(a.target)&&t.classList.remove("nav-open")}),t.querySelectorAll("a, button").forEach(a=>{a.addEventListener("click",()=>{setTimeout(()=>t.classList.remove("nav-open"),120)})}))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ha):ha();export{Ie as enter};
