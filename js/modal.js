function showProjectDetail(project, portfolio) {
  const detail = document.getElementById('projectDetail');
  if (!detail) return;

  const techTags = project.technologies.map(t =>
    `<span class="project-detail__tech-tag">${t}</span>`
  ).join('');

  const highlights = project.highlights.map(h =>
    `<li>${h}</li>`
  ).join('');

  const metrics = project.metrics.map(m =>
    `<div class="project-detail__metric">
      <span class="project-detail__metric-value">${m.value}</span>
      <span class="project-detail__metric-label">${m.label}</span>
    </div>`
  ).join('');

  const videoSection = project.video ? `
    <div class="project-detail__section">
      <div class="project-detail__section-title">DEMO</div>
      <div class="project-detail__video-container">
        <video class="project-detail__video" controls preload="metadata" poster="">
          <source src="${project.video}" type="video/mp4">
          Tu navegador no soporta la reproducción de videos.
        </video>
      </div>
    </div>
  ` : '';

  const formattedDescription = project.description.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');

  // Architecture diagram section
  const architectureSection = project.architecture ? `
    <div class="project-detail__section">
      <div class="project-detail__section-title">ARQUITECTURA</div>
      <pre class="project-detail__arch">${project.architecture}</pre>
    </div>
  ` : '';

  // Technical notes section
  const technicalSection = project.technicalNotes ? `
    <div class="project-detail__section">
      <div class="project-detail__section-title">DECISIONES TÉCNICAS</div>
      <div class="project-detail__text"><p>${project.technicalNotes}</p></div>
    </div>
  ` : '';

  // What I'd change section
  const whatIdChangeSection = project.whatIdChange ? `
    <div class="project-detail__section">
      <div class="project-detail__section-title">LO QUE HARÍA DIFERENTE</div>
      <div class="project-detail__text"><p>${project.whatIdChange}</p></div>
    </div>
  ` : '';

  detail.innerHTML = `
    <div class="project-detail__header">
      <div class="project-detail__title">${project.name}</div>
      <div class="project-detail__tagline">${project.tagline}</div>
      <div class="project-detail__tech" style="margin-top: var(--sp-2);">${techTags}</div>
    </div>

    ${videoSection}

    <div class="project-detail__section">
      <div class="project-detail__section-title">DESCRIPCIÓN</div>
      <div class="project-detail__text"><p>${formattedDescription}</p></div>
    </div>

    ${architectureSection}

    ${technicalSection}

    <div class="project-detail__section">
      <div class="project-detail__section-title">MÉTRICAS</div>
      <div class="project-detail__metrics">${metrics}</div>
    </div>

    <div class="project-detail__section">
      <div class="project-detail__section-title">CARACTERÍSTICAS</div>
      <ul class="project-detail__list">${highlights}</ul>
    </div>

    ${whatIdChangeSection}

    <div class="project-detail__footer">
      <a href="${project.githubUrl}" target="_blank" rel="noopener" class="project-detail__link">
        → Ver en GitHub
      </a>
      <button class="project-detail__link project-detail__back" onclick="closeProjectDetail()">
        ← Volver
      </button>
    </div>
  `;

  detail.classList.add('project-detail--visible');
  detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeProjectDetail() {
  const detail = document.getElementById('projectDetail');
  if (detail) {
    detail.classList.remove('project-detail--visible');
    detail.innerHTML = '';
  }
}
