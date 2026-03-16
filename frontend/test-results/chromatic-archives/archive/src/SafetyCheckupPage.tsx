import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/SafetyCheckupPage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=b8f2434d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=b8f2434d"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useEffect = __vite__cjsImport1_react["useEffect"]; const useMemo = __vite__cjsImport1_react["useMemo"]; const useState = __vite__cjsImport1_react["useState"];
import { apiFetch } from "/src/lib/api.ts";
import {
  loadTrustedContactsFromStorage,
  normalizeTrustedContacts,
  saveTrustedContactsToStorage
} from "/src/lib/profilePreferences.ts";
const BackIcon = /* @__PURE__ */ jsxDEV("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxDEV("path", { d: "M19 12H5M12 5l-7 7 7 7" }, void 0, false, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
  lineNumber: 18,
  columnNumber: 5
}, this) }, void 0, false, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
  lineNumber: 17,
  columnNumber: 1
}, this);
const ChevronRight = /* @__PURE__ */ jsxDEV("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxDEV("path", { d: "M9 18l6-6-6-6" }, void 0, false, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
  lineNumber: 24,
  columnNumber: 5
}, this) }, void 0, false, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
  lineNumber: 23,
  columnNumber: 1
}, this);
const CheckCircle = ({ checked }) => /* @__PURE__ */ jsxDEV("span", { className: `safety-check-circle ${checked ? "checked" : ""}`, children: checked ? "v" : "" }, void 0, false, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
  lineNumber: 29,
  columnNumber: 1
}, this);
_c = CheckCircle;
const ListRow = ({ title, subtitle, checked, onClick }) => /* @__PURE__ */ jsxDEV(
  "div",
  {
    className: "safety-row",
    onClick,
    onKeyDown: (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onClick();
      }
    },
    role: "button",
    tabIndex: 0,
    children: [
      /* @__PURE__ */ jsxDEV("div", { className: "safety-row-left", children: [
        /* @__PURE__ */ jsxDEV(CheckCircle, { checked }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 51,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "safety-row-text", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "safety-row-title", children: title }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 53,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "safety-row-subtitle", children: subtitle }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 54,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 52,
          columnNumber: 7
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 50,
        columnNumber: 5
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "safety-row-right", children: ChevronRight }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 57,
        columnNumber: 5
      }, this)
    ]
  },
  void 0,
  true,
  {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
    lineNumber: 38,
    columnNumber: 1
  },
  this
);
_c2 = ListRow;
function genId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function genPin() {
  return String(Math.floor(Math.random() * 9e3) + 1e3);
}
const SafetyCheckupPage = ({ onBack }) => {
  _s();
  const [view, setView] = useState("main");
  const [contacts, setContacts] = useState(() => loadTrustedContactsFromStorage());
  const primaryId = useMemo(() => contacts.find((contact) => contact.isPrimary)?.id, [contacts]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", address: "", email: "" });
  const [rideCheckEnabled, setRideCheckEnabled] = useState(() => localStorage.getItem("rideCheckEnabled") === "true");
  const [pinEnabled, setPinEnabled] = useState(() => localStorage.getItem("pinEnabled") === "true");
  const [pinCode, setPinCode] = useState(() => localStorage.getItem("pinCode") || "");
  useEffect(() => {
    saveTrustedContactsToStorage(contacts);
  }, [contacts]);
  useEffect(() => {
    localStorage.setItem("rideCheckEnabled", String(rideCheckEnabled));
  }, [rideCheckEnabled]);
  useEffect(() => {
    localStorage.setItem("pinEnabled", String(pinEnabled));
    if (!pinEnabled) {
      localStorage.removeItem("pinCode");
    }
  }, [pinEnabled]);
  useEffect(() => {
    if (pinCode) {
      localStorage.setItem("pinCode", pinCode);
    }
  }, [pinCode]);
  useEffect(() => {
    let ignore = false;
    const token = localStorage.getItem("authToken");
    if (!token) {
      return () => {
        ignore = true;
      };
    }
    const loadSavedContacts = async () => {
      try {
        const data = await apiFetch("users/me", { method: "GET" });
        const profile = Array.isArray(data) ? data[0] : data;
        const profileContacts = normalizeTrustedContacts(profile?.trusted_contacts);
        if (!ignore && profileContacts.length > 0) {
          setContacts(profileContacts);
          saveTrustedContactsToStorage(profileContacts);
        }
      } catch (error) {
        console.error("Error fetching trusted contacts:", error);
      }
    };
    void loadSavedContacts();
    return () => {
      ignore = true;
    };
  }, []);
  const persistContactsToAccount = async (nextContacts) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      await apiFetch("users/me/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trusted_contacts: nextContacts })
      });
    } catch (error) {
      console.error("Error saving trusted contacts:", error);
    }
  };
  const updateContacts = (updater) => {
    setContacts((current) => {
      const next = updater(current);
      void persistContactsToAccount(next);
      return next;
    });
  };
  const header = (title, backTo) => /* @__PURE__ */ jsxDEV("div", { className: "safety-header", children: [
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        type: "button",
        className: "sheet-action-btn",
        style: { width: 44, height: 44, padding: 0, background: "transparent", border: "none", color: "var(--text-header)" },
        onClick: () => {
          if (backTo) setView(backTo);
          else onBack();
        },
        "aria-label": "Back",
        title: "Back",
        children: BackIcon
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 158,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { style: { fontSize: 18, fontWeight: 800, color: "var(--text-header)" }, children: title }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
      lineNumber: 168,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
    lineNumber: 157,
    columnNumber: 3
  }, this);
  const setPrimary = (id) => {
    updateContacts((current) => current.map((contact) => ({ ...contact, isPrimary: contact.id === id })));
  };
  const removeContact = (id) => {
    updateContacts((current) => {
      const next = current.filter((contact) => contact.id !== id);
      if (!next.some((contact) => contact.isPrimary) && next.length > 0) {
        next[0] = { ...next[0], isPrimary: true };
      }
      return next;
    });
  };
  const submitContact = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.phone.trim()) {
      return;
    }
    const nextContact = {
      id: genId(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim() || void 0,
      email: form.email.trim() || void 0,
      isPrimary: contacts.length === 0
    };
    updateContacts((current) => [...current, nextContact]);
    setShowAddContact(false);
    setForm({ firstName: "", lastName: "", phone: "", address: "", email: "" });
  };
  if (view === "help") {
    return /* @__PURE__ */ jsxDEV("div", { className: "safety-page", children: [
      header("Safety help", "main"),
      /* @__PURE__ */ jsxDEV("div", { className: "card safety-card", style: { margin: "0 16px 16px", padding: 18 }, children: [
        /* @__PURE__ */ jsxDEV("div", { style: { fontSize: 22, fontWeight: 900, marginBottom: 10 }, children: "Open the Safety Toolkit" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 211,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { color: "var(--text-label)", lineHeight: 1.5 }, children: "If you ever need safety help during a trip, go to the Account page and tap the red safety alarm button on the map to open your Safety Toolkit. This lets you contact your trusted contact or emergency services." }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 212,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 210,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
      lineNumber: 208,
      columnNumber: 7
    }, this);
  }
  if (view === "trusted") {
    return /* @__PURE__ */ jsxDEV("div", { className: "safety-page", children: [
      header("Trusted contacts", "main"),
      /* @__PURE__ */ jsxDEV("div", { className: "card safety-card", style: { margin: "0 16px 12px", padding: 16 }, children: [
        /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 900, fontSize: 18, marginBottom: 8 }, children: "Share your trip status" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 227,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { color: "var(--text-label)", lineHeight: 1.5, marginBottom: 14 }, children: "You will be able to share your live location with one or more contacts during any Samudhyan ride." }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 228,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 900, fontSize: 18, marginBottom: 8 }, children: "Set your emergency contacts" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 231,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { color: "var(--text-label)", lineHeight: 1.5 }, children: "You can make a trusted contact an emergency contact too. Samudhyan Ride can call them if we cannot reach you in case of an emergency." }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 232,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 226,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "card safety-card", style: { margin: "0 16px 12px", padding: 16 }, children: [
        /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 900 }, children: "Your contacts" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 240,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("button", { className: "sheet-action-btn btn-accept", style: { width: "auto", minWidth: 132 }, onClick: () => setShowAddContact(true), children: "Add contact" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 241,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 239,
          columnNumber: 11
        }, this),
        contacts.length === 0 ? /* @__PURE__ */ jsxDEV("div", { style: { color: "var(--text-label)" }, children: "No trusted contacts yet." }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 247,
          columnNumber: 11
        }, this) : /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: contacts.map(
          (contact) => /* @__PURE__ */ jsxDEV("div", { className: "trusted-contact-row", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "trusted-contact-main", children: [
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", gap: 8, fontWeight: 800, flexWrap: "wrap" }, children: [
                /* @__PURE__ */ jsxDEV("span", { style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: [
                  contact.firstName,
                  " ",
                  contact.lastName
                ] }, void 0, true, {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
                  lineNumber: 254,
                  columnNumber: 23
                }, this),
                contact.isPrimary && /* @__PURE__ */ jsxDEV("span", { className: "primary-pill", children: "Primary" }, void 0, false, {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
                  lineNumber: 257,
                  columnNumber: 45
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
                lineNumber: 253,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { color: "var(--text-label)", fontSize: 13, marginTop: 4 }, children: contact.phone }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
                lineNumber: 259,
                columnNumber: 21
              }, this),
              (contact.address || contact.email) && /* @__PURE__ */ jsxDEV("div", { style: { color: "var(--text-label)", opacity: 0.8, fontSize: 12, marginTop: 4 }, children: [contact.address, contact.email].filter(Boolean).join(" / ") }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
                lineNumber: 261,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 252,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "trusted-contact-actions", children: [
              /* @__PURE__ */ jsxDEV(
                "button",
                {
                  className: `sheet-action-btn ${contact.isPrimary ? "btn-cancel" : "btn-accept"}`,
                  onClick: () => setPrimary(contact.id),
                  disabled: contact.isPrimary,
                  style: { opacity: contact.isPrimary ? 0.6 : 1 },
                  children: "Set primary"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
                  lineNumber: 267,
                  columnNumber: 21
                },
                this
              ),
              /* @__PURE__ */ jsxDEV("button", { className: "sheet-action-btn btn-cancel", onClick: () => removeContact(contact.id), children: "Remove" }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
                lineNumber: 275,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 266,
              columnNumber: 19
            }, this)
          ] }, contact.id, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 251,
            columnNumber: 13
          }, this)
        ) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 249,
          columnNumber: 11
        }, this),
        primaryId && /* @__PURE__ */ jsxDEV("div", { style: { marginTop: 12, color: "var(--text-label)", fontSize: 12 }, children: "Primary contact will be used first." }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 284,
          columnNumber: 25
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 238,
        columnNumber: 9
      }, this),
      showAddContact && /* @__PURE__ */ jsxDEV("div", { className: "modal-backdrop", onClick: () => setShowAddContact(false), children: /* @__PURE__ */ jsxDEV("div", { className: "modal-card", role: "dialog", "aria-modal": "true", onClick: (event) => event.stopPropagation(), children: [
        /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 900, fontSize: 16, marginBottom: 10, color: "var(--text-typed)" }, children: "Add trusted contact" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 290,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "modal-grid", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "modal-field", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "First name" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 292,
              columnNumber: 48
            }, this),
            /* @__PURE__ */ jsxDEV("input", { value: form.firstName, onChange: (event) => setForm((current) => ({ ...current, firstName: event.target.value })), type: "text" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 292,
              columnNumber: 71
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 292,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("label", { className: "modal-field", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Last name" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 293,
              columnNumber: 48
            }, this),
            /* @__PURE__ */ jsxDEV("input", { value: form.lastName, onChange: (event) => setForm((current) => ({ ...current, lastName: event.target.value })), type: "text" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 293,
              columnNumber: 70
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 293,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("label", { className: "modal-field", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Phone number" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 294,
              columnNumber: 48
            }, this),
            /* @__PURE__ */ jsxDEV("input", { value: form.phone, onChange: (event) => setForm((current) => ({ ...current, phone: event.target.value })), type: "tel" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 294,
              columnNumber: 73
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 294,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("label", { className: "modal-field", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Address (optional)" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 295,
              columnNumber: 48
            }, this),
            /* @__PURE__ */ jsxDEV("input", { value: form.address, onChange: (event) => setForm((current) => ({ ...current, address: event.target.value })), type: "text" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 295,
              columnNumber: 79
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 295,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("label", { className: "modal-field", children: [
            /* @__PURE__ */ jsxDEV("span", { children: "Email (optional)" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 296,
              columnNumber: 48
            }, this),
            /* @__PURE__ */ jsxDEV("input", { value: form.email, onChange: (event) => setForm((current) => ({ ...current, email: event.target.value })), type: "email" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 296,
              columnNumber: 77
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 296,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 291,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }, children: [
          /* @__PURE__ */ jsxDEV("button", { type: "button", className: "sheet-action-btn btn-cancel", onClick: () => setShowAddContact(false), children: "Cancel" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 299,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("button", { type: "button", className: "sheet-action-btn btn-accept", onClick: submitContact, disabled: !form.firstName.trim() || !form.lastName.trim() || !form.phone.trim(), children: "Add" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 300,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 298,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 289,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 288,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
      lineNumber: 223,
      columnNumber: 7
    }, this);
  }
  if (view === "ridecheck") {
    return /* @__PURE__ */ jsxDEV("div", { className: "safety-page", children: [
      header("RideCheck", "main"),
      /* @__PURE__ */ jsxDEV("div", { className: "card safety-card", style: { margin: "0 16px 16px", padding: 18 }, children: [
        /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 900, fontSize: 18, marginBottom: 8 }, children: "What's a RideCheck?" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 314,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { color: "var(--text-label)", lineHeight: 1.5, marginBottom: 16 }, children: "In the case of an unexpected event, Samudhyan Ride will initiate a RideCheck to help you." }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 315,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "toggle-row", children: [
          /* @__PURE__ */ jsxDEV("div", { style: { flex: 1 }, children: [
            /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 900, marginBottom: 2 }, children: "RideCheck notifications" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 320,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: { color: "var(--text-label)", fontSize: 13, lineHeight: 1.4 }, children: "We will send you a RideCheck notification if a trip does not progress as planned." }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 321,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 319,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("label", { className: "switch", children: [
            /* @__PURE__ */ jsxDEV("input", { type: "checkbox", checked: rideCheckEnabled, onChange: (event) => setRideCheckEnabled(event.target.checked) }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 325,
              columnNumber: 39
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "slider" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 325,
              columnNumber: 155
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 325,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 318,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 313,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
      lineNumber: 311,
      columnNumber: 7
    }, this);
  }
  if (view === "pin") {
    return /* @__PURE__ */ jsxDEV("div", { className: "safety-page", children: [
      header("PIN verification", "main"),
      /* @__PURE__ */ jsxDEV("div", { className: "card safety-card", style: { margin: "0 16px 16px", padding: 18 }, children: [
        /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 900, fontSize: 22, marginBottom: 10 }, children: "Verify your trips" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 337,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { color: "var(--text-label)", lineHeight: 1.5, marginBottom: 18 }, children: "Help make sure you get into the right car by verifying your trip with a PIN." }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 338,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "toggle-row", children: [
          /* @__PURE__ */ jsxDEV("div", { style: { flex: 1, fontWeight: 900 }, children: "Use PIN to verify trips" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 342,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("label", { className: "switch", children: [
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                type: "checkbox",
                checked: pinEnabled,
                onChange: (event) => {
                  const next = event.target.checked;
                  setPinEnabled(next);
                  if (next) setPinCode(genPin());
                  else
                    setPinCode("");
                }
              },
              void 0,
              false,
              {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
                lineNumber: 344,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("span", { className: "slider" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
              lineNumber: 354,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 343,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 341,
          columnNumber: 11
        }, this),
        pinEnabled && pinCode && /* @__PURE__ */ jsxDEV("div", { style: { marginTop: 16 }, children: [
          /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 800, marginBottom: 6 }, children: "Your trip PIN" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 359,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "pin-box", children: pinCode }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 360,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 358,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 336,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
      lineNumber: 334,
      columnNumber: 7
    }, this);
  }
  if (view === "driver") {
    return /* @__PURE__ */ jsxDEV("div", { className: "safety-page", children: [
      header("Driver safety standards", "main"),
      /* @__PURE__ */ jsxDEV("div", { className: "card safety-card", style: { margin: "0 16px 16px", padding: 18 }, children: [
        /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 900, fontSize: 22, marginBottom: 12 }, children: "Driver safety standards" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 373,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "safety-section", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "safety-section-title", children: "Driver screening" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 375,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "safety-section-text", children: "Before anyone can drive, they have to pass a screening." }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 376,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 374,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "safety-section", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "safety-section-title", children: "Real-time ID check" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 379,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "safety-section-text", children: "Drivers must submit photos to verify their identity." }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
            lineNumber: 380,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 378,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: "sheet-action-btn btn-accept", style: { width: "100%", marginTop: 20 }, onClick: () => setView("main"), children: "Got it" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
          lineNumber: 382,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 372,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
      lineNumber: 370,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "safety-page", children: [
    header("Safety check-up"),
    /* @__PURE__ */ jsxDEV("div", { className: "card safety-card", style: { margin: "0 16px 14px", padding: 18 }, children: [
      /* @__PURE__ */ jsxDEV("div", { style: { fontSize: 22, fontWeight: 900, marginBottom: 6 }, children: "Safety check-up" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 392,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { style: { color: "var(--text-label)", lineHeight: 1.5 }, children: "To help keep yourself safe on every trip, review your current safety settings." }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 393,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
      lineNumber: 391,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "card safety-card safety-list-card", style: { margin: "0 16px 16px", padding: 0, overflow: "hidden" }, children: [
      /* @__PURE__ */ jsxDEV("div", { style: { padding: "14px 16px 10px", fontWeight: 900, color: "var(--text-typed)" }, children: "Safety settings" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 397,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(ListRow, { title: "Safety help", subtitle: "Learn how to get help during a trip", checked: true, onClick: () => setView("help") }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 398,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "safety-row-divider" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 399,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(ListRow, { title: "Trusted contacts", subtitle: "Choose friends or family to share your location", checked: contacts.length > 0, onClick: () => setView("trusted") }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 400,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "safety-row-divider" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 401,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(ListRow, { title: "PIN verification", subtitle: "Secure your trip by requiring a simple code", checked: pinEnabled, onClick: () => setView("pin") }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 402,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "safety-row-divider" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 403,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(ListRow, { title: "RideCheck", subtitle: "Receive automatic check-ins", checked: rideCheckEnabled, onClick: () => setView("ridecheck") }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 404,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "safety-row-divider" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 405,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(ListRow, { title: "Driver safety standards", subtitle: "Learn about our safety standards for drivers", onClick: () => setView("driver") }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
        lineNumber: 406,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
      lineNumber: 396,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx",
    lineNumber: 389,
    columnNumber: 5
  }, this);
};
_s(SafetyCheckupPage, "KEa8Gw1GlHNxNdhKSt6DX9JJzJk=");
_c3 = SafetyCheckupPage;
export default SafetyCheckupPage;
var _c, _c2, _c3;
$RefreshReg$(_c, "CheckCircle");
$RefreshReg$(_c2, "ListRow");
$RefreshReg$(_c3, "SafetyCheckupPage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SafetyCheckupPage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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QUFTQyxTQUFTb0MsU0FBUyxHQUFHLFNBQVMsTUFBTXJDLFFBQVEsU0FBUyxLQUEzSjtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQTZKO0FBQUEsTUFDN0osdUJBQUMsU0FBSSxXQUFVLHdCQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBbUM7QUFBQSxNQUNuQyx1QkFBQyxXQUFRLE9BQU0sb0JBQW1CLFVBQVMsK0NBQThDLFNBQVNxQixZQUFZLFNBQVMsTUFBTXJCLFFBQVEsS0FBSyxLQUExSTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQTRJO0FBQUEsTUFDNUksdUJBQUMsU0FBSSxXQUFVLHdCQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBbUM7QUFBQSxNQUNuQyx1QkFBQyxXQUFRLE9BQU0sYUFBWSxVQUFTLCtCQUE4QixTQUFTaUIsa0JBQWtCLFNBQVMsTUFBTWpCLFFBQVEsV0FBVyxLQUEvSDtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBQWlJO0FBQUEsTUFDakksdUJBQUMsU0FBSSxXQUFVLHdCQUFmO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBbUM7QUFBQSxNQUNuQyx1QkFBQyxXQUFRLE9BQU0sMkJBQTBCLFVBQVMsZ0RBQStDLFNBQVMsTUFBTUEsUUFBUSxRQUFRLEtBQWhJO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFBa0k7QUFBQSxTQVZwSTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBV0E7QUFBQSxPQWxCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBbUJBO0FBRUo7QUFBRUYsR0FyVklGLG1CQUFtRDtBQUFBOEYsTUFBbkQ5RjtBQXVWTixlQUFlQTtBQUFrQixJQUFBbkIsSUFBQVEsS0FBQXlHO0FBQUFDLGFBQUFsSCxJQUFBO0FBQUFrSCxhQUFBMUcsS0FBQTtBQUFBMEcsYUFBQUQsS0FBQSIsIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwidXNlTWVtbyIsInVzZVN0YXRlIiwiYXBpRmV0Y2giLCJsb2FkVHJ1c3RlZENvbnRhY3RzRnJvbVN0b3JhZ2UiLCJub3JtYWxpemVUcnVzdGVkQ29udGFjdHMiLCJzYXZlVHJ1c3RlZENvbnRhY3RzVG9TdG9yYWdlIiwiQmFja0ljb24iLCJDaGV2cm9uUmlnaHQiLCJDaGVja0NpcmNsZSIsImNoZWNrZWQiLCJfYyIsIkxpc3RSb3ciLCJ0aXRsZSIsInN1YnRpdGxlIiwib25DbGljayIsImV2ZW50Iiwia2V5IiwicHJldmVudERlZmF1bHQiLCJfYzIiLCJnZW5JZCIsIkRhdGUiLCJub3ciLCJNYXRoIiwicmFuZG9tIiwidG9TdHJpbmciLCJzbGljZSIsImdlblBpbiIsIlN0cmluZyIsImZsb29yIiwiU2FmZXR5Q2hlY2t1cFBhZ2UiLCJvbkJhY2siLCJfcyIsInZpZXciLCJzZXRWaWV3IiwiY29udGFjdHMiLCJzZXRDb250YWN0cyIsInByaW1hcnlJZCIsImZpbmQiLCJjb250YWN0IiwiaXNQcmltYXJ5IiwiaWQiLCJzaG93QWRkQ29udGFjdCIsInNldFNob3dBZGRDb250YWN0IiwiZm9ybSIsInNldEZvcm0iLCJmaXJzdE5hbWUiLCJsYXN0TmFtZSIsInBob25lIiwiYWRkcmVzcyIsImVtYWlsIiwicmlkZUNoZWNrRW5hYmxlZCIsInNldFJpZGVDaGVja0VuYWJsZWQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwicGluRW5hYmxlZCIsInNldFBpbkVuYWJsZWQiLCJwaW5Db2RlIiwic2V0UGluQ29kZSIsInNldEl0ZW0iLCJyZW1vdmVJdGVtIiwiaWdub3JlIiwidG9rZW4iLCJsb2FkU2F2ZWRDb250YWN0cyIsImRhdGEiLCJtZXRob2QiLCJwcm9maWxlIiwiQXJyYXkiLCJpc0FycmF5IiwicHJvZmlsZUNvbnRhY3RzIiwidHJ1c3RlZF9jb250YWN0cyIsImxlbmd0aCIsImVycm9yIiwiY29uc29sZSIsInBlcnNpc3RDb250YWN0c1RvQWNjb3VudCIsIm5leHRDb250YWN0cyIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsInVwZGF0ZUNvbnRhY3RzIiwidXBkYXRlciIsImN1cnJlbnQiLCJuZXh0IiwiaGVhZGVyIiwiYmFja1RvIiwid2lkdGgiLCJoZWlnaHQiLCJwYWRkaW5nIiwiYmFja2dyb3VuZCIsImJvcmRlciIsImNvbG9yIiwiZm9udFNpemUiLCJmb250V2VpZ2h0Iiwic2V0UHJpbWFyeSIsIm1hcCIsInJlbW92ZUNvbnRhY3QiLCJmaWx0ZXIiLCJzb21lIiwic3VibWl0Q29udGFjdCIsInRyaW0iLCJuZXh0Q29udGFjdCIsInVuZGVmaW5lZCIsIm1hcmdpbiIsIm1hcmdpbkJvdHRvbSIsImxpbmVIZWlnaHQiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiZ2FwIiwiZmxleFdyYXAiLCJtaW5XaWR0aCIsImZsZXhEaXJlY3Rpb24iLCJ3aGl0ZVNwYWNlIiwib3ZlcmZsb3ciLCJ0ZXh0T3ZlcmZsb3ciLCJtYXJnaW5Ub3AiLCJvcGFjaXR5IiwiQm9vbGVhbiIsImpvaW4iLCJzdG9wUHJvcGFnYXRpb24iLCJ0YXJnZXQiLCJ2YWx1ZSIsImZsZXgiLCJfYzMiLCIkUmVmcmVzaFJlZyQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiU2FmZXR5Q2hlY2t1cFBhZ2UudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgYXBpRmV0Y2ggfSBmcm9tICcuL2xpYi9hcGknO1xuaW1wb3J0IHtcbiAgdHlwZSBUcnVzdGVkQ29udGFjdCxcbiAgbG9hZFRydXN0ZWRDb250YWN0c0Zyb21TdG9yYWdlLFxuICBub3JtYWxpemVUcnVzdGVkQ29udGFjdHMsXG4gIHNhdmVUcnVzdGVkQ29udGFjdHNUb1N0b3JhZ2UsXG59IGZyb20gJy4vbGliL3Byb2ZpbGVQcmVmZXJlbmNlcyc7XG5cbnR5cGUgU2FmZXR5Q2hlY2t1cFBhZ2VQcm9wcyA9IHtcbiAgb25CYWNrOiAoKSA9PiB2b2lkO1xufTtcblxudHlwZSBWaWV3ID0gJ21haW4nIHwgJ2hlbHAnIHwgJ3RydXN0ZWQnIHwgJ3BpbicgfCAncmlkZWNoZWNrJyB8ICdkcml2ZXInO1xuXG5jb25zdCBCYWNrSWNvbiA9IChcbiAgPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjIuNVwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cbiAgICA8cGF0aCBkPVwiTTE5IDEySDVNMTIgNWwtNyA3IDcgN1wiIC8+XG4gIDwvc3ZnPlxuKTtcblxuY29uc3QgQ2hldnJvblJpZ2h0ID0gKFxuICA8c3ZnIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMi41XCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxuICAgIDxwYXRoIGQ9XCJNOSAxOGw2LTYtNi02XCIgLz5cbiAgPC9zdmc+XG4pO1xuXG5jb25zdCBDaGVja0NpcmNsZTogUmVhY3QuRkM8eyBjaGVja2VkPzogYm9vbGVhbiB9PiA9ICh7IGNoZWNrZWQgfSkgPT4gKFxuICA8c3BhbiBjbGFzc05hbWU9e2BzYWZldHktY2hlY2stY2lyY2xlICR7Y2hlY2tlZCA/ICdjaGVja2VkJyA6ICcnfWB9PntjaGVja2VkID8gJ3YnIDogJyd9PC9zcGFuPlxuKTtcblxuY29uc3QgTGlzdFJvdzogUmVhY3QuRkM8e1xuICB0aXRsZTogc3RyaW5nO1xuICBzdWJ0aXRsZTogc3RyaW5nO1xuICBjaGVja2VkPzogYm9vbGVhbjtcbiAgb25DbGljazogKCkgPT4gdm9pZDtcbn0+ID0gKHsgdGl0bGUsIHN1YnRpdGxlLCBjaGVja2VkLCBvbkNsaWNrIH0pID0+IChcbiAgPGRpdlxuICAgIGNsYXNzTmFtZT1cInNhZmV0eS1yb3dcIlxuICAgIG9uQ2xpY2s9e29uQ2xpY2t9XG4gICAgb25LZXlEb3duPXsoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdFbnRlcicgfHwgZXZlbnQua2V5ID09PSAnICcpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgb25DbGljaygpO1xuICAgICAgfVxuICAgIH19XG4gICAgcm9sZT1cImJ1dHRvblwiXG4gICAgdGFiSW5kZXg9ezB9XG4gID5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNhZmV0eS1yb3ctbGVmdFwiPlxuICAgICAgPENoZWNrQ2lyY2xlIGNoZWNrZWQ9e2NoZWNrZWR9IC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNhZmV0eS1yb3ctdGV4dFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNhZmV0eS1yb3ctdGl0bGVcIj57dGl0bGV9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2FmZXR5LXJvdy1zdWJ0aXRsZVwiPntzdWJ0aXRsZX08L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3NOYW1lPVwic2FmZXR5LXJvdy1yaWdodFwiPntDaGV2cm9uUmlnaHR9PC9kaXY+XG4gIDwvZGl2PlxuKTtcblxuZnVuY3Rpb24gZ2VuSWQoKSB7XG4gIHJldHVybiBgJHtEYXRlLm5vdygpfV8ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMTYpLnNsaWNlKDIpfWA7XG59XG5cbmZ1bmN0aW9uIGdlblBpbigpIHtcbiAgcmV0dXJuIFN0cmluZyhNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA5MDAwKSArIDEwMDApO1xufVxuXG5jb25zdCBTYWZldHlDaGVja3VwUGFnZTogUmVhY3QuRkM8U2FmZXR5Q2hlY2t1cFBhZ2VQcm9wcz4gPSAoeyBvbkJhY2sgfSkgPT4ge1xuICBjb25zdCBbdmlldywgc2V0Vmlld10gPSB1c2VTdGF0ZTxWaWV3PignbWFpbicpO1xuICBjb25zdCBbY29udGFjdHMsIHNldENvbnRhY3RzXSA9IHVzZVN0YXRlPFRydXN0ZWRDb250YWN0W10+KCgpID0+IGxvYWRUcnVzdGVkQ29udGFjdHNGcm9tU3RvcmFnZSgpKTtcbiAgY29uc3QgcHJpbWFyeUlkID0gdXNlTWVtbygoKSA9PiBjb250YWN0cy5maW5kKChjb250YWN0KSA9PiBjb250YWN0LmlzUHJpbWFyeSk/LmlkLCBbY29udGFjdHNdKTtcbiAgY29uc3QgW3Nob3dBZGRDb250YWN0LCBzZXRTaG93QWRkQ29udGFjdF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtmb3JtLCBzZXRGb3JtXSA9IHVzZVN0YXRlKHsgZmlyc3ROYW1lOiAnJywgbGFzdE5hbWU6ICcnLCBwaG9uZTogJycsIGFkZHJlc3M6ICcnLCBlbWFpbDogJycgfSk7XG5cbiAgY29uc3QgW3JpZGVDaGVja0VuYWJsZWQsIHNldFJpZGVDaGVja0VuYWJsZWRdID0gdXNlU3RhdGU8Ym9vbGVhbj4oKCkgPT4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3JpZGVDaGVja0VuYWJsZWQnKSA9PT0gJ3RydWUnKTtcbiAgY29uc3QgW3BpbkVuYWJsZWQsIHNldFBpbkVuYWJsZWRdID0gdXNlU3RhdGU8Ym9vbGVhbj4oKCkgPT4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3BpbkVuYWJsZWQnKSA9PT0gJ3RydWUnKTtcbiAgY29uc3QgW3BpbkNvZGUsIHNldFBpbkNvZGVdID0gdXNlU3RhdGU8c3RyaW5nPigoKSA9PiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncGluQ29kZScpIHx8ICcnKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNhdmVUcnVzdGVkQ29udGFjdHNUb1N0b3JhZ2UoY29udGFjdHMpO1xuICB9LCBbY29udGFjdHNdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdyaWRlQ2hlY2tFbmFibGVkJywgU3RyaW5nKHJpZGVDaGVja0VuYWJsZWQpKTtcbiAgfSwgW3JpZGVDaGVja0VuYWJsZWRdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwaW5FbmFibGVkJywgU3RyaW5nKHBpbkVuYWJsZWQpKTtcbiAgICBpZiAoIXBpbkVuYWJsZWQpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdwaW5Db2RlJyk7XG4gICAgfVxuICB9LCBbcGluRW5hYmxlZF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHBpbkNvZGUpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwaW5Db2RlJywgcGluQ29kZSk7XG4gICAgfVxuICB9LCBbcGluQ29kZV0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGlnbm9yZSA9IGZhbHNlO1xuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2F1dGhUb2tlbicpO1xuXG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgaWdub3JlID0gdHJ1ZTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc3QgbG9hZFNhdmVkQ29udGFjdHMgPSBhc3luYyAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgYXBpRmV0Y2goJ3VzZXJzL21lJywgeyBtZXRob2Q6ICdHRVQnIH0pO1xuICAgICAgICBjb25zdCBwcm9maWxlID0gQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGFbMF0gOiBkYXRhO1xuICAgICAgICBjb25zdCBwcm9maWxlQ29udGFjdHMgPSBub3JtYWxpemVUcnVzdGVkQ29udGFjdHMocHJvZmlsZT8udHJ1c3RlZF9jb250YWN0cyk7XG5cbiAgICAgICAgaWYgKCFpZ25vcmUgJiYgcHJvZmlsZUNvbnRhY3RzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBzZXRDb250YWN0cyhwcm9maWxlQ29udGFjdHMpO1xuICAgICAgICAgIHNhdmVUcnVzdGVkQ29udGFjdHNUb1N0b3JhZ2UocHJvZmlsZUNvbnRhY3RzKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZmV0Y2hpbmcgdHJ1c3RlZCBjb250YWN0czonLCBlcnJvcik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZvaWQgbG9hZFNhdmVkQ29udGFjdHMoKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBpZ25vcmUgPSB0cnVlO1xuICAgIH07XG4gIH0sIFtdKTtcblxuICBjb25zdCBwZXJzaXN0Q29udGFjdHNUb0FjY291bnQgPSBhc3luYyAobmV4dENvbnRhY3RzOiBUcnVzdGVkQ29udGFjdFtdKSA9PiB7XG4gICAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0aFRva2VuJyk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuO1xuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGFwaUZldGNoKCd1c2Vycy9tZS9wcmVmZXJlbmNlcycsIHtcbiAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdHJ1c3RlZF9jb250YWN0czogbmV4dENvbnRhY3RzIH0pLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHNhdmluZyB0cnVzdGVkIGNvbnRhY3RzOicsIGVycm9yKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdXBkYXRlQ29udGFjdHMgPSAodXBkYXRlcjogKGN1cnJlbnQ6IFRydXN0ZWRDb250YWN0W10pID0+IFRydXN0ZWRDb250YWN0W10pID0+IHtcbiAgICBzZXRDb250YWN0cygoY3VycmVudCkgPT4ge1xuICAgICAgY29uc3QgbmV4dCA9IHVwZGF0ZXIoY3VycmVudCk7XG4gICAgICB2b2lkIHBlcnNpc3RDb250YWN0c1RvQWNjb3VudChuZXh0KTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGhlYWRlciA9ICh0aXRsZTogc3RyaW5nLCBiYWNrVG8/OiBWaWV3KSA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzYWZldHktaGVhZGVyXCI+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzc05hbWU9XCJzaGVldC1hY3Rpb24tYnRuXCJcbiAgICAgICAgc3R5bGU9e3sgd2lkdGg6IDQ0LCBoZWlnaHQ6IDQ0LCBwYWRkaW5nOiAwLCBiYWNrZ3JvdW5kOiAndHJhbnNwYXJlbnQnLCBib3JkZXI6ICdub25lJywgY29sb3I6ICd2YXIoLS10ZXh0LWhlYWRlciknIH19XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHsgaWYgKGJhY2tUbykgc2V0VmlldyhiYWNrVG8pOyBlbHNlIG9uQmFjaygpOyB9fVxuICAgICAgICBhcmlhLWxhYmVsPVwiQmFja1wiXG4gICAgICAgIHRpdGxlPVwiQmFja1wiXG4gICAgICA+XG4gICAgICAgIHtCYWNrSWNvbn1cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogMTgsIGZvbnRXZWlnaHQ6IDgwMCwgY29sb3I6ICd2YXIoLS10ZXh0LWhlYWRlciknIH19Pnt0aXRsZX08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcblxuICBjb25zdCBzZXRQcmltYXJ5ID0gKGlkOiBzdHJpbmcpID0+IHtcbiAgICB1cGRhdGVDb250YWN0cygoY3VycmVudCkgPT4gY3VycmVudC5tYXAoKGNvbnRhY3QpID0+ICh7IC4uLmNvbnRhY3QsIGlzUHJpbWFyeTogY29udGFjdC5pZCA9PT0gaWQgfSkpKTtcbiAgfTtcblxuICBjb25zdCByZW1vdmVDb250YWN0ID0gKGlkOiBzdHJpbmcpID0+IHtcbiAgICB1cGRhdGVDb250YWN0cygoY3VycmVudCkgPT4ge1xuICAgICAgY29uc3QgbmV4dCA9IGN1cnJlbnQuZmlsdGVyKChjb250YWN0KSA9PiBjb250YWN0LmlkICE9PSBpZCk7XG4gICAgICBpZiAoIW5leHQuc29tZSgoY29udGFjdCkgPT4gY29udGFjdC5pc1ByaW1hcnkpICYmIG5leHQubGVuZ3RoID4gMCkge1xuICAgICAgICBuZXh0WzBdID0geyAuLi5uZXh0WzBdLCBpc1ByaW1hcnk6IHRydWUgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHN1Ym1pdENvbnRhY3QgPSAoKSA9PiB7XG4gICAgaWYgKCFmb3JtLmZpcnN0TmFtZS50cmltKCkgfHwgIWZvcm0ubGFzdE5hbWUudHJpbSgpIHx8ICFmb3JtLnBob25lLnRyaW0oKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5leHRDb250YWN0OiBUcnVzdGVkQ29udGFjdCA9IHtcbiAgICAgIGlkOiBnZW5JZCgpLFxuICAgICAgZmlyc3ROYW1lOiBmb3JtLmZpcnN0TmFtZS50cmltKCksXG4gICAgICBsYXN0TmFtZTogZm9ybS5sYXN0TmFtZS50cmltKCksXG4gICAgICBwaG9uZTogZm9ybS5waG9uZS50cmltKCksXG4gICAgICBhZGRyZXNzOiBmb3JtLmFkZHJlc3MudHJpbSgpIHx8IHVuZGVmaW5lZCxcbiAgICAgIGVtYWlsOiBmb3JtLmVtYWlsLnRyaW0oKSB8fCB1bmRlZmluZWQsXG4gICAgICBpc1ByaW1hcnk6IGNvbnRhY3RzLmxlbmd0aCA9PT0gMCxcbiAgICB9O1xuXG4gICAgdXBkYXRlQ29udGFjdHMoKGN1cnJlbnQpID0+IFsuLi5jdXJyZW50LCBuZXh0Q29udGFjdF0pO1xuICAgIHNldFNob3dBZGRDb250YWN0KGZhbHNlKTtcbiAgICBzZXRGb3JtKHsgZmlyc3ROYW1lOiAnJywgbGFzdE5hbWU6ICcnLCBwaG9uZTogJycsIGFkZHJlc3M6ICcnLCBlbWFpbDogJycgfSk7XG4gIH07XG5cbiAgaWYgKHZpZXcgPT09ICdoZWxwJykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNhZmV0eS1wYWdlXCI+XG4gICAgICAgIHtoZWFkZXIoJ1NhZmV0eSBoZWxwJywgJ21haW4nKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIHNhZmV0eS1jYXJkXCIgc3R5bGU9e3sgbWFyZ2luOiAnMCAxNnB4IDE2cHgnLCBwYWRkaW5nOiAxOCB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAyMiwgZm9udFdlaWdodDogOTAwLCBtYXJnaW5Cb3R0b206IDEwIH19Pk9wZW4gdGhlIFNhZmV0eSBUb29sa2l0PC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLXRleHQtbGFiZWwpJywgbGluZUhlaWdodDogMS41IH19PlxuICAgICAgICAgICAgSWYgeW91IGV2ZXIgbmVlZCBzYWZldHkgaGVscCBkdXJpbmcgYSB0cmlwLCBnbyB0byB0aGUgQWNjb3VudCBwYWdlIGFuZCB0YXAgdGhlIHJlZCBzYWZldHkgYWxhcm0gYnV0dG9uXG4gICAgICAgICAgICBvbiB0aGUgbWFwIHRvIG9wZW4geW91ciBTYWZldHkgVG9vbGtpdC4gVGhpcyBsZXRzIHlvdSBjb250YWN0IHlvdXIgdHJ1c3RlZCBjb250YWN0IG9yIGVtZXJnZW5jeSBzZXJ2aWNlcy5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgaWYgKHZpZXcgPT09ICd0cnVzdGVkJykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInNhZmV0eS1wYWdlXCI+XG4gICAgICAgIHtoZWFkZXIoJ1RydXN0ZWQgY29udGFjdHMnLCAnbWFpbicpfVxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBzYWZldHktY2FyZFwiIHN0eWxlPXt7IG1hcmdpbjogJzAgMTZweCAxMnB4JywgcGFkZGluZzogMTYgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250V2VpZ2h0OiA5MDAsIGZvbnRTaXplOiAxOCwgbWFyZ2luQm90dG9tOiA4IH19PlNoYXJlIHlvdXIgdHJpcCBzdGF0dXM8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiAndmFyKC0tdGV4dC1sYWJlbCknLCBsaW5lSGVpZ2h0OiAxLjUsIG1hcmdpbkJvdHRvbTogMTQgfX0+XG4gICAgICAgICAgICBZb3Ugd2lsbCBiZSBhYmxlIHRvIHNoYXJlIHlvdXIgbGl2ZSBsb2NhdGlvbiB3aXRoIG9uZSBvciBtb3JlIGNvbnRhY3RzIGR1cmluZyBhbnkgU2FtdWRoeWFuIHJpZGUuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250V2VpZ2h0OiA5MDAsIGZvbnRTaXplOiAxOCwgbWFyZ2luQm90dG9tOiA4IH19PlNldCB5b3VyIGVtZXJnZW5jeSBjb250YWN0czwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6ICd2YXIoLS10ZXh0LWxhYmVsKScsIGxpbmVIZWlnaHQ6IDEuNSB9fT5cbiAgICAgICAgICAgIFlvdSBjYW4gbWFrZSBhIHRydXN0ZWQgY29udGFjdCBhbiBlbWVyZ2VuY3kgY29udGFjdCB0b28uIFNhbXVkaHlhbiBSaWRlIGNhbiBjYWxsIHRoZW0gaWYgd2UgY2Fubm90IHJlYWNoXG4gICAgICAgICAgICB5b3UgaW4gY2FzZSBvZiBhbiBlbWVyZ2VuY3kuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBzYWZldHktY2FyZFwiIHN0eWxlPXt7IG1hcmdpbjogJzAgMTZweCAxMnB4JywgcGFkZGluZzogMTYgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBnYXA6IDEyLCBtYXJnaW5Cb3R0b206IDEwLCBmbGV4V3JhcDogJ3dyYXAnIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250V2VpZ2h0OiA5MDAgfX0+WW91ciBjb250YWN0czwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzaGVldC1hY3Rpb24tYnRuIGJ0bi1hY2NlcHRcIiBzdHlsZT17eyB3aWR0aDogJ2F1dG8nLCBtaW5XaWR0aDogMTMyIH19IG9uQ2xpY2s9eygpID0+IHNldFNob3dBZGRDb250YWN0KHRydWUpfT5cbiAgICAgICAgICAgICAgQWRkIGNvbnRhY3RcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAge2NvbnRhY3RzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6ICd2YXIoLS10ZXh0LWxhYmVsKScgfX0+Tm8gdHJ1c3RlZCBjb250YWN0cyB5ZXQuPC9kaXY+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAxMCB9fT5cbiAgICAgICAgICAgICAge2NvbnRhY3RzLm1hcCgoY29udGFjdCkgPT4gKFxuICAgICAgICAgICAgICAgIDxkaXYga2V5PXtjb250YWN0LmlkfSBjbGFzc05hbWU9XCJ0cnVzdGVkLWNvbnRhY3Qtcm93XCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRydXN0ZWQtY29udGFjdC1tYWluXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiA4LCBmb250V2VpZ2h0OiA4MDAsIGZsZXhXcmFwOiAnd3JhcCcgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgd2hpdGVTcGFjZTogJ25vd3JhcCcsIG92ZXJmbG93OiAnaGlkZGVuJywgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge2NvbnRhY3QuZmlyc3ROYW1lfSB7Y29udGFjdC5sYXN0TmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAge2NvbnRhY3QuaXNQcmltYXJ5ICYmIDxzcGFuIGNsYXNzTmFtZT1cInByaW1hcnktcGlsbFwiPlByaW1hcnk8L3NwYW4+fVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLXRleHQtbGFiZWwpJywgZm9udFNpemU6IDEzLCBtYXJnaW5Ub3A6IDQgfX0+e2NvbnRhY3QucGhvbmV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIHsoY29udGFjdC5hZGRyZXNzIHx8IGNvbnRhY3QuZW1haWwpICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiAndmFyKC0tdGV4dC1sYWJlbCknLCBvcGFjaXR5OiAwLjgsIGZvbnRTaXplOiAxMiwgbWFyZ2luVG9wOiA0IH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge1tjb250YWN0LmFkZHJlc3MsIGNvbnRhY3QuZW1haWxdLmZpbHRlcihCb29sZWFuKS5qb2luKCcgLyAnKX1cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0cnVzdGVkLWNvbnRhY3QtYWN0aW9uc1wiPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgc2hlZXQtYWN0aW9uLWJ0biAke2NvbnRhY3QuaXNQcmltYXJ5ID8gJ2J0bi1jYW5jZWwnIDogJ2J0bi1hY2NlcHQnfWB9XG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0UHJpbWFyeShjb250YWN0LmlkKX1cbiAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17Y29udGFjdC5pc1ByaW1hcnl9XG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgb3BhY2l0eTogY29udGFjdC5pc1ByaW1hcnkgPyAwLjYgOiAxIH19XG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICBTZXQgcHJpbWFyeVxuICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzaGVldC1hY3Rpb24tYnRuIGJ0bi1jYW5jZWxcIiBvbkNsaWNrPXsoKSA9PiByZW1vdmVDb250YWN0KGNvbnRhY3QuaWQpfT5cbiAgICAgICAgICAgICAgICAgICAgICBSZW1vdmVcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAge3ByaW1hcnlJZCAmJiA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogMTIsIGNvbG9yOiAndmFyKC0tdGV4dC1sYWJlbCknLCBmb250U2l6ZTogMTIgfX0+UHJpbWFyeSBjb250YWN0IHdpbGwgYmUgdXNlZCBmaXJzdC48L2Rpdj59XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHtzaG93QWRkQ29udGFjdCAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1iYWNrZHJvcFwiIG9uQ2xpY2s9eygpID0+IHNldFNob3dBZGRDb250YWN0KGZhbHNlKX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNhcmRcIiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBvbkNsaWNrPXsoZXZlbnQpID0+IGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpfT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250V2VpZ2h0OiA5MDAsIGZvbnRTaXplOiAxNiwgbWFyZ2luQm90dG9tOiAxMCwgY29sb3I6ICd2YXIoLS10ZXh0LXR5cGVkKScgfX0+QWRkIHRydXN0ZWQgY29udGFjdDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWdyaWRcIj5cbiAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibW9kYWwtZmllbGRcIj48c3Bhbj5GaXJzdCBuYW1lPC9zcGFuPjxpbnB1dCB2YWx1ZT17Zm9ybS5maXJzdE5hbWV9IG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZvcm0oKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIGZpcnN0TmFtZTogZXZlbnQudGFyZ2V0LnZhbHVlIH0pKX0gdHlwZT1cInRleHRcIiAvPjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm1vZGFsLWZpZWxkXCI+PHNwYW4+TGFzdCBuYW1lPC9zcGFuPjxpbnB1dCB2YWx1ZT17Zm9ybS5sYXN0TmFtZX0gb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0Rm9ybSgoY3VycmVudCkgPT4gKHsgLi4uY3VycmVudCwgbGFzdE5hbWU6IGV2ZW50LnRhcmdldC52YWx1ZSB9KSl9IHR5cGU9XCJ0ZXh0XCIgLz48L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJtb2RhbC1maWVsZFwiPjxzcGFuPlBob25lIG51bWJlcjwvc3Bhbj48aW5wdXQgdmFsdWU9e2Zvcm0ucGhvbmV9IG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZvcm0oKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIHBob25lOiBldmVudC50YXJnZXQudmFsdWUgfSkpfSB0eXBlPVwidGVsXCIgLz48L2xhYmVsPlxuICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJtb2RhbC1maWVsZFwiPjxzcGFuPkFkZHJlc3MgKG9wdGlvbmFsKTwvc3Bhbj48aW5wdXQgdmFsdWU9e2Zvcm0uYWRkcmVzc30gb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0Rm9ybSgoY3VycmVudCkgPT4gKHsgLi4uY3VycmVudCwgYWRkcmVzczogZXZlbnQudGFyZ2V0LnZhbHVlIH0pKX0gdHlwZT1cInRleHRcIiAvPjwvbGFiZWw+XG4gICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm1vZGFsLWZpZWxkXCI+PHNwYW4+RW1haWwgKG9wdGlvbmFsKTwvc3Bhbj48aW5wdXQgdmFsdWU9e2Zvcm0uZW1haWx9IG9uQ2hhbmdlPXsoZXZlbnQpID0+IHNldEZvcm0oKGN1cnJlbnQpID0+ICh7IC4uLmN1cnJlbnQsIGVtYWlsOiBldmVudC50YXJnZXQudmFsdWUgfSkpfSB0eXBlPVwiZW1haWxcIiAvPjwvbGFiZWw+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsIGdhcDogMTAsIG1hcmdpblRvcDogMTQgfX0+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwic2hlZXQtYWN0aW9uLWJ0biBidG4tY2FuY2VsXCIgb25DbGljaz17KCkgPT4gc2V0U2hvd0FkZENvbnRhY3QoZmFsc2UpfT5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJzaGVldC1hY3Rpb24tYnRuIGJ0bi1hY2NlcHRcIiBvbkNsaWNrPXtzdWJtaXRDb250YWN0fSBkaXNhYmxlZD17IWZvcm0uZmlyc3ROYW1lLnRyaW0oKSB8fCAhZm9ybS5sYXN0TmFtZS50cmltKCkgfHwgIWZvcm0ucGhvbmUudHJpbSgpfT5BZGQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBpZiAodmlldyA9PT0gJ3JpZGVjaGVjaycpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzYWZldHktcGFnZVwiPlxuICAgICAgICB7aGVhZGVyKCdSaWRlQ2hlY2snLCAnbWFpbicpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQgc2FmZXR5LWNhcmRcIiBzdHlsZT17eyBtYXJnaW46ICcwIDE2cHggMTZweCcsIHBhZGRpbmc6IDE4IH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFdlaWdodDogOTAwLCBmb250U2l6ZTogMTgsIG1hcmdpbkJvdHRvbTogOCB9fT5XaGF0J3MgYSBSaWRlQ2hlY2s/PC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLXRleHQtbGFiZWwpJywgbGluZUhlaWdodDogMS41LCBtYXJnaW5Cb3R0b206IDE2IH19PlxuICAgICAgICAgICAgSW4gdGhlIGNhc2Ugb2YgYW4gdW5leHBlY3RlZCBldmVudCwgU2FtdWRoeWFuIFJpZGUgd2lsbCBpbml0aWF0ZSBhIFJpZGVDaGVjayB0byBoZWxwIHlvdS5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvZ2dsZS1yb3dcIj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSB9fT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250V2VpZ2h0OiA5MDAsIG1hcmdpbkJvdHRvbTogMiB9fT5SaWRlQ2hlY2sgbm90aWZpY2F0aW9uczwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiAndmFyKC0tdGV4dC1sYWJlbCknLCBmb250U2l6ZTogMTMsIGxpbmVIZWlnaHQ6IDEuNCB9fT5cbiAgICAgICAgICAgICAgICBXZSB3aWxsIHNlbmQgeW91IGEgUmlkZUNoZWNrIG5vdGlmaWNhdGlvbiBpZiBhIHRyaXAgZG9lcyBub3QgcHJvZ3Jlc3MgYXMgcGxhbm5lZC5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJzd2l0Y2hcIj48aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17cmlkZUNoZWNrRW5hYmxlZH0gb25DaGFuZ2U9eyhldmVudCkgPT4gc2V0UmlkZUNoZWNrRW5hYmxlZChldmVudC50YXJnZXQuY2hlY2tlZCl9IC8+PHNwYW4gY2xhc3NOYW1lPVwic2xpZGVyXCIgLz48L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBpZiAodmlldyA9PT0gJ3BpbicpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzYWZldHktcGFnZVwiPlxuICAgICAgICB7aGVhZGVyKCdQSU4gdmVyaWZpY2F0aW9uJywgJ21haW4nKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIHNhZmV0eS1jYXJkXCIgc3R5bGU9e3sgbWFyZ2luOiAnMCAxNnB4IDE2cHgnLCBwYWRkaW5nOiAxOCB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDkwMCwgZm9udFNpemU6IDIyLCBtYXJnaW5Cb3R0b206IDEwIH19PlZlcmlmeSB5b3VyIHRyaXBzPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLXRleHQtbGFiZWwpJywgbGluZUhlaWdodDogMS41LCBtYXJnaW5Cb3R0b206IDE4IH19PlxuICAgICAgICAgICAgSGVscCBtYWtlIHN1cmUgeW91IGdldCBpbnRvIHRoZSByaWdodCBjYXIgYnkgdmVyaWZ5aW5nIHlvdXIgdHJpcCB3aXRoIGEgUElOLlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9nZ2xlLXJvd1wiPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBmb250V2VpZ2h0OiA5MDAgfX0+VXNlIFBJTiB0byB2ZXJpZnkgdHJpcHM8L2Rpdj5cbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJzd2l0Y2hcIj5cbiAgICAgICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgICAgICBjaGVja2VkPXtwaW5FbmFibGVkfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHQgPSBldmVudC50YXJnZXQuY2hlY2tlZDtcbiAgICAgICAgICAgICAgICAgIHNldFBpbkVuYWJsZWQobmV4dCk7XG4gICAgICAgICAgICAgICAgICBpZiAobmV4dCkgc2V0UGluQ29kZShnZW5QaW4oKSk7XG4gICAgICAgICAgICAgICAgICBlbHNlIHNldFBpbkNvZGUoJycpO1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNsaWRlclwiIC8+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtwaW5FbmFibGVkICYmIHBpbkNvZGUgJiYgKFxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IDE2IH19PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDgwMCwgbWFyZ2luQm90dG9tOiA2IH19PllvdXIgdHJpcCBQSU48L2Rpdj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwaW4tYm94XCI+e3BpbkNvZGV9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBpZiAodmlldyA9PT0gJ2RyaXZlcicpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzYWZldHktcGFnZVwiPlxuICAgICAgICB7aGVhZGVyKCdEcml2ZXIgc2FmZXR5IHN0YW5kYXJkcycsICdtYWluJyl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBzYWZldHktY2FyZFwiIHN0eWxlPXt7IG1hcmdpbjogJzAgMTZweCAxNnB4JywgcGFkZGluZzogMTggfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250V2VpZ2h0OiA5MDAsIGZvbnRTaXplOiAyMiwgbWFyZ2luQm90dG9tOiAxMiB9fT5Ecml2ZXIgc2FmZXR5IHN0YW5kYXJkczwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2FmZXR5LXNlY3Rpb25cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2FmZXR5LXNlY3Rpb24tdGl0bGVcIj5Ecml2ZXIgc2NyZWVuaW5nPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNhZmV0eS1zZWN0aW9uLXRleHRcIj5CZWZvcmUgYW55b25lIGNhbiBkcml2ZSwgdGhleSBoYXZlIHRvIHBhc3MgYSBzY3JlZW5pbmcuPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzYWZldHktc2VjdGlvblwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzYWZldHktc2VjdGlvbi10aXRsZVwiPlJlYWwtdGltZSBJRCBjaGVjazwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzYWZldHktc2VjdGlvbi10ZXh0XCI+RHJpdmVycyBtdXN0IHN1Ym1pdCBwaG90b3MgdG8gdmVyaWZ5IHRoZWlyIGlkZW50aXR5LjwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwic2hlZXQtYWN0aW9uLWJ0biBidG4tYWNjZXB0XCIgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJywgbWFyZ2luVG9wOiAyMCB9fSBvbkNsaWNrPXsoKSA9PiBzZXRWaWV3KCdtYWluJyl9PkdvdCBpdDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic2FmZXR5LXBhZ2VcIj5cbiAgICAgIHtoZWFkZXIoJ1NhZmV0eSBjaGVjay11cCcpfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIHNhZmV0eS1jYXJkXCIgc3R5bGU9e3sgbWFyZ2luOiAnMCAxNnB4IDE0cHgnLCBwYWRkaW5nOiAxOCB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogMjIsIGZvbnRXZWlnaHQ6IDkwMCwgbWFyZ2luQm90dG9tOiA2IH19PlNhZmV0eSBjaGVjay11cDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiAndmFyKC0tdGV4dC1sYWJlbCknLCBsaW5lSGVpZ2h0OiAxLjUgfX0+VG8gaGVscCBrZWVwIHlvdXJzZWxmIHNhZmUgb24gZXZlcnkgdHJpcCwgcmV2aWV3IHlvdXIgY3VycmVudCBzYWZldHkgc2V0dGluZ3MuPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIHNhZmV0eS1jYXJkIHNhZmV0eS1saXN0LWNhcmRcIiBzdHlsZT17eyBtYXJnaW46ICcwIDE2cHggMTZweCcsIHBhZGRpbmc6IDAsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnMTRweCAxNnB4IDEwcHgnLCBmb250V2VpZ2h0OiA5MDAsIGNvbG9yOiAndmFyKC0tdGV4dC10eXBlZCknIH19PlNhZmV0eSBzZXR0aW5nczwvZGl2PlxuICAgICAgICA8TGlzdFJvdyB0aXRsZT1cIlNhZmV0eSBoZWxwXCIgc3VidGl0bGU9XCJMZWFybiBob3cgdG8gZ2V0IGhlbHAgZHVyaW5nIGEgdHJpcFwiIGNoZWNrZWQgb25DbGljaz17KCkgPT4gc2V0VmlldygnaGVscCcpfSAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNhZmV0eS1yb3ctZGl2aWRlclwiIC8+XG4gICAgICAgIDxMaXN0Um93IHRpdGxlPVwiVHJ1c3RlZCBjb250YWN0c1wiIHN1YnRpdGxlPVwiQ2hvb3NlIGZyaWVuZHMgb3IgZmFtaWx5IHRvIHNoYXJlIHlvdXIgbG9jYXRpb25cIiBjaGVja2VkPXtjb250YWN0cy5sZW5ndGggPiAwfSBvbkNsaWNrPXsoKSA9PiBzZXRWaWV3KCd0cnVzdGVkJyl9IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2FmZXR5LXJvdy1kaXZpZGVyXCIgLz5cbiAgICAgICAgPExpc3RSb3cgdGl0bGU9XCJQSU4gdmVyaWZpY2F0aW9uXCIgc3VidGl0bGU9XCJTZWN1cmUgeW91ciB0cmlwIGJ5IHJlcXVpcmluZyBhIHNpbXBsZSBjb2RlXCIgY2hlY2tlZD17cGluRW5hYmxlZH0gb25DbGljaz17KCkgPT4gc2V0VmlldygncGluJyl9IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2FmZXR5LXJvdy1kaXZpZGVyXCIgLz5cbiAgICAgICAgPExpc3RSb3cgdGl0bGU9XCJSaWRlQ2hlY2tcIiBzdWJ0aXRsZT1cIlJlY2VpdmUgYXV0b21hdGljIGNoZWNrLWluc1wiIGNoZWNrZWQ9e3JpZGVDaGVja0VuYWJsZWR9IG9uQ2xpY2s9eygpID0+IHNldFZpZXcoJ3JpZGVjaGVjaycpfSAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNhZmV0eS1yb3ctZGl2aWRlclwiIC8+XG4gICAgICAgIDxMaXN0Um93IHRpdGxlPVwiRHJpdmVyIHNhZmV0eSBzdGFuZGFyZHNcIiBzdWJ0aXRsZT1cIkxlYXJuIGFib3V0IG91ciBzYWZldHkgc3RhbmRhcmRzIGZvciBkcml2ZXJzXCIgb25DbGljaz17KCkgPT4gc2V0VmlldygnZHJpdmVyJyl9IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNhZmV0eUNoZWNrdXBQYWdlO1xuIl0sImZpbGUiOiJDOi9Vc2Vycy95bGFubi92c2NvZGUvVW5pL1NhbXVkaHlhblJpZGVzL2Zyb250ZW5kL3NyYy9TYWZldHlDaGVja3VwUGFnZS50c3gifQ==