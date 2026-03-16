import { test } from "@chromatic-com/playwright";
import type { Page } from '@playwright/test';
import { expectNoViolations, seedAuth, navigateAndSettle } from './a11y-helpers';
import { installApiMocks } from './mocks/apiMock';

test.beforeEach(async ({ page }) => {
  await installApiMocks(page);
});

async function loginAndGo(page: Page, route: string) {
  await seedAuth(page);
  await navigateAndSettle(page, route);
}

/* ─── Login page states ────────────────────────────────────── */

test.describe('Login page – UI states', () => {
  test('signup mode', async ({ page }) => {
    await navigateAndSettle(page, '/login');
    const signupBtn = page.locator('button', { hasText: /sign\s*up/i }).first();
    if (await signupBtn.isVisible()) {
      await signupBtn.click();
      await expectNoViolations(page, 'login – signup mode');
    }
  });

  test('login error state', async ({ page }) => {
    await page.route('**/auth/login', (route) =>
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Invalid credentials' }),
      }),
    );
    await navigateAndSettle(page, '/login');
    const emailInput = page.locator('input[type="email"], input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      await emailInput.fill('bad@example.com');
      await passwordInput.fill('wrong');
      await page.locator('button[type="submit"], .auth-submit').click();
      await page.waitForTimeout(500);
      await expectNoViolations(page, 'login – error state');
    }
  });
});

/* ─── Home page states ─────────────────────────────────────── */

test.describe('Home page – UI states', () => {
  test('driver mode toggle', async ({ page }) => {
    await loginAndGo(page, '/');
    const driverTab = page.locator('button', { hasText: /driver/i }).first();
    if (await driverTab.isVisible()) {
      await driverTab.click();
      await expectNoViolations(page, 'home – driver mode');
    }
  });

  test('save place modal', async ({ page }) => {
    await loginAndGo(page, '/');
    const addBtn = page.locator('button.home-list-row-add, button:has-text("+")').first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(300);
      const dialog = page.locator('[role="dialog"]');
      if (await dialog.isVisible()) {
        await expectNoViolations(page, 'home – save place modal');
      }
    }
  });
});

/* ─── Account page states ──────────────────────────────────── */

test.describe('Account page – UI states', () => {
  test('safety toolkit modal', async ({ page }) => {
    await loginAndGo(page, '/account');
    const safetyBtn = page.locator('button', { hasText: /safety\s*alarm/i }).first();
    if (await safetyBtn.isVisible()) {
      await safetyBtn.click();
      await page.waitForTimeout(300);
      await expectNoViolations(page, 'account – safety toolkit modal');
    }
  });
});

/* ─── Activity page states ─────────────────────────────────── */

test.describe('Activity page – UI states', () => {
  test('empty state', async ({ page }) => {
    await page.route('**/rides*', (route) => {
      if (route.request().resourceType() === 'fetch' || route.request().resourceType() === 'xhr') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      }
      return route.continue();
    });
    await page.route('**/bookings/**', (route) => {
      if (route.request().resourceType() === 'fetch' || route.request().resourceType() === 'xhr') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      }
      return route.continue();
    });
    await loginAndGo(page, '/activity');
    await expectNoViolations(page, 'activity – empty state');
  });

  test('driver mode toggle', async ({ page }) => {
    await loginAndGo(page, '/activity');
    const driverTab = page.locator('button', { hasText: /driver/i }).first();
    if (await driverTab.isVisible()) {
      await driverTab.click();
      await page.waitForTimeout(300);
      await expectNoViolations(page, 'activity – driver mode');
    }
  });
});

/* ─── Journey page states ──────────────────────────────────── */

test.describe('Journey page – UI states', () => {
  test('empty state (user mode)', async ({ page }) => {
    await loginAndGo(page, '/journey');
    await expectNoViolations(page, 'journey – empty user state');
  });

  test('driver mode empty state', async ({ page }) => {
    await loginAndGo(page, '/journey');
    const driverTab = page.locator('button', { hasText: /driver/i }).first();
    if (await driverTab.isVisible()) {
      await driverTab.click();
      await page.waitForTimeout(300);
      await expectNoViolations(page, 'journey – empty driver state');
    }
  });
});

/* ─── Post Ride page states ────────────────────────────────── */

test.describe('Post Ride page – UI states', () => {
  test('form filled state', async ({ page }) => {
    await loginAndGo(page, '/post-ride');
    const startInput = page.locator('input').first();
    if (await startInput.isVisible()) {
      await startInput.fill('University of Bath');
      const destInput = page.locator('input').nth(1);
      if (await destInput.isVisible()) {
        await destInput.fill('Bath Spa Station');
      }
    }
    await expectNoViolations(page, 'post-ride – filled form');
  });
});

/* ─── Request Ride page states ─────────────────────────────── */

test.describe('Request Ride page – UI states', () => {
  test('initial form state', async ({ page }) => {
    await loginAndGo(page, '/request-ride');
    await expectNoViolations(page, 'request-ride – initial');
  });
});

/* ─── Settings page states ─────────────────────────────────── */

test.describe('Settings page – UI states', () => {
  test('loaded profile', async ({ page }) => {
    await loginAndGo(page, '/settings');
    await page.waitForTimeout(500);
    await expectNoViolations(page, 'settings – loaded profile');
  });
});

/* ─── Safety Checkup page states ───────────────────────────── */

test.describe('Safety Checkup page – UI states', () => {
  test('main checklist', async ({ page }) => {
    await loginAndGo(page, '/safety');
    await expectNoViolations(page, 'safety – main checklist');
  });

  test('trusted contacts view', async ({ page }) => {
    await loginAndGo(page, '/safety');
    const trustedRow = page.locator('.safety-row, button', { hasText: /trusted\s*contact/i }).first();
    if (await trustedRow.isVisible()) {
      await trustedRow.click();
      await page.waitForTimeout(300);
      await expectNoViolations(page, 'safety – trusted contacts view');
    }
  });

  test('add contact modal', async ({ page }) => {
    await loginAndGo(page, '/safety');
    const trustedRow = page.locator('.safety-row, button', { hasText: /trusted\s*contact/i }).first();
    if (await trustedRow.isVisible()) {
      await trustedRow.click();
      await page.waitForTimeout(300);
      const addBtn = page.locator('button', { hasText: /add/i }).first();
      if (await addBtn.isVisible()) {
        await addBtn.click();
        await page.waitForTimeout(300);
        const dialog = page.locator('[role="dialog"]');
        if (await dialog.isVisible()) {
          await expectNoViolations(page, 'safety – add contact modal');
        }
      }
    }
  });
});

/* ─── Timetable page states ────────────────────────────────── */

test.describe('Timetable page – UI states', () => {
  test('initial empty state', async ({ page }) => {
    await loginAndGo(page, '/timetable');
    await expectNoViolations(page, 'timetable – empty');
  });
});

/* ─── Inbox page states ────────────────────────────────────── */

test.describe('Inbox page – UI states', () => {
  test('with notifications', async ({ page }) => {
    await loginAndGo(page, '/inbox');
    await page.waitForTimeout(300);
    await expectNoViolations(page, 'inbox – with notifications');
  });
});