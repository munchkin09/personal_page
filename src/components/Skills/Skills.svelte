<script lang="ts">
  import { dictionaries, type Locale } from '$lib/i18n';
  import { observeSection, fadeIn } from '$lib/actions';

  let { lang }: { lang: Locale } = $props();
  const t = $derived(dictionaries[lang].skills);

  // ── Radar geometry ──────────────────────────────────────────────────────────
  const techStackBase = [
    { key: 'typescript', pct: 75, accent: 'cyan',   category: 'Frontend'     },
    { key: 'ai',         pct: 66, accent: 'violet',  category: 'AI'           },
    { key: 'cloud',      pct: 70, accent: 'pink',    category: 'DevOps'       },
    { key: 'systemDesign', pct: 64, accent: 'violet', category: 'Architecture' },
    { key: 'qaAutomation', pct: 51, accent: 'cyan',   category: 'Testing'      },
    { key: 'frontend',   pct: 43, accent: 'pink',    category: 'Frontend'     },
    { key: 'python',     pct: 30, accent: 'yellow',  category: 'Backend'      },
  ] as const;

  const RADAR = { cx: 270, cy: 240, r: 178, n: techStackBase.length } as const;

  function radarPt(i: number, frac: number) {
    const a = (i * Math.PI * 2) / RADAR.n - Math.PI / 2;
    return { x: RADAR.cx + RADAR.r * frac * Math.cos(a), y: RADAR.cy + RADAR.r * frac * Math.sin(a) };
  }

  const radarAxes    = techStackBase.map((_, i) => radarPt(i, 1));
  const radarRings   = [0.25, 0.5, 0.75, 1.0].map(f =>
    techStackBase.map((_, i) => { const p = radarPt(i, f); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ')
  );
  const radarDataPoly = techStackBase.map((s, i) => {
    const p = radarPt(i, s.pct / 100);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ');
  const radarDots      = techStackBase.map((s, i) => ({ ...radarPt(i, s.pct / 100), accent: s.accent }));
  const radarLabelPos  = techStackBase.map((_, i) => radarPt(i, 1.22));

  const techStack = $derived(
    techStackBase.map((b, i) => ({
      ...b,
      idx: String(i + 1).padStart(2, '0'),
      name: t.techNames[b.key],
      categoryLabel: t.categories[b.category as keyof typeof t.categories],
    }))
  );

  let hoveredSkillIdx = $state<number | null>(null);

  const extraTags = [
    'Git', 'CI/CD', 'WebSockets', 'REST', 'GraphQL', 'gRPC', 'Rust', 'Go',
    'Linux', 'Vercel', 'n8n', 'Cloudflare', 'Vitest', 'Playwright',
    'crewAI', 'Linear', 'Figma', 'TDD & SDD', 'Agile/Scrum',
  ];
</script>

<section id="skills" class="skills-section" data-accent="violet" use:observeSection>
  <div class="container">
    <div class="section-head" use:fadeIn>
      <div>
        <p class="eyebrow"><span class="eyebrow-rule"></span>{t.label}</p>
        <h2>{t.titlePrefix}<span class="gradient-text">{t.titleHighlight}</span></h2>
      </div>
      <p class="section-sub">{t.subtitle}</p>
    </div>

    <div class="radar-layout" use:fadeIn>
      <!-- Polar radar chart -->
      <div class="radar-chart-wrap">
        <svg viewBox="0 0 540 480" class="radar-svg" role="img" aria-label="Tech stack polar chart">
          <defs>
            <radialGradient id="radar-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stop-color="#9B5DE5" stop-opacity="0.30"/>
              <stop offset="100%" stop-color="#9B5DE5" stop-opacity="0.04"/>
            </radialGradient>
            <filter id="dot-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="stroke-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {#each radarRings as pts, ri}
            <polygon points={pts} class="radar-ring" style="opacity: {0.10 + ri * 0.05}"/>
          {/each}

          <text x={RADAR.cx} y={RADAR.cy - RADAR.r * 0.25 - 5} class="radar-ring-lbl" text-anchor="middle">25%</text>
          <text x={RADAR.cx} y={RADAR.cy - RADAR.r * 0.50 - 5} class="radar-ring-lbl" text-anchor="middle">50%</text>
          <text x={RADAR.cx} y={RADAR.cy - RADAR.r * 0.75 - 5} class="radar-ring-lbl" text-anchor="middle">75%</text>

          {#each radarAxes as ax, i}
            <line
              x1={RADAR.cx} y1={RADAR.cy} x2={ax.x} y2={ax.y}
              class="radar-axis"
              class:is-hovered={hoveredSkillIdx === i}
            />
          {/each}

          <g class="radar-data-group">
            <polygon points={radarDataPoly} class="radar-fill"/>
            <polygon points={radarDataPoly} class="radar-stroke" filter="url(#stroke-glow)"/>
          </g>

          {#each radarDots as dot, i}
            <circle
              cx={dot.x} cy={dot.y}
              r={hoveredSkillIdx === i ? 7.5 : 5}
              class="radar-dot radar-dot--{dot.accent}"
              filter="url(#dot-glow)"
              onmouseenter={() => hoveredSkillIdx = i}
              onmouseleave={() => hoveredSkillIdx = null}
              role="presentation"
            />
          {/each}

          {#each techStack as skill, i}
            {@const lp = radarLabelPos[i]}
            {@const anchor = lp.x < RADAR.cx - 22 ? 'end' : lp.x > RADAR.cx + 22 ? 'start' : 'middle'}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <text
              x={lp.x} y={lp.y}
              class="radar-lbl"
              class:radar-lbl--hovered={hoveredSkillIdx === i}
              text-anchor={anchor}
              dominant-baseline="middle"
              onmouseenter={() => hoveredSkillIdx = i}
              onmouseleave={() => hoveredSkillIdx = null}
            >{skill.name}</text>
          {/each}

          <text x={RADAR.cx} y={RADAR.cy - 9}  class="radar-center-name" text-anchor="middle" dominant-baseline="middle">{t.totalLabel}</text>
          <text x={RADAR.cx} y={RADAR.cy + 10} class="radar-center-sub"  text-anchor="middle" dominant-baseline="middle">100%</text>
        </svg>
      </div>

      <!-- Legend -->
      <ul class="radar-legend" role="list">
        {#each techStack as skill, i}
          <li
            class="radar-legend-item radar-legend-item--{skill.accent}"
            class:is-hovered={hoveredSkillIdx === i}
            onmouseenter={() => hoveredSkillIdx = i}
            onmouseleave={() => hoveredSkillIdx = null}
            role="listitem"
            style="transition-delay: {i * 55}ms"
          >
            <span class="rli-dot" aria-hidden="true"></span>
            <span class="rli-idx mono">{skill.idx}</span>
            <span class="rli-name">{skill.name}</span>
            <span class="rli-cat mono">{skill.categoryLabel}</span>
            <span class="rli-pct mono">{skill.pct}%</span>
          </li>
        {/each}
      </ul>
    </div>

    <div class="extra-skills" use:fadeIn>
      <span class="eyebrow"><span class="eyebrow-rule"></span>Also in the toolkit</span>
      <div class="extra-tags">
        {#each extraTags as tag}
          <span class="extra-tag mono">{tag}</span>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .radar-layout {
    display: flex;
    align-items: center;
    gap: var(--space-8);
    margin-bottom: var(--space-8);
  }

  @media (max-width: 900px) {
    .radar-layout { flex-direction: column; align-items: stretch; }
    .radar-chart-wrap { max-width: 460px; margin: 0 auto; }
  }

  .radar-chart-wrap { flex: 0 0 auto; width: min(440px, 100%); }
  .radar-svg { width: 100%; height: auto; overflow: visible; display: block; }

  .radar-ring { fill: none; stroke: rgba(255, 255, 255, 0.12); stroke-width: 1; }

  .radar-ring-lbl {
    font-family: var(--font-mono);
    font-size: 9px;
    fill: rgba(255, 255, 255, 0.45);
    letter-spacing: 0.06em;
    pointer-events: none;
    user-select: none;
  }

  .radar-axis {
    stroke: rgba(255, 255, 255, 0.09);
    stroke-width: 1;
    transition: stroke var(--dur-base), stroke-width var(--dur-base);
  }

  .radar-axis.is-hovered {
    stroke: var(--neon-violet);
    stroke-width: 1.5;
    filter: drop-shadow(0 0 4px rgba(155, 93, 229, 0.7));
  }

  .radar-data-group {
    transform-box: view-box;
    transform-origin: 50% 50%;
    transform: scale(0);
    opacity: 0;
    transition: transform 1s var(--ease-spring), opacity 0.35s ease;
  }

  :global(.visible) .radar-data-group { transform: scale(1); opacity: 1; }

  .radar-fill { fill: url(#radar-grad); }

  .radar-stroke {
    fill: none;
    stroke: var(--neon-violet);
    stroke-width: 2;
    stroke-linejoin: round;
  }

  .radar-dot {
    transition: r var(--dur-fast) var(--ease-spring);
    cursor: default;
  }

  .radar-dot--cyan   { fill: var(--neon-cyan);   }
  .radar-dot--violet { fill: var(--neon-violet);  }
  .radar-dot--pink   { fill: var(--neon-pink);    }
  .radar-dot--yellow { fill: var(--neon-yellow);  }

  .radar-lbl {
    font-family: var(--font-mono);
    font-size: 11.5px;
    fill: var(--fg-subtle);
    letter-spacing: 0.025em;
    transition: fill var(--dur-base), font-size var(--dur-fast);
    cursor: default;
  }

  .radar-lbl--hovered { fill: var(--fg); font-size: 12px; }

  .radar-center-name {
    font-family: var(--font-display);
    font-size: 13px;
    fill: var(--fg-muted);
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .radar-center-sub {
    font-family: var(--font-mono);
    font-size: 10px;
    fill: var(--neon-violet);
    letter-spacing: 0.08em;
  }

  .radar-legend {
    flex: 1;
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .radar-legend-item {
    display: grid;
    grid-template-columns: 8px 26px 1fr auto auto;
    align-items: center;
    gap: var(--space-3);
    padding: 0.55rem var(--space-4);
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    cursor: default;
    transition: background var(--dur-base), border-color var(--dur-base), box-shadow var(--dur-base);
  }

  .radar-legend-item--cyan   { --li-accent: var(--neon-cyan);   --li-glow: var(--glow-cyan);   }
  .radar-legend-item--violet { --li-accent: var(--neon-violet); --li-glow: var(--glow-violet); }
  .radar-legend-item--pink   { --li-accent: var(--neon-pink);   --li-glow: var(--glow-pink);   }
  .radar-legend-item--yellow { --li-accent: var(--neon-yellow); --li-glow: var(--glow-yellow); }

  .radar-legend-item.is-hovered {
    background: rgba(255, 255, 255, 0.03);
    border-color: var(--border-strong);
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
  }

  .rli-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--li-accent);
    box-shadow: 0 0 7px var(--li-accent);
    flex-shrink: 0;
    transition: box-shadow var(--dur-base);
  }

  .radar-legend-item.is-hovered .rli-dot { box-shadow: 0 0 14px var(--li-accent); }
  .rli-idx { font-size: 10px; color: var(--fg-whisper); letter-spacing: 0.1em; }
  .rli-name { font-family: var(--font-display); font-size: 0.95rem; font-weight: 600; color: var(--fg); letter-spacing: -0.01em; }
  .rli-cat  { font-size: 10px; color: var(--fg-whisper); text-transform: uppercase; letter-spacing: 0.1em; }
  .rli-pct  { font-size: 11px; color: var(--li-accent); font-weight: 500; letter-spacing: 0.06em; }

  .extra-skills {
    padding-top: var(--space-6);
    border-top: 1px solid var(--border);
    display: grid;
    gap: var(--space-4);
  }

  .extra-tags { display: flex; flex-wrap: wrap; gap: 6px; }

  .extra-tag {
    padding: 5px 11px;
    font-size: 10.5px;
    letter-spacing: 0.08em;
    color: var(--fg-subtle);
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    transition:
      color var(--dur-base) var(--ease-out-quart),
      border-color var(--dur-base) var(--ease-out-quart);
  }

  .extra-tag:hover { color: var(--neon-violet); border-color: var(--neon-violet); }

  @media (prefers-reduced-motion: reduce) {
    .radar-data-group { transform: scale(1) !important; opacity: 1 !important; transition: none !important; }
  }
</style>
