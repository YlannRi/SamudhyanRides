import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { installApiMocks } from './mocks/apiMock';

async function runAxe(page) {
  const results = await new AxeBuilder({ page })
    // optional: exclude known noisy areas (example)
    // .exclude('[data-testid="map"]')
    .analyze();

  // helpful failure output
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

test('Login page a11y (mocked)', async ({ page }) => {
  await installApiMocks(page);
  await page.goto('/login');
  await runAxe(page);
});

test('Account page a11y (mocked, no backend)', async ({ page }) => {
  await installApiMocks(page);

  // If your app requires auth tokens, you can also set localStorage/cookies here
  // before navigating, OR just mock /auth/me etc like above.
  await page.goto('/account');
  await runAxe(page);
});

test('Driver post ride page a11y (mocked)', async ({ page }) => {
  await installApiMocks(page);
  await page.goto('/post-ride');
  await runAxe(page);
});