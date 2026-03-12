import React, { useEffect, useRef, useState } from 'react';
import { apiFetch } from './lib/api';
import { getAuthToken } from './lib/authToken';
import { Icons } from './App';

type ChatMessage = {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
  read: boolean;
};

type ChatPageProps = {
  rideId: string;
  participantId?: string;
  onBack: () => void;
};

const ChatPage: React.FC<ChatPageProps> = ({ rideId, participantId, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const chatQuery = participantId ? `?participant_id=${encodeURIComponent(participantId)}` : '';
  const chatLink = participantId ? `/chat/${rideId}?participant=${encodeURIComponent(participantId)}` : `/chat/${rideId}`;

  // Resolve current user's profile_id
  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch<any>('users/me', { method: 'GET' });
        if (data && data.length > 0) {
          setCurrentUserId(data[0].id);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  // Fetch message history
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const history = await apiFetch<ChatMessage[]>(`rides/${rideId}/chat${chatQuery}`, { method: 'GET' });
        setMessages(history || []);
      } catch {
        // no chat yet
        setMessages([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [rideId, chatQuery]);

  // Mark notifications for this chat as read
  useEffect(() => {
    apiFetch('notifications/read-by-link?link=' + encodeURIComponent(chatLink), {
      method: 'PUT',
    }).catch(() => {});
  }, [chatLink]);

  // WebSocket connection
  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const rawBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
    const httpBase = (rawBase ?? '').replace(/\/+$/, '');
    const wsBase = httpBase.replace(/^http/, 'ws');
    const participantQuery = participantId ? `&participant_id=${encodeURIComponent(participantId)}` : '';
    const wsUrl = `${wsBase}/rides/ws/rides/${rideId}?token=${encodeURIComponent(token)}${participantQuery}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg: ChatMessage = JSON.parse(event.data);
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      } catch {
        // ignore
      }
    };

    ws.onerror = () => {};
    ws.onclose = () => {};

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [rideId, participantId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    // If WebSocket is open, send via WS (it will be stored + broadcast)
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message: text }));
    } else {
      // Fallback to REST
      try {
        const msg = await apiFetch<ChatMessage>(`rides/${rideId}/chat/message${chatQuery}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        });
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      } catch {
        // restore input on failure
        setInput(text);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const shellWidth = 480;
  const bottomNavHeight = 56;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        bottom: bottomNavHeight,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: shellWidth,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-main, #333232)',
        textAlign: 'left',
        zIndex: 19,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          background: 'var(--color-bg, #181a20)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px',
          minHeight: 56,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Back"
        >
          {Icons.back}
        </button>

        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Ride Chat</h2>
      </div>
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '14px 16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
      {loading && (
        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          Loading messages...
        </p>
      )}

      {!loading && messages.length === 0 && (
        <p
          style={{
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'center',
            marginTop: 40,
          }}
        >
          No messages yet. Say hello!
        </p>
      )}

      {messages.map((msg) => {
        const isMe = msg.sender_id === currentUserId;
        return (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: isMe ? 'flex-end' : 'flex-start',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '78%',
                gap: 4,
              }}
            >
              {!isMe && (
                <span
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.45)',
                    marginLeft: 4,
                    textAlign: 'left',
                  }}
                >
                  {msg.sender_name}
                </span>
              )}

              <div
                style={{
                  background: isMe ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize: 14,
                  lineHeight: 1.4,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  textAlign: 'left',
                }}
              >
                {msg.message}
              </div>

              <span
                style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.3)',
                  marginRight: isMe ? 4 : 0,
                  marginLeft: isMe ? 0 : 4,
                  textAlign: isMe ? 'right' : 'left',
                }}
              >
                {formatTime(msg.created_at)}
              </span>
            </div>
          </div>
        );
      })}

      <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          flexShrink: 0,
          background: 'var(--color-bg, #181a20)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
      <div
        style={{
          display: 'flex',
          gap: 8,
          padding: '10px 16px 12px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            borderRadius: 20,
            padding: '10px 16px',
            color: '#fff',
            fontSize: 14,
            outline: 'none',
          }}
        />

        <button
          type="button"
          onClick={sendMessage}
          disabled={!input.trim()}
          style={{
            background: input.trim() ? '#3b82f6' : 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default',
            color: '#fff',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
          aria-label="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
      </div>
    </div>
  );
};

export default ChatPage;
