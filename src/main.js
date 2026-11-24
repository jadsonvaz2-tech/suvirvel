const THREE_URL="https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
const root=document.getElementById("game"),loading=document.getElementById("loading"),errorBox=document.getElementById("error"),clockLabel=document.getElementById("game-clock"),toast=document.getElementById("game-toast"),joystick=document.getElementById("joystick"),stick=document.getElementById("stick"),runButton=document.getElementById("run-button"),objective=document.getElementById("objective"),intro=document.getElementById("chapter-intro"),startButton=document.getElementById("start-adventure");
const talkPrompt=document.getElementById("talk-prompt"),talkLabel=document.getElementById("talk-label"),talkButton=document.getElementById("talk-button"),dialogue=document.getElementById("dialogue"),dialogueText=document.getElementById("dialogue-text"),dialogueSpeaker=document.getElementById("dialogue-speaker"),dialogueNext=document.getElementById("dialogue-next");
const landPrompt=document.getElementById("land-prompt"),landButton=document.getElementById("land-button"),plotConfirm=document.getElementById("plot-confirm"),plotConfirmText=document.getElementById("plot-confirm-text"),plotAccept=document.getElementById("plot-accept"),plotCancel=document.getElementById("plot-cancel");
const gatherPrompt=document.getElementById("gather-prompt"),gatherLabel=document.getElementById("gather-label"),gatherButton=document.getElementById("gather-button"),craftOpen=document.getElementById("craft-open"),craftPanel=document.getElementById("craft-panel"),craftClose=document.getElementById("craft-close"),inventoryText=document.getElementById("inventory-text"),craftStatus=document.getElementById("craft-status"),campfirePlace=document.getElementById("campfire-place"),placementPrompt=document.getElementById("placement-prompt"),placementConfirm=document.getElementById("placement-confirm"),placementCancel=document.getElementById("placement-cancel"),placementHint=document.getElementById("placement-hint");
const STORE_KEY="legado-do-vale.chapter1.v1",DAY_MINUTES=1440,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function loadState(){try{const v=JSON.parse(localStorage.getItem(STORE_KEY)||"null");if(v&&v.version===1&&Number.isFinite(v.x)&&Number.isFinite(v.z))return v;}catch{}return{version:1,x:0,z:35,yaw:0,day:1,minute:375,started:false};}
const state=loadState();if(typeof state.alinaTalked!=="boolean")state.alinaTalked=false;if(!state.selectedPlot||!Number.isFinite(state.selectedPlot.x)||!Number.isFinite(state.selectedPlot.z))state.selectedPlot=null;
state.inventory=Object.assign({branches:0,stones:0,fiber:0,wood:0},state.inventory||{});
state.tools=Object.assign({axe:false,pickaxe:false},state.tools||{});
state.items=Object.assign({torches:0,campfires:0},state.items||{});
if(!state.campfireReset05){state.campfires=[];state.campfireReset05=true;saveState();}
state.harvestedNodes=state.harvestedNodes||{};state.felledTrees=Array.isArray(state.felledTrees)?state.felledTrees:[];state.shelters=Array.isArray(state.shelters)?state.shelters:[];
let toastTimer=0;
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
 const terrainGeo=new THREE.BufferGeometry();terrainGeo.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));terrainGeo.setAttribute("color",new THREE.Float32BufferAttribute(colors,3));terrainGeo.setIndex(indices);terrainGeo.computeVertexNormals();const terrainMesh=new THREE.Mesh(terrainGeo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}));scene.add(terrainMesh);
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
  const x=(Math.random()-.5)*198,z=(Math.random()-.5)*198;
  if(Math.abs(x)<27&&z>-4&&z<83)continue;
  if(x>25&&x<67&&z>-102&&z<-66)continue;
  if(riverDistance(x,z)<11)continue;
  if(Math.abs(x)>96||Math.abs(z)>96)continue;
  treeSpots.push({x,z,scale:.72+Math.random()*.76,turn:Math.random()*Math.PI*2});
 }
 if(Array.isArray(state.treeLayout)&&state.treeLayout.length>0){treeSpots.splice(0,treeSpots.length,...state.treeLayout);}else{state.treeLayout=treeSpots.map(tree=>({...tree}));saveState();}
 const trunkGeometry=new THREE.CylinderGeometry(.28,.48,4.2,6);
 const crownGeometry=new THREE.ConeGeometry(3.05,7,7);
 const crownTopGeometry=new THREE.ConeGeometry(2.35,6,7);
 const trunkMaterial=new THREE.MeshStandardMaterial({color:0x705039,roughness:1});
 const crownMaterial=new THREE.MeshStandardMaterial({color:0x315d3b,roughness:1,flatShading:true});
 const trunkMesh=new THREE.InstancedMesh(trunkGeometry,trunkMaterial,treeSpots.length);
 const crownMesh=new THREE.InstancedMesh(crownGeometry,crownMaterial,treeSpots.length);
 const crownTopMesh=new THREE.InstancedMesh(crownTopGeometry,crownMaterial,treeSpots.length);
 const dummy=new THREE.Object3D();
 state.felledTrees=state.felledTrees.filter(entry=>entry&&Number.isInteger(entry.index)&&Number.isFinite(entry.day)&&state.day<entry.day+2);
 treeSpots.forEach((tree,index)=>{
  const y=groundHeight(tree.x,tree.z),s=state.felledTrees.some(entry=>entry.index===index)?0:tree.scale;
  const tint=new THREE.Color().setHSL(.29+Math.random()*.035,.32,.22+Math.random()*.12);
  dummy.position.set(tree.x,y+2.1*s,tree.z);dummy.rotation.set(0,tree.turn,0);dummy.scale.set(s,s,s);dummy.updateMatrix();trunkMesh.setMatrixAt(index,dummy.matrix);
  dummy.position.set(tree.x,y+6.2*s,tree.z);dummy.scale.set(s,s,s);dummy.updateMatrix();crownMesh.setMatrixAt(index,dummy.matrix);
  dummy.position.set(tree.x,y+10*s,tree.z);dummy.scale.set(s*.78,s*.78,s*.78);dummy.updateMatrix();crownTopMesh.setMatrixAt(index,dummy.matrix);
  crownMesh.setColorAt(index,tint);crownTopMesh.setColorAt(index,tint.clone().multiplyScalar(1.12));
 });
 scene.add(trunkMesh,crownMesh,crownTopMesh);
 trunkMesh.instanceMatrix.needsUpdate=true;crownMesh.instanceMatrix.needsUpdate=true;crownTopMesh.instanceMatrix.needsUpdate=true;
 function setTreeVisible(index,visible){const tree=treeSpots[index],scale=visible?tree.scale:0,y=groundHeight(tree.x,tree.z);dummy.position.set(tree.x,y+2.1*scale,tree.z);dummy.rotation.set(0,tree.turn,0);dummy.scale.set(scale,scale,scale);dummy.updateMatrix();trunkMesh.setMatrixAt(index,dummy.matrix);dummy.position.set(tree.x,y+6.2*scale,tree.z);dummy.scale.set(scale,scale,scale);dummy.updateMatrix();crownMesh.setMatrixAt(index,dummy.matrix);dummy.position.set(tree.x,y+10*scale,tree.z);dummy.scale.set(scale*.78,scale*.78,scale*.78);dummy.updateMatrix();crownTopMesh.setMatrixAt(index,dummy.matrix);trunkMesh.instanceMatrix.needsUpdate=true;crownMesh.instanceMatrix.needsUpdate=true;crownTopMesh.instanceMatrix.needsUpdate=true;}

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
 // Vila Vizinha: pequeno núcleo habitado, construído na clareira do vale.
 const village=new THREE.Group();
 const wallMat=new THREE.MeshStandardMaterial({color:0x9b805d,roughness:1}),roofMat=new THREE.MeshStandardMaterial({color:0x554438,roughness:1}),woodMat=new THREE.MeshStandardMaterial({color:0x65462e,roughness:1}),windowMat=new THREE.MeshStandardMaterial({color:0x293b36,roughness:.8});
 function buildCottage(x,z,scale=1){
  const house=new THREE.Group(),baseY=groundHeight(x,z);
  const body=new THREE.Mesh(new THREE.BoxGeometry(7*scale,4.1*scale,6*scale),wallMat);body.position.y=2.05*scale;house.add(body);
  const roof=new THREE.Mesh(new THREE.ConeGeometry(5.25*scale,3.1*scale,4),roofMat);roof.rotation.y=Math.PI/4;roof.position.y=5.45*scale;house.add(roof);
  const door=new THREE.Mesh(new THREE.BoxGeometry(1.25*scale,2.45*scale,.16*scale),woodMat);door.position.set(0,1.22*scale,3.08*scale);house.add(door);
  for(const side of[-1,1]){const win=new THREE.Mesh(new THREE.BoxGeometry(1.05*scale,1.05*scale,.12*scale),windowMat);win.position.set(side*2.05*scale,2.45*scale,3.09*scale);house.add(win);}
  house.position.set(x,baseY,z);village.add(house);
 }
 buildCottage(39,-86,1);buildCottage(56,-88,.88);buildCottage(53,-69,.82);
 const well=new THREE.Group(),wellStone=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.4,.8,10),stoneMat);wellStone.position.y=.4;well.add(wellStone);
 const wellPostMat=new THREE.MeshStandardMaterial({color:0x68482e,roughness:1});
 for(const side of[-1,1]){const post=new THREE.Mesh(new THREE.BoxGeometry(.18,2.8,.18),wellPostMat);post.position.set(side*.9,1.55,0);well.add(post);}
 const wellRoof=new THREE.Mesh(new THREE.ConeGeometry(1.55,.85,4),roofMat);wellRoof.position.y=3.05;wellRoof.rotation.y=Math.PI/4;well.add(wellRoof);well.position.set(47,groundHeight(47,-84),-84);village.add(well);
 // Alina: personagem provisório com aparência própria, aguardando animações e sistema completo de NPCs.
 const alinaX=48,alinaZ=-77,alina=new THREE.Group();
 const skin=new THREE.MeshStandardMaterial({color:0xd6a77f,roughness:1}),dress=new THREE.MeshStandardMaterial({color:0x6c7650,roughness:1}),apron=new THREE.MeshStandardMaterial({color:0xb8a17a,roughness:1}),hair=new THREE.MeshStandardMaterial({color:0x66503a,roughness:1});
 const torso=new THREE.Mesh(new THREE.CylinderGeometry(.42,.58,1.35,8),dress);torso.position.y=1.25;alina.add(torso);
 const apronMesh=new THREE.Mesh(new THREE.BoxGeometry(.58,.9,.12),apron);apronMesh.position.set(0,1.08,.43);alina.add(apronMesh);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.36,12,10),skin);head.position.y=2.18;alina.add(head);
 const hairCap=new THREE.Mesh(new THREE.SphereGeometry(.39,12,8,0,Math.PI*2,0,Math.PI*.58),hair);hairCap.position.y=2.29;alina.add(hairCap);
 const bun=new THREE.Mesh(new THREE.SphereGeometry(.2,8,8),hair);bun.position.set(0,2.38,-.32);alina.add(bun);
 for(const side of[-1,1]){const arm=new THREE.Mesh(new THREE.CylinderGeometry(.13,.16,.9,7),dress);arm.position.set(side*.52,1.35,0);arm.rotation.z=side*-.12;alina.add(arm);}
 const feetMat=new THREE.MeshStandardMaterial({color:0x49382b,roughness:1});for(const side of[-1,1]){const foot=new THREE.Mesh(new THREE.BoxGeometry(.24,.28,.42),feetMat);foot.position.set(side*.2,.14,.08);alina.add(foot);}
 alina.position.set(alinaX,groundHeight(alinaX,alinaZ),alinaZ);village.add(alina);
 const markerMat=new THREE.MeshBasicMaterial({color:0xf2cf78});
 const marker=new THREE.Mesh(new THREE.OctahedronGeometry(.38,0),markerMat);marker.position.set(alinaX,groundHeight(alinaX,alinaZ)+3.35,alinaZ);village.add(marker);
 // Moradores da Vila Vizinha: personagens independentes com rotas simples e rotina diária.
 const villagerMaterials=[
  {id:"tomas",name:"Tomas · Ferreiro",coat:0x76513b,cloth:0xb69a70,hair:0x49372a,skin:0xc9926b},
  {id:"edda",name:"Edda · Agricultora",coat:0x536b59,cloth:0x9a825d,hair:0x6a4c32,skin:0xd5a47c},
  {id:"martim",name:"Martim · Comerciante",coat:0x66516f,cloth:0x9b7958,hair:0x382b24,skin:0xb97f5d},
  {id:"bruna",name:"Bruna · Costureira",coat:0x8a633e,cloth:0x777e55,hair:0x795b3d,skin:0xd6aa83}
 ];
 const villagers=[];
 function createVillager(x,z,look,route,phase){
  const person=new THREE.Group(),coatMat=new THREE.MeshStandardMaterial({color:look.coat,roughness:1}),clothMat=new THREE.MeshStandardMaterial({color:look.cloth,roughness:1}),hairMat=new THREE.MeshStandardMaterial({color:look.hair,roughness:1}),skinMat=new THREE.MeshStandardMaterial({color:look.skin,roughness:1});
  const body=new THREE.Mesh(new THREE.CylinderGeometry(.34,.46,1.15,8),coatMat);body.position.y=1.12;person.add(body);
  const belt=new THREE.Mesh(new THREE.BoxGeometry(.72,.12,.48),clothMat);belt.position.y=.82;person.add(belt);
  const headMesh=new THREE.Mesh(new THREE.SphereGeometry(.29,10,8),skinMat);headMesh.position.y=1.93;person.add(headMesh);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(.31,10,7,0,Math.PI*2,0,Math.PI*.56),hairMat);cap.position.y=2.04;person.add(cap);
  const legMat=new THREE.MeshStandardMaterial({color:0x493b30,roughness:1});
  const legs=[];for(const side of[-1,1]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.13,.15,.68,7),legMat);leg.position.set(side*.19,.35,0);person.add(leg);legs.push(leg);const arm=new THREE.Mesh(new THREE.CylinderGeometry(.105,.13,.72,7),coatMat);arm.position.set(side*.42,1.18,0);arm.rotation.z=side*-.18;person.add(arm);}
  person.position.set(x,groundHeight(x,z),z);village.add(person);
  villagers.push({id:look.id,name:look.name,group:person,legs,route,index:0,phase,speed:.75+phase*.08,walking:false});
 }
 createVillager(43,-91,villagerMaterials[0],[[43,-91],[46,-88],[44,-84],[41,-87]],.4);
 createVillager(57,-82,villagerMaterials[1],[[57,-82],[54,-80],[51,-82],[54,-85]],1.2);
 createVillager(60,-91,villagerMaterials[2],[[60,-91],[57,-93],[53,-91],[56,-88]],2.1);
 createVillager(42,-73,villagerMaterials[3],[[42,-73],[45,-71],[49,-73],[46,-75]],2.8);
 // Pequenos detalhes de uso cotidiano na praça, sem conceder itens ao jogador.
 const detailWood=new THREE.MeshStandardMaterial({color:0x765333,roughness:1});
 function addBarrel(x,z){const barrel=new THREE.Group(),body=new THREE.Mesh(new THREE.CylinderGeometry(.42,.48,.9,9),detailWood);body.position.y=.45;barrel.add(body);for(const y of[.18,.72]){const hoop=new THREE.Mesh(new THREE.TorusGeometry(.43,.035,5,12),railMat);hoop.rotation.x=Math.PI/2;hoop.position.y=y;barrel.add(hoop);}barrel.position.set(x,groundHeight(x,z),z);village.add(barrel);}
 addBarrel(44,-79);addBarrel(59,-76);
 const bench=new THREE.Group(),seat=new THREE.Mesh(new THREE.BoxGeometry(2.2,.16,.55),detailWood);seat.position.y=.72;bench.add(seat);for(const x of[-.82,.82]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.14,.7,.18),woodMat);leg.position.set(x,.35,0);bench.add(leg);}bench.position.set(51,groundHeight(51,-91),-91);village.add(bench);
 // Áreas de trabalho visuais para apresentar as profissões dos moradores.
 const forge=new THREE.Group(),forgeStone=new THREE.Mesh(new THREE.BoxGeometry(1.8,.85,1.35),outcropMat);forgeStone.position.y=.42;forge.add(forgeStone);const anvil=new THREE.Mesh(new THREE.BoxGeometry(.95,.34,.48),darkStoneMat);anvil.position.set(0,1.02,0);forge.add(anvil);const anvilHorn=new THREE.Mesh(new THREE.ConeGeometry(.2,.48,6),darkStoneMat);anvilHorn.rotation.z=-Math.PI/2;anvilHorn.position.set(.55,1.08,0);forge.add(anvilHorn);forge.position.set(62,groundHeight(62,-83),-83);village.add(forge);
 const market=new THREE.Group(),canvasMat=new THREE.MeshStandardMaterial({color:0x9b6745,roughness:1}),postMat=new THREE.MeshStandardMaterial({color:0x68482e,roughness:1});for(const x of[-1.5,1.5])for(const z of[-.9,.9]){const post=new THREE.Mesh(new THREE.CylinderGeometry(.07,.08,2.6,6),postMat);post.position.set(x,1.3,z);market.add(post);}const canopy=new THREE.Mesh(new THREE.BoxGeometry(3.5,.18,2.4),canvasMat);canopy.position.y=2.65;market.add(canopy);const counter=new THREE.Mesh(new THREE.BoxGeometry(3.1,.85,.7),woodMat);counter.position.set(0,.65,1.1);market.add(counter);market.position.set(48,groundHeight(48,-94),-94);village.add(market);
 const cropMat=new THREE.MeshStandardMaterial({color:0x648044,roughness:1}),soilMat=new THREE.MeshStandardMaterial({color:0x60472f,roughness:1});for(let row=0;row<3;row++){const furrow=new THREE.Mesh(new THREE.BoxGeometry(7,.08,.48),soilMat);furrow.position.set(0,.05,row*.95);const field=new THREE.Group();field.add(furrow);for(let col=0;col<7;col++){const sprout=new THREE.Mesh(new THREE.ConeGeometry(.16,.55,5),cropMat);sprout.position.set(-2.8+col*.92,.34,row*.95);field.add(sprout);}field.position.set(34,groundHeight(34,-75),-75);village.add(field);}
 const sewingTable=new THREE.Group(),tableTop=new THREE.Mesh(new THREE.BoxGeometry(1.8,.16,1),woodMat);tableTop.position.y=.9;sewingTable.add(tableTop);for(const x of[-.7,.7]){const leg=new THREE.Mesh(new THREE.BoxGeometry(.12,.85,.12),postMat);leg.position.set(x,.42,0);sewingTable.add(leg);}const clothRoll=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.8,8),canvasMat);clothRoll.rotation.z=Math.PI/2;clothRoll.position.set(0,1.12,0);sewingTable.add(clothRoll);sewingTable.position.set(57,groundHeight(57,-72),-72);village.add(sewingTable);
 scene.add(village);
// Recursos simples espalhados perto do ponto inicial; todos reaparecem após dois dias.
const resourceNodes=[];
function addResourceNode(id,type,x,z,amount=1){const group=new THREE.Group();if(type==="branch"){const mat=new THREE.MeshStandardMaterial({color:0x765035,roughness:1});for(let i=0;i<3;i++){const stickMesh=new THREE.Mesh(new THREE.CylinderGeometry(.055,.075,1.25,5),mat);stickMesh.rotation.z=Math.PI/2+(i-1)*.22;stickMesh.rotation.y=i*.7;stickMesh.position.set((i-1)*.16,.12,(i-1)*.12);group.add(stickMesh);}}else if(type==="stone"||type==="ore"){for(let i=0;i<4;i++){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(type==="ore"?.52:.28,0),type==="ore"?outcropMat:stoneMat);rock.position.set((i%2)*.42-.2,.22+Math.floor(i/2)*.12,Math.floor(i/2)*.38-.18);rock.rotation.set(i*.2,i*.7,i*.3);group.add(rock);}}else{const leafMat=new THREE.MeshStandardMaterial({color:0x9ab83f,roughness:.92}),leafLight=new THREE.MeshStandardMaterial({color:0xc0cf55,roughness:.9}),flowerMat=new THREE.MeshStandardMaterial({color:0xe5d58a,roughness:.85});for(let i=0;i<7;i++){const angle=i*Math.PI*2/7,leaf=new THREE.Mesh(new THREE.SphereGeometry(.28,7,5),i%2?leafMat:leafLight);leaf.position.set(Math.cos(angle)*.32,.42+(i%3)*.12,Math.sin(angle)*.32);leaf.scale.set(.72,1.75,.48);leaf.rotation.z=Math.cos(angle)*.5;leaf.rotation.y=angle;group.add(leaf);}const center=new THREE.Mesh(new THREE.CylinderGeometry(.12,.2,.85,6),leafMat);center.position.y=.42;group.add(center);for(let i=0;i<3;i++){const bud=new THREE.Mesh(new THREE.SphereGeometry(.13,7,6),flowerMat);bud.position.set((i-1)*.18,1.02+Math.abs(i-1)*.08,0);group.add(bud);}}group.position.set(x,groundHeight(x,z),z);scene.add(group);resourceNodes.push({id,type,x,z,amount,group});}
addResourceNode("branch-a","branch",4,35,2);addResourceNode("branch-b","branch",-5,31,2);addResourceNode("branch-c","branch",7,24,2);addResourceNode("branch-d","branch",-7,23,2);addResourceNode("branch-e","branch",2,15,2);
addResourceNode("stone-a","stone",2,29,2);addResourceNode("stone-b","stone",-3,25,2);addResourceNode("stone-c","stone",8,17,2);addResourceNode("stone-d","stone",-9,16,2);
addResourceNode("fiber-a","fiber",6,32,3);addResourceNode("fiber-b","fiber",-8,35,3);addResourceNode("fiber-c","fiber",10,27,3);addResourceNode("fiber-d","fiber",-3,13,3);addResourceNode("fiber-e","fiber",1,24,3);addResourceNode("fiber-f","fiber",-12,27,3);addResourceNode("fiber-g","fiber",13,37,3);addResourceNode("fiber-h","fiber",2,5,3);
addResourceNode("ore-a","ore",16,12,3);addResourceNode("ore-b","ore",-16,9,3);
function buildCampfire(x,z){const fire=new THREE.Group(),wood=new THREE.MeshStandardMaterial({color:0x68462d,roughness:1}),ember=new THREE.MeshStandardMaterial({color:0xe47a32,emissive:0x9e3c10,emissiveIntensity:1.4});for(let i=0;i<3;i++){const log=new THREE.Mesh(new THREE.CylinderGeometry(.13,.16,1.35,7),wood);log.rotation.z=Math.PI/2;log.rotation.y=i*Math.PI/3;log.position.y=.18+i*.025;fire.add(log);}const flame=new THREE.Mesh(new THREE.ConeGeometry(.34,.85,7),ember);flame.position.y=.65;fire.add(flame);fire.position.set(x,groundHeight(x,z),z);scene.add(fire);return fire;}
const placedCampfires=[];for(const pos of(state.campfires||[])){if(Number.isFinite(pos.x)&&Number.isFinite(pos.z))placedCampfires.push(buildCampfire(pos.x,pos.z));}
function buildShelter(x,z,rotation=0,ghost=false){
 const group=new THREE.Group(),opacity=ghost?.48:1,transparent=ghost;
 const wood=new THREE.MeshStandardMaterial({color:0x795334,roughness:1,transparent,opacity,depthWrite:!ghost});
 const darkWood=new THREE.MeshStandardMaterial({color:0x503923,roughness:1,transparent,opacity,depthWrite:!ghost});
 const wall=new THREE.MeshStandardMaterial({color:0x9b805d,roughness:1,transparent,opacity,depthWrite:!ghost});
 const roof=new THREE.MeshStandardMaterial({color:0x554438,roughness:1,transparent,opacity,depthWrite:!ghost});
 function part(geo,mat,px,py,pz,rz=0){const mesh=new THREE.Mesh(geo,mat);mesh.position.set(px,py,pz);mesh.rotation.z=rz;group.add(mesh);}
 part(new THREE.BoxGeometry(6.1,.22,5.2),darkWood,0,.14,0);
 for(let i=0;i<7;i++)part(new THREE.BoxGeometry(.82,.1,5.05),wood,-2.46+i*.82,.29,0);
 for(const x0 of[-2.85,2.85])for(const z0 of[-2.4,2.4])part(new THREE.BoxGeometry(.22,3.35,.22),darkWood,x0,1.9,z0);
 part(new THREE.BoxGeometry(5.7,2.55,.18),wall,0,1.75,-2.4);
 part(new THREE.BoxGeometry(.18,2.55,4.8),wall,-2.85,1.75,0);
 part(new THREE.BoxGeometry(.18,2.55,4.8),wall,2.85,1.75,0);
 part(new THREE.BoxGeometry(1.95,2.55,.18),wall,-1.88,1.75,2.4);
 part(new THREE.BoxGeometry(1.95,2.55,.18),wall,1.88,1.75,2.4);
 part(new THREE.BoxGeometry(2,.3,.2),darkWood,0,3.05,2.4);
 const leftRoof=new THREE.Mesh(new THREE.BoxGeometry(3.65,.2,6.1),roof);leftRoof.position.set(-1.52,4.0,0);leftRoof.rotation.z=-.48;group.add(leftRoof);
 const rightRoof=new THREE.Mesh(new THREE.BoxGeometry(3.65,.2,6.1),roof);rightRoof.position.set(1.52,4.0,0);rightRoof.rotation.z=.48;group.add(rightRoof);
 part(new THREE.BoxGeometry(.18,.28,6.2),darkWood,0,4.83,0);
 if(ghost){
  const glow=new THREE.MeshBasicMaterial({color:0xb8ff65,transparent:true,opacity:.96,depthTest:false});
  const outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(7.35,5.35,6.35)),glow);outline.position.set(0,2.55,0);outline.renderOrder=20;group.add(outline);
  const footprintPoints=[[-3.7,.09,-3.2],[3.7,.09,-3.2],[3.7,.09,3.2],[-3.7,.09,3.2]].map(p=>new THREE.Vector3(...p));
  const footprint=new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(footprintPoints),glow);footprint.renderOrder=21;group.add(footprint);
  group.traverse(obj=>{if(obj.isMesh&&obj.material&&obj.material.transparent){obj.material.opacity=.72;obj.material.depthWrite=false;obj.material.emissive=new THREE.Color(0x493817);obj.material.emissiveIntensity=.55;}});
 }
 group.position.set(x,groundHeight(x,z),z);group.rotation.y=rotation;scene.add(group);return group;
}
const placedShelters=[];for(const item of state.shelters){if(Number.isFinite(item.x)&&Number.isFinite(item.z))placedShelters.push(buildShelter(item.x,item.z,item.rotation||0,false));}
const placementPreview=new THREE.Group(),previewRing=new THREE.Mesh(new THREE.RingGeometry(.75,1.05,32),new THREE.MeshBasicMaterial({color:0x8fe0a0,side:THREE.DoubleSide,transparent:true,opacity:.9}));previewRing.rotation.x=-Math.PI/2;placementPreview.add(previewRing);placementPreview.visible=false;scene.add(placementPreview);
 // Delimitação visual da área escolhida pelo jogador; não modifica o terreno natural.
 const plotMarker=new THREE.Group(),plotPostMat=new THREE.MeshStandardMaterial({color:0xd7b36e,roughness:.85}),plotRopeMat=new THREE.LineBasicMaterial({color:0xe4c98e,transparent:true,opacity:.9});
 for(const [sx,sz] of [[-10,-10],[10,-10],[10,10],[-10,10]]){const post=new THREE.Mesh(new THREE.CylinderGeometry(.11,.15,1.55,6),plotPostMat);post.position.set(sx,.78,sz);plotMarker.add(post);}
 const plotPoints=[[-10,.42,-10],[10,.42,-10],[10,.42,10],[-10,.42,10],[-10,.42,-10]].map(p=>new THREE.Vector3(...p));plotMarker.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(plotPoints),plotRopeMat));plotMarker.visible=false;scene.add(plotMarker);
 function showPlotMarker(x,z){plotMarker.position.set(x,groundHeight(x,z),z);plotMarker.visible=true;}
 if(state.selectedPlot)showPlotMarker(state.selectedPlot.x,state.selectedPlot.z);
 const dialogueScripts={alina:["Bom dia, viajante. Você parece exausto. O que aconteceu com você?","Minha aldeia foi atacada por bárbaros... Perdi tudo e não sei se alguém conseguiu sobreviver.","Sinto muito. Meu nome é Alina, sou a anciã desta Vila Vizinha. Aqui você poderá descansar um pouco e recuperar as forças.","Há terras livres neste vale. Você poderá escolher qualquer pedaço de terra para construir um abrigo e formar sua própria vila novamente.","Mas há uma obrigação: essas terras pertencem ao rei. Todos os anos você deverá pagar ao reino pelo terreno que estiver usando.","Comece com cuidado. Não receberá uma vila pronta: cada ferramenta, cada construção e cada conquista virá do seu próprio trabalho. Quando precisar de orientação, procure-me."],tomas:["Sou Tomas, o ferreiro desta vila. Trabalho o metal e conserto ferramentas para quem traz os materiais necessários.","Um bom machado ou uma picareta exige minério, combustível e muito trabalho. Nada surge do nada, rapaz.","Quando você tiver os recursos e construir sua própria oficina, poderá aprender a produzir ferramentas melhores."],edda:["Meu nome é Edda. Cuido das pequenas plantações e conheço os ciclos da terra.","Antes de semear, prepare o solo e consiga sementes. Cada estação tem seu tempo, e uma colheita exige paciência.","Quando tiver seu próprio terreno e as ferramentas adequadas, posso lhe explicar mais sobre o cultivo."],martim:["Pode me chamar de Martim. Viajo entre povoados e negocio mercadorias quando há algo para trocar.","O comércio pode ajudar uma comunidade a prosperar, mas primeiro é preciso produzir, coletar ou comprar aquilo que será negociado.","Quando sua vila estiver de pé, procure um entreposto e teremos muito o que conversar."],bruna:["Sou Bruna. Costuro roupas e remendo tecidos para os moradores daqui.","Fios, couro e tecido têm valor. Aprender a aproveitar cada material será importante quando você construir seu próprio lar.","Por enquanto, observe como trabalhamos. Uma vila forte começa com pessoas que sabem fazer coisas diferentes."]};
 let dialogueIndex=0,dialogueOpen=false,activeNpc=null,activeDialogueLines=[],currentInteractable=null;
 function closeDialogue(){dialogue.hidden=true;dialogueOpen=false;if(activeNpc?.id==="alina"){state.alinaTalked=true;saveState();objective.querySelector("strong").textContent=state.selectedPlot?"Terreno da sua vila escolhido":"Escolha o terreno da sua futura vila";objective.querySelector("p").textContent=state.selectedPlot?"A área escolhida está marcada. Sua construção começará em uma próxima etapa.":"Explore o vale e marque uma área livre para sua futura vila.";}notify("Conversa concluída.");activeNpc=null;}
 function openDialogue(npc){if(dialogueOpen||!npc)return;activeNpc=npc;activeDialogueLines=dialogueScripts[npc.id]||[];if(!activeDialogueLines.length)return;dialogueOpen=true;dialogueIndex=0;dialogue.hidden=false;talkPrompt.hidden=true;dialogueSpeaker.textContent=npc.name;dialogueText.textContent=activeDialogueLines[dialogueIndex];dialogueNext.textContent="CONTINUAR";}
 function advanceDialogue(){if(!dialogueOpen)return;dialogueIndex++;if(dialogueIndex>=activeDialogueLines.length){closeDialogue();return;}dialogueText.textContent=activeDialogueLines[dialogueIndex];dialogueNext.textContent=dialogueIndex===activeDialogueLines.length-1?"ENCERRAR CONVERSA":"CONTINUAR";}
 talkButton.addEventListener("click",()=>openDialogue(currentInteractable));dialogueNext.addEventListener("click",advanceDialogue);
let currentGatherable=null,craftVisible=false,placementMode=false,pendingPlacement=null,selectedPlacementKind=null,placementRotation=0,activeShelterPreview=null;
const placementRaycaster=new THREE.Raycaster(),placementPointer=new THREE.Vector2();
function placementError(x,z,kind){
 if(kind==="campfire"){if(Math.abs(x)>98||Math.abs(z)>98)return"Escolha um ponto dentro do vale.";if(riverDistance(x,z)<9)return"Não é seguro colocar a fogueira tão perto do rio.";if(placedCampfires.some(f=>Math.hypot(f.position.x-x,f.position.z-z)<3.5))return"Escolha um local mais distante de outra fogueira.";}
 else{
  if(!state.selectedPlot)return"Primeiro escolha o terreno da sua vila.";
  if(Math.abs(x-state.selectedPlot.x)>5.4||Math.abs(z-state.selectedPlot.z)>5.4)return"Coloque o abrigo dentro da área de terreno que você escolheu.";
  if(riverDistance(x,z)<9)return"Este ponto fica muito perto do rio.";
  if(placedShelters.some(h=>Math.hypot(h.position.x-x,h.position.z-z)<7))return"Afaste o abrigo de outra construção.";
  if(placedCampfires.some(f=>Math.hypot(f.position.x-x,f.position.z-z)<4))return"Afaste o abrigo da fogueira.";
 }
 for(const [dx,dz] of [[-2.8,0],[2.8,0],[0,-2.5],[0,2.5],[-2,-2],[2,-2],[-2,2],[2,2]])if(Math.abs(groundHeight(x+dx,z+dz)-groundHeight(x,z))>.8)return"Este ponto é muito inclinado. Escolha um terreno mais plano.";
 return"";
}
function canBuildShelter(){return !!state.selectedPlot&&state.inventory.wood>=12&&state.inventory.branches>=8&&state.inventory.fiber>=6;}
function startPlacement(kind){
 if(kind==="campfire"&&state.items.campfires<1)return;
 if(kind==="shelter"&&!canBuildShelter()){craftStatus.textContent=!state.selectedPlot?"Escolha primeiro o terreno da sua vila.":"Materiais necessários: 12 madeiras, 8 galhos e 6 fibras.";return;}
 selectedPlacementKind=kind;placementRotation=0;placementMode=true;pendingPlacement=null;placementPreview.visible=false;
 if(activeShelterPreview){scene.remove(activeShelterPreview);activeShelterPreview=null;}
 if(kind==="shelter"){
  activeShelterPreview=buildShelter(0,0,0,true);activeShelterPreview.visible=false;root.classList.add("placing-shelter");
  // Encontra o ponto válido mais próximo do jogador dentro do lote.
  const plot=state.selectedPlot,forwardX=-Math.sin(player.yaw),forwardZ=-Math.cos(player.yaw);
  const preferred={x:clamp(player.x+forwardX*3.8,plot.x-5.4,plot.x+5.4),z:clamp(player.z+forwardZ*3.8,plot.z-5.4,plot.z+5.4)};
  let candidate=null,bestDistance=Infinity;
  const consider=(point)=>{
   if(placementError(point.x,point.z,"shelter"))return;
   const distance=Math.hypot(point.x-player.x,point.z-player.z);
   if(distance<bestDistance){candidate=point;bestDistance=distance;}
  };
  consider(preferred);
  if(!candidate){
   for(let ix=-4;ix<=4;ix++)for(let iz=-4;iz<=4;iz++){
    consider({x:plot.x+ix*1.25,z:plot.z+iz*1.25});
   }
  }
  if(candidate){
   pendingPlacement={x:Math.round(candidate.x*10)/10,z:Math.round(candidate.z*10)/10};
   activeShelterPreview.position.set(pendingPlacement.x,groundHeight(pendingPlacement.x,pendingPlacement.z),pendingPlacement.z);
   activeShelterPreview.rotation.y=placementRotation;activeShelterPreview.visible=true;
  }
 }
 craftVisible=false;craftPanel.hidden=true;placementPrompt.hidden=false;root.classList.add("placing-structure");
 placementHint.textContent=kind==="shelter"?(pendingPlacement?(bestDistance>8?"A prévia está no terreno escolhido, a "+Math.round(bestDistance)+" m. Use o joystick ou WASD para se aproximar; toque no chão para reposicionar.":"Prévia visível! Use o joystick ou WASD para ajustar sua posição, toque no chão para reposicionar e gire a casa."):"Não há ponto válido visível agora. Use o joystick ou WASD para chegar ao terreno escolhido."):"Toque no terreno para pré-visualizar a fogueira."
 placementConfirm.disabled=!pendingPlacement;document.exitPointerLock?.();keys.clear();resetStick();
}
function cancelPlacement(){placementMode=false;pendingPlacement=null;selectedPlacementKind=null;placementPreview.visible=false;if(activeShelterPreview){scene.remove(activeShelterPreview);activeShelterPreview=null;}placementPrompt.hidden=true;root.classList.remove("placing-structure","placing-shelter");}
function selectPlacementPoint(clientX,clientY){if(!placementMode)return;const rect=renderer.domElement.getBoundingClientRect();placementPointer.set((clientX-rect.left)/rect.width*2-1,-((clientY-rect.top)/rect.height)*2+1);placementRaycaster.setFromCamera(placementPointer,camera);const hit=placementRaycaster.intersectObject(terrainMesh,false)[0];if(!hit){placementHint.textContent="Toque em uma parte visível do chão do vale.";placementConfirm.disabled=true;return;}const x=hit.point.x,z=hit.point.z,reason=placementError(x,z,selectedPlacementKind);if(reason){pendingPlacement=null;placementPreview.visible=false;if(activeShelterPreview)activeShelterPreview.visible=false;placementConfirm.disabled=true;placementHint.textContent=reason;return;}pendingPlacement={x:Math.round(x*10)/10,z:Math.round(z*10)/10};if(selectedPlacementKind==="campfire"){placementPreview.position.set(pendingPlacement.x,groundHeight(pendingPlacement.x,pendingPlacement.z)+.05,pendingPlacement.z);placementPreview.visible=true;}else if(activeShelterPreview){activeShelterPreview.position.set(pendingPlacement.x,groundHeight(pendingPlacement.x,pendingPlacement.z),pendingPlacement.z);activeShelterPreview.rotation.y=placementRotation;activeShelterPreview.visible=true;}placementConfirm.disabled=false;placementHint.textContent="Prévia posicionada. Confirme para construir ou gire para ajustar.";}
function confirmPlacement(){
 if(!placementMode||!pendingPlacement)return;
 const reason=placementError(pendingPlacement.x,pendingPlacement.z,selectedPlacementKind);if(reason){placementHint.textContent=reason;return;}
 const pos={...pendingPlacement},builtKind=selectedPlacementKind;
 if(builtKind==="campfire"){if(state.items.campfires<1)return;placedCampfires.push(buildCampfire(pos.x,pos.z));state.campfires=state.campfires||[];state.campfires.push(pos);state.items.campfires--;notify("Fogueira colocada no local escolhido.");}
 else{if(!canBuildShelter())return;state.inventory.wood-=12;state.inventory.branches-=8;state.inventory.fiber-=6;const built={x:pos.x,z:pos.z,rotation:placementRotation};state.shelters.push(built);placedShelters.push(buildShelter(built.x,built.z,built.rotation,false));notify("Seu primeiro abrigo foi construído!");objective.querySelector("strong").textContent="Primeiro abrigo construído";objective.querySelector("p").textContent="Você ergueu seu primeiro abrigo com os materiais que reuniu. Sua vila começou a tomar forma.";}
 saveState();cancelPlacement();renderCrafting();craftStatus.textContent=builtKind==="shelter"?"Abrigo construído no local escolhido.":"Fogueira colocada no local escolhido.";
}
const recipes={axe:{label:"Machado rudimentar",cost:{branches:3,stones:2,fiber:2}},pickaxe:{label:"Picareta rudimentar",cost:{branches:3,stones:3,fiber:2}},torch:{label:"Tocha",cost:{branches:1,fiber:2}},campfire:{label:"Fogueira",cost:{branches:5,stones:4}}};
function canCraft(key){const r=recipes[key];return Object.entries(r.cost).every(([k,v])=>state.inventory[k]>=v)&&(key!=="axe"||!state.tools.axe)&&(key!=="pickaxe"||!state.tools.pickaxe);}
function renderCrafting(){const shelterButton=craftPanel.querySelector("[data-build-shelter]");if(shelterButton)shelterButton.disabled=!canBuildShelter();inventoryText.textContent="Galhos: "+state.inventory.branches+"   Pedras: "+state.inventory.stones+"   Fibras: "+state.inventory.fiber+"   Madeira: "+state.inventory.wood+"\\nMachado: "+(state.tools.axe?"fabricado":"não fabricado")+"   Picareta: "+(state.tools.pickaxe?"fabricada":"não fabricada")+"\\nTochas: "+state.items.torches+"   Fogueiras: "+state.items.campfires;craftPanel.querySelectorAll("[data-craft]").forEach(btn=>{const key=btn.dataset.craft;btn.disabled=!canCraft(key);});campfirePlace.hidden=state.items.campfires<1;}
function openCrafting(){craftVisible=true;craftPanel.hidden=false;gatherPrompt.hidden=true;renderCrafting();}
function closeCrafting(){craftVisible=false;craftPanel.hidden=true;}
craftOpen.addEventListener("click",openCrafting);craftClose.addEventListener("click",closeCrafting);
craftPanel.querySelectorAll("[data-craft]").forEach(btn=>btn.addEventListener("click",()=>{const key=btn.dataset.craft,r=recipes[key];if(!canCraft(key)){craftStatus.textContent="Ainda faltam materiais para esta receita.";return;}for(const [k,v] of Object.entries(r.cost))state.inventory[k]-=v;if(key==="axe")state.tools.axe=true;else if(key==="pickaxe")state.tools.pickaxe=true;else if(key==="torch")state.items.torches++;else state.items.campfires++;saveState();craftStatus.textContent=r.label+" fabricado com sucesso.";notify(r.label+" fabricado.");renderCrafting();}));
campfirePlace.addEventListener("click",()=>startPlacement("campfire"));const shelterBuildButton=craftPanel.querySelector("[data-build-shelter]");shelterBuildButton?.addEventListener("click",()=>startPlacement("shelter"));placementConfirm.addEventListener("click",confirmPlacement);placementCancel.addEventListener("click",cancelPlacement);
document.getElementById("placement-rotate-left").addEventListener("click",()=>rotateShelter(-Math.PI/4));document.getElementById("placement-rotate-right").addEventListener("click",()=>rotateShelter(Math.PI/4));
function rotateShelter(delta){if(!placementMode||selectedPlacementKind!=="shelter"||!activeShelterPreview)return;placementRotation=(placementRotation+delta+Math.PI*2)%(Math.PI*2);activeShelterPreview.rotation.y=placementRotation;}
function performGather(target){if(!target)return;if(target.kind==="tree"){const index=target.index;setTreeVisible(index,false);state.felledTrees.push({index,day:state.day});state.inventory.wood+=2;state.inventory.branches+=2;notify("Árvore cortada: +2 madeiras e +2 galhos.");}else{const node=target.node;if(node.type==="ore"&&!state.tools.pickaxe){notify("Você precisa de uma picareta para extrair este veio de pedra.");return;}if(node.type==="branch")state.inventory.branches+=node.amount;else if(node.type==="stone")state.inventory.stones+=node.amount;else if(node.type==="fiber")state.inventory.fiber+=node.amount;else state.inventory.stones+=node.amount;state.harvestedNodes[node.id]=state.day;node.group.visible=false;notify(node.type==="ore"?"Minério extraído: +"+node.amount+" pedras.":"Recursos coletados.");}saveState();renderCrafting();currentGatherable=null;gatherPrompt.hidden=true;}
gatherButton.addEventListener("click",()=>performGather(currentGatherable));
 let pendingPlot=null;
 function validPlot(x,z){if(Math.abs(x)>82||Math.abs(z)>82)return"Escolha uma área mais distante dos limites do vale.";if(riverDistance(x,z)<17)return"Esse terreno fica muito perto do rio. Procure uma área mais segura.";if(Math.hypot(x-48,z+82)<28)return"Escolha um terreno afastado da Vila Vizinha.";const base=groundHeight(x,z);for(const [dx,dz] of [[-10,0],[10,0],[0,-10],[0,10],[-7,-7],[7,-7],[-7,7],[7,7]])if(Math.abs(groundHeight(x+dx,z+dz)-base)>1.65)return"Esse terreno é muito inclinado. Procure uma área mais plana.";return"";}
 landButton.addEventListener("click",()=>{if(!state.alinaTalked||state.selectedPlot)return;const reason=validPlot(player.x,player.z);if(reason){notify(reason);return;}pendingPlot={x:Math.round(player.x),z:Math.round(player.z)};showPlotMarker(pendingPlot.x,pendingPlot.z);plotConfirmText.textContent="Você marcou uma área de aproximadamente 20 × 20 metros. Deseja confirmar este terreno para sua futura vila?";plotConfirm.hidden=false;landPrompt.hidden=true;});
 plotAccept.addEventListener("click",()=>{if(!pendingPlot)return;state.selectedPlot={x:pendingPlot.x,z:pendingPlot.z};showPlotMarker(state.selectedPlot.x,state.selectedPlot.z);saveState();plotConfirm.hidden=true;pendingPlot=null;objective.querySelector("strong").textContent="Terreno da sua vila escolhido";objective.querySelector("p").textContent="Sua área está marcada. O tributo anual ao rei será definido quando o sistema de administração for construído.";notify("Terreno escolhido e salvo.");});
 plotCancel.addEventListener("click",()=>{plotConfirm.hidden=true;pendingPlot=null;plotMarker.visible=!!state.selectedPlot;if(state.selectedPlot)showPlotMarker(state.selectedPlot.x,state.selectedPlot.z);landPrompt.hidden=false;});
 const keys=new Set(),player={x:state.x,z:state.z,yaw:Number.isFinite(state.yaw)?state.yaw:0,pitch:0,bob:0},eye=1.68;camera.position.set(player.x,groundHeight(player.x,player.z)+eye,player.z);camera.rotation.set(0,player.yaw,0);
 let running=false,moveX=0,moveZ=0,lookPointer=null,lastLookX=0,lastLookY=0,lastSave=0,elapsedGame=0,lastFrame=performance.now();
 function updateClock(add){state.minute+=add;while(state.minute>=DAY_MINUTES){state.minute-=DAY_MINUTES;state.day++;}const h=Math.floor(state.minute/60),m=Math.floor(state.minute%60);clockLabel.textContent="DIA "+state.day+" · "+String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");}updateClock(0);
function refreshRegrowth(){for(const [id,day] of Object.entries(state.harvestedNodes)){if(state.day>=day+2){delete state.harvestedNodes[id];const node=resourceNodes.find(n=>n.id===id);if(node)node.group.visible=true;}}const ready=state.felledTrees.filter(entry=>state.day>=entry.day+2);for(const entry of ready)setTreeVisible(entry.index,true);if(ready.length)state.felledTrees=state.felledTrees.filter(entry=>state.day<entry.day+2);}
 function beginAdventure(){state.started=true;intro.hidden=true;objective.hidden=false;objective.querySelector("strong").textContent=state.shelters.length?"Primeiro abrigo construído":state.selectedPlot?"Terreno da sua vila escolhido":state.alinaTalked?"Escolha o terreno da sua futura vila":"Encontre a Vila Vizinha e converse com Alina";objective.querySelector("p").textContent=state.shelters.length?"Você já construiu seu primeiro abrigo com os recursos que reuniu.":state.selectedPlot?"A área escolhida está marcada. Sua construção começará em uma próxima etapa.":state.alinaTalked?"Explore o vale e marque uma área livre para sua futura vila.":"Siga até a clareira ao norte para encontrar a anciã Alina.";saveState();notify("Encontre a Vila Vizinha e converse com Alina.");}startButton.addEventListener("click",beginAdventure);if(state.started){intro.hidden=true;objective.hidden=false;objective.querySelector("strong").textContent=state.shelters.length?"Primeiro abrigo construído":state.selectedPlot?"Terreno da sua vila escolhido":state.alinaTalked?"Escolha o terreno da sua futura vila":"Encontre a Vila Vizinha e converse com Alina";objective.querySelector("p").textContent=state.shelters.length?"Você já construiu seu primeiro abrigo com os recursos que reuniu.":state.selectedPlot?"A área escolhida está marcada. Sua construção começará em uma próxima etapa.":state.alinaTalked?"Explore o vale e marque uma área livre para sua futura vila.":"Siga até a clareira ao norte para encontrar a anciã Alina."; }
 function moveStick(x,y){const r=joystick.getBoundingClientRect(),dx=x-(r.left+r.width/2),dy=y-(r.top+r.height/2),len=Math.hypot(dx,dy),max=r.width*.34,k=len>max?max/len:1;moveX=dx*k/max;moveZ=-dy*k/max;stick.style.transform="translate(calc(-50% + "+dx*k+"px),calc(-50% + "+dy*k+"px))";}
 function resetStick(){moveX=0;moveZ=0;stick.style.transform="translate(-50%,-50%)";}
 joystick.addEventListener("pointerdown",e=>{joystick.setPointerCapture(e.pointerId);moveStick(e.clientX,e.clientY);});joystick.addEventListener("pointermove",e=>{if(joystick.hasPointerCapture(e.pointerId))moveStick(e.clientX,e.clientY);});joystick.addEventListener("pointerup",resetStick);joystick.addEventListener("pointercancel",resetStick);
 runButton.addEventListener("pointerdown",e=>{e.preventDefault();running=true;runButton.classList.add("pressed");});["pointerup","pointercancel","pointerleave"].forEach(t=>runButton.addEventListener(t,()=>{running=false;runButton.classList.remove("pressed");}));
 window.addEventListener("keydown",e=>{const k=e.key.toLowerCase();if(k==="e"&&talkPrompt.hidden===false&&!dialogueOpen){e.preventDefault();openDialogue(currentInteractable);return;}if(k==="escape"&&dialogueOpen){closeDialogue();return;}if(dialogueOpen||craftVisible)return;if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright","shift"].includes(k))e.preventDefault();keys.add(k);if(k==="shift")running=true;});window.addEventListener("keyup",e=>{const k=e.key.toLowerCase();keys.delete(k);if(k==="shift")running=false;});window.addEventListener("blur",()=>{keys.clear();running=false;resetStick();});
 renderer.domElement.addEventListener("click",e=>{if(placementMode){selectPlacementPoint(e.clientX,e.clientY);return;}if(!mobile&&state.started&&document.pointerLockElement!==renderer.domElement)renderer.domElement.requestPointerLock?.();});document.addEventListener("mousemove",e=>{if(document.pointerLockElement!==renderer.domElement||!state.started)return;player.yaw-=e.movementX*.0022;player.pitch=clamp(player.pitch-e.movementY*.0018,-1.25,1.25);});
 renderer.domElement.addEventListener("pointerdown",e=>{if(placementMode&&mobile&&e.pointerType==="touch"){e.preventDefault();selectPlacementPoint(e.clientX,e.clientY);return;}if(!mobile||!state.started||e.pointerType!=="touch")return;if(e.clientX<innerWidth*.34&&e.clientY>innerHeight*.48)return;lookPointer=e.pointerId;lastLookX=e.clientX;lastLookY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);});
 renderer.domElement.addEventListener("pointermove",e=>{if(e.pointerId!==lookPointer)return;const dx=e.clientX-lastLookX,dy=e.clientY-lastLookY;lastLookX=e.clientX;lastLookY=e.clientY;player.yaw-=dx*.004;player.pitch=clamp(player.pitch-dy*.003,-1.2,1.2);});const release=e=>{if(e.pointerId===lookPointer)lookPointer=null;};renderer.domElement.addEventListener("pointerup",release);renderer.domElement.addEventListener("pointercancel",release);
 function updateVillagers(dt,now){for(const villager of villagers){const target=villager.route[villager.index],dx=target[0]-villager.group.position.x,dz=target[1]-villager.group.position.z,dist=Math.hypot(dx,dz);if(dist<.45){villager.index=(villager.index+1)%villager.route.length;villager.walking=false;}else{villager.walking=true;const step=Math.min(dist,villager.speed*dt);villager.group.position.x+=dx/dist*step;villager.group.position.z+=dz/dist*step;villager.group.rotation.y=Math.atan2(dx,dz); }const swing=villager.walking?Math.sin(now*.009+villager.phase)*.42:Math.sin(now*.0015+villager.phase)*.025;villager.legs[0].rotation.x=swing;villager.legs[1].rotation.x=-swing;villager.group.position.y=groundHeight(villager.group.position.x,villager.group.position.z)+(villager.walking?Math.abs(Math.sin(now*.009+villager.phase))*.035:0);}}
 function frame(){requestAnimationFrame(frame);const now=performance.now(),dt=Math.min((now-lastFrame)/1000,.05);lastFrame=now;updateVillagers(dt,now);if(state.started){if(craftVisible){running=false;keys.clear();}const alinaDistance=Math.hypot(player.x-alinaX,player.z-alinaZ);let nearest=null,nearestDistance=4.6;if(!state.alinaTalked&&alinaDistance<=nearestDistance){nearest={id:"alina",name:"Alina · Anciã"};nearestDistance=alinaDistance;}for(const villager of villagers){const d=Math.hypot(player.x-villager.group.position.x,player.z-villager.group.position.z);if(d<nearestDistance){nearest={id:villager.id,name:villager.name};nearestDistance=d;}}currentInteractable=nearest;talkPrompt.hidden=dialogueOpen||craftVisible||placementMode||plotConfirm.hidden===false||!nearest;if(nearest)talkLabel.textContent=nearest.name.toUpperCase()+" ESTÁ POR PERTO";landPrompt.hidden=dialogueOpen||craftVisible||placementMode||plotConfirm.hidden===false||!state.alinaTalked||!!state.selectedPlot;
let best=null,bestDist=3.5;for(const node of resourceNodes){const harvested=state.harvestedNodes[node.id];node.group.visible=harvested===undefined||state.day>=harvested+2;if(!node.group.visible)continue;const d=Math.hypot(player.x-node.x,player.z-node.z);if(d<bestDist&&!(node.type==="ore"&&!state.tools.pickaxe)){best={kind:"node",node};bestDist=d;}}if(state.tools.axe){treeSpots.forEach((tree,index)=>{if(state.felledTrees.some(entry=>entry.index===index))return;const d=Math.hypot(player.x-tree.x,player.z-tree.z);if(d<bestDist){best={kind:"tree",index};bestDist=d;}});}currentGatherable=best;gatherPrompt.hidden=dialogueOpen||craftVisible||placementMode||plotConfirm.hidden===false||!best;if(best)gatherLabel.textContent=best.kind==="tree"?"ÁRVORE PRONTA PARA CORTE":best.node.type==="ore"?"VEIO DE PEDRA · EXTRAIR":best.node.type==="branch"?"GALHOS CAÍDOS · COLETAR":best.node.type==="stone"?"PEDRAS SOLTAS · COLETAR":"FIBRAS VEGETAIS · COLETAR";if(dialogueOpen||craftVisible||plotConfirm.hidden===false){running=false;keys.clear();moveX=0;moveZ=0;}marker.position.y=groundHeight(alinaX,alinaZ)+3.35+Math.sin(now*.0025)*.18;const forward=(keys.has("w")||keys.has("arrowup")?1:0)-(keys.has("s")||keys.has("arrowdown")?1:0)+moveZ,strafe=(keys.has("d")||keys.has("arrowright")?1:0)-(keys.has("a")||keys.has("arrowleft")?1:0)+moveX,mag=Math.hypot(forward,strafe);if(mag>.02){const speed=running?8.1:5.2,f=forward/Math.max(1,mag),s=strafe/Math.max(1,mag),dx=-Math.sin(player.yaw)*f+Math.cos(player.yaw)*s,dz=-Math.cos(player.yaw)*f-Math.sin(player.yaw)*s,nx=clamp(player.x+dx*speed*dt,-106,106),nz=clamp(player.z+dz*speed*dt,-106,106);if(riverDistance(nx,nz)>7.45||Math.abs(nz-BRIDGE_Z)<3.1){player.x=nx;player.z=nz;}else{if(riverDistance(nx,player.z)>7.45)player.x=nx;if(riverDistance(player.x,nz)>7.45)player.z=nz;}player.bob+=dt*(running?13:9)*Math.min(1,mag);}const bob=mag>.02?Math.sin(player.bob)*.035:0;camera.position.set(player.x,groundHeight(player.x,player.z)+eye+bob,player.z);camera.rotation.set(player.pitch,player.yaw,0);elapsedGame+=dt*(running?1.2:.72);if(elapsedGame>=1){const oldDay=state.day;updateClock(Math.floor(elapsedGame));elapsedGame%=1;if(state.day!==oldDay){refreshRegrowth();saveState();}}if(now-lastSave>4000){state.x=player.x;state.z=player.z;state.yaw=player.yaw;saveState();lastSave=now;}}renderer.render(scene,camera);}
 window.addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.45:1.8));});loading.hidden=true;if(mobile){joystick.hidden=false;runButton.hidden=false;}frame();
}
boot();