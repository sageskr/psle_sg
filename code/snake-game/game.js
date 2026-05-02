(() => {
  'use strict';

  // ── Constants ──
  const CELL = 20;
  const MAX_LEVEL = 10;
  const MAX_SPEED = 5;
  const SCORE_PER_APPLE = 0.5;
  const BASE_TARGET = 10;
  const BASE_COLS = 20;
  const BASE_ROWS = 20;
  const COLS_PER_LEVEL = 2;
  const ROWS_PER_LEVEL = 2;

  // ── DOM ──
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const hudLevel = document.getElementById('hud-level');
  const hudScore = document.getElementById('hud-score');
  const hudTarget = document.getElementById('hud-target');
  const hudSpeed = document.getElementById('hud-speed');

  const startOverlay = document.getElementById('start-overlay');
  const levelOverlay = document.getElementById('level-overlay');
  const gameoverOverlay = document.getElementById('gameover-overlay');
  const victoryOverlay = document.getElementById('victory-overlay');

  // ── Apple image ──
  const appleImg = new Image();
  appleImg.src = 'apple.png';

  // ── State ──
  let level, score, speed, snake, dir, nextDir, apple, obstacles;
  let cols, rows, targetScore;
  let gameLoop = null;
  let gameRunning = false;
  let gamePaused = false;

  // ── Level config ──
  function getLevelConfig(lv) {
    const c = BASE_COLS + (lv - 1) * COLS_PER_LEVEL;
    const r = BASE_ROWS + (lv - 1) * ROWS_PER_LEVEL;
    return { cols: c, rows: r, target: lv * BASE_TARGET, obstacleCount: lv * 3 + Math.floor(lv * lv * 0.5) };
  }

  // ── Init level ──
  function initLevel(lv) {
    level = lv;
    const cfg = getLevelConfig(lv);
    cols = cfg.cols;
    rows = cfg.rows;
    targetScore = cfg.target;

    canvas.width = cols * CELL;
    canvas.height = rows * CELL;

    // Reset snake
    const startX = Math.floor(cols / 2);
    const startY = Math.floor(rows / 2);
    snake = [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    speed = 1;
    score = 0;

    // Generate obstacles
    obstacles = generateObstacles(cfg.obstacleCount, lv);

    // Place apple
    apple = spawnApple();

    updateHUD();
  }

  // ── Obstacles ──
  function generateObstacles(count, lv) {
    const obs = [];
    const occupied = new Set();

    // Mark snake cells
    for (const s of snake) occupied.add(`${s.x},${s.y}`);
    // Safe zone around snake head
    for (let dx = -3; dx <= 3; dx++) {
      for (let dy = -3; dy <= 3; dy++) {
        occupied.add(`${snake[0].x + dx},${snake[0].y + dy}`);
      }
    }

    // Higher levels get more complex shapes
    const shapes = getShapes(lv);

    let placed = 0;
    let attempts = 0;
    while (placed < count && attempts < 500) {
      attempts++;
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const ox = Math.floor(Math.random() * (cols - 4)) + 2;
      const oy = Math.floor(Math.random() * (rows - 4)) + 2;
      const cells = shape.map(([dx, dy]) => ({ x: ox + dx, y: oy + dy }));

      // Check all cells valid
      const valid = cells.every(c =>
        c.x >= 0 && c.x < cols && c.y >= 0 && c.y < rows &&
        !occupied.has(`${c.x},${c.y}`)
      );

      if (valid) {
        for (const c of cells) {
          obs.push(c);
          occupied.add(`${c.x},${c.y}`);
        }
        placed += cells.length;
      }
    }
    return obs;
  }

  function getShapes(lv) {
    // Simple blocks for early levels, complex shapes for later
    const basic = [
      [[0, 0]],
      [[0, 0], [1, 0]],
      [[0, 0], [0, 1]]
    ];
    const medium = [
      [[0, 0], [1, 0], [2, 0]],
      [[0, 0], [0, 1], [0, 2]],
      [[0, 0], [1, 0], [0, 1]],
      [[0, 0], [1, 0], [1, 1]]
    ];
    const complex = [
      [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[0, 0], [0, 1], [0, 2], [0, 3]],
      [[0, 0], [1, 0], [2, 0], [2, 1]],
      [[0, 0], [1, 0], [1, 1], [2, 1]],
      [[0, 0], [1, 0], [0, 1], [1, 1]],
      [[0, 0], [1, 0], [2, 0], [1, 1]],
    ];

    if (lv <= 3) return basic;
    if (lv <= 6) return [...basic, ...medium];
    return [...basic, ...medium, ...complex];
  }

  // ── Apple spawn ──
  function spawnApple() {
    const occupied = new Set();
    for (const s of snake) occupied.add(`${s.x},${s.y}`);
    for (const o of obstacles) occupied.add(`${o.x},${o.y}`);

    let attempts = 0;
    while (attempts < 1000) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      if (!occupied.has(`${x},${y}`)) return { x, y };
      attempts++;
    }
    return { x: 0, y: 0 };
  }

  // ── HUD ──
  function updateHUD() {
    hudLevel.textContent = level;
    hudScore.textContent = score;
    hudTarget.textContent = targetScore;
    hudSpeed.textContent = speed;
  }

  // ── Game tick ──
  function tick() {
    dir = { ...nextDir };
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

    // Wall collision
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
      gameOver('撞墙'); return;
    }
    // Self collision
    if (snake.some(s => s.x === head.x && s.y === head.y)) {
      gameOver('自身缠绕'); return;
    }
    // Obstacle collision
    if (obstacles.some(o => o.x === head.x && o.y === head.y)) {
      gameOver('撞到障碍物'); return;
    }

    snake.unshift(head);

    // Eat apple
    if (head.x === apple.x && head.y === apple.y) {
      score += SCORE_PER_APPLE;
      speed = Math.min(speed + 1, MAX_SPEED);
      apple = spawnApple();
      restartLoop(); // Update speed

      // Check level complete
      if (score >= targetScore) {
        levelComplete();
        return;
      }
    } else {
      snake.pop();
    }

    updateHUD();
    draw();
  }

  // ── Drawing ──
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawObstacles();
    drawSnake();
    drawApple();
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(60, 60, 120, 0.15)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, rows * CELL);
      ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(cols * CELL, y * CELL);
      ctx.stroke();
    }
  }

  function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
      const s = snake[i];
      const t = i / snake.length;

      if (i === 0) {
        // Head - bright neon
        ctx.fillStyle = '#7dd3fc';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        roundRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2, 5);
        ctx.fill();

        // Eyes
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0f172a';
        const eyeSize = 3;
        if (dir.x === 1) {
          ctx.fillRect(s.x * CELL + 13, s.y * CELL + 5, eyeSize, eyeSize);
          ctx.fillRect(s.x * CELL + 13, s.y * CELL + 12, eyeSize, eyeSize);
        } else if (dir.x === -1) {
          ctx.fillRect(s.x * CELL + 4, s.y * CELL + 5, eyeSize, eyeSize);
          ctx.fillRect(s.x * CELL + 4, s.y * CELL + 12, eyeSize, eyeSize);
        } else if (dir.y === -1) {
          ctx.fillRect(s.x * CELL + 5, s.y * CELL + 4, eyeSize, eyeSize);
          ctx.fillRect(s.x * CELL + 12, s.y * CELL + 4, eyeSize, eyeSize);
        } else {
          ctx.fillRect(s.x * CELL + 5, s.y * CELL + 13, eyeSize, eyeSize);
          ctx.fillRect(s.x * CELL + 12, s.y * CELL + 13, eyeSize, eyeSize);
        }
      } else {
        // Body gradient
        const r = Math.floor(34 + t * 40);
        const g = Math.floor(197 - t * 80);
        const b = Math.floor(94 + t * 100);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.shadowColor = `rgba(${r},${g},${b},0.5)`;
        ctx.shadowBlur = 6;
        roundRect(s.x * CELL + 1.5, s.y * CELL + 1.5, CELL - 3, CELL - 3, 4);
        ctx.fill();
      }
    }
    ctx.shadowBlur = 0;
  }

  function drawApple() {
    const x = apple.x * CELL;
    const y = apple.y * CELL;
    const pad = 1;

    if (appleImg.complete && appleImg.naturalWidth > 0) {
      ctx.drawImage(appleImg, x + pad, y + pad, CELL - pad * 2, CELL - pad * 2);
    } else {
      // Fallback: draw a red circle apple
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x + CELL / 2, y + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      // Leaf
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.ellipse(x + CELL / 2 + 2, y + 3, 4, 2, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  function drawObstacles() {
    for (const o of obstacles) {
      const grd = ctx.createLinearGradient(o.x * CELL, o.y * CELL, o.x * CELL + CELL, o.y * CELL + CELL);
      grd.addColorStop(0, '#4a2060');
      grd.addColorStop(1, '#2d1240');
      ctx.fillStyle = grd;
      ctx.shadowColor = 'rgba(120, 40, 160, 0.3)';
      ctx.shadowBlur = 4;
      roundRect(o.x * CELL + 0.5, o.y * CELL + 0.5, CELL - 1, CELL - 1, 3);
      ctx.fill();

      // Inner cross pattern
      ctx.strokeStyle = 'rgba(180, 80, 220, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(o.x * CELL + 4, o.y * CELL + 4);
      ctx.lineTo(o.x * CELL + CELL - 4, o.y * CELL + CELL - 4);
      ctx.moveTo(o.x * CELL + CELL - 4, o.y * CELL + 4);
      ctx.lineTo(o.x * CELL + 4, o.y * CELL + CELL - 4);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── Game control ──
  function startGame() {
    hideAllOverlays();
    initLevel(1);
    gameRunning = true;
    draw();
    restartLoop();
  }

  function restartLoop() {
    if (gameLoop) clearInterval(gameLoop);
    // Speed 1 = 150ms, Speed 10 = 60ms
    const interval = Math.max(60, 350 - speed * 10);
    gameLoop = setInterval(tick, interval);
  }

  function stopLoop() {
    if (gameLoop) { clearInterval(gameLoop); gameLoop = null; }
    gameRunning = false;
  }

  function gameOver(reason) {
    stopLoop();
    document.getElementById('go-score').textContent = `得分: ${score} / ${targetScore}`;
    document.getElementById('go-info').textContent = `第 ${level} 关 · 失败原因：${reason}`;
    hideAllOverlays();
    gameoverOverlay.classList.remove('hidden');
  }

  function togglePause() {
    if (!gameRunning) return;
    if (gamePaused) {
      gamePaused = false;
      restartLoop();
      const el = document.getElementById('pause-overlay');
      if (el) el.classList.add('hidden');
    } else {
      gamePaused = true;
      if (gameLoop) { clearInterval(gameLoop); gameLoop = null; }
      const el = document.getElementById('pause-overlay');
      if (el) el.classList.remove('hidden');
    }
  }

  function levelComplete() {
    stopLoop();
    if (level >= MAX_LEVEL) {
      victory(); return;
    }
    document.getElementById('level-title').textContent = `🎉 第 ${level} 关通过！`;
    document.getElementById('level-score').textContent = `得分: ${score}`;
    document.getElementById('level-info').textContent = `准备进入第 ${level + 1} 关`;
    hideAllOverlays();
    levelOverlay.classList.remove('hidden');
  }

  function nextLevel() {
    hideAllOverlays();
    initLevel(level + 1);
    gameRunning = true;
    draw();
    restartLoop();
  }

  function victory() {
    stopLoop();
    document.getElementById('vic-score').textContent = `最终得分: ${score}`;
    hideAllOverlays();
    victoryOverlay.classList.remove('hidden');
  }

  function hideAllOverlays() {
    startOverlay.classList.add('hidden');
    levelOverlay.classList.add('hidden');
    gameoverOverlay.classList.add('hidden');
    victoryOverlay.classList.add('hidden');
  }

  // ── Input ──
  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === 'p' || key === 'P') {
      togglePause();
      e.preventDefault();
      return;
    }
    if (!gameRunning || gamePaused) return;
    switch (key) {
      case 'ArrowUp': case 'w': case 'W':
        if (dir.y !== 1) nextDir = { x: 0, y: -1 };
        e.preventDefault(); break;
      case 'ArrowDown': case 's': case 'S':
        if (dir.y !== -1) nextDir = { x: 0, y: 1 };
        e.preventDefault(); break;
      case 'ArrowLeft': case 'a': case 'A':
        if (dir.x !== 1) nextDir = { x: -1, y: 0 };
        e.preventDefault(); break;
      case 'ArrowRight': case 'd': case 'D':
        if (dir.x !== -1) nextDir = { x: 1, y: 0 };
        e.preventDefault(); break;
    }
  });

  // ── Buttons ──
  document.getElementById('btn-start').addEventListener('click', startGame);
  document.getElementById('btn-next').addEventListener('click', nextLevel);
  document.getElementById('btn-retry').addEventListener('click', startGame);
  document.getElementById('btn-restart').addEventListener('click', startGame);

  // ── Initial draw ──
  initLevel(1);
  draw();
})();
