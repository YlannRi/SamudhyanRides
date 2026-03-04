import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import JourneyPage from './JourneyPage';

// Mock the map component so it doesn't crash in tests
vi.mock('./components/Map/RideRenderMap', () => ({
  RideRenderMap: () => <div data-testid="mock-map">Mock Map</div>,
}));

// Mock Data
const mockUserTrips = [
  {
    id: 1,
    ride_id: 101,
    status: 'confirmed',
    pickup_time: '2026-03-04T12:00:00Z',
    pickup_code: '1234',
    dropoff_location: 'University of Bath',
    price: '5.00',
    ride: {
      status: 'in_progress',
      driver: { first_name: 'John', last_name: 'Doe' },
      destination: 'University of Bath',
    },
  },
];

const mockDriverRides = [
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
        price: '3.50',
        passenger: { first_name: 'Jane', last_name: 'Smith', rider_rating: '4.8' },
      },
    ],
  },
  // Added second ride so `rides.length > 1` is true, rendering the tabs
  {
    id: 202,
    status: 'in_progress',
    destination: 'University of Bath',
    bookings: [],
  }
];

describe('JourneyPage Component', () => {
  const mockOnDriverSignup = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'authToken') return 'fake-jwt-token';
      return null;
    });

    // Replace global.fetch with globalThis.fetch
    globalThis.fetch = vi.fn(async (url) => {
      if (url.toString().includes('/bookings/me')) {
        return { ok: true, json: async () => mockUserTrips };
      }
      if (url.toString().includes('/rides/driver/dashboard')) {
        return { ok: true, json: async () => mockDriverRides };
      }
      if (url.toString().includes('/complete')) {
        return { ok: true, json: async () => ({ success: true }) };
      }
      return { ok: false, status: 404, json: async () => ({ error: 'Not found' }) };
    }) as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially', async () => {
    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);
    expect(screen.getByText('Loading your journeys...')).toBeInTheDocument();

    // Wait for load to finish to clean up act() warning for this test
    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());
  });

  it('renders active user trips successfully', async () => {
    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Your Driver')).toBeInTheDocument();
    expect(screen.getByText('1234')).toBeInTheDocument();
    expect(screen.getByText('£5.00')).toBeInTheDocument();
    expect(screen.getByTestId('mock-map')).toBeInTheDocument();
  });

  it('renders empty state for user when there are no active trips', async () => {
  globalThis.fetch = vi.fn(async () => ({ ok: true, json: async () => [] })) as any;

  render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);

  await waitFor(() => {
    expect(screen.getByText('No Active Journeys')).toBeInTheDocument();
  });
});

  it('calls onDriverSignup when attempting to switch to Driver mode without permission', async () => {
    render(<JourneyPage canUseDriverMode={false} onDriverSignup={mockOnDriverSignup} />);

    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    expect(mockOnDriverSignup).toHaveBeenCalledTimes(1);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('toggles to Driver mode and renders active drives successfully', async () => {
    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);

    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expect(screen.getByText('Route: City Centre')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('⭐ 4.8')).toBeInTheDocument();
      expect(screen.getByText('5678')).toBeInTheDocument();
    });
  });

  it('allows driver to confirm passenger pickup', async () => {
    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);

    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Confirm Pick Up/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Confirm Pick Up/i }));

    await waitFor(() => {
      const pickedUpBtn = screen.getByRole('button', { name: /Picked Up/i });
      expect(pickedUpBtn).toBeInTheDocument();
      expect(pickedUpBtn).toBeDisabled();
      expect(screen.getByText('Picked Up ✓')).toBeInTheDocument();
    });
  });

  it('allows driver to complete a ride', async () => {
    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);

    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Complete Ride/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Complete Ride/i }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/bookings/rides/201/complete'),
        expect.objectContaining({ method: 'POST' })
      );
    });

    // UI updates to hide the completed ride
    await waitFor(() => {
      expect(screen.queryByText('Route: City Centre')).not.toBeInTheDocument();
    });
  });
});