import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/AccountPage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c85c9c72"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=c85c9c72"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useEffect = __vite__cjsImport1_react["useEffect"]; const useState = __vite__cjsImport1_react["useState"];
import { apiFetch } from "/src/lib/api.ts";
import {
  getPrimaryTrustedContact,
  getProfileRecord,
  loadTrustedContactsFromStorage,
  normalizeTrustedContacts,
  saveTrustedContactsToStorage
} from "/src/lib/profilePreferences.ts";
const QuickActionCard = ({
  emoji,
  label,
  hasDot = false,
  onClick,
  style,
  iconColor
}) => /* @__PURE__ */ jsxDEV("button", { className: "card quick-card", onClick, style, children: [
  /* @__PURE__ */ jsxDEV("div", { className: "card-icon small-icon", children: /* @__PURE__ */ jsxDEV("span", { className: "icon-glyph", style: iconColor ? { color: iconColor } : void 0, children: emoji }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
    lineNumber: 31,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
    lineNumber: 30,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV("span", { className: "quick-card-label", children: label }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
    lineNumber: 35,
    columnNumber: 5
  }, this),
  hasDot && /* @__PURE__ */ jsxDEV("span", { className: "quick-card-dot" }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
    lineNumber: 36,
    columnNumber: 16
  }, this)
] }, void 0, true, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
  lineNumber: 29,
  columnNumber: 1
}, this);
_c = QuickActionCard;
const InfoCard = ({ title, subtitle, right, onClick }) => /* @__PURE__ */ jsxDEV(
  "div",
  {
    className: "card info-card",
    onClick,
    role: onClick ? "button" : void 0,
    tabIndex: onClick ? 0 : void 0,
    style: onClick ? { cursor: "pointer" } : void 0,
    onKeyDown: (e) => {
      if (!onClick) return;
      if (e.key === "Enter" || e.key === " ") onClick();
    },
    children: [
      /* @__PURE__ */ jsxDEV("div", { className: "info-card-main", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "info-card-title", children: title }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
          lineNumber: 61,
          columnNumber: 7
        }, this),
        subtitle && /* @__PURE__ */ jsxDEV("div", { className: "info-card-subtitle", children: subtitle }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
          lineNumber: 62,
          columnNumber: 20
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
        lineNumber: 60,
        columnNumber: 5
      }, this),
      right && /* @__PURE__ */ jsxDEV("div", { className: "info-card-right", children: right }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
        lineNumber: 64,
        columnNumber: 15
      }, this)
    ]
  },
  void 0,
  true,
  {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
    lineNumber: 49,
    columnNumber: 1
  },
  this
);
_c2 = InfoCard;
const AccountPage = ({ onLogout, onOpenSettings, onOpenTimetable, onOpenSafetyCheckup, onOpenInbox, unreadCount = 0 }) => {
  _s();
  const [userName, setUserName] = useState("Loading...");
  const [rating, setRating] = useState("...");
  const [trustedContacts, setTrustedContacts] = useState(() => loadTrustedContactsFromStorage());
  const [showSafetyToolkit, setShowSafetyToolkit] = useState(false);
  const callNumber = (phone) => {
    window.location.href = `tel:${phone.replace(/\s+/g, "")}`;
  };
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;
      try {
        const data = await apiFetch("users/me", {
          method: "GET"
          // no need to manually add Authorization if apiFetch already does it
        });
        const profile = getProfileRecord(data);
        if (profile) {
          const storedContacts = loadTrustedContactsFromStorage();
          const profileContacts = normalizeTrustedContacts(profile.trusted_contacts);
          const nextContacts = profileContacts.length > 0 ? profileContacts : storedContacts;
          setTrustedContacts(nextContacts);
          if (profileContacts.length > 0) {
            saveTrustedContactsToStorage(nextContacts);
          }
          const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
          setUserName(fullName || String(profile.university_username || "University Student"));
          const rawRating = Number(profile.rider_rating);
          const userRating = profile.rider_rating === null || profile.rider_rating === void 0 || rawRating === 0 ? "No rating" : rawRating.toFixed(2);
          setRating(userRating);
        } else {
          setUserName("Unknown User");
          setRating("N/A");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUserName("Unknown User");
        setRating("N/A");
      }
    };
    fetchProfile();
  }, []);
  const handleLogoutClick = async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        await apiFetch("auth/logout", {
          method: "POST"
        });
      } catch (error) {
        console.error("Error communicating with logout endpoint:", error);
      }
    }
    onLogout();
  };
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("header", { className: "account-header", children: /* @__PURE__ */ jsxDEV("div", { className: "account-info", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "account-name", children: userName }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
        lineNumber: 165,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "rating-badge", children: [
        "★ ",
        rating
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
        lineNumber: 166,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
      lineNumber: 164,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
      lineNumber: 163,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "quick-actions-grid", children: [
      /* @__PURE__ */ jsxDEV(QuickActionCard, { emoji: "⚙", label: "Settings", onClick: onOpenSettings }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
        lineNumber: 171,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(QuickActionCard, { emoji: "➜", label: "Logout", onClick: handleLogoutClick }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
        lineNumber: 172,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        QuickActionCard,
        {
          emoji: "⚠️",
          label: "Safety Alarm",
          iconColor: "#ff5555",
          onClick: () => setShowSafetyToolkit(true)
        },
        void 0,
        false,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
          lineNumber: 173,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(QuickActionCard, { emoji: "✉", label: "Inbox", hasDot: unreadCount > 0, onClick: onOpenInbox }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
        lineNumber: 178,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
      lineNumber: 170,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      InfoCard,
      {
        title: "Your timetable",
        subtitle: "See and manage your upcoming rides for uni.",
        right: /* @__PURE__ */ jsxDEV("span", { className: "info-card-emoji", children: "📅" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
          lineNumber: 184,
          columnNumber: 16
        }, this),
        onClick: onOpenTimetable
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
        lineNumber: 181,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      InfoCard,
      {
        title: "Safety check-up",
        subtitle: "Learn ways to make rides safer.",
        right: /* @__PURE__ */ jsxDEV("div", { className: "safety-progress", children: /* @__PURE__ */ jsxDEV("span", { className: "safety-progress-ring", children: "1/5" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
          lineNumber: 193,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
          lineNumber: 192,
          columnNumber: 9
        }, this),
        onClick: onOpenSafetyCheckup
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
        lineNumber: 188,
        columnNumber: 7
      },
      this
    ),
    showSafetyToolkit && (() => {
      const primary = getPrimaryTrustedContact(trustedContacts);
      return /* @__PURE__ */ jsxDEV("div", { className: "modal-backdrop", onClick: () => setShowSafetyToolkit(false), children: /* @__PURE__ */ jsxDEV("div", { className: "modal-card", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 900, fontSize: 18, marginBottom: 10 }, children: "Safety Toolkit" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
          lineNumber: 204,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { color: "rgba(255,255,255,0.75)", lineHeight: 1.5, marginBottom: 14 }, children: "Choose who to contact." }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
          lineNumber: 206,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
          /* @__PURE__ */ jsxDEV("button", { className: "sheet-action-btn btn-cancel", onClick: () => callNumber("999"), children: "Call 999" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
            lineNumber: 211,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              className: "sheet-action-btn btn-accept",
              onClick: () => {
                if (!primary) return;
                callNumber(primary.phone);
              },
              disabled: !primary,
              style: { opacity: primary ? 1 : 0.55 },
              title: !primary ? "Add a trusted contact in Safety check-up first" : void 0,
              children: [
                "Call your trusted contact",
                primary ? ` (${primary.firstName} ${primary.lastName})` : ""
              ]
            },
            void 0,
            true,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
              lineNumber: 215,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("button", { className: "sheet-action-btn btn-message", onClick: () => callNumber("01225 383999"), children: "Call campus security (01225 383999)" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
            lineNumber: 228,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV("button", { className: "sheet-action-btn btn-message", onClick: () => setShowSafetyToolkit(false), children: "Close" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
            lineNumber: 232,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
          lineNumber: 210,
          columnNumber: 9
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
        lineNumber: 203,
        columnNumber: 7
      }, this) }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
        lineNumber: 202,
        columnNumber: 11
      }, this);
    })()
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx",
    lineNumber: 162,
    columnNumber: 5
  }, this);
};
_s(AccountPage, "lloX5nd/YLRblUZL94hTJh0YxHo=");
_c3 = AccountPage;
export default AccountPage;
var _c, _c2, _c3;
$RefreshReg$(_c, "QuickActionCard");
$RefreshReg$(_c2, "InfoCard");
$RefreshReg$(_c3, "AccountPage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/AccountPage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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QUFZLElBQUFULElBQUFRLEtBQUE2RDtBQUFBQyxhQUFBdEUsSUFBQTtBQUFBc0UsYUFBQTlELEtBQUE7QUFBQThELGFBQUFELEtBQUEiLCJuYW1lcyI6WyJSZWFjdCIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiYXBpRmV0Y2giLCJnZXRQcmltYXJ5VHJ1c3RlZENvbnRhY3QiLCJnZXRQcm9maWxlUmVjb3JkIiwibG9hZFRydXN0ZWRDb250YWN0c0Zyb21TdG9yYWdlIiwibm9ybWFsaXplVHJ1c3RlZENvbnRhY3RzIiwic2F2ZVRydXN0ZWRDb250YWN0c1RvU3RvcmFnZSIsIlF1aWNrQWN0aW9uQ2FyZCIsImVtb2ppIiwibGFiZWwiLCJoYXNEb3QiLCJvbkNsaWNrIiwic3R5bGUiLCJpY29uQ29sb3IiLCJjb2xvciIsInVuZGVmaW5lZCIsIl9jIiwiSW5mb0NhcmQiLCJ0aXRsZSIsInN1YnRpdGxlIiwicmlnaHQiLCJjdXJzb3IiLCJlIiwia2V5IiwiX2MyIiwiQWNjb3VudFBhZ2UiLCJvbkxvZ291dCIsIm9uT3BlblNldHRpbmdzIiwib25PcGVuVGltZXRhYmxlIiwib25PcGVuU2FmZXR5Q2hlY2t1cCIsIm9uT3BlbkluYm94IiwidW5yZWFkQ291bnQiLCJfcyIsInVzZXJOYW1lIiwic2V0VXNlck5hbWUiLCJyYXRpbmciLCJzZXRSYXRpbmciLCJ0cnVzdGVkQ29udGFjdHMiLCJzZXRUcnVzdGVkQ29udGFjdHMiLCJzaG93U2FmZXR5VG9vbGtpdCIsInNldFNob3dTYWZldHlUb29sa2l0IiwiY2FsbE51bWJlciIsInBob25lIiwid2luZG93IiwibG9jYXRpb24iLCJocmVmIiwicmVwbGFjZSIsImZldGNoUHJvZmlsZSIsInRva2VuIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsImRhdGEiLCJtZXRob2QiLCJwcm9maWxlIiwic3RvcmVkQ29udGFjdHMiLCJwcm9maWxlQ29udGFjdHMiLCJ0cnVzdGVkX2NvbnRhY3RzIiwibmV4dENvbnRhY3RzIiwibGVuZ3RoIiwiZnVsbE5hbWUiLCJmaXJzdF9uYW1lIiwibGFzdF9uYW1lIiwidHJpbSIsIlN0cmluZyIsInVuaXZlcnNpdHlfdXNlcm5hbWUiLCJyYXdSYXRpbmciLCJOdW1iZXIiLCJyaWRlcl9yYXRpbmciLCJ1c2VyUmF0aW5nIiwidG9GaXhlZCIsImVycm9yIiwiY29uc29sZSIsImhhbmRsZUxvZ291dENsaWNrIiwicHJpbWFyeSIsInN0b3BQcm9wYWdhdGlvbiIsImZvbnRXZWlnaHQiLCJmb250U2l6ZSIsIm1hcmdpbkJvdHRvbSIsImxpbmVIZWlnaHQiLCJkaXNwbGF5IiwiZmxleERpcmVjdGlvbiIsImdhcCIsIm9wYWNpdHkiLCJmaXJzdE5hbWUiLCJsYXN0TmFtZSIsIl9jMyIsIiRSZWZyZXNoUmVnJCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJBY2NvdW50UGFnZS50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHR5cGUgQ1NTUHJvcGVydGllcywgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGFwaUZldGNoIH0gZnJvbSAnLi9saWIvYXBpJztcbmltcG9ydCB7XG4gIHR5cGUgVHJ1c3RlZENvbnRhY3QsXG4gIGdldFByaW1hcnlUcnVzdGVkQ29udGFjdCxcbiAgZ2V0UHJvZmlsZVJlY29yZCxcbiAgbG9hZFRydXN0ZWRDb250YWN0c0Zyb21TdG9yYWdlLFxuICBub3JtYWxpemVUcnVzdGVkQ29udGFjdHMsXG4gIHNhdmVUcnVzdGVkQ29udGFjdHNUb1N0b3JhZ2UsXG59IGZyb20gJy4vbGliL3Byb2ZpbGVQcmVmZXJlbmNlcyc7XG5cclxudHlwZSBRdWlja0FjdGlvbkNhcmRQcm9wcyA9IHtcclxuICBlbW9qaTogc3RyaW5nO1xyXG4gIGxhYmVsOiBzdHJpbmc7XHJcbiAgaGFzRG90PzogYm9vbGVhbjtcclxuICBvbkNsaWNrPzogKCkgPT4gdm9pZDtcclxuICBzdHlsZT86IENTU1Byb3BlcnRpZXM7XHJcbiAgaWNvbkNvbG9yPzogc3RyaW5nO1xyXG59O1xyXG5cclxuY29uc3QgUXVpY2tBY3Rpb25DYXJkOiBSZWFjdC5GQzxRdWlja0FjdGlvbkNhcmRQcm9wcz4gPSAoe1xyXG4gIGVtb2ppLFxyXG4gIGxhYmVsLFxyXG4gIGhhc0RvdCA9IGZhbHNlLFxyXG4gIG9uQ2xpY2ssXHJcbiAgc3R5bGUsXHJcbiAgaWNvbkNvbG9yLFxyXG59KSA9PiAoXHJcbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJjYXJkIHF1aWNrLWNhcmRcIiBvbkNsaWNrPXtvbkNsaWNrfSBzdHlsZT17c3R5bGV9PlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkLWljb24gc21hbGwtaWNvblwiPlxyXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uLWdseXBoXCIgc3R5bGU9e2ljb25Db2xvciA/IHsgY29sb3I6IGljb25Db2xvciB9IDogdW5kZWZpbmVkfT5cclxuICAgICAgICB7ZW1vaml9XHJcbiAgICAgIDwvc3Bhbj5cclxuICAgIDwvZGl2PlxyXG4gICAgPHNwYW4gY2xhc3NOYW1lPVwicXVpY2stY2FyZC1sYWJlbFwiPntsYWJlbH08L3NwYW4+XHJcbiAgICB7aGFzRG90ICYmIDxzcGFuIGNsYXNzTmFtZT1cInF1aWNrLWNhcmQtZG90XCIgLz59XHJcbiAgPC9idXR0b24+XHJcbik7XHJcblxyXG50eXBlIEluZm9DYXJkUHJvcHMgPSB7XHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBzdWJ0aXRsZT86IHN0cmluZztcclxuICByaWdodD86IFJlYWN0LlJlYWN0Tm9kZTtcclxuICBvbkNsaWNrPzogKCkgPT4gdm9pZDtcclxufTtcclxuXHJcblxyXG5jb25zdCBJbmZvQ2FyZDogUmVhY3QuRkM8SW5mb0NhcmRQcm9wcz4gPSAoeyB0aXRsZSwgc3VidGl0bGUsIHJpZ2h0LCBvbkNsaWNrIH0pID0+IChcclxuICA8ZGl2XHJcbiAgICBjbGFzc05hbWU9XCJjYXJkIGluZm8tY2FyZFwiXHJcbiAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgcm9sZT17b25DbGljayA/ICdidXR0b24nIDogdW5kZWZpbmVkfVxyXG4gICAgdGFiSW5kZXg9e29uQ2xpY2sgPyAwIDogdW5kZWZpbmVkfVxyXG4gICAgc3R5bGU9e29uQ2xpY2sgPyB7IGN1cnNvcjogJ3BvaW50ZXInIH0gOiB1bmRlZmluZWR9XHJcbiAgICBvbktleURvd249eyhlKSA9PiB7XHJcbiAgICAgIGlmICghb25DbGljaykgcmV0dXJuO1xyXG4gICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicgfHwgZS5rZXkgPT09ICcgJykgb25DbGljaygpO1xyXG4gICAgfX1cclxuICA+XHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImluZm8tY2FyZC1tYWluXCI+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5mby1jYXJkLXRpdGxlXCI+e3RpdGxlfTwvZGl2PlxyXG4gICAgICB7c3VidGl0bGUgJiYgPGRpdiBjbGFzc05hbWU9XCJpbmZvLWNhcmQtc3VidGl0bGVcIj57c3VidGl0bGV9PC9kaXY+fVxyXG4gICAgPC9kaXY+XHJcbiAgICB7cmlnaHQgJiYgPGRpdiBjbGFzc05hbWU9XCJpbmZvLWNhcmQtcmlnaHRcIj57cmlnaHR9PC9kaXY+fVxyXG4gIDwvZGl2PlxyXG4pO1xyXG5cclxudHlwZSBBY2NvdW50UGFnZVByb3BzID0ge1xuICBvbkxvZ291dDogKCkgPT4gdm9pZDtcclxuICBvbk9wZW5TZXR0aW5nczogKCkgPT4gdm9pZDtcclxuICBvbk9wZW5UaW1ldGFibGU6ICgpID0+IHZvaWQ7XHJcbiAgb25PcGVuU2FmZXR5Q2hlY2t1cDogKCkgPT4gdm9pZDtcclxuICBvbk9wZW5JbmJveD86ICgpID0+IHZvaWQ7XHJcbiAgdW5yZWFkQ291bnQ/OiBudW1iZXI7XG59O1xuXG50eXBlIEFjY291bnRQcm9maWxlID0ge1xuICBmaXJzdF9uYW1lPzogc3RyaW5nO1xuICBsYXN0X25hbWU/OiBzdHJpbmc7XG4gIHVuaXZlcnNpdHlfdXNlcm5hbWU/OiBzdHJpbmc7XG4gIHJpZGVyX3JhdGluZz86IG51bWJlciB8IG51bGw7XG4gIHRydXN0ZWRfY29udGFjdHM/OiB1bmtub3duO1xufTtcblxuY29uc3QgQWNjb3VudFBhZ2U6IFJlYWN0LkZDPEFjY291bnRQYWdlUHJvcHM+ID0gKHsgb25Mb2dvdXQsIG9uT3BlblNldHRpbmdzLCBvbk9wZW5UaW1ldGFibGUsIG9uT3BlblNhZmV0eUNoZWNrdXAsIG9uT3BlbkluYm94LCB1bnJlYWRDb3VudCA9IDAgfSkgPT4geyAgXG4gIGNvbnN0IFt1c2VyTmFtZSwgc2V0VXNlck5hbWVdID0gdXNlU3RhdGU8c3RyaW5nPignTG9hZGluZy4uLicpO1xuICBjb25zdCBbcmF0aW5nLCBzZXRSYXRpbmddID0gdXNlU3RhdGU8bnVtYmVyIHwgc3RyaW5nPignLi4uJyk7XG4gIGNvbnN0IFt0cnVzdGVkQ29udGFjdHMsIHNldFRydXN0ZWRDb250YWN0c10gPSB1c2VTdGF0ZTxUcnVzdGVkQ29udGFjdFtdPigoKSA9PiBsb2FkVHJ1c3RlZENvbnRhY3RzRnJvbVN0b3JhZ2UoKSk7XG5cbiAgY29uc3QgW3Nob3dTYWZldHlUb29sa2l0LCBzZXRTaG93U2FmZXR5VG9vbGtpdF0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgY2FsbE51bWJlciA9IChwaG9uZTogc3RyaW5nKSA9PiB7XG4gICAgLy8gV29ya3Mgb24gbW9iaWxlOyBvbiBkZXNrdG9wIGl0IG1heSBqdXN0IGRvIG5vdGhpbmcgKGV4cGVjdGVkKVxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYHRlbDoke3Bob25lLnJlcGxhY2UoL1xccysvZywgJycpfWA7XG4gIH07XG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgZmV0Y2hQcm9maWxlID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhdXRoVG9rZW4nKTtcclxuICAgICAgaWYgKCF0b2tlbikgcmV0dXJuO1xyXG5cclxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGFwaUZldGNoPGFueT4oJ3VzZXJzL21lJywge1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgLy8gbm8gbmVlZCB0byBtYW51YWxseSBhZGQgQXV0aG9yaXphdGlvbiBpZiBhcGlGZXRjaCBhbHJlYWR5IGRvZXMgaXRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgcHJvZmlsZSA9IGdldFByb2ZpbGVSZWNvcmQoZGF0YSkgYXMgQWNjb3VudFByb2ZpbGUgfCBudWxsO1xuXG4gICAgICAgIGlmIChwcm9maWxlKSB7XG4gICAgICAgICAgY29uc3Qgc3RvcmVkQ29udGFjdHMgPSBsb2FkVHJ1c3RlZENvbnRhY3RzRnJvbVN0b3JhZ2UoKTtcbiAgICAgICAgICBjb25zdCBwcm9maWxlQ29udGFjdHMgPSBub3JtYWxpemVUcnVzdGVkQ29udGFjdHMocHJvZmlsZS50cnVzdGVkX2NvbnRhY3RzKTtcbiAgICAgICAgICBjb25zdCBuZXh0Q29udGFjdHMgPSBwcm9maWxlQ29udGFjdHMubGVuZ3RoID4gMCA/IHByb2ZpbGVDb250YWN0cyA6IHN0b3JlZENvbnRhY3RzO1xuXG4gICAgICAgICAgc2V0VHJ1c3RlZENvbnRhY3RzKG5leHRDb250YWN0cyk7XG4gICAgICAgICAgaWYgKHByb2ZpbGVDb250YWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzYXZlVHJ1c3RlZENvbnRhY3RzVG9TdG9yYWdlKG5leHRDb250YWN0cyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgZnVsbE5hbWUgPSBgJHtwcm9maWxlLmZpcnN0X25hbWUgfHwgJyd9ICR7cHJvZmlsZS5sYXN0X25hbWUgfHwgJyd9YC50cmltKCk7XG4gICAgICAgICAgc2V0VXNlck5hbWUoZnVsbE5hbWUgfHwgU3RyaW5nKHByb2ZpbGUudW5pdmVyc2l0eV91c2VybmFtZSB8fCAnVW5pdmVyc2l0eSBTdHVkZW50JykpO1xuXG4gICAgICAgICAgY29uc3QgcmF3UmF0aW5nID0gTnVtYmVyKHByb2ZpbGUucmlkZXJfcmF0aW5nKTtcblxuICAgICAgICAgIGNvbnN0IHVzZXJSYXRpbmcgPVxuICAgICAgICAgICAgcHJvZmlsZS5yaWRlcl9yYXRpbmcgPT09IG51bGwgfHwgcHJvZmlsZS5yaWRlcl9yYXRpbmcgPT09IHVuZGVmaW5lZCB8fCByYXdSYXRpbmcgPT09IDBcbiAgICAgICAgICAgICAgPyAnTm8gcmF0aW5nJ1xuICAgICAgICAgICAgICA6IHJhd1JhdGluZy50b0ZpeGVkKDIpO1xuXHJcbiAgICAgICAgICBzZXRSYXRpbmcodXNlclJhdGluZyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNldFVzZXJOYW1lKCdVbmtub3duIFVzZXInKTtcclxuICAgICAgICAgIHNldFJhdGluZygnTi9BJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIHByb2ZpbGU6JywgZXJyb3IpO1xyXG4gICAgICAgIHNldFVzZXJOYW1lKCdVbmtub3duIFVzZXInKTtcclxuICAgICAgICBzZXRSYXRpbmcoJ04vQScpO1xyXG4gICAgICB9XG4gICAgfTtcblxuICAgIGZldGNoUHJvZmlsZSgpO1xuICB9LCBbXSk7XG5cclxuICBjb25zdCBoYW5kbGVMb2dvdXRDbGljayA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2F1dGhUb2tlbicpO1xyXG5cclxuICAgIGlmICh0b2tlbikge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IGFwaUZldGNoKCdhdXRoL2xvZ291dCcsIHtcclxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNvbW11bmljYXRpbmcgd2l0aCBsb2dvdXQgZW5kcG9pbnQ6JywgZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Mb2dvdXQoKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImFjY291bnQtaGVhZGVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY2NvdW50LWluZm9cIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWNjb3VudC1uYW1lXCI+e3VzZXJOYW1lfTwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyYXRpbmctYmFkZ2VcIj7imIUge3JhdGluZ308L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9oZWFkZXI+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInF1aWNrLWFjdGlvbnMtZ3JpZFwiPlxyXG4gICAgICAgIDxRdWlja0FjdGlvbkNhcmQgZW1vamk9XCLimplcIiBsYWJlbD1cIlNldHRpbmdzXCIgb25DbGljaz17b25PcGVuU2V0dGluZ3N9IC8+XHJcbiAgICAgICAgPFF1aWNrQWN0aW9uQ2FyZCBlbW9qaT1cIuKenFwiIGxhYmVsPVwiTG9nb3V0XCIgb25DbGljaz17aGFuZGxlTG9nb3V0Q2xpY2t9IC8+XHJcbiAgICAgICAgPFF1aWNrQWN0aW9uQ2FyZCBcclxuICAgICAgICBlbW9qaT1cIuKaoO+4j1wiIFxyXG4gICAgICAgIGxhYmVsPVwiU2FmZXR5IEFsYXJtXCIgXHJcbiAgICAgICAgaWNvbkNvbG9yPVwiI2ZmNTU1NVwiXHJcbiAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2hvd1NhZmV0eVRvb2xraXQodHJ1ZSl9IC8+XHJcbiAgICAgICAgPFF1aWNrQWN0aW9uQ2FyZCBlbW9qaT1cIuKciVwiIGxhYmVsPVwiSW5ib3hcIiBoYXNEb3Q9e3VucmVhZENvdW50ID4gMH0gb25DbGljaz17b25PcGVuSW5ib3h9IC8+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPEluZm9DYXJkXHJcbiAgICAgICAgdGl0bGU9XCJZb3VyIHRpbWV0YWJsZVwiXHJcbiAgICAgICAgc3VidGl0bGU9XCJTZWUgYW5kIG1hbmFnZSB5b3VyIHVwY29taW5nIHJpZGVzIGZvciB1bmkuXCJcclxuICAgICAgICByaWdodD17PHNwYW4gY2xhc3NOYW1lPVwiaW5mby1jYXJkLWVtb2ppXCI+8J+ThTwvc3Bhbj59XHJcbiAgICAgICAgb25DbGljaz17b25PcGVuVGltZXRhYmxlfVxyXG4gICAgICAvPlxyXG5cclxuICAgICAgPEluZm9DYXJkXHJcbiAgICAgICAgdGl0bGU9XCJTYWZldHkgY2hlY2stdXBcIlxyXG4gICAgICAgIHN1YnRpdGxlPVwiTGVhcm4gd2F5cyB0byBtYWtlIHJpZGVzIHNhZmVyLlwiXHJcbiAgICAgICAgcmlnaHQ9e1xyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzYWZldHktcHJvZ3Jlc3NcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic2FmZXR5LXByb2dyZXNzLXJpbmdcIj4xLzU8L3NwYW4+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICB9XHJcbiAgICAgICAgb25DbGljaz17b25PcGVuU2FmZXR5Q2hlY2t1cH1cclxuICAgICAgLz5cbiAgICB7c2hvd1NhZmV0eVRvb2xraXQgJiYgKCgpID0+IHtcbiAgY29uc3QgcHJpbWFyeSA9IGdldFByaW1hcnlUcnVzdGVkQ29udGFjdCh0cnVzdGVkQ29udGFjdHMpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1iYWNrZHJvcFwiIG9uQ2xpY2s9eygpID0+IHNldFNob3dTYWZldHlUb29sa2l0KGZhbHNlKX0+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtY2FyZFwiIG9uQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDkwMCwgZm9udFNpemU6IDE4LCBtYXJnaW5Cb3R0b206IDEwIH19PlNhZmV0eSBUb29sa2l0PC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDAuNzUpJywgbGluZUhlaWdodDogMS41LCBtYXJnaW5Cb3R0b206IDE0IH19PlxyXG4gICAgICAgICAgQ2hvb3NlIHdobyB0byBjb250YWN0LlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogMTAgfX0+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInNoZWV0LWFjdGlvbi1idG4gYnRuLWNhbmNlbFwiIG9uQ2xpY2s9eygpID0+IGNhbGxOdW1iZXIoJzk5OScpfT5cclxuICAgICAgICAgICAgQ2FsbCA5OTlcclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwic2hlZXQtYWN0aW9uLWJ0biBidG4tYWNjZXB0XCJcclxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmICghcHJpbWFyeSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgIGNhbGxOdW1iZXIocHJpbWFyeS5waG9uZSk7XHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIGRpc2FibGVkPXshcHJpbWFyeX1cclxuICAgICAgICAgICAgc3R5bGU9e3sgb3BhY2l0eTogcHJpbWFyeSA/IDEgOiAwLjU1IH19XHJcbiAgICAgICAgICAgIHRpdGxlPXshcHJpbWFyeSA/ICdBZGQgYSB0cnVzdGVkIGNvbnRhY3QgaW4gU2FmZXR5IGNoZWNrLXVwIGZpcnN0JyA6IHVuZGVmaW5lZH1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgQ2FsbCB5b3VyIHRydXN0ZWQgY29udGFjdHtwcmltYXJ5ID8gYCAoJHtwcmltYXJ5LmZpcnN0TmFtZX0gJHtwcmltYXJ5Lmxhc3ROYW1lfSlgIDogJyd9XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuXHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInNoZWV0LWFjdGlvbi1idG4gYnRuLW1lc3NhZ2VcIiBvbkNsaWNrPXsoKSA9PiBjYWxsTnVtYmVyKCcwMTIyNSAzODM5OTknKX0+XHJcbiAgICAgICAgICAgIENhbGwgY2FtcHVzIHNlY3VyaXR5ICgwMTIyNSAzODM5OTkpXHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuXHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInNoZWV0LWFjdGlvbi1idG4gYnRuLW1lc3NhZ2VcIiBvbkNsaWNrPXsoKSA9PiBzZXRTaG93U2FmZXR5VG9vbGtpdChmYWxzZSl9PlxyXG4gICAgICAgICAgICBDbG9zZVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufSkoKX1cclxuICAgIDwvPlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBY2NvdW50UGFnZTtcbiJdLCJmaWxlIjoiQzovVXNlcnMveWxhbm4vdnNjb2RlL1VuaS9TYW11ZGh5YW5SaWRlcy9mcm9udGVuZC9zcmMvQWNjb3VudFBhZ2UudHN4In0=