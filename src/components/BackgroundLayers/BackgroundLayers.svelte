<script lang="ts">
  import { onMount } from 'svelte';

  let scrollY = $state(0);
  let cursorX = $state(-100);
  let cursorY = $state(-100);

  onMount(() => {
    const onScroll = () => { scrollY = window.scrollY; };
    const onMouseMove = (e: MouseEvent) => { cursorX = e.clientX; cursorY = e.clientY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousemove', onMouseMove);
    };
  });
</script>

<!-- Parallax background layers -->
<div class="bg-layers" aria-hidden="true">
  <div class="bg-dotgrid" style="transform: translate3d(0, {scrollY * -0.3}px, 0)"></div>
  <img src="/design/blob-cyan.svg"   alt="" class="bg-blob blob-1" style="transform: translate3d(0, {scrollY * -0.6}px, 0)" />
  <img src="/design/blob-violet.svg" alt="" class="bg-blob blob-2" style="transform: translate3d(0, {scrollY * -0.45}px, 0)" />
  <img src="/design/blob-pink.svg"   alt="" class="bg-blob blob-3" style="transform: translate3d(0, {scrollY * -0.3}px, 0)" />
</div>

<!-- Cursor glow trail -->
<div class="cursor-glow trail trail-3" style="transform: translate3d({cursorX}px, {cursorY}px, 0)" aria-hidden="true"></div>
<div class="cursor-glow trail trail-2" style="transform: translate3d({cursorX}px, {cursorY}px, 0)" aria-hidden="true"></div>
<div class="cursor-glow"              style="transform: translate3d({cursorX}px, {cursorY}px, 0)" aria-hidden="true"></div>

<style>
  .bg-layers {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .bg-dotgrid {
    position: absolute;
    inset: -40%;
    background-image: url('/design/dot-grid.svg');
    background-size: 44px 44px;
    opacity: 0.25;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 78%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 78%);
    will-change: transform;
  }

  .bg-blob {
    position: absolute;
    width: 62vw;
    height: 62vw;
    max-width: 900px;
    max-height: 900px;
    opacity: 0.22;
    filter: blur(90px) saturate(1.2);
    will-change: transform;
    user-select: none;
  }

  .blob-1 { top: -18%; left: -14%; animation: drift1 18s var(--ease-in-out) infinite alternate; }
  .blob-2 { top: 38%;  right: -20%; animation: drift2 22s var(--ease-in-out) infinite alternate; }
  .blob-3 { bottom: -18%; left: 24%; animation: drift3 26s var(--ease-in-out) infinite alternate; opacity: 0.16; }

  @keyframes drift1 { from { transform: translate3d(0,0,0) scale(1) rotate(0deg); } to { transform: translate3d(4vw,3vw,0) scale(1.14) rotate(9deg); } }
  @keyframes drift2 { from { transform: translate3d(0,0,0) scale(1) rotate(0deg); } to { transform: translate3d(-5vw,-3vw,0) scale(1.1) rotate(-11deg); } }
  @keyframes drift3 { from { transform: translate3d(0,0,0) scale(1) rotate(0deg); } to { transform: translate3d(-3vw,4vw,0) scale(1.18) rotate(-6deg); } }

  .cursor-glow {
    position: fixed;
    top: 0; left: 0;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, color-mix(in srgb, var(--neon-cyan) 10%, transparent), transparent 60%);
    pointer-events: none;
    z-index: 1;
    margin: -200px 0 0 -200px;
    mix-blend-mode: screen;
    transition: transform 120ms var(--ease-out-quart), opacity 300ms var(--ease-out-quart);
    will-change: transform;
  }

  .cursor-glow.trail { mix-blend-mode: screen; }

  .cursor-glow.trail-2 {
    width: 320px; height: 320px;
    margin: -160px 0 0 -160px;
    background: radial-gradient(circle, color-mix(in srgb, var(--neon-violet) 8%, transparent), transparent 60%);
    transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .cursor-glow.trail-3 {
    width: 220px; height: 220px;
    margin: -110px 0 0 -110px;
    background: radial-gradient(circle, color-mix(in srgb, var(--neon-pink) 7%, transparent), transparent 60%);
    transition: transform 560ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    .bg-blob { animation: none !important; }
    .cursor-glow { transition: none; }
  }
</style>
