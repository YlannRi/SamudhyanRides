import React, { useState } from 'react';
import { apiFetch } from './lib/api';
import { useGeocode } from './components/Map/useGeocode';

const PostRidePage: React.FC = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [timeInput, setTimeInput] = useState('');
  const [seats, setSeats] = useState('3');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { geocodeAddress } = useGeocode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(false);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found. Please log in again.');

      const [originResults, destResults] = await Promise.all([geocodeAddress(origin), geocodeAddress(destination)]);
      const originCoords = originResults[0];
      const destCoords = destResults[0];

      if (!originCoords || !destCoords) throw new Error("Location not found");

      const payload = {
        origin, destination, origin_lat: originCoords.lat, origin_lng: originCoords.lng,
        destination_lat: destCoords.lat, destination_lng: destCoords.lng,
        departure_time: new Date(timeInput).toISOString(), seats_total: parseInt(seats, 10),
      };

      await apiFetch<any>('rides/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setSuccess(true);
      setOrigin(''); setDestination(''); setTimeInput(''); setSeats('3');
    } catch (err: unknown) { setError(err instanceof Error ? err.message : String(err)); } finally { setLoading(false); }
  };

  return (
    <div style={{ width: '100%' }}>
      <header className="uber-header"><h1 className="activity-title" style={{ color: 'var(--text-header)' }}>Post a Ride</h1></header>

      <div className="auth-card" style={{ marginBottom: '24px' }}>
        {error && <p className="auth-alert-error">{error}</p>}
        {success && <div className="auth-alert-success">Ride successfully posted!</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="post-ride-origin">Start Location</label>
            <input id="post-ride-origin" type="text" className="auth-input" style={{ colorScheme: 'light' }} placeholder="e.g. Lower Oldfield Park" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="post-ride-destination">Destination</label>
            <input id="post-ride-destination" type="text" className="auth-input" style={{ colorScheme: 'light' }} placeholder="e.g. University of Bath" value={destination} onChange={(e) => setDestination(e.target.value)} required />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="post-ride-arrival">Destination arrival Date and Time</label>
            {/* The colorScheme light fix is right here! */}
            <input id="post-ride-arrival" type="datetime-local" className="auth-input" style={{ colorScheme: 'light' }} value={timeInput} onChange={(e) => setTimeInput(e.target.value)} required />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="auth-field" style={{ width: '100px' }}>
              <label className="auth-label" htmlFor="post-ride-seats">Seats</label>
              <input id="post-ride-seats" type="number" min="1" max="8" className="auth-input" style={{ colorScheme: 'light' }} value={seats} onChange={(e) => setSeats(e.target.value)} required />
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