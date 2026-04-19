# AGENTS.md

## Project overview

This repository is a personal portfolio website built with Svelte 5, TypeScript, and Vite.

Primary app entrypoint:
- `src/main.ts`
- `src/App.svelte`
- `src/app.css`

The repo currently uses a Vite + Svelte app structure, so the main build/run flow is based on Vite rather than SvelteKit server routes.

## Key commands

- `npm install` — install dependencies
- `npm run dev` — start the local development server
- `npm run build` — produce a production build
- `npm run preview` — preview the built app
- `npm run check` — run TypeScript + Svelte static checks

## Important conventions for AI agents

- Use Svelte 5 component patterns and syntax. The codebase already uses `script lang="ts"` and Svelte 5 reactive state patterns.
- Keep the site styling in `src/app.css` and prefer component-level scoped styles inside `.svelte` files.
- Avoid adding backend/server code: this is a static frontend portfolio site.
- Primary content and interactive UI lives in `src/App.svelte`.
- Prefer minimal, polished UX with CSS transitions and animations rather than heavy JS.

## Useful files

- `src/App.svelte` — main page structure and layout
- `src/main.ts` — application bootstrap
- `src/app.css` — global styling
- `public/` — static assets
- `package.json` — scripts and dependencies

## When to use this guide

Use this file for repo-level guidance when editing the personal site, improving styles, or changing the app structure.
