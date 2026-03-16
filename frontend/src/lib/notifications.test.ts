import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getUnreadCount,
  getNotifications,
  subscribe,
  fetchUnreadCount,
  fetchNotifications,
  markAllRead,
  markReadByLink,
  startPolling,
  stopPolling,
  resetNotifications,
} from './notifications';
import { apiFetch } from './api';

// Mock the API fetch module using Vitest's vi.mock
vi.mock('./api', () => ({
  apiFetch: vi.fn(),
}));

describe('notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    resetNotifications();
  });

  afterEach(() => {
    stopPolling();
    vi.useRealTimers();
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
      { id: '1', read: false, link: '/link1' },
      { id: '2', read: true, link: '/link2' }
    ];
    vi.mocked(apiFetch).mockResolvedValueOnce(mockNotifications);

    const listener = vi.fn();
    subscribe(listener);

    const notifications = await fetchNotifications();

    expect(apiFetch).toHaveBeenCalledWith('notifications/', { method: 'GET' });
    expect(notifications).toEqual(mockNotifications);
    expect(getNotifications()).toEqual(mockNotifications);
    expect(getUnreadCount()).toBe(1);
    expect(listener).toHaveBeenCalled();
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
      { id: '1', read: false, link: '/link1' },
      { id: '2', read: false, link: '/link2' }
    ]);
    await fetchNotifications();

    vi.mocked(apiFetch).mockResolvedValueOnce({});

    await markReadByLink('/link1');

    expect(apiFetch).toHaveBeenCalledWith('notifications/read-by-link?link=%2Flink1', { method: 'PUT' });
    expect(getUnreadCount()).toBe(1);
    expect(getNotifications().find(n => n.id === '1')?.read).toBe(true);
    expect(getNotifications().find(n => n.id === '2')?.read).toBe(false);
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
});
