import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DriverSignupPage from './DriverSignupPage';

// Mock the API fetch utility
vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

describe('DriverSignupPage Component', () => {
  const mockProps = {
    onBack: vi.fn(),
    onComplete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('renders the form and handles the back button', () => {
    render(<DriverSignupPage {...mockProps} />);

    expect(screen.getByText('Driver sign-up')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(mockProps.onBack).toHaveBeenCalledTimes(1);
  });

  it('pre-fills data from localStorage on mount', () => {
    // Set up mock localStorage
    localStorage.setItem(
      'driverSignupDraft',
      JSON.stringify({
        firstName: 'John',
        lastName: 'Smith',
        emailOrUsername: 'js123',
      })
    );

    localStorage.setItem(
      'driverApplication',
      JSON.stringify({
        driver: { phone_number: '+447000000000', address: 'Saved Address 123' },
        vehicle: { make: 'Honda' },
      })
    );

    render(<DriverSignupPage {...mockProps} />);

    expect(screen.getByLabelText(/First name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/Last name/i)).toHaveValue('Smith');
    expect(screen.getByLabelText(/Email or university username/i)).toHaveValue('js123');
    expect(screen.getByLabelText(/Phone number/i)).toHaveValue('+447000000000');
    expect(screen.getByLabelText(/Residential address/i)).toHaveValue('Saved Address 123');
    expect(screen.getByLabelText(/Vehicle make/i)).toHaveValue('Honda');
  });
});