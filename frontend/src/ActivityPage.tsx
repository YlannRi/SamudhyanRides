// Reason why navbar goes weird is because it has a scroll bar on the right
// Removed RouteRow for now because it's surplus

import React, {useRef, useState} from 'react';
import './ActivityPage.css';
import {Btn, DetailRow, Icons, MapPlaceholder} from './App.tsx'
import {RideRenderMap} from './components/Map/RideRenderMap';

type Trip = {
  id: number;
  ride_id?: number;
  destination?: string;
  username?: string;
  drivername?: string;
  time?: string;
  price?: string;
  numberPassengers?: number;
  rating?: number;
  action: 'More';
  status?: 'upcomingDriver' | 'upcomingUser' | 'requested' | 'pastUser' | 'passengerRequest' | 'pastDriver' | 'activeUser' | 'activeDriver' | 'cancelled';
  numberplate?: string;
  model?: string;
  pickup_lat?: number;
  pickup_lng?: number;
  passengers?: any[];
};







const RATING_LABELS: Record<number, string> = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent' };


// ── Rating UI ──────────────────────────────────────────────────
const RatingUI: React.FC<{
  target: { name: string; role: 'driver' | 'passenger' };

  // BACKEND REQUIRED
  // When submitting a rating:
  //
  //
  // Backend should:
  // - Save rating
  // - Update user's average rating
  // - Mark trip as "rated"
  // - Prevent duplicate ratings (shouldn't be an issue based on frontend design)
  //
  // After success, refetch trip data.

  onSubmit: (r: number) => void;
  onClose: () => void;
}> = ({ target, onSubmit, onClose }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const display = hovered || selected;
  return (
    <div className="rating-modal-content">
      <div className="rating-avatar">{target.name[0]}</div>
      <div className="rating-title">How was your trip?</div>
      <div className="rating-subtitle">
        Rate your {target.role === 'driver' ? 'driver' : 'passenger'},{' '}
        <span className="rating-name">{target.name}</span>
      </div>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            className={`rating-star${n <= display ? ' rating-star-filled' : ''}`}
            onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
            onClick={() => setSelected(n)} aria-label={`${n} star`}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              fill={n <= display ? '#fbbf24' : 'none'} stroke={n <= display ? '#fbbf24' : 'rgba(255,255,255,0.25)'}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        ))}
      </div>
      <div className={`rating-label${display ? ' rating-label-visible' : ''}`}>
        {display ? RATING_LABELS[display] : '‎'}
      </div>
      <div className="rating-modal-actions">
        <button type="button" className="rating-btn-cancel" onClick={onClose}>Cancel</button>
        <button
          type="button"
          className={`rating-btn-submit${selected ? ' rating-btn-submit-active' : ''}`}
          onClick={() => selected && onSubmit(selected)} disabled={!selected}>
          Submit Rating
        </button>
      </div>
    </div>
  );
};

// ── Report UI ──────────────────────────────────────────────────
const ReportUI: React.FC<{

  // BACKEND REQUIRED
  // Send trip report:
  //
  //
  // Backend should:
  // - Store report
  // - Link to trip + involved users? (Not necessary for video)

  onSubmit: (text: string) => void;
  onClose: () => void
}> = ({ onSubmit, onClose }) => {
  const [text, setText] = useState('');

  return (
    <div className="rating-modal-content">
      <div className="report-icon-wrap">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
      <div className="rating-title">Report an Issue</div>
      <div className="rating-subtitle">Describe what happened and we'll look into it</div>
      <textarea
        className="report-textarea"
        placeholder="Tell us what went wrong…"
        value={text}
        onChange={e => setText(e.target.value)}
        rows={4}
      />
      <div className="rating-modal-actions">
        <button type="button" className="rating-btn-cancel" onClick={onClose}>Cancel</button>
        <button
          type="button"
          className={`rating-btn-submit report-btn${text.trim() ? ' rating-btn-submit-active report-btn-active' : ''}`}
          onClick={() => text.trim() && onSubmit(text)} disabled={!text.trim()}>
          Send Report
        </button>
      </div>
    </div>
  );
};

// Confirm UI (sorts out cancel / accept / deny / remove)
const ConfirmUI: React.FC<{
  icon: string; iconColor: string; title: string; body: string;
  confirmLabel: string; confirmCls: string;
  onConfirm: () => void; onClose: () => void;
}> = ({ icon, iconColor, title, body, confirmLabel, confirmCls, onConfirm, onClose }) => (
  <div className="rating-modal-content">
    <div className="confirm-icon" style={{ color: iconColor }}>{icon}</div>
    <div className="rating-title">{title}</div>
    <div className="rating-subtitle">{body}</div>
    <div className="rating-modal-actions" style={{ marginTop: 8 }}>
      <button type="button" className="rating-btn-cancel" onClick={onClose}>Go Back</button>
      <button type="button" className={`rating-btn-submit rating-btn-submit-active ${confirmCls}`} onClick={onConfirm}>
        {confirmLabel}
      </button>
    </div>
  </div>
);



// Master modal shell
type ModalState =
  | { type: 'rating'; target: { name: string; role: 'driver' | 'passenger' } }
  | { type: 'report' }
  | { type: 'cancel'; title: string; body: string; actionType: 'cancelBooking' | 'cancelRide'; targetId: number }
  | { type: 'accept'; passengerName: string; bookingId: number }
  | { type: 'deny'; passengerName: string; bookingId: number }
  | { type: 'remove'; passengerName: string; bookingId: number }
  | { type: 'success'; icon: string; title: string; sub: string }
  | { type: 'start'; title: string; body: string; targetId: number };


// What comes up when driver kicks, rates etc
const Modal: React.FC<{
  state: ModalState;
  onClose: () => void;
  onDone: () => void;      // close sheet + return to activity
  onConfirmAction?: () => Promise<boolean>;
}> = ({ state, onClose, onDone, onConfirmAction }) => {

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [inner, setInner] = useState<ModalState>(state);

  const succeed = (icon: string, title: string, sub: string) => {
    setInner({ type: 'success', icon, title, sub });
    setTimeout(onDone, 1400);
  };

  const isSuccess = inner.type === 'success';

  const modalTitle = (() => {
    switch (inner.type) {
      case 'rating':
        return 'How was your trip?';
      case 'report':
        return 'Report an Issue';
      case 'cancel':
      case 'start':
        return inner.title;
      case 'accept':
        return `Accept ${inner.passengerName}?`;
      case 'deny':
        return `Deny ${inner.passengerName}?`;
      case 'remove':
        return `Remove ${inner.passengerName}?`;
      case 'success':
        return inner.title;
      default:
        return 'Dialog';
    }
  })();

  React.useEffect(() => {
    // Move focus into the dialog when it opens
    window.setTimeout(() => dialogRef.current?.focus(), 0);
  }, []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isSuccess) return;
      e.preventDefault();
      onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSuccess, onClose]);

  const srOnly: React.CSSProperties = {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  };

  return (
    <>
      <div className="rating-modal-overlay" onClick={isSuccess ? undefined : onClose} />
      <div
        ref={dialogRef}
        className={`rating-modal${isSuccess ? ' rating-modal-submitted' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-modal-title"
        tabIndex={-1}
      >
        <h2 id="activity-modal-title" style={srOnly}>
          {modalTitle}
        </h2>
        <div className="rating-modal-handle-area"><div className="sheet-handle" /></div>

        {isSuccess && inner.type === 'success' ? (
          <div className="rating-success">
            <div className="rating-success-icon" style={{ fontSize: 40 }}>{inner.icon}</div>
            <div className="rating-success-title">{inner.title}</div>
            <div className="rating-success-sub">{inner.sub}</div>
          </div>
        ) : inner.type === 'rating' ? (
          <RatingUI
            target={inner.target}
            onSubmit={() => succeed('⭐', 'Rating Submitted!', 'Thanks for your feedback')}
            onClose={onClose}
          />
        ) : inner.type === 'report' ? (
          <ReportUI
            onSubmit={() => succeed('✅', 'Report Sent', 'Thanks for letting us know — we\'ll look into it')}
            onClose={onClose}
          />
        ) : inner.type === 'cancel' ? (
          <ConfirmUI
            // BACKEND REQUIRED
            // Cancel trip:
            //
            // Backend must:
            // - Update trip status
            // - Notify driver/passengers
            // - Handle "refund"
            // - Prevent cancelling past trips
            //
            // After success, refetch trip lists.
            icon="🚫" iconColor="#f87171"
            title={inner.title} body={inner.body}
            confirmLabel="Yes, Cancel" confirmCls="btn-confirm-cancel"
            onConfirm={async () => {
              if (onConfirmAction) {
                const ok = await onConfirmAction();
                if (!ok) return;
              }
              succeed('🚫', 'Trip Cancelled', 'Your trip has been cancelled successfully');
            }}
            onClose={onClose}
          />
        ) : inner.type === 'start' ? (
          <ConfirmUI
            // BACKEND REQUIRED
            // start trip:
            //
            // Backend must:
            // - Update trip status
            // - Notify driver/passengers
            // - Prevent starting past trips
            //
            // After success, refetch trip lists.
            icon="🏁" iconColor="#f87171"
            title={inner.title} body={inner.body}
            confirmLabel="Yes, Start" confirmCls="btn-confirm-accept"
            onConfirm={async () => {
              if (onConfirmAction) {
                const ok = await onConfirmAction();
                if (!ok) return;
              }
              succeed('🏁', 'Trip Started', 'Your trip has started successfully');
            }}
            onClose={onClose}
          />
        ) : inner.type === 'accept' ? (
          <ConfirmUI
            // BACKEND REQUIRED
            // Accept passenger request:
            //
            // Backend must:
            // - Add passenger to trip
            // - Update seat count
            // - Change request status to upcoming
            // - Notify passenger
            // - Make sure valid
            icon="✅" iconColor="#4ade80"
            title={`Accept ${inner.passengerName}?`}
            body={`${inner.passengerName} will be notified that their request has been accepted.`}
            confirmLabel="Accept Request" confirmCls="btn-confirm-accept"
            onConfirm={async () => {
              if (onConfirmAction) {
                const ok = await onConfirmAction();
                if (!ok) return;
              }
              succeed('✅', 'Request Accepted!', `${inner.passengerName} has been added to your trip`);
            }}
            onClose={onClose}
          />
        ) : inner.type === 'deny' ? (
          <ConfirmUI
            // BACKEND REQUIRED
            // Deny passenger request:
            //
            // Backend must:
            // - Update request status (remove from requested)
            // - Notify passenger
            icon="❌" iconColor="#f87171"
            title={`Deny ${inner.passengerName}?`}
            body={`${inner.passengerName} will be notified that their request has been declined.`}
            confirmLabel="Deny Request" confirmCls="btn-confirm-cancel"
            onConfirm={async () => {
              if (onConfirmAction) {
                const ok = await onConfirmAction();
                if (!ok) return;
              }
              succeed('❌', 'Request Denied', `${inner.passengerName}'s request has been declined`);
            }}
            onClose={onClose}
          />
        ) : inner.type === 'remove' ? (
          <ConfirmUI
            // BACKEND REQUIRED
            // Remove passenger from trip:
            //
            // Backend must:
            // - Remove passenger
            // - Update seat availability
            // - Notify passenger
            // - refund?
            icon="🗑" iconColor="#f87171"
            title={`Remove ${inner.passengerName}?`}
            body={`${inner.passengerName} will be removed from your trip and notified.`}
            confirmLabel="Remove Passenger" confirmCls="btn-confirm-cancel"
            onConfirm={async () => {
              if (onConfirmAction) {
                const ok = await onConfirmAction();
                if (!ok) return;
              }
              succeed('🗑️', 'Passenger Removed', `${inner.passengerName} has been removed from your trip`);
            }}
            onClose={onClose}
          />
        ) : null}
      </div>
    </>
  );
};




// Passenger Carousel - when driver views past and upcoming users at bottom
type Passenger = {
  id: number;
  name: string;
  rating?: number;
  pickupLocation?: string;
  cost?: string;
  rated?: boolean;
  triprated?: number;
};

const PassengerCarousel: React.FC<{
  passengers: Passenger[];
  isPast: boolean;
  onRatePassenger?: (p: Passenger) => void;
  onRemovePassenger?: (p: Passenger) => void;
}> = ({ passengers, isPast, onRatePassenger, onRemovePassenger }) => {
  const [idx, setIdx] = useState(0);

  // ADD THIS EARLY RETURN CHECK
  if (!passengers || passengers.length === 0) {
    return (
      <div className="passenger-card" style={{ display: 'flex', justifyContent: 'center', padding: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
        No passengers yet.
      </div>
    );
  }

  const p = passengers[idx];
  const total = passengers.length;

  return (
    <div className="passenger-carousel">
      {total > 1 && (
        <div className="passenger-tabs">
          {passengers.map((pass, i) => (
            <button key={pass.id}
              className={`passenger-tab${i === idx ? ' passenger-tab-active' : ''}`}
              onClick={() => setIdx(i)}>
              {pass.name.split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      <div className="passenger-card">
        <div className="passenger-card-header">
          <div className="passenger-avatar">{p.name[0]}</div>
          <div className="passenger-info">
            <div className="passenger-name">{p.name}</div>
            {p.rating !== undefined
              ? <div className="passenger-rating">⭐ {p.rating}</div>
              : <div className="passenger-rating no-rating">No rating yet</div>
            }
          </div>
        </div>

        <div className="sheet-details-card passenger-details">
          <DetailRow label="Pick Up" value={p.pickupLocation} />
          <DetailRow label="Cost" value={p.cost} valueClass="detail-price" />
          {isPast && p.rated && (
            <DetailRow label="Trip Rating" value={`⭐ ${p.triprated}`} valueClass="passenger-rating" />
          )}
        </div>

        <div className="passenger-actions">
          <Btn cls="btn-message" icon={Icons.message} label="Message" small />
          {isPast ? (
            <>
              {!p.rated && (
                <Btn cls="btn-rate" icon={Icons.star} label="Rate" small onClick={() => onRatePassenger?.(p)} />
              )}
            </>
          ) : (
            <Btn cls="btn-cancel" icon={Icons.remove} label="Remove" small onClick={() => onRemovePassenger?.(p)} />
          )}
        </div>
      </div>
    </div>
  );
};



// Trip Details Panel - bit beneath the map when you press more
const TripDetailsPanel: React.FC<{ trip: Trip; mode: 'user' | 'Driver'; onClose: () => void }> = ({ trip, onClose }) => {
  const [closing, setClosing] = useState(false);
  const [modal, setModal] = useState<ModalState | null>(null);
  const touchStartY = useRef<number | null>(null);

  const close = () => { setClosing(true); setTimeout(onClose, 320); };
  const openModal = (m: ModalState) => setModal(m);
  const closeModal = () => setModal(null);
  // Called when action is confirmed + success shown — dismiss modal then sheet
  const doneModal = () => { setModal(null); close(); };

// 1. Add 'startRide' to the type signature
const handleAction = async (type: 'accept' | 'deny' | 'cancelBooking' | 'removePassenger' | 'cancelRide' | 'startRide', targetId: number) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error("No token found");

    let endpoint = '';
    let method = 'DELETE';
    let body: string | undefined = undefined; // <-- Add support for JSON bodies

    switch (type) {
      case 'accept':
        endpoint = `https://localhost:8000/bookings/${targetId}/accept`;
        method = 'PUT';
        break;
      case 'deny':
      case 'cancelBooking':
      case 'removePassenger':
        endpoint = `https://localhost:8000/bookings/${targetId}`;
        method = 'DELETE';
        break;
      case 'cancelRide':
        endpoint = `https://localhost:8000/rides/${targetId}`;
        method = 'DELETE';
        break;
      // 2. Add the startRide case
      case 'startRide':
        endpoint = `https://localhost:8000/rides/${targetId}`;
        method = 'PUT';
        body = JSON.stringify({ status: 'in_progress' });
        break;
    }

    // 3. Include headers and body in the fetch call
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {})
      },
      body
    });

    if (!response.ok) throw new Error(`${type} failed`);

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

  const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current !== null && e.changedTouches[0].clientY - touchStartY.current > 80) close();
    touchStartY.current = null;
  };

  const passengers = trip.passengers || [];

  const renderBody = () => {
    switch (trip.status) {

      /* Upcoming User */
      case 'upcomingUser':
        return (
          <>
            {/* <RouteRow destination={trip.destination ?? 'Destination'}/> */}
            <div className="sheet-details-card">
              <DetailRow label="Driver" value={trip.drivername ?? 'Pending'} />
              <DetailRow label="Destination" value={trip.destination ?? '—'} />
              <DetailRow label="Date & Arrival" value={trip.time ?? '—'} />
              <DetailRow label="Estimated leave" value="Pending" />
              <DetailRow label="Cost" value={trip.price ?? '—'} valueClass="detail-price" />
            </div>
            <div className="sheet-actions">
              <Btn cls="btn-message" icon={Icons.message} label="Message Driver" />
              <Btn cls="btn-cancel" icon={Icons.cancel} label="Cancel Trip"
                onClick={() => openModal({
                  type: 'cancel',
                  title: 'Cancel this trip?',
                  body: 'Are you sure you want to cancel your upcoming trip? The driver will be notified.',
                  actionType: 'cancelBooking',
                  targetId: trip.id
                })} />
            </div>
          </>
        );

      /* Requested  */
      case 'requested':
        return (
          <>
            {/* <RouteRow destination={trip.destination ?? 'Destination'}/> */}
            <div className="sheet-details-card">
              <DetailRow label="Driver" value={trip.drivername ?? 'Pending'} />
              <DetailRow label="Destination" value={trip.destination ?? '—'} />
              <DetailRow label="Be There For" value={trip.time ?? '—'} />
              <DetailRow label="Cost" value={trip.price ?? '—'} valueClass="detail-price" />
            </div>
            <div className="sheet-actions">
              <Btn cls="btn-message" icon={Icons.message} label="Message Driver" />
              <Btn cls="btn-cancel" icon={Icons.cancel} label="Cancel Trip"
                onClick={() => openModal({
                  type: 'cancel',
                  title: 'Cancel this request?',
                  body: 'Are you sure you want to cancel your trip request? The driver will be notified.',
                  actionType: 'cancelBooking',
                  targetId: trip.id
                })} />
            </div>
          </>
        );

      /* Past User */
      case 'pastUser':
        return (
          <>
            <div className="sheet-details-card">
              <DetailRow label="Driver" value={trip.drivername ?? '—'} />
              <DetailRow label="Destination" value={trip.destination ?? '—'} />
              <DetailRow label="Pick Up Time" value={trip.time ?? '—'} />
              <DetailRow label="Arrival Time" value="09:45" />
              <DetailRow label="Cost" value={trip.price ?? '—'} valueClass="detail-price" />
              {trip.rating !== undefined && (
                <DetailRow label="Your Rating" value={`⭐ ${trip.rating}`} />
              )}
            </div>
            <div className="sheet-actions">
              <Btn cls="btn-message" icon={Icons.message} label="Message Driver" />
              {trip.rating === undefined && (
                <Btn cls="btn-rate" icon={Icons.star} label="Rate Trip"
                  onClick={() => openModal({
                    type: 'rating',
                    target: { name: trip.drivername ?? 'Your Driver', role: 'driver' }
                  })} />
              )}
              <Btn cls="btn-report" icon={Icons.report} label="Report Issue"
                onClick={() => openModal({ type: 'report' })} />
            </div>
          </>
        );

      /* Upcoming Driver */
      case 'upcomingDriver':
        return (
          <>
            <div className="sheet-details-card">
              <DetailRow label="Destination" value={trip.destination ?? '—'} />
              <DetailRow label="Departure" value={trip.time ?? '—'} />
              <DetailRow label="Est. Arrival" value="~09:45" />
            </div>
            <div className="passenger-section-label">
              Passengers <span className="passenger-count-badge">{passengers.length}</span>
            </div>
            <PassengerCarousel
              passengers={passengers}
              isPast={false}
              onRemovePassenger={(p) => openModal({ type: 'remove', passengerName: p.name, bookingId: p.id })}
            />
            <div className="sheet-actions" style={{ marginTop: 12 }}>
              <Btn cls="btn-cancel" icon={Icons.cancel} label="Cancel Whole Trip"
                onClick={() => openModal({
                  type: 'cancel',
                  title: 'Cancel whole trip?',
                  body: 'This will cancel your trip for all passengers. Everyone will be notified.',
                  actionType: 'cancelRide',
                  targetId: trip.ride_id!
                })} />
            </div>
            <div className="sheet-actions" style={{ marginTop: 12 }}>
              {/* Backend required here to move upcoming into active */}
              <Btn cls="btn-accept" icon={Icons.accept} label="Begin Ride"
                onClick={() => openModal({
                  type: 'start',
                  title: 'Start whole trip?',
                  body: 'This will start your trip and notify users.',
                  targetId: trip.ride_id!
                })} />
            </div>
          </>
        );

      /* Passenger Request */
      case 'passengerRequest':
        return (
          <>
            <div className="sheet-details-card">
              <DetailRow label="Passenger" value={trip.username ?? '—'} />
              {trip.rating !== undefined && (
                <DetailRow label="Rating" value={`⭐ ${trip.rating}`} />
              )}
              <DetailRow label="Destination" value={trip.destination ?? '—'} />
              <DetailRow label="Drop Off By" value={trip.time ?? '—'} />
              <DetailRow label="Cost" value={trip.price ?? '—'} valueClass="detail-price" />
            </div>
            <div className="sheet-actions">
              <Btn cls="btn-message" icon={Icons.message} label="Message Passenger" />
              <Btn cls="btn-accept" icon={Icons.accept} label="Accept Request"
                onClick={() => openModal({ type: 'accept', passengerName: trip.username ?? 'Passenger', bookingId: trip.id })} />
              <Btn cls="btn-cancel" icon={Icons.cancel} label="Deny Request"
                onClick={() => openModal({ type: 'deny', passengerName: trip.username ?? 'Passenger', bookingId: trip.id })} />
            </div>
          </>
        );

      /* Past Driver */
      case 'pastDriver':
        return (
          <>
            <div className="sheet-details-card">
              <DetailRow label="Destination" value={trip.destination ?? '—'} />
              <DetailRow label="Departure" value={trip.time ?? '—'} />
              <DetailRow label="Arrival" value="~09:45" />
            </div>
            <div className="passenger-section-label">
              Passengers <span className="passenger-count-badge">{passengers.length}</span>
            </div>
            <PassengerCarousel
              passengers={passengers}
              isPast={true}
              onRatePassenger={(p) => openModal({ type: 'rating', target: { name: p.name, role: 'passenger' } })}
            />
            <div className="sheet-actions" style={{ marginTop: 12 }}>
              <Btn cls="btn-report" icon={Icons.report} label="Report Issue"
                onClick={() => openModal({ type: 'report' })} />
            </div>
          </>
        );

      default: return null;
    }
  };

  return (
    <>
      <div className={`sheet-overlay${closing ? ' overlay-closing' : ''}`} onClick={close} />
      <div
        className={`trip-sheet${closing ? ' sheet-closing' : ''}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="sheet-handle-area"><div className="sheet-handle" /></div>
        <div className="sheet-scroll">
          <div className="sheet-header">
            <button className="sheet-back-btn" onClick={close}>{Icons.back} Back</button>
            <h2 className="sheet-title">Trip Details</h2>
            <div style={{ width: 60 }} />
          </div>

          {trip.ride_id ? (
            <RideRenderMap
              rideId={trip.ride_id}
              height="300px"
              interactive={true}
              existingPickup={trip.pickup_lat && trip.pickup_lng ? { lat: trip.pickup_lat, lng: trip.pickup_lng } : undefined}
            />
          ) : (
            <MapPlaceholder />
          )}

          {renderBody()}
          <div style={{ height: 32 }} />
        </div>
      </div>

      {modal && (
        <Modal
          state={modal}
          onClose={closeModal}
          onDone={doneModal}
          onConfirmAction={async () => {
            if (modal.type === 'accept' || modal.type === 'deny') {
              return await handleAction(modal.type, modal.bookingId);
            }
            if (modal.type === 'cancel') {
              return await handleAction(modal.actionType, modal.targetId);
            }
            if (modal.type === 'remove') {
              return await handleAction('removePassenger', modal.bookingId);
            }
            if (modal.type === 'start') {
              return await handleAction('startRide', modal.targetId);
            }
            return true;
          }}
        />
      )}
    </>
  );
};


// Trip Section - What is first seen on activity page
type TripSectionProps = {
  title: string; trips: Trip[]; emptyTitle: string; emptySubtitle: string; emptyIcon: string;
  collapsible?: boolean; mode: 'user' | 'Driver'; onTripMore: (t: Trip) => void; showFilter?: boolean;
};

const TripSection: React.FC<TripSectionProps> = ({
  title, trips, emptyTitle, emptySubtitle, emptyIcon, collapsible = false, onTripMore, showFilter,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Cost');
  const [filterOpen, setFilterOpen] = useState(false);
  const visible = collapsible && !expanded ? trips.slice(0, 3) : trips;

  return (
    <section className="uber-section">
      <div className="section-header-row">
        <h2 className="section-title">{title}</h2>
        {showFilter && (
          <div className="filter-container">
            <button className="filter-button" onClick={() => setFilterOpen(o => !o)}>{selectedFilter} ▾</button>
            {filterOpen && (
              <div className="filter-dropdown">
                {['Cost', 'Rating', 'Ease'].map(opt => (
                  <div key={opt} className="filter-option" onClick={() => { setSelectedFilter(opt); setFilterOpen(false); }}>{opt}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {trips.length === 0 ? (
        <div className="card activity-upcoming-card">
          <div>
            <div className="activity-upcoming-title">{emptyTitle}</div>
            <div className="activity-upcoming-subtitle">{emptySubtitle}</div>
          </div>
          <div className="activity-upcoming-icon">{emptyIcon}</div>
        </div>
      ) : (
        <>
          <div className="past-list">
            {visible.map(trip => (
              <div key={trip.id} className="card trip-row-card">
                <div className="trip-row-left">
                  <div className="trip-car-icon">🚗</div>
                  <div className="trip-row-text">
                    <div className="trip-row-title">{trip.destination ?? trip.username ?? 'Trip'}</div>
                    <div className="trip-row-meta">{trip.time}</div>
                    {trip.drivername && <div className="trip-row-meta">{trip.drivername}</div>}
                    {trip.username && <div className="trip-row-meta">{trip.username}</div>}
                    {trip.numberPassengers !== undefined && <div className="trip-row-meta">Passengers: {trip.numberPassengers}</div>}
                    <div className="trip-row-price">
                      {trip.price}
                      {trip.rating !== undefined && <> – <span className="trip-row-rating">⭐ {trip.rating}</span></>}
                    </div>
                  </div>
                </div>
                <button className="pill pill-solid trip-row-button" onClick={() => onTripMore(trip)}>{trip.action}</button>
              </div>
            ))}
          </div>
          {collapsible && trips.length > 3 && (
            <div className="see-more-container">
              <button className="see-more-button" onClick={() => setExpanded(e => !e)}>
                {expanded ? 'See less' : 'See more'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};



// BACKEND REQUIRED
// On component mount:
//
// - Fetch all trip categories for current user
// - Use authentication token (JWT/session)
// - Store in state instead of mock arrays
//
// Also handle:
// - Loading states
// - Error states
// - Refresh after actions

// Putting trip sections altogether with titles
type ActivityPageProps = {
  canUseDriverMode: boolean;
  onDriverSignup: () => void;
};
const ActivityPage: React.FC<ActivityPageProps> = ({ canUseDriverMode, onDriverSignup }) => {
  const [mode, setMode] = useState<'user' | 'Driver'>('user');
  React.useEffect(() => {
  if (!canUseDriverMode && mode === 'Driver') setMode('user');
}, [canUseDriverMode, mode]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const [bookings, setBookings] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error("No token found");

      if (mode === 'user') {
        const response = await fetch('https://localhost:8000/bookings/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch rider activity");
        const data = await response.json();

        const transformed: Trip[] = data.map((b: any) => {
          // Fallback to check 'rides' or 'ride' depending on Supabase structure
          const rideData = b.ride || {};

          return {
            id: b.id,
            ride_id: b.ride_id,
            username: rideData.driver?.first_name ? `${rideData.driver.first_name} ${rideData.driver.last_name}` :
              b.passenger_name || `User ${b.user_id?.substring(0, 4)}`,
            destination: b.dropoff_location || rideData.destination || 'Destination',
            time: b.pickup_time || rideData.departure_time || 'Pending',
            price: `£${b.price || '0.00'}`,

            // MAP STATUS HERE: Check the nested ride status to override the booking status
            status: b.status === 'pending' ? 'requested' :
              b.status === 'confirmed' ? (rideData.status === 'in_progress' ? 'activeUser' : 'upcomingUser') :
                b.status === 'completed' ? 'pastUser' : 'cancelled',

            action: 'More',
            pickup_lat: b.pickup_lat,
            pickup_lng: b.pickup_lng
          };
        }).filter((t: Trip) => t.status !== 'cancelled');
        setBookings(transformed);
      } else {
        const response = await fetch('https://localhost:8000/rides/driver/dashboard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch driver dashboard");
        const ridesData = await response.json();

        const finalDriverActivities: Trip[] = [];
        ridesData.forEach((ride: any) => {
          // Add the ride itself (for upcoming/past)
          finalDriverActivities.push({
            id: ride.id,
            ride_id: ride.id,
            destination: ride.destination,
            time: ride.departure_time,
            status: ride.status === 'completed' ? 'pastDriver' :
                    ride.status === 'in_progress' ? 'activeDriver' : 'upcomingDriver',
            action: 'More',
            numberPassengers: ride.seats_total - ride.seats_available,
            passengers: ride.bookings
              .filter((b: any) => b.status === 'confirmed')
              .map((b: any) => ({
                id: b.id,
                name: b.passenger ? `${b.passenger.first_name} ${b.passenger.last_name}` : 'Unknown',
                rating: b.passenger?.rider_rating,
                pickupLocation: b.pickup_location,
                cost: `£${b.price}`,
                rated: false // Placeholder for now
              }))
          });

          // Add each pending booking (for requests)
          ride.bookings.forEach((b: any) => {
            if (b.status === 'pending') {
              finalDriverActivities.push({
                id: b.id,
                ride_id: ride.id,
                username: b.passenger ? `${b.passenger.first_name} ${b.passenger.last_name}` : 'Unknown Passenger',
                destination: b.dropoff_location,
                time: b.pickup_time || ride.departure_time,
                price: `£${b.price}`,
                status: 'passengerRequest',
                action: 'More',
                pickup_lat: b.pickup_lat,
                pickup_lng: b.pickup_lng
              });
            }
          });
        });
        setBookings(finalDriverActivities);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchActivity();
  }, [mode]);

  // Filter combined activity based on role and status
  const driverRequests = bookings.filter(b => b.status === 'passengerRequest');
  const driverUpcoming = bookings.filter(b => b.status === 'upcomingDriver');
  const driverPast = bookings.filter(b => b.status === 'pastDriver');

  const riderUpcoming = bookings.filter(b => b.status === 'upcomingUser');
  const riderRequested = bookings.filter(b => b.status === 'requested');
  const riderPast = bookings.filter(b => b.status === 'pastUser');

  return (
    <>
      <header className="uber-header">
        <h1 className="activity-title">Activity</h1>
        <div className="top-toggle">
          <button className={`toggle-tab ${mode === 'user' ? 'toggle-tab-active' : ''}`} onClick={() => setMode('user')}>Rider</button>
          <button
  className={`toggle-tab ${mode === 'Driver' ? 'toggle-tab-active' : ''}`}
  onClick={() => {
    if (!canUseDriverMode) return onDriverSignup();
    setMode('Driver');
  }}
>
  Driver
</button>
        </div>
      </header>

      {loading && <p style={{ padding: '20px' }}>Loading activities...</p>}
      {error && <p style={{ padding: '20px', color: '#f87171' }}>Error: {error}</p>}

      {!loading && (
        <>
          <TripSection title="Upcoming" trips={mode === 'user' ? riderUpcoming : driverUpcoming}
            emptyTitle="You have no upcoming trips" emptySubtitle="Reserve your trip →" emptyIcon="📅"
            collapsible mode={mode} onTripMore={setSelectedTrip} />

          {mode === 'user' ? (
            <TripSection title="Requested" trips={riderRequested}
              emptyTitle="You have no requested trips" emptySubtitle="Book a reservation →" emptyIcon="🗓️"
              collapsible mode={mode} onTripMore={setSelectedTrip} />
          ) : (
            <TripSection title="Passenger Requests" trips={driverRequests}
              emptyTitle="You have no requests" emptySubtitle="Soon your ride will be booked" emptyIcon="🗓️"
              collapsible mode={mode} onTripMore={setSelectedTrip} showFilter />
          )}

          <TripSection title="Past" trips={mode === 'user' ? riderPast : driverPast}
            emptyTitle="No past trips yet" emptySubtitle="Your completed rides will appear here" emptyIcon="🕘"
            collapsible mode={mode} onTripMore={setSelectedTrip} />
        </>
      )}

      {selectedTrip && (
        <TripDetailsPanel trip={selectedTrip} mode={mode} onClose={() => {
          setSelectedTrip(null);
          fetchActivity(); // Refresh after potentially accepting/denying
        }} />
      )}
    </>
  );
};

export default ActivityPage;