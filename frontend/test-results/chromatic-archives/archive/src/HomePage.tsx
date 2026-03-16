import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/HomePage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c85c9c72"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=c85c9c72"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useMemo = __vite__cjsImport1_react["useMemo"]; const useState = __vite__cjsImport1_react["useState"];
function loadSavedPlaces() {
  try {
    const raw = localStorage.getItem("savedPlaces");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function saveSavedPlaces(list) {
  localStorage.setItem("savedPlaces", JSON.stringify(list));
}
function genId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
function toDatetimeLocalNow() {
  const now = /* @__PURE__ */ new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
const HomePage = ({
  onRequestRide,
  onPostRide,
  canUseDriverMode = true,
  onDriverSignup,
  onOpenTimetable
}) => {
  _s();
  const [mode, setMode] = useState("user");
  const [savedPlaces, setSavedPlaces] = useState(() => loadSavedPlaces());
  const [showSavePlace, setShowSavePlace] = useState(false);
  const [placeForm, setPlaceForm] = useState({
    label: "",
    address: "",
    postcode: "",
    city: ""
  });
  const shortcuts = useMemo(() => savedPlaces, [savedPlaces]);
  const submitPlace = () => {
    if (!placeForm.address.trim() || !placeForm.postcode.trim()) return;
    const next = {
      id: genId(),
      label: placeForm.label.trim() || "Saved place",
      address: placeForm.address.trim(),
      postcode: placeForm.postcode.trim(),
      city: placeForm.city.trim() || void 0
    };
    const updated = [...savedPlaces, next];
    setSavedPlaces(updated);
    saveSavedPlaces(updated);
    setPlaceForm({ label: "", address: "", postcode: "", city: "" });
    setShowSavePlace(false);
  };
  const openShortcut = (destination) => {
    if (mode === "Driver") {
      onPostRide({ destination, arrivalDateTimeLocal: toDatetimeLocalNow() });
      return;
    }
    onRequestRide({ destination });
  };
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("header", { className: "uber-header", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "uber-logo", children: "SamudhyanRides" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
        lineNumber: 101,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "top-toggle", children: [
        /* @__PURE__ */ jsxDEV("button", { className: `toggle-tab ${mode === "user" ? "toggle-tab-active" : ""}`, onClick: () => setMode("user"), children: "Rides" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
          lineNumber: 104,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: `toggle-tab ${mode === "Driver" ? "toggle-tab-active" : ""}`,
            onClick: () => {
              if (!canUseDriverMode) {
                onDriverSignup();
                return;
              }
              setMode("Driver");
            },
            children: "Driver"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
            lineNumber: 107,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
        lineNumber: 103,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
      lineNumber: 100,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "home-body", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          className: "home-where-pill",
          onClick: () => {
            if (mode === "user") return onRequestRide();
            if (!canUseDriverMode) return onDriverSignup();
            return onPostRide();
          },
          children: [
            /* @__PURE__ */ jsxDEV("span", { className: "home-where-icon", children: "●" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
              lineNumber: 132,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "home-where-text", children: mode === "Driver" ? "Post a ride" : "Request a ride" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
              lineNumber: 133,
              columnNumber: 11
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
          lineNumber: 124,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "home-section", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "home-section-title", children: "Shortcuts" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
          lineNumber: 138,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "home-list-card", children: [
          /* @__PURE__ */ jsxDEV("button", { className: "home-list-row", onClick: () => openShortcut("University of Bath"), children: [
            /* @__PURE__ */ jsxDEV("div", { className: "home-list-icon", children: "🏫" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
              lineNumber: 143,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "home-list-text", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "home-list-title", children: "University of Bath" }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                lineNumber: 145,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "home-list-subtitle", children: "Claverton Down, Bath, BA2 7AY, GB" }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                lineNumber: 146,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
              lineNumber: 144,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "home-list-chevron", children: "›" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
              lineNumber: 148,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
            lineNumber: 142,
            columnNumber: 13
          }, this),
          shortcuts.map(
            (p) => /* @__PURE__ */ jsxDEV(
              "button",
              {
                className: "home-list-row",
                onClick: () => openShortcut(`${p.address}, ${p.postcode}${p.city ? `, ${p.city}` : ""}`),
                children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "home-list-icon", children: "📍" }, void 0, false, {
                    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                    lineNumber: 158,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "home-list-text", children: [
                    /* @__PURE__ */ jsxDEV("div", { className: "home-list-title", children: p.label }, void 0, false, {
                      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                      lineNumber: 160,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "home-list-subtitle", children: [
                      p.address,
                      ", ",
                      p.postcode,
                      p.city ? `, ${p.city}` : ""
                    ] }, void 0, true, {
                      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                      lineNumber: 161,
                      columnNumber: 19
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                    lineNumber: 159,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "home-list-chevron", children: "›" }, void 0, false, {
                    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                    lineNumber: 166,
                    columnNumber: 17
                  }, this)
                ]
              },
              p.id,
              true,
              {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                lineNumber: 153,
                columnNumber: 13
              },
              this
            )
          ),
          /* @__PURE__ */ jsxDEV("button", { className: "home-list-row home-list-row-add", onClick: () => setShowSavePlace(true), children: [
            /* @__PURE__ */ jsxDEV("div", { className: "home-list-icon", children: "＋" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
              lineNumber: 172,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "home-list-text", children: /* @__PURE__ */ jsxDEV("div", { className: "home-list-title", children: "Save a place" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
              lineNumber: 174,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
              lineNumber: 173,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
            lineNumber: 171,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
          lineNumber: 140,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
        lineNumber: 137,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "home-section", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "home-section-title", children: "Services" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
          lineNumber: 182,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "home-list-card", children: /* @__PURE__ */ jsxDEV("button", { className: "home-list-row", onClick: onOpenTimetable, children: [
          /* @__PURE__ */ jsxDEV("div", { className: "home-list-icon", children: "🗓️" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
            lineNumber: 186,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "home-list-text", children: /* @__PURE__ */ jsxDEV("div", { className: "home-list-title", children: "Timetable" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
            lineNumber: 188,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
            lineNumber: 187,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "home-list-chevron", children: "›" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
            lineNumber: 190,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
          lineNumber: 185,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
          lineNumber: 184,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
        lineNumber: 181,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
      lineNumber: 123,
      columnNumber: 7
    }, this),
    showSavePlace && /* @__PURE__ */ jsxDEV("div", { className: "modal-backdrop", onClick: () => setShowSavePlace(false), children: /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "modal-card",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "save-place-title",
        tabIndex: -1,
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxDEV("div", { id: "save-place-title", style: { fontWeight: 900, fontSize: 16, marginBottom: 10 }, children: "Save a place" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
            lineNumber: 207,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "modal-grid", children: [
            /* @__PURE__ */ jsxDEV("label", { className: "modal-field", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "Label (optional)" }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                lineNumber: 213,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  value: placeForm.label,
                  onChange: (e) => setPlaceForm((p) => ({ ...p, label: e.target.value })),
                  placeholder: "e.g. Home",
                  type: "text",
                  autoComplete: "off"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                  lineNumber: 214,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
              lineNumber: 212,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: "modal-field", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "Address" }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                lineNumber: 224,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  value: placeForm.address,
                  onChange: (e) => setPlaceForm((p) => ({ ...p, address: e.target.value })),
                  placeholder: "e.g. 12 Example Street",
                  type: "text",
                  autoComplete: "street-address"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                  lineNumber: 225,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
              lineNumber: 223,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: "modal-field", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "Postcode" }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                lineNumber: 235,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  value: placeForm.postcode,
                  onChange: (e) => setPlaceForm((p) => ({ ...p, postcode: e.target.value })),
                  placeholder: "e.g. BA2 7AY",
                  type: "text",
                  autoComplete: "postal-code"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                  lineNumber: 236,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
              lineNumber: 234,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("label", { className: "modal-field", children: [
              /* @__PURE__ */ jsxDEV("span", { children: "City (optional)" }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                lineNumber: 246,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV(
                "input",
                {
                  value: placeForm.city,
                  onChange: (e) => setPlaceForm((p) => ({ ...p, city: e.target.value })),
                  placeholder: "e.g. Bath",
                  type: "text",
                  autoComplete: "address-level2"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                  lineNumber: 247,
                  columnNumber: 17
                },
                this
              )
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
              lineNumber: 245,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
            lineNumber: 211,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }, children: [
            /* @__PURE__ */ jsxDEV("button", { type: "button", className: "sheet-action-btn btn-cancel", onClick: () => setShowSavePlace(false), children: "Cancel" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
              lineNumber: 258,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV(
              "button",
              {
                type: "button",
                className: "sheet-action-btn btn-accept",
                onClick: submitPlace,
                disabled: !placeForm.address.trim() || !placeForm.postcode.trim(),
                style: { opacity: !placeForm.address.trim() || !placeForm.postcode.trim() ? 0.55 : 1 },
                children: "Save"
              },
              void 0,
              false,
              {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
                lineNumber: 261,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
            lineNumber: 257,
            columnNumber: 13
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
        lineNumber: 199,
        columnNumber: 11
      },
      this
    ) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
      lineNumber: 198,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx",
    lineNumber: 99,
    columnNumber: 5
  }, this);
};
_s(HomePage, "7hJ0xx1Ij+boaoD3WiOXbZRqToU=");
_c = HomePage;
export default HomePage;
var _c;
$RefreshReg$(_c, "HomePage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/HomePage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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U0FBU1E7QUFBQUEsZ0JBQ1QsVUFBVSxDQUFDUCxVQUFVRyxRQUFRSyxLQUFLLEtBQUssQ0FBQ1IsVUFBVUksU0FBU0ksS0FBSztBQUFBLGdCQUNoRSxPQUFPLEVBQUVxQixTQUFTLENBQUM3QixVQUFVRyxRQUFRSyxLQUFLLEtBQUssQ0FBQ1IsVUFBVUksU0FBU0ksS0FBSyxJQUFJLE9BQU8sRUFBRTtBQUFBLGdCQUFFO0FBQUE7QUFBQSxjQUx6RjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFRQTtBQUFBLGVBWkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFhQTtBQUFBO0FBQUE7QUFBQSxNQXZFRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUF3RUEsS0F6RUY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQTBFQTtBQUFBLE9BN0tKO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0ErS0E7QUFFSjtBQUFFZixHQW5PSU4sVUFBaUM7QUFBQTJDLEtBQWpDM0M7QUFxT04sZUFBZUE7QUFBUyxJQUFBMkM7QUFBQUMsYUFBQUQsSUFBQSIsIm5hbWVzIjpbIlJlYWN0IiwidXNlTWVtbyIsInVzZVN0YXRlIiwibG9hZFNhdmVkUGxhY2VzIiwicmF3IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInBhcnNlZCIsIkpTT04iLCJwYXJzZSIsIkFycmF5IiwiaXNBcnJheSIsInNhdmVTYXZlZFBsYWNlcyIsImxpc3QiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwiZ2VuSWQiLCJEYXRlIiwibm93IiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwic2xpY2UiLCJ0b0RhdGV0aW1lTG9jYWxOb3ciLCJ5eXl5IiwiZ2V0RnVsbFllYXIiLCJtbSIsIlN0cmluZyIsImdldE1vbnRoIiwicGFkU3RhcnQiLCJkZCIsImdldERhdGUiLCJoaCIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsIkhvbWVQYWdlIiwib25SZXF1ZXN0UmlkZSIsIm9uUG9zdFJpZGUiLCJjYW5Vc2VEcml2ZXJNb2RlIiwib25Ecml2ZXJTaWdudXAiLCJvbk9wZW5UaW1ldGFibGUiLCJfcyIsIm1vZGUiLCJzZXRNb2RlIiwic2F2ZWRQbGFjZXMiLCJzZXRTYXZlZFBsYWNlcyIsInNob3dTYXZlUGxhY2UiLCJzZXRTaG93U2F2ZVBsYWNlIiwicGxhY2VGb3JtIiwic2V0UGxhY2VGb3JtIiwibGFiZWwiLCJhZGRyZXNzIiwicG9zdGNvZGUiLCJjaXR5Iiwic2hvcnRjdXRzIiwic3VibWl0UGxhY2UiLCJ0cmltIiwibmV4dCIsImlkIiwidW5kZWZpbmVkIiwidXBkYXRlZCIsIm9wZW5TaG9ydGN1dCIsImRlc3RpbmF0aW9uIiwiYXJyaXZhbERhdGVUaW1lTG9jYWwiLCJtYXAiLCJwIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsImZvbnRXZWlnaHQiLCJmb250U2l6ZSIsIm1hcmdpbkJvdHRvbSIsInRhcmdldCIsInZhbHVlIiwiZGlzcGxheSIsImp1c3RpZnlDb250ZW50IiwiZ2FwIiwibWFyZ2luVG9wIiwib3BhY2l0eSIsIl9jIiwiJFJlZnJlc2hSZWckIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkhvbWVQYWdlLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlTWVtbywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB0eXBlIHsgUmlkZVByZWZpbGwgfSBmcm9tICcuL1RpbWV0YWJsZVBhZ2UnO1xyXG5cclxudHlwZSBIb21lUGFnZVByb3BzID0ge1xyXG4gIG9uUmVxdWVzdFJpZGU6IChwcmVmaWxsPzogUmlkZVByZWZpbGwpID0+IHZvaWQ7XHJcbiAgb25Qb3N0UmlkZTogKHByZWZpbGw/OiBSaWRlUHJlZmlsbCkgPT4gdm9pZDtcclxuICBjYW5Vc2VEcml2ZXJNb2RlOiBib29sZWFuO1xyXG4gIG9uRHJpdmVyU2lnbnVwOiAoKSA9PiB2b2lkO1xyXG4gIG9uT3BlblRpbWV0YWJsZTogKCkgPT4gdm9pZDtcclxufTtcclxuXHJcbnR5cGUgU2F2ZWRQbGFjZSA9IHtcclxuICBpZDogc3RyaW5nO1xyXG4gIGxhYmVsOiBzdHJpbmc7ICAgICAgLy8gZS5nLiBcIk15IEZsYXRcIlxyXG4gIGFkZHJlc3M6IHN0cmluZzsgICAgLy8gc3RyZWV0L2FyZWFcclxuICBwb3N0Y29kZTogc3RyaW5nO1xyXG4gIGNpdHk/OiBzdHJpbmc7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBsb2FkU2F2ZWRQbGFjZXMoKTogU2F2ZWRQbGFjZVtdIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcmF3ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NhdmVkUGxhY2VzJyk7XHJcbiAgICBpZiAoIXJhdykgcmV0dXJuIFtdO1xyXG4gICAgY29uc3QgcGFyc2VkID0gSlNPTi5wYXJzZShyYXcpO1xyXG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkocGFyc2VkKSA/IHBhcnNlZCA6IFtdO1xyXG4gIH0gY2F0Y2gge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2F2ZVNhdmVkUGxhY2VzKGxpc3Q6IFNhdmVkUGxhY2VbXSkge1xyXG4gIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzYXZlZFBsYWNlcycsIEpTT04uc3RyaW5naWZ5KGxpc3QpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuSWQoKSB7XHJcbiAgcmV0dXJuIGAke0RhdGUubm93KCl9XyR7TWF0aC5yYW5kb20oKS50b1N0cmluZygxNikuc2xpY2UoMil9YDtcclxufVxyXG5cclxuZnVuY3Rpb24gdG9EYXRldGltZUxvY2FsTm93KCkge1xyXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XHJcbiAgY29uc3QgeXl5eSA9IG5vdy5nZXRGdWxsWWVhcigpO1xyXG4gIGNvbnN0IG1tID0gU3RyaW5nKG5vdy5nZXRNb250aCgpICsgMSkucGFkU3RhcnQoMiwgJzAnKTtcclxuICBjb25zdCBkZCA9IFN0cmluZyhub3cuZ2V0RGF0ZSgpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gIGNvbnN0IGhoID0gU3RyaW5nKG5vdy5nZXRIb3VycygpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gIGNvbnN0IG1pbiA9IFN0cmluZyhub3cuZ2V0TWludXRlcygpKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gIHJldHVybiBgJHt5eXl5fS0ke21tfS0ke2RkfVQke2hofToke21pbn1gO1xyXG59XHJcblxyXG5jb25zdCBIb21lUGFnZTogUmVhY3QuRkM8SG9tZVBhZ2VQcm9wcz4gPSAoe1xyXG4gIG9uUmVxdWVzdFJpZGUsXHJcbiAgb25Qb3N0UmlkZSxcclxuICBjYW5Vc2VEcml2ZXJNb2RlID0gdHJ1ZSxcclxuICBvbkRyaXZlclNpZ251cCxcclxuICBvbk9wZW5UaW1ldGFibGUsXHJcbn0pID0+IHtcclxuICBjb25zdCBbbW9kZSwgc2V0TW9kZV0gPSB1c2VTdGF0ZTwndXNlcicgfCAnRHJpdmVyJz4oJ3VzZXInKTtcclxuXHJcbiAgLy8gU2F2ZWQgcGxhY2VzXHJcbiAgY29uc3QgW3NhdmVkUGxhY2VzLCBzZXRTYXZlZFBsYWNlc10gPSB1c2VTdGF0ZTxTYXZlZFBsYWNlW10+KCgpID0+IGxvYWRTYXZlZFBsYWNlcygpKTtcclxuICBjb25zdCBbc2hvd1NhdmVQbGFjZSwgc2V0U2hvd1NhdmVQbGFjZV0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW3BsYWNlRm9ybSwgc2V0UGxhY2VGb3JtXSA9IHVzZVN0YXRlKHtcclxuICAgIGxhYmVsOiAnJyxcclxuICAgIGFkZHJlc3M6ICcnLFxyXG4gICAgcG9zdGNvZGU6ICcnLFxyXG4gICAgY2l0eTogJycsXHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHNob3J0Y3V0cyA9IHVzZU1lbW8oKCkgPT4gc2F2ZWRQbGFjZXMsIFtzYXZlZFBsYWNlc10pO1xyXG5cclxuICBjb25zdCBzdWJtaXRQbGFjZSA9ICgpID0+IHtcclxuICAgIGlmICghcGxhY2VGb3JtLmFkZHJlc3MudHJpbSgpIHx8ICFwbGFjZUZvcm0ucG9zdGNvZGUudHJpbSgpKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgbmV4dDogU2F2ZWRQbGFjZSA9IHtcclxuICAgICAgaWQ6IGdlbklkKCksXHJcbiAgICAgIGxhYmVsOiBwbGFjZUZvcm0ubGFiZWwudHJpbSgpIHx8ICdTYXZlZCBwbGFjZScsXHJcbiAgICAgIGFkZHJlc3M6IHBsYWNlRm9ybS5hZGRyZXNzLnRyaW0oKSxcclxuICAgICAgcG9zdGNvZGU6IHBsYWNlRm9ybS5wb3N0Y29kZS50cmltKCksXHJcbiAgICAgIGNpdHk6IHBsYWNlRm9ybS5jaXR5LnRyaW0oKSB8fCB1bmRlZmluZWQsXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHVwZGF0ZWQgPSBbLi4uc2F2ZWRQbGFjZXMsIG5leHRdO1xyXG4gICAgc2V0U2F2ZWRQbGFjZXModXBkYXRlZCk7XHJcbiAgICBzYXZlU2F2ZWRQbGFjZXModXBkYXRlZCk7XHJcblxyXG4gICAgc2V0UGxhY2VGb3JtKHsgbGFiZWw6ICcnLCBhZGRyZXNzOiAnJywgcG9zdGNvZGU6ICcnLCBjaXR5OiAnJyB9KTtcclxuICAgIHNldFNob3dTYXZlUGxhY2UoZmFsc2UpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9wZW5TaG9ydGN1dCA9IChkZXN0aW5hdGlvbjogc3RyaW5nKSA9PiB7XHJcbiAgICBpZiAobW9kZSA9PT0gJ0RyaXZlcicpIHtcclxuICAgICAgb25Qb3N0UmlkZSh7IGRlc3RpbmF0aW9uLCBhcnJpdmFsRGF0ZVRpbWVMb2NhbDogdG9EYXRldGltZUxvY2FsTm93KCkgfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBvblJlcXVlc3RSaWRlKHsgZGVzdGluYXRpb24gfSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDw+XHJcbiAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwidWJlci1oZWFkZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInViZXItbG9nb1wiPlNhbXVkaHlhblJpZGVzPC9kaXY+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidG9wLXRvZ2dsZVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e2B0b2dnbGUtdGFiICR7bW9kZSA9PT0gJ3VzZXInID8gJ3RvZ2dsZS10YWItYWN0aXZlJyA6ICcnfWB9IG9uQ2xpY2s9eygpID0+IHNldE1vZGUoJ3VzZXInKX0+XHJcbiAgICAgICAgICAgIFJpZGVzXHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgdG9nZ2xlLXRhYiAke21vZGUgPT09ICdEcml2ZXInID8gJ3RvZ2dsZS10YWItYWN0aXZlJyA6ICcnfWB9XHJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoIWNhblVzZURyaXZlck1vZGUpIHtcclxuICAgICAgICAgICAgICAgIG9uRHJpdmVyU2lnbnVwKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHNldE1vZGUoJ0RyaXZlcicpO1xyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICBEcml2ZXJcclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2hlYWRlcj5cclxuXHJcbiAgICAgIHsvKiBXaGVyZSB0bz8gcGlsbCAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLWJvZHlcIj5cclxuICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICBjbGFzc05hbWU9XCJob21lLXdoZXJlLXBpbGxcIlxyXG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAobW9kZSA9PT0gJ3VzZXInKSByZXR1cm4gb25SZXF1ZXN0UmlkZSgpO1xyXG4gICAgICAgICAgICBpZiAoIWNhblVzZURyaXZlck1vZGUpIHJldHVybiBvbkRyaXZlclNpZ251cCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gb25Qb3N0UmlkZSgpO1xyXG4gICAgICAgICAgfX1cclxuICAgICAgICA+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJob21lLXdoZXJlLWljb25cIj7il488L3NwYW4+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJob21lLXdoZXJlLXRleHRcIj57bW9kZSA9PT0gJ0RyaXZlcicgPyAnUG9zdCBhIHJpZGUnIDogJ1JlcXVlc3QgYSByaWRlJ308L3NwYW4+XHJcbiAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgIHsvKiBTaG9ydGN1dHMgKi99XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLXNlY3Rpb25cIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1zZWN0aW9uLXRpdGxlXCI+U2hvcnRjdXRzPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLWxpc3QtY2FyZFwiPlxyXG4gICAgICAgICAgICB7LyogVW5pdmVyc2l0eSBvZiBCYXRoIChmaXhlZCBzaG9ydGN1dCkgKi99XHJcbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiaG9tZS1saXN0LXJvd1wiIG9uQ2xpY2s9eygpID0+IG9wZW5TaG9ydGN1dCgnVW5pdmVyc2l0eSBvZiBCYXRoJyl9PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1saXN0LWljb25cIj7wn4+rPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLWxpc3QtdGV4dFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLWxpc3QtdGl0bGVcIj5Vbml2ZXJzaXR5IG9mIEJhdGg8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1saXN0LXN1YnRpdGxlXCI+Q2xhdmVydG9uIERvd24sIEJhdGgsIEJBMiA3QVksIEdCPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLWxpc3QtY2hldnJvblwiPuKAujwvZGl2PlxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuXHJcbiAgICAgICAgICAgIHsvKiBSZW5kZXIgdXNlciBzYXZlZCBwbGFjZXMgKG9ubHkgb25lcyB0aGV5IGFkZCkgKi99XHJcbiAgICAgICAgICAgIHtzaG9ydGN1dHMubWFwKChwKSA9PiAoXHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAga2V5PXtwLmlkfVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaG9tZS1saXN0LXJvd1wiXHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvcGVuU2hvcnRjdXQoYCR7cC5hZGRyZXNzfSwgJHtwLnBvc3Rjb2RlfSR7cC5jaXR5ID8gYCwgJHtwLmNpdHl9YCA6ICcnfWApfVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1saXN0LWljb25cIj7wn5ONPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhvbWUtbGlzdC10ZXh0XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1saXN0LXRpdGxlXCI+e3AubGFiZWx9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1saXN0LXN1YnRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAge3AuYWRkcmVzc30sIHtwLnBvc3Rjb2RlfVxyXG4gICAgICAgICAgICAgICAgICAgIHtwLmNpdHkgPyBgLCAke3AuY2l0eX1gIDogJyd9XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhvbWUtbGlzdC1jaGV2cm9uXCI+4oC6PC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICkpfVxyXG5cclxuICAgICAgICAgICAgey8qIFNhdmUgYSBwbGFjZSAqL31cclxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJob21lLWxpc3Qtcm93IGhvbWUtbGlzdC1yb3ctYWRkXCIgb25DbGljaz17KCkgPT4gc2V0U2hvd1NhdmVQbGFjZSh0cnVlKX0+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLWxpc3QtaWNvblwiPu+8izwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1saXN0LXRleHRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1saXN0LXRpdGxlXCI+U2F2ZSBhIHBsYWNlPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIHsvKiBTZXJ2aWNlcyAqL31cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhvbWUtc2VjdGlvblwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLXNlY3Rpb24tdGl0bGVcIj5TZXJ2aWNlczwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1saXN0LWNhcmRcIj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJob21lLWxpc3Qtcm93XCIgb25DbGljaz17b25PcGVuVGltZXRhYmxlfT5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImhvbWUtbGlzdC1pY29uXCI+8J+Xk++4jzwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1saXN0LXRleHRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaG9tZS1saXN0LXRpdGxlXCI+VGltZXRhYmxlPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLWxpc3QtY2hldnJvblwiPuKAujwvZGl2PlxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHsvKiBTYXZlIHBsYWNlIG1vZGFsICovfVxyXG4gICAgICB7c2hvd1NhdmVQbGFjZSAmJiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1iYWNrZHJvcFwiIG9uQ2xpY2s9eygpID0+IHNldFNob3dTYXZlUGxhY2UoZmFsc2UpfT5cclxuICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwibW9kYWwtY2FyZFwiXHJcbiAgICAgICAgICAgIHJvbGU9XCJkaWFsb2dcIlxyXG4gICAgICAgICAgICBhcmlhLW1vZGFsPVwidHJ1ZVwiXHJcbiAgICAgICAgICAgIGFyaWEtbGFiZWxsZWRieT1cInNhdmUtcGxhY2UtdGl0bGVcIlxyXG4gICAgICAgICAgICB0YWJJbmRleD17LTF9XHJcbiAgICAgICAgICAgIG9uQ2xpY2s9eyhlKSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwic2F2ZS1wbGFjZS10aXRsZVwiIHN0eWxlPXt7IGZvbnRXZWlnaHQ6IDkwMCwgZm9udFNpemU6IDE2LCBtYXJnaW5Cb3R0b206IDEwIH19PlxyXG4gICAgICAgICAgICAgIFNhdmUgYSBwbGFjZVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtZ3JpZFwiPlxyXG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJtb2RhbC1maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+TGFiZWwgKG9wdGlvbmFsKTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17cGxhY2VGb3JtLmxhYmVsfVxyXG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFBsYWNlRm9ybSgocCkgPT4gKHsgLi4ucCwgbGFiZWw6IGUudGFyZ2V0LnZhbHVlIH0pKX1cclxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJlLmcuIEhvbWVcIlxyXG4gICAgICAgICAgICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgICAgICAgICAgIGF1dG9Db21wbGV0ZT1cIm9mZlwiXHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIDwvbGFiZWw+XHJcblxyXG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJtb2RhbC1maWVsZFwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4+QWRkcmVzczwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17cGxhY2VGb3JtLmFkZHJlc3N9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0UGxhY2VGb3JtKChwKSA9PiAoeyAuLi5wLCBhZGRyZXNzOiBlLnRhcmdldC52YWx1ZSB9KSl9XHJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiAxMiBFeGFtcGxlIFN0cmVldFwiXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPVwic3RyZWV0LWFkZHJlc3NcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2xhYmVsPlxyXG5cclxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibW9kYWwtZmllbGRcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuPlBvc3Rjb2RlPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtwbGFjZUZvcm0ucG9zdGNvZGV9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0UGxhY2VGb3JtKChwKSA9PiAoeyAuLi5wLCBwb3N0Y29kZTogZS50YXJnZXQudmFsdWUgfSkpfVxyXG4gICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gQkEyIDdBWVwiXHJcbiAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgYXV0b0NvbXBsZXRlPVwicG9zdGFsLWNvZGVcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L2xhYmVsPlxyXG5cclxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibW9kYWwtZmllbGRcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuPkNpdHkgKG9wdGlvbmFsKTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17cGxhY2VGb3JtLmNpdHl9XHJcbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0UGxhY2VGb3JtKChwKSA9PiAoeyAuLi5wLCBjaXR5OiBlLnRhcmdldC52YWx1ZSB9KSl9XHJcbiAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiBCYXRoXCJcclxuICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICBhdXRvQ29tcGxldGU9XCJhZGRyZXNzLWxldmVsMlwiXHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLCBnYXA6IDEwLCBtYXJnaW5Ub3A6IDE0IH19PlxyXG4gICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cInNoZWV0LWFjdGlvbi1idG4gYnRuLWNhbmNlbFwiIG9uQ2xpY2s9eygpID0+IHNldFNob3dTYXZlUGxhY2UoZmFsc2UpfT5cclxuICAgICAgICAgICAgICAgIENhbmNlbFxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2hlZXQtYWN0aW9uLWJ0biBidG4tYWNjZXB0XCJcclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3N1Ym1pdFBsYWNlfVxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFwbGFjZUZvcm0uYWRkcmVzcy50cmltKCkgfHwgIXBsYWNlRm9ybS5wb3N0Y29kZS50cmltKCl9XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBvcGFjaXR5OiAhcGxhY2VGb3JtLmFkZHJlc3MudHJpbSgpIHx8ICFwbGFjZUZvcm0ucG9zdGNvZGUudHJpbSgpID8gMC41NSA6IDEgfX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICBTYXZlXHJcbiAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICl9XHJcbiAgICA8Lz5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgSG9tZVBhZ2U7Il0sImZpbGUiOiJDOi9Vc2Vycy95bGFubi92c2NvZGUvVW5pL1NhbXVkaHlhblJpZGVzL2Zyb250ZW5kL3NyYy9Ib21lUGFnZS50c3gifQ==