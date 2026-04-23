import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from './lib/api';
import { getProfileRecord } from './lib/profilePreferences';

export type TimetableEvent = {
  uid: string;
  title: string;
  location?: string | null;
  description?: string | null;
  start: string; // ISO
  end: string;   // ISO
};

export type RidePrefill = {
  origin?: string;
  destination?: string;
  arrivalDateTimeLocal?: string; // yyyy-mm-ddThh:mm
  pickupCoords?: { lat: number; lng: number };
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function toDatetimeLocal(d: Date) {
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const min = pad2(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

type Props = {
  onBack: () => void;
  onSelectEvent: (prefill: RidePrefill) => void;
};

const TimetablePage: React.FC<Props> = ({ onBack, onSelectEvent }) => {
  const [url, setUrl] = useState('');
  const [rememberUrl, setRememberUrl] = useState(true);
  const [dayOnly, setDayOnly] = useState(false);

  const [events, setEvents] = useState<TimetableEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    let ignore = false;
    const saved = localStorage.getItem('timetableUrl');
    if (saved) setUrl(saved);

    const token = localStorage.getItem('authToken');
    if (!token) return () => { ignore = true; };

    const loadSavedCalendarLink = async () => {
      try {
        const data = await apiFetch('users/me', { method: 'GET' });
        const profile = getProfileRecord(data);
        const calendarLink = typeof profile?.calendar_link === 'string'
          ? profile.calendar_link.trim()
          : '';

        if (!ignore && calendarLink) {
          setUrl(calendarLink);
          localStorage.setItem('timetableUrl', calendarLink);
        }
      } catch (fetchError) {
        console.error('Error fetching saved calendar link:', fetchError);
      } finally {
        if (!ignore) {
          setPreferencesLoaded(true);
        }
      }
    };

    void loadSavedCalendarLink();

    return () => {
      ignore = true;
    };
  }, []);

  const scope = useMemo(() => (dayOnly ? 'day' : 'week'), [dayOnly]);

  const persistCalendarLink = async (calendarLink: string | null) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await apiFetch('users/me/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calendar_link: calendarLink }),
      });
    } catch (saveError) {
      console.error('Error saving calendar link:', saveError);
    }
  };

  useEffect(() => {
    const trimmed = url.trim();

    if (rememberUrl) {
      if (trimmed) {
        localStorage.setItem('timetableUrl', trimmed);
      } else {
        localStorage.removeItem('timetableUrl');
      }
    } else {
      localStorage.removeItem('timetableUrl');
    }
  }, [rememberUrl, url]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token || !preferencesLoaded) {
      return;
    }

    const trimmed = url.trim();
    const nextCalendarLink = rememberUrl && trimmed ? trimmed : null;
    const timeoutId = window.setTimeout(() => {
      void persistCalendarLink(nextCalendarLink);
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [preferencesLoaded, rememberUrl, url]);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const trimmed = url.trim();
      if (!trimmed) throw new Error('Please paste your university timetable iCal URL.');

      const data = await apiFetch<TimetableEvent[]>('timetable/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed, scope }),
      });

      setEvents(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      setEvents([]);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const handlePickEvent = (ev: TimetableEvent) => {
    const start = new Date(ev.start);
    const arrival = new Date(start.getTime() - 15 * 60 * 1000);

    onSelectEvent({
      destination: 'University of Bath',
      arrivalDateTimeLocal: toDatetimeLocal(arrival),
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <header className="uber-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: 20, padding: 0 }}
          aria-label="Back"
          title="Back"
        >
          ←
        </button>
        <h1 className="activity-title" style={{ margin: 0 }}>Timetable</h1>
      </header>

      <div className="auth-card" style={{ marginBottom: 16 }}>
        <div className="auth-field">
          <label className="auth-label" htmlFor="timetable-ical-url">University timetable iCal URL</label>
          <input
            id="timetable-ical-url"
            className="auth-input"
            type="text"
            placeholder="https://mytimetable.bath.ac.uk/ical?..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 10, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={dayOnly} onChange={(e) => setDayOnly(e.target.checked)} />
            <span style={{ color: 'var(--text-typed)' }}>Day</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={rememberUrl} onChange={(e) => setRememberUrl(e.target.checked)} />
            <span style={{ color: 'var(--text-typed)' }}>Remember URL</span>
          </label>
        </div>

        <button className="auth-submit" onClick={loadEvents} disabled={loading} style={{ marginTop: 12 }}>
          {loading ? 'Loading...' : `Load ${dayOnly ? 'today' : 'this week'}`}
        </button>

        {error && <div style={{ marginTop: 10, color: '#f87171' }}>{error}</div>}
      </div>

      {!loading && !error && events.length === 0 && (
        <div className="card activity-upcoming-card">
          <div>
            <div className="activity-upcoming-title">No events found</div>
            <div className="activity-upcoming-subtitle">Paste your iCal URL and load {dayOnly ? 'today' : 'this week'}.</div>
          </div>
          <div className="activity-upcoming-icon">📅</div>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="past-list">
          {events.map((ev) => {
            const start = new Date(ev.start);
            const end = new Date(ev.end);
            const timeRange = `${start.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })} → ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            return (
              <button
                key={ev.uid}
                className="card trip-row-card"
                style={{ textAlign: 'left' }}
                onClick={() => handlePickEvent(ev)}
              >
                <div className="trip-row-left">
                  <div className="trip-car-icon">🎓</div>
                  <div className="trip-row-text">
                    <div className="trip-row-title">{ev.title}</div>
                    <div className="trip-row-meta">{timeRange}</div>
                    {ev.location && <div className="trip-row-meta">{ev.location}</div>}
                  </div>
                </div>
                <div className="pill pill-solid trip-row-button">Request ride</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimetablePage;
