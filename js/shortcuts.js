function initKeyboardShortcuts() {
  const shortcuts = {
    '1': 'hero',
    '2': 'about',
    '3': 'projects',
    '4': 'contact',
  };

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key;

    if (shortcuts[key]) {
      e.preventDefault();
      const tab = document.querySelector(`.tab[data-section="${shortcuts[key]}"]`);
      if (tab) tab.click();
      return;
    }

    if (key === '?' && !e.shiftKey) {
      e.preventDefault();
      toggleShortcutOverlay();
      return;
    }

    if (key === 'Escape') {
      closeShortcutOverlay();
      closeProjectDetail();
      return;
    }

    if (e.ctrlKey && key === 'k') {
      e.preventDefault();
      const tab = document.querySelector('.tab[data-section="projects"]');
      if (tab) tab.click();
      return;
    }
  });
}

function toggleShortcutOverlay() {
  const existing = document.getElementById('shortcutOverlay');
  if (existing) {
    existing.remove();
    return;
  }

  const overlay = document.createElement('div');
  overlay.id = 'shortcutOverlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(10, 14, 20, 0.9); z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  `;

  overlay.innerHTML = `
    <div style="
      background: var(--bg-terminal); border: 1px solid var(--border-terminal);
      border-radius: var(--radius-lg); padding: 2rem; max-width: 400px; width: 90%;
      font-family: var(--font-mono); font-size: var(--text-sm);
    ">
      <div style="color: var(--term-yellow); font-weight: bold; margin-bottom: 1rem; font-size: var(--text-md);">
        Atajos de Teclado
      </div>
      <div style="display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1.5rem;">
        <span style="color: var(--term-green);">1-4</span>
        <span style="color: var(--text-primary);">Cambiar de pestaña</span>
        <span style="color: var(--term-green);">?</span>
        <span style="color: var(--text-primary);">Mostrar/ocultar ayuda</span>
        <span style="color: var(--term-green);">Esc</span>
        <span style="color: var(--text-primary);">Cerrar paneles</span>
        <span style="color: var(--term-green);">Tab</span>
        <span style="color: var(--text-primary);">Autocompletar (terminal)</span>
        <span style="color: var(--term-green);">↑ / ↓</span>
        <span style="color: var(--text-primary);">Historial de comandos</span>
      </div>
      <div style="margin-top: 1.5rem; text-align: center; color: var(--text-muted); font-size: var(--text-xs);">
        Presiona <span style="color: var(--term-green);">Esc</span> o <span style="color: var(--term-green);">?</span> para cerrar
      </div>
    </div>
  `;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
}

function closeShortcutOverlay() {
  const overlay = document.getElementById('shortcutOverlay');
  if (overlay) overlay.remove();
}
