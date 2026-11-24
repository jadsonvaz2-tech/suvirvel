const THREE_URL="https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
const root=document.getElementById("game"),loading=document.getElementById("loading"),errorBox=document.getElementById("error"),clockLabel=document.getElementById("game-clock"),toast=document.getElementById("game-toast"),joystick=document.getElementById("joystick"),stick=document.getElementById("stick"),runButton=document.getElementById("run-button"),objective=document.getElementById("objective"),intro=document.getElementById("chapter-intro"),startButton=document.getElementById("start-adventure");
const STORE_KEY="legado-do-vale.chapter1.v1",DAY_MINUTES=1440,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function loadState(){try{const v=JSON.parse(localStorage.getItem(STORE_KEY)||"null");if(v&&v.version===1&&Number.isFinite(v.x)&&Number.isFinite(v.z))return v;}catch{}return{version:1,x:0,z:35,yaw:0,day:1,minute:375,started:false};}
const state=loadState();let toastTimer=0;
function notify(message){toast.textContent=message;toast.classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("visible"),2400);}
function saveState(){try{localStorage.setItem(STORE_KEY,JSON.stringify(state));}catch{notify("Não foi possível salvar neste dispositivo.");}}
function showError(error){console.error(error);errorBox.textContent="Não foi possível iniciar o vale 3D. Atualize a página e tente novamente. "+(error?.message||"");errorBox.hidden=false;loading.hidden=true;}
async function boot(){try{createWorld(await import(THREE_URL));}catch(error){showError(error);}}
function createWorld(THREE){
 const mobile=matchMedia("(pointer: coarse)").matches||innerWidth<760,scene=new THREE.Scene(),sky=new THREE.Color(0x9fc4d1);scene.background=sky;scene.fog=new THREE.Fog(sky,92,205);
 const camera=new THREE.PerspectiveCamera(74,innerWidth/innerHeight,.1,260);camera.rotation.order="YXZ";
 const renderer=new THREE.WebGLRenderer({antialias:!mobile,powerPreference:"high-performance"});renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.45:1.8));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;root.insertBefore(renderer.domElement,root.firstChild);
 scene.add(new THREE.HemisphereLight(0xe7f3e8,0x596348,2));const sun=new THREE.DirectionalLight(0xffedca,2.6);sun.position.set(-55,90,40);scene.add(sun);
 // Geografia-base do vale: relevo, rio sinuoso e ponte de madeira.
 const WATER_Y=-.82,riverX=z=>-40+12*Math.sin(z*.035),riverDistance=(x,z)=>Math.abs(x-riverX(z)),BRIDGE_Z=-12,BRIDGE_Y=WATER_Y+.32;
 function groundHeight(x,z){let h=1.05+Math.sin(x*.045)*.72+Math.cos(z*.04)*.78+Math.sin((x+z)*.025)*.62;const d=riverDistance(x,z);if(d<10){const bed=WATER_Y-.55,t=clamp((d-7.2)/2.8,0,1),s=t*t*(3-2*t);h=bed+(h-bed)*s;}if(Math.abs(z-BRIDGE_Z)<3.4&&d<9.8)h=BRIDGE_Y;for(const c of[{x:49,z:-83,rx:22,rz:19,y:.42,inner:.62},{x:92,z:-84,rx:21,rz:19,y:.38,inner:.58},{x:0,z:-72,rx:20,rz:17,y:.4,inner:.62}]){const radius=Math.hypot((x-c.x)/c.rx,(z-c.z)/c.rz);if(radius<1){const t=clamp((radius-c.inner)/(1-c.inner),0,1),s=t*t*(3-2*t);h=h*(1-s)+c.y*s;}}return h;}
 const size=220,segments=150,positions=[],colors=[],indices=[];for(let iz=0;iz<=segments;iz++){const z=-size/2+iz/segments*size;for(let ix=0;ix<=segments;ix++){const x=-size/2+ix/segments*size,h=groundHeight(x,z);positions.push(x,h,z);const shade=clamp((h+1.2)/5.5,0,1),color=new THREE.Color().setHSL(.285-shade*.025,.31+shade*.12,.23+shade*.12);colors.push(color.r,color.g,color.b);if(ix<segments&&iz<segments){const a=iz*(segments+1)+ix,b=a+segments+1;indices.push(a,b,a+1,b,b+1,a+1);}}}
 const terrainGeo=new THREE.BufferGeometry();terrainGeo.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));terrainGeo.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));terrainGeo.setIndex(indices);terrainGeo.computeVertexNormals();scene.add(new THREE.Mesh(terrainGeo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1})));
 const wp=[],wi=[];for(let i=0;i<=240;i++){const z=-110+i/240*220,c=riverX(z);wp.push(c-7.2,WATER_Y,z,c+7.2,WATER_Y,z);if(i<240){const a=i*2;wi.push(a,a+2,a+1,a+1,a+2,a+3);}}
 const waterGeo=new THREE.BufferGeometry();waterGeo.setAttribute("position",new THREE.Float32BufferAttribute(wp,3));waterGeo.setIndex(wi);waterGeo.computeVertexNormals();scene.add(new THREE.Mesh(waterGeo,new THREE.MeshStandardMaterial({color:0x4d9fa9,roughness:.28,metalness:.08,transparent:true,opacity:.88,side:THREE.DoubleSide})));
 const bridge=new THREE.Group(),deckMat=new THREE.MeshStandardMaterial({color:0x795333,roughness:.96}),railMat=new THREE.MeshStandardMaterial({color:0x604329,roughness:1}),deck=new THREE.Mesh(new THREE.BoxGeometry(19.2,.28,5.9),deckMat);deck.position.y=BRIDGE_Y-.14;bridge.add(deck);
 for(let i=0;i<25;i++){const plank=new THREE.Mesh(new THREE.BoxGeometry(.68,.055,5.72),new THREE.MeshStandardMaterial({color:i%2?0x987047:0x88613d,roughness:1}));plank.position.set(-9.15+i*.762,BRIDGE_Y+.025,0);bridge.add(plank);}
 for(const side of[-1,1]){const rail=new THREE.Mesh(new THREE.BoxGeometry(19.2,.18,.2),railMat);rail.position.set(0,BRIDGE_Y+.78,side*2.72);bridge.add(rail);for(let i=0;i<7;i++){const post=new THREE.Mesh(new THREE.BoxGeometry(.22,1.05,.22),railMat);post.position.set(-8.8+i*(17.6/6),BRIDGE_Y+.48,side*2.72);bridge.add(post);}}
 bridge.position.set(riverX(BRIDGE_Z),0,BRIDGE_Z);scene.add(bridge);
 const sunDisk=new THREE.Mesh(new THREE.SphereGeometry(3.5,14,10),new THREE.MeshBasicMaterial({color:0xffe2a0}));sunDisk.position.set(-72,48,-118);scene.add(sunDisk);
 // Distribuição e modelos originais da floresta preservados sem os sistemas de derrubada.
 const treeSpots=[];
 for(let i=0;i<470;i++){
  const x=(random()-.5)*198,z=(random()-.5)*198;
  if(Math.abs(x)<27&&z>-4&&z<83)continue;
  if(x>25&&x<67&&z>-102&&z<-66)continue;
  if(riverDistance(x,z)<11)continue;
  if(Math.abs(x)>96||Math.abs(z)>96)continue;
  treeSpots.push({x,z,scale:.72+random()*.76,turn:random()*Math.PI*2});
 }
 const trunkGeometry=new THREE.CylinderGeometry(.28,.48,4.2,6);
 const crownGeometry=new THREE.ConeGeometry(3.05,7,7);
 const crownTopGeometry=new THREE.ConeGeometry(2.35,6,7);
 const trunkMaterial=new THREE.MeshStandardMaterial({color:0x705039,roughness:1});
 const crownMaterial=new THREE.MeshStandardMaterial({color:0x315d3b,roughness:1,flatShading:true});
 const trunkMesh=new THREE.InstancedMesh(trunkGeometry,trunkMaterial,treeSpots.length);
 const crownMesh=new THREE.InstancedMesh(crownGeometry,crownMaterial,treeSpots.length);
 const crownTopMesh=new THREE.InstancedMesh(crownTopGeometry,crownMaterial,treeSpots.length);
 const dummy=new THREE.Object3D();
 treeSpots.forEach((tree,index)=>{
  const y=groundHeight(tree.x,tree.z),s=tree.scale;
  const tint=new THREE.Color().setHSL(.29+random()*.035,.32,.22+random()*.12);
  dummy.position.set(tree.x,y+2.1*s,tree.z);dummy.rotation.set(0,tree.turn,0);dummy.scale.set(s,s,s);dummy.updateMatrix();trunkMesh.setMatrixAt(index,dummy.matrix);
  dummy.position.set(tree.x,y+6.2*s,tree.z);dummy.scale.set(s,s,s);dummy.updateMatrix();crownMesh.setMatrixAt(index,dummy.matrix);
  dummy.position.set(tree.x,y+10*s,tree.z);dummy.scale.set(s*.78,s*.78,s*.78);dummy.updateMatrix();crownTopMesh.setMatrixAt(index,dummy.matrix);
  crownMesh.setColorAt(index,tint);crownTopMesh.setColorAt(index,tint.clone().multiplyScalar(1.12));
 });
 scene.add(trunkMesh,crownMesh,crownTopMesh);
 trunkMesh.instanceMatrix.needsUpdate=true;crownMesh.instanceMatrix.needsUpdate=true;crownTopMesh.instanceMatrix.needsUpdate=true;

 // Afloramentos e grupos de pedras do terreno inicial, agora apenas como cenário.
 const stoneMat=new THREE.MeshStandardMaterial({color:0x969b91,roughness:1,flatShading:true});
 const outcropMat=new THREE.MeshStandardMaterial({color:0x777d78,roughness:1,flatShading:true});
 const darkStoneMat=new THREE.MeshStandardMaterial({color:0x5e655f,roughness:1,flatShading:true});
 function placeStoneGroup(x,z,kind){
  const group=new THREE.Group();
  if(kind==="pile"){
   const geo=new THREE.DodecahedronGeometry(.48,0);
   [[-.42,.35,0,1.05],[.2,.32,.12,.9],[.48,.28,-.36,.82],[-.12,.25,-.5,.88],[.03,.66,-.14,.72]].forEach(([sx,y,sz,k])=>{const mesh=new THREE.Mesh(geo,stoneMat);mesh.position.set(sx,y,sz);mesh.scale.set(k*1.15,k*.82,k);group.add(mesh);});
  }else{
   [[-.55,.72,.05,1.05],[.18,.88,-.12,1.25],[.72,.48,.16,.82],[-.05,.42,.62,.78]].forEach(([sx,y,sz,k],i)=>{const mesh=new THREE.Mesh(new THREE.DodecahedronGeometry(.72,0),i===2?darkStoneMat:outcropMat);mesh.position.set(sx,y,sz);mesh.scale.set(k*1.1,k,k*.92);mesh.rotation.set(.12*i,.25*i,.08*i);group.add(mesh);});
  }
  group.position.set(x,groundHeight(x,z),z);scene.add(group);
 }
 placeStoneGroup(1.55,31.35,"pile");
 placeStoneGroup(-5.2,21,"pile");placeStoneGroup(5.2,21,"pile");
 placeStoneGroup(-8.5,13,"outcrop");placeStoneGroup(8.5,13,"outcrop");placeStoneGroup(0,4,"outcrop");
 const keys=new Set(),player={x:state.x,z:state.z,yaw:Number.isFinite(state.yaw)?state.yaw:0,pitch:0,bob:0},eye=1.68;camera.position.set(player.x,groundHeight(player.x,player.z)+eye,player.z);camera.rotation.set(0,player.yaw,0);
 let running=false,moveX=0,moveZ=0,lookPointer=null,lastLookX=0,lastLookY=0,lastSave=0,elapsedGame=0,lastFrame=performance.now();
 function updateClock(add){state.minute+=add;while(state.minute>=DAY_MINUTES){state.minute-=DAY_MINUTES;state.day++;}const h=Math.floor(state.minute/60),m=Math.floor(state.minute%60);clockLabel.textContent="DIA "+state.day+" · "+String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");}updateClock(0);
 function beginAdventure(){state.started=true;intro.hidden=true;objective.hidden=false;saveState();notify("Você está sozinho no vale. Explore os arredores.");}startButton.addEventListener("click",beginAdventure);if(state.started){intro.hidden=true;objective.hidden=false;}
 function moveStick(x,y){const r=joystick.getBoundingClientRect(),dx=x-(r.left+r.width/2),dy=y-(r.top+r.height/2),len=Math.hypot(dx,dy),max=r.width*.34,k=len>max?max/len:1;moveX=dx*k/max;moveZ=-dy*k/max;stick.style.transform="translate(calc(-50% + "+dx*k+"px),calc(-50% + "+dy*k+"px))";}
 function resetStick(){moveX=0;moveZ=0;stick.style.transform="translate(-50%,-50%)";}
 joystick.addEventListener("pointerdown",e=>{joystick.setPointerCapture(e.pointerId);moveStick(e.clientX,e.clientY);});joystick.addEventListener("pointermove",e=>{if(joystick.hasPointerCapture(e.pointerId))moveStick(e.clientX,e.clientY);});joystick.addEventListener("pointerup",resetStick);joystick.addEventListener("pointercancel",resetStick);
 runButton.addEventListener("pointerdown",e=>{e.preventDefault();running=true;runButton.classList.add("pressed");});["pointerup","pointercancel","pointerleave"].forEach(t=>runButton.addEventListener(t,()=>{running=false;runButton.classList.remove("pressed");}));
 window.addEventListener("keydown",e=>{const k=e.key.toLowerCase();if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright","shift"].includes(k))e.preventDefault();keys.add(k);if(k==="shift")running=true;});window.addEventListener("keyup",e=>{const k=e.key.toLowerCase();keys.delete(k);if(k==="shift")running=false;});window.addEventListener("blur",()=>{keys.clear();running=false;resetStick();});
 renderer.domElement.addEventListener("click",()=>{if(!mobile&&state.started&&document.pointerLockElement!==renderer.domElement)renderer.domElement.requestPointerLock?.();});document.addEventListener("mousemove",e=>{if(document.pointerLockElement!==renderer.domElement||!state.started)return;player.yaw-=e.movementX*.0022;player.pitch=clamp(player.pitch-e.movementY*.0018,-1.25,1.25);});
 renderer.domElement.addEventListener("pointerdown",e=>{if(!mobile||!state.started||e.pointerType!=="touch")return;if(e.clientX<innerWidth*.34&&e.clientY>innerHeight*.48)return;lookPointer=e.pointerId;lastLookX=e.clientX;lastLookY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);});
 renderer.domElement.addEventListener("pointermove",e=>{if(e.pointerId!==lookPointer)return;const dx=e.clientX-lastLookX,dy=e.clientY-lastLookY;lastLookX=e.clientX;lastLookY=e.clientY;player.yaw-=dx*.004;player.pitch=clamp(player.pitch-dy*.003,-1.2,1.2);});const release=e=>{if(e.pointerId===lookPointer)lookPointer=null;};renderer.domElement.addEventListener("pointerup",release);renderer.domElement.addEventListener("pointercancel",release);
 function frame(){requestAnimationFrame(frame);const now=performance.now(),dt=Math.min((now-lastFrame)/1000,.05);lastFrame=now;if(state.started){const forward=(keys.has("w")||keys.has("arrowup")?1:0)-(keys.has("s")||keys.has("arrowdown")?1:0)+moveZ,strafe=(keys.has("d")||keys.has("arrowright")?1:0)-(keys.has("a")||keys.has("arrowleft")?1:0)+moveX,mag=Math.hypot(forward,strafe);if(mag>.02){const speed=running?8.1:5.2,f=forward/Math.max(1,mag),s=strafe/Math.max(1,mag),dx=-Math.sin(player.yaw)*f+Math.cos(player.yaw)*s,dz=-Math.cos(player.yaw)*f-Math.sin(player.yaw)*s,nx=clamp(player.x+dx*speed*dt,-106,106),nz=clamp(player.z+dz*speed*dt,-106,106);if(riverDistance(nx,nz)>7.45||Math.abs(nz-BRIDGE_Z)<3.1){player.x=nx;player.z=nz;}else{if(riverDistance(nx,player.z)>7.45)player.x=nx;if(riverDistance(player.x,nz)>7.45)player.z=nz;}player.bob+=dt*(running?13:9)*Math.min(1,mag);}const bob=mag>.02?Math.sin(player.bob)*.035:0;camera.position.set(player.x,groundHeight(player.x,player.z)+eye+bob,player.z);camera.rotation.set(player.pitch,player.yaw,0);elapsedGame+=dt*(running?1.2:.72);if(elapsedGame>=1){updateClock(Math.floor(elapsedGame));elapsedGame%=1;}if(now-lastSave>4000){state.x=player.x;state.z=player.z;state.yaw=player.yaw;saveState();lastSave=now;}}renderer.render(scene,camera);}
 window.addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.45:1.8));});loading.hidden=true;if(mobile){joystick.hidden=false;runButton.hidden=false;}frame();
}
boot();