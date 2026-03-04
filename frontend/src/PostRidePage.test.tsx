import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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
});