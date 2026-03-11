// Fixed: map-based pickup selection + booking request flow
import React, { useEffect, useState } from 'react';
import { apiFetch } from './lib/api';
import { RideRenderMap } from './components/Map/RideRenderMap';

export type RequestRidePrefill = {
  destination?: string;
  arrivalDateTimeLocal?: string; // yyyy-mm-ddThh:mm
};

type Ride = {
  id: number;
  origin?: string;
  destination?: string;
  departure_time?: string;
  dateOnly?: string;
  timeOnly?: string;
  driverName?: string;
  price?: string;
};

const RequestRidePage: React.FC<{ prefill?: RequestRidePrefill }> = ({ prefill }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [hasSearched, setHasSearched] = useState(false);

  // Search inputs
  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [timeInput, setTimeInput] = useState('');

  useEffect(() => {
    if (!prefill) return;

    if (prefill.destination) {
      setDestinationInput(prefill.destination);
    }

    if (prefill.arrivalDateTimeLocal) {
      setTimeInput(prefill.arrivalDateTimeLocal);
    }
  }, [prefill]);

  // Booking flow
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSelectedRide(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found. Please log in again.');

      const params = new URLSearchParams();
      if (originInput.trim()) params.append('origin', originInput.trim());
      if (destinationInput.trim()) params.append('destination', destinationInput.trim());
      // timeInput currently not used by backend search (can be added later)

      const path = params.toString() ? `rides/?${params.toString()}` : 'rides/';

      const data = await apiFetch<Ride[]>(path, { method: 'GET' });
      setRides(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error('Error fetching rides:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleBookRide = async () => {
    if (!selectedRide) return;

    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(false);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found.');

      // Backend expects query params for booking creation
      const numericPrice = parseFloat((selectedRide.price ?? '0').replace(/[\u00A3$,]/g, '') || '0');

      const params = new URLSearchParams({
        ride_id: String(selectedRide.id),
        pickup_location: 'Map Point',
        dropoff_location: selectedRide.destination || 'Destination',
        price: String(Number.isFinite(numericPrice) ? numericPrice : 0),
      });

      if (pickupCoords) {
        params.append('pickup_lat', String(pickupCoords.lat));
        params.append('pickup_lng', String(pickupCoords.lng));
      }

      await apiFetch(`bookings/?${params.toString()}`, { method: 'POST' });

      setBookingSuccess(true);
    } catch (err: unknown) {
      console.error('Booking error:', err);
      setBookingError(err instanceof Error ? err.message : String(err));
    } finally {
      setBookingLoading(false);
    }
  };

  // Booking screen
  if (selectedRide) {
    return (
      <div style={{ width: '100%' }}>
        <header className="uber-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => {
              setSelectedRide(null);
              setPickupCoords(null);
              setBookingError(null);
              setBookingSuccess(false);
            }}
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '20px', padding: 0 }}
            aria-label="Back"
            title="Back"
          >
            ←
          </button>
          <h1 className="activity-title" style={{ margin: 0 }}>
            {selectedRide.destination ? `Book Ride to ${selectedRide.destination}` : 'Book Ride'}
          </h1>
        </header>

        <div className="auth-card">
          <h3 style={{ marginTop: 0 }}>Select Pickup Location</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Click on the map to set your exact pickup spot along the route.
          </p>

          <RideRenderMap
            rideId={selectedRide.id}
            height="350px"
            onPickupSelect={(lat, lng) => setPickupCoords({ lat, lng })}
          />

          <div style={{ marginTop: '20px' }}>
            {bookingError && <p style={{ color: '#f87171', fontSize: '14px' }}>{bookingError}</p>}
            {bookingSuccess && (
              <p
                style={{
                  color: '#4ade80',
                  fontSize: '14px',
                  padding: '12px',
                  background: 'rgba(34,197,94,0.15)',
                  borderRadius: '8px',
                }}
              >
                Booking request sent successfully!
              </p>
            )}

            <button
              className="auth-submit"
              onClick={handleBookRide}
              disabled={bookingLoading || bookingSuccess}
              style={{ opacity: bookingLoading || bookingSuccess ? 0.7 : 1 }}
            >
              {bookingLoading
                ? 'Requesting...'
                : pickupCoords
                  ? 'Confirm Pickup & Request'
                  : 'Request Without Specific Pickup'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDateOnly = (iso?: string) => {
    if (!iso) return 'Flexible';
    return new Date(iso).toLocaleString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const formatTimeOnly = (iso?: string) => {
    if (!iso) return '';
    return new Date(iso).toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  // Search screen
  return (
    <div style={{ width: '100%' }}>
      <header className="uber-header">
        <h1 className="activity-title">Request a Ride</h1>
      </header>

      <div className="auth-card" style={{ marginBottom: '24px' }}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="request-ride-origin">Pick-up area (optional)</label>
          <input
            id="request-ride-origin"
            type="text"
            className="auth-input"
            placeholder="e.g. Oldfield Park"
            value={originInput}
            onChange={(e) => setOriginInput(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="request-ride-destination">Destination</label>
          <input
            id="request-ride-destination"
            type="text"
            className="auth-input"
            placeholder="e.g. University of Bath"
            value={destinationInput}
            onChange={(e) => setDestinationInput(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="request-ride-arrival">Time of arrival (optional)</label>
          <input
            id="request-ride-arrival"
            type="datetime-local"
            className="auth-input"
            value={timeInput}
            onChange={(e) => setTimeInput(e.target.value)}
          />
        </div>

        <button className="auth-submit" onClick={handleSearch} disabled={loading} style={{ marginTop: '12px' }}>
          {loading ? 'Searching...' : 'Search Rides'}
        </button>
      </div>

      {loading && <p style={{ color: 'var(--text-secondary)' }}>Searching for rides...</p>}
      {error && <p style={{ color: '#f87171' }}>{error}</p>}

      {!loading && !error && hasSearched && rides.length === 0 && (
        <div className="card activity-upcoming-card">
          <div>
            <div className="activity-upcoming-title">No rides available</div>
            <div className="activity-upcoming-subtitle">Try a different time or destination.</div>
          </div>
          <div className="activity-upcoming-icon">📭</div>
        </div>
      )}

      {!loading && !error && hasSearched && rides.length > 0 && (
        <div className="past-list">
          {rides.map((ride) => (
            <div key={ride.id} className="card trip-row-card">
              <div className="trip-row-left">
                <div className="trip-car-icon">🚗</div>
                <div className="trip-row-text">
                  <div className="trip-row-title">{ride.destination || `Ride #${ride.id}`}</div>
                  <div className="trip-row-meta">{formatDateOnly(ride.departure_time)}</div>
                  {ride.departure_time && <div className="trip-row-meta">{formatTimeOnly(ride.departure_time)}</div>}
                  <div className="trip-row-meta">From: {ride.origin || '—'}</div>
                  {ride.driverName && <div className="trip-row-meta">Driver: {ride.driverName}</div>}
                  <div className="trip-row-price">{'£2.00'}</div>
                </div>
              </div>
              <button
                className="pill pill-solid trip-row-button"
                onClick={() => {
                  setSelectedRide(ride);
                  setPickupCoords(null);
                  setBookingError(null);
                  setBookingSuccess(false);
                }}
              >
                Request
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestRidePage;
