import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RequestRidePage from './RequestRidePage';
import { apiFetch } from './lib/api';

vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

vi.mock('./components/Map/RideRenderMap', () => ({
  RideRenderMap: ({ onPickupSelect }: { onPickupSelect?: (lat: number, lng: number) => void }) => (
    <button
      type="button"
      data-testid="mock-map"
      onClick={() => onPickupSelect?.(51.38, -2.36)}
    >
      Mock Map
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

describe('RequestRidePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    window.localStorage.setItem('authToken', 'fake-jwt-token');
  });

  it('renders the search form', () => {
    render(<RequestRidePage />);

    expect(screen.getByText('Request a Ride')).toBeInTheDocument();
    expect(screen.getByLabelText('Pick-up area (optional)')).toBeInTheDocument();
    expect(screen.getByLabelText('Destination')).toBeInTheDocument();
    expect(screen.getByLabelText('Time of arrival (optional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search Rides' })).toBeInTheDocument();
  });

  it('prefills destination and time when provided', () => {
    render(
      <RequestRidePage
        prefill={{
          destination: 'University of Bath',
          arrivalDateTimeLocal: '2026-10-10T12:00',
        }}
      />,
    );

    expect(screen.getByLabelText('Destination')).toHaveValue('University of Bath');
    expect(screen.getByLabelText('Time of arrival (optional)')).toHaveValue('2026-10-10T12:00');
  });

  it('updates search fields when the user types', () => {
    render(<RequestRidePage />);

    fireEvent.change(screen.getByLabelText('Pick-up area (optional)'), {
      target: { value: 'Oldfield Park' },
    });
    fireEvent.change(screen.getByLabelText('Destination'), {
      target: { value: 'University of Bath' },
    });

    expect(screen.getByLabelText('Pick-up area (optional)')).toHaveValue('Oldfield Park');
    expect(screen.getByLabelText('Destination')).toHaveValue('University of Bath');
  });

  it('shows an auth error before searching when no token is available', async () => {
    window.localStorage.removeItem('authToken');

    render(<RequestRidePage />);
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByText('No authentication token found. Please log in again.')).toBeInTheDocument();
    });
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('renders string-based search errors', async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce('String-based search error');

    render(<RequestRidePage />);
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByText('String-based search error')).toBeInTheDocument();
    });
  });

  it('submits the current origin and destination as query params', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    render(<RequestRidePage />);

    fireEvent.change(screen.getByLabelText('Pick-up area (optional)'), {
      target: { value: 'Oldfield Park' },
    });
    fireEvent.change(screen.getByLabelText('Destination'), {
      target: { value: 'University of Bath' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        'rides/?origin=Oldfield+Park&destination=University+of+Bath',
        { method: 'GET' },
      );
    });
  });

  it('keeps the results area empty when search returns no rides', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    render(<RequestRidePage />);
    fireEvent.change(screen.getByLabelText('Destination'), {
      target: { value: 'Nowhere' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalled();
    });
    expect(screen.queryByRole('button', { name: 'Request' })).not.toBeInTheDocument();
    expect(screen.queryByText('Booking request sent successfully!')).not.toBeInTheDocument();
  });

  it('renders returned rides using the current card format', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([searchResult]);

    render(<RequestRidePage />);
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByText('University of Bath')).toBeInTheDocument();
      expect(screen.getByText('From: Oldfield Park')).toBeInTheDocument();
      expect(screen.getByText('Driver: Alice')).toBeInTheDocument();
      expect(screen.getByText('Request')).toBeInTheDocument();
    });
  });

  it('books a ride after selecting a pickup point on the map', async () => {
    vi.mocked(apiFetch)
      .mockResolvedValueOnce([searchResult])
      .mockResolvedValueOnce({});

    render(<RequestRidePage />);
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Request' }));

    expect(screen.getByText('Book Ride to University of Bath')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('mock-map'));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Pickup & Request' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        'bookings/?ride_id=101&pickup_location=Map+Point&dropoff_location=University+of+Bath&price=3.5&pickup_lat=51.38&pickup_lng=-2.36',
        { method: 'POST' },
      );
      expect(screen.getByText('Booking request sent successfully!')).toBeInTheDocument();
    });
  });

  it('lets the user return from booking to the search screen', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([searchResult]);

    render(<RequestRidePage />);
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Request' }));

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(screen.getByText('Request a Ride')).toBeInTheDocument();
    expect(screen.queryByText('Book Ride to University of Bath')).not.toBeInTheDocument();
  });

  it('shows an error when booking fails with an Error object', async () => {
    vi.mocked(apiFetch)
      .mockResolvedValueOnce([searchResult])
      .mockRejectedValueOnce(new Error('Booking system offline'));

    render(<RequestRidePage />);
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Request' }));
    fireEvent.click(screen.getByRole('button', { name: 'Request Without Specific Pickup' }));

    await waitFor(() => {
      expect(screen.getByText('Booking system offline')).toBeInTheDocument();
    });
  });

  it('shows an error when booking fails with a string', async () => {
    vi.mocked(apiFetch)
      .mockResolvedValueOnce([searchResult])
      .mockRejectedValueOnce('String-based booking error');

    render(<RequestRidePage />);
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Request' }));
    fireEvent.click(screen.getByRole('button', { name: 'Request Without Specific Pickup' }));

    await waitFor(() => {
      expect(screen.getByText('String-based booking error')).toBeInTheDocument();
    });
  });
});
