import React, { useEffect, useMemo, useState } from 'react';

type SafetyCheckupPageProps = {
  onBack: () => void;
};

type View = 'main' | 'help' | 'trusted' | 'pin' | 'ridecheck' | 'driver';

type TrustedContact = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  email?: string;
  isPrimary?: boolean;
};

const BackIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const ChevronRight = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const CheckCircle: React.FC<{ checked?: boolean }> = ({ checked }) => (
  <span className={`safety-check-circle ${checked ? 'checked' : ''}`}>{checked ? '✓' : ''}</span>
);

const ListRow: React.FC<{
  title: string;
  subtitle: string;
  checked?: boolean;
  onClick: () => void;
}> = ({ title, subtitle, checked, onClick }) => (
  <div className="safety-row" onClick={onClick} role="button" tabIndex={0}>
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

function loadTrustedContacts(): TrustedContact[] {
  try {
    const raw = localStorage.getItem('trustedContacts');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveTrustedContacts(list: TrustedContact[]) {
  localStorage.setItem('trustedContacts', JSON.stringify(list));
}

function genId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function genPin(): string {
  // 4-digit numeric PIN
  const n = Math.floor(Math.random() * 9000) + 1000;
  return String(n);
}

const SafetyCheckupPage: React.FC<SafetyCheckupPageProps> = ({ onBack }) => {
  const [view, setView] = useState<View>('main');

  // Trusted contacts
  const [contacts, setContacts] = useState<TrustedContact[]>(() => loadTrustedContacts());
  const primaryId = useMemo(() => contacts.find((c) => c.isPrimary)?.id, [contacts]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', address: '', email: '' });

  // Toggles
  const [rideCheckEnabled, setRideCheckEnabled] = useState<boolean>(() => localStorage.getItem('rideCheckEnabled') === 'true');
  const [pinEnabled, setPinEnabled] = useState<boolean>(() => localStorage.getItem('pinEnabled') === 'true');
  const [pinCode, setPinCode] = useState<string>(() => localStorage.getItem('pinCode') || '');

  useEffect(() => {
    saveTrustedContacts(contacts);
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
    if (pinCode) localStorage.setItem('pinCode', pinCode);
  }, [pinCode]);

  const header = (title: string, backTo?: View) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px 14px' }}>
      <button
        className="sheet-action-btn btn-message"
        style={{ width: 44, height: 44, padding: 0 }}
        onClick={() => {
          if (backTo) setView(backTo);
          else onBack();
        }}
      >
        {BackIcon}
      </button>
      <div style={{ fontSize: 18, fontWeight: 800 }}>{title}</div>
    </div>
  );

  const setPrimary = (id: string) => {
    setContacts((prev) => prev.map((c) => ({ ...c, isPrimary: c.id === id })));
  };

  const removeContact = (id: string) => {
    setContacts((prev) => {
      const next = prev.filter((c) => c.id !== id);
      // If we removed the primary contact, set a new one if any remain.
      if (!next.some((c) => c.isPrimary) && next.length > 0) {
        next[0] = { ...next[0], isPrimary: true };
      }
      return next;
    });
  };

  const submitContact = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) return;
    const next: TrustedContact = {
      id: genId(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim() || undefined,
      email: form.email.trim() || undefined,
      isPrimary: contacts.length === 0,
    };
    setContacts((prev) => [...prev, next]);
    setShowAddContact(false);
    setForm({ firstName: '', lastName: '', phone: '', address: '', email: '' });
  };

  if (view === 'help') {
    return (
      <div style={{ paddingTop: 8 }}>
        {header('Safety help', 'main')}
        <div className="card safety-card" style={{ margin: '0 16px 16px', padding: 18 }}>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 10 }}>Open the Safety Toolkit</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
            If you ever need safety help during a trip, go to the Account page and tap the <b>red safety alarm</b> button
            on the map to open your Safety Toolkit. This will allow you to either contact your trusted contact or contact
            emergency services.
          </div>
        </div>
      </div>
    );
  }

  if (view === 'trusted') {
    return (
      <div style={{ paddingTop: 8 }}>
        {header('Trusted contacts', 'main')}

        <div className="card safety-card" style={{ margin: '0 16px 12px', padding: 16 }}>
          <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Share your trip status</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginBottom: 14 }}>
            You’ll be able to share your live location with one or more contacts during any Samudhyan ride.
          </div>

          <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>Set your emergency contacts</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
            You can make a trusted contact an emergency contact, too. Samudhyan ride can call them if we can’t reach you
            in case of an emergency.
          </div>
        </div>

        <div className="card safety-card" style={{ margin: '0 16px 12px', padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontWeight: 900 }}>Your contacts</div>
            <button className="sheet-action-btn btn-accept" onClick={() => setShowAddContact(true)}>
              Add contact
            </button>
          </div>

          {contacts.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>No trusted contacts yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {contacts.map((c) => (
                <div key={c.id} className="trusted-contact-row">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800 }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.firstName} {c.lastName}
                      </span>
                      {c.isPrimary && <span className="primary-pill">Primary</span>}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>{c.phone}</div>
                    {(c.address || c.email) && (
                      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 4 }}>
                        {c.address ? c.address : ''}
                        {c.address && c.email ? ' • ' : ''}
                        {c.email ? c.email : ''}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      className={`sheet-action-btn ${c.isPrimary ? 'btn-message' : 'btn-accept'}`}
                      onClick={() => setPrimary(c.id)}
                      disabled={c.isPrimary}
                      style={{ opacity: c.isPrimary ? 0.6 : 1 }}
                    >
                      Set primary
                    </button>
                    <button className="sheet-action-btn btn-cancel" onClick={() => removeContact(c.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {primaryId && (
            <div style={{ marginTop: 12, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
              Primary contact will be used first when you choose “Contact trusted contact” from the Safety Toolkit.
            </div>
          )}
        </div>

        {showAddContact && (
          <div className="modal-backdrop" onClick={() => setShowAddContact(false)}>
            <div
              className="modal-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-trusted-contact-title"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
            >
              <div id="add-trusted-contact-title" style={{ fontWeight: 900, fontSize: 16, marginBottom: 10 }}>
                Add trusted contact
              </div>
              <div className="modal-grid">
                <label className="modal-field">
                  <span>First name</span>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    type="text"
                    autoComplete="given-name"
                  />
                </label>
                <label className="modal-field">
                  <span>Last name</span>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                    type="text"
                    autoComplete="family-name"
                  />
                </label>
                <label className="modal-field">
                  <span>Phone number</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </label>
                <label className="modal-field">
                  <span>Address (optional)</span>
                  <input
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                    type="text"
                    autoComplete="street-address"
                  />
                </label>
                <label className="modal-field">
                  <span>Email (optional)</span>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    type="email"
                    autoComplete="email"
                  />
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button type="button" className="sheet-action-btn btn-cancel" onClick={() => setShowAddContact(false)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="sheet-action-btn btn-accept"
                  onClick={submitContact}
                  disabled={!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()}
                  style={{ opacity: !form.firstName.trim() || !form.lastName.trim() || !form.phone.trim() ? 0.55 : 1 }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (view === 'ridecheck') {
    return (
      <div style={{ paddingTop: 8 }}>
        {header('RideCheck', 'main')}

        <div className="card safety-card" style={{ margin: '0 16px 16px', padding: 18 }}>
          <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>What’s a RideCheck?</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginBottom: 16 }}>
            In the case of an unexpected event, Samudhyan ride will initiate a RideCheck, providing you with access to
            relevant safety tools so that you can quickly get the help you need.
          </div>

          <div className="toggle-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, marginBottom: 2 }}>RideCheck notifications</div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.4 }}>
                When turned on, we will send you a RideCheck notification if a trip doesn’t progress as planned.
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" checked={rideCheckEnabled} onChange={(e) => setRideCheckEnabled(e.target.checked)} />
              <span className="slider" />
            </label>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'pin') {
    return (
      <div style={{ paddingTop: 8 }}>
        {header('PIN verification', 'main')}

        <div className="card safety-card" style={{ margin: '0 16px 16px', padding: 18 }}>
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 10 }}>Verify your trips</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginBottom: 18 }}>
            Help make sure you get into the right car by verifying your trip with a PIN. You will receive a unique PIN for
            each trip, which you will need to share with your driver when they pick you up in order for the trip to start.
          </div>

          <div className="toggle-row">
            <div style={{ flex: 1, fontWeight: 900 }}>Use PIN to verify trips</div>
            <label className="switch">
              <input
                type="checkbox"
                checked={pinEnabled}
                onChange={(e) => {
                  const next = e.target.checked;
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
              <div style={{ marginTop: 10, color: 'rgba(255,255,255,0.6)', fontSize: 12, lineHeight: 1.4 }}>
                (UI only)
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'driver') {
    return (
      <div style={{ paddingTop: 8 }}>
        {header('Driver safety standards', 'main')}

        <div className="card safety-card" style={{ margin: '0 16px 16px', padding: 18 }}>
          <div style={{ fontWeight: 900, fontSize: 22, marginBottom: 12 }}>Driver safety standards</div>

          <div className="safety-section">
            <div className="safety-section-title">Driver screening</div>
            <div className="safety-section-text">
              Before anyone can drive with Samudhyan ride, they have to pass a multi-step safety screening.*
            </div>
            <div className="safety-section-footnote">
              *The extent of the enhanced background check may be constrained by applicable regulations, laws and
              practices in the country.
            </div>
          </div>

          <div className="safety-section">
            <div className="safety-section-title">Real-time ID check</div>
            <div className="safety-section-text">
              Drivers have to submit photos of themselves periodically so that we can verify that the right person is behind
              the wheel.
            </div>
          </div>

          <div className="safety-section">
            <div className="safety-section-title">Vehicle requirements</div>
            <div className="safety-section-text">
              Drivers and vehicles must be insured and their vehicles have to be in safe working condition and meet age and
              type requirements. Other rules may vary by city.
            </div>
          </div>

          <div className="safety-section">
            <div className="safety-section-title">Safety resources</div>
            <div className="safety-section-text">
              Drivers have access to resources on topics such as safe driving, handling conflicts with riders, and sexual
              harassment and misconduct.
            </div>
            <div className="safety-section-text" style={{ marginTop: 10 }}>
              We also partner with advocate organisations to raise awareness of safety issues, provide road safety tips and
              help prevent violence in our communities.
            </div>
          </div>

          <div className="safety-section">
            <div className="safety-section-title">Driving-time limits</div>
            <div className="safety-section-text">
              The Samudhyan ride app limits how long a driver can use Samudhyan ride before they have to take a break.
              They must stop driving for a set amount of time before they can start taking trips again.
            </div>
          </div>

          <div className="safety-section">
            <div className="safety-section-title">Speed limit alerts</div>
            <div className="safety-section-text">
              The Samudhyan ride app can show drivers the speed limit and alert them if they’re speeding.
            </div>
          </div>

          <button className="sheet-action-btn btn-accept" style={{ width: '100%', marginTop: 10 }} onClick={() => setView('main')}>
            Got it
          </button>
        </div>
      </div>
    );
  }

  // main
  return (
    <div style={{ paddingTop: 8 }}>
      {header('Safety check-up')}

      <div className="card safety-card" style={{ margin: '0 16px 14px', padding: 18 }}>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Safety check-up</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
          To help keep yourself safe on every trip, review your current safety settings.
        </div>
      </div>

      <div className="card safety-card safety-list-card" style={{ margin: '0 16px 16px', padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px 10px', fontWeight: 900, color: 'rgba(255,255,255,0.9)' }}>Safety settings</div>

        <ListRow
          title="Safety help"
          subtitle="Learn how to get help during a trip"
          checked
          onClick={() => setView('help')}
        />
        <div className="safety-row-divider" />
        <ListRow
          title="Trusted contacts"
          subtitle="Choose friends or family so you can quickly share your location, trip status and other details"
          checked={contacts.length > 0}
          onClick={() => setView('trusted')}
        />
        <div className="safety-row-divider" />
        <ListRow
          title="PIN verification"
          subtitle="Secure your trip by requiring a simple code to help ensure you get into the right car every time"
          checked={pinEnabled}
          onClick={() => setView('pin')}
        />
        <div className="safety-row-divider" />
        <ListRow
          title="RideCheck"
          subtitle="Receiving automatic check-ins and help notifications if your ride goes off course or is disrupted"
          checked={rideCheckEnabled}
          onClick={() => setView('ridecheck')}
        />
        <div className="safety-row-divider" />
        <ListRow
          title="Driver safety standards"
          subtitle="Learn about our safety standards for drivers"
          onClick={() => setView('driver')}
        />
      </div>
    </div>
  );
};

export default SafetyCheckupPage;