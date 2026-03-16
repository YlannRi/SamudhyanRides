import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TimetablePage from './TimetablePage';
import { apiFetch } from './lib/api';

vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

describe('TimetablePage', () => {
  const onBack = vi.fn();
  const onSelectEvent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the current empty state', () => {
    render(<TimetablePage onBack={onBack} onSelectEvent={onSelectEvent} />);

    expect(screen.getByText('Timetable')).toBeInTheDocument();
    expect(screen.getByLabelText('University timetable iCal URL')).toBeInTheDocument();
    expect(screen.getByText('No events found')).toBeInTheDocument();
  });

  it('calls onBack when the back button is clicked', () => {
    render(<TimetablePage onBack={onBack} onSelectEvent={onSelectEvent} />);

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('loads a remembered timetable URL from local storage', () => {
    window.localStorage.setItem('timetableUrl', 'https://mytimetable.bath.ac.uk/ical?test');

    render(<TimetablePage onBack={onBack} onSelectEvent={onSelectEvent} />);

    expect(screen.getByLabelText('University timetable iCal URL')).toHaveValue(
      'https://mytimetable.bath.ac.uk/ical?test',
    );
  });

  it('loads the saved calendar link from the account profile when available', async () => {
    window.localStorage.setItem('authToken', 'fake-token');
    vi.mocked(apiFetch).mockResolvedValueOnce([{ calendar_link: 'https://bath.ac.uk/account-feed.ics' }]);

    render(<TimetablePage onBack={onBack} onSelectEvent={onSelectEvent} />);

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('users/me', { method: 'GET' });
      expect(screen.getByLabelText('University timetable iCal URL')).toHaveValue(
        'https://bath.ac.uk/account-feed.ics',
      );
    });
  });

  it('persists the remembered timetable URL to the account profile after debounce', async () => {
    window.localStorage.setItem('authToken', 'fake-token');
    vi.mocked(apiFetch)
      .mockResolvedValueOnce([{ calendar_link: null }])
      .mockResolvedValueOnce({ calendar_link: 'https://bath.ac.uk/device-sync.ics' });

    render(<TimetablePage onBack={onBack} onSelectEvent={onSelectEvent} />);

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('users/me', { method: 'GET' });
    });

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://bath.ac.uk/device-sync.ics' },
    });

    await waitFor(
      () => {
        expect(apiFetch).toHaveBeenCalledWith('users/me/preferences', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ calendar_link: 'https://bath.ac.uk/device-sync.ics' }),
        });
      },
      { timeout: 1500 },
    );
  });

  it('shows an error when loading without a URL', async () => {
    render(<TimetablePage onBack={onBack} onSelectEvent={onSelectEvent} />);

    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    await waitFor(() => {
      expect(screen.getByText('Please paste your university timetable iCal URL.')).toBeInTheDocument();
      expect(apiFetch).not.toHaveBeenCalled();
    });
  });

  it('loads events and renders them', async () => {
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

    render(<TimetablePage onBack={onBack} onSelectEvent={onSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://test-url.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('timetable/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: 'https://test-url.com', scope: 'week' }),
      });
      expect(window.localStorage.getItem('timetableUrl')).toBe('https://test-url.com');
      expect(screen.getByText('Software Engineering Lecture')).toBeInTheDocument();
      expect(screen.getByText('CB 1.1')).toBeInTheDocument();
    });
  });

  it('falls back to an empty event list for unexpected response shapes', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({ unexpected: 'object' });

    render(<TimetablePage onBack={onBack} onSelectEvent={onSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://test-url.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    await waitFor(() => {
      expect(screen.getByText('No events found')).toBeInTheDocument();
    });
  });

  it('switches to day scope and updates the load payload', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    render(<TimetablePage onBack={onBack} onSelectEvent={onSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://test-url.com' },
    });

    fireEvent.click(screen.getByRole('checkbox', { name: 'Day' }));
    expect(screen.getByRole('button', { name: 'Load today' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Load today' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('timetable/events', expect.objectContaining({
        body: JSON.stringify({ url: 'https://test-url.com', scope: 'day' }),
      }));
    });
  });

  it('stops remembering the URL when the checkbox is turned off', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    render(<TimetablePage onBack={onBack} onSelectEvent={onSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://do-not-remember.com' },
    });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Remember URL' }));
    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    await waitFor(() => {
      expect(window.localStorage.getItem('timetableUrl')).toBeNull();
    });
  });

  it('renders Error object messages from failed event loads', async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Failed to parse iCal'));

    render(<TimetablePage onBack={onBack} onSelectEvent={onSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://test-url.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to parse iCal')).toBeInTheDocument();
    });
  });

  it('renders string failures from failed event loads', async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce('Network error string');

    render(<TimetablePage onBack={onBack} onSelectEvent={onSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://test-url.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    await waitFor(() => {
      expect(screen.getByText('Network error string')).toBeInTheDocument();
    });
  });

  it('selects an event and sends a ride prefill fifteen minutes before start', async () => {
    const mockStartDate = new Date(2026, 9, 10, 10, 30);
    vi.mocked(apiFetch).mockResolvedValueOnce([
      {
        uid: 'event-1',
        title: 'Math Lecture',
        start: mockStartDate.toISOString(),
        end: new Date(2026, 9, 10, 11, 30).toISOString(),
      },
    ]);

    render(<TimetablePage onBack={onBack} onSelectEvent={onSelectEvent} />);

    fireEvent.change(screen.getByLabelText('University timetable iCal URL'), {
      target: { value: 'https://test-url.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Load this week' }));

    await waitFor(() => {
      expect(screen.getByText('Math Lecture')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Math Lecture'));

    expect(onSelectEvent).toHaveBeenCalledWith({
      destination: 'University of Bath',
      arrivalDateTimeLocal: '2026-10-10T10:15',
    });
  });
});
