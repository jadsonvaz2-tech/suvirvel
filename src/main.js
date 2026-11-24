const THREE_URL="https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
const root=document.getElementById("game"),loading=document.getElementById("loading"),errorBox=document.getElementById("error"),clockLabel=document.getElementById("game-clock"),toast=document.getElementById("game-toast"),joystick=document.getElementById("joystick"),stick=document.getElementById("stick"),runButton=document.getElementById("run-button"),objective=document.getElementById("objective"),intro=document.getElementById("chapter-intro"),startButton=document.getElementById("start-adventure");
const talkPrompt=document.getElementById("talk-prompt"),talkLabel=document.getElementById("talk-label"),talkButton=document.getElementById("talk-button"),dialogue=document.getElementById("dialogue"),dialogueText=document.getElementById("dialogue-text"),dialogueSpeaker=document.getElementById("dialogue-speaker"),dialogueNext=document.getElementById("dialogue-next");
const STORE_KEY="legado-do-vale.chapter1.v1",DAY_MINUTES=1440,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function loadState(){try{const v=JSON.parse(localStorage.getItem(STORE_KEY)||"null");if(v&&v.version===1&&Number.isFinite(v.x)&&Number.isFinite(v.z))return v;}catch{}return{version:1,x:0,z:35,yaw:0,day:1,minute:375,started:false};}
const state=loadState();if(typeof state.alinaTalked!=="boolean")state.alinaTalked=false;let toastTimer=0;
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
  const x=(Math.random()-.5)*198,z=(Math.random()-.5)*198;
  if(Math.abs(x)<27&&z>-4&&z<83)continue;
  if(x>25&&x<67&&z>-102&&z<-66)continue;
  if(riverDistance(x,z)<11)continue;
  if(Math.abs(x)>96||Math.abs(z)>96)continue;
  treeSpots.push({x,z,scale:.72+Math.random()*.76,turn:Math.random()*Math.PI*2});
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
  const tint=new THREE.Color().setHSL(.29+Math.random()*.035,.32,.22+Math.random()*.12);
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
 scene.add(village);
 const dialogueScripts={alina:["Bom dia, viajante. Você parece exausto. O que aconteceu com você?","Minha aldeia foi atacada por bárbaros... Perdi tudo e não sei se alguém conseguiu sobreviver.","Sinto muito. Meu nome é Alina, sou a anciã desta Vila Vizinha. Aqui você poderá descansar um pouco e recuperar as forças.","Há terras livres neste vale. Você poderá escolher qualquer pedaço de terra para construir um abrigo e formar sua própria vila novamente.","Mas há uma obrigação: essas terras pertencem ao rei. Todos os anos você deverá pagar ao reino pelo terreno que estiver usando.","Comece com cuidado. Não receberá uma vila pronta: cada ferramenta, cada construção e cada conquista virá do seu próprio trabalho. Quando precisar de orientação, procure-me."],tomas:["Sou Tomas, o ferreiro desta vila. Trabalho o metal e conserto ferramentas para quem traz os materiais necessários.","Um bom machado ou uma picareta exige minério, combustível e muito trabalho. Nada surge do nada, rapaz.","Quando você tiver os recursos e construir sua própria oficina, poderá aprender a produzir ferramentas melhores."],edda:["Meu nome é Edda. Cuido das pequenas plantações e conheço os ciclos da terra.","Antes de semear, prepare o solo e consiga sementes. Cada estação tem seu tempo, e uma colheita exige paciência.","Quando tiver seu próprio terreno e as ferramentas adequadas, posso lhe explicar mais sobre o cultivo."],martim:["Pode me chamar de Martim. Viajo entre povoados e negocio mercadorias quando há algo para trocar.","O comércio pode ajudar uma comunidade a prosperar, mas primeiro é preciso produzir, coletar ou comprar aquilo que será negociado.","Quando sua vila estiver de pé, procure um entreposto e teremos muito o que conversar."],bruna:["Sou Bruna. Costuro roupas e remendo tecidos para os moradores daqui.","Fios, couro e tecido têm valor. Aprender a aproveitar cada material será importante quando você construir seu próprio lar.","Por enquanto, observe como trabalhamos. Uma vila forte começa com pessoas que sabem fazer coisas diferentes."]};
 let dialogueIndex=0,dialogueOpen=false,activeNpc=null,activeDialogueLines=[],currentInteractable=null;
 function closeDialogue(){dialogue.hidden=true;dialogueOpen=false;if(activeNpc?.id==="alina"){state.alinaTalked=true;saveState();objective.querySelector("strong").textContent="Alina lhe mostrou um novo começo";objective.querySelector("p").textContent="Explore o vale e escolha com calma onde sua futura vila poderá nascer.";}notify("Conversa concluída.");activeNpc=null;}
 function openDialogue(npc){if(dialogueOpen||!npc)return;activeNpc=npc;activeDialogueLines=dialogueScripts[npc.id]||[];if(!activeDialogueLines.length)return;dialogueOpen=true;dialogueIndex=0;dialogue.hidden=false;talkPrompt.hidden=true;dialogueSpeaker.textContent=npc.name;dialogueText.textContent=activeDialogueLines[dialogueIndex];dialogueNext.textContent="CONTINUAR";}
 function advanceDialogue(){if(!dialogueOpen)return;dialogueIndex++;if(dialogueIndex>=activeDialogueLines.length){closeDialogue();return;}dialogueText.textContent=activeDialogueLines[dialogueIndex];dialogueNext.textContent=dialogueIndex===activeDialogueLines.length-1?"ENCERRAR CONVERSA":"CONTINUAR";}
 talkButton.addEventListener("click",()=>openDialogue(currentInteractable));dialogueNext.addEventListener("click",advanceDialogue);
 const keys=new Set(),player={x:state.x,z:state.z,yaw:Number.isFinite(state.yaw)?state.yaw:0,pitch:0,bob:0},eye=1.68;camera.position.set(player.x,groundHeight(player.x,player.z)+eye,player.z);camera.rotation.set(0,player.yaw,0);
 let running=false,moveX=0,moveZ=0,lookPointer=null,lastLookX=0,lastLookY=0,lastSave=0,elapsedGame=0,lastFrame=performance.now();
 function updateClock(add){state.minute+=add;while(state.minute>=DAY_MINUTES){state.minute-=DAY_MINUTES;state.day++;}const h=Math.floor(state.minute/60),m=Math.floor(state.minute%60);clockLabel.textContent="DIA "+state.day+" · "+String(h).padStart(2,"0")+":"+String(m).padStart(2,"0");}updateClock(0);
 function beginAdventure(){state.started=true;intro.hidden=true;objective.hidden=false;objective.querySelector("strong").textContent=state.alinaTalked?"Alina lhe mostrou um novo começo":"Encontre a Vila Vizinha e converse com Alina";objective.querySelector("p").textContent=state.alinaTalked?"Explore o vale e escolha com calma onde sua futura vila poderá nascer.":"Siga até a clareira ao norte para encontrar a anciã Alina.";saveState();notify("Encontre a Vila Vizinha e converse com Alina.");}startButton.addEventListener("click",beginAdventure);if(state.started){intro.hidden=true;objective.hidden=false;objective.querySelector("strong").textContent=state.alinaTalked?"Alina lhe mostrou um novo começo":"Encontre a Vila Vizinha e converse com Alina";objective.querySelector("p").textContent=state.alinaTalked?"Explore o vale e escolha com calma onde sua futura vila poderá nascer.":"Siga até a clareira ao norte para encontrar a anciã Alina."; }
 function moveStick(x,y){const r=joystick.getBoundingClientRect(),dx=x-(r.left+r.width/2),dy=y-(r.top+r.height/2),len=Math.hypot(dx,dy),max=r.width*.34,k=len>max?max/len:1;moveX=dx*k/max;moveZ=-dy*k/max;stick.style.transform="translate(calc(-50% + "+dx*k+"px),calc(-50% + "+dy*k+"px))";}
 function resetStick(){moveX=0;moveZ=0;stick.style.transform="translate(-50%,-50%)";}
 joystick.addEventListener("pointerdown",e=>{joystick.setPointerCapture(e.pointerId);moveStick(e.clientX,e.clientY);});joystick.addEventListener("pointermove",e=>{if(joystick.hasPointerCapture(e.pointerId))moveStick(e.clientX,e.clientY);});joystick.addEventListener("pointerup",resetStick);joystick.addEventListener("pointercancel",resetStick);
 runButton.addEventListener("pointerdown",e=>{e.preventDefault();running=true;runButton.classList.add("pressed");});["pointerup","pointercancel","pointerleave"].forEach(t=>runButton.addEventListener(t,()=>{running=false;runButton.classList.remove("pressed");}));
 window.addEventListener("keydown",e=>{const k=e.key.toLowerCase();if(k==="e"&&talkPrompt.hidden===false&&!dialogueOpen){e.preventDefault();openDialogue(currentInteractable);return;}if(k==="escape"&&dialogueOpen){closeDialogue();return;}if(dialogueOpen)return;if(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright","shift"].includes(k))e.preventDefault();keys.add(k);if(k==="shift")running=true;});window.addEventListener("keyup",e=>{const k=e.key.toLowerCase();keys.delete(k);if(k==="shift")running=false;});window.addEventListener("blur",()=>{keys.clear();running=false;resetStick();});
 renderer.domElement.addEventListener("click",()=>{if(!mobile&&state.started&&document.pointerLockElement!==renderer.domElement)renderer.domElement.requestPointerLock?.();});document.addEventListener("mousemove",e=>{if(document.pointerLockElement!==renderer.domElement||!state.started)return;player.yaw-=e.movementX*.0022;player.pitch=clamp(player.pitch-e.movementY*.0018,-1.25,1.25);});
 renderer.domElement.addEventListener("pointerdown",e=>{if(!mobile||!state.started||e.pointerType!=="touch")return;if(e.clientX<innerWidth*.34&&e.clientY>innerHeight*.48)return;lookPointer=e.pointerId;lastLookX=e.clientX;lastLookY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId);});
 renderer.domElement.addEventListener("pointermove",e=>{if(e.pointerId!==lookPointer)return;const dx=e.clientX-lastLookX,dy=e.clientY-lastLookY;lastLookX=e.clientX;lastLookY=e.clientY;player.yaw-=dx*.004;player.pitch=clamp(player.pitch-dy*.003,-1.2,1.2);});const release=e=>{if(e.pointerId===lookPointer)lookPointer=null;};renderer.domElement.addEventListener("pointerup",release);renderer.domElement.addEventListener("pointercancel",release);
 function updateVillagers(dt,now){for(const villager of villagers){const target=villager.route[villager.index],dx=target[0]-villager.group.position.x,dz=target[1]-villager.group.position.z,dist=Math.hypot(dx,dz);if(dist<.45){villager.index=(villager.index+1)%villager.route.length;villager.walking=false;}else{villager.walking=true;const step=Math.min(dist,villager.speed*dt);villager.group.position.x+=dx/dist*step;villager.group.position.z+=dz/dist*step;villager.group.rotation.y=Math.atan2(dx,dz); }const swing=villager.walking?Math.sin(now*.009+villager.phase)*.42:Math.sin(now*.0015+villager.phase)*.025;villager.legs[0].rotation.x=swing;villager.legs[1].rotation.x=-swing;villager.group.position.y=groundHeight(villager.group.position.x,villager.group.position.z)+(villager.walking?Math.abs(Math.sin(now*.009+villager.phase))*.035:0);}}
 function frame(){requestAnimationFrame(frame);const now=performance.now(),dt=Math.min((now-lastFrame)/1000,.05);lastFrame=now;updateVillagers(dt,now);if(state.started){const alinaDistance=Math.hypot(player.x-alinaX,player.z-alinaZ);let nearest=null,nearestDistance=4.6;if(!state.alinaTalked&&alinaDistance<=nearestDistance){nearest={id:"alina",name:"Alina · Anciã"};nearestDistance=alinaDistance;}for(const villager of villagers){const d=Math.hypot(player.x-villager.group.position.x,player.z-villager.group.position.z);if(d<nearestDistance){nearest={id:villager.id,name:villager.name};nearestDistance=d;}}currentInteractable=nearest;talkPrompt.hidden=dialogueOpen||!nearest;if(nearest)talkLabel.textContent=nearest.name.toUpperCase()+" ESTÁ POR PERTO";if(dialogueOpen){running=false;keys.clear();}marker.position.y=groundHeight(alinaX,alinaZ)+3.35+Math.sin(now*.0025)*.18;const forward=(keys.has("w")||keys.has("arrowup")?1:0)-(keys.has("s")||keys.has("arrowdown")?1:0)+moveZ,strafe=(keys.has("d")||keys.has("arrowright")?1:0)-(keys.has("a")||keys.has("arrowleft")?1:0)+moveX,mag=Math.hypot(forward,strafe);if(mag>.02){const speed=running?8.1:5.2,f=forward/Math.max(1,mag),s=strafe/Math.max(1,mag),dx=-Math.sin(player.yaw)*f+Math.cos(player.yaw)*s,dz=-Math.cos(player.yaw)*f-Math.sin(player.yaw)*s,nx=clamp(player.x+dx*speed*dt,-106,106),nz=clamp(player.z+dz*speed*dt,-106,106);if(riverDistance(nx,nz)>7.45||Math.abs(nz-BRIDGE_Z)<3.1){player.x=nx;player.z=nz;}else{if(riverDistance(nx,player.z)>7.45)player.x=nx;if(riverDistance(player.x,nz)>7.45)player.z=nz;}player.bob+=dt*(running?13:9)*Math.min(1,mag);}const bob=mag>.02?Math.sin(player.bob)*.035:0;camera.position.set(player.x,groundHeight(player.x,player.z)+eye+bob,player.z);camera.rotation.set(player.pitch,player.yaw,0);elapsedGame+=dt*(running?1.2:.72);if(elapsedGame>=1){updateClock(Math.floor(elapsedGame));elapsedGame%=1;}if(now-lastSave>4000){state.x=player.x;state.z=player.z;state.yaw=player.yaw;saveState();lastSave=now;}}renderer.render(scene,camera);}
 window.addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.45:1.8));});loading.hidden=true;if(mobile){joystick.hidden=false;runButton.hidden=false;}frame();
}
boot();