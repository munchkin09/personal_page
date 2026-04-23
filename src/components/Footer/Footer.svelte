<script lang="ts">
  import { dictionaries, type Locale } from '$lib/i18n';

  let { lang }: { lang: Locale } = $props();
  const t = $derived(dictionaries[lang].footer);
</script>

<footer class="site-footer">
  <div class="container footer-inner">
    <p class="mono">{t.copyright} ♥ {t.tech} <strong>Svelte 5</strong></p>
    <div class="footer-links">
      <a href="/{lang}/now" class="footer-link mono">/now</a>
      <a href={import.meta.env.VITE_BLOG_WORKER_URL ? `${import.meta.env.VITE_BLOG_WORKER_URL}/api/rss.xml` : '/api/rss.xml'} class="footer-link mono" rel="alternate" type="application/rss+xml">RSS</a>
    </div>
    <p class="mono footer-meta">Obsidian · neon · craft · Madrid, ES</p>
  </div>
</footer>

<style>
  .site-footer {
    position: relative;
    z-index: 1;
    padding: var(--space-7) 0;
    border-top: 1px solid var(--border);
  }

  .footer-inner {
    display: flex;
    justify-content: space-between;
    gap: var(--space-4);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--fg-whisper);
    flex-wrap: wrap;
  }

  .footer-inner strong { color: var(--neon-cyan); font-weight: 500; }
  .footer-meta { color: var(--fg-whisper); }

  .footer-links {
    display: flex;
    gap: var(--space-4);
    align-items: center;
  }

  .footer-link {
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--fg-whisper);
    transition: color var(--dur-base) var(--ease-out-quart);
  }
  .footer-link:hover { color: var(--neon-cyan); }
</style>
