import type { ReactNode } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import JourneyPage from './JourneyPage';
import { apiFetch } from './lib/api';

vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

vi.mock('./App', () => ({
  DetailRow: ({ label, value }: { label: string; value: unknown }) => (
    <div>
      <span>{label}</span>
      <span>{value as ReactNode}</span>
    </div>
  ),
  Icons: {
    clock: 'clock',
    message: 'message',
    report: 'report',
    pin: 'pin',
    check: 'check',
  },
  Btn: ({ label, onClick, cls }: { label: string; onClick?: () => void; cls?: string }) => (
    <button type="button" className={cls} onClick={onClick}>
      {label}
    </button>
  ),
}));

vi.mock('./App.tsx', () => ({
  DetailRow: ({ label, value }: { label: string; value: unknown }) => (
    <div>
      <span>{label}</span>
      <span>{value as ReactNode}</span>
    </div>
  ),
  Icons: {
    clock: 'clock',
    message: 'message',
    report: 'report',
    pin: 'pin',
    check: 'check',
  },
  Btn: ({ label, onClick, cls }: { label: string; onClick?: () => void; cls?: string }) => (
    <button type="button" className={cls} onClick={onClick}>
      {label}
    </button>
  ),
}));

vi.mock('./components/Map/RideRenderMap', () => ({
  RideRenderMap: ({ rideId }: { rideId: number }) => <div data-testid={`map-${rideId}`}>Mock Map</div>,
}));

const defaultUserTrips = [
  {
    id: 1,
    ride_id: 101,
    status: 'confirmed',
    pickup_time: '2026-03-04T12:00:00Z',
    pickup_code: '1234',
    dropoff_location: 'University of Bath',
    ride: {
      status: 'in_progress',
      departure_time: '2026-03-04T12:10:00Z',
      driver: { first_name: 'John', last_name: 'Doe' },
      destination: 'University of Bath',
    },
  },
];

const defaultDriverRides = [
  {
    id: 201,
    status: 'in_progress',
    destination: 'City Centre',
    bookings: [
      {
        id: 301,
        status: 'confirmed',
        pickup_location: 'Oldfield Park',
        pickup_code: '5678',
        passenger_id: 'passenger-301',
        passenger: { id: 'passenger-301', first_name: 'Jane', last_name: 'Smith', rider_rating: '4.8' },
      },
    ],
  },
  {
    id: 202,
    status: 'in_progress',
    destination: 'University of Bath',
    bookings: [],
  },
];

function installJourneyApiMock(options?: {
  userTrips?: any[];
  driverRides?: any[];
  vehicleByRideId?: Record<number, { car_model?: string; number_plate?: string }>;
  completeRideError?: Error;
}) {
  const userTrips = options?.userTrips ?? defaultUserTrips;
  const driverRides = options?.driverRides ?? defaultDriverRides;
  const vehicleByRideId = options?.vehicleByRideId ?? {
    101: { car_model: 'Toyota Prius', number_plate: 'AB12 CDE' },
    102: { car_model: 'Honda Jazz', number_plate: 'XY98 ZZZ' },
  };

  vi.mocked(apiFetch).mockImplementation(async (endpoint) => {
    const path = String(endpoint);

    if (path === 'bookings/me') {
      return userTrips;
    }

    if (path === 'rides/driver/dashboard') {
      return driverRides;
    }

    const vehicleMatch = path.match(/^bookings\/rides\/(\d+)\/vehicle$/);
    if (vehicleMatch) {
      return vehicleByRideId[Number(vehicleMatch[1])] ?? {};
    }

    const completeMatch = path.match(/^bookings\/rides\/(\d+)\/complete$/);
    if (completeMatch) {
      if (options?.completeRideError) {
        throw options.completeRideError;
      }
      return { success: true };
    }

    throw new Error(`Unexpected endpoint: ${path}`);
  });
}

async function waitForJourneyLoad() {
  await waitFor(() => {
    expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument();
  });
}

describe('JourneyPage', () => {
  const onDriverSignup = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the current rider journey view after loading', async () => {
    installJourneyApiMock();

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={onDriverSignup} />);
    expect(screen.getByText('Loading your journeys...')).toBeInTheDocument();

    await waitForJourneyLoad();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('Toyota Prius')).toBeInTheDocument();
    expect(screen.getByText('AB12 CDE')).toBeInTheDocument();
    expect(screen.getByTestId('map-101')).toBeInTheDocument();
  });

  it('shows the empty rider state when there are no active user trips', async () => {
    installJourneyApiMock({ userTrips: [] });

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={onDriverSignup} />);

    await waitForJourneyLoad();

    expect(screen.getByText('No Active Journeys')).toBeInTheDocument();
  });

  it('calls onDriverSignup instead of switching when driver mode is unavailable', async () => {
    installJourneyApiMock();

    render(<JourneyPage canUseDriverMode={false} onDriverSignup={onDriverSignup} />);

    await waitForJourneyLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    expect(onDriverSignup).toHaveBeenCalledTimes(1);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('switches to driver mode and renders the active passenger card', async () => {
    installJourneyApiMock();

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={onDriverSignup} />);

    await waitForJourneyLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expect(screen.getByText('Route: City Centre')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Oldfield Park')).toBeInTheDocument();
      expect(screen.getByText('5678')).toBeInTheDocument();
    });
  });

  it('marks a passenger as picked up when the driver confirms pickup', async () => {
    installJourneyApiMock();

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={onDriverSignup} />);

    await waitForJourneyLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Confirm Pick Up/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Confirm Pick Up/i }));

    expect(screen.getAllByText(/Picked Up/).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Picked Up/i })).toBeDisabled();
  });

  it('completes a ride and removes it from the driver view', async () => {
    installJourneyApiMock();

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={onDriverSignup} />);

    await waitForJourneyLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Complete Ride/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Complete Ride/i }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('bookings/rides/201/complete', { method: 'POST' });
      expect(screen.queryByText('Route: City Centre')).not.toBeInTheDocument();
    });
  });

  it('supports multiple active rider trips with ride tabs', async () => {
    installJourneyApiMock({
      userTrips: [
        ...defaultUserTrips,
        {
          id: 2,
          ride_id: 102,
          status: 'confirmed',
          pickup_time: '2026-03-05T09:00:00Z',
          pickup_code: '9999',
          dropoff_location: 'City Centre',
          ride: {
            status: 'in_progress',
            departure_time: '2026-03-05T09:15:00Z',
            driver: { first_name: 'Alice', last_name: 'Wonder' },
            destination: 'City Centre',
          },
        },
      ],
    });

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={onDriverSignup} />);

    await waitForJourneyLoad();

    fireEvent.click(screen.getByRole('button', { name: 'Ride #102' }));

    expect(screen.getByText('Alice Wonder')).toBeInTheDocument();
    expect(screen.getByText('9999')).toBeInTheDocument();
  });

  it('shows driver fallbacks for empty routes and unrated passengers', async () => {
    installJourneyApiMock({
      driverRides: [
        {
          id: 201,
          status: 'in_progress',
          destination: 'Sparse City',
          bookings: [
            {
              id: 301,
              status: 'confirmed',
              pickup_location: '',
              pickup_code: '',
              passenger: { first_name: 'New', last_name: 'Passenger' },
            },
          ],
        },
        {
          id: 202,
          status: 'in_progress',
          destination: 'University of Bath',
          bookings: [],
        },
      ],
    });

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={onDriverSignup} />);

    await waitForJourneyLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expect(screen.getByText('No rating yet')).toBeInTheDocument();
      expect(screen.getByText('Map Point')).toBeInTheDocument();
      expect(screen.getByText('----')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Route: University of Bath' }));

    await waitFor(() => {
      expect(screen.getByText('No confirmed passengers for this ride.')).toBeInTheDocument();
    });
  });

  it('logs fetch failures and falls back to the empty state', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(apiFetch).mockRejectedValue(new Error('Network Down'));

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={onDriverSignup} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching journeys:', expect.any(Error));
      expect(screen.getByText('No Active Journeys')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('alerts the user when completing a ride fails', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    installJourneyApiMock({ completeRideError: new Error('Could not complete') });

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={onDriverSignup} />);

    await waitForJourneyLoad();
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Complete Ride/i })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /Complete Ride/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Could not complete the ride. Please try again.');
    });

    alertSpy.mockRestore();
  });
});
