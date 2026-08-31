function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');

  if (saved === 'light') {
    document.documentElement.classList.add('light');
    if (toggle) toggle.textContent = '🌙';
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light');
      toggle.textContent = isLight ? '☀' : '☀';
      toggle.textContent = isLight ? '🌙' : '☀';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }
}
