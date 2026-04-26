<script lang="ts">
  import { onMount } from 'svelte';
  import { is8Bit } from '$lib/stores';

  const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let keyIndex = 0;

  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[keyIndex]) {
        keyIndex++;
        if (keyIndex === KONAMI_CODE.length) {
          $is8Bit = !$is8Bit; // toggle
          keyIndex = 0;
        }
      } else {
        keyIndex = 0;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });
</script>

<svelte:head>
  {#if $is8Bit}
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
  {/if}
</svelte:head>
