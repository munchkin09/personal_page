import { describe, it, expect } from 'vitest';
import worker from '../../src/index';
import { makeEnv } from '../helpers/env-mock';
import { optionsRequest, getRequest, BASE } from '../helpers/request-builder';

describe('OPTIONS / CORS preflight', () => {
  it('OPTIONS / retorna 200', async () => {
    const res = await worker.fetch(optionsRequest('/'), makeEnv() as any);
    expect(res.status).toBe(200);
  });

  it('OPTIONS /api/posts retorna 200', async () => {
    const res = await worker.fetch(optionsRequest('/api/posts'), makeEnv() as any);
    expect(res.status).toBe(200);
  });

  it('incluye Access-Control-Allow-Origin: *', async () => {
    const res = await worker.fetch(optionsRequest('/'), makeEnv() as any);
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('incluye Access-Control-Allow-Methods correcto', async () => {
    const res = await worker.fetch(optionsRequest('/'), makeEnv() as any);
    expect(res.headers.get('Access-Control-Allow-Methods')).toBe('GET, OPTIONS');
  });

  it('body es null/vacío', async () => {
    const res = await worker.fetch(optionsRequest('/'), makeEnv() as any);
    const text = await res.text();
    expect(text).toBe('');
  });
});

describe('404 fallback', () => {
  it('GET /nonexistent retorna 404', async () => {
    const res = await worker.fetch(getRequest('/nonexistent'), makeEnv() as any);
    expect(res.status).toBe(404);
  });

  it('GET /nonexistent body es "Not found"', async () => {
    const res = await worker.fetch(getRequest('/nonexistent'), makeEnv() as any);
    expect(await res.text()).toBe('Not found');
  });

  it('POST a ruta desconocida retorna 404', async () => {
    const req = new Request(`${BASE}/other-path`, { method: 'POST' });
    const res = await worker.fetch(req, makeEnv() as any);
    expect(res.status).toBe(404);
  });
});
