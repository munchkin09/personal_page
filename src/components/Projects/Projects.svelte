<script lang="ts">
  import { dictionaries, type Locale } from '$lib/i18n';
  import { projectsMeta, projectIcons } from '$lib/constants';
  import { observeSection, fadeIn, magnetic } from '$lib/actions';

  let { lang }: { lang: Locale } = $props();
  const t = $derived(dictionaries[lang].projects);

  const projects = $derived(
    projectsMeta.map((m, i) => ({
      ...m,
      num: String(i + 1).padStart(2, '0'),
      title: t.items[i].title,
      description: t.items[i].description,
    }))
  );
</script>

<section id="projects" class="projects-section" data-accent="pink" use:observeSection>
  <div class="container">
    <div class="section-head" use:fadeIn>
      <div>
        <p class="eyebrow"><span class="eyebrow-rule"></span>{t.label}</p>
        <h2>{t.titlePrefix}<span class="gradient-text">{t.titleHighlight}</span></h2>
      </div>
    </div>

    <div class="projects-grid">
      {#each projects as project, i}
        <a
          class="project-card"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          data-accent={project.accent}
          use:fadeIn
          use:magnetic
          style="transition-delay: {i * 90}ms"
        >
          <div class="project-topline mono">
            <span>CASE · {project.num}</span>
            <span>{project.year}</span>
          </div>
          <div class="project-icon" aria-hidden="true">{@html projectIcons[i] ?? projectIcons[0]}</div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div class="project-footer">
            <div class="project-tags">
              {#each project.tags as tag}
                <span class="project-tag mono">{tag}</span>
              {/each}
            </div>
            <span class="project-arrow" aria-hidden="true">↗</span>
          </div>
          <span class="project-metric mono">{project.metric}</span>
        </a>
      {/each}
    </div>
  </div>
</section>

<style>
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-5);
  }

  @media (max-width: 820px) { .projects-grid { grid-template-columns: 1fr; } }

  .project-card {
    position: relative;
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    gap: var(--space-3);
    padding: var(--space-6);
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    color: inherit;
    overflow: hidden;
    transition:
      transform var(--dur-slow) var(--ease-out-expo),
      border-color var(--dur-slow) var(--ease-out-quart),
      box-shadow var(--dur-slow) var(--ease-out-expo);
    text-decoration: none;
  }

  .project-card[data-accent="cyan"]   { --accent-on: var(--neon-cyan);   --accent-glow: var(--glow-cyan);   }
  .project-card[data-accent="violet"] { --accent-on: var(--neon-violet); --accent-glow: var(--glow-violet); }
  .project-card[data-accent="pink"]   { --accent-on: var(--neon-pink);   --accent-glow: var(--glow-pink);   }

  .project-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(92deg, var(--neon-cyan), var(--neon-violet), var(--neon-pink));
    opacity: 0.4;
    transition: opacity var(--dur-base) var(--ease-out-quart);
  }

  .project-card:hover {
    transform: translateY(-4px);
    border-color: transparent;
    box-shadow: var(--shadow-lg), var(--accent-glow);
  }

  .project-card:hover::before { opacity: 1; }

  .project-topline {
    display: flex;
    justify-content: space-between;
    font-size: 10.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--fg-whisper);
  }

  .project-icon {
    width: 44px; height: 44px;
    display: grid;
    place-items: center;
    border-radius: var(--radius-md);
    background: rgba(241, 91, 181, 0.08);
    color: var(--accent-on);
    border: 1px solid var(--border);
    margin-bottom: var(--space-2);
  }

  .project-icon :global(svg) { width: 22px; height: 22px; }

  .project-card h3 {
    font-family: var(--font-display);
    font-size: 1.45rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin: 0;
    color: var(--fg);
  }

  .project-card p {
    font-size: 14px;
    line-height: 1.6;
    color: var(--fg-muted);
    margin: 0;
  }

  .project-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: var(--space-3);
    margin-top: var(--space-2);
  }

  .project-tags { display: flex; flex-wrap: wrap; gap: 6px; }

  .project-tag {
    padding: 4px 10px;
    font-size: 10px;
    letter-spacing: 0.08em;
    color: var(--fg-subtle);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-pill);
  }

  .project-arrow {
    font-family: var(--font-display);
    font-size: 1.5rem;
    color: var(--fg-subtle);
    transition:
      transform var(--dur-base) var(--ease-spring),
      color var(--dur-base) var(--ease-out-quart);
  }

  .project-card:hover .project-arrow {
    transform: translate(3px, -3px);
    color: var(--accent-on);
  }

  .project-metric {
    position: absolute;
    top: var(--space-4);
    right: var(--space-6);
    font-size: 10.5px;
    letter-spacing: 0.1em;
    color: var(--accent-on);
  }
</style>
