import { test, expect, type Page } from '@playwright/test';
import { PUBLIC_ROUTES, AUTH_ROUTES } from './routes';
import { runAxe } from './a11y-helpers';
import { installApiMocks } from './mocks/apiMock';

test.beforeEach(async ({ page }) => {
  await installApiMocks(page);
});

async function login(page: Page) {
  // Seed auth before the app loads
  await page.addInitScript(() => {
    localStorage.setItem('authToken', 'test-token');
    document.cookie = `authToken=${encodeURIComponent('test-token')}; Path=/; SameSite=Lax`;
  });

  // Hit an authenticated page to let App.tsx bootstrap (/users/me, /drivers/me/status)
  await page.goto('/account');
  await page.waitForLoadState('networkidle');

  // Confirm we didn't get bounced to login
  await expect(page).not.toHaveURL(/\/login(?:\?|$)/);
}

function formatViolations(baseURL: string | undefined, route: string, violations: any[]) {
  const origin = baseURL ?? '';
  return (
    `A11y violations on ${origin}${route}:\n` +
    violations
      .map(
        (v) =>
          `- ${v.id}: ${v.help}\n  ` +
          v.nodes.map((n: any) => (Array.isArray(n.target) ? n.target.join(', ') : String(n.target))).join(', ')
      )
      .join('\n')
  );
}

test.describe('WCAG A/AA scan - public routes', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`axe: ${route}`, async ({ page, baseURL }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const results = await runAxe(page);

      expect(
        results.violations,
        formatViolations(baseURL, route, results.violations)
      ).toEqual([]);
    });
  }
});

test.describe('WCAG A/AA scan - authenticated routes', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  for (const route of AUTH_ROUTES) {
    test(`axe (auth): ${route}`, async ({ page, baseURL }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const results = await runAxe(page);

      expect(
        results.violations,
        formatViolations(baseURL, route, results.violations)
      ).toEqual([]);
    });
  }
});
