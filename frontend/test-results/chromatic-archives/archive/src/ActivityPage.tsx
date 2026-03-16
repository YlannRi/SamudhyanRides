import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/ActivityPage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=b8f2434d"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$(), _s2 = $RefreshSig$(), _s3 = $RefreshSig$(), _s4 = $RefreshSig$(), _s5 = $RefreshSig$(), _s6 = $RefreshSig$(), _s7 = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=b8f2434d"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useRef = __vite__cjsImport1_react["useRef"]; const useState = __vite__cjsImport1_react["useState"];
import "/src/ActivityPage.css";
import { Btn, DetailRow, Icons, MapPlaceholder } from "/src/App.tsx";
import { RideRenderMap } from "/src/components/Map/RideRenderMap.tsx";
import { apiFetch } from "/src/lib/api.ts";
const RATING_LABELS = { 1: "Poor", 2: "Fair", 3: "Good", 4: "Great", 5: "Excellent" };
const RatingUI = ({ target, onSubmit, onClose }) => {
  _s();
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const display = hovered || selected;
  return /* @__PURE__ */ jsxDEV("div", { className: "rating-modal-content", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "rating-avatar", children: target.name[0] }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 47,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "rating-title", children: "How was your trip?" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 48,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "rating-subtitle", children: [
      "Rate your ",
      target.role === "driver" ? "driver" : "passenger",
      ",",
      " ",
      /* @__PURE__ */ jsxDEV("span", { className: "rating-name", children: target.name }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 51,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 49,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "rating-stars", children: [1, 2, 3, 4, 5].map(
      (n) => /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: `rating-star${n <= display ? " rating-star-filled" : ""}`,
          onMouseEnter: () => setHovered(n),
          onMouseLeave: () => setHovered(0),
          onClick: () => setSelected(n),
          "aria-label": `${n} star`,
          children: /* @__PURE__ */ jsxDEV(
            "svg",
            {
              width: "40",
              height: "40",
              viewBox: "0 0 24 24",
              strokeWidth: "1.5",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: n <= display ? "#fbbf24" : "none",
              stroke: n <= display ? "#fbbf24" : "var(--text-placeholder)",
              children: /* @__PURE__ */ jsxDEV("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
                lineNumber: 64,
                columnNumber: 15
              }, this)
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 62,
              columnNumber: 13
            },
            this
          )
        },
        n,
        false,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 55,
          columnNumber: 9
        },
        this
      )
    ) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 53,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: `rating-label${display ? " rating-label-visible" : ""}`, children: display ? RATING_LABELS[display] : "‎" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 69,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "rating-modal-actions", children: [
      /* @__PURE__ */ jsxDEV("button", { type: "button", className: "rating-btn-cancel", onClick: onClose, children: "Cancel" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 73,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: `rating-btn-submit${selected ? " rating-btn-submit-active" : ""}`,
          onClick: () => selected && onSubmit(selected),
          disabled: !selected,
          children: "Submit Rating"
        },
        void 0,
        false,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 74,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 72,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
    lineNumber: 46,
    columnNumber: 5
  }, this);
};
_s(RatingUI, "Mbq5FsUxJqk2fR2GSXEwtz9JDB4=");
_c = RatingUI;
const ReportUI = ({ onSubmit, onClose }) => {
  _s2();
  const [text, setText] = useState("");
  return /* @__PURE__ */ jsxDEV("div", { className: "rating-modal-content", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "report-icon-wrap", children: /* @__PURE__ */ jsxDEV("svg", { width: "36", height: "36", viewBox: "0 0 24 24", fill: "none", stroke: "#d32f2f", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsxDEV("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 96,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("line", { x1: "12", y1: "9", x2: "12", y2: "13" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 97,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 97,
        columnNumber: 50
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 95,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 94,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "rating-title", children: "Report an Issue" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 100,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "rating-subtitle", children: "Describe what happened and we'll look into it" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 101,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      "textarea",
      {
        className: "report-textarea",
        placeholder: "Tell us what went wrong…",
        value: text,
        onChange: (e) => setText(e.target.value),
        rows: 4
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 102,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "rating-modal-actions", children: [
      /* @__PURE__ */ jsxDEV("button", { type: "button", className: "rating-btn-cancel", onClick: onClose, children: "Cancel" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 110,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          className: `rating-btn-submit report-btn${text.trim() ? " rating-btn-submit-active report-btn-active" : ""}`,
          onClick: () => text.trim() && onSubmit(text),
          disabled: !text.trim(),
          children: "Send Report"
        },
        void 0,
        false,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 111,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 109,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
    lineNumber: 93,
    columnNumber: 5
  }, this);
};
_s2(ReportUI, "M8VhbSOru85VOsk7T2j5DvKRp+M=");
_c2 = ReportUI;
const ConfirmUI = ({ icon, iconColor, title, body, confirmLabel, confirmCls, onConfirm, onClose }) => /* @__PURE__ */ jsxDEV("div", { className: "rating-modal-content", children: [
  /* @__PURE__ */ jsxDEV("div", { className: "confirm-icon", style: { color: iconColor }, children: icon }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
    lineNumber: 129,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV("div", { className: "rating-title", children: title }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
    lineNumber: 130,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV("div", { className: "rating-subtitle", children: body }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
    lineNumber: 131,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV("div", { className: "rating-modal-actions", style: { marginTop: 8 }, children: [
    /* @__PURE__ */ jsxDEV("button", { type: "button", className: "rating-btn-cancel", onClick: onClose, children: "Go Back" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 133,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("button", { type: "button", className: `rating-btn-submit rating-btn-submit-active ${confirmCls}`, onClick: onConfirm, children: confirmLabel }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 134,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
    lineNumber: 132,
    columnNumber: 5
  }, this)
] }, void 0, true, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
  lineNumber: 128,
  columnNumber: 1
}, this);
_c3 = ConfirmUI;
const Modal = ({ state, onClose, onDone, onConfirmAction }) => {
  _s3();
  const dialogRef = useRef(null);
  const [inner, setInner] = useState(state);
  const doneTimeoutRef = useRef(null);
  const focusTimeoutRef = useRef(null);
  const succeed = (icon, title, sub) => {
    setInner({ type: "success", icon, title, sub });
    if (doneTimeoutRef.current !== null) {
      window.clearTimeout(doneTimeoutRef.current);
    }
    doneTimeoutRef.current = window.setTimeout(onDone, 1400);
  };
  const isSuccess = inner.type === "success";
  const modalTitle = (() => {
    switch (inner.type) {
      case "rating":
        return "How was your trip?";
      case "report":
        return "Report an Issue";
      case "cancel":
      case "start":
        return inner.title;
      case "accept":
        return `Accept ${inner.passengerName}?`;
      case "deny":
        return `Deny ${inner.passengerName}?`;
      case "remove":
        return `Remove ${inner.passengerName}?`;
      case "success":
        return inner.title;
      default:
        return "Dialog";
    }
  })();
  React.useEffect(() => {
    focusTimeoutRef.current = window.setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      if (focusTimeoutRef.current !== null) {
        window.clearTimeout(focusTimeoutRef.current);
      }
      if (doneTimeoutRef.current !== null) {
        window.clearTimeout(doneTimeoutRef.current);
      }
    };
  }, [onDone]);
  React.useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (isSuccess) return;
      e.preventDefault();
      onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSuccess, onClose]);
  const srOnly = {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0
  };
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("div", { className: "rating-modal-overlay", onClick: isSuccess ? void 0 : onClose }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 234,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        ref: dialogRef,
        className: `rating-modal${isSuccess ? " rating-modal-submitted" : ""}`,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "activity-modal-title",
        tabIndex: -1,
        children: [
          /* @__PURE__ */ jsxDEV("h2", { id: "activity-modal-title", style: srOnly, children: modalTitle }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 243,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "rating-modal-handle-area", children: /* @__PURE__ */ jsxDEV("div", { className: "sheet-handle" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 244,
            columnNumber: 51
          }, this) }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 244,
            columnNumber: 9
          }, this),
          isSuccess && inner.type === "success" ? /* @__PURE__ */ jsxDEV("div", { className: "rating-success", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "rating-success-icon", style: { fontSize: 40 }, children: inner.icon }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 248,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "rating-success-title", children: inner.title }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 249,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "rating-success-sub", children: inner.sub }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 250,
              columnNumber: 13
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 247,
            columnNumber: 9
          }, this) : inner.type === "rating" ? /* @__PURE__ */ jsxDEV(RatingUI, { target: inner.target, onSubmit: async (stars) => {
            try {
              const params = new URLSearchParams({
                ride_id: String(inner.rideId),
                reviewed_user_id: inner.reviewedUserId,
                rating: String(stars)
              });
              await apiFetch(`ratings/?${params.toString()}`, { method: "POST" });
              succeed("⭐", "Rating Submitted!", "Thanks for your feedback");
            } catch (err) {
              const status = err?.status ?? err?.response?.status;
              if (status === 409) {
                succeed("⭐", "Already Rated", "You have already rated this person for this ride");
              } else {
                succeed("⚠️", "Could not submit", err?.message || "Something went wrong");
              }
            }
          }, onClose }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 253,
            columnNumber: 9
          }, this) : inner.type === "report" ? /* @__PURE__ */ jsxDEV(ReportUI, { onSubmit: () => succeed("✅", "Report Sent", "Thanks for letting us know — we'll look into it"), onClose }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 273,
            columnNumber: 9
          }, this) : inner.type === "cancel" ? /* @__PURE__ */ jsxDEV(
            ConfirmUI,
            {
              icon: "🚫",
              iconColor: "#d32f2f",
              title: inner.title,
              body: inner.body,
              confirmLabel: "Yes, Cancel",
              confirmCls: "btn-confirm-cancel",
              onConfirm: async () => {
                if (onConfirmAction) {
                  const ok = await onConfirmAction();
                  if (!ok) return;
                }
                succeed("🚫", "Trip Cancelled", "Your trip has been cancelled successfully");
              },
              onClose
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 275,
              columnNumber: 9
            },
            this
          ) : inner.type === "start" ? /* @__PURE__ */ jsxDEV(
            ConfirmUI,
            {
              icon: "🏁",
              iconColor: "#d32f2f",
              title: inner.title,
              body: inner.body,
              confirmLabel: "Yes, Start",
              confirmCls: "btn-confirm-accept",
              onConfirm: async () => {
                if (onConfirmAction) {
                  const ok = await onConfirmAction();
                  if (!ok) return;
                }
                succeed("🏁", "Trip Started", "Your trip has started successfully");
              },
              onClose
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 285,
              columnNumber: 9
            },
            this
          ) : inner.type === "accept" ? /* @__PURE__ */ jsxDEV(
            ConfirmUI,
            {
              icon: "✅",
              iconColor: "#4ade80",
              title: `Accept ${inner.passengerName}?`,
              body: `${inner.passengerName} will be notified that their request has been accepted.`,
              confirmLabel: "Accept Request",
              confirmCls: "btn-confirm-accept",
              onConfirm: async () => {
                if (onConfirmAction) {
                  const ok = await onConfirmAction();
                  if (!ok) return;
                }
                succeed("✅", "Request Accepted!", `${inner.passengerName} has been added to your trip`);
              },
              onClose
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 295,
              columnNumber: 9
            },
            this
          ) : inner.type === "deny" ? /* @__PURE__ */ jsxDEV(
            ConfirmUI,
            {
              icon: "❌",
              iconColor: "#d32f2f",
              title: `Deny ${inner.passengerName}?`,
              body: `${inner.passengerName} will be notified that their request has been declined.`,
              confirmLabel: "Deny Request",
              confirmCls: "btn-confirm-cancel",
              onConfirm: async () => {
                if (onConfirmAction) {
                  const ok = await onConfirmAction();
                  if (!ok) return;
                }
                succeed("❌", "Request Denied", `${inner.passengerName}'s request has been declined`);
              },
              onClose
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 305,
              columnNumber: 9
            },
            this
          ) : inner.type === "remove" ? /* @__PURE__ */ jsxDEV(
            ConfirmUI,
            {
              icon: "🗑",
              iconColor: "#d32f2f",
              title: `Remove ${inner.passengerName}?`,
              body: `${inner.passengerName} will be removed from your trip and notified.`,
              confirmLabel: "Remove Passenger",
              confirmCls: "btn-confirm-cancel",
              onConfirm: async () => {
                if (onConfirmAction) {
                  const ok = await onConfirmAction();
                  if (!ok) return;
                }
                succeed("🗑️", "Passenger Removed", `${inner.passengerName} has been removed from your trip`);
              },
              onClose
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 315,
              columnNumber: 9
            },
            this
          ) : null
        ]
      },
      void 0,
      true,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 235,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
    lineNumber: 233,
    columnNumber: 5
  }, this);
};
_s3(Modal, "wJEllKXOK0G77s08gP7xcz7dZQI=");
_c4 = Modal;
const PassengerCarousel = ({ passengers, isPast, onRatePassenger, onRemovePassenger, onMessage }) => {
  _s4();
  const [idx, setIdx] = useState(0);
  if (!passengers || passengers.length === 0) {
    return /* @__PURE__ */ jsxDEV("div", { className: "passenger-card", style: { display: "flex", justifyContent: "center", padding: "24px", color: "var(--text-label)", fontSize: "14px" }, children: "No passengers yet." }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 353,
      columnNumber: 7
    }, this);
  }
  const p = passengers[idx];
  const total = passengers.length;
  return /* @__PURE__ */ jsxDEV("div", { className: "passenger-carousel", children: [
    total > 1 && /* @__PURE__ */ jsxDEV("div", { className: "passenger-tabs", children: passengers.map(
      (pass, i) => /* @__PURE__ */ jsxDEV(
        "button",
        {
          className: `passenger-tab${i !== idx ? " passenger-tab-active" : ""}`,
          onClick: () => setIdx(i),
          children: pass.name.split(" ")[0]
        },
        pass.id,
        false,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 367,
          columnNumber: 9
        },
        this
      )
    ) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 365,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "passenger-card", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "passenger-card-header", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "passenger-avatar", children: p.name[0] }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 378,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "passenger-info", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "passenger-name", children: p.name }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 380,
            columnNumber: 13
          }, this),
          p.rating !== void 0 ? /* @__PURE__ */ jsxDEV("div", { className: "passenger-rating", children: [
            "⭐ ",
            p.rating
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 382,
            columnNumber: 13
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "passenger-rating no-rating", children: "No rating yet" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 383,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 379,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 377,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "sheet-details-card passenger-details", children: [
        /* @__PURE__ */ jsxDEV(DetailRow, { label: "Pick Up", value: p.pickupLocation }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 389,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(DetailRow, { label: "Cost", value: "£2.00", valueClass: "detail-price" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 390,
          columnNumber: 11
        }, this),
        isPast && p.rated && /* @__PURE__ */ jsxDEV(DetailRow, { label: "Trip Rating", value: `⭐ ${p.triprated}`, valueClass: "passenger-rating" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 392,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 388,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "passenger-actions", children: [
        /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-message", icon: Icons.message, label: "Message", small: true, onClick: () => onMessage?.(p) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 397,
          columnNumber: 11
        }, this),
        isPast ? /* @__PURE__ */ jsxDEV(Fragment, { children: !p.rated && /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-rate", icon: Icons.star, label: "Rate", small: true, onClick: () => onRatePassenger?.(p) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 400,
          columnNumber: 28
        }, this) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 399,
          columnNumber: 11
        }, this) : /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-cancel", icon: Icons.remove, label: "Remove", small: true, onClick: () => onRemovePassenger?.(p) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 403,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 396,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 376,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
    lineNumber: 363,
    columnNumber: 5
  }, this);
};
_s4(PassengerCarousel, "uLNXp11TVAHb/Uw+TtMzDY6Cb9o=");
_c5 = PassengerCarousel;
const TripDetailsPanel = ({ trip, onClose, onOpenChat, onRideStarted, mode }) => {
  _s5();
  const [closing, setClosing] = useState(false);
  const [modal, setModal] = useState(null);
  const touchStartY = useRef(null);
  const [routeData, setRouteData] = useState(null);
  const closeTimeoutRef = useRef(null);
  const rideStartedTimeoutRef = useRef(null);
  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
      if (rideStartedTimeoutRef.current !== null) {
        window.clearTimeout(rideStartedTimeoutRef.current);
      }
    };
  }, []);
  const close = () => {
    setClosing(true);
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = window.setTimeout(onClose, 320);
  };
  const openModal = (m) => setModal(m);
  const closeModal = () => setModal(null);
  const doneModal = () => {
    const completedType = modal?.type;
    setModal(null);
    close();
    if (completedType === "start") {
      if (rideStartedTimeoutRef.current !== null) {
        window.clearTimeout(rideStartedTimeoutRef.current);
      }
      rideStartedTimeoutRef.current = window.setTimeout(() => onRideStarted?.(), 320);
    }
  };
  const handleAction = async (type, targetId) => {
    try {
      let endpoint = "";
      let method = "DELETE";
      let body = void 0;
      switch (type) {
        case "accept":
          endpoint = `bookings/${targetId}/accept`;
          method = "PUT";
          break;
        case "deny":
        case "cancelBooking":
        case "removePassenger":
          endpoint = `bookings/${targetId}`;
          method = "DELETE";
          break;
        case "cancelRide":
          endpoint = `rides/${targetId}`;
          method = "DELETE";
          break;
        case "startRide":
          endpoint = `rides/${targetId}`;
          method = "PUT";
          body = JSON.stringify({ status: "in_progress" });
          break;
      }
      await apiFetch(endpoint, {
        method,
        ...body ? { body, headers: { "Content-Type": "application/json" } } : {}
      });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };
  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartY.current !== null && e.changedTouches[0].clientY - touchStartY.current > 80) close();
    touchStartY.current = null;
  };
  const passengers = trip.passengers || [];
  const renderBody = () => {
    switch (trip.status) {
      case "upcomingUser":
        return /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "sheet-details-card", children: [
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Driver", value: trip.drivername ?? "Pending" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 496,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Destination", value: trip.destination ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 497,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Date & Arrival", value: trip.time ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 498,
              columnNumber: 15
            }, this),
            routeData?.times ? /* @__PURE__ */ jsxDEV(DetailRow, { label: "Estimated Pickup", value: routeData.times.pickups.find((p) => p.booking_ids && p.booking_ids.includes(trip.id))?.estimated_time ? new Date(routeData.times.pickups.find((p) => p.booking_ids && p.booking_ids.includes(trip.id)).estimated_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Pending" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 500,
              columnNumber: 15
            }, this) : /* @__PURE__ */ jsxDEV(DetailRow, { label: "Estimated Pickup", value: "Pending" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 506,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Cost", value: "£2.00", valueClass: "detail-price" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 508,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 495,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "sheet-actions", children: [
            /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-message", icon: Icons.message, label: "Message Driver", onClick: () => trip.ride_id && onOpenChat?.(String(trip.ride_id)) }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 511,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              Btn,
              {
                cls: "btn-cancel",
                icon: Icons.cancel,
                label: "Cancel Trip",
                onClick: () => openModal({
                  type: "cancel",
                  title: "Cancel this trip?",
                  body: "Are you sure you want to cancel your upcoming trip? The driver will be notified.",
                  actionType: "cancelBooking",
                  targetId: trip.id
                })
              },
              void 0,
              false,
              {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
                lineNumber: 512,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 510,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 494,
          columnNumber: 11
        }, this);
      case "requested":
        return /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "sheet-details-card", children: [
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Driver", value: trip.drivername ?? "Pending" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 525,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Destination", value: trip.destination ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 526,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Be There For", value: trip.time ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 527,
              columnNumber: 15
            }, this),
            routeData?.times ? /* @__PURE__ */ jsxDEV(DetailRow, { label: "Estimated Pickup", value: routeData.times.pickups.find((p) => p.booking_ids && p.booking_ids.includes(trip.id))?.estimated_time ? new Date(routeData.times.pickups.find((p) => p.booking_ids && p.booking_ids.includes(trip.id)).estimated_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Pending" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 529,
              columnNumber: 15
            }, this) : /* @__PURE__ */ jsxDEV(DetailRow, { label: "Estimated Pickup", value: "Pending" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 535,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Cost", value: "£2.00", valueClass: "detail-price" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 537,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 524,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "sheet-actions", children: [
            /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-message", icon: Icons.message, label: "Message Driver", onClick: () => trip.ride_id && onOpenChat?.(String(trip.ride_id)) }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 540,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              Btn,
              {
                cls: "btn-cancel",
                icon: Icons.cancel,
                label: "Cancel Trip",
                onClick: () => openModal({
                  type: "cancel",
                  title: "Cancel this request?",
                  body: "Are you sure you want to cancel your trip request? The driver will be notified.",
                  actionType: "cancelBooking",
                  targetId: trip.id
                })
              },
              void 0,
              false,
              {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
                lineNumber: 541,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 539,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 523,
          columnNumber: 11
        }, this);
      case "pastUser":
        return /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "sheet-details-card", children: [
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Driver", value: trip.drivername ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 554,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Destination", value: trip.destination ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 555,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Pick Up Time", value: trip.time ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 556,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Arrival Time", value: routeData && routeData.times && routeData.times.arrival ? new Date(routeData.times.arrival).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 557,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Cost", value: "£2.00", valueClass: "detail-price" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 558,
              columnNumber: 15
            }, this),
            trip.rating !== void 0 && /* @__PURE__ */ jsxDEV(DetailRow, { label: "Your Rating", value: `⭐ ${trip.rating}` }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 559,
              columnNumber: 45
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 553,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "sheet-actions", children: [
            /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-message", icon: Icons.message, label: "Message Driver", onClick: () => trip.ride_id && onOpenChat?.(String(trip.ride_id)) }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 562,
              columnNumber: 15
            }, this),
            trip.rating === void 0 && trip.driver_profile_id && trip.ride_id && /* @__PURE__ */ jsxDEV(
              Btn,
              {
                cls: "btn-rate",
                icon: Icons.star,
                label: "Rate Trip",
                onClick: () => openModal({
                  type: "rating",
                  rideId: trip.ride_id,
                  reviewedUserId: trip.driver_profile_id,
                  target: { name: trip.drivername ?? "Your Driver", role: "driver" }
                })
              },
              void 0,
              false,
              {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
                lineNumber: 564,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-report", icon: Icons.report, label: "Report Issue", onClick: () => openModal({ type: "report" }) }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 572,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 561,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 552,
          columnNumber: 11
        }, this);
      case "upcomingDriver":
        return /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "sheet-details-card", children: [
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Destination", value: trip.destination ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 581,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Departure", value: routeData && routeData.times && routeData.times.driver_leave ? new Date(routeData.times.driver_leave).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : trip.time ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 582,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Est. Arrival", value: routeData && routeData.times && routeData.times.arrival ? new Date(routeData.times.arrival).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 583,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 580,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "passenger-section-label", children: [
            "Passengers ",
            /* @__PURE__ */ jsxDEV("span", { className: "passenger-count-badge", children: passengers.length }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 585,
              columnNumber: 65
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 585,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(PassengerCarousel, { passengers, isPast: false, onRemovePassenger: (p) => openModal({ type: "remove", passengerName: p.name, bookingId: p.id }), onMessage: (p) => trip.ride_id && onOpenChat?.(String(trip.ride_id), p.profileId) }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 586,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "sheet-actions", style: { marginTop: 12 }, children: /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-cancel", icon: Icons.cancel, label: "Cancel Whole Trip", onClick: () => openModal({ type: "cancel", title: "Cancel whole trip?", body: "This will cancel your trip for all passengers. Everyone will be notified.", actionType: "cancelRide", targetId: trip.ride_id }) }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 588,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 587,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "sheet-actions", style: { marginTop: 12 }, children: /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-accept", icon: Icons.accept, label: "Begin Ride", onClick: () => openModal({ type: "start", title: "Start whole trip?", body: "This will start your trip and notify users.", targetId: trip.ride_id }) }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 591,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 590,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 579,
          columnNumber: 11
        }, this);
      case "passengerRequest":
        return /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "sheet-details-card", children: [
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Passenger", value: trip.username ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 600,
              columnNumber: 15
            }, this),
            trip.rating !== void 0 && /* @__PURE__ */ jsxDEV(DetailRow, { label: "Rating", value: `⭐ ${trip.rating}` }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 601,
              columnNumber: 45
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Destination", value: trip.destination ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 602,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Drop Off By", value: trip.time ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 603,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Cost", value: "£2.00", valueClass: "detail-price" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 604,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 599,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "sheet-actions", children: [
            /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-message", icon: Icons.message, label: "Message Passenger", onClick: () => trip.ride_id && onOpenChat?.(String(trip.ride_id), trip.passenger_profile_id) }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 607,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-accept", icon: Icons.accept, label: "Accept Request", onClick: () => openModal({ type: "accept", passengerName: trip.username ?? "Passenger", bookingId: trip.id }) }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 608,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-cancel", icon: Icons.cancel, label: "Deny Request", onClick: () => openModal({ type: "deny", passengerName: trip.username ?? "Passenger", bookingId: trip.id }) }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 609,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 606,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 598,
          columnNumber: 11
        }, this);
      case "pastDriver":
        return /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("div", { className: "sheet-details-card", children: [
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Destination", value: trip.destination ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 618,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Departure", value: routeData && routeData.times && routeData.times.driver_leave ? new Date(routeData.times.driver_leave).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : trip.time ?? "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 619,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(DetailRow, { label: "Arrival", value: routeData && routeData.times && routeData.times.arrival ? new Date(routeData.times.arrival).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 620,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 617,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "passenger-section-label", children: [
            "Passengers: ",
            /* @__PURE__ */ jsxDEV("span", { className: "passenger-count-badge", children: passengers.length }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 623,
              columnNumber: 27
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 622,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            PassengerCarousel,
            {
              passengers,
              isPast: true,
              onRatePassenger: (p) => p.profileId && trip.ride_id && openModal({
                type: "rating",
                rideId: trip.ride_id,
                reviewedUserId: p.profileId,
                target: { name: p.name, role: "passenger" }
              }),
              onMessage: (p) => trip.ride_id && onOpenChat?.(String(trip.ride_id), p.profileId)
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 625,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "sheet-actions", style: { marginTop: 12 }, children: /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-report", icon: Icons.report, label: "Report Issue", onClick: () => openModal({ type: "report" }) }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 637,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 636,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 616,
          columnNumber: 11
        }, this);
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("div", { className: `sheet-overlay${closing ? " overlay-closing" : ""}`, onClick: close }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 648,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: `trip-sheet${closing ? " sheet-closing" : ""}`, onTouchStart, onTouchEnd, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "sheet-handle-area", children: /* @__PURE__ */ jsxDEV("div", { className: "sheet-handle" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 650,
        columnNumber: 44
      }, this) }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 650,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "sheet-scroll", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "sheet-header", children: [
          /* @__PURE__ */ jsxDEV("button", { className: "sheet-back-btn", onClick: close, children: [
            Icons.back,
            " Back"
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 653,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("h2", { className: "sheet-title", children: "Trip Details" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 654,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { style: { width: 60 } }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 655,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 652,
          columnNumber: 11
        }, this),
        trip.ride_id ? /* @__PURE__ */ jsxDEV("div", { className: "map-container", children: /* @__PURE__ */ jsxDEV(
          RideRenderMap,
          {
            rideId: trip.ride_id,
            height: "220px",
            interactive: true,
            driverMode: mode === "Driver",
            onRouteData: setRouteData,
            existingPickup: trip.pickup_lat && trip.pickup_lng ? { lat: trip.pickup_lat, lng: trip.pickup_lng } : void 0
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 660,
            columnNumber: 15
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 659,
          columnNumber: 11
        }, this) : /* @__PURE__ */ jsxDEV(MapPlaceholder, {}, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 673,
          columnNumber: 11
        }, this),
        renderBody(),
        /* @__PURE__ */ jsxDEV("div", { style: { height: 32 } }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 676,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 651,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 649,
      columnNumber: 7
    }, this),
    modal && /* @__PURE__ */ jsxDEV(
      Modal,
      {
        state: modal,
        onClose: closeModal,
        onDone: doneModal,
        onConfirmAction: async () => {
          if (modal.type === "accept" || modal.type === "deny") {
            return await handleAction(modal.type, modal.bookingId);
          }
          if (modal.type === "cancel") {
            return await handleAction(modal.actionType, modal.targetId);
          }
          if (modal.type === "remove") {
            return await handleAction("removePassenger", modal.bookingId);
          }
          if (modal.type === "start") {
            return await handleAction("startRide", modal.targetId);
          }
          return true;
        }
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 681,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
    lineNumber: 647,
    columnNumber: 5
  }, this);
};
_s5(TripDetailsPanel, "m5lCYV574kovfzARnjoE3La1gMc=");
_c6 = TripDetailsPanel;
const TripSection = ({
  title,
  trips,
  emptyTitle,
  emptySubtitle,
  emptyIcon,
  collapsible = false,
  onTripMore,
  showFilter
}) => {
  _s6();
  const [expanded, setExpanded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Rating");
  const [filterOpen, setFilterOpen] = useState(false);
  const visible = collapsible && !expanded ? trips.slice(0, 3) : trips;
  return /* @__PURE__ */ jsxDEV("section", { className: "uber-section", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "section-header-row", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "section-title", children: title }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 713,
        columnNumber: 9
      }, this),
      showFilter && /* @__PURE__ */ jsxDEV("div", { className: "filter-container", children: [
        /* @__PURE__ */ jsxDEV("button", { className: "filter-button", onClick: () => setFilterOpen((o) => !o), children: [
          selectedFilter,
          " ▾"
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 716,
          columnNumber: 13
        }, this),
        filterOpen && /* @__PURE__ */ jsxDEV("div", { className: "filter-dropdown", children: ["Rating", "Ease"].map(
          (opt) => /* @__PURE__ */ jsxDEV("div", { className: "filter-option", onClick: () => {
            setSelectedFilter(opt);
            setFilterOpen(false);
          }, children: opt }, opt, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 720,
            columnNumber: 13
          }, this)
        ) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 718,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 715,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 712,
      columnNumber: 7
    }, this),
    trips.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "card activity-upcoming-card", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("div", { className: "activity-upcoming-title", children: emptyTitle }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 731,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "activity-upcoming-subtitle", children: emptySubtitle }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 732,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 730,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "activity-upcoming-icon", children: emptyIcon }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 734,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 729,
      columnNumber: 7
    }, this) : /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV("div", { className: "past-list", children: visible.slice().reverse().map(
        (trip) => /* @__PURE__ */ jsxDEV("div", { className: "card trip-row-card", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "trip-row-left", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "trip-car-icon", children: "🚗" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 742,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "trip-row-text", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "trip-row-title", children: [
                trip.destination ?? trip.username ?? "Trip",
                " - ",
                trip.timeOnly && /* @__PURE__ */ jsxDEV("span", { className: "trip-row-time", children: trip.timeOnly }, void 0, false, {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
                  lineNumber: 745,
                  columnNumber: 89
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
                lineNumber: 744,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "trip-row-meta", children: trip.dateOnly ?? trip.time }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
                lineNumber: 747,
                columnNumber: 21
              }, this),
              trip.drivername && /* @__PURE__ */ jsxDEV("div", { className: "trip-row-meta", children: trip.drivername }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
                lineNumber: 748,
                columnNumber: 41
              }, this),
              trip.username && trip.username !== trip.drivername && /* @__PURE__ */ jsxDEV("div", { className: "trip-row-meta", children: trip.username }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
                lineNumber: 749,
                columnNumber: 76
              }, this),
              trip.numberPassengers !== void 0 && /* @__PURE__ */ jsxDEV("div", { className: "trip-row-meta", children: [
                "Passengers: ",
                trip.numberPassengers
              ] }, void 0, true, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
                lineNumber: 750,
                columnNumber: 61
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "trip-row-price", children: trip.rating !== void 0 && /* @__PURE__ */ jsxDEV(Fragment, { children: [
                " – ",
                /* @__PURE__ */ jsxDEV("span", { className: "trip-row-rating", children: [
                  "⭐ ",
                  trip.rating
                ] }, void 0, true, {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
                  lineNumber: 752,
                  columnNumber: 58
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
                lineNumber: 752,
                columnNumber: 53
              }, this) }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
                lineNumber: 751,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
              lineNumber: 743,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 741,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("button", { className: "pill pill-solid trip-row-button", onClick: () => onTripMore(trip), children: trip.action }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
            lineNumber: 756,
            columnNumber: 17
          }, this)
        ] }, trip.id, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 740,
          columnNumber: 11
        }, this)
      ) }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 738,
        columnNumber: 11
      }, this),
      collapsible && trips.length > 3 && /* @__PURE__ */ jsxDEV("div", { className: "see-more-container", children: /* @__PURE__ */ jsxDEV("button", { className: "see-more-button", onClick: () => setExpanded((e) => !e), children: expanded ? "See less" : "See more" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 762,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 761,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 737,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
    lineNumber: 711,
    columnNumber: 5
  }, this);
};
_s6(TripSection, "7TO0BtETWksnMKHxmRmRgN29mkk=");
_c7 = TripSection;
const ActivityPage = ({ canUseDriverMode, onDriverSignup, onOpenChat, onRideStarted, mode, onModeChange }) => {
  _s7();
  const [internalMode, setInternalMode] = useState("user");
  const currentMode = mode ?? internalMode;
  const setCurrentMode = (nextMode) => {
    if (mode === void 0) {
      setInternalMode(nextMode);
    }
    onModeChange?.(nextMode);
  };
  React.useEffect(() => {
    if (!canUseDriverMode && currentMode === "Driver") setCurrentMode("user");
  }, [canUseDriverMode, currentMode]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchActivity = async () => {
    setLoading(true);
    setError(null);
    try {
      const formatTime = (iso) => {
        if (!iso) return "Pending";
        const date = new Date(iso);
        return date.toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
      };
      const formatDateOnly = (iso) => {
        if (!iso) return "Pending";
        const date = new Date(iso);
        return date.toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long" });
      };
      const formatTimeOnly = (iso) => {
        if (!iso) return "";
        const date = new Date(iso);
        return date.toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" });
      };
      if (currentMode === "user") {
        const data = await apiFetch("bookings/me", { method: "GET" });
        const transformed = data.map((b) => {
          const rideData = b.ride || {};
          const driverObj = rideData.driver || {};
          const driverName = driverObj.first_name ? `${driverObj.first_name} ${driverObj.last_name}` : b.passenger_name || `User ${b.user_id?.substring(0, 4)}`;
          return {
            id: b.id,
            ride_id: b.ride_id,
            driver_profile_id: driverObj.id ?? rideData.driver_id,
            username: driverName,
            drivername: driverName,
            destination: b.dropoff_location || rideData.destination || "Destination",
            time: formatTime(b.pickup_time || rideData.departure_time),
            dateOnly: formatDateOnly(b.pickup_time || rideData.departure_time),
            timeOnly: formatTimeOnly(b.pickup_time || rideData.departure_time),
            price: `£2.00`,
            status: b.status === "pending" ? "requested" : b.status === "confirmed" ? rideData.status === "in_progress" ? "activeUser" : "upcomingUser" : b.status === "completed" ? "pastUser" : "cancelled",
            action: "More",
            pickup_lat: b.pickup_lat,
            pickup_lng: b.pickup_lng
          };
        }).filter((t) => t.status !== "cancelled");
        setBookings(transformed);
      } else {
        const ridesData = await apiFetch("rides/driver/dashboard", { method: "GET" });
        const finalDriverActivities = [];
        ridesData.forEach((ride) => {
          finalDriverActivities.push({
            id: ride.id,
            ride_id: ride.id,
            destination: ride.destination,
            time: formatTime(ride.departure_time),
            dateOnly: formatDateOnly(ride.departure_time),
            timeOnly: formatTimeOnly(ride.departure_time),
            status: ride.status === "completed" ? "pastDriver" : ride.status === "in_progress" ? "activeDriver" : "upcomingDriver",
            action: "More",
            numberPassengers: ride.bookings.filter(
              (b) => b.status === "confirmed" || b.status === "completed"
            ).length,
            passengers: ride.bookings.filter((b) => b.status === "confirmed" || b.status === "completed").map((b) => ({
              id: b.id,
              profileId: b.passenger?.id ?? b.passenger_id,
              rideId: ride.id,
              name: b.passenger ? `${b.passenger.first_name} ${b.passenger.last_name}` : "Unknown",
              rating: b.passenger?.rider_rating && b.passenger.rider_rating > 0 ? b.passenger.rider_rating : void 0,
              pickupLocation: b.pickup_location,
              cost: `£2.00`,
              rated: false
            }))
          });
          ride.bookings.forEach((b) => {
            if (b.status === "pending") {
              finalDriverActivities.push({
                id: b.id,
                ride_id: ride.id,
                passenger_profile_id: b.passenger?.id ?? b.passenger_id,
                username: b.passenger ? `${b.passenger.first_name} ${b.passenger.last_name}` : "Unknown Passenger",
                destination: b.dropoff_location,
                time: formatTime(b.pickup_time || ride.departure_time),
                dateOnly: formatDateOnly(b.pickup_time || ride.departure_time),
                timeOnly: formatTimeOnly(b.pickup_time || ride.departure_time),
                price: `£2.00`,
                status: "passengerRequest",
                action: "More",
                pickup_lat: b.pickup_lat,
                pickup_lng: b.pickup_lng,
                rating: b.passenger?.rider_rating && b.passenger.rider_rating > 0 ? b.passenger.rider_rating : void 0
              });
            }
          });
        });
        setBookings(finalDriverActivities);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    fetchActivity();
  }, [currentMode]);
  const driverRequests = bookings.filter((b) => b.status === "passengerRequest");
  const driverUpcoming = bookings.filter((b) => b.status === "upcomingDriver");
  const driverPast = bookings.filter((b) => b.status === "pastDriver");
  const riderUpcoming = bookings.filter((b) => b.status === "upcomingUser");
  const riderRequested = bookings.filter((b) => b.status === "requested");
  const riderPast = bookings.filter((b) => b.status === "pastUser");
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("header", { className: "uber-header", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "activity-title", children: "Activity" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 911,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "top-toggle", children: [
        /* @__PURE__ */ jsxDEV("button", { className: `toggle-tab ${currentMode === "user" ? "toggle-tab-active" : ""}`, onClick: () => setCurrentMode("user"), children: "Rider" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 913,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: `toggle-tab ${currentMode === "Driver" ? "toggle-tab-active" : ""}`, onClick: () => {
          if (!canUseDriverMode) return onDriverSignup();
          setCurrentMode("Driver");
        }, children: "Driver" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
          lineNumber: 914,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 912,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 910,
      columnNumber: 7
    }, this),
    loading && /* @__PURE__ */ jsxDEV("p", { style: { padding: "20px" }, children: "Loading activities..." }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 918,
      columnNumber: 19
    }, this),
    error && /* @__PURE__ */ jsxDEV("p", { style: { padding: "20px", color: "#ff9999", fontWeight: "bold" }, children: [
      "Error: ",
      error
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 919,
      columnNumber: 17
    }, this),
    !loading && /* @__PURE__ */ jsxDEV(Fragment, { children: [
      /* @__PURE__ */ jsxDEV(TripSection, { title: "Upcoming", trips: currentMode === "user" ? riderUpcoming : driverUpcoming, emptyTitle: "You have no upcoming trips", emptySubtitle: "Reserve your trip →", emptyIcon: "📅", collapsible: true, mode: currentMode, onTripMore: setSelectedTrip }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 923,
        columnNumber: 11
      }, this),
      currentMode === "user" ? /* @__PURE__ */ jsxDEV(TripSection, { title: "Requested", trips: riderRequested, emptyTitle: "You have no requested trips", emptySubtitle: "Book a reservation →", emptyIcon: "🗓️", collapsible: true, mode: currentMode, onTripMore: setSelectedTrip }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 925,
        columnNumber: 9
      }, this) : /* @__PURE__ */ jsxDEV(TripSection, { title: "Passenger Requests", trips: driverRequests, emptyTitle: "You have no requests", emptySubtitle: "Soon your ride will be booked", emptyIcon: "🗓️", collapsible: true, mode: currentMode, onTripMore: setSelectedTrip, showFilter: true }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 927,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(TripSection, { title: "Past", trips: currentMode === "user" ? riderPast : driverPast, emptyTitle: "No past trips yet", emptySubtitle: "Your completed rides will appear here", emptyIcon: "🕘", collapsible: true, mode: currentMode, onTripMore: setSelectedTrip }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
        lineNumber: 929,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 922,
      columnNumber: 7
    }, this),
    selectedTrip && /* @__PURE__ */ jsxDEV(TripDetailsPanel, { trip: selectedTrip, mode: currentMode, onClose: () => {
      setSelectedTrip(null);
      fetchActivity();
    }, onOpenChat, onRideStarted }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
      lineNumber: 934,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx",
    lineNumber: 909,
    columnNumber: 5
  }, this);
};
_s7(ActivityPage, "nn+eYQru5lim/V+g60v1f1dQ3sI=");
_c8 = ActivityPage;
export default ActivityPage;
var _c, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
$RefreshReg$(_c, "RatingUI");
$RefreshReg$(_c2, "ReportUI");
$RefreshReg$(_c3, "ConfirmUI");
$RefreshReg$(_c4, "Modal");
$RefreshReg$(_c5, "PassengerCarousel");
$RefreshReg$(_c6, "TripDetailsPanel");
$RefreshReg$(_c7, "TripSection");
$RefreshReg$(_c8, "ActivityPage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ActivityPage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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REQsZ0JBQ0MsdUJBQUMsb0JBQWlCLE1BQU1BLGNBQWMsTUFBTUgsYUFBYSxTQUFTLE1BQU07QUFBRUksc0JBQWdCLElBQUk7QUFBR00sb0JBQWM7QUFBQSxJQUFHLEdBQUcsWUFBd0IsaUJBQTdJO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBMEs7QUFBQSxPQXpCOUs7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQTJCQTtBQUVKO0FBQUViLElBNUpJSixjQUF5QztBQUFBK0QsTUFBekMvRDtBQThKTixlQUFlQTtBQUFhLElBQUE3TCxJQUFBUSxLQUFBVyxLQUFBd0QsS0FBQXVCLEtBQUFpRSxLQUFBeUIsS0FBQWdFO0FBQUFDLGFBQUE3UCxJQUFBO0FBQUE2UCxhQUFBclAsS0FBQTtBQUFBcVAsYUFBQTFPLEtBQUE7QUFBQTBPLGFBQUFsTCxLQUFBO0FBQUFrTCxhQUFBM0osS0FBQTtBQUFBMkosYUFBQTFGLEtBQUE7QUFBQTBGLGFBQUFqRSxLQUFBO0FBQUFpRSxhQUFBRCxLQUFBIiwibmFtZXMiOlsiUmVhY3QiLCJ1c2VSZWYiLCJ1c2VTdGF0ZSIsIkJ0biIsIkRldGFpbFJvdyIsIkljb25zIiwiTWFwUGxhY2Vob2xkZXIiLCJSaWRlUmVuZGVyTWFwIiwiYXBpRmV0Y2giLCJSQVRJTkdfTEFCRUxTIiwiUmF0aW5nVUkiLCJ0YXJnZXQiLCJvblN1Ym1pdCIsIm9uQ2xvc2UiLCJfcyIsImhvdmVyZWQiLCJzZXRIb3ZlcmVkIiwic2VsZWN0ZWQiLCJzZXRTZWxlY3RlZCIsImRpc3BsYXkiLCJuYW1lIiwicm9sZSIsIm1hcCIsIm4iLCJfYyIsIlJlcG9ydFVJIiwiX3MyIiwidGV4dCIsInNldFRleHQiLCJlIiwidmFsdWUiLCJ0cmltIiwiX2MyIiwiQ29uZmlybVVJIiwiaWNvbiIsImljb25Db2xvciIsInRpdGxlIiwiYm9keSIsImNvbmZpcm1MYWJlbCIsImNvbmZpcm1DbHMiLCJvbkNvbmZpcm0iLCJjb2xvciIsIm1hcmdpblRvcCIsIl9jMyIsIk1vZGFsIiwic3RhdGUiLCJvbkRvbmUiLCJvbkNvbmZpcm1BY3Rpb24iLCJfczMiLCJkaWFsb2dSZWYiLCJpbm5lciIsInNldElubmVyIiwiZG9uZVRpbWVvdXRSZWYiLCJmb2N1c1RpbWVvdXRSZWYiLCJzdWNjZWVkIiwic3ViIiwidHlwZSIsImN1cnJlbnQiLCJ3aW5kb3ciLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiaXNTdWNjZXNzIiwibW9kYWxUaXRsZSIsInBhc3Nlbmdlck5hbWUiLCJ1c2VFZmZlY3QiLCJmb2N1cyIsIm9uS2V5RG93biIsImtleSIsInByZXZlbnREZWZhdWx0IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJzck9ubHkiLCJwb3NpdGlvbiIsIndpZHRoIiwiaGVpZ2h0IiwicGFkZGluZyIsIm1hcmdpbiIsIm92ZXJmbG93IiwiY2xpcCIsIndoaXRlU3BhY2UiLCJib3JkZXIiLCJ1bmRlZmluZWQiLCJmb250U2l6ZSIsInN0YXJzIiwicGFyYW1zIiwiVVJMU2VhcmNoUGFyYW1zIiwicmlkZV9pZCIsIlN0cmluZyIsInJpZGVJZCIsInJldmlld2VkX3VzZXJfaWQiLCJyZXZpZXdlZFVzZXJJZCIsInJhdGluZyIsInRvU3RyaW5nIiwibWV0aG9kIiwiZXJyIiwic3RhdHVzIiwicmVzcG9uc2UiLCJtZXNzYWdlIiwib2siLCJfYzQiLCJQYXNzZW5nZXJDYXJvdXNlbCIsInBhc3NlbmdlcnMiLCJpc1Bhc3QiLCJvblJhdGVQYXNzZW5nZXIiLCJvblJlbW92ZVBhc3NlbmdlciIsIm9uTWVzc2FnZSIsIl9zNCIsImlkeCIsInNldElkeCIsImxlbmd0aCIsImp1c3RpZnlDb250ZW50IiwicCIsInRvdGFsIiwicGFzcyIsImkiLCJzcGxpdCIsImlkIiwicGlja3VwTG9jYXRpb24iLCJyYXRlZCIsInRyaXByYXRlZCIsInN0YXIiLCJyZW1vdmUiLCJfYzUiLCJUcmlwRGV0YWlsc1BhbmVsIiwidHJpcCIsIm9uT3BlbkNoYXQiLCJvblJpZGVTdGFydGVkIiwibW9kZSIsIl9zNSIsImNsb3NpbmciLCJzZXRDbG9zaW5nIiwibW9kYWwiLCJzZXRNb2RhbCIsInRvdWNoU3RhcnRZIiwicm91dGVEYXRhIiwic2V0Um91dGVEYXRhIiwiY2xvc2VUaW1lb3V0UmVmIiwicmlkZVN0YXJ0ZWRUaW1lb3V0UmVmIiwiY2xvc2UiLCJvcGVuTW9kYWwiLCJtIiwiY2xvc2VNb2RhbCIsImRvbmVNb2RhbCIsImNvbXBsZXRlZFR5cGUiLCJoYW5kbGVBY3Rpb24iLCJ0YXJnZXRJZCIsImVuZHBvaW50IiwiSlNPTiIsInN0cmluZ2lmeSIsImhlYWRlcnMiLCJjb25zb2xlIiwiZXJyb3IiLCJvblRvdWNoU3RhcnQiLCJ0b3VjaGVzIiwiY2xpZW50WSIsIm9uVG91Y2hFbmQiLCJjaGFuZ2VkVG91Y2hlcyIsInJlbmRlckJvZHkiLCJkcml2ZXJuYW1lIiwiZGVzdGluYXRpb24iLCJ0aW1lIiwidGltZXMiLCJwaWNrdXBzIiwiZmluZCIsImJvb2tpbmdfaWRzIiwiaW5jbHVkZXMiLCJlc3RpbWF0ZWRfdGltZSIsIkRhdGUiLCJ0b0xvY2FsZVRpbWVTdHJpbmciLCJob3VyIiwibWludXRlIiwiY2FuY2VsIiwiYWN0aW9uVHlwZSIsImFycml2YWwiLCJkcml2ZXJfcHJvZmlsZV9pZCIsInJlcG9ydCIsImRyaXZlcl9sZWF2ZSIsImJvb2tpbmdJZCIsInByb2ZpbGVJZCIsImFjY2VwdCIsInVzZXJuYW1lIiwicGFzc2VuZ2VyX3Byb2ZpbGVfaWQiLCJiYWNrIiwicGlja3VwX2xhdCIsInBpY2t1cF9sbmciLCJsYXQiLCJsbmciLCJfYzYiLCJUcmlwU2VjdGlvbiIsInRyaXBzIiwiZW1wdHlUaXRsZSIsImVtcHR5U3VidGl0bGUiLCJlbXB0eUljb24iLCJjb2xsYXBzaWJsZSIsIm9uVHJpcE1vcmUiLCJzaG93RmlsdGVyIiwiX3M2IiwiZXhwYW5kZWQiLCJzZXRFeHBhbmRlZCIsInNlbGVjdGVkRmlsdGVyIiwic2V0U2VsZWN0ZWRGaWx0ZXIiLCJmaWx0ZXJPcGVuIiwic2V0RmlsdGVyT3BlbiIsInZpc2libGUiLCJzbGljZSIsIm8iLCJvcHQiLCJyZXZlcnNlIiwidGltZU9ubHkiLCJkYXRlT25seSIsIm51bWJlclBhc3NlbmdlcnMiLCJhY3Rpb24iLCJfYzciLCJBY3Rpdml0eVBhZ2UiLCJjYW5Vc2VEcml2ZXJNb2RlIiwib25Ecml2ZXJTaWdudXAiLCJvbk1vZGVDaGFuZ2UiLCJfczciLCJpbnRlcm5hbE1vZGUiLCJzZXRJbnRlcm5hbE1vZGUiLCJjdXJyZW50TW9kZSIsInNldEN1cnJlbnRNb2RlIiwibmV4dE1vZGUiLCJzZWxlY3RlZFRyaXAiLCJzZXRTZWxlY3RlZFRyaXAiLCJib29raW5ncyIsInNldEJvb2tpbmdzIiwibG9hZGluZyIsInNldExvYWRpbmciLCJzZXRFcnJvciIsImZldGNoQWN0aXZpdHkiLCJmb3JtYXRUaW1lIiwiaXNvIiwiZGF0ZSIsInRvTG9jYWxlU3RyaW5nIiwid2Vla2RheSIsImRheSIsIm1vbnRoIiwiZm9ybWF0RGF0ZU9ubHkiLCJmb3JtYXRUaW1lT25seSIsImRhdGEiLCJ0cmFuc2Zvcm1lZCIsImIiLCJyaWRlRGF0YSIsInJpZGUiLCJkcml2ZXJPYmoiLCJkcml2ZXIiLCJkcml2ZXJOYW1lIiwiZmlyc3RfbmFtZSIsImxhc3RfbmFtZSIsInBhc3Nlbmdlcl9uYW1lIiwidXNlcl9pZCIsInN1YnN0cmluZyIsImRyaXZlcl9pZCIsImRyb3BvZmZfbG9jYXRpb24iLCJwaWNrdXBfdGltZSIsImRlcGFydHVyZV90aW1lIiwicHJpY2UiLCJmaWx0ZXIiLCJ0IiwicmlkZXNEYXRhIiwiZmluYWxEcml2ZXJBY3Rpdml0aWVzIiwiZm9yRWFjaCIsInB1c2giLCJwYXNzZW5nZXIiLCJwYXNzZW5nZXJfaWQiLCJyaWRlcl9yYXRpbmciLCJwaWNrdXBfbG9jYXRpb24iLCJjb3N0IiwiZHJpdmVyUmVxdWVzdHMiLCJkcml2ZXJVcGNvbWluZyIsImRyaXZlclBhc3QiLCJyaWRlclVwY29taW5nIiwicmlkZXJSZXF1ZXN0ZWQiLCJyaWRlclBhc3QiLCJmb250V2VpZ2h0IiwiX2M4IiwiJFJlZnJlc2hSZWckIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkFjdGl2aXR5UGFnZS50c3giXSwic291cmNlc0NvbnRlbnQiOlsiLy8gUmVhc29uIHdoeSBuYXZiYXIgZ29lcyB3ZWlyZCBpcyBiZWNhdXNlIGl0IGhhcyBhIHNjcm9sbCBiYXIgb24gdGhlIHJpZ2h0XHJcbi8vIFJlbW92ZWQgUm91dGVSb3cgZm9yIG5vdyBiZWNhdXNlIGl0J3Mgc3VycGx1c1xyXG5cclxuaW1wb3J0IFJlYWN0LCB7IHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCAnLi9BY3Rpdml0eVBhZ2UuY3NzJztcclxuaW1wb3J0IHsgQnRuLCBEZXRhaWxSb3csIEljb25zLCBNYXBQbGFjZWhvbGRlciB9IGZyb20gJy4vQXBwLnRzeCdcclxuaW1wb3J0IHsgUmlkZVJlbmRlck1hcCB9IGZyb20gJy4vY29tcG9uZW50cy9NYXAvUmlkZVJlbmRlck1hcCc7XHJcbmltcG9ydCB7IGFwaUZldGNoIH0gZnJvbSAnLi9saWIvYXBpJztcclxuXHJcbnR5cGUgVHJpcCA9IHtcclxuICBpZDogbnVtYmVyO1xyXG4gIHJpZGVfaWQ/OiBudW1iZXI7XHJcbiAgcGFzc2VuZ2VyX3Byb2ZpbGVfaWQ/OiBzdHJpbmc7XHJcbiAgZHJpdmVyX3Byb2ZpbGVfaWQ/OiBzdHJpbmc7ICAgLy8gcHJvZmlsZSBpZCBvZiB0aGUgZHJpdmVyIChmb3IgcGFzc2VuZ2VyIHJhdGluZylcclxuICBkZXN0aW5hdGlvbj86IHN0cmluZztcclxuICB1c2VybmFtZT86IHN0cmluZztcclxuICBkcml2ZXJuYW1lPzogc3RyaW5nO1xyXG4gIHRpbWU/OiBzdHJpbmc7XHJcbiAgZGF0ZU9ubHk/OiBzdHJpbmc7XHJcbiAgdGltZU9ubHk/OiBzdHJpbmc7XHJcbiAgcHJpY2U/OiBzdHJpbmc7XHJcbiAgbnVtYmVyUGFzc2VuZ2Vycz86IG51bWJlcjtcclxuICByYXRpbmc/OiBudW1iZXI7ICAgICAgICAgICAgICAvLyBleGlzdGluZyByYXRpbmcgZ2l2ZW4gVE8gdGhpcyB0cmlwIChpZiByYXRlZCBhbHJlYWR5KVxyXG4gIGFjdGlvbjogJ01vcmUnO1xyXG4gIHN0YXR1cz86ICd1cGNvbWluZ0RyaXZlcicgfCAndXBjb21pbmdVc2VyJyB8ICdyZXF1ZXN0ZWQnIHwgJ3Bhc3RVc2VyJyB8ICdwYXNzZW5nZXJSZXF1ZXN0JyB8ICdwYXN0RHJpdmVyJyB8ICdhY3RpdmVVc2VyJyB8ICdhY3RpdmVEcml2ZXInIHwgJ2NhbmNlbGxlZCc7XHJcbiAgbnVtYmVycGxhdGU/OiBzdHJpbmc7XHJcbiAgbW9kZWw/OiBzdHJpbmc7XHJcbiAgcGlja3VwX2xhdD86IG51bWJlcjtcclxuICBwaWNrdXBfbG5nPzogbnVtYmVyO1xyXG4gIHBhc3NlbmdlcnM/OiBhbnlbXTtcclxuICByaWRlcl9yYXRpbmc/OiBudW1iZXI7ICAgICAgICAvLyBwYXNzZW5nZXIncyByaWRlciByYXRpbmcgKGZvciBkcml2ZXIncyBwYXNzZW5nZXIgcmVxdWVzdCB2aWV3KVxyXG59O1xyXG5cclxuY29uc3QgUkFUSU5HX0xBQkVMUzogUmVjb3JkPG51bWJlciwgc3RyaW5nPiA9IHsgMTogJ1Bvb3InLCAyOiAnRmFpcicsIDM6ICdHb29kJywgNDogJ0dyZWF0JywgNTogJ0V4Y2VsbGVudCcgfTtcclxuXHJcbi8vIOKUgOKUgCBSYXRpbmcgVUkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXHJcbmNvbnN0IFJhdGluZ1VJOiBSZWFjdC5GQzx7XHJcbiAgdGFyZ2V0OiB7IG5hbWU6IHN0cmluZzsgcm9sZTogJ2RyaXZlcicgfCAncGFzc2VuZ2VyJyB9O1xyXG4gIG9uU3VibWl0OiAocjogbnVtYmVyKSA9PiB2b2lkO1xyXG4gIG9uQ2xvc2U6ICgpID0+IHZvaWQ7XHJcbn0+ID0gKHsgdGFyZ2V0LCBvblN1Ym1pdCwgb25DbG9zZSB9KSA9PiB7XHJcbiAgY29uc3QgW2hvdmVyZWQsIHNldEhvdmVyZWRdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW3NlbGVjdGVkLCBzZXRTZWxlY3RlZF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBkaXNwbGF5ID0gaG92ZXJlZCB8fCBzZWxlY3RlZDtcclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyYXRpbmctbW9kYWwtY29udGVudFwiPlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJhdGluZy1hdmF0YXJcIj57dGFyZ2V0Lm5hbWVbMF19PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmF0aW5nLXRpdGxlXCI+SG93IHdhcyB5b3VyIHRyaXA/PC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmF0aW5nLXN1YnRpdGxlXCI+XHJcbiAgICAgICAgUmF0ZSB5b3VyIHt0YXJnZXQucm9sZSA9PT0gJ2RyaXZlcicgPyAnZHJpdmVyJyA6ICdwYXNzZW5nZXInfSx7JyAnfVxyXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInJhdGluZy1uYW1lXCI+e3RhcmdldC5uYW1lfTwvc3Bhbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmF0aW5nLXN0YXJzXCI+XHJcbiAgICAgICAge1sxLCAyLCAzLCA0LCA1XS5tYXAobiA9PiAoXHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIGtleT17bn1cclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHJhdGluZy1zdGFyJHtuIDw9IGRpc3BsYXkgPyAnIHJhdGluZy1zdGFyLWZpbGxlZCcgOiAnJ31gfVxyXG4gICAgICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHNldEhvdmVyZWQobil9IG9uTW91c2VMZWF2ZT17KCkgPT4gc2V0SG92ZXJlZCgwKX1cclxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2VsZWN0ZWQobil9IGFyaWEtbGFiZWw9e2Ake259IHN0YXJgfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8c3ZnIHdpZHRoPVwiNDBcIiBoZWlnaHQ9XCI0MFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBzdHJva2VXaWR0aD1cIjEuNVwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxyXG4gICAgICAgICAgICAgIGZpbGw9e24gPD0gZGlzcGxheSA/ICcjZmJiZjI0JyA6ICdub25lJ30gc3Ryb2tlPXtuIDw9IGRpc3BsYXkgPyAnI2ZiYmYyNCcgOiAndmFyKC0tdGV4dC1wbGFjZWhvbGRlciknfT5cclxuICAgICAgICAgICAgICA8cG9seWdvbiBwb2ludHM9XCIxMiAyIDE1LjA5IDguMjYgMjIgOS4yNyAxNyAxNC4xNCAxOC4xOCAyMS4wMiAxMiAxNy43NyA1LjgyIDIxLjAyIDcgMTQuMTQgMiA5LjI3IDguOTEgOC4yNiAxMiAyXCIgLz5cclxuICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICApKX1cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgcmF0aW5nLWxhYmVsJHtkaXNwbGF5ID8gJyByYXRpbmctbGFiZWwtdmlzaWJsZScgOiAnJ31gfT5cclxuICAgICAgICB7ZGlzcGxheSA/IFJBVElOR19MQUJFTFNbZGlzcGxheV0gOiAn4oCOJ31cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmF0aW5nLW1vZGFsLWFjdGlvbnNcIj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJyYXRpbmctYnRuLWNhbmNlbFwiIG9uQ2xpY2s9e29uQ2xvc2V9PkNhbmNlbDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b25cclxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtgcmF0aW5nLWJ0bi1zdWJtaXQke3NlbGVjdGVkID8gJyByYXRpbmctYnRuLXN1Ym1pdC1hY3RpdmUnIDogJyd9YH1cclxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNlbGVjdGVkICYmIG9uU3VibWl0KHNlbGVjdGVkKX0gZGlzYWJsZWQ9eyFzZWxlY3RlZH0+XHJcbiAgICAgICAgICBTdWJtaXQgUmF0aW5nXHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbi8vIOKUgOKUgCBSZXBvcnQgVUkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXHJcbmNvbnN0IFJlcG9ydFVJOiBSZWFjdC5GQzx7XHJcbiAgb25TdWJtaXQ6ICh0ZXh0OiBzdHJpbmcpID0+IHZvaWQ7XHJcbiAgb25DbG9zZTogKCkgPT4gdm9pZFxyXG59PiA9ICh7IG9uU3VibWl0LCBvbkNsb3NlIH0pID0+IHtcclxuICBjb25zdCBbdGV4dCwgc2V0VGV4dF0gPSB1c2VTdGF0ZSgnJyk7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJhdGluZy1tb2RhbC1jb250ZW50XCI+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVwb3J0LWljb24td3JhcFwiPlxyXG4gICAgICAgIDxzdmcgd2lkdGg9XCIzNlwiIGhlaWdodD1cIjM2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiI2QzMmYyZlwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cclxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTAuMjkgMy44NkwxLjgyIDE4YTIgMiAwIDAgMCAxLjcxIDNoMTYuOTRhMiAyIDAgMCAwIDEuNzEtM0wxMy43MSAzLjg2YTIgMiAwIDAgMC0zLjQyIDB6XCIgLz5cclxuICAgICAgICAgIDxsaW5lIHgxPVwiMTJcIiB5MT1cIjlcIiB4Mj1cIjEyXCIgeTI9XCIxM1wiIC8+PGxpbmUgeDE9XCIxMlwiIHkxPVwiMTdcIiB4Mj1cIjEyLjAxXCIgeTI9XCIxN1wiIC8+XHJcbiAgICAgICAgPC9zdmc+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJhdGluZy10aXRsZVwiPlJlcG9ydCBhbiBJc3N1ZTwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJhdGluZy1zdWJ0aXRsZVwiPkRlc2NyaWJlIHdoYXQgaGFwcGVuZWQgYW5kIHdlJ2xsIGxvb2sgaW50byBpdDwvZGl2PlxyXG4gICAgICA8dGV4dGFyZWFcclxuICAgICAgICBjbGFzc05hbWU9XCJyZXBvcnQtdGV4dGFyZWFcIlxyXG4gICAgICAgIHBsYWNlaG9sZGVyPVwiVGVsbCB1cyB3aGF0IHdlbnQgd3JvbmfigKZcIlxyXG4gICAgICAgIHZhbHVlPXt0ZXh0fVxyXG4gICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldFRleHQoZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgIHJvd3M9ezR9XHJcbiAgICAgIC8+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmF0aW5nLW1vZGFsLWFjdGlvbnNcIj5cclxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJyYXRpbmctYnRuLWNhbmNlbFwiIG9uQ2xpY2s9e29uQ2xvc2V9PkNhbmNlbDwvYnV0dG9uPlxyXG4gICAgICAgIDxidXR0b25cclxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgY2xhc3NOYW1lPXtgcmF0aW5nLWJ0bi1zdWJtaXQgcmVwb3J0LWJ0biR7dGV4dC50cmltKCkgPyAnIHJhdGluZy1idG4tc3VibWl0LWFjdGl2ZSByZXBvcnQtYnRuLWFjdGl2ZScgOiAnJ31gfVxyXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gdGV4dC50cmltKCkgJiYgb25TdWJtaXQodGV4dCl9IGRpc2FibGVkPXshdGV4dC50cmltKCl9PlxyXG4gICAgICAgICAgU2VuZCBSZXBvcnRcclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuLy8gQ29uZmlybSBVSSAoc29ydHMgb3V0IGNhbmNlbCAvIGFjY2VwdCAvIGRlbnkgLyByZW1vdmUpXHJcbmNvbnN0IENvbmZpcm1VSTogUmVhY3QuRkM8e1xyXG4gIGljb246IHN0cmluZzsgaWNvbkNvbG9yOiBzdHJpbmc7IHRpdGxlOiBzdHJpbmc7IGJvZHk6IHN0cmluZztcclxuICBjb25maXJtTGFiZWw6IHN0cmluZzsgY29uZmlybUNsczogc3RyaW5nO1xyXG4gIG9uQ29uZmlybTogKCkgPT4gdm9pZDsgb25DbG9zZTogKCkgPT4gdm9pZDtcclxufT4gPSAoeyBpY29uLCBpY29uQ29sb3IsIHRpdGxlLCBib2R5LCBjb25maXJtTGFiZWwsIGNvbmZpcm1DbHMsIG9uQ29uZmlybSwgb25DbG9zZSB9KSA9PiAoXHJcbiAgPGRpdiBjbGFzc05hbWU9XCJyYXRpbmctbW9kYWwtY29udGVudFwiPlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb25maXJtLWljb25cIiBzdHlsZT17eyBjb2xvcjogaWNvbkNvbG9yIH19PntpY29ufTwvZGl2PlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyYXRpbmctdGl0bGVcIj57dGl0bGV9PC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJhdGluZy1zdWJ0aXRsZVwiPntib2R5fTwvZGl2PlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyYXRpbmctbW9kYWwtYWN0aW9uc1wiIHN0eWxlPXt7IG1hcmdpblRvcDogOCB9fT5cclxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwicmF0aW5nLWJ0bi1jYW5jZWxcIiBvbkNsaWNrPXtvbkNsb3NlfT5HbyBCYWNrPC9idXR0b24+XHJcbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT17YHJhdGluZy1idG4tc3VibWl0IHJhdGluZy1idG4tc3VibWl0LWFjdGl2ZSAke2NvbmZpcm1DbHN9YH0gb25DbGljaz17b25Db25maXJtfT5cclxuICAgICAgICB7Y29uZmlybUxhYmVsfVxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4pO1xyXG5cclxuLy8gTWFzdGVyIG1vZGFsIHNoZWxsXHJcbnR5cGUgTW9kYWxTdGF0ZSA9XHJcbiAgfCB7IHR5cGU6ICdyYXRpbmcnOyByaWRlSWQ6IG51bWJlcjsgcmV2aWV3ZWRVc2VySWQ6IHN0cmluZzsgdGFyZ2V0OiB7IG5hbWU6IHN0cmluZzsgcm9sZTogJ2RyaXZlcicgfCAncGFzc2VuZ2VyJyB9IH1cclxuICB8IHsgdHlwZTogJ3JlcG9ydCcgfVxyXG4gIHwgeyB0eXBlOiAnY2FuY2VsJzsgdGl0bGU6IHN0cmluZzsgYm9keTogc3RyaW5nOyBhY3Rpb25UeXBlOiAnY2FuY2VsQm9va2luZycgfCAnY2FuY2VsUmlkZSc7IHRhcmdldElkOiBudW1iZXIgfVxyXG4gIHwgeyB0eXBlOiAnYWNjZXB0JzsgcGFzc2VuZ2VyTmFtZTogc3RyaW5nOyBib29raW5nSWQ6IG51bWJlciB9XHJcbiAgfCB7IHR5cGU6ICdkZW55JzsgcGFzc2VuZ2VyTmFtZTogc3RyaW5nOyBib29raW5nSWQ6IG51bWJlciB9XHJcbiAgfCB7IHR5cGU6ICdyZW1vdmUnOyBwYXNzZW5nZXJOYW1lOiBzdHJpbmc7IGJvb2tpbmdJZDogbnVtYmVyIH1cclxuICB8IHsgdHlwZTogJ3N1Y2Nlc3MnOyBpY29uOiBzdHJpbmc7IHRpdGxlOiBzdHJpbmc7IHN1Yjogc3RyaW5nIH1cclxuICB8IHsgdHlwZTogJ3N0YXJ0JzsgdGl0bGU6IHN0cmluZzsgYm9keTogc3RyaW5nOyB0YXJnZXRJZDogbnVtYmVyIH07XHJcblxyXG5jb25zdCBNb2RhbDogUmVhY3QuRkM8e1xyXG4gIHN0YXRlOiBNb2RhbFN0YXRlO1xyXG4gIG9uQ2xvc2U6ICgpID0+IHZvaWQ7XHJcbiAgb25Eb25lOiAoKSA9PiB2b2lkO1xyXG4gIG9uQ29uZmlybUFjdGlvbj86ICgpID0+IFByb21pc2U8Ym9vbGVhbj47XHJcbn0+ID0gKHsgc3RhdGUsIG9uQ2xvc2UsIG9uRG9uZSwgb25Db25maXJtQWN0aW9uIH0pID0+IHtcblxuICBjb25zdCBkaWFsb2dSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2lubmVyLCBzZXRJbm5lcl0gPSB1c2VTdGF0ZTxNb2RhbFN0YXRlPihzdGF0ZSk7XG4gIGNvbnN0IGRvbmVUaW1lb3V0UmVmID0gdXNlUmVmPG51bWJlciB8IG51bGw+KG51bGwpO1xuICBjb25zdCBmb2N1c1RpbWVvdXRSZWYgPSB1c2VSZWY8bnVtYmVyIHwgbnVsbD4obnVsbCk7XG5cbiAgY29uc3Qgc3VjY2VlZCA9IChpY29uOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcsIHN1Yjogc3RyaW5nKSA9PiB7XG4gICAgc2V0SW5uZXIoeyB0eXBlOiAnc3VjY2VzcycsIGljb24sIHRpdGxlLCBzdWIgfSk7XG4gICAgaWYgKGRvbmVUaW1lb3V0UmVmLmN1cnJlbnQgIT09IG51bGwpIHtcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoZG9uZVRpbWVvdXRSZWYuY3VycmVudCk7XG4gICAgfVxuICAgIGRvbmVUaW1lb3V0UmVmLmN1cnJlbnQgPSB3aW5kb3cuc2V0VGltZW91dChvbkRvbmUsIDE0MDApO1xuICB9O1xuXHJcbiAgY29uc3QgaXNTdWNjZXNzID0gaW5uZXIudHlwZSA9PT0gJ3N1Y2Nlc3MnO1xyXG5cclxuICBjb25zdCBtb2RhbFRpdGxlID0gKCgpID0+IHtcclxuICAgIHN3aXRjaCAoaW5uZXIudHlwZSkge1xyXG4gICAgICBjYXNlICdyYXRpbmcnOlxyXG4gICAgICAgIHJldHVybiAnSG93IHdhcyB5b3VyIHRyaXA/JztcclxuICAgICAgY2FzZSAncmVwb3J0JzpcclxuICAgICAgICByZXR1cm4gJ1JlcG9ydCBhbiBJc3N1ZSc7XHJcbiAgICAgIGNhc2UgJ2NhbmNlbCc6XHJcbiAgICAgIGNhc2UgJ3N0YXJ0JzpcclxuICAgICAgICByZXR1cm4gaW5uZXIudGl0bGU7XHJcbiAgICAgIGNhc2UgJ2FjY2VwdCc6XHJcbiAgICAgICAgcmV0dXJuIGBBY2NlcHQgJHtpbm5lci5wYXNzZW5nZXJOYW1lfT9gO1xyXG4gICAgICBjYXNlICdkZW55JzpcclxuICAgICAgICByZXR1cm4gYERlbnkgJHtpbm5lci5wYXNzZW5nZXJOYW1lfT9gO1xyXG4gICAgICBjYXNlICdyZW1vdmUnOlxyXG4gICAgICAgIHJldHVybiBgUmVtb3ZlICR7aW5uZXIucGFzc2VuZ2VyTmFtZX0/YDtcclxuICAgICAgY2FzZSAnc3VjY2Vzcyc6XHJcbiAgICAgICAgcmV0dXJuIGlubmVyLnRpdGxlO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiAnRGlhbG9nJztcclxuICAgIH1cclxuICB9KSgpO1xyXG5cclxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGZvY3VzVGltZW91dFJlZi5jdXJyZW50ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4gZGlhbG9nUmVmLmN1cnJlbnQ/LmZvY3VzKCksIDApO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChmb2N1c1RpbWVvdXRSZWYuY3VycmVudCAhPT0gbnVsbCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KGZvY3VzVGltZW91dFJlZi5jdXJyZW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChkb25lVGltZW91dFJlZi5jdXJyZW50ICE9PSBudWxsKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoZG9uZVRpbWVvdXRSZWYuY3VycmVudCk7XG4gICAgICB9XG4gICAgfTtcbiAgfSwgW29uRG9uZV0pO1xuXHJcbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IG9uS2V5RG93biA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgIGlmIChlLmtleSAhPT0gJ0VzY2FwZScpIHJldHVybjtcclxuICAgICAgaWYgKGlzU3VjY2VzcykgcmV0dXJuO1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIG9uQ2xvc2UoKTtcclxuICAgIH07XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5RG93bik7XHJcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd24pO1xyXG4gIH0sIFtpc1N1Y2Nlc3MsIG9uQ2xvc2VdKTtcclxuXHJcbiAgY29uc3Qgc3JPbmx5OiBSZWFjdC5DU1NQcm9wZXJ0aWVzID0ge1xyXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICB3aWR0aDogMSxcclxuICAgIGhlaWdodDogMSxcclxuICAgIHBhZGRpbmc6IDAsXHJcbiAgICBtYXJnaW46IC0xLFxyXG4gICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxyXG4gICAgY2xpcDogJ3JlY3QoMCwgMCwgMCwgMCknLFxyXG4gICAgd2hpdGVTcGFjZTogJ25vd3JhcCcsXHJcbiAgICBib3JkZXI6IDAsXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDw+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmF0aW5nLW1vZGFsLW92ZXJsYXlcIiBvbkNsaWNrPXtpc1N1Y2Nlc3MgPyB1bmRlZmluZWQgOiBvbkNsb3NlfSAvPlxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgcmVmPXtkaWFsb2dSZWZ9XHJcbiAgICAgICAgY2xhc3NOYW1lPXtgcmF0aW5nLW1vZGFsJHtpc1N1Y2Nlc3MgPyAnIHJhdGluZy1tb2RhbC1zdWJtaXR0ZWQnIDogJyd9YH1cclxuICAgICAgICByb2xlPVwiZGlhbG9nXCJcclxuICAgICAgICBhcmlhLW1vZGFsPVwidHJ1ZVwiXHJcbiAgICAgICAgYXJpYS1sYWJlbGxlZGJ5PVwiYWN0aXZpdHktbW9kYWwtdGl0bGVcIlxyXG4gICAgICAgIHRhYkluZGV4PXstMX1cclxuICAgICAgPlxyXG4gICAgICAgIDxoMiBpZD1cImFjdGl2aXR5LW1vZGFsLXRpdGxlXCIgc3R5bGU9e3NyT25seX0+e21vZGFsVGl0bGV9PC9oMj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJhdGluZy1tb2RhbC1oYW5kbGUtYXJlYVwiPjxkaXYgY2xhc3NOYW1lPVwic2hlZXQtaGFuZGxlXCIgLz48L2Rpdj5cclxuXHJcbiAgICAgICAge2lzU3VjY2VzcyAmJiBpbm5lci50eXBlID09PSAnc3VjY2VzcycgPyAoXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJhdGluZy1zdWNjZXNzXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmF0aW5nLXN1Y2Nlc3MtaWNvblwiIHN0eWxlPXt7IGZvbnRTaXplOiA0MCB9fT57aW5uZXIuaWNvbn08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyYXRpbmctc3VjY2Vzcy10aXRsZVwiPntpbm5lci50aXRsZX08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyYXRpbmctc3VjY2Vzcy1zdWJcIj57aW5uZXIuc3VifTwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKSA6IGlubmVyLnR5cGUgPT09ICdyYXRpbmcnID8gKFxyXG4gICAgICAgICAgPFJhdGluZ1VJIHRhcmdldD17aW5uZXIudGFyZ2V0fSBvblN1Ym1pdD17YXN5bmMgKHN0YXJzKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh7XHJcbiAgICAgICAgICAgICAgICByaWRlX2lkOiBTdHJpbmcoaW5uZXIucmlkZUlkKSxcclxuICAgICAgICAgICAgICAgIHJldmlld2VkX3VzZXJfaWQ6IGlubmVyLnJldmlld2VkVXNlcklkLFxyXG4gICAgICAgICAgICAgICAgcmF0aW5nOiBTdHJpbmcoc3RhcnMpLFxyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIGF3YWl0IGFwaUZldGNoKGByYXRpbmdzLz8ke3BhcmFtcy50b1N0cmluZygpfWAsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgICAgICAgICAgc3VjY2VlZCgn4q2QJywgJ1JhdGluZyBTdWJtaXR0ZWQhJywgJ1RoYW5rcyBmb3IgeW91ciBmZWVkYmFjaycpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xyXG4gICAgICAgICAgICAgIC8vIFN0aWxsIHNob3cgc3VjY2VzcyBvbiBkdXBsaWNhdGUgKGFscmVhZHkgcmF0ZWQpIHRvIGF2b2lkIGNvbmZ1c2lvblxyXG4gICAgICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGVycj8uc3RhdHVzID8/IGVycj8ucmVzcG9uc2U/LnN0YXR1cztcclxuICAgICAgICAgICAgICBpZiAoc3RhdHVzID09PSA0MDkpIHtcclxuICAgICAgICAgICAgICAgIHN1Y2NlZWQoJ+KtkCcsICdBbHJlYWR5IFJhdGVkJywgJ1lvdSBoYXZlIGFscmVhZHkgcmF0ZWQgdGhpcyBwZXJzb24gZm9yIHRoaXMgcmlkZScpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzdWNjZWVkKCfimqDvuI8nLCAnQ291bGQgbm90IHN1Ym1pdCcsIGVycj8ubWVzc2FnZSB8fCAnU29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH19IG9uQ2xvc2U9e29uQ2xvc2V9IC8+XHJcbiAgICAgICAgKSA6IGlubmVyLnR5cGUgPT09ICdyZXBvcnQnID8gKFxyXG4gICAgICAgICAgPFJlcG9ydFVJIG9uU3VibWl0PXsoKSA9PiBzdWNjZWVkKCfinIUnLCAnUmVwb3J0IFNlbnQnLCAnVGhhbmtzIGZvciBsZXR0aW5nIHVzIGtub3cg4oCUIHdlXFwnbGwgbG9vayBpbnRvIGl0Jyl9IG9uQ2xvc2U9e29uQ2xvc2V9IC8+XHJcbiAgICAgICAgKSA6IGlubmVyLnR5cGUgPT09ICdjYW5jZWwnID8gKFxyXG4gICAgICAgICAgPENvbmZpcm1VSVxyXG4gICAgICAgICAgICBpY29uPVwi8J+aq1wiIGljb25Db2xvcj1cIiNkMzJmMmZcIiB0aXRsZT17aW5uZXIudGl0bGV9IGJvZHk9e2lubmVyLmJvZHl9XHJcbiAgICAgICAgICAgIGNvbmZpcm1MYWJlbD1cIlllcywgQ2FuY2VsXCIgY29uZmlybUNscz1cImJ0bi1jb25maXJtLWNhbmNlbFwiXHJcbiAgICAgICAgICAgIG9uQ29uZmlybT17YXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChvbkNvbmZpcm1BY3Rpb24pIHsgY29uc3Qgb2sgPSBhd2FpdCBvbkNvbmZpcm1BY3Rpb24oKTsgaWYgKCFvaykgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgICAgc3VjY2VlZCgn8J+aqycsICdUcmlwIENhbmNlbGxlZCcsICdZb3VyIHRyaXAgaGFzIGJlZW4gY2FuY2VsbGVkIHN1Y2Nlc3NmdWxseScpO1xyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICBvbkNsb3NlPXtvbkNsb3NlfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICApIDogaW5uZXIudHlwZSA9PT0gJ3N0YXJ0JyA/IChcclxuICAgICAgICAgIDxDb25maXJtVUlcclxuICAgICAgICAgICAgaWNvbj1cIvCfj4FcIiBpY29uQ29sb3I9XCIjZDMyZjJmXCIgdGl0bGU9e2lubmVyLnRpdGxlfSBib2R5PXtpbm5lci5ib2R5fVxyXG4gICAgICAgICAgICBjb25maXJtTGFiZWw9XCJZZXMsIFN0YXJ0XCIgY29uZmlybUNscz1cImJ0bi1jb25maXJtLWFjY2VwdFwiXHJcbiAgICAgICAgICAgIG9uQ29uZmlybT17YXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChvbkNvbmZpcm1BY3Rpb24pIHsgY29uc3Qgb2sgPSBhd2FpdCBvbkNvbmZpcm1BY3Rpb24oKTsgaWYgKCFvaykgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgICAgc3VjY2VlZCgn8J+PgScsICdUcmlwIFN0YXJ0ZWQnLCAnWW91ciB0cmlwIGhhcyBzdGFydGVkIHN1Y2Nlc3NmdWxseScpO1xyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICBvbkNsb3NlPXtvbkNsb3NlfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICApIDogaW5uZXIudHlwZSA9PT0gJ2FjY2VwdCcgPyAoXHJcbiAgICAgICAgICA8Q29uZmlybVVJXHJcbiAgICAgICAgICAgIGljb249XCLinIVcIiBpY29uQ29sb3I9XCIjNGFkZTgwXCIgdGl0bGU9e2BBY2NlcHQgJHtpbm5lci5wYXNzZW5nZXJOYW1lfT9gfSBib2R5PXtgJHtpbm5lci5wYXNzZW5nZXJOYW1lfSB3aWxsIGJlIG5vdGlmaWVkIHRoYXQgdGhlaXIgcmVxdWVzdCBoYXMgYmVlbiBhY2NlcHRlZC5gfVxyXG4gICAgICAgICAgICBjb25maXJtTGFiZWw9XCJBY2NlcHQgUmVxdWVzdFwiIGNvbmZpcm1DbHM9XCJidG4tY29uZmlybS1hY2NlcHRcIlxyXG4gICAgICAgICAgICBvbkNvbmZpcm09e2FzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICBpZiAob25Db25maXJtQWN0aW9uKSB7IGNvbnN0IG9rID0gYXdhaXQgb25Db25maXJtQWN0aW9uKCk7IGlmICghb2spIHJldHVybjsgfVxyXG4gICAgICAgICAgICAgIHN1Y2NlZWQoJ+KchScsICdSZXF1ZXN0IEFjY2VwdGVkIScsIGAke2lubmVyLnBhc3Nlbmdlck5hbWV9IGhhcyBiZWVuIGFkZGVkIHRvIHlvdXIgdHJpcGApO1xyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICBvbkNsb3NlPXtvbkNsb3NlfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICApIDogaW5uZXIudHlwZSA9PT0gJ2RlbnknID8gKFxyXG4gICAgICAgICAgPENvbmZpcm1VSVxyXG4gICAgICAgICAgICBpY29uPVwi4p2MXCIgaWNvbkNvbG9yPVwiI2QzMmYyZlwiIHRpdGxlPXtgRGVueSAke2lubmVyLnBhc3Nlbmdlck5hbWV9P2B9IGJvZHk9e2Ake2lubmVyLnBhc3Nlbmdlck5hbWV9IHdpbGwgYmUgbm90aWZpZWQgdGhhdCB0aGVpciByZXF1ZXN0IGhhcyBiZWVuIGRlY2xpbmVkLmB9XHJcbiAgICAgICAgICAgIGNvbmZpcm1MYWJlbD1cIkRlbnkgUmVxdWVzdFwiIGNvbmZpcm1DbHM9XCJidG4tY29uZmlybS1jYW5jZWxcIlxyXG4gICAgICAgICAgICBvbkNvbmZpcm09e2FzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICBpZiAob25Db25maXJtQWN0aW9uKSB7IGNvbnN0IG9rID0gYXdhaXQgb25Db25maXJtQWN0aW9uKCk7IGlmICghb2spIHJldHVybjsgfVxyXG4gICAgICAgICAgICAgIHN1Y2NlZWQoJ+KdjCcsICdSZXF1ZXN0IERlbmllZCcsIGAke2lubmVyLnBhc3Nlbmdlck5hbWV9J3MgcmVxdWVzdCBoYXMgYmVlbiBkZWNsaW5lZGApO1xyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICBvbkNsb3NlPXtvbkNsb3NlfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICApIDogaW5uZXIudHlwZSA9PT0gJ3JlbW92ZScgPyAoXHJcbiAgICAgICAgICA8Q29uZmlybVVJXHJcbiAgICAgICAgICAgIGljb249XCLwn5eRXCIgaWNvbkNvbG9yPVwiI2QzMmYyZlwiIHRpdGxlPXtgUmVtb3ZlICR7aW5uZXIucGFzc2VuZ2VyTmFtZX0/YH0gYm9keT17YCR7aW5uZXIucGFzc2VuZ2VyTmFtZX0gd2lsbCBiZSByZW1vdmVkIGZyb20geW91ciB0cmlwIGFuZCBub3RpZmllZC5gfVxyXG4gICAgICAgICAgICBjb25maXJtTGFiZWw9XCJSZW1vdmUgUGFzc2VuZ2VyXCIgY29uZmlybUNscz1cImJ0bi1jb25maXJtLWNhbmNlbFwiXHJcbiAgICAgICAgICAgIG9uQ29uZmlybT17YXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChvbkNvbmZpcm1BY3Rpb24pIHsgY29uc3Qgb2sgPSBhd2FpdCBvbkNvbmZpcm1BY3Rpb24oKTsgaWYgKCFvaykgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgICAgc3VjY2VlZCgn8J+Xke+4jycsICdQYXNzZW5nZXIgUmVtb3ZlZCcsIGAke2lubmVyLnBhc3Nlbmdlck5hbWV9IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB5b3VyIHRyaXBgKTtcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgb25DbG9zZT17b25DbG9zZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgKSA6IG51bGx9XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC8+XHJcbiAgKTtcclxufTtcclxuXHJcbi8vIFBhc3NlbmdlciBDYXJvdXNlbFxyXG50eXBlIFBhc3NlbmdlciA9IHtcclxuICBpZDogbnVtYmVyO1xyXG4gIHByb2ZpbGVJZD86IHN0cmluZztcclxuICByaWRlSWQ/OiBudW1iZXI7XHJcbiAgbmFtZTogc3RyaW5nO1xyXG4gIHJhdGluZz86IG51bWJlcjtcclxuICBwaWNrdXBMb2NhdGlvbj86IHN0cmluZztcclxuICBjb3N0Pzogc3RyaW5nO1xyXG4gIHJhdGVkPzogYm9vbGVhbjtcclxuICB0cmlwcmF0ZWQ/OiBudW1iZXI7XHJcbn07XHJcblxyXG5jb25zdCBQYXNzZW5nZXJDYXJvdXNlbDogUmVhY3QuRkM8e1xyXG4gIHBhc3NlbmdlcnM6IFBhc3NlbmdlcltdOyBpc1Bhc3Q6IGJvb2xlYW47XHJcbiAgb25SYXRlUGFzc2VuZ2VyPzogKHA6IFBhc3NlbmdlcikgPT4gdm9pZDtcclxuICBvblJlbW92ZVBhc3Nlbmdlcj86IChwOiBQYXNzZW5nZXIpID0+IHZvaWQ7XHJcbiAgb25NZXNzYWdlPzogKHA6IFBhc3NlbmdlcikgPT4gdm9pZDtcclxufT4gPSAoeyBwYXNzZW5nZXJzLCBpc1Bhc3QsIG9uUmF0ZVBhc3Nlbmdlciwgb25SZW1vdmVQYXNzZW5nZXIsIG9uTWVzc2FnZSB9KSA9PiB7XHJcbiAgY29uc3QgW2lkeCwgc2V0SWR4XSA9IHVzZVN0YXRlKDApO1xyXG5cclxuICBpZiAoIXBhc3NlbmdlcnMgfHwgcGFzc2VuZ2Vycy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFzc2VuZ2VyLWNhcmRcIiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgcGFkZGluZzogJzI0cHgnLCBjb2xvcjogJ3ZhcigtLXRleHQtbGFiZWwpJywgZm9udFNpemU6ICcxNHB4JyB9fT5cclxuICAgICAgICBObyBwYXNzZW5nZXJzIHlldC5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcCA9IHBhc3NlbmdlcnNbaWR4XTtcclxuICBjb25zdCB0b3RhbCA9IHBhc3NlbmdlcnMubGVuZ3RoO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJwYXNzZW5nZXItY2Fyb3VzZWxcIj5cclxuICAgICAge3RvdGFsID4gMSAmJiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXNzZW5nZXItdGFic1wiPlxyXG4gICAgICAgICAge3Bhc3NlbmdlcnMubWFwKChwYXNzLCBpKSA9PiAoXHJcbiAgICAgICAgICAgIDxidXR0b24ga2V5PXtwYXNzLmlkfVxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHBhc3Nlbmdlci10YWIke2kgIT09IGlkeCA/ICcgcGFzc2VuZ2VyLXRhYi1hY3RpdmUnIDogJyd9YH1cclxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRJZHgoaSl9PlxyXG4gICAgICAgICAgICAgIHtwYXNzLm5hbWUuc3BsaXQoJyAnKVswXX1cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICApKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFzc2VuZ2VyLWNhcmRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhc3Nlbmdlci1jYXJkLWhlYWRlclwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXNzZW5nZXItYXZhdGFyXCI+e3AubmFtZVswXX08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFzc2VuZ2VyLWluZm9cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXNzZW5nZXItbmFtZVwiPntwLm5hbWV9PC9kaXY+XHJcbiAgICAgICAgICAgIHtwLnJhdGluZyAhPT0gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgPyA8ZGl2IGNsYXNzTmFtZT1cInBhc3Nlbmdlci1yYXRpbmdcIj7irZAge3AucmF0aW5nfTwvZGl2PlxyXG4gICAgICAgICAgICAgIDogPGRpdiBjbGFzc05hbWU9XCJwYXNzZW5nZXItcmF0aW5nIG5vLXJhdGluZ1wiPk5vIHJhdGluZyB5ZXQ8L2Rpdj5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2hlZXQtZGV0YWlscy1jYXJkIHBhc3Nlbmdlci1kZXRhaWxzXCI+XHJcbiAgICAgICAgICA8RGV0YWlsUm93IGxhYmVsPVwiUGljayBVcFwiIHZhbHVlPXtwLnBpY2t1cExvY2F0aW9ufSAvPlxyXG4gICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkNvc3RcIiB2YWx1ZT1cIsKjMi4wMFwiIHZhbHVlQ2xhc3M9XCJkZXRhaWwtcHJpY2VcIiAvPlxyXG4gICAgICAgICAge2lzUGFzdCAmJiBwLnJhdGVkICYmIChcclxuICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIlRyaXAgUmF0aW5nXCIgdmFsdWU9e2DirZAgJHtwLnRyaXByYXRlZH1gfSB2YWx1ZUNsYXNzPVwicGFzc2VuZ2VyLXJhdGluZ1wiIC8+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhc3Nlbmdlci1hY3Rpb25zXCI+XHJcbiAgICAgICAgICA8QnRuIGNscz1cImJ0bi1tZXNzYWdlXCIgaWNvbj17SWNvbnMubWVzc2FnZX0gbGFiZWw9XCJNZXNzYWdlXCIgc21hbGwgb25DbGljaz17KCkgPT4gb25NZXNzYWdlPy4ocCl9IC8+XHJcbiAgICAgICAgICB7aXNQYXN0ID8gKFxyXG4gICAgICAgICAgICA8PlxyXG4gICAgICAgICAgICAgIHshcC5yYXRlZCAmJiA8QnRuIGNscz1cImJ0bi1yYXRlXCIgaWNvbj17SWNvbnMuc3Rhcn0gbGFiZWw9XCJSYXRlXCIgc21hbGwgb25DbGljaz17KCkgPT4gb25SYXRlUGFzc2VuZ2VyPy4ocCl9IC8+fVxyXG4gICAgICAgICAgICA8Lz5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIDxCdG4gY2xzPVwiYnRuLWNhbmNlbFwiIGljb249e0ljb25zLnJlbW92ZX0gbGFiZWw9XCJSZW1vdmVcIiBzbWFsbCBvbkNsaWNrPXsoKSA9PiBvblJlbW92ZVBhc3Nlbmdlcj8uKHApfSAvPlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuLy8gVHJpcCBEZXRhaWxzIFBhbmVsXHJcbmNvbnN0IFRyaXBEZXRhaWxzUGFuZWw6IFJlYWN0LkZDPHtcclxuICB0cmlwOiBUcmlwOyBtb2RlOiAndXNlcicgfCAnRHJpdmVyJzsgb25DbG9zZTogKCkgPT4gdm9pZDtcclxuICBvbk9wZW5DaGF0PzogKHJpZGVJZDogc3RyaW5nLCBwYXJ0aWNpcGFudElkPzogc3RyaW5nKSA9PiB2b2lkO1xyXG4gIG9uUmlkZVN0YXJ0ZWQ/OiAoKSA9PiB2b2lkO1xyXG59PiA9ICh7IHRyaXAsIG9uQ2xvc2UsIG9uT3BlbkNoYXQsIG9uUmlkZVN0YXJ0ZWQsIG1vZGUgfSkgPT4ge1xuICBjb25zdCBbY2xvc2luZywgc2V0Q2xvc2luZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFttb2RhbCwgc2V0TW9kYWxdID0gdXNlU3RhdGU8TW9kYWxTdGF0ZSB8IG51bGw+KG51bGwpO1xuICBjb25zdCB0b3VjaFN0YXJ0WSA9IHVzZVJlZjxudW1iZXIgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW3JvdXRlRGF0YSwgc2V0Um91dGVEYXRhXSA9IHVzZVN0YXRlPGFueT4obnVsbCk7XG4gIGNvbnN0IGNsb3NlVGltZW91dFJlZiA9IHVzZVJlZjxudW1iZXIgfCBudWxsPihudWxsKTtcbiAgY29uc3QgcmlkZVN0YXJ0ZWRUaW1lb3V0UmVmID0gdXNlUmVmPG51bWJlciB8IG51bGw+KG51bGwpO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChjbG9zZVRpbWVvdXRSZWYuY3VycmVudCAhPT0gbnVsbCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KGNsb3NlVGltZW91dFJlZi5jdXJyZW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChyaWRlU3RhcnRlZFRpbWVvdXRSZWYuY3VycmVudCAhPT0gbnVsbCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHJpZGVTdGFydGVkVGltZW91dFJlZi5jdXJyZW50KTtcbiAgICAgIH1cbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgY29uc3QgY2xvc2UgPSAoKSA9PiB7XG4gICAgc2V0Q2xvc2luZyh0cnVlKTtcbiAgICBpZiAoY2xvc2VUaW1lb3V0UmVmLmN1cnJlbnQgIT09IG51bGwpIHtcbiAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoY2xvc2VUaW1lb3V0UmVmLmN1cnJlbnQpO1xuICAgIH1cbiAgICBjbG9zZVRpbWVvdXRSZWYuY3VycmVudCA9IHdpbmRvdy5zZXRUaW1lb3V0KG9uQ2xvc2UsIDMyMCk7XG4gIH07XG4gIGNvbnN0IG9wZW5Nb2RhbCA9IChtOiBNb2RhbFN0YXRlKSA9PiBzZXRNb2RhbChtKTtcbiAgY29uc3QgY2xvc2VNb2RhbCA9ICgpID0+IHNldE1vZGFsKG51bGwpO1xuICBjb25zdCBkb25lTW9kYWwgPSAoKSA9PiB7XG4gICAgY29uc3QgY29tcGxldGVkVHlwZSA9IG1vZGFsPy50eXBlO1xuICAgIHNldE1vZGFsKG51bGwpO1xuICAgIGNsb3NlKCk7XG4gICAgaWYgKGNvbXBsZXRlZFR5cGUgPT09ICdzdGFydCcpIHtcbiAgICAgIGlmIChyaWRlU3RhcnRlZFRpbWVvdXRSZWYuY3VycmVudCAhPT0gbnVsbCkge1xuICAgICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHJpZGVTdGFydGVkVGltZW91dFJlZi5jdXJyZW50KTtcbiAgICAgIH1cbiAgICAgIHJpZGVTdGFydGVkVGltZW91dFJlZi5jdXJyZW50ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4gb25SaWRlU3RhcnRlZD8uKCksIDMyMCk7XG4gICAgfVxuICB9O1xuXHJcbiAgY29uc3QgaGFuZGxlQWN0aW9uID0gYXN5bmMgKHR5cGU6ICdhY2NlcHQnIHwgJ2RlbnknIHwgJ2NhbmNlbEJvb2tpbmcnIHwgJ3JlbW92ZVBhc3NlbmdlcicgfCAnY2FuY2VsUmlkZScgfCAnc3RhcnRSaWRlJywgdGFyZ2V0SWQ6IG51bWJlcikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgbGV0IGVuZHBvaW50ID0gJyc7XHJcbiAgICAgIGxldCBtZXRob2QgPSAnREVMRVRFJztcclxuICAgICAgbGV0IGJvZHk6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ2FjY2VwdCc6IGVuZHBvaW50ID0gYGJvb2tpbmdzLyR7dGFyZ2V0SWR9L2FjY2VwdGA7IG1ldGhvZCA9ICdQVVQnOyBicmVhaztcclxuICAgICAgICBjYXNlICdkZW55JzpcclxuICAgICAgICBjYXNlICdjYW5jZWxCb29raW5nJzpcclxuICAgICAgICBjYXNlICdyZW1vdmVQYXNzZW5nZXInOiBlbmRwb2ludCA9IGBib29raW5ncy8ke3RhcmdldElkfWA7IG1ldGhvZCA9ICdERUxFVEUnOyBicmVhaztcclxuICAgICAgICBjYXNlICdjYW5jZWxSaWRlJzogZW5kcG9pbnQgPSBgcmlkZXMvJHt0YXJnZXRJZH1gOyBtZXRob2QgPSAnREVMRVRFJzsgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc3RhcnRSaWRlJzogZW5kcG9pbnQgPSBgcmlkZXMvJHt0YXJnZXRJZH1gOyBtZXRob2QgPSAnUFVUJzsgYm9keSA9IEpTT04uc3RyaW5naWZ5KHsgc3RhdHVzOiAnaW5fcHJvZ3Jlc3MnIH0pOyBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgYXdhaXQgYXBpRmV0Y2goZW5kcG9pbnQsIHtcclxuICAgICAgICBtZXRob2QsXHJcbiAgICAgICAgLi4uKGJvZHkgPyB7IGJvZHksIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9IH0gOiB7fSlcclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uVG91Y2hTdGFydCA9IChlOiBSZWFjdC5Ub3VjaEV2ZW50KSA9PiB7IHRvdWNoU3RhcnRZLmN1cnJlbnQgPSBlLnRvdWNoZXNbMF0uY2xpZW50WTsgfTtcclxuICBjb25zdCBvblRvdWNoRW5kID0gKGU6IFJlYWN0LlRvdWNoRXZlbnQpID0+IHtcclxuICAgIGlmICh0b3VjaFN0YXJ0WS5jdXJyZW50ICE9PSBudWxsICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHRvdWNoU3RhcnRZLmN1cnJlbnQgPiA4MCkgY2xvc2UoKTtcclxuICAgIHRvdWNoU3RhcnRZLmN1cnJlbnQgPSBudWxsO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHBhc3NlbmdlcnMgPSB0cmlwLnBhc3NlbmdlcnMgfHwgW107XHJcblxyXG4gIGNvbnN0IHJlbmRlckJvZHkgPSAoKSA9PiB7XHJcbiAgICBzd2l0Y2ggKHRyaXAuc3RhdHVzKSB7XHJcbiAgICAgIGNhc2UgJ3VwY29taW5nVXNlcic6XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgIDw+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2hlZXQtZGV0YWlscy1jYXJkXCI+XHJcbiAgICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkRyaXZlclwiIHZhbHVlPXt0cmlwLmRyaXZlcm5hbWUgPz8gJ1BlbmRpbmcnfSAvPlxyXG4gICAgICAgICAgICAgIDxEZXRhaWxSb3cgbGFiZWw9XCJEZXN0aW5hdGlvblwiIHZhbHVlPXt0cmlwLmRlc3RpbmF0aW9uID8/ICfigJQnfSAvPlxyXG4gICAgICAgICAgICAgIDxEZXRhaWxSb3cgbGFiZWw9XCJEYXRlICYgQXJyaXZhbFwiIHZhbHVlPXt0cmlwLnRpbWUgPz8gJ+KAlCd9IC8+XHJcbiAgICAgICAgICAgICAge3JvdXRlRGF0YT8udGltZXMgPyAoXHJcbiAgICAgICAgICAgICAgICA8RGV0YWlsUm93IGxhYmVsPVwiRXN0aW1hdGVkIFBpY2t1cFwiIHZhbHVlPXtcclxuICAgICAgICAgICAgICAgICAgcm91dGVEYXRhLnRpbWVzLnBpY2t1cHMuZmluZCgocDogYW55KSA9PiBwLmJvb2tpbmdfaWRzICYmIHAuYm9va2luZ19pZHMuaW5jbHVkZXModHJpcC5pZCkpPy5lc3RpbWF0ZWRfdGltZVxyXG4gICAgICAgICAgICAgICAgICAgID8gbmV3IERhdGUocm91dGVEYXRhLnRpbWVzLnBpY2t1cHMuZmluZCgocDogYW55KSA9PiBwLmJvb2tpbmdfaWRzICYmIHAuYm9va2luZ19pZHMuaW5jbHVkZXModHJpcC5pZCkpLmVzdGltYXRlZF90aW1lKS50b0xvY2FsZVRpbWVTdHJpbmcoW10sIHsgaG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0JyB9KVxyXG4gICAgICAgICAgICAgICAgICAgIDogXCJQZW5kaW5nXCJcclxuICAgICAgICAgICAgICAgIH0gLz5cclxuICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkVzdGltYXRlZCBQaWNrdXBcIiB2YWx1ZT1cIlBlbmRpbmdcIiAvPlxyXG4gICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkNvc3RcIiB2YWx1ZT1cIsKjMi4wMFwiIHZhbHVlQ2xhc3M9XCJkZXRhaWwtcHJpY2VcIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaGVldC1hY3Rpb25zXCI+XHJcbiAgICAgICAgICAgICAgPEJ0biBjbHM9XCJidG4tbWVzc2FnZVwiIGljb249e0ljb25zLm1lc3NhZ2V9IGxhYmVsPVwiTWVzc2FnZSBEcml2ZXJcIiBvbkNsaWNrPXsoKSA9PiB0cmlwLnJpZGVfaWQgJiYgb25PcGVuQ2hhdD8uKFN0cmluZyh0cmlwLnJpZGVfaWQpKX0gLz5cclxuICAgICAgICAgICAgICA8QnRuIGNscz1cImJ0bi1jYW5jZWxcIiBpY29uPXtJY29ucy5jYW5jZWx9IGxhYmVsPVwiQ2FuY2VsIFRyaXBcIlxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb3Blbk1vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2NhbmNlbCcsIHRpdGxlOiAnQ2FuY2VsIHRoaXMgdHJpcD8nLCBib2R5OiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGNhbmNlbCB5b3VyIHVwY29taW5nIHRyaXA/IFRoZSBkcml2ZXIgd2lsbCBiZSBub3RpZmllZC4nLFxyXG4gICAgICAgICAgICAgICAgICBhY3Rpb25UeXBlOiAnY2FuY2VsQm9va2luZycsIHRhcmdldElkOiB0cmlwLmlkXHJcbiAgICAgICAgICAgICAgICB9KX0gLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8Lz5cclxuICAgICAgICApO1xyXG5cclxuICAgICAgY2FzZSAncmVxdWVzdGVkJzpcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPD5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaGVldC1kZXRhaWxzLWNhcmRcIj5cclxuICAgICAgICAgICAgICA8RGV0YWlsUm93IGxhYmVsPVwiRHJpdmVyXCIgdmFsdWU9e3RyaXAuZHJpdmVybmFtZSA/PyAnUGVuZGluZyd9IC8+XHJcbiAgICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkRlc3RpbmF0aW9uXCIgdmFsdWU9e3RyaXAuZGVzdGluYXRpb24gPz8gJ+KAlCd9IC8+XHJcbiAgICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkJlIFRoZXJlIEZvclwiIHZhbHVlPXt0cmlwLnRpbWUgPz8gJ+KAlCd9IC8+XHJcbiAgICAgICAgICAgICAge3JvdXRlRGF0YT8udGltZXMgPyAoXHJcbiAgICAgICAgICAgICAgICA8RGV0YWlsUm93IGxhYmVsPVwiRXN0aW1hdGVkIFBpY2t1cFwiIHZhbHVlPXtcclxuICAgICAgICAgICAgICAgICAgcm91dGVEYXRhLnRpbWVzLnBpY2t1cHMuZmluZCgocDogYW55KSA9PiBwLmJvb2tpbmdfaWRzICYmIHAuYm9va2luZ19pZHMuaW5jbHVkZXModHJpcC5pZCkpPy5lc3RpbWF0ZWRfdGltZVxyXG4gICAgICAgICAgICAgICAgICAgID8gbmV3IERhdGUocm91dGVEYXRhLnRpbWVzLnBpY2t1cHMuZmluZCgocDogYW55KSA9PiBwLmJvb2tpbmdfaWRzICYmIHAuYm9va2luZ19pZHMuaW5jbHVkZXModHJpcC5pZCkpLmVzdGltYXRlZF90aW1lKS50b0xvY2FsZVRpbWVTdHJpbmcoW10sIHsgaG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0JyB9KVxyXG4gICAgICAgICAgICAgICAgICAgIDogXCJQZW5kaW5nXCJcclxuICAgICAgICAgICAgICAgIH0gLz5cclxuICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkVzdGltYXRlZCBQaWNrdXBcIiB2YWx1ZT1cIlBlbmRpbmdcIiAvPlxyXG4gICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkNvc3RcIiB2YWx1ZT1cIsKjMi4wMFwiIHZhbHVlQ2xhc3M9XCJkZXRhaWwtcHJpY2VcIiAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaGVldC1hY3Rpb25zXCI+XHJcbiAgICAgICAgICAgICAgPEJ0biBjbHM9XCJidG4tbWVzc2FnZVwiIGljb249e0ljb25zLm1lc3NhZ2V9IGxhYmVsPVwiTWVzc2FnZSBEcml2ZXJcIiBvbkNsaWNrPXsoKSA9PiB0cmlwLnJpZGVfaWQgJiYgb25PcGVuQ2hhdD8uKFN0cmluZyh0cmlwLnJpZGVfaWQpKX0gLz5cclxuICAgICAgICAgICAgICA8QnRuIGNscz1cImJ0bi1jYW5jZWxcIiBpY29uPXtJY29ucy5jYW5jZWx9IGxhYmVsPVwiQ2FuY2VsIFRyaXBcIlxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb3Blbk1vZGFsKHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2NhbmNlbCcsIHRpdGxlOiAnQ2FuY2VsIHRoaXMgcmVxdWVzdD8nLCBib2R5OiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGNhbmNlbCB5b3VyIHRyaXAgcmVxdWVzdD8gVGhlIGRyaXZlciB3aWxsIGJlIG5vdGlmaWVkLicsXHJcbiAgICAgICAgICAgICAgICAgIGFjdGlvblR5cGU6ICdjYW5jZWxCb29raW5nJywgdGFyZ2V0SWQ6IHRyaXAuaWRcclxuICAgICAgICAgICAgICAgIH0pfSAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvPlxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICBjYXNlICdwYXN0VXNlcic6XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgIDw+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2hlZXQtZGV0YWlscy1jYXJkXCI+XHJcbiAgICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkRyaXZlclwiIHZhbHVlPXt0cmlwLmRyaXZlcm5hbWUgPz8gJ+KAlCd9IC8+XHJcbiAgICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkRlc3RpbmF0aW9uXCIgdmFsdWU9e3RyaXAuZGVzdGluYXRpb24gPz8gJ+KAlCd9IC8+XHJcbiAgICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIlBpY2sgVXAgVGltZVwiIHZhbHVlPXt0cmlwLnRpbWUgPz8gJ+KAlCd9IC8+XHJcbiAgICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkFycml2YWwgVGltZVwiIHZhbHVlPXtyb3V0ZURhdGEgJiYgcm91dGVEYXRhLnRpbWVzICYmIHJvdXRlRGF0YS50aW1lcy5hcnJpdmFsID8gbmV3IERhdGUocm91dGVEYXRhLnRpbWVzLmFycml2YWwpLnRvTG9jYWxlVGltZVN0cmluZyhbXSwgeyBob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnIH0pIDogJ+KAlCd9IC8+XHJcbiAgICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkNvc3RcIiB2YWx1ZT1cIsKjMi4wMFwiIHZhbHVlQ2xhc3M9XCJkZXRhaWwtcHJpY2VcIiAvPlxyXG4gICAgICAgICAgICAgIHt0cmlwLnJhdGluZyAhPT0gdW5kZWZpbmVkICYmIDxEZXRhaWxSb3cgbGFiZWw9XCJZb3VyIFJhdGluZ1wiIHZhbHVlPXtg4q2QICR7dHJpcC5yYXRpbmd9YH0gLz59XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNoZWV0LWFjdGlvbnNcIj5cclxuICAgICAgICAgICAgICA8QnRuIGNscz1cImJ0bi1tZXNzYWdlXCIgaWNvbj17SWNvbnMubWVzc2FnZX0gbGFiZWw9XCJNZXNzYWdlIERyaXZlclwiIG9uQ2xpY2s9eygpID0+IHRyaXAucmlkZV9pZCAmJiBvbk9wZW5DaGF0Py4oU3RyaW5nKHRyaXAucmlkZV9pZCkpfSAvPlxyXG4gICAgICAgICAgICAgIHt0cmlwLnJhdGluZyA9PT0gdW5kZWZpbmVkICYmIHRyaXAuZHJpdmVyX3Byb2ZpbGVfaWQgJiYgdHJpcC5yaWRlX2lkICYmIChcclxuICAgICAgICAgICAgICAgIDxCdG4gY2xzPVwiYnRuLXJhdGVcIiBpY29uPXtJY29ucy5zdGFyfSBsYWJlbD1cIlJhdGUgVHJpcFwiXHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9wZW5Nb2RhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3JhdGluZycsXHJcbiAgICAgICAgICAgICAgICAgICAgcmlkZUlkOiB0cmlwLnJpZGVfaWQhLFxyXG4gICAgICAgICAgICAgICAgICAgIHJldmlld2VkVXNlcklkOiB0cmlwLmRyaXZlcl9wcm9maWxlX2lkISxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IHsgbmFtZTogdHJpcC5kcml2ZXJuYW1lID8/ICdZb3VyIERyaXZlcicsIHJvbGU6ICdkcml2ZXInIH1cclxuICAgICAgICAgICAgICAgICAgfSl9IC8+XHJcbiAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICA8QnRuIGNscz1cImJ0bi1yZXBvcnRcIiBpY29uPXtJY29ucy5yZXBvcnR9IGxhYmVsPVwiUmVwb3J0IElzc3VlXCIgb25DbGljaz17KCkgPT4gb3Blbk1vZGFsKHsgdHlwZTogJ3JlcG9ydCcgfSl9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC8+XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgIGNhc2UgJ3VwY29taW5nRHJpdmVyJzpcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPD5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaGVldC1kZXRhaWxzLWNhcmRcIj5cclxuICAgICAgICAgICAgICA8RGV0YWlsUm93IGxhYmVsPVwiRGVzdGluYXRpb25cIiB2YWx1ZT17dHJpcC5kZXN0aW5hdGlvbiA/PyAn4oCUJ30gLz5cclxuICAgICAgICAgICAgICA8RGV0YWlsUm93IGxhYmVsPVwiRGVwYXJ0dXJlXCIgdmFsdWU9e3JvdXRlRGF0YSAmJiByb3V0ZURhdGEudGltZXMgJiYgcm91dGVEYXRhLnRpbWVzLmRyaXZlcl9sZWF2ZSA/IG5ldyBEYXRlKHJvdXRlRGF0YS50aW1lcy5kcml2ZXJfbGVhdmUpLnRvTG9jYWxlVGltZVN0cmluZyhbXSwgeyBob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnIH0pIDogKHRyaXAudGltZSA/PyAn4oCUJyl9IC8+XHJcbiAgICAgICAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkVzdC4gQXJyaXZhbFwiIHZhbHVlPXtyb3V0ZURhdGEgJiYgcm91dGVEYXRhLnRpbWVzICYmIHJvdXRlRGF0YS50aW1lcy5hcnJpdmFsID8gbmV3IERhdGUocm91dGVEYXRhLnRpbWVzLmFycml2YWwpLnRvTG9jYWxlVGltZVN0cmluZyhbXSwgeyBob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnIH0pIDogJ+KAlCd9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhc3Nlbmdlci1zZWN0aW9uLWxhYmVsXCI+UGFzc2VuZ2VycyA8c3BhbiBjbGFzc05hbWU9XCJwYXNzZW5nZXItY291bnQtYmFkZ2VcIj57cGFzc2VuZ2Vycy5sZW5ndGh9PC9zcGFuPjwvZGl2PlxyXG4gICAgICAgICAgICA8UGFzc2VuZ2VyQ2Fyb3VzZWwgcGFzc2VuZ2Vycz17cGFzc2VuZ2Vyc30gaXNQYXN0PXtmYWxzZX0gb25SZW1vdmVQYXNzZW5nZXI9eyhwKSA9PiBvcGVuTW9kYWwoeyB0eXBlOiAncmVtb3ZlJywgcGFzc2VuZ2VyTmFtZTogcC5uYW1lLCBib29raW5nSWQ6IHAuaWQgfSl9IG9uTWVzc2FnZT17KHApID0+IHRyaXAucmlkZV9pZCAmJiBvbk9wZW5DaGF0Py4oU3RyaW5nKHRyaXAucmlkZV9pZCksIHAucHJvZmlsZUlkKX0gLz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaGVldC1hY3Rpb25zXCIgc3R5bGU9e3sgbWFyZ2luVG9wOiAxMiB9fT5cclxuICAgICAgICAgICAgICA8QnRuIGNscz1cImJ0bi1jYW5jZWxcIiBpY29uPXtJY29ucy5jYW5jZWx9IGxhYmVsPVwiQ2FuY2VsIFdob2xlIFRyaXBcIiBvbkNsaWNrPXsoKSA9PiBvcGVuTW9kYWwoeyB0eXBlOiAnY2FuY2VsJywgdGl0bGU6ICdDYW5jZWwgd2hvbGUgdHJpcD8nLCBib2R5OiAnVGhpcyB3aWxsIGNhbmNlbCB5b3VyIHRyaXAgZm9yIGFsbCBwYXNzZW5nZXJzLiBFdmVyeW9uZSB3aWxsIGJlIG5vdGlmaWVkLicsIGFjdGlvblR5cGU6ICdjYW5jZWxSaWRlJywgdGFyZ2V0SWQ6IHRyaXAucmlkZV9pZCEgfSl9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNoZWV0LWFjdGlvbnNcIiBzdHlsZT17eyBtYXJnaW5Ub3A6IDEyIH19PlxyXG4gICAgICAgICAgICAgIDxCdG4gY2xzPVwiYnRuLWFjY2VwdFwiIGljb249e0ljb25zLmFjY2VwdH0gbGFiZWw9XCJCZWdpbiBSaWRlXCIgb25DbGljaz17KCkgPT4gb3Blbk1vZGFsKHsgdHlwZTogJ3N0YXJ0JywgdGl0bGU6ICdTdGFydCB3aG9sZSB0cmlwPycsIGJvZHk6ICdUaGlzIHdpbGwgc3RhcnQgeW91ciB0cmlwIGFuZCBub3RpZnkgdXNlcnMuJywgdGFyZ2V0SWQ6IHRyaXAucmlkZV9pZCEgfSl9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC8+XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgIGNhc2UgJ3Bhc3NlbmdlclJlcXVlc3QnOlxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICA8PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNoZWV0LWRldGFpbHMtY2FyZFwiPlxyXG4gICAgICAgICAgICAgIDxEZXRhaWxSb3cgbGFiZWw9XCJQYXNzZW5nZXJcIiB2YWx1ZT17dHJpcC51c2VybmFtZSA/PyAn4oCUJ30gLz5cclxuICAgICAgICAgICAgICB7dHJpcC5yYXRpbmcgIT09IHVuZGVmaW5lZCAmJiA8RGV0YWlsUm93IGxhYmVsPVwiUmF0aW5nXCIgdmFsdWU9e2DirZAgJHt0cmlwLnJhdGluZ31gfSAvPn1cclxuICAgICAgICAgICAgICA8RGV0YWlsUm93IGxhYmVsPVwiRGVzdGluYXRpb25cIiB2YWx1ZT17dHJpcC5kZXN0aW5hdGlvbiA/PyAn4oCUJ30gLz5cclxuICAgICAgICAgICAgICA8RGV0YWlsUm93IGxhYmVsPVwiRHJvcCBPZmYgQnlcIiB2YWx1ZT17dHJpcC50aW1lID8/ICfigJQnfSAvPlxyXG4gICAgICAgICAgICAgIDxEZXRhaWxSb3cgbGFiZWw9XCJDb3N0XCIgdmFsdWU9XCLCozIuMDBcIiB2YWx1ZUNsYXNzPVwiZGV0YWlsLXByaWNlXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2hlZXQtYWN0aW9uc1wiPlxyXG4gICAgICAgICAgICAgIDxCdG4gY2xzPVwiYnRuLW1lc3NhZ2VcIiBpY29uPXtJY29ucy5tZXNzYWdlfSBsYWJlbD1cIk1lc3NhZ2UgUGFzc2VuZ2VyXCIgb25DbGljaz17KCkgPT4gdHJpcC5yaWRlX2lkICYmIG9uT3BlbkNoYXQ/LihTdHJpbmcodHJpcC5yaWRlX2lkKSwgdHJpcC5wYXNzZW5nZXJfcHJvZmlsZV9pZCl9IC8+XHJcbiAgICAgICAgICAgICAgPEJ0biBjbHM9XCJidG4tYWNjZXB0XCIgaWNvbj17SWNvbnMuYWNjZXB0fSBsYWJlbD1cIkFjY2VwdCBSZXF1ZXN0XCIgb25DbGljaz17KCkgPT4gb3Blbk1vZGFsKHsgdHlwZTogJ2FjY2VwdCcsIHBhc3Nlbmdlck5hbWU6IHRyaXAudXNlcm5hbWUgPz8gJ1Bhc3NlbmdlcicsIGJvb2tpbmdJZDogdHJpcC5pZCB9KX0gLz5cclxuICAgICAgICAgICAgICA8QnRuIGNscz1cImJ0bi1jYW5jZWxcIiBpY29uPXtJY29ucy5jYW5jZWx9IGxhYmVsPVwiRGVueSBSZXF1ZXN0XCIgb25DbGljaz17KCkgPT4gb3Blbk1vZGFsKHsgdHlwZTogJ2RlbnknLCBwYXNzZW5nZXJOYW1lOiB0cmlwLnVzZXJuYW1lID8/ICdQYXNzZW5nZXInLCBib29raW5nSWQ6IHRyaXAuaWQgfSl9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC8+XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgIGNhc2UgJ3Bhc3REcml2ZXInOlxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICA8PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNoZWV0LWRldGFpbHMtY2FyZFwiPlxyXG4gICAgICAgICAgICAgIDxEZXRhaWxSb3cgbGFiZWw9XCJEZXN0aW5hdGlvblwiIHZhbHVlPXt0cmlwLmRlc3RpbmF0aW9uID8/ICfigJQnfSAvPlxyXG4gICAgICAgICAgICAgIDxEZXRhaWxSb3cgbGFiZWw9XCJEZXBhcnR1cmVcIiB2YWx1ZT17cm91dGVEYXRhICYmIHJvdXRlRGF0YS50aW1lcyAmJiByb3V0ZURhdGEudGltZXMuZHJpdmVyX2xlYXZlID8gbmV3IERhdGUocm91dGVEYXRhLnRpbWVzLmRyaXZlcl9sZWF2ZSkudG9Mb2NhbGVUaW1lU3RyaW5nKFtdLCB7IGhvdXI6ICcyLWRpZ2l0JywgbWludXRlOiAnMi1kaWdpdCcgfSkgOiAodHJpcC50aW1lID8/ICfigJQnKX0gLz5cclxuICAgICAgICAgICAgICA8RGV0YWlsUm93IGxhYmVsPVwiQXJyaXZhbFwiIHZhbHVlPXtyb3V0ZURhdGEgJiYgcm91dGVEYXRhLnRpbWVzICYmIHJvdXRlRGF0YS50aW1lcy5hcnJpdmFsID8gbmV3IERhdGUocm91dGVEYXRhLnRpbWVzLmFycml2YWwpLnRvTG9jYWxlVGltZVN0cmluZyhbXSwgeyBob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnIH0pIDogJ+KAlCd9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhc3Nlbmdlci1zZWN0aW9uLWxhYmVsXCI+XHJcbiAgICAgICAgICAgICAgUGFzc2VuZ2VyczogPHNwYW4gY2xhc3NOYW1lPVwicGFzc2VuZ2VyLWNvdW50LWJhZGdlXCI+e3Bhc3NlbmdlcnMubGVuZ3RofTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxQYXNzZW5nZXJDYXJvdXNlbFxyXG4gICAgICAgICAgICAgIHBhc3NlbmdlcnM9e3Bhc3NlbmdlcnN9XHJcbiAgICAgICAgICAgICAgaXNQYXN0PXt0cnVlfVxyXG4gICAgICAgICAgICAgIG9uUmF0ZVBhc3Nlbmdlcj17KHApID0+IHAucHJvZmlsZUlkICYmIHRyaXAucmlkZV9pZCAmJiBvcGVuTW9kYWwoe1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3JhdGluZycsXHJcbiAgICAgICAgICAgICAgICByaWRlSWQ6IHRyaXAucmlkZV9pZCxcclxuICAgICAgICAgICAgICAgIHJldmlld2VkVXNlcklkOiBwLnByb2ZpbGVJZCxcclxuICAgICAgICAgICAgICAgIHRhcmdldDogeyBuYW1lOiBwLm5hbWUsIHJvbGU6ICdwYXNzZW5nZXInIH1cclxuICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgICBvbk1lc3NhZ2U9eyhwKSA9PiB0cmlwLnJpZGVfaWQgJiYgb25PcGVuQ2hhdD8uKFN0cmluZyh0cmlwLnJpZGVfaWQpLCBwLnByb2ZpbGVJZCl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2hlZXQtYWN0aW9uc1wiIHN0eWxlPXt7IG1hcmdpblRvcDogMTIgfX0+XHJcbiAgICAgICAgICAgICAgPEJ0biBjbHM9XCJidG4tcmVwb3J0XCIgaWNvbj17SWNvbnMucmVwb3J0fSBsYWJlbD1cIlJlcG9ydCBJc3N1ZVwiIG9uQ2xpY2s9eygpID0+IG9wZW5Nb2RhbCh7IHR5cGU6ICdyZXBvcnQnIH0pfSAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvPlxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICBkZWZhdWx0OiByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPD5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BzaGVldC1vdmVybGF5JHtjbG9zaW5nID8gJyBvdmVybGF5LWNsb3NpbmcnIDogJyd9YH0gb25DbGljaz17Y2xvc2V9IC8+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdHJpcC1zaGVldCR7Y2xvc2luZyA/ICcgc2hlZXQtY2xvc2luZycgOiAnJ31gfSBvblRvdWNoU3RhcnQ9e29uVG91Y2hTdGFydH0gb25Ub3VjaEVuZD17b25Ub3VjaEVuZH0+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaGVldC1oYW5kbGUtYXJlYVwiPjxkaXYgY2xhc3NOYW1lPVwic2hlZXQtaGFuZGxlXCIgLz48L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNoZWV0LXNjcm9sbFwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaGVldC1oZWFkZXJcIj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzaGVldC1iYWNrLWJ0blwiIG9uQ2xpY2s9e2Nsb3NlfT57SWNvbnMuYmFja30gQmFjazwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwic2hlZXQtdGl0bGVcIj5UcmlwIERldGFpbHM8L2gyPlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiA2MCB9fSAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAge3RyaXAucmlkZV9pZCA/IChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXAtY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgPFJpZGVSZW5kZXJNYXBcclxuICAgICAgICAgICAgICAgIHJpZGVJZD17dHJpcC5yaWRlX2lkfVxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0PVwiMjIwcHhcIlxyXG4gICAgICAgICAgICAgICAgaW50ZXJhY3RpdmU9e3RydWV9XHJcbiAgICAgICAgICAgICAgICBkcml2ZXJNb2RlPXttb2RlID09PSAnRHJpdmVyJ31cclxuICAgICAgICAgICAgICAgIG9uUm91dGVEYXRhPXtzZXRSb3V0ZURhdGF9XHJcbiAgICAgICAgICAgICAgICBleGlzdGluZ1BpY2t1cD17XHJcbiAgICAgICAgICAgICAgICAgIHRyaXAucGlja3VwX2xhdCAmJiB0cmlwLnBpY2t1cF9sbmdcclxuICAgICAgICAgICAgICAgICAgICA/IHsgbGF0OiB0cmlwLnBpY2t1cF9sYXQsIGxuZzogdHJpcC5waWNrdXBfbG5nIH1cclxuICAgICAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKSA6IDxNYXBQbGFjZWhvbGRlciAvPn1cclxuXHJcbiAgICAgICAgICB7cmVuZGVyQm9keSgpfVxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6IDMyIH19IC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAge21vZGFsICYmIChcclxuICAgICAgICA8TW9kYWxcclxuICAgICAgICAgIHN0YXRlPXttb2RhbH0gb25DbG9zZT17Y2xvc2VNb2RhbH0gb25Eb25lPXtkb25lTW9kYWx9XHJcbiAgICAgICAgICBvbkNvbmZpcm1BY3Rpb249e2FzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKG1vZGFsLnR5cGUgPT09ICdhY2NlcHQnIHx8IG1vZGFsLnR5cGUgPT09ICdkZW55JykgeyByZXR1cm4gYXdhaXQgaGFuZGxlQWN0aW9uKG1vZGFsLnR5cGUsIG1vZGFsLmJvb2tpbmdJZCk7IH1cclxuICAgICAgICAgICAgaWYgKG1vZGFsLnR5cGUgPT09ICdjYW5jZWwnKSB7IHJldHVybiBhd2FpdCBoYW5kbGVBY3Rpb24obW9kYWwuYWN0aW9uVHlwZSwgbW9kYWwudGFyZ2V0SWQpOyB9XHJcbiAgICAgICAgICAgIGlmIChtb2RhbC50eXBlID09PSAncmVtb3ZlJykgeyByZXR1cm4gYXdhaXQgaGFuZGxlQWN0aW9uKCdyZW1vdmVQYXNzZW5nZXInLCBtb2RhbC5ib29raW5nSWQpOyB9XHJcbiAgICAgICAgICAgIGlmIChtb2RhbC50eXBlID09PSAnc3RhcnQnKSB7IHJldHVybiBhd2FpdCBoYW5kbGVBY3Rpb24oJ3N0YXJ0UmlkZScsIG1vZGFsLnRhcmdldElkKTsgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgLz5cclxuICAgICAgKX1cclxuICAgIDwvPlxyXG4gICk7XHJcbn07XHJcblxyXG4vLyBUcmlwIFNlY3Rpb25cclxudHlwZSBUcmlwU2VjdGlvblByb3BzID0ge1xyXG4gIHRpdGxlOiBzdHJpbmc7IHRyaXBzOiBUcmlwW107IGVtcHR5VGl0bGU6IHN0cmluZzsgZW1wdHlTdWJ0aXRsZTogc3RyaW5nOyBlbXB0eUljb246IHN0cmluZztcclxuICBjb2xsYXBzaWJsZT86IGJvb2xlYW47IG1vZGU6ICd1c2VyJyB8ICdEcml2ZXInOyBvblRyaXBNb3JlOiAodDogVHJpcCkgPT4gdm9pZDsgc2hvd0ZpbHRlcj86IGJvb2xlYW47XHJcbn07XHJcblxyXG5jb25zdCBUcmlwU2VjdGlvbjogUmVhY3QuRkM8VHJpcFNlY3Rpb25Qcm9wcz4gPSAoe1xyXG4gIHRpdGxlLCB0cmlwcywgZW1wdHlUaXRsZSwgZW1wdHlTdWJ0aXRsZSwgZW1wdHlJY29uLCBjb2xsYXBzaWJsZSA9IGZhbHNlLCBvblRyaXBNb3JlLCBzaG93RmlsdGVyLFxyXG59KSA9PiB7XHJcbiAgY29uc3QgW2V4cGFuZGVkLCBzZXRFeHBhbmRlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW3NlbGVjdGVkRmlsdGVyLCBzZXRTZWxlY3RlZEZpbHRlcl0gPSB1c2VTdGF0ZSgnUmF0aW5nJyk7XHJcbiAgY29uc3QgW2ZpbHRlck9wZW4sIHNldEZpbHRlck9wZW5dID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gIGNvbnN0IHZpc2libGUgPSBjb2xsYXBzaWJsZSAmJiAhZXhwYW5kZWQgPyB0cmlwcy5zbGljZSgwLCAzKSA6IHRyaXBzO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwidWJlci1zZWN0aW9uXCI+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VjdGlvbi1oZWFkZXItcm93XCI+XHJcbiAgICAgICAgPGgyIGNsYXNzTmFtZT1cInNlY3Rpb24tdGl0bGVcIj57dGl0bGV9PC9oMj5cclxuICAgICAgICB7c2hvd0ZpbHRlciAmJiAoXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbHRlci1jb250YWluZXJcIj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJmaWx0ZXItYnV0dG9uXCIgb25DbGljaz17KCkgPT4gc2V0RmlsdGVyT3BlbihvID0+ICFvKX0+e3NlbGVjdGVkRmlsdGVyfSDilr48L2J1dHRvbj5cclxuICAgICAgICAgICAge2ZpbHRlck9wZW4gJiYgKFxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsdGVyLWRyb3Bkb3duXCI+XHJcbiAgICAgICAgICAgICAgICB7WydSYXRpbmcnLCAnRWFzZSddLm1hcChvcHQgPT4gKFxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGtleT17b3B0fSBjbGFzc05hbWU9XCJmaWx0ZXItb3B0aW9uXCIgb25DbGljaz17KCkgPT4geyBzZXRTZWxlY3RlZEZpbHRlcihvcHQpOyBzZXRGaWx0ZXJPcGVuKGZhbHNlKTsgfX0+e29wdH08L2Rpdj5cclxuICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKX1cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7dHJpcHMubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBhY3Rpdml0eS11cGNvbWluZy1jYXJkXCI+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdGl2aXR5LXVwY29taW5nLXRpdGxlXCI+e2VtcHR5VGl0bGV9PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0aXZpdHktdXBjb21pbmctc3VidGl0bGVcIj57ZW1wdHlTdWJ0aXRsZX08L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3Rpdml0eS11cGNvbWluZy1pY29uXCI+e2VtcHR5SWNvbn08L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKSA6IChcclxuICAgICAgICA8PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXN0LWxpc3RcIj5cclxuICAgICAgICAgICAge3Zpc2libGUuc2xpY2UoKS5yZXZlcnNlKCkubWFwKHRyaXAgPT4gKFxyXG4gICAgICAgICAgICAgIDxkaXYga2V5PXt0cmlwLmlkfSBjbGFzc05hbWU9XCJjYXJkIHRyaXAtcm93LWNhcmRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRyaXAtY2FyLWljb25cIj7wn5qXPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctdGV4dFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIHt0cmlwLmRlc3RpbmF0aW9uID8/IHRyaXAudXNlcm5hbWUgPz8gJ1RyaXAnfSAtIHt0cmlwLnRpbWVPbmx5ICYmIDxzcGFuIGNsYXNzTmFtZT1cInRyaXAtcm93LXRpbWVcIj57dHJpcC50aW1lT25seX08L3NwYW4+fVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctbWV0YVwiPnt0cmlwLmRhdGVPbmx5ID8/IHRyaXAudGltZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICB7dHJpcC5kcml2ZXJuYW1lICYmIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctbWV0YVwiPnt0cmlwLmRyaXZlcm5hbWV9PC9kaXY+fVxyXG4gICAgICAgICAgICAgICAgICAgIHt0cmlwLnVzZXJuYW1lICYmIHRyaXAudXNlcm5hbWUgIT09IHRyaXAuZHJpdmVybmFtZSAmJiA8ZGl2IGNsYXNzTmFtZT1cInRyaXAtcm93LW1ldGFcIj57dHJpcC51c2VybmFtZX08L2Rpdj59XHJcbiAgICAgICAgICAgICAgICAgICAge3RyaXAubnVtYmVyUGFzc2VuZ2VycyAhPT0gdW5kZWZpbmVkICYmIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctbWV0YVwiPlBhc3NlbmdlcnM6IHt0cmlwLm51bWJlclBhc3NlbmdlcnN9PC9kaXY+fVxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctcHJpY2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIHt0cmlwLnJhdGluZyAhPT0gdW5kZWZpbmVkICYmIDw+IOKAkyA8c3BhbiBjbGFzc05hbWU9XCJ0cmlwLXJvdy1yYXRpbmdcIj7irZAge3RyaXAucmF0aW5nfTwvc3Bhbj48Lz59XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInBpbGwgcGlsbC1zb2xpZCB0cmlwLXJvdy1idXR0b25cIiBvbkNsaWNrPXsoKSA9PiBvblRyaXBNb3JlKHRyaXApfT57dHJpcC5hY3Rpb259PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICB7Y29sbGFwc2libGUgJiYgdHJpcHMubGVuZ3RoID4gMyAmJiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VlLW1vcmUtY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzZWUtbW9yZS1idXR0b25cIiBvbkNsaWNrPXsoKSA9PiBzZXRFeHBhbmRlZChlID0+ICFlKX0+XHJcbiAgICAgICAgICAgICAgICB7ZXhwYW5kZWQgPyAnU2VlIGxlc3MnIDogJ1NlZSBtb3JlJ31cclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvPlxyXG4gICAgICApfVxyXG4gICAgPC9zZWN0aW9uPlxyXG4gICk7XHJcbn07XHJcblxyXG4vLyBBY3Rpdml0eSBQYWdlIExheW91dFxyXG50eXBlIEFjdGl2aXR5UGFnZVByb3BzID0ge1xyXG4gIGNhblVzZURyaXZlck1vZGU6IGJvb2xlYW47XHJcbiAgb25Ecml2ZXJTaWdudXA6ICgpID0+IHZvaWQ7XHJcbiAgb25PcGVuQ2hhdD86IChyaWRlSWQ6IHN0cmluZywgcGFydGljaXBhbnRJZD86IHN0cmluZykgPT4gdm9pZDtcclxuICBvblJpZGVTdGFydGVkPzogKCkgPT4gdm9pZDtcclxuICBtb2RlPzogJ3VzZXInIHwgJ0RyaXZlcic7XHJcbiAgb25Nb2RlQ2hhbmdlPzogKG1vZGU6ICd1c2VyJyB8ICdEcml2ZXInKSA9PiB2b2lkO1xyXG59O1xyXG5jb25zdCBBY3Rpdml0eVBhZ2U6IFJlYWN0LkZDPEFjdGl2aXR5UGFnZVByb3BzPiA9ICh7IGNhblVzZURyaXZlck1vZGUsIG9uRHJpdmVyU2lnbnVwLCBvbk9wZW5DaGF0LCBvblJpZGVTdGFydGVkLCBtb2RlLCBvbk1vZGVDaGFuZ2UgfSkgPT4ge1xyXG4gIGNvbnN0IFtpbnRlcm5hbE1vZGUsIHNldEludGVybmFsTW9kZV0gPSB1c2VTdGF0ZTwndXNlcicgfCAnRHJpdmVyJz4oJ3VzZXInKTtcclxuICBjb25zdCBjdXJyZW50TW9kZSA9IG1vZGUgPz8gaW50ZXJuYWxNb2RlO1xyXG4gIGNvbnN0IHNldEN1cnJlbnRNb2RlID0gKG5leHRNb2RlOiAndXNlcicgfCAnRHJpdmVyJykgPT4ge1xyXG4gICAgaWYgKG1vZGUgPT09IHVuZGVmaW5lZCkgeyBzZXRJbnRlcm5hbE1vZGUobmV4dE1vZGUpOyB9XHJcbiAgICBvbk1vZGVDaGFuZ2U/LihuZXh0TW9kZSk7XHJcbiAgfTtcclxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgaWYgKCFjYW5Vc2VEcml2ZXJNb2RlICYmIGN1cnJlbnRNb2RlID09PSAnRHJpdmVyJykgc2V0Q3VycmVudE1vZGUoJ3VzZXInKTtcclxuICB9LCBbY2FuVXNlRHJpdmVyTW9kZSwgY3VycmVudE1vZGVdKTtcclxuXHJcbiAgY29uc3QgW3NlbGVjdGVkVHJpcCwgc2V0U2VsZWN0ZWRUcmlwXSA9IHVzZVN0YXRlPFRyaXAgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbYm9va2luZ3MsIHNldEJvb2tpbmdzXSA9IHVzZVN0YXRlPFRyaXBbXT4oW10pO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xyXG5cclxuICBjb25zdCBmZXRjaEFjdGl2aXR5ID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgc2V0TG9hZGluZyh0cnVlKTtcclxuICAgIHNldEVycm9yKG51bGwpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZm9ybWF0VGltZSA9IChpc28/OiBzdHJpbmcpID0+IHtcclxuICAgICAgICBpZiAoIWlzbykgcmV0dXJuICdQZW5kaW5nJztcclxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoaXNvKTtcclxuICAgICAgICByZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZygnZW4tR0InLCB7IHdlZWtkYXk6ICdsb25nJywgZGF5OiAnbnVtZXJpYycsIG1vbnRoOiAnbG9uZycsIGhvdXI6ICcyLWRpZ2l0JywgbWludXRlOiAnMi1kaWdpdCcgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBmb3JtYXREYXRlT25seSA9IChpc28/OiBzdHJpbmcpID0+IHtcclxuICAgICAgICBpZiAoIWlzbykgcmV0dXJuICdQZW5kaW5nJztcclxuICAgICAgICBjb25zdCBkYXRlID0gbmV3IERhdGUoaXNvKTtcclxuICAgICAgICByZXR1cm4gZGF0ZS50b0xvY2FsZVN0cmluZygnZW4tR0InLCB7IHdlZWtkYXk6ICdsb25nJywgZGF5OiAnbnVtZXJpYycsIG1vbnRoOiAnbG9uZycgfSk7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBmb3JtYXRUaW1lT25seSA9IChpc28/OiBzdHJpbmcpID0+IHtcclxuICAgICAgICBpZiAoIWlzbykgcmV0dXJuICcnO1xyXG4gICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShpc28pO1xyXG4gICAgICAgIHJldHVybiBkYXRlLnRvTG9jYWxlU3RyaW5nKCdlbi1HQicsIHsgaG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0JyB9KTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmIChjdXJyZW50TW9kZSA9PT0gJ3VzZXInKSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGFwaUZldGNoPGFueT4oJ2Jvb2tpbmdzL21lJywgeyBtZXRob2Q6ICdHRVQnIH0pO1xyXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkOiBUcmlwW10gPSBkYXRhLm1hcCgoYjogYW55KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCByaWRlRGF0YSA9IGIucmlkZSB8fCB7fTtcclxuICAgICAgICAgIGNvbnN0IGRyaXZlck9iaiA9IHJpZGVEYXRhLmRyaXZlciB8fCB7fTtcclxuICAgICAgICAgIGNvbnN0IGRyaXZlck5hbWUgPSBkcml2ZXJPYmouZmlyc3RfbmFtZVxyXG4gICAgICAgICAgICA/IGAke2RyaXZlck9iai5maXJzdF9uYW1lfSAke2RyaXZlck9iai5sYXN0X25hbWV9YFxyXG4gICAgICAgICAgICA6IGIucGFzc2VuZ2VyX25hbWUgfHwgYFVzZXIgJHtiLnVzZXJfaWQ/LnN1YnN0cmluZygwLCA0KX1gO1xyXG5cclxuICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGlkOiBiLmlkLFxyXG4gICAgICAgICAgICByaWRlX2lkOiBiLnJpZGVfaWQsXHJcbiAgICAgICAgICAgIGRyaXZlcl9wcm9maWxlX2lkOiBkcml2ZXJPYmouaWQgPz8gcmlkZURhdGEuZHJpdmVyX2lkLFxyXG4gICAgICAgICAgICB1c2VybmFtZTogZHJpdmVyTmFtZSxcclxuICAgICAgICAgICAgZHJpdmVybmFtZTogZHJpdmVyTmFtZSxcclxuICAgICAgICAgICAgZGVzdGluYXRpb246IGIuZHJvcG9mZl9sb2NhdGlvbiB8fCByaWRlRGF0YS5kZXN0aW5hdGlvbiB8fCAnRGVzdGluYXRpb24nLFxyXG4gICAgICAgICAgICB0aW1lOiBmb3JtYXRUaW1lKGIucGlja3VwX3RpbWUgfHwgcmlkZURhdGEuZGVwYXJ0dXJlX3RpbWUpLFxyXG4gICAgICAgICAgICBkYXRlT25seTogZm9ybWF0RGF0ZU9ubHkoYi5waWNrdXBfdGltZSB8fCByaWRlRGF0YS5kZXBhcnR1cmVfdGltZSksXHJcbiAgICAgICAgICAgIHRpbWVPbmx5OiBmb3JtYXRUaW1lT25seShiLnBpY2t1cF90aW1lIHx8IHJpZGVEYXRhLmRlcGFydHVyZV90aW1lKSxcclxuICAgICAgICAgICAgcHJpY2U6IGDCozIuMDBgLFxyXG4gICAgICAgICAgICBzdGF0dXM6IGIuc3RhdHVzID09PSAncGVuZGluZycgPyAncmVxdWVzdGVkJyA6IGIuc3RhdHVzID09PSAnY29uZmlybWVkJyA/IChyaWRlRGF0YS5zdGF0dXMgPT09ICdpbl9wcm9ncmVzcycgPyAnYWN0aXZlVXNlcicgOiAndXBjb21pbmdVc2VyJykgOiBiLnN0YXR1cyA9PT0gJ2NvbXBsZXRlZCcgPyAncGFzdFVzZXInIDogJ2NhbmNlbGxlZCcsXHJcbiAgICAgICAgICAgIGFjdGlvbjogJ01vcmUnLCBwaWNrdXBfbGF0OiBiLnBpY2t1cF9sYXQsIHBpY2t1cF9sbmc6IGIucGlja3VwX2xuZ1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KS5maWx0ZXIoKHQ6IFRyaXApID0+IHQuc3RhdHVzICE9PSAnY2FuY2VsbGVkJyk7XHJcbiAgICAgICAgc2V0Qm9va2luZ3ModHJhbnNmb3JtZWQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHJpZGVzRGF0YSA9IGF3YWl0IGFwaUZldGNoPGFueT4oJ3JpZGVzL2RyaXZlci9kYXNoYm9hcmQnLCB7IG1ldGhvZDogJ0dFVCcgfSk7XHJcbiAgICAgICAgY29uc3QgZmluYWxEcml2ZXJBY3Rpdml0aWVzOiBUcmlwW10gPSBbXTtcclxuICAgICAgICByaWRlc0RhdGEuZm9yRWFjaCgocmlkZTogYW55KSA9PiB7XHJcbiAgICAgICAgICBmaW5hbERyaXZlckFjdGl2aXRpZXMucHVzaCh7XHJcbiAgICAgICAgICAgIGlkOiByaWRlLmlkLFxyXG4gICAgICAgICAgICByaWRlX2lkOiByaWRlLmlkLFxyXG4gICAgICAgICAgICBkZXN0aW5hdGlvbjogcmlkZS5kZXN0aW5hdGlvbixcclxuICAgICAgICAgICAgdGltZTogZm9ybWF0VGltZShyaWRlLmRlcGFydHVyZV90aW1lKSxcclxuICAgICAgICAgICAgZGF0ZU9ubHk6IGZvcm1hdERhdGVPbmx5KHJpZGUuZGVwYXJ0dXJlX3RpbWUpLFxyXG4gICAgICAgICAgICB0aW1lT25seTogZm9ybWF0VGltZU9ubHkocmlkZS5kZXBhcnR1cmVfdGltZSksXHJcbiAgICAgICAgICAgIHN0YXR1czogcmlkZS5zdGF0dXMgPT09ICdjb21wbGV0ZWQnID8gJ3Bhc3REcml2ZXInIDpcclxuICAgICAgICAgICAgICByaWRlLnN0YXR1cyA9PT0gJ2luX3Byb2dyZXNzJyA/ICdhY3RpdmVEcml2ZXInIDogJ3VwY29taW5nRHJpdmVyJyxcclxuICAgICAgICAgICAgYWN0aW9uOiAnTW9yZScsXHJcbiAgICAgICAgICAgIG51bWJlclBhc3NlbmdlcnM6IHJpZGUuYm9va2luZ3MuZmlsdGVyKFxyXG4gICAgICAgICAgICAgIChiOiBhbnkpID0+IGIuc3RhdHVzID09PSAnY29uZmlybWVkJyB8fCBiLnN0YXR1cyA9PT0gJ2NvbXBsZXRlZCdcclxuICAgICAgICAgICAgKS5sZW5ndGgsXHJcbiAgICAgICAgICAgIHBhc3NlbmdlcnM6IHJpZGUuYm9va2luZ3NcclxuICAgICAgICAgICAgICAuZmlsdGVyKChiOiBhbnkpID0+IGIuc3RhdHVzID09PSAnY29uZmlybWVkJyB8fCBiLnN0YXR1cyA9PT0gJ2NvbXBsZXRlZCcpXHJcbiAgICAgICAgICAgICAgLm1hcCgoYjogYW55KSA9PiAoe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGIuaWQsXHJcbiAgICAgICAgICAgICAgICBwcm9maWxlSWQ6IGIucGFzc2VuZ2VyPy5pZCA/PyBiLnBhc3Nlbmdlcl9pZCxcclxuICAgICAgICAgICAgICAgIHJpZGVJZDogcmlkZS5pZCxcclxuICAgICAgICAgICAgICAgIG5hbWU6IGIucGFzc2VuZ2VyID8gYCR7Yi5wYXNzZW5nZXIuZmlyc3RfbmFtZX0gJHtiLnBhc3Nlbmdlci5sYXN0X25hbWV9YCA6ICdVbmtub3duJyxcclxuICAgICAgICAgICAgICAgIHJhdGluZzogYi5wYXNzZW5nZXI/LnJpZGVyX3JhdGluZyAmJiBiLnBhc3Nlbmdlci5yaWRlcl9yYXRpbmcgPiAwID8gYi5wYXNzZW5nZXIucmlkZXJfcmF0aW5nIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICAgICAgcGlja3VwTG9jYXRpb246IGIucGlja3VwX2xvY2F0aW9uLFxyXG4gICAgICAgICAgICAgICAgY29zdDogYMKjMi4wMGAsXHJcbiAgICAgICAgICAgICAgICByYXRlZDogZmFsc2VcclxuICAgICAgICAgICAgICB9KSlcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHJpZGUuYm9va2luZ3MuZm9yRWFjaCgoYjogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChiLnN0YXR1cyA9PT0gJ3BlbmRpbmcnKSB7XHJcbiAgICAgICAgICAgICAgZmluYWxEcml2ZXJBY3Rpdml0aWVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGIuaWQsIHJpZGVfaWQ6IHJpZGUuaWQsIHBhc3Nlbmdlcl9wcm9maWxlX2lkOiBiLnBhc3Nlbmdlcj8uaWQgPz8gYi5wYXNzZW5nZXJfaWQsXHJcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogYi5wYXNzZW5nZXIgPyBgJHtiLnBhc3Nlbmdlci5maXJzdF9uYW1lfSAke2IucGFzc2VuZ2VyLmxhc3RfbmFtZX1gIDogJ1Vua25vd24gUGFzc2VuZ2VyJywgZGVzdGluYXRpb246IGIuZHJvcG9mZl9sb2NhdGlvbixcclxuICAgICAgICAgICAgICAgIHRpbWU6IGZvcm1hdFRpbWUoYi5waWNrdXBfdGltZSB8fCByaWRlLmRlcGFydHVyZV90aW1lKSwgZGF0ZU9ubHk6IGZvcm1hdERhdGVPbmx5KGIucGlja3VwX3RpbWUgfHwgcmlkZS5kZXBhcnR1cmVfdGltZSksIHRpbWVPbmx5OiBmb3JtYXRUaW1lT25seShiLnBpY2t1cF90aW1lIHx8IHJpZGUuZGVwYXJ0dXJlX3RpbWUpLFxyXG4gICAgICAgICAgICAgICAgcHJpY2U6IGDCozIuMDBgLCBzdGF0dXM6ICdwYXNzZW5nZXJSZXF1ZXN0JywgYWN0aW9uOiAnTW9yZScsIHBpY2t1cF9sYXQ6IGIucGlja3VwX2xhdCwgcGlja3VwX2xuZzogYi5waWNrdXBfbG5nLFxyXG4gICAgICAgICAgICAgICAgcmF0aW5nOiBiLnBhc3Nlbmdlcj8ucmlkZXJfcmF0aW5nICYmIGIucGFzc2VuZ2VyLnJpZGVyX3JhdGluZyA+IDAgPyBiLnBhc3Nlbmdlci5yaWRlcl9yYXRpbmcgOiB1bmRlZmluZWRcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2V0Qm9va2luZ3MoZmluYWxEcml2ZXJBY3Rpdml0aWVzKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICBzZXRFcnJvcihlcnIubWVzc2FnZSB8fCAnQW4gZXJyb3Igb2NjdXJyZWQnKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7IGZldGNoQWN0aXZpdHkoKTsgfSwgW2N1cnJlbnRNb2RlXSk7XHJcblxyXG4gIGNvbnN0IGRyaXZlclJlcXVlc3RzID0gYm9va2luZ3MuZmlsdGVyKGIgPT4gYi5zdGF0dXMgPT09ICdwYXNzZW5nZXJSZXF1ZXN0Jyk7XHJcbiAgY29uc3QgZHJpdmVyVXBjb21pbmcgPSBib29raW5ncy5maWx0ZXIoYiA9PiBiLnN0YXR1cyA9PT0gJ3VwY29taW5nRHJpdmVyJyk7XHJcbiAgY29uc3QgZHJpdmVyUGFzdCA9IGJvb2tpbmdzLmZpbHRlcihiID0+IGIuc3RhdHVzID09PSAncGFzdERyaXZlcicpO1xyXG5cclxuICBjb25zdCByaWRlclVwY29taW5nID0gYm9va2luZ3MuZmlsdGVyKGIgPT4gYi5zdGF0dXMgPT09ICd1cGNvbWluZ1VzZXInKTtcclxuICBjb25zdCByaWRlclJlcXVlc3RlZCA9IGJvb2tpbmdzLmZpbHRlcihiID0+IGIuc3RhdHVzID09PSAncmVxdWVzdGVkJyk7XHJcbiAgY29uc3QgcmlkZXJQYXN0ID0gYm9va2luZ3MuZmlsdGVyKGIgPT4gYi5zdGF0dXMgPT09ICdwYXN0VXNlcicpO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPD5cclxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJ1YmVyLWhlYWRlclwiPlxyXG4gICAgICAgIDxoMSBjbGFzc05hbWU9XCJhY3Rpdml0eS10aXRsZVwiPkFjdGl2aXR5PC9oMT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvcC10b2dnbGVcIj5cclxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtgdG9nZ2xlLXRhYiAke2N1cnJlbnRNb2RlID09PSAndXNlcicgPyAndG9nZ2xlLXRhYi1hY3RpdmUnIDogJyd9YH0gb25DbGljaz17KCkgPT4gc2V0Q3VycmVudE1vZGUoJ3VzZXInKX0+UmlkZXI8L2J1dHRvbj5cclxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtgdG9nZ2xlLXRhYiAke2N1cnJlbnRNb2RlID09PSAnRHJpdmVyJyA/ICd0b2dnbGUtdGFiLWFjdGl2ZScgOiAnJ31gfSBvbkNsaWNrPXsoKSA9PiB7IGlmICghY2FuVXNlRHJpdmVyTW9kZSkgcmV0dXJuIG9uRHJpdmVyU2lnbnVwKCk7IHNldEN1cnJlbnRNb2RlKCdEcml2ZXInKTsgfX0+RHJpdmVyPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvaGVhZGVyPlxyXG5cclxuICAgICAge2xvYWRpbmcgJiYgPHAgc3R5bGU9e3sgcGFkZGluZzogJzIwcHgnIH19PkxvYWRpbmcgYWN0aXZpdGllcy4uLjwvcD59XHJcbiAgICAgIHtlcnJvciAmJiA8cCBzdHlsZT17eyBwYWRkaW5nOiAnMjBweCcsIGNvbG9yOiAnI2ZmOTk5OScsIGZvbnRXZWlnaHQ6ICdib2xkJyB9fT5FcnJvcjoge2Vycm9yfTwvcD59XHJcblxyXG4gICAgICB7IWxvYWRpbmcgJiYgKFxyXG4gICAgICAgIDw+XHJcbiAgICAgICAgICA8VHJpcFNlY3Rpb24gdGl0bGU9XCJVcGNvbWluZ1wiIHRyaXBzPXtjdXJyZW50TW9kZSA9PT0gJ3VzZXInID8gcmlkZXJVcGNvbWluZyA6IGRyaXZlclVwY29taW5nfSBlbXB0eVRpdGxlPVwiWW91IGhhdmUgbm8gdXBjb21pbmcgdHJpcHNcIiBlbXB0eVN1YnRpdGxlPVwiUmVzZXJ2ZSB5b3VyIHRyaXAg4oaSXCIgZW1wdHlJY29uPVwi8J+ThVwiIGNvbGxhcHNpYmxlIG1vZGU9e2N1cnJlbnRNb2RlfSBvblRyaXBNb3JlPXtzZXRTZWxlY3RlZFRyaXB9IC8+XHJcbiAgICAgICAgICB7Y3VycmVudE1vZGUgPT09ICd1c2VyJyA/IChcclxuICAgICAgICAgICAgPFRyaXBTZWN0aW9uIHRpdGxlPVwiUmVxdWVzdGVkXCIgdHJpcHM9e3JpZGVyUmVxdWVzdGVkfSBlbXB0eVRpdGxlPVwiWW91IGhhdmUgbm8gcmVxdWVzdGVkIHRyaXBzXCIgZW1wdHlTdWJ0aXRsZT1cIkJvb2sgYSByZXNlcnZhdGlvbiDihpJcIiBlbXB0eUljb249XCLwn5eT77iPXCIgY29sbGFwc2libGUgbW9kZT17Y3VycmVudE1vZGV9IG9uVHJpcE1vcmU9e3NldFNlbGVjdGVkVHJpcH0gLz5cclxuICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgIDxUcmlwU2VjdGlvbiB0aXRsZT1cIlBhc3NlbmdlciBSZXF1ZXN0c1wiIHRyaXBzPXtkcml2ZXJSZXF1ZXN0c30gZW1wdHlUaXRsZT1cIllvdSBoYXZlIG5vIHJlcXVlc3RzXCIgZW1wdHlTdWJ0aXRsZT1cIlNvb24geW91ciByaWRlIHdpbGwgYmUgYm9va2VkXCIgZW1wdHlJY29uPVwi8J+Xk++4j1wiIGNvbGxhcHNpYmxlIG1vZGU9e2N1cnJlbnRNb2RlfSBvblRyaXBNb3JlPXtzZXRTZWxlY3RlZFRyaXB9IHNob3dGaWx0ZXIgLz5cclxuICAgICAgICAgICl9XHJcbiAgICAgICAgICA8VHJpcFNlY3Rpb24gdGl0bGU9XCJQYXN0XCIgdHJpcHM9e2N1cnJlbnRNb2RlID09PSAndXNlcicgPyByaWRlclBhc3QgOiBkcml2ZXJQYXN0fSBlbXB0eVRpdGxlPVwiTm8gcGFzdCB0cmlwcyB5ZXRcIiBlbXB0eVN1YnRpdGxlPVwiWW91ciBjb21wbGV0ZWQgcmlkZXMgd2lsbCBhcHBlYXIgaGVyZVwiIGVtcHR5SWNvbj1cIvCflZhcIiBjb2xsYXBzaWJsZSBtb2RlPXtjdXJyZW50TW9kZX0gb25UcmlwTW9yZT17c2V0U2VsZWN0ZWRUcmlwfSAvPlxyXG4gICAgICAgIDwvPlxyXG4gICAgICApfVxyXG5cclxuICAgICAge3NlbGVjdGVkVHJpcCAmJiAoXHJcbiAgICAgICAgPFRyaXBEZXRhaWxzUGFuZWwgdHJpcD17c2VsZWN0ZWRUcmlwfSBtb2RlPXtjdXJyZW50TW9kZX0gb25DbG9zZT17KCkgPT4geyBzZXRTZWxlY3RlZFRyaXAobnVsbCk7IGZldGNoQWN0aXZpdHkoKTsgfX0gb25PcGVuQ2hhdD17b25PcGVuQ2hhdH0gb25SaWRlU3RhcnRlZD17b25SaWRlU3RhcnRlZH0gLz5cclxuICAgICAgKX1cclxuICAgIDwvPlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBY3Rpdml0eVBhZ2U7XG4iXSwiZmlsZSI6IkM6L1VzZXJzL3lsYW5uL3ZzY29kZS9VbmkvU2FtdWRoeWFuUmlkZXMvZnJvbnRlbmQvc3JjL0FjdGl2aXR5UGFnZS50c3gifQ==