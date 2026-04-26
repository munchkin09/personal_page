<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { dictionaries, localeDateFormat, type Locale } from '$lib/i18n';
  import { observeSection, fadeIn, spotlight } from '$lib/actions';

  let { lang }: { lang: Locale } = $props();
  const t = $derived(dictionaries[lang].blog);

  interface Post { id: string; title: string; content: string; date: string; tags?: string[]; }
  let posts = $state<Post[]>([]);
  let postsLoading = $state(false);

  const WORKER_URL = import.meta.env.VITE_BLOG_WORKER_URL ?? '';
  const dateLocale = $derived(localeDateFormat(lang));

  function renderMarkdown(raw: string): string {
    return raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((https?:\/\/[^)]+)\)/g, (_, text, url) => {
        const safeUrl = url.replace(/"/g, '%22').replace(/'/g, '%27');
        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      })
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' });
  }

  async function loadPosts() {
    if (!WORKER_URL) return;
    postsLoading = true;
    try {
      const res = await fetch(`${WORKER_URL}/api/posts`);
      if (res.ok) posts = await res.json();
    } catch {
      /* worker no disponible */
    } finally {
      postsLoading = false;
      await tick();
    }
  }

  onMount(() => { loadPosts(); });
</script>

<section id="blog" class="blog-section" data-accent="violet" use:observeSection>
  <div class="container">
    <div class="section-head" use:fadeIn>
      <div>
        <p class="eyebrow"><span class="eyebrow-rule"></span>{t.label}</p>
        <h2>{t.titlePrefix}<span class="gradient-text">{t.titleHighlight}</span></h2>
      </div>
      <p class="section-sub">{t.subtitle}</p>
    </div>

    {#if postsLoading}
      <div class="blog-state" use:fadeIn role="status" aria-live="polite">
        <div class="blog-spinner"></div>
        <span class="mono">{t.loading}</span>
      </div>
    {:else if posts.length === 0}
      <div class="blog-state" use:fadeIn>
        <svg class="blog-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/>
        </svg>
        <p class="mono">{t.empty}</p>
      </div>
    {:else}
      <div class="blog-grid">
        {#each posts as post, i}
          <a
            href="/{lang}/blog/{post.id}"
            class="blog-card"
            use:fadeIn
            use:spotlight
            style="transition-delay: {i * 70}ms"
          >
            <div class="blog-meta">
              <time class="blog-date mono" datetime={post.date}>{formatDate(post.date)}</time>
              <span class="blog-id mono">#{post.id}</span>
            </div>
            <h3 class="blog-title">{post.title}</h3>
            {#if post.tags?.length}
              <div class="blog-tags">
                {#each post.tags as tag}
                  <span class="blog-tag">{tag}</span>
                {/each}
              </div>
            {/if}
            <div class="blog-body">
              <p>{@html renderMarkdown(post.content)}</p>
            </div>
            <span class="blog-read-more mono">{t.readMore}</span>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-4);
  }

  .blog-card {
    position: relative;
    overflow: hidden;
    padding: var(--space-6);
    background: var(--bg-glass);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-glass);
    color: inherit;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    transition:
      transform var(--dur-base) var(--ease-out-quart),
      border-color var(--dur-base) var(--ease-out-quart),
      box-shadow var(--dur-base) var(--ease-out-quart);
  }

  .blog-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      color-mix(in srgb, var(--neon-violet) 15%, transparent),
      transparent 40%
    );
    opacity: 0;
    transition: opacity var(--dur-base) var(--ease-out-quart);
    pointer-events: none;
    z-index: 0;
  }

  .blog-card:hover {
    transform: translateY(-3px);
    border-color: transparent;
    box-shadow: var(--shadow-lg), var(--glow-violet);
  }
  .blog-card:hover::after { opacity: 1; }
  .blog-card > * { position: relative; z-index: 1; }

  .blog-meta {
    display: flex;
    justify-content: space-between;
    font-size: 10.5px;
    letter-spacing: 0.08em;
    color: var(--fg-subtle);
  }

  .blog-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 1.2;
    margin: 0;
    color: var(--fg);
  }

  .blog-body {
    color: var(--fg-muted);
    font-size: 14px;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-body :global(a)    { color: var(--neon-violet); }
  .blog-body :global(code) { font-family: var(--font-mono); font-size: 12px; color: var(--neon-cyan); }

  .blog-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
  }
  .blog-tag {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.06em;
    padding: 0.15rem 0.5rem;
    border: 1px solid color-mix(in srgb, var(--neon-violet) 30%, transparent);
    border-radius: var(--radius-xs);
    background: color-mix(in srgb, var(--neon-violet) 6%, transparent);
    color: var(--neon-violet);
  }

  .blog-read-more {
    margin-top: auto;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--neon-violet);
  }

  .blog-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-3);
    padding: var(--space-9) 0;
    color: var(--fg-subtle);
    font-size: 13px;
  }

  .blog-empty-icon { width: 22px; height: 22px; color: var(--neon-violet); }

  .blog-spinner {
    width: 18px; height: 18px;
    border: 2px solid var(--border-strong);
    border-top-color: var(--neon-violet);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  @media (prefers-reduced-motion: reduce) {
    .blog-spinner { animation: none !important; }
  }
</style>
