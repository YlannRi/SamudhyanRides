import React, { useEffect, useRef, useState } from 'react';
import { apiFetch } from './lib/api';
import { RideRenderMap } from './components/Map/RideRenderMap';
import { useGeocode } from './components/Map/useGeocode';

export type RequestRidePrefill = {
  origin?: string;
  destination?: string;
  arrivalDateTimeLocal?: string;
  pickupCoords?: PickupCoords;
};

type Ride = {
  id: number;
  origin?: string;
  destination?: string;
  departure_time?: string;
  dateOnly?: string;
  timeOnly?: string;
  driver_name?: string;
  driver_rating?: number;
  price?: string;
};

type PickupCoords = {
  lat: number;
  lng: number;
};

const MAP_PICKUP_FALLBACK = 'Selected map pickup';

const CarIcon = () => (
  <svg
    aria-hidden="true"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 17h14l-1.5-6h-11L5 17Z" />
    <path d="M7 11l1.5-4h7L17 11" />
    <circle cx="7.5" cy="17.5" r="1.5" />
    <circle cx="16.5" cy="17.5" r="1.5" />
  </svg>
);

const RequestRidePage: React.FC<{ prefill?: RequestRidePrefill }> = ({ prefill }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [pickupInput, setPickupInput] = useState('');
  const [pickupLabel, setPickupLabel] = useState('');
  const [pickupCoords, setPickupCoords] = useState<PickupCoords | null>(null);
  const [pickupResolving, setPickupResolving] = useState(false);
  const [destinationInput, setDestinationInput] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const pickupLookupId = useRef(0);

  const [bookingLoadingRideId, setBookingLoadingRideId] = useState<number | null>(null);
  const [bookingError, setBookingError] = useState<{ rideId: number; message: string } | null>(null);
  const [bookingSuccessRideId, setBookingSuccessRideId] = useState<number | null>(null);

  const { geocodeAddress, reverseGeocode } = useGeocode();

  const clearBrowseResults = () => {
    setRides([]);
    setHasSearched(false);
    setError(null);
    setBookingError(null);
    setBookingSuccessRideId(null);
  };

  const resolveMapPickup = async (lat: number, lng: number) => {
    const lookupId = pickupLookupId.current + 1;
    pickupLookupId.current = lookupId;

    setPickupCoords({ lat, lng });
    setPickupLabel('');
    setPickupResolving(true);
    setBookingError(null);
    setBookingSuccessRideId(null);

    try {
      const result = await reverseGeocode(lat, lng);
      if (lookupId !== pickupLookupId.current) return;

      const label = result?.label?.trim() || MAP_PICKUP_FALLBACK;
      setPickupLabel(label);
      setPickupInput(label);
    } catch {
      if (lookupId !== pickupLookupId.current) return;

      setPickupLabel(MAP_PICKUP_FALLBACK);
      setPickupInput(MAP_PICKUP_FALLBACK);
    } finally {
      if (lookupId === pickupLookupId.current) {
        setPickupResolving(false);
      }
    }
  };

  useEffect(() => {
    if (!prefill) return;
    if (prefill.origin) {
      setPickupInput(prefill.origin);
      setPickupLabel(prefill.origin);
    }
    if (prefill.pickupCoords) {
      setPickupCoords(prefill.pickupCoords);
      if (prefill.origin) {
        setPickupLabel(prefill.origin);
      } else {
        void resolveMapPickup(prefill.pickupCoords.lat, prefill.pickupCoords.lng);
      }
    }
    if (prefill.destination) setDestinationInput(prefill.destination);
    if (prefill.arrivalDateTimeLocal) setTimeInput(prefill.arrivalDateTimeLocal);
  }, [prefill]);

  const handlePickupChange = (value: string) => {
    pickupLookupId.current += 1;
    setPickupInput(value);
    setPickupCoords(null);
    setPickupResolving(false);
    setPickupLabel('');
    clearBrowseResults();
  };

  const handleSearch = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setBookingError(null);
    setBookingSuccessRideId(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found. Please log in again.');

      const pickup = pickupInput.trim();
      if (!pickup) throw new Error('Enter a pickup location before browsing rides.');

      if (pickupResolving) throw new Error('Finding closest pickup address. Try again in a moment.');

      if (pickupCoords) {
        setPickupLabel(pickupLabel || pickup);
      } else {
        const pickupResults = await geocodeAddress(pickup);
        const nextPickup = pickupResults[0];
        if (!nextPickup) throw new Error('Pickup location not found.');

        setPickupCoords({ lat: nextPickup.lat, lng: nextPickup.lng });
        setPickupLabel(nextPickup.label || pickup);
      }

      const params = new URLSearchParams();
      if (destinationInput.trim()) params.append('destination', destinationInput.trim());

      const queryString = params.toString();
      const data = await apiFetch<Ride[]>(queryString ? `rides/?${queryString}` : 'rides/', { method: 'GET' });
      setRides(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      setRides([]);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async (ride: Ride) => {
    setBookingLoadingRideId(ride.id);
    setBookingError(null);
    setBookingSuccessRideId(null);

    try {
      if (pickupResolving) throw new Error('Finding closest pickup address. Try again in a moment.');

      const pickupLocation = (pickupLabel || pickupInput).trim();
      if (!pickupLocation) throw new Error('Enter a pickup location before requesting this ride.');

      const numericPrice = parseFloat((ride.price ?? '0').replace(/[\u00A3$,]/g, '') || '0');
      const params = new URLSearchParams({
        ride_id: String(ride.id),
        pickup_location: pickupLocation,
        dropoff_location: ride.destination || 'Destination',
        price: String(Number.isFinite(numericPrice) ? numericPrice : 0),
      });

      if (pickupCoords) {
        params.append('pickup_lat', String(pickupCoords.lat));
        params.append('pickup_lng', String(pickupCoords.lng));
      }

      await apiFetch(`bookings/?${params.toString()}`, { method: 'POST' });
      setBookingSuccessRideId(ride.id);
    } catch (err: unknown) {
      setBookingError({ rideId: ride.id, message: err instanceof Error ? err.message : String(err) });
    } finally {
      setBookingLoadingRideId(null);
    }
  };

  const formatDateOnly = (iso?: string) => (
    iso ? new Date(iso).toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Flexible'
  );
  const formatTimeOnly = (iso?: string) => (
    iso ? new Date(iso).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''
  );

  return (
    <div style={{ width: '100%' }}>
      <header className="uber-header">
        <h1 className="activity-title" style={{ color: 'var(--text-header)' }}>Request a Ride</h1>
      </header>

      <div className="auth-card" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearch}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="pickup-area">Pickup location</label>
            <input
              id="pickup-area"
              type="text"
              className="auth-input"
              style={{ colorScheme: 'light' }}
              placeholder="e.g. Oldfield Park"
              value={pickupInput}
              onChange={(e) => handlePickupChange(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="destination-input">Destination</label>
            <input
              id="destination-input"
              type="text"
              className="auth-input"
              style={{ colorScheme: 'light' }}
              placeholder="e.g. University of Bath"
              value={destinationInput}
              onChange={(e) => {
                setDestinationInput(e.target.value);
                clearBrowseResults();
              }}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="arrival-time">Time of arrival (optional)</label>
            <input
              id="arrival-time"
              type="datetime-local"
              className="auth-input"
              style={{ colorScheme: 'light' }}
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
            />
          </div>

          {pickupCoords && (
            <div className="request-pickup-status">
              Pickup set: {pickupResolving ? 'Finding closest address...' : pickupLabel || pickupInput}
            </div>
          )}

          <button type="submit" className="auth-submit" disabled={loading || pickupResolving} style={{ marginTop: '12px' }}>
            {loading ? 'Searching...' : pickupResolving ? 'Finding pickup...' : 'Search Rides'}
          </button>
        </form>
      </div>

      {error && <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>{error}</p>}

      {!loading && !error && hasSearched && rides.length > 0 && (
        <div className="ride-results-list">
          {rides.map((ride) => (
            <div key={ride.id} className="card ride-result-card">
              <div className="ride-result-details">
                <div className="trip-car-icon"><CarIcon /></div>
                <div className="trip-row-text ride-result-copy">
                  <div className="trip-row-title">{ride.destination || `Ride #${ride.id}`}</div>
                  <div className="trip-row-meta">{formatDateOnly(ride.departure_time)}</div>
                  {ride.departure_time && <div className="trip-row-meta">{formatTimeOnly(ride.departure_time)}</div>}
                  <div className="trip-row-meta">From: {ride.origin || '-'}</div>
                  <div className="trip-row-meta">
                    Pickup: {pickupResolving ? 'Finding closest address...' : pickupLabel || pickupInput}
                  </div>
                  {ride.driver_name && <div className="trip-row-meta">Driver: {ride.driver_name}</div>}
                  {ride.driver_rating !== undefined && ride.driver_rating > 0 && (
                    <div className="trip-row-meta">Rating: {ride.driver_rating.toFixed(1)}</div>
                  )}
                  <div className="trip-row-price" style={{ color: 'var(--text-label)', fontWeight: 'bold' }}>
                    GBP 2.00
                  </div>
                  {bookingError?.rideId === ride.id && (
                    <p className="request-booking-error">{bookingError.message}</p>
                  )}
                  {bookingSuccessRideId === ride.id && (
                    <p className="auth-alert-success request-booking-success">Booking request sent successfully!</p>
                  )}
                  <button
                    type="button"
                    className="pill pill-solid ride-result-request"
                    onClick={() => void handleBookRide(ride)}
                    disabled={pickupResolving || bookingLoadingRideId === ride.id || bookingSuccessRideId === ride.id}
                  >
                    {bookingLoadingRideId === ride.id ? 'Requesting...' : bookingSuccessRideId === ride.id ? 'Requested' : 'Request'}
                  </button>
                </div>
              </div>

              <div className="ride-result-map" aria-label={`Route map for ${ride.destination || `Ride #${ride.id}`}`}>
                <RideRenderMap
                  rideId={ride.id}
                  height="180px"
                  existingPickup={pickupCoords ?? undefined}
                  onPickupSelect={(lat, lng) => void resolveMapPickup(lat, lng)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && hasSearched && rides.length === 0 && (
        <div className="card activity-upcoming-card">
          <div>
            <div className="activity-upcoming-title">No rides found</div>
            <div className="activity-upcoming-subtitle">Try a nearby pickup area or a different destination.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestRidePage;
