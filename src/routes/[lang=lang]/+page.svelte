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

  // ─── State ───────────────────────────────────────────────────────────────────
  let mobileMenuOpen = $state(false);
  let navScrolled = $state(false);
  let activeSection = $state("hero");
  let scrollY = $state(0);
  let cursorX = $state(-100);
  let cursorY = $state(-100);
  let typewriterText = $state("");
  let typewriterTimeout: ReturnType<typeof setTimeout> | undefined;
  let avatarError = $state(false);

  // ─── Blog ────────────────────────────────────────────────────────────────────
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

  async function loadPosts() {
    if (!WORKER_URL) return;
    postsLoading = true;
    try {
      const res = await fetch(`${WORKER_URL}/api/posts`);
      if (res.ok) posts = await res.json();
    } catch {
      /* sin conexión al worker */
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

  // ─── Tech stack (bars, no pie) ───────────────────────────────────────────────
  const techStackBase = [
    { key: "typescript", pct: 75, accent: "cyan", category: "Frontend" },
    { key: "ai", pct: 66, accent: "violet", category: "AI" },
    { key: "cloud", pct: 70, accent: "pink", category: "DevOps" },
    { key: "systemDesign", pct: 64, accent: "violet", category: "Architecture" },
    { key: "qaAutomation", pct: 51, accent: "cyan", category: "Testing" },
    { key: "frontend", pct: 43, accent: "pink", category: "Frontend" },
    { key: "python", pct: 30, accent: "yellow", category: "Backend" },
  ] as const;

  const techStack = $derived(
    techStackBase.map((b, i) => ({
      ...b,
      idx: String(i + 1).padStart(2, "0"),
      name: t.skills.techNames[b.key],
      categoryLabel:
        t.skills.categories[b.category as keyof typeof t.skills.categories],
    })),
  );

  // ─── Radar / polar chart geometry ────────────────────────────────────────────
  const RADAR = { cx: 270, cy: 240, r: 178, n: techStackBase.length } as const;
  function radarPt(i: number, frac: number) {
    const a = (i * Math.PI * 2) / RADAR.n - Math.PI / 2;
    return { x: RADAR.cx + RADAR.r * frac * Math.cos(a), y: RADAR.cy + RADAR.r * frac * Math.sin(a) };
  }
  const radarAxes = techStackBase.map((_, i) => radarPt(i, 1));
  const radarRings = [0.25, 0.5, 0.75, 1.0].map(f =>
    techStackBase.map((_, i) => { const p = radarPt(i, f); return `${p.x.toFixed(1)},${p.y.toFixed(1)}`; }).join(' ')
  );
  const radarDataPoly = techStackBase.map((s, i) => {
    const p = radarPt(i, s.pct / 100);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ');
  const radarDots = techStackBase.map((s, i) => ({ ...radarPt(i, s.pct / 100), accent: s.accent }));
  const radarLabelPos = techStackBase.map((_, i) => radarPt(i, 1.22));
  let hoveredSkillIdx = $state<number | null>(null);

  // ─── Project metadata ────────────────────────────────────────────────────────
  const projectsMeta = [
    {
      year: "2026",
      tags: ["Claude Code", "AI Skills", "Node.js", "npx"],
      url: "https://github.com/Mammals-at-work/YACS",
      metric: "skills · 12+",
      accent: "cyan",
    },
    {
      year: "2026",
      tags: ["SvelteKit", "Express", "MongoDB", "Qdrant", "Docker"],
      url: "https://github.com/Mammals-at-work/mammals",
      metric: "MCP · ready",
      accent: "violet",
    },
    {
      year: "2026",
      tags: ["Svelte 5", "TypeScript", "Cloudflare Workers", "Telegram Bot"],
      url: "https://github.com/munchkin09/personal_page",
      metric: "lighthouse · 100",
      accent: "pink",
    },
    {
      year: "2025",
      tags: ["TypeScript", "Gemini LLM", "FFmpeg", "Docker", "Azure"],
      url: "https://github.com/munchkin09/cs_backend",
      metric: "video · IA",
      accent: "cyan",
    },
    {
      year: "2024",
      tags: ["Godot", "GDScript", "Game Dev"],
      url: "https://github.com/munchkin09/gordots",
      metric: "game · 2D",
      accent: "violet",
    },
    {
      year: "2023",
      tags: ["Node.js", "ASCII Art", "CLI"],
      url: "https://github.com/munchkin09/turbo-invention",
      metric: "CLI · npm",
      accent: "pink",
    },
  ] as const;

  const projects = $derived(
    projectsMeta.map((m, i) => ({
      ...m,
      num: String(i + 1).padStart(2, "0"),
      title: t.projects.items[i].title,
      description: t.projects.items[i].description,
    })),
  );

  // ─── Lucide-style icons (1.5px stroke) ───────────────────────────────────────
  // Strengths: brain, zap, message-square, refresh-cw, target, shield
  const strengthIcons = [
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6l8-3 8 3z"/></svg>`,
  ];

  // Projects: sparkles, folder-kanban, globe, video, gamepad-2, terminal
  const projectIcons = [
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/><path d="M8 10v4"/><path d="M12 10v2"/><path d="M16 10v6"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m16 13 5.22 3.39a.6.6 0 0 0 .78-.57V8.18a.6.6 0 0 0-.78-.57L16 11"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0 0 17.32 5z"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
  ];

  // ─── Typewriter ──────────────────────────────────────────────────────────────
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
          pauseFrames--;
          typewriterTimeout = setTimeout(tick, 50);
          return;
        }
        typewriterText = current.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roleList.length;
        }
        typewriterTimeout = setTimeout(tick, 40);
      } else {
        typewriterText = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
          deleting = true;
          pauseFrames = 40;
        }
        typewriterTimeout = setTimeout(tick, 70);
      }
    };
    tick();
  }

  // ─── Observers ───────────────────────────────────────────────────────────────
  function observeSections() {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) activeSection = e.target.id;
      },
      { threshold: 0.3 },
    );
    document.querySelectorAll("section[id]").forEach((s) => obs.observe(s));
    return obs;
  }

  function observeFadeIns() {
    fadeObs = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) e.target.classList.add("visible");
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );
    document.querySelectorAll(".fade-in").forEach((el) => fadeObs!.observe(el));
    return fadeObs;
  }

  // ─── Magnetic ────────────────────────────────────────────────────────────────
  function attachMagnetic(el: HTMLElement) {
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.3;
      const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.3;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const onLeave = () => {
      el.style.transition = "transform 0.5s var(--ease-spring)";
      el.style.transform = "";
      setTimeout(() => (el.style.transition = ""), 500);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────────
  onMount(() => {
    const cleanups: (() => void)[] = [];
    startTypewriter();
    const sObs = observeSections();
    const fObs = observeFadeIns();
    const onScroll = () => {
      scrollY = window.scrollY;
      navScrolled = window.scrollY > 40;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const onMouseMove = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    };
    document.addEventListener("mousemove", onMouseMove);
    document
      .querySelectorAll<HTMLElement>(".magnetic")
      .forEach((el) => cleanups.push(attachMagnetic(el)));
    loadPosts();
    return () => {
      cleanups.forEach((c) => c());
      sObs.disconnect();
      fObs.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousemove", onMouseMove);
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
    content="https://picsum.photos/seed/munchkin/1200/630"
  />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={t.meta.homeTitle} />
  <meta name="twitter:description" content={t.meta.homeDescription} />
  <meta
    name="twitter:image"
    content="https://picsum.photos/seed/munchkin/1200/630"
  />
</svelte:head>

<!-- ── Parallax background layers ── -->
<div class="bg-layers" aria-hidden="true">
  <div
    class="bg-dotgrid"
    style="transform: translate3d(0, {scrollY * -0.3}px, 0)"
  ></div>
  <img
    src="/design/blob-cyan.svg"
    alt=""
    class="bg-blob blob-1"
    style="transform: translate3d(0, {scrollY * -0.6}px, 0)"
  />
  <img
    src="/design/blob-violet.svg"
    alt=""
    class="bg-blob blob-2"
    style="transform: translate3d(0, {scrollY * -0.45}px, 0)"
  />
  <img
    src="/design/blob-pink.svg"
    alt=""
    class="bg-blob blob-3"
    style="transform: translate3d(0, {scrollY * -0.3}px, 0)"
  />
</div>

<!-- Cursor glow + trail -->
<div
  class="cursor-glow trail trail-3"
  style="transform: translate3d({cursorX}px, {cursorY}px, 0)"
  aria-hidden="true"
></div>
<div
  class="cursor-glow trail trail-2"
  style="transform: translate3d({cursorX}px, {cursorY}px, 0)"
  aria-hidden="true"
></div>
<div
  class="cursor-glow"
  style="transform: translate3d({cursorX}px, {cursorY}px, 0)"
  aria-hidden="true"
></div>

<!-- ── NAV ── -->
<nav class:scrolled={navScrolled} aria-label="Main">
  <a href="#hero" class="logo" aria-label="Carlos Ledesma">
    <img src="/design/logo-mark.svg" alt="" class="logo-image" />
  </a>
  <button
    class="menu-toggle"
    onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
    aria-label="Toggle menu"
    aria-expanded={mobileMenuOpen}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
      {#if mobileMenuOpen}
        <path d="M18 6 6 18M6 6l12 12" />
      {:else}
        <path d="M4 7h16M4 17h16" />
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
            onclick={() => (mobileMenuOpen = false)}>{link.label}</a
          >
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
            }}>{loc.toUpperCase()}</button
          >
        {/each}
      </div>
      <a
        href="/{data.lang}/cv"
        class="nav-cv"
        title={t.nav.cvTitle}
        onclick={() => (mobileMenuOpen = false)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>
        {t.nav.cvLabel}
      </a>
      <a
        href="mailto:{CONTACT.email}"
        class="nav-cta magnetic"
        onclick={() => (mobileMenuOpen = false)}>{t.nav.ctaContact} <span class="arrow">→</span></a
      >
    </div>
  </div>
</nav>

<!-- ── HERO ── -->
<section id="hero" class="hero" data-accent="cyan">
  <div class="hero-content">
    <p class="eyebrow fade-in">
      <span class="eyebrow-rule"></span>
      <span class="pulse-dot"></span>
      {t.hero.badge} · MADRID
    </p>
    <h1 class="hero-name fade-in">
      <span class="name-line">Carlos</span>
      <span class="name-line gradient-text">Ledesma.</span>
    </h1>
    <p class="hero-role fade-in">
      <span class="role-tag">§</span>
      <span class="typewriter">{typewriterText}</span>
      <span class="cursor-blink">▍</span>
    </p>
    <p class="hero-subtitle fade-in">
      {t.hero.subtitleLine1}<br />
      {t.hero.subtitleLine2}
    </p>
    <div class="hero-actions fade-in">
      <a href="#projects" class="btn btn-primary magnetic">
        <span>{t.hero.viewProjects}</span>
        <span class="arrow">→</span>
      </a>
      <a href="mailto:{CONTACT.email}" class="btn btn-secondary magnetic"
        >{t.hero.letsTalk}</a
      >
      <a href="/{data.lang}/cv" class="btn btn-ghost magnetic">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
        {t.hero.printableCv}
      </a>
    </div>
    <div class="hero-stats fade-in">
      <div class="stat">
        <span class="stat-num">13<span class="unit">+</span></span>
        <span class="stat-lbl">{t.hero.stats.yearsLabel}</span>
      </div>
      <div class="stat">
        <span class="stat-num">2</span>
        <span class="stat-lbl">{t.hero.stats.continentsLabel}</span>
      </div>
      <div class="stat">
        <span class="stat-num">108</span>
        <span class="stat-lbl">{t.hero.stats.projectsLabel}</span>
      </div>
      <div class="stat">
        <span class="stat-num">∞</span>
        <span class="stat-lbl">{t.hero.stats.bugsLabel}</span>
      </div>
      <div class="stat">
        <span class="stat-num mono">99.98<span class="unit">%</span></span>
        <span class="stat-lbl">{t.hero.stats.uptimeLabel}</span>
      </div>
    </div>
  </div>
  <div class="scroll-hint" aria-hidden="true">
    <span class="mono">scroll ↓</span>
    <div class="scroll-line"></div>
  </div>
</section>

<!-- ── ABOUT ── -->
<section id="about" class="about" data-accent="cyan">
  <div class="container">
    <div class="about-grid">
      <div class="about-visual fade-in">
        <div class="avatar-wrapper">
          <div class="avatar-ring"></div>
          <div class="avatar-ring ring-2"></div>
          <div class="avatar">
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
          <div class="avatar-badge mono">full-stack · tech lead</div>
        </div>
        <div class="about-tags">
          {#each t.about.tags as tag}
            <span class="tech-tag mono">{tag}</span>
          {/each}
        </div>
      </div>
      <div class="about-text fade-in">
        <p class="eyebrow"><span class="eyebrow-rule"></span>{t.about.label}</p>
        <h2>
          {t.about.titlePrefix}<span class="gradient-text"
            >{t.about.titleHighlight}</span
          >
        </h2>
        {#each t.about.paragraphs as p}
          <p class="prose">{@html p}</p>
        {/each}
        <div class="about-links">
          <a href="mailto:{CONTACT.email}" class="about-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
            {CONTACT.email}
          </a>
          <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" class="about-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            GitHub
          </a>
          <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" class="about-link">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ── STRENGTHS ── -->
<section id="strengths" class="strengths" data-accent="violet">
  <div class="container">
    <div class="section-head fade-in">
      <div>
        <p class="eyebrow"><span class="eyebrow-rule"></span>{t.strengths.label}</p>
        <h2>
          {t.strengths.titlePrefix}<span class="gradient-text"
            >{t.strengths.titleHighlight}</span
          >
        </h2>
      </div>
      <p class="section-sub">{t.strengths.subtitle}</p>
    </div>
    <div class="strengths-grid">
      {#each t.strengths.items as s, i}
        <div class="strength-card fade-in" style="transition-delay: {i * 80}ms">
          <span class="card-num mono">§ {String(i + 1).padStart(2, "0")}</span>
          <div class="strength-icon">{@html strengthIcons[i] ?? strengthIcons[0]}</div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ── SKILLS ── -->
<section id="skills" class="skills-section" data-accent="violet">
  <div class="container">
    <div class="section-head fade-in">
      <div>
        <p class="eyebrow"><span class="eyebrow-rule"></span>{t.skills.label}</p>
        <h2>
          {t.skills.titlePrefix}<span class="gradient-text"
            >{t.skills.titleHighlight}</span
          >
        </h2>
      </div>
      <p class="section-sub">{t.skills.subtitle}</p>
    </div>

    <div class="radar-layout fade-in">
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

          <!-- Grid rings -->
          {#each radarRings as pts, ri}
            <polygon points={pts} class="radar-ring" style="opacity: {0.10 + ri * 0.05}"/>
          {/each}

          <!-- Ring labels -->
          <text x={RADAR.cx} y={RADAR.cy - RADAR.r * 0.25 - 5} class="radar-ring-lbl" text-anchor="middle">25%</text>
          <text x={RADAR.cx} y={RADAR.cy - RADAR.r * 0.50 - 5} class="radar-ring-lbl" text-anchor="middle">50%</text>
          <text x={RADAR.cx} y={RADAR.cy - RADAR.r * 0.75 - 5} class="radar-ring-lbl" text-anchor="middle">75%</text>

          <!-- Axis lines -->
          {#each radarAxes as ax, i}
            <line
              x1={RADAR.cx} y1={RADAR.cy} x2={ax.x} y2={ax.y}
              class="radar-axis"
              class:is-hovered={hoveredSkillIdx === i}
            />
          {/each}

          <!-- Data polygon (animated group) -->
          <g class="radar-data-group">
            <polygon points={radarDataPoly} class="radar-fill"/>
            <polygon points={radarDataPoly} class="radar-stroke" filter="url(#stroke-glow)"/>
          </g>

          <!-- Data dots -->
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

          <!-- Axis labels -->
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

          <!-- Center label -->
          <text x={RADAR.cx} y={RADAR.cy - 9} class="radar-center-name" text-anchor="middle" dominant-baseline="middle">{t.skills.totalLabel}</text>
          <text x={RADAR.cx} y={RADAR.cy + 10} class="radar-center-sub" text-anchor="middle" dominant-baseline="middle">100%</text>
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

    <div class="extra-skills fade-in">
      <span class="eyebrow"><span class="eyebrow-rule"></span>Also in the toolkit</span>
      <div class="extra-tags">
        {#each ["Git", "CI/CD", "WebSockets", "REST", "GraphQL", "gRPC", "Rust", "Go", "Linux", "Vercel", "n8n", "Cloudflare", "Vitest", "Playwright", "crewAI", "Linear", "Figma", "TDD & SDD", "Agile/Scrum"] as tag}
          <span class="extra-tag mono">{tag}</span>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- ── PROJECTS ── -->
<section id="projects" class="projects-section" data-accent="pink">
  <div class="container">
    <div class="section-head fade-in">
      <div>
        <p class="eyebrow"><span class="eyebrow-rule"></span>{t.projects.label}</p>
        <h2>
          {t.projects.titlePrefix}<span class="gradient-text"
            >{t.projects.titleHighlight}</span
          >
        </h2>
      </div>
    </div>
    <div class="projects-grid">
      {#each projects as project, i}
        <a
          class="project-card fade-in"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          data-accent={project.accent}
          style="transition-delay: {i * 90}ms"
        >
          <div class="project-topline mono">
            <span>CASE · {project.num}</span>
            <span>{project.year}</span>
          </div>
          <div class="project-icon">{@html projectIcons[i] ?? projectIcons[0]}</div>
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

<!-- ── EXPERIENCE ── -->
<section id="experience" class="experience-section" data-accent="cyan">
  <div class="container">
    <div class="section-head fade-in">
      <div>
        <p class="eyebrow"><span class="eyebrow-rule"></span>{t.experience.label}</p>
        <h2>
          {t.experience.titlePrefix}<span class="gradient-text"
            >{t.experience.titleHighlight}</span
          >
        </h2>
      </div>
      <p class="section-sub">{t.experience.subtitle}</p>
    </div>
    <ol class="exp-list">
      {#each t.experience.items as item, i}
        <li
          class="exp-row fade-in"
          style="transition-delay: {i * 90}ms"
        >
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
          <span class="exp-idx mono">§ {String(t.experience.items.length - i).padStart(2, "0")}</span>
        </li>
      {/each}
    </ol>
  </div>
</section>

<!-- ── BLOG ── -->
<section id="blog" class="blog-section" data-accent="violet">
  <div class="container">
    <div class="section-head fade-in">
      <div>
        <p class="eyebrow"><span class="eyebrow-rule"></span>{t.blog.label}</p>
        <h2>
          {t.blog.titlePrefix}<span class="gradient-text"
            >{t.blog.titleHighlight}</span
          >
        </h2>
      </div>
      <p class="section-sub">{t.blog.subtitle}</p>
    </div>

    {#if postsLoading}
      <div class="blog-state fade-in">
        <div class="blog-spinner"></div>
        <span class="mono">{t.blog.loading}</span>
      </div>
    {:else if posts.length === 0}
      <div class="blog-state fade-in">
        <svg class="blog-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>
        <p class="mono">{t.blog.empty}</p>
      </div>
    {:else}
      <div class="blog-grid">
        {#each posts as post, i}
          <a
            href="/{data.lang}/blog/{post.id}"
            class="blog-card fade-in"
            style="transition-delay: {i * 70}ms"
          >
            <div class="blog-meta">
              <time class="blog-date mono">{formatDate(post.date)}</time>
              <span class="blog-id mono">#{post.id}</span>
            </div>
            <h3 class="blog-title">{post.title}</h3>
            <div class="blog-body">
              <p>{@html renderMarkdown(post.content)}</p>
            </div>
            <span class="blog-read-more mono">{t.blog.readMore}</span>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- ── CONTACT ── -->
<section id="contact" class="contact-section" data-accent="yellow">
  <div class="container">
    <div class="contact-inner fade-in">
      <p class="eyebrow"><span class="eyebrow-rule"></span>{t.contact.label}</p>
      <h2 class="contact-title">
        {t.contact.titlePrefix}<span class="contact-highlight"
          >{t.contact.titleHighlight}</span
        >
      </h2>
      <p class="contact-sub">{t.contact.subtitle}</p>
      <a href="mailto:{CONTACT.email}" class="btn btn-yellow magnetic contact-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
        {t.contact.sendEmail}
        <span class="arrow">→</span>
      </a>
      <div class="contact-socials">
        <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" class="social-link magnetic">GitHub ↗</a>
        <span class="social-sep">·</span>
        <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" class="social-link magnetic">LinkedIn ↗</a>
        <span class="social-sep">·</span>
        <a href={CONTACT.twitter} target="_blank" rel="noopener noreferrer" class="social-link magnetic">Twitter / X ↗</a>
      </div>
    </div>
  </div>
</section>

<!-- ── FOOTER ── -->
<footer class="site-footer">
  <div class="container footer-inner">
    <p class="mono">{t.footer.copyright} ♥ {t.footer.tech} <strong>Svelte 5</strong></p>
    <p class="mono footer-meta">Obsidian · neon · craft · Madrid, ES</p>
  </div>
</footer>

<style>
  /* ══ RESET / HELPERS ══ */
  :global(section) { position: relative; }
  :global(:root) {
    --accent-on: var(--neon-cyan);
    --accent-glow: var(--glow-cyan);
  }

  /* Per-section accent rotation */
  :global(section[data-accent="cyan"])   { --accent-on: var(--neon-cyan);   --accent-glow: var(--glow-cyan);   }
  :global(section[data-accent="violet"]) { --accent-on: var(--neon-violet); --accent-glow: var(--glow-violet); }
  :global(section[data-accent="pink"])   { --accent-on: var(--neon-pink);   --accent-glow: var(--glow-pink);   }
  :global(section[data-accent="yellow"]) { --accent-on: var(--neon-yellow); --accent-glow: var(--glow-yellow); }

  .container {
    max-width: var(--container-lg);
    margin: 0 auto;
    padding: 0 var(--gutter);
    position: relative;
  }

  section {
    padding: var(--space-10) 0;
    position: relative;
    z-index: 1;
  }
  @media (max-width: 720px) {
    section { padding: var(--space-8) 0; }
  }

  /* ══ Parallax background ══ */
  .bg-layers {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .bg-dotgrid {
    position: absolute;
    inset: -40%;
    background-image: url('/design/dot-grid.svg');
    background-size: 44px 44px;
    opacity: 0.25;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 78%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 78%);
    will-change: transform;
  }
  .bg-blob {
    position: absolute;
    width: 62vw;
    height: 62vw;
    max-width: 900px;
    max-height: 900px;
    opacity: 0.22;
    filter: blur(90px) saturate(1.2);
    will-change: transform;
    user-select: none;
  }
  .blob-1 { top: -18%; left: -14%; animation: drift1 18s var(--ease-in-out) infinite alternate; }
  .blob-2 { top: 38%;  right: -20%; animation: drift2 22s var(--ease-in-out) infinite alternate; }
  .blob-3 { bottom: -18%; left: 24%; animation: drift3 26s var(--ease-in-out) infinite alternate; opacity: 0.16; }
  @keyframes drift1 { from { transform: translate3d(0,0,0) scale(1) rotate(0deg); } to { transform: translate3d(4vw,3vw,0) scale(1.14) rotate(9deg); } }
  @keyframes drift2 { from { transform: translate3d(0,0,0) scale(1) rotate(0deg); } to { transform: translate3d(-5vw,-3vw,0) scale(1.1) rotate(-11deg); } }
  @keyframes drift3 { from { transform: translate3d(0,0,0) scale(1) rotate(0deg); } to { transform: translate3d(-3vw,4vw,0) scale(1.18) rotate(-6deg); } }

  /* ══ Cursor glow ══ */
  .cursor-glow {
    position: fixed;
    top: 0; left: 0;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 245, 212, 0.10), transparent 60%);
    pointer-events: none;
    z-index: 1;
    margin: -200px 0 0 -200px;
    mix-blend-mode: screen;
    transition:
      transform 120ms var(--ease-out-quart),
      opacity 300ms var(--ease-out-quart);
    will-change: transform;
  }
  .cursor-glow.trail {
    /* Softer echoes that lag behind the main glow to form a trail */
    mix-blend-mode: screen;
  }
  .cursor-glow.trail-2 {
    width: 320px; height: 320px;
    margin: -160px 0 0 -160px;
    background: radial-gradient(circle, rgba(155, 93, 229, 0.08), transparent 60%);
    transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .cursor-glow.trail-3 {
    width: 220px; height: 220px;
    margin: -110px 0 0 -110px;
    background: radial-gradient(circle, rgba(241, 91, 181, 0.07), transparent 60%);
    transition: transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    .cursor-glow { transition: none; }
  }

  /* ══ Shared primitives ══ */
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: var(--font-mono);
    font-size: var(--fs-micro);
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    color: var(--fg-subtle);
    font-weight: 500;
    margin: 0 0 var(--space-4);
  }
  .eyebrow-rule {
    width: 28px; height: 1px;
    background: var(--accent-on);
    box-shadow: 0 0 8px var(--accent-on);
    flex-shrink: 0;
  }
  .pulse-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--neon-cyan);
    box-shadow: 0 0 12px var(--neon-cyan);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100% { opacity:1; transform:scale(1);} 50% { opacity:0.5; transform:scale(1.35);} }

  .mono { font-family: var(--font-mono); }

  .gradient-text {
    background: linear-gradient(92deg, var(--neon-cyan), var(--neon-violet) 50%, var(--neon-pink));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .section-head {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: var(--space-6);
    align-items: end;
    margin-bottom: var(--space-8);
  }
  .section-head h2 {
    font-family: var(--font-display);
    font-size: var(--fs-display-lg);
    font-weight: 500;
    letter-spacing: var(--tracking-tight);
    line-height: 1;
    margin: 0;
  }
  .section-sub {
    font-size: var(--fs-body-lg);
    color: var(--fg-muted);
    line-height: var(--lh-loose);
    max-width: 46ch;
    margin: 0;
  }
  @media (max-width: 820px) {
    .section-head { grid-template-columns: 1fr; gap: var(--space-4); align-items: start; }
  }

  /* ── Fade-in ── */
  :global(.fade-in) {
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity 720ms var(--ease-out-expo),
      transform 720ms var(--ease-out-expo);
  }
  :global(.fade-in.visible) { opacity: 1; transform: translateY(0); }

  /* ══ NAV ══ */
  nav {
    position: fixed;
    top: 14px;
    left: 0;
    right: 0;
    z-index: var(--z-sticky);
    display: flex;
    align-items: center;
    gap: var(--space-5);
    padding: 10px 18px;
    margin: 0 auto;
    width: calc(100% - 28px);
    max-width: var(--container-lg);
    border-radius: var(--radius-pill);
    border: 1px solid var(--border);
    background: rgba(10, 10, 15, 0.55);
    backdrop-filter: blur(14px) saturate(1.2);
    -webkit-backdrop-filter: blur(14px) saturate(1.2);
    transition:
      background var(--dur-base) var(--ease-out-quart),
      border-color var(--dur-base) var(--ease-out-quart),
      box-shadow var(--dur-base) var(--ease-out-quart);
  }
  nav.scrolled {
    background: rgba(10, 10, 15, 0.78);
    border-color: var(--border-strong);
    box-shadow: var(--shadow-sm);
  }
  .logo {
    display: inline-flex;
    align-items: center;
    color: var(--fg);
    padding: 2px 6px;
  }
  .logo-image {
    width: 34px;
    height: 34px;
    display: block;
    filter: drop-shadow(0 0 10px rgba(0, 245, 212, 0.18));
  }
  .nav-content {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    margin-left: auto;
  }
  nav ul {
    display: flex;
    gap: 4px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  nav ul a {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--fg-muted);
    padding: 8px 12px;
    border-radius: var(--radius-pill);
    transition:
      color var(--dur-base) var(--ease-out-quart),
      background var(--dur-base) var(--ease-out-quart);
    position: relative;
  }
  nav ul a:hover { color: var(--neon-cyan); }
  nav ul a.active {
    color: var(--neon-cyan);
    background: rgba(0, 245, 212, 0.08);
  }
  .nav-actions { display: flex; align-items: center; gap: 8px; }
  .lang-switch {
    display: inline-flex;
    padding: 2px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-pill);
    background: transparent;
  }
  .lang-btn {
    background: transparent;
    border: 0;
    cursor: pointer;
    padding: 4px 10px;
    font-family: var(--font-mono);
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.1em;
    color: var(--fg-subtle);
    border-radius: var(--radius-pill);
    transition:
      background var(--dur-fast) var(--ease-out-quart),
      color var(--dur-fast) var(--ease-out-quart);
  }
  .lang-btn:hover { color: var(--fg); }
  .lang-btn.active {
    background: var(--neon-cyan);
    color: var(--fg-inverse);
  }
  .nav-cv {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 12px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-pill);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--fg);
    transition:
      border-color var(--dur-base) var(--ease-out-quart),
      color var(--dur-base) var(--ease-out-quart);
  }
  .nav-cv svg { width: 13px; height: 13px; }
  .nav-cv:hover { border-color: var(--neon-cyan); color: var(--neon-cyan); }
  .nav-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 16px;
    border-radius: var(--radius-pill);
    background: var(--neon-cyan);
    color: var(--fg-inverse);
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 13px;
    letter-spacing: -0.005em;
    box-shadow: var(--glow-cyan);
    transition: transform var(--dur-base) var(--ease-spring);
  }
  .nav-cta:hover { transform: translateY(-1px); }
  .nav-cta .arrow { transition: transform var(--dur-base) var(--ease-spring); }
  .nav-cta:hover .arrow { transform: translateX(3px); }

  .menu-toggle {
    display: none;
    background: transparent;
    border: 0;
    color: var(--fg);
    cursor: pointer;
    padding: 6px;
    margin-left: auto;
  }
  .menu-toggle svg { width: 22px; height: 22px; }

  @media (max-width: 860px) {
    .menu-toggle { display: inline-flex; }
    .nav-content {
      position: absolute;
      top: calc(100% + 10px);
      left: 0;
      right: 0;
      flex-direction: column;
      gap: var(--space-4);
      padding: var(--space-5);
      background: rgba(10, 10, 15, 0.96);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      transition:
        max-height var(--dur-slow) var(--ease-out-expo),
        opacity var(--dur-base) var(--ease-out-quart);
    }
    .nav-content.open {
      max-height: 620px;
      opacity: 1;
      pointer-events: auto;
    }
    nav ul {
      flex-direction: column;
      width: 100%;
    }
    nav ul a {
      display: block;
      font-size: 13px;
      padding: 10px 14px;
    }
    .nav-actions {
      width: 100%;
      flex-wrap: wrap;
      justify-content: flex-start;
    }
  }

  /* ══ HERO ══ */
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
  .hero-name .name-line {
    display: block;
  }
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
  .stat + .stat {
    border-left: 1px solid var(--border);
  }
  @media (max-width: 720px) {
    .hero-stats {
      grid-template-columns: repeat(3, 1fr);
      row-gap: var(--space-5);
    }
    /* Remove left border on first item of each row */
    .stat:nth-child(4) {
      border-left: none;
    }
  }
  @media (max-width: 420px) {
    .hero-stats {
      grid-template-columns: repeat(2, 1fr);
    }
    .stat:nth-child(3) {
      border-left: none;
    }
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
    /* fixed height so all labels start at the same vertical position */
    min-height: clamp(2.2rem, 2.8vw + 1rem, 3.4rem);
    font-variant-numeric: tabular-nums;
  }
  .stat-num.mono {
    font-family: var(--font-mono);
    font-size: clamp(1.7rem, 2.1vw + 0.9rem, 2.6rem);
    letter-spacing: -0.02em;
    /* same min-height as regular so labels align */
    min-height: clamp(2.2rem, 2.8vw + 1rem, 3.4rem);
  }
  .stat-num.mono .unit {
    font-size: 0.7em;
    margin-left: 0.05em;
  }
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
    color: var(--fg-whisper);
  }
  .scroll-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, transparent, var(--neon-cyan));
    animation: scrollLine 2s var(--ease-in-out) infinite;
  }
  @keyframes scrollLine { 0% { transform: scaleY(0); transform-origin: top; } 50% { transform: scaleY(1); transform-origin: top; } 51% { transform-origin: bottom; } 100% { transform: scaleY(0); transform-origin: bottom; } }

  /* ══ BUTTONS ══ */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 22px;
    border-radius: var(--radius-pill);
    border: 1px solid transparent;
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 14px;
    letter-spacing: -0.005em;
    cursor: pointer;
    transition:
      transform var(--dur-base) var(--ease-spring),
      box-shadow var(--dur-base) var(--ease-out-quart),
      background var(--dur-base) var(--ease-out-quart),
      color var(--dur-base) var(--ease-out-quart),
      border-color var(--dur-base) var(--ease-out-quart);
  }
  .btn svg { width: 16px; height: 16px; }
  .btn .arrow { transition: transform var(--dur-base) var(--ease-spring); display: inline-block; }
  .btn:hover .arrow { transform: translateX(4px); }
  .btn:active { transform: scale(0.96); }

  .btn-primary {
    background: var(--neon-cyan);
    color: var(--fg-inverse);
    box-shadow: var(--glow-cyan);
  }
  .btn-primary:hover { transform: translateY(-2px); }

  .btn-secondary {
    background: transparent;
    color: var(--fg);
    border-color: var(--border-strong);
  }
  .btn-secondary:hover {
    border-color: var(--neon-cyan);
    color: var(--neon-cyan);
    transform: translateY(-1px);
  }

  .btn-ghost {
    background: transparent;
    color: var(--fg-muted);
    padding: 11px 16px;
  }
  .btn-ghost:hover { color: var(--neon-cyan); }

  .btn-yellow {
    background: var(--neon-yellow);
    color: var(--fg-inverse);
    box-shadow: var(--glow-yellow);
  }
  .btn-yellow:hover { transform: translateY(-2px); }

  /* ══ ABOUT ══ */
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
    box-shadow: 0 0 20px rgba(0, 245, 212, 0.25);
  }
  .about-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
  }
  .tech-tag {
    padding: 5px 11px;
    font-size: 10.5px;
    letter-spacing: 0.08em;
    color: var(--fg-muted);
    border: 1px solid var(--border);
    border-radius: var(--radius-pill);
    background: rgba(255, 255, 255, 0.02);
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
  .about-link svg { width: 16px; height: 16px; }
  .about-link:hover { color: var(--neon-cyan); }

  /* ══ STRENGTHS ══ */
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
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    transition:
      transform var(--dur-slow) var(--ease-out-expo),
      border-color var(--dur-slow) var(--ease-out-quart),
      box-shadow var(--dur-slow) var(--ease-out-expo);
    overflow: hidden;
  }
  .strength-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
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
    background: rgba(155, 93, 229, 0.08);
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

  /* ══ SKILLS — polar radar chart ══ */
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

  /* Grid rings */
  .radar-ring {
    fill: none;
    stroke: rgba(255, 255, 255, 0.12);
    stroke-width: 1;
  }
  .radar-ring-lbl {
    font-family: var(--font-mono);
    font-size: 9px;
    fill: rgba(255, 255, 255, 0.22);
    letter-spacing: 0.06em;
    pointer-events: none;
    user-select: none;
  }

  /* Axis lines */
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

  /* Data polygon — animated via parent .visible */
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

  /* Data dots */
  .radar-dot {
    transition: r var(--dur-fast) var(--ease-spring);
    cursor: default;
  }
  .radar-dot--cyan   { fill: var(--neon-cyan);   }
  .radar-dot--violet { fill: var(--neon-violet); }
  .radar-dot--pink   { fill: var(--neon-pink);   }
  .radar-dot--yellow { fill: var(--neon-yellow); }

  /* Axis labels */
  .radar-lbl {
    font-family: var(--font-mono);
    font-size: 11.5px;
    fill: var(--fg-subtle);
    letter-spacing: 0.025em;
    transition: fill var(--dur-base), font-size var(--dur-fast);
    cursor: default;
  }
  .radar-lbl--hovered { fill: var(--fg); font-size: 12px; }

  /* Center labels */
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

  /* Legend */
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
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--li-accent);
    box-shadow: 0 0 7px var(--li-accent);
    flex-shrink: 0;
    transition: box-shadow var(--dur-base);
  }
  .radar-legend-item.is-hovered .rli-dot { box-shadow: 0 0 14px var(--li-accent); }
  .rli-idx {
    font-size: 10px;
    color: var(--fg-whisper);
    letter-spacing: 0.1em;
  }
  .rli-name {
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--fg);
    letter-spacing: -0.01em;
  }
  .rli-cat {
    font-size: 10px;
    color: var(--fg-whisper);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .rli-pct {
    font-size: 11px;
    color: var(--li-accent);
    font-weight: 500;
    letter-spacing: 0.06em;
  }

  .extra-skills {
    padding-top: var(--space-6);
    border-top: 1px solid var(--border);
    display: grid;
    gap: var(--space-4);
  }
  .extra-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
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

  /* ══ PROJECTS ══ */
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
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(92deg, var(--neon-cyan), var(--neon-violet), var(--neon-pink));
    opacity: 0.4;
    transition: opacity var(--dur-base) var(--ease-out-quart);
  }
  .project-card::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(1000px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.04), transparent 40%);
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--dur-base) var(--ease-out-quart);
  }
  .project-card:hover {
    transform: translateY(-4px);
    border-color: transparent;
    box-shadow: var(--shadow-lg), var(--accent-glow);
  }
  .project-card:hover::before { opacity: 1; }
  .project-card:hover::after { opacity: 1; }
  .project-topline {
    display: flex;
    justify-content: space-between;
    font-size: 10.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--fg-whisper);
  }
  .project-icon {
    width: 44px;
    height: 44px;
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
  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
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

  /* ══ EXPERIENCE ══ */
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
    transition:
      padding var(--dur-base) var(--ease-out-quart),
      background var(--dur-base) var(--ease-out-quart);
  }
  .exp-row:hover {
    padding-left: 10px;
    background: linear-gradient(90deg, rgba(0, 245, 212, 0.05), transparent 60%);
  }
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
  .exp-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .exp-tag {
    padding: 4px 10px;
    font-size: 10px;
    letter-spacing: 0.08em;
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

  /* ══ BLOG ══ */
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-4);
  }
  .blog-card {
    padding: var(--space-6);
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    color: inherit;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    transition:
      transform var(--dur-base) var(--ease-out-quart),
      border-color var(--dur-base) var(--ease-out-quart),
      box-shadow var(--dur-base) var(--ease-out-quart);
  }
  .blog-card:hover {
    transform: translateY(-3px);
    border-color: transparent;
    box-shadow: var(--shadow-md), var(--glow-violet);
  }
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
  .blog-body :global(a) { color: var(--neon-violet); }
  .blog-body :global(code) { font-family: var(--font-mono); font-size: 12px; color: var(--neon-cyan); }
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
    width: 18px;
    height: 18px;
    border: 2px solid var(--border-strong);
    border-top-color: var(--neon-violet);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ══ CONTACT ══ */
  .contact-section { padding-bottom: var(--space-10); }
  .contact-inner {
    position: relative;
    padding: var(--space-9) var(--space-6);
    background: var(--bg-elevated);
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-2xl);
    text-align: center;
    overflow: hidden;
  }
  .contact-inner::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 0%, rgba(254, 228, 64, 0.10), transparent 55%),
      radial-gradient(ellipse at 100% 100%, rgba(241, 91, 181, 0.10), transparent 55%);
    pointer-events: none;
  }
  .contact-inner > * { position: relative; }
  .contact-inner .eyebrow { justify-content: center; }
  .contact-title {
    font-family: var(--font-display);
    font-size: var(--fs-display-xl);
    font-weight: 500;
    letter-spacing: var(--tracking-tight);
    line-height: 1;
    margin: var(--space-3) 0 var(--space-5);
    max-width: 22ch;
    margin-inline: auto;
    text-wrap: balance;
  }
  .contact-highlight {
    background: linear-gradient(92deg, var(--neon-yellow), var(--neon-pink));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .contact-sub {
    font-size: var(--fs-body-lg);
    color: var(--fg-muted);
    max-width: 56ch;
    margin: 0 auto var(--space-7);
    line-height: var(--lh-loose);
  }
  .contact-btn { margin-bottom: var(--space-6); }
  .contact-socials {
    display: flex;
    justify-content: center;
    gap: var(--space-3);
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.08em;
    color: var(--fg-subtle);
    flex-wrap: wrap;
  }
  .social-link {
    color: var(--fg-muted);
    transition: color var(--dur-base) var(--ease-out-quart);
  }
  .social-link:hover { color: var(--neon-yellow); }
  .social-sep { color: var(--fg-whisper); }

  /* ══ FOOTER ══ */
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

  /* ══ Reduced motion ══ */
  @media (prefers-reduced-motion: reduce) {
    .bg-blob { animation: none !important; }
    .pulse-dot, .cursor-blink, .scroll-line, .avatar-ring { animation: none !important; }
  }
</style>
