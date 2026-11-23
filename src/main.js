const THREE_MODULE_URL = "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

const game = document.getElementById("game");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const joystickWrap = document.getElementById("joystick-wrap");
const joystickBase = document.getElementById("joystick-base");
const joystickThumb = document.getElementById("joystick-thumb");
const sprintButton = document.getElementById("sprint-button");
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
  treeSpots.forEach((tree, index) => {
    const y = groundHeight(tree.x, tree.z);
    const s = tree.scale;
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
    const tint = new THREE.Color().setHSL(0.29 + random() * 0.035, 0.32, 0.22 + random() * 0.12);
    crownMesh.setColorAt(index, tint);
    crownTopMesh.setColorAt(index, tint.clone().multiplyScalar(1.12));
  });
  scene.add(trunkMesh, crownMesh, crownTopMesh);

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
  const saved = readSave();
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
      return {
        x: saved.x,
        z: saved.z,
        yaw: Number.isFinite(saved.yaw) ? saved.yaw : 0,
        pitch: Number.isFinite(saved.pitch) ? THREE.MathUtils.clamp(saved.pitch, -1.15, 1.15) : -0.04,
        health: safeStat(saved.health),
        hunger: safeStat(saved.hunger),
        thirst: safeStat(saved.thirst),
        energy: safeStat(saved.energy)
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
        health: survival.health, hunger: survival.hunger, thirst: survival.thirst, energy: survival.energy
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
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
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
    for (const tree of treeSpots) {
      const dx = x - tree.x;
      const dz = z - tree.z;
      if (dx * dx + dz * dz < 2.0) return true;
    }
    return false;
  }

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
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
    if (moveX || moveZ) {
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
      survival.energy = Math.max(0, survival.energy - 14 * delta);
    } else if (isMoving) {
      survival.energy = Math.max(0, survival.energy - 0.45 * delta);
    } else {
      survival.energy = Math.min(100, survival.energy + 9 * delta);
    }

    if (survival.hunger <= 0 || survival.thirst <= 0) {
      const unmetNeeds = Number(survival.hunger <= 0) + Number(survival.thirst <= 0);
      survival.health = Math.max(0, survival.health - (1.15 * unmetNeeds) * delta);
    }

    survivalUiTimer += delta;
    updateSurvivalUI();
    saveProgress();
    applyCamera();
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
