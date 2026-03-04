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
        body: JSON.stringify({ email: 'test@bath.ac.uk', password: 'password123' }),
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
    fireEvent.change(screen.getByLabelText('Email or university username'), { target: { value: 'john@bath.ac.uk' } });
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
    fireEvent.change(screen.getByLabelText('Email or university username'), { target: { value: 'jane@bath.ac.uk' } });
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
    fireEvent.change(screen.getByLabelText('Email or university username'), { target: { value: 'mark@bath.ac.uk' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'driverpass' } });
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'driverpass' } });

    // Check driver checkbox
    fireEvent.click(screen.getByLabelText('Do you want to sign up as a driver?'));

    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() => {
      // Should call register
      expect(apiFetch).toHaveBeenNthCalledWith(1, 'auth/register', expect.anything());
      // Should call login right after
      expect(apiFetch).toHaveBeenNthCalledWith(2, 'auth/login', expect.objectContaining({
        body: expect.stringContaining('"email":"mark@bath.ac.uk","password":"driverpass"'),
      }));

      expect(window.localStorage.getItem('authToken')).toBe('auto-driver-token');
      expect(mockProps.onStartDriverSignup).toHaveBeenCalledWith({
        firstName: 'Mark',
        middleNames: '',
        lastName: 'Taylor',
        emailOrUsername: 'mark@bath.ac.uk',
      });
    });
    
  });
});