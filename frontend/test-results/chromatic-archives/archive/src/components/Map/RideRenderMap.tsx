import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/Map/RideRenderMap.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=b8f2434d"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s3 = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=b8f2434d"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useEffect = __vite__cjsImport1_react["useEffect"]; const useMemo = __vite__cjsImport1_react["useMemo"]; const useState = __vite__cjsImport1_react["useState"];
import { GeoJSON, MapContainer, Marker, TileLayer, useMapEvents } from "/node_modules/.vite/deps/react-leaflet.js?v=b8f2434d";
import __vite__cjsImport3_leaflet from "/node_modules/.vite/deps/leaflet.js?v=b8f2434d"; const L = __vite__cjsImport3_leaflet.__esModule ? __vite__cjsImport3_leaflet.default : __vite__cjsImport3_leaflet;
import markerIcon2x from "/node_modules/leaflet/dist/images/marker-icon-2x.png?import";
import markerIcon from "/node_modules/leaflet/dist/images/marker-icon.png?import";
import markerShadow from "/node_modules/leaflet/dist/images/marker-shadow.png?import";
import { apiFetch } from "/src/lib/api.ts";
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});
export const RideRenderMap = ({
  rideId,
  onPickupSelect,
  existingPickup,
  height = "300px",
  interactive = true,
  refreshTrigger = 0,
  driverMode = false,
  confirmedPickupIds = [],
  onRouteData
}) => {
  _s3();
  var _s = $RefreshSig$(), _s2 = $RefreshSig$();
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [timesData, setTimesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPickup, setSelectedPickup] = useState(null);
  useEffect(() => {
    let isMounted = true;
    const fetchRoute = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(`/routing/ride/${rideId}`, { method: "GET" });
        if (isMounted) {
          if (data.route) {
            setGeoJsonData(data.route);
            setTimesData(data.times);
          } else {
            setGeoJsonData(data);
          }
          if (onRouteData) onRouteData(data);
        }
      } catch (err) {
        console.error("Error fetching map route:", err);
        const msg = err instanceof Error ? err.message : String(err);
        if (isMounted) setError(msg || "Could not fetch route");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (rideId) fetchRoute();
    return () => {
      isMounted = false;
    };
  }, [rideId, refreshTrigger]);
  const defaultCenter = [51.3758, -2.3599];
  const MapClickEvent = () => {
    _s();
    useMapEvents({
      click(e) {
        if (onPickupSelect && interactive) {
          setSelectedPickup(e.latlng);
          onPickupSelect(e.latlng.lat, e.latlng.lng);
        }
      }
    });
    return null;
  };
  _s(MapClickEvent, "Ld/tk8Iz8AdZhC1l7acENaOEoCo=", false, function() {
    return [useMapEvents];
  });
  const FitBounds = ({ data }) => {
    _s2();
    const map = useMapEvents({});
    const bounds = useMemo(() => {
      try {
        if (data && data.features && data.features.length > 0) {
          const layer = L.geoJSON(data);
          return layer.getBounds();
        }
      } catch (e) {
        console.error("Error computing bounds:", e);
      }
      return null;
    }, [data]);
    useEffect(() => {
      if (bounds) map.fitBounds(bounds, { padding: [20, 20] });
    }, [bounds, map]);
    return null;
  };
  _s2(FitBounds, "t4Uf1hge24Zwt6ry+py/XWWukYA=", false, function() {
    return [useMapEvents];
  });
  if (loading) {
    return /* @__PURE__ */ jsxDEV(
      "div",
      {
        style: {
          height,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-surface)",
          color: "var(--text-primary)",
          borderRadius: "8px"
        },
        children: "Loading map route..."
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx",
        lineNumber: 124,
        columnNumber: 7
      },
      this
    );
  }
  if (error) {
    return /* @__PURE__ */ jsxDEV(
      "div",
      {
        style: {
          height,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fee2e2",
          color: "#b91c1c",
          borderRadius: "8px",
          padding: "12px",
          textAlign: "center"
        },
        children: error
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx",
        lineNumber: 143,
        columnNumber: 7
      },
      this
    );
  }
  return /* @__PURE__ */ jsxDEV("div", { style: { height, width: "100%", borderRadius: "8px", overflow: "hidden" }, children: /* @__PURE__ */ jsxDEV(
    MapContainer,
    {
      center: defaultCenter,
      zoom: 12,
      style: { height: "100%", width: "100%" },
      scrollWheelZoom: interactive,
      dragging: interactive,
      zoomControl: interactive,
      children: [
        /* @__PURE__ */ jsxDEV(
          TileLayer,
          {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx",
            lineNumber: 172,
            columnNumber: 9
          },
          this
        ),
        geoJsonData && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          /* @__PURE__ */ jsxDEV(GeoJSON, { data: geoJsonData, style: { color: "#3b82f6", weight: 5, opacity: 0.8 } }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx",
            lineNumber: 179,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(FitBounds, { data: geoJsonData }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx",
            lineNumber: 180,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx",
          lineNumber: 178,
          columnNumber: 9
        }, this),
        selectedPickup && /* @__PURE__ */ jsxDEV(Marker, { position: selectedPickup }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx",
          lineNumber: 184,
          columnNumber: 28
        }, this),
        existingPickup && /* @__PURE__ */ jsxDEV(Marker, { position: [existingPickup.lat, existingPickup.lng] }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx",
          lineNumber: 186,
          columnNumber: 28
        }, this),
        timesData && timesData.pickups && timesData.pickups.map((p, idx) => {
          if (!driverMode) return null;
          if (p.booking_ids && p.booking_ids.length > 0) {
            const allConfirmed = p.booking_ids.every((id) => confirmedPickupIds.includes(id));
            if (allConfirmed) return null;
          }
          return /* @__PURE__ */ jsxDEV(Marker, { position: [p.lat, p.lng] }, idx, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx",
            lineNumber: 201,
            columnNumber: 18
          }, this);
        }),
        interactive && /* @__PURE__ */ jsxDEV(MapClickEvent, {}, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx",
          lineNumber: 204,
          columnNumber: 25
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx",
      lineNumber: 164,
      columnNumber: 7
    },
    this
  ) }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx",
    lineNumber: 163,
    columnNumber: 5
  }, this);
};
_s3(RideRenderMap, "oTAMNZrR7mt913/afOSTWxUCoek=");
_c = RideRenderMap;
var _c;
$RefreshReg$(_c, "RideRenderMap");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/components/Map/RideRenderMap.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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QTtBQUFBLGVBQTJEO0FBQUEsUUFFN0UxQixhQUFhQSxVQUFVZ0QsV0FBV2hELFVBQVVnRCxRQUFRcEIsSUFBSSxDQUFDcUIsR0FBUUMsUUFBZ0I7QUFLL0UsY0FBSSxDQUFDM0QsV0FBWSxRQUFPO0FBR3hCLGNBQUkwRCxFQUFFRSxlQUFlRixFQUFFRSxZQUFZcEIsU0FBUyxHQUFHO0FBQzdDLGtCQUFNcUIsZUFBZUgsRUFBRUUsWUFBWUUsTUFBTSxDQUFDQyxPQUFlOUQsbUJBQW1CK0QsU0FBU0QsRUFBRSxDQUFDO0FBQ3hGLGdCQUFJRixhQUFjLFFBQU87QUFBQSxVQUMzQjtBQUVBLGlCQUFPLHVCQUFDLFVBQWlCLFVBQVUsQ0FBQ0gsRUFBRXhCLEtBQUt3QixFQUFFdkIsR0FBRyxLQUE1QndCLEtBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFBMkM7QUFBQSxRQUNyRCxDQUFDO0FBQUEsUUFFQTdELGVBQWUsdUJBQUMsbUJBQUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUFjO0FBQUE7QUFBQTtBQUFBLElBeENoQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUF5Q0EsS0ExQ0Y7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQTJDQTtBQUVKO0FBQUVLLElBL0tXVixlQUEyQztBQUFBd0UsS0FBM0N4RTtBQUEyQyxJQUFBd0U7QUFBQUMsYUFBQUQsSUFBQSIsIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwidXNlTWVtbyIsInVzZVN0YXRlIiwiR2VvSlNPTiIsIk1hcENvbnRhaW5lciIsIk1hcmtlciIsIlRpbGVMYXllciIsInVzZU1hcEV2ZW50cyIsIkwiLCJtYXJrZXJJY29uMngiLCJtYXJrZXJJY29uIiwibWFya2VyU2hhZG93IiwiYXBpRmV0Y2giLCJJY29uIiwiRGVmYXVsdCIsIm1lcmdlT3B0aW9ucyIsImljb25SZXRpbmFVcmwiLCJpY29uVXJsIiwic2hhZG93VXJsIiwiUmlkZVJlbmRlck1hcCIsInJpZGVJZCIsIm9uUGlja3VwU2VsZWN0IiwiZXhpc3RpbmdQaWNrdXAiLCJoZWlnaHQiLCJpbnRlcmFjdGl2ZSIsInJlZnJlc2hUcmlnZ2VyIiwiZHJpdmVyTW9kZSIsImNvbmZpcm1lZFBpY2t1cElkcyIsIm9uUm91dGVEYXRhIiwiX3MzIiwiX3MiLCIkUmVmcmVzaFNpZyQiLCJfczIiLCJnZW9Kc29uRGF0YSIsInNldEdlb0pzb25EYXRhIiwidGltZXNEYXRhIiwic2V0VGltZXNEYXRhIiwibG9hZGluZyIsInNldExvYWRpbmciLCJlcnJvciIsInNldEVycm9yIiwic2VsZWN0ZWRQaWNrdXAiLCJzZXRTZWxlY3RlZFBpY2t1cCIsImlzTW91bnRlZCIsImZldGNoUm91dGUiLCJkYXRhIiwibWV0aG9kIiwicm91dGUiLCJ0aW1lcyIsImVyciIsImNvbnNvbGUiLCJtc2ciLCJFcnJvciIsIm1lc3NhZ2UiLCJTdHJpbmciLCJkZWZhdWx0Q2VudGVyIiwiTWFwQ2xpY2tFdmVudCIsImNsaWNrIiwiZSIsImxhdGxuZyIsImxhdCIsImxuZyIsIkZpdEJvdW5kcyIsIm1hcCIsImJvdW5kcyIsImZlYXR1cmVzIiwibGVuZ3RoIiwibGF5ZXIiLCJnZW9KU09OIiwiZ2V0Qm91bmRzIiwiZml0Qm91bmRzIiwicGFkZGluZyIsIndpZHRoIiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwiYm9yZGVyUmFkaXVzIiwidGV4dEFsaWduIiwib3ZlcmZsb3ciLCJ3ZWlnaHQiLCJvcGFjaXR5IiwicGlja3VwcyIsInAiLCJpZHgiLCJib29raW5nX2lkcyIsImFsbENvbmZpcm1lZCIsImV2ZXJ5IiwiaWQiLCJpbmNsdWRlcyIsIl9jIiwiJFJlZnJlc2hSZWckIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIlJpZGVSZW5kZXJNYXAudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBHZW9KU09OLCBNYXBDb250YWluZXIsIE1hcmtlciwgVGlsZUxheWVyLCB1c2VNYXBFdmVudHMgfSBmcm9tICdyZWFjdC1sZWFmbGV0JztcclxuaW1wb3J0IHR5cGUgeyBMYXRMbmdFeHByZXNzaW9uLCBMZWFmbGV0TW91c2VFdmVudCB9IGZyb20gJ2xlYWZsZXQnO1xyXG5pbXBvcnQgTCBmcm9tICdsZWFmbGV0JztcclxuaW1wb3J0IG1hcmtlckljb24yeCBmcm9tICdsZWFmbGV0L2Rpc3QvaW1hZ2VzL21hcmtlci1pY29uLTJ4LnBuZyc7XHJcbmltcG9ydCBtYXJrZXJJY29uIGZyb20gJ2xlYWZsZXQvZGlzdC9pbWFnZXMvbWFya2VyLWljb24ucG5nJztcclxuaW1wb3J0IG1hcmtlclNoYWRvdyBmcm9tICdsZWFmbGV0L2Rpc3QvaW1hZ2VzL21hcmtlci1zaGFkb3cucG5nJztcclxuaW1wb3J0IHsgYXBpRmV0Y2ggfSBmcm9tICcuLi8uLi9saWIvYXBpJztcclxuXHJcbkwuSWNvbi5EZWZhdWx0Lm1lcmdlT3B0aW9ucyh7XHJcbiAgaWNvblJldGluYVVybDogbWFya2VySWNvbjJ4LFxyXG4gIGljb25Vcmw6IG1hcmtlckljb24sXHJcbiAgc2hhZG93VXJsOiBtYXJrZXJTaGFkb3csXHJcbn0pO1xyXG5cclxuaW50ZXJmYWNlIFJpZGVSZW5kZXJNYXBQcm9wcyB7XHJcbiAgcmlkZUlkOiBudW1iZXI7XHJcbiAgb25QaWNrdXBTZWxlY3Q/OiAobGF0OiBudW1iZXIsIGxuZzogbnVtYmVyKSA9PiB2b2lkO1xyXG4gIGV4aXN0aW5nUGlja3VwPzogeyBsYXQ6IG51bWJlcjsgbG5nOiBudW1iZXIgfTsgLy8gRm9yIHVzZXIgY3JlYXRpbmcgcmlkZVxyXG4gIGhlaWdodD86IHN0cmluZztcclxuICBpbnRlcmFjdGl2ZT86IGJvb2xlYW47XHJcbiAgLyoqIEluY3JlbWVudCB0byBmb3JjZSBhIHJlZmV0Y2ggKGUuZy4gZHJpdmVyIGNvbmZpcm1zIGEgcGlja3VwKS4gKi9cclxuICByZWZyZXNoVHJpZ2dlcj86IG51bWJlcjtcclxuICBkcml2ZXJNb2RlPzogYm9vbGVhbjtcclxuICBjb25maXJtZWRQaWNrdXBJZHM/OiBudW1iZXJbXTtcclxuICBvblJvdXRlRGF0YT86IChkYXRhOiBhbnkpID0+IHZvaWQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSZW5kZXJzIHRoZSByb3V0ZSBmb3IgYSBnaXZlbiByaWRlIHVzaW5nIHRoZSBiYWNrZW5kIHJvdXRpbmcgZW5kcG9pbnQuXHJcbiAqIEJhY2tlbmQgcm91dGU6IEdFVCAvcm91dGluZy9yaWRlL3tyaWRlX2lkfVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFJpZGVSZW5kZXJNYXA6IFJlYWN0LkZDPFJpZGVSZW5kZXJNYXBQcm9wcz4gPSAoe1xyXG4gIHJpZGVJZCxcclxuICBvblBpY2t1cFNlbGVjdCxcclxuICBleGlzdGluZ1BpY2t1cCxcclxuICBoZWlnaHQgPSAnMzAwcHgnLFxyXG4gIGludGVyYWN0aXZlID0gdHJ1ZSxcclxuICByZWZyZXNoVHJpZ2dlciA9IDAsXHJcbiAgZHJpdmVyTW9kZSA9IGZhbHNlLFxyXG4gIGNvbmZpcm1lZFBpY2t1cElkcyA9IFtdLFxyXG4gIG9uUm91dGVEYXRhLFxyXG59KSA9PiB7XHJcbiAgY29uc3QgW2dlb0pzb25EYXRhLCBzZXRHZW9Kc29uRGF0YV0gPSB1c2VTdGF0ZTxhbnk+KG51bGwpO1xyXG4gIGNvbnN0IFt0aW1lc0RhdGEsIHNldFRpbWVzRGF0YV0gPSB1c2VTdGF0ZTxhbnk+KG51bGwpO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlPGJvb2xlYW4+KHRydWUpO1xyXG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW3NlbGVjdGVkUGlja3VwLCBzZXRTZWxlY3RlZFBpY2t1cF0gPSB1c2VTdGF0ZTxMYXRMbmdFeHByZXNzaW9uIHwgbnVsbD4obnVsbCk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBsZXQgaXNNb3VudGVkID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdCBmZXRjaFJvdXRlID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBzZXRMb2FkaW5nKHRydWUpO1xyXG4gICAgICBzZXRFcnJvcihudWxsKTtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGFwaUZldGNoPGFueT4oYC9yb3V0aW5nL3JpZGUvJHtyaWRlSWR9YCwgeyBtZXRob2Q6ICdHRVQnIH0pO1xyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIGlmIChkYXRhLnJvdXRlKSB7XHJcbiAgICAgICAgICAgIHNldEdlb0pzb25EYXRhKGRhdGEucm91dGUpO1xyXG4gICAgICAgICAgICBzZXRUaW1lc0RhdGEoZGF0YS50aW1lcyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRHZW9Kc29uRGF0YShkYXRhKTsgLy8gRmFsbGJhY2sgdG8gcmF3IGdlb2pzb25cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChvblJvdXRlRGF0YSkgb25Sb3V0ZURhdGEoZGF0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlcnI6IHVua25vd24pIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBtYXAgcm91dGU6JywgZXJyKTtcclxuICAgICAgICBjb25zdCBtc2cgPSBlcnIgaW5zdGFuY2VvZiBFcnJvciA/IGVyci5tZXNzYWdlIDogU3RyaW5nKGVycik7XHJcbiAgICAgICAgaWYgKGlzTW91bnRlZCkgc2V0RXJyb3IobXNnIHx8ICdDb3VsZCBub3QgZmV0Y2ggcm91dGUnKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBpZiAoaXNNb3VudGVkKSBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAocmlkZUlkKSBmZXRjaFJvdXRlKCk7XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgaXNNb3VudGVkID0gZmFsc2U7XHJcbiAgICB9O1xyXG4gIH0sIFtyaWRlSWQsIHJlZnJlc2hUcmlnZ2VyXSk7XHJcblxyXG4gIGNvbnN0IGRlZmF1bHRDZW50ZXI6IExhdExuZ0V4cHJlc3Npb24gPSBbNTEuMzc1OCwgLTIuMzU5OV07IC8vIEJhdGhcclxuXHJcbiAgLy8gQ29tcG9uZW50IHRvIGhhbmRsZSBtYXAgY2xpY2tzIGZvciBwYXNzZW5nZXIgcGlja3VwIHNlbGVjdGlvblxyXG4gIGNvbnN0IE1hcENsaWNrRXZlbnQgPSAoKSA9PiB7XHJcbiAgICB1c2VNYXBFdmVudHMoe1xyXG4gICAgICBjbGljayhlOiBMZWFmbGV0TW91c2VFdmVudCkge1xyXG4gICAgICAgIGlmIChvblBpY2t1cFNlbGVjdCAmJiBpbnRlcmFjdGl2ZSkge1xyXG4gICAgICAgICAgc2V0U2VsZWN0ZWRQaWNrdXAoZS5sYXRsbmcpO1xyXG4gICAgICAgICAgb25QaWNrdXBTZWxlY3QoZS5sYXRsbmcubGF0LCBlLmxhdGxuZy5sbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfTtcclxuXHJcbiAgLy8gQ29tcG9uZW50IHRvIGF1dG9tYXRpY2FsbHkgZml0IG1hcCB0byB0aGUgcm91dGUgYm91bmRzXHJcbiAgY29uc3QgRml0Qm91bmRzID0gKHsgZGF0YSB9OiB7IGRhdGE6IGFueSB9KSA9PiB7XHJcbiAgICBjb25zdCBtYXAgPSB1c2VNYXBFdmVudHMoe30pO1xyXG5cclxuICAgIGNvbnN0IGJvdW5kcyA9IHVzZU1lbW8oKCkgPT4ge1xyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGlmIChkYXRhICYmIGRhdGEuZmVhdHVyZXMgJiYgZGF0YS5mZWF0dXJlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBjb25zdCBsYXllciA9IEwuZ2VvSlNPTihkYXRhKTtcclxuICAgICAgICAgIHJldHVybiBsYXllci5nZXRCb3VuZHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjb21wdXRpbmcgYm91bmRzOicsIGUpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSwgW2RhdGFdKTtcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICBpZiAoYm91bmRzKSBtYXAuZml0Qm91bmRzKGJvdW5kcywgeyBwYWRkaW5nOiBbMjAsIDIwXSB9KTtcclxuICAgIH0sIFtib3VuZHMsIG1hcF0pO1xyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH07XHJcblxyXG4gIGlmIChsb2FkaW5nKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIGhlaWdodCxcclxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3ZhcigtLWJnLXN1cmZhY2UpJyxcclxuICAgICAgICAgIGNvbG9yOiAndmFyKC0tdGV4dC1wcmltYXJ5KScsXHJcbiAgICAgICAgICBib3JkZXJSYWRpdXM6ICc4cHgnLFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICBMb2FkaW5nIG1hcCByb3V0ZS4uLlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgaGVpZ2h0LFxyXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZlZTJlMicsXHJcbiAgICAgICAgICBjb2xvcjogJyNiOTFjMWMnLFxyXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcclxuICAgICAgICAgIHBhZGRpbmc6ICcxMnB4JyxcclxuICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICAgIHtlcnJvcn1cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0LCB3aWR0aDogJzEwMCUnLCBib3JkZXJSYWRpdXM6ICc4cHgnLCBvdmVyZmxvdzogJ2hpZGRlbicgfX0+XHJcbiAgICAgIDxNYXBDb250YWluZXJcclxuICAgICAgICBjZW50ZXI9e2RlZmF1bHRDZW50ZXJ9XHJcbiAgICAgICAgem9vbT17MTJ9XHJcbiAgICAgICAgc3R5bGU9e3sgaGVpZ2h0OiAnMTAwJScsIHdpZHRoOiAnMTAwJScgfX1cclxuICAgICAgICBzY3JvbGxXaGVlbFpvb209e2ludGVyYWN0aXZlfVxyXG4gICAgICAgIGRyYWdnaW5nPXtpbnRlcmFjdGl2ZX1cclxuICAgICAgICB6b29tQ29udHJvbD17aW50ZXJhY3RpdmV9XHJcbiAgICAgID5cclxuICAgICAgICA8VGlsZUxheWVyXHJcbiAgICAgICAgICBhdHRyaWJ1dGlvbj0nJmNvcHk7IDxhIGhyZWY9XCJodHRwczovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMnXHJcbiAgICAgICAgICB1cmw9XCJodHRwczovL3tzfS50aWxlLm9wZW5zdHJlZXRtYXAub3JnL3t6fS97eH0ve3l9LnBuZ1wiXHJcbiAgICAgICAgLz5cclxuXHJcbiAgICAgICAge2dlb0pzb25EYXRhICYmIChcclxuICAgICAgICAgIDw+XHJcbiAgICAgICAgICAgIDxHZW9KU09OIGRhdGE9e2dlb0pzb25EYXRhfSBzdHlsZT17eyBjb2xvcjogJyMzYjgyZjYnLCB3ZWlnaHQ6IDUsIG9wYWNpdHk6IDAuOCB9fSAvPlxyXG4gICAgICAgICAgICA8Rml0Qm91bmRzIGRhdGE9e2dlb0pzb25EYXRhfSAvPlxyXG4gICAgICAgICAgPC8+XHJcbiAgICAgICAgKX1cclxuXHJcbiAgICAgICAge3NlbGVjdGVkUGlja3VwICYmIDxNYXJrZXIgcG9zaXRpb249e3NlbGVjdGVkUGlja3VwfSAvPn1cclxuXHJcbiAgICAgICAge2V4aXN0aW5nUGlja3VwICYmIDxNYXJrZXIgcG9zaXRpb249e1tleGlzdGluZ1BpY2t1cC5sYXQsIGV4aXN0aW5nUGlja3VwLmxuZ119IC8+fVxyXG4gICAgICAgIFxyXG4gICAgICAgIHt0aW1lc0RhdGEgJiYgdGltZXNEYXRhLnBpY2t1cHMgJiYgdGltZXNEYXRhLnBpY2t1cHMubWFwKChwOiBhbnksIGlkeDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgLy8gRm9yIHVzZXIgbW9kZSwgd2UgZG9uJ3QgcmVuZGVyIGFsbCBwaWNrdXBzLCB3ZSBvbmx5IHJlbmRlciBleGlzdGluZ1BpY2t1cC5cclxuICAgICAgICAgICAvLyBIb3dldmVyLCBpZiB3ZSdyZSByZW5kZXJpbmcgZXhpc3RpbmdQaWNrdXAgYXMgYSBub3JtYWwgcGluLCB3ZSBtaWdodCBub3QgbmVlZCB0aGlzLlxyXG4gICAgICAgICAgIC8vIFVzZXIgbW9kZTogT25seSBzaG93IGlmIGl0IG1hdGNoZXMgZXhpc3RpbmdQaWNrdXAuIFdhaXQsIHdlIE9OTFkgc2hvdyBwYXNzZW5nZXIgdGhlaXIgb3duIG1hcmtlciBpbiBKb3VybmV5L0FjdGl2aXR5IHZpYSBleGlzdGluZ1BpY2t1cCBwcm9wISBTbyB3ZSBjYW4ganVzdCBza2lwIHJlbmRlcmluZyBoZXJlIGZvciB1c2Vycy5cclxuICAgICAgICAgICBcclxuICAgICAgICAgICBpZiAoIWRyaXZlck1vZGUpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgIC8vIERyaXZlciBNb2RlOiBmaWx0ZXIgb3V0IGlmIGFsbCBib29raW5nX2lkcyBmb3IgdGhpcyBjb29yZGluYXRlIGFyZSBpbiBjb25maXJtZWRQaWNrdXBJZHNcclxuICAgICAgICAgICBpZiAocC5ib29raW5nX2lkcyAmJiBwLmJvb2tpbmdfaWRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgIGNvbnN0IGFsbENvbmZpcm1lZCA9IHAuYm9va2luZ19pZHMuZXZlcnkoKGlkOiBudW1iZXIpID0+IGNvbmZpcm1lZFBpY2t1cElkcy5pbmNsdWRlcyhpZCkpO1xyXG4gICAgICAgICAgICAgaWYgKGFsbENvbmZpcm1lZCkgcmV0dXJuIG51bGw7IC8vIERvbid0IHNob3cgdGhpcyBtYXJrZXIgYW55bW9yZVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBcclxuICAgICAgICAgICByZXR1cm4gPE1hcmtlciBrZXk9e2lkeH0gcG9zaXRpb249e1twLmxhdCwgcC5sbmddfSAvPjtcclxuICAgICAgICB9KX1cclxuXHJcbiAgICAgICAge2ludGVyYWN0aXZlICYmIDxNYXBDbGlja0V2ZW50IC8+fVxyXG4gICAgICA8L01hcENvbnRhaW5lcj5cclxuICAgIDwvZGl2PlxyXG4gICk7XHJcbn07XHJcbiJdLCJmaWxlIjoiQzovVXNlcnMveWxhbm4vdnNjb2RlL1VuaS9TYW11ZGh5YW5SaWRlcy9mcm9udGVuZC9zcmMvY29tcG9uZW50cy9NYXAvUmlkZVJlbmRlck1hcC50c3gifQ==