import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getUnreadCount,
  getNotifications,
  subscribe,
  subscribeToIncomingNotifications,
  fetchUnreadCount,
  fetchNotifications,
  markAllRead,
  markReadByLink,
  startPolling,
  startRealtimeNotifications,
  stopRealtimeNotifications,
  stopPolling,
  resetNotifications,
  type Notification,
} from './notifications';
import { apiFetch, buildWebSocketUrl } from './api';

// Mock the API fetch module using Vitest's vi.mock
vi.mock('./api', () => ({
  apiFetch: vi.fn(),
  buildWebSocketUrl: vi.fn((path: string) => `wss://samudhyanrides.test${path}`),
}));

const originalWebSocket = globalThis.WebSocket;

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  static instances: MockWebSocket[] = [];

  readyState = MockWebSocket.CONNECTING;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;
  readonly url: string;
  close = vi.fn(() => {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.();
  });

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  emitOpen() {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.();
  }

  emitMessage(payload: Notification | string) {
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    this.onmessage?.({ data });
  }

  emitClose() {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.();
  }
}

function makeNotification(overrides: Partial<Notification> = {}): Notification {
  return {
    id: 'notification-1',
    user_id: 'user-1',
    type: 'chat',
    title: 'New message',
    body: 'Hello there',
    created_at: '2026-03-16T10:00:00.000Z',
    read: false,
    link: '/chat/ride-123',
    ...overrides,
  };
}

describe('notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    resetNotifications();
    MockWebSocket.instances = [];
    vi.stubGlobal('WebSocket', MockWebSocket);
  });

  afterEach(() => {
    stopRealtimeNotifications();
    stopPolling();
    vi.useRealTimers();
    if (originalWebSocket) {
      vi.stubGlobal('WebSocket', originalWebSocket);
    } else {
      vi.unstubAllGlobals();
    }
  });

  it('should fetch unread count and notify listeners', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({ unread_count: 5 });

    const listener = vi.fn();
    subscribe(listener);

    const count = await fetchUnreadCount();

    expect(apiFetch).toHaveBeenCalledWith('notifications/unread-count', { method: 'GET' });
    expect(count).toBe(5);
    expect(getUnreadCount()).toBe(5);
    expect(listener).toHaveBeenCalled();
  });

  it('should fetch notifications, calculate unread count, and notify listeners', async () => {
    const mockNotifications = [
      makeNotification({ id: 'older', created_at: '2026-03-15T10:00:00.000Z', link: '/link1' }),
      makeNotification({ id: 'newer', created_at: '2026-03-16T10:00:00.000Z', read: true, link: '/link2' }),
    ];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockNotifications);

    const listener = vi.fn();
    subscribe(listener);

    const notifications = await fetchNotifications();

    expect(apiFetch).toHaveBeenCalledWith('notifications/', { method: 'GET' });
    expect(notifications.map((notification) => notification.id)).toEqual(['newer', 'older']);
    expect(getNotifications().map((notification) => notification.id)).toEqual(['newer', 'older']);
    expect(getUnreadCount()).toBe(1);
    expect(listener).toHaveBeenCalled();
  });

  it('should return cached values when fetching unread counts or notifications fails', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({ unread_count: 2 });
    await fetchUnreadCount();

    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('offline'));
    await expect(fetchUnreadCount()).resolves.toBe(2);

    vi.mocked(apiFetch).mockResolvedValueOnce([
      makeNotification({ id: 'cached', link: '/cached' }),
    ]);
    await fetchNotifications();

    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('offline'));
    await expect(fetchNotifications()).resolves.toEqual([
      makeNotification({ id: 'cached', link: '/cached' }),
    ]);
  });

  it('should mark all as read', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([
      { id: '1', read: false, link: '/link1' }
    ]);
    await fetchNotifications();

    vi.mocked(apiFetch).mockResolvedValueOnce({});

    await markAllRead();

    expect(apiFetch).toHaveBeenCalledWith('notifications/read-all', { method: 'PUT' });
    expect(getUnreadCount()).toBe(0);
    expect(getNotifications()[0].read).toBe(true);
  });

  it('should mark a specific notification as read by link', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([
      makeNotification({ id: '1', link: '/link1' }),
      makeNotification({ id: '2', link: '/link2' }),
    ]);
    await fetchNotifications();

    vi.mocked(apiFetch).mockResolvedValueOnce({});

    await markReadByLink('/link1');

    expect(apiFetch).toHaveBeenCalledWith('notifications/read-by-link?link=%2Flink1', { method: 'PUT' });
    expect(getUnreadCount()).toBe(1);
    expect(getNotifications().find(n => n.id === '1')?.read).toBe(true);
    expect(getNotifications().find(n => n.id === '2')?.read).toBe(false);
  });

  it('should keep local read state changes even if markReadByLink fails remotely', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([
      makeNotification({ id: '1', link: '/ride/1' }),
      makeNotification({ id: '2', link: '/ride/2' }),
    ]);
    await fetchNotifications();

    const listener = vi.fn();
    subscribe(listener);
    listener.mockClear();

    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('offline'));
    await markReadByLink('/ride/1');

    expect(getUnreadCount()).toBe(1);
    expect(getNotifications().find((notification) => notification.id === '1')?.read).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);

    listener.mockClear();
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('offline'));
    await markReadByLink('/missing');
    expect(listener).not.toHaveBeenCalled();
  });

  it('should start and stop polling correctly', () => {
    vi.mocked(apiFetch).mockResolvedValue({ unread_count: 2 });

    startPolling(5000);

    expect(apiFetch).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(5000);
    expect(apiFetch).toHaveBeenCalledTimes(2);

    stopPolling();

    vi.advanceTimersByTime(5000);
    expect(apiFetch).toHaveBeenCalledTimes(2);
  });

  it('should allow unsubscribing listeners', async () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    unsubscribe();

    vi.mocked(apiFetch).mockResolvedValueOnce({ unread_count: 3 });
    await fetchUnreadCount();

    expect(listener).not.toHaveBeenCalled();
  });

  it('should start realtime notifications, emit incoming notifications, and allow unsubscribing incoming listeners', () => {
    const storeListener = vi.fn();
    const incomingListener = vi.fn();
    const unsubscribeIncoming = subscribeToIncomingNotifications(incomingListener);
    subscribe(storeListener);

    startRealtimeNotifications('token-123');

    expect(buildWebSocketUrl).toHaveBeenCalledWith('/notifications/ws?token=token-123');
    expect(MockWebSocket.instances).toHaveLength(1);

    const socket = MockWebSocket.instances[0];
    socket.emitOpen();
    socket.emitMessage(makeNotification({ id: 'older', created_at: '2026-03-15T10:00:00.000Z' }));
    socket.emitMessage(makeNotification({ id: 'newer', created_at: '2026-03-16T10:00:00.000Z' }));
    socket.emitMessage('not-json');

    expect(getNotifications().map((notification) => notification.id)).toEqual(['newer', 'older']);
    expect(getUnreadCount()).toBe(2);
    expect(incomingListener).toHaveBeenCalledTimes(2);
    expect(storeListener).toHaveBeenCalled();

    unsubscribeIncoming();
    socket.emitMessage(makeNotification({ id: 'latest', created_at: '2026-03-17T10:00:00.000Z' }));
    expect(getNotifications().map((notification) => notification.id)).toEqual(['latest', 'newer', 'older']);
    expect(incomingListener).toHaveBeenCalledTimes(2);
  });

  it('should reuse an active socket for the same token and reconnect with backoff after close', () => {
    startRealtimeNotifications('token-123');
    expect(MockWebSocket.instances).toHaveLength(1);

    startRealtimeNotifications('token-123');
    expect(MockWebSocket.instances).toHaveLength(1);

    const socket = MockWebSocket.instances[0];
    socket.emitOpen();

    startRealtimeNotifications('token-123');
    expect(MockWebSocket.instances).toHaveLength(1);

    socket.emitClose();
    vi.advanceTimersByTime(999);
    expect(MockWebSocket.instances).toHaveLength(1);

    vi.advanceTimersByTime(1);
    expect(MockWebSocket.instances).toHaveLength(2);

    MockWebSocket.instances[1].emitClose();
    vi.advanceTimersByTime(1999);
    expect(MockWebSocket.instances).toHaveLength(2);

    vi.advanceTimersByTime(1);
    expect(MockWebSocket.instances).toHaveLength(3);
  });

  it('should stop realtime notifications, close the current socket, and clear pending reconnects', () => {
    startRealtimeNotifications('first-token');
    const firstSocket = MockWebSocket.instances[0];
    firstSocket.emitOpen();

    startRealtimeNotifications('second-token');
    expect(firstSocket.close).toHaveBeenCalledTimes(1);
    expect(MockWebSocket.instances).toHaveLength(2);

    const secondSocket = MockWebSocket.instances[1];
    secondSocket.emitClose();

    stopRealtimeNotifications();
    vi.advanceTimersByTime(5000);

    expect(MockWebSocket.instances).toHaveLength(2);
  });

  it('should no-op when realtime notifications start without a token or without websocket support', () => {
    startRealtimeNotifications('');
    expect(MockWebSocket.instances).toHaveLength(0);

    vi.unstubAllGlobals();
    startRealtimeNotifications('token-123');
    expect(MockWebSocket.instances).toHaveLength(0);
  });
});
