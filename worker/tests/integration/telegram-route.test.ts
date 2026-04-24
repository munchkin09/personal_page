import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import worker from '../../src/index';
import { makeEnv, TEST_SECRET, TEST_CHAT_ID } from '../helpers/env-mock';
import { telegramPost, telegramMessage, telegramDocument, ALLOWED_CHAT_ID_NUM } from '../helpers/request-builder';

const mockFetch = vi.fn();

function mockTelegramOk() {
  mockFetch.mockResolvedValue(new Response('{"ok":true}', { status: 200 }));
}

function capturedSendMessageText(): string {
  const calls = mockFetch.mock.calls;
  const sendCall = calls.find(([url]) =>
    typeof url === 'string' && url.includes('sendMessage'),
  );
  if (!sendCall) throw new Error('sendMessage never called');
  const body = JSON.parse(sendCall[1].body as string);
  return body.text as string;
}

function sendMessageWasCalled(): boolean {
  return mockFetch.mock.calls.some(([url]) =>
    typeof url === 'string' && url.includes('sendMessage'),
  );
}

beforeEach(() => {
  vi.stubGlobal('fetch', mockFetch);
  mockFetch.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Auth ──────────────────────────────────────────────────────────────────────

describe('POST /telegram — autenticación', () => {
  it('sin ?secret= retorna 401', async () => {
    const req = new Request('https://worker.test/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const res = await worker.fetch(req, makeEnv() as any);
    expect(res.status).toBe(401);
    expect(await res.text()).toBe('Unauthorized');
  });

  it('?secret= incorrecto retorna 401', async () => {
    const res = await worker.fetch(telegramPost({}, 'wrong-secret'), makeEnv() as any);
    expect(res.status).toBe(401);
  });

  it('secret correcto no retorna 401', async () => {
    mockTelegramOk();
    const res = await worker.fetch(
      telegramPost(telegramMessage('/help')),
      makeEnv() as any,
    );
    expect(res.status).not.toBe(401);
  });

  it('chatId no autorizado llama a sendMessage con ⛔ y retorna 200', async () => {
    mockTelegramOk();
    const body = telegramMessage('hola', 999999);
    const res = await worker.fetch(telegramPost(body), makeEnv() as any);
    expect(res.status).toBe(200);
    expect(sendMessageWasCalled()).toBe(true);
    expect(capturedSendMessageText()).toContain('⛔');
  });

  it('mensaje sin text ni document retorna 200 ok sin llamar sendMessage', async () => {
    const body = { message: { chat: { id: ALLOWED_CHAT_ID_NUM } } };
    const res = await worker.fetch(telegramPost(body), makeEnv() as any);
    expect(res.status).toBe(200);
    expect(sendMessageWasCalled()).toBe(false);
  });
});

// ── /help y /start ────────────────────────────────────────────────────────────

describe('/help y /start', () => {
  it('/help envía mensaje con "Blog CMS", /posts y /delete', async () => {
    mockTelegramOk();
    await worker.fetch(telegramPost(telegramMessage('/help')), makeEnv() as any);
    const text = capturedSendMessageText();
    expect(text).toContain('Blog CMS');
    expect(text).toContain('/posts');
    expect(text).toContain('/delete');
  });

  it('/start devuelve el mismo texto que /help', async () => {
    mockTelegramOk();
    await worker.fetch(telegramPost(telegramMessage('/help')), makeEnv() as any);
    const helpText = capturedSendMessageText();
    mockFetch.mockReset();
    mockTelegramOk();
    await worker.fetch(telegramPost(telegramMessage('/start')), makeEnv() as any);
    const startText = capturedSendMessageText();
    expect(startText).toBe(helpText);
  });
});

// ── /posts ────────────────────────────────────────────────────────────────────

describe('/posts', () => {
  it('lista posts con títulos e IDs en backticks', async () => {
    mockTelegramOk();
    const posts = [
      { id: 'id1', title: 'Post Uno', content: 'c', date: '2025-01-01T00:00:00.000Z' },
      { id: 'id2', title: 'Post Dos', content: 'c', date: '2025-01-02T00:00:00.000Z' },
    ];
    const env = makeEnv({ posts: JSON.stringify(posts) });
    await worker.fetch(telegramPost(telegramMessage('/posts')), env as any);
    const text = capturedSendMessageText();
    expect(text).toContain('Post Uno');
    expect(text).toContain('`id1`');
    expect(text).toContain('Post Dos');
    expect(text).toContain('`id2`');
  });

  it('KV vacío responde "No hay posts aún."', async () => {
    mockTelegramOk();
    await worker.fetch(telegramPost(telegramMessage('/posts')), makeEnv() as any);
    expect(capturedSendMessageText()).toBe('No hay posts aún.');
  });
});

// ── /delete ───────────────────────────────────────────────────────────────────

describe('/delete', () => {
  it('elimina post existente del KV', async () => {
    mockTelegramOk();
    const posts = [
      { id: 'abc', title: 'A Borrar', content: 'c', date: '2025-01-01T00:00:00.000Z' },
      { id: 'xyz', title: 'Queda', content: 'c', date: '2025-01-02T00:00:00.000Z' },
    ];
    const env = makeEnv({ posts: JSON.stringify(posts) });
    await worker.fetch(telegramPost(telegramMessage('/delete abc')), env as any);
    const remaining = JSON.parse((await env.POSTS.get('posts'))!);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe('xyz');
  });

  it('mensaje de confirmación contiene 🗑️ y el id', async () => {
    mockTelegramOk();
    const posts = [{ id: 'abc', title: 'A Borrar', content: 'c', date: '2025-01-01T00:00:00.000Z' }];
    const env = makeEnv({ posts: JSON.stringify(posts) });
    await worker.fetch(telegramPost(telegramMessage('/delete abc')), env as any);
    const text = capturedSendMessageText();
    expect(text).toContain('🗑️');
    expect(text).toContain('abc');
  });

  it('post no encontrado: KV sin cambios y mensaje con ❌', async () => {
    mockTelegramOk();
    const posts = [{ id: 'real', title: 'Real', content: 'c', date: '2025-01-01T00:00:00.000Z' }];
    const env = makeEnv({ posts: JSON.stringify(posts) });
    await worker.fetch(telegramPost(telegramMessage('/delete nope')), env as any);
    const remaining = JSON.parse((await env.POSTS.get('posts'))!);
    expect(remaining).toHaveLength(1);
    expect(capturedSendMessageText()).toContain('❌');
  });

  it('id con espacios extra se trimea correctamente', async () => {
    mockTelegramOk();
    const posts = [{ id: 'abc', title: 'A Borrar', content: 'c', date: '2025-01-01T00:00:00.000Z' }];
    const env = makeEnv({ posts: JSON.stringify(posts) });
    await worker.fetch(telegramPost(telegramMessage('/delete  abc ')), env as any);
    const remaining = JSON.parse((await env.POSTS.get('posts'))!);
    expect(remaining).toHaveLength(0);
  });
});

// ── Crear post desde texto ────────────────────────────────────────────────────

describe('crear post desde texto', () => {
  it('primera línea = título, resto = contenido', async () => {
    mockTelegramOk();
    const env = makeEnv();
    await worker.fetch(
      telegramPost(telegramMessage('Mi Título\n\nContenido del post.')),
      env as any,
    );
    const posts = JSON.parse((await env.POSTS.get('posts'))!);
    expect(posts[0].title).toBe('Mi Título');
    expect(posts[0].content).toContain('Contenido del post.');
  });

  it('post.id es string base36 válido', async () => {
    mockTelegramOk();
    const env = makeEnv();
    await worker.fetch(
      telegramPost(telegramMessage('Título\n\nContenido.')),
      env as any,
    );
    const posts = JSON.parse((await env.POSTS.get('posts'))!);
    expect(posts[0].id).toMatch(/^[0-9a-z]+$/);
  });

  it('nuevo post se inserta al inicio (unshift)', async () => {
    mockTelegramOk();
    const existing = [{ id: 'old', title: 'Viejo', content: 'c', date: '2025-01-01T00:00:00.000Z' }];
    const env = makeEnv({ posts: JSON.stringify(existing) });
    await worker.fetch(
      telegramPost(telegramMessage('Nuevo\n\nContenido nuevo.')),
      env as any,
    );
    const posts = JSON.parse((await env.POSTS.get('posts'))!);
    expect(posts).toHaveLength(2);
    expect(posts[0].title).toBe('Nuevo');
  });

  it('sin front matter la fecha es ISO válida cercana al momento actual', async () => {
    mockTelegramOk();
    const before = Date.now();
    const env = makeEnv();
    await worker.fetch(
      telegramPost(telegramMessage('Título\n\nContenido.')),
      env as any,
    );
    const after = Date.now();
    const posts = JSON.parse((await env.POSTS.get('posts'))!);
    const postTime = new Date(posts[0].date).getTime();
    expect(postTime).toBeGreaterThanOrEqual(before);
    expect(postTime).toBeLessThanOrEqual(after + 100);
  });

  it('solo título sin contenido envía error y no actualiza KV', async () => {
    mockTelegramOk();
    const env = makeEnv();
    await worker.fetch(
      telegramPost(telegramMessage('Solo un título')),
      env as any,
    );
    expect(capturedSendMessageText()).toContain('❌ Necesito título');
    expect(await env.POSTS.get('posts')).toBeNull();
  });

  it('primera línea vacía (sin título) envía error', async () => {
    mockTelegramOk();
    const env = makeEnv();
    await worker.fetch(
      telegramPost(telegramMessage('\nSolo contenido sin título')),
      env as any,
    );
    expect(capturedSendMessageText()).toContain('❌ Necesito título');
  });

  it('mensaje de éxito contiene ✅, título e ID:', async () => {
    mockTelegramOk();
    const env = makeEnv();
    await worker.fetch(
      telegramPost(telegramMessage('Mi Post\n\nContenido válido.')),
      env as any,
    );
    const text = capturedSendMessageText();
    expect(text).toContain('✅');
    expect(text).toContain('Mi Post');
    expect(text).toContain('ID:');
  });
});

// ── Crear post desde archivo .md ──────────────────────────────────────────────

describe('crear post desde archivo .md', () => {
  function mockFileUpload(content: string) {
    mockFetch
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ result: { file_path: 'documents/post.md' } }), { status: 200 }),
      )
      .mockResolvedValueOnce(new Response(content, { status: 200 }))
      .mockResolvedValueOnce(new Response('{"ok":true}', { status: 200 }));
  }

  it('archivo no-.md (image/png) es rechazado con ❌', async () => {
    mockTelegramOk();
    const body = telegramDocument({ file_id: 'fid', mime_type: 'image/png', file_name: 'photo.png' });
    await worker.fetch(telegramPost(body), makeEnv() as any);
    expect(capturedSendMessageText()).toContain('❌ Solo acepto archivos');
  });

  it('archivo con mime_type text/markdown es aceptado', async () => {
    const env = makeEnv();
    mockFileUpload('Mi Título\n\nContenido del archivo.');
    const body = telegramDocument({ file_id: 'fid', mime_type: 'text/markdown' });
    await worker.fetch(telegramPost(body), env as any);
    const posts = JSON.parse((await env.POSTS.get('posts'))!);
    expect(posts).toHaveLength(1);
  });

  it('archivo .md por nombre aunque mime_type sea genérico', async () => {
    const env = makeEnv();
    mockFileUpload('Título Archivo\n\nContenido.');
    const body = telegramDocument({
      file_id: 'fid',
      mime_type: 'application/octet-stream',
      file_name: 'post.md',
    });
    await worker.fetch(telegramPost(body), env as any);
    const posts = JSON.parse((await env.POSTS.get('posts'))!);
    expect(posts).toHaveLength(1);
  });

  it('fallo en getFile envía error con ❌', async () => {
    mockFetch.mockResolvedValueOnce(new Response('{"ok":false}', { status: 400 }));
    mockFetch.mockResolvedValueOnce(new Response('{"ok":true}', { status: 200 }));
    const body = telegramDocument({ file_id: 'fid', mime_type: 'text/markdown' });
    await worker.fetch(telegramPost(body), makeEnv() as any);
    expect(capturedSendMessageText()).toContain('❌ No pude obtener el archivo de Telegram.');
  });

  it('fallo en descarga del archivo envía error con ❌', async () => {
    mockFetch
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ result: { file_path: 'documents/post.md' } }), { status: 200 }),
      )
      .mockResolvedValueOnce(new Response('', { status: 500 }))
      .mockResolvedValueOnce(new Response('{"ok":true}', { status: 200 }));
    const body = telegramDocument({ file_id: 'fid', mime_type: 'text/markdown' });
    await worker.fetch(telegramPost(body), makeEnv() as any);
    expect(capturedSendMessageText()).toContain('❌ No pude descargar el archivo.');
  });

  it('front matter del archivo: title y content correctos', async () => {
    const env = makeEnv();
    mockFileUpload('---\ntitle: FM Title\n---\nBody del archivo.');
    const body = telegramDocument({ file_id: 'fid', mime_type: 'text/markdown' });
    await worker.fetch(telegramPost(body), env as any);
    const posts = JSON.parse((await env.POSTS.get('posts'))!);
    expect(posts[0].title).toBe('FM Title');
    expect(posts[0].content).toBe('Body del archivo.');
  });

  it('front matter: date en el archivo se usa como post.date', async () => {
    const env = makeEnv();
    mockFileUpload('---\ntitle: T\ndate: 2024-06-01\n---\nBody.');
    const body = telegramDocument({ file_id: 'fid', mime_type: 'text/markdown' });
    await worker.fetch(telegramPost(body), env as any);
    const posts = JSON.parse((await env.POSTS.get('posts'))!);
    expect(new Date(posts[0].date).toISOString()).toBe('2024-06-01T00:00:00.000Z');
  });

  it('front matter: tags se asignan correctamente', async () => {
    const env = makeEnv();
    mockFileUpload('---\ntitle: T\ntags: [go, testing]\n---\nBody.');
    const body = telegramDocument({ file_id: 'fid', mime_type: 'text/markdown' });
    await worker.fetch(telegramPost(body), env as any);
    const posts = JSON.parse((await env.POSTS.get('posts'))!);
    expect(posts[0].tags).toEqual(['go', 'testing']);
  });
});
