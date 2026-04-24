import { describe, it, expect } from 'vitest';
import { parseFrontMatter } from '../../src/index';

describe('parseFrontMatter', () => {
  it('sin front matter devuelve fm vacío y body igual al raw', () => {
    const raw = 'No hay delimitadores aquí.\nSegunda línea.';
    const { fm, body } = parseFrontMatter(raw);
    expect(fm).toEqual({});
    expect(body).toBe(raw);
  });

  it('front matter mínimo con title', () => {
    const { fm, body } = parseFrontMatter('---\ntitle: Hola Mundo\n---\nContenido');
    expect(fm.title).toBe('Hola Mundo');
    expect(body).toBe('Contenido');
  });

  it('título con comillas simples se eliminan', () => {
    const { fm } = parseFrontMatter("---\ntitle: 'Mi Título'\n---\nBody");
    expect(fm.title).toBe('Mi Título');
  });

  it('título con comillas dobles se eliminan', () => {
    const { fm } = parseFrontMatter('---\ntitle: "Mi Título"\n---\nBody');
    expect(fm.title).toBe('Mi Título');
  });

  it('campo date se parsea', () => {
    const { fm } = parseFrontMatter('---\ndate: 2025-01-15\n---\nBody');
    expect(fm.date).toBe('2025-01-15');
  });

  it('campo slug se parsea', () => {
    const { fm } = parseFrontMatter('---\nslug: mi-post-slug\n---\nBody');
    expect(fm.slug).toBe('mi-post-slug');
  });

  it('campo description se parsea', () => {
    const { fm } = parseFrontMatter('---\ndescription: Descripción corta\n---\nBody');
    expect(fm.description).toBe('Descripción corta');
  });

  it('tags inline sin comillas', () => {
    const { fm } = parseFrontMatter('---\ntags: [foo, bar, baz]\n---\nBody');
    expect(fm.tags).toEqual(['foo', 'bar', 'baz']);
  });

  it('tags inline con comillas mixtas', () => {
    const { fm } = parseFrontMatter("---\ntags: ['foo', \"bar\"]\n---\nBody");
    expect(fm.tags).toEqual(['foo', 'bar']);
  });

  it('tags multilinea', () => {
    const { fm } = parseFrontMatter('---\ntags:\n  - alpha\n  - beta\n---\nBody');
    expect(fm.tags).toEqual(['alpha', 'beta']);
  });

  it('tags multilinea con comillas en cada ítem', () => {
    const { fm } = parseFrontMatter("---\ntags:\n  - 'quoted tag'\n  - \"another\"\n---\nBody");
    expect(fm.tags).toEqual(['quoted tag', 'another']);
  });

  it('CRLF line endings', () => {
    const { fm, body } = parseFrontMatter('---\r\ntitle: Foo\r\n---\r\nBody');
    expect(fm.title).toBe('Foo');
    expect(body).toBe('Body');
  });

  it('body se trimea', () => {
    const { body } = parseFrontMatter('---\ntitle: T\n---\n\n  Body con espacios  \n');
    expect(body).toBe('Body con espacios');
  });

  it('claves desconocidas se ignoran sin error', () => {
    const { fm } = parseFrontMatter('---\nunknownKey: value\ntitle: Valid\n---\nBody');
    expect((fm as Record<string, unknown>).unknownKey).toBeUndefined();
    expect(fm.title).toBe('Valid');
  });

  it('todos los campos juntos', () => {
    const raw = [
      '---',
      'title: Complete Post',
      'date: 2025-06-01',
      'slug: complete-post',
      'description: A full post',
      'tags: [qa, testing, blog]',
      '---',
      'Body content here.',
    ].join('\n');
    const { fm, body } = parseFrontMatter(raw);
    expect(fm.title).toBe('Complete Post');
    expect(fm.date).toBe('2025-06-01');
    expect(fm.slug).toBe('complete-post');
    expect(fm.description).toBe('A full post');
    expect(fm.tags).toEqual(['qa', 'testing', 'blog']);
    expect(body).toBe('Body content here.');
  });

  it('body con heading markdown se preserva', () => {
    const { body } = parseFrontMatter('---\ntitle: T\n---\n# Heading\n\nPárrafo.');
    expect(body).toContain('# Heading');
  });
});
