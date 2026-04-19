<script lang="ts">
  import { onMount } from 'svelte';

  let { data } = $props<{ data: { id: string } }>();

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
    return new Date(iso).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
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
  <nav>
    <a href="/#blog" class="back-link">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Volver al blog
    </a>
    <a href="/" class="logo">CL<span>.</span></a>
  </nav>

  <main>
    {#if loading}
      <div class="loading">
        <div class="spinner"></div>
        <span>Cargando…</span>
      </div>
    {:else if notFound || !post}
      <div class="not-found">
        <span class="not-found-icon">🔍</span>
        <h2>Post no encontrado</h2>
        <p>El post que buscas no existe o ha sido eliminado.</p>
        <a href="/#blog" class="btn-back">← Volver al blog</a>
      </div>
    {:else}
      <article class="post">
        <header class="post-header">
          <div class="post-meta">
            <time class="post-date">{formatDate(post.date)}</time>
            <span class="post-id">#{post.id}</span>
          </div>
          <h1 class="post-title">{post.title}</h1>
        </header>
        <div class="post-body">
          <p>{@html renderMarkdown(post.content)}</p>
        </div>
        <footer class="post-footer">
          <a href="/#blog" class="btn-back">← Volver al blog</a>
        </footer>
      </article>
    {/if}
  </main>
</div>

<style>
  :global(body) {
    margin: 0;
    background: #050510;
    color: #f8fafc;
    font-family: Inter, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .page { min-height: 100vh; display: flex; flex-direction: column; }

  nav {
    position: sticky; top: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.25rem 3rem;
    background: rgba(5,5,16,0.85); backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .back-link {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-size: 0.875rem; color: #94a3b8;
    transition: color 0.2s;
  }
  .back-link:hover { color: #6366f1; }

  .logo { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.05em; text-decoration: none; color: #f8fafc; }
  .logo span { color: #6366f1; }

  main {
    flex: 1;
    max-width: 720px; width: 100%;
    margin: 0 auto; padding: 4rem 2rem;
  }

  .loading {
    display: flex; align-items: center; justify-content: center; gap: 1rem;
    padding: 6rem; color: #475569; font-size: 0.9rem;
  }
  .spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid rgba(99,102,241,0.2); border-top-color: #6366f1;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .not-found {
    display: flex; flex-direction: column; align-items: center; gap: 1rem;
    padding: 6rem 2rem; text-align: center; color: #475569;
  }
  .not-found-icon { font-size: 3rem; }
  .not-found h2 { font-size: 1.5rem; font-weight: 700; color: #94a3b8; margin: 0; }
  .not-found p { font-size: 0.95rem; margin: 0; }

  .post { display: flex; flex-direction: column; gap: 2.5rem; }

  .post-header { display: flex; flex-direction: column; gap: 1rem; }

  .post-meta {
    display: flex; align-items: center; gap: 1rem;
  }
  .post-date {
    font-size: 0.8rem; color: #6366f1;
    font-family: 'JetBrains Mono', monospace;
    background: rgba(99,102,241,0.1); padding: 0.2rem 0.6rem; border-radius: 4px;
  }
  .post-id { font-size: 0.75rem; color: #334155; font-family: 'JetBrains Mono', monospace; }

  .post-title {
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    font-weight: 800; line-height: 1.2; letter-spacing: -0.03em;
    margin: 0;
    background: linear-gradient(135deg, #f8fafc, #94a3b8);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .post-body {
    font-size: 1.05rem; line-height: 1.85; color: #cbd5e1;
    padding: 2.5rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
  }
  .post-body :global(p) { margin: 0 0 1.25em; }
  .post-body :global(p:last-child) { margin-bottom: 0; }
  .post-body :global(strong) { color: #f8fafc; font-weight: 700; }
  .post-body :global(em) { color: #a5b4fc; font-style: italic; }
  .post-body :global(code) {
    font-family: 'JetBrains Mono', monospace; font-size: 0.88em;
    background: rgba(99,102,241,0.15); padding: 0.15em 0.4em;
    border-radius: 4px; color: #a5b4fc;
  }
  .post-body :global(a) {
    color: #6366f1; text-decoration: underline; text-underline-offset: 3px;
  }
  .post-body :global(a:hover) { color: #8b5cf6; }

  .post-footer { padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.08); }

  .btn-back {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.6rem 1.25rem;
    border: 1px solid rgba(99,102,241,0.4); border-radius: 8px;
    font-size: 0.875rem; font-weight: 600; color: #94a3b8;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    text-decoration: none;
  }
  .btn-back:hover { border-color: #6366f1; color: #6366f1; background: rgba(99,102,241,0.08); }

  @media (max-width: 640px) {
    nav { padding: 1rem 1.25rem; }
    main { padding: 2rem 1.25rem; }
    .post-body { padding: 1.5rem; font-size: 0.95rem; }
  }
</style>
