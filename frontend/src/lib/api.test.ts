import { beforeEach, expect, it, vi } from 'vitest';
import { apiFetch, buildApiUrl, buildWebSocketUrl, resolveApiBaseUrl } from './api';
import { getAuthToken, setAuthToken } from './authToken';

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

it('returns relative api bases and sensible defaults when no base is configured', () => {
  expect(resolveApiBaseUrl('/api', prodLocation)).toBe('/api');
  expect(resolveApiBaseUrl(undefined, localLocation)).toBe('https://localhost:8000');
  expect(resolveApiBaseUrl(undefined, prodLocation)).toBe(
    'https://samudhyanrides-api.purplerock-a57ae792.francecentral.azurecontainerapps.io',
  );
  expect(resolveApiBaseUrl(undefined, null)).toBe('');
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

it('returns malformed base values unchanged when they are not valid urls', () => {
  expect(resolveApiBaseUrl('://bad-url', prodLocation)).toBe('://bad-url');
});

it('builds api urls and websocket urls from relative bases', () => {
  expect(buildApiUrl('auth/login', '/api', prodLocation)).toBe('/api/auth/login');
  expect(buildWebSocketUrl('notifications/ws', '/api', prodLocation)).toBe(
    'wss://samudhyanrides.vercel.app/api/notifications/ws',
  );
});

it('builds secure websocket urls from the resolved api base', () => {
  expect(
    buildWebSocketUrl('/rides/ws/rides/123?token=test', 'http://samudhyanrides-api.purplerock-a57ae792.francecentral.azurecontainerapps.io', prodLocation),
  ).toBe('wss://samudhyanrides-api.purplerock-a57ae792.francecentral.azurecontainerapps.io/rides/ws/rides/123?token=test');
});

it('parses successful json responses and omits auth headers when auth is disabled', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    text: vi.fn().mockResolvedValue('{"ok":true}'),
  } as Response);

  await expect(
    apiFetch('users/me', {
      method: 'GET',
      auth: false,
      headers: {
        'X-Test': '1',
      },
    }),
  ).resolves.toEqual({ ok: true });

  expect(global.fetch).toHaveBeenCalledWith(
    expect.any(String),
    expect.objectContaining({
      method: 'GET',
      headers: {
        'X-Test': '1',
      },
    }),
  );
});

it('returns null for empty successful responses', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    status: 204,
    text: vi.fn().mockResolvedValue(''),
  } as Response);

  await expect(apiFetch('notifications/read-all', { method: 'PUT' })).resolves.toBeNull();
});

it('throws an error if the response is not OK', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 404,
    statusText: 'Not Found',
  } as Response);

  await expect(apiFetch('bad-endpoint')).rejects.toThrow();
});

it('refreshes the token and retries the request after a 401', async () => {
  setAuthToken('expired-access', 'refresh-123');

  global.fetch = vi.fn()
    .mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    } as Response)
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        access_token: 'fresh-access',
        refresh_token: 'fresh-refresh',
      }),
    } as unknown as Response)
    .mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: vi.fn().mockResolvedValue('{"retried":true}'),
    } as Response);

  await expect(apiFetch('users/me')).resolves.toEqual({ retried: true });

  expect(global.fetch).toHaveBeenNthCalledWith(
    1,
    expect.stringContaining('/users/me'),
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer expired-access',
      }),
    }),
  );
  expect(global.fetch).toHaveBeenNthCalledWith(
    2,
    expect.stringContaining('/auth/refresh'),
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ refresh_token: 'refresh-123' }),
    }),
  );
  expect(global.fetch).toHaveBeenNthCalledWith(
    3,
    expect.stringContaining('/users/me'),
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer fresh-access',
      }),
    }),
  );
  expect(getAuthToken()).toBe('fresh-access');
  expect(localStorage.getItem('refreshToken')).toBe('fresh-refresh');
});

it('queues concurrent callers while a failed refresh is in flight and clears auth state', async () => {
  setAuthToken('expired-access', 'refresh-123');

  const unauthorizedResponse = () =>
    ({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: vi.fn().mockResolvedValue({ detail: 'JWT expired' }),
    } as unknown as Response);

  let resolveRefresh: ((value: Response) => void) | undefined;
  let markRefreshStarted!: () => void;
  const refreshStarted = new Promise<void>((resolve) => {
    markRefreshStarted = resolve;
  });

  global.fetch = vi.fn((url: RequestInfo | URL) => {
    const value = String(url);
    if (value.includes('/auth/refresh')) {
      markRefreshStarted();
      return new Promise((resolve) => {
        resolveRefresh = resolve as (value: Response) => void;
      });
    }

    return Promise.resolve(unauthorizedResponse());
  }) as typeof fetch;

  const firstRequest = apiFetch('users/me');
  await refreshStarted;

  const secondRequest = apiFetch('rides/me');
  await Promise.resolve();

  resolveRefresh?.(unauthorizedResponse());

  await expect(firstRequest).rejects.toThrow('JWT expired');
  await expect(secondRequest).rejects.toThrow('JWT expired');

  expect(global.fetch).toHaveBeenCalledTimes(3);
  expect(getAuthToken()).toBeNull();
  expect(localStorage.getItem('refreshToken')).toBeNull();
});

it('returns a validation error message when the backend returns structured validation detail', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 422,
    statusText: 'Unprocessable Entity',
    json: vi.fn().mockResolvedValue({
      detail: [
        {
          loc: ['body', 'email'],
          msg: 'Field required',
        },
      ],
    }),
  } as unknown as Response);

  await expect(apiFetch('users/me')).rejects.toMatchObject({
    message: 'Validation Error: body.email - Field required',
    detail: [
      {
        loc: ['body', 'email'],
        msg: 'Field required',
      },
    ],
  });
});

it('returns a field-error message when the backend returns field_errors detail', async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 400,
    statusText: 'Bad Request',
    json: vi.fn().mockResolvedValue({
      detail: {
        field_errors: {
          email: 'Already taken',
        },
      },
    }),
  } as unknown as Response);

  await expect(apiFetch('users/me')).rejects.toMatchObject({
    message: 'Please fix the highlighted fields.',
    detail: {
      field_errors: {
        email: 'Already taken',
      },
    },
  });
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
