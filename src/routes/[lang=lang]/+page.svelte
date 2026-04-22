<script lang="ts">
  import { onMount, tick } from "svelte";
  import { goto } from "$app/navigation";
  import {
    dictionaries,
    localeDateFormat,
    rememberLocale,
    swapLocaleInPath,
    SUPPORTED_LOCALES,
    type Locale,
  } from "$lib/i18n";

  let { data }: { data: { lang: Locale } } = $props();
  const t = $derived(dictionaries[data.lang]);

  let canvasEl = $state<HTMLCanvasElement | null>(null);
  let mobileMenuOpen = $state(false);
  let navScrolled = $state(false);
  let activeSection = $state("hero");
  let typewriterText = $state("");
  let hoveredSlice = $state<number | null>(null);
  let typewriterTimeout: ReturnType<typeof setTimeout> | undefined;
  let avatarError = $state(false);

  let fadeObs: IntersectionObserver | null = null;

  interface Post {
    id: string;
    title: string;
    content: string;
    date: string;
  }

  let posts = $state<Post[]>([]);
  let postsLoading = $state(false);

  const WORKER_URL = import.meta.env.VITE_BLOG_WORKER_URL ?? "";

  const CONTACT = {
    email: "carlos.developer1983@gmail.com",
    github: "https://github.com/munchkin09",
    linkedin: "https://linkedin.com/in/carlosledesmac",
    twitter: "https://x.com/carloslc83",
  } as const;

  const socialLinks = [
    { label: "GitHub", href: CONTACT.github },
    { label: "LinkedIn", href: CONTACT.linkedin },
    { label: "Twitter / X", href: CONTACT.twitter },
  ] as const;

  const extraSkills = [
    "Git",
    "CI/CD",
    "WebSockets",
    "REST",
    "GraphQL",
    "gRPC",
    "Rust",
    "Go",
    "Linux",
    "Cloud",
    "Vercel",
    "Cloudflare",
    "Vitest",
    "Playwright",
    "Figma",
    "Agile / Scrum",
  ] as const;

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
      document
        .querySelectorAll(".fade-in:not(.visible)")
        .forEach((el) => fadeObs?.observe(el));
    }
  }

  function renderMarkdown(raw: string): string {
    return raw
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[(.+?)\]\((https?:\/\/[^)]+)\)/g, (_, text, url) => {
        const safeUrl = url.replace(/"/g, "%22").replace(/'/g, "%27");
        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      })
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br/>");
  }

  const dateLocale = $derived(localeDateFormat(data.lang));

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  const techStackBase = [
    {
      key: "typescript",
      pct: 25,
      color: "#00eefc",
      glow: "rgba(0, 238, 252, 0.42)",
      icon: "TS",
      category: "Frontend",
    },
    {
      key: "ai",
      pct: 20,
      color: "#ebb2ff",
      glow: "rgba(235, 178, 255, 0.38)",
      icon: "AI",
      category: "AI",
    },
    {
      key: "systemDesign",
      pct: 13,
      color: "#ffb1c3",
      glow: "rgba(255, 177, 195, 0.34)",
      icon: "SD",
      category: "Architecture",
    },
    {
      key: "frontend",
      pct: 5,
      color: "#7df4ff",
      glow: "rgba(125, 244, 255, 0.3)",
      icon: "UI",
      category: "Frontend",
    },
    {
      key: "python",
      pct: 4,
      color: "#b3c7ff",
      glow: "rgba(179, 199, 255, 0.34)",
      icon: "PY",
      category: "Backend",
    },
    {
      key: "cloud",
      pct: 20,
      color: "#bc13fe",
      glow: "rgba(188, 19, 254, 0.34)",
      icon: "CL",
      category: "DevOps",
    },
    {
      key: "data",
      pct: 13,
      color: "#f8d8ff",
      glow: "rgba(248, 216, 255, 0.28)",
      icon: "DB",
      category: "Data",
    },
  ] as const;

  const techStack = $derived(
    techStackBase.map((item) => ({
      ...item,
      name: t.skills.techNames[item.key],
      categoryLabel:
        t.skills.categories[item.category as keyof typeof t.skills.categories],
    })),
  );

  const heroStats = $derived([
    { value: "13+", label: t.hero.stats.yearsLabel },
    { value: "2", label: t.hero.stats.continentsLabel },
    { value: "infinity", label: t.hero.stats.bugsLabel },
  ]);

  const CX = 160;
  const CY = 160;
  const R_OUT = 140;
  const R_IN = 78;
  const GAP = 2.5;

  function polar(r: number, deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
  }

  function slicePath(startDeg: number, endDeg: number, expand = 0) {
    const span = endDeg - startDeg;
    if (span >= 359.999) return "";
    const mid = startDeg + span / 2;
    const ox = expand ? Math.cos(((mid - 90) * Math.PI) / 180) * expand : 0;
    const oy = expand ? Math.sin(((mid - 90) * Math.PI) / 180) * expand : 0;
    const os = polar(R_OUT, startDeg + GAP / 2);
    const oe = polar(R_OUT, endDeg - GAP / 2);
    const ie = polar(R_IN, endDeg - GAP / 2);
    const is_ = polar(R_IN, startDeg + GAP / 2);
    const large = span > 180 ? 1 : 0;
    return `M ${os.x + ox} ${os.y + oy} A ${R_OUT} ${R_OUT} 0 ${large} 1 ${oe.x + ox} ${oe.y + oy} L ${ie.x + ox} ${ie.y + oy} A ${R_IN} ${R_IN} 0 ${large} 0 ${is_.x + ox} ${is_.y + oy} Z`;
  }

  const slices = $derived.by(() => {
    let cum = 0;
    return techStack.map((item, i) => {
      const start = cum * 3.6;
      cum += item.pct;
      const end = cum * 3.6;
      return {
        ...item,
        i,
        start,
        end,
        path: slicePath(start, end),
      };
    });
  });

  const activeSlice = $derived(
    hoveredSlice === null ? null : slices[hoveredSlice] ?? null,
  );

  const projectsMeta = [
    {
      icon: "AI",
      year: "2026",
      tags: ["Claude Code", "AI Skills", "Node.js", "npx"],
      url: "https://github.com/Mammals-at-work/YACS",
    },
    {
      icon: "MM",
      year: "2026",
      tags: ["SvelteKit", "Express", "MongoDB", "Qdrant", "Docker"],
      url: "https://github.com/Mammals-at-work/mammals",
    },
    {
      icon: "WEB",
      year: "2026",
      tags: ["Svelte 5", "TypeScript", "Cloudflare Workers", "Telegram Bot"],
      url: "https://github.com/munchkin09/personal_page",
    },
    {
      icon: "CS",
      year: "2025",
      tags: ["TypeScript", "Gemini LLM", "FFmpeg", "Docker", "Azure"],
      url: "https://github.com/munchkin09/cs_backend",
    },
    {
      icon: "GD",
      year: "2024",
      tags: ["Godot", "GDScript", "Game Dev"],
      url: "https://github.com/munchkin09/gordots",
    },
    {
      icon: "CLI",
      year: "2023",
      tags: ["Node.js", "ASCII Art", "CLI"],
      url: "https://github.com/munchkin09/turbo-invention",
    },
  ] as const;

  const projects = $derived(
    projectsMeta.map((item, index) => ({
      ...item,
      title: t.projects.items[index].title,
      description: t.projects.items[index].description,
    })),
  );

  function initCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    let animId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const isMobile = window.matchMedia("(pointer: coarse)").matches;
    const count = isMobile ? 32 : 64;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.6 + 0.45,
      opacity: Math.random() * 0.4 + 0.08,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 238, 252, ${particle.opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 145) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(188, 19, 254, ${(1 - dist / 145) * 0.12})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }

  function startTypewriter() {
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseFrames = 0;

    const tick = () => {
      const roleList = dictionaries[data.lang].hero.roles;
      const current = roleList[roleIdx % roleList.length];

      if (deleting) {
        if (pauseFrames > 0) {
          pauseFrames -= 1;
          typewriterTimeout = setTimeout(tick, 55);
          return;
        }

        typewriterText = current.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roleList.length;
        }
        typewriterTimeout = setTimeout(tick, 55);
        return;
      }

      typewriterText = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pauseFrames = 28;
      }
      typewriterTimeout = setTimeout(tick, 78);
    };

    tick();
  }

  function observeSections() {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeSection = entry.target.id;
        }
      },
      { threshold: 0.34 },
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return observer;
  }

  function observeFadeIns() {
    fadeObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );

    document.querySelectorAll(".fade-in").forEach((el) => fadeObs?.observe(el));
    return fadeObs;
  }

  onMount(() => {
    const cleanups: Array<() => void> = [];
    if (canvasEl) cleanups.push(initCanvas(canvasEl));

    startTypewriter();
    const sectionObserver = observeSections();
    const fadeObserver = observeFadeIns();

    const onScroll = () => {
      navScrolled = window.scrollY > 28;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    loadPosts();

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      sectionObserver.disconnect();
      fadeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(typewriterTimeout);
    };
  });

  const navLinks = $derived([
    { id: "about", label: t.nav.about },
    { id: "strengths", label: t.nav.strengths },
    { id: "skills", label: t.nav.skills },
    { id: "projects", label: t.nav.projects },
    { id: "experience", label: t.nav.experience },
    { id: "blog", label: t.nav.blog },
    { id: "contact", label: t.nav.contact },
  ]);

  function switchLocale(next: Locale) {
    if (next === data.lang) return;
    rememberLocale(next);
    const target =
      swapLocaleInPath(window.location.pathname, next) + window.location.hash;
    goto(target);
  }
</script>

<svelte:head>
  <title>{t.meta.homeTitle}</title>
  <meta name="description" content={t.meta.homeDescription} />
  <meta property="og:title" content={t.meta.homeTitle} />
  <meta property="og:description" content={t.meta.homeDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://carloslc.is-a.dev/{data.lang}" />
  <meta
    property="og:image"
    content="https://picsum.photos/seed/munchkin/200/200"
  />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={t.meta.homeTitle} />
  <meta name="twitter:description" content={t.meta.homeDescription} />
  <meta
    name="twitter:image"
    content="https://picsum.photos/seed/munchkin/1200/630"
  />
</svelte:head>

<div class="home-shell">
  <nav class:scrolled={navScrolled}>
    <a href="#hero" class="logo">CL<span>.</span></a>

    <button
      class="menu-toggle"
      type="button"
      aria-label="Toggle menu"
      onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        {#if mobileMenuOpen}
          <path d="M18 6 6 18M6 6l12 12" />
        {:else}
          <path d="M4 7h16M4 12h16M4 17h16" />
        {/if}
      </svg>
    </button>

    <div class="nav-content" class:open={mobileMenuOpen}>
      <ul>
        {#each navLinks as link}
          <li>
            <a
              href="#{link.id}"
              class:active={activeSection === link.id}
              onclick={() => (mobileMenuOpen = false)}
            >{link.label}</a>
          </li>
        {/each}
      </ul>

      <div class="nav-actions">
        <div class="lang-switch" role="group" aria-label={t.nav.langSwitchLabel}>
          {#each SUPPORTED_LOCALES as loc}
            <button
              type="button"
              class="lang-btn"
              class:active={data.lang === loc}
              aria-pressed={data.lang === loc}
              onclick={() => {
                switchLocale(loc);
                mobileMenuOpen = false;
              }}
            >{loc.toUpperCase()}</button>
          {/each}
        </div>

        <a href="/{data.lang}/cv" class="nav-cv" title={t.nav.cvTitle} onclick={() => (mobileMenuOpen = false)}>
          {t.nav.cvLabel}
        </a>

        <a href="mailto:{CONTACT.email}" class="nav-cta" onclick={() => (mobileMenuOpen = false)}>
          {t.nav.ctaContact}
        </a>
      </div>
    </div>
  </nav>

  <section id="hero" class="hero">
    <canvas bind:this={canvasEl} class="particle-canvas"></canvas>
    <div class="hero-orb orb-primary"></div>
    <div class="hero-orb orb-secondary"></div>
    <div class="hero-orb orb-tertiary"></div>

    <div class="container hero-grid">
      <div class="hero-copy fade-in">
        <p class="eyebrow">{t.hero.badge}</p>
        <h1 class="hero-name">
          <span>Carlos</span>
          <span class="text-gradient">Ledesma</span>
        </h1>
        <p class="hero-role">
          <span class="role-prefix">//</span>
          <span>{typewriterText}</span>
          <span class="role-cursor"></span>
        </p>
        <p class="hero-subtitle hero-subtitle-strong">{t.hero.subtitleLine1}</p>
        <p class="hero-subtitle">{t.hero.subtitleLine2}</p>

        <div class="hero-actions fade-in">
          <a href="#projects" class="button">
            <span>{t.hero.viewProjects}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
          <a href="mailto:{CONTACT.email}" class="button-ghost">{t.hero.letsTalk}</a>
          <a href="/{data.lang}/cv" class="button-ghost">{t.hero.printableCv}</a>
        </div>
      </div>

      <aside class="hero-panel glass-panel fade-in">
        <div class="hero-panel-head">
          <div>
            <p class="eyebrow">{t.skills.label}</p>
            <p class="panel-copy">{t.about.label}</p>
          </div>
          <span class="status-chip">online</span>
        </div>

        <div class="hero-metrics">
          {#each heroStats as item}
            <div class="metric-cell">
              <span class="metric-value">{item.value}</span>
              <span class="metric-label">{item.label}</span>
            </div>
          {/each}
        </div>

        <div class="signal-strip">
          {#each t.about.tags as tag}
            <span class="chip">{tag}</span>
          {/each}
        </div>

        <div class="hero-links">
          {#each socialLinks as link}
            <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
          {/each}
        </div>
      </aside>
    </div>
  </section>

  <section id="about" class="section about-section">
    <div class="container">
      <div class="about-panel glass-panel fade-in">
        <div class="about-visual">
          <div class="avatar-shell">
            <div class="avatar-ring"></div>
            <div class="avatar-ring avatar-ring-alt"></div>
            <div class="avatar-core">
              {#if !avatarError}
                <img
                  src="https://boletinstatics.blob.core.windows.net/personal/yo.jpg"
                  alt="Carlos Ledesma"
                  onerror={() => (avatarError = true)}
                />
              {:else}
                <span>CL</span>
              {/if}
            </div>
          </div>

          <div class="about-tags">
            {#each t.about.tags as tag}
              <span class="chip">{tag}</span>
            {/each}
          </div>
        </div>

        <div class="about-text">
          <p class="eyebrow">{t.about.label}</p>
          <h2>{t.about.titlePrefix}<span class="text-gradient">{t.about.titleHighlight}</span></h2>

          <div class="about-body">
            {#each t.about.paragraphs as paragraph}
              <p>{@html paragraph}</p>
            {/each}
          </div>

          <div class="about-links">
            <a href="mailto:{CONTACT.email}" class="button-ghost">{CONTACT.email}</a>
            <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" class="button-ghost">GitHub</a>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" class="button-ghost">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="strengths" class="section">
    <div class="container">
      <div class="section-header fade-in">
        <p class="eyebrow">{t.strengths.label}</p>
        <h2>{t.strengths.titlePrefix}<span class="text-gradient">{t.strengths.titleHighlight}</span></h2>
        <p class="section-subtitle">{t.strengths.subtitle}</p>
      </div>

      <div class="strengths-grid">
        {#each t.strengths.items as item, index}
          <article class="strength-card glass-panel fade-in" style={`transition-delay: ${index * 70}ms`}>
            <span class="strength-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section id="skills" class="section skills-section">
    <div class="container">
      <div class="section-header fade-in">
        <p class="eyebrow">{t.skills.label}</p>
        <h2>{t.skills.titlePrefix}<span class="text-gradient">{t.skills.titleHighlight}</span></h2>
        <p class="section-subtitle">{t.skills.subtitle}</p>
      </div>

      <div class="chart-layout">
        <div class="chart-wrap glass-panel fade-in">
          <svg viewBox="0 0 320 320" class="pie-svg" role="img" aria-label="Tech stack chart">
            <defs>
              {#each slices as slice}
                <radialGradient id={`grad-${slice.i}`} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stop-color={slice.color} stop-opacity="1" />
                  <stop offset="100%" stop-color={slice.color} stop-opacity="0.72" />
                </radialGradient>
              {/each}
            </defs>

            {#each slices as slice}
              <path
                d={hoveredSlice === slice.i ? slicePath(slice.start, slice.end, 10) : slice.path}
                fill={`url(#grad-${slice.i})`}
                class="pie-slice"
                style={`opacity:${hoveredSlice === null || hoveredSlice === slice.i ? 1 : 0.28}; filter:${hoveredSlice === slice.i ? `drop-shadow(0 0 18px ${slice.glow})` : "none"}`}
                role="button"
                tabindex="0"
                aria-label={`${slice.name}: ${slice.pct}%`}
                onmouseenter={() => (hoveredSlice = slice.i)}
                onmouseleave={() => (hoveredSlice = null)}
                onclick={() => (hoveredSlice = hoveredSlice === slice.i ? null : slice.i)}
                onkeydown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    hoveredSlice = hoveredSlice === slice.i ? null : slice.i;
                  }
                }}
              >
                <title>{slice.name} - {slice.pct}%</title>
              </path>
            {/each}

            {#if activeSlice}
              <text x={CX} y={CY - 18} text-anchor="middle" class="chart-center-label">{activeSlice.icon}</text>
              <text x={CX} y={CY + 8} text-anchor="middle" class="chart-center-title">{activeSlice.name}</text>
              <text x={CX} y={CY + 34} text-anchor="middle" class="chart-center-value" style={`fill:${activeSlice.color}`}>{activeSlice.pct}%</text>
            {:else}
              <text x={CX} y={CY + 4} text-anchor="middle" class="chart-center-value">100%</text>
              <text x={CX} y={CY + 28} text-anchor="middle" class="chart-center-title">{t.skills.totalLabel}</text>
            {/if}
          </svg>
        </div>

        <div class="skills-legend glass-panel fade-in">
          {#each techStack as skill, index}
            <button
              type="button"
              class="skill-row"
              class:is-active={hoveredSlice === index}
              onmouseenter={() => (hoveredSlice = index)}
              onmouseleave={() => (hoveredSlice = null)}
              onclick={() => (hoveredSlice = hoveredSlice === index ? null : index)}
            >
              <span class="skill-dot" style={`background:${skill.color}; box-shadow: 0 0 18px ${skill.glow}`}></span>
              <span class="skill-meta">
                <strong>{skill.name}</strong>
                <small>{skill.categoryLabel}</small>
              </span>
              <span class="skill-value">{skill.pct}%</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="extra-skills fade-in">
        {#each extraSkills as tag}
          <span class="chip">{tag}</span>
        {/each}
      </div>
    </div>
  </section>

  <section id="projects" class="section">
    <div class="container">
      <div class="section-header fade-in">
        <p class="eyebrow">{t.projects.label}</p>
        <h2>{t.projects.titlePrefix}<span class="text-gradient">{t.projects.titleHighlight}</span></h2>
      </div>

      <div class="projects-grid">
        {#each projects as project, index}
          <article class="project-card glass-panel fade-in" style={`transition-delay: ${index * 80}ms`}>
            <div class="project-topline">
              <span class="project-icon">{project.icon}</span>
              <span class="project-year">{project.year}</span>
            </div>

            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <div class="project-tags">
              {#each project.tags as tag}
                <span class="chip">{tag}</span>
              {/each}
            </div>

            <a href={project.url} target="_blank" rel="noopener noreferrer" class="project-link">
              {t.projects.seeOnGitHub}
            </a>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section id="experience" class="section">
    <div class="container">
      <div class="section-header fade-in">
        <p class="eyebrow">{t.experience.label}</p>
        <h2>{t.experience.titlePrefix}<span class="text-gradient">{t.experience.titleHighlight}</span></h2>
        <p class="section-subtitle">{t.experience.subtitle}</p>
      </div>

      <div class="timeline">
        {#each t.experience.items as item, index}
          <article class="timeline-item fade-in" style={`transition-delay: ${index * 90}ms`}>
            <div class="timeline-dot"></div>
            <div class="timeline-card glass-panel">
              <span class="timeline-year">{item.year}</span>
              <h3>{item.role}</h3>
              <p class="timeline-company">{item.company}</p>
              <p class="timeline-copy">{item.desc}</p>
              <div class="timeline-tags">
                {#each item.highlights as highlight}
                  <span class="chip">{highlight}</span>
                {/each}
              </div>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </section>

  <section id="blog" class="section blog-section">
    <div class="container">
      <div class="section-header fade-in">
        <p class="eyebrow">{t.blog.label}</p>
        <h2>{t.blog.titlePrefix}<span class="text-gradient">{t.blog.titleHighlight}</span></h2>
        <p class="section-subtitle">{t.blog.subtitle}</p>
      </div>

      {#if postsLoading}
        <div class="blog-state glass-panel fade-in">
          <div class="blog-spinner"></div>
          <span>{t.blog.loading}</span>
        </div>
      {:else if posts.length === 0}
        <div class="blog-state glass-panel fade-in">
          <span class="blog-empty-icon">{t.blog.emptyIcon}</span>
          <p>{t.blog.empty}</p>
        </div>
      {:else}
        <div class="blog-grid">
          {#each posts as post, index}
            <a href="/{data.lang}/blog/{post.id}" class="blog-card glass-panel fade-in" style={`transition-delay: ${index * 70}ms`}>
              <div class="blog-card-meta">
                <time>{formatDate(post.date)}</time>
                <span>#{post.id}</span>
              </div>
              <h3>{post.title}</h3>
              <div class="blog-body">
                <p>{@html renderMarkdown(post.content)}</p>
              </div>
              <span class="blog-link">{t.blog.readMore}</span>
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <section id="contact" class="section contact-section">
    <div class="container">
      <div class="contact-card glass-panel fade-in">
        <p class="eyebrow">{t.contact.label}</p>
        <h2>{t.contact.titlePrefix}<span class="text-gradient">{t.contact.titleHighlight}</span></h2>
        <p class="contact-copy">{t.contact.subtitle}</p>
        <a href="mailto:{CONTACT.email}" class="button contact-button">{t.contact.sendEmail}</a>
        <div class="contact-links">
          {#each socialLinks as link}
            <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <p>{t.footer.copyright} <span class="footer-heart">+</span> {t.footer.tech} <strong>Svelte 5</strong></p>
  </footer>
</div>

<style>
  :global(body) {
    overflow-x: hidden;
  }

  .home-shell {
    position: relative;
    padding-bottom: 4rem;
  }

  .container {
    width: min(calc(100% - (var(--gutter) * 2)), var(--container-max));
    margin: 0 auto;
  }

  nav {
    position: fixed;
    top: 1rem;
    left: 50%;
    z-index: 120;
    width: min(calc(100% - 1.5rem), var(--container-max));
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 0.8rem 1rem 0.8rem 1.4rem;
    border: 1px solid transparent;
    border-radius: 999px;
    transition:
      background 0.28s ease,
      border-color 0.28s ease,
      box-shadow 0.28s ease,
      backdrop-filter 0.28s ease;
  }

  nav.scrolled {
    background: rgba(19, 19, 21, 0.76);
    border-color: var(--glass-border);
    backdrop-filter: blur(18px);
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.38);
  }

  .logo {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: -0.04em;
    color: var(--on-surface);
  }

  .logo span {
    color: var(--secondary-strong);
    text-shadow: 0 0 16px rgba(0, 238, 252, 0.35);
  }

  .nav-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  nav ul {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    margin: 0 auto 0 0;
    padding: 0;
    list-style: none;
  }

  nav ul a {
    display: inline-flex;
    align-items: center;
    min-height: 2.5rem;
    padding: 0.55rem 0.85rem;
    border-radius: 999px;
    color: var(--on-surface-variant);
    font-size: 0.86rem;
    transition:
      color 0.24s ease,
      background 0.24s ease,
      box-shadow 0.24s ease;
  }

  nav ul a:hover,
  nav ul a.active {
    color: var(--on-surface);
    background: rgba(255, 255, 255, 0.05);
  }

  nav ul a.active {
    box-shadow: 0 0 0 1px rgba(0, 238, 252, 0.2) inset;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 0.65rem;
  }

  .lang-switch {
    display: inline-flex;
    padding: 0.18rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.03);
  }

  .lang-btn {
    border: 0;
    border-radius: 999px;
    padding: 0.35rem 0.7rem;
    background: transparent;
    color: var(--on-surface-variant);
    font-family: var(--font-display);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  .lang-btn.active {
    background: rgba(235, 178, 255, 0.14);
    color: var(--primary);
  }

  .nav-cv,
  .nav-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.7rem;
    padding: 0.55rem 1rem;
    border-radius: 999px;
    font-size: 0.84rem;
    font-weight: 600;
    transition:
      transform 0.24s ease,
      background 0.24s ease,
      border-color 0.24s ease,
      box-shadow 0.24s ease;
  }

  .nav-cv {
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.03);
    color: var(--on-surface);
  }

  .nav-cta {
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #fff;
    background: linear-gradient(135deg, var(--primary-strong), var(--secondary-strong));
    box-shadow: 0 10px 36px rgba(188, 19, 254, 0.24);
  }

  .nav-cv:hover,
  .nav-cta:hover {
    transform: translateY(-1px);
  }

  .nav-cv:hover {
    border-color: rgba(0, 238, 252, 0.35);
    box-shadow: 0 0 20px rgba(0, 238, 252, 0.12);
  }

  .nav-cta:hover {
    box-shadow: 0 14px 44px rgba(188, 19, 254, 0.32);
  }

  .menu-toggle {
    display: none;
    margin-left: auto;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    padding: 0.55rem;
    background: rgba(255, 255, 255, 0.03);
    color: var(--on-surface);
  }

  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding: 8rem 0 4rem;
    overflow: hidden;
  }

  .hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 15% 20%, rgba(188, 19, 254, 0.16), transparent 26%),
      radial-gradient(circle at 85% 20%, rgba(0, 238, 252, 0.12), transparent 24%),
      linear-gradient(180deg, rgba(10, 10, 13, 0.2) 0%, rgba(19, 19, 21, 0) 100%);
    pointer-events: none;
  }

  .particle-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.8;
    animation: orb-float 10s ease-in-out infinite;
    pointer-events: none;
  }

  .orb-primary {
    top: 10%;
    left: -5%;
    width: 26rem;
    height: 26rem;
    background: rgba(188, 19, 254, 0.2);
  }

  .orb-secondary {
    top: 16%;
    right: -6%;
    width: 22rem;
    height: 22rem;
    background: rgba(0, 238, 252, 0.16);
    animation-delay: 2s;
  }

  .orb-tertiary {
    bottom: -8%;
    left: 40%;
    width: 18rem;
    height: 18rem;
    background: rgba(232, 0, 110, 0.14);
    animation-delay: 4.5s;
  }

  .hero-grid {
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
    gap: 2rem;
    align-items: end;
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .hero-name {
    display: flex;
    flex-direction: column;
    font-size: clamp(4rem, 12vw, 7rem);
    line-height: 0.92;
    text-shadow: 0 0 24px rgba(235, 178, 255, 0.18);
  }

  .hero-role {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    width: fit-content;
    padding: 0.55rem 0.8rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.035);
    color: var(--on-surface);
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 500;
    backdrop-filter: blur(12px);
  }

  .role-prefix {
    color: var(--secondary-strong);
  }

  .role-cursor {
    width: 0.45rem;
    height: 1rem;
    border-radius: 999px;
    background: var(--primary-strong);
    box-shadow: 0 0 14px rgba(188, 19, 254, 0.42);
    animation: blink 1s steps(1, end) infinite;
  }

  .hero-subtitle {
    max-width: 42rem;
    color: var(--on-surface-variant);
    font-size: 1.05rem;
  }

  .hero-subtitle-strong {
    font-size: 1.18rem;
    color: var(--on-surface);
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.9rem;
  }

  .hero-panel {
    padding: 1.4rem;
    display: grid;
    gap: 1.25rem;
  }

  .hero-panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .panel-copy {
    margin-top: 0.45rem;
    color: var(--on-surface-variant);
    font-size: 0.92rem;
  }

  .status-chip {
    display: inline-flex;
    align-items: center;
    min-height: 2rem;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    background: rgba(0, 238, 252, 0.1);
    border: 1px solid rgba(0, 238, 252, 0.2);
    color: var(--secondary);
    font-family: var(--font-display);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .hero-metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.9rem;
  }

  .metric-cell {
    min-height: 8.5rem;
    padding: 1rem;
    border-radius: 1.15rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .metric-value {
    font-family: var(--font-display);
    font-size: 2rem;
    line-height: 1;
    color: var(--secondary-strong);
    text-shadow: 0 0 18px rgba(0, 238, 252, 0.25);
  }

  .metric-label {
    color: var(--on-surface-variant);
    font-size: 0.82rem;
  }

  .signal-strip {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .hero-links,
  .contact-links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .hero-links a,
  .contact-links a,
  .project-link,
  .blog-link {
    color: var(--secondary);
    font-family: var(--font-display);
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .section {
    padding-top: var(--section-padding);
  }

  .about-section {
    position: relative;
  }

  .about-panel {
    display: grid;
    grid-template-columns: minmax(280px, 0.8fr) minmax(0, 1.2fr);
    gap: 2rem;
    padding: var(--card-padding);
  }

  .about-visual {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    justify-content: center;
  }

  .avatar-shell {
    position: relative;
    width: 15rem;
    height: 15rem;
    display: grid;
    place-items: center;
  }

  .avatar-ring {
    position: absolute;
    inset: -0.75rem;
    border-radius: 50%;
    border: 1px solid rgba(235, 178, 255, 0.22);
    animation: spin 16s linear infinite;
  }

  .avatar-ring-alt {
    inset: -1.5rem;
    border-color: rgba(0, 238, 252, 0.22);
    animation-direction: reverse;
    animation-duration: 20s;
  }

  .avatar-core {
    position: relative;
    width: 12.5rem;
    height: 12.5rem;
    border-radius: 50%;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(188, 19, 254, 0.52), rgba(0, 238, 252, 0.46));
    box-shadow:
      0 0 0 8px rgba(255, 255, 255, 0.035),
      0 0 40px rgba(188, 19, 254, 0.2);
    display: grid;
    place-items: center;
  }

  .avatar-core img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .avatar-core span {
    font-family: var(--font-display);
    font-size: 3.4rem;
    font-weight: 700;
    color: #fff;
  }

  .about-tags,
  .project-tags,
  .timeline-tags,
  .extra-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
  }

  .about-text {
    display: flex;
    flex-direction: column;
    gap: 1.35rem;
  }

  .about-text h2,
  .section-header h2,
  .contact-card h2 {
    font-size: clamp(2.25rem, 5vw, 4rem);
  }

  .about-body {
    display: grid;
    gap: 1rem;
    color: var(--on-surface-variant);
  }

  .about-body p {
    max-width: 60ch;
  }

  .about-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
  }

  .section-header {
    display: grid;
    justify-items: start;
    gap: 0.8rem;
    margin-bottom: 2rem;
  }

  .section-subtitle,
  .contact-copy {
    max-width: 42rem;
    color: var(--on-surface-variant);
    font-size: 1.02rem;
  }

  .strengths-grid,
  .projects-grid,
  .blog-grid {
    display: grid;
    gap: 1.15rem;
  }

  .strengths-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .projects-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .blog-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .strength-card,
  .project-card,
  .blog-card,
  .contact-card,
  .chart-wrap,
  .skills-legend,
  .blog-state {
    padding: var(--card-padding);
  }

  .strength-card,
  .project-card,
  .blog-card {
    display: grid;
    gap: 1rem;
  }

  .strength-icon,
  .project-icon {
    display: inline-grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.045);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: var(--secondary);
    font-family: var(--font-display);
    font-weight: 700;
  }

  .strength-card h3,
  .project-card h3,
  .blog-card h3,
  .timeline-card h3 {
    font-size: 1.28rem;
  }

  .strength-card p,
  .project-card p,
  .blog-card p,
  .timeline-copy {
    color: var(--on-surface-variant);
  }

  .chart-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.85fr);
    gap: 1.2rem;
    align-items: stretch;
  }

  .chart-wrap {
    display: grid;
    place-items: center;
    min-height: 30rem;
  }

  .pie-svg {
    width: min(100%, 24rem);
    overflow: visible;
  }

  .pie-slice {
    cursor: pointer;
    transition:
      transform 0.24s ease,
      opacity 0.24s ease,
      filter 0.24s ease;
  }

  .chart-center-label,
  .chart-center-title,
  .chart-center-value {
    font-family: var(--font-display);
  }

  .chart-center-label {
    fill: var(--secondary);
    font-size: 0.9rem;
    letter-spacing: 0.2em;
  }

  .chart-center-title {
    fill: var(--on-surface);
    font-size: 0.92rem;
  }

  .chart-center-value {
    fill: var(--primary);
    font-size: 1.55rem;
    font-weight: 700;
  }

  .skills-legend {
    display: grid;
    gap: 0.75rem;
    align-content: start;
  }

  .skill-row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 0.8rem;
    align-items: center;
    width: 100%;
    padding: 0.85rem 0.95rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.028);
    color: var(--on-surface);
    text-align: left;
    transition:
      background 0.24s ease,
      border-color 0.24s ease,
      transform 0.24s ease,
      box-shadow 0.24s ease;
  }

  .skill-row:hover,
  .skill-row.is-active {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(0, 238, 252, 0.28);
    box-shadow: 0 0 24px rgba(0, 238, 252, 0.08);
  }

  .skill-dot {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 999px;
  }

  .skill-meta {
    display: grid;
    gap: 0.18rem;
  }

  .skill-meta small {
    color: var(--on-surface-variant);
    font-size: 0.76rem;
  }

  .skill-value,
  .project-year,
  .timeline-year,
  .blog-card-meta,
  .blog-card-meta time,
  .blog-card-meta span {
    font-family: var(--font-display);
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .skill-value,
  .timeline-year {
    color: var(--secondary);
  }

  .project-topline,
  .blog-card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
  }

  .project-year,
  .blog-card-meta span,
  .blog-card-meta time {
    color: var(--outline);
  }

  .timeline {
    position: relative;
    display: grid;
    gap: 1rem;
    padding-left: 2rem;
  }

  .timeline::before {
    content: "";
    position: absolute;
    top: 0.5rem;
    bottom: 0.5rem;
    left: 0.5rem;
    width: 3px;
    background: linear-gradient(180deg, var(--secondary-strong), var(--primary-strong));
    box-shadow: 0 0 18px rgba(188, 19, 254, 0.2);
    border-radius: 999px;
  }

  .timeline-item {
    position: relative;
  }

  .timeline-dot {
    position: absolute;
    top: 1.55rem;
    left: -1.84rem;
    width: 0.95rem;
    height: 0.95rem;
    border-radius: 50%;
    background: radial-gradient(circle, var(--secondary-strong), var(--primary-strong));
    box-shadow: 0 0 18px rgba(188, 19, 254, 0.36);
  }

  .timeline-card {
    display: grid;
    gap: 0.85rem;
    padding: var(--card-padding);
  }

  .timeline-company {
    color: var(--secondary);
    font-weight: 600;
  }

  .blog-state {
    min-height: 12rem;
    display: grid;
    place-items: center;
    gap: 0.8rem;
    text-align: center;
    color: var(--on-surface-variant);
  }

  .blog-spinner {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.14);
    border-top-color: var(--secondary-strong);
    animation: spin 1s linear infinite;
  }

  .blog-empty-icon {
    font-size: 2rem;
  }

  .blog-body {
    color: var(--on-surface-variant);
  }

  .blog-body :global(p) {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-body :global(a) {
    color: var(--secondary);
  }

  .contact-section {
    padding-bottom: 4rem;
  }

  .contact-card {
    display: grid;
    justify-items: start;
    gap: 1rem;
    position: relative;
    overflow: hidden;
  }

  .contact-card::before {
    content: "";
    position: absolute;
    inset: -20% auto auto -8%;
    width: 18rem;
    height: 18rem;
    background: radial-gradient(circle, rgba(0, 238, 252, 0.16), transparent 70%);
    pointer-events: none;
  }

  .contact-button {
    margin-top: 0.5rem;
  }

  .site-footer {
    width: min(calc(100% - (var(--gutter) * 2)), var(--container-max));
    margin: 0 auto;
    padding: 2rem 0 0;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    color: var(--outline);
  }

  .footer-heart {
    color: var(--tertiary);
  }

  .fade-in {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  :global(.fade-in.visible) {
    opacity: 1;
    transform: none;
  }

  @keyframes orb-float {
    0%,
    100% {
      transform: translate3d(0, 0, 0) scale(1);
    }
    50% {
      transform: translate3d(0.5rem, -1rem, 0) scale(1.08);
    }
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 1080px) {
    .menu-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .nav-content {
      position: absolute;
      top: calc(100% + 0.65rem);
      left: 0;
      right: 0;
      display: none;
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
      padding: 1rem;
      border-radius: 1.5rem;
      background: rgba(19, 19, 21, 0.92);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(20px);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    }

    .nav-content.open {
      display: flex;
    }

    nav ul,
    .nav-actions {
      flex-direction: column;
      align-items: stretch;
      width: 100%;
      margin: 0;
    }

    .nav-actions {
      gap: 0.75rem;
    }

    .nav-cv,
    .nav-cta,
    .lang-switch {
      width: 100%;
      justify-content: center;
    }

    .hero-grid,
    .about-panel,
    .chart-layout {
      grid-template-columns: 1fr;
    }

    .strengths-grid,
    .projects-grid,
    .blog-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 768px) {
    nav {
      top: 0.75rem;
      width: calc(100% - 1rem);
    }

    .hero {
      padding-top: 8.5rem;
      min-height: auto;
    }

    .hero-metrics {
      grid-template-columns: 1fr;
    }

    .strengths-grid,
    .projects-grid,
    .blog-grid {
      grid-template-columns: 1fr;
    }

    .timeline {
      padding-left: 1.5rem;
    }

    .timeline-dot {
      left: -1.34rem;
    }
  }

  @media (max-width: 640px) {
    .hero-name {
      font-size: 3.6rem;
    }

    .hero-role {
      width: 100%;
      justify-content: center;
      text-align: center;
    }

    .about-links,
    .hero-actions,
    .hero-links,
    .contact-links {
      flex-direction: column;
      align-items: stretch;
    }

    .button,
    .button-ghost,
    .contact-button {
      width: 100%;
    }

    .about-text h2,
    .section-header h2,
    .contact-card h2 {
      font-size: 2rem;
    }
  }
</style>