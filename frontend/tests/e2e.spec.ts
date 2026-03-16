import { expect, test } from '@playwright/test';
import { seedAuth } from './a11y-helpers';
import { installApiMocks } from './mocks/apiMock';

test.describe('basic end-to-end journeys', () => {
  test.beforeEach(async ({ page }) => {
    await installApiMocks(page);
  });

  test('user can log in, reach account, and log out', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/email or university username/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('password123');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Account' })).toBeVisible();

    await page.getByRole('button', { name: 'Account' }).click();
    await expect(page).toHaveURL(/\/account$/);
    await expect(page.getByText('Test User')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

    await page.getByRole('button', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
  });

  test('driver sign-up flow opens the driver application after account creation', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByLabel('First name').fill('Alex');
    await page.getByLabel(/middle names/i).fill('Jordan');
    await page.getByLabel('Last name').fill('Taylor');
    await page.getByLabel(/^email$/i).fill('alex@bath.ac.uk');
    await page.getByLabel(/^password$/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');
    await page.getByLabel(/do you want to sign up as a driver/i).check();
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByRole('heading', { name: 'Driver sign-up' })).toBeVisible();
    await expect(page.getByLabel('First name')).toHaveValue('Alex');
    await expect(page.getByLabel('Last name')).toHaveValue('Taylor');
    await expect(page.getByLabel(/email or university username/i)).toHaveValue('alex@bath.ac.uk');
    await expect(page.getByRole('button', { name: 'Submit driver application' })).toBeVisible();
  });

  test('authenticated user can add a trusted contact from safety check-up', async ({ page }) => {
    await seedAuth(page);
    await page.goto('/safety');

    await expect(page.locator('.safety-header').getByText('Safety check-up')).toBeVisible();
    await page.getByRole('button', { name: /trusted contacts/i }).click();

    await expect(page.getByText('Your contacts')).toBeVisible();
    await page.getByRole('button', { name: 'Add contact' }).click();

    await page.getByLabel('First name').fill('Sam');
    await page.getByLabel('Last name').fill('Helper');
    await page.getByLabel('Phone number').fill('+447700900123');
    await page.getByLabel(/address \(optional\)/i).fill('1 Bath Street');
    await page.getByLabel(/email \(optional\)/i).fill('sam@example.com');
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await expect(page.getByText('Sam Helper')).toBeVisible();
    await expect(page.getByText('+447700900123')).toBeVisible();
    await expect(page.locator('.primary-pill')).toBeVisible();

    await expect
      .poll(async () => page.evaluate(() => window.localStorage.getItem('trustedContacts')))
      .toContain('Sam');
  });
});
