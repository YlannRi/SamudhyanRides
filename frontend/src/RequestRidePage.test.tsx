import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RequestRidePage from './RequestRidePage';
import { apiFetch } from './lib/api';

// Mock the API fetch utility
vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

// Mock the Map Component so it doesn't crash in tests
vi.mock('./components/Map/RideRenderMap', () => ({
  RideRenderMap: ({ onPickupSelect }: any) => (
    <div
      data-testid="mock-map"
      onClick={() => onPickupSelect(51.38, -2.36)}
    >
      Mock Map (Click to select pickup)
    </div>
  ),
}));

describe('RequestRidePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage to return an auth token by default
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'authToken') return 'fake-jwt-token';
      return null;
    });
  });

  it('renders the search form correctly', () => {
    render(<RequestRidePage />);

    // Since labels lack htmlFor attributes, we just check if the text exists
    expect(screen.getByText('Request a Ride')).toBeInTheDocument();
    expect(screen.getByText('Pick-up area (optional)')).toBeInTheDocument();
    expect(screen.getByText('Destination')).toBeInTheDocument();
    expect(screen.getByText('Time of arrival (optional)')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Search Rides' })).toBeInTheDocument();
  });

  it('prefills inputs if prefill prop is provided', () => {
    const prefill = {
      destination: 'University of Bath',
      arrivalDateTimeLocal: '2026-10-10T12:00',
    };

    const { container } = render(<RequestRidePage prefill={prefill} />);

    // Select by placeholder since getByLabelText won't work without htmlFor
    expect(screen.getByPlaceholderText('e.g. University of Bath')).toHaveValue('University of Bath');

    // Select the datetime input directly from the container
    const timeInput = container.querySelector('input[type="datetime-local"]');
    expect(timeInput).toHaveValue('2026-10-10T12:00');
  });

  it('updates inputs when the user types', () => {
    const { container } = render(<RequestRidePage />);

    fireEvent.change(screen.getByPlaceholderText('e.g. Oldfield Park'), { target: { value: 'Oldfield Park' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. University of Bath'), { target: { value: 'City Centre' } });

    // Ensure the time input change handler is also covered
    const timeInput = container.querySelector('input[type="datetime-local"]');
    if (timeInput) {
      fireEvent.change(timeInput, { target: { value: '2026-12-25T14:30' } });
      expect(timeInput).toHaveValue('2026-12-25T14:30');
    }

    expect(screen.getByPlaceholderText('e.g. Oldfield Park')).toHaveValue('Oldfield Park');
    expect(screen.getByPlaceholderText('e.g. University of Bath')).toHaveValue('City Centre');
  });

  it('shows an error if searching without an auth token', async () => {
    // Explicitly override the global mock for this test so it returns null
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null);

    render(<RequestRidePage />);

    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByText('No authentication token found. Please log in again.')).toBeInTheDocument();
    });
  });

  it('handles non-Error exceptions during search to cover ternary branch', async () => {
    // Mock the API to throw a string instead of an Error object
    vi.mocked(apiFetch).mockRejectedValueOnce('String-based search error');

    render(<RequestRidePage />);

    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByText('String-based search error')).toBeInTheDocument();
    });
  });

  it('displays "No rides available" when search returns empty', async () => {
    // Return empty array
    vi.mocked(apiFetch).mockResolvedValue([]);

    render(<RequestRidePage />);

    fireEvent.change(screen.getByPlaceholderText('e.g. University of Bath'), { target: { value: 'Nowhere' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByText('No rides available')).toBeInTheDocument();
    });
  });

  it('displays a list of rides when search is successful', async () => {
    const mockRides = [
      {
        id: 101,
        origin: 'Oldfield Park',
        destination: 'University of Bath',
        departure_time: '10:00 AM',
        driverName: 'Alice',
        price: '£3.50',
      }
    ];
    // Use mockResolvedValue (not Once) to ensure the component definitely gets it
    vi.mocked(apiFetch).mockResolvedValue(mockRides);

    render(<RequestRidePage />);

    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    await waitFor(() => {
      expect(screen.getByText('University of Bath')).toBeInTheDocument();
      expect(screen.getByText('From: Oldfield Park')).toBeInTheDocument();
      expect(screen.getByText('Driver: Alice')).toBeInTheDocument();
      expect(screen.getByText('£3.50')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    });
  });

  it('handles the full booking flow successfully', async () => {
    const mockRides = [{ id: 101, destination: 'University of Bath', price: '£3.50' }];
    vi.mocked(apiFetch).mockResolvedValue(mockRides);

    render(<RequestRidePage />);

    // Search for ride
    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    // Wait for the button to appear, then click it outside the waitFor block
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Request' }));

    // Verify we are on the booking screen
    expect(screen.getByText('Book Ride #101')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Request Without Specific Pickup' })).toBeInTheDocument();

    // Click the mock map to set pickup coordinates
    fireEvent.click(screen.getByTestId('mock-map'));

    // Button should change since we have pickup coordinates now
    expect(screen.getByRole('button', { name: 'Confirm Pickup & Request' })).toBeInTheDocument();

    // Mock the booking API call
    vi.mocked(apiFetch).mockResolvedValue({});

    // Click confirm
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Pickup & Request' }));

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText('Booking request sent successfully!')).toBeInTheDocument();
    });
  });

  it('can go back from the booking screen to the search screen', async () => {
    const mockRides = [{ id: 101, destination: 'University of Bath' }];
    vi.mocked(apiFetch).mockResolvedValue(mockRides);

    render(<RequestRidePage />);

    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));

    // Wait for UI to update, then click
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Request' }));

    // Check we are on booking screen
    expect(screen.getByText('Book Ride #101')).toBeInTheDocument();

    // Click the back button
    fireEvent.click(screen.getByText('←'));

    // Verify we went back to search screen
    expect(screen.getByText('Request a Ride')).toBeInTheDocument();
    expect(screen.queryByText('Book Ride #101')).not.toBeInTheDocument();
  });

  it('shows an error if booking fails due to missing auth token', async () => {
    const mockRides = [{ id: 101, destination: 'University of Bath', price: '£3.50' }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRides);

    render(<RequestRidePage />);

    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Request' }));

    // Force localStorage to return null to simulate an expired token
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(null);

    fireEvent.click(screen.getByRole('button', { name: 'Request Without Specific Pickup' }));

    await waitFor(() => {
      expect(screen.getByText('No authentication token found.')).toBeInTheDocument();
    });
  });

  it('shows an error if booking API fails with an Error object', async () => {
    const mockRides = [{ id: 101, destination: 'University of Bath', price: '£3.50' }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRides);

    render(<RequestRidePage />);

    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Request' }));

    // Mock an API rejection with an Error object
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Booking system offline'));

    fireEvent.click(screen.getByRole('button', { name: 'Request Without Specific Pickup' }));

    await waitFor(() => {
      expect(screen.getByText('Booking system offline')).toBeInTheDocument();
    });
  });

  it('handles non-Error exceptions during booking to cover ternary branch', async () => {
    const mockRides = [{ id: 101, destination: 'University of Bath', price: '£3.50' }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRides);

    render(<RequestRidePage />);

    fireEvent.click(screen.getByRole('button', { name: 'Search Rides' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Request' })).toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Request' }));

    // Mock an API rejection with a raw string
    vi.mocked(apiFetch).mockRejectedValueOnce('String-based booking error');

    fireEvent.click(screen.getByRole('button', { name: 'Request Without Specific Pickup' }));

    await waitFor(() => {
      expect(screen.getByText('String-based booking error')).toBeInTheDocument();
    });
  });
});