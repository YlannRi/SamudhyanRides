import { render, screen, waitFor, fireEvent } from '@testing-library/react';
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
        type: 'chat',
        title: 'New message from Alice',
        body: 'Are we still on for 5?',
        created_at: new Date().toISOString(),
        read: false,
        link: '/chat/123'
      },
      {
        id: '2',
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

  it('marks a notification as read and navigates when clicked', async () => {
    const mockNotifications = [
      {
        id: '1',
        type: 'chat',
        title: 'New message from Alice',
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
