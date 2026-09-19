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
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.autocomplete();
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
      man:     () => this.cmdMan(args),
      sudo:    () => this.cmdSudo(args),
      nmap:    () => this.cmdNmap(args),
      exploit: () => this.cmdExploit(),
      ping:    () => this.cmdPing(args),
      curl:    () => this.cmdCurl(args),
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
      ['skills',       'Habilidades y tecnologías'],
      ['ls [carpeta]', 'Listar proyectos (ciberseguridad|ia|appweb)'],
      ['tree',         'Ver árbol completo de proyectos'],
      ['projects',     'Listar todos los proyectos'],
      ['project <id>', 'Ver detalles de un proyecto'],
      ['tech',         'Stack tecnológico'],
      ['contact',      'Canales de contacto'],
      ['cat <archivo>','Leer archivos del sistema'],
      ['man <cmd>',    'Manual de un comando'],
      ['nmap <target>','Simular escaneo de red'],
      ['exploit',      'Herramientas de seguridad'],
      ['ping <host>',  'Test de conectividad'],
      ['curl <url>',   'Consultar API del portafolio'],
      ['sudo <cmd>',   'Ejecutar con privilegios'],
      ['neofetch',     'Info del sistema'],
      ['history',      'Historial de comandos'],
      ['clear',        'Limpiar terminal'],
      ['date',         'Fecha y hora actual'],
      ['uptime',       'Tiempo activo'],
      ['Tab',          'Autocompletar comando'],
      ['?',            'Atajos de teclado'],
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
    this.printLine('  │  Ingeniero de Sistemas en Formación — Ciberseg Jr  │', 'cyan');
    this.printLine('  └─────────────────────────────────────────────────────┘', 'cyan');
    this.printLine('');
    this.printLine('  Experiencia: 3 años freelance (2022 - 2026)', 'highlight');
    this.printLine('  Ubicación:   Bogotá, Colombia');
    this.printLine('  Educación:   Ing. de Sistemas — Universidad Distrital');
    this.printLine('');
    this.printLine('  Certificaciones:', 'highlight');
    this.printLine('  ├── Google Cybersecurity Professional Certificate (2024)');
    this.printLine('  ├── Cisco Cybersecurity Essentials (2025)');
    this.printLine('  └── Análisis de Datos — MinTIC (2023)');
    this.printLine('');
    this.printLine('  Especializado en:', 'highlight');
    this.printLine('  Ciberseguridad (ofensiva y defensiva)');
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
    this.printLine('');
    this.printLine('  Stack Tecnológico:', 'highlight');
    this.printLine('');
    this.printLine('  Languages:    Python · Rust · Bash · Java · JavaScript');
    this.printLine('  Frontend:     React · HTML5 · CSS');
    this.printLine('  Backend:      Node.js · FastAPI');
    this.printLine('  AI/ML:        Agentes multiagente · Detección phishing · Ollama · Gemini');
    this.printLine('  Cloud:        AWS (básico) · Docker · GitHub Actions');
    this.printLine('  Security:     Nmap · Metasploit · Burp Suite · Wireshark · John the Ripper');
    this.printLine('  Databases:    PostgreSQL · MySQL · MongoDB');
    this.printLine('  SO:           Kali · Parrot · Ubuntu · ArchLinux');
    this.printLine('  Concepts:     NIST CSF · ISO 27001 · Red Team / Blue Team');
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
      'Languages':   ['Python', 'Rust', 'Bash', 'Java', 'JavaScript'],
      'Frontend':    ['React', 'HTML5', 'CSS'],
      'Backend':     ['Node.js', 'FastAPI'],
      'AI/ML':       ['Agentes multiagente', 'Detección phishing', 'Gemini', 'Ollama'],
      'Cloud':       ['AWS (básico)', 'Docker', 'GitHub Actions'],
      'Security':    ['Nmap', 'Metasploit', 'Burp Suite', 'Wireshark', 'John the Ripper'],
      'Databases':   ['PostgreSQL', 'MySQL', 'MongoDB'],
      'SO':          ['Kali', 'Parrot', 'Ubuntu', 'ArchLinux'],
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
    this.printHTML('  <span class="term-blue">in</span>  LinkedIn    <span class="term-dim">→</span>  <span class="term-link">linkedin.com/in/TU-USUARIO</span>');
    this.printHTML('  <span class="term-green">@</span>   Correo      <span class="term-dim">→</span>  <span class="term-link">daacolorador@gmail.com</span>');
    this.printHTML('  <span class="term-green">🔒</span>   Correo Seg  <span class="term-dim">→</span>  <span class="term-link">DaCr2153@proton.me</span>');
    this.printLine('');
    this.printLine('  También puedes encontrar los enlaces en la sección "contacto".', 'dim');
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
        this.printLine('  Ciberseguridad Junior, automatización y desarrollo de aplicaciones.');
        this.printLine('  3 años de experiencia freelance desarrollando herramientas de');
        this.printLine('  seguridad, automatización y agentes de IA para clientes empresariales.');
        this.printLine('');
        this.printLine('  10 proyectos en 3 dominios:', 'highlight');
        this.printLine('  ├── Ciberseguridad (5 proyectos)');
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
        this.printLine('  ║  Ciberseguridad Junior y Automatización           ║', 'yellow');
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
        this.printLine('  Ingeniero de Sistemas en Formación — Ciberseguridad Junior');
        this.printLine('  Bogotá, Colombia');
        this.printLine('  daacolorador@gmail.com | DaCr2153@proton.me');
        this.printLine('');
        this.printLine('  PERFIL:', 'highlight');
        this.printLine('  Ciberseguridad Junior con 3 años de experiencia');
        this.printLine('  freelance desarrollando automatizaciones, herramientas');
        this.printLine('  de seguridad y agentes de IA para clientes empresariales.');
        this.printLine('');
        this.printLine('  EXPERIENCIA:', 'highlight');
        this.printLine('  ├── Desarrollador Freelance (2022-2026)');
        this.printLine('  │   Ciberseguridad, Automatización y Seguridad');
        this.printLine('  ├── Instructor de Seguridad Informática (2023-2025)');
        this.printLine('  │   GISAC - ACM Chapter, Universidad Distrital');
        this.printLine('  └── Instructor de Linux (2024)');
        this.printLine('      GIOS - ACM Chapter, Universidad Distrital');
        this.printLine('');
        this.printLine('  EDUCACIÓN:', 'highlight');
        this.printLine('  ├── Ingeniería de Sistemas (2021-2027, tesis en proceso)');
        this.printLine('  │   Universidad Distrital Francisco José de Caldas');
        this.printLine('  ├── Diplomado en Desarrollo de Aplicaciones Web (2021)');
        this.printLine('  │   Universidad Nacional de Colombia');
        this.printLine('  └── Misión TIC 2022 (Ciclos 1, 2, 3 y 4a)');
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
    this.printLine('       |o_o |       Ingeniero de Sistemas en Formación', 'green');
    this.printLine('       |:_/ |       ─────────────────────', 'dim');
    this.printLine('      //   \\ \\      OS: PortfolioOS 2.0 (Linux)', 'dim');
    this.printLine('     (|     | )     Host: GitHub Pages', 'dim');
    this.printLine("    /'\\_   _/`\\     Shell: zsh 5.9", 'dim');
    this.printLine('    \\___)=(___/     Terminal: Portfolio-TUI v1.0', 'dim');
    this.printLine('');
    this.printLine('  Experiencia:  3 años freelance (2022-2026)', 'dim');
    this.printLine('  Educación:    Ing. Sistemas — Universidad Distrital', 'dim');
    this.printLine('  Certs:        Google Cybersecurity · Cisco · MinTIC', 'dim');
    this.printLine('');
    this.printLine('  Languages:   Python · Rust · Bash · Java · JavaScript', 'dim');
    this.printLine('  Frontend:    React · HTML5 · CSS', 'dim');
    this.printLine('  Backend:     Node.js · FastAPI', 'dim');
    this.printLine('  AI/ML:       Agentes multiagente · Detección phishing · Ollama', 'dim');
    this.printLine('  Cloud:       AWS (básico) · Docker · GitHub Actions', 'dim');
    this.printLine('  Security:    Nmap · Metasploit · Burp Suite · Wireshark', 'dim');
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

  // ── AUTOCOMPLETE ──────────────────────────────────────
  autocomplete() {
    const value = this.input.value.trim().toLowerCase();
    if (!value) return;

    const commands = ['help','whoami','about','skills','ls','tree','projects','project','tech','stack','contact','clear','history','cat','neofetch','echo','date','uptime','man','sudo','nmap','exploit','ping','curl'];
    const matches = commands.filter(c => c.startsWith(value));

    if (matches.length === 1) {
      this.input.value = matches[0] + ' ';
      this.updateCursor();
    } else if (matches.length > 1) {
      this.printLine(`$ ${this.input.value}`, 'input-echo');
      this.printHTML(matches.map(m => `<span class="term-cmd">${m}</span>`).join('  '));
      this.scrollToBottom();
    }
  }

  // ── COMANDOS NUEVOS ──────────────────────────────────
  cmdMan(args) {
    const manPages = {
      'whoami': 'Muestra información personal y profesional.',
      'skills': 'Lista las habilidades técnicas y tecnologías.',
      'ls': 'Lista proyectos por categoría: ciberseguridad, ia, appweb.',
      'projects': 'Muestra todos los proyectos con métricas.',
      'project': 'Uso: project <nombre> — Detalles de un proyecto específico.',
      'tech': 'Muestra el stack tecnológico completo.',
      'contact': 'Muestra canales de contacto disponibles.',
      'cat': 'Lee archivos del sistema: profile, skills, stack, contact, readme, motd, cv.',
      'neofetch': 'Información del sistema con ASCII art.',
      'nmap': 'Simula un escaneo de red (demostración).',
      'exploit': 'Lista herramientas de seguridad disponibles.',
      'sudo': 'Ejecuta comando con privilegios elevados (easter egg).',
      'tree': 'Muestra árbol completo de proyectos.',
      'clear': 'Limpia la terminal.',
      'history': 'Muestra historial de comandos.',
      'man': 'Uso: man <comando> — Muestra manual de un comando.',
    };
    if (!args[0]) {
      this.printLine('Uso: man <comando>', 'error');
      this.printLine(`Comandos disponibles: ${Object.keys(manPages).join(', ')}`, 'dim');
      return;
    }
    const page = manPages[args[0].toLowerCase()];
    if (page) {
      this.printLine('');
      this.printLine(`  ${args[0].toUpperCase()}(1)                    Portfolio Manual                    ${args[0].toUpperCase()}(1)`, 'highlight');
      this.printLine('');
      this.printLine(`  NOMBRE`, 'highlight');
      this.printLine(`      ${args[0]} - ${page}`);
      this.printLine('');
    } else {
      this.printLine(`man: no hay entrada para '${args[0]}'`, 'error');
    }
  }

  cmdSudo(args) {
    if (args.length === 0) {
      this.printLine('usage: sudo <command>', 'error');
      return;
    }
    this.printLine('');
    this.printLine('  [sudo] password for david: ********', 'dim');
    this.printLine('');
    this.printLine('  ✓ Acceso concedido. Bienvenido, Administrador.', 'green');
    this.printLine('  "Con gran poder viene gran responsabilidad."', 'dim');
    this.printLine('');
  }

  cmdNmap(args) {
    const target = args[0] || 'localhost';
    this.printLine('');
    this.printLine(`  Starting Nmap 7.94 ( https://nmap.org )`, 'dim');
    this.printLine(`  Nmap scan report for ${target}`, 'highlight');
    this.printLine(`  Host is up (0.0023s latency).`);
    this.printLine('');
    this.printLine('  PORT     STATE  SERVICE      VERSION', 'highlight');
    this.printLine('  22/tcp   open   ssh          OpenSSH 8.9p1');
    this.printLine('  80/tcp   open   http         nginx 1.18.0');
    this.printLine('  443/tcp  open   https        nginx 1.18.0');
    this.printLine('  3306/tcp closed mysql        MySQL 8.0');
    this.printLine('  8080/tcp open   http-proxy   Portfolio v2.0');
    this.printLine('');
    this.printLine('  Nmap done: 1 IP address (1 host up) scanned in 0.42s', 'dim');
    this.printLine('');
  }

  cmdExploit() {
    this.printLine('');
    this.printLine('  ╔══════════════════════════════════════════════════╗', 'yellow');
    this.printLine('  ║  Herramientas de Seguridad Disponibles          ║', 'yellow');
    this.printLine('  ╚══════════════════════════════════════════════════╝', 'yellow');
    this.printLine('');
    this.printLine('  RECON:', 'highlight');
    this.printLine('  ├── Nmap — Network discovery y port scanning');
    this.printLine('  ├── Wireshark — Network protocol analyzer');
    this.printLine('  └── Recon-ng — Framework de reconocimiento');
    this.printLine('');
    this.printLine('  EXPLOIT:', 'highlight');
    this.printLine('  ├── Metasploit — Framework de penetration testing');
    this.printLine('  ├── Burp Suite — Web application security testing');
    this.printLine('  └── SQLmap — Automated SQL injection');
    this.printLine('');
    this.printLine('  POST-EXPLOIT:', 'highlight');
    this.printLine('  ├── John the Ripper — Password cracking');
    this.printLine('  ├── Hydra — Brute force attacks');
    this.printLine('  └── Mimikatz — Credential extraction');
    this.printLine('');
    this.printLine('  DEFENSA:', 'highlight');
    this.printLine('  ├── Nessus — Vulnerability assessment');
    this.printLine('  ├── Snort — Network intrusion detection');
    this.printLine('  └── OSSEC — Host-based intrusion detection');
    this.printLine('');
  }

  cmdPing(args) {
    const host = args[0] || 'portfolio.local';
    this.printLine('');
    this.printLine(`  PING ${host} (127.0.0.1): 56 data bytes`, 'dim');
    for (let i = 1; i <= 4; i++) {
      const time = (Math.random() * 5 + 1).toFixed(3);
      this.printLine(`  64 bytes from 127.0.0.1: icmp_seq=${i} ttl=64 time=${time} ms`);
    }
    this.printLine('');
    this.printLine(`  --- ${host} ping statistics ---`, 'dim');
    this.printLine(`  4 packets transmitted, 4 received, 0% packet loss`, 'dim');
    this.printLine('');
  }

  cmdCurl(args) {
    this.printLine('');
    this.printLine('  HTTP/1.1 200 OK', 'green');
    this.printLine('  Content-Type: application/json', 'dim');
    this.printLine('  X-Portfolio-Version: 2.0', 'dim');
    this.printLine('');
    this.printLine('  {', 'highlight');
    this.printLine('    "name": "David Alexander Colorado Rodríguez",');
    this.printLine('    "role": "Ciberseguridad Junior",');
    this.printLine('    "status": "available",');
    this.printLine('    "location": "Bogotá, Colombia",');
    this.printLine('    "projects": 10,');
    this.printLine('    "experience": "3 años",');
    this.printLine('    "open_to_work": true');
    this.printLine('  }');
    this.printLine('');
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
