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

  // --- NEW USER JOURNEY TESTS ---

  it('allows user to switch between multiple active trips', async () => {
    const multipleTrips = [
      ...mockUserTrips,
      {
        id: 2,
        ride_id: 102,
        status: 'confirmed',
        pickup_time: '2026-03-05T12:00:00Z',
        pickup_code: '9999',
        dropoff_location: 'City Centre',
        price: '7.50',
        ride: {
          status: 'in_progress',
          driver: { first_name: 'Alice', last_name: 'Wonder' },
          destination: 'City Centre',
        },
      },
    ];

    globalThis.fetch = vi.fn(async (url) => {
      if (url.toString().includes('/bookings/me')) return { ok: true, json: async () => multipleTrips };
      if (url.toString().includes('/rides/driver/dashboard')) return { ok: true, json: async () => mockDriverRides };
      return { ok: false, status: 404 };
    }) as any;

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);
    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());

    // Verify first trip is shown initially
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Click the tab for the second trip
    fireEvent.click(screen.getByRole('button', { name: 'Ride #102' }));

    // Verify UI updated to show the second trip
    expect(screen.getByText('Alice Wonder')).toBeInTheDocument();
    expect(screen.getByText('9999')).toBeInTheDocument();
  });

  it('displays "Pending" for invalid departure times and handles missing driver names gracefully', async () => {
    const oddTrip = [
      {
        id: 9,
        ride_id: 99,
        status: 'confirmed',
        pickup_time: 'invalid-date', // Will force isNaN check
        ride: { status: 'in_progress', driver: {} }, // Missing first/last name
      },
    ];

    globalThis.fetch = vi.fn(async (url) => {
      if (url.toString().includes('/bookings/me')) return { ok: true, json: async () => oddTrip };
      if (url.toString().includes('/rides/driver/dashboard')) return { ok: true, json: async () => [] };
      return { ok: false };
    }) as any;

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);
    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());

    expect(screen.getByText('Unknown Driver')).toBeInTheDocument();
    expect(screen.getByText('Departure Pending')).toBeInTheDocument();
  });

  // --- NEW DRIVER JOURNEY TESTS ---

  it('shows empty state for driver when no active drives exist', async () => {
    globalThis.fetch = vi.fn(async (url) => {
      if (url.toString().includes('/bookings/me')) return { ok: true, json: async () => [] };
      if (url.toString().includes('/rides/driver/dashboard')) return { ok: true, json: async () => [] }; // Empty
      return { ok: false };
    }) as any;

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);
    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
      expect(screen.getByText('No Active Drives')).toBeInTheDocument();
      expect(screen.getByText('You are not currently driving any active routes.')).toBeInTheDocument();
    });
  });

  it('allows driver to switch routes and handles routes with no confirmed passengers', async () => {
    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);
    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));
    await waitFor(() => expect(screen.getByText('Route: City Centre')).toBeInTheDocument());

    // Click the second route (University of Bath) which has empty bookings in our mockData
    fireEvent.click(screen.getByRole('button', { name: 'Route: University of Bath' }));

    await waitFor(() => {
      expect(screen.getByText('No confirmed passengers for this ride.')).toBeInTheDocument();
    });
  });

  it('displays "No rating yet" if a passenger does not have a rating', async () => {
    const unratedDriverRides = [
      {
        id: 201,
        status: 'in_progress',
        destination: 'City Centre',
        bookings: [
          { id: 301, status: 'confirmed', passenger: { first_name: 'New', last_name: 'Guy' } }, // No rating
        ],
      },
    ];

    globalThis.fetch = vi.fn(async (url) => {
      if (url.toString().includes('/bookings/me')) return { ok: true, json: async () => [] };
      if (url.toString().includes('/rides/driver/dashboard')) return { ok: true, json: async () => unratedDriverRides };
      return { ok: false };
    }) as any;

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);
    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));
    await waitFor(() => {
      expect(screen.getByText('No rating yet')).toBeInTheDocument();
    });
  });

  // --- NEW ERROR HANDLING TESTS ---

  it('handles network errors during initial fetch gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network Down'));

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);

    // It should exit loading state and fall back to the empty array defaults
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching journeys:", expect.any(Error));
      expect(screen.getByText('No Active Journeys')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('alerts the user if completing a ride fails', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    globalThis.fetch = vi.fn(async (url) => {
      if (url.toString().includes('/bookings/me')) return { ok: true, json: async () => [] };
      if (url.toString().includes('/rides/driver/dashboard')) return { ok: true, json: async () => mockDriverRides };
      if (url.toString().includes('/complete')) return { ok: false }; // Force completion failure
      return { ok: false };
    }) as any;

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);
    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));
    await waitFor(() => expect(screen.getByRole('button', { name: /Complete Ride/i })).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Complete Ride/i }));

    // Wait for the alert to fire
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Could not complete the ride. Please try again.');
    });

    alertMock.mockRestore();
  });

  it('renders fallback values in User mode when optional data is missing', async () => {
    const sparseTrip = [{
      id: 10,
      ride_id: 110,
      status: 'confirmed',
      pickup_time: '2026-03-04T12:00:00Z',
      // Explicitly missing pickup_code, dropoff_location, and price
      ride: { status: 'in_progress', driver: { first_name: 'Bob' } }
    }];

    globalThis.fetch = vi.fn(async (url) => {
      if (url.toString().includes('/bookings/me')) return { ok: true, json: async () => sparseTrip };
      return { ok: true, json: async () => [] };
    }) as any;

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);
    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());

    expect(screen.getByText('----')).toBeInTheDocument(); // Missing code fallback
    expect(screen.getByText('£0.00')).toBeInTheDocument(); // Missing price fallback
    expect(screen.getByText('—')).toBeInTheDocument(); // Missing destination fallback
  });

  it('allows driver to switch between multiple passengers and renders fallbacks for missing data', async () => {
    const sparseRides = [{
      id: 210,
      status: 'in_progress',
      destination: 'Sparse City',
      bookings: [
        { id: 310, status: 'confirmed', passenger: null }, // Missing passenger entirely
        { id: 311, status: 'confirmed', passenger: { first_name: 'Tom', last_name: 'Hanks' } } // Missing details
      ]
    }];

    globalThis.fetch = vi.fn(async (url) => {
      if (url.toString().includes('/rides/driver/dashboard')) return { ok: true, json: async () => sparseRides };
      return { ok: true, json: async () => [] };
    }) as any;

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);
    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));

    await waitFor(() => {
       // First passenger (id 310) is active. Name fallback to 'Pass 310', but the tab splits by space, rendering 'Pass'
       expect(screen.getByRole('button', { name: 'Pass' })).toBeInTheDocument();
       expect(screen.getByText('Unknown')).toBeInTheDocument(); // Unknown passenger name fallback
       expect(screen.getByText('Map Point')).toBeInTheDocument(); // Missing pickup location fallback
       expect(screen.getByText('----')).toBeInTheDocument(); // Missing code fallback
       expect(screen.getByText('£0.00')).toBeInTheDocument(); // Missing price fallback
    });

    // Switch to second passenger
    fireEvent.click(screen.getByRole('button', { name: 'Tom' }));
    await waitFor(() => {
       expect(screen.getByText('Tom Hanks')).toBeInTheDocument();
    });
  });

  it('handles non-OK HTTP responses without crashing', async () => {
    // Return a 500 error, which means `res.ok` is false, but it doesn't throw a network error
    globalThis.fetch = vi.fn(async () => ({ ok: false, status: 500 })) as any;

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument();
      // It should safely bypass the if (res.ok) blocks and default to empty arrays
      expect(screen.getByText('No Active Journeys')).toBeInTheDocument();
    });
  });

  it('disables the complete ride button and shows "Completing..." while submitting', async () => {
    // Create a promise we can stall to check the loading UI
    let resolveComplete: (value: any) => void;
    const completePromise = new Promise((res) => { resolveComplete = res; });

    globalThis.fetch = vi.fn(async (url) => {
      if (url.toString().includes('/bookings/me')) return { ok: true, json: async () => [] };
      if (url.toString().includes('/rides/driver/dashboard')) return { ok: true, json: async () => mockDriverRides };
      if (url.toString().includes('/complete')) return completePromise; // Hangs the completion API
      return { ok: false };
    }) as any;

    render(<JourneyPage canUseDriverMode={true} onDriverSignup={mockOnDriverSignup} />);
    await waitFor(() => expect(screen.queryByText('Loading your journeys...')).not.toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: 'Driver' }));
    await waitFor(() => expect(screen.getByRole('button', { name: /Complete Ride/i })).toBeInTheDocument());

    // Click Complete
    fireEvent.click(screen.getByRole('button', { name: /Complete Ride/i }));

    // Verify loading state
    await waitFor(() => {
      const completingBtn = screen.getByRole('button', { name: 'Completing...' });
      expect(completingBtn).toBeInTheDocument();
      expect(completingBtn).toBeDisabled();
    });

    // Resolve the API call to clean up
    resolveComplete!({ ok: true, json: async () => ({}) });

    await waitFor(() => {
       // After completing, the ride state updates and the ride is removed
       expect(screen.queryByText('Route: City Centre')).not.toBeInTheDocument();
    });
  });
});