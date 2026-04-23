import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RequestRidePage from './RequestRidePage';
import { apiFetch } from './lib/api';

const requestRideMocks = vi.hoisted(() => ({
  geocodeAddress: vi.fn(),
}));

vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

vi.mock('./components/Map/useGeocode', () => ({
  useGeocode: () => ({
    geocodeAddress: requestRideMocks.geocodeAddress,
    loading: false,
    error: null,
  }),
}));

vi.mock('./components/Map/RideRenderMap', () => ({
  RideRenderMap: ({
    rideId,
    existingPickup,
    onPickupSelect,
  }: {
    rideId: number;
    existingPickup?: { lat: number; lng: number };
    onPickupSelect?: (lat: number, lng: number) => void;
  }) => (
    <button
      type="button"
      data-testid={`mock-map-${rideId}`}
      onClick={() => onPickupSelect?.(51.38, -2.36)}
    >
      Mock Map {existingPickup ? `${existingPickup.lat},${existingPickup.lng}` : 'no pickup'}
    </button>
  ),
}));

const searchResult = {
  id: 101,
  origin: 'Oldfield Park',
  destination: 'University of Bath',
  departure_time: '2026-10-10T10:00:00.000Z',
  driver_name: 'Alice',
  driver_rating: 4.8,
  price: '3.50',
};

const fillPickup = (value = 'Oldfield Park') => {
  fireEvent.change(screen.getByLabelText('Pickup location'), {
    target: { value },
  });
};

describe('RequestRidePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requestRideMocks.geocodeAddress.mockResolvedValue([
      { label: 'Oldfield Park, Bath', lat: 51.381, lng: -2.36 },
    ]);
    window.localStorage.clear();
    window.localStorage.setItem('authToken', 'fake-jwt-token');
  });

  it('renders the search form', () => {
    render(<RequestRidePage />);

    expect(screen.getByText('Request a Ride')).toBeInTheDocument();
    expect(screen.getByLabelText('Pickup location')).toBeInTheDocument();
    expect(screen.getByLabelText('Destination')).toBeInTheDocument();
    expect(screen.getByLabelText('Time of arrival (optional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search Rides' })).toBeInTheDocument();
  });

  it('prefills pickup, destination, and time when provided', () => {
    render(
      <RequestRidePage
        prefill={{
          origin: 'Oldfield Park',
          destination: 'University of Bath',
          arrivalDateTimeLocal: '2026-10-10T12:00',
        }}
      />,
    );

    expect(screen.getByLabelText('Pickup location')).toHaveValue('Oldfield Park');
    expect(screen.getByLabelText('Destination')).toHaveValue('University of Bath');
    expect(screen.getByLabelText('Time of arrival (optional)')).toHaveValue('2026-10-10T12:00');
  });

  it('updates search fields when the user types', () => {
    render(<RequestRidePage />);

    fillPickup();
    fireEvent.change(screen.getByLabelText('Destination'), {
      target: { value: 'University of Bath' },
    });

    expect(screen.getByLabelText('Pickup location')).toHaveValue('Oldfield Park');
    expect(screen.getByLabelText('Destination')).toHaveValue('University of Bath');
  });

  it('shows an auth error before searching when no token is available', async () => {
    window.localStorage.removeItem('authToken');

    render(<RequestRidePage />);
    fillPickup();
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByText('No authentication token found. Please log in again.')).toBeInTheDocument();
    });
    expect(requestRideMocks.geocodeAddress).not.toHaveBeenCalled();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('renders string-based search errors', async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce('String-based search error');

    render(<RequestRidePage />);
    fillPickup();
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByText('String-based search error')).toBeInTheDocument();
    });
  });

  it('shows a pickup geocoding error before browsing rides', async () => {
    requestRideMocks.geocodeAddress.mockResolvedValueOnce([]);

    render(<RequestRidePage />);
    fillPickup('Unknown place');
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByText('Pickup location not found.')).toBeInTheDocument();
    });
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('submits the current pickup and destination as query params', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    render(<RequestRidePage />);

    fillPickup();
    fireEvent.change(screen.getByLabelText('Destination'), {
      target: { value: 'University of Bath' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(requestRideMocks.geocodeAddress).toHaveBeenCalledWith('Oldfield Park');
      expect(apiFetch).toHaveBeenCalledWith(
        'rides/?origin=Oldfield+Park&destination=University+of+Bath',
        { method: 'GET' },
      );
    });
  });

  it('shows an empty state when search returns no rides', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    render(<RequestRidePage />);
    fillPickup();
    fireEvent.change(screen.getByLabelText('Destination'), {
      target: { value: 'Nowhere' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalled();
    });
    expect(screen.getByText('No rides found')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Request' })).not.toBeInTheDocument();
    expect(screen.queryByText('Booking request sent successfully!')).not.toBeInTheDocument();
  });

  it('renders returned rides with an inline pickup route map', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([searchResult]);

    render(<RequestRidePage />);
    fillPickup();
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByText('University of Bath')).toBeInTheDocument();
      expect(screen.getByText('From: Oldfield Park')).toBeInTheDocument();
      expect(screen.getByText('Pickup: Oldfield Park, Bath')).toBeInTheDocument();
      expect(screen.getByText('Driver: Alice')).toBeInTheDocument();
      expect(screen.getByTestId('mock-map-101')).toHaveTextContent('51.381,-2.36');
      expect(screen.getByText('Request')).toBeInTheDocument();
    });
  });

  it('books a ride from the inline result map after selecting a pickup point', async () => {
    vi.mocked(apiFetch)
      .mockResolvedValueOnce([searchResult])
      .mockResolvedValueOnce({});

    render(<RequestRidePage />);
    fillPickup();
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('mock-map-101'));
    fireEvent.click(screen.getByRole('button', { name: 'Request' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenLastCalledWith(
        'bookings/?ride_id=101&pickup_location=Oldfield+Park&dropoff_location=University+of+Bath&price=3.5&pickup_lat=51.38&pickup_lng=-2.36',
        { method: 'POST' },
      );
      expect(screen.getByText('Booking request sent successfully!')).toBeInTheDocument();
    });
  });

  it('books a ride with the geocoded pickup when the map is not adjusted', async () => {
    vi.mocked(apiFetch)
      .mockResolvedValueOnce([searchResult])
      .mockResolvedValueOnce({});

    render(<RequestRidePage />);
    fillPickup();
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Request' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenLastCalledWith(
        'bookings/?ride_id=101&pickup_location=Oldfield+Park&dropoff_location=University+of+Bath&price=3.5&pickup_lat=51.381&pickup_lng=-2.36',
        { method: 'POST' },
      );
    });
  });

  it('shows an error when booking fails with an Error object', async () => {
    vi.mocked(apiFetch)
      .mockResolvedValueOnce([searchResult])
      .mockRejectedValueOnce(new Error('Booking system offline'));

    render(<RequestRidePage />);
    fillPickup();
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Request' }));

    await waitFor(() => {
      expect(screen.getByText('Booking system offline')).toBeInTheDocument();
    });
  });

  it('shows an error when booking fails with a string', async () => {
    vi.mocked(apiFetch)
      .mockResolvedValueOnce([searchResult])
      .mockRejectedValueOnce('String-based booking error');

    render(<RequestRidePage />);
    fillPickup();
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Request' }));

    await waitFor(() => {
      expect(screen.getByText('String-based booking error')).toBeInTheDocument();
    });
  });
});
