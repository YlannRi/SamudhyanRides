import React, { useState } from 'react';
import { apiFetch } from './lib/api';
import { useGeocode } from './components/Map/useGeocode';

const PostRidePage: React.FC = () => {
  // Form State
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [price, setPrice] = useState(''); // UI-only for now (backend does not store price yet)
  const [seats, setSeats] = useState('3');

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { geocodeAddress } = useGeocode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Keep existing UX check
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Geocode origin + destination
      const [originResults, destResults] = await Promise.all([
        geocodeAddress(origin),
        geocodeAddress(destination),
      ]);

      if (originResults.length === 0) {
        throw new Error('Could not find coordinates for the Start location.');
      }
      if (destResults.length === 0) {
        throw new Error('Could not find coordinates for the destination.');
      }

      const originCoords = originResults[0];
      const destCoords = destResults[0];

      // Backend expects RideCreate
      const payload = {
        origin,
        destination,
        origin_lat: originCoords.lat,
        origin_lng: originCoords.lng,
        destination_lat: destCoords.lat,
        destination_lng: destCoords.lng,
        departure_time: new Date(timeInput).toISOString(),
        seats_total: parseInt(seats, 10),
      };

      await apiFetch<any>('rides/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSuccess(true);

      // Clear form
      setOrigin('');
      setDestination('');
      setTimeInput('');
      setPrice('');
      setSeats('3');
    } catch (err: unknown) {
      console.error('Error posting ride:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <header className="uber-header">
        <h1 className="activity-title">Post a Ride</h1>
      </header>

      <div className="auth-card" style={{ marginBottom: '24px' }}>
        {error && (
          <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '12px' }}>{error}</p>
        )}

        {success && (
          <div
            style={{
              padding: '12px',
              backgroundColor: 'rgba(34,197,94,0.15)',
              color: '#4ade80',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px',
            }}
          >
            Ride successfully posted!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Start Location</label>
            <input
              type="text"
              className="auth-input"
              placeholder="e.g. Lower Oldfield Park"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Destination</label>
            <input
              type="text"
              className="auth-input"
              placeholder="e.g. University of Bath"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Destination arrival Date and Time</label>
            <input
              type="datetime-local"
              className="auth-input"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="auth-field" style={{ flex: 1 }}>
              <label className="auth-label">Price (£)</label>
              <input
                type="number"
                step="0.10"
                min="0"
                className="auth-input"
                placeholder="e.g. 5.50"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="auth-field" style={{ width: '100px' }}>
              <label className="auth-label">Seats</label>
              <input
                type="number"
                min="1"
                max="8"
                className="auth-input"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading} style={{ marginTop: '12px' }}>
            {loading ? 'Posting...' : 'Post Ride'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostRidePage;
