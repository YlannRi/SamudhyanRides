import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import PostRidePage from './PostRidePage';
import { apiFetch } from './lib/api';

// Mock the API fetch utility
vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

// Setup a mock function we can easily control in our tests
const mockGeocodeAddress = vi.fn();

// Mock the geocode hook
vi.mock('./components/Map/useGeocode', () => ({
  useGeocode: () => ({
    geocodeAddress: mockGeocodeAddress,
  }),
}));

describe('PostRidePage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to a successful geocode resolution
    mockGeocodeAddress.mockResolvedValue([{ lat: 51.3811, lng: -2.3590 }]);
    // Set a dummy auth token for tests that require authentication
    window.localStorage.setItem('authToken', 'fake-jwt-token');
  });

  it('renders the post ride form correctly', () => {
    render(<PostRidePage />);

    expect(screen.getByText('Post a Ride')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Destination')).toBeInTheDocument();
    expect(screen.getByLabelText('Destination arrival Date and Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Price (£)')).toBeInTheDocument();
    expect(screen.getByLabelText('Seats')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Post Ride' })).toBeInTheDocument();
  });

  it('updates the input fields when the user types', () => {
    render(<PostRidePage />);

    const originInput = screen.getByLabelText('Start Location');
    const destinationInput = screen.getByLabelText('Destination');

    fireEvent.change(originInput, { target: { value: 'Oldfield Park' } });
    fireEvent.change(destinationInput, { target: { value: 'University of Bath' } });

    expect(originInput).toHaveValue('Oldfield Park');
    expect(destinationInput).toHaveValue('University of Bath');
  });

  it('updates all input fields when the user types', () => {
    render(<PostRidePage />);

    fireEvent.change(screen.getByLabelText('Start Location'), { target: { value: 'Oldfield Park' } });
    fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'University of Bath' } });
    fireEvent.change(screen.getByLabelText('Destination arrival Date and Time'), { target: { value: '2026-10-10T12:00' } });
    fireEvent.change(screen.getByLabelText('Price (£)'), { target: { value: '5.50' } });
    fireEvent.change(screen.getByLabelText('Seats'), { target: { value: '4' } });

    expect(screen.getByLabelText('Start Location')).toHaveValue('Oldfield Park');
    expect(screen.getByLabelText('Destination')).toHaveValue('University of Bath');
    expect(screen.getByLabelText('Destination arrival Date and Time')).toHaveValue('2026-10-10T12:00');
    expect(screen.getByLabelText('Price (£)')).toHaveValue(5.5);
    expect(screen.getByLabelText('Seats')).toHaveValue(4);
  });

  it('shows an error if submitting without an auth token', async () => {
    // Clear the token specifically for this test
    window.localStorage.removeItem('authToken');

    render(<PostRidePage />);

    fireEvent.change(screen.getByLabelText('Start Location'), { target: { value: 'Start' } });
    fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'End' } });
    fireEvent.change(screen.getByLabelText('Destination arrival Date and Time'), { target: { value: '2026-10-10T12:00' } });
    fireEvent.change(screen.getByLabelText('Price (£)'), { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    await waitFor(() => {
      expect(screen.getByText('No authentication token found. Please log in again.')).toBeInTheDocument();
    });
  });

  it('successfully posts a ride, formats the payload, and clears the form', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({ success: true }); // Mock API success

    render(<PostRidePage />);

    // Fill form
    fireEvent.change(screen.getByLabelText('Start Location'), { target: { value: 'Oldfield Park' } });
    fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'University of Bath' } });
    fireEvent.change(screen.getByLabelText('Destination arrival Date and Time'), { target: { value: '2026-10-10T12:00' } });
    fireEvent.change(screen.getByLabelText('Price (£)'), { target: { value: '5.50' } });
    fireEvent.change(screen.getByLabelText('Seats'), { target: { value: '4' } });

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    await waitFor(() => {
      // 1. Verify Geocoding fired
      expect(mockGeocodeAddress).toHaveBeenCalledTimes(2);

      // 2. Verify API payload
      expect(apiFetch).toHaveBeenCalledWith('rides/', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"origin":"Oldfield Park"'), // Quick snapshot check
      }));

      // 3. Verify success message
      expect(screen.getByText('Ride successfully posted!')).toBeInTheDocument();
    });

    // 4. Verify form is cleared and defaults reset
    expect(screen.getByLabelText('Start Location')).toHaveValue('');
    expect(screen.getByLabelText('Destination')).toHaveValue('');
    expect(screen.getByLabelText('Destination arrival Date and Time')).toHaveValue('');
    expect(screen.getByLabelText('Price (£)')).toHaveValue(null);
    expect(screen.getByLabelText('Seats')).toHaveValue(3); // Defaults back to 3
  });

  it('shows an error if origin geocoding fails to return results', async () => {
    // Return empty array for 'Nowhere', valid array otherwise
    mockGeocodeAddress.mockImplementation((address) => {
      if (address === 'Nowhere') return Promise.resolve([]);
      return Promise.resolve([{ lat: 51.3811, lng: -2.3590 }]);
    });

    render(<PostRidePage />);

    fireEvent.change(screen.getByLabelText('Start Location'), { target: { value: 'Nowhere' } });
    fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'University of Bath' } });
    fireEvent.change(screen.getByLabelText('Destination arrival Date and Time'), { target: { value: '2026-10-10T12:00' } });
    fireEvent.change(screen.getByLabelText('Price (£)'), { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    await waitFor(() => {
      expect(screen.getByText('Could not find coordinates for the Start location.')).toBeInTheDocument();
    });
  });

  it('shows an error if destination geocoding fails to return results', async () => {
    mockGeocodeAddress.mockImplementation((address) => {
      if (address === 'Nowhere') return Promise.resolve([]);
      return Promise.resolve([{ lat: 51.3811, lng: -2.3590 }]);
    });

    render(<PostRidePage />);

    fireEvent.change(screen.getByLabelText('Start Location'), { target: { value: 'Oldfield Park' } });
    fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'Nowhere' } });
    fireEvent.change(screen.getByLabelText('Destination arrival Date and Time'), { target: { value: '2026-10-10T12:00' } });
    fireEvent.change(screen.getByLabelText('Price (£)'), { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    await waitFor(() => {
      expect(screen.getByText('Could not find coordinates for the destination.')).toBeInTheDocument();
    });
  });

  it('shows an error if the backend API fetch fails', async () => {
    // Simulate a backend crash or network error
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Internal Server Error'));

    render(<PostRidePage />);

    fireEvent.change(screen.getByLabelText('Start Location'), { target: { value: 'Oldfield Park' } });
    fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'University of Bath' } });
    fireEvent.change(screen.getByLabelText('Destination arrival Date and Time'), { target: { value: '2026-10-10T12:00' } });
    fireEvent.change(screen.getByLabelText('Price (£)'), { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    await waitFor(() => {
      expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
    });
  });

  it('disables the submit button and shows "Posting..." while submitting', async () => {
    // Create a promise we can control so the component stays in the "loading" state
    let resolveApi: (value: any) => void;
    const apiPromise = new Promise((resolve) => {
      resolveApi = resolve;
    });
    vi.mocked(apiFetch).mockReturnValueOnce(apiPromise as any);

    render(<PostRidePage />);

    // Fill form
    fireEvent.change(screen.getByLabelText('Start Location'), { target: { value: 'Oldfield Park' } });
    fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'University of Bath' } });
    fireEvent.change(screen.getByLabelText('Destination arrival Date and Time'), { target: { value: '2026-10-10T12:00' } });
    fireEvent.change(screen.getByLabelText('Price (£)'), { target: { value: '5.50' } });

    // Click submit
    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    // Verify the button text changed and it is disabled
    const button = screen.getByRole('button', { name: 'Posting...' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Resolve the promise to let the component finish and clean up
    resolveApi!({ success: true });
    await waitFor(() => {
      expect(screen.getByText('Ride successfully posted!')).toBeInTheDocument();
    });
  });

  it('handles non-Error string exceptions gracefully', async () => {
    // Reject with a plain string instead of an Error object to hit the `String(err)` branch
    vi.mocked(apiFetch).mockRejectedValueOnce("Server string exception");

    render(<PostRidePage />);

    fireEvent.change(screen.getByLabelText('Start Location'), { target: { value: 'Oldfield Park' } });
    fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'University of Bath' } });
    fireEvent.change(screen.getByLabelText('Destination arrival Date and Time'), { target: { value: '2026-10-10T12:00' } });
    fireEvent.change(screen.getByLabelText('Price (£)'), { target: { value: '5.50' } });

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    await waitFor(() => {
      expect(screen.getByText('Server string exception')).toBeInTheDocument();
    });
  });

  it('clears previous errors when a new submission is successful', async () => {
    // Force the first attempt to fail
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('First attempt failed'));

    render(<PostRidePage />);

    fireEvent.change(screen.getByLabelText('Start Location'), { target: { value: 'Oldfield Park' } });
    fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'University of Bath' } });
    fireEvent.change(screen.getByLabelText('Destination arrival Date and Time'), { target: { value: '2026-10-10T12:00' } });
    fireEvent.change(screen.getByLabelText('Price (£)'), { target: { value: '5.50' } });

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    // Wait for the error to appear
    await waitFor(() => {
      expect(screen.getByText('First attempt failed')).toBeInTheDocument();
    });

    // Setup the second attempt to succeed
    vi.mocked(apiFetch).mockResolvedValueOnce({ success: true });

    // Re-fill fields since they weren't cleared on failure
    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    await waitFor(() => {
      // The error should be gone, and the success message should appear
      expect(screen.queryByText('First attempt failed')).not.toBeInTheDocument();
      expect(screen.getByText('Ride successfully posted!')).toBeInTheDocument();
    });
  });

});