import React, { useEffect, useState } from 'react';
import { Icons } from './App';
import {
  type Notification,
  fetchNotifications,
  markAllRead,
} from './lib/notifications';

type InboxPageProps = {
  onBack: () => void;
  onNavigate: (link: string) => void;
};

const InboxPage: React.FC<InboxPageProps> = ({ onBack, onNavigate }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchNotifications();
      setNotifications(data);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    // Mark all as read when opening inbox
    markAllRead();
  }, []);

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const typeEmoji = (type: string) => {
    switch (type) {
      case 'chat': return '💬';
      case 'ride': return '🚗';
      case 'booking': return '📋';
      default: return '🔔';
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <button type="button" onClick={onBack} style={{
          background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 4,
        }} aria-label="Back">
          {Icons.back}
        </button>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, flex: 1 }}>Inbox</h2>
      </div>

      {loading && <p style={{ padding: 20, color: 'rgba(255,255,255,0.5)' }}>Loading...</p>}

      {!loading && notifications.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>No notifications yet</div>
          <div style={{ fontSize: 13 }}>You'll see messages and ride updates here</div>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => n.link && onNavigate(n.link)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '14px 16px', background: 'none', border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                cursor: n.link ? 'pointer' : 'default', textAlign: 'left',
                color: 'inherit', width: '100%',
                opacity: n.read ? 0.6 : 1,
              }}
            >
              <div style={{ fontSize: 22, paddingTop: 2 }}>{typeEmoji(n.type)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: n.read ? 500 : 700, fontSize: 14 }}>{n.title}</span>
                  {!n.read && (
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%', background: '#3b82f6',
                      display: 'inline-block', flexShrink: 0,
                    }} />
                  )}
                </div>
                {n.body && (
                  <div style={{
                    fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {n.body}
                  </div>
                )}
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                  {formatTime(n.created_at)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default InboxPage;
