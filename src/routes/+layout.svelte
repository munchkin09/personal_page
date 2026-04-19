<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

<svelte:head>
  <title>Carlos Ledesma · Software Engineer</title>
  <meta name="description" content="Carlos Ledesma — Senior Software Engineer. Building elegant solutions with modern web technologies." />
</svelte:head>

{@render children()}
