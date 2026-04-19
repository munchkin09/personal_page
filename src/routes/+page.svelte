<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { detectLocale } from '$lib/i18n';

  onMount(() => {
    goto(`/${detectLocale()}`, { replaceState: true });
  });
</script>

<svelte:head>
  <title>Carlos Ledesma</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="redirect">
  <span>Loading…</span>
</div>

<style>
  .redirect {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #050510;
    color: #475569;
    font-family: Inter, system-ui, sans-serif;
    font-size: 0.9rem;
  }
</style>
