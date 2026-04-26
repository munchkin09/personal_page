export interface Env {
  POSTS: KVNamespace;
  TELEGRAM_TOKEN: string;   // wrangler secret put TELEGRAM_TOKEN
  TELEGRAM_SECRET: string;  // wrangler secret put TELEGRAM_SECRET  (cadena aleatoria tuya)
  ALLOWED_CHAT_ID: string;  // wrangler secret put ALLOWED_CHAT_ID  (tu chat_id de Telegram)
}

interface Post {
  id: string;
  title: string;
  content: string;
  date: string;
  tags?: string[];
  slug?: string;
  description?: string;
}

interface FrontMatter {
  title?: string;
  date?: string;
  tags?: string[];
  slug?: string;
  description?: string;
}

export function parseFrontMatter(raw: string): { fm: FrontMatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { fm: {}, body: raw };

  const lines = match[1].split('\n');
  const body = match[2].trim();
  const fm: FrontMatter = {};

  let i = 0;
  while (i < lines.length) {
    const colonIdx = lines[i].indexOf(':');
    if (colonIdx === -1) { i++; continue; }

    const key = lines[i].slice(0, colonIdx).trim();
    const value = lines[i].slice(colonIdx + 1).trim();

    // multiline list (tags:\n  - foo\n  - bar)
    if (!value && i + 1 < lines.length && lines[i + 1].trimStart().startsWith('- ')) {
      const items: string[] = [];
      i++;
      while (i < lines.length && lines[i].trimStart().startsWith('- ')) {
        items.push(lines[i].trimStart().slice(2).trim().replace(/^['"]|['"]$/g, ''));
        i++;
      }
      if (key === 'tags') fm.tags = items;
      continue;
    }

    const clean = value.replace(/^['"]|['"]$/g, '');
    if (key === 'title') fm.title = clean;
    else if (key === 'date') fm.date = clean;
    else if (key === 'slug') fm.slug = clean;
    else if (key === 'description') fm.description = clean;
    else if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
      fm.tags = value.slice(1, -1).split(',').map(t => t.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    }
    i++;
  }

  return { fm, body };
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    // ── GET /api/posts ────────────────────────────────────────────────────────
    if (url.pathname === '/api/posts' && request.method === 'GET') {
      const raw = await env.POSTS.get('posts');
      const posts: Post[] = raw ? JSON.parse(raw) : [];
      return new Response(JSON.stringify(posts), { headers: CORS });
    }

    // ── GET /api/rss.xml ──────────────────────────────────────────────────────
    if (url.pathname === '/api/rss.xml' && request.method === 'GET') {
      const raw = await env.POSTS.get('posts');
      const posts: Post[] = raw ? JSON.parse(raw) : [];

      const SITE = 'https://carloslc.is-a.dev';
      const escapeXml = (s: string) =>
        s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

      const items = posts.map(p => {
        const slug = p.slug ?? p.id;
        const link = `${SITE}/es/blog/${p.id}`;
        const pubDate = new Date(p.date).toUTCString();
        const desc = p.description ? escapeXml(p.description) : escapeXml(p.content.slice(0, 200).replace(/[#*`_[\]]/g, '') + '…');
        return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${desc}</description>${p.tags?.length ? `\n      <category>${p.tags.map(escapeXml).join('</category>\n      <category>')}</category>` : ''}
    </item>`;
      }).join('\n');

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Carlos Ledesma · Blog</title>
    <link>${SITE}/es</link>
    <description>Ideas, reflexiones y aprendizajes del día a día sobre QA, IA y desarrollo.</description>
    <language>es</language>
    <atom:link href="${SITE}/api/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${posts.length ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

      return new Response(xml, {
        headers: {
          'Content-Type': 'application/rss+xml; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=600',
        },
      });
    }

    // ── POST /telegram  (webhook de Telegram) ─────────────────────────────────
    if (url.pathname === '/telegram' && request.method === 'POST') {
      // Verificar el secreto en el header X-Telegram-Bot-Api-Secret-Token
      // (nunca en query string: quedaría expuesto en logs de acceso y CDN)
      if (request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== env.TELEGRAM_SECRET) {
        return new Response('Unauthorized', { status: 401 });
      }

      const body = await request.json() as any;
      const message = body?.message;
      // Accept text messages and document (file) messages; ignore anything else
      if (!message?.text && !message?.document) return new Response('ok');

      const chatId: number = message.chat.id;

      // Solo aceptar mensajes del propietario
      if (String(chatId) !== env.ALLOWED_CHAT_ID) {
        await telegram(env.TELEGRAM_TOKEN, chatId, '⛔ No autorizado.');
        return new Response('ok');
      }

      const text: string = (message.text ?? '').trim();

      // ── Comandos ──────────────────────────────────────────────────────────
      if (text === '/help' || text === '/start') {
        await telegram(env.TELEGRAM_TOKEN, chatId,
          '📝 *Blog CMS* — Comandos disponibles:\n\n' +
          '• Envía un mensaje con *primera línea = título* y el resto = contenido.\n\n' +
          '`/posts` — lista todos los posts\n' +
          '`/delete <id>` — elimina un post\n' +
          '`/help` — muestra esta ayuda\n\n' +
          '*Formato Markdown soportado:* **negrita**, *cursiva*, `código`, [link](url)'
        );
        return new Response('ok');
      }

      if (text === '/posts') {
        const raw = await env.POSTS.get('posts');
        const posts: Post[] = raw ? JSON.parse(raw) : [];
        const list = posts.length
          ? posts.map(p => `• ${p.title} — \`${p.id}\``).join('\n')
          : 'No hay posts aún.';
        await telegram(env.TELEGRAM_TOKEN, chatId, list);
        return new Response('ok');
      }

      if (text.startsWith('/delete ')) {
        const id = text.slice(8).trim();
        const raw = await env.POSTS.get('posts');
        const posts: Post[] = raw ? JSON.parse(raw) : [];
        const before = posts.length;
        const filtered = posts.filter(p => p.id !== id);
        if (filtered.length === before) {
          await telegram(env.TELEGRAM_TOKEN, chatId, `❌ No encontré el post con ID \`${id}\`.`);
        } else {
          await env.POSTS.put('posts', JSON.stringify(filtered));
          await telegram(env.TELEGRAM_TOKEN, chatId, `🗑️ Post \`${id}\` eliminado.`);
        }
        return new Response('ok');
      }

      // ── Nuevo post ────────────────────────────────────────────────────────
      // Normaliza el texto que se va a parsear (puede venir de texto libre o de un MD)
      let postText = text;

      // Detectar documento adjunto (archivo .md enviado por Telegram)
      if (!postText && message.document) {
        const doc = message.document;
        const mime: string = doc.mime_type ?? '';
        const fileName: string = doc.file_name ?? '';
        const isMd = mime === 'text/plain' || mime === 'text/markdown' || fileName.endsWith('.md');

        if (!isMd) {
          await telegram(env.TELEGRAM_TOKEN, chatId,
            '❌ Solo acepto archivos `.md`. Envía un archivo Markdown.'
          );
          return new Response('ok');
        }

        const filePath = await getFilePath(env.TELEGRAM_TOKEN, doc.file_id);
        if (!filePath) {
          await telegram(env.TELEGRAM_TOKEN, chatId, '❌ No pude obtener el archivo de Telegram.');
          return new Response('ok');
        }

        const fileRes = await fetch(
          `https://api.telegram.org/file/bot${env.TELEGRAM_TOKEN}/${filePath}`
        );
        if (!fileRes.ok) {
          await telegram(env.TELEGRAM_TOKEN, chatId, '❌ No pude descargar el archivo.');
          return new Response('ok');
        }

        postText = (await fileRes.text()).trim();
      }

      const { fm, body: mdBody } = parseFrontMatter(postText);

      const bodyLines = mdBody.split('\n');
      const title = fm.title ?? bodyLines[0].replace(/^#+\s*/, '').trim();
      const content = fm.title ? mdBody.trim() : bodyLines.slice(1).join('\n').trim();

      if (!title || !content) {
        await telegram(env.TELEGRAM_TOKEN, chatId,
          '❌ Necesito título *y* contenido.\n\nFormato:\n```\nTítulo del post\n\nContenido del post...\n```'
        );
        return new Response('ok');
      }

      const parsedDate = fm.date ? new Date(fm.date) : null;
      const date = parsedDate && !isNaN(parsedDate.getTime())
        ? parsedDate.toISOString()
        : new Date().toISOString();

      const raw = await env.POSTS.get('posts');
      const posts: Post[] = raw ? JSON.parse(raw) : [];

      const post: Post = {
        id: Date.now().toString(36),
        title,
        content,
        date,
        ...(fm.tags?.length && { tags: fm.tags }),
        ...(fm.slug && { slug: fm.slug }),
        ...(fm.description && { description: fm.description }),
      };

      posts.unshift(post);
      await env.POSTS.put('posts', JSON.stringify(posts));

      await telegram(env.TELEGRAM_TOKEN, chatId,
        `✅ Post publicado!\n\n*${title}*\nID: \`${post.id}\``
      );
      return new Response('ok');
    }

    return new Response('Not found', { status: 404 });
  },
};

async function getFilePath(token: string, fileId: string): Promise<string | null> {
  const res = await fetch(
    `https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`
  );
  if (!res.ok) return null;
  const data = await res.json() as any;
  return data?.result?.file_path ?? null;
}

async function telegram(token: string, chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
}
