import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import type { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type PickupCoords = {
  lat: number;
  lng: number;
};

type PickupPointMapProps = {
  height?: string;
  initialPickup?: PickupCoords;
  onPickupSelect: (lat: number, lng: number) => void;
};

const defaultCenter: LatLngExpression = [51.3758, -2.3599];

const MapClickHandler: React.FC<{ onSelect: (lat: number, lng: number) => void }> = ({ onSelect }) => {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
};

export const PickupPointMap: React.FC<PickupPointMapProps> = ({
  height = '280px',
  initialPickup,
  onPickupSelect,
}) => {
  const [selectedPickup, setSelectedPickup] = useState<PickupCoords | null>(initialPickup ?? null);

  useEffect(() => {
    setSelectedPickup(initialPickup ?? null);
  }, [initialPickup]);

  const center: LatLngExpression = selectedPickup
    ? [selectedPickup.lat, selectedPickup.lng]
    : defaultCenter;

  const handleSelect = (lat: number, lng: number) => {
    const nextPickup = { lat, lng };
    setSelectedPickup(nextPickup);
    onPickupSelect(lat, lng);
  };

  return (
    <div style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {selectedPickup && <Marker position={[selectedPickup.lat, selectedPickup.lng]} />}
        <MapClickHandler onSelect={handleSelect} />
      </MapContainer>
    </div>
  );
};
