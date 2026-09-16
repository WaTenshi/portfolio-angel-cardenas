import { useCallback, useEffect, useRef, useState } from "react";
import { FiMaximize, FiPlay, FiRotateCcw, FiX } from "react-icons/fi";
import weaponSheetUrl from "../../assets/dom/fps-weapons.png";
import enemySheetUrl from "../../assets/dom/grell-sheet.png";
import angelPortraitUrl from "../../assets/dom/angel-dialogue-pixel.webp";
import "./domGame.css";

const WIDTH = 320;
const HEIGHT = 200;
const FOV_PLANE = 0.66;
const LEVEL = [
  "1111111111111111",
  "1000000000000001",
  "1022220002222001",
  "1000020002000001",
  "1000020002000001",
  "1000020002222201",
  "1000000000000201",
  "1022222000000201",
  "1000002000000001",
  "1000002222200001",
  "1020000000202201",
  "1020000000200001",
  "1022222000222001",
  "1000000000000031",
  "1000000000000001",
  "1111111111111111",
];

const ENEMY_START = [
  [7.5, 1.5],
  [8.5, 6.5],
  [4.5, 10.5],
  [11.5, 13.5],
  [12.5, 4.5],
  [3.5, 14.5],
];

const PICKUP_START = [
  { x: 6.5, y: 8.5, type: "ammo", active: true },
  { x: 8.5, y: 12.5, type: "health", active: true },
  { x: 7.5, y: 6.5, type: "core", active: true },
];

const STORY = {
  intro: {
    es: [
      "¿Hola? Si estás viendo esto, la terminal funcionó… quizá demasiado bien.",
      "Estaba depurando una ruta imposible cuando el código abrió una puerta. Ahora estoy dentro de DUM.",
      "Este sector compila criaturas a partir de errores que nunca resolví. La puerta verde es el único proceso estable.",
      "Toma el control. Tú mueves; yo intento no convertirme en un segmentation fault.",
    ],
    en: [
      "Hello? If you can see this, the terminal worked… perhaps a little too well.",
      "I was debugging an impossible route when the code opened a door. Now I am inside DUM.",
      "This sector compiles creatures from bugs I never fixed. The green door is the only stable process.",
      "Take control. You move; I will try not to become a segmentation fault.",
    ],
  },
  won: {
    es: [
      "La puerta respondió. Eso nunca es una buena señal.",
      "Sector 01 cerrado. Recuperé un fragmento del repositorio… y una ruta hacia algo mucho más grande.",
      "Si la terminal vuelve a escribir por sí sola, ya sabes qué comando usar.",
    ],
    en: [
      "The door answered. That is never a good sign.",
      "Sector 01 is closed. I recovered a repository fragment… and a route toward something much larger.",
      "If the terminal starts typing by itself again, you know which command to use.",
    ],
  },
  dead: {
    es: [
      "Bueno… técnicamente descubrimos una forma de no hacerlo.",
      "El sector reinició el proceso. Podemos intentarlo otra vez antes de que note que seguimos aquí.",
    ],
    en: [
      "Well… technically, we discovered one way not to do it.",
      "The sector restarted the process. We can try again before it notices we are still here.",
    ],
  },
};

const NOTICE_COPY = {
  objective: { es: "OBJETIVO · RECUPERA EL NÚCLEO", en: "OBJECTIVE · RECOVER ACCESS CORE" },
  ammo: { es: "SIN MUNICIÓN · BUSCA SUMINISTROS", en: "NO AMMO · FIND A SUPPLY CACHE" },
  kill: { es: "AMENAZA DESCOMPILADA", en: "THREAT DECOMPILED" },
  damage: { es: "DAÑO DE INTEGRIDAD", en: "INTEGRITY DAMAGE" },
  health: { es: "INTEGRIDAD RESTAURADA · +30", en: "INTEGRITY RESTORED · +30" },
  core: { es: "NÚCLEO ACTIVO · SALIDA DESBLOQUEADA", en: "ACCESS CORE ONLINE · EXIT UNLOCKED" },
  ammoPickup: { es: "SUMINISTRO DE MUNICIÓN · +12", en: "AMMO CACHE · +12" },
  locked: { es: "SALIDA BLOQUEADA · REQUIERE NÚCLEO", en: "EXIT LOCKED · ACCESS CORE REQUIRED" },
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const tileAt = (x, y) => LEVEL[Math.floor(y)]?.[Math.floor(x)] || "1";
const isWall = (x, y) => tileAt(x, y) !== "0";

function createGameState() {
  return {
    player: { x: 1.5, y: 1.5, angle: 0, health: 100, ammo: 32 },
    enemies: ENEMY_START.map(([x, y], index) => ({ x, y, health: 3, alive: true, attack: index * 0.2 })),
    pickups: PICKUP_START.map((pickup) => ({ ...pickup })),
    kills: 0,
    shots: 0,
    muzzle: 0,
    hurt: 0,
    hitMarker: 0,
    killFlash: 0,
    shake: 0,
    bob: 0,
    moving: false,
    core: false,
    mapOpen: false,
    notice: "objective",
    noticeTimer: 3.5,
    elapsed: 0,
    uiTimer: 0,
    status: "playing",
  };
}

function getHudSnapshot(game) {
  return {
    health: game.player.health,
    ammo: game.player.ammo,
    kills: game.kills,
    elapsed: Math.floor(game.elapsed),
    status: game.status,
    core: game.core,
    mapOpen: game.mapOpen,
    notice: game.noticeTimer > 0 ? game.notice : "",
  };
}

function castRay(player, rayAngle) {
  const rayX = Math.cos(rayAngle);
  const rayY = Math.sin(rayAngle);
  let mapX = Math.floor(player.x);
  let mapY = Math.floor(player.y);
  const deltaX = Math.abs(1 / (rayX || 0.00001));
  const deltaY = Math.abs(1 / (rayY || 0.00001));
  const stepX = rayX < 0 ? -1 : 1;
  const stepY = rayY < 0 ? -1 : 1;
  let sideX = rayX < 0 ? (player.x - mapX) * deltaX : (mapX + 1 - player.x) * deltaX;
  let sideY = rayY < 0 ? (player.y - mapY) * deltaY : (mapY + 1 - player.y) * deltaY;
  let side = 0;

  for (let steps = 0; steps < 40; steps += 1) {
    if (sideX < sideY) {
      sideX += deltaX;
      mapX += stepX;
      side = 0;
    } else {
      sideY += deltaY;
      mapY += stepY;
      side = 1;
    }
    const tile = tileAt(mapX, mapY);
    if (tile !== "0") {
      const rayDistance = side === 0 ? sideX - deltaX : sideY - deltaY;
      return { distance: Math.max(0.001, rayDistance), side, tile };
    }
  }
  return { distance: 40, side: 0, tile: "1" };
}

function lineOfSight(from, to) {
  const total = Math.hypot(to.x - from.x, to.y - from.y);
  const steps = Math.ceil(total * 10);
  for (let index = 1; index < steps; index += 1) {
    const progress = index / steps;
    if (isWall(from.x + (to.x - from.x) * progress, from.y + (to.y - from.y) * progress)) return false;
  }
  return true;
}

function prepareEnemySprites(image) {
  return [0, 77, 154].map((sourceY) => {
    const canvas = document.createElement("canvas");
    canvas.width = 76;
    canvas.height = 77;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, sourceY, 76, 77, 0, 0, 76, 77);
    const pixels = context.getImageData(0, 0, 76, 77);
    for (let index = 0; index < pixels.data.length; index += 4) {
      if (pixels.data[index] < 40 && pixels.data[index + 1] > 180 && pixels.data[index + 2] > 180) pixels.data[index + 3] = 0;
    }
    context.putImageData(pixels, 0, 0);
    return canvas;
  });
}

function drawBillboard(context, image, item, player, zBuffer, scale = 1, verticalOffset = 0) {
  const dirX = Math.cos(player.angle);
  const dirY = Math.sin(player.angle);
  const planeX = -dirY * FOV_PLANE;
  const planeY = dirX * FOV_PLANE;
  const relativeX = item.x - player.x;
  const relativeY = item.y - player.y;
  const inverse = 1 / (planeX * dirY - dirX * planeY);
  const transformX = inverse * (dirY * relativeX - dirX * relativeY);
  const transformY = inverse * (-planeY * relativeX + planeX * relativeY);
  if (transformY <= 0.15) return;

  const screenX = Math.floor((WIDTH / 2) * (1 + transformX / transformY));
  const spriteHeight = Math.min(HEIGHT * 2, Math.abs(Math.floor((HEIGHT / transformY) * scale)));
  const spriteWidth = spriteHeight;
  const startY = Math.floor(HEIGHT / 2 - spriteHeight / 2 + verticalOffset);
  const startX = Math.floor(screenX - spriteWidth / 2);
  const endX = startX + spriteWidth;

  for (let stripe = Math.max(0, startX); stripe < Math.min(WIDTH, endX); stripe += 1) {
    if (transformY >= zBuffer[stripe]) continue;
    const sourceX = Math.floor(((stripe - startX) / spriteWidth) * image.width);
    context.drawImage(image, sourceX, 0, 1, image.height, stripe, startY, 1, spriteHeight);
  }
}

const pickupIcons = new Map();

function getPickupIcon(type) {
  if (pickupIcons.has(type)) return pickupIcons.get(type);
  const icon = document.createElement("canvas");
  icon.width = 24;
  icon.height = 24;
  const iconContext = icon.getContext("2d");
  iconContext.fillStyle = type === "health" ? "#54e49b" : type === "core" ? "#63d8ff" : "#f0b85b";
  if (type === "health") {
    iconContext.fillRect(9, 2, 6, 20);
    iconContext.fillRect(2, 9, 20, 6);
  } else if (type === "core") {
    iconContext.beginPath();
    iconContext.moveTo(12, 1);
    iconContext.lineTo(23, 12);
    iconContext.lineTo(12, 23);
    iconContext.lineTo(1, 12);
    iconContext.closePath();
    iconContext.fill();
    iconContext.fillStyle = "#082532";
    iconContext.fillRect(9, 9, 6, 6);
  } else {
    iconContext.fillRect(5, 4, 14, 17);
    iconContext.fillStyle = "#fff1c2";
    iconContext.fillRect(8, 1, 3, 8);
    iconContext.fillRect(13, 1, 3, 8);
  }
  pickupIcons.set(type, icon);
  return icon;
}

function drawPickup(context, pickup, player, zBuffer, elapsed) {
  const bob = Math.sin(elapsed * 4 + pickup.x) * 2;
  drawBillboard(context, getPickupIcon(pickup.type), pickup, player, zBuffer, pickup.type === "core" ? 0.48 : 0.35, bob);
}

function drawMinimap(context, game) {
  const cell = 2.7;
  const width = LEVEL[0].length * cell;
  const height = LEVEL.length * cell;
  context.fillStyle = "#07100ddd";
  context.fillRect(5, 5, width + 8, height + 8);
  LEVEL.forEach((row, y) => [...row].forEach((tile, x) => {
    if (tile === "0") return;
    context.fillStyle = tile === "3" ? (game.core ? "#54e49b" : "#d95757") : tile === "2" ? "#536158" : "#765a50";
    context.fillRect(9 + x * cell, 9 + y * cell, cell, cell);
  }));
  game.pickups.filter((pickup) => pickup.active).forEach((pickup) => {
    context.fillStyle = pickup.type === "core" ? "#63d8ff" : "#e8c36a";
    context.fillRect(8 + pickup.x * cell, 8 + pickup.y * cell, 2, 2);
  });
  game.enemies.filter((enemy) => enemy.alive).forEach((enemy) => {
    context.fillStyle = "#e35a5a";
    context.fillRect(8 + enemy.x * cell, 8 + enemy.y * cell, 2, 2);
  });
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(9 + game.player.x * cell, 9 + game.player.y * cell, 1.7, 0, Math.PI * 2);
  context.fill();
}

function renderScene(context, game, assets) {
  const { player } = game;
  const ceiling = context.createLinearGradient(0, 0, 0, HEIGHT / 2);
  ceiling.addColorStop(0, "#11151a");
  ceiling.addColorStop(1, "#293039");
  context.fillStyle = ceiling;
  context.fillRect(0, 0, WIDTH, HEIGHT / 2);
  const floor = context.createLinearGradient(0, HEIGHT / 2, 0, HEIGHT);
  floor.addColorStop(0, "#2d302d");
  floor.addColorStop(1, "#121411");
  context.fillStyle = floor;
  context.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT / 2);

  const zBuffer = new Float32Array(WIDTH);
  for (let column = 0; column < WIDTH; column += 1) {
    const cameraX = (2 * column) / WIDTH - 1;
    const rayAngle = player.angle + Math.atan(cameraX * FOV_PLANE);
    const hit = castRay(player, rayAngle);
    const corrected = hit.distance * Math.cos(rayAngle - player.angle);
    zBuffer[column] = corrected;
    const wallHeight = Math.min(HEIGHT * 2, Math.floor(HEIGHT / corrected));
    const start = Math.floor((HEIGHT - wallHeight) / 2);
    const palette = hit.tile === "2" ? [88, 105, 96] : hit.tile === "3" ? (game.core ? [46, 219, 137] : [190, 62, 62]) : [126, 91, 78];
    const shade = clamp(1 - corrected / 15 - hit.side * 0.14, 0.22, 1);
    const mortar = (Math.floor(start + wallHeight / 5) + column) % 17 === 0 ? 0.65 : 1;
    context.fillStyle = `rgb(${palette.map((value) => Math.floor(value * shade * mortar)).join(",")})`;
    context.fillRect(column, start, 1, wallHeight);
  }

  game.pickups.filter((pickup) => pickup.active).forEach((pickup) => drawPickup(context, pickup, player, zBuffer, game.elapsed));
  if (assets.enemyFrames?.length) {
    game.enemies
      .filter((enemy) => enemy.alive)
      .sort((a, b) => distance(b, player) - distance(a, player))
      .forEach((enemy, index) => {
        const frame = assets.enemyFrames[(Math.floor(game.elapsed * 5) + index) % assets.enemyFrames.length];
        drawBillboard(context, frame, enemy, player, zBuffer, 0.9, Math.sin(game.elapsed * 6 + index) * 1.2);
      });
  }

  if (assets.weapon) {
    const sourceX = game.muzzle > 0 ? 128 : 64;
    const recoil = game.muzzle > 0 ? -7 : 0;
    const bobX = game.moving ? Math.sin(game.bob) * 3 : 0;
    const bobY = game.moving ? Math.abs(Math.cos(game.bob)) * 3 : 0;
    context.drawImage(assets.weapon, sourceX, 64, 64, 64, WIDTH / 2 - 72 + bobX, HEIGHT - 132 + recoil + bobY, 144, 144);
  }

  context.strokeStyle = game.muzzle > 0 ? "#fff5c4" : "#dce6d9";
  context.globalAlpha = 0.8;
  context.beginPath();
  context.moveTo(WIDTH / 2 - 4, HEIGHT / 2);
  context.lineTo(WIDTH / 2 + 4, HEIGHT / 2);
  context.moveTo(WIDTH / 2, HEIGHT / 2 - 4);
  context.lineTo(WIDTH / 2, HEIGHT / 2 + 4);
  context.stroke();
  context.globalAlpha = 1;

  if (game.hitMarker > 0) {
    context.strokeStyle = game.killFlash > 0 ? "#ff6b64" : "#ffffff";
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(WIDTH / 2 - 8, HEIGHT / 2 - 8);
    context.lineTo(WIDTH / 2 - 3, HEIGHT / 2 - 3);
    context.moveTo(WIDTH / 2 + 8, HEIGHT / 2 - 8);
    context.lineTo(WIDTH / 2 + 3, HEIGHT / 2 - 3);
    context.moveTo(WIDTH / 2 - 8, HEIGHT / 2 + 8);
    context.lineTo(WIDTH / 2 - 3, HEIGHT / 2 + 3);
    context.moveTo(WIDTH / 2 + 8, HEIGHT / 2 + 8);
    context.lineTo(WIDTH / 2 + 3, HEIGHT / 2 + 3);
    context.stroke();
    context.lineWidth = 1;
  }

  if (game.mapOpen) drawMinimap(context, game);

  if (game.hurt > 0) {
    context.fillStyle = `rgba(180, 25, 25, ${game.hurt * 0.35})`;
    context.fillRect(0, 0, WIDTH, HEIGHT);
  }
  if (game.killFlash > 0) {
    context.fillStyle = `rgba(84, 228, 155, ${game.killFlash * 0.14})`;
    context.fillRect(0, 0, WIDTH, HEIGHT);
  }
}

function StoryPanel({ kind, language, stats, onComplete, onExit }) {
  const [lineIndex, setLineIndex] = useState(0);
  const lines = STORY[kind][language];
  const isEs = language === "es";
  const isLast = lineIndex === lines.length - 1;
  const finalLabel = kind === "intro"
    ? (isEs ? "Entrar al sector" : "Enter the sector")
    : kind === "won"
      ? (isEs ? "Jugar otra vez" : "Play again")
      : (isEs ? "Reintentar" : "Try again");

  return (
    <div className={`dom-story-panel dom-story-${kind}`}>
      <div className="dom-story-portrait" key={`${kind}-${lineIndex}`} aria-hidden="true">
        <img src={angelPortraitUrl} alt="" />
        <span className="dom-story-scanline" />
      </div>
      <div className="dom-story-dialogue">
        <div className="dom-story-meta">
          <span>ÁNGEL / {kind === "intro" ? "INCOMING SIGNAL" : "TRANSMISSION"}</span>
          <span>{String(lineIndex + 1).padStart(2, "0")} / {String(lines.length).padStart(2, "0")}</span>
        </div>
        <p key={`${kind}-${lineIndex}-copy`} aria-live="polite">{lines[lineIndex]}</p>
        {kind !== "intro" && <small>{stats.kills}/{ENEMY_START.length} KILLS · {stats.elapsed}s</small>}
        <div className="dom-story-actions">
          {kind === "intro" && !isLast && <button className="dom-story-secondary" type="button" onClick={onComplete}>{isEs ? "Omitir intro" : "Skip intro"}</button>}
          {kind !== "intro" && <button className="dom-story-secondary" type="button" onClick={onExit}>{isEs ? "Volver al portfolio" : "Back to portfolio"}</button>}
          <button className="dom-story-primary" type="button" onClick={() => isLast ? onComplete() : setLineIndex((index) => index + 1)}>
            {isLast ? (kind === "intro" ? <FiPlay /> : <FiRotateCcw />) : null}
            {isLast ? finalLabel : (isEs ? "Continuar" : "Continue")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DomGame({ onClose, language }) {
  const dialogRef = useRef(null);
  const shellRef = useRef(null);
  const canvasRef = useRef(null);
  const closeRef = useRef(null);
  const gameRef = useRef(createGameState());
  const keysRef = useRef(new Set());
  const assetsRef = useRef({ weapon: null, enemyFrames: [] });
  const [started, setStarted] = useState(false);
  const [revision, setRevision] = useState(0);
  const [hud, setHud] = useState({ health: 100, ammo: 32, kills: 0, elapsed: 0, status: "playing", core: false, mapOpen: false, notice: "objective" });
  const isEs = language === "es";

  const restart = useCallback(() => {
    const nextGame = createGameState();
    gameRef.current = nextGame;
    setHud(getHudSnapshot(nextGame));
    setRevision((value) => value + 1);
    setStarted(true);
  }, []);

  const shoot = useCallback(() => {
    const state = gameRef.current;
    if (!started || state.status !== "playing" || state.muzzle > 0) return;
    if (state.player.ammo <= 0) {
      state.notice = "ammo";
      state.noticeTimer = 1.2;
      state.shake = 0.04;
      setHud(getHudSnapshot(state));
      return;
    }
    state.player.ammo -= 1;
    state.shots += 1;
    state.muzzle = 0.12;
    state.shake = 0.09;
    const wallDistance = castRay(state.player, state.player.angle).distance;
    let target = null;
    let targetDistance = Infinity;
    state.enemies.forEach((enemy) => {
      if (!enemy.alive || !lineOfSight(state.player, enemy)) return;
      const enemyDistance = distance(enemy, state.player);
      const angle = Math.atan2(enemy.y - state.player.y, enemy.x - state.player.x);
      const difference = Math.abs(Math.atan2(Math.sin(angle - state.player.angle), Math.cos(angle - state.player.angle)));
      if (difference < 0.055 + 0.19 / enemyDistance && enemyDistance < wallDistance + 0.2 && enemyDistance < targetDistance) {
        target = enemy;
        targetDistance = enemyDistance;
      }
    });
    if (target) {
      target.health -= 1;
      state.hitMarker = 0.16;
      if (target.health <= 0) {
        target.alive = false;
        state.kills += 1;
        state.killFlash = 0.28;
        state.shake = 0.18;
        state.notice = "kill";
        state.noticeTimer = 0.9;
        if (state.kills % 2 === 0) state.pickups.push({ x: target.x, y: target.y, type: "ammo", active: true });
      }
    }
    setHud(getHudSnapshot(state));
  }, [started]);

  const toggleMap = useCallback(() => {
    const state = gameRef.current;
    state.mapOpen = !state.mapOpen;
    setHud(getHudSnapshot(state));
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    const handleCancel = (event) => {
      event.preventDefault();
      onClose();
    };
    dialog?.addEventListener("cancel", handleCancel);
    requestAnimationFrame(() => closeRef.current?.focus());
    const weapon = new Image();
    weapon.src = weaponSheetUrl;
    weapon.onload = () => { assetsRef.current.weapon = weapon; };
    const enemy = new Image();
    enemy.src = enemySheetUrl;
    enemy.onload = () => { assetsRef.current.enemyFrames = prepareEnemySprites(enemy); };
    return () => {
      dialog?.removeEventListener("cancel", handleCancel);
      if (dialog?.open) dialog.close();
    };
  }, [onClose]);

  useEffect(() => {
    const keyDown = (event) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
      if (event.code === "Escape") onClose();
      if (event.code === "Space") shoot();
      if (event.code === "KeyM" && !event.repeat) toggleMap();
      keysRef.current.add(event.code);
    };
    const keyUp = (event) => keysRef.current.delete(event.code);
    const mouseMove = (event) => {
      if (document.pointerLockElement === canvasRef.current) gameRef.current.player.angle += event.movementX * 0.0025;
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
      window.removeEventListener("mousemove", mouseMove);
    };
  }, [onClose, shoot, toggleMap]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    context.imageSmoothingEnabled = false;
    let animationFrame;
    let previous = performance.now();

    const frame = (now) => {
      const state = gameRef.current;
      const delta = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      if (started && state.status === "playing") {
        const keys = keysRef.current;
        const player = state.player;
        const forward = (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0) - (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0);
        const strafe = (keys.has("KeyD") ? 1 : 0) - (keys.has("KeyA") ? 1 : 0);
        const turn = (keys.has("ArrowRight") ? 1 : 0) - (keys.has("ArrowLeft") ? 1 : 0);
        state.moving = forward !== 0 || strafe !== 0;
        if (state.moving) state.bob += delta * 10;
        player.angle += turn * delta * 1.9;
        const moveSpeed = delta * 2.35;
        const moveX = (Math.cos(player.angle) * forward + Math.cos(player.angle + Math.PI / 2) * strafe) * moveSpeed;
        const moveY = (Math.sin(player.angle) * forward + Math.sin(player.angle + Math.PI / 2) * strafe) * moveSpeed;
        if (!isWall(player.x + moveX * 1.5, player.y)) player.x += moveX;
        if (!isWall(player.x, player.y + moveY * 1.5)) player.y += moveY;

        state.enemies.forEach((enemy) => {
          if (!enemy.alive) return;
          const enemyDistance = distance(enemy, player);
          enemy.attack = Math.max(0, enemy.attack - delta);
          if (enemyDistance < 7 && lineOfSight(enemy, player)) {
            if (enemyDistance > 0.72) {
              const speed = delta * 0.52;
              const x = ((player.x - enemy.x) / enemyDistance) * speed;
              const y = ((player.y - enemy.y) / enemyDistance) * speed;
              if (!isWall(enemy.x + x, enemy.y)) enemy.x += x;
              if (!isWall(enemy.x, enemy.y + y)) enemy.y += y;
            } else if (enemy.attack <= 0) {
              player.health = Math.max(0, player.health - 8);
              state.hurt = 1;
              state.shake = 0.28;
              state.notice = "damage";
              state.noticeTimer = 0.65;
              enemy.attack = 0.8;
              setHud(getHudSnapshot(state));
            }
          }
        });

        state.pickups.forEach((pickup) => {
          if (!pickup.active || distance(pickup, player) > 0.55) return;
          pickup.active = false;
          if (pickup.type === "health") {
            player.health = Math.min(100, player.health + 30);
            state.notice = "health";
          } else if (pickup.type === "core") {
            state.core = true;
            state.notice = "core";
            state.killFlash = 0.45;
          } else {
            player.ammo += 12;
            state.notice = "ammoPickup";
          }
          state.noticeTimer = 1.6;
          setHud(getHudSnapshot(state));
        });

        const previousStatus = state.status;
        if (player.health <= 0) state.status = "dead";
        const facingExit = tileAt(player.x + Math.cos(player.angle) * 0.6, player.y + Math.sin(player.angle) * 0.6) === "3";
        if (facingExit && state.core) state.status = "won";
        else if (facingExit && state.noticeTimer <= 0) {
          state.notice = "locked";
          state.noticeTimer = 1.4;
          state.shake = 0.08;
        }
        state.muzzle = Math.max(0, state.muzzle - delta);
        state.hurt = Math.max(0, state.hurt - delta * 2.4);
        state.hitMarker = Math.max(0, state.hitMarker - delta);
        state.killFlash = Math.max(0, state.killFlash - delta * 1.7);
        state.shake = Math.max(0, state.shake - delta * 2.8);
        state.noticeTimer = Math.max(0, state.noticeTimer - delta);
        state.elapsed += delta;
        state.uiTimer += delta;
        if (state.uiTimer >= 0.15 || state.status !== previousStatus) {
          state.uiTimer = 0;
          setHud(getHudSnapshot(state));
        }
      }
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.fillStyle = "#080b09";
      context.fillRect(0, 0, WIDTH, HEIGHT);
      context.save();
      if (state.shake > 0) context.translate((Math.random() - 0.5) * state.shake * 12, (Math.random() - 0.5) * state.shake * 8);
      renderScene(context, state, assetsRef.current);
      context.restore();
      animationFrame = requestAnimationFrame(frame);
    };
    animationFrame = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationFrame);
  }, [revision, started]);

  const hold = (code) => ({
    onPointerDown: (event) => { event.preventDefault(); keysRef.current.add(code); },
    onPointerUp: () => keysRef.current.delete(code),
    onPointerCancel: () => keysRef.current.delete(code),
    onPointerLeave: () => keysRef.current.delete(code),
  });

  return (
    <dialog ref={dialogRef} className="dom-overlay" aria-labelledby="dom-title">
      <section ref={shellRef} className="dom-game-shell">
        <header className="dom-header">
          <div><span>SECRET COMMAND / 01</span><h2 id="dom-title">DUM</h2></div>
          <div className="dom-header-actions">
            <button type="button" onClick={() => shellRef.current?.requestFullscreen?.()} aria-label={isEs ? "Pantalla completa" : "Fullscreen"}><FiMaximize /></button>
            <button ref={closeRef} type="button" onClick={onClose} aria-label={isEs ? "Cerrar juego" : "Close game"}><FiX /></button>
          </div>
        </header>

        <div className="dom-screen-wrap">
          <canvas
            ref={canvasRef}
            className="dom-canvas"
            width={WIDTH}
            height={HEIGHT}
            tabIndex={0}
            aria-label={isEs ? "Vista del nivel uno de DUM" : "DUM level one view"}
            onClick={(event) => {
              if (started && gameRef.current.status === "playing") {
                event.currentTarget.requestPointerLock?.();
                shoot();
              }
            }}
          />

          {!started && (
            <StoryPanel kind="intro" language={language} stats={hud} onComplete={() => setStarted(true)} onExit={onClose} />
          )}

          {started && hud.status !== "playing" && (
            <StoryPanel kind={hud.status} language={language} stats={hud} onComplete={restart} onExit={onClose} />
          )}

          {started && hud.status === "playing" && (
            <>
              <div className={hud.core ? "dom-objective is-complete" : "dom-objective"}>
                <i aria-hidden="true" />
                <span>{hud.core ? (isEs ? "NÚCLEO ACTIVO · BUSCA LA SALIDA" : "CORE ONLINE · FIND THE EXIT") : (isEs ? "OBJETIVO · RECUPERA EL NÚCLEO" : "OBJECTIVE · RECOVER THE CORE")}</span>
              </div>
              {hud.notice && <div className="dom-notice" role="status">{NOTICE_COPY[hud.notice]?.[language] || hud.notice}</div>}
            </>
          )}

          <div className="dom-crosshair" aria-hidden="true" />
          <div className="dom-touch-controls" aria-label={isEs ? "Controles táctiles" : "Touch controls"}>
            <div className="dom-dpad">
              <button type="button" {...hold("ArrowUp")} aria-label={isEs ? "Avanzar" : "Move forward"}>▲</button>
              <button type="button" {...hold("ArrowLeft")} aria-label={isEs ? "Girar izquierda" : "Turn left"}>◀</button>
              <button type="button" {...hold("ArrowDown")} aria-label={isEs ? "Retroceder" : "Move backward"}>▼</button>
              <button type="button" {...hold("ArrowRight")} aria-label={isEs ? "Girar derecha" : "Turn right"}>▶</button>
            </div>
            <div className="dom-touch-actions">
              <button className="dom-map" type="button" onClick={toggleMap} aria-pressed={hud.mapOpen}>MAP</button>
              <button className="dom-fire" type="button" onPointerDown={(event) => { event.preventDefault(); shoot(); }} aria-label={isEs ? "Disparar" : "Fire"}>FIRE</button>
            </div>
          </div>
        </div>

        <div className="dom-hud" aria-live="polite">
          <div><span>HEALTH</span><strong>{hud.health}%</strong></div>
          <div><span>AMMO</span><strong>{String(hud.ammo).padStart(2, "0")}</strong></div>
          <div className="dom-hud-brand"><b>DUM</b><small>{hud.core ? "CORE ONLINE" : "CORE MISSING"}</small></div>
          <div><span>KILLS</span><strong>{hud.kills}/{ENEMY_START.length}</strong></div>
          <div><span>TIME</span><strong>{hud.elapsed}s</strong></div>
        </div>

        <footer className="dom-help">
          <span>WASD {isEs ? "mover" : "move"}</span>
          <span>← → {isEs ? "girar" : "turn"}</span>
          <span>SPACE / CLICK {isEs ? "disparar" : "fire"}</span>
          <span>M {isEs ? "mapa" : "map"}</span>
          <span>ESC {isEs ? "salir" : "exit"}</span>
        </footer>
      </section>
    </dialog>
  );
}
