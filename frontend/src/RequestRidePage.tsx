import React, { useEffect, useState } from 'react';
import { apiFetch } from './lib/api';
import { RideRenderMap } from './components/Map/RideRenderMap';

export type RequestRidePrefill = { destination?: string; arrivalDateTimeLocal?: string; };
type Ride = { id: number; origin?: string; destination?: string; departure_time?: string; dateOnly?: string; timeOnly?: string; driverName?: string; price?: string; };

const RequestRidePage: React.FC<{ prefill?: RequestRidePrefill }> = ({ prefill }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [originInput, setOriginInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [timeInput, setTimeInput] = useState('');

  useEffect(() => {
    if (!prefill) return;
    if (prefill.destination) setDestinationInput(prefill.destination);
    if (prefill.arrivalDateTimeLocal) setTimeInput(prefill.arrivalDateTimeLocal);
  }, [prefill]);

  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleSearch = async () => {
    setLoading(true); setError(null); setHasSearched(true); setSelectedRide(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found. Please log in again.');
      const params = new URLSearchParams();
      if (originInput.trim()) params.append('origin', originInput.trim());
      if (destinationInput.trim()) params.append('destination', destinationInput.trim());

      const data = await apiFetch<Ride[]>(params.toString() ? `rides/?${params.toString()}` : 'rides/', { method: 'GET' });
      setRides(Array.isArray(data) ? data : []);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : String(err)); } finally { setLoading(false); }
  };

  const handleBookRide = async () => {
    if (!selectedRide) return;
    setBookingLoading(true); setBookingError(null); setBookingSuccess(false);
    try {
      const numericPrice = parseFloat((selectedRide.price ?? '0').replace(/[\u00A3$,]/g, '') || '0');
      const params = new URLSearchParams({
        ride_id: String(selectedRide.id), pickup_location: 'Map Point',
        dropoff_location: selectedRide.destination || 'Destination', price: String(Number.isFinite(numericPrice) ? numericPrice : 0),
      });
      if (pickupCoords) { params.append('pickup_lat', String(pickupCoords.lat)); params.append('pickup_lng', String(pickupCoords.lng)); }
      await apiFetch(`bookings/?${params.toString()}`, { method: 'POST' });
      setBookingSuccess(true);
    } catch (err: unknown) { setBookingError(err instanceof Error ? err.message : String(err)); } finally { setBookingLoading(false); }
  };

  if (selectedRide) {
    return (
      <div style={{ width: '100%' }}>
        <header className="uber-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button type="button" onClick={() => { setSelectedRide(null); setPickupCoords(null); setBookingError(null); setBookingSuccess(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-header)', fontSize: '20px', padding: 0 }}>←</button>
          <h1 className="activity-title" style={{ margin: 0, color: 'var(--text-header)' }}>{selectedRide.destination ? `Book Ride to ${selectedRide.destination}` : 'Book Ride'}</h1>
        </header>
        <div className="auth-card">
          <h3 style={{ marginTop: 0, color: 'var(--text-typed)' }}>Select Pickup Location</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-label)', marginBottom: '16px' }}>Click on the map to set your exact pickup spot.</p>
          <RideRenderMap rideId={selectedRide.id} height="350px" onPickupSelect={(lat, lng) => setPickupCoords({ lat, lng })} />
          <div style={{ marginTop: '20px' }}>
            {bookingError && <p style={{ color: '#d32f2f', fontSize: '14px', fontWeight: 'bold' }}>{bookingError}</p>}
            {bookingSuccess && <p className="auth-alert-success">Booking request sent successfully!</p>}
            <button className="auth-submit" onClick={handleBookRide} disabled={bookingLoading || bookingSuccess} style={{ opacity: bookingLoading || bookingSuccess ? 0.7 : 1 }}>
              {bookingLoading ? 'Requesting...' : pickupCoords ? 'Confirm Pickup & Request' : 'Request Without Specific Pickup'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDateOnly = (iso?: string) => iso ? new Date(iso).toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Flexible';
  const formatTimeOnly = (iso?: string) => iso ? new Date(iso).toLocaleString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div style={{ width: '100%' }}>
      <header className="uber-header"><h1 className="activity-title" style={{ color: 'var(--text-header)' }}>Request a Ride</h1></header>
      <div className="auth-card" style={{ marginBottom: '24px' }}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="pickup-area">Pick-up area (optional)</label>
          <input id="pickup-area" type="text" className="auth-input" style={{ colorScheme: 'light' }} placeholder="e.g. Oldfield Park" value={originInput} onChange={(e) => setOriginInput(e.target.value)} />
        </div>
        <div className="auth-field">
          <label className="auth-label" htmlFor="destination-input">Destination</label>
          <input id="destination-input" type="text" className="auth-input" style={{ colorScheme: 'light' }} placeholder="e.g. University of Bath" value={destinationInput} onChange={(e) => setDestinationInput(e.target.value)} />
        </div>
        <div className="auth-field">
          <label className="auth-label" htmlFor="arrival-time">Time of arrival (optional)</label>
          <input id="arrival-time" type="datetime-local" className="auth-input" style={{ colorScheme: 'light' }} value={timeInput} onChange={(e) => setTimeInput(e.target.value)} />
        </div>
        <button className="auth-submit" onClick={handleSearch} disabled={loading} style={{ marginTop: '12px' }}>{loading ? 'Searching...' : 'Search Rides'}</button>
      </div>
      {error && <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>{error}</p>}
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
                  <div className="trip-row-price" style={{ color: 'var(--text-label)', fontWeight: 'bold' }}>{'£2.00'}</div>
                </div>
              </div>
              <button className="pill pill-solid" onClick={() => { setSelectedRide(ride); setPickupCoords(null); setBookingError(null); setBookingSuccess(false); }}>Request</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestRidePage;