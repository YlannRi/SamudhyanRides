import React from 'react';

type ShortcutCardProps = {
  icon: 'clock' | 'plus';
  title: string;
  subtitle?: string;
  isAdd?: boolean;
};

const ShortcutCard: React.FC<ShortcutCardProps> = ({
  icon,
  title,
  subtitle,
  isAdd,
}) => (
  <button className={`card shortcut-card ${isAdd ? 'shortcut-add' : ''}`}>
    <div className="card-icon">
      {icon === 'clock' && <span className="icon-glyph">🕒</span>}
      {icon === 'plus' && <span className="icon-glyph">＋</span>}
    </div>
    <div className="card-body">
      <div className="card-title">{title}</div>
      {subtitle && <div className="card-subtitle">{subtitle}</div>}
    </div>
  </button>
);

type ServiceCardProps = {
  emoji: string;
  title: string;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ emoji, title }) => (
  <button className="card service-card">
    <div className="card-icon">
      <span className="icon-glyph">{emoji}</span>
    </div>
    <div className="card-body">
      <div className="card-title">{title}</div>
    </div>
  </button>
);

const HomePage: React.FC = () => {
  return (
    <>
      <header className="uber-header">
        <div className="uber-logo">SamudhyanRides</div>
      </header>

      <div className="search-wrapper">
        <button className="search-pill">
          <span className="search-icon">🔍</span>
          <span className="search-text">Request a trip</span>
        </button>
      </div>

      <section className="uber-section">
        <h2 className="section-title">Shortcuts</h2>

        <ShortcutCard
          icon="clock"
          title="University of Bath"
          subtitle="Claverton Down, Bath, BA2 7AY, GB"
        />
        <ShortcutCard
          icon="clock"
          title="The King of Wessex (Wetherspoon)"
          subtitle="5–10 W James St, Bath, Somerset, BA1 ..."
        />
        <ShortcutCard icon="plus" title="Save a place" isAdd />
      </section>

      <section className="uber-section">
        <h2 className="section-title">Services</h2>

        <ServiceCard emoji="📅" title="Reserve a trip for later" />
        <ServiceCard emoji="🚗" title="Request a trip" />
      </section>
    </>
  );
};

export default HomePage;
