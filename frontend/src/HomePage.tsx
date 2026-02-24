import React, { useState } from 'react';

type HomePageProps = {
  onRequestRide: () => void;
  onPostRide: () => void;
  canUseDriverMode: boolean;
  onDriverSignup: () => void;
};

const HomePage: React.FC<HomePageProps> = ({ onRequestRide, onPostRide, canUseDriverMode = true, onDriverSignup }) => {
  const [mode, setMode] = useState<'user' | 'Driver'>('user');

  return (
    <>
      <header className="uber-header">
        <div className="uber-logo">SamudhyanRides</div>

        <div className="top-toggle">
          <button
            className={`toggle-tab ${mode === 'user' ? 'toggle-tab-active' : ''}`}
            onClick={() => setMode('user')}
          >
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

      <div className="search-wrapper">
        <button
          className="search-pill"
          onClick={() => {
            if (mode === 'user') return onRequestRide();
            if (!canUseDriverMode) return onDriverSignup();
            return onPostRide();
          }}
        >
          <span className="search-icon">🔍</span>
          <span className="search-text">
            {mode === 'user' ? 'Request a ride' : canUseDriverMode ? 'Post a ride' : 'Become a driver'}
          </span>
        </button>
      </div>
    </>
  );
};

export default HomePage;