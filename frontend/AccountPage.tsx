import React from 'react';

type QuickActionCardProps = {
  emoji: string;
  label: string;
  hasDot?: boolean;
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  emoji,
  label,
  hasDot = false,
}) => (
  <button className="card quick-card">
    <div className="card-icon small-icon">
      <span className="icon-glyph">{emoji}</span>
    </div>
    <span className="quick-card-label">{label}</span>
    {hasDot && <span className="quick-card-dot" />}
  </button>
);

type InfoCardProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
};

const InfoCard: React.FC<InfoCardProps> = ({ title, subtitle, right }) => (
  <div className="card info-card">
    <div className="info-card-main">
      <div className="info-card-title">{title}</div>
      {subtitle && <div className="info-card-subtitle">{subtitle}</div>}
    </div>
    {right && <div className="info-card-right">{right}</div>}
  </div>
);

const AccountPage: React.FC = () => {
  return (
    <>
      <header className="account-header">
        <div>
          <div className="account-name">Ylann Rimbon</div>
          <div className="rating-badge">★ 4.33</div>
        </div>
        <div className="account-avatar" />
      </header>

      <div className="quick-actions-grid">
        <QuickActionCard emoji="⚙" label="Help" />
        <QuickActionCard emoji="💳" label="Wallet" />
        <QuickActionCard emoji="🛡" label="Safety" />
        <QuickActionCard emoji="✉" label="Inbox" hasDot />
      </div>

      <InfoCard
        title="Your timetable"
        subtitle="See and manage your upcoming rides for uni."
        right={<span className="info-card-emoji">📅</span>}
      />

      <InfoCard
        title="Earn by driving"
        subtitle="Try SamudhyanRides for FREE"
        right={<span className="info-card-emoji">🚕</span>}
      />

      <InfoCard
        title="Safety check-up"
        subtitle="Learn ways to make rides safer."
        right={
          <div className="safety-progress">
            <span className="safety-progress-ring">1/6</span>
          </div>
        }
      />

      <div className="card info-card">
        <div className="info-card-main">
          <div className="info-card-title">Estimated CO₂ saved</div>
        </div>
        <div className="info-card-right co2-right">
          <span className="co2-leaf">🌱</span>
          <span className="co2-value">940 g</span>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
