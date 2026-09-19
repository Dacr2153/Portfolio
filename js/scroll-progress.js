function initScrollProgress() {
  const terminalBody = document.getElementById('terminal-body');
  const terminal = document.getElementById('terminal');
  if (!terminalBody || !terminal) return;

  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.style.width = '0%';
  terminal.appendChild(bar);

  terminalBody.addEventListener('scroll', () => {
    const scrollTop = terminalBody.scrollTop;
    const scrollHeight = terminalBody.scrollHeight - terminalBody.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = progress + '%';
  });
}
