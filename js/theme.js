const THEMES = ['dark', 'light', 'cyber'];
const THEME_ICONS = { dark: '☀', light: '🌙', cyber: '💚' };
const THEME_LABELS = { dark: 'Dark', light: 'Light', cyber: 'Cyber' };

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
}
