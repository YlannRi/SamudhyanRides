import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/TimetablePage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c85c9c72"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=c85c9c72"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useEffect = __vite__cjsImport1_react["useEffect"]; const useMemo = __vite__cjsImport1_react["useMemo"]; const useState = __vite__cjsImport1_react["useState"];
import { apiFetch } from "/src/lib/api.ts";
import { getProfileRecord } from "/src/lib/profilePreferences.ts";
function pad2(n) {
  return String(n).padStart(2, "0");
}
function toDatetimeLocal(d) {
  const yyyy = d.getFullYear();
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const min = pad2(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
const TimetablePage = ({ onBack, onSelectEvent }) => {
  _s();
  const [url, setUrl] = useState("");
  const [rememberUrl, setRememberUrl] = useState(true);
  const [dayOnly, setDayOnly] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  useEffect(() => {
    let ignore = false;
    const saved = localStorage.getItem("timetableUrl");
    if (saved) setUrl(saved);
    const token = localStorage.getItem("authToken");
    if (!token) return () => {
      ignore = true;
    };
    const loadSavedCalendarLink = async () => {
      try {
        const data = await apiFetch("users/me", { method: "GET" });
        const profile = getProfileRecord(data);
        const calendarLink = typeof profile?.calendar_link === "string" ? profile.calendar_link.trim() : "";
        if (!ignore && calendarLink) {
          setUrl(calendarLink);
          localStorage.setItem("timetableUrl", calendarLink);
        }
      } catch (fetchError) {
        console.error("Error fetching saved calendar link:", fetchError);
      } finally {
        if (!ignore) {
          setPreferencesLoaded(true);
        }
      }
    };
    void loadSavedCalendarLink();
    return () => {
      ignore = true;
    };
  }, []);
  const scope = useMemo(() => dayOnly ? "day" : "week", [dayOnly]);
  const persistCalendarLink = async (calendarLink) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      await apiFetch("users/me/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calendar_link: calendarLink })
      });
    } catch (saveError) {
      console.error("Error saving calendar link:", saveError);
    }
  };
  useEffect(() => {
    const trimmed = url.trim();
    if (rememberUrl) {
      if (trimmed) {
        localStorage.setItem("timetableUrl", trimmed);
      } else {
        localStorage.removeItem("timetableUrl");
      }
    } else {
      localStorage.removeItem("timetableUrl");
    }
  }, [rememberUrl, url]);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || !preferencesLoaded) {
      return;
    }
    const trimmed = url.trim();
    const nextCalendarLink = rememberUrl && trimmed ? trimmed : null;
    const timeoutId = window.setTimeout(() => {
      void persistCalendarLink(nextCalendarLink);
    }, 400);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [preferencesLoaded, rememberUrl, url]);
  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const trimmed = url.trim();
      if (!trimmed) throw new Error("Please paste your university timetable iCal URL.");
      const data = await apiFetch("timetable/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed, scope })
      });
      setEvents(Array.isArray(data) ? data : []);
    } catch (e) {
      setEvents([]);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };
  const handlePickEvent = (ev) => {
    const start = new Date(ev.start);
    const arrival = new Date(start.getTime() - 15 * 60 * 1e3);
    onSelectEvent({
      destination: "University of Bath",
      arrivalDateTimeLocal: toDatetimeLocal(arrival)
    });
  };
  return /* @__PURE__ */ jsxDEV("div", { style: { width: "100%" }, children: [
    /* @__PURE__ */ jsxDEV("header", { className: "uber-header", style: { display: "flex", alignItems: "center", gap: 12 }, children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: onBack,
          style: { background: "none", border: "none", color: "var(--text-primary)", fontSize: 20, padding: 0 },
          "aria-label": "Back",
          title: "Back",
          children: "←"
        },
        void 0,
        false,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
          lineNumber: 167,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("h1", { className: "activity-title", style: { margin: 0 }, children: "Timetable" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
        lineNumber: 176,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
      lineNumber: 166,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "auth-card", style: { marginBottom: 16 }, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "auth-field", children: [
        /* @__PURE__ */ jsxDEV("label", { className: "auth-label", htmlFor: "timetable-ical-url", children: "University timetable iCal URL" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
          lineNumber: 181,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(
          "input",
          {
            id: "timetable-ical-url",
            className: "auth-input",
            type: "text",
            placeholder: "https://mytimetable.bath.ac.uk/ical?...",
            value: url,
            onChange: (e) => setUrl(e.target.value)
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
            lineNumber: 182,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
        lineNumber: 180,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", gap: 14, alignItems: "center", marginTop: 10, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxDEV("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }, children: [
          /* @__PURE__ */ jsxDEV("input", { type: "checkbox", checked: dayOnly, onChange: (e) => setDayOnly(e.target.checked) }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
            lineNumber: 194,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { style: { color: "var(--text-typed)" }, children: "Day" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
            lineNumber: 195,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
          lineNumber: 193,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("label", { style: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }, children: [
          /* @__PURE__ */ jsxDEV("input", { type: "checkbox", checked: rememberUrl, onChange: (e) => setRememberUrl(e.target.checked) }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
            lineNumber: 199,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV("span", { style: { color: "var(--text-typed)" }, children: "Remember URL" }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
            lineNumber: 200,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
          lineNumber: 198,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
        lineNumber: 192,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "auth-submit", onClick: loadEvents, disabled: loading, style: { marginTop: 12 }, children: loading ? "Loading..." : `Load ${dayOnly ? "today" : "this week"}` }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
        lineNumber: 204,
        columnNumber: 9
      }, this),
      error && /* @__PURE__ */ jsxDEV("div", { style: { marginTop: 10, color: "#f87171" }, children: error }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
        lineNumber: 208,
        columnNumber: 19
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
      lineNumber: 179,
      columnNumber: 7
    }, this),
    !loading && !error && events.length === 0 && /* @__PURE__ */ jsxDEV("div", { className: "card activity-upcoming-card", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("div", { className: "activity-upcoming-title", children: "No events found" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
          lineNumber: 214,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "activity-upcoming-subtitle", children: [
          "Paste your iCal URL and load ",
          dayOnly ? "today" : "this week",
          "."
        ] }, void 0, true, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
          lineNumber: 215,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
        lineNumber: 213,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "activity-upcoming-icon", children: "📅" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
        lineNumber: 217,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
      lineNumber: 212,
      columnNumber: 7
    }, this),
    !loading && events.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "past-list", children: events.map((ev) => {
      const start = new Date(ev.start);
      const end = new Date(ev.end);
      const timeRange = `${start.toLocaleString([], { weekday: "short", hour: "2-digit", minute: "2-digit" })} → ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      return /* @__PURE__ */ jsxDEV(
        "button",
        {
          className: "card trip-row-card",
          style: { textAlign: "left" },
          onClick: () => handlePickEvent(ev),
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "trip-row-left", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "trip-car-icon", children: "🎓" }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
                lineNumber: 236,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "trip-row-text", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "trip-row-title", children: ev.title }, void 0, false, {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
                  lineNumber: 238,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "trip-row-meta", children: timeRange }, void 0, false, {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
                  lineNumber: 239,
                  columnNumber: 21
                }, this),
                ev.location && /* @__PURE__ */ jsxDEV("div", { className: "trip-row-meta", children: ev.location }, void 0, false, {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
                  lineNumber: 240,
                  columnNumber: 37
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
                lineNumber: 237,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
              lineNumber: 235,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "pill pill-solid trip-row-button", children: "Request ride" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
              lineNumber: 243,
              columnNumber: 17
            }, this)
          ]
        },
        ev.uid,
        true,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
          lineNumber: 229,
          columnNumber: 13
        },
        this
      );
    }) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
      lineNumber: 222,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx",
    lineNumber: 165,
    columnNumber: 5
  }, this);
};
_s(TimetablePage, "vB/7pS0QqIqc1P1USrtoqyxPHp8=");
_c = TimetablePage;
export default TimetablePage;
var _c;
$RefreshReg$(_c, "TimetablePage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/TimetablePage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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QUdtQyxZQUFZLHVCQUFDLFNBQUksV0FBVSxpQkFBaUJuQyxhQUFHbUMsWUFBbkM7QUFBQTtBQUFBO0FBQUE7QUFBQSx1QkFBNEM7QUFBQSxtQkFIOUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFJQTtBQUFBLGlCQU5GO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBT0E7QUFBQSxZQUNBLHVCQUFDLFNBQUksV0FBVSxtQ0FBa0MsNEJBQWpEO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQTZEO0FBQUE7QUFBQTtBQUFBLFFBYnhEbkMsR0FBR29DO0FBQUFBLFFBRFY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQWVBO0FBQUEsSUFFSixDQUFDLEtBeEJIO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0F5QkE7QUFBQSxPQWxGSjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBb0ZBO0FBRUo7QUFBRXZGLEdBck5JSCxlQUE4QjtBQUFBMkYsS0FBOUIzRjtBQXVOTixlQUFlQTtBQUFjLElBQUEyRjtBQUFBQyxhQUFBRCxJQUFBIiwibmFtZXMiOlsiUmVhY3QiLCJ1c2VFZmZlY3QiLCJ1c2VNZW1vIiwidXNlU3RhdGUiLCJhcGlGZXRjaCIsImdldFByb2ZpbGVSZWNvcmQiLCJwYWQyIiwibiIsIlN0cmluZyIsInBhZFN0YXJ0IiwidG9EYXRldGltZUxvY2FsIiwiZCIsInl5eXkiLCJnZXRGdWxsWWVhciIsIm1tIiwiZ2V0TW9udGgiLCJkZCIsImdldERhdGUiLCJoaCIsImdldEhvdXJzIiwibWluIiwiZ2V0TWludXRlcyIsIlRpbWV0YWJsZVBhZ2UiLCJvbkJhY2siLCJvblNlbGVjdEV2ZW50IiwiX3MiLCJ1cmwiLCJzZXRVcmwiLCJyZW1lbWJlclVybCIsInNldFJlbWVtYmVyVXJsIiwiZGF5T25seSIsInNldERheU9ubHkiLCJldmVudHMiLCJzZXRFdmVudHMiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImVycm9yIiwic2V0RXJyb3IiLCJwcmVmZXJlbmNlc0xvYWRlZCIsInNldFByZWZlcmVuY2VzTG9hZGVkIiwiaWdub3JlIiwic2F2ZWQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwidG9rZW4iLCJsb2FkU2F2ZWRDYWxlbmRhckxpbmsiLCJkYXRhIiwibWV0aG9kIiwicHJvZmlsZSIsImNhbGVuZGFyTGluayIsImNhbGVuZGFyX2xpbmsiLCJ0cmltIiwic2V0SXRlbSIsImZldGNoRXJyb3IiLCJjb25zb2xlIiwic2NvcGUiLCJwZXJzaXN0Q2FsZW5kYXJMaW5rIiwiaGVhZGVycyIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5Iiwic2F2ZUVycm9yIiwidHJpbW1lZCIsInJlbW92ZUl0ZW0iLCJuZXh0Q2FsZW5kYXJMaW5rIiwidGltZW91dElkIiwid2luZG93Iiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsImxvYWRFdmVudHMiLCJFcnJvciIsIkFycmF5IiwiaXNBcnJheSIsImUiLCJtZXNzYWdlIiwiaGFuZGxlUGlja0V2ZW50IiwiZXYiLCJzdGFydCIsIkRhdGUiLCJhcnJpdmFsIiwiZ2V0VGltZSIsImRlc3RpbmF0aW9uIiwiYXJyaXZhbERhdGVUaW1lTG9jYWwiLCJ3aWR0aCIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwiZ2FwIiwiYmFja2dyb3VuZCIsImJvcmRlciIsImNvbG9yIiwiZm9udFNpemUiLCJwYWRkaW5nIiwibWFyZ2luIiwibWFyZ2luQm90dG9tIiwidGFyZ2V0IiwidmFsdWUiLCJtYXJnaW5Ub3AiLCJmbGV4V3JhcCIsImN1cnNvciIsImNoZWNrZWQiLCJsZW5ndGgiLCJtYXAiLCJlbmQiLCJ0aW1lUmFuZ2UiLCJ0b0xvY2FsZVN0cmluZyIsIndlZWtkYXkiLCJob3VyIiwibWludXRlIiwidG9Mb2NhbGVUaW1lU3RyaW5nIiwidGV4dEFsaWduIiwidGl0bGUiLCJsb2NhdGlvbiIsInVpZCIsIl9jIiwiJFJlZnJlc2hSZWckIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIlRpbWV0YWJsZVBhZ2UudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgYXBpRmV0Y2ggfSBmcm9tICcuL2xpYi9hcGknO1xuaW1wb3J0IHsgZ2V0UHJvZmlsZVJlY29yZCB9IGZyb20gJy4vbGliL3Byb2ZpbGVQcmVmZXJlbmNlcyc7XG5cclxuZXhwb3J0IHR5cGUgVGltZXRhYmxlRXZlbnQgPSB7XHJcbiAgdWlkOiBzdHJpbmc7XHJcbiAgdGl0bGU6IHN0cmluZztcclxuICBsb2NhdGlvbj86IHN0cmluZyB8IG51bGw7XHJcbiAgZGVzY3JpcHRpb24/OiBzdHJpbmcgfCBudWxsO1xyXG4gIHN0YXJ0OiBzdHJpbmc7IC8vIElTT1xyXG4gIGVuZDogc3RyaW5nOyAgIC8vIElTT1xyXG59O1xyXG5cclxuZXhwb3J0IHR5cGUgUmlkZVByZWZpbGwgPSB7XHJcbiAgb3JpZ2luPzogc3RyaW5nO1xyXG4gIGRlc3RpbmF0aW9uOiBzdHJpbmc7XHJcbiAgYXJyaXZhbERhdGVUaW1lTG9jYWw/OiBzdHJpbmc7IC8vIHl5eXktbW0tZGRUaGg6bW1cclxufTtcclxuXHJcbmZ1bmN0aW9uIHBhZDIobjogbnVtYmVyKSB7XHJcbiAgcmV0dXJuIFN0cmluZyhuKS5wYWRTdGFydCgyLCAnMCcpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0b0RhdGV0aW1lTG9jYWwoZDogRGF0ZSkge1xyXG4gIGNvbnN0IHl5eXkgPSBkLmdldEZ1bGxZZWFyKCk7XHJcbiAgY29uc3QgbW0gPSBwYWQyKGQuZ2V0TW9udGgoKSArIDEpO1xyXG4gIGNvbnN0IGRkID0gcGFkMihkLmdldERhdGUoKSk7XHJcbiAgY29uc3QgaGggPSBwYWQyKGQuZ2V0SG91cnMoKSk7XHJcbiAgY29uc3QgbWluID0gcGFkMihkLmdldE1pbnV0ZXMoKSk7XHJcbiAgcmV0dXJuIGAke3l5eXl9LSR7bW19LSR7ZGR9VCR7aGh9OiR7bWlufWA7XHJcbn1cclxuXHJcbnR5cGUgUHJvcHMgPSB7XHJcbiAgb25CYWNrOiAoKSA9PiB2b2lkO1xyXG4gIG9uU2VsZWN0RXZlbnQ6IChwcmVmaWxsOiBSaWRlUHJlZmlsbCkgPT4gdm9pZDtcclxufTtcclxuXHJcbmNvbnN0IFRpbWV0YWJsZVBhZ2U6IFJlYWN0LkZDPFByb3BzPiA9ICh7IG9uQmFjaywgb25TZWxlY3RFdmVudCB9KSA9PiB7XG4gIGNvbnN0IFt1cmwsIHNldFVybF0gPSB1c2VTdGF0ZSgnJyk7XHJcbiAgY29uc3QgW3JlbWVtYmVyVXJsLCBzZXRSZW1lbWJlclVybF0gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCBbZGF5T25seSwgc2V0RGF5T25seV0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gIGNvbnN0IFtldmVudHMsIHNldEV2ZW50c10gPSB1c2VTdGF0ZTxUaW1ldGFibGVFdmVudFtdPihbXSk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcbiAgY29uc3QgW3ByZWZlcmVuY2VzTG9hZGVkLCBzZXRQcmVmZXJlbmNlc0xvYWRlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgaWdub3JlID0gZmFsc2U7XG4gICAgY29uc3Qgc2F2ZWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndGltZXRhYmxlVXJsJyk7XG4gICAgaWYgKHNhdmVkKSBzZXRVcmwoc2F2ZWQpO1xuXG4gICAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0aFRva2VuJyk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuICgpID0+IHsgaWdub3JlID0gdHJ1ZTsgfTtcblxuICAgIGNvbnN0IGxvYWRTYXZlZENhbGVuZGFyTGluayA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBhcGlGZXRjaCgndXNlcnMvbWUnLCB7IG1ldGhvZDogJ0dFVCcgfSk7XG4gICAgICAgIGNvbnN0IHByb2ZpbGUgPSBnZXRQcm9maWxlUmVjb3JkKGRhdGEpO1xuICAgICAgICBjb25zdCBjYWxlbmRhckxpbmsgPSB0eXBlb2YgcHJvZmlsZT8uY2FsZW5kYXJfbGluayA9PT0gJ3N0cmluZydcbiAgICAgICAgICA/IHByb2ZpbGUuY2FsZW5kYXJfbGluay50cmltKClcbiAgICAgICAgICA6ICcnO1xuXG4gICAgICAgIGlmICghaWdub3JlICYmIGNhbGVuZGFyTGluaykge1xuICAgICAgICAgIHNldFVybChjYWxlbmRhckxpbmspO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0aW1ldGFibGVVcmwnLCBjYWxlbmRhckxpbmspO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChmZXRjaEVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIHNhdmVkIGNhbGVuZGFyIGxpbms6JywgZmV0Y2hFcnJvcik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoIWlnbm9yZSkge1xuICAgICAgICAgIHNldFByZWZlcmVuY2VzTG9hZGVkKHRydWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZvaWQgbG9hZFNhdmVkQ2FsZW5kYXJMaW5rKCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWdub3JlID0gdHJ1ZTtcbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgY29uc3Qgc2NvcGUgPSB1c2VNZW1vKCgpID0+IChkYXlPbmx5ID8gJ2RheScgOiAnd2VlaycpLCBbZGF5T25seV0pO1xuXG4gIGNvbnN0IHBlcnNpc3RDYWxlbmRhckxpbmsgPSBhc3luYyAoY2FsZW5kYXJMaW5rOiBzdHJpbmcgfCBudWxsKSA9PiB7XG4gICAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYXV0aFRva2VuJyk7XG4gICAgaWYgKCF0b2tlbikgcmV0dXJuO1xuXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGFwaUZldGNoKCd1c2Vycy9tZS9wcmVmZXJlbmNlcycsIHtcbiAgICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgY2FsZW5kYXJfbGluazogY2FsZW5kYXJMaW5rIH0pLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoc2F2ZUVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzYXZpbmcgY2FsZW5kYXIgbGluazonLCBzYXZlRXJyb3IpO1xuICAgIH1cbiAgfTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHRyaW1tZWQgPSB1cmwudHJpbSgpO1xuXG4gICAgaWYgKHJlbWVtYmVyVXJsKSB7XG4gICAgICBpZiAodHJpbW1lZCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndGltZXRhYmxlVXJsJywgdHJpbW1lZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndGltZXRhYmxlVXJsJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0aW1ldGFibGVVcmwnKTtcbiAgICB9XG4gIH0sIFtyZW1lbWJlclVybCwgdXJsXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdhdXRoVG9rZW4nKTtcbiAgICBpZiAoIXRva2VuIHx8ICFwcmVmZXJlbmNlc0xvYWRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRyaW1tZWQgPSB1cmwudHJpbSgpO1xuICAgIGNvbnN0IG5leHRDYWxlbmRhckxpbmsgPSByZW1lbWJlclVybCAmJiB0cmltbWVkID8gdHJpbW1lZCA6IG51bGw7XG4gICAgY29uc3QgdGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdm9pZCBwZXJzaXN0Q2FsZW5kYXJMaW5rKG5leHRDYWxlbmRhckxpbmspO1xuICAgIH0sIDQwMCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgIH07XG4gIH0sIFtwcmVmZXJlbmNlc0xvYWRlZCwgcmVtZW1iZXJVcmwsIHVybF0pO1xuXG4gIGNvbnN0IGxvYWRFdmVudHMgPSBhc3luYyAoKSA9PiB7XG4gICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICBzZXRFcnJvcihudWxsKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdHJpbW1lZCA9IHVybC50cmltKCk7XG4gICAgICBpZiAoIXRyaW1tZWQpIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHBhc3RlIHlvdXIgdW5pdmVyc2l0eSB0aW1ldGFibGUgaUNhbCBVUkwuJyk7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBhcGlGZXRjaDxUaW1ldGFibGVFdmVudFtdPigndGltZXRhYmxlL2V2ZW50cycsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHVybDogdHJpbW1lZCwgc2NvcGUgfSksXG4gICAgICB9KTtcblxuICAgICAgc2V0RXZlbnRzKEFycmF5LmlzQXJyYXkoZGF0YSkgPyBkYXRhIDogW10pO1xuICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcclxuICAgICAgc2V0RXZlbnRzKFtdKTtcclxuICAgICAgc2V0RXJyb3IoZSBpbnN0YW5jZW9mIEVycm9yID8gZS5tZXNzYWdlIDogU3RyaW5nKGUpKTtcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZVBpY2tFdmVudCA9IChldjogVGltZXRhYmxlRXZlbnQpID0+IHtcclxuICAgIGNvbnN0IHN0YXJ0ID0gbmV3IERhdGUoZXYuc3RhcnQpO1xyXG4gICAgY29uc3QgYXJyaXZhbCA9IG5ldyBEYXRlKHN0YXJ0LmdldFRpbWUoKSAtIDE1ICogNjAgKiAxMDAwKTtcclxuXHJcbiAgICBvblNlbGVjdEV2ZW50KHtcclxuICAgICAgZGVzdGluYXRpb246ICdVbml2ZXJzaXR5IG9mIEJhdGgnLFxyXG4gICAgICBhcnJpdmFsRGF0ZVRpbWVMb2NhbDogdG9EYXRldGltZUxvY2FsKGFycml2YWwpLFxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6ICcxMDAlJyB9fT5cclxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJ1YmVyLWhlYWRlclwiIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGdhcDogMTIgfX0+XHJcbiAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICBvbkNsaWNrPXtvbkJhY2t9XHJcbiAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kOiAnbm9uZScsIGJvcmRlcjogJ25vbmUnLCBjb2xvcjogJ3ZhcigtLXRleHQtcHJpbWFyeSknLCBmb250U2l6ZTogMjAsIHBhZGRpbmc6IDAgfX1cclxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJCYWNrXCJcclxuICAgICAgICAgIHRpdGxlPVwiQmFja1wiXHJcbiAgICAgICAgPlxyXG4gICAgICAgICAg4oaQXHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPGgxIGNsYXNzTmFtZT1cImFjdGl2aXR5LXRpdGxlXCIgc3R5bGU9e3sgbWFyZ2luOiAwIH19PlRpbWV0YWJsZTwvaDE+XHJcbiAgICAgIDwvaGVhZGVyPlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJhdXRoLWNhcmRcIiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDE2IH19PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYXV0aC1maWVsZFwiPlxyXG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImF1dGgtbGFiZWxcIiBodG1sRm9yPVwidGltZXRhYmxlLWljYWwtdXJsXCI+VW5pdmVyc2l0eSB0aW1ldGFibGUgaUNhbCBVUkw8L2xhYmVsPlxyXG4gICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgIGlkPVwidGltZXRhYmxlLWljYWwtdXJsXCJcclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYXV0aC1pbnB1dFwiXHJcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJodHRwczovL215dGltZXRhYmxlLmJhdGguYWMudWsvaWNhbD8uLi5cIlxyXG4gICAgICAgICAgICB2YWx1ZT17dXJsfVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFVybChlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZ2FwOiAxNCwgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpblRvcDogMTAsIGZsZXhXcmFwOiAnd3JhcCcgfX0+XHJcbiAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiA4LCBjdXJzb3I6ICdwb2ludGVyJyB9fT5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e2RheU9ubHl9IG9uQ2hhbmdlPXsoZSkgPT4gc2V0RGF5T25seShlLnRhcmdldC5jaGVja2VkKX0gLz5cclxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6ICd2YXIoLS10ZXh0LXR5cGVkKScgfX0+RGF5PC9zcGFuPlxyXG4gICAgICAgICAgPC9sYWJlbD5cclxuXHJcbiAgICAgICAgICA8bGFiZWwgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiA4LCBjdXJzb3I6ICdwb2ludGVyJyB9fT5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3JlbWVtYmVyVXJsfSBvbkNoYW5nZT17KGUpID0+IHNldFJlbWVtYmVyVXJsKGUudGFyZ2V0LmNoZWNrZWQpfSAvPlxyXG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogJ3ZhcigtLXRleHQtdHlwZWQpJyB9fT5SZW1lbWJlciBVUkw8L3NwYW4+XHJcbiAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImF1dGgtc3VibWl0XCIgb25DbGljaz17bG9hZEV2ZW50c30gZGlzYWJsZWQ9e2xvYWRpbmd9IHN0eWxlPXt7IG1hcmdpblRvcDogMTIgfX0+XHJcbiAgICAgICAgICB7bG9hZGluZyA/ICdMb2FkaW5nLi4uJyA6IGBMb2FkICR7ZGF5T25seSA/ICd0b2RheScgOiAndGhpcyB3ZWVrJ31gfVxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICB7ZXJyb3IgJiYgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IDEwLCBjb2xvcjogJyNmODcxNzEnIH19PntlcnJvcn08L2Rpdj59XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgeyFsb2FkaW5nICYmICFlcnJvciAmJiBldmVudHMubGVuZ3RoID09PSAwICYmIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQgYWN0aXZpdHktdXBjb21pbmctY2FyZFwiPlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhY3Rpdml0eS11cGNvbWluZy10aXRsZVwiPk5vIGV2ZW50cyBmb3VuZDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFjdGl2aXR5LXVwY29taW5nLXN1YnRpdGxlXCI+UGFzdGUgeW91ciBpQ2FsIFVSTCBhbmQgbG9hZCB7ZGF5T25seSA/ICd0b2RheScgOiAndGhpcyB3ZWVrJ30uPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWN0aXZpdHktdXBjb21pbmctaWNvblwiPvCfk4U8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIHshbG9hZGluZyAmJiBldmVudHMubGVuZ3RoID4gMCAmJiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYXN0LWxpc3RcIj5cclxuICAgICAgICAgIHtldmVudHMubWFwKChldikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKGV2LnN0YXJ0KTtcclxuICAgICAgICAgICAgY29uc3QgZW5kID0gbmV3IERhdGUoZXYuZW5kKTtcclxuICAgICAgICAgICAgY29uc3QgdGltZVJhbmdlID0gYCR7c3RhcnQudG9Mb2NhbGVTdHJpbmcoW10sIHsgd2Vla2RheTogJ3Nob3J0JywgaG91cjogJzItZGlnaXQnLCBtaW51dGU6ICcyLWRpZ2l0JyB9KX0g4oaSICR7ZW5kLnRvTG9jYWxlVGltZVN0cmluZyhbXSwgeyBob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnIH0pfWA7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgIGtleT17ZXYudWlkfVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2FyZCB0cmlwLXJvdy1jYXJkXCJcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IHRleHRBbGlnbjogJ2xlZnQnIH19XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVQaWNrRXZlbnQoZXYpfVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRyaXAtY2FyLWljb25cIj7wn46TPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctdGV4dFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidHJpcC1yb3ctdGl0bGVcIj57ZXYudGl0bGV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0cmlwLXJvdy1tZXRhXCI+e3RpbWVSYW5nZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICB7ZXYubG9jYXRpb24gJiYgPGRpdiBjbGFzc05hbWU9XCJ0cmlwLXJvdy1tZXRhXCI+e2V2LmxvY2F0aW9ufTwvZGl2Pn1cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGlsbCBwaWxsLXNvbGlkIHRyaXAtcm93LWJ1dHRvblwiPlJlcXVlc3QgcmlkZTwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSl9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICl9XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGltZXRhYmxlUGFnZTtcbiJdLCJmaWxlIjoiQzovVXNlcnMveWxhbm4vdnNjb2RlL1VuaS9TYW11ZGh5YW5SaWRlcy9mcm9udGVuZC9zcmMvVGltZXRhYmxlUGFnZS50c3gifQ==