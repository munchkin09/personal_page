import { describe, it, expect } from 'vitest';
import worker from '../../src/index';
import { makeEnv } from '../helpers/env-mock';
import { getRequest, BASE } from '../helpers/request-builder';

const samplePost = (overrides = {}) => ({
  id: 'abc123',
  title: 'Test Post',
  content: 'Contenido del post.',
  date: '2025-01-01T00:00:00.000Z',
  ...overrides,
});

describe('GET /api/posts', () => {
  it('KV vacío devuelve array vacío', async () => {
    const res = await worker.fetch(getRequest('/api/posts'), makeEnv() as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it('KV con un post devuelve ese post', async () => {
    const post = samplePost();
    const env = makeEnv({ posts: JSON.stringify([post]) });
    const res = await worker.fetch(getRequest('/api/posts'), env as any);
    const data = await res.json() as typeof post[];
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe('Test Post');
  });

  it('devuelve múltiples posts en orden', async () => {
    const posts = [
      samplePost({ id: 'c', title: 'Newest' }),
      samplePost({ id: 'b', title: 'Middle' }),
      samplePost({ id: 'a', title: 'Oldest' }),
    ];
    const env = makeEnv({ posts: JSON.stringify(posts) });
    const res = await worker.fetch(getRequest('/api/posts'), env as any);
    const data = await res.json() as typeof posts;
    expect(data).toHaveLength(3);
    expect(data[0].title).toBe('Newest');
  });

  it('incluye header CORS', async () => {
    const res = await worker.fetch(getRequest('/api/posts'), makeEnv() as any);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('Content-Type es application/json', async () => {
    const res = await worker.fetch(getRequest('/api/posts'), makeEnv() as any);
    expect(res.headers.get('Content-Type')).toContain('application/json');
  });

  it('POST /api/posts retorna 404', async () => {
    const req = new Request(`${BASE}/api/posts`, { method: 'POST' });
    const res = await worker.fetch(req, makeEnv() as any);
    expect(res.status).toBe(404);
  });
});
