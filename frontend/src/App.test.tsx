import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import App, {Btn, DetailRow, MapPlaceholder} from './App';
import {apiFetch} from './lib/api';

vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

vi.mock('./HomePage', () => ({
  default: ({ onRequestRide, onPostRide, onOpenTimetable, onDriverSignup }: any) => (
    <div data-testid="home-page">
      <button onClick={() => onRequestRide({ origin: 'Home', destination: 'Uni' })}>Request Ride</button>
      <button onClick={onPostRide}>Post Ride</button>
      <button onClick={onOpenTimetable}>Home Timetable</button>
      <button onClick={onDriverSignup}>Home Driver Signup</button>
    </div>
  )
}));

vi.mock('./LoginPage', () => ({
  default: ({ onAuthSuccess, onStartDriverSignup }: any) => (
    <div data-testid="login-page">
      <button onClick={onAuthSuccess}>Login</button>
      <button onClick={() => onStartDriverSignup({ firstName: 'Test' })}>Signup Driver Draft</button>
    </div>
  )
}));

vi.mock('./AccountPage', () => ({
  default: ({ onLogout, onOpenSettings, onOpenTimetable, onOpenSafetyCheckup }: any) => (
    <div data-testid="account-page">
      <button onClick={onLogout}>Logout</button>
      <button onClick={onOpenSettings}>Account Settings</button>
      <button onClick={onOpenTimetable}>Account Timetable</button>
      <button onClick={onOpenSafetyCheckup}>Account Safety</button>
    </div>
  )
}));

vi.mock('./JourneyPage', () => ({
  default: ({ onDriverSignup }: any) => (
    <div data-testid="journey-page">
      <button onClick={onDriverSignup}>Journey Driver Signup</button>
    </div>
  )
}));

vi.mock('./ActivityPage', () => ({
  default: ({ onDriverSignup }: any) => (
    <div data-testid="activity-page">
      <button onClick={onDriverSignup}>Activity Driver Signup</button>
    </div>
  )
}));

vi.mock('./PostRidePage', () => ({ default: () => <div data-testid="post-ride-page">Post Ride Page</div> }));

vi.mock('./RequestRidePage', () => ({
  default: ({ prefill }: any) => (
    <div data-testid="request-page">
      Request Page {prefill ? `Prefill: ${prefill.origin} to ${prefill.destination}` : 'No Prefill'}
    </div>
  )
}));

vi.mock('./TimetablePage', () => ({
  default: ({ onBack, onSelectEvent }: any) => (
    <div data-testid="timetable-page">
      <button onClick={onBack}>Timetable Back</button>
      <button onClick={() => onSelectEvent({ origin: 'Class', destination: 'Home' })}>Select Event</button>
    </div>
  )
}));

vi.mock('./SafetyCheckupPage', () => ({
  default: ({ onBack }: any) => (
    <div data-testid="safety-page">
      <button onClick={onBack}>Safety Back</button>
    </div>
  )
}));

vi.mock('./SettingsPage', () => ({
  default: ({ onBack }: any) => (
    <div data-testid="settings-page">
      <button onClick={onBack}>Settings Back</button>
    </div>
  )
}));

vi.mock('./DriverSignupPage', () => ({
  default: ({ onComplete, onBack }: any) => (
    <div data-testid="driver-signup-page">
      <button onClick={onComplete}>Complete Signup</button>
      <button onClick={onBack}>Signup Back</button>
    </div>
  )
}));


describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
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
      render(
        <Btn cls="test-btn" icon={<span data-testid="test-icon" />} label="Click Me" small onClick={handleClick} />
      );
      const btn = screen.getByRole('button', { name: 'Click Me' });
      expect(btn).toHaveClass('sheet-action-btn', 'test-btn', 'btn-small');
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();

      fireEvent.click(btn);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Unauthenticated Flow & Pre-Auth Driver Signup', () => {
    it('renders LoginPage initially and hides navigation', () => {
      render(<App />);
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('handles pre-auth driver signup draft flow', () => {
      render(<App />);

      // Click start driver signup
      fireEvent.click(screen.getByText('Signup Driver Draft'));

      // Verify local storage was set
      expect(localStorage.getItem('driverSignupDraft')).toContain('Test');

      // Verify signup page is shown
      expect(screen.getByTestId('driver-signup-page')).toBeInTheDocument();

      // Test going back to login
      fireEvent.click(screen.getByText('Signup Back'));
      expect(screen.getByTestId('login-page')).toBeInTheDocument();

      // Test completing signup logs the user in
      fireEvent.click(screen.getByText('Signup Driver Draft'));
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: false }); // Mock initial status fetch
      fireEvent.click(screen.getByText('Complete Signup'));

      waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });
  });

  describe('Authenticated Flow & Routing', () => {
    beforeEach(async () => {
      // Helper to login before each routing test
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
      // Test Request Ride prefill
      fireEvent.click(screen.getByText('Request Ride'));
      expect(screen.getByTestId('request-page')).toHaveTextContent('Prefill: Home to Uni');

      // Reset to home
      fireEvent.click(screen.getByText('Home', { selector: '.nav-label' }));

      // Test Open Timetable
      fireEvent.click(screen.getByText('Home Timetable'));
      expect(screen.getByTestId('timetable-page')).toBeInTheDocument();
    });

    it('handles Account page callbacks (Settings, Safety, Timetable) and back buttons', () => {
      fireEvent.click(screen.getByText('Account'));

      // Settings Flow
      fireEvent.click(screen.getByText('Account Settings'));
      expect(screen.getByTestId('settings-page')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Settings Back'));
      expect(screen.getByTestId('account-page')).toBeInTheDocument();

      // Safety Flow
      fireEvent.click(screen.getByText('Account Safety'));
      expect(screen.getByTestId('safety-page')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Safety Back'));
      expect(screen.getByTestId('account-page')).toBeInTheDocument();

      // Timetable Flow
      fireEvent.click(screen.getByText('Account Timetable'));
      expect(screen.getByTestId('timetable-page')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Timetable Back'));
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

  describe('Driver API Failures & Access Gates', () => {
    it('handles API fetch error during refreshDriverStatus gracefully', async () => {
      // API throws an error when trying to fetch driver status
      vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Network error'));

      render(<App />);
      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        // Should default to failing closed (not a driver) but still logged in
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });

      // Clicking post ride should trigger driver signup because it thinks they aren't a driver
      vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Network error')); // Gate check fails again
      fireEvent.click(screen.getByText('Post Ride'));

      await waitFor(() => {
        expect(screen.getByTestId('driver-signup-page')).toBeInTheDocument();
      });
    });

    it('renders the manual fallback UI if activeTab is post but canUseDriverMode is false', async () => {
      // Simulate user logging in as a non-driver
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: false });
      render(<App />);
      fireEvent.click(screen.getByText('Login'));
      await waitFor(() => expect(screen.getByTestId('home-page')).toBeInTheDocument());

      // Trigger signup specifically to return to 'post' afterwards
      fireEvent.click(screen.getByText('Home Driver Signup'));
      await waitFor(() => expect(screen.getByTestId('driver-signup-page')).toBeInTheDocument());

      // Mock the refresh status AFTER signup to still return false (e.g. pending verification)
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: false });

      // Complete signup. App will route to 'post' because of afterDriverSignupTab,
      // but canUseDriverMode will remain false because of our mock above.
      fireEvent.click(screen.getByText('Complete Signup'));

      await waitFor(() => {
        // This targets the hardcoded fallback block in App.tsx for `case 'post': if (!canUseDriverMode)`
        expect(screen.getByText('Driver access required')).toBeInTheDocument();
        expect(screen.getByText('Become a driver')).toBeInTheDocument();
      });

      // Click the fallback button to test it triggers signup again
      fireEvent.click(screen.getByText('Become a driver'));
      expect(screen.getByTestId('driver-signup-page')).toBeInTheDocument();
    });

    it('handles inline driver signups from Journey and Activity pages', async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: true });
      render(<App />);
      fireEvent.click(screen.getByText('Login'));
      await waitFor(() => expect(screen.getByTestId('home-page')).toBeInTheDocument());

      // Test Journey Page driver signup callback
      fireEvent.click(screen.getByText('Journey'));
      fireEvent.click(screen.getByText('Journey Driver Signup'));
      expect(screen.getByTestId('driver-signup-page')).toBeInTheDocument();

      // Complete returns to journey
      vi.mocked(apiFetch).mockResolvedValueOnce({ is_driver: true });
      fireEvent.click(screen.getByText('Complete Signup'));
      await waitFor(() => expect(screen.getByTestId('journey-page')).toBeInTheDocument());

      // Test Activity Page driver signup callback
      fireEvent.click(screen.getByText('Activity'));
      fireEvent.click(screen.getByText('Activity Driver Signup'));
      expect(screen.getByTestId('driver-signup-page')).toBeInTheDocument();
    });
  });
});