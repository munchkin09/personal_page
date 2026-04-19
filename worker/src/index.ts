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

    // ── POST /telegram  (webhook de Telegram) ─────────────────────────────────
    if (url.pathname === '/telegram' && request.method === 'POST') {
      // Verificar el secreto en el query string
      if (url.searchParams.get('secret') !== env.TELEGRAM_SECRET) {
        return new Response('Unauthorized', { status: 401 });
      }

      const body = await request.json() as any;
      const message = body?.message;
      if (!message?.text) return new Response('ok');

      const chatId: number = message.chat.id;

      // Solo aceptar mensajes del propietario
      if (String(chatId) !== env.ALLOWED_CHAT_ID) {
        await telegram(env.TELEGRAM_TOKEN, chatId, '⛔ No autorizado.');
        return new Response('ok');
      }

      const text: string = message.text.trim();

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
      const lines = text.split('\n');
      const title = lines[0].replace(/^#+\s*/, '').trim();
      const content = lines.slice(1).join('\n').trim();

      if (!content) {
        await telegram(env.TELEGRAM_TOKEN, chatId,
          '❌ Necesito título *y* contenido.\n\nFormato:\n```\nTítulo del post\n\nContenido del post...\n```'
        );
        return new Response('ok');
      }

      const raw = await env.POSTS.get('posts');
      const posts: Post[] = raw ? JSON.parse(raw) : [];

      const post: Post = {
        id: Date.now().toString(36),
        title,
        content,
        date: new Date().toISOString(),
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

async function telegram(token: string, chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
}
