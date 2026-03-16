import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect } from "@chromatic-com/playwright";

/** Run an axe scan targeting WCAG A + AA (including 2.1). */
export async function runAxe(page: Page) {
  return new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .exclude('.leaflet-container')
    .analyze();
}

/** Assert zero axe violations with readable failure output. */
export async function expectNoViolations(page: Page, label: string) {
  const results = await runAxe(page);
  expect(
    results.violations,
    formatViolations(label, results.violations),
  ).toEqual([]);
}

/** Format violations into a human-readable summary. */
export function formatViolations(label: string, violations: any[]) {
  if (!violations.length) return '';
  return (
    `A11y violations [${label}]:\n` +
    violations
      .map(
        (v) =>
          `  - ${v.id} (${v.impact}): ${v.help}\n    ` +
          v.nodes
            .map((n: any) =>
              Array.isArray(n.target) ? n.target.join(' > ') : String(n.target),
            )
            .join('\n    '),
      )
      .join('\n')
  );
}

/** Seed an auth token so the app treats the session as logged-in. */
export async function seedAuth(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('authToken', 'test-token');
    document.cookie = `authToken=${encodeURIComponent('test-token')}; Path=/; SameSite=Lax`;
  });
}

/** Navigate to a route and wait for the page to settle. */
export async function navigateAndSettle(page: Page, route: string) {
  await page.goto(route);
  await page.waitForLoadState('networkidle');
}
