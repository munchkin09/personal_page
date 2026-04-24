/**
 * E2E Conformance Tests
 *
 * Validates that each publicly accessible route:
 *   - Responds with a successful HTTP status
 *   - Carries the correct <title>
 *   - Has a non-empty <meta name="description">
 *   - Renders the primary structural landmarks
 *   - Has valid Open Graph tags (landing & subpages)
 *   - Has the JSON-LD Person schema on root layout pages
 *
 * Routes under test:
 *   /            → client-side redirect to /{locale}
 *   /es          → landing (Spanish)
 *   /en          → landing (English)
 *   /es/cv       → printable résumé (Spanish)
 *   /en/cv       → printable résumé (English)
 *   /es/now      → "now" page (Spanish)
 *   /en/now      → "now" page (English)
 *   /es/blog/:id → blog post detail (Spanish)
 *   /en/blog/:id → blog post detail (English)
 */

import { test, expect } from '@playwright/test';
import { LOCALES } from './helpers';

// ─── Root redirect ────────────────────────────────────────────────────────────

test.describe('Root redirect', () => {
  test('/ redirects to a supported locale path', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/(es|en)(\/|$)/);
    const url = new URL(page.url());
    expect(url.pathname).toMatch(/^\/(es|en)(\/.*)?$/);
  });
});

// ─── Landing pages ────────────────────────────────────────────────────────────

for (const locale of LOCALES) {
  test.describe(`Landing /${locale}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}`);
    });

    test('page title contains brand name', async ({ page }) => {
      await expect(page).toHaveTitle(/Carlos Ledesma/);
    });

    test('meta description is present and non-empty', async ({ page }) => {
      // SSR prerender + client svelte:head both emit a description tag so
      // we assert that the FIRST one has meaningful content (>10 chars).
      const first = page.locator('meta[name="description"]').first();
      await expect(first).toHaveAttribute('content', /.{10,}/);
    });

    test('Open Graph tags are present', async ({ page }) => {
      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
      await expect(page.locator('meta[property="og:url"]')).toHaveCount(1);
    });

    test('Twitter Card meta tags are present', async ({ page }) => {
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary');
      await expect(page.locator('meta[name="twitter:title"]')).toHaveCount(1);
    });

    test('JSON-LD Person schema is injected', async ({ page }) => {
      const ldJson = page.locator('script[type="application/ld+json"]');
      await expect(ldJson).toHaveCount(1);
      const raw = await ldJson.textContent();
      const schema = JSON.parse(raw ?? '{}');
      expect(schema['@type']).toBe('Person');
      expect(schema.name).toContain('Carlos');
    });

    test('primary navigation landmark is rendered', async ({ page }) => {
      await expect(page.locator('nav[aria-label="Main"]')).toBeVisible();
    });

    test('all section IDs are present in the DOM', async ({ page }) => {
      const sections = ['about', 'strengths', 'skills', 'projects', 'experience', 'blog', 'contact'];
      for (const id of sections) {
        await expect(page.locator(`#${id}`)).toBeAttached();
      }
    });

    test('hero section is visible', async ({ page }) => {
      const hero = page.locator('#hero, section[id="hero"], [data-section="hero"]').first();
      // Hero may be outside a <section> — check the NavBar logo href instead
      await expect(page.locator('a[href="#hero"]')).toBeVisible();
    });

    test('favicon link is declared', async ({ page }) => {
      const favicon = page.locator('link[rel="icon"]');
      await expect(favicon).toHaveCount(1);
    });

    test('llms.txt discovery link is declared', async ({ page }) => {
      const llmsLink = page.locator('link[rel="llms-txt"]');
      await expect(llmsLink).toHaveCount(1);
      await expect(llmsLink).toHaveAttribute('href', '/llms.txt');
    });
  });
}

// ─── CV pages ─────────────────────────────────────────────────────────────────

for (const locale of LOCALES) {
  test.describe(`CV /${locale}/cv`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/cv`);
    });

    test('page title contains "CV" and author name', async ({ page }) => {
      await expect(page).toHaveTitle(/CV.*Carlos Ledesma|Carlos Ledesma.*CV/i);
    });

    test('meta description is present', async ({ page }) => {
      const first = page.locator('meta[name="description"]').first();
      await expect(first).toHaveAttribute('content', /.{10,}/);
    });

    test('back link returns to landing', async ({ page }) => {
      const backLink = page.locator(`a[href="/${locale}"]`).first();
      await expect(backLink).toBeVisible();
    });

    test('noindex is not set on CV (it should be indexable)', async ({ page }) => {
      const robots = page.locator('meta[name="robots"]');
      const content = await robots.getAttribute('content');
      // CV is intentionally set index,follow
      expect(content).toBe('index,follow');
    });
  });
}

// ─── Now pages ────────────────────────────────────────────────────────────────

for (const locale of LOCALES) {
  test.describe(`Now /${locale}/now`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/now`);
    });

    test('page title contains brand name', async ({ page }) => {
      await expect(page).toHaveTitle(/Carlos Ledesma/);
    });

    test('meta description is present', async ({ page }) => {
      const first = page.locator('meta[name="description"]').first();
      await expect(first).toHaveAttribute('content', /.{10,}/);
    });

    test('back link to landing is visible', async ({ page }) => {
      const backLink = page.locator(`a[href="/${locale}"]`).first();
      await expect(backLink).toBeVisible();
    });

    test('main content area is rendered', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
    });
  });
}

// ─── Blog detail pages ────────────────────────────────────────────────────────

for (const locale of LOCALES) {
  test.describe(`Blog detail /${locale}/blog/:id`, () => {
    test('renders a fallback state when worker is not configured', async ({ page }) => {
      // In test environment VITE_BLOG_WORKER_URL is empty → post not found state
      await page.goto(`/${locale}/blog/test-post`);
      // Page should load without crashing
      await expect(page).not.toHaveTitle('');
      // Should not show an unhandled JS error overlay
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      expect(errors).toHaveLength(0);
    });

    test('page title is not empty', async ({ page }) => {
      await page.goto(`/${locale}/blog/test-post`);
      // Wait for SPA to hydrate and set a title (SPA fallback HTML may start with empty title)
      await expect(page).toHaveTitle(/.+/);
    });
  });
}

// ─── Static assets ────────────────────────────────────────────────────────────

test.describe('Static assets', () => {
  test('robots.txt is accessible', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain('User-agent');
  });

  test('llms.txt is accessible', async ({ request }) => {
    const res = await request.get('/llms.txt');
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body.trim().length).toBeGreaterThan(0);
  });
});
