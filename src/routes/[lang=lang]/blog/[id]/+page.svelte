<script lang="ts">
  import { onMount } from 'svelte';
  import { dictionaries, localeDateFormat, type Locale } from '$lib/i18n';

  let { data }: { data: { id: string; lang: Locale } } = $props();

  const t = $derived(dictionaries[data.lang].blogDetail);

  interface Post { id: string; title: string; content: string; date: string; }
  let post = $state<Post | null>(null);
  let loading = $state(true);
  let notFound = $state(false);

  const WORKER_URL = import.meta.env.VITE_BLOG_WORKER_URL ?? '';

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
    return new Date(iso).toLocaleDateString(localeDateFormat(data.lang), { year: 'numeric', month: 'long', day: 'numeric' });
  }

  onMount(async () => {
    if (!WORKER_URL) { loading = false; notFound = true; return; }
    try {
      const res = await fetch(`${WORKER_URL}/api/posts`);
      if (res.ok) {
        const posts: Post[] = await res.json();
        post = posts.find(p => p.id === data.id) ?? null;
        if (!post) notFound = true;
      } else {
        notFound = true;
      }
    } catch {
      notFound = true;
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>{post ? `${post.title} · Carlos Ledesma` : 'Blog · Carlos Ledesma'}</title>
</svelte:head>

<div class="page">
  <div class="bg-blob blob-cyan" aria-hidden="true"></div>
  <div class="bg-blob blob-violet" aria-hidden="true"></div>

  <nav>
    <a href="/{data.lang}#blog" class="back-link">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      {t.back}
    </a>
    <a href="/{data.lang}" class="logo" aria-label="Carlos Ledesma">
      <img src="/design/logo-mark.svg" alt="" class="logo-image" />
    </a>
  </nav>

  <main>
    {#if loading}
      <div class="loading">
        <div class="spinner"></div>
        <span>{t.loading}</span>
      </div>
    {:else if notFound || !post}
      <div class="not-found">
        <span class="not-found-code mono">404</span>
        <h2>{t.notFoundTitle}</h2>
        <p>{t.notFoundBody}</p>
        <a href="/{data.lang}#blog" class="btn-back">{t.notFoundBack}</a>
      </div>
    {:else}
      <article class="post">
        <header class="post-header">
          <p class="eyebrow">
            <span class="eyebrow-rule"></span>
            {data.lang === 'es' ? 'Cuaderno' : 'Notebook'} · <span class="mono">#{post.id}</span>
          </p>
          <div class="post-meta">
            <time class="post-date mono">{formatDate(post.date)}</time>
          </div>
          <h1 class="post-title">{post.title}</h1>
        </header>
        <div class="post-body">
          <p>{@html renderMarkdown(post.content)}</p>
        </div>
        <footer class="post-footer">
          <a href="/{data.lang}#blog" class="btn-back">{t.notFoundBack}</a>
        </footer>
      </article>
    {/if}
  </main>
</div>

<style>
  /* Dominant neon for this view: CYAN */
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

  /* ── Decorative blobs ─────────────────────────────────────────── */
  .bg-blob {
    position: fixed;
    width: 62vw;
    height: 62vw;
    max-width: 780px;
    max-height: 780px;
    border-radius: 50%;
    opacity: 0.2;
    filter: blur(90px) saturate(1.2);
    pointer-events: none;
    z-index: 0;
    will-change: transform;
  }
  .blob-cyan {
    top: -22%;
    left: -18%;
    background: radial-gradient(circle, var(--neon-cyan), transparent 70%);
    animation: drift-a 22s var(--ease-in-out) infinite alternate;
  }
  .blob-violet {
    bottom: -22%;
    right: -20%;
    opacity: 0.14;
    background: radial-gradient(circle, var(--neon-violet), transparent 70%);
    animation: drift-b 28s var(--ease-in-out) infinite alternate;
  }
  @keyframes drift-a {
    from { transform: translate3d(0, 0, 0) scale(1); }
    to   { transform: translate3d(4vw, 3vw, 0) scale(1.15); }
  }
  @keyframes drift-b {
    from { transform: translate3d(0, 0, 0) scale(1); }
    to   { transform: translate3d(-5vw, -3vw, 0) scale(1.12); }
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
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--fs-micro);
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--fg-subtle);
    transition: color var(--dur-base) var(--ease-out-quart);
  }
  .back-link:hover { color: var(--neon-cyan); }
  .logo {
    display: inline-flex;
    align-items: center;
    color: var(--fg);
  }
  .logo-image {
    width: 34px;
    height: 34px;
    display: block;
    filter: drop-shadow(0 0 10px rgba(0, 245, 212, 0.18));
  }

  /* ── Main wrapper ─────────────────────────────────────────────── */
  main {
    position: relative;
    z-index: 1;
    flex: 1;
    max-width: 760px;
    width: 100%;
    margin: 0 auto;
    padding: var(--space-9) var(--gutter);
  }

  /* ── Loading / not-found ──────────────────────────────────────── */
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
    padding: var(--space-10);
    color: var(--fg-whisper);
    font-family: var(--font-mono);
    font-size: var(--fs-caption);
  }
  .spinner {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid rgba(0, 245, 212, 0.18);
    border-top-color: var(--neon-cyan);
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-10) var(--space-5);
    text-align: center;
    color: var(--fg-muted);
  }
  .not-found-code {
    font-family: var(--font-mono);
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -0.04em;
    background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 0 40px rgba(0, 245, 212, 0.3);
  }
  .not-found h2 {
    font-family: var(--font-display);
    font-size: var(--fs-h2);
    font-weight: 600;
    color: var(--fg);
    margin: 0;
  }
  .not-found p {
    font-size: var(--fs-body);
    color: var(--fg-muted);
    margin: 0;
    max-width: 42ch;
  }

  /* ── Post ─────────────────────────────────────────────────────── */
  .post {
    display: flex;
    flex-direction: column;
    gap: var(--space-7);
  }
  .post-header {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

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
    background: var(--neon-cyan);
    box-shadow: 0 0 8px var(--neon-cyan);
    flex-shrink: 0;
  }
  .mono { font-family: var(--font-mono); }

  .post-meta {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }
  .post-date {
    font-size: var(--fs-caption);
    color: var(--neon-cyan);
    padding: 0.25rem 0.6rem;
    border: 1px solid rgba(0, 245, 212, 0.25);
    border-radius: var(--radius-xs);
    background: rgba(0, 245, 212, 0.06);
  }

  .post-title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 500;
    line-height: var(--lh-tight);
    letter-spacing: var(--tracking-tight);
    margin: 0;
    text-wrap: balance;
    background: linear-gradient(135deg, var(--fg), var(--fg-muted) 70%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .post-body {
    font-family: var(--font-sans);
    font-size: var(--fs-body-lg);
    line-height: var(--lh-loose);
    color: var(--fg-muted);
    padding: var(--space-7);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.03),
      rgba(255, 255, 255, 0.015)
    );
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md), var(--shadow-inner);
    position: relative;
  }
  .post-body::before {
    content: '';
    position: absolute;
    top: -1px;
    left: var(--space-5);
    width: 64px;
    height: 2px;
    background: var(--neon-cyan);
    box-shadow: 0 0 12px var(--neon-cyan);
    border-radius: 2px;
  }
  .post-body :global(p) { margin: 0 0 1.25em; }
  .post-body :global(p:last-child) { margin-bottom: 0; }
  .post-body :global(strong) { color: var(--fg); font-weight: 600; }
  .post-body :global(em) { color: var(--neon-cyan-hi); font-style: italic; }
  .post-body :global(code) {
    font-family: var(--font-mono);
    font-size: 0.88em;
    background: rgba(0, 245, 212, 0.08);
    border: 1px solid rgba(0, 245, 212, 0.16);
    padding: 0.1em 0.4em;
    border-radius: var(--radius-xs);
    color: var(--neon-cyan-hi);
  }
  .post-body :global(a) {
    color: var(--neon-cyan);
    text-decoration: underline;
    text-decoration-color: rgba(0, 245, 212, 0.3);
    text-underline-offset: 4px;
    transition: color var(--dur-fast), text-decoration-color var(--dur-fast);
  }
  .post-body :global(a:hover) {
    color: var(--neon-cyan-hi);
    text-decoration-color: var(--neon-cyan);
  }

  .post-footer {
    padding-top: var(--space-5);
    border-top: 1px solid var(--border);
  }

  .btn-back {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    border: 1px solid rgba(0, 245, 212, 0.35);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: var(--fs-micro);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: var(--tracking-eyebrow);
    color: var(--fg-muted);
    background: rgba(0, 245, 212, 0.04);
    transition:
      border-color var(--dur-base) var(--ease-out-quart),
      color var(--dur-base) var(--ease-out-quart),
      background var(--dur-base) var(--ease-out-quart),
      box-shadow var(--dur-base) var(--ease-out-quart);
  }
  .btn-back:hover {
    border-color: var(--neon-cyan);
    color: var(--neon-cyan);
    background: rgba(0, 245, 212, 0.1);
    box-shadow: 0 0 24px rgba(0, 245, 212, 0.25);
  }

  @media (max-width: 640px) {
    nav { padding: var(--space-3) var(--space-5); }
    main { padding: var(--space-7) var(--space-5); }
    .post-body { padding: var(--space-5); font-size: var(--fs-body); }
  }

  @media (prefers-reduced-motion: reduce) {
    .bg-blob, .spinner { animation: none !important; }
  }
</style>
