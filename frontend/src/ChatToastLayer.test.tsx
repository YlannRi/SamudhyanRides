import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChatToastLayer, { type ChatToast } from './ChatToastLayer';

const sampleToast: ChatToast = {
  id: 'toast-1',
  senderName: 'Alex Driver',
  preview: 'I am outside now.',
  link: '/chat/ride-123?participant=passenger-9',
};

describe('ChatToastLayer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing when there are no toasts', () => {
    const { container } = render(
      <ChatToastLayer toasts={[]} onOpen={vi.fn()} onDismiss={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders toast content and opens a chat when clicked', () => {
    const onOpen = vi.fn();

    render(
      <ChatToastLayer toasts={[sampleToast]} onOpen={onOpen} onDismiss={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open chat from Alex Driver' }));

    expect(screen.getByText('New message')).toBeInTheDocument();
    expect(screen.getByText('Alex Driver')).toBeInTheDocument();
    expect(screen.getByText('I am outside now.')).toBeInTheDocument();
    expect(onOpen).toHaveBeenCalledWith(sampleToast);
  });

  it('auto-dismisses a toast after five seconds', () => {
    const onDismiss = vi.fn();

    render(
      <ChatToastLayer toasts={[sampleToast]} onOpen={vi.fn()} onDismiss={onDismiss} />,
    );

    act(() => {
      vi.advanceTimersByTime(4999);
    });
    expect(onDismiss).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onDismiss).toHaveBeenCalledWith('toast-1');
  });

  it('clears the auto-dismiss timer on unmount', () => {
    const onDismiss = vi.fn();
    const { unmount } = render(
      <ChatToastLayer toasts={[sampleToast]} onOpen={vi.fn()} onDismiss={onDismiss} />,
    );

    unmount();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(onDismiss).not.toHaveBeenCalled();
  });
});
