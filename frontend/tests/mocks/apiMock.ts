import type { Page, Route, Request } from '@playwright/test';

type Json = Record<string, any>;

function json(route: Route, status: number, body: Json) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

export async function installApiMocks(page: Page) {
  await page.route('**/*', async (route: Route) => {
    const req: Request = route.request();
    const url = req.url();
    const method = req.method();
    const resourceType = req.resourceType();

    // Let the SPA document + static assets through.
    // IMPORTANT: DO NOT blanket-allow localhost:5173, because your API calls are also same-origin.
    if (resourceType !== 'xhr' && resourceType !== 'fetch') {
      return route.continue();
    }

    // ---- MOCK BACKEND ENDPOINTS ----

    // Health
    if (url.match(/\/health$/) && method === 'GET') {
      return json(route, 200, { status: 'ok' });
    }

    // LOGIN: your LoginPage expects { access_token } or { token }
    if (url.match(/\/auth\/login$/) && method === 'POST') {
      return json(route, 200, { access_token: 'test-token' });
    }

    // REGISTER: your UI expects a message (token not required here)
    if (url.match(/\/auth\/register$/) && method === 'POST') {
      return json(route, 200, { message: 'Account created' });
    }

    // "me" / profile bootstrap
    if (url.match(/\/users\/me$/) && method === 'GET') {
      return json(route, 200, {
        id: 'test-user',
        first_name: 'Test',
        last_name: 'User',
        phone: '07123456789',
        email: 'test@example.com',
      });
    }

    // Driver status gating
    if (url.match(/\/drivers\/me\/status$/) && method === 'GET') {
      return json(route, 200, { is_driver: true, status: 'approved' });
    }

    // Rides list (if any pages call it)
    if (url.match(/\/rides\/?$/) && method === 'GET') {
      return json(route, 200, []);
    }

    // Routing/geocode fallback
    if (url.includes('/routing/')) {
      return json(route, 200, {});
    }

    // Default: return a safe empty object for any other API-ish calls so UI can render
    if (
      url.includes('/auth/') ||
      url.includes('/drivers/') ||
      url.includes('/users/') ||
      url.includes('/rides/')
    ) {
      return json(route, 200, {});
    }

    return route.continue();
  });
}