export type ChatRoute = {
  rideId: string;
  participantId?: string;
};

export const buildChatPath = (rideId: string, participantId?: string) => {
  if (!participantId) return `/chat/${rideId}`;
  return `/chat/${rideId}?participant=${encodeURIComponent(participantId)}`;
};

export const parseChatLink = (
  link: string,
  origin = typeof window === 'undefined' ? 'http://localhost' : window.location.origin,
): ChatRoute | null => {
  const url = new URL(link, origin);
  if (!url.pathname.startsWith('/chat/')) return null;

  const rideId = url.pathname.replace('/chat/', '').split('/')[0];
  if (!rideId) return null;

  return {
    rideId,
    participantId: url.searchParams.get('participant') ?? undefined,
  };
};

export const areSameChatLink = (
  left: string | null | undefined,
  right: string | null | undefined,
) => {
  if (!left || !right) return false;

  const leftRoute = parseChatLink(left);
  const rightRoute = parseChatLink(right);

  if (!leftRoute || !rightRoute) return false;

  return (
    leftRoute.rideId === rightRoute.rideId &&
    (leftRoute.participantId ?? '') === (rightRoute.participantId ?? '')
  );
};
