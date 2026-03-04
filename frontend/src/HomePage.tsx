import React, { useMemo, useState } from 'react';
import type { RidePrefill } from './TimetablePage';

type HomePageProps = {
  onRequestRide: (prefill?: RidePrefill) => void;
  onPostRide: () => void;
  canUseDriverMode: boolean;
  onDriverSignup: () => void;
  onOpenTimetable: () => void;
};

type SavedPlace = {
  id: string;
  label: string;      // e.g. "My Flat"
  address: string;    // street/area
  postcode: string;
  city?: string;
};

function loadSavedPlaces(): SavedPlace[] {
  try {
    const raw = localStorage.getItem('savedPlaces');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveSavedPlaces(list: SavedPlace[]) {
  localStorage.setItem('savedPlaces', JSON.stringify(list));
}

function genId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const HomePage: React.FC<HomePageProps> = ({
  onRequestRide,
  onPostRide,
  canUseDriverMode = true,
  onDriverSignup,
  onOpenTimetable,
}) => {
  const [mode, setMode] = useState<'user' | 'Driver'>('user');

  // Saved places
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(() => loadSavedPlaces());
  const [showSavePlace, setShowSavePlace] = useState(false);
  const [placeForm, setPlaceForm] = useState({
    label: '',
    address: '',
    postcode: '',
    city: '',
  });

  const shortcuts = useMemo(() => savedPlaces, [savedPlaces]);

  const submitPlace = () => {
    if (!placeForm.address.trim() || !placeForm.postcode.trim()) return;

    const next: SavedPlace = {
      id: genId(),
      label: placeForm.label.trim() || 'Saved place',
      address: placeForm.address.trim(),
      postcode: placeForm.postcode.trim(),
      city: placeForm.city.trim() || undefined,
    };

    const updated = [...savedPlaces, next];
    setSavedPlaces(updated);
    saveSavedPlaces(updated);

    setPlaceForm({ label: '', address: '', postcode: '', city: '' });
    setShowSavePlace(false);
  };

  const openRequest = (destination: string) => {
    onRequestRide({ destination });
  };

  return (
    <>
      <header className="uber-header">
        <div className="uber-logo">SamudhyanRides</div>

        <div className="top-toggle">
          <button className={`toggle-tab ${mode === 'user' ? 'toggle-tab-active' : ''}`} onClick={() => setMode('user')}>
            Rides
          </button>
          <button
            className={`toggle-tab ${mode === 'Driver' ? 'toggle-tab-active' : ''}`}
            onClick={() => {
              if (!canUseDriverMode) {
                onDriverSignup();
                return;
              }
              setMode('Driver');
            }}
          >
            Driver
          </button>
        </div>
      </header>

      {/* Where to? pill */}
      <div className="home-body">
        <button
          className="home-where-pill"
          onClick={() => {
            if (mode === 'user') return onRequestRide();
            if (!canUseDriverMode) return onDriverSignup();
            return onPostRide();
          }}
        >
          <span className="home-where-icon">●</span>
          <span className="home-where-text">Where to?</span>
        </button>

        {/* Shortcuts */}
        <div className="home-section">
          <div className="home-section-title">Shortcuts</div>

          <div className="home-list-card">
            {/* University of Bath (fixed shortcut) */}
            <button className="home-list-row" onClick={() => openRequest('University of Bath')}>
              <div className="home-list-icon">🏫</div>
              <div className="home-list-text">
                <div className="home-list-title">University of Bath</div>
                <div className="home-list-subtitle">Claverton Down, Bath, BA2 7AY, GB</div>
              </div>
              <div className="home-list-chevron">›</div>
            </button>

            {/* Render user saved places (only ones they add) */}
            {shortcuts.map((p) => (
              <button
                key={p.id}
                className="home-list-row"
                onClick={() => openRequest(`${p.address}, ${p.postcode}${p.city ? `, ${p.city}` : ''}`)}
              >
                <div className="home-list-icon">📍</div>
                <div className="home-list-text">
                  <div className="home-list-title">{p.label}</div>
                  <div className="home-list-subtitle">
                    {p.address}, {p.postcode}
                    {p.city ? `, ${p.city}` : ''}
                  </div>
                </div>
                <div className="home-list-chevron">›</div>
              </button>
            ))}

            {/* Save a place */}
            <button className="home-list-row home-list-row-add" onClick={() => setShowSavePlace(true)}>
              <div className="home-list-icon">＋</div>
              <div className="home-list-text">
                <div className="home-list-title">Save a place</div>
              </div>
            </button>
          </div>
        </div>

        {/* Services */}
        <div className="home-section">
          <div className="home-section-title">Services</div>

          <div className="home-list-card">
            <button className="home-list-row" onClick={onOpenTimetable}>
              <div className="home-list-icon">🗓️</div>
              <div className="home-list-text">
                <div className="home-list-title">Timetable</div>
              </div>
              <div className="home-list-chevron">›</div>
            </button>
          </div>
        </div>
      </div>

      {/* Save place modal */}
      {showSavePlace && (
        <div className="modal-backdrop" onClick={() => setShowSavePlace(false)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-place-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <div id="save-place-title" style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>
              Save a place
            </div>

            <div className="modal-grid">
              <label className="modal-field">
                <span>Label (optional)</span>
                <input
                  value={placeForm.label}
                  onChange={(e) => setPlaceForm((p) => ({ ...p, label: e.target.value }))}
                  placeholder="e.g. Home"
                  type="text"
                  autoComplete="off"
                />
              </label>

              <label className="modal-field">
                <span>Address</span>
                <input
                  value={placeForm.address}
                  onChange={(e) => setPlaceForm((p) => ({ ...p, address: e.target.value }))}
                  placeholder="e.g. 12 Example Street"
                  type="text"
                  autoComplete="street-address"
                />
              </label>

              <label className="modal-field">
                <span>Postcode</span>
                <input
                  value={placeForm.postcode}
                  onChange={(e) => setPlaceForm((p) => ({ ...p, postcode: e.target.value }))}
                  placeholder="e.g. BA2 7AY"
                  type="text"
                  autoComplete="postal-code"
                />
              </label>

              <label className="modal-field">
                <span>City (optional)</span>
                <input
                  value={placeForm.city}
                  onChange={(e) => setPlaceForm((p) => ({ ...p, city: e.target.value }))}
                  placeholder="e.g. Bath"
                  type="text"
                  autoComplete="address-level2"
                />
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
              <button type="button" className="sheet-action-btn btn-cancel" onClick={() => setShowSavePlace(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="sheet-action-btn btn-accept"
                onClick={submitPlace}
                disabled={!placeForm.address.trim() || !placeForm.postcode.trim()}
                style={{ opacity: !placeForm.address.trim() || !placeForm.postcode.trim() ? 0.55 : 1 }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;