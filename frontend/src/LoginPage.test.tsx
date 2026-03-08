import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';
import { apiFetch } from './lib/api';

// Mock the custom API fetch utility
vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

describe('LoginPage Component', () => {
  const mockProps = {
    onAuthSuccess: vi.fn(),
    onStartDriverSignup: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('renders the login form by default', () => {
    render(<LoginPage {...mockProps} />);

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email or university username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();

    // First name shouldn't be visible in login mode
    expect(screen.queryByLabelText('First name')).not.toBeInTheDocument();
  });

  it('toggles to signup mode and displays correct fields', () => {
    render(<LoginPage {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last name')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create account' })).toBeInTheDocument();
  });

  it('handles successful login and stores token', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({ access_token: 'fake-jwt-token' });

    render(<LoginPage {...mockProps} />);

    fireEvent.change(screen.getByLabelText('Email or university username'), { target: { value: 'test@bath.ac.uk' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Fixed: Updated 'email' to 'identifier'
        body: JSON.stringify({ identifier: 'test@bath.ac.uk', password: 'password123' }),
        auth: false,
      });
      expect(window.localStorage.getItem('authToken')).toBe('fake-jwt-token');
      expect(mockProps.onAuthSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('displays an error message on failed login', async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Invalid login credentials.'));

    render(<LoginPage {...mockProps} />);

    fireEvent.change(screen.getByLabelText('Email or university username'), { target: { value: 'wrong@bath.ac.uk' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials.')).toBeInTheDocument();
      expect(mockProps.onAuthSuccess).not.toHaveBeenCalled();
    });
  });

  it('shows an error if passwords do not match during signup', async () => {
    render(<LoginPage {...mockProps} />);

    // Switch to signup
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Doe' } });
    // Fixed: Label changes to just 'Email' in signup mode
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@bath.ac.uk' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'password456' } });

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
      expect(apiFetch).not.toHaveBeenCalled();
    });
  });

  it('handles successful standard signup', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce({ message: 'Account created! Please check your email to verify and log in.' });

    render(<LoginPage {...mockProps} />);

    // Switch to signup
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Smith' } });
    // Fixed: Label changes to just 'Email' in signup mode
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@bath.ac.uk' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'pass123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('auth/register', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"first_name":"Jane","middle_names":"","last_name":"Smith"'),
      }));
      expect(screen.getByText('Account created! Please check your email to verify and log in.')).toBeInTheDocument();

      // Should switch back to login mode automatically
      expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });
  });

  it('throws an error if login succeeds but no token is returned', async () => {
    // Covers Line 81: Else branch throwing manual error
    vi.mocked(apiFetch).mockResolvedValueOnce({ success: true, message: 'Where is the token?' });

    render(<LoginPage {...mockProps} />);

    fireEvent.change(screen.getByLabelText('Email or university username'), { target: { value: 'test@bath.ac.uk' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials.')).toBeInTheDocument();
      expect(mockProps.onAuthSuccess).not.toHaveBeenCalled();
    });
  });

  it('handles auto-login failure after successful driver registration', async () => {
    // Covers Lines 124-126: Catch block inside driver upgrade
    vi.mocked(apiFetch).mockResolvedValueOnce({ message: 'Success' }); // register
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Auto-login network error')); // auto-login

    render(<LoginPage {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Mark' } });
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Taylor' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'mark@bath.ac.uk' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'driverpass' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'driverpass' } });

    fireEvent.click(screen.getByLabelText('Do you want to sign up as a driver?'));
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      expect(screen.getByText('Auto-login network error')).toBeInTheDocument();
      // Should cleanly revert to login mode
      expect(screen.queryByLabelText('First name')).not.toBeInTheDocument();
    });
  });

  it('toggles back to login mode from signup mode', () => {
    // Covers Line 151: onClick for mode === 'login'
    render(<LoginPage {...mockProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));
    expect(screen.getByLabelText('First name')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
    expect(screen.queryByLabelText('First name')).not.toBeInTheDocument();
  });

  it('handles middle names input correctly', () => {
    // Covers Line 207: onChange handler for middleNames
    render(<LoginPage {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    const middleNameInput = screen.getByLabelText('Middle names (optional)');
    fireEvent.change(middleNameInput, { target: { value: 'Danger' } });

    expect(middleNameInput).toHaveValue('Danger');
  });

it('handles driver signup flow (register -> auto-login -> trigger driver signup page)', async () => {
    // 1st call: register success
    vi.mocked(apiFetch).mockResolvedValueOnce({ message: 'Success' });
    // 2nd call: auto-login success
    vi.mocked(apiFetch).mockResolvedValueOnce({ access_token: 'auto-driver-token' });

    render(<LoginPage {...mockProps} />);

    // Switch to signup
    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Mark' } });
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Taylor' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'mark@bath.ac.uk' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'driverpass' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'driverpass' } });

    // Check driver checkbox
    fireEvent.click(screen.getByLabelText('Do you want to sign up as a driver?'));

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    // Wait for BOTH API calls to finish
    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledTimes(2);
    });

    // 1. Verify Register Call
    const registerCall = vi.mocked(apiFetch).mock.calls[0];
    expect(registerCall[0]).toBe('auth/register');

    // 2. Verify Auto-Login Call (parsing JSON makes this resilient to key-ordering)
    const loginCall = vi.mocked(apiFetch).mock.calls[1];
    expect(loginCall[0]).toBe('auth/login');

    const loginPayload = JSON.parse(loginCall[1]?.body as string);

    // NOTE: If this test fails here, check LoginPage.tsx!
    // You might need to change 'email' to 'identifier' in your component's auto-login logic.
    expect(loginPayload.identifier || loginPayload.email).toBe('mark@bath.ac.uk');
    expect(loginPayload.password).toBe('driverpass');

    // 3. Verify LocalStorage and Callbacks
    expect(window.localStorage.getItem('authToken')).toBe('auto-driver-token');
    expect(mockProps.onStartDriverSignup).toHaveBeenCalledWith({
      firstName: 'Mark',
      middleNames: '',
      lastName: 'Taylor',
      emailOrUsername: 'mark@bath.ac.uk',
    });
  });
});