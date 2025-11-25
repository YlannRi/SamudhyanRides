import React, { useState } from 'react';
import './App.css';
import HomePage from './HomePage';
import AccountPage from './AccountPage';

type Tab = 'home' | 'services' | 'activity' | 'account';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'account':
        return <AccountPage />;
      // placeholders you can replace later
      case 'services':
        return <div style={{ color: 'white' }}>Services coming soon</div>;
      case 'activity':
        return <div style={{ color: 'white' }}>Activity coming soon</div>;
      default:
        return null;
    }
  };

  return (
    <div className="uber-page">
      <div className="uber-container">{renderContent()}</div>

      <nav className="bottom-nav">
        {/* HOME BUTTON */}
        <button
          className={`nav-item ${
            activeTab === 'home' ? 'nav-item-active' : ''
          }`}
          onClick={() => setActiveTab('home')}
        >
          <div className="nav-icon">⌂</div>
          <div className="nav-label">Home</div>
        </button>

        {/* SERVICES BUTTON (optional placeholder) */}
        <button
          className={`nav-item ${
            activeTab === 'services' ? 'nav-item-active' : ''
          }`}
          onClick={() => setActiveTab('services')}
        >
          <div className="nav-icon">☰</div>
          <div className="nav-label">Services</div>
        </button>

        {/* ACTIVITY BUTTON (optional placeholder) */}
        <button
          className={`nav-item ${
            activeTab === 'activity' ? 'nav-item-active' : ''
          }`}
          onClick={() => setActiveTab('activity')}
        >
          <div className="nav-icon">📄</div>
          <div className="nav-label">Activity</div>
        </button>

        {/* ACCOUNT BUTTON */}
        <button
          className={`nav-item ${
            activeTab === 'account' ? 'nav-item-active' : ''
          }`}
          onClick={() => setActiveTab('account')}
        >
          <div className="nav-icon">👤</div>
          <div className="nav-label">Account</div>
        </button>
      </nav>
    </div>
  );
};

export default App;
