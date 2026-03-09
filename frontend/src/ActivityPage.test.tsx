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
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    render(<ActivityPage {...mockProps} />);

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

  // DRIVER ACTIONS

  it('allows a driver to accept a passenger request and calls the API', async () => {
    const mockDriverRides = [{
      id: 201,
      destination: 'Oldfield Park',
      departure_time: '12:00 PM',
      status: 'upcoming',
      bookings: [
        { id: 301, status: 'pending', dropoff_location: 'Supermarket', passenger: { first_name: 'Bob', last_name: 'Jones' } }
      ]
    }];

    vi.mocked(apiFetch).mockResolvedValueOnce([]).mockResolvedValueOnce(mockDriverRides).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      const moreBtns = screen.getAllByText('More');
      fireEvent.click(moreBtns[1]);
    });

    await waitFor(() => { fireEvent.click(screen.getByText('Accept Request')); });

    await waitFor(() => {
      const confirmBtns = screen.getAllByRole('button', { name: 'Accept Request' });
      fireEvent.click(confirmBtns[confirmBtns.length - 1]);
    });

    expect(apiFetch).toHaveBeenCalledWith('bookings/301/accept', expect.objectContaining({ method: 'PUT' }));
  });

  it('allows a driver to deny a passenger request and calls the API', async () => {
    const mockDriverRides = [{
      id: 201,
      destination: 'Oldfield Park',
      departure_time: '12:00 PM',
      status: 'upcoming',
      bookings: [
        { id: 301, status: 'pending', dropoff_location: 'Supermarket', passenger: { first_name: 'Bob', last_name: 'Jones' } }
      ]
    }];

    vi.mocked(apiFetch).mockResolvedValueOnce([]).mockResolvedValueOnce(mockDriverRides).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      const moreBtns = screen.getAllByText('More');
      fireEvent.click(moreBtns[1]);
    });

    await waitFor(() => { fireEvent.click(screen.getByText('Deny Request')); });

    await waitFor(() => {
      const confirmBtns = screen.getAllByRole('button', { name: 'Deny Request' });
      fireEvent.click(confirmBtns[confirmBtns.length - 1]);
    });

    expect(apiFetch).toHaveBeenCalledWith('bookings/301', expect.objectContaining({ method: 'DELETE' }));
  });

  it('allows a driver to start a ride and calls the API', async () => {
    const mockDriverRides = [{
      id: 201, destination: 'Oldfield Park', departure_time: '12:00 PM', status: 'upcoming', bookings: []
    }];

    vi.mocked(apiFetch).mockResolvedValueOnce([]).mockResolvedValueOnce(mockDriverRides).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText('Begin Ride')); });

    await waitFor(() => { fireEvent.click(screen.getByRole('button', { name: 'Yes, Start' })); });

    expect(apiFetch).toHaveBeenCalledWith('rides/201', expect.objectContaining({
      method: 'PUT', body: JSON.stringify({ status: 'in_progress' })
    }));
  });

  it('allows a driver to cancel a whole ride and calls the API', async () => {
    const mockDriverRides = [{
      id: 201, destination: 'Oldfield Park', departure_time: '12:00 PM', status: 'upcoming', bookings: []
    }];

    vi.mocked(apiFetch).mockResolvedValueOnce([]).mockResolvedValueOnce(mockDriverRides).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText('Cancel Whole Trip')); });

    await waitFor(() => { fireEvent.click(screen.getByRole('button', { name: 'Yes, Cancel' })); });

    expect(apiFetch).toHaveBeenCalledWith('rides/201', expect.objectContaining({ method: 'DELETE' }));
  });

  // UI INTERACTIONS & MODALS

  it('allows a user to submit a rating for a past trip', async () => {
    const mockRiderBookings = [{
      id: 101, status: 'completed', ride: { destination: 'Campus', departure_time: '10:00 AM', driver: { first_name: 'Alice', last_name: 'Smith' } }, price: '3.50',
    }];

    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText('Rate Trip')); });

    await waitFor(() => { expect(screen.getAllByText('How was your trip?')[0]).toBeInTheDocument(); });

    const stars = screen.getAllByRole('button', { name: /star/i });
    fireEvent.click(stars[4]);
    fireEvent.click(screen.getByRole('button', { name: 'Submit Rating' }));

    await waitFor(() => { expect(screen.getAllByText('Rating Submitted!')[0]).toBeInTheDocument(); });
  });

  it('allows a user to report an issue for a past trip', async () => {
    const mockRiderBookings = [{
      id: 101, status: 'completed', ride: { destination: 'Campus', departure_time: '10:00 AM' },
    }];

    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText('Report Issue')); });

    await waitFor(() => { expect(screen.getAllByText('Report an Issue')[0]).toBeInTheDocument(); });

    const textarea = screen.getByPlaceholderText('Tell us what went wrong…');
    fireEvent.change(textarea, { target: { value: 'Driver was late.' } });

    fireEvent.click(screen.getByRole('button', { name: 'Send Report' }));

    await waitFor(() => { expect(screen.getAllByText('Report Sent')[0]).toBeInTheDocument(); });
  });

  it('expands collapsible lists when there are more than 3 items', async () => {
    const mockRiderBookings = Array.from({ length: 4 }).map((_, i) => ({
      id: 100 + i, status: 'completed', ride: { destination: `Destination ${i}`, departure_time: '10:00 AM' },
    }));

    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.queryByText('Destination 3')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'See more' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'See more' }));

    await waitFor(() => {
      expect(screen.getByText('Destination 3')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'See less' })).toBeInTheDocument();
    });
  });

  it('displays an empty state for the passenger carousel when there are no passengers', async () => {
    const mockDriverRides = [{
      id: 201, destination: 'Oldfield Park', departure_time: '12:00 PM', status: 'upcoming', bookings: []
    }];

    vi.mocked(apiFetch).mockResolvedValueOnce([]).mockResolvedValueOnce(mockDriverRides).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });

    await waitFor(() => { expect(screen.getByText('No passengers yet.')).toBeInTheDocument(); });
  });

  it('opens and uses the dropdown filter in the Driver mode requests section', async () => {
    const mockDriverRides = [{
      id: 201, destination: 'Oldfield Park', status: 'upcoming', bookings: [{ id: 301, status: 'pending', dropoff_location: 'Supermarket' }]
    }];

    vi.mocked(apiFetch).mockResolvedValueOnce([]).mockResolvedValueOnce(mockDriverRides).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => { expect(screen.getByText('Cost ▾')).toBeInTheDocument(); });

    fireEvent.click(screen.getByText('Cost ▾'));

    await waitFor(() => { expect(screen.getByText('Rating')).toBeInTheDocument(); });
    fireEvent.click(screen.getByText('Rating'));

    await waitFor(() => { expect(screen.getByText('Rating ▾')).toBeInTheDocument(); });
  });

  it('allows a rider to cancel a requested trip', async () => {
    const mockRiderBookings = [{ id: 101, status: 'pending', ride: { destination: 'Campus' } }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText('Cancel Trip')); });

    vi.mocked(apiFetch).mockResolvedValueOnce({});
    await waitFor(() => { fireEvent.click(screen.getByRole('button', { name: 'Yes, Cancel' })); });

    expect(apiFetch).toHaveBeenCalledWith('bookings/101', expect.objectContaining({ method: 'DELETE' }));
  });

  it('allows a driver to remove a passenger from an upcoming trip', async () => {
    const mockDriverRides = [{
      id: 201, destination: 'Oldfield Park', status: 'upcoming', bookings: [{ id: 301, status: 'confirmed', passenger: { first_name: 'Bob', last_name: 'Jones' } }]
    }];
    vi.mocked(apiFetch).mockResolvedValueOnce([]).mockResolvedValueOnce(mockDriverRides).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText('Remove')); });

    vi.mocked(apiFetch).mockResolvedValueOnce({});
    await waitFor(() => { fireEvent.click(screen.getByRole('button', { name: 'Remove Passenger' })); });

    expect(apiFetch).toHaveBeenCalledWith('bookings/301', expect.objectContaining({ method: 'DELETE' }));
  });

  it('allows a driver to rate a passenger on a past trip', async () => {
    const mockDriverRides = [{
      id: 201, destination: 'Oldfield Park', status: 'completed', bookings: [{ id: 301, status: 'confirmed', passenger: { first_name: 'Bob', last_name: 'Jones' } }]
    }];
    vi.mocked(apiFetch).mockResolvedValueOnce([]).mockResolvedValueOnce(mockDriverRides).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });

    await waitFor(() => { fireEvent.click(screen.getByText('Rate')); });
    await waitFor(() => { expect(screen.getAllByText('How was your trip?')[0]).toBeInTheDocument(); });
    fireEvent.click(screen.getAllByRole('button', { name: /star/i })[4]);
    fireEvent.click(screen.getByRole('button', { name: 'Submit Rating' }));
    await waitFor(() => { expect(screen.getAllByText('Rating Submitted!')[0]).toBeInTheDocument(); });
  });

  it('allows a driver to report an issue on a past trip', async () => {
    const mockDriverRides = [{
      id: 201, destination: 'Oldfield Park', status: 'completed', bookings: [{ id: 301, status: 'confirmed', passenger: { first_name: 'Bob', last_name: 'Jones' } }]
    }];
    vi.mocked(apiFetch).mockResolvedValueOnce([]).mockResolvedValueOnce(mockDriverRides).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });

    await waitFor(() => { fireEvent.click(screen.getByText('Report Issue')); });
    await waitFor(() => { expect(screen.getAllByText('Report an Issue')[0]).toBeInTheDocument(); });
    fireEvent.change(screen.getByPlaceholderText('Tell us what went wrong…'), { target: { value: 'Bad trip' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send Report' }));
    await waitFor(() => { expect(screen.getAllByText('Report Sent')[0]).toBeInTheDocument(); });
  });

  it('switches tabs in the passenger carousel', async () => {
    const mockDriverRides = [{
      id: 201, destination: 'Oldfield', status: 'upcoming', bookings: [
        { id: 301, status: 'confirmed', passenger: { first_name: 'Bob', last_name: 'Jones' } },
        { id: 302, status: 'confirmed', passenger: { first_name: 'Alice', last_name: 'Smith' } }
      ]
    }];
    vi.mocked(apiFetch).mockResolvedValueOnce([]).mockResolvedValueOnce(mockDriverRides).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    expect(screen.getByText('Bob Jones')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Alice'));
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
  });

  it('allows closing the trip details panel via Back button, Overlay, and Swipe', async () => {
    const mockRiderBookings = [{ id: 101, status: 'confirmed', ride: { destination: 'Campus' } }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);

    // Open/Close via Back Button
    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText(/Back/)); });

    // Open/Close via Overlay
    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    const sheet = screen.getByText('Trip Details').closest('.trip-sheet');
    const overlay = sheet?.previousElementSibling;
    fireEvent.click(overlay!);

    // Open/Close via Swipe Down (Touch) Y diff > 80
    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    fireEvent.touchStart(sheet!, { touches: [{ clientY: 100 }] });
    fireEvent.touchEnd(sheet!, { changedTouches: [{ clientY: 200 }] });
  });

  it('closes the confirm modal when Escape key is pressed', async () => {
    const mockRiderBookings = [{ id: 101, status: 'confirmed', ride: { destination: 'Campus' } }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText('Cancel Trip')); });

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByText('Cancel this trip?')).not.toBeInTheDocument();
    });
  });

  it('handles API error during action confirmation gracefully', async () => {
    const mockRiderBookings = [{ id: 101, status: 'confirmed', ride: { destination: 'Campus' } }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings);
    render(<ActivityPage {...mockProps} />);

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText('Cancel Trip')); });

    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Failed to cancel'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await waitFor(() => { fireEvent.click(screen.getByRole('button', { name: 'Yes, Cancel' })); });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('switches back to Rider mode if driver permission is revoked via props', async () => {
    const { rerender } = render(<ActivityPage {...mockProps} canUseDriverMode={true} />);

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));
    expect(screen.getByRole('button', { name: 'Driver' })).toHaveClass('toggle-tab-active');

    rerender(<ActivityPage {...mockProps} canUseDriverMode={false} />);
    expect(screen.getByRole('button', { name: 'Rider' })).toHaveClass('toggle-tab-active');
  });

  it('closes the sheet and refetches activity automatically after a successful action timeout', async () => {
    const mockRiderBookings = [{ id: 101, status: 'confirmed', ride: { destination: 'Campus' } }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValueOnce({}).mockResolvedValue([]);

    render(<ActivityPage {...mockProps} />);

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText('Cancel Trip')); });
    await waitFor(() => { fireEvent.click(screen.getByRole('button', { name: 'Yes, Cancel' })); });

    await waitFor(() => { expect(screen.getAllByText('Trip Cancelled')[0]).toBeInTheDocument(); });

    await waitFor(() => {
      expect(screen.queryByText('Trip Details')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });
  
  it('handles rating modal hover states, disabled submit, and cancel button', async () => {
    const mockRiderBookings = [{ id: 101, status: 'completed', ride: { destination: 'Campus' }, drivername: 'Alice' }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText('Rate Trip')); });

    // Click disabled submit (ensures selected && condition functions properly)
    const submitBtn = screen.getByRole('button', { name: 'Submit Rating' });
    fireEvent.click(submitBtn);
    expect(screen.getAllByText('How was your trip?')[0]).toBeInTheDocument();

    // Hover (mouseEnter) and Leave (mouseLeave) on stars
    const stars = screen.getAllByRole('button', { name: /star/i });
    fireEvent.mouseEnter(stars[3]);
    fireEvent.mouseLeave(stars[3]);

    // Click rating modal Cancel
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => { expect(screen.queryByText('How was your trip?')).not.toBeInTheDocument(); });
  });

  it('handles report modal disabled submit and cancel button', async () => {
    const mockRiderBookings = [{ id: 101, status: 'completed', ride: { destination: 'Campus' } }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText('Report Issue')); });

    // Attempting to submit empty report
    const submitBtn = screen.getByRole('button', { name: 'Send Report' });
    fireEvent.click(submitBtn);
    expect(screen.getAllByText('Report an Issue')[0]).toBeInTheDocument();

    // Click report modal Cancel
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => { expect(screen.queryByText('Report an Issue')).not.toBeInTheDocument(); });
  });

  it('ignores non-Escape keys and Escape key during success state in modals', async () => {
    const mockRiderBookings = [{ id: 101, status: 'confirmed', ride: { destination: 'Campus' } }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText('Cancel Trip')); });

    // Non-Escape key
    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
    expect(screen.getAllByText('Cancel this trip?')[0]).toBeInTheDocument();

    // Submit to enter success state
    vi.mocked(apiFetch).mockResolvedValueOnce({});
    fireEvent.click(screen.getByRole('button', { name: 'Yes, Cancel' }));
    await waitFor(() => { expect(screen.getAllByText('Trip Cancelled')[0]).toBeInTheDocument(); });

    // Escape during success state (should be ignored)
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.getAllByText('Trip Cancelled')[0]).toBeInTheDocument();
  });

  it('does not close the trip details panel if swipe down distance is less than 80', async () => {
    const mockRiderBookings = [{ id: 101, status: 'confirmed', ride: { destination: 'Campus' } }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    const sheet = screen.getByText('Trip Details').closest('.trip-sheet');

    // Swipe down by 50px (less than 80 threshold)
    fireEvent.touchStart(sheet!, { touches: [{ clientY: 100 }] });
    fireEvent.touchEnd(sheet!, { changedTouches: [{ clientY: 150 }] });

    await new Promise(r => setTimeout(r, 400));
    expect(screen.getByText('Trip Details')).toBeInTheDocument();
  });

  it('keeps confirm modal open if API action fails and returns false', async () => {
    const mockRiderBookings = [{ id: 101, status: 'confirmed', ride: { destination: 'Campus' } }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
    await waitFor(() => { fireEvent.click(screen.getByText('Cancel Trip')); });

    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    fireEvent.click(screen.getByRole('button', { name: 'Yes, Cancel' }));

    await waitFor(() => { expect(consoleSpy).toHaveBeenCalled(); });
    // The handleAction block returns false, so `succeed()` is skipped
    expect(screen.getAllByText('Cancel this trip?')[0]).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('displays default error if the API fetch fails without a message', async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce({}); // Rejection without a .message
    render(<ActivityPage {...mockProps} />);
    await waitFor(() => { expect(screen.getByText('Error: An error occurred')).toBeInTheDocument(); });
  });

  it('correctly maps activeUser and cancelled statuses', async () => {
    const mockRiderBookings = [
      { id: 101, status: 'confirmed', ride: { destination: 'Active Ride', status: 'in_progress' } },
      { id: 102, status: 'cancelled', ride: { destination: 'Cancelled Ride' } }
    ];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings);

    const mockDriverRides = [
      { id: 201, destination: 'Active Driver Ride', status: 'in_progress', bookings: [] }
    ];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockDriverRides);

    render(<ActivityPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.queryByText('Active Ride')).not.toBeInTheDocument(); // Filtered out
      expect(screen.queryByText('Cancelled Ride')).not.toBeInTheDocument(); // Filtered out
    });

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expect(screen.queryByText('Active Driver Ride')).not.toBeInTheDocument();
    });
  });

  it('passes existingPickup to RideRenderMap when coordinates are available', async () => {
    const mockRiderBookings = [{
      id: 101, ride_id: 201, pickup_lat: 51.38, pickup_lng: -2.36, status: 'confirmed',
      ride: { destination: 'Oldfield Park', status: 'upcoming', driver: { first_name: 'Alice' } }, price: '3.50'
    }];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);

    await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });

    await waitFor(() => { expect(screen.getByTestId('mock-map')).toBeInTheDocument(); });
  });

  it('switches back to Rider mode from Driver mode', async () => {
    vi.mocked(apiFetch).mockResolvedValue([]);
    render(<ActivityPage {...mockProps} />);

    // Wait for the initial load to finish
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Rider' })).toHaveClass('toggle-tab-active');
    });

    // Switch to Driver mode
    const driverTab = screen.getByRole('button', { name: 'Driver' });
    fireEvent.click(driverTab);
    await waitFor(() => {
      expect(driverTab).toHaveClass('toggle-tab-active');
    });

    // Switch back to Rider mode
    const riderTab = screen.getByRole('button', { name: 'Rider' });
    fireEvent.click(riderTab);

    await waitFor(() => {
      expect(riderTab).toHaveClass('toggle-tab-active');
    });
  });

  describe('Edge Cases and Missing Branches', () => {

    it('closes the filter dropdown when an option is selected', async () => {
      const mockDriverRides = [{
        id: 201, destination: 'Oldfield Park', status: 'upcoming', bookings: [{ id: 301, status: 'pending', dropoff_location: 'Supermarket' }]
      }];
      vi.mocked(apiFetch).mockResolvedValueOnce([]).mockResolvedValueOnce(mockDriverRides).mockResolvedValue([]);

      render(<ActivityPage {...mockProps} />);
      fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

      // Open filter
      await waitFor(() => { fireEvent.click(screen.getByText('Cost ▾')); });
      expect(screen.getByText('Ease')).toBeInTheDocument();

      // Click option
      fireEvent.click(screen.getByText('Ease'));

      // Dropdown should be closed
      expect(screen.queryByText('Cost')).not.toBeInTheDocument();
      expect(screen.getByText('Ease ▾')).toBeInTheDocument();
    });

    it('prevents closing the modal via overlay click when it is in a success state', async () => {
      const mockRiderBookings = [{ id: 101, status: 'confirmed', ride: { destination: 'Campus' } }];
      vi.mocked(apiFetch).mockResolvedValueOnce(mockRiderBookings).mockResolvedValue([]);
      render(<ActivityPage {...mockProps} />);

      await waitFor(() => { fireEvent.click(screen.getAllByText('More')[0]); });
      await waitFor(() => { fireEvent.click(screen.getByText('Cancel Trip')); });

      vi.mocked(apiFetch).mockResolvedValueOnce({});
      fireEvent.click(screen.getByRole('button', { name: 'Yes, Cancel' }));

      await waitFor(() => { expect(screen.getAllByText('Trip Cancelled')[0]).toBeInTheDocument(); });

      // Click the overlay
      const overlay = document.querySelector('.rating-modal-overlay');
      fireEvent.click(overlay!);

      // The success modal should still be in the document (it ignores the click)
      expect(screen.getAllByText('Trip Cancelled')[0]).toBeInTheDocument();
    });
  });
});