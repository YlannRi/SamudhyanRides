import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/SettingsPage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c85c9c72"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=c85c9c72"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useEffect = __vite__cjsImport1_react["useEffect"]; const useMemo = __vite__cjsImport1_react["useMemo"]; const useState = __vite__cjsImport1_react["useState"];
import { apiFetch } from "/src/lib/api.ts";
const BackIcon = /* @__PURE__ */ jsxDEV("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxDEV("path", { d: "M19 12H5M12 5l-7 7 7 7" }, void 0, false, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
  lineNumber: 12,
  columnNumber: 5
}, this) }, void 0, false, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
  lineNumber: 11,
  columnNumber: 1
}, this);
const DetailRow = ({ label, value }) => /* @__PURE__ */ jsxDEV("div", { className: "sheet-detail-row", children: [
  /* @__PURE__ */ jsxDEV("span", { className: "detail-label", children: label }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
    lineNumber: 18,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV("span", { className: "detail-value", children: value }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
    lineNumber: 19,
    columnNumber: 5
  }, this)
] }, void 0, true, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
  lineNumber: 17,
  columnNumber: 1
}, this);
_c = DetailRow;
const PROFILE_FIELDS = [
  "first_name",
  "last_name",
  "email",
  "university_username",
  "rider_rating",
  "phone_number",
  "gender"
];
const DRIVER_FIELDS = [
  "verified",
  "vehicle_registration",
  "licence_number"
];
function prettyLabel(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}
function toDisplayValue(v) {
  if (v === null || v === void 0) return "Not provided";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
const SettingsPage = ({ onBack }) => {
  _s();
  const [profile, setProfile] = useState(null);
  const [driverProfile, setDriverProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const me = await apiFetch("users/me", { method: "GET" });
        const p = Array.isArray(me) ? me[0] : me;
        setProfile(p ?? null);
        try {
          const d = await apiFetch("drivers/me", { method: "GET" });
          setDriverProfile(d ?? null);
        } catch (e) {
          setDriverProfile(null);
        }
      } catch (e) {
        setError(e?.message ?? "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const profileRows = useMemo(() => {
    if (!profile) return [];
    return PROFILE_FIELDS.map((k) => ({ k, v: profile[k] }));
  }, [profile]);
  const driverRows = useMemo(() => {
    if (!driverProfile) return [];
    return DRIVER_FIELDS.map((k) => ({ k, v: driverProfile[k] }));
  }, [driverProfile]);
  return /* @__PURE__ */ jsxDEV("div", { style: { paddingTop: 8 }, children: [
    /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 16px 14px" }, children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: "sheet-action-btn btn-message",
          style: { width: 44, height: 44, padding: 0 },
          onClick: onBack,
          "aria-label": "Back",
          title: "Back",
          children: BackIcon
        },
        void 0,
        false,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
          lineNumber: 97,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { style: { fontSize: 18, fontWeight: 800, color: "var(--text-header)" }, children: "Settings" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
        lineNumber: 107,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
      lineNumber: 96,
      columnNumber: 7
    }, this),
    loading && /* @__PURE__ */ jsxDEV("div", { className: "card", style: { margin: "0 16px 16px", padding: 16 }, children: "Loading…" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
      lineNumber: 111,
      columnNumber: 7
    }, this),
    !loading && error && /* @__PURE__ */ jsxDEV("div", { className: "card", style: { margin: "0 16px 16px", padding: 16, color: "var(--text-label)", fontWeight: "bold" }, children: error }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
      lineNumber: 117,
      columnNumber: 7
    }, this),
    !loading && !error && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV("div", { style: { margin: "0 16px 10px", fontWeight: 800, fontSize: 14, color: "var(--text-header)" }, children: "Your information" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
        lineNumber: 124,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "sheet-details-card", children: profileRows.length === 0 ? /* @__PURE__ */ jsxDEV("div", { style: { padding: 16, color: "var(--text-label)" }, children: "No profile information found." }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
        lineNumber: 129,
        columnNumber: 11
      }, this) : profileRows.map(({ k, v }) => /* @__PURE__ */ jsxDEV(DetailRow, { label: prettyLabel(k), value: toDisplayValue(v) }, k, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
        lineNumber: 131,
        columnNumber: 41
      }, this)) }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
        lineNumber: 127,
        columnNumber: 11
      }, this),
      driverRows.length > 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
        /* @__PURE__ */ jsxDEV("div", { style: { margin: "0 16px 10px", fontWeight: 800, fontSize: 14, color: "var(--text-header)" }, children: "Driver information" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
          lineNumber: 137,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "sheet-details-card", children: driverRows.map(({ k, v }) => /* @__PURE__ */ jsxDEV(DetailRow, { label: prettyLabel(k), value: toDisplayValue(v) }, k, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
          lineNumber: 141,
          columnNumber: 47
        }, this)) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
          lineNumber: 140,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
        lineNumber: 136,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
      lineNumber: 123,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx",
    lineNumber: 95,
    columnNumber: 5
  }, this);
};
_s(SettingsPage, "23lmOWhgR72DKLOXkRsM83Mwix4=");
_c2 = SettingsPage;
export default SettingsPage;
var _c, _c2;
$RefreshReg$(_c, "DetailRow");
$RefreshReg$(_c2, "SettingsPage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/SettingsPage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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QU5GO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFPQTtBQUFBLFNBcEJKO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FzQkE7QUFBQSxPQWxESjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBb0RBO0FBRUo7QUFBRXBCLEdBakdJRixjQUF5QztBQUFBb0MsTUFBekNwQztBQW1HTixlQUFlQTtBQUFhLElBQUFkLElBQUFrRDtBQUFBQyxhQUFBbkQsSUFBQTtBQUFBbUQsYUFBQUQsS0FBQSIsIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwidXNlTWVtbyIsInVzZVN0YXRlIiwiYXBpRmV0Y2giLCJCYWNrSWNvbiIsIkRldGFpbFJvdyIsImxhYmVsIiwidmFsdWUiLCJfYyIsIlBST0ZJTEVfRklFTERTIiwiRFJJVkVSX0ZJRUxEUyIsInByZXR0eUxhYmVsIiwia2V5IiwicmVwbGFjZSIsIm0iLCJ0b1VwcGVyQ2FzZSIsInRvRGlzcGxheVZhbHVlIiwidiIsInVuZGVmaW5lZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJTdHJpbmciLCJTZXR0aW5nc1BhZ2UiLCJvbkJhY2siLCJfcyIsInByb2ZpbGUiLCJzZXRQcm9maWxlIiwiZHJpdmVyUHJvZmlsZSIsInNldERyaXZlclByb2ZpbGUiLCJlcnJvciIsInNldEVycm9yIiwibG9hZGluZyIsInNldExvYWRpbmciLCJsb2FkIiwibWUiLCJtZXRob2QiLCJwIiwiQXJyYXkiLCJpc0FycmF5IiwiZCIsImUiLCJtZXNzYWdlIiwicHJvZmlsZVJvd3MiLCJtYXAiLCJrIiwiZHJpdmVyUm93cyIsInBhZGRpbmdUb3AiLCJkaXNwbGF5IiwiYWxpZ25JdGVtcyIsImdhcCIsInBhZGRpbmciLCJ3aWR0aCIsImhlaWdodCIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsImNvbG9yIiwibWFyZ2luIiwibGVuZ3RoIiwiX2MyIiwiJFJlZnJlc2hSZWckIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIlNldHRpbmdzUGFnZS50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IGFwaUZldGNoIH0gZnJvbSAnLi9saWIvYXBpJztcclxuXHJcbnR5cGUgU2V0dGluZ3NQYWdlUHJvcHMgPSB7XHJcbiAgb25CYWNrOiAoKSA9PiB2b2lkO1xyXG59O1xyXG5cclxudHlwZSBBbnlSZWNvcmQgPSBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xyXG5cclxuY29uc3QgQmFja0ljb24gPSAoXHJcbiAgPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjIuNVwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cclxuICAgIDxwYXRoIGQ9XCJNMTkgMTJINU0xMiA1bC03IDcgNyA3XCIgLz5cclxuICA8L3N2Zz5cclxuKTtcclxuXHJcbmNvbnN0IERldGFpbFJvdzogUmVhY3QuRkM8eyBsYWJlbDogc3RyaW5nOyB2YWx1ZTogUmVhY3QuUmVhY3ROb2RlIH0+ID0gKHsgbGFiZWwsIHZhbHVlIH0pID0+IChcclxuICA8ZGl2IGNsYXNzTmFtZT1cInNoZWV0LWRldGFpbC1yb3dcIj5cclxuICAgIDxzcGFuIGNsYXNzTmFtZT1cImRldGFpbC1sYWJlbFwiPntsYWJlbH08L3NwYW4+XHJcbiAgICA8c3BhbiBjbGFzc05hbWU9XCJkZXRhaWwtdmFsdWVcIj57dmFsdWV9PC9zcGFuPlxyXG4gIDwvZGl2PlxyXG4pO1xyXG5cclxuY29uc3QgUFJPRklMRV9GSUVMRFMgPSBbXHJcbiAgICAnZmlyc3RfbmFtZScsXHJcbiAgICAnbGFzdF9uYW1lJyxcclxuICAgICdlbWFpbCcsXHJcbiAgICAndW5pdmVyc2l0eV91c2VybmFtZScsXHJcbiAgICAncmlkZXJfcmF0aW5nJyxcclxuICAgICdwaG9uZV9udW1iZXInLFxyXG4gICAgJ2dlbmRlcicsXHJcbl1cclxuXHJcbmNvbnN0IERSSVZFUl9GSUVMRFMgPSBbXHJcbiAgICAndmVyaWZpZWQnLFxyXG4gICAgJ3ZlaGljbGVfcmVnaXN0cmF0aW9uJyxcclxuICAgICdsaWNlbmNlX251bWJlcicsXHJcbl1cclxuXHJcbmZ1bmN0aW9uIHByZXR0eUxhYmVsKGtleTogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIGtleVxyXG4gICAgLnJlcGxhY2UoL18vZywgJyAnKVxyXG4gICAgLnJlcGxhY2UoL1xcYlxcdy9nLCAobSkgPT4gbS50b1VwcGVyQ2FzZSgpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdG9EaXNwbGF5VmFsdWUodjogYW55KTogUmVhY3QuUmVhY3ROb2RlIHtcclxuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiAnTm90IHByb3ZpZGVkJztcclxuICBpZiAodHlwZW9mIHYgPT09ICdib29sZWFuJykgcmV0dXJuIHYgPyAnWWVzJyA6ICdObyc7XHJcbiAgaWYgKHR5cGVvZiB2ID09PSAnb2JqZWN0JykgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xyXG4gIHJldHVybiBTdHJpbmcodik7XHJcbn1cclxuXHJcbmNvbnN0IFNldHRpbmdzUGFnZTogUmVhY3QuRkM8U2V0dGluZ3NQYWdlUHJvcHM+ID0gKHsgb25CYWNrIH0pID0+IHtcclxuICBjb25zdCBbcHJvZmlsZSwgc2V0UHJvZmlsZV0gPSB1c2VTdGF0ZTxBbnlSZWNvcmQgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbZHJpdmVyUHJvZmlsZSwgc2V0RHJpdmVyUHJvZmlsZV0gPSB1c2VTdGF0ZTxBbnlSZWNvcmQgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgbG9hZCA9IGFzeW5jICgpID0+IHtcclxuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcclxuICAgICAgc2V0RXJyb3IobnVsbCk7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IG1lID0gYXdhaXQgYXBpRmV0Y2g8YW55PigndXNlcnMvbWUnLCB7IG1ldGhvZDogJ0dFVCcgfSk7XHJcbiAgICAgICAgY29uc3QgcCA9IEFycmF5LmlzQXJyYXkobWUpID8gbWVbMF0gOiBtZTtcclxuICAgICAgICBzZXRQcm9maWxlKHAgPz8gbnVsbCk7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBjb25zdCBkID0gYXdhaXQgYXBpRmV0Y2g8YW55PignZHJpdmVycy9tZScsIHsgbWV0aG9kOiAnR0VUJyB9KTtcclxuICAgICAgICAgIHNldERyaXZlclByb2ZpbGUoZCA/PyBudWxsKTtcclxuICAgICAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgICAgIHNldERyaXZlclByb2ZpbGUobnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlOiBhbnkpIHtcclxuICAgICAgICBzZXRFcnJvcihlPy5tZXNzYWdlID8/ICdGYWlsZWQgdG8gbG9hZCBzZXR0aW5ncycpO1xyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxvYWQoKTtcclxuICB9LCBbXSk7XHJcblxyXG4gIGNvbnN0IHByb2ZpbGVSb3dzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBpZiAoIXByb2ZpbGUpIHJldHVybiBbXSBhcyBBcnJheTx7IGs6IHN0cmluZzsgdjogYW55IH0+O1xyXG4gICAgcmV0dXJuIFBST0ZJTEVfRklFTERTLm1hcCgoaykgPT4gKHsgaywgdjogcHJvZmlsZVtrXSB9KSlcclxuICB9LCBbcHJvZmlsZV0pO1xyXG5cclxuICBjb25zdCBkcml2ZXJSb3dzID0gdXNlTWVtbygoKSA9PiB7XHJcbiAgICBpZiAoIWRyaXZlclByb2ZpbGUpIHJldHVybiBbXSBhcyBBcnJheTx7IGs6IHN0cmluZzsgdjogYW55IH0+O1xyXG4gICAgcmV0dXJuIERSSVZFUl9GSUVMRFMubWFwKChrKSA9PiAoeyBrLCB2OiBkcml2ZXJQcm9maWxlW2tdIH0pKVxyXG4gIH0sIFtkcml2ZXJQcm9maWxlXSk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmdUb3A6IDggfX0+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAxMCwgcGFkZGluZzogJzhweCAxNnB4IDE0cHgnIH19PlxyXG4gICAgICAgIDxidXR0b25cclxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgY2xhc3NOYW1lPVwic2hlZXQtYWN0aW9uLWJ0biBidG4tbWVzc2FnZVwiXHJcbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogNDQsIGhlaWdodDogNDQsIHBhZGRpbmc6IDAgfX1cclxuICAgICAgICAgIG9uQ2xpY2s9e29uQmFja31cclxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJCYWNrXCJcclxuICAgICAgICAgIHRpdGxlPVwiQmFja1wiXHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge0JhY2tJY29ufVxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6IDE4LCBmb250V2VpZ2h0OiA4MDAsIGNvbG9yOiAndmFyKC0tdGV4dC1oZWFkZXIpJyB9fT5TZXR0aW5nczwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHtsb2FkaW5nICYmIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17eyBtYXJnaW46ICcwIDE2cHggMTZweCcsIHBhZGRpbmc6IDE2IH19PlxyXG4gICAgICAgICAgTG9hZGluZ+KAplxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApfVxyXG5cclxuICAgICAgeyFsb2FkaW5nICYmIGVycm9yICYmIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17eyBtYXJnaW46ICcwIDE2cHggMTZweCcsIHBhZGRpbmc6IDE2LCBjb2xvcjogJ3ZhcigtLXRleHQtbGFiZWwpJywgZm9udFdlaWdodDogJ2JvbGQnIH19PlxyXG4gICAgICAgICAge2Vycm9yfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApfVxyXG5cclxuICAgICAgeyFsb2FkaW5nICYmICFlcnJvciAmJiAoXHJcbiAgICAgICAgPD5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luOiAnMCAxNnB4IDEwcHgnLCBmb250V2VpZ2h0OiA4MDAsIGZvbnRTaXplOiAxNCwgY29sb3I6ICd2YXIoLS10ZXh0LWhlYWRlciknIH19PlxyXG4gICAgICAgICAgICBZb3VyIGluZm9ybWF0aW9uXHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2hlZXQtZGV0YWlscy1jYXJkXCI+XHJcbiAgICAgICAgICAgIHtwcm9maWxlUm93cy5sZW5ndGggPT09IDAgPyAoXHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAxNiwgY29sb3I6ICd2YXIoLS10ZXh0LWxhYmVsKScgfX0+Tm8gcHJvZmlsZSBpbmZvcm1hdGlvbiBmb3VuZC48L2Rpdj5cclxuICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICBwcm9maWxlUm93cy5tYXAoKHsgaywgdiB9KSA9PiA8RGV0YWlsUm93IGtleT17a30gbGFiZWw9e3ByZXR0eUxhYmVsKGspfSB2YWx1ZT17dG9EaXNwbGF5VmFsdWUodil9IC8+KVxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAge2RyaXZlclJvd3MubGVuZ3RoID4gMCAmJiAoXHJcbiAgICAgICAgICAgIDw+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW46ICcwIDE2cHggMTBweCcsIGZvbnRXZWlnaHQ6IDgwMCwgZm9udFNpemU6IDE0LCBjb2xvcjogJ3ZhcigtLXRleHQtaGVhZGVyKScgfX0+XHJcbiAgICAgICAgICAgICAgICBEcml2ZXIgaW5mb3JtYXRpb25cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNoZWV0LWRldGFpbHMtY2FyZFwiPlxyXG4gICAgICAgICAgICAgICAge2RyaXZlclJvd3MubWFwKCh7IGssIHYgfSkgPT4gPERldGFpbFJvdyBrZXk9e2t9IGxhYmVsPXtwcmV0dHlMYWJlbChrKX0gdmFsdWU9e3RvRGlzcGxheVZhbHVlKHYpfSAvPil9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvPlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8Lz5cclxuICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTZXR0aW5nc1BhZ2U7Il0sImZpbGUiOiJDOi9Vc2Vycy95bGFubi92c2NvZGUvVW5pL1NhbXVkaHlhblJpZGVzL2Zyb250ZW5kL3NyYy9TZXR0aW5nc1BhZ2UudHN4In0=