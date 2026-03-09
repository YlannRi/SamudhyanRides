import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SettingsPage from './SettingsPage';
import { apiFetch } from './lib/api';

// Mock the API fetch utility
vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

describe('SettingsPage Component', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Keep the promise unresolved to check the loading state
    vi.mocked(apiFetch).mockImplementation(() => new Promise(() => {}));

    render(<SettingsPage onBack={mockOnBack} />);

    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('renders user profile and omits driver section if the user is not a driver', async () => {
    vi.mocked(apiFetch).mockImplementation(async (url) => {
      if (url === 'users/me') return { first_name: 'Alice', last_name: 'Smith' };
      if (url === 'drivers/me') throw new Error('Not a driver'); // Standard 404/Error for non-drivers
      return null;
    });

    render(<SettingsPage onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
      expect(screen.getByText('Your information')).toBeInTheDocument();

      // Values should be mapped and displayed
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Smith')).toBeInTheDocument();

      // Unprovided fields in PROFILE_FIELDS default to "Not provided"
      const notProvided = screen.getAllByText('Not provided');
      expect(notProvided.length).toBeGreaterThan(0);

      // Driver section should not exist
      expect(screen.queryByText('Driver information')).not.toBeInTheDocument();
    });
  });

  it('renders driver information and formats different data types correctly', async () => {
    vi.mocked(apiFetch).mockImplementation(async (url) => {
      if (url === 'users/me') return {
        first_name: 'Bob',
        phone_number: { code: '+44', num: '123' }, // Tests 'object' type stringification
        gender: null, // Tests explicit null
        email: undefined, // Tests undefined
      };
      if (url === 'drivers/me') return {
        verified: true, // Tests boolean true
        vehicle_registration: false, // Tests boolean false
        licence_number: 'LIC123' // Tests string
      };
      return null;
    });

    render(<SettingsPage onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('Driver information')).toBeInTheDocument();

      // Check object formatting (JSON.stringify)
      expect(screen.getByText('{"code":"+44","num":"123"}')).toBeInTheDocument();

      // Check null/undefined formatting (Both become "Not provided")
      const notProvidedElements = screen.getAllByText('Not provided');
      expect(notProvidedElements.length).toBeGreaterThanOrEqual(2);

      // Check boolean formatting
      expect(screen.getByText('Yes')).toBeInTheDocument();
      expect(screen.getByText('No')).toBeInTheDocument();

      // Check string formatting
      expect(screen.getByText('LIC123')).toBeInTheDocument();

      // Check label formatting (`prettyLabel` utility)
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Vehicle Registration')).toBeInTheDocument();
    });
  });

  it('extracts profile correctly if the API returns an array', async () => {
    vi.mocked(apiFetch).mockImplementation(async (url) => {
      // Sometimes APIs wrap single objects in arrays, the component expects to handle this
      if (url === 'users/me') return [{ first_name: 'CharlieArray' }];
      if (url === 'drivers/me') throw new Error('Not a driver');
      return null;
    });

    render(<SettingsPage onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('CharlieArray')).toBeInTheDocument();
    });
  });

  it('shows a specific error message if fetching the main profile fails', async () => {
    vi.mocked(apiFetch).mockImplementation(async (url) => {
      if (url === 'users/me') throw new Error('Custom API Error');
      return null;
    });

    render(<SettingsPage onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('Custom API Error')).toBeInTheDocument();
    });
  });

  it('shows a default fallback error message if fetching fails with a non-Error object', async () => {
    vi.mocked(apiFetch).mockImplementation(async (url) => {
      if (url === 'users/me') throw 'Just a string error with no message property';
      return null;
    });

    render(<SettingsPage onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load settings')).toBeInTheDocument();
    });
  });

  it('displays the empty state fallback if profile data is strictly null', async () => {
    vi.mocked(apiFetch).mockImplementation(async (url) => {
      if (url === 'users/me') return null;
      if (url === 'drivers/me') return null;
      return null;
    });

    render(<SettingsPage onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText('No profile information found.')).toBeInTheDocument();
    });
  });

  it('calls onBack when the back button is clicked', async () => {
    vi.mocked(apiFetch).mockImplementation(async () => ({}));

    render(<SettingsPage onBack={mockOnBack} />);

    // Wait for the load to finish to avoid React act() state update warnings
    await waitFor(() => {
      expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: 'Back' });
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});