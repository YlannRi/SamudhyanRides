import React, { useEffect, useMemo, useState } from 'react';
import { GeoJSON, MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import type { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import L from 'leaflet';
import { apiFetch } from '../../lib/api';

interface RideRenderMapProps {
  rideId: number;
  onPickupSelect?: (lat: number, lng: number) => void;
  existingPickup?: { lat: number; lng: number };
  height?: string;
  interactive?: boolean;
  /** Increment to force a refetch (e.g. driver confirms a pickup). */
  refreshTrigger?: number;
}

/**
 * Renders the route for a given ride using the backend routing endpoint.
 * Backend route: GET /routing/ride/{ride_id}
 */
export const RideRenderMap: React.FC<RideRenderMapProps> = ({
  rideId,
  onPickupSelect,
  existingPickup,
  height = '300px',
  interactive = true,
  refreshTrigger = 0,
}) => {
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPickup, setSelectedPickup] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRoute = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiFetch<any>(`/routing/ride/${rideId}`, { method: 'GET' });
        if (isMounted) setGeoJsonData(data);
      } catch (err: unknown) {
        console.error('Error fetching map route:', err);
        const msg = err instanceof Error ? err.message : String(err);
        if (isMounted) setError(msg || 'Could not fetch route');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (rideId) fetchRoute();

    return () => {
      isMounted = false;
    };
  }, [rideId, refreshTrigger]);

  const defaultCenter: LatLngExpression = [51.3758, -2.3599]; // Bath

  // Component to handle map clicks for passenger pickup selection
  const MapClickEvent = () => {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        if (onPickupSelect && interactive) {
          setSelectedPickup(e.latlng);
          onPickupSelect(e.latlng.lat, e.latlng.lng);
        }
      },
    });
    return null;
  };

  // Component to automatically fit map to the route bounds
  const FitBounds = ({ data }: { data: any }) => {
    const map = useMapEvents({});

    const bounds = useMemo(() => {
      try {
        if (data && data.features && data.features.length > 0) {
          const layer = L.geoJSON(data);
          return layer.getBounds();
        }
      } catch (e) {
        console.error('Error computing bounds:', e);
      }
      return null;
    }, [data]);

    useEffect(() => {
      if (bounds) map.fitBounds(bounds, { padding: [20, 20] });
    }, [bounds, map]);

    return null;
  };

  if (loading) {
    return (
      <div
        style={{
          height,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e5e7eb',
          borderRadius: '8px',
        }}
      >
        Loading map route...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fee2e2',
          color: '#b91c1c',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoJsonData && (
          <>
            <GeoJSON data={geoJsonData} style={{ color: '#3b82f6', weight: 5, opacity: 0.8 }} />
            <FitBounds data={geoJsonData} />
          </>
        )}

        {selectedPickup && <Marker position={selectedPickup} />}

        {existingPickup && <Marker position={[existingPickup.lat, existingPickup.lng]} />}

        {interactive && <MapClickEvent />}
      </MapContainer>
    </div>
  );
};
