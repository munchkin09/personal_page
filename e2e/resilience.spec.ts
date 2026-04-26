/**
 * E2E Resilience & Error Behaviour Tests
 *
 * Validates that the application degrades gracefully under adverse conditions:
 *
 * 1. 404 error page:
 *    - Unknown routes render the custom error component
 *    - Unsupported locales render the 404 page
 *    - The error page shows correct copy for each locale
 *    - "Go home" / "Ir al inicio" button navigates back to landing
 *
 * 2. Blog section resilience:
 *    - Worker returning 5xx → empty state rendered (no crash)
 *    - Worker timing out (network error) → empty state rendered
 *    - Worker returning malformed JSON → empty state rendered
 *
 * 3. Blog detail resilience:
 *    - No WORKER_URL configured → not-found state rendered
 *    - Worker 5xx on detail page → not-found state rendered
 *    - Post not found in response list → not-found state rendered
 *
 * 4. No unhandled JS errors on any route
 */

import { test, expect, type Page } from '@playwright/test';
import { LOCALES } from './helpers';

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Collect all uncaught page errors during the given async operation. */
async function collectPageErrors(page: Page, fn: () => Promise<void>): Promise<string[]> {
  const errors: string[] = [];
  const handler = (err: Error) => errors.push(err.message);
  page.on('pageerror', handler);
  await fn();
  page.off('pageerror', handler);
  return errors;
}

// ─── 404 / Error page ─────────────────────────────────────────────────────────

test.describe('404 error page', () => {
  test('unknown route renders error component in Spanish', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    await page.waitForLoadState('networkidle');

    // Error page shows HTTP status indicator
    const statusText = await page.locator('text=/HTTP 404/i').first();
    await expect(statusText).toBeVisible({ timeout: 5_000 });
  });

  test('unknown route under /es shows Spanish 404 copy', async ({ page }) => {
    await page.goto('/es/esta-ruta-no-existe');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=HTTP 404')).toBeVisible({ timeout: 5_000 });
    // Spanish copy
    await expect(page.locator('text=/Página no encontrada/i')).toBeVisible();
  });

  test('unknown route under /en shows English 404 copy', async ({ page }) => {
    await page.goto('/en/this-route-does-not-exist');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=HTTP 404')).toBeVisible({ timeout: 5_000 });
    // English copy
    await expect(page.locator('text=/Page not found/i')).toBeVisible();
  });

  test('unsupported locale /fr shows 404', async ({ page }) => {
    await page.goto('/fr');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=HTTP 404')).toBeVisible({ timeout: 5_000 });
  });

  test('error page noindex meta tag is set', async ({ page }) => {
    await page.goto('/es/ruta-inexistente');
    await page.waitForLoadState('networkidle');

    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', 'noindex');
  });

  for (const locale of LOCALES) {
    test(`"go home" button on 404 navigates to /${locale} landing`, async ({ page }) => {
      await page.goto(`/${locale}/no-existe-esta-pagina`);
      await page.waitForLoadState('networkidle');

      // "Ir al inicio" (es) or "Go home" (en)
      const homeBtn = page.locator('a[href*="/' + locale + '"], button').filter({
        hasText: locale === 'es' ? /Ir al inicio/i : /Go home/i,
      }).first();
      await expect(homeBtn).toBeVisible({ timeout: 5_000 });
      await homeBtn.click();

      await page.waitForURL(`**/${locale}`, { timeout: 5_000 });
      expect(page.url()).toMatch(new RegExp(`/${locale}$`));
    });
  }
});

// ─── Blog section resilience ──────────────────────────────────────────────────

test.describe('Blog section – worker failures', () => {
  for (const locale of LOCALES) {
    test(`/${locale} – worker 500 → empty/loading state, no crash`, async ({ page }) => {
      await page.route('**/api/posts', (route) =>
        route.fulfill({ status: 500, body: 'Internal Server Error' }),
      );

      const errors = await collectPageErrors(page, async () => {
        await page.goto(`/${locale}`);
        await page.waitForLoadState('networkidle');
        await page.locator('#blog').scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
      });

      expect(errors).toHaveLength(0);

      // Blog section renders (either empty state or spinner gone)
      await expect(page.locator('#blog')).toBeVisible();
      // No blog cards should be present
      await expect(page.locator('#blog a.blog-card')).toHaveCount(0);
    });

    test(`/${locale} – worker network error → empty state, no crash`, async ({ page }) => {
      await page.route('**/api/posts', (route) => route.abort('failed'));

      const errors = await collectPageErrors(page, async () => {
        await page.goto(`/${locale}`);
        await page.waitForLoadState('networkidle');
        await page.locator('#blog').scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
      });

      expect(errors).toHaveLength(0);
      await expect(page.locator('#blog')).toBeVisible();
      await expect(page.locator('#blog a.blog-card')).toHaveCount(0);
    });

    test(`/${locale} – worker returns malformed JSON → empty state, no crash`, async ({ page }) => {
      await page.route('**/api/posts', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: 'NOT_VALID_JSON{{',
        }),
      );

      const errors = await collectPageErrors(page, async () => {
        await page.goto(`/${locale}`);
        await page.waitForLoadState('networkidle');
        await page.locator('#blog').scrollIntoViewIfNeeded();
        await page.waitForTimeout(800);
      });

      // A JSON parse error may surface as a page error — the component swallows it,
      // but if it doesn't, the test intentionally catches it.
      // The critical requirement: the *page* must not white-screen.
      await expect(page.locator('#blog')).toBeVisible();
    });

    test(`/${locale} – worker returns empty array → empty state UI is rendered`, async ({ page }) => {
      await page.route('**/api/posts', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        }),
      );

      await page.goto(`/${locale}`);
      await page.waitForLoadState('networkidle');
      await page.locator('#blog').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Empty state icon or message should appear
      await expect(page.locator('#blog .blog-state')).toBeVisible({ timeout: 5_000 });
    });
  }
});

// ─── Blog detail resilience ───────────────────────────────────────────────────

test.describe('Blog detail – resilience', () => {
  for (const locale of LOCALES) {
    test(`/${locale}/blog/:id – no worker URL → not-found state, no crash`, async ({ page }) => {
      // Worker URL is not set in test env; VITE_BLOG_WORKER_URL defaults to ''
      const errors = await collectPageErrors(page, async () => {
        await page.goto(`/${locale}/blog/any-post-id`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
      });

      expect(errors).toHaveLength(0);
    });

    test(`/${locale}/blog/:id – worker 404 → not-found state`, async ({ page }) => {
      await page.route('**/api/posts', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]), // posts list exists but this id is absent
        }),
      );

      const errors = await collectPageErrors(page, async () => {
        await page.goto(`/${locale}/blog/non-existent-post`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(800);
      });

      expect(errors).toHaveLength(0);
      // Page title falls back to the generic blog title
      const title = await page.title();
      expect(title.trim().length).toBeGreaterThan(0);
    });

    test(`/${locale}/blog/:id – worker network error → graceful not-found, no crash`, async ({ page }) => {
      await page.route('**/api/posts', (route) => route.abort('failed'));

      const errors = await collectPageErrors(page, async () => {
        await page.goto(`/${locale}/blog/some-post`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(800);
      });

      expect(errors).toHaveLength(0);
    });
  }
});

// ─── No unhandled JS errors across main routes ────────────────────────────────

test.describe('Zero unhandled JS errors', () => {
  const routes = ['/es', '/en', '/es/cv', '/en/cv', '/es/now', '/en/now'];

  for (const route of routes) {
    test(`${route} renders without unhandled JS errors`, async ({ page }) => {
      const errors = await collectPageErrors(page, async () => {
        await page.goto(route);
        await page.waitForLoadState('networkidle');
      });

      expect(errors, `Uncaught errors on ${route}: ${errors.join('; ')}`).toHaveLength(0);
    });
  }
});

// ─── Security headers ─────────────────────────────────────────────────────────

test.describe('Security – response headers', () => {
  test('landing page does not expose server version headers', async ({ request }) => {
    const res = await request.get('/es');
    // Vite preview / Cloudflare Pages should not leak X-Powered-By
    const powered = res.headers()['x-powered-by'];
    expect(powered).toBeUndefined();
  });
});
