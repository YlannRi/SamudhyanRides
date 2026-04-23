import { useState } from 'react';
import { apiFetch } from '../../lib/api';

export interface GeocodeResult {
  label: string;
  lat: number;
  lng: number;
}

interface BigDataCloudReverseResult {
  latitude?: number;
  longitude?: number;
  city?: string;
  locality?: string;
  postcode?: string;
  principalSubdivision?: string;
}

const BIG_DATA_CLOUD_REVERSE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

const formatBigDataCloudLabel = (data: BigDataCloudReverseResult) => {
  const locality = data.locality || data.city;
  const postcode = data.postcode;
  const subdivision = data.principalSubdivision;

  const parts = [];
  for (const value of [locality, postcode]) {
    if (value && !parts.includes(value)) {
      parts.push(value);
    }
  }

  if (!parts.length && subdivision) {
    parts.push(subdivision);
  }

  return parts.join(', ');
};

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

  const reverseGeocodeWithBigDataCloud = async (lat: number, lng: number): Promise<GeocodeResult | null> => {
    const response = await fetch(
      `${BIG_DATA_CLOUD_REVERSE_URL}?latitude=${encodeURIComponent(String(lat))}&longitude=${encodeURIComponent(String(lng))}&localityLanguage=en`,
      { method: 'GET' },
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoder fallback failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as BigDataCloudReverseResult;
    const label = formatBigDataCloudLabel(data);
    if (!label) {
      return null;
    }

    return {
      label,
      lat: Number(data.latitude ?? lat),
      lng: Number(data.longitude ?? lng),
    };
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<GeocodeResult | null> => {
    setLoading(true);
    setError(null);

    let backendError: unknown = null;

    try {
      try {
        const data = await apiFetch<GeocodeResult>(
          `/routing/reverse-geocode?lat=${encodeURIComponent(String(lat))}&lng=${encodeURIComponent(String(lng))}`,
          { method: 'GET' }
        );
        if (data?.label) {
          return data;
        }
      } catch (err: unknown) {
        backendError = err;
        console.error('Error during reverse geocoding:', err);
      }

      try {
        const fallbackData = await reverseGeocodeWithBigDataCloud(lat, lng);
        if (fallbackData?.label) {
          return fallbackData;
        }
      } catch (fallbackErr: unknown) {
        console.error('Error during reverse geocoding fallback:', fallbackErr);
        const msg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
        setError(msg || 'Failed to reverse geocode pickup');
        throw fallbackErr;
      }

      if (backendError) {
        const msg = backendError instanceof Error ? backendError.message : String(backendError);
        setError(msg || 'Failed to reverse geocode pickup');
        throw backendError;
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { geocodeAddress, reverseGeocode, loading, error };
};
