import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DriverSignupPage from './DriverSignupPage';
import { apiFetch } from './lib/api';

// Mock the API module
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
    // Provide a safe default mock so background validation calls never throw unhandled rejections
    vi.mocked(apiFetch).mockImplementation(async () => ({}));
  });

  afterEach(() => {
    // Ensure timers are always reset, even if a test fails midway
    vi.useRealTimers();
  });

  // Helper to fill all required fields correctly to bypass validation errors
  const fillValidForm = () => {
    fireEvent.change(screen.getByLabelText(/^First name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/^Last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Email or university username/i), { target: { value: 'john@bath.ac.uk' } });
    fireEvent.change(screen.getByLabelText(/Date of birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/Phone number/i), { target: { value: '+447911123456' } });
    fireEvent.change(screen.getByLabelText(/Residential address/i), { target: { value: '123 Fake Street Bath BA2' } });
    fireEvent.change(screen.getByLabelText(/Government ID number/i), { target: { value: 'P1234567' } });

    const dummyFile = new File([''], 'test.png', { type: 'image/png' });
    const fileInputs = [
      screen.getByLabelText(/ID document upload.*front/i),
      screen.getByLabelText(/ID document upload.*back/i),
      screen.getByLabelText(/Selfie for identification/i)
    ];
    fileInputs.forEach(input => fireEvent.change(input, { target: { files: [dummyFile] } }));

    fireEvent.change(screen.getByLabelText(/Licence number/i), { target: { value: 'MORGA657054SM9IJ' } });
    fireEvent.change(screen.getByLabelText(/Vehicle make/i), { target: { value: 'Toyota' } });
    fireEvent.change(screen.getByLabelText(/^Model/i), { target: { value: 'Yaris' } });
    fireEvent.change(screen.getByLabelText(/^Year/i), { target: { value: '2015' } });
    fireEvent.change(screen.getByLabelText(/License plate/i), { target: { value: 'AB12 CDE' } });
  };

  it('renders the form and handles the back button', () => {
    render(<DriverSignupPage {...mockProps} />);
    expect(screen.getByText('Driver sign-up')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(mockProps.onBack).toHaveBeenCalledTimes(1);
  });

  it('pre-fills data from localStorage on mount', () => {
    localStorage.setItem(
      'driverSignupDraft',
      JSON.stringify({ firstName: 'John', lastName: 'Smith', emailOrUsername: 'js123' })
    );
    localStorage.setItem(
      'driverApplication',
      JSON.stringify({
        driver: { phone_number: '+447000000000', address: 'Saved Address 123' },
        vehicle: { make: 'Honda', year: 2018 },
      })
    );

    render(<DriverSignupPage {...mockProps} />);

    expect(screen.getByLabelText(/^First name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/^Last name/i)).toHaveValue('Smith');
    expect(screen.getByLabelText(/Email or university username/i)).toHaveValue('js123');
    expect(screen.getByLabelText(/Phone number/i)).toHaveValue('+447000000000');
    expect(screen.getByLabelText(/Residential address/i)).toHaveValue('Saved Address 123');
    expect(screen.getByLabelText(/Vehicle make/i)).toHaveValue('Honda');
    expect(screen.getByLabelText(/^Year/i)).toHaveValue(2018);
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    // Tests the try/catch branch inside safeJsonParse
    localStorage.setItem('driverSignupDraft', '{invalid-json');
    localStorage.setItem('driverApplication', '{invalid-json');

    render(<DriverSignupPage {...mockProps} />);

    // Should fallback to empty string defaults without throwing
    expect(screen.getByLabelText(/^First name/i)).toHaveValue('');
  });

  describe('Field Validations', () => {
    const testValidation = async (labelRegex: RegExp, invalidValue: string, expectedError: string) => {
      render(<DriverSignupPage {...mockProps} />);
      const input = screen.getByLabelText(labelRegex);
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: invalidValue } });
      fireEvent.blur(input);

      // Force dependency update for useEffect
      fireEvent.change(input, { target: { value: invalidValue + 'a' } });
      fireEvent.change(input, { target: { value: invalidValue } });

      expect(await screen.findByText(expectedError)).toBeInTheDocument();
    };

    it('validates email/username format', async () => {
      await testValidation(/Email or university username/i, 'invalid-email', 'Use an email (you@bath.ac.uk) or a username (abc123).');
    });

    it('accepts valid university username', async () => {
      render(<DriverSignupPage {...mockProps} />);
      const username = screen.getByLabelText(/Email or university username/i);
      fireEvent.change(username, { target: { value: 'abc12' } });
      fireEvent.blur(username);
      await waitFor(() => {
        expect(screen.queryByText('Use an email (you@bath.ac.uk) or a username (abc123).')).not.toBeInTheDocument();
      });
    });

    it('validates minimum age (under 17)', async () => {
      const thisYear = new Date().getFullYear();
      await testValidation(/Date of birth/i, `${thisYear - 10}-01-01`, 'You must be at least 17 years old to be a driver.');
    });

    it('validates maximum age (over 100)', async () => {
      await testValidation(/Date of birth/i, `1900-01-01`, 'Please check your date of birth.');
    });

    it('validates phone number format', async () => {
      await testValidation(/Phone number/i, '123', 'Use digits only (optionally +), 7–15 digits (e.g. +447911123456).');
    });

    it('validates address length', async () => {
      await testValidation(/Residential address/i, 'Short', 'Please enter a full address (include postcode).');
    });

    it('validates government ID length', async () => {
      await testValidation(/Government ID number/i, '123', 'Government ID number looks too short.');
    });

    it('validates license length', async () => {
      await testValidation(/Licence number/i, 'SHORT', 'Must be 16 characters (spaces ignored).');
    });

    it('validates vehicle year bounds', async () => {
      await testValidation(/^Year/i, '1970', `Year must be between 1980 and ${new Date().getFullYear() + 1}.`);
    });

    it('validates non-integer vehicle year', async () => {
      await testValidation(/^Year/i, '2020.5', 'Year must be a whole number.');
    });

    it('validates UK license plate format', async () => {
      await testValidation(/License plate/i, 'INVALID_PLATE', 'Invalid UK plate format (e.g. AB12 CDE).');
    });

    it('validates IBAN format', async () => {
      await testValidation(/IBAN/i, '1234', 'Invalid IBAN format.');
    });

    it('accepts valid IBAN format', async () => {
      render(<DriverSignupPage {...mockProps} />);
      const iban = screen.getByLabelText(/IBAN \(optional\)/i);
      fireEvent.change(iban, { target: { value: 'GB29NWBK60161331926819' } });
      fireEvent.blur(iban);
      fireEvent.change(iban, { target: { value: 'GB29 NWBK 6016 1331 9268 19' } });
      await waitFor(() => {
        expect(screen.queryByText('Invalid IBAN format.')).not.toBeInTheDocument();
      });
    });
  });

  describe('Optional Fields Coverage', () => {
    it('triggers onChange and onBlur for all remaining optional fields', () => {
      render(<DriverSignupPage {...mockProps} />);

      const textFields = [
        { label: /Middle names \(optional\)/i, value: 'Mid' },
        { label: /Licence country/i, value: 'UK' },
        { label: /Licence type/i, value: 'Full' },
        { label: /Color \(optional\)/i, value: 'Blue' },
        { label: /Registration country \(optional\)/i, value: 'UK' },
        { label: /Insurance policy number \(optional\)/i, value: 'POL123' },
        { label: /Bank account holder name \(optional\)/i, value: 'John' },
        { label: /Bank name \(optional\)/i, value: 'Monzo' },
        { label: /Tax information \(optional\)/i, value: 'Tax' },
      ];

      textFields.forEach(({ label, value }) => {
        const input = screen.getByLabelText(label);
        fireEvent.change(input, { target: { value } });
        fireEvent.blur(input);
        expect(input).toHaveValue(value);
      });

      const fileInputs = [
        /Licence photo \(optional\)/i,
        /Vehicle photo — front \(optional\)/i,
        /Vehicle photo — back \(optional\)/i,
        /Vehicle photo — interior \(optional\)/i,
      ];

      const dummyFile = new File([''], 'test.png', { type: 'image/png' });

      fileInputs.forEach((label) => {
        const input = screen.getByLabelText(label);
        fireEvent.change(input, { target: { files: [dummyFile] } });
        fireEvent.blur(input);
      });
    });

    it('marks touched text, file, and optional date fields without leaving false validation errors', async () => {
      render(<DriverSignupPage {...mockProps} />);

      const firstName = screen.getByLabelText(/^First name/i);
      fireEvent.blur(firstName);
      fireEvent.change(firstName, { target: { value: 'J' } });
      fireEvent.change(firstName, { target: { value: '' } });

      const lastName = screen.getByLabelText(/^Last name/i);
      fireEvent.blur(lastName);
      fireEvent.change(lastName, { target: { value: 'D' } });
      fireEvent.change(lastName, { target: { value: '' } });

      const dummyFile = new File([''], 'id.png', { type: 'image/png' });
      const requiredFileFields = [
        /ID document upload.*front/i,
        /ID document upload.*back/i,
        /Selfie for identification/i,
      ];

      requiredFileFields.forEach((label) => {
        const input = screen.getByLabelText(label);
        fireEvent.blur(input);
        fireEvent.change(input, { target: { files: [dummyFile] } });
        fireEvent.change(input, { target: { files: [] } });
      });

      const licenseExpiry = screen.getByLabelText(/^Expiry date \(optional\)$/i);
      fireEvent.blur(licenseExpiry);
      fireEvent.change(licenseExpiry, { target: { value: '2027-01-01' } });
      fireEvent.change(licenseExpiry, { target: { value: '' } });

      const insuranceExpiry = screen.getByLabelText(/^Insurance expiry date \(optional\)$/i);
      fireEvent.blur(insuranceExpiry);
      fireEvent.change(insuranceExpiry, { target: { value: '2027-01-01' } });
      fireEvent.change(insuranceExpiry, { target: { value: '' } });

      await waitFor(() => {
        expect(screen.getByText('First name is required.')).toBeInTheDocument();
        expect(screen.getByText('Last name is required.')).toBeInTheDocument();
        expect(screen.getByText('Front image/PDF is required.')).toBeInTheDocument();
        expect(screen.getByText('Back image/PDF is required.')).toBeInTheDocument();
        expect(screen.getByText('Selfie is required.')).toBeInTheDocument();
        expect(screen.queryByText('Invalid expiry date.')).not.toBeInTheDocument();
        expect(screen.queryByText('Invalid insurance expiry date.')).not.toBeInTheDocument();
      });
    });
  });

  describe('Debounced Server Validation', () => {
    it('calls the validation API and sets server errors after typing license number', async () => {
      vi.useFakeTimers();

      // Robust routing to prevent timer race conditions grabbing the wrong mock
      vi.mocked(apiFetch).mockImplementation(async (url) => {
        if (url.includes('validate')) {
          return { field_errors: { licence_number: 'License not found in server', vehicle_registration: 'Plate not found' } };
        }
        return {};
      });

      render(<DriverSignupPage {...mockProps} />);

      const licenseInput = screen.getByLabelText(/Licence number/i);
      const plateInput = screen.getByLabelText(/License plate/i);

      fireEvent.change(licenseInput, { target: { value: 'A1B2C3D4E5F6G7H8' } });
      fireEvent.blur(licenseInput);
      fireEvent.change(plateInput, { target: { value: 'AB12 CDE' } });
      fireEvent.blur(plateInput);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Restore real timers BEFORE waitFor, otherwise waitFor stalls!
      vi.useRealTimers();

      await waitFor(() => {
        expect(apiFetch).toHaveBeenCalledWith('drivers/validate', expect.objectContaining({ method: 'POST' }));
        expect(screen.getByText('License not found in server')).toBeInTheDocument();
        expect(screen.getByText('Plate not found')).toBeInTheDocument();
      });
    });

    it('blocks submission while server validation errors are still present', async () => {
      vi.useFakeTimers();

      vi.mocked(apiFetch).mockImplementation(async (url) => {
        if (url.includes('validate')) {
          return { field_errors: { vehicle_registration: 'Plate not found' } };
        }
        return {};
      });

      render(<DriverSignupPage {...mockProps} />);
      fillValidForm();

      const licenseInput = screen.getByLabelText(/Licence number/i);
      const plateInput = screen.getByLabelText(/License plate/i);
      fireEvent.blur(licenseInput);
      fireEvent.blur(plateInput);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      vi.useRealTimers();

      await waitFor(() => {
        expect(screen.getByText('Plate not found')).toBeInTheDocument();
      });

      const form = screen.getByRole('button', { name: 'Submit driver application' }).closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Please fix the highlighted fields.')).toBeInTheDocument();
      });

      expect(apiFetch).not.toHaveBeenCalledWith('drivers/upgrade', expect.anything());
    });

    it('clears server errors if the debounce validation fails (catch block)', async () => {
      vi.useFakeTimers();

      vi.mocked(apiFetch).mockImplementation(async (url) => {
        if (url.includes('validate')) throw new Error('Network error');
        return {};
      });

      render(<DriverSignupPage {...mockProps} />);

      const licenseInput = screen.getByLabelText(/Licence number/i);
      fireEvent.change(licenseInput, { target: { value: 'A1B2C3D4E5F6G7H8' } });
      fireEvent.blur(licenseInput);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      vi.useRealTimers();

      await waitFor(() => {
        expect(apiFetch).toHaveBeenCalledWith('drivers/validate', expect.anything());
        // Since it caught an error, it shouldn't crash and should clear errors internally
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });

    it('bypasses server validation if fields are emptied out to whitespace', async () => {
      vi.useFakeTimers();
      render(<DriverSignupPage {...mockProps} />);

      const licenseInput = screen.getByLabelText(/Licence number/i);
      fireEvent.change(licenseInput, { target: { value: '   ' } });
      fireEvent.blur(licenseInput);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      vi.useRealTimers();

      // The early return branch should prevent the API call
      expect(apiFetch).not.toHaveBeenCalledWith('drivers/validate', expect.anything());
    });
  });

  describe('Form Submission', () => {
    it('submits successfully when form is valid', async () => {
      vi.mocked(apiFetch).mockImplementation(async () => ({}));

      render(<DriverSignupPage {...mockProps} />);
      fillValidForm();

      // Simulate a file cancellation to cover empty file branches (`?.name ?? null`)
      fireEvent.change(screen.getByLabelText(/Vehicle photo — interior/i), { target: { files: [] } });

      const form = screen.getByRole('button', { name: 'Submit driver application' }).closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(apiFetch).toHaveBeenCalledWith('drivers/upgrade', expect.any(Object));
        expect(screen.getByText('Saved. Your driver application is now pending verification.')).toBeInTheDocument();
        expect(mockProps.onComplete).toHaveBeenCalled();
      });
    });

    it('prevents submission if required fields are empty', async () => {
      render(<DriverSignupPage {...mockProps} />);

      const form = screen.getByRole('button', { name: 'Submit driver application' }).closest('form')!;
      fireEvent.submit(form);

      expect(await screen.findByText('Please fix the highlighted fields.')).toBeInTheDocument();
      expect(screen.getByText('First name is required.')).toBeInTheDocument();
      expect(apiFetch).not.toHaveBeenCalled();
    });

    it('handles server errors returning specific field issues during submission', async () => {
      vi.mocked(apiFetch).mockImplementation(async (url) => {
        if (url.includes('upgrade')) {
          throw { detail: { field_errors: { vehicle_registration: 'Plate already registered' } } };
        }
        return {};
      });

      render(<DriverSignupPage {...mockProps} />);
      fillValidForm();

      const form = screen.getByRole('button', { name: 'Submit driver application' }).closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Plate already registered')).toBeInTheDocument();
        expect(screen.getByText('Please fix the highlighted fields.')).toBeInTheDocument();
      });
    });

    it('handles general server errors during submission', async () => {
      vi.mocked(apiFetch).mockImplementation(async (url) => {
        if (url.includes('upgrade')) {
          throw { message: 'Internal Server Error. Please try again later.' };
        }
        return {};
      });

      render(<DriverSignupPage {...mockProps} />);
      fillValidForm();

      const form = screen.getByRole('button', { name: 'Submit driver application' }).closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Internal Server Error. Please try again later.')).toBeInTheDocument();
      });
    });

    it('handles submission empty fallback errors lacking a message payload', async () => {
      vi.mocked(apiFetch).mockImplementation(async (url) => {
        if (url.includes('upgrade')) throw {};
        return {};
      });

      render(<DriverSignupPage {...mockProps} />);
      fillValidForm();

      const form = screen.getByRole('button', { name: 'Submit driver application' }).closest('form')!;
      fireEvent.submit(form);

      await waitFor(() => {
        expect(screen.getByText('Driver signup failed. Please check your details and try again.')).toBeInTheDocument();
      });
    });
  });
});
