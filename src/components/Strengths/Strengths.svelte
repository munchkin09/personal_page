<script lang="ts">
  import { dictionaries, type Locale } from '$lib/i18n';
  import { strengthIcons } from '$lib/constants';
  import { observeSection, fadeIn, spotlight } from '$lib/actions';

  let { lang }: { lang: Locale } = $props();
  const t = $derived(dictionaries[lang].strengths);
</script>

<section id="strengths" class="strengths" data-accent="violet" use:observeSection>
  <div class="container">
    <div class="section-head" use:fadeIn>
      <div>
        <p class="eyebrow"><span class="eyebrow-rule"></span>{t.label}</p>
        <h2>{t.titlePrefix}<span class="gradient-text">{t.titleHighlight}</span></h2>
      </div>
      <p class="section-sub">{t.subtitle}</p>
    </div>

    <div class="strengths-grid">
      {#each t.items as s, i}
        <div class="strength-card" use:fadeIn use:spotlight style="transition-delay: {i * 80}ms">
          <span class="card-num mono">§ {String(i + 1).padStart(2, '0')}</span>
          <div class="strength-icon" aria-hidden="true">{@html strengthIcons[i] ?? strengthIcons[0]}</div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .strengths-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);
  }

  @media (max-width: 960px) { .strengths-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 560px) { .strengths-grid { grid-template-columns: 1fr; } }

  .strength-card {
    position: relative;
    padding: var(--space-6);
    background: var(--bg-glass);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-glass);
    transition:
      transform var(--dur-slow) var(--ease-out-expo),
      border-color var(--dur-slow) var(--ease-out-quart),
      box-shadow var(--dur-slow) var(--ease-out-expo);
    overflow: hidden;
  }

  .strength-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(92deg, transparent, var(--accent-on), transparent);
    opacity: 0;
    transition: opacity var(--dur-base) var(--ease-out-quart);
  }

  .strength-card:hover {
    transform: translateY(-4px);
    border-color: transparent;
    box-shadow: var(--shadow-lg), var(--accent-glow);
  }

  .strength-card:hover::before { opacity: 1; }

  .strength-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      color-mix(in srgb, var(--accent-on) 15%, transparent),
      transparent 40%
    );
    opacity: 0;
    transition: opacity var(--dur-base) var(--ease-out-quart);
    pointer-events: none;
    z-index: 0;
  }
  .strength-card:hover::after { opacity: 1; }
  .strength-card > * { position: relative; z-index: 1; }

  .card-num {
    font-size: 10.5px;
    letter-spacing: 0.18em;
    color: var(--fg-whisper);
    text-transform: uppercase;
  }

  .strength-icon {
    margin: var(--space-4) 0 var(--space-5);
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: var(--radius-md);
    background: color-mix(in srgb, var(--neon-violet) 8%, transparent);
    color: var(--accent-on);
    border: 1px solid var(--border);
    transition: transform var(--dur-base) var(--ease-spring);
  }

  .strength-icon :global(svg) { width: 22px; height: 22px; }
  .strength-card:hover .strength-icon { transform: scale(1.08) rotate(-3deg); }

  .strength-card h3 {
    font-family: var(--font-display);
    font-size: 1.15rem;
    font-weight: 600;
    letter-spacing: -0.015em;
    margin: 0 0 var(--space-2);
    color: var(--fg);
  }

  .strength-card p {
    font-size: 14px;
    line-height: 1.55;
    color: var(--fg-muted);
    margin: 0;
  }
</style>
