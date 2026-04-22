<script lang="ts">
  import { onMount } from 'svelte';
  import { dictionaries, localeDateFormat, type Locale } from '$lib/i18n';

  let { data }: { data: { id: string; lang: Locale } } = $props();

  const t = $derived(dictionaries[data.lang].blogDetail);

  interface Post {
    id: string;
    title: string;
    content: string;
    date: string;
  }

  let post = $state<Post | null>(null);
  let loading = $state(true);
  let notFound = $state(false);

  const WORKER_URL = import.meta.env.VITE_BLOG_WORKER_URL ?? '';

  function renderMarkdown(raw: string): string {
    return raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(localeDateFormat(data.lang), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  onMount(async () => {
    if (!WORKER_URL) {
      loading = false;
      notFound = true;
      return;
    }

    try {
      const res = await fetch(`${WORKER_URL}/api/posts`);
      if (res.ok) {
        const posts: Post[] = await res.json();
        post = posts.find((entry) => entry.id === data.id) ?? null;
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

<div class="blog-shell">
  <nav class="topbar glass-panel">
    <a href="/{data.lang}#blog" class="back-link">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3 5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      {t.back}
    </a>
    <a href="/{data.lang}" class="logo">CL<span>.</span></a>
  </nav>

  <main class="container">
    {#if loading}
      <section class="state-card glass-panel">
        <div class="spinner"></div>
        <span>{t.loading}</span>
      </section>
    {:else if notFound || !post}
      <section class="state-card glass-panel">
        <span class="state-icon">404</span>
        <h2>{t.notFoundTitle}</h2>
        <p>{t.notFoundBody}</p>
        <a href="/{data.lang}#blog" class="button-ghost">{t.notFoundBack}</a>
      </section>
    {:else}
      <article class="post glass-panel">
        <header class="post-header">
          <div class="post-meta">
            <time class="chip">{formatDate(post.date)}</time>
            <span class="chip">#{post.id}</span>
          </div>
          <h1>{post.title}</h1>
        </header>

        <div class="post-body">
          <p>{@html renderMarkdown(post.content)}</p>
        </div>

        <footer class="post-footer">
          <a href="/{data.lang}#blog" class="button-ghost">{t.notFoundBack}</a>
        </footer>
      </article>
    {/if}
  </main>
</div>

<style>
  :global(body) {
    overflow-x: hidden;
  }

  .blog-shell {
    min-height: 100vh;
    padding: 1rem 0 4rem;
  }

  .container {
    width: min(calc(100% - (var(--gutter) * 2)), 860px);
    margin: 0 auto;
  }

  .topbar {
    position: sticky;
    top: 1rem;
    z-index: 20;
    width: min(calc(100% - 1.5rem), 860px);
    margin: 0 auto 2rem;
    padding: 0.9rem 1.1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--on-surface-variant);
    font-family: var(--font-display);
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .back-link:hover {
    color: var(--secondary);
  }

  .logo {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 700;
  }

  .logo span {
    color: var(--secondary-strong);
    text-shadow: 0 0 16px rgba(0, 238, 252, 0.3);
  }

  .state-card,
  .post {
    padding: var(--card-padding);
  }

  .state-card {
    min-height: 22rem;
    display: grid;
    place-items: center;
    gap: 0.9rem;
    text-align: center;
    color: var(--on-surface-variant);
  }

  .state-card h2 {
    font-size: 2rem;
  }

  .state-icon {
    font-family: var(--font-display);
    font-size: 1rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--secondary);
  }

  .spinner {
    width: 2.9rem;
    height: 2.9rem;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.12);
    border-top-color: var(--secondary-strong);
    animation: spin 1s linear infinite;
  }

  .post {
    display: grid;
    gap: 2rem;
  }

  .post-header {
    display: grid;
    gap: 1rem;
  }

  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .post h1 {
    font-size: clamp(2.5rem, 7vw, 4.5rem);
    line-height: 0.98;
    text-shadow: 0 0 24px rgba(235, 178, 255, 0.18);
  }

  .post-body {
    padding: clamp(1.25rem, 4vw, 2rem);
    border-radius: 1.25rem;
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: var(--on-surface-variant);
    line-height: 1.9;
  }

  .post-body :global(p) {
    margin-bottom: 1.25rem;
  }

  .post-body :global(p:last-child) {
    margin-bottom: 0;
  }

  .post-body :global(strong) {
    color: var(--on-surface);
  }

  .post-body :global(em) {
    color: var(--primary);
  }

  .post-body :global(a) {
    color: var(--secondary);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.22em;
  }

  .post-body :global(code) {
    color: var(--secondary);
  }

  .post-footer {
    display: flex;
    justify-content: flex-start;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 640px) {
    .topbar {
      width: calc(100% - 1rem);
      padding: 0.85rem 1rem;
    }

    .state-card,
    .post {
      padding: 1.35rem;
    }

    .post h1 {
      font-size: 2.2rem;
    }

    .post-footer .button-ghost {
      width: 100%;
    }
  }
</style>