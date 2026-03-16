import React, { useEffect, useEffectEvent } from 'react';

export type ChatToast = {
  id: string;
  senderName: string;
  preview: string;
  link: string;
};

type ChatToastLayerProps = {
  toasts: ChatToast[];
  onOpen: (toast: ChatToast) => void;
  onDismiss: (toastId: string) => void;
};

const AUTO_DISMISS_MS = 5000;

const ChatToastItem: React.FC<{
  toast: ChatToast;
  onOpen: (toast: ChatToast) => void;
  onDismiss: (toastId: string) => void;
}> = ({ toast, onOpen, onDismiss }) => {
  const handleAutoDismiss = useEffectEvent(() => {
    onDismiss(toast.id);
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      handleAutoDismiss();
    }, AUTO_DISMISS_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast.id, handleAutoDismiss]);

  return (
    <button
      type="button"
      className="chat-toast-card"
      onClick={() => onOpen(toast)}
      aria-label={`Open chat from ${toast.senderName}`}
    >
      <div className="chat-toast-kicker">New message</div>
      <div className="chat-toast-sender">{toast.senderName}</div>
      <div className="chat-toast-preview">{toast.preview}</div>
    </button>
  );
};

const ChatToastLayer: React.FC<ChatToastLayerProps> = ({ toasts, onOpen, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="chat-toast-layer" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <ChatToastItem
          key={toast.id}
          toast={toast}
          onOpen={onOpen}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

export default ChatToastLayer;
