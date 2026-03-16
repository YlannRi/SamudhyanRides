import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c85c9c72"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=c85c9c72"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useEffect = __vite__cjsImport1_react["useEffect"]; const useState = __vite__cjsImport1_react["useState"];
import "/src/App.css";
import HomePage from "/src/HomePage.tsx";
import AccountPage from "/src/AccountPage.tsx";
import LoginPage from "/src/LoginPage.tsx";
import DriverSignupPage, {} from "/src/DriverSignupPage.tsx";
import ActivityPage from "/src/ActivityPage.tsx";
import RequestRidePage from "/src/RequestRidePage.tsx";
import PostRidePage from "/src/PostRidePage.tsx";
import JourneyPage from "/src/JourneyPage.tsx";
import SettingsPage from "/src/SettingsPage.tsx";
import ChatPage from "/src/ChatPage.tsx";
import InboxPage from "/src/InboxPage.tsx";
import ChatToastLayer, {} from "/src/ChatToastLayer.tsx";
import { apiFetch } from "/src/lib/api.ts";
import TimetablePage, {} from "/src/TimetablePage.tsx";
import SafetyCheckupPage from "/src/SafetyCheckupPage.tsx";
import { getAuthToken, clearAuthToken } from "/src/lib/authToken.ts";
import {
  getUnreadCount,
  markReadByLink,
  resetNotifications,
  startPolling,
  startRealtimeNotifications,
  subscribe,
  subscribeToIncomingNotifications
} from "/src/lib/notifications.ts";
import { areSameChatLink, buildChatPath, parseChatLink } from "/src/lib/chatRoutes.ts";
import { SpeedInsights } from "/node_modules/.vite/deps/@vercel_speed-insights_react.js?v=1e22aed8";
const CHAT_TITLE_PREFIX = "New message from ";
const getChatToastSenderName = (title) => {
  if (title.startsWith(CHAT_TITLE_PREFIX)) {
    return title.slice(CHAT_TITLE_PREFIX.length).trim();
  }
  return title;
};
const applyRouteMode = (url, setActivityMode, setJourneyMode) => {
  const requestedMode = url.searchParams.get("mode");
  if (url.pathname.startsWith("/activity")) {
    setActivityMode(requestedMode === "driver" ? "Driver" : "user");
  }
  if (url.pathname.startsWith("/journey")) {
    setJourneyMode(requestedMode === "driver" ? "driver" : "user");
  }
};
const pathToTab = (path) => {
  if (path.startsWith("/chat")) return "chat";
  if (path.startsWith("/inbox")) return "inbox";
  if (path.startsWith("/account")) return "account";
  if (path.startsWith("/activity")) return "activity";
  if (path.startsWith("/post-ride")) return "post";
  if (path.startsWith("/request-ride")) return "request";
  if (path.startsWith("/timetable")) return "timetable";
  if (path.startsWith("/journey")) return "journey";
  if (path.startsWith("/settings")) return "settings";
  if (path.startsWith("/safety")) return "safety";
  return "home";
};
const tabToPath = (tab) => {
  switch (tab) {
    case "account":
      return "/account";
    case "activity":
      return "/activity";
    case "post":
      return "/post-ride";
    case "request":
      return "/request-ride";
    case "timetable":
      return "/timetable";
    case "journey":
      return "/journey";
    case "settings":
      return "/settings";
    case "safety":
      return "/safety";
    case "chat":
      return "/chat";
    case "inbox":
      return "/inbox";
    default:
      return "/";
  }
};
export const MapPlaceholder = ({ label = "Map Preview" }) => /* @__PURE__ */ jsxDEV("div", { className: "map-placeholder", children: [
  /* @__PURE__ */ jsxDEV("svg", { viewBox: "0 0 400 220", xmlns: "http://www.w3.org/2000/svg", className: "map-svg", children: [
    /* @__PURE__ */ jsxDEV("rect", { width: "400", height: "220", fill: "#e8ead6" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 102,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("path", { d: "M0,110 Q100,90 200,110 Q300,130 400,110", stroke: "#fff", strokeWidth: "10", fill: "none" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 103,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      "path",
      {
        d: "M0,110 Q100,90 200,110 Q300,130 400,110",
        stroke: "#d4c89a",
        strokeWidth: "8",
        fill: "none",
        strokeDasharray: "20,8"
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
        lineNumber: 104,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("path", { d: "M150,0 Q160,80 170,110 Q180,150 175,220", stroke: "#fff", strokeWidth: "8", fill: "none" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 111,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("path", { d: "M250,0 Q245,70 240,110 Q235,155 230,220", stroke: "#fff", strokeWidth: "6", fill: "none" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 112,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      "path",
      {
        d: "M80,170 Q130,140 180,110 Q230,80 310,55",
        stroke: "#3b82f6",
        strokeWidth: "4",
        fill: "none",
        strokeLinecap: "round",
        strokeDasharray: "10,4"
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
        lineNumber: 113,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("circle", { cx: "80", cy: "170", r: "10", fill: "#22c55e" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 121,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("circle", { cx: "80", cy: "170", r: "6", fill: "#fff" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 122,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("circle", { cx: "80", cy: "170", r: "3", fill: "#22c55e" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 123,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("circle", { cx: "310", cy: "55", r: "12", fill: "#ef4444" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 124,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("circle", { cx: "310", cy: "55", r: "6", fill: "#fff" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 125,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("path", { d: "M310,67 L310,80", stroke: "#ef4444", strokeWidth: "3", strokeLinecap: "round" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 126,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("text", { x: "60", y: "195", fontSize: "10", fill: "#166534", fontWeight: "bold", children: "Pick Up" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 127,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("text", { x: "290", y: "48", fontSize: "10", fill: "#991b1b", fontWeight: "bold", children: "Drop Off" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 130,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 101,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV("div", { className: "map-badge", children: label }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 134,
    columnNumber: 5
  }, this)
] }, void 0, true, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
  lineNumber: 100,
  columnNumber: 1
}, this);
_c = MapPlaceholder;
export const Icons = {
  message: /* @__PURE__ */ jsxDEV("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxDEV("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 141,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 140,
    columnNumber: 3
  }, this),
  cancel: /* @__PURE__ */ jsxDEV("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxDEV("circle", { cx: "12", cy: "12", r: "10" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 146,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("line", { x1: "15", y1: "9", x2: "9", y2: "15" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 147,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("line", { x1: "9", y1: "9", x2: "15", y2: "15" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 148,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 145,
    columnNumber: 3
  }, this),
  star: /* @__PURE__ */ jsxDEV("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxDEV("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 153,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 152,
    columnNumber: 3
  }, this),
  report: /* @__PURE__ */ jsxDEV("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxDEV("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 158,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("line", { x1: "12", y1: "9", x2: "12", y2: "13" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 159,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 160,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 157,
    columnNumber: 3
  }, this),
  accept: /* @__PURE__ */ jsxDEV("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxDEV("polyline", { points: "20 6 9 17 4 12" }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 165,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 164,
    columnNumber: 3
  }, this),
  remove: /* @__PURE__ */ jsxDEV("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxDEV("polyline", { points: "3 6 5 6 21 6" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 170,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("path", { d: "M19 6l-1 14H6L5 6" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 171,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("path", { d: "M10 11v6M14 11v6" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 172,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("path", { d: "M9 6V4h6v2" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 173,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 169,
    columnNumber: 3
  }, this),
  back: /* @__PURE__ */ jsxDEV("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxDEV("path", { d: "M19 12H5M12 5l-7 7 7 7" }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 178,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 177,
    columnNumber: 3
  }, this),
  clock: /* @__PURE__ */ jsxDEV("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxDEV("circle", { cx: "12", cy: "12", r: "10" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 183,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("polyline", { points: "12 6 12 12 16 14" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 184,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 182,
    columnNumber: 3
  }, this),
  check: /* @__PURE__ */ jsxDEV("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxDEV("polyline", { points: "20 6 9 17 4 12" }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 189,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 188,
    columnNumber: 3
  }, this),
  pin: /* @__PURE__ */ jsxDEV("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxDEV("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 194,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("circle", { cx: "12", cy: "10", r: "3" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 195,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 193,
    columnNumber: 3
  }, this),
  next: /* @__PURE__ */ jsxDEV("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxDEV("path", { d: "M5 12h14M12 5l7 7-7 7" }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 200,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 199,
    columnNumber: 3
  }, this)
};
export const DetailRow = ({ label, value, valueClass }) => /* @__PURE__ */ jsxDEV("div", { className: "sheet-detail-row", children: [
  /* @__PURE__ */ jsxDEV("span", { className: "detail-label", children: label }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 207,
    columnNumber: 5
  }, this),
  /* @__PURE__ */ jsxDEV("span", { className: `detail-value ${valueClass ?? ""}`, children: value }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 208,
    columnNumber: 5
  }, this)
] }, void 0, true, {
  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
  lineNumber: 206,
  columnNumber: 1
}, this);
_c2 = DetailRow;
export const Btn = ({
  cls,
  icon,
  label,
  small,
  onClick
}) => /* @__PURE__ */ jsxDEV(
  "button",
  {
    type: "button",
    className: `sheet-action-btn ${cls}${small ? " btn-small" : ""}`,
    onClick,
    "aria-label": label,
    children: [
      icon,
      label
    ]
  },
  void 0,
  true,
  {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 219,
    columnNumber: 1
  },
  this
);
_c3 = Btn;
const App = () => {
  _s();
  const [activeTab, setActiveTab] = useState(() => pathToTab(window.location.pathname));
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(getAuthToken());
  });
  const [authScreen, setAuthScreen] = useState("login");
  const [requestRidePrefill, setRequestRidePrefill] = useState(void 0);
  const [postRidePrefill, setPostRidePrefill] = useState(void 0);
  const [journeyMode, setJourneyMode] = useState("user");
  const [activityMode, setActivityMode] = useState("user");
  const [chatRideId, setChatRideId] = useState(null);
  const [chatParticipantId, setChatParticipantId] = useState(void 0);
  const [chatReturnTab, setChatReturnTab] = useState("activity");
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatToasts, setChatToasts] = useState([]);
  const activeChatLink = activeTab === "chat" && chatRideId ? buildChatPath(chatRideId, chatParticipantId) : null;
  useEffect(() => {
    const unsub = subscribe(() => setUnreadCount(getUnreadCount()));
    return unsub;
  }, []);
  useEffect(() => {
    const unsubscribe = subscribeToIncomingNotifications((notification) => {
      const notificationLink = notification.link;
      if (notification.type !== "chat" || !notificationLink) {
        return;
      }
      if (activeChatLink && areSameChatLink(notificationLink, activeChatLink)) {
        void markReadByLink(notificationLink);
        return;
      }
      setChatToasts((prev) => {
        if (prev.some((toast) => toast.id === notification.id)) {
          return prev;
        }
        return [
          {
            id: notification.id,
            senderName: getChatToastSenderName(notification.title),
            preview: notification.body,
            link: notificationLink
          },
          ...prev
        ];
      });
    });
    return unsubscribe;
  }, [activeChatLink]);
  useEffect(() => {
    if (!activeChatLink) return;
    setChatToasts((prev) => prev.filter((toast) => !areSameChatLink(toast.link, activeChatLink)));
  }, [activeChatLink]);
  const navigate = (tab) => {
    const nextPath = tabToPath(tab);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setActiveTab(tab);
  };
  const openChat = (rideId, participantId, sourceTab = activeTab === "chat" ? chatReturnTab : activeTab) => {
    setChatRideId(rideId);
    setChatParticipantId(participantId);
    setChatReturnTab(sourceTab);
    window.history.pushState({}, "", buildChatPath(rideId, participantId));
    setActiveTab("chat");
  };
  const navigateFromLink = (link) => {
    const chatRoute = parseChatLink(link);
    if (chatRoute) {
      openChat(chatRoute.rideId, chatRoute.participantId);
    } else {
      const url = new URL(link, window.location.origin);
      applyRouteMode(url, setActivityMode, setJourneyMode);
      window.history.pushState({}, "", `${url.pathname}${url.search}`);
      setActiveTab(pathToTab(url.pathname));
    }
  };
  useEffect(() => {
    const syncRouteState = () => {
      const currentUrl = new URL(window.location.href);
      const chatRoute = parseChatLink(window.location.href);
      if (chatRoute) {
        setChatRideId(chatRoute.rideId);
        setChatParticipantId(chatRoute.participantId);
      } else {
        setChatRideId(null);
        setChatParticipantId(void 0);
      }
      applyRouteMode(currentUrl, setActivityMode, setJourneyMode);
      setActiveTab(pathToTab(window.location.pathname));
    };
    syncRouteState();
    const onPopState = () => syncRouteState();
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  const [canUseDriverMode, setCanUseDriverMode] = useState(false);
  const [showDriverSignup, setShowDriverSignup] = useState(false);
  const [afterDriverSignupTab, setAfterDriverSignupTab] = useState("home");
  const refreshDriverStatus = async () => {
    try {
      const res = await apiFetch("drivers/me/status", { method: "GET" });
      const ok = Boolean(res?.is_driver);
      setCanUseDriverMode(ok);
      return ok;
    } catch (e) {
      setCanUseDriverMode(false);
      return false;
    }
  };
  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    setIsAuthenticated(true);
    (async () => {
      try {
        await apiFetch("users/me", { method: "GET" });
        await refreshDriverStatus();
        startPolling();
        startRealtimeNotifications(token);
      } catch (e) {
        if (e?.status === 401) {
          clearAuthToken();
          resetNotifications();
          setIsAuthenticated(false);
          setCanUseDriverMode(false);
        }
      }
    })();
  }, []);
  const handleAuthSuccess = async () => {
    setIsAuthenticated(true);
    await refreshDriverStatus();
    startPolling();
    const token = getAuthToken();
    if (token) {
      startRealtimeNotifications(token);
    }
  };
  const handleLogout = () => {
    clearAuthToken();
    resetNotifications();
    setIsAuthenticated(false);
    navigate("home");
    setShowDriverSignup(false);
    setChatToasts([]);
    setChatRideId(null);
    setChatParticipantId(void 0);
  };
  const dismissToast = (toastId) => {
    setChatToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  };
  const openToast = (toast) => {
    dismissToast(toast.id);
    void markReadByLink(toast.link);
    navigateFromLink(toast.link);
  };
  const startDriverSignup = (destination = "home") => {
    setAfterDriverSignupTab(destination);
    setShowDriverSignup(true);
  };
  const goToDriverTab = async (destination) => {
    const ok = await refreshDriverStatus();
    if (!ok) return startDriverSignup(destination);
    navigate(destination);
  };
  const handleRideStarted = () => {
    setJourneyMode("driver");
    setActivityMode("Driver");
    window.history.pushState({}, "", "/journey?mode=driver");
    setActiveTab("journey");
  };
  const renderAuthedContent = () => {
    if (showDriverSignup) {
      return /* @__PURE__ */ jsxDEV(
        DriverSignupPage,
        {
          onBack: () => setShowDriverSignup(false),
          onComplete: async () => {
            setShowDriverSignup(false);
            await refreshDriverStatus();
            navigate(afterDriverSignupTab);
          }
        },
        void 0,
        false,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
          lineNumber: 435,
          columnNumber: 9
        },
        this
      );
    }
    switch (activeTab) {
      case "home":
        return /* @__PURE__ */ jsxDEV(
          HomePage,
          {
            onRequestRide: (prefill) => {
              setRequestRidePrefill(prefill);
              navigate("request");
            },
            onPostRide: (prefill) => {
              setPostRidePrefill(prefill);
              void goToDriverTab("post");
            },
            canUseDriverMode,
            onDriverSignup: () => startDriverSignup("post"),
            onOpenTimetable: () => navigate("timetable")
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
            lineNumber: 449,
            columnNumber: 11
          },
          this
        );
      case "request":
        return /* @__PURE__ */ jsxDEV(RequestRidePage, { prefill: requestRidePrefill }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
          lineNumber: 464,
          columnNumber: 16
        }, this);
      case "post":
        if (!canUseDriverMode) {
          return /* @__PURE__ */ jsxDEV("div", { style: { padding: 16 }, children: /* @__PURE__ */ jsxDEV("div", { className: "card", style: { padding: 16 }, children: [
            /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 700, marginBottom: 8 }, children: "Driver access required" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
              lineNumber: 471,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: { color: "rgba(255,255,255,0.7)", marginBottom: 12 }, children: "You need to register as a driver before you can post rides." }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
              lineNumber: 472,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("button", { className: "sheet-action-btn btn-accept", onClick: () => startDriverSignup("post"), children: [
              Icons.check,
              "Become a driver"
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
              lineNumber: 475,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
            lineNumber: 470,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
            lineNumber: 469,
            columnNumber: 13
          }, this);
        }
        return /* @__PURE__ */ jsxDEV(PostRidePage, { prefill: postRidePrefill }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
          lineNumber: 483,
          columnNumber: 16
        }, this);
      case "account":
        return /* @__PURE__ */ jsxDEV(
          AccountPage,
          {
            onLogout: handleLogout,
            onOpenSettings: () => navigate("settings"),
            onOpenTimetable: () => navigate("timetable"),
            onOpenSafetyCheckup: () => navigate("safety"),
            onOpenInbox: () => navigate("inbox"),
            unreadCount
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
            lineNumber: 486,
            columnNumber: 11
          },
          this
        );
      case "safety":
        return /* @__PURE__ */ jsxDEV(SafetyCheckupPage, { onBack: () => navigate("account") }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
          lineNumber: 496,
          columnNumber: 16
        }, this);
      case "settings":
        return /* @__PURE__ */ jsxDEV(SettingsPage, { onBack: () => navigate("account") }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
          lineNumber: 499,
          columnNumber: 16
        }, this);
      case "journey":
        return /* @__PURE__ */ jsxDEV(
          JourneyPage,
          {
            canUseDriverMode,
            onDriverSignup: () => startDriverSignup("journey"),
            onOpenChat: openChat,
            mode: journeyMode,
            onModeChange: setJourneyMode
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
            lineNumber: 502,
            columnNumber: 11
          },
          this
        );
      case "activity":
        return /* @__PURE__ */ jsxDEV(
          ActivityPage,
          {
            canUseDriverMode,
            onDriverSignup: () => startDriverSignup("activity"),
            onOpenChat: openChat,
            onRideStarted: handleRideStarted,
            mode: activityMode,
            onModeChange: setActivityMode
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
            lineNumber: 512,
            columnNumber: 11
          },
          this
        );
      case "timetable":
        return /* @__PURE__ */ jsxDEV(
          TimetablePage,
          {
            onBack: () => navigate("account"),
            onSelectEvent: (prefill) => {
              setRequestRidePrefill(prefill);
              navigate("request");
            }
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
            lineNumber: 523,
            columnNumber: 11
          },
          this
        );
      case "chat":
        return chatRideId ? /* @__PURE__ */ jsxDEV(ChatPage, { rideId: chatRideId, participantId: chatParticipantId, onBack: () => navigate(chatReturnTab) }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
          lineNumber: 533,
          columnNumber: 9
        }, this) : /* @__PURE__ */ jsxDEV(
          ActivityPage,
          {
            canUseDriverMode,
            onDriverSignup: () => startDriverSignup("activity"),
            onOpenChat: openChat,
            onRideStarted: handleRideStarted,
            mode: activityMode,
            onModeChange: setActivityMode
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
            lineNumber: 535,
            columnNumber: 9
          },
          this
        );
      case "inbox":
        return /* @__PURE__ */ jsxDEV(InboxPage, { onBack: () => navigate("account"), onNavigate: navigateFromLink }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
          lineNumber: 545,
          columnNumber: 16
        }, this);
      default:
        return /* @__PURE__ */ jsxDEV(
          HomePage,
          {
            onRequestRide: () => navigate("request"),
            onPostRide: (prefill) => {
              setPostRidePrefill(prefill);
              void goToDriverTab("post");
            },
            canUseDriverMode,
            onDriverSignup: () => startDriverSignup("post"),
            onOpenTimetable: () => navigate("timetable")
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
            lineNumber: 548,
            columnNumber: 11
          },
          this
        );
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "uber-page", children: [
    /* @__PURE__ */ jsxDEV("a", { className: "skip-link", href: "#main-content", children: "Skip to main content" }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 564,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("main", { id: "main-content", className: "uber-container", role: "main", tabIndex: -1, children: [
      /* @__PURE__ */ jsxDEV("h1", { className: "visually-hidden", children: "SamudhyanRides" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
        lineNumber: 567,
        columnNumber: 9
      }, this),
      isAuthenticated ? renderAuthedContent() : authScreen === "driverSignup" ? /* @__PURE__ */ jsxDEV(
        DriverSignupPage,
        {
          onBack: () => setAuthScreen("login"),
          onComplete: () => {
            setAuthScreen("login");
            handleAuthSuccess();
          }
        },
        void 0,
        false,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
          lineNumber: 571,
          columnNumber: 9
        },
        this
      ) : /* @__PURE__ */ jsxDEV(
        LoginPage,
        {
          onAuthSuccess: handleAuthSuccess,
          onStartDriverSignup: (draft) => {
            localStorage.setItem("driverSignupDraft", JSON.stringify(draft));
            setAuthScreen("driverSignup");
          }
        },
        void 0,
        false,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
          lineNumber: 579,
          columnNumber: 9
        },
        this
      )
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 566,
      columnNumber: 7
    }, this),
    isAuthenticated && /* @__PURE__ */ jsxDEV(ChatToastLayer, { toasts: chatToasts, onOpen: openToast, onDismiss: dismissToast }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 590,
      columnNumber: 7
    }, this),
    isAuthenticated && /* @__PURE__ */ jsxDEV("nav", { className: "bottom-nav", "aria-label": "Primary", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          "aria-current": activeTab === "home" ? "page" : void 0,
          className: `nav-item ${activeTab === "home" ? "nav-item-active" : ""}`,
          onClick: () => navigate("home"),
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "nav-icon", children: "🚗" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
              lineNumber: 601,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "nav-label", children: "Home" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
              lineNumber: 602,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
          lineNumber: 595,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          "aria-current": activeTab === "journey" ? "page" : void 0,
          className: `nav-item ${activeTab === "journey" ? "nav-item-active" : ""}`,
          onClick: () => navigate("journey"),
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "nav-icon", children: "🗺️" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
              lineNumber: 611,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "nav-label", children: "Journey" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
              lineNumber: 612,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
          lineNumber: 605,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          "aria-current": activeTab === "activity" ? "page" : void 0,
          className: `nav-item ${activeTab === "activity" ? "nav-item-active" : ""}`,
          onClick: () => navigate("activity"),
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "nav-icon", children: "🕒" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
              lineNumber: 621,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "nav-label", children: "Activity" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
              lineNumber: 622,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
          lineNumber: 615,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          "aria-current": activeTab === "account" ? "page" : void 0,
          className: `nav-item ${activeTab === "account" ? "nav-item-active" : ""}`,
          onClick: () => navigate("account"),
          children: [
            /* @__PURE__ */ jsxDEV("div", { className: "nav-icon", style: { position: "relative" }, children: [
              "👤",
              unreadCount > 0 && /* @__PURE__ */ jsxDEV("span", { style: {
                position: "absolute",
                top: -2,
                right: -6,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#3b82f6",
                border: "2px solid var(--color-bg, #181a20)"
              } }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
                lineNumber: 634,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
              lineNumber: 631,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "nav-label", children: "Account" }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
              lineNumber: 641,
              columnNumber: 13
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
          lineNumber: 625,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 594,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(SpeedInsights, {}, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
      lineNumber: 646,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx",
    lineNumber: 563,
    columnNumber: 5
  }, this);
};
_s(App, "WLim3o4kGWPpPTJ0p1pZyPPWMMw=");
_c4 = App;
export default App;
var _c, _c2, _c3, _c4;
$RefreshReg$(_c, "MapPlaceholder");
$RefreshReg$(_c2, "DetailRow");
$RefreshReg$(_c3, "Btn");
$RefreshReg$(_c4, "App");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/App.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBcUdNOztBQXJHTixPQUFPQSxTQUFTQyxXQUFXQyxnQkFBZ0I7QUFDM0MsT0FBTztBQUNQLE9BQU9DLGNBQWM7QUFDckIsT0FBT0MsaUJBQWlCO0FBQ3hCLE9BQU9DLGVBQWU7QUFDdEIsT0FBT0MsMEJBQWtEO0FBQ3pELE9BQU9DLGtCQUFrQjtBQUN6QixPQUFPQyxxQkFBcUI7QUFDNUIsT0FBT0Msa0JBQWtCO0FBQ3pCLE9BQU9DLGlCQUFpQjtBQUN4QixPQUFPQyxrQkFBa0I7QUFDekIsT0FBT0MsY0FBYztBQUNyQixPQUFPQyxlQUFlO0FBQ3RCLE9BQU9DLHdCQUF3QztBQUMvQyxTQUFTQyxnQkFBZ0I7QUFDekIsT0FBT0MsdUJBQXlDO0FBQ2hELE9BQU9DLHVCQUF1QjtBQUM5QixTQUFTQyxjQUFjQyxzQkFBc0I7QUFDN0M7QUFBQSxFQUNFQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBQztBQUFBQSxPQUNLO0FBQ1AsU0FBU0MsaUJBQWlCQyxlQUFlQyxxQkFBcUI7QUFDOUQsU0FBU0MscUJBQXFCO0FBRzlCLE1BQU1DLG9CQUFvQjtBQUUxQixNQUFNQyx5QkFBeUJBLENBQUNDLFVBQWtCO0FBQ2hELE1BQUlBLE1BQU1DLFdBQVdILGlCQUFpQixHQUFHO0FBQ3ZDLFdBQU9FLE1BQU1FLE1BQU1KLGtCQUFrQkssTUFBTSxFQUFFQyxLQUFLO0FBQUEsRUFDcEQ7QUFFQSxTQUFPSjtBQUNUO0FBRUEsTUFBTUssaUJBQWlCQSxDQUNyQkMsS0FDQUMsaUJBQ0FDLG1CQUNHO0FBQ0gsUUFBTUMsZ0JBQWdCSCxJQUFJSSxhQUFhQyxJQUFJLE1BQU07QUFFakQsTUFBSUwsSUFBSU0sU0FBU1gsV0FBVyxXQUFXLEdBQUc7QUFDeENNLG9CQUFnQkUsa0JBQWtCLFdBQVcsV0FBVyxNQUFNO0FBQUEsRUFDaEU7QUFFQSxNQUFJSCxJQUFJTSxTQUFTWCxXQUFXLFVBQVUsR0FBRztBQUN2Q08sbUJBQWVDLGtCQUFrQixXQUFXLFdBQVcsTUFBTTtBQUFBLEVBQy9EO0FBQ0Y7QUFFQSxNQUFNSSxZQUFZQSxDQUFDQyxTQUFzQjtBQUN2QyxNQUFJQSxLQUFLYixXQUFXLE9BQU8sRUFBRyxRQUFPO0FBQ3JDLE1BQUlhLEtBQUtiLFdBQVcsUUFBUSxFQUFHLFFBQU87QUFDdEMsTUFBSWEsS0FBS2IsV0FBVyxVQUFVLEVBQUcsUUFBTztBQUN4QyxNQUFJYSxLQUFLYixXQUFXLFdBQVcsRUFBRyxRQUFPO0FBQ3pDLE1BQUlhLEtBQUtiLFdBQVcsWUFBWSxFQUFHLFFBQU87QUFDMUMsTUFBSWEsS0FBS2IsV0FBVyxlQUFlLEVBQUcsUUFBTztBQUM3QyxNQUFJYSxLQUFLYixXQUFXLFlBQVksRUFBRyxRQUFPO0FBQzFDLE1BQUlhLEtBQUtiLFdBQVcsVUFBVSxFQUFHLFFBQU87QUFDeEMsTUFBSWEsS0FBS2IsV0FBVyxXQUFXLEVBQUcsUUFBTztBQUN6QyxNQUFJYSxLQUFLYixXQUFXLFNBQVMsRUFBRyxRQUFPO0FBQ3ZDLFNBQU87QUFDVDtBQUVBLE1BQU1jLFlBQVlBLENBQUNDLFFBQXFCO0FBQ3RDLFVBQVFBLEtBQUc7QUFBQSxJQUNULEtBQUs7QUFDSCxhQUFPO0FBQUEsSUFDVCxLQUFLO0FBQ0gsYUFBTztBQUFBLElBQ1QsS0FBSztBQUNILGFBQU87QUFBQSxJQUNULEtBQUs7QUFDSCxhQUFPO0FBQUEsSUFDVCxLQUFLO0FBQ0gsYUFBTztBQUFBLElBQ1QsS0FBSztBQUNILGFBQU87QUFBQSxJQUNULEtBQUs7QUFDSCxhQUFPO0FBQUEsSUFDVCxLQUFLO0FBQ0gsYUFBTztBQUFBLElBQ1QsS0FBSztBQUNILGFBQU87QUFBQSxJQUNULEtBQUs7QUFDSCxhQUFPO0FBQUEsSUFDVDtBQUNFLGFBQU87QUFBQSxFQUNYO0FBQ0Y7QUFFTyxhQUFNQyxpQkFBK0NBLENBQUMsRUFBRUMsUUFBUSxjQUFjLE1BQ25GLHVCQUFDLFNBQUksV0FBVSxtQkFDYjtBQUFBLHlCQUFDLFNBQUksU0FBUSxlQUFjLE9BQU0sOEJBQTZCLFdBQVUsV0FDdEU7QUFBQSwyQkFBQyxVQUFLLE9BQU0sT0FBTSxRQUFPLE9BQU0sTUFBSyxhQUFwQztBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQTZDO0FBQUEsSUFDN0MsdUJBQUMsVUFBSyxHQUFFLDJDQUEwQyxRQUFPLFFBQU8sYUFBWSxNQUFLLE1BQUssVUFBdEY7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUE0RjtBQUFBLElBQzVGO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFDQyxHQUFFO0FBQUEsUUFDRixRQUFPO0FBQUEsUUFDUCxhQUFZO0FBQUEsUUFDWixNQUFLO0FBQUEsUUFDTCxpQkFBZ0I7QUFBQTtBQUFBLE1BTGxCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUt3QjtBQUFBLElBRXhCLHVCQUFDLFVBQUssR0FBRSwyQ0FBMEMsUUFBTyxRQUFPLGFBQVksS0FBSSxNQUFLLFVBQXJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBMkY7QUFBQSxJQUMzRix1QkFBQyxVQUFLLEdBQUUsMkNBQTBDLFFBQU8sUUFBTyxhQUFZLEtBQUksTUFBSyxVQUFyRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQTJGO0FBQUEsSUFDM0Y7QUFBQSxNQUFDO0FBQUE7QUFBQSxRQUNDLEdBQUU7QUFBQSxRQUNGLFFBQU87QUFBQSxRQUNQLGFBQVk7QUFBQSxRQUNaLE1BQUs7QUFBQSxRQUNMLGVBQWM7QUFBQSxRQUNkLGlCQUFnQjtBQUFBO0FBQUEsTUFObEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTXdCO0FBQUEsSUFFeEIsdUJBQUMsWUFBTyxJQUFHLE1BQUssSUFBRyxPQUFNLEdBQUUsTUFBSyxNQUFLLGFBQXJDO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBOEM7QUFBQSxJQUM5Qyx1QkFBQyxZQUFPLElBQUcsTUFBSyxJQUFHLE9BQU0sR0FBRSxLQUFJLE1BQUssVUFBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUEwQztBQUFBLElBQzFDLHVCQUFDLFlBQU8sSUFBRyxNQUFLLElBQUcsT0FBTSxHQUFFLEtBQUksTUFBSyxhQUFwQztBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQTZDO0FBQUEsSUFDN0MsdUJBQUMsWUFBTyxJQUFHLE9BQU0sSUFBRyxNQUFLLEdBQUUsTUFBSyxNQUFLLGFBQXJDO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBOEM7QUFBQSxJQUM5Qyx1QkFBQyxZQUFPLElBQUcsT0FBTSxJQUFHLE1BQUssR0FBRSxLQUFJLE1BQUssVUFBcEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUEwQztBQUFBLElBQzFDLHVCQUFDLFVBQUssR0FBRSxtQkFBa0IsUUFBTyxXQUFVLGFBQVksS0FBSSxlQUFjLFdBQXpFO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBZ0Y7QUFBQSxJQUNoRix1QkFBQyxVQUFLLEdBQUUsTUFBSyxHQUFFLE9BQU0sVUFBUyxNQUFLLE1BQUssV0FBVSxZQUFXLFFBQU8sdUJBQXBFO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FFQTtBQUFBLElBQ0EsdUJBQUMsVUFBSyxHQUFFLE9BQU0sR0FBRSxNQUFLLFVBQVMsTUFBSyxNQUFLLFdBQVUsWUFBVyxRQUFPLHdCQUFwRTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBRUE7QUFBQSxPQS9CRjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBZ0NBO0FBQUEsRUFDQSx1QkFBQyxTQUFJLFdBQVUsYUFBYUEsbUJBQTVCO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FBa0M7QUFBQSxLQWxDcEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQW1DQTtBQUNBQyxLQXJDV0Y7QUF1Q04sYUFBTUcsUUFBUTtBQUFBLEVBQ25CQyxTQUNFLHVCQUFDLFNBQUksT0FBTSxNQUFLLFFBQU8sTUFBSyxTQUFRLGFBQVksTUFBSyxRQUFPLFFBQU8sZ0JBQWUsYUFBWSxLQUFJLGVBQWMsU0FBUSxnQkFBZSxTQUNySSxpQ0FBQyxVQUFLLEdBQUUsbUVBQVI7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUF1RSxLQUR6RTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBRUE7QUFBQSxFQUVGQyxRQUNFLHVCQUFDLFNBQUksT0FBTSxNQUFLLFFBQU8sTUFBSyxTQUFRLGFBQVksTUFBSyxRQUFPLFFBQU8sZ0JBQWUsYUFBWSxLQUFJLGVBQWMsU0FBUSxnQkFBZSxTQUNySTtBQUFBLDJCQUFDLFlBQU8sSUFBRyxNQUFLLElBQUcsTUFBSyxHQUFFLFFBQTFCO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBOEI7QUFBQSxJQUM5Qix1QkFBQyxVQUFLLElBQUcsTUFBSyxJQUFHLEtBQUksSUFBRyxLQUFJLElBQUcsUUFBL0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFtQztBQUFBLElBQ25DLHVCQUFDLFVBQUssSUFBRyxLQUFJLElBQUcsS0FBSSxJQUFHLE1BQUssSUFBRyxRQUEvQjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQW1DO0FBQUEsT0FIckM7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUlBO0FBQUEsRUFFRkMsTUFDRSx1QkFBQyxTQUFJLE9BQU0sTUFBSyxRQUFPLE1BQUssU0FBUSxhQUFZLE1BQUssUUFBTyxRQUFPLGdCQUFlLGFBQVksS0FBSSxlQUFjLFNBQVEsZ0JBQWUsU0FDckksaUNBQUMsYUFBUSxRQUFPLG9HQUFoQjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQWdILEtBRGxIO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FFQTtBQUFBLEVBRUZDLFFBQ0UsdUJBQUMsU0FBSSxPQUFNLE1BQUssUUFBTyxNQUFLLFNBQVEsYUFBWSxNQUFLLFFBQU8sUUFBTyxnQkFBZSxhQUFZLEtBQUksZUFBYyxTQUFRLGdCQUFlLFNBQ3JJO0FBQUEsMkJBQUMsVUFBSyxHQUFFLDhGQUFSO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBa0c7QUFBQSxJQUNsRyx1QkFBQyxVQUFLLElBQUcsTUFBSyxJQUFHLEtBQUksSUFBRyxNQUFLLElBQUcsUUFBaEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUFvQztBQUFBLElBQ3BDLHVCQUFDLFVBQUssSUFBRyxNQUFLLElBQUcsTUFBSyxJQUFHLFNBQVEsSUFBRyxRQUFwQztBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQXdDO0FBQUEsT0FIMUM7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUlBO0FBQUEsRUFFRkMsUUFDRSx1QkFBQyxTQUFJLE9BQU0sTUFBSyxRQUFPLE1BQUssU0FBUSxhQUFZLE1BQUssUUFBTyxRQUFPLGdCQUFlLGFBQVksS0FBSSxlQUFjLFNBQVEsZ0JBQWUsU0FDckksaUNBQUMsY0FBUyxRQUFPLG9CQUFqQjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQWlDLEtBRG5DO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FFQTtBQUFBLEVBRUZDLFFBQ0UsdUJBQUMsU0FBSSxPQUFNLE1BQUssUUFBTyxNQUFLLFNBQVEsYUFBWSxNQUFLLFFBQU8sUUFBTyxnQkFBZSxhQUFZLEtBQUksZUFBYyxTQUFRLGdCQUFlLFNBQ3JJO0FBQUEsMkJBQUMsY0FBUyxRQUFPLGtCQUFqQjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQStCO0FBQUEsSUFDL0IsdUJBQUMsVUFBSyxHQUFFLHVCQUFSO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBMkI7QUFBQSxJQUMzQix1QkFBQyxVQUFLLEdBQUUsc0JBQVI7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUEwQjtBQUFBLElBQzFCLHVCQUFDLFVBQUssR0FBRSxnQkFBUjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQW9CO0FBQUEsT0FKdEI7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUtBO0FBQUEsRUFFRkMsTUFDRSx1QkFBQyxTQUFJLE9BQU0sTUFBSyxRQUFPLE1BQUssU0FBUSxhQUFZLE1BQUssUUFBTyxRQUFPLGdCQUFlLGFBQVksT0FBTSxlQUFjLFNBQVEsZ0JBQWUsU0FDdkksaUNBQUMsVUFBSyxHQUFFLDRCQUFSO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FBZ0MsS0FEbEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUVBO0FBQUEsRUFFRkMsT0FDRSx1QkFBQyxTQUFJLE9BQU0sTUFBSyxRQUFPLE1BQUssU0FBUSxhQUFZLE1BQUssUUFBTyxRQUFPLGdCQUFlLGFBQVksS0FBSSxlQUFjLFNBQVEsZ0JBQWUsU0FDckk7QUFBQSwyQkFBQyxZQUFPLElBQUcsTUFBSyxJQUFHLE1BQUssR0FBRSxRQUExQjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQThCO0FBQUEsSUFDOUIsdUJBQUMsY0FBUyxRQUFPLHNCQUFqQjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQW1DO0FBQUEsT0FGckM7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUdBO0FBQUEsRUFFRkMsT0FDRSx1QkFBQyxTQUFJLE9BQU0sTUFBSyxRQUFPLE1BQUssU0FBUSxhQUFZLE1BQUssUUFBTyxRQUFPLGdCQUFlLGFBQVksT0FBTSxlQUFjLFNBQVEsZ0JBQWUsU0FDdkksaUNBQUMsY0FBUyxRQUFPLG9CQUFqQjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQWlDLEtBRG5DO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FFQTtBQUFBLEVBRUZDLEtBQ0UsdUJBQUMsU0FBSSxPQUFNLE1BQUssUUFBTyxNQUFLLFNBQVEsYUFBWSxNQUFLLFFBQU8sUUFBTyxnQkFBZSxhQUFZLEtBQUksZUFBYyxTQUFRLGdCQUFlLFNBQ3JJO0FBQUEsMkJBQUMsVUFBSyxHQUFFLG9EQUFSO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBd0Q7QUFBQSxJQUN4RCx1QkFBQyxZQUFPLElBQUcsTUFBSyxJQUFHLE1BQUssR0FBRSxPQUExQjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQTZCO0FBQUEsT0FGL0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUdBO0FBQUEsRUFFRkMsTUFDRSx1QkFBQyxTQUFJLE9BQU0sTUFBSyxRQUFPLE1BQUssU0FBUSxhQUFZLE1BQUssUUFBTyxRQUFPLGdCQUFlLGFBQVksT0FBTSxlQUFjLFNBQVEsZ0JBQWUsU0FDdkksaUNBQUMsVUFBSyxHQUFFLDJCQUFSO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FBK0IsS0FEakM7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUVBO0FBRUo7QUFFTyxhQUFNQyxZQUFzRkEsQ0FBQyxFQUFFZCxPQUFPZSxPQUFPQyxXQUFXLE1BQzdILHVCQUFDLFNBQUksV0FBVSxvQkFDYjtBQUFBLHlCQUFDLFVBQUssV0FBVSxnQkFBZ0JoQixtQkFBaEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUFzQztBQUFBLEVBQ3RDLHVCQUFDLFVBQUssV0FBVyxnQkFBZ0JnQixjQUFjLEVBQUUsSUFBS0QsbUJBQXREO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FBNEQ7QUFBQSxLQUY5RDtBQUFBO0FBQUE7QUFBQTtBQUFBLE9BR0E7QUFDQUUsTUFMV0g7QUFPTixhQUFNSSxNQUE4R0EsQ0FBQztBQUFBLEVBQzFIQztBQUFBQSxFQUNBQztBQUFBQSxFQUNBcEI7QUFBQUEsRUFDQXFCO0FBQUFBLEVBQ0FDO0FBQ0YsTUFDRTtBQUFBLEVBQUM7QUFBQTtBQUFBLElBQ0MsTUFBSztBQUFBLElBQ0wsV0FBVyxvQkFBb0JILEdBQUcsR0FBR0UsUUFBUSxlQUFlLEVBQUU7QUFBQSxJQUM5RDtBQUFBLElBQ0EsY0FBWXJCO0FBQUFBLElBRVhvQjtBQUFBQTtBQUFBQSxNQUNBcEI7QUFBQUE7QUFBQUE7QUFBQUEsRUFQSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUUE7QUFDQXVCLE1BaEJXTDtBQWtCYixNQUFNTSxNQUFnQkEsTUFBTTtBQUFBQyxLQUFBO0FBQzFCLFFBQU0sQ0FBQ0MsV0FBV0MsWUFBWSxJQUFJNUUsU0FBYyxNQUFNNEMsVUFBVWlDLE9BQU9DLFNBQVNuQyxRQUFRLENBQUM7QUFDekYsUUFBTSxDQUFDb0MsaUJBQWlCQyxrQkFBa0IsSUFBSWhGLFNBQWtCLE1BQU07QUFDcEUsV0FBT2lGLFFBQVFqRSxhQUFhLENBQUM7QUFBQSxFQUMvQixDQUFDO0FBQ0QsUUFBTSxDQUFDa0UsWUFBWUMsYUFBYSxJQUFJbkYsU0FBbUMsT0FBTztBQUM5RSxRQUFNLENBQUNvRixvQkFBb0JDLHFCQUFxQixJQUFJckYsU0FBa0NzRixNQUFTO0FBQy9GLFFBQU0sQ0FBQ0MsaUJBQWlCQyxrQkFBa0IsSUFBSXhGLFNBQWtDc0YsTUFBUztBQUN6RixRQUFNLENBQUNHLGFBQWFsRCxjQUFjLElBQUl2QyxTQUE0QixNQUFNO0FBQ3hFLFFBQU0sQ0FBQzBGLGNBQWNwRCxlQUFlLElBQUl0QyxTQUE0QixNQUFNO0FBQzFFLFFBQU0sQ0FBQzJGLFlBQVlDLGFBQWEsSUFBSTVGLFNBQXdCLElBQUk7QUFDaEUsUUFBTSxDQUFDNkYsbUJBQW1CQyxvQkFBb0IsSUFBSTlGLFNBQTZCc0YsTUFBUztBQUN4RixRQUFNLENBQUNTLGVBQWVDLGdCQUFnQixJQUFJaEcsU0FBYyxVQUFVO0FBQ2xFLFFBQU0sQ0FBQ2lHLGFBQWFDLGNBQWMsSUFBSWxHLFNBQVMsQ0FBQztBQUNoRCxRQUFNLENBQUNtRyxZQUFZQyxhQUFhLElBQUlwRyxTQUFzQixFQUFFO0FBQzVELFFBQU1xRyxpQkFBaUIxQixjQUFjLFVBQVVnQixhQUFhakUsY0FBY2lFLFlBQVlFLGlCQUFpQixJQUFJO0FBRzNHOUYsWUFBVSxNQUFNO0FBQ2QsVUFBTXVHLFFBQVEvRSxVQUFVLE1BQU0yRSxlQUFlaEYsZUFBZSxDQUFDLENBQUM7QUFDOUQsV0FBT29GO0FBQUFBLEVBQ1QsR0FBRyxFQUFFO0FBRUx2RyxZQUFVLE1BQU07QUFDZCxVQUFNd0csY0FBYy9FLGlDQUFpQyxDQUFDZ0YsaUJBQWlCO0FBQ3JFLFlBQU1DLG1CQUFtQkQsYUFBYUU7QUFDdEMsVUFBSUYsYUFBYUcsU0FBUyxVQUFVLENBQUNGLGtCQUFrQjtBQUNyRDtBQUFBLE1BQ0Y7QUFFQSxVQUFJSixrQkFBa0I1RSxnQkFBZ0JnRixrQkFBa0JKLGNBQWMsR0FBRztBQUN2RSxhQUFLbEYsZUFBZXNGLGdCQUFnQjtBQUNwQztBQUFBLE1BQ0Y7QUFFQUwsb0JBQWMsQ0FBQ1EsU0FBUztBQUN0QixZQUFJQSxLQUFLQyxLQUFLLENBQUNDLFVBQVVBLE1BQU1DLE9BQU9QLGFBQWFPLEVBQUUsR0FBRztBQUN0RCxpQkFBT0g7QUFBQUEsUUFDVDtBQUVBLGVBQU87QUFBQSxVQUNMO0FBQUEsWUFDRUcsSUFBSVAsYUFBYU87QUFBQUEsWUFDakJDLFlBQVlsRix1QkFBdUIwRSxhQUFhekUsS0FBSztBQUFBLFlBQ3JEa0YsU0FBU1QsYUFBYVU7QUFBQUEsWUFDdEJSLE1BQU1EO0FBQUFBLFVBQ1I7QUFBQSxVQUNBLEdBQUdHO0FBQUFBLFFBQUk7QUFBQSxNQUVYLENBQUM7QUFBQSxJQUNILENBQUM7QUFFRCxXQUFPTDtBQUFBQSxFQUNULEdBQUcsQ0FBQ0YsY0FBYyxDQUFDO0FBRW5CdEcsWUFBVSxNQUFNO0FBQ2QsUUFBSSxDQUFDc0csZUFBZ0I7QUFFckJELGtCQUFjLENBQUNRLFNBQVNBLEtBQUtPLE9BQU8sQ0FBQ0wsVUFBVSxDQUFDckYsZ0JBQWdCcUYsTUFBTUosTUFBTUwsY0FBYyxDQUFDLENBQUM7QUFBQSxFQUM5RixHQUFHLENBQUNBLGNBQWMsQ0FBQztBQUVuQixRQUFNZSxXQUFXQSxDQUFDckUsUUFBYTtBQUM3QixVQUFNc0UsV0FBV3ZFLFVBQVVDLEdBQUc7QUFDOUIsUUFBSThCLE9BQU9DLFNBQVNuQyxhQUFhMEUsVUFBVTtBQUN6Q3hDLGFBQU95QyxRQUFRQyxVQUFVLENBQUMsR0FBRyxJQUFJRixRQUFRO0FBQUEsSUFDM0M7QUFDQXpDLGlCQUFhN0IsR0FBRztBQUFBLEVBQ2xCO0FBRUEsUUFBTXlFLFdBQVdBLENBQ2ZDLFFBQ0FDLGVBQ0FDLFlBQWlCaEQsY0FBYyxTQUFTb0IsZ0JBQWdCcEIsY0FDckQ7QUFDSGlCLGtCQUFjNkIsTUFBTTtBQUNwQjNCLHlCQUFxQjRCLGFBQWE7QUFDbEMxQixxQkFBaUIyQixTQUFTO0FBQzFCOUMsV0FBT3lDLFFBQVFDLFVBQVUsQ0FBQyxHQUFHLElBQUk3RixjQUFjK0YsUUFBUUMsYUFBYSxDQUFDO0FBQ3JFOUMsaUJBQWEsTUFBTTtBQUFBLEVBQ3JCO0FBRUEsUUFBTWdELG1CQUFtQkEsQ0FBQ2xCLFNBQWlCO0FBQ3pDLFVBQU1tQixZQUFZbEcsY0FBYytFLElBQUk7QUFDcEMsUUFBSW1CLFdBQVc7QUFDYkwsZUFBU0ssVUFBVUosUUFBUUksVUFBVUgsYUFBYTtBQUFBLElBQ3BELE9BQU87QUFDTCxZQUFNckYsTUFBTSxJQUFJeUYsSUFBSXBCLE1BQU03QixPQUFPQyxTQUFTaUQsTUFBTTtBQUNoRDNGLHFCQUFlQyxLQUFLQyxpQkFBaUJDLGNBQWM7QUFDbkRzQyxhQUFPeUMsUUFBUUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxHQUFHbEYsSUFBSU0sUUFBUSxHQUFHTixJQUFJMkYsTUFBTSxFQUFFO0FBQy9EcEQsbUJBQWFoQyxVQUFVUCxJQUFJTSxRQUFRLENBQUM7QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFFQTVDLFlBQVUsTUFBTTtBQUNkLFVBQU1rSSxpQkFBaUJBLE1BQU07QUFDM0IsWUFBTUMsYUFBYSxJQUFJSixJQUFJakQsT0FBT0MsU0FBU3FELElBQUk7QUFDL0MsWUFBTU4sWUFBWWxHLGNBQWNrRCxPQUFPQyxTQUFTcUQsSUFBSTtBQUNwRCxVQUFJTixXQUFXO0FBQ2JqQyxzQkFBY2lDLFVBQVVKLE1BQU07QUFDOUIzQiw2QkFBcUIrQixVQUFVSCxhQUFhO0FBQUEsTUFDOUMsT0FBTztBQUNMOUIsc0JBQWMsSUFBSTtBQUNsQkUsNkJBQXFCUixNQUFTO0FBQUEsTUFDaEM7QUFDQWxELHFCQUFlOEYsWUFBWTVGLGlCQUFpQkMsY0FBYztBQUMxRHFDLG1CQUFhaEMsVUFBVWlDLE9BQU9DLFNBQVNuQyxRQUFRLENBQUM7QUFBQSxJQUNsRDtBQUVBc0YsbUJBQWU7QUFDZixVQUFNRyxhQUFhQSxNQUFNSCxlQUFlO0FBQ3hDcEQsV0FBT3dELGlCQUFpQixZQUFZRCxVQUFVO0FBQzlDLFdBQU8sTUFBTXZELE9BQU95RCxvQkFBb0IsWUFBWUYsVUFBVTtBQUFBLEVBQ2hFLEdBQUcsRUFBRTtBQUdMLFFBQU0sQ0FBQ0csa0JBQWtCQyxtQkFBbUIsSUFBSXhJLFNBQWtCLEtBQUs7QUFDdkUsUUFBTSxDQUFDeUksa0JBQWtCQyxtQkFBbUIsSUFBSTFJLFNBQWtCLEtBQUs7QUFDdkUsUUFBTSxDQUFDMkksc0JBQXNCQyx1QkFBdUIsSUFBSTVJLFNBQWMsTUFBTTtBQUU1RSxRQUFNNkksc0JBQXNCLFlBQThCO0FBQ3hELFFBQUk7QUFDRixZQUFNQyxNQUFNLE1BQU1qSSxTQUFpQyxxQkFBcUIsRUFBRWtJLFFBQVEsTUFBTSxDQUFDO0FBQ3pGLFlBQU1DLEtBQUsvRCxRQUFRNkQsS0FBS0csU0FBUztBQUNqQ1QsMEJBQW9CUSxFQUFFO0FBQ3RCLGFBQU9BO0FBQUFBLElBQ1QsU0FBU0UsR0FBRztBQUVWViwwQkFBb0IsS0FBSztBQUN6QixhQUFPO0FBQUEsSUFDVDtBQUFBLEVBQ0Y7QUFDQXpJLFlBQVUsTUFBTTtBQUNkLFVBQU1vSixRQUFRbkksYUFBYTtBQUMzQixRQUFJLENBQUNtSSxNQUFPO0FBQ1puRSx1QkFBbUIsSUFBSTtBQUV2QixLQUFDLFlBQVk7QUFDWCxVQUFJO0FBQ0YsY0FBTW5FLFNBQVMsWUFBWSxFQUFFa0ksUUFBUSxNQUFNLENBQUM7QUFDNUMsY0FBTUYsb0JBQW9CO0FBQzFCeEgscUJBQWE7QUFDYkMsbUNBQTJCNkgsS0FBSztBQUFBLE1BQ2xDLFNBQVNELEdBQVE7QUFDZixZQUFJQSxHQUFHRSxXQUFXLEtBQUs7QUFDckJuSSx5QkFBZTtBQUNmRyw2QkFBbUI7QUFDbkI0RCw2QkFBbUIsS0FBSztBQUN4QndELDhCQUFvQixLQUFLO0FBQUEsUUFDM0I7QUFBQSxNQUNGO0FBQUEsSUFDRixHQUFHO0FBQUEsRUFDTCxHQUFHLEVBQUU7QUFFTCxRQUFNYSxvQkFBb0IsWUFBWTtBQUNwQ3JFLHVCQUFtQixJQUFJO0FBQ3ZCLFVBQU02RCxvQkFBb0I7QUFDMUJ4SCxpQkFBYTtBQUNiLFVBQU04SCxRQUFRbkksYUFBYTtBQUMzQixRQUFJbUksT0FBTztBQUNUN0gsaUNBQTJCNkgsS0FBSztBQUFBLElBQ2xDO0FBQUEsRUFDRjtBQUVBLFFBQU1HLGVBQWVBLE1BQU07QUFDekJySSxtQkFBZTtBQUNmRyx1QkFBbUI7QUFDbkI0RCx1QkFBbUIsS0FBSztBQUN4Qm9DLGFBQVMsTUFBTTtBQUNmc0Isd0JBQW9CLEtBQUs7QUFDekJ0QyxrQkFBYyxFQUFFO0FBQ2hCUixrQkFBYyxJQUFJO0FBQ2xCRSx5QkFBcUJSLE1BQVM7QUFBQSxFQUNoQztBQUVBLFFBQU1pRSxlQUFlQSxDQUFDQyxZQUFvQjtBQUN4Q3BELGtCQUFjLENBQUNRLFNBQVNBLEtBQUtPLE9BQU8sQ0FBQ0wsVUFBVUEsTUFBTUMsT0FBT3lDLE9BQU8sQ0FBQztBQUFBLEVBQ3RFO0FBRUEsUUFBTUMsWUFBWUEsQ0FBQzNDLFVBQXFCO0FBQ3RDeUMsaUJBQWF6QyxNQUFNQyxFQUFFO0FBQ3JCLFNBQUs1RixlQUFlMkYsTUFBTUosSUFBSTtBQUM5QmtCLHFCQUFpQmQsTUFBTUosSUFBSTtBQUFBLEVBQzdCO0FBRUEsUUFBTWdELG9CQUFvQkEsQ0FBQ0MsY0FBbUIsV0FBVztBQUN2RGYsNEJBQXdCZSxXQUFXO0FBQ25DakIsd0JBQW9CLElBQUk7QUFBQSxFQUMxQjtBQUVBLFFBQU1rQixnQkFBZ0IsT0FBT0QsZ0JBQXFCO0FBQ2hELFVBQU1YLEtBQUssTUFBTUgsb0JBQW9CO0FBQ3JDLFFBQUksQ0FBQ0csR0FBSSxRQUFPVSxrQkFBa0JDLFdBQVc7QUFDN0N2QyxhQUFTdUMsV0FBVztBQUFBLEVBQ3RCO0FBRUEsUUFBTUUsb0JBQW9CQSxNQUFNO0FBQzlCdEgsbUJBQWUsUUFBUTtBQUN2QkQsb0JBQWdCLFFBQVE7QUFDeEJ1QyxXQUFPeUMsUUFBUUMsVUFBVSxDQUFDLEdBQUcsSUFBSSxzQkFBc0I7QUFDdkQzQyxpQkFBYSxTQUFTO0FBQUEsRUFDeEI7QUFFQSxRQUFNa0Ysc0JBQXNCQSxNQUFNO0FBQ2hDLFFBQUlyQixrQkFBa0I7QUFDcEIsYUFDRTtBQUFBLFFBQUM7QUFBQTtBQUFBLFVBQ0MsUUFBUSxNQUFNQyxvQkFBb0IsS0FBSztBQUFBLFVBQ3ZDLFlBQVksWUFBWTtBQUN0QkEsZ0NBQW9CLEtBQUs7QUFDekIsa0JBQU1HLG9CQUFvQjtBQUMxQnpCLHFCQUFTdUIsb0JBQW9CO0FBQUEsVUFDL0I7QUFBQTtBQUFBLFFBTkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BTUk7QUFBQSxJQUdSO0FBRUEsWUFBUWhFLFdBQVM7QUFBQSxNQUNmLEtBQUs7QUFDSCxlQUNFO0FBQUEsVUFBQztBQUFBO0FBQUEsWUFDQyxlQUFlLENBQUNvRixZQUFZO0FBQzFCMUUsb0NBQXNCMEUsT0FBTztBQUM3QjNDLHVCQUFTLFNBQVM7QUFBQSxZQUNwQjtBQUFBLFlBQ0EsWUFBWSxDQUFDMkMsWUFBWTtBQUN2QnZFLGlDQUFtQnVFLE9BQU87QUFDMUIsbUJBQUtILGNBQWMsTUFBTTtBQUFBLFlBQzNCO0FBQUEsWUFDQTtBQUFBLFlBQ0EsZ0JBQWdCLE1BQU1GLGtCQUFrQixNQUFNO0FBQUEsWUFDOUMsaUJBQWlCLE1BQU10QyxTQUFTLFdBQVc7QUFBQTtBQUFBLFVBWDdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQVcrQztBQUFBLE1BR25ELEtBQUs7QUFDSCxlQUFPLHVCQUFDLG1CQUFnQixTQUFTaEMsc0JBQTFCO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFBNkM7QUFBQSxNQUN0RCxLQUFLO0FBRUgsWUFBSSxDQUFDbUQsa0JBQWtCO0FBQ3JCLGlCQUNFLHVCQUFDLFNBQUksT0FBTyxFQUFFeUIsU0FBUyxHQUFHLEdBQ3hCLGlDQUFDLFNBQUksV0FBVSxRQUFPLE9BQU8sRUFBRUEsU0FBUyxHQUFHLEdBQ3pDO0FBQUEsbUNBQUMsU0FBSSxPQUFPLEVBQUVDLFlBQVksS0FBS0MsY0FBYyxFQUFFLEdBQUcsc0NBQWxEO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQXdFO0FBQUEsWUFDeEUsdUJBQUMsU0FBSSxPQUFPLEVBQUVDLE9BQU8seUJBQXlCRCxjQUFjLEdBQUcsR0FBRywyRUFBbEU7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFFQTtBQUFBLFlBQ0EsdUJBQUMsWUFBTyxXQUFVLCtCQUE4QixTQUFTLE1BQU1SLGtCQUFrQixNQUFNLEdBQ3BGdkc7QUFBQUEsb0JBQU1TO0FBQUFBLGNBQU07QUFBQSxpQkFEZjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUdBO0FBQUEsZUFSRjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQVNBLEtBVkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxpQkFXQTtBQUFBLFFBRUo7QUFDQSxlQUFPLHVCQUFDLGdCQUFhLFNBQVMyQixtQkFBdkI7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUF1QztBQUFBLE1BQ2hELEtBQUs7QUFDSyxlQUNOO0FBQUEsVUFBQztBQUFBO0FBQUEsWUFDQyxVQUFVK0Q7QUFBQUEsWUFDVixnQkFBZ0IsTUFBTWxDLFNBQVMsVUFBVTtBQUFBLFlBQ3pDLGlCQUFpQixNQUFNQSxTQUFTLFdBQVc7QUFBQSxZQUMzQyxxQkFBcUIsTUFBTUEsU0FBUyxRQUFRO0FBQUEsWUFDNUMsYUFBYSxNQUFNQSxTQUFTLE9BQU87QUFBQSxZQUNuQztBQUFBO0FBQUEsVUFORjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFNMkI7QUFBQSxNQUcvQixLQUFLO0FBQ0gsZUFBTyx1QkFBQyxxQkFBa0IsUUFBUSxNQUFNQSxTQUFTLFNBQVMsS0FBbkQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUFxRDtBQUFBLE1BRTlELEtBQUs7QUFDSCxlQUFPLHVCQUFDLGdCQUFhLFFBQVEsTUFBTUEsU0FBUyxTQUFTLEtBQTlDO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFBZ0Q7QUFBQSxNQUN6RCxLQUFLO0FBQ0gsZUFDRTtBQUFBLFVBQUM7QUFBQTtBQUFBLFlBQ0M7QUFBQSxZQUNBLGdCQUFnQixNQUFNc0Msa0JBQWtCLFNBQVM7QUFBQSxZQUNqRCxZQUFZbEM7QUFBQUEsWUFDWixNQUFNL0I7QUFBQUEsWUFDTixjQUFjbEQ7QUFBQUE7QUFBQUEsVUFMaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBSytCO0FBQUEsTUFHbkMsS0FBSztBQUNILGVBQ0U7QUFBQSxVQUFDO0FBQUE7QUFBQSxZQUNDO0FBQUEsWUFDQSxnQkFBZ0IsTUFBTW1ILGtCQUFrQixVQUFVO0FBQUEsWUFDbEQsWUFBWWxDO0FBQUFBLFlBQ1osZUFBZXFDO0FBQUFBLFlBQ2YsTUFBTW5FO0FBQUFBLFlBQ04sY0FBY3BEO0FBQUFBO0FBQUFBLFVBTmhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQU1nQztBQUFBLE1BR3BDLEtBQUs7QUFDSCxlQUNFO0FBQUEsVUFBQztBQUFBO0FBQUEsWUFDQyxRQUFRLE1BQU04RSxTQUFTLFNBQVM7QUFBQSxZQUNoQyxlQUFlLENBQUMyQyxZQUFZO0FBQzFCMUUsb0NBQXNCMEUsT0FBTztBQUM3QjNDLHVCQUFTLFNBQVM7QUFBQSxZQUNwQjtBQUFBO0FBQUEsVUFMRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFLSTtBQUFBLE1BR1IsS0FBSztBQUNILGVBQU96QixhQUNMLHVCQUFDLFlBQVMsUUFBUUEsWUFBWSxlQUFlRSxtQkFBbUIsUUFBUSxNQUFNdUIsU0FBU3JCLGFBQWEsS0FBcEc7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUFzRyxJQUV0RztBQUFBLFVBQUM7QUFBQTtBQUFBLFlBQ0M7QUFBQSxZQUNBLGdCQUFnQixNQUFNMkQsa0JBQWtCLFVBQVU7QUFBQSxZQUNsRCxZQUFZbEM7QUFBQUEsWUFDWixlQUFlcUM7QUFBQUEsWUFDZixNQUFNbkU7QUFBQUEsWUFDTixjQUFjcEQ7QUFBQUE7QUFBQUEsVUFOaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBTWdDO0FBQUEsTUFHcEMsS0FBSztBQUNILGVBQU8sdUJBQUMsYUFBVSxRQUFRLE1BQU04RSxTQUFTLFNBQVMsR0FBRyxZQUFZUSxvQkFBMUQ7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUEyRTtBQUFBLE1BQ3BGO0FBQ0UsZUFDRTtBQUFBLFVBQUM7QUFBQTtBQUFBLFlBQ0MsZUFBZSxNQUFNUixTQUFTLFNBQVM7QUFBQSxZQUN2QyxZQUFZLENBQUMyQyxZQUFZO0FBQ3ZCdkUsaUNBQW1CdUUsT0FBTztBQUMxQixtQkFBS0gsY0FBYyxNQUFNO0FBQUEsWUFDM0I7QUFBQSxZQUNBO0FBQUEsWUFDQSxnQkFBZ0IsTUFBTUYsa0JBQWtCLE1BQU07QUFBQSxZQUM5QyxpQkFBaUIsTUFBTXRDLFNBQVMsV0FBVztBQUFBO0FBQUEsVUFSN0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBUStDO0FBQUEsSUFHckQ7QUFBQSxFQUNGO0FBRUEsU0FDRSx1QkFBQyxTQUFJLFdBQVUsYUFDYjtBQUFBLDJCQUFDLE9BQUUsV0FBVSxhQUFZLE1BQUssaUJBQWdCLG9DQUE5QztBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQWtFO0FBQUEsSUFFbEUsdUJBQUMsVUFBSyxJQUFHLGdCQUFlLFdBQVUsa0JBQWlCLE1BQUssUUFBTyxVQUFVLElBQ3ZFO0FBQUEsNkJBQUMsUUFBRyxXQUFVLG1CQUFrQiw4QkFBaEM7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQUE4QztBQUFBLE1BQzdDckMsa0JBQ0MrRSxvQkFBb0IsSUFDbEI1RSxlQUFlLGlCQUNqQjtBQUFBLFFBQUM7QUFBQTtBQUFBLFVBQ0MsUUFBUSxNQUFNQyxjQUFjLE9BQU87QUFBQSxVQUNuQyxZQUFZLE1BQU07QUFDaEJBLDBCQUFjLE9BQU87QUFDckJrRSw4QkFBa0I7QUFBQSxVQUNwQjtBQUFBO0FBQUEsUUFMRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFLSSxJQUdKO0FBQUEsUUFBQztBQUFBO0FBQUEsVUFDQyxlQUFlQTtBQUFBQSxVQUNmLHFCQUFxQixDQUFDZSxVQUE2QjtBQUNqREMseUJBQWFDLFFBQVEscUJBQXFCQyxLQUFLQyxVQUFVSixLQUFLLENBQUM7QUFDL0RqRiwwQkFBYyxjQUFjO0FBQUEsVUFDOUI7QUFBQTtBQUFBLFFBTEY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BS0k7QUFBQSxTQWxCUjtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBcUJBO0FBQUEsSUFFQ0osbUJBQ0MsdUJBQUMsa0JBQWUsUUFBUW9CLFlBQVksUUFBUXNELFdBQVcsV0FBV0YsZ0JBQWxFO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBK0U7QUFBQSxJQUdoRnhFLG1CQUNDLHVCQUFDLFNBQUksV0FBVSxjQUFhLGNBQVcsV0FDckM7QUFBQTtBQUFBLFFBQUM7QUFBQTtBQUFBLFVBQ0MsTUFBSztBQUFBLFVBQ0wsZ0JBQWNKLGNBQWMsU0FBUyxTQUFTVztBQUFBQSxVQUM5QyxXQUFXLFlBQVlYLGNBQWMsU0FBUyxvQkFBb0IsRUFBRTtBQUFBLFVBQ3BFLFNBQVMsTUFBTXlDLFNBQVMsTUFBTTtBQUFBLFVBRTlCO0FBQUEsbUNBQUMsU0FBSSxXQUFVLFlBQVcsa0JBQTFCO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQTRCO0FBQUEsWUFDNUIsdUJBQUMsU0FBSSxXQUFVLGFBQVksb0JBQTNCO0FBQUE7QUFBQTtBQUFBO0FBQUEsbUJBQStCO0FBQUE7QUFBQTtBQUFBLFFBUGpDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQVFBO0FBQUEsTUFFQTtBQUFBLFFBQUM7QUFBQTtBQUFBLFVBQ0MsTUFBSztBQUFBLFVBQ0wsZ0JBQWN6QyxjQUFjLFlBQVksU0FBU1c7QUFBQUEsVUFDakQsV0FBVyxZQUFZWCxjQUFjLFlBQVksb0JBQW9CLEVBQUU7QUFBQSxVQUN2RSxTQUFTLE1BQU15QyxTQUFTLFNBQVM7QUFBQSxVQUVqQztBQUFBLG1DQUFDLFNBQUksV0FBVSxZQUFXLG1CQUExQjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUE2QjtBQUFBLFlBQzdCLHVCQUFDLFNBQUksV0FBVSxhQUFZLHVCQUEzQjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUFrQztBQUFBO0FBQUE7QUFBQSxRQVBwQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFRQTtBQUFBLE1BRUE7QUFBQSxRQUFDO0FBQUE7QUFBQSxVQUNDLE1BQUs7QUFBQSxVQUNMLGdCQUFjekMsY0FBYyxhQUFhLFNBQVNXO0FBQUFBLFVBQ2xELFdBQVcsWUFBWVgsY0FBYyxhQUFhLG9CQUFvQixFQUFFO0FBQUEsVUFDeEUsU0FBUyxNQUFNeUMsU0FBUyxVQUFVO0FBQUEsVUFFbEM7QUFBQSxtQ0FBQyxTQUFJLFdBQVUsWUFBVyxrQkFBMUI7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFBNEI7QUFBQSxZQUM1Qix1QkFBQyxTQUFJLFdBQVUsYUFBWSx3QkFBM0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFBbUM7QUFBQTtBQUFBO0FBQUEsUUFQckM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1BUUE7QUFBQSxNQUVBO0FBQUEsUUFBQztBQUFBO0FBQUEsVUFDQyxNQUFLO0FBQUEsVUFDTCxnQkFBY3pDLGNBQWMsWUFBWSxTQUFTVztBQUFBQSxVQUNqRCxXQUFXLFlBQVlYLGNBQWMsWUFBWSxvQkFBb0IsRUFBRTtBQUFBLFVBQ3ZFLFNBQVMsTUFBTXlDLFNBQVMsU0FBUztBQUFBLFVBRWpDO0FBQUEsbUNBQUMsU0FBSSxXQUFVLFlBQVcsT0FBTyxFQUFFcUQsVUFBVSxXQUFXLEdBQUc7QUFBQTtBQUFBLGNBRXhEeEUsY0FBYyxLQUNiLHVCQUFDLFVBQUssT0FBTztBQUFBLGdCQUNYd0UsVUFBVTtBQUFBLGdCQUFZQyxLQUFLO0FBQUEsZ0JBQUlDLE9BQU87QUFBQSxnQkFDdENDLE9BQU87QUFBQSxnQkFBR0MsUUFBUTtBQUFBLGdCQUFHQyxjQUFjO0FBQUEsZ0JBQ25DQyxZQUFZO0FBQUEsZ0JBQVdDLFFBQVE7QUFBQSxjQUNqQyxLQUpBO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBSUU7QUFBQSxpQkFQTjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQVNBO0FBQUEsWUFDQSx1QkFBQyxTQUFJLFdBQVUsYUFBWSx1QkFBM0I7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQkFBa0M7QUFBQTtBQUFBO0FBQUEsUUFoQnBDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQWlCQTtBQUFBLFNBaERGO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FpREE7QUFBQSxJQUdGLHVCQUFDLG1CQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FBYztBQUFBLE9BbkZoQjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBb0ZBO0FBRUo7QUFBRXRHLEdBbmFJRCxLQUFhO0FBQUF3RyxNQUFieEc7QUFxYU4sZUFBZUE7QUFBSSxJQUFBdkIsSUFBQWdCLEtBQUFNLEtBQUF5RztBQUFBQyxhQUFBaEksSUFBQTtBQUFBZ0ksYUFBQWhILEtBQUE7QUFBQWdILGFBQUExRyxLQUFBO0FBQUEwRyxhQUFBRCxLQUFBIiwibmFtZXMiOlsiUmVhY3QiLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIkhvbWVQYWdlIiwiQWNjb3VudFBhZ2UiLCJMb2dpblBhZ2UiLCJEcml2ZXJTaWdudXBQYWdlIiwiQWN0aXZpdHlQYWdlIiwiUmVxdWVzdFJpZGVQYWdlIiwiUG9zdFJpZGVQYWdlIiwiSm91cm5leVBhZ2UiLCJTZXR0aW5nc1BhZ2UiLCJDaGF0UGFnZSIsIkluYm94UGFnZSIsIkNoYXRUb2FzdExheWVyIiwiYXBpRmV0Y2giLCJUaW1ldGFibGVQYWdlIiwiU2FmZXR5Q2hlY2t1cFBhZ2UiLCJnZXRBdXRoVG9rZW4iLCJjbGVhckF1dGhUb2tlbiIsImdldFVucmVhZENvdW50IiwibWFya1JlYWRCeUxpbmsiLCJyZXNldE5vdGlmaWNhdGlvbnMiLCJzdGFydFBvbGxpbmciLCJzdGFydFJlYWx0aW1lTm90aWZpY2F0aW9ucyIsInN1YnNjcmliZSIsInN1YnNjcmliZVRvSW5jb21pbmdOb3RpZmljYXRpb25zIiwiYXJlU2FtZUNoYXRMaW5rIiwiYnVpbGRDaGF0UGF0aCIsInBhcnNlQ2hhdExpbmsiLCJTcGVlZEluc2lnaHRzIiwiQ0hBVF9USVRMRV9QUkVGSVgiLCJnZXRDaGF0VG9hc3RTZW5kZXJOYW1lIiwidGl0bGUiLCJzdGFydHNXaXRoIiwic2xpY2UiLCJsZW5ndGgiLCJ0cmltIiwiYXBwbHlSb3V0ZU1vZGUiLCJ1cmwiLCJzZXRBY3Rpdml0eU1vZGUiLCJzZXRKb3VybmV5TW9kZSIsInJlcXVlc3RlZE1vZGUiLCJzZWFyY2hQYXJhbXMiLCJnZXQiLCJwYXRobmFtZSIsInBhdGhUb1RhYiIsInBhdGgiLCJ0YWJUb1BhdGgiLCJ0YWIiLCJNYXBQbGFjZWhvbGRlciIsImxhYmVsIiwiX2MiLCJJY29ucyIsIm1lc3NhZ2UiLCJjYW5jZWwiLCJzdGFyIiwicmVwb3J0IiwiYWNjZXB0IiwicmVtb3ZlIiwiYmFjayIsImNsb2NrIiwiY2hlY2siLCJwaW4iLCJuZXh0IiwiRGV0YWlsUm93IiwidmFsdWUiLCJ2YWx1ZUNsYXNzIiwiX2MyIiwiQnRuIiwiY2xzIiwiaWNvbiIsInNtYWxsIiwib25DbGljayIsIl9jMyIsIkFwcCIsIl9zIiwiYWN0aXZlVGFiIiwic2V0QWN0aXZlVGFiIiwid2luZG93IiwibG9jYXRpb24iLCJpc0F1dGhlbnRpY2F0ZWQiLCJzZXRJc0F1dGhlbnRpY2F0ZWQiLCJCb29sZWFuIiwiYXV0aFNjcmVlbiIsInNldEF1dGhTY3JlZW4iLCJyZXF1ZXN0UmlkZVByZWZpbGwiLCJzZXRSZXF1ZXN0UmlkZVByZWZpbGwiLCJ1bmRlZmluZWQiLCJwb3N0UmlkZVByZWZpbGwiLCJzZXRQb3N0UmlkZVByZWZpbGwiLCJqb3VybmV5TW9kZSIsImFjdGl2aXR5TW9kZSIsImNoYXRSaWRlSWQiLCJzZXRDaGF0UmlkZUlkIiwiY2hhdFBhcnRpY2lwYW50SWQiLCJzZXRDaGF0UGFydGljaXBhbnRJZCIsImNoYXRSZXR1cm5UYWIiLCJzZXRDaGF0UmV0dXJuVGFiIiwidW5yZWFkQ291bnQiLCJzZXRVbnJlYWRDb3VudCIsImNoYXRUb2FzdHMiLCJzZXRDaGF0VG9hc3RzIiwiYWN0aXZlQ2hhdExpbmsiLCJ1bnN1YiIsInVuc3Vic2NyaWJlIiwibm90aWZpY2F0aW9uIiwibm90aWZpY2F0aW9uTGluayIsImxpbmsiLCJ0eXBlIiwicHJldiIsInNvbWUiLCJ0b2FzdCIsImlkIiwic2VuZGVyTmFtZSIsInByZXZpZXciLCJib2R5IiwiZmlsdGVyIiwibmF2aWdhdGUiLCJuZXh0UGF0aCIsImhpc3RvcnkiLCJwdXNoU3RhdGUiLCJvcGVuQ2hhdCIsInJpZGVJZCIsInBhcnRpY2lwYW50SWQiLCJzb3VyY2VUYWIiLCJuYXZpZ2F0ZUZyb21MaW5rIiwiY2hhdFJvdXRlIiwiVVJMIiwib3JpZ2luIiwic2VhcmNoIiwic3luY1JvdXRlU3RhdGUiLCJjdXJyZW50VXJsIiwiaHJlZiIsIm9uUG9wU3RhdGUiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNhblVzZURyaXZlck1vZGUiLCJzZXRDYW5Vc2VEcml2ZXJNb2RlIiwic2hvd0RyaXZlclNpZ251cCIsInNldFNob3dEcml2ZXJTaWdudXAiLCJhZnRlckRyaXZlclNpZ251cFRhYiIsInNldEFmdGVyRHJpdmVyU2lnbnVwVGFiIiwicmVmcmVzaERyaXZlclN0YXR1cyIsInJlcyIsIm1ldGhvZCIsIm9rIiwiaXNfZHJpdmVyIiwiZSIsInRva2VuIiwic3RhdHVzIiwiaGFuZGxlQXV0aFN1Y2Nlc3MiLCJoYW5kbGVMb2dvdXQiLCJkaXNtaXNzVG9hc3QiLCJ0b2FzdElkIiwib3BlblRvYXN0Iiwic3RhcnREcml2ZXJTaWdudXAiLCJkZXN0aW5hdGlvbiIsImdvVG9Ecml2ZXJUYWIiLCJoYW5kbGVSaWRlU3RhcnRlZCIsInJlbmRlckF1dGhlZENvbnRlbnQiLCJwcmVmaWxsIiwicGFkZGluZyIsImZvbnRXZWlnaHQiLCJtYXJnaW5Cb3R0b20iLCJjb2xvciIsImRyYWZ0IiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIkpTT04iLCJzdHJpbmdpZnkiLCJwb3NpdGlvbiIsInRvcCIsInJpZ2h0Iiwid2lkdGgiLCJoZWlnaHQiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kIiwiYm9yZGVyIiwiX2M0IiwiJFJlZnJlc2hSZWckIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIkFwcC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCAnLi9BcHAuY3NzJztcclxuaW1wb3J0IEhvbWVQYWdlIGZyb20gJy4vSG9tZVBhZ2UnO1xyXG5pbXBvcnQgQWNjb3VudFBhZ2UgZnJvbSAnLi9BY2NvdW50UGFnZSc7XHJcbmltcG9ydCBMb2dpblBhZ2UgZnJvbSAnLi9Mb2dpblBhZ2UnO1xyXG5pbXBvcnQgRHJpdmVyU2lnbnVwUGFnZSwgeyB0eXBlIERyaXZlclNpZ251cERyYWZ0IH0gZnJvbSAnLi9Ecml2ZXJTaWdudXBQYWdlJztcclxuaW1wb3J0IEFjdGl2aXR5UGFnZSBmcm9tICcuL0FjdGl2aXR5UGFnZSc7XHJcbmltcG9ydCBSZXF1ZXN0UmlkZVBhZ2UgZnJvbSAnLi9SZXF1ZXN0UmlkZVBhZ2UnO1xyXG5pbXBvcnQgUG9zdFJpZGVQYWdlIGZyb20gJy4vUG9zdFJpZGVQYWdlJztcclxuaW1wb3J0IEpvdXJuZXlQYWdlIGZyb20gJy4vSm91cm5leVBhZ2UnO1xyXG5pbXBvcnQgU2V0dGluZ3NQYWdlIGZyb20gJy4vU2V0dGluZ3NQYWdlJztcclxuaW1wb3J0IENoYXRQYWdlIGZyb20gJy4vQ2hhdFBhZ2UnO1xyXG5pbXBvcnQgSW5ib3hQYWdlIGZyb20gJy4vSW5ib3hQYWdlJztcclxuaW1wb3J0IENoYXRUb2FzdExheWVyLCB7IHR5cGUgQ2hhdFRvYXN0IH0gZnJvbSAnLi9DaGF0VG9hc3RMYXllcic7XHJcbmltcG9ydCB7IGFwaUZldGNoIH0gZnJvbSAnLi9saWIvYXBpJztcclxuaW1wb3J0IFRpbWV0YWJsZVBhZ2UsIHsgdHlwZSBSaWRlUHJlZmlsbCB9IGZyb20gJy4vVGltZXRhYmxlUGFnZSc7XHJcbmltcG9ydCBTYWZldHlDaGVja3VwUGFnZSBmcm9tICcuL1NhZmV0eUNoZWNrdXBQYWdlLnRzeCc7XHJcbmltcG9ydCB7IGdldEF1dGhUb2tlbiwgY2xlYXJBdXRoVG9rZW4gfSBmcm9tICcuL2xpYi9hdXRoVG9rZW4nO1xyXG5pbXBvcnQge1xyXG4gIGdldFVucmVhZENvdW50LFxyXG4gIG1hcmtSZWFkQnlMaW5rLFxyXG4gIHJlc2V0Tm90aWZpY2F0aW9ucyxcclxuICBzdGFydFBvbGxpbmcsXHJcbiAgc3RhcnRSZWFsdGltZU5vdGlmaWNhdGlvbnMsXHJcbiAgc3Vic2NyaWJlLFxyXG4gIHN1YnNjcmliZVRvSW5jb21pbmdOb3RpZmljYXRpb25zLFxyXG59IGZyb20gJy4vbGliL25vdGlmaWNhdGlvbnMnO1xyXG5pbXBvcnQgeyBhcmVTYW1lQ2hhdExpbmssIGJ1aWxkQ2hhdFBhdGgsIHBhcnNlQ2hhdExpbmsgfSBmcm9tICcuL2xpYi9jaGF0Um91dGVzJztcclxuaW1wb3J0IHsgU3BlZWRJbnNpZ2h0cyB9IGZyb20gJ0B2ZXJjZWwvc3BlZWQtaW5zaWdodHMvcmVhY3QnO1xyXG5cclxudHlwZSBUYWIgPSAnaG9tZScgfCAnam91cm5leScgfCAnYWN0aXZpdHknIHwgJ2FjY291bnQnIHwgJ3NldHRpbmdzJyB8ICdyZXF1ZXN0JyB8ICdwb3N0JyB8ICd0aW1ldGFibGUnIHwgJ3NhZmV0eScgfCAnY2hhdCcgfCAnaW5ib3gnO1xyXG5jb25zdCBDSEFUX1RJVExFX1BSRUZJWCA9ICdOZXcgbWVzc2FnZSBmcm9tICc7XHJcblxyXG5jb25zdCBnZXRDaGF0VG9hc3RTZW5kZXJOYW1lID0gKHRpdGxlOiBzdHJpbmcpID0+IHtcclxuICBpZiAodGl0bGUuc3RhcnRzV2l0aChDSEFUX1RJVExFX1BSRUZJWCkpIHtcclxuICAgIHJldHVybiB0aXRsZS5zbGljZShDSEFUX1RJVExFX1BSRUZJWC5sZW5ndGgpLnRyaW0oKTtcclxuICB9XHJcblxyXG4gIHJldHVybiB0aXRsZTtcclxufTtcclxuXHJcbmNvbnN0IGFwcGx5Um91dGVNb2RlID0gKFxyXG4gIHVybDogVVJMLFxyXG4gIHNldEFjdGl2aXR5TW9kZTogUmVhY3QuRGlzcGF0Y2g8UmVhY3QuU2V0U3RhdGVBY3Rpb248J3VzZXInIHwgJ0RyaXZlcic+PixcclxuICBzZXRKb3VybmV5TW9kZTogUmVhY3QuRGlzcGF0Y2g8UmVhY3QuU2V0U3RhdGVBY3Rpb248J3VzZXInIHwgJ2RyaXZlcic+PixcclxuKSA9PiB7XHJcbiAgY29uc3QgcmVxdWVzdGVkTW9kZSA9IHVybC5zZWFyY2hQYXJhbXMuZ2V0KCdtb2RlJyk7XHJcblxyXG4gIGlmICh1cmwucGF0aG5hbWUuc3RhcnRzV2l0aCgnL2FjdGl2aXR5JykpIHtcclxuICAgIHNldEFjdGl2aXR5TW9kZShyZXF1ZXN0ZWRNb2RlID09PSAnZHJpdmVyJyA/ICdEcml2ZXInIDogJ3VzZXInKTtcclxuICB9XHJcblxyXG4gIGlmICh1cmwucGF0aG5hbWUuc3RhcnRzV2l0aCgnL2pvdXJuZXknKSkge1xyXG4gICAgc2V0Sm91cm5leU1vZGUocmVxdWVzdGVkTW9kZSA9PT0gJ2RyaXZlcicgPyAnZHJpdmVyJyA6ICd1c2VyJyk7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3QgcGF0aFRvVGFiID0gKHBhdGg6IHN0cmluZyk6IFRhYiA9PiB7XHJcbiAgaWYgKHBhdGguc3RhcnRzV2l0aCgnL2NoYXQnKSkgcmV0dXJuICdjaGF0JztcclxuICBpZiAocGF0aC5zdGFydHNXaXRoKCcvaW5ib3gnKSkgcmV0dXJuICdpbmJveCc7XHJcbiAgaWYgKHBhdGguc3RhcnRzV2l0aCgnL2FjY291bnQnKSkgcmV0dXJuICdhY2NvdW50JztcclxuICBpZiAocGF0aC5zdGFydHNXaXRoKCcvYWN0aXZpdHknKSkgcmV0dXJuICdhY3Rpdml0eSc7XHJcbiAgaWYgKHBhdGguc3RhcnRzV2l0aCgnL3Bvc3QtcmlkZScpKSByZXR1cm4gJ3Bvc3QnO1xyXG4gIGlmIChwYXRoLnN0YXJ0c1dpdGgoJy9yZXF1ZXN0LXJpZGUnKSkgcmV0dXJuICdyZXF1ZXN0JztcclxuICBpZiAocGF0aC5zdGFydHNXaXRoKCcvdGltZXRhYmxlJykpIHJldHVybiAndGltZXRhYmxlJztcclxuICBpZiAocGF0aC5zdGFydHNXaXRoKCcvam91cm5leScpKSByZXR1cm4gJ2pvdXJuZXknO1xyXG4gIGlmIChwYXRoLnN0YXJ0c1dpdGgoJy9zZXR0aW5ncycpKSByZXR1cm4gJ3NldHRpbmdzJztcclxuICBpZiAocGF0aC5zdGFydHNXaXRoKCcvc2FmZXR5JykpIHJldHVybiAnc2FmZXR5JztcclxuICByZXR1cm4gJ2hvbWUnO1xyXG59O1xyXG5cclxuY29uc3QgdGFiVG9QYXRoID0gKHRhYjogVGFiKTogc3RyaW5nID0+IHtcclxuICBzd2l0Y2ggKHRhYikge1xyXG4gICAgY2FzZSAnYWNjb3VudCc6XHJcbiAgICAgIHJldHVybiAnL2FjY291bnQnO1xyXG4gICAgY2FzZSAnYWN0aXZpdHknOlxyXG4gICAgICByZXR1cm4gJy9hY3Rpdml0eSc7XHJcbiAgICBjYXNlICdwb3N0JzpcclxuICAgICAgcmV0dXJuICcvcG9zdC1yaWRlJztcclxuICAgIGNhc2UgJ3JlcXVlc3QnOlxyXG4gICAgICByZXR1cm4gJy9yZXF1ZXN0LXJpZGUnO1xyXG4gICAgY2FzZSAndGltZXRhYmxlJzpcclxuICAgICAgcmV0dXJuICcvdGltZXRhYmxlJztcclxuICAgIGNhc2UgJ2pvdXJuZXknOlxyXG4gICAgICByZXR1cm4gJy9qb3VybmV5JztcclxuICAgIGNhc2UgJ3NldHRpbmdzJzpcclxuICAgICAgcmV0dXJuICcvc2V0dGluZ3MnO1xyXG4gICAgY2FzZSAnc2FmZXR5JzpcclxuICAgICAgcmV0dXJuICcvc2FmZXR5JztcclxuICAgIGNhc2UgJ2NoYXQnOlxyXG4gICAgICByZXR1cm4gJy9jaGF0JztcclxuICAgIGNhc2UgJ2luYm94JzpcclxuICAgICAgcmV0dXJuICcvaW5ib3gnO1xyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuICcvJztcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgTWFwUGxhY2Vob2xkZXI6IFJlYWN0LkZDPHsgbGFiZWw/OiBzdHJpbmcgfT4gPSAoeyBsYWJlbCA9ICdNYXAgUHJldmlldycgfSkgPT4gKFxyXG4gIDxkaXYgY2xhc3NOYW1lPVwibWFwLXBsYWNlaG9sZGVyXCI+XHJcbiAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgNDAwIDIyMFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBjbGFzc05hbWU9XCJtYXAtc3ZnXCI+XHJcbiAgICAgIDxyZWN0IHdpZHRoPVwiNDAwXCIgaGVpZ2h0PVwiMjIwXCIgZmlsbD1cIiNlOGVhZDZcIiAvPlxyXG4gICAgICA8cGF0aCBkPVwiTTAsMTEwIFExMDAsOTAgMjAwLDExMCBRMzAwLDEzMCA0MDAsMTEwXCIgc3Ryb2tlPVwiI2ZmZlwiIHN0cm9rZVdpZHRoPVwiMTBcIiBmaWxsPVwibm9uZVwiIC8+XHJcbiAgICAgIDxwYXRoXHJcbiAgICAgICAgZD1cIk0wLDExMCBRMTAwLDkwIDIwMCwxMTAgUTMwMCwxMzAgNDAwLDExMFwiXHJcbiAgICAgICAgc3Ryb2tlPVwiI2Q0Yzg5YVwiXHJcbiAgICAgICAgc3Ryb2tlV2lkdGg9XCI4XCJcclxuICAgICAgICBmaWxsPVwibm9uZVwiXHJcbiAgICAgICAgc3Ryb2tlRGFzaGFycmF5PVwiMjAsOFwiXHJcbiAgICAgIC8+XHJcbiAgICAgIDxwYXRoIGQ9XCJNMTUwLDAgUTE2MCw4MCAxNzAsMTEwIFExODAsMTUwIDE3NSwyMjBcIiBzdHJva2U9XCIjZmZmXCIgc3Ryb2tlV2lkdGg9XCI4XCIgZmlsbD1cIm5vbmVcIiAvPlxyXG4gICAgICA8cGF0aCBkPVwiTTI1MCwwIFEyNDUsNzAgMjQwLDExMCBRMjM1LDE1NSAyMzAsMjIwXCIgc3Ryb2tlPVwiI2ZmZlwiIHN0cm9rZVdpZHRoPVwiNlwiIGZpbGw9XCJub25lXCIgLz5cclxuICAgICAgPHBhdGhcclxuICAgICAgICBkPVwiTTgwLDE3MCBRMTMwLDE0MCAxODAsMTEwIFEyMzAsODAgMzEwLDU1XCJcclxuICAgICAgICBzdHJva2U9XCIjM2I4MmY2XCJcclxuICAgICAgICBzdHJva2VXaWR0aD1cIjRcIlxyXG4gICAgICAgIGZpbGw9XCJub25lXCJcclxuICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxyXG4gICAgICAgIHN0cm9rZURhc2hhcnJheT1cIjEwLDRcIlxyXG4gICAgICAvPlxyXG4gICAgICA8Y2lyY2xlIGN4PVwiODBcIiBjeT1cIjE3MFwiIHI9XCIxMFwiIGZpbGw9XCIjMjJjNTVlXCIgLz5cclxuICAgICAgPGNpcmNsZSBjeD1cIjgwXCIgY3k9XCIxNzBcIiByPVwiNlwiIGZpbGw9XCIjZmZmXCIgLz5cclxuICAgICAgPGNpcmNsZSBjeD1cIjgwXCIgY3k9XCIxNzBcIiByPVwiM1wiIGZpbGw9XCIjMjJjNTVlXCIgLz5cclxuICAgICAgPGNpcmNsZSBjeD1cIjMxMFwiIGN5PVwiNTVcIiByPVwiMTJcIiBmaWxsPVwiI2VmNDQ0NFwiIC8+XHJcbiAgICAgIDxjaXJjbGUgY3g9XCIzMTBcIiBjeT1cIjU1XCIgcj1cIjZcIiBmaWxsPVwiI2ZmZlwiIC8+XHJcbiAgICAgIDxwYXRoIGQ9XCJNMzEwLDY3IEwzMTAsODBcIiBzdHJva2U9XCIjZWY0NDQ0XCIgc3Ryb2tlV2lkdGg9XCIzXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgLz5cclxuICAgICAgPHRleHQgeD1cIjYwXCIgeT1cIjE5NVwiIGZvbnRTaXplPVwiMTBcIiBmaWxsPVwiIzE2NjUzNFwiIGZvbnRXZWlnaHQ9XCJib2xkXCI+XHJcbiAgICAgICAgUGljayBVcFxyXG4gICAgICA8L3RleHQ+XHJcbiAgICAgIDx0ZXh0IHg9XCIyOTBcIiB5PVwiNDhcIiBmb250U2l6ZT1cIjEwXCIgZmlsbD1cIiM5OTFiMWJcIiBmb250V2VpZ2h0PVwiYm9sZFwiPlxyXG4gICAgICAgIERyb3AgT2ZmXHJcbiAgICAgIDwvdGV4dD5cclxuICAgIDwvc3ZnPlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJtYXAtYmFkZ2VcIj57bGFiZWx9PC9kaXY+XHJcbiAgPC9kaXY+XHJcbik7XHJcblxyXG5leHBvcnQgY29uc3QgSWNvbnMgPSB7XHJcbiAgbWVzc2FnZTogKFxyXG4gICAgPHN2ZyB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XHJcbiAgICAgIDxwYXRoIGQ9XCJNMjEgMTVhMiAyIDAgMCAxLTIgMkg3bC00IDRWNWEyIDIgMCAwIDEgMi0yaDE0YTIgMiAwIDAgMSAyIDJ6XCIgLz5cclxuICAgIDwvc3ZnPlxyXG4gICksXHJcbiAgY2FuY2VsOiAoXHJcbiAgICA8c3ZnIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cclxuICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxMlwiIHI9XCIxMFwiIC8+XHJcbiAgICAgIDxsaW5lIHgxPVwiMTVcIiB5MT1cIjlcIiB4Mj1cIjlcIiB5Mj1cIjE1XCIgLz5cclxuICAgICAgPGxpbmUgeDE9XCI5XCIgeTE9XCI5XCIgeDI9XCIxNVwiIHkyPVwiMTVcIiAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKSxcclxuICBzdGFyOiAoXHJcbiAgICA8c3ZnIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMlwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cclxuICAgICAgPHBvbHlnb24gcG9pbnRzPVwiMTIgMiAxNS4wOSA4LjI2IDIyIDkuMjcgMTcgMTQuMTQgMTguMTggMjEuMDIgMTIgMTcuNzcgNS44MiAyMS4wMiA3IDE0LjE0IDIgOS4yNyA4LjkxIDguMjYgMTIgMlwiIC8+XHJcbiAgICA8L3N2Zz5cclxuICApLFxyXG4gIHJlcG9ydDogKFxyXG4gICAgPHN2ZyB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XHJcbiAgICAgIDxwYXRoIGQ9XCJNMTAuMjkgMy44NkwxLjgyIDE4YTIgMiAwIDAgMCAxLjcxIDNoMTYuOTRhMiAyIDAgMCAwIDEuNzEtM0wxMy43MSAzLjg2YTIgMiAwIDAgMC0zLjQyIDB6XCIgLz5cclxuICAgICAgPGxpbmUgeDE9XCIxMlwiIHkxPVwiOVwiIHgyPVwiMTJcIiB5Mj1cIjEzXCIgLz5cclxuICAgICAgPGxpbmUgeDE9XCIxMlwiIHkxPVwiMTdcIiB4Mj1cIjEyLjAxXCIgeTI9XCIxN1wiIC8+XHJcbiAgICA8L3N2Zz5cclxuICApLFxyXG4gIGFjY2VwdDogKFxyXG4gICAgPHN2ZyB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XHJcbiAgICAgIDxwb2x5bGluZSBwb2ludHM9XCIyMCA2IDkgMTcgNCAxMlwiIC8+XHJcbiAgICA8L3N2Zz5cclxuICApLFxyXG4gIHJlbW92ZTogKFxyXG4gICAgPHN2ZyB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMThcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XHJcbiAgICAgIDxwb2x5bGluZSBwb2ludHM9XCIzIDYgNSA2IDIxIDZcIiAvPlxyXG4gICAgICA8cGF0aCBkPVwiTTE5IDZsLTEgMTRINkw1IDZcIiAvPlxyXG4gICAgICA8cGF0aCBkPVwiTTEwIDExdjZNMTQgMTF2NlwiIC8+XHJcbiAgICAgIDxwYXRoIGQ9XCJNOSA2VjRoNnYyXCIgLz5cclxuICAgIDwvc3ZnPlxyXG4gICksXHJcbiAgYmFjazogKFxyXG4gICAgPHN2ZyB3aWR0aD1cIjIwXCIgaGVpZ2h0PVwiMjBcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjIuNVwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIj5cclxuICAgICAgPHBhdGggZD1cIk0xOSAxMkg1TTEyIDVsLTcgNyA3IDdcIiAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKSxcclxuICBjbG9jazogKFxyXG4gICAgPHN2ZyB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJjdXJyZW50Q29sb3JcIiBzdHJva2VXaWR0aD1cIjJcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XHJcbiAgICAgIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTJcIiByPVwiMTBcIiAvPlxyXG4gICAgICA8cG9seWxpbmUgcG9pbnRzPVwiMTIgNiAxMiAxMiAxNiAxNFwiIC8+XHJcbiAgICA8L3N2Zz5cclxuICApLFxyXG4gIGNoZWNrOiAoXHJcbiAgICA8c3ZnIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMi41XCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxyXG4gICAgICA8cG9seWxpbmUgcG9pbnRzPVwiMjAgNiA5IDE3IDQgMTJcIiAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKSxcclxuICBwaW46IChcclxuICAgIDxzdmcgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiPlxyXG4gICAgICA8cGF0aCBkPVwiTTIxIDEwYzAgNy05IDEzLTkgMTNzLTktNi05LTEzYTkgOSAwIDAgMSAxOCAwelwiIC8+XHJcbiAgICAgIDxjaXJjbGUgY3g9XCIxMlwiIGN5PVwiMTBcIiByPVwiM1wiIC8+XHJcbiAgICA8L3N2Zz5cclxuICApLFxyXG4gIG5leHQ6IChcclxuICAgIDxzdmcgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE4XCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyLjVcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCI+XHJcbiAgICAgIDxwYXRoIGQ9XCJNNSAxMmgxNE0xMiA1bDcgNy03IDdcIiAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKSxcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBEZXRhaWxSb3c6IFJlYWN0LkZDPHsgbGFiZWw6IHN0cmluZzsgdmFsdWU6IFJlYWN0LlJlYWN0Tm9kZTsgdmFsdWVDbGFzcz86IHN0cmluZyB9PiA9ICh7IGxhYmVsLCB2YWx1ZSwgdmFsdWVDbGFzcyB9KSA9PiAoXHJcbiAgPGRpdiBjbGFzc05hbWU9XCJzaGVldC1kZXRhaWwtcm93XCI+XHJcbiAgICA8c3BhbiBjbGFzc05hbWU9XCJkZXRhaWwtbGFiZWxcIj57bGFiZWx9PC9zcGFuPlxyXG4gICAgPHNwYW4gY2xhc3NOYW1lPXtgZGV0YWlsLXZhbHVlICR7dmFsdWVDbGFzcyA/PyAnJ31gfT57dmFsdWV9PC9zcGFuPlxyXG4gIDwvZGl2PlxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IEJ0bjogUmVhY3QuRkM8eyBjbHM6IHN0cmluZzsgaWNvbjogUmVhY3QuUmVhY3ROb2RlOyBsYWJlbDogc3RyaW5nOyBzbWFsbD86IGJvb2xlYW47IG9uQ2xpY2s/OiAoKSA9PiB2b2lkIH0+ID0gKHtcclxuICBjbHMsXHJcbiAgaWNvbixcclxuICBsYWJlbCxcclxuICBzbWFsbCxcclxuICBvbkNsaWNrLFxyXG59KSA9PiAoXHJcbiAgPGJ1dHRvblxyXG4gICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICBjbGFzc05hbWU9e2BzaGVldC1hY3Rpb24tYnRuICR7Y2xzfSR7c21hbGwgPyAnIGJ0bi1zbWFsbCcgOiAnJ31gfVxyXG4gICAgb25DbGljaz17b25DbGlja31cclxuICAgIGFyaWEtbGFiZWw9e2xhYmVsfVxyXG4gID5cclxuICAgIHtpY29ufVxyXG4gICAge2xhYmVsfVxyXG4gIDwvYnV0dG9uPlxyXG4pO1xyXG5cclxuY29uc3QgQXBwOiBSZWFjdC5GQyA9ICgpID0+IHtcclxuICBjb25zdCBbYWN0aXZlVGFiLCBzZXRBY3RpdmVUYWJdID0gdXNlU3RhdGU8VGFiPigoKSA9PiBwYXRoVG9UYWIod2luZG93LmxvY2F0aW9uLnBhdGhuYW1lKSk7XHJcbiAgY29uc3QgW2lzQXV0aGVudGljYXRlZCwgc2V0SXNBdXRoZW50aWNhdGVkXSA9IHVzZVN0YXRlPGJvb2xlYW4+KCgpID0+IHtcclxuICAgIHJldHVybiBCb29sZWFuKGdldEF1dGhUb2tlbigpKTtcclxuICB9KTtcclxuICBjb25zdCBbYXV0aFNjcmVlbiwgc2V0QXV0aFNjcmVlbl0gPSB1c2VTdGF0ZTwnbG9naW4nIHwgJ2RyaXZlclNpZ251cCc+KCdsb2dpbicpO1xyXG4gIGNvbnN0IFtyZXF1ZXN0UmlkZVByZWZpbGwsIHNldFJlcXVlc3RSaWRlUHJlZmlsbF0gPSB1c2VTdGF0ZTxSaWRlUHJlZmlsbCB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcclxuICBjb25zdCBbcG9zdFJpZGVQcmVmaWxsLCBzZXRQb3N0UmlkZVByZWZpbGxdID0gdXNlU3RhdGU8UmlkZVByZWZpbGwgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XHJcbiAgY29uc3QgW2pvdXJuZXlNb2RlLCBzZXRKb3VybmV5TW9kZV0gPSB1c2VTdGF0ZTwndXNlcicgfCAnZHJpdmVyJz4oJ3VzZXInKTtcclxuICBjb25zdCBbYWN0aXZpdHlNb2RlLCBzZXRBY3Rpdml0eU1vZGVdID0gdXNlU3RhdGU8J3VzZXInIHwgJ0RyaXZlcic+KCd1c2VyJyk7XHJcbiAgY29uc3QgW2NoYXRSaWRlSWQsIHNldENoYXRSaWRlSWRdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgW2NoYXRQYXJ0aWNpcGFudElkLCBzZXRDaGF0UGFydGljaXBhbnRJZF0gPSB1c2VTdGF0ZTxzdHJpbmcgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XHJcbiAgY29uc3QgW2NoYXRSZXR1cm5UYWIsIHNldENoYXRSZXR1cm5UYWJdID0gdXNlU3RhdGU8VGFiPignYWN0aXZpdHknKTtcclxuICBjb25zdCBbdW5yZWFkQ291bnQsIHNldFVucmVhZENvdW50XSA9IHVzZVN0YXRlKDApO1xyXG4gIGNvbnN0IFtjaGF0VG9hc3RzLCBzZXRDaGF0VG9hc3RzXSA9IHVzZVN0YXRlPENoYXRUb2FzdFtdPihbXSk7XHJcbiAgY29uc3QgYWN0aXZlQ2hhdExpbmsgPSBhY3RpdmVUYWIgPT09ICdjaGF0JyAmJiBjaGF0UmlkZUlkID8gYnVpbGRDaGF0UGF0aChjaGF0UmlkZUlkLCBjaGF0UGFydGljaXBhbnRJZCkgOiBudWxsO1xyXG5cclxuICAvLyBTdWJzY3JpYmUgdG8gbm90aWZpY2F0aW9uIHN0b3JlIHVwZGF0ZXNcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgY29uc3QgdW5zdWIgPSBzdWJzY3JpYmUoKCkgPT4gc2V0VW5yZWFkQ291bnQoZ2V0VW5yZWFkQ291bnQoKSkpO1xyXG4gICAgcmV0dXJuIHVuc3ViO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IHVuc3Vic2NyaWJlID0gc3Vic2NyaWJlVG9JbmNvbWluZ05vdGlmaWNhdGlvbnMoKG5vdGlmaWNhdGlvbikgPT4ge1xyXG4gICAgICBjb25zdCBub3RpZmljYXRpb25MaW5rID0gbm90aWZpY2F0aW9uLmxpbms7XHJcbiAgICAgIGlmIChub3RpZmljYXRpb24udHlwZSAhPT0gJ2NoYXQnIHx8ICFub3RpZmljYXRpb25MaW5rKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoYWN0aXZlQ2hhdExpbmsgJiYgYXJlU2FtZUNoYXRMaW5rKG5vdGlmaWNhdGlvbkxpbmssIGFjdGl2ZUNoYXRMaW5rKSkge1xyXG4gICAgICAgIHZvaWQgbWFya1JlYWRCeUxpbmsobm90aWZpY2F0aW9uTGluayk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzZXRDaGF0VG9hc3RzKChwcmV2KSA9PiB7XHJcbiAgICAgICAgaWYgKHByZXYuc29tZSgodG9hc3QpID0+IHRvYXN0LmlkID09PSBub3RpZmljYXRpb24uaWQpKSB7XHJcbiAgICAgICAgICByZXR1cm4gcHJldjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiBub3RpZmljYXRpb24uaWQsXHJcbiAgICAgICAgICAgIHNlbmRlck5hbWU6IGdldENoYXRUb2FzdFNlbmRlck5hbWUobm90aWZpY2F0aW9uLnRpdGxlKSxcclxuICAgICAgICAgICAgcHJldmlldzogbm90aWZpY2F0aW9uLmJvZHksXHJcbiAgICAgICAgICAgIGxpbms6IG5vdGlmaWNhdGlvbkxpbmssXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgLi4ucHJldixcclxuICAgICAgICBdO1xyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB1bnN1YnNjcmliZTtcclxuICB9LCBbYWN0aXZlQ2hhdExpbmtdKTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghYWN0aXZlQ2hhdExpbmspIHJldHVybjtcclxuXHJcbiAgICBzZXRDaGF0VG9hc3RzKChwcmV2KSA9PiBwcmV2LmZpbHRlcigodG9hc3QpID0+ICFhcmVTYW1lQ2hhdExpbmsodG9hc3QubGluaywgYWN0aXZlQ2hhdExpbmspKSk7XHJcbiAgfSwgW2FjdGl2ZUNoYXRMaW5rXSk7XHJcblxyXG4gIGNvbnN0IG5hdmlnYXRlID0gKHRhYjogVGFiKSA9PiB7XHJcbiAgICBjb25zdCBuZXh0UGF0aCA9IHRhYlRvUGF0aCh0YWIpO1xyXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSAhPT0gbmV4dFBhdGgpIHtcclxuICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCAnJywgbmV4dFBhdGgpO1xyXG4gICAgfVxyXG4gICAgc2V0QWN0aXZlVGFiKHRhYik7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb3BlbkNoYXQgPSAoXHJcbiAgICByaWRlSWQ6IHN0cmluZyxcclxuICAgIHBhcnRpY2lwYW50SWQ/OiBzdHJpbmcsXHJcbiAgICBzb3VyY2VUYWI6IFRhYiA9IGFjdGl2ZVRhYiA9PT0gJ2NoYXQnID8gY2hhdFJldHVyblRhYiA6IGFjdGl2ZVRhYixcclxuICApID0+IHtcclxuICAgIHNldENoYXRSaWRlSWQocmlkZUlkKTtcclxuICAgIHNldENoYXRQYXJ0aWNpcGFudElkKHBhcnRpY2lwYW50SWQpO1xyXG4gICAgc2V0Q2hhdFJldHVyblRhYihzb3VyY2VUYWIpO1xyXG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCAnJywgYnVpbGRDaGF0UGF0aChyaWRlSWQsIHBhcnRpY2lwYW50SWQpKTtcclxuICAgIHNldEFjdGl2ZVRhYignY2hhdCcpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG5hdmlnYXRlRnJvbUxpbmsgPSAobGluazogc3RyaW5nKSA9PiB7XHJcbiAgICBjb25zdCBjaGF0Um91dGUgPSBwYXJzZUNoYXRMaW5rKGxpbmspO1xyXG4gICAgaWYgKGNoYXRSb3V0ZSkge1xyXG4gICAgICBvcGVuQ2hhdChjaGF0Um91dGUucmlkZUlkLCBjaGF0Um91dGUucGFydGljaXBhbnRJZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGxpbmssIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4pO1xyXG4gICAgICBhcHBseVJvdXRlTW9kZSh1cmwsIHNldEFjdGl2aXR5TW9kZSwgc2V0Sm91cm5leU1vZGUpO1xyXG4gICAgICB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoe30sICcnLCBgJHt1cmwucGF0aG5hbWV9JHt1cmwuc2VhcmNofWApO1xyXG4gICAgICBzZXRBY3RpdmVUYWIocGF0aFRvVGFiKHVybC5wYXRobmFtZSkpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBzeW5jUm91dGVTdGF0ZSA9ICgpID0+IHtcclxuICAgICAgY29uc3QgY3VycmVudFVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICBjb25zdCBjaGF0Um91dGUgPSBwYXJzZUNoYXRMaW5rKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgaWYgKGNoYXRSb3V0ZSkge1xyXG4gICAgICAgIHNldENoYXRSaWRlSWQoY2hhdFJvdXRlLnJpZGVJZCk7XHJcbiAgICAgICAgc2V0Q2hhdFBhcnRpY2lwYW50SWQoY2hhdFJvdXRlLnBhcnRpY2lwYW50SWQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldENoYXRSaWRlSWQobnVsbCk7XHJcbiAgICAgICAgc2V0Q2hhdFBhcnRpY2lwYW50SWQodW5kZWZpbmVkKTtcclxuICAgICAgfVxyXG4gICAgICBhcHBseVJvdXRlTW9kZShjdXJyZW50VXJsLCBzZXRBY3Rpdml0eU1vZGUsIHNldEpvdXJuZXlNb2RlKTtcclxuICAgICAgc2V0QWN0aXZlVGFiKHBhdGhUb1RhYih3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUpKTtcclxuICAgIH07XHJcblxyXG4gICAgc3luY1JvdXRlU3RhdGUoKTtcclxuICAgIGNvbnN0IG9uUG9wU3RhdGUgPSAoKSA9PiBzeW5jUm91dGVTdGF0ZSgpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25Qb3BTdGF0ZSk7XHJcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgb25Qb3BTdGF0ZSk7XHJcbiAgfSwgW10pO1xyXG5cclxuICAvLyBEcml2ZXItZ2F0aW5nXHJcbiAgY29uc3QgW2NhblVzZURyaXZlck1vZGUsIHNldENhblVzZURyaXZlck1vZGVdID0gdXNlU3RhdGU8Ym9vbGVhbj4oZmFsc2UpO1xyXG4gIGNvbnN0IFtzaG93RHJpdmVyU2lnbnVwLCBzZXRTaG93RHJpdmVyU2lnbnVwXSA9IHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcclxuICBjb25zdCBbYWZ0ZXJEcml2ZXJTaWdudXBUYWIsIHNldEFmdGVyRHJpdmVyU2lnbnVwVGFiXSA9IHVzZVN0YXRlPFRhYj4oJ2hvbWUnKTtcclxuXHJcbiAgY29uc3QgcmVmcmVzaERyaXZlclN0YXR1cyA9IGFzeW5jICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGFwaUZldGNoPHsgaXNfZHJpdmVyOiBib29sZWFuIH0+KCdkcml2ZXJzL21lL3N0YXR1cycsIHsgbWV0aG9kOiAnR0VUJyB9KTtcclxuICAgICAgY29uc3Qgb2sgPSBCb29sZWFuKHJlcz8uaXNfZHJpdmVyKTtcclxuICAgICAgc2V0Q2FuVXNlRHJpdmVyTW9kZShvayk7XHJcbiAgICAgIHJldHVybiBvaztcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgLy8gRmFpbCBjbG9zZWQsIGJ1dCBhbHNvIHJldHVybiBmYWxzZSBzbyBjYWxsZXJzIGNhbiBkZWNpZGUgd2hhdCB0byBkb1xyXG4gICAgICBzZXRDYW5Vc2VEcml2ZXJNb2RlKGZhbHNlKTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IHRva2VuID0gZ2V0QXV0aFRva2VuKCk7XHJcbiAgICBpZiAoIXRva2VuKSByZXR1cm47XHJcbiAgICBzZXRJc0F1dGhlbnRpY2F0ZWQodHJ1ZSk7XHJcblxyXG4gICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBhcGlGZXRjaCgndXNlcnMvbWUnLCB7IG1ldGhvZDogJ0dFVCcgfSk7XHJcbiAgICAgICAgYXdhaXQgcmVmcmVzaERyaXZlclN0YXR1cygpO1xyXG4gICAgICAgIHN0YXJ0UG9sbGluZygpO1xyXG4gICAgICAgIHN0YXJ0UmVhbHRpbWVOb3RpZmljYXRpb25zKHRva2VuKTtcclxuICAgICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgICAgaWYgKGU/LnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgICAgICBjbGVhckF1dGhUb2tlbigpO1xyXG4gICAgICAgICAgcmVzZXROb3RpZmljYXRpb25zKCk7XHJcbiAgICAgICAgICBzZXRJc0F1dGhlbnRpY2F0ZWQoZmFsc2UpO1xyXG4gICAgICAgICAgc2V0Q2FuVXNlRHJpdmVyTW9kZShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KSgpO1xyXG4gIH0sIFtdKTtcclxuXHJcbiAgY29uc3QgaGFuZGxlQXV0aFN1Y2Nlc3MgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBzZXRJc0F1dGhlbnRpY2F0ZWQodHJ1ZSk7XHJcbiAgICBhd2FpdCByZWZyZXNoRHJpdmVyU3RhdHVzKCk7XHJcbiAgICBzdGFydFBvbGxpbmcoKTtcclxuICAgIGNvbnN0IHRva2VuID0gZ2V0QXV0aFRva2VuKCk7XHJcbiAgICBpZiAodG9rZW4pIHtcclxuICAgICAgc3RhcnRSZWFsdGltZU5vdGlmaWNhdGlvbnModG9rZW4pO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IGhhbmRsZUxvZ291dCA9ICgpID0+IHtcclxuICAgIGNsZWFyQXV0aFRva2VuKCk7XHJcbiAgICByZXNldE5vdGlmaWNhdGlvbnMoKTtcclxuICAgIHNldElzQXV0aGVudGljYXRlZChmYWxzZSk7IC8vIFJlc2V0IGF1dGggc3RhdGVcclxuICAgIG5hdmlnYXRlKCdob21lJyk7IC8vIFJlc2V0IHRhYiBzbyBpdCBkZWZhdWx0cyB0byBob21lIG9uIG5leHQgbG9naW5cclxuICAgIHNldFNob3dEcml2ZXJTaWdudXAoZmFsc2UpO1xyXG4gICAgc2V0Q2hhdFRvYXN0cyhbXSk7XHJcbiAgICBzZXRDaGF0UmlkZUlkKG51bGwpO1xyXG4gICAgc2V0Q2hhdFBhcnRpY2lwYW50SWQodW5kZWZpbmVkKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBkaXNtaXNzVG9hc3QgPSAodG9hc3RJZDogc3RyaW5nKSA9PiB7XHJcbiAgICBzZXRDaGF0VG9hc3RzKChwcmV2KSA9PiBwcmV2LmZpbHRlcigodG9hc3QpID0+IHRvYXN0LmlkICE9PSB0b2FzdElkKSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb3BlblRvYXN0ID0gKHRvYXN0OiBDaGF0VG9hc3QpID0+IHtcclxuICAgIGRpc21pc3NUb2FzdCh0b2FzdC5pZCk7XHJcbiAgICB2b2lkIG1hcmtSZWFkQnlMaW5rKHRvYXN0LmxpbmspO1xyXG4gICAgbmF2aWdhdGVGcm9tTGluayh0b2FzdC5saW5rKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBzdGFydERyaXZlclNpZ251cCA9IChkZXN0aW5hdGlvbjogVGFiID0gJ2hvbWUnKSA9PiB7XHJcbiAgICBzZXRBZnRlckRyaXZlclNpZ251cFRhYihkZXN0aW5hdGlvbik7XHJcbiAgICBzZXRTaG93RHJpdmVyU2lnbnVwKHRydWUpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IGdvVG9Ecml2ZXJUYWIgPSBhc3luYyAoZGVzdGluYXRpb246IFRhYikgPT4ge1xyXG4gICAgY29uc3Qgb2sgPSBhd2FpdCByZWZyZXNoRHJpdmVyU3RhdHVzKCk7IC8vIGFsd2F5cyByZS1jaGVjayBzZXJ2ZXIgdHJ1dGhcclxuICAgIGlmICghb2spIHJldHVybiBzdGFydERyaXZlclNpZ251cChkZXN0aW5hdGlvbik7XHJcbiAgICBuYXZpZ2F0ZShkZXN0aW5hdGlvbik7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgaGFuZGxlUmlkZVN0YXJ0ZWQgPSAoKSA9PiB7XHJcbiAgICBzZXRKb3VybmV5TW9kZSgnZHJpdmVyJyk7XHJcbiAgICBzZXRBY3Rpdml0eU1vZGUoJ0RyaXZlcicpO1xyXG4gICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHt9LCAnJywgJy9qb3VybmV5P21vZGU9ZHJpdmVyJyk7XHJcbiAgICBzZXRBY3RpdmVUYWIoJ2pvdXJuZXknKTtcclxuICB9O1xyXG5cclxuICBjb25zdCByZW5kZXJBdXRoZWRDb250ZW50ID0gKCkgPT4ge1xyXG4gICAgaWYgKHNob3dEcml2ZXJTaWdudXApIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8RHJpdmVyU2lnbnVwUGFnZVxyXG4gICAgICAgICAgb25CYWNrPXsoKSA9PiBzZXRTaG93RHJpdmVyU2lnbnVwKGZhbHNlKX1cclxuICAgICAgICAgIG9uQ29tcGxldGU9e2FzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgc2V0U2hvd0RyaXZlclNpZ251cChmYWxzZSk7XHJcbiAgICAgICAgICAgIGF3YWl0IHJlZnJlc2hEcml2ZXJTdGF0dXMoKTtcclxuICAgICAgICAgICAgbmF2aWdhdGUoYWZ0ZXJEcml2ZXJTaWdudXBUYWIpO1xyXG4gICAgICAgICAgfX1cclxuICAgICAgICAvPlxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHN3aXRjaCAoYWN0aXZlVGFiKSB7XHJcbiAgICAgIGNhc2UgJ2hvbWUnOlxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICA8SG9tZVBhZ2VcclxuICAgICAgICAgICAgb25SZXF1ZXN0UmlkZT17KHByZWZpbGwpID0+IHtcclxuICAgICAgICAgICAgICBzZXRSZXF1ZXN0UmlkZVByZWZpbGwocHJlZmlsbCk7XHJcbiAgICAgICAgICAgICAgbmF2aWdhdGUoJ3JlcXVlc3QnKTtcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgb25Qb3N0UmlkZT17KHByZWZpbGwpID0+IHtcclxuICAgICAgICAgICAgICBzZXRQb3N0UmlkZVByZWZpbGwocHJlZmlsbCk7XHJcbiAgICAgICAgICAgICAgdm9pZCBnb1RvRHJpdmVyVGFiKCdwb3N0Jyk7XHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIGNhblVzZURyaXZlck1vZGU9e2NhblVzZURyaXZlck1vZGV9XHJcbiAgICAgICAgICAgIG9uRHJpdmVyU2lnbnVwPXsoKSA9PiBzdGFydERyaXZlclNpZ251cCgncG9zdCcpfVxyXG4gICAgICAgICAgICBvbk9wZW5UaW1ldGFibGU9eygpID0+IG5hdmlnYXRlKCd0aW1ldGFibGUnKX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgKTtcclxuICAgICAgY2FzZSAncmVxdWVzdCc6XHJcbiAgICAgICAgcmV0dXJuIDxSZXF1ZXN0UmlkZVBhZ2UgcHJlZmlsbD17cmVxdWVzdFJpZGVQcmVmaWxsfSAvPjtcclxuICAgICAgY2FzZSAncG9zdCc6XHJcbiAgICAgICAgLy8gRXh0cmEgc2FmZXR5OiBpZiBhIG5vbi1kcml2ZXIgc29tZWhvdyBsYW5kcyBoZXJlLCBnYXRlIHRoZW0uXHJcbiAgICAgICAgaWYgKCFjYW5Vc2VEcml2ZXJNb2RlKSB7XHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IDE2IH19PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiIHN0eWxlPXt7IHBhZGRpbmc6IDE2IH19PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250V2VpZ2h0OiA3MDAsIG1hcmdpbkJvdHRvbTogOCB9fT5Ecml2ZXIgYWNjZXNzIHJlcXVpcmVkPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGNvbG9yOiAncmdiYSgyNTUsMjU1LDI1NSwwLjcpJywgbWFyZ2luQm90dG9tOiAxMiB9fT5cclxuICAgICAgICAgICAgICAgICAgWW91IG5lZWQgdG8gcmVnaXN0ZXIgYXMgYSBkcml2ZXIgYmVmb3JlIHlvdSBjYW4gcG9zdCByaWRlcy5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJzaGVldC1hY3Rpb24tYnRuIGJ0bi1hY2NlcHRcIiBvbkNsaWNrPXsoKSA9PiBzdGFydERyaXZlclNpZ251cCgncG9zdCcpfT5cclxuICAgICAgICAgICAgICAgICAge0ljb25zLmNoZWNrfVxyXG4gICAgICAgICAgICAgICAgICBCZWNvbWUgYSBkcml2ZXJcclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiA8UG9zdFJpZGVQYWdlIHByZWZpbGw9e3Bvc3RSaWRlUHJlZmlsbH0gLz47XHJcbiAgICAgIGNhc2UgJ2FjY291bnQnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgIDxBY2NvdW50UGFnZVxyXG4gICAgICAgICAgICBvbkxvZ291dD17aGFuZGxlTG9nb3V0fVxyXG4gICAgICAgICAgICBvbk9wZW5TZXR0aW5ncz17KCkgPT4gbmF2aWdhdGUoJ3NldHRpbmdzJyl9XHJcbiAgICAgICAgICAgIG9uT3BlblRpbWV0YWJsZT17KCkgPT4gbmF2aWdhdGUoJ3RpbWV0YWJsZScpfVxyXG4gICAgICAgICAgICBvbk9wZW5TYWZldHlDaGVja3VwPXsoKSA9PiBuYXZpZ2F0ZSgnc2FmZXR5Jyl9XHJcbiAgICAgICAgICAgIG9uT3BlbkluYm94PXsoKSA9PiBuYXZpZ2F0ZSgnaW5ib3gnKX1cclxuICAgICAgICAgICAgdW5yZWFkQ291bnQ9e3VucmVhZENvdW50fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICApO1xyXG4gICAgICBjYXNlICdzYWZldHknOlxyXG4gICAgICAgIHJldHVybiA8U2FmZXR5Q2hlY2t1cFBhZ2Ugb25CYWNrPXsoKSA9PiBuYXZpZ2F0ZSgnYWNjb3VudCcpfSAvPjtcclxuXHJcbiAgICAgIGNhc2UgJ3NldHRpbmdzJzpcclxuICAgICAgICByZXR1cm4gPFNldHRpbmdzUGFnZSBvbkJhY2s9eygpID0+IG5hdmlnYXRlKCdhY2NvdW50Jyl9IC8+O1xyXG4gICAgICBjYXNlICdqb3VybmV5JzpcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPEpvdXJuZXlQYWdlXHJcbiAgICAgICAgICAgIGNhblVzZURyaXZlck1vZGU9e2NhblVzZURyaXZlck1vZGV9XHJcbiAgICAgICAgICAgIG9uRHJpdmVyU2lnbnVwPXsoKSA9PiBzdGFydERyaXZlclNpZ251cCgnam91cm5leScpfVxyXG4gICAgICAgICAgICBvbk9wZW5DaGF0PXtvcGVuQ2hhdH1cclxuICAgICAgICAgICAgbW9kZT17am91cm5leU1vZGV9XHJcbiAgICAgICAgICAgIG9uTW9kZUNoYW5nZT17c2V0Sm91cm5leU1vZGV9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICk7XHJcbiAgICAgIGNhc2UgJ2FjdGl2aXR5JzpcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPEFjdGl2aXR5UGFnZVxyXG4gICAgICAgICAgICBjYW5Vc2VEcml2ZXJNb2RlPXtjYW5Vc2VEcml2ZXJNb2RlfVxyXG4gICAgICAgICAgICBvbkRyaXZlclNpZ251cD17KCkgPT4gc3RhcnREcml2ZXJTaWdudXAoJ2FjdGl2aXR5Jyl9XHJcbiAgICAgICAgICAgIG9uT3BlbkNoYXQ9e29wZW5DaGF0fVxyXG4gICAgICAgICAgICBvblJpZGVTdGFydGVkPXtoYW5kbGVSaWRlU3RhcnRlZH1cclxuICAgICAgICAgICAgbW9kZT17YWN0aXZpdHlNb2RlfVxyXG4gICAgICAgICAgICBvbk1vZGVDaGFuZ2U9e3NldEFjdGl2aXR5TW9kZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgKTtcclxuICAgICAgY2FzZSAndGltZXRhYmxlJzpcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPFRpbWV0YWJsZVBhZ2VcclxuICAgICAgICAgICAgb25CYWNrPXsoKSA9PiBuYXZpZ2F0ZSgnYWNjb3VudCcpfVxyXG4gICAgICAgICAgICBvblNlbGVjdEV2ZW50PXsocHJlZmlsbCkgPT4ge1xyXG4gICAgICAgICAgICAgIHNldFJlcXVlc3RSaWRlUHJlZmlsbChwcmVmaWxsKTtcclxuICAgICAgICAgICAgICBuYXZpZ2F0ZSgncmVxdWVzdCcpO1xyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICApO1xyXG4gICAgICBjYXNlICdjaGF0JzpcclxuICAgICAgICByZXR1cm4gY2hhdFJpZGVJZCA/IChcclxuICAgICAgICAgIDxDaGF0UGFnZSByaWRlSWQ9e2NoYXRSaWRlSWR9IHBhcnRpY2lwYW50SWQ9e2NoYXRQYXJ0aWNpcGFudElkfSBvbkJhY2s9eygpID0+IG5hdmlnYXRlKGNoYXRSZXR1cm5UYWIpfSAvPlxyXG4gICAgICAgICkgOiAoXHJcbiAgICAgICAgICA8QWN0aXZpdHlQYWdlXHJcbiAgICAgICAgICAgIGNhblVzZURyaXZlck1vZGU9e2NhblVzZURyaXZlck1vZGV9XHJcbiAgICAgICAgICAgIG9uRHJpdmVyU2lnbnVwPXsoKSA9PiBzdGFydERyaXZlclNpZ251cCgnYWN0aXZpdHknKX1cclxuICAgICAgICAgICAgb25PcGVuQ2hhdD17b3BlbkNoYXR9XHJcbiAgICAgICAgICAgIG9uUmlkZVN0YXJ0ZWQ9e2hhbmRsZVJpZGVTdGFydGVkfVxyXG4gICAgICAgICAgICBtb2RlPXthY3Rpdml0eU1vZGV9XHJcbiAgICAgICAgICAgIG9uTW9kZUNoYW5nZT17c2V0QWN0aXZpdHlNb2RlfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICApO1xyXG4gICAgICBjYXNlICdpbmJveCc6XHJcbiAgICAgICAgcmV0dXJuIDxJbmJveFBhZ2Ugb25CYWNrPXsoKSA9PiBuYXZpZ2F0ZSgnYWNjb3VudCcpfSBvbk5hdmlnYXRlPXtuYXZpZ2F0ZUZyb21MaW5rfSAvPjtcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgPEhvbWVQYWdlXHJcbiAgICAgICAgICAgIG9uUmVxdWVzdFJpZGU9eygpID0+IG5hdmlnYXRlKCdyZXF1ZXN0Jyl9XHJcbiAgICAgICAgICAgIG9uUG9zdFJpZGU9eyhwcmVmaWxsKSA9PiB7XHJcbiAgICAgICAgICAgICAgc2V0UG9zdFJpZGVQcmVmaWxsKHByZWZpbGwpO1xyXG4gICAgICAgICAgICAgIHZvaWQgZ29Ub0RyaXZlclRhYigncG9zdCcpO1xyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICBjYW5Vc2VEcml2ZXJNb2RlPXtjYW5Vc2VEcml2ZXJNb2RlfVxyXG4gICAgICAgICAgICBvbkRyaXZlclNpZ251cD17KCkgPT4gc3RhcnREcml2ZXJTaWdudXAoJ3Bvc3QnKX1cclxuICAgICAgICAgICAgb25PcGVuVGltZXRhYmxlPXsoKSA9PiBuYXZpZ2F0ZSgndGltZXRhYmxlJyl9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwidWJlci1wYWdlXCI+XHJcbiAgICAgIDxhIGNsYXNzTmFtZT1cInNraXAtbGlua1wiIGhyZWY9XCIjbWFpbi1jb250ZW50XCI+U2tpcCB0byBtYWluIGNvbnRlbnQ8L2E+XHJcblxyXG4gICAgICA8bWFpbiBpZD1cIm1haW4tY29udGVudFwiIGNsYXNzTmFtZT1cInViZXItY29udGFpbmVyXCIgcm9sZT1cIm1haW5cIiB0YWJJbmRleD17LTF9PlxyXG4gICAgICAgIDxoMSBjbGFzc05hbWU9XCJ2aXN1YWxseS1oaWRkZW5cIj5TYW11ZGh5YW5SaWRlczwvaDE+XHJcbiAgICAgICAge2lzQXV0aGVudGljYXRlZCA/IChcclxuICAgICAgICAgIHJlbmRlckF1dGhlZENvbnRlbnQoKVxyXG4gICAgICAgICkgOiBhdXRoU2NyZWVuID09PSAnZHJpdmVyU2lnbnVwJyA/IChcclxuICAgICAgICAgIDxEcml2ZXJTaWdudXBQYWdlXHJcbiAgICAgICAgICAgIG9uQmFjaz17KCkgPT4gc2V0QXV0aFNjcmVlbignbG9naW4nKX1cclxuICAgICAgICAgICAgb25Db21wbGV0ZT17KCkgPT4ge1xyXG4gICAgICAgICAgICAgIHNldEF1dGhTY3JlZW4oJ2xvZ2luJyk7XHJcbiAgICAgICAgICAgICAgaGFuZGxlQXV0aFN1Y2Nlc3MoKTtcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgKSA6IChcclxuICAgICAgICAgIDxMb2dpblBhZ2VcclxuICAgICAgICAgICAgb25BdXRoU3VjY2Vzcz17aGFuZGxlQXV0aFN1Y2Nlc3N9XHJcbiAgICAgICAgICAgIG9uU3RhcnREcml2ZXJTaWdudXA9eyhkcmFmdDogRHJpdmVyU2lnbnVwRHJhZnQpID0+IHtcclxuICAgICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnZHJpdmVyU2lnbnVwRHJhZnQnLCBKU09OLnN0cmluZ2lmeShkcmFmdCkpO1xyXG4gICAgICAgICAgICAgIHNldEF1dGhTY3JlZW4oJ2RyaXZlclNpZ251cCcpO1xyXG4gICAgICAgICAgICB9fVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICApfVxyXG4gICAgICA8L21haW4+XHJcblxyXG4gICAgICB7aXNBdXRoZW50aWNhdGVkICYmIChcclxuICAgICAgICA8Q2hhdFRvYXN0TGF5ZXIgdG9hc3RzPXtjaGF0VG9hc3RzfSBvbk9wZW49e29wZW5Ub2FzdH0gb25EaXNtaXNzPXtkaXNtaXNzVG9hc3R9IC8+XHJcbiAgICAgICl9XHJcblxyXG4gICAgICB7aXNBdXRoZW50aWNhdGVkICYmIChcclxuICAgICAgICA8bmF2IGNsYXNzTmFtZT1cImJvdHRvbS1uYXZcIiBhcmlhLWxhYmVsPVwiUHJpbWFyeVwiPlxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgYXJpYS1jdXJyZW50PXthY3RpdmVUYWIgPT09ICdob21lJyA/ICdwYWdlJyA6IHVuZGVmaW5lZH1cclxuICAgICAgICAgICAgY2xhc3NOYW1lPXtgbmF2LWl0ZW0gJHthY3RpdmVUYWIgPT09ICdob21lJyA/ICduYXYtaXRlbS1hY3RpdmUnIDogJyd9YH1cclxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gbmF2aWdhdGUoJ2hvbWUnKX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXYtaWNvblwiPvCfmpc8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXYtbGFiZWxcIj5Ib21lPC9kaXY+XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuXHJcbiAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICBhcmlhLWN1cnJlbnQ9e2FjdGl2ZVRhYiA9PT0gJ2pvdXJuZXknID8gJ3BhZ2UnIDogdW5kZWZpbmVkfVxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e2BuYXYtaXRlbSAke2FjdGl2ZVRhYiA9PT0gJ2pvdXJuZXknID8gJ25hdi1pdGVtLWFjdGl2ZScgOiAnJ31gfVxyXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBuYXZpZ2F0ZSgnam91cm5leScpfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdi1pY29uXCI+8J+Xuu+4jzwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdi1sYWJlbFwiPkpvdXJuZXk8L2Rpdj5cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGFyaWEtY3VycmVudD17YWN0aXZlVGFiID09PSAnYWN0aXZpdHknID8gJ3BhZ2UnIDogdW5kZWZpbmVkfVxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e2BuYXYtaXRlbSAke2FjdGl2ZVRhYiA9PT0gJ2FjdGl2aXR5JyA/ICduYXYtaXRlbS1hY3RpdmUnIDogJyd9YH1cclxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gbmF2aWdhdGUoJ2FjdGl2aXR5Jyl9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2LWljb25cIj7wn5WSPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2LWxhYmVsXCI+QWN0aXZpdHk8L2Rpdj5cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIGFyaWEtY3VycmVudD17YWN0aXZlVGFiID09PSAnYWNjb3VudCcgPyAncGFnZScgOiB1bmRlZmluZWR9XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YG5hdi1pdGVtICR7YWN0aXZlVGFiID09PSAnYWNjb3VudCcgPyAnbmF2LWl0ZW0tYWN0aXZlJyA6ICcnfWB9XHJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG5hdmlnYXRlKCdhY2NvdW50Jyl9XHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2LWljb25cIiBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9fT5cclxuICAgICAgICAgICAgICDwn5GkXHJcbiAgICAgICAgICAgICAge3VucmVhZENvdW50ID4gMCAmJiAoXHJcbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAtMiwgcmlnaHQ6IC02LFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aDogOCwgaGVpZ2h0OiA4LCBib3JkZXJSYWRpdXM6ICc1MCUnLFxyXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnIzNiODJmNicsIGJvcmRlcjogJzJweCBzb2xpZCB2YXIoLS1jb2xvci1iZywgIzE4MWEyMCknLFxyXG4gICAgICAgICAgICAgICAgfX0gLz5cclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXYtbGFiZWxcIj5BY2NvdW50PC9kaXY+XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8L25hdj5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIDxTcGVlZEluc2lnaHRzIC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQXBwO1xyXG4iXSwiZmlsZSI6IkM6L1VzZXJzL3lsYW5uL3ZzY29kZS9VbmkvU2FtdWRoeWFuUmlkZXMvZnJvbnRlbmQvc3JjL0FwcC50c3gifQ==