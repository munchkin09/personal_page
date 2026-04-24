<script lang="ts">
  import { dictionaries, type Locale } from '$lib/i18n';

  let { data }: { data: { lang: Locale } } = $props();
  const t = $derived(dictionaries[data.lang].now);
</script>

<svelte:head>
  <title>{t.pageTitle}</title>
  <meta name="description" content={t.pageDescription} />
</svelte:head>

<div class="page">
  <div class="bg-blob blob-violet" aria-hidden="true"></div>
  <div class="bg-blob blob-cyan" aria-hidden="true"></div>

  <nav>
    <a href="/{data.lang}" class="back-link">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      {t.back}
    </a>
    <a href="/{data.lang}" class="logo" aria-label="Carlos Ledesma">
      <img src="/design/logo-mark.svg" alt="" class="logo-image" />
    </a>
  </nav>

  <main class="container">
    <header class="page-header">
      <p class="eyebrow">
        <span class="eyebrow-rule"></span>
        {t.eyebrow}
      </p>
      <h1 class="page-title">{t.title}</h1>
      <p class="updated">{t.updated}</p>
    </header>

    <div class="grid">
      {#each t.sections as section}
        <section class="card">
          <div class="card-icon" aria-hidden="true">{section.icon}</div>
          <h2 class="card-title">{section.title}</h2>
          <ul class="card-list">
            {#each section.items as item}
              <li>{@html item}</li>
            {/each}
          </ul>
        </section>
      {/each}
    </div>

    <footer class="page-footer">
      <p class="footer-note">{t.footerNote}</p>
      <a href="/{data.lang}" class="btn-back">{t.back}</a>
    </footer>
  </main>
</div>

<style>
  .page {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--fg);
    overflow-x: hidden;
    isolation: isolate;
  }

  /* ── Blobs ────────────────────────────────────────────────────── */
  .bg-blob {
    position: fixed;
    width: 60vw;
    height: 60vw;
    max-width: 720px;
    max-height: 720px;
    border-radius: 50%;
    opacity: 0.15;
    filter: blur(90px) saturate(1.2);
    pointer-events: none;
    z-index: 0;
    will-change: transform;
  }
  .blob-violet {
    top: -20%;
    right: -18%;
    background: radial-gradient(circle, var(--neon-violet), transparent 70%);
    animation: drift-a 24s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate;
  }
  .blob-cyan {
    bottom: -20%;
    left: -18%;
    opacity: 0.1;
    background: radial-gradient(circle, var(--neon-cyan), transparent 70%);
    animation: drift-b 30s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate;
  }
  @keyframes drift-a {
    from { transform: translate3d(0, 0, 0) scale(1); }
    to   { transform: translate3d(-4vw, 3vw, 0) scale(1.12); }
  }
  @keyframes drift-b {
    from { transform: translate3d(0, 0, 0) scale(1); }
    to   { transform: translate3d(5vw, -3vw, 0) scale(1.1); }
  }

  /* ── Nav ──────────────────────────────────────────────────────── */
  nav {
    position: sticky;
    top: 0;
    z-index: var(--z-sticky);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--gutter);
    background: var(--bg-overlay);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    letter-spacing: 0.06em;
    color: var(--fg-muted);
    transition: color var(--dur-base) var(--ease-out-quart);
  }
  .back-link:hover { color: var(--neon-violet); }

  .logo { display: inline-flex; align-items: center; }
  .logo-image { width: 30px; height: 30px; display: block; }

  /* ── Header ───────────────────────────────────────────────────── */
  .page-header {
    padding: var(--space-10) 0 var(--space-7);
    text-align: center;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: var(--font-mono);
    font-size: var(--fs-micro);
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--fg-subtle);
    font-weight: 500;
    margin: 0 0 var(--space-4);
  }
  .eyebrow-rule {
    width: 28px;
    height: 1px;
    background: var(--neon-violet);
    box-shadow: 0 0 8px var(--neon-violet);
    flex-shrink: 0;
  }

  .page-title {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 600;
    line-height: var(--lh-tight);
    letter-spacing: var(--tracking-tight);
    margin: 0 0 var(--space-3);
    background: linear-gradient(135deg, var(--fg) 30%, var(--neon-violet) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  .updated {
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    color: var(--fg-subtle);
    margin: 0;
  }

  /* ── Grid ─────────────────────────────────────────────────────── */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-5);
    padding-bottom: var(--space-9);
  }

  .card {
    padding: var(--space-6);
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    transition:
      border-color var(--dur-base) var(--ease-out-quart),
      box-shadow var(--dur-base) var(--ease-out-quart),
      transform var(--dur-base) var(--ease-out-quart);
  }
  .card:hover {
    border-color: color-mix(in srgb, var(--neon-violet) 35%, transparent);
    box-shadow: 0 0 32px color-mix(in srgb, var(--neon-violet) 10%, transparent);
    transform: translateY(-2px);
  }

  .card-icon {
    font-size: 1.75rem;
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
    top: 2px;
  }

  /* ── Footer ───────────────────────────────────────────────────── */
  .page-footer {
    text-align: center;
    padding: var(--space-7) 0 var(--space-10);
    border-top: 1px solid var(--border);
  }

  .footer-note {
    font-size: var(--fs-body-sm);
    color: var(--fg-subtle);
    margin: 0 0 var(--space-5);
    font-style: italic;
  }

  .btn-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 22px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-pill);
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
    color: var(--fg-muted);
    transition:
      border-color var(--dur-base) var(--ease-out-quart),
      color var(--dur-base) var(--ease-out-quart);
  }
  .btn-back:hover { border-color: var(--neon-violet); color: var(--neon-violet); }
</style>
