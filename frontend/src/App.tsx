import React, { useEffect, useState } from 'react';
import './App.css';
import HomePage from './HomePage';
import AccountPage from './AccountPage';
import LoginPage from './LoginPage';
import DriverSignupPage, { type DriverSignupDraft } from './DriverSignupPage';
import ActivityPage from './ActivityPage';
import RequestRidePage from './RequestRidePage';
import PostRidePage from './PostRidePage';
import JourneyPage from './JourneyPage';
import SettingsPage from './SettingsPage';
import ChatPage from './ChatPage';
import InboxPage from './InboxPage';
import { apiFetch } from './lib/api';
import TimetablePage, { type RidePrefill } from './TimetablePage';
import SafetyCheckupPage from './SafetyCheckupPage.tsx';
import { getAuthToken, clearAuthToken } from './lib/authToken';
import { getUnreadCount, subscribe, startPolling, stopPolling } from './lib/notifications';
import { SpeedInsights } from '@vercel/speed-insights/react';

type Tab = 'home' | 'journey' | 'activity' | 'account' | 'settings' | 'request' | 'post' | 'timetable' | 'safety' | 'chat' | 'inbox';

const buildChatPath = (rideId: string, participantId?: string) => {
  if (!participantId) return `/chat/${rideId}`;
  return `/chat/${rideId}?participant=${encodeURIComponent(participantId)}`;
};

const parseChatLink = (link: string) => {
  const url = new URL(link, window.location.origin);
  if (!url.pathname.startsWith('/chat/')) return null;

  const rideId = url.pathname.replace('/chat/', '').split('/')[0];
  if (!rideId) return null;

  return {
    rideId,
    participantId: url.searchParams.get('participant') ?? undefined,
  };
};

const applyRouteMode = (
  url: URL,
  setActivityMode: React.Dispatch<React.SetStateAction<'user' | 'Driver'>>,
  setJourneyMode: React.Dispatch<React.SetStateAction<'user' | 'driver'>>,
) => {
  const requestedMode = url.searchParams.get('mode');

  if (url.pathname.startsWith('/activity')) {
    setActivityMode(requestedMode === 'driver' ? 'Driver' : 'user');
  }

  if (url.pathname.startsWith('/journey')) {
    setJourneyMode(requestedMode === 'driver' ? 'driver' : 'user');
  }
};

const pathToTab = (path: string): Tab => {
  if (path.startsWith('/chat')) return 'chat';
  if (path.startsWith('/inbox')) return 'inbox';
  if (path.startsWith('/account')) return 'account';
  if (path.startsWith('/activity')) return 'activity';
  if (path.startsWith('/post-ride')) return 'post';
  if (path.startsWith('/request-ride')) return 'request';
  if (path.startsWith('/timetable')) return 'timetable';
  if (path.startsWith('/journey')) return 'journey';
  if (path.startsWith('/settings')) return 'settings';
  if (path.startsWith('/safety')) return 'safety';
  return 'home';
};

const tabToPath = (tab: Tab): string => {
  switch (tab) {
    case 'account':
      return '/account';
    case 'activity':
      return '/activity';
    case 'post':
      return '/post-ride';
    case 'request':
      return '/request-ride';
    case 'timetable':
      return '/timetable';
    case 'journey':
      return '/journey';
    case 'settings':
      return '/settings';
    case 'safety':
      return '/safety';
    case 'chat':
      return '/chat';
    case 'inbox':
      return '/inbox';
    default:
      return '/';
  }
};

export const MapPlaceholder: React.FC<{ label?: string }> = ({ label = 'Map Preview' }) => (
  <div className="map-placeholder">
    <svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" className="map-svg">
      <rect width="400" height="220" fill="#e8ead6" />
      <path d="M0,110 Q100,90 200,110 Q300,130 400,110" stroke="#fff" strokeWidth="10" fill="none" />
      <path
        d="M0,110 Q100,90 200,110 Q300,130 400,110"
        stroke="#d4c89a"
        strokeWidth="8"
        fill="none"
        strokeDasharray="20,8"
      />
      <path d="M150,0 Q160,80 170,110 Q180,150 175,220" stroke="#fff" strokeWidth="8" fill="none" />
      <path d="M250,0 Q245,70 240,110 Q235,155 230,220" stroke="#fff" strokeWidth="6" fill="none" />
      <path
        d="M80,170 Q130,140 180,110 Q230,80 310,55"
        stroke="#3b82f6"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="10,4"
      />
      <circle cx="80" cy="170" r="10" fill="#22c55e" />
      <circle cx="80" cy="170" r="6" fill="#fff" />
      <circle cx="80" cy="170" r="3" fill="#22c55e" />
      <circle cx="310" cy="55" r="12" fill="#ef4444" />
      <circle cx="310" cy="55" r="6" fill="#fff" />
      <path d="M310,67 L310,80" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      <text x="60" y="195" fontSize="10" fill="#166534" fontWeight="bold">
        Pick Up
      </text>
      <text x="290" y="48" fontSize="10" fill="#991b1b" fontWeight="bold">
        Drop Off
      </text>
    </svg>
    <div className="map-badge">{label}</div>
  </div>
);

export const Icons = {
  message: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  cancel: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  star: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  report: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  accept: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  remove: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  ),
  back: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  pin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  next: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
};

export const DetailRow: React.FC<{ label: string; value: React.ReactNode; valueClass?: string }> = ({ label, value, valueClass }) => (
  <div className="sheet-detail-row">
    <span className="detail-label">{label}</span>
    <span className={`detail-value ${valueClass ?? ''}`}>{value}</span>
  </div>
);

export const Btn: React.FC<{ cls: string; icon: React.ReactNode; label: string; small?: boolean; onClick?: () => void }> = ({
  cls,
  icon,
  label,
  small,
  onClick,
}) => (
  <button
    type="button"
    className={`sheet-action-btn ${cls}${small ? ' btn-small' : ''}`}
    onClick={onClick}
    aria-label={label}
  >
    {icon}
    {label}
  </button>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(() => pathToTab(window.location.pathname));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(getAuthToken());
  });
  const [authScreen, setAuthScreen] = useState<'login' | 'driverSignup'>('login');
  const [requestRidePrefill, setRequestRidePrefill] = useState<RidePrefill | undefined>(undefined);
  const [postRidePrefill, setPostRidePrefill] = useState<RidePrefill | undefined>(undefined);
  const [journeyMode, setJourneyMode] = useState<'user' | 'driver'>('user');
  const [activityMode, setActivityMode] = useState<'user' | 'Driver'>('user');
  const [chatRideId, setChatRideId] = useState<string | null>(null);
  const [chatParticipantId, setChatParticipantId] = useState<string | undefined>(undefined);
  const [chatReturnTab, setChatReturnTab] = useState<Tab>('activity');
  const [unreadCount, setUnreadCount] = useState(0);

  // Subscribe to notification store updates
  useEffect(() => {
    const unsub = subscribe(() => setUnreadCount(getUnreadCount()));
    return unsub;
  }, []);

  const navigate = (tab: Tab) => {
    const nextPath = tabToPath(tab);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setActiveTab(tab);
  };

  const openChat = (
    rideId: string,
    participantId?: string,
    sourceTab: Tab = activeTab === 'chat' ? chatReturnTab : activeTab,
  ) => {
    setChatRideId(rideId);
    setChatParticipantId(participantId);
    setChatReturnTab(sourceTab);
    window.history.pushState({}, '', buildChatPath(rideId, participantId));
    setActiveTab('chat');
  };

  const navigateFromLink = (link: string) => {
    const chatRoute = parseChatLink(link);
    if (chatRoute) {
      openChat(chatRoute.rideId, chatRoute.participantId);
    } else {
      const url = new URL(link, window.location.origin);
      applyRouteMode(url, setActivityMode, setJourneyMode);
      window.history.pushState({}, '', `${url.pathname}${url.search}`);
      setActiveTab(pathToTab(url.pathname));
    }
  };

  useEffect(() => {
    const syncRouteState = () => {
      const currentUrl = new URL(window.location.href);
      const chatRoute = parseChatLink(window.location.href);
      if (chatRoute) {
        setChatRideId(chatRoute.rideId);
        setChatParticipantId(chatRoute.participantId);
      }
      applyRouteMode(currentUrl, setActivityMode, setJourneyMode);
      setActiveTab(pathToTab(window.location.pathname));
    };

    syncRouteState();
    const onPopState = () => syncRouteState();
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Driver-gating
  const [canUseDriverMode, setCanUseDriverMode] = useState<boolean>(false);
  const [showDriverSignup, setShowDriverSignup] = useState<boolean>(false);
  const [afterDriverSignupTab, setAfterDriverSignupTab] = useState<Tab>('home');

  const refreshDriverStatus = async (): Promise<boolean> => {
    try {
      const res = await apiFetch<{ is_driver: boolean }>('drivers/me/status', { method: 'GET' });
      const ok = Boolean(res?.is_driver);
      setCanUseDriverMode(ok);
      return ok;
    } catch (e) {
      // Fail closed, but also return false so callers can decide what to do
      setCanUseDriverMode(false);
      return false;
    }
  };
  useEffect(() => {
  const token = getAuthToken();
    if (!token) return;
    setIsAuthenticated(true);

    (async () => {
      try {
        await apiFetch('users/me', { method: 'GET' });
        await refreshDriverStatus();
        startPolling();
      } catch (e: any) {
        if (e?.status === 401) {
          clearAuthToken();
          setIsAuthenticated(false);
          setCanUseDriverMode(false);
        }
      }
    })();
  }, []);

  const handleAuthSuccess = async () => {
    setIsAuthenticated(true);
    await refreshDriverStatus();
    startPolling();
  };

  const handleLogout = () => {
    clearAuthToken();
    stopPolling();
    setIsAuthenticated(false); // Reset auth state
    navigate('home'); // Reset tab so it defaults to home on next login
    setShowDriverSignup(false);
  };

  const startDriverSignup = (destination: Tab = 'home') => {
    setAfterDriverSignupTab(destination);
    setShowDriverSignup(true);
  };

  const goToDriverTab = async (destination: Tab) => {
    const ok = await refreshDriverStatus(); // always re-check server truth
    if (!ok) return startDriverSignup(destination);
    navigate(destination);
  };

  const handleRideStarted = () => {
    setJourneyMode('driver');
    setActivityMode('Driver');
    window.history.pushState({}, '', '/journey?mode=driver');
    setActiveTab('journey');
  };

  const renderAuthedContent = () => {
    if (showDriverSignup) {
      return (
        <DriverSignupPage
          onBack={() => setShowDriverSignup(false)}
          onComplete={async () => {
            setShowDriverSignup(false);
            await refreshDriverStatus();
            navigate(afterDriverSignupTab);
          }}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            onRequestRide={(prefill) => {
              setRequestRidePrefill(prefill);
              navigate('request');
            }}
            onPostRide={(prefill) => {
              setPostRidePrefill(prefill);
              void goToDriverTab('post');
            }}
            canUseDriverMode={canUseDriverMode}
            onDriverSignup={() => startDriverSignup('post')}
            onOpenTimetable={() => navigate('timetable')}
          />
        );
      case 'request':
        return <RequestRidePage prefill={requestRidePrefill} />;
      case 'post':
        // Extra safety: if a non-driver somehow lands here, gate them.
        if (!canUseDriverMode) {
          return (
            <div style={{ padding: 16 }}>
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Driver access required</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 12 }}>
                  You need to register as a driver before you can post rides.
                </div>
                <button className="sheet-action-btn btn-accept" onClick={() => startDriverSignup('post')}>
                  {Icons.check}
                  Become a driver
                </button>
              </div>
            </div>
          );
        }
        return <PostRidePage prefill={postRidePrefill} />;
      case 'account':
                return (
          <AccountPage
            onLogout={handleLogout}
            onOpenSettings={() => navigate('settings')}
            onOpenTimetable={() => navigate('timetable')}
            onOpenSafetyCheckup={() => navigate('safety')}
            onOpenInbox={() => navigate('inbox')}
            unreadCount={unreadCount}
          />
        );
      case 'safety':
        return <SafetyCheckupPage onBack={() => navigate('account')} />;

      case 'settings':
        return <SettingsPage onBack={() => navigate('account')} />;
      case 'journey':
        return (
          <JourneyPage
            canUseDriverMode={canUseDriverMode}
            onDriverSignup={() => startDriverSignup('journey')}
            onOpenChat={openChat}
            mode={journeyMode}
            onModeChange={setJourneyMode}
          />
        );
      case 'activity':
        return (
          <ActivityPage
            canUseDriverMode={canUseDriverMode}
            onDriverSignup={() => startDriverSignup('activity')}
            onOpenChat={openChat}
            onRideStarted={handleRideStarted}
            mode={activityMode}
            onModeChange={setActivityMode}
          />
        );
      case 'timetable':
        return (
          <TimetablePage
            onBack={() => navigate('account')}
            onSelectEvent={(prefill) => {
              setRequestRidePrefill(prefill);
              navigate('request');
            }}
          />
        );
      case 'chat':
        return chatRideId ? (
          <ChatPage rideId={chatRideId} participantId={chatParticipantId} onBack={() => navigate(chatReturnTab)} />
        ) : (
          <ActivityPage
            canUseDriverMode={canUseDriverMode}
            onDriverSignup={() => startDriverSignup('activity')}
            onOpenChat={openChat}
            onRideStarted={handleRideStarted}
            mode={activityMode}
            onModeChange={setActivityMode}
          />
        );
      case 'inbox':
        return <InboxPage onBack={() => navigate('account')} onNavigate={navigateFromLink} />;
      default:
        return (
          <HomePage
            onRequestRide={() => navigate('request')}
            onPostRide={(prefill) => {
              setPostRidePrefill(prefill);
              void goToDriverTab('post');
            }}
            canUseDriverMode={canUseDriverMode}
            onDriverSignup={() => startDriverSignup('post')}
            onOpenTimetable={() => navigate('timetable')}
          />
        );
    }
  };

  return (
    <div className="uber-page">
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <main id="main-content" className="uber-container" role="main" tabIndex={-1}>
        <h1 className="visually-hidden">SamudhyanRides</h1>
        {isAuthenticated ? (
          renderAuthedContent()
        ) : authScreen === 'driverSignup' ? (
          <DriverSignupPage
            onBack={() => setAuthScreen('login')}
            onComplete={() => {
              setAuthScreen('login');
              handleAuthSuccess();
            }}
          />
        ) : (
          <LoginPage
            onAuthSuccess={handleAuthSuccess}
            onStartDriverSignup={(draft: DriverSignupDraft) => {
              localStorage.setItem('driverSignupDraft', JSON.stringify(draft));
              setAuthScreen('driverSignup');
            }}
          />
        )}
      </main>

      {isAuthenticated && (
        <nav className="bottom-nav" aria-label="Primary">
          <button
            type="button"
            aria-current={activeTab === 'home' ? 'page' : undefined}
            className={`nav-item ${activeTab === 'home' ? 'nav-item-active' : ''}`}
            onClick={() => navigate('home')}
          >
            <div className="nav-icon">🚗</div>
            <div className="nav-label">Home</div>
          </button>

          <button
            type="button"
            aria-current={activeTab === 'journey' ? 'page' : undefined}
            className={`nav-item ${activeTab === 'journey' ? 'nav-item-active' : ''}`}
            onClick={() => navigate('journey')}
          >
            <div className="nav-icon">🗺️</div>
            <div className="nav-label">Journey</div>
          </button>

          <button
            type="button"
            aria-current={activeTab === 'activity' ? 'page' : undefined}
            className={`nav-item ${activeTab === 'activity' ? 'nav-item-active' : ''}`}
            onClick={() => navigate('activity')}
          >
            <div className="nav-icon">🕒</div>
            <div className="nav-label">Activity</div>
          </button>

          <button
            type="button"
            aria-current={activeTab === 'account' ? 'page' : undefined}
            className={`nav-item ${activeTab === 'account' ? 'nav-item-active' : ''}`}
            onClick={() => navigate('account')}
          >
            <div className="nav-icon" style={{ position: 'relative' }}>
              👤
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: -2, right: -6,
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#3b82f6', border: '2px solid var(--color-bg, #181a20)',
                }} />
              )}
            </div>
            <div className="nav-label">Account</div>
          </button>
        </nav>
      )}

      <SpeedInsights />
    </div>
  );
};

export default App;
