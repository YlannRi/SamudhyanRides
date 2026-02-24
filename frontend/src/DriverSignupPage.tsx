import React, { useEffect, useMemo, useState } from 'react';

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

const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <div style={{ padding: '14px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#f9fafb' }}>{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{subtitle}</div>}
    </div>
    {children}
  </div>
);

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}> = ({ label, value, onChange, placeholder, type = 'text', required, disabled }) => (
  <div className="auth-field">
    <label className="auth-label">{label}</label>
    <input
      className="auth-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      required={required}
      disabled={disabled}
    />
  </div>
);

const FileField: React.FC<{ label: string; onPick: (file: File | null) => void; required?: boolean }> = ({ label, onPick, required }) => (
  <div className="auth-field">
    <label className="auth-label">{label}</label>
    <input
      className="auth-input"
      style={{ paddingTop: 10 }}
      type="file"
      accept="image/*,.pdf"
      onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      required={required}
    />
  </div>
);

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

  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (!firstName.trim() || !lastName.trim() || !emailOrUsername.trim()) {
      setError('Please complete your name and email/username.');
      return;
    }
    if (!dateOfBirth || !phoneNumber.trim() || !address.trim()) {
      setError('Please complete your date of birth, phone number, and address.');
      return;
    }
    if (!governmentIdNumber.trim() || !licenseNumber.trim()) {
      setError('Please provide your government ID number and driving licence number.');
      return;
    }
    if (!vehicleMake.trim() || !vehicleModel.trim() || !vehicleYear.trim() || !licensePlate.trim()) {
      setError('Please complete your vehicle make/model/year and plate.');
      return;
    }

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

    setSaved(true);
    onComplete();
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
        {error && (
          <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '12px' }}>{error}</p>
        )}
        {saved && (
          <p style={{ color: '#34d399', fontSize: '14px', marginBottom: '12px' }}>
            Saved. Your driver application is now pending verification.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <Section title="Personal details" subtitle="These come from your account sign-up, but you can correct them here.">
            <Field label="First name" value={firstName} onChange={setFirstName} required />
            <Field label="Middle names (optional)" value={middleNames} onChange={setMiddleNames} />
            <Field label="Last name" value={lastName} onChange={setLastName} required />
            <Field label="Email or university username" value={emailOrUsername} onChange={setEmailOrUsername} required />
            <Field label="Date of birth" value={dateOfBirth} onChange={setDateOfBirth} type="date" required />
            <Field label="Phone number" value={phoneNumber} onChange={setPhoneNumber} placeholder="+44 7..." required />
            <Field label="Residential address" value={address} onChange={setAddress} placeholder="Flat, street, city, postcode" required />
          </Section>

          <Section title="Identity verification" subtitle="Upload clear photos. Supported: images and PDF.">
            <Field label="Government ID number" value={governmentIdNumber} onChange={setGovernmentIdNumber} required />
            <FileField label="ID document upload (passport / driving licence) — front" onPick={setIdFront} required />
            <FileField label="ID document upload (passport / driving licence) — back" onPick={setIdBack} required />
            <FileField label="Selfie for identification" onPick={setSelfie} required />
          </Section>

          <Section title="Driving licence" subtitle="Licence details (background check will be pending in the prototype).">
            <Field label="Licence number" value={licenseNumber} onChange={setLicenseNumber} required />
            <Field label="Licence country" value={licenseCountry} onChange={setLicenseCountry} placeholder="UK" />
            <Field label="Licence type" value={licenseType} onChange={setLicenseType} placeholder="Full" />
            <Field label="Expiry date" value={licenseExpiry} onChange={setLicenseExpiry} type="date" />
            <FileField label="Licence photo" onPick={setLicensePhoto} />
          </Section>

          <Section title="Vehicle information" subtitle="Tell us about the car you will use for rides.">
            <Field label="Vehicle make" value={vehicleMake} onChange={setVehicleMake} placeholder="Toyota" required />
            <Field label="Model" value={vehicleModel} onChange={setVehicleModel} placeholder="Yaris" required />
            <Field label="Year" value={vehicleYear} onChange={setVehicleYear} placeholder="2020" type="number" required />
            <Field label="Color" value={vehicleColor} onChange={setVehicleColor} placeholder="Black" />
            <Field label="License plate" value={licensePlate} onChange={setLicensePlate} placeholder="AB12 CDE" required />
            <Field label="Registration country" value={registrationCountry} onChange={setRegistrationCountry} placeholder="UK" />
            <FileField label="Vehicle photo — front" onPick={setVehicleFront} />
            <FileField label="Vehicle photo — back" onPick={setVehicleBack} />
            <FileField label="Vehicle photo — interior" onPick={setVehicleInterior} />
            <Field label="Insurance policy number" value={insurancePolicyNumber} onChange={setInsurancePolicyNumber} />
            <Field label="Insurance expiry date" value={insuranceExpiry} onChange={setInsuranceExpiry} type="date" />
          </Section>

          <Section title="Payment and platform" subtitle="Where we pay you out (dummy fields for now).">
            <Field label="Bank account holder name" value={accountHolderName} onChange={setAccountHolderName} />
            <Field label="Bank name" value={bankName} onChange={setBankName} />
            <Field label="IBAN" value={iban} onChange={setIban} placeholder="GB..." />
            <Field label="Tax information (if applicable)" value={taxInfo} onChange={setTaxInfo} placeholder="Optional" />
          </Section>

          <button type="submit" className="auth-submit">
            Submit driver application
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverSignupPage;