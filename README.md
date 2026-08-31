# Portafolio Profesional — Terminal UI

## Especificación de Diseño e Implementación

---

## 1. Concepto

### 1.1 Identidad Visual

El portafolio se presenta como un **emulador de terminal** interactivo. Cada sección es una "salida de comando" que el visitante puede explorar. La estética comunica inmediatamente expertise técnico — no es un portafolio que diga "soy ingeniero", es un portafolio que se *ve* como uno.

### 1.2 Por qué Terminal

- **Differentación:** El 99% de portafolios usan el mismo layout card-based. Un terminal es inmediatamente memorable.
- **Coherencia profesional:** Un ingeniero de sistemas especializado en ciberseguridad y cloud *debería* tener un portafolio que refleje su entorno de trabajo.
- **Interactividad natural:** Los usuarios técnicos entienden la metáfora de comandos. Es intuitivo para el público objetivo.
- **Performance:** La estética terminal es minimalista por naturaleza — menos CSS, menos JS, más rendimiento.

### 1.3 Tecnología

| Capa | Elección |
|------|----------|
| Estructura | HTML5 semántico |
| Estilos | CSS3 vanilla (custom properties) |
| Interactividad | JavaScript vanilla (ES6+) |
| Fuente | JetBrains Mono (Google Fonts) |
| Despliegue | GitHub Pages |

---

## 2. Sistema de Diseño

### 2.1 Paleta de Colores

Inspirada en terminales reales (kitty, alacritty, wezterm). Negro profundo con acentos de color que representan cada dominio técnico.

```css
/* === FONDOS === */
--bg-terminal:      #0a0e14;    /* Fondo principal del terminal */
--bg-titlebar:      #141921;    /* Barra de título de la ventana */
--bg-tabbar:        #0d1117;    /* Barra de pestañas */
--bg-tab-active:    #0a0e14;    /* Pestaña activa (merge con terminal) */
--bg-selection:     rgba(62, 68, 81, 0.5); /* Selección de texto */
--bg-hover:         rgba(136, 198, 147, 0.08); /* Hover sutil */

/* === TEXTO === */
--text-primary:     #c5cdd9;    /* Texto principal — blanco suave */
--text-secondary:   #7a8599;    /* Texto secundario, comentarios */
--text-muted:       #4a5568;    /* Texto deshabilitado, prompt inactivo */

/* === COLORES DEL TERMINAL (ANSI) === */
--term-green:       #88c6a0;    /* Prompt, éxito, archivos ejecutables */
--term-cyan:        #6cb4c9;    /* Directorios, enlaces */
--term-yellow:      #e5c07b;    /* Advertencias, métricas destacadas */
--term-red:         #e06c75;    /* Errores, alertas críticas */
--term-blue:        #61afef;    /* Navegación, archivos especiales */
--term-magenta:     #c678dd;    /* Keywords, especialmente importantes */
--term-white:       #abb2bf;    /* Texto normal en comandos */
--term-orange:      #d19a66;    /* Strings, valores */

/* === ACENTOS POR PORTAFOLIO === */
--accent-cyber:     #88c6a0;    /* CiberSeguridad — verde (seguridad, defensa) */
--accent-ai:        #c678dd;    /* Inteligencia Artificial — magenta (innovación) */
--accent-web:       #61afef;    /* Aplicaciones Web — azul (confiabilidad) */

/* === BORDES === */
--border-terminal:  #2c313c;    /* Borde de la ventana del terminal */
--border-tab:       #1e2530;    /* Borde entre pestañas */
--border-focus:     #3e4451;    /* Bordes en foco */
```

### 2.2 Tipografía

Solo se usa **JetBrains Mono** — una fuente monoespaciada diseñada para desarrolladores. Toda la interfaz es monoespaciada, reforzando la estética terminal.

```css
--font-mono:  'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

--text-xs:    0.75rem;    /* 12px — comentarios, metadatos */
--text-sm:    0.8125rem;  /* 13px — texto secundario */
--text-base:  0.875rem;   /* 14px — cuerpo (tamaño estándar de terminal) */
--text-md:    1rem;       /* 16px — títulos de sección */
--text-lg:    1.125rem;   /* 18px — títulos principales */
--text-xl:    1.25rem;    /* 20px — hero title */
--text-2xl:   1.5rem;     /* 24px — display */
```

### 2.3 Espaciado

Grid de 4px para mantener la sensación de densidad de información propia de terminales.

```css
--sp-1:  0.25rem;   /* 4px */
--sp-2:  0.5rem;    /* 8px */
--sp-3:  0.75rem;   /* 12px */
--sp-4:  1rem;      /* 16px */
--sp-5:  1.5rem;    /* 24px */
--sp-6:  2rem;      /* 32px */
--sp-8:  3rem;      /* 48px */
--sp-10: 4rem;      /* 64px */
```

---

## 3. Estructura de la Ventana del Terminal

### 3.1 Layout Global

```
┌──────────────────────────────────────────────────────────┐
│ ● ● ●    portfolio — zsh — 80×24                         │  ← Title bar
├──────────────────────────────────────────────────────────┤
│ [~]  [proyectos]  [contacto]                   [☀/🌙]   │  ← Tab bar
├──────────────────────────────────────────────────────────┤
│                                                          │
│  $ _                                                     │  ← Contenido del
│                                                          │    terminal (scroll)
│  [Sección activa — scroll vertical]                      │
│                                                          │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ ^C ^C ^C    UTF-8  LF  zsh  80×24              [tabs]   │  ← Status bar
└──────────────────────────────────────────────────────────┘
```

### 3.2 Title Bar

```html
<div class="terminal__titlebar">
  <div class="terminal__dots">
    <span class="dot dot--red"></span>
    <span class="dot dot--yellow"></span>
    <span class="dot dot--green"></span>
  </div>
  <span class="terminal__title">portfolio — zsh — 80×24</span>
  <div class="terminal__titlebar-actions">
    <button class="theme-toggle" id="themeToggle" aria-label="Cambiar tema">
      <span class="theme-toggle__icon">☀</span>
    </button>
  </div>
</div>
```

**CSS:**
```css
.terminal__titlebar {
  display: flex;
  align-items: center;
  padding: var(--sp-2) var(--sp-4);
  background: var(--bg-titlebar);
  border-bottom: 1px solid var(--border-terminal);
  user-select: none;
}

.terminal__dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot--red    { background: #e06c75; }
.dot--yellow { background: #e5c07b; }
.dot--green  { background: #88c6a0; }

.terminal__title {
  flex: 1;
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
}
```

### 3.3 Tab Bar (Navegación)

Cada pestaña es un "directorio" que el usuario puede explorar. La pestaña activa se fusiona visualmente con el terminal.

```html
<div class="terminal__tabbar">
  <button class="tab tab--active" data-section="hero">
    <span class="tab__icon">~</span>
    <span class="tab__label">inicio</span>
  </button>
  <button class="tab" data-section="about">
    <span class="tab__icon">⟩</span>
    <span class="tab__label">sobre-mi</span>
  </button>
  <button class="tab" data-section="projects">
    <span class="tab__icon">⟩</span>
    <span class="tab__label">proyectos</span>
  </button>
  <button class="tab" data-section="contact">
    <span class="tab__icon">⟩</span>
    <span class="tab__label">contacto</span>
  </button>
</div>
```

**CSS:**
```css
.terminal__tabbar {
  display: flex;
  background: var(--bg-tabbar);
  border-bottom: 1px solid var(--border-terminal);
  overflow-x: auto;
  scrollbar-width: none;
}

.terminal__tabbar::-webkit-scrollbar { display: none; }

.tab {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  padding: var(--sp-2) var(--sp-4);
  background: transparent;
  border: none;
  border-right: 1px solid var(--border-tab);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.tab--active {
  color: var(--term-green);
  background: var(--bg-terminal);
  border-bottom: 2px solid var(--term-green);
  margin-bottom: -1px;
}

.tab__icon {
  color: var(--term-cyan);
  font-weight: bold;
}
```

### 3.4 Status Bar

```html
<div class="terminal__statusbar">
  <span class="statusbar__left">
    <span class="statusbar__item statusbar__item--accent">UTF-8</span>
    <span class="statusbar__item">LF</span>
    <span class="statusbar__item">zsh</span>
  </span>
  <span class="statusbar__right">
    <span class="statusbar__item">Ln 1, Col 1</span>
    <span class="statusbar__item statusbar__item--accent">80×24</span>
  </span>
</div>
```

---

## 4. Secciones del Terminal

### 4.1 Boot Sequence (Hero)

Al cargar la página, se ejecuta una secuencia de boot animada antes de mostrar el contenido principal.

**Flujo de animación:**

```
[0.0s]  BIOS POST Check ...                          [OK]
[0.3s]  Memory: 16384 MB ...                         [OK]
[0.6s]  Loading kernel modules ...                    [OK]
[0.9s]  Mounting filesystems ...                      [OK]
[1.2s]  Starting network ...                          [OK]
[1.5s]  Loading portfolio.service ...                 [OK]
[1.8s]  ████████████████████████████████████ 100%
[2.0s]
[2.1s]  Welcome to PortfolioOS v2.0
[2.2s]  Last login: Sat Aug 30 from [location]
[2.3s]
[2.4s]  $ whoami
```

Luego se muestra la información personal con efecto typing:

```
$ whoami
[Nombre Completo]

$ cat /etc/motd
Ingeniero de Software
Especializado en CiberSeguridad · Inteligencia Artificial · Cloud

$ echo $FOCUS
Arquitecturas escalables, sistemas distribuidos y seguridad ofensiva/defensiva.

$ ls ~/proyectos/
ciberseguridad/  ia/  appweb/

$ _
```

**CSS del boot:**
```css
.boot-sequence {
  padding: var(--sp-4);
  font-size: var(--text-sm);
}

.boot-line {
  display: flex;
  justify-content: space-between;
  opacity: 0;
  animation: boot-appear 0.1s ease forwards;
}

.boot-line__status {
  color: var(--term-green);
  font-weight: bold;
}

.boot-line--welcome {
  color: var(--term-yellow);
  font-size: var(--text-md);
  margin-top: var(--sp-4);
}

.boot-progress {
  width: 100%;
  height: 2px;
  background: var(--border-terminal);
  margin: var(--sp-2) 0;
  overflow: hidden;
  opacity: 0;
}

.boot-progress__fill {
  height: 100%;
  background: var(--term-green);
  width: 0%;
  transition: width 0.5s linear;
}
```

### 4.2 Sección "Sobre Mí" — Estilo neofetch

Cuando el usuario hace click en la pestaña "sobre-mi", se ejecuta un comando simulado:

```
$ neofetch --portfolio

       .--.        [Nombre]
      |o_o |       Ingeniero de Software
      |:_/ |       ─────────────────────
     //   \ \      OS: PortfolioOS 2.0 (Linux)
    (|     | )     Host: GitHub Pages
   /'\_   _/`\     Kernel: HTML5/CSS3/JS
   \___)=(___/     Shell: zsh 5.9
                   Terminal: Portfolio-TUI v1.0
                   CPU: Creative + Analytical
                   Memory: 10+ Proyectos
                   Uptime: Since 2024

   === STACK ===
   Languages:   Rust · Python · Go · TypeScript
   Frontend:    React · Vite · Tailwind
   Backend:     FastAPI · Express · gorilla/mux
   AI/ML:       scikit-learn · PyTorch · Gemini
   Cloud:       AWS · Docker · Kubernetes
   Security:    Metasploit · Volatility · YARA

   === SKILLS ===
   CiberSeguridad     ████████████████████░░░░  85%
   Intelig. Artificial ██████████████████░░░░░░  75%
   Desarrollo Web      █████████████████████░░░  90%
   Cloud/DevOps        ███████████████████░░░░░  80%
```

**CSS neofetch:**
```css
.neofetch {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--sp-6);
  padding: var(--sp-4);
}

.neofetch__ascii {
  color: var(--term-green);
  font-size: var(--text-xs);
  line-height: 1.3;
  white-space: pre;
}

.neofetch__info {
  font-size: var(--text-sm);
}

.neofetch__label {
  color: var(--term-cyan);
  font-weight: bold;
}

.neofetch__separator {
  color: var(--text-muted);
}

.neofetch__value {
  color: var(--text-primary);
}

.neofetch__section-title {
  color: var(--term-yellow);
  margin-top: var(--sp-4);
  font-weight: bold;
}

.skill-bar {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin: var(--sp-1) 0;
  font-size: var(--text-xs);
}

.skill-bar__label {
  width: 180px;
  color: var(--text-primary);
}

.skill-bar__track {
  flex: 1;
  height: 4px;
  background: var(--border-terminal);
  position: relative;
}

.skill-bar__fill {
  height: 100%;
  background: var(--term-green);
  width: 0%;
  transition: width 1.5s ease-out;
}

.skill-bar__pct {
  width: 35px;
  text-align: right;
  color: var(--text-secondary);
}
```

### 4.3 Sección "Proyectos" — Estilo ls/tree

Los proyectos se muestran como salida de `ls -la` o `tree`. Cada portafolio es un directorio, cada proyecto es un subdirectorio.

```
$ tree ~/proyectos/ --dirs-first -L 2

~/proyectos/
├── ciberseguridad/                  [VERDE] Seguridad ofensiva y defensiva
│   ├── CloudSentinel_ZeroTrust/     SIEM + ML anomaly detection
│   ├── DangerZone/                  Document sanitizer (Rust sandbox)
│   ├── ForensIQ/                    Memory forensics + threat hunting
│   ├── RedOps_Automatico/           Pentesting automatizado con LLM
│   └── VPNForge/                    Suite VPN multi-protocolo
├── ia/                               [MAGENTA] Agentes IA y ML aplicado
│   ├── InvimaRSMolecula/            Agentes IA registro sanitario
│   ├── ProcesamientoAudioIA/        Restauración audio DSP + neural
│   └── ResurgeAgent/                Coordinación respuesta desastres
└── appweb/                           [AZUL] Aplicaciones web full-stack
    ├── ColorCafe/                   PWA análisis café con visión IA
    └── FinalStore/                  E-commerce AI + voice search
```

Al seleccionar un proyecto (click), se muestra su "man page" detallada:

```
$ cat ~/proyectos/ciberseguridad/CloudSentinel_ZeroTrust/README.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  CloudSentinel Zero-Trust
  SIEM ligero con ML para detección de anomalías en AWS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  DESCRIPCIÓN
  Sistema de gestión de información y eventos de seguridad
  con motor de detección de anomalías basado en ML. Diseñado
  para ejecutarse completamente en AWS Free Tier.

  TECNOLOGÍAS
  Python · AWS · scikit-learn · CloudFormation · OpenSearch

  MÉTRICAS
  MTTD:  <2min          FPR:  <5%
  Tests: 90%+           Reglas: 8 MITRE ATT&CK

  CARACTERÍSTICAS
  ├── Isolation Forest (11k eventos sintéticos)
  ├── Simulación de ataques con Pacu
  ├── Dashboard OpenSearch (10 paneles)
  └── Deploy one-click con Bash

  [→ Ver en GitHub]    [← Volver]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**CSS de proyecto cards (estilo terminal):**
```css
.project-entry {
  display: grid;
  grid-template-columns: 1fr auto;
  padding: var(--sp-2) var(--sp-3);
  border-left: 2px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.project-entry:hover {
  background: var(--bg-hover);
  border-left-color: var(--term-green);
}

.project-entry__name {
  color: var(--term-cyan);
  font-weight: bold;
}

.project-entry__arrow {
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.project-entry:hover .project-entry__arrow {
  opacity: 1;
}

.project-entry__desc {
  color: var(--text-secondary);
  font-size: var(--text-xs);
  grid-column: 1 / -1;
  padding-left: var(--sp-4);
}

/* Separator entre directorios */
.portfolio-group {
  margin: var(--sp-4) 0;
  padding-bottom: var(--sp-2);
  border-bottom: 1px dashed var(--border-terminal);
}

.portfolio-group__header {
  color: var(--term-green);
  font-weight: bold;
  font-size: var(--text-sm);
  padding: var(--sp-2) 0;
}

.portfolio-group__header span {
  color: var(--text-secondary);
  font-weight: normal;
}
```

### 4.4 Sección "Contacto" — Estilo SSH/connection

```
$ ssh contact@portfolio.local

Connecting to portfolio.local ...
Connection established.
Authenticated.

  ┌─────────────────────────────────────────┐
  │  CANALES DE COMUNICACIÓN                │
  │                                         │
  │  GitHub:    github.com/[USERNAME]       │
  │  WhatsApp:  wa.me/[NUMERO]             │
  │  Email:     [EMAIL]                     │
  │                                         │
  │  ─── o envía un mensaje ───             │
  │                                         │
  │  > Nombre:    [_________________]       │
  │  > Email:     [_________________]       │
  │  > Mensaje:   [_________________]       │
  │                                         │
  │  $ enviar                               │
  └─────────────────────────────────────────┘
```

**CSS del formulario estilo terminal:**
```css
.contact-form {
  padding: var(--sp-4);
  border: 1px solid var(--border-terminal);
  background: var(--bg-terminal);
}

.contact-form__field {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: var(--sp-2);
  margin: var(--sp-2) 0;
  align-items: center;
}

.contact-form__label {
  color: var(--term-cyan);
  text-align: right;
}

.contact-form__input {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border-terminal);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  padding: var(--sp-1) 0;
  outline: none;
  transition: border-color 0.2s ease;
}

.contact-form__input:focus {
  border-bottom-color: var(--term-green);
}

.contact-form__input::placeholder {
  color: var(--text-muted);
}

.contact-form__submit {
  margin-top: var(--sp-4);
  padding: var(--sp-2) var(--sp-4);
  background: transparent;
  border: 1px solid var(--term-green);
  color: var(--term-green);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}

.contact-form__submit:hover {
  background: var(--term-green);
  color: var(--bg-terminal);
}
```

### 4.5 Sección Métricas — Estilo htop/system

```
$ cat /proc/portfolio/stats

  ┌─ Portfolio Metrics ────────────────────────────────┐
  │                                                     │
  │  Proyectos:     10        [████████████████████] 100%│
  │  Tests:         1200+     [████████████████░░░░]  80%│
  │  Lenguajes:     7+        [██████████████░░░░░░]  70%│
  │  Frameworks:    5+        [██████████░░░░░░░░░░]  50%│
  │                                                     │
  └─────────────────────────────────────────────────────┘
```

---

## 5. Efectos y Animaciones

### 5.1 Boot Sequence (JS)

```javascript
const BOOT_LINES = [
  { text: 'BIOS POST Check', delay: 300 },
  { text: 'Memory: 16384 MB', delay: 300 },
  { text: 'Loading kernel modules', delay: 300 },
  { text: 'Mounting filesystems', delay: 200 },
  { text: 'Starting network', delay: 200 },
  { text: 'Loading portfolio.service', delay: 400 },
];

async function runBootSequence(container) {
  for (const line of BOOT_LINES) {
    await typeBootLine(container, line.text, line.delay);
  }
  await showProgress(container);
  await clearBoot(container);
  showMainContent();
}
```

### 5.2 Typing Effect

```javascript
async function typeText(element, text, speed = 40) {
  for (const char of text) {
    element.textContent += char;
    await sleep(speed);
  }
}
```

### 5.3 Cursor Parpadeante

```css
.cursor {
  display: inline-block;
  width: 8px;
  height: 1.1em;
  background: var(--term-green);
  margin-left: 2px;
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

### 5.4 Scanline Overlay (Sutil)

```css
.terminal::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
  z-index: 10;
}
```

### 5.5 Glow Effect en Hover

```css
.project-entry:hover {
  text-shadow: 0 0 8px rgba(136, 198, 160, 0.3);
}
```

### 5.6 Scroll Reveal (Secciones)

Cada sección aparece con un efecto de "línea siendo escrita":

```css
.section-content {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.section-content.visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 6. Responsive Design

### 6.1 Breakpoints

| Breakpoint | Ajustes |
|------------|---------|
| **< 768px** (Mobile) | Terminal fullscreen sin bordes redondeados, tabs scrollables horizontalmente, boot sequence simplificada, fuente reducida a 12px |
| **768-1023px** (Tablet) | Terminal con bordes, 2 columnas en neofetch si cabe |
| **> 1024px** (Desktop) | Layout completo, neofetch con ASCII art, todas las animaciones |

### 6.2 Mobile

```css
@media (max-width: 767px) {
  .terminal {
    border-radius: 0;
    border: none;
    height: 100vh;
    height: 100dvh;
  }

  .terminal__titlebar {
    padding: var(--sp-1) var(--sp-3);
  }

  .tab {
    padding: var(--sp-2) var(--sp-3);
    font-size: 11px;
  }

  .neofetch {
    grid-template-columns: 1fr;
  }

  .neofetch__ascii {
    display: none; /* Ocultar ASCII art en mobile */
  }

  .boot-sequence {
    font-size: 11px;
  }
}
```

---

## 7. Accesibilidad

| Requisito | Implementación |
|-----------|---------------|
| **Contraste** | Todos los colores ANSI cumplen ratio 4.5:1 sobre fondo #0a0e14 |
| **Tab order** | Pestañas navegables con Tab, Enter para activar |
| **Focus visible** | Outline visible en pestañas, inputs y botones |
| **Reduced motion** | `prefers-reduced-motion` salta boot sequence, desactiva scanline y blink |
| **ARIA** | Roles `tablist`, `tab`, `tabpanel`, `aria-selected` en navegación |
| **Skip link** | "Saltar al contenido principal" visible al hacer Tab desde el body |

---

## 8. SEO

Mismo que la versión anterior — meta tags, Open Graph, JSON-LD structured data. El título será:

```
[Nombre] — Ingeniero de Software | Portafolio Terminal
```

---

## 9. Performance

| Métrica | Objetivo |
|---------|----------|
| LCP | < 1.0s (sin imágenes pesadas) |
| FID | < 30ms (JS mínimo) |
| CLS | < 0.01 (todo monoespaciado, sin layout shift) |
| Bundle | < 30KB (CSS + JS sin fonts) |

---

## 10. Archivos a Crear

```
PortafolioGitHub/
├── index.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── terminal.css      # Title bar, tab bar, status bar, window
│   ├── sections.css      # Boot, neofetch, projects, contact, metrics
│   └── animations.css    # Typing, blink, scanline, reveal
├── js/
│   ├── app.js            # Init, tab navigation, scroll
│   ├── boot.js           # Boot sequence animation
│   ├── terminal.js       # Typing effect, command simulation
│   ├── projects.js       # Render projects from JSON, filtering
│   ├── modal.js          # Project detail modal
│   ├── theme.js          # Dark/light toggle
│   └── contact.js        # Form validation
├── data/
│   └── projects.json
└── assets/
    └── images/
        └── og-image.png
```

---

## 11. Datos — projects.json

Estructura completa de los 10 proyectos con todas las métricas, tecnologías y highlights documentados en la sección de implementación.

---

## 12. Checklist

### Funcionalidad
- [ ] Boot sequence animada al cargar
- [ ] Navegación por pestañas funciona
- [ ] Secciones se muestran/ocultan correctamente
- [ ] Proyectos se renderizan desde JSON
- [ ] Click en proyecto muestra detalle (man page)
- [ ] Filtro por portafolio funciona
- [ ] Modal de proyecto abre/cierra
- [ ] Formulario valida y muestra estados
- [ ] Botones de contacto abren enlaces correctos
- [ ] Theme toggle funciona y persiste

### Visual
- [ ] Estética terminal consistente en todas las secciones
- [ ] Scanline overlay sutil
- [ ] Cursor parpadeante
- [ ] Typing effect en boot y comandos
- [ ] Hover glow en project entries
- [ ] Tabs con indicador activo

### Responsive
- [ ] Mobile: layout correcto, tabs scrollables
- [ ] Desktop: neofetch con ASCII art

### Performance
- [ ] Lighthouse ≥ 95
- [ ] Bundle < 30KB

---

*Documento de especificación — Portafolio Terminal UI*
*2026-08-30*

