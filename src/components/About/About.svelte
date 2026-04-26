<script lang="ts">
  import { dictionaries, type Locale } from '$lib/i18n';
  import { CONTACT } from '$lib/constants';
  import { observeSection, fadeIn } from '$lib/actions';

  let { lang }: { lang: Locale } = $props();
  const t = $derived(dictionaries[lang].about);

  let avatarError = $state(false);
</script>

<section id="about" class="about" data-accent="cyan" use:observeSection>
  <div class="container">
    <div class="about-grid">
      <div class="about-visual" use:fadeIn>
        <div class="avatar-wrapper">
          <div class="avatar-ring" aria-hidden="true"></div>
          <div class="avatar-ring ring-2" aria-hidden="true"></div>
          <div class="avatar">
            {#if !avatarError}
              <img
                src="https://boletinstatics.blob.core.windows.net/personal/yo.jpeg"
                alt="Carlos Ledesma"
                onerror={() => (avatarError = true)}
              />
            {:else}
              <span>CL</span>
            {/if}
          </div>
          <div class="avatar-badge mono">full-stack · tech lead</div>
        </div>
        <div class="about-tags">
          {#each t.tags as tag}
            <span class="tech-tag mono">{tag}</span>
          {/each}
        </div>
      </div>

      <div class="about-text" use:fadeIn>
        <p class="eyebrow"><span class="eyebrow-rule"></span>{t.label}</p>
        <h2>
          {t.titlePrefix}<span class="gradient-text">{t.titleHighlight}</span>
        </h2>
        {#each t.paragraphs as p}
          <p class="prose">{@html p}</p>
        {/each}
        <div class="about-links">
          <a href="mailto:{CONTACT.email}" class="about-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
            {CONTACT.email}
          </a>
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" class="about-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            GitHub
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" class="about-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .about-grid {
    display: grid;
    grid-template-columns: 0.9fr 1.4fr;
    gap: var(--space-8);
    align-items: start;
  }

  @media (max-width: 860px) {
    .about-grid { grid-template-columns: 1fr; gap: var(--space-7); }
  }

  .avatar-wrapper {
    position: relative;
    width: min(320px, 100%);
    aspect-ratio: 1;
    margin: 0 auto var(--space-5);
  }

  .avatar-ring {
    position: absolute;
    inset: -10px;
    border: 1px solid var(--neon-cyan);
    border-radius: 50%;
    opacity: 0.35;
    animation: ringSpin 16s linear infinite;
  }

  .avatar-ring.ring-2 {
    inset: -22px;
    border-color: var(--neon-violet);
    border-style: dashed;
    opacity: 0.2;
    animation-duration: 26s;
    animation-direction: reverse;
  }

  @keyframes ringSpin { to { transform: rotate(360deg); } }

  .avatar {
    position: relative;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    background: var(--bg-elevated);
    border: 1px solid var(--border-strong);
    box-shadow: var(--shadow-lg);
    display: grid;
    place-items: center;
  }

  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(20%) contrast(1.05);
  }

  .avatar span {
    font-family: var(--font-display);
    font-size: 4rem;
    font-weight: 600;
    color: var(--neon-cyan);
  }

  .avatar-badge {
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    padding: 6px 14px;
    background: var(--bg-elevated);
    border: 1px solid var(--neon-cyan);
    border-radius: var(--radius-pill);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--neon-cyan);
    white-space: nowrap;
    box-shadow: 0 0 20px color-mix(in srgb, var(--neon-cyan) 25%, transparent);
  }

  .about-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
  }

  .tech-tag {
    padding: 5px 11px;
    font-size: 9.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--fg-subtle);
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    background: color-mix(in srgb, var(--fg) 2%, transparent);
  }

  .about-text h2 {
    font-family: var(--font-display);
    font-size: var(--fs-display-lg);
    font-weight: 500;
    letter-spacing: var(--tracking-tight);
    line-height: 1.02;
    margin: 0 0 var(--space-6);
  }

  .prose {
    font-size: var(--fs-body-lg);
    line-height: var(--lh-loose);
    color: var(--fg-muted);
    margin: 0 0 var(--space-4);
  }

  .prose :global(strong) { color: var(--fg); font-weight: 600; }

  .about-text .prose:first-of-type::first-letter {
    font-family: var(--font-display);
    font-size: 1.6em;
    color: var(--neon-cyan);
    font-weight: 600;
  }

  .about-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-5);
    margin-top: var(--space-6);
    padding-top: var(--space-5);
    border-top: 1px solid var(--border);
  }

  .about-link {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--fg-muted);
    transition: color var(--dur-base) var(--ease-out-quart);
  }

  .about-link :global(svg) { width: 16px; height: 16px; }
  .about-link:hover { color: var(--neon-cyan); }

  @media (prefers-reduced-motion: reduce) {
    .avatar-ring { animation: none !important; }
  }
</style>
