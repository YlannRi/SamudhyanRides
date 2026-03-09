import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TimetablePage from './TimetablePage';
import { apiFetch } from './lib/api';

// Mock the API fetch utility
vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

describe('TimetablePage Component', () => {
  const mockOnBack = vi.fn();
  const mockOnSelectEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders correctly and shows the empty state initially', () => {
    render(<TimetablePage onBack={mockOnBack} onSelectEvent={mockOnSelectEvent} />);

    expect(screen.getByText('Timetable')).toBeInTheDocument();
    expect(screen.getByLabelText('University timetable iCal URL')).toBeInTheDocument();
    expect(screen.getByText('No events found')).toBeInTheDocument();
  });

  it('calls onBack when the back button is clicked', () => {
    render(<TimetablePage onBack={mockOnBack} onSelectEvent={mockOnSelectEvent} />);

    const backButton = screen.getByRole('button', { name: 'Back' });
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('loads the URL from localStorage on mount if available', () => {
    window.localStorage.setItem('timetableUrl', 'https://mytimetable.bath.ac.uk/ical?test');

    render(<TimetablePage onBack={mockOnBack} onSelectEvent={mockOnSelectEvent} />);

    const input = screen.getByLabelText('University timetable iCal URL');
    expect(input).toHaveValue('https://mytimetable.bath.ac.uk/ical?test');
  });

  it('shows an error if trying to load without a URL', async () => {
    render(<TimetablePage onBack={mockOnBack} onSelectEvent={mockOnSelectEvent} />);

    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    await waitFor(() => {
      expect(screen.getByText('Please paste your university timetable iCal URL.')).toBeInTheDocument();
      expect(apiFetch).not.toHaveBeenCalled();
    });
  });

  it('fetches events and renders them correctly', async () => {
    const mockEvents = [
      {
        uid: 'event-1',
        title: 'Software Engineering Lecture',
        location: 'CB 1.1',
        start: new Date('2026-10-10T10:00:00Z').toISOString(),
        end: new Date('2026-10-10T11:00:00Z').toISOString(),
      },
    ];

    vi.mocked(apiFetch).mockResolvedValueOnce(mockEvents);

    render(<TimetablePage onBack={mockOnBack} onSelectEvent={mockOnSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://test-url.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    expect(screen.getByRole('button', { name: 'Loading...' })).toBeInTheDocument();

    await waitFor(() => {
      // Check that the API was called with the correct default scope ("week")
      expect(apiFetch).toHaveBeenCalledWith('timetable/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://test-url.com', scope: 'week' }),
      });

      // Check if URL was saved to localStorage (since 'Remember URL' is default true)
      expect(window.localStorage.getItem('timetableUrl')).toBe('https://test-url.com');

      // Check if event is rendered
      expect(screen.getByText('Software Engineering Lecture')).toBeInTheDocument();
      expect(screen.getByText('CB 1.1')).toBeInTheDocument();
      expect(screen.queryByText('No events found')).not.toBeInTheDocument();
    });
  });

  it('handles empty array fallback when the API returns an unexpected non-array format', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({ unexpected: 'object' });

    render(<TimetablePage onBack={mockOnBack} onSelectEvent={mockOnSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://test-url.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    await waitFor(() => {
      expect(screen.getByText('No events found')).toBeInTheDocument();
    });
  });

  it('toggles the scope to "day" and correctly updates the API payload and button text', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    const { container } = render(<TimetablePage onBack={mockOnBack} onSelectEvent={mockOnSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://test-url.com' },
    });

    // Find the Day checkbox by finding the label text and getting its sibling input
    const dayCheckbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    fireEvent.click(dayCheckbox);

    expect(screen.getByRole('button', { name: 'Load today' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Load today' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('timetable/events', expect.objectContaining({
        body: expect.stringContaining('"scope":"day"'),
      }));
    });
  });

  it('respects the "Remember URL" checkbox toggle', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    render(<TimetablePage onBack={mockOnBack} onSelectEvent={mockOnSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://do-not-remember.com' },
    });

    const rememberCheckbox = screen.getByLabelText('Remember URL') as HTMLInputElement;

    // Uncheck "Remember URL"
    fireEvent.click(rememberCheckbox);
    expect(rememberCheckbox.checked).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    await waitFor(() => {
      // LocalStorage should NOT be populated
      expect(window.localStorage.getItem('timetableUrl')).toBeNull();
    });
  });

  it('shows an error message when the API fetch fails with an Error object', async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Failed to parse iCal'));

    render(<TimetablePage onBack={mockOnBack} onSelectEvent={mockOnSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://test-url.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to parse iCal')).toBeInTheDocument();
    });
  });

  it('shows a string error message when the API fetch fails with a string (fallback branch)', async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce('Network error string');

    render(<TimetablePage onBack={mockOnBack} onSelectEvent={mockOnSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://test-url.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    await waitFor(() => {
      expect(screen.getByText('Network error string')).toBeInTheDocument();
    });
  });

  it('calculates the arrival time correctly (15 minutes prior) and calls onSelectEvent', async () => {
    // We use a specific local date to avoid timezone issues affecting the padding functions.
    const mockStartDate = new Date(2026, 9, 10, 10, 30); // Local time: 10:30 AM
    const mockEvents = [
      {
        uid: 'event-1',
        title: 'Math Lecture',
        start: mockStartDate.toISOString(),
        end: new Date(2026, 9, 10, 11, 30).toISOString(),
      },
    ];

    vi.mocked(apiFetch).mockResolvedValueOnce(mockEvents);

    render(<TimetablePage onBack={mockOnBack} onSelectEvent={mockOnSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://test-url.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    await waitFor(() => {
      expect(screen.getByText('Math Lecture')).toBeInTheDocument();
    });

    // Click the event to select it
    fireEvent.click(screen.getByText('Math Lecture'));

    // Expected datetime is 15 minutes before 10:30 AM -> 10:15 AM
    const expectedYear = mockStartDate.getFullYear();
    const expectedMonth = String(mockStartDate.getMonth() + 1).padStart(2, '0');
    const expectedDate = String(mockStartDate.getDate()).padStart(2, '0');
    const expectedHours = '10'; // 10 AM
    const expectedMinutes = '15'; // 30 - 15 = 15
    const expectedDatetimeLocal = `${expectedYear}-${expectedMonth}-${expectedDate}T${expectedHours}:${expectedMinutes}`;

    expect(mockOnSelectEvent).toHaveBeenCalledWith({
      destination: 'University of Bath',
      arrivalDateTimeLocal: expectedDatetimeLocal,
    });
  });
});