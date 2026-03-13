import { test, expect, type Page } from '@playwright/test';
import { PUBLIC_ROUTES, AUTH_ROUTES } from './routes';
import { expectNoViolations, seedAuth, navigateAndSettle } from './a11y-helpers';
import { installApiMocks } from './mocks/apiMock';

test.beforeEach(async ({ page }) => {
  await installApiMocks(page);
});

async function login(page: Page) {
  await seedAuth(page);
  await page.goto('/account');
  await page.waitForLoadState('networkidle');
  await expect(page).not.toHaveURL(/\/login(?:\?|$)/);
}

/* ─── Public routes – initial render ───────────────────────── */

test.describe('WCAG A/AA – public routes', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`axe scan: ${route}`, async ({ page }) => {
      await navigateAndSettle(page, route);
      await expectNoViolations(page, `public ${route}`);
    });
  }
});

/* ─── Authenticated routes – initial render ────────────────── */

test.describe('WCAG A/AA – authenticated routes', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  for (const route of AUTH_ROUTES) {
    test(`axe scan (auth): ${route}`, async ({ page }) => {
      await navigateAndSettle(page, route);
      await expectNoViolations(page, `auth ${route}`);
    });
  }
});
