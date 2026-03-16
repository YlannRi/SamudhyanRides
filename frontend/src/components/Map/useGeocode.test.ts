import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '../../lib/api';
import { useGeocode } from './useGeocode';

vi.mock('../../lib/api', () => ({
  apiFetch: vi.fn(),
}));

describe('useGeocode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns an empty result without calling the API for blank input', async () => {
    const { result } = renderHook(() => useGeocode());
    let geocodeResults: Awaited<ReturnType<typeof result.current.geocodeAddress>> = [];

    await act(async () => {
      geocodeResults = await result.current.geocodeAddress('   ');
    });

    expect(geocodeResults).toEqual([]);
    expect(apiFetch).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns API results and resets loading on success', async () => {
    let resolveRequest!: (value: unknown) => void;
    vi.mocked(apiFetch).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );

    const { result } = renderHook(() => useGeocode());
    let geocodeResults: Awaited<ReturnType<typeof result.current.geocodeAddress>> = [];
    let request!: ReturnType<typeof result.current.geocodeAddress>;

    act(() => {
      request = result.current.geocodeAddress('Bath Spa');
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveRequest([{ label: 'Bath Spa', lat: 51.379, lng: -2.357 }]);
      geocodeResults = await request;
    });

    expect(apiFetch).toHaveBeenCalledWith('/routing/geocode?q=Bath%20Spa', { method: 'GET' });
    expect(geocodeResults).toEqual([{ label: 'Bath Spa', lat: 51.379, lng: -2.357 }]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns an empty array when the API payload is not an array', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({ label: 'Unexpected object' });

    const { result } = renderHook(() => useGeocode());
    let geocodeResults: Awaited<ReturnType<typeof result.current.geocodeAddress>> = [];

    await act(async () => {
      geocodeResults = await result.current.geocodeAddress('Somewhere');
    });

    expect(geocodeResults).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('stores an error and rethrows when geocoding fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const failure = new Error('Geocoder offline');
    vi.mocked(apiFetch).mockRejectedValueOnce(failure);

    const { result } = renderHook(() => useGeocode());
    let thrown: unknown;

    await act(async () => {
      try {
        await result.current.geocodeAddress('Bath');
      } catch (error) {
        thrown = error;
      }
    });

    expect(thrown).toBe(failure);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Geocoder offline');
    expect(consoleSpy).toHaveBeenCalledWith('Error during geocoding:', failure);

    consoleSpy.mockRestore();
  });
});
