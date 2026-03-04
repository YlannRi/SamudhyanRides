// src/AccountPage.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AccountPage from './AccountPage';
import { apiFetch } from './lib/api';

// Mock the custom API fetcher
vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

describe('AccountPage Component', () => {
  // Dummy
  const mockProps = {
    onLogout: vi.fn(),
    onOpenSettings: vi.fn(),
    onOpenTimetable: vi.fn(),
    onOpenSafetyCheckup: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks(); // Clear history between tests

    // Mock localStorage
    const store: Record<string, string> = {
      authToken: 'fake-jwt-token',
      trustedContacts: JSON.stringify([{ id: '1', firstName: 'Jane', lastName: 'Doe', phone: '07123456789', isPrimary: true }])
    };

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] || null);

    // Mock window.location (to prevent test crashes when calling tel:)
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
  });

  it('fetches and displays user profile successfully', async () => {
    // Tell the mocked API what to return
    vi.mocked(apiFetch).mockResolvedValueOnce([{
      first_name: 'Alex',
      last_name: 'Smith',
      rider_rating: 4.85
    }]);

    render(<AccountPage {...mockProps} />);

    // Initially, it should say Loading
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for the API call to resolve and the UI to update
    await waitFor(() => {
      expect(screen.getByText('Alex Smith')).toBeInTheDocument();
      expect(screen.getByText('★ 4.85')).toBeInTheDocument();
    });
  });

  it('opens the safety toolkit modal when the safety alarm is clicked', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 5.0 }]);

    render(<AccountPage {...mockProps} />);

    // Find and click the Safety Alarm button
    const safetyButton = screen.getByText('Safety Alarm');
    fireEvent.click(safetyButton);

    // The modal should now be visible
    expect(screen.getByText('Safety Toolkit')).toBeInTheDocument();
    expect(screen.getByText('Call your trusted contact (Jane Doe)')).toBeInTheDocument();
  });
});