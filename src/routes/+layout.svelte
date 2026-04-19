<script lang="ts">
  import '../app.css';
  import WebMCPTools from '$lib/WebMCPTools.svelte';
  let { children } = $props();

  const personSchema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Carlos Ledesma Castejón',
    url: 'https://carloslc.is-a.dev',
    email: 'carlos.developer1983@gmail.com',
    jobTitle: 'Tech Lead · Quality & AI Solutions Architect · Senior Full-Stack Developer',
    worksFor: { '@type': 'Organization', name: 'NTT DATA' },
    address: { '@type': 'PostalAddress', addressLocality: 'Madrid', addressCountry: 'ES' },
    sameAs: ['https://linkedin.com/in/carlosledesmac', 'https://github.com/munchkin09'],
    knowsAbout: [
      'Artificial Intelligence', 'Large Language Models', 'QA Automation',
      'TypeScript', 'Python', 'Cloud Architecture', 'COBOL Modernisation',
      'Full-Stack Development', 'Software Quality Engineering',
    ],
    description:
      'Tech Lead and Software Architect with 13+ years of experience in QA, AI Strategy, and Full-Stack Engineering.',
  });
</script>

<svelte:head>
  <title>Carlos Ledesma · Software Engineer</title>
  <meta name="description" content="Carlos Ledesma — Tech Lead & Solution Architect. Specialised in QA, AI Strategy, and Full-Stack Engineering." />

  <!-- AI / agent discovery -->
  <link rel="llms-txt" href="/llms.txt" />
  <meta name="ai-content-declaration" content="/llms.txt" />

  <!-- JSON-LD: Person (Schema.org) — machine-readable identity for agents & search -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html `<script type="application/ld+json">${personSchema}<\/script>`}
</svelte:head>

{@render children()}
<WebMCPTools />
