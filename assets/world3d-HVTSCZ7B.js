import{a as ha,b as da,c as ua,d as fa,e as pa,f as ma}from"./chunk-NJRMMQT2.js";import{a as Yo,b as Os,c as Pn,d as Gn,p as An,r as Dn,t as Zo,u as es,v as Do,w as Bn}from"./chunk-KM3NKBWS.js";import{b as kn,c as xs,d as In}from"./chunk-GRVASKCC.js";import{a as yt,b as jt,c as K,d as Rn,e as bn,f as Hn,g as Xo,h as Ts,i as ze,j as _n,k as Sn,l as Cn,m as xo,q as Po,r as Qo}from"./chunk-74CMN5JF.js";import{d as zn}from"./chunk-LBPPFFK4.js";import"./chunk-JRTNOIIK.js";import{f as yo,h as ho,i as pe,l as Go,o as la}from"./chunk-EYCJDE2E.js";import{$c as so,$d as _s,Aa as Ys,Ad as Yn,Bd as Mt,Dd as Zn,Fe as rs,Ga as Rs,Ha as Bo,Jd as ct,Je as Jn,Jf as ta,Kd as ns,Ke as Qn,Le as $t,Mc as ts,Me as F,Mf as oa,Nc as kt,Ne as lt,Nf as sa,Od as qn,Of as vo,Pe as Vt,Pf as Gs,Qf as na,Re as mo,Tc as Zs,Te as Eo,Tf as aa,Uc as Un,Ue as $s,Vd as qe,Ve as no,Wc as On,Wd as jn,We as bo,Xd as Kn,Yb as bs,Ye as rt,Zb as Vn,Zd as Hs,_d as js,_e as dt,ad as A,ae as Ss,af as Jt,ba as Nn,bd as os,be as as,bg as ra,cd as qs,df as Ps,ed as _t,ef as Ot,fd as Xn,ff as ot,hd as Lt,he as Ft,ie as ut,j as Ln,jd as Me,jf as ea,ld as Ct,m as Fn,md as ss,n as gt,na as qo,nd as tt,oe as Cs,p as Xs,pe as co,pg as ia,q as Ht,qe as $n,re as Ks,tg as ca,va as Ro,ve as Kt,wd as mt,xd as Et,yd as r,zc as Wn,zd as ce,ze as It}from"./chunk-ZQR4HC7I.js";function zs(ye,{snowMin:e=285,snowMax:o=365}={}){let s=yo("meadowLush"),n=yo("photogrammetryRock"),t=yo("woodlandSoil"),a=yo("coastalSand");for(let u of[s,n,t,a])for(let f of Object.values(u))f.anisotropy=Math.min(8,ye.capabilities.getMaxAnisotropy());let l=new Ot({roughness:.92,metalness:0});return l.name="Photographic terrain",l.userData.ready=Promise.all([s.ready,n.ready,t.ready,a.ready]),l.userData.ready.catch(()=>{}),l.onBeforeCompile=u=>{Object.assign(u.uniforms,{snowRange:{value:new kt(e,o)},grassMap:{value:s.map},grassNormal:{value:s.normalMap},grassRough:{value:s.roughnessMap},rockMap:{value:n.map},rockNormal:{value:n.normalMap},rockRough:{value:n.roughnessMap},soilMap:{value:t.map},sandMap:{value:a.map},sandNormal:{value:a.normalMap},sandRough:{value:a.roughnessMap}}),u.vertexShader=u.vertexShader.replace("#include <common>",`#include <common>
        attribute float aCreviceAO;
        varying vec3 terrainPosition;
        varying vec3 terrainNormal;
        varying float terrainAO;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        terrainPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        terrainNormal = normalize(mat3(modelMatrix) * normal);
        terrainAO = aCreviceAO;`),u.fragmentShader=u.fragmentShader.replace("#include <common>",`#include <common>
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
        }`).replace("#include <map_fragment>",`
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
      `).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        vec3 rockN = triNormal(rockNormal, rp, tn, tw);
        vec3 gn = untiled(grassNormal, gp.xz) * 2.0 - 1.0;
        vec3 grassN = normalize(tn + vec3(gn.x, 0.0, gn.y) * 0.28);
        vec3 detailN = normalize(mix(rockN, grassN, grassWeight));
        vec3 sn = untiled(sandNormal, terrainPosition.xz * 0.0666667) * 2.0 - 1.0;
        detailN = normalize(mix(detailN, normalize(tn + vec3(sn.x,0.0,sn.y)*0.18), coastal));
        detailN = normalize(mix(detailN, tn, snowWeight * 0.65));
        normal = normalize(mat3(viewMatrix) * detailN);
      `).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        float rr = dot(triColor(rockRough, rp, tw), vec3(0.333333));
        float gr = untiled(grassRough, gp.xz).g;
        roughnessFactor = clamp(mix(mix(rr, gr, grassWeight), untiled(sandRough, terrainPosition.xz * 0.0666667).g, coastal) - damp * 0.18, 0.52, 1.0);
      `).replace("#include <aomap_fragment>",`#include <aomap_fragment>
        reflectedLight.indirectDiffuse *= mix(0.65, 1.0, clamp(terrainAO, 0.0, 1.0));
      `)},l.customProgramCacheKey=()=>"natural-terrain-v2",l}var ks=class{constructor(e){this.world=e,this.curve=new It(Qo.map(o=>new A(o.x,Math.max(o.y+55,ze(o.x,o.z)+65),o.z)),!0,"catmullrom",.5),this.curve.arcLengthDivisions=4096,this.length=this.curve.getLength(),this.distance=0,this.active=!1,this.paused=!1,this.position=new A,this.look=new A,this.matrix=new _t,this.rotation=new so,this.up=new A(0,1,0)}sample(e,o){return this.curve.getPointAt((e/this.length%1+1)%1,o),o.y=Math.max(o.y,ze(o.x,o.z)+45),o}start(e){if(Number.isInteger(e)){let s=Math.max(0,Math.min(Qo.length-1,e));this.distance=this.curve.getLengths()[Math.round(s/Qo.length*this.curve.arcLengthDivisions)]}else{let s=1/0;for(let n=0;n<512;n++){let t=this.length*n/512,a=this.sample(t,this.position),l=a.x-this.world.camera.position.x,u=a.z-this.world.camera.position.z,f=l*l+u*u;f<s&&(s=f,this.distance=t)}}this.active=!0,this.paused=!1,this.world.controls.enabled=!1,this.world.camera.up.copy(this.up),this.mountControls();let o=document.querySelector("#liveFlightControls button");o&&(o.textContent="Pause flight")}update(e){if(!this.active)return;let o=Math.max(0,Math.min(.1,e));this.paused||(this.distance=(this.distance+o*22)%this.length),this.sample(this.distance,this.position),this.sample(this.distance+95,this.look);let s=this.world.camera;s.position.lerp(this.position,1-Math.exp(-3*o)),s.position.y=Math.max(s.position.y,ze(s.position.x,s.position.z)+15),this.matrix.lookAt(s.position,this.look,this.up),this.rotation.setFromRotationMatrix(this.matrix),s.quaternion.slerp(this.rotation,1-Math.exp(-2*o)),this.world.controls.target.copy(this.look),window.UI?.map&&(window.UI.map.dronePosition=s.position)}stop(){this.active=!1,this.world.controls.enabled=!0,document.getElementById("liveFlightControls")?.classList.add("hidden")}mountControls(){let e=document.getElementById("liveFlightControls");if(!e){e=document.createElement("div"),e.id="liveFlightControls",e.className="live-flight-controls";let o=document.createElement("select");o.setAttribute("aria-label","Flight landmark"),Qo.forEach((s,n)=>{let t=document.createElement("option");t.value=n,t.textContent=s.name,o.append(t)}),o.onchange=()=>this.start(Number(o.value)),e.append(o);for(let[s,n]of[["Pause flight",t=>{this.paused=!this.paused,t.currentTarget.textContent=this.paused?"Resume flight":"Pause flight"}]]){let t=document.createElement("button");t.textContent=s,t.onclick=n,e.append(t)}document.getElementById("view3d").append(e)}e.classList.remove("hidden")}};function Is(ye,e=!1){let o=ye[0].index!==null,s=new Set(Object.keys(ye[0].attributes)),n=new Set(Object.keys(ye[0].morphAttributes)),t={},a={},l=ye[0].morphTargetsRelative,u=new Et,f=0;for(let c=0;c<ye.length;++c){let p=ye[c],w=0;if(o!==(p.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let b in p.attributes){if(!s.has(b))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+'. All geometries must have compatible attributes; make sure "'+b+'" attribute exists among all geometries, or in none of them.'),null;t[b]===void 0&&(t[b]=[]),t[b].push(p.attributes[b]),w++}if(w!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". Make sure all geometries have the same number of attributes."),null;if(l!==p.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let b in p.morphAttributes){if(!n.has(b))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+".  .morphAttributes must be consistent throughout all geometries."),null;a[b]===void 0&&(a[b]=[]),a[b].push(p.morphAttributes[b])}if(e){let b;if(o)b=p.index.count;else if(p.attributes.position!==void 0)b=p.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". The geometry must have either an index or a position attribute"),null;u.addGroup(f,b,c),f+=b}}if(o){let c=0,p=[];for(let w=0;w<ye.length;++w){let b=ye[w].index;for(let x=0;x<b.count;++x)p.push(b.getX(x)+c);c+=ye[w].attributes.position.count}u.setIndex(p)}for(let c in t){let p=Ea(t[c]);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" attribute."),null;u.setAttribute(c,p)}for(let c in a){let p=a[c][0].length;if(p===0)break;u.morphAttributes=u.morphAttributes||{},u.morphAttributes[c]=[];for(let w=0;w<p;++w){let b=[];for(let V=0;V<a[c].length;++V)b.push(a[c][V][w]);let x=Ea(b);if(!x)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" morphAttribute."),null;u.morphAttributes[c].push(x)}}return u}function Ea(ye){let e,o,s,n=-1,t=0;for(let f=0;f<ye.length;++f){let c=ye[f];if(e===void 0&&(e=c.array.constructor),e!==c.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(o===void 0&&(o=c.itemSize),o!==c.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(s===void 0&&(s=c.normalized),s!==c.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(n===-1&&(n=c.gpuType),n!==c.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;t+=c.count*o}let a=new e(t),l=new tt(a,o,s),u=0;for(let f=0;f<ye.length;++f){let c=ye[f];if(c.isInterleavedBufferAttribute){let p=u/o;for(let w=0,b=c.count;w<b;w++)for(let x=0;x<o;x++){let V=c.getComponent(w,x);l.setComponent(w+p,x,V)}}else a.set(c.array,u);u+=c.count*o}return n!==void 0&&(l.gpuType=n),l}var Js=class{constructor(){this.videos=new Map,this.maxConcurrent=3,this.camera=null,this.dummyVideo=document.createElement("video"),this.dummyVideo.setAttribute("playsinline",""),this.dummyVideo.setAttribute("muted",""),this.dummyVideo.muted=!0;let e=()=>{this.dummyVideo.play().catch(o=>{}),window.removeEventListener("touchstart",e),window.removeEventListener("click",e)};window.addEventListener("touchstart",e,{once:!0}),window.addEventListener("click",e,{once:!0})}setCamera(e){this.camera=e}createVideoTexture(e,o,s=!1){if(this.videos.has(e))return this.videos.get(e).texture;let n=document.createElement("video");n.src=o,n.crossOrigin="anonymous",n.loop=!0,n.muted=!0,n.setAttribute("playsinline",""),n.setAttribute("muted","");let t=new $n(n);return t.minFilter=Ro,t.magFilter=Ro,t.generateMipmaps=!1,t.colorSpace=bs,this.videos.set(e,{video:n,texture:t,isSky:s,active:!1}),t}registerMesh(e,o){this.videos.has(e)&&(this.videos.get(e).mesh=o)}update(){if(!this.camera)return;let e=[];for(let[s,n]of this.videos.entries())if(n.isSky)e.push({id:s,dist:0});else if(n.mesh){let t=this.camera.position.distanceTo(n.mesh.position);e.push({id:s,dist:t})}else e.push({id:s,dist:1/0});e.sort((s,n)=>s.dist-n.dist);let o=0;for(let{id:s}of e){let n=this.videos.get(s);o<this.maxConcurrent?(n.active||(n.video.play().catch(t=>console.warn("Autoplay prevented:",t)),n.active=!0),o++):n.active&&(n.video.pause(),n.active=!1)}}disposeVideo(e){let o=this.videos.get(e);o&&(o.video.pause(),o.video.removeAttribute("src"),o.video.load(),o.texture.dispose(),this.videos.delete(e))}},is=new Js;var As=class{constructor(e){this.world=e,this.billboards=new qe,this.billboards.name="memorialBillboards",this.world.scene.add(this.billboards),this.planeGeo=new ct(3,3)}init(e){for(;this.billboards.children.length>0;){let s=this.billboards.children[0];this.billboards.remove(s),s.material.dispose()}let o=new Zs;for(let s of e){if(!s.memorial)continue;let n=s.memorial,t=o;if(n.videoUrl&&is)t=is.createVideoTexture("plot_"+s.id,n.videoUrl,!1);else if(n.photo){let u=new Image;u.src=n.photo;let f=new Zs(u);u.onload=()=>f.needsUpdate=!0,t=f}let a=new Ct({map:t,transparent:!0,side:gt}),l=new r(this.planeGeo,a);l.position.set(s.x,s.y+2.5,s.z),l.onBeforeRender=(u,f,c)=>{l.quaternion.copy(c.quaternion)},this.billboards.add(l),n.videoUrl&&is&&is.registerMesh("plot_"+s.id,l)}}};var Ds=class extends ta{constructor(e){super(e),this.type=Bo}parse(e){let a=function(Y,k){switch(Y){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(k||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(k||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(k||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(k||""))}},p=function(Y,k,h){k=k||1024;let _=Y.pos,g=-1,i=0,S="",C=String.fromCharCode.apply(null,new Uint16Array(Y.subarray(_,_+128)));for(;0>(g=C.indexOf(`
`))&&i<k&&_<Y.byteLength;)S+=C,i+=C.length,_+=128,C+=String.fromCharCode.apply(null,new Uint16Array(Y.subarray(_,_+128)));return-1<g?(h!==!1&&(Y.pos+=i+g+1),S+C.slice(0,g)):!1},w=function(Y){let k=/^#\?(\S+)/,h=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,v=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,_=/^\s*FORMAT=(\S+)\s*$/,g=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,i={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},S,C;for((Y.pos>=Y.byteLength||!(S=p(Y)))&&a(1,"no header found"),(C=S.match(k))||a(3,"bad initial token"),i.valid|=1,i.programtype=C[1],i.string+=S+`
`;S=p(Y),S!==!1;){if(i.string+=S+`
`,S.charAt(0)==="#"){i.comments+=S+`
`;continue}if((C=S.match(h))&&(i.gamma=parseFloat(C[1])),(C=S.match(v))&&(i.exposure=parseFloat(C[1])),(C=S.match(_))&&(i.valid|=2,i.format=C[1]),(C=S.match(g))&&(i.valid|=4,i.height=parseInt(C[1],10),i.width=parseInt(C[2],10)),i.valid&2&&i.valid&4)break}return i.valid&2||a(3,"missing format specifier"),i.valid&4||a(3,"missing image size specifier"),i},b=function(Y,k,h){let v=k;if(v<8||v>32767||Y[0]!==2||Y[1]!==2||Y[2]&128)return new Uint8Array(Y);v!==(Y[2]<<8|Y[3])&&a(3,"wrong scanline width");let _=new Uint8Array(4*k*h);_.length||a(4,"unable to allocate buffer space");let g=0,i=0,S=4*v,C=new Uint8Array(4),O=new Uint8Array(S),te=h;for(;te>0&&i<Y.byteLength;){i+4>Y.byteLength&&a(1),C[0]=Y[i++],C[1]=Y[i++],C[2]=Y[i++],C[3]=Y[i++],(C[0]!=2||C[1]!=2||(C[2]<<8|C[3])!=v)&&a(3,"bad rgbe scanline format");let m=0,E;for(;m<S&&i<Y.byteLength;){E=Y[i++];let P=E>128;if(P&&(E-=128),(E===0||m+E>S)&&a(3,"bad scanline data"),P){let oe=Y[i++];for(let ne=0;ne<E;ne++)O[m++]=oe}else O.set(Y.subarray(i,i+E),m),m+=E,i+=E}let R=v;for(let P=0;P<R;P++){let oe=0;_[g]=O[P+oe],oe+=v,_[g+1]=O[P+oe],oe+=v,_[g+2]=O[P+oe],oe+=v,_[g+3]=O[P+oe],g+=4}te--}return _},x=function(Y,k,h,v){let _=Y[k+3],g=Math.pow(2,_-128)/255;h[v+0]=Y[k+0]*g,h[v+1]=Y[k+1]*g,h[v+2]=Y[k+2]*g,h[v+3]=1},V=function(Y,k,h,v){let _=Y[k+3],g=Math.pow(2,_-128)/255;h[v+0]=ss.toHalfFloat(Math.min(Y[k+0]*g,65504)),h[v+1]=ss.toHalfFloat(Math.min(Y[k+1]*g,65504)),h[v+2]=ss.toHalfFloat(Math.min(Y[k+2]*g,65504)),h[v+3]=ss.toHalfFloat(1)},y=new Uint8Array(e);y.pos=0;let H=w(y),M=H.width,L=H.height,T=b(y.subarray(y.pos),M,L),N,q,$;switch(this.type){case Rs:$=T.length/4;let Y=new Float32Array($*4);for(let h=0;h<$;h++)x(T,h*4,Y,h*4);N=Y,q=Rs;break;case Bo:$=T.length/4;let k=new Uint16Array($*4);for(let h=0;h<$;h++)V(T,h*4,k,h*4);N=k,q=Bo;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:M,height:L,data:N,header:H.string,gamma:H.gamma,exposure:H.exposure,type:q}}setDataType(e){return this.type=e,this}load(e,o,s,n){function t(a,l){switch(a.type){case Rs:case Bo:a.colorSpace=Vn,a.minFilter=Ro,a.magFilter=Ro,a.generateMipmaps=!1,a.flipY=!0;break}o&&o(a,l)}return super.load(e,t,s,n)}};var Sr=new Me(12563354),Cr=new A,Pr=new A,Gr=new A,zr=new A,kr=new Me,Ir=new Me,Ar=new so,Dr=new _t;var Bs=class{constructor(e){this.world=e}_loadHDRI(){this._hdriLoading||this._hdriEnvMap||(this._hdriLoading=!0,new Ds().load("images/textures/meadow_2k.hdr",e=>{if(this._hdriLoading=!1,this.world._disposed||!this.world.lighting.pmrem){e.dispose();return}this._hdriTarget=this.world.lighting.pmrem.fromEquirectangular(e),this._hdriEnvMap=this._hdriTarget.texture,e.dispose(),this.world.lighting._updateEnvironment()},void 0,()=>{this._hdriLoading=!1}))}_pawTexture(){let e=document.createElement("canvas");e.width=e.height=256;let o=e.getContext("2d"),s=(n,t,a,l)=>{let u=Math.max(a,l),f=o.createRadialGradient(n,t,0,n,t,u);f.addColorStop(0,"rgba(255, 255, 255, 0.95)"),f.addColorStop(.55,"rgba(255, 240, 180, 0.70)"),f.addColorStop(.85,"rgba(255, 220, 120, 0.25)"),f.addColorStop(1,"rgba(255, 200, 80, 0.0)"),o.fillStyle=f,o.save(),o.translate(n,t),o.scale(a/u,l/u),o.beginPath(),o.arc(0,0,u,0,Math.PI*2),o.fill(),o.restore()};return s(128,164,52,44),s(68,92,22,28),s(116,68,22,28),s(164,72,22,28),s(204,100,20,26),new Kt(e)}_flareTexture(e,o){let s=document.createElement("canvas");s.width=s.height=128;let n=s.getContext("2d"),t=n.createRadialGradient(64,64,0,64,64,64);return t.addColorStop(0,e),t.addColorStop(.35,o),t.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=t,n.fillRect(0,0,128,128),new Kt(s)}_buildGlowTexture(){let e=document.createElement("canvas");e.width=e.height=128;let o=e.getContext("2d"),s=o.createRadialGradient(64,64,0,64,64,64);s.addColorStop(0,"rgba(255, 235, 180, 1.0)"),s.addColorStop(.2,"rgba(255, 200, 100, 0.65)"),s.addColorStop(.5,"rgba(255, 160, 50, 0.20)"),s.addColorStop(1,"rgba(255, 120, 20, 0)"),o.fillStyle=s,o.fillRect(0,0,128,128);let n=new Kt(e);return n.generateMipmaps=!1,n.minFilter=Ro,n}};var cs=class ye extends r{constructor(){let e=ye.SkyShader,o=new Mt({name:e.name,uniforms:Yn.clone(e.uniforms),vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,side:Fn,depthWrite:!1});super(new ce(1,1,1),o),this.isSky=!0}};cs.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new A},up:{value:new A(0,1,0)}},vertexShader:`
		uniform vec3 sunPosition;
		uniform float rayleigh;
		uniform float turbidity;
		uniform float mieCoefficient;
		uniform vec3 up;

		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		// constants for atmospheric scattering
		const float e = 2.71828182845904523536028747135266249775724709369995957;
		const float pi = 3.141592653589793238462643383279502884197169;

		// wavelength of used primaries, according to preetham
		const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
		// this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
		// (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
		const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

		// mie stuff
		// K coefficient for the primaries
		const float v = 4.0;
		const vec3 K = vec3( 0.686, 0.678, 0.666 );
		// MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
		const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

		// earth shadow hack
		// cutoffAngle = pi / 1.95;
		const float cutoffAngle = 1.6110731556870734;
		const float steepness = 1.5;
		const float EE = 1000.0;

		float sunIntensity( float zenithAngleCos ) {
			zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
			return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
		}

		vec3 totalMie( float T ) {
			float c = ( 0.2 * T ) * 10E-18;
			return 0.434 * c * MieConst;
		}

		void main() {

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vWorldPosition = worldPosition.xyz;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			gl_Position.z = gl_Position.w; // set z to camera.far

			vSunDirection = normalize( sunPosition );

			vSunE = sunIntensity( dot( vSunDirection, up ) );

			vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

			float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

			// extinction (absorbtion + out scattering)
			// rayleigh coefficients
			vBetaR = totalRayleigh * rayleighCoefficient;

			// mie coefficients
			vBetaM = totalMie( turbidity ) * mieCoefficient;

		}`,fragmentShader:`
		varying vec3 vWorldPosition;
		varying vec3 vSunDirection;
		varying float vSunfade;
		varying vec3 vBetaR;
		varying vec3 vBetaM;
		varying float vSunE;

		uniform float mieDirectionalG;
		uniform vec3 up;

		// constants for atmospheric scattering
		const float pi = 3.141592653589793238462643383279502884197169;

		const float n = 1.0003; // refractive index of air
		const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

		// optical length at zenith for molecules
		const float rayleighZenithLength = 8.4E3;
		const float mieZenithLength = 1.25E3;
		// 66 arc seconds -> degrees, and the cosine of that
		const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

		// 3.0 / ( 16.0 * pi )
		const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
		// 1.0 / ( 4.0 * pi )
		const float ONE_OVER_FOURPI = 0.07957747154594767;

		float rayleighPhase( float cosTheta ) {
			return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
		}

		float hgPhase( float cosTheta, float g ) {
			float g2 = pow( g, 2.0 );
			float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
			return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
		}

		void main() {

			vec3 direction = normalize( vWorldPosition - cameraPosition );

			// optical length
			// cutoff angle at 90 to avoid singularity in next formula.
			float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
			float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
			float sR = rayleighZenithLength * inverse;
			float sM = mieZenithLength * inverse;

			// combined extinction factor
			vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

			// in scattering
			float cosTheta = dot( direction, vSunDirection );

			float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
			vec3 betaRTheta = vBetaR * rPhase;

			float mPhase = hgPhase( cosTheta, mieDirectionalG );
			vec3 betaMTheta = vBetaM * mPhase;

			vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
			Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

			// nightsky
			float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
			float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
			vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
			vec3 L0 = vec3( 0.1 ) * Fex;

			// composition + solar disc
			float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
			L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

			vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

			vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

			gl_FragColor = vec4( retColor, 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};var ls=class ye extends r{constructor(){super(ye.Geometry,new Ct({opacity:0,transparent:!0})),this.isLensflare=!0,this.type="Lensflare",this.frustumCulled=!1,this.renderOrder=1/0;let e=new A,o=new A,s=new Ks(16,16),n=new Ks(16,16),t=Ys,a=ye.Geometry,l=new Ps({uniforms:{scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;

				void main() {

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				void main() {

					gl_FragColor = vec4( 1.0, 0.0, 1.0, 1.0 );

				}`,depthTest:!0,depthWrite:!1,transparent:!1}),u=new Ps({uniforms:{map:{value:s},scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;
				attribute vec2 uv;

				varying vec2 vUV;

				void main() {

					vUV = uv;

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				uniform sampler2D map;

				varying vec2 vUV;

				void main() {

					gl_FragColor = texture2D( map, vUV );

				}`,depthTest:!1,depthWrite:!1,transparent:!1}),f=new r(a,l),c=[],p=Lo.Shader,w=new Ps({name:p.name,uniforms:{map:{value:null},occlusionMap:{value:n},color:{value:new Me(16777215)},scale:{value:new kt},screenPosition:{value:new A}},vertexShader:p.vertexShader,fragmentShader:p.fragmentShader,blending:Ht,transparent:!0,depthWrite:!1}),b=new r(a,w);this.addElement=function(M){c.push(M)};let x=new kt,V=new kt,y=new ca,H=new Un;this.onBeforeRender=function(M,L,T){M.getCurrentViewport(H);let N=M.getRenderTarget(),q=N!==null?N.texture.type:Ys;t!==q&&(s.dispose(),n.dispose(),s.type=n.type=q,t=q);let $=H.w/H.z,Y=H.z/2,k=H.w/2,h=16/H.w;if(x.set(h*$,h),y.min.set(H.x,H.y),y.max.set(H.x+(H.z-16),H.y+(H.w-16)),o.setFromMatrixPosition(this.matrixWorld),o.applyMatrix4(T.matrixWorldInverse),!(o.z>0)&&(e.copy(o).applyMatrix4(T.projectionMatrix),V.x=H.x+e.x*Y+Y-8,V.y=H.y+e.y*k+k-8,y.containsPoint(V))){M.copyFramebufferToTexture(s,V);let v=l.uniforms;v.scale.value=x,v.screenPosition.value=e,M.renderBufferDirect(T,null,a,l,f,null),M.copyFramebufferToTexture(n,V),v=u.uniforms,v.scale.value=x,v.screenPosition.value=e,M.renderBufferDirect(T,null,a,u,f,null);let _=-e.x*2,g=-e.y*2;for(let i=0,S=c.length;i<S;i++){let C=c[i],O=w.uniforms;O.color.value.copy(C.color),O.map.value=C.texture,O.screenPosition.value.x=e.x+_*C.distance,O.screenPosition.value.y=e.y+g*C.distance,h=C.size/H.w;let te=H.w/H.z;O.scale.value.set(h*te,h),w.uniformsNeedUpdate=!0,M.renderBufferDirect(T,null,a,w,b,null)}}},this.dispose=function(){l.dispose(),u.dispose(),w.dispose(),s.dispose(),n.dispose();for(let M=0,L=c.length;M<L;M++)c[M].texture.dispose()}}},Lo=class{constructor(e,o=1,s=0,n=new Me(16777215)){this.texture=e,this.size=o,this.distance=s,this.color=n}};Lo.Shader={name:"LensflareElementShader",uniforms:{map:{value:null},occlusionMap:{value:null},color:{value:null},scale:{value:null},screenPosition:{value:null}},vertexShader:`

		precision highp float;

		uniform vec3 screenPosition;
		uniform vec2 scale;

		uniform sampler2D occlusionMap;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vUV = uv;

			vec2 pos = position.xy;

			vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );

			vVisibility =        visibility.r / 9.0;
			vVisibility *= 1.0 - visibility.g / 9.0;
			vVisibility *=       visibility.b / 9.0;

			gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D map;
		uniform vec3 color;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vec4 texture = texture2D( map, vUV );
			texture.a *= vVisibility;
			gl_FragColor = texture;
			gl_FragColor.rgb *= color;

		}`};ls.Geometry=(function(){let ye=new Et,e=new Float32Array([-1,-1,0,0,0,1,-1,0,1,0,1,1,0,1,1,-1,1,0,0,1]),o=new js(e,5);return ye.setIndex([0,1,2,0,2,3]),ye.setAttribute("position",new _s(o,3,0,!1)),ye.setAttribute("uv",new _s(o,2,3,!1)),ye})();var wa={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new kt(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		// FXAA algorithm from NVIDIA, C# implementation by Jasper Flick, GLSL port by Dave Hoskins
		// http://developer.download.nvidia.com/assets/gamedev/files/sdk/11/FXAA_WhitePaper.pdf
		// https://catlikecoding.com/unity/tutorials/advanced-rendering/fxaa/

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;
			
			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {
				
				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );
			
		}`};var Qs=new _t,hs=class ye{constructor(e){e=e||{},this.zNear=e.webGL===!0?-1:0,this.vertices={near:[new A,new A,new A,new A],far:[new A,new A,new A,new A]},e.projectionMatrix!==void 0&&this.setFromProjectionMatrix(e.projectionMatrix,e.maxFar||1e4)}setFromProjectionMatrix(e,o){let s=this.zNear,n=e.elements[11]===0;return Qs.copy(e).invert(),this.vertices.near[0].set(1,1,s),this.vertices.near[1].set(1,-1,s),this.vertices.near[2].set(-1,-1,s),this.vertices.near[3].set(-1,1,s),this.vertices.near.forEach(function(t){t.applyMatrix4(Qs)}),this.vertices.far[0].set(1,1,1),this.vertices.far[1].set(1,-1,1),this.vertices.far[2].set(-1,-1,1),this.vertices.far[3].set(-1,1,1),this.vertices.far.forEach(function(t){t.applyMatrix4(Qs);let a=Math.abs(t.z);n?t.z*=Math.min(o/a,1):t.multiplyScalar(Math.min(o/a,1))}),this.vertices}split(e,o){for(;e.length>o.length;)o.push(new ye);o.length=e.length;for(let s=0;s<e.length;s++){let n=o[s];if(s===0)for(let t=0;t<4;t++)n.vertices.near[t].copy(this.vertices.near[t]);else for(let t=0;t<4;t++)n.vertices.near[t].lerpVectors(this.vertices.near[t],this.vertices.far[t],e[s-1]);if(s===e.length-1)for(let t=0;t<4;t++)n.vertices.far[t].copy(this.vertices.far[t]);else for(let t=0;t<4;t++)n.vertices.far[t].lerpVectors(this.vertices.near[t],this.vertices.far[t],e[s])}}toSpace(e,o){for(let s=0;s<4;s++)o.vertices.near[s].copy(this.vertices.near[s]).applyMatrix4(e),o.vertices.far[s].copy(this.vertices.far[s]).applyMatrix4(e)}};var en={lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );

vec3 geometryClearcoatNormal = vec3( 0.0 );

#ifdef USE_CLEARCOAT

	geometryClearcoatNormal = clearcoatNormal;

#endif

#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		// Iridescence F0 approximation
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif

IncidentLight directLight;

#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )

	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

		pointLight = pointLights[ i ];

		getPointLightInfo( pointLight, geometryPosition, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )

	SpotLight spotLight;
 	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;

	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

		spotLight = spotLights[ i ];

		getSpotLightInfo( spotLight, geometryPosition, directLight );

  		// spot lights are ordered [shadows with maps, shadows without maps, maps without shadows, none]
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;

		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && defined( USE_CSM ) && defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	float linearDepth = (vViewPosition.z) / (shadowFar - cameraNear);
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#if defined( USE_SHADOWMAP ) && defined( CSM_FADE )
		vec2 cascade;
		float cascadeCenter;
		float closestEdge;
		float margin;
		float csmx;
		float csmy;

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
				// NOTE: Depth gets larger away from the camera.
				// cascade.x is closer, cascade.y is further
				cascade = CSM_cascades[ i ];
				cascadeCenter = ( cascade.x + cascade.y ) / 2.0;
				closestEdge = linearDepth < cascadeCenter ? cascade.x : cascade.y;
				margin = 0.25 * pow( closestEdge, 2.0 );
				csmx = cascade.x - margin / 2.0;
				csmy = cascade.y + margin / 2.0;
				if( linearDepth >= csmx && ( linearDepth < csmy || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 ) ) {

					float dist = min( linearDepth - csmx, csmy - linearDepth );
					float ratio = clamp( dist / margin, 0.0, 1.0 );

					vec3 prevColor = directLight.color;
					directionalLightShadow = directionalLightShadows[ i ];
					directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

					bool shouldFadeLastCascade = UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth > cascadeCenter;
					directLight.color = mix( prevColor, directLight.color, shouldFadeLastCascade ? ratio : 1.0 );

					ReflectedLight prevLight = reflectedLight;
					RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

					bool shouldBlend = UNROLLED_LOOP_INDEX != CSM_CASCADES - 1 || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1 && linearDepth < cascadeCenter;
					float blendRatio = shouldBlend ? ratio : 1.0;

					reflectedLight.directDiffuse = mix( prevLight.directDiffuse, reflectedLight.directDiffuse, blendRatio );
					reflectedLight.directSpecular = mix( prevLight.directSpecular, reflectedLight.directSpecular, blendRatio );
					reflectedLight.indirectDiffuse = mix( prevLight.indirectDiffuse, reflectedLight.indirectDiffuse, blendRatio );
					reflectedLight.indirectSpecular = mix( prevLight.indirectSpecular, reflectedLight.indirectSpecular, blendRatio );

				}
			#endif

		}
		#pragma unroll_loop_end
	#elif defined (USE_SHADOWMAP)

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];
			getDirectionalLightInfo( directionalLight, directLight );

			#if ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )

				directionalLightShadow = directionalLightShadows[ i ];
				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y) directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

				if(linearDepth >= CSM_cascades[UNROLLED_LOOP_INDEX].x && (linearDepth < CSM_cascades[UNROLLED_LOOP_INDEX].y || UNROLLED_LOOP_INDEX == CSM_CASCADES - 1)) RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

			#endif

		}
		#pragma unroll_loop_end

	#elif ( NUM_DIR_LIGHT_SHADOWS > 0 )
		// note: no loop here - all CSM lights are in fact one light only
		getDirectionalLightInfo( directionalLights[0], directLight );
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	#endif

	#if ( NUM_DIR_LIGHTS > NUM_DIR_LIGHT_SHADOWS)
		// compute the lights not casting shadows (if any)

		#pragma unroll_loop_start
		for ( int i = NUM_DIR_LIGHT_SHADOWS; i < NUM_DIR_LIGHTS; i ++ ) {

			directionalLight = directionalLights[ i ];

			getDirectionalLightInfo( directionalLight, directLight );

			RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

		}
		#pragma unroll_loop_end

	#endif

#endif


#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct ) && !defined( USE_CSM ) && !defined( CSM_CASCADES )

	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

		directionalLight = directionalLights[ i ];

		getDirectionalLightInfo( directionalLight, directLight );

		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif

		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )

	RectAreaLight rectAreaLight;

	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {

		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );

	}
	#pragma unroll_loop_end

#endif

#if defined( RE_IndirectDiffuse )

	vec3 iblIrradiance = vec3( 0.0 );

	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );

	#if defined( USE_LIGHT_PROBES )

		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );

	#endif

	#if ( NUM_HEMI_LIGHTS > 0 )

		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );

		}
		#pragma unroll_loop_end

	#endif

#endif

#if defined( RE_IndirectSpecular )

	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );

#endif
`,lights_pars_begin:`
#if defined( USE_CSM ) && defined( CSM_CASCADES )
uniform vec2 CSM_cascades[CSM_CASCADES];
uniform float cameraNear;
uniform float shadowFar;
#endif
	`+ns.lights_pars_begin};var ga=new _t,tn=new hs({webGL:!0}),Co=new A,ds=new os,on=[],sn=[],nn=new _t,va=new _t,Za=new A(0,1,0),jo=class{constructor(e){this.camera=e.camera,this.parent=e.parent,this.cascades=e.cascades||3,this.maxFar=e.maxFar||1e5,this.mode=e.mode||"practical",this.shadowMapSize=e.shadowMapSize||2048,this.shadowBias=e.shadowBias||1e-6,this.lightDirection=e.lightDirection||new A(1,-1,1).normalize(),this.lightIntensity=e.lightIntensity||3,this.lightNear=e.lightNear||1,this.lightFar=e.lightFar||2e3,this.lightMargin=e.lightMargin||200,this.customSplitsCallback=e.customSplitsCallback,this.fade=!1,this.mainFrustum=new hs({webGL:!0}),this.frustums=[],this.breaks=[],this.lights=[],this.shaders=new Map,this.createLights(),this.updateFrustums(),this.injectInclude()}createLights(){for(let e=0;e<this.cascades;e++){let o=new Gs(16777215,this.lightIntensity);o.castShadow=!0,o.shadow.mapSize.width=this.shadowMapSize,o.shadow.mapSize.height=this.shadowMapSize,o.shadow.camera.near=this.lightNear,o.shadow.camera.far=this.lightFar,o.shadow.bias=this.shadowBias,this.parent.add(o),this.parent.add(o.target),this.lights.push(o)}}initCascades(){let e=this.camera;e.updateProjectionMatrix(),this.mainFrustum.setFromProjectionMatrix(e.projectionMatrix,this.maxFar),this.mainFrustum.split(this.breaks,this.frustums)}updateShadowBounds(){let e=this.frustums;for(let o=0;o<e.length;o++){let n=this.lights[o].shadow.camera,t=this.frustums[o],a=t.vertices.near,l=t.vertices.far,u=l[0],f;u.distanceTo(l[2])>u.distanceTo(a[2])?f=l[2]:f=a[2];let c=u.distanceTo(f);if(this.fade){let p=this.camera,w=Math.max(p.far,this.maxFar),b=t.vertices.far[0].z/(w-p.near),x=.25*Math.pow(b,2)*(w-p.near);c+=x}n.left=-c/2,n.right=c/2,n.top=c/2,n.bottom=-c/2,n.updateProjectionMatrix()}}getBreaks(){let e=this.camera,o=Math.min(e.far,this.maxFar);switch(this.breaks.length=0,this.mode){case"uniform":s(this.cascades,e.near,o,this.breaks);break;case"logarithmic":n(this.cascades,e.near,o,this.breaks);break;case"practical":t(this.cascades,e.near,o,.5,this.breaks);break;case"custom":this.customSplitsCallback===void 0&&console.error("CSM: Custom split scheme callback not defined."),this.customSplitsCallback(this.cascades,e.near,o,this.breaks);break}function s(a,l,u,f){for(let c=1;c<a;c++)f.push((l+(u-l)*c/a)/u);f.push(1)}function n(a,l,u,f){for(let c=1;c<a;c++)f.push(l*(u/l)**(c/a)/u);f.push(1)}function t(a,l,u,f,c){on.length=0,sn.length=0,n(a,l,u,sn),s(a,l,u,on);for(let p=1;p<a;p++)c.push(ts.lerp(on[p-1],sn[p-1],f));c.push(1)}}update(){let e=this.camera,o=this.frustums;nn.lookAt(new A,this.lightDirection,Za),va.copy(nn).invert();for(let s=0;s<o.length;s++){let n=this.lights[s],t=n.shadow.camera,a=(t.right-t.left)/this.shadowMapSize,l=(t.top-t.bottom)/this.shadowMapSize;ga.multiplyMatrices(va,e.matrixWorld),o[s].toSpace(ga,tn);let u=tn.vertices.near,f=tn.vertices.far;ds.makeEmpty();for(let c=0;c<4;c++)ds.expandByPoint(u[c]),ds.expandByPoint(f[c]);ds.getCenter(Co),Co.z=ds.max.z+this.lightMargin,Co.x=Math.floor(Co.x/a)*a,Co.y=Math.floor(Co.y/l)*l,Co.applyMatrix4(nn),n.position.copy(Co),n.target.position.copy(Co),n.target.position.x+=this.lightDirection.x,n.target.position.y+=this.lightDirection.y,n.target.position.z+=this.lightDirection.z}}injectInclude(){ns.lights_fragment_begin=en.lights_fragment_begin,ns.lights_pars_begin=en.lights_pars_begin}setupMaterial(e){e.defines=e.defines||{},e.defines.USE_CSM=1,e.defines.CSM_CASCADES=this.cascades,this.fade&&(e.defines.CSM_FADE="");let o=[],s=this,n=this.shaders;e.onBeforeCompile=function(t){let a=Math.min(s.camera.far,s.maxFar);s.getExtendedBreaks(o),t.uniforms.CSM_cascades={value:o},t.uniforms.cameraNear={value:s.camera.near},t.uniforms.shadowFar={value:a},n.set(e,t)},n.set(e,null)}updateUniforms(){let e=Math.min(this.camera.far,this.maxFar);this.shaders.forEach(function(s,n){if(s!==null){let t=s.uniforms;this.getExtendedBreaks(t.CSM_cascades.value),t.cameraNear.value=this.camera.near,t.shadowFar.value=e}!this.fade&&"CSM_FADE"in n.defines?(delete n.defines.CSM_FADE,n.needsUpdate=!0):this.fade&&!("CSM_FADE"in n.defines)&&(n.defines.CSM_FADE="",n.needsUpdate=!0)},this)}getExtendedBreaks(e){for(;e.length<this.breaks.length;)e.push(new kt);e.length=this.breaks.length;for(let o=0;o<this.cascades;o++){let s=this.breaks[o],n=this.breaks[o-1]||0;e[o].x=n,e[o].y=s}}updateFrustums(){this.getBreaks(),this.initCascades(),this.updateShadowBounds(),this.updateUniforms()}remove(){for(let e=0;e<this.lights.length;e++)this.parent.remove(this.lights[e].target),this.parent.remove(this.lights[e])}dispose(){let e=this.shaders;e.forEach(function(o,s){delete s.onBeforeCompile,delete s.defines.USE_CSM,delete s.defines.CSM_CASCADES,delete s.defines.CSM_FADE,o!==null&&(delete o.uniforms.CSM_cascades,delete o.uniforms.cameraNear,delete o.uniforms.shadowFar),s.needsUpdate=!0}),e.clear()}};var qa=jo.prototype.setupMaterial;jo.prototype.setupMaterial=function(ye){if(ye.userData.csmSetupDone)return;ye.userData.csmSetupDone=!0;let e=ye.onBeforeCompile;qa.call(this,ye);let o=ye.onBeforeCompile;e&&e!==o&&(ye.onBeforeCompile=function(s,n){e.call(this,s,n),o.call(this,s,n)})};var hi=new Me(12563354),di=new A,ui=new A,fi=new A,pi=new A,mi=new Me,Ei=new Me,wi=new so,gi=new _t;var Ls=class{constructor(e){this.world=e}_lights(){this.hemi=new oa(11849441,5261370,.35),this.world.scene.add(this.hemi),this.lightProbe=new aa,this.world.scene.add(this.lightProbe);let e=new Gs(16774364,3.6);e.position.set(-800,950,600),e.castShadow=!1;let o=typeof window<"u"&&(/Mobi|Android/i.test(navigator.userAgent)||window.innerWidth<=768);this.csm=new jo({shadowBias:-1e-4,maxFar:1800,cascades:this.world.quality.cascades,mode:"practical",parent:this.world.scene,shadowMapSize:this.world.quality.shadowSize,lightDirection:new A(800,-950,-600).normalize(),camera:this.world.camera,lightIntensity:3.6,lightNear:1,lightFar:6e3,lightMargin:200,customSplitsCallback:function(s,n,t){let a=[];return s===2?a.push(t,t+(n-t)*.25,n):a.push(t,t+(n-t)*.05,t+(n-t)*.15,t+(n-t)*.4,n),a}}),this.csm.fade=!1,this.csm.lights.forEach((s,n)=>{s.shadow.bias=o?-.001:-5e-4-n*2e-4,s.shadow.normalBias=.015+n*.01,s.shadow.radius=1.5}),this.world.scene.add(e),this.sun=e}_sky(){this.sky=new cs,this.sky.scale.setScalar(45e4),this.sky.frustumCulled=!1,this.world.scene.add(this.sky);let e=this.sky.material.uniforms;e.turbidity.value=4,e.rayleigh.value=1.35,e.mieCoefficient.value=.005,e.mieDirectionalG.value=.8,this.pmrem=new qn(this.world.renderer),this._envScene=new Hs,this._envSky=this.sky.clone(),this._envScene.add(this._envSky),this._buildLensflare()}_updateLighting(e,o){let s=e||this._forcedPhase||Zo(),n=typeof s=="string"?s:s?.key||"sunlit",t=n==="day"?"sunlit":n,a=o||Do[this.mood]||(t==="blessing"?Do.blessing:Do.clear),l={dawn:8,sunlit:36.5,day:36.5,dusk:6,night:40,blessing:35},u={dawn:85,sunlit:298,day:298,dusk:275,night:45,blessing:290},f=l[t]??43.5,c=u[t]??307,p=ts.degToRad(90-f),w=ts.degToRad(c),b=new A().setFromSphericalCoords(1,p,w);this._sunDir=b;let x={dawn:{zenith:1583698,horizon:15902852,ground:2634788,sunCol:16769210,sunInt:2.8},sunlit:{zenith:4685475,horizon:12241876,ground:3688488,sunCol:16774621,sunInt:3.6},day:{zenith:4685475,horizon:12241876,ground:3688488,sunCol:16774621,sunInt:3.6},dusk:{zenith:1186878,horizon:15364662,ground:3022358,sunCol:16746556,sunInt:2.8},night:{zenith:265246,horizon:1188932,ground:660498,sunCol:13954303,sunInt:1.4},blessing:{zenith:1586268,horizon:14207216,ground:3427372,sunCol:16775912,sunInt:3.4}},V=x[t]||x.sunlit;if(this.sky?.material?.uniforms){let M=this.sky.material.uniforms;M.sunPosition&&M.sunPosition.value.copy(b),M.uSunPosition&&M.uSunPosition.value.copy(b),M.uZenithColor&&M.uZenithColor.value.setHex(V.zenith),M.uHorizonColor&&M.uHorizonColor.value.setHex(V.horizon),M.uGroundColor&&M.uGroundColor.value.setHex(V.ground),M.uSunColor&&M.uSunColor.value.setHex(V.sunCol),M.uSunIntensity&&(M.uSunIntensity.value=V.sunInt)}let y={dawn:{exposure:1,sun:1.85,env:.7,hemi:1.15,sunCol:16769210,hemiSky:6969456,hemiGnd:3156e3,fogCol:12095620,fogDensity:75e-6,fogNear:1e3,fogFar:15e3,stars:0,clouds:16048084,water:1852502,bloom:.18,rainbow:.5,lanternGlow:.8},sunlit:{exposure:1.05,sun:2.4,env:.75,hemi:.42,sunCol:16774621,hemiSky:5273760,hemiGnd:3688488,fogCol:9484504,fogDensity:65e-6,fogNear:1200,fogFar:18e3,stars:0,clouds:16777215,water:1595508,bloom:.1,rainbow:.45,lanternGlow:.5},day:{exposure:1.05,sun:2.4,env:.75,hemi:.42,sunCol:16774621,hemiSky:5273760,hemiGnd:3688488,fogCol:9484504,fogDensity:65e-6,fogNear:1200,fogFar:18e3,stars:0,clouds:16777215,water:1595508,bloom:.1,rainbow:.45,lanternGlow:.5},dusk:{exposure:1,sun:1.85,env:.6,hemi:1.15,sunCol:16746556,hemiSky:6834248,hemiGnd:3022874,fogCol:11036756,fogDensity:75e-6,fogNear:900,fogFar:14e3,stars:.25,clouds:16492160,water:2111560,bloom:.22,rainbow:.65,lanternGlow:1.4},night:{exposure:1.18,sun:.65,env:.15,hemi:.7,sunCol:13954303,hemiSky:1846334,hemiGnd:1054740,fogCol:1319478,fogDensity:55e-6,fogNear:800,fogFar:12e3,stars:1,clouds:4348028,water:1322568,bloom:.2,rainbow:.75,lanternGlow:2.4},blessing:{exposure:1.08,sun:2,env:.85,hemi:1.35,sunCol:16775912,hemiSky:7110312,hemiGnd:3427372,fogCol:11453148,fogDensity:1e-4,fogNear:600,fogFar:9e3,stars:.15,clouds:16312564,water:1728632,bloom:.16,rainbow:1,lanternGlow:1.2}},H=y[t]||y.sunlit;if(this.bloomPass&&(this.bloomPass.strength=H.bloom),this.world.scene.background=null,this.csm&&(this.csm.lightDirection.copy(b).negate(),this.csm.lights.forEach(M=>{M.color.setHex(H.sunCol),M.intensity=H.sun*(a.light||1)})),this.sun&&(t==="sunlit"||t==="day"?this.sun.position.set(-800,950,600):this.sun.position.copy(b).multiplyScalar(3e3),this.sun.color.setHex(H.sunCol),this.sun.intensity=0),this.hemi&&(this.hemi.color.setHex(H.hemiSky),this.hemi.groundColor.setHex(H.hemiGnd),this.hemi.intensity=H.hemi),this.world.terrain._terrainShaders&&this.world.terrain._terrainShaders.forEach(M=>{M.uniforms?.uSunDir&&M.uniforms.uSunDir.value.copy(b)}),this.world._bgMountainShader?.uniforms?.uSunDir&&this.world._bgMountainShader.uniforms.uSunDir.value.copy(b),this.world._windMaterials)for(let M=0,L=this.world._windMaterials.length;M<L;M++){let T=this.world._windMaterials[M];T.userData?.botanicalShader?.uniforms?.uLightDir&&T.userData.botanicalShader.uniforms.uLightDir.value.copy(b),T.userData?.windShader?.uniforms?.uLightDir&&T.userData.windShader.uniforms.uLightDir.value.copy(b)}if(this.world.scene.fog)if(this.world.scene.fog.color.setHex(H.fogCol),this.world.scene.fog.isFogExp2){let M={clear:1,soft:1.3,blessing:1.8,crystal:1.15}[this.mood]??1;this.world.scene.fog.density=H.fogDensity*M}else this.world.scene.fog.isFog&&(this.world.scene.fog.near=H.fogNear,this.world.scene.fog.far=H.fogFar);return this.world.renderer.toneMappingExposure=H.exposure*((a.light||1)*.08+.92),this._envIntensity=H.env,this._updateEnvironment(),this.world.renderer.shadowMap.needsUpdate=!0,{sunDir:b,LOOK:H,LOOKS:y,SKY_PALETTE:V,SKY_PALETTES:x,phaseKey:t}}_composer(){if(this.composer||!this.world.quality.post)return;let e=this.world.canvas.clientWidth||window.innerWidth,o=this.world.canvas.clientHeight||window.innerHeight,s=new On(e,o,{type:Bo}),n=new ua(this.world.renderer,s);n.setPixelRatio(this.world.renderer.getPixelRatio()),n.addPass(new fa(this.world.scene,this.world.camera));let t=new pa(new kt(e/2,o/2),.1,.35,1.15);n.addPass(t),this.bloomPass=t,n.addPass(new ma),this._fxaaPass=new da(wa),n.addPass(this._fxaaPass),this.composer=n}_stars(){let o=new Float32Array(5400),s=new Float32Array(1800*3),n=new Float32Array(1800),t=yt(42),a=new Me;for(let u=0;u<1800;u++){let f=t()*Math.PI*2,c=Math.acos(t()*.95),p=8e3;o[u*3]=Math.cos(f)*Math.sin(c)*p,o[u*3+1]=Math.cos(c)*p+100,o[u*3+2]=Math.sin(f)*Math.sin(c)*p;let w=t();a.setHSL(.08+t()*.55,.35*t(),.72+w*.28),s[u*3]=a.r,s[u*3+1]=a.g,s[u*3+2]=a.b,n[u]=(.35+Math.pow(t(),5)*1.9)*46}let l=new Et;l.setAttribute("position",new tt(o,3)),l.setAttribute("color",new tt(s,3)),l.setAttribute("size",new tt(n,1)),l.computeBoundingSphere(),this.starMat=new Mt({transparent:!0,depthWrite:!1,fog:!1,blending:Ht,uniforms:{uTex:{value:this._starSprite()},uOpacity:{value:0},uTime:{value:0}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        attribute float size;
        varying vec3 vColor; varying float vTw;
        uniform float uTime;
        void main(){
          vColor = color;
          vTw = 0.75 + 0.25 * sin(uTime * 1.4 + position.x * 0.01 + position.z * 0.013);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }`,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform sampler2D uTex; uniform float uOpacity;
        varying vec3 vColor; varying float vTw;
        void main(){
          vec4 t = texture2D(uTex, gl_PointCoord);
          gl_FragColor = vec4(vColor, t.a * uOpacity * vTw);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }`,vertexColors:!0}),this.stars=new co(l,this.starMat),this.stars.visible=!1,this.stars.frustumCulled=!1,this.world.scene.add(this.stars)}_starSprite(){let e=document.createElement("canvas");e.width=e.height=64;let o=e.getContext("2d"),s=o.createRadialGradient(32,32,0,32,32,32);s.addColorStop(0,"rgba(255,255,255,1)"),s.addColorStop(.22,"rgba(255,255,255,0.55)"),s.addColorStop(1,"rgba(255,255,255,0)"),o.fillStyle=s,o.fillRect(0,0,64,64);let n=new Kt(e);return n.generateMipmaps=!1,n.minFilter=Ro,n}_horizon(){let e=new bo(5100,24e3,96,24);e.rotateX(-Math.PI/2),e.translate(0,0,500);let o=e.attributes.position;for(let t=0;t<o.count;t++){let a=o.getX(t),l=o.getZ(t),u=Math.hypot(a,l-500);if(l>800)o.setY(t,.2);else{let f=Math.max(0,Math.min(1,(u-5100)/9e3)),c=(jt(a*35e-5+15,l*35e-5+15,3)-.4)*160;o.setY(t,Math.max(0,c*(1-f)))}}e.computeVertexNormals();let s=new Ot({color:10536158,roughness:.95,metalness:.05,fog:!0});this.horizonMat=s;let n=new r(e,s);n.receiveShadow=!1,this.world.scene.add(n)}_godRays(){let e=new qe,o=new Mt({uniforms:{uTime:{value:0},uColor:{value:new Me(16775904)},uIntensity:{value:.05}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        varying vec2 vUv;
        varying vec3 vCustomWorldNormal;
        varying vec3 vToEye;
        void main() {
          vUv = uv;
          vec4 wPos = modelMatrix * vec4(position, 1.0);
          vCustomWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vToEye = normalize(cameraPosition - wPos.xyz + vec3(0.0001));
          gl_Position = projectionMatrix * viewMatrix * wPos;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uIntensity;
        varying vec2 vUv;
        varying vec3 vCustomWorldNormal;
        varying vec3 vToEye;

        void main() {
          float viewAngle = max(0.0, dot(vCustomWorldNormal, vToEye));
          float edgeFalloff = pow(1.0 - abs(viewAngle), 3.0);
          float verticalFade = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.60, vUv.y);
          float shimmer = sin(vUv.y * 12.0 - uTime * 0.8) * 0.08;
          float alpha = (edgeFalloff + shimmer) * verticalFade * uIntensity;
          gl_FragColor = vec4(uColor, alpha);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,transparent:!0,depthWrite:!1,blending:Ht,side:gt});this._godRayMat=o;let s=new F(18,140,420,16,1,!0);s.translate(0,-210,0);let n=new r(s,o);n.position.set(0,240,-420),n.rotation.set(.18,0,-.12),e.add(n);let t=new F(80,220,350,16,1,!0);t.translate(0,-175,0);let a=new r(t,o);a.position.set(-20,280,-760),a.rotation.set(.1,0,0),e.add(a),this.world.scene.add(e)}_updateEnvironment(){let e=this._forcedPhase?.key||"day";if(this.world.assetLoader._hdriEnvMap&&["day","sunlit","blessing"].includes(e)){this.world.scene.environment=this.world.assetLoader._hdriEnvMap,this.world.scene.environmentIntensity=this._envIntensity??.75;return}if(!this.pmrem||!this._envScene)return;let o=`${e}:${this.mood}`;(o!==this._environmentKey||!this._envRT)&&(this._environmentKey=o,this._envRT?.dispose(),this._envRT=this.pmrem.fromScene(this._envScene,.03)),this.world.scene.environment=this._envRT.texture,this.world.scene.environmentIntensity=this._envIntensity??.75}applyAmbience(){if(this.world._disposed)return;let e=this._forcedPhase||Zo(),o=typeof e=="string"?e:e?.key||"sunlit",s=o==="day"?"sunlit":o,n=es[s]||es[o]||es.sunlit||es.day,t=Do[this.mood]||(s==="blessing"?Do.blessing:Do.clear),{sunDir:a,LOOK:l}=this._updateLighting(e,t);if(this.world.scene.fog)if(this.world.scene.fog.color.setHex(l.fogCol),this.world.scene.fog.isFogExp2){let f={clear:1,soft:1.3,blessing:1.8,crystal:1.15}[this.mood]??1;this.world.scene.fog.density=l.fogDensity*f}else this.world.scene.fog.isFog&&(this.world.scene.fog.near=l.fogNear,this.world.scene.fog.far=l.fogFar);if(this.sky?.material&&(this.sky.material.fog=!1),this.stars.visible=l.stars>.01,this.starMat.uniforms.uOpacity.value=l.stars,this.horizonMat&&(this.horizonMat.visible=!0,this.horizonMat.color.setHex(l.fogCol)),this.world.renderer&&this.world.renderer.shadowMap&&(this.world.renderer.shadowMap.needsUpdate=!0),this._clouds&&this._clouds.forEach(f=>{f?.material?.color&&typeof f.material.color.setHex=="function"&&f.material.color.setHex(l.clouds)}),this.world.terrain._lanternMat&&(this.world.terrain._lanternMat.emissiveIntensity=l.lanternGlow),this.world.terrain.oceanMesh?.material?.color&&this.world.terrain.oceanMesh.material.color.setHex(l.water),this.world.waterObjects)for(let f of this.world.waterObjects)if(f.material?.uniforms){let c=f.material.uniforms;c.sunDirection&&c.sunDirection.value.copy(a),c.sunColor&&c.sunColor.value.setHex(l.sunCol),c.waterColor&&c.waterColor.value.setHex(l.water),c.distortionScale&&(c.distortionScale.value=t.rainbow>.7||s==="blessing"?4.2:3.8)}else f.material?.color&&f.material.color.setHex(l.water);let u=[this.world.terrain._lakeShader,this.world.terrain._oceanShader,this.world.terrain._surfShader,this.world.terrain._oceanWaterfallShader,this.world.terrain._mountainWaterfallShader,this.world._impactRingShader,this.world._mistShader,this.world._splashShader,this.world.terrain.riverMat,this.world._waterPoolMat,this.world.terrain._fountainBasinMat,this.world.terrain._fountainCascadeMat,this.world.terrain._shorelineFoamMaterial,...this.world.terrain._riverMaterials||[]];for(let f of u)f?.uniforms&&(f.uniforms.waterColor&&f.uniforms.waterColor.value.setHex(l.water),f.uniforms.uDeepColor&&f.uniforms.uDeepColor.value.setHex(l.water),f.uniforms.uDeepWater&&f.uniforms.uDeepWater.value.setHex(l.water),f.uniforms.sunColor&&f.uniforms.sunColor.value.setHex(l.sunCol),f.uniforms.uSunColor&&f.uniforms.uSunColor.value.setHex(l.sunCol),f.uniforms.sunDirection&&f.uniforms.sunDirection.value.copy(a),f.uniforms.uSunDir&&f.uniforms.uSunDir.value.copy(a),f.uniforms.uDepthTexture&&this.world.depthTexture&&(f.uniforms.uDepthTexture.value=this.world.depthTexture),f.uniforms.cameraNear&&this.world.camera&&(f.uniforms.cameraNear.value=this.world.camera.near),f.uniforms.cameraFar&&this.world.camera&&(f.uniforms.cameraFar.value=this.world.camera.far));this.bloomPass&&(this.bloomPass.strength=l.bloom,this.bloomPass.radius=.5+n.night*.2,this.bloomPass.threshold=s==="night"?.74:.94),this._rainbowBase=(.08+.1*(s==="blessing"?1:t.rainbow))*(1+n.night*.25),this._pawBase=.28}forcePhase(e){this._forcedPhase=e?{key:e,t:.5}:null,e==="blessing"&&(this.mood="blessing"),this.applyAmbience()}_buildLensflare(){let e=new ls;e.addElement(new Lo(this.world.assetLoader._flareTexture("rgba(255,246,224,0.4)","rgba(255,214,150,0.1)"),120,0)),e.addElement(new Lo(this.world.assetLoader._flareTexture("rgba(255,226,180,0.2)","rgba(255,190,120,0.04)"),45,.32)),this.lensflare=e,this.sun.add(e)}_cloudScape(){this._clouds=[];let e=yt(7024),o=pe.cloudCard();o&&(o.opacity=.35,o.transparent=!0,o.depthWrite=!1,o.blending=Ht);for(let s=0;s<14;s++){let n=520+e()*380,t=160+e()*120,a=new ct(n,t),l=new r(a,o);l.position.set((e()-.5)*2600,520+e()*320,-1100+e()*800),l.rotation.x=Math.PI*.12,l.rotation.y=e()*Math.PI*2,l.userData={speedX:(e()-.5)*.4+.6,origY:l.position.y,phase:e()*Math.PI*2},this.world.scene.add(l),this._clouds.push(l)}}};async function ya({width:ye=4600,depth:e=5200,segments:o=640,heightAt:s=ze,batchVertices:n=2048,normalStep:t=3,yieldWork:a=()=>new Promise(u=>setTimeout(u,0)),signal:l}={}){if(!Number.isInteger(o)||o<2||o>768)throw new RangeError("Terrain segments must be an integer between 2 and 768");if(!(ye>0&&e>0&&n>=1&&t>0))throw new RangeError("Terrain dimensions and batch size must be positive");let u=o+1,f=u*u,c=new Float32Array(f*3),p=new Float32Array(f*3),w=new Float32Array(f*2),b=new Float32Array(f),x=new Uint32Array(o*o*6),V=ye/o,y=e/o;async function H(L){if(L%n===0){if(l?.aborted)throw l.reason||new Error("Terrain generation aborted");await a()}}for(let L=0;L<f;L++){L%n===0&&await H(L);let T=Math.floor(L/u),N=L%u,q=N*V-ye/2,$=T*y-e/2;c[L*3]=q,c[L*3+1]=s(q,$),c[L*3+2]=$,w[L*2]=N/o,w[L*2+1]=1-T/o}for(let L=0;L<f;L++){L%n===0&&await H(L);let T=Math.floor(L/u),N=L%u,q=c[L*3+1],$=c[L*3],Y=c[L*3+2],k=(s($+t,Y)-s($-t,Y))/(t*2),h=(s($,Y+t)-s($,Y-t))/(t*2),v=Math.hypot(k,1,h);p[L*3]=-k/v,p[L*3+1]=1/v,p[L*3+2]=-h/v;let _=Math.max(1,Math.round(24/Math.min(V,y))),g=Math.max(0,T-_),i=Math.min(o,T+_),S=Math.max(0,N-_),C=Math.min(o,N+_),O=(c[(g*u+N)*3+1]+c[(i*u+N)*3+1]+c[(T*u+S)*3+1]+c[(T*u+C)*3+1])/4;if(b[L]=Math.max(.55,1-Math.max(0,O-q)*.055),T<o&&N<o){let te=(T*o+N)*6;x[te]=L,x[te+1]=L+u,x[te+2]=L+1,x[te+3]=L+u,x[te+4]=L+u+1,x[te+5]=L+1}}let M=new Et;return M.setAttribute("position",new tt(c,3)),M.setAttribute("normal",new tt(p,3)),M.setAttribute("uv",new tt(w,2)),M.setAttribute("aCreviceAO",new tt(b,1)),M.setIndex(new tt(x,1)),M.computeBoundingBox(),M.computeBoundingSphere(),M}async function Ma(ye={}){let{workerURL:e=new URL("./terrainWorker.js",import.meta.url),workerTimeout:o=2e4,signal:s,...n}=ye,t=()=>s?.reason||new Error("Terrain generation aborted");if(s?.aborted)throw t();if(typeof Worker>"u"||n.heightAt||n.yieldWork)return ya({...n,signal:s});try{return await new Promise((a,l)=>{let u=new Worker(e,{type:"module"}),f=!1,c=()=>{clearTimeout(b),s?.removeEventListener("abort",w),u.terminate()},p=x=>{f||(f=!0,c(),l(x))},w=()=>p(t()),b=setTimeout(()=>p(new Error("Terrain worker timed out")),o);s?.addEventListener("abort",w,{once:!0}),u.onerror=x=>p(new Error(x.message||"Terrain worker failed")),u.onmessageerror=()=>p(new Error("Terrain worker response could not be decoded")),u.onmessage=x=>{if(f)return;let V=x.data;if(V.error){p(new Error(V.error));return}try{let y=new Et;y.setAttribute("position",new tt(new Float32Array(V.position),3)),y.setAttribute("normal",new tt(new Float32Array(V.normal),3)),y.setAttribute("uv",new tt(new Float32Array(V.uv),2)),y.setAttribute("aCreviceAO",new tt(new Float32Array(V.aCreviceAO),1)),y.setIndex(new tt(new Uint32Array(V.index),1)),y.boundingBox=new os(new A(...V.min),new A(...V.max)),y.boundingSphere=new qs(new A(...V.center),V.radius),f=!0,c(),a(y)}catch(y){p(y)}};try{u.postMessage(n)}catch(x){p(x)}})}catch{if(s?.aborted)throw t();return ya({...n,signal:s})}}function Ta(ye,{tileSegments:e=64}={}){let o=ye.attributes.position,s=Math.round(Math.sqrt(o.count)),n=s-1;if(s*s!==o.count||ye.index?.count!==n*n*6)throw new Error("Terrain tiles require a square indexed terrain grid");if(!Number.isInteger(e)||e<1)throw new RangeError("Tile segments must be a positive integer");let t=[],a=new A;for(let l=0;l<n;l+=e)for(let u=0;u<n;u+=e){let f=Math.min(n,l+e),c=Math.min(n,u+e),p=new Et;for(let[V,y]of Object.entries(ye.attributes))p.setAttribute(V,y);let w=new Uint32Array((f-l)*(c-u)*6),b=0;for(let V=l;V<f;V++){let y=(V*n+u)*6,H=(c-u)*6;w.set(ye.index.array.subarray(y,y+H),b),b+=H}p.setIndex(new tt(w,1));let x=new os;for(let V=l;V<=f;V++)for(let y=u;y<=c;y++)a.fromBufferAttribute(o,V*s+y),x.expandByPoint(a);p.boundingBox=x,p.boundingSphere=x.getBoundingSphere(new qs),p.boundingSphere.radius+=1e-6,p.userData.terrainTile={row:l,col:u,endRow:f,endCol:c},t.push(p)}return t}var uo=A;function xa(){let ye=new qe;ye.name="GrandCeremonialBoulevard";let e=[new uo(0,ze(0,820),820),new uo(0,ze(0,720),720),new uo(0,ze(0,560),560),new uo(0,ze(0,440),440),new uo(0,ze(0,320),320),new uo(0,ze(0,180),180),new uo(0,ze(0,82),82)],o=new It(e,!1,"centripetal",.25),s=260,n=10,t=26,a=t*.5,l=[],u=[],f=[],c=[],p=new uo(0,1,0),b=o.getLength()/14;for(let k=0;k<=s;k++){let h=k/s,v=o.getPoint(h),_=o.getTangent(h).normalize(),g=new uo().crossVectors(_,p).normalize(),i=v.z;for(let S=0;S<=n;S++){let C=S/n,O=(C-.5)*t,te=v.x+g.x*O,m=i+g.z*O,E=ze(te,m),R=(1-Math.pow((C-.5)*2,2))*.08,P=E+.25+R;l.push(te,P,m),u.push(C,h*b),f.push(0,1,0)}if(k>0){let S=o.getPoint((k-1)/s).z,C=i;if(!(Math.min(S,C)>=378&&Math.max(S,C)<=502))for(let te=0;te<n;te++){let m=(k-1)*(n+1),E=k*(n+1),R=m+te,P=E+te,oe=m+(te+1),ne=E+(te+1);c.push(R,P,oe),c.push(oe,P,ne)}}}let x=new Et;x.setAttribute("position",new mt(l,3)),x.setAttribute("uv",new mt(u,2)),x.setAttribute("normal",new mt(f,3)),x.setIndex(c),x.computeVertexNormals(),x.computeBoundingSphere(),x.computeBoundingBox();let V=pe.ceremonialBoulevard(1),y=new r(x,V);y.receiveShadow=!0,y.castShadow=!1,ye.add(y);let H=pe.honedCarraraMarble(1.5),M=.85,L=.38;for(let k of[-1,1]){let h=[],v=[],_=[];for(let S=0;S<=s;S++){let C=S/s,O=o.getPoint(C),te=o.getTangent(C).normalize(),m=new uo().crossVectors(te,p).normalize(),E=k*(a-M*.5),R=O.x+m.x*E,P=O.z+m.z*E,oe=P>915?K.oceanLevel||.35:K.waterLevel,ne=Math.max(ze(R,P),oe+.3),se=R-m.x*(M*.5*k),ae=P-m.z*(M*.5*k),I=R+m.x*(M*.5*k),Z=P+m.z*(M*.5*k),ie=ne+.48,ve=ne-.65;if(h.push(I,ve,Z),h.push(I,ie,Z),h.push(se,ie,ae),h.push(se,ve,ae),v.push(0,C*b*2),v.push(.33,C*b*2),v.push(.66,C*b*2),v.push(1,C*b*2),S>0){let De=o.getPoint((S-1)/s).z,Ue=O.z;if(!(Math.min(De,Ue)>=378&&Math.max(De,Ue)<=502)){let U=(S-1)*4,xe=S*4;for(let Ce=0;Ce<3;Ce++){let Pe=U+Ce,B=xe+Ce,X=U+(Ce+1),G=xe+(Ce+1);_.push(Pe,B,X),_.push(X,B,G)}}}}let g=new Et;g.setAttribute("position",new mt(h,3)),g.setAttribute("uv",new mt(v,2)),g.setIndex(_),g.computeVertexNormals(),g.computeBoundingSphere(),g.computeBoundingBox();let i=new r(g,H);i.castShadow=!0,i.receiveShadow=!0,ye.add(i)}let T=[],N=[],q=pe.agedCaenLimestone(4);for(let k=0;k<=s;k+=2){let h=k/s,v=o.getPoint(h),_=o.getTangent(h).normalize(),g=new uo().crossVectors(_,p).normalize(),i=t+3,S=v.x-g.x*(i*.5),C=v.z-g.z*(i*.5),O=v.x+g.x*(i*.5),te=v.z+g.z*(i*.5),m=C>915?K.oceanLevel||.35:K.waterLevel,E=te>915?K.oceanLevel||.35:K.waterLevel,R=Math.max(ze(S,C),m+.2)-.18,P=Math.max(ze(O,te),E+.2)-.18;if(T.push(S,R,C,O,P,te),k>0){let oe=k/2*2;N.push(oe-2,oe-1,oe,oe-1,oe+1,oe)}}let $=new Et;$.setAttribute("position",new mt(T,3)),$.setIndex(N),$.computeVertexNormals();let Y=new r($,q);return Y.receiveShadow=!0,ye.add(Y),ye}function Ra(ye){let{pts:e,ring:o,cx:s,cz:n,r:t,w:a}=ye,l=4,u=[],f=[],c=[],p=[],w=new uo(0,1,0);if(o){let H=a*.5;for(let M=0;M<=72;M++){let L=M/72*Math.PI*2,T=Math.cos(L),N=Math.sin(L),q=t;for(let $=0;$<=l;$++){let Y=$/l,k=q-H+Y*a,h=s+T*k,v=n+N*k,_=v>915?K.oceanLevel||.35:K.waterLevel,g=Math.max(ze(h,v),_+.3),i=(1-Math.pow((Y-.5)*2,2))*.05,S=g+.12+i;u.push(h,S,v),f.push(Y,M/72*12),p.push(0,1,0)}if(M>0)for(let $=0;$<l;$++){let Y=(M-1)*(l+1),k=M*(l+1),h=Y+$,v=k+$,_=Y+($+1),g=k+($+1);c.push(h,v,_),c.push(_,v,g)}}}else{let y=[];for(let N=0;N<e.length;N++){let[q,$]=e[N];y.push(new uo(q,ze(q,$),$))}let H=new It(y,!1,"centripetal",.25),M=e.length*18,T=H.getLength()/8;for(let N=0;N<=M;N++){let q=N/M,$=H.getPoint(q),Y=H.getTangent(q).normalize(),k=new uo().crossVectors(Y,w).normalize();for(let h=0;h<=l;h++){let v=h/l,_=(v-.5)*a,g=$.x+k.x*_,i=$.z+k.z*_,S=i>915?K.oceanLevel||.35:K.waterLevel,C=Math.max(ze(g,i),S+.3),O=(1-Math.pow((v-.5)*2,2))*.05,te=C+.12+O;u.push(g,te,i),f.push(v,q*T),p.push(0,1,0)}if(N>0)for(let h=0;h<l;h++){let v=(N-1)*(l+1),_=N*(l+1),g=v+h,i=_+h,S=v+(h+1),C=_+(h+1);c.push(g,i,S),c.push(S,i,C)}}}let b=new Et;b.setAttribute("position",new mt(u,3)),b.setAttribute("uv",new mt(f,2)),b.setAttribute("normal",new mt(p,3)),b.setIndex(c),b.computeVertexNormals(),b.computeBoundingSphere(),b.computeBoundingBox();let x=pe.pavedRoad(2),V=new r(b,x);return V.receiveShadow=!0,V.frustumCulled=!0,V}var ao=(ye,e=!1)=>{if(!ye||!Array.isArray(ye)||ye.length===0)return null;let o=ye.filter(f=>f&&f.attributes&&f.attributes.position);if(o.length===0)return null;if(o.length===1)return o[0];let s=!1,n=!1,t=!1,a=!1,l=!1;for(let f of o)f.index?s=!0:n=!0,f.attributes.color&&(t=!0),f.attributes.uv&&(a=!0),f.attributes.normal&&(l=!0);let u=o.map(f=>{let c=f;if(s&&n&&f.index&&(c=f.toNonIndexed()),l&&!c.attributes.normal&&c.computeVertexNormals(),a&&!c.attributes.uv){let p=c.attributes.position.count,w=new Float32Array(p*2);c.setAttribute("uv",new tt(w,2))}if(t&&!c.attributes.color){let p=c.attributes.position.count,w=new Float32Array(p*3).fill(1);c.setAttribute("color",new tt(w,3))}else!t&&c.attributes.color&&c.deleteAttribute("color");return c});try{let f=Is(u,e);return u.forEach(c=>{c&&c.dispose()}),f}catch(f){return console.warn("[world3d] mergeGeometries fallback:",f),null}},je=ao,an=null;function us(ye,e=.04){if(!an){let s=document.createElement("canvas");s.width=s.height=128;let n=s.getContext("2d"),t=n.createRadialGradient(64,64,4,64,64,64);t.addColorStop(0,"rgba(0, 0, 0, 0.72)"),t.addColorStop(.4,"rgba(0, 0, 0, 0.38)"),t.addColorStop(.8,"rgba(0, 0, 0, 0.10)"),t.addColorStop(1,"rgba(0, 0, 0, 0)"),n.fillStyle=t,n.fillRect(0,0,128,128);let a=new Kt(s);an=new Ct({map:a,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1})}let o=new r(new ct(ye*2,ye*2),an);return o.rotation.x=-Math.PI/2,o.position.y=e,o}var ht=A,zi=new Me(12563354),ki=new A,Ii=new A,Ai=new A,Di=new A,Bi=new Me,Li=new Me,Fi=new so,Ni=new _t;function Yt(ye,e=.08,o=.28,s=17){if(!ye||!ye.attributes||!ye.attributes.position)return ye;let n=ye.attributes.position;for(let t=0;t<n.count;t++){let a=n.getX(t),l=n.getY(t),u=n.getZ(t);(isNaN(a)||!isFinite(a))&&(a=0),(isNaN(l)||!isFinite(l))&&(l=0),(isNaN(u)||!isFinite(u))&&(u=0);let f=(jt(a*e+s,u*e+s,2)-.5)*o,c=(jt(l*e*1.5+s*2,a*e+s,2)-.5)*(o*.6),p=isNaN(f)?a:a+f,w=isNaN(c)?l:l+c,b=isNaN(f)?u:u+f;n.setXYZ(t,p,w,b)}return n.needsUpdate=!0,ye.computeVertexNormals(),ye.computeBoundingSphere&&ye.computeBoundingSphere(),ye.computeBoundingBox&&ye.computeBoundingBox(),ye}function Ko(ye,e=0,o=.45){if(!ye||!ye.attributes.position)return ye;let s=ye.attributes.position,n=ye.attributes.normal,t=new Float32Array(s.count*3);for(let a=0;a<s.count;a++){let l=s.getY(a),u=n?n.getY(a):0,f=Math.max(0,Math.min(1,(l-e)/4)),c=Math.max(0,u*.5+.5),p=Math.max(.35,Math.min(1,.45+.35*f+.2*c));t[a*3]=p,t[a*3+1]=p,t[a*3+2]=p}return ye.setAttribute("color",new tt(t,3)),ye}var Fs=class{constructor(e){this.world=e}async _terrain({awaitTextures:e=!0}={}){let o=zs(this.world.renderer);this._terrainAbort=new AbortController;let s=await Ma({segments:this.world.quality.terrain,batchVertices:512,workerURL:new URL("./assets/terrain-worker.js",document.baseURI||"http://localhost/"),signal:this._terrainAbort.signal});if(e&&await o.userData.ready,this.world._disposed){s.dispose(),o.dispose();return}let n=new qe;n.name="Photographic landscape";for(let t of Ta(s)){let a=new r(t,o);a.receiveShadow=!0,n.add(a)}this.world.scene.add(n),this.terrainSourceGeometry=s,this.terrainMesh=n,this.terrainPatch=null}async _water(){let e;try{let d=yo("waterNormals"),le=d?.normalMap||d?.normal||d;e=le&&typeof le.clone=="function"?le.clone():null}catch(d){console.warn("[water] normal texture failed, using fallback",d)}if(!e){let d=document.createElement("canvas");d.width=d.height=4;let le=d.getContext("2d");le.fillStyle="#8080ff",le.fillRect(0,0,4,4),e=new Kt(d)}e.wrapS=e.wrapT=qo,e.repeat.set(16,16),this._waterNormals=e,this._fountainBasinMat=this._createFountainBasinMaterial(e),this._fountainCascadeMat=this._createFountainCascadeMaterial(e),this.riverMat=this._createRiverMaterial(e);let o=K.lake.r,s=36,n=96,t=[],a=[],l=[];t.push(0,0,0),a.push(.5,.5);for(let d=1;d<=s;d++){let le=d/s*o;for(let fe=0;fe<n;fe++){let me=fe/n*Math.PI*2,be=Math.cos(me)*le,Fe=Math.sin(me)*le;t.push(be,0,Fe),a.push(be/(o*2)+.5,Fe/(o*2)+.5)}}for(let d=0;d<n;d++){let le=(d+1)%n;l.push(0,d+1,le+1)}for(let d=1;d<s;d++){let le=1+(d-1)*n,fe=1+d*n;for(let me=0;me<n;me++){let be=(me+1)%n,Fe=le+me,Qe=fe+me,Rt=fe+be,Oo=le+be;l.push(Fe,Qe,Oo),l.push(Qe,Rt,Oo)}}let u=new Et;u.setAttribute("position",new mt(t,3)),u.setAttribute("uv",new mt(a,2)),u.setIndex(l),u.computeVertexNormals();let f=this._createPhysicalWaterMaterial(this._waterNormals,"lake");this._lakeShader=f,u.computeBoundingSphere(),u.computeBoundingBox();let c=new r(u,f);c.position.set(K.lake.x,K.waterLevel,K.lake.z),c.receiveShadow=!0,c.frustumCulled=!1,c.renderOrder=1,this.world.scene.add(c),this.lakeWater=c,this.water=c,this._lakeMesh=c,this.waterMat=f;let p=new bo(K.lake.r-2.5,K.lake.r+2,64,1);p.computeBoundingSphere();let w=`
      #include <common>
      #include <logdepthbuf_pars_vertex>
      #include <fog_pars_vertex>
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      
      vec3 gerstnerWave(vec2 dir, float steepness, float wavelength, vec2 p, float speed, float t) {
          float k = 2.0 * 3.14159265 / wavelength;
          float c = sqrt(9.8 / k);
          vec2 d = normalize(dir);
          float f = k * (dot(d, p) - c * speed * t);
          float a = steepness / k;
          return vec3(
              d.x * (a * cos(f)),
              a * sin(f),
              d.y * (a * cos(f))
          );
      }
      
      void main() {
        vUv = uv;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        
        vec3 g1 = gerstnerWave(vec2(1.0, 0.4), 0.12, 12.0, worldPos.xz, 1.2, uTime);
        vec3 g2 = gerstnerWave(vec2(-0.5, 1.0), 0.10, 8.0, worldPos.xz, 1.5, uTime);
        vec3 g3 = gerstnerWave(vec2(0.8, -0.6), 0.08, 5.0, worldPos.xz, 1.8, uTime);
        vec3 gWave = g1 + g2 + g3;
        
        worldPos.xyz += gWave;
        vWorldPos = worldPos.xyz;
        
        gl_Position = projectionMatrix * viewMatrix * worldPos;
        #include <logdepthbuf_vertex>
        #include <fog_vertex>
      }
    `,b=`
      #include <logdepthbuf_pars_fragment>
      #include <fog_pars_fragment>
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vWorldPos;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        float radial = abs(vUv.y - 0.5) * 2.0;
        float angle = atan(vWorldPos.z - (${K.lake.z.toFixed(1)}), vWorldPos.x - (${K.lake.x.toFixed(1)}));
        float pulse = sin(angle * 28.0 - uTime * 2.4) * cos(angle * 14.0 + uTime * 1.6);
        float foamLace = noise(vWorldPos.xz * 0.9 + vec2(uTime * 0.25, -uTime * 0.18));
        float foam = 1.0 - smoothstep(0.15, 0.85, radial + pulse * 0.25 + foamLace * 0.15);
        float alpha = foam * (1.0 - smoothstep(0.15, 1.0, radial)) * 0.76;
        vec3 col = mix(vec3(0.68, 0.88, 0.98), vec3(1.0, 1.0, 1.0), foam);
        gl_FragColor = vec4(col, alpha);
        #include <logdepthbuf_fragment>
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `,x=new Mt({vertexShader:w,fragmentShader:b,uniforms:{uTime:{value:0}},transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:gt}),V=new r(p,x);V.rotation.x=-Math.PI/2,V.position.set(K.lake.x,K.waterLevel+.08,K.lake.z),V.renderOrder=2,V.frustumCulled=!1,this.world.scene.add(V),this._shorelineFoamMaterial=x;let y=new ct(36e3,24e3,48,32);y.rotateX(-Math.PI/2),y.translate(0,0,12e3),y.computeBoundingSphere(),y.computeBoundingBox();let H=this._createPhysicalWaterMaterial(e,"ocean");this._oceanShader=H;let M=new r(y,H);M.position.y=K.oceanLevel||.35,M.receiveShadow=!0,M.frustumCulled=!0,M.renderOrder=1,this.world.scene.add(M),this.oceanMesh=M;let L=[{cx:0,cy:161.5,cz:-535,radiusX:38,radiusZ:32,count:84,type:"abyssal_trout"},{cx:16,cy:165,cz:-515,radiusX:34,radiusZ:36,count:84,type:"abyssal_trout"},{cx:-18,cy:169,cz:-540,radiusX:32,radiusZ:30,count:84,type:"glacial_trout"},{cx:8,cy:172.5,cz:-495,radiusX:32,radiusZ:34,count:78,type:"glacial_trout"},{cx:-15,cy:175.5,cz:-520,radiusX:30,radiusZ:28,count:72,type:"sapphire_gliders"},{cx:12,cy:177,cz:-545,radiusX:28,radiusZ:26,count:66,type:"sapphire_gliders"},{cx:0,cy:179.5,cz:-475,radiusX:26,radiusZ:26,count:66,type:"rapids_trout"},{cx:0,cy:7.5,cz:-362,radiusX:34,radiusZ:34,count:78,type:"grotto_trout"},{cx:16,cy:11.5,cz:-355,radiusX:30,radiusZ:32,count:72,type:"grotto_trout"},{cx:-14,cy:14.5,cz:-365,radiusX:28,radiusZ:30,count:66,type:"cascade_gliders"},{cx:75,cy:13,cz:-345,radiusX:32,radiusZ:28,count:24,type:"river_gliders"},{cx:0,cy:9.2,cz:440,radiusX:25,radiusZ:48,count:26,type:"river_gliders"},{cx:115,cy:7.2,cz:680,radiusX:28,radiusZ:50,count:24,type:"river_gliders"}],T=this._buildKoiMesh(),N=new ot({color:16777215,roughness:.15,metalness:.1,clearcoat:1,clearcoatRoughness:.08,vertexColors:!0});this._instancedFishMat=N,N.onBeforeCompile=function(d){d.uniforms.uTime={value:0},this.userData.shader=d,d.vertexShader=`
        attribute float aPhase;
        attribute float aSpeed;
        attribute vec3 aColor;
        varying vec3 vInstColor;
        varying vec3 vLocalPos;
        varying vec3 vLocalNormal;
        varying vec2 vFishUv;
        varying float vFinTranslucency;
        varying vec3 vVertColor;
        uniform float uTime;
      `+d.vertexShader,d.vertexShader=d.vertexShader.replace("#include <beginnormal_vertex>",`
        #include <beginnormal_vertex>
        // Normal adjustment to match spine curvature
        float swimFreqNorm = aSpeed * 10.5;
        float spinePhaseNorm = aPhase + uTime * swimFreqNorm - (position.z - 1.15) * 2.6;
        float flexGrowthNorm = smoothstep(0.85, -1.95, position.z);
        float bodyAmpNorm = 0.035 + 0.46 * pow(flexGrowthNorm, 1.45);
        float dWaveDz = -2.6 * cos(spinePhaseNorm) * bodyAmpNorm;
        float yawAngle = atan(dWaveDz) * 0.65;
        float cosY = cos(yawAngle);
        float sinY = sin(yawAngle);
        objectNormal = vec3(
          objectNormal.x * cosY + objectNormal.z * sinY,
          objectNormal.y,
          -objectNormal.x * sinY + objectNormal.z * cosY
        );
        `),d.vertexShader=d.vertexShader.replace("#include <begin_vertex>",`
        vec3 transformed = vec3( position );
        vLocalPos = position;
        vLocalNormal = normal;
        vFishUv = uv;
        vInstColor = aColor;
        #ifdef USE_COLOR
          vVertColor = color;
          vFinTranslucency = ((color.r < 0.95 || color.g < 0.95 || color.b < 0.95) && (color.r > 0.05)) ? 1.0 : 0.0;
        #else
          vVertColor = vec3(1.0);
          vFinTranslucency = 0.0;
        #endif

        // 1. Organic Undulatory Locomotion (Lighthill Slender-Body Dynamics)
        float swimFreq = aSpeed * 10.5;
        float spinePhase = aPhase + uTime * swimFreq - (transformed.z - 1.15) * 2.6;

        // Lateral sway envelope: Stable head, smooth exponential amplitude towards caudal tail
        float flexGrowth = smoothstep(0.85, -1.95, transformed.z);
        float bodyAmp = 0.035 + 0.46 * pow(flexGrowth, 1.45);
        float bodyWave = sin(spinePhase) * bodyAmp;

        // Trailing caudal fin elasticity (fin whip & secondary harmonic)
        float caudalLag = smoothstep(-0.9, -1.95, transformed.z);
        float caudalWhip = sin(spinePhase - 0.75) * 0.14 * caudalLag;

        transformed.x += bodyWave + caudalWhip;

        // Head micro-counter-yaw (momentum conservation)
        float headCounterYaw = smoothstep(0.2, 1.15, transformed.z) * sin(aPhase + uTime * swimFreq + 3.14159) * 0.032;
        transformed.x += headCounterYaw;

        // Pectoral Fin sculling & vertical flutter
        if (abs(position.x) > 0.20 && position.z > 0.10 && position.z < 0.75 && position.y < 0.05) {
          float pecPhase = aPhase + uTime * swimFreq * 1.35 + sign(position.x) * 1.6;
          float pecFlap = sin(pecPhase) * 0.065;
          transformed.y += pecFlap;
          transformed.x += pecFlap * sign(position.x) * 0.55;
        }

        // Dorsal Fin wave ripple
        if (position.y > 0.25 && position.z < 0.35 && position.z > -0.65) {
          float dorsalRipple = sin(spinePhase + position.z * 3.2) * 0.045 * smoothstep(0.25, 0.55, position.y);
          transformed.x += dorsalRipple;
        }
        `),d.fragmentShader=`
        varying vec3 vInstColor;
        varying vec3 vLocalPos;
        varying vec3 vLocalNormal;
        varying vec2 vFishUv;
        varying float vFinTranslucency;
        varying vec3 vVertColor;

        // Precision procedural ctenoid/cycloid scale generator
        float ctenoidScales(vec2 uv) {
          vec2 st = uv * vec2(26.0, 16.0);
          st.x += step(1.0, mod(st.y, 2.0)) * 0.5;
          vec2 g = fract(st) - vec2(0.5, 0.3);
          float d = length(g);
          float ridge = smoothstep(0.48, 0.38, d) * smoothstep(0.12, 0.36, d);
          float plate = smoothstep(0.46, 0.10, d);
          return plate * 0.65 + ridge * 0.55;
        }

        // Multi-spectrum Guanine crystal iridescence (violet -> cyan -> gold)
        vec3 fishIridescence(vec3 norm, vec3 viewD, vec3 baseCol, float zPos) {
          float NdotV = clamp(dot(norm, viewD), 0.0, 1.0);
          float fresnel = pow(1.0 - NdotV, 2.2);
          vec3 thinFilm = vec3(0.5) + 0.5 * cos(vec3(0.0, 2.1, 4.2) + fresnel * 4.5 + zPos * 1.8);
          return mix(baseCol, thinFilm * 1.25, fresnel * 0.42);
        }
      `+d.fragmentShader,d.fragmentShader=d.fragmentShader.replace("#include <color_fragment>",`
        #include <color_fragment>
        diffuseColor.rgb *= vInstColor;

        bool isEye = vVertColor.r < 0.05 && vVertColor.g < 0.05 && vVertColor.b < 0.05;
        bool isFin = vFinTranslucency > 0.5;

        if (isEye) {
          // Photorealistic 3D Corneal Eye: Obsidian pupil with shimmering 24K Gold iris
          float eyeDist = length(vec2(vLocalPos.y - 0.10, vLocalPos.z - 0.76));
          float pupil = smoothstep(0.042, 0.032, eyeDist);
          float irisRing = smoothstep(0.075, 0.042, eyeDist) * (1.0 - pupil);
          vec3 irisColor = vec3(1.0, 0.82, 0.28);
          diffuseColor.rgb = mix(irisColor, vec3(0.02, 0.02, 0.03), pupil);
        } else if (isFin) {
          // Fin membrane: Ray striations, translucent light transmission, edge rim glow
          float rayUv = vFishUv.x * 32.0 + vFishUv.y * 12.0;
          float rays = sin(rayUv * 6.28318) * 0.5 + 0.5;
          rays = pow(rays, 1.6);
          vec3 rayCol = mix(vInstColor * 1.15, vec3(0.95, 0.98, 1.0), 0.35);
          vec3 membraneCol = vInstColor * 0.75;
          diffuseColor.rgb = mix(membraneCol, rayCol, rays * 0.6);
          diffuseColor.rgb += vInstColor * 0.30;
          diffuseColor.a *= 0.82;
        } else {
          // Photorealistic Body Skin
          float scales = ctenoidScales(vec2(vFishUv.y * 3.5, vFishUv.x));
          vec3 viewDir = normalize(vViewPosition);
          diffuseColor.rgb = fishIridescence(normalize(vLocalNormal), viewDir, diffuseColor.rgb, vLocalPos.z);
          diffuseColor.rgb *= mix(0.78, 1.22, scales);
          
          // Realistic Countershading: Dark dorsal crest, shimmering lateral line, pearlescent ventral belly
          float dorsalShade = smoothstep(-0.15, 0.38, vLocalPos.y);
          float lateralBand = exp(-pow((vLocalPos.y + 0.02) * 6.0, 2.0));
          diffuseColor.rgb = mix(diffuseColor.rgb * vec3(1.15, 1.12, 1.05), diffuseColor.rgb * 0.72, dorsalShade * 0.45);
          diffuseColor.rgb += vec3(0.12, 0.15, 0.18) * lateralBand;
          
          float ventralBright = smoothstep(0.0, -0.35, vLocalPos.y);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.92, 0.90, 0.85) * (vInstColor * 0.4 + 0.6), ventralBright * 0.55);
        }
        `),d.fragmentShader=d.fragmentShader.replace("#include <normal_fragment_maps>",`
        #include <normal_fragment_maps>
        if (!isEye && !isFin) {
          vec2 eps = vec2(0.008, 0.0);
          vec2 uvCoord = vec2(vFishUv.y * 3.5, vFishUv.x);
          float s0 = ctenoidScales(uvCoord);
          float sU = ctenoidScales(uvCoord + eps.xy);
          float sV = ctenoidScales(uvCoord + eps.yx);
          vec3 scaleNormal = normalize(vec3((sU - s0) * 2.2, (sV - s0) * 2.2, 0.55));
          normal = normalize(normal + scaleNormal * 0.38);
        }
        `),d.fragmentShader=d.fragmentShader.replace("#include <roughnessmap_fragment>",`
        #include <roughnessmap_fragment>
        if (isEye) {
          roughnessFactor = 0.02;
        } else if (isFin) {
          roughnessFactor = 0.22;
        } else {
          roughnessFactor = 0.12;
        }
        `)};let q=[],$=yt(112233);L.forEach(d=>{for(let le=0;le<d.count;le++){let fe=le/d.count*Math.PI*2+($()-.5)*.6,me=($()*.8+.2)*d.radiusX,be=($()*.8+.2)*d.radiusZ,Fe=($()-.5)*3.2,Qe=[.22,.82,.65],Rt=$();d.type==="abyssal_trout"?Qe=Rt<.5?[.15,.68,.95]:[.08,.45,.85]:d.type==="sapphire_gliders"?Qe=Rt<.5?[.35,.75,.98]:[.85,.92,.98]:d.type==="grotto_trout"?Qe=Rt<.5?[.28,.85,.62]:[.18,.65,.55]:d.type==="rapids_trout"||d.type==="cascade_gliders"?Qe=Rt<.5?[.95,.45,.22]:[.92,.85,.35]:Qe=Rt<.6?[.22,.82,.65]:[.32,.72,.92],q.push({center:{x:d.cx,y:d.cy,z:d.cz},radiusX:me,radiusZ:be,angle:fe,yOffset:Fe,phase:$()*Math.PI*2,speed:($()*.4+.6)*1.2,orbitSpeed:($()*.4+.6)*.08,dir:$()<.5?1:-1,wanderAmp:$()*8+4,vertAmp:$()*.45+.35,scale:$()*.4+.8,color:Qe})}});let Y=q.length;T.computeBoundingSphere();let k=new ut(T,N,Y),h=new Float32Array(Y),v=new Float32Array(Y),_=new Float32Array(Y*3),g=new Lt;q.forEach((d,le)=>{h[le]=d.phase,v[le]=d.speed,_[le*3]=d.color[0],_[le*3+1]=d.color[1],_[le*3+2]=d.color[2];let fe=d.center.x+Math.cos(d.angle)*d.radiusX,me=d.center.z+Math.sin(d.angle)*d.radiusZ,be=d.center.y+d.yOffset;g.position.set(fe,be,me),g.rotation.set(0,d.angle+Math.PI/2,0),g.scale.setScalar(d.scale),g.updateMatrix(),k.setMatrixAt(le,g.matrix)}),T.setAttribute("aPhase",new Ft(h,1)),T.setAttribute("aSpeed",new Ft(v,1)),T.setAttribute("aColor",new Ft(_,3)),k.instanceMatrix.needsUpdate=!0,k.frustumCulled=!1,k.castShadow=!1,k.receiveShadow=!1,this._troutData=q,this._troutMesh=k,this.world.scene.add(k);let i=this._buildKoiMesh(),S=[{cx:430,cy:-.5,cz:-260,radiusX:115,radiusZ:125,count:135,type:"sovereign_koi"},{cx:460,cy:2.5,cz:-280,radiusX:105,radiusZ:115,count:144,type:"sovereign_koi"},{cx:410,cy:5.5,cz:-240,radiusX:105,radiusZ:115,count:126,type:"golden_koi"},{cx:330,cy:7.8,cz:-200,radiusX:85,radiusZ:95,count:114,type:"golden_koi"},{cx:450,cy:8.2,cz:-380,radiusX:95,radiusZ:100,count:120,type:"lake_trout"},{cx:530,cy:8.8,cz:-250,radiusX:85,radiusZ:90,count:105,type:"golden_koi"},{cx:370,cy:9.5,cz:-120,radiusX:75,radiusZ:85,count:102,type:"river_gliders"}],C=[],O=yt(559922);S.forEach(d=>{for(let le=0;le<d.count;le++){let fe=le/d.count*Math.PI*2+(O()-.5)*.6,me=(O()*.8+.2)*d.radiusX,be=(O()*.8+.2)*d.radiusZ,Fe=(O()-.5)*3.8,Qe=[1,.78,.16],Rt=O();d.type==="sovereign_koi"||d.type==="golden_koi"?Rt<.28?Qe=[.98,.28,.12]:Rt<.58?Qe=[1,.78,.16]:Rt<.78?Qe=[.98,.96,.9]:Rt<.9?Qe=[1,.52,.12]:Qe=[.92,.75,.22]:Rt<.45?Qe=[.22,.82,.65]:Rt<.8?Qe=[.28,.68,.95]:Qe=[.95,.78,.35],C.push({center:new A(d.cx,d.cy,d.cz),radiusX:me,radiusZ:be,angle:fe,speed:.42+O()*.35,orbitSpeed:.08+O()*.12,dir:O()<.5?1:-1,wanderAmp:O()*12+6,vertAmp:O()*.55+.4,yOffset:Fe,scale:3.2+O()*2.2,phase:O()*Math.PI*2,color:Qe})}});let te=C.length;i.computeBoundingSphere();let m=new ut(i,N,te),E=new Float32Array(te),R=new Float32Array(te),P=new Float32Array(te*3);C.forEach((d,le)=>{E[le]=d.phase,R[le]=d.speed,P[le*3]=d.color[0],P[le*3+1]=d.color[1],P[le*3+2]=d.color[2];let fe=d.center.x+Math.cos(d.angle)*d.radiusX,me=d.center.z+Math.sin(d.angle)*d.radiusZ,be=d.center.y+d.yOffset;g.position.set(fe,be,me),g.rotation.set(0,d.angle+Math.PI/2,0),g.scale.setScalar(d.scale),g.updateMatrix(),m.setMatrixAt(le,g.matrix)}),i.setAttribute("aPhase",new Ft(E,1)),i.setAttribute("aSpeed",new Ft(R,1)),i.setAttribute("aColor",new Ft(P,3)),m.instanceMatrix.needsUpdate=!0,m.frustumCulled=!1,m.castShadow=!1,m.receiveShadow=!1,this._koiData=C,this._koiMesh=m,this.world.scene.add(m);let oe=this._buildReefFishMesh(),ne=[{cx:35,cy:-3.8,cz:2210,radiusX:65,radiusZ:75,count:165,type:"reef_clownfish"},{cx:-25,cy:-4.5,cz:2250,radiusX:70,radiusZ:80,count:180,type:"reef_tangs"},{cx:-55,cy:-5.2,cz:2280,radiusX:60,radiusZ:68,count:150,type:"reef_beauties"},{cx:20,cy:-16.5,cz:2320,radiusX:95,radiusZ:110,count:195,type:"reef_tangs"},{cx:-45,cy:-18.2,cz:2360,radiusX:90,radiusZ:100,count:165,type:"reef_clownfish"},{cx:0,cy:-32,cz:2390,radiusX:135,radiusZ:155,count:180,type:"pelagic_jacks"},{cx:85,cy:-36.5,cz:2460,radiusX:125,radiusZ:140,count:135,type:"pelagic_jacks"},{cx:20,cy:-65,cz:2500,radiusX:140,radiusZ:160,count:240,type:"pelagic_jacks"},{cx:-40,cy:-95,cz:2550,radiusX:150,radiusZ:180,count:255,type:"pelagic_jacks"},{cx:60,cy:-120,cz:2600,radiusX:180,radiusZ:200,count:300,type:"pelagic_jacks"},{cx:65,cy:-6.5,cz:1180,radiusX:85,radiusZ:95,count:120,type:"reef_clownfish"},{cx:-60,cy:-8,cz:1320,radiusX:90,radiusZ:100,count:105,type:"reef_tangs"}],se=[],ae=yt(771144);ne.forEach(d=>{for(let le=0;le<d.count;le++){let fe=le/d.count*Math.PI*2+(ae()-.5)*.5,me=(ae()*.75+.25)*d.radiusX,be=(ae()*.75+.25)*d.radiusZ,Fe=(ae()-.5)*3,Qe=[1,.45,.12],Rt=ae();d.type==="reef_clownfish"?Rt<.4?Qe=[1,.48,.1]:Rt<.7?Qe=[.08,.95,.85]:Qe=[.98,.22,.65]:d.type==="reef_tangs"?Rt<.35?Qe=[.05,.65,1]:Rt<.68?Qe=[1,.92,.08]:Rt<.86?Qe=[.95,.82,.15]:Qe=[.75,.2,.95]:d.type==="reef_beauties"?Rt<.45?Qe=[.55,.15,.85]:Rt<.75?Qe=[1,.62,.28]:Qe=[.15,.95,.72]:Rt<.5?Qe=[.12,.55,.95]:Qe=[.88,.92,.98],se.push({center:new A(d.cx,d.cy,d.cz),radiusX:me,radiusZ:be,angle:fe,speed:.55+ae()*.45,orbitSpeed:.12+ae()*.16,dir:ae()<.5?1:-1,wanderAmp:ae()*10+5,vertAmp:ae()*.5+.35,yOffset:Fe,scale:2.2+ae()*1.6,phase:ae()*Math.PI*2,color:Qe})}});let I=se.length;oe.computeBoundingSphere();let Z=new ut(oe,N,I),ie=new Float32Array(I),ve=new Float32Array(I),De=new Float32Array(I*3);se.forEach((d,le)=>{ie[le]=d.phase,ve[le]=d.speed,De[le*3]=d.color[0],De[le*3+1]=d.color[1],De[le*3+2]=d.color[2];let fe=d.center.x+Math.cos(d.angle)*d.radiusX,me=d.center.z+Math.sin(d.angle)*d.radiusZ,be=d.center.y+d.yOffset;g.position.set(fe,be,me),g.rotation.set(0,d.angle+Math.PI/2,0),g.scale.setScalar(d.scale),g.updateMatrix(),Z.setMatrixAt(le,g.matrix)}),oe.setAttribute("aPhase",new Ft(ie,1)),oe.setAttribute("aSpeed",new Ft(ve,1)),oe.setAttribute("aColor",new Ft(De,3)),Z.instanceMatrix.needsUpdate=!0,Z.frustumCulled=!1,Z.castShadow=!1,Z.receiveShadow=!1,this._reefFishData=se,this._reefFishMesh=Z,this._fishData=se,this._fishMesh=Z,this.world.scene.add(Z);let Ue=this._buildSeaTurtleMesh(),Ke={uniforms:{uTime:{value:0},uDeepWaterColor:{value:new Me(537156)},uSunDir:{value:new A(.4,.8,.5).normalize()},uSunColor:{value:new Me(16772829)}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        attribute float aPhase;
        attribute float aSpeed;
        attribute vec3 aColor;
        varying vec2 vUv;
        varying vec3 vCustomWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vTurtleColor;
        varying float vIsFlipper;
        varying float vIsPlastron;
        uniform float uTime;

        void main() {
          vUv = uv;
          vTurtleColor = aColor;
          vec3 pos = position;

          float swimSpeed = 2.8 * aSpeed;
          float strokeTime = uTime * swimSpeed + aPhase;

          // Detect front flippers by position: |x| > 0.65 and z > -0.2
          float flipperWeight = smoothstep(0.65, 2.2, abs(pos.x)) * smoothstep(-0.4, 1.2, pos.z);
          vIsFlipper = flipperWeight;
          vIsPlastron = step(pos.y, -0.08);

          // Hydrodynamic flipper stroke: downstroke power stroke with forward pitch rotation
          float flapDispY = sin(strokeTime) * (abs(pos.x) - 0.65) * 0.72;
          float flapDispZ = cos(strokeTime) * (abs(pos.x) - 0.65) * 0.28;

          pos.y += flapDispY * flipperWeight;
          pos.z += flapDispZ * flipperWeight;

          // Hind flipper steering flutter
          float hindWeight = smoothstep(0.4, 1.2, abs(pos.x)) * smoothstep(-0.8, -1.8, pos.z);
          pos.y += sin(strokeTime * 1.4 + 1.2) * 0.14 * hindWeight;

          // Gentle full body heave & glide pitching
          pos.y += cos(strokeTime * 0.5) * 0.08;
          pos.x += sin(strokeTime * 0.5) * 0.05;

          vec4 wPos = modelMatrix * vec4(pos, 1.0);
          vWorldPos = wPos.xyz;
          vCustomWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          gl_Position = projectionMatrix * viewMatrix * wPos;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform float uTime;
        uniform vec3 uDeepWaterColor;
        uniform vec3 uSunDir;
        uniform vec3 uSunColor;
        varying vec2 vUv;
        varying vec3 vCustomWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vTurtleColor;
        varying float vIsFlipper;
        varying float vIsPlastron;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPos + vec3(0.0001));
          vec3 normal = normalize(vCustomWorldNormal);

          // Scute pattern synthesis for carapace shell
          float scuteGrid = abs(sin(vWorldPos.x * 3.5) * cos(vWorldPos.z * 3.5));
          float scuteBorder = smoothstep(0.72, 0.88, scuteGrid);

          // Olive-emerald carapace with golden amber margins
          vec3 oliveBase = vTurtleColor;
          vec3 amberMargin = vec3(0.82, 0.62, 0.22);
          vec3 scuteDark = vec3(0.10, 0.18, 0.08);
          vec3 plastronCream = vec3(0.91, 0.88, 0.78);

          vec3 shellColor = mix(oliveBase, amberMargin, 0.35);
          shellColor = mix(shellColor, scuteDark, scuteBorder * 0.65);

          // Plastron underbelly
          vec3 baseAlbedo = mix(shellColor, plastronCream, vIsPlastron * 0.85);

          // Fresnel rim glow
          float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);
          vec3 halfVec = normalize(uSunDir + viewDir);
          float spec = pow(max(0.0, dot(normal, halfVec)), 28.0) * 1.2;

          vec3 finalCol = mix(baseAlbedo, uDeepWaterColor, 0.06) + uSunColor * spec * 0.75 + vec3(0.0, 0.45, 0.65) * fresnel * 0.45;
          gl_FragColor = vec4(finalCol, 1.0);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,side:gt},U=new Mt(Ke);this._seaTurtleShader=U;let xe=[{cx:15,cy:-8.5,cz:2225,radiusX:35,radiusZ:40,count:2},{cx:-18,cy:-14,cz:2275,radiusX:42,radiusZ:48,count:2},{cx:-35,cy:-18.5,cz:2245,radiusX:38,radiusZ:42,count:2},{cx:38,cy:-12,cz:2290,radiusX:45,radiusZ:50,count:2},{cx:-42,cy:-22,cz:2330,radiusX:52,radiusZ:56,count:2},{cx:0,cy:-26,cz:2360,radiusX:58,radiusZ:64,count:2},{cx:-45,cy:-6.5,cz:1150,radiusX:55,radiusZ:65,count:2},{cx:55,cy:-7.5,cz:1220,radiusX:60,radiusZ:70,count:2},{cx:10,cy:-55,cz:2450,radiusX:80,radiusZ:90,count:4},{cx:-20,cy:-85,cz:2550,radiusX:100,radiusZ:110,count:6},{cx:40,cy:-105,cz:2600,radiusX:120,radiusZ:130,count:4}],Ce=[],Pe=yt(111444);xe.forEach(d=>{for(let le=0;le<d.count;le++){let fe=le/d.count*Math.PI*2+(Pe()-.5)*.4,me=(Pe()*.6+.4)*d.radiusX,be=(Pe()*.6+.4)*d.radiusZ,Fe=(Pe()-.5)*2;Ce.push({center:new A(d.cx,d.cy,d.cz),radiusX:me,radiusZ:be,angle:fe,speed:.25+Pe()*.15,orbitSpeed:.035+Pe()*.02,dir:Pe()<.5?1:-1,wanderAmp:Pe()*6+3,vertAmp:Pe()*.3+.2,yOffset:Fe,scale:2.5+Pe()*.4,phase:Pe()*Math.PI*2,color:[.22+Pe()*.04,.42+Pe()*.06,.18+Pe()*.04]})}});let B=Ce.length;Ue.computeBoundingSphere();let X=new ut(Ue,U,B),G=new Float32Array(B),D=new Float32Array(B),z=new Float32Array(B*3);Ce.forEach((d,le)=>{G[le]=d.phase,D[le]=d.speed,z[le*3]=d.color[0],z[le*3+1]=d.color[1],z[le*3+2]=d.color[2];let fe=d.cx+Math.cos(d.phase)*d.radiusX,me=d.cz+Math.sin(d.phase)*d.radiusZ;g.position.set(fe,d.cy,me),g.rotation.set(0,d.phase+Math.PI/2,0),g.scale.setScalar(d.scale),g.updateMatrix(),X.setMatrixAt(le,g.matrix)}),Ue.setAttribute("aPhase",new Ft(G,1)),Ue.setAttribute("aSpeed",new Ft(D,1)),Ue.setAttribute("aColor",new Ft(z,3)),X.instanceMatrix.needsUpdate=!0,X.frustumCulled=!1,X.castShadow=!1,X.receiveShadow=!1,this._seaTurtleData=Ce,this._seaTurtleMesh=X,this.world.scene.add(X);let W=this._buildMantaRayMesh(),ee={uniforms:{uTime:{value:0},uDeepWaterColor:{value:new Me(403512)},uSunDir:{value:new A(.4,.8,.5).normalize()},uSunColor:{value:new Me(16772829)}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        attribute float aPhase;
        attribute float aSpeed;
        varying vec2 vUv;
        varying vec3 vCustomWorldNormal;
        varying vec3 vWorldPos;
        varying float vIsVentral;
        varying float vWingSpan;
        uniform float uTime;

        void main() {
          vUv = uv;
          vec3 pos = position;

          float swimSpeed = 1.8 * aSpeed;
          float wingTime = uTime * swimSpeed + aPhase;

          // Wingtip fluid flapping: amplitude increases non-linearly with distance from centerline (|x|)
          float spanNorm = clamp(abs(pos.x) / 3.4, 0.0, 1.0);
          float wingFlap = sin(wingTime + pos.z * 0.45) * pow(spanNorm, 1.7) * 0.95;
          pos.y += wingFlap;

          // Whip tail traveling undulation wave
          float tailFactor = smoothstep(-1.0, -5.5, pos.z);
          pos.x += sin(wingTime * 1.5 + pos.z * 1.2) * 0.35 * tailFactor;
          pos.y += cos(wingTime * 1.5 + pos.z * 1.2) * 0.25 * tailFactor;

          // Majestic pitch glide
          pos.y += cos(wingTime * 0.4) * 0.12;

          vIsVentral = step(pos.y, -0.02);
          vWingSpan = spanNorm;

          vec4 wPos = modelMatrix * vec4(pos, 1.0);
          vWorldPos = wPos.xyz;
          vCustomWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          gl_Position = projectionMatrix * viewMatrix * wPos;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform float uTime;
        uniform vec3 uDeepWaterColor;
        uniform vec3 uSunDir;
        uniform vec3 uSunColor;
        varying vec2 vUv;
        varying vec3 vCustomWorldNormal;
        varying vec3 vWorldPos;
        varying float vIsVentral;
        varying float vWingSpan;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPos + vec3(0.0001));
          vec3 normal = normalize(vCustomWorldNormal);

          // Dorsal: Midnight obsidian with chevron celestial cyan wing markings
          vec3 midnightObsidian = vec3(0.04, 0.08, 0.14);
          vec3 celestialCyan = vec3(0.22, 0.72, 0.92);
          float chevron = sin(vWorldPos.z * 2.2 - abs(vWorldPos.x) * 1.8) * 0.5 + 0.5;
          float spotPattern = smoothstep(0.68, 0.85, chevron) * vWingSpan;
          vec3 dorsalCol = mix(midnightObsidian, celestialCyan, spotPattern * 0.55);

          // Ventral: Lunar pearl white
          vec3 ventralWhite = vec3(0.92, 0.95, 0.98);
          vec3 baseCol = mix(dorsalCol, ventralWhite, vIsVentral * 0.90);

          // Fresnel rim glow & specular glints
          float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.2);
          vec3 halfVec = normalize(uSunDir + viewDir);
          float spec = pow(max(0.0, dot(normal, halfVec)), 32.0) * 1.5;

          vec3 finalCol = mix(baseCol, uDeepWaterColor, 0.05) + uSunColor * spec * 0.85 + vec3(0.1, 0.6, 0.85) * fresnel * 0.55;
          gl_FragColor = vec4(finalCol, 1.0);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,side:gt},ue=new Mt(ee);this._mantaRayShader=ue;let ge=[{cx:10,cy:-18.5,cz:2235,radiusX:45,radiusZ:55,speed:.26,orbitSpeed:.028,scale:3.2,phase:.6,dir:1},{cx:-20,cy:-24,cz:2270,radiusX:52,radiusZ:60,speed:.24,orbitSpeed:.025,scale:3.5,phase:2.4,dir:-1},{cx:-38,cy:-28.5,cz:2230,radiusX:48,radiusZ:56,speed:.25,orbitSpeed:.027,scale:3.1,phase:1.2,dir:1},{cx:32,cy:-32,cz:2285,radiusX:58,radiusZ:66,speed:.22,orbitSpeed:.022,scale:3.4,phase:4.6,dir:-1},{cx:-45,cy:-12,cz:1240,radiusX:85,radiusZ:95,speed:.22,orbitSpeed:.024,scale:3,phase:0,dir:1},{cx:55,cy:-14.5,cz:1300,radiusX:90,radiusZ:100,speed:.2,orbitSpeed:.022,scale:3.2,phase:3.5,dir:-1},{cx:20,cy:-15.5,cz:2255,radiusX:55,radiusZ:65,speed:.28,orbitSpeed:.03,scale:2.8,phase:1.6,dir:-1},{cx:-10,cy:-22,cz:2260,radiusX:62,radiusZ:70,speed:.23,orbitSpeed:.024,scale:3.7,phase:3.4,dir:1},{cx:-28,cy:-30.5,cz:2250,radiusX:58,radiusZ:66,speed:.26,orbitSpeed:.026,scale:2.9,phase:2.2,dir:-1},{cx:42,cy:-35,cz:2305,radiusX:68,radiusZ:76,speed:.21,orbitSpeed:.021,scale:3.6,phase:5.6,dir:1},{cx:-35,cy:-15,cz:1260,radiusX:95,radiusZ:105,speed:.24,orbitSpeed:.026,scale:3.3,phase:1,dir:-1},{cx:65,cy:-17.5,cz:1280,radiusX:100,radiusZ:110,speed:.21,orbitSpeed:.023,scale:3.5,phase:4.5,dir:1},{cx:0,cy:-45,cz:2400,radiusX:120,radiusZ:140,speed:.18,orbitSpeed:.018,scale:4.2,phase:.5,dir:1},{cx:-20,cy:-50,cz:2450,radiusX:130,radiusZ:150,speed:.19,orbitSpeed:.019,scale:4,phase:2.5,dir:-1},{cx:20,cy:-55,cz:2430,radiusX:140,radiusZ:160,speed:.17,orbitSpeed:.017,scale:4.5,phase:4.5,dir:1}];ge.forEach(d=>{d.center={x:d.cx,y:d.cy,z:d.cz},d.yOffset=0,d.wanderAmp=15,d.vertAmp=5});let we=ge.length;W.computeBoundingSphere();let _e=new ut(W,ue,we),Ze=new Float32Array(we),Oe=new Float32Array(we);ge.forEach((d,le)=>{Ze[le]=d.phase,Oe[le]=d.speed;let fe=d.cx+Math.cos(d.phase)*d.radiusX,me=d.cz+Math.sin(d.phase)*d.radiusZ;g.position.set(fe,d.cy,me),g.rotation.set(0,d.phase+Math.PI/2,0),g.scale.setScalar(d.scale),g.updateMatrix(),_e.setMatrixAt(le,g.matrix)}),W.setAttribute("aPhase",new Ft(Ze,1)),W.setAttribute("aSpeed",new Ft(Oe,1)),_e.instanceMatrix.needsUpdate=!0,_e.frustumCulled=!1,_e.castShadow=!1,_e.receiveShadow=!1,this._mantaRayData=ge,this._mantaRayMesh=_e,this.world.scene.add(_e);let st=this._buildDolphinMesh(),vt=new ot({color:4020334,roughness:.18,metalness:.08,envMapIntensity:1.4}),At=[{cx:30,cy:-12,cz:2260,radiusX:90,radiusZ:110,count:8},{cx:-75,cy:-18,cz:1950,radiusX:110,radiusZ:125,count:6},{cx:85,cy:-8,cz:1400,radiusX:95,radiusZ:105,count:6},{cx:10,cy:-55,cz:2450,radiusX:130,radiusZ:140,count:12},{cx:-30,cy:-85,cz:2550,radiusX:150,radiusZ:165,count:10}],pt=[],Tt=yt(882233);At.forEach(d=>{for(let le=0;le<d.count;le++){let fe=le/d.count*Math.PI*2+(Tt()-.5)*.4,me=(Tt()*.6+.4)*d.radiusX,be=(Tt()*.6+.4)*d.radiusZ,Fe=(Tt()-.5)*6;pt.push({center:new A(d.cx,d.cy,d.cz),radiusX:me,radiusZ:be,angle:fe,speed:.85+Tt()*.45,orbitSpeed:.09+Tt()*.08,dir:Tt()<.5?1:-1,wanderAmp:Tt()*10+5,yOffset:Fe,scale:1.6+Tt()*.4,phase:Tt()*Math.PI*2})}});let xt=pt.length;st.computeBoundingSphere();let Pt=new ut(st,vt,xt);pt.forEach((d,le)=>{let fe=d.center.x+Math.cos(d.angle)*d.radiusX,me=d.center.z+Math.sin(d.angle)*d.radiusZ,be=d.center.y+d.yOffset;g.position.set(fe,be,me),g.rotation.set(0,d.angle+Math.PI/2,0),g.scale.setScalar(d.scale),g.updateMatrix(),Pt.setMatrixAt(le,g.matrix)}),Pt.instanceMatrix.needsUpdate=!0,Pt.frustumCulled=!1,Pt.castShadow=!0,Pt.receiveShadow=!1,this._dolphinData=pt,this._dolphinMesh=Pt,this.world.scene.add(Pt);let St=this._buildSharkMesh(),Gt=new ot({color:2832450,roughness:.32,metalness:.06,envMapIntensity:1.2}),Nt=[{cx:-20,cy:-20,cz:2340,radiusX:110,radiusZ:130,count:6},{cx:70,cy:-34,cz:2440,radiusX:135,radiusZ:155,count:6},{cx:-70,cy:-16,cz:1650,radiusX:95,radiusZ:110,count:4},{cx:15,cy:-65,cz:2500,radiusX:150,radiusZ:170,count:8},{cx:-45,cy:-95,cz:2550,radiusX:160,radiusZ:185,count:8},{cx:50,cy:-125,cz:2600,radiusX:190,radiusZ:210,count:12}],zt=[],Dt=yt(993311);Nt.forEach(d=>{for(let le=0;le<d.count;le++){let fe=le/d.count*Math.PI*2+(Dt()-.5)*.5,me=(Dt()*.6+.4)*d.radiusX,be=(Dt()*.6+.4)*d.radiusZ,Fe=(Dt()-.5)*4;zt.push({center:new A(d.cx,d.cy,d.cz),radiusX:me,radiusZ:be,angle:fe,speed:.48+Dt()*.32,orbitSpeed:.055+Dt()*.045,dir:Dt()<.5?1:-1,wanderAmp:Dt()*12+6,yOffset:Fe,scale:1.7+Dt()*.5,phase:Dt()*Math.PI*2})}});let wo=zt.length;St.computeBoundingSphere();let j=new ut(St,Gt,wo);zt.forEach((d,le)=>{let fe=d.center.x+Math.cos(d.angle)*d.radiusX,me=d.center.z+Math.sin(d.angle)*d.radiusZ,be=d.center.y+d.yOffset;g.position.set(fe,be,me),g.rotation.set(0,d.angle+Math.PI/2,0),g.scale.setScalar(d.scale),g.updateMatrix(),j.setMatrixAt(le,g.matrix)}),j.instanceMatrix.needsUpdate=!0,j.frustumCulled=!1,j.castShadow=!0,j.receiveShadow=!1,this._sharkData=zt,this._sharkMesh=j,this.world.scene.add(j);let Ee=220,de=new Et,Xe=new Float32Array(Ee*3),et=new Float32Array(Ee*3),nt=[...L,...S,...ne];for(let d=0;d<Ee;d++){let le=nt[d%nt.length],fe=Math.random()*Math.PI*2,me=Math.random()*le.radiusX,be=Math.random()*le.radiusZ;Xe[d*3]=le.cx+Math.cos(fe)*me,Xe[d*3+1]=le.cy-3.8+Math.random()*4.2,Xe[d*3+2]=le.cz+Math.sin(fe)*be,et[d*3]=1.4+Math.random()*2.8,et[d*3+1]=.2+Math.random()*.45,et[d*3+2]=Math.random()*100}de.setAttribute("position",new tt(Xe,3)),de.setAttribute("aBubbleData",new tt(et,3)),de.computeBoundingSphere();let Q=new Mt({uniforms:{uTime:{value:0}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        attribute vec3 aBubbleData;
        varying float vAlpha;
        uniform float uTime;

        void main() {
          vec3 pos = position;
          float t = mod(uTime * aBubbleData.x + aBubbleData.z, 6.0);
          pos.y += t;
          pos.x += sin(uTime * 3.0 + aBubbleData.z) * aBubbleData.y;
          pos.z += cos(uTime * 2.5 + aBubbleData.z) * aBubbleData.y;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = min(32.0, 48.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
          vAlpha = smoothstep(0.0, 0.8, t) * (1.0 - smoothstep(4.5, 6.0, t));
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float r = length(uv);
          if (r > 0.5) discard;
          float ring = (1.0 - smoothstep(0.38, 0.48, r)) * smoothstep(0.18, 0.38, r);
          float core = (1.0 - smoothstep(0.0, 0.5, r)) * 0.3;
          gl_FragColor = vec4(vec3(0.82, 0.95, 1.0), (ring + core) * vAlpha * 0.85);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,blending:Ht});this._bubbleMat=Q;let Ge=new co(de,Q);Ge.frustumCulled=!0,this.world.scene.add(Ge);let Ie=Yt(new Vt(1.6,1),.14,.45,88);Ko(Ie,175,.55);let We=pe.photogrammetryRock(1.5);We.vertexColors=!0;let $e=56,J=new ut(Ie,We,$e),re=new Lt,ke=yt(112233);for(let d=0;d<$e;d++){let fe=(d%2===0?1:-1)*(16+ke()*14),me=-505+(ke()-.5)*55,be=ze(fe,me)+.45,Fe=.6+ke()*.7;re.position.set(fe,be,me),re.rotation.set(ke()*.4,ke()*Math.PI*2,ke()*.4),re.scale.set(Fe*(.8+ke()*.5),Fe,Fe*(.8+ke()*.5)),re.updateMatrix(),J.setMatrixAt(d,re.matrix)}J.instanceMatrix.needsUpdate=!0,J.frustumCulled=!1,J.castShadow=!1,J.receiveShadow=!0,this.world.scene.add(J);let Te=(()=>{let d=[],le=new F(.35,.65,7.5,8,6);le.rotateZ(Math.PI/2);let fe=le.attributes.position;for(let Fe=0;Fe<fe.count;Fe++){let Qe=fe.getX(Fe);fe.setY(Fe,fe.getY(Fe)+Math.sin(Qe*.6)*.45),fe.setZ(Fe,fe.getZ(Fe)+Math.cos(Qe*.7)*.35)}le.computeVertexNormals(),d.push(le);let me=new F(.18,.32,3.2,6);me.rotateZ(.65),me.rotateY(.45),me.translate(2.2,.6,.4);let be=new F(.15,.28,2.8,6);return be.rotateZ(-.75),be.rotateY(-.35),be.translate(-2.4,.5,-.3),d.push(me,be),je(d,!1)||le})(),Re=pe.sunkenDriftwood?pe.sunkenDriftwood(2):pe.timber(1.5),he=20,Be=new ut(Te,Re,he),He=new Lt,Je=yt(441199);for(let d=0;d<he;d++){let le=400+Je()*75,fe=-275-Je()*65,me=6.3+Je()*.7,be=.9+Je()*.6;He.position.set(le,me,fe),He.rotation.set((Je()-.5)*.15,Je()*Math.PI*2,(Je()-.5)*.15),He.scale.set(be,be,be),He.updateMatrix(),Be.setMatrixAt(d,He.matrix)}Be.instanceMatrix.needsUpdate=!0,Be.frustumCulled=!1,this.world.scene.add(Be);let it=Yt(new Vt(.65,1),.12,.35,33),wt=pe.riverPebbles?pe.riverPebbles(1):pe.rockCliff(2),bt=130,Wt=new ut(it,wt,bt),fo=new Lt,Qt=yt(228844);for(let d=0;d<bt;d++){let le=d>=90,fe,me,be;le?(fe=100+(Qt()-.5)*35,me=240+Qt()*80,be=9.2+Qt()*.4):(fe=395+Qt()*80,me=-270-Qt()*70,be=6.3+Qt()*.5);let Fe=.5+Qt()*1.1;fo.position.set(fe,be,me),fo.rotation.set(Qt()*Math.PI,Qt()*Math.PI,Qt()*Math.PI),fo.scale.set(Fe*(.8+Qt()*.4),Fe*.5,Fe*(.8+Qt()*.4)),fo.updateMatrix(),Wt.setMatrixAt(d,fo.matrix)}Wt.instanceMatrix.needsUpdate=!0,Wt.frustumCulled=!1,this.world.scene.add(Wt);let go=(()=>{let d=[],le=new F(.04,.08,6.3,5,8);le.translate(0,3.15,0);let fe=le.attributes.position;for(let me=0;me<fe.count;me++){let be=fe.getY(me);fe.setX(me,fe.getX(me)+Math.sin(be*1.2)*.22),fe.setZ(me,fe.getZ(me)+Math.cos(be*1.1)*.22)}le.computeVertexNormals(),d.push(le);for(let me=0;me<4;me++){let be=me/4*Math.PI*2,Fe=new F(.02,.05,1.8,4);Fe.rotateZ(.75),Fe.rotateY(be),Fe.translate(Math.cos(be)*.4,.6,Math.sin(be)*.4),d.push(Fe)}return je(d,!1)||le})(),zo=new ot({color:2250802,emissive:535061,emissiveIntensity:.25,roughness:.75,metalness:.05}),po=90,oo=new ut(go,zo,po),eo=new Lt,lo=yt(551122);for(let d=0;d<po;d++){let le=S[d%S.length],fe=lo()*Math.PI*2,me=(.1+lo()*.85)*le.radiusX,be=le.cx+Math.cos(fe)*me,Fe=le.cz+Math.sin(fe)*me;eo.position.set(be,6.2,Fe),eo.rotation.set((lo()-.5)*.18,lo()*Math.PI*2,(lo()-.5)*.18),eo.scale.set(1,.85+lo()*.35,1),eo.updateMatrix(),oo.setMatrixAt(d,eo.matrix)}oo.instanceMatrix.needsUpdate=!0,oo.frustumCulled=!1,this.world.scene.add(oo);let io=360,Se=new Et,Ne=new Float32Array(io*3),Ve=new Float32Array(io*3),Ye=yt(773311);for(let d=0;d<io;d++){let le=Ye()*Math.PI*2,fe=20+Ye()*160;Ne[d*3]=420+Math.cos(le)*fe,Ne[d*3+1]=12.8+Ye()*18,Ne[d*3+2]=-290+Math.sin(le)*(fe*.85),Ve[d*3]=.4+Ye()*.8,Ve[d*3+1]=1.2+Ye()*2.2,Ve[d*3+2]=Ye()*100}Se.setAttribute("position",new tt(Ne,3)),Se.setAttribute("aMistData",new tt(Ve,3)),Se.computeBoundingSphere();let at=new Mt({uniforms:{uTime:{value:0}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        attribute vec3 aMistData;
        varying float vAlpha;
        varying float vGlint;
        uniform float uTime;

        void main() {
          vec3 pos = position;
          float t = mod(uTime * aMistData.x * 0.35 + aMistData.z, 14.0);
          pos.y += t * 1.2;
          pos.x += sin(uTime * 0.4 + aMistData.z) * aMistData.y;
          pos.z += cos(uTime * 0.35 + aMistData.z * 1.3) * aMistData.y;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = min(64.0, 95.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
          vAlpha = smoothstep(0.0, 2.5, t) * (1.0 - smoothstep(9.5, 14.0, t));
          vGlint = sin(pos.x * 0.15 + pos.y * 0.2 + uTime * 0.8) * 0.5 + 0.5;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        varying float vAlpha;
        varying float vGlint;
        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float r = length(uv);
          if (r > 0.5) discard;
          float soft = 1.0 - smoothstep(0.0, 0.5, r);
          vec3 goldMist = mix(vec3(1.0, 0.88, 0.55), vec3(1.0, 0.72, 0.38), vGlint);
          gl_FragColor = vec4(goldMist, soft * vAlpha * 0.38);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,blending:Ht});this._lakeMistShader=at;let ft=new co(Se,at);ft.frustumCulled=!1,this.world.scene.add(ft);let Ae=yt(994422),Xt=(()=>{let d=[],le=new F(.18,.28,1.8,6);le.translate(0,.9,0),d.push(le);let fe=new F(.12,.16,1.4,5);fe.rotateZ(.42),fe.translate(-.35,1.6,0);let me=new F(.1,.14,1.2,5);me.rotateZ(-.48),me.translate(.35,1.7,.1);let be=new F(.08,.11,1,5);be.rotateX(.45),be.translate(0,1.9,-.3);let Fe=new F(.08,.11,.9,5);Fe.rotateX(-.4),Fe.translate(0,2,.3),d.push(fe,me,be,Fe);let Qe=new lt(.08,.4,5);Qe.rotateZ(.42),Qe.translate(-.68,2.2,0);let Rt=new lt(.08,.4,5);return Rt.rotateZ(-.48),Rt.translate(.68,2.2,.1),d.push(Qe,Rt),je(d,!1)||le})(),Zt=new ot({roughness:.65,metalness:.08,vertexColors:!0,side:gt});this._staghornMat=Zt;let to=432,qt=new ut(Xt,Zt,to),Ut=new Float32Array(to*3),Mo=[[1,.42,.28],[0,.9,1],[.88,.28,.92],[.98,.72,.15],[.22,.92,.65]];for(let d=0;d<to;d++){let le=d>=102,fe,me,be;le?(fe=(Ae()-.5)*85,me=2210+Ae()*110,be=-10.2+Ae()*4.4):(fe=(Ae()-.5)*320,me=990+Ae()*300,be=-7.2+Ae()*4.2);let Fe=.9+Ae()*1.4;g.position.set(fe,be,me),g.rotation.set((Ae()-.5)*.25,Ae()*Math.PI*2,(Ae()-.5)*.25),g.scale.set(Fe,Fe*(.9+Ae()*.4),Fe),g.updateMatrix(),qt.setMatrixAt(d,g.matrix);let Qe=Mo[Math.floor(Ae()*Mo.length)];Ut[d*3]=Qe[0],Ut[d*3+1]=Qe[1],Ut[d*3+2]=Qe[2]}Xt.setAttribute("color",new Ft(Ut,3)),qt.instanceMatrix.needsUpdate=!0,qt.frustumCulled=!1,this.world.scene.add(qt);let _o=(()=>{let d=[],le=new F(.35,.55,1.4,6);le.translate(0,.7,0),d.push(le);let fe=new ce(1.8,.22,1.2);fe.rotateZ(.28),fe.rotateY(.35),fe.translate(-.6,1.6,.2);let me=new ce(1.6,.2,1.4);me.rotateZ(-.32),me.rotateY(-.4),me.translate(.6,1.7,-.2);let be=new ce(1.4,.18,1.1);return be.rotateX(.3),be.translate(0,2,.4),d.push(fe,me,be),je(d,!1)||le})(),ko=new ot({roughness:.6,metalness:.08,vertexColors:!0,side:gt});this._elkhornMat=ko;let Jo=288,Io=new ut(_o,ko,Jo),ps=new Float32Array(Jo*3);for(let d=0;d<Jo;d++){let le=d>=72,fe,me,be;le?(fe=(Ae()-.5)*80,me=2215+Ae()*105,be=-10.4+Ae()*4.5):(fe=(Ae()-.5)*300,me=1010+Ae()*290,be=-7.5+Ae()*4);let Fe=1+Ae()*1.5;g.position.set(fe,be,me),g.rotation.set((Ae()-.5)*.2,Ae()*Math.PI*2,(Ae()-.5)*.2),g.scale.set(Fe,Fe*.9,Fe),g.updateMatrix(),Io.setMatrixAt(d,g.matrix);let Qe=Mo[Math.floor(Ae()*Mo.length)];ps[d*3]=Qe[0],ps[d*3+1]=Qe[1],ps[d*3+2]=Qe[2]}_o.setAttribute("color",new Ft(ps,3)),Io.instanceMatrix.needsUpdate=!0,Io.frustumCulled=!1,this.world.scene.add(Io);let ln=(()=>{let d=new rt(2.4,32,24,0,Math.PI*2,0,Math.PI*.56);d.scale(1,.75,1);let le=d.attributes.position,fe=d.attributes.normal||d.computeVertexNormals()||d.attributes.normal,me=new A,be=new A;for(let Fe=0;Fe<le.count;Fe++){me.set(le.getX(Fe),le.getY(Fe),le.getZ(Fe)),be.set(fe.getX(Fe),fe.getY(Fe),fe.getZ(Fe));let Qe=Math.sin(me.x*5.5+Math.sin(me.z*4.5)*2.2),Rt=Math.cos(me.z*5.5+Math.cos(me.x*4.5)*2.2),Oo=Qe*Rt*.22;me.addScaledVector(be,Oo),le.setXYZ(Fe,me.x,me.y,me.z)}return d.computeVertexNormals(),d})(),hn=new ot({color:16007006,emissive:14362487,emissiveIntensity:2.2,roughness:.65,metalness:.1,vertexColors:!0});this._coralMat=hn;let Vs=456,No=new ut(ln,hn,Vs),ms=new Float32Array(Vs*3),dn=[[.96,.25,.37],[.98,.57,.24],[.66,.33,.97],[.05,.84,.63],[.15,.75,.98]];for(let d=0;d<Vs;d++){let le=d>=114,fe,me,be;le?(fe=(Ae()-.5)*80,me=2210+Ae()*110,be=-10.2+Ae()*4.6):(fe=(Ae()-.5)*340,me=980+Ae()*320,be=-6.8+Ae()*4.5);let Fe=.9+Ae()*1.5;g.position.set(fe,be,me),g.rotation.set(Ae()*.5,Ae()*Math.PI*2,Ae()*.5),g.scale.set(Fe,Fe*.85,Fe),g.updateMatrix(),No.setMatrixAt(d,g.matrix);let Qe=dn[Math.floor(Ae()*dn.length)];ms[d*3]=Qe[0],ms[d*3+1]=Qe[1],ms[d*3+2]=Qe[2]}ln.setAttribute("color",new Ft(ms,3)),No.instanceMatrix.needsUpdate=!0,No.frustumCulled=!1,No.castShadow=!1,No.receiveShadow=!1,this.world.scene.add(No);let un=(()=>{let d=[],le=new F(.45,.65,.6,8);le.translate(0,.3,0),d.push(le);let fe=14;for(let me=0;me<fe;me++){let be=me/fe*Math.PI*2,Fe=new F(.03,.08,1.3,4);Fe.rotateZ(.35),Fe.rotateY(be),Fe.translate(Math.cos(be)*.4,.95,Math.sin(be)*.4),d.push(Fe)}return je(d,!1)||le})(),Ha={uniforms:{uTime:{value:0}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        attribute vec3 aColor;
        varying vec2 vUv;
        varying vec3 vCustomWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vAnemoneColor;
        uniform float uTime;

        void main() {
          vUv = uv;
          vAnemoneColor = aColor;
          vec3 pos = position;

          // Tentacle gentle waving sway with height factor
          float h = smoothstep(0.3, 1.4, pos.y);
          pos.x += sin(uTime * 2.2 + pos.y * 3.0 + pos.z * 2.0) * 0.15 * h;
          pos.z += cos(uTime * 1.8 + pos.y * 2.5 + pos.x * 2.0) * 0.15 * h;

          vec4 wPos = modelMatrix * vec4(pos, 1.0);
          vWorldPos = wPos.xyz;
          vCustomWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          gl_Position = projectionMatrix * viewMatrix * wPos;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vCustomWorldNormal;
        varying vec3 vWorldPos;
        varying vec3 vAnemoneColor;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPos + vec3(0.0001));
          vec3 normal = normalize(vCustomWorldNormal);

          float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.5);
          float pulse = sin(uTime * 2.5 + vWorldPos.x * 0.5 + vWorldPos.z * 0.5) * 0.25 + 0.75;
          vec3 emissiveGlow = vAnemoneColor * pulse * 0.85;

          vec3 finalCol = vAnemoneColor * 0.75 + emissiveGlow + vec3(fresnel * 0.45);
          gl_FragColor = vec4(finalCol, 0.95);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,transparent:!1,side:gt},fn=new Mt(Ha);this._anemoneMat=fn;let Ws=128,Es=new ut(un,fn,Ws),ws=new Float32Array(Ws*3),pn=[[1,.35,.55],[.25,.95,.82],[.78,.42,.98],[1,.65,.32]];for(let d=0;d<Ws;d++){let le=d>=32,fe,me,be;le?(fe=(Ae()-.5)*75,me=2215+Ae()*100,be=-10+Ae()*4.4):(fe=(Ae()-.5)*290,me=1e3+Ae()*280,be=-7+Ae()*4);let Fe=.9+Ae()*1.3;g.position.set(fe,be,me),g.rotation.set((Ae()-.5)*.2,Ae()*Math.PI*2,(Ae()-.5)*.2),g.scale.set(Fe,Fe,Fe),g.updateMatrix(),Es.setMatrixAt(d,g.matrix);let Qe=pn[Math.floor(Ae()*pn.length)];ws[d*3]=Qe[0],ws[d*3+1]=Qe[1],ws[d*3+2]=Qe[2]}un.setAttribute("aColor",new Ft(ws,3)),Es.instanceMatrix.needsUpdate=!0,Es.frustumCulled=!1,this.world.scene.add(Es);let _a=(()=>{let d=[],le=new F(.06,.12,13,5,8);le.translate(0,6.5,0),d.push(le);for(let fe=0;fe<10;fe++){let me=2+fe*1.1,be=new ct(.9,2.4,2,4),Fe=(fe%2===0?1:-1)*.65+fe*.8;be.rotateZ(.45*(fe%2===0?1:-1)),be.rotateY(Fe),be.translate(Math.cos(Fe)*.3,me,Math.sin(Fe)*.3),d.push(be)}return je(d,!1)||le})(),Sa={uniforms:{uTime:{value:0}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        varying vec2 vUv;
        varying vec3 vCustomWorldNormal;
        varying vec3 vWorldPos;
        uniform float uTime;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Undulating ocean current sway along height
          float heightFactor = smoothstep(0.5, 13.0, pos.y);
          float sway = sin(uTime * 1.4 + pos.y * 0.35 + modelMatrix[3][0] * 0.05) * 1.4 * heightFactor;
          float swayZ = cos(uTime * 1.1 + pos.y * 0.28 + modelMatrix[3][2] * 0.05) * 0.9 * heightFactor;
          pos.x += sway;
          pos.z += swayZ;

          vec4 wPos = modelMatrix * vec4(pos, 1.0);
          vWorldPos = wPos.xyz;
          vCustomWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          gl_Position = projectionMatrix * viewMatrix * wPos;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vCustomWorldNormal;
        varying vec3 vWorldPos;

        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPos + vec3(0.0001));
          vec3 normal = normalize(vCustomWorldNormal);

          // Translucent amber-emerald kelp gradient
          vec3 baseKelp = vec3(0.18, 0.38, 0.12);
          vec3 sunlitKelp = vec3(0.52, 0.68, 0.22);
          vec3 amberKelp = vec3(0.68, 0.54, 0.18);

          float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.2);
          vec3 kelpCol = mix(baseKelp, sunlitKelp, smoothstep(2.0, 10.0, vWorldPos.y + 11.0));
          kelpCol = mix(kelpCol, amberKelp, fresnel * 0.45);

          gl_FragColor = vec4(kelpCol, 0.92);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,transparent:!1,side:gt},mn=new Mt(Sa);this._kelpMat=mn;let En=152,gs=new ut(_a,mn,En);for(let d=0;d<En;d++){let le=d>=38,fe,me,be;le?(fe=(Ae()-.5)*90,me=2210+Ae()*110,be=-10.8):(fe=(Ae()-.5)*340,me=980+Ae()*320,be=-8.2);let Fe=.85+Ae()*.5;g.position.set(fe,be,me),g.rotation.set((Ae()-.5)*.15,Ae()*Math.PI*2,(Ae()-.5)*.15),g.scale.set(Fe,Fe*(.9+Ae()*.4),Fe),g.updateMatrix(),gs.setMatrixAt(d,g.matrix)}gs.instanceMatrix.needsUpdate=!0,gs.frustumCulled=!1,this.world.scene.add(gs);let Ca=(()=>{let d=new F(.75,1.3,5,6);d.translate(0,2.5,0);let le=new lt(.75,1.8,6);return le.translate(0,5.9,0),je([d,le],!1)||d})(),wn=new ot({color:440020,emissive:2282478,emissiveIntensity:2.6,roughness:.12,metalness:.25});this._reefCrystalMat=wn;let gn=84,Vo=new ut(Ca,wn,gn);for(let d=0;d<gn;d++){let le=d>=20,fe,me,be;le?(fe=(Ae()-.5)*75,me=2220+Ae()*100,be=-10.5+Ae()*4.8):(fe=(Ae()-.5)*260,me=1040+Ae()*240,be=-8.5+Ae()*4);let Fe=1+Ae()*1.6;g.position.set(fe,be,me),g.rotation.set((Ae()-.5)*.25,Ae()*Math.PI*2,(Ae()-.5)*.25),g.scale.set(Fe,Fe*(1+Ae()*.6),Fe),g.updateMatrix(),Vo.setMatrixAt(d,g.matrix)}Vo.instanceMatrix.needsUpdate=!0,Vo.frustumCulled=!1,Vo.castShadow=!1,Vo.receiveShadow=!1,this.world.scene.add(Vo);let Pa=(()=>{let d=new ct(2.4,2.8,4,4);return d.translate(0,1.4,0),d})(),Ga=new ot({color:15485081,emissive:10295117,emissiveIntensity:.75,roughness:.6,side:gt}),vn=112,Wo=new ut(Pa,Ga,vn);for(let d=0;d<vn;d++){let le=d>=28,fe,me,be;le?(fe=(Ae()-.5)*80,me=2215+Ae()*105,be=-9.8+Ae()*4.2):(fe=(Ae()-.5)*280,me=1010+Ae()*280,be=-6.5+Ae()*4);let Fe=1+Ae()*1.2;g.position.set(fe,be,me),g.rotation.set((Ae()-.5)*.35,Ae()*Math.PI*2,(Ae()-.5)*.35),g.scale.set(Fe,Fe,Fe),g.updateMatrix(),Wo.setMatrixAt(d,g.matrix)}Wo.instanceMatrix.needsUpdate=!0,Wo.frustumCulled=!1,Wo.castShadow=!1,Wo.receiveShadow=!1,this.world.scene.add(Wo);let za=(()=>{let d=[];for(let fe=0;fe<5;fe++){let me=fe/5*Math.PI*2,be=new ct(.12,1.4,2,4),Fe=be.attributes.position;for(let Qe=0;Qe<Fe.count;Qe++){let Rt=Fe.getY(Qe),Oo=Math.pow((Rt+.7)/1.4,1.8)*.35;Fe.setZ(Qe,Fe.getZ(Qe)+Oo)}be.computeVertexNormals(),be.rotateY(me),be.translate(Math.cos(me)*.15,.7,Math.sin(me)*.15),d.push(be)}return je(d,!1)||d[0]})(),ka=new ot({color:1332013,roughness:.65,side:gt}),yn=192,Uo=new ut(za,ka,yn);for(let d=0;d<yn;d++){let le=d>=48,fe,me,be;le?(fe=(Ae()-.5)*85,me=2210+Ae()*110,be=-10.5+Ae()*4.6):(fe=(Ae()-.5)*320,me=990+Ae()*300,be=-7.5+Ae()*4.2);let Fe=.6+Ae()*.6;g.position.set(fe,be,me),g.rotation.set((Ae()-.5)*.2,Ae()*Math.PI*2,(Ae()-.5)*.2),g.scale.set(Fe,Fe*(.8+Ae()*.5),Fe),g.updateMatrix(),Uo.setMatrixAt(d,g.matrix)}Uo.instanceMatrix.needsUpdate=!0,Uo.frustumCulled=!1,Uo.castShadow=!1,Uo.receiveShadow=!1,this.world.scene.add(Uo);let So=yt(112233),Ia=Yt(new Vt(3.5,2),.3,1,55),Aa=pe.massiveCoral?pe.massiveCoral():new ot({color:8926037,roughness:.8}),Da=new ut(Ia,Aa,180),Ba=Yt(new Vt(4,1),.2,.8,99),La=pe.seabedRock?pe.seabedRock():new ot({color:3359829,roughness:.9}),Fa=new ut(Ba,La,220),Na=(()=>{let d=[],le=new F(.6,.8,1,8);le.translate(0,.5,0),d.push(le);for(let fe=0;fe<16;fe++){let me=fe/16*Math.PI*2,be=new F(.05,.1,1.8,4);be.rotateZ(.4),be.rotateY(me),be.translate(Math.cos(me)*.5,1.4,Math.sin(me)*.5),d.push(be)}return je(d,!1)||le})(),Va=pe.anemone?pe.anemone():new ot({color:3407820,emissive:1149030}),Wa=new ut(Na,Va,250),Ua=(()=>{let d=[];for(let le=0;le<3;le++){let fe=new F(.08,.2,3.5,5);fe.translate(0,1.75,0),fe.rotateX((So()-.5)*.3),fe.rotateZ((So()-.5)*.3),d.push(fe)}return je(d,!1)||new F(.1,.2,3)})(),Oa=pe.bioluminescentPlant?pe.bioluminescentPlant():new ot({color:65450,emissive:65450,emissiveIntensity:1.5}),Xa=new ut(Ua,Oa,300),vs=(d,le,fe)=>{for(let me=0;me<le;me++){let be=(So()-.5)*800,Fe=2120+So()*600,Qe=ze(be,Fe);if(Qe>-15)g.position.set(0,-9999,0),g.scale.set(0,0,0);else{let Rt=fe*(.7+So()*.6);g.position.set(be,Qe,Fe),g.rotation.set((So()-.5)*.4,So()*Math.PI*2,(So()-.5)*.4),g.scale.set(Rt,Rt*(.8+So()*.4),Rt)}g.updateMatrix(),d.setMatrixAt(me,g.matrix)}d.instanceMatrix.needsUpdate=!0,d.frustumCulled=!1,this.world.scene.add(d),console.log("[world3d] mesh added to scene",performance.now())};vs(Da,180,1.5),vs(Fa,220,1.8),vs(Wa,250,1.2),vs(Xa,300,1);let Ya={uniforms:{uTime:{value:0}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        varying vec2 vUv;
        varying vec3 vWorldPos;

        void main() {
          vUv = uv;
          vec4 wPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = wPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * wPos;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vWorldPos;

        void main() {
          vec2 p = vWorldPos.xz * 0.08;
          float t = uTime * 1.1;

          vec2 uv1 = p + vec2(sin(t * 0.6 + p.y * 1.6), cos(t * 0.5 + p.x * 1.6)) * 0.35;
          vec2 uv2 = p * 1.3 - vec2(cos(t * 0.7 + p.y * 2.0), sin(t * 0.65 + p.x * 2.0)) * 0.35;

          float c1 = pow(abs(sin(uv1.x * 10.0) * cos(uv1.y * 10.0)), 0.6);
          float c2 = pow(abs(sin(uv2.x * 14.0 + 1.2) * cos(uv2.y * 14.0 + 2.1)), 0.6);
          float caustic = pow(c1 * c2, 1.6) * 2.8;

          vec3 causticCol = mix(vec3(0.42, 0.92, 1.0), vec3(1.0, 0.95, 0.78), 0.35);
          float alpha = clamp(caustic * 0.55, 0.0, 0.75);

          gl_FragColor = vec4(causticCol * caustic, alpha);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,blending:Ht,side:gt},Mn=new Mt(Ya);this._causticsShader=Mn,[{x:430,y:6.35,z:-280,sx:240,sz:240},{x:0,y:-10.8,z:2280,sx:320,sz:260},{x:0,y:-7.2,z:1120,sx:340,sz:280}].forEach(d=>{let le=new ct(d.sx,d.sz,8,8);le.rotateX(-Math.PI/2);let fe=new r(le,Mn);fe.position.set(d.x,d.y,d.z),fe.frustumCulled=!1,this.world.scene.add(fe),console.log("[world3d] mesh added to scene",performance.now())});let Us=520,ys=new Et,Ao=new Float32Array(Us*3),Ms=new Float32Array(Us*3),To=yt(338811);for(let d=0;d<Us;d++){if(To()>.35)Ao[d*3]=(To()-.5)*280,Ao[d*3+1]=-11+To()*11.2,Ao[d*3+2]=1e3+To()*1440;else{let fe=To()*Math.PI*2,me=To()*120;Ao[d*3]=430+Math.cos(fe)*me,Ao[d*3+1]=6.2+To()*6.2,Ao[d*3+2]=-280+Math.sin(fe)*(me*.9)}Ms[d*3]=.3+To()*.6,Ms[d*3+1]=.8+To()*1.4,Ms[d*3+2]=To()*100}ys.setAttribute("position",new tt(Ao,3)),ys.setAttribute("aSnowData",new tt(Ms,3)),ys.computeBoundingSphere();let Tn=new Mt({uniforms:{uTime:{value:0}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        attribute vec3 aSnowData;
        varying float vAlpha;
        varying float vSparkle;
        uniform float uTime;

        void main() {
          vec3 pos = position;
          float t = mod(uTime * aSnowData.x * 0.4 + aSnowData.z, 12.0);
          pos.y -= t * 0.6;
          pos.x += sin(uTime * 0.6 + aSnowData.z) * aSnowData.y;
          pos.z += cos(uTime * 0.5 + aSnowData.z * 1.2) * aSnowData.y;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = min(28.0, 36.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
          vAlpha = smoothstep(0.0, 1.5, t) * (1.0 - smoothstep(8.5, 12.0, t));
          vSparkle = sin(uTime * 2.4 + aSnowData.z * 3.0) * 0.5 + 0.5;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        varying float vAlpha;
        varying float vSparkle;

        void main() {
          vec2 uv = gl_PointCoord - vec2(0.5);
          float r = length(uv);
          if (r > 0.5) discard;
          float soft = 1.0 - smoothstep(0.0, 0.5, r);
          vec3 bioCol = mix(vec3(0.55, 0.88, 1.0), vec3(0.4, 1.0, 0.8), vSparkle);
          gl_FragColor = vec4(bioCol, soft * vAlpha * (0.4 + vSparkle * 0.45));
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,blending:Ht});this._marineSnowShader=Tn;let xn=new co(ys,Tn);xn.frustumCulled=!1,this.world.scene.add(xn),console.log("[cathedral] successfully added to scene!")}_coastalCliff(){let e=new qe,o=pe.rockCliff(3.5);o.side=gt;let s=pe.weatheredTravertine(2.2),n=pe.timber(1.5),t=pe.bronze(1),a=(V,y,H)=>{let M=y-V,L=new ct(M,64,H,20),T=L.attributes.position;for(let q=0;q<T.count;q++){let $=(T.getX(q)+M*.5)/M,Y=(T.getY(q)+32)/64,k=V+$*M,h=ze(k,915)+.3,v=.8,_=v+Y*(h-v),g=jt(k*.045,_*.055,3)*6.5,i=Math.sin(Y*Math.PI*4+jt(k*.02,0,2)*2)*3.5,S=918+(1-Y)*38+Math.max(.5,g+i+2);T.setX(q,k),T.setY(q,_),T.setZ(q,S)}L.computeVertexNormals();let N=new r(L,o);return N.castShadow=N.receiveShadow=!0,N};e.add(a(-240,-52,28)),e.add(a(52,260,28)),[-180,-145,-115,-85,85,115,145,185,235].forEach((V,y)=>{let H=ze(V,915)-.5,M=new Vt(8.5+y%3*3.2,1);M.scale(1.2,H/12,1.8);let L=M.attributes.position,T=M.attributes.normal||M.computeVertexNormals()||M.attributes.normal,N=new Float32Array(L.count*3),q=new A,$=new A;for(let h=0;h<L.count;h++){q.set(L.getX(h),L.getY(h),L.getZ(h));let _=(jt((V+q.x)*.08,q.y*.08,3)-.5)*.35,g=q.clone().normalize();q.addScaledVector(g,_),L.setXYZ(h,q.x,q.y,q.z),$.set(T?.getX?.(h)||0,T?.getY?.(h)||1,T?.getZ?.(h)||0);let i=Math.max(0,q.y+H*.5),S=Math.min(1,i/1.8),O=.65+.35*Math.max(0,$.y),te=S*O;N[h*3]=te,N[h*3+1]=te,N[h*3+2]=te}M.setAttribute("color",new tt(N,3)),M.computeVertexNormals();let Y=o.clone();Y.vertexColors=!0;let k=new r(M,Y);k.position.set(V,H*.5,932+y%2*6),k.rotation.set(.2,y*1.1,.1),k.castShadow=k.receiveShadow=!0,e.add(k)});let u=(V,y,H,M,L=!1)=>{let T=new qe,N=18,q=new F(M*.65,M*1.25,H,N,16),$=q.attributes.position;for(let h=0;h<$.count;h++){let v=$.getY(h),_=$.getX(h),g=$.getZ(h),i=jt((V+_)*.08,v*.08,3)*(M*.45);$.setX(h,_+i),$.setZ(h,g+i)}q.computeVertexNormals();let Y=new r(q,o);Y.position.set(0,H*.5-2,0),Y.castShadow=Y.receiveShadow=!0,T.add(Y);let k=new r(new bo(M*1.1,M*2.2,24),new Ct({color:16777215,transparent:!0,logarithmicDepthBuffer:!0,opacity:.65,side:gt}));return k.rotation.x=-Math.PI/2,k.position.y=(K.oceanLevel||.35)+.05,T.add(k),T.position.set(V,0,y),T};e.add(u(-85,1150,26,9.5)),e.add(u(115,1210,34,13,!0)),e.add(u(195,1140,22,7.5));let f=(V,y)=>{let H=new qe,M=Math.max(2,Math.floor(Math.abs(y-V)/3.4));for(let $=0;$<=M;$++){let Y=V+$/M*(y-V),k=915,h=ze(Y,k),v=new r(new F(.38,.45,2.2,8),s);v.position.set(Y,h+1.1,k),v.castShadow=!0,H.add(v)}let L=(V+y)*.5,T=(ze(V,915)+ze(y,915))*.5+2.2,N=Math.abs(y-V)+1,q=new r(new ce(N,.45,.75),s);return q.position.set(L,T,915),q.castShadow=!0,H.add(q),H};e.add(f(-160,-52)),e.add(f(52,140));let c=(V,y,H)=>{let M=new qe,L=ze(V,y),T=new r(new ce(4.2,.35,1.4),n);T.position.set(0,1.1,0),M.add(T);let N=new r(new ce(4.2,1.2,.25),n);N.position.set(0,1.8,-.6),M.add(N);let q=new r(new ce(.4,1.1,1.2),s);q.position.set(-1.7,.55,0);let $=q.clone();return $.position.set(1.7,.55,0),M.add(q,$),M.position.set(V,L,y),M.rotation.y=H,M};e.add(c(-58,908,.25)),e.add(c(58,908,-.25));let p=new qe,w=ze(-52,912),b=new r(new F(.4,.6,2.4,8),s);b.position.y=1.2;let x=new r(new F(.18,.24,1.6,8),t);x.rotation.x=Math.PI/2-.25,x.position.set(0,2.6,.2),p.add(b,x),p.position.set(-52,w,912),e.add(p),this.world.scene.add(e)}_oceanWaterfall(){let e=new qe,o=165,s=918,n=7.8,t=.4,a=n-t,l={uniforms:{uTime:{value:0},uDeepColor:{value:new Me(537156)},uGlacierColor:{value:new Me(3717344)},uFoamColor:{value:new Me(16777215)},uSunDir:{value:new A(.4,.8,.5).normalize()},uSunColor:{value:new Me(16772829)}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vNormal;
        uniform float uTime;

        void main() {
          vUv = uv;
          vec3 pos = position;
          float fallFactor = clamp(1.0 - uv.y, 0.0, 1.0);
          float gravitySpeed = 10.0 + 28.0 * sqrt(fallFactor + 0.005);
          
          float wave1 = sin(pos.y * 1.8 - uTime * (gravitySpeed * 1.6)) * 0.28;
          float wave2 = cos(pos.x * 3.5 + pos.y * 1.2 - uTime * (gravitySpeed * 1.2)) * 0.20;
          float wave3 = sin(pos.x * 6.5 - pos.y * 2.8 - uTime * (gravitySpeed * 2.1)) * 0.12;
          
          float edgeMask = smoothstep(0.01, 0.10, uv.y) * smoothstep(1.0, 0.95, uv.y);
          pos.x += normal.x * (wave1 + wave2) * edgeMask;
          pos.z += normal.z * (wave1 + wave3) * edgeMask;
          
          vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform float uTime;
        uniform vec3 uDeepColor;
        uniform vec3 uGlacierColor;
        uniform vec3 uFoamColor;
        uniform vec3 uSunDir;
        uniform vec3 uSunColor;
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vNormal;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        float fbm(vec2 p) {
          float v = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 5; i++) {
            v += amp * noise(p);
            p *= 2.02;
            amp *= 0.5;
          }
          return v;
        }

        void main() {
          float fallFactor = clamp(1.0 - vUv.y, 0.0, 1.0);
          float speedY = uTime * (10.0 + 28.0 * sqrt(fallFactor + 0.005));
          vec2 flow1 = vec2(vUv.x * 20.0, vUv.y * 36.0 - speedY);
          vec2 flow2 = vec2(vUv.x * 40.0 + 1.8, vUv.y * 72.0 - speedY * 1.6);
          vec2 flow3 = vec2(vUv.x * 80.0 - 1.2, vUv.y * 120.0 - speedY * 2.4);

          float n1 = fbm(flow1);
          float n2 = fbm(flow2);
          float n3 = noise(flow3);
          
          float foamMask = smoothstep(0.28, 0.72, n1 * 0.50 + n2 * 0.35 + n3 * 0.20);
          
          // Contact edge shear aeration along sea cliff wall
          float edgeDist = abs(vUv.x - 0.5) * 2.0;
          float edgeFoam = smoothstep(0.35, 0.92, edgeDist) * 0.75;
          foamMask = clamp(foamMask + edgeFoam + (1.0 - vUv.y) * 0.20, 0.0, 1.0);

          vec3 viewDir = normalize(cameraPosition - vWorldPos + vec3(0.0001));
          float cosTheta = clamp(dot(vNormal, viewDir), 0.0, 1.0);
          float fresnel = 0.0204 + (1.0 - 0.0204) * pow(1.0 - cosTheta, 5.0);

          vec3 sunDir = normalize(uSunDir);
          vec3 halfVec = normalize(sunDir + viewDir);
          float NdotH = max(0.0, dot(vNormal, halfVec));
          float spec = pow(NdotH, 54.0) * 2.8;

          vec3 baseWater = mix(uDeepColor, uGlacierColor, n1 * 0.65 + 0.35);
          vec3 waterCol = mix(baseWater, uFoamColor, foamMask);
          waterCol += fresnel * vec3(0.35, 0.65, 0.85) * 0.45;
          waterCol += uSunColor * spec;

          float alpha = mix(0.75, 0.98, foamMask) * smoothstep(0.0, 0.04, vUv.y) * (1.0 - smoothstep(0.96, 1.0, vUv.y));
          gl_FragColor = vec4(waterCol, alpha);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,transparent:!0,logarithmicDepthBuffer:!0,side:gt,depthWrite:!1},u=new Mt(l);this._oceanWaterfallShader=u;let f=new It([new ht(o,n+.1,s),new ht(o+.8,n-1.2,s+8),new ht(o+1.8,n-a*.55,s+20),new ht(o+2.5,t+.3,s+36)]),c=new Jt(f,20,5.5,8,!1);c.scale(1.8,.3,1),c.computeBoundingSphere();let p=new r(c,u);p.castShadow=p.receiveShadow=!0,p.frustumCulled=!1,p.renderOrder=1,e.add(p);let w=[new ht(o,n-.4,s-1),new ht(o+.6,n-1.6,s+6),new ht(o+1.4,n-a*.58,s+18),new ht(o+2.2,t,s+34)],b=new It(w),x=new Jt(b,16,7,8,!1);x.scale(1.9,.4,1),x.computeBoundingSphere();let V=pe.photogrammetryRock(3),y=new r(x,V);y.frustumCulled=!1,e.add(y);let H=new $t(24,24);H.computeBoundingSphere();let M=new r(H,this.world._waterPoolMat);M.rotation.x=-Math.PI/2,M.position.set(o+2.5,t+.15,s+36),M.renderOrder=1,M.frustumCulled=!0,e.add(M);let L=new $t(6,16),T=new Ct({color:16777215,transparent:!0,logarithmicDepthBuffer:!0,opacity:.8,depthWrite:!1}),N=new r(L,T);N.rotation.x=-Math.PI/2,N.position.set(o+2.5,t+.16,s+36),N.renderOrder=2,e.add(N);let q=[new ht(o+2.5,t+.12,s+36),new ht(o+12,t*.7+.12,s+85),new ht(o+22,t*.4+.12,s+150),new ht(o+32,.35,s+220)],$=new It(q),Y=new Jt($,16,5,6,!1);Y.scale(1.8,.16,1),Y.computeBoundingSphere();let k=new r(Y,this.waterMat);k.frustumCulled=!1,e.add(k),this.world.scene.add(e)}_coveOceanSurf(){let e=new qe,o=new ct(380,110,90,32);o.rotateX(-Math.PI/2),o.computeBoundingSphere(),o.computeBoundingBox();let s={uniforms:{uTime:{value:0},uDeepWater:{value:new Me(403517)},uCrestColor:{value:new Me(1618120)},uFoamColor:{value:new Me(16186367)},uWetSand:{value:new Me(1971469)},uSunDir:{value:new A(.4,.8,.5).normalize()},uSunColor:{value:new Me(16772829)}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vNormal;
        varying float vJacobian;
        varying float vWaveHeight;
        uniform float uTime;
        
        vec3 gerstnerSurf(vec2 dir, float steepness, float wavelength, vec3 pos, float time, float depthFade, inout vec3 tangent, inout vec3 binormal) {
          float k = 2.0 * 3.14159265 / wavelength;
          float c = sqrt(9.81 / k);
          vec2 d = normalize(dir);
          float f = k * (dot(d, pos.xz) - c * time);
          float a = (steepness / k) * depthFade;
          float sinF = sin(f);
          float cosF = cos(f);

          tangent += vec3(
            -d.x * d.x * (steepness * sinF * depthFade),
            d.x * (steepness * cosF * depthFade),
            -d.x * d.y * (steepness * sinF * depthFade)
          );
          binormal += vec3(
            -d.x * d.y * (steepness * sinF * depthFade),
            d.y * (steepness * cosF * depthFade),
            -d.y * d.y * (steepness * sinF * depthFade)
          );

          return vec3(d.x * (a * cosF), a * sinF, d.y * (a * cosF));
        }

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Shore depth attenuation: waves surge, peak, and disperse gently on beach sand
          float shoreFade = smoothstep(0.04, 0.70, uv.y);
          
          vec3 tangent = vec3(1.0, 0.0, 0.0);
          vec3 binormal = vec3(0.0, 0.0, 1.0);

          vec3 w1 = gerstnerSurf(vec2(0.25, 0.97), 0.32, 42.0, pos, uTime * 1.8, shoreFade, tangent, binormal);
          vec3 w2 = gerstnerSurf(vec2(-0.15, 0.98), 0.24, 26.0, pos, uTime * 2.2, shoreFade, tangent, binormal);
          vec3 w3 = gerstnerSurf(vec2(0.40, 0.91), 0.16, 14.0, pos, uTime * 2.8, shoreFade, tangent, binormal);

          vec3 offset = w1 + w2 + w3;
          pos += offset;
          vWaveHeight = offset.y;

          // Analytical Jacobian determinant: whitecap pinching
          float jDet = tangent.x * binormal.z - tangent.z * binormal.x;
          vJacobian = jDet;

          vec3 waveNormal = normalize(cross(binormal, tangent));
          vNormal = normalize((modelMatrix * vec4(waveNormal, 0.0)).xyz);
          
          vec4 worldPos = modelMatrix * vec4(pos, 1.0);
          vWorldPos = worldPos.xyz;
          
          gl_Position = projectionMatrix * viewMatrix * worldPos;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform float uTime;
        uniform vec3 uDeepWater;
        uniform vec3 uCrestColor;
        uniform vec3 uFoamColor;
        uniform vec3 uWetSand;
        uniform vec3 uSunDir;
        uniform vec3 uSunColor;

        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vNormal;
        varying float vJacobian;
        varying float vWaveHeight;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        float fbm(vec2 p) {
          float v = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 5; i++) {
            v += amp * noise(p);
            p *= 2.02;
            amp *= 0.5;
          }
          return v;
        }

        void main() {
          // Multi-frequency procedural Perlin foam wash with trailing foam lacing
          vec2 foamUv1 = vUv * vec2(32.0, 14.0) + vec2(uTime * 0.35, uTime * 0.12);
          vec2 foamUv2 = vUv * vec2(64.0, 28.0) - vec2(uTime * 0.50, -uTime * 0.20);
          float nFoam1 = fbm(foamUv1);
          float nFoam2 = noise(foamUv2);
          float nFoam = nFoam1 * 0.70 + nFoam2 * 0.30;

          // Jacobian determinant wave crest froth (whitecap pinching where J_det < 0.45)
          float whitecap = 1.0 - smoothstep(0.10, 0.45, vJacobian);

          float shoreFade = smoothstep(0.02, 0.25, vUv.y);
          float crestWave = sin(vUv.x * 28.0 + vUv.y * 14.0 - uTime * 3.2) * 0.5 + 0.5;

          // Shore wash uprush and backwash lacing
          float washFront = smoothstep(0.35, 0.75, nFoam * crestWave + whitecap * 0.8) * shoreFade;
          float trailingLace = smoothstep(0.48, 0.82, nFoam1) * (1.0 - shoreFade * 0.6);
          float totalFoam = clamp(washFront + trailingLace * 0.65 + whitecap * 0.85, 0.0, 1.0);

          float wetSandMask = 1.0 - smoothstep(0.0, 0.14, vUv.y);

          vec3 baseWater = mix(uCrestColor, uDeepWater, shoreFade * 0.85);
          vec3 finalColor = mix(baseWater, uFoamColor, totalFoam * 0.92);
          finalColor = mix(finalColor, uWetSand, wetSandMask * 0.80);

          // Exact Dielectric Fresnel (F0 = 0.0204 for water IOR 1.333)
          vec3 viewDir = normalize(cameraPosition - vWorldPos + vec3(0.0001));
          float cosTheta = clamp(dot(vNormal, viewDir), 0.0, 1.0);
          float fresnel = 0.0204 + (1.0 - 0.0204) * pow(1.0 - cosTheta, 5.0);

          // GGX Microfacet Sun Specular Highlights
          vec3 sunDir = normalize(uSunDir);
          vec3 halfVec = normalize(sunDir + viewDir);
          float NdotH = max(0.0, dot(vNormal, halfVec));
          float NdotV = max(0.001, dot(vNormal, viewDir));
          float NdotL = max(0.001, dot(vNormal, sunDir));
          float alphaRoughness = 0.06;
          float alphaSq = alphaRoughness * alphaRoughness;
          float denom = (NdotH * NdotH * (alphaSq - 1.0) + 1.0);
          float D = alphaSq / (3.14159265 * denom * denom);
          float k = (alphaRoughness + 1.0) * (alphaRoughness + 1.0) / 8.0;
          float G = (NdotV / (NdotV * (1.0 - k) + k)) * (NdotL / (NdotL * (1.0 - k) + k));
          vec3 specLight = uSunColor * ((D * fresnel * G) / (4.0 * NdotV * NdotL + 0.001)) * NdotL * 3.8;
          finalColor += specLight;

          float alpha = smoothstep(0.008, 0.12, vUv.y) * mix(0.88, 0.98, fresnel);
          gl_FragColor = vec4(finalColor, alpha);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,blending:Xs,side:gt},n=new Mt(s);this._surfShader=n;let t=new r(o,n);t.position.set(35,1.2,1140),e.add(t),this._surfWaves=[t];let a=pe.timber(2),l=yt(884422);for(let w=0;w<16;w++){let b=(l()-.5)*240+35,x=980+l()*180;if(Math.abs(b)<48||xo(b,x)<14)continue;let V=ze(b,x);if(V<.4||V>3)continue;let y=4+l()*6,H=.35+l()*.45,M=new r(new F(H*.7,H,y,8),a);M.position.set(b,V+H*.8,x),M.rotation.set(.1,l()*Math.PI,1.57+(l()-.5)*.2),M.castShadow=M.receiveShadow=!0,e.add(M)}let u=new ot({color:13152890,roughness:.8,metalness:.05,side:gt,alphaTest:.5}),f=new ct(1.8,3.2);f.translate(0,1.6,0);for(let w=0;w<32;w++){let b=(l()-.5)*260+35,x=960+l()*140;if(Math.abs(b)<48||xo(b,x)<14)continue;let V=ze(b,x);if(V<1.2||V>4.5)continue;let y=new r(f,u);y.position.set(b,V,x),y.rotation.set(.15,l()*Math.PI*2,(l()-.5)*.2),y.scale.setScalar(.8+l()*.5),e.add(y)}let c=new ot({color:16511722,roughness:.25,metalness:.1}),p=new lt(.25,.45,6);p.scale(1.2,.6,1);for(let w=0;w<45;w++){let b=(l()-.5)*280+35,x=1010+l()*160,V=ze(b,x);if(V<.2||V>2.2)continue;let y=new r(p,c);y.position.set(b,V+.1,x),y.rotation.set((l()-.5)*.4,l()*Math.PI*2,(l()-.5)*.4),e.add(y)}this.world.scene.add(e)}_mountainWaterfall(){let e=new qe,o={uniforms:{uTime:{value:0},uDeepColor:{value:new Me(663080)},uGlacierColor:{value:new Me(2258071)},uFoamColor:{value:new Me(16777215)},uSunDir:{value:new A(.5,.8,.3)}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vNormal;
        uniform float uTime;

        vec3 gerstnerWave(vec2 dir, float steepness, float wavelength, vec2 p, float speed, float t) {
            float k = 2.0 * 3.14159265 / wavelength;
            float c = sqrt(9.8 / k);
            vec2 d = normalize(dir);
            float f = k * (dot(d, p) - c * speed * t);
            float a = steepness / k;
            return vec3(
                d.x * (a * cos(f)),
                d.y * (a * cos(f)),
                a * sin(f)
            );
        }

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          vec3 g1 = gerstnerWave(vec2(0.0, 1.0), 0.2, 5.0, pos.xy, 4.0, uTime);
          vec3 g2 = gerstnerWave(vec2(0.2, 1.0), 0.15, 3.0, pos.xy, 5.0, uTime);
          vec3 g3 = gerstnerWave(vec2(-0.2, 1.0), 0.1, 2.0, pos.xy, 6.0, uTime);
          
          vec3 gWave = (g1 + g2 + g3) * smoothstep(0.05, 0.2, uv.y) * smoothstep(1.0, 0.9, uv.y);
          pos += gWave;
          
          vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform float uTime;
        uniform vec3 uDeepColor;
        uniform vec3 uGlacierColor;
        uniform vec3 uFoamColor;
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vNormal;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        float fbm(vec2 p) {
          float v = 0.0;
          float amp = 0.5;
          for (int i = 0; i < 5; i++) {
            v += amp * noise(p);
            p *= 2.02;
            amp *= 0.5;
          }
          return v;
        }

        void main() {
          // Multi-frequency FBM foam aeration
          vec2 flow1 = vec2(vUv.x * 12.0, vUv.y * 22.0 - uTime * 4.5);
          vec2 flow2 = vec2(vUv.x * 24.0 + 2.0, vUv.y * 38.0 - uTime * 7.2);
          vec2 spray = vec2(vUv.x * 45.0, vUv.y * 55.0 - uTime * 10.5);

          float n1 = fbm(flow1);
          float n2 = fbm(flow2);
          float nSpray = noise(spray);

          // Foam mask with braided aeration
          float foamMask = smoothstep(0.45, 0.85, n1 * 0.6 + n2 * 0.3 + nSpray * 0.2);
          
          // Edge aeration (turbulent friction against bedrock)
          float edgeDist = abs(vUv.x - 0.5) * 2.0;
          float edgeFoam = smoothstep(0.65, 0.95, edgeDist) * 0.45;
          foamMask = clamp(foamMask + edgeFoam, 0.0, 1.0);

          // Crystalline glacial depth gradient
          vec3 waterCol = mix(uDeepColor, uGlacierColor, n1 * 0.8 + 0.2);
          vec3 finalCol = mix(waterCol, uFoamColor, foamMask);

          // Specular highlights
          vec3 viewDir = normalize(cameraPosition - vWorldPos + vec3(0.0001));
          vec3 halfVector = normalize(vec3(0.4, 0.8, 0.5) + viewDir + vec3(0.0001));
          float spec = pow(max(0.0, dot(vNormal, halfVector)), 48.0) * 0.6;
          finalCol += vec3(spec);

          float alpha = mix(0.85, 0.98, foamMask) * smoothstep(0.0, 0.04, vUv.y) * smoothstep(1.0, 0.96, vUv.y);
          alpha *= smoothstep(1.0, 0.85, edgeDist);

          gl_FragColor = vec4(finalCol, alpha);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,transparent:!0,logarithmicDepthBuffer:!0,side:gt,depthWrite:!1},s=new Mt(o);this._mountainWaterfallShader=s;let n=(R,P,oe,ne=140)=>{let se=[],ae=[],I=[],Z=new A(0,1,0);for(let ve=0;ve<=ne;ve++){let De=ve/ne,Ue=R.getPoint(De),Ke=R.getTangent(De).normalize(),U=new A().crossVectors(Ke,Z).normalize();U.lengthSq()<.1&&(U=new A(1,0,0));let xe=(P*(1-De)+oe*De)*.5,Ce=Ue.clone().addScaledVector(U,-xe),Pe=Ue.clone().addScaledVector(U,xe);if(se.push(Ce.x,Ce.y,Ce.z,Pe.x,Pe.y,Pe.z),ae.push(0,De,1,De),ve>0){let B=ve*2;I.push(B-2,B-1,B,B-1,B+1,B)}}let ie=new Et;return ie.setAttribute("position",new mt(se,3)),ie.setAttribute("uv",new mt(ae,2)),ie.setIndex(I),ie.computeVertexNormals(),ie},t=new ct(120,140,32,32);t.rotateX(-Math.PI/2);let a=this._createPhysicalWaterMaterial(this._waterNormals,"lake");a.side=gt,a.depthWrite=!1;let l=new r(t,a);l.position.set(0,182,-565),l.receiveShadow=!0,l.frustumCulled=!1,l.renderOrder=1,this._upperTarnMesh=l,e.add(l);let u=[new ht(0,182,-605),new ht(0,180.5,-595),new ht(0,178,-588),new ht(0,175,-585),new ht(0,120,-575),new ht(0,80,-565),new ht(0,40,-555),new ht(0,20,-550),new ht(0,14.5,-550)],f=new It(u),c=[new ht(0,180.5,-605),new ht(0,178.5,-595),new ht(0,175,-588),new ht(0,169,-585),new ht(0,133,-575),new ht(0,78,-565),new ht(0,36,-555),new ht(0,13,-550),new ht(0,14,-545)],p=new It(c),w=n(p,38,75,140);Yt(w,.12,.4,77),Ko(w,4.5);let b=pe.photogrammetryRock(4),x=new r(w,b);x.position.z-=1.2,x.receiveShadow=x.castShadow=!0,e.add(x);let V=new r(n(f,20,48,140),s);V.position.z+=.2,V.renderOrder=1,e.add(V);let y=u.map(R=>new ht(R.x,R.y-.3,R.z+1.8)),H=new It(y),M=new r(n(H,26,64,140),s);M.position.z+=.8,M.renderOrder=2,e.add(M);let L=new $t(56,48),T=new r(L,this.waterMat);T.rotation.x=-Math.PI/2,T.position.set(0,14.5,-550),T.receiveShadow=!0,T.frustumCulled=!1,T.renderOrder=1,e.add(T);let N=new ct(96,96),q=new Mt({uniforms:{uTime:{value:0}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
 varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
#include <logdepthbuf_vertex>
          #include <fog_vertex>
        }`,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vec2 uv = vUv - 0.5;
          float dist = length(uv);
          float rings = sin(dist * 36.0 - uTime * 6.0) * 0.5 + 0.5;
          float swirl = sin(atan(uv.y, uv.x) * 4.0 + dist * 24.0 - uTime * 4.0) * 0.3;
          float alpha = (rings + swirl) * smoothstep(0.5, 0.12, dist) * 0.85;
          gl_FragColor = vec4(vec3(0.94, 0.97, 1.0), alpha);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,blending:Ht});this._poolShader=q;let $=new r(N,q);$.rotation.x=-Math.PI/2,$.position.set(0,14.58,-550),$.renderOrder=2,$.frustumCulled=!1,e.add($);let Y=document.createElement("canvas");Y.width=Y.height=128;let k=Y.getContext("2d"),h=k.createRadialGradient(64,64,0,64,64,64);h.addColorStop(0,"rgba(255,255,255,0.8)"),h.addColorStop(.5,"rgba(255,255,255,0.2)"),h.addColorStop(1,"rgba(255,255,255,0)"),k.fillStyle=h,k.fillRect(0,0,128,128);let v=new Kt(Y),_=new ct(60,45),g=new Ct({map:v,transparent:!0,logarithmicDepthBuffer:!0,blending:Ht,depthWrite:!1,opacity:.15,color:15660543});for(let R=0;R<4;R++){let P=new as(g);P.scale.set(60,45,1),P.position.set((R%2===0?-1:1)*(18+Math.random()*15),14.5+Math.random()*10,-550+(Math.random()-.5)*15),P.rotation.y=(Math.random()-.5)*.2,e.add(P)}let i=s,S=n(f,12,32,140),C=S.attributes.uv;for(let R=0;R<C.count;R++)C.setY(R,C.getY(R)*2);let O=new r(S,i);O.position.z+=1.4,O.renderOrder=3,e.add(O);let te=new $t(14,24),m=new Ct({color:16777215,transparent:!0,logarithmicDepthBuffer:!0,opacity:.8,depthWrite:!1}),E=new r(te,m);E.rotation.x=-Math.PI/2,E.position.set(0,14.62,-548),E.renderOrder=2,e.add(E),this.world.scene.add(e)}_updateUnderwater(e,o){this._dummyObject||(this._dummyObject=new Lt,this._v3A=new A,this._v3B=new A,this._v3C=new A);let s=this._dummyObject,n=this._v3A,t=this._v3B,a=this._v3C,l=(f,c,p=[])=>{if(!f||!c)return;let w=f.length;for(let b=0;b<w;b++){let x=f[b];x.angle+=x.dir*x.orbitSpeed*e;let V=Math.sin(o*.5+x.phase)*x.wanderAmp,y=Math.cos(o*.4+x.phase)*x.wanderAmp,H=Math.sin(o*.3+x.phase)*x.vertAmp,M=x.center.x+Math.cos(x.angle)*x.radiusX+V,L=x.center.z+Math.sin(x.angle)*x.radiusZ+y,T=x.center.y+x.yOffset+H;n.set(M,T,L);for(let q=0;q<p.length;q++){let $=p[q];if($)for(let Y=0;Y<$.length;Y++){let k=$[Y].worldX,h=$[Y].worldZ,v=$[Y].worldY;if(k===void 0)continue;let _=x.worldX-k,g=x.worldY-v,i=x.worldZ-h,S=_*_+g*g+i*i;if(S<900){let C=Math.sqrt(S)+.1;n.x+=_/C*15,n.y+=g/C*15,n.z+=i/C*15}}}if(w>1){let q=(b+7)%w,$=f[q];if($.worldX!==void 0){let Y=x.worldX-$.worldX,k=x.worldY-$.worldY,h=x.worldZ-$.worldZ;Y*Y+k*k+h*h<16&&(n.x+=Y*.5,n.y+=k*.5,n.z+=h*.5)}}x.worldX===void 0&&(x.worldX=M,x.worldY=T,x.worldZ=L);let N=x.speed*6*e;if(t.set(x.worldX,x.worldY,x.worldZ),a.copy(n).sub(t),a.lengthSq()>.01){a.normalize(),x.worldX+=a.x*N,x.worldY+=a.y*N*.5,x.worldZ+=a.z*N;let q=Math.atan2(a.x,a.z);x.yaw===void 0&&(x.yaw=q);let $=q-x.yaw;for(;$<-Math.PI;)$+=Math.PI*2;for(;$>Math.PI;)$-=Math.PI*2;x.yaw+=$*Math.min(1,e*3)}s.position.set(x.worldX,x.worldY,x.worldZ),s.rotation.set(0,x.yaw||0,0),s.scale.setScalar(x.scale),s.updateMatrix(),c.setMatrixAt(b,s.matrix)}c.instanceMatrix.needsUpdate=!0};l(this._sharkData,this._sharkMesh),l(this._dolphinData,this._dolphinMesh),l(this._seaTurtleData,this._seaTurtleMesh),l(this._mantaRayData,this._mantaRayMesh),this._mantaRayShader&&(this._mantaRayShader.uniforms.uTime.value=o);let u=[this._sharkData,this._dolphinData];l(this._troutData,this._troutMesh,u),l(this._koiData,this._koiMesh,u),l(this._reefFishData,this._reefFishMesh,u)}_underwaterWorld(){let e=new qe;e.name="UnderwaterRealism";let o=4500,s=new Et,n=new Float32Array(o*3),t=new Float32Array(o);for(let I=0;I<o;I++)n[I*3]=(Math.random()-.5)*1200,n[I*3+1]=Math.random()*20-5,n[I*3+2]=(Math.random()-.5)*1800+400,t[I]=Math.random()*Math.PI*2;s.setAttribute("position",new tt(n,3)),s.setAttribute("aPhase",new tt(t,1));let a=new Mt({uniforms:{uTime:{value:0},uOpacity:{value:0}},vertexShader:`
        uniform float uTime;
        attribute float aPhase;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          pos.y += sin(uTime * 0.5 + aPhase) * 1.5 + (uTime * 0.8 * fract(aPhase * 11.0));
          pos.y = mod(pos.y + 10.0, 25.0) - 10.0; 
          pos.x += sin(uTime * 0.2 + aPhase * 3.0) * 0.5;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          gl_PointSize = (4.0 + sin(aPhase * 15.0) * 2.0) * (100.0 / -mvPosition.z);
          vAlpha = smoothstep(25.0, 5.0, pos.y) * 0.6;
        }
      `,fragmentShader:`
        uniform float uOpacity;
        varying float vAlpha;
        void main() {
          vec2 pc = gl_PointCoord - vec2(0.5);
          float dist = length(pc);
          if (dist > 0.5) discard;
          
          // Bubble rim lighting effect
          float rim = smoothstep(0.3, 0.5, dist);
          float alpha = vAlpha * uOpacity * (0.2 + rim * 0.8);
          gl_FragColor = vec4(0.8, 0.9, 1.0, alpha);
        }
      `,transparent:!0,blending:Ht,depthWrite:!1}),l=new co(s,a);l.frustumCulled=!1,e.add(l),this.world._bubbleMat=a;let u=15,f=new F(.5,8,40,16,1,!0);f.translate(0,-20,0);let c=new Mt({uniforms:{uTime:{value:0},uOpacity:{value:0}},vertexShader:`
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.x += sin(uTime * 0.5 + pos.y * 0.1) * 2.0 * (1.0 - uv.y);
          pos.z += cos(uTime * 0.4 + pos.y * 0.1) * 2.0 * (1.0 - uv.y);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,fragmentShader:`
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          float grad = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.5, vUv.y);
          float alpha = grad * uOpacity * 0.15;
          gl_FragColor = vec4(0.5, 0.8, 1.0, alpha);
        }
      `,transparent:!0,blending:Ht,depthWrite:!1,side:gt}),p=new ut(f,c,u),w=new Lt;for(let I=0;I<u;I++)w.position.set((Math.random()-.5)*400,12.5,(Math.random()-.5)*400),w.rotation.set(Math.random()*.2-.1,Math.random()*Math.PI,Math.random()*.2-.1),w.scale.set(1+Math.random()*2,1,1+Math.random()*2),w.updateMatrix(),p.setMatrixAt(I,w.matrix);p.frustumCulled=!1,e.add(p),this.world._godRaysMat=c;let b=24,x=new F(1.6,2,3.2,8),V=new Ot({color:15592420,roughness:.35,metalness:.05}),y=new ut(x,V,b);y.castShadow=!0,y.receiveShadow=!0;let H=new ce(1.4,.25,1.4),M=new Ot({color:14659905,roughness:.2,metalness:.85,emissive:4007936,emissiveIntensity:.3}),L=new ut(H,M,b),T=typeof K<"u"&&K.lake?K.lake.x:380,N=typeof K<"u"&&K.lake?K.lake.z:-250,q=typeof K<"u"&&K.lake?K.lake.r:130;for(let I=0;I<b;I++){let Z=I/b*Math.PI*2+I%2*.15,ie=25+I*37%Math.floor(q*.65),ve=T+Math.cos(Z)*ie,De=N+Math.sin(Z)*ie,Ue=typeof ze=="function"?ze(ve,De):2;w.position.set(ve,Ue+1.6,De),w.rotation.set(0,Z+Math.PI/4,0),w.scale.set(1,1,1),w.updateMatrix(),y.setMatrixAt(I,w.matrix),w.position.set(ve,Ue+3.25,De),w.scale.set(1,1,1),w.updateMatrix(),L.setMatrixAt(I,w.matrix)}y.instanceMatrix.needsUpdate=!0,L.instanceMatrix.needsUpdate=!0,e.add(y),e.add(L);let $=36,Y=new lt(1.2,7.5,6);Y.translate(0,3.75,0);let k=new Ot({color:3597004,roughness:.15,metalness:.1,emissive:1745808,emissiveIntensity:.65,transparent:!0,opacity:.92}),h=new ut(Y,k,$);for(let I=0;I<$;I++){let Z,ie;if(I<12){let Ue=I/12*Math.PI*2,Ke=35+I*19%55;Z=T+Math.cos(Ue)*Ke,ie=N+Math.sin(Ue)*Ke}else if(I<26){let Ue=(I-12)/14*Math.PI*2,Ke=60+I*23%110;Z=20+Math.cos(Ue)*Ke,ie=2050+Math.sin(Ue)*Ke}else{let Ue=(I-26)/10*Math.PI,Ke=120+I*31%90;Z=20+Math.cos(Ue)*Ke,ie=2320+Math.sin(Ue)*Ke}let ve=typeof ze=="function"?ze(Z,ie):-10,De=.8+I*13%10*.08;w.position.set(Z,ve-.2,ie),w.rotation.set(0,I*1.1%(Math.PI*2),(I%3-1)*.08),w.scale.set(De,De*1.2,De),w.updateMatrix(),h.setMatrixAt(I,w.matrix)}h.instanceMatrix.needsUpdate=!0,e.add(h);let v=48,_=new Vt(2.4,1);_.scale(1.2,.75,1.2);let g=new Ot({color:15229815,roughness:.6,emissive:4854043,emissiveIntensity:.35}),i=new ut(_,g,v),S=new Ot({color:4307112,roughness:.55,emissive:801589,emissiveIntensity:.35}),C=new ut(_,S,v);for(let I=0;I<v;I++){let Z=I/v*Math.PI*2,ie=55+I*43%140,ve=20+Math.cos(Z)*ie,De=2080+Math.sin(Z)*ie,Ue=typeof ze=="function"?ze(ve,De):-8,Ke=.7+I%7*.18;w.position.set(ve,Ue+.5,De),w.rotation.set(I%4*.1,I*.8%(Math.PI*2),I%5*.1),w.scale.set(Ke,Ke,Ke),w.updateMatrix(),I%2===0?i.setMatrixAt(I,w.matrix):C.setMatrixAt(I,w.matrix)}i.instanceMatrix.needsUpdate=!0,C.instanceMatrix.needsUpdate=!0,e.add(i),e.add(C);let O=18,te=new lt(3.5,32,7);te.translate(0,16,0);let m=new Ot({color:660510,roughness:.85,emissive:15698,emissiveIntensity:.7}),E=new ut(te,m,O);for(let I=0;I<O;I++){let Z=I/O*Math.PI*1.6-.8,ie=160+I*29%180,ve=20+Math.cos(Z)*ie,De=2360+Math.sin(Z)*ie,Ue=typeof ze=="function"?ze(ve,De):-45,Ke=.9+I%5*.3;w.position.set(ve,Ue-2,De),w.rotation.set((I%3-1)*.08,I*.7,I%2*.05),w.scale.set(Ke,Ke*1.4,Ke),w.updateMatrix(),E.setMatrixAt(I,w.matrix)}E.instanceMatrix.needsUpdate=!0,e.add(E);let R=350,P=new Et,oe=new Float32Array(R*3),ne=new Float32Array(R);for(let I=0;I<R;I++)oe[I*3]=(Math.random()-.5)*35,oe[I*3+1]=Math.random()*18-8,oe[I*3+2]=-360+(Math.random()-.5)*35,ne[I]=Math.random()*Math.PI*2;P.setAttribute("position",new tt(oe,3)),P.setAttribute("aPhase",new tt(ne,1));let se=new Cs({color:14088191,size:1.8,transparent:!0,opacity:.65,blending:Ht,depthWrite:!1}),ae=new co(P,se);ae.frustumCulled=!1,e.add(ae),this.world.scene.add(e)}_trees(){return this._vegetation()}async _vegetation(){let e=yt(777),o={trunks:[],crowns:[],crownsColors:[],clutter:[]},s={trunks:[],crowns:[],crownsColors:[],stones:[]},n={trunks:[],crowns:[],crownsColors:[],stones:[]},t={trunks:[],crowns:[],crownsColors:[]},a={trunks:[],crowns:[],crownsColors:[]},l={trunks:[],crowns:[],crownsColors:[],stones:[]},u={trunks:[],crowns:[],crownsColors:[]},f=[],c=new Lt,p=(B,X)=>{let G=ze(B,X),D=Xo(B,X),z=Ts(B,X);if(D<45&&G<z+1.2||G<K.waterLevel+1||G>170||xo(B,X)<15||Math.hypot(B,X- -360)<68&&G<19||D<12||Math.abs(B)<36&&X<-240||X<=-450&&Math.abs(B)<180||Math.hypot(B-K.buddhistTemple.x,X-K.buddhistTemple.z)<120||Math.hypot(B-K.mosque.x,X-K.mosque.z)<110||X>1700||Math.abs(B)<22&&X<320||Math.hypot(B-K.plaza.x,X-K.plaza.z)<K.plaza.r+30||Math.hypot(B-K.gate.x,X-K.gate.z)<130||Math.abs(B)<52&&X>=760&&X<=1120||Math.hypot(B-K.bridge.x,X-K.bridge.z)<130)return null;for(let W of this.world.plots)if(Math.hypot(B-W.x,X-W.z)<16)return null;return G};for(let B=0;B<1200;B++){let X=(e()-.5)*2600,G=(e()-.5)*2400,D=p(X,G);if(D===null)continue;let z=.82+e()*.85,W=Math.hypot(X-K.lake.x,G-K.lake.z)-K.lake.r,ee=Xo(X,G),ue=xo(X,G),ge=X<-220&&G>180&&D<70;if(c.position.set(X,D-.35*z,G),c.rotation.set(0,e()*Math.PI*2,0),ge){e()<.3&&(c.scale.setScalar(z),c.updateMatrix(),f.push(c.matrix.clone()));continue}if(ue>8&&ue<28&&e()<.34){c.scale.setScalar(z*1.15),c.updateMatrix(),u.trunks.push(c.matrix.clone()),u.crowns.push(c.matrix.clone()),u.crownsColors.push(new Me().setHSL(0,0,.75+e()*.45));continue}if((ee<28||W>4&&W<35)&&e()<.42){c.scale.setScalar(z*.95),c.updateMatrix(),l.trunks.push(c.matrix.clone()),l.crowns.push(c.matrix.clone()),l.crownsColors.push(new Me().setHSL(0,0,.75+e()*.45)),e()<.65&&l.stones.push(c.matrix.clone());continue}if(D>24&&D<75&&Math.hypot(X,G)<580&&e()<.14){c.scale.setScalar(z*1.1),c.updateMatrix(),t.trunks.push(c.matrix.clone()),t.crowns.push(c.matrix.clone()),t.crownsColors.push(new Me().setHSL(0,0,.75+e()*.45));continue}if(W>-5&&W<40&&X>K.lake.x-60){e()<.35&&(c.scale.setScalar(z),c.updateMatrix(),a.trunks.push(c.matrix.clone()),a.crowns.push(c.matrix.clone()),a.crownsColors.push(new Me().setHSL(0,0,.75+e()*.45)));continue}let _e=jt(X*.0045,G*.0045,3)>.38,Ze=G<-340&&Math.abs(X)<420||D>75,Oe=Ze?_e?.82:.15:_e?.58:.1;if(e()<Oe){let st=Math.max(.65,1-Math.max(0,D-80)/180);c.scale.setScalar(z*st),c.updateMatrix(),Ze?(o.trunks.push(c.matrix.clone()),o.crowns.push(c.matrix.clone()),o.crownsColors.push(new Me().setHSL(0,0,.75+e()*.45)),e()<.75&&o.clutter.push(c.matrix.clone())):e()<.32?(n.trunks.push(c.matrix.clone()),n.crowns.push(c.matrix.clone()),n.crownsColors.push(new Me().setHSL(0,0,.75+e()*.45)),e()<.6&&n.stones.push(c.matrix.clone())):(s.trunks.push(c.matrix.clone()),s.crowns.push(c.matrix.clone()),s.crownsColors.push(new Me().setHSL(0,0,.75+e()*.45)),e()<.6&&s.stones.push(c.matrix.clone()))}}let w=[],b=[],x=[],V=[],y=yt(110293);for(let B=0;B<1800;B++){let X=(y()-.5)*3200,G=(y()-.5)*3e3,D=ze(X,G);if(D<32||D>240||Math.abs(X)<55&&G<-200||Math.hypot(X,G)<320||Math.hypot(X-K.buddhistTemple.x,G-K.buddhistTemple.z)<120||Math.hypot(X-K.mosque.x,G-K.mosque.z)<110||G<=-450&&Math.abs(X)<180||Math.abs(X)<52&&G>=760&&G<=1120||jt(X*.0035,G*.0035,3)<.28)continue;let W=ze(X+2,G)-ze(X-2,G),ee=ze(X,G+2)-ze(X,G-2),ue=-Math.atan2(ee,4)*.05,ge=Math.atan2(W,4)*.05,we=Math.max(.7,1-Math.max(0,D-110)/220),_e=(1.35+y()*1.65)*we;c.position.set(X,D-1.5,G),c.rotation.set(ue+(y()-.5)*.12,y()*Math.PI*2,ge+(y()-.5)*.12),c.scale.setScalar(_e),c.updateMatrix(),D>65||G<-180||y()<.72?(w.push(c.matrix.clone()),b.push(new Me().setHSL(0,0,.75+y()*.45))):(x.push(c.matrix.clone()),V.push(new Me().setHSL(0,0,.75+y()*.45)))}let H=(B,X,G,D=0,z=!0,W=null)=>{if(!G.length)return;let ee=new ut(B,X,G.length),ue=new _t,ge=new _t().makeTranslation(0,D,0);G.forEach((we,_e)=>{ue.copy(we).multiply(ge),ee.setMatrixAt(_e,ue),W&&W[_e]&&ee.setColorAt(_e,W[_e])}),ee.instanceMatrix.needsUpdate=!0,W&&W.length>0&&(ee.instanceColor.needsUpdate=!0),ee.geometry.computeBoundingSphere(),typeof ee.computeBoundingSphere=="function"&&ee.computeBoundingSphere(),ee.castShadow=z,ee.receiveShadow=!0,ee.frustumCulled=!0,this.world.scene.add(ee)},M=pe.bark(1.6),L=pe.bark(2),T=pe.bark(1.5),N=(B,X,G=.45)=>{let D=new ct(B,X,2,2),z=D.attributes.position;for(let ge=0;ge<z.count;ge++){let we=z.getX(ge),_e=z.getY(ge),Ze=we/(B*.5),Oe=_e/(X*.5),st=(1-Ze*Ze)*G*(1-Oe*.35)+(1-Oe*Oe)*G*.25;z.setZ(ge,st)}D.computeVertexNormals();let W=D.clone();W.rotateY(Math.PI/2);let ee=D.clone();return ee.rotateY(Math.PI/4),ee.rotateX(.2),je([D,W,ee],!1)||D},q=(()=>{let B=[],X=new F(1.3,2.6,2.4,16),G=X.attributes.position;for(let W=0;W<G.count;W++){let ee=G.getX(W),ue=G.getY(W),ge=G.getZ(W),we=(ue+1.2)/2.4,_e=Math.atan2(ge,ee),Ze=Math.hypot(ee,ge),Oe=Math.cos(_e*6)*Math.pow(1-we,1.6)*.85;G.setX(W,Math.cos(_e)*(Ze+Oe)),G.setY(W,ue+1.2),G.setZ(W,Math.sin(_e)*(Ze+Oe))}X.computeVertexNormals(),B.push(X);for(let W=0;W<6;W++){let ee=W/6*Math.PI*2+.15,ue=new F(.25,.55,3.2,6);ue.rotateZ(.78),ue.rotateY(ee),ue.translate(Math.cos(ee)*1.8,.4,Math.sin(ee)*1.8),B.push(ue)}let D=new F(.95,1.3,4.6,10);D.rotateZ(.12),D.translate(.28,4.4,.15),B.push(D);let z=new F(.72,.95,4.2,8);z.rotateZ(-.16),z.translate(.1,7.8,-.2),B.push(z);for(let W=0;W<5;W++){let ee=W/5*Math.PI*2+.25,ue=new F(.32,.58,5.8,6);ue.rotateZ(.68),ue.rotateY(ee),ue.translate(Math.cos(ee)*3,9.6,Math.sin(ee)*3),B.push(ue);let ge=new F(.14,.3,4,5);ge.rotateZ(.92),ge.rotateY(ee+.35),ge.translate(Math.cos(ee+.35)*4.6,12,Math.sin(ee+.35)*4.6),B.push(ge)}return Yt(je(B,!1)||X,.14,.22,31)})(),$=(()=>{let B=[],X=yt(202611),G=[[0,15.2,0,6.2,12],[4.2,12.4,2,5.2,8],[-4.2,12.4,-2,5.2,8],[2,12.6,4.2,5.2,8],[-2,12.6,-4.2,5.2,8],[3.2,14,-2.8,4.8,7],[-3.2,14,2.8,4.8,7],[3.8,9.2,-2.5,4.6,6],[-3.8,9.2,2.5,4.6,6],[2.5,8.8,3.8,4.6,6],[-2.5,8.8,-3.8,4.6,6],[0,11.6,0,5,8],[1.8,16.2,1.2,4.2,6],[-1.8,16.2,-1.2,4.2,6]];for(let[z,W,ee,ue,ge]of G)for(let we=0;we<ge;we++){let _e=Math.acos(1-2*X()),Ze=X()*Math.PI*2,Oe=ue*(.25+X()*.75),st=z+Math.sin(_e)*Math.cos(Ze)*Oe,vt=W+Math.cos(_e)*(Oe*.82),At=ee+Math.sin(_e)*Math.sin(Ze)*Oe,pt=5.6+X()*1.8,Tt=5+X()*1.6,xt=N(pt,Tt,.55);xt.rotateX((X()-.5)*Math.PI*.85),xt.rotateY(X()*Math.PI*2),xt.rotateZ((X()-.5)*.65),xt.translate(st,vt,At),B.push(xt)}let D=je(B,!1)||B[0];if(D&&D.attributes.position&&D.attributes.normal){let z=D.attributes.position,W=D.attributes.normal;for(let ee=0;ee<z.count;ee++){let ue=z.getX(ee),ge=z.getY(ee)-13,we=z.getZ(ee),_e=Math.hypot(ue,ge*.75,we)||1,Ze=ue/_e*.82+W.getX(ee)*.18,Oe=ge/_e*.82+W.getY(ee)*.18,st=we/_e*.82+W.getZ(ee)*.18,vt=Math.hypot(Ze,Oe,st)||1;W.setXYZ(ee,Ze/vt,Oe/vt,st/vt)}W.needsUpdate=!0}return D})(),Y=(()=>{let B=[],X=new F(1.1,2.2,2,12);X.translate(0,1,0),B.push(X);for(let D=0;D<5;D++){let z=D/5*Math.PI*2,W=new F(.18,.45,2.8,6);W.rotateZ(.72),W.rotateY(z),W.translate(Math.cos(z)*1.6,.35,Math.sin(z)*1.6),B.push(W)}let G=new F(.18,1.1,23,8);G.translate(0,12.5,0),B.push(G);for(let D=0;D<7;D++){let z=D/6,W=4+z*17.5,ee=3.6*(1-z*.55);for(let ue=0;ue<4;ue++){let ge=ue/4*Math.PI*2+D*.45,we=new F(.08,.18,ee,5);we.rotateZ(.65),we.rotateY(ge),we.translate(Math.cos(ge)*(ee*.4),W,Math.sin(ge)*(ee*.4)),B.push(we)}}return Yt(je(B,!1)||X,.12,.18,52)})(),k=(()=>{let B=[],X=yt(811);for(let D=0;D<9;D++){let z=D/8,W=3.5+z*18.5,ee=5.2*(1-z*.85),ue=6+Math.floor((1-z)*5);for(let ge=0;ge<ue;ge++){let we=ge/ue*Math.PI*2+D*.6,_e=-.15-(1-z)*.35,Ze=N(3.8,5.2,.42);Ze.rotateX(_e),Ze.rotateZ((X()-.5)*.2),Ze.rotateY(we),Ze.translate(Math.cos(we)*ee*.4,W,Math.sin(we)*ee*.4),B.push(Ze);let Oe=N(2.8,3.8,.45);Oe.rotateX(_e-.2),Oe.rotateY(we+.15),Oe.translate(Math.cos(we)*ee*.6,W-.4,Math.sin(we)*ee*.6),B.push(Oe)}}for(let D=0;D<4;D++){let z=N(2.5,4,.4);z.rotateX(.15),z.rotateY(D/4*Math.PI*2),z.translate(0,22.5,0),B.push(z)}let G=je(B,!1)||B[0];if(G&&G.attributes.position&&G.attributes.normal){let D=G.attributes.position,z=G.attributes.normal;for(let W=0;W<D.count;W++){let ee=D.getX(W),ue=D.getY(W)-10,ge=D.getZ(W),we=Math.hypot(ee,ue,ge)||1,_e=ee/we*.75+z.getX(W)*.25,Ze=ue/we*.75+z.getY(W)*.25,Oe=ge/we*.75+z.getZ(W)*.25,st=Math.hypot(_e,Ze,Oe)||1;z.setXYZ(W,_e/st,Ze/st,Oe/st)}z.needsUpdate=!0}return G})(),h=(()=>{let B=[],X=new F(1.1,2,2,10);X.translate(0,1,0),B.push(X);for(let z=0;z<4;z++){let W=z/4*Math.PI*2+.3,ee=new F(.22,.48,2.6,6);ee.rotateZ(.72),ee.rotateY(W),ee.translate(Math.cos(W)*1.5,.35,Math.sin(W)*1.5),B.push(ee)}let G=new F(.78,1.1,4.6,8);G.rotateZ(.18),G.translate(.35,3.2,0),B.push(G);let D=new F(.52,.78,5,8);D.rotateZ(.34),D.translate(1.1,6.8,.2),B.push(D);for(let z=0;z<4;z++){let W=z/4*Math.PI*2+.35,ee=new F(.22,.46,5.2,6);ee.rotateZ(.78),ee.rotateY(W),ee.translate(Math.cos(W)*2.8+1.1,9.2,Math.sin(W)*2.8+.2),B.push(ee)}return Yt(je(B,!1)||X,.15,.25,87)})(),v=(()=>{let B=[];for(let ee=0;ee<28;ee++){let ue=ee/28*Math.PI*2,ge=3+ee%2*1,we=9.2+ee%3*1.6,_e=N(3.6,we,.38);_e.rotateY(ue+Math.PI*.5),_e.translate(Math.cos(ue)*ge+.8,6.2,Math.sin(ue)*ge+.1),B.push(_e)}let G=36;for(let ee=0;ee<G;ee++){let ue=ee/G*Math.PI*2+.12,ge=5.6+ee%3*1.5,we=11.2+ee%4*1.8,_e=N(3.8,we,.42);_e.rotateX(.14),_e.rotateY(ue+Math.PI*.5),_e.translate(Math.cos(ue)*ge+.8,5.6,Math.sin(ue)*ge+.1),B.push(_e)}let D=48;for(let ee=0;ee<D;ee++){let ue=ee/D*Math.PI*2+.22,ge=7.8+ee%3*1.6,we=12.8+ee%4*2,_e=N(4,we,.46);_e.rotateX(.22),_e.rotateY(ue+Math.PI*.5),_e.translate(Math.cos(ue)*ge+.8,5,Math.sin(ue)*ge+.1),B.push(_e)}let z=24;for(let ee=0;ee<z;ee++){let ue=ee/z*Math.PI*2,ge=N(5.6,5.6,.58);ge.rotateX(.44),ge.rotateY(ue),ge.translate(Math.cos(ue)*4.2+.8,10.8,Math.sin(ue)*4.2+.1),B.push(ge)}let W=je(B,!1)||B[0];if(W&&W.attributes.position&&W.attributes.normal){let ee=W.attributes.position,ue=W.attributes.normal;for(let ge=0;ge<ee.count;ge++){let we=ee.getX(ge)-.8,_e=ee.getY(ge)-7,Ze=ee.getZ(ge)-.1,Oe=Math.hypot(we,Ze)||1,st=we/Oe*.82+ue.getX(ge)*.18,vt=_e/(Math.hypot(we,_e,Ze)||1)*.5+ue.getY(ge)*.18,At=Ze/Oe*.82+ue.getZ(ge)*.18,pt=Math.hypot(st,vt,At)||1;ue.setXYZ(ge,st/pt,vt/pt,At/pt)}ue.needsUpdate=!0}return W})(),_=(()=>{let B=[],X=new F(.75,1.35,2.2,10);X.translate(0,1.1,0),B.push(X);let G=8;for(let D=0;D<G;D++){let z=D/G,W=.75*(1-z*.38),ee=.75*(1-(D+1)/G*.38),ue=new F(ee,W,1.45,8),ge=Math.sin(z*Math.PI*.75)*.85,we=Math.cos(z*Math.PI*.65)*.55;ue.translate(ge,2.2+D*1.4+.72,we),B.push(ue)}return je(B,!1)||X})(),g=(()=>{let B=[];for(let X=0;X<10;X++){let G=X/10*Math.PI*2+.1,D=2.2,z=-.5,W=N(2.6,4.8,.42);W.rotateX(z),W.rotateY(G),W.translate(Math.cos(G)*D,2.6,Math.sin(G)*D),B.push(W)}for(let X=0;X<16;X++){let G=X/16*Math.PI*2;for(let D=0;D<2;D++){let z=D/2,W=1.8+z*5.2,ee=.22+z*1.18,ue=N(3.2*(1-z*.28),4.6,.5);ue.rotateX(ee),ue.rotateY(G),ue.translate(Math.cos(G)*W,1.6-Math.sin(ee)*2.8,Math.sin(G)*W),B.push(ue)}}for(let X=0;X<12;X++){let G=X/12*Math.PI*2+.25;for(let D=0;D<2;D++){let z=D/2,W=2.4+z*4.6,ee=.72+z*.85,ue=N(2.8*(1-z*.25),4.4,.52);ue.rotateX(ee),ue.rotateY(G),ue.translate(Math.cos(G)*W,-.6-Math.sin(ee)*2.4,Math.sin(G)*W),B.push(ue)}}for(let X=0;X<8;X++){let G=X/8*Math.PI*2+.4,D=2.8,z=1.35,W=N(2.4,3.8,.45);W.rotateX(z),W.rotateY(G),W.translate(Math.cos(G)*D,-2.4,Math.sin(G)*D),B.push(W)}return je(B,!1)||B[0]})(),i=(()=>{let B=[],X=new F(.55,1.1,1.8,8);X.translate(0,.9,0),B.push(X);let G=new F(.28,.55,5.5,8);return G.translate(0,4.25,0),B.push(G),je(B,!1)||X})(),S=(()=>{let B=[];for(let z=0;z<56;z++){let W=z/55,ee=1.4+W*16.5,ue=z*2.39996,we=.65*Math.sin(Math.pow(W,.45)*Math.PI)+.18,_e=1.45*(1-W*.3),Ze=2.4*(1-W*.3),Oe=N(_e,Ze,.28);Oe.rotateX(.18+(1-W)*.2),Oe.rotateY(ue),Oe.translate(Math.cos(ue)*we,ee,Math.sin(ue)*we),B.push(Oe)}let D=je(B,!1)||B[0];if(D&&D.attributes.position&&D.attributes.normal){let z=D.attributes.position,W=D.attributes.normal;for(let ee=0;ee<z.count;ee++){let ue=z.getX(ee),ge=z.getZ(ee),we=Math.hypot(ue,ge)||1,_e=ue/we*.85+W.getX(ee)*.15,Ze=.15+W.getY(ee)*.15,Oe=ge/we*.85+W.getZ(ee)*.15,st=Math.hypot(_e,Ze,Oe)||1;W.setXYZ(ee,_e/st,Ze/st,Oe/st)}W.needsUpdate=!0}return D})(),C=(()=>{let B=[],X=new F(.75,1.45,1.8,8);X.translate(0,.9,0),B.push(X);for(let D=0;D<4;D++){let z=D/4*Math.PI*2+.2,W=new F(.2,.42,2.4,6);W.rotateZ(.7),W.rotateY(z),W.translate(Math.cos(z)*1.3,.4,Math.sin(z)*1.3),B.push(W)}let G=new F(.55,.75,3.8,8);G.rotateZ(.12),G.translate(.15,3.4,0),B.push(G);for(let D=0;D<5;D++){let z=D/5*Math.PI*2+.35,W=new F(.16,.38,5,6);W.rotateZ(.74),W.rotateY(z),W.translate(Math.cos(z)*2.5,6,Math.sin(z)*2.5),B.push(W)}return Yt(je(B,!1)||X,.16,.22,103)})(),O=(()=>{let B=[],X=yt(7821),G=[[0,10.2,0,5.2,14],[3.6,8.2,2,4.6,10],[-3.6,8.2,-2,4.6,10],[2,8.4,3.6,4.6,10],[-2,8.4,-3.6,4.6,10],[2.8,9.8,-2.6,4.2,8],[-2.8,9.8,2.6,4.2,8],[1.8,11.2,1.4,3.8,6],[-1.8,11.2,-1.4,3.8,6]];for(let[z,W,ee,ue,ge]of G)for(let we=0;we<ge;we++){let _e=Math.acos(1-2*X()),Ze=X()*Math.PI*2,Oe=ue*(.28+X()*.72),st=z+Math.sin(_e)*Math.cos(Ze)*Oe,vt=W+Math.cos(_e)*(Oe*.78),At=ee+Math.sin(_e)*Math.sin(Ze)*Oe,pt=4.8+X()*1.6,Tt=4.6+X()*1.5,xt=N(pt,Tt,.44);xt.rotateX((X()-.5)*Math.PI*.85),xt.rotateY(X()*Math.PI*2),xt.rotateZ((X()-.5)*.6),xt.translate(st,vt,At),B.push(xt)}let D=je(B,!1)||B[0];if(D&&D.attributes.position&&D.attributes.normal){let z=D.attributes.position,W=D.attributes.normal;for(let ee=0;ee<z.count;ee++){let ue=z.getX(ee),ge=z.getY(ee)-9,we=z.getZ(ee),_e=Math.hypot(ue,ge*.85,we)||1,Ze=ue/_e*.82+W.getX(ee)*.18,Oe=ge/_e*.82+W.getY(ee)*.18,st=we/_e*.82+W.getZ(ee)*.18,vt=Math.hypot(Ze,Oe,st)||1;W.setXYZ(ee,Ze/vt,Oe/vt,st/vt)}W.needsUpdate=!0}return D})(),te=(()=>{let B=new $t(5.2,8);return B.rotateX(-Math.PI/2),B})(),m=(()=>{let B=new Vt(1.1,1);B.translate(0,.55,0);let X=new Vt(.7,1);return X.translate(1.2,.35,.6),Yt(je([B,X],!1)||B,.12,.32,91)})(),E=pe.pineNeedles(2641700);E.alphaTest=.5,E.depthWrite=!0;let R=yo("leafCard"),P=Go(4750642,R.map,{isTree:!0,normalMap:R.normalMap,normalScale:.65,roughness:.72,sssColor:new Me(8575029),shadowColor:new Me(1721364),sssIntensity:.88,windIntensity:1.1}),oe=Go(14194730,R.map,{isTree:!0,normalMap:R.normalMap,normalScale:.65,roughness:.7,sssColor:new Me(16763458),shadowColor:new Me(3809800),sssIntensity:.92,windIntensity:1.1}),ne=pe.sakuraBlossom(16777215),se=Go(5936182,R.map,{isTree:!0,normalMap:R.normalMap,normalScale:.55,roughness:.72,sssColor:new Me(8575029),shadowColor:new Me(1721364),sssIntensity:.9,windIntensity:1.35}),ae=pe.palmFrond(16777215),I=yo("cypressFoliage"),Z=Go(2380838,I.map,{isTree:!0,normalMap:I.normalMap,normalScale:1.3,roughness:.76,sssColor:new Me(6473768),shadowColor:new Me(1456658),sssIntensity:.7,windIntensity:.95}),ie=pe.fallenPineNeedles(2.5),ve=pe.mossyStone(1);this.world._windMaterials&&this.world._windMaterials.push(E,P,oe,ne,se,ae,Z),H(Y,M,o.trunks,0,!0),H(k,E,o.crowns,0,!1,o.crownsColors),H(te,ie,o.clutter,.06,!1),H(q,M,s.trunks,0,!0),H($,P,s.crowns,0,!1,s.crownsColors),H(m,ve,s.stones,0,!0),H(q,M,n.trunks,0,!0),H($,oe,n.crowns,0,!1,n.crownsColors),H(m,ve,n.stones,0,!0),H(C,T,t.trunks,0,!0),H(O,ne,t.crowns,0,!1,t.crownsColors),H(Y,M,w,0,!0),H(k,E,w,0,!1,b),H(q,M,x,0,!0),H($,P,x,0,!1,V),H(i,M,u.trunks,0,!0),H(S,Z,u.crowns,0,!1,u.crownsColors),H(h,M,l.trunks,0,!0),H(v,se,l.crowns,0,!1,l.crownsColors),H(m,ve,l.stones,0,!0),H(_,L,a.trunks,0,!0),H(g,ae,a.crowns,13.5,!1,a.crownsColors);let De=new F(.9,1.6,20,4);De.translate(0,10,0),De.rotateY(Math.PI/4);let Ue=new lt(1.27,3.2,4);Ue.translate(0,21.6,0),Ue.rotateY(Math.PI/4);let Ke=pe.limestoneDark(2),U=pe.gold(1),xe=[[-280,ze(-280,260),260,.05],[310,ze(310,140),140,-.08],[-190,ze(-190,-180),-180,.12],[180,ze(180,720),720,0],[-80,ze(-80,980),980,-.06]],Ce=new qe;xe.forEach(([B,X,G,D])=>{let z=new r(De,Ke);z.position.set(B,X,G),z.rotation.y=D,z.castShadow=z.receiveShadow=!0,Ce.add(z);let W=new r(Ue,U);W.position.set(B,X,G),W.rotation.y=D,W.castShadow=!0,Ce.add(W)}),this.world.scene.add(Ce);let Pe=(()=>{let B=[],X=new F(.72,.85,9.2,16),G=X.attributes.position;for(let _e=0;_e<G.count;_e++){let Ze=G.getX(_e),Oe=G.getY(_e),st=G.getZ(_e),vt=Math.atan2(st,Ze),At=Math.hypot(Ze,st),pt=Math.cos(vt*16)*.06;G.setX(_e,Math.cos(vt)*(At+pt)),G.setY(_e,Oe+4.6),G.setZ(_e,Math.sin(vt)*(At+pt))}X.computeVertexNormals(),B.push(X);let D=new rt(.72,16,8,0,Math.PI*2,0,Math.PI/2);D.translate(0,9.2,0),B.push(D);let z=new F(.38,.42,1.8,8);z.rotateZ(Math.PI/2),z.translate(1.2,4.8,0),B.push(z);let W=new F(.36,.38,3.8,8);W.translate(2.1,6.7,0),B.push(W);let ee=new rt(.36,8,6,0,Math.PI*2,0,Math.PI/2);ee.translate(2.1,8.6,0),B.push(ee);let ue=new F(.35,.4,1.6,8);ue.rotateZ(-Math.PI/2),ue.rotateY(.4),ue.translate(-1.1*Math.cos(.4),3.6,-1.1*Math.sin(.4)),B.push(ue);let ge=new F(.34,.35,3.2,8);ge.translate(-1.9*Math.cos(.4),5.2,-1.9*Math.sin(.4)),B.push(ge);let we=new rt(.34,8,6,0,Math.PI*2,0,Math.PI/2);return we.translate(-1.9*Math.cos(.4),6.8,-1.9*Math.sin(.4)),B.push(we),Yt(je(B,!1)||X,.12,.15,66)})();H(Pe,pe.foliage(1.2,4880960),f,0,!0)}async _meadowCarpet(){let e=performance.now(),o=()=>performance.now()-e>16?(e=performance.now(),new Promise(k=>setTimeout(k,0))):Promise.resolve(),s=yt(20260405),n=[],t=[],a=[],l=[],u=[],f=[],c=new Lt,p=typeof window<"u"&&window.innerWidth<=768,w=p?1e4:35e3,b=p?3e3:1e4;for(let k=0;k<w;k++){k%2e3===0&&await o();let h=s()*1300-420,v=(s()-.5)*620,_=ze(v,h);if(_<K.waterLevel+.3||_>145||xo(v,h)<.6||Math.hypot(v-K.plaza.x,h-K.plaza.z)<K.plaza.r+6||Math.hypot(v-K.bridge.x,h-K.bridge.z)<80)continue;let i=.85+s()*.65;c.position.set(v,_,h),c.rotation.set(0,s()*Math.PI*2,0),c.scale.setScalar(i),c.updateMatrix(),n.push(c.matrix.clone())}for(let k=0;k<b;k++){k%2e3===0&&await o();let h=s()*1300-420,v=(s()-.5)*620,_=ze(v,h);if(_<K.waterLevel+.3||_>145||xo(v,h)<.8||Math.hypot(v-K.plaza.x,h-K.plaza.z)<K.plaza.r+8||Math.hypot(v-K.bridge.x,h-K.bridge.z)<80)continue;let i=.85+s()*.55;c.position.set(v,_,h),c.rotation.set(0,s()*Math.PI*2,0),c.scale.setScalar(i),c.updateMatrix();let S=s();S<.28?t.push(c.matrix.clone()):S<.52?a.push(c.matrix.clone()):S<.74?l.push(c.matrix.clone()):S<.9?u.push(c.matrix.clone()):(c.scale.setScalar(.35+s()*.4),c.updateMatrix(),f.push(c.matrix.clone()))}let x=(k,h,v,_=!1)=>{if(!v.length)return;k.computeBoundingSphere&&k.computeBoundingSphere();let g=new ut(k,h,v.length);v.forEach((i,S)=>g.setMatrixAt(S,i)),g.instanceMatrix.needsUpdate=!0,typeof g.computeBoundingSphere=="function"&&g.computeBoundingSphere(),typeof g.computeBoundingBox=="function"&&g.computeBoundingBox(),g.castShadow=_,g.receiveShadow=!1,g.frustumCulled=!1,this.world.scene.add(g)},V=(()=>{let k=[],h=yt(842);for(let v=0;v<10;v++){let _=.03+h()*.04,g=.4+h()*.7,i=new ct(_,g,1,3),S=i.attributes.position,C=h()*Math.PI*2,O=.15+h()*.35,te=h()*.25,m=Math.cos(h()*Math.PI*2)*te,E=Math.sin(h()*Math.PI*2)*te;for(let R=0;R<S.count;R++){let P=S.getX(R),oe=S.getY(R)+g*.5,ne=Math.max(0,oe/g);P*=1-Math.pow(ne,1.5);let se=Math.pow(ne,2)*O,ae=P*Math.cos(C)-se*Math.sin(C),I=P*Math.sin(C)+se*Math.cos(C);S.setXYZ(R,ae+m,oe,I+E)}i.computeVertexNormals(),k.push(i)}return je(k,!1)||k[0]})(),y=(()=>{let k=[];for(let h=0;h<3;h++){let v=h/3*Math.PI,_=new ct(1.15,1.25);_.translate(0,.625,0),_.rotateY(v),k.push(_)}return je(k,!1)||k[0]})(),H=(()=>{let k=[];for(let h=0;h<3;h++){let v=h/3*Math.PI,_=new ct(.9,1.45);_.translate(0,.725,0),_.rotateY(v),k.push(_)}return je(k,!1)||k[0]})(),M=(()=>{let k=new Vt(.65,1);return k.translate(0,.32,0),Yt(k,.2,.25,47)})(),L=Go(5674558,null,{isTree:!1,roughness:.92,sssColor:9232453,sssIntensity:.75,windIntensity:.8});L.depthWrite=!0,L.transparent=!1;let T=pe.goldenPoppy();T.alphaTest=.5,T.depthWrite=!0,T.transparent=!1;let N=pe.edelweiss();N.alphaTest=.5,N.depthWrite=!0,N.transparent=!1;let q=pe.lavenderSprig();q.alphaTest=.5,q.depthWrite=!0,q.transparent=!1;let $=pe.forgetMeNot();$.alphaTest=.5,$.depthWrite=!0,$.transparent=!1;let Y=pe.mossyStone(1);this.world._windMaterials&&this.world._windMaterials.push(L,T,N,q,$),x(V,L,n,!1),x(y,T,t,!1),x(y,N,a,!1),x(H,q,l,!1),x(y,$,u,!1),x(M,Y,f,!0)}async _districtFeatures(){let e=performance.now(),o=()=>performance.now()-e>16?(e=performance.now(),new Promise(m=>setTimeout(m,0))):Promise.resolve(),s=yt(88442),n=new Lt,t=(m,E,R=14)=>{let P=ze(m,E);if(P<K.waterLevel+1||P>170||xo(m,E)<R||Math.hypot(m-K.plaza.x,E-K.plaza.z)<K.plaza.r+26||Math.hypot(m-K.bridge.x,E-K.bridge.z)<140||Math.hypot(m-K.gate.x,E-K.gate.z)<120||Math.abs(m)<52&&E>=760&&E<=1120)return null;for(let oe of this.world.plots)if(Math.hypot(m-oe.x,E-oe.z)<14)return null;return P},a=[],l=[],u=[];for(let m=0;m<180;m++){let E=s()*Math.PI*2,R=K.lake.r+8+s()*48,P=K.lake.x+Math.cos(E)*R,oe=K.lake.z+Math.sin(E)*R,ne=t(P,oe,16);if(ne===null||s()>.15)continue;let se=.8+s()*.5;n.position.set(P,ne-1.5,oe),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(se),n.updateMatrix(),a.push(n.matrix.clone()),l.push(n.matrix.clone()),u.push(n.matrix.clone())}let f=[],c=[];for(let m=0;m<250;m++){m%50===0&&await o();let E=500+s()*300,R=-200+s()*400,P=Math.hypot(E-K.lake.x,R-K.lake.z)-K.lake.r;if(P<2||P>80)continue;let oe=t(E,R,10);oe!==null&&(n.position.set(E,oe,R),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(.6+s()*.6),n.updateMatrix(),s()<.85?f.push(n.matrix.clone()):c.push(n.matrix.clone()))}let p=[],w=[];for(let m=0;m<300;m++){m%50===0&&await o();let E=-200+s()*400,R=-650+s()*320,P=t(E,R,8);P!==null&&(n.position.set(E,P,R),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(.5+s()*.6),n.updateMatrix(),s()<.8?p.push(n.matrix.clone()):w.push(n.matrix.clone()))}let b=[],x=[];for(let m=0;m<200;m++){let E=-650+s()*350,R=200+s()*350,P=t(E,R,10);P===null||P>70||(n.position.set(E,P,R),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(.5+s()*.7),n.updateMatrix(),s()<.7?b.push(n.matrix.clone()):x.push(n.matrix.clone()))}let V=[],y=[];for(let m=0;m<160;m++){let E=-700+s()*350,R=-600+s()*400,P=t(E,R,12);P===null||P<45||(n.position.set(E,P,R),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(.6+s()*.5),n.updateMatrix(),s()<.35?V.push(n.matrix.clone()):y.push(n.matrix.clone()))}let H=[],M=[];for(let m=0;m<200;m++){let E=-300+s()*600,R=240+s()*450,P=t(E,R,12);P===null||P>60||(n.position.set(E,P,R),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(.7+s()*.5),n.updateMatrix(),s()<.4?H.push(n.matrix.clone()):M.push(n.matrix.clone()))}let L=(m,E,R,P=0)=>{if(!R.length)return;m.computeBoundingSphere&&m.computeBoundingSphere();let oe=new ut(m,E,R.length),ne=new _t,se=new _t().makeTranslation(0,P,0);R.forEach((ae,I)=>{ne.copy(ae).multiply(se),oe.setMatrixAt(I,ne)}),oe.instanceMatrix.needsUpdate=!0,typeof oe.computeBoundingSphere=="function"&&oe.computeBoundingSphere(),typeof oe.computeBoundingBox=="function"&&oe.computeBoundingBox(),oe.castShadow=!0,oe.frustumCulled=!1,this.world.scene.add(oe)},T=(m,E,R,P,oe)=>{if(!R.length)return;m.computeBoundingSphere&&m.computeBoundingSphere();let ne=new ut(m,E,R.length),se=new _t,ae=new _t().makeTranslation(0,P,0),I=new Me;R.forEach((Z,ie)=>{se.copy(Z).multiply(ae),ne.setMatrixAt(ie,se),ne.setColorAt(ie,I.setHex(oe(ie)))}),ne.instanceMatrix.needsUpdate=!0,ne.instanceColor&&(ne.instanceColor.needsUpdate=!0),typeof ne.computeBoundingSphere=="function"&&ne.computeBoundingSphere(),typeof ne.computeBoundingBox=="function"&&ne.computeBoundingBox(),ne.castShadow=!0,ne.frustumCulled=!1,this.world.scene.add(ne)},N=pe.bark(1.5),q=(()=>{let m=[],E=new F(1.1,2,2,10);E.translate(0,1,0),m.push(E);for(let oe=0;oe<4;oe++){let ne=oe/4*Math.PI*2+.3,se=new F(.22,.48,2.6,6);se.rotateZ(.72),se.rotateY(ne),se.translate(Math.cos(ne)*1.5,.35,Math.sin(ne)*1.5),m.push(se)}let R=new F(.78,1.1,4.6,8);R.rotateZ(.18),R.translate(.35,3.2,0),m.push(R);let P=new F(.52,.78,5,8);P.rotateZ(.34),P.translate(1.1,6.8,.2),m.push(P);for(let oe=0;oe<4;oe++){let ne=oe/4*Math.PI*2+.35,se=new F(.22,.46,5.2,6);se.rotateZ(.78),se.rotateY(ne),se.translate(Math.cos(ne)*2.8+1.1,9.2,Math.sin(ne)*2.8+.2),m.push(se)}return Yt(je(m,!1)||E,.15,.25,87)})();L(q,N,a,0);let $=(m,E,R=.4)=>{let P=new ct(m,E,2,2),oe=P.attributes.position;for(let ne=0;ne<oe.count;ne++){let se=oe.getX(ne),ae=oe.getY(ne),I=se/(m*.5),Z=ae/(E*.5);oe.setZ(ne,(1-I*I)*R*(1-Z*.25))}return P.computeVertexNormals(),P},Y=(()=>{let m=[];for(let se=0;se<28;se++){let ae=se/28*Math.PI*2,I=3+se%2*1,Z=9.2+se%3*1.6,ie=$(3.6,Z,.38);ie.rotateY(ae+Math.PI*.5),ie.translate(Math.cos(ae)*I+.8,6.2,Math.sin(ae)*I+.1),m.push(ie)}let R=36;for(let se=0;se<R;se++){let ae=se/R*Math.PI*2+.12,I=5.6+se%3*1.5,Z=11.2+se%4*1.8,ie=$(3.8,Z,.42);ie.rotateX(.14),ie.rotateY(ae+Math.PI*.5),ie.translate(Math.cos(ae)*I+.8,5.6,Math.sin(ae)*I+.1),m.push(ie)}let P=48;for(let se=0;se<P;se++){let ae=se/P*Math.PI*2+.22,I=7.8+se%3*1.6,Z=12.8+se%4*2,ie=$(4,Z,.46);ie.rotateX(.22),ie.rotateY(ae+Math.PI*.5),ie.translate(Math.cos(ae)*I+.8,5,Math.sin(ae)*I+.1),m.push(ie)}let oe=24;for(let se=0;se<oe;se++){let ae=se/oe*Math.PI*2,I=$(5.6,5.6,.58);I.rotateX(.44),I.rotateY(ae),I.translate(Math.cos(ae)*4.2+.8,10.8,Math.sin(ae)*4.2+.1),m.push(I)}let ne=je(m,!1)||m[0];if(ne&&ne.attributes.position&&ne.attributes.normal){let se=ne.attributes.position,ae=ne.attributes.normal;for(let I=0;I<se.count;I++){let Z=se.getX(I)-.8,ie=se.getY(I)-7,ve=se.getZ(I)-.1,De=Math.hypot(Z,ve)||1,Ue=Z/De*.82+ae.getX(I)*.18,Ke=ie/(Math.hypot(Z,ie,ve)||1)*.5+ae.getY(I)*.18,U=ve/De*.82+ae.getZ(I)*.18,xe=Math.hypot(Ue,Ke,U)||1;ae.setXYZ(I,Ue/xe,Ke/xe,U/xe)}ae.needsUpdate=!0}return ne})(),k=pe.leafCard(5936182);this.world._windMaterials&&this.world._windMaterials.push(k),L(Y,k,l,0);let h=(()=>{let m=[];for(let E=0;E<6;E++){let R=E/6*Math.PI*2,P=new ct(.35,1.8);P.rotateX(.25),P.rotateY(R),P.translate(Math.cos(R)*.3,.9,Math.sin(R)*.3),m.push(P)}return je(m,!1)||m[0]})();L(h,pe.grassTuft(),f,0);let v=pe.bark(1);L(new Qn(.35,3.8,6,10),v,c,.25);let _=(()=>{let m=[];for(let E=0;E<7;E++){let R=E/7*Math.PI*2,P=new ct(.65,1.9);P.rotateX(.55),P.rotateY(R),P.translate(Math.cos(R)*.6,.65,Math.sin(R)*.6),m.push(P)}return je(m,!1)||m[0]})();L(_,pe.leafCard(3697470),p,0);let g=(()=>{let m=new F(.08,.12,.6,6);m.translate(0,.3,0);let E=new rt(.24,8,6);return E.scale(1.2,.45,1.2),E.translate(0,.6,0),je([m,E],!1)||E})();L(g,new ot({color:14602942,roughness:.92,metalness:0}),w,0);let i=(()=>{let m=[];for(let R=0;R<12;R++){let P=R/12*Math.PI*2,oe=new ct(.45,1.8);oe.rotateX(.65),oe.rotateY(P),oe.translate(Math.cos(P)*.5,.6,Math.sin(P)*.5),m.push(oe)}let E=new F(.06,.12,3.2,6);return E.translate(0,1.6,0),m.push(E),je(m,!1)||m[0]})();L(i,pe.foliage(1.2,7243874),b,0);let S=(()=>{let m=[];for(let E=0;E<3;E++){let R=1.2-E*.28,P=new Vt(R,1);P.translate((E-1)*.4,R*.7,(E%2-.5)*.3),m.push(P)}return je(m,!1)||m[0]})();L(S,pe.rockCliff(2.5),V,0);let C=(()=>{let m=[];for(let E=0;E<10;E++){let R=E/10*Math.PI*2,P=new ct(1.4,1.4);P.rotateX(.4),P.rotateY(R),P.translate(Math.cos(R)*.9,.7,Math.sin(R)*.9),m.push(P)}return je(m,!1)||m[0]})();L(C,pe.leafCard(4746050),y,0);let O=(()=>{let m=[];for(let E=0;E<14;E++){let R=(E-7)*.35,P=new ct(1.6,2.2);P.rotateY(E*.8),P.translate(R,1.1,0),m.push(P)}return je(m,!1)||m[0]})();L(O,pe.leafCard(4091448),H,0);let te=(()=>{let m=[];for(let E=0;E<12;E++){let R=E/12*Math.PI*2,P=new ct(1.1,1.4);P.rotateX(.35),P.rotateY(R),P.translate(Math.cos(R)*.7,.8,Math.sin(R)*.7),m.push(P)}return je(m,!1)||m[0]})();L(te,pe.wildflowers(),M,0)}async _sanctuaryTree(){let e=performance.now(),o=()=>performance.now()-e>16?(e=performance.now(),new Promise(_=>setTimeout(_,0))):Promise.resolve(),s=0,n=-140,t=ze(s,n),a=new qe;a.position.set(s,t,n);let l=pe.bark(1.2),u=pe.bark(1.5),f=yo("leafCard"),c=Go(9759312,f.map,{isTree:!0,normalMap:f.normalMap,normalScale:.65,roughness:.72,sssColor:new Me(10813272),shadowColor:new Me(1721364),sssIntensity:.92,windIntensity:1.15});this.world._windMaterials&&this.world._windMaterials.push(c);let p=new bo(.1,18,32),w=document.createElement("canvas");w.width=w.height=128;let b=w.getContext("2d"),x=b.createRadialGradient(64,64,10,64,64,64);x.addColorStop(0,"rgba(0, 0, 0, 0.75)"),x.addColorStop(.5,"rgba(0, 0, 0, 0.40)"),x.addColorStop(1,"rgba(0, 0, 0, 0)"),b.fillStyle=x,b.fillRect(0,0,128,128);let V=new Kt(w),y=new r(p,new Ct({map:V,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1}));y.rotation.x=-Math.PI/2,y.position.y=.08,a.add(y);let H=24,M=20,L=new F(2.4,6.4,13.5,H,M),T=L.attributes.position;for(let _=0;_<T.count;_++){let g=T.getX(_),i=T.getY(_),S=T.getZ(_),C=(i+6.75)/13.5,O=Math.atan2(S,g),te=Math.hypot(g,S),m=Math.cos(O*6)*Math.pow(1-C,1.8)*2.4,E=te+m;T.setX(_,Math.cos(O)*E),T.setY(_,i+6.75),T.setZ(_,Math.sin(O)*E)}L.computeVertexNormals();let N=new r(L,l);N.castShadow=!0,N.receiveShadow=!0,a.add(N);for(let _=0;_<8;_++){let g=_/8*Math.PI*2+_%2*.25,i=[],S=new F(1,1.4,4.5,8);S.rotateZ(.42),S.rotateY(g),S.translate(Math.cos(g)*2.8,14.5,Math.sin(g)*2.8),i.push(S);let C=new F(.55,1,4.8,8);C.rotateZ(.65),C.rotateY(g+.15),C.translate(Math.cos(g+.15)*5.8,17.5,Math.sin(g+.15)*5.8),i.push(C);let O=new F(.18,.55,4.5,6);O.rotateZ(.82),O.rotateY(g+.28),O.translate(Math.cos(g+.28)*8.8,19.8,Math.sin(g+.28)*8.8),i.push(O);let te=je(i,!1)||S,m=new r(te,u);m.castShadow=!0,a.add(m)}let q=(_,g,i=.45)=>{let S=new ct(_,g,2,2),C=S.attributes.position;for(let O=0;O<C.count;O++){let te=C.getX(O),m=C.getY(O),E=te/(_*.5),R=m/(g*.5);C.setZ(O,(1-E*E)*i*(1-R*.35)+(1-R*R)*i*.25)}return S.computeVertexNormals(),S},$=[],Y=yt(8888);for(let _=0;_<340;_++){let g=Math.acos(1-2*Y()),i=Y()*Math.PI*2,S=2.5+Y()*16.5,C=Math.sin(g)*Math.cos(i)*S,O=21+Math.cos(g)*(S*.82),te=Math.sin(g)*Math.sin(i)*S,m=3.8+Y()*2,E=q(m,m*.95,.52);E.rotateX((Y()-.5)*Math.PI*.85),E.rotateY(Y()*Math.PI*2),E.rotateZ((Y()-.5)*.65),E.translate(C,O,te),$.push(E)}let k=je($,!1)||$[0];if(k&&k.attributes.position&&k.attributes.normal){let _=k.attributes.position,g=k.attributes.normal;for(let i=0;i<_.count;i++){let S=_.getX(i),C=_.getY(i)-21,O=_.getZ(i),te=Math.hypot(S,C,O)||1,m=S/te*.85+g.getX(i)*.15,E=C/te*.85+g.getY(i)*.15,R=O/te*.85+g.getZ(i)*.15,P=Math.hypot(m,E,R)||1;g.setXYZ(i,m/P,E/P,R/P)}g.needsUpdate=!0}let h=new r(k,c);h.castShadow=!1,h.receiveShadow=!0,a.add(h);let v=new ot({color:4008984,emissive:16101441,emissiveIntensity:2.2,roughness:.25,metalness:.8});for(let _=0;_<16;_++){let g=_/16*Math.PI*2+.12,i=6.5+_%4*2.8,S=13.5-_%3*1.6,C=new Vt(.75,0),O=new r(C,v);O.position.set(Math.cos(g)*i,S,Math.sin(g)*i),a.add(O)}this.world.scene.add(a)}_celestialMotes(){let o=new Float32Array(720),s=new Float32Array(720),n=new Float32Array(240),t=yt(777123),a=new Me;for(let u=0;u<240;u++){let f=(t()-.5)*1500,c=(t()-.5)*1500,p=Math.max(ze(f,c),K.waterLevel)+2.5+t()*16;o[u*3]=f,o[u*3+1]=p,o[u*3+2]=c,a.setHSL(.11+t()*.1,.85,.78+t()*.22),s[u*3]=a.r,s[u*3+1]=a.g,s[u*3+2]=a.b,n[u]=(.25+t()*.45)*12}let l=new Et;l.setAttribute("position",new tt(o,3)),l.setAttribute("color",new tt(s,3)),l.setAttribute("size",new tt(n,1)),l.computeBoundingSphere(),this.moteMat=new Mt({transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,fog:!1,blending:Ht,uniforms:{uTex:{value:this.world.lighting._starSprite()},uTime:{value:0},uOpacity:{value:0}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        attribute float size;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        void main(){
          vColor = color;
          vec3 p = position;
          p.y += sin(uTime * 1.1 + position.x * 0.03 + position.z * 0.02) * 1.5;
          p.x += cos(uTime * 0.8 + position.z * 0.02) * 0.8;
          p.z += sin(uTime * 0.7 + position.x * 0.02) * 0.8;
          vAlpha = 0.45 + 0.55 * sin(uTime * 2.2 + position.x * 0.08 + position.z * 0.06);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = min(64.0, size * (80.0 / -mv.z));
          gl_Position = projectionMatrix * mv;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform sampler2D uTex;
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vAlpha;
        void main(){
          vec4 t = texture2D(uTex, gl_PointCoord);
          gl_FragColor = vec4(vColor, t.a * uOpacity * vAlpha);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,vertexColors:!0}),this.motes=new co(l,this.moteMat),this.world.scene.add(this.motes)}_kayaIsland(){let e=new qe,o=20,s=2100,n=pe.honedCarraraMarble(1.5),t=pe.celestialGold(1),a=pe.verdigrisBronze(1),l=pe.flagstone(2.4),u=pe.crystalColumn(),f=pe.starlightCrystal(),c=pe.bark(2.2),p=ze(o,s),w=new qe;w.position.set(o,p+.1,s);let b=new r(new F(20,22,1.2,48),n);b.position.y=.6,b.receiveShadow=b.castShadow=!0,w.add(b);let x=new r(new F(18,19.5,1.2,48),n);x.position.y=1.8,x.receiveShadow=x.castShadow=!0,w.add(x);for(let Se=0;Se<8;Se++){let Ne=new r(new ce(.42,.08,15),t);Ne.position.y=2.45,Ne.rotation.y=Se*Math.PI/8,w.add(Ne)}let V=new r(new F(3.6,3.6,.1,24),t);V.position.y=2.46,w.add(V);let y=new F(5.8,6.4,1.6,24),H=new r(y,t);H.position.y=3.2,H.castShadow=H.receiveShadow=!0,w.add(H);let M=8;for(let Se=0;Se<M;Se++){let Ne=Se/M*Math.PI*2+Math.PI/8,Ve=Math.cos(Ne)*14.2,Ye=Math.sin(Ne)*14.2,at=new r(new ce(2.4,.8,2.4),t);at.position.set(Ve,2.8,Ye),w.add(at);let ft=new r(new dt(1.2,.22,12,24),t);ft.rotation.x=Math.PI/2,ft.position.set(Ve,3.2,Ye),w.add(ft);let Ae=new r(new F(.72,.88,10.5,20),u);Ae.position.set(Ve,8.5,Ye),Ae.castShadow=!0,w.add(Ae);let Bt=new qe;Bt.position.set(Ve,13.8,Ye);let Xt=new r(new F(1.3,.8,1.8,16),t);Xt.position.y=.9,Bt.add(Xt);for(let to=0;to<8;to++){let qt=to/8*Math.PI*2,Ut=new r(new lt(.3,1.2,4),t);Ut.rotation.z=-Math.cos(qt)*.3,Ut.rotation.x=Math.sin(qt)*.3,Ut.position.set(Math.cos(qt)*1,.6,Math.sin(qt)*1),Bt.add(Ut)}let Zt=new r(new ce(2.8,.5,2.8),n);if(Zt.position.y=1.9,Bt.add(Zt),w.add(Bt),Se!==3){let to=(Se+1)/M*Math.PI*2+Math.PI/8,qt=(Ne+to)/2,Ut=Math.cos(qt)*14.2,Mo=Math.sin(qt)*14.2,Fo=new r(new ce(4.8,.55,1),n);Fo.position.set(Ut,5.2,Mo),Fo.rotation.y=-qt+Math.PI/2,w.add(Fo);for(let _o=-1;_o<=1;_o++){let ko=Ut+Math.cos(qt+Math.PI/2)*(_o*1.1),Jo=Mo+Math.sin(qt+Math.PI/2)*(_o*1.1),Io=new r(new F(.22,.28,1.8,8),u);Io.position.set(ko,3.8,Jo),w.add(Io)}}}let L=new r(new dt(14.2,.95,16,48),n);L.rotation.x=Math.PI/2,L.position.y=16.2,w.add(L);let T=new r(new dt(14.3,.24,8,48),t);T.rotation.x=Math.PI/2,T.position.y=16.8,w.add(T);let N=new r(new rt(14.1,32,24,0,Math.PI*2,0,Math.PI*.5),f);N.position.y=16.4,w.add(N);for(let Se=0;Se<8;Se++){let Ne=Se/8*Math.PI,Ve=new r(new dt(14.15,.22,8,32,Math.PI),t);Ve.rotation.y=Ne,Ve.position.y=16.4,w.add(Ve)}let q=new r(new no(2.2,0),t);q.position.y=30.6,w.add(q);for(let Se=0;Se<8;Se++){let Ne=Se/8*Math.PI*2,Ve=new r(new lt(.42,3.8,4),t);Ve.rotation.z=-Ne+Math.PI/2,Ve.position.set(Math.cos(Ne)*2.8,30.6+Math.sin(Ne)*.5,Math.sin(Ne)*2.8),w.add(Ve)}let $=new ce(6.4,1.1,.35),Y=new r($,t);Y.position.set(0,3.2,-14.2),w.add(Y);let k=this._buildHuskyMesh();k.scale.setScalar(1.85),k.position.set(0,4,0),k.rotation.y=Math.PI,k.castShadow=!0,w.add(k);let h=[16728193,16766287,16777215,16740419,12216520];for(let Se=0;Se<32;Se++){let Ne=Se/32*Math.PI*2,Ve=5.2+Se%3*.45,Ye=new ot({color:h[Se%h.length],roughness:.6,metalness:.05}),at=new rt(.35,8,6);at.scale(1,.4,1);let ft=new r(at,Ye);ft.position.set(Math.cos(Ne)*Ve,3.22,Math.sin(Ne)*Ve),ft.rotation.set(Se%5*.15,Ne,Se%3*.1),w.add(ft)}let v=new qe;v.position.set(0,16.5,0);let _=new Mt({uniforms:{time:{value:0}},vertexShader:`
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          vec3 pos = position * (1.0 + 0.04 * sin(time * 1.5 + position.y * 3.0));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,fragmentShader:`
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;

        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 uv0 = vUv;
          float n1 = snoise(uv0 * 4.0 + vec2(time * 0.3, time * 0.2));
          float n2 = snoise(uv0 * 8.0 - vec2(time * 0.1, time * 0.4));
          float energy = max(0.0, sin(n1 * 3.14 + n2 * 3.14));

          float runeNoise = snoise(uv0 * 15.0 + vec2(0.0, time * 0.15));
          float runes = smoothstep(0.82, 0.86, abs(runeNoise)) * smoothstep(0.0, 0.2, sin(uv0.y * 40.0 + time * 3.0));
          
          float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 1.5);

          vec3 baseColor = vec3(0.05, 0.4, 0.85);
          vec3 energyColor = vec3(0.3, 0.85, 1.0);
          vec3 runeColor = vec3(1.0, 0.95, 0.4);
          
          vec3 finalColor = baseColor + (energy * energyColor) + (runes * runeColor * 2.5) + (fresnel * vec3(0.2, 0.6, 1.0));
          
          gl_FragColor = vec4(finalColor, 0.92);
        }
      `,transparent:!0,logarithmicDepthBuffer:!0,blending:Ht,side:gt,depthWrite:!1}),g=new r(new $s(1.6,16),_);g.castShadow=!0,v.add(g),this._kayaShaders||(this._kayaShaders=[]),this._kayaShaders.push(_);let i=new rt(1.2,32,32),S=new Mt({uniforms:{time:{value:0}},vertexShader:`
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float time;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec3 pos = position;
          pos.x += sin(time * 2.5 + pos.y * 5.0) * 0.08;
          pos.z += cos(time * 2.5 + pos.x * 5.0) * 0.08;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,fragmentShader:`
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float time;
        void main() {
          float glow = abs(sin(vUv.x * 25.0 + time * 4.0) * cos(vUv.y * 25.0 - time * 3.5));
          vec3 col = mix(vec3(0.0, 0.6, 1.0), vec3(0.8, 0.3, 0.9), glow);
          float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
          gl_FragColor = vec4(col * (glow + fresnel * 1.5), 0.7);
        }
      `,transparent:!0,logarithmicDepthBuffer:!0,blending:Ht,depthWrite:!1}),C=new r(i,S);v.add(C),this._kayaShaders.push(S);let O=new r(new dt(2.3,.12,16,48),t);O.rotation.x=Math.PI/2,v.add(O);for(let Se=0;Se<8;Se++){let Ne=Se/8*Math.PI*2,Ve=new r(new lt(.18,2.2,8),t);Ve.rotation.z=-Ne+Math.PI/2,Ve.position.set(Math.cos(Ne)*2.1,Math.sin(Ne)*.1,Math.sin(Ne)*2.1),v.add(Ve)}w.add(v);let te=128,m=new Et,E=new Float32Array(te*3),R=new Float32Array(te);for(let Se=0;Se<te;Se++){let Ne=Se/te*Math.PI*2,Ve=4.8+Math.sin(Se*3.7)*1.5;E[Se*3]=Math.cos(Ne)*Ve,E[Se*3+1]=16.5+Math.sin(Ne*4)*1.2,E[Se*3+2]=Math.sin(Ne)*Ve,R[Se]=Math.random()}m.setAttribute("position",new tt(E,3)),m.setAttribute("aSize",new tt(R,1));let P=new Mt({uniforms:{time:{value:0}},vertexShader:`
        uniform float time;
        attribute float aSize;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          float angle = time * 0.6;
          float x = pos.x * cos(angle) - pos.z * sin(angle);
          float z = pos.x * sin(angle) + pos.z * cos(angle);
          pos.x = x; pos.z = z;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (15.0 * aSize + 5.0) * (10.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = 0.5 + 0.5 * sin(time * 3.0 + aSize * 10.0);
        }
      `,fragmentShader:`
        varying float vAlpha;
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          if (length(coord) > 0.5) discard;
          gl_FragColor = vec4(0.4, 0.9, 1.0, vAlpha * 0.85);
        }
      `,transparent:!0,logarithmicDepthBuffer:!0,blending:Ht,depthWrite:!1}),oe=new co(m,P);w.add(oe),this._kayaStardust=oe,this._kayaShaders.push(P);let ne=new vo(4244735,5,200);ne.position.set(0,16.5,0),w.add(ne),e.add(w);let se=-110,ae=2160,I=ze(se,ae),Z=new qe;Z.position.set(se,I,ae);let ie=ho("weatheredTravertine",{repeat:2.5,color:10261124,roughness:.9,metalness:0,normalScale:2.5,aoMapIntensity:1.8}),ve=ho("timber",{repeat:1.5,color:4006934,roughness:.8,metalness:0,normalScale:1.5}),De=ho("bronze",{repeat:1.2,color:9072197,roughness:.4,metalness:.85,physical:!0,clearcoat:.2,clearcoatRoughness:.5}),Ue=pe.gold(1),Ke=ho("granite",{repeat:1.8,color:1183758,roughness:.2,metalness:.05,physical:!0,clearcoat:.5,clearcoatRoughness:.3,normalScale:1.2}),U=new ot({color:4850965,roughness:.85,metalness:.05}),xe=new Ct({color:16733440}),Ce=new Ct({color:16759586}),Pe=new ot({color:16766720,emissive:16755236,emissiveIntensity:1.8,roughness:.2,metalness:.8}),B=[],X=[],G=[],D=[],z=[],W=[],ee=[],ue=[],ge=[],we=new ce(36,1.6,50);we.translate(0,.8,0),B.push(we);let _e=new ce(32,1.4,46);_e.translate(0,2.3,0),B.push(_e);let Ze=new ce(28,1.2,42);Ze.translate(0,3.6,0),B.push(Ze);let Oe=14;for(let Se=0;Se<Oe;Se++){let Ne=new ce(18,.35,1.4);Ne.translate(0,.18+Se*.3,27.5-Se*.75),B.push(Ne)}let st=new F(.85,1.1,12,16),vt=new ce(2.6,1,2.6);[[-10.5,-18],[10.5,-18],[-10.5,-10],[10.5,-10],[-10.5,-2],[10.5,-2],[-10.5,6],[10.5,6],[-10.5,14],[10.5,14],[-10.5,20],[10.5,20]].forEach(([Se,Ne])=>{let Ve=st.clone();Ve.translate(Se,4.2+6,Ne),B.push(Ve);let Ye=vt.clone();Ye.translate(Se,4.2+12.5,Ne),B.push(Ye);let at=new ce(2.8,.3,2.8);at.translate(Se,4.2+13,Ne),D.push(at)});let pt=new ce(1.6,12,32);pt.translate(-11.5,4.2+6,-2),B.push(pt);let Tt=new ce(1.6,12,32);Tt.translate(11.5,4.2+6,-2),B.push(Tt);let xt=new ce(24.6,12,1.6);xt.translate(0,4.2+6,-17.2),B.push(xt);let Pt=new ce(18.5,1.2,50);Pt.rotateZ(.4),Pt.translate(-7.2,4.2+12+3.8,0),X.push(Pt);let St=new ce(18.5,1.2,50);St.rotateZ(-.4),St.translate(7.2,4.2+12+3.8,0),X.push(St);let Gt=new mo;Gt.moveTo(-13.5,0),Gt.lineTo(13.5,0),Gt.lineTo(0,6),Gt.closePath();let Nt=new Eo(Gt,{depth:1.2,bevelEnabled:!1}),zt=Nt.clone();zt.translate(0,4.2+12,22.8),B.push(zt);let Dt=this._buildWingedSunDisc();Dt.position.set(0,4.2+12+2.5,24.1),Dt.scale.setScalar(1.5),Z.add(Dt);let wo=Nt.clone();wo.translate(0,4.2+12,-19.2),B.push(wo);for(let Se of[-9.5,9.5]){let Ne=new ce(2.6,1.5,2.6);Ne.translate(Se,4.2+.75,23.5),G.push(Ne);let Ve=new F(.65,.85,13,10);Ve.translate(Se,4.2+1.5+6.5,23.5),G.push(Ve);let Ye=new rt(1.3,16,12);Ye.translate(Se,4.2+14.5,23.5),ge.push(Ye)}let j=new ce(7,1.5,4.2);j.translate(0,4.2+.75,-2),z.push(j);let Ee=this._buildBronzeBull();Ee.position.set(0,4.2+1.5,-2),Ee.rotation.y=-Math.PI*.72,Ee.scale.setScalar(1.5),Z.add(Ee),new qe().position.set(0,4.2+.75,1.5);let Xe=new F(1,.5,.6,16);Xe.translate(0,.3,0),G.push(Xe.clone().translate(0,4.2+.75,1.5));let et=new r(new ce(4,5,4),new Ct({visible:!1}));et.position.set(0,4.2+2,1.5),et.userData={action:"donation_temple_baal",label:"Place an Offering at the Great Altar"},this.world.pickables.push(et),Z.add(et);for(let Se of[-7.5,7.5]){let Ne=new F(.25,.45,2.6,8);Ne.translate(Se,4.2+1.3,-2),G.push(Ne);let Ve=new rt(1.5,16,12,0,Math.PI*2,Math.PI/2,Math.PI/2);Ve.rotateX(Math.PI),Ve.translate(Se,4.2+2.6,-2),G.push(Ve);let Ye=new F(1.2,.9,.5,12);Ye.translate(Se,4.2+2.5,-2),ee.push(Ye);let at=new lt(.9,2.2,10);at.translate(Se,4.2+3.6,-2),ue.push(at)}let nt=new ce(10,2,6);nt.translate(0,4.2+1,-13.5),z.push(nt);let Q=this._buildBaalIdol();Q.position.set(0,4.2+2,-13.5),Q.scale.setScalar(1.8),Z.add(Q);for(let Se of[-6.2,6.2]){let Ne=new ct(3.2,10);Ne.translate(Se,4.2+7,-16),W.push(Ne)}let Ge=[-11,-3,5,13];for(let Se of Ge)for(let Ne of[-10.6,10.6]){let Ve=new F(.15,.1,1.5,8);Ve.rotateZ((Ne<0?1:-1)*.35),Ve.translate(Ne,4.2+5.8,Se),G.push(Ve);let Ye=new lt(.25,.7,6);Ye.translate(Ne+(Ne<0?.3:-.3),4.2+6.6,Se),ue.push(Ye)}let Ie=(Se,Ne,Ve=!0)=>{if(Se.length===0)return;let Ye=je(Se,!1);if(Ye){let at=new r(Ye,Ne);Ve&&(at.castShadow=!0,at.receiveShadow=!0),Z.add(at)}};Ie(B,ie),Ie(X,ve),Ie(G,De),Ie(D,Ue),Ie(z,Ke),Ie(W,U,!1),Ie(ee,xe,!1),Ie(ue,Ce,!1),Ie(ge,Pe,!1),e.add(Z);let We=[new ht(o+85,ze(o+85,s-130)+.15,s-130),new ht(o+45,ze(o+45,s-65)+.15,s-65),new ht(o,p+.2,s),new ht(o-55,ze(o-55,s+40)+.15,s+40),new ht(se,I+.2,ae),new ht(se-35,ze(se-35,ae+65)+.15,ae+65)],$e=new It(We),J=Yt(new Jt($e,80,2.8,8,!1),.08,.22,55);J.scale(1,.15,1),Ko(J,p);let re=new r(J,l);re.receiveShadow=!0,e.add(re);let ke=new ot({color:16774358,emissive:16755236,emissiveIntensity:3.6,roughness:.1});[{x:o+85,z:s-130},{x:o+45,z:s-65},{x:o-35,z:s-70},{x:o-80,z:s-20},{x:se+20,z:ae-20},{x:se-25,z:ae+35},{x:o+105,z:s+20},{x:o+70,z:s+95}].forEach(Se=>{let Ne=ze(Se.x,Se.z),Ve=new r(new F(.35,.45,4.2,8),pe.bronze(1));Ve.position.set(Se.x,Ne+2.1,Se.z),Ve.castShadow=!0,e.add(Ve);let Ye=new r(new Vt(.85,0),ke);Ye.position.set(Se.x,Ne+4.6,Se.z),e.add(Ye)});let Te=new Lt,Re=[],he=[],Be=[],He=[],Je=[],it=[],wt=yt(882211);for(let Se=0;Se<380;Se++){let Ne=wt()*Math.PI*2,Ve=16+Math.pow(wt(),.7)*280,Ye=o+Math.cos(Ne)*Ve,at=s+Math.sin(Ne)*Ve,ft=ze(Ye,at);if(ft<K.waterLevel+.6||ft>p+12||Math.hypot(Ye-o,at-s)<22||Math.hypot(Ye-se,at-ae)<24)continue;let Ae=ft<4.5||Ve>180,Bt=.85+wt()*.6;if(Te.position.set(Ye,ft,at),Te.rotation.y=wt()*Math.PI*2,Ae){let Zt=.22+wt()*.32,to=Math.atan2(at-s,Ye-o);Te.rotation.x=Math.sin(to)*Zt,Te.rotation.z=-Math.cos(to)*Zt}else Te.rotation.x=(wt()-.5)*.14,Te.rotation.z=(wt()-.5)*.14;Te.scale.setScalar(Bt),Te.updateMatrix();let Xt=wt();Xt<.45||Ae?(Re.push(Te.matrix.clone()),he.push(Te.matrix.clone())):Xt<.72?(Be.push(Te.matrix.clone()),He.push(Te.matrix.clone())):Xt<.88?Je.push(Te.matrix.clone()):it.push(Te.matrix.clone())}let bt=(Se,Ne,Ve=.45)=>{let Ye=new ct(Se,Ne,2,2),at=Ye.attributes.position;for(let ft=0;ft<at.count;ft++){let Ae=at.getX(ft),Bt=at.getY(ft),Xt=Ae/(Se*.5),Zt=Bt/(Ne*.5);at.setZ(ft,(1-Xt*Xt)*Ve*(1-Zt*.35)+(1-Zt*Zt)*Ve*.25)}return Ye.computeVertexNormals(),Ye},Wt=(()=>{let Se=[],Ne=new F(.75,1.35,2.2,10);Ne.translate(0,1.1,0),Se.push(Ne);let Ve=8;for(let Ye=0;Ye<Ve;Ye++){let at=Ye/Ve,ft=.75*(1-at*.38),Ae=.75*(1-(Ye+1)/Ve*.38),Bt=new F(Ae,ft,1.45,8),Xt=Math.sin(at*Math.PI*.75)*.85,Zt=Math.cos(at*Math.PI*.65)*.55;Bt.translate(Xt,2.2+Ye*1.4+.72,Zt),Se.push(Bt)}return je(Se,!1)||Ne})(),fo=(()=>{let Se=[];for(let Ne=0;Ne<10;Ne++){let Ve=Ne/10*Math.PI*2+.1,Ye=2.2,at=-.5,ft=bt(2.6,4.8,.42);ft.rotateX(at),ft.rotateY(Ve),ft.translate(Math.cos(Ve)*Ye,13.5+2.6,Math.sin(Ve)*Ye),Se.push(ft)}for(let Ne=0;Ne<16;Ne++){let Ve=Ne/16*Math.PI*2;for(let Ye=0;Ye<2;Ye++){let at=Ye/2,ft=1.8+at*5.2,Ae=.22+at*1.18,Bt=bt(3.2*(1-at*.28),4.6,.5);Bt.rotateX(Ae),Bt.rotateY(Ve),Bt.translate(Math.cos(Ve)*ft,13.5+1.6-Math.sin(Ae)*2.8,Math.sin(Ve)*ft),Se.push(Bt)}}for(let Ne=0;Ne<12;Ne++){let Ve=Ne/12*Math.PI*2+.25;for(let Ye=0;Ye<2;Ye++){let at=Ye/2,ft=2.4+at*4.6,Ae=.72+at*.85,Bt=bt(2.8*(1-at*.25),4.4,.52);Bt.rotateX(Ae),Bt.rotateY(Ve),Bt.translate(Math.cos(Ve)*ft,13.5-.6-Math.sin(Ae)*2.4,Math.sin(Ve)*ft),Se.push(Bt)}}for(let Ne=0;Ne<8;Ne++){let Ve=Ne/8*Math.PI*2+.4,Ye=2.8,at=1.35,ft=bt(2.4,3.8,.45);ft.rotateX(at),ft.rotateY(Ve),ft.translate(Math.cos(Ve)*Ye,13.5-2.4,Math.sin(Ve)*Ye),Se.push(ft)}return je(Se,!1)||Se[0]})(),Qt=new F(.35,.65,7.5,8);Qt.translate(0,3.75,0);let fs=(()=>{let Se=[];for(let Ne=0;Ne<6;Ne++){let Ve=Ne/6*Math.PI*2,Ye=new ct(2.8,6.2);Ye.rotateX(.55),Ye.rotateY(Ve),Ye.translate(Math.cos(Ve)*2.2,7.2,Math.sin(Ve)*2.2),Se.push(Ye)}return je(Se,!1)||Se[0]})(),go=(()=>{let Se=[];for(let Ne=0;Ne<5;Ne++){let Ve=Ne/5*Math.PI*2,Ye=new $t(2.2,8);Ye.rotateX(-Math.PI*.35),Ye.rotateY(Ve),Ye.translate(Math.cos(Ve)*1.8,1.2,Math.sin(Ve)*1.8),Se.push(Ye)}return je(Se,!1)||Se[0]})(),zo=(()=>{let Se=[];for(let Ne=0;Ne<6;Ne++){let Ve=Ne/6*Math.PI*2,Ye=new ct(1.4,3.8);Ye.rotateX(.45),Ye.rotateY(Ve),Ye.translate(Math.cos(Ve)*1.2,.6,Math.sin(Ve)*1.2),Se.push(Ye)}return je(Se,!1)||Se[0]})(),po=pe.palmFrond(16777215),oo=pe.leafCard(5025616),eo=pe.leafCard(3046706),lo=new ot({color:1096065,emissive:366185,emissiveIntensity:.65,roughness:.4,alphaTest:.5,side:gt});this.world._windMaterials&&this.world._windMaterials.push(po,oo,eo,lo);let io=(Se,Ne,Ve,Ye=!0)=>{if(!Ve.length)return;Se.computeBoundingSphere&&Se.computeBoundingSphere();let at=new ut(Se,Ne,Ve.length);Ve.forEach((ft,Ae)=>at.setMatrixAt(Ae,ft)),at.instanceMatrix.needsUpdate=!0,typeof at.computeBoundingSphere=="function"&&at.computeBoundingSphere(),typeof at.computeBoundingBox=="function"&&at.computeBoundingBox(),at.castShadow=Ye,at.receiveShadow=!0,at.frustumCulled=!1,e.add(at)};io(Wt,c,Re,!0),io(fo,po,he,!0),io(Qt,pe.bark(1.2),Be,!0),io(fs,oo,He,!0),io(go,eo,Je,!0),io(zo,lo,it,!1),this.world.scene.add(e)}_desertPhantasmTree(){let e=new qe,o=-460,s=340,n=ze(o,s);e.position.set(o,n,s);let t=pe.weatheredConcrete(2.5),a=pe.flagstone(3),l=pe.bark(1.8),u=pe.celestialGold(1),f=new ot({color:12216520,emissive:10233776,emissiveIntensity:.68,roughness:.18,metalness:.1,transmission:.82,ior:1.54,thickness:1.2,transparent:!0,opacity:.92,clearcoat:1,clearcoatRoughness:.1}),c=new ot({color:8445674,emissive:58879,emissiveIntensity:.72,roughness:.14,metalness:.05,transmission:.85,ior:1.52,thickness:1,transparent:!0,opacity:.88,clearcoat:1,clearcoatRoughness:.08}),p=new ot({color:16769154,emissive:16766287,emissiveIntensity:.55,roughness:.22,metalness:.15,transmission:.78,ior:1.55,thickness:1.1,transparent:!0,opacity:.9,clearcoat:.9,clearcoatRoughness:.12}),w=new ot({color:4010568,roughness:.52,metalness:.24,clearcoat:.35,clearcoatRoughness:.3}),b=new F(34,40,10,32),x=new r(b,t);x.position.y=5,x.receiveShadow=x.castShadow=!0,e.add(x);let V=new F(26,32,8,32),y=new r(V,t);y.position.y=14,y.receiveShadow=y.castShadow=!0,e.add(y);let H=new F(18,24,7,32),M=new r(H,a);M.position.y=21.5,M.receiveShadow=M.castShadow=!0,e.add(M);let L=new qe;L.position.set(22,18,8);let T=new r(new F(8.5,8.5,2.6,24,1,!0),t);T.position.y=1.3,T.castShadow=T.receiveShadow=!0,L.add(T);let N=new r(new $t(8.4,24),a);N.rotation.x=-Math.PI/2,N.position.y=.05,N.receiveShadow=!0,L.add(N);for(let Z=0;Z<8;Z++){let ie=Z/8*Math.PI*2,ve=new r(new F(.22,.22,17,8),l);ve.rotation.z=Math.PI/2,ve.rotation.y=ie,ve.position.y=2.6,ve.castShadow=!0,L.add(ve)}let q=new r(new dt(1.4,.35,12,24),t);q.rotation.x=Math.PI/2,q.position.y=.3,L.add(q);let $=new r(new $t(1.2,16),new Ct({color:16737792}));$.rotation.x=-Math.PI/2,$.position.y=.32,L.add($);let Y=new vo(16742178,1.8,35,1.2);Y.position.set(0,1.2,0),L.add(Y),e.add(L);let k=new qe;k.position.set(0,25,0);let h=24,v=20,_=22,g=new F(2.2,5.8,_,h,v),i=g.attributes.position;for(let Z=0;Z<i.count;Z++){let ie=i.getX(Z),ve=i.getY(Z),De=i.getZ(Z),Ue=(ve+_*.5)/_,Ke=Math.atan2(De,ie),U=Math.hypot(ie,De),xe=Math.cos(Ke*7+Ue*3.2)*Math.pow(1-Ue,1.6)*3.2,Ce=Math.sin(Ue*Math.PI*1.5)*1.8,Pe=U+xe;i.setX(Z,Math.cos(Ke+Ce*.15)*Pe+Math.sin(Ue*4)*.8),i.setY(Z,ve+_*.5),i.setZ(Z,Math.sin(Ke+Ce*.15)*Pe)}g.computeVertexNormals();let S=new r(g,w);S.castShadow=S.receiveShadow=!0,k.add(S);for(let Z=0;Z<8;Z++){let ie=Z/8*Math.PI*2+.15,ve=new F(.4,1.5,9,8);ve.rotateZ(.72),ve.rotateY(ie),ve.translate(Math.cos(ie)*6.2,-1.8,Math.sin(ie)*6.2);let De=new r(ve,w);De.castShadow=De.receiveShadow=!0,k.add(De)}let C=[],O=[],te=[];for(let Z=0;Z<8;Z++){let ie=Z/8*Math.PI*2+Z%2*.3,ve=[],De=new F(.85,1.4,7.5,8);De.rotateZ(.55),De.rotateY(ie),De.translate(Math.cos(ie)*4.5,_+2,Math.sin(ie)*4.5),ve.push(De);let Ue=new F(.45,.85,7,8);Ue.rotateZ(.82),Ue.rotateY(ie+.22),Ue.translate(Math.cos(ie+.22)*9.5,_+4.8,Math.sin(ie+.22)*9.5),ve.push(Ue);let Ke=new F(.2,.45,6,6);Ke.rotateZ(1.05),Ke.rotateY(ie+.45),Ke.translate(Math.cos(ie+.45)*14,_+6.2,Math.sin(ie+.45)*14),ve.push(Ke);let U=je(ve,!1)||De,xe=new r(U,w);xe.castShadow=!0,k.add(xe);let Ce=new A(Math.cos(ie+.3)*12.5,_+5.5,Math.sin(ie+.3)*12.5);for(let Pe=0;Pe<6;Pe++){let B=Ce.x+Math.sin(Pe*2.1)*3.5,X=Ce.y+Math.cos(Pe*1.7)*2.2,G=Ce.z+Math.sin(Pe*3.4)*3.5,D=1.4+Pe%3*.7,z=new Vt(D,1);z.translate(B,X,G),Pe%3===0?O.push(z):Pe%3===1?te.push(z):C.push(z)}}for(let Z=0;Z<7;Z++){let ie=Math.sin(Z*1.5)*3,ve=_+5+Math.cos(Z*1.2)*2.5,De=Math.cos(Z*1.5)*3,Ue=new $s(2.4,1);Ue.translate(ie,ve,De),C.push(Ue)}if(C.length>0){let Z=je(C,!1);if(Z){let ie=new r(Z,f);ie.castShadow=!1,k.add(ie)}}if(O.length>0){let Z=je(O,!1);if(Z){let ie=new r(Z,c);ie.castShadow=!1,k.add(ie)}}if(te.length>0){let Z=je(te,!1);if(Z){let ie=new r(Z,p);ie.castShadow=!1,k.add(ie)}}this._phantasmTreeLight=new vo(12216520,3.4,110,1.2),this._phantasmTreeLight.position.set(0,_+4,0),k.add(this._phantasmTreeLight);let m=new vo(58879,2,75,1.4);m.position.set(0,_+8,0),k.add(m),e.add(k);let E=85,R=new Float32Array(E*3),P=new Float32Array(E*3),oe=new Float32Array(E),ne=yt(99128),se=new Me;for(let Z=0;Z<E;Z++){let ie=4+ne()*22,ve=ne()*Math.PI*2;R[Z*3]=Math.cos(ve)*ie,R[Z*3+1]=22+ne()*26,R[Z*3+2]=Math.sin(ve)*ie;let De=ne();De<.5?se.setHex(12216520):De<.8?se.setHex(8445674):se.setHex(16766287),P[Z*3]=se.r,P[Z*3+1]=se.g,P[Z*3+2]=se.b,oe[Z]=4.5+ne()*6.5}let ae=new Et;ae.setAttribute("position",new tt(R,3)),ae.setAttribute("color",new tt(P,3)),ae.setAttribute("size",new tt(oe,1)),this.phantasmMoteMat=new Mt({transparent:!0,depthWrite:!1,blending:Ht,uniforms:{uTime:{value:0}},vertexShader:`
        attribute float size;
        varying vec3 vColor;
        uniform float uTime;
        void main() {
          vColor = color;
          vec3 p = position;
          float angle = uTime * 0.45 + p.y * 0.04;
          float r = length(p.xz);
          p.x = cos(angle) * r;
          p.z = sin(angle) * r;
          p.y += sin(uTime * 1.4 + position.x * 0.1) * 1.2;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = min(48.0, size * (120.0 / -mv.z));
          gl_Position = projectionMatrix * mv;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.05, d) * 0.85;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,vertexColors:!0});let I=new co(ae,this.phantasmMoteMat);e.add(I),this.world.scene.add(e)}_highlandSanctuary(){let e=new qe,o=pe.flagstone(2.5),s=pe.marble(1.5),n=pe.bronze(1),t=182,a=new ce(110,1.6,42),l=new r(a,o);l.position.set(0,t+.8,-475),l.receiveShadow=l.castShadow=!0,e.add(l);for(let x=-48;x<=48;x+=4){if(Math.abs(x)<16)continue;let V=new r(new F(.35,.42,1.4,8),s);V.position.set(x,t+1.6+.7,-455),V.castShadow=!0,e.add(V)}let u=new ce(32,.35,.45),f=new r(u,s);f.position.set(-32,t+2.9,-455),e.add(f);let c=new r(u,s);c.position.set(32,t+2.9,-455),e.add(c);let p=new ce(22,1.2,110),w=new r(p,o);w.position.set(0,t+.6,-545),w.receiveShadow=!0,e.add(w);let b=new ot({color:16774358,emissive:16755236,emissiveIntensity:3.5,roughness:.1});for(let x=-475;x>=-585;x-=28)[-12,12].forEach(V=>{let y=new r(new F(.28,.38,4.5,8),n);y.position.set(V,t+1.2+2.25,x),y.castShadow=!0,e.add(y);let H=new r(new Vt(.75,0),b);H.position.set(V,t+1.2+4.8,x),e.add(H)});this.world.scene.add(e)}_buildUniversalStructure(e,o,s,n){let t=typeof ze=="function"?ze(e,o):0,a=new qe;a.position.set(e,t,o),this.world.scene.add(a);let l=ho("hohenzollernSandstone",{repeat:6,color:14202225,roughness:.85,metalness:0,normalScale:2,aoMapIntensity:1.2}),u=ho("darkSlate",{repeat:4,color:2895411,roughness:.7,metalness:.1,normalScale:1}),f=ho("asamRedMarble",{repeat:3,color:5904401,roughness:.1,metalness:0,clearcoat:.8,clearcoatRoughness:.15}),c=pe.celestialGold(1),p=pe.byzantineMosaic(8),w=pe.clearGlass(1),b=[],x=[],V=new ce(100,15,120);V.translate(0,7.5,0),b.push(V);let y=new ce(85,12,100);y.translate(0,21,0),b.push(y);let H=new ce(50,45,70);H.translate(0,49.5,0),b.push(H);let M=new lt(38,25,4);if(M.rotateY(Math.PI/4),M.translate(0,84.5,0),x.push(M),[{x:-25,z:35,r:8,h:65,rh:30},{x:25,z:35,r:8,h:65,rh:30},{x:-25,z:-35,r:8,h:65,rh:30},{x:25,z:-35,r:8,h:65,rh:30},{x:-42,z:50,r:6,h:45,rh:20},{x:42,z:50,r:6,h:45,rh:20},{x:-42,z:-50,r:6,h:45,rh:20},{x:42,z:-50,r:6,h:45,rh:20},{x:0,z:50,r:10,h:55,rh:35},{x:0,z:-10,r:12,h:90,rh:45}].forEach(O=>{let te=new F(O.r,O.r+1,O.h,12);te.translate(O.x,27+O.h/2,O.z),b.push(te);let m=new lt(O.r+1.5,O.rh,12);m.translate(O.x,27+O.h+O.rh/2,O.z),x.push(m)}),je){if(b.length>0){let O=new r(je(b),l);O.castShadow=!0,O.receiveShadow=!0,a.add(O)}if(x.length>0){let O=new r(je(x),u);O.castShadow=!0,O.receiveShadow=!0,a.add(O)}}else b.forEach(O=>{let te=new r(O,l);te.castShadow=!0,te.receiveShadow=!0,a.add(te)}),x.forEach(O=>{let te=new r(O,u);te.castShadow=!0,te.receiveShadow=!0,a.add(te)});let T=[],N=[];for(let O=-20;O<=20;O+=10)for(let te of[-15,15]){for(let R=30;R<65;R+=2){let P=new F(1.5,1.5,2,8);P.translate(Math.sin(R*.5)*.5,0,Math.cos(R*.5)*.5),P.translate(te,R,O),T.push(P)}let m=new ce(4,1.5,4);m.translate(te,66,O),N.push(m);let E=new F(2.5,2.5,2,8);E.translate(te,67.5,O),N.push(E)}new ce(32,2,50).translate(0,45,0),new ce(26,4,44).translate(0,45,0);let Y=new ce(3,2,50);Y.translate(-14.5,45,0);let k=new ce(3,2,50);k.translate(14.5,45,0);let h=new ce(26,2,3);h.translate(0,45,23.5);let v=new ce(26,2,3);if(v.translate(0,45,-23.5),N.push(Y,k,h,v),je){if(T.length>0){let O=new r(je(T),f);O.castShadow=!0,O.receiveShadow=!0,a.add(O)}if(N.length>0){let O=new r(je(N),c);O.castShadow=!0,O.receiveShadow=!0,a.add(O)}}else T.forEach(O=>{let te=new r(O,f);te.castShadow=!0,te.receiveShadow=!0,a.add(te)}),N.forEach(O=>{let te=new r(O,c);te.castShadow=!0,te.receiveShadow=!0,a.add(te)});let _=new F(15,15,50,32,1,!0,0,Math.PI);_.rotateZ(Math.PI/2),_.rotateY(Math.PI/2),_.translate(0,68,0);let g=new r(_,p);g.castShadow=!0,g.receiveShadow=!0,a.add(g);let i=new na(2101264,.8);a.add(i);let S=new sa(16773341,25);S.position.set(0,90,0),S.target.position.set(0,30,0),S.angle=Math.PI/5,S.penumbra=.8,S.castShadow=!0,a.add(S),a.add(S.target);let C=new vo(16755285,10,50);C.position.set(0,40,-15),a.add(C)}_universalCathedral(){this._buildUniversalStructure(K.cathedral.x,K.cathedral.z,"CATHEDRAL","Cathedral")}_buddhistPagoda(){this._buildUniversalStructure(K.buddhistTemple.x,K.buddhistTemple.z,"PAGODA","Pagoda")}_moorishMosque(){let e=new qe,o=K.mosque.x,s=K.mosque.z,n=ze(o,s);e.position.set(o,n,s);let t=ho("honedCarraraMarble",{repeat:2,color:16776440,roughness:.12,metalness:.05,physical:!0,clearcoat:.4,clearcoatRoughness:.2}),a=pe.weatheredConcrete(3),l=pe.moorishZellij(3.8),u=ho("stuccoMuqarnas",{repeat:2.5,color:16644852,roughness:.9,metalness:0,normalScale:2.2,aoMapIntensity:1.8}),f=ho("moorishZellij",{repeat:6,color:1217186,roughness:.04,metalness:0,physical:!0,clearcoat:1,clearcoatRoughness:.01,ior:1.65,reflectivity:.95,clearcoatNormalScale:.5}),c=pe.gold(1),p=ho("timber",{repeat:3,color:3021328,roughness:.7,metalness:0,physical:!0,clearcoat:.1,clearcoatRoughness:.5,normalScale:1.4}),w=pe.brushedMetal(2),b=new ce(40,4,58),x=new r(b,a);x.position.set(0,.2,7),x.receiveShadow=x.castShadow=!0,e.add(x);let V=new r(new ct(38,56),t);V.rotation.x=-Math.PI/2,V.position.set(0,2.21,7),V.receiveShadow=!0,e.add(V);let y=new ct(36,1.4);y.rotateX(-Math.PI/2),[0,18,34].forEach(J=>{let re=new r(y,l);re.position.set(0,2.24,J),e.add(re)});let H=new qe;H.position.set(0,2.2,17);let M=28,L=10.5,T=.75,N=new ce(L+1.2,T+.4,M+1.2),q=new r(N,t);q.position.y=-T*.5+.1,H.add(q);let $=new ct(L,M);$.rotateX(-Math.PI/2);let Y=new r($,this.world._waterPoolMat||new ot({color:1331810,roughness:.05,metalness:.4}));Y.position.y=.08,H.add(Y),this.world._reflectiveMeshes&&this.world._reflectiveMeshes.push(Y);let k=new ce(.8,.28,M+1.6);[-L/2-.4,L/2+.4].forEach(J=>{let re=new r(k,t);re.position.set(J,.14,0),re.castShadow=!0,H.add(re)});let h=new ce(L+1.6,.28,.8);[-M/2-.4,M/2+.4].forEach(J=>{let re=new r(h,t);re.position.set(0,.14,J),re.castShadow=!0,H.add(re)}),[-M/2+1.8,M/2-1.8].forEach(J=>{let re=new qe;re.position.set(0,0,J);let ke=new r(new F(1.6,1.9,.45,24),t);ke.position.y=.22,re.add(ke);let Le=new r(new F(1.4,.8,.5,24),t);Le.position.y=.65,Le.castShadow=!0,re.add(Le);let Te=new r(new rt(1.1,16,10,0,Math.PI*2,0,Math.PI*.45),this.world._waterPoolMat||new ot({color:2263198,roughness:.04,metalness:.35,transparent:!0,logarithmicDepthBuffer:!0,opacity:.88}));Te.position.y=.68,re.add(Te);let Re=new r(new F(.15,.22,.6,16),w);Re.position.y=1.05,re.add(Re);let he=new r(new ce(.6,.18,3.2),t);he.position.set(0,.1,J>0?-1.8:1.8),re.add(he),H.add(re)});let v=new $t(.55,12,0,Math.PI*1.85);v.rotateX(-Math.PI/2);let _=new ot({color:2974512,roughness:.75,side:gt});[{x:-2.5,z:-6},{x:3,z:-4.5},{x:-3.2,z:2},{x:2.8,z:5.5},{x:-2,z:8},{x:1.5,z:-9.5}].forEach((J,re)=>{let ke=new r(v,_);ke.position.set(J.x,.09,J.z),ke.rotation.y=re*1.1,H.add(ke);let Le=new ot({color:re%2===0?16777215:16299224,emissive:16769776,emissiveIntensity:.6,roughness:.3}),Te=new r(new Vt(.24,0),Le);Te.position.set(J.x+.1,.18,J.z+.1),H.add(Te)});let i=pe.bark(1.5),S=pe.cypressFoliage();this.world._windMaterials&&this.world._windMaterials.push(S);let C=(J,re,ke=.35)=>{let Le=new ct(J,re,2,2),Te=Le.attributes.position;for(let Re=0;Re<Te.count;Re++){let he=Te.getX(Re),Be=Te.getY(Re),He=he/(J*.5),Je=Be/(re*.5);Te.setZ(Re,(1-He*He)*ke*(1-Je*.25))}return Le.computeVertexNormals(),Le},O=(()=>{let J=[],re=new F(.55,1.1,1.8,8);re.translate(0,.9,0),J.push(re);let ke=new F(.28,.55,5.5,8);return ke.translate(0,4.25,0),J.push(ke),je(J,!1)||re})(),te=(()=>{let J=[];for(let Te=0;Te<56;Te++){let Re=Te/55,he=1.4+Re*16.5,Be=Te*2.39996,Je=.65*Math.sin(Math.pow(Re,.45)*Math.PI)+.18,it=1.45*(1-Re*.3),wt=2.4*(1-Re*.3),bt=C(it,wt,.28);bt.rotateX(.18+(1-Re)*.2),bt.rotateY(Be),bt.translate(Math.cos(Be)*Je,he,Math.sin(Be)*Je),J.push(bt)}let Le=je(J,!1)||J[0];if(Le&&Le.attributes.position&&Le.attributes.normal){let Te=Le.attributes.position,Re=Le.attributes.normal;for(let he=0;he<Te.count;he++){let Be=Te.getX(he),He=Te.getZ(he),Je=Math.hypot(Be,He)||1,it=Be/Je*.85+Re.getX(he)*.15,wt=.15+Re.getY(he)*.15,bt=He/Je*.85+Re.getZ(he)*.15,Wt=Math.hypot(it,wt,bt)||1;Re.setXYZ(he,it/Wt,wt/Wt,bt/Wt)}Re.needsUpdate=!0}return Le})();[-11.5,11.5].forEach(J=>{let re=new r(new ce(4.2,.35,32),t);re.position.set(J,.18,0),H.add(re);let ke=new r(new ct(3.6,31.4),new ot({color:4010534,roughness:.95}));ke.rotation.x=-Math.PI/2,ke.position.set(J,.36,0),H.add(ke);let Le=new r(new ce(3.4,.65,31),new ot({color:2248228,roughness:.85}));Le.position.set(J,.68,0),Le.castShadow=!0,H.add(Le);for(let Te=-12;Te<=12;Te+=8){let Re=new qe;Re.position.set(J,.36,Te);let he=new r(O,i);he.castShadow=!0,Re.add(he);let Be=new r(te,S);Be.castShadow=!1,Be.receiveShadow=!0,Re.add(Be),H.add(Re)}}),e.add(H);let m=new qe;m.position.set(0,2.2,-10);let E=new r(new ce(34,.6,20),l);E.position.y=.3,E.receiveShadow=!0,m.add(E);let R=new r(new ce(34,11,1.8),t);R.position.set(0,5.8,-9.2),R.castShadow=R.receiveShadow=!0,m.add(R);let P=new r(new ce(1.8,11,20),t);P.position.set(-17,5.8,0),P.castShadow=P.receiveShadow=!0,m.add(P);let oe=new r(new ce(1.8,11,11),t);oe.position.set(17,5.8,-4.5),oe.castShadow=oe.receiveShadow=!0,m.add(oe);let ne=new r(new ce(1.8,11,3),t);ne.position.set(17,5.8,8.5),ne.castShadow=ne.receiveShadow=!0,m.add(ne);let se=new r(new ce(1.8,3.5,6),t);se.position.set(17,9.55,4),se.castShadow=!0,m.add(se);let ae=new ce(33.8,2.6,.1),I=new r(ae,l);I.position.set(0,1.6,-8.2),m.add(I);let Z=new qe;Z.position.set(0,0,-8.1);let ie=new r(new ce(5.2,8.2,.4),u);ie.position.y=4.1,Z.add(ie);let ve=new r(new F(1.8,1.8,6.2,24,1,!1,0,Math.PI),l);ve.rotation.y=Math.PI/2,ve.position.y=3.6,Z.add(ve);let De=new r(new rt(1.8,24,12,0,Math.PI,0,Math.PI/2),c);De.position.y=6.7,Z.add(De);let Ue=new vo(16770208,3.6,25);Ue.position.set(0,4.5,.8),Z.add(Ue);let Ke=new qe;Ke.position.set(3.2,0,-7);let U=new r(new ce(1.5,1.2,1),p);U.position.y=.6,U.castShadow=!0,Ke.add(U);let xe=new r(new ce(1.6,.12,1.1),w);xe.position.y=1.25,Ke.add(xe);let Ce=new r(new ce(4,4,4),new Ct({visible:!1}));Ce.position.y=1,Ce.userData={action:"donation_mosque",label:"Offer Sadaqah (Charity)"},this.world.pickables.push(Ce),Ke.add(Ce),m.add(Ke),m.add(Z);let Pe=(()=>{let J=[];for(let Re=0;Re<4;Re++){let he=Re/4*1.2,Be=1.2/4,He=Re+2,Je=1.4/He,it=(Re+1)/4*.8;for(let wt=0;wt<He;wt++){let bt=-.7+(wt+.5)*Je,Wt=new ce(Je*.94,Be*.94,it);Wt.translate(bt,he+Be*.5,it*.5),J.push(Wt)}}return je(J,!1)||J[0]})(),B=(()=>{let J=[],Le=new ce(3.6,2.6,.15);J.push(Le);let Te=1.4,Re=.85;for(let he=-3;he<=3;he++){let Be=new ce(Te,.08,.12);Be.rotateZ(Re),Be.translate(he*.55,0,.04),J.push(Be);let He=new ce(Te,.08,.12);He.rotateZ(-Re),He.translate(he*.55,0,.04),J.push(He)}return je(J,!1)||J[0]})(),X=new F(.3,.36,6.2,16),G=new ce(.95,.55,.95),D=new ce(.95,.35,.95),z=(()=>{let J=new mo,re=1.65,ke=2.15,Le=-.26,Te=Math.PI+.26,Re=24,he=[];for(let Be=0;Be<=Re;Be++){let He=Le+Be/Re*(Te-Le);he.push(new kt(Math.cos(He)*re,Math.sin(He)*re))}for(let Be=Re;Be>=0;Be--){let He=Le+Be/Re*(Te-Le);he.push(new kt(Math.cos(He)*ke,Math.sin(He)*ke))}return J.setFromPoints(he),new Eo(J,{depth:.8,bevelEnabled:!0,bevelThickness:.04,bevelSize:.04,bevelSegments:2})})(),W=(()=>{let J=new mo,re=2.4,ke=7,Le=re*Math.PI/(ke*2.1),Te=-.15,Re=Math.PI+.3,he=[];for(let Be=0;Be<ke;Be++){let He=Te+(Be+.5)/ke*Re,Je=Math.cos(He)*re,it=Math.sin(He)*re;for(let wt=0;wt<=6;wt++){let bt=He-Math.PI/2+wt/6*Math.PI;he.push(new kt(Je+Math.cos(bt)*Le,it+Math.sin(bt)*Le))}}return he.push(new kt(re*1.35,-.4)),he.push(new kt(re*1.35,re*1.45)),he.push(new kt(-re*1.35,re*1.45)),he.push(new kt(-re*1.35,-.4)),J.setFromPoints(he),new Eo(J,{depth:.85,bevelEnabled:!0,bevelThickness:.05,bevelSize:.05,bevelSegments:2})})(),ee=[-14,-10,-6,-2.5,2.5,6,10,14];ee.forEach((J,re)=>{let ke=new r(D,t);ke.position.set(J,.48,8.8),m.add(ke);let Le=new r(X,t);Le.position.set(J,3.4,8.8),Le.castShadow=!0,m.add(Le);let Te=new r(G,u);Te.position.set(J,6.7,8.8),m.add(Te);let Re=new r(Pe,u);if(Re.position.set(J,6.9,8.4),m.add(Re),re<ee.length-1){let he=ee[re+1],Be=(J+he)/2;if(Math.abs(Be)<1){let He=new r(W,u);He.position.set(0,6.6,8.4),m.add(He)}else{let He=new r(z,u);He.position.set(Be,6.7,8.4),m.add(He)}}});for(let J=-4;J<=6;J+=4)[-14,14].forEach(re=>{let ke=new r(D,t);ke.position.set(re,.48,J),m.add(ke);let Le=new r(X,t);Le.position.set(re,3.4,J),Le.castShadow=!0,m.add(Le);let Te=new r(G,u);Te.position.set(re,6.7,J),m.add(Te);let Re=new r(Pe,u);if(Re.position.set(re,6.9,J-.4),m.add(Re),re===14&&J>=2){let he=new r(z,u);he.position.set(re,6.7,J+2),he.rotation.y=Math.PI/2,m.add(he)}else{let he=new r(B,u);he.position.set(re>0?re+.1:re-.1,4.2,J+2),he.rotation.y=Math.PI/2,m.add(he)}});let ue=new r(new ce(34,2.6,18),l);ue.position.set(0,9.4,0),ue.castShadow=!0,m.add(ue);for(let J=-7;J<=7;J+=2.8){let re=new r(new ce(33.6,.45,.35),p);re.position.set(0,8.2,J),m.add(re)}let ge=new F(7.2,7.6,2.8,8),we=new r(ge,u);we.position.set(0,11.8,0),we.castShadow=!0,m.add(we);for(let J=0;J<8;J++){let re=J/8*Math.PI*2,ke=Math.cos(re)*7.4,Le=Math.sin(re)*7.4,Te=new r(new ct(1.6,2),new ot({color:16773324,emissive:16755236,emissiveIntensity:2.2}));Te.position.set(ke,11.8,Le),Te.rotation.y=-re-Math.PI/2,m.add(Te)}let _e=[];for(let J=0;J<=24;J++){let re=J/24,ke=Math.sin(re*Math.PI*.78)*7*(1-Math.pow(re,2.2)*.52),Le=re*9.8;_e.push(new kt(Math.max(.01,ke),Le))}let Ze=new Jn(_e,32),Oe=new r(Ze,f);Oe.position.set(0,13.2,0),Oe.castShadow=!0,m.add(Oe);let st=_e.map(J=>new A(J.x*1.02,J.y+13.2,0)),vt=new It(st),At=new Jt(vt,20,.14,8,!1);for(let J=0;J<16;J++){let re=J/16*Math.PI*2,ke=new r(At,c);ke.rotation.y=re,m.add(ke)}let pt=new qe;pt.position.set(0,23,0);let Tt=new r(new F(.12,.32,4.2,12),c);Tt.position.y=2.1,pt.add(Tt),[.9,2.1,3.1].forEach((J,re)=>{let ke=.52-re*.11,Le=new r(new rt(ke,16,16),c);Le.position.y=J,pt.add(Le)});let xt=new r(new dt(.85,.16,10,24,Math.PI*1.5),c);xt.position.set(0,4.4,0),xt.rotation.y=Math.PI/4,pt.add(xt);let Pt=new vo(16772816,2.8,50);Pt.position.y=4.4,pt.add(Pt),m.add(pt);let St=new qe;St.position.set(-17,0,-8);let Gt=new r(new ce(5.2,5,5.2),a);Gt.position.y=2.5,St.add(Gt);let Nt=new r(new ce(5.25,1.2,5.25),l);Nt.position.y=4.4,St.add(Nt);let zt=new r(new F(1.9,2.3,26,8),t);zt.position.y=18,zt.castShadow=!0,St.add(zt),[10,16,22].forEach(J=>{let re=new ce(1.1,1.8,.3);[-1,1].forEach(ke=>{let Le=new r(re,l);Le.position.set(ke*.7,J,2),St.add(Le)})});let Dt=new r(new F(2.8,2,1.6,8),u);Dt.position.y=31.2,St.add(Dt);let wo=new r(new F(2.8,2.8,.9,8),t);wo.position.y=32.4,St.add(wo);let j=new r(new F(1.6,1.6,3.2,8,1,!0),t);j.position.y=34.2,St.add(j);let Ee=new r(new lt(1.9,4.2,8),f);Ee.position.y=37.8,Ee.castShadow=!0,St.add(Ee);let de=new qe;de.position.set(0,40.2,0);let Xe=new r(new F(.08,.18,2.4,8),c);Xe.position.y=1.2,de.add(Xe);let et=new r(new rt(.32,12,12),c);et.position.y=1.4,de.add(et);let nt=new r(new dt(.55,.11,8,18,Math.PI*1.5),c);nt.position.set(0,2.6,0),nt.rotation.y=Math.PI/4,de.add(nt),St.add(de),m.add(St);let Q=new ot({color:16775904,emissive:16758080,emissiveIntensity:2.8,roughness:.25,metalness:.85});[{x:-10,y:6.2,z:8.8},{x:-5,y:6.2,z:8.8},{x:0,y:6.2,z:8.8},{x:5,y:6.2,z:8.8},{x:10,y:6.2,z:8.8},{x:0,y:7.2,z:3.5},{x:-4.5,y:7,z:0},{x:4.5,y:7,z:0},{x:0,y:7.2,z:-2},{x:-4.5,y:7,z:-5},{x:4.5,y:7,z:-5},{x:0,y:6.8,z:-6.5}].forEach(J=>{let re=new qe;re.position.set(J.x,J.y,J.z);let ke=new r(new F(.02,.02,1.4,6),w);ke.position.y=.7,re.add(ke);let Le=new r(new no(.65,0),Q);re.add(Le);let Te=new r(new lt(.35,.45,8),w);Te.position.y=.45,re.add(Te);let Re=new r(new lt(.25,.4,8),w);if(Re.rotation.x=Math.PI,Re.position.y=-.45,re.add(Re),J.x===0&&(J.z===8.8||J.z===3.5||J.z===-2)){let he=new vo(16758861,1.8,16);he.position.y=-.3,re.add(he)}m.add(re)});let Ie=new qe;Ie.position.set(0,2.2,34),[-4.5,4.5].forEach(J=>{let re=new r(new F(.4,.48,5.8,16),t);re.position.set(J,2.9,0),re.castShadow=!0,Ie.add(re);let ke=new r(new ce(1.2,.6,1.2),u);ke.position.set(J,5.9,0),Ie.add(ke)});let We=new r(z,u);We.position.set(0,5.8,-.4),Ie.add(We);let $e=new r(new ce(10.5,1.2,1.2),l);$e.position.set(0,8.2,0),Ie.add($e),e.add(Ie),e.add(m),this.world.scene.add(e)}_roads(){let e=xa();this.world.scene.add(e);for(let o of Cn){if(o.name==="Grand Boulevard")continue;let s=Ra(o);this.world.scene.add(s)}}_plaza(){let{x:e,z:o,r:s}=K.plaza,n=ze(e,o),t=new qe,a=pe.honedCarraraMarble(1.5),l=pe.agedCaenLimestone(4),u=ho("granite",{repeat:2,color:1711392,roughness:.22,metalness:.12,physical:!0,clearcoat:.7,clearcoatRoughness:.12}),f=pe.lapisLazuli(1),c=pe.iron(2),p=pe.celestialGold(1),w=pe.verdigrisBronze(1),b=pe.foliage(1,4025144),x=pe.petal(1,16777215),V=pe.petal(1,16576233),y=new Ct({color:16775912}),H=new Ss({map:this.world._glowTex||null,color:16768904,transparent:!0,logarithmicDepthBuffer:!0,opacity:.88,blending:Ht,depthWrite:!1}),M=new r(new F(s+2,s+6,6.5,64),l);M.position.y=-1.8,M.receiveShadow=!0,t.add(M);let L=document.createElement("canvas");L.width=512,L.height=512;let T=L.getContext("2d");T.scale(.25,.25),T.fillStyle="#eae5d8",T.fillRect(0,0,2048,2048),T.strokeStyle="#d4cebf",T.lineWidth=3;for(let G=0;G<30;G++)T.beginPath(),T.moveTo(Math.random()*2048,Math.random()*2048),T.bezierCurveTo(Math.random()*2048,Math.random()*2048,Math.random()*2048,Math.random()*2048,Math.random()*2048,Math.random()*2048),T.stroke();let N=1024,q=980;T.strokeStyle="#181b1d",T.lineWidth=24,T.beginPath(),T.arc(N,N,q,0,Math.PI*2),T.stroke(),T.strokeStyle="#d4af37",T.lineWidth=10,T.beginPath(),T.arc(N,N,q-20,0,Math.PI*2),T.stroke(),T.strokeStyle="rgba(120, 110, 95, 0.45)",T.lineWidth=2;for(let G=420;G<q-40;G+=28)T.beginPath(),T.arc(N,N,G,0,Math.PI*2),T.stroke();for(let G=0;G<64;G++){let D=G/64*Math.PI*2;T.beginPath(),T.moveTo(N+Math.cos(D)*420,N+Math.sin(D)*420),T.lineTo(N+Math.cos(D)*(q-40),N+Math.sin(D)*(q-40)),T.stroke()}for(let G=0;G<48;G++){let D=G/48*Math.PI*2,z=340,W=N+Math.cos(D)*z,ee=N+Math.sin(D)*z;T.fillStyle=G%2===0?"#16191b":"#3c4a3e",T.beginPath(),T.moveTo(W+Math.cos(D)*30,ee+Math.sin(D)*30),T.lineTo(W+Math.cos(D+Math.PI/2)*15,ee+Math.sin(D+Math.PI/2)*15),T.lineTo(W-Math.cos(D)*30,ee-Math.sin(D)*30),T.lineTo(W-Math.cos(D+Math.PI/2)*15,ee-Math.sin(D+Math.PI/2)*15),T.closePath(),T.fill(),T.fillStyle="#d4af37",T.beginPath(),T.arc(W,ee,5,0,Math.PI*2),T.fill()}T.strokeStyle="#2c3a2e",T.lineWidth=8;for(let G=0;G<90;G++){let D=G/90*Math.PI*2,z=280,W=300;T.beginPath(),T.moveTo(N+Math.cos(D)*z,N+Math.sin(D)*z),T.lineTo(N+Math.cos(D+Math.PI/90)*W,N+Math.sin(D+Math.PI/90)*W),T.stroke()}let $=32;for(let G=0;G<$;G++){let D=G/$*Math.PI*2,z=(G+.5)/$*Math.PI*2,W=(G+1)/$*Math.PI*2,ee=G%2===0,ue=ee?780:540;T.fillStyle=ee?"#16191b":"#323639",T.beginPath(),T.moveTo(N,N),T.lineTo(N+Math.cos(D)*140,N+Math.sin(D)*140),T.lineTo(N+Math.cos(z)*ue,N+Math.sin(z)*ue),T.closePath(),T.fill(),T.fillStyle=ee?"#d4af37":"#f2d04a",T.beginPath(),T.moveTo(N,N),T.lineTo(N+Math.cos(z)*ue,N+Math.sin(z)*ue),T.lineTo(N+Math.cos(W)*140,N+Math.sin(W)*140),T.closePath(),T.fill()}T.fillStyle="#16191b",T.beginPath(),T.arc(N,N,140,0,Math.PI*2),T.fill(),T.strokeStyle="#f2d04a",T.lineWidth=14,T.beginPath(),T.arc(N,N,138,0,Math.PI*2),T.stroke();let Y=new Kt(L);Y.anisotropy=16;let k=new ot({map:Y,roughness:.38,metalness:.12}),h=new r(new $t(s-2,64),k);h.rotation.x=-Math.PI/2,h.position.y=1.75,h.receiveShadow=!0,t.add(h);let v=new r(new F(28,29,1.2,8),l);v.position.y=2.2,v.receiveShadow=!0,t.add(v);let _=new r(new F(26,27,1.2,8),a);_.position.y=3.4,_.receiveShadow=!0,t.add(_);for(let G=0;G<8;G++){let D=G/8*Math.PI*2,z=new qe;z.position.set(0,4,0),z.rotation.y=-D;let W=new r(new F(23.9,22.1,.45,32,1,!1,-Math.PI/24,Math.PI/12),a);W.position.y=.55,z.add(W);let ee=new r(new F(24.3,23.9,1.4,32,1,!1,-Math.PI/24,Math.PI/12),a);ee.position.y=1.45,z.add(ee);let ue=new r(new ce(.6,4,1.8),l);ue.position.set(Math.sin(-Math.PI/32)*23,-1.5,Math.cos(-Math.PI/32)*23),ue.rotation.y=Math.PI/32,z.add(ue);let ge=new r(new ce(.6,4,1.8),l);ge.position.set(Math.sin(Math.PI/32)*23,-1.5,Math.cos(Math.PI/32)*23),ge.rotation.y=-Math.PI/32,z.add(ge),t.add(z);let we=D+Math.PI/8,_e=new qe;_e.position.set(Math.cos(we)*26,4,Math.sin(we)*26);let Ze=new r(new ce(2.4,1.4,2.4),l);Ze.position.y=.7,_e.add(Ze);let Oe=new r(new F(1.6,.9,2.2,16),a);Oe.position.y=2.4,_e.add(Oe);let st=new r(new $t(1.5,16),u);st.rotation.x=-Math.PI/2,st.position.y=3.45,_e.add(st);let vt=new rs(new ht(-.9,3.4,0),new ht(0,6.2,0),new ht(.9,3.4,0)),At=new r(new Jt(vt,16,.08,6),c);_e.add(At);let pt=new r(new rt(1.7,12,10),b);pt.scale.set(1.1,1.3,1.1),pt.position.y=4.2,_e.add(pt);for(let Tt=0;Tt<18;Tt++){let xt=Math.random()*Math.PI,Pt=Math.random()*Math.PI*2,St=Math.sin(xt)*Math.cos(Pt)*1.7,Gt=4.2+Math.cos(xt)*1.5,Nt=Math.sin(xt)*Math.sin(Pt)*1.7,zt=Tt%3===0,Dt=new r(zt?new rt(.32,8,8):new no(.22,0),zt?V:x);Dt.position.set(St,Gt,Nt),_e.add(Dt)}t.add(_e)}let g=new r(new F(18.5,19.5,2.6,64),a);g.position.y=5.2,g.receiveShadow=!0,t.add(g);let i=new r(new dt(18.8,.85,16,64),a);i.rotation.x=Math.PI/2,i.position.y=6.5,t.add(i);for(let G=0;G<8;G++){let D=G/8*Math.PI*2,z=new r(new ce(1.6,2.8,3.2),a);z.position.set(Math.cos(D)*18.6,4.4,Math.sin(D)*18.6),z.rotation.y=-D,t.add(z)}let S=new r(new $t(18.2,64),this._fountainBasinMat);S.rotation.x=-Math.PI/2,S.position.y=6.1,S.receiveShadow=!0,t.add(S),this.world._reflectiveMeshes.push(S);let C=new r(new F(3.6,4.8,6,32),a);C.position.y=9.1,C.castShadow=!0,t.add(C);let O=new r(new dt(4.2,.35,8,32),p);O.rotation.x=Math.PI/2,O.position.y=6.8,t.add(O);let te=new r(new F(11.4,7.2,2.8,48),a);te.position.y=13.5,te.castShadow=!0,t.add(te);let m=new r(new dt(11.6,.65,16,64),a);m.rotation.x=Math.PI/2,m.position.y=14.9,t.add(m);let E=new r(new $t(10.8,48),this._fountainBasinMat);E.rotation.x=-Math.PI/2,E.position.y=14.6,t.add(E),this.world._reflectiveMeshes.push(E);for(let G=0;G<8;G++){let D=G/8*Math.PI*2,z=new qe;z.position.set(Math.cos(D)*11.6,14.1,Math.sin(D)*11.6),z.rotation.y=-D+Math.PI/2;let W=new r(new rt(.92,16,12),w);z.add(W);let ee=new r(new dt(.95,.38,8,16),p);ee.position.z=-.25,z.add(ee);let ue=new r(new F(.38,.52,.65,8),w);ue.rotation.x=Math.PI/2,ue.position.set(0,-.15,.65),z.add(ue);let ge=new r(new no(.35,0),p);ge.position.set(0,.45,.6),z.add(ge),t.add(z)}let R=new r(new F(2.4,3.4,5,24),a);R.position.y=17.1,R.castShadow=!0,t.add(R);let P=new r(new F(6.4,4.2,2,32),a);P.position.y=20.6,P.castShadow=!0,t.add(P);let oe=new r(new $t(6,32),this._fountainBasinMat);oe.rotation.x=-Math.PI/2,oe.position.y=21.4,t.add(oe),this.world._reflectiveMeshes.push(oe);let ne=new r(new F(1.8,2.4,4.5,16),a);ne.position.y=23.8,ne.castShadow=!0,t.add(ne);let se=new r(new dt(2.1,.28,8,24),p);se.rotation.x=Math.PI/2,se.position.y=25.8,t.add(se);let ae=new r(new F(.35,1.5,11.5,4),f);ae.rotation.y=Math.PI/4,ae.position.y=31.6,ae.castShadow=!0,t.add(ae);for(let G=0;G<4;G++){let D=G/4*Math.PI*2+Math.PI/4,z=new r(new no(.45,0),p);z.position.set(Math.cos(D)*.95,31.6,Math.sin(D)*.95),t.add(z)}let I=new r(new lt(.55,2.2,4),p);I.rotation.y=Math.PI/4,I.position.y=38.2,I.castShadow=!0,t.add(I);let Z=new r(new F(11.4,16.2,8.5,64,1,!0),this._fountainCascadeMat);Z.position.y=10.35,t.add(Z);let ie=new r(new F(6.4,9.2,6.8,48,1,!0),this._fountainCascadeMat);ie.position.y=18,t.add(ie);for(let G=0;G<4;G++){let D=G/4*Math.PI*2,z=new rs(new ht(Math.cos(D)*1.8,24.6,Math.sin(D)*1.8),new ht(Math.cos(D)*5.2,30.8,Math.sin(D)*5.2),new ht(Math.cos(D)*5.8,21.4,Math.sin(D)*5.8)),W=new r(new Jt(z,20,.25,8),this._fountainCascadeMat);t.add(W)}for(let G=0;G<8;G++){let D=G/8*Math.PI*2,z=new rs(new ht(Math.cos(D)*11.6,14.1,Math.sin(D)*11.6),new ht(Math.cos(D)*15.6,16.4,Math.sin(D)*15.6),new ht(Math.cos(D)*17.2,6.2,Math.sin(D)*17.2)),W=new r(new Jt(z,20,.35,8),this._fountainCascadeMat);t.add(W)}let ve=new ot({color:16773320,emissive:16765544,emissiveIntensity:2.2,roughness:.15,metalness:.1}),De=[],Ue=[],Ke=[],U=[];for(let G of[-1,1])for(let D=0;D<4;D++){let z=32+D*14,W=G*(s*.45),ee=new ce(2,6,2);ee.translate(W,1.6+.5-2.5,z),De.push(ee);let ue=new F(.55,.8,2.6,12);ue.translate(W,1.6+2.3,z),Ue.push(ue);let ge=new F(1.4,.6,1,16);ge.translate(W,1.6+4.1,z),Ke.push(ge);let we=new dt(1.4,.15,8,16);we.rotateX(Math.PI/2),we.translate(W,1.6+4.6,z),Ke.push(we);let _e=new lt(.8,1.8,8);_e.translate(W,1.6+5.5,z),U.push(_e);for(let Ze=0;Ze<4;Ze++){let Oe=Ze/4*Math.PI*2,st=new lt(.5,1.4,6);st.translate(Math.cos(Oe)*.5,0,Math.sin(Oe)*.5),st.rotateZ(Math.cos(Oe)*.2),st.rotateX(Math.sin(Oe)*.2),st.translate(W,1.6+5.2,z),U.push(st)}}let xe=ao(De,!1);xe&&t.add(new r(xe,u));let Ce=ao(Ue,!1);Ce&&t.add(new r(Ce,a));let Pe=ao(Ke,!1);Pe&&t.add(new r(Pe,p));let B=ao(U,!1);B&&t.add(new r(B,ve));let X=new vo(16768896,3.5,110,1.5);X.position.set(0,20,0),t.add(X),t.traverse(G=>{G.isMesh&&G.material!==this._fountainCascadeMat&&G.material!==this._fountainBasinMat&&(G.castShadow=!0,G.receiveShadow=!0)}),t.position.set(e,n,o),this.world.scene.add(t)}_gate(){let e=new qe,{x:o,z:s}=K.gate,n=32,t=pe.honedCarraraMarble(1.5),a=pe.celestialGold(1),l=pe.verdigrisBronze(1),u=pe.celestialGold(1),f=pe.agedCaenLimestone(1.8),c=new Ct({color:16775912}),p=new Ss({map:this.world._glowTex||null,color:16768904,transparent:!0,logarithmicDepthBuffer:!0,opacity:.88,blending:Ht,depthWrite:!1}),w=yo("leafCard"),b=Go(4093236,w.map,{isTree:!1,normalMap:w.normalMap,normalScale:.8,roughness:.68,sssColor:new Me(8052280),shadowColor:new Me(1588756),sssIntensity:.85,windIntensity:.9}),x=pe.limestoneDark(2),y=[12853821,16576233,16175973,15228277,11563734].map(j=>new ot({color:j,roughness:.45,metalness:.05,side:gt})),H=(j=1)=>{let Ee=new qe,de=us(2.8*j,.02);Ee.add(de);let Xe=[],et=new ce(3.6*j,1*j,3.6*j);et.translate(0,.5*j,0),Xe.push(et);let nt=new F(3.2*j,1.6*j,2.6*j,16);nt.translate(0,3.4*j,0),Xe.push(nt);let Q=ao(Xe,!1);if(Q){let Re=new r(Q,t);Re.castShadow=!0,Ee.add(Re)}let Ge=[],Ie=new F(1.6*j,1*j,1.2*j,12);Ie.translate(0,1.6*j,0),Ge.push(Ie);let We=new dt(3.3*j,.35*j,8,20);We.rotateX(Math.PI/2),We.translate(0,4.7*j,0),Ge.push(We);for(let Re of[-1,1]){let he=new dt(1.4*j,.28*j,6,12,Math.PI*1.2);he.rotateZ(Re*.45),he.translate(Re*3.2*j,3.4*j,0),Ge.push(he)}let $e=ao(Ge,!1);if($e){let Re=new r($e,a);Re.castShadow=!0,Ee.add(Re)}let J=new r(new F(2.9*j,2.7*j,.6*j,12),x);J.position.y=4.5*j,Ee.add(J);let re=[];for(let Re=0;Re<8;Re++){let he=Re/8*Math.PI*2,Be=2.8*j,He=new ct(1.6*j,3.4*j,2,2),Je=He.attributes.position;for(let it=0;it<Je.count;it++){let wt=Je.getX(it),bt=Je.getY(it),Wt=wt/(1.6*j*.5),fo=bt/(3.4*j*.5);Je.setZ(it,(1-Wt*Wt)*.45*(1-fo*.25))}He.computeVertexNormals(),He.rotateX(.78),He.rotateY(he+Math.PI*.5),He.translate(Math.cos(he)*Be,4.6*j-.9*j,Math.sin(he)*Be),re.push(He)}let ke=ao(re,!1);ke&&Ee.add(new r(ke,b));let Le=[];for(let Re=0;Re<8;Re++){let he=Math.acos(1-2*((Re+.5)/8)),Be=Re*2.39996,He=2*j,Je=Math.sin(he)*Math.cos(Be)*He,it=4.8*j+Math.cos(he)*(He*.65),wt=Math.sin(he)*Math.sin(Be)*He,bt=new rt(.55*j,6,5);bt.translate(Je,it,wt),Le.push(bt)}let Te=ao(Le,!1);return Te&&Ee.add(new r(Te,y[0])),Ee},M=24,L=12,T=13,N=M+L/2,q=new r(new ce(M*2+240,8,240),f);q.position.set(0,-3.8,60),q.receiveShadow=!0,e.add(q);let $=new r(new ce(M*2+48,1.6,210),t);$.position.set(0,.45,60),$.receiveShadow=!0,e.add($);for(let j of[-1,1]){let Ee=j*(M+22);for(let de=30;de<=150;de+=24){let Xe=new r(new F(.45,.65,3.8,8),t);Xe.position.set(Ee,2.35,de),Xe.castShadow=!0,e.add(Xe);let et=new r(new F(.95,.35,.75,8),a);et.position.set(Ee,4.35,de),e.add(et);let nt=new r(new lt(.35,1.1,8),new Ct({color:16768392}));nt.position.set(Ee,5,de),e.add(nt)}}for(let j of[-M-2,M+2]){let Ee=new r(new ce(.55,1.65,40),a);Ee.position.set(j,.46,0),e.add(Ee)}let Y=new r(new ce(M*2+6,.08,.55),a);Y.position.set(0,1.26,0),e.add(Y);let k=document.createElement("canvas");k.width=512,k.height=512;let h=k.getContext("2d");h.scale(.25,.25);let v=1024,_=1024;h.fillStyle="#f6f3eb",h.fillRect(0,0,2048,2048),h.strokeStyle="rgba(190, 175, 145, 0.4)",h.lineWidth=4;for(let j=0;j<24;j++)h.beginPath(),h.moveTo(Math.random()*2048,Math.random()*2048),h.bezierCurveTo(Math.random()*2048,Math.random()*2048,Math.random()*2048,Math.random()*2048,Math.random()*2048,Math.random()*2048),h.stroke();h.fillStyle="#0f1712",h.beginPath(),h.arc(v,_,980,0,Math.PI*2),h.fill(),h.fillStyle="#18241c",h.beginPath(),h.arc(v,_,880,0,Math.PI*2),h.fill(),[980,960,880,860,620,600].forEach((j,Ee)=>{h.strokeStyle=Ee%2===0?"#d4af37":"#f8db70",h.lineWidth=Ee%2===0?8:4,h.beginPath(),h.arc(v,_,j,0,Math.PI*2),h.stroke()});for(let j=0;j<32;j++){let Ee=j/32*Math.PI*2,de=v+Math.cos(Ee)*920,Xe=_+Math.sin(Ee)*920;h.beginPath(),h.arc(de,Xe,j%4===0?14:8,0,Math.PI*2),h.fillStyle=j%4===0?"#fceaa0":"#d4af37",h.fill(),h.strokeStyle="#997316",h.lineWidth=2,h.stroke()}let g=(j,Ee,de,Xe,et,nt,Q=!0)=>{h.save(),h.font=et,h.fillStyle=nt,h.textAlign="center",h.textBaseline="middle";let Ge=j.length,Ie=Xe-de;for(let We=0;We<Ge;We++){let $e=j[We],J=(We+.5)/Ge,re=de+J*Ie;h.save(),h.translate(v,_),Q?(h.rotate(re+Math.PI/2),h.translate(0,-Ee)):(h.rotate(re-Math.PI/2),h.translate(0,Ee)),h.fillText($e,0,0),h.restore()}h.restore()};g("\u2726   E T E R N I T Y   V A L L E Y   \u2726",740,-Math.PI*.78,-Math.PI*.22,'bold 64px "Cinzel", "Georgia", serif',"#fceaa0",!0),g("\u2726   SOMEWHERE OVER THE RAINBOW BRIDGE   \u2726",740,Math.PI*.78,Math.PI*.22,'bold 42px "Cinzel", "Georgia", serif',"#dfb94a",!1),g("\u2726  WHERE LOVE LIVES FOREVER  \u2726",540,-Math.PI*.65,-Math.PI*.35,'bold 36px "Cinzel", "Georgia", serif',"#e8c860",!0);let i=h.createRadialGradient(v,_,0,v,_,480);i.addColorStop(0,"#122438"),i.addColorStop(.6,"#091522"),i.addColorStop(1,"#040b12"),h.fillStyle=i,h.beginPath(),h.arc(v,_,480,0,Math.PI*2),h.fill();for(let j=0;j<60;j++){let Ee=Math.random()*Math.PI*2,de=Math.random()*450,Xe=v+Math.cos(Ee)*de,et=_+Math.sin(Ee)*de;h.fillStyle="rgba(255, 240, 180, "+(.3+Math.random()*.7)+")",h.beginPath(),h.arc(Xe,et,1+Math.random()*2.2,0,Math.PI*2),h.fill()}let S=["#e0503c","#ef9138","#e8d84a","#5ec96a","#3fa9e0","#4661d8","#7a4bd0"],C=340;S.forEach((j,Ee)=>{h.strokeStyle=j,h.lineWidth=14,h.beginPath(),h.arc(v,_+60,C-Ee*13,-Math.PI*.88,-Math.PI*.12,!1),h.stroke()}),h.fillStyle="#0d1822",h.beginPath(),h.moveTo(v-360,_+180),h.lineTo(v-220,_-30),h.lineTo(v-140,_+50),h.lineTo(v,_-110),h.lineTo(v+130,_+40),h.lineTo(v+240,_-20),h.lineTo(v+360,_+180),h.closePath(),h.fill(),h.strokeStyle="#d4af37",h.lineWidth=4,h.stroke(),h.fillStyle="#e8eff8",h.beginPath(),h.moveTo(v,_-110),h.lineTo(v-35,_-60),h.lineTo(v+35,_-60),h.closePath(),h.fill(),h.fillStyle="#fff4cc",h.beginPath(),h.arc(v,_-135,28,0,Math.PI*2),h.fill(),h.strokeStyle="#d4af37",h.lineWidth=4,h.stroke();for(let j=0;j<8;j++){let Ee=j/8*Math.PI*2,de=j%2===0?65:42,Xe=v+Math.cos(Ee)*de,et=_-135+Math.sin(Ee)*de;h.strokeStyle="#f8db70",h.lineWidth=j%2===0?4:2,h.beginPath(),h.moveTo(v,_-135),h.lineTo(Xe,et),h.stroke()}let O=new Kt(k);O.anisotropy=Math.min(16,this.world.renderer.capabilities.getMaxAnisotropy?.()||16);let te=new ot({map:O,roughness:.18,metalness:.65,emissive:new Me(16771216),emissiveMap:O,emissiveIntensity:.28}),m=new r(new F(15,15.4,.15,64),te);m.rotation.y=-Math.PI/2,m.position.set(0,1.36,0),m.receiveShadow=!0,e.add(m);let E=new r(new dt(15.2,.35,12,64),a);E.rotation.x=Math.PI/2,E.position.set(0,1.28,0),e.add(E),[-28,28].forEach(j=>{let Ee=H(1.1);Ee.position.set(j,1.25,0),e.add(Ee)});let R=[60,35,10,-15];for(let j of[-1,1]){let Ee=j*34,de=new r(new ce(1.8,.9,90),t);de.position.set(Ee,.45,22.5),e.add(de);let Xe=new r(new ce(1.4,.55,90),t);Xe.position.set(Ee,2.6,22.5),e.add(Xe);for(let nt=-20;nt<=65;nt+=3.5){let Q=new r(new F(.24,.32,1.6,8),t);Q.position.set(Ee,1.5,nt),e.add(Q)}for(let nt of R){let Q=new qe;Q.position.set(Ee,0,nt);let Ge=us(3.2);Q.add(Ge);let Ie=new r(new ce(3,1.8,3),t);Ie.position.y=.9,Q.add(Ie);let We=new r(new dt(1.3,.25,8,16),a);We.rotation.x=Math.PI/2,We.position.y=1.9,Q.add(We);let $e=new r(new F(.55,.75,7.5,12),l);$e.position.y=5.65,Q.add($e);let J=new r(new F(1.2,.55,1.4,8),a);J.position.y=9.8,Q.add(J);let re=new r(new Vt(1.35,0),a);re.position.y=11.6,Q.add(re);let ke=new r(new rt(.65,8,8),c);if(ke.position.y=11.6,Q.add(ke),this.world._glowTex){let Te=new as(p);Te.position.y=11.6,Te.scale.set(6.5,6.5,1),Q.add(Te)}let Le=new r(new lt(1.45,1.6,6),a);Le.position.y=13,Q.add(Le),e.add(Q)}let et=[47.5,22.5,-2.5];for(let nt of et){let Q=H(.85);Q.position.set(Ee,2.9,nt),e.add(Q)}}let P=new ot({color:3346437,emissive:16724996,emissiveIntensity:3.5,roughness:.85,metalness:.2}),oe=new ot({color:16774048,emissive:16768848,emissiveIntensity:4.2,roughness:.1,metalness:0}),ne=new Ct({color:16747546,transparent:!0,logarithmicDepthBuffer:!0,opacity:.85,blending:Ht,depthWrite:!1}),se=(j=1,Ee=!0)=>{let de=new qe,Xe=new r(new ce(4.8*j,1.2*j,4.8*j),t);Xe.position.y=.6*j,de.add(Xe);let et=new r(new F(2*j,1.2*j,1.5*j,16),a);et.position.y=1.95*j,de.add(et);let nt=new r(new F(4*j,2*j,3.2*j,24),a);nt.position.y=4.2*j,de.add(nt);let Q=new r(new dt(4.1*j,.45*j,12,32),a);Q.rotation.x=Math.PI/2,Q.position.y=5.8*j,de.add(Q);for(let Te of[-1,1]){let Re=new r(new dt(1.8*j,.36*j,8,16,Math.PI*1.2),a);Re.rotation.z=Te*.45,Re.position.set(Te*4*j,4.2*j,0),de.add(Re)}let Ge=new r(new F(3.6*j,3.4*j,.8*j,16),P);Ge.position.y=5.6*j,de.add(Ge);let Ie=new r(new lt(1.4*j,5.2*j,12),oe);Ie.position.y=8.2*j,de.add(Ie);let We=new r(new lt(2.6*j,7.6*j,16),ne);We.position.y=9*j,de.add(We);for(let Te=0;Te<4;Te++){let Re=Te/4*Math.PI*2,he=new r(new lt(1.1*j,5.8*j,8),ne);he.position.set(Math.cos(Re)*1.1*j,8.4*j,Math.sin(Re)*1.1*j),he.rotation.z=Math.cos(Re)*.22,he.rotation.x=Math.sin(Re)*.22,de.add(he)}let $e=Math.floor(60*j),J=new Et,re=new Float32Array($e*3);for(let Te=0;Te<$e;Te++){let Re=Math.random()*Math.PI*2,he=Math.random()*2.8*j;re[Te*3+0]=Math.cos(Re)*he,re[Te*3+1]=(6+Math.random()*12)*j,re[Te*3+2]=Math.sin(Re)*he}J.setAttribute("position",new tt(re,3));let ke=new Cs({color:16756792,size:.95*j,transparent:!0,logarithmicDepthBuffer:!0,opacity:.95,blending:Ht,depthWrite:!1}),Le=new co(J,ke);return de.add(Le),de.onBeforeRender=()=>{let Te=performance.now()*.001,Re=1+Math.sin(Te*6+(Ee?0:2.5))*.14+Math.cos(Te*11)*.07;Ie.scale.set(Re,1+(Re-1)*1.5,Re),We.scale.set(Re*1.05,1+(Re-1)*1.2,Re*1.05),We.rotation.y=Te*1.2;let he=J.attributes.position;for(let Be=0;Be<$e;Be++){let He=he.getY(Be)+.08*j;He>18*j&&(He=6*j),he.setY(Be,He);let Je=he.getX(Be)+Math.sin(Te*2.2+Be)*.022,it=he.getZ(Be)+Math.cos(Te*2.2+Be)*.022;he.setX(Be,Je),he.setZ(Be,it)}he.needsUpdate=!0},de},ae=(j,Ee,de)=>{let Xe=new qe,et=new r(new ce(Ee*2.5,.9,Ee*2.5),t);et.position.y=.45,Xe.add(et);let nt=new r(new dt(Ee*1.2,Ee*.22,12,24),t);nt.rotation.x=Math.PI/2,nt.position.y=1.05,Xe.add(nt);let Q=new r(new F(Ee*1.25,Ee*1.25,.18,24),a);Q.position.y=1.35,Xe.add(Q);let Ge=new r(new F(Ee*1.05,Ee*1.18,.4,24),t);Ge.position.y=1.65,Xe.add(Ge);let Ie=new r(new dt(Ee*1.08,Ee*.16,12,24),t);Ie.rotation.x=Math.PI/2,Ie.position.y=1.95,Xe.add(Ie);let We=j-4.6,$e=new r(new F(de,Ee,We,24),t);$e.position.y=2+We/2,Xe.add($e);let J=16;for(let he=0;he<J;he++){let Be=he/J*Math.PI*2,He=(Ee+de)/2+.02,Je=new r(new F(.045,.055,We-.4,6),t);Je.position.set(Math.cos(Be)*He,2+We/2,Math.sin(Be)*He),Xe.add(Je)}let re=new r(new dt(de*1.06,.12,8,24),a);re.rotation.x=Math.PI/2,re.position.y=2+We+.1,Xe.add(re);let ke=2+We+.3,Le=new qe;Le.position.y=ke;let Te=new r(new F(de*1.4,de*.95,2.2,16),a);Te.position.y=1.1,Le.add(Te);for(let he=0;he<8;he++){let Be=he/8*Math.PI*2,He=new r(new lt(.32,1.2,5),a);He.rotation.z=-Math.cos(Be)*.28,He.rotation.x=Math.sin(Be)*.28,He.position.set(Math.cos(Be)*(de*1.15),.65,Math.sin(Be)*(de*1.15)),Le.add(He)}for(let he=0;he<8;he++){let Be=(he+.5)/8*Math.PI*2,He=new r(new lt(.28,1.6,5),a);He.rotation.z=-Math.cos(Be)*.35,He.rotation.x=Math.sin(Be)*.35,He.position.set(Math.cos(Be)*(de*1.28),1.25,Math.sin(Be)*(de*1.28)),Le.add(He)}for(let he=0;he<4;he++){let Be=he/4*Math.PI*2+Math.PI/4,He=new r(new dt(.42,.14,8,16,Math.PI*1.4),a);He.rotation.y=Be,He.rotation.z=Math.PI/4,He.position.set(Math.cos(Be)*(de*1.45),1.9,Math.sin(Be)*(de*1.45)),Le.add(He)}let Re=new r(new ce(de*3.2,.55,de*3.2),t);Re.position.y=2.45,Le.add(Re);for(let he=0;he<4;he++){let Be=he/4*Math.PI*2,He=new r(new no(.28,0),a);He.position.set(Math.cos(Be)*(de*1.65),2.45,Math.sin(Be)*(de*1.65)),Le.add(He)}return Xe.add(Le),Xe},I=(j,Ee)=>{let de=new qe,Xe=us(16);de.add(Xe);let et=new r(new ce(15.6,2,15.6),t);et.position.y=1,de.add(et);let nt=new r(new ce(14.4,1.6,14.4),f);nt.position.y=2.8,de.add(nt);let Q=new r(new ce(13.4,1.2,13.4),t);Q.position.y=4.2,de.add(Q);let Ge=new r(new ce(13.5,.25,13.5),a);Ge.position.y=4.8,de.add(Ge);let Ie=37.2,We=12,$e=Ie/We;for(let He=0;He<We;He++){let Je=12.8-He*.05,it=13.8-He*.05,wt=new r(new ce(Je,$e-.08,it),t);if(wt.position.y=4.8+$e*(He+.5),wt.castShadow=!0,wt.receiveShadow=!0,de.add(wt),He>0&&He<We-1)for(let bt of[0,Math.PI]){let Wt=new r(new ce(Je-2.6,$e-.24,.4),f);Wt.position.set(0,4.8+$e*(He+.5),(it/2+.1)*(bt===0?1:-1)),de.add(Wt)}}[[-5.2,-5.2],[5.2,-5.2],[-5.2,5.2],[5.2,5.2]].forEach(([He,Je])=>{let it=ae(Ie-.5,1.15,.98);it.position.set(He,4.8,Je),de.add(it)}),[-7,7].forEach(He=>{let Je=new r(new F(2.4,2.4,.45,24),a);Je.rotation.x=Math.PI/2,Je.position.set(0,22,He),de.add(Je);let it=new r(new no(1,0),a);it.position.set(0,22,He+(He>0?.35:-.35)),de.add(it)});let re=new r(new ce(13.4,1.2,14.4),t);re.position.y=37.6,de.add(re);let ke=new r(new ce(13.5,.3,14.5),a);ke.position.y=38.2,de.add(ke);let Le=new r(new ce(13.6,1.2,14.6),t);Le.position.y=42.6,de.add(Le);let Te=new r(new ce(13,1.6,14),t);Te.position.y=44,de.add(Te);for(let He=0;He<4;He++){let Je=new qe;Je.rotation.y=He*(Math.PI/2);for(let it=-4.5;it<=4.5;it+=3){let wt=new r(new rt(.42,8,8),a);wt.position.set(it,44,7.1),Je.add(wt)}de.add(Je)}let Re=new r(new ce(15.2,1.4,16.2),t);Re.position.y=45.5,de.add(Re);let he=new r(new ce(12.4,4.8,13.4),t);he.position.y=48.6,de.add(he),[-6.8,6.8].forEach(He=>{let Je=new r(new dt(1.6,.28,8,16),a);Je.position.set(0,48.6,He),de.add(Je)}),[[-5.2,-5.8],[5.2,-5.8],[-5.2,5.8],[5.2,5.8]].forEach(([He,Je])=>{let it=new r(new lt(.9,2,4),a);it.rotation.y=Math.PI/4,it.position.set(He,51.5,Je),de.add(it)});let Be=se(1,Ee);return Be.position.set(0,51,0),de.add(Be),de.position.set(j,0,0),de};e.add(I(-N,!0),I(N,!1));let Z=38,ie=M,ve=[];for(let j=0;j<=32;j++){let Ee=Math.PI-j/32*Math.PI;ve.push(new A(Math.cos(Ee)*(ie-.8),Z+Math.sin(Ee)*(ie-.8),0))}let De=new It(ve),Ue=new r(new Jt(De,48,.65,8),t);e.add(Ue);let Ke=[];for(let j=0;j<=32;j++){let Ee=Math.PI-j/32*Math.PI;Ke.push(new A(Math.cos(Ee)*ie,Z+Math.sin(Ee)*ie,0))}let U=new It(Ke),xe=new r(new Jt(U,48,.95,8),t);e.add(xe);let Ce=[];for(let j=0;j<=32;j++){let Ee=Math.PI-j/32*Math.PI;Ce.push(new A(Math.cos(Ee)*(ie+.9),Z+Math.sin(Ee)*(ie+.9),0))}let Pe=new It(Ce),B=new r(new Jt(Pe,48,.5,8),a);e.add(B);let X=23;for(let j=1;j<X;j++){let Ee=Math.PI-j/X*Math.PI,de=Math.cos(Ee)*(ie+.45),Xe=Z+Math.sin(Ee)*(ie+.45),et=new r(new ce(1.8,2.4,2.8),t);et.position.set(de,Xe,0),et.rotation.z=Ee-Math.PI/2,e.add(et);let nt=new r(new no(.38,0),a);nt.position.set(de,Xe,1.5),e.add(nt);let Q=nt.clone();Q.position.set(de,Xe,-1.5),e.add(Q)}let G=new qe;G.position.set(0,Z+ie+.9,0);let D=new r(new ce(3.6,4.2,3.6),t);G.add(D);for(let j of[-1.9,1.9]){let Ee=new r(new ce(2.4,3.2,.4),a);Ee.position.set(0,0,j),G.add(Ee);let de=new r(new no(1.5,0),a);de.position.set(0,.4,j+(j>0?.25:-.25)),G.add(de);let Xe=new r(new dt(1.4,.22,8,16),a);Xe.position.set(0,.4,j+(j>0?.2:-.2)),G.add(Xe)}e.add(G);for(let j=1;j<=15;j++){let Ee=Math.PI-j/16*Math.PI,de=Math.cos(Ee)*(ie-1.1),Xe=Z+Math.sin(Ee)*(ie-1.1),et=new r(new ce(2.4,.45,3.8),t);et.position.set(de,Xe,0),et.rotation.z=Ee-Math.PI/2,e.add(et);let nt=new r(new ce(1.8,.25,3),f);nt.position.set(de,Xe,0),nt.rotation.z=Ee-Math.PI/2,e.add(nt);let Q=new r(new F(.55,.55,.1,12),a);Q.position.set(de,Xe,0),Q.rotation.z=Ee-Math.PI/2,e.add(Q);let Ge=new r(new rt(.32,8,8),a);Ge.position.set(de,Xe,0),e.add(Ge)}for(let j of[-1,1]){let Ee=new qe,de=j*(M/2+4.5),Xe=Z+7.5;Ee.position.set(de,Xe,0);let et=new r(new ce(M-4.5,1.4,2.2),t);et.position.set(0,6.8,0),Ee.add(et);let nt=new r(new ce(1.6,14.5,2.2),t);nt.position.set(j*((M-4.5)/2-.8),0,0),Ee.add(nt);let Q=new r(new dt(3.6,.65,12,32),t);Ee.add(Q);let Ge=new r(new dt(3.1,.28,8,24),a);Ee.add(Ge);let Ie=new r(new dt(4.2,.24,8,24),a);Ee.add(Ie);for(let $e=0;$e<8;$e++){let J=$e/8*Math.PI*2,re=new r(new F(.09,.09,3.1,6),a);re.rotation.z=J,re.position.set(Math.sin(J)*1.55,Math.cos(J)*1.55,0),Ee.add(re)}let We=new r(new no(.7,0),a);Ee.add(We),e.add(Ee)}let z=48.5,W=M*2+2,ee=new r(new ce(W,1.4,3.6),t);ee.position.set(0,z-4.2,0),e.add(ee);let ue=new r(new ce(W+2.4,1.6,4.2),t);ue.position.set(0,z+4.6,0),e.add(ue);let ge=document.createElement("canvas");ge.width=512,ge.height=128;let we=ge.getContext("2d");we.scale(.25,.25);let _e=we.createLinearGradient(0,0,0,512);_e.addColorStop(0,"#07100a"),_e.addColorStop(.5,"#102015"),_e.addColorStop(1,"#07100a"),we.fillStyle=_e,we.fillRect(0,0,2048,512),we.strokeStyle="#d4af37",we.lineWidth=14,we.strokeRect(18,18,2012,476),we.strokeStyle="#f8db70",we.lineWidth=4,we.strokeRect(36,36,1976,440),we.fillStyle="#f8db70",[[54,54],[1994,54],[54,458],[1994,458]].forEach(([j,Ee])=>{we.beginPath(),we.arc(j,Ee,15,0,Math.PI*2),we.fill(),we.strokeStyle="#d4af37",we.lineWidth=3,we.stroke()}),we.textAlign="center",we.textBaseline="middle",we.font='bold 148px "Cinzel", "Georgia", "Times New Roman", serif',we.fillStyle="rgba(0, 0, 0, 0.9)",we.fillText("ETERNAL VALLEY",1028,186);let Ze=we.createLinearGradient(0,100,0,260);Ze.addColorStop(0,"#ffffff"),Ze.addColorStop(.25,"#fff4cc"),Ze.addColorStop(.55,"#f8db70"),Ze.addColorStop(.85,"#d4af37"),Ze.addColorStop(1,"#aa8218"),we.fillStyle=Ze,we.fillText("ETERNAL VALLEY",1024,180),we.font='600 64px "Cinzel", "Georgia", "Times New Roman", serif',we.fillStyle="rgba(0, 0, 0, 0.85)",we.fillText("\u2726   SOMEWHERE OVER THE RAINBOW BRIDGE   \u2726",1027,344);let Oe=we.createLinearGradient(0,300,0,380);Oe.addColorStop(0,"#fff4cc"),Oe.addColorStop(.6,"#f8db70"),Oe.addColorStop(1,"#c9a232"),we.fillStyle=Oe,we.fillText("\u2726   SOMEWHERE OVER THE RAINBOW BRIDGE   \u2726",1024,340);let st=new Kt(ge);st.anisotropy=16;let vt=new r(new ce(45,7.8,1.4),new ot({color:1578772,roughness:.3,metalness:.85}));vt.position.set(0,z,0),e.add(vt);let At=new ot({map:st,emissiveMap:st,emissive:new Me(16768880),emissiveIntensity:.95,roughness:.25,metalness:.6}),pt=new r(new ct(44,7.2),At);pt.position.set(0,z,.75),e.add(pt);let Tt=pt.clone();Tt.rotation.y=Math.PI,Tt.position.set(0,z,-.75),e.add(Tt);let xt=new r(new ce(W,.55,1.2),t);xt.position.set(0,z+6.2,0),e.add(xt);for(let j=-20;j<=20;j+=4){let Ee=new r(new lt(.5,1.2,6),a);Ee.position.set(j,z+7.1,0),e.add(Ee)}let Pt=new r(new lt(8,3.6,4),t);Pt.rotation.y=Math.PI/4,Pt.position.set(0,z+7.2,0),e.add(Pt);let St=new r(new no(1.6,0),a);St.position.set(0,z+9.2,0),e.add(St);let Gt=j=>{let Ee=[],de=(J,re,ke,Le,Te=0,Re=0,he=0,Be=1,He=1,Je=1)=>{let it=J.clone();if(Te!==0||Re!==0||he!==0){let wt=new Xn(Te,Re,he),bt=new so().setFromEuler(wt),Wt=new _t().compose(new A(0,0,0),bt,new A(1,1,1));it.applyMatrix4(Wt)}(Be!==1||He!==1||Je!==1)&&it.scale(Be,He,Je),it.translate(re,ke,Le),Ee.push(it)},Xe=M-.6,et=35;de(new ce(Xe,1.2,1.2),Xe/2,et-.7,0),de(new ce(Xe,1,1),Xe/2,23,0),de(new ce(Xe,1,1),Xe/2,12,0),de(new ce(Xe,1.2,1.2),Xe/2,1,0),de(new ce(1.2,et,1.2),Xe,et/2,0),de(new ce(1.5,et+1,1.5),0,(et+1)/2,0),[3.5,12,21,31].forEach(J=>{de(new F(.9,.9,2,16),0,J,0)});let nt=16;for(let J=1;J<nt;J++){let re=J/nt*Xe,ke=Math.sin(J/nt*Math.PI)*3.5,Le=et-1.5+ke;de(new F(.24,.24,Le,8),re,Le/2+.8,0),de(new lt(.65,2.6,6),re,Le+2.1,0),de(new F(.18,.18,9.5,6),re+Xe/(nt*2),5.8,0),de(new lt(.42,1.4,6),re+Xe/(nt*2),10.8,0)}for(let J=1;J<=4;J++){let re=J/5*Xe;de(new dt(2.4,.28,8,20),re,6.5,0),de(new dt(2,.26,8,16),re,17.5,0),de(new dt(1.8,.24,8,16),re,28.5,0)}de(new dt(3.8,.35,8,32),Xe/2,17.5,0),de(new dt(2.4,.25,8,24),Xe/2,17.5,0);for(let J=0;J<16;J++){let re=J/16*Math.PI*2,ke=J%2===0?3.6:2.4;de(new lt(.42,ke,4),Xe/2+Math.cos(re)*(ke/2+.4),17.5+Math.sin(re)*(ke/2+.4),0,0,0,-re+Math.PI/2)}de(new no(1.3,0),Xe/2,17.5,0);let Q=Xe/2,Ge=27.5;de(new rt(1.2,16,12),Q,Ge,0,0,0,0,1.5,.9,.75),de(new rt(.6,12,10),Q+(j?1.1:-1.1),Ge+.55,0),de(new lt(.22,.75,4),Q+(j?1.65:-1.65),Ge+.5,0,0,0,j?-Math.PI/2:Math.PI/2);for(let J of[-1,1])de(new lt(1.3,4.2,6),Q,Ge+1.8,J*1.3,J*.6,0,(j?.35:-.35)+J*.4,1,1,.2);de(new lt(1,2.4,4),Q+(j?-1.5:1.5),Ge-.45,0,0,0,j?1.2:-1.2,1.2,1,.15);let Ie=new rs(new ht(j?1.65:-1.65,.5,0),new ht(j?2.8:-2.8,.9,.3),new ht(j?3.7:-3.7,.25,0));de(new Jt(Ie,12,.14,6),Q,Ge,0);let We=je(Ee,!1)||Ee[0],$e=new r(We,a);return $e.castShadow=!0,$e.receiveShadow=!0,$e},Nt=Gt(!0);Nt.position.set(-M+.5,1,0),Nt.rotation.y=0,e.add(Nt);let zt=Gt(!1);zt.position.set(M-.5,1,0),zt.rotation.y=Math.PI,e.add(zt),this.leftGateDoor=Nt,Nt.name="DynamicGateDoorLeft",Nt.userData={isDynamic:!0},this.rightGateDoor=zt,zt.name="DynamicGateDoorRight",zt.userData={isDynamic:!0},this.gateOpenAmount=0,this.gateTargetOpen=0;let Dt=j=>{let Ee=new qe,de=j?1:-1,Xe=10,et=56,nt=0,Q=1.15,Ge=de*(M+L);for(let go=0;go<Xe;go++){let zo=go/(Xe-1),po=nt+zo*(Q-nt),oo=Ge+de*(Math.sin(po)*et),eo=(1-Math.cos(po))*(et*.7),lo=new r(new ce(7.5,2,8.5),f);lo.position.set(oo,1,eo),lo.rotation.y=-de*po*.7,lo.receiveShadow=!0,Ee.add(lo);let io=new r(new ce(8.5,1,9.5),t);io.position.set(oo,.5,eo),io.rotation.y=-de*po*.7,io.receiveShadow=!0,Ee.add(io);let Se=new r(new F(1.2,1.4,12,16),t);Se.position.set(oo,8,eo),Se.castShadow=!0,Ee.add(Se);let Ne=new r(new ce(3,1.4,3),t);Ne.position.set(oo,14.4,eo),Ee.add(Ne);let Ve=new r(new dt(1.5,.35,8,16),a);Ve.rotation.x=Math.PI/2,Ve.position.set(oo,14.2,eo),Ee.add(Ve);let Ye=new r(new ce(3,1.2,3),t);Ye.position.set(oo,2.6,eo),Ee.add(Ye);let at=new r(new ce(7.8,2,4.8),t);at.position.set(oo,15.8,eo),at.rotation.y=-de*po*.7,Ee.add(at);let ft=new r(new ce(8.4,1.2,5.4),t);if(ft.position.set(oo,17,eo),ft.rotation.y=-de*po*.7,Ee.add(ft),go<Xe-1){let Ae=(go+1)/(Xe-1),Bt=nt+Ae*(Q-nt),Xt=(po+Bt)/2,Zt=Ge+de*(Math.sin(Xt)*et),to=(1-Math.cos(Xt))*(et*.7),qt=new r(new ce(5.2,.6,1.2),t);qt.position.set(Zt,5.2,to),qt.rotation.y=-de*Xt*.7,Ee.add(qt);for(let Ut=-2;Ut<=2;Ut++){let Mo=Ut*.9,Fo=Zt+Math.cos(Xt*.7)*Mo,_o=to+Math.sin(Xt*.7)*(de*Mo),ko=new r(new F(.35,.45,2.4,8),t);ko.position.set(Fo,3.8,_o),Ee.add(ko)}if(go%2===1){let Ut=se(.55,j);Ut.position.set(Zt,17.6,to),Ee.add(Ut)}else{let Ut=H(.78);Ut.position.set(Zt,5.5,to),Ee.add(Ut)}}}let Ie=Q,We=Ge+de*(Math.sin(Ie)*et+7),$e=(1-Math.cos(Ie))*(et*.7)+2,J=us(14);J.position.set(We,.05,$e),Ee.add(J);let re=new r(new ce(16,15,16),t);re.position.set(We,8.5,$e),re.rotation.y=-de*Ie*.7,Ee.add(re);let ke=new r(new lt(12,6,4),t);ke.rotation.y=Math.PI/4-de*Ie*.7,ke.position.set(We,18.8,$e),Ee.add(ke);let Le=new r(new rt(1.4,12,12),a);Le.position.set(We,22.8,$e),Ee.add(Le);let Te=se(.85,j);Te.position.set(We,23.6,$e),Ee.add(Te);let Re=document.createElement("canvas");Re.width=512,Re.height=128;let he=Re.getContext("2d");he.scale(.25,.25);let Be=he.createLinearGradient(0,0,0,512);Be.addColorStop(0,"#0c1810"),Be.addColorStop(.5,"#16281a"),Be.addColorStop(1,"#0c1810"),he.fillStyle=Be,he.fillRect(0,0,2048,512),he.strokeStyle="#d4af37",he.lineWidth=12,he.strokeRect(16,16,2016,480),he.strokeStyle="#f8db70",he.lineWidth=4,he.strokeRect(32,32,1984,448),he.fillStyle="#f8db70",[[48,48],[2e3,48],[48,464],[2e3,464]].forEach(([go,zo])=>{he.beginPath(),he.arc(go,zo,14,0,Math.PI*2),he.fill(),he.strokeStyle="#d4af37",he.lineWidth=3,he.stroke()}),he.textAlign="center",he.textBaseline="middle",he.font='bold 112px "Cinzel", "Georgia", "Times New Roman", serif',he.fillStyle="rgba(0, 0, 0, 0.85)",he.fillText("WELCOME TO ETERNAL VALLEY",1027,180);let He=he.createLinearGradient(0,100,0,240);He.addColorStop(0,"#ffffff"),He.addColorStop(.3,"#fff4cc"),He.addColorStop(.6,"#f8db70"),He.addColorStop(1,"#d4af37"),he.fillStyle=He,he.fillText("WELCOME TO ETERNAL VALLEY",1024,175),he.font='600 76px "Cinzel", "Georgia", "Times New Roman", serif',he.fillStyle="rgba(0, 0, 0, 0.85)",he.fillText("\u2726   WHERE LOVE LIVES FOREVER   \u2726",1026,339);let Je=he.createLinearGradient(0,280,0,380);Je.addColorStop(0,"#fff4cc"),Je.addColorStop(.6,"#f8db70"),Je.addColorStop(1,"#aa8218"),he.fillStyle=Je,he.fillText("\u2726   WHERE LOVE LIVES FOREVER   \u2726",1024,335);let it=new Kt(Re);it.anisotropy=16;let wt=new ot({map:it,emissiveMap:it,emissive:new Me(16768880),emissiveIntensity:.9,roughness:.28,metalness:.65}),bt=new r(new ct(36,1.8),wt),fo=nt+.45*(Q-nt),Qt=Ge+de*(Math.sin(fo)*et),fs=(1-Math.cos(fo))*(et*.7);return bt.position.set(Qt,15.8,fs+2.8),bt.rotation.y=-de*fo*.7,Ee.add(bt),Ee};e.add(Dt(!1),Dt(!0));let wo=new vo(16761446,3.5,95,1.5);wo.position.set(0,18,0),e.add(wo),e.traverse(j=>{j.isMesh&&(j.castShadow=!0,j.receiveShadow=!0)}),e.position.set(o,n,s),this.world.scene.add(e)}_rainbowBridge(){this._rainbowShaders=[];let{x:e,z:o}=K.bridge,s=new qe,n=ho("honedCarraraMarble",{repeat:1.5,color:16776952,roughness:.1,metalness:.05,physical:!0,clearcoat:.5,clearcoatRoughness:.15}),t=pe.flagstone(3.2);t.normalScale&&t.normalScale.set(2,2);let a=pe.limestoneDark(1.8);a.color.setHex(8681830),a.roughness=.9,a.metalness=0,a.normalScale.set(2.5,2.5),a.aoMapIntensity=1.8;let u=pe.gold(1),f=pe.verdigrisBronze(1),c=new ot({color:14677247,roughness:.04,metalness:.1,transparent:!0,logarithmicDepthBuffer:!0,opacity:.78,envMapIntensity:2.2}),p=new ot({color:13168895,roughness:.04,metalness:.1,transparent:!0,logarithmicDepthBuffer:!0,opacity:.8,envMapIntensity:2.4,side:gt});for(let[Q,Ge]of[[-60,-70],[60,70]]){let Ie=o+(Q+Ge)*.5,We=Q<0?21.65:26.65,$e=ze(e,Ie),J=Math.max(2,We-$e+2),re=Yt(new ce(34,J,Math.abs(Ge-Q)+2),.06,.18,42),ke=new r(re,a);ke.position.set(e,$e+J*.5-1,Ie);let Le=us(42);Le.position.set(e,$e+.1,Ie),s.add(Le),ke.receiveShadow=ke.castShadow=!0,s.add(ke);for(let Te of[-1,1]){let Re=Yt(new ce(3.6,4.8,3.6),.08,.22,Te*77),he=new r(Re,n);he.position.set(e+Te*16.8,We+2.4-.55,o+Ge),he.castShadow=he.receiveShadow=!0,s.add(he);let Be=new r(new rt(.9,12,12),u);Be.position.set(e+Te*16.8,We+4.8-.55,o+Ge),Be.castShadow=!0,s.add(Be)}}let w=28,b=[],x=[],V=[],y=[],H=[],M=new _t,L=new _t,T=new _t;for(let Q=0;Q<w;Q++){let Ge=Q/(w-1),Ie=o-60+Ge*120,We=this.world._deckY(Ie),$e=-Math.cos(Ge*Math.PI)*.15;M.makeRotationX($e),L.makeTranslation(e,We,Ie),T.multiplyMatrices(L,M);let J=Yt(new ce(32,1.4,120/w+.8),.09,.22,Q*7);Ko(J,We-1),J.applyMatrix4(T),b.push(J);let re=new ce(1.2,.08,120/w+.4);if(L.makeTranslation(e,We+.74,Ie),T.multiplyMatrices(L,M),re.applyMatrix4(T),x.push(re),Q%2===0)for(let ke of[-6,6]){let Le=new no(.35,0);L.makeTranslation(e+ke,We+.75,Ie),T.multiplyMatrices(L,M),Le.applyMatrix4(T),V.push(Le)}for(let ke of[-1,1]){let Le=new ce(1.6,.8,110/w+.9);L.makeTranslation(e+ke*15,We+1.1,Ie),T.multiplyMatrices(L,M),Le.applyMatrix4(T),y.push(Le);for(let he=-1;he<=1;he++){let Be=Ie+he*(120/(w*3)),He=this.world._deckY(Be)||We,Je=new F(.26,.36,1.8,8);L.makeTranslation(e+ke*15,He+2.3,Be),T.multiplyMatrices(L,M),Je.applyMatrix4(T),H.push(Je)}let Te=new ce(1.6,.6,120/w+.9);L.makeTranslation(e+ke*15,We+3.4,Ie),T.multiplyMatrices(L,M),Te.applyMatrix4(T),y.push(Te);let Re=new ce(1.4,.25,120/w+.8);L.makeTranslation(e+ke*15,We+3.8,Ie),T.multiplyMatrices(L,M),Re.applyMatrix4(T),V.push(Re)}}let N=ao(b,!1);if(N){let Q=new r(N,t);Q.castShadow=Q.receiveShadow=!0,s.add(Q)}let q=ao(x,!1);q&&s.add(new r(q,new ot({color:16774092,emissive:16768880,emissiveIntensity:.85,roughness:.2,metalness:.8})));let $=ao(V,!1);$&&s.add(new r($,u));let Y=ao(y,!1);if(Y){let Q=new r(Y,n);Q.castShadow=Q.receiveShadow=!0,s.add(Q)}let k=ao(H,!1);if(k){let Q=new r(k,c);Q.castShadow=!0,s.add(Q)}for(let Q of[-1,1])for(let Ge of[.04,.1,.9,.96]){let Ie=o-60+Ge*120,We=this.world._deckY(Ie),$e=Math.max(1,We-(K.waterLevel-2)),J=Yt(new ce(3.6,$e,8.5),.08,.26,Math.floor(Ge*99));Ko(J,K.waterLevel-2);let re=new r(J,n);re.position.set(e+Q*14.8,K.waterLevel-2+$e/2,Ie),re.castShadow=re.receiveShadow=!0,s.add(re)}for(let Q of[-14.5,0,14.5]){let Ge=[];for(let re=0;re<=24;re++){let ke=re/24,Le=o-60+ke*120,Te=this.world._deckY(Le),Re=1.4+Math.sin(ke*Math.PI)*.8;Ge.push(new ht(e+Q,Te-Re,Le))}let We=new It(Ge),$e=Yt(new Jt(We,32,1.2,8,!1),.07,.24,Math.floor(Q+50)),J=new r($e,n);J.castShadow=J.receiveShadow=!0,s.add(J)}let h=document.createElement("canvas");h.width=h.height=128;let v=h.getContext("2d"),_=v.createRadialGradient(64,64,0,64,64,64);_.addColorStop(0,"rgba(255, 235, 150, 1.0)"),_.addColorStop(.25,"rgba(255, 180, 50, 0.85)"),_.addColorStop(.6,"rgba(255, 130, 20, 0.35)"),_.addColorStop(1,"rgba(255, 100, 0, 0.0)"),v.fillStyle=_,v.fillRect(0,0,128,128);let g=new Kt(h),i=new Ss({map:g,color:16765286,blending:Ht,transparent:!0,logarithmicDepthBuffer:!0,opacity:.95,depthWrite:!1}),S=new ot({color:16774876,emissive:16755236,emissiveIntensity:3.8,roughness:.15,metalness:.1}),C=new Ct({color:16775914}),O=[[e-15,o-56],[e+15,o-56],[e-15,o+56],[e+15,o+56]];for(let[Q,Ge]of O){let Ie=this.world._deckY(Ge)||2,We=new qe;We.position.set(Q,Ie+2.5,Ge);let $e=new r(new F(1,1.4,2.4,8),n);$e.position.y=1.2,We.add($e);let J=new r(new F(.45,.55,4.8,8),f);J.position.y=4.4,We.add(J);let re=new r(new Vt(1.4,0),S);re.position.y=7.2,We.add(re);let ke=new r(new rt(.65,8,8),C);ke.position.y=7.2,We.add(ke);let Le=new as(i);Le.position.y=7.2,Le.scale.set(7.5,7.5,1),We.add(Le);let Te=new r(new lt(1.6,1.4,6),u);Te.position.y=8.4,We.add(Te),s.add(We)}let te=[o-28,o,o+28];for(let Q of te){let Ge=this.world._deckY(Q);for(let Ie of[-1,1]){let We=new qe;We.position.set(e+Ie*15,Ge+3.8,Q);let $e=new r(new Vt(.9,0),S);$e.position.y=.9,We.add($e);let J=new r(new rt(.45,8,8),C);J.position.y=.9,We.add(J);let re=new as(i);re.position.y=.9,re.scale.set(5,5,1),We.add(re),s.add(We)}}let m=this.world._deckY?this.world._deckY(o):14.8,E=ze(e+24,o),R=new qe;R.position.set(e+24,m,o);let P=Math.max(.1,m-E),oe=new r(new F(15.2,16.5,P,32),a);oe.position.y=-P/2,oe.castShadow=!0,oe.receiveShadow=!0,R.add(oe);let ne=new r(new F(14,15.2,1.6,32),n);ne.position.y=.8,ne.receiveShadow=!0,R.add(ne);let se=new r(new F(12.6,13.4,1.2,32),n);se.position.y=2.2,se.receiveShadow=!0,R.add(se);for(let Q=0;Q<8;Q++){let Ge=new r(new ce(.35,.08,10.5),u);Ge.position.y=2.85,Ge.rotation.y=Q*Math.PI/8,R.add(Ge)}let ae=new r(new F(2.2,2.2,.1,16),u);ae.position.y=2.86,R.add(ae);let I=8;for(let Q=0;Q<I;Q++){let Ge=Q/I*Math.PI*2,Ie=Math.cos(Ge)*10.5,We=Math.sin(Ge)*10.5,$e=new r(new F(.65,.8,8.5,16),n);$e.position.set(Ie,2.8+4.25,We),$e.castShadow=!0,R.add($e);let J=new r(new ce(2,.8,2),n);J.position.set(Ie,3.2,We),R.add(J);let re=new r(new ce(2.2,1,2.2),n);re.position.set(Ie,2.8+8.2,We),R.add(re);let ke=new r(new dt(1.1,.26,8,16),u);if(ke.rotation.x=Math.PI/2,ke.position.set(Ie,2.8+8.1,We),R.add(ke),Q!==4){let Le=(Q+1)/I*Math.PI*2,Te=(Ge+Le)/2,Re=Math.cos(Te)*10.5,he=Math.sin(Te)*10.5,Be=new r(new ce(3.6,.5,.8),n);Be.position.set(Re,5,he),Be.rotation.y=-Te+Math.PI/2,R.add(Be);for(let He=-1;He<=1;He++){let Je=Re+Math.cos(Te+Math.PI/2)*(He*.9),it=he+Math.sin(Te+Math.PI/2)*(He*.9),wt=new r(new F(.18,.24,1.5,8),c);wt.position.set(Je,3.8,it),R.add(wt)}}}let Z=new r(new dt(10.5,.85,12,32),n);Z.rotation.x=Math.PI/2,Z.position.y=2.8+9,R.add(Z);let ie=new r(new dt(10.6,.22,8,32),u);ie.rotation.x=Math.PI/2,ie.position.y=2.8+9.6,R.add(ie);let ve=new r(new rt(10.4,32,24,0,Math.PI*2,0,Math.PI*.5),p);ve.position.y=2.8+9.2,R.add(ve);for(let Q=0;Q<8;Q++){let Ge=Q/8*Math.PI,Ie=new r(new dt(10.45,.18,8,24,Math.PI),u);Ie.rotation.y=Ge,Ie.position.y=2.8+9.2,R.add(Ie)}let De=new r(new no(1.8,0),u);De.position.y=2.8+20.2,R.add(De);for(let Q=0;Q<8;Q++){let Ge=Q/8*Math.PI*2,Ie=new r(new lt(.35,3.2,4),u);Ie.rotation.z=-Ge+Math.PI/2,Ie.position.set(Math.cos(Ge)*2.2,2.8+20.2+Math.sin(Ge)*.4,Math.sin(Ge)*2.2),R.add(Ie)}let Ue=new r(new F(3.6,4.2,1.8,24),u);Ue.position.y=3.7,Ue.castShadow=!0,R.add(Ue);let Ke=this._buildHuskyMesh();Ke.scale.setScalar(1.65),Ke.position.set(0,4.6,0),Ke.rotation.y=Math.PI*.92,R.add(Ke);let U=[16728193,16766287,16777215,16740419,12216520];for(let Q=0;Q<24;Q++){let Ge=Q/24*Math.PI*2,Ie=3.2+Q%3*.35,We=new ot({color:U[Q%U.length],roughness:.6,metalness:.05}),$e=new rt(.3,8,6);$e.scale(1,.4,1);let J=new r($e,We);J.position.set(Math.cos(Ge)*Ie,4.62,Math.sin(Ge)*Ie),R.add(J)}let xe=new r(new rt(3.4,32,28),p);xe.position.set(0,7.2,0),R.add(xe);let Ce=48,Pe=new Et,B=new Float32Array(Ce*3);for(let Q=0;Q<Ce;Q++){let Ge=Q/Ce*Math.PI*2,Ie=4.2+Math.sin(Q*3.7)*.5;B[Q*3]=Math.cos(Ge)*Ie,B[Q*3+1]=7.2+Math.sin(Ge*2)*.8,B[Q*3+2]=Math.sin(Ge)*Ie}Pe.setAttribute("position",new tt(B,3));let X=new Cs({color:6809849,size:.45,transparent:!0,logarithmicDepthBuffer:!0,opacity:.9,blending:Ht}),G=new co(Pe,X);R.add(G),this._kayaStardust=G;let D=new vo(7920890,3.8,140);D.position.set(0,7.5,0),R.add(D),s.add(R);let z=new qe;z.position.set(e,2,o);for(let Q=-24;Q<=24;Q+=4){let Ge=this._makeRainbowArc(95,145,.22*(1-Math.abs(Q)/32),!1);Ge.position.z=Q,z.add(Ge),this._rainbowShaders.push(Ge.material)}let W=[-75,-60,-45,-30,-15,15,30,45,60,75,90,-90];for(let Q of W){let Ge=Q*Math.PI/180,Ie=this._makeRainbowArc(95,145,.16*Math.cos(Ge*.4),!1);Ie.rotation.y=Ge,z.add(Ie),this._rainbowShaders.push(Ie.material)}let ee=[98,106,114,122,130,138,144];for(let Q of ee){let Ge=this._createArchedRibbon(Q,44,120,4),Ie=this._makeRainbowArc(95,145,.14,!1,Ge);z.add(Ie),this._rainbowShaders.push(Ie.material)}s.add(z);let ue=new qe;ue.position.set(e,2,o-6);for(let Q=-16;Q<=16;Q+=4){let Ge=this._makeRainbowArc(150,180,.08*(1-Math.abs(Q)/22),!0);Ge.position.z=Q,ue.add(Ge),this._rainbowShaders.push(Ge.material)}for(let Q of[-60,-35,0,35,60,90]){let Ge=Q*Math.PI/180,Ie=this._makeRainbowArc(150,180,.065,!0);Ie.rotation.y=Ge,ue.add(Ie),this._rainbowShaders.push(Ie.material)}for(let Q of[158,172]){let Ge=this._createArchedRibbon(Q,34,100,3),Ie=this._makeRainbowArc(150,180,.05,!0,Ge);ue.add(Ie),this._rainbowShaders.push(Ie.material)}s.add(ue);for(let Q of[0,Math.PI*.25,Math.PI*.5]){let Ge=this._makeRainbowArc(85,155,.045,!1);Ge.position.set(e,2,o-.5),Ge.rotation.y=Q,s.add(Ge),this._rainbowShaders.push(Ge.material)}let ge=240,we=new Float32Array(ge*3),_e=new Float32Array(ge*3),Ze=new Float32Array(ge),Oe=yt(882244),st=new Me;for(let Q=0;Q<ge;Q++){let Ie=Oe()*Math.PI,We=104+Oe()*28;we[Q*3]=e+Math.cos(Ie)*We,we[Q*3+1]=2+Math.sin(Ie)*We,we[Q*3+2]=o+(Oe()-.5)*14,st.setHSL(.12+Oe()*.12,.9,.8+Oe()*.2),_e[Q*3]=st.r,_e[Q*3+1]=st.g,_e[Q*3+2]=st.b,Ze[Q]=(.4+Oe()*.6)*18}let vt=new Et;vt.setAttribute("position",new tt(we,3)),vt.setAttribute("color",new tt(_e,3)),vt.setAttribute("size",new tt(Ze,1));let At=new Mt({transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,fog:!1,blending:Ht,uniforms:{uTex:{value:this.world.lighting._starSprite()},uTime:{value:0},uOpacity:{value:.85}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        attribute float size; varying vec3 vColor; varying float vAlpha; uniform float uTime;
        void main(){
          vColor = color;
          vec3 p = position;
          p.y += sin(uTime * 1.4 + position.x * 0.05 + position.z * 0.03) * 1.5;
          vAlpha = 0.5 + 0.5 * sin(uTime * 2.5 + position.x * 0.08);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = min(68.0, size * (125.0 / -mv.z));
          gl_Position = projectionMatrix * mv;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform sampler2D uTex; uniform float uOpacity; varying vec3 vColor; varying float vAlpha;
        void main(){
          vec4 t = texture2D(uTex, gl_PointCoord);
          gl_FragColor = vec4(vColor * 1.25, t.a * uOpacity * vAlpha);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,vertexColors:!0});this._stardustMat=At,s.add(new co(vt,At));let pt=140,Tt=new Float32Array(pt*3),xt=new Float32Array(pt*3),Pt=new Float32Array(pt),St=new Float32Array(pt),Gt=yt(551177),Nt=new Me;for(let Q=0;Q<pt;Q++){let Ge=Gt()<.5?-1:1,Ie=(Gt()-.5)*104,We=o+Ie,$e=(this.world._deckY(We)||2)+3+Gt()*3.5,J=e+Ge*(14.5+Gt()*2.5);Tt[Q*3]=J,Tt[Q*3+1]=$e,Tt[Q*3+2]=We,Nt.setHSL(.11+Gt()*.14,.85,.75+Gt()*.2),xt[Q*3]=Nt.r,xt[Q*3+1]=Nt.g,xt[Q*3+2]=Nt.b,Pt[Q]=Gt()*Math.PI*2,St[Q]=.8+Gt()*1.4}let zt=new Et;zt.setAttribute("position",new tt(Tt,3)),zt.setAttribute("color",new tt(xt,3)),zt.setAttribute("aPhase",new tt(Pt,1)),zt.setAttribute("aSpeed",new tt(St,1));let Dt=new Mt({transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,fog:!1,blending:Ht,uniforms:{uTex:{value:this.world.lighting._starSprite()},uTime:{value:0},uOpacity:{value:.9}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        attribute float aPhase;
        attribute float aSpeed;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;

        void main() {
          vColor = color;
          vec3 p = position;
          p.y += sin(uTime * aSpeed + aPhase) * 0.65;
          p.x += cos(uTime * (aSpeed * 0.7) + aPhase) * 0.45;
          p.z += sin(uTime * (aSpeed * 0.5) + aPhase * 1.5) * 0.45;
          
          vAlpha = 0.45 + 0.55 * sin(uTime * (aSpeed * 1.8) + aPhase);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = min(48.0, 85.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform sampler2D uTex;
        uniform float uOpacity;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          vec4 t = texture2D(uTex, gl_PointCoord);
          gl_FragColor = vec4(vColor * 1.4, t.a * uOpacity * vAlpha);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `,vertexColors:!0});this._balustradeMoteMat=Dt,s.add(new co(zt,Dt));let wo=new ot({color:16317439,emissive:1714230,emissiveIntensity:.75,roughness:.1,metalness:.08,transmission:.55,thickness:1.2,ior:1.52,iridescence:1,iridescenceIOR:1.62,iridescenceThicknessRange:[240,720],transparent:!0,opacity:.92,side:gt}),j=[],Ee=[],de=10;for(let Q of[-16.2,16.2])for(let Ge=0;Ge<de;Ge++){let Ie=(Ge+.05)/de,We=(Ge+.95)/de,$e=o-54+Ie*108,J=o-54+We*108,re=($e+J)*.5,ke=this.world._deckY(re),Le=K.waterLevel+1.2,Te=Math.max(2.5,ke-Le);for(let Je of[$e,J]){let it=new F(.38,.46,Te,8);it.translate(e+Q,Le+Te*.5,Je),j.push(it)}let Re=Math.abs(J-$e),he=Re*.52,Be=new dt(he,.3,6,12,Math.PI);Be.rotateY(Math.PI/2),Be.translate(e+Q,ke-.8,re),j.push(Be);let He=new ct(Re*.88,Te*.75);He.rotateY(Math.PI/2),He.translate(e+Q,Le+Te*.45,re),Ee.push(He)}let Xe=ao(j,!1);if(Xe){let Q=new r(Xe,n);Q.castShadow=Q.receiveShadow=!0,Q.frustumCulled=!1,s.add(Q)}let et=ao(Ee,!1);if(et){let Q=new r(et,wo);Q.frustumCulled=!1,s.add(Q)}let nt=this._makeRainbowWaterReflection(e,o);s.add(nt),s.traverse(Q=>{Q.frustumCulled=!1}),this.world.scene.add(s)}_rainbow(){return this._rainbowBridge()}_createArchedRibbon(e,o,s=120,n=4){let t=[],a=[],l=[];for(let c=0;c<=n;c++){let p=c/n,w=-o*.5+p*o;for(let b=0;b<=s;b++){let x=b/s,V=x*Math.PI,y=e*Math.cos(V),H=e*Math.sin(V);t.push(y,H,w),a.push(x,p)}}let u=s+1;for(let c=0;c<n;c++)for(let p=0;p<s;p++){let w=c*u+p,b=(c+1)*u+p,x=(c+1)*u+(p+1),V=c*u+(p+1);l.push(w,b,V),l.push(b,x,V)}let f=new Et;return f.setAttribute("position",new mt(t,3)),f.setAttribute("uv",new mt(a,2)),f.setIndex(l),f.computeVertexNormals(),f}_makeRainbowWaterReflection(e,o){let s=new ct(160,110,32,32);s.rotateX(-Math.PI/2);let n=new Mt({transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:gt,blending:Ht,fog:!1,uniforms:{uOpacity:{value:.65},uTime:{value:0}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        varying vec3 vP;
        varying vec2 vUv;
        void main() {
          vP = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        varying vec3 vP;
        varying vec2 vUv;
        uniform float uOpacity, uTime;

        vec3 wavelengthToRGB(float nm) {
          float r = 0.0, g = 0.0, b = 0.0;
          if (nm >= 380.0 && nm < 440.0) {
            r = -(nm - 440.0) / (440.0 - 380.0) * 0.65; b = 1.0;
          } else if (nm >= 440.0 && nm < 490.0) {
            g = (nm - 440.0) / (490.0 - 440.0); b = 1.0;
          } else if (nm >= 490.0 && nm < 510.0) {
            g = 1.0; b = -(nm - 510.0) / (510.0 - 490.0);
          } else if (nm >= 510.0 && nm < 580.0) {
            r = (nm - 510.0) / (580.0 - 510.0); g = 1.0;
          } else if (nm >= 580.0 && nm < 645.0) {
            r = 1.0; g = -(nm - 645.0) / (645.0 - 580.0);
          } else if (nm >= 645.0 && nm <= 700.0) {
            r = 1.0;
          }
          return vec3(r, g, b);
        }

        void main() {
          // Elliptical reflection arc geometry on river surface
          float rx = vP.x * 0.72;
          float rz = vP.z * 1.35;
          float dist = sqrt(rx * rx + rz * rz);
          float t = clamp((dist - 18.0) / 46.0, 0.0, 1.0);

          float lambda = 405.0 + t * 245.0; // 405nm (Violet) -> 650nm (Red)
          vec3 col = wavelengthToRGB(lambda);

          // Caustic wave distortion
          float wave = sin(vP.x * 0.35 + uTime * 1.8) * cos(vP.z * 0.45 + uTime * 1.5);
          float envelope = sin(t * 3.14159265);
          float falloff = 1.0 - smoothstep(40.0, 72.0, dist);

          float alpha = uOpacity * envelope * falloff * (0.85 + 0.15 * wave);
          gl_FragColor = vec4(col * 1.28, alpha);
          #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `});n.userData={baseOpacity:.65};let t=new r(s,n);return t.position.set(e,K.waterLevel+.08,o),t.frustumCulled=!1,this._rainbowWaterShader=n,this._rainbowShaders.push(n),t}_makeRainbowArc(e,o,s,n=!1,t=null){let a=t||new bo(e,o,160,12,0,Math.PI),l=new Mt({transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:gt,blending:Ht,fog:!1,uniforms:{uOpacity:{value:s},uTime:{value:0},uR0:{value:e},uR1:{value:o},uIsSecondary:{value:n?1:0}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        varying vec3 vP;
        void main(){
          vP = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        varying vec3 vP;
        uniform float uOpacity, uTime, uR0, uR1, uIsSecondary;

        // Physically accurate optical spectral wavelength dispersion (400nm to 650nm)
        vec3 wavelengthToRGB(float nm) {
          float r = 0.0, g = 0.0, b = 0.0;
          if (nm >= 380.0 && nm < 440.0) {
            r = -(nm - 440.0) / (440.0 - 380.0) * 0.65;
            b = 1.0;
          } else if (nm >= 440.0 && nm < 490.0) {
            g = (nm - 440.0) / (490.0 - 440.0);
            b = 1.0;
          } else if (nm >= 490.0 && nm < 510.0) {
            g = 1.0;
            b = -(nm - 510.0) / (510.0 - 490.0);
          } else if (nm >= 510.0 && nm < 580.0) {
            r = (nm - 510.0) / (580.0 - 510.0);
            g = 1.0;
          } else if (nm >= 580.0 && nm < 645.0) {
            r = 1.0;
            g = -(nm - 645.0) / (645.0 - 580.0);
          } else if (nm >= 645.0 && nm <= 700.0) {
            r = 1.0;
          }
          float factor = 1.0;
          if (nm < 420.0) factor = 0.35 + 0.65 * (nm - 380.0) / (420.0 - 380.0);
          if (nm > 645.0) factor = 0.35 + 0.65 * (700.0 - nm) / (700.0 - 645.0);
          return vec3(r, g, b) * factor;
        }

        vec3 spectralColor(float t) {
          if (uIsSecondary > 0.5) t = 1.0 - t;
          float lambda = 405.0 + clamp(t, 0.0, 1.0) * 245.0; // 405nm (Violet) -> 650nm (Red)
          return wavelengthToRGB(lambda);
        }

        void main(){
          float r = length(vP.xy);
          float t = clamp((r - uR0) / (uR1 - uR0), 0.0, 1.0);
          vec3 col = spectralColor(t);

          // Gaussian envelope across the optical arc band
          float band = sin(t * 3.14159265);
          float edge = smoothstep(0.0, 0.12, t) * (1.0 - smoothstep(0.88, 1.0, t));

          // Supernumerary optical wave interference fringes along the inner violet arc (Airy diffraction pattern)
          float supernumerary = 0.0;
          vec3 fringeColor = vec3(0.0);
          if (uIsSecondary < 0.5) {
            float fringePhase = (1.0 - t) * 36.0;
            float fringeWave = sin(fringePhase) * 0.5 + 0.5;
            float fringeDamp = smoothstep(0.35, 0.02, t);
            supernumerary = fringeWave * fringeDamp * 0.26;
            fringeColor = mix(vec3(0.82, 0.30, 0.72), vec3(0.20, 0.90, 0.52), sin(fringePhase * 0.5) * 0.5 + 0.5) * supernumerary;
          }

          float shimmer = 0.92 + 0.08 * sin(uTime * 0.85 + vP.x * 0.015 + t * 4.0);
          float foot = smoothstep(-6.0, 32.0, vP.y);

          vec3 finalRgb = (col + fringeColor) * (1.18 + supernumerary * 0.5);
          float alpha = uOpacity * (band + supernumerary * 0.7) * edge * shimmer * foot;
          gl_FragColor = vec4(finalRgb, alpha);
          #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `});l.userData={baseOpacity:s};let u=new r(a,l);return u.frustumCulled=!1,u}_pawprints(){let e=this.world.assetLoader._pawTexture();this.pawMat=new ot({color:2235412,alphaMap:e,transparent:!0,logarithmicDepthBuffer:!0,opacity:.28,roughness:.98,metalness:0,depthWrite:!1,side:gt});let o=new ct(4.2,4.2),s=[];for(let a=850;a>60;a-=17)s.push(a);let n=new ut(o,this.pawMat,s.length),t=new Lt;s.forEach((a,l)=>{let u=(l%2?4.5:-4.5)+Math.sin(a*.02)*2,f=this.world._deckY(a),c=f!==null?f+1.3:Math.max(ze(u,a),K.waterLevel+.4)+.5;t.position.set(u,c,a),t.rotation.set(-Math.PI/2,0,Math.PI+(l%2?-.12:.12)),t.updateMatrix(),n.setMatrixAt(l,t.matrix)}),n.instanceMatrix.needsUpdate=!0,typeof n.computeBoundingSphere=="function"&&n.computeBoundingSphere(),typeof n.computeBoundingBox=="function"&&n.computeBoundingBox(),n.frustumCulled=!1,this.world.scene.add(n),console.log("[world3d] mesh added to scene",performance.now())}async _blooms(){let e=performance.now(),o=()=>performance.now()-e>16?(e=performance.now(),new Promise(H=>setTimeout(H,0))):Promise.resolve(),s=yt(104928),n=new Lt,t=[],a=[],l=[],u=[],f=[{x:-35,z:820,rad:34,count:850},{x:35,z:820,rad:34,count:850},{x:-32,z:640,rad:38,count:900},{x:32,z:640,rad:38,count:900},{x:-28,z:490,rad:32,count:750},{x:28,z:490,rad:32,count:750},{x:-30,z:360,rad:35,count:800},{x:30,z:360,rad:35,count:800},{x:-85,z:120,rad:45,count:1100},{x:85,z:120,rad:45,count:1100},{x:180,z:-140,rad:50,count:1200},{x:-240,z:320,rad:55,count:1300},{x:160,z:380,rad:50,count:1100},{x:-380,z:-120,rad:45,count:950},{x:-440,z:-380,rad:45,count:850}];for(let H of f)for(let M=0;M<H.count;M++){M%500===0&&await o();let L=s()*Math.PI*2,T=Math.sqrt(s())*H.rad,N=H.x+Math.cos(L)*T,q=H.z+Math.sin(L)*T,$=ze(N,q);if($<13.2||$>165||xo(N,q)<2||Math.hypot(N-K.plaza.x,q-K.plaza.z)<K.plaza.r+4)continue;let{dist:Y,y:k}=Hn(N,q);if(Y<42&&$<k+1.2||$<13.5&&N>50&&q<0||s()>.6)continue;let h=.35+s()*.25;n.position.set(N,$,q),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(h),n.updateMatrix();let v=s();v<.28?t.push(n.matrix.clone()):v<.54?a.push(n.matrix.clone()):v<.78?l.push(n.matrix.clone()):u.push(n.matrix.clone())}let c=(H,M,L)=>{if(!L.length)return;H.computeBoundingSphere&&H.computeBoundingSphere();let T=new ut(H,M,L.length);L.forEach((N,q)=>T.setMatrixAt(q,N)),T.instanceMatrix.needsUpdate=!0,typeof T.computeBoundingSphere=="function"&&T.computeBoundingSphere(),typeof T.computeBoundingBox=="function"&&T.computeBoundingBox(),T.castShadow=!1,T.receiveShadow=!1,T.frustumCulled=!1,this.world.scene.add(T)},p=(()=>{let H=[];for(let M=0;M<3;M++){let L=M/3*Math.PI,T=new ct(1.2,1.3);T.translate(0,.65,0),T.rotateY(L),H.push(T)}return je(H,!1)||H[0]})(),w=(()=>{let H=[];for(let M=0;M<3;M++){let L=M/3*Math.PI,T=new ct(.95,1.55);T.translate(0,.775,0),T.rotateY(L),H.push(T)}return je(H,!1)||H[0]})(),b=pe.goldenPoppy();b.alphaTest=.5,b.depthWrite=!0,b.transparent=!1;let x=pe.edelweiss();x.alphaTest=.5,x.depthWrite=!0,x.transparent=!1;let V=pe.lavenderSprig();V.alphaTest=.5,V.depthWrite=!0,V.transparent=!1;let y=pe.forgetMeNot();y.alphaTest=.5,y.depthWrite=!0,y.transparent=!1,this.world._windMaterials&&this.world._windMaterials.push(b,x,V,y),c(p,b,t),c(p,x,a),c(w,V,l),c(p,y,u)}_buildVines(e,o,s,n,t,a){a||(a=pe.leafCard(3496480));let l=[];for(let c=0;c<t;c++){let p=Math.random()*Math.PI*2,w=(Math.random()-.5)*3,b=o+w,x=s+w,V=Math.random()*n*(.2+.8*Math.random()),y=new ct(2.5,2.5),H=Math.cos(p)*b,M=Math.sin(p)*x;Math.abs(Math.cos(p))>Math.abs(Math.sin(p))?(H=Math.sign(Math.cos(p))*b,M=Math.sin(p)*x):(H=Math.cos(p)*b,M=Math.sign(Math.sin(p))*x),y.translate(H,V,M),y.rotateX((Math.random()-.5)*.4),y.rotateY(p+Math.PI/2+(Math.random()-.5)*.4),y.rotateZ((Math.random()-.5)*.4),l.push(y)}let u=je(l,!1)||l[0],f=new r(u,a);f.castShadow=!0,e.add(f)}_buildHuskyMesh(){let e=new qe,o=new ot({color:3685960,roughness:.88,metalness:.02}),s=new ot({color:2369584,roughness:.85,metalness:.02}),n=new ot({color:16580093,roughness:.8,metalness:.01}),t=new ot({color:4900336,roughness:.1,metalness:.15,emissive:3188960,emissiveIntensity:.95}),a=new Ct({color:329224}),l=new ot({color:1184790,roughness:.35,metalness:.05}),u=new ot({color:14710920,roughness:.5,metalness:.02}),f=new ot({color:15250620,roughness:.9}),c=pe.gold(1),p=new qe;p.position.set(0,1.38,0);let w=new F(.58,.74,1.95,16);w.rotateX(Math.PI/2),w.scale(.88,1.15,1);let b=new r(w,o);b.castShadow=!0,p.add(b);let x=new F(.48,.62,.95,14);x.rotateX(Math.PI/2),x.scale(.82,.95,1);let V=new r(x,o);V.position.set(0,.08,-.92),V.castShadow=!0,p.add(V);let y=new rt(.66,16,14);y.scale(.84,1.18,1.25);let H=new r(y,n);H.position.set(0,-.06,.55),H.receiveShadow=!0,p.add(H);let M=new r(new F(.42,.54,1.6,12),n);M.rotateX(Math.PI/2),M.scale.set(.8,.65,1),M.position.set(0,-.32,-.15),p.add(M),e.add(p);let L=new qe;L.position.set(0,1.95,.75);let T=new F(.36,.54,.95,14);T.rotateX(Math.PI/4.2),T.scale(.88,1.05,1);let N=new r(T,o);N.castShadow=!0,L.add(N);let q=new rt(.48,14,12);q.scale(.82,1.15,1.25);let $=new r(q,n);$.position.set(0,-.12,.32),L.add($),e.add(L);let Y=new qe;Y.position.set(0,2.5,1.28);let k=new rt(.46,16,14);k.scale(.92,.98,1.08);let h=new r(k,o);Y.add(h);let v=new rt(.44,14,10,0,Math.PI*2,0,Math.PI*.55);v.scale(.94,.96,1.04),v.translate(0,.04,.02);let _=new r(v,s);Y.add(_);let g=new r(new rt(.42,14,12),n);g.position.set(0,-.06,.16),g.scale.set(.88,.82,.98),Y.add(g),[-.28,.28].forEach(ae=>{let I=new r(new lt(.24,.45,6),n);I.rotation.z=(ae>0?-1:1)*.75,I.rotation.x=-.2,I.position.set(ae,-.1,.18),Y.add(I)});let i=new F(.16,.26,.56,12);i.rotateX(Math.PI/2),i.scale(.92,.85,1);let S=new r(i,n);S.position.set(0,-.1,.54),Y.add(S);let C=new r(new ce(.12,.04,.48),s);C.position.set(0,.04,.54),Y.add(C);let O=new r(new rt(.082,10,8),l);O.scale.set(1.15,.85,1),O.position.set(0,-.04,.84),Y.add(O);let te=new r(new ce(.18,.06,.38),n);te.position.set(0,-.21,.56),te.rotation.x=.08,Y.add(te);let m=new r(new ce(.11,.025,.26),u);m.position.set(0,-.18,.65),m.rotation.x=.14,Y.add(m),[-.17,.17].forEach(ae=>{let I=new r(new dt(.078,.016,6,12,Math.PI*1.2),l);I.rotation.z=(ae>0?-1:1)*.35+Math.PI*.9,I.position.set(ae,.11,.41),Y.add(I);let Z=new r(new rt(.068,12,10),t);Z.scale.set(.85,1.15,.85),Z.position.set(ae,.1,.41),Y.add(Z);let ie=new r(new rt(.032,8,6),a);ie.position.set(ae,.1,.46),Y.add(ie)}),[-.25,.25].forEach(ae=>{let I=new qe;I.position.set(ae,.4,-.04),I.rotation.z=(ae>0?-1:1)*.16,I.rotation.x=-.12;let Z=new r(new lt(.2,.52,4),s);Z.scale.set(.85,1,.42),I.add(Z);let ie=new r(new lt(.14,.42,4),f);ie.scale.set(.75,.9,.32),ie.position.set(0,-.02,.035),I.add(ie);let ve=new r(new rt(.08,6,6),n);ve.scale.set(.6,1.2,.4),ve.position.set(0,-.1,.06),I.add(ve),Y.add(I)}),e.add(Y);let E=new r(new dt(.44,.055,8,20),c);E.rotation.x=Math.PI/3.4,E.position.set(0,1.82,.92),e.add(E);let R=new qe;R.position.set(0,1.55,1.18);let P=new r(new no(.14,0),pe.gold(1));P.scale.set(1,1.2,.35),R.add(P),e.add(R),[{x:-.3,z:.72,isFront:!0},{x:.3,z:.72,isFront:!0},{x:-.32,z:-.74,isFront:!1},{x:.32,z:-.74,isFront:!1}].forEach(ae=>{let I=new qe;if(I.position.set(ae.x,0,ae.z),ae.isFront){let ie=new r(new rt(.24,10,8),o);ie.scale.set(.85,1.2,1),ie.position.set(0,1.15,0),I.add(ie);let ve=new r(new F(.14,.11,.65,8),n);ve.position.set(0,.68,.02),I.add(ve);let De=new r(new F(.1,.095,.35,8),n);De.position.set(0,.28,.04),De.rotation.x=.12,I.add(De)}else{let ie=new r(new rt(.32,12,10),o);ie.scale.set(.85,1.35,1.15),ie.position.set(0,1.12,-.05),I.add(ie);let ve=new r(new F(.14,.11,.65,8),n);ve.position.set(0,.65,-.08),ve.rotation.x=-.22,I.add(ve);let De=new r(new F(.1,.095,.38,8),n);De.position.set(0,.26,.02),I.add(De)}let Z=new r(new rt(.15,10,8),n);Z.scale.set(.92,.55,1.28),Z.position.set(0,.09,.1),Z.castShadow=!0,I.add(Z),e.add(I)});let ne=new qe;ne.position.set(0,1.56,-1.02);let se=9;for(let ae=0;ae<se;ae++){let I=ae/(se-1),Z=I*Math.PI*.98,ie=Math.sin(Z)*1.08,ve=-Math.cos(Z)*.74,De=.28*(1-I*.35)+.08,Ue=new r(new rt(De,10,8),I>.55?n:o);Ue.scale.set(.82,1.15,1.15),Ue.position.set(0,ie,ve),ne.add(Ue)}return e.add(ne),e}_buildKoiMesh(){let e=[],o=(m,E,R,P)=>{let oe=m.attributes.position.count,ne=new Float32Array(oe*3);for(let se=0;se<oe;se++)ne[se*3]=E,ne[se*3+1]=R,ne[se*3+2]=P;return m.setAttribute("color",new tt(ne,3)),m},t=[],a=[],l=[];for(let m=0;m<=36;m++){let E=m/36,R=1.15-2.4*E,P,oe,ne;if(E<.22){let se=E/.22;P=.27*Math.pow(Math.sin(se*Math.PI*.5),.62),oe=.31*Math.pow(Math.sin(se*Math.PI*.5),.72),ne=-.035*(1-se)}else if(E<.52){let se=(E-.22)/.3,ae=Math.sin(se*Math.PI);P=.27+.11*ae,oe=.31+.14*ae,ne=-.035*(1-se*.5)-.03*ae}else{let se=(E-.52)/.48,ae=Math.pow(se,.9);P=(1-ae)*.27+ae*.045,oe=(1-ae)*.31+ae*.085,ne=(1-se)*-.017+se*0}for(let se=0;se<=24;se++){let ae=se/24*Math.PI*2,I=Math.sin(ae),Z=Math.cos(ae),ie=P*I,ve=ne+oe*(Z-.06*I*I);t.push(ie,ve,R),a.push(se/24,E)}}for(let m=0;m<36;m++)for(let E=0;E<24;E++){let R=m*25+E,P=(m+1)*25+E,oe=(m+1)*25+(E+1),ne=m*25+(E+1);l.push(R,P,ne),l.push(P,oe,ne)}let u=new Et;u.setAttribute("position",new mt(t,3)),u.setAttribute("uv",new mt(a,2)),u.setIndex(l),u.computeVertexNormals(),o(u,1,1,1),e.push(u);let f=16,c=12,p=[],w=[],b=[];for(let m=0;m<=f;m++){let E=m/f;for(let R=0;R<=c;R++){let P=R/c*2-1,oe=Math.abs(P),ne=.33*Math.pow(oe,1.4),se=-1.22-E*(.42+ne),ae=.08+E*(.38+.08*(P>0?.05:0)),I=P*ae;p.push(0,I,se),w.push(E,(P+1)*.5)}}for(let m=0;m<f;m++)for(let E=0;E<c;E++){let R=m*(c+1)+E,P=(m+1)*(c+1)+E,oe=(m+1)*(c+1)+(E+1),ne=m*(c+1)+(E+1);b.push(R,P,ne),b.push(P,oe,ne),b.push(ne,P,R),b.push(ne,oe,P)}let x=new Et;x.setAttribute("position",new mt(p,3)),x.setAttribute("uv",new mt(w,2)),x.setIndex(b),x.computeVertexNormals(),o(x,.45,.7,.95),e.push(x);let V=14,y=6,H=[],M=[],L=[];for(let m=0;m<=V;m++){let E=m/V,R=.35-E*.9,P=.28+(R>0?.08:(R+.2)*.1),oe=Math.sin(Math.pow(E,.45)*Math.PI)*.24+(1-E)*.06;for(let ne=0;ne<=y;ne++){let se=ne/y,ae=P+se*oe,I=(1-se)*.015*Math.sin(E*Math.PI);H.push(I,ae,R),M.push(E,se)}}for(let m=0;m<V;m++)for(let E=0;E<y;E++){let R=m*(y+1)+E,P=(m+1)*(y+1)+E,oe=(m+1)*(y+1)+(E+1),ne=m*(y+1)+(E+1);L.push(R,P,ne),L.push(P,oe,ne),L.push(ne,P,R),L.push(ne,oe,P)}let T=new Et;T.setAttribute("position",new mt(H,3)),T.setAttribute("uv",new mt(M,2)),T.setIndex(L),T.computeVertexNormals(),o(T,.45,.7,.95),e.push(T);let N=m=>{let P=[],oe=[],ne=[],se=m?-1:1;for(let I=0;I<=10;I++){let Z=I/10;for(let ie=0;ie<=6;ie++){let ve=ie/6,De=Z*.48,Ue=Z*.32+ve*.15,Ke=Z*.16+(ve-.5)*.05,U=se*(.28+De*Math.cos(.4)+(ve-.5)*.12),xe=-.16-Ke,Ce=.52-Ue;P.push(U,xe,Ce),oe.push(Z,ve)}}for(let I=0;I<10;I++)for(let Z=0;Z<6;Z++){let ie=I*7+Z,ve=(I+1)*7+Z,De=(I+1)*7+(Z+1),Ue=I*7+(Z+1);ne.push(ie,ve,Ue),ne.push(ve,De,Ue),ne.push(Ue,ve,ie),ne.push(Ue,De,ve)}let ae=new Et;return ae.setAttribute("position",new mt(P,3)),ae.setAttribute("uv",new mt(oe,2)),ae.setIndex(ne),ae.computeVertexNormals(),o(ae,.45,.7,.95),ae};e.push(N(!0),N(!1));let q=m=>{let P=[],oe=[],ne=[],se=m?-1:1;for(let I=0;I<=8;I++){let Z=I/8;for(let ie=0;ie<=4;ie++){let ve=ie/4,De=se*(.12+Z*.14+(ve-.5)*.05),Ue=-.36-Z*.12,Ke=-.15-Z*.28-ve*.08;P.push(De,Ue,Ke),oe.push(Z,ve)}}for(let I=0;I<8;I++)for(let Z=0;Z<4;Z++){let ie=I*5+Z,ve=(I+1)*5+Z,De=(I+1)*5+(Z+1),Ue=I*5+(Z+1);ne.push(ie,ve,Ue),ne.push(ve,De,Ue),ne.push(Ue,ve,ie),ne.push(Ue,De,ve)}let ae=new Et;return ae.setAttribute("position",new mt(P,3)),ae.setAttribute("uv",new mt(oe,2)),ae.setIndex(ne),ae.computeVertexNormals(),o(ae,.45,.7,.95),ae};e.push(q(!0),q(!1));let $=8,Y=4,k=[],h=[],v=[];for(let m=0;m<=$;m++){let E=m/$,R=-.65-E*.4,P=-.18-(1-E)*.06,oe=Math.sin(E*Math.PI)*.16;for(let ne=0;ne<=Y;ne++){let se=ne/Y,ae=P-se*oe;k.push(0,ae,R),h.push(E,se)}}for(let m=0;m<$;m++)for(let E=0;E<Y;E++){let R=m*(Y+1)+E,P=(m+1)*(Y+1)+E,oe=(m+1)*(Y+1)+(E+1),ne=m*(Y+1)+(E+1);v.push(R,P,ne),v.push(P,oe,ne),v.push(ne,P,R),v.push(ne,oe,P)}let _=new Et;_.setAttribute("position",new mt(k,3)),_.setAttribute("uv",new mt(h,2)),_.setIndex(v),_.computeVertexNormals(),o(_,.45,.7,.95),e.push(_);let g=m=>{let R=[],P=[],oe=[],ne=m?-1:1;for(let ae=0;ae<=8;ae++){let I=ae/8,Z=ne*(.16+I*.08+Math.sin(I*Math.PI)*.03),ie=-.1-I*.14-Math.sin(I*Math.PI*.5)*.04,ve=1.02-I*.26,De=(1-I*.75)*.012;for(let Ue=0;Ue<=4;Ue++){let Ke=Ue/4*Math.PI*2;R.push(Z+Math.cos(Ke)*De,ie+Math.sin(Ke)*De,ve),P.push(I,Ue/4)}}for(let ae=0;ae<8;ae++)for(let I=0;I<4;I++){let Z=ae*5+I,ie=(ae+1)*5+I,ve=(ae+1)*5+(I+1),De=ae*5+(I+1);oe.push(Z,ie,De),oe.push(ie,ve,De)}let se=new Et;return se.setAttribute("position",new mt(R,3)),se.setAttribute("uv",new mt(P,2)),se.setIndex(oe),se.computeVertexNormals(),o(se,.45,.7,.95),se};e.push(g(!0),g(!1));let i=new rt(.065,12,12);i.scale(.85,1,1.15);let S=i.clone();S.rotateY(-.25),S.translate(-.24,.1,.76),o(S,0,0,0);let C=i.clone();C.rotateY(.25),C.translate(.24,.1,.76),o(C,0,0,0),e.push(S,C);let O=m=>{let R=[],P=[],oe=[],ne=m?-1:1;for(let ae=0;ae<=10;ae++){let I=ae/10,Z=(I-.5)*Math.PI*.75,ie=Math.sin(Z)*.22-.02,ve=.58+Math.cos(Z)*.1,De=ne*(.285+Math.cos(Z)*.02);R.push(De,ie,ve),P.push(0,I),R.push(De*.98,ie,ve-.05),P.push(1,I)}for(let ae=0;ae<10;ae++){let I=ae*2,Z=(ae+1)*2,ie=(ae+1)*2+1,ve=ae*2+1;oe.push(I,Z,ve),oe.push(Z,ie,ve),oe.push(ve,Z,I),oe.push(ve,ie,Z)}let se=new Et;return se.setAttribute("position",new mt(R,3)),se.setAttribute("uv",new mt(P,2)),se.setIndex(oe),se.computeVertexNormals(),o(se,1,1,1),se};return e.push(O(!0),O(!1)),je(e,!1)||u}_buildReefFishMesh(){let e=[],o=(S,C,O,te)=>{let m=S.attributes.position.count,E=new Float32Array(m*3);for(let R=0;R<m;R++)E[R*3]=C,E[R*3+1]=O,E[R*3+2]=te;return S.setAttribute("color",new tt(E,3)),S},t=[],a=[],l=[];for(let S=0;S<=28;S++){let C=S/28,O=.65-1.4*C,te,m,E;if(C<.25){let R=C/.25;te=.16*Math.pow(Math.sin(R*Math.PI*.5),.7),m=.38*Math.pow(Math.sin(R*Math.PI*.5),.6),E=-.02*(1-R)}else if(C<.65){let R=(C-.25)/.4,P=Math.sin(R*Math.PI);te=.16+.06*P,m=.38+.18*P,E=-.02}else{let R=(C-.65)/.35,P=Math.pow(R,.85);te=(1-P)*.16+P*.025,m=(1-P)*.38+P*.055,E=(1-R)*-.02}for(let R=0;R<=20;R++){let P=R/20*Math.PI*2,oe=Math.sin(P),ne=Math.cos(P),se=te*oe,ae=E+m*ne;t.push(se,ae,O),a.push(R/20,C)}}for(let S=0;S<28;S++)for(let C=0;C<20;C++){let O=S*21+C,te=(S+1)*21+C,m=(S+1)*21+(C+1),E=S*21+(C+1);l.push(O,te,E),l.push(te,m,E)}let u=new Et;u.setAttribute("position",new mt(t,3)),u.setAttribute("uv",new mt(a,2)),u.setIndex(l),u.computeVertexNormals(),o(u,1,1,1),e.push(u);let f=10,c=8,p=[],w=[],b=[];for(let S=0;S<=f;S++){let C=S/f;for(let O=0;O<=c;O++){let te=O/c*2-1,m=-.74-C*.4,E=te*(.06+C*.28);p.push(0,E,m),w.push(C,(te+1)*.5)}}for(let S=0;S<f;S++)for(let C=0;C<c;C++){let O=S*(c+1)+C,te=(S+1)*(c+1)+C,m=(S+1)*(c+1)+(C+1),E=S*(c+1)+(C+1);b.push(O,te,E,te,m,E,E,te,O,E,m,te)}let x=new Et;x.setAttribute("position",new mt(p,3)),x.setAttribute("uv",new mt(w,2)),x.setIndex(b),x.computeVertexNormals(),o(x,.45,.7,.95),e.push(x);let V=10,y=4,H=[],M=[],L=[];for(let S=0;S<=V;S++){let C=S/V,O=.25-C*.85,te=.45*Math.sin(Math.PI*(.15+C*.75)),m=.16*Math.sin(C*Math.PI)+(1-C)*.06;for(let E=0;E<=y;E++){let R=E/y;H.push(0,te+R*m,O),M.push(C,R)}}for(let S=0;S<V;S++)for(let C=0;C<y;C++){let O=S*(y+1)+C,te=(S+1)*(y+1)+C,m=(S+1)*(y+1)+(C+1),E=S*(y+1)+(C+1);L.push(O,te,E,te,m,E,E,te,O,E,m,te)}let T=new Et;T.setAttribute("position",new mt(H,3)),T.setAttribute("uv",new mt(M,2)),T.setIndex(L),T.computeVertexNormals(),o(T,.45,.7,.95),e.push(T);let N=10,q=4,$=[],Y=[],k=[];for(let S=0;S<=N;S++){let C=S/N,O=.15-C*.75,te=-.45*Math.sin(Math.PI*(.15+C*.75)),m=.14*Math.sin(C*Math.PI);for(let E=0;E<=q;E++){let R=E/q;$.push(0,te-R*m,O),Y.push(C,R)}}for(let S=0;S<N;S++)for(let C=0;C<q;C++){let O=S*(q+1)+C,te=(S+1)*(q+1)+C,m=(S+1)*(q+1)+(C+1),E=S*(q+1)+(C+1);k.push(O,te,E,te,m,E,E,te,O,E,m,te)}let h=new Et;h.setAttribute("position",new mt($,3)),h.setAttribute("uv",new mt(Y,2)),h.setIndex(k),h.computeVertexNormals(),o(h,.45,.7,.95),e.push(h);let v=new rt(.048,10,10);v.scale(.8,1,1.1);let _=v.clone();_.translate(-.14,.08,.42),o(_,0,0,0);let g=v.clone();return g.translate(.14,.08,.42),o(g,0,0,0),e.push(_,g),je(e,!1)||u}_buildDolphinMesh(){let e=[],o=new F(.01,.55,3.2,28,24,!1);o.rotateX(Math.PI/2);let s=o.attributes.position;for(let c=0;c<s.count;c++){let w=(s.getZ(c)+1.6)/3.2,b,x;if(w>.88){let V=(w-.88)/.12;b=.22*Math.sin(V*Math.PI*.5),x=.18*Math.sin(V*Math.PI*.5)}else if(w>.7){let V=(w-.7)/.18;b=.22+.65*Math.sin(V*Math.PI*.5),x=.18+.82*Math.sin(V*Math.PI*.5)}else if(w>.25){let V=(w-.25)/.45;b=.45+.42*Math.sin(V*Math.PI),x=.5+.5*Math.sin(V*Math.PI)}else{let V=w/.25;b=.12+.33*V,x=.16+.34*V}s.setX(c,s.getX(c)*b),s.setY(c,s.getY(c)*x)}o.computeVertexNormals(),e.push(o);let n=new mo;n.moveTo(0,0),n.bezierCurveTo(-.05,.25,-.18,.52,-.42,.58),n.bezierCurveTo(-.32,.32,-.22,.12,0,0);let t=new Eo(n,{depth:.04,bevelEnabled:!0,bevelThickness:.02,bevelSize:.02,steps:1});t.rotateY(Math.PI/2),t.translate(0,.48,-.2),e.push(t),[-1,1].forEach(c=>{let p=new mo;p.moveTo(0,0),p.bezierCurveTo(.15,-.15,.55,-.42,.78,-.65),p.bezierCurveTo(.55,-.52,.25,-.32,0,0);let w=new Eo(p,{depth:.03,bevelEnabled:!1});w.rotateZ(c*.35),w.rotateY(c*.45),w.translate(c*.42,-.22,.45),e.push(w)});let a=new mo;a.moveTo(0,0),a.bezierCurveTo(.35,-.15,.72,-.35,.95,-.48),a.bezierCurveTo(.65,-.28,.28,-.05,0,-.12),a.bezierCurveTo(-.28,-.05,-.65,-.28,-.95,-.48),a.bezierCurveTo(-.72,-.35,-.35,-.15,0,0);let l=new Eo(a,{depth:.03,bevelEnabled:!1});l.rotateX(Math.PI/2),l.translate(0,0,-1.6),e.push(l),[-1,1].forEach(c=>{let p=new rt(.045,8,8);p.translate(c*.32,.12,.95),e.push(p)});let u=(c,p)=>{let w=c.attributes.position.count,b=new Float32Array(w*3);for(let x=0;x<w;x++)b[x*3]=p?0:1,b[x*3+1]=p?0:1,b[x*3+2]=p?0:1;if(c.setAttribute("color",new tt(b,3)),c.attributes.normal||c.computeVertexNormals(),!c.attributes.uv){let x=new Float32Array(w*2);c.setAttribute("uv",new tt(x,2))}};return e.forEach((c,p)=>u(c,p>=5)),je(e,!1)||o}_buildSharkMesh(){let e=[],o=new F(.01,.58,3.6,28,24,!1);o.rotateX(Math.PI/2);let s=o.attributes.position;for(let p=0;p<s.count;p++){let b=(s.getZ(p)+1.8)/3.6,x,V;if(b>.75){let y=(b-.75)/.25;x=.85*Math.pow(y,.65),V=.65*Math.pow(y,.8)}else if(b>.28){let y=(b-.28)/.47;x=.55+.35*Math.sin(y*Math.PI),V=.52+.4*Math.sin(y*Math.PI)}else{let y=b/.28;x=.14+.41*y,V=.16+.36*y}s.setX(p,s.getX(p)*x),s.setY(p,s.getY(p)*V)}o.computeVertexNormals(),e.push(o);let n=new mo;n.moveTo(0,0),n.lineTo(-.25,.75),n.bezierCurveTo(-.35,.55,-.45,.25,-.55,.05),n.lineTo(0,0);let t=new Eo(n,{depth:.05,bevelEnabled:!0,bevelThickness:.02,bevelSize:.02,steps:1});t.rotateY(Math.PI/2),t.translate(0,.52,.05),e.push(t),[-1,1].forEach(p=>{let w=new mo;w.moveTo(0,0),w.lineTo(p*.95,-.75),w.bezierCurveTo(p*.65,-.62,p*.35,-.38,0,0);let b=new Eo(w,{depth:.03,bevelEnabled:!1});b.rotateX(.15),b.translate(0,-.18,.55),e.push(b)});let a=new mo;a.moveTo(0,0),a.lineTo(-.85,.85),a.bezierCurveTo(-.72,.45,-.45,.15,-.32,0),a.lineTo(-.55,-.45),a.bezierCurveTo(-.38,-.28,-.18,-.12,0,0);let l=new Eo(a,{depth:.04,bevelEnabled:!1});l.rotateY(-Math.PI/2),l.translate(0,0,-1.8),e.push(l);let u=t.clone();u.scale(.35,.35,.35),u.translate(0,-.32,-1.05),e.push(u),[-1,1].forEach(p=>{let w=new rt(.045,8,8);w.translate(p*.35,.08,1.15),e.push(w)});let f=(p,w)=>{let b=p.attributes.position.count,x=new Float32Array(b*3);for(let V=0;V<b;V++)x[V*3]=w?0:1,x[V*3+1]=w?0:1,x[V*3+2]=w?0:1;if(p.setAttribute("color",new tt(x,3)),p.attributes.normal||p.computeVertexNormals(),!p.attributes.uv){let V=new Float32Array(b*2);p.setAttribute("uv",new tt(V,2))}};return e.forEach((p,w)=>f(p,w>=6)),je(e,!1)||o}_buildSeaTurtleMesh(){let e=[],o=new rt(.6,16,12);o.scale(1,.4,1.2),e.push(o);let s=new rt(.2,8,8);s.scale(1,.6,1.2),s.translate(0,0,.8),e.push(s);let n=new ce(.8,.05,.3);n.translate(-.8,0,.4);let t=n.clone();return t.translate(1.6,0,0),e.push(n,t),je(e,!1)||e[0]||o}_buildMantaRayMesh(){let e=[],o=new F(0,1.2,1.2,4);o.rotateY(Math.PI/4),o.scale(2.5,.1,1.2),e.push(o);let s=new F(.02,.02,2.5);return s.rotateX(Math.PI/2),s.translate(0,0,-1.8),e.push(s),je(e,!1)||e[0]||o}_buildBronzeBull(){let e=new qe,o=pe.bronze(1.2),s=pe.gold(1),n=new F(.9,1.05,3.2,14);n.rotateX(Math.PI/2);let t=new r(n,o);t.position.y=1.45,t.castShadow=!0,e.add(t);let a=new rt(1.15,14,12);a.scale(.92,1.15,1.35);let l=new r(a,o);l.position.set(0,1.7,1.05),l.castShadow=!0,e.add(l);let u=new lt(.65,1.3,12);u.rotateX(Math.PI/3.2);let f=new r(u,o);f.position.set(0,2.05,2),f.castShadow=!0,e.add(f);for(let M of[-1,1]){let L=[new A(M*.38,2.25,1.95),new A(M*.95,2.85,1.85),new A(M*1.05,3.45,2.15)],T=new It(L),N=new Jt(T,12,.16,8,!1),q=new r(N,s);q.castShadow=!0,e.add(q)}let c=new F(.42,.42,.08,16);c.rotateX(Math.PI/2);let p=new r(c,s);p.position.set(0,2.95,1.95),p.castShadow=!0,e.add(p);let w=new F(.24,.32,1.45,8);[[-.6,.72,.95],[.6,.72,.95],[-.6,.72,-.95],[.6,.72,-.95]].forEach(M=>{let L=new r(w,o);L.position.set(M[0],M[1],M[2]),L.castShadow=!0,e.add(L)});let x=[new A(0,1.45,-1.6),new A(.05,.95,-1.8),new A(-.05,.45,-1.7)],V=new It(x),y=new Jt(V,10,.08,6,!1),H=new r(y,o);return e.add(H),e}_buildBaalIdol(){let e=new qe,o=pe.gold(1),s=pe.bronze(1.2),n=pe.agedCaenLimestone(2),t=[],a=[],l=[],u=new F(2.4,2.8,.6,24);u.translate(0,.3,0),l.push(u);let f=new F(2,2.4,.6,24);f.translate(0,.9,0),l.push(f);let c=new F(1.6,2,.6,24);c.translate(0,1.5,0),l.push(c);let p=new F(.7,1.25,2.8,16);p.translate(0,3.2,0),t.push(p);let w=new dt(.75,.1,8,16);w.rotateX(Math.PI/2),w.translate(0,4.5,0),a.push(w);let b=new F(.95,.7,2.2,16);b.translate(0,5.7,0),a.push(b);let x=new rt(.4,12,10);x.translate(-1,6.4,0),a.push(x);let V=new rt(.4,12,10);V.translate(1,6.4,0),a.push(V);let y=new rt(.55,16,12);y.translate(0,7.2,0),a.push(y);let H=new lt(.3,.8,8);H.translate(0,6.8,.3),t.push(H);let M=new lt(.55,1.5,12);M.translate(0,8.2,0),a.push(M);for(let k of[-1,1]){let h=new It([new A(k*.4,7.7,0),new A(k*.9,8.2,.1),new A(k*.8,8.8,.2)]),v=new Jt(h,10,.12,8,!1);a.push(v)}let L=new F(.2,.25,2,10);L.rotateZ(-.65),L.rotateX(-.45),L.translate(1.2,6.5,.2),a.push(L);let T=new F(.1,.1,5,10);T.rotateX(Math.PI/4),T.translate(2,7.8,.8),a.push(T);for(let k of[-.5,0,.5]){let h=new lt(.15,1,8);h.rotateX(Math.PI/4),h.translate(2+k,9.8,.8+k*.25),a.push(h)}let N=new F(.2,.25,1.8,10);N.rotateX(Math.PI/3),N.translate(-1.2,5.8,.5),a.push(N);let q=new F(.12,.12,3.5,10);q.translate(-1.3,5.4,1.4),t.push(q);let $=new rt(.3,12,10);$.translate(-1.3,7.15,1.4),a.push($);let Y=new dt(1.3,.1,10,30);if(Y.translate(0,7.3,-.4),a.push(Y),l.length>0){let k=je(l,!1);if(k){let h=new r(k,n);h.castShadow=!0,h.receiveShadow=!0,e.add(h)}}if(t.length>0){let k=je(t,!1);if(k){let h=new r(k,s);h.castShadow=!0,h.receiveShadow=!0,e.add(h)}}if(a.length>0){let k=je(a,!1);if(k){let h=new r(k,o);h.castShadow=!0,h.receiveShadow=!0,e.add(h)}}return e}_buildWingedSunDisc(){let e=new qe,o=pe.gold(1),s=pe.bronze(1.2),n=new r(new rt(1.2,16,12),o);n.scale.set(1,1,.35),e.add(n);for(let t of[-1,1]){let a=new mo;a.moveTo(0,0),a.quadraticCurveTo(t*2.5,1.2,t*5.2,.4),a.quadraticCurveTo(t*3.8,-.6,t*1.8,-.8),a.quadraticCurveTo(t*.8,-.4,0,0);let l=new Eo(a,{depth:.3,bevelEnabled:!1}),u=new r(l,o);u.position.set(t*.6,0,-.15),e.add(u)}for(let t of[-1,1]){let a=new It([new A(t*.5,.9,0),new A(t*.9,1.6,.1),new A(t*.6,2.1,.15)]),l=new r(new Jt(a,8,.09,6,!1),s);e.add(l)}return e}_createPhysicalWaterMaterial(e,o="lake"){let s=null;try{let t=e?.normalMap||e?.normal||e;s=t&&typeof t.clone=="function"?t.clone():t}catch{s=e}s&&s.wrapS!==void 0&&(s.wrapS=s.wrapT=qo);let n=new ot({color:o==="ocean"?673888:o==="river"?1333364:1596024,roughness:.08,metalness:.05,transparent:!0,logarithmicDepthBuffer:!0,opacity:o==="ocean"?.9:.82,normalMap:s||null,normalScale:new kt(1.1,1.1),envMapIntensity:2.4,depthWrite:!1,side:gt});return n.onBeforeCompile=function(t){t.uniforms.uTime={value:0},this.userData.shader=t,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
         uniform float uTime;
         vec3 gerstnerWave(vec2 dir, float steepness, float wavelength, vec2 p, float speed, float t) {
             float k = 2.0 * 3.14159265 / wavelength;
             float c = sqrt(9.8 / k);
             vec2 d = normalize(dir);
             float f = k * (dot(d, p) - c * speed * t);
             float a = steepness / k;
             return vec3(
                 d.x * (a * cos(f)),
                 a * sin(f),
                 d.y * (a * cos(f))
             );
         }`).replace("#include <begin_vertex>",`#include <begin_vertex>
         vec4 worldPos = modelMatrix * vec4(position, 1.0);
         vec3 g1 = gerstnerWave(vec2(1.0, 0.4), 0.12, 12.0, worldPos.xz, 1.2, uTime);
         vec3 g2 = gerstnerWave(vec2(-0.5, 1.0), 0.10, 8.0, worldPos.xz, 1.5, uTime);
         vec3 g3 = gerstnerWave(vec2(0.8, -0.6), 0.08, 5.0, worldPos.xz, 1.8, uTime);
         vec3 gWave = g1 + g2 + g3;

         ${o==="river"?`
         float channelProfile = 1.0 - pow(abs(uv.x - 0.5) * 2.0, 2.0);
         float currentSpeed = 4.8 + channelProfile * 3.6;
         vec3 r1 = gerstnerWave(vec2(0.0, 1.0), 0.16 * channelProfile, 10.0, worldPos.xz, currentSpeed * 0.2, uTime);
         vec3 r2 = gerstnerWave(vec2(0.2, 0.98), 0.09 * channelProfile, 6.0, worldPos.xz, currentSpeed * 0.25, uTime);
         vec3 r3 = gerstnerWave(vec2(-0.2, 0.98), 0.04, 3.0, worldPos.xz, currentSpeed * 0.3, uTime);
         vec3 riverWave = r1 + r2 + r3;
         
         float distToLake = distance(worldPos.xz, vec2(430.0, -260.0));
         float blendLake = smoothstep(285.0, 320.0, distToLake);
         float blendOcean = 1.0 - smoothstep(900.0, 930.0, worldPos.z);
         float blend = min(blendLake, blendOcean);
         
         vec3 finalWave = mix(gWave, riverWave, blend);
         transformed += finalWave;
         `:`
         transformed += gWave;
         `}
        `)},n}_createRiverMaterial(e){let o=(e.normalMap||e.normal||e).clone();o.wrapS=o.wrapT=qo;let s=`
      #include <common>
      #include <logdepthbuf_pars_vertex>
      #include <fog_pars_vertex>
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vCustomWorldNormal;
      varying vec3 vToEye;

      void main() {
        vUv = uv;
        vec3 transformed = position;
        
        // Parabolic channel velocity profile: fastest current in center (u=0.5), slowing at banks
        float channelProfile = 1.0 - pow(abs(uv.x - 0.5) * 2.0, 2.0);
        float currentSpeed = 4.8 + channelProfile * 3.6;
        
        // Multi-octave downstream surging wave ripples with channel profile dampening
        float wave1 = sin(uv.y * 3.8 - uTime * currentSpeed) * 0.16 * channelProfile;
        float wave2 = cos(uv.y * 7.5 + uv.x * 3.14159 - uTime * (currentSpeed * 1.35)) * 0.09 * channelProfile;
        float wave3 = sin(uv.y * 15.0 - uTime * (currentSpeed * 1.9)) * 0.04;
        transformed.y += (wave1 + wave2 + wave3);

        vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
        vWorldPos = worldPos.xyz;
        vCustomWorldNormal = normalize(mat3(modelMatrix) * normal);
        vToEye = cameraPosition - worldPos.xyz;

        gl_Position = projectionMatrix * viewMatrix * worldPos;
        #include <logdepthbuf_vertex>
        #include <fog_vertex>
      }
    `,n=`
      #include <logdepthbuf_pars_fragment>
      #include <fog_pars_fragment>
      uniform sampler2D normalSampler;
      uniform vec3 uDeepWater;
      uniform vec3 uMidWater;
      uniform vec3 uSunWater;
      uniform vec3 uFoamColor;
      uniform vec3 sunColor;
      uniform vec3 sunDirection;
      uniform float uTime;
      uniform float uLength;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vCustomWorldNormal;
      varying vec3 vToEye;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        float channelProfile = 1.0 - pow(abs(vUv.x - 0.5) * 2.0, 2.0);
        float flowSpeed = uTime * (3.2 + channelProfile * 2.8);

        // Directional downstream flow mapping with dual-speed advection and subtle vortex curls
        vec2 flow1 = vec2(vUv.x * 3.5 + sin(vUv.y * 2.0 - flowSpeed * 0.8) * 0.05, vUv.y * 2.5 - flowSpeed);
        vec2 flow2 = vec2(vUv.x * 7.5 - cos(vUv.y * 3.5 + flowSpeed * 0.65) * 0.07, vUv.y * 5.2 - flowSpeed * 1.65);
        vec2 flow3 = vec2(vUv.x * 16.0 + sin(vUv.x * 9.0) * 0.06, vUv.y * 10.0 - flowSpeed * 2.6);

        vec3 n1 = texture2D(normalSampler, flow1).rgb * 2.0 - 1.0;
        vec3 n2 = texture2D(normalSampler, flow2).rgb * 2.0 - 1.0;
        vec3 n3 = texture2D(normalSampler, flow3).rgb * 2.0 - 1.0;
        vec3 waveNormal = normalize(n1 * 0.48 + n2 * 0.36 + n3 * 0.24);
        vec3 surfaceNormal = normalize(vCustomWorldNormal + waveNormal * 0.38);

        vec3 worldToEye = normalize(vToEye);
        vec3 sunDir = normalize(sunDirection);

        // Exact Dielectric Fresnel for water (IOR 1.333, F0 = 0.0204)
        float cosTheta = clamp(dot(surfaceNormal, worldToEye), 0.0, 1.0);
        float F0 = 0.0204;
        float fresnel = F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);

        // Atmospheric Rayleigh sky radiance gradient reflection
        vec3 reflectDir = reflect(-worldToEye, surfaceNormal);
        float skyGradient = clamp(reflectDir.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 skyColor = mix(vec3(0.12, 0.32, 0.55), vec3(0.48, 0.68, 0.88), skyGradient);

        // Physical GGX Microfacet Sun Specular Glints
        vec3 halfVec = normalize(sunDir + worldToEye);
        float NdotH = max(0.0, dot(surfaceNormal, halfVec));
        float NdotV = max(0.001, dot(surfaceNormal, worldToEye));
        float NdotL = max(0.001, dot(surfaceNormal, sunDir));
        float alphaRoughness = 0.042;
        float alphaSq = alphaRoughness * alphaRoughness;
        float denom = (NdotH * NdotH * (alphaSq - 1.0) + 1.0);
        float D = alphaSq / (3.14159265359 * denom * denom);
        float k = (alphaRoughness + 1.0) * (alphaRoughness + 1.0) / 8.0;
        float G = (NdotV / (NdotV * (1.0 - k) + k)) * (NdotL / (NdotL * (1.0 - k) + k));
        vec3 specularLight = sunColor * ((D * fresnel * G) / (4.0 * NdotV * NdotL + 0.001)) * NdotL * 4.6;

        // Channel depth with Beer-Lambert physical extinction
        float channelDepth = channelProfile * 2.8 + 0.25;

        // Submerged riverbed gravel & golden caustics in shallow margins
        vec2 bedUv = vWorldPos.xz * 0.50;
        float pebbleN = noise(bedUv * 5.0) * 0.6 + noise(bedUv * 10.0) * 0.4;
        vec3 riverbed = mix(vec3(0.56, 0.49, 0.39), vec3(0.34, 0.30, 0.25), pebbleN);

        // Shimmering river caustics dancing on the riverbed
        vec2 cUv = vec2(vUv.x * 4.5, vUv.y * 3.5 - flowSpeed * 0.85);
        float caust = pow(min(noise(cUv * 4.5), noise(cUv * 7.0 + 2.2)) * 2.2, 2.6);
        riverbed += sunColor * caust * 0.55 * (1.0 - smoothstep(0.2, 2.5, channelDepth));

        // Beer-Lambert physical depth absorption (#083244 -> #104e6c -> #38b8e0)
        vec3 extinction = exp(-vec3(0.72, 0.20, 0.05) * channelDepth);
        vec3 waterBody = mix(uDeepWater, uSunWater, extinction.g);
        waterBody = mix(waterBody, uMidWater, smoothstep(0.1, 0.9, 1.0 - channelProfile) * 0.45);
        vec3 waterVolume = mix(waterBody, riverbed * extinction, extinction.r * 0.75);

        vec3 albedo = mix(waterVolume, skyColor, fresnel * 0.88);
        vec3 outgoingLight = albedo + specularLight;

        // Dynamic Bank Froth & Boundary Layer Aeration along rock banks
        float bankDist = abs(vUv.x - 0.5) * 2.0;
        float bankShear = noise(vec2(vUv.x * 22.0, vUv.y * 18.0 - flowSpeed * 1.9));
        float bankWave = sin(vUv.y * 14.0 - flowSpeed * 2.4) * 0.07;
        float bankFoam = smoothstep(0.74, 0.98, bankDist + bankShear * 0.20 + bankWave) * 0.88;

        // Rapid whitewater glints in the fast thalweg current
        float rapidFoam = smoothstep(0.80, 0.98, n1.y * 0.6 + n2.y * 0.4 + bankShear * 0.3) * channelProfile * 0.45;
        float totalFoam = clamp(bankFoam + rapidFoam, 0.0, 1.0);

        vec3 finalColor = mix(outgoingLight, uFoamColor, totalFoam * 0.92);

        // Edge & Endpoint Smooth Dissolve
        float edgeAlpha = 1.0 - smoothstep(0.88, 1.0, bankDist);
        float endAlpha = smoothstep(0.0, 0.03, vUv.y / max(1.0, uLength)) * (1.0 - smoothstep(0.97, 1.0, vUv.y / max(1.0, uLength)));
        float alpha = mix(0.88, 1.0, totalFoam) * edgeAlpha * endAlpha;

        gl_FragColor = vec4(finalColor, alpha);
        #include <logdepthbuf_fragment>
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `;return new Mt({vertexShader:s,fragmentShader:n,uniforms:{normalSampler:{value:o},uDeepWater:{value:new Me(537156)},uMidWater:{value:new Me(1068652)},uSunWater:{value:new Me(3717344)},uFoamColor:{value:new Me(16317695)},waterColor:{value:new Me(537156)},uDeepColor:{value:new Me(537156)},uGlacierColor:{value:new Me(3717344)},sunColor:{value:new Me(16772829)},uSunColor:{value:new Me(16772829)},sunDirection:{value:new A(.4,.8,.5).normalize()},uSunDir:{value:new A(.4,.8,.5).normalize()},uTime:{value:0},uLength:{value:20}},transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:gt})}_createWaterPoolMaterial(e){let o=(e.normalMap||e.normal||e).clone();o.wrapS=o.wrapT=qo;let s=`
      #include <common>
      #include <logdepthbuf_pars_vertex>
      #include <fog_pars_vertex>
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vCustomWorldNormal;
      varying vec3 vToEye;

      void main() {
        vUv = uv;
        vec3 transformed = position;
        float r = length(uv - vec2(0.5)) * 2.0;
        
        // Multi-octave concentric impact ripples radiating outward from waterfall plunge
        float ripple1 = sin(r * 36.0 - uTime * 7.5) * (1.0 - smoothstep(0.0, 1.0, r)) * 0.16;
        float ripple2 = cos(r * 58.0 - uTime * 11.8) * (1.0 - smoothstep(0.0, 0.85, r)) * 0.08;
        float ripple3 = sin(r * 92.0 - uTime * 15.5) * (1.0 - smoothstep(0.0, 0.65, r)) * 0.04;
        transformed.z += (ripple1 + ripple2 + ripple3);

        vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
        vWorldPos = worldPos.xyz;
        vCustomWorldNormal = normalize(mat3(modelMatrix) * normal);
        vToEye = cameraPosition - worldPos.xyz;

        gl_Position = projectionMatrix * viewMatrix * worldPos;
        #include <logdepthbuf_vertex>
        #include <fog_vertex>
      }
    `,n=`
      #include <logdepthbuf_pars_fragment>
      #include <fog_pars_fragment>
      uniform sampler2D normalSampler;
      uniform vec3 uDeepWater;
      uniform vec3 uMidWater;
      uniform vec3 uSunWater;
      uniform vec3 uFoamColor;
      uniform vec3 sunColor;
      uniform vec3 sunDirection;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vCustomWorldNormal;
      varying vec3 vToEye;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        float r = length(vUv - vec2(0.5)) * 2.0;
        
        // Dual animated normal map distortion (counter-propagating radial wave distortion and capillary chop)
        vec2 uvOffset1 = vec2(cos(r * 24.0 - uTime * 4.8), sin(r * 24.0 - uTime * 4.8)) * 0.07;
        vec2 uvOffset2 = vec2(-sin(r * 38.0 + uTime * 3.6), cos(r * 38.0 + uTime * 3.6)) * 0.05;
        vec3 n1 = texture2D(normalSampler, vUv * 8.0 + uvOffset1).rgb * 2.0 - 1.0;
        vec3 n2 = texture2D(normalSampler, vUv * 16.0 + uvOffset2).rgb * 2.0 - 1.0;
        vec3 waveNormal = normalize(n1 * 0.60 + n2 * 0.40);
        vec3 surfaceNormal = normalize(vCustomWorldNormal + waveNormal * 0.38);

        vec3 worldToEye = normalize(vToEye);
        vec3 sunDir = normalize(sunDirection);

        // Exact Dielectric Fresnel for water (IOR 1.333, F0 = 0.0204)
        float cosTheta = clamp(dot(surfaceNormal, worldToEye), 0.0, 1.0);
        float F0 = 0.0204;
        float fresnel = F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);

        // Atmospheric Rayleigh sky radiance gradient
        vec3 reflectDir = reflect(-worldToEye, surfaceNormal);
        float skyGradient = clamp(reflectDir.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 skyColor = mix(vec3(0.12, 0.32, 0.55), vec3(0.48, 0.68, 0.88), skyGradient);

        // GGX Specular Sun Glints
        vec3 halfVec = normalize(sunDir + worldToEye);
        float NdotH = max(0.0, dot(surfaceNormal, halfVec));
        float NdotV = max(0.001, dot(surfaceNormal, worldToEye));
        float NdotL = max(0.001, dot(surfaceNormal, sunDir));
        float alphaRoughness = 0.045;
        float alphaSq = alphaRoughness * alphaRoughness;
        float denom = (NdotH * NdotH * (alphaSq - 1.0) + 1.0);
        float D = alphaSq / (3.14159265359 * denom * denom);
        float k = (alphaRoughness + 1.0) * (alphaRoughness + 1.0) / 8.0;
        float G = (NdotV / (NdotV * (1.0 - k) + k)) * (NdotL / (NdotL * (1.0 - k) + k));
        vec3 specularLight = sunColor * ((D * fresnel * G) / (4.0 * NdotV * NdotL + 0.001)) * NdotL * 4.6;

        // Submerged pebble bed & caustics in shallow margins
        float depthFactor = max(0.0, (1.0 - r) * 2.8 + 0.2);
        vec2 bedUv = vWorldPos.xz * 0.45;
        float pebbleN = noise(bedUv * 5.0) * 0.6 + noise(bedUv * 9.0) * 0.4;
        vec3 bedColor = mix(vec3(0.54, 0.48, 0.38), vec3(0.30, 0.27, 0.23), pebbleN);

        // Dancing underwater caustics
        vec2 cUv = vWorldPos.xz * 0.35 + vec2(uTime * 0.04, uTime * 0.02);
        float caust = pow(min(noise(cUv * 5.5), noise(cUv * 8.0 + 1.8)) * 2.2, 2.8);
        bedColor += sunColor * caust * 0.55 * (1.0 - smoothstep(0.2, 3.0, depthFactor));

        // Beer-Lambert physical depth extinction (#083244 -> #104e6c -> #38b8e0)
        vec3 extinction = exp(-vec3(0.68, 0.18, 0.045) * depthFactor);
        vec3 waterBody = mix(uDeepWater, uSunWater, extinction.g);
        waterBody = mix(waterBody, uMidWater, smoothstep(0.15, 0.85, r) * 0.45);
        vec3 waterVolume = mix(waterBody, bedColor * extinction, extinction.r * 0.70);

        vec3 albedo = mix(waterVolume, skyColor, fresnel * 0.88);
        vec3 outgoingLight = albedo + specularLight;

        // Concentric pool impact cavitation foam & frothing rings
        float centerCavitation = (1.0 - smoothstep(0.0, 0.42, r)) * 0.85;
        float expandingWaveFoam = sin(r * 32.0 - uTime * 7.5) * (1.0 - r) * 0.32;
        float nFoam = noise(vUv * 24.0 + vec2(uTime * 0.7, -uTime * 0.5)) * 0.22;
        float totalFoam = clamp(centerCavitation + max(0.0, expandingWaveFoam) + nFoam, 0.0, 1.0);

        vec3 finalColor = mix(outgoingLight, uFoamColor, totalFoam * 0.95);
        float alpha = mix(0.92, 1.0, totalFoam) * (1.0 - smoothstep(0.90, 1.0, r));

        gl_FragColor = vec4(finalColor, alpha);
        #include <logdepthbuf_fragment>
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `;return new Mt({vertexShader:s,fragmentShader:n,uniforms:{normalSampler:{value:o},uDeepWater:{value:new Me(537156)},uMidWater:{value:new Me(1068652)},uSunWater:{value:new Me(3717344)},uFoamColor:{value:new Me(16317695)},waterColor:{value:new Me(537156)},uDeepColor:{value:new Me(537156)},uGlacierColor:{value:new Me(3717344)},sunColor:{value:new Me(16772829)},uSunColor:{value:new Me(16772829)},sunDirection:{value:new A(.4,.8,.5).normalize()},uSunDir:{value:new A(.4,.8,.5).normalize()},uTime:{value:0}},transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:gt})}_createFountainBasinMaterial(e){let o=(e.normalMap||e.normal||e).clone();o.wrapS=o.wrapT=qo;let s=`
      #include <common>
      #include <logdepthbuf_pars_vertex>
      #include <fog_pars_vertex>
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vCustomWorldNormal;
      varying vec3 vToEye;

      void main() {
        vUv = uv;
        vec3 transformed = position;
        float r = length(uv - vec2(0.5)) * 2.0;
        
        // Dynamic concentric ripples expanding from center fountain plume
        float ripple1 = sin(r * 32.0 - uTime * 6.5) * (1.0 - r * 0.5) * 0.08;
        float ripple2 = cos(r * 54.0 - uTime * 10.0) * (1.0 - r * 0.7) * 0.04;
        transformed.z += (ripple1 + ripple2);

        vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
        vWorldPos = worldPos.xyz;
        vCustomWorldNormal = normalize(mat3(modelMatrix) * normal);
        vToEye = cameraPosition - worldPos.xyz;

        gl_Position = projectionMatrix * viewMatrix * worldPos;
        #include <logdepthbuf_vertex>
        #include <fog_vertex>
      }
    `,n=`
      #include <logdepthbuf_pars_fragment>
      #include <fog_pars_fragment>
      uniform sampler2D normalSampler;
      uniform vec3 uDeepWater;
      uniform vec3 uMidWater;
      uniform vec3 uSunWater;
      uniform vec3 uFoamColor;
      uniform vec3 sunColor;
      uniform vec3 sunDirection;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying vec3 vCustomWorldNormal;
      varying vec3 vToEye;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        float r = length(vUv - vec2(0.5)) * 2.0;
        vec2 rippleUv = vUv * 8.0 + vec2(sin(uTime * 1.5 + r * 12.0), cos(uTime * 1.5 + r * 12.0)) * 0.04;
        vec3 n = texture2D(normalSampler, rippleUv).rgb * 2.0 - 1.0;
        vec3 surfaceNormal = normalize(vCustomWorldNormal + n * 0.35);

        vec3 worldToEye = normalize(vToEye);
        vec3 sunDir = normalize(sunDirection);

        // Dielectric Fresnel for water (IOR 1.333, F0 = 0.0204)
        float cosTheta = clamp(dot(surfaceNormal, worldToEye), 0.0, 1.0);
        float F0 = 0.0204;
        float fresnel = F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);

        vec3 reflectDir = reflect(-worldToEye, surfaceNormal);
        float skyGradient = clamp(reflectDir.y * 0.5 + 0.5, 0.0, 1.0);
        vec3 skyColor = mix(vec3(0.12, 0.32, 0.55), vec3(0.48, 0.68, 0.88), skyGradient);

        // GGX Specular Sun Highlights
        vec3 halfVec = normalize(sunDir + worldToEye);
        float NdotH = max(0.0, dot(surfaceNormal, halfVec));
        float NdotV = max(0.001, dot(surfaceNormal, worldToEye));
        float NdotL = max(0.001, dot(surfaceNormal, sunDir));
        float alphaRoughness = 0.045;
        float alphaSq = alphaRoughness * alphaRoughness;
        float denom = (NdotH * NdotH * (alphaSq - 1.0) + 1.0);
        float D = alphaSq / (3.14159265359 * denom * denom);
        float k = (alphaRoughness + 1.0) * (alphaRoughness + 1.0) / 8.0;
        float G = (NdotV / (NdotV * (1.0 - k) + k)) * (NdotL / (NdotL * (1.0 - k) + k));
        vec3 specularLight = sunColor * ((D * fresnel * G) / (4.0 * NdotV * NdotL + 0.001)) * NdotL * 4.2;

        // Beer-Lambert Depth Gradient (#083244 -> #104e6c -> #38b8e0)
        float depthFactor = (1.0 - r) * 1.5;
        vec3 extinction = exp(-vec3(0.65, 0.22, 0.07) * max(0.0, depthFactor));
        vec3 baseWater = mix(uDeepWater, uSunWater, extinction.g);
        baseWater = mix(baseWater, uMidWater, smoothstep(0.1, 0.9, r) * 0.45);

        vec3 albedo = mix(baseWater, skyColor, fresnel * 0.88);
        vec3 outgoingLight = albedo + specularLight;

        // Center plume and edge froth
        float centerFoam = (1.0 - smoothstep(0.0, 0.28, r)) * 0.55;
        float edgeFoam = smoothstep(0.86, 0.98, r) * 0.45;
        float totalFoam = clamp(centerFoam + edgeFoam, 0.0, 1.0);

        vec3 finalColor = mix(outgoingLight, uFoamColor, totalFoam);
        float alpha = mix(0.96, 1.0, totalFoam) * (1.0 - smoothstep(0.94, 1.0, r));

        gl_FragColor = vec4(finalColor, alpha);
        #include <logdepthbuf_fragment>
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        #include <fog_fragment>
      }
    `;return new Mt({vertexShader:s,fragmentShader:n,uniforms:{normalSampler:{value:o},uDeepWater:{value:new Me(537156)},uMidWater:{value:new Me(1068652)},uSunWater:{value:new Me(3717344)},uFoamColor:{value:new Me(16317695)},waterColor:{value:new Me(537156)},sunColor:{value:new Me(16772829)},uSunColor:{value:new Me(16772829)},sunDirection:{value:new A(.4,.8,.5).normalize()},uSunDir:{value:new A(.4,.8,.5).normalize()},uTime:{value:0}},transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:gt})}_createFountainCascadeMaterial(e){let o={transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:gt,blending:Xs,uniforms:{uTime:{value:0},uDeepWater:{value:new Me(537156)},uMidWater:{value:new Me(1068652)},uSunWater:{value:new Me(3717344)},uFoamColor:{value:new Me(16317695)},uDeepColor:{value:new Me(537156)},uGlacierColor:{value:new Me(3717344)},uSunDir:{value:new A(.4,.8,.5).normalize()},uSunColor:{value:new Me(16772829)}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vCustomWorldPosition;
        uniform float uTime;
        void main() {
          vUv = uv;
          vec3 transformed = position;
          // Turbulent cascade shudder
          float shudder = sin(position.y * 8.0 - uTime * 14.0) * 0.04;
          transformed.x += normal.x * shudder;
          transformed.z += normal.z * shudder;
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
          vCustomWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform float uTime;
        uniform vec3 uDeepWater;
        uniform vec3 uMidWater;
        uniform vec3 uSunWater;
        uniform vec3 uFoamColor;
        uniform vec3 uSunDir;
        uniform vec3 uSunColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vCustomWorldPosition;

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p) {
          vec2 i = floor(p), f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }

        void main() {
          // Rapid downward animated cascade streaks
          float flowY = vUv.y * 6.5 + uTime * 8.5;
          float flowX = vUv.x * 36.0;
          float n1 = noise(vec2(flowX, flowY));
          float n2 = noise(vec2(flowX * 2.2, flowY * 1.9 + 18.0));
          
          float streak = pow(n1 * 0.65 + n2 * 0.35, 1.25);
          float foam = smoothstep(0.45, 0.82, streak);
          
          // Dielectric Fresnel for water (F0 = 0.0204)
          vec3 viewDir = normalize(cameraPosition - vCustomWorldPosition + vec3(0.0001));
          float cosTheta = clamp(dot(vNormal, viewDir), 0.0, 1.0);
          float fresnel = 0.0204 + (1.0 - 0.0204) * pow(1.0 - cosTheta, 5.0);

          // GGX Specular Sun Glint
          vec3 sunDir = normalize(uSunDir);
          vec3 halfVec = normalize(sunDir + viewDir);
          float NdotH = max(0.0, dot(vNormal, halfVec));
          float spec = pow(NdotH, 48.0) * 1.8;

          vec3 baseWater = mix(uDeepWater, uSunWater, 0.70);
          vec3 waterCol = mix(baseWater, uFoamColor, foam * 0.60);
          waterCol += fresnel * vec3(0.35, 0.65, 0.85) * 0.45;
          waterCol += uSunColor * spec;
          
          float alpha = mix(0.48, 0.92, streak) * smoothstep(0.0, 0.08, vUv.y) * (1.0 - smoothstep(0.92, 1.0, vUv.y));

          gl_FragColor = vec4(waterCol, alpha);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `};return new Mt(o)}_riverLanterns3D(){this._lanterns=[];let e=new ot({color:16770728,emissive:new Me(16750884),emissiveIntensity:1.8,roughness:.28,metalness:.05});this._lanternMat=e;let o=new F(1.6,1.2,1.6,6),s=36,n=new ut(o,e,s);n.instanceMatrix.setUsage(Wn),this.world.scene.add(n);for(let t=0;t<s;t++){let a=t>=12,l=a?(t-12)/24:t/12,u=new Lt;u.userData={isOutlet:a,progress:l,speed:.008+t%5*.002,bobPhase:t*.7};let f=u.position.set.bind(u.position);u.position.set=(p,w,b)=>{f(p,w,b),u.updateMatrix(),n.setMatrixAt(t,u.matrix),n.instanceMatrix.needsUpdate=!0};let c=0;Object.defineProperty(u.rotation,"y",{get:()=>c,set:p=>{c=p,u.rotation.set(u.rotation.x,p,u.rotation.z),u.updateMatrix(),n.setMatrixAt(t,u.matrix),n.instanceMatrix.needsUpdate=!0}}),this._lanterns.push(u)}}async _generateProceduralPlots(){let e=performance.now(),o=()=>performance.now()-e>16?(e=performance.now(),new Promise(y=>setTimeout(y,0))):Promise.resolve();this.world.plots||(this.world.plots=[]);let s=new Set(this.world.plots.map(y=>y.id)),n=0,t=(y,H,M,L,T,N,q="standard",$=1)=>s.has(y)?!1:(this.world.plots.push({id:y,x:H,z:M,rot:L,type:T,name:N,size:q,tier:$,status:"available",h:ze(H,M)}),s.add(y),n++,!0),a=(y,H,M=14)=>{if(xo(y,H)<M+4||Xo(y,H)<M+2||Math.hypot(y-K.lake.x,H-K.lake.z)<K.lake.r+M+4||ze(y,H)>120)return!1;for(let T of this.world.plots)if(Math.hypot(y-T.x,H-T.z)<M+4)return!1;return!0},l=0;for(let y=300;y<1400;y+=24){await o();let H=2*Math.PI*y,M=Math.floor(H/24);for(let L=0;L<M;L++){let T=L/M*Math.PI*2,N=Math.cos(T)*y,q=Math.sin(T)*y,$=jt(N*.003,q*.003,3),Y=jt(N*.015,q*.015,2);$*.7+Y*.3>.1&&a(N,q)&&ze(N,q)>3&&(t(`FOREST_${l}`,N,q,T,"forest",`Forest Glade ${l}`,"standard",1),l++)}}let u=0;for(let y=-800;y<800;y+=36){await o();for(let H=-800;H<800;H+=36)ze(y,H)<-2&&a(y,H)&&(t(`UNDERWATER_${u}`,y,H,0,"underwater",`Abyssal Plot ${u}`,"premium",2),u++)}let f=0,c=20,p=2100;for(let y=30;y<150;y+=16){let H=2*Math.PI*y,M=Math.floor(H/16);for(let L=0;L<M;L++){let T=L/M*Math.PI*2,N=c+Math.cos(T)*y,q=p+Math.sin(T)*y;ze(N,q)>0&&a(N,q)&&(t(`KAYA_${f}`,N,q,T,"kaya",`Kaya Island ${f}`,"estate",3),f++)}}let w=[],b=0,x=[{cx:650,cz:-650,name:"East Meadow"},{cx:-550,cz:-150,name:"West Valley"},{cx:350,cz:900,name:"South Garden"},{cx:-400,cz:-1e3,name:"North Highlands"}];for(let y of x)for(let H=20;H<350;H+=16){await o();let M=Math.floor(2*Math.PI*H/14);for(let L=0;L<M;L++){let T=L/M*Math.PI*2+Math.random()*.5,N=y.cx+Math.cos(T)*H,q=y.cz+Math.sin(T)*H;if(jt(N*.008,q*.008,2)>.45&&a(N,q)){let $=`MEMORIAL_${b}`;!s.has($)&&t($,N,q,T+Math.PI,"cemetery",`${y.name} Memorial ${b}`,"standard",1),w.push({x:N,z:q,rot:T+Math.PI}),b++}}}if(w.length>0){await o();let y=new mo,H=.45,M=1.4,L=.2;y.moveTo(-H,0),y.lineTo(H,0),y.lineTo(H,M-H),y.absarc(0,M-H,H,0,Math.PI,!1);let T={depth:L,bevelEnabled:!0,bevelSegments:6,steps:1,bevelSize:.03,bevelThickness:.03},N=new Eo(y,T);N.translate(0,0,-L/2);let q=new mo;q.moveTo(-H-.12,-L/2-.12),q.lineTo(H+.12,-L/2-.12),q.lineTo(H+.12,L/2+.12),q.lineTo(-H-.12,L/2+.12);let $={depth:.15,bevelEnabled:!0,bevelSegments:4,steps:1,bevelSize:.02,bevelThickness:.02},Y=new Eo(q,$);Y.rotateX(Math.PI/2),Y.translate(0,.075,0);let k=je([N,Y]);Yt(k,.5,.02,12),Ko(k,0,.5);let h=typeof window<"u"&&window.innerWidth>768?1024:512,v=yo("photogrammetryRock",h),_=new Ot({color:13685976,roughness:.75,metalness:.05,map:v.map,normalMap:v.normalMap,roughnessMap:v.roughnessMap,vertexColors:!0}),g=new ut(k,_,w.length),i=new Lt;for(let S=0;S<w.length;S++){S%500===0&&await o();let C=w[S],O=-4.5,te=C.x+Math.sin(C.rot)*O,m=C.z+Math.cos(C.rot)*O,E=ze(te,m);i.position.set(te,E,m),i.rotation.set(0,C.rot,0),i.rotation.x=(Math.random()-.5)*.08,i.rotation.z=(Math.random()-.5)*.06,i.scale.setScalar(.9+Math.random()*.2),i.updateMatrix(),g.setMatrixAt(S,i.matrix)}g.instanceMatrix.needsUpdate=!0,g.castShadow=!0,g.receiveShadow=!0,this.world.scene.add(g),console.log("[world3d] gsMesh added to scene"),this._decorMeshes||(this._decorMeshes=[]),this._decorMeshes.push(g)}[{idPrefix:"MOSQUE",x:K.mosque.x,z:K.mosque.z,r:80,name:"Mosque Courtyard"},{idPrefix:"PAGODA",x:K.buddhistTemple.x,z:K.buddhistTemple.z,r:80,name:"Pagoda Gardens"}].forEach(y=>{let H=0;for(let M=40;M<y.r;M+=16){let L=Math.floor(2*Math.PI*M/16);for(let T=0;T<L;T++){let N=T/L*Math.PI*2,q=y.x+Math.cos(N)*M,$=y.z+Math.sin(N)*M;a(q,$)&&(t(`${y.idPrefix}_${H}`,q,$,N,y.idPrefix.toLowerCase(),`${y.name} ${H}`,"estate",3),H++)}}}),n>0&&console.log(`[WorldTerrain] Generated ${n} procedural plots.`)}_river(){this._riverMaterials=[];let e=(o,s=46,n=8,t=16)=>{let a=o.map(([y,H,M])=>new ht(y,M,H)),l=new It(a),u=240,f=[],c=[],p=[],w=new ht(0,1,0);for(let y=0;y<=u;y++){let H=y/u,M=l.getPoint(H),L=l.getTangent(H),T=s+Math.sin(H*Math.PI*3)*n,N=new ht().crossVectors(L,w).normalize().multiplyScalar(T*.5),q=M.clone().add(N),$=M.clone().sub(N);if(f.push(q.x,q.y,q.z,$.x,$.y,$.z),p.push(0,H*t,1,H*t),y>0){let Y=y*2;c.push(Y-2,Y,Y-1,Y-1,Y,Y+1)}}let b=new Et;b.setAttribute("position",new mt(f,3)),b.setAttribute("uv",new mt(p,2)),b.setIndex(c),b.computeVertexNormals();let x=this.riverMat.clone();x.uniforms&&(x.uniforms.uLength={value:t}),this._riverMaterials.push(x);let V=new r(b,x);return V.receiveShadow=!0,V.renderOrder=1,this.world.scene.add(V),l};this._riverInletCurve=e(Rn,22,3.5,16),this._riverOutletCurve=e(bn,44,6,22)}openGate(){this._forceGateOpen=!0}closeGate(){this._forceGateOpen=!1}async rebuildPlots(){for(let e=this.world.pickables.length-1;e>=0;e--){let o=this.world.pickables[e];this.world.plotMeshIndex.has(o)&&o.isInstancedMesh&&(this.world.scene.remove(o),o.geometry?.dispose(),o.material?.dispose(),this.world.pickables.splice(e,1),this.world.plotMeshIndex.delete(o))}for(let e of this._decorMeshes||[])this.world.scene.remove(e),e.geometry?.dispose(),e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(s=>s.dispose());this._decorMeshes=[],this.world.scene.remove(this.world.selRing),console.log("[World3D] calling _generateProceduralPlots()..."),await this._generateProceduralPlots(),console.log("[World3D] calling _plots()..."),await this.world._plots(),console.log("[World3D] _plots() done")}};var Oi=new Me(12563354),ba=new A,Xi=new A,Yi=new A,Zi=new A,qi=new Me,ji=new Me,Ki=new so,$i=new _t;var Ns=class{constructor(e){this.world=e}_setupWalkControls(){this.walkMode=!1,this.tourMode=!1,this.keysDown={w:!1,a:!1,s:!1,d:!1,q:!1,e:!1,Shift:!1},this.walkPos=new A(0,4,310),this.walkYaw=Math.PI,this.walkPitch=0,this.walkVelocity=new A,this.eyeHeight=2.4,this._isDraggingLook=!1,this._prevMouse={x:0,y:0},this._walkForward=new A,this._walkRight=new A,this._walkMoveDir=new A,this._walkLookDir=new A,this._walkLookTarget=new A,this._walkZero=new A(0,0,0),this.world._joystickInput=new kt(0,0),this._onKeyDown=e=>{let o=document.activeElement;if(o&&(["input","textarea","select"].includes(o.tagName?.toLowerCase())||o.isContentEditable||o.closest("input, textarea, select, [contenteditable]"))||!!(document.querySelector("#modalRoot:not(.hidden)")||document.querySelector(".devotional-dialog")||document.querySelector(".panel:not(.hidden)")||document.querySelector(".feed-panel:not(.hidden)")))return;let t=e.key.toLowerCase();if(this.tourMode){if(e.code==="Space"){e.preventDefault(),this.toggleTourPlayPause();return}if(t==="arrowright"||t==="n"){e.preventDefault(),this.nextTourStage();return}if(t===" "){e.preventDefault(),this.toggleTourPause();return}if(t==="arrowleft"||t==="p"){e.preventDefault(),this.prevTourStage();return}if(e.key==="Escape"||t==="x"){e.preventDefault(),this.exitTour();return}}if(t==="e"&&this._nearDevotionalTemple){e.preventDefault(),window.UI?.showDevotionalModal&&window.UI.showDevotionalModal(this._nearDevotionalTemple);return}(t==="w"||t==="arrowup")&&(this.keysDown.w=!0),(t==="s"||t==="arrowdown")&&(this.keysDown.s=!0),(t==="a"||t==="arrowleft")&&(this.keysDown.a=!0),(t==="d"||t==="arrowright")&&(this.keysDown.d=!0),t==="q"&&(this.keysDown.q=!0),t==="e"&&(this.keysDown.e=!0),e.key==="Shift"&&(this.keysDown.Shift=!0),["w","a","s","d","arrowup","arrowleft","arrowdown","arrowright"].includes(t)&&!this.walkMode&&!this.tourMode&&this.setMode("walk")},this._onKeyUp=e=>{let o=e.key.toLowerCase();(o==="w"||o==="arrowup")&&(this.keysDown.w=!1),(o==="s"||o==="arrowdown")&&(this.keysDown.s=!1),(o==="a"||o==="arrowleft")&&(this.keysDown.a=!1),(o==="d"||o==="arrowright")&&(this.keysDown.d=!1),o==="q"&&(this.keysDown.q=!1),o==="e"&&(this.keysDown.e=!1),e.key==="Shift"&&(this.keysDown.Shift=!1)},this._onMouseDown=e=>{this.walkMode&&(e.target.closest("#sanctuaryWalkPill, #sanctuaryAmbiencePill, #topbar, .panel, .modal")||(this._isDraggingLook=!0,this._prevMouse={x:e.clientX,y:e.clientY}))},this._onMouseMove=e=>{if(!this.walkMode||!this._isDraggingLook)return;let o=e.clientX-this._prevMouse.x,s=e.clientY-this._prevMouse.y;this._prevMouse={x:e.clientX,y:e.clientY},this.walkYaw-=o*.0035,this.walkPitch=Math.max(-Math.PI*.4,Math.min(Math.PI*.4,this.walkPitch-s*.0035))},this._onMouseUp=()=>{this._isDraggingLook=!1},window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),this.world.canvas.addEventListener("mousedown",this._onMouseDown),window.addEventListener("mousemove",this._onMouseMove),window.addEventListener("mouseup",this._onMouseUp),this._onTouchStart=e=>{!this.walkMode||!e.touches[0]||e.target.closest("#sanctuaryWalkPill, #walkJoystick, #sanctuaryAmbiencePill, #topbar, .panel, .modal")||(this._isDraggingLook=!0,this._prevMouse={x:e.touches[0].clientX,y:e.touches[0].clientY})},this._onTouchMove=e=>{if(!this.walkMode||!this._isDraggingLook||!e.touches[0])return;let o=e.touches[0].clientX-this._prevMouse.x,s=e.touches[0].clientY-this._prevMouse.y;this._prevMouse={x:e.touches[0].clientX,y:e.touches[0].clientY},this.walkYaw-=o*.004,this.walkPitch=Math.max(-Math.PI*.4,Math.min(Math.PI*.4,this.walkPitch-s*.004))},this.world.canvas.addEventListener("touchstart",this._onTouchStart,{passive:!0}),this.world.canvas.addEventListener("touchmove",this._onTouchMove,{passive:!0}),this._initTourSpline()}_initTourSpline(){if(this._tourSpline&&this._tourStages&&this._stageArc&&this._tourStages.length===12)return;this._tourStages=An;let e=[new A(0,48,1300),new A(0,40,1050),new A(0,36.5,885),new A(0,42,680),new A(0,52,480),new A(0,58,300),new A(80,38,120),new A(95,36,0),new A(-40,36,-120),new A(0,44,-280),new A(0,105,-420),new A(0,168,-490),new A(0,172,-540),new A(25,166,-575),new A(15,188,-605),new A(0,220,-630),new A(0,218,-685),new A(0,275,-735),new A(-240,288,-750),new A(-340,238,-600),new A(-380,175,-420),new A(-450,132,-300),new A(-480,110,-200),new A(-380,75,-120),new A(100,30,-160),new A(430,2.8,-260),new A(520,25,-340),new A(530,95,-420),new A(610,175,-570),new A(630,215,-470),new A(350,215,700),new A(20,42,2040),new A(-30,44,2140),new A(10,-5.5,2220),new A(-25,-14.5,2290),new A(0,75,1450)];this._tourSpline=new It(e,!0,"centripetal"),this._stageArc=[];for(let o of this._tourStages){let s=0,n=64;for(let t=0;t<n;t++){let a=o.tStart+(o.tEnd-o.tStart)*(t/n),l=o.tStart+(o.tEnd-o.tStart)*((t+1)/n),u=this._tourSpline.getPoint(a),f=this._tourSpline.getPoint(l);s+=u.distanceTo(f)}this._stageArc.push(s)}this._totalSplineLength=this._stageArc.reduce((o,s)=>o+s,0),this._tourTime=0,this.world._tourSpeed=1,this.world._tourPaused=!1,this.world._currentRoll=0,this.world._activeStageIndex=0,this._lastStageNum=-1}_calculateTourLookTarget(e,o,s,n){let t=n||this.world._v3TourLook,a=s&&s.lengthSq()>1e-4&&!isNaN(s.x)?s:this.world._v3TourTan,l=[new A(0,40,600),new A(0,45,100),new A(0,24,0),new A(0,160,-520),new A(20,166,-620),new A(0,220,-720),new A(-440,150,-500),new A(-480,106,-200),new A(470,3,-290),new A(560,170,-520),new A(20,37,2100),new A(0,-10,2260)],u=1/12,c=(e%1+1)%1/u,p=Math.floor(c)%12,w=(p+1)%12,b=c-Math.floor(c),x=b*b*b*(b*(b*6-15)+10),V=l[p],y=l[w];this.world._v3Tmp3||(this.world._v3Tmp3=new A),this.world._v3Tmp4||(this.world._v3Tmp4=new A);let H=this.world._v3Tmp3.copy(o).addScaledVector(a,120),M=this.world._v3Tmp4.copy(V).lerp(y,x),T=p===2||p===5||p===7||p===9||p===10?.35:.6;if(p===10){let q=this.world._v3Tmp4.copy(l[10]),$=Math.max(.2,.88-b*.95),Y=q.lerp(H,1-$);if(b<.55)t.copy(Y);else{let k=(b-.55)/.45,h=k*k*(3-2*k);t.copy(Y).lerp(l[11],h)}}else p===8&&o.y<12?(t.copy(M).lerp(H,T),t.y=3.2):t.copy(M).lerp(H,T);return t.distanceToSquared(o)<25&&t.copy(o).addScaledVector(a,50),t}_initWalkHUD(){let e=document.getElementById("sanctuaryWalkPill");e||(e=document.createElement("div"),e.className="sanctuary-walk-pill",e.id="sanctuaryWalkPill",e.innerHTML=`
        <button class="swp-btn is-active" data-cam-mode="orbit">Explore</button>
        <button class="swp-btn" data-cam-mode="tour">Drone flight</button>
        <button class="swp-btn" data-cam-mode="walk">Walk</button>
        <button class="swp-btn" data-cam-mode="overview">Whole valley</button>
        <button class="swp-btn" data-cam-mode="map">Map</button>
      `,document.getElementById("view3d").appendChild(e),e.addEventListener("click",n=>{let t=n.target.closest(".swp-btn");if(!t)return;let a=t.dataset.camMode;if(a==="map"){window.UI?.show2D();return}window.UI?.show3D(a==="overview"?"orbit":a).then(()=>{a==="overview"&&this.flyToDistrict("overview")})}));let o=document.getElementById("droneTourCard");o&&o.classList.add("hidden");let s=document.getElementById("walkJoystick");if(!s){s=document.createElement("div"),s.className="walk-joystick",s.id="walkJoystick",s.innerHTML=`
        <div class="walk-joystick-base">
          <div class="walk-joystick-knob" id="walkJoystickKnob"></div>
        </div>
      `,document.body.appendChild(s);let n=s.querySelector("#walkJoystickKnob"),t=null,a={x:0,y:0},l=38;this._onJoystickTouchStart=u=>{if(t!==null)return;t=u.changedTouches[0].identifier;let c=s.getBoundingClientRect();a={x:c.left+c.width/2,y:c.top+c.height/2},u.preventDefault()},this._onJoystickTouchMove=u=>{if(t!==null)for(let f=0;f<u.changedTouches.length;f++){let c=u.changedTouches[f];if(c.identifier===t){let p=c.clientX-a.x,w=c.clientY-a.y,b=Math.hypot(p,w);b>l&&(p=p/b*l,w=w/b*l),n&&(n.style.transform=`translate(${p}px, ${w}px)`),this.world._joystickInput.set(p/l,w/l),u.preventDefault();break}}},this._onJoystickTouchEnd=u=>{if(t!==null){for(let f=0;f<u.changedTouches.length;f++)if(u.changedTouches[f].identifier===t){t=null,n&&(n.style.transform="translate(0px, 0px)"),this.world._joystickInput.set(0,0);break}}},s.addEventListener("touchstart",this._onJoystickTouchStart,{passive:!1}),window.addEventListener("touchmove",this._onJoystickTouchMove,{passive:!1}),window.addEventListener("touchend",this._onJoystickTouchEnd),window.addEventListener("touchcancel",this._onJoystickTouchEnd)}this._joystick=s}_initFPSHUD(){let e=document.getElementById("sanctuaryFpsPill");if(!e){e=document.createElement("div"),e.className="sanctuary-fps-pill fps-good",e.id="sanctuaryFpsPill",e.setAttribute("aria-label","Real-time FPS and Render Time"),e.innerHTML=`
        <span class="sfp-dot"></span>
        <span class="sfp-text" id="sanctuaryFpsText"><span class="sfp-fps">60 FPS</span><span class="sfp-sep">\xB7</span><span class="sfp-ms">16ms</span></span>
      `;let o=document.getElementById("view3d");o?o.appendChild(e):document.body.appendChild(e)}this.world._fpsPill=e,this.world._fpsTextEl=e.querySelector("#sanctuaryFpsText")}toggleTourPlayPause(){this.world._tourPaused=!this.world._tourPaused,this._updateTourHUD(this._tourTime,!0)}nextTourStage(){if(!this._tourStages||this._tourStages.length===0)return;let e=(this.world._activeStageIndex+1)%this._tourStages.length;this.setTourStage(e)}toggleTourPause(){this.world._tourPaused=!this.world._tourPaused,this._updateTourHUD(this._tourTime,!0)}prevTourStage(){if(!this._tourStages||this._tourStages.length===0)return;let e=(this.world._activeStageIndex-1+this._tourStages.length)%this._tourStages.length;this.setTourStage(e)}setTourStage(e){if(!this._tourStages||e<0||e>=this._tourStages.length)return;this.tourMode||this.setMode("tour");let o=this._tourStages[e].tStart;this.world._tourPaused=!1,this.world._activeStageIndex=e,this._tourSpline||this._initTourSpline(),this._tourSpline.getPoint(o,this.world._v3TourPos),(isNaN(this.world._v3TourPos.x)||isNaN(this.world._v3TourPos.y)||isNaN(this.world._v3TourPos.z))&&this.world._v3TourPos.set(0,48,960);let n=ze(this.world._v3TourPos.x,this.world._v3TourPos.z)+.8;this.world._v3TourPos.y<n&&(this.world._v3TourPos.y=n),this._tourSpline.getTangent(o,this.world._v3TourTan),this.world._v3TourTan.lengthSq()<1e-4||isNaN(this.world._v3TourTan.x)||isNaN(this.world._v3TourTan.y)||isNaN(this.world._v3TourTan.z)?this.world._v3TourTan.set(0,0,-1):this.world._v3TourTan.normalize(),this._calculateTourLookTarget(o,this.world._v3TourPos,this.world._v3TourTan,this.world._v3TourLook),this.world._v3TourLook.distanceToSquared(this.world._v3TourPos)<1&&this.world._v3TourLook.copy(this.world._v3TourPos).addScaledVector(this.world._v3TourTan,50),this._stageTween=null,this.world.camera.position.copy(this.world._v3TourPos),this.world._currentLook||(this.world._currentLook=new A),this.world._currentLook.copy(this.world._v3TourLook),this.world.camera.up.set(0,1,0),this.world._currentRoll=0,this.world.camera.lookAt(this.world._currentLook),this.world._currentQuat=this.world.camera.quaternion.clone(),this._tourTime=o,this._updateTourHUD(o,!0)}startDroneTour(e=0){this.world.startDroneTour(e)}exitTour(){this.setMode("orbit"),window.UI?._setView&&window.UI._setView({view:"view3d",btn:"btn3d"})}_updateTourHUD(e,o=!1){if(window.VeoTour?.isPlaying||document.getElementById("veoDroneTourContainer")&&!document.getElementById("veoDroneTourContainer").classList.contains("hidden")){let l=document.getElementById("droneTourCard");l&&l.classList.add("hidden");return}if(!this._tourStages||this._tourStages.length===0)return;let n=this._tourStages[0];for(let l=0;l<this._tourStages.length;l++){let u=this._tourStages[l];if(e>=u.tStart&&(e<u.tEnd||l===this._tourStages.length-1)){n=u;break}}this.world._activeStageIndex=this._tourStages.indexOf(n);let t=document.getElementById("droneTourCard");if(this._lastStageNum!==n.stage||!t||o){this._lastStageNum=n.stage,t||(t=document.createElement("div"),t.id="droneTourCard",document.body.appendChild(t),t.addEventListener("click",c=>{let p=c.target.closest(".dtc-btn");if(p&&(p.classList.contains("dtc-prev")&&this.prevTourStage(),p.classList.contains("dtc-next")&&this.nextTourStage(),p.classList.contains("dtc-play")&&this.toggleTourPause(),p.classList.contains("dtc-exit")&&this.exitTour(),p.classList.contains("dtc-speed"))){let w=this.world._tourSpeedMultiplier||1;w===1?this.world._tourSpeedMultiplier=1.5:w===1.5?this.world._tourSpeedMultiplier=2:w===2?this.world._tourSpeedMultiplier=.5:this.world._tourSpeedMultiplier=1,this._updateTourHUD(this._tourTime,!0)}})),t.classList.remove("hidden");let l=this.world._tourSpeedMultiplier||1,u=this._tourStages?this._tourStages.length:12,f=this.world._tourPaused?'<div class="dtc-pause-hint">\u23F8 <strong>Flight Paused</strong> \u2014 Click any plot to inspect & reserve \xB7 Press Space to resume</div>':"";t.innerHTML=`
        <div class="dtc-content">
          <div class="dtc-progress-wrap"><div class="dtc-progress" id="dtcProgress"></div></div>
          <span class="dtc-title"><span class="dtc-stage">${n.stage}/${u}</span> ${n.title}</span>
          ${f}
          <div class="dtc-controls">
            <button class="dtc-btn dtc-speed" aria-label="Tour Speed">${l}x</button>
            <button class="dtc-btn dtc-prev" aria-label="Previous Stage">\u276E</button>
            <button class="dtc-btn dtc-play" aria-label="Pause/Play">${this.world._tourPaused?"\u25B6":"\u23F8"}</button>
            <button class="dtc-btn dtc-next" aria-label="Next Stage">\u276F</button>
            <button class="dtc-btn dtc-exit" aria-label="Exit Tour">\u2716</button>
          </div>
        </div>
      `}else{let l=t.querySelector(".dtc-play");l&&(l.textContent=this.world._tourPaused?"\u25B6":"\u23F8");let u=t.querySelector(".dtc-pause-hint");if(this.world._tourPaused){if(!u){let f=t.querySelector(".dtc-content");f&&(u=document.createElement("div"),u.className="dtc-pause-hint",u.innerHTML="\u23F8 <strong>Flight Paused</strong> \u2014 Click any plot to inspect & reserve \xB7 Press Space to resume",f.insertBefore(u,f.querySelector(".dtc-controls")))}}else u&&u.remove()}let a=document.getElementById("dtcProgress");if(a&&n.tEnd>n.tStart){let l=Math.max(0,Math.min(100,(e-n.tStart)/(n.tEnd-n.tStart)*100));a.style.width=l+"%"}}startEntranceFlight(e={}){let{targetMode:o="orbit",duration:s=7,onThresholdCross:n,onComplete:t}=e;this.walkMode=!1,this.tourMode=!1,this.world.controls.enabled=!1,this.world.terrain.gateTargetOpen=0;let a=[new A(0,24,980),new A(0,20,930),new A(0,18,880),new A(0,25,780),new A(0,32,650),new A(0,42,540),new A(0,42,440),new A(0,39,320),new A(0,37.5,180),new A(0,36.5,60)],l=[new A(0,22,750),new A(0,24,750),new A(0,34,680),new A(0,30,560),new A(0,28,440),new A(0,26,300),new A(0,24,140),new A(0,22,20),new A(0,24,-80),new A(0,26,-180)];this._entranceFlight={spline:new It(a),lookSpline:new It(l),duration:Math.max(2,s),startTime:performance.now(),crossedThreshold:!1,onThresholdCross:n,onComplete:t,targetMode:o}}setMode(e){if(e==="tour"){this.world.startDroneTour();return}let o=this.walkMode;this.world.cameraMode=e,this.world.flight?.stop(),this._entranceFlight&&(this._entranceFlight=null),this._stageTween&&(this._stageTween=null),document.getElementById("sanctuaryWalkPill")||this._initWalkHUD();let s=document.getElementById("sanctuaryWalkPill");s&&s.querySelectorAll(".swp-btn").forEach(l=>{l.classList.toggle("is-active",l.dataset.camMode===e)});let n=document.getElementById("droneTourCard");n&&n.classList.add("hidden");let t=document.getElementById("walkJoystick");if(t){let l="ontouchstart"in window||navigator.maxTouchPoints>0;t.classList.toggle("is-active",e==="walk"&&l)}let a=document.getElementById("walkInstructionsHint");if(e==="walk"){if(this.walkMode=!0,this.tourMode=!1,this.world.controls.enabled=!1,this.world.camera.up.set(0,1,0),this.world._currentRoll=0,!o){this.walkPos.copy(this.world.camera.position),this.walkPos.y=ze(this.walkPos.x,this.walkPos.z)+this.eyeHeight;let l=this.world.camera.getWorldDirection(new A);this.walkYaw=Math.atan2(-l.x,-l.z),this.walkPitch=Math.asin(Math.max(-1,Math.min(1,l.y)))}this.world.camera.position.copy(this.walkPos),a&&a.classList.add("is-active")}else if(e==="tour"){this.walkMode=!1,this.tourMode=!0,this.world.controls.enabled=!1,this.world._tourPaused=!1,this.world._tourSpeed=1,this.world._currentRoll=0,this.world.camera.up.set(0,1,0),this._tourSpline||this._initTourSpline(),(typeof this._tourTime!="number"||isNaN(this._tourTime))&&(this._tourTime=0),a&&a.classList.remove("is-active");let l=(this._tourTime%1+1)%1;this._tourSpline.getPoint(l,this.world._v3TourPos),(isNaN(this.world._v3TourPos.x)||isNaN(this.world._v3TourPos.y)||isNaN(this.world._v3TourPos.z))&&this.world._v3TourPos.set(0,48,960);let f=ze(this.world._v3TourPos.x,this.world._v3TourPos.z)+.8;this.world._v3TourPos.y<f&&(this.world._v3TourPos.y=f),this.world.camera.position.copy(this.world._v3TourPos),this._tourSpline.getTangent(l,this.world._v3TourTan),this.world._v3TourTan.lengthSq()<1e-4||isNaN(this.world._v3TourTan.x)||isNaN(this.world._v3TourTan.y)||isNaN(this.world._v3TourTan.z)?this.world._v3TourTan.set(0,0,-1):this.world._v3TourTan.normalize(),this._calculateTourLookTarget(l,this.world._v3TourPos,this.world._v3TourTan,this.world._v3TourLook),this.world._currentLook||(this.world._currentLook=new A),this.world._currentLook.copy(this.world._v3TourLook),this.world.camera.up.set(0,1,0),this.world._currentRoll=0,this.world.camera.lookAt(this.world._currentLook),this.world._currentQuat=this.world.camera.quaternion.clone(),this._updateTourHUD(l,!0)}else{if(this.walkMode=!1,this.tourMode=!1,this.world.controls.enabled=!0,o){let l=this.world.camera.getWorldDirection(new A);this.world.controls.target.copy(this.world.camera.position).addScaledVector(l,80)}this.world.camera.up.set(0,1,0),this.world._currentRoll=0,a&&a.classList.remove("is-active"),(!this.world.controls.target||this.world.controls.target.lengthSq()<1)&&(this.world.camera.position.set(0,48,960),this.world.controls.target.set(0,36,600)),this.world.controls.update()}}_updateWalk(e){let o=e;if((isNaN(o)||o===void 0||o==null)&&(o=.016),o=Math.min(Math.max(o,5e-4),.0333),this._entranceFlight){let i=this._entranceFlight,S=(performance.now()-i.startTime)/1e3,C=Math.min(1,S/i.duration),O=C<.5?4*C*C*C:1-Math.pow(-2*C+2,3)/2,te=i.spline.getPoint(O,this.world._v3Tmp1),m=i.lookSpline.getPoint(O,this.world._v3Tmp2),E=ze(te.x,te.z),R=this.world._deckY?this.world._deckY(te.z):null,P=Math.max(E+3.2,R!==null?R+3.2:0);if(te.y=Math.max(te.y,P),this.world.camera.up.set(0,1,0),this.world._currentRoll=0,this.world.camera.position.copy(te),this.world.camera.lookAt(m),(te.z<=885||O>=.2)&&!i.crossedThreshold&&(i.crossedThreshold=!0,typeof i.onThresholdCross=="function"&&i.onThresholdCross()),C>=1){let oe=i.targetMode,ne=i.onComplete;this._entranceFlight=null,this.setMode(oe),typeof ne=="function"&&ne()}return}if(this.tourMode){if(this._stageTween){let Pe=this._stageTween;Pe.elapsed+=o;let B=Math.min(1,Pe.elapsed/Pe.duration),X=B<.5?4*B*B*B:1-Math.pow(-2*B+2,3)/2;this.world.camera.position.lerpVectors(Pe.startPos,Pe.endPos,X),this.world._currentLook.lerpVectors(Pe.startLook,Pe.endLook,X),this.world.camera.up.set(0,1,0),this.world._currentRoll=0,this.world.camera.lookAt(this.world._currentLook),B>=1&&(this._stageTween=null);return}let i=this.world._tourPaused?0:1,S=1-Math.exp(-8*o);this.world._tourSpeed+=(i-this.world._tourSpeed)*S;let C=(this._tourTime%1+1)%1,O=1,te=1e3,m=12,E=(this._tourTime%1+1)%1;if(this._tourStages&&this._tourStages.length)for(let Pe=0;Pe<this._tourStages.length;Pe++){let B=this._tourStages[Pe];if(E>=B.tStart&&E<=B.tEnd+1e-5){te=this._stageArc?this._stageArc[Pe]:1e3,m=B.seconds||12;let X=(E-B.tStart)/(B.tEnd-B.tStart),G=B.speedScale||.82,D=Math.abs(X-.5)*2,z=D*D*(3-2*D),W=G+(1-G)*z,ee=(1+G)/2;O=W/ee;break}}let R=(typeof this.world._tourSpeedMultiplier=="number"&&!isNaN(this.world._tourSpeedMultiplier)?this.world._tourSpeedMultiplier:1)*.45,P=te/m*O;this._tourSpline||this._initTourSpline(),this._totalSplineLength||(this._totalSplineLength=this._tourSpline.getLength()||11e3);let oe=this._tourStages?this._tourStages.length:12,ne=1/oe/(m||12);this.world._tourPaused||(this._tourTime+=o*ne*O*this.world._tourSpeed*R),isNaN(this._tourTime)&&(this._tourTime=0);let se=(this._tourTime%1+1)%1;this._tourSpline||this._initTourSpline(),this._tourSpline.getPoint(se,this.world._v3TourPos),(isNaN(this.world._v3TourPos.x)||isNaN(this.world._v3TourPos.y)||isNaN(this.world._v3TourPos.z))&&this.world._v3TourPos.set(0,48,960);let I=ze(this.world._v3TourPos.x,this.world._v3TourPos.z)+.8;this.world._v3TourPos.y<I&&(this.world._v3TourPos.y=I),this._tourSpline.getTangent(se,this.world._v3TourTan),this.world._v3TourTan.lengthSq()<1e-4||isNaN(this.world._v3TourTan.x)||isNaN(this.world._v3TourTan.y)||isNaN(this.world._v3TourTan.z)?this.world._v3TourTan.set(0,0,-1):this.world._v3TourTan.normalize(),this._calculateTourLookTarget(se,this.world._v3TourPos,this.world._v3TourTan,this.world._v3TourLook);let Z=1-Math.exp(-1.5*o);this.world._currentLook||(this.world._currentLook=this.world._v3TourLook.clone()),this.world._currentLook.lerp(this.world._v3TourLook,Z),this.world.camera.position.copy(this.world._v3TourPos),this.world.camera.lookAt(this.world._currentLook);let ie=(se+.002)%1;this.world._v3Tmp1||(this.world._v3Tmp1=new A);let ve=this._tourSpline.getTangent(ie,this.world._v3Tmp1)||this.world._v3Tmp1,De=Math.atan2(-this.world._v3TourTan.x,-this.world._v3TourTan.z),Ke=Math.atan2(-ve.x,-ve.z)-De;Ke>Math.PI&&(Ke-=Math.PI*2),Ke<-Math.PI&&(Ke+=Math.PI*2);let xe=se<=2/oe?0:Math.max(-.25,Math.min(.25,Ke*1.5)),Ce=1-Math.exp(-2*o);this.world._currentRoll=(this.world._currentRoll||0)+(xe-(this.world._currentRoll||0))*Ce,this.world.camera.rotateZ(this.world._currentRoll),this._updateTourHUD(se);return}if(!this.walkMode)return;this.world.camera.up.set(0,1,0);let s=2.4;(this.keysDown.ArrowLeft||this.keysDown.q)&&(this.walkYaw+=s*o),(this.keysDown.ArrowRight||this.keysDown.e)&&(this.walkYaw-=s*o),this.keysDown.ArrowUp&&(this.walkPitch=Math.min(Math.PI*.4,this.walkPitch+s*o)),this.keysDown.ArrowDown&&(this.walkPitch=Math.max(-Math.PI*.4,this.walkPitch-s*o));let n=this.keysDown.Shift?32:16;if(this._walkForward.set(-Math.sin(this.walkYaw),0,-Math.cos(this.walkYaw)),this._walkRight.set(Math.cos(this.walkYaw),0,-Math.sin(this.walkYaw)),this._walkMoveDir.set(0,0,0),this.keysDown.w&&this._walkMoveDir.add(this._walkForward),this.keysDown.s&&this._walkMoveDir.sub(this._walkForward),this.keysDown.d&&this._walkMoveDir.add(this._walkRight),this.keysDown.a&&this._walkMoveDir.sub(this._walkRight),this.world._joystickInput&&this.world._joystickInput.lengthSq()>.001&&(this._walkMoveDir.addScaledVector(this._walkRight,this.world._joystickInput.x),this._walkMoveDir.addScaledVector(this._walkForward,-this.world._joystickInput.y)),this._walkMoveDir.lengthSq()>.001){this._walkMoveDir.normalize().multiplyScalar(n);let i=1-Math.exp(-14*o);this.walkVelocity.lerp(this._walkMoveDir,i)}else{let i=1-Math.exp(-16*o);this.walkVelocity.lerp(this._walkZero,i)}let t=this.walkPos.x+this.walkVelocity.x*o,a=this.walkPos.z+this.walkVelocity.z*o,l=[{x:0,z:20,r:14},{x:-30,z:880,r:8},{x:30,z:880,r:8},{x:0,z:20,r:19.5}],u=t,f=a;for(let i=0;i<l.length;i++){let S=l[i],C=u-S.x,O=f-S.z,te=Math.hypot(C,O);if(te<S.r){let m=(S.r-te)/(te||1);u+=C*m,f+=O*m}}let c=u-K.cathedral.x,p=f-K.cathedral.z,w=Math.abs(c)<6.5&&f<=-610&&f>=-708,b=c>=-48&&c<=0&&Math.abs(p- -34)<6,x=w||b;if(!x){let i=Math.hypot(c,p);if(i<26){let S=(26-i)/(i||1);u+=c*S,f+=p*S}}let V=u-K.buddhistTemple.x,y=f-K.buddhistTemple.z,H=Math.abs(V)<4.2&&y>=-5&&y<=28;if(!H){let i=Math.hypot(V,y);if(i<20){let S=(20-i)/(i||1);u+=V*S,f+=y*S}}let M=u-K.mosque.x,L=f-K.mosque.z,T=Math.abs(M)<13.5&&L>=-22&&L<=36;if(!T){let i=Math.hypot(M,L);if(i<22){let S=(22-i)/(i||1);u+=M*S,f+=L*S}}let N=ze(this.walkPos.x,this.walkPos.z);ze(u,f)-N>1.35&&!x&&!H&&!T&&(u=this.walkPos.x,f=this.walkPos.z,this.walkVelocity.set(0,0,0)),this.walkPos.x=Math.max(-2e3,Math.min(2e3,u)),this.walkPos.z=Math.max(-1e3,Math.min(2600,f));let Y=Math.abs(this.walkPos.x)<16&&this.walkPos.z>=K.bridge.z-55&&this.walkPos.z<=K.bridge.z+55,k;if(Y)k=(this.world._deckY(this.walkPos.z)||2)+.15;else{k=ze(this.walkPos.x,this.walkPos.z);let i=this.walkPos.z>915?K.oceanLevel||.35:K.waterLevel;k<i&&(k=i),Math.abs(this.walkPos.x-K.cathedral.x)<12&&this.walkPos.z<=-615&&this.walkPos.z>=-712||this.walkPos.x<=K.cathedral.x&&this.walkPos.x>=K.cathedral.x-48&&Math.abs(this.walkPos.z-(K.cathedral.z-34))<6.5?k=Math.max(k,K.cathedral.y+2.2):Math.hypot(this.walkPos.x-K.buddhistTemple.x,this.walkPos.z-K.buddhistTemple.z)<15?k=Math.max(k,K.buddhistTemple.y+1.88):Math.hypot(this.walkPos.x-K.mosque.x,this.walkPos.z-(K.mosque.z+7))<24&&(k=Math.max(k,K.mosque.y+2.22))}let h=k+this.eyeHeight,v=1-Math.exp(-20*o);this.walkPos.y+=(h-this.walkPos.y)*v,this.walkPos.y<k+.4&&(this.walkPos.y=k+.4);let g=this.walkVelocity.length()>.5?Math.sin(performance.now()*.012)*.05:0;this.world.camera.position.set(this.walkPos.x,this.walkPos.y+g,this.walkPos.z),this._walkLookDir.set(-Math.sin(this.walkYaw)*Math.cos(this.walkPitch),Math.sin(this.walkPitch),-Math.cos(this.walkYaw)*Math.cos(this.walkPitch)),this._walkLookTarget.copy(this.world.camera.position).add(this._walkLookDir),this.world.camera.lookAt(this._walkLookTarget)}flyToPlot(e){this.world.selectPlot(e)}flyToDistrict(e,o){if(o){this.flyToPlot(o);return}let s={meadows:{x:-120,y:22,z:380,dist:180},canopy:{x:-180,y:35,z:-120,dist:180},woodland:{x:-180,y:35,z:-120,dist:180},riverbank:{x:180,y:24,z:260,dist:160},lakefront:{x:180,y:24,z:260,dist:160},starlight:{x:20,y:36,z:2100,dist:220},beach:{x:20,y:36,z:2100,dist:220},kaya_island:{x:20,y:36,z:2100,dist:220},highland:{x:0,y:220,z:-680,dist:220},summit:{x:-360,y:92,z:-380,dist:220},highland_sanctuary:{x:0,y:220,z:-680,dist:220},all:{x:0,y:160,z:720,dist:380},overview:{x:0,y:80,z:550,dist:2600},desert:{x:-460,y:42,z:340,dist:220},underwater:{x:380,y:-2,z:-250,dist:120},desert_bloom:{x:-460,y:42,z:340,dist:220},mosque:{x:-480,y:104,z:-200,dist:170},pagoda:{x:560,y:140,z:-540,dist:180},waterfall:{x:0,y:95,z:-460,dist:180},lake:{x:380,y:16,z:-250,dist:190},bridge:{x:0,y:14,z:440,dist:150},gate:{x:0,y:32,z:880,dist:160},cathedral:{x:typeof K<"u"&&K.cathedral?K.cathedral.x:0,y:225,z:typeof K<"u"&&K.cathedral?K.cathedral.z:-687,dist:160},cathedral_interior:{x:typeof K<"u"&&K.cathedral?K.cathedral.x:0,y:216,z:typeof K<"u"&&K.cathedral?K.cathedral.z-10:-697,dist:35},desert_interior:{x:-460,y:45,z:340,dist:28},mosque_interior:{x:typeof K<"u"&&K.mosque?K.mosque.x:-480,y:110,z:typeof K<"u"&&K.mosque?K.mosque.z-10:-200,dist:30},pagoda_interior:{x:typeof K<"u"&&K.buddhistTemple?K.buddhistTemple.x:560,y:144,z:typeof K<"u"&&K.buddhistTemple?K.buddhistTemple.z-10:-540,dist:30}};if(e==="underwater"){let a=new A(380,-4,-250),l=new A(380,-2,-220);this._flyToExplicit(l,a,1.4);return}if(e==="cathedral"||e==="cathedral_exterior"){this.flyToCathedral("exterior");return}if(e==="cathedral_interior"){this.flyToCathedral("interior");return}if(e==="desert_interior"){let a=new A(-460,44,335),l=new A(-460,45,355);this._flyToExplicit(l,a,1.4);return}if(e==="mosque_interior"){let a=typeof K<"u"&&K.mosque?K.mosque.x:-480,l=typeof K<"u"&&K.mosque?K.mosque.z:-200,u=new A(a,112,l-20),f=new A(a,110,l+16);this._flyToExplicit(f,u,1.4);return}if(e==="pagoda_interior"){let a=typeof K<"u"&&K.buddhistTemple?K.buddhistTemple.x:560,l=typeof K<"u"&&K.buddhistTemple?K.buddhistTemple.z:-540,u=new A(a,146,l-20),f=new A(a,144,l+16);this._flyToExplicit(f,u,1.4);return}let n=s[e]||s.all,t=n.y!==void 0?n.y:ze(n.x,n.z);ba.set(n.x,t,n.z),this.flyTo(ba,n.dist||200,1.4)}flyToCathedral(e="exterior"){let o=typeof K<"u"&&K.cathedral?K.cathedral.x:0,s=typeof K<"u"&&K.cathedral?K.cathedral.z:-687,n=typeof K<"u"&&K.cathedral?K.cathedral.y:182;if(e==="interior"){let t=new A(o,n+34,s-26),a=new A(o,n+32,s+18);this._flyToExplicit(a,t,1.4)}else{let t=new A(o,n+42,s-10),a=new A(o-75,n+68,s+195);this._flyToExplicit(a,t,1.4)}}_flyToExplicit(e,o,s=1.4){this._entranceFlight=null,this.walkMode=!1,this.tourMode=!1,this.world.controls&&(this.world.controls.enabled=!0),this.world._flyTween&&(this.world._flyTween=null),this._flyStartT||(this._flyStartT=new A),this._flyStartP||(this._flyStartP=new A),this._flyEndP||(this._flyEndP=new A),this._flyTarget||(this._flyTarget=new A),this._flyStartT.copy(this.world.controls.target),this._flyStartP.copy(this.world.camera.position),this._flyTarget.copy(o),this._flyEndP.copy(e);let n=this._flyStartT,t=this._flyStartP,a=this._flyEndP,l=this._flyTarget,u=performance.now(),f=s*1e3;this.world._flyTween=()=>{let c=Math.min(1,(performance.now()-u)/f),p=c<.5?2*c*c:1-Math.pow(-2*c+2,2)/2;this.world.controls.target.lerpVectors(n,l,p),this.world.camera.position.lerpVectors(t,a,p),this.world.camera.up.set(0,1,0),this.world._currentRoll=0,c>=1&&(this.world._flyTween=null)}}flyTo(e,o,s=1.2){this._entranceFlight=null,this.walkMode=!1,this.tourMode=!1,this.world.controls&&(this.world.controls.enabled=!0),this.world._flyTween&&(this.world._flyTween=null),this._flyStartT||(this._flyStartT=new A),this._flyStartP||(this._flyStartP=new A),this._flyEndP||(this._flyEndP=new A),this._flyDir||(this._flyDir=new A),this._flyTarget||(this._flyTarget=new A),this._flyStartT.copy(this.world.controls.target),this._flyStartP.copy(this.world.camera.position),this._flyTarget.copy(e),this._flyDir.subVectors(this._flyStartP,this._flyStartT).normalize(),this._flyDir.y<.35&&(this._flyDir.y=.55),this._flyDir.normalize(),this._flyEndP.copy(this._flyTarget).addScaledVector(this._flyDir,o);let n=this._flyStartT,t=this._flyStartP,a=this._flyEndP,l=this._flyTarget,u=performance.now(),f=s*1e3;this.world._flyTween=()=>{let c=Math.min(1,(performance.now()-u)/f),p=c<.5?2*c*c:1-Math.pow(-2*c+2,2)/2;this.world.controls.target.lerpVectors(n,l,p),this.world.camera.position.lerpVectors(t,a,p),this.world.camera.up.set(0,1,0),this.world._currentRoll=0,c>=1&&(this.world._flyTween=null)}}};var ja=(ye,e=!1)=>{if(!ye||!Array.isArray(ye)||ye.length===0)return null;let o=ye.filter(f=>f&&f.attributes&&f.attributes.position);if(o.length===0)return null;if(o.length===1)return o[0];let s=!1,n=!1,t=!1,a=!1,l=!1;for(let f of o)f.index?s=!0:n=!0,f.attributes.color&&(t=!0),f.attributes.uv&&(a=!0),f.attributes.normal&&(l=!0);let u=o.map(f=>{let c=f,p=!1,w=s&&n&&f.index,b=l&&!f.attributes.normal||a&&!f.attributes.uv||t&&!f.attributes.color||!t&&f.attributes.color;if(w?(c=f.toNonIndexed(),p=!0):b&&(c=f.clone(),p=!0),l&&!c.attributes.normal&&c.computeVertexNormals(),a&&!c.attributes.uv){let x=c.attributes.position.count,V=new Float32Array(x*2);c.setAttribute("uv",new tt(V,2))}if(t&&!c.attributes.color){let x=c.attributes.position.count,V=new Float32Array(x*3).fill(1);c.setAttribute("color",new tt(V,3))}else!t&&c.attributes.color&&c.deleteAttribute("color");return c});try{let f=Is(u,e);return u.forEach((c,p)=>{c!==o[p]&&c.dispose()}),f&&o.forEach(c=>c.dispose()),f}catch(f){return console.warn("[world3d] mergeGeometries fallback:",f),null}},ro=ja;var Ka=pe.leafCard;pe.leafCard=function(...ye){let e=Ka.apply(this,ye);return e.transparent=!1,e.alphaTest=.5,e.depthWrite=!0,e};var $a=pe.pineNeedles;pe.pineNeedles=function(...ye){let e=$a.apply(this,ye);return e.transparent=!1,e.alphaTest=.5,e.depthWrite=!0,e};var Ja=pe.cypressFoliage;pe.cypressFoliage=function(...ye){let e=Ja.apply(this,ye);return e.transparent=!1,e.alphaTest=.5,e.depthWrite=!0,e};var Qa=pe.sakuraBlossom;pe.sakuraBlossom=function(...ye){let e=Qa.apply(this,ye);return e.transparent=!1,e.alphaTest=.45,e.depthWrite=!0,e};var dc=new Me(12563354),rn=new A,er=new A,tr=new A,or=new A,sr=new Me,nr=new Me,ar=new so,rr=new _t;function $o(ye,e=.08,o=.28,s=17){if(!ye||!ye.attributes||!ye.attributes.position)return ye;let n=ye.attributes.position;for(let t=0;t<n.count;t++){let a=n.getX(t),l=n.getY(t),u=n.getZ(t);(isNaN(a)||!isFinite(a))&&(a=0),(isNaN(l)||!isFinite(l))&&(l=0),(isNaN(u)||!isFinite(u))&&(u=0);let f=(jt(a*e+s,u*e+s,2)-.5)*o,c=(jt(l*e*1.5+s*2,a*e+s,2)-.5)*(o*.6),p=isNaN(f)?a:a+f,w=isNaN(c)?l:l+c,b=isNaN(f)?u:u+f;n.setXYZ(t,p,w,b)}return n.needsUpdate=!0,ye.computeVertexNormals(),ye.computeBoundingSphere&&ye.computeBoundingSphere(),ye.computeBoundingBox&&ye.computeBoundingBox(),ye}function uc(ye,e=0,o=.45){if(!ye||!ye.attributes.position)return ye;let s=ye.attributes.position,n=ye.attributes.normal,t=new Float32Array(s.count*3);for(let a=0;a<s.count;a++){let l=s.getY(a),u=n?n.getY(a):0,f=Math.max(0,Math.min(1,(l-e)/4)),c=Math.max(0,u*.5+.5),p=Math.max(.35,Math.min(1,.45+.35*f+.2*c));t[a*3]=p,t[a*3+1]=p,t[a*3+2]=p}return ye.setAttribute("color",new tt(t,3)),ye}var cn=class{constructor(e,o=[],s){this.canvas=e||(typeof document<"u"?document.getElementById("canvas3d")||document.querySelector("canvas#canvas3d")||document.createElement("canvas"):null),this.plots=(o||[]).map(n=>({...n,h:ze(n.x,n.z)})),this.onPlotClick=s,this.clock=new ra,this.assetLoader=new Bs(this),this.lighting=new Ls(this),this.terrain=new Fs(this),this.tourController=new Ns(this),this.pickables=[],this.plotMeshIndex=new Map,this._flyTween=null,this._v3TourPos=new A,this._v3TourTan=new A,this._v3TourLook=new A,this._v3TourTarget=new A,this._tourCamPos=new A,this._currentLook=new A,this._tmpV3=new A,this._v3Tmp1=new A,this._v3Tmp2=new A,this._v3Tmp3=new A,this._v3Tmp4=new A,this._v3WorldUp=new A(0,1,0),this._v3Temp1=rn,this._v3Temp2=er,this._v3Temp3=tr,this._v3Temp4=or,this._colTemp=sr,this._colTemp2=nr,this._quatTemp=ar,this._mat4Temp=rr,this._currentRoll=0,this._tourSpeed=1,this._tourPaused=!1,this._tourSpeedMultiplier=1,this._activeStageIndex=0,this._joystickInput=new kt(0,0),this._origFogColor=new Me(9484504),this._origBgColor=new Me(9484504),this._origFogDensity=65e-6,this._origFogNear=1200,this._origFogFar=18e3,this._isUnderwaterState=!1,this._underwaterBlend=0,this._underwaterTargetFog=new Me(3717344),this._underwaterTargetBg=new Me(2390168),this._currentFogColor=new Me(9484504),this._currentBgColor=new Me(9484504),this._fpsBuffer=new Float32Array(120),this._fpsHead=0,this._fpsCount=0,this._lastFpsTime=0,this._lastFpsHudUpdate=0,this._fpsPill=null,this._fpsTextEl=null,this._renderScale=1,this._qualityTier=Gn(),this._qualityLocked=!!Yo[this._qualityTier],Yo[this._qualityTier]||(this._qualityTier=Os({width:window.innerWidth,memory:navigator.deviceMemory,cores:navigator.hardwareConcurrency,saveData:navigator.connection?.saveData})),this.quality=Yo[this._qualityTier],this._shadowPosition=new A(1/0,1/0,1/0),this._shadowQuaternion=new so,this._lastShadowTime=0,this._benchFrames=0,this._benchTime=0,this._lastScaleChange=0,this._init()}_init(){let e=typeof window<"u"&&(/Mobi|Android/i.test(navigator.userAgent)||window.innerWidth<=768),o=new jn({canvas:this.canvas,antialias:!e,powerPreference:"high-performance",preserveDrawingBuffer:!1,logarithmicDepthBuffer:!0});o.autoClear=!0;let s=this.quality.dpr;o.setPixelRatio(Math.min(window.devicePixelRatio,s)),o.shadowMap.enabled=!0,o.shadowMap.type=Ln,o.shadowMap.autoUpdate=!1,o.shadowMap.needsUpdate=!0,o.toneMapping=Nn,o.toneMappingExposure=.92,o.outputColorSpace=bs;let n=o.getContext();n&&n.enable&&n.SAMPLE_ALPHA_TO_COVERAGE&&n.enable(n.SAMPLE_ALPHA_TO_COVERAGE),this.renderer=o,this.lighting.useComposer=!1,typeof window<"u"&&(window.__rbvWorld=this);let t=new Hs;t.fog=new Kn(9484504,65e-6),this.scene=t,console.log("[World3D] scene created");let a=new Zn(35,1,2,7500);a.position.set(160,120,740),a.lookAt(0,65,-250),a.updateProjectionMatrix(),this.camera=a,console.log("[World3D] camera created");let l=new ha(a,this.canvas);l.enableDamping=!0,l.dampingFactor=.05,l.minPolarAngle=Math.PI*.02,l.maxPolarAngle=Math.PI*.49,l.minDistance=20,l.maxDistance=2800,l.target.set(0,65,-250),l.update(),this.controls=l,this.season=Dn(),this.lighting.mood="clear",this.lighting._forcedPhase={key:"day",t:.5},this._reflectiveMeshes=[],this._windMaterials=[],this._glowTex=this.assetLoader._buildGlowTexture(),this._fpsFrames=[],this._lastFpsHudUpdate=0,this._lastFpsTime=0,this.lighting._lights(),this.lighting._sky(),this.lighting._stars(),this.lighting._horizon(),this.lighting._cloudScape(),this._ambienceTimer=setInterval(()=>this.lighting.applyAmbience(),6e4),Bn().then(f=>{this.lighting.mood=f.mood,this.lighting.applyAmbience(),this.onAmbience?.(f,this.season)}).catch(f=>console.log("[world3d] fetchWeather failed:",f));let u;this._resizeHandler=()=>{clearTimeout(u),u=setTimeout(()=>this._resize(),100)},typeof window<"u"&&window.addEventListener("resize",this._resizeHandler),this._visibilityHandler=()=>{document.hidden?(this._resumeOnVisible=this._running,this.stop()):this._resumeOnVisible&&(this._resumeOnVisible=!1,this.start())},document.addEventListener("visibilitychange",this._visibilityHandler),this._resize(),this._running=!0,this._animate()}async initAsync(){this._shadowMaterials=new Set;let e=async(s,n,t=!1)=>{if(await new Promise(l=>setTimeout(l,0)),this._disposed)return;let a=this.scene.children.length;try{await n();for(let l of this.scene.children.slice(a))l.name||(l.name=s),l.traverse(u=>{if(!u.isMesh||!u.material)return;let f=Array.isArray(u.material)?u.material:[u.material];for(let c of f)!c.isMeshStandardMaterial&&!c.isMeshPhongMaterial&&!c.isMeshLambertMaterial||this._shadowMaterials.has(c)||(this.lighting.csm?.setupMaterial(c),this._shadowMaterials.add(c))});this.renderer.shadowMap.needsUpdate=!0}catch(l){if(t)throw l;console.warn(`[world] ${s} unavailable`,l)}},o=this.terrain;await e("Terrain",()=>o._terrain(),!0),await e("Mountains",()=>this._backgroundMountains()),await e("Water",()=>o._water()),await e("River",()=>o._river()),await e("roads",()=>o._roads()),await e("gate",()=>o._gate()),await e("plaza",()=>o._plaza()),await e("rainbowBridge",()=>o._rainbowBridge()),await e("vegetation",()=>o._vegetation()),await e("plots",()=>this._plots(),!0),this._picking(),this._initAmbienceControls(),this.tourController._setupWalkControls(),this.tourController._initWalkHUD(),this.tourController._initFPSHUD(),this.tourController.setMode("orbit"),this.lighting.applyAmbience(),this._resize(),await this.warmup(),!this._disposed&&(this.assetLoader._loadHDRI(),this.detailsReady=(async()=>{await new Promise(s=>setTimeout(s,250));for(let[s,n]of[["mountainWaterfall","_mountainWaterfall"],["oceanWaterfall","_oceanWaterfall"],["coastalCliff","_coastalCliff"],["highlandSanctuary","_highlandSanctuary"],["pawprints","_pawprints"],["meadowCarpet","_meadowCarpet"],["blooms","_blooms"],["districtFeatures","_districtFeatures"],["sanctuaryTree","_sanctuaryTree"],["riverLanterns","_riverLanterns3D"],["celestialMotes","_celestialMotes"],["universalCathedral","_universalCathedral"],["moorishMosque","_moorishMosque"],["buddhistPagoda","_buddhistPagoda"],["kayaIsland","_kayaIsland"],["underwaterWorld","_underwaterWorld"]]){if(this._disposed)break;await e(s,()=>o[n]())}this._disposed||this.lighting.applyAmbience()})().catch(s=>console.warn("[world] detail streaming stopped",s)))}startDroneTour(e){(window.VeoTour||window.veoTour)?.stop(),this._flyTween=null,this.tourController.setMode("orbit"),this.flight||=new ks(this),this.flight.start(e),this.cameraMode="tour",document.querySelectorAll("#sanctuaryWalkPill [data-cam-mode]").forEach(o=>{o.classList.toggle("is-active",o.dataset.camMode==="tour")}),this.start()}setMode(e){if(e==="tour"){this.startDroneTour();return}this.flight?.stop(),(window.VeoTour||window.veoTour)?.stop(),this.tourController.setMode(e)}start(){this._running=!0,this.clock&&!this.clock.running&&this.clock.start(),this._resize(),this._raf||(this._raf=requestAnimationFrame(()=>this._animate()))}stop(){this._running=!1,this.clock.stop(),this._lastFpsTime=0,this._raf&&(cancelAnimationFrame(this._raf),this._raf=null)}animate(){this._animate()}resize(){this._resize()}async warmup(){if(!(!this.renderer||!this.scene||!this.camera))try{this.lighting._updateEnvironment(),typeof this.renderer.compileAsync=="function"?await this.renderer.compileAsync(this.scene,this.camera):typeof this.renderer.compile=="function"&&this.renderer.compile(this.scene,this.camera),this.lighting.useComposer&&this.lighting.composer?this.lighting.composer.render():this.renderer.render(this.scene,this.camera)}catch(e){console.log("[world3d] warmup error:",e)}}_resize(){let e=this.canvas.clientWidth||this.canvas.parentElement?.clientWidth||window.innerWidth,o=this.canvas.clientHeight||this.canvas.parentElement?.clientHeight||window.innerHeight;if(e<100||o<100)return;let s=typeof window<"u"&&(/Mobi|Android/i.test(navigator.userAgent)||window.innerWidth<=768),n=this.quality.dpr,t=Math.min(window.devicePixelRatio||1,n)*this._renderScale;this.renderer.setPixelRatio(t),this.renderer.setSize(e,o,!0);let a=this.quality.post&&this._renderScale>=.8;a&&!this.lighting.composer&&this.lighting._composer();let l=this.lighting.composer;this.lighting.useComposer=a&&!!l,l&&(l.setPixelRatio(t),l.setSize(e,o),this.lighting.bloomPass?.setSize(Math.ceil(e*t/2),Math.ceil(o*t/2)),this.lighting._fxaaPass.uniforms.resolution.value.set(1/(e*t),1/(o*t))),this.camera.aspect=e/o,this.camera.updateProjectionMatrix(),this.lighting.csm?.updateFrustums(),this.renderer.shadowMap.needsUpdate=!0,this.lighting._cinematicPass?.uniforms?.uResolution&&this.lighting._cinematicPass.uniforms.uResolution.value.set(e,o)}async _backgroundMountains(){let e=new bo(2200,5300,this.quality.mountain,64);e.rotateX(-Math.PI/2);let o=e.attributes.position;for(let t=0;t<o.count;t++)t%2048===0&&await new Promise(a=>setTimeout(a,0)),o.setY(t,_n(o.getX(t),o.getZ(t)));e.computeVertexNormals(),e.setAttribute("aCreviceAO",new tt(new Float32Array(o.count).fill(.9),1)),e.computeBoundingSphere();let s=zs(this.renderer,{snowMin:950,snowMax:1420}),n=new r(e,s);n.name="Mountain terrain",n.receiveShadow=!0,this.scene.add(n)}_plots(){let e=[],o=[];for(let U of this.plots){if(!U.quaternion){let Ce=ze(U.x,U.z-.5),Pe=ze(U.x,U.z+.5),B=ze(U.x-.5,U.z),X=ze(U.x+.5,U.z);U.normal=new A(B-X,2*.5,Ce-Pe).normalize(),U.quaternion=new so().setFromUnitVectors(new A(0,1,0),U.normal).multiply(new so().setFromAxisAngle(new A(0,1,0),U.rot))}(U.status==="available"?e:o).push(U)}let s=new Lt,n=document.createElement("canvas");n.width=n.height=128;let t=n.getContext("2d"),a=t.createRadialGradient(64,64,8,64,64,64);a.addColorStop(0,"rgba(0, 0, 0, 0.68)"),a.addColorStop(.5,"rgba(0, 0, 0, 0.32)"),a.addColorStop(.85,"rgba(0, 0, 0, 0.08)"),a.addColorStop(1,"rgba(0, 0, 0, 0)"),t.fillStyle=a,t.fillRect(0,0,128,128);let l=new Kt(n),u=new Ct({map:l,transparent:!0,depthWrite:!1}),f=new Mt({transparent:!0,depthWrite:!1,side:gt,blending:Ht,uniforms:{uTime:{value:0}},vertexShader:`
        #include <common>
        #include <logdepthbuf_pars_vertex>
        #include <fog_pars_vertex>
        varying vec2 vUv;
        varying vec3 vColor;
        void main() {
          vUv = uv;
          vColor = instanceColor;
          vec4 mvPosition = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
                  #include <logdepthbuf_vertex>
          #include <fog_vertex>
        }
      `,fragmentShader:`
        #include <logdepthbuf_pars_fragment>
        #include <fog_pars_fragment>
        uniform float uTime;
        varying vec3 vColor;
        varying vec2 vUv;
        void main() {
          float dist = length(vUv - vec2(0.5));
          float ring = smoothstep(0.40, 0.46, dist) - smoothstep(0.46, 0.50, dist);
          float pulse = (sin(uTime * 2.5 - dist * 8.0) * 0.5 + 0.5) * 0.75 + 0.25;
          float glow = ring * pulse * (1.0 - dist * 2.0);
          gl_FragColor = vec4(vColor, glow * 0.85);
                  #include <logdepthbuf_fragment>
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
          #include <fog_fragment>
        }
      `});this._beaconMat=f;let c=(U,xe=!1)=>{if(!U.length)return null;let Ce=new ce(1,.4,1);Ce.translate(0,.2,0),Ce.computeBoundingSphere();let Pe=new Ct({visible:!1}),B=new ut(Ce,Pe,U.length);if(U.forEach((X,G)=>{let[D,z]=Po[X.size]||[10,14],W=ze(X.x,X.z);s.position.set(X.x,W+.15,X.z),s.quaternion.copy(X.quaternion),s.scale.set(D,1,z),s.updateMatrix(),B.setMatrixAt(G,s.matrix)}),B.instanceMatrix.needsUpdate=!0,typeof B.computeBoundingSphere=="function"&&B.computeBoundingSphere(),typeof B.computeBoundingBox=="function"&&B.computeBoundingBox(),B.frustumCulled=!1,this.scene.add(B),!xe){let X=new ct(1,1);X.rotateX(-Math.PI/2),X.computeBoundingSphere();let G=new ut(X,u,U.length);U.forEach((we,_e)=>{let[Ze,Oe]=Po[we.size]||[10,14],st=ze(we.x,we.z);s.position.set(we.x,st+.18,we.z),s.quaternion.copy(we.quaternion),s.scale.set(Ze*1.35,1,Oe*1.35),s.updateMatrix(),G.setMatrixAt(_e,s.matrix)}),G.instanceMatrix.needsUpdate=!0,G.frustumCulled=!1,this.scene.add(G),this.terrain._decorMeshes=this.terrain._decorMeshes||[],this.terrain._decorMeshes.push(G);let D=new ce(1,.35,1);D.translate(0,.18,0),D.computeBoundingSphere();let z=pe.agedCaenLimestone(2),W=new ut(D,z,U.length),ee=new ce(1,.08,1);ee.translate(0,.36,0),ee.computeBoundingSphere();let ue=pe.groundDetail(2),ge=new ut(ee,ue,U.length);U.forEach((we,_e)=>{let[Ze,Oe]=Po[we.size]||[10,14],st=ze(we.x,we.z);s.position.set(we.x,st+.15,we.z),s.quaternion.copy(we.quaternion),s.scale.set(Ze*.96,1,Oe*.96),s.updateMatrix(),W.setMatrixAt(_e,s.matrix),s.scale.set(Ze*.88,1,Oe*.88),s.updateMatrix(),ge.setMatrixAt(_e,s.matrix)}),W.instanceMatrix.needsUpdate=!0,ge.instanceMatrix.needsUpdate=!0,W.receiveShadow=W.castShadow=!0,ge.receiveShadow=!0,W.frustumCulled=ge.frustumCulled=!1,this.scene.add(W),this.scene.add(ge),this.terrain._decorMeshes.push(W,ge)}if(xe){let X=new ct(1,1);X.rotateX(-Math.PI/2),X.computeBoundingSphere();let G=new ut(X,f,U.length);G.instanceColor=new Ft(new Float32Array(U.length*3),3);let D=new F(.12,.16,.45,6);D.translate(0,.18,0),D.computeBoundingSphere();let z=new Ot({color:16777215,emissive:0,emissiveIntensity:0,roughness:.35,metalness:.8}),W=new ut(D,z,U.length*4);W.instanceColor=new Ft(new Float32Array(U.length*4*3),3);let ee={1:{corner:new Me(9072698),beacon:new Me(13942395)},2:{corner:new Me(10529461),beacon:new Me(13162728)},3:{corner:new Me(13938487),beacon:new Me(16771696)}},ue=0;U.forEach((ge,we)=>{let _e=ge.tier||(ge.size==="estate"?3:ge.size==="premium"?2:1),Ze=ee[_e]||ee[1],[Oe,st]=Po[ge.size]||[10,14],vt=ze(ge.x,ge.z);s.position.set(ge.x,vt+.2,ge.z),s.quaternion.copy(ge.quaternion),s.scale.set(Math.max(Oe,st)*1.2,1,Math.max(Oe,st)*1.2),s.updateMatrix(),G.setMatrixAt(we,s.matrix),G.setColorAt(we,Ze.beacon);let At=Oe*.5-.2,pt=st*.5-.2,Tt=[[-At,-pt],[At,-pt],[-At,pt],[At,pt]];for(let[xt,Pt]of Tt){let St=xt*Math.cos(ge.rot)+Pt*Math.sin(ge.rot),Gt=-xt*Math.sin(ge.rot)+Pt*Math.cos(ge.rot),Nt=ze(ge.x+St,ge.z+Gt);s.position.set(ge.x+St,Nt+.15,ge.z+Gt),s.rotation.set(0,0,0),s.scale.set(1,1,1),s.updateMatrix(),W.setMatrixAt(ue,s.matrix),W.setColorAt(ue,Ze.corner),ue++}}),G.instanceMatrix.needsUpdate=!0,G.instanceColor.needsUpdate=!0,G.frustumCulled=!1,this.scene.add(G),W.instanceMatrix.needsUpdate=!0,W.instanceColor.needsUpdate=!0,W.castShadow=!0,W.frustumCulled=!1,this.scene.add(W),this.terrain._decorMeshes=this.terrain._decorMeshes||[],this.terrain._decorMeshes.push(G,W)}return this.pickables.push(B),this.plotMeshIndex.set(B,U),B};this.availMesh=c(e,!0),this.occupMesh=c(o,!1);let p={headstone:[0,-2],flowers:[0,3.5],tree:[-3.8,-3.8],bench:[4.2,-1],lantern:[-4.2,-1],candle:[1.5,3.2],ball:[-1.5,3.2],bone:[1.8,3.8],wreath:[0,2.5],fountain:[-4,-1],memorial_crystal:[0,0],coral_brain:[-2.8,-2.8],coral_staghorn:[2.8,-3.5],sea_anemone:[-1.8,2.8],crystal_lotus:[0,0],jade_stones:[-1.8,2.2],lily_pad:[2.2,3.2],mossy_boulder:[0,0],cactus:[0,0]},w={},b=(U,xe,Ce={},Pe=1,B=null,X=null)=>{let[G,D]=p[Ce.type||U]||[0,0],z=B??Ce.dx??G,W=X??Ce.dz??D,ee=z*Math.cos(xe.rot)+W*Math.sin(xe.rot),ue=-z*Math.sin(xe.rot)+W*Math.cos(xe.rot),ge=ze(xe.x+ee,xe.z+ue);s.position.set(xe.x+ee,ge,xe.z+ue),s.quaternion.copy(xe.quaternion),s.scale.setScalar(Pe),s.updateMatrix(),w[U]||={mats:[],colors:[]},w[U].mats.push(s.matrix.clone());let we={flowers:14051978,tree:6197070,ball:13166666};w[U].colors.push(Ce.color||we[Ce.type]||null)};for(let U of o){let xe=U.district==="kaya_reef",Ce=U.district==="lake_submerged",Pe=U.district==="highland_rapids",B=U.tier||(U.size==="estate"?3:U.size==="premium"?2:1),[X,G]=Po[U.size]||[10,14],D=X*.5-1.2,z=G*.5-1.5;xe?(b("memorial_crystal",U,{},1.3,0,0),b("coral_brain",U,{},1.1,-D*.7,-z*.6),b("coral_staghorn",U,{},1.2,D*.7,-z*.7),b("sea_anemone",U,{},1,-D*.5,z*.6)):Ce?(b("crystal_lotus",U,{},1.2,0,0),b("jade_stones",U,{},1,-D*.6,-z*.5),b("lily_pad",U,{},1.4,D*.6,z*.6)):Pe?b("mossy_boulder",U,{},1.4,0,-z*.5):U.district==="desert"?(b("cactus",U,{},1,0,-z*.5),b("hs_classic",U,{type:"headstone",style:"classic"},1,0,-z+1.2),b("flowers",U,{type:"flowers"},1,0,z-1.5),B>1&&b("bench",U,{type:"bench"},1,D*.7,-z*.2),b("flowers",U,{type:"flowers"},1.1,D*.5,z*.5)):B===1?(b("hs_classic",U,{type:"headstone",style:"classic"},1,0,-z+1.2),b("flowers",U,{type:"flowers"},1,0,z-1.5),b("candle",U,{type:"candle"},1,-D*.5,z-1.5)):B===2?(b("tree",U,{type:"tree"},1.3,-D*.6,-z*.6),b("hs_slab",U,{type:"headstone",style:"slab"},1.1,0,-z*.2),b("flowers",U,{type:"flowers"},1.2,D*.5,z*.6),b("bench",U,{type:"bench"},1,D*.7,-z*.2),b("lantern",U,{type:"lantern"},1,-D*.6,z*.6)):B===3&&(b("hs_obelisk",U,{type:"headstone",style:"obelisk"},1.3,0,-z*.4),b("lantern",U,{type:"lantern"},1.1,-D*.7,-z*.4),b("lantern",U,{type:"lantern"},1.1,D*.7,-z*.4),b("fountain",U,{type:"fountain"},1,-D*.6,z*.6),b("fountain_water",U,{type:"fountain"},1,-D*.6,z*.6),b("wreath",U,{type:"wreath"},1.2,D*.6,z*.6))}let x=pe.granite(1),V=pe.honedCarraraMarble(1),y=(U,xe,Ce,Pe=0,B=!1)=>{let X=w[U];if(!X?.mats.length)return;xe.computeBoundingSphere&&xe.computeBoundingSphere();let G=new ut(xe,Ce,X.mats.length);B&&(G.instanceColor=new Ft(new Float32Array(X.mats.length*3),3));let D=new _t,z=new _t().makeTranslation(0,Pe,0),W=new Me;X.mats.forEach((ee,ue)=>{D.copy(ee).multiply(z),G.setMatrixAt(ue,D),B&&G.setColorAt(ue,W.setHex(X.colors[ue]??16777215))}),G.instanceMatrix.needsUpdate=!0,B&&G.instanceColor&&(G.instanceColor.needsUpdate=!0),typeof G.computeBoundingSphere=="function"&&G.computeBoundingSphere(),typeof G.computeBoundingBox=="function"&&G.computeBoundingBox(),G.castShadow=!0,G.receiveShadow=!0,G.frustumCulled=!1,this.scene.add(G),this.terrain._decorMeshes.push(G)};this.terrain._decorMeshes=this.terrain._decorMeshes||[];let H=(()=>{let U=[],xe=new ce(4.8,.45,1.8);xe.translate(0,.225,0),U.push(xe);let Ce=new ce(4,3.6,.9);Ce.translate(0,2.25,0),U.push(Ce);let Pe=new F(2,2,.9,16,1,!1,0,Math.PI);Pe.rotateZ(Math.PI/2),Pe.rotateY(Math.PI/2),Pe.translate(0,4.05,0),U.push(Pe);let B=new ce(3.2,2.2,.08);return B.translate(0,2.35,.46),U.push(B),$o(ro(U,!1)||Ce,.06,.12,51)})(),M=(()=>{let U=[],xe=new ce(4.4,.5,4.4);xe.translate(0,.25,0),U.push(xe);let Ce=new ce(3.4,.5,3.4);Ce.translate(0,.75,0),U.push(Ce);let Pe=new F(1.2,1.8,6.2,4);Pe.rotateY(Math.PI/4),Pe.translate(0,4.1,0),U.push(Pe);let B=new lt(1.2,1.5,4);return B.rotateY(Math.PI/4),B.translate(0,7.95,0),U.push(B),$o(ro(U,!1)||xe,.06,.1,57)})(),L=(()=>{let U=[],xe=new ce(6.4,.35,4.4);xe.translate(0,.175,0),U.push(xe);let Ce=new ce(5.4,.35,3.4);Ce.translate(0,.4,0),U.push(Ce);let Pe=new ce(4.2,.04,2.4);return Pe.translate(0,.58,0),U.push(Pe),$o(ro(U,!1)||xe,.05,.1,63)})();y("hs_classic",H,V,0),y("hs_obelisk",M,V,0),y("hs_slab",L,x,0);let T=(()=>{let U=[],xe=new F(.4,.25,1.2,12);xe.translate(0,.6,0),U.push(xe);let Ce=new dt(.42,.06,8,16);Ce.rotateX(Math.PI/2),Ce.translate(0,1.2,0),U.push(Ce);for(let Pe=0;Pe<4;Pe++){let B=Pe/4*Math.PI,X=new ct(1.6,1.8);X.translate(0,1.85,0),X.rotateY(B),U.push(X)}return ro(U,!1)||xe})(),N=(()=>{let U=[],xe=new dt(1.1,.32,12,24);xe.rotateX(-.35),xe.translate(0,.38,0),U.push(xe);for(let Ce=0;Ce<8;Ce++){let Pe=Ce/8*Math.PI*2,B=new rt(.22,8,6);B.scale(1,.6,1),B.rotateX(-.35),B.translate(Math.cos(Pe)*1.1,.38+Math.sin(Pe)*.4,Math.sin(Pe)*.85),U.push(B)}return ro(U,!1)||xe})(),q=(()=>{let U=[],xe=new ce(1.1,.18,1.1);xe.translate(0,.09,0),U.push(xe);let Ce=new F(.35,.48,1.8,6);Ce.translate(0,1.05,0),U.push(Ce);let Pe=new lt(.52,.65,6);Pe.translate(0,2.25,0),U.push(Pe);let B=new dt(.18,.04,6,12);return B.translate(0,2.65,0),U.push(B),ro(U,!1)||xe})(),$=new Ot({color:3812382,emissive:16758861,emissiveIntensity:2.4,roughness:.35,metalness:.85}),Y=(()=>{let U=[],xe=new F(.55,.65,.12,12);xe.translate(0,.06,0),U.push(xe);let Ce=new F(.28,.32,1,12);Ce.translate(0,.62,0),U.push(Ce);let Pe=new lt(.12,.35,8);return Pe.translate(0,1.25,0),U.push(Pe),ro(U,!1)||Ce})(),k=(()=>{let U=pe.wax(1);return U.emissive=new Me(16762982),U.emissiveIntensity=2.4,U})(),h=(U,xe,Ce=.4)=>{let Pe=new ct(U,xe,2,2),B=Pe.attributes.position;for(let X=0;X<B.count;X++){let G=B.getX(X),D=B.getY(X),z=G/(U*.5),W=D/(xe*.5);B.setZ(X,(1-z*z)*Ce*(1-W*.25))}return Pe.computeVertexNormals(),Pe},v=(()=>{let U=[],xe=yt(1234),Ce=[[0,5.8,0,2.4,12],[1.4,4.8,.8,1.8,9],[-1.4,4.8,-.8,1.8,9],[.6,5,1.4,1.8,9],[-.6,5,-1.4,1.8,9]];for(let[Pe,B,X,G,D]of Ce)for(let z=0;z<D;z++){let W=Math.acos(1-2*xe()),ee=xe()*Math.PI*2,ue=G*(.35+xe()*.65),ge=Pe+Math.sin(W)*Math.cos(ee)*ue,we=B+Math.cos(W)*(ue*.8),_e=X+Math.sin(W)*Math.sin(ee)*ue,Ze=2.4+xe()*1,Oe=h(Ze,Ze,.4);Oe.rotateX((xe()-.5)*Math.PI*.85),Oe.rotateY(xe()*Math.PI*2),Oe.rotateZ((xe()-.5)*.6),Oe.translate(ge,we,_e),U.push(Oe)}return ro(U,!1)||U[0]})(),_=(()=>{let U=[],xe=new F(.38,.85,1.2,8);xe.translate(0,.6,0),U.push(xe);let Ce=new F(.24,.38,4,8);Ce.translate(0,2.6,0),U.push(Ce);let Pe=new F(.12,.22,2.4,6);Pe.rotateZ(.58),Pe.translate(.65,3.8,0),U.push(Pe);let B=new F(.12,.22,2.2,6);B.rotateZ(-.52),B.rotateY(1.8),B.translate(-.55,3.6,.3),U.push(B);let X=new F(.1,.18,2,5);return X.rotateZ(.45),X.rotateY(-1.5),X.translate(.2,4.2,-.5),U.push(X),$o(ro(U,!1)||Ce,.12,.18,44)})();y("flowers",T,pe.petal(1,16777215),0,!0),y("tree",_,pe.bark(1),0),w.tree&&(w.tree_crown={mats:w.tree.mats,colors:w.tree.colors},y("tree_crown",v,pe.leafCard(7780446),0,!0));let g=(()=>{let U=new ce(4.6,.25,1.4);U.translate(0,1.2,0);let xe=new ce(4.6,1.1,.2);xe.translate(0,1.85,-.6);let Ce=new ce(.3,1.2,1.2);Ce.translate(-2,.6,0);let Pe=new ce(.3,1.2,1.2);return Pe.translate(2,.6,0),ro([U,xe,Ce,Pe],!1)||U})();y("bench",g,pe.timber(1.2),0);let i=(()=>{let U=[],xe=new F(1.4,1.8,.4,16);xe.translate(0,.2,0),U.push(xe);let Ce=new F(.8,1.1,1.2,16);Ce.translate(0,1,0),U.push(Ce);let Pe=new F(2.6,1.4,.9,24);return Pe.translate(0,1.95,0),U.push(Pe),ro(U,!1)||xe})(),S=(()=>{let U=new $t(2.3,24);return U.rotateX(-Math.PI/2),U.translate(0,2.25,0),U})();y("lantern",q,$,0),y("fountain",i,V,0),y("fountain_water",S,this.terrain.waterMat,0),y("candle",Y,k,0),y("wreath",N,pe.foliage(1,4090693),0);let C=(()=>{let U=new F(.8,1.4,4.2,6);U.translate(0,2.1,0);let xe=new lt(.8,1.6,6);return xe.translate(0,5,0),ro([U,xe],!1)||U})(),O=new Ot({color:440020,emissive:2282478,emissiveIntensity:1.8,roughness:.15,metalness:.2});y("memorial_crystal",C,O,0);let te=(()=>{let U=new Vt(1.4,1);return U.translate(0,1.2,0),$o(U,.15,.2,81)})(),m=new Ot({color:16007006,roughness:.85,metalness:.05});y("coral_brain",te,m,0);let E=(()=>{let U=[];for(let xe=0;xe<6;xe++){let Ce=new F(.15,.3,3.2,6);Ce.rotateZ((xe-2.5)*.25),Ce.rotateY(xe*1),Ce.translate(Math.sin(xe)*.6,1.6,Math.cos(xe)*.6),U.push(Ce)}return ro(U,!1)||U[0]})(),R=new Ot({color:16486972,roughness:.8,metalness:.05});y("coral_staghorn",E,R,0);let P=(()=>{let U=new rt(1.2,12,8,0,Math.PI*2,0,Math.PI*.6);return U.translate(0,.6,0),U})(),oe=new Ot({color:11032055,emissive:12616956,emissiveIntensity:.8,roughness:.5});y("sea_anemone",P,oe,0);let ne=(()=>{let U=[];for(let xe=0;xe<8;xe++){let Ce=new lt(.8,2.2,4);Ce.rotateZ(.6),Ce.rotateY(xe/8*Math.PI*2),Ce.translate(0,.8,0),U.push(Ce)}return ro(U,!1)||U[0]})(),se=new Ot({color:3718648,emissive:8246268,emissiveIntensity:1.4,roughness:.2});y("crystal_lotus",ne,se,0);let ae=(()=>{let U=new Vt(1.2,0);return U.translate(0,.6,0),U})(),I=new Ot({color:1096065,roughness:.25,metalness:.3});y("jade_stones",ae,I,0);let Z=(()=>{let U=new $t(1.8,16);return U.rotateX(-Math.PI/2),U.translate(0,.04,0),U})(),ie=pe.foliage(1,1409085);y("lily_pad",Z,ie,0);let ve=(()=>{let U=new Vt(2,1);return U.translate(0,1.4,0),$o(U,.18,.25,93)})(),De=pe.rockCliff(2);y("mossy_boulder",ve,De,0);let Ue=(()=>{let U=new F(.3,.3,2.5,8);U.translate(0,1.25,0);let xe=new F(.2,.2,1,8);return xe.rotateZ(Math.PI/4),xe.translate(.5,1.5,0),ro([U,xe],!1)})(),Ke=new ea({color:4884522});y("cactus",Ue,Ke,0),this.selRing=new r(new bo(9,12,32),new Ct({color:16766826,side:gt,transparent:!0,opacity:.95})),this.selRing.rotation.x=-Math.PI/2,this.selRing.visible=!1,this.scene.add(this.selRing),o.length>0&&(this.memorialManager=new As(this),this.memorialManager.init(o))}_picking(){let e=new ia,o=new kt,s=null,n=document.getElementById("plotHoverTooltip"),t=document.getElementById("phtIcon"),a=document.getElementById("phtName"),l=document.getElementById("phtSub"),u=document.getElementById("phtEpitaph"),f=document.getElementById("phtBadge"),c=document.getElementById("phtAction");this._onPointerDown=p=>{s=[p.clientX,p.clientY]},this._onPointerUp=p=>{if(this.tourController.tourMode||!s||Math.hypot(p.clientX-s[0],p.clientY-s[1])>6)return;let w=this.canvas.getBoundingClientRect();o.x=(p.clientX-w.left)/w.width*2-1,o.y=-((p.clientY-w.top)/w.height)*2+1,e.setFromCamera(o,this.camera);let b=e.intersectObjects(this.pickables);if(b.length){let x=b[0],y=this.plotMeshIndex.get(x.object)?.[x.instanceId];if(y){n&&n.classList.add("hidden"),this.selectPlot(y),this.onPlotClick?.(y);return}}},this._onPointerMove=p=>{if(this.tourController.tourMode){n&&n.classList.add("hidden"),this.canvas.style.cursor="default";return}let w=this.canvas.getBoundingClientRect();o.x=(p.clientX-w.left)/w.width*2-1,o.y=-((p.clientY-w.top)/w.height)*2+1,e.setFromCamera(o,this.camera);let b=e.intersectObjects(this.pickables);if(b.length&&n){let x=b[0],y=this.plotMeshIndex.get(x.object)?.[x.instanceId];if(y){this.canvas.style.cursor="pointer";let H=Sn[y.district],M=y.memorial||{};if(y.status==="occupied"){let $=kn(M.species||"dog");if(t&&(t.innerHTML=In($,{size:20})),a&&(a.textContent=M.petName||"Beloved Friend"),l&&(l.textContent=`${M.species||"Companion"} \xB7 Plot ${y.id} (${H?.name||"Sanctuary"})`),u&&(u.textContent=M.epitaph?`\u201C${M.epitaph}\u201D`:"\u201CForever loved and remembered.\u201D",u.style.display=""),f){let Y=zn(M.charity)||"Animal Rescue Fund";f.innerHTML=`${xs("heart",{size:12})} ${Y}`}c&&(c.textContent="View Memorial \u2192")}else t&&(t.innerHTML=xs("grave",{size:18})),a&&(a.textContent=`Available Plot ${y.id}`),l&&(l.textContent=`${H?.name||"Sanctuary"} \xB7 ${Po[y.size]?Po[y.size].join("\xD7")+"m":"Standard"}`),u&&(u.textContent=H?.blurb||"A peaceful resting place surrounded by nature and gentle music.",u.style.display=""),f&&(f.innerHTML=`${xs("sparkle",{size:12})} $${y.price} (one-time)`),c&&(c.textContent="Reserve Plot \u2192");let L=290,T=150,N=p.clientX+16,q=p.clientY+16;N+L>window.innerWidth-20&&(N=p.clientX-L-16),q+T>window.innerHeight-20&&(q=p.clientY-T-16),n.style.left=`${N}px`,n.style.top=`${q}px`,n.style.transform="none",n.classList.remove("hidden");return}}this.canvas.style.cursor="default",n&&n.classList.add("hidden")},this._onPointerLeave=()=>{this.canvas.style.cursor="default",n&&n.classList.add("hidden")},this.canvas.addEventListener("pointerdown",this._onPointerDown),this.canvas.addEventListener("pointerup",this._onPointerUp),this.canvas.addEventListener("pointermove",this._onPointerMove),this.canvas.addEventListener("pointerleave",this._onPointerLeave)}_initAmbienceControls(){let e=document.getElementById("sanctuaryAmbiencePill");if(!e)return;let o=this.lighting._forcedPhase?.key||(Zo?Zo().key:"sunlit");e.querySelectorAll(".sap-btn[data-phase]").forEach(s=>s.classList.toggle("is-active",s.dataset.phase===o||o==="sunlit"&&s.dataset.phase==="day")),e.querySelectorAll(".sap-btn[data-mood]").forEach(s=>s.classList.toggle("is-active",s.dataset.mood===this.lighting.mood)),e.querySelectorAll("button[data-phase]").forEach(s=>{s.onclick=n=>{n.stopPropagation(),e.querySelectorAll(".sap-btn").forEach(a=>a.classList.remove("is-active")),s.classList.add("is-active");let t=s.dataset.phase;this.lighting.forcePhase(t),window.Theme&&window.Theme.forcePhase?.(t)}}),e.querySelectorAll("button[data-mood]").forEach(s=>{s.onclick=n=>{n.stopPropagation();let t=s.dataset.mood;t==="blessing"?(e.querySelectorAll(".sap-btn").forEach(a=>a.classList.remove("is-active")),s.classList.add("is-active"),this.lighting.forcePhase("blessing"),window.Theme&&(window.Theme.forcePhase?.("blessing"),window.Theme.setMood?.("blessing"))):(this.lighting.mood===t?(this.lighting.mood="clear",s.classList.remove("is-active")):(this.lighting.mood=t,s.classList.add("is-active")),this.lighting.applyAmbience(),window.Theme&&window.Theme.setMood?.(this.lighting.mood))}})}setQuality(e,o=!1){if(e==="auto"){if(this._qualityLocked=!1,e=Os({width:window.innerWidth,memory:navigator.deviceMemory,cores:navigator.hardwareConcurrency}),o)try{localStorage.setItem("ev_quality","auto")}catch{}}else if(Yo[e]){if(o){this._qualityLocked=!0;try{localStorage.setItem("ev_quality",e)}catch{}}}else return;this._qualityTier=e,this.quality=Yo[e];let s=this.quality.shadowSize;for(let n of this.lighting.csm?.lights||[])n.shadow.mapSize.width!==s&&(n.shadow.mapSize.set(s,s),n.shadow.map?.dispose(),n.shadow.map=null);this._resize()}_updateAdaptivePerformance(){let e=performance.now();if(this._qualityLocked||this._fpsCount<60||e-this._lastScaleChange<4e3)return;this._lastScaleChange=e;let o=0;for(let n=0;n<60;n++)o+=this._fpsBuffer[(this._fpsHead-1-n+120)%120];let s=Pn(this._renderScale,o/60);s!==this._renderScale&&(this._renderScale=s,this._resize())}_optimizeScene(){this.scene.updateMatrixWorld(!0);let e=new Map,o=[];this.scene.traverse(n=>{if(!n.isMesh||n.isInstancedMesh||n.userData&&(n.userData.speedX!==void 0||n.userData.phase!==void 0)||n.name&&(n.name.includes("Water")||n.name.includes("Sky")||n.name.includes("Cloud")||n.name.includes("Terrain"))||n.material&&(n.material.transparent||n.material.opacity<1||n.material.name&&(n.material.name.toLowerCase().includes("water")||n.material.name.toLowerCase().includes("sky")))||Array.isArray(n.material)||!n.geometry||!n.geometry.attributes||!n.geometry.attributes.position)return;if(n.geometry.attributes.normal||n.geometry.computeVertexNormals(),!n.geometry.attributes.uv){let c=new Float32Array(n.geometry.attributes.position.count*2);n.geometry.setAttribute("uv",new tt(c,2))}let t=new A;n.getWorldPosition(t);let a=Math.floor(t.x/150),l=Math.floor(t.z/150),f=`${n.material.uuid}_${a}_${l}`;e.has(f)||e.set(f,{material:n.material,meshes:[]}),e.get(f).meshes.push(n)});let s=0;for(let[n,t]of e.entries()){if(t.meshes.length<2)continue;let a=[],l=0,u=()=>{if(a.length===0||a.length===1)return;let c=ro(a,!1);if(c){let p=new r(c,t.material);p.castShadow=!0,p.receiveShadow=!0,p.name="MergedStaticChunk_"+s++,this.scene.add(p);for(let w of f)w.removeFromParent(),w.geometry&&w.geometry.dispose()}for(let p of a)p.dispose();a=[],l=0,f=[]},f=[];for(let c of t.meshes){let p=c.geometry.clone();if(p.index){let w=p.toNonIndexed();p.dispose(),p=w}for(let w in p.attributes)w!=="position"&&w!=="normal"&&w!=="uv"&&p.deleteAttribute(w);p.applyMatrix4(c.matrixWorld),a.push(p),l+=p.attributes.position.count,f.push(c),o.push(c),l>3e5&&u()}u()}console.log("[optimizer] Merged "+o.length+" meshes into "+s+" chunks.")}selectPlot(e){if(!e){this.selRing.visible=!1;return}this.flight?.active&&(this.flight.stop(),this.tourController.setMode("orbit")),this.selRing.visible=!0,this.selRing.position.set(e.x,e.h+.05,e.z),rn.set(e.x,e.h,e.z),this.tourController.flyTo(rn,120,.9)}_animate(){if(!this._running){this._raf=null;return}if(this._raf=requestAnimationFrame(()=>this._animate()),typeof document<"u"&&document.hidden)return;typeof document<"u"&&!this._view3dEl&&(this._view3dEl=document.getElementById("view3d"));let e=this._view3dEl;if(!(e&&(e.style.display==="none"||e.classList.contains("hidden"))&&!e.classList.contains("is-entering"))&&!(!this.renderer||!this.scene||!this.camera))try{let o=performance.now();if(this._lastFpsTime){let h=o-this._lastFpsTime;h>0&&h<500&&(this._fpsBuffer[this._fpsHead]=h,this._fpsHead=(this._fpsHead+1)%120,this._fpsCount<120&&this._fpsCount++)}if(this._lastFpsTime=o,o-this._lastFpsHudUpdate>=200&&this._fpsCount>=5){this._lastFpsHudUpdate=o;let h=0;for(let i=0;i<this._fpsCount;i++)h+=this._fpsBuffer[i];let v=h/this._fpsCount,_=Math.min(240,Math.round(1e3/v)),g=Math.round(v*10)/10;(!this._fpsPill||!this._fpsTextEl)&&this.tourController._initFPSHUD(),this._fpsTextEl&&(this._fpsTextEl.innerHTML=`<span class="sfp-fps">${_} FPS</span><span class="sfp-sep">\xB7</span><span class="sfp-ms">${g}ms</span>`),this._fpsPill&&(_>=115?this._fpsPill.className="sanctuary-fps-pill fps-ultra":_>=55?this._fpsPill.className="sanctuary-fps-pill fps-good":_>=30?this._fpsPill.className="sanctuary-fps-pill fps-warn":this._fpsPill.className="sanctuary-fps-pill fps-bad")}let s=this.clock.getDelta(),n=Math.min(Math.max(s,5e-4),.0333),t=this.clock.elapsedTime;if(this._updateAdaptivePerformance&&this._updateAdaptivePerformance(n),this.lighting.sky&&this.lighting.sky.position.copy(this.camera.position),this.lighting.stars&&this.lighting.stars.position.copy(this.camera.position),this._flyTween&&this._flyTween(),this.flight?.active?this.flight.update(Math.min(s,.1)):this.tourController.walkMode||this.tourController.tourMode||this.tourController._entranceFlight?this.tourController._updateWalk(n):this.controls.update(),this.terrain.leftGateDoor&&this.terrain.rightGateDoor){let h=this.camera.position.z,v=Math.hypot(this.camera.position.x-K.gate.x,this.camera.position.z-K.gate.z),_=!1;this.tourController.tourMode?_=this.terrain.gateTargetOpen===1||h<1200||this.terrain._forceGateOpen:this.tourController._entranceFlight?_=h<1100||this.terrain._forceGateOpen:this.tourController.walkMode?_=this.tourController.walkPos.z<1e3||v<380||this.terrain._forceGateOpen:_=v<380||h<1e3||this.terrain._forceGateOpen,this.terrain.gateTargetOpen=_?1:0;let i=1-Math.exp(-(_?1.2:1.5)*s*3);this.terrain.gateOpenAmount+=(this.terrain.gateTargetOpen-this.terrain.gateOpenAmount)*Math.min(1,i),this.terrain.leftGateDoor.rotation.y=this.terrain.gateOpenAmount*-1.85,this.terrain.rightGateDoor.rotation.y=Math.PI+this.terrain.gateOpenAmount*1.85}if(this.terrain.water&&(this.terrain.water.position.y=K.waterLevel),this.waterObjects)for(let h=0,v=this.waterObjects.length;h<v;h++){let _=this.waterObjects[h];_.material?.uniforms?.time&&(_.material.uniforms.time.value=t*.75)}if(this.terrain._riverMaterials)for(let h=0,v=this.terrain._riverMaterials.length;h<v;h++)this.terrain._riverMaterials[h].uniforms?.uTime&&(this.terrain._riverMaterials[h].uniforms.uTime.value=t);else this.terrain.riverMat?.uniforms?.uTime&&(this.terrain.riverMat.uniforms.uTime.value=t);if(this.terrain._upperTarnMesh?.material?.userData?.shader?.uniforms?.uTime&&(this.terrain._upperTarnMesh.material.userData.shader.uniforms.uTime.value=t),this.terrain._lakeShader?.userData?.shader?.uniforms?.uTime?this.terrain._lakeShader.userData.shader.uniforms.uTime.value=t:this.terrain._lakeShader?.uniforms?.uTime&&(this.terrain._lakeShader.uniforms.uTime.value=t),this.terrain._oceanShader?.userData?.shader?.uniforms?.uTime?this.terrain._oceanShader.userData.shader.uniforms.uTime.value=t:this.terrain._oceanShader?.uniforms?.uTime&&(this.terrain._oceanShader.uniforms.uTime.value=t),this.terrain._kayaShaders)for(let h=0;h<this.terrain._kayaShaders.length;h++)this.terrain._kayaShaders[h].uniforms?.time&&(this.terrain._kayaShaders[h].uniforms.time.value=t);if(this._waterPoolMat?.uniforms?.uTime&&(this._waterPoolMat.uniforms.uTime.value=t),this.terrain._fountainBasinMat?.uniforms?.uTime&&(this.terrain._fountainBasinMat.uniforms.uTime.value=t),this.terrain._fountainCascadeMat?.uniforms?.uTime&&(this.terrain._fountainCascadeMat.uniforms.uTime.value=t),this.terrain._shorelineFoamMaterial?.uniforms?.uTime&&(this.terrain._shorelineFoamMaterial.uniforms.uTime.value=t),this.terrain._waterNormals&&this.terrain._waterNormals.offset.set(t*.012,t*.02),this.terrain.oceanMesh?.material?.normalMap&&this.terrain.oceanMesh.material.normalMap.offset.set(t*.008,t*.024),this.terrain._rainbowShaders&&this.terrain._rainbowShaders.length>0){let h=Math.max(.5,this.lighting._rainbowBase||.6),v=.94+.06*Math.sin(t*.7);for(let _=0;_<this.terrain._rainbowShaders.length;_++){let g=this.terrain._rainbowShaders[_];if(!(!g||!g.uniforms)&&(g.uniforms.uTime&&(g.uniforms.uTime.value=t),g.uniforms.uOpacity)){let i=g.userData?.baseOpacity!==void 0?g.userData.baseOpacity:.18;g.uniforms.uOpacity.value=i*h*v}}}if(this.terrain._rainbowWaterShader?.uniforms&&(this.terrain._rainbowWaterShader.uniforms.uTime&&(this.terrain._rainbowWaterShader.uniforms.uTime.value=t),this.terrain._rainbowWaterShader.uniforms.uOpacity)){let h=Math.max(.45,this.lighting._rainbowBase||.6);this.terrain._rainbowWaterShader.uniforms.uOpacity.value=.65*h}this.terrain._instancedFishMat?.userData?.shader?.uniforms?.uTime&&(this.terrain._instancedFishMat.userData.shader.uniforms.uTime.value=t),this.terrain._updateUnderwater&&this.terrain._updateUnderwater(n,t),this.terrain._mountainWaterfallShader?.uniforms?.uTime&&(this.terrain._mountainWaterfallShader.uniforms.uTime.value=t),this.terrain._oceanWaterfallShader?.uniforms?.uTime&&(this.terrain._oceanWaterfallShader.uniforms.uTime.value=t),this.terrain._poolShader?.uniforms?.uTime&&(this.terrain._poolShader.uniforms.uTime.value=t),this._splashShader?.uniforms?.uTime&&(this._splashShader.uniforms.uTime.value=t),this._mistShader?.uniforms?.uTime&&(this._mistShader.uniforms.uTime.value=t),this.terrain._lakeMistShader?.uniforms?.uTime&&(this.terrain._lakeMistShader.uniforms.uTime.value=t),this._impactRingShader?.uniforms?.uTime&&(this._impactRingShader.uniforms.uTime.value=t),this.lighting._godRayMat?.uniforms?.uTime&&(this.lighting._godRayMat.uniforms.uTime.value=t);let a=t%6283.1853;if(this.terrain._stardustMat?.uniforms?.uTime&&(this.terrain._stardustMat.uniforms.uTime.value=a),this.terrain._balustradeMoteMat?.uniforms?.uTime&&(this.terrain._balustradeMoteMat.uniforms.uTime.value=a),this.terrain._lanterns)for(let h=0,v=this.terrain._lanterns.length;h<v;h++){let _=this.terrain._lanterns[h];_.userData.progress=(_.userData.progress+_.userData.speed*n*.14)%1;let g=_.userData.isOutlet?this.terrain._riverOutletCurve:this.terrain._riverInletCurve;g&&(g.getPoint(_.userData.progress,this._tmpV3),_.position.set(this._tmpV3.x,this._tmpV3.y+.15+Math.sin(t*1.8+_.userData.bobPhase)*.12,this._tmpV3.z)),_.rotation.y=t*.3+_.userData.bobPhase}if(this.terrain._surfShader?.uniforms?.uTime&&(this.terrain._surfShader.uniforms.uTime.value=t),this._beaconMat?.uniforms?.uTime&&(this._beaconMat.uniforms.uTime.value=t),this.terrain._kayaStardust&&(this.terrain._kayaStardust.rotation.y=t*.45),this.terrain.moteMat&&(this.terrain.moteMat.uniforms.uTime.value=t),this.terrain.phantasmMoteMat&&(this.terrain.phantasmMoteMat.uniforms.uTime.value=t),this.terrain._phantasmTreeLight&&(this.terrain._phantasmTreeLight.intensity=2.8+Math.sin(t*1.5)*.6),this.terrain.pawMat&&(this.terrain.pawMat.opacity=(this.lighting._pawBase||.45)*(.72+.28*Math.sin(t*2.1))),this.lighting.stars?.visible&&this.lighting.starMat?.uniforms?.uTime&&(this.lighting.starMat.uniforms.uTime.value=t),this.terrain._terrainShaders&&this.terrain._terrainShaders.forEach(h=>{h.uniforms?.uTime&&(h.uniforms.uTime.value=t)}),this._bgMountainShader?.uniforms?.uTime&&(this._bgMountainShader.uniforms.uTime.value=t),this.terrain._oceanShader?.uniforms?.uTime&&(this.terrain._oceanShader.uniforms.uTime.value=t),this.lighting._clouds)for(let h=0,v=this.lighting._clouds.length;h<v;h++){let _=this.lighting._clouds[h];_.position.x+=(_.userData.speedX||2.4)*n*14,_.position.x>4200&&(_.position.x=-4200)}this.lighting._cinematicPass?.uniforms?.uTime&&(this.lighting._cinematicPass.uniforms.uTime.value=t),this._fishFrameCount||(this._fishFrameCount=0),this._fishFrameCount++;let l=this._fishFrameCount%30===0;if(this.terrain._troutMesh&&this.terrain._troutData){let h=this._troutDummy=this._troutDummy||new Lt,v=t,_=this.terrain._troutData.length;for(let g=0;g<_;g++){let i=this.terrain._troutData[g],S=i.dir||1,C=i.angle+v*i.orbitSpeed*S,O=(Math.sin(v*.2+i.phase)+Math.sin(v*.11+i.phase*2.3)*.6)*(i.wanderAmp||6),te=(Math.cos(v*.16+i.phase*1.4)+Math.cos(v*.09+i.phase*.8)*.7)*(i.wanderAmp||6),m=i.center.x+Math.cos(C)*i.radiusX+O,E=i.center.z+Math.sin(C)*i.radiusZ+te;(l||i._cachedGH===void 0)&&(i._cachedGH=ze(m,E));let R=i._cachedGH,P=E<-450?182:E<-340&&m<100?18:12.4,oe=(P+R)*.5,ne=Math.max(0,P-R-1),se=oe+i.yOffset*ne+Math.sin(v*i.speed*2.2+i.phase)*(i.vertAmp||.45),ae=-Math.sin(C)*i.radiusX*S*i.orbitSpeed+(Math.cos(v*.2+i.phase)*.2+Math.cos(v*.11+i.phase*2.3)*.11*.6)*(i.wanderAmp||6),I=Math.cos(C)*i.radiusZ*S*i.orbitSpeed-(Math.sin(v*.16+i.phase*1.4)*.16+Math.sin(v*.09+i.phase*.8)*.09*.7)*(i.wanderAmp||6),Z=Math.atan2(ae,I);h.position.set(m,Math.max(Math.min(se,P-.4),R+.4),E),h.rotation.set(Math.cos(v*i.speed*1.6+i.phase)*.08,Z,Math.sin(v*i.speed*3.2+i.phase)*.15),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._troutMesh.setMatrixAt(g,h.matrix)}this.terrain._troutMesh.instanceMatrix.needsUpdate=!0}if(this.terrain._koiMesh&&this.terrain._koiData){let h=this._koiDummy=this._koiDummy||new Lt,v=t,_=this.terrain._koiData.length;for(let g=0;g<_;g++){let i=this.terrain._koiData[g],S=i.dir||1,C=i.angle+v*i.orbitSpeed*S,O=(Math.sin(v*.2+i.phase)+Math.sin(v*.11+i.phase*2.3)*.6)*(i.wanderAmp||8),te=(Math.cos(v*.16+i.phase*1.4)+Math.cos(v*.09+i.phase*.8)*.7)*(i.wanderAmp||8),m=i.center.x+Math.cos(C)*i.radiusX+O,E=i.center.z+Math.sin(C)*i.radiusZ+te;(l||i._cachedGH===void 0)&&(i._cachedGH=ze(m,E));let R=i._cachedGH,P=12.4,oe=(P+R)*.5,ne=Math.max(0,P-R-1),se=oe+i.yOffset*ne+Math.sin(v*i.speed*1.8+i.phase)*(i.vertAmp||.45),ae=-Math.sin(C)*i.radiusX*S*i.orbitSpeed+(Math.cos(v*.2+i.phase)*.2+Math.cos(v*.11+i.phase*2.3)*.11*.6)*(i.wanderAmp||8),I=Math.cos(C)*i.radiusZ*S*i.orbitSpeed-(Math.sin(v*.16+i.phase*1.4)*.16+Math.sin(v*.09+i.phase*.8)*.09*.7)*(i.wanderAmp||8),Z=Math.atan2(ae,I);h.position.set(m,Math.max(Math.min(se,P-.4),R+.4),E),h.rotation.set(Math.cos(v*i.speed*1.4+i.phase)*.07,Z,Math.sin(v*i.speed*2.8+i.phase)*.14),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._koiMesh.setMatrixAt(g,h.matrix)}this.terrain._koiMesh.instanceMatrix.needsUpdate=!0}if(this.terrain._reefFishMesh&&this.terrain._reefFishData){let h=this._fishDummy=this._fishDummy||new Lt,v=t,_=this.terrain._reefFishData.length;for(let g=0;g<_;g++){let i=this.terrain._reefFishData[g],S=i.dir||1,C=i.angle+v*i.orbitSpeed*S,O=(Math.sin(v*.2+i.phase)+Math.sin(v*.11+i.phase*2.3)*.6)*(i.wanderAmp||8),te=(Math.cos(v*.16+i.phase*1.4)+Math.cos(v*.09+i.phase*.8)*.7)*(i.wanderAmp||8),m=i.center.x+Math.cos(C)*i.radiusX+O,E=i.center.z+Math.sin(C)*i.radiusZ+te;(l||i._cachedGH===void 0)&&(i._cachedGH=ze(m,E));let R=i._cachedGH,P=E>1050?0:E<-450?182:E<-340&&m<100?18:12.4,oe=(P+R)*.5,ne=Math.max(0,P-R-1),se=oe+i.yOffset*ne+Math.sin(v*i.speed*2.4+i.phase)*(i.vertAmp||.5),ae=-Math.sin(C)*i.radiusX*S*i.orbitSpeed+(Math.cos(v*.2+i.phase)*.2+Math.cos(v*.11+i.phase*2.3)*.11*.6)*(i.wanderAmp||8),I=Math.cos(C)*i.radiusZ*S*i.orbitSpeed-(Math.sin(v*.16+i.phase*1.4)*.16+Math.sin(v*.09+i.phase*.8)*.09*.7)*(i.wanderAmp||8),Z=Math.atan2(ae,I);h.position.set(m,Math.max(Math.min(se,P-.4),R+.4),E),h.rotation.set(Math.cos(v*i.speed*1.8+i.phase)*.09,Z,Math.sin(v*i.speed*3.4+i.phase)*.16),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._reefFishMesh.setMatrixAt(g,h.matrix)}this.terrain._reefFishMesh.instanceMatrix.needsUpdate=!0}if(this.terrain._dolphinMesh&&this.terrain._dolphinData){let h=this._dolphDummy=this._dolphDummy||new Lt,v=t,_=this.terrain._dolphinData.length;for(let g=0;g<_;g++){let i=this.terrain._dolphinData[g],S=i.dir||1,C=i.angle+v*i.orbitSpeed*S,O=i.radiusX||80,te=i.radiusZ||95,m=Math.sin(v*.18+i.phase)*(i.wanderAmp||10),E=Math.cos(v*.14+i.phase*1.3)*(i.wanderAmp||10),R=i.center.x+Math.cos(C)*O+m,P=i.center.z+Math.sin(C)*te+E;(l||i._cachedGH===void 0)&&(i._cachedGH=ze(R,P));let oe=P>1050?0:P<-450?182:P<-340&&R<100?18:12.4,ne=(oe+i._cachedGH)*.5,se=Math.max(0,oe-i._cachedGH-2),ae=Math.sin(v*i.speed*1.6+i.phase),I=ne+i.yOffset*se+ae*2.2,Z=Math.max(i._cachedGH+.8,Math.min(oe-.4,I)),ie=-Math.sin(C)*O*S+Math.cos(v*.18+i.phase)*(i.wanderAmp||10)*.18,ve=Math.cos(C)*te*S-Math.sin(v*.14+i.phase*1.3)*(i.wanderAmp||10)*.14,De=Math.atan2(ie,ve);h.position.set(R,Z,P);let Ue=-Math.cos(v*i.speed*1.6+i.phase)*.28,Ke=-Math.sin(C)*.22*S;h.rotation.set(Ue,De,Ke),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._dolphinMesh.setMatrixAt(g,h.matrix)}this.terrain._dolphinMesh.instanceMatrix.needsUpdate=!0}if(this.terrain._sharkMesh&&this.terrain._sharkData){let h=this._sharkDummy=this._sharkDummy||new Lt,v=t,_=this.terrain._sharkData.length;for(let g=0;g<_;g++){let i=this.terrain._sharkData[g],S=i.dir||1,C=i.angle+v*i.orbitSpeed*S,O=i.radiusX||95,te=i.radiusZ||110,m=Math.sin(v*.15+i.phase)*(i.wanderAmp||12),E=Math.cos(v*.12+i.phase*1.2)*(i.wanderAmp||12),R=i.center.x+Math.cos(C)*O+m,P=i.center.z+Math.sin(C)*te+E;(l||i._cachedGH===void 0)&&(i._cachedGH=ze(R,P));let oe=P>1050?0:P<-450?182:P<-340&&R<100?18:12.4,ne=(oe+i._cachedGH)*.5,se=Math.max(0,oe-i._cachedGH-2),ae=ne+i.yOffset*se+Math.sin(v*i.speed*.8+i.phase)*.55,I=Math.max(i._cachedGH+1.2,Math.min(oe-.8,ae)),Z=-Math.sin(C)*O*S+Math.cos(v*.15+i.phase)*(i.wanderAmp||12)*.15,ie=Math.cos(C)*te*S-Math.sin(v*.12+i.phase*1.2)*(i.wanderAmp||12)*.12,ve=Math.atan2(Z,ie);h.position.set(R,I,P);let De=Math.sin(v*i.speed*2.2+i.phase)*.12,Ue=-Math.sin(C)*.15*S;h.rotation.set(0,ve+De,Ue),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._sharkMesh.setMatrixAt(g,h.matrix)}this.terrain._sharkMesh.instanceMatrix.needsUpdate=!0}if(this._fishShader?.uniforms?.uTime&&(this._fishShader.uniforms.uTime.value=t),this.terrain._causticsShader?.uniforms?.uTime&&(this.terrain._causticsShader.uniforms.uTime.value=t),this.terrain._marineSnowShader?.uniforms?.uTime&&(this.terrain._marineSnowShader.uniforms.uTime.value=t),this.terrain._seaTurtleMesh&&this.terrain._seaTurtleData){let h=this._turtleDummy=this._turtleDummy||new Lt,v=t,_=this.terrain._seaTurtleData.length;for(let g=0;g<_;g++){let i=this.terrain._seaTurtleData[g],S=i.dir||1,C=i.phase+v*i.orbitSpeed*S,O=Math.sin(v*.2+i.phase)*6,te=Math.cos(v*.16+i.phase*1.3)*6,m=i.cx+Math.cos(C)*i.radiusX*4+O,E=i.cz+Math.sin(C)*i.radiusZ*4+te,R=-Math.sin(C)*i.radiusX*4*S+Math.cos(v*.2+i.phase)*6*.2,P=Math.cos(C)*i.radiusZ*4*S-Math.sin(v*.16+i.phase*1.3)*6*.16,oe=Math.atan2(R,P);(l||i._cachedGH===void 0)&&(i._cachedGH=ze(m,E));let ne=E>1050?0:E<-450?182:E<-340&&m<100?18:12.4,se=(ne+i._cachedGH)*.5,ae=Math.max(0,ne-i._cachedGH-2),I=i.phase%1-.5,Z=se+I*ae+Math.sin(v*i.speed*1.2+i.phase)*.65,ie=Math.max(i._cachedGH+.6,Math.min(ne-.8,Z));h.position.set(m,ie,E);let ve=-Math.sin(C)*.18*S,De=Math.cos(v*i.speed*1.2+i.phase)*.08;h.rotation.set(De,oe,ve),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._seaTurtleMesh.setMatrixAt(g,h.matrix)}this.terrain._seaTurtleMesh.instanceMatrix.needsUpdate=!0}if(this.terrain._seaTurtleShader?.uniforms?.uTime&&(this.terrain._seaTurtleShader.uniforms.uTime.value=t),this.terrain._mantaRayMesh&&this.terrain._mantaRayData){let h=this._mantaDummy=this._mantaDummy||new Lt,v=t,_=this.terrain._mantaRayData.length;for(let g=0;g<_;g++){let i=this.terrain._mantaRayData[g],S=i.dir||1,C=i.phase+v*i.orbitSpeed*S,O=Math.sin(v*.16+i.phase)*8,te=Math.cos(v*.13+i.phase*1.2)*8,m=i.cx+Math.cos(C)*i.radiusX*4+O,E=i.cz+Math.sin(C)*i.radiusZ*4+te,R=-Math.sin(C)*i.radiusX*4*S+Math.cos(v*.16+i.phase)*8*.16,P=Math.cos(C)*i.radiusZ*4*S-Math.sin(v*.13+i.phase*1.2)*8*.13,oe=Math.atan2(R,P);(l||i._cachedGH===void 0)&&(i._cachedGH=ze(m,E));let ne=E>1050?0:E<-450?182:E<-340&&m<100?18:12.4,se=(ne+i._cachedGH)*.5,ae=Math.max(0,ne-i._cachedGH-2),I=i.phase%1-.5,Z=se+I*ae+Math.sin(v*i.speed*.8+i.phase)*.85,ie=Math.max(i._cachedGH+1,Math.min(ne-1.2,Z));h.position.set(m,ie,E);let ve=-Math.sin(C)*.28*S,De=Math.cos(v*i.speed*.8+i.phase)*.06;h.rotation.set(De,oe,ve),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._mantaRayMesh.setMatrixAt(g,h.matrix)}this.terrain._mantaRayMesh.instanceMatrix.needsUpdate=!0}if(this.terrain._mantaRayShader?.uniforms?.uTime&&(this.terrain._mantaRayShader.uniforms.uTime.value=t),this.terrain._anemoneMat?.uniforms?.uTime&&(this.terrain._anemoneMat.uniforms.uTime.value=t),this.terrain._kelpMat?.uniforms?.uTime&&(this.terrain._kelpMat.uniforms.uTime.value=t),this.terrain._bubbleMat?.uniforms?.uTime&&(this.terrain._bubbleMat.uniforms.uTime.value=t),this.terrain._coralMat&&(this.terrain._coralMat.emissiveIntensity=1.7+Math.sin(t*2.2)*.45),this.terrain._reefCrystalMat&&(this.terrain._reefCrystalMat.emissiveIntensity=2.2+Math.sin(t*1.6+1.2)*.55),this._windMaterials){let v=Math.sin(t*.15)*.3+Math.sin(t*.05+2)*.3,_=Math.sin(t*1.2)*.15*Math.max(0,v),g=.4+Math.max(0,v)+_;for(let i=0,S=this._windMaterials.length;i<S;i++){let C=this._windMaterials[i];C.userData?.windShader?.uniforms?.uTime&&(C.userData.windShader.uniforms.uTime.value=t),C.userData?.windShader?.uniforms?.uWindIntensity&&(C.userData.windShader.uniforms.uWindIntensity.value=g)}}if(this.selRing&&this.selRing.visible){this.selRing.rotation.z=t*.6;let h=1+Math.sin(t*3)*.06;this.selRing.scale.set(h,h,1)}let u=this.camera.position,f=u.x,c=u.y,p=u.z,w=Math.abs(f)<62&&p<=-455&&p>=-635&&c<182.2,x=Math.hypot(f,p- -550)<58&&c<18.2,V=Xo(f,p),y=Ts(f,p),H=Math.hypot(f-K.lake.x,p-K.lake.z)<K.lake.r+5&&c<K.waterLevel+.2||V<32&&c<y+.3||c<K.waterLevel,M=p>915&&c<(K.oceanLevel||.35),L=w||x||H||M,T=8e-4,N=5,q=450;if(this._colSunlitAqua=this._colSunlitAqua||new Me(6349055),this._colDeepAbyssal=this._colDeepAbyssal||new Me(1603752),this._colAbyssBg1=this._colAbyssBg1||new Me(1603752),this._colAbyssBg2=this._colAbyssBg2||new Me(1200764),this._colTarnFog1=this._colTarnFog1||new Me(5822704),this._colTarnFog2=this._colTarnFog2||new Me(2656424),this._colLakeFog1=this._colLakeFog1||new Me(4782296),this._colLakeFog2=this._colLakeFog2||new Me(2263192),M){let h=Math.max(0,.35-c),v=Math.exp(-h*.015);this._underwaterTargetFog.copy(this._colSunlitAqua).lerp(this._colDeepAbyssal,1-v),this._underwaterTargetBg.copy(this._colAbyssBg1).lerp(this._colAbyssBg2,1-v),T=3e-4+(1-v)*2e-4,N=15,q=850-(1-v)*150}else if(w){let h=Math.max(0,182-c),v=Math.exp(-h*.025);this._underwaterTargetFog.copy(this._colTarnFog1).lerp(this._colTarnFog2,1-v),this._underwaterTargetBg.setHex(2656424),T=4e-4,N=10,q=700}else if(x){let h=Math.max(0,18-c),v=Math.exp(-h*.03);this._underwaterTargetFog.copy(this._colTarnFog1).lerp(this._colTarnFog2,1-v),this._underwaterTargetBg.setHex(2656424),T=5e-4,N=10,q=650}else if(H){let h=Math.max(0,12.5-c),v=Math.exp(-h*.025);this._underwaterTargetFog.copy(this._colLakeFog1).lerp(this._colLakeFog2,1-v),this._underwaterTargetBg.setHex(2263192),T=4e-4,N=10,q=720}else this._underwaterTargetFog.setHex(2390168),this._underwaterTargetBg.setHex(1996936);let $=L?1:0,k=1-Math.exp(-(L?12:4.5)*n);if(this._underwaterBlend=this._underwaterBlend||0,this._underwaterBlend+=($-this._underwaterBlend)*k,this.scene.fog)if(this._underwaterBlend<.001)this._origFogColor.copy(this.scene.fog.color),this.scene.fog.isFogExp2?this._origFogDensity=this.scene.fog.density:this.scene.fog.isFog&&(this._origFogNear=this.scene.fog.near,this._origFogFar=this.scene.fog.far),this.scene.background&&this.scene.background.isColor&&this._origBgColor.copy(this.scene.background),this.lighting.sky&&(this.lighting.sky.visible=!0),this._isUnderwaterState=!1;else{if(this._isUnderwaterState=!0,this._currentFogColor.copy(this._origFogColor).lerp(this._underwaterTargetFog,this._underwaterBlend),this.scene.fog.color.copy(this._currentFogColor),this.scene.fog.isFogExp2){let h=this._origFogDensity||65e-6;this.scene.fog.density=h+(T-h)*this._underwaterBlend}else if(this.scene.fog.isFog){let h=this._origFogNear||1200,v=this._origFogFar||18e3;this.scene.fog.near=h+(N-h)*this._underwaterBlend,this.scene.fog.far=v+(q-v)*this._underwaterBlend}(!this.scene.background||!this.scene.background.isColor)&&(this.scene.background=new Me(this._underwaterTargetBg)),this._currentBgColor.copy(this._origBgColor).lerp(this._underwaterTargetBg,this._underwaterBlend),this.scene.background.copy(this._currentBgColor),this.lighting.sky&&(this.lighting.sky.visible=!0)}this.lighting.csm&&(this.lighting.csm.update(),o-this._lastShadowTime>100&&(this.camera.position.distanceToSquared(this._shadowPosition)>.25||this.camera.quaternion.angleTo(this._shadowQuaternion)>.005||o-this._lastShadowTime>500)&&(this.renderer.shadowMap.needsUpdate=!0,this._shadowPosition.copy(this.camera.position),this._shadowQuaternion.copy(this.camera.quaternion),this._lastShadowTime=o)),this.terrain.terrainPatch&&this.terrain._updateTerrainPatch&&this.terrain._updateTerrainPatch(),this.lighting.useComposer&&this.lighting.composer?this.lighting.composer.render():this.renderer.render(this.scene,this.camera),this._firstFrameRendered||(this._firstFrameRendered=!0,console.log("[world3d] first frame"),window.__rbvBooted=!0)}catch(o){console.log("[world3d] _animate error in frame, falling back to direct render:",o);try{this.renderer&&this.scene&&this.camera&&(this.terrain.terrainPatch&&this.terrain._updateTerrainPatch&&this.terrain._updateTerrainPatch(),this.renderer.render(this.scene,this.camera))}catch{}}}dispose(){this._disposed=!0,this.terrain?._terrainAbort?.abort(),this._running=!1,this._raf&&cancelAnimationFrame(this._raf),this.controls?.dispose(),document.removeEventListener("visibilitychange",this._visibilityHandler),clearInterval(this._ambienceTimer),typeof window<"u"&&window.removeEventListener("resize",this._resizeHandler),window.removeEventListener("keydown",this.tourController._onKeyDown),window.removeEventListener("keyup",this.tourController._onKeyUp),this.canvas?.removeEventListener("mousedown",this.tourController._onMouseDown),window.removeEventListener("mousemove",this.tourController._onMouseMove),window.removeEventListener("mouseup",this.tourController._onMouseUp),this.canvas?.removeEventListener("pointerdown",this._onPointerDown),this.canvas?.removeEventListener("pointerup",this._onPointerUp),this.canvas?.removeEventListener("pointermove",this._onPointerMove),this.canvas?.removeEventListener("pointerleave",this._onPointerLeave),this.canvas?.removeEventListener("touchstart",this.tourController._onTouchStart),this.canvas?.removeEventListener("touchmove",this.tourController._onTouchMove),this.canvas?.removeEventListener("touchend",this._onTouchEnd),this.tourController._joystick&&(this.tourController._joystick.removeEventListener("touchstart",this.tourController._onJoystickTouchStart),window.removeEventListener("touchmove",this.tourController._onJoystickTouchMove),window.removeEventListener("touchend",this.tourController._onJoystickTouchEnd),window.removeEventListener("touchcancel",this.tourController._onJoystickTouchEnd),this.tourController._joystick.parentNode&&this.tourController._joystick.remove(),this.tourController._joystick=null),this.scene.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(s=>{s.dispose();for(let n of Object.keys(s))s[n]&&s[n].isTexture&&s[n].dispose();if(s.uniforms)for(let n of Object.keys(s.uniforms)){let t=s.uniforms[n]?.value;t&&t.isTexture&&t.dispose()}})}),this.lighting._envRT?.dispose(),this._glowTex?.dispose(),this.lighting.pmrem?.dispose(),this.assetLoader._hdriTarget?.dispose(),this.lighting.csm?.remove(),this.lighting.csm?.dispose(),this.lighting.composer?.passes.forEach(e=>e.dispose?.()),this.lighting.composer?.dispose(),this.renderer?.dispose(),la(),this._fpsPill&&this._fpsPill.parentNode&&(this._fpsPill.remove(),this._fpsPill=null),this._fpsFrames=[]}};export{cn as World3D,cn as World3DCore,$o as applyOrganicWeathering,uc as bakeVertexCreviceOcclusion};
