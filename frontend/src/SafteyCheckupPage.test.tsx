import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SafetyCheckupPage from './SafetyCheckupPage';
import { apiFetch } from './lib/api';

vi.mock('./lib/api', () => ({
  apiFetch: vi.fn(),
}));

describe('SafetyCheckupPage Component', () => {
  const mockOnBack = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear localStorage before each test to ensure a clean state
    window.localStorage.clear();
  });

  it('calls onBack when the back button is clicked from the main view', () => {
    render(<SafetyCheckupPage onBack={mockOnBack} />);

    const backButton = screen.getByRole('button', { name: 'Back' });
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('navigates to Safety Help and back', () => {
    render(<SafetyCheckupPage onBack={mockOnBack} />);

    // Click into Safety help
    fireEvent.click(screen.getByText('Learn how to get help during a trip'));

    expect(screen.getByText('Open the Safety Toolkit')).toBeInTheDocument();

    // Verify onBack was not called, we are just navigating internally
    expect(mockOnBack).not.toHaveBeenCalled();

    // Go back to main menu
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText('To help keep yourself safe on every trip, review your current safety settings.')).toBeInTheDocument();
  });

  it('navigates to Driver Safety Standards and uses "Got it" button to go back', () => {
    render(<SafetyCheckupPage onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Learn about our safety standards for drivers'));

    expect(screen.getByText('Driver screening')).toBeInTheDocument();
    expect(screen.getByText('Real-time ID check')).toBeInTheDocument();

    // Click the "Got it" button
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));

    // Verify we are back on the main view
    expect(screen.getByText('Safety settings')).toBeInTheDocument();
  });

  it('toggles RideCheck and saves to localStorage', () => {
    const { container } = render(<SafetyCheckupPage onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('RideCheck'));

    expect(screen.getByText("What's a RideCheck?")).toBeInTheDocument();

    const toggle = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(toggle).not.toBeNull();
    expect(toggle.checked).toBe(false);

    // Toggle on
    fireEvent.click(toggle);
    expect(toggle.checked).toBe(true);
    expect(window.localStorage.getItem('rideCheckEnabled')).toBe('true');

    // Toggle off
    fireEvent.click(toggle);
    expect(toggle.checked).toBe(false);
    expect(window.localStorage.getItem('rideCheckEnabled')).toBe('false');
  });

  it('toggles PIN Verification, generates a PIN, and saves to localStorage', () => {
    const { container } = render(<SafetyCheckupPage onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('PIN verification'));

    expect(screen.getByText('Verify your trips')).toBeInTheDocument();

    const toggle = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

    // Toggle on
    fireEvent.click(toggle);
    expect(toggle.checked).toBe(true);
    expect(window.localStorage.getItem('pinEnabled')).toBe('true');

    // Expect a PIN to be generated and saved
    const savedPin = window.localStorage.getItem('pinCode');
    expect(savedPin).toMatch(/^[0-9]{4}$/); // Matches 4 digit PIN
    expect(screen.getByText(savedPin as string)).toBeInTheDocument();

    // Toggle off
    fireEvent.click(toggle);
    expect(toggle.checked).toBe(false);
    expect(window.localStorage.getItem('pinEnabled')).toBe('false');
    expect(window.localStorage.getItem('pinCode')).toBeNull();
  });

  it('allows adding a trusted contact and setting them as primary', async () => {
    render(<SafetyCheckupPage onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Trusted contacts'));

    expect(screen.getByText('No trusted contacts yet.')).toBeInTheDocument();

    // Open Add Contact Modal
    fireEvent.click(screen.getByRole('button', { name: 'Add contact' }));

    expect(screen.getByText('Add trusted contact')).toBeInTheDocument();

    // Fill form
    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '07700900000' } });
    fireEvent.change(screen.getByLabelText('Email (optional)'), { target: { value: 'john@example.com' } });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    await waitFor(() => {
      // Check if added to UI
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('07700900000')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      // First contact defaults to Primary
      expect(screen.getByText('Primary')).toBeInTheDocument();
    });

    // Check localStorage
    const savedContacts = JSON.parse(window.localStorage.getItem('trustedContacts') || '[]');
    expect(savedContacts).toHaveLength(1);
    expect(savedContacts[0].firstName).toBe('John');
    expect(savedContacts[0].isPrimary).toBe(true);
  });

  it('loads trusted contacts from the account profile when available', async () => {
    window.localStorage.setItem('authToken', 'fake-token');
    vi.mocked(apiFetch).mockResolvedValueOnce([
      {
        trusted_contacts: [
          { id: '1', firstName: 'Amy', lastName: 'Pond', phone: '07123456789', isPrimary: true },
        ],
      },
    ]);

    render(<SafetyCheckupPage onBack={mockOnBack} />);
    fireEvent.click(screen.getByText('Trusted contacts'));

    await waitFor(() => {
      expect(screen.getByText('Amy Pond')).toBeInTheDocument();
    });
  });

  it('disables the Add Contact button if required fields are missing', () => {
    render(<SafetyCheckupPage onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Trusted contacts'));
    fireEvent.click(screen.getByRole('button', { name: 'Add contact' }));

    const addButton = screen.getByRole('button', { name: 'Add' });
    expect(addButton).toBeDisabled();

    // Only typing first name shouldn't enable it
    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'John' } });
    expect(addButton).toBeDisabled();

    // Filling out all required fields enables it
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '123' } });
    expect(addButton).not.toBeDisabled();
  });

  it('can remove a trusted contact and auto-assigns a new primary if available', async () => {
    // Seed localStorage with two contacts
    const mockContacts = [
      { id: '1', firstName: 'Alice', lastName: 'A', phone: '111', isPrimary: true },
      { id: '2', firstName: 'Bob', lastName: 'B', phone: '222', isPrimary: false },
    ];
    window.localStorage.setItem('trustedContacts', JSON.stringify(mockContacts));

    render(<SafetyCheckupPage onBack={mockOnBack} />);
    fireEvent.click(screen.getByText('Trusted contacts'));

    expect(screen.getByText('Alice A')).toBeInTheDocument();
    expect(screen.getByText('Bob B')).toBeInTheDocument();

    // Both contacts render "Remove" buttons, we want the one belonging to Alice (Primary)
    const removeButtons = screen.getAllByRole('button', { name: 'Remove' });

    // Remove Alice
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Alice A')).not.toBeInTheDocument();
      expect(screen.getByText('Bob B')).toBeInTheDocument();
    });

    // Check if Bob automatically became the new primary
    const savedContacts = JSON.parse(window.localStorage.getItem('trustedContacts') || '[]');
    expect(savedContacts).toHaveLength(1);
    expect(savedContacts[0].firstName).toBe('Bob');
    expect(savedContacts[0].isPrimary).toBe(true);
  });

  it('allows manually setting a different contact as primary', async () => {
    const mockContacts = [
      { id: '1', firstName: 'Alice', lastName: 'A', phone: '111', isPrimary: true },
      { id: '2', firstName: 'Bob', lastName: 'B', phone: '222', isPrimary: false },
    ];
    window.localStorage.setItem('trustedContacts', JSON.stringify(mockContacts));

    render(<SafetyCheckupPage onBack={mockOnBack} />);
    fireEvent.click(screen.getByText('Trusted contacts'));

    // The "Set primary" button for Bob (second one) should be enabled
    const setPrimaryButtons = screen.getAllByRole('button', { name: 'Set primary' });
    expect(setPrimaryButtons[1]).not.toBeDisabled();

    fireEvent.click(setPrimaryButtons[1]);

    await waitFor(() => {
      const savedContacts = JSON.parse(window.localStorage.getItem('trustedContacts') || '[]');
      const alice = savedContacts.find((c: any) => c.firstName === 'Alice');
      const bob = savedContacts.find((c: any) => c.firstName === 'Bob');

      expect(alice.isPrimary).toBe(false);
      expect(bob.isPrimary).toBe(true);
    });
  });

  it('closes the Add Contact modal when cancel is clicked', () => {
    render(<SafetyCheckupPage onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Trusted contacts'));
    fireEvent.click(screen.getByRole('button', { name: 'Add contact' }));

    expect(screen.getByText('Add trusted contact')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByText('Add trusted contact')).not.toBeInTheDocument();
  });
});
