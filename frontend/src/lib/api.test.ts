import { beforeEach, expect, it, vi } from 'vitest';
import { apiFetch, buildWebSocketUrl, resolveApiBaseUrl } from './api';

const prodLocation = {
  hostname: 'samudhyanrides.vercel.app',
  origin: 'https://samudhyanrides.vercel.app',
  protocol: 'https:',
};

const localLocation = {
  hostname: 'localhost',
  origin: 'https://localhost:5173',
  protocol: 'https:',
};

beforeEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
});

it('forces https for absolute API urls on secure pages', () => {
  expect(
    resolveApiBaseUrl('http://samudhyanrides-api.purplerock-a57ae792.francecentral.azurecontainerapps.io', prodLocation),
  ).toBe('https://samudhyanrides-api.purplerock-a57ae792.francecentral.azurecontainerapps.io');
});

it('ignores localhost api urls when the app is running remotely', () => {
  expect(resolveApiBaseUrl('https://localhost:8000', prodLocation)).toBe(
    'https://samudhyanrides-api.purplerock-a57ae792.francecentral.azurecontainerapps.io',
  );
});

it('keeps localhost api urls for local development', () => {
  expect(resolveApiBaseUrl('https://localhost:8000', localLocation)).toBe('https://localhost:8000');
});

it('builds secure websocket urls from the resolved api base', () => {
  expect(
    buildWebSocketUrl('/rides/ws/rides/123?token=test', 'http://samudhyanrides-api.purplerock-a57ae792.francecentral.azurecontainerapps.io', prodLocation),
  ).toBe('wss://samudhyanrides-api.purplerock-a57ae792.francecentral.azurecontainerapps.io/rides/ws/rides/123?token=test');
});

it('throws an error if the response is not OK', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 404,
    statusText: 'Not Found',
  } as Response);

  await expect(apiFetch('bad-endpoint')).rejects.toThrow();
});

it('clears the stored auth token when an API call returns 401', async () => {
  localStorage.setItem('authToken', 'expired-token');

  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 401,
    statusText: 'Unauthorized',
    json: vi.fn().mockResolvedValue({ detail: 'JWT expired' }),
  } as unknown as Response);

  await expect(apiFetch('users/me')).rejects.toThrow('JWT expired');
  expect(localStorage.getItem('authToken')).toBeNull();
});
