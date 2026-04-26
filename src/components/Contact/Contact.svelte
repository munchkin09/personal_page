<script lang="ts">
  import { dictionaries, type Locale } from '$lib/i18n';
  import { CONTACT } from '$lib/constants';
  import { observeSection, fadeIn, magnetic } from '$lib/actions';

  let { lang }: { lang: Locale } = $props();
  const t = $derived(dictionaries[lang].contact);
</script>

<section id="contact" class="contact-section" data-accent="yellow" use:observeSection>
  <div class="container">
    <div class="contact-inner" use:fadeIn>
      <p class="eyebrow"><span class="eyebrow-rule"></span>{t.label}</p>
      <h2 class="contact-title">
        {t.titlePrefix}<span class="contact-highlight">{t.titleHighlight}</span>
      </h2>
      <p class="contact-sub">{t.subtitle}</p>

      <a href="mailto:{CONTACT.email}" class="btn btn-yellow contact-btn" use:magnetic>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
        {t.sendEmail}
        <span class="arrow">→</span>
      </a>

      <div class="contact-socials">
        <a href={CONTACT.github}   target="_blank" rel="noopener noreferrer" class="social-link" use:magnetic>GitHub ↗</a>
        <span class="social-sep">·</span>
        <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" class="social-link" use:magnetic>LinkedIn ↗</a>
        <span class="social-sep">·</span>
        <a href={CONTACT.twitter}  target="_blank" rel="noopener noreferrer" class="social-link" use:magnetic>Twitter / X ↗</a>
      </div>
    </div>
  </div>
</section>

<style>
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
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 0%, color-mix(in srgb, var(--neon-yellow) 10%, transparent), transparent 55%),
      radial-gradient(ellipse at 100% 100%, color-mix(in srgb, var(--neon-pink) 10%, transparent), transparent 55%);
    pointer-events: none;
  }

  .contact-inner > * { position: relative; }
  .contact-inner :global(.eyebrow) { justify-content: center; }

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
</style>
