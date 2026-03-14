import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from './lib/api';
import {
  type TrustedContact,
  loadTrustedContactsFromStorage,
  normalizeTrustedContacts,
  saveTrustedContactsToStorage,
} from './lib/profilePreferences';

type SafetyCheckupPageProps = {
  onBack: () => void;
};

type View = 'main' | 'help' | 'trusted' | 'pin' | 'ridecheck' | 'driver';

const BackIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const ChevronRight = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const CheckCircle: React.FC<{ checked?: boolean }> = ({ checked }) => (
  <span className={`safety-check-circle ${checked ? 'checked' : ''}`}>{checked ? 'v' : ''}</span>
);

const ListRow: React.FC<{
  title: string;
  subtitle: string;
  checked?: boolean;
  onClick: () => void;
}> = ({ title, subtitle, checked, onClick }) => (
  <div
    className="safety-row"
    onClick={onClick}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick();
      }
    }}
    role="button"
    tabIndex={0}
  >
    <div className="safety-row-left">
      <CheckCircle checked={checked} />
      <div className="safety-row-text">
        <div className="safety-row-title">{title}</div>
        <div className="safety-row-subtitle">{subtitle}</div>
      </div>
    </div>
    <div className="safety-row-right">{ChevronRight}</div>
  </div>
);

function genId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function genPin() {
  return String(Math.floor(Math.random() * 9000) + 1000);
}

const SafetyCheckupPage: React.FC<SafetyCheckupPageProps> = ({ onBack }) => {
  const [view, setView] = useState<View>('main');
  const [contacts, setContacts] = useState<TrustedContact[]>(() => loadTrustedContactsFromStorage());
  const primaryId = useMemo(() => contacts.find((contact) => contact.isPrimary)?.id, [contacts]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', address: '', email: '' });

  const [rideCheckEnabled, setRideCheckEnabled] = useState<boolean>(() => localStorage.getItem('rideCheckEnabled') === 'true');
  const [pinEnabled, setPinEnabled] = useState<boolean>(() => localStorage.getItem('pinEnabled') === 'true');
  const [pinCode, setPinCode] = useState<string>(() => localStorage.getItem('pinCode') || '');

  useEffect(() => {
    saveTrustedContactsToStorage(contacts);
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('rideCheckEnabled', String(rideCheckEnabled));
  }, [rideCheckEnabled]);

  useEffect(() => {
    localStorage.setItem('pinEnabled', String(pinEnabled));
    if (!pinEnabled) {
      localStorage.removeItem('pinCode');
    }
  }, [pinEnabled]);

  useEffect(() => {
    if (pinCode) {
      localStorage.setItem('pinCode', pinCode);
    }
  }, [pinCode]);

  useEffect(() => {
    let ignore = false;
    const token = localStorage.getItem('authToken');

    if (!token) {
      return () => {
        ignore = true;
      };
    }

    const loadSavedContacts = async () => {
      try {
        const data = await apiFetch('users/me', { method: 'GET' });
        const profile = Array.isArray(data) ? data[0] : data;
        const profileContacts = normalizeTrustedContacts(profile?.trusted_contacts);

        if (!ignore && profileContacts.length > 0) {
          setContacts(profileContacts);
          saveTrustedContactsToStorage(profileContacts);
        }
      } catch (error) {
        console.error('Error fetching trusted contacts:', error);
      }
    };

    void loadSavedContacts();

    return () => {
      ignore = true;
    };
  }, []);

  const persistContactsToAccount = async (nextContacts: TrustedContact[]) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      await apiFetch('users/me/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trusted_contacts: nextContacts }),
      });
    } catch (error) {
      console.error('Error saving trusted contacts:', error);
    }
  };

  const updateContacts = (updater: (current: TrustedContact[]) => TrustedContact[]) => {
    setContacts((current) => {
      const next = updater(current);
      void persistContactsToAccount(next);
      return next;
    });
  };

  const header = (title: string, backTo?: View) => (
    <div className="safety-header">
      <button
        type="button"
        className="sheet-action-btn"
        style={{ width: 44, height: 44, padding: 0, background: 'transparent', border: 'none', color: 'var(--text-header)' }}
        onClick={() => { if (backTo) setView(backTo); else onBack(); }}
        aria-label="Back"
        title="Back"
      >
        {BackIcon}
      </button>
      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-header)' }}>{title}</div>
    </div>
  );

  const setPrimary = (id: string) => {
    updateContacts((current) => current.map((contact) => ({ ...contact, isPrimary: contact.id === id })));
  };

  const removeContact = (id: string) => {
    updateContacts((current) => {
      const next = current.filter((contact) => contact.id !== id);
      if (!next.some((contact) => contact.isPrimary) && next.length > 0) {
        next[0] = { ...next[0], isPrimary: true };
      }
      return next;
    });
  };

  const submitContact = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) {
      return;
    }

    const nextContact: TrustedContact = {
      id: genId(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim() || undefined,
      email: form.email.trim() || undefined,
      isPrimary: contacts.length === 0,
    };

    updateContacts((current) => [...current, nextContact]);
    setShowAddContact(false);
    setForm({ firstName: '', lastName: '', phone: '', address: '', email: '' });
  };

  if (view === 'help') {
    return (
      <div className="safety-page">
        {header('Safety help', 'main')}
        <div className="card safety-card" style={{ margin: '0 16px 16px', padding: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>Open the Safety Toolkit</div>
          <div style={{ color: 'var(--text-label)', lineHeight: 1.5 }}>
            If you ever need safety help during a trip, go to the Account page and tap the red safety alarm button
            on the map to open your Safety Toolkit. This lets you contact your trusted contact or emergency services.
          </div>
        </div>
      </div>
    );
  }

  if (view === 'trusted') {
    return (
      <div className="safety-page">
        {header('Trusted contacts', 'main')}

        <div className="card safety-card" style={{ margin: '0 16px 12px', padding: 16 }}>
          <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Share your trip status</div>
          <div style={{ color: 'var(--text-label)', lineHeight: 1.5, marginBottom: 14 }}>
            You will be able to share your live location with one or more contacts during any Samudhyan ride.
          </div>
          <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Set your emergency contacts</div>
          <div style={{ color: 'var(--text-label)', lineHeight: 1.5 }}>
            You can make a trusted contact an emergency contact too. Samudhyan Ride can call them if we cannot reach
            you in case of an emergency.
          </div>
        </div>

        <div className="card safety-card" style={{ margin: '0 16px 12px', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
            <div style={{ fontWeight: 900 }}>Your contacts</div>
            <button className="sheet-action-btn btn-accept" style={{ width: 'auto', minWidth: 132 }} onClick={() => setShowAddContact(true)}>
              Add contact
            </button>
          </div>

          {contacts.length === 0 ? (
            <div style={{ color: 'var(--text-label)' }}>No trusted contacts yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {contacts.map((contact) => (
                <div key={contact.id} className="trusted-contact-row">
                  <div className="trusted-contact-main">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, flexWrap: 'wrap' }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {contact.firstName} {contact.lastName}
                      </span>
                      {contact.isPrimary && <span className="primary-pill">Primary</span>}
                    </div>
                    <div style={{ color: 'var(--text-label)', fontSize: 13, marginTop: 4 }}>{contact.phone}</div>
                    {(contact.address || contact.email) && (
                      <div style={{ color: 'var(--text-label)', opacity: 0.8, fontSize: 12, marginTop: 4 }}>
                        {[contact.address, contact.email].filter(Boolean).join(' / ')}
                      </div>
                    )}
                  </div>
                  <div className="trusted-contact-actions">
                    <button
                      className={`sheet-action-btn ${contact.isPrimary ? 'btn-cancel' : 'btn-accept'}`}
                      onClick={() => setPrimary(contact.id)}
                      disabled={contact.isPrimary}
                      style={{ opacity: contact.isPrimary ? 0.6 : 1 }}
                    >
                      Set primary
                    </button>
                    <button className="sheet-action-btn btn-cancel" onClick={() => removeContact(contact.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {primaryId && <div style={{ marginTop: 12, color: 'var(--text-label)', fontSize: 12 }}>Primary contact will be used first.</div>}
        </div>

        {showAddContact && (
          <div className="modal-backdrop" onClick={() => setShowAddContact(false)}>
            <div className="modal-card" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
              <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 10, color: 'var(--text-typed)' }}>Add trusted contact</div>
              <div className="modal-grid">
                <label className="modal-field"><span>First name</span><input value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} type="text" /></label>
                <label className="modal-field"><span>Last name</span><input value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} type="text" /></label>
                <label className="modal-field"><span>Phone number</span><input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} type="tel" /></label>
                <label className="modal-field"><span>Address (optional)</span><input value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} type="text" /></label>
                <label className="modal-field"><span>Email (optional)</span><input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} type="email" /></label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" className="sheet-action-btn btn-cancel" onClick={() => setShowAddContact(false)}>Cancel</button>
                <button type="button" className="sheet-action-btn btn-accept" onClick={submitContact} disabled={!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()}>Add</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'ridecheck') {
    return (
      <div className="safety-page">
        {header('RideCheck', 'main')}
        <div className="card safety-card" style={{ margin: '0 16px 16px', padding: 18 }}>
          <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>What's a RideCheck?</div>
          <div style={{ color: 'var(--text-label)', lineHeight: 1.5, marginBottom: 16 }}>
            In the case of an unexpected event, Samudhyan Ride will initiate a RideCheck to help you.
          </div>
          <div className="toggle-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, marginBottom: 2 }}>RideCheck notifications</div>
              <div style={{ color: 'var(--text-label)', fontSize: 13, lineHeight: 1.4 }}>
                We will send you a RideCheck notification if a trip does not progress as planned.
              </div>
            </div>
            <label className="switch"><input type="checkbox" checked={rideCheckEnabled} onChange={(event) => setRideCheckEnabled(event.target.checked)} /><span className="slider" /></label>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'pin') {
    return (
      <div className="safety-page">
        {header('PIN verification', 'main')}
        <div className="card safety-card" style={{ margin: '0 16px 16px', padding: 18 }}>
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 10 }}>Verify your trips</div>
          <div style={{ color: 'var(--text-label)', lineHeight: 1.5, marginBottom: 18 }}>
            Help make sure you get into the right car by verifying your trip with a PIN.
          </div>
          <div className="toggle-row">
            <div style={{ flex: 1, fontWeight: 900 }}>Use PIN to verify trips</div>
            <label className="switch">
              <input
                type="checkbox"
                checked={pinEnabled}
                onChange={(event) => {
                  const next = event.target.checked;
                  setPinEnabled(next);
                  if (next) setPinCode(genPin());
                  else setPinCode('');
                }}
              />
              <span className="slider" />
            </label>
          </div>
          {pinEnabled && pinCode && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Your trip PIN</div>
              <div className="pin-box">{pinCode}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'driver') {
    return (
      <div className="safety-page">
        {header('Driver safety standards', 'main')}
        <div className="card safety-card" style={{ margin: '0 16px 16px', padding: 18 }}>
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 12 }}>Driver safety standards</div>
          <div className="safety-section">
            <div className="safety-section-title">Driver screening</div>
            <div className="safety-section-text">Before anyone can drive, they have to pass a screening.</div>
          </div>
          <div className="safety-section">
            <div className="safety-section-title">Real-time ID check</div>
            <div className="safety-section-text">Drivers must submit photos to verify their identity.</div>
          </div>
          <button className="sheet-action-btn btn-accept" style={{ width: '100%', marginTop: 20 }} onClick={() => setView('main')}>Got it</button>
        </div>
      </div>
    );
  }

  return (
    <div className="safety-page">
      {header('Safety check-up')}
      <div className="card safety-card" style={{ margin: '0 16px 14px', padding: 18 }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Safety check-up</div>
        <div style={{ color: 'var(--text-label)', lineHeight: 1.5 }}>To help keep yourself safe on every trip, review your current safety settings.</div>
      </div>

      <div className="card safety-card safety-list-card" style={{ margin: '0 16px 16px', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px 10px', fontWeight: 900, color: 'var(--text-typed)' }}>Safety settings</div>
        <ListRow title="Safety help" subtitle="Learn how to get help during a trip" checked onClick={() => setView('help')} />
        <div className="safety-row-divider" />
        <ListRow title="Trusted contacts" subtitle="Choose friends or family to share your location" checked={contacts.length > 0} onClick={() => setView('trusted')} />
        <div className="safety-row-divider" />
        <ListRow title="PIN verification" subtitle="Secure your trip by requiring a simple code" checked={pinEnabled} onClick={() => setView('pin')} />
        <div className="safety-row-divider" />
        <ListRow title="RideCheck" subtitle="Receive automatic check-ins" checked={rideCheckEnabled} onClick={() => setView('ridecheck')} />
        <div className="safety-row-divider" />
        <ListRow title="Driver safety standards" subtitle="Learn about our safety standards for drivers" onClick={() => setView('driver')} />
      </div>
    </div>
  );
};

export default SafetyCheckupPage;
