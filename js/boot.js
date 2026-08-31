const BOOT_CONFIG = {
  lines: [
    { text: 'BIOS POST Check', delay: 300 },
    { text: 'Memory: 16384 MB', delay: 250 },
    { text: 'Loading kernel modules', delay: 300 },
    { text: 'Mounting filesystems', delay: 200 },
    { text: 'Starting network', delay: 200 },
    { text: 'Loading portfolio.service', delay: 400 },
  ],
  progressDuration: 800,
  welcomeDelay: 300,
  postBootDelay: 200,
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
    line.classList.add('boot-line--visible');
  }

  await sleep(200);
  progressEl.classList.add('boot-progress--visible');
  await sleep(50);
  progressFill.style.width = '100%';
  await sleep(BOOT_CONFIG.progressDuration);

  await sleep(100);
  welcomeEl.classList.add('boot-welcome--visible');
  await sleep(BOOT_CONFIG.welcomeDelay);

  await sleep(BOOT_CONFIG.postBootDelay);

  bootEl.style.transition = 'opacity 0.3s ease';
  bootEl.style.opacity = '0';
  await sleep(300);
  bootEl.style.display = 'none';

  heroContent.style.display = 'block';
  heroContent.style.opacity = '0';
  heroContent.style.transition = 'opacity 0.4s ease';
  await sleep(50);
  heroContent.style.opacity = '1';

  document.dispatchEvent(new CustomEvent('bootComplete'));
}
