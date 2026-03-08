import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AccountPage from './AccountPage';
import { apiFetch } from './lib/api';

vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

describe('AccountPage Component', () => {
  const mockProps = {
    onLogout: vi.fn(),
    onOpenSettings: vi.fn(),
    onOpenTimetable: vi.fn(),
    onOpenSafetyCheckup: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    const store: Record<string, string> = {
      authToken: 'fake-jwt-token',
      trustedContacts: JSON.stringify([{ id: '1', firstName: 'Jane', lastName: 'Doe', phone: '07123456789', isPrimary: true }])
    };

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] || null);

    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
  });

  it('fetches and displays user profile successfully', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([{
      first_name: 'Alex',
      last_name: 'Smith',
      rider_rating: 4.85
    }]);

    render(<AccountPage {...mockProps} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Alex Smith')).toBeInTheDocument();
      expect(screen.getByText('★ 4.85')).toBeInTheDocument();
    });
  });

  it('opens the safety toolkit modal when the safety alarm is clicked', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 5.0 }]);

    render(<AccountPage {...mockProps} />);

    fireEvent.click(screen.getByText('Safety Alarm'));

    expect(screen.getByText('Safety Toolkit')).toBeInTheDocument();
    expect(screen.getByText('Call your trusted contact (Jane Doe)')).toBeInTheDocument();
  });

  it('handles API fetch error gracefully', async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('Network error'));

    render(<AccountPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Unknown User')).toBeInTheDocument();
      expect(screen.getByText('★ N/A')).toBeInTheDocument();
    });
  });

  it('handles empty API response gracefully', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([]);

    render(<AccountPage {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Unknown User')).toBeInTheDocument();
    });
  });

  it('calls onOpenSettings when Settings is clicked', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 4.0 }]);
    render(<AccountPage {...mockProps} />);

    fireEvent.click(screen.getByText('Settings'));
    expect(mockProps.onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenTimetable when timetable card is clicked', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 4.0 }]);
    render(<AccountPage {...mockProps} />);

    fireEvent.click(screen.getByText('Your timetable'));
    expect(mockProps.onOpenTimetable).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenSafetyCheckup when safety check-up card is clicked', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 4.0 }]);
    render(<AccountPage {...mockProps} />);

    fireEvent.click(screen.getByText('Safety check-up'));
    expect(mockProps.onOpenSafetyCheckup).toHaveBeenCalledTimes(1);
  });

  it('calls logout endpoint and triggers onLogout', async () => {
    vi.mocked(apiFetch).mockResolvedValue([{ first_name: 'Alex', rider_rating: 4.0 }]);
    render(<AccountPage {...mockProps} />);

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith('auth/logout', { method: 'POST' });
      expect(mockProps.onLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('still calls onLogout if logout API throws', async () => {
    vi.mocked(apiFetch)
      .mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 4.0 }])
      .mockRejectedValueOnce(new Error('Logout failed'));

    render(<AccountPage {...mockProps} />);

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(mockProps.onLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('calls 999 when Call 999 button is clicked in safety toolkit', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 4.0 }]);
    render(<AccountPage {...mockProps} />);

    fireEvent.click(screen.getByText('Safety Alarm'));
    fireEvent.click(screen.getByText('Call 999'));

    expect(window.location.href).toBe('tel:999');
  });

  it('calls trusted contact when button is clicked in safety toolkit', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 4.0 }]);
    render(<AccountPage {...mockProps} />);

    fireEvent.click(screen.getByText('Safety Alarm'));
    fireEvent.click(screen.getByText('Call your trusted contact (Jane Doe)'));

    expect(window.location.href).toBe('tel:07123456789');
  });

  it('calls campus security when button is clicked in safety toolkit', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 4.0 }]);
    render(<AccountPage {...mockProps} />);

    fireEvent.click(screen.getByText('Safety Alarm'));
    fireEvent.click(screen.getByText('Call campus security (01225 383999)'));

    expect(window.location.href).toBe('tel:01225383999');
  });

  it('closes safety toolkit when Close is clicked', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 4.0 }]);
    render(<AccountPage {...mockProps} />);

    fireEvent.click(screen.getByText('Safety Alarm'));
    expect(screen.getByText('Safety Toolkit')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('Safety Toolkit')).not.toBeInTheDocument();
  });

  it('closes safety toolkit when backdrop is clicked', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 4.0 }]);
    render(<AccountPage {...mockProps} />);

    fireEvent.click(screen.getByText('Safety Alarm'));
    fireEvent.click(document.querySelector('.modal-backdrop')!);

    expect(screen.queryByText('Safety Toolkit')).not.toBeInTheDocument();
  });

  it('disables trusted contact button when no trusted contacts exist', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'authToken') return 'fake-jwt-token';
      if (key === 'trustedContacts') return JSON.stringify([]);
      return null;
    });

    vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 4.0 }]);
    render(<AccountPage {...mockProps} />);

    fireEvent.click(screen.getByText('Safety Alarm'));

    const contactBtn = screen.getByText(/Call your trusted contact$/);
    expect(contactBtn).toBeDisabled();
  });

  describe('Edge Cases & Accessibility', () => {
    it('handles keyboard events for InfoCard accessibility', async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 4.0 }]);
      render(<AccountPage {...mockProps} />);

      const timetableCard = screen.getByText('Your timetable').closest('.info-card');
      expect(timetableCard).toBeInTheDocument();

      // Ignore random keys
      fireEvent.keyDown(timetableCard!, { key: 'A' });
      expect(mockProps.onOpenTimetable).not.toHaveBeenCalled();

      // Trigger on Enter
      fireEvent.keyDown(timetableCard!, { key: 'Enter' });
      expect(mockProps.onOpenTimetable).toHaveBeenCalledTimes(1);

      // Trigger on Space
      fireEvent.keyDown(timetableCard!, { key: ' ' });
      expect(mockProps.onOpenTimetable).toHaveBeenCalledTimes(2);
    });

    it('displays "No rating" if the user has a rating of 0, null, or undefined', async () => {
      vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 0 }]);
      render(<AccountPage {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('★ No rating')).toBeInTheDocument();
      });
    });

    it('gracefully handles invalid JSON in trustedContacts', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
        if (key === 'authToken') return 'fake-jwt-token';
        if (key === 'trustedContacts') return '{ invalid: json ]';
        return null;
      });

      vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 4.0 }]);
      render(<AccountPage {...mockProps} />);

      fireEvent.click(screen.getByText('Safety Alarm'));
      // Should default to disabled call button
      const contactBtn = screen.getByText(/Call your trusted contact/);
      expect(contactBtn).toBeDisabled();
    });

    it('uses the first contact if no contact is marked as primary', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
        if (key === 'authToken') return 'fake-jwt-token';
        if (key === 'trustedContacts') return JSON.stringify([{ id: '1', firstName: 'John', lastName: 'Doe', phone: '07000000000' }]);
        return null;
      });

      vi.mocked(apiFetch).mockResolvedValueOnce([{ first_name: 'Alex', rider_rating: 4.0 }]);
      render(<AccountPage {...mockProps} />);

      fireEvent.click(screen.getByText('Safety Alarm'));
      expect(screen.getByText('Call your trusted contact (John Doe)')).toBeInTheDocument();
    });
  });
});