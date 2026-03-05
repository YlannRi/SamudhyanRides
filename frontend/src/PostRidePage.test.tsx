import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import PostRidePage from './PostRidePage';

// Mock the API fetch utility
vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

// Mock the geocode hook so it doesn't crash during rendering
vi.mock('./components/Map/useGeocode', () => ({
  useGeocode: () => ({
    geocodeAddress: vi.fn(),
  }),
}));

describe('PostRidePage Component', () => {
  it('renders the post ride form correctly', () => {
    //Render the component
    render(<PostRidePage />);

    // Check if the main heading is present
    expect(screen.getByText('Post a Ride')).toBeInTheDocument();

    // Check if all the form input labels are rendered
    expect(screen.getByLabelText('Start Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Destination')).toBeInTheDocument();
    expect(screen.getByLabelText('Destination arrival Date and Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Price (£)')).toBeInTheDocument();
    expect(screen.getByLabelText('Seats')).toBeInTheDocument();

    // Check if the submit button is present
    expect(screen.getByRole('button', { name: 'Post Ride' })).toBeInTheDocument();
  });

  it('updates the input fields when the user types', () => {
    render(<PostRidePage />);

    // Get the inputs
    const originInput = screen.getByLabelText('Start Location');
    const destinationInput = screen.getByLabelText('Destination');

    // Simulate user typing
    fireEvent.change(originInput, { target: { value: 'Oldfield Park' } });
    fireEvent.change(destinationInput, { target: { value: 'University of Bath' } });

    // Verify the inputs updated correctly
    expect(originInput).toHaveValue('Oldfield Park');
    expect(destinationInput).toHaveValue('University of Bath');
  });

  it('updates all input fields when the user types', () => {
    render(<PostRidePage />);

    // Simulate user typing in all fields
    fireEvent.change(screen.getByLabelText('Start Location'), { target: { value: 'Oldfield Park' } });
    fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'University of Bath' } });
    fireEvent.change(screen.getByLabelText('Destination arrival Date and Time'), { target: { value: '2026-10-10T12:00' } });
    fireEvent.change(screen.getByLabelText('Price (£)'), { target: { value: '5.50' } });
    fireEvent.change(screen.getByLabelText('Seats'), { target: { value: '4' } });

    // Verify all states updated correctly
    expect(screen.getByLabelText('Start Location')).toHaveValue('Oldfield Park');
    expect(screen.getByLabelText('Destination')).toHaveValue('University of Bath');
    expect(screen.getByLabelText('Destination arrival Date and Time')).toHaveValue('2026-10-10T12:00');
    expect(screen.getByLabelText('Price (£)')).toHaveValue(5.5);
    expect(screen.getByLabelText('Seats')).toHaveValue(4);
  });

  it('shows an error if submitting without an auth token', async () => {
    // Clear any token that might be lingering in the test environment
    window.localStorage.removeItem('authToken');

    render(<PostRidePage />);

    // Fill in required fields so HTML5 validation doesn't block the submission
    fireEvent.change(screen.getByLabelText('Start Location'), { target: { value: 'Start' } });
    fireEvent.change(screen.getByLabelText('Destination'), { target: { value: 'End' } });
    fireEvent.change(screen.getByLabelText('Destination arrival Date and Time'), { target: { value: '2026-10-10T12:00' } });
    fireEvent.change(screen.getByLabelText('Price (£)'), { target: { value: '5' } });

    fireEvent.click(screen.getByRole('button', { name: 'Post Ride' }));

    // Wait for the async try/catch block to execute and render the error message
    await waitFor(() => {
      expect(screen.getByText('No authentication token found. Please log in again.')).toBeInTheDocument();
    });
  });

});