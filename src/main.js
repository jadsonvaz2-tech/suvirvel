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
  cabbages: document.getElementById("cabbages-count")
};
let toastTimer = 0;
const survivalUI = {
  status: document.getElementById("survival-status"),
  health: { value: document.getElementById("health-value"), fill: document.getElementById("health-fill") },
  hunger: { value: document.getElementById("hunger-value"), fill: document.getElementById("hunger-fill") },
  thirst: { value: document.getElementById("thirst-value"), fill: document.getElementById("thirst-fill") },
  energy: { value: document.getElementById("energy-value"), fill: document.getElementById("energy-fill") }
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
  const cropTypes = {
    wheat:{label:"Trigo",seed:"wheatSeeds",produce:"wheat",growth:360,hunger:20},
    carrots:{label:"Cenoura",seed:"carrotSeeds",produce:"carrots",growth:480,hunger:28},
    cabbages:{label:"Repolho",seed:"cabbageSeeds",produce:"cabbages",growth:600,hunger:34}
  };
  const totalGameMinutes=()=>((gameTime.day-1)*1440)+(gameTime.hour*60)+gameTime.minute;
  const farmPlots=[0,1,2].map((index)=>{
    const id="farm-plot-"+(index+1), prior=saved?.farmPlots?.find(item=>item.id===id);
    return {id,crop:prior&&Object.hasOwn(cropTypes,prior.crop)?prior.crop:null,plantedAt:prior&&Number.isSafeInteger(prior.plantedAt)?Math.max(0,prior.plantedAt):0,localX:5.1,localZ:(index-1)*2.2,group:null,cropGroup:null,visualStage:-1,x:0,z:0};
  });
  let currentFarmPlot=null,canUseFarmPlot=false;
  let gameTimeAccumulator=0;
  function updateGameClockUI(){gameClockUI.textContent="DIA "+gameTime.day+" · "+String(gameTime.hour).padStart(2,"0")+":"+String(gameTime.minute).padStart(2,"0");}
  function advanceGameMinutes(minutes){
    const total=gameTime.hour*60+gameTime.minute+minutes;
    gameTime.day+=Math.floor(total/1440);
    const wrapped=total%1440;
    gameTime.hour=Math.floor(wrapped/60);gameTime.minute=wrapped%60;updateGameClockUI();
    refreshFarmVisuals();
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
    if (collectedResources.has(id)) return;
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

  const stoneSpot = resourcePosition(1.55, 3.65);
  addResourceNode("stone-cluster-01", "stones", "Pedras", 4, stoneSpot.x, stoneSpot.z, "#bfc6c2", (root) => {
    const material = new THREE.MeshStandardMaterial({ color: 0x969b91, roughness: 1, flatShading: true });
    const geometry = new THREE.DodecahedronGeometry(0.48, 0);
    [[-0.42,0.35,0,1.05],[0.2,0.32,0.12,0.9],[0.48,0.28,-0.36,0.82],[-0.12,0.25,-0.5,0.88],[0.03,0.66,-0.14,0.72]].forEach(([x,y,z,s]) => {
      const mesh = new THREE.Mesh(geometry,material);
      mesh.position.set(x,y,z);
      mesh.scale.set(s*1.15,s*0.82,s);
      root.add(mesh);
    });
  });

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

  let builtCabin = saved?.builtCabin ?? null;
  // Primeira construção: cabana de madeira com prévia translúcida.
  let buildMode = false;
  let buildRotation = 0;
  let buildPreview = null;
  let buildPreviewValid = false;
  let buildPreviewReason = "Mova-se para escolher o local.";
  let buildPreviewTimer = 0;
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
      const wx=builtCabin.x+plot.localX*Math.cos(builtCabin.yaw)+plot.localZ*Math.sin(builtCabin.yaw);
      const wz=builtCabin.z-plot.localX*Math.sin(builtCabin.yaw)+plot.localZ*Math.cos(builtCabin.yaw);
      plot.x=wx;plot.z=wz;plot.group=group;plot.visualStage=-1;
      group.position.set(wx,groundHeight(wx,wz),wz);group.rotation.y=builtCabin.yaw;scene.add(group);
      refreshFarmPlotVisual(plot);
    }
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
    createFarmPlots();
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
  function updateBuildPreview() {
    if (!buildMode || !buildPreview) return;
    const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw);
    const x=Math.round((player.x+fx*8.2)*2)/2,z=Math.round((player.z+fz*8.2)*2)/2;
    const yaw=player.yaw+Math.PI+buildRotation;
    buildPreview.position.set(x,groundHeight(x,z),z); buildPreview.rotation.y=yaw;
    buildPreviewReason=cabinFootprintValid(x,z,yaw); buildPreviewValid=!buildPreviewReason;
    setBuildPreviewAppearance(buildPreviewValid);
    buildingStatus.textContent=buildPreviewValid?"Local adequado · confirme a construção":buildPreviewReason;
    buildingStatus.classList.toggle("invalid",!buildPreviewValid);
    buildingConfirm.disabled=!buildPreviewValid || inventory.wood<12 || inventory.branches<8 || Boolean(builtCabin);
  }
  function startBuilding() {
    if (builtCabin) { showToast("Você já construiu sua primeira cabana."); return; }
    buildMode=true; buildingPanel.classList.remove("hidden");
    if (!buildPreview) { buildPreview=cabinGhost(createCabinModel()); scene.add(buildPreview); }
    updateBuildPreview(); updateInventoryUI();
  }
  function stopBuilding() {
    buildMode=false; buildingPanel.classList.add("hidden");
    if (buildPreview) { scene.remove(buildPreview); buildPreview=null; }
    buildPreviewValid=false;
  }
  function rotateBuilding() {
    if (!buildMode) return;
    buildRotation=(buildRotation+Math.PI/4)%(Math.PI*2); updateBuildPreview();
  }
  function confirmBuilding() {
    if (!buildMode || builtCabin) return;
    updateBuildPreview();
    if (!buildPreviewValid) { showToast(buildPreviewReason); return; }
    if (inventory.wood<12 || inventory.branches<8) { showToast("Faltam materiais: 12 madeiras e 8 galhos."); updateInventoryUI(); return; }
    const position=buildPreview.position,yaw=buildPreview.rotation.y;
    inventory.wood-=12; inventory.branches-=8; builtCabin={x:position.x,z:position.z,yaw};
    placeCabin();
    stopBuilding(); updateInventoryUI(); saveProgress(true); showToast("Cabana construída! Seu primeiro abrigo está pronto.");
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
    if (riverDistance(x, z) < 11) continue;
    if (Math.abs(x) > 96 || Math.abs(z) > 96) continue;
    treeSpots.push({ x, z, scale: 0.72 + random() * 0.76, turn: random() * Math.PI * 2 });
  }
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
    energy: saved?.energy ?? 100
  };
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
    cabbages: saved?.inventory?.cabbages ?? 0
  };
  const tools = { axe: saved?.tools?.axe === true };
  const storage = { branches:saved?.storage?.branches??0, stones:saved?.storage?.stones??0, berries:saved?.storage?.berries??0, wood:saved?.storage?.wood??0 };
  let canUseCabinDoor=false, canUseStorageChest=false, canUseBed=false;
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
    let label = "ESTÁVEL";
    let mood = "";
    if (survival.health <= 0) { label = "DESMAIADO"; mood = "danger"; }
    else if (survival.health < 25 || survival.hunger < 12 || survival.thirst < 12) { label = "CRÍTICO"; mood = "danger"; }
    else if (survival.hunger < 25 || survival.thirst < 25 || survival.energy < 20) { label = "ATENÇÃO"; mood = "warning"; }
    survivalUI.status.textContent = label;
    survivalUI.status.className = mood;
  }
  updateSurvivalUI(true);
  function updateInventoryUI() {
    for (const key of Object.keys(inventoryUI)) inventoryUI[key].textContent=String(inventory[key]??0);
    for(const button of inventoryPanel.querySelectorAll("[data-eat-crop]")){
      const type=button.dataset.eatCrop,definition=cropTypes[type];
      button.disabled=!definition||inventory[definition.produce]<1||survival.hunger>=99.5;
    }
    axeCountUI.textContent = tools.axe ? "1" : "0";
    const canEatBerry = inventory.berries > 0 && survival.hunger < 99.5;
    eatBerryButton.disabled = !canEatBerry;
    workbenchStatus.textContent = tools.axe ? "Machado fabricado" : "Machado ainda não fabricado";
    buildingMaterials.textContent = "Madeira: " + inventory.wood + "/12 · Galhos: " + inventory.branches + "/8";
    buildingConfirm.disabled = !buildMode || !buildPreviewValid || Boolean(builtCabin) || inventory.wood < 12 || inventory.branches < 8;
    craftAxeButton.disabled = tools.axe || inventory.branches < 3 || inventory.stones < 2;
    craftAxeButton.textContent = tools.axe ? "MACHADO FABRICADO" : "FABRICAR MACHADO";
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
  inventoryPanel.addEventListener("click",event=>{
    const button=event.target.closest("button[data-eat-crop]");
    if(button)eatCrop(button.dataset.eatCrop);
  });
  function openCrafting() {
    craftingPanel.classList.remove("hidden");
    updateInventoryUI();
  }
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
        health: safeStat(saved.health),
        hunger: safeStat(saved.hunger),
        thirst: safeStat(saved.thirst),
        energy: safeStat(saved.energy),
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
          cabbages: safeCount(saved.inventory?.cabbages)
        },
        farmPlots: Array.isArray(saved.farmPlots) ? saved.farmPlots.filter(item=>item&&["farm-plot-1","farm-plot-2","farm-plot-3"].includes(item.id)&&Object.hasOwn({wheat:1,carrots:1,cabbages:1},item.crop)&&Number.isSafeInteger(item.plantedAt)&&item.plantedAt>=0).map(item=>({id:item.id,crop:item.crop,plantedAt:item.plantedAt})) : [],
        tools: { axe: saved.tools?.axe === true },
        storage: { branches:safeCount(saved.storage?.branches), stones:safeCount(saved.storage?.stones), berries:safeCount(saved.storage?.berries), wood:safeCount(saved.storage?.wood) },
        cabinDoorOpen: saved.cabinDoorOpen === true,
        gameTime: {
          day: Number.isSafeInteger(saved.gameTime?.day) ? THREE.MathUtils.clamp(saved.gameTime.day,1,999999) : 1,
          hour: Number.isInteger(saved.gameTime?.hour) ? THREE.MathUtils.clamp(saved.gameTime.hour,0,23) : 8,
          minute: Number.isInteger(saved.gameTime?.minute) ? THREE.MathUtils.clamp(saved.gameTime.minute,0,59) : 0
        },
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
          ? saved.collectedResources.filter((id) => ["branch-pile-01", "branch-pile-02", "branch-pile-03", "branch-pile-04", "stone-cluster-01", "berry-bush-01"].includes(id))
          : [],
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
        health: survival.health, hunger: survival.hunger, thirst: survival.thirst, energy: survival.energy,
        inventory: { ...inventory },
        farmPlots: farmPlots.map(({id,crop,plantedAt})=>({id,crop,plantedAt})),
        tools: { ...tools },
        storage: { ...storage },
        cabinDoorOpen,
        gameTime: { ...gameTime },
        resourceBase: { ...resourceBase },
        collectedResources: [...collectedResources],
        felledTrees: [...felledTrees],
        treeHits: Object.fromEntries(treeHitCounts),
        builtCabin: builtCabin ? { ...builtCabin } : null
      }));
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
    if (riverDistance(x, z) < 8.2) return true;
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
    if (builtCabin) {
      const dx=x-builtCabin.x,dz=z-builtCabin.z;
      const lx=dx*Math.cos(builtCabin.yaw)-dz*Math.sin(builtCabin.yaw),lz=dx*Math.sin(builtCabin.yaw)+dz*Math.cos(builtCabin.yaw);
      if(Math.abs(lx+1.15)<0.78 && Math.abs(lz-0.48)<1.12)return true;
      for(const plot of farmPlots){const pdx=x-plot.x,pdz=z-plot.z,localX=pdx*Math.cos(builtCabin.yaw)-pdz*Math.sin(builtCabin.yaw),localZ=pdx*Math.sin(builtCabin.yaw)+pdz*Math.cos(builtCabin.yaw);if(Math.abs(localX-plot.localX)<1.02&&Math.abs(localZ-plot.localZ)<1.02)return true;}
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

    const bankDistance = riverDistance(player.x, player.z);
    canDrinkWater = !match && bankDistance >= 8.2 && bankDistance <= 12.4 && survival.thirst < 99.5;
    const benchDistance = Math.hypot(workbenchPosition.x - player.x, workbenchPosition.z - player.z);
    canUseWorkbench = !match && !canDrinkWater && benchDistance <= 5.2;
    canUseCabinDoor=false; canUseStorageChest=false; canUseBed=false;canUseFarmPlot=false;currentFarmPlot=null;
    if(builtCabin && !match && !canDrinkWater && !canUseWorkbench){
      const dx=player.x-builtCabin.x,dz=player.z-builtCabin.z;
      const lx=dx*Math.cos(builtCabin.yaw)-dz*Math.sin(builtCabin.yaw);
      const lz=dx*Math.sin(builtCabin.yaw)+dz*Math.cos(builtCabin.yaw);
      const inside=Math.abs(lx)<1.95 && Math.abs(lz)<2.18;
      canUseCabinDoor=Math.hypot(lx,lz+2.8)<3.45 && Math.abs(lx)<1.55;
      canUseBed=inside && Math.hypot(lx+1.15,lz-0.48)<1.95;
      canUseStorageChest=inside && Math.hypot(lx-1.18,lz-1.15)<2.15;
    }
    if(builtCabin&&!match&&!canDrinkWater&&!canUseWorkbench){
      for(const plot of farmPlots){const distance=Math.hypot(player.x-plot.x,player.z-plot.z);if(distance<3.25&&(!currentFarmPlot||distance<Math.hypot(player.x-currentFarmPlot.x,player.z-currentFarmPlot.z)))currentFarmPlot=plot;}
      canUseFarmPlot=Boolean(currentFarmPlot);
    }
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
    currentTreeTarget = !match && !canDrinkWater && !canUseWorkbench && !canUseFarmPlot ? treeMatch : null;
    canChopTree = Boolean(currentTreeTarget && tools.axe);
    currentResourceTarget = match;
    const hasInteraction = Boolean(match) || canDrinkWater || canUseWorkbench || canUseFarmPlot || canUseCabinDoor || canUseBed || canUseStorageChest || Boolean(currentTreeTarget);
    interactionPrompt.classList.toggle("hidden", !hasInteraction);
    collectButton.classList.toggle("hidden", !hasInteraction || !isMobile);

    if (match) {
      interactionType.textContent = "RECURSO AO ALCANCE";
      interactionName.textContent = match.label + " · " + match.amount;
      interactionVerb.textContent = "recolher";
      collectButton.textContent = "RECOLHER";
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
    } else if (currentTreeTarget) {
      interactionType.textContent = "ÁRVORE";
      interactionName.textContent = canChopTree ? "Madeira · " + (3 - (treeHitCounts.get(currentTreeTarget.index) ?? 0)) + " golpes" : "Machado necessário";
      interactionVerb.textContent = canChopTree ? "cortar árvore" : "fabricar um machado na bancada";
      collectButton.textContent = canChopTree ? "CORTAR ÁRVORE" : "PRECISA DE MACHADO";
    }
  }
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
    if (!node || collectedResources.has(node.id)) return;
    inventory[node.itemKey] = Math.min(9999, inventory[node.itemKey] + node.amount);
    collectedResources.add(node.id);
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
    inventory[definition.produce]=Math.min(9999,inventory[definition.produce]+1);
    plot.crop=null;plot.plantedAt=0;plot.visualStage=-1;refreshFarmPlotVisual(plot);
    updateInventoryUI();renderFarmPanel();saveProgress(true);
    showToast("Colheita realizada · +1 "+definition.label.toLowerCase());
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
    if(!chestPanel.classList.contains("hidden")||!sleepPanel.classList.contains("hidden")||!farmPanel.classList.contains("hidden"))return;
    if(buildMode){confirmBuilding();return;}
    if(currentResourceTarget)collectCurrentResource();
    else if(canDrinkWater)drinkWater();
    else if(canUseWorkbench)openCrafting();
    else if(canUseFarmPlot)openFarmPanel();
    else if(canUseCabinDoor)toggleCabinDoor();
    else if(canUseBed)openSleepPanel();
    else if(canUseStorageChest)openChest();
    else if(canChopTree)chopCurrentTree();
    else if(currentTreeTarget&&!tools.axe)showToast("Você precisa fabricar um machado na bancada.");
  }
  collectButton.addEventListener("click", performCurrentInteraction);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
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
    if (sleepPanel.classList.contains("hidden") && farmPanel.classList.contains("hidden") && (moveX || moveZ)) {
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
