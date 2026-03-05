import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from './lib/api';

type SettingsPageProps = {
  onBack: () => void;
};

type AnyRecord = Record<string, any>;

const BackIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="sheet-detail-row">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{value}</span>
  </div>
);

function prettyLabel(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function toDisplayValue(v: any): React.ReactNode {
  if (v === null || v === undefined) return '';
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [profile, setProfile] = useState<AnyRecord | null>(null);
  const [driverProfile, setDriverProfile] = useState<AnyRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const me = await apiFetch<any>('users/me', { method: 'GET' });
        const p = Array.isArray(me) ? me[0] : me;
        setProfile(p ?? null);

        // Driver info is optional. If the user isn't a driver, we simply show nothing.
        try {
          const d = await apiFetch<any>('drivers/me', { method: 'GET' });
          setDriverProfile(d ?? null);
        } catch (e: any) {
          // Treat 404/any error as "not a driver" for display purposes.
          setDriverProfile(null);
        }
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const profileRows = useMemo(() => {
    if (!profile) return [] as Array<{ k: string; v: any }>;
    return Object.entries(profile)
      .filter(([, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => ({ k, v }));
  }, [profile]);

  const driverRows = useMemo(() => {
    if (!driverProfile) return [] as Array<{ k: string; v: any }>;
    return Object.entries(driverProfile)
      .filter(([, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => ({ k, v }));
  }, [driverProfile]);

  return (
    <div style={{ paddingTop: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px 14px' }}>
        <button
          type="button"
          className="sheet-action-btn btn-message"
          style={{ width: 44, height: 44, padding: 0 }}
          onClick={onBack}
          aria-label="Back"
          title="Back"
        >
          {BackIcon}
        </button>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Settings</div>
      </div>

      {loading && (
        <div className="card" style={{ margin: '0 16px 16px', padding: 16 }}>
          Loading…
        </div>
      )}

      {!loading && error && (
        <div className="card" style={{ margin: '0 16px 16px', padding: 16, color: '#f87171' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ margin: '0 16px 10px', fontWeight: 800, fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
            Your information
          </div>
          <div className="sheet-details-card">
            {profileRows.length === 0 ? (
              <div style={{ padding: 16, color: 'rgba(255,255,255,0.7)' }}>No profile information found.</div>
            ) : (
              profileRows.map(({ k, v }) => <DetailRow key={k} label={prettyLabel(k)} value={toDisplayValue(v)} />)
            )}
          </div>

          {/* Only render driver section if driver info exists */}
          {driverRows.length > 0 && (
            <>
              <div style={{ margin: '0 16px 10px', fontWeight: 800, fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
                Driver information
              </div>
              <div className="sheet-details-card">
                {driverRows.map(({ k, v }) => <DetailRow key={k} label={prettyLabel(k)} value={toDisplayValue(v)} />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SettingsPage;