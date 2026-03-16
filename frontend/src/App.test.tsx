import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import App, {Btn, DetailRow, Icons, MapPlaceholder} from './App';
import {apiFetch} from './lib/api';
import * as notifications from './lib/notifications';

vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

vi.mock('./lib/notifications', () => {
  let listeners: Function[] = [];
  let incomingListeners: Function[] = [];
  return {
    getUnreadCount: vi.fn(() => 0),
    subscribe: vi.fn((cb) => {
      listeners.push(cb);
      return () => {
        listeners = listeners.filter((l) => l !== cb);
      };
    }),
    subscribeToIncomingNotifications: vi.fn((cb) => {
      incomingListeners.push(cb);
      return () => {
        incomingListeners = incomingListeners.filter((l) => l !== cb);
      };
    }),
    startPolling: vi.fn(),
    startRealtimeNotifications: vi.fn(),
    resetNotifications: vi.fn(),
    markReadByLink: vi.fn(() => Promise.resolve()),
    __trigger: () => listeners.forEach((cb) => cb()),
    __triggerIncoming: (notification: any) => incomingListeners.forEach((cb) => cb(notification)),
  };
});

vi.mock('./HomePage', () => ({
  default: ({ onRequestRide, onPostRide, onOpenTimetable, onDriverSignup }: any) => (
    <div data-testid="home-page">
      <button onClick={() => onRequestRide({ origin: 'Home', destination: 'Uni' })}>Request Ride</button>
      <button onClick={onPostRide}>Post Ride</button>
      <button onClick={onOpenTimetable}>Home Timetable</button>
      <button onClick={onDriverSignup}>Home Driver Signup</button>
    </div>
  ),
}));

vi.mock('./LoginPage', () => ({
  default: ({ onAuthSuccess, onStartDriverSignup }: any) => (
    <div data-testid="login-page">
      <button onClick={onAuthSuccess}>Login</button>
      <button onClick={() => onStartDriverSignup({ firstName: 'Test' })}>Signup Driver Draft</button>
    </div>
  ),
}));

vi.mock('./AccountPage', () => ({
  default: ({ onLogout, onOpenSettings, onOpenTimetable, onOpenSafetyCheckup, onOpenInbox }: any) => (
    <div data-testid="account-page">
      <button onClick={onLogout}>Logout</button>
      <button onClick={onOpenSettings}>Account Settings</button>
      <button onClick={onOpenTimetable}>Account Timetable</button>
      <button onClick={onOpenSafetyCheckup}>Account Safety</button>
      <button onClick={onOpenInbox}>Account Inbox</button>
    </div>
  ),
}));

vi.mock('./JourneyPage', () => ({
  default: ({ onDriverSignup, mode }: any) => (
    <div data-testid="journey-page" data-mode={mode}>
      <button onClick={onDriverSignup}>Journey Driver Signup</button>
    </div>
  ),
}));

vi.mock('./ActivityPage', () => ({
  default: ({ onDriverSignup, onRideStarted, mode }: any) => (
    <div data-testid="activity-page" data-mode={mode}>
      <button onClick={onDriverSignup}>Activity Driver Signup</button>
      <button onClick={onRideStarted}>Start Ride</button>
    </div>
  ),
}));

vi.mock('./PostRidePage', () => ({ default: () => <div data-testid="post-ride-page">Post Ride Page</div> }));

vi.mock('./RequestRidePage', () => ({
  default: ({ prefill }: any) => (
    <div data-testid="request-page">
      Request Page {prefill ? `Prefill: ${prefill.origin} to ${prefill.destination}` : 'No Prefill'}
    </div>
  ),
}));

vi.mock('./TimetablePage', () => ({
  default: ({ onBack, onSelectEvent }: any) => (
    <div data-testid="timetable-page">
      <button onClick={onBack}>Timetable Back</button>
      <button onClick={() => onSelectEvent({ origin: 'Class', destination: 'Home' })}>Select Event</button>
    </div>
  ),
}));

vi.mock('./SafetyCheckupPage', () => ({
  default: ({ onBack }: any) => (
    <div data-testid="safety-page">
      <button onClick={onBack}>Safety Back</button>
    </div>
  ),
}));

vi.mock('./SettingsPage', () => ({
  default: ({ onBack }: any) => (
    <div data-testid="settings-page">
      <button onClick={onBack}>Settings Back</button>
    </div>
  ),
}));

vi.mock('./DriverSignupPage', () => ({
  default: ({ onComplete, onBack }: any) => (
    <div data-testid="driver-signup-page">
      <button onClick={onComplete}>Complete Signup</button>
      <button onClick={onBack}>Signup Back</button>
    </div>
  ),
}));

vi.mock('./ChatPage', () => ({
  default: ({ rideId, participantId, onBack }: any) => (
    <div data-testid="chat-page">
      Chat {rideId} - {participantId}
      <button onClick={onBack}>Chat Back</button>
    </div>
  ),
}));

vi.mock('./InboxPage', () => ({
  default: ({ onBack, onNavigate }: any) => (
    <div data-testid="inbox-page">
      <button onClick={onBack}>Inbox Back</button>
      <button onClick={() => onNavigate('/chat/123?participant=456')}>Navigate Chat</button>
      <button onClick={() => onNavigate('/activity?mode=driver')}>Navigate Activity</button>
    </div>
  ),
}));

vi.mock('./lib/authToken', () => ({
  getAuthToken: vi.fn(() => localStorage.getItem('authToken')),
  clearAuthToken: vi.fn(() => localStorage.removeItem('authToken')),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.location.hash = '';
    window.history.replaceState({}, '', '/');
  });

  describe('Exported Helper Components', () => {
    it('renders MapPlaceholder correctly', () => {
      render(<MapPlaceholder label="Test Map Badge" />);
      expect(screen.getByText('Test Map Badge')).toBeInTheDocument();
      expect(document.querySelector('.map-svg')).toBeInTheDocument();
    });

    it('renders DetailRow correctly', () => {
      render(<DetailRow label="Cost" value="£10" valueClass="custom-class" />);
      expect(screen.getByText('Cost')).toBeInTheDocument();
      const val = screen.getByText('£10');
      expect(val).toBeInTheDocument();
      expect(val).toHaveClass('custom-class');
    });

    it('renders Btn correctly and handles clicks', () => {
      const handleClick = vi.fn();
      render(<Btn cls="test-btn" icon={<span data-testid="test-icon" />} label="Click Me" small onClick={handleClick} />);
      const btn = screen.getByRole('button', { name: 'Click Me' });
      expect(btn).toHaveClass('sheet-action-btn', 'test-btn', 'btn-small');
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();

      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders all exported Icons successfully', () => {
      Object.entries(Icons).forEach(([name, icon]) => {
        const { container } = render(<div data-testid={`icon-${name}`}>{icon}</div>);
        expect(container.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  describe('Unauthenticated Flow & Pre-Auth Driver Signup', () => {
    it('renders LoginPage initially and hides navigation', () => {
      render(<App />);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('handles pre-auth driver signup draft flow', async () => {
      render(<App />);

      fireEvent.click(screen.getByText('Signup Driver Draft'));
      expect(localStorage.getItem('driverSignupDraft')).toContain('Test');
      expect(screen.getByTestId('driver-signup-page')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Signup Back'));
      expect(screen.getByTestId('login-page')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Signup Driver Draft'));
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: false });
      fireEvent.click(screen.getByText('Complete Signup'));

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    it('authenticates automatically and starts polling if token is present on mount', async () => {
      localStorage.setItem('authToken', 'valid-token');
      vi.mocked(apiFetch).mockResolvedValue({}); // Mocks success for users/me and drivers/me/status

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
        expect(notifications.startPolling).toHaveBeenCalled();
      });
    });
  });

  describe('Authenticated Flow & Routing', () => {
    beforeEach(async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: true });
      render(<App />);
      fireEvent.click(screen.getByText('Login'));
      await waitFor(() => expect(screen.getByTestId('home-page')).toBeInTheDocument());
    });

    it('navigates via bottom navigation bar', () => {
      fireEvent.click(screen.getByText('Journey'));
      expect(screen.getByTestId('journey-page')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Activity'));
      expect(screen.getByTestId('activity-page')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Account'));
      expect(screen.getByTestId('account-page')).toBeInTheDocument();
    });

    it('handles Home page callbacks (Request Ride, Timetable)', () => {
      fireEvent.click(screen.getByText('Request Ride'));
      expect(screen.getByTestId('request-page')).toHaveTextContent('Prefill: Home to Uni');

      fireEvent.click(screen.getByText('Home', { selector: '.nav-label' }));

      fireEvent.click(screen.getByText('Home Timetable'));
      expect(screen.getByTestId('timetable-page')).toBeInTheDocument();
    });

    it('navigates directly to post ride page if driver status check succeeds', async () => {
      // Mock the secondary `refreshDriverStatus` check inside `goToDriverTab`
      vi.mocked(apiFetch).mockResolvedValue({ is_driver: true });

      fireEvent.click(screen.getByText('Post Ride'));

      await waitFor(() => {
        expect(screen.getByTestId('post-ride-page')).toBeInTheDocument();
      });
    });

    it('handles Account page callbacks (Settings, Safety, Timetable, Inbox) and back buttons', () => {
      fireEvent.click(screen.getByText('Account'));

      fireEvent.click(screen.getByText('Account Settings'));
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Settings Back'));
      expect(screen.getByTestId('account-page')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Account Safety'));
      expect(screen.getByTestId('safety-page')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Safety Back'));
      expect(screen.getByTestId('account-page')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Account Timetable'));
      expect(screen.getByTestId('timetable-page')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Timetable Back'));
      expect(screen.getByTestId('account-page')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Account Inbox'));
      expect(screen.getByTestId('inbox-page')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Inbox Back'));
      expect(screen.getByTestId('account-page')).toBeInTheDocument();
    });

    it('handles Timetable select event with prefill', () => {
      fireEvent.click(screen.getByText('Account'));
      fireEvent.click(screen.getByText('Account Timetable'));

      fireEvent.click(screen.getByText('Select Event'));
      expect(screen.getByTestId('request-page')).toHaveTextContent('Prefill: Class to Home');
    });

    it('logs the user out and clears state', () => {
      localStorage.setItem('authToken', 'fake-token');
      fireEvent.click(screen.getByText('Account'));
      fireEvent.click(screen.getByText('Logout'));

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('Chat, Inbox, and Notifications', () => {
    it('displays unread badge on navigation when notification store updates', async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: true });
      vi.mocked(notifications.getUnreadCount).mockReturnValue(5);

      render(<App />);
      fireEvent.click(screen.getByText('Login'));
      await waitFor(() => expect(screen.getByTestId('home-page')).toBeInTheDocument());

      // Trigger store notification manually
      act(() => {
        (notifications as any).__trigger();
      });

      await waitFor(() => {
        const accountNavButton = screen.getByText('Account', { selector: '.nav-label' }).closest('button');
        // Unread badge is absolute positioned span next to 👤
        expect(accountNavButton?.querySelector('span')).toBeInTheDocument();
      });
    });

    it('shows a realtime chat toast and opens the linked chat when clicked', async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: true });

      render(<App />);
      fireEvent.click(screen.getByText('Login'));
      await waitFor(() => expect(screen.getByTestId('home-page')).toBeInTheDocument());

      act(() => {
        (notifications as any).__triggerIncoming({
          id: 'notif-1',
          user_id: 'profile-1',
          type: 'chat',
          title: 'New message from Alex Driver',
          body: 'I am outside now.',
          created_at: new Date().toISOString(),
          read: false,
          link: '/chat/ride-123?participant=passenger-9',
        });
      });

      expect(await screen.findByText('Alex Driver')).toBeInTheDocument();
      expect(screen.getByText('I am outside now.')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Open chat from Alex Driver' }));

      await waitFor(() => {
        expect(screen.getByTestId('chat-page')).toHaveTextContent('Chat ride-123 - passenger-9');
      });

      expect(notifications.markReadByLink).toHaveBeenCalledWith('/chat/ride-123?participant=passenger-9');
    });

    it('handles Inbox navigation, navigateFromLink parsing, and deep links', async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: true });
      render(<App />);
      fireEvent.click(screen.getByText('Login'));
      await waitFor(() => expect(screen.getByTestId('home-page')).toBeInTheDocument());

      fireEvent.click(screen.getByText('Account'));
      fireEvent.click(screen.getByText('Account Inbox'));

      // Navigate to chat
      fireEvent.click(screen.getByText('Navigate Chat'));
      expect(screen.getByTestId('chat-page')).toHaveTextContent('Chat 123 - 456');

      // Navigate back out of chat returning to Inbox
      fireEvent.click(screen.getByText('Chat Back'));
      expect(screen.getByTestId('inbox-page')).toBeInTheDocument();

      // Navigate to activity via deep link string from inbox
      fireEvent.click(screen.getByText('Navigate Activity'));
      const activityPage = screen.getByTestId('activity-page');
      expect(activityPage).toBeInTheDocument();
      expect(activityPage).toHaveAttribute('data-mode', 'Driver');
    });

    it('syncs chat route state and updates participants on initial load and popstate', async () => {
      window.history.replaceState({}, '', '/chat/888?participant=user2');
      vi.mocked(apiFetch).mockResolvedValue({ is_driver: true });
      render(<App />);

      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('chat-page')).toHaveTextContent('Chat 888 - user2');
      });

      window.history.replaceState({}, '', '/chat/999?participant=user3');
      fireEvent(window, new PopStateEvent('popstate'));

      await waitFor(() => {
        expect(screen.getByTestId('chat-page')).toHaveTextContent('Chat 999 - user3');
      });
    });

    it('falls back to ActivityPage if navigating to /chat directly without a ride ID', async () => {
      window.history.replaceState({}, '', '/chat');

      vi.mocked(apiFetch).mockResolvedValue({ is_driver: true });

      render(<App />);

      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('activity-page')).toBeInTheDocument();
      });
    });
  });

  describe('Activity & Journey Modes', () => {
    it('applies mode query parameters correctly from the URL on direct load', async () => {
      window.history.replaceState({}, '', '/journey?mode=driver');
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: true });
      render(<App />);
      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        const journeyPage = screen.getByTestId('journey-page');
        expect(journeyPage).toBeInTheDocument();
        expect(journeyPage).toHaveAttribute('data-mode', 'driver');
      });
    });

    it('switches to driver journey mode when a ride is started from ActivityPage', async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: true });
      render(<App />);
      fireEvent.click(screen.getByText('Login'));
      await waitFor(() => expect(screen.getByTestId('home-page')).toBeInTheDocument());

      fireEvent.click(screen.getByText('Activity'));
      fireEvent.click(screen.getByText('Start Ride'));

      await waitFor(() => {
        const journeyPage = screen.getByTestId('journey-page');
        expect(journeyPage).toBeInTheDocument();
        expect(journeyPage).toHaveAttribute('data-mode', 'driver');
      });
    });
  });

  describe('Driver API Failures & Access Gates', () => {
    it('handles API fetch error during refreshDriverStatus gracefully', async () => {
      vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Network error'));

      render(<App />);
      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });

      vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Network error'));
      fireEvent.click(screen.getByText('Post Ride'));

      await waitFor(() => {
        expect(screen.getByTestId('driver-signup-page')).toBeInTheDocument();
      });
    });

    it('renders the manual fallback UI if activeTab is post but canUseDriverMode is false', async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: false });
      render(<App />);
      fireEvent.click(screen.getByText('Login'));
      await waitFor(() => expect(screen.getByTestId('home-page')).toBeInTheDocument());

      fireEvent.click(screen.getByText('Home Driver Signup'));
      await waitFor(() => expect(screen.getByTestId('driver-signup-page')).toBeInTheDocument());

      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: false });

      fireEvent.click(screen.getByText('Complete Signup'));

      await waitFor(() => {
        expect(screen.getByText('Driver access required')).toBeInTheDocument();
        expect(screen.getByText('Become a driver')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Become a driver'));
      expect(screen.getByTestId('driver-signup-page')).toBeInTheDocument();
    });

    it('handles inline driver signups from Journey and Activity pages', async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: true });
      render(<App />);
      fireEvent.click(screen.getByText('Login'));
      await waitFor(() => expect(screen.getByTestId('home-page')).toBeInTheDocument());

      fireEvent.click(screen.getByText('Journey'));
      fireEvent.click(screen.getByText('Journey Driver Signup'));
      expect(screen.getByTestId('driver-signup-page')).toBeInTheDocument();

      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: true });
      fireEvent.click(screen.getByText('Complete Signup'));
      await waitFor(() => expect(screen.getByTestId('journey-page')).toBeInTheDocument());

      fireEvent.click(screen.getByText('Activity'));
      fireEvent.click(screen.getByText('Activity Driver Signup'));
      expect(screen.getByTestId('driver-signup-page')).toBeInTheDocument();
    });
  });

  describe('Edge Cases, Routing, and Error Handling', () => {
    it('handles popstate events for browser navigation', async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: true });
      render(<App />);
      fireEvent.click(screen.getByText('Login'));
      await waitFor(() => expect(screen.getByTestId('home-page')).toBeInTheDocument());

      window.history.pushState({}, '', '/account');
      fireEvent(window, new PopStateEvent('popstate'));

      await waitFor(() => {
        expect(screen.getByTestId('account-page')).toBeInTheDocument();
      });
    });

    it('logs out the user if the initial users/me fetch returns a 401', async () => {
      localStorage.setItem('authToken', 'fake-token');

      vi.mocked(apiFetch).mockRejectedValueOnce({ status: 401 });

      render(<App />);

      await waitFor(() => {
        expect(localStorage.getItem('authToken')).toBeNull();
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
      });
    });

    it('renders the correct tabs based on direct path routing', async () => {
      vi.mocked(apiFetch).mockResolvedValue({ is_driver: true });

      const pathsToTest = [
        { path: '/post-ride', testId: 'post-ride-page' },
        { path: '/request-ride', testId: 'request-page' },
        { path: '/settings', testId: 'settings-page' },
        { path: '/safety', testId: 'safety-page' },
      ];

      for (const { path, testId } of pathsToTest) {
        window.history.replaceState({}, '', path);
        const { unmount } = render(<App />);
        fireEvent.click(screen.getByText('Login'));
        await waitFor(() => {
          expect(screen.getByTestId(testId)).toBeInTheDocument();
        });
        unmount();
      }
    });
  });
});
