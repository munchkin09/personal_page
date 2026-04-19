<script lang="ts">
  // ─── Datos CV (fuente única en este fichero para independencia del index) ─────
  const profile = {
    name: 'Carlos Ledesma Castejón',
    title: 'Tech Lead · Arquitecto de Soluciones de Calidad & IA · Full Stack Senior',
    location: 'Madrid, España',
    phone: '+34 680 33 24 30',
    email: 'developer1983@gmail.com',
    linkedin: 'linkedin.com/in/carlosledesmac',
    github: 'github.com/munchkin09',
    website: 'carloslc.is-a.dev',
    summary: [
      'Tech Lead y Arquitecto de Software con +13 años de experiencia en el ciclo completo del software (SDLC), especializado en la intersección entre Ingeniería de Calidad, Automatización e Inteligencia Artificial Generativa.',
      'He liderado la modernización de ecosistemas legado —incluyendo migraciones de COBOL a tecnologías modernas— y el diseño de Agentes IA aplicados a calidad en grandes corporaciones bancarias y tecnológicas, con impacto directo en equipos de Europa y LATAM.',
      'Mi diferencial: entiendo el problema de calidad desde la arquitectura, no solo desde el testing.',
    ],
  };

  const experience = [
    {
      company: 'NTT DATA',
      location: 'Madrid (Híbrido)',
      role: 'Arquitecto de Soluciones de Calidad & IA',
      period: 'Jun 2024 – Actualidad',
      context: 'Rol estratégico de innovación tecnológica aplicada al ciclo de vida del software en un contexto de transformación digital a gran escala.',
      bullets: [
        { k: 'Agentes IA para Calidad', v: 'Diseño y desarrollo de agentes autónomos con LLMs orientados a la verificación, validación y análisis de calidad del software, reduciendo la intervención manual en procesos críticos del SDLC.' },
        { k: 'Test Case Generation', v: 'Desarrollé una plataforma de generación automática de casos de prueba con IA, democratizando el acceso al testing para perfiles no técnicos y acelerando el tiempo de diseño.' },
        { k: 'Migración COBOL', v: 'Lidero proyectos de modernización de código legado COBOL con pipelines asistidos por IA para análisis, documentación y traducción a lenguajes mantenibles, reduciendo deuda técnica acumulada durante décadas.' },
        { k: 'Transferencia de conocimiento', v: 'Imparto cursos y talleres técnicos y lidero iniciativas de adopción de IA para equipos de calidad en Europa y LATAM, asegurando una implantación efectiva y sostenible.' },
        { k: 'Estrategia transversal', v: 'Defino soluciones de análisis de calidad integradas en el SDLC que garantizan mantenibilidad, trazabilidad y eficiencia en el delivery a escala corporativa.' },
      ],
    },
    {
      company: 'Capitole Consulting',
      location: 'Cliente: BBVA · Madrid',
      role: 'QA Automation Lead / Developer',
      period: 'Feb 2021 – Jun 2024',
      context: 'Liderazgo técnico en la evolución y estandarización de frameworks de automatización para uno de los mayores bancos de Europa.',
      bullets: [
        { k: 'Arquitectura de frameworks', v: 'Diseñé e implementé soluciones de automatización con Selenium, Cucumber y WebdriverIO, aumentando la cobertura en flujos críticos de negocio.' },
        { k: 'Integración SDLC', v: 'Desarrollé herramientas de control de calidad embebidas en el ciclo de vida, habilitando detección temprana de errores y reduciendo el coste del bug fixing.' },
        { k: 'Legibilidad y adopción', v: 'Implementé capas de abstracción y reporting que hicieron las pruebas automatizadas comprensibles para stakeholders no técnicos, acelerando la aprobación de releases.' },
      ],
    },
    {
      company: 'Centum Digital',
      location: 'Madrid',
      role: 'Senior Full-Stack Developer',
      period: 'Sep 2018 – Jul 2021',
      context: 'Desarrollo de infraestructura compleja para validación de dispositivos IoT y móviles a escala.',
      bullets: [
        { k: 'Microservicios + AWS Device Farm', v: 'Diseñé y mantuve una infraestructura orientada a microservicios integrada con AWS Device Farm para validación en la nube de múltiples tipologías de dispositivo.' },
        { k: 'Automatización multi-plataforma', v: 'Lideré el análisis y refactorización de herramientas de testing para un ecosistema heterogéneo: Smartphones, Smart TVs, STBs y WebApps.' },
        { k: 'Productividad de equipos', v: 'Creé flujos de trabajo eficientes que redujeron la carga operativa del departamento y mejoraron el soporte a usuarios de la plataforma.' },
      ],
    },
    {
      company: 'Freelance / Consultoría tecnológica',
      location: 'Madrid',
      role: 'Consultor Full Stack & Web Developer',
      period: '2013 – 2018',
      context: 'Proyectos end-to-end para clientes corporativos y PYMEs.',
      bullets: [
        { k: 'Wunderman (Land Rover)', v: 'Desarrollo Full Stack con CakePHP y jQuery/Bootstrap para campañas digitales de alto tráfico.' },
        { k: 'Anlddea', v: 'Arquitectura y prototipado de red social para cooperación ciudadana y financiación de PYMEs (MVC, HTML5/JS).' },
        { k: 'Informatiz@rte', v: 'Integración de APIs SOAP y consumo de datos JSON para el sector agrícola.' },
        { k: 'Meollo', v: 'Consultoría estratégica de eCommerce y gestión de presencia digital.' },
      ],
    },
    {
      company: 'Atos – DAESA',
      location: 'Cliente: BBVA · Madrid',
      role: 'Ingeniero de Software',
      period: '2010 – 2013',
      context: 'Diseño y desarrollo de software para monitoreo de SLAs, procesos ETL y herramientas de gestión de stock para centros del grupo BBVA.',
      bullets: [],
    },
  ];

  const skills = [
    { group: 'Liderazgo & Estrategia', items: ['Arquitectura de Software', 'Mentoring técnico', 'Modernización de Legado', 'Agile / Scrum', 'Gestión de Stakeholders'] },
    { group: 'IA & Modernización',   items: ['Agentes IA', 'GenAI aplicada a código', 'LLMs (OpenAI, Claude)', 'Test Case Generation', 'Análisis estático', 'Migración COBOL'] },
    { group: 'Lenguajes',             items: ['JavaScript / TypeScript (Experto)', 'Python', 'Bash', 'PowerShell', 'COBOL (análisis y migración)'] },
    { group: 'QA & Testing',          items: ['Selenium', 'Cucumber', 'WebdriverIO', 'Cypress', 'Jest', 'Playwright', 'ESLint'] },
    { group: 'Cloud & DevOps',        items: ['AWS (EC2, RDS, S3, Device Farm)', 'Docker', 'Jenkins', 'GitLab CI', 'Linux', 'Git'] },
    { group: 'Formación & Adopción',  items: ['Diseño de cursos técnicos', 'Talleres de IA', 'Onboarding de equipos', 'Evangelización tecnológica'] },
  ];

  const languages = [
    { lang: 'Español', level: 'Nativo' },
    { lang: 'Inglés',  level: 'Competencia profesional' },
  ];

  const education = [
    { title: 'Bootcamp Full Stack Web & Mobile', org: 'Keep Coding, Madrid', period: '2016 – 2017' },
    { title: 'Técnico Superior en Desarrollo de Aplicaciones Informáticas', org: 'Cámara de Comercio de Madrid', period: '2007 – 2009' },
  ];

  const highlights = [
    { n: '13+',  l: 'años de experiencia' },
    { n: '2',    l: 'continentes (EU & LATAM)' },
    { n: 'BBVA', l: 'cliente bancario Top EU' },
    { n: 'LLMs', l: 'aplicados a QA y legacy' },
  ];

  function handlePrint() {
    window.print();
  }
</script>

<svelte:head>
  <title>CV · Carlos Ledesma — Tech Lead QA & IA</title>
  <meta name="description" content="Currículum imprimible de Carlos Ledesma — Tech Lead, Arquitecto de Calidad & IA, Full Stack Senior." />
  <meta name="robots" content="index,follow" />
</svelte:head>

<!-- Toolbar (solo pantalla) -->
<div class="toolbar no-print">
  <a href="/" class="tool-link" aria-label="Volver al portfolio">
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4 3 8l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Volver al portfolio
  </a>
  <div class="tool-actions">
    <button type="button" class="btn ghost" onclick={handlePrint}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z"/></svg>
      Imprimir
    </button>
    <button type="button" class="btn primary" onclick={handlePrint}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></svg>
      Descargar PDF
    </button>
  </div>
</div>

<main class="sheet" aria-label="Currículum Carlos Ledesma">
  <!-- ── Header ── -->
  <header class="head">
    <div class="head-main">
      <h1>{profile.name}</h1>
      <p class="title">{profile.title}</p>
    </div>
    <ul class="contact">
      <li><span class="label">Ubicación</span>{profile.location}</li>
      <li><span class="label">Teléfono</span><a href="tel:+34680332430">{profile.phone}</a></li>
      <li><span class="label">Email</span><a href="mailto:{profile.email}">{profile.email}</a></li>
      <li><span class="label">LinkedIn</span><a href="https://{profile.linkedin}" target="_blank" rel="noopener">{profile.linkedin}</a></li>
      <li><span class="label">GitHub</span><a href="https://{profile.github}" target="_blank" rel="noopener">{profile.github}</a></li>
      <li><span class="label">Web</span><a href="https://{profile.website}" target="_blank" rel="noopener">{profile.website}</a></li>
    </ul>
  </header>

  <!-- ── Highlights ── -->
  <section class="highlights" aria-label="Métricas clave">
    {#each highlights as h}
      <div class="hl"><span class="hl-n">{h.n}</span><span class="hl-l">{h.l}</span></div>
    {/each}
  </section>

  <!-- ── Body grid ── -->
  <div class="grid">
    <!-- Columna principal -->
    <div class="col-main">
      <section>
        <h2>Perfil</h2>
        {#each profile.summary as p}<p class="lead">{p}</p>{/each}
      </section>

      <section>
        <h2>Experiencia</h2>
        <div class="timeline">
          {#each experience as job}
            <article class="job">
              <header class="job-head">
                <div>
                  <h3>{job.role}</h3>
                  <p class="org">{job.company} <span class="sep">·</span> <span class="loc">{job.location}</span></p>
                </div>
                <span class="period">{job.period}</span>
              </header>
              {#if job.context}<p class="context">{job.context}</p>{/if}
              {#if job.bullets.length}
                <ul class="bullets">
                  {#each job.bullets as b}
                    <li><strong>{b.k}.</strong> {b.v}</li>
                  {/each}
                </ul>
              {/if}
            </article>
          {/each}
        </div>
      </section>
    </div>

    <!-- Sidebar -->
    <aside class="col-side">
      <section>
        <h2>Stack técnico</h2>
        <div class="skills">
          {#each skills as g}
            <div class="skill-group">
              <h4>{g.group}</h4>
              <ul class="tags">
                {#each g.items as it}<li>{it}</li>{/each}
              </ul>
            </div>
          {/each}
        </div>
      </section>

      <section>
        <h2>Idiomas</h2>
        <ul class="plain">
          {#each languages as l}
            <li><strong>{l.lang}</strong> — {l.level}</li>
          {/each}
        </ul>
      </section>

      <section>
        <h2>Formación</h2>
        <ul class="plain">
          {#each education as e}
            <li>
              <strong>{e.title}</strong>
              <span class="muted">{e.org}</span>
              <span class="muted mono">{e.period}</span>
            </li>
          {/each}
        </ul>
      </section>

      <section class="callout">
        <h4>Disponibilidad</h4>
        <p>Abierto a nuevas oportunidades como Tech Lead / Solution Architect en entornos de QA + IA, modernización de legacy y plataformas Full Stack.</p>
      </section>
    </aside>
  </div>

  <footer class="foot">
    <span>Referencias disponibles bajo petición</span>
    <span class="mono">carlosledesma.dev · Madrid, España</span>
  </footer>
</main>

<style>
  /* ── Reset local (esta ruta usa su propia tipografía y fondo claro) ── */
  :global(html), :global(body) {
    background: #eef0f5;
    color: #111827;
    font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  :global(body) { overflow-x: auto; }

  /* ── Toolbar ── */
  .toolbar {
    position: sticky; top: 0; z-index: 50;
    display: flex; align-items: center; justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 1.25rem;
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid #e5e7eb;
  }
  .tool-link {
    display: inline-flex; align-items: center; gap: 0.4rem;
    font-size: 0.85rem; color: #4f46e5; font-weight: 600;
  }
  .tool-link:hover { color: #3730a3; }
  .tool-actions { display: flex; gap: 0.5rem; }
  .btn {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.55rem 1rem;
    font-size: 0.85rem; font-weight: 600;
    border-radius: 8px; cursor: pointer;
    border: 1px solid transparent;
    transition: background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s;
  }
  .btn.ghost {
    background: white; color: #111827; border-color: #d1d5db;
  }
  .btn.ghost:hover { background: #f3f4f6; border-color: #9ca3af; }
  .btn.primary {
    background: #4f46e5; color: white;
  }
  .btn.primary:hover { background: #4338ca; box-shadow: 0 6px 18px rgba(79,70,229,0.25); }

  /* ── Hoja CV (A4) ── */
  .sheet {
    max-width: 210mm;
    margin: 1.5rem auto 3rem;
    padding: 16mm 16mm 14mm;
    background: white;
    color: #111827;
    box-shadow: 0 10px 40px rgba(15,23,42,0.08), 0 2px 6px rgba(15,23,42,0.04);
    border-radius: 4px;
    line-height: 1.55;
    font-size: 10.5pt;
  }

  /* ── Header ── */
  .head {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1.5rem;
    align-items: end;
    padding-bottom: 0.9rem;
    border-bottom: 2px solid #111827;
    margin-bottom: 1rem;
  }
  .head h1 {
    font-size: 26pt;
    line-height: 1.1;
    font-weight: 800;
    letter-spacing: -0.02em;
    margin-bottom: 0.3rem;
    color: #0f172a;
  }
  .title {
    font-size: 10.5pt;
    color: #4f46e5;
    font-weight: 600;
    letter-spacing: 0.01em;
  }
  .contact {
    list-style: none; padding: 0; margin: 0;
    display: grid; grid-template-columns: repeat(2, auto);
    column-gap: 1.25rem; row-gap: 0.2rem;
    font-size: 8.8pt;
    color: #374151;
    text-align: right;
  }
  .contact li { display: grid; grid-template-columns: auto 1fr; gap: 0.5rem; align-items: baseline; }
  .contact .label {
    font-size: 7pt; text-transform: uppercase; letter-spacing: 0.08em;
    color: #6b7280; font-weight: 600;
  }
  .contact a { color: #111827; }
  .contact a:hover { color: #4f46e5; text-decoration: underline; }

  /* ── Highlights ── */
  .highlights {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 0.6rem; margin-bottom: 1.1rem;
  }
  .hl {
    display: flex; flex-direction: column; gap: 0.1rem;
    padding: 0.55rem 0.8rem;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-left: 3px solid #4f46e5;
    border-radius: 3px;
  }
  .hl-n { font-size: 13pt; font-weight: 800; color: #0f172a; letter-spacing: -0.01em; }
  .hl-l { font-size: 7.8pt; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500; }

  /* ── Grid body ── */
  .grid {
    display: grid;
    grid-template-columns: 1fr 33%;
    gap: 1.6rem;
  }
  .col-main section + section,
  .col-side section + section { margin-top: 1.1rem; }

  h2 {
    font-size: 11pt;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #4f46e5;
    font-weight: 700;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 0.7rem;
  }
  h3 { font-size: 11pt; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.25; }
  h4 { font-size: 9pt; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 0.35rem; }

  .lead { margin-bottom: 0.5rem; color: #1f2937; }

  /* ── Timeline ── */
  .job { margin-bottom: 0.9rem; break-inside: avoid; page-break-inside: avoid; }
  .job:last-child { margin-bottom: 0; }
  .job-head {
    display: grid; grid-template-columns: 1fr auto;
    gap: 0.5rem; align-items: baseline; margin-bottom: 0.3rem;
  }
  .org { font-size: 9.5pt; color: #374151; margin: 0.1rem 0 0; }
  .org .sep { color: #9ca3af; margin: 0 0.2rem; }
  .loc { color: #6b7280; }
  .period {
    font-size: 8.5pt; color: #6b7280;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    white-space: nowrap;
    background: #f3f4f6;
    padding: 0.15rem 0.5rem;
    border-radius: 3px;
  }
  .context { font-size: 9.5pt; color: #374151; margin: 0.25rem 0 0.4rem; font-style: italic; }
  .bullets { list-style: none; padding: 0; margin: 0; }
  .bullets li {
    position: relative; padding-left: 0.9rem;
    margin-bottom: 0.3rem; font-size: 9.8pt; color: #1f2937;
  }
  .bullets li::before {
    content: ''; position: absolute; left: 0; top: 0.55em;
    width: 4px; height: 4px; border-radius: 50%; background: #4f46e5;
  }
  .bullets strong { color: #0f172a; font-weight: 700; }

  /* ── Sidebar ── */
  .skill-group { margin-bottom: 0.75rem; }
  .tags { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.25rem; }
  .tags li {
    font-size: 8.5pt;
    padding: 0.15rem 0.5rem;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 3px;
    color: #334155;
    white-space: nowrap;
  }

  .plain { list-style: none; padding: 0; margin: 0; }
  .plain > li {
    font-size: 9.5pt; margin-bottom: 0.45rem;
    display: flex; flex-direction: column; gap: 0.1rem;
  }
  .plain strong { color: #0f172a; font-weight: 600; }
  .muted { color: #6b7280; font-size: 8.8pt; }
  .mono  { font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 8pt; }

  .callout {
    margin-top: 1rem;
    padding: 0.8rem 0.9rem;
    background: #eef2ff;
    border: 1px solid #c7d2fe;
    border-radius: 4px;
  }
  .callout h4 { color: #4338ca; margin-bottom: 0.3rem; }
  .callout p { font-size: 9pt; color: #312e81; line-height: 1.5; }

  /* ── Footer ── */
  .foot {
    margin-top: 1.5rem;
    padding-top: 0.7rem;
    border-top: 1px solid #e5e7eb;
    display: flex; justify-content: space-between;
    font-size: 8pt; color: #6b7280;
  }
  .foot .mono { font-size: 7.8pt; }

  /* ── Responsive (pantalla) ── */
  @media (max-width: 780px) {
    .sheet { padding: 10mm; margin: 0.75rem; }
    .head { grid-template-columns: 1fr; gap: 0.8rem; }
    .contact { text-align: left; grid-template-columns: repeat(2, 1fr); }
    .highlights { grid-template-columns: repeat(2, 1fr); }
    .grid { grid-template-columns: 1fr; }
    .toolbar { padding: 0.6rem 0.9rem; flex-direction: column; align-items: stretch; gap: 0.5rem; }
    .tool-actions { justify-content: space-between; }
  }

  /* ── Print ── */
  @page {
    size: A4;
    margin: 12mm 12mm 12mm 12mm;
  }
  @media print {
    :global(html), :global(body) {
      background: white !important;
      color: #000 !important;
    }
    .no-print { display: none !important; }
    .sheet {
      max-width: none;
      margin: 0;
      padding: 0;
      box-shadow: none;
      border-radius: 0;
      font-size: 9.8pt;
    }
    a { color: inherit; text-decoration: none; }
    /* Evitar cortes feos en trabajos */
    .job, .skill-group, .callout { break-inside: avoid; page-break-inside: avoid; }
    h2 { break-after: avoid; page-break-after: avoid; }
    .highlights { break-inside: avoid; page-break-inside: avoid; }
    /* Preservar colores de acento */
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
</style>
