import { apiFetch, buildWebSocketUrl } from './api';

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
type IncomingNotificationListener = (notification: Notification) => void;

let _unreadCount = 0;
let _notifications: Notification[] = [];
let _listeners: Listener[] = [];
let _pollTimer: ReturnType<typeof setInterval> | null = null;
let _incomingNotificationListeners: IncomingNotificationListener[] = [];
let _notificationSocket: WebSocket | null = null;
let _notificationSocketToken: string | null = null;
let _notificationReconnectTimer: ReturnType<typeof setTimeout> | null = null;
let _notificationReconnectAttempt = 0;
let _shouldReconnectNotificationSocket = false;

function notify() {
  _listeners.forEach((fn) => fn());
}

function emitIncomingNotification(notification: Notification) {
  _incomingNotificationListeners.forEach((fn) => fn(notification));
}

function recomputeUnreadCount() {
  _unreadCount = _notifications.filter((n) => !n.read).length;
}

function sortNotifications(notifications: Notification[]) {
  return [...notifications].sort((left, right) => {
    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
  });
}

function upsertNotification(notification: Notification) {
  const existingIndex = _notifications.findIndex((item) => item.id === notification.id);

  if (existingIndex >= 0) {
    const next = [..._notifications];
    next[existingIndex] = notification;
    _notifications = sortNotifications(next);
  } else {
    _notifications = sortNotifications([notification, ..._notifications]).slice(0, 100);
  }

  recomputeUnreadCount();
  notify();
}

function markNotificationsReadByLinkLocally(link: string) {
  let changed = false;

  _notifications = _notifications.map((notification) => {
    if (notification.link !== link || notification.read) {
      return notification;
    }

    changed = true;
    return {
      ...notification,
      read: true,
    };
  });

  if (changed) {
    recomputeUnreadCount();
    notify();
  }
}

function clearNotificationReconnectTimer() {
  if (_notificationReconnectTimer) {
    clearTimeout(_notificationReconnectTimer);
    _notificationReconnectTimer = null;
  }
}

function scheduleNotificationReconnect() {
  if (!_shouldReconnectNotificationSocket || !_notificationSocketToken || _notificationReconnectTimer) {
    return;
  }

  const delayMs = Math.min(5000, 1000 * 2 ** _notificationReconnectAttempt);
  _notificationReconnectAttempt += 1;

  _notificationReconnectTimer = setTimeout(() => {
    _notificationReconnectTimer = null;
    connectNotificationSocket();
  }, delayMs);
}

function connectNotificationSocket() {
  if (typeof WebSocket === 'undefined' || !_notificationSocketToken) {
    return;
  }

  clearNotificationReconnectTimer();

  const socket = new WebSocket(
    buildWebSocketUrl(`/notifications/ws?token=${encodeURIComponent(_notificationSocketToken)}`),
  );

  _notificationSocket = socket;

  socket.onopen = () => {
    _notificationReconnectAttempt = 0;
  };

  socket.onmessage = (event) => {
    try {
      const notification = JSON.parse(event.data) as Notification;
      upsertNotification(notification);
      emitIncomingNotification(notification);
    } catch {
      // ignore malformed payloads
    }
  };

  socket.onerror = () => {};

  socket.onclose = () => {
    if (_notificationSocket === socket) {
      _notificationSocket = null;
    }

    if (_shouldReconnectNotificationSocket) {
      scheduleNotificationReconnect();
    }
  };
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

export function subscribeToIncomingNotifications(fn: IncomingNotificationListener): () => void {
  _incomingNotificationListeners.push(fn);
  return () => {
    _incomingNotificationListeners = _incomingNotificationListeners.filter((listener) => listener !== fn);
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
    _notifications = sortNotifications(res || []);
    recomputeUnreadCount();
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
  markNotificationsReadByLinkLocally(link);

  try {
    await apiFetch('notifications/read-by-link?link=' + encodeURIComponent(link), { method: 'PUT' });
  } catch {
    // ignore
  }
}

export function startPolling(intervalMs = 10000): void {
  stopPolling();
  void fetchUnreadCount();
  _pollTimer = setInterval(() => {
    void fetchUnreadCount();
  }, intervalMs);
}

export function stopPolling(): void {
  if (_pollTimer) {
    clearInterval(_pollTimer);
    _pollTimer = null;
  }
}

export function startRealtimeNotifications(token: string): void {
  if (!token || typeof WebSocket === 'undefined') {
    return;
  }

  const socketState = _notificationSocket?.readyState;
  if (
    _notificationSocketToken === token &&
    (socketState === WebSocket.OPEN || socketState === WebSocket.CONNECTING)
  ) {
    return;
  }

  stopRealtimeNotifications();
  _notificationSocketToken = token;
  _shouldReconnectNotificationSocket = true;
  connectNotificationSocket();
}

export function stopRealtimeNotifications(): void {
  _shouldReconnectNotificationSocket = false;
  _notificationReconnectAttempt = 0;
  clearNotificationReconnectTimer();
  _notificationSocketToken = null;

  if (_notificationSocket) {
    const socket = _notificationSocket;
    _notificationSocket = null;
    socket.close();
  }
}

export function resetNotifications(): void {
  stopPolling();
  stopRealtimeNotifications();
  _notifications = [];
  _unreadCount = 0;
  notify();
}
