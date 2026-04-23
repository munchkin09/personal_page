<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { dictionaries, rememberLocale, swapLocaleInPath, SUPPORTED_LOCALES, type Locale } from '$lib/i18n';
  import { activeSection, theme } from '$lib/stores';
  import { magnetic } from '$lib/actions';

  let { lang }: { lang: Locale } = $props();
  const t = $derived(dictionaries[lang].nav);

  let mobileMenuOpen = $state(false);
  let navScrolled = $state(false);

  const navLinks = $derived([
    { id: 'about',      label: t.about },
    { id: 'strengths',  label: t.strengths },
    { id: 'skills',     label: t.skills },
    { id: 'projects',   label: t.projects },
    { id: 'experience', label: t.experience },
    { id: 'blog',       label: t.blog },
    { id: 'contact',    label: t.contact },
  ]);

  onMount(() => {
    const onScroll = () => { navScrolled = window.scrollY > 40; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  function switchLocale(next: Locale) {
    if (next === lang) return;
    rememberLocale(next);
    const target = swapLocaleInPath(window.location.pathname, next) + window.location.hash;
    goto(target);
  }

  const CONTACT_EMAIL = 'carlos.developer1983@gmail.com';
</script>

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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
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
            class:active={$activeSection === link.id}
            onclick={() => (mobileMenuOpen = false)}
          >{link.label}</a>
        </li>
      {/each}
    </ul>

    <div class="nav-actions">
      <div class="lang-switch" role="group" aria-label={t.langSwitchLabel}>
        {#each SUPPORTED_LOCALES as loc}
          <button
            type="button"
            class="lang-btn"
            class:active={lang === loc}
            aria-pressed={lang === loc}
            onclick={() => { switchLocale(loc); mobileMenuOpen = false; }}
          >{loc.toUpperCase()}</button>
        {/each}
      </div>

      <a
        href="/{lang}/cv"
        class="nav-cv"
        title={t.cvTitle}
        onclick={() => (mobileMenuOpen = false)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></svg>
        {t.cvLabel}
      </a>

      <button
        type="button"
        class="theme-toggle"
        onclick={() => theme.update(t => t === 'dark' ? 'light' : 'dark')}
        aria-label={$theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {#if $theme === 'dark'}
          <!-- sun -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
        {:else}
          <!-- moon -->
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        {/if}
      </button>

      <a href="mailto:{CONTACT_EMAIL}" class="nav-cta" use:magnetic onclick={() => (mobileMenuOpen = false)}>
        {t.ctaContact} <span class="arrow">→</span>
      </a>
    </div>
  </div>
</nav>

<style>
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

  .theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius-pill);
    color: var(--fg-muted);
    cursor: pointer;
    transition:
      color var(--dur-base) var(--ease-out-quart),
      border-color var(--dur-base) var(--ease-out-quart),
      background var(--dur-base) var(--ease-out-quart);
  }

  .theme-toggle :global(svg) { width: 14px; height: 14px; }
  .theme-toggle:hover { color: var(--neon-yellow); border-color: var(--neon-yellow); background: rgba(254, 228, 64, 0.06); }

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
  .lang-btn.active { background: var(--neon-cyan); color: var(--fg-inverse); }
  .lang-btn:focus-visible { outline-color: var(--neon-cyan); }

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

  .nav-cv :global(svg) { width: 13px; height: 13px; }
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

  .menu-toggle :global(svg) { width: 22px; height: 22px; }

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

    nav ul { flex-direction: column; width: 100%; }

    nav ul a {
      display: block;
      font-size: 13px;
      padding: 10px 14px;
    }

    .nav-actions { width: 100%; flex-wrap: wrap; justify-content: flex-start; }
  }
</style>
