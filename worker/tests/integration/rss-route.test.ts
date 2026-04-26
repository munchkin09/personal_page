import { describe, it, expect } from 'vitest';
import worker from '../../src/index';
import { makeEnv } from '../helpers/env-mock';
import { getRequest } from '../helpers/request-builder';

const samplePost = (overrides = {}) => ({
  id: 'post1',
  title: 'Mi Post',
  content: 'Contenido del post de prueba.',
  date: '2025-06-01T00:00:00.000Z',
  ...overrides,
});

async function getRss(posts: object[] = []) {
  const env = posts.length
    ? makeEnv({ posts: JSON.stringify(posts) })
    : makeEnv();
  const res = await worker.fetch(getRequest('/api/rss.xml'), env as any);
  return { res, xml: await res.text() };
}

describe('GET /api/rss.xml', () => {
  it('KV vacío devuelve XML válido con <channel>', async () => {
    const { res, xml } = await getRss();
    expect(res.status).toBe(200);
    expect(xml).toContain('<?xml');
    expect(xml).toContain('<channel>');
    expect(xml).not.toContain('<item>');
  });

  it('Content-Type es application/rss+xml; charset=utf-8', async () => {
    const { res } = await getRss();
    expect(res.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');
  });

  it('Cache-Control es public, max-age=600', async () => {
    const { res } = await getRss();
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=600');
  });

  it('incluye header CORS', async () => {
    const { res } = await getRss();
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('título del post aparece en <title> del item', async () => {
    const { xml } = await getRss([samplePost({ title: 'Hola Mundo' })]);
    expect(xml).toContain('<title>Hola Mundo</title>');
  });

  it('link usa /es/blog/{id} con el id del post', async () => {
    const { xml } = await getRss([samplePost({ id: 'abc123' })]);
    expect(xml).toContain('https://carloslc.is-a.dev/es/blog/abc123');
  });

  it('link usa el id aunque exista slug', async () => {
    const { xml } = await getRss([samplePost({ id: 'myid', slug: 'mi-slug' })]);
    expect(xml).toContain('/es/blog/myid');
  });

  it('<pubDate> corresponde a post.date', async () => {
    const { xml } = await getRss([samplePost({ date: '2025-01-15T00:00:00.000Z' })]);
    const expectedDate = new Date('2025-01-15T00:00:00.000Z').toUTCString();
    expect(xml).toContain(`<pubDate>${expectedDate}</pubDate>`);
  });

  it('<description> usa post.description cuando existe', async () => {
    const { xml } = await getRss([samplePost({ description: 'Descripción explícita' })]);
    expect(xml).toContain('<description>Descripción explícita</description>');
  });

  it('<description> fallback son los primeros 200 chars del content con elipsis', async () => {
    const longContent = 'A'.repeat(250);
    const { xml } = await getRss([samplePost({ content: longContent, description: undefined })]);
    expect(xml).toContain('<description>' + 'A'.repeat(200) + '…</description>');
  });

  it('fallback de description elimina caracteres markdown', async () => {
    const { xml } = await getRss([samplePost({ content: '# Heading *bold* `code` _em_ [link](url)', description: undefined })]);
    const descMatch = xml.match(/<description>(.*?)<\/description>/s);
    expect(descMatch).not.toBeNull();
    const desc = descMatch![1];
    expect(desc).not.toMatch(/[#*`_\[\]]/);
  });

  it('título con caracteres especiales se escapa correctamente', async () => {
    const { xml } = await getRss([samplePost({ title: 'A & B <Test>' })]);
    expect(xml).toContain('A &amp; B &lt;Test&gt;');
  });

  it('description con caracteres especiales se escapa: &quot; y &apos;', async () => {
    const { xml } = await getRss([samplePost({ description: 'Say "hello" & \'bye\'' })]);
    expect(xml).toContain('Say &quot;hello&quot; &amp; &apos;bye&apos;');
  });

  it('tags generan elementos <category>', async () => {
    const { xml } = await getRss([samplePost({ tags: ['qa', 'testing'] })]);
    expect(xml).toContain('<category>qa</category>');
    expect(xml).toContain('<category>testing</category>');
  });

  it('post sin tags no genera <category>', async () => {
    const { xml } = await getRss([samplePost()]);
    expect(xml).not.toContain('<category>');
  });

  it('3 posts generan 3 elementos <item>', async () => {
    const posts = [
      samplePost({ id: 'a', title: 'Post 1' }),
      samplePost({ id: 'b', title: 'Post 2' }),
      samplePost({ id: 'c', title: 'Post 3' }),
    ];
    const { xml } = await getRss(posts);
    const count = (xml.match(/<item>/g) ?? []).length;
    expect(count).toBe(3);
  });

  it('lastBuildDate usa la fecha del primer post (el más reciente)', async () => {
    const posts = [
      samplePost({ id: 'new', date: '2025-12-01T00:00:00.000Z' }),
      samplePost({ id: 'old', date: '2025-01-01T00:00:00.000Z' }),
    ];
    const { xml } = await getRss(posts);
    const expectedDate = new Date('2025-12-01T00:00:00.000Z').toUTCString();
    expect(xml).toContain(`<lastBuildDate>${expectedDate}</lastBuildDate>`);
  });
});
