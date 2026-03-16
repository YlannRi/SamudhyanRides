import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PostRidePage from './PostRidePage';
import { apiFetch } from './lib/api';

vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

const mockGeocodeAddress = vi.fn();

vi.mock('./components/Map/useGeocode', () => ({
  useGeocode: () => ({
    geocodeAddress: mockGeocodeAddress,
  }),
}));

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText('Start Location'), {
    target: { value: 'Oldfield Park' },
  });
  fireEvent.change(screen.getByLabelText('Destination'), {
    target: { value: 'University of Bath' },
  });
  fireEvent.change(screen.getByLabelText('Destination arrival Date and Time'), {
    target: { value: '2026-10-10T12:00' },
  });
  fireEvent.change(screen.getByLabelText('Seats'), {
    target: { value: '4' },
  });
}

describe('PostRidePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    window.localStorage.setItem('authToken', 'fake-jwt-token');
    mockGeocodeAddress.mockResolvedValue([{ lat: 51.3811, lng: -2.359 }]);
  });

  it('renders the current form fields', () => {
    render(<PostRidePage />);

    expect(screen.getByText('Post a Ride')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Destination')).toBeInTheDocument();
    expect(screen.getByLabelText('Destination arrival Date and Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Seats')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Post Ride' })).toBeInTheDocument();
  });

  it('updates the inputs when the user types', () => {
    render(<PostRidePage />);

    fillRequiredFields();

    expect(screen.getByLabelText('Start Location')).toHaveValue('Oldfield Park');
    expect(screen.getByLabelText('Destination')).toHaveValue('University of Bath');
    expect(screen.getByLabelText('Destination arrival Date and Time')).toHaveValue('2026-10-10T12:00');
    expect(screen.getByLabelText('Seats')).toHaveValue(4);
  });

  it('shows an auth error before geocoding when no token is available', async () => {
    window.localStorage.removeItem('authToken');

    render(<PostRidePage />);
    fillRequiredFields();

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    await waitFor(() => {
      expect(screen.getByText('No authentication token found. Please log in again.')).toBeInTheDocument();
    });
    expect(mockGeocodeAddress).not.toHaveBeenCalled();
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('posts a ride with geocoded coordinates and resets the form on success', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({ success: true });

    render(<PostRidePage />);
    fillRequiredFields();

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    await waitFor(() => {
      expect(mockGeocodeAddress).toHaveBeenCalledTimes(2);
      expect(apiFetch).toHaveBeenCalledWith('rides/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: 'Oldfield Park',
          destination: 'University of Bath',
          origin_lat: 51.3811,
          origin_lng: -2.359,
          destination_lat: 51.3811,
          destination_lng: -2.359,
          departure_time: new Date('2026-10-10T12:00').toISOString(),
          seats_total: 4,
        }),
      });
      expect(screen.getByText('Ride successfully posted!')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Start Location')).toHaveValue('');
    expect(screen.getByLabelText('Destination')).toHaveValue('');
    expect(screen.getByLabelText('Destination arrival Date and Time')).toHaveValue('');
    expect(screen.getByLabelText('Seats')).toHaveValue(3);
  });

  it('shows an api error returned during submission', async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Internal Server Error'));

    render(<PostRidePage />);
    fillRequiredFields();

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    await waitFor(() => {
      expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
    });
  });

  it('shows a loading state while the request is in flight', async () => {
    let resolveRequest: ((value: unknown) => void) | undefined;
    const requestPromise = new Promise((resolve) => {
      resolveRequest = resolve;
    });
    vi.mocked(apiFetch).mockReturnValueOnce(requestPromise as Promise<never>);

    render(<PostRidePage />);
    fillRequiredFields();

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    const loadingButton = screen.getByRole('button', { name: 'Posting...' });
    expect(loadingButton).toBeDisabled();

    resolveRequest?.({ success: true });

    await waitFor(() => {
      expect(screen.getByText('Ride successfully posted!')).toBeInTheDocument();
    });
  });

  it('renders string-based submission errors', async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce('Server string exception');

    render(<PostRidePage />);
    fillRequiredFields();

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    await waitFor(() => {
      expect(screen.getByText('Server string exception')).toBeInTheDocument();
    });
  });

  it('clears an old error after a later successful submission', async () => {
    vi.mocked(apiFetch)
      .mockRejectedValueOnce(new Error('First attempt failed'))
      .mockResolvedValueOnce({ success: true });

    render(<PostRidePage />);
    fillRequiredFields();

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    await waitFor(() => {
      expect(screen.getByText('First attempt failed')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    await waitFor(() => {
      expect(screen.queryByText('First attempt failed')).not.toBeInTheDocument();
      expect(screen.getByText('Ride successfully posted!')).toBeInTheDocument();
    });
  });
});
