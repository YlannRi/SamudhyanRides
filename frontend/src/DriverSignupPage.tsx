import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { apiFetch } from './lib/api';

const BackIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

export type DriverSignupDraft = {
  firstName: string;
  middleNames: string;
  lastName: string;
  emailOrUsername: string;
};

type DriverSignupPageProps = {
  onBack: () => void;
  onComplete: () => void;
};

const SIGNUP_DRAFT_KEY = 'driverSignupDraft';
const DRIVER_APPLICATION_KEY = 'driverApplication';

const safeJsonParse = <T,>(raw: string | null): T | null => {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const isLikelyEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isLikelyUniUsername = (v: string) => /^[a-z]{3,6}\d{1,4}$/i.test(v.trim()); // e.g. abc123
const isE164ish = (v: string) => /^\+?[0-9]{7,15}$/.test(v.replace(/\s+/g, ''));
const isUkPlateish = (v: string) => /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/.test(v.replace(/\s+/g, '').toUpperCase());

const calcAge = (isoDate: string): number | null => {
  if (!isoDate) return null;
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
};

type FieldKey =
  | 'firstName'
  | 'middleNames'
  | 'lastName'
  | 'emailOrUsername'
  | 'dateOfBirth'
  | 'phoneNumber'
  | 'address'
  | 'governmentIdNumber'
  | 'idFront'
  | 'idBack'
  | 'selfie'
  | 'licenseNumber'
  | 'licenseCountry'
  | 'licenseType'
  | 'licenseExpiry'
  | 'licensePhoto'
  | 'vehicleMake'
  | 'vehicleModel'
  | 'vehicleYear'
  | 'vehicleColor'
  | 'licensePlate'
  | 'registrationCountry'
  | 'vehicleFront'
  | 'vehicleBack'
  | 'vehicleInterior'
  | 'insurancePolicyNumber'
  | 'insuranceExpiry'
  | 'accountHolderName'
  | 'bankName'
  | 'iban'
  | 'taxInfo';

const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div style={{ padding: '14px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{subtitle}</div>}
    </div>
    {children}
  </div>
);

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  error?: string | null;
}> = ({ label, value, onChange, onBlur, placeholder, type = 'text', required, disabled, hint, error }) => {
  const inputId = useId();
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errId = error ? `${inputId}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className="auth-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        type={type}
        required={required}
        aria-required={required || undefined}
        disabled={disabled}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
      />
      {hint && !error && (
        <div id={hintId} style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 12 }}>
          {hint}
        </div>
      )}
      {error && (
        <div id={errId} role="alert" style={{ marginTop: 6, color: '#f87171', fontSize: 12 }}>
          {error}
        </div>
      )}
    </div>
  );
};

const FileField: React.FC<{
  label: string;
  onPick: (file: File | null) => void;
  onBlur?: () => void;
  required?: boolean;
  hint?: string;
  error?: string | null;
}> = ({ label, onPick, onBlur, required, hint, error }) => {
  const inputId = useId();
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errId = error ? `${inputId}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="auth-field">
      <label className="auth-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className="auth-input"
        style={{ paddingTop: 10 }}
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        onBlur={onBlur}
        required={required}
        aria-required={required || undefined}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
      />
      {hint && !error && (
        <div id={hintId} style={{ marginTop: 6, color: 'var(--text-secondary)', fontSize: 12 }}>
          {hint}
        </div>
      )}
      {error && (
        <div id={errId} role="alert" style={{ marginTop: 6, color: '#f87171', fontSize: 12 }}>
          {error}
        </div>
      )}
    </div>
  );
};

const DriverSignupPage: React.FC<DriverSignupPageProps> = ({ onBack, onComplete }) => {
  const draft = useMemo(() => {
    const fromStorage = safeJsonParse<DriverSignupDraft>(localStorage.getItem(SIGNUP_DRAFT_KEY));
    return (
      fromStorage ?? {
        firstName: '',
        middleNames: '',
        lastName: '',
        emailOrUsername: '',
      }
    );
  }, []);

  // Personal
  const [firstName, setFirstName] = useState(draft.firstName);
  const [middleNames, setMiddleNames] = useState(draft.middleNames);
  const [lastName, setLastName] = useState(draft.lastName);
  const [emailOrUsername, setEmailOrUsername] = useState(draft.emailOrUsername);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');

  // Verification
  const [governmentIdNumber, setGovernmentIdNumber] = useState('');
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);

  // Driver License
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseCountry, setLicenseCountry] = useState('');
  const [licenseType, setLicenseType] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [licensePhoto, setLicensePhoto] = useState<File | null>(null);

  // Vehicle
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [registrationCountry, setRegistrationCountry] = useState('');
  const [vehicleFront, setVehicleFront] = useState<File | null>(null);
  const [vehicleBack, setVehicleBack] = useState<File | null>(null);
  const [vehicleInterior, setVehicleInterior] = useState<File | null>(null);
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');

  // Payout
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [iban, setIban] = useState('');
  const [taxInfo, setTaxInfo] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});

  const validateField = (key: FieldKey): string | null => {
    switch (key) {
      case 'firstName':
        return firstName.trim() ? null : 'First name is required.';
      case 'lastName':
        return lastName.trim() ? null : 'Last name is required.';
      case 'emailOrUsername': {
        const v = emailOrUsername.trim();
        if (!v) return 'Email or university username is required.';
        if (!isLikelyEmail(v) && !isLikelyUniUsername(v)) return 'Use an email (you@bath.ac.uk) or a username (abc123).';
        return null;
      }
      case 'dateOfBirth': {
        if (!dateOfBirth) return 'Date of birth is required.';
        const age = calcAge(dateOfBirth);
        if (age === null) return 'Invalid date.';
        if (age < 17) return 'You must be at least 17 years old to be a driver.';
        if (age > 100) return 'Please check your date of birth.';
        return null;
      }
      case 'phoneNumber': {
        const v = phoneNumber.trim();
        if (!v) return 'Phone number is required.';
        if (!isE164ish(v)) return 'Use digits only (optionally +), 7–15 digits (e.g. +447911123456).';
        return null;
      }
      case 'address': {
        const v = address.trim();
        if (!v) return 'Address is required.';
        if (v.length < 8) return 'Please enter a full address (include postcode).';
        return null;
      }
      case 'governmentIdNumber': {
        const v = governmentIdNumber.trim();
        if (!v) return 'Government ID number is required.';
        if (v.length < 5) return 'Government ID number looks too short.';
        return null;
      }
      case 'idFront':
        return idFront ? null : 'Front image/PDF is required.';
      case 'idBack':
        return idBack ? null : 'Back image/PDF is required.';
      case 'selfie':
        return selfie ? null : 'Selfie is required.';
      case 'licenseNumber': {
        const v = licenseNumber.trim();
        if (!v) return 'Driving licence number is required.';
        const compact = v.replace(/\s+/g, '').toUpperCase();
        if (compact.length !== 16) return 'Must be 16 characters (spaces ignored).';
        return null;
      }
      case 'licenseExpiry': {
        if (!licenseExpiry) return null;
        const d = new Date(licenseExpiry);
        if (Number.isNaN(d.getTime())) return 'Invalid expiry date.';
        return null;
      }
      case 'vehicleMake':
        return vehicleMake.trim() ? null : 'Vehicle make is required.';
      case 'vehicleModel':
        return vehicleModel.trim() ? null : 'Vehicle model is required.';
      case 'vehicleYear': {
        const v = vehicleYear.trim();
        if (!v) return 'Vehicle year is required.';
        const n = Number(v);
        if (!Number.isFinite(n) || !Number.isInteger(n)) return 'Year must be a whole number.';
        const currentYear = new Date().getFullYear();
        if (n < 1980 || n > currentYear + 1) return `Year must be between 1980 and ${currentYear + 1}.`;
        return null;
      }
      case 'licensePlate': {
        const v = licensePlate.trim();
        if (!v) return 'License plate is required.';
        if (!isUkPlateish(v)) return 'Invalid UK plate format (e.g. AB12 CDE).';
        return null;
      }
      case 'insuranceExpiry': {
        if (!insuranceExpiry) return null;
        const d = new Date(insuranceExpiry);
        if (Number.isNaN(d.getTime())) return 'Invalid insurance expiry date.';
        return null;
      }
      case 'iban': {
        if (!iban.trim()) return null;
        if (!/^([A-Z]{2}[0-9]{2}[A-Z0-9]{10,30})$/i.test(iban.replace(/\s+/g, ''))) return 'Invalid IBAN format.';
        return null;
      }
      default:
        return null;
    }
  };

  const validateAll = (): Record<string, string> => {
    const keys: FieldKey[] = [
      'firstName',
      'lastName',
      'emailOrUsername',
      'dateOfBirth',
      'phoneNumber',
      'address',
      'governmentIdNumber',
      'idFront',
      'idBack',
      'selfie',
      'licenseNumber',
      'vehicleMake',
      'vehicleModel',
      'vehicleYear',
      'licensePlate',
    ];

    const errors: Record<string, string> = {};
    for (const k of keys) {
      const e = validateField(k);
      if (e) errors[k] = e;
    }

    for (const [k, v] of Object.entries(serverFieldErrors)) {
      errors[k] = v;
    }

    return errors;
  };

  const markTouched = (k: FieldKey) => setTouched((t) => ({ ...t, [k]: true }));

  useEffect(() => {
    const existing = safeJsonParse<any>(localStorage.getItem(DRIVER_APPLICATION_KEY));
    if (!existing) return;
    setDateOfBirth(existing?.driver?.date_of_birth ?? '');
    setPhoneNumber(existing?.driver?.phone_number ?? '');
    setAddress(existing?.driver?.address ?? '');
    setGovernmentIdNumber(existing?.driver?.government_id_number ?? '');
    setLicenseNumber(existing?.license?.license_number ?? '');
    setLicenseCountry(existing?.license?.license_country ?? '');
    setLicenseType(existing?.license?.license_type ?? '');
    setLicenseExpiry(existing?.license?.expiry_date ?? '');
    setVehicleMake(existing?.vehicle?.make ?? '');
    setVehicleModel(existing?.vehicle?.model ?? '');
    setVehicleYear(String(existing?.vehicle?.year ?? ''));
    setVehicleColor(existing?.vehicle?.color ?? '');
    setLicensePlate(existing?.vehicle?.license_plate ?? '');
    setRegistrationCountry(existing?.vehicle?.registration_country ?? '');
    setInsurancePolicyNumber(existing?.vehicle?.insurance_policy_number ?? '');
    setInsuranceExpiry(existing?.vehicle?.insurance_expiry ?? '');
    setAccountHolderName(existing?.payout?.account_holder_name ?? '');
    setBankName(existing?.payout?.bank_name ?? '');
    setIban(existing?.payout?.iban ?? '');
    setTaxInfo(existing?.tax_info ?? '');
  }, []);

  useEffect(() => {
    const next: Record<string, string> = { ...fieldErrors };
    (Object.keys(touched) as FieldKey[]).forEach((k) => {
      if (!touched[k]) return;
      const e = validateField(k);
      if (e) next[k] = e;
      else delete next[k];
    });
    setFieldErrors(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    firstName,
    lastName,
    emailOrUsername,
    dateOfBirth,
    phoneNumber,
    address,
    governmentIdNumber,
    idFront,
    idBack,
    selfie,
    licenseNumber,
    licenseExpiry,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    licensePlate,
    insuranceExpiry,
    iban,
  ]);

  const validateTimer = useRef<number | null>(null);
  useEffect(() => {
    if (validateTimer.current) window.clearTimeout(validateTimer.current);

    const shouldValidate = Boolean(touched.licenseNumber || touched.licensePlate);
    if (!shouldValidate) return;

    const lic = licenseNumber.trim();
    const reg = licensePlate.trim();

    validateTimer.current = window.setTimeout(async () => {
      try {
        const payload: any = {};
        if (lic) payload.licence_number = lic;
        if (reg) payload.vehicle_registration = reg;
        if (!payload.licence_number && !payload.vehicle_registration) return;

        const res = await apiFetch<any>('drivers/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const nextServerErrors: Record<string, string> = {};
        const fe = res?.field_errors ?? {};
        if (fe.licence_number) nextServerErrors.licenseNumber = String(fe.licence_number);
        if (fe.vehicle_registration) nextServerErrors.licensePlate = String(fe.vehicle_registration);

        setServerFieldErrors(nextServerErrors);
      } catch {
        setServerFieldErrors({});
      }
    }, 450);

    return () => {
      if (validateTimer.current) window.clearTimeout(validateTimer.current);
    };
  }, [licenseNumber, licensePlate, touched.licenseNumber, touched.licensePlate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaved(false);

    const requiredKeys: FieldKey[] = [
      'firstName',
      'lastName',
      'emailOrUsername',
      'dateOfBirth',
      'phoneNumber',
      'address',
      'governmentIdNumber',
      'idFront',
      'idBack',
      'selfie',
      'licenseNumber',
      'vehicleMake',
      'vehicleModel',
      'vehicleYear',
      'licensePlate',
    ];
    setTouched((t) => {
      const next = { ...t };
      requiredKeys.forEach((k) => (next[k] = true));
      return next;
    });

    const errors = validateAll();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormError('Please fix the highlighted fields.');
      return;
    }

    setSubmitting(true);
    try {
      const application = {
        submitted_at: new Date().toISOString(),
        driver: {
          first_name: firstName.trim(),
          middle_names: middleNames.trim(),
          last_name: lastName.trim(),
          email_or_username: emailOrUsername.trim(),
          date_of_birth: dateOfBirth,
          phone_number: phoneNumber.trim(),
          address: address.trim(),
          government_id_number: governmentIdNumber.trim(),
          id_document_front_filename: idFront?.name ?? null,
          id_document_back_filename: idBack?.name ?? null,
          selfie_filename: selfie?.name ?? null,
        },
        license: {
          license_number: licenseNumber.trim(),
          license_country: licenseCountry.trim(),
          license_type: licenseType.trim(),
          expiry_date: licenseExpiry,
          license_photo_filename: licensePhoto?.name ?? null,
          background_check_status: 'pending',
        },
        vehicle: {
          make: vehicleMake.trim(),
          model: vehicleModel.trim(),
          year: Number(vehicleYear),
          color: vehicleColor.trim(),
          license_plate: licensePlate.trim(),
          registration_country: registrationCountry.trim(),
          insurance_policy_number: insurancePolicyNumber.trim(),
          insurance_expiry: insuranceExpiry,
          vehicle_photo_filenames: [vehicleFront?.name, vehicleBack?.name, vehicleInterior?.name].filter(Boolean),
          approved: false,
        },
        payout: {
          account_holder_name: accountHolderName.trim(),
          bank_name: bankName.trim(),
          iban: iban.trim(),
          verified: false,
        },
        tax_info: taxInfo.trim(),
      };

      localStorage.setItem(DRIVER_APPLICATION_KEY, JSON.stringify(application));
      localStorage.setItem(
        SIGNUP_DRAFT_KEY,
        JSON.stringify({
          firstName: firstName.trim(),
          middleNames: middleNames.trim(),
          lastName: lastName.trim(),
          emailOrUsername: emailOrUsername.trim(),
        })
      );

      await apiFetch('drivers/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          licence_number: licenseNumber.trim(),
          vehicle_registration: licensePlate.trim(),
        }),
      });

      setSaved(true);
      onComplete();
    } catch (err: any) {
      const detail = err?.detail ?? null;
      const fe = detail?.field_errors ?? null;

      if (fe && typeof fe === 'object') {
        const nextServerErrors: Record<string, string> = {};
        if (fe.licence_number) nextServerErrors.licenseNumber = String(fe.licence_number);
        if (fe.vehicle_registration) nextServerErrors.licensePlate = String(fe.vehicle_registration);
        setServerFieldErrors(nextServerErrors);
        setFormError('Please fix the highlighted fields.');
      } else {
        setFormError(err?.message ?? 'Driver signup failed. Please check your details and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const mergedError = (k: FieldKey) => {
    const a = fieldErrors[k];
    const b = serverFieldErrors[k];
    return b ?? a ?? null;
  };

  return (
    <div className="auth-wrapper">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#e5e7eb',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: 0,
          }}
        >
          {BackIcon}
          Back
        </button>
      </div>

      <h1 className="auth-title">Driver sign-up</h1>
      <p className="auth-subtitle">
        Complete your driver profile. We&apos;ll mark your status as <b>pending verification</b> once you submit.
      </p>

      <div className="auth-card">
        {formError && <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '12px' }}>{formError}</p>}
        {saved && (
          <p style={{ color: '#34d399', fontSize: '14px', marginBottom: '12px' }}>
            Saved. Your driver application is now pending verification.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <Section title="Personal details" subtitle="These come from your account sign-up, but you can correct them here.">
            <Field label="First name" value={firstName} onChange={setFirstName} onBlur={() => markTouched('firstName')} required error={mergedError('firstName')} />
            <Field label="Middle names (optional)" value={middleNames} onChange={setMiddleNames} onBlur={() => markTouched('middleNames')} />
            <Field label="Last name" value={lastName} onChange={setLastName} onBlur={() => markTouched('lastName')} required error={mergedError('lastName')} />
            <Field
              label="Email or university username"
              value={emailOrUsername}
              onChange={setEmailOrUsername}
              onBlur={() => markTouched('emailOrUsername')}
              placeholder="you@bath.ac.uk or abc123"
              required
              error={mergedError('emailOrUsername')}
            />
            <Field
              label="Date of birth"
              value={dateOfBirth}
              onChange={setDateOfBirth}
              onBlur={() => markTouched('dateOfBirth')}
              type="date"
              required
              error={mergedError('dateOfBirth')}
            />
            <Field
              label="Phone number"
              value={phoneNumber}
              onChange={setPhoneNumber}
              onBlur={() => markTouched('phoneNumber')}
              placeholder="+447911123456"
              hint="Digits only (optionally +). Example: +447911123456"
              required
              error={mergedError('phoneNumber')}
            />
            <Field
              label="Residential address"
              value={address}
              onChange={setAddress}
              onBlur={() => markTouched('address')}
              placeholder="Flat, street, city, postcode"
              required
              error={mergedError('address')}
            />
          </Section>

          <Section title="Identity verification" subtitle="Upload clear photos. Supported: images and PDF.">
            <Field
              label="Government ID number"
              value={governmentIdNumber}
              onChange={setGovernmentIdNumber}
              onBlur={() => markTouched('governmentIdNumber')}
              placeholder="Passport / ID number"
              required
              error={mergedError('governmentIdNumber')}
            />
            <FileField
              label="ID document upload (passport / driving licence) — front"
              onPick={(f) => setIdFront(f)}
              onBlur={() => markTouched('idFront')}
              required
              error={mergedError('idFront')}
            />
            <FileField
              label="ID document upload (passport / driving licence) — back"
              onPick={(f) => setIdBack(f)}
              onBlur={() => markTouched('idBack')}
              required
              error={mergedError('idBack')}
            />
            <FileField
              label="Selfie for identification"
              onPick={(f) => setSelfie(f)}
              onBlur={() => markTouched('selfie')}
              required
              error={mergedError('selfie')}
            />
          </Section>

          <Section title="Driving licence" subtitle="We validate the UK licence number format live (including DOB encoding).">
            <Field
              label="Licence number"
              value={licenseNumber}
              onChange={setLicenseNumber}
              onBlur={() => markTouched('licenseNumber')}
              placeholder="MORGA657054SM9IJ"
              hint="UK format: 16 chars. Spaces are ignored."
              required
              error={mergedError('licenseNumber')}
            />
            <Field label="Licence country" value={licenseCountry} onChange={setLicenseCountry} placeholder="UK" onBlur={() => markTouched('licenseCountry')} />
            <Field label="Licence type" value={licenseType} onChange={setLicenseType} placeholder="Full" onBlur={() => markTouched('licenseType')} />
            <Field
              label="Expiry date (optional)"
              value={licenseExpiry}
              onChange={setLicenseExpiry}
              onBlur={() => markTouched('licenseExpiry')}
              type="date"
              error={mergedError('licenseExpiry')}
            />
            <FileField label="Licence photo (optional)" onPick={setLicensePhoto} onBlur={() => markTouched('licensePhoto')} />
          </Section>

          <Section title="Vehicle information" subtitle="Tell us about the car you will use for rides.">
            <Field label="Vehicle make" value={vehicleMake} onChange={setVehicleMake} onBlur={() => markTouched('vehicleMake')} placeholder="Toyota" required error={mergedError('vehicleMake')} />
            <Field label="Model" value={vehicleModel} onChange={setVehicleModel} onBlur={() => markTouched('vehicleModel')} placeholder="Yaris" required error={mergedError('vehicleModel')} />
            <Field
              label="Year"
              value={vehicleYear}
              onChange={setVehicleYear}
              onBlur={() => markTouched('vehicleYear')}
              placeholder="2020"
              type="number"
              required
              error={mergedError('vehicleYear')}
            />
            <Field label="Color (optional)" value={vehicleColor} onChange={setVehicleColor} onBlur={() => markTouched('vehicleColor')} placeholder="Black" />
            <Field
              label="License plate"
              value={licensePlate}
              onChange={setLicensePlate}
              onBlur={() => markTouched('licensePlate')}
              placeholder="AB12 CDE"
              hint="UK format: AB12 CDE"
              required
              error={mergedError('licensePlate')}
            />
            <Field label="Registration country (optional)" value={registrationCountry} onChange={setRegistrationCountry} onBlur={() => markTouched('registrationCountry')} placeholder="UK" />
            <FileField label="Vehicle photo — front (optional)" onPick={setVehicleFront} onBlur={() => markTouched('vehicleFront')} />
            <FileField label="Vehicle photo — back (optional)" onPick={setVehicleBack} onBlur={() => markTouched('vehicleBack')} />
            <FileField label="Vehicle photo — interior (optional)" onPick={setVehicleInterior} onBlur={() => markTouched('vehicleInterior')} />
            <Field label="Insurance policy number (optional)" value={insurancePolicyNumber} onChange={setInsurancePolicyNumber} onBlur={() => markTouched('insurancePolicyNumber')} />
            <Field
              label="Insurance expiry date (optional)"
              value={insuranceExpiry}
              onChange={setInsuranceExpiry}
              onBlur={() => markTouched('insuranceExpiry')}
              type="date"
              error={mergedError('insuranceExpiry')}
            />
          </Section>

          <Section title="Payment and platform" subtitle="Where we pay you out (dummy fields for now).">
            <Field label="Bank account holder name (optional)" value={accountHolderName} onChange={setAccountHolderName} onBlur={() => markTouched('accountHolderName')} />
            <Field label="Bank name (optional)" value={bankName} onChange={setBankName} onBlur={() => markTouched('bankName')} />
            <Field label="IBAN (optional)" value={iban} onChange={setIban} onBlur={() => markTouched('iban')} placeholder="GB29 NWBK 6016 1331 9268 19" error={mergedError('iban')} />
            <Field label="Tax information (optional)" value={taxInfo} onChange={setTaxInfo} onBlur={() => markTouched('taxInfo')} placeholder="Optional" />
          </Section>

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit driver application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverSignupPage;