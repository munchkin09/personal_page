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
      ? 'Printable resume of Carlos Ledesma — Tech Lead, Quality & AI Solutions Architect, Senior Full Stack.'
      : 'Curriculum imprimible de Carlos Ledesma — Tech Lead, Arquitecto de Calidad & IA, Full Stack Senior.'}
  />
  <meta name="robots" content="index,follow" />
</svelte:head>

<div class="toolbar no-print glass-panel">
  <a href="/{data.lang}" class="tool-link" aria-label={t.toolbar.back}>
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M13 8H3M7 4 3 8l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    {t.toolbar.back}
  </a>

  <div class="tool-actions">
    <button type="button" class="btn ghost" onclick={handlePrint}>{t.toolbar.print}</button>
    <button type="button" class="btn primary" onclick={handlePrint}>{t.toolbar.downloadPdf}</button>
  </div>
</div>

<main class="sheet" aria-label={t.docAriaLabel}>
  <header class="head">
    <div class="head-main">
      <p class="eyebrow">{t.sections.profile}</p>
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

  <section class="highlights" aria-label={t.metricsLabel}>
    {#each t.highlights as highlight}
      <div class="hl">
        <span class="hl-n">{highlight.n}</span>
        <span class="hl-l">{highlight.l}</span>
      </div>
    {/each}
  </section>

  <div class="grid">
    <div class="col-main">
      <section>
        <h2>{t.sections.profile}</h2>
        {#each t.profile.summary as paragraph}
          <p class="lead">{paragraph}</p>
        {/each}
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

              {#if job.context}
                <p class="context">{job.context}</p>
              {/if}

              {#if job.bullets.length}
                <ul class="bullets">
                  {#each job.bullets as bullet}
                    <li><strong>{bullet.k}.</strong> {bullet.v}</li>
                  {/each}
                </ul>
              {/if}
            </article>
          {/each}
        </div>
      </section>
    </div>

    <aside class="col-side">
      <section>
        <h2>{t.sections.stack}</h2>
        <div class="skills">
          {#each t.skills as group}
            <div class="skill-group">
              <h4>{group.group}</h4>
              <ul class="tags">
                {#each group.items as item}
                  <li>{item}</li>
                {/each}
              </ul>
            </div>
          {/each}
        </div>
      </section>

      <section>
        <h2>{t.sections.languages}</h2>
        <ul class="plain">
          {#each t.languages as language}
            <li><strong>{language.lang}</strong> - {language.level}</li>
          {/each}
        </ul>
      </section>

      <section>
        <h2>{t.sections.education}</h2>
        <ul class="plain">
          {#each t.education as education}
            <li>
              <strong>{education.title}</strong>
              <span class="muted">{education.org}</span>
              <span class="muted mono">{education.period}</span>
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
  :global(body) {
    overflow-x: hidden;
  }

  .toolbar {
    position: sticky;
    top: 1rem;
    z-index: 30;
    width: min(calc(100% - 1.5rem), var(--container-max));
    margin: 1rem auto 1.5rem;
    padding: 0.9rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .tool-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--on-surface);
    font-family: var(--font-display);
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .tool-link:hover {
    color: var(--secondary);
  }

  .tool-actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn {
    min-height: 2.9rem;
    padding: 0.65rem 1rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-family: var(--font-display);
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition:
      transform 0.24s ease,
      border-color 0.24s ease,
      box-shadow 0.24s ease,
      background 0.24s ease;
  }

  .btn:hover {
    transform: translateY(-1px);
  }

  .btn.ghost {
    background: rgba(255, 255, 255, 0.03);
    color: var(--on-surface);
  }

  .btn.ghost:hover {
    border-color: rgba(0, 238, 252, 0.35);
    box-shadow: 0 0 20px rgba(0, 238, 252, 0.12);
  }

  .btn.primary {
    color: #fff;
    background: linear-gradient(135deg, var(--primary-strong), var(--secondary-strong));
    box-shadow: 0 10px 34px rgba(188, 19, 254, 0.24);
  }

  .sheet {
    width: min(calc(100% - 1.5rem), 1180px);
    margin: 0 auto 3rem;
    padding: 2rem;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.022));
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem;
    backdrop-filter: blur(18px);
    box-shadow:
      0 24px 80px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.02) inset,
      0 0 48px rgba(188, 19, 254, 0.08);
    color: var(--on-surface);
  }

  .head {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 1.5rem;
    align-items: end;
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    position: relative;
  }

  .head::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 12rem;
    height: 2px;
    background: linear-gradient(90deg, var(--secondary-strong), var(--primary-strong));
    box-shadow: 0 0 16px rgba(188, 19, 254, 0.25);
  }

  .head-main {
    display: grid;
    gap: 0.6rem;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    font-family: var(--font-display);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--secondary);
  }

  .eyebrow::before {
    content: '';
    width: 2.25rem;
    height: 1px;
    background: linear-gradient(90deg, var(--secondary-strong), transparent);
  }

  h1 {
    font-size: clamp(2.5rem, 6vw, 4.3rem);
    line-height: 0.95;
    text-shadow: 0 0 24px rgba(235, 178, 255, 0.18);
  }

  .title {
    color: var(--on-surface-variant);
    font-size: 1rem;
    max-width: 42rem;
  }

  .contact {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, auto));
    gap: 0.5rem 1.5rem;
    color: var(--on-surface-variant);
    justify-items: start;
  }

  .contact li {
    display: grid;
    gap: 0.15rem;
  }

  .label {
    font-family: var(--font-display);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--secondary);
  }

  .contact a {
    color: var(--on-surface);
  }

  .contact a:hover {
    color: var(--secondary);
  }

  .highlights {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .hl {
    padding: 1rem 1.1rem;
    border-radius: 1.25rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: grid;
    gap: 0.3rem;
  }

  .hl-n {
    font-family: var(--font-display);
    font-size: 1.4rem;
    color: var(--secondary-strong);
  }

  .hl-l {
    color: var(--on-surface-variant);
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .grid {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(290px, 0.8fr);
    gap: 1.25rem;
  }

  .col-main,
  .col-side {
    display: grid;
    gap: 1.15rem;
  }

  .col-main section,
  .col-side section {
    padding: 1.2rem;
    border-radius: 1.25rem;
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  h2 {
    margin-bottom: 0.9rem;
    font-size: 1.15rem;
  }

  .lead,
  .context,
  .bullets li,
  .plain li,
  .callout p {
    color: var(--on-surface-variant);
  }

  .lead + .lead {
    margin-top: 0.85rem;
  }

  .timeline {
    display: grid;
    gap: 1rem;
  }

  .job {
    position: relative;
    padding-left: 1.2rem;
    display: grid;
    gap: 0.8rem;
  }

  .job::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.25rem;
    bottom: 0.25rem;
    width: 2px;
    background: linear-gradient(180deg, var(--secondary-strong), var(--primary-strong));
    border-radius: 999px;
    box-shadow: 0 0 14px rgba(188, 19, 254, 0.2);
  }

  .job-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  h3 {
    font-size: 1rem;
  }

  .org,
  .period,
  .muted {
    color: var(--on-surface-variant);
  }

  .period,
  .mono {
    font-family: var(--font-display);
    font-size: 0.78rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .bullets,
  .plain,
  .tags {
    margin: 0;
    padding-left: 1rem;
  }

  .bullets {
    display: grid;
    gap: 0.45rem;
  }

  .skills {
    display: grid;
    gap: 0.9rem;
  }

  .skill-group {
    display: grid;
    gap: 0.65rem;
  }

  h4 {
    font-size: 0.9rem;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-left: 0;
    list-style: none;
  }

  .tags li {
    padding: 0.32rem 0.7rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: var(--on-surface-variant);
    font-family: var(--font-display);
    font-size: 0.74rem;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .plain {
    display: grid;
    gap: 0.55rem;
  }

  .plain li {
    display: grid;
    gap: 0.18rem;
  }

  .callout {
    background:
      radial-gradient(circle at top right, rgba(0, 238, 252, 0.12), transparent 42%),
      rgba(255, 255, 255, 0.03);
  }

  .callout h4 {
    margin-bottom: 0.65rem;
    color: var(--secondary);
  }

  .foot {
    margin-top: 1.35rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    color: var(--outline);
    font-size: 0.82rem;
  }

  @media (max-width: 960px) {
    .toolbar {
      width: calc(100% - 1rem);
    }

    .sheet {
      width: calc(100% - 1rem);
      padding: 1.25rem;
    }

    .head,
    .grid,
    .highlights {
      grid-template-columns: 1fr;
    }

    .contact {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .toolbar {
      flex-direction: column;
      align-items: stretch;
    }

    .tool-actions {
      flex-direction: column;
    }

    .btn {
      width: 100%;
    }

    .job-head,
    .foot {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media print {
    :global(html),
    :global(body) {
      background: #fff !important;
      color: #111 !important;
    }

    .no-print {
      display: none !important;
    }

    .sheet {
      width: 100%;
      margin: 0;
      padding: 0;
      background: #fff;
      border: 0;
      border-radius: 0;
      box-shadow: none;
      backdrop-filter: none;
      color: #111;
    }

    .head,
    .foot {
      border-color: #d6d6d6;
    }

    .head::after {
      box-shadow: none;
    }

    .hl,
    .col-main section,
    .col-side section,
    .tags li {
      background: #fff;
      color: #111;
      box-shadow: none;
      border-color: #d9d9d9;
    }

    .title,
    .contact,
    .lead,
    .context,
    .bullets li,
    .plain li,
    .org,
    .period,
    .muted,
    .callout p,
    .foot,
    .hl-l {
      color: #444 !important;
    }

    .label,
    .eyebrow,
    .period,
    .mono,
    .hl-n,
    .callout h4 {
      color: #111 !important;
    }

    .job::before,
    .head::after {
      background: #111 !important;
    }

    .contact a,
    a {
      color: #111 !important;
      text-decoration: none;
    }

    .job,
    .col-main section,
    .col-side section,
    .hl {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    @page {
      size: A4;
      margin: 10mm;
    }
  }
</style>