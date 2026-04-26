<script lang="ts">
  import { onMount } from 'svelte';
  import { cursorState } from '$lib/stores';

  let x = $state(0);
  let y = $state(0);
  let mouseX = $state(0);
  let mouseY = $state(0);
  
  let hidden = $state(true);

  onMount(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (hidden) hidden = false;
      
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .toggle-btn, .close-btn')) {
        $cursorState = 'pointer';
      } else if (target.closest('p, h1, h2, h3, h4, span, input, textarea')) {
        $cursorState = 'text';
      } else {
        $cursorState = 'default';
      }
    };

    const handleMouseLeave = () => { hidden = true; };
    const handleMouseEnter = () => { hidden = false; };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    // Physics loop for smooth follow
    let raf: number;
    const loop = () => {
      // Lerp (Linear interpolation)
      x += (mouseX - x) * 0.15;
      y += (mouseY - y) * 0.15;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(raf);
    };
  });
</script>

<div 
  class="custom-cursor" 
  class:hidden 
  class:pointer={$cursorState === 'pointer'}
  class:text={$cursorState === 'text'}
  style="transform: translate({x}px, {y}px)"
>
  <div class="cursor-dot"></div>
  <div class="cursor-ring"></div>
</div>

<style>
  @media (pointer: fine) {
    :global(*), :global(*:hover) {
      cursor: none !important;
    }
  }

  .custom-cursor {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 99999;
    will-change: transform;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    transition: opacity 0.3s;
  }

  /* Don't show on touch devices */
  @media (pointer: coarse) {
    .custom-cursor { display: none !important; }
  }

  .custom-cursor.hidden { opacity: 0; }

  .cursor-dot {
    position: absolute;
    width: 6px;
    height: 6px;
    background-color: var(--neon-cyan);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, background-color 0.2s;
  }

  .cursor-ring {
    position: absolute;
    width: 32px;
    height: 32px;
    border: 1px solid var(--neon-cyan);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, border-color 0.2s, background-color 0.2s;
  }

  /* Pointer state */
  .custom-cursor.pointer .cursor-dot {
    width: 0;
    height: 0;
  }
  .custom-cursor.pointer .cursor-ring {
    width: 44px;
    height: 44px;
    background-color: color-mix(in srgb, var(--neon-cyan) 15%, transparent);
    border-color: var(--neon-cyan-hi);
  }

  /* Text state */
  .custom-cursor.text .cursor-dot {
    width: 2px;
    height: 20px;
    border-radius: 0;
    background-color: var(--neon-violet);
  }
  .custom-cursor.text .cursor-ring {
    width: 0;
    height: 0;
    opacity: 0;
  }
</style>
