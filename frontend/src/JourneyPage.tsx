import React, { useEffect, useState } from 'react';
import './JourneyPage.css';
import { DetailRow, Icons } from './App';
import { Btn } from './App.tsx';
import { RideRenderMap } from './components/Map/RideRenderMap';


// User Journey View
const UserJourney: React.FC<{ trips: any[]; onOpenChat?: (rideId: string, participantId?: string) => void }> = ({ trips, onOpenChat }) => {
  const [activeTripIdx, setActiveTripIdx] = useState(0);
  const [routeData, setRouteData] = useState<any>(null);

  if (trips.length === 0) {
    return (
      <div className="journey-content" style={{ alignItems: 'center', marginTop: '60px', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
        <h2 style={{ fontSize: '1.17em', margin: 0, fontWeight: 700 }}>No Active Journeys</h2>
        <p>You don't have any rides currently in progress.</p>
      </div>
    );
  }

  const trip = trips[activeTripIdx];
  const ride = trip.ride || {};
  const driver = ride.driver || {};
  const driverName = driver.first_name ? `${driver.first_name} ${driver.last_name}` : 'Unknown Driver';
  // Format departure time
  const departureDate = new Date(ride.departure_time || trip.pickup_time);
  let timeOfArrival = isNaN(departureDate.getTime()) ? 'Pending' : departureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Try to use calculated pickup time if routeData is available
  if (routeData && routeData.times && routeData.times.pickups) {
      const myPickup = routeData.times.pickups.find((p: any) => p.booking_ids && p.booking_ids.includes(trip.id));
      if (myPickup && myPickup.estimated_time) {
          const dt = new Date(myPickup.estimated_time);
          if (!isNaN(dt.getTime())) {
              timeOfArrival = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
      }
  }

  return (
    <div className="journey-content">
      {/* Multiple Active Rides Toggle */}
      {trips.length > 1 && (
        <div className="passenger-tabs">
          {trips.map((t, i) => (
            <button
              key={t.id}
              className={`passenger-tab ${i === activeTripIdx ? 'passenger-tab-active' : ''}`}
              onClick={() => setActiveTripIdx(i)}
            >
              Ride #{t.ride_id}
            </button>
          ))}
        </div>
      )}

      {/* Driver header card */}
      <div className="journey-driver-header">
        <div className="journey-driver-avatar">{driverName[0]}</div>
        <div className="journey-driver-info">
          <div className="journey-driver-name">{driverName}</div>
          <div className="journey-driver-sub">Your Driver</div>
        </div>
        <div className="journey-arriving-badge">
          {Icons.clock}
          <span>Departure {timeOfArrival}</span>
        </div>
      </div>

      {/* Map */}
      <div style={{ marginBottom: '16px' }}>
        <RideRenderMap 
          rideId={trip.ride_id} 
          height="300px" 
          interactive={true} 
          onRouteData={setRouteData}
          existingPickup={
            trip.pickup_lat && trip.pickup_lng
              ? { lat: trip.pickup_lat, lng: trip.pickup_lng }
              : undefined
          }
        />
      </div>

      {/* Pickup code */}
      <div className="journey-code-card">
        <span className="journey-code-label">Pick Up Code</span>
        <span className="journey-code-value">{trip.pickup_code || '----'}</span>
      </div>

      {/* Trip details */}
      <div className="journey-passenger-card">
        <DetailRow label="Destination" value={trip.dropoff_location || ride.destination || '—'} />
        <DetailRow label="Vehicle" value={trip.vehicle?.car_model ?? "Unknown Vehicle"} />
        <DetailRow label="Numberplate" value={trip.vehicle?.number_plate ?? "Not available"} />
        <DetailRow label={routeData ? "Estimated Pickup" : "Departure Time"} value={timeOfArrival} />
        <DetailRow label="Cost" value={`£2.00`} valueClass="detail-price" />
      </div>

      {/* Action */}
      <div className="journey-actions">
        <button className="sheet-action-btn btn-message" onClick={() => trip.ride_id && onOpenChat?.(String(trip.ride_id))}>
          {Icons.message} Message Driver
        </button>
        <Btn cls="btn-report" icon={Icons.report} label="Report Issue" />
      </div>
    </div>
  );
};

// ─── Driver Journey View ───────────────────────────────────────
const DriverJourney: React.FC<{ rides: any[], onComplete: (rideId: number) => void; onOpenChat?: (rideId: string, participantId?: string) => void }> = ({ rides, onComplete, onOpenChat }) => {
  const [activeRideIdx, setActiveRideIdx] = useState(0);
  const [currentPassIdx, setCurrentPassIdx] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [confirmedPickups, setConfirmedPickups] = useState<Set<number>>(new Set());
  const [isCompleting, setIsCompleting] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);

  if (rides.length === 0) {
    return (
      <div className="journey-content" style={{ alignItems: 'center', marginTop: '60px', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
        <h2 style={{ fontSize: '1.17em', margin: 0, fontWeight: 700 }}>No Active Drives</h2>
        <p>You are not currently driving any active routes.</p>
      </div>
    );
  }

  const activeRide = rides[activeRideIdx];
  const confirmedBookings = (activeRide.bookings || []).filter((b: any) => b.status === 'confirmed');
  const currentPassenger = confirmedBookings[currentPassIdx];
  const isConfirmed = currentPassenger && confirmedPickups.has(currentPassenger.id);

  const handleConfirm = () => {
    if (currentPassenger) {
      setConfirmedPickups(prev => new Set([...prev, currentPassenger.id]));
      setRefreshTrigger(prev => prev + 1);
    }
  };

  const handleCompleteRideClick = async () => {
    setIsCompleting(true);
    await onComplete(activeRide.id);
    setIsCompleting(false);
  };

  return (
    <div className="journey-content">
      {/* Multiple Active Rides Toggle */}
      {rides.length > 1 && (
        <div className="passenger-tabs" style={{ marginBottom: '16px' }}>
          {rides.map((r, i) => (
            <button
              key={r.id}
              className={`passenger-tab ${i === activeRideIdx ? 'passenger-tab-active' : ''}`}
              onClick={() => {
                setActiveRideIdx(i);
                setCurrentPassIdx(0); // Reset passenger index on ride change
              }}
            >
              Route: {r.destination}
            </button>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="journey-driver-mode-header">
        <div className="journey-mode-sub">Pick Up Order</div>
        {routeData && routeData.times && routeData.times.driver_leave && (
           <div className="journey-arriving-badge" style={{marginTop: '8px', display: 'inline-flex'}}>
             {Icons.clock}
             <span>Leave By {new Date(routeData.times.driver_leave).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
           </div>
        )}
      </div>

      {/* Passenger tabs */}
      {confirmedBookings.length > 0 ? (
        <div className="passenger-tabs">
          {confirmedBookings.map((b: any, i: number) => {
            const passName = b.passenger ? `${b.passenger.first_name} ${b.passenger.last_name}` : `Pass ${b.id}`;
            const isDone = confirmedPickups.has(b.id);
            return (
              <button
                key={b.id}
                className={`passenger-tab${i === currentPassIdx ? ' passenger-tab-active' : ''}${isDone ? ' passenger-tab-done' : ''}`}
                onClick={() => setCurrentPassIdx(i)}
              >
                {passName.split(' ')[0]}
                {isDone && <span className="tab-done-dot">✓</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
          No confirmed passengers for this ride.
        </p>
      )}

      {/* Map */}
      <div style={{ marginBottom: '16px', marginTop: '16px' }}>
        <RideRenderMap 
           rideId={activeRide.id} 
           height="300px" 
           interactive={true} 
           refreshTrigger={refreshTrigger} 
           driverMode={true}
           confirmedPickupIds={Array.from(confirmedPickups)}
           onRouteData={setRouteData}
        />
      </div>

      {/* Passenger card */}
      {currentPassenger && (
        <div className="journey-passenger-card">
          <div className="journey-passenger-header">
            <div className="journey-passenger-avatar">
              {currentPassenger.passenger?.first_name ? currentPassenger.passenger.first_name[0] : 'U'}
            </div>
            <div className="journey-passenger-info">
              <div className="journey-passenger-name">
                {currentPassenger.passenger ? `${currentPassenger.passenger.first_name} ${currentPassenger.passenger.last_name}` : 'Unknown'}
              </div>
              {currentPassenger.passenger?.rider_rating !== undefined ? (
                <div className="journey-passenger-rating">⭐ {currentPassenger.passenger.rider_rating}</div>
              ) : (
                <div className="journey-passenger-rating no-rating">No rating yet</div>
              )}
            </div>
            {isConfirmed && (
              <div className="journey-confirmed-badge">Picked Up ✓</div>
            )}
          </div>

          <div className="sheet-details-card journey-passenger-details">
            <DetailRow label="Pick Up" value={<><span className="detail-pin">{Icons.pin}</span>{currentPassenger.pickup_location || 'Map Point'}</>} />
            <DetailRow label="Cost" value={`£2.00`} valueClass="detail-price" />
            <DetailRow label="Code" value={currentPassenger.pickup_code || '----'} valueClass="detail-value" />
          </div>
        </div>
      )}

      {/* Actions */}
      {currentPassenger && (
        <div className="journey-actions">
          <button
            className="sheet-action-btn btn-message"
            onClick={() => onOpenChat?.(String(activeRide.id), currentPassenger.passenger?.id ?? currentPassenger.passenger_id)}
          >
            {Icons.message} Message
          </button>
          {!isConfirmed ? (
            <button className="sheet-action-btn btn-accept journey-confirm-btn" onClick={handleConfirm}>
              {Icons.check} Confirm Pick Up
            </button>
          ) : (
            <button className="sheet-action-btn btn-accept journey-confirm-btn journey-confirm-done" disabled>
              {Icons.check} Picked Up
            </button>
          )}
        </div>
      )}

      {/* Complete Ride Action */}
      <div className="journey-actions" style={{ marginTop: '12px' }}>
        <button
          className="sheet-action-btn"
          style={{ background: '#22c55e', color: '#fff', border: 'none' }}
          onClick={handleCompleteRideClick}
          disabled={isCompleting}
        >
          {isCompleting ? 'Completing...' : '🏁 Complete Ride'}
        </button>
      </div>

    </div>
  );
};

// ─── Main JourneyPage ──────────────────────────────────────────
const JourneyPage: React.FC<{
  canUseDriverMode: boolean;
  onDriverSignup: () => void;
  onOpenChat?: (rideId: string, participantId?: string) => void;
  mode?: 'user' | 'driver';
  onModeChange?: (mode: 'user' | 'driver') => void;
}> = ({ canUseDriverMode, onDriverSignup, onOpenChat, mode, onModeChange }) => {
  const [internalMode, setInternalMode] = useState<'user' | 'driver'>('user');
  const currentMode = mode ?? internalMode;
  const setCurrentMode = (nextMode: 'user' | 'driver') => {
    if (mode === undefined) {
      setInternalMode(nextMode);
    }
    onModeChange?.(nextMode);
  };

  const [activeUserTrips, setActiveUserTrips] = useState<any[]>([]);
  const [activeDriverRides, setActiveDriverRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!canUseDriverMode && currentMode === 'driver') {
      setCurrentMode('user');
    }
  }, [canUseDriverMode, currentMode]);

  const fetchActiveJourneys = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error("No token found");

      // Fetch User Bookings
      const userRes = await fetch('https://localhost:8000/bookings/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        const activeBookings = userData.filter((b: any) => b.status === 'confirmed' && b.ride?.status === 'in_progress');

        const enriched = await Promise.all(
          activeBookings.map(async (b: any) => {

            try {
              const vRes = await fetch(
                `https://localhost:8000/bookings/rides/${b.ride_id}/vehicle`,  // <-- use ride_id
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );


              if (vRes.ok) {
                const vehicle = await vRes.json();
                return { ...b, vehicle };
              }
            } catch (e) {
              console.error("Vehicle fetch failed for ride", b.ride_id, e);
            }

            // fallback: booking without vehicle
            return b;
          })
        );

        setActiveUserTrips(enriched);
      }



      // Fetch Driver Dashboard
      const driverRes = await fetch('https://localhost:8000/rides/driver/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (driverRes.ok) {
        const driverData = await driverRes.json();
        const activeRides = driverData.filter((r: any) => r.status === 'in_progress');
        setActiveDriverRides(activeRides);
      }

    } catch (err) {
      console.error("Error fetching journeys:", err);
    } finally {
      setLoading(false);
    }


  };

  useEffect(() => {
    fetchActiveJourneys();
  }, [currentMode]);

  // Handler for completing the ride
  const handleCompleteRide = async (rideId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`https://localhost:8000/bookings/rides/${rideId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to complete ride');
      }

      // Remove the completed ride from state directly so the UI updates instantly
      setActiveDriverRides(prev => prev.filter(r => r.id !== rideId));

    } catch (error) {
      console.error('Error completing ride:', error);
      alert('Could not complete the ride. Please try again.');
    }
  };

  return (
    <>
      <header className="uber-header">
        <h1 className="activity-title">Journey</h1>

        <div className="top-toggle">
          <button
            className={`toggle-tab ${currentMode === 'user' ? 'toggle-tab-active' : ''}`}
            onClick={() => setCurrentMode('user')}
          >
            Rider
          </button>

          <button
            className={`toggle-tab ${currentMode === 'driver' ? 'toggle-tab-active' : ''}`}
            onClick={() => {
              if (!canUseDriverMode) return onDriverSignup();
              setCurrentMode('driver');
            }}
          >
            Driver
          </button>
        </div>
      </header>

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)' }}>Loading your journeys...</p>
      ) : (
        currentMode === 'user' ? (
          <UserJourney trips={activeUserTrips} onOpenChat={onOpenChat} />
        ) : (
          <DriverJourney rides={activeDriverRides} onComplete={handleCompleteRide} onOpenChat={onOpenChat} />
        )
      )}
    </>
  );
};

export default JourneyPage;