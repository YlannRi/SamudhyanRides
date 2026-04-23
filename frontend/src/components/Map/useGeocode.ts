import { useState } from 'react';
import { apiFetch } from '../../lib/api';

export interface GeocodeResult {
  label: string;
  lat: number;
  lng: number;
}

/**
 * Hook to call the backend geocoding endpoint.
 * Backend route: GET /routing/geocode?q=...
 * Backend reverse route: GET /routing/reverse-geocode?lat=...&lng=...
 */
export const useGeocode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeAddress = async (address: string): Promise<GeocodeResult[]> => {
    if (!address.trim()) return [];

    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<GeocodeResult[]>(
        `/routing/geocode?q=${encodeURIComponent(address)}`,
        { method: 'GET' }
      );
      return Array.isArray(data) ? data : [];
    } catch (err: unknown) {
      console.error('Error during geocoding:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Failed to geocode address');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<GeocodeResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiFetch<GeocodeResult>(
        `/routing/reverse-geocode?lat=${encodeURIComponent(String(lat))}&lng=${encodeURIComponent(String(lng))}`,
        { method: 'GET' }
      );
      return data?.label ? data : null;
    } catch (err: unknown) {
      console.error('Error during reverse geocoding:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Failed to reverse geocode pickup');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { geocodeAddress, reverseGeocode, loading, error };
};
