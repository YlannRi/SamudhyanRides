import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/JourneyPage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=b8f2434d"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$(), _s2 = $RefreshSig$(), _s3 = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=b8f2434d"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useEffect = __vite__cjsImport1_react["useEffect"]; const useState = __vite__cjsImport1_react["useState"];
import "/src/JourneyPage.css";
import { DetailRow, Icons } from "/src/App.tsx";
import { Btn } from "/src/App.tsx";
import { RideRenderMap } from "/src/components/Map/RideRenderMap.tsx";
import { apiFetch } from "/src/lib/api.ts";
const UserJourney = ({ trips, onOpenChat }) => {
  _s();
  const [activeTripIdx, setActiveTripIdx] = useState(0);
  const [routeData, setRouteData] = useState(null);
  if (trips.length === 0) {
    return /* @__PURE__ */ jsxDEV("div", { className: "journey-content", style: { alignItems: "center", marginTop: "60px", color: "var(--text-secondary)" }, children: [
      /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "48px", marginBottom: "16px" }, children: "🗺️" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 17,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.17em", margin: 0, fontWeight: 700 }, children: "No Active Journeys" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 18,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { children: "You don't have any rides currently in progress." }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 19,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 16,
      columnNumber: 7
    }, this);
  }
  const trip = trips[activeTripIdx];
  const ride = trip.ride || {};
  const driver = ride.driver || {};
  const driverName = driver.first_name ? `${driver.first_name} ${driver.last_name}` : "Unknown Driver";
  const departureDate = new Date(ride.departure_time || trip.pickup_time);
  let timeOfArrival = isNaN(departureDate.getTime()) ? "Pending" : departureDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (routeData && routeData.times && routeData.times.pickups) {
    const myPickup = routeData.times.pickups.find((p) => p.booking_ids && p.booking_ids.includes(trip.id));
    if (myPickup && myPickup.estimated_time) {
      const dt = new Date(myPickup.estimated_time);
      if (!isNaN(dt.getTime())) {
        timeOfArrival = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
    }
  }
  return /* @__PURE__ */ jsxDEV("div", { className: "journey-content", children: [
    trips.length > 1 && /* @__PURE__ */ jsxDEV("div", { className: "passenger-tabs", children: trips.map(
      (t, i) => /* @__PURE__ */ jsxDEV(
        "button",
        {
          className: `passenger-tab ${i !== activeTripIdx ? "passenger-tab-active" : ""}`,
          onClick: () => setActiveTripIdx(i),
          children: [
            "Ride #",
            t.ride_id
          ]
        },
        t.id,
        true,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 49,
          columnNumber: 9
        },
        this
      )
    ) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 47,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "journey-driver-header", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "journey-driver-avatar", children: driverName[0] }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 62,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "journey-driver-info", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "journey-driver-name", children: driverName }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 64,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "journey-driver-sub", children: "Your Driver" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 65,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 63,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "journey-arriving-badge", children: [
        Icons.clock,
        /* @__PURE__ */ jsxDEV("span", { children: [
          "Departure ",
          timeOfArrival
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 69,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 67,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 61,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { style: { marginBottom: "16px" }, children: /* @__PURE__ */ jsxDEV(
      RideRenderMap,
      {
        rideId: trip.ride_id,
        height: "300px",
        interactive: true,
        onRouteData: setRouteData,
        existingPickup: trip.pickup_lat && trip.pickup_lng ? { lat: trip.pickup_lat, lng: trip.pickup_lng } : void 0
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 75,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 74,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "journey-code-card", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "journey-code-label", children: "Pick Up Code" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 90,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "journey-code-value", children: trip.pickup_code || "----" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 91,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 89,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "journey-passenger-card", children: [
      /* @__PURE__ */ jsxDEV(DetailRow, { label: "Destination", value: trip.dropoff_location || ride.destination || "—" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 96,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DetailRow, { label: "Vehicle", value: trip.vehicle?.car_model ?? "Vauxhall Corsa" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 97,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DetailRow, { label: "Numberplate", value: trip.vehicle?.number_plate ?? "DC14 HAE" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 98,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DetailRow, { label: routeData ? "Estimated Pickup" : "Departure Time", value: timeOfArrival }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 99,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(DetailRow, { label: "Cost", value: `£2.00`, valueClass: "detail-price" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 100,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 95,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "journey-actions", children: [
      /* @__PURE__ */ jsxDEV("button", { className: "sheet-action-btn btn-message", onClick: () => trip.ride_id && onOpenChat?.(String(trip.ride_id)), children: [
        Icons.message,
        " Message Driver"
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 105,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(Btn, { cls: "btn-report", icon: Icons.report, label: "Report Issue" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 108,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 104,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
    lineNumber: 44,
    columnNumber: 5
  }, this);
};
_s(UserJourney, "ZyeKDvX2be2OqvIX9HTq4G/O8n8=");
_c = UserJourney;
const DriverJourney = ({ rides, onComplete, onOpenChat }) => {
  _s2();
  const [activeRideIdx, setActiveRideIdx] = useState(0);
  const [currentPassIdx, setCurrentPassIdx] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [confirmedPickups, setConfirmedPickups] = useState(/* @__PURE__ */ new Set());
  const [isCompleting, setIsCompleting] = useState(false);
  const [routeData, setRouteData] = useState(null);
  if (rides.length === 0) {
    return /* @__PURE__ */ jsxDEV("div", { className: "journey-content", style: { alignItems: "center", marginTop: "60px", color: "var(--text-secondary)" }, children: [
      /* @__PURE__ */ jsxDEV("div", { style: { fontSize: "48px", marginBottom: "16px" }, children: "🚗" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 126,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("h2", { style: { fontSize: "1.17em", margin: 0, fontWeight: 700 }, children: "No Active Drives" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 127,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { children: "You are not currently driving any active routes." }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 128,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 125,
      columnNumber: 7
    }, this);
  }
  const activeRide = rides[activeRideIdx];
  const confirmedBookings = (activeRide.bookings || []).filter((b) => b.status === "confirmed");
  const currentPassenger = confirmedBookings[currentPassIdx];
  const isConfirmed = currentPassenger && confirmedPickups.has(currentPassenger.id);
  const handleConfirm = () => {
    if (currentPassenger) {
      setConfirmedPickups((prev) => /* @__PURE__ */ new Set([...prev, currentPassenger.id]));
      setRefreshTrigger((prev) => prev + 1);
    }
  };
  const handleCompleteRideClick = async () => {
    setIsCompleting(true);
    await onComplete(activeRide.id);
    setIsCompleting(false);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "journey-content", children: [
    rides.length > 1 && /* @__PURE__ */ jsxDEV("div", { className: "passenger-tabs", style: { marginBottom: "16px" }, children: rides.map(
      (r, i) => /* @__PURE__ */ jsxDEV(
        "button",
        {
          className: `passenger-tab ${i !== activeRideIdx ? "passenger-tab-active" : ""}`,
          onClick: () => {
            setActiveRideIdx(i);
            setCurrentPassIdx(0);
          },
          children: [
            "Route: ",
            r.destination
          ]
        },
        r.id,
        true,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 157,
          columnNumber: 9
        },
        this
      )
    ) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 155,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "journey-driver-mode-header", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "journey-mode-sub", children: "Pick Up Order" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 173,
        columnNumber: 9
      }, this),
      routeData && routeData.times && routeData.times.driver_leave && /* @__PURE__ */ jsxDEV("div", { className: "journey-arriving-badge", style: { marginTop: "8px", display: "inline-flex" }, children: [
        Icons.clock,
        /* @__PURE__ */ jsxDEV("span", { children: [
          "Leave By ",
          new Date(routeData.times.driver_leave).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 177,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 175,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 172,
      columnNumber: 7
    }, this),
    confirmedBookings.length > 0 ? /* @__PURE__ */ jsxDEV("div", { className: "passenger-tabs", children: confirmedBookings.map((b, i) => {
      const passName = b.passenger ? `${b.passenger.first_name} ${b.passenger.last_name}` : `Pass ${b.id}`;
      const isDone = confirmedPickups.has(b.id);
      return /* @__PURE__ */ jsxDEV(
        "button",
        {
          className: `passenger-tab${i !== currentPassIdx ? " passenger-tab-active" : ""}${isDone ? " passenger-tab-done" : ""}`,
          onClick: () => setCurrentPassIdx(i),
          children: [
            passName.split(" ")[0],
            isDone && /* @__PURE__ */ jsxDEV("span", { className: "tab-done-dot", children: "✓" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
              lineNumber: 195,
              columnNumber: 28
            }, this)
          ]
        },
        b.id,
        true,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 189,
          columnNumber: 13
        },
        this
      );
    }) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 184,
      columnNumber: 7
    }, this) : /* @__PURE__ */ jsxDEV("p", { style: { textAlign: "center", color: "var(--text-secondary)", fontSize: "14px", marginBottom: "16px" }, children: "No confirmed passengers for this ride." }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 201,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { style: { marginBottom: "16px", marginTop: "16px" }, children: /* @__PURE__ */ jsxDEV(
      RideRenderMap,
      {
        rideId: activeRide.id,
        height: "300px",
        interactive: true,
        refreshTrigger,
        driverMode: true,
        confirmedPickupIds: Array.from(confirmedPickups),
        onRouteData: setRouteData
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 208,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 207,
      columnNumber: 7
    }, this),
    currentPassenger && /* @__PURE__ */ jsxDEV("div", { className: "journey-passenger-card", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "journey-passenger-header", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "journey-passenger-avatar", children: currentPassenger.passenger?.first_name ? currentPassenger.passenger.first_name[0] : "U" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 223,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "journey-passenger-info", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "journey-passenger-name", children: currentPassenger.passenger ? `${currentPassenger.passenger.first_name} ${currentPassenger.passenger.last_name}` : "Unknown" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
            lineNumber: 227,
            columnNumber: 15
          }, this),
          currentPassenger.passenger?.rider_rating !== void 0 ? /* @__PURE__ */ jsxDEV("div", { className: "journey-passenger-rating", children: [
            "⭐ ",
            currentPassenger.passenger.rider_rating
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
            lineNumber: 231,
            columnNumber: 13
          }, this) : /* @__PURE__ */ jsxDEV("div", { className: "journey-passenger-rating no-rating", children: "No rating yet" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
            lineNumber: 233,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 226,
          columnNumber: 13
        }, this),
        isConfirmed && /* @__PURE__ */ jsxDEV("div", { className: "journey-confirmed-badge", children: "Picked Up ✓" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 237,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 222,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "sheet-details-card journey-passenger-details", children: [
        /* @__PURE__ */ jsxDEV(DetailRow, { label: "Pick Up", value: /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "detail-pin", children: Icons.pin }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
            lineNumber: 242,
            columnNumber: 49
          }, this),
          currentPassenger.pickup_location || "Map Point"
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 242,
          columnNumber: 47
        }, this) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 242,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(DetailRow, { label: "Cost", value: `£2.00`, valueClass: "detail-price" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 243,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(DetailRow, { label: "Code", value: currentPassenger.pickup_code || "----", valueClass: "detail-value" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 244,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 241,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 221,
      columnNumber: 7
    }, this),
    currentPassenger && /* @__PURE__ */ jsxDEV("div", { className: "journey-actions", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          className: "sheet-action-btn btn-message",
          onClick: () => onOpenChat?.(String(activeRide.id), currentPassenger.passenger?.id ?? currentPassenger.passenger_id),
          children: [
            Icons.message,
            " Message"
          ]
        },
        void 0,
        true,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
          lineNumber: 252,
          columnNumber: 11
        },
        this
      ),
      !isConfirmed ? /* @__PURE__ */ jsxDEV("button", { className: "sheet-action-btn btn-accept journey-confirm-btn", onClick: handleConfirm, children: [
        Icons.check,
        " Confirm Pick Up"
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 259,
        columnNumber: 9
      }, this) : /* @__PURE__ */ jsxDEV("button", { className: "sheet-action-btn btn-accept journey-confirm-btn journey-confirm-done", disabled: true, children: [
        Icons.check,
        " Picked Up"
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 263,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 251,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "journey-actions", style: { marginTop: "12px" }, children: /* @__PURE__ */ jsxDEV(
      "button",
      {
        className: "sheet-action-btn",
        style: { background: "#22c55e", color: "#fff", border: "none" },
        onClick: handleCompleteRideClick,
        disabled: isCompleting,
        children: isCompleting ? "Completing..." : "🏁 Complete Ride"
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 272,
        columnNumber: 9
      },
      this
    ) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 271,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
    lineNumber: 152,
    columnNumber: 5
  }, this);
};
_s2(DriverJourney, "j5aqoMtbYTUlEQwk2WVZRMp1ECg=");
_c2 = DriverJourney;
const JourneyPage = ({ canUseDriverMode, onDriverSignup, onOpenChat, mode, onModeChange }) => {
  _s3();
  const [internalMode, setInternalMode] = useState("user");
  const currentMode = mode ?? internalMode;
  const setCurrentMode = (nextMode) => {
    if (mode === void 0) {
      setInternalMode(nextMode);
    }
    onModeChange?.(nextMode);
  };
  const [activeUserTrips, setActiveUserTrips] = useState([]);
  const [activeDriverRides, setActiveDriverRides] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!canUseDriverMode && currentMode === "driver") {
      setCurrentMode("user");
    }
  }, [canUseDriverMode, currentMode]);
  const fetchActiveJourneys = async () => {
    setLoading(true);
    try {
      const userTrips = await apiFetch("bookings/me", { method: "GET" });
      const activeBookings = userTrips.filter((b) => b.status === "confirmed" && b.ride?.status === "in_progress");
      const enriched = await Promise.all(
        activeBookings.map(async (b) => {
          try {
            const vehicle = await apiFetch(`bookings/rides/${b.ride_id}/vehicle`, { method: "GET" });
            return { ...b, vehicle };
          } catch (e) {
            console.error("Vehicle fetch failed for ride", b.ride_id, e);
          }
          return b;
        })
      );
      setActiveUserTrips(enriched);
      const driverData = await apiFetch("rides/driver/dashboard", { method: "GET" });
      const activeRides = driverData.filter((r) => r.status === "in_progress");
      setActiveDriverRides(activeRides);
    } catch (err) {
      console.error("Error fetching journeys:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchActiveJourneys();
  }, [currentMode]);
  const handleCompleteRide = async (rideId) => {
    try {
      await apiFetch(`bookings/rides/${rideId}/complete`, { method: "POST" });
      setActiveDriverRides((prev) => prev.filter((r) => r.id !== rideId));
    } catch (error) {
      console.error("Error completing ride:", error);
      alert("Could not complete the ride. Please try again.");
    }
  };
  return /* @__PURE__ */ jsxDEV(Fragment, { children: [
    /* @__PURE__ */ jsxDEV("header", { className: "uber-header", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "activity-title", children: "Journey" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 373,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "top-toggle", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: `toggle-tab ${currentMode === "user" ? "toggle-tab-active" : ""}`,
            onClick: () => setCurrentMode("user"),
            children: "Rider"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
            lineNumber: 376,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: `toggle-tab ${currentMode === "driver" ? "toggle-tab-active" : ""}`,
            onClick: () => {
              if (!canUseDriverMode) return onDriverSignup();
              setCurrentMode("driver");
            },
            children: "Driver"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
            lineNumber: 383,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
        lineNumber: 375,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 372,
      columnNumber: 7
    }, this),
    loading ? /* @__PURE__ */ jsxDEV("p", { style: { textAlign: "center", marginTop: "40px", color: "var(--text-secondary)" }, children: "Loading your journeys..." }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 396,
      columnNumber: 7
    }, this) : currentMode === "user" ? /* @__PURE__ */ jsxDEV(UserJourney, { trips: activeUserTrips, onOpenChat }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 399,
      columnNumber: 7
    }, this) : /* @__PURE__ */ jsxDEV(DriverJourney, { rides: activeDriverRides, onComplete: handleCompleteRide, onOpenChat }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
      lineNumber: 401,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx",
    lineNumber: 371,
    columnNumber: 5
  }, this);
};
_s3(JourneyPage, "p2nN4x+GWKVc0RATuxvFuOshOrI=");
_c3 = JourneyPage;
export default JourneyPage;
var _c, _c2, _c3;
$RefreshReg$(_c, "UserJourney");
$RefreshReg$(_c2, "DriverJourney");
$RefreshReg$(_c3, "JourneyPage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/JourneyPage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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QUFBQSxZQUFFO0FBQUE7QUFBQSxVQUZ4QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLQTtBQUFBLFFBRUE7QUFBQSxVQUFDO0FBQUE7QUFBQSxZQUNDLFdBQVcsY0FBY0QsZ0JBQWdCLFdBQVcsc0JBQXNCLEVBQUU7QUFBQSxZQUM1RSxTQUFTLE1BQU07QUFDYixrQkFBSSxDQUFDUCxpQkFBa0IsUUFBT0MsZUFBZTtBQUM3Q08sNkJBQWUsUUFBUTtBQUFBLFlBQ3pCO0FBQUEsWUFBRTtBQUFBO0FBQUEsVUFMSjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFRQTtBQUFBLFdBaEJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFpQkE7QUFBQSxTQXBCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBcUJBO0FBQUEsSUFFQ00sVUFDQyx1QkFBQyxPQUFFLE9BQU8sRUFBRTFCLFdBQVcsVUFBVXRGLFdBQVcsUUFBUUMsT0FBTyx3QkFBd0IsR0FBRyx3Q0FBdEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUE4RyxJQUU5R3dHLGdCQUFnQixTQUNkLHVCQUFDLGVBQVksT0FBT0csaUJBQWlCLGNBQXJDO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBNEQsSUFFNUQsdUJBQUMsaUJBQWMsT0FBT0UsbUJBQW1CLFlBQVlpQixvQkFBb0IsY0FBekU7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFnRztBQUFBLE9BOUJ0RztBQUFBO0FBQUE7QUFBQTtBQUFBLFNBaUNBO0FBRUo7QUFBRXpCLElBdkhJTCxhQU1KO0FBQUFpQyxNQU5JakM7QUF5SE4sZUFBZUE7QUFBWSxJQUFBOUMsSUFBQTZDLEtBQUFrQztBQUFBQyxhQUFBaEYsSUFBQTtBQUFBZ0YsYUFBQW5DLEtBQUE7QUFBQW1DLGFBQUFELEtBQUEiLCJuYW1lcyI6WyJSZWFjdCIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiRGV0YWlsUm93IiwiSWNvbnMiLCJCdG4iLCJSaWRlUmVuZGVyTWFwIiwiYXBpRmV0Y2giLCJVc2VySm91cm5leSIsInRyaXBzIiwib25PcGVuQ2hhdCIsIl9zIiwiYWN0aXZlVHJpcElkeCIsInNldEFjdGl2ZVRyaXBJZHgiLCJyb3V0ZURhdGEiLCJzZXRSb3V0ZURhdGEiLCJsZW5ndGgiLCJhbGlnbkl0ZW1zIiwibWFyZ2luVG9wIiwiY29sb3IiLCJmb250U2l6ZSIsIm1hcmdpbkJvdHRvbSIsIm1hcmdpbiIsImZvbnRXZWlnaHQiLCJ0cmlwIiwicmlkZSIsImRyaXZlciIsImRyaXZlck5hbWUiLCJmaXJzdF9uYW1lIiwibGFzdF9uYW1lIiwiZGVwYXJ0dXJlRGF0ZSIsIkRhdGUiLCJkZXBhcnR1cmVfdGltZSIsInBpY2t1cF90aW1lIiwidGltZU9mQXJyaXZhbCIsImlzTmFOIiwiZ2V0VGltZSIsInRvTG9jYWxlVGltZVN0cmluZyIsImhvdXIiLCJtaW51dGUiLCJ0aW1lcyIsInBpY2t1cHMiLCJteVBpY2t1cCIsImZpbmQiLCJwIiwiYm9va2luZ19pZHMiLCJpbmNsdWRlcyIsImlkIiwiZXN0aW1hdGVkX3RpbWUiLCJkdCIsIm1hcCIsInQiLCJpIiwicmlkZV9pZCIsImNsb2NrIiwicGlja3VwX2xhdCIsInBpY2t1cF9sbmciLCJsYXQiLCJsbmciLCJ1bmRlZmluZWQiLCJwaWNrdXBfY29kZSIsImRyb3BvZmZfbG9jYXRpb24iLCJkZXN0aW5hdGlvbiIsInZlaGljbGUiLCJjYXJfbW9kZWwiLCJudW1iZXJfcGxhdGUiLCJTdHJpbmciLCJtZXNzYWdlIiwicmVwb3J0IiwiX2MiLCJEcml2ZXJKb3VybmV5IiwicmlkZXMiLCJvbkNvbXBsZXRlIiwiX3MyIiwiYWN0aXZlUmlkZUlkeCIsInNldEFjdGl2ZVJpZGVJZHgiLCJjdXJyZW50UGFzc0lkeCIsInNldEN1cnJlbnRQYXNzSWR4IiwicmVmcmVzaFRyaWdnZXIiLCJzZXRSZWZyZXNoVHJpZ2dlciIsImNvbmZpcm1lZFBpY2t1cHMiLCJzZXRDb25maXJtZWRQaWNrdXBzIiwiU2V0IiwiaXNDb21wbGV0aW5nIiwic2V0SXNDb21wbGV0aW5nIiwiYWN0aXZlUmlkZSIsImNvbmZpcm1lZEJvb2tpbmdzIiwiYm9va2luZ3MiLCJmaWx0ZXIiLCJiIiwic3RhdHVzIiwiY3VycmVudFBhc3NlbmdlciIsImlzQ29uZmlybWVkIiwiaGFzIiwiaGFuZGxlQ29uZmlybSIsInByZXYiLCJoYW5kbGVDb21wbGV0ZVJpZGVDbGljayIsInIiLCJkcml2ZXJfbGVhdmUiLCJkaXNwbGF5IiwicGFzc05hbWUiLCJwYXNzZW5nZXIiLCJpc0RvbmUiLCJzcGxpdCIsInRleHRBbGlnbiIsIkFycmF5IiwiZnJvbSIsInJpZGVyX3JhdGluZyIsInBpbiIsInBpY2t1cF9sb2NhdGlvbiIsInBhc3Nlbmdlcl9pZCIsImNoZWNrIiwiYmFja2dyb3VuZCIsImJvcmRlciIsIl9jMiIsIkpvdXJuZXlQYWdlIiwiY2FuVXNlRHJpdmVyTW9kZSIsIm9uRHJpdmVyU2lnbnVwIiwibW9kZSIsIm9uTW9kZUNoYW5nZSIsIl9zMyIsImludGVybmFsTW9kZSIsInNldEludGVybmFsTW9kZSIsImN1cnJlbnRNb2RlIiwic2V0Q3VycmVudE1vZGUiLCJuZXh0TW9kZSIsImFjdGl2ZVVzZXJUcmlwcyIsInNldEFjdGl2ZVVzZXJUcmlwcyIsImFjdGl2ZURyaXZlclJpZGVzIiwic2V0QWN0aXZlRHJpdmVyUmlkZXMiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImZldGNoQWN0aXZlSm91cm5leXMiLCJ1c2VyVHJpcHMiLCJtZXRob2QiLCJhY3RpdmVCb29raW5ncyIsImVucmljaGVkIiwiUHJvbWlzZSIsImFsbCIsImUiLCJjb25zb2xlIiwiZXJyb3IiLCJkcml2ZXJEYXRhIiwiYWN0aXZlUmlkZXMiLCJlcnIiLCJoYW5kbGVDb21wbGV0ZVJpZGUiLCJyaWRlSWQiLCJhbGVydCIsIl9jMyIsIiRSZWZyZXNoUmVnJCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJKb3VybmV5UGFnZS50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCAnLi9Kb3VybmV5UGFnZS5jc3MnO1xyXG5pbXBvcnQgeyBEZXRhaWxSb3csIEljb25zIH0gZnJvbSAnLi9BcHAnO1xyXG5pbXBvcnQgeyBCdG4gfSBmcm9tICcuL0FwcC50c3gnO1xyXG5pbXBvcnQgeyBSaWRlUmVuZGVyTWFwIH0gZnJvbSAnLi9jb21wb25lbnRzL01hcC9SaWRlUmVuZGVyTWFwJztcclxuaW1wb3J0IHsgYXBpRmV0Y2ggfSBmcm9tICcuL2xpYi9hcGknO1xyXG5cclxuXHJcbi8vIFVzZXIgSm91cm5leSBWaWV3XHJcbmNvbnN0IFVzZXJKb3VybmV5OiBSZWFjdC5GQzx7IHRyaXBzOiBhbnlbXTsgb25PcGVuQ2hhdD86IChyaWRlSWQ6IHN0cmluZywgcGFydGljaXBhbnRJZD86IHN0cmluZykgPT4gdm9pZCB9PiA9ICh7IHRyaXBzLCBvbk9wZW5DaGF0IH0pID0+IHtcclxuICBjb25zdCBbYWN0aXZlVHJpcElkeCwgc2V0QWN0aXZlVHJpcElkeF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbcm91dGVEYXRhLCBzZXRSb3V0ZURhdGFdID0gdXNlU3RhdGU8YW55PihudWxsKTtcclxuXHJcbiAgaWYgKHRyaXBzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJqb3VybmV5LWNvbnRlbnRcIiBzdHlsZT17eyBhbGlnbkl0ZW1zOiAnY2VudGVyJywgbWFyZ2luVG9wOiAnNjBweCcsIGNvbG9yOiAndmFyKC0tdGV4dC1zZWNvbmRhcnkpJyB9fT5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAnNDhweCcsIG1hcmdpbkJvdHRvbTogJzE2cHgnIH19PvCfl7rvuI88L2Rpdj5cclxuICAgICAgICA8aDIgc3R5bGU9e3sgZm9udFNpemU6ICcxLjE3ZW0nLCBtYXJnaW46IDAsIGZvbnRXZWlnaHQ6IDcwMCB9fT5ObyBBY3RpdmUgSm91cm5leXM8L2gyPlxyXG4gICAgICAgIDxwPllvdSBkb24ndCBoYXZlIGFueSByaWRlcyBjdXJyZW50bHkgaW4gcHJvZ3Jlc3MuPC9wPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb25zdCB0cmlwID0gdHJpcHNbYWN0aXZlVHJpcElkeF07XHJcbiAgY29uc3QgcmlkZSA9IHRyaXAucmlkZSB8fCB7fTtcclxuICBjb25zdCBkcml2ZXIgPSByaWRlLmRyaXZlciB8fCB7fTtcclxuICBjb25zdCBkcml2ZXJOYW1lID0gZHJpdmVyLmZpcnN0X25hbWUgPyBgJHtkcml2ZXIuZmlyc3RfbmFtZX0gJHtkcml2ZXIubGFzdF9uYW1lfWAgOiAnVW5rbm93biBEcml2ZXInO1xyXG4gIC8vIEZvcm1hdCBkZXBhcnR1cmUgdGltZVxyXG4gIGNvbnN0IGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShyaWRlLmRlcGFydHVyZV90aW1lIHx8IHRyaXAucGlja3VwX3RpbWUpO1xyXG4gIGxldCB0aW1lT2ZBcnJpdmFsID0gaXNOYU4oZGVwYXJ0dXJlRGF0ZS5nZXRUaW1lKCkpID8gJ1BlbmRpbmcnIDogZGVwYXJ0dXJlRGF0ZS50b0xvY2FsZVRpbWVTdHJpbmcoW10sIHsgaG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0JyB9KTtcclxuXHJcbiAgLy8gVHJ5IHRvIHVzZSBjYWxjdWxhdGVkIHBpY2t1cCB0aW1lIGlmIHJvdXRlRGF0YSBpcyBhdmFpbGFibGVcclxuICBpZiAocm91dGVEYXRhICYmIHJvdXRlRGF0YS50aW1lcyAmJiByb3V0ZURhdGEudGltZXMucGlja3Vwcykge1xyXG4gICAgY29uc3QgbXlQaWNrdXAgPSByb3V0ZURhdGEudGltZXMucGlja3Vwcy5maW5kKChwOiBhbnkpID0+IHAuYm9va2luZ19pZHMgJiYgcC5ib29raW5nX2lkcy5pbmNsdWRlcyh0cmlwLmlkKSk7XHJcbiAgICBpZiAobXlQaWNrdXAgJiYgbXlQaWNrdXAuZXN0aW1hdGVkX3RpbWUpIHtcclxuICAgICAgY29uc3QgZHQgPSBuZXcgRGF0ZShteVBpY2t1cC5lc3RpbWF0ZWRfdGltZSk7XHJcbiAgICAgIGlmICghaXNOYU4oZHQuZ2V0VGltZSgpKSkge1xyXG4gICAgICAgIHRpbWVPZkFycml2YWwgPSBkdC50b0xvY2FsZVRpbWVTdHJpbmcoW10sIHsgaG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0JyB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiam91cm5leS1jb250ZW50XCI+XHJcbiAgICAgIHsvKiBNdWx0aXBsZSBBY3RpdmUgUmlkZXMgVG9nZ2xlICovfVxyXG4gICAgICB7dHJpcHMubGVuZ3RoID4gMSAmJiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXNzZW5nZXItdGFic1wiPlxyXG4gICAgICAgICAge3RyaXBzLm1hcCgodCwgaSkgPT4gKFxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAga2V5PXt0LmlkfVxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17YHBhc3Nlbmdlci10YWIgJHtpICE9PSBhY3RpdmVUcmlwSWR4ID8gJ3Bhc3Nlbmdlci10YWItYWN0aXZlJyA6ICcnfWB9XHJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0QWN0aXZlVHJpcElkeChpKX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIFJpZGUgI3t0LnJpZGVfaWR9XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgKSl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICl9XHJcblxyXG4gICAgICB7LyogRHJpdmVyIGhlYWRlciBjYXJkICovfVxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImpvdXJuZXktZHJpdmVyLWhlYWRlclwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiam91cm5leS1kcml2ZXItYXZhdGFyXCI+e2RyaXZlck5hbWVbMF19PC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJqb3VybmV5LWRyaXZlci1pbmZvXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImpvdXJuZXktZHJpdmVyLW5hbWVcIj57ZHJpdmVyTmFtZX08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiam91cm5leS1kcml2ZXItc3ViXCI+WW91ciBEcml2ZXI8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImpvdXJuZXktYXJyaXZpbmctYmFkZ2VcIj5cclxuICAgICAgICAgIHtJY29ucy5jbG9ja31cclxuICAgICAgICAgIDxzcGFuPkRlcGFydHVyZSB7dGltZU9mQXJyaXZhbH08L3NwYW4+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIE1hcCAqL31cclxuICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206ICcxNnB4JyB9fT5cclxuICAgICAgICA8UmlkZVJlbmRlck1hcFxyXG4gICAgICAgICAgcmlkZUlkPXt0cmlwLnJpZGVfaWR9XHJcbiAgICAgICAgICBoZWlnaHQ9XCIzMDBweFwiXHJcbiAgICAgICAgICBpbnRlcmFjdGl2ZT17dHJ1ZX1cclxuICAgICAgICAgIG9uUm91dGVEYXRhPXtzZXRSb3V0ZURhdGF9XHJcbiAgICAgICAgICBleGlzdGluZ1BpY2t1cD17XHJcbiAgICAgICAgICAgIHRyaXAucGlja3VwX2xhdCAmJiB0cmlwLnBpY2t1cF9sbmdcclxuICAgICAgICAgICAgICA/IHsgbGF0OiB0cmlwLnBpY2t1cF9sYXQsIGxuZzogdHJpcC5waWNrdXBfbG5nIH1cclxuICAgICAgICAgICAgICA6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIFBpY2t1cCBjb2RlICovfVxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImpvdXJuZXktY29kZS1jYXJkXCI+XHJcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiam91cm5leS1jb2RlLWxhYmVsXCI+UGljayBVcCBDb2RlPC9zcGFuPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImpvdXJuZXktY29kZS12YWx1ZVwiPnt0cmlwLnBpY2t1cF9jb2RlIHx8ICctLS0tJ308L3NwYW4+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIFRyaXAgZGV0YWlscyAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJqb3VybmV5LXBhc3Nlbmdlci1jYXJkXCI+XHJcbiAgICAgICAgPERldGFpbFJvdyBsYWJlbD1cIkRlc3RpbmF0aW9uXCIgdmFsdWU9e3RyaXAuZHJvcG9mZl9sb2NhdGlvbiB8fCByaWRlLmRlc3RpbmF0aW9uIHx8ICfigJQnfSAvPlxyXG4gICAgICAgIDxEZXRhaWxSb3cgbGFiZWw9XCJWZWhpY2xlXCIgdmFsdWU9e3RyaXAudmVoaWNsZT8uY2FyX21vZGVsID8/IFwiVmF1eGhhbGwgQ29yc2FcIn0gLz5cclxuICAgICAgICA8RGV0YWlsUm93IGxhYmVsPVwiTnVtYmVycGxhdGVcIiB2YWx1ZT17dHJpcC52ZWhpY2xlPy5udW1iZXJfcGxhdGUgPz8gXCJEQzE0IEhBRVwifSAvPlxyXG4gICAgICAgIDxEZXRhaWxSb3cgbGFiZWw9e3JvdXRlRGF0YSA/IFwiRXN0aW1hdGVkIFBpY2t1cFwiIDogXCJEZXBhcnR1cmUgVGltZVwifSB2YWx1ZT17dGltZU9mQXJyaXZhbH0gLz5cclxuICAgICAgICA8RGV0YWlsUm93IGxhYmVsPVwiQ29zdFwiIHZhbHVlPXtgwqMyLjAwYH0gdmFsdWVDbGFzcz1cImRldGFpbC1wcmljZVwiIC8+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIEFjdGlvbiAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJqb3VybmV5LWFjdGlvbnNcIj5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cInNoZWV0LWFjdGlvbi1idG4gYnRuLW1lc3NhZ2VcIiBvbkNsaWNrPXsoKSA9PiB0cmlwLnJpZGVfaWQgJiYgb25PcGVuQ2hhdD8uKFN0cmluZyh0cmlwLnJpZGVfaWQpKX0+XHJcbiAgICAgICAgICB7SWNvbnMubWVzc2FnZX0gTWVzc2FnZSBEcml2ZXJcclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8QnRuIGNscz1cImJ0bi1yZXBvcnRcIiBpY29uPXtJY29ucy5yZXBvcnR9IGxhYmVsPVwiUmVwb3J0IElzc3VlXCIgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuLy8g4pSA4pSA4pSAIERyaXZlciBKb3VybmV5IFZpZXcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXHJcbmNvbnN0IERyaXZlckpvdXJuZXk6IFJlYWN0LkZDPHsgcmlkZXM6IGFueVtdLCBvbkNvbXBsZXRlOiAocmlkZUlkOiBudW1iZXIpID0+IHZvaWQ7IG9uT3BlbkNoYXQ/OiAocmlkZUlkOiBzdHJpbmcsIHBhcnRpY2lwYW50SWQ/OiBzdHJpbmcpID0+IHZvaWQgfT4gPSAoeyByaWRlcywgb25Db21wbGV0ZSwgb25PcGVuQ2hhdCB9KSA9PiB7XHJcbiAgY29uc3QgW2FjdGl2ZVJpZGVJZHgsIHNldEFjdGl2ZVJpZGVJZHhdID0gdXNlU3RhdGUoMCk7XHJcbiAgY29uc3QgW2N1cnJlbnRQYXNzSWR4LCBzZXRDdXJyZW50UGFzc0lkeF0gPSB1c2VTdGF0ZSgwKTtcclxuICBjb25zdCBbcmVmcmVzaFRyaWdnZXIsIHNldFJlZnJlc2hUcmlnZ2VyXSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtjb25maXJtZWRQaWNrdXBzLCBzZXRDb25maXJtZWRQaWNrdXBzXSA9IHVzZVN0YXRlPFNldDxudW1iZXI+PihuZXcgU2V0KCkpO1xyXG4gIGNvbnN0IFtpc0NvbXBsZXRpbmcsIHNldElzQ29tcGxldGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgW3JvdXRlRGF0YSwgc2V0Um91dGVEYXRhXSA9IHVzZVN0YXRlPGFueT4obnVsbCk7XHJcblxyXG4gIGlmIChyaWRlcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiam91cm5leS1jb250ZW50XCIgc3R5bGU9e3sgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpblRvcDogJzYwcHgnLCBjb2xvcjogJ3ZhcigtLXRleHQtc2Vjb25kYXJ5KScgfX0+XHJcbiAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogJzQ4cHgnLCBtYXJnaW5Cb3R0b206ICcxNnB4JyB9fT7wn5qXPC9kaXY+XHJcbiAgICAgICAgPGgyIHN0eWxlPXt7IGZvbnRTaXplOiAnMS4xN2VtJywgbWFyZ2luOiAwLCBmb250V2VpZ2h0OiA3MDAgfX0+Tm8gQWN0aXZlIERyaXZlczwvaDI+XHJcbiAgICAgICAgPHA+WW91IGFyZSBub3QgY3VycmVudGx5IGRyaXZpbmcgYW55IGFjdGl2ZSByb3V0ZXMuPC9wPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBhY3RpdmVSaWRlID0gcmlkZXNbYWN0aXZlUmlkZUlkeF07XHJcbiAgY29uc3QgY29uZmlybWVkQm9va2luZ3MgPSAoYWN0aXZlUmlkZS5ib29raW5ncyB8fCBbXSkuZmlsdGVyKChiOiBhbnkpID0+IGIuc3RhdHVzID09PSAnY29uZmlybWVkJyk7XHJcbiAgY29uc3QgY3VycmVudFBhc3NlbmdlciA9IGNvbmZpcm1lZEJvb2tpbmdzW2N1cnJlbnRQYXNzSWR4XTtcclxuICBjb25zdCBpc0NvbmZpcm1lZCA9IGN1cnJlbnRQYXNzZW5nZXIgJiYgY29uZmlybWVkUGlja3Vwcy5oYXMoY3VycmVudFBhc3Nlbmdlci5pZCk7XHJcblxyXG4gIGNvbnN0IGhhbmRsZUNvbmZpcm0gPSAoKSA9PiB7XHJcbiAgICBpZiAoY3VycmVudFBhc3Nlbmdlcikge1xyXG4gICAgICBzZXRDb25maXJtZWRQaWNrdXBzKHByZXYgPT4gbmV3IFNldChbLi4ucHJldiwgY3VycmVudFBhc3Nlbmdlci5pZF0pKTtcclxuICAgICAgc2V0UmVmcmVzaFRyaWdnZXIocHJldiA9PiBwcmV2ICsgMSk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlQ29tcGxldGVSaWRlQ2xpY2sgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBzZXRJc0NvbXBsZXRpbmcodHJ1ZSk7XHJcbiAgICBhd2FpdCBvbkNvbXBsZXRlKGFjdGl2ZVJpZGUuaWQpO1xyXG4gICAgc2V0SXNDb21wbGV0aW5nKGZhbHNlKTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJqb3VybmV5LWNvbnRlbnRcIj5cclxuICAgICAgey8qIE11bHRpcGxlIEFjdGl2ZSBSaWRlcyBUb2dnbGUgKi99XHJcbiAgICAgIHtyaWRlcy5sZW5ndGggPiAxICYmIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBhc3Nlbmdlci10YWJzXCIgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAnMTZweCcgfX0+XHJcbiAgICAgICAgICB7cmlkZXMubWFwKChyLCBpKSA9PiAoXHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICBrZXk9e3IuaWR9XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgcGFzc2VuZ2VyLXRhYiAke2kgIT09IGFjdGl2ZVJpZGVJZHggPyAncGFzc2VuZ2VyLXRhYi1hY3RpdmUnIDogJyd9YH1cclxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZXRBY3RpdmVSaWRlSWR4KGkpO1xyXG4gICAgICAgICAgICAgICAgc2V0Q3VycmVudFBhc3NJZHgoMCk7IC8vIFJlc2V0IHBhc3NlbmdlciBpbmRleCBvbiByaWRlIGNoYW5nZVxyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICBSb3V0ZToge3IuZGVzdGluYXRpb259XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgKSl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICl9XHJcblxyXG4gICAgICB7LyogSGVhZGVyICovfVxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImpvdXJuZXktZHJpdmVyLW1vZGUtaGVhZGVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJqb3VybmV5LW1vZGUtc3ViXCI+UGljayBVcCBPcmRlcjwvZGl2PlxyXG4gICAgICAgIHtyb3V0ZURhdGEgJiYgcm91dGVEYXRhLnRpbWVzICYmIHJvdXRlRGF0YS50aW1lcy5kcml2ZXJfbGVhdmUgJiYgKFxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJqb3VybmV5LWFycml2aW5nLWJhZGdlXCIgc3R5bGU9e3sgbWFyZ2luVG9wOiAnOHB4JywgZGlzcGxheTogJ2lubGluZS1mbGV4JyB9fT5cclxuICAgICAgICAgICAge0ljb25zLmNsb2NrfVxyXG4gICAgICAgICAgICA8c3Bhbj5MZWF2ZSBCeSB7bmV3IERhdGUocm91dGVEYXRhLnRpbWVzLmRyaXZlcl9sZWF2ZSkudG9Mb2NhbGVUaW1lU3RyaW5nKFtdLCB7IGhvdXI6ICcyLWRpZ2l0JywgbWludXRlOiAnMi1kaWdpdCcgfSl9PC9zcGFuPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKX1cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7LyogUGFzc2VuZ2VyIHRhYnMgKi99XHJcbiAgICAgIHtjb25maXJtZWRCb29raW5ncy5sZW5ndGggPiAwID8gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFzc2VuZ2VyLXRhYnNcIj5cclxuICAgICAgICAgIHtjb25maXJtZWRCb29raW5ncy5tYXAoKGI6IGFueSwgaTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhc3NOYW1lID0gYi5wYXNzZW5nZXIgPyBgJHtiLnBhc3Nlbmdlci5maXJzdF9uYW1lfSAke2IucGFzc2VuZ2VyLmxhc3RfbmFtZX1gIDogYFBhc3MgJHtiLmlkfWA7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzRG9uZSA9IGNvbmZpcm1lZFBpY2t1cHMuaGFzKGIuaWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgIGtleT17Yi5pZH1cclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHBhc3Nlbmdlci10YWIke2kgIT09IGN1cnJlbnRQYXNzSWR4ID8gJyBwYXNzZW5nZXItdGFiLWFjdGl2ZScgOiAnJ30ke2lzRG9uZSA/ICcgcGFzc2VuZ2VyLXRhYi1kb25lJyA6ICcnfWB9XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDdXJyZW50UGFzc0lkeChpKX1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICB7cGFzc05hbWUuc3BsaXQoJyAnKVswXX1cclxuICAgICAgICAgICAgICAgIHtpc0RvbmUgJiYgPHNwYW4gY2xhc3NOYW1lPVwidGFiLWRvbmUtZG90XCI+4pyTPC9zcGFuPn1cclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH0pfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApIDogKFxyXG4gICAgICAgIDxwIHN0eWxlPXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIGNvbG9yOiAndmFyKC0tdGV4dC1zZWNvbmRhcnkpJywgZm9udFNpemU6ICcxNHB4JywgbWFyZ2luQm90dG9tOiAnMTZweCcgfX0+XHJcbiAgICAgICAgICBObyBjb25maXJtZWQgcGFzc2VuZ2VycyBmb3IgdGhpcyByaWRlLlxyXG4gICAgICAgIDwvcD5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIHsvKiBNYXAgKi99XHJcbiAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAnMTZweCcsIG1hcmdpblRvcDogJzE2cHgnIH19PlxyXG4gICAgICAgIDxSaWRlUmVuZGVyTWFwXHJcbiAgICAgICAgICByaWRlSWQ9e2FjdGl2ZVJpZGUuaWR9XHJcbiAgICAgICAgICBoZWlnaHQ9XCIzMDBweFwiXHJcbiAgICAgICAgICBpbnRlcmFjdGl2ZT17dHJ1ZX1cclxuICAgICAgICAgIHJlZnJlc2hUcmlnZ2VyPXtyZWZyZXNoVHJpZ2dlcn1cclxuICAgICAgICAgIGRyaXZlck1vZGU9e3RydWV9XHJcbiAgICAgICAgICBjb25maXJtZWRQaWNrdXBJZHM9e0FycmF5LmZyb20oY29uZmlybWVkUGlja3Vwcyl9XHJcbiAgICAgICAgICBvblJvdXRlRGF0YT17c2V0Um91dGVEYXRhfVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIFBhc3NlbmdlciBjYXJkICovfVxyXG4gICAgICB7Y3VycmVudFBhc3NlbmdlciAmJiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJqb3VybmV5LXBhc3Nlbmdlci1jYXJkXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImpvdXJuZXktcGFzc2VuZ2VyLWhlYWRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImpvdXJuZXktcGFzc2VuZ2VyLWF2YXRhclwiPlxyXG4gICAgICAgICAgICAgIHtjdXJyZW50UGFzc2VuZ2VyLnBhc3Nlbmdlcj8uZmlyc3RfbmFtZSA/IGN1cnJlbnRQYXNzZW5nZXIucGFzc2VuZ2VyLmZpcnN0X25hbWVbMF0gOiAnVSd9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImpvdXJuZXktcGFzc2VuZ2VyLWluZm9cIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImpvdXJuZXktcGFzc2VuZ2VyLW5hbWVcIj5cclxuICAgICAgICAgICAgICAgIHtjdXJyZW50UGFzc2VuZ2VyLnBhc3NlbmdlciA/IGAke2N1cnJlbnRQYXNzZW5nZXIucGFzc2VuZ2VyLmZpcnN0X25hbWV9ICR7Y3VycmVudFBhc3Nlbmdlci5wYXNzZW5nZXIubGFzdF9uYW1lfWAgOiAnVW5rbm93bid9XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAge2N1cnJlbnRQYXNzZW5nZXIucGFzc2VuZ2VyPy5yaWRlcl9yYXRpbmcgIT09IHVuZGVmaW5lZCA/IChcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiam91cm5leS1wYXNzZW5nZXItcmF0aW5nXCI+4q2QIHtjdXJyZW50UGFzc2VuZ2VyLnBhc3Nlbmdlci5yaWRlcl9yYXRpbmd9PC9kaXY+XHJcbiAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiam91cm5leS1wYXNzZW5nZXItcmF0aW5nIG5vLXJhdGluZ1wiPk5vIHJhdGluZyB5ZXQ8L2Rpdj5cclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAge2lzQ29uZmlybWVkICYmIChcclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImpvdXJuZXktY29uZmlybWVkLWJhZGdlXCI+UGlja2VkIFVwIOKckzwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaGVldC1kZXRhaWxzLWNhcmQgam91cm5leS1wYXNzZW5nZXItZGV0YWlsc1wiPlxyXG4gICAgICAgICAgICA8RGV0YWlsUm93IGxhYmVsPVwiUGljayBVcFwiIHZhbHVlPXs8PjxzcGFuIGNsYXNzTmFtZT1cImRldGFpbC1waW5cIj57SWNvbnMucGlufTwvc3Bhbj57Y3VycmVudFBhc3Nlbmdlci5waWNrdXBfbG9jYXRpb24gfHwgJ01hcCBQb2ludCd9PC8+fSAvPlxyXG4gICAgICAgICAgICA8RGV0YWlsUm93IGxhYmVsPVwiQ29zdFwiIHZhbHVlPXtgwqMyLjAwYH0gdmFsdWVDbGFzcz1cImRldGFpbC1wcmljZVwiIC8+XHJcbiAgICAgICAgICAgIDxEZXRhaWxSb3cgbGFiZWw9XCJDb2RlXCIgdmFsdWU9e2N1cnJlbnRQYXNzZW5nZXIucGlja3VwX2NvZGUgfHwgJy0tLS0nfSB2YWx1ZUNsYXNzPVwiZGV0YWlsLXZhbHVlXCIgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApfVxyXG5cclxuICAgICAgey8qIEFjdGlvbnMgKi99XHJcbiAgICAgIHtjdXJyZW50UGFzc2VuZ2VyICYmIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImpvdXJuZXktYWN0aW9uc1wiPlxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJzaGVldC1hY3Rpb24tYnRuIGJ0bi1tZXNzYWdlXCJcclxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25PcGVuQ2hhdD8uKFN0cmluZyhhY3RpdmVSaWRlLmlkKSwgY3VycmVudFBhc3Nlbmdlci5wYXNzZW5nZXI/LmlkID8/IGN1cnJlbnRQYXNzZW5nZXIucGFzc2VuZ2VyX2lkKX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAge0ljb25zLm1lc3NhZ2V9IE1lc3NhZ2VcclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgeyFpc0NvbmZpcm1lZCA/IChcclxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzaGVldC1hY3Rpb24tYnRuIGJ0bi1hY2NlcHQgam91cm5leS1jb25maXJtLWJ0blwiIG9uQ2xpY2s9e2hhbmRsZUNvbmZpcm19PlxyXG4gICAgICAgICAgICAgIHtJY29ucy5jaGVja30gQ29uZmlybSBQaWNrIFVwXHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzaGVldC1hY3Rpb24tYnRuIGJ0bi1hY2NlcHQgam91cm5leS1jb25maXJtLWJ0biBqb3VybmV5LWNvbmZpcm0tZG9uZVwiIGRpc2FibGVkPlxyXG4gICAgICAgICAgICAgIHtJY29ucy5jaGVja30gUGlja2VkIFVwXHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIHsvKiBDb21wbGV0ZSBSaWRlIEFjdGlvbiAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJqb3VybmV5LWFjdGlvbnNcIiBzdHlsZT17eyBtYXJnaW5Ub3A6ICcxMnB4JyB9fT5cclxuICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICBjbGFzc05hbWU9XCJzaGVldC1hY3Rpb24tYnRuXCJcclxuICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmQ6ICcjMjJjNTVlJywgY29sb3I6ICcjZmZmJywgYm9yZGVyOiAnbm9uZScgfX1cclxuICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZUNvbXBsZXRlUmlkZUNsaWNrfVxyXG4gICAgICAgICAgZGlzYWJsZWQ9e2lzQ29tcGxldGluZ31cclxuICAgICAgICA+XHJcbiAgICAgICAgICB7aXNDb21wbGV0aW5nID8gJ0NvbXBsZXRpbmcuLi4nIDogJ/Cfj4EgQ29tcGxldGUgUmlkZSd9XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcblxyXG4vLyDilIDilIDilIAgTWFpbiBKb3VybmV5UGFnZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcclxuY29uc3QgSm91cm5leVBhZ2U6IFJlYWN0LkZDPHtcclxuICBjYW5Vc2VEcml2ZXJNb2RlOiBib29sZWFuO1xyXG4gIG9uRHJpdmVyU2lnbnVwOiAoKSA9PiB2b2lkO1xyXG4gIG9uT3BlbkNoYXQ/OiAocmlkZUlkOiBzdHJpbmcsIHBhcnRpY2lwYW50SWQ/OiBzdHJpbmcpID0+IHZvaWQ7XHJcbiAgbW9kZT86ICd1c2VyJyB8ICdkcml2ZXInO1xyXG4gIG9uTW9kZUNoYW5nZT86IChtb2RlOiAndXNlcicgfCAnZHJpdmVyJykgPT4gdm9pZDtcclxufT4gPSAoeyBjYW5Vc2VEcml2ZXJNb2RlLCBvbkRyaXZlclNpZ251cCwgb25PcGVuQ2hhdCwgbW9kZSwgb25Nb2RlQ2hhbmdlIH0pID0+IHtcclxuICBjb25zdCBbaW50ZXJuYWxNb2RlLCBzZXRJbnRlcm5hbE1vZGVdID0gdXNlU3RhdGU8J3VzZXInIHwgJ2RyaXZlcic+KCd1c2VyJyk7XHJcbiAgY29uc3QgY3VycmVudE1vZGUgPSBtb2RlID8/IGludGVybmFsTW9kZTtcclxuICBjb25zdCBzZXRDdXJyZW50TW9kZSA9IChuZXh0TW9kZTogJ3VzZXInIHwgJ2RyaXZlcicpID0+IHtcclxuICAgIGlmIChtb2RlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgc2V0SW50ZXJuYWxNb2RlKG5leHRNb2RlKTtcclxuICAgIH1cclxuICAgIG9uTW9kZUNoYW5nZT8uKG5leHRNb2RlKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBbYWN0aXZlVXNlclRyaXBzLCBzZXRBY3RpdmVVc2VyVHJpcHNdID0gdXNlU3RhdGU8YW55W10+KFtdKTtcclxuICBjb25zdCBbYWN0aXZlRHJpdmVyUmlkZXMsIHNldEFjdGl2ZURyaXZlclJpZGVzXSA9IHVzZVN0YXRlPGFueVtdPihbXSk7XHJcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoIWNhblVzZURyaXZlck1vZGUgJiYgY3VycmVudE1vZGUgPT09ICdkcml2ZXInKSB7XHJcbiAgICAgIHNldEN1cnJlbnRNb2RlKCd1c2VyJyk7XHJcbiAgICB9XHJcbiAgfSwgW2NhblVzZURyaXZlck1vZGUsIGN1cnJlbnRNb2RlXSk7XHJcblxyXG4gIGNvbnN0IGZldGNoQWN0aXZlSm91cm5leXMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBzZXRMb2FkaW5nKHRydWUpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gRmV0Y2ggVXNlciBCb29raW5nc1xyXG4gICAgICBjb25zdCB1c2VyVHJpcHMgPSBhd2FpdCBhcGlGZXRjaDxhbnlbXT4oJ2Jvb2tpbmdzL21lJywgeyBtZXRob2Q6ICdHRVQnIH0pO1xyXG4gICAgICBjb25zdCBhY3RpdmVCb29raW5ncyA9IHVzZXJUcmlwcy5maWx0ZXIoKGI6IGFueSkgPT4gYi5zdGF0dXMgPT09ICdjb25maXJtZWQnICYmIGIucmlkZT8uc3RhdHVzID09PSAnaW5fcHJvZ3Jlc3MnKTtcclxuXHJcbiAgICAgIGNvbnN0IGVucmljaGVkID0gYXdhaXQgUHJvbWlzZS5hbGwoXHJcbiAgICAgICAgYWN0aXZlQm9va2luZ3MubWFwKGFzeW5jIChiOiBhbnkpID0+IHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZlaGljbGUgPSBhd2FpdCBhcGlGZXRjaDxhbnk+KGBib29raW5ncy9yaWRlcy8ke2IucmlkZV9pZH0vdmVoaWNsZWAsIHsgbWV0aG9kOiAnR0VUJyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uYiwgdmVoaWNsZSB9O1xyXG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiVmVoaWNsZSBmZXRjaCBmYWlsZWQgZm9yIHJpZGVcIiwgYi5yaWRlX2lkLCBlKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvLyBmYWxsYmFjazogYm9va2luZyB3aXRob3V0IHZlaGljbGVcclxuICAgICAgICAgIHJldHVybiBiO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBzZXRBY3RpdmVVc2VyVHJpcHMoZW5yaWNoZWQpO1xyXG5cclxuXHJcblxyXG4gICAgICAvLyBGZXRjaCBEcml2ZXIgRGFzaGJvYXJkXHJcbiAgICAgIGNvbnN0IGRyaXZlckRhdGEgPSBhd2FpdCBhcGlGZXRjaDxhbnk+KCdyaWRlcy9kcml2ZXIvZGFzaGJvYXJkJywgeyBtZXRob2Q6ICdHRVQnIH0pO1xyXG4gICAgICBjb25zdCBhY3RpdmVSaWRlcyA9IGRyaXZlckRhdGEuZmlsdGVyKChyOiBhbnkpID0+IHIuc3RhdHVzID09PSAnaW5fcHJvZ3Jlc3MnKTtcclxuICAgICAgc2V0QWN0aXZlRHJpdmVyUmlkZXMoYWN0aXZlUmlkZXMpO1xyXG5cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgam91cm5leXM6XCIsIGVycik7XHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgIH1cclxuXHJcblxyXG4gIH07XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBmZXRjaEFjdGl2ZUpvdXJuZXlzKCk7XHJcbiAgfSwgW2N1cnJlbnRNb2RlXSk7XHJcblxyXG4gIC8vIEhhbmRsZXIgZm9yIGNvbXBsZXRpbmcgdGhlIHJpZGVcclxuICBjb25zdCBoYW5kbGVDb21wbGV0ZVJpZGUgPSBhc3luYyAocmlkZUlkOiBudW1iZXIpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IGFwaUZldGNoKGBib29raW5ncy9yaWRlcy8ke3JpZGVJZH0vY29tcGxldGVgLCB7IG1ldGhvZDogJ1BPU1QnIH0pO1xyXG5cclxuICAgICAgLy8gUmVtb3ZlIHRoZSBjb21wbGV0ZWQgcmlkZSBmcm9tIHN0YXRlIGRpcmVjdGx5IHNvIHRoZSBVSSB1cGRhdGVzIGluc3RhbnRseVxyXG4gICAgICBzZXRBY3RpdmVEcml2ZXJSaWRlcyhwcmV2ID0+IHByZXYuZmlsdGVyKHIgPT4gci5pZCAhPT0gcmlkZUlkKSk7XHJcblxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgY29tcGxldGluZyByaWRlOicsIGVycm9yKTtcclxuICAgICAgYWxlcnQoJ0NvdWxkIG5vdCBjb21wbGV0ZSB0aGUgcmlkZS4gUGxlYXNlIHRyeSBhZ2Fpbi4nKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPD5cclxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJ1YmVyLWhlYWRlclwiPlxyXG4gICAgICAgIDxoMSBjbGFzc05hbWU9XCJhY3Rpdml0eS10aXRsZVwiPkpvdXJuZXk8L2gxPlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRvcC10b2dnbGVcIj5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgdG9nZ2xlLXRhYiAke2N1cnJlbnRNb2RlID09PSAndXNlcicgPyAndG9nZ2xlLXRhYi1hY3RpdmUnIDogJyd9YH1cclxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q3VycmVudE1vZGUoJ3VzZXInKX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgUmlkZXJcclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgdG9nZ2xlLXRhYiAke2N1cnJlbnRNb2RlID09PSAnZHJpdmVyJyA/ICd0b2dnbGUtdGFiLWFjdGl2ZScgOiAnJ31gfVxyXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYgKCFjYW5Vc2VEcml2ZXJNb2RlKSByZXR1cm4gb25Ecml2ZXJTaWdudXAoKTtcclxuICAgICAgICAgICAgICBzZXRDdXJyZW50TW9kZSgnZHJpdmVyJyk7XHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIERyaXZlclxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvaGVhZGVyPlxyXG5cclxuICAgICAge2xvYWRpbmcgPyAoXHJcbiAgICAgICAgPHAgc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJywgbWFyZ2luVG9wOiAnNDBweCcsIGNvbG9yOiAndmFyKC0tdGV4dC1zZWNvbmRhcnkpJyB9fT5Mb2FkaW5nIHlvdXIgam91cm5leXMuLi48L3A+XHJcbiAgICAgICkgOiAoXHJcbiAgICAgICAgY3VycmVudE1vZGUgPT09ICd1c2VyJyA/IChcclxuICAgICAgICAgIDxVc2VySm91cm5leSB0cmlwcz17YWN0aXZlVXNlclRyaXBzfSBvbk9wZW5DaGF0PXtvbk9wZW5DaGF0fSAvPlxyXG4gICAgICAgICkgOiAoXHJcbiAgICAgICAgICA8RHJpdmVySm91cm5leSByaWRlcz17YWN0aXZlRHJpdmVyUmlkZXN9IG9uQ29tcGxldGU9e2hhbmRsZUNvbXBsZXRlUmlkZX0gb25PcGVuQ2hhdD17b25PcGVuQ2hhdH0gLz5cclxuICAgICAgICApXHJcbiAgICAgICl9XHJcbiAgICA8Lz5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgSm91cm5leVBhZ2U7Il0sImZpbGUiOiJDOi9Vc2Vycy95bGFubi92c2NvZGUvVW5pL1NhbXVkaHlhblJpZGVzL2Zyb250ZW5kL3NyYy9Kb3VybmV5UGFnZS50c3gifQ==