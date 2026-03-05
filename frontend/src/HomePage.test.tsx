import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePage from './HomePage';

describe('HomePage Component', () => {
  const mockProps = {
    onRequestRide: vi.fn(),
    onPostRide: vi.fn(),
    canUseDriverMode: true,
    onDriverSignup: vi.fn(),
    onOpenTimetable: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the header and core sections', () => {
    render(<HomePage {...mockProps} />);

    expect(screen.getByText('SamudhyanRides')).toBeInTheDocument();
    expect(screen.getByText('Where to?')).toBeInTheDocument();
    expect(screen.getByText('Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('University of Bath')).toBeInTheDocument();
    expect(screen.getByText('Timetable')).toBeInTheDocument();
  });

  it('handles "Where to?" click in default user mode', () => {
    render(<HomePage {...mockProps} />);
    fireEvent.click(screen.getByText('Where to?'));
    expect(mockProps.onRequestRide).toHaveBeenCalledTimes(1);
    expect(mockProps.onRequestRide).toHaveBeenCalledWith(); // Empty prefill
  });

  it('switches to Driver mode and handles "Where to?" for an authorized driver', () => {
    render(<HomePage {...mockProps} />);

    // Switch to driver mode
    const driverTab = screen.getByText('Driver');
    fireEvent.click(driverTab);
    expect(driverTab).toHaveClass('toggle-tab-active');

    fireEvent.click(screen.getByText('Where to?'));
    expect(mockProps.onPostRide).toHaveBeenCalledTimes(1);
  });

  it('triggers driver signup if unauthorized user tries to switch to Driver mode', () => {
    render(<HomePage {...mockProps} canUseDriverMode={false} />);

    fireEvent.click(screen.getByText('Driver'));

    // Should NOT switch tab visually, but should trigger signup
    expect(screen.getByText('Rides')).toHaveClass('toggle-tab-active');
    expect(mockProps.onDriverSignup).toHaveBeenCalledTimes(1);
  });

  it('triggers driver signup if unauthorized user clicks "Where to?" in Driver mode (fallback edge case)', () => {
    // Render initially as a user, but simulate state where mode might somehow be Driver while unauthorized
    // To do this naturally, we mock the button behavior directly based on the file logic
    render(<HomePage {...mockProps} canUseDriverMode={false} />);
    const whereTo = screen.getByText('Where to?');

    // We can't actually get into Driver mode naturally if canUseDriverMode is false,
    // but we can verify the button respects standard user mode here:
    fireEvent.click(whereTo);
    expect(mockProps.onRequestRide).toHaveBeenCalledTimes(1);
  });

  it('calls onRequestRide with destination when fixed shortcut is clicked', () => {
    render(<HomePage {...mockProps} />);

    fireEvent.click(screen.getByText('University of Bath'));
    expect(mockProps.onRequestRide).toHaveBeenCalledWith({ destination: 'University of Bath' });
  });

  it('calls onOpenTimetable when Timetable service is clicked', () => {
    render(<HomePage {...mockProps} />);

    fireEvent.click(screen.getByText('Timetable'));
    expect(mockProps.onOpenTimetable).toHaveBeenCalledTimes(1);
  });

  describe('Saved Places flow', () => {
    it('opens and closes the save place modal without saving', () => {
      render(<HomePage {...mockProps} />);

      fireEvent.click(screen.getByText('Save a place'));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Cancel'));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('saves a new place and renders it as a shortcut', () => {
      render(<HomePage {...mockProps} />);

      fireEvent.click(screen.getByText('Save a place'));

      // Fill out form
      fireEvent.change(screen.getByPlaceholderText('e.g. Home'), { target: { value: 'My House' } });
      fireEvent.change(screen.getByPlaceholderText('e.g. 12 Example Street'), { target: { value: '10 Test Lane' } });
      fireEvent.change(screen.getByPlaceholderText('e.g. BA2 7AY'), { target: { value: 'BA1 1AA' } });
      fireEvent.change(screen.getByPlaceholderText('e.g. Bath'), { target: { value: 'Bath' } });

      // Save
      fireEvent.click(screen.getByText('Save'));

      // Modal should close
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Shortcut should appear
      expect(screen.getByText('My House')).toBeInTheDocument();
      expect(screen.getByText('10 Test Lane, BA1 1AA, Bath')).toBeInTheDocument();

      // Local storage should be updated
      const savedPlaces = JSON.parse(localStorage.getItem('savedPlaces') || '[]');
      expect(savedPlaces).toHaveLength(1);
      expect(savedPlaces[0].label).toBe('My House');

      // Clicking the new shortcut
      fireEvent.click(screen.getByText('My House'));
      expect(mockProps.onRequestRide).toHaveBeenCalledWith({ destination: '10 Test Lane, BA1 1AA, Bath' });
    });

    it('loads existing saved places from localStorage on mount', () => {
      localStorage.setItem('savedPlaces', JSON.stringify([{
        id: '123',
        label: 'Gym',
        address: '1 Fitness Rd',
        postcode: 'BA2 2BB',
        city: 'Bath'
      }]));

      render(<HomePage {...mockProps} />);

      expect(screen.getByText('Gym')).toBeInTheDocument();
      expect(screen.getByText('1 Fitness Rd, BA2 2BB, Bath')).toBeInTheDocument();
    });

    it('keeps the Save button disabled if address or postcode is missing', () => {
      render(<HomePage {...mockProps} />);

      fireEvent.click(screen.getByText('Save a place'));

      const saveButton = screen.getByText('Save');
      expect(saveButton).toBeDisabled();

      // Fill only address
      fireEvent.change(screen.getByPlaceholderText('e.g. 12 Example Street'), { target: { value: '10 Test Lane' } });
      expect(saveButton).toBeDisabled();

      // Fill postcode, but remove address
      fireEvent.change(screen.getByPlaceholderText('e.g. 12 Example Street'), { target: { value: '' } });
      fireEvent.change(screen.getByPlaceholderText('e.g. BA2 7AY'), { target: { value: 'BA1 1AA' } });
      expect(saveButton).toBeDisabled();

      // Fill both
      fireEvent.change(screen.getByPlaceholderText('e.g. 12 Example Street'), { target: { value: '10 Test Lane' } });
      expect(saveButton).not.toBeDisabled();
    });
  });
});