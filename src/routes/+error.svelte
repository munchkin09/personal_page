<script lang="ts">
  import { page } from '$app/stores';
  import { isLocale, type Locale } from '$lib/i18n';

  const lang = $derived<Locale>(
    (() => {
      const seg = $page.url.pathname.split('/').filter(Boolean)[0];
      return isLocale(seg) ? seg : 'es';
    })()
  );

  const status = $derived($page.status ?? 500);
  const isNotFound = $derived(status === 404);

  const copy = {
    es: {
      eyebrow: 'Error',
      notFoundTitle: 'Página no encontrada',
      notFoundBody: 'La ruta que buscabas no existe o se movió de sitio. Volvamos a terreno conocido.',
      genericTitle: 'Algo ha fallado',
      genericBody: 'Ha ocurrido un error inesperado en el servidor. Inténtalo de nuevo en unos instantes.',
      home: 'Ir al inicio',
      back: 'Volver',
    },
    en: {
      eyebrow: 'Error',
      notFoundTitle: 'Page not found',
      notFoundBody: 'The route you were looking for does not exist or has moved. Let us get you back on track.',
      genericTitle: 'Something went wrong',
      genericBody: 'An unexpected server error occurred. Please try again in a moment.',
      home: 'Go home',
      back: 'Back',
    },
  } as const;

  const t = $derived(copy[lang]);
  const title = $derived(isNotFound ? t.notFoundTitle : t.genericTitle);
  const body = $derived(isNotFound ? t.notFoundBody : t.genericBody);

  function goBack() {
    if (typeof history !== 'undefined' && history.length > 1) history.back();
    else window.location.href = `/${lang}`;
  }
</script>

<svelte:head>
  <title>{status} · {title} · Carlos Ledesma</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="shell">
  <div class="bg-blob blob-violet" aria-hidden="true"></div>
  <div class="bg-blob blob-cyan" aria-hidden="true"></div>
  <div class="bg-blob blob-pink" aria-hidden="true"></div>

  <main class="card">
    <p class="eyebrow">
      <span class="eyebrow-rule"></span>
      {t.eyebrow} · <span class="mono">HTTP {status}</span>
    </p>

    <h1 class="code">
      <span class="digit d1">{String(status)[0] ?? '5'}</span><span
        class="digit d2">{String(status)[1] ?? '0'}</span><span
        class="digit d3">{String(status)[2] ?? '0'}</span>
    </h1>

    <h2 class="title">{title}</h2>
    <p class="body">{body}</p>

    {#if $page.error?.message && !isNotFound}
      <pre class="detail mono">{$page.error.message}</pre>
    {/if}

    <div class="actions">
      <a class="btn primary" href="/{lang}">
        <span>{t.home}</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
      <button type="button" class="btn ghost" onclick={goBack}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M13 8H3M7 4 3 8l4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>{t.back}</span>
      </button>
    </div>
  </main>
</div>

<style>
  .shell {
    position: relative;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: var(--space-7) var(--gutter);
    background: var(--bg);
    color: var(--fg);
    overflow: hidden;
    isolation: isolate;
  }

  /* ── Blobs ─────────────────────────────────────────────────────── */
  .bg-blob {
    position: absolute;
    width: 56vw;
    height: 56vw;
    max-width: 720px;
    max-height: 720px;
    border-radius: 50%;
    opacity: 0.22;
    filter: blur(100px) saturate(1.2);
    pointer-events: none;
    z-index: 0;
    will-change: transform;
  }
  .blob-violet {
    top: -22%;
    left: -14%;
    background: radial-gradient(circle, var(--neon-violet), transparent 70%);
    animation: drift-a 22s var(--ease-in-out) infinite alternate;
  }
  .blob-cyan {
    bottom: -22%;
    right: -18%;
    background: radial-gradient(circle, var(--neon-cyan), transparent 70%);
    animation: drift-b 26s var(--ease-in-out) infinite alternate;
    opacity: 0.18;
  }
  .blob-pink {
    top: 40%;
    left: 55%;
    width: 36vw;
    height: 36vw;
    background: radial-gradient(circle, var(--neon-pink), transparent 70%);
    animation: drift-c 30s var(--ease-in-out) infinite alternate;
    opacity: 0.12;
  }
  @keyframes drift-a {
    from { transform: translate3d(0,0,0) scale(1); }
    to   { transform: translate3d(4vw,3vw,0) scale(1.15); }
  }
  @keyframes drift-b {
    from { transform: translate3d(0,0,0) scale(1); }
    to   { transform: translate3d(-5vw,-3vw,0) scale(1.12); }
  }
  @keyframes drift-c {
    from { transform: translate3d(0,0,0) scale(1); }
    to   { transform: translate3d(3vw,-4vw,0) scale(0.92); }
  }

  /* ── Card ──────────────────────────────────────────────────────── */
  .card {
    position: relative;
    z-index: 1;
    max-width: 640px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    padding: var(--space-8) var(--space-7);
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--fg) 4%, transparent),
      color-mix(in srgb, var(--fg) 2%, transparent)
    );
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg), var(--shadow-inner);
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      var(--neon-violet),
      var(--neon-cyan) 50%,
      var(--neon-pink)
    );
    opacity: 0.9;
  }

  /* ── Eyebrow ───────────────────────────────────────────────────── */
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--fs-micro);
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--fg-subtle);
    font-weight: 500;
    margin: 0;
  }
  .eyebrow-rule {
    width: 28px;
    height: 1px;
    background: var(--neon-violet);
    box-shadow: 0 0 8px var(--neon-violet);
    flex-shrink: 0;
  }
  .mono { font-family: var(--font-mono); }

  /* ── Status code display ───────────────────────────────────────── */
  .code {
    font-family: var(--font-display);
    font-size: clamp(4.5rem, 14vw, 9rem);
    font-weight: 500;
    line-height: 0.9;
    letter-spacing: -0.04em;
    margin: 0;
    display: inline-flex;
    gap: 0.02em;
  }
  .digit {
    display: inline-block;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
  }
  .d1 { background-image: linear-gradient(180deg, var(--neon-violet-hi), var(--neon-violet)); text-shadow: 0 0 60px color-mix(in srgb, var(--neon-violet) 35%, transparent); }
  .d2 { background-image: linear-gradient(180deg, var(--neon-cyan-hi), var(--neon-cyan)); text-shadow: 0 0 60px color-mix(in srgb, var(--neon-cyan) 35%, transparent); }
  .d3 { background-image: linear-gradient(180deg, var(--neon-pink-hi), var(--neon-pink)); text-shadow: 0 0 60px color-mix(in srgb, var(--neon-pink) 35%, transparent); }

  /* ── Headings + body ───────────────────────────────────────────── */
  .title {
    font-family: var(--font-display);
    font-size: var(--fs-h1);
    font-weight: 500;
    letter-spacing: var(--tracking-tight);
    color: var(--fg);
    margin: 0;
    line-height: var(--lh-tight);
  }
  .body {
    font-size: var(--fs-body-lg);
    line-height: var(--lh-loose);
    color: var(--fg-muted);
    margin: 0;
    max-width: 52ch;
  }
  .detail {
    font-size: var(--fs-caption);
    color: var(--fg-subtle);
    background: color-mix(in srgb, var(--signal-error) 6%, transparent);
    border: 1px solid color-mix(in srgb, var(--signal-error) 22%, transparent);
    border-left: 2px solid var(--signal-error);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-sm);
    white-space: pre-wrap;
    word-break: break-word;
    margin: 0;
  }

  /* ── Actions ───────────────────────────────────────────────────── */
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-top: var(--space-3);
  }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    font-family: var(--font-mono);
    font-size: var(--fs-micro);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    border-radius: var(--radius-sm);
    border: 1px solid transparent;
    cursor: pointer;
    transition:
      background var(--dur-base) var(--ease-out-quart),
      border-color var(--dur-base) var(--ease-out-quart),
      color var(--dur-base) var(--ease-out-quart),
      box-shadow var(--dur-base) var(--ease-out-quart),
      transform var(--dur-base) var(--ease-spring);
  }
  .btn:hover { transform: translateY(-1px); }
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
  .btn.ghost {
    background: transparent;
    color: var(--fg-muted);
    border-color: var(--border-strong);
  }
  .btn.ghost:hover {
    color: var(--neon-cyan);
    border-color: var(--neon-cyan);
    background: color-mix(in srgb, var(--neon-cyan) 6%, transparent);
  }

  @media (max-width: 560px) {
    .card { padding: var(--space-6) var(--space-5); }
    .actions { flex-direction: column; align-items: stretch; }
    .btn { justify-content: center; }
  }

  @media (prefers-reduced-motion: reduce) {
    .bg-blob { animation: none !important; }
    .btn:hover { transform: none; }
  }
</style>
