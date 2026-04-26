<script lang="ts">
  import { dictionaries, type Locale } from '$lib/i18n';
  import BackgroundLayers from '$components/BackgroundLayers/BackgroundLayers.svelte';
  import Footer from '$components/Footer/Footer.svelte';
  import { fadeIn, magnetic } from '$lib/actions';

  let { data }: { data: { lang: Locale } } = $props();
  const t = $derived(dictionaries[data.lang].now);

  /** Split the title into a prefix + highlighted last word. */
  const titleWords = $derived(t.title.split(' '));
  const titlePrefix = $derived(titleWords.slice(0, -1).join(' '));
  const titleAccent = $derived(titleWords[titleWords.length - 1] ?? t.title);
</script>

<svelte:head>
  <title>{t.pageTitle}</title>
  <meta name="description" content={t.pageDescription} />
</svelte:head>

<BackgroundLayers />

<div class="page">
  <!-- ── Pill nav ─────────────────────────────────────────────── -->
  <div class="nav-wrap">
    <nav class="pill-nav" aria-label="Now page navigation">
      <a href="/{data.lang}" class="back-link" use:magnetic>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="mono">{t.back}</span>
      </a>

      <a href="/{data.lang}" class="logo-link" aria-label="Carlos Ledesma — ir al inicio">
        <img src="/design/logo-mark.svg" alt="" class="logo-img" />
        <span class="logo-name">Carlos Ledesma</span>
      </a>
    </nav>
  </div>

  <!-- ── Page body ────────────────────────────────────────────── -->
  <main class="container">

    <!-- Header -->
    <header class="page-header" use:fadeIn>
      <p class="eyebrow">
        <span class="eyebrow-rule"></span>
        {t.eyebrow}
        <span class="pulse-dot" aria-hidden="true"></span>
      </p>
      <h1 class="page-title">
        {titlePrefix}&nbsp;<span class="gradient-text">{titleAccent}</span>
      </h1>
      <p class="updated mono">{t.updated}</p>
    </header>

    <!-- Card grid -->
    <div class="now-grid">
      {#each t.sections as section, i}
        <article
          class="now-card"
          use:fadeIn
          style="transition-delay: {i * 80}ms"
        >
          <div class="card-icon" aria-hidden="true">{section.icon}</div>
          <h2 class="card-title">{section.title}</h2>
          <ul class="card-list">
            {#each section.items as item}
              <li>{@html item}</li>
            {/each}
          </ul>
        </article>
      {/each}
    </div>

    <!-- CTA strip -->
    <div class="cta-strip" use:fadeIn>
      <p class="footer-note mono">{t.footerNote}</p>
      <a href="/{data.lang}" class="btn btn-secondary" use:magnetic>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {t.back}
      </a>
    </div>

  </main>

  <Footer lang={data.lang} />
</div>

<style>
  /* ── Shell ────────────────────────────────────────────────────── */
  .page {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* ── Pill nav ─────────────────────────────────────────────────── */
  .nav-wrap {
    position: sticky;
    top: 14px;
    z-index: var(--z-sticky);
    padding: 0 var(--gutter);
    display: flex;
    justify-content: center;
    pointer-events: none;
  }

  .pill-nav {
    pointer-events: all;
    width: 100%;
    max-width: var(--container-lg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 18px 10px 14px;
    border-radius: var(--radius-pill);
    background: rgba(10, 10, 15, 0.55);
    backdrop-filter: blur(14px) saturate(1.2);
    -webkit-backdrop-filter: blur(14px) saturate(1.2);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-sm);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: var(--fs-caption);
    letter-spacing: 0.05em;
    color: var(--fg-muted);
    transition: color var(--dur-base) var(--ease-out-quart);
  }
  .back-link:hover { color: var(--neon-violet); }
  .back-link svg { flex-shrink: 0; }

  .logo-link {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--fg-muted);
    transition: color var(--dur-base) var(--ease-out-quart);
  }
  .logo-link:hover { color: var(--fg); }

  .logo-img { width: 28px; height: 28px; display: block; }

  .logo-name {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: var(--fs-caption);
    letter-spacing: -0.01em;
    white-space: nowrap;
  }

  /* ── Page header ──────────────────────────────────────────────── */
  .page-header {
    padding: var(--space-10) 0 var(--space-8);
    text-align: center;
  }

  .page-title {
    font-family: var(--font-display);
    font-size: var(--fs-display-lg);
    font-weight: 600;
    line-height: var(--lh-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--fg);
    margin: 0 0 var(--space-3);
  }

  .updated {
    font-size: var(--fs-caption);
    color: var(--fg-whisper);
    margin: 0;
    letter-spacing: 0.06em;
  }

  /* ── Card grid ────────────────────────────────────────────────── */
  .now-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-5);
    padding-bottom: var(--space-9);
  }

  .now-card {
    padding: var(--space-6);
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    transition:
      border-color var(--dur-base) var(--ease-out-quart),
      box-shadow var(--dur-base) var(--ease-out-quart),
      transform var(--dur-base) var(--ease-out-quart);
  }

  .now-card:hover {
    border-color: color-mix(in srgb, var(--neon-violet) 40%, transparent);
    box-shadow: var(--glow-violet);
    transform: translateY(-2px);
  }

  .card-icon {
    font-size: 1.875rem;
    margin-bottom: var(--space-3);
    line-height: 1;
  }

  .card-title {
    font-family: var(--font-display);
    font-size: var(--fs-h3);
    font-weight: 600;
    color: var(--fg);
    margin: 0 0 var(--space-4);
  }

  .card-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .card-list li {
    font-size: var(--fs-body-sm);
    color: var(--fg-muted);
    padding-left: var(--space-4);
    position: relative;
    line-height: var(--lh-normal);
  }

  .card-list li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--neon-violet);
    font-family: var(--font-mono);
    font-size: 11px;
    top: 3px;
  }

  /* ── CTA strip ────────────────────────────────────────────────── */
  .cta-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-5);
    padding: var(--space-7) 0 var(--space-10);
    border-top: 1px solid var(--border);
    flex-wrap: wrap;
  }

  .footer-note {
    font-size: var(--fs-caption);
    color: var(--fg-subtle);
    margin: 0;
    font-style: italic;
    letter-spacing: 0.04em;
  }

  /* ── Responsive ───────────────────────────────────────────────── */
  @media (max-width: 600px) {
    .logo-name { display: none; }
    .now-grid  { grid-template-columns: 1fr; }
    .cta-strip { flex-direction: column; align-items: flex-start; }
  }
</style>
