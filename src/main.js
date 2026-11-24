const THREE_MODULE_URL = "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

const game = document.getElementById("game");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const joystickWrap = document.getElementById("joystick-wrap");
const joystickBase = document.getElementById("joystick-base");
const joystickThumb = document.getElementById("joystick-thumb");
const sprintButton = document.getElementById("sprint-button");
const inventoryToggle = document.getElementById("inventory-toggle");
const inventoryPanel = document.getElementById("inventory-panel");
const inventoryClose = document.getElementById("inventory-close");
const eatBerryButton = document.getElementById("eat-berry-button");
const axeCountUI = document.getElementById("axe-count");
const craftingPanel = document.getElementById("crafting-panel");
const craftingClose = document.getElementById("crafting-close");
const craftAxeButton = document.getElementById("craft-axe-button");
const workbenchStatus = document.getElementById("workbench-status");
const buildToggle = document.getElementById("build-toggle");
const buildingPanel = document.getElementById("building-panel");
const buildingClose = document.getElementById("building-close");
const buildingRotate = document.getElementById("building-rotate");
const buildingConfirm = document.getElementById("building-confirm");
const buildingStatus = document.getElementById("building-status");
const buildingMaterials = document.getElementById("building-materials");
const buildingOptions = document.getElementById("building-options");
const chestPanel = document.getElementById("chest-panel");
const chestClose = document.getElementById("chest-close");
const chestItems = document.getElementById("chest-items");
const sleepPanel = document.getElementById("sleep-panel");
const sleepClose = document.getElementById("sleep-close");
const sleepClockLabel = document.getElementById("sleep-clock-label");
const farmPanel = document.getElementById("farm-panel");
const farmClose = document.getElementById("farm-close");
const farmPlotTitle = document.getElementById("farm-plot-title");
const farmPlotStatus = document.getElementById("farm-plot-status");
const farmActions = document.getElementById("farm-actions");
const animalPanel = document.getElementById("animal-panel");
const animalClose = document.getElementById("animal-close");
const animalTitle = document.getElementById("animal-title");
const animalStatus = document.getElementById("animal-status");
const animalActions = document.getElementById("animal-actions");
const kitchenPanel = document.getElementById("kitchen-panel");
const kitchenClose = document.getElementById("kitchen-close");
const kitchenTitle = document.getElementById("kitchen-title");
const kitchenStatus = document.getElementById("kitchen-status");
const kitchenRecipes = document.getElementById("kitchen-recipes");
const loomPanel = document.getElementById("loom-panel"), loomClose = document.getElementById("loom-close"), loomTitle = document.getElementById("loom-title"), loomStatus = document.getElementById("loom-status"), loomActions = document.getElementById("loom-actions");
const tanneryPanel=document.getElementById("tannery-panel"),tanneryClose=document.getElementById("tannery-close"),tanneryTitle=document.getElementById("tannery-title"),tanneryStatus=document.getElementById("tannery-status"),tanneryActions=document.getElementById("tannery-actions");
const fishingPanel=document.getElementById("fishing-panel"),fishingClose=document.getElementById("fishing-close"),fishingStatus=document.getElementById("fishing-status"),fishingAction=document.getElementById("fishing-action");
const merchantPanel=document.getElementById("merchant-panel"),merchantClose=document.getElementById("merchant-close"),merchantTitle=document.getElementById("merchant-title"),merchantStatus=document.getElementById("merchant-status"),merchantCoins=document.getElementById("merchant-coins"),merchantItems=document.getElementById("merchant-items"),merchantContracts=document.getElementById("merchant-contracts"),merchantRank=document.getElementById("merchant-rank"),walletUI=document.getElementById("wallet-coins");
const villagerPanel=document.getElementById("villager-panel"),villagerClose=document.getElementById("villager-close"),villagerTitle=document.getElementById("villager-title"),villagerDialogue=document.getElementById("villager-dialogue"),villagerTask=document.getElementById("villager-task");
const villagersToggle=document.getElementById("villagers-toggle"),villagersDirectory=document.getElementById("villagers-directory"),villagersList=document.getElementById("villagers-list"),villagersInvites=document.getElementById("villagers-invites"),villagersSummary=document.getElementById("villagers-summary"),villagersDirectoryClose=document.getElementById("villagers-directory-close");
const gameClockUI = document.getElementById("game-clock");
const interactionType = document.getElementById("interaction-type");
const interactionVerb = document.getElementById("interaction-verb");
const collectButton = document.getElementById("collect-button");
const interactionPrompt = document.getElementById("interaction-prompt");
const interactionName = document.getElementById("interaction-name");
const gameToast = document.getElementById("game-toast");
const inventoryUI = {
  branches: document.getElementById("branches-count"),
  stones: document.getElementById("stones-count"),
  berries: document.getElementById("berries-count"),
  wood: document.getElementById("wood-count"),
  wheatSeeds: document.getElementById("wheat-seeds-count"),
  carrotSeeds: document.getElementById("carrot-seeds-count"),
  cabbageSeeds: document.getElementById("cabbage-seeds-count"),
  wheat: document.getElementById("wheat-count"),
  carrots: document.getElementById("carrots-count"),
  cabbages: document.getElementById("cabbages-count"),
  eggs: document.getElementById("eggs-count"),
  wool: document.getElementById("wool-count"),
  bread: document.getElementById("bread-count"),
  omelet: document.getElementById("omelet-count"),
  vegetableSoup: document.getElementById("vegetable-soup-count"),
  berryPorridge: document.getElementById("berry-porridge-count"),
  fabric: document.getElementById("fabric-count"), tannedLeather:document.getElementById("tanned-leather-count"), leatherBackpack:document.getElementById("leather-backpack-count"), tunic: document.getElementById("tunic-count"), trousers: document.getElementById("trousers-count"), boots: document.getElementById("boots-count"), rawMeat:document.getElementById("raw-meat-count"), hide:document.getElementById("hide-count"), roastedMeat:document.getElementById("roasted-meat-count"), bow:document.getElementById("bow-count"), arrows:document.getElementById("arrows-count"), trout:document.getElementById("trout-count"), carp:document.getElementById("carp-count"), minnow:document.getElementById("minnow-count"), grilledTrout:document.getElementById("grilled-trout-count"), grilledCarp:document.getElementById("grilled-carp-count"), grilledMinnow:document.getElementById("grilled-minnow-count")
};
let toastTimer = 0;
const survivalUI = {
  status: document.getElementById("survival-status"),
  health: { value: document.getElementById("health-value"), fill: document.getElementById("health-fill") },
  hunger: { value: document.getElementById("hunger-value"), fill: document.getElementById("hunger-fill") },
  thirst: { value: document.getElementById("thirst-value"), fill: document.getElementById("thirst-fill") },
  energy: { value: document.getElementById("energy-value"), fill: document.getElementById("energy-fill") },
  warmth: { value: document.getElementById("warmth-value"), fill: document.getElementById("warmth-fill") }
};

async function bootGame() {
  try {
    const THREE = await import(THREE_MODULE_URL);
    startGame(THREE);
  } catch (error) {
    showError(error);
  }
}

bootGame();

function showError(error) {
  console.error(error);
  errorBox.textContent = "Não foi possível iniciar o mundo 3D. Atualize a página e tente novamente.\n\nDetalhe: " + (error?.message || "erro desconhecido");
  errorBox.classList.remove("hidden");
  loading.classList.add("hidden");
}

function startGame(THREE) {
  const isMobile = matchMedia("(pointer: coarse)").matches || innerWidth <= 700;
  const scene = new THREE.Scene();
  const sky = new THREE.Color(0x9fc4d1);
  scene.background = sky;
  scene.fog = new THREE.Fog(sky, 92, 205);

  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 260);
  const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile ? 1.45 : 1.8));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  game.insertBefore(renderer.domElement, game.firstChild);

  const hemi = new THREE.HemisphereLight(0xe7f3e8, 0x596348, 2.0);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffedca, 2.6);
  sun.position.set(-55, 90, 40);
  scene.add(sun);

  const WATER_Y = -0.82;
  const riverX = (z) => -40 + 12 * Math.sin(z * 0.035);
  const riverDistance = (x, z) => Math.abs(x - riverX(z));
  const RIVER_BRIDGE_Z = -12;
  const RIVER_BRIDGE_HALF_DEPTH = 3.15;
  const RIVER_BRIDGE_DECK_Y = WATER_Y + 0.32;
  const isOnRiverBridge = (x,z) => Math.abs(z-RIVER_BRIDGE_Z)<=RIVER_BRIDGE_HALF_DEPTH && riverDistance(x,z)<9.8;
  function groundHeight(x, z) {
    let h = 1.05 + Math.sin(x * 0.045) * 0.72 + Math.cos(z * 0.04) * 0.78 + Math.sin((x + z) * 0.025) * 0.62;
    const d = riverDistance(x, z);

    // Mantém todo o leito abaixo da água e suaviza as margens para evitar
    // que o terreno cubra a superfície do rio em partes do percurso.
    if (d < 10) {
      const riverBed = WATER_Y - 0.55;
      const bankBlend = THREE.MathUtils.clamp((d - 7.2) / 2.8, 0, 1);
      const smoothBank = bankBlend * bankBlend * (3 - 2 * bankBlend);
      h = riverBed + (h - riverBed) * smoothBank;
    }
    // A ponte possui um tabuleiro plano e contínuo sobre o leito do rio.
    if (Math.abs(z-RIVER_BRIDGE_Z)<3.4 && d<9.8) h=RIVER_BRIDGE_DECK_Y;
    return h;
  }

  // Terreno ondulado do vale, criado por geometria procedural.
  const terrainSize = 220;
  const terrainSegments = 150;
  const positions = [];
  const colors = [];
  const indices = [];
  for (let iz = 0; iz <= terrainSegments; iz++) {
    const z = -terrainSize / 2 + (iz / terrainSegments) * terrainSize;
    for (let ix = 0; ix <= terrainSegments; ix++) {
      const x = -terrainSize / 2 + (ix / terrainSegments) * terrainSize;
      const h = groundHeight(x, z);
      positions.push(x, h, z);
      const shade = THREE.MathUtils.clamp((h + 1.2) / 5.5, 0, 1);
      const color = new THREE.Color().setHSL(0.285 - shade * 0.025, 0.31 + shade * 0.12, 0.23 + shade * 0.12);
      colors.push(color.r, color.g, color.b);
      if (ix < terrainSegments && iz < terrainSegments) {
        const a = iz * (terrainSegments + 1) + ix;
        const b = a + terrainSegments + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
  }
  const terrainGeometry = new THREE.BufferGeometry();
  terrainGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  terrainGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  terrainGeometry.setIndex(indices);
  terrainGeometry.computeVertexNormals();
  const terrain = new THREE.Mesh(terrainGeometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
  scene.add(terrain);

  // Rio curvo atravessando o vale.
  const waterPositions = [];
  const waterIndices = [];
  const riverSteps = 240;
  for (let i = 0; i <= riverSteps; i++) {
    const z = -110 + (i / riverSteps) * 220;
    const center = riverX(z);
    waterPositions.push(center - 7.2, WATER_Y, z, center + 7.2, WATER_Y, z);
    if (i < riverSteps) {
      const a = i * 2;
      waterIndices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const waterGeometry = new THREE.BufferGeometry();
  waterGeometry.setAttribute("position", new THREE.Float32BufferAttribute(waterPositions, 3));
  waterGeometry.setIndex(waterIndices);
  waterGeometry.computeVertexNormals();
  const water = new THREE.Mesh(waterGeometry, new THREE.MeshStandardMaterial({
    color: 0x4d9fa9, roughness: 0.28, metalness: 0.08, transparent: true, opacity: 0.88, side: THREE.DoubleSide
  }));
  scene.add(water);

  // Ponte de madeira atravessável: liga as duas margens no ponto indicado no mapa.
  {
    const bridge=new THREE.Group();
    const deckMat=new THREE.MeshStandardMaterial({color:0x795333,roughness:0.96});
    const railMat=new THREE.MeshStandardMaterial({color:0x604329,roughness:1});
    const deck=new THREE.Mesh(new THREE.BoxGeometry(19.2,0.28,5.9),deckMat);
    deck.position.y=RIVER_BRIDGE_DECK_Y-0.14;bridge.add(deck);
    for(let i=0;i<25;i++){
      const plank=new THREE.Mesh(new THREE.BoxGeometry(0.68,0.055,5.72),new THREE.MeshStandardMaterial({color:i%2?0x987047:0x88613d,roughness:1}));
      plank.position.set(-9.15+i*0.762,RIVER_BRIDGE_DECK_Y+0.025,0);bridge.add(plank);
    }
    for(const side of [-1,1]){
      const rail=new THREE.Mesh(new THREE.BoxGeometry(19.2,0.18,0.2),railMat);
      rail.position.set(0,RIVER_BRIDGE_DECK_Y+0.78,side*2.72);bridge.add(rail);
      for(let i=0;i<7;i++){
        const post=new THREE.Mesh(new THREE.BoxGeometry(0.22,1.05,0.22),railMat);
        post.position.set(-8.8+i*(17.6/6),RIVER_BRIDGE_DECK_Y+0.48,side*2.72);bridge.add(post);
      }
    }
    bridge.position.set(riverX(RIVER_BRIDGE_Z),0,RIVER_BRIDGE_Z);
    scene.add(bridge);
  }

  // Pontos de pesca marcados por juncos nas margens acessíveis do rio.
  const fishingSpots=[-48,-8,34,78].map((z,index)=>{
    const x=riverX(z)+11.2,group=new THREE.Group(),reedMat=new THREE.MeshStandardMaterial({color:0x687c3c,roughness:1});
    for(let i=0;i<4;i++){const reed=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.04,0.95+(i%2)*0.25,5),reedMat);reed.position.set((i-1.5)*0.22,0.48+(i%2)*0.08,(i%2)*0.18);reed.rotation.z=(i-1.5)*0.09;group.add(reed);}
    group.position.set(x,groundHeight(x,z),z);scene.add(group);return {id:"fishing-spot-"+(index+1),x,z,group};
  });

  // Luz suave e céu aberto; os modelos são provisórios nesta primeira fase.
  const sunDisk = new THREE.Mesh(new THREE.SphereGeometry(3.5, 14, 10), new THREE.MeshBasicMaterial({ color: 0xffe2a0 }));
  sunDisk.position.set(-72, 48, -118);
  scene.add(sunDisk);

  // Árvores low-poly instanciadas para manter o protótipo leve em celulares.
  let seed = 73421;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }
  // Carrega o progresso antes de criar os recursos do cenário, para que
  // os pontos já recolhidos não sejam recriados após atualizar a página.
  // O ponto de recursos é ancorado na posição inicial salva do jogador.
  // Assim, a primeira área de coleta aparece perto do personagem mesmo em saves antigos.
  const saved = readSave();
  const gameTime = { day:saved?.gameTime?.day??1, hour:saved?.gameTime?.hour??8, minute:saved?.gameTime?.minute??0 };
  let fishingLastCatch=Number.isSafeInteger(saved?.fishingSpotState?.lastCatch)?Math.max(0,saved.fishingSpotState.lastCatch):0;
  const cropTypes = {
    wheat:{label:"Trigo",seed:"wheatSeeds",produce:"wheat",growth:360,hunger:20},
    carrots:{label:"Cenoura",seed:"carrotSeeds",produce:"carrots",growth:480,hunger:28},
    cabbages:{label:"Repolho",seed:"cabbageSeeds",produce:"cabbages",growth:600,hunger:34}
  };
  const totalGameMinutes=()=>((gameTime.day-1)*1440)+(gameTime.hour*60)+gameTime.minute;
  const tanneryState={readyAt:Number.isSafeInteger(saved?.tanneryState?.readyAt)?Math.max(0,saved.tanneryState.readyAt):0,ready:saved?.tanneryState?.ready===true};
  const animalCare={
    chickens:{fedUntil:saved?.animalCare?.chickens?.fedUntil??0,nextAt:saved?.animalCare?.chickens?.nextAt??0,ready:saved?.animalCare?.chickens?.ready??0},
    sheep:{fedUntil:saved?.animalCare?.sheep?.fedUntil??0,nextAt:saved?.animalCare?.sheep?.nextAt??0,ready:saved?.animalCare?.sheep?.ready??0}
  };
  const animalSettings={
    chickens:{label:"Galinhas",count:3,feed:"wheat",feedLabel:"1 trigo",product:"eggs",productLabel:"ovos",interval:360},
    sheep:{label:"Ovelhas",count:2,feed:"cabbages",feedLabel:"1 repolho",product:"wool",productLabel:"lã",interval:720}
  };
  const animalEnclosures={chickens:{localX:-6,localZ:-2.7,x:0,z:0,group:null},sheep:{localX:-6.2,localZ:3.1,x:0,z:0,group:null}};
  const animalActors=[],wildlifeActors=[];
  const huntedWildlife=new Set(Array.isArray(saved?.huntedWildlife)?saved.huntedWildlife:[]);
  let wildlifeAnimationTime=0,currentWildlifeTarget=null,animalAnimationTime=0,currentAnimalType=null,canUseAnimalPen=false;
  const wildlifeDefinitions={deer:{label:"Cervo",meat:2,hide:1,color:0x9a6842},boar:{label:"Javali",meat:3,hide:1,color:0x51443a}};
  const farmPlots=[0,1,2].map((index)=>{
    const id="farm-plot-"+(index+1), prior=saved?.farmPlots?.find(item=>item.id===id);
    return {id,crop:prior&&Object.hasOwn(cropTypes,prior.crop)?prior.crop:null,plantedAt:prior&&Number.isSafeInteger(prior.plantedAt)?Math.max(0,prior.plantedAt):0,localX:5.1,localZ:(index-1)*2.2,group:null,cropGroup:null,visualStage:-1,x:0,z:0};
  });
  let currentFarmPlot=null,canUseFarmPlot=false;
  let currentVillager=null;
  const completedVillagerTasks=new Set();
  const villagers=[];
  const familyActors=[];
  const villageHouses=(Array.isArray(saved?.villageHouses)?saved.villageHouses:[]).map((house,index)=>({id:house.id||"house-"+(index+1),x:house.x,z:house.z,yaw:house.yaw||0,group:null,occupants:[]}));
  const recruitedVillagers=Array.isArray(saved?.recruitedVillagers)?saved.recruitedVillagers.slice(0,120):[];
  const villagerRelationships=Array.isArray(saved?.villagerRelationships)?saved.villagerRelationships.filter(item=>item&&typeof item.a==="string"&&typeof item.b==="string"&&item.a!==item.b&&Number.isFinite(item.affinity)&&["amizade","namoro","casados"].includes(item.status)).slice(0,300).map(item=>({a:item.a,b:item.b,affinity:THREE.MathUtils.clamp(item.affinity,0,100),status:item.status,weddingDay:Number.isSafeInteger(item.weddingDay)?Math.max(1,item.weddingDay):null})):[];
  const familyPregnancies=Array.isArray(saved?.familyPregnancies)?saved.familyPregnancies.filter(item=>item&&typeof item.a==="string"&&typeof item.b==="string"&&typeof item.houseId==="string"&&Number.isSafeInteger(item.startDay)&&Number.isSafeInteger(item.dueDay)&&item.dueDay>item.startDay).slice(0,120).map(item=>({a:item.a,b:item.b,houseId:item.houseId,startDay:Math.max(1,item.startDay),dueDay:Math.max(1,item.dueDay),childName:typeof item.childName==="string"?item.childName.slice(0,24):""})):[];
  const familyChildren=Array.isArray(saved?.familyChildren)?saved.familyChildren.filter(item=>item&&typeof item.id==="string"&&typeof item.name==="string"&&typeof item.a==="string"&&typeof item.b==="string"&&typeof item.houseId==="string"&&Number.isSafeInteger(item.birthDay)).slice(0,300).map(item=>({id:item.id.slice(0,100),name:item.name.slice(0,24),a:item.a,b:item.b,houseId:item.houseId,birthDay:Math.max(1,item.birthDay),gender:item.gender==="F"?"F":"M",adultProfession:typeof item.adultProfession==="string"?item.adultProfession:""})):[];
  const dynastyState={
    heirId:typeof saved?.dynastyState?.heirId==="string"&&familyChildren.some(child=>child.id===saved.dynastyState.heirId)?saved.dynastyState.heirId:"",
    familyHouseId:typeof saved?.dynastyState?.familyHouseId==="string"&&villageHouses.some(house=>house.id===saved.dynastyState.familyHouseId)?saved.dynastyState.familyHouseId:(villageHouses[0]?.id||"")
  };
  let nextChildName=typeof saved?.nextChildName==="string"?saved.nextChildName.slice(0,24):"";
  function readMissionProgress(){
    try{
      const raw=localStorage.getItem("legado-do-vale-missoes-v1");
      const data=raw?JSON.parse(raw):{};
      return data&&typeof data==="object"?data:{};
    }catch{return {};}
  }
  const savedMissionProgress=readMissionProgress();
  const missionState={
    chapter1RewardClaimed:saved?.missionState?.chapter1RewardClaimed===true||savedMissionProgress.chapter1RewardClaimed===true,
    chapter2MessengerMet:saved?.missionState?.chapter2MessengerMet===true||savedMissionProgress.chapter2MessengerMet===true,
    chapter2Discoveries:[...new Set([...(Array.isArray(saved?.missionState?.chapter2Discoveries)?saved.missionState.chapter2Discoveries:[]),...(Array.isArray(savedMissionProgress.chapter2Discoveries)?savedMissionProgress.chapter2Discoveries:[])].filter(id=>["lookout","river-crossing","old-oak","old-road","village-trail"].includes(id)))],
    chapter2RewardClaimed:saved?.missionState?.chapter2RewardClaimed===true||savedMissionProgress.chapter2RewardClaimed===true,
    chapter2Journal:[...new Set([...(Array.isArray(saved?.missionState?.chapter2Journal)?saved.missionState.chapter2Journal:[]),...(Array.isArray(savedMissionProgress.chapter2Journal)?savedMissionProgress.chapter2Journal:[])].filter(item=>typeof item==="string"))].slice(-20),
    chapter3ElderMet:saved?.missionState?.chapter3ElderMet===true||savedMissionProgress.chapter3ElderMet===true,
    chapter3Discoveries:[...new Set([...(Array.isArray(saved?.missionState?.chapter3Discoveries)?saved.missionState.chapter3Discoveries:[]),...(Array.isArray(savedMissionProgress.chapter3Discoveries)?savedMissionProgress.chapter3Discoveries:[])].filter(id=>["market-square","village-well","council-hall"].includes(id)))],
    chapter3RewardClaimed:saved?.missionState?.chapter3RewardClaimed===true||savedMissionProgress.chapter3RewardClaimed===true,
    chapter3Journal:[...new Set([...(Array.isArray(saved?.missionState?.chapter3Journal)?saved.missionState.chapter3Journal:[]),...(Array.isArray(savedMissionProgress.chapter3Journal)?savedMissionProgress.chapter3Journal:[])].filter(item=>typeof item==="string"))].slice(-20)
  };
  const villageStock=Object.fromEntries(["wheat","carrots","cabbages","wood","branches","stones","wool","rawMeat","hide","trout","carp","minnow","roastedMeat","vegetableSoup","bread","omelet","berryPorridge","grilledTrout","grilledCarp","grilledMinnow","fabric","craftedGoods","tools"].map(key=>[key,Number.isSafeInteger(saved?.villageStock?.[key])?Math.max(0,Math.min(999999,saved.villageStock[key])):0]));
  let villageProductionLastMinute=Number.isSafeInteger(saved?.villageProductionLastMinute)?Math.max(0,saved.villageProductionLastMinute):totalGameMinutes();
  let villageFoodLastDay=Number.isSafeInteger(saved?.villageFoodLastDay)?Math.max(1,saved.villageFoodLastDay):gameTime.day;
  let villageFoodReport=saved?.villageFoodReport&&typeof saved.villageFoodReport==="object"?{day:Number.isSafeInteger(saved.villageFoodReport.day)?Math.max(1,saved.villageFoodReport.day):gameTime.day,served:Math.max(0,Math.min(40,Number.isSafeInteger(saved.villageFoodReport.served)?saved.villageFoodReport.served:0)),missing:Math.max(0,Math.min(40,Number.isSafeInteger(saved.villageFoodReport.missing)?saved.villageFoodReport.missing:0))}:{day:gameTime.day,served:0,missing:0};
  let kitchenPosition=null,kitchenFire=null,kitchenGroup=null,canUseKitchen=false,loomPosition=null,loomGroup=null,canUseLoom=false,tanneryPosition=null,tanneryGroup=null,canUseTannery=false,merchantPosition=null,canUseMerchant=false;
  const savedStructurePositions=saved?.structurePositions&&typeof saved.structurePositions==="object"?saved.structurePositions:{};
  let gameTimeAccumulator=0;
  function updateGameClockUI(){gameClockUI.textContent="DIA "+gameTime.day+" · "+String(gameTime.hour).padStart(2,"0")+":"+String(gameTime.minute).padStart(2,"0");}
  function inventoryLoad(){return Object.values(inventory).reduce((total,value)=>total+(Number.isFinite(value)?value:0),0);}
  function carryCapacity(){return tools.leatherBackpack?180:120;}
  function canCarry(amount=1){if(inventoryLoad()+amount<=carryCapacity())return true;showToast("Mochila cheia · capacidade "+carryCapacity()+". Guarde itens no baú ou equipe a mochila de couro.");return false;}
  function refreshTanneryProduction(){if(tanneryState.readyAt>0&&totalGameMinutes()>=tanneryState.readyAt){tanneryState.readyAt=0;tanneryState.ready=true;saveProgress(true);if(!tanneryPanel.classList.contains("hidden"))renderTanneryPanel();}}
  function updateColdExposure(minutes){
    const protection=(clothing.tunic?0.28:0)+(clothing.trousers?0.18:0)+(clothing.boots?0.14:0);
    let sheltered=false;
    if(builtCabin){const dx=player.x-builtCabin.x,dz=player.z-builtCabin.z,lx=dx*Math.cos(builtCabin.yaw)-dz*Math.sin(builtCabin.yaw),lz=dx*Math.sin(builtCabin.yaw)+dz*Math.cos(builtCabin.yaw);sheltered=Math.abs(lx)<1.9&&Math.abs(lz)<2.1;}
    for(let i=0;i<minutes;i++){const minuteOfDay=(gameTime.hour*60+gameTime.minute+i)%1440,hour=Math.floor(minuteOfDay/60),cold=hour>=18||hour<7;
      if(sheltered)survival.warmth=Math.min(100,survival.warmth+0.3);else if(cold)survival.warmth=Math.max(0,survival.warmth-0.18*(1-protection));else survival.warmth=Math.min(100,survival.warmth+0.2);
      if(survival.warmth<=0)survival.health=Math.max(0,survival.health-0.035);}
    updateSurvivalUI(true);
  }
  function advanceGameMinutes(minutes){
    updateColdExposure(minutes);
    const total=gameTime.hour*60+gameTime.minute+minutes;
    gameTime.day+=Math.floor(total/1440);
    const wrapped=total%1440;
    gameTime.hour=Math.floor(wrapped/60);gameTime.minute=wrapped%60;updateGameClockUI();
    refreshFarmVisuals();
    refreshAnimalProduction();
    refreshTanneryProduction();
    refreshResourceRespawns();
    processVillageProduction();
  }
  updateGameClockUI();
  const resourceBase = saved?.resourceBase ?? {
    x: saved?.x ?? 0,
    z: saved?.z ?? 35,
    yaw: saved?.yaw ?? 0
  };
  const forwardX = -Math.sin(resourceBase.yaw);
  const forwardZ = -Math.cos(resourceBase.yaw);
  const rightX = Math.cos(resourceBase.yaw);
  const rightZ = -Math.sin(resourceBase.yaw);
  function resourcePosition(side, forward) {
    return {
      x: resourceBase.x + rightX * side + forwardX * forward,
      z: resourceBase.z + rightZ * side + forwardZ * forward
    };
  }

  const collectedResources = new Set(saved?.collectedResources ?? []);
  const resourceRespawnAt = new Map(Object.entries(saved?.resourceRespawnAt ?? {}).filter(([id, value]) =>
    ["branch-pile-01","branch-pile-02","branch-pile-03","branch-pile-04","branch-pile-05","branch-pile-06","stone-cluster-01","stone-cluster-02","stone-cluster-03","berry-bush-01"].includes(id) &&
    Number.isSafeInteger(value) && value >= 0
  ));
  const resourceDefinitions = new Map();
  const collectibleNodes = [];
  const collectibleMeshes = [];

  function makeResourceLabel(text, accent) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    context.fillStyle = "rgba(20, 32, 24, 0.94)";
    context.fillRect(8, 8, 496, 112);
    context.strokeStyle = accent;
    context.lineWidth = 7;
    context.strokeRect(11, 11, 490, 106);
    context.fillStyle = "#fff1d0";
    context.font = "bold 40px Arial, sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 256, 65);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(material);
    sprite.position.set(0, 2.6, 0);
    sprite.scale.set(3.75, 0.94, 1);
    sprite.renderOrder = 20;
    return sprite;
  }

  function addResourceNode(id, itemKey, label, amount, x, z, accent, build) {
    resourceDefinitions.set(id, { id, itemKey, label, amount, x, z, accent, build });
    if (collectibleNodes.some((node) => node.id === id)) return;
    if (collectedResources.has(id)) {
      const respawnAt = resourceRespawnAt.get(id);
      if (Number.isSafeInteger(respawnAt) && totalGameMinutes() < respawnAt) return;
      collectedResources.delete(id);
      resourceRespawnAt.delete(id);
    }
    const root = new THREE.Group();
    root.position.set(x, groundHeight(x, z), z);
    build(root);
    root.add(makeResourceLabel(label.toLocaleUpperCase("pt-BR") + "  +" + amount, accent));
    scene.add(root);
    const node = { id, itemKey, label, amount, root, x, z };
    root.traverse((object) => {
      if (object.isMesh) {
        object.userData.resourceNode = node;
        collectibleMeshes.push(object);
      }
    });
    collectibleNodes.push(node);
  }

  function refreshResourceRespawns() {
    for (const [id, respawnAt] of resourceRespawnAt) {
      if (totalGameMinutes() >= respawnAt && !collectibleNodes.some((node) => node.id === id)) {
        const definition = resourceDefinitions.get(id);
        if (definition) addResourceNode(definition.id, definition.itemKey, definition.label, definition.amount,
          definition.x, definition.z, definition.accent, definition.build);
      }
    }
  }

  // Recursos maiores e etiquetas flutuantes para que sejam fáceis de localizar.
  const branchSpot = resourcePosition(-1.55, 3.65);
  addResourceNode("branch-pile-01", "branches", "Galhos", 3, branchSpot.x, branchSpot.z, "#d5a15f", (root) => {
    const material = new THREE.MeshStandardMaterial({ color: 0x8b6038, roughness: 1 });
    const twig = new THREE.CylinderGeometry(0.105, 0.13, 1.75, 6);
    [[0,0.19,0,0.18],[0.1,0.28,0.18,-0.3],[-0.12,0.37,-0.16,0.34],[0.03,0.48,-0.28,-0.12]].forEach(([x,y,z,rz]) => {
      const mesh = new THREE.Mesh(twig, material);
      mesh.position.set(x,y,z);
      mesh.rotation.set(0,0,Math.PI/2+rz);
      root.add(mesh);
    });
    const leafMaterial = new THREE.MeshStandardMaterial({color:0x587343,roughness:1});
    const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.18,0),leafMaterial);
    leaf.position.set(0.65,0.25,0.08);
    root.add(leaf);
  });

  function addExtraBranchPile(id, side, forward) {
    const spot=resourcePosition(side,forward);
    addResourceNode(id,"branches","Galhos",3,spot.x,spot.z,"#d5a15f",(root)=>{
      const material=new THREE.MeshStandardMaterial({color:0x8b6038,roughness:1});
      const twig=new THREE.CylinderGeometry(0.105,0.13,1.75,6);
      [[0,0.19,0,0.18],[0.1,0.28,0.18,-0.3],[-0.12,0.37,-0.16,0.34],[0.03,0.48,-0.28,-0.12]].forEach(([x,y,z,rz])=>{
        const mesh=new THREE.Mesh(twig,material); mesh.position.set(x,y,z); mesh.rotation.set(0,0,Math.PI/2+rz); root.add(mesh);
      });
      const leafMaterial=new THREE.MeshStandardMaterial({color:0x587343,roughness:1});
      const leaf=new THREE.Mesh(new THREE.IcosahedronGeometry(0.18,0),leafMaterial); leaf.position.set(0.65,0.25,0.08); root.add(leaf);
    });
  }
  // Galhos adicionais garantem que a receita seja alcançável após fabricar o machado.
  addExtraBranchPile("branch-pile-02",-7.5,7.5);
  addExtraBranchPile("branch-pile-03",7.5,7.5);
  addExtraBranchPile("branch-pile-04",0,16);
  // Estoque extra visível perto da clareira para quem já coletou os primeiros montes.
  addExtraBranchPile("branch-pile-05",-5.2,10.5);
  addExtraBranchPile("branch-pile-06",5.2,10.5);

  const stoneSpot = resourcePosition(1.55, 3.65);
  function buildStonePile(root) {
    const material = new THREE.MeshStandardMaterial({ color: 0x969b91, roughness: 1, flatShading: true });
    const geometry = new THREE.DodecahedronGeometry(0.48, 0);
    [[-0.42,0.35,0,1.05],[0.2,0.32,0.12,0.9],[0.48,0.28,-0.36,0.82],[-0.12,0.25,-0.5,0.88],[0.03,0.66,-0.14,0.72]].forEach(([x,y,z,s]) => {
      const mesh = new THREE.Mesh(geometry,material);
      mesh.position.set(x,y,z);
      mesh.scale.set(s*1.15,s*0.82,s);
      root.add(mesh);
    });
  }
  addResourceNode("stone-cluster-01", "stones", "Pedras", 4, stoneSpot.x, stoneSpot.z, "#bfc6c2", buildStonePile);
  for (const [id, side, forward] of [["stone-cluster-02",-5.2,14],["stone-cluster-03",5.2,14]]) {
    const spot = resourcePosition(side, forward);
    addResourceNode(id, "stones", "Pedras", 4, spot.x, spot.z, "#bfc6c2", buildStonePile);
  }

  const berrySpot = resourcePosition(0, 5.35);
  addResourceNode("berry-bush-01", "berries", "Frutas", 3, berrySpot.x, berrySpot.z, "#d77b87", (root) => {
    const leaf = new THREE.MeshStandardMaterial({ color: 0x3c7546, roughness: 1, flatShading: true });
    const berry = new THREE.MeshStandardMaterial({ color: 0xd33e56, roughness: 0.68, emissive: 0x3c0710 });
    const bushGeometry = new THREE.IcosahedronGeometry(0.82, 1);
    [[-0.48,0.66,0],[0.38,0.62,0.18],[0,0.82,-0.38],[-0.05,0.48,0.36]].forEach(([x,y,z]) => {
      const mesh = new THREE.Mesh(bushGeometry,leaf);
      mesh.position.set(x,y,z);
      mesh.scale.set(1.08,0.86,1);
      root.add(mesh);
    });
    [[-0.56,0.82,0.14],[0.15,1.1,0.28],[0.57,0.8,-0.22],[-0.12,0.63,-0.58],[0.33,0.48,0.42]].forEach(([x,y,z]) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.15,10,8),berry);
      mesh.position.set(x,y,z);
      root.add(mesh);
    });
  });

  // Bancada de fabricação posicionada na clareira inicial.
  const workbenchPosition = resourcePosition(4.25, 0.8);
  const workbench = new THREE.Group();
  workbench.position.set(workbenchPosition.x, groundHeight(workbenchPosition.x, workbenchPosition.z), workbenchPosition.z);
  const benchWood = new THREE.MeshStandardMaterial({ color: 0x765033, roughness: 0.96 });
  const benchTop = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.22, 1.05), new THREE.MeshStandardMaterial({ color: 0x9a7046, roughness: 0.9 }));
  benchTop.position.y = 1.12;
  workbench.add(benchTop);
  for (const x of [-0.91, 0.91]) {
    for (const z of [-0.34, 0.34]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.08, 0.18), benchWood);
      leg.position.set(x, 0.54, z);
      workbench.add(leg);
    }
  }
  const lowerBeam = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.14, 0.14), benchWood);
  lowerBeam.position.set(0, 0.42, 0);
  workbench.add(lowerBeam);
  const benchLabel = makeResourceLabel("BANCADA · E", "#d4b16b");
  benchLabel.position.set(0, 2.45, 0);
  benchLabel.scale.set(4.1, 1.02, 1);
  workbench.add(benchLabel);
  scene.add(workbench);

  // Pequena banca de comércio na clareira inicial, próxima à oficina.
  merchantPosition=resourcePosition(-4.8,2.7);
  const merchantStall=new THREE.Group();
  const stallWood=new THREE.MeshStandardMaterial({color:0x805532,roughness:0.95});
  const stallCloth=new THREE.MeshStandardMaterial({color:0x9a4d36,roughness:0.9});
  const stallTop=new THREE.Mesh(new THREE.BoxGeometry(3.2,0.16,1.35),stallWood);stallTop.position.y=1.18;merchantStall.add(stallTop);
  for(const x of [-1.35,1.35])for(const z of [-0.52,0.52]){const leg=new THREE.Mesh(new THREE.BoxGeometry(0.14,1.15,0.14),stallWood);leg.position.set(x,0.58,z);merchantStall.add(leg);}
  const canopy=new THREE.Mesh(new THREE.BoxGeometry(3.5,0.14,1.75),stallCloth);canopy.position.set(0,2.55,0);merchantStall.add(canopy);
  for(let i=0;i<5;i++){const stripe=new THREE.Mesh(new THREE.BoxGeometry(0.13,0.025,1.72),new THREE.MeshStandardMaterial({color:0xe3c99a,roughness:1}));stripe.position.set(-1.4+i*0.7,2.64,0);merchantStall.add(stripe);}
  const merchantBody=new THREE.Mesh(new THREE.CylinderGeometry(0.34,0.42,1.12,8),new THREE.MeshStandardMaterial({color:0x526b4c,roughness:1}));merchantBody.position.set(0,1.72,-0.92);merchantStall.add(merchantBody);
  const merchantHead=new THREE.Mesh(new THREE.SphereGeometry(0.29,10,8),new THREE.MeshStandardMaterial({color:0xd5a77c,roughness:1}));merchantHead.position.set(0,2.48,-0.92);merchantStall.add(merchantHead);
  const merchantHat=new THREE.Mesh(new THREE.CylinderGeometry(0.38,0.3,0.16,8),stallCloth);merchantHat.position.set(0,2.72,-0.92);merchantStall.add(merchantHat);
  merchantStall.position.set(merchantPosition.x,groundHeight(merchantPosition.x,merchantPosition.z),merchantPosition.z);scene.add(merchantStall);
  const merchantLabel=makeResourceLabel("MERCADOR · E","#d4b16b");merchantLabel.position.set(0,3.35,0);merchantLabel.scale.set(4.0,1,1);merchantStall.add(merchantLabel);

  // Candidatos aguardam convite. Só moradores convidados e alojados aparecem no mundo.
  const villagerDefinitions=[
    {id:"mara",name:"Mara",role:"Agricultora",gender:"F",body:0x718b4e,accent:0xd8b36b},
    {id:"tome",name:"Tomé",role:"Lenhador",gender:"M",body:0x79513a,accent:0xb7a078},
    {id:"ines",name:"Inês",role:"Artesã",gender:"F",body:0x78618a,accent:0xd8b36b},
    {id:"raul",name:"Raul",role:"Caçador",gender:"M",body:0x536b50,accent:0x9b6b4d},
    {id:"cecilia",name:"Cecília",role:"Tecelã",gender:"F",body:0x8a5c63,accent:0xd9b8a0},
    {id:"gaspar",name:"Gaspar",role:"Pescador",gender:"M",body:0x53616b,accent:0x9b9b6b},
    {id:"bruna",name:"Bruna",role:"Cozinheira",gender:"F",body:0x9a7048,accent:0xd8b36b},
    {id:"martim",name:"Martim",role:"Ferreiro",gender:"M",body:0x59616b,accent:0xb7a078}
  ];
  function createVillager(def,house,slot=0,assignedProfession=null,needsState=null){
    const root=new THREE.Group();
    const robe=new THREE.Mesh(new THREE.CylinderGeometry(.28,.38,1.12,7),new THREE.MeshStandardMaterial({color:def.body,roughness:1}));
    robe.position.y=.78;root.add(robe);
    const belt=new THREE.Mesh(new THREE.TorusGeometry(.29,.045,5,8),new THREE.MeshStandardMaterial({color:0x59412d,roughness:1}));
    belt.rotation.x=Math.PI/2;belt.position.y=.72;root.add(belt);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.235,9,7),new THREE.MeshStandardMaterial({color:0xd5a77c,roughness:1}));
    head.position.y=1.53;root.add(head);
    const cap=new THREE.Mesh(new THREE.ConeGeometry(.27,.28,7),new THREE.MeshStandardMaterial({color:def.accent,roughness:1}));
    cap.position.y=1.79;root.add(cap);
    const armMat=new THREE.MeshStandardMaterial({color:def.body,roughness:1});
    for(const side of [-1,1]){const arm=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,.62,6),armMat);arm.position.set(side*.34,.92,0);arm.rotation.z=side*-.16;root.add(arm);}
    const footMat=new THREE.MeshStandardMaterial({color:0x3c3025,roughness:1});
    for(const side of [-1,1]){const foot=new THREE.Mesh(new THREE.BoxGeometry(.17,.16,.32),footMat);foot.position.set(side*.14,.12,.04);root.add(foot);}
    const side=slot===0?-.9:.9,forward=3.5,yaw=house.yaw||0;
    const start={x:house.x+side*Math.cos(yaw)+forward*Math.sin(yaw),z:house.z-side*Math.sin(yaw)+forward*Math.cos(yaw)};
    root.position.set(start.x,groundHeight(start.x,start.z),start.z);
    scene.add(root);
    const profession=assignedProfession||def.role;
    const label=makeResourceLabel(def.name+" · "+profession.toUpperCase(),"#f0c76f");label.position.set(0,2.9,0);label.scale.set(3.7,.9,1);root.add(label);
    const marker=new THREE.Mesh(new THREE.TorusGeometry(.62,.055,7,20),new THREE.MeshBasicMaterial({color:def.accent,transparent:true,opacity:.9}));
    marker.rotation.x=Math.PI/2;marker.position.y=.08;root.add(marker);
    const professionIndex=Math.max(0,villagerDefinitions.findIndex(item=>item.role===profession));
    const workOffsets=[[-5,-4],[5,-4],[-5,4],[5,4],[-7,0],[7,0],[0,-7],[0,7]];
    const offset=workOffsets[professionIndex%workOffsets.length];
    return {...def,role:profession,profession,labelMesh:label,group:root,x:start.x,z:start.z,homeX:start.x,homeZ:start.z,workX:THREE.MathUtils.clamp(start.x+offset[0],-90,90),workZ:THREE.MathUtils.clamp(start.z+offset[1],-90,90),targetX:start.x,targetZ:start.z,wait:1+Math.random()*3,walk:0,arms:root.children.filter((child,index)=>index>=4&&index<=5),houseId:house.id,atWork:false,hunger:THREE.MathUtils.clamp(Number.isFinite(needsState?.hunger)?needsState.hunger:75,0,100),happiness:THREE.MathUtils.clamp(Number.isFinite(needsState?.happiness)?needsState.happiness:75,0,100),lastMealDay:Number.isSafeInteger(needsState?.lastMealDay)?Math.max(1,needsState.lastMealDay):Math.max(1,gameTime.day-1),foodStatus:typeof needsState?.foodStatus==="string"?needsState.foodStatus:"Aguardando refeição",housingStatus:"Moradia disponível"};
  }
  const villageStockLabels={wheat:"Trigo",carrots:"Cenouras",cabbages:"Repolhos",wood:"Madeira",branches:"Galhos",stones:"Pedras",wool:"Lã",rawMeat:"Carne crua",hide:"Couro bruto",trout:"Trutas",carp:"Carpas",minnow:"Lambaris",roastedMeat:"Carne assada",vegetableSoup:"Sopa de legumes",bread:"Pães",omelet:"Omeletes",berryPorridge:"Mingau",grilledTrout:"Truta assada",grilledCarp:"Carpa assada",grilledMinnow:"Lambari assado",fabric:"Tecido",craftedGoods:"Artesanato",tools:"Ferramentas"};
  function addVillageStock(key,amount=1){villageStock[key]=Math.min(999999,(villageStock[key]||0)+amount);}
  function processVillagerWorkHour(villager){
    if(villager.happiness<20||villager.hunger<20)return;
    switch(villager.role){
      case "Agricultora": addVillageStock("wheat",1);addVillageStock("carrots",1);addVillageStock("cabbages",1);break;
      case "Lenhador": addVillageStock("wood",2);addVillageStock("branches",1);break;
      case "Caçador": addVillageStock("rawMeat",1);addVillageStock("hide",1);break;
      case "Pescador": addVillageStock(["trout","carp","minnow"][(gameTime.day+villagers.indexOf(villager))%3],1);break;
      case "Cozinheira":
        if(villageStock.rawMeat>0){villageStock.rawMeat--;addVillageStock("roastedMeat",1);}
        else if(villageStock.carrots>0&&villageStock.cabbages>0){villageStock.carrots--;villageStock.cabbages--;addVillageStock("vegetableSoup",1);}
        break;
      case "Tecelã":
        if(villageStock.wool>0){villageStock.wool--;addVillageStock("fabric",1);}
        break;
      case "Artesã":
        if(villageStock.wood>=1&&villageStock.branches>=1){villageStock.wood--;villageStock.branches--;addVillageStock("craftedGoods",1);}
        break;
      case "Ferreiro":
        if(villageStock.stones>=2&&villageStock.wood>=1){villageStock.stones-=2;villageStock.wood--;addVillageStock("tools",1);}
        break;
    }
  }
  const villageMealKeys=["roastedMeat","vegetableSoup","bread","omelet","berryPorridge","grilledTrout","grilledCarp","grilledMinnow"];
  function villageFoodCount(){return villageMealKeys.reduce((total,key)=>total+(villageStock[key]||0),0);}
  function processVillageDailyFood(day){
    if(day<=villageFoodLastDay)return false;
    villageFoodLastDay=day;
    let served=0,missing=0;
    for(const villager of villagers){
      const meal=villageMealKeys.find(key=>(villageStock[key]||0)>0);
      villager.hunger=Math.max(0,villager.hunger-30);
      const hasHome=villageHouses.some(house=>house.id===villager.houseId);
      villager.housingStatus=hasHome?"Casa atribuída":"Sem moradia";
      if(meal){villageStock[meal]--;served++;villager.lastMealDay=day;villager.hunger=Math.min(100,villager.hunger+65);villager.foodStatus="Alimentado no dia "+day;villager.happiness=Math.min(100,villager.happiness+9);}
      else{missing++;villager.foodStatus="Sem refeição no dia "+day;villager.happiness=Math.max(0,villager.happiness-18);}
      if(hasHome)villager.happiness=Math.min(100,villager.happiness+3);else villager.happiness=Math.max(0,villager.happiness-10);
      if(villager.role){villager.happiness=Math.min(100,villager.happiness+2);}
      if(villager.hunger<25)villager.happiness=Math.max(0,villager.happiness-6);
      villager.happiness=THREE.MathUtils.clamp(villager.happiness,0,100);
    }
    villageFoodReport={day,served,missing};
    updateVillagerRelationships(day);
    return villagers.length>0;
  }
  function familyAncestors(personId,seen=new Set()){
    if(seen.has(personId))return seen;
    seen.add(personId);
    const record=familyChildren.find(child=>child.id===personId);
    if(record){familyAncestors(record.a,seen);familyAncestors(record.b,seen);}
    return seen;
  }
  function areCloseFamilyMembers(firstId,secondId){
    const firstAncestors=familyAncestors(firstId);
    const secondAncestors=familyAncestors(secondId);
    if(firstAncestors.has(secondId)||secondAncestors.has(firstId))return true;
    for(const ancestor of firstAncestors)if(secondAncestors.has(ancestor))return true;
    return false;
  }
  function updateVillagerRelationships(day){
    const descendants=new Set(familyChildren.map(child=>child.id));
    const adults=villagers.filter(v=>v.gender==="F"||v.gender==="M");
    const candidates=[];
    for(const house of villageHouses){
      const residents=house.occupants.map(id=>villagers.find(v=>v.id===id)).filter(Boolean);
      if(residents.length>=2)candidates.push([residents[0],residents[1]]);
    }
    for(let i=0;i<adults.length;i++){
      for(let j=i+1;j<adults.length;j++){
        const first=adults[i],second=adults[j];
        if(!descendants.has(first.id)&&!descendants.has(second.id))continue;
        if(first.gender===second.gender||areCloseFamilyMembers(first.id,second.id))continue;
        candidates.push([first,second]);
      }
    }
    const processed=new Set();
    for(const [first,second] of candidates){
      if(!first.gender||!second.gender||first.gender===second.gender)continue;
      const key=familyPairKey(first.id,second.id);
      if(processed.has(key)||areCloseFamilyMembers(first.id,second.id))continue;
      processed.add(key);
      let relation=villagerRelationships.find(item=>familyPairKey(item.a,item.b)===key);
      if(!relation){
        if(villagerRelationships.length>=300)continue;
        relation={a:first.id,b:second.id,affinity:0,status:"amizade",weddingDay:null};
        villagerRelationships.push(relation);
      }
      if(relation.status==="casados")continue;
      const conditions=first.happiness>=45&&second.happiness>=45&&first.lastMealDay>=day-1&&second.lastMealDay>=day-1;
      relation.affinity=THREE.MathUtils.clamp(relation.affinity+(conditions?12:-4),0,100);
      if(relation.affinity>=40&&relation.status==="amizade")relation.status="namoro";
      if(relation.affinity>=100){
        relation.status="casados";relation.weddingDay=day;
        first.happiness=Math.min(100,first.happiness+10);second.happiness=Math.min(100,second.happiness+10);
        showToast("Celebração na vila! "+first.name+" e "+second.name+" se casaram.");
      }
    }
  }
  function dayProgress(item,day=gameTime.day){return THREE.MathUtils.clamp((day-item.startDay)/(item.dueDay-item.startDay),0,1);}
  function childDevelopment(child,day=gameTime.day){
    const ageDays=Math.max(0,day-child.birthDay),ageYears=Math.floor(ageDays/30);
    return {ageDays,ageYears,stage:ageYears<=2?"Bebê":ageYears<=6?"Criança":ageYears<=17?"Jovem":"Adulto"};
  }
  function createFamilyVillagerDefinition(child,profession="Agricultora"){
    return {id:child.id,name:child.name,role:villagerDefinitions.some(def=>def.role===profession)?profession:"Agricultora",gender:child.gender==="F"?"F":"M",body:child.gender==="F"?0x8d596b:0x536d82,accent:child.gender==="F"?0xd7b18b:0xc5a16d};
  }
  function integrateAdultFamilyChildren(){
    let changed=false;
    for(const child of familyChildren){
      if(childDevelopment(child).stage!=="Adulto"||villagers.some(item=>item.id===child.id))continue;
      const house=villageHouses.find(item=>item.id===child.houseId)||villageHouses.find(item=>item.id===villagers.find(v=>v.id===child.a)?.houseId);
      if(!house)continue;
      const profession=child.adultProfession||"Agricultora";
      child.adultProfession=profession;
      const definition=createFamilyVillagerDefinition(child,profession);
      const resident=createVillager(definition,house,0,profession);
      villagers.push(resident);
      recruitedVillagers.push({id:child.id,houseId:house.id,profession});
      const actorIndex=familyActors.findIndex(actor=>actor.child.id===child.id);
      if(actorIndex>=0){const actor=familyActors[actorIndex];if(actor.group)scene.remove(actor.group);familyActors.splice(actorIndex,1);}
      showToast(child.name+" atingiu a idade adulta e agora faz parte dos trabalhadores da vila como "+profession+".");
      changed=true;
    }
    return changed;
  }
  function buildFamilyActorVisual(actor){
    if(actor.group)scene.remove(actor.group);
    const child=actor.child,stage=actor.stage;
    const scale=stage==="Bebê"?.43:stage==="Criança"?.68:stage==="Jovem"?.86:1;
    const tunicColor=child.gender==="F"?0x8d596b:0x536d82;
    const accentColor=child.gender==="F"?0xd7b18b:0xc5a16d;
    const skinMaterial=new THREE.MeshStandardMaterial({color:0xd5a77c,roughness:1});
    const tunicMaterial=new THREE.MeshStandardMaterial({color:tunicColor,roughness:1});
    const accentMaterial=new THREE.MeshStandardMaterial({color:accentColor,roughness:1});
    const hairMaterial=new THREE.MeshStandardMaterial({color:child.gender==="F"?0x49352c:0x59412f,roughness:1});
    const bootMaterial=new THREE.MeshStandardMaterial({color:0x3c3025,roughness:1});
    const root=new THREE.Group();
    const torso=new THREE.Mesh(new THREE.CylinderGeometry(.19,.27,.68,7),tunicMaterial);
    torso.position.y=.88;root.add(torso);
    const belt=new THREE.Mesh(new THREE.TorusGeometry(.22,.035,5,8),accentMaterial);
    belt.rotation.x=Math.PI/2;belt.position.y=.65;root.add(belt);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.205,9,7),skinMaterial);
    head.position.y=1.42;root.add(head);
    const hair=new THREE.Mesh(new THREE.SphereGeometry(.215,8,6,0,Math.PI*2,0,Math.PI*.55),hairMaterial);
    hair.position.y=1.49;root.add(hair);
    const arms=[],legs=[];
    for(const side of [-1,1]){
      const arm=new THREE.Mesh(new THREE.CylinderGeometry(.065,.085,.48,6),tunicMaterial);
      arm.position.set(side*.27,.94,0);arm.rotation.z=side*-.13;root.add(arm);arms.push(arm);
      const leg=new THREE.Mesh(new THREE.CylinderGeometry(.075,.09,.38,6),bootMaterial);
      leg.position.set(side*.105,.28,0);root.add(leg);legs.push(leg);
    }
    const label=makeResourceLabel(child.name+" · "+stage.toUpperCase(),"#f0c76f");
    label.position.set(0,1.95,0);label.scale.set(2.65,.66,1);root.add(label);
    root.scale.setScalar(scale);
    root.position.set(actor.x,groundHeight(actor.x,actor.z),actor.z);
    scene.add(root);
    actor.group=root;actor.arms=arms;actor.legs=legs;
  }
  function createFamilyActor(child){
    if(villagers.some(item=>item.id===child.id)||familyActors.some(actor=>actor.child.id===child.id))return;
    const parent=villagers.find(item=>item.id===child.a)||villagers.find(item=>item.id===child.b);
    const house=villageHouses.find(item=>item.id===child.houseId)||villageHouses.find(item=>item.id===parent?.houseId);
    if(!house)return;
    const development=childDevelopment(child);
    const index=familyActors.length,side=index%2===0?-1:1,depth=2.4+Math.floor(index/2)%3*.65;
    const x=house.x+side*1.45,z=house.z+depth;
    const actor={child,stage:development.stage,ageYears:development.ageYears,houseId:house.id,homeX:x,homeZ:z,x,z,targetX:x,targetZ:z,wait:1+Math.random()*3,walk:Math.random()*6,group:null,arms:[],legs:[]};
    familyActors.push(actor);buildFamilyActorVisual(actor);
  }
  function updateFamilyActors(delta){
    for(const actor of familyActors){
      const development=childDevelopment(actor.child);
      if(development.stage!==actor.stage){
        actor.stage=development.stage;actor.ageYears=development.ageYears;
        buildFamilyActorVisual(actor);
        showToast(actor.child.name+" agora está na fase: "+actor.stage.toLowerCase()+".");
      }
      if(actor.stage==="Bebê")continue;
      actor.wait-=delta;
      let dx=actor.targetX-actor.x,dz=actor.targetZ-actor.z,distance=Math.hypot(dx,dz);
      if(distance<.18&&actor.wait<=0){
        const radius=actor.stage==="Criança"?3.5:actor.stage==="Jovem"?5.5:7;
        const angle=Math.random()*Math.PI*2,range=1.2+Math.random()*radius;
        actor.targetX=THREE.MathUtils.clamp(actor.homeX+Math.cos(angle)*range,-94,94);
        actor.targetZ=THREE.MathUtils.clamp(actor.homeZ+Math.sin(angle)*range,-94,94);
        actor.wait=1+Math.random()*3;
        dx=actor.targetX-actor.x;dz=actor.targetZ-actor.z;distance=Math.hypot(dx,dz);
      }
      if(distance>.18){
        const speed=actor.stage==="Criança"?.72:actor.stage==="Jovem"?.92:1.02;
        const step=Math.min(distance,speed*delta);
        actor.x+=dx/distance*step;actor.z+=dz/distance*step;
        actor.group.position.x=actor.x;actor.group.position.z=actor.z;
        actor.group.position.y=groundHeight(actor.x,actor.z);
        actor.group.rotation.y=Math.atan2(dx,dz);
        actor.walk+=delta*7;
        actor.arms.forEach((arm,index)=>{arm.rotation.x=Math.sin(actor.walk+index*Math.PI)*.2;});
        actor.legs.forEach((leg,index)=>{leg.rotation.x=Math.sin(actor.walk+index*Math.PI)*.32;});
      }else{
        actor.arms.forEach(arm=>{arm.rotation.x=0;});
        actor.legs.forEach(leg=>{leg.rotation.x=0;});
      }
    }
  }
  function familyPairKey(a,b){return [a,b].sort().join("|");}
  function processFamilyLifecycle(day){
    let changed=false;
    for(let i=familyPregnancies.length-1;i>=0;i--){
      const pregnancy=familyPregnancies[i];
      if(day<pregnancy.dueDay)continue;
      const parentA=villagers.find(v=>v.id===pregnancy.a),parentB=villagers.find(v=>v.id===pregnancy.b);
      if(!parentA||!parentB){familyPregnancies.splice(i,1);changed=true;continue;}
      const names=["Aline","Davi","Clara","Miguel","Lia","Samuel","Rosa","Tomás","Isabel","Bento"];
      const pairCount=familyChildren.filter(child=>familyPairKey(child.a,child.b)===familyPairKey(pregnancy.a,pregnancy.b)).length;
      const chosen=(pregnancy.childName||"").trim()||names[(day+pairCount*3)%names.length];
      const newborn={id:"child-"+pregnancy.a+"-"+pregnancy.b+"-"+day,name:chosen.slice(0,24),a:pregnancy.a,b:pregnancy.b,houseId:pregnancy.houseId,birthDay:day,gender:Math.random()<0.5?"F":"M"};
      familyChildren.push(newborn);createFamilyActor(newborn);
      familyPregnancies.splice(i,1);changed=true;
      showToast("Uma nova vida chegou ao vale! "+chosen+" nasceu na família de "+parentA.name+" e "+parentB.name+".");
    }
    for(const relation of villagerRelationships){
      if(relation.status!=="casados")continue;
      const a=villagers.find(v=>v.id===relation.a),b=villagers.find(v=>v.id===relation.b);
      if(!a||!b)continue;
      const pair=familyPairKey(a.id,b.id);
      const children=familyChildren.filter(child=>familyPairKey(child.a,child.b)===pair);
      const pregnant=familyPregnancies.some(item=>familyPairKey(item.a,item.b)===pair);
      const lastBirth=children.reduce((latest,child)=>Math.max(latest,child.birthDay),0);
      if(pregnant||children.length>=2||day<(relation.weddingDay||day)+3||day-lastBirth<30)continue;
      if(a.happiness<65||b.happiness<65||a.lastMealDay<day||b.lastMealDay<day)continue;
      const familyHouse=villageHouses.find(house=>house.id===a.houseId)||villageHouses.find(house=>house.id===b.houseId);
      if(!familyHouse||familyPregnancies.length>=120)continue;
      familyPregnancies.push({a:a.id,b:b.id,houseId:familyHouse.id,startDay:day,dueDay:day+9,childName:nextChildName});
      nextChildName="";changed=true;
      showToast(a.name+" e "+b.name+" estão esperando um bebê! O nascimento está previsto para o dia "+(day+9)+".");
    }
    if(integrateAdultFamilyChildren())changed=true;
    if(changed){saveProgress(true);if(!villagersDirectory.classList.contains("hidden"))renderVillagersDirectory();}
    return changed;
  }
  function villagerRelationshipLabel(villager){
    const relation=villagerRelationships.find(item=>item.a===villager.id||item.b===villager.id);
    if(!relation)return "Solteiro(a)";
    const partnerId=relation.a===villager.id?relation.b:relation.a;
    const partner=villagers.find(item=>item.id===partnerId);
    if(!partner)return "Solteiro(a)";
    if(relation.status==="casados")return "Casado(a) com "+partner.name;
    if(relation.status==="namoro")return "Namorando "+partner.name+" · afinidade "+Math.round(relation.affinity)+"%";
    return "Conhecendo "+partner.name+" · afinidade "+Math.round(relation.affinity)+"%";
  }
  function processVillageProduction(){
    const now=totalGameMinutes();
    if(!Number.isSafeInteger(villageProductionLastMinute)||villageProductionLastMinute>now){villageProductionLastMinute=now;return;}
    let changed=false;
    let nextHour=Math.floor(villageProductionLastMinute/60)*60+60;
    while(nextHour<=now){
      const minuteOfDay=nextHour%1440,hour=Math.floor(minuteOfDay/60);
      if(minuteOfDay===0){
        if(processVillageDailyFood(gameTime.day))changed=true;
        if(processFamilyLifecycle(gameTime.day))changed=true;
      }
      if(hour>=7&&hour<19){
        for(const villager of villagers)processVillagerWorkHour(villager);
        changed=true;
      }
      nextHour+=60;
    }
    villageProductionLastMinute=now;
    if(changed){saveProgress(true);if(!villagersDirectory.classList.contains("hidden"))renderVillagersDirectory();}
  }
  function updateVillagers(delta){
    const hour=gameTime.hour+gameTime.minute/60;
    const working=hour>=7&&hour<19;
    for(const villager of villagers){
      const destinationX=working?villager.workX:villager.homeX;
      const destinationZ=working?villager.workZ:villager.homeZ;
      villager.atWork=working;
      const dx=destinationX-villager.x,dz=destinationZ-villager.z,distance=Math.hypot(dx,dz);
      if(distance>.28){
        const step=Math.min(distance,1.05*delta);
        villager.x+=dx/distance*step;villager.z+=dz/distance*step;
        villager.group.position.x=villager.x;villager.group.position.z=villager.z;
        villager.group.position.y=groundHeight(villager.x,villager.z);
        villager.group.rotation.y=Math.atan2(dx,dz);
        villager.walk+=delta*8;
        villager.arms.forEach((arm,index)=>{arm.rotation.x=Math.sin(villager.walk+index*Math.PI)*.22;});
      }else{
        villager.x=destinationX;villager.z=destinationZ;
        villager.group.position.x=destinationX;villager.group.position.z=destinationZ;
        villager.group.position.y=groundHeight(destinationX,destinationZ);
        villager.arms.forEach(arm=>{arm.rotation.x=0;});
      }
    }
  }
  function openVillagerPanel(villager){
    if(!villager)return;
    currentVillager=villager;
    villagerTitle.textContent=villager.name+" · "+villager.role.toUpperCase();
    villagerDialogue.textContent="Olá! Obrigado por me convidar para viver no seu vilarejo. Esta é minha nova casa, e vou contribuir com meu ofício para o crescimento do assentamento.";
    villagerTask.innerHTML='<div class="villager-task-note">Morador do vilarejo · Casa: '+villager.houseId.replace("house-","")+' · Profissão: '+villager.role+' · '+(villager.atWork?"No local de trabalho":"Em casa ou a caminho")+'</div><div class="villager-needs-detail"><strong>Felicidade: '+Math.round(villager.happiness)+'/100</strong><div class="villager-needs-track"><i style="width:'+villager.happiness+'%"></i></div><strong>Fome: '+Math.round(villager.hunger)+'/100</strong><div class="villager-needs-track hunger"><i style="width:'+villager.hunger+'%"></i></div><small>'+villager.foodStatus+' · '+villager.housingStatus+'</small></div>';
    villagerTask.insertAdjacentHTML("beforeend",'<div class="villager-needs-detail"><strong>Relacionamento: '+villagerRelationshipLabel(villager)+'</strong></div>');
    villagerPanel.classList.remove("hidden");
  }
  function closeVillagerPanel(){villagerPanel.classList.add("hidden");currentVillager=null;}

  function villagerDirection(villager){
    const dx=villager.x-player.x,dz=villager.z-player.z;
    const right=dx*Math.cos(player.yaw)-dz*Math.sin(player.yaw);
    const forward=-dx*Math.sin(player.yaw)-dz*Math.cos(player.yaw);
    const horizontal=Math.abs(right)>Math.abs(forward);
    return horizontal?(right>0?"à direita":"à esquerda"):(forward>0?"à frente":"atrás");
  }
  function availableHouse(){
    return villageHouses.find(house=>house.occupants.length<2)||null;
  }
  function renderVillagersDirectory(){
    villagersList.previousElementSibling?.classList.contains("village-stock")&&villagersList.previousElementSibling.remove();
    const capacity=villageHouses.length*2;
    const free=villageHouses.reduce((n,house)=>n+Math.max(0,2-house.occupants.length),0);
    const averageMood=villagers.length?Math.round(villagers.reduce((sum,v)=>sum+v.happiness,0)/villagers.length):0;
    villagersSummary.textContent=villagers.length+" moradores · "+villageHouses.length+" casas · "+free+" vagas · felicidade média "+averageMood+"/100";
    const datingCount=villagerRelationships.filter(item=>item.status==="namoro").length,marriedCount=villagerRelationships.filter(item=>item.status==="casados").length;
    const relationshipMarkup='<section class="village-relationships"><h3 class="villager-invite-heading">RELACIONAMENTOS E FAMÍLIAS</h3><p>'+datingCount+' casais namorando · '+marriedCount+' casamentos celebrados</p>'+(villagerRelationships.length?villagerRelationships.map(item=>{const a=villagers.find(v=>v.id===item.a),b=villagers.find(v=>v.id===item.b);return a&&b?'<div class="village-couple"><strong>'+a.name+' &amp; '+b.name+'</strong><span>'+(item.status==="casados"?"Casados · cerimônia no dia "+item.weddingDay:item.status==="namoro"?"Namorando":"Conhecendo-se")+'</span><div class="villager-needs-track"><i style="width:'+item.affinity+'%"></i></div><small>Afinidade: '+Math.round(item.affinity)+'%</small></div>':"";}).join(""):'<small>A convivência dos moradores da mesma casa pode iniciar novas relações.</small>')+'</section>';
    const pregnancyMarkup='<section class="village-relationships"><h3 class="villager-invite-heading">GRAVIDEZ E NASCIMENTOS</h3>'+(familyPregnancies.length?familyPregnancies.map(item=>{const a=villagers.find(v=>v.id===item.a),b=villagers.find(v=>v.id===item.b);return '<div class="village-couple"><strong>'+(a?.name||"Morador")+" & "+(b?.name||"Morador")+'</strong><span>Gestação · nascimento previsto: dia '+item.dueDay+'</span><div class="villager-needs-track"><i style="width:'+Math.round(dayProgress(item)*100)+'%"></i></div><small>'+(item.childName?"Nome escolhido: "+item.childName:"Nome ainda não definido")+'</small></div>';}).join(""):'<small>Casais casados, felizes e bem alimentados poderão esperar filhos. A gestação dura 9 dias do jogo.</small>')+'<div class="family-name-control"><label for="family-child-name">Nome para o próximo bebê</label><input id="family-child-name" maxlength="24" placeholder="Digite um nome" value="'+nextChildName.replace(/&/g,"&amp;").replace(/"/g,"&quot;")+'"><button type="button" data-save-child-name>DEFINIR NOME</button><small>O nome será aplicado à próxima gravidez ou à gestação sem nome escolhido.</small></div></section>';
    const familyTreeMarkup='<section class="village-relationships"><h3 class="villager-invite-heading">ÁRVORE FAMILIAR · GERAÇÕES</h3>'+(familyChildren.length?familyChildren.map(child=>{
      const a=villagers.find(v=>v.id===child.a),b=villagers.find(v=>v.id===child.b);
      const parentA=familyChildren.find(item=>item.id===child.a),parentB=familyChildren.find(item=>item.id===child.b);
      const grandparents=[parentA,parentB].filter(Boolean).flatMap(parent=>[parent.a,parent.b].map(id=>villagers.find(v=>v.id===id)?.name||familyChildren.find(item=>item.id===id)?.name).filter(Boolean)).filter((name,index,all)=>all.indexOf(name)===index);
      const generation=(parentA||parentB)?"3ª geração · neto(a)":"2ª geração · filho(a)";
      const growth=childDevelopment(child);
      return '<div class="village-couple"><strong>👨‍👩‍👧 '+(a?.name||parentA?.name||"Pai")+" + "+(b?.name||parentB?.name||"Mãe")+" → "+child.name+'</strong><span>'+generation+' · '+growth.stage+' · '+growth.ageYears+' ano(s) · nasceu no dia '+child.birthDay+(growth.stage==="Adulto"?" · trabalhador da vila":"")+'</span>'+(grandparents.length?'<small>Avós: '+grandparents.join(" / ")+'</small>':"")+'<small>Família da casa '+child.houseId.replace("house-","")+'</small></div>';
    }).join(""):'<small>Os filhos e suas gerações aparecerão aqui após os primeiros nascimentos.</small>')+'</section>';const foodStatus=villagers.length?(villageFoodReport.missing>0?"Último dia: "+villageFoodReport.served+" alimentados · "+villageFoodReport.missing+" sem refeição":"Último dia: todos receberam alimento"):"Convide moradores para iniciar o consumo diário.";
    const eligibleHeirs=familyChildren.slice().sort((a,b)=>a.birthDay-b.birthDay);
    const selectedHeir=familyChildren.find(child=>child.id===dynastyState.heirId);
    const storedAssets=Object.values(inventory).reduce((sum,value)=>sum+(Number.isFinite(value)?Math.max(0,value):0),0)+Object.values(villageStock).reduce((sum,value)=>sum+(Number.isFinite(value)?Math.max(0,value):0),0);
    const localRep=settlementReputation.vale||0;
    const localRank=localRep>=35?"Grande líder regional":localRep>=20?"Prestigiado":localRep>=10?"Respeitado":localRep>=5?"Conhecido":"Estrangeiro";
    const reputationMarkup='<section class="village-relationships"><h3 class="villager-invite-heading">REPUTAÇÃO · FAMA E INFLUÊNCIA</h3><p>Suas atitudes e compromissos constroem sua confiança perante os moradores.</p><div class="village-couple"><strong>🏘️ Assentamento do Vale</strong><span>'+localRank+' · '+localRep+'/35 pontos para o título máximo</span><div class="villager-needs-track"><i style="width:'+Math.min(100,localRep/35*100)+'%"></i></div><small>'+completedTradeContracts.size+' encomendas concluídas · Reputação comercial geral: '+tradeReputation+'</small></div><div class="village-couple"><strong>Próximos títulos</strong><small>Conhecido: 5 · Respeitado: 10 · Prestigiado: 20 · Grande líder regional: 35</small><small>Os títulos representam confiança crescente e preparam benefícios e missões especiais.</small></div><div class="village-couple"><strong>Outras vilas do reino</strong><small>As reputações de outras localidades serão ativadas quando essas vilas forem adicionadas ao mapa.</small></div></section>';
    const chapterObjectives=[
      {label:"Construir sua cabana e estabelecer um abrigo",done:Boolean(builtCabin)},
      {label:"Preparar uma casa para receber moradores",done:villageHouses.length>0},
      {label:"Convidar o primeiro morador para o vale",done:recruitedVillagers.length>0},
      {label:"Concluir sua primeira encomenda comercial",done:completedTradeContracts.size>0}
    ];
    const chapterProgress=chapterObjectives.filter(item=>item.done).length;
    const chapterReady=chapterProgress===chapterObjectives.length;
    const missionMarkup='<section class="village-relationships"><h3 class="villager-invite-heading">📜 HISTÓRIA PRINCIPAL · CAPÍTULO 1</h3><div class="village-couple"><strong>UM NOVO COMEÇO</strong><span>O vale guarda oportunidades — mas primeiro você precisa construir um lar, conquistar aliados e provar que pode prosperar.</span><small>Mensagem do cronista: “Toda grande dinastia começa com um primeiro passo. Erga seu abrigo e faça deste vale um lugar onde as pessoas queiram viver.”</small><div class="villager-needs-track"><i style="width:'+Math.round(chapterProgress/chapterObjectives.length*100)+'%"></i></div><small>Progresso: '+chapterProgress+'/'+chapterObjectives.length+' objetivos</small></div>'+chapterObjectives.map((item,index)=>'<div class="village-couple"><strong>'+(item.done?'✓ ':'○ ')+(index+1)+'. '+item.label+'</strong><span>'+(item.done?'Concluído':'Pendente')+'</span></div>').join('')+(missionState.chapter1RewardClaimed?'<div class="village-couple"><strong>Capítulo concluído!</strong><span>Recompensa recebida: 25 moedas e 2 pontos de reputação regional.</span></div>':chapterReady?'<button type="button" class="family-name-control" data-claim-chapter-one>CONCLUIR CAPÍTULO E RECEBER RECOMPENSA</button>':'<small>Complete os quatro objetivos para concluir o capítulo e receber sua recompensa.</small>')+'<small>O progresso é salvo automaticamente. Novos capítulos e personagens serão adicionados em etapas futuras.</small></section>';
    const dynastyMarkup='<section class="village-relationships"><h3 class="villager-invite-heading">DINASTIA · HERANÇA E SUCESSÃO</h3><p>Fundador: Personagem principal · '+familyChildren.length+' descendentes registrados · '+villageHouses.length+' propriedades familiares</p><label class="villager-profession-label">HERDEIRO PRINCIPAL <select data-dynasty-heir><option value="">Escolher sucessor</option>'+eligibleHeirs.map(child=>'<option value="'+child.id+'" '+(dynastyState.heirId===child.id?"selected":"")+'>'+child.name+' · '+childDevelopment(child).stage+' · '+childDevelopment(child).ageYears+' ano(s)</option>').join("")+'</select></label><label class="villager-profession-label">RESIDÊNCIA PRINCIPAL DA FAMÍLIA <select data-dynasty-house><option value="">Selecionar propriedade</option>'+villageHouses.map((house,index)=>'<option value="'+house.id+'" '+(dynastyState.familyHouseId===house.id?"selected":"")+'>Casa '+(index+1)+'</option>').join("")+'</select></label><div class="village-couple"><strong>Patrimônio preparado para a sucessão</strong><span>'+coins+' moedas · '+villageHouses.length+' casas · '+storedAssets+' itens em inventário e depósito</span><small>'+(selectedHeir?'Sucessor escolhido: '+selectedHeir.name:'Nenhum sucessor escolhido')+' · '+(dynastyState.familyHouseId?'Residência familiar definida':'Residência familiar não definida')+'</small><small>A herança ficará vinculada ao sucessor e à residência escolhida. Nenhum bem ou moeda será transferido agora; a sucessão por falecimento será uma etapa futura.</small></div></section>';
        const stockMarkup='<section class="village-stock"><h3 class="villager-invite-heading">DEPÓSITO DA VILA</h3><p class="village-food-status">🍲 Provisões: <strong>'+villageFoodCount()+' refeições</strong> · '+villagers.length+' moradores<br><small>'+foodStatus+'</small></p><div class="village-stock-grid">'+Object.entries(villageStockLabels).map(([key,label])=>'<span>'+label+'</span><strong>'+String(villageStock[key]||0)+'</strong>').join("")+'</div><button type="button" data-deposit-village class="village-deposit-button">DEPOSITAR RECURSOS DA MOCHILA</button><small class="village-stock-note">Cada morador consome 1 refeição por dia, retirada automaticamente do depósito. A cozinheira prepara carne assada ou sopa quando há ingredientes.</small></section>';
      const chapter2Places=[{id:"lookout",name:"Mirante das Colinas",description:"Um ponto alto de onde se avista boa parte do vale."},{id:"river-crossing",name:"Travessia do Rio",description:"Uma passagem rasa que pode ligar as duas margens."},{id:"old-oak",name:"Carvalho Antigo",description:"Uma árvore antiga marcada por viajantes."},{id:"old-road",name:"Estrada Antiga",description:"Vestígios de uma rota usada por comerciantes."},{id:"village-trail",name:"Trilha da Vila Distante",description:"O caminho que segue em direção a uma futura comunidade."}];
    const chapter2Count=missionState.chapter2Discoveries.length;
    const chapter2Ready=missionState.chapter2MessengerMet&&chapter2Count===chapter2Places.length;
    const chapter2Markup='<section class="village-relationships chapter-two"><h3 class="villager-invite-heading">📜 HISTÓRIA PRINCIPAL · CAPÍTULO 2</h3><div class="village-couple"><strong>CONHECENDO O VALE</strong><span>'+(missionState.chapter1RewardClaimed?'Um viajante chegou com notícias de outras comunidades. Conheça o mensageiro e siga os marcos brilhantes para descobrir os caminhos do vale.':'Conclua o Capítulo 1 para desbloquear esta jornada.')+'</span><div class="villager-needs-track"><i style="width:'+Math.round((Number(missionState.chapter2MessengerMet)+chapter2Count+Number(missionState.chapter2RewardClaimed))/(7)*100)+'%"></i></div><small>Progresso: '+(Number(missionState.chapter2MessengerMet)+chapter2Count+(missionState.chapter2RewardClaimed?1:0))+'/7 etapas</small></div><div class="chapter-two-actions">'+(missionState.chapter1RewardClaimed?'<button type="button" data-chapter2-talk>FALAR COM O MENSAGEIRO</button>':'<small>Capítulo bloqueado · conclua o primeiro capítulo.</small>')+'</div><h4 class="villager-invite-heading">MAPA DE DESCOBERTAS</h4>'+chapter2Places.map((place,index)=>'<div class="village-couple"><strong>'+(missionState.chapter2Discoveries.includes(place.id)?'✓ ':'◇ ')+(index+1)+'. '+place.name+'</strong><small>'+(missionState.chapter2Discoveries.includes(place.id)?place.description:'Local ainda não explorado · procure o marco dourado no mundo')+'</small></div>').join("")+'<h4 class="villager-invite-heading">DIÁRIO DE AVENTURAS</h4><div class="chapter-two-journal">'+(missionState.chapter2Journal.length?missionState.chapter2Journal.map(entry=>'<p>📖 '+entry+'</p>').join(""):'<p>O diário está vazio. Suas conversas e descobertas serão registradas aqui.</p>')+'</div>'+(missionState.chapter2RewardClaimed?'<div class="village-couple"><strong>Capítulo 2 concluído!</strong><span>Relatório entregue · Recompensa recebida: 40 moedas e 3 pontos de reputação regional.</span></div>':chapter2Ready?'<div class="village-couple"><strong>Todos os locais foram descobertos!</strong><span>Volte ao mensageiro e entregue seu relatório.</span></div>':'<small>Explore os cinco marcos dourados e retorne ao mensageiro para concluir o capítulo.</small>')+'</section>';
    const chapter3Places=[{id:"market-square",name:"Praça do Mercado",description:"Os comerciantes organizam as trocas e abastecem a comunidade."},{id:"village-well",name:"Poço Comunitário",description:"O poço reúne os moradores e garante água para a vila."},{id:"council-hall",name:"Casa do Conselho",description:"Os anciãos decidem os rumos e as necessidades da comunidade."}];
    const chapter3Count=missionState.chapter3Discoveries.length;
    const chapter3Ready=missionState.chapter3ElderMet&&chapter3Count===chapter3Places.length;
    const chapter3Markup='<section class="village-relationships chapter-two"><h3 class="villager-invite-heading">📜 HISTÓRIA PRINCIPAL · CAPÍTULO 3</h3><div class="village-couple"><strong>A VILA VIZINHA</strong><span>'+(missionState.chapter2RewardClaimed?'A trilha revelou uma pequena comunidade. Converse com a anciã Alina e conheça os pontos importantes da vila.':'Conclua o Capítulo 2 para desbloquear esta jornada.')+'</span><div class="villager-needs-track"><i style="width:'+Math.round((Number(missionState.chapter3ElderMet)+chapter3Count+Number(missionState.chapter3RewardClaimed))/5*100)+'%"></i></div><small>Progresso: '+(Number(missionState.chapter3ElderMet)+chapter3Count+(missionState.chapter3RewardClaimed?1:0))+'/5 etapas</small></div><div class="chapter-two-actions">'+(missionState.chapter2RewardClaimed?'<button type="button" data-chapter3-talk>FALAR COM ALINA · ANCIÃ DA VILA</button>':'<small>Capítulo bloqueado · conclua o segundo capítulo.</small>')+'</div><h4 class="villager-invite-heading">PONTOS DA COMUNIDADE</h4>'+chapter3Places.map((place,index)=>'<div class="village-couple"><strong>'+(missionState.chapter3Discoveries.includes(place.id)?'✓ ':'◇ ')+(index+1)+'. '+place.name+'</strong><small>'+(missionState.chapter3Discoveries.includes(place.id)?place.description:'Local ainda não visitado · procure o marco dourado na vila vizinha')+'</small></div>').join("")+'<h4 class="villager-invite-heading">DIÁRIO DA VILA</h4><div class="chapter-two-journal">'+(missionState.chapter3Journal.length?missionState.chapter3Journal.map(entry=>'<p>📖 '+entry+'</p>').join(""):'<p>Conheça Alina para iniciar seu diário nesta comunidade.</p>')+'</div>'+(missionState.chapter3RewardClaimed?'<div class="village-couple"><strong>Capítulo 3 concluído!</strong><span>A vila vizinha reconheceu sua ajuda · Recompensa recebida: 60 moedas e 4 pontos de reputação regional.</span></div>':chapter3Ready?'<div class="village-couple"><strong>A vila está conhecida!</strong><span>Volte a Alina e entregue seu relatório.</span></div>':'<small>Conheça Alina, visite a praça, o poço e a casa do conselho.</small>')+'</section>';
    villagersList.innerHTML=missionMarkup+chapter2Markup+chapter3Markup+reputationMarkup+dynastyMarkup+relationshipMarkup+pregnancyMarkup+familyTreeMarkup+(villagers.length?villagers.map(v=>{
      const distance=Math.hypot(v.x-player.x,v.z-player.z),direction=villagerDirection(v);
      const mood=v.happiness>=75?"Muito feliz":v.happiness>=50?"Satisfeito":v.happiness>=25?"Insatisfeito":"Muito insatisfeito";
      return '<article class="villager-directory-item"><div><strong>'+v.name+'</strong><span>'+v.role+' · '+mood+'</span><small class="villager-romance">'+villagerRelationshipLabel(v)+'</small><small>Felicidade '+Math.round(v.happiness)+'/100 · Fome '+Math.round(v.hunger)+'/100</small><div class="villager-needs-track"><i style="width:'+v.happiness+'%"></i></div><small>'+v.foodStatus+' · '+v.housingStatus+' · '+(v.atWork?"Trabalhando":"Em casa / deslocando-se")+' · '+direction+' · '+distance.toFixed(0)+' m · Casa '+v.houseId.replace("house-","")+'</small><label class="villager-profession-label">PROFISSÃO <select data-villager-profession="'+v.id+'">'+villagerDefinitions.map(def=>'<option value="'+def.role+'" '+(def.role===v.role?"selected":"")+' >'+def.role+'</option>').join("")+'</select></label></div><button type="button" data-face-villager="'+v.id+'">LOCALIZAR</button></article>';
    }).join(""):'<p class="inventory-note">O vilarejo ainda não tem moradores. Construa uma casa e convide os primeiros habitantes.</p>');
    const invited=new Set(recruitedVillagers.map(item=>item.id));
    const vacancy=Boolean(availableHouse());
    villagersList.insertAdjacentHTML("beforebegin",stockMarkup);
    villagersInvites.innerHTML='<h3 class="villager-invite-heading">PESSOAS QUE VOCÊ PODE CONVIDAR</h3>'+villagerDefinitions.filter(def=>!invited.has(def.id)).map(def=>'<article class="villager-directory-item"><div><strong>'+def.name+'</strong><span>'+def.role+'</span><small>Disponível para morar no vale</small></div><button type="button" data-invite-villager="'+def.id+'" '+(!vacancy?'disabled':'')+'>CONVIDAR</button></article>').join("");
    if(!vacancy&&villagerDefinitions.some(def=>!invited.has(def.id)))villagersInvites.insertAdjacentHTML("beforeend",'<p class="inventory-note">Construa uma casa para abrir 2 vagas de moradores.</p>');
  }
  function inviteVillager(id){
    const def=villagerDefinitions.find(item=>item.id===id);
    const house=availableHouse();
    if(!def||recruitedVillagers.some(item=>item.id===id))return;
    if(!house){showToast("Não há vagas. Construa outra casa para convidar mais moradores.");return;}
    const slot=house.occupants.length;
    const resident=createVillager(def,house,slot);
    house.occupants.push(id);villagers.push(resident);recruitedVillagers.push({id,houseId:house.id,profession:def.role});
    saveProgress(true);renderVillagersDirectory();updateResourceTarget();
    showToast(def.name+" aceitou o convite e chegou ao vilarejo!");
  }
  function openVillagersDirectory(){renderVillagersDirectory();villagersDirectory.classList.remove("hidden");}
  function closeVillagersDirectory(){villagersDirectory.classList.add("hidden");}
  villagersToggle.addEventListener("click",openVillagersDirectory);
  villagersDirectoryClose.addEventListener("click",closeVillagersDirectory);
  villagersDirectory.addEventListener("click",event=>{
    if(event.target.closest("[data-save-child-name]")){
      const input=document.getElementById("family-child-name"),name=(input?.value||"").trim().slice(0,24);
      if(!name){showToast("Digite um nome antes de confirmar.");return;}
      const pending=familyPregnancies.find(item=>!item.childName);
      if(pending)pending.childName=name;else nextChildName=name;
      saveProgress(true);renderVillagersDirectory();showToast("Nome "+name+" salvo para o bebê.");return;
    }
    if(!event.target.closest("[data-deposit-village]"))return;
    const depositKeys=["wood","branches","stones","wool","rawMeat","hide","wheat","carrots","cabbages","trout","carp","minnow","roastedMeat","vegetableSoup","bread","omelet","berryPorridge","grilledTrout","grilledCarp","grilledMinnow"];
    let deposited=0;
    for(const key of depositKeys){const amount=Math.max(0,Math.floor(inventory[key]||0));if(amount){addVillageStock(key,amount);inventory[key]-=amount;deposited+=amount;}}
    if(!deposited){showToast("Você não tem recursos compatíveis para depositar.");return;}
    updateInventoryUI();saveProgress(true);renderVillagersDirectory();showToast(deposited+" recursos depositados no estoque da vila.");
  });
  villagersList.addEventListener("change",event=>{
    const heirSelect=event.target.closest("select[data-dynasty-heir]");
    if(heirSelect){
      const heir=familyChildren.find(child=>child.id===heirSelect.value);
      if(heirSelect.value&&!heir){showToast("Esse descendente não está disponível para sucessão.");return;}
      dynastyState.heirId=heir?.id||"";
      saveProgress(true);renderVillagersDirectory();
      showToast(heir?"Herdeiro da dinastia definido: "+heir.name+".":"Escolha do herdeiro removida.");
      return;
    }
    const houseSelect=event.target.closest("select[data-dynasty-house]");
    if(houseSelect){
      const house=villageHouses.find(item=>item.id===houseSelect.value);
      if(houseSelect.value&&!house){showToast("Essa propriedade não está disponível.");return;}
      dynastyState.familyHouseId=house?.id||"";
      saveProgress(true);renderVillagersDirectory();
      showToast(house?"Residência principal da família definida.":"Residência familiar removida.");
      return;
    }
    const select=event.target.closest("select[data-villager-profession]");
    if(!select)return;
    const villager=villagers.find(v=>v.id===select.dataset.villagerProfession);
    const definition=villagerDefinitions.find(def=>def.role===select.value);
    if(!villager||!definition)return;
    villager.role=definition.role;villager.profession=definition.role;
    const familyChild=familyChildren.find(child=>child.id===villager.id);
    if(familyChild)familyChild.adultProfession=definition.role;
    const offsets=[[-5,-4],[5,-4],[-5,4],[5,4],[-7,0],[7,0],[0,-7],[0,7]];
    const index=villagerDefinitions.findIndex(def=>def.role===definition.role),offset=offsets[index%offsets.length];
    villager.workX=THREE.MathUtils.clamp(villager.homeX+offset[0],-90,90);villager.workZ=THREE.MathUtils.clamp(villager.homeZ+offset[1],-90,90);
    villager.group.remove(villager.labelMesh);
    const updatedLabel=makeResourceLabel(villager.name+" · "+villager.role.toUpperCase(),"#f0c76f");updatedLabel.position.set(0,2.9,0);updatedLabel.scale.set(3.7,.9,1);villager.group.add(updatedLabel);villager.labelMesh=updatedLabel;
    saveProgress(true);renderVillagersDirectory();showToast(villager.name+" agora trabalha como "+villager.role+".");
  });
  function addChapter2Journal(entry){if(!missionState.chapter2Journal.includes(entry))missionState.chapter2Journal.push(entry);missionState.chapter2Journal=missionState.chapter2Journal.slice(-20);}
  function addChapter3Journal(entry){if(!missionState.chapter3Journal.includes(entry))missionState.chapter3Journal.push(entry);missionState.chapter3Journal=missionState.chapter3Journal.slice(-20);}
  function showChapter3Dialogue(){
    if(!missionState.chapter2RewardClaimed){showToast("Conclua o Capítulo 2 para encontrar a vila vizinha.");return;}
    let panel=document.getElementById("chapter3-dialogue");
    if(!panel){panel=document.createElement("section");panel.id="chapter3-dialogue";panel.className="chapter2-dialogue";panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");game.appendChild(panel);}
    const ready=missionState.chapter3ElderMet&&missionState.chapter3Discoveries.length===3&&!missionState.chapter3RewardClaimed;
    panel.innerHTML='<header><span>VILA VIZINHA · ANCIÃ ALINA</span><button type="button" data-chapter3-close aria-label="Fechar">×</button></header><h3>'+(missionState.chapter3ElderMet?(ready?'A comunidade agradece':'Uma vila em crescimento'):'Uma nova comunidade')+'</h3><p>'+(missionState.chapter3ElderMet?(ready?'“Agora você conhece nossa praça, nosso poço e a casa do conselho. Leve este relatório aos moradores.”':'“Nossa vila precisa de aliados. Conheça os lugares importantes e entenderá como podemos crescer juntos.”'):'“Seja bem-vindo! Sou Alina, anciã desta comunidade. A praça recebe nossos comerciantes, o poço abastece as famílias e a casa do conselho guarda os planos para o futuro.”')+'</p><div class="chapter-two-actions">'+(missionState.chapter3ElderMet?(ready?'<button type="button" data-chapter3-report>ENTREGAR RELATÓRIO</button>':'<button type="button" data-chapter3-close>VOU CONHECER A VILA</button>'):'<button type="button" data-chapter3-accept>ACEITAR A MISSÃO</button><button type="button" data-chapter3-question>PERGUNTAR SOBRE A COMUNIDADE</button>')+'</div>';
    panel.classList.add("is-open");
    panel.onclick=event=>{
      if(event.target.closest("[data-chapter3-close]")){panel.classList.remove("is-open");return;}
      if(event.target.closest("[data-chapter3-accept]")){missionState.chapter3ElderMet=true;addChapter3Journal("Você conheceu Alina, a anciã, e aceitou conhecer a comunidade.");saveProgress(true);panel.classList.remove("is-open");renderVillagersDirectory();showToast("Nova missão: conheça os três pontos da vila vizinha.");return;}
      if(event.target.closest("[data-chapter3-question]")){panel.querySelector("p").textContent="“A praça fica no coração da vila. O poço está próximo das casas, e a casa do conselho fica na parte alta, onde decidimos os assuntos de todos.”";addChapter3Journal("Alina explicou a importância da praça, do poço e da casa do conselho.");saveProgress(true);panel.querySelector("[data-chapter3-question]")?.remove();return;}
      if(event.target.closest("[data-chapter3-report]")){if(missionState.chapter3RewardClaimed||!missionState.chapter3ElderMet||missionState.chapter3Discoveries.length!==3)return;missionState.chapter3RewardClaimed=true;coins=Math.min(999999,coins+60);tradeReputation=Math.min(9999,tradeReputation+4);settlementReputation.vale=Math.min(9999,(settlementReputation.vale||0)+4);addChapter3Journal("Relatório entregue. Alina agradeceu sua visita e convidou o vale central a manter relações com a vila vizinha.");saveProgress(true);updateInventoryUI();panel.classList.remove("is-open");renderVillagersDirectory();showToast("Capítulo 3 concluído! +60 moedas e +4 reputação regional.");}
    };
  }
  function showChapter2Dialogue(){
    if(!missionState.chapter1RewardClaimed){showToast("Conclua o Capítulo 1 para iniciar esta jornada.");return;}
    let panel=document.getElementById("chapter2-dialogue");
    if(!panel){panel=document.createElement("section");panel.id="chapter2-dialogue";panel.className="chapter2-dialogue";panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");game.appendChild(panel);}
    const ready=missionState.chapter2MessengerMet&&missionState.chapter2Discoveries.length===5&&!missionState.chapter2RewardClaimed;
    panel.innerHTML='<header><span>VIAJANTE DO REINO · MENSAGEIRO</span><button type="button" data-chapter2-close aria-label="Fechar">×</button></header><h3>'+(missionState.chapter2MessengerMet?'O relatório do vale':'Uma notícia de longe')+'</h3><p>'+(missionState.chapter2MessengerMet?(ready?'“Você percorreu os caminhos e encontrou os marcos antigos. Traga-me seu relatório, viajante.”':'“Continue explorando. Os marcos dourados indicam lugares importantes e cada descoberta ficará registrada em seu diário.”'):'“Saudações! Venho das terras além das colinas. Há comerciantes e pequenas comunidades espalhadas por este vale. Uma antiga estrada ligava esses lugares, mas poucos ainda conhecem seu traçado.”')+'</p><div class="chapter-two-actions">'+(missionState.chapter2MessengerMet?(ready?'<button type="button" data-chapter2-report>ENTREGAR RELATÓRIO</button>':'<button type="button" data-chapter2-close>VOU CONTINUAR EXPLORANDO</button>'):'<button type="button" data-chapter2-accept>ACEITAR A MISSÃO</button><button type="button" data-chapter2-question>PERGUNTAR SOBRE A ESTRADA</button>')+'</div>';
    panel.classList.add("is-open");
    panel.onclick=event=>{
      if(event.target.closest("[data-chapter2-close]")){panel.classList.remove("is-open");return;}
      if(event.target.closest("[data-chapter2-accept]")){missionState.chapter2MessengerMet=true;addChapter2Journal("Você conheceu o mensageiro e aceitou explorar os caminhos do vale.");saveProgress(true);panel.classList.remove("is-open");renderVillagersDirectory();showToast("Nova missão: descubra os cinco marcos do vale.");return;}
      if(event.target.closest("[data-chapter2-question]")){panel.querySelector("p").textContent="“A estrada começa além do rio e segue para o leste. Procure pedras antigas e marcas de rodas. Dizem que ela leva a uma comunidade distante.”";addChapter2Journal("O mensageiro contou sobre uma antiga estrada além do rio.");saveProgress(true);panel.querySelector("[data-chapter2-question]")?.remove();return;}
      if(event.target.closest("[data-chapter2-report]")){if(missionState.chapter2RewardClaimed||!missionState.chapter2MessengerMet||missionState.chapter2Discoveries.length!==5)return;missionState.chapter2RewardClaimed=true;coins=Math.min(999999,coins+40);tradeReputation=Math.min(9999,tradeReputation+3);settlementReputation.vale=Math.min(9999,(settlementReputation.vale||0)+3);addChapter2Journal("Relatório entregue. O mensageiro confirmou a descoberta da antiga estrada e da rota para a vila distante.");saveProgress(true);updateInventoryUI();panel.classList.remove("is-open");renderVillagersDirectory();showToast("Capítulo 2 concluído! +40 moedas e +3 reputação regional.");}
    };
  }
  villagersList.addEventListener("click",event=>{
    if(event.target.closest("[data-chapter3-talk]")){showChapter3Dialogue();return;}
    if(event.target.closest("[data-chapter2-talk]")){showChapter2Dialogue();return;}
    const rewardButton=event.target.closest("[data-claim-chapter-one]");
    if(rewardButton){
      const ready=Boolean(builtCabin)&&villageHouses.length>0&&recruitedVillagers.length>0&&completedTradeContracts.size>0;
      if(missionState.chapter1RewardClaimed){showToast("A recompensa deste capítulo já foi recebida.");return;}
      if(!ready){showToast("Ainda faltam objetivos para concluir o capítulo.");return;}
      missionState.chapter1RewardClaimed=true;
      try{localStorage.setItem("legado-do-vale-missoes-v1",JSON.stringify(missionState));}catch{}
      coins=Math.min(999999,coins+25);
      tradeReputation=Math.min(9999,tradeReputation+2);
      settlementReputation.vale=Math.min(9999,(settlementReputation.vale||0)+2);
      updateInventoryUI();saveProgress(true);renderVillagersDirectory();
      showToast("Capítulo 1 concluído! +25 moedas e +2 reputação regional.");
      return;
    }
    const button=event.target.closest("[data-face-villager]");
    if(!button)return;
    const villager=villagers.find(v=>v.id===button.dataset.faceVillager);
    if(!villager)return;
    const dx=villager.x-player.x,dz=villager.z-player.z;
    player.yaw=Math.atan2(-dx,-dz);player.pitch=-0.04;
    closeVillagersDirectory();updateResourceTarget();
    showToast("Você está olhando para "+villager.name+". Siga em frente para encontrá-lo.");
  });
  villagersInvites.addEventListener("click",event=>{
    const button=event.target.closest("[data-invite-villager]");
    if(button)inviteVillager(button.dataset.inviteVillager);
  });
  villagerClose.addEventListener("click",closeVillagerPanel);

  let builtCabin = saved?.builtCabin ?? null;
  // Primeira construção: cabana de madeira com prévia translúcida.
  let buildMode = false;
  let buildRotation = 0;
  let buildPreview = null;
  let buildPreviewValid = false;
  let buildPreviewReason = "Mova-se para escolher o local.";
  let buildPreviewTimer = 0;
  let buildSelectedId=null,buildSelectedItem=null;
  const cabinWood = new THREE.MeshStandardMaterial({ color: 0x795033, roughness: 0.98 });
  const cabinWoodLight = new THREE.MeshStandardMaterial({ color: 0x9b7048, roughness: 0.95 });
  const cabinRoof = new THREE.MeshStandardMaterial({ color: 0x55483a, roughness: 1 });
  const cabinDark = new THREE.MeshStandardMaterial({ color: 0x34291f, roughness: 1 });
  let cabinModel = null, cabinDoorPivot = null;
  let cabinDoorOpen = saved?.cabinDoorOpen === true;
  let cabinDoorAngle = cabinDoorOpen ? Math.PI / 2 : 0, cabinDoorTarget = cabinDoorAngle;
  let chestLid = null, chestTargetAngle = 0, chestCurrentAngle = 0;
  let cabinBed = null;
  function createCabinModel() {
    const root = new THREE.Group();
    const addBox = (w,h,d,x,y,z,material,rz=0) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material);
      mesh.position.set(x,y,z); mesh.rotation.z=rz; root.add(mesh); return mesh;
    };
    addBox(4.65,0.22,5.45,0,0.12,0,cabinWoodLight);
    for (let row=0;row<7;row++) {
      const y=0.42+row*0.34;
      addBox(0.3,0.34,5.25,-2.16,y,0,cabinWood);
      addBox(0.3,0.34,5.25,2.16,y,0,cabinWood);
      addBox(1.55,0.34,0.28,-1.35,y,-2.48,cabinWood);
      addBox(1.55,0.34,0.28,1.35,y,-2.48,cabinWood);
      addBox(4.35,0.34,0.28,0,y,2.48,cabinWood);
    }
    addBox(1.35,0.32,0.3,0,2.8,-2.48,cabinWoodLight);
    const doorPivot = new THREE.Group();
    doorPivot.position.set(-0.62,1.32,-2.56);
    const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.22,2.15,0.12),cabinDark);
    doorLeaf.position.set(0.61,0,0); doorPivot.add(doorLeaf);
    const doorBrace = new THREE.Mesh(new THREE.BoxGeometry(1.08,0.12,0.15),cabinWoodLight);
    doorBrace.position.set(0.61,-0.62,0); doorPivot.add(doorBrace);
    const doorHandle = new THREE.Mesh(new THREE.SphereGeometry(0.075,8,6),new THREE.MeshStandardMaterial({color:0xc5a15f,metalness:0.55,roughness:0.45}));
    doorHandle.position.set(1.05,0,0.09); doorPivot.add(doorHandle);
    root.add(doorPivot); root.userData.doorPivot=doorPivot;
    addBox(0.12,2.25,0.16,-0.68,1.28,-2.54,cabinWoodLight);
    addBox(0.12,2.25,0.16,0.68,1.28,-2.54,cabinWoodLight);
    addBox(1.45,0.14,0.18,0,2.43,-2.54,cabinWoodLight);
    for (const z of [-2.72,2.72]) {
      addBox(0.16,2.7,0.16,-2.14,1.55,z,cabinWoodLight);
      addBox(0.16,2.7,0.16,2.14,1.55,z,cabinWoodLight);
    }
    for (const x of [-2.33,2.33]) {
      addBox(0.08,0.8,1.05,x,1.85,0.55,cabinDark);
      addBox(0.12,0.1,1.18,x,2.3,0.55,cabinWoodLight);
      addBox(0.12,0.1,1.18,x,1.4,0.55,cabinWoodLight);
    }
    addBox(3.05,0.2,5.9,-1.48,3.25,0,cabinRoof,-0.58);
    addBox(3.05,0.2,5.9,1.48,3.25,0,cabinRoof,0.58);
    addBox(0.18,0.2,5.9,0,4.12,0,cabinWoodLight);
    return root;
  }
  function createCabinChest() {
    const chest=new THREE.Group();
    const wood=new THREE.MeshStandardMaterial({color:0x79502f,roughness:0.92});
    const metal=new THREE.MeshStandardMaterial({color:0xb38a4d,metalness:0.35,roughness:0.65});
    const body=new THREE.Mesh(new THREE.BoxGeometry(1.05,0.62,0.72),wood); body.position.y=0.38; chest.add(body);
    for(const x of [-0.36,0.36]){const band=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.68,0.76),metal);band.position.set(x,0.39,0);chest.add(band);}
    chestLid=new THREE.Group();
    const lid=new THREE.Mesh(new THREE.BoxGeometry(1.08,0.18,0.76),new THREE.MeshStandardMaterial({color:0x98683d,roughness:0.9}));
    lid.position.set(0,0.09,0);chestLid.add(lid);chestLid.position.set(0,0.7,-0.34);chest.add(chestLid);
    const lock=new THREE.Mesh(new THREE.BoxGeometry(0.16,0.2,0.07),metal);lock.position.set(0,0.53,-0.39);chest.add(lock);
    return chest;
  }
  function createCabinBed(){
    const bed=new THREE.Group();
    const wood=new THREE.MeshStandardMaterial({color:0x795033,roughness:0.96});
    const linen=new THREE.MeshStandardMaterial({color:0xc8b995,roughness:1});
    const blanket=new THREE.MeshStandardMaterial({color:0x65765a,roughness:1});
    const add=(w,h,d,x,y,z,material)=>{const part=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);part.position.set(x,y,z);bed.add(part);};
    add(1.3,0.22,2.05,0,0.62,0,wood);add(1.2,0.2,1.92,0,0.82,0,linen);
    add(1.18,0.13,1.25,0,0.99,0.28,blanket);add(1.18,0.12,0.48,0,1.0,-0.56,linen);
    for(const x of [-0.52,0.52])for(const z of [-0.82,0.82])add(0.13,0.62,0.13,x,0.31,z,wood);
    add(1.42,1.08,0.16,0,0.98,-1.02,wood);
    add(0.12,1.24,0.16,-0.65,1.02,-1.02,wood);add(0.12,1.24,0.16,0.65,1.02,-1.02,wood);
    return bed;
  }
  function cropStage(plot){
    if(!plot.crop)return -1;
    return Math.min(3,Math.floor(Math.max(0,totalGameMinutes()-plot.plantedAt)/cropTypes[plot.crop].growth*3));
  }
  function makeCropVisual(plot,stage){
    const crop=new THREE.Group();
    if(stage<0)return crop;
    const count=stage===0?3:stage===1?3:stage===2?5:7;
    const green=new THREE.MeshStandardMaterial({color:plot.crop==="cabbages"?0x568447:0x668d43,roughness:1});
    const lightGreen=new THREE.MeshStandardMaterial({color:0x88a94e,roughness:1});
    const gold=new THREE.MeshStandardMaterial({color:0xd6b34f,roughness:0.9});
    const orange=new THREE.MeshStandardMaterial({color:0xe28b37,roughness:1});
    for(let i=0;i<count;i++){
      const x=((i%3)-1)*0.43+(i%2)*0.08,z=(Math.floor(i/3)-1)*0.42,scale=stage===0?0.28:stage===1?0.52:stage===2?0.78:1;
      if(plot.crop==="wheat"){
        const stem=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.035,0.52*scale,5),green);stem.position.set(x,0.23*scale,z);crop.add(stem);
        if(stage>=2){const head=new THREE.Mesh(new THREE.ConeGeometry(0.09*scale,0.28*scale,5),gold);head.position.set(x,0.53*scale,z);crop.add(head);}
      }else if(plot.crop==="carrots"){
        const leaves=new THREE.Mesh(new THREE.ConeGeometry(0.18*scale,0.5*scale,5),lightGreen);leaves.position.set(x,0.25*scale,z);crop.add(leaves);
        if(stage>=2){const root=new THREE.Mesh(new THREE.ConeGeometry(0.11*scale,0.32*scale,6),orange);root.rotation.x=Math.PI;root.position.set(x,0.06,z);crop.add(root);}
      }else{
        const head=new THREE.Mesh(new THREE.SphereGeometry(0.2*scale,7,6),green);head.scale.set(1,0.7,1);head.position.set(x,0.19*scale,z);crop.add(head);
        if(stage>=2){for(let leaf=0;leaf<4;leaf++){const petal=new THREE.Mesh(new THREE.SphereGeometry(0.12*scale,6,5),lightGreen);petal.scale.set(1.2,0.45,0.8);petal.position.set(x+Math.cos(leaf*Math.PI/2)*0.16*scale,0.11*scale,z+Math.sin(leaf*Math.PI/2)*0.16*scale);crop.add(petal);}}
      }
    }
    return crop;
  }
  function refreshFarmPlotVisual(plot){
    const stage=cropStage(plot);
    if(stage===plot.visualStage)return;
    if(plot.cropGroup)plot.group.remove(plot.cropGroup);
    plot.cropGroup=makeCropVisual(plot,stage);plot.cropGroup.position.y=0.18;plot.group.add(plot.cropGroup);plot.visualStage=stage;
  }
  function refreshFarmVisuals(){
    for(const plot of farmPlots)if(plot.group)refreshFarmPlotVisual(plot);
    if(currentFarmPlot&&!farmPanel.classList.contains("hidden"))renderFarmPanel();
  }
  function createFarmPlots(){
    for(const plot of farmPlots){
      if(plot.group)scene.remove(plot.group);
      const group=new THREE.Group();
      const wood=new THREE.MeshStandardMaterial({color:0x765033,roughness:1});
      const soil=new THREE.MeshStandardMaterial({color:0x493323,roughness:1});
      const bed=new THREE.Mesh(new THREE.BoxGeometry(1.85,0.2,1.85),soil);bed.position.y=0.1;group.add(bed);
      for(const x of [-0.93,0.93]){const edge=new THREE.Mesh(new THREE.BoxGeometry(0.1,0.24,1.95),wood);edge.position.set(x,0.17,0);group.add(edge);}
      for(const z of [-0.93,0.93]){const edge=new THREE.Mesh(new THREE.BoxGeometry(1.95,0.24,0.1),wood);edge.position.set(0,0.17,z);group.add(edge);}
      const savedPlot=savedStructurePositions[plot.id];
      const wx=Number.isFinite(savedPlot?.x)?savedPlot.x:builtCabin.x+plot.localX*Math.cos(builtCabin.yaw)+plot.localZ*Math.sin(builtCabin.yaw);
      const wz=Number.isFinite(savedPlot?.z)?savedPlot.z:builtCabin.z-plot.localX*Math.sin(builtCabin.yaw)+plot.localZ*Math.cos(builtCabin.yaw);
      plot.x=wx;plot.z=wz;plot.group=group;plot.visualStage=-1;
      group.position.set(wx,groundHeight(wx,wz),wz);group.rotation.y=Number.isFinite(savedPlot?.yaw)?savedPlot.yaw:builtCabin.yaw;scene.add(group);
      refreshFarmPlotVisual(plot);
    }
  }
  function localCabinPosition(localX,localZ){
    return {x:builtCabin.x+localX*Math.cos(builtCabin.yaw)+localZ*Math.sin(builtCabin.yaw),z:builtCabin.z-localX*Math.sin(builtCabin.yaw)+localZ*Math.cos(builtCabin.yaw)};
  }
  function addFenceRect(group,width,depth){
    const wood=new THREE.MeshStandardMaterial({color:0x80603d,roughness:1}),postGeo=new THREE.BoxGeometry(0.14,0.92,0.14),railLong=new THREE.BoxGeometry(width,0.11,0.12),railShort=new THREE.BoxGeometry(0.12,0.11,depth);
    for(const x of [-width/2,width/2])for(const z of [-depth/2,depth/2]){const post=new THREE.Mesh(postGeo,wood);post.position.set(x,0.46,z);group.add(post);}
    for(const z of [-depth/2,depth/2])for(const y of [0.32,0.68]){const rail=new THREE.Mesh(railLong,wood);rail.position.set(0,y,z);group.add(rail);}
    for(const x of [-width/2,width/2])for(const y of [0.32,0.68]){const rail=new THREE.Mesh(railShort,wood);rail.position.set(x,y,0);group.add(rail);}
  }
  function createChicken(){
    const root=new THREE.Group(),white=new THREE.MeshStandardMaterial({color:0xe9e1cf,roughness:1}),red=new THREE.MeshStandardMaterial({color:0xb94b3d,roughness:1}),yellow=new THREE.MeshStandardMaterial({color:0xd6a43e,roughness:1}),dark=new THREE.MeshStandardMaterial({color:0x6e5540,roughness:1});
    const body=new THREE.Mesh(new THREE.SphereGeometry(0.27,8,7),white);body.scale.set(1,0.78,1.25);body.position.y=0.38;root.add(body);
    const head=new THREE.Mesh(new THREE.SphereGeometry(0.13,8,7),white);head.position.set(0,0.61,-0.22);root.add(head);
    const comb=new THREE.Mesh(new THREE.SphereGeometry(0.07,6,5),red);comb.scale.set(0.6,1.25,0.65);comb.position.set(0,0.75,-0.2);root.add(comb);
    const beak=new THREE.Mesh(new THREE.ConeGeometry(0.055,0.13,5),yellow);beak.rotation.x=-Math.PI/2;beak.position.set(0,0.59,-0.36);root.add(beak);
    const eye=new THREE.Mesh(new THREE.SphereGeometry(0.022,5,5),dark);eye.position.set(0.105,0.63,-0.31);root.add(eye);
    for(const side of [-1,1]){const wing=new THREE.Mesh(new THREE.SphereGeometry(0.13,7,6),white);wing.scale.set(0.55,0.7,1.1);wing.position.set(side*0.22,0.42,-0.02);root.add(wing);}
    const legs=[];for(const side of [-1,1]){const leg=new THREE.Group();leg.position.set(side*0.1,0.22,0.08);const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.025,0.22,5),yellow);shaft.position.y=-0.1;leg.add(shaft);const foot=new THREE.Mesh(new THREE.BoxGeometry(0.13,0.035,0.09),yellow);foot.position.set(0,-0.2,-0.025);leg.add(foot);root.add(leg);legs.push(leg);}
    return {group:root,legs};
  }
  function createSheep(){
    const root=new THREE.Group(),wool=new THREE.MeshStandardMaterial({color:0xe5dfcf,roughness:1}),face=new THREE.MeshStandardMaterial({color:0x765846,roughness:1}),hoof=new THREE.MeshStandardMaterial({color:0x51443a,roughness:1});
    const body=new THREE.Mesh(new THREE.SphereGeometry(0.36,8,7),wool);body.scale.set(1,0.92,1.28);body.position.y=0.48;root.add(body);
    for(let i=0;i<7;i++){const puff=new THREE.Mesh(new THREE.SphereGeometry(0.19,7,6),wool),angle=i*Math.PI*2/7;puff.position.set(Math.cos(angle)*0.25,0.53+Math.sin(angle)*0.12,Math.sin(angle)*0.31);root.add(puff);}
    const head=new THREE.Mesh(new THREE.SphereGeometry(0.19,8,7),face);head.position.set(0,0.55,-0.47);root.add(head);
    for(const side of [-1,1]){const ear=new THREE.Mesh(new THREE.SphereGeometry(0.09,6,5),face);ear.scale.set(1,0.45,1.6);ear.position.set(side*0.19,0.61,-0.43);root.add(ear);}
    const legs=[];for(const x of [-0.2,0.2])for(const z of [-0.27,0.25]){const leg=new THREE.Group();leg.position.set(x,0.3,z);const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.05,0.3,5),face);shaft.position.y=-0.15;leg.add(shaft);const foot=new THREE.Mesh(new THREE.BoxGeometry(0.09,0.06,0.1),hoof);foot.position.y=-0.29;leg.add(foot);root.add(leg);legs.push(leg);}
    return {group:root,legs};
  }
  const darkWoodAnimal=new THREE.MeshStandardMaterial({color:0x5f4631,roughness:1});
  function createAnimalEnclosures(){
    for(const type of ["chickens","sheep"]){
      const enclosure=animalEnclosures[type],center=localCabinPosition(enclosure.localX,enclosure.localZ),group=new THREE.Group();
      enclosure.x=center.x;enclosure.z=center.z;enclosure.yaw=builtCabin.yaw;enclosure.group=group;
      const width=type==="chickens"?3.8:5.6,depth=type==="chickens"?3.8:5.0;addFenceRect(group,width,depth);
      if(type==="chickens"){
        const coop=new THREE.Group(),planks=new THREE.MeshStandardMaterial({color:0x9a7047,roughness:1}),roofMat=new THREE.MeshStandardMaterial({color:0x594431,roughness:1});
        const body=new THREE.Mesh(new THREE.BoxGeometry(1.25,0.88,1.05),planks);body.position.y=0.48;coop.add(body);
        const roofA=new THREE.Mesh(new THREE.BoxGeometry(0.78,0.12,1.2),roofMat);roofA.position.set(-0.25,1.02,0);roofA.rotation.z=-0.52;coop.add(roofA);
        const roofB=roofA.clone();roofB.position.x=0.25;roofB.rotation.z=0.52;coop.add(roofB);
        const door=new THREE.Mesh(new THREE.BoxGeometry(0.34,0.48,0.05),darkWoodAnimal);door.position.set(0,0.27,-0.54);coop.add(door);
        coop.position.set(-0.8,0,0.65);group.add(coop);
      }else{
        const trough=new THREE.Mesh(new THREE.BoxGeometry(1.25,0.24,0.42),darkWoodAnimal);trough.position.set(0,0.22,-1.55);group.add(trough);
      }
      const savedPen=savedStructurePositions[type+"-pen"];if(Number.isFinite(savedPen?.x)){enclosure.x=savedPen.x;enclosure.z=savedPen.z;enclosure.yaw=Number.isFinite(savedPen.yaw)?savedPen.yaw:builtCabin.yaw;}
      group.position.set(enclosure.x,groundHeight(enclosure.x,enclosure.z),enclosure.z);group.rotation.y=enclosure.yaw;scene.add(group);
    }
    [[-0.65,-0.55],[0.65,-0.35],[0.25,0.85]].forEach((offset,index)=>{const actor=createChicken();actor.type="chickens";actor.offset=offset;actor.phase=index*2.1;actor.group.scale.setScalar(0.9);animalActors.push(actor);scene.add(actor.group);});
    [[-1.0,-0.45],[0.95,0.65]].forEach((offset,index)=>{const actor=createSheep();actor.type="sheep";actor.offset=offset;actor.phase=index*2.7;animalActors.push(actor);scene.add(actor.group);});
    updateAnimalAnimations(0);
  }
  function createWildlifeModel(type){
    const root=new THREE.Group(),legs=[],fur=new THREE.MeshStandardMaterial({color:wildlifeDefinitions[type].color,roughness:1}),dark=new THREE.MeshStandardMaterial({color:type==="deer"?0x67432e:0x292522,roughness:1}),cream=new THREE.MeshStandardMaterial({color:0xd8c7a5,roughness:1});
    const body=new THREE.Mesh(new THREE.SphereGeometry(.56,9,7),fur);body.scale.set(.82,.78,1.35);body.position.y=.9;root.add(body);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(.16,.25,.72,7),fur);neck.position.set(0,1.22,-.48);neck.rotation.x=-.32;root.add(neck);
    const head=new THREE.Mesh(new THREE.SphereGeometry(.22,8,7),dark);head.position.set(0,1.45,-.78);root.add(head);
    const snout=new THREE.Mesh(new THREE.SphereGeometry(.13,7,6),type==="deer"?cream:dark);snout.scale.set(1,.72,1.3);snout.position.set(0,1.37,-.98);root.add(snout);
    if(type==="deer"){for(const side of [-1,1]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.09,.34,5),dark);ear.position.set(side*.19,1.72,-.72);root.add(ear);const antler=new THREE.Group(),stem=new THREE.Mesh(new THREE.CylinderGeometry(.025,.04,.55,5),dark);stem.position.y=.26;antler.add(stem);for(const branch of [-1,1]){const tine=new THREE.Mesh(new THREE.CylinderGeometry(.018,.027,.27,5),dark);tine.position.set(branch*.09,.43,0);tine.rotation.z=-branch*.55;antler.add(tine);}antler.position.set(side*.12,1.62,-.72);root.add(antler);}}
    else {for(const side of [-1,1]){const tusk=new THREE.Mesh(new THREE.ConeGeometry(.07,.22,5),cream);tusk.position.set(side*.2,1.26,-.92);tusk.rotation.x=.25;root.add(tusk);}}
    for(const x of [-.31,.31])for(const z of [-.48,.48]){const leg=new THREE.Group();leg.position.set(x,.62,z);const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.065,.075,.58,5),dark);shaft.position.y=-.29;leg.add(shaft);root.add(leg);legs.push(leg);}return {group:root,legs};
  }
  function createWildlife(){const candidates=[18,47,83,126,171,219,263,309,354,401,438,462];let made=0;for(let i=0;i<candidates.length&&made<8;i++){const tree=treeSpots[candidates[i]];if(!tree)continue;const type=i%3===0?"boar":"deer",id="wild-"+type+"-"+String(i+1).padStart(2,"0");if(huntedWildlife.has(id))continue;const x=tree.x+Math.cos(i*2.4)*3.2,z=tree.z+Math.sin(i*2.4)*3.2;if(Math.hypot(x-resourceBase.x,z-resourceBase.z)<18||riverDistance(x,z)<12||Math.abs(x)>96||Math.abs(z)>96)continue;const model=createWildlifeModel(type),actor={id,type,group:model.group,legs:model.legs,x,z,heading:random()*Math.PI*2,alert:0,roam:0};model.group.position.set(x,groundHeight(x,z),z);scene.add(model.group);wildlifeActors.push(actor);made++;}}
  function updateWildlife(delta){wildlifeAnimationTime+=delta;for(const actor of wildlifeActors){const dx=actor.x-player.x,dz=actor.z-player.z,distance=Math.hypot(dx,dz);if(distance<13){actor.alert=Math.min(1,actor.alert+delta*2.8);actor.heading=Math.atan2(dx,dz);}else actor.alert=Math.max(0,actor.alert-delta*.45);actor.roam+=delta;if(actor.alert>.15){const speed=actor.type==="deer"?5.8:4.2;actor.x+=Math.sin(actor.heading)*delta*speed;actor.z+=Math.cos(actor.heading)*delta*speed;}else if(actor.roam>2.8){actor.roam=0;actor.heading+=(random()-.5)*1.8;}else{actor.x+=Math.sin(actor.heading)*delta*.35;actor.z+=Math.cos(actor.heading)*delta*.35;}actor.x=THREE.MathUtils.clamp(actor.x,-98,98);actor.z=THREE.MathUtils.clamp(actor.z,-98,98);actor.group.position.set(actor.x,groundHeight(actor.x,actor.z),actor.z);actor.group.rotation.y=actor.heading+Math.PI;actor.legs.forEach((leg,index)=>{leg.rotation.x=Math.sin(wildlifeAnimationTime*7+(index%2)*Math.PI)*.38*(actor.alert>.15?1:.35);});}}
  function updateAnimalAnimations(delta){
    animalAnimationTime+=delta;
    for(const actor of animalActors){
      const enclosure=animalEnclosures[actor.type],t=animalAnimationTime*0.72+actor.phase,radius=actor.type==="chickens"?0.36:0.48;
      const ox=actor.offset[0]+Math.sin(t)*radius,oz=actor.offset[1]+Math.cos(t*0.83)*radius,yaw=enclosure.yaw??builtCabin.yaw;
      const world={x:enclosure.x+ox*Math.cos(yaw)+oz*Math.sin(yaw),z:enclosure.z-ox*Math.sin(yaw)+oz*Math.cos(yaw)};
      actor.group.position.set(world.x,groundHeight(world.x,world.z)+Math.abs(Math.sin(t*2))*0.025,world.z);
      actor.group.rotation.y=Math.atan2(Math.cos(t),Math.sin(t*0.83))+yaw;
      actor.legs.forEach((leg,index)=>{leg.rotation.x=Math.sin(t*3+(index%2)*Math.PI)*0.28;});
    }
  }
  function refreshAnimalProduction(){
    const now=totalGameMinutes();let changed=false;
    for(const type of ["chickens","sheep"]){
      const care=animalCare[type],interval=animalSettings[type].interval,limit=Math.min(now,care.fedUntil);let safety=0;
      while(care.nextAt>0&&care.nextAt<=limit&&safety++<100){care.ready=Math.min(9999,care.ready+1);care.nextAt+=interval;changed=true;}
      if(care.fedUntil>0&&now>=care.fedUntil&&care.nextAt>care.fedUntil){care.fedUntil=0;care.nextAt=0;changed=true;}
    }
    if(changed){updateInventoryUI();saveProgress(true);}
    if(currentAnimalType&&!animalPanel.classList.contains("hidden"))renderAnimalPanel();
  }
  function createKitchenStation(){
    kitchenPosition=localCabinPosition(0,-6.6);
    const group=new THREE.Group();kitchenGroup=group;
    const stone=new THREE.MeshStandardMaterial({color:0x77766d,roughness:1}),darkStone=new THREE.MeshStandardMaterial({color:0x494a43,roughness:1}),iron=new THREE.MeshStandardMaterial({color:0x3e4140,metalness:0.35,roughness:0.72});
    const hearth=new THREE.Mesh(new THREE.BoxGeometry(1.65,0.34,1.35),darkStone);hearth.position.y=0.17;group.add(hearth);
    for(let i=0;i<8;i++){const angle=i*Math.PI/4,rock=new THREE.Mesh(new THREE.DodecahedronGeometry(0.28,0),stone);rock.position.set(Math.cos(angle)*0.58,0.34,Math.sin(angle)*0.46);rock.scale.set(1,0.78,0.9);group.add(rock);}
    const logA=new THREE.Mesh(new THREE.CylinderGeometry(0.09,0.09,0.92,7),new THREE.MeshStandardMaterial({color:0x79502f,roughness:1}));logA.rotation.z=Math.PI/2;logA.position.set(0,0.43,0);group.add(logA);
    const logB=logA.clone();logB.rotation.y=0.82;logB.position.y=0.49;group.add(logB);
    const pot=new THREE.Mesh(new THREE.CylinderGeometry(0.38,0.3,0.42,12),iron);pot.position.set(0,0.88,0);group.add(pot);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(0.37,0.045,6,14),iron);rim.rotation.x=Math.PI/2;rim.position.set(0,1.1,0);group.add(rim);
    const flame=new THREE.Mesh(new THREE.ConeGeometry(0.22,0.72,7),new THREE.MeshStandardMaterial({color:0xff8b27,emissive:0xff5a12,emissiveIntensity:1.8,roughness:0.5}));flame.position.set(0,0.72,0.08);group.add(flame);
    const flameCore=new THREE.Mesh(new THREE.ConeGeometry(0.11,0.44,6),new THREE.MeshBasicMaterial({color:0xffe08a}));flameCore.position.set(0,0.62,0.08);group.add(flameCore);
    const light=new THREE.PointLight(0xff9a42,1.35,8,2);light.position.set(0,1.1,0.2);group.add(light);
    const savedKitchen=savedStructurePositions.kitchen;if(Number.isFinite(savedKitchen?.x))kitchenPosition={x:savedKitchen.x,z:savedKitchen.z};
    group.position.set(kitchenPosition.x,groundHeight(kitchenPosition.x,kitchenPosition.z),kitchenPosition.z);group.rotation.y=Number.isFinite(savedKitchen?.yaw)?savedKitchen.yaw:builtCabin.yaw;scene.add(group);
    kitchenFire={flame,flameCore,light,time:0};
  }
  const cookingRecipes={
    bread:{label:"Pão caseiro",icon:"🍞",ingredients:{wheat:2},hunger:45,description:"Pão simples assado na fogueira."},
    omelet:{label:"Omelete",icon:"🍳",ingredients:{eggs:2},hunger:52,description:"Ovos preparados na panela."},
    vegetableSoup:{label:"Sopa de legumes",icon:"🥣",ingredients:{carrots:1,cabbages:1},hunger:62,description:"Uma refeição quente e nutritiva."},
    berryPorridge:{label:"Mingau de frutas",icon:"🫐",ingredients:{berries:2,wheat:1},hunger:55,description:"Mingau doce para recuperar as forças."},
    roastedMeat:{label:"Carne assada",icon:"🍖",ingredients:{rawMeat:1},hunger:70,description:"Carne de caça assada na fogueira."},
    grilledTrout:{label:"Truta grelhada",icon:"🐟",ingredients:{trout:1},hunger:68,description:"Truta fresca assada na brasa."},
    grilledCarp:{label:"Carpa grelhada",icon:"🐠",ingredients:{carp:1},hunger:60,description:"Carpa do rio preparada na panela."},
    grilledMinnow:{label:"Peixe pequeno grelhado",icon:"🐟",ingredients:{minnow:1},hunger:45,description:"Pequeno peixe assado na fogueira."}
  };
  function renderKitchenPanel(){
    kitchenStatus.textContent="Lenha disponível: "+inventory.wood+" · Cada preparo consome 1 madeira como combustível.";
    kitchenRecipes.innerHTML=Object.entries(cookingRecipes).map(([key,recipe])=>{
      const enough=inventory.wood>=1&&Object.entries(recipe.ingredients).every(([item,amount])=>inventory[item]>=amount);
      const costs=Object.entries(recipe.ingredients).map(([item,amount])=>amount+" "+({wheat:"trigo",eggs:"ovos",carrots:"cenouras",cabbages:"repolhos",berries:"frutas",trout:"trutas",carp:"carpas",minnow:"peixes pequenos"}[item])).join(" + ");
      return '<article class="kitchen-recipe"><div class="kitchen-recipe-icon">'+recipe.icon+'</div><div class="kitchen-recipe-copy"><strong>'+recipe.label+'</strong><small>'+recipe.description+'</small><small>Ingredientes: '+costs+' · Lenha: 1 · Fome +'+recipe.hunger+'</small></div><button type="button" data-cook="'+key+'" '+(enough?"":"disabled")+'>PREPARAR</button></article>';
    }).join("");
  }
  function openKitchenPanel(){if(!canUseKitchen)return;kitchenTitle.textContent="COZINHA DO VALE";renderKitchenPanel();kitchenPanel.classList.remove("hidden");}
  function closeKitchenPanel(){kitchenPanel.classList.add("hidden");}
  function cookMeal(type){
    const recipe=cookingRecipes[type];
    if(!recipe||!canUseKitchen||inventory.wood<1||!Object.entries(recipe.ingredients).every(([item,amount])=>inventory[item]>=amount))return;
    for(const [item,amount] of Object.entries(recipe.ingredients))inventory[item]-=amount;
    inventory.wood--;inventory[type]=Math.min(9999,inventory[type]+1);
    updateInventoryUI();renderKitchenPanel();saveProgress(true);
    showToast(recipe.label+" preparado e guardado na mochila!");
  }
  function eatPreparedMeal(type){
    const recipe=cookingRecipes[type];
    if(!recipe||inventory[type]<1||survival.hunger>=99.5)return;
    inventory[type]--;survival.hunger=Math.min(100,survival.hunger+recipe.hunger);
    updateInventoryUI();updateSurvivalUI(true);saveProgress(true);
    showToast(recipe.label+" consumido · fome +"+recipe.hunger);
  }
  kitchenRecipes.addEventListener("click",event=>{const button=event.target.closest("button[data-cook]");if(button)cookMeal(button.dataset.cook);});
  kitchenClose.addEventListener("click",closeKitchenPanel);
  function createLoomStation(){
    // Tear no lado oposto à cozinha e aos cercados, com espaço livre para aproximação.
    loomPosition=localCabinPosition(7.2,-6.6);const group=new THREE.Group();loomGroup=group;const wood=new THREE.MeshStandardMaterial({color:0x765033,roughness:1}),dark=new THREE.MeshStandardMaterial({color:0x4d3524,roughness:1}),thread=new THREE.MeshStandardMaterial({color:0xc8b58f,roughness:1});
    const legGeo=new THREE.BoxGeometry(0.13,1.45,0.13);for(const x of [-0.78,0.78])for(const z of [-0.42,0.42]){const leg=new THREE.Mesh(legGeo,wood);leg.position.set(x,0.72,z);group.add(leg);}
    const beam=new THREE.Mesh(new THREE.BoxGeometry(1.8,0.16,0.16),dark);beam.position.set(0,1.48,-0.42);group.add(beam);const frontBeam=beam.clone();frontBeam.position.z=0.42;group.add(frontBeam);
    const top=new THREE.Mesh(new THREE.BoxGeometry(1.9,0.13,1.05),wood);top.position.y=0.82;group.add(top);const rollerGeo=new THREE.CylinderGeometry(0.09,0.09,1.75,8);
    for(const z of [-0.36,0.36]){const roller=new THREE.Mesh(rollerGeo,dark);roller.rotation.z=Math.PI/2;roller.position.set(0,1.18,z);group.add(roller);}
    for(let i=0;i<13;i++){const strand=new THREE.Mesh(new THREE.CylinderGeometry(0.012,0.012,0.83,5),thread);strand.position.set(-0.55+i*0.092,1.22,0);group.add(strand);}
    const cloth=new THREE.Mesh(new THREE.PlaneGeometry(1.02,0.62),new THREE.MeshStandardMaterial({color:0xb9a27d,side:THREE.DoubleSide,roughness:1}));cloth.position.set(0,1.18,0.03);group.add(cloth);
    const savedLoom=savedStructurePositions.loom;if(Number.isFinite(savedLoom?.x))loomPosition={x:savedLoom.x,z:savedLoom.z};
    group.position.set(loomPosition.x,groundHeight(loomPosition.x,loomPosition.z),loomPosition.z);group.rotation.y=Number.isFinite(savedLoom?.yaw)?savedLoom.yaw:builtCabin.yaw;scene.add(group);
  }
  const clothingRecipes={tunic:{label:"Túnica de lã",icon:"🧥",ingredients:{fabric:2,wool:1},warmth:28},trousers:{label:"Calças forradas",icon:"👖",ingredients:{fabric:1,wool:1},warmth:18},boots:{label:"Botas de lã",icon:"🥾",ingredients:{fabric:1,wool:1},warmth:14}};
  function renderLoomPanel(){
    const warmth=(clothing.tunic?28:0)+(clothing.trousers?18:0)+(clothing.boots?14:0);loomStatus.textContent="Lã: "+inventory.wool+" · Tecido: "+inventory.fabric+" · Proteção equipada: "+warmth+"%";
    const fabricButton='<div class="loom-action"><div><strong>🧶 Tecido de lã</strong><small>Transforma 2 lãs em 1 tecido · Você tem '+inventory.wool+' lã(s)</small></div><button type="button" data-loom-fabric="1" '+(inventory.wool>=2?"":"disabled")+'>TECER</button></div>';
    const clothes=Object.entries(clothingRecipes).map(([type,recipe])=>{const enough=inventory[type]<1&&Object.entries(recipe.ingredients).every(([item,amount])=>inventory[item]>=amount),costs=Object.entries(recipe.ingredients).map(([item,amount])=>amount+" "+(item==="fabric"?"tecido":"lã")).join(" + "),equipped=clothing[type];return '<div class="loom-action"><div><strong>'+recipe.icon+' '+recipe.label+'</strong><small>Materiais: '+costs+' · Proteção: +'+recipe.warmth+'%</small><small>Estado: '+(equipped?"Equipado":inventory[type]>0?"Guardado":"Não fabricado")+'</small></div><button type="button" data-loom-craft="'+type+'" '+(enough?"":"disabled")+'>'+(inventory[type]>0?"FABRICADO":"FABRICAR")+'</button><button type="button" data-loom-equip="'+type+'" '+(inventory[type]<1?"disabled":"")+'>'+(equipped?"RETIRAR":"EQUIPAR")+'</button></div>';}).join("");
    loomActions.innerHTML=fabricButton+clothes;
  }
  function openLoomPanel(){if(!canUseLoom)return;loomTitle.textContent="TEAR E ROUPAS";renderLoomPanel();loomPanel.classList.remove("hidden");}
  function renderTanneryPanel(){
    const load=inventoryLoad();tanneryStatus.textContent="Couro cru: "+inventory.hide+" · Couro curtido: "+inventory.tannedLeather+" · Carga: "+load+"/"+carryCapacity();
    let label="CURTIR 2 COUROS",note="Transforma 2 couros crus em 1 couro curtido · leva 4 horas do jogo",disabled=inventory.hide<2||tanneryState.readyAt>0||tanneryState.ready;
    if(tanneryState.readyAt>0){const remaining=Math.max(0,tanneryState.readyAt-totalGameMinutes());label="CURTIMENTO EM ANDAMENTO";note="Faltam "+Math.ceil(remaining/60)+" hora(s) de jogo";disabled=true;}
    if(tanneryState.ready){label="COLETAR COURO CURTIDO";note="O couro está pronto para ser recolhido";disabled=false;}
    const process='<div class="tannery-action"><div><strong>🦬 Curtimento de couro</strong><small>'+note+'</small></div><button type="button" data-tannery-process="1" '+(disabled?"disabled":"")+'>'+label+'</button></div>';
    const owned=inventory.leatherBackpack>0;
    const backpack='<div class="tannery-action"><div><strong>🎒 Mochila de couro</strong><small>Receita: 3 couros curtidos + 2 tecidos · capacidade +60 espaços</small><small>'+(tools.leatherBackpack?"Equipada · +60 espaços":owned?"Guardada":"Ainda não fabricada")+'</small></div><button type="button" data-backpack-craft="1" '+(owned||inventory.tannedLeather<3||inventory.fabric<2?"disabled":"")+' >FABRICAR</button><button type="button" data-backpack-equip="1" '+(!owned?"disabled":"")+'>'+(tools.leatherBackpack?"RETIRAR":"EQUIPAR")+'</button></div>';
    tanneryActions.innerHTML=process+backpack;
  }
  function renderFishingPanel(){if(fishingActive){const left=Math.max(0,(fishingFinishAt-performance.now())/1000);fishingStatus.textContent="A linha está na água... "+left.toFixed(1)+"s";fishingAction.disabled=true;fishingAction.textContent="AGUARDE";}else{fishingStatus.textContent="Pesque na margem do rio. Cada tentativa leva alguns segundos e pode render truta, carpa ou peixe pequeno.";fishingAction.disabled=!tools.fishingRod;fishingAction.textContent="LANÇAR A LINHA";}}
  function openFishingPanel(){if(!canUseFishingSpot)return;renderFishingPanel();fishingPanel.classList.remove("hidden");}
  function closeFishingPanel(){fishingActive=false;fishingFinishAt=0;fishingAnimation=0;fishingRodModel.visible=false;fishingPanel.classList.add("hidden");}
  function startFishing(){if(!canUseFishingSpot||!tools.fishingRod||fishingActive)return;fishingActive=true;fishingFinishAt=performance.now()+(3200+Math.random()*2600);fishingAnimation=0;fishingRodModel.visible=true;renderFishingPanel();showToast("Você lançou a linha. Aguarde a fisgada!");}
  function updateFishingProgress(delta){if(!fishingActive)return;fishingAnimation+=delta;fishingRodModel.rotation.x=-0.12+Math.sin(fishingAnimation*5)*0.035;if(performance.now()<fishingFinishAt){if(!fishingPanel.classList.contains("hidden"))renderFishingPanel();return;}fishingActive=false;fishingRodModel.visible=false;const roll=Math.random(),fish=roll<0.32?"trout":roll<0.72?"carp":"minnow",labels={trout:"truta",carp:"carpa",minnow:"peixe pequeno"};if(canCarry(1)){inventory[fish]=Math.min(9999,inventory[fish]+1);fishingLastCatch=totalGameMinutes();updateInventoryUI();saveProgress(true);showToast("Boa pescaria! Você conseguiu 1 "+labels[fish]+".");}else showToast("A mochila está cheia. O peixe escapou!");if(!fishingPanel.classList.contains("hidden"))renderFishingPanel();updateResourceTarget();}
  fishingAction.addEventListener("click",startFishing);fishingClose.addEventListener("click",closeFishingPanel);
  function openTanneryPanel(){if(!canUseTannery)return;tanneryTitle.textContent="CURTUME E COURO";renderTanneryPanel();tanneryPanel.classList.remove("hidden");}
  function closeTanneryPanel(){tanneryPanel.classList.add("hidden");}
  function handleTanneryAction(event){
    const process=event.target.closest("button[data-tannery-process]"),craft=event.target.closest("button[data-backpack-craft]"),equip=event.target.closest("button[data-backpack-equip]");
    if(process){if(tanneryState.ready){if(!canCarry(1))return;inventory.tannedLeather=Math.min(9999,inventory.tannedLeather+1);tanneryState.ready=false;showToast("Couro curtido recolhido.");}else if(!tanneryState.readyAt&&inventory.hide>=2){inventory.hide-=2;tanneryState.readyAt=totalGameMinutes()+240;showToast("Curtimento iniciado · volte em 4 horas do jogo.");}else return;}
    if(craft){if(inventory.leatherBackpack>0||inventory.tannedLeather<3||inventory.fabric<2)return;inventory.tannedLeather-=3;inventory.fabric-=2;inventory.leatherBackpack=1;showToast("Mochila de couro fabricada! Equipe no curtume.");}
    if(equip){if(inventory.leatherBackpack<1)return;tools.leatherBackpack=!tools.leatherBackpack;showToast(tools.leatherBackpack?"Mochila de couro equipada · capacidade aumentada para 180.":"Mochila de couro retirada · capacidade base de 120.");}
    updateInventoryUI();renderTanneryPanel();saveProgress(true);
  }
  tanneryActions.addEventListener("click",handleTanneryAction);tanneryClose.addEventListener("click",closeTanneryPanel);
  function closeLoomPanel(){loomPanel.classList.add("hidden");}
  function craftClothing(type){if(type==="fabric"){if(inventory.wool<2)return;inventory.wool-=2;inventory.fabric=Math.min(9999,inventory.fabric+1);showToast("Um tecido de lã foi produzido.");}else{const recipe=clothingRecipes[type];if(!recipe||inventory[type]>0||!Object.entries(recipe.ingredients).every(([item,amount])=>inventory[item]>=amount))return;for(const [item,amount] of Object.entries(recipe.ingredients))inventory[item]-=amount;inventory[type]=1;showToast(recipe.label+" fabricada!");}updateInventoryUI();renderLoomPanel();saveProgress(true);}
  function toggleClothing(type){if(!clothingRecipes[type]||inventory[type]<1)return;clothing[type]=!clothing[type];updateInventoryUI();renderLoomPanel();saveProgress(true);showToast(clothing[type]?"Roupa equipada. Proteção contra o frio aumentada.":"Roupa retirada.");}
  loomActions.addEventListener("click",event=>{const fabric=event.target.closest("button[data-loom-fabric]"),craft=event.target.closest("button[data-loom-craft]"),equip=event.target.closest("button[data-loom-equip]");if(fabric)craftClothing("fabric");if(craft)craftClothing(craft.dataset.loomCraft);if(equip)toggleClothing(equip.dataset.loomEquip);});
  loomClose.addEventListener("click",closeLoomPanel);
  function createTanneryStation(){
    tanneryPosition=localCabinPosition(7.5,3.6);const group=new THREE.Group();tanneryGroup=group;
    const wood=new THREE.MeshStandardMaterial({color:0x79502f,roughness:1}),dark=new THREE.MeshStandardMaterial({color:0x493323,roughness:1}),hideMat=new THREE.MeshStandardMaterial({color:0x9a754d,roughness:1,side:THREE.DoubleSide});
    const vat=new THREE.Mesh(new THREE.CylinderGeometry(0.72,0.62,0.72,12),dark);vat.position.set(-0.85,0.38,0);group.add(vat);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(0.68,0.07,7,14),wood);rim.rotation.x=Math.PI/2;rim.position.set(-0.85,0.76,0);group.add(rim);
    for(const x of [-0.2,1.45])for(const z of [-0.42,0.42]){const leg=new THREE.Mesh(new THREE.BoxGeometry(0.12,1.35,0.12),wood);leg.position.set(x,0.67,z);group.add(leg);}
    const beam=new THREE.Mesh(new THREE.BoxGeometry(1.9,0.13,0.14),dark);beam.position.set(0.62,1.35,0);group.add(beam);
    const hide=new THREE.Mesh(new THREE.PlaneGeometry(1.45,0.92),hideMat);hide.position.set(0.62,1.27,0.03);hide.rotation.x=-0.12;group.add(hide);
    for(let i=0;i<4;i++){const strip=new THREE.Mesh(new THREE.BoxGeometry(0.08,0.05,0.92),wood);strip.position.set(-0.08+i*0.46,1.18,0.04);group.add(strip);}
    const savedTannery=savedStructurePositions.tannery;if(Number.isFinite(savedTannery?.x))tanneryPosition={x:savedTannery.x,z:savedTannery.z};
    group.position.set(tanneryPosition.x,groundHeight(tanneryPosition.x,tanneryPosition.z),tanneryPosition.z);group.rotation.y=Number.isFinite(savedTannery?.yaw)?savedTannery.yaw:builtCabin.yaw;scene.add(group);
  }
  function placeCabin() {
    cabinModel=createCabinModel();
    cabinModel.position.set(builtCabin.x,groundHeight(builtCabin.x,builtCabin.z),builtCabin.z);
    cabinModel.rotation.y=builtCabin.yaw;
    cabinDoorPivot=cabinModel.userData.doorPivot; cabinDoorPivot.rotation.y=cabinDoorAngle; scene.add(cabinModel);
    const chest=createCabinChest();
    chest.position.set(builtCabin.x+1.18*Math.cos(builtCabin.yaw)+1.15*Math.sin(builtCabin.yaw),groundHeight(builtCabin.x,builtCabin.z),builtCabin.z-1.18*Math.sin(builtCabin.yaw)+1.15*Math.cos(builtCabin.yaw));
    chest.rotation.y=builtCabin.yaw; scene.add(chest);
    cabinBed=createCabinBed();
    cabinBed.position.set(builtCabin.x-1.15*Math.cos(builtCabin.yaw)+0.48*Math.sin(builtCabin.yaw),groundHeight(builtCabin.x,builtCabin.z),builtCabin.z+1.15*Math.sin(builtCabin.yaw)+0.48*Math.cos(builtCabin.yaw));
    cabinBed.rotation.y=builtCabin.yaw;scene.add(cabinBed);
    // Mantém a banca do mercador no lado oposto ao curtume, com espaço para circular.
    const savedMerchant=savedStructurePositions.merchant;
    merchantPosition=Number.isFinite(savedMerchant?.x)?{x:savedMerchant.x,z:savedMerchant.z}:localCabinPosition(-10,-7);
    merchantStall.position.set(merchantPosition.x,groundHeight(merchantPosition.x,merchantPosition.z),merchantPosition.z);
    merchantStall.rotation.y=Number.isFinite(savedMerchant?.yaw)?savedMerchant.yaw:builtCabin.yaw;
    createKitchenStation();createLoomStation();createTanneryStation();
    createFarmPlots();
    createAnimalEnclosures();
    applySavedStructurePositions();
  }

  function getBuildableStructures(){
    if(!builtCabin)return [];
    const items=[
      {id:"workbench",label:"Bancada de fabricação",group:workbench,radius:1.8,apply:(x,z)=>{workbenchPosition.x=x;workbenchPosition.z=z;}},
      {id:"merchant",label:"Banca do mercador",group:merchantStall,radius:2.2,apply:(x,z)=>{merchantPosition={x,z};}},
      {id:"kitchen",label:"Cozinha",group:kitchenGroup,radius:1.7,apply:(x,z)=>{kitchenPosition={x,z};}},
      {id:"loom",label:"Tear de lã",group:loomGroup,radius:1.7,apply:(x,z)=>{loomPosition={x,z};}},
      {id:"tannery",label:"Curtume",group:tanneryGroup,radius:2,apply:(x,z)=>{tanneryPosition={x,z};}},
      {id:"chickens-pen",label:"Cercado das galinhas",group:animalEnclosures.chickens.group,radius:2.8,apply:(x,z,yaw)=>Object.assign(animalEnclosures.chickens,{x,z,yaw})},
      {id:"sheep-pen",label:"Cercado das ovelhas",group:animalEnclosures.sheep.group,radius:3.4,apply:(x,z,yaw)=>Object.assign(animalEnclosures.sheep,{x,z,yaw})}
    ];
    for(const plot of farmPlots)items.push({id:plot.id,label:"Horta "+plot.id.slice(-1),group:plot.group,radius:1.35,apply:(x,z)=>{plot.x=x;plot.z=z;}});
    return items.filter(item=>item.group);
  }
  function applySavedStructurePositions(){
    for(const item of getBuildableStructures()){
      const pos=savedStructurePositions[item.id];if(!Number.isFinite(pos?.x)||!Number.isFinite(pos?.z))continue;
      const yaw=Number.isFinite(pos.yaw)?pos.yaw:item.group.rotation.y;
      item.apply(pos.x,pos.z,yaw);item.group.position.set(pos.x,groundHeight(pos.x,pos.z),pos.z);item.group.rotation.y=yaw;
    }
    updateAnimalAnimations(0);
  }
  function structurePositionsForSave(){
    return Object.fromEntries(getBuildableStructures().map(item=>[item.id,{x:item.group.position.x,z:item.group.position.z,yaw:item.group.rotation.y}]));
  }
  function renderBuildingOptions(){
    if(!buildingOptions)return;
    buildingOptions.innerHTML="";
    if(!builtCabin){
      const button=document.createElement("button");button.type="button";button.className="building-option";button.dataset.buildId="cabin";
      button.innerHTML="<strong>Cabana inicial</strong><small>12 madeiras · 8 galhos · sua moradia</small>";buildingOptions.appendChild(button);
      buildingStatus.textContent="Construa primeiro sua cabana.";
    }else{
      const houseButton=document.createElement("button");houseButton.type="button";houseButton.className="building-option";houseButton.dataset.buildId="village-house";
      houseButton.innerHTML="<strong>Casa para moradores</strong><small>20 madeiras · 12 galhos · capacidade para 2 pessoas</small>";buildingOptions.appendChild(houseButton);
      const heading=document.createElement("small");heading.className="building-options-heading";heading.textContent="OU REPOSICIONE UMA ESTRUTURA";buildingOptions.appendChild(heading);
      for(const item of getBuildableStructures()){const button=document.createElement("button");button.type="button";button.className="building-option";button.dataset.buildId=item.id;button.textContent=item.label;buildingOptions.appendChild(button);}
      buildingStatus.textContent="Cada casa construída libera duas vagas para convites.";
    }
    buildingOptions.querySelectorAll("[data-build-id]").forEach(button=>button.addEventListener("click",()=>selectBuildOption(button.dataset.buildId)));
  }
  function selectBuildOption(id){
    if(id==="cabin"){if(builtCabin)return;buildSelectedId="cabin";buildSelectedItem=null;}
    else if(id==="village-house"){if(!builtCabin)return;buildSelectedId=id;buildSelectedItem={id,label:"Casa para moradores",radius:3.3};}
    else{const item=getBuildableStructures().find(entry=>entry.id===id);if(!item)return;buildSelectedId=id;buildSelectedItem=item;}
    if(buildPreview)scene.remove(buildPreview);
    buildPreview=cabinGhost(id==="cabin"||id==="village-house"?createCabinModel():buildSelectedItem.group.clone(true));scene.add(buildPreview);
    buildingOptions.querySelectorAll("[data-build-id]").forEach(button=>button.classList.toggle("selected",button.dataset.buildId===id));
    buildingMaterials.textContent=id==="cabin"?"Madeira: "+inventory.wood+"/12 · Galhos: "+inventory.branches+"/8":id==="village-house"?"Madeira: "+inventory.wood+"/20 · Galhos: "+inventory.branches+"/12":"Reposicionamento gratuito · nenhum material será consumido";
    buildRotation=0;updateBuildPreview();
  }
  function structurePlacementValid(x,z,item){
    if(Math.abs(x)>96||Math.abs(z)>96)return "Fora da área de construção.";
    if(riverDistance(x,z)<9)return "Muito perto do rio.";
    const heights=[[-1,-1],[1,-1],[-1,1],[1,1]].map(([ox,oz])=>groundHeight(x+ox*item.radius*0.55,z+oz*item.radius*0.55));
    if(Math.max(...heights)-Math.min(...heights)>0.85)return "O terreno está muito inclinado.";
    for(let i=0;i<treeSpots.length;i++){if(felledTrees.has(i))continue;const tree=treeSpots[i];if((tree.x-x)**2+(tree.z-z)**2<(item.radius+0.8)**2)return "Há uma árvore neste local.";}
    for(const other of getBuildableStructures()){
      if(other.id===item.id)continue;const dx=other.group.position.x-x,dz=other.group.position.z-z;
      if(dx*dx+dz*dz<((item.radius+other.radius)*0.78)**2)return "Muito perto de outra estrutura.";
    }
    if(builtCabin){const dx=x-builtCabin.x,dz=z-builtCabin.z;if(dx*dx+dz*dz<(item.radius+2.4)**2)return "Muito perto da cabana.";}
    return "";
  }
  function cabinGhost(model) {
    const ghost=model.clone(true);
    ghost.traverse((node)=>{
      if (!node.isMesh) return;
      node.material=node.material.clone();
      node.material.transparent=true; node.material.opacity=0.48; node.material.depthWrite=false;
      node.material.color.set(0x8bd49a);
    });
    return ghost;
  }
  function cabinFootprintValid(x,z,yaw) {
    if (Math.abs(x)>96 || Math.abs(z)>96) return "Fora da área de construção.";
    const samples=[[-2.15,-2.55],[0,-2.55],[2.15,-2.55],[-2.15,0],[0,0],[2.15,0],[-2.15,2.55],[0,2.55],[2.15,2.55]];
    const heights=[];
    for (const [lx,lz] of samples) {
      const wx=x+lx*Math.cos(yaw)+lz*Math.sin(yaw);
      const wz=z-lx*Math.sin(yaw)+lz*Math.cos(yaw);
      if (Math.abs(wx)>98 || Math.abs(wz)>98 || riverDistance(wx,wz)<9.2) return "Escolha um terreno longe do rio.";
      heights.push(groundHeight(wx,wz));
    }
    if (Math.max(...heights)-Math.min(...heights)>0.72) return "O terreno está muito inclinado.";
    for (let i=0;i<treeSpots.length;i++) {
      if (felledTrees.has(i)) continue;
      const tree=treeSpots[i],dx=tree.x-x,dz=tree.z-z;
      const lx=dx*Math.cos(yaw)-dz*Math.sin(yaw),lz=dx*Math.sin(yaw)+dz*Math.cos(yaw);
      if (Math.abs(lx)<3.25 && Math.abs(lz)<3.65) return "Há uma árvore dentro da área da cabana.";
    }
    const checkNear=(px,pz,rx,rz)=>{
      const dx=px-x,dz=pz-z,lx=dx*Math.cos(yaw)-dz*Math.sin(yaw),lz=dx*Math.sin(yaw)+dz*Math.cos(yaw);
      return Math.abs(lx)<rx && Math.abs(lz)<rz;
    };
    if (checkNear(workbenchPosition.x,workbenchPosition.z,3.3,3.7)) return "A área está muito perto da bancada.";
    for (const node of collectibleNodes) if (!collectedResources.has(node.id) && checkNear(node.x,node.z,2.8,3.2)) return "Há recursos dentro da área da cabana.";
    return "";
  }
  function setBuildPreviewAppearance(valid) {
    if (!buildPreview) return;
    buildPreview.traverse((node)=>{if(node.isMesh)node.material.color.set(valid?0x8bd49a:0xe17a69);});
  }
  function villageHousePlacementValid(x,z,yaw){
    const base=cabinFootprintValid(x,z,yaw);if(base)return base;
    if(builtCabin&&Math.hypot(x-builtCabin.x,z-builtCabin.z)<8.2)return "Muito perto da sua cabana.";
    for(const house of villageHouses)if(Math.hypot(x-house.x,z-house.z)<8.2)return "Muito perto de outra casa.";
    for(const item of getBuildableStructures())if(Math.hypot(x-item.group.position.x,z-item.group.position.z)<item.radius+3.2)return "Muito perto de outra estrutura.";
    return "";
  }
  function updateBuildPreview(){
    if(!buildMode||!buildPreview||!buildSelectedId){buildingConfirm.disabled=true;return;}
    const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw),x=Math.round((player.x+fx*8.2)*2)/2,z=Math.round((player.z+fz*8.2)*2)/2,yaw=player.yaw+Math.PI+buildRotation;
    buildPreview.position.set(x,groundHeight(x,z),z);buildPreview.rotation.y=yaw;
    buildPreviewReason=buildSelectedId==="cabin"?cabinFootprintValid(x,z,yaw):buildSelectedId==="village-house"?villageHousePlacementValid(x,z,yaw):structurePlacementValid(x,z,buildSelectedItem);
    buildPreviewValid=!buildPreviewReason;setBuildPreviewAppearance(buildPreviewValid);
    buildingStatus.textContent=buildPreviewValid?"Local adequado · confirme a posição":buildPreviewReason;buildingStatus.classList.toggle("invalid",!buildPreviewValid);
    const cost=buildSelectedId==="cabin"?[12,8]:buildSelectedId==="village-house"?[20,12]:[0,0];
    buildingConfirm.disabled=!buildPreviewValid||(cost[0]>0&&(inventory.wood<cost[0]||inventory.branches<cost[1]))||(buildSelectedId==="cabin"&&Boolean(builtCabin));
  }
  function startBuilding(){
    buildMode=true;buildingPanel.classList.remove("hidden");renderBuildingOptions();
    if(!builtCabin)selectBuildOption("cabin");
    else{buildSelectedId=null;buildSelectedItem=null;buildingConfirm.disabled=true;buildingMaterials.textContent="Escolha uma estrutura para reposicionar";}
    updateInventoryUI();
  }
  function stopBuilding() {
    buildMode=false; buildingPanel.classList.add("hidden");
    if (buildPreview) { scene.remove(buildPreview); buildPreview=null; }
    buildPreviewValid=false;buildSelectedId=null;buildSelectedItem=null;
  }
  function rotateBuilding() {
    if (!buildMode) return;
    buildRotation=(buildRotation+Math.PI/4)%(Math.PI*2); updateBuildPreview();
  }
  function confirmBuilding(){
    if(!buildMode||!buildSelectedId)return;updateBuildPreview();if(!buildPreviewValid){showToast(buildPreviewReason);return;}
    const position=buildPreview.position,yaw=buildPreview.rotation.y;
    if(buildSelectedId==="cabin"){
      if(builtCabin)return;if(inventory.wood<12||inventory.branches<8){showToast("Faltam materiais: 12 madeiras e 8 galhos.");updateInventoryUI();return;}
      inventory.wood-=12;inventory.branches-=8;builtCabin={x:position.x,z:position.z,yaw};placeCabin();
      stopBuilding();updateInventoryUI();saveProgress(true);showToast("Cabana construída! Seu primeiro abrigo está pronto.");return;
    }
    if(buildSelectedId==="village-house"){
      if(inventory.wood<20||inventory.branches<12){showToast("Faltam materiais: 20 madeiras e 12 galhos.");return;}
      inventory.wood-=20;inventory.branches-=12;
      const house={id:"house-"+(villageHouses.length+1),x:position.x,z:position.z,yaw,group:createCabinModel(),occupants:[]};
      house.group.position.set(house.x,groundHeight(house.x,house.z),house.z);house.group.rotation.y=yaw;scene.add(house.group);villageHouses.push(house);
      stopBuilding();updateInventoryUI();saveProgress(true);showToast("Casa construída! Você já pode convidar até 2 moradores.");return;
    }
    const item=getBuildableStructures().find(entry=>entry.id===buildSelectedId);if(!item)return;
    item.apply(position.x,position.z,yaw);item.group.position.set(position.x,groundHeight(position.x,position.z),position.z);item.group.rotation.y=yaw;
    updateAnimalAnimations(0);stopBuilding();saveProgress(true);showToast(item.label+" reposicionado!");
  }
  if (builtCabin) placeCabin();
  buildToggle.addEventListener("click",startBuilding);
  buildingClose.addEventListener("click",stopBuilding);
  buildingRotate.addEventListener("click",rotateBuilding);
  buildingConfirm.addEventListener("click",confirmBuilding);

  const felledTrees = new Set(saved?.felledTrees ?? []);
  const savedTreeHits = saved?.treeHits ?? {};
  const treeHitCounts = new Map(Object.entries(savedTreeHits).map(([key, value]) => [Number(key), value]));
  const treeSpots = [];
  for (let i = 0; i < 470; i++) {
    const x = (random() - 0.5) * 198;
    const z = (random() - 0.5) * 198;
    if (Math.abs(x) < 27 && z > -4 && z < 83) continue;
    if (x>25&&x<67&&z>-102&&z<-66) continue;
    if (riverDistance(x, z) < 11) continue;
    if (Math.abs(x) > 96 || Math.abs(z) > 96) continue;
    treeSpots.push({ x, z, scale: 0.72 + random() * 0.76, turn: random() * Math.PI * 2 });
  }
  function restoreVillagePopulation(){
    for(const house of villageHouses){
      house.group=createCabinModel();house.group.position.set(house.x,groundHeight(house.x,house.z),house.z);house.group.rotation.y=house.yaw;scene.add(house.group);
    }
    for(const residentData of recruitedVillagers){
      const child=familyChildren.find(item=>item.id===residentData.id&&childDevelopment(item).stage==="Adulto");
      const def=villagerDefinitions.find(item=>item.id===residentData.id)||(child?createFamilyVillagerDefinition(child,residentData.profession||child.adultProfession||"Agricultora"):null);
      const house=villageHouses.find(item=>item.id===residentData.houseId)||villageHouses.find(item=>item.id===child?.houseId);
      if(!def||!house)continue;
      if(!child&&house.occupants.length>=2)continue;
      if(!child)house.occupants.push(def.id);
      if(!villagers.some(item=>item.id===def.id))villagers.push(createVillager(def,house,child?0:house.occupants.length-1,residentData.profession||def.role,residentData));
    }
    const validIds=new Set(villagers.map(v=>v.id));
    for(let i=recruitedVillagers.length-1;i>=0;i--)if(!validIds.has(recruitedVillagers[i].id))recruitedVillagers.splice(i,1);
  }
  restoreVillagePopulation();
  integrateAdultFamilyChildren();
  for(const child of familyChildren)createFamilyActor(child);

  const trunkGeometry = new THREE.CylinderGeometry(0.28, 0.48, 4.2, 6);
  const crownGeometry = new THREE.ConeGeometry(3.05, 7.0, 7);
  const crownTopGeometry = new THREE.ConeGeometry(2.35, 6.0, 7);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x705039, roughness: 1 });
  const crownMaterial = new THREE.MeshStandardMaterial({ color: 0x315d3b, roughness: 1, flatShading: true });
  const trunkMesh = new THREE.InstancedMesh(trunkGeometry, trunkMaterial, treeSpots.length);
  const crownMesh = new THREE.InstancedMesh(crownGeometry, crownMaterial, treeSpots.length);
  const crownTopMesh = new THREE.InstancedMesh(crownTopGeometry, crownMaterial, treeSpots.length);
  const dummy = new THREE.Object3D();
  const treeRemainsMaterial = new THREE.MeshStandardMaterial({ color: 0x806044, roughness: 1 });
  const logMaterial = new THREE.MeshStandardMaterial({ color: 0x9a7046, roughness: 1 });
  function addTreeRemains(tree, groundY = groundHeight(tree.x, tree.z)) {
    const stump = new THREE.Mesh(new THREE.CylinderGeometry(0.42 * tree.scale, 0.5 * tree.scale, 0.62, 7), treeRemainsMaterial);
    stump.position.set(tree.x, groundY + 0.31, tree.z);
    stump.rotation.y = tree.turn;
    scene.add(stump);
    const log = new THREE.Mesh(new THREE.CylinderGeometry(0.28 * tree.scale, 0.32 * tree.scale, 2.0 * tree.scale, 7), logMaterial);
    log.rotation.z = Math.PI / 2;
    log.rotation.y = tree.turn;
    log.position.set(tree.x + 0.95 * tree.scale, groundY + 0.32 * tree.scale, tree.z + 0.55 * tree.scale);
    scene.add(log);
  }
  treeSpots.forEach((tree, index) => {
    const y = groundHeight(tree.x, tree.z);
    const s = tree.scale;
    const tint = new THREE.Color().setHSL(0.29 + random() * 0.035, 0.32, 0.22 + random() * 0.12);
    if (felledTrees.has(index)) {
      addTreeRemains(tree, y);
      dummy.position.set(0, -1000, 0);
      dummy.scale.set(0, 0, 0);
      dummy.updateMatrix();
      trunkMesh.setMatrixAt(index, dummy.matrix);
      crownMesh.setMatrixAt(index, dummy.matrix);
      crownTopMesh.setMatrixAt(index, dummy.matrix);
      return;
    }
    dummy.position.set(tree.x, y + 2.1 * s, tree.z);
    dummy.rotation.set(0, tree.turn, 0);
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    trunkMesh.setMatrixAt(index, dummy.matrix);
    dummy.position.set(tree.x, y + 6.2 * s, tree.z);
    dummy.scale.set(s, s, s);
    dummy.updateMatrix();
    crownMesh.setMatrixAt(index, dummy.matrix);
    dummy.position.set(tree.x, y + 10.0 * s, tree.z);
    dummy.scale.set(s * 0.78, s * 0.78, s * 0.78);
    dummy.updateMatrix();
    crownTopMesh.setMatrixAt(index, dummy.matrix);
    crownMesh.setColorAt(index, tint);
    crownTopMesh.setColorAt(index, tint.clone().multiplyScalar(1.12));
  });
  scene.add(trunkMesh, crownMesh, crownTopMesh);
  trunkMesh.instanceMatrix.needsUpdate = true;
  crownMesh.instanceMatrix.needsUpdate = true;
  crownTopMesh.instanceMatrix.needsUpdate = true;

  // Pedras espalhadas nas clareiras e perto das margens.
  const rockGeometry = new THREE.DodecahedronGeometry(1, 0);
  const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x777d70, roughness: 1, flatShading: true });
  for (let i = 0; i < 65; i++) {
    const x = (random() - 0.5) * 184;
    const z = (random() - 0.5) * 184;
    if (riverDistance(x, z) < 10 || (Math.abs(x) < 18 && z > 10 && z < 75)) continue;
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    const s = 0.35 + random() * 1.1;
    rock.position.set(x, groundHeight(x, z) + s * 0.35, z);
    rock.scale.set(s * 1.3, s * 0.72, s);
    rock.rotation.set(random(), random() * Math.PI, random() * 0.3);
    scene.add(rock);
  }

  // Morros rochosos no horizonte para dar profundidade ao vale.
  const mountainGeometry = new THREE.ConeGeometry(1, 1, 7);
  const mountainMaterial = new THREE.MeshStandardMaterial({ color: 0x687c70, roughness: 1, flatShading: true });
  const mountainPositions = [
    [-102, -83, 27, 56], [-82, -111, 36, 67], [-28, -112, 28, 48],
    [42, -110, 33, 62], [96, -88, 34, 58], [111, -15, 29, 49],
    [103, 83, 36, 62], [55, 112, 28, 49], [-35, 112, 33, 58],
    [-105, 78, 31, 52], [-116, 16, 27, 47]
  ];
  mountainPositions.forEach(([x, z, radius, height]) => {
    const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
    mountain.position.set(x, height * 0.43 - 2, z);
    mountain.scale.set(radius, height, radius * 0.85);
    mountain.rotation.y = random() * Math.PI;
    scene.add(mountain);
  });

  // Câmera em primeira pessoa e braços provisórios do personagem.
  const player = {
    x: saved?.x ?? 0,
    z: saved?.z ?? 35,
    yaw: saved?.yaw ?? 0,
    pitch: saved?.pitch ?? -0.04
  };
  const survival = {
    health: saved?.health ?? 100,
    hunger: saved?.hunger ?? 100,
    thirst: saved?.thirst ?? 100,
    energy: saved?.energy ?? 100, warmth: saved?.warmth ?? 100
  };
  let coins = Number.isSafeInteger(saved?.coins) ? Math.max(0,Math.min(999999,saved.coins)) : 30;
  let tradeReputation=Number.isSafeInteger(saved?.tradeReputation)?Math.max(0,Math.min(9999,saved.tradeReputation)):0;
  const settlementReputation={vale:Number.isSafeInteger(saved?.settlementReputation?.vale)?THREE.MathUtils.clamp(saved.settlementReputation.vale,0,9999):tradeReputation};
  const completedTradeContracts=new Set(Array.isArray(saved?.completedTradeContracts)?saved.completedTradeContracts.filter(id=>typeof id==="string"):[]);
  const inventory = {
    branches: saved?.inventory?.branches ?? 0,
    stones: saved?.inventory?.stones ?? 0,
    berries: saved?.inventory?.berries ?? 0,
    wood: saved?.inventory?.wood ?? 0,
    wheatSeeds: saved?.inventory?.wheatSeeds ?? 3,
    carrotSeeds: saved?.inventory?.carrotSeeds ?? 3,
    cabbageSeeds: saved?.inventory?.cabbageSeeds ?? 3,
    wheat: saved?.inventory?.wheat ?? 0,
    carrots: saved?.inventory?.carrots ?? 0,
    cabbages: saved?.inventory?.cabbages ?? 0,
    eggs: saved?.inventory?.eggs ?? 0,
    wool: saved?.inventory?.wool ?? 0,
    bread: saved?.inventory?.bread ?? 0,
    omelet: saved?.inventory?.omelet ?? 0,
    vegetableSoup: saved?.inventory?.vegetableSoup ?? 0,
    berryPorridge: saved?.inventory?.berryPorridge ?? 0,
    fabric: saved?.inventory?.fabric ?? 0,
    tunic: saved?.inventory?.tunic ?? 0,
    trousers: saved?.inventory?.trousers ?? 0,
    boots: saved?.inventory?.boots ?? 0, rawMeat:saved?.inventory?.rawMeat??0, hide:saved?.inventory?.hide??0, tannedLeather:saved?.inventory?.tannedLeather??0, leatherBackpack:saved?.inventory?.leatherBackpack??0, roastedMeat:saved?.inventory?.roastedMeat??0, arrows:saved?.inventory?.arrows??0, trout:saved?.inventory?.trout??0, carp:saved?.inventory?.carp??0, minnow:saved?.inventory?.minnow??0, grilledTrout:saved?.inventory?.grilledTrout??0, grilledCarp:saved?.inventory?.grilledCarp??0, grilledMinnow:saved?.inventory?.grilledMinnow??0,craftedGoods:saved?.inventory?.craftedGoods??0,tools:saved?.inventory?.tools??0
  };
  // Pacote único para quem já tinha uma fazenda salva: sementes para retomar o cultivo.
  let seedStarterPackClaimed = saved?.seedStarterPackClaimed === true;
  if (saved && !seedStarterPackClaimed) {
    inventory.wheatSeeds = Math.min(9999, inventory.wheatSeeds + 10);
    inventory.carrotSeeds = Math.min(9999, inventory.carrotSeeds + 10);
    inventory.cabbageSeeds = Math.min(9999, inventory.cabbageSeeds + 10);
    seedStarterPackClaimed = true;
  }
  const clothing = {tunic:saved?.clothing?.tunic===true,trousers:saved?.clothing?.trousers===true,boots:saved?.clothing?.boots===true};
  const tools = { axe: saved?.tools?.axe === true, bow:saved?.tools?.bow===true, fishingRod:saved?.tools?.fishingRod===true, leatherBackpack:saved?.tools?.leatherBackpack===true };
  const storage = { branches:saved?.storage?.branches??0, stones:saved?.storage?.stones??0, berries:saved?.storage?.berries??0, wood:saved?.storage?.wood??0 };
  let canUseCabinDoor=false, canUseStorageChest=false, canUseBed=false;
  let canUseFishingSpot=false,currentFishingSpot=null,fishingActive=false,fishingFinishAt=0,fishingAnimation=0;
  let currentResourceTarget = null;
  let canDrinkWater = false;
  let canUseWorkbench = false;
  let currentTreeTarget = null;
  let canChopTree = false;
  let axeSwingTimer = 0;
  const fallingTrees = [];
  let interactionScanTimer = 0;
  let toastTimeout = 0;
  let survivalUiTimer = 0;
  function updateSurvivalUI(force = false) {
    if (!force && survivalUiTimer < 0.2) return;
    survivalUiTimer = 0;
    for (const name of ["health", "hunger", "thirst", "energy"]) {
      const value = THREE.MathUtils.clamp(survival[name], 0, 100);
      survivalUI[name].value.textContent = Math.round(value) + "%";
      survivalUI[name].fill.style.width = value + "%";
      survivalUI[name].fill.parentElement.parentElement.classList.toggle("low", value < 25);
    }
    const warmth=THREE.MathUtils.clamp(survival.warmth,0,100);
    survivalUI.warmth.value.textContent=Math.round(warmth)+"%";survivalUI.warmth.fill.style.width=warmth+"%";survivalUI.warmth.fill.parentElement.parentElement.classList.toggle("low",warmth<25);
    let label = "ESTÁVEL";
    let mood = "";
    if (survival.health <= 0) { label = "DESMAIADO"; mood = "danger"; }
    else if (survival.health < 25 || survival.hunger < 12 || survival.thirst < 12) { label = "CRÍTICO"; mood = "danger"; }
    else if (survival.warmth < 12) { label = "FRIO INTENSO"; mood = "danger"; }
    else if (survival.hunger < 25 || survival.thirst < 25 || survival.energy < 20 || survival.warmth < 28) { label = "ATENÇÃO"; mood = "warning"; }
    survivalUI.status.textContent = label;
    survivalUI.status.className = mood;
  }
  updateSurvivalUI(true);
  function updateInventoryUI() {
    for (const key of Object.keys(inventoryUI)) inventoryUI[key].textContent=String(inventory[key]??0);
    if(walletUI)walletUI.textContent=String(coins);
    const loadLabel=document.getElementById("carry-load");if(loadLabel)loadLabel.textContent=inventoryLoad()+" / "+carryCapacity();
    const backpackStatus=document.getElementById("leather-backpack-status");if(backpackStatus)backpackStatus.textContent=tools.leatherBackpack?"Equipada · +40 espaços":"Guardada";
    for(const button of inventoryPanel.querySelectorAll("[data-eat-crop]")){
      const type=button.dataset.eatCrop,definition=cropTypes[type];
      button.disabled=!definition||inventory[definition.produce]<1||survival.hunger>=99.5;
    }
    for(const button of inventoryPanel.querySelectorAll("[data-eat-animal-food]")){
      button.disabled=inventory[button.dataset.eatAnimalFood]<1||survival.hunger>=99.5;
    }
    for(const button of inventoryPanel.querySelectorAll("[data-eat-meal]")){
      button.disabled=inventory[button.dataset.eatMeal]<1||survival.hunger>=99.5;
    }
    for(const status of inventoryPanel.querySelectorAll("[data-clothing-status]"))status.textContent=clothing[status.dataset.clothingStatus]?"Equipado":"Guardado";
    axeCountUI.textContent = tools.axe ? "1" : "0";
    const canEatBerry = inventory.berries > 0 && survival.hunger < 99.5;
    eatBerryButton.disabled = !canEatBerry;
    workbenchStatus.textContent = tools.axe ? "Machado fabricado" : "Machado ainda não fabricado";
    buildingMaterials.textContent = "Madeira: " + inventory.wood + "/12 · Galhos: " + inventory.branches + "/8";
    buildingConfirm.disabled = !buildMode || !buildPreviewValid || Boolean(builtCabin) || inventory.wood < 12 || inventory.branches < 8;
    craftAxeButton.disabled = tools.axe || inventory.branches < 3 || inventory.stones < 2;
    craftAxeButton.textContent = tools.axe ? "MACHADO FABRICADO" : "FABRICAR MACHADO";
    const bowButton=document.getElementById("craft-bow-button"),arrowButton=document.getElementById("craft-arrows-button");
    if(bowButton){bowButton.disabled=tools.bow||inventory.branches<4||inventory.fabric<2;bowButton.textContent=tools.bow?"ARCO FABRICADO":"FABRICAR ARCO";}
    if(arrowButton)arrowButton.disabled=inventory.branches<2||inventory.stones<1;
    const rodButton=document.getElementById("craft-fishing-rod-button");if(rodButton){rodButton.disabled=tools.fishingRod||inventory.branches<3||inventory.fabric<1;rodButton.textContent=tools.fishingRod?"VARA FABRICADA":"FABRICAR VARA DE PESCA";}
    document.getElementById("bow-count").textContent=tools.bow?"1":"0";
    const rodCount=document.getElementById("fishing-rod-count");if(rodCount)rodCount.textContent=tools.fishingRod?"1":"0";
    eatBerryButton.setAttribute(
      "aria-label",
      canEatBerry ? "Comer uma fruta para recuperar fome" :
        inventory.berries < 1 ? "Você não tem frutas na mochila" : "Sua fome já está saciada"
    );
  }
  function showToast(message) {
    gameToast.textContent = message;
    gameToast.classList.remove("hidden");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => gameToast.classList.add("hidden"), 2100);
  }
  function eatBerry() {
    if (inventory.berries < 1) {
      showToast("Você não tem frutas na mochila.");
      return;
    }
    if (survival.hunger >= 100) {
      showToast("Sua fome já está saciada.");
      updateInventoryUI();
      return;
    }
    inventory.berries -= 1;
    survival.hunger = Math.min(100, survival.hunger + 25);
    updateInventoryUI();
    updateSurvivalUI(true);
    saveProgress(true);
    showToast("Você comeu 1 fruta · fome +25");
  }
  eatBerryButton.addEventListener("click", eatBerry);
  function eatCrop(type){
    const definition=cropTypes[type];
    if(!definition||inventory[definition.produce]<1||survival.hunger>=100)return;
    inventory[definition.produce]--;survival.hunger=Math.min(100,survival.hunger+definition.hunger);
    updateInventoryUI();updateSurvivalUI(true);saveProgress(true);
    showToast("Você comeu "+definition.label.toLowerCase()+" · fome +"+definition.hunger);
  }
  function eatAnimalFood(type){
    if(type!=="eggs"||inventory.eggs<1||survival.hunger>=100)return;
    inventory.eggs--;survival.hunger=Math.min(100,survival.hunger+22);
    updateInventoryUI();updateSurvivalUI(true);saveProgress(true);
    showToast("Você comeu um ovo · fome +22");
  }
  inventoryPanel.addEventListener("click",event=>{
    const button=event.target.closest("button[data-eat-crop]");
    if(button)eatCrop(button.dataset.eatCrop);
    const animalFood=event.target.closest("button[data-eat-animal-food]");
    if(animalFood)eatAnimalFood(animalFood.dataset.eatAnimalFood);
  });
  function openCrafting() {
    craftingPanel.classList.remove("hidden");
    updateInventoryUI();
  }
  function craftFishingRod(){if(tools.fishingRod){showToast("Você já possui uma vara de pesca.");return;}if(inventory.branches<3||inventory.fabric<1){showToast("Para fabricar a vara: 3 galhos e 1 tecido.");return;}inventory.branches-=3;inventory.fabric--;tools.fishingRod=true;updateInventoryUI();saveProgress(true);showToast("Vara de pesca fabricada! Procure os juncos nas margens do rio.");}
  document.getElementById("craft-fishing-rod-button").addEventListener("click",craftFishingRod);
  function craftBow(){if(tools.bow){showToast("Você já possui um arco.");return;}if(inventory.branches<4||inventory.fabric<2){showToast("Para fabricar o arco: 4 galhos e 2 tecidos.");return;}inventory.branches-=4;inventory.fabric-=2;tools.bow=true;updateInventoryUI();saveProgress(true);showToast("Arco fabricado! Mire em um animal e pressione E.");}
  function craftArrows(){if(inventory.branches<2||inventory.stones<1){showToast("Para fabricar flechas: 2 galhos e 1 pedra.");return;}inventory.branches-=2;inventory.stones--;inventory.arrows=Math.min(9999,inventory.arrows+5);updateInventoryUI();saveProgress(true);showToast("Você fabricou 5 flechas.");}
  document.getElementById("craft-bow-button").addEventListener("click",craftBow);
  document.getElementById("craft-arrows-button").addEventListener("click",craftArrows);
  function closeCrafting() { craftingPanel.classList.add("hidden"); }
  function craftAxe() {
    if (tools.axe) {
      showToast("Você já possui um machado.");
      return;
    }
    if (inventory.branches < 3 || inventory.stones < 2) {
      showToast("Faltam materiais: 3 galhos e 2 pedras.");
      updateInventoryUI();
      return;
    }
    inventory.branches -= 3;
    inventory.stones -= 2;
    tools.axe = true;
    updateAxeVisual();
    updateInventoryUI();
    saveProgress(true);
    showToast("Machado fabricado! Materiais guardados na mochila foram usados.");
  }
  craftAxeButton.addEventListener("click", craftAxe);
  craftingClose.addEventListener("click", closeCrafting);
  function toggleInventory(force) {
    const open = typeof force === "boolean" ? force : inventoryPanel.classList.contains("hidden");
    inventoryPanel.classList.toggle("hidden", !open);
    inventoryToggle.setAttribute("aria-expanded", String(open));
  }
  inventoryToggle.addEventListener("click", () => toggleInventory());
  inventoryClose.addEventListener("click", () => toggleInventory(false));
  inventoryPanel.addEventListener("click",event=>{
    const button=event.target.closest("button[data-eat-meal]");
    if(button)eatPreparedMeal(button.dataset.eatMeal);
  });
  updateInventoryUI();
  const playerHeight = 1.72;
  const armGroup = new THREE.Group();
  const sleeveMaterial = new THREE.MeshStandardMaterial({ color: 0x756044, roughness: 1 });
  const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xc18b63, roughness: 1 });
  const leftSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.48, 0.23), sleeveMaterial);
  leftSleeve.position.set(-0.37, -0.39, -0.52);
  leftSleeve.rotation.z = -0.24;
  const rightSleeve = leftSleeve.clone();
  rightSleeve.position.x = 0.37;
  rightSleeve.rotation.z = 0.24;
  const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.17, 0.16), skinMaterial);
  leftHand.position.set(-0.37, -0.16, -0.55);
  const rightHand = leftHand.clone();
  rightHand.position.x = 0.37;
  armGroup.add(leftSleeve, rightSleeve, leftHand, rightHand);
  const axeModel = new THREE.Group();
  const fishingRodModel=new THREE.Group();
  const rodStick=new THREE.Mesh(new THREE.CylinderGeometry(0.025,0.045,2.15,7),new THREE.MeshStandardMaterial({color:0x80542e,roughness:1}));rodStick.rotation.z=-0.18;rodStick.position.set(0.46,0.42,-0.72);fishingRodModel.add(rodStick);
  const rodLine=new THREE.Mesh(new THREE.CylinderGeometry(0.006,0.006,1.15,4),new THREE.MeshBasicMaterial({color:0xd9d1b3}));rodLine.position.set(0.68,-0.2,-1.35);rodLine.rotation.z=-0.3;fishingRodModel.add(rodLine);fishingRodModel.visible=false;armGroup.add(fishingRodModel);
  const axeHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 0.78, 7), new THREE.MeshStandardMaterial({ color: 0x8a5b32, roughness: 1 }));
  axeHandle.rotation.z = -0.18;
  axeHandle.position.set(0.47, -0.14, -0.76);
  const axeHead = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.25, 0.12), new THREE.MeshStandardMaterial({ color: 0x9ba5a2, metalness: 0.28, roughness: 0.72 }));
  axeHead.position.set(0.62, 0.18, -0.76);
  axeHead.rotation.z = -0.18;
  axeModel.add(axeHandle, axeHead);
  axeModel.visible = tools.axe;
  armGroup.add(axeModel);
  function updateAxeVisual() { axeModel.visible = tools.axe; }
  camera.add(armGroup);
  scene.add(camera);

  function applyCamera() {
    camera.position.set(player.x, groundHeight(player.x, player.z) + playerHeight, player.z);
    camera.rotation.order = "YXZ";
    camera.rotation.y = player.yaw;
    camera.rotation.x = player.pitch;
  }
  applyCamera();
  createWildlife();

  function readSave() {
    try {
      const value = localStorage.getItem("legado-do-vale-prototipo");
      if (!value) return null;
      const saved = JSON.parse(value);
      if (!saved || !Number.isFinite(saved.x) || !Number.isFinite(saved.z)) return null;
      if (Math.abs(saved.x) > 104 || Math.abs(saved.z) > 104) return null;
      const safeStat = (value) => Number.isFinite(value) ? THREE.MathUtils.clamp(value, 0, 100) : 100;
      const safeCount = (value) => Number.isSafeInteger(value) ? THREE.MathUtils.clamp(value, 0, 9999) : 0;
      return {
        x: saved.x,
        z: saved.z,
        yaw: Number.isFinite(saved.yaw) ? saved.yaw : 0,
        pitch: Number.isFinite(saved.pitch) ? THREE.MathUtils.clamp(saved.pitch, -1.15, 1.15) : -0.04,
        coins: Number.isSafeInteger(saved.coins)?THREE.MathUtils.clamp(saved.coins,0,999999):30,
        tradeReputation:Number.isSafeInteger(saved.tradeReputation)?THREE.MathUtils.clamp(saved.tradeReputation,0,9999):0,
        settlementReputation:{vale:Number.isSafeInteger(saved.settlementReputation?.vale)?THREE.MathUtils.clamp(saved.settlementReputation.vale,0,9999):(Number.isSafeInteger(saved.tradeReputation)?THREE.MathUtils.clamp(saved.tradeReputation,0,9999):0)},
        completedTradeContracts:Array.isArray(saved.completedTradeContracts)?saved.completedTradeContracts.filter(id=>typeof id==="string"&&id.length<80).slice(-100):[],
        missionState:{chapter1RewardClaimed:saved.missionState?.chapter1RewardClaimed===true,chapter2MessengerMet:saved.missionState?.chapter2MessengerMet===true,chapter2Discoveries:Array.isArray(saved.missionState?.chapter2Discoveries)?[...new Set(saved.missionState.chapter2Discoveries.filter(id=>["lookout","river-crossing","old-oak","old-road","village-trail"].includes(id)))]:[],chapter2RewardClaimed:saved.missionState?.chapter2RewardClaimed===true,chapter2Journal:Array.isArray(saved.missionState?.chapter2Journal)?saved.missionState.chapter2Journal.filter(item=>typeof item==="string").slice(-20):[],chapter3ElderMet:saved.missionState?.chapter3ElderMet===true,chapter3Discoveries:Array.isArray(saved.missionState?.chapter3Discoveries)?[...new Set(saved.missionState.chapter3Discoveries.filter(id=>["market-square","village-well","council-hall"].includes(id)))]:[],chapter3RewardClaimed:saved.missionState?.chapter3RewardClaimed===true,chapter3Journal:Array.isArray(saved.missionState?.chapter3Journal)?saved.missionState.chapter3Journal.filter(item=>typeof item==="string").slice(-20):[]},
        health: safeStat(saved.health),
        hunger: safeStat(saved.hunger),
        thirst: safeStat(saved.thirst),
        energy: safeStat(saved.energy), warmth: safeStat(saved.warmth),
        clothing:{tunic:saved.clothing?.tunic===true,trousers:saved.clothing?.trousers===true,boots:saved.clothing?.boots===true},
        seedStarterPackClaimed: saved.seedStarterPackClaimed === true,
        inventory: {
          branches: safeCount(saved.inventory?.branches),
          stones: safeCount(saved.inventory?.stones),
          berries: safeCount(saved.inventory?.berries),
          wood: safeCount(saved.inventory?.wood),
          wheatSeeds: saved.inventory?.wheatSeeds===undefined?3:safeCount(saved.inventory.wheatSeeds),
          carrotSeeds: saved.inventory?.carrotSeeds===undefined?3:safeCount(saved.inventory.carrotSeeds),
          cabbageSeeds: saved.inventory?.cabbageSeeds===undefined?3:safeCount(saved.inventory.cabbageSeeds),
          wheat: safeCount(saved.inventory?.wheat),
          carrots: safeCount(saved.inventory?.carrots),
          cabbages: safeCount(saved.inventory?.cabbages),
          eggs: safeCount(saved.inventory?.eggs),
          wool: safeCount(saved.inventory?.wool),
          bread: safeCount(saved.inventory?.bread),
          omelet: safeCount(saved.inventory?.omelet),
          vegetableSoup: safeCount(saved.inventory?.vegetableSoup),
          berryPorridge: safeCount(saved.inventory?.berryPorridge),
          fabric: safeCount(saved.inventory?.fabric),
          tunic: safeCount(saved.inventory?.tunic),
          trousers: safeCount(saved.inventory?.trousers),
          boots: safeCount(saved.inventory?.boots), rawMeat:safeCount(saved.inventory?.rawMeat), hide:safeCount(saved.inventory?.hide), tannedLeather:safeCount(saved.inventory?.tannedLeather), leatherBackpack:safeCount(saved.inventory?.leatherBackpack), roastedMeat:safeCount(saved.inventory?.roastedMeat), arrows:safeCount(saved.inventory?.arrows), trout:safeCount(saved.inventory?.trout), carp:safeCount(saved.inventory?.carp), minnow:safeCount(saved.inventory?.minnow), grilledTrout:safeCount(saved.inventory?.grilledTrout), grilledCarp:safeCount(saved.inventory?.grilledCarp), grilledMinnow:safeCount(saved.inventory?.grilledMinnow), craftedGoods:safeCount(saved.inventory?.craftedGoods), tools:safeCount(saved.inventory?.tools)
        },
        animalCare:{
          chickens:{fedUntil:Number.isSafeInteger(saved.animalCare?.chickens?.fedUntil)?Math.max(0,saved.animalCare.chickens.fedUntil):0,nextAt:Number.isSafeInteger(saved.animalCare?.chickens?.nextAt)?Math.max(0,saved.animalCare.chickens.nextAt):0,ready:safeCount(saved.animalCare?.chickens?.ready)},
          sheep:{fedUntil:Number.isSafeInteger(saved.animalCare?.sheep?.fedUntil)?Math.max(0,saved.animalCare.sheep.fedUntil):0,nextAt:Number.isSafeInteger(saved.animalCare?.sheep?.nextAt)?Math.max(0,saved.animalCare.sheep.nextAt):0,ready:safeCount(saved.animalCare?.sheep?.ready)}
        },
        farmPlots: Array.isArray(saved.farmPlots) ? saved.farmPlots.filter(item=>item&&["farm-plot-1","farm-plot-2","farm-plot-3"].includes(item.id)&&Object.hasOwn({wheat:1,carrots:1,cabbages:1},item.crop)&&Number.isSafeInteger(item.plantedAt)&&item.plantedAt>=0).map(item=>({id:item.id,crop:item.crop,plantedAt:item.plantedAt})) : [],
        tools: { axe: saved.tools?.axe === true, bow:saved.tools?.bow===true, fishingRod:saved.tools?.fishingRod===true, leatherBackpack:saved.tools?.leatherBackpack===true },
        fishingSpotState:{lastCatch:Number.isSafeInteger(saved.fishingSpotState?.lastCatch)?Math.max(0,saved.fishingSpotState.lastCatch):0},
        tanneryState:{readyAt:Number.isSafeInteger(saved.tanneryState?.readyAt)?Math.max(0,saved.tanneryState.readyAt):0,ready:saved.tanneryState?.ready===true},
        huntedWildlife:Array.isArray(saved.huntedWildlife)?saved.huntedWildlife.filter(id=>/^wild-(deer|boar)-[0-9]+$/).slice(0,30):[],
        storage: { branches:safeCount(saved.storage?.branches), stones:safeCount(saved.storage?.stones), berries:safeCount(saved.storage?.berries), wood:safeCount(saved.storage?.wood) },
        cabinDoorOpen: saved.cabinDoorOpen === true,
        gameTime: {
          day: Number.isSafeInteger(saved.gameTime?.day) ? THREE.MathUtils.clamp(saved.gameTime.day,1,999999) : 1,
          hour: Number.isInteger(saved.gameTime?.hour) ? THREE.MathUtils.clamp(saved.gameTime.hour,0,23) : 8,
          minute: Number.isInteger(saved.gameTime?.minute) ? THREE.MathUtils.clamp(saved.gameTime.minute,0,59) : 0
        },
        completedVillagerTasks:[],
        villageStock:saved.villageStock&&typeof saved.villageStock==="object"?Object.fromEntries(["wheat","carrots","cabbages","wood","branches","stones","wool","rawMeat","hide","trout","carp","minnow","roastedMeat","vegetableSoup","bread","omelet","berryPorridge","grilledTrout","grilledCarp","grilledMinnow","fabric","craftedGoods","tools"].map(key=>[key,safeCount(saved.villageStock[key])])):{},
        villageProductionLastMinute:Number.isSafeInteger(saved.villageProductionLastMinute)?Math.max(0,saved.villageProductionLastMinute):null,
        villageFoodLastDay:Number.isSafeInteger(saved.villageFoodLastDay)?Math.max(1,saved.villageFoodLastDay):null,
        villageFoodReport:saved.villageFoodReport&&typeof saved.villageFoodReport==="object"?{day:Number.isSafeInteger(saved.villageFoodReport.day)?Math.max(1,saved.villageFoodReport.day):1,served:Number.isSafeInteger(saved.villageFoodReport.served)?Math.max(0,Math.min(40,saved.villageFoodReport.served)):0,missing:Number.isSafeInteger(saved.villageFoodReport.missing)?Math.max(0,Math.min(40,saved.villageFoodReport.missing)):0}:null,
        villagerRelationships:Array.isArray(saved.villagerRelationships)?saved.villagerRelationships.filter(item=>item&&typeof item.a==="string"&&typeof item.b==="string"&&item.a!==item.b&&Number.isFinite(item.affinity)&&["amizade","namoro","casados"].includes(item.status)).slice(0,300).map(item=>({a:item.a,b:item.b,affinity:THREE.MathUtils.clamp(item.affinity,0,100),status:item.status,weddingDay:Number.isSafeInteger(item.weddingDay)?Math.max(1,item.weddingDay):null})):[],
        familyPregnancies:Array.isArray(saved.familyPregnancies)?saved.familyPregnancies.filter(item=>item&&typeof item.a==="string"&&typeof item.b==="string"&&typeof item.houseId==="string"&&Number.isSafeInteger(item.startDay)&&Number.isSafeInteger(item.dueDay)&&item.dueDay>item.startDay).slice(0,40).map(item=>({a:item.a,b:item.b,houseId:item.houseId,startDay:Math.max(1,item.startDay),dueDay:Math.max(1,item.dueDay),childName:typeof item.childName==="string"?item.childName.slice(0,24):""})):[],
        familyChildren:Array.isArray(saved.familyChildren)?saved.familyChildren.filter(item=>item&&typeof item.id==="string"&&typeof item.name==="string"&&typeof item.a==="string"&&typeof item.b==="string"&&typeof item.houseId==="string"&&Number.isSafeInteger(item.birthDay)).slice(0,300).map(item=>({id:item.id.slice(0,100),name:item.name.slice(0,24),a:item.a,b:item.b,houseId:item.houseId,birthDay:Math.max(1,item.birthDay),gender:item.gender==="F"?"F":"M",adultProfession:typeof item.adultProfession==="string"?item.adultProfession:""})):[],
        nextChildName:typeof saved.nextChildName==="string"?saved.nextChildName.slice(0,24):"",
        villageHouses:Array.isArray(saved.villageHouses)?saved.villageHouses.filter(house=>house&&typeof house.id==="string"&&Number.isFinite(house.x)&&Number.isFinite(house.z)&&Math.abs(house.x)<=96&&Math.abs(house.z)<=96).slice(0,40).map(house=>({id:house.id,x:house.x,z:house.z,yaw:Number.isFinite(house.yaw)?house.yaw:0})):[],
        recruitedVillagers:Array.isArray(saved.recruitedVillagers)?saved.recruitedVillagers.filter(item=>item&&typeof item.id==="string"&&typeof item.houseId==="string").slice(0,40).map(item=>({id:item.id,houseId:item.houseId,profession:typeof item.profession==="string"&&item.profession.length<40?item.profession:null,hunger:Number.isFinite(item.hunger)?THREE.MathUtils.clamp(item.hunger,0,100):75,happiness:Number.isFinite(item.happiness)?THREE.MathUtils.clamp(item.happiness,0,100):75,lastMealDay:Number.isSafeInteger(item.lastMealDay)?Math.max(1,item.lastMealDay):Math.max(1,(Number.isSafeInteger(saved.gameTime?.day)?saved.gameTime.day:1)-1),foodStatus:typeof item.foodStatus==="string"&&item.foodStatus.length<80?item.foodStatus:"Aguardando refeição"})):[],
        structurePositions:saved.structurePositions&&typeof saved.structurePositions==="object"?Object.fromEntries(Object.entries(saved.structurePositions).filter(([id,pos])=>/^(workbench|merchant|kitchen|loom|tannery|chickens-pen|sheep-pen|farm-plot-[1-3])$/.test(id)&&pos&&Number.isFinite(pos.x)&&Number.isFinite(pos.z)&&Math.abs(pos.x)<=96&&Math.abs(pos.z)<=96).map(([id,pos])=>[id,{x:pos.x,z:pos.z,yaw:Number.isFinite(pos.yaw)?pos.yaw:0}])):{},
        builtCabin: saved.builtCabin && Number.isFinite(saved.builtCabin.x) && Number.isFinite(saved.builtCabin.z) && Math.abs(saved.builtCabin.x)<=96 && Math.abs(saved.builtCabin.z)<=96 ? { x:saved.builtCabin.x, z:saved.builtCabin.z, yaw:Number.isFinite(saved.builtCabin.yaw)?saved.builtCabin.yaw:0 } : null,
        resourceBase: saved.resourceBase &&
          Number.isFinite(saved.resourceBase.x) && Number.isFinite(saved.resourceBase.z)
          ? {
              x: THREE.MathUtils.clamp(saved.resourceBase.x, -100, 100),
              z: THREE.MathUtils.clamp(saved.resourceBase.z, -100, 100),
              yaw: Number.isFinite(saved.resourceBase.yaw) ? saved.resourceBase.yaw : 0
            }
          : null,
        collectedResources: Array.isArray(saved.collectedResources)
          ? saved.collectedResources.filter((id) => ["branch-pile-01", "branch-pile-02", "branch-pile-03", "branch-pile-04", "branch-pile-05", "branch-pile-06", "stone-cluster-01", "stone-cluster-02", "stone-cluster-03", "berry-bush-01"].includes(id))
          : [],
        resourceRespawnAt: saved.resourceRespawnAt && typeof saved.resourceRespawnAt === "object"
          ? Object.fromEntries(Object.entries(saved.resourceRespawnAt).filter(([id,value]) =>
              ["branch-pile-01","branch-pile-02","branch-pile-03","branch-pile-04","branch-pile-05","branch-pile-06","stone-cluster-01","stone-cluster-02","stone-cluster-03","berry-bush-01"].includes(id) &&
              Number.isSafeInteger(value) && value >= 0
            ))
          : {},
        felledTrees: Array.isArray(saved.felledTrees) ? saved.felledTrees.filter((index) => Number.isInteger(index) && index >= 0 && index < 470) : [],
        treeHits: saved.treeHits && typeof saved.treeHits === "object" ? Object.fromEntries(Object.entries(saved.treeHits).filter(([key, value]) => /^\d+$/.test(key) && Number.isInteger(value) && value >= 0 && value < 3)) : {}
      };
    } catch {
      return null;
    }
  }
  let lastSave = 0;
  function saveProgress(force = false) {
    const now = performance.now();
    if (!force && now - lastSave < 1500) return;
    lastSave = now;
    try {
      localStorage.setItem("legado-do-vale-prototipo", JSON.stringify({
        x: player.x, z: player.z, yaw: player.yaw, pitch: player.pitch,
        seedStarterPackClaimed: true,
        coins,
        tradeReputation,
        settlementReputation:{...settlementReputation},
        completedTradeContracts:[...completedTradeContracts],
        completedVillagerTasks:[...completedVillagerTasks],
        tanneryState:{...tanneryState},
        fishingSpotState:{lastCatch:fishingLastCatch},
        health: survival.health, hunger: survival.hunger, thirst: survival.thirst, energy: survival.energy, warmth: survival.warmth, clothing:{...clothing},
        inventory: { ...inventory },
        farmPlots: farmPlots.map(({id,crop,plantedAt})=>({id,crop,plantedAt})),
        animalCare:{chickens:{...animalCare.chickens},sheep:{...animalCare.sheep}},
        huntedWildlife:[...huntedWildlife],
        tools: { ...tools },
        storage: { ...storage },
        cabinDoorOpen,
        gameTime: { ...gameTime },
        resourceBase: { ...resourceBase },
        collectedResources: [...collectedResources],
        resourceRespawnAt: Object.fromEntries(resourceRespawnAt),
        felledTrees: [...felledTrees],
        treeHits: Object.fromEntries(treeHitCounts),
        builtCabin: builtCabin ? { ...builtCabin } : null,
        villageHouses:villageHouses.map(({id,x,z,yaw})=>({id,x,z,yaw})),
        recruitedVillagers:recruitedVillagers.map(({id,houseId,profession})=>{const resident=villagers.find(v=>v.id===id);return {id,houseId,profession:profession||resident?.role||null,hunger:resident?.hunger??75,happiness:resident?.happiness??75,lastMealDay:resident?.lastMealDay??Math.max(1,gameTime.day-1),foodStatus:resident?.foodStatus||"Aguardando refeição"};}),
        villageStock:{...villageStock},
        villageProductionLastMinute,
        villageFoodLastDay,
        villageFoodReport:{...villageFoodReport},
        villagerRelationships:villagerRelationships.map(item=>({...item})),
        familyPregnancies:familyPregnancies.map(item=>({...item})),
        familyChildren:familyChildren.map(item=>({...item})),
        dynastyState:{...dynastyState},
        missionState:{...missionState},
        nextChildName,
        structurePositions:structurePositionsForSave()
      }));
      try{localStorage.setItem("legado-do-vale-missoes-v1",JSON.stringify(missionState));}catch{}
    } catch { /* O jogo continua mesmo sem armazenamento disponível. */ }
  }

  const keys = new Set();
  let dragPointer = null;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let joystickPointer = null;
  const joystick = { x: 0, y: 0 };

  function rotateCamera(dx, dy, sensitivity = 0.004) {
    player.yaw -= dx * sensitivity;
    player.pitch = THREE.MathUtils.clamp(player.pitch - dy * sensitivity, -1.15, 1.15);
  }

  renderer.domElement.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch" && event.clientX < innerWidth * 0.38) return;
    dragPointer = event.pointerId;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    renderer.domElement.setPointerCapture?.(event.pointerId);
  });
  renderer.domElement.addEventListener("pointermove", (event) => {
    if (dragPointer !== event.pointerId) return;
    const dx = event.clientX - lastPointerX;
    const dy = event.clientY - lastPointerY;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    rotateCamera(dx, dy, event.pointerType === "touch" ? 0.005 : 0.0033);
  });
  function finishDrag(event) {
    if (dragPointer === event.pointerId) dragPointer = null;
  }
  renderer.domElement.addEventListener("pointerup", finishDrag);
  renderer.domElement.addEventListener("pointercancel", finishDrag);
  renderer.domElement.addEventListener("contextmenu", (event) => event.preventDefault());

  function updateJoystick(event) {
    const rect = joystickBase.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const radius = 39;
    const length = Math.hypot(dx, dy);
    const scale = length > radius ? radius / length : 1;
    const px = dx * scale;
    const py = dy * scale;
    joystick.x = px / radius;
    joystick.y = py / radius;
    joystickThumb.style.transform = "translate(" + px + "px," + py + "px)";
  }
  joystickWrap.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    joystickPointer = event.pointerId;
    joystickWrap.setPointerCapture(event.pointerId);
    updateJoystick(event);
  });
  joystickWrap.addEventListener("pointermove", (event) => {
    if (joystickPointer === event.pointerId) {
      event.preventDefault();
      updateJoystick(event);
    }
  });
  function releaseJoystick(event) {
    if (joystickPointer !== event.pointerId) return;
    joystickPointer = null;
    joystick.x = 0;
    joystick.y = 0;
    joystickThumb.style.transform = "translate(0,0)";
  }
  joystickWrap.addEventListener("pointerup", releaseJoystick);
  joystickWrap.addEventListener("pointercancel", releaseJoystick);

  // Botão de corrida por toque para manter a mesma ação disponível no celular.
  let mobileSprintActive = false;
  function stopMobileSprint() {
    mobileSprintActive = false;
    sprintButton.classList.remove("pressed");
  }
  sprintButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    mobileSprintActive = true;
    sprintButton.classList.add("pressed");
    sprintButton.setPointerCapture?.(event.pointerId);
  });
  sprintButton.addEventListener("pointerup", stopMobileSprint);
  sprintButton.addEventListener("pointercancel", stopMobileSprint);
  sprintButton.addEventListener("lostpointercapture", stopMobileSprint);

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", " ", "e", "i"].includes(key)) event.preventDefault();
    if (!event.repeat && key === "e") { if (buildMode) confirmBuilding(); else performCurrentInteraction(); }
    if (!event.repeat && key === "i") toggleInventory();
    if (!event.repeat && key === "r" && buildMode) rotateBuilding();
    if (!event.repeat && key === "escape") {
      if(buildMode)stopBuilding();
      else if(!tanneryPanel.classList.contains("hidden"))closeTanneryPanel();
      else if(!merchantPanel.classList.contains("hidden"))closeMerchantPanel();
      else if(!fishingPanel.classList.contains("hidden"))closeFishingPanel();
      else if(!loomPanel.classList.contains("hidden"))closeLoomPanel();
      else if(!kitchenPanel.classList.contains("hidden"))closeKitchenPanel();
      else if(!animalPanel.classList.contains("hidden"))closeAnimalPanel();
      else if(!farmPanel.classList.contains("hidden"))closeFarmPanel();
      else if(!sleepPanel.classList.contains("hidden"))closeSleepPanel();
      else if(!chestPanel.classList.contains("hidden"))closeChest();
      else closeCrafting();
    }
    keys.add(key);
  });
  window.addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));
  window.addEventListener("blur", () => keys.clear());
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) saveProgress(true);
  });
  window.addEventListener("beforeunload", () => saveProgress(true));

  // Colisão simples: limites do mapa, troncos e leito do rio.
  function isBlocked(x, z) {
    if (Math.abs(x) > 104 || Math.abs(z) > 104) return true;
    if (typeof neighborVillageObstacles!=="undefined" && neighborVillageObstacles.some(point=>Math.hypot(x-point.x,z-point.z)<point.radius)) return true;
    if (riverDistance(x, z) < 8.2 && !isOnRiverBridge(x,z)) return true;
    for (let i = 0; i < treeSpots.length; i++) {
      if (felledTrees.has(i)) continue;
      const tree = treeSpots[i];
      const dx = x - tree.x;
      const dz = z - tree.z;
      if (dx * dx + dz * dz < 2.0) return true;
    }
    const benchDx = x - workbenchPosition.x;
    const benchDz = z - workbenchPosition.z;
    if (benchDx * benchDx + benchDz * benchDz < 1.45) return true;
    if (kitchenPosition) { const dx=x-kitchenPosition.x,dz=z-kitchenPosition.z; if(dx*dx+dz*dz<1.15)return true; }
    if (loomPosition) { const dx=x-loomPosition.x,dz=z-loomPosition.z; if(dx*dx+dz*dz<1.35)return true; }
    if (tanneryPosition) { const dx=x-tanneryPosition.x,dz=z-tanneryPosition.z; if(dx*dx+dz*dz<1.7)return true; }
    if (builtCabin) {
      const dx=x-builtCabin.x,dz=z-builtCabin.z;
      const lx=dx*Math.cos(builtCabin.yaw)-dz*Math.sin(builtCabin.yaw),lz=dx*Math.sin(builtCabin.yaw)+dz*Math.cos(builtCabin.yaw);
      if(Math.abs(lx+1.15)<0.78 && Math.abs(lz-0.48)<1.12)return true;
      for(const plot of farmPlots){const pdx=x-plot.x,pdz=z-plot.z;if(Math.abs(pdx)<1.05&&Math.abs(pdz)<1.05)return true;}
      const fenceBlocked=(enclosure,halfW,halfD)=>{const dx=x-enclosure.x,dz=z-enclosure.z,yaw=enclosure.yaw??builtCabin.yaw,rx=dx*Math.cos(yaw)-dz*Math.sin(yaw),rz=dx*Math.sin(yaw)+dz*Math.cos(yaw);return (Math.abs(Math.abs(rx)-halfW)<0.24&&Math.abs(rz)<=halfD+0.2)||(Math.abs(Math.abs(rz)-halfD)<0.24&&Math.abs(rx)<=halfW+0.2);};
      if(fenceBlocked(animalEnclosures.chickens,1.9,1.9)||fenceBlocked(animalEnclosures.sheep,2.8,2.5))return true;
      const footprint=Math.abs(lx)<2.48 && Math.abs(lz)<2.82;
      if(footprint){
        const side=Math.abs(lx)>2.02 && Math.abs(lz)<2.68;
        const rear=lz>2.34;
        const front=lz< -2.34 && !(cabinDoorOpen && Math.abs(lx)<0.72);
        if(side||rear||front)return true;
      }
    }
    return false;
  }

  const tradeGoods=[
    {key:"branches",label:"Galhos",icon:"🌿",buy:3,sell:1},{key:"stones",label:"Pedras",icon:"🪨",buy:4,sell:2},{key:"craftedGoods",label:"Artesanato",icon:"🧺",buy:24,sell:15},{key:"tools",label:"Ferramentas",icon:"🔨",buy:38,sell:24},
    {key:"berries",label:"Frutas",icon:"🫐",buy:3,sell:1},{key:"wood",label:"Madeira",icon:"🪵",buy:7,sell:4},
    {key:"wheat",label:"Trigo",icon:"🌾",buy:5,sell:3},{key:"carrots",label:"Cenouras",icon:"🥕",buy:5,sell:3},
    {key:"cabbages",label:"Repolhos",icon:"🥬",buy:6,sell:3},{key:"eggs",label:"Ovos",icon:"🥚",buy:8,sell:5},
    {key:"wool",label:"Lã",icon:"🐑",buy:12,sell:7},{key:"fabric",label:"Tecido",icon:"🧵",buy:18,sell:11},
    {key:"hide",label:"Couro cru",icon:"🟤",buy:13,sell:8},{key:"tannedLeather",label:"Couro curtido",icon:"🟫",buy:24,sell:15},
    {key:"trout",label:"Truta",icon:"🐟",buy:11,sell:7},{key:"carp",label:"Carpa",icon:"🐠",buy:9,sell:5},
    {key:"minnow",label:"Peixe pequeno",icon:"🐟",buy:5,sell:2},
    {key:"bread",label:"Pão",icon:"🍞",buy:16,sell:10},{key:"omelet",label:"Omelete",icon:"🍳",buy:18,sell:11},
    {key:"vegetableSoup",label:"Sopa de legumes",icon:"🥣",buy:22,sell:14},{key:"berryPorridge",label:"Mingau de frutas",icon:"🫐",buy:15,sell:9},
    {key:"roastedMeat",label:"Carne assada",icon:"🍖",buy:25,sell:16},{key:"grilledTrout",label:"Truta grelhada",icon:"🐟",buy:23,sell:15},
    {key:"grilledCarp",label:"Carpa grelhada",icon:"🐠",buy:20,sell:13},{key:"grilledMinnow",label:"Peixe grelhado",icon:"🐟",buy:13,sell:8},
    {key:"tunic",label:"Túnica",icon:"🥋",buy:55,sell:34,unlock:5},{key:"trousers",label:"Calças forradas",icon:"👖",buy:48,sell:30,unlock:5},
    {key:"boots",label:"Botas de lã",icon:"🥾",buy:42,sell:26,unlock:5}
  ];
  const contractPool=tradeGoods.filter(item=>!["branches","stones","berries","wheat","carrots","cabbages"].includes(item.key));
  function marketPrice(item,action){
    const wave=((gameTime.day*7+tradeGoods.indexOf(item)*3)%7)-3;
    const reputationDiscount=Math.min(0.12,tradeReputation*0.004);
    const base=action==="buy"?item.buy:item.sell;
    const adjusted=action==="buy"?base*(1+wave*0.035-reputationDiscount):base*(1+wave*0.035+reputationDiscount);
    return Math.max(1,Math.round(adjusted));
  }
  function tradeRank(){return tradeReputation>=20?"Mestre comerciante":tradeReputation>=10?"Mercador respeitado":tradeReputation>=5?"Negociante": "Aprendiz";}
  function dailyTradeContracts(){
    const available=contractPool.filter(item=>(item.unlock||0)<=tradeReputation);
    const start=(gameTime.day*5)%available.length;
    return [0,1,2].map((offset)=>{
      const item=available[(start+offset*3)%available.length];
      const quantity=2+(gameTime.day+offset)%3;
      return {id:"day-"+gameTime.day+"-"+item.key+"-"+offset,key:item.key,label:item.label,icon:item.icon,quantity,reward:Math.round(item.sell*quantity*1.9+8),rep:2+(offset===0?1:0)};
    });
  }
  function renderMerchantPanel(){
    merchantCoins.textContent="Sua bolsa: "+coins+" moedas · Reputação: "+tradeReputation+" · "+tradeRank();
    merchantItems.innerHTML=tradeGoods.filter(item=>(item.unlock||0)<=tradeReputation).map(item=>{
      const buy=marketPrice(item,"buy"),sell=marketPrice(item,"sell");
      return '<article class="merchant-item"><div class="merchant-item-copy"><strong>'+item.icon+' '+item.label+'</strong><small>Comprar: '+buy+' moedas · Vender: '+sell+' moedas · Você tem: '+(inventory[item.key]||0)+'</small></div><div class="merchant-item-actions"><button type="button" data-trade="buy" data-item="'+item.key+'" '+(coins<buy||inventoryLoad()>=carryCapacity()?"disabled":"")+'>COMPRAR</button><button type="button" data-trade="sell" data-item="'+item.key+'" '+((inventory[item.key]||0)<1?"disabled":"")+'>VENDER</button></div></article>';
    }).join("");
    const villageGoods=Object.keys(villageStockLabels).filter(key=>tradeGoods.some(item=>item.key===key));
    const villageTradeMarkup='<h3 class="merchant-section-title">MERCADORIAS DO DEPÓSITO DA VILA</h3>'+villageGoods.map(key=>{
      const item=tradeGoods.find(entry=>entry.key===key),quantity=villageStock[key]||0,price=marketPrice(item,"sell");
      return '<article class="merchant-item village-merchant-item" data-village-stock-item="'+key+'"><div class="merchant-item-copy"><strong>'+item.icon+' '+item.label+'</strong><small>Estoque: '+quantity+' · Venda: '+price+' moedas por unidade</small></div><div class="merchant-item-actions village-stock-actions"><input type="number" min="1" max="'+Math.max(1,quantity)+'" value="'+(quantity?1:0)+'" data-village-qty="'+key+'" aria-label="Quantidade de '+item.label+'"><button type="button" data-village-stock-action="withdraw" data-item="'+key+'" '+(quantity<1||inventoryLoad()>=carryCapacity()?"disabled":"")+'>RETIRAR</button><button type="button" data-village-stock-action="sell" data-item="'+key+'" '+(quantity<1?"disabled":"")+'>VENDER</button></div></article>';
    }).join("");
    merchantContracts.innerHTML=villageTradeMarkup+'<h3 class="merchant-section-title">ENCOMENDAS DO VALE</h3>'+dailyTradeContracts().map(contract=>{
      const done=completedTradeContracts.has(contract.id),enough=(inventory[contract.key]||0)>=contract.quantity;
      return '<article class="merchant-contract"><div><strong>'+contract.icon+' '+contract.quantity+' × '+contract.label+'</strong><small>Recompensa: '+contract.reward+' moedas · +'+contract.rep+' reputação</small></div><button type="button" data-contract="'+contract.id+'" '+(done||!enough?"disabled":"")+'>'+(done?"CONCLUÍDA":enough?"ENTREGAR":"FALTAM "+Math.max(0,contract.quantity-(inventory[contract.key]||0)))+'</button></article>';
    }).join("");
    merchantRank.textContent="Categoria: "+tradeRank()+" · Próximo nível: "+(tradeReputation<5?5:tradeReputation<10?10:tradeReputation<20?20:"máximo")+" de reputação";
  }
  function openMerchantPanel(){if(!canUseMerchant)return;merchantTitle.textContent="MERCADOR DO VALE";merchantStatus.textContent="Os preços mudam diariamente. Complete encomendas para ganhar reputação e desbloquear mercadorias especiais.";renderMerchantPanel();merchantPanel.classList.remove("hidden");}
  function closeMerchantPanel(){merchantPanel.classList.add("hidden");}
  function tradeWithMerchant(action,key){
    const item=tradeGoods.find(entry=>entry.key===key);if(!item||!canUseMerchant||(item.unlock||0)>tradeReputation)return;
    const price=marketPrice(item,action);
    if(action==="buy"){
      if(coins<price){showToast("Moedas insuficientes para comprar "+item.label.toLowerCase()+".");return;}
      if(inventoryLoad()>=carryCapacity()){showToast("Mochila cheia. Guarde itens antes de comprar.");return;}
      coins-=price;inventory[key]=Math.min(9999,(inventory[key]||0)+1);showToast("Compra realizada · 1 "+item.label.toLowerCase()+".");
    }else if(action==="sell"){
      if((inventory[key]||0)<1){showToast("Você não tem "+item.label.toLowerCase()+" para vender.");return;}
      inventory[key]--;coins=Math.min(999999,coins+price);showToast("Venda realizada · +"+price+" moedas.");
    }else return;
    updateInventoryUI();renderMerchantPanel();saveProgress(true);
  }
  function deliverTradeContract(id){
    if(!canUseMerchant)return;
    const contract=dailyTradeContracts().find(item=>item.id===id);
    if(!contract||completedTradeContracts.has(id))return;
    if((inventory[contract.key]||0)<contract.quantity){showToast("Você ainda não tem todos os produtos da encomenda.");return;}
    inventory[contract.key]-=contract.quantity;coins=Math.min(999999,coins+contract.reward);
    tradeReputation=Math.min(9999,tradeReputation+contract.rep);settlementReputation.vale=Math.min(9999,(settlementReputation.vale||0)+contract.rep);completedTradeContracts.add(id);
    const newlyUnlocked=tradeReputation>=5&&tradeReputation-contract.rep<5;
    showToast("Encomenda entregue! +"+contract.reward+" moedas e +"+contract.rep+" reputação."+ (newlyUnlocked?" Novos produtos desbloqueados!":""));
    updateInventoryUI();renderMerchantPanel();saveProgress(true);
  }
  merchantItems.addEventListener("click",event=>{const button=event.target.closest("button[data-trade]");if(button)tradeWithMerchant(button.dataset.trade,button.dataset.item);});
  merchantContracts.addEventListener("click",event=>{
    const stockButton=event.target.closest("button[data-village-stock-action]");
    if(stockButton){
      const key=stockButton.dataset.item,action=stockButton.dataset.villageStockAction,item=tradeGoods.find(entry=>entry.key===key);
      const row=stockButton.closest("[data-village-stock-item]"),input=row?.querySelector("[data-village-qty]");
      const requested=Number(input?.value),amount=Number.isSafeInteger(requested)?requested:0,available=villageStock[key]||0;
      if(!canUseMerchant||!item||!["withdraw","sell"].includes(action)||amount<1||amount>available){showToast("Quantidade inválida ou estoque insuficiente.");return;}
      if(action==="withdraw"){
        if(inventoryLoad()+amount>carryCapacity()){showToast("A mochila não tem espaço para retirar essa quantidade.");return;}
        villageStock[key]-=amount;inventory[key]=Math.min(999999,(inventory[key]||0)+amount);
        showToast("Retirado do depósito: "+amount+" × "+item.label+".");
      }else{
        const price=marketPrice(item,"sell"),revenue=price*amount;
        if(coins+revenue>999999){showToast("A bolsa atingiu o limite de moedas.");return;}
        villageStock[key]-=amount;coins+=revenue;
        showToast("Venda do depósito: "+amount+" × "+item.label+" · +"+revenue+" moedas.");
      }
      updateInventoryUI();renderMerchantPanel();saveProgress(true);return;
    }
    const button=event.target.closest("button[data-contract]");if(button)deliverTradeContract(button.dataset.contract);
  });
  merchantClose.addEventListener("click",closeMerchantPanel);

  function updateResourceTarget() {
    if (buildMode) { interactionPrompt.classList.add("hidden"); collectButton.classList.add("hidden"); return; }
    const facingX = -Math.sin(player.yaw);
    const facingZ = -Math.cos(player.yaw);
    let match = null;
    let bestDistance = Infinity;

    for (const node of collectibleNodes) {
      if (collectedResources.has(node.id)) continue;
      const dx = node.x - player.x;
      const dz = node.z - player.z;
      const distance = Math.hypot(dx, dz);
      if (distance > 5.9 || distance < 0.1) continue;
      const facing = (dx * facingX + dz * facingZ) / distance;
      if (facing < 0.62 || distance >= bestDistance) continue;
      match = node;
      bestDistance = distance;
    }

    let nearestFishing=null,nearestFishingDistance=Infinity;
    for(const spot of fishingSpots){const d=Math.hypot(spot.x-player.x,spot.z-player.z);if(d<5.2&&d<nearestFishingDistance){nearestFishing=spot;nearestFishingDistance=d;}}
    currentFishingSpot=nearestFishing;canUseFishingSpot=Boolean(nearestFishing&&!match&&tools.fishingRod);
    const merchantDistance=merchantPosition?Math.hypot(merchantPosition.x-player.x,merchantPosition.z-player.z):Infinity;
    canUseMerchant=Boolean(!match&&merchantDistance<=5.0);
    let nearestVillager=null,nearestVillagerDistance=Infinity;
    for(const villager of villagers){const distance=Math.hypot(villager.x-player.x,villager.z-player.z);if(distance<=6.2&&distance<nearestVillagerDistance){nearestVillager=villager;nearestVillagerDistance=distance;}}
    currentVillager=(!match&&!canUseMerchant&&!canUseFishingSpot)?nearestVillager:null;
    const tanneryDistance=tanneryPosition?Math.hypot(tanneryPosition.x-player.x,tanneryPosition.z-player.z):Infinity;
    canUseTannery=Boolean(builtCabin&&!match&&tanneryDistance<=4.4);
    const loomDistance=loomPosition?Math.hypot(loomPosition.x-player.x,loomPosition.z-player.z):Infinity;
    canUseLoom=Boolean(builtCabin&&!match&&!canUseTannery&&loomDistance<=4.2);
    const bankDistance = riverDistance(player.x, player.z);
    canDrinkWater = !match && !canUseLoom && !canUseFishingSpot && bankDistance >= 8.2 && bankDistance <= 12.4 && survival.thirst < 99.5;
    const benchDistance = Math.hypot(workbenchPosition.x - player.x, workbenchPosition.z - player.z);
    canUseWorkbench = !match && !canUseLoom && !canDrinkWater && !canUseFishingSpot && benchDistance <= 5.2;
    canUseCabinDoor=false; canUseStorageChest=false; canUseBed=false;canUseFarmPlot=false;currentFarmPlot=null;canUseAnimalPen=false;currentAnimalType=null;canUseKitchen=false;
    if(builtCabin && !match && !canUseLoom && !canDrinkWater && !canUseWorkbench){
      const dx=player.x-builtCabin.x,dz=player.z-builtCabin.z;
      const lx=dx*Math.cos(builtCabin.yaw)-dz*Math.sin(builtCabin.yaw);
      const lz=dx*Math.sin(builtCabin.yaw)+dz*Math.cos(builtCabin.yaw);
      const inside=Math.abs(lx)<1.95 && Math.abs(lz)<2.18;
      canUseCabinDoor=Math.hypot(lx,lz+2.8)<3.45 && Math.abs(lx)<1.55;
      canUseBed=inside && Math.hypot(lx+1.15,lz-0.48)<1.95;
      canUseStorageChest=inside && Math.hypot(lx-1.18,lz-1.15)<2.15;
    }
    if(builtCabin&&!match&&!canUseLoom&&!canDrinkWater&&!canUseWorkbench){
      for(const plot of farmPlots){const distance=Math.hypot(player.x-plot.x,player.z-plot.z);if(distance<3.25&&(!currentFarmPlot||distance<Math.hypot(player.x-currentFarmPlot.x,player.z-currentFarmPlot.z)))currentFarmPlot=plot;}
      canUseFarmPlot=Boolean(currentFarmPlot);
    }
    if(builtCabin&&!match&&!canUseLoom&&!canDrinkWater&&!canUseWorkbench&&!canUseFarmPlot&&!canUseCabinDoor&&!canUseBed&&!canUseStorageChest){
      let nearest=Infinity;
      for(const type of ["chickens","sheep"]){const enclosure=animalEnclosures[type],distance=Math.hypot(player.x-enclosure.x,player.z-enclosure.z);if(distance<(type==="chickens"?4.8:5.3)&&distance<nearest){nearest=distance;currentAnimalType=type;}}
      canUseAnimalPen=Boolean(currentAnimalType);
    }
    if(builtCabin&&!match&&!canUseLoom&&!canDrinkWater&&!canUseWorkbench&&!canUseFarmPlot&&!canUseAnimalPen&&!canUseCabinDoor&&!canUseBed&&!canUseStorageChest&&kitchenPosition){
      canUseKitchen=Math.hypot(player.x-kitchenPosition.x,player.z-kitchenPosition.z)<=4.6;
    }

    if(canUseTannery||canUseLoom||canDrinkWater||canUseWorkbench||canUseFarmPlot||canUseAnimalPen||canUseKitchen||canUseCabinDoor||canUseBed||canUseStorageChest||canUseMerchant||canUseFishingSpot)currentVillager=null;
    let wildlifeMatch=null,bestWildlifeDistance=Infinity;
    for(const actor of wildlifeActors){const dx=actor.x-player.x,dz=actor.z-player.z,distance=Math.hypot(dx,dz);if(distance>34||distance<2)continue;const facing=(dx*facingX+dz*facingZ)/distance;if(facing<.91||distance>=bestWildlifeDistance)continue;wildlifeMatch=actor;bestWildlifeDistance=distance;}
    currentWildlifeTarget=wildlifeMatch;
    let treeMatch = null;
    let bestTreeDistance = Infinity;
    for (let i = 0; i < treeSpots.length; i++) {
      if (felledTrees.has(i)) continue;
      const tree = treeSpots[i];
      const dx = tree.x - player.x;
      const dz = tree.z - player.z;
      const distance = Math.hypot(dx, dz);
      if (distance > 5.6 || distance < 1.4) continue;
      const facing = (dx * facingX + dz * facingZ) / distance;
      if (facing < 0.72 || distance >= bestTreeDistance) continue;
      treeMatch = { tree, index: i };
      bestTreeDistance = distance;
    }
    currentTreeTarget = !match && !canUseLoom && !canDrinkWater && !canUseWorkbench && !canUseFarmPlot && !canUseAnimalPen && !canUseKitchen && !canUseLoom ? treeMatch : null;
    canChopTree = Boolean(currentTreeTarget && tools.axe);
    currentResourceTarget = match;
    const hasInteraction = Boolean(match) || Boolean(currentVillager) || canUseMerchant || canUseTannery || canUseFishingSpot || canDrinkWater || canUseWorkbench || canUseFarmPlot || canUseAnimalPen || canUseKitchen || canUseLoom || canUseCabinDoor || canUseBed || canUseStorageChest || Boolean(currentTreeTarget) || Boolean(currentWildlifeTarget);
    interactionPrompt.classList.toggle("hidden", !hasInteraction);
    collectButton.classList.toggle("hidden", !hasInteraction || !isMobile);

    if (match) {
      interactionType.textContent = "RECURSO AO ALCANCE";
      interactionName.textContent = match.label + " · " + match.amount;
      interactionVerb.textContent = "recolher";
      collectButton.textContent = "RECOLHER";
    } else if (currentVillager) {
      interactionType.textContent="MORADOR DO VALE";
      interactionName.textContent=currentVillager.name+" · "+currentVillager.role;
      interactionVerb.textContent="conversar e conhecer uma tarefa";
      collectButton.textContent="CONVERSAR";
    } else if (canUseMerchant) {
      interactionType.textContent="COMÉRCIO";interactionName.textContent="Banca do mercador";interactionVerb.textContent="comprar e vender mercadorias";collectButton.textContent="NEGOCIAR";
    } else if (canUseFishingSpot) {
      interactionType.textContent="PESCA";interactionName.textContent="Margem de pesca";interactionVerb.textContent="lançar a linha e pescar";collectButton.textContent="PESCAR";
    } else if (canUseTannery) {
      interactionType.textContent="CURTUME";interactionName.textContent="Bancada de curtimento";interactionVerb.textContent="curtir couro e fabricar mochila";collectButton.textContent="USAR CURTUME";
    } else if (canUseLoom) {
      interactionType.textContent = "OFÍCIO ARTESANAL";interactionName.textContent = "Tear de lã";interactionVerb.textContent = "tecer e fabricar roupas";collectButton.textContent = "USAR TEAR";
    } else if (canDrinkWater) {
      interactionType.textContent = "MARGEM DO RIO";
      interactionName.textContent = "Água do rio";
      interactionVerb.textContent = "beber água";
      collectButton.textContent = "BEBER ÁGUA";
    } else if (canUseFarmPlot) {
      interactionType.textContent = "AGRICULTURA";
      interactionName.textContent = currentFarmPlot.crop ? cropTypes[currentFarmPlot.crop].label+" · canteiro" : "Canteiro vazio";
      interactionVerb.textContent = currentFarmPlot.crop ? "cuidar da plantação" : "plantar";
      collectButton.textContent = currentFarmPlot.crop ? "CUIDAR PLANTAÇÃO" : "PLANTAR";
    } else if (canUseAnimalPen) {
      interactionType.textContent = "CRIAÇÃO DE ANIMAIS";
      interactionName.textContent = currentAnimalType==="chickens" ? "Galinheiro · 3 galinhas" : "Cercado · 2 ovelhas";
      interactionVerb.textContent = "alimentar ou recolher produção";
      collectButton.textContent = "CUIDAR DOS ANIMAIS";
    } else if (canUseKitchen) {
      interactionType.textContent = "COZINHA";
      interactionName.textContent = "Fogueira e panela";
      interactionVerb.textContent = "preparar alimentos";
      collectButton.textContent = "USAR COZINHA";
    } else if (canUseLoom) {
      interactionType.textContent = "OFÍCIO ARTESANAL";interactionName.textContent = "Tear de lã";interactionVerb.textContent = "tecer e fabricar roupas";collectButton.textContent = "USAR TEAR";
    } else if (canUseCabinDoor) {
      interactionType.textContent = "SUA CABANA";
      interactionName.textContent = cabinDoorOpen ? "Porta aberta" : "Porta fechada";
      interactionVerb.textContent = cabinDoorOpen ? "fechar porta" : "abrir porta";
      collectButton.textContent = cabinDoorOpen ? "FECHAR PORTA" : "ABRIR PORTA";
    } else if (canUseBed) {
      interactionType.textContent = "DESCANSO";
      interactionName.textContent = "Cama da cabana";
      interactionVerb.textContent = "dormir";
      collectButton.textContent = "DORMIR";
    } else if (canUseStorageChest) {
      interactionType.textContent = "ARMAZENAMENTO";
      interactionName.textContent = "Baú de recursos";
      interactionVerb.textContent = "abrir baú";
      collectButton.textContent = "ABRIR BAÚ";
    } else if(currentWildlifeTarget){interactionType.textContent="CAÇA";interactionName.textContent=wildlifeDefinitions[currentWildlifeTarget.type].label+" selvagem";interactionVerb.textContent=tools.bow&&inventory.arrows>0?"atirar flecha":"fabricar arco e flechas na bancada";collectButton.textContent=tools.bow&&inventory.arrows>0?"ATIRAR":"PRECISA DE ARCO";
    } else if (currentTreeTarget) {
      interactionType.textContent = "ÁRVORE";
      interactionName.textContent = canChopTree ? "Madeira · " + (3 - (treeHitCounts.get(currentTreeTarget.index) ?? 0)) + " golpes" : "Machado necessário";
      interactionVerb.textContent = canChopTree ? "cortar árvore" : "fabricar um machado na bancada";
      collectButton.textContent = canChopTree ? "CORTAR ÁRVORE" : "PRECISA DE MACHADO";
    }
  }
  function shootWildlife(){const target=currentWildlifeTarget;if(!target)return;const def=wildlifeDefinitions[target.type];if(!canCarry(def.meat+def.hide))return;if(!tools.bow){showToast("Você precisa fabricar um arco na bancada.");return;}if(inventory.arrows<1){showToast("Sem flechas. Fabrique mais na bancada.");return;}inventory.arrows--;inventory.rawMeat=Math.min(9999,inventory.rawMeat+def.meat);inventory.hide=Math.min(9999,inventory.hide+def.hide);huntedWildlife.add(target.id);scene.remove(target.group);const i=wildlifeActors.indexOf(target);if(i>=0)wildlifeActors.splice(i,1);currentWildlifeTarget=null;updateInventoryUI();saveProgress(true);showToast("Caça realizada · +"+def.meat+" carne crua · +"+def.hide+" couro");updateResourceTarget();}
  function drinkWater() {
    const bankDistance = riverDistance(player.x, player.z);
    if (!canDrinkWater || bankDistance < 8.2 || bankDistance > 12.4 || survival.thirst >= 100) return;
    survival.thirst = Math.min(100, survival.thirst + 35);
    canDrinkWater = false;
    updateSurvivalUI(true);
    saveProgress(true);
    showToast("Você bebeu água do rio · sede +35");
    updateResourceTarget();
  }
  function collectCurrentResource() {
    const node = currentResourceTarget;
    if (!node || collectedResources.has(node.id) || !canCarry(node.amount)) return;
    inventory[node.itemKey] = Math.min(9999, inventory[node.itemKey] + node.amount);
    collectedResources.add(node.id);
    resourceRespawnAt.set(node.id, totalGameMinutes() + 360);
    scene.remove(node.root);
    for (let i = collectibleMeshes.length - 1; i >= 0; i--) {
      if (collectibleMeshes[i].userData.resourceNode === node) collectibleMeshes.splice(i, 1);
    }
    const nodeIndex = collectibleNodes.indexOf(node);
    if (nodeIndex >= 0) collectibleNodes.splice(nodeIndex, 1);
    currentResourceTarget = null;
    interactionPrompt.classList.add("hidden");
    collectButton.classList.add("hidden");
    updateInventoryUI();
    saveProgress(true);
    showToast("+" + node.amount + " · " + node.label + " recolhidos");
  }
  function hideTreeInstance(index) {
    const hidden = new THREE.Object3D();
    hidden.position.set(0, -1000, 0);
    hidden.scale.set(0, 0, 0);
    hidden.updateMatrix();
    trunkMesh.setMatrixAt(index, hidden.matrix);
    crownMesh.setMatrixAt(index, hidden.matrix);
    crownTopMesh.setMatrixAt(index, hidden.matrix);
    trunkMesh.instanceMatrix.needsUpdate = true;
    crownMesh.instanceMatrix.needsUpdate = true;
    crownTopMesh.instanceMatrix.needsUpdate = true;
  }
  function createFallingTree(index) {
    const tree = treeSpots[index];
    const groundY = groundHeight(tree.x, tree.z);
    hideTreeInstance(index);
    const group = new THREE.Group();
    group.position.set(tree.x, groundY, tree.z);
    const s = tree.scale;
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2.1 * s;
    trunk.scale.set(s, s, s);
    const crown = new THREE.Mesh(crownGeometry, crownMaterial);
    crown.position.y = 6.2 * s;
    crown.scale.set(s, s, s);
    const crownTop = new THREE.Mesh(crownTopGeometry, crownMaterial);
    crownTop.position.y = 10.0 * s;
    crownTop.scale.set(s * 0.78, s * 0.78, s * 0.78);
    group.add(trunk, crown, crownTop);
    group.rotation.y = Math.atan2(player.x - tree.x, player.z - tree.z);
    scene.add(group);
    fallingTrees.push({ index, group, elapsed: 0, duration: 0.82, groundY });
  }
  function finishTreeFelling(index, groundY) {
    const tree = treeSpots[index];
    addTreeRemains(tree, groundY);
    treeHitCounts.delete(index);
    saveProgress(true);
    showToast("Árvore derrubada · +4 madeiras na mochila");
  }
  function chopCurrentTree() {
    const target = currentTreeTarget;
    if (!target || !tools.axe || felledTrees.has(target.index)) return;
    axeSwingTimer = 0.34;
    const hits = (treeHitCounts.get(target.index) ?? 0) + 1;
    treeHitCounts.set(target.index, hits);
    if (hits >= 3) {
      if(!canCarry(4))return;
      felledTrees.add(target.index);
      treeHitCounts.delete(target.index);
      inventory.wood = Math.min(9999, inventory.wood + 4);
      updateInventoryUI();
      createFallingTree(target.index);
      currentTreeTarget = null;
      canChopTree = false;
      interactionPrompt.classList.add("hidden");
      collectButton.classList.add("hidden");
      saveProgress(true);
      showToast("Árvore atingida! Ela está caindo...");
    } else {
      saveProgress(true);
      showToast("Golpe " + hits + "/3 · continue cortando");
      updateResourceTarget();
    }
  }
  const storageLabels={branches:"Galhos",stones:"Pedras",berries:"Frutas",wood:"Madeira"};
  function updateChestUI(){
    chestItems.innerHTML=Object.keys(storageLabels).map(key=>'<div class="chest-item"><span>'+storageLabels[key]+'</span><strong>'+inventory[key]+' / '+storage[key]+'</strong><div><button type="button" data-chest-action="store" data-item="'+key+'">GUARDAR 1</button><button type="button" data-chest-action="take" data-item="'+key+'">RETIRAR 1</button></div></div>').join("");
  }
  function openChest(){updateChestUI();chestPanel.classList.remove("hidden");chestTargetAngle=-0.82;}
  function closeChest(){chestPanel.classList.add("hidden");chestTargetAngle=0;}
  function transferStorage(action,key){
    if(!Object.hasOwn(storage,key)||!Object.hasOwn(inventory,key))return;
    if(action==="store"&&inventory[key]>0&&storage[key]<9999){inventory[key]--;storage[key]++;}
    else if(action==="take"&&storage[key]>0&&inventory[key]<9999){storage[key]--;inventory[key]++;}
    else{showToast(action==="store"?"Não há unidades disponíveis na mochila.":"Não há unidades guardadas no baú.");return;}
    updateInventoryUI();updateChestUI();saveProgress(true);
  }
  chestItems.addEventListener("click",event=>{const b=event.target.closest("button[data-chest-action]");if(b)transferStorage(b.dataset.chestAction,b.dataset.item);});
  chestClose.addEventListener("click",closeChest);
  function toggleCabinDoor(){
    if(!canUseCabinDoor||!builtCabin)return;
    cabinDoorOpen=!cabinDoorOpen;cabinDoorTarget=cabinDoorOpen?Math.PI/2:0;
    saveProgress(true);showToast(cabinDoorOpen?"Você abriu a porta da cabana.":"Você fechou a porta da cabana.");updateResourceTarget();
  }
  function renderAnimalPanel(){
    if(!currentAnimalType)return;
    const type=currentAnimalType,settings=animalSettings[type],care=animalCare[type],now=totalGameMinutes(),remaining=Math.max(0,care.fedUntil-now),fed=remaining>0;
    animalTitle.textContent=type==="chickens"?"GALINHEIRO":"CERCADO DE OVELHAS";
    animalStatus.textContent=settings.count+" "+settings.label.toLowerCase()+" · "+(fed?"alimentadas por mais "+Math.floor(remaining/60)+"h "+(remaining%60)+"min":"precisam ser alimentadas")+". Produção disponível: "+care.ready+" "+settings.productLabel+".";
    const feedText=type==="chickens"?"ALIMENTAR COM 1 TRIGO":"ALIMENTAR COM 1 REPOLHO";
    const feedHtml='<button type="button" data-animal-feed="'+type+'" '+(inventory[settings.feed]<1?"disabled":"")+'><strong>'+feedText+'</strong><small>Estende o período de alimentação do grupo</small></button>';
    const collectHtml=care.ready>0?'<button type="button" data-animal-collect="'+type+'"><strong>RECOLHER '+settings.productLabel.toUpperCase()+'</strong><small>Disponível: '+care.ready+'</small></button>':'<button type="button" disabled><strong>SEM PRODUÇÃO PARA RECOLHER</strong><small>'+(fed?"Aguarde o próximo ciclo.":"Alimente os animais para iniciar a produção.")+'</small></button>';
    animalActions.innerHTML=feedHtml+collectHtml;
  }
  function openAnimalPanel(){if(!canUseAnimalPen||!currentAnimalType)return;renderAnimalPanel();animalPanel.classList.remove("hidden");}
  function closeAnimalPanel(){animalPanel.classList.add("hidden");}
  function feedAnimalGroup(type){
    if(type!==currentAnimalType||!canUseAnimalPen)return;
    const settings=animalSettings[type],care=animalCare[type],now=totalGameMinutes();
    if(inventory[settings.feed]<1){showToast("Você precisa de "+settings.feedLabel+" para alimentar.");return;}
    inventory[settings.feed]--;
    const wasFed=care.fedUntil>now;care.fedUntil=Math.max(now,care.fedUntil)+720;
    if(!wasFed||care.nextAt<=now)care.nextAt=now+settings.interval;
    updateInventoryUI();renderAnimalPanel();saveProgress(true);showToast(settings.label+" alimentadas! A produção foi ativada.");
  }
  function collectAnimalProduct(type){
    if(type!==currentAnimalType||!canUseAnimalPen)return;
    const settings=animalSettings[type],care=animalCare[type];if(care.ready<1)return;
    if(!canCarry(care.ready))return;
    inventory[settings.product]=Math.min(9999,inventory[settings.product]+care.ready);
    const amount=care.ready;care.ready=0;updateInventoryUI();renderAnimalPanel();saveProgress(true);
    showToast("Produção recolhida · +"+amount+" "+settings.productLabel);
  }
  animalActions.addEventListener("click",event=>{
    const feed=event.target.closest("button[data-animal-feed]"),collect=event.target.closest("button[data-animal-collect]");
    if(feed)feedAnimalGroup(feed.dataset.animalFeed);
    if(collect)collectAnimalProduct(collect.dataset.animalCollect);
  });
  animalClose.addEventListener("click",closeAnimalPanel);
  function renderFarmPanel(){
    if(!currentFarmPlot)return;
    const plot=currentFarmPlot;
    farmPlotTitle.textContent="CANTEIRO "+plot.id.slice(-1);
    if(!plot.crop){
      farmPlotStatus.textContent="Escolha uma semente para plantar. Cada canteiro recebe uma cultura.";
      farmActions.innerHTML=Object.entries(cropTypes).map(([type,definition])=>'<button type="button" data-farm-plant="'+type+'" '+(inventory[definition.seed]<1?"disabled":"")+'><strong>PLANTAR '+definition.label.toUpperCase()+'</strong><small>Sementes disponíveis: '+inventory[definition.seed]+'</small></button>').join("");
    }else{
      const definition=cropTypes[plot.crop],elapsed=Math.max(0,totalGameMinutes()-plot.plantedAt),progress=Math.min(100,Math.round(elapsed/definition.growth*100)),ready=progress>=100;
      farmPlotStatus.textContent=ready?definition.label+" madura! A colheita está pronta.":definition.label+" crescendo · "+progress+"% · faltam "+Math.ceil((definition.growth-elapsed)/60)+" hora(s) de jogo.";
      farmActions.innerHTML=ready?'<button type="button" data-farm-harvest="1"><strong>COLHER '+definition.label.toUpperCase()+'</strong><small>Adicionar 1 alimento à mochila</small></button>':'<button type="button" disabled><strong>AGUARDAR CRESCIMENTO</strong><small>A plantação amadurece com a passagem do tempo.</small></button>';
    }
  }
  function openFarmPanel(){
    if(!canUseFarmPlot||!currentFarmPlot)return;
    renderFarmPanel();farmPanel.classList.remove("hidden");
  }
  function closeFarmPanel(){farmPanel.classList.add("hidden");}
  function plantCrop(type){
    const definition=cropTypes[type],plot=currentFarmPlot;
    if(!canUseFarmPlot||!plot||plot.crop||!definition||inventory[definition.seed]<1)return;
    inventory[definition.seed]--;plot.crop=type;plot.plantedAt=totalGameMinutes();plot.visualStage=-1;
    refreshFarmPlotVisual(plot);updateInventoryUI();renderFarmPanel();saveProgress(true);
    showToast(definition.label+" plantada! O crescimento acompanha o relógio do vale.");
  }
  function harvestCrop(){
    const plot=currentFarmPlot;
    if(!canUseFarmPlot||!plot||!plot.crop)return;
    const definition=cropTypes[plot.crop];
    if(totalGameMinutes()-plot.plantedAt<definition.growth){showToast("A plantação ainda não está madura.");return;}
    if(!canCarry(3))return;
    inventory[definition.produce]=Math.min(9999,inventory[definition.produce]+1);
    // Cada colheita devolve uma semente da mesma cultura; há 25% de chance de ganhar outra.
    inventory[definition.seed]=Math.min(9999,inventory[definition.seed]+1);
    const bonusSeed=Math.random()<0.25;
    if(bonusSeed)inventory[definition.seed]=Math.min(9999,inventory[definition.seed]+1);
    plot.crop=null;plot.plantedAt=0;plot.visualStage=-1;refreshFarmPlotVisual(plot);
    updateInventoryUI();renderFarmPanel();saveProgress(true);
    showToast("Colheita realizada · +1 "+definition.label.toLowerCase()+" · +"+(bonusSeed?2:1)+" semente(s)");
  }
  farmActions.addEventListener("click",event=>{
    const plant=event.target.closest("button[data-farm-plant]");
    if(plant)plantCrop(plant.dataset.farmPlant);
    if(event.target.closest("button[data-farm-harvest]"))harvestCrop();
  });
  farmClose.addEventListener("click",closeFarmPanel);
  function openSleepPanel(){
    if(!canUseBed||!builtCabin)return;
    sleepClockLabel.textContent="Agora: Dia "+gameTime.day+" · "+String(gameTime.hour).padStart(2,"0")+":"+String(gameTime.minute).padStart(2,"0");
    sleepPanel.classList.remove("hidden");
  }
  function closeSleepPanel(){sleepPanel.classList.add("hidden");}
  function sleepFor(hours){
    if(!canUseBed||![6,8].includes(hours))return;
    advanceGameMinutes(hours*60);survival.energy=100;
    survival.hunger=Math.max(0,survival.hunger-hours*1.8);
    survival.thirst=Math.max(0,survival.thirst-hours*2.8);
    if(survival.hunger<=0||survival.thirst<=0){
      const unmet=Number(survival.hunger<=0)+Number(survival.thirst<=0);
      survival.health=Math.max(0,survival.health-unmet*hours*0.35);
    }
    closeSleepPanel();updateSurvivalUI(true);saveProgress(true);
    showToast("Você descansou por "+hours+" horas. Vigor recuperado!");updateResourceTarget();
  }
  sleepPanel.addEventListener("click",event=>{const button=event.target.closest("button[data-sleep-hours]");if(button)sleepFor(Number(button.dataset.sleepHours));});
  sleepClose.addEventListener("click",closeSleepPanel);
  function performCurrentInteraction(){
    if(!chestPanel.classList.contains("hidden")||!sleepPanel.classList.contains("hidden")||!farmPanel.classList.contains("hidden")||!animalPanel.classList.contains("hidden")||!kitchenPanel.classList.contains("hidden")||!loomPanel.classList.contains("hidden")||!tanneryPanel.classList.contains("hidden")||!fishingPanel.classList.contains("hidden")||!merchantPanel.classList.contains("hidden")||!villagerPanel.classList.contains("hidden")||!villagersDirectory.classList.contains("hidden"))return;
    if(buildMode){confirmBuilding();return;}
    if(currentResourceTarget)collectCurrentResource();
    else if(currentVillager)openVillagerPanel(currentVillager);
    else if(canUseMerchant)openMerchantPanel();
    else if(canUseTannery)openTanneryPanel();
    else if(canUseFishingSpot)openFishingPanel();
    else if(canUseLoom)openLoomPanel();
    else if(canDrinkWater)drinkWater();
    else if(canUseWorkbench)openCrafting();
    else if(currentWildlifeTarget)shootWildlife();
    else if(canUseFarmPlot)openFarmPanel();
    else if(canUseAnimalPen)openAnimalPanel();
    else if(canUseKitchen)openKitchenPanel();
    else if(canUseLoom)openLoomPanel();
    else if(canUseCabinDoor)toggleCabinDoor();
    else if(canUseBed)openSleepPanel();
    else if(canUseStorageChest)openChest();
    else if(canChopTree)chopCurrentTree();
    else if(currentTreeTarget&&!tools.axe)showToast("Você precisa fabricar um machado na bancada.");
  }
  collectButton.addEventListener("click", performCurrentInteraction);

  const neighborVillageObstacles=[{x:40,z:-90,radius:2.4},{x:51,z:-90,radius:2.4},{x:40,z:-76,radius:2.4},{x:52,z:-76,radius:2.4},{x:61,z:-82,radius:2.1},{x:47,z:-82,radius:1.2}];
  const neighborVillageGroup=new THREE.Group();
  const villageWood=new THREE.MeshStandardMaterial({color:0x89603c,roughness:1});
  const villageLightWood=new THREE.MeshStandardMaterial({color:0xb08350,roughness:1});
  const villageRoof=new THREE.MeshStandardMaterial({color:0x514333,roughness:1});
  const villageStone=new THREE.MeshStandardMaterial({color:0x77766b,roughness:1});
  function addNeighborHouse(x,z,scale=1){
    const house=new THREE.Group();
    const body=new THREE.Mesh(new THREE.BoxGeometry(5*scale,3.1*scale,4.4*scale),villageWood);body.position.y=1.55*scale;house.add(body);
    const roofA=new THREE.Mesh(new THREE.BoxGeometry(3.1*scale,.22*scale,4.9*scale),villageRoof);roofA.position.set(-1.25*scale,3.35*scale,0);roofA.rotation.z=-.58;house.add(roofA);
    const roofB=roofA.clone();roofB.position.x=1.25*scale;roofB.rotation.z=.58;house.add(roofB);
    const door=new THREE.Mesh(new THREE.BoxGeometry(.95*scale,1.9*scale,.12*scale),villageLightWood);door.position.set(0,.95*scale,-2.26*scale);house.add(door);
    const windowMat=new THREE.MeshStandardMaterial({color:0x3c4c48,roughness:.8});
    for(const side of [-1,1]){const windowMesh=new THREE.Mesh(new THREE.BoxGeometry(.7*scale,.72*scale,.1*scale),windowMat);windowMesh.position.set(side*1.55*scale,1.9*scale,-2.26*scale);house.add(windowMesh);}
    house.position.set(x,groundHeight(x,z),z);neighborVillageGroup.add(house);
  }
  addNeighborHouse(40,-90,1);addNeighborHouse(51,-90,.92);addNeighborHouse(40,-76,.92);
  const marketStall=new THREE.Group();
  const counter=new THREE.Mesh(new THREE.BoxGeometry(4.8,.9,1.5),villageLightWood);counter.position.y=.55;marketStall.add(counter);
  for(const x of [-2.1,2.1])for(const z of [-.55,.55]){const post=new THREE.Mesh(new THREE.CylinderGeometry(.07,.08,2.8,6),villageWood);post.position.set(x,1.4,z);marketStall.add(post);}
  const canopy=new THREE.Mesh(new THREE.BoxGeometry(5.2,.18,2.1),new THREE.MeshStandardMaterial({color:0x9b5541,roughness:1}));canopy.position.y=2.85;marketStall.add(canopy);
  marketStall.position.set(52,groundHeight(52,-76),-76);neighborVillageGroup.add(marketStall);
  const well=new THREE.Group();
  const wellBase=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.35,.75,10),villageStone);wellBase.position.y=.38;well.add(wellBase);
  const water=new THREE.Mesh(new THREE.CircleGeometry(1.02,12),new THREE.MeshStandardMaterial({color:0x527f8a,roughness:.3,metalness:.1}));water.rotation.x=-Math.PI/2;water.position.y=.78;well.add(water);
  for(const x of [-.95,.95]){const post=new THREE.Mesh(new THREE.BoxGeometry(.16,2.2,.16),villageWood);post.position.set(x,1.45,0);well.add(post);}
  const beam=new THREE.Mesh(new THREE.BoxGeometry(2.2,.16,.18),villageWood);beam.position.y=2.5;well.add(beam);
  well.position.set(47,groundHeight(47,-82),-82);neighborVillageGroup.add(well);
  const council=new THREE.Group();
  const hallBody=new THREE.Mesh(new THREE.BoxGeometry(6.2,3.6,5.2),villageLightWood);hallBody.position.y=1.8;council.add(hallBody);
  const hallRoof=new THREE.Mesh(new THREE.ConeGeometry(4.8,2.2,4),villageRoof);hallRoof.position.y=4.6;hallRoof.rotation.y=Math.PI/4;council.add(hallRoof);
  const hallDoor=new THREE.Mesh(new THREE.BoxGeometry(1.1,2.1,.14),villageWood);hallDoor.position.set(0,1.05,-2.68);council.add(hallDoor);
  council.position.set(61,groundHeight(61,-82),-82);neighborVillageGroup.add(council);
  const elder=new THREE.Group();
  const elderRobe=new THREE.Mesh(new THREE.CylinderGeometry(.3,.4,1.2,8),new THREE.MeshStandardMaterial({color:0x687b54,roughness:1}));elderRobe.position.y=.8;elder.add(elderRobe);
  const elderHead=new THREE.Mesh(new THREE.SphereGeometry(.24,9,7),new THREE.MeshStandardMaterial({color:0xd7b08d}));elderHead.position.y=1.62;elder.add(elderHead);
  const elderHair=new THREE.Mesh(new THREE.SphereGeometry(.27,8,6),new THREE.MeshStandardMaterial({color:0xb9b2a2,roughness:1}));elderHair.position.set(0,1.77,.02);elder.add(elderHair);
  const elderLabel=makeResourceLabel("ALINA · ANCIÃ","#e6c77d");elderLabel.position.set(0,2.35,0);elderLabel.scale.set(3.1,.78,1);elder.add(elderLabel);
  elder.position.set(34,groundHeight(34,-82),-82);neighborVillageGroup.add(elder);
  scene.add(neighborVillageGroup);
  const chapter3DiscoveryDefs=[{id:"market-square",name:"Praça do Mercado",x:52,z:-76},{id:"village-well",name:"Poço Comunitário",x:47,z:-82},{id:"council-hall",name:"Casa do Conselho",x:61,z:-82}];
  const chapter3Markers=[];
  chapter3DiscoveryDefs.forEach(place=>{const marker=new THREE.Group();const stem=new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,1.5,7),new THREE.MeshStandardMaterial({color:0x806332,roughness:1}));stem.position.y=.75;marker.add(stem);const beacon=new THREE.Mesh(new THREE.OctahedronGeometry(.48,0),new THREE.MeshStandardMaterial({color:0x9bd18c,emissive:0x3d7b39,emissiveIntensity:1,roughness:.35}));beacon.position.y=1.8;marker.add(beacon);marker.position.set(place.x,groundHeight(place.x,place.z),place.z);marker.userData.placeId=place.id;neighborVillageGroup.add(marker);chapter3Markers.push(marker);});
  const chapter2Markers=[];
  const chapter2Messenger=new THREE.Group();
  {const robe=new THREE.Mesh(new THREE.CylinderGeometry(.32,.42,1.2,8),new THREE.MeshStandardMaterial({color:0x52677a,roughness:1}));robe.position.y=.82;chapter2Messenger.add(robe);const head=new THREE.Mesh(new THREE.SphereGeometry(.24,10,8),new THREE.MeshStandardMaterial({color:0xd6ad86}));head.position.y=1.62;chapter2Messenger.add(head);const hood=new THREE.Mesh(new THREE.ConeGeometry(.3,.38,8),new THREE.MeshStandardMaterial({color:0x9a7848}));hood.position.y=1.88;chapter2Messenger.add(hood);chapter2Messenger.position.set(7,groundHeight(7,29),29);scene.add(chapter2Messenger);}
  chapter2DiscoveryDefs.forEach((place,index)=>{const group=new THREE.Group();const stem=new THREE.Mesh(new THREE.CylinderGeometry(.12,.18,1.5,7),new THREE.MeshStandardMaterial({color:0x806332,roughness:1}));stem.position.y=.75;group.add(stem);const beacon=new THREE.Mesh(new THREE.OctahedronGeometry(.48,0),new THREE.MeshStandardMaterial({color:0xf3c66e,emissive:0x9b6422,emissiveIntensity:1.1,roughness:.35}));beacon.position.y=1.8;group.add(beacon);group.position.set(place.x,groundHeight(place.x,place.z),place.z);group.userData.placeId=place.id;scene.add(group);chapter2Markers.push(group);});
  function updateChapter3Exploration(){
    if(!missionState.chapter3ElderMet||missionState.chapter3RewardClaimed||!missionState.chapter2RewardClaimed)return;
    let changed=false;
    chapter3DiscoveryDefs.forEach(place=>{if(missionState.chapter3Discoveries.includes(place.id))return;const distance=Math.hypot(player.x-place.x,player.z-place.z);if(distance<=5.4){missionState.chapter3Discoveries.push(place.id);addChapter3Journal("Visitou "+place.name+". "+place.description);chapter3Markers.find(marker=>marker.userData.placeId===place.id)?.scale.setScalar(.35);showToast("Ponto da vila conhecido: "+place.name);changed=true;}});
    if(changed){saveProgress(true);if(!villagersDirectory.classList.contains("hidden"))renderVillagersDirectory();}
  }
  function updateChapter2Exploration(){
    if(!missionState.chapter2MessengerMet||missionState.chapter2RewardClaimed)return;
    let changed=false;
    chapter2DiscoveryDefs.forEach(place=>{if(missionState.chapter2Discoveries.includes(place.id))return;const distance=Math.hypot(player.x-place.x,player.z-place.z);if(distance<=5.2){missionState.chapter2Discoveries.push(place.id);const label=place.name;addChapter2Journal("Descoberta: "+label+". "+({lookout:"Do alto, o vale revela novos caminhos.", "river-crossing":"Você encontrou uma travessia que conecta as margens.", "old-oak":"O carvalho guarda sinais de antigos viajantes.", "old-road":"Você identificou os vestígios da antiga estrada comercial.", "village-trail":"Você encontrou a trilha que segue para a futura vila."}[place.id]));chapter2Markers.find(marker=>marker.userData.placeId===place.id)?.scale.setScalar(.35);showToast("Novo local descoberto: "+label);changed=true;}});
    if(changed){saveProgress(true);if(!villagersDirectory.classList.contains("hidden"))renderVillagersDirectory();}
  }
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
    updateFishingProgress(delta);
    updateChapter2Exploration();
    updateChapter3Exploration();
    if(villagers.length)updateVillagers(delta);
    if(familyActors.length)updateFamilyActors(delta);
    if(kitchenFire){kitchenFire.time+=delta;const flicker=1+Math.sin(kitchenFire.time*13)*0.12+Math.sin(kitchenFire.time*21)*0.06;kitchenFire.flame.scale.set(1, flicker, 1);kitchenFire.flame.rotation.y=kitchenFire.time*1.8;kitchenFire.flameCore.scale.y=0.9+Math.sin(kitchenFire.time*17)*0.12;kitchenFire.light.intensity=1.25+Math.sin(kitchenFire.time*15)*0.22;}
    gameTimeAccumulator+=delta;
    while(gameTimeAccumulator>=5){gameTimeAccumulator-=5;advanceGameMinutes(1);}
    let forward = 0;
    let strafe = 0;
    if (keys.has("w") || keys.has("arrowup")) forward += 1;
    if (keys.has("s") || keys.has("arrowdown")) forward -= 1;
    if (keys.has("d") || keys.has("arrowright")) strafe += 1;
    if (keys.has("a") || keys.has("arrowleft")) strafe -= 1;
    forward += -joystick.y;
    strafe += joystick.x;
    const length = Math.hypot(forward, strafe);
    if (length > 1) { forward /= length; strafe /= length; }
    const hasMoveInput = length > 0.06;
    const running = (keys.has("shift") || mobileSprintActive) && hasMoveInput && survival.energy > 0.5;
    const speed = running ? 9.2 : 5.3;
    const sin = Math.sin(player.yaw);
    const cos = Math.cos(player.yaw);
    const moveX = (-sin * forward + cos * strafe) * speed * delta;
    const moveZ = (-cos * forward - sin * strafe) * speed * delta;
    if (sleepPanel.classList.contains("hidden") && farmPanel.classList.contains("hidden") && animalPanel.classList.contains("hidden") && kitchenPanel.classList.contains("hidden") && loomPanel.classList.contains("hidden") && tanneryPanel.classList.contains("hidden") && fishingPanel.classList.contains("hidden") && merchantPanel.classList.contains("hidden") && villagerPanel.classList.contains("hidden") && villagersDirectory.classList.contains("hidden") && (moveX || moveZ)) {
      const nextX = player.x + moveX;
      const nextZ = player.z + moveZ;
      if (!isBlocked(nextX, player.z)) player.x = nextX;
      if (!isBlocked(player.x, nextZ)) player.z = nextZ;
    }

    // Necessidades básicas: o tempo afeta fome e sede; movimento exige vigor.
    survival.hunger = Math.max(0, survival.hunger - 0.075 * delta);
    survival.thirst = Math.max(0, survival.thirst - 0.14 * delta);
    const isMoving = hasMoveInput;
    if (isMoving && running) {
      survival.energy = Math.max(0, survival.energy - 6.5 * delta);
    } else if (!isMoving) {
      survival.energy = Math.min(100, survival.energy + 7.5 * delta);
    }

    if (survival.hunger <= 0 || survival.thirst <= 0) {
      const unmetNeeds = Number(survival.hunger <= 0) + Number(survival.thirst <= 0);
      survival.health = Math.max(0, survival.health - (1.15 * unmetNeeds) * delta);
    }

    survivalUiTimer += delta;
    updateSurvivalUI();
    if (buildMode) { buildPreviewTimer += delta; if (buildPreviewTimer >= 0.12) { buildPreviewTimer = 0; updateBuildPreview(); } }
    if(cabinDoorPivot){cabinDoorAngle+=(cabinDoorTarget-cabinDoorAngle)*Math.min(1,delta*8);cabinDoorPivot.rotation.y=cabinDoorAngle;}
    if(chestLid){chestCurrentAngle+=(chestTargetAngle-chestCurrentAngle)*Math.min(1,delta*9);chestLid.rotation.x=chestCurrentAngle;}
    if(builtCabin&&animalActors.length)updateAnimalAnimations(delta);
    if(wildlifeActors.length)updateWildlife(delta);
    if (axeSwingTimer > 0) {
      axeSwingTimer = Math.max(0, axeSwingTimer - delta);
      const swingProgress = 1 - axeSwingTimer / 0.34;
      axeModel.rotation.x = -0.18 + Math.sin(swingProgress * Math.PI) * 1.05;
      axeModel.rotation.z = Math.sin(swingProgress * Math.PI) * 0.22;
    } else {
      axeModel.rotation.x = -0.18;
      axeModel.rotation.z = 0;
    }
    for (let i = fallingTrees.length - 1; i >= 0; i--) {
      const falling = fallingTrees[i];
      falling.elapsed += delta;
      const progress = Math.min(1, falling.elapsed / falling.duration);
      falling.group.rotation.x = progress * (Math.PI / 2);
      if (progress >= 1) {
        scene.remove(falling.group);
        finishTreeFelling(falling.index, falling.groundY);
        fallingTrees.splice(i, 1);
      }
    }
    saveProgress();
    applyCamera();
    interactionScanTimer += delta;
    if (interactionScanTimer >= 0.12) {
      interactionScanTimer = 0;
      updateResourceTarget();
    }
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile ? 1.45 : 1.8));
    renderer.setSize(innerWidth, innerHeight);
  });

  loading.classList.add("done");
  setTimeout(() => loading.remove(), 650);
}
