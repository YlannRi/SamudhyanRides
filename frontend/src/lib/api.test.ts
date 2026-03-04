import { it, expect, vi } from 'vitest';
import { apiFetch } from './api';

it('throws an error if the response is not OK', async () => {
  // Fake the global fetch function to simulate a 404 error
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status: 404,
    statusText: 'Not Found',
  });

  // Verify that calling the API throws an error
  await expect(apiFetch('bad-endpoint')).rejects.toThrow();
});