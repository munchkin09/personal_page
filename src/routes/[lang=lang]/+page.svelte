<script lang="ts">
  import { dictionaries, type Locale } from "$lib/i18n";
  import BackgroundLayers from "$components/BackgroundLayers/BackgroundLayers.svelte";
  import NavBar from "$components/NavBar/NavBar.svelte";
  import Hero from "$components/Hero/Hero.svelte";
  import About from "$components/About/About.svelte";
  import Strengths from "$components/Strengths/Strengths.svelte";
  import Skills from "$components/Skills/Skills.svelte";
  import Projects from "$components/Projects/Projects.svelte";
  import Experience from "$components/Experience/Experience.svelte";
  import Blog from "$components/Blog/Blog.svelte";
  import Contact from "$components/Contact/Contact.svelte";
  import Footer from "$components/Footer/Footer.svelte";

  let { data }: { data: { lang: Locale } } = $props();
  const t = $derived(dictionaries[data.lang].meta);
</script>

<svelte:head>
  <title>{t.homeTitle}</title>
  <meta name="description" content={t.homeDescription} />
  <meta property="og:title" content={t.homeTitle} />
  <meta property="og:description" content={t.homeDescription} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://carloslc.is-a.dev/{data.lang}" />
  <meta
    property="og:image"
    content="https://picsum.photos/seed/munchkin/1200/630"
  />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={t.homeTitle} />
  <meta name="twitter:description" content={t.homeDescription} />
  <meta
    name="twitter:image"
    content="https://picsum.photos/seed/munchkin/1200/630"
  />
</svelte:head>

<BackgroundLayers />
<NavBar lang={data.lang} />
<Hero lang={data.lang} />
<About lang={data.lang} />
<Strengths lang={data.lang} />
<Skills lang={data.lang} />
<Projects lang={data.lang} />
<Experience lang={data.lang} />
<Blog lang={data.lang} />
<Contact lang={data.lang} />
<Footer lang={data.lang} />
