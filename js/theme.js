const THEMES = ['dark', 'light', 'cyber'];
const THEME_ICONS = { dark: '☀', light: '🌙', cyber: '💚' };
const THEME_LABELS = { dark: 'Dark', light: 'Light', cyber: 'Cyber' };

let matrixAnim = null;
let devanagariAnim = null;

function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'dark';
  let currentIdx = THEMES.indexOf(saved);
  if (currentIdx === -1) currentIdx = 0;

  applyTheme(THEMES[currentIdx]);
  if (toggle) toggle.textContent = THEME_ICONS[THEMES[currentIdx]];

  if (toggle) {
    toggle.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % THEMES.length;
      const theme = THEMES[currentIdx];
      applyTheme(theme);
      toggle.textContent = THEME_ICONS[theme];
      toggle.title = THEME_LABELS[theme];
      localStorage.setItem('theme', theme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.classList.remove('light', 'cyber');
  if (theme === 'light') document.documentElement.classList.add('light');
  if (theme === 'cyber') document.documentElement.classList.add('cyber');

  if (theme === 'cyber') {
    startMatrix();
  } else {
    stopMatrix();
  }

  if (theme === 'light') {
    startDevanagari();
  } else {
    stopDevanagari();
  }
}

/* === MATRIX RAIN (cyber theme) === */
function startMatrix() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  if (matrixAnim) return;

  const ctx = canvas.getContext('2d');
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF'.split('');
  const fontSize = 14;
  let columns, drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: columns }, () => Math.random() * -100);
  }

  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    matrixAnim = requestAnimationFrame(draw);
  }

  draw();
}

function stopMatrix() {
  if (matrixAnim) {
    cancelAnimationFrame(matrixAnim);
    matrixAnim = null;
  }
  const canvas = document.getElementById('matrixCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/* === DEVANAGARI GRID (light theme) === */
let devMouseX = -1000, devMouseY = -1000;

function startDevanagari() {
  const canvas = document.getElementById('devanagariCanvas');
  if (!canvas) return;
  if (devanagariAnim) return;

  const ctx = canvas.getContext('2d');
  const chars = 'ॐश्रीअआइईउऊएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह+#=*o.·'.split('');
  const fontSize = 18;
  const colSpacing = fontSize;
  const rowSpacing = fontSize * 1.4;
  let cols, rows, grid;

  function initGrid() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.ceil(canvas.width / colSpacing) + 1;
    rows = Math.ceil(canvas.height / rowSpacing) + 1;
    grid = [];
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        grid[r][c] = {
          char: chars[Math.floor(Math.random() * chars.length)],
          timer: Math.random() * 200,
          speed: 80 + Math.random() * 200
        };
      }
    }
  }

  function onMouseMove(e) {
    devMouseX = e.clientX;
    devMouseY = e.clientY;
  }

  window.addEventListener('mousemove', onMouseMove);

  initGrid();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c];
        const x = c * colSpacing;
        const y = r * rowSpacing;

        const dx = x - devMouseX;
        const dy = y - devMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 150;
        const inRange = dist < radius;

        cell.timer++;
        const changeRate = inRange ? 4 : cell.speed;
        if (cell.timer > changeRate) {
          cell.char = chars[Math.floor(Math.random() * chars.length)];
          cell.timer = 0;
        }

        const alpha = inRange ? 0.35 + (1 - dist / radius) * 0.4 : 0.08;
        ctx.fillStyle = `rgba(74, 53, 8, ${alpha})`;
        ctx.font = fontSize + 'px monospace';
        ctx.fillText(cell.char, x, y);
      }
    }

    devanagariAnim = requestAnimationFrame(draw);
  }

  draw();
}

function stopDevanagari() {
  if (devanagariAnim) {
    cancelAnimationFrame(devanagariAnim);
    devanagariAnim = null;
  }
  const canvas = document.getElementById('devanagariCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
