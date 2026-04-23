<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { rememberLocale, type Locale } from '$lib/i18n';

  let { data, children }: { data: { lang: Locale }; children: any } = $props();

  $effect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = data.lang;
    }
  });

  onMount(() => {
    rememberLocale(data.lang);
  });

  const canonical = $derived(`https://carloslc.is-a.dev${$page.url.pathname}`);
  const altEs = $derived(`https://carloslc.is-a.dev${$page.url.pathname.replace(/^\/(es|en)/, '/es')}`);
  const altEn = $derived(`https://carloslc.is-a.dev${$page.url.pathname.replace(/^\/(es|en)/, '/en')}`);
</script>

<svelte:head>
  <link rel="canonical" href={canonical} />
  <link rel="alternate" hreflang="es" href={altEs} />
  <link rel="alternate" hreflang="en" href={altEn} />
  <link rel="alternate" hreflang="x-default" href={altEs} />
  <link rel="alternate" type="application/rss+xml" title="Carlos Ledesma · Blog RSS" href="https://blog-worker.carloslc.workers.dev/api/rss.xml" />
</svelte:head>

{@render children()}
