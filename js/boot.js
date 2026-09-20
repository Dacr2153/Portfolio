const BOOT_CONFIG = {
  lines: [
    { text: 'BIOS POST Check', delay: 300 },
    { text: 'Memory: 16384 MB', delay: 250 },
    { text: 'Loading kernel modules', delay: 300 },
    { text: 'Mounting filesystems', delay: 200 },
    { text: 'Starting network', delay: 200 },
    { text: 'Loading portfolio.service', delay: 400 },
  ],
  progressDuration: 1200,
  welcomeDelay: 400,
  postBootDelay: 200,
  typeSpeed: 18,
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeBootLine(textEl, text, speed) {
  for (let i = 0; i < text.length; i++) {
    textEl.textContent += text[i];
    await sleep(speed);
  }
}

async function runBootSequence() {
  const bootEl = document.getElementById('bootSequence');
  const progressEl = document.getElementById('bootProgress');
  const progressFill = document.getElementById('bootProgressFill');
  const welcomeEl = document.getElementById('bootWelcome');
  const heroContent = document.getElementById('heroContent');
  const lines = bootEl.querySelectorAll('.boot-line');

  if (!bootEl || !heroContent) return;

  for (const line of lines) {
    const delay = parseInt(line.dataset.delay) || 0;
    await sleep(delay);

    const textEl = line.querySelector('.boot-line__text');
    const statusEl = line.querySelector('.boot-line__status');
    const originalText = textEl.textContent;
    textEl.textContent = '';

    line.classList.add('boot-line--visible');
    await typeBootLine(textEl, originalText, BOOT_CONFIG.typeSpeed);
    statusEl.style.opacity = '0';
    statusEl.style.transition = 'opacity 0.15s ease';
    await sleep(30);
    statusEl.style.opacity = '1';
  }

  await sleep(200);
  progressEl.classList.add('boot-progress--visible');

  const progressText = document.createElement('div');
  progressText.style.cssText = 'font-size:11px;color:var(--text-secondary);margin-top:4px;text-align:right;font-family:var(--font-mono);';
  progressEl.parentNode.insertBefore(progressText, progressEl.nextSibling);

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress > 100) progress = 100;
    progressFill.style.width = progress + '%';
    progressText.textContent = `[${Math.round(progress)}%]`;
    if (progress >= 100) clearInterval(progressInterval);
  }, BOOT_CONFIG.progressDuration / 8);

  await sleep(BOOT_CONFIG.progressDuration);

  await sleep(100);
  welcomeEl.classList.add('boot-welcome--visible');
  await sleep(BOOT_CONFIG.welcomeDelay);

  await sleep(BOOT_CONFIG.postBootDelay);

  bootEl.style.transition = 'opacity 0.4s ease, filter 0.4s ease';
  bootEl.style.opacity = '0';
  bootEl.style.filter = 'blur(4px)';
  await sleep(400);
  bootEl.style.display = 'none';

  heroContent.style.display = 'block';
  heroContent.style.opacity = '0';
  heroContent.style.transition = 'opacity 0.5s ease';
  await sleep(50);
  heroContent.style.opacity = '1';

  document.dispatchEvent(new CustomEvent('bootComplete'));
}
