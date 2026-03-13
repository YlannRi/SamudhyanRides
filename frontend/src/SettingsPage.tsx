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

const PROFILE_FIELDS = [
    'first_name',
    'last_name',
    'email',
    'university_username',
    'rider_rating',
    'phone_number',
    'gender',
]

const DRIVER_FIELDS = [
    'verified',
    'vehicle_registration',
    'licence_number',
]

function prettyLabel(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function toDisplayValue(v: any): React.ReactNode {
  if (v === null || v === undefined) return 'Not provided';
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

        try {
          const d = await apiFetch<any>('drivers/me', { method: 'GET' });
          setDriverProfile(d ?? null);
        } catch (e: any) {
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
    return PROFILE_FIELDS.map((k) => ({ k, v: profile[k] }))
  }, [profile]);

  const driverRows = useMemo(() => {
    if (!driverProfile) return [] as Array<{ k: string; v: any }>;
    return DRIVER_FIELDS.map((k) => ({ k, v: driverProfile[k] }))
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
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-header)' }}>Settings</div>
      </div>

      {loading && (
        <div className="card" style={{ margin: '0 16px 16px', padding: 16 }}>
          Loading…
        </div>
      )}

      {!loading && error && (
        <div className="card" style={{ margin: '0 16px 16px', padding: 16, color: 'var(--text-label)', fontWeight: 'bold' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div style={{ margin: '0 16px 10px', fontWeight: 800, fontSize: 14, color: 'var(--text-header)' }}>
            Your information
          </div>
          <div className="sheet-details-card">
            {profileRows.length === 0 ? (
              <div style={{ padding: 16, color: 'var(--text-label)' }}>No profile information found.</div>
            ) : (
              profileRows.map(({ k, v }) => <DetailRow key={k} label={prettyLabel(k)} value={toDisplayValue(v)} />)
            )}
          </div>

          {driverRows.length > 0 && (
            <>
              <div style={{ margin: '0 16px 10px', fontWeight: 800, fontSize: 14, color: 'var(--text-header)' }}>
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