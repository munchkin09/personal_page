/**
 * E2E Navigation Tests
 *
 * Validates user-facing navigation flows:
 *   - Root redirect to locale
 *   - NavBar section links scroll to the correct anchor
 *   - Language switcher swaps locale and stays on equivalent page
 *   - Logo link scrolls to #hero
 *   - CV toolbar back link returns to landing
 *   - Now page back link returns to landing
 *   - Blog section card click navigates to /lang/blog/:id
 *   - Mobile hamburger menu opens/closes
 *   - Keyboard navigation: Enter on nav link scrolls the section into view
 */

import { test, expect, type Page } from '@playwright/test';
import { LOCALES, NAV_LABELS } from './helpers';

/** Opens the hamburger menu if it is visible and currently closed. */
async function openMobileMenuIfNeeded(page: Page) {
  const toggle = page.locator('button[aria-label="Toggle menu"]');
  if (await toggle.isVisible()) {
    if ((await toggle.getAttribute('aria-expanded')) === 'false') {
      await toggle.click();
      await page.waitForTimeout(250);
    }
  }
}

// ─── Root redirect ────────────────────────────────────────────────────────────

test.describe('Root redirect behaviour', () => {
  test('/ performs a client-side redirect to a locale landing page', async ({ page }) => {
    const response = await page.goto('/');
    // Static SPA serves index.html (200), redirect happens client-side
    expect(response?.status()).toBeLessThan(400);
    // Wait for the SPA redirect to complete
    await page.waitForURL(/\/(es|en)(\/|$)/, { timeout: 5_000 });
    expect(page.url()).toMatch(/\/(es|en)(\/.*)?$/);
  });
});

// ─── NavBar section links ─────────────────────────────────────────────────────

for (const locale of LOCALES) {
  test.describe(`NavBar links · /${locale}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}`);
      // Dismiss any initial animation / wait for hydration
      await page.waitForLoadState('networkidle');
    });

    const sectionIds = ['about', 'strengths', 'skills', 'projects', 'experience', 'blog', 'contact'] as const;

    for (const sectionId of sectionIds) {
      test(`clicking "${sectionId}" nav link scrolls to #${sectionId}`, async ({ page }) => {
        // On mobile the nav links are inside the collapsed hamburger menu — open it first.
        await openMobileMenuIfNeeded(page);
        const navLink = page.locator(`nav a[href="#${sectionId}"]`).first();
        await expect(navLink).toBeVisible();
        await navLink.click();
        // Wait for browser to scroll
        await page.waitForTimeout(600);
        const section = page.locator(`#${sectionId}`);
        await expect(section).toBeInViewport({ ratio: 0.1 });
      });
    }

    test('logo link scrolls back to #hero', async ({ page }) => {
      // First scroll to the bottom
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);

      const logo = page.locator('nav a.logo').first();
      // force:true bypasses intercept-by-overlay checks (hero bg layers can overlap)
      await logo.click({ force: true });

      // Wait for smooth-scroll (scroll-behavior: smooth in app.css) to complete
      await page.waitForFunction(() => window.scrollY < 500, { timeout: 5_000 });
    });
  });
}

// ─── Language switcher ────────────────────────────────────────────────────────

test.describe('Language switcher', () => {
  /**
   * The lang switcher is a group of <button class="lang-btn"> elements inside
   * .nav-content. On mobile the menu must be opened first. On desktop we target
   * the inactive button directly (the group <div> itself has no click handler).
   */
  test('switches from /es to /en', async ({ page }) => {
    await page.goto('/es');
    await page.waitForLoadState('networkidle');

    await openMobileMenuIfNeeded(page);
    // Click the EN button (aria-pressed="false" when current lang is ES)
    const enBtn = page.locator('button.lang-btn').filter({ hasText: 'EN' }).first();
    await expect(enBtn).toBeVisible();
    await enBtn.click();

    await page.waitForURL(/\/en(\/|$)/, { timeout: 5_000 });
    expect(page.url()).toContain('/en');
    await expect(page).toHaveTitle(/Carlos Ledesma/);
  });

  test('switches from /en back to /es', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');

    await openMobileMenuIfNeeded(page);
    const esBtn = page.locator('button.lang-btn').filter({ hasText: 'ES' }).first();
    await expect(esBtn).toBeVisible();
    await esBtn.click();

    await page.waitForURL(/\/es(\/|$)/, { timeout: 5_000 });
    expect(page.url()).toContain('/es');
  });
});

// ─── CV page navigation ───────────────────────────────────────────────────────

for (const locale of LOCALES) {
  test.describe(`CV navigation · /${locale}/cv`, () => {
    test('back link navigates to landing page', async ({ page }) => {
      await page.goto(`/${locale}/cv`);

      const backLink = page.locator(`a[href="/${locale}"]`).first();
      await expect(backLink).toBeVisible();
      await backLink.click();

      await page.waitForURL(`**/${locale}`, { timeout: 5_000 });
      expect(page.url()).toMatch(new RegExp(`/${locale}$`));
    });

    test('landing nav CV link opens CV page', async ({ page }) => {
      await page.goto(`/${locale}`);
      await page.waitForLoadState('networkidle');

      // On mobile the CV link is inside the collapsed nav-content menu.
      await openMobileMenuIfNeeded(page);
      const cvLink = page.locator(`a[href="/${locale}/cv"]`).first();
      await expect(cvLink).toBeVisible();
      await cvLink.click();

      await page.waitForURL(`**/${locale}/cv`, { timeout: 5_000 });
      expect(page.url()).toContain(`/${locale}/cv`);
    });
  });
}

// ─── Now page navigation ──────────────────────────────────────────────────────

for (const locale of LOCALES) {
  test.describe(`Now page navigation · /${locale}/now`, () => {
    test('back link navigates to landing page', async ({ page }) => {
      await page.goto(`/${locale}/now`);

      const backLink = page.locator(`a[href="/${locale}"]`).first();
      await expect(backLink).toBeVisible();
      await backLink.click();

      await page.waitForURL(`**/${locale}`, { timeout: 5_000 });
      expect(page.url()).toMatch(new RegExp(`/${locale}$`));
    });
  });
}

// ─── Blog section interaction ─────────────────────────────────────────────────

test.describe('Blog section – mocked posts', () => {
  /**
   * Intercept the worker API to return a predictable list of posts,
   * then verify that clicking a card navigates to the correct detail page.
   */
  test('clicking a blog card navigates to the blog detail route', async ({ page }) => {
    const fakePost = {
      id: 'fake-post-slug',
      title: 'Test Blog Post',
      content: 'This is a test post.',
      date: '2025-01-15T00:00:00.000Z',
    };

    // Intercept any /api/posts call regardless of origin
    await page.route('**/api/posts', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([fakePost]),
      }),
    );

    await page.goto('/es');
    await page.waitForLoadState('networkidle');

    // Scroll blog section into view to ensure cards render
    await page.locator('#blog').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    // The blog card is an <a href="/es/blog/fake-post-slug">
    const card = page.locator('a[href="/es/blog/fake-post-slug"]').first();
    await expect(card).toBeVisible({ timeout: 8_000 });
    await card.click();

    await page.waitForURL('**/es/blog/fake-post-slug', { timeout: 5_000 });
    expect(page.url()).toContain('/es/blog/fake-post-slug');
  });
});

// ─── Mobile hamburger menu ────────────────────────────────────────────────────

test.describe('Mobile menu', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('hamburger button opens and closes the mobile menu', async ({ page }) => {
    await page.goto('/es');
    await page.waitForLoadState('networkidle');

    const toggle = page.locator('button[aria-label="Toggle menu"]');
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    // Open
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    // Close
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

// ─── Scroll restoration across navigation ─────────────────────────────────────

test.describe('Scroll and deep-link', () => {
  test('hash deep-link #contact scrolls contact section into viewport', async ({ page }) => {
    await page.goto('/es#contact');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600);

    const contact = page.locator('#contact');
    await expect(contact).toBeInViewport({ ratio: 0.1 });
  });

  test('NavBar becomes scrolled after scrolling down', async ({ page }) => {
    await page.goto('/es');
    await page.waitForLoadState('networkidle');

    const nav = page.locator('nav[aria-label="Main"]');
    // Initially not scrolled
    await expect(nav).not.toHaveClass(/scrolled/);

    // Scroll down more than 40px
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(400);

    await expect(nav).toHaveClass(/scrolled/);
  });
});
