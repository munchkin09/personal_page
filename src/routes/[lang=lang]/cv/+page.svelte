<script lang="ts">
  import { dictionaries, type Locale } from '$lib/i18n';

  let { data }: { data: { lang: Locale } } = $props();

  const t = $derived(dictionaries[data.lang].cv);

  const contact = {
    phone: '+34 680 33 24 30',
    email: 'carlos.developer1983@gmail.com',
    linkedin: 'linkedin.com/in/carlosledesmac',
    github: 'github.com/munchkin09',
    website: 'carloslc.is-a.dev',
  };

  function handlePrint() {
    window.print();
  }
</script>

<svelte:head>
  <title>{data.lang === 'en' ? 'CV · Carlos Ledesma — Tech Lead QA & AI' : 'CV · Carlos Ledesma — Tech Lead QA & IA'}</title>
  <meta
    name="description"
    content={data.lang === 'en'
      ? 'Printable résumé of Carlos Ledesma — Tech Lead, Quality & AI Solutions Architect, Senior Full Stack.'
      : 'Currículum imprimible de Carlos Ledesma — Tech Lead, Arquitecto de Calidad & IA, Full Stack Senior.'}
  />
  <meta name="robots" content="index,follow" />
</svelte:head>

<!-- Decorative background (screen only) -->
<div class="bg-blob blob-violet no-print" aria-hidden="true"></div>
<div class="bg-blob blob-cyan no-print" aria-hidden="true"></div>

<!-- Toolbar (screen only) -->
<div class="toolbar no-print">
  <a href="/{data.lang}" class="tool-link" aria-label={t.toolbar.back}>
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8H3M7 4 3 8l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    {t.toolbar.back}
  </a>
  <div class="tool-actions">
    <button type="button" class="btn ghost" onclick={handlePrint}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z"/></svg>
      {t.toolbar.print}
    </button>
    <button type="button" class="btn primary" onclick={handlePrint}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></svg>
      {t.toolbar.downloadPdf}
    </button>
  </div>
</div>

<main class="sheet" aria-label={t.docAriaLabel}>
  <!-- Header -->
  <header class="head">
    <div class="head-main">
      <h1>{t.profile.name}</h1>
      <p class="title">{t.profile.title}</p>
    </div>
    <ul class="contact">
      <li><span class="label">{t.headerLabels.location}</span>{t.profile.location}</li>
      <li><span class="label">{t.headerLabels.phone}</span><a href="tel:+34680332430">{contact.phone}</a></li>
      <li><span class="label">{t.headerLabels.email}</span><a href="mailto:{contact.email}">{contact.email}</a></li>
      <li><span class="label">{t.headerLabels.linkedin}</span><a href="https://{contact.linkedin}" target="_blank" rel="noopener">{contact.linkedin}</a></li>
      <li><span class="label">{t.headerLabels.github}</span><a href="https://{contact.github}" target="_blank" rel="noopener">{contact.github}</a></li>
      <li><span class="label">{t.headerLabels.web}</span><a href="https://{contact.website}" target="_blank" rel="noopener">{contact.website}</a></li>
    </ul>
  </header>

  <!-- Highlights -->
  <section class="highlights" aria-label={t.metricsLabel}>
    {#each t.highlights as h}
      <div class="hl"><span class="hl-n">{h.n}</span><span class="hl-l">{h.l}</span></div>
    {/each}
  </section>

  <!-- Body grid -->
  <div class="grid">
    <!-- Main column -->
    <div class="col-main">
      <section>
        <h2>{t.sections.profile}</h2>
        {#each t.profile.summary as p}<p class="lead">{p}</p>{/each}
      </section>

      <section>
        <h2>{t.sections.experience}</h2>
        <div class="timeline">
          {#each t.experience as job}
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
        <h2>{t.sections.stack}</h2>
        <div class="skills">
          {#each t.skills as g}
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
        <h2>{t.sections.languages}</h2>
        <ul class="plain">
          {#each t.languages as l}
            <li><strong>{l.lang}</strong> — {l.level}</li>
          {/each}
        </ul>
      </section>

      <section>
        <h2>{t.sections.education}</h2>
        <ul class="plain">
          {#each t.education as e}
            <li>
              <strong>{e.title}</strong>
              <span class="muted">{e.org}</span>
              <span class="muted mono">{e.period}</span>
            </li>
          {/each}
        </ul>
      </section>

      <section class="callout">
        <h4>{t.sections.availability}</h4>
        <p>{t.availabilityBody}</p>
      </section>
    </aside>
  </div>

  <footer class="foot">
    <span>{t.footer.references}</span>
    <span class="mono">{t.footer.website}</span>
  </footer>
</main>

<style>
  /* ═══════════════════════════════════════════════════════════════════
     CV page — dual mode
     Screen: obsidian canvas, violet-dominant neon, elevated sheet card.
     Print:  forced light A4 paper, black type, violet accents preserved.
     ═══════════════════════════════════════════════════════════════════ */

  :global(html), :global(body) {
    background: var(--bg);
    color: var(--fg);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  :global(body) { overflow-x: auto; }

  /* ── Decorative blobs (screen) ─────────────────────────────────── */
  .bg-blob {
    position: fixed;
    width: 60vw;
    height: 60vw;
    max-width: 820px;
    max-height: 820px;
    border-radius: 50%;
    opacity: 0.22;
    filter: blur(100px) saturate(1.2);
    pointer-events: none;
    z-index: 0;
    will-change: transform;
  }
  .blob-violet {
    top: -18%;
    left: -16%;
    background: radial-gradient(circle, var(--neon-violet), transparent 70%);
    animation: drift-a 22s var(--ease-in-out) infinite alternate;
  }
  .blob-cyan {
    bottom: -20%;
    right: -18%;
    opacity: 0.12;
    background: radial-gradient(circle, var(--neon-cyan), transparent 70%);
    animation: drift-b 28s var(--ease-in-out) infinite alternate;
  }
  @keyframes drift-a {
    from { transform: translate3d(0,0,0) scale(1); }
    to   { transform: translate3d(4vw,3vw,0) scale(1.14); }
  }
  @keyframes drift-b {
    from { transform: translate3d(0,0,0) scale(1); }
    to   { transform: translate3d(-5vw,-3vw,0) scale(1.12); }
  }

  /* ── Toolbar ───────────────────────────────────────────────────── */
  .toolbar {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem var(--gutter);
    background: var(--bg-overlay);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .tool-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: var(--font-mono);
    font-size: var(--fs-micro);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--fg-subtle);
    font-weight: 500;
    transition: color var(--dur-base) var(--ease-out-quart);
  }
  .tool-link:hover { color: var(--neon-violet-hi); }
  .tool-actions { display: flex; gap: 0.5rem; }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.55rem 1rem;
    font-family: var(--font-mono);
    font-size: var(--fs-micro);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    font-weight: 500;
    border-radius: var(--radius-sm);
    cursor: pointer;
    border: 1px solid transparent;
    transition:
      background var(--dur-base) var(--ease-out-quart),
      border-color var(--dur-base) var(--ease-out-quart),
      color var(--dur-base) var(--ease-out-quart),
      box-shadow var(--dur-base) var(--ease-out-quart);
  }
  .btn.ghost {
    background: transparent;
    color: var(--fg-muted);
    border-color: var(--border-strong);
  }
  .btn.ghost:hover {
    background: rgba(155, 93, 229, 0.06);
    border-color: var(--neon-violet);
    color: var(--neon-violet-hi);
  }
  .btn.primary {
    background: var(--neon-violet);
    color: var(--obsidian-900);
    border-color: var(--neon-violet);
  }
  .btn.primary:hover {
    background: var(--neon-violet-hi);
    border-color: var(--neon-violet-hi);
    box-shadow: var(--glow-violet);
  }

  /* ── Sheet (screen = elevated card on obsidian) ───────────────── */
  .sheet {
    position: relative;
    z-index: 1;
    max-width: 210mm;
    margin: var(--space-6) auto var(--space-9);
    padding: 18mm 18mm 16mm;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.035),
      rgba(255, 255, 255, 0.015)
    );
    color: var(--fg);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg), var(--shadow-inner);
    line-height: 1.55;
    font-size: 10.5pt;
    overflow: hidden;
  }
  .sheet::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      var(--neon-violet),
      var(--neon-cyan) 50%,
      var(--neon-pink)
    );
    opacity: 0.9;
  }

  /* ── Header ───────────────────────────────────────────────────── */
  .head {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 1.5rem;
    align-items: end;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-strong);
    margin-bottom: 1.25rem;
  }
  .head h1 {
    font-family: var(--font-display);
    font-size: 28pt;
    line-height: 1.05;
    font-weight: 600;
    letter-spacing: -0.025em;
    margin-bottom: 0.35rem;
    color: var(--fg);
  }
  .title {
    font-family: var(--font-mono);
    font-size: 9.5pt;
    color: var(--neon-violet-hi);
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin: 0;
  }
  .contact {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(2, auto);
    column-gap: 1.25rem;
    row-gap: 0.25rem;
    font-size: 8.8pt;
    color: var(--fg-muted);
    text-align: right;
  }
  .contact li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    align-items: baseline;
  }
  .contact .label {
    font-family: var(--font-mono);
    font-size: 7pt;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--fg-whisper);
    font-weight: 500;
  }
  .contact a {
    color: var(--fg);
    transition: color var(--dur-fast);
  }
  .contact a:hover {
    color: var(--neon-violet-hi);
    text-decoration: underline;
    text-decoration-color: var(--neon-violet);
  }

  /* ── Highlights ───────────────────────────────────────────────── */
  .highlights {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.6rem;
    margin-bottom: 1.25rem;
  }
  .hl {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    padding: 0.6rem 0.8rem;
    background: rgba(155, 93, 229, 0.05);
    border: 1px solid var(--border);
    border-left: 2px solid var(--neon-violet);
    border-radius: var(--radius-xs);
    transition: border-color var(--dur-base), background var(--dur-base);
  }
  .hl:hover {
    background: rgba(155, 93, 229, 0.1);
    border-left-color: var(--neon-violet-hi);
  }
  .hl-n {
    font-family: var(--font-display);
    font-size: 14pt;
    font-weight: 600;
    color: var(--fg);
    letter-spacing: -0.015em;
  }
  .hl-l {
    font-family: var(--font-mono);
    font-size: 7.5pt;
    color: var(--fg-subtle);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    font-weight: 500;
  }

  /* ── Grid body ────────────────────────────────────────────────── */
  .grid {
    display: grid;
    grid-template-columns: 1fr 33%;
    gap: 1.8rem;
  }
  .col-main section + section,
  .col-side section + section { margin-top: 1.2rem; }

  h2 {
    font-family: var(--font-mono);
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--neon-violet-hi);
    font-weight: 500;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 0.8rem;
    position: relative;
  }
  h2::before {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 36px;
    height: 1px;
    background: var(--neon-violet);
    box-shadow: 0 0 8px var(--neon-violet);
  }
  h3 {
    font-family: var(--font-display);
    font-size: 11pt;
    font-weight: 600;
    color: var(--fg);
    margin: 0;
    line-height: 1.3;
    letter-spacing: -0.01em;
  }
  h4 {
    font-family: var(--font-mono);
    font-size: 8.5pt;
    font-weight: 500;
    color: var(--fg-muted);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    margin-bottom: 0.4rem;
  }

  .lead {
    margin-bottom: 0.55rem;
    color: var(--fg-muted);
    line-height: 1.6;
  }

  /* ── Timeline ─────────────────────────────────────────────────── */
  .job {
    margin-bottom: 1rem;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .job:last-child { margin-bottom: 0; }
  .job-head {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
    align-items: baseline;
    margin-bottom: 0.35rem;
  }
  .org {
    font-size: 9.5pt;
    color: var(--fg-muted);
    margin: 0.1rem 0 0;
  }
  .org .sep {
    color: var(--fg-whisper);
    margin: 0 0.25rem;
  }
  .loc { color: var(--fg-subtle); }
  .period {
    font-family: var(--font-mono);
    font-size: 8.2pt;
    color: var(--neon-violet-hi);
    white-space: nowrap;
    background: rgba(155, 93, 229, 0.08);
    border: 1px solid rgba(155, 93, 229, 0.22);
    padding: 0.18rem 0.5rem;
    border-radius: var(--radius-xs);
  }
  .context {
    font-size: 9.3pt;
    color: var(--fg-muted);
    margin: 0.3rem 0 0.45rem;
    font-style: italic;
  }
  .bullets { list-style: none; padding: 0; margin: 0; }
  .bullets li {
    position: relative;
    padding-left: 0.95rem;
    margin-bottom: 0.35rem;
    font-size: 9.8pt;
    color: var(--fg-muted);
    line-height: 1.55;
  }
  .bullets li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.55em;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--neon-violet);
    box-shadow: 0 0 6px rgba(155, 93, 229, 0.6);
  }
  .bullets strong { color: var(--fg); font-weight: 600; }

  /* ── Sidebar ──────────────────────────────────────────────────── */
  .skill-group { margin-bottom: 0.8rem; }
  .tags {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }
  .tags li {
    font-family: var(--font-mono);
    font-size: 8.2pt;
    padding: 0.2rem 0.55rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    color: var(--fg-muted);
    white-space: nowrap;
    transition: border-color var(--dur-fast), color var(--dur-fast);
  }
  .tags li:hover {
    border-color: var(--neon-violet);
    color: var(--neon-violet-hi);
  }

  .plain { list-style: none; padding: 0; margin: 0; }
  .plain > li {
    font-size: 9.5pt;
    margin-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    color: var(--fg-muted);
  }
  .plain strong { color: var(--fg); font-weight: 600; }
  .muted {
    color: var(--fg-subtle);
    font-size: 8.8pt;
  }
  .mono {
    font-family: var(--font-mono);
    font-size: 8pt;
  }

  .callout {
    margin-top: 1rem;
    padding: 0.85rem 0.95rem;
    background: linear-gradient(
      180deg,
      rgba(155, 93, 229, 0.08),
      rgba(155, 93, 229, 0.03)
    );
    border: 1px solid rgba(155, 93, 229, 0.28);
    border-radius: var(--radius-sm);
    position: relative;
    overflow: hidden;
  }
  .callout::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: var(--neon-violet);
    box-shadow: 0 0 10px var(--neon-violet);
  }
  .callout h4 {
    color: var(--neon-violet-hi);
    margin-bottom: 0.35rem;
  }
  .callout p {
    font-size: 9pt;
    color: var(--fg-muted);
    line-height: 1.55;
    margin: 0;
  }

  /* ── Footer ───────────────────────────────────────────────────── */
  .foot {
    margin-top: 1.5rem;
    padding-top: 0.8rem;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 7.8pt;
    color: var(--fg-whisper);
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
  }
  .foot .mono { font-size: 7.8pt; }

  /* ── Responsive (screen) ──────────────────────────────────────── */
  @media (max-width: 780px) {
    .sheet { padding: 10mm; margin: var(--space-4) var(--space-3) var(--space-7); }
    .head { grid-template-columns: 1fr; gap: 0.9rem; }
    .contact { text-align: left; grid-template-columns: repeat(2, 1fr); }
    .highlights { grid-template-columns: repeat(2, 1fr); }
    .grid { grid-template-columns: 1fr; }
    .toolbar { padding: 0.6rem 0.9rem; flex-direction: column; align-items: stretch; gap: 0.5rem; }
    .tool-actions { justify-content: space-between; }
  }

  @media (prefers-reduced-motion: reduce) {
    .bg-blob { animation: none !important; }
  }

  /* ═══════════════════════════════════════════════════════════════
     PRINT — force clean light A4 paper.
     ═══════════════════════════════════════════════════════════════ */
  @page {
    size: A4;
    margin: 10mm 12mm 10mm 12mm;
  }
  @media print {
    :global(html), :global(body) {
      background: white !important;
      color: #000 !important;
    }
    .no-print { display: none !important; }
    .bg-blob { display: none !important; }

    .sheet {
      max-width: none;
      margin: 0;
      padding: 0;
      background: white !important;
      color: #111827 !important;
      border: none;
      border-radius: 0;
      box-shadow: none;
      font-size: 9pt;
      line-height: 1.45;
    }
    .sheet::before { display: none; }

    .head {
      border-bottom: 2px solid #111827 !important;
    }
    .head h1 { color: #0f172a !important; }
    .title { color: #6E3AB8 !important; }

    .contact { color: #374151 !important; }
    .contact .label { color: #6b7280 !important; }
    .contact a { color: #111827 !important; }

    .hl {
      background: #f8fafc !important;
      border: 1px solid #e5e7eb !important;
      border-left: 3px solid #6E3AB8 !important;
    }
    .hl-n { color: #0f172a !important; }
    .hl-l { color: #6b7280 !important; }

    h2 {
      color: #6E3AB8 !important;
      border-bottom: 1px solid #e5e7eb !important;
    }
    h2::before { display: none; }
    h3 { color: #0f172a !important; }
    h4 { color: #0f172a !important; }

    .lead { color: #1f2937 !important; }

    .org { color: #374151 !important; }
    .org .sep { color: #9ca3af !important; }
    .loc { color: #6b7280 !important; }
    .period {
      color: #6b7280 !important;
      background: #f3f4f6 !important;
      border: none !important;
    }
    .context { color: #374151 !important; }
    .bullets li { color: #1f2937 !important; }
    .bullets li::before {
      background: #6E3AB8 !important;
      box-shadow: none !important;
    }
    .bullets strong { color: #0f172a !important; }

    .tags li {
      background: #f1f5f9 !important;
      border: 1px solid #e2e8f0 !important;
      color: #334155 !important;
    }
    .plain > li { color: #1f2937 !important; }
    .plain strong { color: #0f172a !important; }
    .muted { color: #6b7280 !important; }

    .callout {
      background: #f5f0ff !important;
      border: 1px solid #d9c9f5 !important;
    }
    .callout::before { display: none; }
    .callout h4 { color: #4a1e85 !important; }
    .callout p { color: #2a1554 !important; }

    .foot {
      border-top: 1px solid #e5e7eb !important;
      color: #6b7280 !important;
    }

    a { color: inherit; text-decoration: none; }

    /* ── Grid → float layout para evitar espacios en blanco entre páginas ── */
    .grid {
      display: block;
      overflow: hidden;
    }
    .col-side {
      float: right;
      width: 31%;
      margin-left: 1.6rem;
    }
    .col-main {
      float: left;
      width: calc(69% - 1.6rem);
    }
    .foot {
      clear: both;
    }

    /* ── Romper dentro de trabajos largos está permitido ── */
    .job { break-inside: auto; page-break-inside: auto; }
    .job-head { break-inside: avoid; page-break-inside: avoid; }

    /* ── Elementos pequeños que no deben partirse ── */
    .skill-group, .callout { break-inside: avoid; page-break-inside: avoid; }
    h2 { break-after: avoid; page-break-after: avoid; }
    h3 { break-after: avoid; page-break-after: avoid; }
    .highlights { break-inside: avoid; page-break-inside: avoid; }

    /* ── Huérfanas y viudas ── */
    .lead { orphans: 3; widows: 3; }
    .bullets li { orphans: 2; widows: 2; }
    .context { orphans: 2; widows: 2; }

    /* ── Reducir espaciado en print para aprovechar mejor la hoja ── */
    .col-main section + section,
    .col-side section + section { margin-top: 0.9rem; }
    .job { margin-bottom: 0.85rem; }
    .highlights { margin-bottom: 0.9rem; }

    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
</style>
