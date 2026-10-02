import{a as la,b as ha,c as da,d as ua,e as fa,f as pa}from"./chunk-NJRMMQT2.js";import{a as Yo,b as Us,c as Sn,d as Cn,p as kn,r as In,t as Zo,u as es,v as Do,w as An}from"./chunk-O75ZMO5F.js";import{b as Gn,c as Ts,d as zn}from"./chunk-GRVASKCC.js";import{a as yt,b as jt,c as j,d as Tn,e as xn,f as Rn,g as Xo,h as Ms,i as ke,j as bn,k as Hn,l as _n,m as xo,q as Po,r as Qo}from"./chunk-GKL6NJTQ.js";import{d as Pn}from"./chunk-LBPPFFK4.js";import"./chunk-JRTNOIIK.js";import{f as yo,h as ho,i as pe,l as Go,o as ca}from"./chunk-KDKRWMGP.js";import{$c as so,$d as Hs,Aa as Xs,Ad as Xn,Bd as Mt,Dd as Yn,Fe as as,Ga as xs,Ha as Bo,Jd as rt,Je as $n,Jf as ea,Kd as ss,Ke as Jn,Le as $t,Mc as ts,Me as L,Mf as ta,Nc as kt,Ne as lt,Nf as oa,Od as Zn,Of as vo,Pe as Vt,Pf as Ps,Qf as sa,Re as mo,Tc as Ys,Te as Eo,Tf as na,Uc as Vn,Ue as js,Vd as je,Ve as no,Wc as Wn,Wd as qn,We as bo,Xd as jn,Yb as Rs,Ye as at,Zb as Fn,Zd as bs,_d as Zs,_e as dt,ad as B,ae as _s,af as Jt,ba as Ln,bd as Un,be as ns,bg as aa,df as Cs,ed as _t,ef as Ot,fd as On,ff as tt,hd as Lt,he as Ft,ie as ut,j as Dn,jd as ye,jf as Qn,ld as Ct,m as Bn,md as os,n as wt,na as qo,nd as ct,oe as Ss,p as Os,pe as co,pg as ra,q as Ht,qe as Kn,re as qs,tg as ia,va as Ro,ve as Kt,wd as mt,xd as gt,yd as r,zc as Nn,zd as ce,ze as It}from"./chunk-ZQR4HC7I.js";function Gs(He,{snowMin:e=285,snowMax:o=365}={}){let s=yo("meadowLush"),n=yo("photogrammetryRock"),t=yo("mossyScree");for(let l of[s,n,t])for(let u of Object.values(l))u.anisotropy=Math.min(8,He.capabilities.getMaxAnisotropy());let a=new Ot({roughness:.92,metalness:0});return a.name="Natural terrain",a.onBeforeCompile=l=>{Object.assign(l.uniforms,{snowRange:{value:new kt(e,o)},grassMap:{value:s.map},grassNormal:{value:s.normalMap},grassRough:{value:s.roughnessMap},rockMap:{value:n.map},rockNormal:{value:n.normalMap},rockRough:{value:n.roughnessMap},soilMap:{value:t.map}}),l.vertexShader=l.vertexShader.replace("#include <common>",`#include <common>
        attribute float aCreviceAO;
        varying vec3 terrainPosition;
        varying vec3 terrainNormal;
        varying float terrainAO;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        terrainPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        terrainNormal = normalize(mat3(modelMatrix) * normal);
        terrainAO = aCreviceAO;`),l.fragmentShader=l.fragmentShader.replace("#include <common>",`#include <common>
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
        }`).replace("#include <map_fragment>",`
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
      `).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        vec3 rockN = triNormal(rockNormal, rp, tn, tw);
        vec3 gn = texture2D(grassNormal, gp.xz).xyz * 2.0 - 1.0;
        vec3 grassN = normalize(tn + vec3(gn.x, 0.0, gn.y) * 0.28);
        vec3 detailN = normalize(mix(rockN, grassN, grassWeight));
        detailN = normalize(mix(detailN, tn, snowWeight * 0.65));
        normal = normalize(mat3(viewMatrix) * detailN);
      `).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        float rr = dot(triColor(rockRough, rp, tw), vec3(0.333333));
        float gr = texture2D(grassRough, gp.xz).g;
        roughnessFactor = clamp(mix(rr, gr, grassWeight), 0.68, 1.0);
      `).replace("#include <aomap_fragment>",`#include <aomap_fragment>
        reflectedLight.indirectDiffuse *= mix(0.65, 1.0, clamp(terrainAO, 0.0, 1.0));
      `)},a.customProgramCacheKey=()=>"natural-terrain-v1",a}var zs=class{constructor(e){this.world=e,this.curve=new It(Qo.map(o=>new B(o.x,Math.max(o.y+55,ke(o.x,o.z)+65),o.z)),!0,"catmullrom",.5),this.curve.arcLengthDivisions=4096,this.length=this.curve.getLength(),this.distance=0,this.active=!1,this.paused=!1,this.position=new B,this.look=new B,this.matrix=new _t,this.rotation=new so,this.up=new B(0,1,0)}sample(e,o){return this.curve.getPointAt((e/this.length%1+1)%1,o),o.y=Math.max(o.y,ke(o.x,o.z)+45),o}start(e){if(Number.isInteger(e)){let s=Math.max(0,Math.min(Qo.length-1,e));this.distance=this.curve.getLengths()[Math.round(s/Qo.length*this.curve.arcLengthDivisions)]}else{let s=1/0;for(let n=0;n<512;n++){let t=this.length*n/512,a=this.sample(t,this.position),l=a.x-this.world.camera.position.x,u=a.z-this.world.camera.position.z,f=l*l+u*u;f<s&&(s=f,this.distance=t)}}this.active=!0,this.paused=!1,this.world.controls.enabled=!1,this.world.camera.up.copy(this.up),this.mountControls();let o=document.querySelector("#liveFlightControls button");o&&(o.textContent="Pause flight")}update(e){if(!this.active)return;let o=Math.max(0,Math.min(.1,e));this.paused||(this.distance=(this.distance+o*22)%this.length),this.sample(this.distance,this.position),this.sample(this.distance+95,this.look);let s=this.world.camera;s.position.lerp(this.position,1-Math.exp(-3*o)),s.position.y=Math.max(s.position.y,ke(s.position.x,s.position.z)+15),this.matrix.lookAt(s.position,this.look,this.up),this.rotation.setFromRotationMatrix(this.matrix),s.quaternion.slerp(this.rotation,1-Math.exp(-2*o)),this.world.controls.target.copy(this.look),window.UI?.map&&(window.UI.map.dronePosition=s.position)}stop(){this.active=!1,this.world.controls.enabled=!0,document.getElementById("liveFlightControls")?.classList.add("hidden")}mountControls(){let e=document.getElementById("liveFlightControls");if(!e){e=document.createElement("div"),e.id="liveFlightControls",e.className="live-flight-controls";let o=document.createElement("select");o.setAttribute("aria-label","Flight landmark"),Qo.forEach((s,n)=>{let t=document.createElement("option");t.value=n,t.textContent=s.name,o.append(t)}),o.onchange=()=>this.start(Number(o.value)),e.append(o);for(let[s,n]of[["Pause flight",t=>{this.paused=!this.paused,t.currentTarget.textContent=this.paused?"Resume flight":"Pause flight"}]]){let t=document.createElement("button");t.textContent=s,t.onclick=n,e.append(t)}document.getElementById("view3d").append(e)}e.classList.remove("hidden")}};function ks(He,e=!1){let o=He[0].index!==null,s=new Set(Object.keys(He[0].attributes)),n=new Set(Object.keys(He[0].morphAttributes)),t={},a={},l=He[0].morphTargetsRelative,u=new gt,f=0;for(let c=0;c<He.length;++c){let m=He[c],v=0;if(o!==(m.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let R in m.attributes){if(!s.has(R))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+'. All geometries must have compatible attributes; make sure "'+R+'" attribute exists among all geometries, or in none of them.'),null;t[R]===void 0&&(t[R]=[]),t[R].push(m.attributes[R]),v++}if(v!==s.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". Make sure all geometries have the same number of attributes."),null;if(l!==m.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let R in m.morphAttributes){if(!n.has(R))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+".  .morphAttributes must be consistent throughout all geometries."),null;a[R]===void 0&&(a[R]=[]),a[R].push(m.morphAttributes[R])}if(e){let R;if(o)R=m.index.count;else if(m.attributes.position!==void 0)R=m.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+c+". The geometry must have either an index or a position attribute"),null;u.addGroup(f,R,c),f+=R}}if(o){let c=0,m=[];for(let v=0;v<He.length;++v){let R=He[v].index;for(let b=0;b<R.count;++b)m.push(R.getX(b)+c);c+=He[v].attributes.position.count}u.setIndex(m)}for(let c in t){let m=ma(t[c]);if(!m)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" attribute."),null;u.setAttribute(c,m)}for(let c in a){let m=a[c][0].length;if(m===0)break;u.morphAttributes=u.morphAttributes||{},u.morphAttributes[c]=[];for(let v=0;v<m;++v){let R=[];for(let Y=0;Y<a[c].length;++Y)R.push(a[c][Y][v]);let b=ma(R);if(!b)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+c+" morphAttribute."),null;u.morphAttributes[c].push(b)}}return u}function ma(He){let e,o,s,n=-1,t=0;for(let f=0;f<He.length;++f){let c=He[f];if(e===void 0&&(e=c.array.constructor),e!==c.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(o===void 0&&(o=c.itemSize),o!==c.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(s===void 0&&(s=c.normalized),s!==c.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(n===-1&&(n=c.gpuType),n!==c.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;t+=c.count*o}let a=new e(t),l=new ct(a,o,s),u=0;for(let f=0;f<He.length;++f){let c=He[f];if(c.isInterleavedBufferAttribute){let m=u/o;for(let v=0,R=c.count;v<R;v++)for(let b=0;b<o;b++){let Y=c.getComponent(v,b);l.setComponent(v+m,b,Y)}}else a.set(c.array,u);u+=c.count*o}return n!==void 0&&(l.gpuType=n),l}var Ks=class{constructor(){this.videos=new Map,this.maxConcurrent=3,this.camera=null,this.dummyVideo=document.createElement("video"),this.dummyVideo.setAttribute("playsinline",""),this.dummyVideo.setAttribute("muted",""),this.dummyVideo.muted=!0;let e=()=>{this.dummyVideo.play().catch(o=>{}),window.removeEventListener("touchstart",e),window.removeEventListener("click",e)};window.addEventListener("touchstart",e,{once:!0}),window.addEventListener("click",e,{once:!0})}setCamera(e){this.camera=e}createVideoTexture(e,o,s=!1){if(this.videos.has(e))return this.videos.get(e).texture;let n=document.createElement("video");n.src=o,n.crossOrigin="anonymous",n.loop=!0,n.muted=!0,n.setAttribute("playsinline",""),n.setAttribute("muted","");let t=new Kn(n);return t.minFilter=Ro,t.magFilter=Ro,t.generateMipmaps=!1,t.colorSpace=Rs,this.videos.set(e,{video:n,texture:t,isSky:s,active:!1}),t}registerMesh(e,o){this.videos.has(e)&&(this.videos.get(e).mesh=o)}update(){if(!this.camera)return;let e=[];for(let[s,n]of this.videos.entries())if(n.isSky)e.push({id:s,dist:0});else if(n.mesh){let t=this.camera.position.distanceTo(n.mesh.position);e.push({id:s,dist:t})}else e.push({id:s,dist:1/0});e.sort((s,n)=>s.dist-n.dist);let o=0;for(let{id:s}of e){let n=this.videos.get(s);o<this.maxConcurrent?(n.active||(n.video.play().catch(t=>console.warn("Autoplay prevented:",t)),n.active=!0),o++):n.active&&(n.video.pause(),n.active=!1)}}disposeVideo(e){let o=this.videos.get(e);o&&(o.video.pause(),o.video.removeAttribute("src"),o.video.load(),o.texture.dispose(),this.videos.delete(e))}},rs=new Ks;var Is=class{constructor(e){this.world=e,this.billboards=new je,this.billboards.name="memorialBillboards",this.world.scene.add(this.billboards),this.planeGeo=new rt(3,3)}init(e){for(;this.billboards.children.length>0;){let s=this.billboards.children[0];this.billboards.remove(s),s.material.dispose()}let o=new Ys;for(let s of e){if(!s.memorial)continue;let n=s.memorial,t=o;if(n.videoUrl&&rs)t=rs.createVideoTexture("plot_"+s.id,n.videoUrl,!1);else if(n.photo){let u=new Image;u.src=n.photo;let f=new Ys(u);u.onload=()=>f.needsUpdate=!0,t=f}let a=new Ct({map:t,transparent:!0,side:wt}),l=new r(this.planeGeo,a);l.position.set(s.x,s.y+2.5,s.z),l.onBeforeRender=(u,f,c)=>{l.quaternion.copy(c.quaternion)},this.billboards.add(l),n.videoUrl&&rs&&rs.registerMesh("plot_"+s.id,l)}}};var As=class extends ea{constructor(e){super(e),this.type=Bo}parse(e){let a=function(X,I){switch(X){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(I||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(I||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(I||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(I||""))}},m=function(X,I,h){I=I||1024;let C=X.pos,w=-1,i=0,_="",S=String.fromCharCode.apply(null,new Uint16Array(X.subarray(C,C+128)));for(;0>(w=S.indexOf(`
`))&&i<I&&C<X.byteLength;)_+=S,i+=S.length,C+=128,S+=String.fromCharCode.apply(null,new Uint16Array(X.subarray(C,C+128)));return-1<w?(h!==!1&&(X.pos+=i+w+1),_+S.slice(0,w)):!1},v=function(X){let I=/^#\?(\S+)/,h=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,g=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,C=/^\s*FORMAT=(\S+)\s*$/,w=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,i={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},_,S;for((X.pos>=X.byteLength||!(_=m(X)))&&a(1,"no header found"),(S=_.match(I))||a(3,"bad initial token"),i.valid|=1,i.programtype=S[1],i.string+=_+`
`;_=m(X),_!==!1;){if(i.string+=_+`
`,_.charAt(0)==="#"){i.comments+=_+`
`;continue}if((S=_.match(h))&&(i.gamma=parseFloat(S[1])),(S=_.match(g))&&(i.exposure=parseFloat(S[1])),(S=_.match(C))&&(i.valid|=2,i.format=S[1]),(S=_.match(w))&&(i.valid|=4,i.height=parseInt(S[1],10),i.width=parseInt(S[2],10)),i.valid&2&&i.valid&4)break}return i.valid&2||a(3,"missing format specifier"),i.valid&4||a(3,"missing image size specifier"),i},R=function(X,I,h){let g=I;if(g<8||g>32767||X[0]!==2||X[1]!==2||X[2]&128)return new Uint8Array(X);g!==(X[2]<<8|X[3])&&a(3,"wrong scanline width");let C=new Uint8Array(4*I*h);C.length||a(4,"unable to allocate buffer space");let w=0,i=0,_=4*g,S=new Uint8Array(4),W=new Uint8Array(_),ae=h;for(;ae>0&&i<X.byteLength;){i+4>X.byteLength&&a(1),S[0]=X[i++],S[1]=X[i++],S[2]=X[i++],S[3]=X[i++],(S[0]!=2||S[1]!=2||(S[2]<<8|S[3])!=g)&&a(3,"bad rgbe scanline format");let p=0,E;for(;p<_&&i<X.byteLength;){E=X[i++];let P=E>128;if(P&&(E-=128),(E===0||p+E>_)&&a(3,"bad scanline data"),P){let te=X[i++];for(let se=0;se<E;se++)W[p++]=te}else W.set(X.subarray(i,i+E),p),p+=E,i+=E}let T=g;for(let P=0;P<T;P++){let te=0;C[w]=W[P+te],te+=g,C[w+1]=W[P+te],te+=g,C[w+2]=W[P+te],te+=g,C[w+3]=W[P+te],w+=4}ae--}return C},b=function(X,I,h,g){let C=X[I+3],w=Math.pow(2,C-128)/255;h[g+0]=X[I+0]*w,h[g+1]=X[I+1]*w,h[g+2]=X[I+2]*w,h[g+3]=1},Y=function(X,I,h,g){let C=X[I+3],w=Math.pow(2,C-128)/255;h[g+0]=os.toHalfFloat(Math.min(X[I+0]*w,65504)),h[g+1]=os.toHalfFloat(Math.min(X[I+1]*w,65504)),h[g+2]=os.toHalfFloat(Math.min(X[I+2]*w,65504)),h[g+3]=os.toHalfFloat(1)},x=new Uint8Array(e);x.pos=0;let H=v(x),y=H.width,q=H.height,M=R(x.subarray(x.pos),y,q),V,$,ee;switch(this.type){case xs:ee=M.length/4;let X=new Float32Array(ee*4);for(let h=0;h<ee;h++)b(M,h*4,X,h*4);V=X,$=xs;break;case Bo:ee=M.length/4;let I=new Uint16Array(ee*4);for(let h=0;h<ee;h++)Y(M,h*4,I,h*4);V=I,$=Bo;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:y,height:q,data:V,header:H.string,gamma:H.gamma,exposure:H.exposure,type:$}}setDataType(e){return this.type=e,this}load(e,o,s,n){function t(a,l){switch(a.type){case xs:case Bo:a.colorSpace=Fn,a.minFilter=Ro,a.magFilter=Ro,a.generateMipmaps=!1,a.flipY=!0;break}o&&o(a,l)}return super.load(e,t,s,n)}};var Rr=new ye(12563354),br=new B,Hr=new B,_r=new B,Sr=new B,Cr=new ye,Pr=new ye,Gr=new so,zr=new _t;var Ds=class{constructor(e){this.world=e}_loadHDRI(){this._hdriLoading||this._hdriEnvMap||(this._hdriLoading=!0,new As().load("images/textures/meadow_2k.hdr",e=>{if(this._hdriLoading=!1,this.world._disposed||!this.world.lighting.pmrem){e.dispose();return}this._hdriTarget=this.world.lighting.pmrem.fromEquirectangular(e),this._hdriEnvMap=this._hdriTarget.texture,e.dispose(),this.world.lighting._updateEnvironment()},void 0,()=>{this._hdriLoading=!1}))}_pawTexture(){let e=document.createElement("canvas");e.width=e.height=256;let o=e.getContext("2d"),s=(n,t,a,l)=>{let u=Math.max(a,l),f=o.createRadialGradient(n,t,0,n,t,u);f.addColorStop(0,"rgba(255, 255, 255, 0.95)"),f.addColorStop(.55,"rgba(255, 240, 180, 0.70)"),f.addColorStop(.85,"rgba(255, 220, 120, 0.25)"),f.addColorStop(1,"rgba(255, 200, 80, 0.0)"),o.fillStyle=f,o.save(),o.translate(n,t),o.scale(a/u,l/u),o.beginPath(),o.arc(0,0,u,0,Math.PI*2),o.fill(),o.restore()};return s(128,164,52,44),s(68,92,22,28),s(116,68,22,28),s(164,72,22,28),s(204,100,20,26),new Kt(e)}_flareTexture(e,o){let s=document.createElement("canvas");s.width=s.height=128;let n=s.getContext("2d"),t=n.createRadialGradient(64,64,0,64,64,64);return t.addColorStop(0,e),t.addColorStop(.35,o),t.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=t,n.fillRect(0,0,128,128),new Kt(s)}_buildGlowTexture(){let e=document.createElement("canvas");e.width=e.height=128;let o=e.getContext("2d"),s=o.createRadialGradient(64,64,0,64,64,64);s.addColorStop(0,"rgba(255, 235, 180, 1.0)"),s.addColorStop(.2,"rgba(255, 200, 100, 0.65)"),s.addColorStop(.5,"rgba(255, 160, 50, 0.20)"),s.addColorStop(1,"rgba(255, 120, 20, 0)"),o.fillStyle=s,o.fillRect(0,0,128,128);let n=new Kt(e);return n.generateMipmaps=!1,n.minFilter=Ro,n}};var is=class He extends r{constructor(){let e=He.SkyShader,o=new Mt({name:e.name,uniforms:Xn.clone(e.uniforms),vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,side:Bn,depthWrite:!1});super(new ce(1,1,1),o),this.isSky=!0}};is.SkyShader={name:"SkyShader",uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new B},up:{value:new B(0,1,0)}},vertexShader:`
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

		}`};var cs=class He extends r{constructor(){super(He.Geometry,new Ct({opacity:0,transparent:!0})),this.isLensflare=!0,this.type="Lensflare",this.frustumCulled=!1,this.renderOrder=1/0;let e=new B,o=new B,s=new qs(16,16),n=new qs(16,16),t=Xs,a=He.Geometry,l=new Cs({uniforms:{scale:{value:null},screenPosition:{value:null}},vertexShader:`

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

				}`,depthTest:!0,depthWrite:!1,transparent:!1}),u=new Cs({uniforms:{map:{value:s},scale:{value:null},screenPosition:{value:null}},vertexShader:`

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

				}`,depthTest:!1,depthWrite:!1,transparent:!1}),f=new r(a,l),c=[],m=Lo.Shader,v=new Cs({name:m.name,uniforms:{map:{value:null},occlusionMap:{value:n},color:{value:new ye(16777215)},scale:{value:new kt},screenPosition:{value:new B}},vertexShader:m.vertexShader,fragmentShader:m.fragmentShader,blending:Ht,transparent:!0,depthWrite:!1}),R=new r(a,v);this.addElement=function(y){c.push(y)};let b=new kt,Y=new kt,x=new ia,H=new Vn;this.onBeforeRender=function(y,q,M){y.getCurrentViewport(H);let V=y.getRenderTarget(),$=V!==null?V.texture.type:Xs;t!==$&&(s.dispose(),n.dispose(),s.type=n.type=$,t=$);let ee=H.w/H.z,X=H.z/2,I=H.w/2,h=16/H.w;if(b.set(h*ee,h),x.min.set(H.x,H.y),x.max.set(H.x+(H.z-16),H.y+(H.w-16)),o.setFromMatrixPosition(this.matrixWorld),o.applyMatrix4(M.matrixWorldInverse),!(o.z>0)&&(e.copy(o).applyMatrix4(M.projectionMatrix),Y.x=H.x+e.x*X+X-8,Y.y=H.y+e.y*I+I-8,x.containsPoint(Y))){y.copyFramebufferToTexture(s,Y);let g=l.uniforms;g.scale.value=b,g.screenPosition.value=e,y.renderBufferDirect(M,null,a,l,f,null),y.copyFramebufferToTexture(n,Y),g=u.uniforms,g.scale.value=b,g.screenPosition.value=e,y.renderBufferDirect(M,null,a,u,f,null);let C=-e.x*2,w=-e.y*2;for(let i=0,_=c.length;i<_;i++){let S=c[i],W=v.uniforms;W.color.value.copy(S.color),W.map.value=S.texture,W.screenPosition.value.x=e.x+C*S.distance,W.screenPosition.value.y=e.y+w*S.distance,h=S.size/H.w;let ae=H.w/H.z;W.scale.value.set(h*ae,h),v.uniformsNeedUpdate=!0,y.renderBufferDirect(M,null,a,v,R,null)}}},this.dispose=function(){l.dispose(),u.dispose(),v.dispose(),s.dispose(),n.dispose();for(let y=0,q=c.length;y<q;y++)c[y].texture.dispose()}}},Lo=class{constructor(e,o=1,s=0,n=new ye(16777215)){this.texture=e,this.size=o,this.distance=s,this.color=n}};Lo.Shader={name:"LensflareElementShader",uniforms:{map:{value:null},occlusionMap:{value:null},color:{value:null},scale:{value:null},screenPosition:{value:null}},vertexShader:`

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

		}`};cs.Geometry=(function(){let He=new gt,e=new Float32Array([-1,-1,0,0,0,1,-1,0,1,0,1,1,0,1,1,-1,1,0,0,1]),o=new Zs(e,5);return He.setIndex([0,1,2,0,2,3]),He.setAttribute("position",new Hs(o,3,0,!1)),He.setAttribute("uv",new Hs(o,2,3,!1)),He})();var Ea={name:"FXAAShader",uniforms:{tDiffuse:{value:null},resolution:{value:new kt(1/1024,1/512)}},vertexShader:`

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
			
		}`};var $s=new _t,ls=class He{constructor(e){e=e||{},this.zNear=e.webGL===!0?-1:0,this.vertices={near:[new B,new B,new B,new B],far:[new B,new B,new B,new B]},e.projectionMatrix!==void 0&&this.setFromProjectionMatrix(e.projectionMatrix,e.maxFar||1e4)}setFromProjectionMatrix(e,o){let s=this.zNear,n=e.elements[11]===0;return $s.copy(e).invert(),this.vertices.near[0].set(1,1,s),this.vertices.near[1].set(1,-1,s),this.vertices.near[2].set(-1,-1,s),this.vertices.near[3].set(-1,1,s),this.vertices.near.forEach(function(t){t.applyMatrix4($s)}),this.vertices.far[0].set(1,1,1),this.vertices.far[1].set(1,-1,1),this.vertices.far[2].set(-1,-1,1),this.vertices.far[3].set(-1,1,1),this.vertices.far.forEach(function(t){t.applyMatrix4($s);let a=Math.abs(t.z);n?t.z*=Math.min(o/a,1):t.multiplyScalar(Math.min(o/a,1))}),this.vertices}split(e,o){for(;e.length>o.length;)o.push(new He);o.length=e.length;for(let s=0;s<e.length;s++){let n=o[s];if(s===0)for(let t=0;t<4;t++)n.vertices.near[t].copy(this.vertices.near[t]);else for(let t=0;t<4;t++)n.vertices.near[t].lerpVectors(this.vertices.near[t],this.vertices.far[t],e[s-1]);if(s===e.length-1)for(let t=0;t<4;t++)n.vertices.far[t].copy(this.vertices.far[t]);else for(let t=0;t<4;t++)n.vertices.far[t].lerpVectors(this.vertices.near[t],this.vertices.far[t],e[s])}}toSpace(e,o){for(let s=0;s<4;s++)o.vertices.near[s].copy(this.vertices.near[s]).applyMatrix4(e),o.vertices.far[s].copy(this.vertices.far[s]).applyMatrix4(e)}};var Js={lights_fragment_begin:`
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
	`+ss.lights_pars_begin};var wa=new _t,Qs=new ls({webGL:!0}),Co=new B,hs=new Un,en=[],tn=[],on=new _t,ga=new _t,Ua=new B(0,1,0),jo=class{constructor(e){this.camera=e.camera,this.parent=e.parent,this.cascades=e.cascades||3,this.maxFar=e.maxFar||1e5,this.mode=e.mode||"practical",this.shadowMapSize=e.shadowMapSize||2048,this.shadowBias=e.shadowBias||1e-6,this.lightDirection=e.lightDirection||new B(1,-1,1).normalize(),this.lightIntensity=e.lightIntensity||3,this.lightNear=e.lightNear||1,this.lightFar=e.lightFar||2e3,this.lightMargin=e.lightMargin||200,this.customSplitsCallback=e.customSplitsCallback,this.fade=!1,this.mainFrustum=new ls({webGL:!0}),this.frustums=[],this.breaks=[],this.lights=[],this.shaders=new Map,this.createLights(),this.updateFrustums(),this.injectInclude()}createLights(){for(let e=0;e<this.cascades;e++){let o=new Ps(16777215,this.lightIntensity);o.castShadow=!0,o.shadow.mapSize.width=this.shadowMapSize,o.shadow.mapSize.height=this.shadowMapSize,o.shadow.camera.near=this.lightNear,o.shadow.camera.far=this.lightFar,o.shadow.bias=this.shadowBias,this.parent.add(o),this.parent.add(o.target),this.lights.push(o)}}initCascades(){let e=this.camera;e.updateProjectionMatrix(),this.mainFrustum.setFromProjectionMatrix(e.projectionMatrix,this.maxFar),this.mainFrustum.split(this.breaks,this.frustums)}updateShadowBounds(){let e=this.frustums;for(let o=0;o<e.length;o++){let n=this.lights[o].shadow.camera,t=this.frustums[o],a=t.vertices.near,l=t.vertices.far,u=l[0],f;u.distanceTo(l[2])>u.distanceTo(a[2])?f=l[2]:f=a[2];let c=u.distanceTo(f);if(this.fade){let m=this.camera,v=Math.max(m.far,this.maxFar),R=t.vertices.far[0].z/(v-m.near),b=.25*Math.pow(R,2)*(v-m.near);c+=b}n.left=-c/2,n.right=c/2,n.top=c/2,n.bottom=-c/2,n.updateProjectionMatrix()}}getBreaks(){let e=this.camera,o=Math.min(e.far,this.maxFar);switch(this.breaks.length=0,this.mode){case"uniform":s(this.cascades,e.near,o,this.breaks);break;case"logarithmic":n(this.cascades,e.near,o,this.breaks);break;case"practical":t(this.cascades,e.near,o,.5,this.breaks);break;case"custom":this.customSplitsCallback===void 0&&console.error("CSM: Custom split scheme callback not defined."),this.customSplitsCallback(this.cascades,e.near,o,this.breaks);break}function s(a,l,u,f){for(let c=1;c<a;c++)f.push((l+(u-l)*c/a)/u);f.push(1)}function n(a,l,u,f){for(let c=1;c<a;c++)f.push(l*(u/l)**(c/a)/u);f.push(1)}function t(a,l,u,f,c){en.length=0,tn.length=0,n(a,l,u,tn),s(a,l,u,en);for(let m=1;m<a;m++)c.push(ts.lerp(en[m-1],tn[m-1],f));c.push(1)}}update(){let e=this.camera,o=this.frustums;on.lookAt(new B,this.lightDirection,Ua),ga.copy(on).invert();for(let s=0;s<o.length;s++){let n=this.lights[s],t=n.shadow.camera,a=(t.right-t.left)/this.shadowMapSize,l=(t.top-t.bottom)/this.shadowMapSize;wa.multiplyMatrices(ga,e.matrixWorld),o[s].toSpace(wa,Qs);let u=Qs.vertices.near,f=Qs.vertices.far;hs.makeEmpty();for(let c=0;c<4;c++)hs.expandByPoint(u[c]),hs.expandByPoint(f[c]);hs.getCenter(Co),Co.z=hs.max.z+this.lightMargin,Co.x=Math.floor(Co.x/a)*a,Co.y=Math.floor(Co.y/l)*l,Co.applyMatrix4(on),n.position.copy(Co),n.target.position.copy(Co),n.target.position.x+=this.lightDirection.x,n.target.position.y+=this.lightDirection.y,n.target.position.z+=this.lightDirection.z}}injectInclude(){ss.lights_fragment_begin=Js.lights_fragment_begin,ss.lights_pars_begin=Js.lights_pars_begin}setupMaterial(e){e.defines=e.defines||{},e.defines.USE_CSM=1,e.defines.CSM_CASCADES=this.cascades,this.fade&&(e.defines.CSM_FADE="");let o=[],s=this,n=this.shaders;e.onBeforeCompile=function(t){let a=Math.min(s.camera.far,s.maxFar);s.getExtendedBreaks(o),t.uniforms.CSM_cascades={value:o},t.uniforms.cameraNear={value:s.camera.near},t.uniforms.shadowFar={value:a},n.set(e,t)},n.set(e,null)}updateUniforms(){let e=Math.min(this.camera.far,this.maxFar);this.shaders.forEach(function(s,n){if(s!==null){let t=s.uniforms;this.getExtendedBreaks(t.CSM_cascades.value),t.cameraNear.value=this.camera.near,t.shadowFar.value=e}!this.fade&&"CSM_FADE"in n.defines?(delete n.defines.CSM_FADE,n.needsUpdate=!0):this.fade&&!("CSM_FADE"in n.defines)&&(n.defines.CSM_FADE="",n.needsUpdate=!0)},this)}getExtendedBreaks(e){for(;e.length<this.breaks.length;)e.push(new kt);e.length=this.breaks.length;for(let o=0;o<this.cascades;o++){let s=this.breaks[o],n=this.breaks[o-1]||0;e[o].x=n,e[o].y=s}}updateFrustums(){this.getBreaks(),this.initCascades(),this.updateShadowBounds(),this.updateUniforms()}remove(){for(let e=0;e<this.lights.length;e++)this.parent.remove(this.lights[e].target),this.parent.remove(this.lights[e])}dispose(){let e=this.shaders;e.forEach(function(o,s){delete s.onBeforeCompile,delete s.defines.USE_CSM,delete s.defines.CSM_CASCADES,delete s.defines.CSM_FADE,o!==null&&(delete o.uniforms.CSM_cascades,delete o.uniforms.cameraNear,delete o.uniforms.shadowFar),s.needsUpdate=!0}),e.clear()}};var Oa=jo.prototype.setupMaterial;jo.prototype.setupMaterial=function(He){if(He.userData.csmSetupDone)return;He.userData.csmSetupDone=!0;let e=He.onBeforeCompile;Oa.call(this,He);let o=He.onBeforeCompile;e&&e!==o&&(He.onBeforeCompile=function(s,n){e.call(this,s,n),o.call(this,s,n)})};var ri=new ye(12563354),ii=new B,ci=new B,li=new B,hi=new B,di=new ye,ui=new ye,fi=new so,pi=new _t;var Bs=class{constructor(e){this.world=e}_lights(){this.hemi=new ta(11849441,5261370,.35),this.world.scene.add(this.hemi),this.lightProbe=new na,this.world.scene.add(this.lightProbe);let e=new Ps(16774364,3.6);e.position.set(-800,950,600),e.castShadow=!1;let o=typeof window<"u"&&(/Mobi|Android/i.test(navigator.userAgent)||window.innerWidth<=768);this.csm=new jo({shadowBias:-1e-4,maxFar:1800,cascades:this.world.quality.cascades,mode:"practical",parent:this.world.scene,shadowMapSize:this.world.quality.shadowSize,lightDirection:new B(800,-950,-600).normalize(),camera:this.world.camera,lightIntensity:3.6,lightNear:1,lightFar:6e3,lightMargin:200,customSplitsCallback:function(s,n,t){let a=[];return s===2?a.push(t,t+(n-t)*.25,n):a.push(t,t+(n-t)*.05,t+(n-t)*.15,t+(n-t)*.4,n),a}}),this.csm.fade=!1,this.csm.lights.forEach((s,n)=>{s.shadow.bias=o?-.001:-5e-4-n*2e-4,s.shadow.normalBias=.015+n*.01,s.shadow.radius=1.5}),this.world.scene.add(e),this.sun=e}_sky(){this.sky=new is,this.sky.scale.setScalar(45e4),this.sky.frustumCulled=!1,this.world.scene.add(this.sky);let e=this.sky.material.uniforms;e.turbidity.value=4,e.rayleigh.value=1.35,e.mieCoefficient.value=.005,e.mieDirectionalG.value=.8,this.pmrem=new Zn(this.world.renderer),this._envScene=new bs,this._envSky=this.sky.clone(),this._envScene.add(this._envSky),this._buildLensflare()}_updateLighting(e,o){let s=e||this._forcedPhase||Zo(),n=typeof s=="string"?s:s?.key||"sunlit",t=n==="day"?"sunlit":n,a=o||Do[this.mood]||(t==="blessing"?Do.blessing:Do.clear),l={dawn:8,sunlit:36.5,day:36.5,dusk:6,night:40,blessing:35},u={dawn:85,sunlit:298,day:298,dusk:275,night:45,blessing:290},f=l[t]??43.5,c=u[t]??307,m=ts.degToRad(90-f),v=ts.degToRad(c),R=new B().setFromSphericalCoords(1,m,v);this._sunDir=R;let b={dawn:{zenith:1583698,horizon:15902852,ground:2634788,sunCol:16769210,sunInt:2.8},sunlit:{zenith:4685475,horizon:12241876,ground:3688488,sunCol:16774621,sunInt:3.6},day:{zenith:4685475,horizon:12241876,ground:3688488,sunCol:16774621,sunInt:3.6},dusk:{zenith:1186878,horizon:15364662,ground:3022358,sunCol:16746556,sunInt:2.8},night:{zenith:265246,horizon:1188932,ground:660498,sunCol:13954303,sunInt:1.4},blessing:{zenith:1586268,horizon:14207216,ground:3427372,sunCol:16775912,sunInt:3.4}},Y=b[t]||b.sunlit;if(this.sky?.material?.uniforms){let y=this.sky.material.uniforms;y.sunPosition&&y.sunPosition.value.copy(R),y.uSunPosition&&y.uSunPosition.value.copy(R),y.uZenithColor&&y.uZenithColor.value.setHex(Y.zenith),y.uHorizonColor&&y.uHorizonColor.value.setHex(Y.horizon),y.uGroundColor&&y.uGroundColor.value.setHex(Y.ground),y.uSunColor&&y.uSunColor.value.setHex(Y.sunCol),y.uSunIntensity&&(y.uSunIntensity.value=Y.sunInt)}let x={dawn:{exposure:1,sun:1.85,env:.7,hemi:1.15,sunCol:16769210,hemiSky:6969456,hemiGnd:3156e3,fogCol:12095620,fogDensity:75e-6,fogNear:1e3,fogFar:15e3,stars:0,clouds:16048084,water:1852502,bloom:.18,rainbow:.5,lanternGlow:.8},sunlit:{exposure:1.05,sun:2.4,env:.75,hemi:.42,sunCol:16774621,hemiSky:5273760,hemiGnd:3688488,fogCol:9484504,fogDensity:65e-6,fogNear:1200,fogFar:18e3,stars:0,clouds:16777215,water:1595508,bloom:.1,rainbow:.45,lanternGlow:.5},day:{exposure:1.05,sun:2.4,env:.75,hemi:.42,sunCol:16774621,hemiSky:5273760,hemiGnd:3688488,fogCol:9484504,fogDensity:65e-6,fogNear:1200,fogFar:18e3,stars:0,clouds:16777215,water:1595508,bloom:.1,rainbow:.45,lanternGlow:.5},dusk:{exposure:1,sun:1.85,env:.6,hemi:1.15,sunCol:16746556,hemiSky:6834248,hemiGnd:3022874,fogCol:11036756,fogDensity:75e-6,fogNear:900,fogFar:14e3,stars:.25,clouds:16492160,water:2111560,bloom:.22,rainbow:.65,lanternGlow:1.4},night:{exposure:1.18,sun:.65,env:.15,hemi:.7,sunCol:13954303,hemiSky:1846334,hemiGnd:1054740,fogCol:1319478,fogDensity:55e-6,fogNear:800,fogFar:12e3,stars:1,clouds:4348028,water:1322568,bloom:.2,rainbow:.75,lanternGlow:2.4},blessing:{exposure:1.08,sun:2,env:.85,hemi:1.35,sunCol:16775912,hemiSky:7110312,hemiGnd:3427372,fogCol:11453148,fogDensity:1e-4,fogNear:600,fogFar:9e3,stars:.15,clouds:16312564,water:1728632,bloom:.16,rainbow:1,lanternGlow:1.2}},H=x[t]||x.sunlit;if(this.bloomPass&&(this.bloomPass.strength=H.bloom),this.world.scene.background=null,this.csm&&(this.csm.lightDirection.copy(R).negate(),this.csm.lights.forEach(y=>{y.color.setHex(H.sunCol),y.intensity=H.sun*(a.light||1)})),this.sun&&(t==="sunlit"||t==="day"?this.sun.position.set(-800,950,600):this.sun.position.copy(R).multiplyScalar(3e3),this.sun.color.setHex(H.sunCol),this.sun.intensity=0),this.hemi&&(this.hemi.color.setHex(H.hemiSky),this.hemi.groundColor.setHex(H.hemiGnd),this.hemi.intensity=H.hemi),this.world.terrain._terrainShaders&&this.world.terrain._terrainShaders.forEach(y=>{y.uniforms?.uSunDir&&y.uniforms.uSunDir.value.copy(R)}),this.world._bgMountainShader?.uniforms?.uSunDir&&this.world._bgMountainShader.uniforms.uSunDir.value.copy(R),this.world._windMaterials)for(let y=0,q=this.world._windMaterials.length;y<q;y++){let M=this.world._windMaterials[y];M.userData?.botanicalShader?.uniforms?.uLightDir&&M.userData.botanicalShader.uniforms.uLightDir.value.copy(R),M.userData?.windShader?.uniforms?.uLightDir&&M.userData.windShader.uniforms.uLightDir.value.copy(R)}if(this.world.scene.fog)if(this.world.scene.fog.color.setHex(H.fogCol),this.world.scene.fog.isFogExp2){let y={clear:1,soft:1.3,blessing:1.8,crystal:1.15}[this.mood]??1;this.world.scene.fog.density=H.fogDensity*y}else this.world.scene.fog.isFog&&(this.world.scene.fog.near=H.fogNear,this.world.scene.fog.far=H.fogFar);return this.world.renderer.toneMappingExposure=H.exposure*((a.light||1)*.08+.92),this._envIntensity=H.env,this._updateEnvironment(),this.world.renderer.shadowMap.needsUpdate=!0,{sunDir:R,LOOK:H,LOOKS:x,SKY_PALETTE:Y,SKY_PALETTES:b,phaseKey:t}}_composer(){if(this.composer||!this.world.quality.post)return;let e=this.world.canvas.clientWidth||window.innerWidth,o=this.world.canvas.clientHeight||window.innerHeight,s=new Wn(e,o,{type:Bo}),n=new da(this.world.renderer,s);n.setPixelRatio(this.world.renderer.getPixelRatio()),n.addPass(new ua(this.world.scene,this.world.camera));let t=new fa(new kt(e/2,o/2),.1,.35,1.15);n.addPass(t),this.bloomPass=t,n.addPass(new pa),this._fxaaPass=new ha(Ea),n.addPass(this._fxaaPass),this.composer=n}_stars(){let o=new Float32Array(5400),s=new Float32Array(1800*3),n=new Float32Array(1800),t=yt(42),a=new ye;for(let u=0;u<1800;u++){let f=t()*Math.PI*2,c=Math.acos(t()*.95),m=8e3;o[u*3]=Math.cos(f)*Math.sin(c)*m,o[u*3+1]=Math.cos(c)*m+100,o[u*3+2]=Math.sin(f)*Math.sin(c)*m;let v=t();a.setHSL(.08+t()*.55,.35*t(),.72+v*.28),s[u*3]=a.r,s[u*3+1]=a.g,s[u*3+2]=a.b,n[u]=(.35+Math.pow(t(),5)*1.9)*46}let l=new gt;l.setAttribute("position",new ct(o,3)),l.setAttribute("color",new ct(s,3)),l.setAttribute("size",new ct(n,1)),l.computeBoundingSphere(),this.starMat=new Mt({transparent:!0,depthWrite:!1,fog:!1,blending:Ht,uniforms:{uTex:{value:this._starSprite()},uOpacity:{value:0},uTime:{value:0}},vertexShader:`
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
        }`,vertexColors:!0}),this.stars=new co(l,this.starMat),this.stars.visible=!1,this.stars.frustumCulled=!1,this.world.scene.add(this.stars)}_starSprite(){let e=document.createElement("canvas");e.width=e.height=64;let o=e.getContext("2d"),s=o.createRadialGradient(32,32,0,32,32,32);s.addColorStop(0,"rgba(255,255,255,1)"),s.addColorStop(.22,"rgba(255,255,255,0.55)"),s.addColorStop(1,"rgba(255,255,255,0)"),o.fillStyle=s,o.fillRect(0,0,64,64);let n=new Kt(e);return n.generateMipmaps=!1,n.minFilter=Ro,n}_horizon(){let e=new bo(5100,24e3,96,24);e.rotateX(-Math.PI/2),e.translate(0,0,500);let o=e.attributes.position;for(let t=0;t<o.count;t++){let a=o.getX(t),l=o.getZ(t),u=Math.hypot(a,l-500);if(l>800)o.setY(t,.2);else{let f=Math.max(0,Math.min(1,(u-5100)/9e3)),c=(jt(a*35e-5+15,l*35e-5+15,3)-.4)*160;o.setY(t,Math.max(0,c*(1-f)))}}e.computeVertexNormals();let s=new Ot({color:10536158,roughness:.95,metalness:.05,fog:!0});this.horizonMat=s;let n=new r(e,s);n.receiveShadow=!1,this.world.scene.add(n)}_godRays(){let e=new je,o=new Mt({uniforms:{uTime:{value:0},uColor:{value:new ye(16775904)},uIntensity:{value:.05}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:Ht,side:wt});this._godRayMat=o;let s=new L(18,140,420,16,1,!0);s.translate(0,-210,0);let n=new r(s,o);n.position.set(0,240,-420),n.rotation.set(.18,0,-.12),e.add(n);let t=new L(80,220,350,16,1,!0);t.translate(0,-175,0);let a=new r(t,o);a.position.set(-20,280,-760),a.rotation.set(.1,0,0),e.add(a),this.world.scene.add(e)}_updateEnvironment(){let e=this._forcedPhase?.key||"day";if(this.world.assetLoader._hdriEnvMap&&["day","sunlit","blessing"].includes(e)){this.world.scene.environment=this.world.assetLoader._hdriEnvMap,this.world.scene.environmentIntensity=this._envIntensity??.75;return}if(!this.pmrem||!this._envScene)return;let o=`${e}:${this.mood}`;(o!==this._environmentKey||!this._envRT)&&(this._environmentKey=o,this._envRT?.dispose(),this._envRT=this.pmrem.fromScene(this._envScene,.03)),this.world.scene.environment=this._envRT.texture,this.world.scene.environmentIntensity=this._envIntensity??.75}applyAmbience(){if(this.world._disposed)return;let e=this._forcedPhase||Zo(),o=typeof e=="string"?e:e?.key||"sunlit",s=o==="day"?"sunlit":o,n=es[s]||es[o]||es.sunlit||es.day,t=Do[this.mood]||(s==="blessing"?Do.blessing:Do.clear),{sunDir:a,LOOK:l}=this._updateLighting(e,t);if(this.world.scene.fog)if(this.world.scene.fog.color.setHex(l.fogCol),this.world.scene.fog.isFogExp2){let f={clear:1,soft:1.3,blessing:1.8,crystal:1.15}[this.mood]??1;this.world.scene.fog.density=l.fogDensity*f}else this.world.scene.fog.isFog&&(this.world.scene.fog.near=l.fogNear,this.world.scene.fog.far=l.fogFar);if(this.sky?.material&&(this.sky.material.fog=!1),this.stars.visible=l.stars>.01,this.starMat.uniforms.uOpacity.value=l.stars,this.horizonMat&&(this.horizonMat.visible=!0,this.horizonMat.color.setHex(l.fogCol)),this.world.renderer&&this.world.renderer.shadowMap&&(this.world.renderer.shadowMap.needsUpdate=!0),this._clouds&&this._clouds.forEach(f=>{f?.material?.color&&typeof f.material.color.setHex=="function"&&f.material.color.setHex(l.clouds)}),this.world.terrain._lanternMat&&(this.world.terrain._lanternMat.emissiveIntensity=l.lanternGlow),this.world.terrain.oceanMesh?.material?.color&&this.world.terrain.oceanMesh.material.color.setHex(l.water),this.world.waterObjects)for(let f of this.world.waterObjects)if(f.material?.uniforms){let c=f.material.uniforms;c.sunDirection&&c.sunDirection.value.copy(a),c.sunColor&&c.sunColor.value.setHex(l.sunCol),c.waterColor&&c.waterColor.value.setHex(l.water),c.distortionScale&&(c.distortionScale.value=t.rainbow>.7||s==="blessing"?4.2:3.8)}else f.material?.color&&f.material.color.setHex(l.water);let u=[this.world.terrain._lakeShader,this.world.terrain._oceanShader,this.world.terrain._surfShader,this.world.terrain._oceanWaterfallShader,this.world.terrain._mountainWaterfallShader,this.world._impactRingShader,this.world._mistShader,this.world._splashShader,this.world.terrain.riverMat,this.world._waterPoolMat,this.world.terrain._fountainBasinMat,this.world.terrain._fountainCascadeMat,this.world.terrain._shorelineFoamMaterial,...this.world.terrain._riverMaterials||[]];for(let f of u)f?.uniforms&&(f.uniforms.waterColor&&f.uniforms.waterColor.value.setHex(l.water),f.uniforms.uDeepColor&&f.uniforms.uDeepColor.value.setHex(l.water),f.uniforms.uDeepWater&&f.uniforms.uDeepWater.value.setHex(l.water),f.uniforms.sunColor&&f.uniforms.sunColor.value.setHex(l.sunCol),f.uniforms.uSunColor&&f.uniforms.uSunColor.value.setHex(l.sunCol),f.uniforms.sunDirection&&f.uniforms.sunDirection.value.copy(a),f.uniforms.uSunDir&&f.uniforms.uSunDir.value.copy(a),f.uniforms.uDepthTexture&&this.world.depthTexture&&(f.uniforms.uDepthTexture.value=this.world.depthTexture),f.uniforms.cameraNear&&this.world.camera&&(f.uniforms.cameraNear.value=this.world.camera.near),f.uniforms.cameraFar&&this.world.camera&&(f.uniforms.cameraFar.value=this.world.camera.far));this.bloomPass&&(this.bloomPass.strength=l.bloom,this.bloomPass.radius=.5+n.night*.2,this.bloomPass.threshold=s==="night"?.74:.94),this._rainbowBase=(.08+.1*(s==="blessing"?1:t.rainbow))*(1+n.night*.25),this._pawBase=.28}forcePhase(e){this._forcedPhase=e?{key:e,t:.5}:null,e==="blessing"&&(this.mood="blessing"),this.applyAmbience()}_buildLensflare(){let e=new cs;e.addElement(new Lo(this.world.assetLoader._flareTexture("rgba(255,246,224,0.4)","rgba(255,214,150,0.1)"),120,0)),e.addElement(new Lo(this.world.assetLoader._flareTexture("rgba(255,226,180,0.2)","rgba(255,190,120,0.04)"),45,.32)),this.lensflare=e,this.sun.add(e)}_cloudScape(){this._clouds=[];let e=yt(7024),o=pe.cloudCard();o&&(o.opacity=.35,o.transparent=!0,o.depthWrite=!1,o.blending=Ht);for(let s=0;s<14;s++){let n=520+e()*380,t=160+e()*120,a=new rt(n,t),l=new r(a,o);l.position.set((e()-.5)*2600,520+e()*320,-1100+e()*800),l.rotation.x=Math.PI*.12,l.rotation.y=e()*Math.PI*2,l.userData={speedX:(e()-.5)*.4+.6,origY:l.position.y,phase:e()*Math.PI*2},this.world.scene.add(l),this._clouds.push(l)}}};var uo=B;function va(){let He=new je;He.name="GrandCeremonialBoulevard";let e=[new uo(0,ke(0,820),820),new uo(0,ke(0,720),720),new uo(0,ke(0,560),560),new uo(0,ke(0,440),440),new uo(0,ke(0,320),320),new uo(0,ke(0,180),180),new uo(0,ke(0,82),82)],o=new It(e,!1,"centripetal",.25),s=260,n=10,t=26,a=t*.5,l=[],u=[],f=[],c=[],m=new uo(0,1,0),R=o.getLength()/14;for(let I=0;I<=s;I++){let h=I/s,g=o.getPoint(h),C=o.getTangent(h).normalize(),w=new uo().crossVectors(C,m).normalize(),i=g.z;for(let _=0;_<=n;_++){let S=_/n,W=(S-.5)*t,ae=g.x+w.x*W,p=i+w.z*W,E=ke(ae,p),T=(1-Math.pow((S-.5)*2,2))*.08,P=E+.25+T;l.push(ae,P,p),u.push(S,h*R),f.push(0,1,0)}if(I>0){let _=o.getPoint((I-1)/s).z,S=i;if(!(Math.min(_,S)>=378&&Math.max(_,S)<=502))for(let ae=0;ae<n;ae++){let p=(I-1)*(n+1),E=I*(n+1),T=p+ae,P=E+ae,te=p+(ae+1),se=E+(ae+1);c.push(T,P,te),c.push(te,P,se)}}}let b=new gt;b.setAttribute("position",new mt(l,3)),b.setAttribute("uv",new mt(u,2)),b.setAttribute("normal",new mt(f,3)),b.setIndex(c),b.computeVertexNormals(),b.computeBoundingSphere(),b.computeBoundingBox();let Y=pe.ceremonialBoulevard(1),x=new r(b,Y);x.receiveShadow=!0,x.castShadow=!1,He.add(x);let H=pe.honedCarraraMarble(1.5),y=.85,q=.38;for(let I of[-1,1]){let h=[],g=[],C=[];for(let _=0;_<=s;_++){let S=_/s,W=o.getPoint(S),ae=o.getTangent(S).normalize(),p=new uo().crossVectors(ae,m).normalize(),E=I*(a-y*.5),T=W.x+p.x*E,P=W.z+p.z*E,te=P>915?j.oceanLevel||.35:j.waterLevel,se=Math.max(ke(T,P),te+.3),oe=T-p.x*(y*.5*I),ne=P-p.z*(y*.5*I),k=T+p.x*(y*.5*I),O=P+p.z*(y*.5*I),ie=se+.48,ve=se-.65;if(h.push(k,ve,O),h.push(k,ie,O),h.push(oe,ie,ne),h.push(oe,ve,ne),g.push(0,S*R*2),g.push(.33,S*R*2),g.push(.66,S*R*2),g.push(1,S*R*2),_>0){let De=o.getPoint((_-1)/s).z,Ue=W.z;if(!(Math.min(De,Ue)>=378&&Math.max(De,Ue)<=502)){let N=(_-1)*4,Te=_*4;for(let Ce=0;Ce<3;Ce++){let Pe=N+Ce,D=Te+Ce,U=N+(Ce+1),G=Te+(Ce+1);C.push(Pe,D,U),C.push(U,D,G)}}}}let w=new gt;w.setAttribute("position",new mt(h,3)),w.setAttribute("uv",new mt(g,2)),w.setIndex(C),w.computeVertexNormals(),w.computeBoundingSphere(),w.computeBoundingBox();let i=new r(w,H);i.castShadow=!0,i.receiveShadow=!0,He.add(i)}let M=[],V=[],$=pe.agedCaenLimestone(4);for(let I=0;I<=s;I+=2){let h=I/s,g=o.getPoint(h),C=o.getTangent(h).normalize(),w=new uo().crossVectors(C,m).normalize(),i=t+3,_=g.x-w.x*(i*.5),S=g.z-w.z*(i*.5),W=g.x+w.x*(i*.5),ae=g.z+w.z*(i*.5),p=S>915?j.oceanLevel||.35:j.waterLevel,E=ae>915?j.oceanLevel||.35:j.waterLevel,T=Math.max(ke(_,S),p+.2)-.18,P=Math.max(ke(W,ae),E+.2)-.18;if(M.push(_,T,S,W,P,ae),I>0){let te=I/2*2;V.push(te-2,te-1,te,te-1,te+1,te)}}let ee=new gt;ee.setAttribute("position",new mt(M,3)),ee.setIndex(V),ee.computeVertexNormals();let X=new r(ee,$);return X.receiveShadow=!0,He.add(X),He}function ya(He){let{pts:e,ring:o,cx:s,cz:n,r:t,w:a}=He,l=4,u=[],f=[],c=[],m=[],v=new uo(0,1,0);if(o){let H=a*.5;for(let y=0;y<=72;y++){let q=y/72*Math.PI*2,M=Math.cos(q),V=Math.sin(q),$=t;for(let ee=0;ee<=l;ee++){let X=ee/l,I=$-H+X*a,h=s+M*I,g=n+V*I,C=g>915?j.oceanLevel||.35:j.waterLevel,w=Math.max(ke(h,g),C+.3),i=(1-Math.pow((X-.5)*2,2))*.05,_=w+.12+i;u.push(h,_,g),f.push(X,y/72*12),m.push(0,1,0)}if(y>0)for(let ee=0;ee<l;ee++){let X=(y-1)*(l+1),I=y*(l+1),h=X+ee,g=I+ee,C=X+(ee+1),w=I+(ee+1);c.push(h,g,C),c.push(C,g,w)}}}else{let x=[];for(let V=0;V<e.length;V++){let[$,ee]=e[V];x.push(new uo($,ke($,ee),ee))}let H=new It(x,!1,"centripetal",.25),y=e.length*18,M=H.getLength()/8;for(let V=0;V<=y;V++){let $=V/y,ee=H.getPoint($),X=H.getTangent($).normalize(),I=new uo().crossVectors(X,v).normalize();for(let h=0;h<=l;h++){let g=h/l,C=(g-.5)*a,w=ee.x+I.x*C,i=ee.z+I.z*C,_=i>915?j.oceanLevel||.35:j.waterLevel,S=Math.max(ke(w,i),_+.3),W=(1-Math.pow((g-.5)*2,2))*.05,ae=S+.12+W;u.push(w,ae,i),f.push(g,$*M),m.push(0,1,0)}if(V>0)for(let h=0;h<l;h++){let g=(V-1)*(l+1),C=V*(l+1),w=g+h,i=C+h,_=g+(h+1),S=C+(h+1);c.push(w,i,_),c.push(_,i,S)}}}let R=new gt;R.setAttribute("position",new mt(u,3)),R.setAttribute("uv",new mt(f,2)),R.setAttribute("normal",new mt(m,3)),R.setIndex(c),R.computeVertexNormals(),R.computeBoundingSphere(),R.computeBoundingBox();let b=pe.pavedRoad(2),Y=new r(R,b);return Y.receiveShadow=!0,Y.frustumCulled=!0,Y}var ao=(He,e=!1)=>{if(!He||!Array.isArray(He)||He.length===0)return null;let o=He.filter(f=>f&&f.attributes&&f.attributes.position);if(o.length===0)return null;if(o.length===1)return o[0];let s=!1,n=!1,t=!1,a=!1,l=!1;for(let f of o)f.index?s=!0:n=!0,f.attributes.color&&(t=!0),f.attributes.uv&&(a=!0),f.attributes.normal&&(l=!0);let u=o.map(f=>{let c=f;if(s&&n&&f.index&&(c=f.toNonIndexed()),l&&!c.attributes.normal&&c.computeVertexNormals(),a&&!c.attributes.uv){let m=c.attributes.position.count,v=new Float32Array(m*2);c.setAttribute("uv",new ct(v,2))}if(t&&!c.attributes.color){let m=c.attributes.position.count,v=new Float32Array(m*3).fill(1);c.setAttribute("color",new ct(v,3))}else!t&&c.attributes.color&&c.deleteAttribute("color");return c});try{let f=ks(u,e);return u.forEach(c=>{c&&c.dispose()}),f}catch(f){return console.warn("[world3d] mergeGeometries fallback:",f),null}},qe=ao,sn=null;function ds(He,e=.04){if(!sn){let s=document.createElement("canvas");s.width=s.height=128;let n=s.getContext("2d"),t=n.createRadialGradient(64,64,4,64,64,64);t.addColorStop(0,"rgba(0, 0, 0, 0.72)"),t.addColorStop(.4,"rgba(0, 0, 0, 0.38)"),t.addColorStop(.8,"rgba(0, 0, 0, 0.10)"),t.addColorStop(1,"rgba(0, 0, 0, 0)"),n.fillStyle=t,n.fillRect(0,0,128,128);let a=new Kt(s);sn=new Ct({map:a,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1})}let o=new r(new rt(He*2,He*2),sn);return o.rotation.x=-Math.PI/2,o.position.y=e,o}var ht=B,bi=new ye(12563354),Hi=new B,_i=new B,Si=new B,Ci=new B,Pi=new ye,Gi=new ye,zi=new so,ki=new _t;function Yt(He,e=.08,o=.28,s=17){if(!He||!He.attributes||!He.attributes.position)return He;let n=He.attributes.position;for(let t=0;t<n.count;t++){let a=n.getX(t),l=n.getY(t),u=n.getZ(t);(isNaN(a)||!isFinite(a))&&(a=0),(isNaN(l)||!isFinite(l))&&(l=0),(isNaN(u)||!isFinite(u))&&(u=0);let f=(jt(a*e+s,u*e+s,2)-.5)*o,c=(jt(l*e*1.5+s*2,a*e+s,2)-.5)*(o*.6),m=isNaN(f)?a:a+f,v=isNaN(c)?l:l+c,R=isNaN(f)?u:u+f;n.setXYZ(t,m,v,R)}return n.needsUpdate=!0,He.computeVertexNormals(),He.computeBoundingSphere&&He.computeBoundingSphere(),He.computeBoundingBox&&He.computeBoundingBox(),He}function Ko(He,e=0,o=.45){if(!He||!He.attributes.position)return He;let s=He.attributes.position,n=He.attributes.normal,t=new Float32Array(s.count*3);for(let a=0;a<s.count;a++){let l=s.getY(a),u=n?n.getY(a):0,f=Math.max(0,Math.min(1,(l-e)/4)),c=Math.max(0,u*.5+.5),m=Math.max(.35,Math.min(1,.45+.35*f+.2*c));t[a*3]=m,t[a*3+1]=m,t[a*3+2]=m}return He.setAttribute("color",new ct(t,3)),He}var Ls=class{constructor(e){this.world=e}async _terrain(){let e=this.world.quality.terrain,o=new rt(4600,5200,e,e);o.rotateX(-Math.PI/2);let s=o.attributes.position;for(let l=0;l<s.count;l++)l%2048===0&&await new Promise(u=>setTimeout(u,0)),s.setY(l,ke(s.getX(l),s.getZ(l)));o.computeVertexNormals();let n=new Float32Array(s.count),t=e+1;for(let l=0;l<s.count;l++){let u=Math.floor(l/t),f=l%t,c=s.getY(l),m=c,v=1;for(let R of[u?-t:0,u<e?t:0,f?-1:0,f<e?1:0])R&&(m+=s.getY(l+R),v++);n[l]=Math.max(.45,1-Math.max(0,m/v-c)*.08)}o.setAttribute("aCreviceAO",new ct(n,1)),o.computeBoundingSphere();let a=new r(o,Gs(this.world.renderer));a.name="Terrain",a.receiveShadow=!0,this.world.scene.add(a),this.terrainMesh=a,this.terrainPatch=null,this._updateTerrainPatch=()=>{}}async _water(){let e;try{let d=yo("waterNormals"),le=d?.normalMap||d?.normal||d;e=le&&typeof le.clone=="function"?le.clone():null}catch(d){console.warn("[water] normal texture failed, using fallback",d)}if(!e){let d=document.createElement("canvas");d.width=d.height=4;let le=d.getContext("2d");le.fillStyle="#8080ff",le.fillRect(0,0,4,4),e=new Kt(d)}e.wrapS=e.wrapT=qo,e.repeat.set(16,16),this._waterNormals=e,this._fountainBasinMat=this._createFountainBasinMaterial(e),this._fountainCascadeMat=this._createFountainCascadeMaterial(e),this.riverMat=this._createRiverMaterial(e);let o=j.lake.r,s=36,n=96,t=[],a=[],l=[];t.push(0,0,0),a.push(.5,.5);for(let d=1;d<=s;d++){let le=d/s*o;for(let fe=0;fe<n;fe++){let me=fe/n*Math.PI*2,Re=Math.cos(me)*le,Fe=Math.sin(me)*le;t.push(Re,0,Fe),a.push(Re/(o*2)+.5,Fe/(o*2)+.5)}}for(let d=0;d<n;d++){let le=(d+1)%n;l.push(0,d+1,le+1)}for(let d=1;d<s;d++){let le=1+(d-1)*n,fe=1+d*n;for(let me=0;me<n;me++){let Re=(me+1)%n,Fe=le+me,Qe=fe+me,Rt=fe+Re,Oo=le+Re;l.push(Fe,Qe,Oo),l.push(Qe,Rt,Oo)}}let u=new gt;u.setAttribute("position",new mt(t,3)),u.setAttribute("uv",new mt(a,2)),u.setIndex(l),u.computeVertexNormals();let f=this._createPhysicalWaterMaterial(this._waterNormals,"lake");this._lakeShader=f,u.computeBoundingSphere(),u.computeBoundingBox();let c=new r(u,f);c.position.set(j.lake.x,j.waterLevel,j.lake.z),c.receiveShadow=!0,c.frustumCulled=!1,c.renderOrder=1,this.world.scene.add(c),this.lakeWater=c,this.water=c,this._lakeMesh=c,this.waterMat=f;let m=new bo(j.lake.r-2.5,j.lake.r+2,64,1);m.computeBoundingSphere();let v=`
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
    `,R=`
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
        float angle = atan(vWorldPos.z - (${j.lake.z.toFixed(1)}), vWorldPos.x - (${j.lake.x.toFixed(1)}));
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
    `,b=new Mt({vertexShader:v,fragmentShader:R,uniforms:{uTime:{value:0}},transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:wt}),Y=new r(m,b);Y.rotation.x=-Math.PI/2,Y.position.set(j.lake.x,j.waterLevel+.08,j.lake.z),Y.renderOrder=2,Y.frustumCulled=!1,this.world.scene.add(Y),this._shorelineFoamMaterial=b;let x=new rt(36e3,24e3,48,32);x.rotateX(-Math.PI/2),x.translate(0,0,12e3),x.computeBoundingSphere(),x.computeBoundingBox();let H=this._createPhysicalWaterMaterial(e,"ocean");this._oceanShader=H;let y=new r(x,H);y.position.y=j.oceanLevel||.35,y.receiveShadow=!0,y.frustumCulled=!0,y.renderOrder=1,this.world.scene.add(y),this.oceanMesh=y;let q=[{cx:0,cy:161.5,cz:-535,radiusX:38,radiusZ:32,count:84,type:"abyssal_trout"},{cx:16,cy:165,cz:-515,radiusX:34,radiusZ:36,count:84,type:"abyssal_trout"},{cx:-18,cy:169,cz:-540,radiusX:32,radiusZ:30,count:84,type:"glacial_trout"},{cx:8,cy:172.5,cz:-495,radiusX:32,radiusZ:34,count:78,type:"glacial_trout"},{cx:-15,cy:175.5,cz:-520,radiusX:30,radiusZ:28,count:72,type:"sapphire_gliders"},{cx:12,cy:177,cz:-545,radiusX:28,radiusZ:26,count:66,type:"sapphire_gliders"},{cx:0,cy:179.5,cz:-475,radiusX:26,radiusZ:26,count:66,type:"rapids_trout"},{cx:0,cy:7.5,cz:-362,radiusX:34,radiusZ:34,count:78,type:"grotto_trout"},{cx:16,cy:11.5,cz:-355,radiusX:30,radiusZ:32,count:72,type:"grotto_trout"},{cx:-14,cy:14.5,cz:-365,radiusX:28,radiusZ:30,count:66,type:"cascade_gliders"},{cx:75,cy:13,cz:-345,radiusX:32,radiusZ:28,count:24,type:"river_gliders"},{cx:0,cy:9.2,cz:440,radiusX:25,radiusZ:48,count:26,type:"river_gliders"},{cx:115,cy:7.2,cz:680,radiusX:28,radiusZ:50,count:24,type:"river_gliders"}],M=this._buildKoiMesh(),V=new tt({color:16777215,roughness:.15,metalness:.1,clearcoat:1,clearcoatRoughness:.08,vertexColors:!0});this._instancedFishMat=V,V.onBeforeCompile=function(d){d.uniforms.uTime={value:0},this.userData.shader=d,d.vertexShader=`
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
        `)};let $=[],ee=yt(112233);q.forEach(d=>{for(let le=0;le<d.count;le++){let fe=le/d.count*Math.PI*2+(ee()-.5)*.6,me=(ee()*.8+.2)*d.radiusX,Re=(ee()*.8+.2)*d.radiusZ,Fe=(ee()-.5)*3.2,Qe=[.22,.82,.65],Rt=ee();d.type==="abyssal_trout"?Qe=Rt<.5?[.15,.68,.95]:[.08,.45,.85]:d.type==="sapphire_gliders"?Qe=Rt<.5?[.35,.75,.98]:[.85,.92,.98]:d.type==="grotto_trout"?Qe=Rt<.5?[.28,.85,.62]:[.18,.65,.55]:d.type==="rapids_trout"||d.type==="cascade_gliders"?Qe=Rt<.5?[.95,.45,.22]:[.92,.85,.35]:Qe=Rt<.6?[.22,.82,.65]:[.32,.72,.92],$.push({center:{x:d.cx,y:d.cy,z:d.cz},radiusX:me,radiusZ:Re,angle:fe,yOffset:Fe,phase:ee()*Math.PI*2,speed:(ee()*.4+.6)*1.2,orbitSpeed:(ee()*.4+.6)*.08,dir:ee()<.5?1:-1,wanderAmp:ee()*8+4,vertAmp:ee()*.45+.35,scale:ee()*.4+.8,color:Qe})}});let X=$.length;M.computeBoundingSphere();let I=new ut(M,V,X),h=new Float32Array(X),g=new Float32Array(X),C=new Float32Array(X*3),w=new Lt;$.forEach((d,le)=>{h[le]=d.phase,g[le]=d.speed,C[le*3]=d.color[0],C[le*3+1]=d.color[1],C[le*3+2]=d.color[2];let fe=d.center.x+Math.cos(d.angle)*d.radiusX,me=d.center.z+Math.sin(d.angle)*d.radiusZ,Re=d.center.y+d.yOffset;w.position.set(fe,Re,me),w.rotation.set(0,d.angle+Math.PI/2,0),w.scale.setScalar(d.scale),w.updateMatrix(),I.setMatrixAt(le,w.matrix)}),M.setAttribute("aPhase",new Ft(h,1)),M.setAttribute("aSpeed",new Ft(g,1)),M.setAttribute("aColor",new Ft(C,3)),I.instanceMatrix.needsUpdate=!0,I.frustumCulled=!1,I.castShadow=!1,I.receiveShadow=!1,this._troutData=$,this._troutMesh=I,this.world.scene.add(I);let i=this._buildKoiMesh(),_=[{cx:430,cy:-.5,cz:-260,radiusX:115,radiusZ:125,count:135,type:"sovereign_koi"},{cx:460,cy:2.5,cz:-280,radiusX:105,radiusZ:115,count:144,type:"sovereign_koi"},{cx:410,cy:5.5,cz:-240,radiusX:105,radiusZ:115,count:126,type:"golden_koi"},{cx:330,cy:7.8,cz:-200,radiusX:85,radiusZ:95,count:114,type:"golden_koi"},{cx:450,cy:8.2,cz:-380,radiusX:95,radiusZ:100,count:120,type:"lake_trout"},{cx:530,cy:8.8,cz:-250,radiusX:85,radiusZ:90,count:105,type:"golden_koi"},{cx:370,cy:9.5,cz:-120,radiusX:75,radiusZ:85,count:102,type:"river_gliders"}],S=[],W=yt(559922);_.forEach(d=>{for(let le=0;le<d.count;le++){let fe=le/d.count*Math.PI*2+(W()-.5)*.6,me=(W()*.8+.2)*d.radiusX,Re=(W()*.8+.2)*d.radiusZ,Fe=(W()-.5)*3.8,Qe=[1,.78,.16],Rt=W();d.type==="sovereign_koi"||d.type==="golden_koi"?Rt<.28?Qe=[.98,.28,.12]:Rt<.58?Qe=[1,.78,.16]:Rt<.78?Qe=[.98,.96,.9]:Rt<.9?Qe=[1,.52,.12]:Qe=[.92,.75,.22]:Rt<.45?Qe=[.22,.82,.65]:Rt<.8?Qe=[.28,.68,.95]:Qe=[.95,.78,.35],S.push({center:new B(d.cx,d.cy,d.cz),radiusX:me,radiusZ:Re,angle:fe,speed:.42+W()*.35,orbitSpeed:.08+W()*.12,dir:W()<.5?1:-1,wanderAmp:W()*12+6,vertAmp:W()*.55+.4,yOffset:Fe,scale:3.2+W()*2.2,phase:W()*Math.PI*2,color:Qe})}});let ae=S.length;i.computeBoundingSphere();let p=new ut(i,V,ae),E=new Float32Array(ae),T=new Float32Array(ae),P=new Float32Array(ae*3);S.forEach((d,le)=>{E[le]=d.phase,T[le]=d.speed,P[le*3]=d.color[0],P[le*3+1]=d.color[1],P[le*3+2]=d.color[2];let fe=d.center.x+Math.cos(d.angle)*d.radiusX,me=d.center.z+Math.sin(d.angle)*d.radiusZ,Re=d.center.y+d.yOffset;w.position.set(fe,Re,me),w.rotation.set(0,d.angle+Math.PI/2,0),w.scale.setScalar(d.scale),w.updateMatrix(),p.setMatrixAt(le,w.matrix)}),i.setAttribute("aPhase",new Ft(E,1)),i.setAttribute("aSpeed",new Ft(T,1)),i.setAttribute("aColor",new Ft(P,3)),p.instanceMatrix.needsUpdate=!0,p.frustumCulled=!1,p.castShadow=!1,p.receiveShadow=!1,this._koiData=S,this._koiMesh=p,this.world.scene.add(p);let te=this._buildReefFishMesh(),se=[{cx:35,cy:-3.8,cz:2210,radiusX:65,radiusZ:75,count:165,type:"reef_clownfish"},{cx:-25,cy:-4.5,cz:2250,radiusX:70,radiusZ:80,count:180,type:"reef_tangs"},{cx:-55,cy:-5.2,cz:2280,radiusX:60,radiusZ:68,count:150,type:"reef_beauties"},{cx:20,cy:-16.5,cz:2320,radiusX:95,radiusZ:110,count:195,type:"reef_tangs"},{cx:-45,cy:-18.2,cz:2360,radiusX:90,radiusZ:100,count:165,type:"reef_clownfish"},{cx:0,cy:-32,cz:2390,radiusX:135,radiusZ:155,count:180,type:"pelagic_jacks"},{cx:85,cy:-36.5,cz:2460,radiusX:125,radiusZ:140,count:135,type:"pelagic_jacks"},{cx:20,cy:-65,cz:2500,radiusX:140,radiusZ:160,count:240,type:"pelagic_jacks"},{cx:-40,cy:-95,cz:2550,radiusX:150,radiusZ:180,count:255,type:"pelagic_jacks"},{cx:60,cy:-120,cz:2600,radiusX:180,radiusZ:200,count:300,type:"pelagic_jacks"},{cx:65,cy:-6.5,cz:1180,radiusX:85,radiusZ:95,count:120,type:"reef_clownfish"},{cx:-60,cy:-8,cz:1320,radiusX:90,radiusZ:100,count:105,type:"reef_tangs"}],oe=[],ne=yt(771144);se.forEach(d=>{for(let le=0;le<d.count;le++){let fe=le/d.count*Math.PI*2+(ne()-.5)*.5,me=(ne()*.75+.25)*d.radiusX,Re=(ne()*.75+.25)*d.radiusZ,Fe=(ne()-.5)*3,Qe=[1,.45,.12],Rt=ne();d.type==="reef_clownfish"?Rt<.4?Qe=[1,.48,.1]:Rt<.7?Qe=[.08,.95,.85]:Qe=[.98,.22,.65]:d.type==="reef_tangs"?Rt<.35?Qe=[.05,.65,1]:Rt<.68?Qe=[1,.92,.08]:Rt<.86?Qe=[.95,.82,.15]:Qe=[.75,.2,.95]:d.type==="reef_beauties"?Rt<.45?Qe=[.55,.15,.85]:Rt<.75?Qe=[1,.62,.28]:Qe=[.15,.95,.72]:Rt<.5?Qe=[.12,.55,.95]:Qe=[.88,.92,.98],oe.push({center:new B(d.cx,d.cy,d.cz),radiusX:me,radiusZ:Re,angle:fe,speed:.55+ne()*.45,orbitSpeed:.12+ne()*.16,dir:ne()<.5?1:-1,wanderAmp:ne()*10+5,vertAmp:ne()*.5+.35,yOffset:Fe,scale:2.2+ne()*1.6,phase:ne()*Math.PI*2,color:Qe})}});let k=oe.length;te.computeBoundingSphere();let O=new ut(te,V,k),ie=new Float32Array(k),ve=new Float32Array(k),De=new Float32Array(k*3);oe.forEach((d,le)=>{ie[le]=d.phase,ve[le]=d.speed,De[le*3]=d.color[0],De[le*3+1]=d.color[1],De[le*3+2]=d.color[2];let fe=d.center.x+Math.cos(d.angle)*d.radiusX,me=d.center.z+Math.sin(d.angle)*d.radiusZ,Re=d.center.y+d.yOffset;w.position.set(fe,Re,me),w.rotation.set(0,d.angle+Math.PI/2,0),w.scale.setScalar(d.scale),w.updateMatrix(),O.setMatrixAt(le,w.matrix)}),te.setAttribute("aPhase",new Ft(ie,1)),te.setAttribute("aSpeed",new Ft(ve,1)),te.setAttribute("aColor",new Ft(De,3)),O.instanceMatrix.needsUpdate=!0,O.frustumCulled=!1,O.castShadow=!1,O.receiveShadow=!1,this._reefFishData=oe,this._reefFishMesh=O,this._fishData=oe,this._fishMesh=O,this.world.scene.add(O);let Ue=this._buildSeaTurtleMesh(),Ke={uniforms:{uTime:{value:0},uDeepWaterColor:{value:new ye(537156)},uSunDir:{value:new B(.4,.8,.5).normalize()},uSunColor:{value:new ye(16772829)}},vertexShader:`
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
      `,side:wt},N=new Mt(Ke);this._seaTurtleShader=N;let Te=[{cx:15,cy:-8.5,cz:2225,radiusX:35,radiusZ:40,count:2},{cx:-18,cy:-14,cz:2275,radiusX:42,radiusZ:48,count:2},{cx:-35,cy:-18.5,cz:2245,radiusX:38,radiusZ:42,count:2},{cx:38,cy:-12,cz:2290,radiusX:45,radiusZ:50,count:2},{cx:-42,cy:-22,cz:2330,radiusX:52,radiusZ:56,count:2},{cx:0,cy:-26,cz:2360,radiusX:58,radiusZ:64,count:2},{cx:-45,cy:-6.5,cz:1150,radiusX:55,radiusZ:65,count:2},{cx:55,cy:-7.5,cz:1220,radiusX:60,radiusZ:70,count:2},{cx:10,cy:-55,cz:2450,radiusX:80,radiusZ:90,count:4},{cx:-20,cy:-85,cz:2550,radiusX:100,radiusZ:110,count:6},{cx:40,cy:-105,cz:2600,radiusX:120,radiusZ:130,count:4}],Ce=[],Pe=yt(111444);Te.forEach(d=>{for(let le=0;le<d.count;le++){let fe=le/d.count*Math.PI*2+(Pe()-.5)*.4,me=(Pe()*.6+.4)*d.radiusX,Re=(Pe()*.6+.4)*d.radiusZ,Fe=(Pe()-.5)*2;Ce.push({center:new B(d.cx,d.cy,d.cz),radiusX:me,radiusZ:Re,angle:fe,speed:.25+Pe()*.15,orbitSpeed:.035+Pe()*.02,dir:Pe()<.5?1:-1,wanderAmp:Pe()*6+3,vertAmp:Pe()*.3+.2,yOffset:Fe,scale:2.5+Pe()*.4,phase:Pe()*Math.PI*2,color:[.22+Pe()*.04,.42+Pe()*.06,.18+Pe()*.04]})}});let D=Ce.length;Ue.computeBoundingSphere();let U=new ut(Ue,N,D),G=new Float32Array(D),A=new Float32Array(D),z=new Float32Array(D*3);Ce.forEach((d,le)=>{G[le]=d.phase,A[le]=d.speed,z[le*3]=d.color[0],z[le*3+1]=d.color[1],z[le*3+2]=d.color[2];let fe=d.cx+Math.cos(d.phase)*d.radiusX,me=d.cz+Math.sin(d.phase)*d.radiusZ;w.position.set(fe,d.cy,me),w.rotation.set(0,d.phase+Math.PI/2,0),w.scale.setScalar(d.scale),w.updateMatrix(),U.setMatrixAt(le,w.matrix)}),Ue.setAttribute("aPhase",new Ft(G,1)),Ue.setAttribute("aSpeed",new Ft(A,1)),Ue.setAttribute("aColor",new Ft(z,3)),U.instanceMatrix.needsUpdate=!0,U.frustumCulled=!1,U.castShadow=!1,U.receiveShadow=!1,this._seaTurtleData=Ce,this._seaTurtleMesh=U,this.world.scene.add(U);let F=this._buildMantaRayMesh(),Q={uniforms:{uTime:{value:0},uDeepWaterColor:{value:new ye(403512)},uSunDir:{value:new B(.4,.8,.5).normalize()},uSunColor:{value:new ye(16772829)}},vertexShader:`
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
      `,side:wt},ue=new Mt(Q);this._mantaRayShader=ue;let ge=[{cx:10,cy:-18.5,cz:2235,radiusX:45,radiusZ:55,speed:.26,orbitSpeed:.028,scale:3.2,phase:.6,dir:1},{cx:-20,cy:-24,cz:2270,radiusX:52,radiusZ:60,speed:.24,orbitSpeed:.025,scale:3.5,phase:2.4,dir:-1},{cx:-38,cy:-28.5,cz:2230,radiusX:48,radiusZ:56,speed:.25,orbitSpeed:.027,scale:3.1,phase:1.2,dir:1},{cx:32,cy:-32,cz:2285,radiusX:58,radiusZ:66,speed:.22,orbitSpeed:.022,scale:3.4,phase:4.6,dir:-1},{cx:-45,cy:-12,cz:1240,radiusX:85,radiusZ:95,speed:.22,orbitSpeed:.024,scale:3,phase:0,dir:1},{cx:55,cy:-14.5,cz:1300,radiusX:90,radiusZ:100,speed:.2,orbitSpeed:.022,scale:3.2,phase:3.5,dir:-1},{cx:20,cy:-15.5,cz:2255,radiusX:55,radiusZ:65,speed:.28,orbitSpeed:.03,scale:2.8,phase:1.6,dir:-1},{cx:-10,cy:-22,cz:2260,radiusX:62,radiusZ:70,speed:.23,orbitSpeed:.024,scale:3.7,phase:3.4,dir:1},{cx:-28,cy:-30.5,cz:2250,radiusX:58,radiusZ:66,speed:.26,orbitSpeed:.026,scale:2.9,phase:2.2,dir:-1},{cx:42,cy:-35,cz:2305,radiusX:68,radiusZ:76,speed:.21,orbitSpeed:.021,scale:3.6,phase:5.6,dir:1},{cx:-35,cy:-15,cz:1260,radiusX:95,radiusZ:105,speed:.24,orbitSpeed:.026,scale:3.3,phase:1,dir:-1},{cx:65,cy:-17.5,cz:1280,radiusX:100,radiusZ:110,speed:.21,orbitSpeed:.023,scale:3.5,phase:4.5,dir:1},{cx:0,cy:-45,cz:2400,radiusX:120,radiusZ:140,speed:.18,orbitSpeed:.018,scale:4.2,phase:.5,dir:1},{cx:-20,cy:-50,cz:2450,radiusX:130,radiusZ:150,speed:.19,orbitSpeed:.019,scale:4,phase:2.5,dir:-1},{cx:20,cy:-55,cz:2430,radiusX:140,radiusZ:160,speed:.17,orbitSpeed:.017,scale:4.5,phase:4.5,dir:1}];ge.forEach(d=>{d.center={x:d.cx,y:d.cy,z:d.cz},d.yOffset=0,d.wanderAmp=15,d.vertAmp=5});let we=ge.length;F.computeBoundingSphere();let _e=new ut(F,ue,we),Ze=new Float32Array(we),Oe=new Float32Array(we);ge.forEach((d,le)=>{Ze[le]=d.phase,Oe[le]=d.speed;let fe=d.cx+Math.cos(d.phase)*d.radiusX,me=d.cz+Math.sin(d.phase)*d.radiusZ;w.position.set(fe,d.cy,me),w.rotation.set(0,d.phase+Math.PI/2,0),w.scale.setScalar(d.scale),w.updateMatrix(),_e.setMatrixAt(le,w.matrix)}),F.setAttribute("aPhase",new Ft(Ze,1)),F.setAttribute("aSpeed",new Ft(Oe,1)),_e.instanceMatrix.needsUpdate=!0,_e.frustumCulled=!1,_e.castShadow=!1,_e.receiveShadow=!1,this._mantaRayData=ge,this._mantaRayMesh=_e,this.world.scene.add(_e);let ot=this._buildDolphinMesh(),vt=new tt({color:4020334,roughness:.18,metalness:.08,envMapIntensity:1.4}),At=[{cx:30,cy:-12,cz:2260,radiusX:90,radiusZ:110,count:8},{cx:-75,cy:-18,cz:1950,radiusX:110,radiusZ:125,count:6},{cx:85,cy:-8,cz:1400,radiusX:95,radiusZ:105,count:6},{cx:10,cy:-55,cz:2450,radiusX:130,radiusZ:140,count:12},{cx:-30,cy:-85,cz:2550,radiusX:150,radiusZ:165,count:10}],pt=[],Tt=yt(882233);At.forEach(d=>{for(let le=0;le<d.count;le++){let fe=le/d.count*Math.PI*2+(Tt()-.5)*.4,me=(Tt()*.6+.4)*d.radiusX,Re=(Tt()*.6+.4)*d.radiusZ,Fe=(Tt()-.5)*6;pt.push({center:new B(d.cx,d.cy,d.cz),radiusX:me,radiusZ:Re,angle:fe,speed:.85+Tt()*.45,orbitSpeed:.09+Tt()*.08,dir:Tt()<.5?1:-1,wanderAmp:Tt()*10+5,yOffset:Fe,scale:1.6+Tt()*.4,phase:Tt()*Math.PI*2})}});let xt=pt.length;ot.computeBoundingSphere();let Pt=new ut(ot,vt,xt);pt.forEach((d,le)=>{let fe=d.center.x+Math.cos(d.angle)*d.radiusX,me=d.center.z+Math.sin(d.angle)*d.radiusZ,Re=d.center.y+d.yOffset;w.position.set(fe,Re,me),w.rotation.set(0,d.angle+Math.PI/2,0),w.scale.setScalar(d.scale),w.updateMatrix(),Pt.setMatrixAt(le,w.matrix)}),Pt.instanceMatrix.needsUpdate=!0,Pt.frustumCulled=!1,Pt.castShadow=!0,Pt.receiveShadow=!1,this._dolphinData=pt,this._dolphinMesh=Pt,this.world.scene.add(Pt);let St=this._buildSharkMesh(),Gt=new tt({color:2832450,roughness:.32,metalness:.06,envMapIntensity:1.2}),Nt=[{cx:-20,cy:-20,cz:2340,radiusX:110,radiusZ:130,count:6},{cx:70,cy:-34,cz:2440,radiusX:135,radiusZ:155,count:6},{cx:-70,cy:-16,cz:1650,radiusX:95,radiusZ:110,count:4},{cx:15,cy:-65,cz:2500,radiusX:150,radiusZ:170,count:8},{cx:-45,cy:-95,cz:2550,radiusX:160,radiusZ:185,count:8},{cx:50,cy:-125,cz:2600,radiusX:190,radiusZ:210,count:12}],zt=[],Dt=yt(993311);Nt.forEach(d=>{for(let le=0;le<d.count;le++){let fe=le/d.count*Math.PI*2+(Dt()-.5)*.5,me=(Dt()*.6+.4)*d.radiusX,Re=(Dt()*.6+.4)*d.radiusZ,Fe=(Dt()-.5)*4;zt.push({center:new B(d.cx,d.cy,d.cz),radiusX:me,radiusZ:Re,angle:fe,speed:.48+Dt()*.32,orbitSpeed:.055+Dt()*.045,dir:Dt()<.5?1:-1,wanderAmp:Dt()*12+6,yOffset:Fe,scale:1.7+Dt()*.5,phase:Dt()*Math.PI*2})}});let wo=zt.length;St.computeBoundingSphere();let Z=new ut(St,Gt,wo);zt.forEach((d,le)=>{let fe=d.center.x+Math.cos(d.angle)*d.radiusX,me=d.center.z+Math.sin(d.angle)*d.radiusZ,Re=d.center.y+d.yOffset;w.position.set(fe,Re,me),w.rotation.set(0,d.angle+Math.PI/2,0),w.scale.setScalar(d.scale),w.updateMatrix(),Z.setMatrixAt(le,w.matrix)}),Z.instanceMatrix.needsUpdate=!0,Z.frustumCulled=!1,Z.castShadow=!0,Z.receiveShadow=!1,this._sharkData=zt,this._sharkMesh=Z,this.world.scene.add(Z);let Ee=220,de=new gt,Xe=new Float32Array(Ee*3),et=new Float32Array(Ee*3),st=[...q,..._,...se];for(let d=0;d<Ee;d++){let le=st[d%st.length],fe=Math.random()*Math.PI*2,me=Math.random()*le.radiusX,Re=Math.random()*le.radiusZ;Xe[d*3]=le.cx+Math.cos(fe)*me,Xe[d*3+1]=le.cy-3.8+Math.random()*4.2,Xe[d*3+2]=le.cz+Math.sin(fe)*Re,et[d*3]=1.4+Math.random()*2.8,et[d*3+1]=.2+Math.random()*.45,et[d*3+2]=Math.random()*100}de.setAttribute("position",new ct(Xe,3)),de.setAttribute("aBubbleData",new ct(et,3)),de.computeBoundingSphere();let J=new Mt({uniforms:{uTime:{value:0}},vertexShader:`
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
      `,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,blending:Ht});this._bubbleMat=J;let Ge=new co(de,J);Ge.frustumCulled=!0,this.world.scene.add(Ge);let Ie=Yt(new Vt(1.6,1),.14,.45,88);Ko(Ie,175,.55);let We=pe.photogrammetryRock(1.5);We.vertexColors=!0;let $e=56,K=new ut(Ie,We,$e),re=new Lt,ze=yt(112233);for(let d=0;d<$e;d++){let fe=(d%2===0?1:-1)*(16+ze()*14),me=-505+(ze()-.5)*55,Re=ke(fe,me)+.45,Fe=.6+ze()*.7;re.position.set(fe,Re,me),re.rotation.set(ze()*.4,ze()*Math.PI*2,ze()*.4),re.scale.set(Fe*(.8+ze()*.5),Fe,Fe*(.8+ze()*.5)),re.updateMatrix(),K.setMatrixAt(d,re.matrix)}K.instanceMatrix.needsUpdate=!0,K.frustumCulled=!1,K.castShadow=!1,K.receiveShadow=!0,this.world.scene.add(K);let Me=(()=>{let d=[],le=new L(.35,.65,7.5,8,6);le.rotateZ(Math.PI/2);let fe=le.attributes.position;for(let Fe=0;Fe<fe.count;Fe++){let Qe=fe.getX(Fe);fe.setY(Fe,fe.getY(Fe)+Math.sin(Qe*.6)*.45),fe.setZ(Fe,fe.getZ(Fe)+Math.cos(Qe*.7)*.35)}le.computeVertexNormals(),d.push(le);let me=new L(.18,.32,3.2,6);me.rotateZ(.65),me.rotateY(.45),me.translate(2.2,.6,.4);let Re=new L(.15,.28,2.8,6);return Re.rotateZ(-.75),Re.rotateY(-.35),Re.translate(-2.4,.5,-.3),d.push(me,Re),qe(d,!1)||le})(),xe=pe.sunkenDriftwood?pe.sunkenDriftwood(2):pe.timber(1.5),he=20,Be=new ut(Me,xe,he),be=new Lt,Je=yt(441199);for(let d=0;d<he;d++){let le=400+Je()*75,fe=-275-Je()*65,me=6.3+Je()*.7,Re=.9+Je()*.6;be.position.set(le,me,fe),be.rotation.set((Je()-.5)*.15,Je()*Math.PI*2,(Je()-.5)*.15),be.scale.set(Re,Re,Re),be.updateMatrix(),Be.setMatrixAt(d,be.matrix)}Be.instanceMatrix.needsUpdate=!0,Be.frustumCulled=!1,this.world.scene.add(Be);let it=Yt(new Vt(.65,1),.12,.35,33),Et=pe.riverPebbles?pe.riverPebbles(1):pe.rockCliff(2),bt=130,Wt=new ut(it,Et,bt),fo=new Lt,Qt=yt(228844);for(let d=0;d<bt;d++){let le=d>=90,fe,me,Re;le?(fe=100+(Qt()-.5)*35,me=240+Qt()*80,Re=9.2+Qt()*.4):(fe=395+Qt()*80,me=-270-Qt()*70,Re=6.3+Qt()*.5);let Fe=.5+Qt()*1.1;fo.position.set(fe,Re,me),fo.rotation.set(Qt()*Math.PI,Qt()*Math.PI,Qt()*Math.PI),fo.scale.set(Fe*(.8+Qt()*.4),Fe*.5,Fe*(.8+Qt()*.4)),fo.updateMatrix(),Wt.setMatrixAt(d,fo.matrix)}Wt.instanceMatrix.needsUpdate=!0,Wt.frustumCulled=!1,this.world.scene.add(Wt);let go=(()=>{let d=[],le=new L(.04,.08,6.3,5,8);le.translate(0,3.15,0);let fe=le.attributes.position;for(let me=0;me<fe.count;me++){let Re=fe.getY(me);fe.setX(me,fe.getX(me)+Math.sin(Re*1.2)*.22),fe.setZ(me,fe.getZ(me)+Math.cos(Re*1.1)*.22)}le.computeVertexNormals(),d.push(le);for(let me=0;me<4;me++){let Re=me/4*Math.PI*2,Fe=new L(.02,.05,1.8,4);Fe.rotateZ(.75),Fe.rotateY(Re),Fe.translate(Math.cos(Re)*.4,.6,Math.sin(Re)*.4),d.push(Fe)}return qe(d,!1)||le})(),zo=new tt({color:2250802,emissive:535061,emissiveIntensity:.25,roughness:.75,metalness:.05}),po=90,oo=new ut(go,zo,po),eo=new Lt,lo=yt(551122);for(let d=0;d<po;d++){let le=_[d%_.length],fe=lo()*Math.PI*2,me=(.1+lo()*.85)*le.radiusX,Re=le.cx+Math.cos(fe)*me,Fe=le.cz+Math.sin(fe)*me;eo.position.set(Re,6.2,Fe),eo.rotation.set((lo()-.5)*.18,lo()*Math.PI*2,(lo()-.5)*.18),eo.scale.set(1,.85+lo()*.35,1),eo.updateMatrix(),oo.setMatrixAt(d,eo.matrix)}oo.instanceMatrix.needsUpdate=!0,oo.frustumCulled=!1,this.world.scene.add(oo);let io=360,Se=new gt,Ne=new Float32Array(io*3),Ve=new Float32Array(io*3),Ye=yt(773311);for(let d=0;d<io;d++){let le=Ye()*Math.PI*2,fe=20+Ye()*160;Ne[d*3]=420+Math.cos(le)*fe,Ne[d*3+1]=12.8+Ye()*18,Ne[d*3+2]=-290+Math.sin(le)*(fe*.85),Ve[d*3]=.4+Ye()*.8,Ve[d*3+1]=1.2+Ye()*2.2,Ve[d*3+2]=Ye()*100}Se.setAttribute("position",new ct(Ne,3)),Se.setAttribute("aMistData",new ct(Ve,3)),Se.computeBoundingSphere();let nt=new Mt({uniforms:{uTime:{value:0}},vertexShader:`
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
      `,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,blending:Ht});this._lakeMistShader=nt;let ft=new co(Se,nt);ft.frustumCulled=!1,this.world.scene.add(ft);let Ae=yt(994422),Xt=(()=>{let d=[],le=new L(.18,.28,1.8,6);le.translate(0,.9,0),d.push(le);let fe=new L(.12,.16,1.4,5);fe.rotateZ(.42),fe.translate(-.35,1.6,0);let me=new L(.1,.14,1.2,5);me.rotateZ(-.48),me.translate(.35,1.7,.1);let Re=new L(.08,.11,1,5);Re.rotateX(.45),Re.translate(0,1.9,-.3);let Fe=new L(.08,.11,.9,5);Fe.rotateX(-.4),Fe.translate(0,2,.3),d.push(fe,me,Re,Fe);let Qe=new lt(.08,.4,5);Qe.rotateZ(.42),Qe.translate(-.68,2.2,0);let Rt=new lt(.08,.4,5);return Rt.rotateZ(-.48),Rt.translate(.68,2.2,.1),d.push(Qe,Rt),qe(d,!1)||le})(),Zt=new tt({roughness:.65,metalness:.08,vertexColors:!0,side:wt});this._staghornMat=Zt;let to=432,qt=new ut(Xt,Zt,to),Ut=new Float32Array(to*3),Mo=[[1,.42,.28],[0,.9,1],[.88,.28,.92],[.98,.72,.15],[.22,.92,.65]];for(let d=0;d<to;d++){let le=d>=102,fe,me,Re;le?(fe=(Ae()-.5)*85,me=2210+Ae()*110,Re=-10.2+Ae()*4.4):(fe=(Ae()-.5)*320,me=990+Ae()*300,Re=-7.2+Ae()*4.2);let Fe=.9+Ae()*1.4;w.position.set(fe,Re,me),w.rotation.set((Ae()-.5)*.25,Ae()*Math.PI*2,(Ae()-.5)*.25),w.scale.set(Fe,Fe*(.9+Ae()*.4),Fe),w.updateMatrix(),qt.setMatrixAt(d,w.matrix);let Qe=Mo[Math.floor(Ae()*Mo.length)];Ut[d*3]=Qe[0],Ut[d*3+1]=Qe[1],Ut[d*3+2]=Qe[2]}Xt.setAttribute("color",new Ft(Ut,3)),qt.instanceMatrix.needsUpdate=!0,qt.frustumCulled=!1,this.world.scene.add(qt);let Ho=(()=>{let d=[],le=new L(.35,.55,1.4,6);le.translate(0,.7,0),d.push(le);let fe=new ce(1.8,.22,1.2);fe.rotateZ(.28),fe.rotateY(.35),fe.translate(-.6,1.6,.2);let me=new ce(1.6,.2,1.4);me.rotateZ(-.32),me.rotateY(-.4),me.translate(.6,1.7,-.2);let Re=new ce(1.4,.18,1.1);return Re.rotateX(.3),Re.translate(0,2,.4),d.push(fe,me,Re),qe(d,!1)||le})(),ko=new tt({roughness:.6,metalness:.08,vertexColors:!0,side:wt});this._elkhornMat=ko;let Jo=288,Io=new ut(Ho,ko,Jo),fs=new Float32Array(Jo*3);for(let d=0;d<Jo;d++){let le=d>=72,fe,me,Re;le?(fe=(Ae()-.5)*80,me=2215+Ae()*105,Re=-10.4+Ae()*4.5):(fe=(Ae()-.5)*300,me=1010+Ae()*290,Re=-7.5+Ae()*4);let Fe=1+Ae()*1.5;w.position.set(fe,Re,me),w.rotation.set((Ae()-.5)*.2,Ae()*Math.PI*2,(Ae()-.5)*.2),w.scale.set(Fe,Fe*.9,Fe),w.updateMatrix(),Io.setMatrixAt(d,w.matrix);let Qe=Mo[Math.floor(Ae()*Mo.length)];fs[d*3]=Qe[0],fs[d*3+1]=Qe[1],fs[d*3+2]=Qe[2]}Ho.setAttribute("color",new Ft(fs,3)),Io.instanceMatrix.needsUpdate=!0,Io.frustumCulled=!1,this.world.scene.add(Io);let rn=(()=>{let d=new at(2.4,32,24,0,Math.PI*2,0,Math.PI*.56);d.scale(1,.75,1);let le=d.attributes.position,fe=d.attributes.normal||d.computeVertexNormals()||d.attributes.normal,me=new B,Re=new B;for(let Fe=0;Fe<le.count;Fe++){me.set(le.getX(Fe),le.getY(Fe),le.getZ(Fe)),Re.set(fe.getX(Fe),fe.getY(Fe),fe.getZ(Fe));let Qe=Math.sin(me.x*5.5+Math.sin(me.z*4.5)*2.2),Rt=Math.cos(me.z*5.5+Math.cos(me.x*4.5)*2.2),Oo=Qe*Rt*.22;me.addScaledVector(Re,Oo),le.setXYZ(Fe,me.x,me.y,me.z)}return d.computeVertexNormals(),d})(),cn=new tt({color:16007006,emissive:14362487,emissiveIntensity:2.2,roughness:.65,metalness:.1,vertexColors:!0});this._coralMat=cn;let Ns=456,No=new ut(rn,cn,Ns),ps=new Float32Array(Ns*3),ln=[[.96,.25,.37],[.98,.57,.24],[.66,.33,.97],[.05,.84,.63],[.15,.75,.98]];for(let d=0;d<Ns;d++){let le=d>=114,fe,me,Re;le?(fe=(Ae()-.5)*80,me=2210+Ae()*110,Re=-10.2+Ae()*4.6):(fe=(Ae()-.5)*340,me=980+Ae()*320,Re=-6.8+Ae()*4.5);let Fe=.9+Ae()*1.5;w.position.set(fe,Re,me),w.rotation.set(Ae()*.5,Ae()*Math.PI*2,Ae()*.5),w.scale.set(Fe,Fe*.85,Fe),w.updateMatrix(),No.setMatrixAt(d,w.matrix);let Qe=ln[Math.floor(Ae()*ln.length)];ps[d*3]=Qe[0],ps[d*3+1]=Qe[1],ps[d*3+2]=Qe[2]}rn.setAttribute("color",new Ft(ps,3)),No.instanceMatrix.needsUpdate=!0,No.frustumCulled=!1,No.castShadow=!1,No.receiveShadow=!1,this.world.scene.add(No);let hn=(()=>{let d=[],le=new L(.45,.65,.6,8);le.translate(0,.3,0),d.push(le);let fe=14;for(let me=0;me<fe;me++){let Re=me/fe*Math.PI*2,Fe=new L(.03,.08,1.3,4);Fe.rotateZ(.35),Fe.rotateY(Re),Fe.translate(Math.cos(Re)*.4,.95,Math.sin(Re)*.4),d.push(Fe)}return qe(d,!1)||le})(),Ta={uniforms:{uTime:{value:0}},vertexShader:`
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
      `,transparent:!1,side:wt},dn=new Mt(Ta);this._anemoneMat=dn;let Vs=128,ms=new ut(hn,dn,Vs),Es=new Float32Array(Vs*3),un=[[1,.35,.55],[.25,.95,.82],[.78,.42,.98],[1,.65,.32]];for(let d=0;d<Vs;d++){let le=d>=32,fe,me,Re;le?(fe=(Ae()-.5)*75,me=2215+Ae()*100,Re=-10+Ae()*4.4):(fe=(Ae()-.5)*290,me=1e3+Ae()*280,Re=-7+Ae()*4);let Fe=.9+Ae()*1.3;w.position.set(fe,Re,me),w.rotation.set((Ae()-.5)*.2,Ae()*Math.PI*2,(Ae()-.5)*.2),w.scale.set(Fe,Fe,Fe),w.updateMatrix(),ms.setMatrixAt(d,w.matrix);let Qe=un[Math.floor(Ae()*un.length)];Es[d*3]=Qe[0],Es[d*3+1]=Qe[1],Es[d*3+2]=Qe[2]}hn.setAttribute("aColor",new Ft(Es,3)),ms.instanceMatrix.needsUpdate=!0,ms.frustumCulled=!1,this.world.scene.add(ms);let xa=(()=>{let d=[],le=new L(.06,.12,13,5,8);le.translate(0,6.5,0),d.push(le);for(let fe=0;fe<10;fe++){let me=2+fe*1.1,Re=new rt(.9,2.4,2,4),Fe=(fe%2===0?1:-1)*.65+fe*.8;Re.rotateZ(.45*(fe%2===0?1:-1)),Re.rotateY(Fe),Re.translate(Math.cos(Fe)*.3,me,Math.sin(Fe)*.3),d.push(Re)}return qe(d,!1)||le})(),Ra={uniforms:{uTime:{value:0}},vertexShader:`
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
      `,transparent:!1,side:wt},fn=new Mt(Ra);this._kelpMat=fn;let pn=152,ws=new ut(xa,fn,pn);for(let d=0;d<pn;d++){let le=d>=38,fe,me,Re;le?(fe=(Ae()-.5)*90,me=2210+Ae()*110,Re=-10.8):(fe=(Ae()-.5)*340,me=980+Ae()*320,Re=-8.2);let Fe=.85+Ae()*.5;w.position.set(fe,Re,me),w.rotation.set((Ae()-.5)*.15,Ae()*Math.PI*2,(Ae()-.5)*.15),w.scale.set(Fe,Fe*(.9+Ae()*.4),Fe),w.updateMatrix(),ws.setMatrixAt(d,w.matrix)}ws.instanceMatrix.needsUpdate=!0,ws.frustumCulled=!1,this.world.scene.add(ws);let ba=(()=>{let d=new L(.75,1.3,5,6);d.translate(0,2.5,0);let le=new lt(.75,1.8,6);return le.translate(0,5.9,0),qe([d,le],!1)||d})(),mn=new tt({color:440020,emissive:2282478,emissiveIntensity:2.6,roughness:.12,metalness:.25});this._reefCrystalMat=mn;let En=84,Vo=new ut(ba,mn,En);for(let d=0;d<En;d++){let le=d>=20,fe,me,Re;le?(fe=(Ae()-.5)*75,me=2220+Ae()*100,Re=-10.5+Ae()*4.8):(fe=(Ae()-.5)*260,me=1040+Ae()*240,Re=-8.5+Ae()*4);let Fe=1+Ae()*1.6;w.position.set(fe,Re,me),w.rotation.set((Ae()-.5)*.25,Ae()*Math.PI*2,(Ae()-.5)*.25),w.scale.set(Fe,Fe*(1+Ae()*.6),Fe),w.updateMatrix(),Vo.setMatrixAt(d,w.matrix)}Vo.instanceMatrix.needsUpdate=!0,Vo.frustumCulled=!1,Vo.castShadow=!1,Vo.receiveShadow=!1,this.world.scene.add(Vo);let Ha=(()=>{let d=new rt(2.4,2.8,4,4);return d.translate(0,1.4,0),d})(),_a=new tt({color:15485081,emissive:10295117,emissiveIntensity:.75,roughness:.6,side:wt}),wn=112,Wo=new ut(Ha,_a,wn);for(let d=0;d<wn;d++){let le=d>=28,fe,me,Re;le?(fe=(Ae()-.5)*80,me=2215+Ae()*105,Re=-9.8+Ae()*4.2):(fe=(Ae()-.5)*280,me=1010+Ae()*280,Re=-6.5+Ae()*4);let Fe=1+Ae()*1.2;w.position.set(fe,Re,me),w.rotation.set((Ae()-.5)*.35,Ae()*Math.PI*2,(Ae()-.5)*.35),w.scale.set(Fe,Fe,Fe),w.updateMatrix(),Wo.setMatrixAt(d,w.matrix)}Wo.instanceMatrix.needsUpdate=!0,Wo.frustumCulled=!1,Wo.castShadow=!1,Wo.receiveShadow=!1,this.world.scene.add(Wo);let Sa=(()=>{let d=[];for(let fe=0;fe<5;fe++){let me=fe/5*Math.PI*2,Re=new rt(.12,1.4,2,4),Fe=Re.attributes.position;for(let Qe=0;Qe<Fe.count;Qe++){let Rt=Fe.getY(Qe),Oo=Math.pow((Rt+.7)/1.4,1.8)*.35;Fe.setZ(Qe,Fe.getZ(Qe)+Oo)}Re.computeVertexNormals(),Re.rotateY(me),Re.translate(Math.cos(me)*.15,.7,Math.sin(me)*.15),d.push(Re)}return qe(d,!1)||d[0]})(),Ca=new tt({color:1332013,roughness:.65,side:wt}),gn=192,Uo=new ut(Sa,Ca,gn);for(let d=0;d<gn;d++){let le=d>=48,fe,me,Re;le?(fe=(Ae()-.5)*85,me=2210+Ae()*110,Re=-10.5+Ae()*4.6):(fe=(Ae()-.5)*320,me=990+Ae()*300,Re=-7.5+Ae()*4.2);let Fe=.6+Ae()*.6;w.position.set(fe,Re,me),w.rotation.set((Ae()-.5)*.2,Ae()*Math.PI*2,(Ae()-.5)*.2),w.scale.set(Fe,Fe*(.8+Ae()*.5),Fe),w.updateMatrix(),Uo.setMatrixAt(d,w.matrix)}Uo.instanceMatrix.needsUpdate=!0,Uo.frustumCulled=!1,Uo.castShadow=!1,Uo.receiveShadow=!1,this.world.scene.add(Uo);let _o=yt(112233),Pa=Yt(new Vt(3.5,2),.3,1,55),Ga=pe.massiveCoral?pe.massiveCoral():new tt({color:8926037,roughness:.8}),za=new ut(Pa,Ga,180),ka=Yt(new Vt(4,1),.2,.8,99),Ia=pe.seabedRock?pe.seabedRock():new tt({color:3359829,roughness:.9}),Aa=new ut(ka,Ia,220),Da=(()=>{let d=[],le=new L(.6,.8,1,8);le.translate(0,.5,0),d.push(le);for(let fe=0;fe<16;fe++){let me=fe/16*Math.PI*2,Re=new L(.05,.1,1.8,4);Re.rotateZ(.4),Re.rotateY(me),Re.translate(Math.cos(me)*.5,1.4,Math.sin(me)*.5),d.push(Re)}return qe(d,!1)||le})(),Ba=pe.anemone?pe.anemone():new tt({color:3407820,emissive:1149030}),La=new ut(Da,Ba,250),Fa=(()=>{let d=[];for(let le=0;le<3;le++){let fe=new L(.08,.2,3.5,5);fe.translate(0,1.75,0),fe.rotateX((_o()-.5)*.3),fe.rotateZ((_o()-.5)*.3),d.push(fe)}return qe(d,!1)||new L(.1,.2,3)})(),Na=pe.bioluminescentPlant?pe.bioluminescentPlant():new tt({color:65450,emissive:65450,emissiveIntensity:1.5}),Va=new ut(Fa,Na,300),gs=(d,le,fe)=>{for(let me=0;me<le;me++){let Re=(_o()-.5)*800,Fe=2120+_o()*600,Qe=ke(Re,Fe);if(Qe>-15)w.position.set(0,-9999,0),w.scale.set(0,0,0);else{let Rt=fe*(.7+_o()*.6);w.position.set(Re,Qe,Fe),w.rotation.set((_o()-.5)*.4,_o()*Math.PI*2,(_o()-.5)*.4),w.scale.set(Rt,Rt*(.8+_o()*.4),Rt)}w.updateMatrix(),d.setMatrixAt(me,w.matrix)}d.instanceMatrix.needsUpdate=!0,d.frustumCulled=!1,this.world.scene.add(d),console.log("[world3d] mesh added to scene",performance.now())};gs(za,180,1.5),gs(Aa,220,1.8),gs(La,250,1.2),gs(Va,300,1);let Wa={uniforms:{uTime:{value:0}},vertexShader:`
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
      `,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,blending:Ht,side:wt},vn=new Mt(Wa);this._causticsShader=vn,[{x:430,y:6.35,z:-280,sx:240,sz:240},{x:0,y:-10.8,z:2280,sx:320,sz:260},{x:0,y:-7.2,z:1120,sx:340,sz:280}].forEach(d=>{let le=new rt(d.sx,d.sz,8,8);le.rotateX(-Math.PI/2);let fe=new r(le,vn);fe.position.set(d.x,d.y,d.z),fe.frustumCulled=!1,this.world.scene.add(fe),console.log("[world3d] mesh added to scene",performance.now())});let Ws=520,vs=new gt,Ao=new Float32Array(Ws*3),ys=new Float32Array(Ws*3),To=yt(338811);for(let d=0;d<Ws;d++){if(To()>.35)Ao[d*3]=(To()-.5)*280,Ao[d*3+1]=-11+To()*11.2,Ao[d*3+2]=1e3+To()*1440;else{let fe=To()*Math.PI*2,me=To()*120;Ao[d*3]=430+Math.cos(fe)*me,Ao[d*3+1]=6.2+To()*6.2,Ao[d*3+2]=-280+Math.sin(fe)*(me*.9)}ys[d*3]=.3+To()*.6,ys[d*3+1]=.8+To()*1.4,ys[d*3+2]=To()*100}vs.setAttribute("position",new ct(Ao,3)),vs.setAttribute("aSnowData",new ct(ys,3)),vs.computeBoundingSphere();let yn=new Mt({uniforms:{uTime:{value:0}},vertexShader:`
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
      `,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,blending:Ht});this._marineSnowShader=yn;let Mn=new co(vs,yn);Mn.frustumCulled=!1,this.world.scene.add(Mn),console.log("[cathedral] successfully added to scene!")}_coastalCliff(){let e=new je,o=pe.rockCliff(3.5);o.side=wt;let s=pe.weatheredTravertine(2.2),n=pe.timber(1.5),t=pe.bronze(1),a=(Y,x,H)=>{let y=x-Y,q=new rt(y,64,H,20),M=q.attributes.position;for(let $=0;$<M.count;$++){let ee=(M.getX($)+y*.5)/y,X=(M.getY($)+32)/64,I=Y+ee*y,h=ke(I,915)+.3,g=.8,C=g+X*(h-g),w=jt(I*.045,C*.055,3)*6.5,i=Math.sin(X*Math.PI*4+jt(I*.02,0,2)*2)*3.5,_=918+(1-X)*38+Math.max(.5,w+i+2);M.setX($,I),M.setY($,C),M.setZ($,_)}q.computeVertexNormals();let V=new r(q,o);return V.castShadow=V.receiveShadow=!0,V};e.add(a(-240,-52,28)),e.add(a(52,260,28)),[-180,-145,-115,-85,85,115,145,185,235].forEach((Y,x)=>{let H=ke(Y,915)-.5,y=new Vt(8.5+x%3*3.2,1);y.scale(1.2,H/12,1.8);let q=y.attributes.position,M=y.attributes.normal||y.computeVertexNormals()||y.attributes.normal,V=new Float32Array(q.count*3),$=new B,ee=new B;for(let h=0;h<q.count;h++){$.set(q.getX(h),q.getY(h),q.getZ(h));let C=(jt((Y+$.x)*.08,$.y*.08,3)-.5)*.35,w=$.clone().normalize();$.addScaledVector(w,C),q.setXYZ(h,$.x,$.y,$.z),ee.set(M?.getX?.(h)||0,M?.getY?.(h)||1,M?.getZ?.(h)||0);let i=Math.max(0,$.y+H*.5),_=Math.min(1,i/1.8),W=.65+.35*Math.max(0,ee.y),ae=_*W;V[h*3]=ae,V[h*3+1]=ae,V[h*3+2]=ae}y.setAttribute("color",new ct(V,3)),y.computeVertexNormals();let X=o.clone();X.vertexColors=!0;let I=new r(y,X);I.position.set(Y,H*.5,932+x%2*6),I.rotation.set(.2,x*1.1,.1),I.castShadow=I.receiveShadow=!0,e.add(I)});let u=(Y,x,H,y,q=!1)=>{let M=new je,V=18,$=new L(y*.65,y*1.25,H,V,16),ee=$.attributes.position;for(let h=0;h<ee.count;h++){let g=ee.getY(h),C=ee.getX(h),w=ee.getZ(h),i=jt((Y+C)*.08,g*.08,3)*(y*.45);ee.setX(h,C+i),ee.setZ(h,w+i)}$.computeVertexNormals();let X=new r($,o);X.position.set(0,H*.5-2,0),X.castShadow=X.receiveShadow=!0,M.add(X);let I=new r(new bo(y*1.1,y*2.2,24),new Ct({color:16777215,transparent:!0,logarithmicDepthBuffer:!0,opacity:.65,side:wt}));return I.rotation.x=-Math.PI/2,I.position.y=(j.oceanLevel||.35)+.05,M.add(I),M.position.set(Y,0,x),M};e.add(u(-85,1150,26,9.5)),e.add(u(115,1210,34,13,!0)),e.add(u(195,1140,22,7.5));let f=(Y,x)=>{let H=new je,y=Math.max(2,Math.floor(Math.abs(x-Y)/3.4));for(let ee=0;ee<=y;ee++){let X=Y+ee/y*(x-Y),I=915,h=ke(X,I),g=new r(new L(.38,.45,2.2,8),s);g.position.set(X,h+1.1,I),g.castShadow=!0,H.add(g)}let q=(Y+x)*.5,M=(ke(Y,915)+ke(x,915))*.5+2.2,V=Math.abs(x-Y)+1,$=new r(new ce(V,.45,.75),s);return $.position.set(q,M,915),$.castShadow=!0,H.add($),H};e.add(f(-160,-52)),e.add(f(52,140));let c=(Y,x,H)=>{let y=new je,q=ke(Y,x),M=new r(new ce(4.2,.35,1.4),n);M.position.set(0,1.1,0),y.add(M);let V=new r(new ce(4.2,1.2,.25),n);V.position.set(0,1.8,-.6),y.add(V);let $=new r(new ce(.4,1.1,1.2),s);$.position.set(-1.7,.55,0);let ee=$.clone();return ee.position.set(1.7,.55,0),y.add($,ee),y.position.set(Y,q,x),y.rotation.y=H,y};e.add(c(-58,908,.25)),e.add(c(58,908,-.25));let m=new je,v=ke(-52,912),R=new r(new L(.4,.6,2.4,8),s);R.position.y=1.2;let b=new r(new L(.18,.24,1.6,8),t);b.rotation.x=Math.PI/2-.25,b.position.set(0,2.6,.2),m.add(R,b),m.position.set(-52,v,912),e.add(m),this.world.scene.add(e)}_oceanWaterfall(){let e=new je,o=165,s=918,n=7.8,t=.4,a=n-t,l={uniforms:{uTime:{value:0},uDeepColor:{value:new ye(537156)},uGlacierColor:{value:new ye(3717344)},uFoamColor:{value:new ye(16777215)},uSunDir:{value:new B(.4,.8,.5).normalize()},uSunColor:{value:new ye(16772829)}},vertexShader:`
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
      `,transparent:!0,logarithmicDepthBuffer:!0,side:wt,depthWrite:!1},u=new Mt(l);this._oceanWaterfallShader=u;let f=new It([new ht(o,n+.1,s),new ht(o+.8,n-1.2,s+8),new ht(o+1.8,n-a*.55,s+20),new ht(o+2.5,t+.3,s+36)]),c=new Jt(f,20,5.5,8,!1);c.scale(1.8,.3,1),c.computeBoundingSphere();let m=new r(c,u);m.castShadow=m.receiveShadow=!0,m.frustumCulled=!1,m.renderOrder=1,e.add(m);let v=[new ht(o,n-.4,s-1),new ht(o+.6,n-1.6,s+6),new ht(o+1.4,n-a*.58,s+18),new ht(o+2.2,t,s+34)],R=new It(v),b=new Jt(R,16,7,8,!1);b.scale(1.9,.4,1),b.computeBoundingSphere();let Y=pe.photogrammetryRock(3),x=new r(b,Y);x.frustumCulled=!1,e.add(x);let H=new $t(24,24);H.computeBoundingSphere();let y=new r(H,this.world._waterPoolMat);y.rotation.x=-Math.PI/2,y.position.set(o+2.5,t+.15,s+36),y.renderOrder=1,y.frustumCulled=!0,e.add(y);let q=new $t(6,16),M=new Ct({color:16777215,transparent:!0,logarithmicDepthBuffer:!0,opacity:.8,depthWrite:!1}),V=new r(q,M);V.rotation.x=-Math.PI/2,V.position.set(o+2.5,t+.16,s+36),V.renderOrder=2,e.add(V);let $=[new ht(o+2.5,t+.12,s+36),new ht(o+12,t*.7+.12,s+85),new ht(o+22,t*.4+.12,s+150),new ht(o+32,.35,s+220)],ee=new It($),X=new Jt(ee,16,5,6,!1);X.scale(1.8,.16,1),X.computeBoundingSphere();let I=new r(X,this.waterMat);I.frustumCulled=!1,e.add(I),this.world.scene.add(e)}_coveOceanSurf(){let e=new je,o=new rt(380,110,90,32);o.rotateX(-Math.PI/2),o.computeBoundingSphere(),o.computeBoundingBox();let s={uniforms:{uTime:{value:0},uDeepWater:{value:new ye(403517)},uCrestColor:{value:new ye(1618120)},uFoamColor:{value:new ye(16186367)},uWetSand:{value:new ye(1971469)},uSunDir:{value:new B(.4,.8,.5).normalize()},uSunColor:{value:new ye(16772829)}},vertexShader:`
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
      `,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,blending:Os,side:wt},n=new Mt(s);this._surfShader=n;let t=new r(o,n);t.position.set(35,1.2,1140),e.add(t),this._surfWaves=[t];let a=pe.timber(2),l=yt(884422);for(let v=0;v<16;v++){let R=(l()-.5)*240+35,b=980+l()*180;if(Math.abs(R)<48||xo(R,b)<14)continue;let Y=ke(R,b);if(Y<.4||Y>3)continue;let x=4+l()*6,H=.35+l()*.45,y=new r(new L(H*.7,H,x,8),a);y.position.set(R,Y+H*.8,b),y.rotation.set(.1,l()*Math.PI,1.57+(l()-.5)*.2),y.castShadow=y.receiveShadow=!0,e.add(y)}let u=new tt({color:13152890,roughness:.8,metalness:.05,side:wt,alphaTest:.5}),f=new rt(1.8,3.2);f.translate(0,1.6,0);for(let v=0;v<32;v++){let R=(l()-.5)*260+35,b=960+l()*140;if(Math.abs(R)<48||xo(R,b)<14)continue;let Y=ke(R,b);if(Y<1.2||Y>4.5)continue;let x=new r(f,u);x.position.set(R,Y,b),x.rotation.set(.15,l()*Math.PI*2,(l()-.5)*.2),x.scale.setScalar(.8+l()*.5),e.add(x)}let c=new tt({color:16511722,roughness:.25,metalness:.1}),m=new lt(.25,.45,6);m.scale(1.2,.6,1);for(let v=0;v<45;v++){let R=(l()-.5)*280+35,b=1010+l()*160,Y=ke(R,b);if(Y<.2||Y>2.2)continue;let x=new r(m,c);x.position.set(R,Y+.1,b),x.rotation.set((l()-.5)*.4,l()*Math.PI*2,(l()-.5)*.4),e.add(x)}this.world.scene.add(e)}_mountainWaterfall(){let e=new je,o={uniforms:{uTime:{value:0},uDeepColor:{value:new ye(663080)},uGlacierColor:{value:new ye(2258071)},uFoamColor:{value:new ye(16777215)},uSunDir:{value:new B(.5,.8,.3)}},vertexShader:`
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
      `,transparent:!0,logarithmicDepthBuffer:!0,side:wt,depthWrite:!1},s=new Mt(o);this._mountainWaterfallShader=s;let n=(T,P,te,se=140)=>{let oe=[],ne=[],k=[],O=new B(0,1,0);for(let ve=0;ve<=se;ve++){let De=ve/se,Ue=T.getPoint(De),Ke=T.getTangent(De).normalize(),N=new B().crossVectors(Ke,O).normalize();N.lengthSq()<.1&&(N=new B(1,0,0));let Te=(P*(1-De)+te*De)*.5,Ce=Ue.clone().addScaledVector(N,-Te),Pe=Ue.clone().addScaledVector(N,Te);if(oe.push(Ce.x,Ce.y,Ce.z,Pe.x,Pe.y,Pe.z),ne.push(0,De,1,De),ve>0){let D=ve*2;k.push(D-2,D-1,D,D-1,D+1,D)}}let ie=new gt;return ie.setAttribute("position",new mt(oe,3)),ie.setAttribute("uv",new mt(ne,2)),ie.setIndex(k),ie.computeVertexNormals(),ie},t=new rt(120,140,32,32);t.rotateX(-Math.PI/2);let a=this._createPhysicalWaterMaterial(this._waterNormals,"lake");a.side=wt,a.depthWrite=!1;let l=new r(t,a);l.position.set(0,182,-565),l.receiveShadow=!0,l.frustumCulled=!1,l.renderOrder=1,this._upperTarnMesh=l,e.add(l);let u=[new ht(0,182,-605),new ht(0,180.5,-595),new ht(0,178,-588),new ht(0,175,-585),new ht(0,120,-575),new ht(0,80,-565),new ht(0,40,-555),new ht(0,20,-550),new ht(0,14.5,-550)],f=new It(u),c=[new ht(0,180.5,-605),new ht(0,178.5,-595),new ht(0,175,-588),new ht(0,169,-585),new ht(0,133,-575),new ht(0,78,-565),new ht(0,36,-555),new ht(0,13,-550),new ht(0,14,-545)],m=new It(c),v=n(m,38,75,140);Yt(v,.12,.4,77),Ko(v,4.5);let R=pe.photogrammetryRock(4),b=new r(v,R);b.position.z-=1.2,b.receiveShadow=b.castShadow=!0,e.add(b);let Y=new r(n(f,20,48,140),s);Y.position.z+=.2,Y.renderOrder=1,e.add(Y);let x=u.map(T=>new ht(T.x,T.y-.3,T.z+1.8)),H=new It(x),y=new r(n(H,26,64,140),s);y.position.z+=.8,y.renderOrder=2,e.add(y);let q=new $t(56,48),M=new r(q,this.waterMat);M.rotation.x=-Math.PI/2,M.position.set(0,14.5,-550),M.receiveShadow=!0,M.frustumCulled=!1,M.renderOrder=1,e.add(M);let V=new rt(96,96),$=new Mt({uniforms:{uTime:{value:0}},vertexShader:`
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
      `,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,blending:Ht});this._poolShader=$;let ee=new r(V,$);ee.rotation.x=-Math.PI/2,ee.position.set(0,14.58,-550),ee.renderOrder=2,ee.frustumCulled=!1,e.add(ee);let X=document.createElement("canvas");X.width=X.height=128;let I=X.getContext("2d"),h=I.createRadialGradient(64,64,0,64,64,64);h.addColorStop(0,"rgba(255,255,255,0.8)"),h.addColorStop(.5,"rgba(255,255,255,0.2)"),h.addColorStop(1,"rgba(255,255,255,0)"),I.fillStyle=h,I.fillRect(0,0,128,128);let g=new Kt(X),C=new rt(60,45),w=new Ct({map:g,transparent:!0,logarithmicDepthBuffer:!0,blending:Ht,depthWrite:!1,opacity:.15,color:15660543});for(let T=0;T<4;T++){let P=new ns(w);P.scale.set(60,45,1),P.position.set((T%2===0?-1:1)*(18+Math.random()*15),14.5+Math.random()*10,-550+(Math.random()-.5)*15),P.rotation.y=(Math.random()-.5)*.2,e.add(P)}let i=s,_=n(f,12,32,140),S=_.attributes.uv;for(let T=0;T<S.count;T++)S.setY(T,S.getY(T)*2);let W=new r(_,i);W.position.z+=1.4,W.renderOrder=3,e.add(W);let ae=new $t(14,24),p=new Ct({color:16777215,transparent:!0,logarithmicDepthBuffer:!0,opacity:.8,depthWrite:!1}),E=new r(ae,p);E.rotation.x=-Math.PI/2,E.position.set(0,14.62,-548),E.renderOrder=2,e.add(E),this.world.scene.add(e)}_updateUnderwater(e,o){this._dummyObject||(this._dummyObject=new Lt,this._v3A=new B,this._v3B=new B,this._v3C=new B);let s=this._dummyObject,n=this._v3A,t=this._v3B,a=this._v3C,l=(f,c,m=[])=>{if(!f||!c)return;let v=f.length;for(let R=0;R<v;R++){let b=f[R];b.angle+=b.dir*b.orbitSpeed*e;let Y=Math.sin(o*.5+b.phase)*b.wanderAmp,x=Math.cos(o*.4+b.phase)*b.wanderAmp,H=Math.sin(o*.3+b.phase)*b.vertAmp,y=b.center.x+Math.cos(b.angle)*b.radiusX+Y,q=b.center.z+Math.sin(b.angle)*b.radiusZ+x,M=b.center.y+b.yOffset+H;n.set(y,M,q);for(let $=0;$<m.length;$++){let ee=m[$];if(ee)for(let X=0;X<ee.length;X++){let I=ee[X].worldX,h=ee[X].worldZ,g=ee[X].worldY;if(I===void 0)continue;let C=b.worldX-I,w=b.worldY-g,i=b.worldZ-h,_=C*C+w*w+i*i;if(_<900){let S=Math.sqrt(_)+.1;n.x+=C/S*15,n.y+=w/S*15,n.z+=i/S*15}}}if(v>1){let $=(R+7)%v,ee=f[$];if(ee.worldX!==void 0){let X=b.worldX-ee.worldX,I=b.worldY-ee.worldY,h=b.worldZ-ee.worldZ;X*X+I*I+h*h<16&&(n.x+=X*.5,n.y+=I*.5,n.z+=h*.5)}}b.worldX===void 0&&(b.worldX=y,b.worldY=M,b.worldZ=q);let V=b.speed*6*e;if(t.set(b.worldX,b.worldY,b.worldZ),a.copy(n).sub(t),a.lengthSq()>.01){a.normalize(),b.worldX+=a.x*V,b.worldY+=a.y*V*.5,b.worldZ+=a.z*V;let $=Math.atan2(a.x,a.z);b.yaw===void 0&&(b.yaw=$);let ee=$-b.yaw;for(;ee<-Math.PI;)ee+=Math.PI*2;for(;ee>Math.PI;)ee-=Math.PI*2;b.yaw+=ee*Math.min(1,e*3)}s.position.set(b.worldX,b.worldY,b.worldZ),s.rotation.set(0,b.yaw||0,0),s.scale.setScalar(b.scale),s.updateMatrix(),c.setMatrixAt(R,s.matrix)}c.instanceMatrix.needsUpdate=!0};l(this._sharkData,this._sharkMesh),l(this._dolphinData,this._dolphinMesh),l(this._seaTurtleData,this._seaTurtleMesh),l(this._mantaRayData,this._mantaRayMesh),this._mantaRayShader&&(this._mantaRayShader.uniforms.uTime.value=o);let u=[this._sharkData,this._dolphinData];l(this._troutData,this._troutMesh,u),l(this._koiData,this._koiMesh,u),l(this._reefFishData,this._reefFishMesh,u)}_underwaterWorld(){let e=new je;e.name="UnderwaterRealism";let o=4500,s=new gt,n=new Float32Array(o*3),t=new Float32Array(o);for(let k=0;k<o;k++)n[k*3]=(Math.random()-.5)*1200,n[k*3+1]=Math.random()*20-5,n[k*3+2]=(Math.random()-.5)*1800+400,t[k]=Math.random()*Math.PI*2;s.setAttribute("position",new ct(n,3)),s.setAttribute("aPhase",new ct(t,1));let a=new Mt({uniforms:{uTime:{value:0},uOpacity:{value:0}},vertexShader:`
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
      `,transparent:!0,blending:Ht,depthWrite:!1}),l=new co(s,a);l.frustumCulled=!1,e.add(l),this.world._bubbleMat=a;let u=15,f=new L(.5,8,40,16,1,!0);f.translate(0,-20,0);let c=new Mt({uniforms:{uTime:{value:0},uOpacity:{value:0}},vertexShader:`
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
      `,transparent:!0,blending:Ht,depthWrite:!1,side:wt}),m=new ut(f,c,u),v=new Lt;for(let k=0;k<u;k++)v.position.set((Math.random()-.5)*400,12.5,(Math.random()-.5)*400),v.rotation.set(Math.random()*.2-.1,Math.random()*Math.PI,Math.random()*.2-.1),v.scale.set(1+Math.random()*2,1,1+Math.random()*2),v.updateMatrix(),m.setMatrixAt(k,v.matrix);m.frustumCulled=!1,e.add(m),this.world._godRaysMat=c;let R=24,b=new L(1.6,2,3.2,8),Y=new Ot({color:15592420,roughness:.35,metalness:.05}),x=new ut(b,Y,R);x.castShadow=!0,x.receiveShadow=!0;let H=new ce(1.4,.25,1.4),y=new Ot({color:14659905,roughness:.2,metalness:.85,emissive:4007936,emissiveIntensity:.3}),q=new ut(H,y,R),M=typeof j<"u"&&j.lake?j.lake.x:380,V=typeof j<"u"&&j.lake?j.lake.z:-250,$=typeof j<"u"&&j.lake?j.lake.r:130;for(let k=0;k<R;k++){let O=k/R*Math.PI*2+k%2*.15,ie=25+k*37%Math.floor($*.65),ve=M+Math.cos(O)*ie,De=V+Math.sin(O)*ie,Ue=typeof ke=="function"?ke(ve,De):2;v.position.set(ve,Ue+1.6,De),v.rotation.set(0,O+Math.PI/4,0),v.scale.set(1,1,1),v.updateMatrix(),x.setMatrixAt(k,v.matrix),v.position.set(ve,Ue+3.25,De),v.scale.set(1,1,1),v.updateMatrix(),q.setMatrixAt(k,v.matrix)}x.instanceMatrix.needsUpdate=!0,q.instanceMatrix.needsUpdate=!0,e.add(x),e.add(q);let ee=36,X=new lt(1.2,7.5,6);X.translate(0,3.75,0);let I=new Ot({color:3597004,roughness:.15,metalness:.1,emissive:1745808,emissiveIntensity:.65,transparent:!0,opacity:.92}),h=new ut(X,I,ee);for(let k=0;k<ee;k++){let O,ie;if(k<12){let Ue=k/12*Math.PI*2,Ke=35+k*19%55;O=M+Math.cos(Ue)*Ke,ie=V+Math.sin(Ue)*Ke}else if(k<26){let Ue=(k-12)/14*Math.PI*2,Ke=60+k*23%110;O=20+Math.cos(Ue)*Ke,ie=2050+Math.sin(Ue)*Ke}else{let Ue=(k-26)/10*Math.PI,Ke=120+k*31%90;O=20+Math.cos(Ue)*Ke,ie=2320+Math.sin(Ue)*Ke}let ve=typeof ke=="function"?ke(O,ie):-10,De=.8+k*13%10*.08;v.position.set(O,ve-.2,ie),v.rotation.set(0,k*1.1%(Math.PI*2),(k%3-1)*.08),v.scale.set(De,De*1.2,De),v.updateMatrix(),h.setMatrixAt(k,v.matrix)}h.instanceMatrix.needsUpdate=!0,e.add(h);let g=48,C=new Vt(2.4,1);C.scale(1.2,.75,1.2);let w=new Ot({color:15229815,roughness:.6,emissive:4854043,emissiveIntensity:.35}),i=new ut(C,w,g),_=new Ot({color:4307112,roughness:.55,emissive:801589,emissiveIntensity:.35}),S=new ut(C,_,g);for(let k=0;k<g;k++){let O=k/g*Math.PI*2,ie=55+k*43%140,ve=20+Math.cos(O)*ie,De=2080+Math.sin(O)*ie,Ue=typeof ke=="function"?ke(ve,De):-8,Ke=.7+k%7*.18;v.position.set(ve,Ue+.5,De),v.rotation.set(k%4*.1,k*.8%(Math.PI*2),k%5*.1),v.scale.set(Ke,Ke,Ke),v.updateMatrix(),k%2===0?i.setMatrixAt(k,v.matrix):S.setMatrixAt(k,v.matrix)}i.instanceMatrix.needsUpdate=!0,S.instanceMatrix.needsUpdate=!0,e.add(i),e.add(S);let W=18,ae=new lt(3.5,32,7);ae.translate(0,16,0);let p=new Ot({color:660510,roughness:.85,emissive:15698,emissiveIntensity:.7}),E=new ut(ae,p,W);for(let k=0;k<W;k++){let O=k/W*Math.PI*1.6-.8,ie=160+k*29%180,ve=20+Math.cos(O)*ie,De=2360+Math.sin(O)*ie,Ue=typeof ke=="function"?ke(ve,De):-45,Ke=.9+k%5*.3;v.position.set(ve,Ue-2,De),v.rotation.set((k%3-1)*.08,k*.7,k%2*.05),v.scale.set(Ke,Ke*1.4,Ke),v.updateMatrix(),E.setMatrixAt(k,v.matrix)}E.instanceMatrix.needsUpdate=!0,e.add(E);let T=350,P=new gt,te=new Float32Array(T*3),se=new Float32Array(T);for(let k=0;k<T;k++)te[k*3]=(Math.random()-.5)*35,te[k*3+1]=Math.random()*18-8,te[k*3+2]=-360+(Math.random()-.5)*35,se[k]=Math.random()*Math.PI*2;P.setAttribute("position",new ct(te,3)),P.setAttribute("aPhase",new ct(se,1));let oe=new Ss({color:14088191,size:1.8,transparent:!0,opacity:.65,blending:Ht,depthWrite:!1}),ne=new co(P,oe);ne.frustumCulled=!1,e.add(ne),this.world.scene.add(e)}_trees(){return this._vegetation()}async _vegetation(){let e=yt(777),o={trunks:[],crowns:[],crownsColors:[],clutter:[]},s={trunks:[],crowns:[],crownsColors:[],stones:[]},n={trunks:[],crowns:[],crownsColors:[],stones:[]},t={trunks:[],crowns:[],crownsColors:[]},a={trunks:[],crowns:[],crownsColors:[]},l={trunks:[],crowns:[],crownsColors:[],stones:[]},u={trunks:[],crowns:[],crownsColors:[]},f=[],c=new Lt,m=(D,U)=>{let G=ke(D,U),A=Xo(D,U),z=Ms(D,U);if(A<45&&G<z+1.2||G<j.waterLevel+1||G>170||xo(D,U)<15||Math.hypot(D,U- -360)<68&&G<19||A<12||Math.abs(D)<36&&U<-240||U<=-450&&Math.abs(D)<180||Math.hypot(D-j.buddhistTemple.x,U-j.buddhistTemple.z)<120||Math.hypot(D-j.mosque.x,U-j.mosque.z)<110||U>1700||Math.abs(D)<22&&U<320||Math.hypot(D-j.plaza.x,U-j.plaza.z)<j.plaza.r+30||Math.hypot(D-j.gate.x,U-j.gate.z)<130||Math.abs(D)<52&&U>=760&&U<=1120||Math.hypot(D-j.bridge.x,U-j.bridge.z)<130)return null;for(let F of this.world.plots)if(Math.hypot(D-F.x,U-F.z)<16)return null;return G};for(let D=0;D<1200;D++){let U=(e()-.5)*2600,G=(e()-.5)*2400,A=m(U,G);if(A===null)continue;let z=.82+e()*.85,F=Math.hypot(U-j.lake.x,G-j.lake.z)-j.lake.r,Q=Xo(U,G),ue=xo(U,G),ge=U<-220&&G>180&&A<70;if(c.position.set(U,A-.35*z,G),c.rotation.set(0,e()*Math.PI*2,0),ge){e()<.3&&(c.scale.setScalar(z),c.updateMatrix(),f.push(c.matrix.clone()));continue}if(ue>8&&ue<28&&e()<.34){c.scale.setScalar(z*1.15),c.updateMatrix(),u.trunks.push(c.matrix.clone()),u.crowns.push(c.matrix.clone()),u.crownsColors.push(new ye().setHSL(0,0,.75+e()*.45));continue}if((Q<28||F>4&&F<35)&&e()<.42){c.scale.setScalar(z*.95),c.updateMatrix(),l.trunks.push(c.matrix.clone()),l.crowns.push(c.matrix.clone()),l.crownsColors.push(new ye().setHSL(0,0,.75+e()*.45)),e()<.65&&l.stones.push(c.matrix.clone());continue}if(A>24&&A<75&&Math.hypot(U,G)<580&&e()<.14){c.scale.setScalar(z*1.1),c.updateMatrix(),t.trunks.push(c.matrix.clone()),t.crowns.push(c.matrix.clone()),t.crownsColors.push(new ye().setHSL(0,0,.75+e()*.45));continue}if(F>-5&&F<40&&U>j.lake.x-60){e()<.35&&(c.scale.setScalar(z),c.updateMatrix(),a.trunks.push(c.matrix.clone()),a.crowns.push(c.matrix.clone()),a.crownsColors.push(new ye().setHSL(0,0,.75+e()*.45)));continue}let _e=jt(U*.0045,G*.0045,3)>.38,Ze=G<-340&&Math.abs(U)<420||A>75,Oe=Ze?_e?.82:.15:_e?.58:.1;if(e()<Oe){let ot=Math.max(.65,1-Math.max(0,A-80)/180);c.scale.setScalar(z*ot),c.updateMatrix(),Ze?(o.trunks.push(c.matrix.clone()),o.crowns.push(c.matrix.clone()),o.crownsColors.push(new ye().setHSL(0,0,.75+e()*.45)),e()<.75&&o.clutter.push(c.matrix.clone())):e()<.32?(n.trunks.push(c.matrix.clone()),n.crowns.push(c.matrix.clone()),n.crownsColors.push(new ye().setHSL(0,0,.75+e()*.45)),e()<.6&&n.stones.push(c.matrix.clone())):(s.trunks.push(c.matrix.clone()),s.crowns.push(c.matrix.clone()),s.crownsColors.push(new ye().setHSL(0,0,.75+e()*.45)),e()<.6&&s.stones.push(c.matrix.clone()))}}let v=[],R=[],b=[],Y=[],x=yt(110293);for(let D=0;D<1800;D++){let U=(x()-.5)*3200,G=(x()-.5)*3e3,A=ke(U,G);if(A<32||A>240||Math.abs(U)<55&&G<-200||Math.hypot(U,G)<320||Math.hypot(U-j.buddhistTemple.x,G-j.buddhistTemple.z)<120||Math.hypot(U-j.mosque.x,G-j.mosque.z)<110||G<=-450&&Math.abs(U)<180||Math.abs(U)<52&&G>=760&&G<=1120||jt(U*.0035,G*.0035,3)<.28)continue;let F=ke(U+2,G)-ke(U-2,G),Q=ke(U,G+2)-ke(U,G-2),ue=-Math.atan2(Q,4)*.05,ge=Math.atan2(F,4)*.05,we=Math.max(.7,1-Math.max(0,A-110)/220),_e=(1.35+x()*1.65)*we;c.position.set(U,A-1.5,G),c.rotation.set(ue+(x()-.5)*.12,x()*Math.PI*2,ge+(x()-.5)*.12),c.scale.setScalar(_e),c.updateMatrix(),A>65||G<-180||x()<.72?(v.push(c.matrix.clone()),R.push(new ye().setHSL(0,0,.75+x()*.45))):(b.push(c.matrix.clone()),Y.push(new ye().setHSL(0,0,.75+x()*.45)))}let H=(D,U,G,A=0,z=!0,F=null)=>{if(!G.length)return;let Q=new ut(D,U,G.length),ue=new _t,ge=new _t().makeTranslation(0,A,0);G.forEach((we,_e)=>{ue.copy(we).multiply(ge),Q.setMatrixAt(_e,ue),F&&F[_e]&&Q.setColorAt(_e,F[_e])}),Q.instanceMatrix.needsUpdate=!0,F&&F.length>0&&(Q.instanceColor.needsUpdate=!0),Q.geometry.computeBoundingSphere(),typeof Q.computeBoundingSphere=="function"&&Q.computeBoundingSphere(),Q.castShadow=z,Q.receiveShadow=!0,Q.frustumCulled=!0,this.world.scene.add(Q)},y=pe.bark(1.6),q=pe.bark(2),M=pe.bark(1.5),V=(D,U,G=.45)=>{let A=new rt(D,U,2,2),z=A.attributes.position;for(let ge=0;ge<z.count;ge++){let we=z.getX(ge),_e=z.getY(ge),Ze=we/(D*.5),Oe=_e/(U*.5),ot=(1-Ze*Ze)*G*(1-Oe*.35)+(1-Oe*Oe)*G*.25;z.setZ(ge,ot)}A.computeVertexNormals();let F=A.clone();F.rotateY(Math.PI/2);let Q=A.clone();return Q.rotateY(Math.PI/4),Q.rotateX(.2),qe([A,F,Q],!1)||A},$=(()=>{let D=[],U=new L(1.3,2.6,2.4,16),G=U.attributes.position;for(let F=0;F<G.count;F++){let Q=G.getX(F),ue=G.getY(F),ge=G.getZ(F),we=(ue+1.2)/2.4,_e=Math.atan2(ge,Q),Ze=Math.hypot(Q,ge),Oe=Math.cos(_e*6)*Math.pow(1-we,1.6)*.85;G.setX(F,Math.cos(_e)*(Ze+Oe)),G.setY(F,ue+1.2),G.setZ(F,Math.sin(_e)*(Ze+Oe))}U.computeVertexNormals(),D.push(U);for(let F=0;F<6;F++){let Q=F/6*Math.PI*2+.15,ue=new L(.25,.55,3.2,6);ue.rotateZ(.78),ue.rotateY(Q),ue.translate(Math.cos(Q)*1.8,.4,Math.sin(Q)*1.8),D.push(ue)}let A=new L(.95,1.3,4.6,10);A.rotateZ(.12),A.translate(.28,4.4,.15),D.push(A);let z=new L(.72,.95,4.2,8);z.rotateZ(-.16),z.translate(.1,7.8,-.2),D.push(z);for(let F=0;F<5;F++){let Q=F/5*Math.PI*2+.25,ue=new L(.32,.58,5.8,6);ue.rotateZ(.68),ue.rotateY(Q),ue.translate(Math.cos(Q)*3,9.6,Math.sin(Q)*3),D.push(ue);let ge=new L(.14,.3,4,5);ge.rotateZ(.92),ge.rotateY(Q+.35),ge.translate(Math.cos(Q+.35)*4.6,12,Math.sin(Q+.35)*4.6),D.push(ge)}return Yt(qe(D,!1)||U,.14,.22,31)})(),ee=(()=>{let D=[],U=yt(202611),G=[[0,15.2,0,6.2,12],[4.2,12.4,2,5.2,8],[-4.2,12.4,-2,5.2,8],[2,12.6,4.2,5.2,8],[-2,12.6,-4.2,5.2,8],[3.2,14,-2.8,4.8,7],[-3.2,14,2.8,4.8,7],[3.8,9.2,-2.5,4.6,6],[-3.8,9.2,2.5,4.6,6],[2.5,8.8,3.8,4.6,6],[-2.5,8.8,-3.8,4.6,6],[0,11.6,0,5,8],[1.8,16.2,1.2,4.2,6],[-1.8,16.2,-1.2,4.2,6]];for(let[z,F,Q,ue,ge]of G)for(let we=0;we<ge;we++){let _e=Math.acos(1-2*U()),Ze=U()*Math.PI*2,Oe=ue*(.25+U()*.75),ot=z+Math.sin(_e)*Math.cos(Ze)*Oe,vt=F+Math.cos(_e)*(Oe*.82),At=Q+Math.sin(_e)*Math.sin(Ze)*Oe,pt=5.6+U()*1.8,Tt=5+U()*1.6,xt=V(pt,Tt,.55);xt.rotateX((U()-.5)*Math.PI*.85),xt.rotateY(U()*Math.PI*2),xt.rotateZ((U()-.5)*.65),xt.translate(ot,vt,At),D.push(xt)}let A=qe(D,!1)||D[0];if(A&&A.attributes.position&&A.attributes.normal){let z=A.attributes.position,F=A.attributes.normal;for(let Q=0;Q<z.count;Q++){let ue=z.getX(Q),ge=z.getY(Q)-13,we=z.getZ(Q),_e=Math.hypot(ue,ge*.75,we)||1,Ze=ue/_e*.82+F.getX(Q)*.18,Oe=ge/_e*.82+F.getY(Q)*.18,ot=we/_e*.82+F.getZ(Q)*.18,vt=Math.hypot(Ze,Oe,ot)||1;F.setXYZ(Q,Ze/vt,Oe/vt,ot/vt)}F.needsUpdate=!0}return A})(),X=(()=>{let D=[],U=new L(1.1,2.2,2,12);U.translate(0,1,0),D.push(U);for(let A=0;A<5;A++){let z=A/5*Math.PI*2,F=new L(.18,.45,2.8,6);F.rotateZ(.72),F.rotateY(z),F.translate(Math.cos(z)*1.6,.35,Math.sin(z)*1.6),D.push(F)}let G=new L(.18,1.1,23,8);G.translate(0,12.5,0),D.push(G);for(let A=0;A<7;A++){let z=A/6,F=4+z*17.5,Q=3.6*(1-z*.55);for(let ue=0;ue<4;ue++){let ge=ue/4*Math.PI*2+A*.45,we=new L(.08,.18,Q,5);we.rotateZ(.65),we.rotateY(ge),we.translate(Math.cos(ge)*(Q*.4),F,Math.sin(ge)*(Q*.4)),D.push(we)}}return Yt(qe(D,!1)||U,.12,.18,52)})(),I=(()=>{let D=[],U=yt(811);for(let A=0;A<9;A++){let z=A/8,F=3.5+z*18.5,Q=5.2*(1-z*.85),ue=6+Math.floor((1-z)*5);for(let ge=0;ge<ue;ge++){let we=ge/ue*Math.PI*2+A*.6,_e=-.15-(1-z)*.35,Ze=V(3.8,5.2,.42);Ze.rotateX(_e),Ze.rotateZ((U()-.5)*.2),Ze.rotateY(we),Ze.translate(Math.cos(we)*Q*.4,F,Math.sin(we)*Q*.4),D.push(Ze);let Oe=V(2.8,3.8,.45);Oe.rotateX(_e-.2),Oe.rotateY(we+.15),Oe.translate(Math.cos(we)*Q*.6,F-.4,Math.sin(we)*Q*.6),D.push(Oe)}}for(let A=0;A<4;A++){let z=V(2.5,4,.4);z.rotateX(.15),z.rotateY(A/4*Math.PI*2),z.translate(0,22.5,0),D.push(z)}let G=qe(D,!1)||D[0];if(G&&G.attributes.position&&G.attributes.normal){let A=G.attributes.position,z=G.attributes.normal;for(let F=0;F<A.count;F++){let Q=A.getX(F),ue=A.getY(F)-10,ge=A.getZ(F),we=Math.hypot(Q,ue,ge)||1,_e=Q/we*.75+z.getX(F)*.25,Ze=ue/we*.75+z.getY(F)*.25,Oe=ge/we*.75+z.getZ(F)*.25,ot=Math.hypot(_e,Ze,Oe)||1;z.setXYZ(F,_e/ot,Ze/ot,Oe/ot)}z.needsUpdate=!0}return G})(),h=(()=>{let D=[],U=new L(1.1,2,2,10);U.translate(0,1,0),D.push(U);for(let z=0;z<4;z++){let F=z/4*Math.PI*2+.3,Q=new L(.22,.48,2.6,6);Q.rotateZ(.72),Q.rotateY(F),Q.translate(Math.cos(F)*1.5,.35,Math.sin(F)*1.5),D.push(Q)}let G=new L(.78,1.1,4.6,8);G.rotateZ(.18),G.translate(.35,3.2,0),D.push(G);let A=new L(.52,.78,5,8);A.rotateZ(.34),A.translate(1.1,6.8,.2),D.push(A);for(let z=0;z<4;z++){let F=z/4*Math.PI*2+.35,Q=new L(.22,.46,5.2,6);Q.rotateZ(.78),Q.rotateY(F),Q.translate(Math.cos(F)*2.8+1.1,9.2,Math.sin(F)*2.8+.2),D.push(Q)}return Yt(qe(D,!1)||U,.15,.25,87)})(),g=(()=>{let D=[];for(let Q=0;Q<28;Q++){let ue=Q/28*Math.PI*2,ge=3+Q%2*1,we=9.2+Q%3*1.6,_e=V(3.6,we,.38);_e.rotateY(ue+Math.PI*.5),_e.translate(Math.cos(ue)*ge+.8,6.2,Math.sin(ue)*ge+.1),D.push(_e)}let G=36;for(let Q=0;Q<G;Q++){let ue=Q/G*Math.PI*2+.12,ge=5.6+Q%3*1.5,we=11.2+Q%4*1.8,_e=V(3.8,we,.42);_e.rotateX(.14),_e.rotateY(ue+Math.PI*.5),_e.translate(Math.cos(ue)*ge+.8,5.6,Math.sin(ue)*ge+.1),D.push(_e)}let A=48;for(let Q=0;Q<A;Q++){let ue=Q/A*Math.PI*2+.22,ge=7.8+Q%3*1.6,we=12.8+Q%4*2,_e=V(4,we,.46);_e.rotateX(.22),_e.rotateY(ue+Math.PI*.5),_e.translate(Math.cos(ue)*ge+.8,5,Math.sin(ue)*ge+.1),D.push(_e)}let z=24;for(let Q=0;Q<z;Q++){let ue=Q/z*Math.PI*2,ge=V(5.6,5.6,.58);ge.rotateX(.44),ge.rotateY(ue),ge.translate(Math.cos(ue)*4.2+.8,10.8,Math.sin(ue)*4.2+.1),D.push(ge)}let F=qe(D,!1)||D[0];if(F&&F.attributes.position&&F.attributes.normal){let Q=F.attributes.position,ue=F.attributes.normal;for(let ge=0;ge<Q.count;ge++){let we=Q.getX(ge)-.8,_e=Q.getY(ge)-7,Ze=Q.getZ(ge)-.1,Oe=Math.hypot(we,Ze)||1,ot=we/Oe*.82+ue.getX(ge)*.18,vt=_e/(Math.hypot(we,_e,Ze)||1)*.5+ue.getY(ge)*.18,At=Ze/Oe*.82+ue.getZ(ge)*.18,pt=Math.hypot(ot,vt,At)||1;ue.setXYZ(ge,ot/pt,vt/pt,At/pt)}ue.needsUpdate=!0}return F})(),C=(()=>{let D=[],U=new L(.75,1.35,2.2,10);U.translate(0,1.1,0),D.push(U);let G=8;for(let A=0;A<G;A++){let z=A/G,F=.75*(1-z*.38),Q=.75*(1-(A+1)/G*.38),ue=new L(Q,F,1.45,8),ge=Math.sin(z*Math.PI*.75)*.85,we=Math.cos(z*Math.PI*.65)*.55;ue.translate(ge,2.2+A*1.4+.72,we),D.push(ue)}return qe(D,!1)||U})(),w=(()=>{let D=[];for(let U=0;U<10;U++){let G=U/10*Math.PI*2+.1,A=2.2,z=-.5,F=V(2.6,4.8,.42);F.rotateX(z),F.rotateY(G),F.translate(Math.cos(G)*A,2.6,Math.sin(G)*A),D.push(F)}for(let U=0;U<16;U++){let G=U/16*Math.PI*2;for(let A=0;A<2;A++){let z=A/2,F=1.8+z*5.2,Q=.22+z*1.18,ue=V(3.2*(1-z*.28),4.6,.5);ue.rotateX(Q),ue.rotateY(G),ue.translate(Math.cos(G)*F,1.6-Math.sin(Q)*2.8,Math.sin(G)*F),D.push(ue)}}for(let U=0;U<12;U++){let G=U/12*Math.PI*2+.25;for(let A=0;A<2;A++){let z=A/2,F=2.4+z*4.6,Q=.72+z*.85,ue=V(2.8*(1-z*.25),4.4,.52);ue.rotateX(Q),ue.rotateY(G),ue.translate(Math.cos(G)*F,-.6-Math.sin(Q)*2.4,Math.sin(G)*F),D.push(ue)}}for(let U=0;U<8;U++){let G=U/8*Math.PI*2+.4,A=2.8,z=1.35,F=V(2.4,3.8,.45);F.rotateX(z),F.rotateY(G),F.translate(Math.cos(G)*A,-2.4,Math.sin(G)*A),D.push(F)}return qe(D,!1)||D[0]})(),i=(()=>{let D=[],U=new L(.55,1.1,1.8,8);U.translate(0,.9,0),D.push(U);let G=new L(.28,.55,5.5,8);return G.translate(0,4.25,0),D.push(G),qe(D,!1)||U})(),_=(()=>{let D=[];for(let z=0;z<56;z++){let F=z/55,Q=1.4+F*16.5,ue=z*2.39996,we=.65*Math.sin(Math.pow(F,.45)*Math.PI)+.18,_e=1.45*(1-F*.3),Ze=2.4*(1-F*.3),Oe=V(_e,Ze,.28);Oe.rotateX(.18+(1-F)*.2),Oe.rotateY(ue),Oe.translate(Math.cos(ue)*we,Q,Math.sin(ue)*we),D.push(Oe)}let A=qe(D,!1)||D[0];if(A&&A.attributes.position&&A.attributes.normal){let z=A.attributes.position,F=A.attributes.normal;for(let Q=0;Q<z.count;Q++){let ue=z.getX(Q),ge=z.getZ(Q),we=Math.hypot(ue,ge)||1,_e=ue/we*.85+F.getX(Q)*.15,Ze=.15+F.getY(Q)*.15,Oe=ge/we*.85+F.getZ(Q)*.15,ot=Math.hypot(_e,Ze,Oe)||1;F.setXYZ(Q,_e/ot,Ze/ot,Oe/ot)}F.needsUpdate=!0}return A})(),S=(()=>{let D=[],U=new L(.75,1.45,1.8,8);U.translate(0,.9,0),D.push(U);for(let A=0;A<4;A++){let z=A/4*Math.PI*2+.2,F=new L(.2,.42,2.4,6);F.rotateZ(.7),F.rotateY(z),F.translate(Math.cos(z)*1.3,.4,Math.sin(z)*1.3),D.push(F)}let G=new L(.55,.75,3.8,8);G.rotateZ(.12),G.translate(.15,3.4,0),D.push(G);for(let A=0;A<5;A++){let z=A/5*Math.PI*2+.35,F=new L(.16,.38,5,6);F.rotateZ(.74),F.rotateY(z),F.translate(Math.cos(z)*2.5,6,Math.sin(z)*2.5),D.push(F)}return Yt(qe(D,!1)||U,.16,.22,103)})(),W=(()=>{let D=[],U=yt(7821),G=[[0,10.2,0,5.2,14],[3.6,8.2,2,4.6,10],[-3.6,8.2,-2,4.6,10],[2,8.4,3.6,4.6,10],[-2,8.4,-3.6,4.6,10],[2.8,9.8,-2.6,4.2,8],[-2.8,9.8,2.6,4.2,8],[1.8,11.2,1.4,3.8,6],[-1.8,11.2,-1.4,3.8,6]];for(let[z,F,Q,ue,ge]of G)for(let we=0;we<ge;we++){let _e=Math.acos(1-2*U()),Ze=U()*Math.PI*2,Oe=ue*(.28+U()*.72),ot=z+Math.sin(_e)*Math.cos(Ze)*Oe,vt=F+Math.cos(_e)*(Oe*.78),At=Q+Math.sin(_e)*Math.sin(Ze)*Oe,pt=4.8+U()*1.6,Tt=4.6+U()*1.5,xt=V(pt,Tt,.44);xt.rotateX((U()-.5)*Math.PI*.85),xt.rotateY(U()*Math.PI*2),xt.rotateZ((U()-.5)*.6),xt.translate(ot,vt,At),D.push(xt)}let A=qe(D,!1)||D[0];if(A&&A.attributes.position&&A.attributes.normal){let z=A.attributes.position,F=A.attributes.normal;for(let Q=0;Q<z.count;Q++){let ue=z.getX(Q),ge=z.getY(Q)-9,we=z.getZ(Q),_e=Math.hypot(ue,ge*.85,we)||1,Ze=ue/_e*.82+F.getX(Q)*.18,Oe=ge/_e*.82+F.getY(Q)*.18,ot=we/_e*.82+F.getZ(Q)*.18,vt=Math.hypot(Ze,Oe,ot)||1;F.setXYZ(Q,Ze/vt,Oe/vt,ot/vt)}F.needsUpdate=!0}return A})(),ae=(()=>{let D=new $t(5.2,8);return D.rotateX(-Math.PI/2),D})(),p=(()=>{let D=new Vt(1.1,1);D.translate(0,.55,0);let U=new Vt(.7,1);return U.translate(1.2,.35,.6),Yt(qe([D,U],!1)||D,.12,.32,91)})(),E=pe.pineNeedles(2641700);E.alphaTest=.5,E.depthWrite=!0;let T=yo("leafCard"),P=Go(4750642,T.map,{isTree:!0,normalMap:T.normalMap,normalScale:.65,roughness:.72,sssColor:new ye(8575029),shadowColor:new ye(1721364),sssIntensity:.88,windIntensity:1.1}),te=Go(14194730,T.map,{isTree:!0,normalMap:T.normalMap,normalScale:.65,roughness:.7,sssColor:new ye(16763458),shadowColor:new ye(3809800),sssIntensity:.92,windIntensity:1.1}),se=pe.sakuraBlossom(16777215),oe=Go(5936182,T.map,{isTree:!0,normalMap:T.normalMap,normalScale:.55,roughness:.72,sssColor:new ye(8575029),shadowColor:new ye(1721364),sssIntensity:.9,windIntensity:1.35}),ne=pe.palmFrond(16777215),k=yo("cypressFoliage"),O=Go(2380838,k.map,{isTree:!0,normalMap:k.normalMap,normalScale:1.3,roughness:.76,sssColor:new ye(6473768),shadowColor:new ye(1456658),sssIntensity:.7,windIntensity:.95}),ie=pe.fallenPineNeedles(2.5),ve=pe.mossyStone(1);this.world._windMaterials&&this.world._windMaterials.push(E,P,te,se,oe,ne,O),H(X,y,o.trunks,0,!0),H(I,E,o.crowns,0,!1,o.crownsColors),H(ae,ie,o.clutter,.06,!1),H($,y,s.trunks,0,!0),H(ee,P,s.crowns,0,!1,s.crownsColors),H(p,ve,s.stones,0,!0),H($,y,n.trunks,0,!0),H(ee,te,n.crowns,0,!1,n.crownsColors),H(p,ve,n.stones,0,!0),H(S,M,t.trunks,0,!0),H(W,se,t.crowns,0,!1,t.crownsColors),H(X,y,v,0,!0),H(I,E,v,0,!1,R),H($,y,b,0,!0),H(ee,P,b,0,!1,Y),H(i,y,u.trunks,0,!0),H(_,O,u.crowns,0,!1,u.crownsColors),H(h,y,l.trunks,0,!0),H(g,oe,l.crowns,0,!1,l.crownsColors),H(p,ve,l.stones,0,!0),H(C,q,a.trunks,0,!0),H(w,ne,a.crowns,13.5,!1,a.crownsColors);let De=new L(.9,1.6,20,4);De.translate(0,10,0),De.rotateY(Math.PI/4);let Ue=new lt(1.27,3.2,4);Ue.translate(0,21.6,0),Ue.rotateY(Math.PI/4);let Ke=pe.limestoneDark(2),N=pe.gold(1),Te=[[-280,ke(-280,260),260,.05],[310,ke(310,140),140,-.08],[-190,ke(-190,-180),-180,.12],[180,ke(180,720),720,0],[-80,ke(-80,980),980,-.06]],Ce=new je;Te.forEach(([D,U,G,A])=>{let z=new r(De,Ke);z.position.set(D,U,G),z.rotation.y=A,z.castShadow=z.receiveShadow=!0,Ce.add(z);let F=new r(Ue,N);F.position.set(D,U,G),F.rotation.y=A,F.castShadow=!0,Ce.add(F)}),this.world.scene.add(Ce);let Pe=(()=>{let D=[],U=new L(.72,.85,9.2,16),G=U.attributes.position;for(let _e=0;_e<G.count;_e++){let Ze=G.getX(_e),Oe=G.getY(_e),ot=G.getZ(_e),vt=Math.atan2(ot,Ze),At=Math.hypot(Ze,ot),pt=Math.cos(vt*16)*.06;G.setX(_e,Math.cos(vt)*(At+pt)),G.setY(_e,Oe+4.6),G.setZ(_e,Math.sin(vt)*(At+pt))}U.computeVertexNormals(),D.push(U);let A=new at(.72,16,8,0,Math.PI*2,0,Math.PI/2);A.translate(0,9.2,0),D.push(A);let z=new L(.38,.42,1.8,8);z.rotateZ(Math.PI/2),z.translate(1.2,4.8,0),D.push(z);let F=new L(.36,.38,3.8,8);F.translate(2.1,6.7,0),D.push(F);let Q=new at(.36,8,6,0,Math.PI*2,0,Math.PI/2);Q.translate(2.1,8.6,0),D.push(Q);let ue=new L(.35,.4,1.6,8);ue.rotateZ(-Math.PI/2),ue.rotateY(.4),ue.translate(-1.1*Math.cos(.4),3.6,-1.1*Math.sin(.4)),D.push(ue);let ge=new L(.34,.35,3.2,8);ge.translate(-1.9*Math.cos(.4),5.2,-1.9*Math.sin(.4)),D.push(ge);let we=new at(.34,8,6,0,Math.PI*2,0,Math.PI/2);return we.translate(-1.9*Math.cos(.4),6.8,-1.9*Math.sin(.4)),D.push(we),Yt(qe(D,!1)||U,.12,.15,66)})();H(Pe,pe.foliage(1.2,4880960),f,0,!0)}async _meadowCarpet(){let e=performance.now(),o=()=>performance.now()-e>16?(e=performance.now(),new Promise(I=>setTimeout(I,0))):Promise.resolve(),s=yt(20260405),n=[],t=[],a=[],l=[],u=[],f=[],c=new Lt,m=typeof window<"u"&&window.innerWidth<=768,v=m?1e4:35e3,R=m?3e3:1e4;for(let I=0;I<v;I++){I%2e3===0&&await o();let h=s()*1300-420,g=(s()-.5)*620,C=ke(g,h);if(C<j.waterLevel+.3||C>145||xo(g,h)<.6||Math.hypot(g-j.plaza.x,h-j.plaza.z)<j.plaza.r+6||Math.hypot(g-j.bridge.x,h-j.bridge.z)<80)continue;let i=.85+s()*.65;c.position.set(g,C,h),c.rotation.set(0,s()*Math.PI*2,0),c.scale.setScalar(i),c.updateMatrix(),n.push(c.matrix.clone())}for(let I=0;I<R;I++){I%2e3===0&&await o();let h=s()*1300-420,g=(s()-.5)*620,C=ke(g,h);if(C<j.waterLevel+.3||C>145||xo(g,h)<.8||Math.hypot(g-j.plaza.x,h-j.plaza.z)<j.plaza.r+8||Math.hypot(g-j.bridge.x,h-j.bridge.z)<80)continue;let i=.85+s()*.55;c.position.set(g,C,h),c.rotation.set(0,s()*Math.PI*2,0),c.scale.setScalar(i),c.updateMatrix();let _=s();_<.28?t.push(c.matrix.clone()):_<.52?a.push(c.matrix.clone()):_<.74?l.push(c.matrix.clone()):_<.9?u.push(c.matrix.clone()):(c.scale.setScalar(.35+s()*.4),c.updateMatrix(),f.push(c.matrix.clone()))}let b=(I,h,g,C=!1)=>{if(!g.length)return;I.computeBoundingSphere&&I.computeBoundingSphere();let w=new ut(I,h,g.length);g.forEach((i,_)=>w.setMatrixAt(_,i)),w.instanceMatrix.needsUpdate=!0,typeof w.computeBoundingSphere=="function"&&w.computeBoundingSphere(),typeof w.computeBoundingBox=="function"&&w.computeBoundingBox(),w.castShadow=C,w.receiveShadow=!1,w.frustumCulled=!1,this.world.scene.add(w)},Y=(()=>{let I=[],h=yt(842);for(let g=0;g<10;g++){let C=.03+h()*.04,w=.4+h()*.7,i=new rt(C,w,1,3),_=i.attributes.position,S=h()*Math.PI*2,W=.15+h()*.35,ae=h()*.25,p=Math.cos(h()*Math.PI*2)*ae,E=Math.sin(h()*Math.PI*2)*ae;for(let T=0;T<_.count;T++){let P=_.getX(T),te=_.getY(T)+w*.5,se=Math.max(0,te/w);P*=1-Math.pow(se,1.5);let oe=Math.pow(se,2)*W,ne=P*Math.cos(S)-oe*Math.sin(S),k=P*Math.sin(S)+oe*Math.cos(S);_.setXYZ(T,ne+p,te,k+E)}i.computeVertexNormals(),I.push(i)}return qe(I,!1)||I[0]})(),x=(()=>{let I=[];for(let h=0;h<3;h++){let g=h/3*Math.PI,C=new rt(1.15,1.25);C.translate(0,.625,0),C.rotateY(g),I.push(C)}return qe(I,!1)||I[0]})(),H=(()=>{let I=[];for(let h=0;h<3;h++){let g=h/3*Math.PI,C=new rt(.9,1.45);C.translate(0,.725,0),C.rotateY(g),I.push(C)}return qe(I,!1)||I[0]})(),y=(()=>{let I=new Vt(.65,1);return I.translate(0,.32,0),Yt(I,.2,.25,47)})(),q=Go(5674558,null,{isTree:!1,roughness:.92,sssColor:9232453,sssIntensity:.75,windIntensity:.8});q.depthWrite=!0,q.transparent=!1;let M=pe.goldenPoppy();M.alphaTest=.5,M.depthWrite=!0,M.transparent=!1;let V=pe.edelweiss();V.alphaTest=.5,V.depthWrite=!0,V.transparent=!1;let $=pe.lavenderSprig();$.alphaTest=.5,$.depthWrite=!0,$.transparent=!1;let ee=pe.forgetMeNot();ee.alphaTest=.5,ee.depthWrite=!0,ee.transparent=!1;let X=pe.mossyStone(1);this.world._windMaterials&&this.world._windMaterials.push(q,M,V,$,ee),b(Y,q,n,!1),b(x,M,t,!1),b(x,V,a,!1),b(H,$,l,!1),b(x,ee,u,!1),b(y,X,f,!0)}async _districtFeatures(){let e=performance.now(),o=()=>performance.now()-e>16?(e=performance.now(),new Promise(p=>setTimeout(p,0))):Promise.resolve(),s=yt(88442),n=new Lt,t=(p,E,T=14)=>{let P=ke(p,E);if(P<j.waterLevel+1||P>170||xo(p,E)<T||Math.hypot(p-j.plaza.x,E-j.plaza.z)<j.plaza.r+26||Math.hypot(p-j.bridge.x,E-j.bridge.z)<140||Math.hypot(p-j.gate.x,E-j.gate.z)<120||Math.abs(p)<52&&E>=760&&E<=1120)return null;for(let te of this.world.plots)if(Math.hypot(p-te.x,E-te.z)<14)return null;return P},a=[],l=[],u=[];for(let p=0;p<180;p++){let E=s()*Math.PI*2,T=j.lake.r+8+s()*48,P=j.lake.x+Math.cos(E)*T,te=j.lake.z+Math.sin(E)*T,se=t(P,te,16);if(se===null||s()>.15)continue;let oe=.8+s()*.5;n.position.set(P,se-1.5,te),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(oe),n.updateMatrix(),a.push(n.matrix.clone()),l.push(n.matrix.clone()),u.push(n.matrix.clone())}let f=[],c=[];for(let p=0;p<250;p++){p%50===0&&await o();let E=500+s()*300,T=-200+s()*400,P=Math.hypot(E-j.lake.x,T-j.lake.z)-j.lake.r;if(P<2||P>80)continue;let te=t(E,T,10);te!==null&&(n.position.set(E,te,T),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(.6+s()*.6),n.updateMatrix(),s()<.85?f.push(n.matrix.clone()):c.push(n.matrix.clone()))}let m=[],v=[];for(let p=0;p<300;p++){p%50===0&&await o();let E=-200+s()*400,T=-650+s()*320,P=t(E,T,8);P!==null&&(n.position.set(E,P,T),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(.5+s()*.6),n.updateMatrix(),s()<.8?m.push(n.matrix.clone()):v.push(n.matrix.clone()))}let R=[],b=[];for(let p=0;p<200;p++){let E=-650+s()*350,T=200+s()*350,P=t(E,T,10);P===null||P>70||(n.position.set(E,P,T),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(.5+s()*.7),n.updateMatrix(),s()<.7?R.push(n.matrix.clone()):b.push(n.matrix.clone()))}let Y=[],x=[];for(let p=0;p<160;p++){let E=-700+s()*350,T=-600+s()*400,P=t(E,T,12);P===null||P<45||(n.position.set(E,P,T),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(.6+s()*.5),n.updateMatrix(),s()<.35?Y.push(n.matrix.clone()):x.push(n.matrix.clone()))}let H=[],y=[];for(let p=0;p<200;p++){let E=-300+s()*600,T=240+s()*450,P=t(E,T,12);P===null||P>60||(n.position.set(E,P,T),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(.7+s()*.5),n.updateMatrix(),s()<.4?H.push(n.matrix.clone()):y.push(n.matrix.clone()))}let q=(p,E,T,P=0)=>{if(!T.length)return;p.computeBoundingSphere&&p.computeBoundingSphere();let te=new ut(p,E,T.length),se=new _t,oe=new _t().makeTranslation(0,P,0);T.forEach((ne,k)=>{se.copy(ne).multiply(oe),te.setMatrixAt(k,se)}),te.instanceMatrix.needsUpdate=!0,typeof te.computeBoundingSphere=="function"&&te.computeBoundingSphere(),typeof te.computeBoundingBox=="function"&&te.computeBoundingBox(),te.castShadow=!0,te.frustumCulled=!1,this.world.scene.add(te)},M=(p,E,T,P,te)=>{if(!T.length)return;p.computeBoundingSphere&&p.computeBoundingSphere();let se=new ut(p,E,T.length),oe=new _t,ne=new _t().makeTranslation(0,P,0),k=new ye;T.forEach((O,ie)=>{oe.copy(O).multiply(ne),se.setMatrixAt(ie,oe),se.setColorAt(ie,k.setHex(te(ie)))}),se.instanceMatrix.needsUpdate=!0,se.instanceColor&&(se.instanceColor.needsUpdate=!0),typeof se.computeBoundingSphere=="function"&&se.computeBoundingSphere(),typeof se.computeBoundingBox=="function"&&se.computeBoundingBox(),se.castShadow=!0,se.frustumCulled=!1,this.world.scene.add(se)},V=pe.bark(1.5),$=(()=>{let p=[],E=new L(1.1,2,2,10);E.translate(0,1,0),p.push(E);for(let te=0;te<4;te++){let se=te/4*Math.PI*2+.3,oe=new L(.22,.48,2.6,6);oe.rotateZ(.72),oe.rotateY(se),oe.translate(Math.cos(se)*1.5,.35,Math.sin(se)*1.5),p.push(oe)}let T=new L(.78,1.1,4.6,8);T.rotateZ(.18),T.translate(.35,3.2,0),p.push(T);let P=new L(.52,.78,5,8);P.rotateZ(.34),P.translate(1.1,6.8,.2),p.push(P);for(let te=0;te<4;te++){let se=te/4*Math.PI*2+.35,oe=new L(.22,.46,5.2,6);oe.rotateZ(.78),oe.rotateY(se),oe.translate(Math.cos(se)*2.8+1.1,9.2,Math.sin(se)*2.8+.2),p.push(oe)}return Yt(qe(p,!1)||E,.15,.25,87)})();q($,V,a,0);let ee=(p,E,T=.4)=>{let P=new rt(p,E,2,2),te=P.attributes.position;for(let se=0;se<te.count;se++){let oe=te.getX(se),ne=te.getY(se),k=oe/(p*.5),O=ne/(E*.5);te.setZ(se,(1-k*k)*T*(1-O*.25))}return P.computeVertexNormals(),P},X=(()=>{let p=[];for(let oe=0;oe<28;oe++){let ne=oe/28*Math.PI*2,k=3+oe%2*1,O=9.2+oe%3*1.6,ie=ee(3.6,O,.38);ie.rotateY(ne+Math.PI*.5),ie.translate(Math.cos(ne)*k+.8,6.2,Math.sin(ne)*k+.1),p.push(ie)}let T=36;for(let oe=0;oe<T;oe++){let ne=oe/T*Math.PI*2+.12,k=5.6+oe%3*1.5,O=11.2+oe%4*1.8,ie=ee(3.8,O,.42);ie.rotateX(.14),ie.rotateY(ne+Math.PI*.5),ie.translate(Math.cos(ne)*k+.8,5.6,Math.sin(ne)*k+.1),p.push(ie)}let P=48;for(let oe=0;oe<P;oe++){let ne=oe/P*Math.PI*2+.22,k=7.8+oe%3*1.6,O=12.8+oe%4*2,ie=ee(4,O,.46);ie.rotateX(.22),ie.rotateY(ne+Math.PI*.5),ie.translate(Math.cos(ne)*k+.8,5,Math.sin(ne)*k+.1),p.push(ie)}let te=24;for(let oe=0;oe<te;oe++){let ne=oe/te*Math.PI*2,k=ee(5.6,5.6,.58);k.rotateX(.44),k.rotateY(ne),k.translate(Math.cos(ne)*4.2+.8,10.8,Math.sin(ne)*4.2+.1),p.push(k)}let se=qe(p,!1)||p[0];if(se&&se.attributes.position&&se.attributes.normal){let oe=se.attributes.position,ne=se.attributes.normal;for(let k=0;k<oe.count;k++){let O=oe.getX(k)-.8,ie=oe.getY(k)-7,ve=oe.getZ(k)-.1,De=Math.hypot(O,ve)||1,Ue=O/De*.82+ne.getX(k)*.18,Ke=ie/(Math.hypot(O,ie,ve)||1)*.5+ne.getY(k)*.18,N=ve/De*.82+ne.getZ(k)*.18,Te=Math.hypot(Ue,Ke,N)||1;ne.setXYZ(k,Ue/Te,Ke/Te,N/Te)}ne.needsUpdate=!0}return se})(),I=pe.leafCard(5936182);this.world._windMaterials&&this.world._windMaterials.push(I),q(X,I,l,0);let h=(()=>{let p=[];for(let E=0;E<6;E++){let T=E/6*Math.PI*2,P=new rt(.35,1.8);P.rotateX(.25),P.rotateY(T),P.translate(Math.cos(T)*.3,.9,Math.sin(T)*.3),p.push(P)}return qe(p,!1)||p[0]})();q(h,pe.grassTuft(),f,0);let g=pe.bark(1);q(new Jn(.35,3.8,6,10),g,c,.25);let C=(()=>{let p=[];for(let E=0;E<7;E++){let T=E/7*Math.PI*2,P=new rt(.65,1.9);P.rotateX(.55),P.rotateY(T),P.translate(Math.cos(T)*.6,.65,Math.sin(T)*.6),p.push(P)}return qe(p,!1)||p[0]})();q(C,pe.leafCard(3697470),m,0);let w=(()=>{let p=new L(.08,.12,.6,6);p.translate(0,.3,0);let E=new at(.24,8,6);return E.scale(1.2,.45,1.2),E.translate(0,.6,0),qe([p,E],!1)||E})();q(w,new tt({color:14602942,roughness:.92,metalness:0}),v,0);let i=(()=>{let p=[];for(let T=0;T<12;T++){let P=T/12*Math.PI*2,te=new rt(.45,1.8);te.rotateX(.65),te.rotateY(P),te.translate(Math.cos(P)*.5,.6,Math.sin(P)*.5),p.push(te)}let E=new L(.06,.12,3.2,6);return E.translate(0,1.6,0),p.push(E),qe(p,!1)||p[0]})();q(i,pe.foliage(1.2,7243874),R,0);let _=(()=>{let p=[];for(let E=0;E<3;E++){let T=1.2-E*.28,P=new Vt(T,1);P.translate((E-1)*.4,T*.7,(E%2-.5)*.3),p.push(P)}return qe(p,!1)||p[0]})();q(_,pe.rockCliff(2.5),Y,0);let S=(()=>{let p=[];for(let E=0;E<10;E++){let T=E/10*Math.PI*2,P=new rt(1.4,1.4);P.rotateX(.4),P.rotateY(T),P.translate(Math.cos(T)*.9,.7,Math.sin(T)*.9),p.push(P)}return qe(p,!1)||p[0]})();q(S,pe.leafCard(4746050),x,0);let W=(()=>{let p=[];for(let E=0;E<14;E++){let T=(E-7)*.35,P=new rt(1.6,2.2);P.rotateY(E*.8),P.translate(T,1.1,0),p.push(P)}return qe(p,!1)||p[0]})();q(W,pe.leafCard(4091448),H,0);let ae=(()=>{let p=[];for(let E=0;E<12;E++){let T=E/12*Math.PI*2,P=new rt(1.1,1.4);P.rotateX(.35),P.rotateY(T),P.translate(Math.cos(T)*.7,.8,Math.sin(T)*.7),p.push(P)}return qe(p,!1)||p[0]})();q(ae,pe.wildflowers(),y,0)}async _sanctuaryTree(){let e=performance.now(),o=()=>performance.now()-e>16?(e=performance.now(),new Promise(C=>setTimeout(C,0))):Promise.resolve(),s=0,n=-140,t=ke(s,n),a=new je;a.position.set(s,t,n);let l=pe.bark(1.2),u=pe.bark(1.5),f=yo("leafCard"),c=Go(9759312,f.map,{isTree:!0,normalMap:f.normalMap,normalScale:.65,roughness:.72,sssColor:new ye(10813272),shadowColor:new ye(1721364),sssIntensity:.92,windIntensity:1.15});this.world._windMaterials&&this.world._windMaterials.push(c);let m=new bo(.1,18,32),v=document.createElement("canvas");v.width=v.height=128;let R=v.getContext("2d"),b=R.createRadialGradient(64,64,10,64,64,64);b.addColorStop(0,"rgba(0, 0, 0, 0.75)"),b.addColorStop(.5,"rgba(0, 0, 0, 0.40)"),b.addColorStop(1,"rgba(0, 0, 0, 0)"),R.fillStyle=b,R.fillRect(0,0,128,128);let Y=new Kt(v),x=new r(m,new Ct({map:Y,transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1}));x.rotation.x=-Math.PI/2,x.position.y=.08,a.add(x);let H=24,y=20,q=new L(2.4,6.4,13.5,H,y),M=q.attributes.position;for(let C=0;C<M.count;C++){let w=M.getX(C),i=M.getY(C),_=M.getZ(C),S=(i+6.75)/13.5,W=Math.atan2(_,w),ae=Math.hypot(w,_),p=Math.cos(W*6)*Math.pow(1-S,1.8)*2.4,E=ae+p;M.setX(C,Math.cos(W)*E),M.setY(C,i+6.75),M.setZ(C,Math.sin(W)*E)}q.computeVertexNormals();let V=new r(q,l);V.castShadow=!0,V.receiveShadow=!0,a.add(V);for(let C=0;C<8;C++){let w=C/8*Math.PI*2+C%2*.25,i=[],_=new L(1,1.4,4.5,8);_.rotateZ(.42),_.rotateY(w),_.translate(Math.cos(w)*2.8,14.5,Math.sin(w)*2.8),i.push(_);let S=new L(.55,1,4.8,8);S.rotateZ(.65),S.rotateY(w+.15),S.translate(Math.cos(w+.15)*5.8,17.5,Math.sin(w+.15)*5.8),i.push(S);let W=new L(.18,.55,4.5,6);W.rotateZ(.82),W.rotateY(w+.28),W.translate(Math.cos(w+.28)*8.8,19.8,Math.sin(w+.28)*8.8),i.push(W);let ae=qe(i,!1)||_,p=new r(ae,u);p.castShadow=!0,a.add(p)}let $=(C,w,i=.45)=>{let _=new rt(C,w,2,2),S=_.attributes.position;for(let W=0;W<S.count;W++){let ae=S.getX(W),p=S.getY(W),E=ae/(C*.5),T=p/(w*.5);S.setZ(W,(1-E*E)*i*(1-T*.35)+(1-T*T)*i*.25)}return _.computeVertexNormals(),_},ee=[],X=yt(8888);for(let C=0;C<340;C++){let w=Math.acos(1-2*X()),i=X()*Math.PI*2,_=2.5+X()*16.5,S=Math.sin(w)*Math.cos(i)*_,W=21+Math.cos(w)*(_*.82),ae=Math.sin(w)*Math.sin(i)*_,p=3.8+X()*2,E=$(p,p*.95,.52);E.rotateX((X()-.5)*Math.PI*.85),E.rotateY(X()*Math.PI*2),E.rotateZ((X()-.5)*.65),E.translate(S,W,ae),ee.push(E)}let I=qe(ee,!1)||ee[0];if(I&&I.attributes.position&&I.attributes.normal){let C=I.attributes.position,w=I.attributes.normal;for(let i=0;i<C.count;i++){let _=C.getX(i),S=C.getY(i)-21,W=C.getZ(i),ae=Math.hypot(_,S,W)||1,p=_/ae*.85+w.getX(i)*.15,E=S/ae*.85+w.getY(i)*.15,T=W/ae*.85+w.getZ(i)*.15,P=Math.hypot(p,E,T)||1;w.setXYZ(i,p/P,E/P,T/P)}w.needsUpdate=!0}let h=new r(I,c);h.castShadow=!1,h.receiveShadow=!0,a.add(h);let g=new tt({color:4008984,emissive:16101441,emissiveIntensity:2.2,roughness:.25,metalness:.8});for(let C=0;C<16;C++){let w=C/16*Math.PI*2+.12,i=6.5+C%4*2.8,_=13.5-C%3*1.6,S=new Vt(.75,0),W=new r(S,g);W.position.set(Math.cos(w)*i,_,Math.sin(w)*i),a.add(W)}this.world.scene.add(a)}_celestialMotes(){let o=new Float32Array(720),s=new Float32Array(720),n=new Float32Array(240),t=yt(777123),a=new ye;for(let u=0;u<240;u++){let f=(t()-.5)*1500,c=(t()-.5)*1500,m=Math.max(ke(f,c),j.waterLevel)+2.5+t()*16;o[u*3]=f,o[u*3+1]=m,o[u*3+2]=c,a.setHSL(.11+t()*.1,.85,.78+t()*.22),s[u*3]=a.r,s[u*3+1]=a.g,s[u*3+2]=a.b,n[u]=(.25+t()*.45)*12}let l=new gt;l.setAttribute("position",new ct(o,3)),l.setAttribute("color",new ct(s,3)),l.setAttribute("size",new ct(n,1)),l.computeBoundingSphere(),this.moteMat=new Mt({transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,fog:!1,blending:Ht,uniforms:{uTex:{value:this.world.lighting._starSprite()},uTime:{value:0},uOpacity:{value:0}},vertexShader:`
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
      `,vertexColors:!0}),this.motes=new co(l,this.moteMat),this.world.scene.add(this.motes)}_kayaIsland(){let e=new je,o=20,s=2100,n=pe.honedCarraraMarble(1.5),t=pe.celestialGold(1),a=pe.verdigrisBronze(1),l=pe.flagstone(2.4),u=pe.crystalColumn(),f=pe.starlightCrystal(),c=pe.bark(2.2),m=ke(o,s),v=new je;v.position.set(o,m+.1,s);let R=new r(new L(20,22,1.2,48),n);R.position.y=.6,R.receiveShadow=R.castShadow=!0,v.add(R);let b=new r(new L(18,19.5,1.2,48),n);b.position.y=1.8,b.receiveShadow=b.castShadow=!0,v.add(b);for(let Se=0;Se<8;Se++){let Ne=new r(new ce(.42,.08,15),t);Ne.position.y=2.45,Ne.rotation.y=Se*Math.PI/8,v.add(Ne)}let Y=new r(new L(3.6,3.6,.1,24),t);Y.position.y=2.46,v.add(Y);let x=new L(5.8,6.4,1.6,24),H=new r(x,t);H.position.y=3.2,H.castShadow=H.receiveShadow=!0,v.add(H);let y=8;for(let Se=0;Se<y;Se++){let Ne=Se/y*Math.PI*2+Math.PI/8,Ve=Math.cos(Ne)*14.2,Ye=Math.sin(Ne)*14.2,nt=new r(new ce(2.4,.8,2.4),t);nt.position.set(Ve,2.8,Ye),v.add(nt);let ft=new r(new dt(1.2,.22,12,24),t);ft.rotation.x=Math.PI/2,ft.position.set(Ve,3.2,Ye),v.add(ft);let Ae=new r(new L(.72,.88,10.5,20),u);Ae.position.set(Ve,8.5,Ye),Ae.castShadow=!0,v.add(Ae);let Bt=new je;Bt.position.set(Ve,13.8,Ye);let Xt=new r(new L(1.3,.8,1.8,16),t);Xt.position.y=.9,Bt.add(Xt);for(let to=0;to<8;to++){let qt=to/8*Math.PI*2,Ut=new r(new lt(.3,1.2,4),t);Ut.rotation.z=-Math.cos(qt)*.3,Ut.rotation.x=Math.sin(qt)*.3,Ut.position.set(Math.cos(qt)*1,.6,Math.sin(qt)*1),Bt.add(Ut)}let Zt=new r(new ce(2.8,.5,2.8),n);if(Zt.position.y=1.9,Bt.add(Zt),v.add(Bt),Se!==3){let to=(Se+1)/y*Math.PI*2+Math.PI/8,qt=(Ne+to)/2,Ut=Math.cos(qt)*14.2,Mo=Math.sin(qt)*14.2,Fo=new r(new ce(4.8,.55,1),n);Fo.position.set(Ut,5.2,Mo),Fo.rotation.y=-qt+Math.PI/2,v.add(Fo);for(let Ho=-1;Ho<=1;Ho++){let ko=Ut+Math.cos(qt+Math.PI/2)*(Ho*1.1),Jo=Mo+Math.sin(qt+Math.PI/2)*(Ho*1.1),Io=new r(new L(.22,.28,1.8,8),u);Io.position.set(ko,3.8,Jo),v.add(Io)}}}let q=new r(new dt(14.2,.95,16,48),n);q.rotation.x=Math.PI/2,q.position.y=16.2,v.add(q);let M=new r(new dt(14.3,.24,8,48),t);M.rotation.x=Math.PI/2,M.position.y=16.8,v.add(M);let V=new r(new at(14.1,32,24,0,Math.PI*2,0,Math.PI*.5),f);V.position.y=16.4,v.add(V);for(let Se=0;Se<8;Se++){let Ne=Se/8*Math.PI,Ve=new r(new dt(14.15,.22,8,32,Math.PI),t);Ve.rotation.y=Ne,Ve.position.y=16.4,v.add(Ve)}let $=new r(new no(2.2,0),t);$.position.y=30.6,v.add($);for(let Se=0;Se<8;Se++){let Ne=Se/8*Math.PI*2,Ve=new r(new lt(.42,3.8,4),t);Ve.rotation.z=-Ne+Math.PI/2,Ve.position.set(Math.cos(Ne)*2.8,30.6+Math.sin(Ne)*.5,Math.sin(Ne)*2.8),v.add(Ve)}let ee=new ce(6.4,1.1,.35),X=new r(ee,t);X.position.set(0,3.2,-14.2),v.add(X);let I=this._buildHuskyMesh();I.scale.setScalar(1.85),I.position.set(0,4,0),I.rotation.y=Math.PI,I.castShadow=!0,v.add(I);let h=[16728193,16766287,16777215,16740419,12216520];for(let Se=0;Se<32;Se++){let Ne=Se/32*Math.PI*2,Ve=5.2+Se%3*.45,Ye=new tt({color:h[Se%h.length],roughness:.6,metalness:.05}),nt=new at(.35,8,6);nt.scale(1,.4,1);let ft=new r(nt,Ye);ft.position.set(Math.cos(Ne)*Ve,3.22,Math.sin(Ne)*Ve),ft.rotation.set(Se%5*.15,Ne,Se%3*.1),v.add(ft)}let g=new je;g.position.set(0,16.5,0);let C=new Mt({uniforms:{time:{value:0}},vertexShader:`
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
      `,transparent:!0,logarithmicDepthBuffer:!0,blending:Ht,side:wt,depthWrite:!1}),w=new r(new js(1.6,16),C);w.castShadow=!0,g.add(w),this._kayaShaders||(this._kayaShaders=[]),this._kayaShaders.push(C);let i=new at(1.2,32,32),_=new Mt({uniforms:{time:{value:0}},vertexShader:`
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
      `,transparent:!0,logarithmicDepthBuffer:!0,blending:Ht,depthWrite:!1}),S=new r(i,_);g.add(S),this._kayaShaders.push(_);let W=new r(new dt(2.3,.12,16,48),t);W.rotation.x=Math.PI/2,g.add(W);for(let Se=0;Se<8;Se++){let Ne=Se/8*Math.PI*2,Ve=new r(new lt(.18,2.2,8),t);Ve.rotation.z=-Ne+Math.PI/2,Ve.position.set(Math.cos(Ne)*2.1,Math.sin(Ne)*.1,Math.sin(Ne)*2.1),g.add(Ve)}v.add(g);let ae=128,p=new gt,E=new Float32Array(ae*3),T=new Float32Array(ae);for(let Se=0;Se<ae;Se++){let Ne=Se/ae*Math.PI*2,Ve=4.8+Math.sin(Se*3.7)*1.5;E[Se*3]=Math.cos(Ne)*Ve,E[Se*3+1]=16.5+Math.sin(Ne*4)*1.2,E[Se*3+2]=Math.sin(Ne)*Ve,T[Se]=Math.random()}p.setAttribute("position",new ct(E,3)),p.setAttribute("aSize",new ct(T,1));let P=new Mt({uniforms:{time:{value:0}},vertexShader:`
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
      `,transparent:!0,logarithmicDepthBuffer:!0,blending:Ht,depthWrite:!1}),te=new co(p,P);v.add(te),this._kayaStardust=te,this._kayaShaders.push(P);let se=new vo(4244735,5,200);se.position.set(0,16.5,0),v.add(se),e.add(v);let oe=-110,ne=2160,k=ke(oe,ne),O=new je;O.position.set(oe,k,ne);let ie=ho("weatheredTravertine",{repeat:2.5,color:10261124,roughness:.9,metalness:0,normalScale:2.5,aoMapIntensity:1.8}),ve=ho("timber",{repeat:1.5,color:4006934,roughness:.8,metalness:0,normalScale:1.5}),De=ho("bronze",{repeat:1.2,color:9072197,roughness:.4,metalness:.85,physical:!0,clearcoat:.2,clearcoatRoughness:.5}),Ue=pe.gold(1),Ke=ho("granite",{repeat:1.8,color:1183758,roughness:.2,metalness:.05,physical:!0,clearcoat:.5,clearcoatRoughness:.3,normalScale:1.2}),N=new tt({color:4850965,roughness:.85,metalness:.05}),Te=new Ct({color:16733440}),Ce=new Ct({color:16759586}),Pe=new tt({color:16766720,emissive:16755236,emissiveIntensity:1.8,roughness:.2,metalness:.8}),D=[],U=[],G=[],A=[],z=[],F=[],Q=[],ue=[],ge=[],we=new ce(36,1.6,50);we.translate(0,.8,0),D.push(we);let _e=new ce(32,1.4,46);_e.translate(0,2.3,0),D.push(_e);let Ze=new ce(28,1.2,42);Ze.translate(0,3.6,0),D.push(Ze);let Oe=14;for(let Se=0;Se<Oe;Se++){let Ne=new ce(18,.35,1.4);Ne.translate(0,.18+Se*.3,27.5-Se*.75),D.push(Ne)}let ot=new L(.85,1.1,12,16),vt=new ce(2.6,1,2.6);[[-10.5,-18],[10.5,-18],[-10.5,-10],[10.5,-10],[-10.5,-2],[10.5,-2],[-10.5,6],[10.5,6],[-10.5,14],[10.5,14],[-10.5,20],[10.5,20]].forEach(([Se,Ne])=>{let Ve=ot.clone();Ve.translate(Se,4.2+6,Ne),D.push(Ve);let Ye=vt.clone();Ye.translate(Se,4.2+12.5,Ne),D.push(Ye);let nt=new ce(2.8,.3,2.8);nt.translate(Se,4.2+13,Ne),A.push(nt)});let pt=new ce(1.6,12,32);pt.translate(-11.5,4.2+6,-2),D.push(pt);let Tt=new ce(1.6,12,32);Tt.translate(11.5,4.2+6,-2),D.push(Tt);let xt=new ce(24.6,12,1.6);xt.translate(0,4.2+6,-17.2),D.push(xt);let Pt=new ce(18.5,1.2,50);Pt.rotateZ(.4),Pt.translate(-7.2,4.2+12+3.8,0),U.push(Pt);let St=new ce(18.5,1.2,50);St.rotateZ(-.4),St.translate(7.2,4.2+12+3.8,0),U.push(St);let Gt=new mo;Gt.moveTo(-13.5,0),Gt.lineTo(13.5,0),Gt.lineTo(0,6),Gt.closePath();let Nt=new Eo(Gt,{depth:1.2,bevelEnabled:!1}),zt=Nt.clone();zt.translate(0,4.2+12,22.8),D.push(zt);let Dt=this._buildWingedSunDisc();Dt.position.set(0,4.2+12+2.5,24.1),Dt.scale.setScalar(1.5),O.add(Dt);let wo=Nt.clone();wo.translate(0,4.2+12,-19.2),D.push(wo);for(let Se of[-9.5,9.5]){let Ne=new ce(2.6,1.5,2.6);Ne.translate(Se,4.2+.75,23.5),G.push(Ne);let Ve=new L(.65,.85,13,10);Ve.translate(Se,4.2+1.5+6.5,23.5),G.push(Ve);let Ye=new at(1.3,16,12);Ye.translate(Se,4.2+14.5,23.5),ge.push(Ye)}let Z=new ce(7,1.5,4.2);Z.translate(0,4.2+.75,-2),z.push(Z);let Ee=this._buildBronzeBull();Ee.position.set(0,4.2+1.5,-2),Ee.rotation.y=-Math.PI*.72,Ee.scale.setScalar(1.5),O.add(Ee),new je().position.set(0,4.2+.75,1.5);let Xe=new L(1,.5,.6,16);Xe.translate(0,.3,0),G.push(Xe.clone().translate(0,4.2+.75,1.5));let et=new r(new ce(4,5,4),new Ct({visible:!1}));et.position.set(0,4.2+2,1.5),et.userData={action:"donation_temple_baal",label:"Place an Offering at the Great Altar"},this.world.pickables.push(et),O.add(et);for(let Se of[-7.5,7.5]){let Ne=new L(.25,.45,2.6,8);Ne.translate(Se,4.2+1.3,-2),G.push(Ne);let Ve=new at(1.5,16,12,0,Math.PI*2,Math.PI/2,Math.PI/2);Ve.rotateX(Math.PI),Ve.translate(Se,4.2+2.6,-2),G.push(Ve);let Ye=new L(1.2,.9,.5,12);Ye.translate(Se,4.2+2.5,-2),Q.push(Ye);let nt=new lt(.9,2.2,10);nt.translate(Se,4.2+3.6,-2),ue.push(nt)}let st=new ce(10,2,6);st.translate(0,4.2+1,-13.5),z.push(st);let J=this._buildBaalIdol();J.position.set(0,4.2+2,-13.5),J.scale.setScalar(1.8),O.add(J);for(let Se of[-6.2,6.2]){let Ne=new rt(3.2,10);Ne.translate(Se,4.2+7,-16),F.push(Ne)}let Ge=[-11,-3,5,13];for(let Se of Ge)for(let Ne of[-10.6,10.6]){let Ve=new L(.15,.1,1.5,8);Ve.rotateZ((Ne<0?1:-1)*.35),Ve.translate(Ne,4.2+5.8,Se),G.push(Ve);let Ye=new lt(.25,.7,6);Ye.translate(Ne+(Ne<0?.3:-.3),4.2+6.6,Se),ue.push(Ye)}let Ie=(Se,Ne,Ve=!0)=>{if(Se.length===0)return;let Ye=qe(Se,!1);if(Ye){let nt=new r(Ye,Ne);Ve&&(nt.castShadow=!0,nt.receiveShadow=!0),O.add(nt)}};Ie(D,ie),Ie(U,ve),Ie(G,De),Ie(A,Ue),Ie(z,Ke),Ie(F,N,!1),Ie(Q,Te,!1),Ie(ue,Ce,!1),Ie(ge,Pe,!1),e.add(O);let We=[new ht(o+85,ke(o+85,s-130)+.15,s-130),new ht(o+45,ke(o+45,s-65)+.15,s-65),new ht(o,m+.2,s),new ht(o-55,ke(o-55,s+40)+.15,s+40),new ht(oe,k+.2,ne),new ht(oe-35,ke(oe-35,ne+65)+.15,ne+65)],$e=new It(We),K=Yt(new Jt($e,80,2.8,8,!1),.08,.22,55);K.scale(1,.15,1),Ko(K,m);let re=new r(K,l);re.receiveShadow=!0,e.add(re);let ze=new tt({color:16774358,emissive:16755236,emissiveIntensity:3.6,roughness:.1});[{x:o+85,z:s-130},{x:o+45,z:s-65},{x:o-35,z:s-70},{x:o-80,z:s-20},{x:oe+20,z:ne-20},{x:oe-25,z:ne+35},{x:o+105,z:s+20},{x:o+70,z:s+95}].forEach(Se=>{let Ne=ke(Se.x,Se.z),Ve=new r(new L(.35,.45,4.2,8),pe.bronze(1));Ve.position.set(Se.x,Ne+2.1,Se.z),Ve.castShadow=!0,e.add(Ve);let Ye=new r(new Vt(.85,0),ze);Ye.position.set(Se.x,Ne+4.6,Se.z),e.add(Ye)});let Me=new Lt,xe=[],he=[],Be=[],be=[],Je=[],it=[],Et=yt(882211);for(let Se=0;Se<380;Se++){let Ne=Et()*Math.PI*2,Ve=16+Math.pow(Et(),.7)*280,Ye=o+Math.cos(Ne)*Ve,nt=s+Math.sin(Ne)*Ve,ft=ke(Ye,nt);if(ft<j.waterLevel+.6||ft>m+12||Math.hypot(Ye-o,nt-s)<22||Math.hypot(Ye-oe,nt-ne)<24)continue;let Ae=ft<4.5||Ve>180,Bt=.85+Et()*.6;if(Me.position.set(Ye,ft,nt),Me.rotation.y=Et()*Math.PI*2,Ae){let Zt=.22+Et()*.32,to=Math.atan2(nt-s,Ye-o);Me.rotation.x=Math.sin(to)*Zt,Me.rotation.z=-Math.cos(to)*Zt}else Me.rotation.x=(Et()-.5)*.14,Me.rotation.z=(Et()-.5)*.14;Me.scale.setScalar(Bt),Me.updateMatrix();let Xt=Et();Xt<.45||Ae?(xe.push(Me.matrix.clone()),he.push(Me.matrix.clone())):Xt<.72?(Be.push(Me.matrix.clone()),be.push(Me.matrix.clone())):Xt<.88?Je.push(Me.matrix.clone()):it.push(Me.matrix.clone())}let bt=(Se,Ne,Ve=.45)=>{let Ye=new rt(Se,Ne,2,2),nt=Ye.attributes.position;for(let ft=0;ft<nt.count;ft++){let Ae=nt.getX(ft),Bt=nt.getY(ft),Xt=Ae/(Se*.5),Zt=Bt/(Ne*.5);nt.setZ(ft,(1-Xt*Xt)*Ve*(1-Zt*.35)+(1-Zt*Zt)*Ve*.25)}return Ye.computeVertexNormals(),Ye},Wt=(()=>{let Se=[],Ne=new L(.75,1.35,2.2,10);Ne.translate(0,1.1,0),Se.push(Ne);let Ve=8;for(let Ye=0;Ye<Ve;Ye++){let nt=Ye/Ve,ft=.75*(1-nt*.38),Ae=.75*(1-(Ye+1)/Ve*.38),Bt=new L(Ae,ft,1.45,8),Xt=Math.sin(nt*Math.PI*.75)*.85,Zt=Math.cos(nt*Math.PI*.65)*.55;Bt.translate(Xt,2.2+Ye*1.4+.72,Zt),Se.push(Bt)}return qe(Se,!1)||Ne})(),fo=(()=>{let Se=[];for(let Ne=0;Ne<10;Ne++){let Ve=Ne/10*Math.PI*2+.1,Ye=2.2,nt=-.5,ft=bt(2.6,4.8,.42);ft.rotateX(nt),ft.rotateY(Ve),ft.translate(Math.cos(Ve)*Ye,13.5+2.6,Math.sin(Ve)*Ye),Se.push(ft)}for(let Ne=0;Ne<16;Ne++){let Ve=Ne/16*Math.PI*2;for(let Ye=0;Ye<2;Ye++){let nt=Ye/2,ft=1.8+nt*5.2,Ae=.22+nt*1.18,Bt=bt(3.2*(1-nt*.28),4.6,.5);Bt.rotateX(Ae),Bt.rotateY(Ve),Bt.translate(Math.cos(Ve)*ft,13.5+1.6-Math.sin(Ae)*2.8,Math.sin(Ve)*ft),Se.push(Bt)}}for(let Ne=0;Ne<12;Ne++){let Ve=Ne/12*Math.PI*2+.25;for(let Ye=0;Ye<2;Ye++){let nt=Ye/2,ft=2.4+nt*4.6,Ae=.72+nt*.85,Bt=bt(2.8*(1-nt*.25),4.4,.52);Bt.rotateX(Ae),Bt.rotateY(Ve),Bt.translate(Math.cos(Ve)*ft,13.5-.6-Math.sin(Ae)*2.4,Math.sin(Ve)*ft),Se.push(Bt)}}for(let Ne=0;Ne<8;Ne++){let Ve=Ne/8*Math.PI*2+.4,Ye=2.8,nt=1.35,ft=bt(2.4,3.8,.45);ft.rotateX(nt),ft.rotateY(Ve),ft.translate(Math.cos(Ve)*Ye,13.5-2.4,Math.sin(Ve)*Ye),Se.push(ft)}return qe(Se,!1)||Se[0]})(),Qt=new L(.35,.65,7.5,8);Qt.translate(0,3.75,0);let us=(()=>{let Se=[];for(let Ne=0;Ne<6;Ne++){let Ve=Ne/6*Math.PI*2,Ye=new rt(2.8,6.2);Ye.rotateX(.55),Ye.rotateY(Ve),Ye.translate(Math.cos(Ve)*2.2,7.2,Math.sin(Ve)*2.2),Se.push(Ye)}return qe(Se,!1)||Se[0]})(),go=(()=>{let Se=[];for(let Ne=0;Ne<5;Ne++){let Ve=Ne/5*Math.PI*2,Ye=new $t(2.2,8);Ye.rotateX(-Math.PI*.35),Ye.rotateY(Ve),Ye.translate(Math.cos(Ve)*1.8,1.2,Math.sin(Ve)*1.8),Se.push(Ye)}return qe(Se,!1)||Se[0]})(),zo=(()=>{let Se=[];for(let Ne=0;Ne<6;Ne++){let Ve=Ne/6*Math.PI*2,Ye=new rt(1.4,3.8);Ye.rotateX(.45),Ye.rotateY(Ve),Ye.translate(Math.cos(Ve)*1.2,.6,Math.sin(Ve)*1.2),Se.push(Ye)}return qe(Se,!1)||Se[0]})(),po=pe.palmFrond(16777215),oo=pe.leafCard(5025616),eo=pe.leafCard(3046706),lo=new tt({color:1096065,emissive:366185,emissiveIntensity:.65,roughness:.4,alphaTest:.5,side:wt});this.world._windMaterials&&this.world._windMaterials.push(po,oo,eo,lo);let io=(Se,Ne,Ve,Ye=!0)=>{if(!Ve.length)return;Se.computeBoundingSphere&&Se.computeBoundingSphere();let nt=new ut(Se,Ne,Ve.length);Ve.forEach((ft,Ae)=>nt.setMatrixAt(Ae,ft)),nt.instanceMatrix.needsUpdate=!0,typeof nt.computeBoundingSphere=="function"&&nt.computeBoundingSphere(),typeof nt.computeBoundingBox=="function"&&nt.computeBoundingBox(),nt.castShadow=Ye,nt.receiveShadow=!0,nt.frustumCulled=!1,e.add(nt)};io(Wt,c,xe,!0),io(fo,po,he,!0),io(Qt,pe.bark(1.2),Be,!0),io(us,oo,be,!0),io(go,eo,Je,!0),io(zo,lo,it,!1),this.world.scene.add(e)}_desertPhantasmTree(){let e=new je,o=-460,s=340,n=ke(o,s);e.position.set(o,n,s);let t=pe.weatheredConcrete(2.5),a=pe.flagstone(3),l=pe.bark(1.8),u=pe.celestialGold(1),f=new tt({color:12216520,emissive:10233776,emissiveIntensity:.68,roughness:.18,metalness:.1,transmission:.82,ior:1.54,thickness:1.2,transparent:!0,opacity:.92,clearcoat:1,clearcoatRoughness:.1}),c=new tt({color:8445674,emissive:58879,emissiveIntensity:.72,roughness:.14,metalness:.05,transmission:.85,ior:1.52,thickness:1,transparent:!0,opacity:.88,clearcoat:1,clearcoatRoughness:.08}),m=new tt({color:16769154,emissive:16766287,emissiveIntensity:.55,roughness:.22,metalness:.15,transmission:.78,ior:1.55,thickness:1.1,transparent:!0,opacity:.9,clearcoat:.9,clearcoatRoughness:.12}),v=new tt({color:4010568,roughness:.52,metalness:.24,clearcoat:.35,clearcoatRoughness:.3}),R=new L(34,40,10,32),b=new r(R,t);b.position.y=5,b.receiveShadow=b.castShadow=!0,e.add(b);let Y=new L(26,32,8,32),x=new r(Y,t);x.position.y=14,x.receiveShadow=x.castShadow=!0,e.add(x);let H=new L(18,24,7,32),y=new r(H,a);y.position.y=21.5,y.receiveShadow=y.castShadow=!0,e.add(y);let q=new je;q.position.set(22,18,8);let M=new r(new L(8.5,8.5,2.6,24,1,!0),t);M.position.y=1.3,M.castShadow=M.receiveShadow=!0,q.add(M);let V=new r(new $t(8.4,24),a);V.rotation.x=-Math.PI/2,V.position.y=.05,V.receiveShadow=!0,q.add(V);for(let O=0;O<8;O++){let ie=O/8*Math.PI*2,ve=new r(new L(.22,.22,17,8),l);ve.rotation.z=Math.PI/2,ve.rotation.y=ie,ve.position.y=2.6,ve.castShadow=!0,q.add(ve)}let $=new r(new dt(1.4,.35,12,24),t);$.rotation.x=Math.PI/2,$.position.y=.3,q.add($);let ee=new r(new $t(1.2,16),new Ct({color:16737792}));ee.rotation.x=-Math.PI/2,ee.position.y=.32,q.add(ee);let X=new vo(16742178,1.8,35,1.2);X.position.set(0,1.2,0),q.add(X),e.add(q);let I=new je;I.position.set(0,25,0);let h=24,g=20,C=22,w=new L(2.2,5.8,C,h,g),i=w.attributes.position;for(let O=0;O<i.count;O++){let ie=i.getX(O),ve=i.getY(O),De=i.getZ(O),Ue=(ve+C*.5)/C,Ke=Math.atan2(De,ie),N=Math.hypot(ie,De),Te=Math.cos(Ke*7+Ue*3.2)*Math.pow(1-Ue,1.6)*3.2,Ce=Math.sin(Ue*Math.PI*1.5)*1.8,Pe=N+Te;i.setX(O,Math.cos(Ke+Ce*.15)*Pe+Math.sin(Ue*4)*.8),i.setY(O,ve+C*.5),i.setZ(O,Math.sin(Ke+Ce*.15)*Pe)}w.computeVertexNormals();let _=new r(w,v);_.castShadow=_.receiveShadow=!0,I.add(_);for(let O=0;O<8;O++){let ie=O/8*Math.PI*2+.15,ve=new L(.4,1.5,9,8);ve.rotateZ(.72),ve.rotateY(ie),ve.translate(Math.cos(ie)*6.2,-1.8,Math.sin(ie)*6.2);let De=new r(ve,v);De.castShadow=De.receiveShadow=!0,I.add(De)}let S=[],W=[],ae=[];for(let O=0;O<8;O++){let ie=O/8*Math.PI*2+O%2*.3,ve=[],De=new L(.85,1.4,7.5,8);De.rotateZ(.55),De.rotateY(ie),De.translate(Math.cos(ie)*4.5,C+2,Math.sin(ie)*4.5),ve.push(De);let Ue=new L(.45,.85,7,8);Ue.rotateZ(.82),Ue.rotateY(ie+.22),Ue.translate(Math.cos(ie+.22)*9.5,C+4.8,Math.sin(ie+.22)*9.5),ve.push(Ue);let Ke=new L(.2,.45,6,6);Ke.rotateZ(1.05),Ke.rotateY(ie+.45),Ke.translate(Math.cos(ie+.45)*14,C+6.2,Math.sin(ie+.45)*14),ve.push(Ke);let N=qe(ve,!1)||De,Te=new r(N,v);Te.castShadow=!0,I.add(Te);let Ce=new B(Math.cos(ie+.3)*12.5,C+5.5,Math.sin(ie+.3)*12.5);for(let Pe=0;Pe<6;Pe++){let D=Ce.x+Math.sin(Pe*2.1)*3.5,U=Ce.y+Math.cos(Pe*1.7)*2.2,G=Ce.z+Math.sin(Pe*3.4)*3.5,A=1.4+Pe%3*.7,z=new Vt(A,1);z.translate(D,U,G),Pe%3===0?W.push(z):Pe%3===1?ae.push(z):S.push(z)}}for(let O=0;O<7;O++){let ie=Math.sin(O*1.5)*3,ve=C+5+Math.cos(O*1.2)*2.5,De=Math.cos(O*1.5)*3,Ue=new js(2.4,1);Ue.translate(ie,ve,De),S.push(Ue)}if(S.length>0){let O=qe(S,!1);if(O){let ie=new r(O,f);ie.castShadow=!1,I.add(ie)}}if(W.length>0){let O=qe(W,!1);if(O){let ie=new r(O,c);ie.castShadow=!1,I.add(ie)}}if(ae.length>0){let O=qe(ae,!1);if(O){let ie=new r(O,m);ie.castShadow=!1,I.add(ie)}}this._phantasmTreeLight=new vo(12216520,3.4,110,1.2),this._phantasmTreeLight.position.set(0,C+4,0),I.add(this._phantasmTreeLight);let p=new vo(58879,2,75,1.4);p.position.set(0,C+8,0),I.add(p),e.add(I);let E=85,T=new Float32Array(E*3),P=new Float32Array(E*3),te=new Float32Array(E),se=yt(99128),oe=new ye;for(let O=0;O<E;O++){let ie=4+se()*22,ve=se()*Math.PI*2;T[O*3]=Math.cos(ve)*ie,T[O*3+1]=22+se()*26,T[O*3+2]=Math.sin(ve)*ie;let De=se();De<.5?oe.setHex(12216520):De<.8?oe.setHex(8445674):oe.setHex(16766287),P[O*3]=oe.r,P[O*3+1]=oe.g,P[O*3+2]=oe.b,te[O]=4.5+se()*6.5}let ne=new gt;ne.setAttribute("position",new ct(T,3)),ne.setAttribute("color",new ct(P,3)),ne.setAttribute("size",new ct(te,1)),this.phantasmMoteMat=new Mt({transparent:!0,depthWrite:!1,blending:Ht,uniforms:{uTime:{value:0}},vertexShader:`
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
      `,vertexColors:!0});let k=new co(ne,this.phantasmMoteMat);e.add(k),this.world.scene.add(e)}_highlandSanctuary(){let e=new je,o=pe.flagstone(2.5),s=pe.marble(1.5),n=pe.bronze(1),t=182,a=new ce(110,1.6,42),l=new r(a,o);l.position.set(0,t+.8,-475),l.receiveShadow=l.castShadow=!0,e.add(l);for(let b=-48;b<=48;b+=4){if(Math.abs(b)<16)continue;let Y=new r(new L(.35,.42,1.4,8),s);Y.position.set(b,t+1.6+.7,-455),Y.castShadow=!0,e.add(Y)}let u=new ce(32,.35,.45),f=new r(u,s);f.position.set(-32,t+2.9,-455),e.add(f);let c=new r(u,s);c.position.set(32,t+2.9,-455),e.add(c);let m=new ce(22,1.2,110),v=new r(m,o);v.position.set(0,t+.6,-545),v.receiveShadow=!0,e.add(v);let R=new tt({color:16774358,emissive:16755236,emissiveIntensity:3.5,roughness:.1});for(let b=-475;b>=-585;b-=28)[-12,12].forEach(Y=>{let x=new r(new L(.28,.38,4.5,8),n);x.position.set(Y,t+1.2+2.25,b),x.castShadow=!0,e.add(x);let H=new r(new Vt(.75,0),R);H.position.set(Y,t+1.2+4.8,b),e.add(H)});this.world.scene.add(e)}_buildUniversalStructure(e,o,s,n){let t=typeof ke=="function"?ke(e,o):0,a=new je;a.position.set(e,t,o),this.world.scene.add(a);let l=ho("hohenzollernSandstone",{repeat:6,color:14202225,roughness:.85,metalness:0,normalScale:2,aoMapIntensity:1.2}),u=ho("darkSlate",{repeat:4,color:2895411,roughness:.7,metalness:.1,normalScale:1}),f=ho("asamRedMarble",{repeat:3,color:5904401,roughness:.1,metalness:0,clearcoat:.8,clearcoatRoughness:.15}),c=pe.celestialGold(1),m=pe.byzantineMosaic(8),v=pe.clearGlass(1),R=[],b=[],Y=new ce(100,15,120);Y.translate(0,7.5,0),R.push(Y);let x=new ce(85,12,100);x.translate(0,21,0),R.push(x);let H=new ce(50,45,70);H.translate(0,49.5,0),R.push(H);let y=new lt(38,25,4);if(y.rotateY(Math.PI/4),y.translate(0,84.5,0),b.push(y),[{x:-25,z:35,r:8,h:65,rh:30},{x:25,z:35,r:8,h:65,rh:30},{x:-25,z:-35,r:8,h:65,rh:30},{x:25,z:-35,r:8,h:65,rh:30},{x:-42,z:50,r:6,h:45,rh:20},{x:42,z:50,r:6,h:45,rh:20},{x:-42,z:-50,r:6,h:45,rh:20},{x:42,z:-50,r:6,h:45,rh:20},{x:0,z:50,r:10,h:55,rh:35},{x:0,z:-10,r:12,h:90,rh:45}].forEach(W=>{let ae=new L(W.r,W.r+1,W.h,12);ae.translate(W.x,27+W.h/2,W.z),R.push(ae);let p=new lt(W.r+1.5,W.rh,12);p.translate(W.x,27+W.h+W.rh/2,W.z),b.push(p)}),qe){if(R.length>0){let W=new r(qe(R),l);W.castShadow=!0,W.receiveShadow=!0,a.add(W)}if(b.length>0){let W=new r(qe(b),u);W.castShadow=!0,W.receiveShadow=!0,a.add(W)}}else R.forEach(W=>{let ae=new r(W,l);ae.castShadow=!0,ae.receiveShadow=!0,a.add(ae)}),b.forEach(W=>{let ae=new r(W,u);ae.castShadow=!0,ae.receiveShadow=!0,a.add(ae)});let M=[],V=[];for(let W=-20;W<=20;W+=10)for(let ae of[-15,15]){for(let T=30;T<65;T+=2){let P=new L(1.5,1.5,2,8);P.translate(Math.sin(T*.5)*.5,0,Math.cos(T*.5)*.5),P.translate(ae,T,W),M.push(P)}let p=new ce(4,1.5,4);p.translate(ae,66,W),V.push(p);let E=new L(2.5,2.5,2,8);E.translate(ae,67.5,W),V.push(E)}new ce(32,2,50).translate(0,45,0),new ce(26,4,44).translate(0,45,0);let X=new ce(3,2,50);X.translate(-14.5,45,0);let I=new ce(3,2,50);I.translate(14.5,45,0);let h=new ce(26,2,3);h.translate(0,45,23.5);let g=new ce(26,2,3);if(g.translate(0,45,-23.5),V.push(X,I,h,g),qe){if(M.length>0){let W=new r(qe(M),f);W.castShadow=!0,W.receiveShadow=!0,a.add(W)}if(V.length>0){let W=new r(qe(V),c);W.castShadow=!0,W.receiveShadow=!0,a.add(W)}}else M.forEach(W=>{let ae=new r(W,f);ae.castShadow=!0,ae.receiveShadow=!0,a.add(ae)}),V.forEach(W=>{let ae=new r(W,c);ae.castShadow=!0,ae.receiveShadow=!0,a.add(ae)});let C=new L(15,15,50,32,1,!0,0,Math.PI);C.rotateZ(Math.PI/2),C.rotateY(Math.PI/2),C.translate(0,68,0);let w=new r(C,m);w.castShadow=!0,w.receiveShadow=!0,a.add(w);let i=new sa(2101264,.8);a.add(i);let _=new oa(16773341,25);_.position.set(0,90,0),_.target.position.set(0,30,0),_.angle=Math.PI/5,_.penumbra=.8,_.castShadow=!0,a.add(_),a.add(_.target);let S=new vo(16755285,10,50);S.position.set(0,40,-15),a.add(S)}_universalCathedral(){this._buildUniversalStructure(j.cathedral.x,j.cathedral.z,"CATHEDRAL","Cathedral")}_buddhistPagoda(){this._buildUniversalStructure(j.buddhistTemple.x,j.buddhistTemple.z,"PAGODA","Pagoda")}_moorishMosque(){let e=new je,o=j.mosque.x,s=j.mosque.z,n=ke(o,s);e.position.set(o,n,s);let t=ho("honedCarraraMarble",{repeat:2,color:16776440,roughness:.12,metalness:.05,physical:!0,clearcoat:.4,clearcoatRoughness:.2}),a=pe.weatheredConcrete(3),l=pe.moorishZellij(3.8),u=ho("stuccoMuqarnas",{repeat:2.5,color:16644852,roughness:.9,metalness:0,normalScale:2.2,aoMapIntensity:1.8}),f=ho("moorishZellij",{repeat:6,color:1217186,roughness:.04,metalness:0,physical:!0,clearcoat:1,clearcoatRoughness:.01,ior:1.65,reflectivity:.95,clearcoatNormalScale:.5}),c=pe.gold(1),m=ho("timber",{repeat:3,color:3021328,roughness:.7,metalness:0,physical:!0,clearcoat:.1,clearcoatRoughness:.5,normalScale:1.4}),v=pe.brushedMetal(2),R=new ce(40,4,58),b=new r(R,a);b.position.set(0,.2,7),b.receiveShadow=b.castShadow=!0,e.add(b);let Y=new r(new rt(38,56),t);Y.rotation.x=-Math.PI/2,Y.position.set(0,2.21,7),Y.receiveShadow=!0,e.add(Y);let x=new rt(36,1.4);x.rotateX(-Math.PI/2),[0,18,34].forEach(K=>{let re=new r(x,l);re.position.set(0,2.24,K),e.add(re)});let H=new je;H.position.set(0,2.2,17);let y=28,q=10.5,M=.75,V=new ce(q+1.2,M+.4,y+1.2),$=new r(V,t);$.position.y=-M*.5+.1,H.add($);let ee=new rt(q,y);ee.rotateX(-Math.PI/2);let X=new r(ee,this.world._waterPoolMat||new tt({color:1331810,roughness:.05,metalness:.4}));X.position.y=.08,H.add(X),this.world._reflectiveMeshes&&this.world._reflectiveMeshes.push(X);let I=new ce(.8,.28,y+1.6);[-q/2-.4,q/2+.4].forEach(K=>{let re=new r(I,t);re.position.set(K,.14,0),re.castShadow=!0,H.add(re)});let h=new ce(q+1.6,.28,.8);[-y/2-.4,y/2+.4].forEach(K=>{let re=new r(h,t);re.position.set(0,.14,K),re.castShadow=!0,H.add(re)}),[-y/2+1.8,y/2-1.8].forEach(K=>{let re=new je;re.position.set(0,0,K);let ze=new r(new L(1.6,1.9,.45,24),t);ze.position.y=.22,re.add(ze);let Le=new r(new L(1.4,.8,.5,24),t);Le.position.y=.65,Le.castShadow=!0,re.add(Le);let Me=new r(new at(1.1,16,10,0,Math.PI*2,0,Math.PI*.45),this.world._waterPoolMat||new tt({color:2263198,roughness:.04,metalness:.35,transparent:!0,logarithmicDepthBuffer:!0,opacity:.88}));Me.position.y=.68,re.add(Me);let xe=new r(new L(.15,.22,.6,16),v);xe.position.y=1.05,re.add(xe);let he=new r(new ce(.6,.18,3.2),t);he.position.set(0,.1,K>0?-1.8:1.8),re.add(he),H.add(re)});let g=new $t(.55,12,0,Math.PI*1.85);g.rotateX(-Math.PI/2);let C=new tt({color:2974512,roughness:.75,side:wt});[{x:-2.5,z:-6},{x:3,z:-4.5},{x:-3.2,z:2},{x:2.8,z:5.5},{x:-2,z:8},{x:1.5,z:-9.5}].forEach((K,re)=>{let ze=new r(g,C);ze.position.set(K.x,.09,K.z),ze.rotation.y=re*1.1,H.add(ze);let Le=new tt({color:re%2===0?16777215:16299224,emissive:16769776,emissiveIntensity:.6,roughness:.3}),Me=new r(new Vt(.24,0),Le);Me.position.set(K.x+.1,.18,K.z+.1),H.add(Me)});let i=pe.bark(1.5),_=pe.cypressFoliage();this.world._windMaterials&&this.world._windMaterials.push(_);let S=(K,re,ze=.35)=>{let Le=new rt(K,re,2,2),Me=Le.attributes.position;for(let xe=0;xe<Me.count;xe++){let he=Me.getX(xe),Be=Me.getY(xe),be=he/(K*.5),Je=Be/(re*.5);Me.setZ(xe,(1-be*be)*ze*(1-Je*.25))}return Le.computeVertexNormals(),Le},W=(()=>{let K=[],re=new L(.55,1.1,1.8,8);re.translate(0,.9,0),K.push(re);let ze=new L(.28,.55,5.5,8);return ze.translate(0,4.25,0),K.push(ze),qe(K,!1)||re})(),ae=(()=>{let K=[];for(let Me=0;Me<56;Me++){let xe=Me/55,he=1.4+xe*16.5,Be=Me*2.39996,Je=.65*Math.sin(Math.pow(xe,.45)*Math.PI)+.18,it=1.45*(1-xe*.3),Et=2.4*(1-xe*.3),bt=S(it,Et,.28);bt.rotateX(.18+(1-xe)*.2),bt.rotateY(Be),bt.translate(Math.cos(Be)*Je,he,Math.sin(Be)*Je),K.push(bt)}let Le=qe(K,!1)||K[0];if(Le&&Le.attributes.position&&Le.attributes.normal){let Me=Le.attributes.position,xe=Le.attributes.normal;for(let he=0;he<Me.count;he++){let Be=Me.getX(he),be=Me.getZ(he),Je=Math.hypot(Be,be)||1,it=Be/Je*.85+xe.getX(he)*.15,Et=.15+xe.getY(he)*.15,bt=be/Je*.85+xe.getZ(he)*.15,Wt=Math.hypot(it,Et,bt)||1;xe.setXYZ(he,it/Wt,Et/Wt,bt/Wt)}xe.needsUpdate=!0}return Le})();[-11.5,11.5].forEach(K=>{let re=new r(new ce(4.2,.35,32),t);re.position.set(K,.18,0),H.add(re);let ze=new r(new rt(3.6,31.4),new tt({color:4010534,roughness:.95}));ze.rotation.x=-Math.PI/2,ze.position.set(K,.36,0),H.add(ze);let Le=new r(new ce(3.4,.65,31),new tt({color:2248228,roughness:.85}));Le.position.set(K,.68,0),Le.castShadow=!0,H.add(Le);for(let Me=-12;Me<=12;Me+=8){let xe=new je;xe.position.set(K,.36,Me);let he=new r(W,i);he.castShadow=!0,xe.add(he);let Be=new r(ae,_);Be.castShadow=!1,Be.receiveShadow=!0,xe.add(Be),H.add(xe)}}),e.add(H);let p=new je;p.position.set(0,2.2,-10);let E=new r(new ce(34,.6,20),l);E.position.y=.3,E.receiveShadow=!0,p.add(E);let T=new r(new ce(34,11,1.8),t);T.position.set(0,5.8,-9.2),T.castShadow=T.receiveShadow=!0,p.add(T);let P=new r(new ce(1.8,11,20),t);P.position.set(-17,5.8,0),P.castShadow=P.receiveShadow=!0,p.add(P);let te=new r(new ce(1.8,11,11),t);te.position.set(17,5.8,-4.5),te.castShadow=te.receiveShadow=!0,p.add(te);let se=new r(new ce(1.8,11,3),t);se.position.set(17,5.8,8.5),se.castShadow=se.receiveShadow=!0,p.add(se);let oe=new r(new ce(1.8,3.5,6),t);oe.position.set(17,9.55,4),oe.castShadow=!0,p.add(oe);let ne=new ce(33.8,2.6,.1),k=new r(ne,l);k.position.set(0,1.6,-8.2),p.add(k);let O=new je;O.position.set(0,0,-8.1);let ie=new r(new ce(5.2,8.2,.4),u);ie.position.y=4.1,O.add(ie);let ve=new r(new L(1.8,1.8,6.2,24,1,!1,0,Math.PI),l);ve.rotation.y=Math.PI/2,ve.position.y=3.6,O.add(ve);let De=new r(new at(1.8,24,12,0,Math.PI,0,Math.PI/2),c);De.position.y=6.7,O.add(De);let Ue=new vo(16770208,3.6,25);Ue.position.set(0,4.5,.8),O.add(Ue);let Ke=new je;Ke.position.set(3.2,0,-7);let N=new r(new ce(1.5,1.2,1),m);N.position.y=.6,N.castShadow=!0,Ke.add(N);let Te=new r(new ce(1.6,.12,1.1),v);Te.position.y=1.25,Ke.add(Te);let Ce=new r(new ce(4,4,4),new Ct({visible:!1}));Ce.position.y=1,Ce.userData={action:"donation_mosque",label:"Offer Sadaqah (Charity)"},this.world.pickables.push(Ce),Ke.add(Ce),p.add(Ke),p.add(O);let Pe=(()=>{let K=[];for(let xe=0;xe<4;xe++){let he=xe/4*1.2,Be=1.2/4,be=xe+2,Je=1.4/be,it=(xe+1)/4*.8;for(let Et=0;Et<be;Et++){let bt=-.7+(Et+.5)*Je,Wt=new ce(Je*.94,Be*.94,it);Wt.translate(bt,he+Be*.5,it*.5),K.push(Wt)}}return qe(K,!1)||K[0]})(),D=(()=>{let K=[],Le=new ce(3.6,2.6,.15);K.push(Le);let Me=1.4,xe=.85;for(let he=-3;he<=3;he++){let Be=new ce(Me,.08,.12);Be.rotateZ(xe),Be.translate(he*.55,0,.04),K.push(Be);let be=new ce(Me,.08,.12);be.rotateZ(-xe),be.translate(he*.55,0,.04),K.push(be)}return qe(K,!1)||K[0]})(),U=new L(.3,.36,6.2,16),G=new ce(.95,.55,.95),A=new ce(.95,.35,.95),z=(()=>{let K=new mo,re=1.65,ze=2.15,Le=-.26,Me=Math.PI+.26,xe=24,he=[];for(let Be=0;Be<=xe;Be++){let be=Le+Be/xe*(Me-Le);he.push(new kt(Math.cos(be)*re,Math.sin(be)*re))}for(let Be=xe;Be>=0;Be--){let be=Le+Be/xe*(Me-Le);he.push(new kt(Math.cos(be)*ze,Math.sin(be)*ze))}return K.setFromPoints(he),new Eo(K,{depth:.8,bevelEnabled:!0,bevelThickness:.04,bevelSize:.04,bevelSegments:2})})(),F=(()=>{let K=new mo,re=2.4,ze=7,Le=re*Math.PI/(ze*2.1),Me=-.15,xe=Math.PI+.3,he=[];for(let Be=0;Be<ze;Be++){let be=Me+(Be+.5)/ze*xe,Je=Math.cos(be)*re,it=Math.sin(be)*re;for(let Et=0;Et<=6;Et++){let bt=be-Math.PI/2+Et/6*Math.PI;he.push(new kt(Je+Math.cos(bt)*Le,it+Math.sin(bt)*Le))}}return he.push(new kt(re*1.35,-.4)),he.push(new kt(re*1.35,re*1.45)),he.push(new kt(-re*1.35,re*1.45)),he.push(new kt(-re*1.35,-.4)),K.setFromPoints(he),new Eo(K,{depth:.85,bevelEnabled:!0,bevelThickness:.05,bevelSize:.05,bevelSegments:2})})(),Q=[-14,-10,-6,-2.5,2.5,6,10,14];Q.forEach((K,re)=>{let ze=new r(A,t);ze.position.set(K,.48,8.8),p.add(ze);let Le=new r(U,t);Le.position.set(K,3.4,8.8),Le.castShadow=!0,p.add(Le);let Me=new r(G,u);Me.position.set(K,6.7,8.8),p.add(Me);let xe=new r(Pe,u);if(xe.position.set(K,6.9,8.4),p.add(xe),re<Q.length-1){let he=Q[re+1],Be=(K+he)/2;if(Math.abs(Be)<1){let be=new r(F,u);be.position.set(0,6.6,8.4),p.add(be)}else{let be=new r(z,u);be.position.set(Be,6.7,8.4),p.add(be)}}});for(let K=-4;K<=6;K+=4)[-14,14].forEach(re=>{let ze=new r(A,t);ze.position.set(re,.48,K),p.add(ze);let Le=new r(U,t);Le.position.set(re,3.4,K),Le.castShadow=!0,p.add(Le);let Me=new r(G,u);Me.position.set(re,6.7,K),p.add(Me);let xe=new r(Pe,u);if(xe.position.set(re,6.9,K-.4),p.add(xe),re===14&&K>=2){let he=new r(z,u);he.position.set(re,6.7,K+2),he.rotation.y=Math.PI/2,p.add(he)}else{let he=new r(D,u);he.position.set(re>0?re+.1:re-.1,4.2,K+2),he.rotation.y=Math.PI/2,p.add(he)}});let ue=new r(new ce(34,2.6,18),l);ue.position.set(0,9.4,0),ue.castShadow=!0,p.add(ue);for(let K=-7;K<=7;K+=2.8){let re=new r(new ce(33.6,.45,.35),m);re.position.set(0,8.2,K),p.add(re)}let ge=new L(7.2,7.6,2.8,8),we=new r(ge,u);we.position.set(0,11.8,0),we.castShadow=!0,p.add(we);for(let K=0;K<8;K++){let re=K/8*Math.PI*2,ze=Math.cos(re)*7.4,Le=Math.sin(re)*7.4,Me=new r(new rt(1.6,2),new tt({color:16773324,emissive:16755236,emissiveIntensity:2.2}));Me.position.set(ze,11.8,Le),Me.rotation.y=-re-Math.PI/2,p.add(Me)}let _e=[];for(let K=0;K<=24;K++){let re=K/24,ze=Math.sin(re*Math.PI*.78)*7*(1-Math.pow(re,2.2)*.52),Le=re*9.8;_e.push(new kt(Math.max(.01,ze),Le))}let Ze=new $n(_e,32),Oe=new r(Ze,f);Oe.position.set(0,13.2,0),Oe.castShadow=!0,p.add(Oe);let ot=_e.map(K=>new B(K.x*1.02,K.y+13.2,0)),vt=new It(ot),At=new Jt(vt,20,.14,8,!1);for(let K=0;K<16;K++){let re=K/16*Math.PI*2,ze=new r(At,c);ze.rotation.y=re,p.add(ze)}let pt=new je;pt.position.set(0,23,0);let Tt=new r(new L(.12,.32,4.2,12),c);Tt.position.y=2.1,pt.add(Tt),[.9,2.1,3.1].forEach((K,re)=>{let ze=.52-re*.11,Le=new r(new at(ze,16,16),c);Le.position.y=K,pt.add(Le)});let xt=new r(new dt(.85,.16,10,24,Math.PI*1.5),c);xt.position.set(0,4.4,0),xt.rotation.y=Math.PI/4,pt.add(xt);let Pt=new vo(16772816,2.8,50);Pt.position.y=4.4,pt.add(Pt),p.add(pt);let St=new je;St.position.set(-17,0,-8);let Gt=new r(new ce(5.2,5,5.2),a);Gt.position.y=2.5,St.add(Gt);let Nt=new r(new ce(5.25,1.2,5.25),l);Nt.position.y=4.4,St.add(Nt);let zt=new r(new L(1.9,2.3,26,8),t);zt.position.y=18,zt.castShadow=!0,St.add(zt),[10,16,22].forEach(K=>{let re=new ce(1.1,1.8,.3);[-1,1].forEach(ze=>{let Le=new r(re,l);Le.position.set(ze*.7,K,2),St.add(Le)})});let Dt=new r(new L(2.8,2,1.6,8),u);Dt.position.y=31.2,St.add(Dt);let wo=new r(new L(2.8,2.8,.9,8),t);wo.position.y=32.4,St.add(wo);let Z=new r(new L(1.6,1.6,3.2,8,1,!0),t);Z.position.y=34.2,St.add(Z);let Ee=new r(new lt(1.9,4.2,8),f);Ee.position.y=37.8,Ee.castShadow=!0,St.add(Ee);let de=new je;de.position.set(0,40.2,0);let Xe=new r(new L(.08,.18,2.4,8),c);Xe.position.y=1.2,de.add(Xe);let et=new r(new at(.32,12,12),c);et.position.y=1.4,de.add(et);let st=new r(new dt(.55,.11,8,18,Math.PI*1.5),c);st.position.set(0,2.6,0),st.rotation.y=Math.PI/4,de.add(st),St.add(de),p.add(St);let J=new tt({color:16775904,emissive:16758080,emissiveIntensity:2.8,roughness:.25,metalness:.85});[{x:-10,y:6.2,z:8.8},{x:-5,y:6.2,z:8.8},{x:0,y:6.2,z:8.8},{x:5,y:6.2,z:8.8},{x:10,y:6.2,z:8.8},{x:0,y:7.2,z:3.5},{x:-4.5,y:7,z:0},{x:4.5,y:7,z:0},{x:0,y:7.2,z:-2},{x:-4.5,y:7,z:-5},{x:4.5,y:7,z:-5},{x:0,y:6.8,z:-6.5}].forEach(K=>{let re=new je;re.position.set(K.x,K.y,K.z);let ze=new r(new L(.02,.02,1.4,6),v);ze.position.y=.7,re.add(ze);let Le=new r(new no(.65,0),J);re.add(Le);let Me=new r(new lt(.35,.45,8),v);Me.position.y=.45,re.add(Me);let xe=new r(new lt(.25,.4,8),v);if(xe.rotation.x=Math.PI,xe.position.y=-.45,re.add(xe),K.x===0&&(K.z===8.8||K.z===3.5||K.z===-2)){let he=new vo(16758861,1.8,16);he.position.y=-.3,re.add(he)}p.add(re)});let Ie=new je;Ie.position.set(0,2.2,34),[-4.5,4.5].forEach(K=>{let re=new r(new L(.4,.48,5.8,16),t);re.position.set(K,2.9,0),re.castShadow=!0,Ie.add(re);let ze=new r(new ce(1.2,.6,1.2),u);ze.position.set(K,5.9,0),Ie.add(ze)});let We=new r(z,u);We.position.set(0,5.8,-.4),Ie.add(We);let $e=new r(new ce(10.5,1.2,1.2),l);$e.position.set(0,8.2,0),Ie.add($e),e.add(Ie),e.add(p),this.world.scene.add(e)}_roads(){let e=va();this.world.scene.add(e);for(let o of _n){if(o.name==="Grand Boulevard")continue;let s=ya(o);this.world.scene.add(s)}}_plaza(){let{x:e,z:o,r:s}=j.plaza,n=ke(e,o),t=new je,a=pe.honedCarraraMarble(1.5),l=pe.agedCaenLimestone(4),u=ho("granite",{repeat:2,color:1711392,roughness:.22,metalness:.12,physical:!0,clearcoat:.7,clearcoatRoughness:.12}),f=pe.lapisLazuli(1),c=pe.iron(2),m=pe.celestialGold(1),v=pe.verdigrisBronze(1),R=pe.foliage(1,4025144),b=pe.petal(1,16777215),Y=pe.petal(1,16576233),x=new Ct({color:16775912}),H=new _s({map:this.world._glowTex||null,color:16768904,transparent:!0,logarithmicDepthBuffer:!0,opacity:.88,blending:Ht,depthWrite:!1}),y=new r(new L(s+2,s+6,6.5,64),l);y.position.y=-1.8,y.receiveShadow=!0,t.add(y);let q=document.createElement("canvas");q.width=512,q.height=512;let M=q.getContext("2d");M.scale(.25,.25),M.fillStyle="#eae5d8",M.fillRect(0,0,2048,2048),M.strokeStyle="#d4cebf",M.lineWidth=3;for(let G=0;G<30;G++)M.beginPath(),M.moveTo(Math.random()*2048,Math.random()*2048),M.bezierCurveTo(Math.random()*2048,Math.random()*2048,Math.random()*2048,Math.random()*2048,Math.random()*2048,Math.random()*2048),M.stroke();let V=1024,$=980;M.strokeStyle="#181b1d",M.lineWidth=24,M.beginPath(),M.arc(V,V,$,0,Math.PI*2),M.stroke(),M.strokeStyle="#d4af37",M.lineWidth=10,M.beginPath(),M.arc(V,V,$-20,0,Math.PI*2),M.stroke(),M.strokeStyle="rgba(120, 110, 95, 0.45)",M.lineWidth=2;for(let G=420;G<$-40;G+=28)M.beginPath(),M.arc(V,V,G,0,Math.PI*2),M.stroke();for(let G=0;G<64;G++){let A=G/64*Math.PI*2;M.beginPath(),M.moveTo(V+Math.cos(A)*420,V+Math.sin(A)*420),M.lineTo(V+Math.cos(A)*($-40),V+Math.sin(A)*($-40)),M.stroke()}for(let G=0;G<48;G++){let A=G/48*Math.PI*2,z=340,F=V+Math.cos(A)*z,Q=V+Math.sin(A)*z;M.fillStyle=G%2===0?"#16191b":"#3c4a3e",M.beginPath(),M.moveTo(F+Math.cos(A)*30,Q+Math.sin(A)*30),M.lineTo(F+Math.cos(A+Math.PI/2)*15,Q+Math.sin(A+Math.PI/2)*15),M.lineTo(F-Math.cos(A)*30,Q-Math.sin(A)*30),M.lineTo(F-Math.cos(A+Math.PI/2)*15,Q-Math.sin(A+Math.PI/2)*15),M.closePath(),M.fill(),M.fillStyle="#d4af37",M.beginPath(),M.arc(F,Q,5,0,Math.PI*2),M.fill()}M.strokeStyle="#2c3a2e",M.lineWidth=8;for(let G=0;G<90;G++){let A=G/90*Math.PI*2,z=280,F=300;M.beginPath(),M.moveTo(V+Math.cos(A)*z,V+Math.sin(A)*z),M.lineTo(V+Math.cos(A+Math.PI/90)*F,V+Math.sin(A+Math.PI/90)*F),M.stroke()}let ee=32;for(let G=0;G<ee;G++){let A=G/ee*Math.PI*2,z=(G+.5)/ee*Math.PI*2,F=(G+1)/ee*Math.PI*2,Q=G%2===0,ue=Q?780:540;M.fillStyle=Q?"#16191b":"#323639",M.beginPath(),M.moveTo(V,V),M.lineTo(V+Math.cos(A)*140,V+Math.sin(A)*140),M.lineTo(V+Math.cos(z)*ue,V+Math.sin(z)*ue),M.closePath(),M.fill(),M.fillStyle=Q?"#d4af37":"#f2d04a",M.beginPath(),M.moveTo(V,V),M.lineTo(V+Math.cos(z)*ue,V+Math.sin(z)*ue),M.lineTo(V+Math.cos(F)*140,V+Math.sin(F)*140),M.closePath(),M.fill()}M.fillStyle="#16191b",M.beginPath(),M.arc(V,V,140,0,Math.PI*2),M.fill(),M.strokeStyle="#f2d04a",M.lineWidth=14,M.beginPath(),M.arc(V,V,138,0,Math.PI*2),M.stroke();let X=new Kt(q);X.anisotropy=16;let I=new tt({map:X,roughness:.38,metalness:.12}),h=new r(new $t(s-2,64),I);h.rotation.x=-Math.PI/2,h.position.y=1.75,h.receiveShadow=!0,t.add(h);let g=new r(new L(28,29,1.2,8),l);g.position.y=2.2,g.receiveShadow=!0,t.add(g);let C=new r(new L(26,27,1.2,8),a);C.position.y=3.4,C.receiveShadow=!0,t.add(C);for(let G=0;G<8;G++){let A=G/8*Math.PI*2,z=new je;z.position.set(0,4,0),z.rotation.y=-A;let F=new r(new L(23.9,22.1,.45,32,1,!1,-Math.PI/24,Math.PI/12),a);F.position.y=.55,z.add(F);let Q=new r(new L(24.3,23.9,1.4,32,1,!1,-Math.PI/24,Math.PI/12),a);Q.position.y=1.45,z.add(Q);let ue=new r(new ce(.6,4,1.8),l);ue.position.set(Math.sin(-Math.PI/32)*23,-1.5,Math.cos(-Math.PI/32)*23),ue.rotation.y=Math.PI/32,z.add(ue);let ge=new r(new ce(.6,4,1.8),l);ge.position.set(Math.sin(Math.PI/32)*23,-1.5,Math.cos(Math.PI/32)*23),ge.rotation.y=-Math.PI/32,z.add(ge),t.add(z);let we=A+Math.PI/8,_e=new je;_e.position.set(Math.cos(we)*26,4,Math.sin(we)*26);let Ze=new r(new ce(2.4,1.4,2.4),l);Ze.position.y=.7,_e.add(Ze);let Oe=new r(new L(1.6,.9,2.2,16),a);Oe.position.y=2.4,_e.add(Oe);let ot=new r(new $t(1.5,16),u);ot.rotation.x=-Math.PI/2,ot.position.y=3.45,_e.add(ot);let vt=new as(new ht(-.9,3.4,0),new ht(0,6.2,0),new ht(.9,3.4,0)),At=new r(new Jt(vt,16,.08,6),c);_e.add(At);let pt=new r(new at(1.7,12,10),R);pt.scale.set(1.1,1.3,1.1),pt.position.y=4.2,_e.add(pt);for(let Tt=0;Tt<18;Tt++){let xt=Math.random()*Math.PI,Pt=Math.random()*Math.PI*2,St=Math.sin(xt)*Math.cos(Pt)*1.7,Gt=4.2+Math.cos(xt)*1.5,Nt=Math.sin(xt)*Math.sin(Pt)*1.7,zt=Tt%3===0,Dt=new r(zt?new at(.32,8,8):new no(.22,0),zt?Y:b);Dt.position.set(St,Gt,Nt),_e.add(Dt)}t.add(_e)}let w=new r(new L(18.5,19.5,2.6,64),a);w.position.y=5.2,w.receiveShadow=!0,t.add(w);let i=new r(new dt(18.8,.85,16,64),a);i.rotation.x=Math.PI/2,i.position.y=6.5,t.add(i);for(let G=0;G<8;G++){let A=G/8*Math.PI*2,z=new r(new ce(1.6,2.8,3.2),a);z.position.set(Math.cos(A)*18.6,4.4,Math.sin(A)*18.6),z.rotation.y=-A,t.add(z)}let _=new r(new $t(18.2,64),this._fountainBasinMat);_.rotation.x=-Math.PI/2,_.position.y=6.1,_.receiveShadow=!0,t.add(_),this.world._reflectiveMeshes.push(_);let S=new r(new L(3.6,4.8,6,32),a);S.position.y=9.1,S.castShadow=!0,t.add(S);let W=new r(new dt(4.2,.35,8,32),m);W.rotation.x=Math.PI/2,W.position.y=6.8,t.add(W);let ae=new r(new L(11.4,7.2,2.8,48),a);ae.position.y=13.5,ae.castShadow=!0,t.add(ae);let p=new r(new dt(11.6,.65,16,64),a);p.rotation.x=Math.PI/2,p.position.y=14.9,t.add(p);let E=new r(new $t(10.8,48),this._fountainBasinMat);E.rotation.x=-Math.PI/2,E.position.y=14.6,t.add(E),this.world._reflectiveMeshes.push(E);for(let G=0;G<8;G++){let A=G/8*Math.PI*2,z=new je;z.position.set(Math.cos(A)*11.6,14.1,Math.sin(A)*11.6),z.rotation.y=-A+Math.PI/2;let F=new r(new at(.92,16,12),v);z.add(F);let Q=new r(new dt(.95,.38,8,16),m);Q.position.z=-.25,z.add(Q);let ue=new r(new L(.38,.52,.65,8),v);ue.rotation.x=Math.PI/2,ue.position.set(0,-.15,.65),z.add(ue);let ge=new r(new no(.35,0),m);ge.position.set(0,.45,.6),z.add(ge),t.add(z)}let T=new r(new L(2.4,3.4,5,24),a);T.position.y=17.1,T.castShadow=!0,t.add(T);let P=new r(new L(6.4,4.2,2,32),a);P.position.y=20.6,P.castShadow=!0,t.add(P);let te=new r(new $t(6,32),this._fountainBasinMat);te.rotation.x=-Math.PI/2,te.position.y=21.4,t.add(te),this.world._reflectiveMeshes.push(te);let se=new r(new L(1.8,2.4,4.5,16),a);se.position.y=23.8,se.castShadow=!0,t.add(se);let oe=new r(new dt(2.1,.28,8,24),m);oe.rotation.x=Math.PI/2,oe.position.y=25.8,t.add(oe);let ne=new r(new L(.35,1.5,11.5,4),f);ne.rotation.y=Math.PI/4,ne.position.y=31.6,ne.castShadow=!0,t.add(ne);for(let G=0;G<4;G++){let A=G/4*Math.PI*2+Math.PI/4,z=new r(new no(.45,0),m);z.position.set(Math.cos(A)*.95,31.6,Math.sin(A)*.95),t.add(z)}let k=new r(new lt(.55,2.2,4),m);k.rotation.y=Math.PI/4,k.position.y=38.2,k.castShadow=!0,t.add(k);let O=new r(new L(11.4,16.2,8.5,64,1,!0),this._fountainCascadeMat);O.position.y=10.35,t.add(O);let ie=new r(new L(6.4,9.2,6.8,48,1,!0),this._fountainCascadeMat);ie.position.y=18,t.add(ie);for(let G=0;G<4;G++){let A=G/4*Math.PI*2,z=new as(new ht(Math.cos(A)*1.8,24.6,Math.sin(A)*1.8),new ht(Math.cos(A)*5.2,30.8,Math.sin(A)*5.2),new ht(Math.cos(A)*5.8,21.4,Math.sin(A)*5.8)),F=new r(new Jt(z,20,.25,8),this._fountainCascadeMat);t.add(F)}for(let G=0;G<8;G++){let A=G/8*Math.PI*2,z=new as(new ht(Math.cos(A)*11.6,14.1,Math.sin(A)*11.6),new ht(Math.cos(A)*15.6,16.4,Math.sin(A)*15.6),new ht(Math.cos(A)*17.2,6.2,Math.sin(A)*17.2)),F=new r(new Jt(z,20,.35,8),this._fountainCascadeMat);t.add(F)}let ve=new tt({color:16773320,emissive:16765544,emissiveIntensity:2.2,roughness:.15,metalness:.1}),De=[],Ue=[],Ke=[],N=[];for(let G of[-1,1])for(let A=0;A<4;A++){let z=32+A*14,F=G*(s*.45),Q=new ce(2,6,2);Q.translate(F,1.6+.5-2.5,z),De.push(Q);let ue=new L(.55,.8,2.6,12);ue.translate(F,1.6+2.3,z),Ue.push(ue);let ge=new L(1.4,.6,1,16);ge.translate(F,1.6+4.1,z),Ke.push(ge);let we=new dt(1.4,.15,8,16);we.rotateX(Math.PI/2),we.translate(F,1.6+4.6,z),Ke.push(we);let _e=new lt(.8,1.8,8);_e.translate(F,1.6+5.5,z),N.push(_e);for(let Ze=0;Ze<4;Ze++){let Oe=Ze/4*Math.PI*2,ot=new lt(.5,1.4,6);ot.translate(Math.cos(Oe)*.5,0,Math.sin(Oe)*.5),ot.rotateZ(Math.cos(Oe)*.2),ot.rotateX(Math.sin(Oe)*.2),ot.translate(F,1.6+5.2,z),N.push(ot)}}let Te=ao(De,!1);Te&&t.add(new r(Te,u));let Ce=ao(Ue,!1);Ce&&t.add(new r(Ce,a));let Pe=ao(Ke,!1);Pe&&t.add(new r(Pe,m));let D=ao(N,!1);D&&t.add(new r(D,ve));let U=new vo(16768896,3.5,110,1.5);U.position.set(0,20,0),t.add(U),t.traverse(G=>{G.isMesh&&G.material!==this._fountainCascadeMat&&G.material!==this._fountainBasinMat&&(G.castShadow=!0,G.receiveShadow=!0)}),t.position.set(e,n,o),this.world.scene.add(t)}_gate(){let e=new je,{x:o,z:s}=j.gate,n=32,t=pe.honedCarraraMarble(1.5),a=pe.celestialGold(1),l=pe.verdigrisBronze(1),u=pe.celestialGold(1),f=pe.agedCaenLimestone(1.8),c=new Ct({color:16775912}),m=new _s({map:this.world._glowTex||null,color:16768904,transparent:!0,logarithmicDepthBuffer:!0,opacity:.88,blending:Ht,depthWrite:!1}),v=yo("leafCard"),R=Go(4093236,v.map,{isTree:!1,normalMap:v.normalMap,normalScale:.8,roughness:.68,sssColor:new ye(8052280),shadowColor:new ye(1588756),sssIntensity:.85,windIntensity:.9}),b=pe.limestoneDark(2),x=[12853821,16576233,16175973,15228277,11563734].map(Z=>new tt({color:Z,roughness:.45,metalness:.05,side:wt})),H=(Z=1)=>{let Ee=new je,de=ds(2.8*Z,.02);Ee.add(de);let Xe=[],et=new ce(3.6*Z,1*Z,3.6*Z);et.translate(0,.5*Z,0),Xe.push(et);let st=new L(3.2*Z,1.6*Z,2.6*Z,16);st.translate(0,3.4*Z,0),Xe.push(st);let J=ao(Xe,!1);if(J){let xe=new r(J,t);xe.castShadow=!0,Ee.add(xe)}let Ge=[],Ie=new L(1.6*Z,1*Z,1.2*Z,12);Ie.translate(0,1.6*Z,0),Ge.push(Ie);let We=new dt(3.3*Z,.35*Z,8,20);We.rotateX(Math.PI/2),We.translate(0,4.7*Z,0),Ge.push(We);for(let xe of[-1,1]){let he=new dt(1.4*Z,.28*Z,6,12,Math.PI*1.2);he.rotateZ(xe*.45),he.translate(xe*3.2*Z,3.4*Z,0),Ge.push(he)}let $e=ao(Ge,!1);if($e){let xe=new r($e,a);xe.castShadow=!0,Ee.add(xe)}let K=new r(new L(2.9*Z,2.7*Z,.6*Z,12),b);K.position.y=4.5*Z,Ee.add(K);let re=[];for(let xe=0;xe<8;xe++){let he=xe/8*Math.PI*2,Be=2.8*Z,be=new rt(1.6*Z,3.4*Z,2,2),Je=be.attributes.position;for(let it=0;it<Je.count;it++){let Et=Je.getX(it),bt=Je.getY(it),Wt=Et/(1.6*Z*.5),fo=bt/(3.4*Z*.5);Je.setZ(it,(1-Wt*Wt)*.45*(1-fo*.25))}be.computeVertexNormals(),be.rotateX(.78),be.rotateY(he+Math.PI*.5),be.translate(Math.cos(he)*Be,4.6*Z-.9*Z,Math.sin(he)*Be),re.push(be)}let ze=ao(re,!1);ze&&Ee.add(new r(ze,R));let Le=[];for(let xe=0;xe<8;xe++){let he=Math.acos(1-2*((xe+.5)/8)),Be=xe*2.39996,be=2*Z,Je=Math.sin(he)*Math.cos(Be)*be,it=4.8*Z+Math.cos(he)*(be*.65),Et=Math.sin(he)*Math.sin(Be)*be,bt=new at(.55*Z,6,5);bt.translate(Je,it,Et),Le.push(bt)}let Me=ao(Le,!1);return Me&&Ee.add(new r(Me,x[0])),Ee},y=24,q=12,M=13,V=y+q/2,$=new r(new ce(y*2+240,8,240),f);$.position.set(0,-3.8,60),$.receiveShadow=!0,e.add($);let ee=new r(new ce(y*2+48,1.6,210),t);ee.position.set(0,.45,60),ee.receiveShadow=!0,e.add(ee);for(let Z of[-1,1]){let Ee=Z*(y+22);for(let de=30;de<=150;de+=24){let Xe=new r(new L(.45,.65,3.8,8),t);Xe.position.set(Ee,2.35,de),Xe.castShadow=!0,e.add(Xe);let et=new r(new L(.95,.35,.75,8),a);et.position.set(Ee,4.35,de),e.add(et);let st=new r(new lt(.35,1.1,8),new Ct({color:16768392}));st.position.set(Ee,5,de),e.add(st)}}for(let Z of[-y-2,y+2]){let Ee=new r(new ce(.55,1.65,40),a);Ee.position.set(Z,.46,0),e.add(Ee)}let X=new r(new ce(y*2+6,.08,.55),a);X.position.set(0,1.26,0),e.add(X);let I=document.createElement("canvas");I.width=512,I.height=512;let h=I.getContext("2d");h.scale(.25,.25);let g=1024,C=1024;h.fillStyle="#f6f3eb",h.fillRect(0,0,2048,2048),h.strokeStyle="rgba(190, 175, 145, 0.4)",h.lineWidth=4;for(let Z=0;Z<24;Z++)h.beginPath(),h.moveTo(Math.random()*2048,Math.random()*2048),h.bezierCurveTo(Math.random()*2048,Math.random()*2048,Math.random()*2048,Math.random()*2048,Math.random()*2048,Math.random()*2048),h.stroke();h.fillStyle="#0f1712",h.beginPath(),h.arc(g,C,980,0,Math.PI*2),h.fill(),h.fillStyle="#18241c",h.beginPath(),h.arc(g,C,880,0,Math.PI*2),h.fill(),[980,960,880,860,620,600].forEach((Z,Ee)=>{h.strokeStyle=Ee%2===0?"#d4af37":"#f8db70",h.lineWidth=Ee%2===0?8:4,h.beginPath(),h.arc(g,C,Z,0,Math.PI*2),h.stroke()});for(let Z=0;Z<32;Z++){let Ee=Z/32*Math.PI*2,de=g+Math.cos(Ee)*920,Xe=C+Math.sin(Ee)*920;h.beginPath(),h.arc(de,Xe,Z%4===0?14:8,0,Math.PI*2),h.fillStyle=Z%4===0?"#fceaa0":"#d4af37",h.fill(),h.strokeStyle="#997316",h.lineWidth=2,h.stroke()}let w=(Z,Ee,de,Xe,et,st,J=!0)=>{h.save(),h.font=et,h.fillStyle=st,h.textAlign="center",h.textBaseline="middle";let Ge=Z.length,Ie=Xe-de;for(let We=0;We<Ge;We++){let $e=Z[We],K=(We+.5)/Ge,re=de+K*Ie;h.save(),h.translate(g,C),J?(h.rotate(re+Math.PI/2),h.translate(0,-Ee)):(h.rotate(re-Math.PI/2),h.translate(0,Ee)),h.fillText($e,0,0),h.restore()}h.restore()};w("\u2726   E T E R N I T Y   V A L L E Y   \u2726",740,-Math.PI*.78,-Math.PI*.22,'bold 64px "Cinzel", "Georgia", serif',"#fceaa0",!0),w("\u2726   SOMEWHERE OVER THE RAINBOW BRIDGE   \u2726",740,Math.PI*.78,Math.PI*.22,'bold 42px "Cinzel", "Georgia", serif',"#dfb94a",!1),w("\u2726  WHERE LOVE LIVES FOREVER  \u2726",540,-Math.PI*.65,-Math.PI*.35,'bold 36px "Cinzel", "Georgia", serif',"#e8c860",!0);let i=h.createRadialGradient(g,C,0,g,C,480);i.addColorStop(0,"#122438"),i.addColorStop(.6,"#091522"),i.addColorStop(1,"#040b12"),h.fillStyle=i,h.beginPath(),h.arc(g,C,480,0,Math.PI*2),h.fill();for(let Z=0;Z<60;Z++){let Ee=Math.random()*Math.PI*2,de=Math.random()*450,Xe=g+Math.cos(Ee)*de,et=C+Math.sin(Ee)*de;h.fillStyle="rgba(255, 240, 180, "+(.3+Math.random()*.7)+")",h.beginPath(),h.arc(Xe,et,1+Math.random()*2.2,0,Math.PI*2),h.fill()}let _=["#e0503c","#ef9138","#e8d84a","#5ec96a","#3fa9e0","#4661d8","#7a4bd0"],S=340;_.forEach((Z,Ee)=>{h.strokeStyle=Z,h.lineWidth=14,h.beginPath(),h.arc(g,C+60,S-Ee*13,-Math.PI*.88,-Math.PI*.12,!1),h.stroke()}),h.fillStyle="#0d1822",h.beginPath(),h.moveTo(g-360,C+180),h.lineTo(g-220,C-30),h.lineTo(g-140,C+50),h.lineTo(g,C-110),h.lineTo(g+130,C+40),h.lineTo(g+240,C-20),h.lineTo(g+360,C+180),h.closePath(),h.fill(),h.strokeStyle="#d4af37",h.lineWidth=4,h.stroke(),h.fillStyle="#e8eff8",h.beginPath(),h.moveTo(g,C-110),h.lineTo(g-35,C-60),h.lineTo(g+35,C-60),h.closePath(),h.fill(),h.fillStyle="#fff4cc",h.beginPath(),h.arc(g,C-135,28,0,Math.PI*2),h.fill(),h.strokeStyle="#d4af37",h.lineWidth=4,h.stroke();for(let Z=0;Z<8;Z++){let Ee=Z/8*Math.PI*2,de=Z%2===0?65:42,Xe=g+Math.cos(Ee)*de,et=C-135+Math.sin(Ee)*de;h.strokeStyle="#f8db70",h.lineWidth=Z%2===0?4:2,h.beginPath(),h.moveTo(g,C-135),h.lineTo(Xe,et),h.stroke()}let W=new Kt(I);W.anisotropy=Math.min(16,this.world.renderer.capabilities.getMaxAnisotropy?.()||16);let ae=new tt({map:W,roughness:.18,metalness:.65,emissive:new ye(16771216),emissiveMap:W,emissiveIntensity:.28}),p=new r(new L(15,15.4,.15,64),ae);p.rotation.y=-Math.PI/2,p.position.set(0,1.36,0),p.receiveShadow=!0,e.add(p);let E=new r(new dt(15.2,.35,12,64),a);E.rotation.x=Math.PI/2,E.position.set(0,1.28,0),e.add(E),[-28,28].forEach(Z=>{let Ee=H(1.1);Ee.position.set(Z,1.25,0),e.add(Ee)});let T=[60,35,10,-15];for(let Z of[-1,1]){let Ee=Z*34,de=new r(new ce(1.8,.9,90),t);de.position.set(Ee,.45,22.5),e.add(de);let Xe=new r(new ce(1.4,.55,90),t);Xe.position.set(Ee,2.6,22.5),e.add(Xe);for(let st=-20;st<=65;st+=3.5){let J=new r(new L(.24,.32,1.6,8),t);J.position.set(Ee,1.5,st),e.add(J)}for(let st of T){let J=new je;J.position.set(Ee,0,st);let Ge=ds(3.2);J.add(Ge);let Ie=new r(new ce(3,1.8,3),t);Ie.position.y=.9,J.add(Ie);let We=new r(new dt(1.3,.25,8,16),a);We.rotation.x=Math.PI/2,We.position.y=1.9,J.add(We);let $e=new r(new L(.55,.75,7.5,12),l);$e.position.y=5.65,J.add($e);let K=new r(new L(1.2,.55,1.4,8),a);K.position.y=9.8,J.add(K);let re=new r(new Vt(1.35,0),a);re.position.y=11.6,J.add(re);let ze=new r(new at(.65,8,8),c);if(ze.position.y=11.6,J.add(ze),this.world._glowTex){let Me=new ns(m);Me.position.y=11.6,Me.scale.set(6.5,6.5,1),J.add(Me)}let Le=new r(new lt(1.45,1.6,6),a);Le.position.y=13,J.add(Le),e.add(J)}let et=[47.5,22.5,-2.5];for(let st of et){let J=H(.85);J.position.set(Ee,2.9,st),e.add(J)}}let P=new tt({color:3346437,emissive:16724996,emissiveIntensity:3.5,roughness:.85,metalness:.2}),te=new tt({color:16774048,emissive:16768848,emissiveIntensity:4.2,roughness:.1,metalness:0}),se=new Ct({color:16747546,transparent:!0,logarithmicDepthBuffer:!0,opacity:.85,blending:Ht,depthWrite:!1}),oe=(Z=1,Ee=!0)=>{let de=new je,Xe=new r(new ce(4.8*Z,1.2*Z,4.8*Z),t);Xe.position.y=.6*Z,de.add(Xe);let et=new r(new L(2*Z,1.2*Z,1.5*Z,16),a);et.position.y=1.95*Z,de.add(et);let st=new r(new L(4*Z,2*Z,3.2*Z,24),a);st.position.y=4.2*Z,de.add(st);let J=new r(new dt(4.1*Z,.45*Z,12,32),a);J.rotation.x=Math.PI/2,J.position.y=5.8*Z,de.add(J);for(let Me of[-1,1]){let xe=new r(new dt(1.8*Z,.36*Z,8,16,Math.PI*1.2),a);xe.rotation.z=Me*.45,xe.position.set(Me*4*Z,4.2*Z,0),de.add(xe)}let Ge=new r(new L(3.6*Z,3.4*Z,.8*Z,16),P);Ge.position.y=5.6*Z,de.add(Ge);let Ie=new r(new lt(1.4*Z,5.2*Z,12),te);Ie.position.y=8.2*Z,de.add(Ie);let We=new r(new lt(2.6*Z,7.6*Z,16),se);We.position.y=9*Z,de.add(We);for(let Me=0;Me<4;Me++){let xe=Me/4*Math.PI*2,he=new r(new lt(1.1*Z,5.8*Z,8),se);he.position.set(Math.cos(xe)*1.1*Z,8.4*Z,Math.sin(xe)*1.1*Z),he.rotation.z=Math.cos(xe)*.22,he.rotation.x=Math.sin(xe)*.22,de.add(he)}let $e=Math.floor(60*Z),K=new gt,re=new Float32Array($e*3);for(let Me=0;Me<$e;Me++){let xe=Math.random()*Math.PI*2,he=Math.random()*2.8*Z;re[Me*3+0]=Math.cos(xe)*he,re[Me*3+1]=(6+Math.random()*12)*Z,re[Me*3+2]=Math.sin(xe)*he}K.setAttribute("position",new ct(re,3));let ze=new Ss({color:16756792,size:.95*Z,transparent:!0,logarithmicDepthBuffer:!0,opacity:.95,blending:Ht,depthWrite:!1}),Le=new co(K,ze);return de.add(Le),de.onBeforeRender=()=>{let Me=performance.now()*.001,xe=1+Math.sin(Me*6+(Ee?0:2.5))*.14+Math.cos(Me*11)*.07;Ie.scale.set(xe,1+(xe-1)*1.5,xe),We.scale.set(xe*1.05,1+(xe-1)*1.2,xe*1.05),We.rotation.y=Me*1.2;let he=K.attributes.position;for(let Be=0;Be<$e;Be++){let be=he.getY(Be)+.08*Z;be>18*Z&&(be=6*Z),he.setY(Be,be);let Je=he.getX(Be)+Math.sin(Me*2.2+Be)*.022,it=he.getZ(Be)+Math.cos(Me*2.2+Be)*.022;he.setX(Be,Je),he.setZ(Be,it)}he.needsUpdate=!0},de},ne=(Z,Ee,de)=>{let Xe=new je,et=new r(new ce(Ee*2.5,.9,Ee*2.5),t);et.position.y=.45,Xe.add(et);let st=new r(new dt(Ee*1.2,Ee*.22,12,24),t);st.rotation.x=Math.PI/2,st.position.y=1.05,Xe.add(st);let J=new r(new L(Ee*1.25,Ee*1.25,.18,24),a);J.position.y=1.35,Xe.add(J);let Ge=new r(new L(Ee*1.05,Ee*1.18,.4,24),t);Ge.position.y=1.65,Xe.add(Ge);let Ie=new r(new dt(Ee*1.08,Ee*.16,12,24),t);Ie.rotation.x=Math.PI/2,Ie.position.y=1.95,Xe.add(Ie);let We=Z-4.6,$e=new r(new L(de,Ee,We,24),t);$e.position.y=2+We/2,Xe.add($e);let K=16;for(let he=0;he<K;he++){let Be=he/K*Math.PI*2,be=(Ee+de)/2+.02,Je=new r(new L(.045,.055,We-.4,6),t);Je.position.set(Math.cos(Be)*be,2+We/2,Math.sin(Be)*be),Xe.add(Je)}let re=new r(new dt(de*1.06,.12,8,24),a);re.rotation.x=Math.PI/2,re.position.y=2+We+.1,Xe.add(re);let ze=2+We+.3,Le=new je;Le.position.y=ze;let Me=new r(new L(de*1.4,de*.95,2.2,16),a);Me.position.y=1.1,Le.add(Me);for(let he=0;he<8;he++){let Be=he/8*Math.PI*2,be=new r(new lt(.32,1.2,5),a);be.rotation.z=-Math.cos(Be)*.28,be.rotation.x=Math.sin(Be)*.28,be.position.set(Math.cos(Be)*(de*1.15),.65,Math.sin(Be)*(de*1.15)),Le.add(be)}for(let he=0;he<8;he++){let Be=(he+.5)/8*Math.PI*2,be=new r(new lt(.28,1.6,5),a);be.rotation.z=-Math.cos(Be)*.35,be.rotation.x=Math.sin(Be)*.35,be.position.set(Math.cos(Be)*(de*1.28),1.25,Math.sin(Be)*(de*1.28)),Le.add(be)}for(let he=0;he<4;he++){let Be=he/4*Math.PI*2+Math.PI/4,be=new r(new dt(.42,.14,8,16,Math.PI*1.4),a);be.rotation.y=Be,be.rotation.z=Math.PI/4,be.position.set(Math.cos(Be)*(de*1.45),1.9,Math.sin(Be)*(de*1.45)),Le.add(be)}let xe=new r(new ce(de*3.2,.55,de*3.2),t);xe.position.y=2.45,Le.add(xe);for(let he=0;he<4;he++){let Be=he/4*Math.PI*2,be=new r(new no(.28,0),a);be.position.set(Math.cos(Be)*(de*1.65),2.45,Math.sin(Be)*(de*1.65)),Le.add(be)}return Xe.add(Le),Xe},k=(Z,Ee)=>{let de=new je,Xe=ds(16);de.add(Xe);let et=new r(new ce(15.6,2,15.6),t);et.position.y=1,de.add(et);let st=new r(new ce(14.4,1.6,14.4),f);st.position.y=2.8,de.add(st);let J=new r(new ce(13.4,1.2,13.4),t);J.position.y=4.2,de.add(J);let Ge=new r(new ce(13.5,.25,13.5),a);Ge.position.y=4.8,de.add(Ge);let Ie=37.2,We=12,$e=Ie/We;for(let be=0;be<We;be++){let Je=12.8-be*.05,it=13.8-be*.05,Et=new r(new ce(Je,$e-.08,it),t);if(Et.position.y=4.8+$e*(be+.5),Et.castShadow=!0,Et.receiveShadow=!0,de.add(Et),be>0&&be<We-1)for(let bt of[0,Math.PI]){let Wt=new r(new ce(Je-2.6,$e-.24,.4),f);Wt.position.set(0,4.8+$e*(be+.5),(it/2+.1)*(bt===0?1:-1)),de.add(Wt)}}[[-5.2,-5.2],[5.2,-5.2],[-5.2,5.2],[5.2,5.2]].forEach(([be,Je])=>{let it=ne(Ie-.5,1.15,.98);it.position.set(be,4.8,Je),de.add(it)}),[-7,7].forEach(be=>{let Je=new r(new L(2.4,2.4,.45,24),a);Je.rotation.x=Math.PI/2,Je.position.set(0,22,be),de.add(Je);let it=new r(new no(1,0),a);it.position.set(0,22,be+(be>0?.35:-.35)),de.add(it)});let re=new r(new ce(13.4,1.2,14.4),t);re.position.y=37.6,de.add(re);let ze=new r(new ce(13.5,.3,14.5),a);ze.position.y=38.2,de.add(ze);let Le=new r(new ce(13.6,1.2,14.6),t);Le.position.y=42.6,de.add(Le);let Me=new r(new ce(13,1.6,14),t);Me.position.y=44,de.add(Me);for(let be=0;be<4;be++){let Je=new je;Je.rotation.y=be*(Math.PI/2);for(let it=-4.5;it<=4.5;it+=3){let Et=new r(new at(.42,8,8),a);Et.position.set(it,44,7.1),Je.add(Et)}de.add(Je)}let xe=new r(new ce(15.2,1.4,16.2),t);xe.position.y=45.5,de.add(xe);let he=new r(new ce(12.4,4.8,13.4),t);he.position.y=48.6,de.add(he),[-6.8,6.8].forEach(be=>{let Je=new r(new dt(1.6,.28,8,16),a);Je.position.set(0,48.6,be),de.add(Je)}),[[-5.2,-5.8],[5.2,-5.8],[-5.2,5.8],[5.2,5.8]].forEach(([be,Je])=>{let it=new r(new lt(.9,2,4),a);it.rotation.y=Math.PI/4,it.position.set(be,51.5,Je),de.add(it)});let Be=oe(1,Ee);return Be.position.set(0,51,0),de.add(Be),de.position.set(Z,0,0),de};e.add(k(-V,!0),k(V,!1));let O=38,ie=y,ve=[];for(let Z=0;Z<=32;Z++){let Ee=Math.PI-Z/32*Math.PI;ve.push(new B(Math.cos(Ee)*(ie-.8),O+Math.sin(Ee)*(ie-.8),0))}let De=new It(ve),Ue=new r(new Jt(De,48,.65,8),t);e.add(Ue);let Ke=[];for(let Z=0;Z<=32;Z++){let Ee=Math.PI-Z/32*Math.PI;Ke.push(new B(Math.cos(Ee)*ie,O+Math.sin(Ee)*ie,0))}let N=new It(Ke),Te=new r(new Jt(N,48,.95,8),t);e.add(Te);let Ce=[];for(let Z=0;Z<=32;Z++){let Ee=Math.PI-Z/32*Math.PI;Ce.push(new B(Math.cos(Ee)*(ie+.9),O+Math.sin(Ee)*(ie+.9),0))}let Pe=new It(Ce),D=new r(new Jt(Pe,48,.5,8),a);e.add(D);let U=23;for(let Z=1;Z<U;Z++){let Ee=Math.PI-Z/U*Math.PI,de=Math.cos(Ee)*(ie+.45),Xe=O+Math.sin(Ee)*(ie+.45),et=new r(new ce(1.8,2.4,2.8),t);et.position.set(de,Xe,0),et.rotation.z=Ee-Math.PI/2,e.add(et);let st=new r(new no(.38,0),a);st.position.set(de,Xe,1.5),e.add(st);let J=st.clone();J.position.set(de,Xe,-1.5),e.add(J)}let G=new je;G.position.set(0,O+ie+.9,0);let A=new r(new ce(3.6,4.2,3.6),t);G.add(A);for(let Z of[-1.9,1.9]){let Ee=new r(new ce(2.4,3.2,.4),a);Ee.position.set(0,0,Z),G.add(Ee);let de=new r(new no(1.5,0),a);de.position.set(0,.4,Z+(Z>0?.25:-.25)),G.add(de);let Xe=new r(new dt(1.4,.22,8,16),a);Xe.position.set(0,.4,Z+(Z>0?.2:-.2)),G.add(Xe)}e.add(G);for(let Z=1;Z<=15;Z++){let Ee=Math.PI-Z/16*Math.PI,de=Math.cos(Ee)*(ie-1.1),Xe=O+Math.sin(Ee)*(ie-1.1),et=new r(new ce(2.4,.45,3.8),t);et.position.set(de,Xe,0),et.rotation.z=Ee-Math.PI/2,e.add(et);let st=new r(new ce(1.8,.25,3),f);st.position.set(de,Xe,0),st.rotation.z=Ee-Math.PI/2,e.add(st);let J=new r(new L(.55,.55,.1,12),a);J.position.set(de,Xe,0),J.rotation.z=Ee-Math.PI/2,e.add(J);let Ge=new r(new at(.32,8,8),a);Ge.position.set(de,Xe,0),e.add(Ge)}for(let Z of[-1,1]){let Ee=new je,de=Z*(y/2+4.5),Xe=O+7.5;Ee.position.set(de,Xe,0);let et=new r(new ce(y-4.5,1.4,2.2),t);et.position.set(0,6.8,0),Ee.add(et);let st=new r(new ce(1.6,14.5,2.2),t);st.position.set(Z*((y-4.5)/2-.8),0,0),Ee.add(st);let J=new r(new dt(3.6,.65,12,32),t);Ee.add(J);let Ge=new r(new dt(3.1,.28,8,24),a);Ee.add(Ge);let Ie=new r(new dt(4.2,.24,8,24),a);Ee.add(Ie);for(let $e=0;$e<8;$e++){let K=$e/8*Math.PI*2,re=new r(new L(.09,.09,3.1,6),a);re.rotation.z=K,re.position.set(Math.sin(K)*1.55,Math.cos(K)*1.55,0),Ee.add(re)}let We=new r(new no(.7,0),a);Ee.add(We),e.add(Ee)}let z=48.5,F=y*2+2,Q=new r(new ce(F,1.4,3.6),t);Q.position.set(0,z-4.2,0),e.add(Q);let ue=new r(new ce(F+2.4,1.6,4.2),t);ue.position.set(0,z+4.6,0),e.add(ue);let ge=document.createElement("canvas");ge.width=512,ge.height=128;let we=ge.getContext("2d");we.scale(.25,.25);let _e=we.createLinearGradient(0,0,0,512);_e.addColorStop(0,"#07100a"),_e.addColorStop(.5,"#102015"),_e.addColorStop(1,"#07100a"),we.fillStyle=_e,we.fillRect(0,0,2048,512),we.strokeStyle="#d4af37",we.lineWidth=14,we.strokeRect(18,18,2012,476),we.strokeStyle="#f8db70",we.lineWidth=4,we.strokeRect(36,36,1976,440),we.fillStyle="#f8db70",[[54,54],[1994,54],[54,458],[1994,458]].forEach(([Z,Ee])=>{we.beginPath(),we.arc(Z,Ee,15,0,Math.PI*2),we.fill(),we.strokeStyle="#d4af37",we.lineWidth=3,we.stroke()}),we.textAlign="center",we.textBaseline="middle",we.font='bold 148px "Cinzel", "Georgia", "Times New Roman", serif',we.fillStyle="rgba(0, 0, 0, 0.9)",we.fillText("ETERNAL VALLEY",1028,186);let Ze=we.createLinearGradient(0,100,0,260);Ze.addColorStop(0,"#ffffff"),Ze.addColorStop(.25,"#fff4cc"),Ze.addColorStop(.55,"#f8db70"),Ze.addColorStop(.85,"#d4af37"),Ze.addColorStop(1,"#aa8218"),we.fillStyle=Ze,we.fillText("ETERNAL VALLEY",1024,180),we.font='600 64px "Cinzel", "Georgia", "Times New Roman", serif',we.fillStyle="rgba(0, 0, 0, 0.85)",we.fillText("\u2726   SOMEWHERE OVER THE RAINBOW BRIDGE   \u2726",1027,344);let Oe=we.createLinearGradient(0,300,0,380);Oe.addColorStop(0,"#fff4cc"),Oe.addColorStop(.6,"#f8db70"),Oe.addColorStop(1,"#c9a232"),we.fillStyle=Oe,we.fillText("\u2726   SOMEWHERE OVER THE RAINBOW BRIDGE   \u2726",1024,340);let ot=new Kt(ge);ot.anisotropy=16;let vt=new r(new ce(45,7.8,1.4),new tt({color:1578772,roughness:.3,metalness:.85}));vt.position.set(0,z,0),e.add(vt);let At=new tt({map:ot,emissiveMap:ot,emissive:new ye(16768880),emissiveIntensity:.95,roughness:.25,metalness:.6}),pt=new r(new rt(44,7.2),At);pt.position.set(0,z,.75),e.add(pt);let Tt=pt.clone();Tt.rotation.y=Math.PI,Tt.position.set(0,z,-.75),e.add(Tt);let xt=new r(new ce(F,.55,1.2),t);xt.position.set(0,z+6.2,0),e.add(xt);for(let Z=-20;Z<=20;Z+=4){let Ee=new r(new lt(.5,1.2,6),a);Ee.position.set(Z,z+7.1,0),e.add(Ee)}let Pt=new r(new lt(8,3.6,4),t);Pt.rotation.y=Math.PI/4,Pt.position.set(0,z+7.2,0),e.add(Pt);let St=new r(new no(1.6,0),a);St.position.set(0,z+9.2,0),e.add(St);let Gt=Z=>{let Ee=[],de=(K,re,ze,Le,Me=0,xe=0,he=0,Be=1,be=1,Je=1)=>{let it=K.clone();if(Me!==0||xe!==0||he!==0){let Et=new On(Me,xe,he),bt=new so().setFromEuler(Et),Wt=new _t().compose(new B(0,0,0),bt,new B(1,1,1));it.applyMatrix4(Wt)}(Be!==1||be!==1||Je!==1)&&it.scale(Be,be,Je),it.translate(re,ze,Le),Ee.push(it)},Xe=y-.6,et=35;de(new ce(Xe,1.2,1.2),Xe/2,et-.7,0),de(new ce(Xe,1,1),Xe/2,23,0),de(new ce(Xe,1,1),Xe/2,12,0),de(new ce(Xe,1.2,1.2),Xe/2,1,0),de(new ce(1.2,et,1.2),Xe,et/2,0),de(new ce(1.5,et+1,1.5),0,(et+1)/2,0),[3.5,12,21,31].forEach(K=>{de(new L(.9,.9,2,16),0,K,0)});let st=16;for(let K=1;K<st;K++){let re=K/st*Xe,ze=Math.sin(K/st*Math.PI)*3.5,Le=et-1.5+ze;de(new L(.24,.24,Le,8),re,Le/2+.8,0),de(new lt(.65,2.6,6),re,Le+2.1,0),de(new L(.18,.18,9.5,6),re+Xe/(st*2),5.8,0),de(new lt(.42,1.4,6),re+Xe/(st*2),10.8,0)}for(let K=1;K<=4;K++){let re=K/5*Xe;de(new dt(2.4,.28,8,20),re,6.5,0),de(new dt(2,.26,8,16),re,17.5,0),de(new dt(1.8,.24,8,16),re,28.5,0)}de(new dt(3.8,.35,8,32),Xe/2,17.5,0),de(new dt(2.4,.25,8,24),Xe/2,17.5,0);for(let K=0;K<16;K++){let re=K/16*Math.PI*2,ze=K%2===0?3.6:2.4;de(new lt(.42,ze,4),Xe/2+Math.cos(re)*(ze/2+.4),17.5+Math.sin(re)*(ze/2+.4),0,0,0,-re+Math.PI/2)}de(new no(1.3,0),Xe/2,17.5,0);let J=Xe/2,Ge=27.5;de(new at(1.2,16,12),J,Ge,0,0,0,0,1.5,.9,.75),de(new at(.6,12,10),J+(Z?1.1:-1.1),Ge+.55,0),de(new lt(.22,.75,4),J+(Z?1.65:-1.65),Ge+.5,0,0,0,Z?-Math.PI/2:Math.PI/2);for(let K of[-1,1])de(new lt(1.3,4.2,6),J,Ge+1.8,K*1.3,K*.6,0,(Z?.35:-.35)+K*.4,1,1,.2);de(new lt(1,2.4,4),J+(Z?-1.5:1.5),Ge-.45,0,0,0,Z?1.2:-1.2,1.2,1,.15);let Ie=new as(new ht(Z?1.65:-1.65,.5,0),new ht(Z?2.8:-2.8,.9,.3),new ht(Z?3.7:-3.7,.25,0));de(new Jt(Ie,12,.14,6),J,Ge,0);let We=qe(Ee,!1)||Ee[0],$e=new r(We,a);return $e.castShadow=!0,$e.receiveShadow=!0,$e},Nt=Gt(!0);Nt.position.set(-y+.5,1,0),Nt.rotation.y=0,e.add(Nt);let zt=Gt(!1);zt.position.set(y-.5,1,0),zt.rotation.y=Math.PI,e.add(zt),this.leftGateDoor=Nt,Nt.name="DynamicGateDoorLeft",Nt.userData={isDynamic:!0},this.rightGateDoor=zt,zt.name="DynamicGateDoorRight",zt.userData={isDynamic:!0},this.gateOpenAmount=0,this.gateTargetOpen=0;let Dt=Z=>{let Ee=new je,de=Z?1:-1,Xe=10,et=56,st=0,J=1.15,Ge=de*(y+q);for(let go=0;go<Xe;go++){let zo=go/(Xe-1),po=st+zo*(J-st),oo=Ge+de*(Math.sin(po)*et),eo=(1-Math.cos(po))*(et*.7),lo=new r(new ce(7.5,2,8.5),f);lo.position.set(oo,1,eo),lo.rotation.y=-de*po*.7,lo.receiveShadow=!0,Ee.add(lo);let io=new r(new ce(8.5,1,9.5),t);io.position.set(oo,.5,eo),io.rotation.y=-de*po*.7,io.receiveShadow=!0,Ee.add(io);let Se=new r(new L(1.2,1.4,12,16),t);Se.position.set(oo,8,eo),Se.castShadow=!0,Ee.add(Se);let Ne=new r(new ce(3,1.4,3),t);Ne.position.set(oo,14.4,eo),Ee.add(Ne);let Ve=new r(new dt(1.5,.35,8,16),a);Ve.rotation.x=Math.PI/2,Ve.position.set(oo,14.2,eo),Ee.add(Ve);let Ye=new r(new ce(3,1.2,3),t);Ye.position.set(oo,2.6,eo),Ee.add(Ye);let nt=new r(new ce(7.8,2,4.8),t);nt.position.set(oo,15.8,eo),nt.rotation.y=-de*po*.7,Ee.add(nt);let ft=new r(new ce(8.4,1.2,5.4),t);if(ft.position.set(oo,17,eo),ft.rotation.y=-de*po*.7,Ee.add(ft),go<Xe-1){let Ae=(go+1)/(Xe-1),Bt=st+Ae*(J-st),Xt=(po+Bt)/2,Zt=Ge+de*(Math.sin(Xt)*et),to=(1-Math.cos(Xt))*(et*.7),qt=new r(new ce(5.2,.6,1.2),t);qt.position.set(Zt,5.2,to),qt.rotation.y=-de*Xt*.7,Ee.add(qt);for(let Ut=-2;Ut<=2;Ut++){let Mo=Ut*.9,Fo=Zt+Math.cos(Xt*.7)*Mo,Ho=to+Math.sin(Xt*.7)*(de*Mo),ko=new r(new L(.35,.45,2.4,8),t);ko.position.set(Fo,3.8,Ho),Ee.add(ko)}if(go%2===1){let Ut=oe(.55,Z);Ut.position.set(Zt,17.6,to),Ee.add(Ut)}else{let Ut=H(.78);Ut.position.set(Zt,5.5,to),Ee.add(Ut)}}}let Ie=J,We=Ge+de*(Math.sin(Ie)*et+7),$e=(1-Math.cos(Ie))*(et*.7)+2,K=ds(14);K.position.set(We,.05,$e),Ee.add(K);let re=new r(new ce(16,15,16),t);re.position.set(We,8.5,$e),re.rotation.y=-de*Ie*.7,Ee.add(re);let ze=new r(new lt(12,6,4),t);ze.rotation.y=Math.PI/4-de*Ie*.7,ze.position.set(We,18.8,$e),Ee.add(ze);let Le=new r(new at(1.4,12,12),a);Le.position.set(We,22.8,$e),Ee.add(Le);let Me=oe(.85,Z);Me.position.set(We,23.6,$e),Ee.add(Me);let xe=document.createElement("canvas");xe.width=512,xe.height=128;let he=xe.getContext("2d");he.scale(.25,.25);let Be=he.createLinearGradient(0,0,0,512);Be.addColorStop(0,"#0c1810"),Be.addColorStop(.5,"#16281a"),Be.addColorStop(1,"#0c1810"),he.fillStyle=Be,he.fillRect(0,0,2048,512),he.strokeStyle="#d4af37",he.lineWidth=12,he.strokeRect(16,16,2016,480),he.strokeStyle="#f8db70",he.lineWidth=4,he.strokeRect(32,32,1984,448),he.fillStyle="#f8db70",[[48,48],[2e3,48],[48,464],[2e3,464]].forEach(([go,zo])=>{he.beginPath(),he.arc(go,zo,14,0,Math.PI*2),he.fill(),he.strokeStyle="#d4af37",he.lineWidth=3,he.stroke()}),he.textAlign="center",he.textBaseline="middle",he.font='bold 112px "Cinzel", "Georgia", "Times New Roman", serif',he.fillStyle="rgba(0, 0, 0, 0.85)",he.fillText("WELCOME TO ETERNAL VALLEY",1027,180);let be=he.createLinearGradient(0,100,0,240);be.addColorStop(0,"#ffffff"),be.addColorStop(.3,"#fff4cc"),be.addColorStop(.6,"#f8db70"),be.addColorStop(1,"#d4af37"),he.fillStyle=be,he.fillText("WELCOME TO ETERNAL VALLEY",1024,175),he.font='600 76px "Cinzel", "Georgia", "Times New Roman", serif',he.fillStyle="rgba(0, 0, 0, 0.85)",he.fillText("\u2726   WHERE LOVE LIVES FOREVER   \u2726",1026,339);let Je=he.createLinearGradient(0,280,0,380);Je.addColorStop(0,"#fff4cc"),Je.addColorStop(.6,"#f8db70"),Je.addColorStop(1,"#aa8218"),he.fillStyle=Je,he.fillText("\u2726   WHERE LOVE LIVES FOREVER   \u2726",1024,335);let it=new Kt(xe);it.anisotropy=16;let Et=new tt({map:it,emissiveMap:it,emissive:new ye(16768880),emissiveIntensity:.9,roughness:.28,metalness:.65}),bt=new r(new rt(36,1.8),Et),fo=st+.45*(J-st),Qt=Ge+de*(Math.sin(fo)*et),us=(1-Math.cos(fo))*(et*.7);return bt.position.set(Qt,15.8,us+2.8),bt.rotation.y=-de*fo*.7,Ee.add(bt),Ee};e.add(Dt(!1),Dt(!0));let wo=new vo(16761446,3.5,95,1.5);wo.position.set(0,18,0),e.add(wo),e.traverse(Z=>{Z.isMesh&&(Z.castShadow=!0,Z.receiveShadow=!0)}),e.position.set(o,n,s),this.world.scene.add(e)}_rainbowBridge(){this._rainbowShaders=[];let{x:e,z:o}=j.bridge,s=new je,n=ho("honedCarraraMarble",{repeat:1.5,color:16776952,roughness:.1,metalness:.05,physical:!0,clearcoat:.5,clearcoatRoughness:.15}),t=pe.flagstone(3.2);t.normalScale&&t.normalScale.set(2,2);let a=pe.limestoneDark(1.8);a.color.setHex(8681830),a.roughness=.9,a.metalness=0,a.normalScale.set(2.5,2.5),a.aoMapIntensity=1.8;let u=pe.gold(1),f=pe.verdigrisBronze(1),c=new tt({color:14677247,roughness:.04,metalness:.1,transparent:!0,logarithmicDepthBuffer:!0,opacity:.78,envMapIntensity:2.2}),m=new tt({color:13168895,roughness:.04,metalness:.1,transparent:!0,logarithmicDepthBuffer:!0,opacity:.8,envMapIntensity:2.4,side:wt});for(let[J,Ge]of[[-60,-70],[60,70]]){let Ie=o+(J+Ge)*.5,We=J<0?21.65:26.65,$e=ke(e,Ie),K=Math.max(2,We-$e+2),re=Yt(new ce(34,K,Math.abs(Ge-J)+2),.06,.18,42),ze=new r(re,a);ze.position.set(e,$e+K*.5-1,Ie);let Le=ds(42);Le.position.set(e,$e+.1,Ie),s.add(Le),ze.receiveShadow=ze.castShadow=!0,s.add(ze);for(let Me of[-1,1]){let xe=Yt(new ce(3.6,4.8,3.6),.08,.22,Me*77),he=new r(xe,n);he.position.set(e+Me*16.8,We+2.4-.55,o+Ge),he.castShadow=he.receiveShadow=!0,s.add(he);let Be=new r(new at(.9,12,12),u);Be.position.set(e+Me*16.8,We+4.8-.55,o+Ge),Be.castShadow=!0,s.add(Be)}}let v=28,R=[],b=[],Y=[],x=[],H=[],y=new _t,q=new _t,M=new _t;for(let J=0;J<v;J++){let Ge=J/(v-1),Ie=o-60+Ge*120,We=this.world._deckY(Ie),$e=-Math.cos(Ge*Math.PI)*.15;y.makeRotationX($e),q.makeTranslation(e,We,Ie),M.multiplyMatrices(q,y);let K=Yt(new ce(32,1.4,120/v+.8),.09,.22,J*7);Ko(K,We-1),K.applyMatrix4(M),R.push(K);let re=new ce(1.2,.08,120/v+.4);if(q.makeTranslation(e,We+.74,Ie),M.multiplyMatrices(q,y),re.applyMatrix4(M),b.push(re),J%2===0)for(let ze of[-6,6]){let Le=new no(.35,0);q.makeTranslation(e+ze,We+.75,Ie),M.multiplyMatrices(q,y),Le.applyMatrix4(M),Y.push(Le)}for(let ze of[-1,1]){let Le=new ce(1.6,.8,110/v+.9);q.makeTranslation(e+ze*15,We+1.1,Ie),M.multiplyMatrices(q,y),Le.applyMatrix4(M),x.push(Le);for(let he=-1;he<=1;he++){let Be=Ie+he*(120/(v*3)),be=this.world._deckY(Be)||We,Je=new L(.26,.36,1.8,8);q.makeTranslation(e+ze*15,be+2.3,Be),M.multiplyMatrices(q,y),Je.applyMatrix4(M),H.push(Je)}let Me=new ce(1.6,.6,120/v+.9);q.makeTranslation(e+ze*15,We+3.4,Ie),M.multiplyMatrices(q,y),Me.applyMatrix4(M),x.push(Me);let xe=new ce(1.4,.25,120/v+.8);q.makeTranslation(e+ze*15,We+3.8,Ie),M.multiplyMatrices(q,y),xe.applyMatrix4(M),Y.push(xe)}}let V=ao(R,!1);if(V){let J=new r(V,t);J.castShadow=J.receiveShadow=!0,s.add(J)}let $=ao(b,!1);$&&s.add(new r($,new tt({color:16774092,emissive:16768880,emissiveIntensity:.85,roughness:.2,metalness:.8})));let ee=ao(Y,!1);ee&&s.add(new r(ee,u));let X=ao(x,!1);if(X){let J=new r(X,n);J.castShadow=J.receiveShadow=!0,s.add(J)}let I=ao(H,!1);if(I){let J=new r(I,c);J.castShadow=!0,s.add(J)}for(let J of[-1,1])for(let Ge of[.04,.1,.9,.96]){let Ie=o-60+Ge*120,We=this.world._deckY(Ie),$e=Math.max(1,We-(j.waterLevel-2)),K=Yt(new ce(3.6,$e,8.5),.08,.26,Math.floor(Ge*99));Ko(K,j.waterLevel-2);let re=new r(K,n);re.position.set(e+J*14.8,j.waterLevel-2+$e/2,Ie),re.castShadow=re.receiveShadow=!0,s.add(re)}for(let J of[-14.5,0,14.5]){let Ge=[];for(let re=0;re<=24;re++){let ze=re/24,Le=o-60+ze*120,Me=this.world._deckY(Le),xe=1.4+Math.sin(ze*Math.PI)*.8;Ge.push(new ht(e+J,Me-xe,Le))}let We=new It(Ge),$e=Yt(new Jt(We,32,1.2,8,!1),.07,.24,Math.floor(J+50)),K=new r($e,n);K.castShadow=K.receiveShadow=!0,s.add(K)}let h=document.createElement("canvas");h.width=h.height=128;let g=h.getContext("2d"),C=g.createRadialGradient(64,64,0,64,64,64);C.addColorStop(0,"rgba(255, 235, 150, 1.0)"),C.addColorStop(.25,"rgba(255, 180, 50, 0.85)"),C.addColorStop(.6,"rgba(255, 130, 20, 0.35)"),C.addColorStop(1,"rgba(255, 100, 0, 0.0)"),g.fillStyle=C,g.fillRect(0,0,128,128);let w=new Kt(h),i=new _s({map:w,color:16765286,blending:Ht,transparent:!0,logarithmicDepthBuffer:!0,opacity:.95,depthWrite:!1}),_=new tt({color:16774876,emissive:16755236,emissiveIntensity:3.8,roughness:.15,metalness:.1}),S=new Ct({color:16775914}),W=[[e-15,o-56],[e+15,o-56],[e-15,o+56],[e+15,o+56]];for(let[J,Ge]of W){let Ie=this.world._deckY(Ge)||2,We=new je;We.position.set(J,Ie+2.5,Ge);let $e=new r(new L(1,1.4,2.4,8),n);$e.position.y=1.2,We.add($e);let K=new r(new L(.45,.55,4.8,8),f);K.position.y=4.4,We.add(K);let re=new r(new Vt(1.4,0),_);re.position.y=7.2,We.add(re);let ze=new r(new at(.65,8,8),S);ze.position.y=7.2,We.add(ze);let Le=new ns(i);Le.position.y=7.2,Le.scale.set(7.5,7.5,1),We.add(Le);let Me=new r(new lt(1.6,1.4,6),u);Me.position.y=8.4,We.add(Me),s.add(We)}let ae=[o-28,o,o+28];for(let J of ae){let Ge=this.world._deckY(J);for(let Ie of[-1,1]){let We=new je;We.position.set(e+Ie*15,Ge+3.8,J);let $e=new r(new Vt(.9,0),_);$e.position.y=.9,We.add($e);let K=new r(new at(.45,8,8),S);K.position.y=.9,We.add(K);let re=new ns(i);re.position.y=.9,re.scale.set(5,5,1),We.add(re),s.add(We)}}let p=this.world._deckY?this.world._deckY(o):14.8,E=ke(e+24,o),T=new je;T.position.set(e+24,p,o);let P=Math.max(.1,p-E),te=new r(new L(15.2,16.5,P,32),a);te.position.y=-P/2,te.castShadow=!0,te.receiveShadow=!0,T.add(te);let se=new r(new L(14,15.2,1.6,32),n);se.position.y=.8,se.receiveShadow=!0,T.add(se);let oe=new r(new L(12.6,13.4,1.2,32),n);oe.position.y=2.2,oe.receiveShadow=!0,T.add(oe);for(let J=0;J<8;J++){let Ge=new r(new ce(.35,.08,10.5),u);Ge.position.y=2.85,Ge.rotation.y=J*Math.PI/8,T.add(Ge)}let ne=new r(new L(2.2,2.2,.1,16),u);ne.position.y=2.86,T.add(ne);let k=8;for(let J=0;J<k;J++){let Ge=J/k*Math.PI*2,Ie=Math.cos(Ge)*10.5,We=Math.sin(Ge)*10.5,$e=new r(new L(.65,.8,8.5,16),n);$e.position.set(Ie,2.8+4.25,We),$e.castShadow=!0,T.add($e);let K=new r(new ce(2,.8,2),n);K.position.set(Ie,3.2,We),T.add(K);let re=new r(new ce(2.2,1,2.2),n);re.position.set(Ie,2.8+8.2,We),T.add(re);let ze=new r(new dt(1.1,.26,8,16),u);if(ze.rotation.x=Math.PI/2,ze.position.set(Ie,2.8+8.1,We),T.add(ze),J!==4){let Le=(J+1)/k*Math.PI*2,Me=(Ge+Le)/2,xe=Math.cos(Me)*10.5,he=Math.sin(Me)*10.5,Be=new r(new ce(3.6,.5,.8),n);Be.position.set(xe,5,he),Be.rotation.y=-Me+Math.PI/2,T.add(Be);for(let be=-1;be<=1;be++){let Je=xe+Math.cos(Me+Math.PI/2)*(be*.9),it=he+Math.sin(Me+Math.PI/2)*(be*.9),Et=new r(new L(.18,.24,1.5,8),c);Et.position.set(Je,3.8,it),T.add(Et)}}}let O=new r(new dt(10.5,.85,12,32),n);O.rotation.x=Math.PI/2,O.position.y=2.8+9,T.add(O);let ie=new r(new dt(10.6,.22,8,32),u);ie.rotation.x=Math.PI/2,ie.position.y=2.8+9.6,T.add(ie);let ve=new r(new at(10.4,32,24,0,Math.PI*2,0,Math.PI*.5),m);ve.position.y=2.8+9.2,T.add(ve);for(let J=0;J<8;J++){let Ge=J/8*Math.PI,Ie=new r(new dt(10.45,.18,8,24,Math.PI),u);Ie.rotation.y=Ge,Ie.position.y=2.8+9.2,T.add(Ie)}let De=new r(new no(1.8,0),u);De.position.y=2.8+20.2,T.add(De);for(let J=0;J<8;J++){let Ge=J/8*Math.PI*2,Ie=new r(new lt(.35,3.2,4),u);Ie.rotation.z=-Ge+Math.PI/2,Ie.position.set(Math.cos(Ge)*2.2,2.8+20.2+Math.sin(Ge)*.4,Math.sin(Ge)*2.2),T.add(Ie)}let Ue=new r(new L(3.6,4.2,1.8,24),u);Ue.position.y=3.7,Ue.castShadow=!0,T.add(Ue);let Ke=this._buildHuskyMesh();Ke.scale.setScalar(1.65),Ke.position.set(0,4.6,0),Ke.rotation.y=Math.PI*.92,T.add(Ke);let N=[16728193,16766287,16777215,16740419,12216520];for(let J=0;J<24;J++){let Ge=J/24*Math.PI*2,Ie=3.2+J%3*.35,We=new tt({color:N[J%N.length],roughness:.6,metalness:.05}),$e=new at(.3,8,6);$e.scale(1,.4,1);let K=new r($e,We);K.position.set(Math.cos(Ge)*Ie,4.62,Math.sin(Ge)*Ie),T.add(K)}let Te=new r(new at(3.4,32,28),m);Te.position.set(0,7.2,0),T.add(Te);let Ce=48,Pe=new gt,D=new Float32Array(Ce*3);for(let J=0;J<Ce;J++){let Ge=J/Ce*Math.PI*2,Ie=4.2+Math.sin(J*3.7)*.5;D[J*3]=Math.cos(Ge)*Ie,D[J*3+1]=7.2+Math.sin(Ge*2)*.8,D[J*3+2]=Math.sin(Ge)*Ie}Pe.setAttribute("position",new ct(D,3));let U=new Ss({color:6809849,size:.45,transparent:!0,logarithmicDepthBuffer:!0,opacity:.9,blending:Ht}),G=new co(Pe,U);T.add(G),this._kayaStardust=G;let A=new vo(7920890,3.8,140);A.position.set(0,7.5,0),T.add(A),s.add(T);let z=new je;z.position.set(e,2,o);for(let J=-24;J<=24;J+=4){let Ge=this._makeRainbowArc(95,145,.22*(1-Math.abs(J)/32),!1);Ge.position.z=J,z.add(Ge),this._rainbowShaders.push(Ge.material)}let F=[-75,-60,-45,-30,-15,15,30,45,60,75,90,-90];for(let J of F){let Ge=J*Math.PI/180,Ie=this._makeRainbowArc(95,145,.16*Math.cos(Ge*.4),!1);Ie.rotation.y=Ge,z.add(Ie),this._rainbowShaders.push(Ie.material)}let Q=[98,106,114,122,130,138,144];for(let J of Q){let Ge=this._createArchedRibbon(J,44,120,4),Ie=this._makeRainbowArc(95,145,.14,!1,Ge);z.add(Ie),this._rainbowShaders.push(Ie.material)}s.add(z);let ue=new je;ue.position.set(e,2,o-6);for(let J=-16;J<=16;J+=4){let Ge=this._makeRainbowArc(150,180,.08*(1-Math.abs(J)/22),!0);Ge.position.z=J,ue.add(Ge),this._rainbowShaders.push(Ge.material)}for(let J of[-60,-35,0,35,60,90]){let Ge=J*Math.PI/180,Ie=this._makeRainbowArc(150,180,.065,!0);Ie.rotation.y=Ge,ue.add(Ie),this._rainbowShaders.push(Ie.material)}for(let J of[158,172]){let Ge=this._createArchedRibbon(J,34,100,3),Ie=this._makeRainbowArc(150,180,.05,!0,Ge);ue.add(Ie),this._rainbowShaders.push(Ie.material)}s.add(ue);for(let J of[0,Math.PI*.25,Math.PI*.5]){let Ge=this._makeRainbowArc(85,155,.045,!1);Ge.position.set(e,2,o-.5),Ge.rotation.y=J,s.add(Ge),this._rainbowShaders.push(Ge.material)}let ge=240,we=new Float32Array(ge*3),_e=new Float32Array(ge*3),Ze=new Float32Array(ge),Oe=yt(882244),ot=new ye;for(let J=0;J<ge;J++){let Ie=Oe()*Math.PI,We=104+Oe()*28;we[J*3]=e+Math.cos(Ie)*We,we[J*3+1]=2+Math.sin(Ie)*We,we[J*3+2]=o+(Oe()-.5)*14,ot.setHSL(.12+Oe()*.12,.9,.8+Oe()*.2),_e[J*3]=ot.r,_e[J*3+1]=ot.g,_e[J*3+2]=ot.b,Ze[J]=(.4+Oe()*.6)*18}let vt=new gt;vt.setAttribute("position",new ct(we,3)),vt.setAttribute("color",new ct(_e,3)),vt.setAttribute("size",new ct(Ze,1));let At=new Mt({transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,fog:!1,blending:Ht,uniforms:{uTex:{value:this.world.lighting._starSprite()},uTime:{value:0},uOpacity:{value:.85}},vertexShader:`
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
      `,vertexColors:!0});this._stardustMat=At,s.add(new co(vt,At));let pt=140,Tt=new Float32Array(pt*3),xt=new Float32Array(pt*3),Pt=new Float32Array(pt),St=new Float32Array(pt),Gt=yt(551177),Nt=new ye;for(let J=0;J<pt;J++){let Ge=Gt()<.5?-1:1,Ie=(Gt()-.5)*104,We=o+Ie,$e=(this.world._deckY(We)||2)+3+Gt()*3.5,K=e+Ge*(14.5+Gt()*2.5);Tt[J*3]=K,Tt[J*3+1]=$e,Tt[J*3+2]=We,Nt.setHSL(.11+Gt()*.14,.85,.75+Gt()*.2),xt[J*3]=Nt.r,xt[J*3+1]=Nt.g,xt[J*3+2]=Nt.b,Pt[J]=Gt()*Math.PI*2,St[J]=.8+Gt()*1.4}let zt=new gt;zt.setAttribute("position",new ct(Tt,3)),zt.setAttribute("color",new ct(xt,3)),zt.setAttribute("aPhase",new ct(Pt,1)),zt.setAttribute("aSpeed",new ct(St,1));let Dt=new Mt({transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,fog:!1,blending:Ht,uniforms:{uTex:{value:this.world.lighting._starSprite()},uTime:{value:0},uOpacity:{value:.9}},vertexShader:`
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
      `,vertexColors:!0});this._balustradeMoteMat=Dt,s.add(new co(zt,Dt));let wo=new tt({color:16317439,emissive:1714230,emissiveIntensity:.75,roughness:.1,metalness:.08,transmission:.55,thickness:1.2,ior:1.52,iridescence:1,iridescenceIOR:1.62,iridescenceThicknessRange:[240,720],transparent:!0,opacity:.92,side:wt}),Z=[],Ee=[],de=10;for(let J of[-16.2,16.2])for(let Ge=0;Ge<de;Ge++){let Ie=(Ge+.05)/de,We=(Ge+.95)/de,$e=o-54+Ie*108,K=o-54+We*108,re=($e+K)*.5,ze=this.world._deckY(re),Le=j.waterLevel+1.2,Me=Math.max(2.5,ze-Le);for(let Je of[$e,K]){let it=new L(.38,.46,Me,8);it.translate(e+J,Le+Me*.5,Je),Z.push(it)}let xe=Math.abs(K-$e),he=xe*.52,Be=new dt(he,.3,6,12,Math.PI);Be.rotateY(Math.PI/2),Be.translate(e+J,ze-.8,re),Z.push(Be);let be=new rt(xe*.88,Me*.75);be.rotateY(Math.PI/2),be.translate(e+J,Le+Me*.45,re),Ee.push(be)}let Xe=ao(Z,!1);if(Xe){let J=new r(Xe,n);J.castShadow=J.receiveShadow=!0,J.frustumCulled=!1,s.add(J)}let et=ao(Ee,!1);if(et){let J=new r(et,wo);J.frustumCulled=!1,s.add(J)}let st=this._makeRainbowWaterReflection(e,o);s.add(st),s.traverse(J=>{J.frustumCulled=!1}),this.world.scene.add(s)}_rainbow(){return this._rainbowBridge()}_createArchedRibbon(e,o,s=120,n=4){let t=[],a=[],l=[];for(let c=0;c<=n;c++){let m=c/n,v=-o*.5+m*o;for(let R=0;R<=s;R++){let b=R/s,Y=b*Math.PI,x=e*Math.cos(Y),H=e*Math.sin(Y);t.push(x,H,v),a.push(b,m)}}let u=s+1;for(let c=0;c<n;c++)for(let m=0;m<s;m++){let v=c*u+m,R=(c+1)*u+m,b=(c+1)*u+(m+1),Y=c*u+(m+1);l.push(v,R,Y),l.push(R,b,Y)}let f=new gt;return f.setAttribute("position",new mt(t,3)),f.setAttribute("uv",new mt(a,2)),f.setIndex(l),f.computeVertexNormals(),f}_makeRainbowWaterReflection(e,o){let s=new rt(160,110,32,32);s.rotateX(-Math.PI/2);let n=new Mt({transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:wt,blending:Ht,fog:!1,uniforms:{uOpacity:{value:.65},uTime:{value:0}},vertexShader:`
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
      `});n.userData={baseOpacity:.65};let t=new r(s,n);return t.position.set(e,j.waterLevel+.08,o),t.frustumCulled=!1,this._rainbowWaterShader=n,this._rainbowShaders.push(n),t}_makeRainbowArc(e,o,s,n=!1,t=null){let a=t||new bo(e,o,160,12,0,Math.PI),l=new Mt({transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:wt,blending:Ht,fog:!1,uniforms:{uOpacity:{value:s},uTime:{value:0},uR0:{value:e},uR1:{value:o},uIsSecondary:{value:n?1:0}},vertexShader:`
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
      `});l.userData={baseOpacity:s};let u=new r(a,l);return u.frustumCulled=!1,u}_pawprints(){let e=this.world.assetLoader._pawTexture();this.pawMat=new tt({color:2235412,alphaMap:e,transparent:!0,logarithmicDepthBuffer:!0,opacity:.28,roughness:.98,metalness:0,depthWrite:!1,side:wt});let o=new rt(4.2,4.2),s=[];for(let a=850;a>60;a-=17)s.push(a);let n=new ut(o,this.pawMat,s.length),t=new Lt;s.forEach((a,l)=>{let u=(l%2?4.5:-4.5)+Math.sin(a*.02)*2,f=this.world._deckY(a),c=f!==null?f+1.3:Math.max(ke(u,a),j.waterLevel+.4)+.5;t.position.set(u,c,a),t.rotation.set(-Math.PI/2,0,Math.PI+(l%2?-.12:.12)),t.updateMatrix(),n.setMatrixAt(l,t.matrix)}),n.instanceMatrix.needsUpdate=!0,typeof n.computeBoundingSphere=="function"&&n.computeBoundingSphere(),typeof n.computeBoundingBox=="function"&&n.computeBoundingBox(),n.frustumCulled=!1,this.world.scene.add(n),console.log("[world3d] mesh added to scene",performance.now())}async _blooms(){let e=performance.now(),o=()=>performance.now()-e>16?(e=performance.now(),new Promise(H=>setTimeout(H,0))):Promise.resolve(),s=yt(104928),n=new Lt,t=[],a=[],l=[],u=[],f=[{x:-35,z:820,rad:34,count:850},{x:35,z:820,rad:34,count:850},{x:-32,z:640,rad:38,count:900},{x:32,z:640,rad:38,count:900},{x:-28,z:490,rad:32,count:750},{x:28,z:490,rad:32,count:750},{x:-30,z:360,rad:35,count:800},{x:30,z:360,rad:35,count:800},{x:-85,z:120,rad:45,count:1100},{x:85,z:120,rad:45,count:1100},{x:180,z:-140,rad:50,count:1200},{x:-240,z:320,rad:55,count:1300},{x:160,z:380,rad:50,count:1100},{x:-380,z:-120,rad:45,count:950},{x:-440,z:-380,rad:45,count:850}];for(let H of f)for(let y=0;y<H.count;y++){y%500===0&&await o();let q=s()*Math.PI*2,M=Math.sqrt(s())*H.rad,V=H.x+Math.cos(q)*M,$=H.z+Math.sin(q)*M,ee=ke(V,$);if(ee<13.2||ee>165||xo(V,$)<2||Math.hypot(V-j.plaza.x,$-j.plaza.z)<j.plaza.r+4)continue;let{dist:X,y:I}=Rn(V,$);if(X<42&&ee<I+1.2||ee<13.5&&V>50&&$<0||s()>.6)continue;let h=.35+s()*.25;n.position.set(V,ee,$),n.rotation.set(0,s()*Math.PI*2,0),n.scale.setScalar(h),n.updateMatrix();let g=s();g<.28?t.push(n.matrix.clone()):g<.54?a.push(n.matrix.clone()):g<.78?l.push(n.matrix.clone()):u.push(n.matrix.clone())}let c=(H,y,q)=>{if(!q.length)return;H.computeBoundingSphere&&H.computeBoundingSphere();let M=new ut(H,y,q.length);q.forEach((V,$)=>M.setMatrixAt($,V)),M.instanceMatrix.needsUpdate=!0,typeof M.computeBoundingSphere=="function"&&M.computeBoundingSphere(),typeof M.computeBoundingBox=="function"&&M.computeBoundingBox(),M.castShadow=!1,M.receiveShadow=!1,M.frustumCulled=!1,this.world.scene.add(M)},m=(()=>{let H=[];for(let y=0;y<3;y++){let q=y/3*Math.PI,M=new rt(1.2,1.3);M.translate(0,.65,0),M.rotateY(q),H.push(M)}return qe(H,!1)||H[0]})(),v=(()=>{let H=[];for(let y=0;y<3;y++){let q=y/3*Math.PI,M=new rt(.95,1.55);M.translate(0,.775,0),M.rotateY(q),H.push(M)}return qe(H,!1)||H[0]})(),R=pe.goldenPoppy();R.alphaTest=.5,R.depthWrite=!0,R.transparent=!1;let b=pe.edelweiss();b.alphaTest=.5,b.depthWrite=!0,b.transparent=!1;let Y=pe.lavenderSprig();Y.alphaTest=.5,Y.depthWrite=!0,Y.transparent=!1;let x=pe.forgetMeNot();x.alphaTest=.5,x.depthWrite=!0,x.transparent=!1,this.world._windMaterials&&this.world._windMaterials.push(R,b,Y,x),c(m,R,t),c(m,b,a),c(v,Y,l),c(m,x,u)}_buildVines(e,o,s,n,t,a){a||(a=pe.leafCard(3496480));let l=[];for(let c=0;c<t;c++){let m=Math.random()*Math.PI*2,v=(Math.random()-.5)*3,R=o+v,b=s+v,Y=Math.random()*n*(.2+.8*Math.random()),x=new rt(2.5,2.5),H=Math.cos(m)*R,y=Math.sin(m)*b;Math.abs(Math.cos(m))>Math.abs(Math.sin(m))?(H=Math.sign(Math.cos(m))*R,y=Math.sin(m)*b):(H=Math.cos(m)*R,y=Math.sign(Math.sin(m))*b),x.translate(H,Y,y),x.rotateX((Math.random()-.5)*.4),x.rotateY(m+Math.PI/2+(Math.random()-.5)*.4),x.rotateZ((Math.random()-.5)*.4),l.push(x)}let u=qe(l,!1)||l[0],f=new r(u,a);f.castShadow=!0,e.add(f)}_buildHuskyMesh(){let e=new je,o=new tt({color:3685960,roughness:.88,metalness:.02}),s=new tt({color:2369584,roughness:.85,metalness:.02}),n=new tt({color:16580093,roughness:.8,metalness:.01}),t=new tt({color:4900336,roughness:.1,metalness:.15,emissive:3188960,emissiveIntensity:.95}),a=new Ct({color:329224}),l=new tt({color:1184790,roughness:.35,metalness:.05}),u=new tt({color:14710920,roughness:.5,metalness:.02}),f=new tt({color:15250620,roughness:.9}),c=pe.gold(1),m=new je;m.position.set(0,1.38,0);let v=new L(.58,.74,1.95,16);v.rotateX(Math.PI/2),v.scale(.88,1.15,1);let R=new r(v,o);R.castShadow=!0,m.add(R);let b=new L(.48,.62,.95,14);b.rotateX(Math.PI/2),b.scale(.82,.95,1);let Y=new r(b,o);Y.position.set(0,.08,-.92),Y.castShadow=!0,m.add(Y);let x=new at(.66,16,14);x.scale(.84,1.18,1.25);let H=new r(x,n);H.position.set(0,-.06,.55),H.receiveShadow=!0,m.add(H);let y=new r(new L(.42,.54,1.6,12),n);y.rotateX(Math.PI/2),y.scale.set(.8,.65,1),y.position.set(0,-.32,-.15),m.add(y),e.add(m);let q=new je;q.position.set(0,1.95,.75);let M=new L(.36,.54,.95,14);M.rotateX(Math.PI/4.2),M.scale(.88,1.05,1);let V=new r(M,o);V.castShadow=!0,q.add(V);let $=new at(.48,14,12);$.scale(.82,1.15,1.25);let ee=new r($,n);ee.position.set(0,-.12,.32),q.add(ee),e.add(q);let X=new je;X.position.set(0,2.5,1.28);let I=new at(.46,16,14);I.scale(.92,.98,1.08);let h=new r(I,o);X.add(h);let g=new at(.44,14,10,0,Math.PI*2,0,Math.PI*.55);g.scale(.94,.96,1.04),g.translate(0,.04,.02);let C=new r(g,s);X.add(C);let w=new r(new at(.42,14,12),n);w.position.set(0,-.06,.16),w.scale.set(.88,.82,.98),X.add(w),[-.28,.28].forEach(ne=>{let k=new r(new lt(.24,.45,6),n);k.rotation.z=(ne>0?-1:1)*.75,k.rotation.x=-.2,k.position.set(ne,-.1,.18),X.add(k)});let i=new L(.16,.26,.56,12);i.rotateX(Math.PI/2),i.scale(.92,.85,1);let _=new r(i,n);_.position.set(0,-.1,.54),X.add(_);let S=new r(new ce(.12,.04,.48),s);S.position.set(0,.04,.54),X.add(S);let W=new r(new at(.082,10,8),l);W.scale.set(1.15,.85,1),W.position.set(0,-.04,.84),X.add(W);let ae=new r(new ce(.18,.06,.38),n);ae.position.set(0,-.21,.56),ae.rotation.x=.08,X.add(ae);let p=new r(new ce(.11,.025,.26),u);p.position.set(0,-.18,.65),p.rotation.x=.14,X.add(p),[-.17,.17].forEach(ne=>{let k=new r(new dt(.078,.016,6,12,Math.PI*1.2),l);k.rotation.z=(ne>0?-1:1)*.35+Math.PI*.9,k.position.set(ne,.11,.41),X.add(k);let O=new r(new at(.068,12,10),t);O.scale.set(.85,1.15,.85),O.position.set(ne,.1,.41),X.add(O);let ie=new r(new at(.032,8,6),a);ie.position.set(ne,.1,.46),X.add(ie)}),[-.25,.25].forEach(ne=>{let k=new je;k.position.set(ne,.4,-.04),k.rotation.z=(ne>0?-1:1)*.16,k.rotation.x=-.12;let O=new r(new lt(.2,.52,4),s);O.scale.set(.85,1,.42),k.add(O);let ie=new r(new lt(.14,.42,4),f);ie.scale.set(.75,.9,.32),ie.position.set(0,-.02,.035),k.add(ie);let ve=new r(new at(.08,6,6),n);ve.scale.set(.6,1.2,.4),ve.position.set(0,-.1,.06),k.add(ve),X.add(k)}),e.add(X);let E=new r(new dt(.44,.055,8,20),c);E.rotation.x=Math.PI/3.4,E.position.set(0,1.82,.92),e.add(E);let T=new je;T.position.set(0,1.55,1.18);let P=new r(new no(.14,0),pe.gold(1));P.scale.set(1,1.2,.35),T.add(P),e.add(T),[{x:-.3,z:.72,isFront:!0},{x:.3,z:.72,isFront:!0},{x:-.32,z:-.74,isFront:!1},{x:.32,z:-.74,isFront:!1}].forEach(ne=>{let k=new je;if(k.position.set(ne.x,0,ne.z),ne.isFront){let ie=new r(new at(.24,10,8),o);ie.scale.set(.85,1.2,1),ie.position.set(0,1.15,0),k.add(ie);let ve=new r(new L(.14,.11,.65,8),n);ve.position.set(0,.68,.02),k.add(ve);let De=new r(new L(.1,.095,.35,8),n);De.position.set(0,.28,.04),De.rotation.x=.12,k.add(De)}else{let ie=new r(new at(.32,12,10),o);ie.scale.set(.85,1.35,1.15),ie.position.set(0,1.12,-.05),k.add(ie);let ve=new r(new L(.14,.11,.65,8),n);ve.position.set(0,.65,-.08),ve.rotation.x=-.22,k.add(ve);let De=new r(new L(.1,.095,.38,8),n);De.position.set(0,.26,.02),k.add(De)}let O=new r(new at(.15,10,8),n);O.scale.set(.92,.55,1.28),O.position.set(0,.09,.1),O.castShadow=!0,k.add(O),e.add(k)});let se=new je;se.position.set(0,1.56,-1.02);let oe=9;for(let ne=0;ne<oe;ne++){let k=ne/(oe-1),O=k*Math.PI*.98,ie=Math.sin(O)*1.08,ve=-Math.cos(O)*.74,De=.28*(1-k*.35)+.08,Ue=new r(new at(De,10,8),k>.55?n:o);Ue.scale.set(.82,1.15,1.15),Ue.position.set(0,ie,ve),se.add(Ue)}return e.add(se),e}_buildKoiMesh(){let e=[],o=(p,E,T,P)=>{let te=p.attributes.position.count,se=new Float32Array(te*3);for(let oe=0;oe<te;oe++)se[oe*3]=E,se[oe*3+1]=T,se[oe*3+2]=P;return p.setAttribute("color",new ct(se,3)),p},t=[],a=[],l=[];for(let p=0;p<=36;p++){let E=p/36,T=1.15-2.4*E,P,te,se;if(E<.22){let oe=E/.22;P=.27*Math.pow(Math.sin(oe*Math.PI*.5),.62),te=.31*Math.pow(Math.sin(oe*Math.PI*.5),.72),se=-.035*(1-oe)}else if(E<.52){let oe=(E-.22)/.3,ne=Math.sin(oe*Math.PI);P=.27+.11*ne,te=.31+.14*ne,se=-.035*(1-oe*.5)-.03*ne}else{let oe=(E-.52)/.48,ne=Math.pow(oe,.9);P=(1-ne)*.27+ne*.045,te=(1-ne)*.31+ne*.085,se=(1-oe)*-.017+oe*0}for(let oe=0;oe<=24;oe++){let ne=oe/24*Math.PI*2,k=Math.sin(ne),O=Math.cos(ne),ie=P*k,ve=se+te*(O-.06*k*k);t.push(ie,ve,T),a.push(oe/24,E)}}for(let p=0;p<36;p++)for(let E=0;E<24;E++){let T=p*25+E,P=(p+1)*25+E,te=(p+1)*25+(E+1),se=p*25+(E+1);l.push(T,P,se),l.push(P,te,se)}let u=new gt;u.setAttribute("position",new mt(t,3)),u.setAttribute("uv",new mt(a,2)),u.setIndex(l),u.computeVertexNormals(),o(u,1,1,1),e.push(u);let f=16,c=12,m=[],v=[],R=[];for(let p=0;p<=f;p++){let E=p/f;for(let T=0;T<=c;T++){let P=T/c*2-1,te=Math.abs(P),se=.33*Math.pow(te,1.4),oe=-1.22-E*(.42+se),ne=.08+E*(.38+.08*(P>0?.05:0)),k=P*ne;m.push(0,k,oe),v.push(E,(P+1)*.5)}}for(let p=0;p<f;p++)for(let E=0;E<c;E++){let T=p*(c+1)+E,P=(p+1)*(c+1)+E,te=(p+1)*(c+1)+(E+1),se=p*(c+1)+(E+1);R.push(T,P,se),R.push(P,te,se),R.push(se,P,T),R.push(se,te,P)}let b=new gt;b.setAttribute("position",new mt(m,3)),b.setAttribute("uv",new mt(v,2)),b.setIndex(R),b.computeVertexNormals(),o(b,.45,.7,.95),e.push(b);let Y=14,x=6,H=[],y=[],q=[];for(let p=0;p<=Y;p++){let E=p/Y,T=.35-E*.9,P=.28+(T>0?.08:(T+.2)*.1),te=Math.sin(Math.pow(E,.45)*Math.PI)*.24+(1-E)*.06;for(let se=0;se<=x;se++){let oe=se/x,ne=P+oe*te,k=(1-oe)*.015*Math.sin(E*Math.PI);H.push(k,ne,T),y.push(E,oe)}}for(let p=0;p<Y;p++)for(let E=0;E<x;E++){let T=p*(x+1)+E,P=(p+1)*(x+1)+E,te=(p+1)*(x+1)+(E+1),se=p*(x+1)+(E+1);q.push(T,P,se),q.push(P,te,se),q.push(se,P,T),q.push(se,te,P)}let M=new gt;M.setAttribute("position",new mt(H,3)),M.setAttribute("uv",new mt(y,2)),M.setIndex(q),M.computeVertexNormals(),o(M,.45,.7,.95),e.push(M);let V=p=>{let P=[],te=[],se=[],oe=p?-1:1;for(let k=0;k<=10;k++){let O=k/10;for(let ie=0;ie<=6;ie++){let ve=ie/6,De=O*.48,Ue=O*.32+ve*.15,Ke=O*.16+(ve-.5)*.05,N=oe*(.28+De*Math.cos(.4)+(ve-.5)*.12),Te=-.16-Ke,Ce=.52-Ue;P.push(N,Te,Ce),te.push(O,ve)}}for(let k=0;k<10;k++)for(let O=0;O<6;O++){let ie=k*7+O,ve=(k+1)*7+O,De=(k+1)*7+(O+1),Ue=k*7+(O+1);se.push(ie,ve,Ue),se.push(ve,De,Ue),se.push(Ue,ve,ie),se.push(Ue,De,ve)}let ne=new gt;return ne.setAttribute("position",new mt(P,3)),ne.setAttribute("uv",new mt(te,2)),ne.setIndex(se),ne.computeVertexNormals(),o(ne,.45,.7,.95),ne};e.push(V(!0),V(!1));let $=p=>{let P=[],te=[],se=[],oe=p?-1:1;for(let k=0;k<=8;k++){let O=k/8;for(let ie=0;ie<=4;ie++){let ve=ie/4,De=oe*(.12+O*.14+(ve-.5)*.05),Ue=-.36-O*.12,Ke=-.15-O*.28-ve*.08;P.push(De,Ue,Ke),te.push(O,ve)}}for(let k=0;k<8;k++)for(let O=0;O<4;O++){let ie=k*5+O,ve=(k+1)*5+O,De=(k+1)*5+(O+1),Ue=k*5+(O+1);se.push(ie,ve,Ue),se.push(ve,De,Ue),se.push(Ue,ve,ie),se.push(Ue,De,ve)}let ne=new gt;return ne.setAttribute("position",new mt(P,3)),ne.setAttribute("uv",new mt(te,2)),ne.setIndex(se),ne.computeVertexNormals(),o(ne,.45,.7,.95),ne};e.push($(!0),$(!1));let ee=8,X=4,I=[],h=[],g=[];for(let p=0;p<=ee;p++){let E=p/ee,T=-.65-E*.4,P=-.18-(1-E)*.06,te=Math.sin(E*Math.PI)*.16;for(let se=0;se<=X;se++){let oe=se/X,ne=P-oe*te;I.push(0,ne,T),h.push(E,oe)}}for(let p=0;p<ee;p++)for(let E=0;E<X;E++){let T=p*(X+1)+E,P=(p+1)*(X+1)+E,te=(p+1)*(X+1)+(E+1),se=p*(X+1)+(E+1);g.push(T,P,se),g.push(P,te,se),g.push(se,P,T),g.push(se,te,P)}let C=new gt;C.setAttribute("position",new mt(I,3)),C.setAttribute("uv",new mt(h,2)),C.setIndex(g),C.computeVertexNormals(),o(C,.45,.7,.95),e.push(C);let w=p=>{let T=[],P=[],te=[],se=p?-1:1;for(let ne=0;ne<=8;ne++){let k=ne/8,O=se*(.16+k*.08+Math.sin(k*Math.PI)*.03),ie=-.1-k*.14-Math.sin(k*Math.PI*.5)*.04,ve=1.02-k*.26,De=(1-k*.75)*.012;for(let Ue=0;Ue<=4;Ue++){let Ke=Ue/4*Math.PI*2;T.push(O+Math.cos(Ke)*De,ie+Math.sin(Ke)*De,ve),P.push(k,Ue/4)}}for(let ne=0;ne<8;ne++)for(let k=0;k<4;k++){let O=ne*5+k,ie=(ne+1)*5+k,ve=(ne+1)*5+(k+1),De=ne*5+(k+1);te.push(O,ie,De),te.push(ie,ve,De)}let oe=new gt;return oe.setAttribute("position",new mt(T,3)),oe.setAttribute("uv",new mt(P,2)),oe.setIndex(te),oe.computeVertexNormals(),o(oe,.45,.7,.95),oe};e.push(w(!0),w(!1));let i=new at(.065,12,12);i.scale(.85,1,1.15);let _=i.clone();_.rotateY(-.25),_.translate(-.24,.1,.76),o(_,0,0,0);let S=i.clone();S.rotateY(.25),S.translate(.24,.1,.76),o(S,0,0,0),e.push(_,S);let W=p=>{let T=[],P=[],te=[],se=p?-1:1;for(let ne=0;ne<=10;ne++){let k=ne/10,O=(k-.5)*Math.PI*.75,ie=Math.sin(O)*.22-.02,ve=.58+Math.cos(O)*.1,De=se*(.285+Math.cos(O)*.02);T.push(De,ie,ve),P.push(0,k),T.push(De*.98,ie,ve-.05),P.push(1,k)}for(let ne=0;ne<10;ne++){let k=ne*2,O=(ne+1)*2,ie=(ne+1)*2+1,ve=ne*2+1;te.push(k,O,ve),te.push(O,ie,ve),te.push(ve,O,k),te.push(ve,ie,O)}let oe=new gt;return oe.setAttribute("position",new mt(T,3)),oe.setAttribute("uv",new mt(P,2)),oe.setIndex(te),oe.computeVertexNormals(),o(oe,1,1,1),oe};return e.push(W(!0),W(!1)),qe(e,!1)||u}_buildReefFishMesh(){let e=[],o=(_,S,W,ae)=>{let p=_.attributes.position.count,E=new Float32Array(p*3);for(let T=0;T<p;T++)E[T*3]=S,E[T*3+1]=W,E[T*3+2]=ae;return _.setAttribute("color",new ct(E,3)),_},t=[],a=[],l=[];for(let _=0;_<=28;_++){let S=_/28,W=.65-1.4*S,ae,p,E;if(S<.25){let T=S/.25;ae=.16*Math.pow(Math.sin(T*Math.PI*.5),.7),p=.38*Math.pow(Math.sin(T*Math.PI*.5),.6),E=-.02*(1-T)}else if(S<.65){let T=(S-.25)/.4,P=Math.sin(T*Math.PI);ae=.16+.06*P,p=.38+.18*P,E=-.02}else{let T=(S-.65)/.35,P=Math.pow(T,.85);ae=(1-P)*.16+P*.025,p=(1-P)*.38+P*.055,E=(1-T)*-.02}for(let T=0;T<=20;T++){let P=T/20*Math.PI*2,te=Math.sin(P),se=Math.cos(P),oe=ae*te,ne=E+p*se;t.push(oe,ne,W),a.push(T/20,S)}}for(let _=0;_<28;_++)for(let S=0;S<20;S++){let W=_*21+S,ae=(_+1)*21+S,p=(_+1)*21+(S+1),E=_*21+(S+1);l.push(W,ae,E),l.push(ae,p,E)}let u=new gt;u.setAttribute("position",new mt(t,3)),u.setAttribute("uv",new mt(a,2)),u.setIndex(l),u.computeVertexNormals(),o(u,1,1,1),e.push(u);let f=10,c=8,m=[],v=[],R=[];for(let _=0;_<=f;_++){let S=_/f;for(let W=0;W<=c;W++){let ae=W/c*2-1,p=-.74-S*.4,E=ae*(.06+S*.28);m.push(0,E,p),v.push(S,(ae+1)*.5)}}for(let _=0;_<f;_++)for(let S=0;S<c;S++){let W=_*(c+1)+S,ae=(_+1)*(c+1)+S,p=(_+1)*(c+1)+(S+1),E=_*(c+1)+(S+1);R.push(W,ae,E,ae,p,E,E,ae,W,E,p,ae)}let b=new gt;b.setAttribute("position",new mt(m,3)),b.setAttribute("uv",new mt(v,2)),b.setIndex(R),b.computeVertexNormals(),o(b,.45,.7,.95),e.push(b);let Y=10,x=4,H=[],y=[],q=[];for(let _=0;_<=Y;_++){let S=_/Y,W=.25-S*.85,ae=.45*Math.sin(Math.PI*(.15+S*.75)),p=.16*Math.sin(S*Math.PI)+(1-S)*.06;for(let E=0;E<=x;E++){let T=E/x;H.push(0,ae+T*p,W),y.push(S,T)}}for(let _=0;_<Y;_++)for(let S=0;S<x;S++){let W=_*(x+1)+S,ae=(_+1)*(x+1)+S,p=(_+1)*(x+1)+(S+1),E=_*(x+1)+(S+1);q.push(W,ae,E,ae,p,E,E,ae,W,E,p,ae)}let M=new gt;M.setAttribute("position",new mt(H,3)),M.setAttribute("uv",new mt(y,2)),M.setIndex(q),M.computeVertexNormals(),o(M,.45,.7,.95),e.push(M);let V=10,$=4,ee=[],X=[],I=[];for(let _=0;_<=V;_++){let S=_/V,W=.15-S*.75,ae=-.45*Math.sin(Math.PI*(.15+S*.75)),p=.14*Math.sin(S*Math.PI);for(let E=0;E<=$;E++){let T=E/$;ee.push(0,ae-T*p,W),X.push(S,T)}}for(let _=0;_<V;_++)for(let S=0;S<$;S++){let W=_*($+1)+S,ae=(_+1)*($+1)+S,p=(_+1)*($+1)+(S+1),E=_*($+1)+(S+1);I.push(W,ae,E,ae,p,E,E,ae,W,E,p,ae)}let h=new gt;h.setAttribute("position",new mt(ee,3)),h.setAttribute("uv",new mt(X,2)),h.setIndex(I),h.computeVertexNormals(),o(h,.45,.7,.95),e.push(h);let g=new at(.048,10,10);g.scale(.8,1,1.1);let C=g.clone();C.translate(-.14,.08,.42),o(C,0,0,0);let w=g.clone();return w.translate(.14,.08,.42),o(w,0,0,0),e.push(C,w),qe(e,!1)||u}_buildDolphinMesh(){let e=[],o=new L(.01,.55,3.2,28,24,!1);o.rotateX(Math.PI/2);let s=o.attributes.position;for(let c=0;c<s.count;c++){let v=(s.getZ(c)+1.6)/3.2,R,b;if(v>.88){let Y=(v-.88)/.12;R=.22*Math.sin(Y*Math.PI*.5),b=.18*Math.sin(Y*Math.PI*.5)}else if(v>.7){let Y=(v-.7)/.18;R=.22+.65*Math.sin(Y*Math.PI*.5),b=.18+.82*Math.sin(Y*Math.PI*.5)}else if(v>.25){let Y=(v-.25)/.45;R=.45+.42*Math.sin(Y*Math.PI),b=.5+.5*Math.sin(Y*Math.PI)}else{let Y=v/.25;R=.12+.33*Y,b=.16+.34*Y}s.setX(c,s.getX(c)*R),s.setY(c,s.getY(c)*b)}o.computeVertexNormals(),e.push(o);let n=new mo;n.moveTo(0,0),n.bezierCurveTo(-.05,.25,-.18,.52,-.42,.58),n.bezierCurveTo(-.32,.32,-.22,.12,0,0);let t=new Eo(n,{depth:.04,bevelEnabled:!0,bevelThickness:.02,bevelSize:.02,steps:1});t.rotateY(Math.PI/2),t.translate(0,.48,-.2),e.push(t),[-1,1].forEach(c=>{let m=new mo;m.moveTo(0,0),m.bezierCurveTo(.15,-.15,.55,-.42,.78,-.65),m.bezierCurveTo(.55,-.52,.25,-.32,0,0);let v=new Eo(m,{depth:.03,bevelEnabled:!1});v.rotateZ(c*.35),v.rotateY(c*.45),v.translate(c*.42,-.22,.45),e.push(v)});let a=new mo;a.moveTo(0,0),a.bezierCurveTo(.35,-.15,.72,-.35,.95,-.48),a.bezierCurveTo(.65,-.28,.28,-.05,0,-.12),a.bezierCurveTo(-.28,-.05,-.65,-.28,-.95,-.48),a.bezierCurveTo(-.72,-.35,-.35,-.15,0,0);let l=new Eo(a,{depth:.03,bevelEnabled:!1});l.rotateX(Math.PI/2),l.translate(0,0,-1.6),e.push(l),[-1,1].forEach(c=>{let m=new at(.045,8,8);m.translate(c*.32,.12,.95),e.push(m)});let u=(c,m)=>{let v=c.attributes.position.count,R=new Float32Array(v*3);for(let b=0;b<v;b++)R[b*3]=m?0:1,R[b*3+1]=m?0:1,R[b*3+2]=m?0:1;if(c.setAttribute("color",new ct(R,3)),c.attributes.normal||c.computeVertexNormals(),!c.attributes.uv){let b=new Float32Array(v*2);c.setAttribute("uv",new ct(b,2))}};return e.forEach((c,m)=>u(c,m>=5)),qe(e,!1)||o}_buildSharkMesh(){let e=[],o=new L(.01,.58,3.6,28,24,!1);o.rotateX(Math.PI/2);let s=o.attributes.position;for(let m=0;m<s.count;m++){let R=(s.getZ(m)+1.8)/3.6,b,Y;if(R>.75){let x=(R-.75)/.25;b=.85*Math.pow(x,.65),Y=.65*Math.pow(x,.8)}else if(R>.28){let x=(R-.28)/.47;b=.55+.35*Math.sin(x*Math.PI),Y=.52+.4*Math.sin(x*Math.PI)}else{let x=R/.28;b=.14+.41*x,Y=.16+.36*x}s.setX(m,s.getX(m)*b),s.setY(m,s.getY(m)*Y)}o.computeVertexNormals(),e.push(o);let n=new mo;n.moveTo(0,0),n.lineTo(-.25,.75),n.bezierCurveTo(-.35,.55,-.45,.25,-.55,.05),n.lineTo(0,0);let t=new Eo(n,{depth:.05,bevelEnabled:!0,bevelThickness:.02,bevelSize:.02,steps:1});t.rotateY(Math.PI/2),t.translate(0,.52,.05),e.push(t),[-1,1].forEach(m=>{let v=new mo;v.moveTo(0,0),v.lineTo(m*.95,-.75),v.bezierCurveTo(m*.65,-.62,m*.35,-.38,0,0);let R=new Eo(v,{depth:.03,bevelEnabled:!1});R.rotateX(.15),R.translate(0,-.18,.55),e.push(R)});let a=new mo;a.moveTo(0,0),a.lineTo(-.85,.85),a.bezierCurveTo(-.72,.45,-.45,.15,-.32,0),a.lineTo(-.55,-.45),a.bezierCurveTo(-.38,-.28,-.18,-.12,0,0);let l=new Eo(a,{depth:.04,bevelEnabled:!1});l.rotateY(-Math.PI/2),l.translate(0,0,-1.8),e.push(l);let u=t.clone();u.scale(.35,.35,.35),u.translate(0,-.32,-1.05),e.push(u),[-1,1].forEach(m=>{let v=new at(.045,8,8);v.translate(m*.35,.08,1.15),e.push(v)});let f=(m,v)=>{let R=m.attributes.position.count,b=new Float32Array(R*3);for(let Y=0;Y<R;Y++)b[Y*3]=v?0:1,b[Y*3+1]=v?0:1,b[Y*3+2]=v?0:1;if(m.setAttribute("color",new ct(b,3)),m.attributes.normal||m.computeVertexNormals(),!m.attributes.uv){let Y=new Float32Array(R*2);m.setAttribute("uv",new ct(Y,2))}};return e.forEach((m,v)=>f(m,v>=6)),qe(e,!1)||o}_buildSeaTurtleMesh(){let e=[],o=new at(.6,16,12);o.scale(1,.4,1.2),e.push(o);let s=new at(.2,8,8);s.scale(1,.6,1.2),s.translate(0,0,.8),e.push(s);let n=new ce(.8,.05,.3);n.translate(-.8,0,.4);let t=n.clone();return t.translate(1.6,0,0),e.push(n,t),qe(e,!1)||e[0]||o}_buildMantaRayMesh(){let e=[],o=new L(0,1.2,1.2,4);o.rotateY(Math.PI/4),o.scale(2.5,.1,1.2),e.push(o);let s=new L(.02,.02,2.5);return s.rotateX(Math.PI/2),s.translate(0,0,-1.8),e.push(s),qe(e,!1)||e[0]||o}_buildBronzeBull(){let e=new je,o=pe.bronze(1.2),s=pe.gold(1),n=new L(.9,1.05,3.2,14);n.rotateX(Math.PI/2);let t=new r(n,o);t.position.y=1.45,t.castShadow=!0,e.add(t);let a=new at(1.15,14,12);a.scale(.92,1.15,1.35);let l=new r(a,o);l.position.set(0,1.7,1.05),l.castShadow=!0,e.add(l);let u=new lt(.65,1.3,12);u.rotateX(Math.PI/3.2);let f=new r(u,o);f.position.set(0,2.05,2),f.castShadow=!0,e.add(f);for(let y of[-1,1]){let q=[new B(y*.38,2.25,1.95),new B(y*.95,2.85,1.85),new B(y*1.05,3.45,2.15)],M=new It(q),V=new Jt(M,12,.16,8,!1),$=new r(V,s);$.castShadow=!0,e.add($)}let c=new L(.42,.42,.08,16);c.rotateX(Math.PI/2);let m=new r(c,s);m.position.set(0,2.95,1.95),m.castShadow=!0,e.add(m);let v=new L(.24,.32,1.45,8);[[-.6,.72,.95],[.6,.72,.95],[-.6,.72,-.95],[.6,.72,-.95]].forEach(y=>{let q=new r(v,o);q.position.set(y[0],y[1],y[2]),q.castShadow=!0,e.add(q)});let b=[new B(0,1.45,-1.6),new B(.05,.95,-1.8),new B(-.05,.45,-1.7)],Y=new It(b),x=new Jt(Y,10,.08,6,!1),H=new r(x,o);return e.add(H),e}_buildBaalIdol(){let e=new je,o=pe.gold(1),s=pe.bronze(1.2),n=pe.agedCaenLimestone(2),t=[],a=[],l=[],u=new L(2.4,2.8,.6,24);u.translate(0,.3,0),l.push(u);let f=new L(2,2.4,.6,24);f.translate(0,.9,0),l.push(f);let c=new L(1.6,2,.6,24);c.translate(0,1.5,0),l.push(c);let m=new L(.7,1.25,2.8,16);m.translate(0,3.2,0),t.push(m);let v=new dt(.75,.1,8,16);v.rotateX(Math.PI/2),v.translate(0,4.5,0),a.push(v);let R=new L(.95,.7,2.2,16);R.translate(0,5.7,0),a.push(R);let b=new at(.4,12,10);b.translate(-1,6.4,0),a.push(b);let Y=new at(.4,12,10);Y.translate(1,6.4,0),a.push(Y);let x=new at(.55,16,12);x.translate(0,7.2,0),a.push(x);let H=new lt(.3,.8,8);H.translate(0,6.8,.3),t.push(H);let y=new lt(.55,1.5,12);y.translate(0,8.2,0),a.push(y);for(let I of[-1,1]){let h=new It([new B(I*.4,7.7,0),new B(I*.9,8.2,.1),new B(I*.8,8.8,.2)]),g=new Jt(h,10,.12,8,!1);a.push(g)}let q=new L(.2,.25,2,10);q.rotateZ(-.65),q.rotateX(-.45),q.translate(1.2,6.5,.2),a.push(q);let M=new L(.1,.1,5,10);M.rotateX(Math.PI/4),M.translate(2,7.8,.8),a.push(M);for(let I of[-.5,0,.5]){let h=new lt(.15,1,8);h.rotateX(Math.PI/4),h.translate(2+I,9.8,.8+I*.25),a.push(h)}let V=new L(.2,.25,1.8,10);V.rotateX(Math.PI/3),V.translate(-1.2,5.8,.5),a.push(V);let $=new L(.12,.12,3.5,10);$.translate(-1.3,5.4,1.4),t.push($);let ee=new at(.3,12,10);ee.translate(-1.3,7.15,1.4),a.push(ee);let X=new dt(1.3,.1,10,30);if(X.translate(0,7.3,-.4),a.push(X),l.length>0){let I=qe(l,!1);if(I){let h=new r(I,n);h.castShadow=!0,h.receiveShadow=!0,e.add(h)}}if(t.length>0){let I=qe(t,!1);if(I){let h=new r(I,s);h.castShadow=!0,h.receiveShadow=!0,e.add(h)}}if(a.length>0){let I=qe(a,!1);if(I){let h=new r(I,o);h.castShadow=!0,h.receiveShadow=!0,e.add(h)}}return e}_buildWingedSunDisc(){let e=new je,o=pe.gold(1),s=pe.bronze(1.2),n=new r(new at(1.2,16,12),o);n.scale.set(1,1,.35),e.add(n);for(let t of[-1,1]){let a=new mo;a.moveTo(0,0),a.quadraticCurveTo(t*2.5,1.2,t*5.2,.4),a.quadraticCurveTo(t*3.8,-.6,t*1.8,-.8),a.quadraticCurveTo(t*.8,-.4,0,0);let l=new Eo(a,{depth:.3,bevelEnabled:!1}),u=new r(l,o);u.position.set(t*.6,0,-.15),e.add(u)}for(let t of[-1,1]){let a=new It([new B(t*.5,.9,0),new B(t*.9,1.6,.1),new B(t*.6,2.1,.15)]),l=new r(new Jt(a,8,.09,6,!1),s);e.add(l)}return e}_createPhysicalWaterMaterial(e,o="lake"){let s=null;try{let t=e?.normalMap||e?.normal||e;s=t&&typeof t.clone=="function"?t.clone():t}catch{s=e}s&&s.wrapS!==void 0&&(s.wrapS=s.wrapT=qo);let n=new tt({color:o==="ocean"?673888:o==="river"?1333364:1596024,roughness:.08,metalness:.05,transparent:!0,logarithmicDepthBuffer:!0,opacity:o==="ocean"?.9:.82,normalMap:s||null,normalScale:new kt(1.1,1.1),envMapIntensity:2.4,depthWrite:!1,side:wt});return n.onBeforeCompile=function(t){t.uniforms.uTime={value:0},this.userData.shader=t,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
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
    `;return new Mt({vertexShader:s,fragmentShader:n,uniforms:{normalSampler:{value:o},uDeepWater:{value:new ye(537156)},uMidWater:{value:new ye(1068652)},uSunWater:{value:new ye(3717344)},uFoamColor:{value:new ye(16317695)},waterColor:{value:new ye(537156)},uDeepColor:{value:new ye(537156)},uGlacierColor:{value:new ye(3717344)},sunColor:{value:new ye(16772829)},uSunColor:{value:new ye(16772829)},sunDirection:{value:new B(.4,.8,.5).normalize()},uSunDir:{value:new B(.4,.8,.5).normalize()},uTime:{value:0},uLength:{value:20}},transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:wt})}_createWaterPoolMaterial(e){let o=(e.normalMap||e.normal||e).clone();o.wrapS=o.wrapT=qo;let s=`
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
    `;return new Mt({vertexShader:s,fragmentShader:n,uniforms:{normalSampler:{value:o},uDeepWater:{value:new ye(537156)},uMidWater:{value:new ye(1068652)},uSunWater:{value:new ye(3717344)},uFoamColor:{value:new ye(16317695)},waterColor:{value:new ye(537156)},uDeepColor:{value:new ye(537156)},uGlacierColor:{value:new ye(3717344)},sunColor:{value:new ye(16772829)},uSunColor:{value:new ye(16772829)},sunDirection:{value:new B(.4,.8,.5).normalize()},uSunDir:{value:new B(.4,.8,.5).normalize()},uTime:{value:0}},transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:wt})}_createFountainBasinMaterial(e){let o=(e.normalMap||e.normal||e).clone();o.wrapS=o.wrapT=qo;let s=`
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
    `;return new Mt({vertexShader:s,fragmentShader:n,uniforms:{normalSampler:{value:o},uDeepWater:{value:new ye(537156)},uMidWater:{value:new ye(1068652)},uSunWater:{value:new ye(3717344)},uFoamColor:{value:new ye(16317695)},waterColor:{value:new ye(537156)},sunColor:{value:new ye(16772829)},uSunColor:{value:new ye(16772829)},sunDirection:{value:new B(.4,.8,.5).normalize()},uSunDir:{value:new B(.4,.8,.5).normalize()},uTime:{value:0}},transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:wt})}_createFountainCascadeMaterial(e){let o={transparent:!0,logarithmicDepthBuffer:!0,depthWrite:!1,side:wt,blending:Os,uniforms:{uTime:{value:0},uDeepWater:{value:new ye(537156)},uMidWater:{value:new ye(1068652)},uSunWater:{value:new ye(3717344)},uFoamColor:{value:new ye(16317695)},uDeepColor:{value:new ye(537156)},uGlacierColor:{value:new ye(3717344)},uSunDir:{value:new B(.4,.8,.5).normalize()},uSunColor:{value:new ye(16772829)}},vertexShader:`
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
      `};return new Mt(o)}_riverLanterns3D(){this._lanterns=[];let e=new tt({color:16770728,emissive:new ye(16750884),emissiveIntensity:1.8,roughness:.28,metalness:.05});this._lanternMat=e;let o=new L(1.6,1.2,1.6,6),s=36,n=new ut(o,e,s);n.instanceMatrix.setUsage(Nn),this.world.scene.add(n);for(let t=0;t<s;t++){let a=t>=12,l=a?(t-12)/24:t/12,u=new Lt;u.userData={isOutlet:a,progress:l,speed:.008+t%5*.002,bobPhase:t*.7};let f=u.position.set.bind(u.position);u.position.set=(m,v,R)=>{f(m,v,R),u.updateMatrix(),n.setMatrixAt(t,u.matrix),n.instanceMatrix.needsUpdate=!0};let c=0;Object.defineProperty(u.rotation,"y",{get:()=>c,set:m=>{c=m,u.rotation.set(u.rotation.x,m,u.rotation.z),u.updateMatrix(),n.setMatrixAt(t,u.matrix),n.instanceMatrix.needsUpdate=!0}}),this._lanterns.push(u)}}async _generateProceduralPlots(){let e=performance.now(),o=()=>performance.now()-e>16?(e=performance.now(),new Promise(x=>setTimeout(x,0))):Promise.resolve();this.world.plots||(this.world.plots=[]);let s=new Set(this.world.plots.map(x=>x.id)),n=0,t=(x,H,y,q,M,V,$="standard",ee=1)=>s.has(x)?!1:(this.world.plots.push({id:x,x:H,z:y,rot:q,type:M,name:V,size:$,tier:ee,status:"available",h:ke(H,y)}),s.add(x),n++,!0),a=(x,H,y=14)=>{if(xo(x,H)<y+4||Xo(x,H)<y+2||Math.hypot(x-j.lake.x,H-j.lake.z)<j.lake.r+y+4||ke(x,H)>120)return!1;for(let M of this.world.plots)if(Math.hypot(x-M.x,H-M.z)<y+4)return!1;return!0},l=0;for(let x=300;x<1400;x+=24){await o();let H=2*Math.PI*x,y=Math.floor(H/24);for(let q=0;q<y;q++){let M=q/y*Math.PI*2,V=Math.cos(M)*x,$=Math.sin(M)*x,ee=jt(V*.003,$*.003,3),X=jt(V*.015,$*.015,2);ee*.7+X*.3>.1&&a(V,$)&&ke(V,$)>3&&(t(`FOREST_${l}`,V,$,M,"forest",`Forest Glade ${l}`,"standard",1),l++)}}let u=0;for(let x=-800;x<800;x+=36){await o();for(let H=-800;H<800;H+=36)ke(x,H)<-2&&a(x,H)&&(t(`UNDERWATER_${u}`,x,H,0,"underwater",`Abyssal Plot ${u}`,"premium",2),u++)}let f=0,c=20,m=2100;for(let x=30;x<150;x+=16){let H=2*Math.PI*x,y=Math.floor(H/16);for(let q=0;q<y;q++){let M=q/y*Math.PI*2,V=c+Math.cos(M)*x,$=m+Math.sin(M)*x;ke(V,$)>0&&a(V,$)&&(t(`KAYA_${f}`,V,$,M,"kaya",`Kaya Island ${f}`,"estate",3),f++)}}let v=[],R=0,b=[{cx:650,cz:-650,name:"East Meadow"},{cx:-550,cz:-150,name:"West Valley"},{cx:350,cz:900,name:"South Garden"},{cx:-400,cz:-1e3,name:"North Highlands"}];for(let x of b)for(let H=20;H<350;H+=16){await o();let y=Math.floor(2*Math.PI*H/14);for(let q=0;q<y;q++){let M=q/y*Math.PI*2+Math.random()*.5,V=x.cx+Math.cos(M)*H,$=x.cz+Math.sin(M)*H;if(jt(V*.008,$*.008,2)>.45&&a(V,$)){let ee=`MEMORIAL_${R}`;!s.has(ee)&&t(ee,V,$,M+Math.PI,"cemetery",`${x.name} Memorial ${R}`,"standard",1),v.push({x:V,z:$,rot:M+Math.PI}),R++}}}if(v.length>0){await o();let x=new mo,H=.45,y=1.4,q=.2;x.moveTo(-H,0),x.lineTo(H,0),x.lineTo(H,y-H),x.absarc(0,y-H,H,0,Math.PI,!1);let M={depth:q,bevelEnabled:!0,bevelSegments:6,steps:1,bevelSize:.03,bevelThickness:.03},V=new Eo(x,M);V.translate(0,0,-q/2);let $=new mo;$.moveTo(-H-.12,-q/2-.12),$.lineTo(H+.12,-q/2-.12),$.lineTo(H+.12,q/2+.12),$.lineTo(-H-.12,q/2+.12);let ee={depth:.15,bevelEnabled:!0,bevelSegments:4,steps:1,bevelSize:.02,bevelThickness:.02},X=new Eo($,ee);X.rotateX(Math.PI/2),X.translate(0,.075,0);let I=qe([V,X]);Yt(I,.5,.02,12),Ko(I,0,.5);let h=typeof window<"u"&&window.innerWidth>768?1024:512,g=yo("photogrammetryRock",h),C=new Ot({color:13685976,roughness:.75,metalness:.05,map:g.map,normalMap:g.normalMap,roughnessMap:g.roughnessMap,vertexColors:!0}),w=new ut(I,C,v.length),i=new Lt;for(let _=0;_<v.length;_++){_%500===0&&await o();let S=v[_],W=-4.5,ae=S.x+Math.sin(S.rot)*W,p=S.z+Math.cos(S.rot)*W,E=ke(ae,p);i.position.set(ae,E,p),i.rotation.set(0,S.rot,0),i.rotation.x=(Math.random()-.5)*.08,i.rotation.z=(Math.random()-.5)*.06,i.scale.setScalar(.9+Math.random()*.2),i.updateMatrix(),w.setMatrixAt(_,i.matrix)}w.instanceMatrix.needsUpdate=!0,w.castShadow=!0,w.receiveShadow=!0,this.world.scene.add(w),console.log("[world3d] gsMesh added to scene"),this._decorMeshes||(this._decorMeshes=[]),this._decorMeshes.push(w)}[{idPrefix:"MOSQUE",x:j.mosque.x,z:j.mosque.z,r:80,name:"Mosque Courtyard"},{idPrefix:"PAGODA",x:j.buddhistTemple.x,z:j.buddhistTemple.z,r:80,name:"Pagoda Gardens"}].forEach(x=>{let H=0;for(let y=40;y<x.r;y+=16){let q=Math.floor(2*Math.PI*y/16);for(let M=0;M<q;M++){let V=M/q*Math.PI*2,$=x.x+Math.cos(V)*y,ee=x.z+Math.sin(V)*y;a($,ee)&&(t(`${x.idPrefix}_${H}`,$,ee,V,x.idPrefix.toLowerCase(),`${x.name} ${H}`,"estate",3),H++)}}}),n>0&&console.log(`[WorldTerrain] Generated ${n} procedural plots.`)}_river(){this._riverMaterials=[];let e=(o,s=46,n=8,t=16)=>{let a=o.map(([x,H,y])=>new ht(x,y,H)),l=new It(a),u=240,f=[],c=[],m=[],v=new ht(0,1,0);for(let x=0;x<=u;x++){let H=x/u,y=l.getPoint(H),q=l.getTangent(H),M=s+Math.sin(H*Math.PI*3)*n,V=new ht().crossVectors(q,v).normalize().multiplyScalar(M*.5),$=y.clone().add(V),ee=y.clone().sub(V);if(f.push($.x,$.y,$.z,ee.x,ee.y,ee.z),m.push(0,H*t,1,H*t),x>0){let X=x*2;c.push(X-2,X,X-1,X-1,X,X+1)}}let R=new gt;R.setAttribute("position",new mt(f,3)),R.setAttribute("uv",new mt(m,2)),R.setIndex(c),R.computeVertexNormals();let b=this.riverMat.clone();b.uniforms&&(b.uniforms.uLength={value:t}),this._riverMaterials.push(b);let Y=new r(R,b);return Y.receiveShadow=!0,Y.renderOrder=1,this.world.scene.add(Y),l};this._riverInletCurve=e(Tn,22,3.5,16),this._riverOutletCurve=e(xn,44,6,22)}openGate(){this._forceGateOpen=!0}closeGate(){this._forceGateOpen=!1}async rebuildPlots(){for(let e=this.world.pickables.length-1;e>=0;e--){let o=this.world.pickables[e];this.world.plotMeshIndex.has(o)&&o.isInstancedMesh&&(this.world.scene.remove(o),o.geometry?.dispose(),o.material?.dispose(),this.world.pickables.splice(e,1),this.world.plotMeshIndex.delete(o))}for(let e of this._decorMeshes||[])this.world.scene.remove(e),e.geometry?.dispose(),e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(s=>s.dispose());this._decorMeshes=[],this.world.scene.remove(this.world.selRing),console.log("[World3D] calling _generateProceduralPlots()..."),await this._generateProceduralPlots(),console.log("[World3D] calling _plots()..."),await this.world._plots(),console.log("[World3D] _plots() done")}};var Bi=new ye(12563354),Ma=new B,Li=new B,Fi=new B,Ni=new B,Vi=new ye,Wi=new ye,Ui=new so,Oi=new _t;var Fs=class{constructor(e){this.world=e}_setupWalkControls(){this.walkMode=!1,this.tourMode=!1,this.keysDown={w:!1,a:!1,s:!1,d:!1,q:!1,e:!1,Shift:!1},this.walkPos=new B(0,4,310),this.walkYaw=Math.PI,this.walkPitch=0,this.walkVelocity=new B,this.eyeHeight=2.4,this._isDraggingLook=!1,this._prevMouse={x:0,y:0},this._walkForward=new B,this._walkRight=new B,this._walkMoveDir=new B,this._walkLookDir=new B,this._walkLookTarget=new B,this._walkZero=new B(0,0,0),this.world._joystickInput=new kt(0,0),this._onKeyDown=e=>{let o=document.activeElement;if(o&&(["input","textarea","select"].includes(o.tagName?.toLowerCase())||o.isContentEditable||o.closest("input, textarea, select, [contenteditable]"))||!!(document.querySelector("#modalRoot:not(.hidden)")||document.querySelector(".devotional-dialog")||document.querySelector(".panel:not(.hidden)")||document.querySelector(".feed-panel:not(.hidden)")))return;let t=e.key.toLowerCase();if(this.tourMode){if(e.code==="Space"){e.preventDefault(),this.toggleTourPlayPause();return}if(t==="arrowright"||t==="n"){e.preventDefault(),this.nextTourStage();return}if(t===" "){e.preventDefault(),this.toggleTourPause();return}if(t==="arrowleft"||t==="p"){e.preventDefault(),this.prevTourStage();return}if(e.key==="Escape"||t==="x"){e.preventDefault(),this.exitTour();return}}if(t==="e"&&this._nearDevotionalTemple){e.preventDefault(),window.UI?.showDevotionalModal&&window.UI.showDevotionalModal(this._nearDevotionalTemple);return}(t==="w"||t==="arrowup")&&(this.keysDown.w=!0),(t==="s"||t==="arrowdown")&&(this.keysDown.s=!0),(t==="a"||t==="arrowleft")&&(this.keysDown.a=!0),(t==="d"||t==="arrowright")&&(this.keysDown.d=!0),t==="q"&&(this.keysDown.q=!0),t==="e"&&(this.keysDown.e=!0),e.key==="Shift"&&(this.keysDown.Shift=!0),["w","a","s","d","arrowup","arrowleft","arrowdown","arrowright"].includes(t)&&!this.walkMode&&!this.tourMode&&this.setMode("walk")},this._onKeyUp=e=>{let o=e.key.toLowerCase();(o==="w"||o==="arrowup")&&(this.keysDown.w=!1),(o==="s"||o==="arrowdown")&&(this.keysDown.s=!1),(o==="a"||o==="arrowleft")&&(this.keysDown.a=!1),(o==="d"||o==="arrowright")&&(this.keysDown.d=!1),o==="q"&&(this.keysDown.q=!1),o==="e"&&(this.keysDown.e=!1),e.key==="Shift"&&(this.keysDown.Shift=!1)},this._onMouseDown=e=>{this.walkMode&&(e.target.closest("#sanctuaryWalkPill, #sanctuaryAmbiencePill, #topbar, .panel, .modal")||(this._isDraggingLook=!0,this._prevMouse={x:e.clientX,y:e.clientY}))},this._onMouseMove=e=>{if(!this.walkMode||!this._isDraggingLook)return;let o=e.clientX-this._prevMouse.x,s=e.clientY-this._prevMouse.y;this._prevMouse={x:e.clientX,y:e.clientY},this.walkYaw-=o*.0035,this.walkPitch=Math.max(-Math.PI*.4,Math.min(Math.PI*.4,this.walkPitch-s*.0035))},this._onMouseUp=()=>{this._isDraggingLook=!1},window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),this.world.canvas.addEventListener("mousedown",this._onMouseDown),window.addEventListener("mousemove",this._onMouseMove),window.addEventListener("mouseup",this._onMouseUp),this._onTouchStart=e=>{!this.walkMode||!e.touches[0]||e.target.closest("#sanctuaryWalkPill, #walkJoystick, #sanctuaryAmbiencePill, #topbar, .panel, .modal")||(this._isDraggingLook=!0,this._prevMouse={x:e.touches[0].clientX,y:e.touches[0].clientY})},this._onTouchMove=e=>{if(!this.walkMode||!this._isDraggingLook||!e.touches[0])return;let o=e.touches[0].clientX-this._prevMouse.x,s=e.touches[0].clientY-this._prevMouse.y;this._prevMouse={x:e.touches[0].clientX,y:e.touches[0].clientY},this.walkYaw-=o*.004,this.walkPitch=Math.max(-Math.PI*.4,Math.min(Math.PI*.4,this.walkPitch-s*.004))},this.world.canvas.addEventListener("touchstart",this._onTouchStart,{passive:!0}),this.world.canvas.addEventListener("touchmove",this._onTouchMove,{passive:!0}),this._initTourSpline()}_initTourSpline(){if(this._tourSpline&&this._tourStages&&this._stageArc&&this._tourStages.length===12)return;this._tourStages=kn;let e=[new B(0,48,1300),new B(0,40,1050),new B(0,36.5,885),new B(0,42,680),new B(0,52,480),new B(0,58,300),new B(80,38,120),new B(95,36,0),new B(-40,36,-120),new B(0,44,-280),new B(0,105,-420),new B(0,168,-490),new B(0,172,-540),new B(25,166,-575),new B(15,188,-605),new B(0,220,-630),new B(0,218,-685),new B(0,275,-735),new B(-240,288,-750),new B(-340,238,-600),new B(-380,175,-420),new B(-450,132,-300),new B(-480,110,-200),new B(-380,75,-120),new B(100,30,-160),new B(430,2.8,-260),new B(520,25,-340),new B(530,95,-420),new B(610,175,-570),new B(630,215,-470),new B(350,215,700),new B(20,42,2040),new B(-30,44,2140),new B(10,-5.5,2220),new B(-25,-14.5,2290),new B(0,75,1450)];this._tourSpline=new It(e,!0,"centripetal"),this._stageArc=[];for(let o of this._tourStages){let s=0,n=64;for(let t=0;t<n;t++){let a=o.tStart+(o.tEnd-o.tStart)*(t/n),l=o.tStart+(o.tEnd-o.tStart)*((t+1)/n),u=this._tourSpline.getPoint(a),f=this._tourSpline.getPoint(l);s+=u.distanceTo(f)}this._stageArc.push(s)}this._totalSplineLength=this._stageArc.reduce((o,s)=>o+s,0),this._tourTime=0,this.world._tourSpeed=1,this.world._tourPaused=!1,this.world._currentRoll=0,this.world._activeStageIndex=0,this._lastStageNum=-1}_calculateTourLookTarget(e,o,s,n){let t=n||this.world._v3TourLook,a=s&&s.lengthSq()>1e-4&&!isNaN(s.x)?s:this.world._v3TourTan,l=[new B(0,40,600),new B(0,45,100),new B(0,24,0),new B(0,160,-520),new B(20,166,-620),new B(0,220,-720),new B(-440,150,-500),new B(-480,106,-200),new B(470,3,-290),new B(560,170,-520),new B(20,37,2100),new B(0,-10,2260)],u=1/12,c=(e%1+1)%1/u,m=Math.floor(c)%12,v=(m+1)%12,R=c-Math.floor(c),b=R*R*R*(R*(R*6-15)+10),Y=l[m],x=l[v];this.world._v3Tmp3||(this.world._v3Tmp3=new B),this.world._v3Tmp4||(this.world._v3Tmp4=new B);let H=this.world._v3Tmp3.copy(o).addScaledVector(a,120),y=this.world._v3Tmp4.copy(Y).lerp(x,b),M=m===2||m===5||m===7||m===9||m===10?.35:.6;if(m===10){let $=this.world._v3Tmp4.copy(l[10]),ee=Math.max(.2,.88-R*.95),X=$.lerp(H,1-ee);if(R<.55)t.copy(X);else{let I=(R-.55)/.45,h=I*I*(3-2*I);t.copy(X).lerp(l[11],h)}}else m===8&&o.y<12?(t.copy(y).lerp(H,M),t.y=3.2):t.copy(y).lerp(H,M);return t.distanceToSquared(o)<25&&t.copy(o).addScaledVector(a,50),t}_initWalkHUD(){let e=document.getElementById("sanctuaryWalkPill");e||(e=document.createElement("div"),e.className="sanctuary-walk-pill",e.id="sanctuaryWalkPill",e.innerHTML=`
        <button class="swp-btn is-active" data-cam-mode="orbit">Explore</button>
        <button class="swp-btn" data-cam-mode="tour">Drone flight</button>
        <button class="swp-btn" data-cam-mode="walk">Walk</button>
        <button class="swp-btn" data-cam-mode="overview">Whole valley</button>
        <button class="swp-btn" data-cam-mode="map">Map</button>
      `,document.getElementById("view3d").appendChild(e),e.addEventListener("click",n=>{let t=n.target.closest(".swp-btn");if(!t)return;let a=t.dataset.camMode;if(a==="map"){window.UI?.show2D();return}window.UI?.show3D(a==="overview"?"orbit":a).then(()=>{a==="overview"&&this.flyToDistrict("overview")})}));let o=document.getElementById("droneTourCard");o&&o.classList.add("hidden");let s=document.getElementById("walkJoystick");if(!s){s=document.createElement("div"),s.className="walk-joystick",s.id="walkJoystick",s.innerHTML=`
        <div class="walk-joystick-base">
          <div class="walk-joystick-knob" id="walkJoystickKnob"></div>
        </div>
      `,document.body.appendChild(s);let n=s.querySelector("#walkJoystickKnob"),t=null,a={x:0,y:0},l=38;this._onJoystickTouchStart=u=>{if(t!==null)return;t=u.changedTouches[0].identifier;let c=s.getBoundingClientRect();a={x:c.left+c.width/2,y:c.top+c.height/2},u.preventDefault()},this._onJoystickTouchMove=u=>{if(t!==null)for(let f=0;f<u.changedTouches.length;f++){let c=u.changedTouches[f];if(c.identifier===t){let m=c.clientX-a.x,v=c.clientY-a.y,R=Math.hypot(m,v);R>l&&(m=m/R*l,v=v/R*l),n&&(n.style.transform=`translate(${m}px, ${v}px)`),this.world._joystickInput.set(m/l,v/l),u.preventDefault();break}}},this._onJoystickTouchEnd=u=>{if(t!==null){for(let f=0;f<u.changedTouches.length;f++)if(u.changedTouches[f].identifier===t){t=null,n&&(n.style.transform="translate(0px, 0px)"),this.world._joystickInput.set(0,0);break}}},s.addEventListener("touchstart",this._onJoystickTouchStart,{passive:!1}),window.addEventListener("touchmove",this._onJoystickTouchMove,{passive:!1}),window.addEventListener("touchend",this._onJoystickTouchEnd),window.addEventListener("touchcancel",this._onJoystickTouchEnd)}this._joystick=s}_initFPSHUD(){let e=document.getElementById("sanctuaryFpsPill");if(!e){e=document.createElement("div"),e.className="sanctuary-fps-pill fps-good",e.id="sanctuaryFpsPill",e.setAttribute("aria-label","Real-time FPS and Render Time"),e.innerHTML=`
        <span class="sfp-dot"></span>
        <span class="sfp-text" id="sanctuaryFpsText"><span class="sfp-fps">60 FPS</span><span class="sfp-sep">\xB7</span><span class="sfp-ms">16ms</span></span>
      `;let o=document.getElementById("view3d");o?o.appendChild(e):document.body.appendChild(e)}this.world._fpsPill=e,this.world._fpsTextEl=e.querySelector("#sanctuaryFpsText")}toggleTourPlayPause(){this.world._tourPaused=!this.world._tourPaused,this._updateTourHUD(this._tourTime,!0)}nextTourStage(){if(!this._tourStages||this._tourStages.length===0)return;let e=(this.world._activeStageIndex+1)%this._tourStages.length;this.setTourStage(e)}toggleTourPause(){this.world._tourPaused=!this.world._tourPaused,this._updateTourHUD(this._tourTime,!0)}prevTourStage(){if(!this._tourStages||this._tourStages.length===0)return;let e=(this.world._activeStageIndex-1+this._tourStages.length)%this._tourStages.length;this.setTourStage(e)}setTourStage(e){if(!this._tourStages||e<0||e>=this._tourStages.length)return;this.tourMode||this.setMode("tour");let o=this._tourStages[e].tStart;this.world._tourPaused=!1,this.world._activeStageIndex=e,this._tourSpline||this._initTourSpline(),this._tourSpline.getPoint(o,this.world._v3TourPos),(isNaN(this.world._v3TourPos.x)||isNaN(this.world._v3TourPos.y)||isNaN(this.world._v3TourPos.z))&&this.world._v3TourPos.set(0,48,960);let n=ke(this.world._v3TourPos.x,this.world._v3TourPos.z)+.8;this.world._v3TourPos.y<n&&(this.world._v3TourPos.y=n),this._tourSpline.getTangent(o,this.world._v3TourTan),this.world._v3TourTan.lengthSq()<1e-4||isNaN(this.world._v3TourTan.x)||isNaN(this.world._v3TourTan.y)||isNaN(this.world._v3TourTan.z)?this.world._v3TourTan.set(0,0,-1):this.world._v3TourTan.normalize(),this._calculateTourLookTarget(o,this.world._v3TourPos,this.world._v3TourTan,this.world._v3TourLook),this.world._v3TourLook.distanceToSquared(this.world._v3TourPos)<1&&this.world._v3TourLook.copy(this.world._v3TourPos).addScaledVector(this.world._v3TourTan,50),this._stageTween=null,this.world.camera.position.copy(this.world._v3TourPos),this.world._currentLook||(this.world._currentLook=new B),this.world._currentLook.copy(this.world._v3TourLook),this.world.camera.up.set(0,1,0),this.world._currentRoll=0,this.world.camera.lookAt(this.world._currentLook),this.world._currentQuat=this.world.camera.quaternion.clone(),this._tourTime=o,this._updateTourHUD(o,!0)}startDroneTour(e=0){this.world.startDroneTour(e)}exitTour(){this.setMode("orbit"),window.UI?._setView&&window.UI._setView({view:"view3d",btn:"btn3d"})}_updateTourHUD(e,o=!1){if(window.VeoTour?.isPlaying||document.getElementById("veoDroneTourContainer")&&!document.getElementById("veoDroneTourContainer").classList.contains("hidden")){let l=document.getElementById("droneTourCard");l&&l.classList.add("hidden");return}if(!this._tourStages||this._tourStages.length===0)return;let n=this._tourStages[0];for(let l=0;l<this._tourStages.length;l++){let u=this._tourStages[l];if(e>=u.tStart&&(e<u.tEnd||l===this._tourStages.length-1)){n=u;break}}this.world._activeStageIndex=this._tourStages.indexOf(n);let t=document.getElementById("droneTourCard");if(this._lastStageNum!==n.stage||!t||o){this._lastStageNum=n.stage,t||(t=document.createElement("div"),t.id="droneTourCard",document.body.appendChild(t),t.addEventListener("click",c=>{let m=c.target.closest(".dtc-btn");if(m&&(m.classList.contains("dtc-prev")&&this.prevTourStage(),m.classList.contains("dtc-next")&&this.nextTourStage(),m.classList.contains("dtc-play")&&this.toggleTourPause(),m.classList.contains("dtc-exit")&&this.exitTour(),m.classList.contains("dtc-speed"))){let v=this.world._tourSpeedMultiplier||1;v===1?this.world._tourSpeedMultiplier=1.5:v===1.5?this.world._tourSpeedMultiplier=2:v===2?this.world._tourSpeedMultiplier=.5:this.world._tourSpeedMultiplier=1,this._updateTourHUD(this._tourTime,!0)}})),t.classList.remove("hidden");let l=this.world._tourSpeedMultiplier||1,u=this._tourStages?this._tourStages.length:12,f=this.world._tourPaused?'<div class="dtc-pause-hint">\u23F8 <strong>Flight Paused</strong> \u2014 Click any plot to inspect & reserve \xB7 Press Space to resume</div>':"";t.innerHTML=`
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
      `}else{let l=t.querySelector(".dtc-play");l&&(l.textContent=this.world._tourPaused?"\u25B6":"\u23F8");let u=t.querySelector(".dtc-pause-hint");if(this.world._tourPaused){if(!u){let f=t.querySelector(".dtc-content");f&&(u=document.createElement("div"),u.className="dtc-pause-hint",u.innerHTML="\u23F8 <strong>Flight Paused</strong> \u2014 Click any plot to inspect & reserve \xB7 Press Space to resume",f.insertBefore(u,f.querySelector(".dtc-controls")))}}else u&&u.remove()}let a=document.getElementById("dtcProgress");if(a&&n.tEnd>n.tStart){let l=Math.max(0,Math.min(100,(e-n.tStart)/(n.tEnd-n.tStart)*100));a.style.width=l+"%"}}startEntranceFlight(e={}){let{targetMode:o="orbit",duration:s=7,onThresholdCross:n,onComplete:t}=e;this.walkMode=!1,this.tourMode=!1,this.world.controls.enabled=!1,this.world.terrain.gateTargetOpen=0;let a=[new B(0,24,980),new B(0,20,930),new B(0,18,880),new B(0,25,780),new B(0,32,650),new B(0,42,540),new B(0,42,440),new B(0,39,320),new B(0,37.5,180),new B(0,36.5,60)],l=[new B(0,22,750),new B(0,24,750),new B(0,34,680),new B(0,30,560),new B(0,28,440),new B(0,26,300),new B(0,24,140),new B(0,22,20),new B(0,24,-80),new B(0,26,-180)];this._entranceFlight={spline:new It(a),lookSpline:new It(l),duration:Math.max(2,s),startTime:performance.now(),crossedThreshold:!1,onThresholdCross:n,onComplete:t,targetMode:o}}setMode(e){if(e==="tour"){this.world.startDroneTour();return}let o=this.walkMode;this.world.cameraMode=e,this.world.flight?.stop(),this._entranceFlight&&(this._entranceFlight=null),this._stageTween&&(this._stageTween=null),document.getElementById("sanctuaryWalkPill")||this._initWalkHUD();let s=document.getElementById("sanctuaryWalkPill");s&&s.querySelectorAll(".swp-btn").forEach(l=>{l.classList.toggle("is-active",l.dataset.camMode===e)});let n=document.getElementById("droneTourCard");n&&n.classList.add("hidden");let t=document.getElementById("walkJoystick");if(t){let l="ontouchstart"in window||navigator.maxTouchPoints>0;t.classList.toggle("is-active",e==="walk"&&l)}let a=document.getElementById("walkInstructionsHint");if(e==="walk"){if(this.walkMode=!0,this.tourMode=!1,this.world.controls.enabled=!1,this.world.camera.up.set(0,1,0),this.world._currentRoll=0,!o){this.walkPos.copy(this.world.camera.position),this.walkPos.y=ke(this.walkPos.x,this.walkPos.z)+this.eyeHeight;let l=this.world.camera.getWorldDirection(new B);this.walkYaw=Math.atan2(-l.x,-l.z),this.walkPitch=Math.asin(Math.max(-1,Math.min(1,l.y)))}this.world.camera.position.copy(this.walkPos),a&&a.classList.add("is-active")}else if(e==="tour"){this.walkMode=!1,this.tourMode=!0,this.world.controls.enabled=!1,this.world._tourPaused=!1,this.world._tourSpeed=1,this.world._currentRoll=0,this.world.camera.up.set(0,1,0),this._tourSpline||this._initTourSpline(),(typeof this._tourTime!="number"||isNaN(this._tourTime))&&(this._tourTime=0),a&&a.classList.remove("is-active");let l=(this._tourTime%1+1)%1;this._tourSpline.getPoint(l,this.world._v3TourPos),(isNaN(this.world._v3TourPos.x)||isNaN(this.world._v3TourPos.y)||isNaN(this.world._v3TourPos.z))&&this.world._v3TourPos.set(0,48,960);let f=ke(this.world._v3TourPos.x,this.world._v3TourPos.z)+.8;this.world._v3TourPos.y<f&&(this.world._v3TourPos.y=f),this.world.camera.position.copy(this.world._v3TourPos),this._tourSpline.getTangent(l,this.world._v3TourTan),this.world._v3TourTan.lengthSq()<1e-4||isNaN(this.world._v3TourTan.x)||isNaN(this.world._v3TourTan.y)||isNaN(this.world._v3TourTan.z)?this.world._v3TourTan.set(0,0,-1):this.world._v3TourTan.normalize(),this._calculateTourLookTarget(l,this.world._v3TourPos,this.world._v3TourTan,this.world._v3TourLook),this.world._currentLook||(this.world._currentLook=new B),this.world._currentLook.copy(this.world._v3TourLook),this.world.camera.up.set(0,1,0),this.world._currentRoll=0,this.world.camera.lookAt(this.world._currentLook),this.world._currentQuat=this.world.camera.quaternion.clone(),this._updateTourHUD(l,!0)}else{if(this.walkMode=!1,this.tourMode=!1,this.world.controls.enabled=!0,o){let l=this.world.camera.getWorldDirection(new B);this.world.controls.target.copy(this.world.camera.position).addScaledVector(l,80)}this.world.camera.up.set(0,1,0),this.world._currentRoll=0,a&&a.classList.remove("is-active"),(!this.world.controls.target||this.world.controls.target.lengthSq()<1)&&(this.world.camera.position.set(0,48,960),this.world.controls.target.set(0,36,600)),this.world.controls.update()}}_updateWalk(e){let o=e;if((isNaN(o)||o===void 0||o==null)&&(o=.016),o=Math.min(Math.max(o,5e-4),.0333),this._entranceFlight){let i=this._entranceFlight,_=(performance.now()-i.startTime)/1e3,S=Math.min(1,_/i.duration),W=S<.5?4*S*S*S:1-Math.pow(-2*S+2,3)/2,ae=i.spline.getPoint(W,this.world._v3Tmp1),p=i.lookSpline.getPoint(W,this.world._v3Tmp2),E=ke(ae.x,ae.z),T=this.world._deckY?this.world._deckY(ae.z):null,P=Math.max(E+3.2,T!==null?T+3.2:0);if(ae.y=Math.max(ae.y,P),this.world.camera.up.set(0,1,0),this.world._currentRoll=0,this.world.camera.position.copy(ae),this.world.camera.lookAt(p),(ae.z<=885||W>=.2)&&!i.crossedThreshold&&(i.crossedThreshold=!0,typeof i.onThresholdCross=="function"&&i.onThresholdCross()),S>=1){let te=i.targetMode,se=i.onComplete;this._entranceFlight=null,this.setMode(te),typeof se=="function"&&se()}return}if(this.tourMode){if(this._stageTween){let Pe=this._stageTween;Pe.elapsed+=o;let D=Math.min(1,Pe.elapsed/Pe.duration),U=D<.5?4*D*D*D:1-Math.pow(-2*D+2,3)/2;this.world.camera.position.lerpVectors(Pe.startPos,Pe.endPos,U),this.world._currentLook.lerpVectors(Pe.startLook,Pe.endLook,U),this.world.camera.up.set(0,1,0),this.world._currentRoll=0,this.world.camera.lookAt(this.world._currentLook),D>=1&&(this._stageTween=null);return}let i=this.world._tourPaused?0:1,_=1-Math.exp(-8*o);this.world._tourSpeed+=(i-this.world._tourSpeed)*_;let S=(this._tourTime%1+1)%1,W=1,ae=1e3,p=12,E=(this._tourTime%1+1)%1;if(this._tourStages&&this._tourStages.length)for(let Pe=0;Pe<this._tourStages.length;Pe++){let D=this._tourStages[Pe];if(E>=D.tStart&&E<=D.tEnd+1e-5){ae=this._stageArc?this._stageArc[Pe]:1e3,p=D.seconds||12;let U=(E-D.tStart)/(D.tEnd-D.tStart),G=D.speedScale||.82,A=Math.abs(U-.5)*2,z=A*A*(3-2*A),F=G+(1-G)*z,Q=(1+G)/2;W=F/Q;break}}let T=(typeof this.world._tourSpeedMultiplier=="number"&&!isNaN(this.world._tourSpeedMultiplier)?this.world._tourSpeedMultiplier:1)*.45,P=ae/p*W;this._tourSpline||this._initTourSpline(),this._totalSplineLength||(this._totalSplineLength=this._tourSpline.getLength()||11e3);let te=this._tourStages?this._tourStages.length:12,se=1/te/(p||12);this.world._tourPaused||(this._tourTime+=o*se*W*this.world._tourSpeed*T),isNaN(this._tourTime)&&(this._tourTime=0);let oe=(this._tourTime%1+1)%1;this._tourSpline||this._initTourSpline(),this._tourSpline.getPoint(oe,this.world._v3TourPos),(isNaN(this.world._v3TourPos.x)||isNaN(this.world._v3TourPos.y)||isNaN(this.world._v3TourPos.z))&&this.world._v3TourPos.set(0,48,960);let k=ke(this.world._v3TourPos.x,this.world._v3TourPos.z)+.8;this.world._v3TourPos.y<k&&(this.world._v3TourPos.y=k),this._tourSpline.getTangent(oe,this.world._v3TourTan),this.world._v3TourTan.lengthSq()<1e-4||isNaN(this.world._v3TourTan.x)||isNaN(this.world._v3TourTan.y)||isNaN(this.world._v3TourTan.z)?this.world._v3TourTan.set(0,0,-1):this.world._v3TourTan.normalize(),this._calculateTourLookTarget(oe,this.world._v3TourPos,this.world._v3TourTan,this.world._v3TourLook);let O=1-Math.exp(-1.5*o);this.world._currentLook||(this.world._currentLook=this.world._v3TourLook.clone()),this.world._currentLook.lerp(this.world._v3TourLook,O),this.world.camera.position.copy(this.world._v3TourPos),this.world.camera.lookAt(this.world._currentLook);let ie=(oe+.002)%1;this.world._v3Tmp1||(this.world._v3Tmp1=new B);let ve=this._tourSpline.getTangent(ie,this.world._v3Tmp1)||this.world._v3Tmp1,De=Math.atan2(-this.world._v3TourTan.x,-this.world._v3TourTan.z),Ke=Math.atan2(-ve.x,-ve.z)-De;Ke>Math.PI&&(Ke-=Math.PI*2),Ke<-Math.PI&&(Ke+=Math.PI*2);let Te=oe<=2/te?0:Math.max(-.25,Math.min(.25,Ke*1.5)),Ce=1-Math.exp(-2*o);this.world._currentRoll=(this.world._currentRoll||0)+(Te-(this.world._currentRoll||0))*Ce,this.world.camera.rotateZ(this.world._currentRoll),this._updateTourHUD(oe);return}if(!this.walkMode)return;this.world.camera.up.set(0,1,0);let s=2.4;(this.keysDown.ArrowLeft||this.keysDown.q)&&(this.walkYaw+=s*o),(this.keysDown.ArrowRight||this.keysDown.e)&&(this.walkYaw-=s*o),this.keysDown.ArrowUp&&(this.walkPitch=Math.min(Math.PI*.4,this.walkPitch+s*o)),this.keysDown.ArrowDown&&(this.walkPitch=Math.max(-Math.PI*.4,this.walkPitch-s*o));let n=this.keysDown.Shift?32:16;if(this._walkForward.set(-Math.sin(this.walkYaw),0,-Math.cos(this.walkYaw)),this._walkRight.set(Math.cos(this.walkYaw),0,-Math.sin(this.walkYaw)),this._walkMoveDir.set(0,0,0),this.keysDown.w&&this._walkMoveDir.add(this._walkForward),this.keysDown.s&&this._walkMoveDir.sub(this._walkForward),this.keysDown.d&&this._walkMoveDir.add(this._walkRight),this.keysDown.a&&this._walkMoveDir.sub(this._walkRight),this.world._joystickInput&&this.world._joystickInput.lengthSq()>.001&&(this._walkMoveDir.addScaledVector(this._walkRight,this.world._joystickInput.x),this._walkMoveDir.addScaledVector(this._walkForward,-this.world._joystickInput.y)),this._walkMoveDir.lengthSq()>.001){this._walkMoveDir.normalize().multiplyScalar(n);let i=1-Math.exp(-14*o);this.walkVelocity.lerp(this._walkMoveDir,i)}else{let i=1-Math.exp(-16*o);this.walkVelocity.lerp(this._walkZero,i)}let t=this.walkPos.x+this.walkVelocity.x*o,a=this.walkPos.z+this.walkVelocity.z*o,l=[{x:0,z:20,r:14},{x:-30,z:880,r:8},{x:30,z:880,r:8},{x:0,z:20,r:19.5}],u=t,f=a;for(let i=0;i<l.length;i++){let _=l[i],S=u-_.x,W=f-_.z,ae=Math.hypot(S,W);if(ae<_.r){let p=(_.r-ae)/(ae||1);u+=S*p,f+=W*p}}let c=u-j.cathedral.x,m=f-j.cathedral.z,v=Math.abs(c)<6.5&&f<=-610&&f>=-708,R=c>=-48&&c<=0&&Math.abs(m- -34)<6,b=v||R;if(!b){let i=Math.hypot(c,m);if(i<26){let _=(26-i)/(i||1);u+=c*_,f+=m*_}}let Y=u-j.buddhistTemple.x,x=f-j.buddhistTemple.z,H=Math.abs(Y)<4.2&&x>=-5&&x<=28;if(!H){let i=Math.hypot(Y,x);if(i<20){let _=(20-i)/(i||1);u+=Y*_,f+=x*_}}let y=u-j.mosque.x,q=f-j.mosque.z,M=Math.abs(y)<13.5&&q>=-22&&q<=36;if(!M){let i=Math.hypot(y,q);if(i<22){let _=(22-i)/(i||1);u+=y*_,f+=q*_}}let V=ke(this.walkPos.x,this.walkPos.z);ke(u,f)-V>1.35&&!b&&!H&&!M&&(u=this.walkPos.x,f=this.walkPos.z,this.walkVelocity.set(0,0,0)),this.walkPos.x=Math.max(-2e3,Math.min(2e3,u)),this.walkPos.z=Math.max(-1e3,Math.min(2600,f));let X=Math.abs(this.walkPos.x)<16&&this.walkPos.z>=j.bridge.z-55&&this.walkPos.z<=j.bridge.z+55,I;if(X)I=(this.world._deckY(this.walkPos.z)||2)+.15;else{I=ke(this.walkPos.x,this.walkPos.z);let i=this.walkPos.z>915?j.oceanLevel||.35:j.waterLevel;I<i&&(I=i),Math.abs(this.walkPos.x-j.cathedral.x)<12&&this.walkPos.z<=-615&&this.walkPos.z>=-712||this.walkPos.x<=j.cathedral.x&&this.walkPos.x>=j.cathedral.x-48&&Math.abs(this.walkPos.z-(j.cathedral.z-34))<6.5?I=Math.max(I,j.cathedral.y+2.2):Math.hypot(this.walkPos.x-j.buddhistTemple.x,this.walkPos.z-j.buddhistTemple.z)<15?I=Math.max(I,j.buddhistTemple.y+1.88):Math.hypot(this.walkPos.x-j.mosque.x,this.walkPos.z-(j.mosque.z+7))<24&&(I=Math.max(I,j.mosque.y+2.22))}let h=I+this.eyeHeight,g=1-Math.exp(-20*o);this.walkPos.y+=(h-this.walkPos.y)*g,this.walkPos.y<I+.4&&(this.walkPos.y=I+.4);let w=this.walkVelocity.length()>.5?Math.sin(performance.now()*.012)*.05:0;this.world.camera.position.set(this.walkPos.x,this.walkPos.y+w,this.walkPos.z),this._walkLookDir.set(-Math.sin(this.walkYaw)*Math.cos(this.walkPitch),Math.sin(this.walkPitch),-Math.cos(this.walkYaw)*Math.cos(this.walkPitch)),this._walkLookTarget.copy(this.world.camera.position).add(this._walkLookDir),this.world.camera.lookAt(this._walkLookTarget)}flyToPlot(e){this.world.selectPlot(e)}flyToDistrict(e,o){if(o){this.flyToPlot(o);return}let s={meadows:{x:-120,y:22,z:380,dist:180},canopy:{x:-180,y:35,z:-120,dist:180},woodland:{x:-180,y:35,z:-120,dist:180},riverbank:{x:180,y:24,z:260,dist:160},lakefront:{x:180,y:24,z:260,dist:160},starlight:{x:20,y:36,z:2100,dist:220},beach:{x:20,y:36,z:2100,dist:220},kaya_island:{x:20,y:36,z:2100,dist:220},highland:{x:0,y:220,z:-680,dist:220},summit:{x:-360,y:92,z:-380,dist:220},highland_sanctuary:{x:0,y:220,z:-680,dist:220},all:{x:0,y:160,z:720,dist:380},overview:{x:0,y:80,z:550,dist:2600},desert:{x:-460,y:42,z:340,dist:220},underwater:{x:380,y:-2,z:-250,dist:120},desert_bloom:{x:-460,y:42,z:340,dist:220},mosque:{x:-480,y:104,z:-200,dist:170},pagoda:{x:560,y:140,z:-540,dist:180},waterfall:{x:0,y:95,z:-460,dist:180},lake:{x:380,y:16,z:-250,dist:190},bridge:{x:0,y:14,z:440,dist:150},gate:{x:0,y:32,z:880,dist:160},cathedral:{x:typeof j<"u"&&j.cathedral?j.cathedral.x:0,y:225,z:typeof j<"u"&&j.cathedral?j.cathedral.z:-687,dist:160},cathedral_interior:{x:typeof j<"u"&&j.cathedral?j.cathedral.x:0,y:216,z:typeof j<"u"&&j.cathedral?j.cathedral.z-10:-697,dist:35},desert_interior:{x:-460,y:45,z:340,dist:28},mosque_interior:{x:typeof j<"u"&&j.mosque?j.mosque.x:-480,y:110,z:typeof j<"u"&&j.mosque?j.mosque.z-10:-200,dist:30},pagoda_interior:{x:typeof j<"u"&&j.buddhistTemple?j.buddhistTemple.x:560,y:144,z:typeof j<"u"&&j.buddhistTemple?j.buddhistTemple.z-10:-540,dist:30}};if(e==="underwater"){let a=new B(380,-4,-250),l=new B(380,-2,-220);this._flyToExplicit(l,a,1.4);return}if(e==="cathedral"||e==="cathedral_exterior"){this.flyToCathedral("exterior");return}if(e==="cathedral_interior"){this.flyToCathedral("interior");return}if(e==="desert_interior"){let a=new B(-460,44,335),l=new B(-460,45,355);this._flyToExplicit(l,a,1.4);return}if(e==="mosque_interior"){let a=typeof j<"u"&&j.mosque?j.mosque.x:-480,l=typeof j<"u"&&j.mosque?j.mosque.z:-200,u=new B(a,112,l-20),f=new B(a,110,l+16);this._flyToExplicit(f,u,1.4);return}if(e==="pagoda_interior"){let a=typeof j<"u"&&j.buddhistTemple?j.buddhistTemple.x:560,l=typeof j<"u"&&j.buddhistTemple?j.buddhistTemple.z:-540,u=new B(a,146,l-20),f=new B(a,144,l+16);this._flyToExplicit(f,u,1.4);return}let n=s[e]||s.all,t=n.y!==void 0?n.y:ke(n.x,n.z);Ma.set(n.x,t,n.z),this.flyTo(Ma,n.dist||200,1.4)}flyToCathedral(e="exterior"){let o=typeof j<"u"&&j.cathedral?j.cathedral.x:0,s=typeof j<"u"&&j.cathedral?j.cathedral.z:-687,n=typeof j<"u"&&j.cathedral?j.cathedral.y:182;if(e==="interior"){let t=new B(o,n+34,s-26),a=new B(o,n+32,s+18);this._flyToExplicit(a,t,1.4)}else{let t=new B(o,n+42,s-10),a=new B(o-75,n+68,s+195);this._flyToExplicit(a,t,1.4)}}_flyToExplicit(e,o,s=1.4){this._entranceFlight=null,this.walkMode=!1,this.tourMode=!1,this.world.controls&&(this.world.controls.enabled=!0),this.world._flyTween&&(this.world._flyTween=null),this._flyStartT||(this._flyStartT=new B),this._flyStartP||(this._flyStartP=new B),this._flyEndP||(this._flyEndP=new B),this._flyTarget||(this._flyTarget=new B),this._flyStartT.copy(this.world.controls.target),this._flyStartP.copy(this.world.camera.position),this._flyTarget.copy(o),this._flyEndP.copy(e);let n=this._flyStartT,t=this._flyStartP,a=this._flyEndP,l=this._flyTarget,u=performance.now(),f=s*1e3;this.world._flyTween=()=>{let c=Math.min(1,(performance.now()-u)/f),m=c<.5?2*c*c:1-Math.pow(-2*c+2,2)/2;this.world.controls.target.lerpVectors(n,l,m),this.world.camera.position.lerpVectors(t,a,m),this.world.camera.up.set(0,1,0),this.world._currentRoll=0,c>=1&&(this.world._flyTween=null)}}flyTo(e,o,s=1.2){this._entranceFlight=null,this.walkMode=!1,this.tourMode=!1,this.world.controls&&(this.world.controls.enabled=!0),this.world._flyTween&&(this.world._flyTween=null),this._flyStartT||(this._flyStartT=new B),this._flyStartP||(this._flyStartP=new B),this._flyEndP||(this._flyEndP=new B),this._flyDir||(this._flyDir=new B),this._flyTarget||(this._flyTarget=new B),this._flyStartT.copy(this.world.controls.target),this._flyStartP.copy(this.world.camera.position),this._flyTarget.copy(e),this._flyDir.subVectors(this._flyStartP,this._flyStartT).normalize(),this._flyDir.y<.35&&(this._flyDir.y=.55),this._flyDir.normalize(),this._flyEndP.copy(this._flyTarget).addScaledVector(this._flyDir,o);let n=this._flyStartT,t=this._flyStartP,a=this._flyEndP,l=this._flyTarget,u=performance.now(),f=s*1e3;this.world._flyTween=()=>{let c=Math.min(1,(performance.now()-u)/f),m=c<.5?2*c*c:1-Math.pow(-2*c+2,2)/2;this.world.controls.target.lerpVectors(n,l,m),this.world.camera.position.lerpVectors(t,a,m),this.world.camera.up.set(0,1,0),this.world._currentRoll=0,c>=1&&(this.world._flyTween=null)}}};var Xa=(He,e=!1)=>{if(!He||!Array.isArray(He)||He.length===0)return null;let o=He.filter(f=>f&&f.attributes&&f.attributes.position);if(o.length===0)return null;if(o.length===1)return o[0];let s=!1,n=!1,t=!1,a=!1,l=!1;for(let f of o)f.index?s=!0:n=!0,f.attributes.color&&(t=!0),f.attributes.uv&&(a=!0),f.attributes.normal&&(l=!0);let u=o.map(f=>{let c=f,m=!1,v=s&&n&&f.index,R=l&&!f.attributes.normal||a&&!f.attributes.uv||t&&!f.attributes.color||!t&&f.attributes.color;if(v?(c=f.toNonIndexed(),m=!0):R&&(c=f.clone(),m=!0),l&&!c.attributes.normal&&c.computeVertexNormals(),a&&!c.attributes.uv){let b=c.attributes.position.count,Y=new Float32Array(b*2);c.setAttribute("uv",new ct(Y,2))}if(t&&!c.attributes.color){let b=c.attributes.position.count,Y=new Float32Array(b*3).fill(1);c.setAttribute("color",new ct(Y,3))}else!t&&c.attributes.color&&c.deleteAttribute("color");return c});try{let f=ks(u,e);return u.forEach((c,m)=>{c!==o[m]&&c.dispose()}),f&&o.forEach(c=>c.dispose()),f}catch(f){return console.warn("[world3d] mergeGeometries fallback:",f),null}},ro=Xa;var Ya=pe.leafCard;pe.leafCard=function(...He){let e=Ya.apply(this,He);return e.transparent=!1,e.alphaTest=.5,e.depthWrite=!0,e};var Za=pe.pineNeedles;pe.pineNeedles=function(...He){let e=Za.apply(this,He);return e.transparent=!1,e.alphaTest=.5,e.depthWrite=!0,e};var qa=pe.cypressFoliage;pe.cypressFoliage=function(...He){let e=qa.apply(this,He);return e.transparent=!1,e.alphaTest=.5,e.depthWrite=!0,e};var ja=pe.sakuraBlossom;pe.sakuraBlossom=function(...He){let e=ja.apply(this,He);return e.transparent=!1,e.alphaTest=.45,e.depthWrite=!0,e};var nc=new ye(12563354),nn=new B,Ka=new B,$a=new B,Ja=new B,Qa=new ye,er=new ye,tr=new so,or=new _t;function $o(He,e=.08,o=.28,s=17){if(!He||!He.attributes||!He.attributes.position)return He;let n=He.attributes.position;for(let t=0;t<n.count;t++){let a=n.getX(t),l=n.getY(t),u=n.getZ(t);(isNaN(a)||!isFinite(a))&&(a=0),(isNaN(l)||!isFinite(l))&&(l=0),(isNaN(u)||!isFinite(u))&&(u=0);let f=(jt(a*e+s,u*e+s,2)-.5)*o,c=(jt(l*e*1.5+s*2,a*e+s,2)-.5)*(o*.6),m=isNaN(f)?a:a+f,v=isNaN(c)?l:l+c,R=isNaN(f)?u:u+f;n.setXYZ(t,m,v,R)}return n.needsUpdate=!0,He.computeVertexNormals(),He.computeBoundingSphere&&He.computeBoundingSphere(),He.computeBoundingBox&&He.computeBoundingBox(),He}function ac(He,e=0,o=.45){if(!He||!He.attributes.position)return He;let s=He.attributes.position,n=He.attributes.normal,t=new Float32Array(s.count*3);for(let a=0;a<s.count;a++){let l=s.getY(a),u=n?n.getY(a):0,f=Math.max(0,Math.min(1,(l-e)/4)),c=Math.max(0,u*.5+.5),m=Math.max(.35,Math.min(1,.45+.35*f+.2*c));t[a*3]=m,t[a*3+1]=m,t[a*3+2]=m}return He.setAttribute("color",new ct(t,3)),He}var an=class{constructor(e,o=[],s){this.canvas=e||(typeof document<"u"?document.getElementById("canvas3d")||document.querySelector("canvas#canvas3d")||document.createElement("canvas"):null),this.plots=(o||[]).map(n=>({...n,h:ke(n.x,n.z)})),this.onPlotClick=s,this.clock=new aa,this.assetLoader=new Ds(this),this.lighting=new Bs(this),this.terrain=new Ls(this),this.tourController=new Fs(this),this.pickables=[],this.plotMeshIndex=new Map,this._flyTween=null,this._v3TourPos=new B,this._v3TourTan=new B,this._v3TourLook=new B,this._v3TourTarget=new B,this._tourCamPos=new B,this._currentLook=new B,this._tmpV3=new B,this._v3Tmp1=new B,this._v3Tmp2=new B,this._v3Tmp3=new B,this._v3Tmp4=new B,this._v3WorldUp=new B(0,1,0),this._v3Temp1=nn,this._v3Temp2=Ka,this._v3Temp3=$a,this._v3Temp4=Ja,this._colTemp=Qa,this._colTemp2=er,this._quatTemp=tr,this._mat4Temp=or,this._currentRoll=0,this._tourSpeed=1,this._tourPaused=!1,this._tourSpeedMultiplier=1,this._activeStageIndex=0,this._joystickInput=new kt(0,0),this._origFogColor=new ye(9484504),this._origBgColor=new ye(9484504),this._origFogDensity=65e-6,this._origFogNear=1200,this._origFogFar=18e3,this._isUnderwaterState=!1,this._underwaterBlend=0,this._underwaterTargetFog=new ye(3717344),this._underwaterTargetBg=new ye(2390168),this._currentFogColor=new ye(9484504),this._currentBgColor=new ye(9484504),this._fpsBuffer=new Float32Array(120),this._fpsHead=0,this._fpsCount=0,this._lastFpsTime=0,this._lastFpsHudUpdate=0,this._fpsPill=null,this._fpsTextEl=null,this._renderScale=1,this._qualityTier=Cn(),this._qualityLocked=!!Yo[this._qualityTier],Yo[this._qualityTier]||(this._qualityTier=Us({width:window.innerWidth,memory:navigator.deviceMemory,cores:navigator.hardwareConcurrency,saveData:navigator.connection?.saveData})),this.quality=Yo[this._qualityTier],this._shadowPosition=new B(1/0,1/0,1/0),this._shadowQuaternion=new so,this._lastShadowTime=0,this._benchFrames=0,this._benchTime=0,this._lastScaleChange=0,this._init()}_init(){let e=typeof window<"u"&&(/Mobi|Android/i.test(navigator.userAgent)||window.innerWidth<=768),o=new qn({canvas:this.canvas,antialias:!e,powerPreference:"high-performance",preserveDrawingBuffer:!1,logarithmicDepthBuffer:!0});o.autoClear=!0;let s=this.quality.dpr;o.setPixelRatio(Math.min(window.devicePixelRatio,s)),o.shadowMap.enabled=!0,o.shadowMap.type=Dn,o.shadowMap.autoUpdate=!1,o.shadowMap.needsUpdate=!0,o.toneMapping=Ln,o.toneMappingExposure=.92,o.outputColorSpace=Rs;let n=o.getContext();n&&n.enable&&n.SAMPLE_ALPHA_TO_COVERAGE&&n.enable(n.SAMPLE_ALPHA_TO_COVERAGE),this.renderer=o,this.lighting.useComposer=!1,typeof window<"u"&&(window.__rbvWorld=this);let t=new bs;t.fog=new jn(9484504,65e-6),this.scene=t,console.log("[World3D] scene created");let a=new Yn(35,1,2,7500);a.position.set(1450,1250,2e3),a.lookAt(0,80,550),a.updateProjectionMatrix(),this.camera=a,console.log("[World3D] camera created");let l=new la(a,this.canvas);l.enableDamping=!0,l.dampingFactor=.05,l.minPolarAngle=Math.PI*.02,l.maxPolarAngle=Math.PI*.49,l.minDistance=20,l.maxDistance=2800,l.target.set(0,80,550),l.update(),this.controls=l,this.season=In(),this.lighting.mood="clear",this.lighting._forcedPhase={key:"day",t:.5},this._reflectiveMeshes=[],this._windMaterials=[],this._glowTex=this.assetLoader._buildGlowTexture(),this._fpsFrames=[],this._lastFpsHudUpdate=0,this._lastFpsTime=0,this.lighting._lights(),this.lighting._sky(),this.lighting._stars(),this.lighting._horizon(),this.lighting._cloudScape(),this._ambienceTimer=setInterval(()=>this.lighting.applyAmbience(),6e4),An().then(f=>{this.lighting.mood=f.mood,this.lighting.applyAmbience(),this.onAmbience?.(f,this.season)}).catch(f=>console.log("[world3d] fetchWeather failed:",f));let u;this._resizeHandler=()=>{clearTimeout(u),u=setTimeout(()=>this._resize(),100)},typeof window<"u"&&window.addEventListener("resize",this._resizeHandler),this._visibilityHandler=()=>{document.hidden?(this._resumeOnVisible=this._running,this.stop()):this._resumeOnVisible&&(this._resumeOnVisible=!1,this.start())},document.addEventListener("visibilitychange",this._visibilityHandler),this._resize(),this._running=!0,this._animate()}async initAsync(){this._shadowMaterials=new Set;let e=async(s,n,t=!1)=>{if(await new Promise(l=>setTimeout(l,0)),this._disposed)return;let a=this.scene.children.length;try{await n();for(let l of this.scene.children.slice(a))l.name||(l.name=s),l.traverse(u=>{if(!u.isMesh||!u.material)return;let f=Array.isArray(u.material)?u.material:[u.material];for(let c of f)!c.isMeshStandardMaterial&&!c.isMeshPhongMaterial&&!c.isMeshLambertMaterial||this._shadowMaterials.has(c)||(this.lighting.csm?.setupMaterial(c),this._shadowMaterials.add(c))});this.renderer.shadowMap.needsUpdate=!0}catch(l){if(t)throw l;console.warn(`[world] ${s} unavailable`,l)}},o=this.terrain;await e("Terrain",()=>o._terrain(),!0),await e("Mountains",()=>this._backgroundMountains()),await e("Water",()=>o._water()),await e("River",()=>o._river()),await e("roads",()=>o._roads()),await e("gate",()=>o._gate()),await e("plaza",()=>o._plaza()),await e("rainbowBridge",()=>o._rainbowBridge()),await e("vegetation",()=>o._vegetation()),await e("plots",()=>this._plots(),!0),this._picking(),this._initAmbienceControls(),this.tourController._setupWalkControls(),this.tourController._initWalkHUD(),this.tourController._initFPSHUD(),this.tourController.setMode("orbit"),this.lighting.applyAmbience(),this._resize(),await this.warmup(),!this._disposed&&(this.assetLoader._loadHDRI(),this.detailsReady=(async()=>{await new Promise(s=>setTimeout(s,250));for(let[s,n]of[["mountainWaterfall","_mountainWaterfall"],["oceanWaterfall","_oceanWaterfall"],["coastalCliff","_coastalCliff"],["highlandSanctuary","_highlandSanctuary"],["pawprints","_pawprints"],["meadowCarpet","_meadowCarpet"],["blooms","_blooms"],["districtFeatures","_districtFeatures"],["sanctuaryTree","_sanctuaryTree"],["riverLanterns","_riverLanterns3D"],["celestialMotes","_celestialMotes"],["universalCathedral","_universalCathedral"],["moorishMosque","_moorishMosque"],["buddhistPagoda","_buddhistPagoda"],["kayaIsland","_kayaIsland"],["underwaterWorld","_underwaterWorld"]]){if(this._disposed)break;await e(s,()=>o[n]())}this._disposed||this.lighting.applyAmbience()})().catch(s=>console.warn("[world] detail streaming stopped",s)))}startDroneTour(e){(window.VeoTour||window.veoTour)?.stop(),this._flyTween=null,this.tourController.setMode("orbit"),this.flight||=new zs(this),this.flight.start(e),this.cameraMode="tour",document.querySelectorAll("#sanctuaryWalkPill [data-cam-mode]").forEach(o=>{o.classList.toggle("is-active",o.dataset.camMode==="tour")}),this.start()}setMode(e){if(e==="tour"){this.startDroneTour();return}this.flight?.stop(),(window.VeoTour||window.veoTour)?.stop(),this.tourController.setMode(e)}start(){this._running=!0,this.clock&&!this.clock.running&&this.clock.start(),this._resize(),this._raf||(this._raf=requestAnimationFrame(()=>this._animate()))}stop(){this._running=!1,this.clock.stop(),this._lastFpsTime=0,this._raf&&(cancelAnimationFrame(this._raf),this._raf=null)}animate(){this._animate()}resize(){this._resize()}async warmup(){if(!(!this.renderer||!this.scene||!this.camera))try{this.lighting._updateEnvironment(),typeof this.renderer.compileAsync=="function"?await this.renderer.compileAsync(this.scene,this.camera):typeof this.renderer.compile=="function"&&this.renderer.compile(this.scene,this.camera),this.lighting.useComposer&&this.lighting.composer?this.lighting.composer.render():this.renderer.render(this.scene,this.camera)}catch(e){console.log("[world3d] warmup error:",e)}}_resize(){let e=this.canvas.clientWidth||this.canvas.parentElement?.clientWidth||window.innerWidth,o=this.canvas.clientHeight||this.canvas.parentElement?.clientHeight||window.innerHeight;if(e<100||o<100)return;let s=typeof window<"u"&&(/Mobi|Android/i.test(navigator.userAgent)||window.innerWidth<=768),n=this.quality.dpr,t=Math.min(window.devicePixelRatio||1,n)*this._renderScale;this.renderer.setPixelRatio(t),this.renderer.setSize(e,o,!0);let a=this.quality.post&&this._renderScale>=.8;a&&!this.lighting.composer&&this.lighting._composer();let l=this.lighting.composer;this.lighting.useComposer=a&&!!l,l&&(l.setPixelRatio(t),l.setSize(e,o),this.lighting.bloomPass?.setSize(Math.ceil(e*t/2),Math.ceil(o*t/2)),this.lighting._fxaaPass.uniforms.resolution.value.set(1/(e*t),1/(o*t))),this.camera.aspect=e/o,this.camera.updateProjectionMatrix(),this.lighting.csm?.updateFrustums(),this.renderer.shadowMap.needsUpdate=!0,this.lighting._cinematicPass?.uniforms?.uResolution&&this.lighting._cinematicPass.uniforms.uResolution.value.set(e,o)}async _backgroundMountains(){let e=new bo(2200,5300,this.quality.mountain,64);e.rotateX(-Math.PI/2);let o=e.attributes.position;for(let t=0;t<o.count;t++)t%2048===0&&await new Promise(a=>setTimeout(a,0)),o.setY(t,bn(o.getX(t),o.getZ(t)));e.computeVertexNormals(),e.setAttribute("aCreviceAO",new ct(new Float32Array(o.count).fill(.9),1)),e.computeBoundingSphere();let s=Gs(this.renderer,{snowMin:950,snowMax:1420}),n=new r(e,s);n.name="Mountain terrain",n.receiveShadow=!0,this.scene.add(n)}_plots(){let e=[],o=[];for(let N of this.plots){if(!N.quaternion){let Ce=ke(N.x,N.z-.5),Pe=ke(N.x,N.z+.5),D=ke(N.x-.5,N.z),U=ke(N.x+.5,N.z);N.normal=new B(D-U,2*.5,Ce-Pe).normalize(),N.quaternion=new so().setFromUnitVectors(new B(0,1,0),N.normal).multiply(new so().setFromAxisAngle(new B(0,1,0),N.rot))}(N.status==="available"?e:o).push(N)}let s=new Lt,n=document.createElement("canvas");n.width=n.height=128;let t=n.getContext("2d"),a=t.createRadialGradient(64,64,8,64,64,64);a.addColorStop(0,"rgba(0, 0, 0, 0.68)"),a.addColorStop(.5,"rgba(0, 0, 0, 0.32)"),a.addColorStop(.85,"rgba(0, 0, 0, 0.08)"),a.addColorStop(1,"rgba(0, 0, 0, 0)"),t.fillStyle=a,t.fillRect(0,0,128,128);let l=new Kt(n),u=new Ct({map:l,transparent:!0,depthWrite:!1}),f=new Mt({transparent:!0,depthWrite:!1,side:wt,blending:Ht,uniforms:{uTime:{value:0}},vertexShader:`
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
      `});this._beaconMat=f;let c=(N,Te=!1)=>{if(!N.length)return null;let Ce=new ce(1,.4,1);Ce.translate(0,.2,0),Ce.computeBoundingSphere();let Pe=new Ct({visible:!1}),D=new ut(Ce,Pe,N.length);if(N.forEach((U,G)=>{let[A,z]=Po[U.size]||[10,14],F=ke(U.x,U.z);s.position.set(U.x,F+.15,U.z),s.quaternion.copy(U.quaternion),s.scale.set(A,1,z),s.updateMatrix(),D.setMatrixAt(G,s.matrix)}),D.instanceMatrix.needsUpdate=!0,typeof D.computeBoundingSphere=="function"&&D.computeBoundingSphere(),typeof D.computeBoundingBox=="function"&&D.computeBoundingBox(),D.frustumCulled=!1,this.scene.add(D),!Te){let U=new rt(1,1);U.rotateX(-Math.PI/2),U.computeBoundingSphere();let G=new ut(U,u,N.length);N.forEach((we,_e)=>{let[Ze,Oe]=Po[we.size]||[10,14],ot=ke(we.x,we.z);s.position.set(we.x,ot+.18,we.z),s.quaternion.copy(we.quaternion),s.scale.set(Ze*1.35,1,Oe*1.35),s.updateMatrix(),G.setMatrixAt(_e,s.matrix)}),G.instanceMatrix.needsUpdate=!0,G.frustumCulled=!1,this.scene.add(G),this.terrain._decorMeshes=this.terrain._decorMeshes||[],this.terrain._decorMeshes.push(G);let A=new ce(1,.35,1);A.translate(0,.18,0),A.computeBoundingSphere();let z=pe.agedCaenLimestone(2),F=new ut(A,z,N.length),Q=new ce(1,.08,1);Q.translate(0,.36,0),Q.computeBoundingSphere();let ue=pe.groundDetail(2),ge=new ut(Q,ue,N.length);N.forEach((we,_e)=>{let[Ze,Oe]=Po[we.size]||[10,14],ot=ke(we.x,we.z);s.position.set(we.x,ot+.15,we.z),s.quaternion.copy(we.quaternion),s.scale.set(Ze*.96,1,Oe*.96),s.updateMatrix(),F.setMatrixAt(_e,s.matrix),s.scale.set(Ze*.88,1,Oe*.88),s.updateMatrix(),ge.setMatrixAt(_e,s.matrix)}),F.instanceMatrix.needsUpdate=!0,ge.instanceMatrix.needsUpdate=!0,F.receiveShadow=F.castShadow=!0,ge.receiveShadow=!0,F.frustumCulled=ge.frustumCulled=!1,this.scene.add(F),this.scene.add(ge),this.terrain._decorMeshes.push(F,ge)}if(Te){let U=new rt(1,1);U.rotateX(-Math.PI/2),U.computeBoundingSphere();let G=new ut(U,f,N.length);G.instanceColor=new Ft(new Float32Array(N.length*3),3);let A=new L(.12,.16,.45,6);A.translate(0,.18,0),A.computeBoundingSphere();let z=new Ot({color:16777215,emissive:0,emissiveIntensity:0,roughness:.35,metalness:.8}),F=new ut(A,z,N.length*4);F.instanceColor=new Ft(new Float32Array(N.length*4*3),3);let Q={1:{corner:new ye(9072698),beacon:new ye(13942395)},2:{corner:new ye(10529461),beacon:new ye(13162728)},3:{corner:new ye(13938487),beacon:new ye(16771696)}},ue=0;N.forEach((ge,we)=>{let _e=ge.tier||(ge.size==="estate"?3:ge.size==="premium"?2:1),Ze=Q[_e]||Q[1],[Oe,ot]=Po[ge.size]||[10,14],vt=ke(ge.x,ge.z);s.position.set(ge.x,vt+.2,ge.z),s.quaternion.copy(ge.quaternion),s.scale.set(Math.max(Oe,ot)*1.2,1,Math.max(Oe,ot)*1.2),s.updateMatrix(),G.setMatrixAt(we,s.matrix),G.setColorAt(we,Ze.beacon);let At=Oe*.5-.2,pt=ot*.5-.2,Tt=[[-At,-pt],[At,-pt],[-At,pt],[At,pt]];for(let[xt,Pt]of Tt){let St=xt*Math.cos(ge.rot)+Pt*Math.sin(ge.rot),Gt=-xt*Math.sin(ge.rot)+Pt*Math.cos(ge.rot),Nt=ke(ge.x+St,ge.z+Gt);s.position.set(ge.x+St,Nt+.15,ge.z+Gt),s.rotation.set(0,0,0),s.scale.set(1,1,1),s.updateMatrix(),F.setMatrixAt(ue,s.matrix),F.setColorAt(ue,Ze.corner),ue++}}),G.instanceMatrix.needsUpdate=!0,G.instanceColor.needsUpdate=!0,G.frustumCulled=!1,this.scene.add(G),F.instanceMatrix.needsUpdate=!0,F.instanceColor.needsUpdate=!0,F.castShadow=!0,F.frustumCulled=!1,this.scene.add(F),this.terrain._decorMeshes=this.terrain._decorMeshes||[],this.terrain._decorMeshes.push(G,F)}return this.pickables.push(D),this.plotMeshIndex.set(D,N),D};this.availMesh=c(e,!0),this.occupMesh=c(o,!1);let m={headstone:[0,-2],flowers:[0,3.5],tree:[-3.8,-3.8],bench:[4.2,-1],lantern:[-4.2,-1],candle:[1.5,3.2],ball:[-1.5,3.2],bone:[1.8,3.8],wreath:[0,2.5],fountain:[-4,-1],memorial_crystal:[0,0],coral_brain:[-2.8,-2.8],coral_staghorn:[2.8,-3.5],sea_anemone:[-1.8,2.8],crystal_lotus:[0,0],jade_stones:[-1.8,2.2],lily_pad:[2.2,3.2],mossy_boulder:[0,0],cactus:[0,0]},v={},R=(N,Te,Ce={},Pe=1,D=null,U=null)=>{let[G,A]=m[Ce.type||N]||[0,0],z=D??Ce.dx??G,F=U??Ce.dz??A,Q=z*Math.cos(Te.rot)+F*Math.sin(Te.rot),ue=-z*Math.sin(Te.rot)+F*Math.cos(Te.rot),ge=ke(Te.x+Q,Te.z+ue);s.position.set(Te.x+Q,ge,Te.z+ue),s.quaternion.copy(Te.quaternion),s.scale.setScalar(Pe),s.updateMatrix(),v[N]||={mats:[],colors:[]},v[N].mats.push(s.matrix.clone());let we={flowers:14051978,tree:6197070,ball:13166666};v[N].colors.push(Ce.color||we[Ce.type]||null)};for(let N of o){let Te=N.district==="kaya_reef",Ce=N.district==="lake_submerged",Pe=N.district==="highland_rapids",D=N.tier||(N.size==="estate"?3:N.size==="premium"?2:1),[U,G]=Po[N.size]||[10,14],A=U*.5-1.2,z=G*.5-1.5;Te?(R("memorial_crystal",N,{},1.3,0,0),R("coral_brain",N,{},1.1,-A*.7,-z*.6),R("coral_staghorn",N,{},1.2,A*.7,-z*.7),R("sea_anemone",N,{},1,-A*.5,z*.6)):Ce?(R("crystal_lotus",N,{},1.2,0,0),R("jade_stones",N,{},1,-A*.6,-z*.5),R("lily_pad",N,{},1.4,A*.6,z*.6)):Pe?R("mossy_boulder",N,{},1.4,0,-z*.5):N.district==="desert"?(R("cactus",N,{},1,0,-z*.5),R("hs_classic",N,{type:"headstone",style:"classic"},1,0,-z+1.2),R("flowers",N,{type:"flowers"},1,0,z-1.5),D>1&&R("bench",N,{type:"bench"},1,A*.7,-z*.2),R("flowers",N,{type:"flowers"},1.1,A*.5,z*.5)):D===1?(R("hs_classic",N,{type:"headstone",style:"classic"},1,0,-z+1.2),R("flowers",N,{type:"flowers"},1,0,z-1.5),R("candle",N,{type:"candle"},1,-A*.5,z-1.5)):D===2?(R("tree",N,{type:"tree"},1.3,-A*.6,-z*.6),R("hs_slab",N,{type:"headstone",style:"slab"},1.1,0,-z*.2),R("flowers",N,{type:"flowers"},1.2,A*.5,z*.6),R("bench",N,{type:"bench"},1,A*.7,-z*.2),R("lantern",N,{type:"lantern"},1,-A*.6,z*.6)):D===3&&(R("hs_obelisk",N,{type:"headstone",style:"obelisk"},1.3,0,-z*.4),R("lantern",N,{type:"lantern"},1.1,-A*.7,-z*.4),R("lantern",N,{type:"lantern"},1.1,A*.7,-z*.4),R("fountain",N,{type:"fountain"},1,-A*.6,z*.6),R("fountain_water",N,{type:"fountain"},1,-A*.6,z*.6),R("wreath",N,{type:"wreath"},1.2,A*.6,z*.6))}let b=pe.granite(1),Y=pe.honedCarraraMarble(1),x=(N,Te,Ce,Pe=0,D=!1)=>{let U=v[N];if(!U?.mats.length)return;Te.computeBoundingSphere&&Te.computeBoundingSphere();let G=new ut(Te,Ce,U.mats.length);D&&(G.instanceColor=new Ft(new Float32Array(U.mats.length*3),3));let A=new _t,z=new _t().makeTranslation(0,Pe,0),F=new ye;U.mats.forEach((Q,ue)=>{A.copy(Q).multiply(z),G.setMatrixAt(ue,A),D&&G.setColorAt(ue,F.setHex(U.colors[ue]??16777215))}),G.instanceMatrix.needsUpdate=!0,D&&G.instanceColor&&(G.instanceColor.needsUpdate=!0),typeof G.computeBoundingSphere=="function"&&G.computeBoundingSphere(),typeof G.computeBoundingBox=="function"&&G.computeBoundingBox(),G.castShadow=!0,G.receiveShadow=!0,G.frustumCulled=!1,this.scene.add(G),this.terrain._decorMeshes.push(G)};this.terrain._decorMeshes=this.terrain._decorMeshes||[];let H=(()=>{let N=[],Te=new ce(4.8,.45,1.8);Te.translate(0,.225,0),N.push(Te);let Ce=new ce(4,3.6,.9);Ce.translate(0,2.25,0),N.push(Ce);let Pe=new L(2,2,.9,16,1,!1,0,Math.PI);Pe.rotateZ(Math.PI/2),Pe.rotateY(Math.PI/2),Pe.translate(0,4.05,0),N.push(Pe);let D=new ce(3.2,2.2,.08);return D.translate(0,2.35,.46),N.push(D),$o(ro(N,!1)||Ce,.06,.12,51)})(),y=(()=>{let N=[],Te=new ce(4.4,.5,4.4);Te.translate(0,.25,0),N.push(Te);let Ce=new ce(3.4,.5,3.4);Ce.translate(0,.75,0),N.push(Ce);let Pe=new L(1.2,1.8,6.2,4);Pe.rotateY(Math.PI/4),Pe.translate(0,4.1,0),N.push(Pe);let D=new lt(1.2,1.5,4);return D.rotateY(Math.PI/4),D.translate(0,7.95,0),N.push(D),$o(ro(N,!1)||Te,.06,.1,57)})(),q=(()=>{let N=[],Te=new ce(6.4,.35,4.4);Te.translate(0,.175,0),N.push(Te);let Ce=new ce(5.4,.35,3.4);Ce.translate(0,.4,0),N.push(Ce);let Pe=new ce(4.2,.04,2.4);return Pe.translate(0,.58,0),N.push(Pe),$o(ro(N,!1)||Te,.05,.1,63)})();x("hs_classic",H,Y,0),x("hs_obelisk",y,Y,0),x("hs_slab",q,b,0);let M=(()=>{let N=[],Te=new L(.4,.25,1.2,12);Te.translate(0,.6,0),N.push(Te);let Ce=new dt(.42,.06,8,16);Ce.rotateX(Math.PI/2),Ce.translate(0,1.2,0),N.push(Ce);for(let Pe=0;Pe<4;Pe++){let D=Pe/4*Math.PI,U=new rt(1.6,1.8);U.translate(0,1.85,0),U.rotateY(D),N.push(U)}return ro(N,!1)||Te})(),V=(()=>{let N=[],Te=new dt(1.1,.32,12,24);Te.rotateX(-.35),Te.translate(0,.38,0),N.push(Te);for(let Ce=0;Ce<8;Ce++){let Pe=Ce/8*Math.PI*2,D=new at(.22,8,6);D.scale(1,.6,1),D.rotateX(-.35),D.translate(Math.cos(Pe)*1.1,.38+Math.sin(Pe)*.4,Math.sin(Pe)*.85),N.push(D)}return ro(N,!1)||Te})(),$=(()=>{let N=[],Te=new ce(1.1,.18,1.1);Te.translate(0,.09,0),N.push(Te);let Ce=new L(.35,.48,1.8,6);Ce.translate(0,1.05,0),N.push(Ce);let Pe=new lt(.52,.65,6);Pe.translate(0,2.25,0),N.push(Pe);let D=new dt(.18,.04,6,12);return D.translate(0,2.65,0),N.push(D),ro(N,!1)||Te})(),ee=new Ot({color:3812382,emissive:16758861,emissiveIntensity:2.4,roughness:.35,metalness:.85}),X=(()=>{let N=[],Te=new L(.55,.65,.12,12);Te.translate(0,.06,0),N.push(Te);let Ce=new L(.28,.32,1,12);Ce.translate(0,.62,0),N.push(Ce);let Pe=new lt(.12,.35,8);return Pe.translate(0,1.25,0),N.push(Pe),ro(N,!1)||Ce})(),I=(()=>{let N=pe.wax(1);return N.emissive=new ye(16762982),N.emissiveIntensity=2.4,N})(),h=(N,Te,Ce=.4)=>{let Pe=new rt(N,Te,2,2),D=Pe.attributes.position;for(let U=0;U<D.count;U++){let G=D.getX(U),A=D.getY(U),z=G/(N*.5),F=A/(Te*.5);D.setZ(U,(1-z*z)*Ce*(1-F*.25))}return Pe.computeVertexNormals(),Pe},g=(()=>{let N=[],Te=yt(1234),Ce=[[0,5.8,0,2.4,12],[1.4,4.8,.8,1.8,9],[-1.4,4.8,-.8,1.8,9],[.6,5,1.4,1.8,9],[-.6,5,-1.4,1.8,9]];for(let[Pe,D,U,G,A]of Ce)for(let z=0;z<A;z++){let F=Math.acos(1-2*Te()),Q=Te()*Math.PI*2,ue=G*(.35+Te()*.65),ge=Pe+Math.sin(F)*Math.cos(Q)*ue,we=D+Math.cos(F)*(ue*.8),_e=U+Math.sin(F)*Math.sin(Q)*ue,Ze=2.4+Te()*1,Oe=h(Ze,Ze,.4);Oe.rotateX((Te()-.5)*Math.PI*.85),Oe.rotateY(Te()*Math.PI*2),Oe.rotateZ((Te()-.5)*.6),Oe.translate(ge,we,_e),N.push(Oe)}return ro(N,!1)||N[0]})(),C=(()=>{let N=[],Te=new L(.38,.85,1.2,8);Te.translate(0,.6,0),N.push(Te);let Ce=new L(.24,.38,4,8);Ce.translate(0,2.6,0),N.push(Ce);let Pe=new L(.12,.22,2.4,6);Pe.rotateZ(.58),Pe.translate(.65,3.8,0),N.push(Pe);let D=new L(.12,.22,2.2,6);D.rotateZ(-.52),D.rotateY(1.8),D.translate(-.55,3.6,.3),N.push(D);let U=new L(.1,.18,2,5);return U.rotateZ(.45),U.rotateY(-1.5),U.translate(.2,4.2,-.5),N.push(U),$o(ro(N,!1)||Ce,.12,.18,44)})();x("flowers",M,pe.petal(1,16777215),0,!0),x("tree",C,pe.bark(1),0),v.tree&&(v.tree_crown={mats:v.tree.mats,colors:v.tree.colors},x("tree_crown",g,pe.leafCard(7780446),0,!0));let w=(()=>{let N=new ce(4.6,.25,1.4);N.translate(0,1.2,0);let Te=new ce(4.6,1.1,.2);Te.translate(0,1.85,-.6);let Ce=new ce(.3,1.2,1.2);Ce.translate(-2,.6,0);let Pe=new ce(.3,1.2,1.2);return Pe.translate(2,.6,0),ro([N,Te,Ce,Pe],!1)||N})();x("bench",w,pe.timber(1.2),0);let i=(()=>{let N=[],Te=new L(1.4,1.8,.4,16);Te.translate(0,.2,0),N.push(Te);let Ce=new L(.8,1.1,1.2,16);Ce.translate(0,1,0),N.push(Ce);let Pe=new L(2.6,1.4,.9,24);return Pe.translate(0,1.95,0),N.push(Pe),ro(N,!1)||Te})(),_=(()=>{let N=new $t(2.3,24);return N.rotateX(-Math.PI/2),N.translate(0,2.25,0),N})();x("lantern",$,ee,0),x("fountain",i,Y,0),x("fountain_water",_,this.terrain.waterMat,0),x("candle",X,I,0),x("wreath",V,pe.foliage(1,4090693),0);let S=(()=>{let N=new L(.8,1.4,4.2,6);N.translate(0,2.1,0);let Te=new lt(.8,1.6,6);return Te.translate(0,5,0),ro([N,Te],!1)||N})(),W=new Ot({color:440020,emissive:2282478,emissiveIntensity:1.8,roughness:.15,metalness:.2});x("memorial_crystal",S,W,0);let ae=(()=>{let N=new Vt(1.4,1);return N.translate(0,1.2,0),$o(N,.15,.2,81)})(),p=new Ot({color:16007006,roughness:.85,metalness:.05});x("coral_brain",ae,p,0);let E=(()=>{let N=[];for(let Te=0;Te<6;Te++){let Ce=new L(.15,.3,3.2,6);Ce.rotateZ((Te-2.5)*.25),Ce.rotateY(Te*1),Ce.translate(Math.sin(Te)*.6,1.6,Math.cos(Te)*.6),N.push(Ce)}return ro(N,!1)||N[0]})(),T=new Ot({color:16486972,roughness:.8,metalness:.05});x("coral_staghorn",E,T,0);let P=(()=>{let N=new at(1.2,12,8,0,Math.PI*2,0,Math.PI*.6);return N.translate(0,.6,0),N})(),te=new Ot({color:11032055,emissive:12616956,emissiveIntensity:.8,roughness:.5});x("sea_anemone",P,te,0);let se=(()=>{let N=[];for(let Te=0;Te<8;Te++){let Ce=new lt(.8,2.2,4);Ce.rotateZ(.6),Ce.rotateY(Te/8*Math.PI*2),Ce.translate(0,.8,0),N.push(Ce)}return ro(N,!1)||N[0]})(),oe=new Ot({color:3718648,emissive:8246268,emissiveIntensity:1.4,roughness:.2});x("crystal_lotus",se,oe,0);let ne=(()=>{let N=new Vt(1.2,0);return N.translate(0,.6,0),N})(),k=new Ot({color:1096065,roughness:.25,metalness:.3});x("jade_stones",ne,k,0);let O=(()=>{let N=new $t(1.8,16);return N.rotateX(-Math.PI/2),N.translate(0,.04,0),N})(),ie=pe.foliage(1,1409085);x("lily_pad",O,ie,0);let ve=(()=>{let N=new Vt(2,1);return N.translate(0,1.4,0),$o(N,.18,.25,93)})(),De=pe.rockCliff(2);x("mossy_boulder",ve,De,0);let Ue=(()=>{let N=new L(.3,.3,2.5,8);N.translate(0,1.25,0);let Te=new L(.2,.2,1,8);return Te.rotateZ(Math.PI/4),Te.translate(.5,1.5,0),ro([N,Te],!1)})(),Ke=new Qn({color:4884522});x("cactus",Ue,Ke,0),this.selRing=new r(new bo(9,12,32),new Ct({color:16766826,side:wt,transparent:!0,opacity:.95})),this.selRing.rotation.x=-Math.PI/2,this.selRing.visible=!1,this.scene.add(this.selRing),o.length>0&&(this.memorialManager=new Is(this),this.memorialManager.init(o))}_picking(){let e=new ra,o=new kt,s=null,n=document.getElementById("plotHoverTooltip"),t=document.getElementById("phtIcon"),a=document.getElementById("phtName"),l=document.getElementById("phtSub"),u=document.getElementById("phtEpitaph"),f=document.getElementById("phtBadge"),c=document.getElementById("phtAction");this._onPointerDown=m=>{s=[m.clientX,m.clientY]},this._onPointerUp=m=>{if(this.tourController.tourMode||!s||Math.hypot(m.clientX-s[0],m.clientY-s[1])>6)return;let v=this.canvas.getBoundingClientRect();o.x=(m.clientX-v.left)/v.width*2-1,o.y=-((m.clientY-v.top)/v.height)*2+1,e.setFromCamera(o,this.camera);let R=e.intersectObjects(this.pickables);if(R.length){let b=R[0],x=this.plotMeshIndex.get(b.object)?.[b.instanceId];if(x){n&&n.classList.add("hidden"),this.selectPlot(x),this.onPlotClick?.(x);return}}},this._onPointerMove=m=>{if(this.tourController.tourMode){n&&n.classList.add("hidden"),this.canvas.style.cursor="default";return}let v=this.canvas.getBoundingClientRect();o.x=(m.clientX-v.left)/v.width*2-1,o.y=-((m.clientY-v.top)/v.height)*2+1,e.setFromCamera(o,this.camera);let R=e.intersectObjects(this.pickables);if(R.length&&n){let b=R[0],x=this.plotMeshIndex.get(b.object)?.[b.instanceId];if(x){this.canvas.style.cursor="pointer";let H=Hn[x.district],y=x.memorial||{};if(x.status==="occupied"){let ee=Gn(y.species||"dog");if(t&&(t.innerHTML=zn(ee,{size:20})),a&&(a.textContent=y.petName||"Beloved Friend"),l&&(l.textContent=`${y.species||"Companion"} \xB7 Plot ${x.id} (${H?.name||"Sanctuary"})`),u&&(u.textContent=y.epitaph?`\u201C${y.epitaph}\u201D`:"\u201CForever loved and remembered.\u201D",u.style.display=""),f){let X=Pn(y.charity)||"Animal Rescue Fund";f.innerHTML=`${Ts("heart",{size:12})} ${X}`}c&&(c.textContent="View Memorial \u2192")}else t&&(t.innerHTML=Ts("grave",{size:18})),a&&(a.textContent=`Available Plot ${x.id}`),l&&(l.textContent=`${H?.name||"Sanctuary"} \xB7 ${Po[x.size]?Po[x.size].join("\xD7")+"m":"Standard"}`),u&&(u.textContent=H?.blurb||"A peaceful resting place surrounded by nature and gentle music.",u.style.display=""),f&&(f.innerHTML=`${Ts("sparkle",{size:12})} $${x.price} (one-time)`),c&&(c.textContent="Reserve Plot \u2192");let q=290,M=150,V=m.clientX+16,$=m.clientY+16;V+q>window.innerWidth-20&&(V=m.clientX-q-16),$+M>window.innerHeight-20&&($=m.clientY-M-16),n.style.left=`${V}px`,n.style.top=`${$}px`,n.style.transform="none",n.classList.remove("hidden");return}}this.canvas.style.cursor="default",n&&n.classList.add("hidden")},this._onPointerLeave=()=>{this.canvas.style.cursor="default",n&&n.classList.add("hidden")},this.canvas.addEventListener("pointerdown",this._onPointerDown),this.canvas.addEventListener("pointerup",this._onPointerUp),this.canvas.addEventListener("pointermove",this._onPointerMove),this.canvas.addEventListener("pointerleave",this._onPointerLeave)}_initAmbienceControls(){let e=document.getElementById("sanctuaryAmbiencePill");if(!e)return;let o=this.lighting._forcedPhase?.key||(Zo?Zo().key:"sunlit");e.querySelectorAll(".sap-btn[data-phase]").forEach(s=>s.classList.toggle("is-active",s.dataset.phase===o||o==="sunlit"&&s.dataset.phase==="day")),e.querySelectorAll(".sap-btn[data-mood]").forEach(s=>s.classList.toggle("is-active",s.dataset.mood===this.lighting.mood)),e.querySelectorAll("button[data-phase]").forEach(s=>{s.onclick=n=>{n.stopPropagation(),e.querySelectorAll(".sap-btn").forEach(a=>a.classList.remove("is-active")),s.classList.add("is-active");let t=s.dataset.phase;this.lighting.forcePhase(t),window.Theme&&window.Theme.forcePhase?.(t)}}),e.querySelectorAll("button[data-mood]").forEach(s=>{s.onclick=n=>{n.stopPropagation();let t=s.dataset.mood;t==="blessing"?(e.querySelectorAll(".sap-btn").forEach(a=>a.classList.remove("is-active")),s.classList.add("is-active"),this.lighting.forcePhase("blessing"),window.Theme&&(window.Theme.forcePhase?.("blessing"),window.Theme.setMood?.("blessing"))):(this.lighting.mood===t?(this.lighting.mood="clear",s.classList.remove("is-active")):(this.lighting.mood=t,s.classList.add("is-active")),this.lighting.applyAmbience(),window.Theme&&window.Theme.setMood?.(this.lighting.mood))}})}setQuality(e,o=!1){if(e==="auto"){if(this._qualityLocked=!1,e=Us({width:window.innerWidth,memory:navigator.deviceMemory,cores:navigator.hardwareConcurrency}),o)try{localStorage.setItem("ev_quality","auto")}catch{}}else if(Yo[e]){if(o){this._qualityLocked=!0;try{localStorage.setItem("ev_quality",e)}catch{}}}else return;this._qualityTier=e,this.quality=Yo[e];let s=this.quality.shadowSize;for(let n of this.lighting.csm?.lights||[])n.shadow.mapSize.width!==s&&(n.shadow.mapSize.set(s,s),n.shadow.map?.dispose(),n.shadow.map=null);this._resize()}_updateAdaptivePerformance(){let e=performance.now();if(this._qualityLocked||this._fpsCount<60||e-this._lastScaleChange<4e3)return;this._lastScaleChange=e;let o=0;for(let n=0;n<60;n++)o+=this._fpsBuffer[(this._fpsHead-1-n+120)%120];let s=Sn(this._renderScale,o/60);s!==this._renderScale&&(this._renderScale=s,this._resize())}_optimizeScene(){this.scene.updateMatrixWorld(!0);let e=new Map,o=[];this.scene.traverse(n=>{if(!n.isMesh||n.isInstancedMesh||n.userData&&(n.userData.speedX!==void 0||n.userData.phase!==void 0)||n.name&&(n.name.includes("Water")||n.name.includes("Sky")||n.name.includes("Cloud")||n.name.includes("Terrain"))||n.material&&(n.material.transparent||n.material.opacity<1||n.material.name&&(n.material.name.toLowerCase().includes("water")||n.material.name.toLowerCase().includes("sky")))||Array.isArray(n.material)||!n.geometry||!n.geometry.attributes||!n.geometry.attributes.position)return;if(n.geometry.attributes.normal||n.geometry.computeVertexNormals(),!n.geometry.attributes.uv){let c=new Float32Array(n.geometry.attributes.position.count*2);n.geometry.setAttribute("uv",new ct(c,2))}let t=new B;n.getWorldPosition(t);let a=Math.floor(t.x/150),l=Math.floor(t.z/150),f=`${n.material.uuid}_${a}_${l}`;e.has(f)||e.set(f,{material:n.material,meshes:[]}),e.get(f).meshes.push(n)});let s=0;for(let[n,t]of e.entries()){if(t.meshes.length<2)continue;let a=[],l=0,u=()=>{if(a.length===0||a.length===1)return;let c=ro(a,!1);if(c){let m=new r(c,t.material);m.castShadow=!0,m.receiveShadow=!0,m.name="MergedStaticChunk_"+s++,this.scene.add(m);for(let v of f)v.removeFromParent(),v.geometry&&v.geometry.dispose()}for(let m of a)m.dispose();a=[],l=0,f=[]},f=[];for(let c of t.meshes){let m=c.geometry.clone();if(m.index){let v=m.toNonIndexed();m.dispose(),m=v}for(let v in m.attributes)v!=="position"&&v!=="normal"&&v!=="uv"&&m.deleteAttribute(v);m.applyMatrix4(c.matrixWorld),a.push(m),l+=m.attributes.position.count,f.push(c),o.push(c),l>3e5&&u()}u()}console.log("[optimizer] Merged "+o.length+" meshes into "+s+" chunks.")}selectPlot(e){if(!e){this.selRing.visible=!1;return}this.flight?.active&&(this.flight.stop(),this.tourController.setMode("orbit")),this.selRing.visible=!0,this.selRing.position.set(e.x,e.h+.05,e.z),nn.set(e.x,e.h,e.z),this.tourController.flyTo(nn,120,.9)}_animate(){if(!this._running){this._raf=null;return}if(this._raf=requestAnimationFrame(()=>this._animate()),typeof document<"u"&&document.hidden)return;typeof document<"u"&&!this._view3dEl&&(this._view3dEl=document.getElementById("view3d"));let e=this._view3dEl;if(!(e&&(e.style.display==="none"||e.classList.contains("hidden"))&&!e.classList.contains("is-entering"))&&!(!this.renderer||!this.scene||!this.camera))try{let o=performance.now();if(this._lastFpsTime){let h=o-this._lastFpsTime;h>0&&h<500&&(this._fpsBuffer[this._fpsHead]=h,this._fpsHead=(this._fpsHead+1)%120,this._fpsCount<120&&this._fpsCount++)}if(this._lastFpsTime=o,o-this._lastFpsHudUpdate>=200&&this._fpsCount>=5){this._lastFpsHudUpdate=o;let h=0;for(let i=0;i<this._fpsCount;i++)h+=this._fpsBuffer[i];let g=h/this._fpsCount,C=Math.min(240,Math.round(1e3/g)),w=Math.round(g*10)/10;(!this._fpsPill||!this._fpsTextEl)&&this.tourController._initFPSHUD(),this._fpsTextEl&&(this._fpsTextEl.innerHTML=`<span class="sfp-fps">${C} FPS</span><span class="sfp-sep">\xB7</span><span class="sfp-ms">${w}ms</span>`),this._fpsPill&&(C>=115?this._fpsPill.className="sanctuary-fps-pill fps-ultra":C>=55?this._fpsPill.className="sanctuary-fps-pill fps-good":C>=30?this._fpsPill.className="sanctuary-fps-pill fps-warn":this._fpsPill.className="sanctuary-fps-pill fps-bad")}let s=this.clock.getDelta(),n=Math.min(Math.max(s,5e-4),.0333),t=this.clock.elapsedTime;if(this._updateAdaptivePerformance&&this._updateAdaptivePerformance(n),this.lighting.sky&&this.lighting.sky.position.copy(this.camera.position),this.lighting.stars&&this.lighting.stars.position.copy(this.camera.position),this._flyTween&&this._flyTween(),this.flight?.active?this.flight.update(Math.min(s,.1)):this.tourController.walkMode||this.tourController.tourMode||this.tourController._entranceFlight?this.tourController._updateWalk(n):this.controls.update(),this.terrain.leftGateDoor&&this.terrain.rightGateDoor){let h=this.camera.position.z,g=Math.hypot(this.camera.position.x-j.gate.x,this.camera.position.z-j.gate.z),C=!1;this.tourController.tourMode?C=this.terrain.gateTargetOpen===1||h<1200||this.terrain._forceGateOpen:this.tourController._entranceFlight?C=h<1100||this.terrain._forceGateOpen:this.tourController.walkMode?C=this.tourController.walkPos.z<1e3||g<380||this.terrain._forceGateOpen:C=g<380||h<1e3||this.terrain._forceGateOpen,this.terrain.gateTargetOpen=C?1:0;let i=1-Math.exp(-(C?1.2:1.5)*s*3);this.terrain.gateOpenAmount+=(this.terrain.gateTargetOpen-this.terrain.gateOpenAmount)*Math.min(1,i),this.terrain.leftGateDoor.rotation.y=this.terrain.gateOpenAmount*-1.85,this.terrain.rightGateDoor.rotation.y=Math.PI+this.terrain.gateOpenAmount*1.85}if(this.terrain.water&&(this.terrain.water.position.y=j.waterLevel),this.waterObjects)for(let h=0,g=this.waterObjects.length;h<g;h++){let C=this.waterObjects[h];C.material?.uniforms?.time&&(C.material.uniforms.time.value=t*.75)}if(this.terrain._riverMaterials)for(let h=0,g=this.terrain._riverMaterials.length;h<g;h++)this.terrain._riverMaterials[h].uniforms?.uTime&&(this.terrain._riverMaterials[h].uniforms.uTime.value=t);else this.terrain.riverMat?.uniforms?.uTime&&(this.terrain.riverMat.uniforms.uTime.value=t);if(this.terrain._upperTarnMesh?.material?.userData?.shader?.uniforms?.uTime&&(this.terrain._upperTarnMesh.material.userData.shader.uniforms.uTime.value=t),this.terrain._lakeShader?.userData?.shader?.uniforms?.uTime?this.terrain._lakeShader.userData.shader.uniforms.uTime.value=t:this.terrain._lakeShader?.uniforms?.uTime&&(this.terrain._lakeShader.uniforms.uTime.value=t),this.terrain._oceanShader?.userData?.shader?.uniforms?.uTime?this.terrain._oceanShader.userData.shader.uniforms.uTime.value=t:this.terrain._oceanShader?.uniforms?.uTime&&(this.terrain._oceanShader.uniforms.uTime.value=t),this.terrain._kayaShaders)for(let h=0;h<this.terrain._kayaShaders.length;h++)this.terrain._kayaShaders[h].uniforms?.time&&(this.terrain._kayaShaders[h].uniforms.time.value=t);if(this._waterPoolMat?.uniforms?.uTime&&(this._waterPoolMat.uniforms.uTime.value=t),this.terrain._fountainBasinMat?.uniforms?.uTime&&(this.terrain._fountainBasinMat.uniforms.uTime.value=t),this.terrain._fountainCascadeMat?.uniforms?.uTime&&(this.terrain._fountainCascadeMat.uniforms.uTime.value=t),this.terrain._shorelineFoamMaterial?.uniforms?.uTime&&(this.terrain._shorelineFoamMaterial.uniforms.uTime.value=t),this.terrain._waterNormals&&this.terrain._waterNormals.offset.set(t*.012,t*.02),this.terrain.oceanMesh?.material?.normalMap&&this.terrain.oceanMesh.material.normalMap.offset.set(t*.008,t*.024),this.terrain._rainbowShaders&&this.terrain._rainbowShaders.length>0){let h=Math.max(.5,this.lighting._rainbowBase||.6),g=.94+.06*Math.sin(t*.7);for(let C=0;C<this.terrain._rainbowShaders.length;C++){let w=this.terrain._rainbowShaders[C];if(!(!w||!w.uniforms)&&(w.uniforms.uTime&&(w.uniforms.uTime.value=t),w.uniforms.uOpacity)){let i=w.userData?.baseOpacity!==void 0?w.userData.baseOpacity:.18;w.uniforms.uOpacity.value=i*h*g}}}if(this.terrain._rainbowWaterShader?.uniforms&&(this.terrain._rainbowWaterShader.uniforms.uTime&&(this.terrain._rainbowWaterShader.uniforms.uTime.value=t),this.terrain._rainbowWaterShader.uniforms.uOpacity)){let h=Math.max(.45,this.lighting._rainbowBase||.6);this.terrain._rainbowWaterShader.uniforms.uOpacity.value=.65*h}this.terrain._instancedFishMat?.userData?.shader?.uniforms?.uTime&&(this.terrain._instancedFishMat.userData.shader.uniforms.uTime.value=t),this.terrain._updateUnderwater&&this.terrain._updateUnderwater(n,t),this.terrain._mountainWaterfallShader?.uniforms?.uTime&&(this.terrain._mountainWaterfallShader.uniforms.uTime.value=t),this.terrain._oceanWaterfallShader?.uniforms?.uTime&&(this.terrain._oceanWaterfallShader.uniforms.uTime.value=t),this.terrain._poolShader?.uniforms?.uTime&&(this.terrain._poolShader.uniforms.uTime.value=t),this._splashShader?.uniforms?.uTime&&(this._splashShader.uniforms.uTime.value=t),this._mistShader?.uniforms?.uTime&&(this._mistShader.uniforms.uTime.value=t),this.terrain._lakeMistShader?.uniforms?.uTime&&(this.terrain._lakeMistShader.uniforms.uTime.value=t),this._impactRingShader?.uniforms?.uTime&&(this._impactRingShader.uniforms.uTime.value=t),this.lighting._godRayMat?.uniforms?.uTime&&(this.lighting._godRayMat.uniforms.uTime.value=t);let a=t%6283.1853;if(this.terrain._stardustMat?.uniforms?.uTime&&(this.terrain._stardustMat.uniforms.uTime.value=a),this.terrain._balustradeMoteMat?.uniforms?.uTime&&(this.terrain._balustradeMoteMat.uniforms.uTime.value=a),this.terrain._lanterns)for(let h=0,g=this.terrain._lanterns.length;h<g;h++){let C=this.terrain._lanterns[h];C.userData.progress=(C.userData.progress+C.userData.speed*n*.14)%1;let w=C.userData.isOutlet?this.terrain._riverOutletCurve:this.terrain._riverInletCurve;w&&(w.getPoint(C.userData.progress,this._tmpV3),C.position.set(this._tmpV3.x,this._tmpV3.y+.15+Math.sin(t*1.8+C.userData.bobPhase)*.12,this._tmpV3.z)),C.rotation.y=t*.3+C.userData.bobPhase}if(this.terrain._surfShader?.uniforms?.uTime&&(this.terrain._surfShader.uniforms.uTime.value=t),this._beaconMat?.uniforms?.uTime&&(this._beaconMat.uniforms.uTime.value=t),this.terrain._kayaStardust&&(this.terrain._kayaStardust.rotation.y=t*.45),this.terrain.moteMat&&(this.terrain.moteMat.uniforms.uTime.value=t),this.terrain.phantasmMoteMat&&(this.terrain.phantasmMoteMat.uniforms.uTime.value=t),this.terrain._phantasmTreeLight&&(this.terrain._phantasmTreeLight.intensity=2.8+Math.sin(t*1.5)*.6),this.terrain.pawMat&&(this.terrain.pawMat.opacity=(this.lighting._pawBase||.45)*(.72+.28*Math.sin(t*2.1))),this.lighting.stars?.visible&&this.lighting.starMat?.uniforms?.uTime&&(this.lighting.starMat.uniforms.uTime.value=t),this.terrain._terrainShaders&&this.terrain._terrainShaders.forEach(h=>{h.uniforms?.uTime&&(h.uniforms.uTime.value=t)}),this._bgMountainShader?.uniforms?.uTime&&(this._bgMountainShader.uniforms.uTime.value=t),this.terrain._oceanShader?.uniforms?.uTime&&(this.terrain._oceanShader.uniforms.uTime.value=t),this.lighting._clouds)for(let h=0,g=this.lighting._clouds.length;h<g;h++){let C=this.lighting._clouds[h];C.position.x+=(C.userData.speedX||2.4)*n*14,C.position.x>4200&&(C.position.x=-4200)}this.lighting._cinematicPass?.uniforms?.uTime&&(this.lighting._cinematicPass.uniforms.uTime.value=t),this._fishFrameCount||(this._fishFrameCount=0),this._fishFrameCount++;let l=this._fishFrameCount%30===0;if(this.terrain._troutMesh&&this.terrain._troutData){let h=this._troutDummy=this._troutDummy||new Lt,g=t,C=this.terrain._troutData.length;for(let w=0;w<C;w++){let i=this.terrain._troutData[w],_=i.dir||1,S=i.angle+g*i.orbitSpeed*_,W=(Math.sin(g*.2+i.phase)+Math.sin(g*.11+i.phase*2.3)*.6)*(i.wanderAmp||6),ae=(Math.cos(g*.16+i.phase*1.4)+Math.cos(g*.09+i.phase*.8)*.7)*(i.wanderAmp||6),p=i.center.x+Math.cos(S)*i.radiusX+W,E=i.center.z+Math.sin(S)*i.radiusZ+ae;(l||i._cachedGH===void 0)&&(i._cachedGH=ke(p,E));let T=i._cachedGH,P=E<-450?182:E<-340&&p<100?18:12.4,te=(P+T)*.5,se=Math.max(0,P-T-1),oe=te+i.yOffset*se+Math.sin(g*i.speed*2.2+i.phase)*(i.vertAmp||.45),ne=-Math.sin(S)*i.radiusX*_*i.orbitSpeed+(Math.cos(g*.2+i.phase)*.2+Math.cos(g*.11+i.phase*2.3)*.11*.6)*(i.wanderAmp||6),k=Math.cos(S)*i.radiusZ*_*i.orbitSpeed-(Math.sin(g*.16+i.phase*1.4)*.16+Math.sin(g*.09+i.phase*.8)*.09*.7)*(i.wanderAmp||6),O=Math.atan2(ne,k);h.position.set(p,Math.max(Math.min(oe,P-.4),T+.4),E),h.rotation.set(Math.cos(g*i.speed*1.6+i.phase)*.08,O,Math.sin(g*i.speed*3.2+i.phase)*.15),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._troutMesh.setMatrixAt(w,h.matrix)}this.terrain._troutMesh.instanceMatrix.needsUpdate=!0}if(this.terrain._koiMesh&&this.terrain._koiData){let h=this._koiDummy=this._koiDummy||new Lt,g=t,C=this.terrain._koiData.length;for(let w=0;w<C;w++){let i=this.terrain._koiData[w],_=i.dir||1,S=i.angle+g*i.orbitSpeed*_,W=(Math.sin(g*.2+i.phase)+Math.sin(g*.11+i.phase*2.3)*.6)*(i.wanderAmp||8),ae=(Math.cos(g*.16+i.phase*1.4)+Math.cos(g*.09+i.phase*.8)*.7)*(i.wanderAmp||8),p=i.center.x+Math.cos(S)*i.radiusX+W,E=i.center.z+Math.sin(S)*i.radiusZ+ae;(l||i._cachedGH===void 0)&&(i._cachedGH=ke(p,E));let T=i._cachedGH,P=12.4,te=(P+T)*.5,se=Math.max(0,P-T-1),oe=te+i.yOffset*se+Math.sin(g*i.speed*1.8+i.phase)*(i.vertAmp||.45),ne=-Math.sin(S)*i.radiusX*_*i.orbitSpeed+(Math.cos(g*.2+i.phase)*.2+Math.cos(g*.11+i.phase*2.3)*.11*.6)*(i.wanderAmp||8),k=Math.cos(S)*i.radiusZ*_*i.orbitSpeed-(Math.sin(g*.16+i.phase*1.4)*.16+Math.sin(g*.09+i.phase*.8)*.09*.7)*(i.wanderAmp||8),O=Math.atan2(ne,k);h.position.set(p,Math.max(Math.min(oe,P-.4),T+.4),E),h.rotation.set(Math.cos(g*i.speed*1.4+i.phase)*.07,O,Math.sin(g*i.speed*2.8+i.phase)*.14),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._koiMesh.setMatrixAt(w,h.matrix)}this.terrain._koiMesh.instanceMatrix.needsUpdate=!0}if(this.terrain._reefFishMesh&&this.terrain._reefFishData){let h=this._fishDummy=this._fishDummy||new Lt,g=t,C=this.terrain._reefFishData.length;for(let w=0;w<C;w++){let i=this.terrain._reefFishData[w],_=i.dir||1,S=i.angle+g*i.orbitSpeed*_,W=(Math.sin(g*.2+i.phase)+Math.sin(g*.11+i.phase*2.3)*.6)*(i.wanderAmp||8),ae=(Math.cos(g*.16+i.phase*1.4)+Math.cos(g*.09+i.phase*.8)*.7)*(i.wanderAmp||8),p=i.center.x+Math.cos(S)*i.radiusX+W,E=i.center.z+Math.sin(S)*i.radiusZ+ae;(l||i._cachedGH===void 0)&&(i._cachedGH=ke(p,E));let T=i._cachedGH,P=E>1050?0:E<-450?182:E<-340&&p<100?18:12.4,te=(P+T)*.5,se=Math.max(0,P-T-1),oe=te+i.yOffset*se+Math.sin(g*i.speed*2.4+i.phase)*(i.vertAmp||.5),ne=-Math.sin(S)*i.radiusX*_*i.orbitSpeed+(Math.cos(g*.2+i.phase)*.2+Math.cos(g*.11+i.phase*2.3)*.11*.6)*(i.wanderAmp||8),k=Math.cos(S)*i.radiusZ*_*i.orbitSpeed-(Math.sin(g*.16+i.phase*1.4)*.16+Math.sin(g*.09+i.phase*.8)*.09*.7)*(i.wanderAmp||8),O=Math.atan2(ne,k);h.position.set(p,Math.max(Math.min(oe,P-.4),T+.4),E),h.rotation.set(Math.cos(g*i.speed*1.8+i.phase)*.09,O,Math.sin(g*i.speed*3.4+i.phase)*.16),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._reefFishMesh.setMatrixAt(w,h.matrix)}this.terrain._reefFishMesh.instanceMatrix.needsUpdate=!0}if(this.terrain._dolphinMesh&&this.terrain._dolphinData){let h=this._dolphDummy=this._dolphDummy||new Lt,g=t,C=this.terrain._dolphinData.length;for(let w=0;w<C;w++){let i=this.terrain._dolphinData[w],_=i.dir||1,S=i.angle+g*i.orbitSpeed*_,W=i.radiusX||80,ae=i.radiusZ||95,p=Math.sin(g*.18+i.phase)*(i.wanderAmp||10),E=Math.cos(g*.14+i.phase*1.3)*(i.wanderAmp||10),T=i.center.x+Math.cos(S)*W+p,P=i.center.z+Math.sin(S)*ae+E;(l||i._cachedGH===void 0)&&(i._cachedGH=ke(T,P));let te=P>1050?0:P<-450?182:P<-340&&T<100?18:12.4,se=(te+i._cachedGH)*.5,oe=Math.max(0,te-i._cachedGH-2),ne=Math.sin(g*i.speed*1.6+i.phase),k=se+i.yOffset*oe+ne*2.2,O=Math.max(i._cachedGH+.8,Math.min(te-.4,k)),ie=-Math.sin(S)*W*_+Math.cos(g*.18+i.phase)*(i.wanderAmp||10)*.18,ve=Math.cos(S)*ae*_-Math.sin(g*.14+i.phase*1.3)*(i.wanderAmp||10)*.14,De=Math.atan2(ie,ve);h.position.set(T,O,P);let Ue=-Math.cos(g*i.speed*1.6+i.phase)*.28,Ke=-Math.sin(S)*.22*_;h.rotation.set(Ue,De,Ke),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._dolphinMesh.setMatrixAt(w,h.matrix)}this.terrain._dolphinMesh.instanceMatrix.needsUpdate=!0}if(this.terrain._sharkMesh&&this.terrain._sharkData){let h=this._sharkDummy=this._sharkDummy||new Lt,g=t,C=this.terrain._sharkData.length;for(let w=0;w<C;w++){let i=this.terrain._sharkData[w],_=i.dir||1,S=i.angle+g*i.orbitSpeed*_,W=i.radiusX||95,ae=i.radiusZ||110,p=Math.sin(g*.15+i.phase)*(i.wanderAmp||12),E=Math.cos(g*.12+i.phase*1.2)*(i.wanderAmp||12),T=i.center.x+Math.cos(S)*W+p,P=i.center.z+Math.sin(S)*ae+E;(l||i._cachedGH===void 0)&&(i._cachedGH=ke(T,P));let te=P>1050?0:P<-450?182:P<-340&&T<100?18:12.4,se=(te+i._cachedGH)*.5,oe=Math.max(0,te-i._cachedGH-2),ne=se+i.yOffset*oe+Math.sin(g*i.speed*.8+i.phase)*.55,k=Math.max(i._cachedGH+1.2,Math.min(te-.8,ne)),O=-Math.sin(S)*W*_+Math.cos(g*.15+i.phase)*(i.wanderAmp||12)*.15,ie=Math.cos(S)*ae*_-Math.sin(g*.12+i.phase*1.2)*(i.wanderAmp||12)*.12,ve=Math.atan2(O,ie);h.position.set(T,k,P);let De=Math.sin(g*i.speed*2.2+i.phase)*.12,Ue=-Math.sin(S)*.15*_;h.rotation.set(0,ve+De,Ue),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._sharkMesh.setMatrixAt(w,h.matrix)}this.terrain._sharkMesh.instanceMatrix.needsUpdate=!0}if(this._fishShader?.uniforms?.uTime&&(this._fishShader.uniforms.uTime.value=t),this.terrain._causticsShader?.uniforms?.uTime&&(this.terrain._causticsShader.uniforms.uTime.value=t),this.terrain._marineSnowShader?.uniforms?.uTime&&(this.terrain._marineSnowShader.uniforms.uTime.value=t),this.terrain._seaTurtleMesh&&this.terrain._seaTurtleData){let h=this._turtleDummy=this._turtleDummy||new Lt,g=t,C=this.terrain._seaTurtleData.length;for(let w=0;w<C;w++){let i=this.terrain._seaTurtleData[w],_=i.dir||1,S=i.phase+g*i.orbitSpeed*_,W=Math.sin(g*.2+i.phase)*6,ae=Math.cos(g*.16+i.phase*1.3)*6,p=i.cx+Math.cos(S)*i.radiusX*4+W,E=i.cz+Math.sin(S)*i.radiusZ*4+ae,T=-Math.sin(S)*i.radiusX*4*_+Math.cos(g*.2+i.phase)*6*.2,P=Math.cos(S)*i.radiusZ*4*_-Math.sin(g*.16+i.phase*1.3)*6*.16,te=Math.atan2(T,P);(l||i._cachedGH===void 0)&&(i._cachedGH=ke(p,E));let se=E>1050?0:E<-450?182:E<-340&&p<100?18:12.4,oe=(se+i._cachedGH)*.5,ne=Math.max(0,se-i._cachedGH-2),k=i.phase%1-.5,O=oe+k*ne+Math.sin(g*i.speed*1.2+i.phase)*.65,ie=Math.max(i._cachedGH+.6,Math.min(se-.8,O));h.position.set(p,ie,E);let ve=-Math.sin(S)*.18*_,De=Math.cos(g*i.speed*1.2+i.phase)*.08;h.rotation.set(De,te,ve),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._seaTurtleMesh.setMatrixAt(w,h.matrix)}this.terrain._seaTurtleMesh.instanceMatrix.needsUpdate=!0}if(this.terrain._seaTurtleShader?.uniforms?.uTime&&(this.terrain._seaTurtleShader.uniforms.uTime.value=t),this.terrain._mantaRayMesh&&this.terrain._mantaRayData){let h=this._mantaDummy=this._mantaDummy||new Lt,g=t,C=this.terrain._mantaRayData.length;for(let w=0;w<C;w++){let i=this.terrain._mantaRayData[w],_=i.dir||1,S=i.phase+g*i.orbitSpeed*_,W=Math.sin(g*.16+i.phase)*8,ae=Math.cos(g*.13+i.phase*1.2)*8,p=i.cx+Math.cos(S)*i.radiusX*4+W,E=i.cz+Math.sin(S)*i.radiusZ*4+ae,T=-Math.sin(S)*i.radiusX*4*_+Math.cos(g*.16+i.phase)*8*.16,P=Math.cos(S)*i.radiusZ*4*_-Math.sin(g*.13+i.phase*1.2)*8*.13,te=Math.atan2(T,P);(l||i._cachedGH===void 0)&&(i._cachedGH=ke(p,E));let se=E>1050?0:E<-450?182:E<-340&&p<100?18:12.4,oe=(se+i._cachedGH)*.5,ne=Math.max(0,se-i._cachedGH-2),k=i.phase%1-.5,O=oe+k*ne+Math.sin(g*i.speed*.8+i.phase)*.85,ie=Math.max(i._cachedGH+1,Math.min(se-1.2,O));h.position.set(p,ie,E);let ve=-Math.sin(S)*.28*_,De=Math.cos(g*i.speed*.8+i.phase)*.06;h.rotation.set(De,te,ve),h.scale.setScalar(i.scale),h.updateMatrix(),this.terrain._mantaRayMesh.setMatrixAt(w,h.matrix)}this.terrain._mantaRayMesh.instanceMatrix.needsUpdate=!0}if(this.terrain._mantaRayShader?.uniforms?.uTime&&(this.terrain._mantaRayShader.uniforms.uTime.value=t),this.terrain._anemoneMat?.uniforms?.uTime&&(this.terrain._anemoneMat.uniforms.uTime.value=t),this.terrain._kelpMat?.uniforms?.uTime&&(this.terrain._kelpMat.uniforms.uTime.value=t),this.terrain._bubbleMat?.uniforms?.uTime&&(this.terrain._bubbleMat.uniforms.uTime.value=t),this.terrain._coralMat&&(this.terrain._coralMat.emissiveIntensity=1.7+Math.sin(t*2.2)*.45),this.terrain._reefCrystalMat&&(this.terrain._reefCrystalMat.emissiveIntensity=2.2+Math.sin(t*1.6+1.2)*.55),this._windMaterials){let g=Math.sin(t*.15)*.3+Math.sin(t*.05+2)*.3,C=Math.sin(t*1.2)*.15*Math.max(0,g),w=.4+Math.max(0,g)+C;for(let i=0,_=this._windMaterials.length;i<_;i++){let S=this._windMaterials[i];S.userData?.windShader?.uniforms?.uTime&&(S.userData.windShader.uniforms.uTime.value=t),S.userData?.windShader?.uniforms?.uWindIntensity&&(S.userData.windShader.uniforms.uWindIntensity.value=w)}}if(this.selRing&&this.selRing.visible){this.selRing.rotation.z=t*.6;let h=1+Math.sin(t*3)*.06;this.selRing.scale.set(h,h,1)}let u=this.camera.position,f=u.x,c=u.y,m=u.z,v=Math.abs(f)<62&&m<=-455&&m>=-635&&c<182.2,b=Math.hypot(f,m- -550)<58&&c<18.2,Y=Xo(f,m),x=Ms(f,m),H=Math.hypot(f-j.lake.x,m-j.lake.z)<j.lake.r+5&&c<j.waterLevel+.2||Y<32&&c<x+.3||c<j.waterLevel,y=m>915&&c<(j.oceanLevel||.35),q=v||b||H||y,M=8e-4,V=5,$=450;if(this._colSunlitAqua=this._colSunlitAqua||new ye(6349055),this._colDeepAbyssal=this._colDeepAbyssal||new ye(1603752),this._colAbyssBg1=this._colAbyssBg1||new ye(1603752),this._colAbyssBg2=this._colAbyssBg2||new ye(1200764),this._colTarnFog1=this._colTarnFog1||new ye(5822704),this._colTarnFog2=this._colTarnFog2||new ye(2656424),this._colLakeFog1=this._colLakeFog1||new ye(4782296),this._colLakeFog2=this._colLakeFog2||new ye(2263192),y){let h=Math.max(0,.35-c),g=Math.exp(-h*.015);this._underwaterTargetFog.copy(this._colSunlitAqua).lerp(this._colDeepAbyssal,1-g),this._underwaterTargetBg.copy(this._colAbyssBg1).lerp(this._colAbyssBg2,1-g),M=3e-4+(1-g)*2e-4,V=15,$=850-(1-g)*150}else if(v){let h=Math.max(0,182-c),g=Math.exp(-h*.025);this._underwaterTargetFog.copy(this._colTarnFog1).lerp(this._colTarnFog2,1-g),this._underwaterTargetBg.setHex(2656424),M=4e-4,V=10,$=700}else if(b){let h=Math.max(0,18-c),g=Math.exp(-h*.03);this._underwaterTargetFog.copy(this._colTarnFog1).lerp(this._colTarnFog2,1-g),this._underwaterTargetBg.setHex(2656424),M=5e-4,V=10,$=650}else if(H){let h=Math.max(0,12.5-c),g=Math.exp(-h*.025);this._underwaterTargetFog.copy(this._colLakeFog1).lerp(this._colLakeFog2,1-g),this._underwaterTargetBg.setHex(2263192),M=4e-4,V=10,$=720}else this._underwaterTargetFog.setHex(2390168),this._underwaterTargetBg.setHex(1996936);let ee=q?1:0,I=1-Math.exp(-(q?12:4.5)*n);if(this._underwaterBlend=this._underwaterBlend||0,this._underwaterBlend+=(ee-this._underwaterBlend)*I,this.scene.fog)if(this._underwaterBlend<.001)this._origFogColor.copy(this.scene.fog.color),this.scene.fog.isFogExp2?this._origFogDensity=this.scene.fog.density:this.scene.fog.isFog&&(this._origFogNear=this.scene.fog.near,this._origFogFar=this.scene.fog.far),this.scene.background&&this.scene.background.isColor&&this._origBgColor.copy(this.scene.background),this.lighting.sky&&(this.lighting.sky.visible=!0),this._isUnderwaterState=!1;else{if(this._isUnderwaterState=!0,this._currentFogColor.copy(this._origFogColor).lerp(this._underwaterTargetFog,this._underwaterBlend),this.scene.fog.color.copy(this._currentFogColor),this.scene.fog.isFogExp2){let h=this._origFogDensity||65e-6;this.scene.fog.density=h+(M-h)*this._underwaterBlend}else if(this.scene.fog.isFog){let h=this._origFogNear||1200,g=this._origFogFar||18e3;this.scene.fog.near=h+(V-h)*this._underwaterBlend,this.scene.fog.far=g+($-g)*this._underwaterBlend}(!this.scene.background||!this.scene.background.isColor)&&(this.scene.background=new ye(this._underwaterTargetBg)),this._currentBgColor.copy(this._origBgColor).lerp(this._underwaterTargetBg,this._underwaterBlend),this.scene.background.copy(this._currentBgColor),this.lighting.sky&&(this.lighting.sky.visible=!0)}this.lighting.csm&&(this.lighting.csm.update(),o-this._lastShadowTime>100&&(this.camera.position.distanceToSquared(this._shadowPosition)>.25||this.camera.quaternion.angleTo(this._shadowQuaternion)>.005||o-this._lastShadowTime>500)&&(this.renderer.shadowMap.needsUpdate=!0,this._shadowPosition.copy(this.camera.position),this._shadowQuaternion.copy(this.camera.quaternion),this._lastShadowTime=o)),this.terrain.terrainPatch&&this.terrain._updateTerrainPatch&&this.terrain._updateTerrainPatch(),this.lighting.useComposer&&this.lighting.composer?this.lighting.composer.render():this.renderer.render(this.scene,this.camera),this._firstFrameRendered||(this._firstFrameRendered=!0,console.log("[world3d] first frame"),window.__rbvBooted=!0)}catch(o){console.log("[world3d] _animate error in frame, falling back to direct render:",o);try{this.renderer&&this.scene&&this.camera&&(this.terrain.terrainPatch&&this.terrain._updateTerrainPatch&&this.terrain._updateTerrainPatch(),this.renderer.render(this.scene,this.camera))}catch{}}}dispose(){this._disposed=!0,this._running=!1,this._raf&&cancelAnimationFrame(this._raf),this.controls?.dispose(),document.removeEventListener("visibilitychange",this._visibilityHandler),clearInterval(this._ambienceTimer),typeof window<"u"&&window.removeEventListener("resize",this._resizeHandler),window.removeEventListener("keydown",this.tourController._onKeyDown),window.removeEventListener("keyup",this.tourController._onKeyUp),this.canvas?.removeEventListener("mousedown",this.tourController._onMouseDown),window.removeEventListener("mousemove",this.tourController._onMouseMove),window.removeEventListener("mouseup",this.tourController._onMouseUp),this.canvas?.removeEventListener("pointerdown",this._onPointerDown),this.canvas?.removeEventListener("pointerup",this._onPointerUp),this.canvas?.removeEventListener("pointermove",this._onPointerMove),this.canvas?.removeEventListener("pointerleave",this._onPointerLeave),this.canvas?.removeEventListener("touchstart",this.tourController._onTouchStart),this.canvas?.removeEventListener("touchmove",this.tourController._onTouchMove),this.canvas?.removeEventListener("touchend",this._onTouchEnd),this.tourController._joystick&&(this.tourController._joystick.removeEventListener("touchstart",this.tourController._onJoystickTouchStart),window.removeEventListener("touchmove",this.tourController._onJoystickTouchMove),window.removeEventListener("touchend",this.tourController._onJoystickTouchEnd),window.removeEventListener("touchcancel",this.tourController._onJoystickTouchEnd),this.tourController._joystick.parentNode&&this.tourController._joystick.remove(),this.tourController._joystick=null),this.scene.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material:[e.material]).forEach(s=>{s.dispose();for(let n of Object.keys(s))s[n]&&s[n].isTexture&&s[n].dispose();if(s.uniforms)for(let n of Object.keys(s.uniforms)){let t=s.uniforms[n]?.value;t&&t.isTexture&&t.dispose()}})}),this.lighting._envRT?.dispose(),this._glowTex?.dispose(),this.lighting.pmrem?.dispose(),this.assetLoader._hdriTarget?.dispose(),this.lighting.csm?.remove(),this.lighting.csm?.dispose(),this.lighting.composer?.passes.forEach(e=>e.dispose?.()),this.lighting.composer?.dispose(),this.renderer?.dispose(),ca(),this._fpsPill&&this._fpsPill.parentNode&&(this._fpsPill.remove(),this._fpsPill=null),this._fpsFrames=[]}};export{an as World3D,an as World3DCore,$o as applyOrganicWeathering,ac as bakeVertexCreviceOcclusion};
