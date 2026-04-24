<script lang="ts">
  import { onMount } from 'svelte';
  import { dictionaries, type Locale } from '$lib/i18n';
  import { CONTACT } from '$lib/constants';
  import { fadeIn, magnetic, observeSection } from '$lib/actions';

  let { lang }: { lang: Locale } = $props();
  const t = $derived(dictionaries[lang].hero);

  let typewriterText = $state('');
  let typewriterTimeout: ReturnType<typeof setTimeout> | undefined;

  function startTypewriter(roleList: readonly string[]) {
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseFrames = 0;
    const tick = () => {
      const current = roleList[roleIdx % roleList.length];
      if (deleting) {
        if (pauseFrames > 0) { pauseFrames--; typewriterTimeout = setTimeout(tick, 50); return; }
        typewriterText = current.slice(0, --charIdx);
        if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roleList.length; }
        typewriterTimeout = setTimeout(tick, 40);
      } else {
        typewriterText = current.slice(0, ++charIdx);
        if (charIdx === current.length) { deleting = true; pauseFrames = 40; }
        typewriterTimeout = setTimeout(tick, 70);
      }
    };
    tick();
  }

  onMount(() => {
    startTypewriter(dictionaries[lang].hero.roles);
    return () => clearTimeout(typewriterTimeout);
  });
</script>

<section id="hero" class="hero" data-accent="cyan" use:observeSection>
  <div class="hero-content">
    <p class="eyebrow" use:fadeIn>
      <span class="eyebrow-rule"></span>
      <span class="pulse-dot"></span>
      {t.badge} · MADRID
    </p>

    <h1 class="hero-name" use:fadeIn>
      <span class="name-line">Carlos</span>
      <span class="name-line gradient-text">Ledesma.</span>
    </h1>

    <p class="hero-role" use:fadeIn>
      <span class="role-tag">§</span>
      <span class="typewriter">{typewriterText}</span>
      <span class="cursor-blink" aria-hidden="true">▍</span>
    </p>

    <p class="hero-subtitle" use:fadeIn>
      {t.subtitleLine1}<br />
      {t.subtitleLine2}
    </p>

    <div class="hero-actions" use:fadeIn>
      <a href="#projects" class="btn btn-primary" use:magnetic>
        <span>{t.viewProjects}</span>
        <span class="arrow">→</span>
      </a>
      <a href="mailto:{CONTACT.email}" class="btn btn-secondary" use:magnetic>{t.letsTalk}</a>
      <a href="/{lang}/cv" class="btn btn-ghost" use:magnetic>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
        {t.printableCv}
      </a>
    </div>

    <div class="hero-stats" use:fadeIn>
      <div class="stat">
        <span class="stat-num">13<span class="unit">+</span></span>
        <span class="stat-lbl">{t.stats.yearsLabel}</span>
      </div>
      <div class="stat">
        <span class="stat-num">2</span>
        <span class="stat-lbl">{t.stats.continentsLabel}</span>
      </div>
      <div class="stat">
        <span class="stat-num">108</span>
        <span class="stat-lbl">{t.stats.projectsLabel}</span>
      </div>
      <div class="stat">
        <span class="stat-num">∞</span>
        <span class="stat-lbl">{t.stats.bugsLabel}</span>
      </div>
      <div class="stat">
        <span class="stat-num mono">99.98<span class="unit">%</span></span>
        <span class="stat-lbl">{t.stats.uptimeLabel}</span>
      </div>
    </div>
  </div>

  <div class="scroll-hint" aria-hidden="true">
    <span class="mono">scroll ↓</span>
    <div class="scroll-line"></div>
  </div>
</section>

<style>
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: calc(var(--space-10) + 40px);
    padding-bottom: var(--space-9);
  }

  .hero-content {
    max-width: var(--container-lg);
    margin: 0 auto;
    padding: 0 var(--gutter);
    width: 100%;
  }

  .hero-name {
    font-family: var(--font-display);
    font-size: var(--fs-display-2xl);
    line-height: 0.92;
    letter-spacing: -0.04em;
    font-weight: 500;
    margin: var(--space-4) 0 var(--space-6);
    text-wrap: balance;
  }

  .hero-name .name-line { display: block; }

  .hero-role {
    font-family: var(--font-mono);
    font-size: clamp(0.9rem, 1vw + 0.5rem, 1.15rem);
    color: var(--fg-muted);
    letter-spacing: 0.02em;
    margin: 0 0 var(--space-6);
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .role-tag { color: var(--neon-cyan); font-weight: 700; }
  .typewriter { color: var(--fg); }

  .cursor-blink {
    color: var(--neon-cyan);
    animation: blink 1s steps(2) infinite;
  }

  @keyframes blink { 50% { opacity: 0; } }

  .hero-subtitle {
    font-size: var(--fs-body-lg);
    color: var(--fg-muted);
    max-width: 58ch;
    line-height: var(--lh-loose);
    margin: 0 0 var(--space-7);
  }
  @media (max-width: 600px) {
    .hero-subtitle { line-height: var(--lh-normal); }
  }

  .hero-actions {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
    margin-bottom: var(--space-8);
  }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding-top: var(--space-6);
    border-top: 1px solid var(--border);
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 4px;
    padding-inline: clamp(var(--space-3), 2vw, var(--space-5));
  }

  .stat + .stat { border-left: 1px solid var(--border); }

  @media (max-width: 720px) {
    .hero-stats { grid-template-columns: repeat(3, 1fr); row-gap: var(--space-5); }
    .stat:nth-child(4) { border-left: none; }
  }

  @media (max-width: 420px) {
    .hero-stats { grid-template-columns: repeat(2, 1fr); }
    .stat:nth-child(3) { border-left: none; }
  }

  .stat-num {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 2.8vw + 1rem, 3.4rem);
    font-weight: 500;
    letter-spacing: -0.03em;
    line-height: 1;
    color: var(--fg);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    min-height: clamp(2.2rem, 2.8vw + 1rem, 3.4rem);
    font-variant-numeric: tabular-nums;
  }

  .stat-num.mono {
    font-family: var(--font-mono);
    font-size: clamp(1.7rem, 2.1vw + 0.9rem, 2.6rem);
    letter-spacing: -0.02em;
    min-height: clamp(2.2rem, 2.8vw + 1rem, 3.4rem);
  }

  .stat-num.mono .unit { font-size: 0.7em; margin-left: 0.05em; }
  .stat-num .unit { color: var(--neon-cyan); }

  .stat-lbl {
    font-family: var(--font-mono);
    font-size: 11px;
    line-height: 1.35;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--fg-subtle);
    max-width: 16ch;
    text-wrap: balance;
  }

  .scroll-hint {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    position: absolute;
    bottom: var(--space-5);
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--fg-subtle);
  }

  .scroll-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, transparent, var(--neon-cyan));
    animation: scrollLine 2s var(--ease-in-out) infinite;
  }

  @keyframes scrollLine {
    0%   { transform: scaleY(0); transform-origin: top; }
    50%  { transform: scaleY(1); transform-origin: top; }
    51%  { transform-origin: bottom; }
    100% { transform: scaleY(0); transform-origin: bottom; }
  }

  @media (prefers-reduced-motion: reduce) {
    .cursor-blink, .scroll-line { animation: none !important; }
  }
</style>
