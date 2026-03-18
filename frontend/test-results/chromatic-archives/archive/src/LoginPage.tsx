import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/LoginPage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=b8f2434d"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=b8f2434d"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useState = __vite__cjsImport1_react["useState"];
import { apiFetch } from "/src/lib/api.ts";
import { setAuthToken } from "/src/lib/authToken.ts";
const LoginPage = ({ onAuthSuccess, onStartDriverSignup }) => {
  _s();
  const [mode, setMode] = useState("login");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleNames, setMiddleNames] = useState("");
  const [lastName, setLastName] = useState("");
  const [signupAsDriver, setSignupAsDriver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    if (mode === "signup") {
      if (!firstName.trim() || !lastName.trim()) {
        setError("Please provide your first name and last name.");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
    }
    const endpoint = mode === "login" ? "auth/login" : "auth/register";
    const payload = mode === "login" ? { identifier: emailOrUsername, password } : {
      email: emailOrUsername,
      password,
      full_name: [firstName, middleNames, lastName].filter(Boolean).join(" ").replace(/\s+/g, " ").trim(),
      first_name: firstName,
      middle_names: middleNames,
      last_name: lastName,
      signup_as_driver: signupAsDriver
    };
    try {
      const data = await apiFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        auth: false
      });
      if (mode === "login") {
        if (data.access_token || data.token) {
          setAuthToken(data.access_token || data.token, data.refresh_token);
          if (onAuthSuccess) onAuthSuccess();
        } else {
          throw new Error("Invalid login credentials.");
        }
      } else {
        const draft = {
          firstName: firstName.trim(),
          middleNames: middleNames.trim(),
          lastName: lastName.trim(),
          emailOrUsername: emailOrUsername.trim()
        };
        const email = emailOrUsername.trim();
        const pw = password;
        setEmailOrUsername("");
        setPassword("");
        setConfirmPassword("");
        setFirstName("");
        setMiddleNames("");
        setLastName("");
        setSignupAsDriver(false);
        if (signupAsDriver) {
          try {
            const loginRes = await apiFetch("auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              // Change this line to use 'identifier' instead of 'email'
              body: JSON.stringify({ identifier: email, password: pw }),
              auth: false
            });
            const token = loginRes?.access_token || loginRes?.token;
            if (!token) throw new Error("Auto-login failed: missing token");
            setAuthToken(token, loginRes?.refresh_token);
            setSuccessMessage("Account created! Complete driver signup.");
            onStartDriverSignup?.(draft);
            return;
          } catch (err) {
            setError(err?.message ?? "Account created, but auto-login failed. Please log in, then complete driver signup.");
            setMode("login");
            return;
          }
        }
        setSuccessMessage(data.message || "Account created! Please check your email to verify and log in.");
        setMode("login");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "auth-wrapper", children: [
    /* @__PURE__ */ jsxDEV("h1", { className: "auth-title", children: "Welcome back" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
      lineNumber: 143,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("p", { className: "auth-subtitle", children: "Sign in to manage your rides or create a new account." }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
      lineNumber: 144,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "auth-card", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "auth-toggle", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: `auth-toggle-button ${mode === "login" ? "auth-toggle-button-active" : ""}`,
            onClick: () => setMode("login"),
            children: "Log in"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
            lineNumber: 148,
            columnNumber: 21
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            className: `auth-toggle-button ${mode === "signup" ? "auth-toggle-button-active" : ""}`,
            onClick: () => setMode("signup"),
            children: "Sign up"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
            lineNumber: 155,
            columnNumber: 21
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
        lineNumber: 147,
        columnNumber: 17
      }, this),
      error && /* @__PURE__ */ jsxDEV("p", { style: { color: "var(--color-error-text)", fontSize: "14px", marginBottom: "12px" }, children: error }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
        lineNumber: 165,
        columnNumber: 9
      }, this),
      successMessage && /* @__PURE__ */ jsxDEV("div", { style: {
        padding: "12px",
        backgroundColor: "rgba(34,197,94,0.15)",
        color: "#4ade80",
        borderRadius: "8px",
        marginBottom: "16px",
        fontSize: "14px"
      }, children: successMessage }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
        lineNumber: 171,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, children: [
        mode === "signup" && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "firstName", children: "First name" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
              lineNumber: 187,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "firstName",
                type: "text",
                className: "auth-input",
                placeholder: "Alex",
                value: firstName,
                onChange: (e) => setFirstName(e.target.value),
                required: true
              },
              void 0,
              false,
              {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
                lineNumber: 188,
                columnNumber: 33
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
            lineNumber: 186,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "middleNames", children: "Middle names (optional)" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
              lineNumber: 200,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "middleNames",
                type: "text",
                className: "auth-input",
                placeholder: "James",
                value: middleNames,
                onChange: (e) => setMiddleNames(e.target.value)
              },
              void 0,
              false,
              {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
                lineNumber: 201,
                columnNumber: 33
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
            lineNumber: 199,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "lastName", children: "Last name" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
              lineNumber: 212,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "lastName",
                type: "text",
                className: "auth-input",
                placeholder: "Doe",
                value: lastName,
                onChange: (e) => setLastName(e.target.value),
                required: true
              },
              void 0,
              false,
              {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
                lineNumber: 213,
                columnNumber: 33
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
            lineNumber: 211,
            columnNumber: 29
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
          lineNumber: 185,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "email", children: mode === "login" ? "Email or university username" : "Email" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
            lineNumber: 227,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "email",
              type: "text",
              className: "auth-input",
              placeholder: mode === "login" ? "you@bath.ac.uk or abc123" : "you@bath.ac.uk",
              value: emailOrUsername,
              onChange: (e) => setEmailOrUsername(e.target.value),
              required: true
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
              lineNumber: 228,
              columnNumber: 25
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
          lineNumber: 226,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "password", children: "Password" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
            lineNumber: 240,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "password",
              type: "password",
              className: "auth-input",
              placeholder: "Enter your password",
              value: password,
              onChange: (e) => setPassword(e.target.value),
              required: true
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
              lineNumber: 241,
              columnNumber: 25
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
          lineNumber: 239,
          columnNumber: 21
        }, this),
        mode === "signup" && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "confirmPassword", children: "Confirm password" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
              lineNumber: 255,
              columnNumber: 33
            }, this),
            /* @__PURE__ */ jsxDEV(
              "input",
              {
                id: "confirmPassword",
                type: "password",
                className: "auth-input",
                placeholder: "Re-enter your password",
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
                required: true
              },
              void 0,
              false,
              {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
                lineNumber: 256,
                columnNumber: 33
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
            lineNumber: 254,
            columnNumber: 29
          }, this),
          /* @__PURE__ */ jsxDEV(
            "label",
            {
              style: {
                display: "flex",
                gap: "10px",
                alignItems: "center",
                marginTop: "10px",
                fontSize: "14px",
                color: "#e5e7eb",
                userSelect: "none"
              },
              children: [
                /* @__PURE__ */ jsxDEV(
                  "input",
                  {
                    type: "checkbox",
                    checked: signupAsDriver,
                    onChange: (e) => setSignupAsDriver(e.target.checked),
                    style: { width: "16px", height: "16px" }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
                    lineNumber: 278,
                    columnNumber: 33
                  },
                  this
                ),
                "Do you want to sign up as a driver?"
              ]
            },
            void 0,
            true,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
              lineNumber: 267,
              columnNumber: 29
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
          lineNumber: 253,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("button", { type: "submit", className: "auth-submit", disabled: loading, children: loading ? "Processing..." : mode === "login" ? "Continue" : "Create account" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
          lineNumber: 289,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
        lineNumber: 183,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
      lineNumber: 146,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx",
    lineNumber: 142,
    columnNumber: 5
  }, this);
};
_s(LoginPage, "DBda819kkXrSmwSQzxSA9nd0KuI=");
_c = LoginPage;
export default LoginPage;
var _c;
$RefreshReg$(_c, "LoginPage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/LoginPage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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QUFFdUMsT0FBT08sT0FBTztBQUFBLG9CQUNuRCxPQUFPLEVBQUVDLE9BQU8sUUFBUUMsUUFBUSxPQUFPO0FBQUE7QUFBQSxrQkFKM0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGdCQUk2QztBQUFBO0FBQUE7QUFBQTtBQUFBLFlBZmpEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQWtCQTtBQUFBLGFBaENKO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFpQ0E7QUFBQSxRQUdKLHVCQUFDLFlBQU8sTUFBSyxVQUFTLFdBQVUsZUFBYyxVQUFVdkQsU0FDbkRBLG9CQUFVLGtCQUFrQmhCLFNBQVMsVUFBVSxhQUFhLG9CQURqRTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBRUE7QUFBQSxXQTVHSjtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBNkdBO0FBQUEsU0FsSko7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQW1KQTtBQUFBLE9BdkpKO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0F3SkE7QUFFUjtBQUFFRCxHQXpSSUgsV0FBbUM7QUFBQTRFLEtBQW5DNUU7QUEyUk4sZUFBZUE7QUFBVSxJQUFBNEU7QUFBQUMsYUFBQUQsSUFBQSIsIm5hbWVzIjpbIlJlYWN0IiwidXNlU3RhdGUiLCJhcGlGZXRjaCIsInNldEF1dGhUb2tlbiIsIkxvZ2luUGFnZSIsIm9uQXV0aFN1Y2Nlc3MiLCJvblN0YXJ0RHJpdmVyU2lnbnVwIiwiX3MiLCJtb2RlIiwic2V0TW9kZSIsImVtYWlsT3JVc2VybmFtZSIsInNldEVtYWlsT3JVc2VybmFtZSIsInBhc3N3b3JkIiwic2V0UGFzc3dvcmQiLCJjb25maXJtUGFzc3dvcmQiLCJzZXRDb25maXJtUGFzc3dvcmQiLCJmaXJzdE5hbWUiLCJzZXRGaXJzdE5hbWUiLCJtaWRkbGVOYW1lcyIsInNldE1pZGRsZU5hbWVzIiwibGFzdE5hbWUiLCJzZXRMYXN0TmFtZSIsInNpZ251cEFzRHJpdmVyIiwic2V0U2lnbnVwQXNEcml2ZXIiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImVycm9yIiwic2V0RXJyb3IiLCJzdWNjZXNzTWVzc2FnZSIsInNldFN1Y2Nlc3NNZXNzYWdlIiwiaGFuZGxlU3VibWl0IiwiZSIsInByZXZlbnREZWZhdWx0IiwidHJpbSIsImVuZHBvaW50IiwicGF5bG9hZCIsImlkZW50aWZpZXIiLCJlbWFpbCIsImZ1bGxfbmFtZSIsImZpbHRlciIsIkJvb2xlYW4iLCJqb2luIiwicmVwbGFjZSIsImZpcnN0X25hbWUiLCJtaWRkbGVfbmFtZXMiLCJsYXN0X25hbWUiLCJzaWdudXBfYXNfZHJpdmVyIiwiZGF0YSIsIm1ldGhvZCIsImhlYWRlcnMiLCJib2R5IiwiSlNPTiIsInN0cmluZ2lmeSIsImF1dGgiLCJhY2Nlc3NfdG9rZW4iLCJ0b2tlbiIsInJlZnJlc2hfdG9rZW4iLCJFcnJvciIsImRyYWZ0IiwicHciLCJsb2dpblJlcyIsImVyciIsIm1lc3NhZ2UiLCJjb25zb2xlIiwiY29sb3IiLCJmb250U2l6ZSIsIm1hcmdpbkJvdHRvbSIsInBhZGRpbmciLCJiYWNrZ3JvdW5kQ29sb3IiLCJib3JkZXJSYWRpdXMiLCJ0YXJnZXQiLCJ2YWx1ZSIsImRpc3BsYXkiLCJnYXAiLCJhbGlnbkl0ZW1zIiwibWFyZ2luVG9wIiwidXNlclNlbGVjdCIsImNoZWNrZWQiLCJ3aWR0aCIsImhlaWdodCIsIl9jIiwiJFJlZnJlc2hSZWckIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkxvZ2luUGFnZS50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBhcGlGZXRjaCB9IGZyb20gXCIuL2xpYi9hcGlcIjtcclxuaW1wb3J0IHsgc2V0QXV0aFRva2VuIH0gZnJvbSBcIi4vbGliL2F1dGhUb2tlblwiO1xyXG5cclxudHlwZSBMb2dpblBhZ2VQcm9wcyA9IHtcclxuICAgIG9uQXV0aFN1Y2Nlc3M/OiAoKSA9PiB2b2lkO1xyXG4gICAgb25TdGFydERyaXZlclNpZ251cD86IChkcmFmdDoge1xyXG4gICAgICAgIGZpcnN0TmFtZTogc3RyaW5nO1xyXG4gICAgICAgIG1pZGRsZU5hbWVzOiBzdHJpbmc7XHJcbiAgICAgICAgbGFzdE5hbWU6IHN0cmluZztcclxuICAgICAgICBlbWFpbE9yVXNlcm5hbWU6IHN0cmluZztcclxuICAgIH0pID0+IHZvaWQ7XHJcbn07XHJcblxyXG5jb25zdCBMb2dpblBhZ2U6IFJlYWN0LkZDPExvZ2luUGFnZVByb3BzPiA9ICh7IG9uQXV0aFN1Y2Nlc3MsIG9uU3RhcnREcml2ZXJTaWdudXAgfSkgPT4ge1xyXG4gICAgY29uc3QgW21vZGUsIHNldE1vZGVdID0gdXNlU3RhdGU8J2xvZ2luJyB8ICdzaWdudXAnPignbG9naW4nKTtcclxuXHJcbiAgICAvLyBGb3JtIHN0YXRlXHJcbiAgICBjb25zdCBbZW1haWxPclVzZXJuYW1lLCBzZXRFbWFpbE9yVXNlcm5hbWVdID0gdXNlU3RhdGUoJycpO1xyXG4gICAgY29uc3QgW3Bhc3N3b3JkLCBzZXRQYXNzd29yZF0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgICBjb25zdCBbY29uZmlybVBhc3N3b3JkLCBzZXRDb25maXJtUGFzc3dvcmRdID0gdXNlU3RhdGUoJycpO1xyXG5cclxuICAgIGNvbnN0IFtmaXJzdE5hbWUsIHNldEZpcnN0TmFtZV0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgICBjb25zdCBbbWlkZGxlTmFtZXMsIHNldE1pZGRsZU5hbWVzXSA9IHVzZVN0YXRlKCcnKTtcclxuICAgIGNvbnN0IFtsYXN0TmFtZSwgc2V0TGFzdE5hbWVdID0gdXNlU3RhdGUoJycpO1xyXG4gICAgY29uc3QgW3NpZ251cEFzRHJpdmVyLCBzZXRTaWdudXBBc0RyaXZlcl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gICAgLy8gVUkgc3RhdGVcclxuICAgIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICAgIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XHJcbiAgICBjb25zdCBbc3VjY2Vzc01lc3NhZ2UsIHNldFN1Y2Nlc3NNZXNzYWdlXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZVN1Ym1pdCA9IGFzeW5jIChlOiBSZWFjdC5Gb3JtRXZlbnQpID0+IHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgc2V0RXJyb3IobnVsbCk7XHJcbiAgICAgICAgc2V0U3VjY2Vzc01lc3NhZ2UobnVsbCk7XHJcbiAgICAgICAgc2V0TG9hZGluZyh0cnVlKTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGUgPT09ICdzaWdudXAnKSB7XHJcbiAgICAgICAgICAgIGlmICghZmlyc3ROYW1lLnRyaW0oKSB8fCAhbGFzdE5hbWUudHJpbSgpKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRFcnJvcignUGxlYXNlIHByb3ZpZGUgeW91ciBmaXJzdCBuYW1lIGFuZCBsYXN0IG5hbWUuJyk7XHJcbiAgICAgICAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocGFzc3dvcmQgIT09IGNvbmZpcm1QYXNzd29yZCkge1xyXG4gICAgICAgICAgICAgICAgc2V0RXJyb3IoJ1Bhc3N3b3JkcyBkbyBub3QgbWF0Y2guJyk7XHJcbiAgICAgICAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZW5kcG9pbnQgPSBtb2RlID09PSAnbG9naW4nID8gJ2F1dGgvbG9naW4nIDogJ2F1dGgvcmVnaXN0ZXInO1xyXG5cclxuICAgICAgICBjb25zdCBwYXlsb2FkID1cclxuICAgICAgICAgICAgbW9kZSA9PT0gJ2xvZ2luJ1xyXG4gICAgICAgICAgICAgICAgPyB7IGlkZW50aWZpZXI6IGVtYWlsT3JVc2VybmFtZSwgcGFzc3dvcmQgfVxyXG4gICAgICAgICAgICAgICAgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsT3JVc2VybmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBwYXNzd29yZCxcclxuICAgICAgICAgICAgICAgICAgICBmdWxsX25hbWU6IFtmaXJzdE5hbWUsIG1pZGRsZU5hbWVzLCBsYXN0TmFtZV0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oJyAnKS5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0X25hbWU6IGZpcnN0TmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBtaWRkbGVfbmFtZXM6IG1pZGRsZU5hbWVzLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RfbmFtZTogbGFzdE5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc2lnbnVwX2FzX2RyaXZlcjogc2lnbnVwQXNEcml2ZXIsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgYXBpRmV0Y2g8YW55PihlbmRwb2ludCwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpLFxyXG4gICAgICAgICAgICAgICAgYXV0aDogZmFsc2UsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmIChtb2RlID09PSAnbG9naW4nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5hY2Nlc3NfdG9rZW4gfHwgZGF0YS50b2tlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldEF1dGhUb2tlbihkYXRhLmFjY2Vzc190b2tlbiB8fCBkYXRhLnRva2VuLCBkYXRhLnJlZnJlc2hfdG9rZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvbkF1dGhTdWNjZXNzKSBvbkF1dGhTdWNjZXNzKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBsb2dpbiBjcmVkZW50aWFscy4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIENhcHR1cmUgdmFsdWVzIGJlZm9yZSB3ZSBjbGVhciBzdGF0ZVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZHJhZnQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3ROYW1lOiBmaXJzdE5hbWUudHJpbSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIG1pZGRsZU5hbWVzOiBtaWRkbGVOYW1lcy50cmltKCksXHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdE5hbWU6IGxhc3ROYW1lLnRyaW0oKSxcclxuICAgICAgICAgICAgICAgICAgICBlbWFpbE9yVXNlcm5hbWU6IGVtYWlsT3JVc2VybmFtZS50cmltKCksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZW1haWwgPSBlbWFpbE9yVXNlcm5hbWUudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHcgPSBwYXNzd29yZDsgLy8ga2VlcCB0aGUgcGFzc3dvcmQgZm9yIGF1dG8tbG9naW5cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDbGVhciBmb3JtIFVJIHN0YXRlXHJcbiAgICAgICAgICAgICAgICBzZXRFbWFpbE9yVXNlcm5hbWUoJycpO1xyXG4gICAgICAgICAgICAgICAgc2V0UGFzc3dvcmQoJycpO1xyXG4gICAgICAgICAgICAgICAgc2V0Q29uZmlybVBhc3N3b3JkKCcnKTtcclxuICAgICAgICAgICAgICAgIHNldEZpcnN0TmFtZSgnJyk7XHJcbiAgICAgICAgICAgICAgICBzZXRNaWRkbGVOYW1lcygnJyk7XHJcbiAgICAgICAgICAgICAgICBzZXRMYXN0TmFtZSgnJyk7XHJcbiAgICAgICAgICAgICAgICBzZXRTaWdudXBBc0RyaXZlcihmYWxzZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNpZ251cEFzRHJpdmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSU1QT1JUQU5UOiByZWdpc3RlciBkb2Vzbid0IHJldHVybiBhIHRva2VuLCBidXQgL2RyaXZlcnMvdXBncmFkZSByZXF1aXJlcyBhdXRoLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFNvIHdlIGltbWVkaWF0ZWx5IGxvZyBpbiBhbmQgc3RvcmUgYXV0aFRva2VuIGJlZm9yZSBsYXVuY2hpbmcgRHJpdmVyU2lnbnVwUGFnZS5cclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsb2dpblJlcyA9IGF3YWl0IGFwaUZldGNoPGFueT4oJ2F1dGgvbG9naW4nLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2hhbmdlIHRoaXMgbGluZSB0byB1c2UgJ2lkZW50aWZpZXInIGluc3RlYWQgb2YgJ2VtYWlsJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpZGVudGlmaWVyOiBlbWFpbCwgcGFzc3dvcmQ6IHB3IH0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0aDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBsb2dpblJlcz8uYWNjZXNzX3Rva2VuIHx8IGxvZ2luUmVzPy50b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0b2tlbikgdGhyb3cgbmV3IEVycm9yKCdBdXRvLWxvZ2luIGZhaWxlZDogbWlzc2luZyB0b2tlbicpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0QXV0aFRva2VuKHRva2VuLCBsb2dpblJlcz8ucmVmcmVzaF90b2tlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFN1Y2Nlc3NNZXNzYWdlKCdBY2NvdW50IGNyZWF0ZWQhIENvbXBsZXRlIGRyaXZlciBzaWdudXAuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU3RhcnREcml2ZXJTaWdudXA/LihkcmFmdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRFcnJvcihlcnI/Lm1lc3NhZ2UgPz8gJ0FjY291bnQgY3JlYXRlZCwgYnV0IGF1dG8tbG9naW4gZmFpbGVkLiBQbGVhc2UgbG9nIGluLCB0aGVuIGNvbXBsZXRlIGRyaXZlciBzaWdudXAuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldE1vZGUoJ2xvZ2luJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2V0U3VjY2Vzc01lc3NhZ2UoZGF0YS5tZXNzYWdlIHx8ICdBY2NvdW50IGNyZWF0ZWQhIFBsZWFzZSBjaGVjayB5b3VyIGVtYWlsIHRvIHZlcmlmeSBhbmQgbG9nIGluLicpO1xyXG4gICAgICAgICAgICAgICAgc2V0TW9kZSgnbG9naW4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0F1dGggZXJyb3I6JywgZXJyKTtcclxuICAgICAgICAgICAgc2V0RXJyb3IoZXJyLm1lc3NhZ2UgfHwgJ0FuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWQuJyk7XHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXV0aC13cmFwcGVyXCI+XHJcbiAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJhdXRoLXRpdGxlXCI+V2VsY29tZSBiYWNrPC9oMT5cclxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYXV0aC1zdWJ0aXRsZVwiPlNpZ24gaW4gdG8gbWFuYWdlIHlvdXIgcmlkZXMgb3IgY3JlYXRlIGEgbmV3IGFjY291bnQuPC9wPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhdXRoLWNhcmRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXV0aC10b2dnbGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BhdXRoLXRvZ2dsZS1idXR0b24gJHttb2RlID09PSAnbG9naW4nID8gJ2F1dGgtdG9nZ2xlLWJ1dHRvbi1hY3RpdmUnIDogJyd9YH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0TW9kZSgnbG9naW4nKX1cclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZyBpblxyXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGF1dGgtdG9nZ2xlLWJ1dHRvbiAke21vZGUgPT09ICdzaWdudXAnID8gJ2F1dGgtdG9nZ2xlLWJ1dHRvbi1hY3RpdmUnIDogJyd9YH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0TW9kZSgnc2lnbnVwJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBTaWduIHVwXHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICB7ZXJyb3IgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGNvbG9yOiAndmFyKC0tY29sb3ItZXJyb3ItdGV4dCknLCBmb250U2l6ZTogJzE0cHgnLCBtYXJnaW5Cb3R0b206ICcxMnB4JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2Vycm9yfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgICAge3N1Y2Nlc3NNZXNzYWdlICYmIChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxMnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgzNCwxOTcsOTQsMC4xNSknLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM0YWRlODAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcxNnB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxNHB4J1xyXG4gICAgICAgICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7c3VjY2Vzc01lc3NhZ2V9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9PlxyXG4gICAgICAgICAgICAgICAgICAgIHttb2RlID09PSAnc2lnbnVwJyAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF1dGgtZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYXV0aC1sYWJlbFwiIGh0bWxGb3I9XCJmaXJzdE5hbWVcIj5GaXJzdCBuYW1lPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJmaXJzdE5hbWVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImF1dGgtaW5wdXRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFsZXhcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17Zmlyc3ROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEZpcnN0TmFtZShlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXV0aC1maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJhdXRoLWxhYmVsXCIgaHRtbEZvcj1cIm1pZGRsZU5hbWVzXCI+TWlkZGxlIG5hbWVzIChvcHRpb25hbCk8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZD1cIm1pZGRsZU5hbWVzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhdXRoLWlucHV0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJKYW1lc1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXttaWRkbGVOYW1lc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRNaWRkbGVOYW1lcyhlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXV0aC1maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJhdXRoLWxhYmVsXCIgaHRtbEZvcj1cImxhc3ROYW1lXCI+TGFzdCBuYW1lPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJsYXN0TmFtZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXV0aC1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRG9lXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2xhc3ROYW1lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldExhc3ROYW1lKGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvPlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXV0aC1maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYXV0aC1sYWJlbFwiIGh0bWxGb3I9XCJlbWFpbFwiPnttb2RlID09PSAnbG9naW4nID8gJ0VtYWlsIG9yIHVuaXZlcnNpdHkgdXNlcm5hbWUnIDogJ0VtYWlsJ308L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiZW1haWxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXV0aC1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17bW9kZSA9PT0gJ2xvZ2luJyA/ICd5b3VAYmF0aC5hYy51ayBvciBhYmMxMjMnIDogJ3lvdUBiYXRoLmFjLnVrJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtlbWFpbE9yVXNlcm5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEVtYWlsT3JVc2VybmFtZShlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF1dGgtZmllbGRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImF1dGgtbGFiZWxcIiBodG1sRm9yPVwicGFzc3dvcmRcIj5QYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ9XCJwYXNzd29yZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwicGFzc3dvcmRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXV0aC1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkVudGVyIHlvdXIgcGFzc3dvcmRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3Bhc3N3b3JkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRQYXNzd29yZChlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICB7bW9kZSA9PT0gJ3NpZ251cCcgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhdXRoLWZpZWxkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImF1dGgtbGFiZWxcIiBodG1sRm9yPVwiY29uZmlybVBhc3N3b3JkXCI+Q29uZmlybSBwYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkPVwiY29uZmlybVBhc3N3b3JkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInBhc3N3b3JkXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXV0aC1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiUmUtZW50ZXIgeW91ciBwYXNzd29yZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtjb25maXJtUGFzc3dvcmR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Q29uZmlybVBhc3N3b3JkKGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnYXA6ICcxMHB4JyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpblRvcDogJzEwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzE0cHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNlNWU3ZWInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyU2VsZWN0OiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hlY2tlZD17c2lnbnVwQXNEcml2ZXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0U2lnbnVwQXNEcml2ZXIoZS50YXJnZXQuY2hlY2tlZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiAnMTZweCcsIGhlaWdodDogJzE2cHgnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEbyB5b3Ugd2FudCB0byBzaWduIHVwIGFzIGEgZHJpdmVyP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC8+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYXV0aC1zdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZ30+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtsb2FkaW5nID8gJ1Byb2Nlc3NpbmcuLi4nIDogbW9kZSA9PT0gJ2xvZ2luJyA/ICdDb250aW51ZScgOiAnQ3JlYXRlIGFjY291bnQnfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2dpblBhZ2U7XHJcbiJdLCJmaWxlIjoiQzovVXNlcnMveWxhbm4vdnNjb2RlL1VuaS9TYW11ZGh5YW5SaWRlcy9mcm9udGVuZC9zcmMvTG9naW5QYWdlLnRzeCJ9