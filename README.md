# carloslc.is-a.dev — Personal Portfolio & Blog

Personal website and CV of [Carlos Ledesma Castejón](https://carloslc.is-a.dev) — Tech Lead, Quality Engineering Architect, and Senior Full-Stack Developer based in Madrid.

## Stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit 2 + Svelte 5 (runes) |
| Language | TypeScript |
| Build / bundler | Vite 8 |
| Deployment | Cloudflare Pages (static adapter) |
| Blog backend | Cloudflare Worker + KV |
| Blog CMS | Telegram bot (webhook → Worker) |
| AI / agent layer | WebMCP (`navigator.modelContext` + webmcp.dev) |

## Features

- **Bilingual (ES / EN)** — i18n handled entirely client-side via typed dictionaries; locale persisted in `localStorage`. URL scheme: `/{lang}/` (`/es/`, `/en/`).
- **Printable CV** — `/[lang]/cv` renders a print-optimised resume with a toolbar (back, print, PDF).
- **Blog** — Posts stored in Cloudflare KV as JSON. Published by sending a Markdown message from Telegram. Rendered client-side with `marked`.
- **WebMCP tools** — The site exposes structured tools (`get_profile`, `get_experience`, `get_skills`, `navigate_to_section`…) to AI agents via the [WebMCP](https://webmcp.dev/) protocol. Also ships `llms.txt` and JSON-LD Schema.org markup for agent discoverability.
- **No cookies, no tracking** — Zero analytics scripts, zero third-party cookies. GDPR-compliant without a consent banner.

## Project structure

```
src/
  components/       # UI sections (Hero, About, Skills, Experience, Blog, …)
  lib/
    i18n/           # en.ts + es.ts typed dictionaries
    WebMCPTools.svelte  # MCP tool registration + easter egg
    actions.ts      # Svelte actions (fadeIn, magnetic, observeSection)
    stores.ts
  routes/
    [lang=lang]/    # Localised pages (/, /cv, /blog/[id])
  app.css / app.html
worker/
  src/index.ts      # Cloudflare Worker: GET /api/posts + POST /telegram webhook
  wrangler.toml
static/
  llms.txt          # AI agent discovery file
  robots.txt
```

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # Static output → build/
npm run preview    # Preview the build locally
npm run check      # svelte-check + TypeScript
```

## Blog Worker (Cloudflare)

The blog is powered by a Cloudflare Worker that:
1. Serves `GET /api/posts` from a KV namespace.
2. Accepts `POST /telegram` webhook calls — parses the Markdown message, stores the post in KV.

### Deploy the worker

```bash
cd worker
npm install

# Create the KV namespace and paste the id into wrangler.toml
wrangler kv namespace create POSTS

# Set secrets
wrangler secret put TELEGRAM_TOKEN
wrangler secret put TELEGRAM_SECRET   # random string, used to verify the webhook
wrangler secret put ALLOWED_CHAT_ID   # your Telegram chat_id

wrangler deploy
```

### Register the Telegram webhook

```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<worker-url>/telegram?secret=<SECRET>
```

### Publishing a post

Send a message to your bot from your allowed account. Format:

```
Post title here

Body content in **Markdown**.
Tags: tag1, tag2
```

Commands: `/posts` (list), `/delete <id>` (remove), `/help`.

## WebMCP

The site registers MCP tools at runtime via `src/lib/WebMCPTools.svelte`:

- `get_profile` — Professional profile, contact info, summary
- `get_experience` — Full work history
- `get_skills` — Skills grouped by category
- `get_education` — Education history
- `navigate_to_section` — Scroll to a section (`hero`, `skills`, `blog`)
- `navigate_to_page` — Navigate to a route (`/cv`, `/blog`)

There is also a hidden easter egg tool — only discoverable by AI agents.

## Deployment (Cloudflare Pages)

Push to `main`. Cloudflare Pages runs `npm run build` and serves the `build/` directory. The SPA fallback (`index.html`) handles client-side routing for unmatched paths.
