<script lang="ts">
  import { onMount, tick } from 'svelte';

  // ─── State ───────────────────────────────────────────────────────────────────
  let canvasEl = $state<HTMLCanvasElement | null>(null);
  let navScrolled = $state(false);
  let activeSection = $state('hero');
  let cursorX = $state(0);
  let cursorY = $state(0);
  let cursorVisible = $state(false);
  let typewriterText = $state('');
  let hoveredSlice = $state<number | null>(null);

  // ─── Blog ────────────────────────────────────────────────────────────────────
  let fadeObs: IntersectionObserver | null = null;
  interface Post { id: string; title: string; content: string; date: string; }
  let posts = $state<Post[]>([]);
  let postsLoading = $state(false);

  const WORKER_URL = import.meta.env.VITE_BLOG_WORKER_URL ?? '';

  async function loadPosts() {
    if (!WORKER_URL) return;
    postsLoading = true;
    try {
      const res = await fetch(`${WORKER_URL}/api/posts`);
      if (res.ok) posts = await res.json();
    } catch { /* sin conexión al worker */ }
    finally {
      postsLoading = false;
      await tick();
      document.querySelectorAll('.fade-in:not(.visible)').forEach((el) => fadeObs?.observe(el));
    }
  }

  function renderMarkdown(raw: string): string {
    return raw
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  const roles = [
    'Tech Lead & Solution Architect',
    'QA & AI Strategy Expert',
    'Full Stack Senior Developer',
    'GenAI Applied to Software',
    'COBOL Modernization Lead',
  ];

  const techStack = [
    { name: 'TypeScript & Node.js',    pct: 25, color: '#6366f1', glow: 'rgba(99,102,241,0.5)',   icon: '⚡', category: 'Frontend'     },
    { name: 'AI / LLM',      pct: 20, color: '#8b5cf6', glow: 'rgba(139,92,246,0.5)',   icon: '🤖', category: 'AI'           },
    { name: 'System Design', pct: 13, color: '#f59e0b', glow: 'rgba(245,158,11,0.5)',   icon: '🏗️', category: 'Architecture' },
    { name: 'Frontend',  pct: 5, color: '#06b6d4', glow: 'rgba(6,182,212,0.5)',    icon: '🎨', category: 'Frontend'     },
    { name: 'Python',        pct:  4, color: '#3b82f6', glow: 'rgba(59,130,246,0.5)',   icon: '🐍', category: 'Backend'      },
    { name: 'Cloud & Infra',    pct:  20, color: '#ec4899', glow: 'rgba(236,72,153,0.5)',   icon: '🐳', category: 'DevOps'       },
    { name: 'Data Management',    pct:  13, color: '#64748b', glow: 'rgba(100,116,139,0.5)',  icon: '🗄️', category: 'Data'         },
  ];

  // ─── Pie chart helpers ────────────────────────────────────────────────────────
  const CX = 160, CY = 160, R_OUT = 140, R_IN = 72, GAP = 2;

  function polar(r: number, deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  }

  function slicePath(startDeg: number, endDeg: number, expand = 0) {
    const span = endDeg - startDeg;
    if (span >= 359.999) return '';
    const mid = startDeg + span / 2;
    const ox = expand ? Math.cos(((mid - 90) * Math.PI) / 180) * expand : 0;
    const oy = expand ? Math.sin(((mid - 90) * Math.PI) / 180) * expand : 0;
    const os = polar(R_OUT, startDeg + GAP / 2);
    const oe = polar(R_OUT, endDeg   - GAP / 2);
    const ie = polar(R_IN,  endDeg   - GAP / 2);
    const is_ = polar(R_IN, startDeg + GAP / 2);
    const large = span > 180 ? 1 : 0;
    return `M ${os.x + ox} ${os.y + oy} A ${R_OUT} ${R_OUT} 0 ${large} 1 ${oe.x + ox} ${oe.y + oy} L ${ie.x + ox} ${ie.y + oy} A ${R_IN} ${R_IN} 0 ${large} 0 ${is_.x + ox} ${is_.y + oy} Z`;
  }

  const slices = $derived.by(() => {
    let cum = 0;
    return techStack.map((item, i) => {
      const start = cum * 3.6;
      cum += item.pct;
      const end = cum * 3.6;
      const mid = start + (end - start) / 2;
      const labelR = R_OUT + 22;
      const lp = polar(labelR, mid);
      return { ...item, i, start, end, mid, path: slicePath(start, end), labelPos: lp };
    });
  });

  const projects = [
    {
      title: 'Personal Page',
      description: 'Este mismo sitio — construido con Svelte 5, efectos CSS avanzados y animaciones fluidas.',
      tags: ['Svelte 5', 'TypeScript', 'CSS', 'Vite'],
      icon: '🌐',
      year: '2026',
    },
    {
      title: 'AI-Powered Dashboard',
      description: 'Panel analítico que integra modelos LLM para análisis de datos en tiempo real.',
      tags: ['React', 'Python', 'Claude API', 'PostgreSQL'],
      icon: '📊',
      year: '2025',
    },
    {
      title: 'Microservices Platform',
      description: 'Arquitectura distribuida con alta disponibilidad, observabilidad y deploys automáticos.',
      tags: ['Node.js', 'Docker', 'K8s', 'Redis'],
      icon: '⚙️',
      year: '2025',
    },
    {
      title: 'Real-Time Collaboration',
      description: 'Herramienta de colaboración en tiempo real con WebSockets, OT y conflict resolution.',
      tags: ['Svelte', 'WebSocket', 'TypeScript', 'Rust'],
      icon: '👥',
      year: '2024',
    },
  ];

  const strengths = [
    { icon: '🧠', title: 'Pensamiento sistémico', desc: 'Capacidad para ver el panorama completo y diseñar soluciones escalables que resisten el paso del tiempo.' },
    { icon: '⚡', title: 'Velocidad de ejecución', desc: 'De la idea al código en producción con criterio, sin sacrificar calidad por velocidad.' },
    { icon: '🤝', title: 'Comunicación técnica', desc: 'Traduzco conceptos complejos a lenguaje claro, tanto para equipos técnicos como para stakeholders.' },
    { icon: '🔁', title: 'Aprendizaje continuo', desc: 'Más de 20 años en la industria con mentalidad de principiante. Siempre actualizándome.' },
    { icon: '🎯', title: 'Orientación a resultados', desc: 'Foco en el impacto real del producto, no solo en el código perfectamente elegante.' },
    { icon: '🛡️', title: 'Código defensivo', desc: 'Escribo software robusto, seguro y mantenible. La deuda técnica me quita el sueño.' },
  ];

  const timeline = [
    {
      year: 'Jun 2024 – Actualidad',
      role: 'Arquitecto de Soluciones de Calidad & IA',
      company: 'NTT DATA · Madrid (Híbrido)',
      desc: 'Rol estratégico de innovación en transformación digital a gran escala. Diseño de agentes IA autónomos con LLMs para verificación y validación del software. Plataforma de generación automática de casos de prueba con IA. Liderazgo de migraciones COBOL a tecnologías modernas. Formación a equipos de Europa y LATAM.',
      highlights: ['Agentes IA para QA', 'Test Case Generation', 'Migración COBOL', 'Europa & LATAM'],
    },
    {
      year: 'Feb 2021 – Jun 2024',
      role: 'QA Automation Lead / Developer',
      company: 'Capitole Consulting · Cliente: BBVA · Madrid',
      desc: 'Liderazgo técnico en automatización de pruebas para uno de los mayores bancos de Europa. Arquitectura de frameworks con Selenium, Cucumber y WebdriverIO. Integración de herramientas de calidad en el SDLC para detección temprana de errores. Capas de abstracción para stakeholders no técnicos.',
      highlights: ['Selenium', 'Cucumber', 'WebdriverIO', 'BBVA'],
    },
    {
      year: 'Sep 2018 – Jul 2021',
      role: 'Senior Full-Stack Developer',
      company: 'Centum Digital · Madrid',
      desc: 'Infraestructura de microservicios integrada con AWS Device Farm para validación de dispositivos IoT y móviles a escala. Automatización multi-plataforma: Smartphones, Smart TVs, STBs y WebApps.',
      highlights: ['Microservicios', 'AWS Device Farm', 'IoT', 'Multi-plataforma'],
    },
    {
      year: '2013 – 2018',
      role: 'Consultor Full Stack & Web Developer',
      company: 'Freelance · Madrid',
      desc: 'Proyectos para clientes como Wunderman (Land Rover), Anlddea, Informatiz@rte y Meollo. Full Stack con CakePHP, jQuery, APIs SOAP/JSON y arquitectura MVC para sectores automoción, cooperación ciudadana y agrícola.',
      highlights: ['Land Rover', 'CakePHP', 'APIs SOAP', 'eCommerce'],
    },
    {
      year: '2010 – 2013',
      role: 'Ingeniero de Software',
      company: 'ATOS – DAESA · Cliente: BBVA · Madrid',
      desc: 'Diseño y desarrollo de software para monitoreo de SLAs, procesos ETL y herramientas de gestión de stock para centros del grupo BBVA.',
      highlights: ['SLA Monitoring', 'ETL', 'BBVA', 'Java'],
    },
  ];

  // ─── Particle Canvas ─────────────────────────────────────────────────────────
  function initCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')!;
    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const count = 80;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.opacity})`;
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${(1 - dist / 120) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }

  // ─── Typewriter ──────────────────────────────────────────────────────────────
  function startTypewriter() {
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseFrames = 0;
    const tick = () => {
      const current = roles[roleIdx];
      if (deleting) {
        if (pauseFrames > 0) { pauseFrames--; setTimeout(tick, 50); return; }
        typewriterText = current.slice(0, --charIdx);
        if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
        setTimeout(tick, 60);
      } else {
        typewriterText = current.slice(0, ++charIdx);
        if (charIdx === current.length) { deleting = true; pauseFrames = 30; }
        setTimeout(tick, 80);
      }
    };
    tick();
  }

  // ─── Observers ───────────────────────────────────────────────────────────────
  function observeSections() {
    const obs = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) activeSection = e.target.id; },
      { threshold: 0.3 }
    );
    document.querySelectorAll('section[id]').forEach((s) => obs.observe(s));
    return obs;
  }

  function observeFadeIns() {
    fadeObs = new IntersectionObserver(
      (entries) => { for (const e of entries) if (e.isIntersecting) e.target.classList.add('visible'); },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.fade-in').forEach((el) => fadeObs!.observe(el));
    return fadeObs;
  }

  // ─── Magnetic ────────────────────────────────────────────────────────────────
  function attachMagnetic(el: HTMLElement) {
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const onLeave = () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      el.style.transform = '';
      setTimeout(() => (el.style.transition = ''), 500);
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────────
  onMount(() => {
    const cleanups: (() => void)[] = [];
    if (canvasEl) cleanups.push(initCanvas(canvasEl));
    startTypewriter();
    const sObs = observeSections();
    const fObs = observeFadeIns();
    const onScroll = () => (navScrolled = window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    const onMouseMove = (e: MouseEvent) => { cursorX = e.clientX; cursorY = e.clientY; cursorVisible = true; };
    const onMouseLeave = () => (cursorVisible = false);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.querySelectorAll<HTMLElement>('.magnetic').forEach((el) => cleanups.push(attachMagnetic(el)));
    loadPosts();
    return () => {
      cleanups.forEach((c) => c());
      sObs.disconnect(); fObs.disconnect();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  });

  const navLinks = [
    { id: 'about', label: 'Sobre mí' },
    { id: 'strengths', label: 'Fortalezas' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'experience', label: 'Experiencia' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contacto' },
  ];
</script>

<!-- Custom cursor -->
<div class="cursor" style="left:{cursorX}px; top:{cursorY}px; opacity:{cursorVisible ? 1 : 0}"></div>
<div class="cursor-dot" style="left:{cursorX}px; top:{cursorY}px; opacity:{cursorVisible ? 1 : 0}"></div>

<!-- ── NAV ── -->
<nav class:scrolled={navScrolled}>
  <a href="#hero" class="logo">CL<span>.</span></a>
  <ul>
    {#each navLinks as link}
      <li><a href="#{link.id}" class:active={activeSection === link.id}>{link.label}</a></li>
    {/each}
  </ul>
  <div class="nav-actions">
    <a href="/cv" class="nav-cv" title="Ver CV imprimible">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>
      CV
    </a>
    <a href="mailto:carlos.developer1983@gmail.com" class="nav-cta magnetic">Contáctame</a>
  </div>
</nav>

<!-- ── HERO ── -->
<section id="hero" class="hero">
  <canvas bind:this={canvasEl} class="particle-canvas"></canvas>
  <div class="aurora">
    <div class="aurora-1"></div>
    <div class="aurora-2"></div>
    <div class="aurora-3"></div>
  </div>
  <div class="hero-content">
    <div class="hero-badge fade-in">
      <span class="pulse-dot"></span>
      Disponible para proyectos
    </div>
    <h1 class="hero-name fade-in">
      <span class="name-line">Carlos</span>
      <span class="name-line gradient-text">Ledesma</span>
    </h1>
    <p class="hero-role fade-in">
      <span class="role-prefix">// </span>
      <span class="typewriter">{typewriterText}</span>
      <span class="cursor-blink">|</span>
    </p>
    <p class="hero-subtitle fade-in">
      Tech Lead · Arquitecto de Calidad & IA · Full Stack Senior<br />
      +13 años transformando ingeniería en impacto real — desde la banca hasta la IA generativa.
    </p>
    <div class="hero-actions fade-in">
      <a href="#projects" class="btn-primary magnetic">
        <span>Ver proyectos</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <a href="mailto:carlos.developer1983@gmail.com" class="btn-secondary magnetic">Hablemos</a>
      <a href="/cv" class="btn-secondary magnetic">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
        CV imprimible
      </a>
    </div>
    <div class="hero-stats fade-in">
      <div class="stat"><span class="stat-number">13+</span><span class="stat-label">Años de experiencia</span></div>
      <div class="stat-divider"></div>
      <div class="stat"><span class="stat-number">2</span><span class="stat-label">Continentes impactados</span></div>
      <div class="stat-divider"></div>
      <div class="stat"><span class="stat-number">∞</span><span class="stat-label">Bugs detectados antes</span></div>
    </div>
  </div>
  <div class="scroll-hint"><span>scroll</span><div class="scroll-line"></div></div>
</section>

<!-- ── ABOUT ── -->
<section id="about" class="about">
  <div class="container">
    <div class="about-grid">
      <div class="about-visual fade-in">
        <div class="avatar-wrapper">
          <div class="avatar-ring"></div>
          <div class="avatar-ring ring-2"></div>
          <div class="avatar"><span class="avatar-initials">CL</span></div>
          <div class="avatar-badge">Senior</div>
        </div>
        <div class="about-tags">
          {#each ['TypeScript', 'Python', 'Agentes IA', 'QA Architecture', 'AWS', 'COBOL Migration'] as tag}
            <span class="tech-tag">{tag}</span>
          {/each}
        </div>
      </div>
      <div class="about-text fade-in">
        <p class="section-label">Sobre mí</p>
        <h2>Tech Lead en la intersección de <span class="gradient-text">Calidad e IA</span></h2>
        <p>Soy Tech Lead y Arquitecto de Software con +13 años de experiencia en el ciclo completo del software (SDLC), especializado en la intersección entre <strong>Ingeniería de Calidad</strong>, <strong>Automatización</strong> e <strong>Inteligencia Artificial Generativa</strong>.</p>
        <p>He liderado modernizaciones de ecosistemas legado —incluyendo migraciones de <strong>COBOL a tecnologías modernas</strong>— y el diseño de <strong>Agentes IA aplicados a calidad</strong> en grandes corporaciones bancarias como BBVA, con impacto directo en equipos de Europa y LATAM.</p>
        <p>Mi diferencial: entiendo el problema de calidad <strong>desde la arquitectura</strong>, no solo desde el testing. Combino base técnica sólida con capacidad real de liderazgo, mentoring y traducción de necesidades de negocio en soluciones accionables.</p>
        <div class="about-links">
          <a href="mailto:carlos.developer1983@gmail.com" class="about-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
            carlos.developer1983@gmail.com
          </a>
          <a href="https://github.com/munchkin09" target="_blank" rel="noopener" class="about-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          <a href="https://linkedin.com/in/carlosledesmac" target="_blank" rel="noopener" class="about-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── STRENGTHS ── -->
<section id="strengths" class="strengths">
  <div class="container">
    <div class="section-header fade-in">
      <p class="section-label">Qué me diferencia</p>
      <h2>Mis puntos <span class="gradient-text">fuertes</span></h2>
      <p class="section-sub">No solo escribo código. Construyo sistemas, lidero equipos y genero impacto.</p>
    </div>
    <div class="strengths-grid">
      {#each strengths as s, i}
        <div class="strength-card fade-in" style="transition-delay: {i * 80}ms">
          <div class="strength-icon">{s.icon}</div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
          <div class="card-glow"></div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ── SKILLS ── -->
<section id="skills" class="skills-section">
  <div class="container">
    <div class="section-header fade-in">
      <p class="section-label">Toolkit</p>
      <h2>Stack <span class="gradient-text">técnico</span></h2>
      <p class="section-sub">Hover cada porción para ver el detalle de cada tecnología.</p>
    </div>

    <div class="chart-layout fade-in">
      <div class="chart-wrap">
        <svg viewBox="0 0 320 320" class="pie-svg" role="img" aria-label="Tech stack pie chart">
          <defs>
            {#each slices as s}
              <radialGradient id="grad-{s.i}" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color={s.color} stop-opacity="1"/>
                <stop offset="100%" stop-color={s.color} stop-opacity="0.7"/>
              </radialGradient>
            {/each}
          </defs>

          {#each slices as s}
            <path
              d={hoveredSlice === s.i ? slicePath(s.start, s.end, 10) : s.path}
              fill="url(#grad-{s.i})"
              class="pie-slice"
              style="--delay:{s.i * 55}ms; opacity:{hoveredSlice === null || hoveredSlice === s.i ? 1 : 0.3}; filter:{hoveredSlice === s.i ? `drop-shadow(0 0 12px ${s.glow})` : 'none'}"
              onmouseenter={() => (hoveredSlice = s.i)}
              onmouseleave={() => (hoveredSlice = null)}
              role="presentation"
            />
          {/each}

          {#if hoveredSlice !== null}
            {@const s = slices[hoveredSlice]}
            <text x={CX} y={CY - 18} text-anchor="middle" class="c-icon">{s.icon}</text>
            <text x={CX} y={CY + 10} text-anchor="middle" class="c-name">{s.name}</text>
            <text x={CX} y={CY + 32} text-anchor="middle" class="c-pct" style="fill:{s.color}">{s.pct}%</text>
          {:else}
            <text x={CX} y={CY + 6}  text-anchor="middle" class="c-total">100%</text>
            <text x={CX} y={CY + 26} text-anchor="middle" class="c-sub">Stack</text>
          {/if}
        </svg>
      </div>

      <div class="legend-grid">
        {#each slices as s}
          <div
            class="legend-item"
            class:is-hovered={hoveredSlice === s.i}
            class:is-dimmed={hoveredSlice !== null && hoveredSlice !== s.i}
            onmouseenter={() => (hoveredSlice = s.i)}
            onmouseleave={() => (hoveredSlice = null)}
            role="presentation"
          >
            <span class="ldot" style="background:{s.color}; box-shadow:0 0 8px {s.glow}"></span>
            <span class="licon">{s.icon}</span>
            <div class="linfo">
              <span class="lname">{s.name}</span>
              <span class="lcat">{s.category}</span>
            </div>
            <span class="lpct" style="color:{s.color}">{s.pct}%</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="extra-skills fade-in">
      {#each ['Git', 'CI/CD', 'WebSockets', 'REST', 'GraphQL', 'gRPC', 'Rust', 'Go', 'Linux', 'AWS', 'Vercel', 'Cloudflare', 'Vitest', 'Playwright', 'Figma', 'Agile/Scrum'] as tag}
        <span class="extra-tag">{tag}</span>
      {/each}
    </div>
  </div>
</section>

<!-- ── PROJECTS ── -->
<section id="projects" class="projects-section">
  <div class="container">
    <div class="section-header fade-in">
      <p class="section-label">Trabajo reciente</p>
      <h2>Proyectos <span class="gradient-text">destacados</span></h2>
    </div>
    <div class="projects-grid">
      {#each projects as project, i}
        <div class="project-card fade-in" style="transition-delay: {i * 100}ms">
          <div class="project-header">
            <span class="project-icon">{project.icon}</span>
            <span class="project-year">{project.year}</span>
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div class="project-tags">
            {#each project.tags as tag}<span class="project-tag">{tag}</span>{/each}
          </div>
          <div class="project-sheen"></div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ── EXPERIENCE ── -->
<section id="experience" class="experience-section">
  <div class="container">
    <div class="section-header fade-in">
      <p class="section-label">Trayectoria</p>
      <h2>+13 años en la <span class="gradient-text">industria</span></h2>
      <p class="section-sub">De la ingeniería clásica a los agentes IA, pasando por banca, IoT y consultoría.</p>
    </div>
    <div class="timeline">
      {#each timeline as item, i}
        <div class="timeline-item fade-in" style="transition-delay: {i * 120}ms">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <span class="timeline-year">{item.year}</span>
            <h3>{item.role}</h3>
            <span class="timeline-company">{item.company}</span>
            <p>{item.desc}</p>
            <div class="timeline-tags">
              {#each item.highlights as h}
                <span class="tl-tag">{h}</span>
              {/each}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ── BLOG ── -->
<section id="blog" class="blog-section">
  <div class="container">
    <div class="section-header fade-in">
      <p class="section-label">Últimas entradas</p>
      <h2>Blog <span class="gradient-text">& notas</span></h2>
      <p class="section-sub">Ideas, reflexiones y aprendizajes del día a día. Publicado desde Telegram.</p>
    </div>

    {#if postsLoading}
      <div class="blog-loading fade-in">
        <div class="blog-spinner"></div>
        <span>Cargando posts…</span>
      </div>
    {:else if posts.length === 0}
      <div class="blog-empty fade-in">
        <span class="blog-empty-icon">✏️</span>
        <p>Aún no hay posts. ¡Pronto habrá contenido aquí!</p>
      </div>
    {:else}
      <div class="blog-grid">
        {#each posts as post, i}
          <a href="/blog/{post.id}" class="blog-card fade-in" style="transition-delay: {i * 80}ms">
            <div class="blog-card-meta">
              <time class="blog-date">{formatDate(post.date)}</time>
              <span class="blog-id">#{post.id}</span>
            </div>
            <h3 class="blog-title">{post.title}</h3>
            <div class="blog-body">
              <p>{@html renderMarkdown(post.content)}</p>
            </div>
            <span class="blog-read-more">Leer más →</span>
            <div class="blog-card-glow"></div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- ── CONTACT ── -->
<section id="contact" class="contact-section">
  <div class="container">
    <div class="contact-inner fade-in">
      <div class="contact-glow-bg"></div>
      <p class="section-label">¿Trabajamos juntos?</p>
      <h2>Hablemos de tu <span class="gradient-text">próximo proyecto</span></h2>
      <p class="contact-sub">Siempre abierto a nuevos retos, colaboraciones y conversaciones interesantes. Ya sea un proyecto completo, una consultoría puntual o simplemente una charla técnica.</p>
      <a href="mailto:carlos.developer1983@gmail.com" class="btn-primary magnetic contact-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
        Envíame un email
      </a>
      <div class="contact-socials">
        <a href="https://github.com/munchkin09" target="_blank" rel="noopener" class="social-link magnetic">GitHub</a>
        <span class="social-sep">·</span>
        <a href="https://linkedin.com/in/carlosledesmac" target="_blank" rel="noopener" class="social-link magnetic">LinkedIn</a>
        <span class="social-sep">·</span>
        <a href="https://twitter.com/carloslc" target="_blank" rel="noopener" class="social-link magnetic">Twitter / X</a>
      </div>
    </div>
  </div>
</section>

<!-- ── FOOTER ── -->
<footer>
  <p>© 2026 Carlos Ledesma · Hecho con <span class="heart">♥</span> y <strong>Svelte 5</strong></p>
</footer>

<style>
  /* ── Custom cursor ── */
  .cursor {
    position: fixed;
    width: 36px; height: 36px;
    border: 1.5px solid rgba(99,102,241,0.6);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%,-50%);
    transition: opacity 0.3s;
    mix-blend-mode: difference;
  }
  .cursor-dot {
    position: fixed;
    width: 6px; height: 6px;
    background: #6366f1;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%,-50%);
    transition: opacity 0.3s;
  }

  /* ── Nav ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex; align-items: center; gap: 2rem;
    padding: 1.25rem 3rem;
    transition: background 0.3s, backdrop-filter 0.3s, border-color 0.3s;
    border-bottom: 1px solid transparent;
  }
  nav.scrolled {
    background: rgba(5,5,16,0.85);
    backdrop-filter: blur(20px);
    border-color: rgba(255,255,255,0.08);
  }
  .logo { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.05em; margin-right: auto; }
  .logo span { color: #6366f1; }
  nav ul { display: flex; gap: 0.25rem; list-style: none; }
  nav ul a {
    padding: 0.4rem 0.85rem; border-radius: 8px;
    font-size: 0.875rem; color: #94a3b8;
    transition: color 0.2s, background 0.2s;
  }
  nav ul a:hover, nav ul a.active { color: #f8fafc; background: rgba(255,255,255,0.04); }
  nav ul a.active { color: #6366f1; }
  .nav-actions { display: flex; align-items: center; gap: 0.6rem; }
  .nav-cv {
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.45rem 0.85rem;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 9px;
    font-size: 0.8rem; font-weight: 600; color: #cbd5e1;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .nav-cv:hover { border-color: #6366f1; color: #6366f1; background: rgba(99,102,241,0.08); }
  .nav-cta {
    padding: 0.5rem 1.25rem;
    background: #6366f1; border-radius: 9px;
    font-size: 0.875rem; font-weight: 600; color: white;
    transition: background 0.2s, box-shadow 0.2s;
    display: inline-block;
  }
  .nav-cta:hover { background: #8b5cf6; box-shadow: 0 0 20px rgba(99,102,241,0.4); }

  /* ── Hero ── */
  .hero {
    position: relative; min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; padding: 0 2rem;
  }
  .particle-canvas { position: absolute; inset: 0; pointer-events: none; }
  .aurora { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
  .aurora-1, .aurora-2, .aurora-3 {
    position: absolute; border-radius: 50%; filter: blur(80px);
    animation: aurora-float 8s ease-in-out infinite;
  }
  .aurora-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%); top: -100px; left: -100px; }
  .aurora-2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%); top: 50%; right: -100px; animation-delay: 2.5s; }
  .aurora-3 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%); bottom: 0; left: 40%; animation-delay: 5s; }
  @keyframes aurora-float {
    0%,100% { transform: translate(0,0) scale(1); }
    33% { transform: translate(40px,-30px) scale(1.1); }
    66% { transform: translate(-30px,40px) scale(0.95); }
  }
  .hero-content {
    position: relative; z-index: 2;
    max-width: 780px; text-align: center;
    display: flex; flex-direction: column; align-items: center; gap: 1.5rem;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.4rem 1rem;
    background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3);
    border-radius: 100px; font-size: 0.8rem; color: #10b981; font-weight: 500;
  }
  .pulse-dot {
    width: 8px; height: 8px; background: #10b981; border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
    50% { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
  }
  .hero-name {
    font-size: clamp(3.5rem,8vw,7rem); font-weight: 900;
    line-height: 1; letter-spacing: -0.04em;
    display: flex; flex-direction: column; align-items: center; gap: 0.1em;
  }
  .name-line {
    display: block;
    animation: name-reveal 1s cubic-bezier(0.16,1,0.3,1) both;
  }
  .name-line:nth-child(2) { animation-delay: 0.15s; }
  @keyframes name-reveal {
    from { opacity: 0; transform: translateY(40px) skewY(3deg); }
    to { opacity: 1; transform: none; }
  }
  .gradient-text {
    background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4);
    background-size: 200% 200%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradient-shift 4s ease-in-out infinite;
  }
  @keyframes gradient-shift {
    0%,100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .hero-role {
    font-size: 1.25rem; color: #94a3b8;
    font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; gap: 0.25rem;
  }
  .role-prefix { color: #06b6d4; }
  .typewriter { color: #f8fafc; }
  .cursor-blink { color: #6366f1; animation: blink 1s step-end infinite; }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
  .hero-subtitle { font-size: 1.125rem; color: #94a3b8; max-width: 560px; line-height: 1.7; }
  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.875rem 2rem;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 12px; font-weight: 600; font-size: 0.95rem; color: white;
    transition: box-shadow 0.3s;
    position: relative; overflow: hidden;
  }
  .btn-primary::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, #8b5cf6, #6366f1);
    opacity: 0; transition: opacity 0.3s;
  }
  .btn-primary:hover::before { opacity: 1; }
  .btn-primary:hover { box-shadow: 0 0 40px rgba(99,102,241,0.4), 0 8px 30px rgba(0,0,0,0.3); }
  .btn-primary > * { position: relative; }
  .btn-secondary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.875rem 2rem;
    border: 1.5px solid rgba(99,102,241,0.5); border-radius: 12px;
    font-weight: 600; font-size: 0.95rem; color: #f8fafc;
    transition: background 0.2s, border-color 0.2s, box-shadow 0.3s;
    backdrop-filter: blur(8px);
  }
  .btn-secondary:hover {
    background: rgba(255,255,255,0.04); border-color: #6366f1;
    box-shadow: 0 0 20px rgba(99,102,241,0.3);
  }
  .hero-stats {
    display: flex; align-items: center; gap: 2rem;
    padding: 1.5rem 2.5rem;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; backdrop-filter: blur(10px);
  }
  .stat { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
  .stat-number {
    font-size: 1.75rem; font-weight: 800;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .stat-label { font-size: 0.75rem; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
  .stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.08); }
  .scroll-hint {
    position: absolute; bottom: 2.5rem; left: 50%; transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    color: #475569; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.15em;
    animation: scroll-bounce 2s ease-in-out infinite;
  }
  .scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, #475569, transparent); }
  @keyframes scroll-bounce {
    0%,100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(6px); }
  }

  /* ── Shared ── */
  .container { max-width: 1100px; margin: 0 auto; padding: 0 2rem; }
  .section-header { text-align: center; margin-bottom: 4rem; }
  .section-label {
    display: inline-block; font-size: 0.75rem; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.15em; color: #6366f1; margin-bottom: 0.75rem;
  }
  .section-header h2, .about-text h2, .contact-inner h2 {
    font-size: clamp(2rem,4vw,3rem); font-weight: 800;
    letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 1rem;
  }
  .section-sub { font-size: 1.05rem; color: #94a3b8; max-width: 500px; margin: 0 auto; }

  .fade-in {
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  :global(.fade-in.visible) { opacity: 1; transform: none; }

  /* ── About ── */
  .about {
    padding: 8rem 0;
    background: linear-gradient(180deg, transparent, #0a0a1a 20%, #0a0a1a 80%, transparent);
  }
  .about-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 6rem; align-items: center; }
  .about-visual { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
  .avatar-wrapper { position: relative; width: 160px; height: 160px; display: flex; align-items: center; justify-content: center; }
  .avatar-ring {
    position: absolute; inset: -12px; border-radius: 50%;
    border: 1px solid rgba(99,102,241,0.3);
    animation: ring-spin 8s linear infinite;
  }
  .ring-2 { inset: -24px; border-color: rgba(139,92,246,0.2); animation-duration: 12s; animation-direction: reverse; }
  @keyframes ring-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .avatar {
    width: 140px; height: 140px; border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; font-weight: 900; color: white;
    box-shadow: 0 0 60px rgba(99,102,241,0.3);
  }
  .avatar-badge {
    position: absolute; bottom: 0; right: -10px;
    background: #10b981; color: white; font-size: 0.7rem; font-weight: 700;
    padding: 0.2rem 0.6rem; border-radius: 100px;
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .about-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
  .tech-tag {
    padding: 0.3rem 0.75rem; background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 100px;
    font-size: 0.8rem; color: #94a3b8; transition: border-color 0.2s, color 0.2s;
  }
  .tech-tag:hover { border-color: #6366f1; color: #6366f1; }
  .about-text { display: flex; flex-direction: column; gap: 1.25rem; }
  .about-text p { color: #94a3b8; line-height: 1.8; }
  .about-text strong { color: #f8fafc; }
  .about-links { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.5rem; }
  .about-link { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #94a3b8; transition: color 0.2s; }
  .about-link:hover { color: #6366f1; }

  /* ── Strengths ── */
  .strengths { padding: 8rem 0; }
  .strengths-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
  .strength-card {
    position: relative; padding: 2rem;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; overflow: hidden;
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
  }
  .strength-card:hover { border-color: rgba(99,102,241,0.5); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
  .strength-card:hover .card-glow { opacity: 1; }
  .card-glow {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 100%, rgba(99,102,241,0.15), transparent 60%);
    opacity: 0; transition: opacity 0.4s; pointer-events: none;
  }
  .strength-icon { font-size: 2.25rem; margin-bottom: 1rem; display: block; }
  .strength-card h3 { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.6rem; }
  .strength-card p { font-size: 0.9rem; color: #94a3b8; line-height: 1.7; }

  /* ── Skills / Pie chart ── */
  .skills-section {
    padding: 8rem 0;
    background: linear-gradient(180deg, transparent, #0a0a1a 20%, #0a0a1a 80%, transparent);
  }
  .chart-layout {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 4rem;
    align-items: center;
    margin-bottom: 3.5rem;
  }
  .chart-wrap { position: relative; }
  .pie-svg { width: 100%; overflow: visible; }
  .pie-slice {
    cursor: pointer;
    transform-origin: 160px 160px;
    transition: opacity 0.25s ease, filter 0.25s ease, d 0.2s cubic-bezier(0.34,1.56,0.64,1);
    animation: slice-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) both;
    animation-play-state: paused;
    animation-delay: var(--delay);
  }
  :global(.fade-in.visible) .pie-slice { animation-play-state: running; }
  @keyframes slice-pop {
    from { transform: scale(0); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }
  .c-total { font-size: 1.6rem; font-weight: 800; fill: #f8fafc; font-family: Inter, sans-serif; }
  .c-sub   { font-size: 0.75rem; fill: #475569; font-family: Inter, sans-serif; text-transform: uppercase; letter-spacing: 0.1em; }
  .c-icon  { font-size: 1.5rem; font-family: Inter, sans-serif; }
  .c-name  { font-size: 0.85rem; font-weight: 700; fill: #f8fafc; font-family: Inter, sans-serif; }
  .c-pct   { font-size: 1.3rem; font-weight: 800; font-family: Inter, sans-serif; }
  .legend-grid { display: flex; flex-direction: column; gap: 0.6rem; }
  .legend-item {
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0.65rem 1rem;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.2s, opacity 0.2s;
  }
  .legend-item:hover, .legend-item.is-hovered {
    background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18);
    transform: translateX(4px);
  }
  .legend-item.is-dimmed { opacity: 0.3; }
  .ldot  { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .licon { font-size: 1rem; }
  .linfo { display: flex; flex-direction: column; flex: 1; min-width: 0; }
  .lname { font-size: 0.875rem; font-weight: 600; white-space: nowrap; }
  .lcat  { font-size: 0.7rem; color: #475569; }
  .lpct  { font-size: 0.875rem; font-weight: 700; font-family: 'JetBrains Mono', monospace; flex-shrink: 0; }
  .extra-skills { display: flex; flex-wrap: wrap; gap: 0.6rem; justify-content: center; }
  .extra-tag {
    padding: 0.35rem 0.85rem; background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 100px;
    font-size: 0.8rem; color: #94a3b8; transition: all 0.2s; cursor: default;
  }
  .extra-tag:hover { border-color: #6366f1; color: #6366f1; background: rgba(99,102,241,0.08); transform: translateY(-2px); }

  /* ── Projects ── */
  .projects-section { padding: 8rem 0; }
  .projects-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 1.5rem; }
  .project-card {
    position: relative; padding: 2rem;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; overflow: hidden; cursor: default;
    transition: border-color 0.3s, transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s;
  }
  .project-card:hover { border-color: rgba(99,102,241,0.5); transform: translateY(-6px); box-shadow: 0 30px 80px rgba(0,0,0,0.4); }
  .project-card:hover .project-sheen { opacity: 1; }
  .project-sheen {
    position: absolute; inset: 0; opacity: 0; transition: opacity 0.5s; pointer-events: none;
    background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.04) 100%);
  }
  .project-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
  .project-icon { font-size: 2rem; }
  .project-year { font-size: 0.75rem; color: #475569; font-family: 'JetBrains Mono', monospace; }
  .project-card h3 { font-size: 1.2rem; font-weight: 700; margin-bottom: 0.6rem; }
  .project-card p { font-size: 0.9rem; color: #94a3b8; line-height: 1.7; margin-bottom: 1.25rem; }
  .project-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .project-tag {
    padding: 0.2rem 0.6rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
    border-radius: 100px; font-size: 0.72rem; color: #6366f1; font-family: 'JetBrains Mono', monospace;
  }

  /* ── Experience ── */
  .experience-section {
    padding: 8rem 0;
    background: linear-gradient(180deg, transparent, #0a0a1a 20%, #0a0a1a 80%, transparent);
  }
  .timeline { position: relative; max-width: 700px; margin: 0 auto; }
  .timeline::before {
    content: ''; position: absolute; left: 1.5rem; top: 0; bottom: 0; width: 1px;
    background: linear-gradient(to bottom, transparent, #6366f1, transparent);
  }
  .timeline-item { display: grid; grid-template-columns: 4rem 1fr; gap: 1.5rem; margin-bottom: 3rem; align-items: start; }
  .timeline-dot {
    width: 12px; height: 12px; border-radius: 50%;
    background: #6366f1; border: 2px solid #050510;
    box-shadow: 0 0 12px rgba(99,102,241,0.5);
    margin-top: 0.35rem; justify-self: center; position: relative; z-index: 1;
  }
  .timeline-content {
    padding: 1.5rem; background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; transition: border-color 0.3s;
  }
  .timeline-item:hover .timeline-content { border-color: rgba(99,102,241,0.5); }
  .timeline-year {
    display: inline-block; font-size: 0.75rem; color: #6366f1;
    font-family: 'JetBrains Mono', monospace; margin-bottom: 0.4rem;
    background: rgba(99,102,241,0.1); padding: 0.15rem 0.5rem; border-radius: 4px;
  }
  .timeline-content h3 { font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem; }
  .timeline-company { font-size: 0.85rem; color: #475569; display: block; margin-bottom: 0.5rem; }
  .timeline-content p { font-size: 0.875rem; color: #94a3b8; line-height: 1.6; margin-bottom: 0.75rem; }
  .timeline-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .tl-tag {
    padding: 0.18rem 0.55rem;
    background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25);
    border-radius: 100px; font-size: 0.7rem; color: #6366f1;
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── Contact ── */
  .contact-section { padding: 8rem 0; }
  .contact-inner {
    position: relative; text-align: center; padding: 5rem 3rem;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px; overflow: hidden;
  }
  .contact-glow-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 120%, rgba(99,102,241,0.12), transparent 60%);
    pointer-events: none;
  }
  .contact-inner > * { position: relative; }
  .contact-sub { font-size: 1.05rem; color: #94a3b8; max-width: 560px; margin: 0 auto 2.5rem; line-height: 1.7; }
  .contact-btn { font-size: 1rem; padding: 1rem 2.5rem; margin-bottom: 2rem; }
  .contact-socials { display: flex; align-items: center; justify-content: center; gap: 1rem; font-size: 0.9rem; }
  .social-link { color: #94a3b8; transition: color 0.2s; display: inline-block; }
  .social-link:hover { color: #6366f1; }
  .social-sep { color: #475569; }

  /* ── Footer ── */
  footer { text-align: center; padding: 2rem; color: #475569; font-size: 0.85rem; border-top: 1px solid rgba(255,255,255,0.08); }
  .heart { color: #f43f5e; animation: heartbeat 1.5s ease-in-out infinite; display: inline-block; }
  @keyframes heartbeat {
    0%,100% { transform: scale(1); }
    14% { transform: scale(1.2); }
    28% { transform: scale(1); }
    42% { transform: scale(1.15); }
    70% { transform: scale(1); }
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    nav ul { display: none; }
    .about-grid { grid-template-columns: 1fr; gap: 3rem; }
    .about-visual { order: -1; }
    .strengths-grid { grid-template-columns: repeat(2,1fr); }
    .chart-layout { grid-template-columns: 1fr; }
    .chart-wrap { max-width: 320px; margin: 0 auto; }
    .projects-grid { grid-template-columns: 1fr; }
    nav { padding: 1rem 1.5rem; }
  }
  @media (max-width: 600px) {
    .hero-stats { flex-direction: column; gap: 1rem; }
    .stat-divider { width: 40px; height: 1px; }
    .strengths-grid { grid-template-columns: 1fr; }
    .hero-actions { flex-direction: column; align-items: center; }
    .contact-inner { padding: 3rem 1.5rem; }
    .blog-grid { grid-template-columns: 1fr; }
  }

  /* ── Blog ── */
  .blog-section {
    padding: 8rem 0;
    background: linear-gradient(180deg, transparent, #0a0a1a 20%, #0a0a1a 80%, transparent);
  }
  .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }

  .blog-card {
    position: relative; padding: 2rem;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px; overflow: hidden; text-decoration: none; color: inherit;
    transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
    display: flex; flex-direction: column; gap: 0.75rem;
  }
  .blog-card:hover { border-color: rgba(99,102,241,0.5); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
  .blog-card:hover .blog-card-glow { opacity: 1; }
  .blog-card-glow {
    position: absolute; inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(99,102,241,0.1), transparent 65%);
    opacity: 0; transition: opacity 0.4s; pointer-events: none;
  }
  .blog-card-meta { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
  .blog-date { font-size: 0.75rem; color: #6366f1; font-family: 'JetBrains Mono', monospace; }
  .blog-id { font-size: 0.7rem; color: #334155; font-family: 'JetBrains Mono', monospace; }
  .blog-title { font-size: 1.15rem; font-weight: 700; line-height: 1.3; color: #f8fafc; }
  .blog-body {
    font-size: 0.9rem; color: #94a3b8; line-height: 1.75;
    display: -webkit-box; -webkit-line-clamp: 6; line-clamp: 6; -webkit-box-orient: vertical; overflow: hidden;
  }
  .blog-body :global(strong) { color: #f8fafc; }
  .blog-body :global(em) { color: #a5b4fc; font-style: italic; }
  .blog-body :global(code) {
    font-family: 'JetBrains Mono', monospace; font-size: 0.82em;
    background: rgba(99,102,241,0.15); padding: 0.1em 0.4em; border-radius: 4px; color: #a5b4fc;
  }
  .blog-body :global(a) { color: #6366f1; text-decoration: underline; text-underline-offset: 2px; }

  .blog-loading {
    display: flex; align-items: center; justify-content: center; gap: 1rem;
    padding: 4rem; color: #475569; font-size: 0.9rem;
  }
  .blog-spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid rgba(99,102,241,0.2); border-top-color: #6366f1;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .blog-empty {
    display: flex; flex-direction: column; align-items: center; gap: 1rem;
    padding: 4rem; color: #475569; text-align: center;
  }
  .blog-empty-icon { font-size: 2.5rem; }
  .blog-empty p { font-size: 0.95rem; }
  .blog-read-more {
    font-size: 0.8rem; font-weight: 600; color: #6366f1;
    margin-top: auto; align-self: flex-start;
    transition: gap 0.2s;
  }
  .blog-card:hover .blog-read-more { text-decoration: underline; }
</style>
