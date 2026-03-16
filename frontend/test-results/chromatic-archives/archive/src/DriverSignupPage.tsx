import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/DriverSignupPage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c85c9c72"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$(), _s2 = $RefreshSig$(), _s3 = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=c85c9c72"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useEffect = __vite__cjsImport1_react["useEffect"]; const useId = __vite__cjsImport1_react["useId"]; const useMemo = __vite__cjsImport1_react["useMemo"]; const useRef = __vite__cjsImport1_react["useRef"]; const useState = __vite__cjsImport1_react["useState"];
import { apiFetch } from "/src/lib/api.ts";
const BackIcon = /* @__PURE__ */ jsxDEV("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxDEV("path", { d: "M19 12H5M12 5l-7 7 7 7" }, void 0, false, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
  lineNumber: 6,
  columnNumber: 5
}, this) }, void 0, false, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
  lineNumber: 5,
  columnNumber: 1
}, this);
const SIGNUP_DRAFT_KEY = "driverSignupDraft";
const DRIVER_APPLICATION_KEY = "driverApplication";
const safeJsonParse = (raw) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
const isLikelyEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isLikelyUniUsername = (v) => /^[a-z]{3,6}\d{1,4}$/i.test(v.trim());
const isE164ish = (v) => /^\+?[0-9]{7,15}$/.test(v.replace(/\s+/g, ""));
const isUkPlateish = (v) => /^[A-Z]{2}[0-9]{2}[A-Z]{3}$/.test(v.replace(/\s+/g, "").toUpperCase());
const calcAge = (isoDate) => {
  if (!isoDate) return null;
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return null;
  const now = /* @__PURE__ */ new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || m === 0 && now.getDate() < d.getDate()) age--;
  return age;
};
const Section = ({ title, subtitle, children }) => /* @__PURE__ */ jsxDEV("div", { style: { padding: "14px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }, children: [
  /* @__PURE__ */ jsxDEV("div", { style: { marginBottom: 10 }, children: [
    /* @__PURE__ */ jsxDEV("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }, children: title }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
      lineNumber: 86,
      columnNumber: 7
    }, this),
    subtitle && /* @__PURE__ */ jsxDEV("div", { style: { fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }, children: subtitle }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
      lineNumber: 87,
      columnNumber: 20
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
    lineNumber: 85,
    columnNumber: 5
  }, this),
  children
] }, void 0, true, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
  lineNumber: 84,
  columnNumber: 1
}, this);
_c = Section;
const Field = ({ label, value, onChange, onBlur, placeholder, type = "text", required, disabled, hint, error }) => {
  _s();
  const inputId = useId();
  const hintId = hint ? `${inputId}-hint` : void 0;
  const errId = error ? `${inputId}-err` : void 0;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
    /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: inputId, children: label }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
      lineNumber: 112,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        id: inputId,
        className: "auth-input",
        value,
        onChange: (e) => onChange(e.target.value),
        onBlur,
        placeholder,
        type,
        required,
        "aria-required": required || void 0,
        disabled,
        "aria-invalid": Boolean(error) || void 0,
        "aria-describedby": describedBy
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
        lineNumber: 115,
        columnNumber: 7
      },
      this
    ),
    hint && !error && /* @__PURE__ */ jsxDEV("div", { id: hintId, style: { marginTop: 6, color: "var(--text-secondary)", fontSize: 12 }, children: hint }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
      lineNumber: 130,
      columnNumber: 7
    }, this),
    error && /* @__PURE__ */ jsxDEV("div", { id: errId, role: "alert", style: { marginTop: 6, color: "#f87171", fontSize: 12 }, children: error }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
      lineNumber: 135,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
    lineNumber: 111,
    columnNumber: 5
  }, this);
};
_s(Field, "x9wxVM2x7D2iRbOCuf9H0Z90UJg=");
_c2 = Field;
const FileField = ({ label, onPick, onBlur, required, hint, error }) => {
  _s2();
  const inputId = useId();
  const hintId = hint ? `${inputId}-hint` : void 0;
  const errId = error ? `${inputId}-err` : void 0;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
    /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: inputId, children: label }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
      lineNumber: 158,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        id: inputId,
        className: "auth-input",
        style: { paddingTop: 10 },
        type: "file",
        accept: "image/*,.pdf",
        onChange: (e) => onPick(e.target.files?.[0] ?? null),
        onBlur,
        required,
        "aria-required": required || void 0,
        "aria-invalid": Boolean(error) || void 0,
        "aria-describedby": describedBy
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
        lineNumber: 161,
        columnNumber: 7
      },
      this
    ),
    hint && !error && /* @__PURE__ */ jsxDEV("div", { id: hintId, style: { marginTop: 6, color: "var(--text-secondary)", fontSize: 12 }, children: hint }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
      lineNumber: 175,
      columnNumber: 7
    }, this),
    error && /* @__PURE__ */ jsxDEV("div", { id: errId, role: "alert", style: { marginTop: 6, color: "#f87171", fontSize: 12 }, children: error }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
      lineNumber: 180,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
    lineNumber: 157,
    columnNumber: 5
  }, this);
};
_s2(FileField, "x9wxVM2x7D2iRbOCuf9H0Z90UJg=");
_c3 = FileField;
const DriverSignupPage = ({ onBack, onComplete }) => {
  _s3();
  const draft = useMemo(() => {
    const fromStorage = safeJsonParse(localStorage.getItem(SIGNUP_DRAFT_KEY));
    return fromStorage ?? {
      firstName: "",
      middleNames: "",
      lastName: "",
      emailOrUsername: ""
    };
  }, []);
  const [firstName, setFirstName] = useState(draft.firstName);
  const [middleNames, setMiddleNames] = useState(draft.middleNames);
  const [lastName, setLastName] = useState(draft.lastName);
  const [emailOrUsername, setEmailOrUsername] = useState(draft.emailOrUsername);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [governmentIdNumber, setGovernmentIdNumber] = useState("");
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseCountry, setLicenseCountry] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [licensePhoto, setLicensePhoto] = useState(null);
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [registrationCountry, setRegistrationCountry] = useState("");
  const [vehicleFront, setVehicleFront] = useState(null);
  const [vehicleBack, setVehicleBack] = useState(null);
  const [vehicleInterior, setVehicleInterior] = useState(null);
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState("");
  const [insuranceExpiry, setInsuranceExpiry] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [iban, setIban] = useState("");
  const [taxInfo, setTaxInfo] = useState("");
  const [formError, setFormError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverFieldErrors, setServerFieldErrors] = useState({});
  const validateField = (key) => {
    switch (key) {
      case "firstName":
        return firstName.trim() ? null : "First name is required.";
      case "lastName":
        return lastName.trim() ? null : "Last name is required.";
      case "emailOrUsername": {
        const v = emailOrUsername.trim();
        if (!v) return "Email or university username is required.";
        if (!isLikelyEmail(v) && !isLikelyUniUsername(v)) return "Use an email (you@bath.ac.uk) or a username (abc123).";
        return null;
      }
      case "dateOfBirth": {
        if (!dateOfBirth) return "Date of birth is required.";
        const age = calcAge(dateOfBirth);
        if (age === null) return "Invalid date.";
        if (age < 17) return "You must be at least 17 years old to be a driver.";
        if (age > 100) return "Please check your date of birth.";
        return null;
      }
      case "phoneNumber": {
        const v = phoneNumber.trim();
        if (!v) return "Phone number is required.";
        if (!isE164ish(v)) return "Use digits only (optionally +), 7–15 digits (e.g. +447911123456).";
        return null;
      }
      case "address": {
        const v = address.trim();
        if (!v) return "Address is required.";
        if (v.length < 8) return "Please enter a full address (include postcode).";
        return null;
      }
      case "governmentIdNumber": {
        const v = governmentIdNumber.trim();
        if (!v) return "Government ID number is required.";
        if (v.length < 5) return "Government ID number looks too short.";
        return null;
      }
      case "idFront":
        return idFront ? null : "Front image/PDF is required.";
      case "idBack":
        return idBack ? null : "Back image/PDF is required.";
      case "selfie":
        return selfie ? null : "Selfie is required.";
      case "licenseNumber": {
        const v = licenseNumber.trim();
        if (!v) return "Driving licence number is required.";
        const compact = v.replace(/\s+/g, "").toUpperCase();
        if (compact.length !== 16) return "Must be 16 characters (spaces ignored).";
        return null;
      }
      case "licenseExpiry": {
        if (!licenseExpiry) return null;
        const d = new Date(licenseExpiry);
        if (Number.isNaN(d.getTime())) return "Invalid expiry date.";
        return null;
      }
      case "vehicleMake":
        return vehicleMake.trim() ? null : "Vehicle make is required.";
      case "vehicleModel":
        return vehicleModel.trim() ? null : "Vehicle model is required.";
      case "vehicleYear": {
        const v = vehicleYear.trim();
        if (!v) return "Vehicle year is required.";
        const n = Number(v);
        if (!Number.isFinite(n) || !Number.isInteger(n)) return "Year must be a whole number.";
        const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
        if (n < 1980 || n > currentYear + 1) return `Year must be between 1980 and ${currentYear + 1}.`;
        return null;
      }
      case "licensePlate": {
        const v = licensePlate.trim();
        if (!v) return "License plate is required.";
        if (!isUkPlateish(v)) return "Invalid UK plate format (e.g. AB12 CDE).";
        return null;
      }
      case "insuranceExpiry": {
        if (!insuranceExpiry) return null;
        const d = new Date(insuranceExpiry);
        if (Number.isNaN(d.getTime())) return "Invalid insurance expiry date.";
        return null;
      }
      case "iban": {
        if (!iban.trim()) return null;
        if (!/^([A-Z]{2}[0-9]{2}[A-Z0-9]{10,30})$/i.test(iban.replace(/\s+/g, ""))) return "Invalid IBAN format.";
        return null;
      }
      default:
        return null;
    }
  };
  const validateAll = () => {
    const keys = [
      "firstName",
      "lastName",
      "emailOrUsername",
      "dateOfBirth",
      "phoneNumber",
      "address",
      "governmentIdNumber",
      "idFront",
      "idBack",
      "selfie",
      "licenseNumber",
      "vehicleMake",
      "vehicleModel",
      "vehicleYear",
      "licensePlate"
    ];
    const errors = {};
    for (const k of keys) {
      const e = validateField(k);
      if (e) errors[k] = e;
    }
    for (const [k, v] of Object.entries(serverFieldErrors)) {
      errors[k] = v;
    }
    return errors;
  };
  const markTouched = (k) => setTouched((t) => ({ ...t, [k]: true }));
  useEffect(() => {
    const existing = safeJsonParse(localStorage.getItem(DRIVER_APPLICATION_KEY));
    if (!existing) return;
    setDateOfBirth(existing?.driver?.date_of_birth ?? "");
    setPhoneNumber(existing?.driver?.phone_number ?? "");
    setAddress(existing?.driver?.address ?? "");
    setGovernmentIdNumber(existing?.driver?.government_id_number ?? "");
    setLicenseNumber(existing?.license?.license_number ?? "");
    setLicenseCountry(existing?.license?.license_country ?? "");
    setLicenseType(existing?.license?.license_type ?? "");
    setLicenseExpiry(existing?.license?.expiry_date ?? "");
    setVehicleMake(existing?.vehicle?.make ?? "");
    setVehicleModel(existing?.vehicle?.model ?? "");
    setVehicleYear(String(existing?.vehicle?.year ?? ""));
    setVehicleColor(existing?.vehicle?.color ?? "");
    setLicensePlate(existing?.vehicle?.license_plate ?? "");
    setRegistrationCountry(existing?.vehicle?.registration_country ?? "");
    setInsurancePolicyNumber(existing?.vehicle?.insurance_policy_number ?? "");
    setInsuranceExpiry(existing?.vehicle?.insurance_expiry ?? "");
    setAccountHolderName(existing?.payout?.account_holder_name ?? "");
    setBankName(existing?.payout?.bank_name ?? "");
    setIban(existing?.payout?.iban ?? "");
    setTaxInfo(existing?.tax_info ?? "");
  }, []);
  useEffect(
    () => {
      const next = { ...fieldErrors };
      Object.keys(touched).forEach((k) => {
        if (!touched[k]) return;
        const e = validateField(k);
        if (e) next[k] = e;
        else
          delete next[k];
      });
      setFieldErrors(next);
    },
    [
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
      iban
    ]
  );
  const validateTimer = useRef(null);
  useEffect(() => {
    if (validateTimer.current) window.clearTimeout(validateTimer.current);
    const shouldValidate = Boolean(touched.licenseNumber || touched.licensePlate);
    if (!shouldValidate) return;
    const lic = licenseNumber.trim();
    const reg = licensePlate.trim();
    validateTimer.current = window.setTimeout(async () => {
      try {
        const payload = {};
        if (lic) payload.licence_number = lic;
        if (reg) payload.vehicle_registration = reg;
        if (!payload.licence_number && !payload.vehicle_registration) return;
        const res = await apiFetch("drivers/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const nextServerErrors = {};
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSaved(false);
    const requiredKeys = [
      "firstName",
      "lastName",
      "emailOrUsername",
      "dateOfBirth",
      "phoneNumber",
      "address",
      "governmentIdNumber",
      "idFront",
      "idBack",
      "selfie",
      "licenseNumber",
      "vehicleMake",
      "vehicleModel",
      "vehicleYear",
      "licensePlate"
    ];
    setTouched((t) => {
      const next = { ...t };
      requiredKeys.forEach((k) => next[k] = true);
      return next;
    });
    const errors = validateAll();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setFormError("Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    try {
      const application = {
        submitted_at: (/* @__PURE__ */ new Date()).toISOString(),
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
          selfie_filename: selfie?.name ?? null
        },
        license: {
          license_number: licenseNumber.trim(),
          license_country: licenseCountry.trim(),
          license_type: licenseType.trim(),
          expiry_date: licenseExpiry,
          license_photo_filename: licensePhoto?.name ?? null,
          background_check_status: "pending"
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
          approved: false
        },
        payout: {
          account_holder_name: accountHolderName.trim(),
          bank_name: bankName.trim(),
          iban: iban.trim(),
          verified: false
        },
        tax_info: taxInfo.trim()
      };
      localStorage.setItem(DRIVER_APPLICATION_KEY, JSON.stringify(application));
      localStorage.setItem(
        SIGNUP_DRAFT_KEY,
        JSON.stringify({
          firstName: firstName.trim(),
          middleNames: middleNames.trim(),
          lastName: lastName.trim(),
          emailOrUsername: emailOrUsername.trim()
        })
      );
      await apiFetch("drivers/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licence_number: licenseNumber.trim(),
          vehicle_registration: licensePlate.trim()
        })
      });
      setSaved(true);
      onComplete();
    } catch (err) {
      const detail = err?.detail ?? null;
      const fe = detail?.field_errors ?? null;
      if (fe && typeof fe === "object") {
        const nextServerErrors = {};
        if (fe.licence_number) nextServerErrors.licenseNumber = String(fe.licence_number);
        if (fe.vehicle_registration) nextServerErrors.licensePlate = String(fe.vehicle_registration);
        setServerFieldErrors(nextServerErrors);
        setFormError("Please fix the highlighted fields.");
      } else {
        setFormError(err?.message ?? "Driver signup failed. Please check your details and try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };
  const mergedError = (k) => {
    const a = fieldErrors[k];
    const b = serverFieldErrors[k];
    return b ?? a ?? null;
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "auth-wrapper", children: [
    /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }, children: /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        onClick: onBack,
        style: {
          background: "transparent",
          border: "none",
          color: "#e5e7eb",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: 0
        },
        children: [
          BackIcon,
          "Back"
        ]
      },
      void 0,
      true,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
        lineNumber: 602,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
      lineNumber: 601,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("h1", { className: "auth-title", children: "Driver sign-up" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
      lineNumber: 621,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("p", { className: "auth-subtitle", children: [
      "Complete your driver profile. We'll mark your status as ",
      /* @__PURE__ */ jsxDEV("b", { children: "pending verification" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
        lineNumber: 623,
        columnNumber: 70
      }, this),
      " once you submit."
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
      lineNumber: 622,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "auth-card", children: [
      formError && /* @__PURE__ */ jsxDEV("p", { style: { color: "#f87171", fontSize: "14px", marginBottom: "12px" }, children: formError }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
        lineNumber: 627,
        columnNumber: 23
      }, this),
      saved && /* @__PURE__ */ jsxDEV("p", { style: { color: "#34d399", fontSize: "14px", marginBottom: "12px" }, children: "Saved. Your driver application is now pending verification." }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
        lineNumber: 629,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxDEV(Section, { title: "Personal details", subtitle: "These come from your account sign-up, but you can correct them here.", children: [
          /* @__PURE__ */ jsxDEV(Field, { label: "First name", value: firstName, onChange: setFirstName, onBlur: () => markTouched("firstName"), required: true, error: mergedError("firstName") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 636,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Field, { label: "Middle names (optional)", value: middleNames, onChange: setMiddleNames, onBlur: () => markTouched("middleNames") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 637,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Field, { label: "Last name", value: lastName, onChange: setLastName, onBlur: () => markTouched("lastName"), required: true, error: mergedError("lastName") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 638,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            Field,
            {
              label: "Email or university username",
              value: emailOrUsername,
              onChange: setEmailOrUsername,
              onBlur: () => markTouched("emailOrUsername"),
              placeholder: "you@bath.ac.uk or abc123",
              required: true,
              error: mergedError("emailOrUsername")
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
              lineNumber: 639,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            Field,
            {
              label: "Date of birth",
              value: dateOfBirth,
              onChange: setDateOfBirth,
              onBlur: () => markTouched("dateOfBirth"),
              type: "date",
              required: true,
              error: mergedError("dateOfBirth")
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
              lineNumber: 648,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            Field,
            {
              label: "Phone number",
              value: phoneNumber,
              onChange: setPhoneNumber,
              onBlur: () => markTouched("phoneNumber"),
              placeholder: "+447911123456",
              hint: "Digits only (optionally +). Example: +447911123456",
              required: true,
              error: mergedError("phoneNumber")
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
              lineNumber: 657,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            Field,
            {
              label: "Residential address",
              value: address,
              onChange: setAddress,
              onBlur: () => markTouched("address"),
              placeholder: "Flat, street, city, postcode",
              required: true,
              error: mergedError("address")
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
              lineNumber: 667,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
          lineNumber: 635,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Section, { title: "Identity verification", subtitle: "Upload clear photos. Supported: images and PDF.", children: [
          /* @__PURE__ */ jsxDEV(
            Field,
            {
              label: "Government ID number",
              value: governmentIdNumber,
              onChange: setGovernmentIdNumber,
              onBlur: () => markTouched("governmentIdNumber"),
              placeholder: "Passport / ID number",
              required: true,
              error: mergedError("governmentIdNumber")
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
              lineNumber: 679,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            FileField,
            {
              label: "ID document upload (passport / driving licence) — front",
              onPick: (f) => setIdFront(f),
              onBlur: () => markTouched("idFront"),
              required: true,
              error: mergedError("idFront")
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
              lineNumber: 688,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            FileField,
            {
              label: "ID document upload (passport / driving licence) — back",
              onPick: (f) => setIdBack(f),
              onBlur: () => markTouched("idBack"),
              required: true,
              error: mergedError("idBack")
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
              lineNumber: 695,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(
            FileField,
            {
              label: "Selfie for identification",
              onPick: (f) => setSelfie(f),
              onBlur: () => markTouched("selfie"),
              required: true,
              error: mergedError("selfie")
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
              lineNumber: 702,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
          lineNumber: 678,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Section, { title: "Driving licence", subtitle: "We validate the UK licence number format live (including DOB encoding).", children: [
          /* @__PURE__ */ jsxDEV(
            Field,
            {
              label: "Licence number",
              value: licenseNumber,
              onChange: setLicenseNumber,
              onBlur: () => markTouched("licenseNumber"),
              placeholder: "MORGA657054SM9IJ",
              hint: "UK format: 16 chars. Spaces are ignored.",
              required: true,
              error: mergedError("licenseNumber")
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
              lineNumber: 712,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(Field, { label: "Licence country", value: licenseCountry, onChange: setLicenseCountry, placeholder: "UK", onBlur: () => markTouched("licenseCountry") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 722,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Field, { label: "Licence type", value: licenseType, onChange: setLicenseType, placeholder: "Full", onBlur: () => markTouched("licenseType") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 723,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            Field,
            {
              label: "Expiry date (optional)",
              value: licenseExpiry,
              onChange: setLicenseExpiry,
              onBlur: () => markTouched("licenseExpiry"),
              type: "date",
              error: mergedError("licenseExpiry")
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
              lineNumber: 724,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(FileField, { label: "Licence photo (optional)", onPick: setLicensePhoto, onBlur: () => markTouched("licensePhoto") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 732,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
          lineNumber: 711,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Section, { title: "Vehicle information", subtitle: "Tell us about the car you will use for rides.", children: [
          /* @__PURE__ */ jsxDEV(Field, { label: "Vehicle make", value: vehicleMake, onChange: setVehicleMake, onBlur: () => markTouched("vehicleMake"), placeholder: "Toyota", required: true, error: mergedError("vehicleMake") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 736,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Field, { label: "Model", value: vehicleModel, onChange: setVehicleModel, onBlur: () => markTouched("vehicleModel"), placeholder: "Yaris", required: true, error: mergedError("vehicleModel") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 737,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            Field,
            {
              label: "Year",
              value: vehicleYear,
              onChange: setVehicleYear,
              onBlur: () => markTouched("vehicleYear"),
              placeholder: "2020",
              type: "number",
              required: true,
              error: mergedError("vehicleYear")
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
              lineNumber: 738,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(Field, { label: "Color (optional)", value: vehicleColor, onChange: setVehicleColor, onBlur: () => markTouched("vehicleColor"), placeholder: "Black" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 748,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            Field,
            {
              label: "License plate",
              value: licensePlate,
              onChange: setLicensePlate,
              onBlur: () => markTouched("licensePlate"),
              placeholder: "AB12 CDE",
              hint: "UK format: AB12 CDE",
              required: true,
              error: mergedError("licensePlate")
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
              lineNumber: 749,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV(Field, { label: "Registration country (optional)", value: registrationCountry, onChange: setRegistrationCountry, onBlur: () => markTouched("registrationCountry"), placeholder: "UK" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 759,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FileField, { label: "Vehicle photo — front (optional)", onPick: setVehicleFront, onBlur: () => markTouched("vehicleFront") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 760,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FileField, { label: "Vehicle photo — back (optional)", onPick: setVehicleBack, onBlur: () => markTouched("vehicleBack") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 761,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FileField, { label: "Vehicle photo — interior (optional)", onPick: setVehicleInterior, onBlur: () => markTouched("vehicleInterior") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 762,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Field, { label: "Insurance policy number (optional)", value: insurancePolicyNumber, onChange: setInsurancePolicyNumber, onBlur: () => markTouched("insurancePolicyNumber") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 763,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            Field,
            {
              label: "Insurance expiry date (optional)",
              value: insuranceExpiry,
              onChange: setInsuranceExpiry,
              onBlur: () => markTouched("insuranceExpiry"),
              type: "date",
              error: mergedError("insuranceExpiry")
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
              lineNumber: 764,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
          lineNumber: 735,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(Section, { title: "Payment and platform", subtitle: "Where we pay you out (dummy fields for now).", children: [
          /* @__PURE__ */ jsxDEV(Field, { label: "Bank account holder name (optional)", value: accountHolderName, onChange: setAccountHolderName, onBlur: () => markTouched("accountHolderName") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 775,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Field, { label: "Bank name (optional)", value: bankName, onChange: setBankName, onBlur: () => markTouched("bankName") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 776,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Field, { label: "IBAN (optional)", value: iban, onChange: setIban, onBlur: () => markTouched("iban"), placeholder: "GB29 NWBK 6016 1331 9268 19", error: mergedError("iban") }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 777,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(Field, { label: "Tax information (optional)", value: taxInfo, onChange: setTaxInfo, onBlur: () => markTouched("taxInfo"), placeholder: "Optional" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
            lineNumber: 778,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
          lineNumber: 774,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("button", { type: "submit", className: "auth-submit", disabled: submitting, children: submitting ? "Submitting…" : "Submit driver application" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
          lineNumber: 781,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
        lineNumber: 634,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
      lineNumber: 626,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx",
    lineNumber: 600,
    columnNumber: 5
  }, this);
};
_s3(DriverSignupPage, "LsuP7oTMxjLFT/FSjP5G/LkQgZM=");
_c4 = DriverSignupPage;
export default DriverSignupPage;
var _c, _c2, _c3, _c4;
$RefreshReg$(_c, "Section");
$RefreshReg$(_c2, "Field");
$RefreshReg$(_c3, "FileField");
$RefreshReg$(_c4, "DriverSignupPage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/DriverSignupPage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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QU9oQyxVQUFVLFVBQVVDLGFBQWEsUUFBUSxNQUFNK0IsWUFBWSxVQUFVLEtBQWhIO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBQWtIO0FBQUEsVUFDbEgsdUJBQUMsU0FBTSxPQUFNLG1CQUFrQixPQUFPOUIsTUFBTSxVQUFVQyxTQUFTLFFBQVEsTUFBTTZCLFlBQVksTUFBTSxHQUFHLGFBQVksK0JBQThCLE9BQU9xRSxZQUFZLE1BQU0sS0FBcks7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBdUs7QUFBQSxVQUN2Syx1QkFBQyxTQUFNLE9BQU0sOEJBQTZCLE9BQU9qRyxTQUFTLFVBQVVDLFlBQVksUUFBUSxNQUFNMkIsWUFBWSxTQUFTLEdBQUcsYUFBWSxjQUFsSTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUE0STtBQUFBLGFBSjlJO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFLQTtBQUFBLFFBRUEsdUJBQUMsWUFBTyxNQUFLLFVBQVMsV0FBVSxlQUFjLFVBQVV0QixZQUNyREEsdUJBQWEsZ0JBQWdCLCtCQURoQztBQUFBO0FBQUE7QUFBQTtBQUFBLGVBRUE7QUFBQSxXQXJKRjtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBc0pBO0FBQUEsU0E5SkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQStKQTtBQUFBLE9BekxGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0EwTEE7QUFFSjtBQUFFdkUsSUF4bEJJSCxrQkFBaUQ7QUFBQStLLE1BQWpEL0s7QUEwbEJOLGVBQWVBO0FBQWlCLElBQUE5QixJQUFBdUIsS0FBQU0sS0FBQWdMO0FBQUFDLGFBQUE5TSxJQUFBO0FBQUE4TSxhQUFBdkwsS0FBQTtBQUFBdUwsYUFBQWpMLEtBQUE7QUFBQWlMLGFBQUFELEtBQUEiLCJuYW1lcyI6WyJSZWFjdCIsInVzZUVmZmVjdCIsInVzZUlkIiwidXNlTWVtbyIsInVzZVJlZiIsInVzZVN0YXRlIiwiYXBpRmV0Y2giLCJCYWNrSWNvbiIsIlNJR05VUF9EUkFGVF9LRVkiLCJEUklWRVJfQVBQTElDQVRJT05fS0VZIiwic2FmZUpzb25QYXJzZSIsInJhdyIsIkpTT04iLCJwYXJzZSIsImlzTGlrZWx5RW1haWwiLCJ2IiwidGVzdCIsInRyaW0iLCJpc0xpa2VseVVuaVVzZXJuYW1lIiwiaXNFMTY0aXNoIiwicmVwbGFjZSIsImlzVWtQbGF0ZWlzaCIsInRvVXBwZXJDYXNlIiwiY2FsY0FnZSIsImlzb0RhdGUiLCJkIiwiRGF0ZSIsIk51bWJlciIsImlzTmFOIiwiZ2V0VGltZSIsIm5vdyIsImFnZSIsImdldEZ1bGxZZWFyIiwibSIsImdldE1vbnRoIiwiZ2V0RGF0ZSIsIlNlY3Rpb24iLCJ0aXRsZSIsInN1YnRpdGxlIiwiY2hpbGRyZW4iLCJwYWRkaW5nIiwiYm9yZGVyVG9wIiwibWFyZ2luQm90dG9tIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwiY29sb3IiLCJtYXJnaW5Ub3AiLCJfYyIsIkZpZWxkIiwibGFiZWwiLCJ2YWx1ZSIsIm9uQ2hhbmdlIiwib25CbHVyIiwicGxhY2Vob2xkZXIiLCJ0eXBlIiwicmVxdWlyZWQiLCJkaXNhYmxlZCIsImhpbnQiLCJlcnJvciIsIl9zIiwiaW5wdXRJZCIsImhpbnRJZCIsInVuZGVmaW5lZCIsImVycklkIiwiZGVzY3JpYmVkQnkiLCJmaWx0ZXIiLCJCb29sZWFuIiwiam9pbiIsImUiLCJ0YXJnZXQiLCJfYzIiLCJGaWxlRmllbGQiLCJvblBpY2siLCJfczIiLCJwYWRkaW5nVG9wIiwiZmlsZXMiLCJfYzMiLCJEcml2ZXJTaWdudXBQYWdlIiwib25CYWNrIiwib25Db21wbGV0ZSIsIl9zMyIsImRyYWZ0IiwiZnJvbVN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiZmlyc3ROYW1lIiwibWlkZGxlTmFtZXMiLCJsYXN0TmFtZSIsImVtYWlsT3JVc2VybmFtZSIsInNldEZpcnN0TmFtZSIsInNldE1pZGRsZU5hbWVzIiwic2V0TGFzdE5hbWUiLCJzZXRFbWFpbE9yVXNlcm5hbWUiLCJkYXRlT2ZCaXJ0aCIsInNldERhdGVPZkJpcnRoIiwicGhvbmVOdW1iZXIiLCJzZXRQaG9uZU51bWJlciIsImFkZHJlc3MiLCJzZXRBZGRyZXNzIiwiZ292ZXJubWVudElkTnVtYmVyIiwic2V0R292ZXJubWVudElkTnVtYmVyIiwiaWRGcm9udCIsInNldElkRnJvbnQiLCJpZEJhY2siLCJzZXRJZEJhY2siLCJzZWxmaWUiLCJzZXRTZWxmaWUiLCJsaWNlbnNlTnVtYmVyIiwic2V0TGljZW5zZU51bWJlciIsImxpY2Vuc2VDb3VudHJ5Iiwic2V0TGljZW5zZUNvdW50cnkiLCJsaWNlbnNlVHlwZSIsInNldExpY2Vuc2VUeXBlIiwibGljZW5zZUV4cGlyeSIsInNldExpY2Vuc2VFeHBpcnkiLCJsaWNlbnNlUGhvdG8iLCJzZXRMaWNlbnNlUGhvdG8iLCJ2ZWhpY2xlTWFrZSIsInNldFZlaGljbGVNYWtlIiwidmVoaWNsZU1vZGVsIiwic2V0VmVoaWNsZU1vZGVsIiwidmVoaWNsZVllYXIiLCJzZXRWZWhpY2xlWWVhciIsInZlaGljbGVDb2xvciIsInNldFZlaGljbGVDb2xvciIsImxpY2Vuc2VQbGF0ZSIsInNldExpY2Vuc2VQbGF0ZSIsInJlZ2lzdHJhdGlvbkNvdW50cnkiLCJzZXRSZWdpc3RyYXRpb25Db3VudHJ5IiwidmVoaWNsZUZyb250Iiwic2V0VmVoaWNsZUZyb250IiwidmVoaWNsZUJhY2siLCJzZXRWZWhpY2xlQmFjayIsInZlaGljbGVJbnRlcmlvciIsInNldFZlaGljbGVJbnRlcmlvciIsImluc3VyYW5jZVBvbGljeU51bWJlciIsInNldEluc3VyYW5jZVBvbGljeU51bWJlciIsImluc3VyYW5jZUV4cGlyeSIsInNldEluc3VyYW5jZUV4cGlyeSIsImFjY291bnRIb2xkZXJOYW1lIiwic2V0QWNjb3VudEhvbGRlck5hbWUiLCJiYW5rTmFtZSIsInNldEJhbmtOYW1lIiwiaWJhbiIsInNldEliYW4iLCJ0YXhJbmZvIiwic2V0VGF4SW5mbyIsImZvcm1FcnJvciIsInNldEZvcm1FcnJvciIsInNhdmVkIiwic2V0U2F2ZWQiLCJzdWJtaXR0aW5nIiwic2V0U3VibWl0dGluZyIsInRvdWNoZWQiLCJzZXRUb3VjaGVkIiwiZmllbGRFcnJvcnMiLCJzZXRGaWVsZEVycm9ycyIsInNlcnZlckZpZWxkRXJyb3JzIiwic2V0U2VydmVyRmllbGRFcnJvcnMiLCJ2YWxpZGF0ZUZpZWxkIiwia2V5IiwibGVuZ3RoIiwiY29tcGFjdCIsIm4iLCJpc0Zpbml0ZSIsImlzSW50ZWdlciIsImN1cnJlbnRZZWFyIiwidmFsaWRhdGVBbGwiLCJrZXlzIiwiZXJyb3JzIiwiayIsIk9iamVjdCIsImVudHJpZXMiLCJtYXJrVG91Y2hlZCIsInQiLCJleGlzdGluZyIsImRyaXZlciIsImRhdGVfb2ZfYmlydGgiLCJwaG9uZV9udW1iZXIiLCJnb3Zlcm5tZW50X2lkX251bWJlciIsImxpY2Vuc2UiLCJsaWNlbnNlX251bWJlciIsImxpY2Vuc2VfY291bnRyeSIsImxpY2Vuc2VfdHlwZSIsImV4cGlyeV9kYXRlIiwidmVoaWNsZSIsIm1ha2UiLCJtb2RlbCIsIlN0cmluZyIsInllYXIiLCJsaWNlbnNlX3BsYXRlIiwicmVnaXN0cmF0aW9uX2NvdW50cnkiLCJpbnN1cmFuY2VfcG9saWN5X251bWJlciIsImluc3VyYW5jZV9leHBpcnkiLCJwYXlvdXQiLCJhY2NvdW50X2hvbGRlcl9uYW1lIiwiYmFua19uYW1lIiwidGF4X2luZm8iLCJuZXh0IiwiZm9yRWFjaCIsInZhbGlkYXRlVGltZXIiLCJjdXJyZW50Iiwid2luZG93IiwiY2xlYXJUaW1lb3V0Iiwic2hvdWxkVmFsaWRhdGUiLCJsaWMiLCJyZWciLCJzZXRUaW1lb3V0IiwicGF5bG9hZCIsImxpY2VuY2VfbnVtYmVyIiwidmVoaWNsZV9yZWdpc3RyYXRpb24iLCJyZXMiLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsInN0cmluZ2lmeSIsIm5leHRTZXJ2ZXJFcnJvcnMiLCJmZSIsImZpZWxkX2Vycm9ycyIsImhhbmRsZVN1Ym1pdCIsInByZXZlbnREZWZhdWx0IiwicmVxdWlyZWRLZXlzIiwiYXBwbGljYXRpb24iLCJzdWJtaXR0ZWRfYXQiLCJ0b0lTT1N0cmluZyIsImZpcnN0X25hbWUiLCJtaWRkbGVfbmFtZXMiLCJsYXN0X25hbWUiLCJlbWFpbF9vcl91c2VybmFtZSIsImlkX2RvY3VtZW50X2Zyb250X2ZpbGVuYW1lIiwibmFtZSIsImlkX2RvY3VtZW50X2JhY2tfZmlsZW5hbWUiLCJzZWxmaWVfZmlsZW5hbWUiLCJsaWNlbnNlX3Bob3RvX2ZpbGVuYW1lIiwiYmFja2dyb3VuZF9jaGVja19zdGF0dXMiLCJ2ZWhpY2xlX3Bob3RvX2ZpbGVuYW1lcyIsImFwcHJvdmVkIiwidmVyaWZpZWQiLCJzZXRJdGVtIiwiZXJyIiwiZGV0YWlsIiwibWVzc2FnZSIsIm1lcmdlZEVycm9yIiwiYSIsImIiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImdhcCIsImJhY2tncm91bmQiLCJib3JkZXIiLCJjdXJzb3IiLCJmIiwiX2M0IiwiJFJlZnJlc2hSZWckIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkRyaXZlclNpZ251cFBhZ2UudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZUlkLCB1c2VNZW1vLCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBhcGlGZXRjaCB9IGZyb20gJy4vbGliL2FwaSc7XHJcblxyXG5jb25zdCBCYWNrSWNvbiA9IChcclxuICA8c3ZnIHdpZHRoPVwiMjBcIiBoZWlnaHQ9XCIyMFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMi41XCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxyXG4gICAgPHBhdGggZD1cIk0xOSAxMkg1TTEyIDVsLTcgNyA3IDdcIiAvPlxyXG4gIDwvc3ZnPlxyXG4pO1xyXG5cclxuZXhwb3J0IHR5cGUgRHJpdmVyU2lnbnVwRHJhZnQgPSB7XHJcbiAgZmlyc3ROYW1lOiBzdHJpbmc7XHJcbiAgbWlkZGxlTmFtZXM6IHN0cmluZztcclxuICBsYXN0TmFtZTogc3RyaW5nO1xyXG4gIGVtYWlsT3JVc2VybmFtZTogc3RyaW5nO1xyXG59O1xyXG5cclxudHlwZSBEcml2ZXJTaWdudXBQYWdlUHJvcHMgPSB7XHJcbiAgb25CYWNrOiAoKSA9PiB2b2lkO1xyXG4gIG9uQ29tcGxldGU6ICgpID0+IHZvaWQ7XHJcbn07XHJcblxyXG5jb25zdCBTSUdOVVBfRFJBRlRfS0VZID0gJ2RyaXZlclNpZ251cERyYWZ0JztcclxuY29uc3QgRFJJVkVSX0FQUExJQ0FUSU9OX0tFWSA9ICdkcml2ZXJBcHBsaWNhdGlvbic7XHJcblxyXG5jb25zdCBzYWZlSnNvblBhcnNlID0gPFQsPihyYXc6IHN0cmluZyB8IG51bGwpOiBUIHwgbnVsbCA9PiB7XHJcbiAgaWYgKCFyYXcpIHJldHVybiBudWxsO1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShyYXcpIGFzIFQ7XHJcbiAgfSBjYXRjaCB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBpc0xpa2VseUVtYWlsID0gKHY6IHN0cmluZykgPT4gL15bXlxcc0BdK0BbXlxcc0BdK1xcLlteXFxzQF0rJC8udGVzdCh2LnRyaW0oKSk7XHJcbmNvbnN0IGlzTGlrZWx5VW5pVXNlcm5hbWUgPSAodjogc3RyaW5nKSA9PiAvXlthLXpdezMsNn1cXGR7MSw0fSQvaS50ZXN0KHYudHJpbSgpKTsgLy8gZS5nLiBhYmMxMjNcclxuY29uc3QgaXNFMTY0aXNoID0gKHY6IHN0cmluZykgPT4gL15cXCs/WzAtOV17NywxNX0kLy50ZXN0KHYucmVwbGFjZSgvXFxzKy9nLCAnJykpO1xyXG5jb25zdCBpc1VrUGxhdGVpc2ggPSAodjogc3RyaW5nKSA9PiAvXltBLVpdezJ9WzAtOV17Mn1bQS1aXXszfSQvLnRlc3Qodi5yZXBsYWNlKC9cXHMrL2csICcnKS50b1VwcGVyQ2FzZSgpKTtcclxuXHJcbmNvbnN0IGNhbGNBZ2UgPSAoaXNvRGF0ZTogc3RyaW5nKTogbnVtYmVyIHwgbnVsbCA9PiB7XHJcbiAgaWYgKCFpc29EYXRlKSByZXR1cm4gbnVsbDtcclxuICBjb25zdCBkID0gbmV3IERhdGUoaXNvRGF0ZSk7XHJcbiAgaWYgKE51bWJlci5pc05hTihkLmdldFRpbWUoKSkpIHJldHVybiBudWxsO1xyXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgbGV0IGFnZSA9IG5vdy5nZXRGdWxsWWVhcigpIC0gZC5nZXRGdWxsWWVhcigpO1xyXG4gIGNvbnN0IG0gPSBub3cuZ2V0TW9udGgoKSAtIGQuZ2V0TW9udGgoKTtcclxuICBpZiAobSA8IDAgfHwgKG0gPT09IDAgJiYgbm93LmdldERhdGUoKSA8IGQuZ2V0RGF0ZSgpKSkgYWdlLS07XHJcbiAgcmV0dXJuIGFnZTtcclxufTtcclxuXHJcbnR5cGUgRmllbGRLZXkgPVxyXG4gIHwgJ2ZpcnN0TmFtZSdcclxuICB8ICdtaWRkbGVOYW1lcydcclxuICB8ICdsYXN0TmFtZSdcclxuICB8ICdlbWFpbE9yVXNlcm5hbWUnXHJcbiAgfCAnZGF0ZU9mQmlydGgnXHJcbiAgfCAncGhvbmVOdW1iZXInXHJcbiAgfCAnYWRkcmVzcydcclxuICB8ICdnb3Zlcm5tZW50SWROdW1iZXInXHJcbiAgfCAnaWRGcm9udCdcclxuICB8ICdpZEJhY2snXHJcbiAgfCAnc2VsZmllJ1xyXG4gIHwgJ2xpY2Vuc2VOdW1iZXInXHJcbiAgfCAnbGljZW5zZUNvdW50cnknXHJcbiAgfCAnbGljZW5zZVR5cGUnXHJcbiAgfCAnbGljZW5zZUV4cGlyeSdcclxuICB8ICdsaWNlbnNlUGhvdG8nXHJcbiAgfCAndmVoaWNsZU1ha2UnXHJcbiAgfCAndmVoaWNsZU1vZGVsJ1xyXG4gIHwgJ3ZlaGljbGVZZWFyJ1xyXG4gIHwgJ3ZlaGljbGVDb2xvcidcclxuICB8ICdsaWNlbnNlUGxhdGUnXHJcbiAgfCAncmVnaXN0cmF0aW9uQ291bnRyeSdcclxuICB8ICd2ZWhpY2xlRnJvbnQnXHJcbiAgfCAndmVoaWNsZUJhY2snXHJcbiAgfCAndmVoaWNsZUludGVyaW9yJ1xyXG4gIHwgJ2luc3VyYW5jZVBvbGljeU51bWJlcidcclxuICB8ICdpbnN1cmFuY2VFeHBpcnknXHJcbiAgfCAnYWNjb3VudEhvbGRlck5hbWUnXHJcbiAgfCAnYmFua05hbWUnXHJcbiAgfCAnaWJhbidcclxuICB8ICd0YXhJbmZvJztcclxuXHJcbmNvbnN0IFNlY3Rpb246IFJlYWN0LkZDPHsgdGl0bGU6IHN0cmluZzsgc3VidGl0bGU/OiBzdHJpbmc7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUgfT4gPSAoeyB0aXRsZSwgc3VidGl0bGUsIGNoaWxkcmVuIH0pID0+IChcclxuICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6ICcxNHB4IDAnLCBib3JkZXJUb3A6ICcxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjA4KScgfX0+XHJcbiAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogMTAgfX0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6IDE0LCBmb250V2VpZ2h0OiA3MDAsIGNvbG9yOiAndmFyKC0tdGV4dC1wcmltYXJ5KScgfX0+e3RpdGxlfTwvZGl2PlxyXG4gICAgICB7c3VidGl0bGUgJiYgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogMTIsIGNvbG9yOiAndmFyKC0tdGV4dC1zZWNvbmRhcnkpJywgbWFyZ2luVG9wOiAyIH19PntzdWJ0aXRsZX08L2Rpdj59XHJcbiAgICA8L2Rpdj5cclxuICAgIHtjaGlsZHJlbn1cclxuICA8L2Rpdj5cclxuKTtcclxuXHJcbmNvbnN0IEZpZWxkOiBSZWFjdC5GQzx7XHJcbiAgbGFiZWw6IHN0cmluZztcclxuICB2YWx1ZTogc3RyaW5nO1xyXG4gIG9uQ2hhbmdlOiAodjogc3RyaW5nKSA9PiB2b2lkO1xyXG4gIG9uQmx1cj86ICgpID0+IHZvaWQ7XHJcbiAgcGxhY2Vob2xkZXI/OiBzdHJpbmc7XHJcbiAgdHlwZT86IHN0cmluZztcclxuICByZXF1aXJlZD86IGJvb2xlYW47XHJcbiAgZGlzYWJsZWQ/OiBib29sZWFuO1xyXG4gIGhpbnQ/OiBzdHJpbmc7XHJcbiAgZXJyb3I/OiBzdHJpbmcgfCBudWxsO1xyXG59PiA9ICh7IGxhYmVsLCB2YWx1ZSwgb25DaGFuZ2UsIG9uQmx1ciwgcGxhY2Vob2xkZXIsIHR5cGUgPSAndGV4dCcsIHJlcXVpcmVkLCBkaXNhYmxlZCwgaGludCwgZXJyb3IgfSkgPT4ge1xyXG4gIGNvbnN0IGlucHV0SWQgPSB1c2VJZCgpO1xyXG4gIGNvbnN0IGhpbnRJZCA9IGhpbnQgPyBgJHtpbnB1dElkfS1oaW50YCA6IHVuZGVmaW5lZDtcclxuICBjb25zdCBlcnJJZCA9IGVycm9yID8gYCR7aW5wdXRJZH0tZXJyYCA6IHVuZGVmaW5lZDtcclxuICBjb25zdCBkZXNjcmliZWRCeSA9IFtoaW50SWQsIGVycklkXS5maWx0ZXIoQm9vbGVhbikuam9pbignICcpIHx8IHVuZGVmaW5lZDtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYXV0aC1maWVsZFwiPlxyXG4gICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYXV0aC1sYWJlbFwiIGh0bWxGb3I9e2lucHV0SWR9PlxyXG4gICAgICAgIHtsYWJlbH1cclxuICAgICAgPC9sYWJlbD5cclxuICAgICAgPGlucHV0XHJcbiAgICAgICAgaWQ9e2lucHV0SWR9XHJcbiAgICAgICAgY2xhc3NOYW1lPVwiYXV0aC1pbnB1dFwiXHJcbiAgICAgICAgdmFsdWU9e3ZhbHVlfVxyXG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gb25DaGFuZ2UoZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgIG9uQmx1cj17b25CbHVyfVxyXG4gICAgICAgIHBsYWNlaG9sZGVyPXtwbGFjZWhvbGRlcn1cclxuICAgICAgICB0eXBlPXt0eXBlfVxyXG4gICAgICAgIHJlcXVpcmVkPXtyZXF1aXJlZH1cclxuICAgICAgICBhcmlhLXJlcXVpcmVkPXtyZXF1aXJlZCB8fCB1bmRlZmluZWR9XHJcbiAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxyXG4gICAgICAgIGFyaWEtaW52YWxpZD17Qm9vbGVhbihlcnJvcikgfHwgdW5kZWZpbmVkfVxyXG4gICAgICAgIGFyaWEtZGVzY3JpYmVkYnk9e2Rlc2NyaWJlZEJ5fVxyXG4gICAgICAvPlxyXG4gICAgICB7aGludCAmJiAhZXJyb3IgJiYgKFxyXG4gICAgICAgIDxkaXYgaWQ9e2hpbnRJZH0gc3R5bGU9e3sgbWFyZ2luVG9wOiA2LCBjb2xvcjogJ3ZhcigtLXRleHQtc2Vjb25kYXJ5KScsIGZvbnRTaXplOiAxMiB9fT5cclxuICAgICAgICAgIHtoaW50fVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApfVxyXG4gICAgICB7ZXJyb3IgJiYgKFxyXG4gICAgICAgIDxkaXYgaWQ9e2VycklkfSByb2xlPVwiYWxlcnRcIiBzdHlsZT17eyBtYXJnaW5Ub3A6IDYsIGNvbG9yOiAnI2Y4NzE3MScsIGZvbnRTaXplOiAxMiB9fT5cclxuICAgICAgICAgIHtlcnJvcn1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5jb25zdCBGaWxlRmllbGQ6IFJlYWN0LkZDPHtcclxuICBsYWJlbDogc3RyaW5nO1xyXG4gIG9uUGljazogKGZpbGU6IEZpbGUgfCBudWxsKSA9PiB2b2lkO1xyXG4gIG9uQmx1cj86ICgpID0+IHZvaWQ7XHJcbiAgcmVxdWlyZWQ/OiBib29sZWFuO1xyXG4gIGhpbnQ/OiBzdHJpbmc7XHJcbiAgZXJyb3I/OiBzdHJpbmcgfCBudWxsO1xyXG59PiA9ICh7IGxhYmVsLCBvblBpY2ssIG9uQmx1ciwgcmVxdWlyZWQsIGhpbnQsIGVycm9yIH0pID0+IHtcclxuICBjb25zdCBpbnB1dElkID0gdXNlSWQoKTtcclxuICBjb25zdCBoaW50SWQgPSBoaW50ID8gYCR7aW5wdXRJZH0taGludGAgOiB1bmRlZmluZWQ7XHJcbiAgY29uc3QgZXJySWQgPSBlcnJvciA/IGAke2lucHV0SWR9LWVycmAgOiB1bmRlZmluZWQ7XHJcbiAgY29uc3QgZGVzY3JpYmVkQnkgPSBbaGludElkLCBlcnJJZF0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJyAnKSB8fCB1bmRlZmluZWQ7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImF1dGgtZmllbGRcIj5cclxuICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImF1dGgtbGFiZWxcIiBodG1sRm9yPXtpbnB1dElkfT5cclxuICAgICAgICB7bGFiZWx9XHJcbiAgICAgIDwvbGFiZWw+XHJcbiAgICAgIDxpbnB1dFxyXG4gICAgICAgIGlkPXtpbnB1dElkfVxyXG4gICAgICAgIGNsYXNzTmFtZT1cImF1dGgtaW5wdXRcIlxyXG4gICAgICAgIHN0eWxlPXt7IHBhZGRpbmdUb3A6IDEwIH19XHJcbiAgICAgICAgdHlwZT1cImZpbGVcIlxyXG4gICAgICAgIGFjY2VwdD1cImltYWdlLyosLnBkZlwiXHJcbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBvblBpY2soZS50YXJnZXQuZmlsZXM/LlswXSA/PyBudWxsKX1cclxuICAgICAgICBvbkJsdXI9e29uQmx1cn1cclxuICAgICAgICByZXF1aXJlZD17cmVxdWlyZWR9XHJcbiAgICAgICAgYXJpYS1yZXF1aXJlZD17cmVxdWlyZWQgfHwgdW5kZWZpbmVkfVxyXG4gICAgICAgIGFyaWEtaW52YWxpZD17Qm9vbGVhbihlcnJvcikgfHwgdW5kZWZpbmVkfVxyXG4gICAgICAgIGFyaWEtZGVzY3JpYmVkYnk9e2Rlc2NyaWJlZEJ5fVxyXG4gICAgICAvPlxyXG4gICAgICB7aGludCAmJiAhZXJyb3IgJiYgKFxyXG4gICAgICAgIDxkaXYgaWQ9e2hpbnRJZH0gc3R5bGU9e3sgbWFyZ2luVG9wOiA2LCBjb2xvcjogJ3ZhcigtLXRleHQtc2Vjb25kYXJ5KScsIGZvbnRTaXplOiAxMiB9fT5cclxuICAgICAgICAgIHtoaW50fVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApfVxyXG4gICAgICB7ZXJyb3IgJiYgKFxyXG4gICAgICAgIDxkaXYgaWQ9e2VycklkfSByb2xlPVwiYWxlcnRcIiBzdHlsZT17eyBtYXJnaW5Ub3A6IDYsIGNvbG9yOiAnI2Y4NzE3MScsIGZvbnRTaXplOiAxMiB9fT5cclxuICAgICAgICAgIHtlcnJvcn1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5jb25zdCBEcml2ZXJTaWdudXBQYWdlOiBSZWFjdC5GQzxEcml2ZXJTaWdudXBQYWdlUHJvcHM+ID0gKHsgb25CYWNrLCBvbkNvbXBsZXRlIH0pID0+IHtcclxuICBjb25zdCBkcmFmdCA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgY29uc3QgZnJvbVN0b3JhZ2UgPSBzYWZlSnNvblBhcnNlPERyaXZlclNpZ251cERyYWZ0Pihsb2NhbFN0b3JhZ2UuZ2V0SXRlbShTSUdOVVBfRFJBRlRfS0VZKSk7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBmcm9tU3RvcmFnZSA/PyB7XHJcbiAgICAgICAgZmlyc3ROYW1lOiAnJyxcclxuICAgICAgICBtaWRkbGVOYW1lczogJycsXHJcbiAgICAgICAgbGFzdE5hbWU6ICcnLFxyXG4gICAgICAgIGVtYWlsT3JVc2VybmFtZTogJycsXHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfSwgW10pO1xyXG5cclxuICAvLyBQZXJzb25hbFxyXG4gIGNvbnN0IFtmaXJzdE5hbWUsIHNldEZpcnN0TmFtZV0gPSB1c2VTdGF0ZShkcmFmdC5maXJzdE5hbWUpO1xyXG4gIGNvbnN0IFttaWRkbGVOYW1lcywgc2V0TWlkZGxlTmFtZXNdID0gdXNlU3RhdGUoZHJhZnQubWlkZGxlTmFtZXMpO1xyXG4gIGNvbnN0IFtsYXN0TmFtZSwgc2V0TGFzdE5hbWVdID0gdXNlU3RhdGUoZHJhZnQubGFzdE5hbWUpO1xyXG4gIGNvbnN0IFtlbWFpbE9yVXNlcm5hbWUsIHNldEVtYWlsT3JVc2VybmFtZV0gPSB1c2VTdGF0ZShkcmFmdC5lbWFpbE9yVXNlcm5hbWUpO1xyXG4gIGNvbnN0IFtkYXRlT2ZCaXJ0aCwgc2V0RGF0ZU9mQmlydGhdID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IFtwaG9uZU51bWJlciwgc2V0UGhvbmVOdW1iZXJdID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IFthZGRyZXNzLCBzZXRBZGRyZXNzXSA9IHVzZVN0YXRlKCcnKTtcclxuXHJcbiAgLy8gVmVyaWZpY2F0aW9uXHJcbiAgY29uc3QgW2dvdmVybm1lbnRJZE51bWJlciwgc2V0R292ZXJubWVudElkTnVtYmVyXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbaWRGcm9udCwgc2V0SWRGcm9udF0gPSB1c2VTdGF0ZTxGaWxlIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW2lkQmFjaywgc2V0SWRCYWNrXSA9IHVzZVN0YXRlPEZpbGUgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbc2VsZmllLCBzZXRTZWxmaWVdID0gdXNlU3RhdGU8RmlsZSB8IG51bGw+KG51bGwpO1xyXG5cclxuICAvLyBEcml2ZXIgTGljZW5zZVxyXG4gIGNvbnN0IFtsaWNlbnNlTnVtYmVyLCBzZXRMaWNlbnNlTnVtYmVyXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbbGljZW5zZUNvdW50cnksIHNldExpY2Vuc2VDb3VudHJ5XSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbbGljZW5zZVR5cGUsIHNldExpY2Vuc2VUeXBlXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbbGljZW5zZUV4cGlyeSwgc2V0TGljZW5zZUV4cGlyeV0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW2xpY2Vuc2VQaG90bywgc2V0TGljZW5zZVBob3RvXSA9IHVzZVN0YXRlPEZpbGUgfCBudWxsPihudWxsKTtcclxuXHJcbiAgLy8gVmVoaWNsZVxyXG4gIGNvbnN0IFt2ZWhpY2xlTWFrZSwgc2V0VmVoaWNsZU1ha2VdID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IFt2ZWhpY2xlTW9kZWwsIHNldFZlaGljbGVNb2RlbF0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW3ZlaGljbGVZZWFyLCBzZXRWZWhpY2xlWWVhcl0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW3ZlaGljbGVDb2xvciwgc2V0VmVoaWNsZUNvbG9yXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbbGljZW5zZVBsYXRlLCBzZXRMaWNlbnNlUGxhdGVdID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IFtyZWdpc3RyYXRpb25Db3VudHJ5LCBzZXRSZWdpc3RyYXRpb25Db3VudHJ5XSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbdmVoaWNsZUZyb250LCBzZXRWZWhpY2xlRnJvbnRdID0gdXNlU3RhdGU8RmlsZSB8IG51bGw+KG51bGwpO1xyXG4gIGNvbnN0IFt2ZWhpY2xlQmFjaywgc2V0VmVoaWNsZUJhY2tdID0gdXNlU3RhdGU8RmlsZSB8IG51bGw+KG51bGwpO1xyXG4gIGNvbnN0IFt2ZWhpY2xlSW50ZXJpb3IsIHNldFZlaGljbGVJbnRlcmlvcl0gPSB1c2VTdGF0ZTxGaWxlIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW2luc3VyYW5jZVBvbGljeU51bWJlciwgc2V0SW5zdXJhbmNlUG9saWN5TnVtYmVyXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbaW5zdXJhbmNlRXhwaXJ5LCBzZXRJbnN1cmFuY2VFeHBpcnldID0gdXNlU3RhdGUoJycpO1xyXG5cclxuICAvLyBQYXlvdXRcclxuICBjb25zdCBbYWNjb3VudEhvbGRlck5hbWUsIHNldEFjY291bnRIb2xkZXJOYW1lXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbYmFua05hbWUsIHNldEJhbmtOYW1lXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbaWJhbiwgc2V0SWJhbl0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW3RheEluZm8sIHNldFRheEluZm9dID0gdXNlU3RhdGUoJycpO1xyXG5cclxuICBjb25zdCBbZm9ybUVycm9yLCBzZXRGb3JtRXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW3NhdmVkLCBzZXRTYXZlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW3N1Ym1pdHRpbmcsIHNldFN1Ym1pdHRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICBjb25zdCBbdG91Y2hlZCwgc2V0VG91Y2hlZF0gPSB1c2VTdGF0ZTxSZWNvcmQ8c3RyaW5nLCBib29sZWFuPj4oe30pO1xyXG4gIGNvbnN0IFtmaWVsZEVycm9ycywgc2V0RmllbGRFcnJvcnNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4oe30pO1xyXG4gIGNvbnN0IFtzZXJ2ZXJGaWVsZEVycm9ycywgc2V0U2VydmVyRmllbGRFcnJvcnNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4oe30pO1xyXG5cclxuICBjb25zdCB2YWxpZGF0ZUZpZWxkID0gKGtleTogRmllbGRLZXkpOiBzdHJpbmcgfCBudWxsID0+IHtcclxuICAgIHN3aXRjaCAoa2V5KSB7XHJcbiAgICAgIGNhc2UgJ2ZpcnN0TmFtZSc6XHJcbiAgICAgICAgcmV0dXJuIGZpcnN0TmFtZS50cmltKCkgPyBudWxsIDogJ0ZpcnN0IG5hbWUgaXMgcmVxdWlyZWQuJztcclxuICAgICAgY2FzZSAnbGFzdE5hbWUnOlxyXG4gICAgICAgIHJldHVybiBsYXN0TmFtZS50cmltKCkgPyBudWxsIDogJ0xhc3QgbmFtZSBpcyByZXF1aXJlZC4nO1xyXG4gICAgICBjYXNlICdlbWFpbE9yVXNlcm5hbWUnOiB7XHJcbiAgICAgICAgY29uc3QgdiA9IGVtYWlsT3JVc2VybmFtZS50cmltKCk7XHJcbiAgICAgICAgaWYgKCF2KSByZXR1cm4gJ0VtYWlsIG9yIHVuaXZlcnNpdHkgdXNlcm5hbWUgaXMgcmVxdWlyZWQuJztcclxuICAgICAgICBpZiAoIWlzTGlrZWx5RW1haWwodikgJiYgIWlzTGlrZWx5VW5pVXNlcm5hbWUodikpIHJldHVybiAnVXNlIGFuIGVtYWlsICh5b3VAYmF0aC5hYy51aykgb3IgYSB1c2VybmFtZSAoYWJjMTIzKS4nO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgJ2RhdGVPZkJpcnRoJzoge1xyXG4gICAgICAgIGlmICghZGF0ZU9mQmlydGgpIHJldHVybiAnRGF0ZSBvZiBiaXJ0aCBpcyByZXF1aXJlZC4nO1xyXG4gICAgICAgIGNvbnN0IGFnZSA9IGNhbGNBZ2UoZGF0ZU9mQmlydGgpO1xyXG4gICAgICAgIGlmIChhZ2UgPT09IG51bGwpIHJldHVybiAnSW52YWxpZCBkYXRlLic7XHJcbiAgICAgICAgaWYgKGFnZSA8IDE3KSByZXR1cm4gJ1lvdSBtdXN0IGJlIGF0IGxlYXN0IDE3IHllYXJzIG9sZCB0byBiZSBhIGRyaXZlci4nO1xyXG4gICAgICAgIGlmIChhZ2UgPiAxMDApIHJldHVybiAnUGxlYXNlIGNoZWNrIHlvdXIgZGF0ZSBvZiBiaXJ0aC4nO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgJ3Bob25lTnVtYmVyJzoge1xyXG4gICAgICAgIGNvbnN0IHYgPSBwaG9uZU51bWJlci50cmltKCk7XHJcbiAgICAgICAgaWYgKCF2KSByZXR1cm4gJ1Bob25lIG51bWJlciBpcyByZXF1aXJlZC4nO1xyXG4gICAgICAgIGlmICghaXNFMTY0aXNoKHYpKSByZXR1cm4gJ1VzZSBkaWdpdHMgb25seSAob3B0aW9uYWxseSArKSwgN+KAkzE1IGRpZ2l0cyAoZS5nLiArNDQ3OTExMTIzNDU2KS4nO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgJ2FkZHJlc3MnOiB7XHJcbiAgICAgICAgY29uc3QgdiA9IGFkZHJlc3MudHJpbSgpO1xyXG4gICAgICAgIGlmICghdikgcmV0dXJuICdBZGRyZXNzIGlzIHJlcXVpcmVkLic7XHJcbiAgICAgICAgaWYgKHYubGVuZ3RoIDwgOCkgcmV0dXJuICdQbGVhc2UgZW50ZXIgYSBmdWxsIGFkZHJlc3MgKGluY2x1ZGUgcG9zdGNvZGUpLic7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAnZ292ZXJubWVudElkTnVtYmVyJzoge1xyXG4gICAgICAgIGNvbnN0IHYgPSBnb3Zlcm5tZW50SWROdW1iZXIudHJpbSgpO1xyXG4gICAgICAgIGlmICghdikgcmV0dXJuICdHb3Zlcm5tZW50IElEIG51bWJlciBpcyByZXF1aXJlZC4nO1xyXG4gICAgICAgIGlmICh2Lmxlbmd0aCA8IDUpIHJldHVybiAnR292ZXJubWVudCBJRCBudW1iZXIgbG9va3MgdG9vIHNob3J0Lic7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAnaWRGcm9udCc6XHJcbiAgICAgICAgcmV0dXJuIGlkRnJvbnQgPyBudWxsIDogJ0Zyb250IGltYWdlL1BERiBpcyByZXF1aXJlZC4nO1xyXG4gICAgICBjYXNlICdpZEJhY2snOlxyXG4gICAgICAgIHJldHVybiBpZEJhY2sgPyBudWxsIDogJ0JhY2sgaW1hZ2UvUERGIGlzIHJlcXVpcmVkLic7XHJcbiAgICAgIGNhc2UgJ3NlbGZpZSc6XHJcbiAgICAgICAgcmV0dXJuIHNlbGZpZSA/IG51bGwgOiAnU2VsZmllIGlzIHJlcXVpcmVkLic7XHJcbiAgICAgIGNhc2UgJ2xpY2Vuc2VOdW1iZXInOiB7XHJcbiAgICAgICAgY29uc3QgdiA9IGxpY2Vuc2VOdW1iZXIudHJpbSgpO1xyXG4gICAgICAgIGlmICghdikgcmV0dXJuICdEcml2aW5nIGxpY2VuY2UgbnVtYmVyIGlzIHJlcXVpcmVkLic7XHJcbiAgICAgICAgY29uc3QgY29tcGFjdCA9IHYucmVwbGFjZSgvXFxzKy9nLCAnJykudG9VcHBlckNhc2UoKTtcclxuICAgICAgICBpZiAoY29tcGFjdC5sZW5ndGggIT09IDE2KSByZXR1cm4gJ011c3QgYmUgMTYgY2hhcmFjdGVycyAoc3BhY2VzIGlnbm9yZWQpLic7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAnbGljZW5zZUV4cGlyeSc6IHtcclxuICAgICAgICBpZiAoIWxpY2Vuc2VFeHBpcnkpIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IGQgPSBuZXcgRGF0ZShsaWNlbnNlRXhwaXJ5KTtcclxuICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKGQuZ2V0VGltZSgpKSkgcmV0dXJuICdJbnZhbGlkIGV4cGlyeSBkYXRlLic7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAndmVoaWNsZU1ha2UnOlxyXG4gICAgICAgIHJldHVybiB2ZWhpY2xlTWFrZS50cmltKCkgPyBudWxsIDogJ1ZlaGljbGUgbWFrZSBpcyByZXF1aXJlZC4nO1xyXG4gICAgICBjYXNlICd2ZWhpY2xlTW9kZWwnOlxyXG4gICAgICAgIHJldHVybiB2ZWhpY2xlTW9kZWwudHJpbSgpID8gbnVsbCA6ICdWZWhpY2xlIG1vZGVsIGlzIHJlcXVpcmVkLic7XHJcbiAgICAgIGNhc2UgJ3ZlaGljbGVZZWFyJzoge1xyXG4gICAgICAgIGNvbnN0IHYgPSB2ZWhpY2xlWWVhci50cmltKCk7XHJcbiAgICAgICAgaWYgKCF2KSByZXR1cm4gJ1ZlaGljbGUgeWVhciBpcyByZXF1aXJlZC4nO1xyXG4gICAgICAgIGNvbnN0IG4gPSBOdW1iZXIodik7XHJcbiAgICAgICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUobikgfHwgIU51bWJlci5pc0ludGVnZXIobikpIHJldHVybiAnWWVhciBtdXN0IGJlIGEgd2hvbGUgbnVtYmVyLic7XHJcbiAgICAgICAgY29uc3QgY3VycmVudFllYXIgPSBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgaWYgKG4gPCAxOTgwIHx8IG4gPiBjdXJyZW50WWVhciArIDEpIHJldHVybiBgWWVhciBtdXN0IGJlIGJldHdlZW4gMTk4MCBhbmQgJHtjdXJyZW50WWVhciArIDF9LmA7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAnbGljZW5zZVBsYXRlJzoge1xyXG4gICAgICAgIGNvbnN0IHYgPSBsaWNlbnNlUGxhdGUudHJpbSgpO1xyXG4gICAgICAgIGlmICghdikgcmV0dXJuICdMaWNlbnNlIHBsYXRlIGlzIHJlcXVpcmVkLic7XHJcbiAgICAgICAgaWYgKCFpc1VrUGxhdGVpc2godikpIHJldHVybiAnSW52YWxpZCBVSyBwbGF0ZSBmb3JtYXQgKGUuZy4gQUIxMiBDREUpLic7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAnaW5zdXJhbmNlRXhwaXJ5Jzoge1xyXG4gICAgICAgIGlmICghaW5zdXJhbmNlRXhwaXJ5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICBjb25zdCBkID0gbmV3IERhdGUoaW5zdXJhbmNlRXhwaXJ5KTtcclxuICAgICAgICBpZiAoTnVtYmVyLmlzTmFOKGQuZ2V0VGltZSgpKSkgcmV0dXJuICdJbnZhbGlkIGluc3VyYW5jZSBleHBpcnkgZGF0ZS4nO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgJ2liYW4nOiB7XHJcbiAgICAgICAgaWYgKCFpYmFuLnRyaW0oKSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgaWYgKCEvXihbQS1aXXsyfVswLTldezJ9W0EtWjAtOV17MTAsMzB9KSQvaS50ZXN0KGliYW4ucmVwbGFjZSgvXFxzKy9nLCAnJykpKSByZXR1cm4gJ0ludmFsaWQgSUJBTiBmb3JtYXQuJztcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHZhbGlkYXRlQWxsID0gKCk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPT4ge1xyXG4gICAgY29uc3Qga2V5czogRmllbGRLZXlbXSA9IFtcclxuICAgICAgJ2ZpcnN0TmFtZScsXHJcbiAgICAgICdsYXN0TmFtZScsXHJcbiAgICAgICdlbWFpbE9yVXNlcm5hbWUnLFxyXG4gICAgICAnZGF0ZU9mQmlydGgnLFxyXG4gICAgICAncGhvbmVOdW1iZXInLFxyXG4gICAgICAnYWRkcmVzcycsXHJcbiAgICAgICdnb3Zlcm5tZW50SWROdW1iZXInLFxyXG4gICAgICAnaWRGcm9udCcsXHJcbiAgICAgICdpZEJhY2snLFxyXG4gICAgICAnc2VsZmllJyxcclxuICAgICAgJ2xpY2Vuc2VOdW1iZXInLFxyXG4gICAgICAndmVoaWNsZU1ha2UnLFxyXG4gICAgICAndmVoaWNsZU1vZGVsJyxcclxuICAgICAgJ3ZlaGljbGVZZWFyJyxcclxuICAgICAgJ2xpY2Vuc2VQbGF0ZScsXHJcbiAgICBdO1xyXG5cclxuICAgIGNvbnN0IGVycm9yczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xyXG4gICAgZm9yIChjb25zdCBrIG9mIGtleXMpIHtcclxuICAgICAgY29uc3QgZSA9IHZhbGlkYXRlRmllbGQoayk7XHJcbiAgICAgIGlmIChlKSBlcnJvcnNba10gPSBlO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKHNlcnZlckZpZWxkRXJyb3JzKSkge1xyXG4gICAgICBlcnJvcnNba10gPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlcnJvcnM7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgbWFya1RvdWNoZWQgPSAoazogRmllbGRLZXkpID0+IHNldFRvdWNoZWQoKHQpID0+ICh7IC4uLnQsIFtrXTogdHJ1ZSB9KSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBleGlzdGluZyA9IHNhZmVKc29uUGFyc2U8YW55Pihsb2NhbFN0b3JhZ2UuZ2V0SXRlbShEUklWRVJfQVBQTElDQVRJT05fS0VZKSk7XHJcbiAgICBpZiAoIWV4aXN0aW5nKSByZXR1cm47XHJcbiAgICBzZXREYXRlT2ZCaXJ0aChleGlzdGluZz8uZHJpdmVyPy5kYXRlX29mX2JpcnRoID8/ICcnKTtcclxuICAgIHNldFBob25lTnVtYmVyKGV4aXN0aW5nPy5kcml2ZXI/LnBob25lX251bWJlciA/PyAnJyk7XHJcbiAgICBzZXRBZGRyZXNzKGV4aXN0aW5nPy5kcml2ZXI/LmFkZHJlc3MgPz8gJycpO1xyXG4gICAgc2V0R292ZXJubWVudElkTnVtYmVyKGV4aXN0aW5nPy5kcml2ZXI/LmdvdmVybm1lbnRfaWRfbnVtYmVyID8/ICcnKTtcclxuICAgIHNldExpY2Vuc2VOdW1iZXIoZXhpc3Rpbmc/LmxpY2Vuc2U/LmxpY2Vuc2VfbnVtYmVyID8/ICcnKTtcclxuICAgIHNldExpY2Vuc2VDb3VudHJ5KGV4aXN0aW5nPy5saWNlbnNlPy5saWNlbnNlX2NvdW50cnkgPz8gJycpO1xyXG4gICAgc2V0TGljZW5zZVR5cGUoZXhpc3Rpbmc/LmxpY2Vuc2U/LmxpY2Vuc2VfdHlwZSA/PyAnJyk7XHJcbiAgICBzZXRMaWNlbnNlRXhwaXJ5KGV4aXN0aW5nPy5saWNlbnNlPy5leHBpcnlfZGF0ZSA/PyAnJyk7XHJcbiAgICBzZXRWZWhpY2xlTWFrZShleGlzdGluZz8udmVoaWNsZT8ubWFrZSA/PyAnJyk7XHJcbiAgICBzZXRWZWhpY2xlTW9kZWwoZXhpc3Rpbmc/LnZlaGljbGU/Lm1vZGVsID8/ICcnKTtcclxuICAgIHNldFZlaGljbGVZZWFyKFN0cmluZyhleGlzdGluZz8udmVoaWNsZT8ueWVhciA/PyAnJykpO1xyXG4gICAgc2V0VmVoaWNsZUNvbG9yKGV4aXN0aW5nPy52ZWhpY2xlPy5jb2xvciA/PyAnJyk7XHJcbiAgICBzZXRMaWNlbnNlUGxhdGUoZXhpc3Rpbmc/LnZlaGljbGU/LmxpY2Vuc2VfcGxhdGUgPz8gJycpO1xyXG4gICAgc2V0UmVnaXN0cmF0aW9uQ291bnRyeShleGlzdGluZz8udmVoaWNsZT8ucmVnaXN0cmF0aW9uX2NvdW50cnkgPz8gJycpO1xyXG4gICAgc2V0SW5zdXJhbmNlUG9saWN5TnVtYmVyKGV4aXN0aW5nPy52ZWhpY2xlPy5pbnN1cmFuY2VfcG9saWN5X251bWJlciA/PyAnJyk7XHJcbiAgICBzZXRJbnN1cmFuY2VFeHBpcnkoZXhpc3Rpbmc/LnZlaGljbGU/Lmluc3VyYW5jZV9leHBpcnkgPz8gJycpO1xyXG4gICAgc2V0QWNjb3VudEhvbGRlck5hbWUoZXhpc3Rpbmc/LnBheW91dD8uYWNjb3VudF9ob2xkZXJfbmFtZSA/PyAnJyk7XHJcbiAgICBzZXRCYW5rTmFtZShleGlzdGluZz8ucGF5b3V0Py5iYW5rX25hbWUgPz8gJycpO1xyXG4gICAgc2V0SWJhbihleGlzdGluZz8ucGF5b3V0Py5pYmFuID8/ICcnKTtcclxuICAgIHNldFRheEluZm8oZXhpc3Rpbmc/LnRheF9pbmZvID8/ICcnKTtcclxuICB9LCBbXSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBuZXh0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0geyAuLi5maWVsZEVycm9ycyB9O1xyXG4gICAgKE9iamVjdC5rZXlzKHRvdWNoZWQpIGFzIEZpZWxkS2V5W10pLmZvckVhY2goKGspID0+IHtcclxuICAgICAgaWYgKCF0b3VjaGVkW2tdKSByZXR1cm47XHJcbiAgICAgIGNvbnN0IGUgPSB2YWxpZGF0ZUZpZWxkKGspO1xyXG4gICAgICBpZiAoZSkgbmV4dFtrXSA9IGU7XHJcbiAgICAgIGVsc2UgZGVsZXRlIG5leHRba107XHJcbiAgICB9KTtcclxuICAgIHNldEZpZWxkRXJyb3JzKG5leHQpO1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlYWN0LWhvb2tzL2V4aGF1c3RpdmUtZGVwc1xyXG4gIH0sIFtcclxuICAgIGZpcnN0TmFtZSxcclxuICAgIGxhc3ROYW1lLFxyXG4gICAgZW1haWxPclVzZXJuYW1lLFxyXG4gICAgZGF0ZU9mQmlydGgsXHJcbiAgICBwaG9uZU51bWJlcixcclxuICAgIGFkZHJlc3MsXHJcbiAgICBnb3Zlcm5tZW50SWROdW1iZXIsXHJcbiAgICBpZEZyb250LFxyXG4gICAgaWRCYWNrLFxyXG4gICAgc2VsZmllLFxyXG4gICAgbGljZW5zZU51bWJlcixcclxuICAgIGxpY2Vuc2VFeHBpcnksXHJcbiAgICB2ZWhpY2xlTWFrZSxcclxuICAgIHZlaGljbGVNb2RlbCxcclxuICAgIHZlaGljbGVZZWFyLFxyXG4gICAgbGljZW5zZVBsYXRlLFxyXG4gICAgaW5zdXJhbmNlRXhwaXJ5LFxyXG4gICAgaWJhbixcclxuICBdKTtcclxuXHJcbiAgY29uc3QgdmFsaWRhdGVUaW1lciA9IHVzZVJlZjxudW1iZXIgfCBudWxsPihudWxsKTtcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKHZhbGlkYXRlVGltZXIuY3VycmVudCkgd2luZG93LmNsZWFyVGltZW91dCh2YWxpZGF0ZVRpbWVyLmN1cnJlbnQpO1xyXG5cclxuICAgIGNvbnN0IHNob3VsZFZhbGlkYXRlID0gQm9vbGVhbih0b3VjaGVkLmxpY2Vuc2VOdW1iZXIgfHwgdG91Y2hlZC5saWNlbnNlUGxhdGUpO1xyXG4gICAgaWYgKCFzaG91bGRWYWxpZGF0ZSkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGxpYyA9IGxpY2Vuc2VOdW1iZXIudHJpbSgpO1xyXG4gICAgY29uc3QgcmVnID0gbGljZW5zZVBsYXRlLnRyaW0oKTtcclxuXHJcbiAgICB2YWxpZGF0ZVRpbWVyLmN1cnJlbnQgPSB3aW5kb3cuc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcGF5bG9hZDogYW55ID0ge307XHJcbiAgICAgICAgaWYgKGxpYykgcGF5bG9hZC5saWNlbmNlX251bWJlciA9IGxpYztcclxuICAgICAgICBpZiAocmVnKSBwYXlsb2FkLnZlaGljbGVfcmVnaXN0cmF0aW9uID0gcmVnO1xyXG4gICAgICAgIGlmICghcGF5bG9hZC5saWNlbmNlX251bWJlciAmJiAhcGF5bG9hZC52ZWhpY2xlX3JlZ2lzdHJhdGlvbikgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBhcGlGZXRjaDxhbnk+KCdkcml2ZXJzL3ZhbGlkYXRlJywge1xyXG4gICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBuZXh0U2VydmVyRXJyb3JzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XHJcbiAgICAgICAgY29uc3QgZmUgPSByZXM/LmZpZWxkX2Vycm9ycyA/PyB7fTtcclxuICAgICAgICBpZiAoZmUubGljZW5jZV9udW1iZXIpIG5leHRTZXJ2ZXJFcnJvcnMubGljZW5zZU51bWJlciA9IFN0cmluZyhmZS5saWNlbmNlX251bWJlcik7XHJcbiAgICAgICAgaWYgKGZlLnZlaGljbGVfcmVnaXN0cmF0aW9uKSBuZXh0U2VydmVyRXJyb3JzLmxpY2Vuc2VQbGF0ZSA9IFN0cmluZyhmZS52ZWhpY2xlX3JlZ2lzdHJhdGlvbik7XHJcblxyXG4gICAgICAgIHNldFNlcnZlckZpZWxkRXJyb3JzKG5leHRTZXJ2ZXJFcnJvcnMpO1xyXG4gICAgICB9IGNhdGNoIHtcclxuICAgICAgICBzZXRTZXJ2ZXJGaWVsZEVycm9ycyh7fSk7XHJcbiAgICAgIH1cclxuICAgIH0sIDQ1MCk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgaWYgKHZhbGlkYXRlVGltZXIuY3VycmVudCkgd2luZG93LmNsZWFyVGltZW91dCh2YWxpZGF0ZVRpbWVyLmN1cnJlbnQpO1xyXG4gICAgfTtcclxuICB9LCBbbGljZW5zZU51bWJlciwgbGljZW5zZVBsYXRlLCB0b3VjaGVkLmxpY2Vuc2VOdW1iZXIsIHRvdWNoZWQubGljZW5zZVBsYXRlXSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZVN1Ym1pdCA9IGFzeW5jIChlOiBSZWFjdC5Gb3JtRXZlbnQpID0+IHtcclxuICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIHNldEZvcm1FcnJvcihudWxsKTtcclxuICAgIHNldFNhdmVkKGZhbHNlKTtcclxuXHJcbiAgICBjb25zdCByZXF1aXJlZEtleXM6IEZpZWxkS2V5W10gPSBbXHJcbiAgICAgICdmaXJzdE5hbWUnLFxyXG4gICAgICAnbGFzdE5hbWUnLFxyXG4gICAgICAnZW1haWxPclVzZXJuYW1lJyxcclxuICAgICAgJ2RhdGVPZkJpcnRoJyxcclxuICAgICAgJ3Bob25lTnVtYmVyJyxcclxuICAgICAgJ2FkZHJlc3MnLFxyXG4gICAgICAnZ292ZXJubWVudElkTnVtYmVyJyxcclxuICAgICAgJ2lkRnJvbnQnLFxyXG4gICAgICAnaWRCYWNrJyxcclxuICAgICAgJ3NlbGZpZScsXHJcbiAgICAgICdsaWNlbnNlTnVtYmVyJyxcclxuICAgICAgJ3ZlaGljbGVNYWtlJyxcclxuICAgICAgJ3ZlaGljbGVNb2RlbCcsXHJcbiAgICAgICd2ZWhpY2xlWWVhcicsXHJcbiAgICAgICdsaWNlbnNlUGxhdGUnLFxyXG4gICAgXTtcclxuICAgIHNldFRvdWNoZWQoKHQpID0+IHtcclxuICAgICAgY29uc3QgbmV4dCA9IHsgLi4udCB9O1xyXG4gICAgICByZXF1aXJlZEtleXMuZm9yRWFjaCgoaykgPT4gKG5leHRba10gPSB0cnVlKSk7XHJcbiAgICAgIHJldHVybiBuZXh0O1xyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZXJyb3JzID0gdmFsaWRhdGVBbGwoKTtcclxuICAgIHNldEZpZWxkRXJyb3JzKGVycm9ycyk7XHJcblxyXG4gICAgaWYgKE9iamVjdC5rZXlzKGVycm9ycykubGVuZ3RoID4gMCkge1xyXG4gICAgICBzZXRGb3JtRXJyb3IoJ1BsZWFzZSBmaXggdGhlIGhpZ2hsaWdodGVkIGZpZWxkcy4nKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFN1Ym1pdHRpbmcodHJ1ZSk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBhcHBsaWNhdGlvbiA9IHtcclxuICAgICAgICBzdWJtaXR0ZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgICBkcml2ZXI6IHtcclxuICAgICAgICAgIGZpcnN0X25hbWU6IGZpcnN0TmFtZS50cmltKCksXHJcbiAgICAgICAgICBtaWRkbGVfbmFtZXM6IG1pZGRsZU5hbWVzLnRyaW0oKSxcclxuICAgICAgICAgIGxhc3RfbmFtZTogbGFzdE5hbWUudHJpbSgpLFxyXG4gICAgICAgICAgZW1haWxfb3JfdXNlcm5hbWU6IGVtYWlsT3JVc2VybmFtZS50cmltKCksXHJcbiAgICAgICAgICBkYXRlX29mX2JpcnRoOiBkYXRlT2ZCaXJ0aCxcclxuICAgICAgICAgIHBob25lX251bWJlcjogcGhvbmVOdW1iZXIudHJpbSgpLFxyXG4gICAgICAgICAgYWRkcmVzczogYWRkcmVzcy50cmltKCksXHJcbiAgICAgICAgICBnb3Zlcm5tZW50X2lkX251bWJlcjogZ292ZXJubWVudElkTnVtYmVyLnRyaW0oKSxcclxuICAgICAgICAgIGlkX2RvY3VtZW50X2Zyb250X2ZpbGVuYW1lOiBpZEZyb250Py5uYW1lID8/IG51bGwsXHJcbiAgICAgICAgICBpZF9kb2N1bWVudF9iYWNrX2ZpbGVuYW1lOiBpZEJhY2s/Lm5hbWUgPz8gbnVsbCxcclxuICAgICAgICAgIHNlbGZpZV9maWxlbmFtZTogc2VsZmllPy5uYW1lID8/IG51bGwsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBsaWNlbnNlOiB7XHJcbiAgICAgICAgICBsaWNlbnNlX251bWJlcjogbGljZW5zZU51bWJlci50cmltKCksXHJcbiAgICAgICAgICBsaWNlbnNlX2NvdW50cnk6IGxpY2Vuc2VDb3VudHJ5LnRyaW0oKSxcclxuICAgICAgICAgIGxpY2Vuc2VfdHlwZTogbGljZW5zZVR5cGUudHJpbSgpLFxyXG4gICAgICAgICAgZXhwaXJ5X2RhdGU6IGxpY2Vuc2VFeHBpcnksXHJcbiAgICAgICAgICBsaWNlbnNlX3Bob3RvX2ZpbGVuYW1lOiBsaWNlbnNlUGhvdG8/Lm5hbWUgPz8gbnVsbCxcclxuICAgICAgICAgIGJhY2tncm91bmRfY2hlY2tfc3RhdHVzOiAncGVuZGluZycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB2ZWhpY2xlOiB7XHJcbiAgICAgICAgICBtYWtlOiB2ZWhpY2xlTWFrZS50cmltKCksXHJcbiAgICAgICAgICBtb2RlbDogdmVoaWNsZU1vZGVsLnRyaW0oKSxcclxuICAgICAgICAgIHllYXI6IE51bWJlcih2ZWhpY2xlWWVhciksXHJcbiAgICAgICAgICBjb2xvcjogdmVoaWNsZUNvbG9yLnRyaW0oKSxcclxuICAgICAgICAgIGxpY2Vuc2VfcGxhdGU6IGxpY2Vuc2VQbGF0ZS50cmltKCksXHJcbiAgICAgICAgICByZWdpc3RyYXRpb25fY291bnRyeTogcmVnaXN0cmF0aW9uQ291bnRyeS50cmltKCksXHJcbiAgICAgICAgICBpbnN1cmFuY2VfcG9saWN5X251bWJlcjogaW5zdXJhbmNlUG9saWN5TnVtYmVyLnRyaW0oKSxcclxuICAgICAgICAgIGluc3VyYW5jZV9leHBpcnk6IGluc3VyYW5jZUV4cGlyeSxcclxuICAgICAgICAgIHZlaGljbGVfcGhvdG9fZmlsZW5hbWVzOiBbdmVoaWNsZUZyb250Py5uYW1lLCB2ZWhpY2xlQmFjaz8ubmFtZSwgdmVoaWNsZUludGVyaW9yPy5uYW1lXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgICAgICAgICBhcHByb3ZlZDogZmFsc2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBwYXlvdXQ6IHtcclxuICAgICAgICAgIGFjY291bnRfaG9sZGVyX25hbWU6IGFjY291bnRIb2xkZXJOYW1lLnRyaW0oKSxcclxuICAgICAgICAgIGJhbmtfbmFtZTogYmFua05hbWUudHJpbSgpLFxyXG4gICAgICAgICAgaWJhbjogaWJhbi50cmltKCksXHJcbiAgICAgICAgICB2ZXJpZmllZDogZmFsc2UsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0YXhfaW5mbzogdGF4SW5mby50cmltKCksXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShEUklWRVJfQVBQTElDQVRJT05fS0VZLCBKU09OLnN0cmluZ2lmeShhcHBsaWNhdGlvbikpO1xyXG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcclxuICAgICAgICBTSUdOVVBfRFJBRlRfS0VZLFxyXG4gICAgICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIGZpcnN0TmFtZTogZmlyc3ROYW1lLnRyaW0oKSxcclxuICAgICAgICAgIG1pZGRsZU5hbWVzOiBtaWRkbGVOYW1lcy50cmltKCksXHJcbiAgICAgICAgICBsYXN0TmFtZTogbGFzdE5hbWUudHJpbSgpLFxyXG4gICAgICAgICAgZW1haWxPclVzZXJuYW1lOiBlbWFpbE9yVXNlcm5hbWUudHJpbSgpLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBhd2FpdCBhcGlGZXRjaCgnZHJpdmVycy91cGdyYWRlJywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgIGxpY2VuY2VfbnVtYmVyOiBsaWNlbnNlTnVtYmVyLnRyaW0oKSxcclxuICAgICAgICAgIHZlaGljbGVfcmVnaXN0cmF0aW9uOiBsaWNlbnNlUGxhdGUudHJpbSgpLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHNldFNhdmVkKHRydWUpO1xyXG4gICAgICBvbkNvbXBsZXRlKCk7XHJcbiAgICB9IGNhdGNoIChlcnI6IGFueSkge1xyXG4gICAgICBjb25zdCBkZXRhaWwgPSBlcnI/LmRldGFpbCA/PyBudWxsO1xyXG4gICAgICBjb25zdCBmZSA9IGRldGFpbD8uZmllbGRfZXJyb3JzID8/IG51bGw7XHJcblxyXG4gICAgICBpZiAoZmUgJiYgdHlwZW9mIGZlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGNvbnN0IG5leHRTZXJ2ZXJFcnJvcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcclxuICAgICAgICBpZiAoZmUubGljZW5jZV9udW1iZXIpIG5leHRTZXJ2ZXJFcnJvcnMubGljZW5zZU51bWJlciA9IFN0cmluZyhmZS5saWNlbmNlX251bWJlcik7XHJcbiAgICAgICAgaWYgKGZlLnZlaGljbGVfcmVnaXN0cmF0aW9uKSBuZXh0U2VydmVyRXJyb3JzLmxpY2Vuc2VQbGF0ZSA9IFN0cmluZyhmZS52ZWhpY2xlX3JlZ2lzdHJhdGlvbik7XHJcbiAgICAgICAgc2V0U2VydmVyRmllbGRFcnJvcnMobmV4dFNlcnZlckVycm9ycyk7XHJcbiAgICAgICAgc2V0Rm9ybUVycm9yKCdQbGVhc2UgZml4IHRoZSBoaWdobGlnaHRlZCBmaWVsZHMuJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0Rm9ybUVycm9yKGVycj8ubWVzc2FnZSA/PyAnRHJpdmVyIHNpZ251cCBmYWlsZWQuIFBsZWFzZSBjaGVjayB5b3VyIGRldGFpbHMgYW5kIHRyeSBhZ2Fpbi4nKTtcclxuICAgICAgfVxyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0U3VibWl0dGluZyhmYWxzZSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgbWVyZ2VkRXJyb3IgPSAoazogRmllbGRLZXkpID0+IHtcclxuICAgIGNvbnN0IGEgPSBmaWVsZEVycm9yc1trXTtcclxuICAgIGNvbnN0IGIgPSBzZXJ2ZXJGaWVsZEVycm9yc1trXTtcclxuICAgIHJldHVybiBiID8/IGEgPz8gbnVsbDtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJhdXRoLXdyYXBwZXJcIj5cclxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6IDEwLCBtYXJnaW5Cb3R0b206IDggfX0+XHJcbiAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICBvbkNsaWNrPXtvbkJhY2t9XHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLFxyXG4gICAgICAgICAgICBib3JkZXI6ICdub25lJyxcclxuICAgICAgICAgICAgY29sb3I6ICcjZTVlN2ViJyxcclxuICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXHJcbiAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIGdhcDogOCxcclxuICAgICAgICAgICAgcGFkZGluZzogMCxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge0JhY2tJY29ufVxyXG4gICAgICAgICAgQmFja1xyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxoMSBjbGFzc05hbWU9XCJhdXRoLXRpdGxlXCI+RHJpdmVyIHNpZ24tdXA8L2gxPlxyXG4gICAgICA8cCBjbGFzc05hbWU9XCJhdXRoLXN1YnRpdGxlXCI+XHJcbiAgICAgICAgQ29tcGxldGUgeW91ciBkcml2ZXIgcHJvZmlsZS4gV2UmYXBvcztsbCBtYXJrIHlvdXIgc3RhdHVzIGFzIDxiPnBlbmRpbmcgdmVyaWZpY2F0aW9uPC9iPiBvbmNlIHlvdSBzdWJtaXQuXHJcbiAgICAgIDwvcD5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXV0aC1jYXJkXCI+XHJcbiAgICAgICAge2Zvcm1FcnJvciAmJiA8cCBzdHlsZT17eyBjb2xvcjogJyNmODcxNzEnLCBmb250U2l6ZTogJzE0cHgnLCBtYXJnaW5Cb3R0b206ICcxMnB4JyB9fT57Zm9ybUVycm9yfTwvcD59XHJcbiAgICAgICAge3NhdmVkICYmIChcclxuICAgICAgICAgIDxwIHN0eWxlPXt7IGNvbG9yOiAnIzM0ZDM5OScsIGZvbnRTaXplOiAnMTRweCcsIG1hcmdpbkJvdHRvbTogJzEycHgnIH19PlxyXG4gICAgICAgICAgICBTYXZlZC4gWW91ciBkcml2ZXIgYXBwbGljYXRpb24gaXMgbm93IHBlbmRpbmcgdmVyaWZpY2F0aW9uLlxyXG4gICAgICAgICAgPC9wPlxyXG4gICAgICAgICl9XHJcblxyXG4gICAgICAgIDxmb3JtIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9PlxyXG4gICAgICAgICAgPFNlY3Rpb24gdGl0bGU9XCJQZXJzb25hbCBkZXRhaWxzXCIgc3VidGl0bGU9XCJUaGVzZSBjb21lIGZyb20geW91ciBhY2NvdW50IHNpZ24tdXAsIGJ1dCB5b3UgY2FuIGNvcnJlY3QgdGhlbSBoZXJlLlwiPlxyXG4gICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJGaXJzdCBuYW1lXCIgdmFsdWU9e2ZpcnN0TmFtZX0gb25DaGFuZ2U9e3NldEZpcnN0TmFtZX0gb25CbHVyPXsoKSA9PiBtYXJrVG91Y2hlZCgnZmlyc3ROYW1lJyl9IHJlcXVpcmVkIGVycm9yPXttZXJnZWRFcnJvcignZmlyc3ROYW1lJyl9IC8+XHJcbiAgICAgICAgICAgIDxGaWVsZCBsYWJlbD1cIk1pZGRsZSBuYW1lcyAob3B0aW9uYWwpXCIgdmFsdWU9e21pZGRsZU5hbWVzfSBvbkNoYW5nZT17c2V0TWlkZGxlTmFtZXN9IG9uQmx1cj17KCkgPT4gbWFya1RvdWNoZWQoJ21pZGRsZU5hbWVzJyl9IC8+XHJcbiAgICAgICAgICAgIDxGaWVsZCBsYWJlbD1cIkxhc3QgbmFtZVwiIHZhbHVlPXtsYXN0TmFtZX0gb25DaGFuZ2U9e3NldExhc3ROYW1lfSBvbkJsdXI9eygpID0+IG1hcmtUb3VjaGVkKCdsYXN0TmFtZScpfSByZXF1aXJlZCBlcnJvcj17bWVyZ2VkRXJyb3IoJ2xhc3ROYW1lJyl9IC8+XHJcbiAgICAgICAgICAgIDxGaWVsZFxyXG4gICAgICAgICAgICAgIGxhYmVsPVwiRW1haWwgb3IgdW5pdmVyc2l0eSB1c2VybmFtZVwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e2VtYWlsT3JVc2VybmFtZX1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0RW1haWxPclVzZXJuYW1lfVxyXG4gICAgICAgICAgICAgIG9uQmx1cj17KCkgPT4gbWFya1RvdWNoZWQoJ2VtYWlsT3JVc2VybmFtZScpfVxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwieW91QGJhdGguYWMudWsgb3IgYWJjMTIzXCJcclxuICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgIGVycm9yPXttZXJnZWRFcnJvcignZW1haWxPclVzZXJuYW1lJyl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxGaWVsZFxyXG4gICAgICAgICAgICAgIGxhYmVsPVwiRGF0ZSBvZiBiaXJ0aFwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e2RhdGVPZkJpcnRofVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXtzZXREYXRlT2ZCaXJ0aH1cclxuICAgICAgICAgICAgICBvbkJsdXI9eygpID0+IG1hcmtUb3VjaGVkKCdkYXRlT2ZCaXJ0aCcpfVxyXG4gICAgICAgICAgICAgIHR5cGU9XCJkYXRlXCJcclxuICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgIGVycm9yPXttZXJnZWRFcnJvcignZGF0ZU9mQmlydGgnKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPEZpZWxkXHJcbiAgICAgICAgICAgICAgbGFiZWw9XCJQaG9uZSBudW1iZXJcIlxyXG4gICAgICAgICAgICAgIHZhbHVlPXtwaG9uZU51bWJlcn1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0UGhvbmVOdW1iZXJ9XHJcbiAgICAgICAgICAgICAgb25CbHVyPXsoKSA9PiBtYXJrVG91Y2hlZCgncGhvbmVOdW1iZXInKX1cclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIis0NDc5MTExMjM0NTZcIlxyXG4gICAgICAgICAgICAgIGhpbnQ9XCJEaWdpdHMgb25seSAob3B0aW9uYWxseSArKS4gRXhhbXBsZTogKzQ0NzkxMTEyMzQ1NlwiXHJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICBlcnJvcj17bWVyZ2VkRXJyb3IoJ3Bob25lTnVtYmVyJyl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxGaWVsZFxyXG4gICAgICAgICAgICAgIGxhYmVsPVwiUmVzaWRlbnRpYWwgYWRkcmVzc1wiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e2FkZHJlc3N9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldEFkZHJlc3N9XHJcbiAgICAgICAgICAgICAgb25CbHVyPXsoKSA9PiBtYXJrVG91Y2hlZCgnYWRkcmVzcycpfVxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRmxhdCwgc3RyZWV0LCBjaXR5LCBwb3N0Y29kZVwiXHJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICBlcnJvcj17bWVyZ2VkRXJyb3IoJ2FkZHJlc3MnKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvU2VjdGlvbj5cclxuXHJcbiAgICAgICAgICA8U2VjdGlvbiB0aXRsZT1cIklkZW50aXR5IHZlcmlmaWNhdGlvblwiIHN1YnRpdGxlPVwiVXBsb2FkIGNsZWFyIHBob3Rvcy4gU3VwcG9ydGVkOiBpbWFnZXMgYW5kIFBERi5cIj5cclxuICAgICAgICAgICAgPEZpZWxkXHJcbiAgICAgICAgICAgICAgbGFiZWw9XCJHb3Zlcm5tZW50IElEIG51bWJlclwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e2dvdmVybm1lbnRJZE51bWJlcn1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0R292ZXJubWVudElkTnVtYmVyfVxyXG4gICAgICAgICAgICAgIG9uQmx1cj17KCkgPT4gbWFya1RvdWNoZWQoJ2dvdmVybm1lbnRJZE51bWJlcicpfVxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUGFzc3BvcnQgLyBJRCBudW1iZXJcIlxyXG4gICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgZXJyb3I9e21lcmdlZEVycm9yKCdnb3Zlcm5tZW50SWROdW1iZXInKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPEZpbGVGaWVsZFxyXG4gICAgICAgICAgICAgIGxhYmVsPVwiSUQgZG9jdW1lbnQgdXBsb2FkIChwYXNzcG9ydCAvIGRyaXZpbmcgbGljZW5jZSkg4oCUIGZyb250XCJcclxuICAgICAgICAgICAgICBvblBpY2s9eyhmKSA9PiBzZXRJZEZyb250KGYpfVxyXG4gICAgICAgICAgICAgIG9uQmx1cj17KCkgPT4gbWFya1RvdWNoZWQoJ2lkRnJvbnQnKX1cclxuICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgIGVycm9yPXttZXJnZWRFcnJvcignaWRGcm9udCcpfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8RmlsZUZpZWxkXHJcbiAgICAgICAgICAgICAgbGFiZWw9XCJJRCBkb2N1bWVudCB1cGxvYWQgKHBhc3Nwb3J0IC8gZHJpdmluZyBsaWNlbmNlKSDigJQgYmFja1wiXHJcbiAgICAgICAgICAgICAgb25QaWNrPXsoZikgPT4gc2V0SWRCYWNrKGYpfVxyXG4gICAgICAgICAgICAgIG9uQmx1cj17KCkgPT4gbWFya1RvdWNoZWQoJ2lkQmFjaycpfVxyXG4gICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgZXJyb3I9e21lcmdlZEVycm9yKCdpZEJhY2snKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPEZpbGVGaWVsZFxyXG4gICAgICAgICAgICAgIGxhYmVsPVwiU2VsZmllIGZvciBpZGVudGlmaWNhdGlvblwiXHJcbiAgICAgICAgICAgICAgb25QaWNrPXsoZikgPT4gc2V0U2VsZmllKGYpfVxyXG4gICAgICAgICAgICAgIG9uQmx1cj17KCkgPT4gbWFya1RvdWNoZWQoJ3NlbGZpZScpfVxyXG4gICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgZXJyb3I9e21lcmdlZEVycm9yKCdzZWxmaWUnKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvU2VjdGlvbj5cclxuXHJcbiAgICAgICAgICA8U2VjdGlvbiB0aXRsZT1cIkRyaXZpbmcgbGljZW5jZVwiIHN1YnRpdGxlPVwiV2UgdmFsaWRhdGUgdGhlIFVLIGxpY2VuY2UgbnVtYmVyIGZvcm1hdCBsaXZlIChpbmNsdWRpbmcgRE9CIGVuY29kaW5nKS5cIj5cclxuICAgICAgICAgICAgPEZpZWxkXHJcbiAgICAgICAgICAgICAgbGFiZWw9XCJMaWNlbmNlIG51bWJlclwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e2xpY2Vuc2VOdW1iZXJ9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldExpY2Vuc2VOdW1iZXJ9XHJcbiAgICAgICAgICAgICAgb25CbHVyPXsoKSA9PiBtYXJrVG91Y2hlZCgnbGljZW5zZU51bWJlcicpfVxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTU9SR0E2NTcwNTRTTTlJSlwiXHJcbiAgICAgICAgICAgICAgaGludD1cIlVLIGZvcm1hdDogMTYgY2hhcnMuIFNwYWNlcyBhcmUgaWdub3JlZC5cIlxyXG4gICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgZXJyb3I9e21lcmdlZEVycm9yKCdsaWNlbnNlTnVtYmVyJyl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxGaWVsZCBsYWJlbD1cIkxpY2VuY2UgY291bnRyeVwiIHZhbHVlPXtsaWNlbnNlQ291bnRyeX0gb25DaGFuZ2U9e3NldExpY2Vuc2VDb3VudHJ5fSBwbGFjZWhvbGRlcj1cIlVLXCIgb25CbHVyPXsoKSA9PiBtYXJrVG91Y2hlZCgnbGljZW5zZUNvdW50cnknKX0gLz5cclxuICAgICAgICAgICAgPEZpZWxkIGxhYmVsPVwiTGljZW5jZSB0eXBlXCIgdmFsdWU9e2xpY2Vuc2VUeXBlfSBvbkNoYW5nZT17c2V0TGljZW5zZVR5cGV9IHBsYWNlaG9sZGVyPVwiRnVsbFwiIG9uQmx1cj17KCkgPT4gbWFya1RvdWNoZWQoJ2xpY2Vuc2VUeXBlJyl9IC8+XHJcbiAgICAgICAgICAgIDxGaWVsZFxyXG4gICAgICAgICAgICAgIGxhYmVsPVwiRXhwaXJ5IGRhdGUgKG9wdGlvbmFsKVwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e2xpY2Vuc2VFeHBpcnl9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldExpY2Vuc2VFeHBpcnl9XHJcbiAgICAgICAgICAgICAgb25CbHVyPXsoKSA9PiBtYXJrVG91Y2hlZCgnbGljZW5zZUV4cGlyeScpfVxyXG4gICAgICAgICAgICAgIHR5cGU9XCJkYXRlXCJcclxuICAgICAgICAgICAgICBlcnJvcj17bWVyZ2VkRXJyb3IoJ2xpY2Vuc2VFeHBpcnknKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPEZpbGVGaWVsZCBsYWJlbD1cIkxpY2VuY2UgcGhvdG8gKG9wdGlvbmFsKVwiIG9uUGljaz17c2V0TGljZW5zZVBob3RvfSBvbkJsdXI9eygpID0+IG1hcmtUb3VjaGVkKCdsaWNlbnNlUGhvdG8nKX0gLz5cclxuICAgICAgICAgIDwvU2VjdGlvbj5cclxuXHJcbiAgICAgICAgICA8U2VjdGlvbiB0aXRsZT1cIlZlaGljbGUgaW5mb3JtYXRpb25cIiBzdWJ0aXRsZT1cIlRlbGwgdXMgYWJvdXQgdGhlIGNhciB5b3Ugd2lsbCB1c2UgZm9yIHJpZGVzLlwiPlxyXG4gICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJWZWhpY2xlIG1ha2VcIiB2YWx1ZT17dmVoaWNsZU1ha2V9IG9uQ2hhbmdlPXtzZXRWZWhpY2xlTWFrZX0gb25CbHVyPXsoKSA9PiBtYXJrVG91Y2hlZCgndmVoaWNsZU1ha2UnKX0gcGxhY2Vob2xkZXI9XCJUb3lvdGFcIiByZXF1aXJlZCBlcnJvcj17bWVyZ2VkRXJyb3IoJ3ZlaGljbGVNYWtlJyl9IC8+XHJcbiAgICAgICAgICAgIDxGaWVsZCBsYWJlbD1cIk1vZGVsXCIgdmFsdWU9e3ZlaGljbGVNb2RlbH0gb25DaGFuZ2U9e3NldFZlaGljbGVNb2RlbH0gb25CbHVyPXsoKSA9PiBtYXJrVG91Y2hlZCgndmVoaWNsZU1vZGVsJyl9IHBsYWNlaG9sZGVyPVwiWWFyaXNcIiByZXF1aXJlZCBlcnJvcj17bWVyZ2VkRXJyb3IoJ3ZlaGljbGVNb2RlbCcpfSAvPlxyXG4gICAgICAgICAgICA8RmllbGRcclxuICAgICAgICAgICAgICBsYWJlbD1cIlllYXJcIlxyXG4gICAgICAgICAgICAgIHZhbHVlPXt2ZWhpY2xlWWVhcn1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0VmVoaWNsZVllYXJ9XHJcbiAgICAgICAgICAgICAgb25CbHVyPXsoKSA9PiBtYXJrVG91Y2hlZCgndmVoaWNsZVllYXInKX1cclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIjIwMjBcIlxyXG4gICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgZXJyb3I9e21lcmdlZEVycm9yKCd2ZWhpY2xlWWVhcicpfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJDb2xvciAob3B0aW9uYWwpXCIgdmFsdWU9e3ZlaGljbGVDb2xvcn0gb25DaGFuZ2U9e3NldFZlaGljbGVDb2xvcn0gb25CbHVyPXsoKSA9PiBtYXJrVG91Y2hlZCgndmVoaWNsZUNvbG9yJyl9IHBsYWNlaG9sZGVyPVwiQmxhY2tcIiAvPlxyXG4gICAgICAgICAgICA8RmllbGRcclxuICAgICAgICAgICAgICBsYWJlbD1cIkxpY2Vuc2UgcGxhdGVcIlxyXG4gICAgICAgICAgICAgIHZhbHVlPXtsaWNlbnNlUGxhdGV9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldExpY2Vuc2VQbGF0ZX1cclxuICAgICAgICAgICAgICBvbkJsdXI9eygpID0+IG1hcmtUb3VjaGVkKCdsaWNlbnNlUGxhdGUnKX1cclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFCMTIgQ0RFXCJcclxuICAgICAgICAgICAgICBoaW50PVwiVUsgZm9ybWF0OiBBQjEyIENERVwiXHJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICBlcnJvcj17bWVyZ2VkRXJyb3IoJ2xpY2Vuc2VQbGF0ZScpfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJSZWdpc3RyYXRpb24gY291bnRyeSAob3B0aW9uYWwpXCIgdmFsdWU9e3JlZ2lzdHJhdGlvbkNvdW50cnl9IG9uQ2hhbmdlPXtzZXRSZWdpc3RyYXRpb25Db3VudHJ5fSBvbkJsdXI9eygpID0+IG1hcmtUb3VjaGVkKCdyZWdpc3RyYXRpb25Db3VudHJ5Jyl9IHBsYWNlaG9sZGVyPVwiVUtcIiAvPlxyXG4gICAgICAgICAgICA8RmlsZUZpZWxkIGxhYmVsPVwiVmVoaWNsZSBwaG90byDigJQgZnJvbnQgKG9wdGlvbmFsKVwiIG9uUGljaz17c2V0VmVoaWNsZUZyb250fSBvbkJsdXI9eygpID0+IG1hcmtUb3VjaGVkKCd2ZWhpY2xlRnJvbnQnKX0gLz5cclxuICAgICAgICAgICAgPEZpbGVGaWVsZCBsYWJlbD1cIlZlaGljbGUgcGhvdG8g4oCUIGJhY2sgKG9wdGlvbmFsKVwiIG9uUGljaz17c2V0VmVoaWNsZUJhY2t9IG9uQmx1cj17KCkgPT4gbWFya1RvdWNoZWQoJ3ZlaGljbGVCYWNrJyl9IC8+XHJcbiAgICAgICAgICAgIDxGaWxlRmllbGQgbGFiZWw9XCJWZWhpY2xlIHBob3RvIOKAlCBpbnRlcmlvciAob3B0aW9uYWwpXCIgb25QaWNrPXtzZXRWZWhpY2xlSW50ZXJpb3J9IG9uQmx1cj17KCkgPT4gbWFya1RvdWNoZWQoJ3ZlaGljbGVJbnRlcmlvcicpfSAvPlxyXG4gICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJJbnN1cmFuY2UgcG9saWN5IG51bWJlciAob3B0aW9uYWwpXCIgdmFsdWU9e2luc3VyYW5jZVBvbGljeU51bWJlcn0gb25DaGFuZ2U9e3NldEluc3VyYW5jZVBvbGljeU51bWJlcn0gb25CbHVyPXsoKSA9PiBtYXJrVG91Y2hlZCgnaW5zdXJhbmNlUG9saWN5TnVtYmVyJyl9IC8+XHJcbiAgICAgICAgICAgIDxGaWVsZFxyXG4gICAgICAgICAgICAgIGxhYmVsPVwiSW5zdXJhbmNlIGV4cGlyeSBkYXRlIChvcHRpb25hbClcIlxyXG4gICAgICAgICAgICAgIHZhbHVlPXtpbnN1cmFuY2VFeHBpcnl9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9e3NldEluc3VyYW5jZUV4cGlyeX1cclxuICAgICAgICAgICAgICBvbkJsdXI9eygpID0+IG1hcmtUb3VjaGVkKCdpbnN1cmFuY2VFeHBpcnknKX1cclxuICAgICAgICAgICAgICB0eXBlPVwiZGF0ZVwiXHJcbiAgICAgICAgICAgICAgZXJyb3I9e21lcmdlZEVycm9yKCdpbnN1cmFuY2VFeHBpcnknKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvU2VjdGlvbj5cclxuXHJcbiAgICAgICAgICA8U2VjdGlvbiB0aXRsZT1cIlBheW1lbnQgYW5kIHBsYXRmb3JtXCIgc3VidGl0bGU9XCJXaGVyZSB3ZSBwYXkgeW91IG91dCAoZHVtbXkgZmllbGRzIGZvciBub3cpLlwiPlxyXG4gICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJCYW5rIGFjY291bnQgaG9sZGVyIG5hbWUgKG9wdGlvbmFsKVwiIHZhbHVlPXthY2NvdW50SG9sZGVyTmFtZX0gb25DaGFuZ2U9e3NldEFjY291bnRIb2xkZXJOYW1lfSBvbkJsdXI9eygpID0+IG1hcmtUb3VjaGVkKCdhY2NvdW50SG9sZGVyTmFtZScpfSAvPlxyXG4gICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJCYW5rIG5hbWUgKG9wdGlvbmFsKVwiIHZhbHVlPXtiYW5rTmFtZX0gb25DaGFuZ2U9e3NldEJhbmtOYW1lfSBvbkJsdXI9eygpID0+IG1hcmtUb3VjaGVkKCdiYW5rTmFtZScpfSAvPlxyXG4gICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJJQkFOIChvcHRpb25hbClcIiB2YWx1ZT17aWJhbn0gb25DaGFuZ2U9e3NldEliYW59IG9uQmx1cj17KCkgPT4gbWFya1RvdWNoZWQoJ2liYW4nKX0gcGxhY2Vob2xkZXI9XCJHQjI5IE5XQksgNjAxNiAxMzMxIDkyNjggMTlcIiBlcnJvcj17bWVyZ2VkRXJyb3IoJ2liYW4nKX0gLz5cclxuICAgICAgICAgICAgPEZpZWxkIGxhYmVsPVwiVGF4IGluZm9ybWF0aW9uIChvcHRpb25hbClcIiB2YWx1ZT17dGF4SW5mb30gb25DaGFuZ2U9e3NldFRheEluZm99IG9uQmx1cj17KCkgPT4gbWFya1RvdWNoZWQoJ3RheEluZm8nKX0gcGxhY2Vob2xkZXI9XCJPcHRpb25hbFwiIC8+XHJcbiAgICAgICAgICA8L1NlY3Rpb24+XHJcblxyXG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYXV0aC1zdWJtaXRcIiBkaXNhYmxlZD17c3VibWl0dGluZ30+XHJcbiAgICAgICAgICAgIHtzdWJtaXR0aW5nID8gJ1N1Ym1pdHRpbmfigKYnIDogJ1N1Ym1pdCBkcml2ZXIgYXBwbGljYXRpb24nfVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9mb3JtPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEcml2ZXJTaWdudXBQYWdlOyJdLCJmaWxlIjoiQzovVXNlcnMveWxhbm4vdnNjb2RlL1VuaS9TYW11ZGh5YW5SaWRlcy9mcm9udGVuZC9zcmMvRHJpdmVyU2lnbnVwUGFnZS50c3gifQ==