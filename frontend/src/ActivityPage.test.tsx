import type { ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ActivityPage from './ActivityPage';
import { apiFetch } from './lib/api';

const activityMapMock = vi.hoisted(() => ({
  byRideId: new Map<number, unknown>(),
}));

vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

vi.mock('./App.tsx', () => ({
  Btn: ({
    label,
    onClick,
    cls,
    small,
  }: {
    label: string;
    onClick?: () => void;
    cls?: string;
    small?: boolean;
  }) => (
    <button type="button" className={`${cls ?? ''}${small ? ' btn-small' : ''}`} onClick={onClick}>
      {label}
    </button>
  ),
  DetailRow: ({ label, value }: { label: string; value: unknown }) => (
    <div>
      <span>{label}</span>
      <span>{value as ReactNode}</span>
    </div>
  ),
  Icons: {
    back: 'Back',
    message: 'Message',
    report: 'Report',
    star: 'Star',
    cancel: 'Cancel',
    accept: 'Accept',
    remove: 'Remove',
  },
  MapPlaceholder: () => <div data-testid="mock-map-placeholder">Map Placeholder</div>,
}));

vi.mock('./components/Map/RideRenderMap', async () => {
  const React = await import('react');

  return {
    RideRenderMap: ({
      existingPickup,
      rideId,
      onRouteData,
    }: {
      existingPickup?: { lat: number; lng: number };
      rideId: number;
      onRouteData?: (data: unknown) => void;
    }) => {
      React.useEffect(() => {
        if (activityMapMock.byRideId.has(rideId)) {
          onRouteData?.(activityMapMock.byRideId.get(rideId));
        }
      }, [rideId, onRouteData]);

      return (
        <div data-testid="mock-map">
          {existingPickup ? `Pickup ${existingPickup.lat},${existingPickup.lng}` : `Map ${rideId}`}
        </div>
      );
    },
  };
});

const defaultRiderBookings = [
  {
    id: 101,
    ride_id: 201,
    status: 'confirmed',
    pickup_time: '2026-03-12T10:00:00Z',
    dropoff_location: 'University of Bath',
    pickup_lat: 51.38,
    pickup_lng: -2.36,
    ride: {
      status: 'upcoming',
      destination: 'University of Bath',
      departure_time: '2026-03-12T10:15:00Z',
      driver: { id: 'driver-1', first_name: 'Alice', last_name: 'Smith' },
    },
  },
  {
    id: 102,
    ride_id: 202,
    status: 'pending',
    pickup_time: '2026-03-13T11:00:00Z',
    dropoff_location: 'City Centre',
    ride: {
      status: 'upcoming',
      destination: 'City Centre',
      departure_time: '2026-03-13T11:15:00Z',
      driver: { id: 'driver-2', first_name: 'Bob', last_name: 'Jones' },
    },
  },
  {
    id: 103,
    ride_id: 203,
    status: 'completed',
    pickup_time: '2026-03-10T08:00:00Z',
    dropoff_location: 'Campus',
    ride: {
      status: 'completed',
      destination: 'Campus',
      departure_time: '2026-03-10T08:15:00Z',
      driver: { id: 'driver-3', first_name: 'Cara', last_name: 'Mills' },
    },
  },
];

const defaultDriverRides = [
  {
    id: 301,
    destination: 'Oldfield Park',
    departure_time: '2026-03-14T12:00:00Z',
    status: 'upcoming',
    bookings: [
      {
        id: 401,
        status: 'confirmed',
        pickup_location: 'Bath Spa',
        pickup_lat: 51.379,
        pickup_lng: -2.359,
        passenger: { id: 'passenger-1', first_name: 'Bob', last_name: 'Jones', rider_rating: 4.7 },
      },
      {
        id: 402,
        status: 'pending',
        dropoff_location: 'Supermarket',
        pickup_time: '2026-03-14T11:45:00Z',
        passenger: { id: 'passenger-2', first_name: 'Eve', last_name: 'Stone', rider_rating: 4.2 },
      },
    ],
  },
  {
    id: 302,
    destination: 'City Centre',
    departure_time: '2026-03-01T12:00:00Z',
    status: 'completed',
    bookings: [
      {
        id: 403,
        status: 'completed',
        pickup_location: 'Library',
        passenger: { id: 'passenger-3', first_name: 'Tom', last_name: 'Hanks', rider_rating: 4.9 },
      },
    ],
  },
];

function installActivityApiMock(options?: {
  riderBookings?: any[];
  driverRides?: any[];
  customHandler?: (path: string, requestInit?: RequestInit) => Promise<unknown> | unknown;
}) {
  const riderBookings = options?.riderBookings ?? defaultRiderBookings;
  const driverRides = options?.driverRides ?? defaultDriverRides;

  vi.mocked(apiFetch).mockImplementation(async (endpoint, requestInit) => {
    const path = String(endpoint);

    if (options?.customHandler) {
      const customResult = await options.customHandler(path, requestInit);
      if (customResult !== undefined) {
        return customResult;
      }
    }

    if (path === 'bookings/me') {
      return riderBookings;
    }

    if (path === 'rides/driver/dashboard') {
      return driverRides;
    }

    if (path.startsWith('ratings/?')) {
      return {};
    }

    if (path.startsWith('bookings/') || path.startsWith('rides/')) {
      return {};
    }

    throw new Error(`Unexpected endpoint: ${path} ${requestInit?.method ?? 'GET'}`);
  });
}

async function waitForActivityLoad() {
  await waitFor(() => {
    expect(screen.queryByText('Loading activities...')).not.toBeInTheDocument();
  });
}

function findText(text: string) {
  return screen.getAllByText((_, element) => element?.textContent?.includes(text) ?? false);
}

function setActivityMapData(rideId: number, data: unknown) {
  activityMapMock.byRideId.set(rideId, data);
}

function formatDisplayTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function expectText(text: string) {
  expect(findText(text).length).toBeGreaterThan(0);
}

describe('ActivityPage', () => {
  const defaultProps = {
    canUseDriverMode: true,
    onDriverSignup: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    activityMapMock.byRideId.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the header and defaults to rider mode', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();

    expect(screen.getByRole('heading', { name: 'Activity' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rider' })).toHaveClass('toggle-tab-active');
  });

  it('renders rider upcoming, requested, and past trips', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();

    expectText('University of Bath');
    expectText('Alice Smith');
    expectText('City Centre');
    expectText('Campus');
  });

  it('shows an error when the activity fetch fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Network error'));

    render(<ActivityPage {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('switches to driver mode and shows request, upcoming, and past driver trips', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Driver' })).toHaveClass('toggle-tab-active');
      expectText('Oldfield Park');
      expectText('Supermarket');
      expectText('City Centre');
    });

    fireEvent.click(screen.getByRole('button', { name: 'Rider' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Rider' })).toHaveClass('toggle-tab-active');
      expectText('University of Bath');
    });
  });

  it('calls onDriverSignup when driver access is unavailable', async () => {
    installActivityApiMock();
    const onDriverSignup = vi.fn();

    render(<ActivityPage canUseDriverMode={false} onDriverSignup={onDriverSignup} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    expect(onDriverSignup).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Rider' })).toHaveClass('toggle-tab-active');
  });

  it('opens and closes the rider trip details sheet', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[0]);

    expect(screen.getByText('Trip Details')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Back/ }));

    await waitFor(() => {
      expect(screen.queryByText('Trip Details')).not.toBeInTheDocument();
    });
  });

  it('lets a rider cancel a requested trip', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[1]);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel Trip' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel Trip' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Yes, Cancel' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Yes, Cancel' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('bookings/102', { method: 'DELETE' });
      expect(screen.getAllByText('Trip Cancelled').length).toBeGreaterThan(0);
    });
  });

  it('lets a rider rate a completed trip', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[2]);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Rate Trip' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Rate Trip' }));
    fireEvent.mouseEnter(screen.getAllByRole('button', { name: /star/i })[3]);
    expect(screen.getByText('Great')).toBeInTheDocument();
    fireEvent.mouseLeave(screen.getAllByRole('button', { name: /star/i })[3]);
    fireEvent.click(screen.getAllByRole('button', { name: /star/i })[4]);
    fireEvent.click(screen.getByRole('button', { name: 'Submit Rating' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('ratings/?ride_id=203&reviewed_user_id=driver-3&rating=5'),
        { method: 'POST' },
      );
      expect(screen.getAllByText('Rating Submitted!').length).toBeGreaterThan(0);
    });
  });

  it('shows estimated pickup times and opens rider chats across trip states', async () => {
    installActivityApiMock();
    const onOpenChat = vi.fn();

    setActivityMapData(201, {
      times: {
        pickups: [{ booking_ids: [101], estimated_time: '2026-03-12T10:07:00Z' }],
      },
    });
    setActivityMapData(202, {
      times: {
        pickups: [{ booking_ids: [102], estimated_time: '2026-03-13T11:06:00Z' }],
      },
    });
    setActivityMapData(203, {
      times: {
        arrival: '2026-03-10T08:42:00Z',
      },
    });

    render(<ActivityPage {...defaultProps} onOpenChat={onOpenChat} />);

    await waitForActivityLoad();

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[0]);
    await waitFor(() => {
      expect(screen.getByText(formatDisplayTime('2026-03-12T10:07:00Z'))).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Message Driver' }));
    expect(onOpenChat).toHaveBeenCalledWith('201');
    fireEvent.click(screen.getByRole('button', { name: /Back/ }));
    await waitFor(() => {
      expect(screen.queryByText('Trip Details')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[1]);
    await waitFor(() => {
      expect(screen.getByText(formatDisplayTime('2026-03-13T11:06:00Z'))).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Message Driver' }));
    expect(onOpenChat).toHaveBeenCalledWith('202');
    fireEvent.click(screen.getByRole('button', { name: /Back/ }));
    await waitFor(() => {
      expect(screen.queryByText('Trip Details')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[2]);
    await waitFor(() => {
      expect(screen.getByText(formatDisplayTime('2026-03-10T08:42:00Z'))).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Message Driver' }));
    expect(onOpenChat).toHaveBeenCalledWith('203');
  });

  it('lets a rider report an issue on a completed trip', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[2]);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Report Issue' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Report Issue' }));
    fireEvent.change(screen.getByPlaceholderText(/Tell us what went wrong/), {
      target: { value: 'Driver was late.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Report' }));

    await waitFor(() => {
      expect(screen.getAllByText('Report Sent').length).toBeGreaterThan(0);
    });
  });

  it('shows duplicate rating feedback when a trip has already been rated', async () => {
    installActivityApiMock({
      customHandler: async (path) => {
        if (path.startsWith('ratings/?')) {
          const error = new Error('Already rated');
          Object.assign(error, { status: 409 });
          throw error;
        }

        return undefined;
      },
    });

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[2]);
    fireEvent.click(screen.getByRole('button', { name: 'Rate Trip' }));
    fireEvent.click(screen.getAllByRole('button', { name: /star/i })[4]);
    fireEvent.click(screen.getByRole('button', { name: 'Submit Rating' }));

    await waitFor(() => {
      expect(screen.getAllByText('Already Rated').length).toBeGreaterThan(0);
    });
  });

  it('shows a submission error when rating fails for another reason', async () => {
    installActivityApiMock({
      customHandler: async (path) => {
        if (path.startsWith('ratings/?')) {
          throw new Error('Rating service unavailable');
        }

        return undefined;
      },
    });

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[2]);
    fireEvent.click(screen.getByRole('button', { name: 'Rate Trip' }));
    fireEvent.click(screen.getAllByRole('button', { name: /star/i })[4]);
    fireEvent.click(screen.getByRole('button', { name: 'Submit Rating' }));

    await waitFor(() => {
      expect(screen.getAllByText('Could not submit').length).toBeGreaterThan(0);
      expect(screen.getByText('Rating service unavailable')).toBeInTheDocument();
    });
  });

  it('accepts a passenger request in driver mode', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expectText('Supermarket');
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[1]);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Accept Request' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Accept Request' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Accept Request' }).at(-1)!);

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('bookings/402/accept', { method: 'PUT' });
      expect(screen.getAllByText('Request Accepted!').length).toBeGreaterThan(0);
    });
  });

  it('opens and dismisses a deny confirmation with escape', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));
    await waitFor(() => {
      expectText('Supermarket');
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[1]);
    fireEvent.click(screen.getByRole('button', { name: 'Deny Request' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Deny Eve Stone?' })).toBeInTheDocument();
    });

    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Deny Eve Stone?' })).not.toBeInTheDocument();
    });
  });

  it('denies a passenger request and can open the passenger chat first', async () => {
    installActivityApiMock();
    const onOpenChat = vi.fn();

    render(<ActivityPage {...defaultProps} onOpenChat={onOpenChat} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));
    await waitFor(() => {
      expectText('Supermarket');
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[1]);
    fireEvent.click(screen.getByRole('button', { name: 'Message Passenger' }));
    expect(onOpenChat).toHaveBeenCalledWith('301', 'passenger-2');

    fireEvent.click(screen.getByRole('button', { name: 'Deny Request' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Deny Request' }).at(-1)!);

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('bookings/402', { method: 'DELETE' });
      expect(screen.getAllByText('Request Denied').length).toBeGreaterThan(0);
    });
  });

  it('starts an upcoming driver trip', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));
    await waitFor(() => {
      expectText('Oldfield Park');
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[0]);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Begin Ride' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Begin Ride' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Yes, Start' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Yes, Start' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('rides/301', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress' }),
      });
      expect(screen.getAllByText('Trip Started').length).toBeGreaterThan(0);
    });
  });

  it('calls onRideStarted after a driver begins a trip', async () => {
    installActivityApiMock();
    const onRideStarted = vi.fn();

    render(<ActivityPage {...defaultProps} onRideStarted={onRideStarted} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));
    await waitFor(() => {
      expectText('Oldfield Park');
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Begin Ride' }));
    fireEvent.click(screen.getByRole('button', { name: 'Yes, Start' }));

    await waitFor(() => {
      expect(screen.getAllByText('Trip Started').length).toBeGreaterThan(0);
    });

    await waitFor(() => {
      expect(onRideStarted).toHaveBeenCalledTimes(1);
    }, { timeout: 2500 });
  });

  it('removes a confirmed passenger from an upcoming driver trip', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));
    await waitFor(() => {
      expectText('Oldfield Park');
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[0]);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Remove Passenger' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Remove Passenger' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('bookings/401', { method: 'DELETE' });
      expect(screen.getAllByText('Passenger Removed').length).toBeGreaterThan(0);
    });
  });

  it('keeps a deny request modal open when the API action fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    installActivityApiMock({
      customHandler: async (path) => {
        if (path === 'bookings/402') {
          throw new Error('Delete failed');
        }

        return undefined;
      },
    });

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));
    await waitFor(() => {
      expectText('Supermarket');
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[1]);
    fireEvent.click(screen.getByRole('button', { name: 'Deny Request' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Deny Request' }).at(-1)!);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(screen.getByRole('dialog', { name: 'Deny Eve Stone?' })).toBeInTheDocument();
      expect(screen.queryByText('Request Denied')).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('rates a passenger on a completed driver trip', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));
    await waitFor(() => {
      expectText('City Centre');
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[2]);
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Rate' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Rate' }));
    fireEvent.click(screen.getAllByRole('button', { name: /star/i })[4]);
    fireEvent.click(screen.getByRole('button', { name: 'Submit Rating' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        expect.stringContaining('ratings/?ride_id=302&reviewed_user_id=passenger-3&rating=5'),
        { method: 'POST' },
      );
      expect(screen.getAllByText('Rating Submitted!').length).toBeGreaterThan(0);
    });
  });

  it('supports passenger tabs, chat actions, and report flow in driver mode', async () => {
    installActivityApiMock({
      driverRides: [
        {
          id: 301,
          destination: 'Oldfield Park',
          departure_time: '2026-03-14T12:00:00Z',
          status: 'upcoming',
          bookings: [
            {
              id: 401,
              status: 'confirmed',
              pickup_location: 'Bath Spa',
              passenger: { id: 'passenger-1', first_name: 'Bob', last_name: 'Jones', rider_rating: 4.7 },
            },
            {
              id: 404,
              status: 'confirmed',
              pickup_location: 'Weston',
              passenger: { id: 'passenger-4', first_name: 'Mia', last_name: 'Lane', rider_rating: 4.1 },
            },
          ],
        },
        {
          id: 302,
          destination: 'City Centre',
          departure_time: '2026-03-01T12:00:00Z',
          status: 'completed',
          bookings: [
            {
              id: 403,
              status: 'completed',
              pickup_location: 'Library',
              passenger: { id: 'passenger-3', first_name: 'Tom', last_name: 'Hanks', rider_rating: 4.9 },
            },
          ],
        },
      ],
    });
    const onOpenChat = vi.fn();

    render(<ActivityPage {...defaultProps} onOpenChat={onOpenChat} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expectText('Oldfield Park');
      expectText('City Centre');
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[0]);
    fireEvent.click(screen.getByRole('button', { name: 'Mia' }));
    expect(screen.getByText('Mia Lane')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Message' }));
    expect(onOpenChat).toHaveBeenCalledWith('301', 'passenger-4');
    fireEvent.click(screen.getByRole('button', { name: /Back/ }));
    await waitFor(() => {
      expect(screen.queryByText('Trip Details')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[1]);
    fireEvent.click(screen.getByRole('button', { name: 'Message' }));
    expect(onOpenChat).toHaveBeenCalledWith('302', 'passenger-3');
    fireEvent.click(screen.getByRole('button', { name: 'Report Issue' }));
    fireEvent.change(screen.getByPlaceholderText(/Tell us what went wrong/), {
      target: { value: 'Driver notes mismatch' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Report' }));

    await waitFor(() => {
      expect(screen.getAllByText('Report Sent').length).toBeGreaterThan(0);
    });
  });

  it('shows the empty passenger state and lets a driver cancel the whole trip', async () => {
    installActivityApiMock({
      driverRides: [
        {
          id: 999,
          destination: 'Quiet Route',
          departure_time: '2026-03-14T12:00:00Z',
          status: 'upcoming',
          bookings: [],
        },
      ],
    });

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expectText('Quiet Route');
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[0]);
    expect(screen.getByText('No passengers yet.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel Whole Trip' }));
    fireEvent.click(screen.getByRole('button', { name: 'Yes, Cancel' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('rides/999', { method: 'DELETE' });
      expect(screen.getAllByText('Trip Cancelled').length).toBeGreaterThan(0);
    });
  });

  it('expands and collapses long rider history lists', async () => {
    installActivityApiMock({
      riderBookings: Array.from({ length: 4 }, (_, index) => ({
        id: 500 + index,
        ride_id: 600 + index,
        status: 'completed',
        pickup_time: `2026-03-${10 + index}T08:00:00Z`,
        dropoff_location: `Destination ${index}`,
        ride: {
          status: 'completed',
          destination: `Destination ${index}`,
          departure_time: `2026-03-${10 + index}T08:15:00Z`,
          driver: { id: `driver-${index}`, first_name: 'Past', last_name: `${index}` },
        },
      })),
    });

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();

    expect(screen.queryByText(/Destination 3/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'See more' }));
    expect(screen.getByText(/Destination 3/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'See less' }));
    await waitFor(() => {
      expect(screen.queryByText(/Destination 3/)).not.toBeInTheDocument();
    });
  });

  it('changes the driver request filter from Rating to Ease', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Rating/ })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Rating/ }));
    fireEvent.click(screen.getByText('Ease'));

    expect(screen.getByRole('button', { name: /Ease/ })).toBeInTheDocument();
  });

  it('passes existing pickup coordinates into the ride map', async () => {
    installActivityApiMock();

    render(<ActivityPage {...defaultProps} />);

    await waitForActivityLoad();
    fireEvent.click(screen.getAllByRole('button', { name: 'More' })[0]);

    await waitFor(() => {
      expect(screen.getByTestId('mock-map')).toHaveTextContent('Pickup 51.38,-2.36');
    });
  });
});
