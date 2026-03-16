import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/PostRidePage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=b8f2434d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=b8f2434d"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useEffect = __vite__cjsImport1_react["useEffect"]; const useState = __vite__cjsImport1_react["useState"];
import { apiFetch } from "/src/lib/api.ts";
import { useGeocode } from "/src/components/Map/useGeocode.ts";
const PostRidePage = ({ prefill }) => {
  _s();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [seats, setSeats] = useState("3");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { geocodeAddress } = useGeocode();
  useEffect(() => {
    if (!prefill) return;
    if (prefill.origin) {
      setOrigin(prefill.origin);
    }
    if (prefill.destination) {
      setDestination(prefill.destination);
    }
    if (prefill.arrivalDateTimeLocal) {
      setTimeInput(prefill.arrivalDateTimeLocal);
    }
  }, [prefill]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }
      const [originResults, destResults] = await Promise.all(
        [
          geocodeAddress(origin),
          geocodeAddress(destination)
        ]
      );
      const originCoords = originResults[0];
      const destCoords = destResults[0];
      if (!originCoords || !destCoords) {
        throw new Error("Location not found");
      }
      const payload = {
        origin,
        destination,
        origin_lat: originCoords.lat,
        origin_lng: originCoords.lng,
        destination_lat: destCoords.lat,
        destination_lng: destCoords.lng,
        departure_time: new Date(timeInput).toISOString(),
        seats_total: parseInt(seats, 10)
      };
      await apiFetch("rides/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setSuccess(true);
      setOrigin("");
      setDestination("");
      setTimeInput("");
      setSeats("3");
    } catch (err) {
      console.error("Error posting ride:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { style: { width: "100%" }, children: [
    /* @__PURE__ */ jsxDEV("header", { className: "uber-header", children: /* @__PURE__ */ jsxDEV("h1", { className: "activity-title", children: "Post a Ride" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
      lineNumber: 98,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
      lineNumber: 97,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "auth-card", style: { marginBottom: "24px" }, children: [
      error && /* @__PURE__ */ jsxDEV("p", { style: { color: "#f87171", fontSize: "14px", marginBottom: "12px" }, children: error }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
        lineNumber: 103,
        columnNumber: 9
      }, this),
      success && /* @__PURE__ */ jsxDEV(
        "div",
        {
          style: {
            padding: "12px",
            backgroundColor: "rgba(34,197,94,0.15)",
            color: "#4ade80",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "14px"
          },
          children: "Ride successfully posted!"
        },
        void 0,
        false,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
          lineNumber: 107,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("form", { onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "post-ride-origin", children: "Start Location" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
            lineNumber: 123,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "post-ride-origin",
              type: "text",
              className: "auth-input",
              placeholder: "e.g. Lower Oldfield Park",
              value: origin,
              onChange: (e) => setOrigin(e.target.value),
              required: true
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
              lineNumber: 124,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
          lineNumber: 122,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "post-ride-destination", children: "Destination" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
            lineNumber: 136,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "post-ride-destination",
              type: "text",
              className: "auth-input",
              placeholder: "e.g. University of Bath",
              value: destination,
              onChange: (e) => setDestination(e.target.value),
              required: true
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
              lineNumber: 137,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
          lineNumber: 135,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
          /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "post-ride-arrival", children: "Destination arrival Date and Time" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
            lineNumber: 149,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "post-ride-arrival",
              type: "datetime-local",
              className: "auth-input",
              value: timeInput,
              onChange: (e) => setTimeInput(e.target.value),
              required: true
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
              lineNumber: 150,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
          lineNumber: 148,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", gap: "12px" }, children: /* @__PURE__ */ jsxDEV("div", { className: "auth-field", style: { width: "100px" }, children: [
          /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "post-ride-seats", children: "Seats" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
            lineNumber: 164,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              id: "post-ride-seats",
              type: "number",
              min: "1",
              max: "8",
              className: "auth-input",
              value: seats,
              onChange: (e) => setSeats(e.target.value),
              required: true
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
              lineNumber: 165,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
          lineNumber: 163,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
          lineNumber: 160,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("button", { type: "submit", className: "auth-submit", disabled: loading, style: { marginTop: "12px" }, children: loading ? "Posting..." : "Post Ride" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
          lineNumber: 177,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
        lineNumber: 121,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
      lineNumber: 101,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx",
    lineNumber: 96,
    columnNumber: 5
  }, this);
};
_s(PostRidePage, "C6q1pTZ2Z0B1SnsWdLcfMsCP4Nw=", false, function() {
  return [useGeocode];
});
_c = PostRidePage;
export default PostRidePage;
var _c;
$RefreshReg$(_c, "PostRidePage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/PostRidePage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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QVEsR0FDbEQ7QUFBQSxpQ0FBQyxXQUFNLFdBQVUsY0FBYSxTQUFRLG1CQUFrQixxQkFBeEQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBNkQ7QUFBQSxVQUM3RDtBQUFBLFlBQUM7QUFBQTtBQUFBLGNBQ0MsSUFBRztBQUFBLGNBQ0gsTUFBSztBQUFBLGNBQ0wsS0FBSTtBQUFBLGNBQ0osS0FBSTtBQUFBLGNBQ0osV0FBVTtBQUFBLGNBQ1YsT0FBTzVDO0FBQUFBLGNBQ1AsVUFBVSxDQUFDVyxNQUFNVixTQUFTVSxFQUFFd0MsT0FBT0MsS0FBSztBQUFBLGNBQ3hDLFVBQVE7QUFBQTtBQUFBLFlBUlY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBUVU7QUFBQSxhQVZaO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFZQSxLQWZGO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFnQkE7QUFBQSxRQUNBLHVCQUFDLFlBQU8sTUFBSyxVQUFTLFdBQVUsZUFBYyxVQUFVbEQsU0FBUyxPQUFPLEVBQUVxRCxXQUFXLE9BQU8sR0FDekZyRCxvQkFBVSxlQUFlLGVBRDVCO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFFQTtBQUFBLFdBMURGO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUEyREE7QUFBQSxTQS9FRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBZ0ZBO0FBQUEsT0FyRkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQXNGQTtBQUVKO0FBQUVULEdBbExJRixjQUFpRDtBQUFBLFVBWTFCRCxVQUFVO0FBQUE7QUFBQWtFLEtBWmpDakU7QUFvTE4sZUFBZUE7QUFBYSxJQUFBaUU7QUFBQUMsYUFBQUQsSUFBQSIsIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJhcGlGZXRjaCIsInVzZUdlb2NvZGUiLCJQb3N0UmlkZVBhZ2UiLCJwcmVmaWxsIiwiX3MiLCJvcmlnaW4iLCJzZXRPcmlnaW4iLCJkZXN0aW5hdGlvbiIsInNldERlc3RpbmF0aW9uIiwidGltZUlucHV0Iiwic2V0VGltZUlucHV0Iiwic2VhdHMiLCJzZXRTZWF0cyIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwiZXJyb3IiLCJzZXRFcnJvciIsInN1Y2Nlc3MiLCJzZXRTdWNjZXNzIiwiZ2VvY29kZUFkZHJlc3MiLCJhcnJpdmFsRGF0ZVRpbWVMb2NhbCIsImhhbmRsZVN1Ym1pdCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsInRva2VuIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkVycm9yIiwib3JpZ2luUmVzdWx0cyIsImRlc3RSZXN1bHRzIiwiUHJvbWlzZSIsImFsbCIsIm9yaWdpbkNvb3JkcyIsImRlc3RDb29yZHMiLCJwYXlsb2FkIiwib3JpZ2luX2xhdCIsImxhdCIsIm9yaWdpbl9sbmciLCJsbmciLCJkZXN0aW5hdGlvbl9sYXQiLCJkZXN0aW5hdGlvbl9sbmciLCJkZXBhcnR1cmVfdGltZSIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsInNlYXRzX3RvdGFsIiwicGFyc2VJbnQiLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJlcnIiLCJjb25zb2xlIiwibWVzc2FnZSIsIlN0cmluZyIsIndpZHRoIiwibWFyZ2luQm90dG9tIiwiY29sb3IiLCJmb250U2l6ZSIsInBhZGRpbmciLCJiYWNrZ3JvdW5kQ29sb3IiLCJib3JkZXJSYWRpdXMiLCJ0YXJnZXQiLCJ2YWx1ZSIsImRpc3BsYXkiLCJnYXAiLCJtYXJnaW5Ub3AiLCJfYyIsIiRSZWZyZXNoUmVnJCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJQb3N0UmlkZVBhZ2UudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBhcGlGZXRjaCB9IGZyb20gJy4vbGliL2FwaSc7XHJcbmltcG9ydCB7IHVzZUdlb2NvZGUgfSBmcm9tICcuL2NvbXBvbmVudHMvTWFwL3VzZUdlb2NvZGUnO1xyXG5pbXBvcnQgdHlwZSB7IFJpZGVQcmVmaWxsIH0gZnJvbSAnLi9UaW1ldGFibGVQYWdlJztcclxuXHJcbmNvbnN0IFBvc3RSaWRlUGFnZTogUmVhY3QuRkM8eyBwcmVmaWxsPzogUmlkZVByZWZpbGwgfT4gPSAoeyBwcmVmaWxsIH0pID0+IHtcclxuICAvLyBGb3JtIFN0YXRlXHJcbiAgY29uc3QgW29yaWdpbiwgc2V0T3JpZ2luXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbZGVzdGluYXRpb24sIHNldERlc3RpbmF0aW9uXSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbdGltZUlucHV0LCBzZXRUaW1lSW5wdXRdID0gdXNlU3RhdGUoJycpO1xyXG4gIGNvbnN0IFtzZWF0cywgc2V0U2VhdHNdID0gdXNlU3RhdGUoJzMnKTtcclxuXHJcbiAgLy8gVUkgU3RhdGVcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbc3VjY2Vzcywgc2V0U3VjY2Vzc10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIGNvbnN0IHsgZ2VvY29kZUFkZHJlc3MgfSA9IHVzZUdlb2NvZGUoKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghcHJlZmlsbCkgcmV0dXJuO1xyXG5cclxuICAgIGlmIChwcmVmaWxsLm9yaWdpbikge1xyXG4gICAgICBzZXRPcmlnaW4ocHJlZmlsbC5vcmlnaW4pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChwcmVmaWxsLmRlc3RpbmF0aW9uKSB7XHJcbiAgICAgIHNldERlc3RpbmF0aW9uKHByZWZpbGwuZGVzdGluYXRpb24pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChwcmVmaWxsLmFycml2YWxEYXRlVGltZUxvY2FsKSB7XHJcbiAgICAgIHNldFRpbWVJbnB1dChwcmVmaWxsLmFycml2YWxEYXRlVGltZUxvY2FsKTtcclxuICAgIH1cclxuICB9LCBbcHJlZmlsbF0pO1xyXG5cclxuICBjb25zdCBoYW5kbGVTdWJtaXQgPSBhc3luYyAoZTogUmVhY3QuRm9ybUV2ZW50KSA9PiB7XHJcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICBzZXRMb2FkaW5nKHRydWUpO1xyXG4gICAgc2V0RXJyb3IobnVsbCk7XHJcbiAgICBzZXRTdWNjZXNzKGZhbHNlKTtcclxuXHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBLZWVwIGV4aXN0aW5nIFVYIGNoZWNrXHJcbiAgICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2F1dGhUb2tlbicpO1xyXG4gICAgICBpZiAoIXRva2VuKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBhdXRoZW50aWNhdGlvbiB0b2tlbiBmb3VuZC4gUGxlYXNlIGxvZyBpbiBhZ2Fpbi4nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gR2VvY29kZSBvcmlnaW4gKyBkZXN0aW5hdGlvblxyXG4gICAgICBjb25zdCBbb3JpZ2luUmVzdWx0cywgZGVzdFJlc3VsdHNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgICAgIGdlb2NvZGVBZGRyZXNzKG9yaWdpbiksXHJcbiAgICAgICAgZ2VvY29kZUFkZHJlc3MoZGVzdGluYXRpb24pLFxyXG4gICAgICBdKTtcclxuXHJcbiAgICAgIGNvbnN0IG9yaWdpbkNvb3JkcyA9IG9yaWdpblJlc3VsdHNbMF07XHJcbiAgICAgIGNvbnN0IGRlc3RDb29yZHMgPSBkZXN0UmVzdWx0c1swXTtcclxuXHJcbiAgICAgIGlmICghb3JpZ2luQ29vcmRzIHx8ICFkZXN0Q29vcmRzKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTG9jYXRpb24gbm90IGZvdW5kXCIpXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEJhY2tlbmQgZXhwZWN0cyBSaWRlQ3JlYXRlXHJcbiAgICAgIGNvbnN0IHBheWxvYWQgPSB7XHJcbiAgICAgICAgb3JpZ2luLFxyXG4gICAgICAgIGRlc3RpbmF0aW9uLFxyXG4gICAgICAgIG9yaWdpbl9sYXQ6IG9yaWdpbkNvb3Jkcy5sYXQsXHJcbiAgICAgICAgb3JpZ2luX2xuZzogb3JpZ2luQ29vcmRzLmxuZyxcclxuICAgICAgICBkZXN0aW5hdGlvbl9sYXQ6IGRlc3RDb29yZHMubGF0LFxyXG4gICAgICAgIGRlc3RpbmF0aW9uX2xuZzogZGVzdENvb3Jkcy5sbmcsXHJcbiAgICAgICAgZGVwYXJ0dXJlX3RpbWU6IG5ldyBEYXRlKHRpbWVJbnB1dCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgICBzZWF0c190b3RhbDogcGFyc2VJbnQoc2VhdHMsIDEwKSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGF3YWl0IGFwaUZldGNoPGFueT4oJ3JpZGVzLycsIHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXlsb2FkKSxcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBzZXRTdWNjZXNzKHRydWUpO1xyXG5cclxuICAgICAgLy8gQ2xlYXIgZm9ybVxyXG4gICAgICBzZXRPcmlnaW4oJycpO1xyXG4gICAgICBzZXREZXN0aW5hdGlvbignJyk7XHJcbiAgICAgIHNldFRpbWVJbnB1dCgnJyk7XHJcbiAgICAgIHNldFNlYXRzKCczJyk7XHJcbiAgICB9IGNhdGNoIChlcnI6IHVua25vd24pIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgcG9zdGluZyByaWRlOicsIGVycik7XHJcbiAgICAgIHNldEVycm9yKGVyciBpbnN0YW5jZW9mIEVycm9yID8gZXJyLm1lc3NhZ2UgOiBTdHJpbmcoZXJyKSk7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBzdHlsZT17eyB3aWR0aDogJzEwMCUnIH19PlxyXG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cInViZXItaGVhZGVyXCI+XHJcbiAgICAgICAgPGgxIGNsYXNzTmFtZT1cImFjdGl2aXR5LXRpdGxlXCI+UG9zdCBhIFJpZGU8L2gxPlxyXG4gICAgICA8L2hlYWRlcj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXV0aC1jYXJkXCIgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAnMjRweCcgfX0+XHJcbiAgICAgICAge2Vycm9yICYmIChcclxuICAgICAgICAgIDxwIHN0eWxlPXt7IGNvbG9yOiAnI2Y4NzE3MScsIGZvbnRTaXplOiAnMTRweCcsIG1hcmdpbkJvdHRvbTogJzEycHgnIH19PntlcnJvcn08L3A+XHJcbiAgICAgICAgKX1cclxuXHJcbiAgICAgICAge3N1Y2Nlc3MgJiYgKFxyXG4gICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICcxMnB4JyxcclxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDM0LDE5Nyw5NCwwLjE1KScsXHJcbiAgICAgICAgICAgICAgY29sb3I6ICcjNGFkZTgwJyxcclxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxyXG4gICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzE2cHgnLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAnMTRweCcsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIFJpZGUgc3VjY2Vzc2Z1bGx5IHBvc3RlZCFcclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICl9XHJcblxyXG4gICAgICAgIDxmb3JtIG9uU3VibWl0PXtoYW5kbGVTdWJtaXR9PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhdXRoLWZpZWxkXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJhdXRoLWxhYmVsXCIgaHRtbEZvcj1cInBvc3QtcmlkZS1vcmlnaW5cIj5TdGFydCBMb2NhdGlvbjwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgIGlkPVwicG9zdC1yaWRlLW9yaWdpblwiXHJcbiAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImF1dGgtaW5wdXRcIlxyXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZS5nLiBMb3dlciBPbGRmaWVsZCBQYXJrXCJcclxuICAgICAgICAgICAgICB2YWx1ZT17b3JpZ2lufVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0T3JpZ2luKGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgICByZXF1aXJlZFxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhdXRoLWZpZWxkXCI+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJhdXRoLWxhYmVsXCIgaHRtbEZvcj1cInBvc3QtcmlkZS1kZXN0aW5hdGlvblwiPkRlc3RpbmF0aW9uPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgaWQ9XCJwb3N0LXJpZGUtZGVzdGluYXRpb25cIlxyXG4gICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhdXRoLWlucHV0XCJcclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImUuZy4gVW5pdmVyc2l0eSBvZiBCYXRoXCJcclxuICAgICAgICAgICAgICB2YWx1ZT17ZGVzdGluYXRpb259XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXREZXN0aW5hdGlvbihlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXV0aC1maWVsZFwiPlxyXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYXV0aC1sYWJlbFwiIGh0bWxGb3I9XCJwb3N0LXJpZGUtYXJyaXZhbFwiPkRlc3RpbmF0aW9uIGFycml2YWwgRGF0ZSBhbmQgVGltZTwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgIGlkPVwicG9zdC1yaWRlLWFycml2YWxcIlxyXG4gICAgICAgICAgICAgIHR5cGU9XCJkYXRldGltZS1sb2NhbFwiXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXV0aC1pbnB1dFwiXHJcbiAgICAgICAgICAgICAgdmFsdWU9e3RpbWVJbnB1dH1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFRpbWVJbnB1dChlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBnYXA6ICcxMnB4JyB9fT5cclxuXHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF1dGgtZmllbGRcIiBzdHlsZT17eyB3aWR0aDogJzEwMHB4JyB9fT5cclxuICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYXV0aC1sYWJlbFwiIGh0bWxGb3I9XCJwb3N0LXJpZGUtc2VhdHNcIj5TZWF0czwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICBpZD1cInBvc3QtcmlkZS1zZWF0c1wiXHJcbiAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgIG1pbj1cIjFcIlxyXG4gICAgICAgICAgICAgICAgbWF4PVwiOFwiXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhdXRoLWlucHV0XCJcclxuICAgICAgICAgICAgICAgIHZhbHVlPXtzZWF0c31cclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0U2VhdHMoZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWRcclxuICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3NOYW1lPVwiYXV0aC1zdWJtaXRcIiBkaXNhYmxlZD17bG9hZGluZ30gc3R5bGU9e3sgbWFyZ2luVG9wOiAnMTJweCcgfX0+XHJcbiAgICAgICAgICAgIHtsb2FkaW5nID8gJ1Bvc3RpbmcuLi4nIDogJ1Bvc3QgUmlkZSd9XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8L2Zvcm0+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBvc3RSaWRlUGFnZTtcclxuIl0sImZpbGUiOiJDOi9Vc2Vycy95bGFubi92c2NvZGUvVW5pL1NhbXVkaHlhblJpZGVzL2Zyb250ZW5kL3NyYy9Qb3N0UmlkZVBhZ2UudHN4In0=