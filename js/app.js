function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const sections = document.querySelectorAll('.terminal-section');
  const statusSection = document.getElementById('statusSection');
  const tabbar = document.querySelector('.terminal__tabbar');

  const indicator = document.createElement('div');
  indicator.className = 'tab-indicator';
  tabbar.style.position = 'relative';
  tabbar.appendChild(indicator);

  function moveIndicator(tab) {
    const rect = tab.getBoundingClientRect();
    const barRect = tabbar.getBoundingClientRect();
    indicator.style.left = (rect.left - barRect.left + tabbar.scrollLeft) + 'px';
    indicator.style.width = rect.width + 'px';
  }

  const activeTab = tabbar.querySelector('.tab--active');
  if (activeTab) setTimeout(() => moveIndicator(activeTab), 100);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = `section-${tab.dataset.section}`;

      tabs.forEach(t => {
        t.classList.remove('tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('tab--active');
      tab.setAttribute('aria-selected', 'true');

      moveIndicator(tab);

      sections.forEach(s => {
        s.classList.remove('terminal-section--active');
        s.style.animation = 'none';
      });

      const target = document.getElementById(targetId);
      if (target) {
        void target.offsetWidth;
        target.style.animation = '';
        target.classList.add('terminal-section--active');
        document.getElementById('terminal-body').scrollTop = 0;
      }

      if (statusSection) {
        statusSection.textContent = tab.querySelector('.tab__label').textContent;
      }

      triggerSectionAnimations(targetId);
    });
  });

  window.addEventListener('resize', () => {
    const current = tabbar.querySelector('.tab--active');
    if (current) moveIndicator(current);
  });
}

function triggerSectionAnimations(sectionId) {
  if (sectionId === 'section-about') {
    setTimeout(() => {
      document.querySelectorAll('.skill-bar__fill').forEach(bar => {
        const width = bar.dataset.width;
        bar.style.width = width + '%';
      });
      document.querySelectorAll('.metric-card__bar-fill').forEach(bar => {
        const width = bar.dataset.width;
        bar.style.width = width + '%';
      });
      animateCounters();
    }, 200);
  }
}

function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = Date.now();

    function update() {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

function initHeroDirs() {
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const section = el.dataset.goto;
      const filter = el.dataset.filter;

      const tab = document.querySelector(`.tab[data-section="${section}"]`);
      if (tab) tab.click();

      if (filter) {
        setTimeout(() => {
          renderProjects(filter);
        }, 100);
      }
    });
  });
}

function initRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initScrollToTop() {
  const terminalBody = document.getElementById('terminal-body');
  if (terminalBody) {
    terminalBody.style.scrollBehavior = 'smooth';
  }
}

function initCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', function(e) {
    mx = e.clientX;
    my = e.clientY;
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  (function animCursor() {
    dx = lerp(dx, mx, 0.15);
    dy = lerp(dy, my, 0.15);
    rx = lerp(rx, mx, 0.08);
    ry = lerp(ry, my, 0.08);
    dot.style.left = dx + 'px';
    dot.style.top = dy + 'px';
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  })();

  var hoverEls = document.querySelectorAll('a,button,.tab,.filter-btn,.project-entry,.contact-channel,.hero-ls__dir,.theme-toggle');
  hoverEls.forEach(function(el) {
    el.addEventListener('mouseenter', function() { dot.classList.add('hover'); ring.classList.add('hover'); });
    el.addEventListener('mouseleave', function() { dot.classList.remove('hover'); ring.classList.remove('hover'); });
  });
}

function initMagneticDirs() {
  if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  document.querySelectorAll('.hero-ls__dir').forEach(function(el) {
    el.addEventListener('mousemove', function(e) {
      var rect = el.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = 'translate(' + (x * 0.15) + 'px,' + (y * 0.15) + 'px)';
    });
    el.addEventListener('mouseleave', function() {
      el.style.transform = 'translate(0,0)';
      el.style.transition = 'transform 0.4s cubic-bezier(.16,1,.3,1)';
    });
    el.addEventListener('mouseenter', function() {
      el.style.transition = 'none';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initHeroDirs();
  initRevealObserver();
  initScrollToTop();
  initContactForm();
  initTheme();
  loadProjects();
  initFilters();
  runBootSequence();
  initTypewriter();
  initScrollProgress();
  initKeyboardShortcuts();
  initCursor();
  initMagneticDirs();
});
