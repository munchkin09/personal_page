import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      fallback: 'index.html', // SPA mode: Cloudflare Pages sirve index.html para rutas no encontradas
    }),
    alias: {
      $components: 'src/components',
    },
    prerender: {
      // /api/* es servido por el Cloudflare Worker, no existe en el build estático.
      // Ignoramos los 404 de esas rutas durante el prerender.
      handleHttpError: ({ path, message }) => {
        if (path.startsWith('/api/')) return;
        throw new Error(message);
      },
    },
  },
};
