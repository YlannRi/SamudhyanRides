import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/RequestRidePage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=b8f2434d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=b8f2434d"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useEffect = __vite__cjsImport1_react["useEffect"]; const useState = __vite__cjsImport1_react["useState"];
import { apiFetch } from "/src/lib/api.ts";
import { RideRenderMap } from "/src/components/Map/RideRenderMap.tsx";
const RequestRidePage = ({ prefill }) => {
  _s();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [originInput, setOriginInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  useEffect(() => {
    if (!prefill) return;
    if (prefill.destination) setDestinationInput(prefill.destination);
    if (prefill.arrivalDateTimeLocal) setTimeInput(prefill.arrivalDateTimeLocal);
  }, [prefill]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSelectedRide(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found. Please log in again.");
      const params = new URLSearchParams();
      if (originInput.trim()) params.append("origin", originInput.trim());
      if (destinationInput.trim()) params.append("destination", destinationInput.trim());
      const data = await apiFetch(params.toString() ? `rides/?${params.toString()}` : "rides/", { method: "GET" });
      setRides(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };
  const handleBookRide = async () => {
    if (!selectedRide) return;
    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(false);
    try {
      const numericPrice = parseFloat((selectedRide.price ?? "0").replace(/[\u00A3$,]/g, "") || "0");
      const params = new URLSearchParams({
        ride_id: String(selectedRide.id),
        pickup_location: "Map Point",
        dropoff_location: selectedRide.destination || "Destination",
        price: String(Number.isFinite(numericPrice) ? numericPrice : 0)
      });
      if (pickupCoords) {
        params.append("pickup_lat", String(pickupCoords.lat));
        params.append("pickup_lng", String(pickupCoords.lng));
      }
      await apiFetch(`bookings/?${params.toString()}`, { method: "POST" });
      setBookingSuccess(true);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : String(err));
    } finally {
      setBookingLoading(false);
    }
  };
  if (selectedRide) {
    return /* @__PURE__ */ jsxDEV("div", { style: { width: "100%" }, children: [
      /* @__PURE__ */ jsxDEV("header", { className: "uber-header", style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
        /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: () => {
          setSelectedRide(null);
          setPickupCoords(null);
          setBookingError(null);
          setBookingSuccess(false);
        }, style: { background: "none", border: "none", color: "var(--text-header)", fontSize: "20px", padding: 0 }, children: "←" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 63,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("h1", { className: "activity-title", style: { margin: 0, color: "var(--text-header)" }, children: selectedRide.destination ? `Book Ride to ${selectedRide.destination}` : "Book Ride" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 64,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
        lineNumber: 62,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "auth-card", children: [
        /* @__PURE__ */ jsxDEV("h3", { style: { marginTop: 0, color: "var(--text-typed)" }, children: "Select Pickup Location" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 67,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { style: { fontSize: "14px", color: "var(--text-label)", marginBottom: "16px" }, children: "Click on the map to set your exact pickup spot." }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 68,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(RideRenderMap, { rideId: selectedRide.id, height: "350px", onPickupSelect: (lat, lng) => setPickupCoords({ lat, lng }) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 69,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { style: { marginTop: "20px" }, children: [
          bookingError && /* @__PURE__ */ jsxDEV("p", { style: { color: "#d32f2f", fontSize: "14px", fontWeight: "bold" }, children: bookingError }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
            lineNumber: 71,
            columnNumber: 30
          }, this),
          bookingSuccess && /* @__PURE__ */ jsxDEV("p", { className: "auth-alert-success", children: "Booking request sent successfully!" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
            lineNumber: 72,
            columnNumber: 32
          }, this),
          /* @__PURE__ */ jsxDEV("button", { className: "auth-submit", onClick: handleBookRide, disabled: bookingLoading || bookingSuccess, style: { opacity: bookingLoading || bookingSuccess ? 0.7 : 1 }, children: bookingLoading ? "Requesting..." : pickupCoords ? "Confirm Pickup & Request" : "Request Without Specific Pickup" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
            lineNumber: 73,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 70,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
        lineNumber: 66,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
      lineNumber: 61,
      columnNumber: 7
    }, this);
  }
  const formatDateOnly = (iso) => iso ? new Date(iso).toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : "Flexible";
  const formatTimeOnly = (iso) => iso ? new Date(iso).toLocaleString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";
  return /* @__PURE__ */ jsxDEV("div", { style: { width: "100%" }, children: [
    /* @__PURE__ */ jsxDEV("header", { className: "uber-header", children: /* @__PURE__ */ jsxDEV("h1", { className: "activity-title", style: { color: "var(--text-header)" }, children: "Request a Ride" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
      lineNumber: 87,
      columnNumber: 39
    }, this) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
      lineNumber: 87,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "auth-card", style: { marginBottom: "24px" }, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
        /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "pickup-area", children: "Pick-up area (optional)" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 90,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("input", { id: "pickup-area", type: "text", className: "auth-input", style: { colorScheme: "light" }, placeholder: "e.g. Oldfield Park", value: originInput, onChange: (e) => setOriginInput(e.target.value) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 91,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
        lineNumber: 89,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
        /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "destination-input", children: "Destination" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 94,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("input", { id: "destination-input", type: "text", className: "auth-input", style: { colorScheme: "light" }, placeholder: "e.g. University of Bath", value: destinationInput, onChange: (e) => setDestinationInput(e.target.value) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 95,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
        lineNumber: 93,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
        /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "arrival-time", children: "Time of arrival (optional)" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 98,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("input", { id: "arrival-time", type: "datetime-local", className: "auth-input", style: { colorScheme: "light" }, value: timeInput, onChange: (e) => setTimeInput(e.target.value) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 99,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
        lineNumber: 97,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "auth-submit", onClick: handleSearch, disabled: loading, style: { marginTop: "12px" }, children: loading ? "Searching..." : "Search Rides" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
        lineNumber: 101,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
      lineNumber: 88,
      columnNumber: 7
    }, this),
    error && /* @__PURE__ */ jsxDEV("p", { style: { color: "#d32f2f", fontWeight: "bold" }, children: error }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
      lineNumber: 103,
      columnNumber: 17
    }, this),
    !loading && !error && hasSearched && rides.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "past-list", children: rides.map(
      (ride) => /* @__PURE__ */ jsxDEV("div", { className: "card trip-row-card", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "trip-row-left", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "trip-car-icon", children: "🚗" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
            lineNumber: 109,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "trip-row-text", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "trip-row-title", children: ride.destination || `Ride #${ride.id}` }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
              lineNumber: 111,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "trip-row-meta", children: formatDateOnly(ride.departure_time) }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
              lineNumber: 112,
              columnNumber: 19
            }, this),
            ride.departure_time && /* @__PURE__ */ jsxDEV("div", { className: "trip-row-meta", children: formatTimeOnly(ride.departure_time) }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
              lineNumber: 113,
              columnNumber: 43
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "trip-row-meta", children: [
              "From: ",
              ride.origin || "—"
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
              lineNumber: 114,
              columnNumber: 19
            }, this),
            ride.driver_name && /* @__PURE__ */ jsxDEV("div", { className: "trip-row-meta", children: [
              "Driver: ",
              ride.driver_name
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
              lineNumber: 115,
              columnNumber: 40
            }, this),
            ride.driver_rating !== void 0 && ride.driver_rating > 0 && /* @__PURE__ */ jsxDEV("div", { className: "trip-row-meta", children: [
              "⭐ ",
              ride.driver_rating.toFixed(1)
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
              lineNumber: 117,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "trip-row-price", style: { color: "var(--text-label)", fontWeight: "bold" }, children: "£2.00" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
              lineNumber: 119,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
            lineNumber: 110,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 108,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: "pill pill-solid", onClick: () => {
          setSelectedRide(ride);
          setPickupCoords(null);
          setBookingError(null);
          setBookingSuccess(false);
        }, children: "Request" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
          lineNumber: 122,
          columnNumber: 15
        }, this)
      ] }, ride.id, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
        lineNumber: 107,
        columnNumber: 9
      }, this)
    ) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
      lineNumber: 105,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx",
    lineNumber: 86,
    columnNumber: 5
  }, this);
};
_s(RequestRidePage, "IgkdPxFfhlyJbEs53o93xZyy1tk=");
_c = RequestRidePage;
export default RequestRidePage;
var _c;
$RefreshReg$(_c, "RequestRidePage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/RequestRidePage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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T0FBTyxHQUFJLHFCQUE1RjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUFvRztBQUFBLGVBVHRHO0FBQUE7QUFBQTtBQUFBO0FBQUEsaUJBVUE7QUFBQSxhQVpGO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFhQTtBQUFBLFFBQ0EsdUJBQUMsWUFBTyxXQUFVLG1CQUFrQixTQUFTLE1BQU07QUFBRW5ELDBCQUFnQnFFLElBQUk7QUFBR25FLDBCQUFnQixJQUFJO0FBQUdJLDBCQUFnQixJQUFJO0FBQUdFLDRCQUFrQixLQUFLO0FBQUEsUUFBRyxHQUFHLHVCQUF2SjtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBQThKO0FBQUEsV0FmdEo2RCxLQUFLckMsSUFBZjtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBZ0JBO0FBQUEsSUFDRCxLQW5CSDtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBb0JBO0FBQUEsT0F2Q0o7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQXlDQTtBQUVKO0FBQUVsRCxHQXpISUYsaUJBQTJEO0FBQUFnRyxLQUEzRGhHO0FBMkhOLGVBQWVBO0FBQWdCLElBQUFnRztBQUFBQyxhQUFBRCxJQUFBIiwibmFtZXMiOlsiUmVhY3QiLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsImFwaUZldGNoIiwiUmlkZVJlbmRlck1hcCIsIlJlcXVlc3RSaWRlUGFnZSIsInByZWZpbGwiLCJfcyIsInJpZGVzIiwic2V0UmlkZXMiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImVycm9yIiwic2V0RXJyb3IiLCJoYXNTZWFyY2hlZCIsInNldEhhc1NlYXJjaGVkIiwib3JpZ2luSW5wdXQiLCJzZXRPcmlnaW5JbnB1dCIsImRlc3RpbmF0aW9uSW5wdXQiLCJzZXREZXN0aW5hdGlvbklucHV0IiwidGltZUlucHV0Iiwic2V0VGltZUlucHV0IiwiZGVzdGluYXRpb24iLCJhcnJpdmFsRGF0ZVRpbWVMb2NhbCIsInNlbGVjdGVkUmlkZSIsInNldFNlbGVjdGVkUmlkZSIsInBpY2t1cENvb3JkcyIsInNldFBpY2t1cENvb3JkcyIsImJvb2tpbmdMb2FkaW5nIiwic2V0Qm9va2luZ0xvYWRpbmciLCJib29raW5nRXJyb3IiLCJzZXRCb29raW5nRXJyb3IiLCJib29raW5nU3VjY2VzcyIsInNldEJvb2tpbmdTdWNjZXNzIiwiaGFuZGxlU2VhcmNoIiwidG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiRXJyb3IiLCJwYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJ0cmltIiwiYXBwZW5kIiwiZGF0YSIsInRvU3RyaW5nIiwibWV0aG9kIiwiQXJyYXkiLCJpc0FycmF5IiwiZXJyIiwibWVzc2FnZSIsIlN0cmluZyIsImhhbmRsZUJvb2tSaWRlIiwibnVtZXJpY1ByaWNlIiwicGFyc2VGbG9hdCIsInByaWNlIiwicmVwbGFjZSIsInJpZGVfaWQiLCJpZCIsInBpY2t1cF9sb2NhdGlvbiIsImRyb3BvZmZfbG9jYXRpb24iLCJOdW1iZXIiLCJpc0Zpbml0ZSIsImxhdCIsImxuZyIsIndpZHRoIiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJnYXAiLCJiYWNrZ3JvdW5kIiwiYm9yZGVyIiwiY29sb3IiLCJmb250U2l6ZSIsInBhZGRpbmciLCJtYXJnaW4iLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJmb250V2VpZ2h0Iiwib3BhY2l0eSIsImZvcm1hdERhdGVPbmx5IiwiaXNvIiwiRGF0ZSIsInRvTG9jYWxlU3RyaW5nIiwid2Vla2RheSIsImRheSIsIm1vbnRoIiwiZm9ybWF0VGltZU9ubHkiLCJob3VyIiwibWludXRlIiwiY29sb3JTY2hlbWUiLCJlIiwidGFyZ2V0IiwidmFsdWUiLCJsZW5ndGgiLCJtYXAiLCJyaWRlIiwiZGVwYXJ0dXJlX3RpbWUiLCJvcmlnaW4iLCJkcml2ZXJfbmFtZSIsImRyaXZlcl9yYXRpbmciLCJ1bmRlZmluZWQiLCJ0b0ZpeGVkIiwiX2MiLCIkUmVmcmVzaFJlZyQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiUmVxdWVzdFJpZGVQYWdlLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgYXBpRmV0Y2ggfSBmcm9tICcuL2xpYi9hcGknO1xyXG5pbXBvcnQgeyBSaWRlUmVuZGVyTWFwIH0gZnJvbSAnLi9jb21wb25lbnRzL01hcC9SaWRlUmVuZGVyTWFwJztcclxuXHJcbmV4cG9ydCB0eXBlIFJlcXVlc3RSaWRlUHJlZmlsbCA9IHsgZGVzdGluYXRpb24/OiBzdHJpbmc7IGFycml2YWxEYXRlVGltZUxvY2FsPzogc3RyaW5nOyB9O1xyXG50eXBlIFJpZGUgPSB7IGlkOiBudW1iZXI7IG9yaWdpbj86IHN0cmluZzsgZGVzdGluYXRpb24/OiBzdHJpbmc7IGRlcGFydHVyZV90aW1lPzogc3RyaW5nOyBkYXRlT25seT86IHN0cmluZzsgdGltZU9ubHk/OiBzdHJpbmc7IGRyaXZlcl9uYW1lPzogc3RyaW5nO2RyaXZlcl9yYXRpbmc/OiBudW1iZXI7IHByaWNlPzogc3RyaW5nOyB9O1xyXG5cclxuY29uc3QgUmVxdWVzdFJpZGVQYWdlOiBSZWFjdC5GQzx7IHByZWZpbGw/OiBSZXF1ZXN0UmlkZVByZWZpbGwgfT4gPSAoeyBwcmVmaWxsIH0pID0+IHtcclxuICBjb25zdCBbcmlkZXMsIHNldFJpZGVzXSA9IHVzZVN0YXRlPFJpZGVbXT4oW10pO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KG51bGwpO1xyXG4gIGNvbnN0IFtoYXNTZWFyY2hlZCwgc2V0SGFzU2VhcmNoZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cclxuICBjb25zdCBbb3JpZ2luSW5wdXQsIHNldE9yaWdpbklucHV0XSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbZGVzdGluYXRpb25JbnB1dCwgc2V0RGVzdGluYXRpb25JbnB1dF0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW3RpbWVJbnB1dCwgc2V0VGltZUlucHV0XSA9IHVzZVN0YXRlKCcnKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghcHJlZmlsbCkgcmV0dXJuO1xyXG4gICAgaWYgKHByZWZpbGwuZGVzdGluYXRpb24pIHNldERlc3RpbmF0aW9uSW5wdXQocHJlZmlsbC5kZXN0aW5hdGlvbik7XHJcbiAgICBpZiAocHJlZmlsbC5hcnJpdmFsRGF0ZVRpbWVMb2NhbCkgc2V0VGltZUlucHV0KHByZWZpbGwuYXJyaXZhbERhdGVUaW1lTG9jYWwpO1xyXG4gIH0sIFtwcmVmaWxsXSk7XHJcblxyXG4gIGNvbnN0IFtzZWxlY3RlZFJpZGUsIHNldFNlbGVjdGVkUmlkZV0gPSB1c2VTdGF0ZTxSaWRlIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW3BpY2t1cENvb3Jkcywgc2V0UGlja3VwQ29vcmRzXSA9IHVzZVN0YXRlPHsgbGF0OiBudW1iZXI7IGxuZzogbnVtYmVyIH0gfCBudWxsPihudWxsKTtcclxuICBjb25zdCBbYm9va2luZ0xvYWRpbmcsIHNldEJvb2tpbmdMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICBjb25zdCBbYm9va2luZ0Vycm9yLCBzZXRCb29raW5nRXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW2Jvb2tpbmdTdWNjZXNzLCBzZXRCb29raW5nU3VjY2Vzc10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZVNlYXJjaCA9IGFzeW5jICgpID0+IHtcclxuICAgIHNldExvYWRpbmcodHJ1ZSk7IHNldEVycm9yKG51bGwpOyBzZXRIYXNTZWFyY2hlZCh0cnVlKTsgc2V0U2VsZWN0ZWRSaWRlKG51bGwpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0aFRva2VuJyk7XHJcbiAgICAgIGlmICghdG9rZW4pIHRocm93IG5ldyBFcnJvcignTm8gYXV0aGVudGljYXRpb24gdG9rZW4gZm91bmQuIFBsZWFzZSBsb2cgaW4gYWdhaW4uJyk7XHJcbiAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcclxuICAgICAgaWYgKG9yaWdpbklucHV0LnRyaW0oKSkgcGFyYW1zLmFwcGVuZCgnb3JpZ2luJywgb3JpZ2luSW5wdXQudHJpbSgpKTtcclxuICAgICAgaWYgKGRlc3RpbmF0aW9uSW5wdXQudHJpbSgpKSBwYXJhbXMuYXBwZW5kKCdkZXN0aW5hdGlvbicsIGRlc3RpbmF0aW9uSW5wdXQudHJpbSgpKTtcclxuXHJcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBhcGlGZXRjaDxSaWRlW10+KHBhcmFtcy50b1N0cmluZygpID8gYHJpZGVzLz8ke3BhcmFtcy50b1N0cmluZygpfWAgOiAncmlkZXMvJywgeyBtZXRob2Q6ICdHRVQnIH0pO1xyXG4gICAgICBzZXRSaWRlcyhBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YSA6IFtdKTtcclxuICAgIH0gY2F0Y2ggKGVycjogdW5rbm93bikgeyBzZXRFcnJvcihlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogU3RyaW5nKGVycikpOyB9IGZpbmFsbHkgeyBzZXRMb2FkaW5nKGZhbHNlKTsgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZUJvb2tSaWRlID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgaWYgKCFzZWxlY3RlZFJpZGUpIHJldHVybjtcclxuICAgIHNldEJvb2tpbmdMb2FkaW5nKHRydWUpOyBzZXRCb29raW5nRXJyb3IobnVsbCk7IHNldEJvb2tpbmdTdWNjZXNzKGZhbHNlKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IG51bWVyaWNQcmljZSA9IHBhcnNlRmxvYXQoKHNlbGVjdGVkUmlkZS5wcmljZSA/PyAnMCcpLnJlcGxhY2UoL1tcXHUwMEEzJCxdL2csICcnKSB8fCAnMCcpO1xyXG4gICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHtcclxuICAgICAgICByaWRlX2lkOiBTdHJpbmcoc2VsZWN0ZWRSaWRlLmlkKSwgcGlja3VwX2xvY2F0aW9uOiAnTWFwIFBvaW50JyxcclxuICAgICAgICBkcm9wb2ZmX2xvY2F0aW9uOiBzZWxlY3RlZFJpZGUuZGVzdGluYXRpb24gfHwgJ0Rlc3RpbmF0aW9uJywgcHJpY2U6IFN0cmluZyhOdW1iZXIuaXNGaW5pdGUobnVtZXJpY1ByaWNlKSA/IG51bWVyaWNQcmljZSA6IDApLFxyXG4gICAgICB9KTtcclxuICAgICAgaWYgKHBpY2t1cENvb3JkcykgeyBwYXJhbXMuYXBwZW5kKCdwaWNrdXBfbGF0JywgU3RyaW5nKHBpY2t1cENvb3Jkcy5sYXQpKTsgcGFyYW1zLmFwcGVuZCgncGlja3VwX2xuZycsIFN0cmluZyhwaWNrdXBDb29yZHMubG5nKSk7IH1cclxuICAgICAgYXdhaXQgYXBpRmV0Y2goYGJvb2tpbmdzLz8ke3BhcmFtcy50b1N0cmluZygpfWAsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcbiAgICAgIHNldEJvb2tpbmdTdWNjZXNzKHRydWUpO1xyXG4gICAgfSBjYXRjaCAoZXJyOiB1bmtub3duKSB7IHNldEJvb2tpbmdFcnJvcihlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogU3RyaW5nKGVycikpOyB9IGZpbmFsbHkgeyBzZXRCb29raW5nTG9hZGluZyhmYWxzZSk7IH1cclxuICB9O1xyXG5cclxuICBpZiAoc2VsZWN0ZWRSaWRlKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAnMTAwJScgfX0+XHJcbiAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJ1YmVyLWhlYWRlclwiIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogJzEycHgnIH19PlxyXG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17KCkgPT4geyBzZXRTZWxlY3RlZFJpZGUobnVsbCk7IHNldFBpY2t1cENvb3JkcyhudWxsKTsgc2V0Qm9va2luZ0Vycm9yKG51bGwpOyBzZXRCb29raW5nU3VjY2VzcyhmYWxzZSk7IH19IHN0eWxlPXt7IGJhY2tncm91bmQ6ICdub25lJywgYm9yZGVyOiAnbm9uZScsIGNvbG9yOiAndmFyKC0tdGV4dC1oZWFkZXIpJywgZm9udFNpemU6ICcyMHB4JywgcGFkZGluZzogMCB9fT7ihpA8L2J1dHRvbj5cclxuICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJhY3Rpdml0eS10aXRsZVwiIHN0eWxlPXt7IG1hcmdpbjogMCwgY29sb3I6ICd2YXIoLS10ZXh0LWhlYWRlciknIH19PntzZWxlY3RlZFJpZGUuZGVzdGluYXRpb24gPyBgQm9vayBSaWRlIHRvICR7c2VsZWN0ZWRSaWRlLmRlc3RpbmF0aW9ufWAgOiAnQm9vayBSaWRlJ308L2gxPlxyXG4gICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXV0aC1jYXJkXCI+XHJcbiAgICAgICAgICA8aDMgc3R5bGU9e3sgbWFyZ2luVG9wOiAwLCBjb2xvcjogJ3ZhcigtLXRleHQtdHlwZWQpJyB9fT5TZWxlY3QgUGlja3VwIExvY2F0aW9uPC9oMz5cclxuICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMTRweCcsIGNvbG9yOiAndmFyKC0tdGV4dC1sYWJlbCknLCBtYXJnaW5Cb3R0b206ICcxNnB4JyB9fT5DbGljayBvbiB0aGUgbWFwIHRvIHNldCB5b3VyIGV4YWN0IHBpY2t1cCBzcG90LjwvcD5cclxuICAgICAgICAgIDxSaWRlUmVuZGVyTWFwIHJpZGVJZD17c2VsZWN0ZWRSaWRlLmlkfSBoZWlnaHQ9XCIzNTBweFwiIG9uUGlja3VwU2VsZWN0PXsobGF0LCBsbmcpID0+IHNldFBpY2t1cENvb3Jkcyh7IGxhdCwgbG5nIH0pfSAvPlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6ICcyMHB4JyB9fT5cclxuICAgICAgICAgICAge2Jvb2tpbmdFcnJvciAmJiA8cCBzdHlsZT17eyBjb2xvcjogJyNkMzJmMmYnLCBmb250U2l6ZTogJzE0cHgnLCBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e2Jvb2tpbmdFcnJvcn08L3A+fVxyXG4gICAgICAgICAgICB7Ym9va2luZ1N1Y2Nlc3MgJiYgPHAgY2xhc3NOYW1lPVwiYXV0aC1hbGVydC1zdWNjZXNzXCI+Qm9va2luZyByZXF1ZXN0IHNlbnQgc3VjY2Vzc2Z1bGx5ITwvcD59XHJcbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYXV0aC1zdWJtaXRcIiBvbkNsaWNrPXtoYW5kbGVCb29rUmlkZX0gZGlzYWJsZWQ9e2Jvb2tpbmdMb2FkaW5nIHx8IGJvb2tpbmdTdWNjZXNzfSBzdHlsZT17eyBvcGFjaXR5OiBib29raW5nTG9hZGluZyB8fCBib29raW5nU3VjY2VzcyA/IDAuNyA6IDEgfX0+XHJcbiAgICAgICAgICAgICAge2Jvb2tpbmdMb2FkaW5nID8gJ1JlcXVlc3RpbmcuLi4nIDogcGlja3VwQ29vcmRzID8gJ0NvbmZpcm0gUGlja3VwICYgUmVxdWVzdCcgOiAnUmVxdWVzdCBXaXRob3V0IFNwZWNpZmljIFBpY2t1cCd9XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IGZvcm1hdERhdGVPbmx5ID0gKGlzbz86IHN0cmluZykgPT4gaXNvID8gbmV3IERhdGUoaXNvKS50b0xvY2FsZVN0cmluZygnZW4tR0InLCB7IHdlZWtkYXk6ICdsb25nJywgZGF5OiAnbnVtZXJpYycsIG1vbnRoOiAnbG9uZycgfSkgOiAnRmxleGlibGUnO1xyXG4gIGNvbnN0IGZvcm1hdFRpbWVPbmx5ID0gKGlzbz86IHN0cmluZykgPT4gaXNvID8gbmV3IERhdGUoaXNvKS50b0xvY2FsZVN0cmluZygnZW4tR0InLCB7IGhvdXI6ICcyLWRpZ2l0JywgbWludXRlOiAnMi1kaWdpdCcgfSkgOiAnJztcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJyB9fT5cclxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJ1YmVyLWhlYWRlclwiPjxoMSBjbGFzc05hbWU9XCJhY3Rpdml0eS10aXRsZVwiIHN0eWxlPXt7IGNvbG9yOiAndmFyKC0tdGV4dC1oZWFkZXIpJyB9fT5SZXF1ZXN0IGEgUmlkZTwvaDE+PC9oZWFkZXI+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXV0aC1jYXJkXCIgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAnMjRweCcgfX0+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhdXRoLWZpZWxkXCI+XHJcbiAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiYXV0aC1sYWJlbFwiIGh0bWxGb3I9XCJwaWNrdXAtYXJlYVwiPlBpY2stdXAgYXJlYSAob3B0aW9uYWwpPC9sYWJlbD5cclxuICAgICAgICAgIDxpbnB1dCBpZD1cInBpY2t1cC1hcmVhXCIgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJhdXRoLWlucHV0XCIgc3R5bGU9e3sgY29sb3JTY2hlbWU6ICdsaWdodCcgfX0gcGxhY2Vob2xkZXI9XCJlLmcuIE9sZGZpZWxkIFBhcmtcIiB2YWx1ZT17b3JpZ2luSW5wdXR9IG9uQ2hhbmdlPXsoZSkgPT4gc2V0T3JpZ2luSW5wdXQoZS50YXJnZXQudmFsdWUpfSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXV0aC1maWVsZFwiPlxyXG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImF1dGgtbGFiZWxcIiBodG1sRm9yPVwiZGVzdGluYXRpb24taW5wdXRcIj5EZXN0aW5hdGlvbjwvbGFiZWw+XHJcbiAgICAgICAgICA8aW5wdXQgaWQ9XCJkZXN0aW5hdGlvbi1pbnB1dFwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwiYXV0aC1pbnB1dFwiIHN0eWxlPXt7IGNvbG9yU2NoZW1lOiAnbGlnaHQnIH19IHBsYWNlaG9sZGVyPVwiZS5nLiBVbml2ZXJzaXR5IG9mIEJhdGhcIiB2YWx1ZT17ZGVzdGluYXRpb25JbnB1dH0gb25DaGFuZ2U9eyhlKSA9PiBzZXREZXN0aW5hdGlvbklucHV0KGUudGFyZ2V0LnZhbHVlKX0gLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImF1dGgtZmllbGRcIj5cclxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJhdXRoLWxhYmVsXCIgaHRtbEZvcj1cImFycml2YWwtdGltZVwiPlRpbWUgb2YgYXJyaXZhbCAob3B0aW9uYWwpPC9sYWJlbD5cclxuICAgICAgICAgIDxpbnB1dCBpZD1cImFycml2YWwtdGltZVwiIHR5cGU9XCJkYXRldGltZS1sb2NhbFwiIGNsYXNzTmFtZT1cImF1dGgtaW5wdXRcIiBzdHlsZT17eyBjb2xvclNjaGVtZTogJ2xpZ2h0JyB9fSB2YWx1ZT17dGltZUlucHV0fSBvbkNoYW5nZT17KGUpID0+IHNldFRpbWVJbnB1dChlLnRhcmdldC52YWx1ZSl9IC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJhdXRoLXN1Ym1pdFwiIG9uQ2xpY2s9e2hhbmRsZVNlYXJjaH0gZGlzYWJsZWQ9e2xvYWRpbmd9IHN0eWxlPXt7IG1hcmdpblRvcDogJzEycHgnIH19Pntsb2FkaW5nID8gJ1NlYXJjaGluZy4uLicgOiAnU2VhcmNoIFJpZGVzJ308L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIHtlcnJvciAmJiA8cCBzdHlsZT17eyBjb2xvcjogJyNkMzJmMmYnLCBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e2Vycm9yfTwvcD59XHJcbiAgICAgIHshbG9hZGluZyAmJiAhZXJyb3IgJiYgaGFzU2VhcmNoZWQgJiYgcmlkZXMubGVuZ3RoID4gMCAmJiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXN0LWxpc3RcIj5cclxuICAgICAgICAgIHtyaWRlcy5tYXAoKHJpZGUpID0+IChcclxuICAgICAgICAgICAgPGRpdiBrZXk9e3JpZGUuaWR9IGNsYXNzTmFtZT1cImNhcmQgdHJpcC1yb3ctY2FyZFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0cmlwLWNhci1pY29uXCI+8J+alzwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0cmlwLXJvdy10ZXh0XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctdGl0bGVcIj57cmlkZS5kZXN0aW5hdGlvbiB8fCBgUmlkZSAjJHtyaWRlLmlkfWB9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctbWV0YVwiPntmb3JtYXREYXRlT25seShyaWRlLmRlcGFydHVyZV90aW1lKX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAge3JpZGUuZGVwYXJ0dXJlX3RpbWUgJiYgPGRpdiBjbGFzc05hbWU9XCJ0cmlwLXJvdy1tZXRhXCI+e2Zvcm1hdFRpbWVPbmx5KHJpZGUuZGVwYXJ0dXJlX3RpbWUpfTwvZGl2Pn1cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0cmlwLXJvdy1tZXRhXCI+RnJvbToge3JpZGUub3JpZ2luIHx8ICfigJQnfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICB7cmlkZS5kcml2ZXJfbmFtZSAmJiA8ZGl2IGNsYXNzTmFtZT1cInRyaXAtcm93LW1ldGFcIj5Ecml2ZXI6IHtyaWRlLmRyaXZlcl9uYW1lfTwvZGl2Pn1cclxuICAgICAgICAgICAgICAgICAge3JpZGUuZHJpdmVyX3JhdGluZyAhPT0gdW5kZWZpbmVkICYmIHJpZGUuZHJpdmVyX3JhdGluZyA+IDAgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctbWV0YVwiPuKtkCB7cmlkZS5kcml2ZXJfcmF0aW5nLnRvRml4ZWQoMSl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctcHJpY2VcIiBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLXRleHQtbGFiZWwpJywgZm9udFdlaWdodDogJ2JvbGQnIH19PnsnwqMyLjAwJ308L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwicGlsbCBwaWxsLXNvbGlkXCIgb25DbGljaz17KCkgPT4geyBzZXRTZWxlY3RlZFJpZGUocmlkZSk7IHNldFBpY2t1cENvb3JkcyhudWxsKTsgc2V0Qm9va2luZ0Vycm9yKG51bGwpOyBzZXRCb29raW5nU3VjY2VzcyhmYWxzZSk7IH19PlJlcXVlc3Q8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSZXF1ZXN0UmlkZVBhZ2U7Il0sImZpbGUiOiJDOi9Vc2Vycy95bGFubi92c2NvZGUvVW5pL1NhbXVkaHlhblJpZGVzL2Zyb250ZW5kL3NyYy9SZXF1ZXN0UmlkZVBhZ2UudHN4In0=