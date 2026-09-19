class Typewriter {
  constructor(element, options = {}) {
    this.element = element;
    this.speed = options.speed || 40;
    this.delay = options.delay || 0;
    this.cursor = options.cursor !== false;
    this.onComplete = options.onComplete || null;
    this._timeout = null;
  }

  async type(text) {
    return new Promise(resolve => {
      this.element.textContent = '';
      if (this.cursor) {
        this.element.classList.add('typewriter--active');
      }
      let i = 0;
      const interval = setInterval(() => {
        this.element.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          if (this.cursor) {
            setTimeout(() => this.element.classList.remove('typewriter--active'), 800);
          }
          resolve();
        }
      }, this.speed);
      this._timeout = interval;
    });
  }

  async typeLines(lines, lineSpeed) {
    for (const line of lines) {
      await this.type(line);
      if (lineSpeed) await this.sleep(lineSpeed);
    }
    if (this.onComplete) this.onComplete();
  }

  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  destroy() {
    if (this._timeout) clearInterval(this._timeout);
  }
}

function initTypewriter() {
  const heroName = document.getElementById('heroName');
  const heroRole = document.querySelector('.hero-role');
  const heroFocus = document.querySelector('.hero-focus');
  if (!heroName) return;

  const bootComplete = () => {
    setTimeout(async () => {
      const tw = new Typewriter(heroName, { speed: 35, cursor: true });
      await tw.type('David Alexander Colorado Rodríguez');

      if (heroRole) {
        const tw2 = new Typewriter(heroRole, { speed: 25, cursor: false });
        await tw2.type('Ingeniero de Sistemas en Formación — Ciberseguridad Junior');
      }

      if (heroFocus) {
        heroFocus.style.opacity = '0';
        heroFocus.style.transition = 'opacity 0.5s ease';
        await new Promise(r => setTimeout(r, 200));
        heroFocus.style.opacity = '1';
      }
    }, 300);
  };

  document.addEventListener('bootComplete', bootComplete, { once: true });
}
