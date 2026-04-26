<script lang="ts">
  import { dictionaries, type Locale } from '$lib/i18n';
  import { observeSection, fadeIn, spotlight } from '$lib/actions';

  let { lang }: { lang: Locale } = $props();
  const t = $derived(dictionaries[lang].experience);
</script>

<section id="experience" class="experience-section" data-accent="cyan" use:observeSection>
  <div class="container">
    <div class="section-head" use:fadeIn>
      <div>
        <p class="eyebrow"><span class="eyebrow-rule"></span>{t.label}</p>
        <h2>{t.titlePrefix}<span class="gradient-text">{t.titleHighlight}</span></h2>
      </div>
      <p class="section-sub">{t.subtitle}</p>
    </div>

    <ol class="exp-list">
      {#each t.items as item, i}
        <li class="exp-row" use:fadeIn use:spotlight style="transition-delay: {i * 90}ms">
          <span class="exp-year mono">{item.year}</span>
          <div class="exp-body">
            <h3 class="exp-role">{item.role}</h3>
            <span class="exp-co mono">{item.company}</span>
            <p>{item.desc}</p>
            <div class="exp-tags">
              {#each item.highlights as h}
                <span class="exp-tag mono">{h}</span>
              {/each}
            </div>
          </div>
          <span class="exp-idx mono">§ {String(t.items.length - i).padStart(2, '0')}</span>
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .exp-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  }

  .exp-row {
    display: grid;
    grid-template-columns: 160px 1fr 64px;
    gap: var(--space-5);
    padding: var(--space-6) 0;
    border-bottom: 1px solid var(--border);
    align-items: start;
    position: relative;
    overflow: hidden;
    transition: padding var(--dur-base) var(--ease-out-quart);
  }

  .exp-row::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      color-mix(in srgb, var(--neon-cyan) 8%, transparent),
      transparent 40%
    );
    opacity: 0;
    transition: opacity var(--dur-base) var(--ease-out-quart);
    pointer-events: none;
    z-index: 0;
  }

  .exp-row:hover { padding-left: 10px; }
  .exp-row:hover::after { opacity: 1; }
  .exp-row > * { position: relative; z-index: 1; }

  .exp-row:hover .exp-role { color: var(--neon-cyan); }

  @media (max-width: 720px) {
    .exp-row { grid-template-columns: 1fr; gap: var(--space-2); }
    .exp-idx { display: none; }
  }

  .exp-year {
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--fg-subtle);
    padding-top: 6px;
  }

  .exp-body { min-width: 0; }

  .exp-role {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin: 0 0 4px;
    color: var(--fg);
    transition: color var(--dur-base) var(--ease-out-quart);
  }

  .exp-co {
    font-size: 11.5px;
    color: var(--neon-cyan);
    letter-spacing: 0.06em;
  }

  .exp-body p {
    color: var(--fg-muted);
    margin: 10px 0 var(--space-3);
    line-height: var(--lh-normal);
    font-size: 14px;
  }

  .exp-tags { display: flex; flex-wrap: wrap; gap: 6px; }

  .exp-tag {
    padding: 4px 10px;
    font-size: 9.5px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--fg-subtle);
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
  }

  .exp-idx {
    text-align: right;
    font-size: 10.5px;
    letter-spacing: 0.18em;
    color: var(--fg-whisper);
    padding-top: 8px;
  }
</style>
