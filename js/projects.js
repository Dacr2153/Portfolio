let projectsData = null;
let currentFilter = 'all';

async function loadProjects() {
  try {
    const response = await fetch('data/projects.json');
    projectsData = await response.json();
    renderProjects('all');
  } catch (err) {
    console.error('Error loading projects:', err);
  }
}

function renderProjects(filter) {
  const container = document.getElementById('projectsTree');
  if (!container || !projectsData) return;

  currentFilter = filter;
  container.innerHTML = '';

  const portfolios = filter === 'all'
    ? projectsData.portfolios
    : projectsData.portfolios.filter(p => p.id === filter);

  portfolios.forEach(portfolio => {
    const group = document.createElement('div');
    group.className = 'portfolio-group reveal';
    group.dataset.portfolio = portfolio.id;

    const colorVar = `var(--accent-${portfolio.color === 'cyber' ? 'cyber' : portfolio.color === 'ai' ? 'ai' : 'web'})`;

    group.innerHTML = `
      <div class="portfolio-group__header">
        <span class="folder-icon">📁</span>
        <span class="group-name">${portfolio.name}/</span>
        <span class="group-desc"># ${portfolio.description}</span>
      </div>
    `;

    portfolio.projects.forEach(project => {
      const entry = document.createElement('div');
      entry.className = 'project-entry';
      entry.dataset.projectId = project.id;
      entry.dataset.portfolio = portfolio.id;

      const techTags = project.technologies.slice(0, 4).map(t =>
        `<span class="tech-tag">${t}</span>`
      ).join('');
      const moreCount = project.technologies.length - 4;
      const moreTag = moreCount > 0 ? `<span class="tech-tag">+${moreCount}</span>` : '';

      // Metrics badges
      const metricBadges = project.metrics.slice(0, 3).map(m =>
        `<span class="metric-badge">${m.label}: ${m.value}</span>`
      ).join('');

      entry.innerHTML = `
        <div class="project-entry__left">
          <span class="project-entry__icon">├──</span>
          <span class="project-entry__name">${project.name}/</span>
        </div>
        <div class="project-entry__right">
          <div class="project-entry__badges">${metricBadges}</div>
          <div class="project-entry__tech">${techTags}${moreTag}</div>
        </div>
      `;

      entry.addEventListener('click', () => showProjectDetail(project, portfolio));
      group.appendChild(entry);
    });

    container.appendChild(group);
  });

  requestAnimationFrame(() => {
    container.querySelectorAll('.reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('reveal--visible'), i * 80);
    });
  });

  updateFilters();
}

function updateFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const filter = btn.dataset.filter;
    btn.classList.toggle('filter-btn--active', filter === currentFilter);
  });
}

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      renderProjects(btn.dataset.filter);
    });
  });
}
