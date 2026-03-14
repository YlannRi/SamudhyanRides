import React, { type CSSProperties, useEffect, useState } from 'react';
import { apiFetch } from './lib/api';
import {
  type TrustedContact,
  getPrimaryTrustedContact,
  getProfileRecord,
  loadTrustedContactsFromStorage,
  normalizeTrustedContacts,
  saveTrustedContactsToStorage,
} from './lib/profilePreferences';

type QuickActionCardProps = {
  emoji: string;
  label: string;
  hasDot?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  iconColor?: string;
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  emoji,
  label,
  hasDot = false,
  onClick,
  style,
  iconColor,
}) => (
  <button className="card quick-card" onClick={onClick} style={style}>
    <div className="card-icon small-icon">
      <span className="icon-glyph" style={iconColor ? { color: iconColor } : undefined}>
        {emoji}
      </span>
    </div>
    <span className="quick-card-label">{label}</span>
    {hasDot && <span className="quick-card-dot" />}
  </button>
);

type InfoCardProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onClick?: () => void;
};


const InfoCard: React.FC<InfoCardProps> = ({ title, subtitle, right, onClick }) => (
  <div
    className="card info-card"
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    style={onClick ? { cursor: 'pointer' } : undefined}
    onKeyDown={(e) => {
      if (!onClick) return;
      if (e.key === 'Enter' || e.key === ' ') onClick();
    }}
  >
    <div className="info-card-main">
      <div className="info-card-title">{title}</div>
      {subtitle && <div className="info-card-subtitle">{subtitle}</div>}
    </div>
    {right && <div className="info-card-right">{right}</div>}
  </div>
);

type AccountPageProps = {
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenTimetable: () => void;
  onOpenSafetyCheckup: () => void;
  onOpenInbox?: () => void;
  unreadCount?: number;
};

type AccountProfile = {
  first_name?: string;
  last_name?: string;
  university_username?: string;
  rider_rating?: number | null;
  trusted_contacts?: unknown;
};

const AccountPage: React.FC<AccountPageProps> = ({ onLogout, onOpenSettings, onOpenTimetable, onOpenSafetyCheckup, onOpenInbox, unreadCount = 0 }) => {  
  const [userName, setUserName] = useState<string>('Loading...');
  const [rating, setRating] = useState<number | string>('...');
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>(() => loadTrustedContactsFromStorage());

  const [showSafetyToolkit, setShowSafetyToolkit] = useState(false);

  const callNumber = (phone: string) => {
    // Works on mobile; on desktop it may just do nothing (expected)
    window.location.href = `tel:${phone.replace(/\s+/g, '')}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const data = await apiFetch<any>('users/me', {
          method: 'GET',
          // no need to manually add Authorization if apiFetch already does it
        });

        const profile = getProfileRecord(data) as AccountProfile | null;

        if (profile) {
          const storedContacts = loadTrustedContactsFromStorage();
          const profileContacts = normalizeTrustedContacts(profile.trusted_contacts);
          const nextContacts = profileContacts.length > 0 ? profileContacts : storedContacts;

          setTrustedContacts(nextContacts);
          if (profileContacts.length > 0) {
            saveTrustedContactsToStorage(nextContacts);
          }

          const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          setUserName(fullName || String(profile.university_username || 'University Student'));

          const rawRating = Number(profile.rider_rating);

          const userRating =
            profile.rider_rating === null || profile.rider_rating === undefined || rawRating === 0
              ? 'No rating'
              : rawRating.toFixed(2);

          setRating(userRating);
        } else {
          setUserName('Unknown User');
          setRating('N/A');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setUserName('Unknown User');
        setRating('N/A');
      }
    };

    fetchProfile();
  }, []);

  const handleLogoutClick = async () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        await apiFetch('auth/logout', {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error communicating with logout endpoint:', error);
      }
    }

    onLogout();
  };

  return (
    <>
      <header className="account-header">
        <div className="account-info">
          <div className="account-name">{userName}</div>
          <div className="rating-badge">★ {rating}</div>
        </div>
      </header>

      <div className="quick-actions-grid">
        <QuickActionCard emoji="⚙" label="Settings" onClick={onOpenSettings} />
        <QuickActionCard emoji="➜" label="Logout" onClick={handleLogoutClick} />
        <QuickActionCard 
        emoji="⚠️" 
        label="Safety Alarm" 
        iconColor="#ff5555"
        onClick={() => setShowSafetyToolkit(true)} />
        <QuickActionCard emoji="✉" label="Inbox" hasDot={unreadCount > 0} onClick={onOpenInbox} />
      </div>

      <InfoCard
        title="Your timetable"
        subtitle="See and manage your upcoming rides for uni."
        right={<span className="info-card-emoji">📅</span>}
        onClick={onOpenTimetable}
      />

      <InfoCard
        title="Safety check-up"
        subtitle="Learn ways to make rides safer."
        right={
          <div className="safety-progress">
            <span className="safety-progress-ring">1/5</span>
          </div>
        }
        onClick={onOpenSafetyCheckup}
      />
    {showSafetyToolkit && (() => {
  const primary = getPrimaryTrustedContact(trustedContacts);

  return (
    <div className="modal-backdrop" onClick={() => setShowSafetyToolkit(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 10 }}>Safety Toolkit</div>

        <div style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginBottom: 14 }}>
          Choose who to contact.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="sheet-action-btn btn-cancel" onClick={() => callNumber('999')}>
            Call 999
          </button>

          <button
            className="sheet-action-btn btn-accept"
            onClick={() => {
              if (!primary) return;
              callNumber(primary.phone);
            }}
            disabled={!primary}
            style={{ opacity: primary ? 1 : 0.55 }}
            title={!primary ? 'Add a trusted contact in Safety check-up first' : undefined}
          >
            Call your trusted contact{primary ? ` (${primary.firstName} ${primary.lastName})` : ''}
          </button>

          <button className="sheet-action-btn btn-message" onClick={() => callNumber('01225 383999')}>
            Call campus security (01225 383999)
          </button>

          <button className="sheet-action-btn btn-message" onClick={() => setShowSafetyToolkit(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
})()}
    </>
  );
};

export default AccountPage;
