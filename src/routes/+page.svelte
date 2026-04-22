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
  <div class="loader"></div>
  <span>Loading...</span>
</div>

<style>
  .redirect {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    align-items: center;
    justify-content: center;
    background:
      radial-gradient(circle at 20% 20%, rgba(188, 19, 254, 0.16), transparent 26%),
      radial-gradient(circle at 80% 18%, rgba(0, 238, 252, 0.14), transparent 22%),
      linear-gradient(180deg, #0a0a0d 0%, #131315 100%);
    color: #d4c0d7;
    font-family: 'Space Grotesk', 'Segoe UI', sans-serif;
    font-size: 0.82rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .loader {
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.12);
    border-top-color: #00eefc;
    border-right-color: #bc13fe;
    box-shadow: 0 0 24px rgba(188, 19, 254, 0.18);
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
