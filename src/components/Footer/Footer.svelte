<script lang="ts">
  import { dictionaries, type Locale } from '$lib/i18n';

  let { lang }: { lang: Locale } = $props();
  const t = $derived(dictionaries[lang].footer);
</script>

<footer class="site-footer">
  <div class="container footer-inner">
    <p class="mono">{t.copyright} ♥ {t.tech} <strong>Svelte 5</strong></p>
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
</style>
