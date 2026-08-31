class PortfolioTerminal {
  constructor(containerEl) {
    this.container = containerEl;
    this.history = [];
    this.historyIndex = -1;
    this.output = null;
    this.inputLine = null;
    this.input = null;
    this.cursor = null;
    this.projectsData = null;
    this.init();
  }

  async init() {
    this.container.innerHTML = `
      <div class="term-emulator__output" id="termOutput"></div>
      <div class="term-emulator__input-line">
        <span class="term-emulator__prompt">$&nbsp;</span>
        <input class="term-emulator__input" id="termInput" type="text" autocomplete="off" spellcheck="false" aria-label="Terminal input" autofocus>
        <span class="cursor term-emulator__cursor" id="termCursor"></span>
      </div>
    `;

    this.output = this.container.querySelector('#termOutput');
    this.inputLine = this.container.querySelector('.term-emulator__input-line');
    this.input = this.container.querySelector('#termInput');
    this.cursor = this.container.querySelector('#termCursor');

    this.printLine('Portfolio Terminal v1.0', 'dim');
    this.printLine('Escribe "help" para ver los comandos disponibles.\n', 'dim');

    this.input.addEventListener('keydown', (e) => this.handleKey(e));
    this.input.addEventListener('input', () => this.updateCursor());
    this.input.addEventListener('click', () => this.updateCursor());
    this.input.addEventListener('focus', () => this.updateCursor());
    this.input.addEventListener('blur', () => {
      if (this.cursor) this.cursor.style.opacity = '0';
    });

    this.container.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A') {
        this.input.focus();
      }
    });

    this.updateCursor();

    try {
      const resp = await fetch('data/projects.json');
      this.projectsData = await resp.json();
    } catch (e) {
      this.projectsData = { portfolios: [] };
    }
  }

  updateCursor() {
    if (!this.cursor || !this.input) return;

    const text = this.input.value;
    const selStart = this.input.selectionStart;

    const span = document.createElement('span');
    span.style.font = getComputedStyle(this.input).font;
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'pre';
    span.textContent = text.substring(0, selStart);
    document.body.appendChild(span);

    const textWidth = span.getBoundingClientRect().width;
    document.body.removeChild(span);

    const promptEl = this.inputLine.querySelector('.term-emulator__prompt');
    const promptWidth = promptEl ? promptEl.getBoundingClientRect().width : 0;

    this.cursor.style.left = `calc(${promptWidth}px + ${textWidth}px + var(--sp-3) - 1px)`;
    this.cursor.style.opacity = '1';
  }

  handleKey(e) {
    if (e.key === 'Enter') {
      const cmd = this.input.value.trim();
      this.printLine(`$ ${cmd}`, 'input-echo');
      if (cmd) {
        this.history.push(cmd);
        this.historyIndex = this.history.length;
        this.execute(cmd);
      }
      this.input.value = '';
      this.updateCursor();
      this.scrollToBottom();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
        this.input.selectionStart = this.input.value.length;
        this.updateCursor();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
        this.input.selectionStart = this.input.value.length;
        this.updateCursor();
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
        this.updateCursor();
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      this.clear();
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      this.printLine(`$ ${this.input.value}^C`, 'input-echo');
      this.input.value = '';
      this.updateCursor();
    }

    requestAnimationFrame(() => this.updateCursor());
  }

  execute(raw) {
    const parts = raw.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const commands = {
      help:    () => this.cmdHelp(),
      whoami:  () => this.cmdWhoami(),
      about:   () => this.cmdWhoami(),
      skills:  () => this.cmdSkills(),
      ls:      () => this.cmdLs(args),
      tree:    () => this.cmdTree(),
      projects:() => this.cmdProjects(),
      project: () => this.cmdProject(args),
      tech:    () => this.cmdTech(),
      stack:   () => this.cmdTech(),
      contact: () => this.cmdContact(),
      clear:   () => this.cmdClear(),
      history: () => this.cmdHistory(),
      cat:     () => this.cmdCat(args),
      neofetch:() => this.cmdNeofetch(),
      echo:    () => this.cmdEcho(args),
      date:    () => this.cmdDate(),
      uptime:  () => this.cmdUptime(),
    };

    if (commands[cmd]) {
      commands[cmd]();
    } else {
      this.printLine(`zsh: command not found: ${cmd}`, 'error');
      this.printLine('Escribe "help" para ver los comandos disponibles.', 'dim');
    }

    this.scrollToBottom();
  }

  printLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `term-emulator__line ${className}`;
    line.textContent = text;
    this.output.appendChild(line);
  }

  printHTML(html, className = '') {
    const line = document.createElement('div');
    line.className = `term-emulator__line ${className}`;
    line.innerHTML = html;
    this.output.appendChild(line);
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      this.output.scrollTo({
        top: this.output.scrollHeight,
        behavior: 'smooth'
      });
    });
  }

  clear() {
    this.output.innerHTML = '';
  }

  // ── COMANDOS ────────────────────────────────────────

  cmdHelp() {
    const cmds = [
      ['help',         'Mostrar esta ayuda'],
      ['whoami',       'Información personal'],
      ['skills',       'Habilidades y niveles'],
      ['ls [carpeta]', 'Listar proyectos (ciberseguridad|ia|appweb)'],
      ['tree',         'Ver árbol completo de proyectos'],
      ['projects',     'Listar todos los proyectos'],
      ['project <id>', 'Ver detalles de un proyecto'],
      ['tech',         'Stack tecnológico'],
      ['contact',      'Canales de contacto'],
      ['cat <archivo>','Leer archivos del sistema'],
      ['neofetch',     'Info del sistema'],
      ['history',      'Historial de comandos'],
      ['clear',        'Limpiar terminal'],
      ['date',         'Fecha y hora actual'],
      ['uptime',       'Tiempo activo'],
    ];
    this.printLine('');
    this.printLine('  Comandos disponibles:', 'help-header');
    this.printLine('  ─────────────────────────────────────────', 'dim');
    cmds.forEach(([name, desc]) => {
      this.printHTML(`  <span class="term-cmd">${name.padEnd(16)}</span><span class="term-desc">${desc}</span>`);
    });
    this.printLine('');
  }

  cmdWhoami() {
    this.printLine('');
    this.printLine('  ┌─────────────────────────────────────────────────────┐', 'cyan');
    this.printLine('  │  David Alexander Colorado Rodríguez                 │', 'cyan');
    this.printLine('  │  Ingeniero de Sistemas — Especialista en CiberSeg   │', 'cyan');
    this.printLine('  └─────────────────────────────────────────────────────┘', 'cyan');
    this.printLine('');
    this.printLine('  Experiencia: 3+ años freelance (2022 - 2026)', 'highlight');
    this.printLine('  Ubicación:   Bogotá, Colombia');
    this.printLine('  Educación:   Ing. de Sistemas — Universidad Distrital');
    this.printLine('');
    this.printLine('  Certificaciones:', 'highlight');
    this.printLine('  ├── Google Cybersecurity Professional Certificate (2024)');
    this.printLine('  ├── Cisco Cybersecurity Essentials (2025)');
    this.printLine('  └── Análisis de Datos — MinTIC (2023)');
    this.printLine('');
    this.printLine('  Especializado en:', 'highlight');
    this.printLine('  ├── CiberSeguridad (ofensiva y defensiva)');
    this.printLine('  ├── Agentes de IA aplicados a seguridad');
    this.printLine('  ├── Automatización de procesos');
    this.printLine('  ├── Seguridad en la nube (AWS)');
    this.printLine('  └── Detección y respuesta a incidentes');
    this.printLine('');
    this.printLine('  "Experiencia combinada en desarrollo de agentes de IA', 'dim');
    this.printLine('   aplicados a seguridad, automatización de procesos y', 'dim');
    this.printLine('   análisis de vulnerabilidades."', 'dim');
    this.printLine('');
  }

  cmdSkills() {
    const skills = [
      { name: 'CiberSeguridad',     pct: 90, color: 'green' },
      { name: 'IA / Automatización', pct: 85, color: 'magenta' },
      { name: 'Desarrollo Web',     pct: 85, color: 'blue' },
      { name: 'Cloud Security',     pct: 75, color: 'cyan' },
      { name: 'Redes / Protocolos', pct: 80, color: 'yellow' },
      { name: 'Python',             pct: 90, color: 'yellow' },
      { name: 'Rust',               pct: 80, color: 'green' },
      { name: 'Bash / Shell',       pct: 85, color: 'cyan' },
    ];
    this.printLine('');
    this.printLine('  Habilidades:', 'highlight');
    this.printLine('');
    skills.forEach(s => {
      const filled = Math.round(s.pct / 5);
      const empty = 20 - filled;
      const bar = '█'.repeat(filled) + '░'.repeat(empty);
      this.printHTML(`  <span class="term-skill-name">${s.name.padEnd(20)}</span><span class="term-bar-${s.color}">${bar}</span> <span class="term-pct">${s.pct}%</span>`);
    });
    this.printLine('');
    this.printLine('  Herramientas de Seguridad:', 'highlight');
    this.printLine('  Metasploit · Burp Suite · Nmap · Wireshark · Nessus · John the Ripper · SQLmap');
    this.printLine('');
    this.printLine('  SIEM y Monitoreo:', 'highlight');
    this.printLine('  Splunk · Nagios');
    this.printLine('');
    this.printLine('  Metodologías:', 'highlight');
    this.printLine('  NIST · ISO 27001 · Red Team / Blue Team · PTES');
    this.printLine('');
  }

  cmdLs(args) {
    if (!this.projectsData) {
      this.printLine('Error: no se pudieron cargar los proyectos.', 'error');
      return;
    }

    const filter = args[0];
    const portfolios = filter
      ? this.projectsData.portfolios.filter(p => p.id === filter)
      : this.projectsData.portfolios;

    if (filter && portfolios.length === 0) {
      this.printLine(`ls: no hay acceso a '${filter}': Directorio no encontrado`, 'error');
      this.printLine('Directorios disponibles: ciberseguridad, ia, appweb', 'dim');
      return;
    }

    this.printLine('');
    portfolios.forEach(p => {
      const colorClass = `term-dir-${p.color}`;
      this.printLine(`  ${p.name}/`, colorClass);
      this.printLine(`  # ${p.description}`, 'dim');
      p.projects.forEach(proj => {
        this.printHTML(`    <span class="term-file">├── ${proj.name}/</span>  <span class="term-dim">${proj.tagline.substring(0, 50)}...</span>`);
      });
      this.printLine('');
    });
  }

  cmdTree() {
    if (!this.projectsData) return;
    this.printLine('');
    this.printLine('  ~/proyectos/', 'highlight');
    this.projectsData.portfolios.forEach((p, pi) => {
      const isLastPortfolio = pi === this.projectsData.portfolios.length - 1;
      const prefix = isLastPortfolio ? '└── ' : '├── ';
      const prefixChild = isLastPortfolio ? '    ' : '│   ';
      this.printLine(`  ${prefix}${p.name}/`, `term-dir-${p.color}`);
      p.projects.forEach((proj, j) => {
        const isLast = j === p.projects.length - 1;
        const pfx = isLast ? '└── ' : '├── ';
        this.printHTML(`  ${prefixChild}${pfx}<span class="term-file">${proj.name}/</span>`);
      });
    });
    this.printLine('');
  }

  cmdProjects() {
    if (!this.projectsData) return;
    this.printLine('');
    this.projectsData.portfolios.forEach(p => {
      this.printLine(`  ── ${p.name.toUpperCase()} ${'─'.repeat(40 - p.name.length)}`, `term-dir-${p.color}`);
      p.projects.forEach(proj => {
        const metrics = proj.metrics.map(m => `${m.label}: ${m.value}`).join(' │ ');
        this.printHTML(`    <span class="term-file">${proj.name}</span>`);
        this.printLine(`      ${proj.tagline}`, 'dim');
        this.printLine(`      ${metrics}`, 'dim');
      });
      this.printLine('');
    });
  }

  cmdProject(args) {
    if (!args[0]) {
      this.printLine('Uso: project <nombre>', 'error');
      this.printLine('Ejemplo: project cloudsentinel', 'dim');
      return;
    }

    const query = args.join('_').toLowerCase();
    let found = null;
    let portfolio = null;

    for (const p of this.projectsData.portfolios) {
      const match = p.projects.find(proj =>
        proj.id === query || proj.name.toLowerCase().includes(query)
      );
      if (match) {
        found = match;
        portfolio = p;
        break;
      }
    }

    if (!found) {
      this.printLine(`Proyecto '${args.join(' ')}' no encontrado.`, 'error');
      this.printLine('Usa "ls" o "projects" para ver los disponibles.', 'dim');
      return;
    }

    this.printLine('');
    this.printLine('━'.repeat(60), 'green');
    this.printLine(`  ${found.name}`, 'project-title');
    this.printLine(`  ${found.tagline}`, 'dim');
    this.printLine('━'.repeat(60), 'green');
    this.printLine('');
    this.printLine('  DESCRIPCIÓN', 'highlight');
    this.printLine(`  ${found.description}`);
    this.printLine('');
    this.printLine('  TECNOLOGÍAS', 'highlight');
    this.printHTML(`  <span class="term-tech">${found.technologies.join(' · ')}</span>`);
    this.printLine('');
    this.printLine('  MÉTRICAS', 'highlight');
    found.metrics.forEach(m => {
      this.printHTML(`  <span class="term-metric-label">${m.label}:</span> <span class="term-metric-value">${m.value}</span>`);
    });
    this.printLine('');
    this.printLine('  CARACTERÍSTICAS', 'highlight');
    found.highlights.forEach((h, i) => {
      const prefix = i === found.highlights.length - 1 ? '└──' : '├──';
      this.printLine(`  ${prefix} ${h}`);
    });
    this.printLine('');
  }

  cmdTech() {
    const stack = {
      'Languages':   ['Python', 'Rust', 'Bash', 'Java', 'JavaScript', 'C++'],
      'Frontend':    ['React', 'Vue.js', 'Angular', 'HTML5', 'CSS'],
      'Backend':     ['Node.js', 'FastAPI', 'Express'],
      'AI/ML':       ['Multiagente', 'Detección phishing', 'Gemini', 'Ollama'],
      'Cloud':       ['AWS', 'Docker', 'GitHub Actions'],
      'Security':    ['Metasploit', 'Burp Suite', 'Nmap', 'Wireshark', 'Nessus', 'SQLmap'],
      'Databases':   ['PostgreSQL', 'MySQL', 'MongoDB'],
      'SO':          ['ArchLinux', 'Kali', 'Parrot', 'Ubuntu', 'Windows Server'],
    };
    this.printLine('');
    this.printLine('  Stack Tecnológico:', 'highlight');
    this.printLine('');
    Object.entries(stack).forEach(([category, techs]) => {
      this.printHTML(`  <span class="term-cmd">${category.padEnd(14)}</span> ${techs.map(t => `<span class="term-tech-item">${t}</span>`).join(' ')}`);
    });
    this.printLine('');
  }

  cmdContact() {
    this.printLine('');
    this.printLine('  Canales de contacto:', 'highlight');
    this.printLine('');
    this.printHTML('  <span class="term-cyan">{ }</span>  GitHub      <span class="term-dim">→</span>  <span class="term-link">github.com/DaCr2153</span>');
    this.printHTML('  <span class="term-yellow">✉</span>   WhatsApp   <span class="term-dim">→</span>  <span class="term-link">+57 322 387 1744</span>');
    this.printHTML('  <span class="term-green">@</span>   Email       <span class="term-dim">→</span>  <span class="term-link">daacolorador@gmail.com</span>');
    this.printHTML('  <span class="term-green">🔒</span>   ProtonMail <span class="term-dim">→</span>  <span class="term-link">DaCr2153@proton.me</span>');
    this.printLine('');
    this.printLine('  También puedes usar los botones en la sección "contacto".', 'dim');
    this.printLine('');
  }

  cmdCat(args) {
    const files = {
      'profile': () => this.cmdWhoami(),
      'skills':  () => this.cmdSkills(),
      'stack':   () => this.cmdTech(),
      'contact': () => this.cmdContact(),
      'readme':  () => {
        this.printLine('');
        this.printLine('  # Portafolio Terminal UI — David Colorado', 'highlight');
        this.printLine('');
        this.printLine('  Especialista en CiberSeguridad, Automatización y Seguridad en la Nube.');
        this.printLine('  3+ años de experiencia freelance desarrollando automatizaciones,');
        this.printLine('  arquitecturas multiagente y herramientas de seguridad.');
        this.printLine('');
        this.printLine('  10 proyectos en 3 dominios:', 'highlight');
        this.printLine('  ├── CiberSeguridad (5 proyectos)');
        this.printLine('  ├── Inteligencia Artificial (3 proyectos)');
        this.printLine('  └── Aplicaciones Web (2 proyectos)');
        this.printLine('');
        this.printLine('  Certificaciones:', 'highlight');
        this.printLine('  ├── Google Cybersecurity Professional Certificate');
        this.printLine('  ├── Cisco Cybersecurity Essentials');
        this.printLine('  └── Certificación en Análisis de Datos — MinTIC');
        this.printLine('');
        this.printLine('  Built with HTML, CSS & JavaScript.', 'dim');
        this.printLine('');
      },
      'motd': () => {
        this.printLine('');
        this.printLine('  ╔════════════════════════════════════════════════════╗', 'yellow');
        this.printLine('  ║  Bienvenido al portafolio de David Colorado       ║', 'yellow');
        this.printLine('  ║  Especialista en CiberSeguridad y Automatización  ║', 'yellow');
        this.printLine('  ║  Explora mis proyectos con los comandos           ║', 'yellow');
        this.printLine('  ║  o navega usando las pestañas de arriba.          ║', 'yellow');
        this.printLine('  ╚════════════════════════════════════════════════════╝', 'yellow');
        this.printLine('');
      },
      'cv': () => {
        this.printLine('');
        this.printLine('  ── RESUMEN PROFESIONAL ──────────────────────────────', 'highlight');
        this.printLine('');
        this.printLine('  David Alexander Colorado Rodríguez');
        this.printLine('  Ingeniero de Sistemas — Especialista en Ciberseguridad');
        this.printLine('  Bogotá, Colombia | +57 322 387 1744');
        this.printLine('  daacolorador@gmail.com | DaCr2153@proton.me');
        this.printLine('');
        this.printLine('  PERFIL:', 'highlight');
        this.printLine('  Especialista en Ciberseguridad con 3 años de experiencia');
        this.printLine('  freelance desarrollando automatizaciones, arquitecturas');
        this.printLine('  multiagente y herramientas de seguridad.');
        this.printLine('');
        this.printLine('  EXPERIENCIA:', 'highlight');
        this.printLine('  ├── Desarrollador Freelance (2022-2026)');
        this.printLine('  │   Automatización, IA y Seguridad');
        this.printLine('  ├── Instructor de Seguridad Informática (2023-2025)');
        this.printLine('  │   GISAC - ACM Chapter, Universidad Distrital');
        this.printLine('  └── Instructor de Linux (2024)');
        this.printLine('      GIOS - ACM Chapter, Universidad Distrital');
        this.printLine('');
        this.printLine('  EDUCACIÓN:', 'highlight');
        this.printLine('  ├── Ingeniería de Sistemas (en proceso de tesis)');
        this.printLine('  │   Universidad Distrital Francisco José de Caldas');
        this.printLine('  ├── Diplomado en Desarrollo de Aplicaciones Web');
        this.printLine('  │   Universidad Nacional de Colombia');
        this.printLine('  └── Programa Misión TIC 2022');
        this.printLine('');
        this.printLine('  CERTIFICACIONES:', 'highlight');
        this.printLine('  ├── Google Cybersecurity Professional Certificate (2024)');
        this.printLine('  ├── Cisco Cybersecurity Essentials (2025)');
        this.printLine('  └── Certificación en Análisis de Datos — MinTIC (2023)');
        this.printLine('');
      },
    };

    if (!args[0]) {
      this.printLine('Uso: cat <archivo>', 'error');
      this.printLine('Archivos: profile, skills, stack, contact, readme, motd, cv', 'dim');
      return;
    }

    const file = args[0].toLowerCase();
    if (files[file]) {
      files[file]();
    } else {
      this.printLine(`cat: ${file}: No existe tal archivo o directorio`, 'error');
      this.printLine('Archivos: profile, skills, stack, contact, readme, motd, cv', 'dim');
    }
  }

  cmdNeofetch() {
    this.printLine('');
    this.printLine('        .--.        David Colorado', 'green');
    this.printLine('       |o_o |       Ingeniero de Sistemas', 'green');
    this.printLine('       |:_/ |       ─────────────────────', 'dim');
    this.printLine('      //   \\ \\      OS: PortfolioOS 2.0 (Linux)', 'dim');
    this.printLine('     (|     | )     Host: GitHub Pages', 'dim');
    this.printLine("    /'\\_   _/`\\     Shell: zsh 5.9", 'dim');
    this.printLine('    \\___)=(___/     Terminal: Portfolio-TUI v1.0', 'dim');
    this.printLine('');
    this.printLine('  Experiencia:  3+ años freelance (2022-2026)', 'dim');
    this.printLine('  Educación:    Ing. Sistemas — Universidad Distrital', 'dim');
    this.printLine('  Certs:        Google Cybersecurity · Cisco · MinTIC', 'dim');
    this.printLine('');
    this.printLine('  Languages:   Python · Rust · Bash · Java · JavaScript · C++', 'dim');
    this.printLine('  Frontend:    React · Vue.js · Angular', 'dim');
    this.printLine('  Backend:     Node.js · FastAPI · Express', 'dim');
    this.printLine('  AI/ML:       Multiagente · Detección phishing · Gemini', 'dim');
    this.printLine('  Cloud:       AWS · Docker · GitHub Actions', 'dim');
    this.printLine('  Security:    Metasploit · Burp Suite · Nmap · Wireshark', 'dim');
    this.printLine('  Databases:   PostgreSQL · MySQL · MongoDB', 'dim');
    this.printLine('');
  }

  cmdEcho(args) {
    this.printLine(args.join(' '));
  }

  cmdDate() {
    const now = new Date();
    this.printLine(now.toString());
  }

  cmdUptime() {
    const start = performance.now();
    const seconds = Math.floor(start / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    this.printLine(`Uptime: ${hours}h ${minutes % 60}m ${seconds % 60}s`);
  }

  cmdHistory() {
    if (this.history.length === 0) {
      this.printLine('No hay comandos en el historial.', 'dim');
      return;
    }
    this.printLine('');
    this.history.forEach((cmd, i) => {
      this.printHTML(`  <span class="term-dim">${String(i + 1).padStart(4)}</span>  ${cmd}`);
    });
    this.printLine('');
  }

  cmdClear() {
    this.clear();
  }
}

function initTerminalEmulator() {
  const container = document.getElementById('heroTerminal');
  if (!container) return;
  new PortfolioTerminal(container);
}

document.addEventListener('bootComplete', () => {
  setTimeout(initTerminalEmulator, 100);
});
