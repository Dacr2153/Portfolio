function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const sections = document.querySelectorAll('.terminal-section');
  const statusSection = document.getElementById('statusSection');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = `section-${tab.dataset.section}`;

      tabs.forEach(t => {
        t.classList.remove('tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('tab--active');
      tab.setAttribute('aria-selected', 'true');

      sections.forEach(s => s.classList.remove('terminal-section--active'));
      const target = document.getElementById(targetId);
      if (target) {
        target.classList.add('terminal-section--active');
        document.getElementById('terminal-body').scrollTop = 0;
      }

      if (statusSection) {
        statusSection.textContent = tab.querySelector('.tab__label').textContent;
      }

      triggerSectionAnimations(targetId);
    });
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
});
