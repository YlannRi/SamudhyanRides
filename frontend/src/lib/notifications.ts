import { apiFetch } from './api';

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  created_at: string;
  read: boolean;
  link: string | null;
};

type Listener = () => void;

let _unreadCount = 0;
let _notifications: Notification[] = [];
let _listeners: Listener[] = [];
let _pollTimer: ReturnType<typeof setInterval> | null = null;

function notify() {
  _listeners.forEach((fn) => fn());
}

export function getUnreadCount(): number {
  return _unreadCount;
}

export function getNotifications(): Notification[] {
  return _notifications;
}

export function subscribe(fn: Listener): () => void {
  _listeners.push(fn);
  return () => {
    _listeners = _listeners.filter((l) => l !== fn);
  };
}

export async function fetchUnreadCount(): Promise<number> {
  try {
    const res = await apiFetch<{ unread_count: number }>('notifications/unread-count', { method: 'GET' });
    _unreadCount = res.unread_count;
    notify();
    return _unreadCount;
  } catch {
    return _unreadCount;
  }
}

export async function fetchNotifications(): Promise<Notification[]> {
  try {
    const res = await apiFetch<Notification[]>('notifications/', { method: 'GET' });
    _notifications = res || [];
    _unreadCount = _notifications.filter((n) => !n.read).length;
    notify();
    return _notifications;
  } catch {
    return _notifications;
  }
}

export async function markAllRead(): Promise<void> {
  try {
    await apiFetch('notifications/read-all', { method: 'PUT' });
    _notifications = _notifications.map((n) => ({ ...n, read: true }));
    _unreadCount = 0;
    notify();
  } catch {
    // ignore
  }
}

export async function markReadByLink(link: string): Promise<void> {
  try {
    await apiFetch('notifications/read-by-link?link=' + encodeURIComponent(link), { method: 'PUT' });
    _notifications = _notifications.map((n) => (n.link === link ? { ...n, read: true } : n));
    _unreadCount = _notifications.filter((n) => !n.read).length;
    notify();
  } catch {
    // ignore
  }
}

export function startPolling(intervalMs = 10000): void {
  stopPolling();
  fetchUnreadCount();
  _pollTimer = setInterval(fetchUnreadCount, intervalMs);
}

export function stopPolling(): void {
  if (_pollTimer) {
    clearInterval(_pollTimer);
    _pollTimer = null;
  }
}
