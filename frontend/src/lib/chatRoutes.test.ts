import { describe, expect, it } from 'vitest';
import { areSameChatLink, buildChatPath, parseChatLink } from './chatRoutes';

describe('chatRoutes', () => {
  it('builds chat paths with and without a participant', () => {
    expect(buildChatPath('ride-123')).toBe('/chat/ride-123');
    expect(buildChatPath('ride-123', 'user 42')).toBe('/chat/ride-123?participant=user%2042');
  });

  it('parses relative and absolute chat links', () => {
    expect(parseChatLink('/chat/ride-123?participant=user-42')).toEqual({
      rideId: 'ride-123',
      participantId: 'user-42',
    });

    expect(parseChatLink('https://example.com/chat/ride-999')).toEqual({
      rideId: 'ride-999',
      participantId: undefined,
    });
  });

  it('returns null for non-chat links or missing ride ids', () => {
    expect(parseChatLink('/activity?mode=driver')).toBeNull();
    expect(parseChatLink('/chat/')).toBeNull();
  });

  it('compares chat links by ride and participant', () => {
    expect(
      areSameChatLink('/chat/ride-123?participant=user-42', '/chat/ride-123?participant=user-42'),
    ).toBe(true);
    expect(
      areSameChatLink('/chat/ride-123?participant=user-42', '/chat/ride-123?participant=other'),
    ).toBe(false);
    expect(areSameChatLink('/chat/ride-123', '/chat/ride-123')).toBe(true);
    expect(areSameChatLink('/chat/ride-123', null)).toBe(false);
    expect(areSameChatLink('/chat/ride-123', '/activity')).toBe(false);
  });
});
