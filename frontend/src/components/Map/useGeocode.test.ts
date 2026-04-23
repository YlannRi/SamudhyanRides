import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from '../../lib/api';
import { useGeocode } from './useGeocode';

vi.mock('../../lib/api', () => ({
  apiFetch: vi.fn(),
}));

describe('useGeocode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

  it('returns the closest address for reverse geocoded coordinates', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({
      label: 'Lower Bristol Road, Bath',
      lat: 51.38,
      lng: -2.36,
    });

    const { result } = renderHook(() => useGeocode());
    let reverseResult: Awaited<ReturnType<typeof result.current.reverseGeocode>> = null;

    await act(async () => {
      reverseResult = await result.current.reverseGeocode(51.38, -2.36);
    });

    expect(apiFetch).toHaveBeenCalledWith('/routing/reverse-geocode?lat=51.38&lng=-2.36', { method: 'GET' });
    expect(reverseResult).toEqual({
      label: 'Lower Bristol Road, Bath',
      lat: 51.38,
      lng: -2.36,
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('falls back to a browser-callable reverse geocoder when the backend route is unavailable', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const backendFailure = new Error('Request failed: 404 Not Found');
    vi.mocked(apiFetch).mockRejectedValueOnce(backendFailure);
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        locality: 'Bath',
        postcode: 'BA1 1',
        principalSubdivision: 'England',
        latitude: 51.37786,
        longitude: -2.35785,
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useGeocode());
    let reverseResult: Awaited<ReturnType<typeof result.current.reverseGeocode>> = null;

    await act(async () => {
      reverseResult = await result.current.reverseGeocode(51.37786, -2.35785);
    });

    expect(apiFetch).toHaveBeenCalledWith('/routing/reverse-geocode?lat=51.37786&lng=-2.35785', { method: 'GET' });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=51.37786&longitude=-2.35785&localityLanguage=en',
      { method: 'GET' },
    );
    expect(reverseResult).toEqual({
      label: 'Bath, BA1 1',
      lat: 51.37786,
      lng: -2.35785,
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    consoleSpy.mockRestore();
  });

  it('stores an error and rethrows when reverse geocoding fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const backendFailure = new Error('Reverse geocoder offline');
    vi.mocked(apiFetch).mockRejectedValueOnce(backendFailure);
    const fetchFailure = new Error('Fallback reverse geocoder offline');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(fetchFailure));

    const { result } = renderHook(() => useGeocode());
    let thrown: unknown;

    await act(async () => {
      try {
        await result.current.reverseGeocode(51.38, -2.36);
      } catch (error) {
        thrown = error;
      }
    });

    expect(thrown).toBe(fetchFailure);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Fallback reverse geocoder offline');
    expect(consoleSpy).toHaveBeenCalledWith('Error during reverse geocoding:', backendFailure);
    expect(consoleSpy).toHaveBeenCalledWith('Error during reverse geocoding fallback:', fetchFailure);

    consoleSpy.mockRestore();
  });
});
