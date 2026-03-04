import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ActivityPage from './ActivityPage';
import { apiFetch } from './lib/api';

// 1. Mock the custom API fetch utility
vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

// 2. Mock the Map Component so it doesn't crash in tests
vi.mock('./components/Map/RideRenderMap', () => ({
  RideRenderMap: () => <div data-testid="mock-map">Mock Map</div>,
}));

// Optional: Mock MapPlaceholder if it relies on heavy map libraries
vi.mock('./App.tsx', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    MapPlaceholder: () => <div data-testid="mock-map-placeholder">Map Placeholder</div>,
  };
});

describe('ActivityPage Component', () => {
  const mockProps = {
    canUseDriverMode: true,
    onDriverSignup: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'authToken') return 'fake-jwt-token';
      return null;
    });
  });

  it('renders the header and defaults to Rider mode', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    render(<ActivityPage {...mockProps} />);

    expect(screen.getByRole('heading', { name: 'Activity' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rider' })).toHaveClass('toggle-tab-active');
  });

  it('fetches and displays rider activity successfully', async () => {
    const mockRiderBookings = [
      {
        id: 101,
        status: 'confirmed',
        ride: { destination: 'University of Bath', departure_time: '10:00 AM', driver: { first_name: 'Alice', last_name: 'Smith' } },
        price: '3.50',
      },
      {
        id: 102,
        status: 'completed',
        ride: { destination: 'City Centre', departure_time: 'Yesterday' },
        price: '4.00',
      }
    ];

    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings);

    render(<ActivityPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('University of Bath')).toBeInTheDocument();
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('City Centre')).toBeInTheDocument();
    });
  });

  it('displays an error if the API fetch fails', async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Network error'));

    render(<ActivityPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Error: Network error')).toBeInTheDocument();
    });
  });

  it('toggles to Driver mode and fetches driver dashboard data', async () => {
    // Initial fetch for rider mode
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    render(<ActivityPage {...mockProps} />);

    // Setup mock for the driver fetch
    const mockDriverRides = [
      {
        id: 201,
        destination: 'Oldfield Park',
        departure_time: '12:00 PM',
        status: 'upcoming',
        seats_total: 4,
        seats_available: 2,
        bookings: [
          { id: 301, status: 'pending', dropoff_location: 'Supermarket', price: '2.00', passenger: { first_name: 'Bob', last_name: 'Jones' } }
        ]
      }
    ];

    vi.mocked(apiFetch).mockResolvedValueOnce(mockDriverRides);

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Driver' })).toHaveClass('toggle-tab-active');
      expect(screen.getByText('Oldfield Park')).toBeInTheDocument();
      expect(screen.getByText('Supermarket')).toBeInTheDocument();
      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    });
  });

  it('triggers onDriverSignup if user tries to switch to Driver mode without permission', () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    render(<ActivityPage canUseDriverMode={false} onDriverSignup={mockProps.onDriverSignup} />);

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    expect(mockProps.onDriverSignup).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Rider' })).toHaveClass('toggle-tab-active');
  });

  it('opens trip details panel when "More" is clicked on a trip', async () => {
    const mockRiderBookings = [{
      id: 101,
      status: 'confirmed',
      ride: { destination: 'Campus', departure_time: '10:00 AM' },
      price: '3.50',
    }];

    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings);

    render(<ActivityPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('More')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('More'));

    await waitFor(() => {
      expect(screen.getByText('Trip Details')).toBeInTheDocument();
      expect(screen.getByTestId('mock-map-placeholder')).toBeInTheDocument();
    });
  });

  it('opens the cancel confirmation modal from the Trip Details panel', async () => {
    const mockRiderBookings = [{
      id: 101,
      status: 'confirmed',
      ride: { destination: 'Campus', departure_time: '10:00 AM' },
      price: '3.50',
    }];

    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings);

    render(<ActivityPage {...mockProps} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('More'));
    });

    await waitFor(() => {
      expect(screen.getByText('Cancel Trip')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Cancel Trip'));

    await waitFor(() => {
      const modalTitles = screen.getAllByText('Cancel this trip?');
      expect(modalTitles[0]).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Yes, Cancel' })).toBeInTheDocument();
    });
  });
});