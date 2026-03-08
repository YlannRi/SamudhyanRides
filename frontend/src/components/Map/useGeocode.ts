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

  return { geocodeAddress, loading, error };
};
