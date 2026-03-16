import { act, render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ChatPage from './ChatPage';
import { apiFetch, buildWebSocketUrl } from './lib/api';
import { getAuthToken } from './lib/authToken';

// Mock the API and Auth modules
vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
  buildWebSocketUrl: vi.fn((path: string) => `ws://localhost${path}`),
}));

vi.mock('./lib/authToken', () => ({
  getAuthToken: vi.fn(),
}));

describe('ChatPage Component', () => {
  const mockProps = {
    rideId: '101',
    participantId: '202',
    onBack: vi.fn(),
  };

  let mockWsInstance: any;
  const originalWebSocket = global.WebSocket;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock element.scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = vi.fn();

    // Mock getAuthToken
    vi.mocked(getAuthToken).mockReturnValue('mock-jwt-token');

    // Create a centralized object to track mock interactions and state
    mockWsInstance = {
      send: vi.fn(),
      close: vi.fn(),
      readyState: 1, // 1 = OPEN
      onmessage: null,
      onerror: null,
      onclose: null,
    };

    // Construct a mock class that can be safely instantiated with `new`
    global.WebSocket = class {
      static OPEN = 1;
      static CLOSED = 3;
      url: string;

      constructor(url: string) {
        this.url = url;
      }

      send(data: any) { mockWsInstance.send(data); }
      close() { mockWsInstance.close(); }

      get readyState() { return mockWsInstance.readyState; }

      set onmessage(cb: any) { mockWsInstance.onmessage = cb; }
      get onmessage() { return mockWsInstance.onmessage; }

      set onerror(cb: any) { mockWsInstance.onerror = cb; }
      get onerror() { return mockWsInstance.onerror; }

      set onclose(cb: any) { mockWsInstance.onclose = cb; }
      get onclose() { return mockWsInstance.onclose; }
    } as any;
  });

  afterEach(() => {
    global.WebSocket = originalWebSocket;
  });

  it('fetches current user, chat history, and marks notifications as read on mount', async () => {
    vi.mocked(apiFetch).mockImplementation(async (url) => {
      if (url === 'users/me') return [{ id: 'user_1' }];
      if (url.includes('chat?participant_id=')) return [
        { id: 'msg_1', sender_id: 'user_2', sender_name: 'Bob', message: 'Hello!', created_at: new Date().toISOString() }
      ];
      if (url.includes('read-by-link')) return {};
      return null;
    });

    render(<ChatPage {...mockProps} />);

    expect(screen.getByText('Loading messages...')).toBeInTheDocument();

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('users/me', expect.any(Object));
      expect(apiFetch).toHaveBeenCalledWith('rides/101/chat?participant_id=202', expect.any(Object));
      expect(apiFetch).toHaveBeenCalledWith(expect.stringContaining('notifications/read-by-link'), expect.any(Object));
      expect(buildWebSocketUrl).toHaveBeenCalledWith(
        '/rides/ws/rides/101?token=mock-jwt-token&participant_id=202',
      );

      expect(screen.getByText('Hello!')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  it('displays empty state when there are no messages', async () => {
    vi.mocked(apiFetch).mockImplementation(async (url) => {
      if (url.includes('chat')) return []; // Empty chat history
      return [];
    });

    render(<ChatPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('No messages yet. Say hello!')).toBeInTheDocument();
    });
  });

  it('falls back to an empty chat when history loading fails and restores unsent input after a REST error', async () => {
    vi.mocked(getAuthToken).mockReturnValue(null);
    vi.mocked(apiFetch).mockImplementation(async (url) => {
      if (url === 'users/me') return [];
      if (url === 'rides/101/chat') throw new Error('No chat yet');
      if (url === 'rides/101/chat/message') throw new Error('Send failed');
      if (url.includes('read-by-link')) return {};
      return [];
    });

    render(<ChatPage rideId="101" onBack={mockProps.onBack} />);

    await waitFor(() => {
      expect(screen.getByText('No messages yet. Say hello!')).toBeInTheDocument();
    });

    expect(buildWebSocketUrl).not.toHaveBeenCalled();

    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Retry me' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        'rides/101/chat/message',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ message: 'Retry me' }),
        }),
      );
      expect(input).toHaveValue('Retry me');
    });
  });

  it('sends a message via WebSocket when connected', async () => {
    vi.mocked(apiFetch).mockResolvedValue([]);

    render(<ChatPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByRole('button', { name: 'Send message' });

    fireEvent.change(input, { target: { value: 'Hey there!' } });
    fireEvent.click(sendButton);

    expect(mockWsInstance.send).toHaveBeenCalledWith(JSON.stringify({ message: 'Hey there!' }));
    expect(input).toHaveValue(''); // Input is cleared
  });

  it('falls back to REST API to send a message if WebSocket is not open', async () => {
    vi.mocked(apiFetch).mockImplementation(async (url) => {
      if (url.includes('chat/message')) {
        return { id: 'msg_2', sender_id: 'user_1', message: 'Fallback msg', created_at: new Date().toISOString() };
      }
      return [];
    });

    mockWsInstance.readyState = 3; // 3 = CLOSED

    render(<ChatPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(input, { target: { value: 'Fallback msg' } });

    // Trigger via Enter key to cover `handleKeyDown`
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: false });

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        'rides/101/chat/message?participant_id=202',
        expect.objectContaining({ method: 'POST', body: JSON.stringify({ message: 'Fallback msg' }) })
      );
      expect(screen.getByText('Fallback msg')).toBeInTheDocument();
    });
  });

  it('receives messages via WebSocket and updates UI', async () => {
    vi.mocked(apiFetch).mockResolvedValue([]);
    render(<ChatPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
    });

    // Simulate incoming WS message
    const incomingMessage = {
      id: 'ws_msg_1',
      sender_id: 'user_2',
      sender_name: 'Alice',
      message: 'Incoming WS Message',
      created_at: new Date().toISOString(),
    };

    // Trigger the callback that the component bound to our mock
    act(() => {
      mockWsInstance.onmessage({ data: JSON.stringify(incomingMessage) });
    });

    await waitFor(() => {
      expect(screen.getByText('Incoming WS Message')).toBeInTheDocument();
      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });

  it('ignores duplicate and invalid WebSocket payloads', async () => {
    vi.mocked(apiFetch).mockResolvedValue([]);
    render(<ChatPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
    });

    const incomingMessage = {
      id: 'ws_msg_duplicate',
      sender_id: 'user_2',
      sender_name: 'Alice',
      message: 'Only once',
      created_at: new Date().toISOString(),
    };

    act(() => {
      mockWsInstance.onmessage({ data: JSON.stringify(incomingMessage) });
      mockWsInstance.onmessage({ data: JSON.stringify(incomingMessage) });
      mockWsInstance.onmessage({ data: '{bad json' });
    });

    await waitFor(() => {
      expect(screen.getAllByText('Only once')).toHaveLength(1);
    });
  });

  it('calls onBack when the back button is clicked', async () => {
    vi.mocked(apiFetch).mockResolvedValue([]);
    render(<ChatPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: 'Back' });
    fireEvent.click(backButton);

    expect(mockProps.onBack).toHaveBeenCalledTimes(1);
  });
});
