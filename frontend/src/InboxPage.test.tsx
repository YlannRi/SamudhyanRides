import { act, render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InboxPage from './InboxPage';
import { fetchNotifications, getNotifications, markReadByLink, subscribe } from './lib/notifications';

// Mock the notifications API module
vi.mock('./lib/notifications', () => ({
  fetchNotifications: vi.fn(),
  getNotifications: vi.fn(() => []),
  markReadByLink: vi.fn(),
  subscribe: vi.fn(() => vi.fn()),
}));

describe('InboxPage Component', () => {
  const mockProps = {
    onBack: vi.fn(),
    onNavigate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getNotifications).mockReturnValue([]);
    vi.mocked(subscribe).mockReturnValue(vi.fn());
  });

  it('renders the header and loading state initially', () => {
    // Keep it pending to check loading state
    vi.mocked(fetchNotifications).mockReturnValue(new Promise(() => {}));

    render(<InboxPage {...mockProps} />);

    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays empty state when there are no notifications', async () => {
    vi.mocked(fetchNotifications).mockResolvedValueOnce([]);

    render(<InboxPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('No notifications yet')).toBeInTheDocument();
      expect(screen.getByText("You'll see messages and ride updates here")).toBeInTheDocument();
    });
  });

  it('fetches and displays a list of notifications', async () => {
    const mockNotifications = [
      {
        id: '1',
        user_id: 'user-1',
        type: 'chat',
        title: 'New message from Alice',
        body: 'Are we still on for 5?',
        created_at: new Date().toISOString(),
        read: false,
        link: '/chat/123'
      },
      {
        id: '2',
        user_id: 'user-1',
        type: 'ride',
        title: 'Ride Confirmed',
        body: 'Your ride to campus is confirmed.',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        read: true,
        link: '/activity'
      }
    ];

    vi.mocked(fetchNotifications).mockResolvedValueOnce(mockNotifications);

    render(<InboxPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('New message from Alice')).toBeInTheDocument();
      expect(screen.getByText('Are we still on for 5?')).toBeInTheDocument();
      expect(screen.getByText('Ride Confirmed')).toBeInTheDocument();
    });
  });

  it('updates the inbox when the notification store subscription fires and supports booking/default types', async () => {
    let onStoreUpdate: (() => void) | undefined;

    vi.mocked(subscribe).mockImplementation((callback) => {
      onStoreUpdate = callback;
      return vi.fn();
    });
    vi.mocked(fetchNotifications).mockResolvedValueOnce([]);

    render(<InboxPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('No notifications yet')).toBeInTheDocument();
    });

    vi.mocked(getNotifications).mockReturnValue([
      {
        id: 'booking-1',
        user_id: 'user-1',
        type: 'booking',
        title: 'Booking received',
        body: 'A passenger requested your ride.',
        created_at: new Date().toISOString(),
        read: false,
        link: '/activity',
      },
      {
        id: 'misc-1',
        user_id: 'user-1',
        type: 'system',
        title: 'General update',
        body: 'Something changed in your account.',
        created_at: new Date().toISOString(),
        read: true,
        link: '/account',
      },
    ]);

    act(() => {
      onStoreUpdate?.();
    });

    await waitFor(() => {
      expect(screen.getByText('Booking received')).toBeInTheDocument();
      expect(screen.getByText('General update')).toBeInTheDocument();
    });
  });

  it('marks a notification as read and navigates when clicked', async () => {
    const mockNotifications = [
      {
        id: '1',
        user_id: 'user-1',
        type: 'chat',
        title: 'New message from Alice',
        body: 'Are we still on for 5?',
        created_at: new Date().toISOString(),
        read: false,
        link: '/chat/123'
      }
    ];

    vi.mocked(fetchNotifications).mockResolvedValueOnce(mockNotifications);
    vi.mocked(markReadByLink).mockResolvedValueOnce();

    render(<InboxPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('New message from Alice')).toBeInTheDocument();
    });

    const notificationButton = screen.getByRole('button', { name: /New message from Alice/i });
    fireEvent.click(notificationButton);

    await waitFor(() => {
      expect(markReadByLink).toHaveBeenCalledWith('/chat/123');
      expect(mockProps.onNavigate).toHaveBeenCalledWith('/chat/123');
    });
  });

  it('does not attempt to navigate or mark a notification as read when it has no link', async () => {
    vi.mocked(fetchNotifications).mockResolvedValueOnce([
      {
        id: '1',
        user_id: 'user-1',
        type: 'chat',
        title: 'Informational message',
        body: 'This message is not clickable.',
        created_at: new Date().toISOString(),
        read: false,
        link: null,
      },
    ]);

    render(<InboxPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Informational message')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Informational message/i }));

    expect(markReadByLink).not.toHaveBeenCalled();
    expect(mockProps.onNavigate).not.toHaveBeenCalled();
  });

  it('calls onBack when the back button is clicked', async () => {
    vi.mocked(fetchNotifications).mockResolvedValueOnce([]);

    render(<InboxPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('No notifications yet')).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: 'Back' });
    fireEvent.click(backButton);

    expect(mockProps.onBack).toHaveBeenCalledTimes(1);
  });
});
