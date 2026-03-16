import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/InboxPage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=b8f2434d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=b8f2434d"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useEffect = __vite__cjsImport1_react["useEffect"]; const useState = __vite__cjsImport1_react["useState"];
import { Icons } from "/src/App.tsx";
import {
  fetchNotifications,
  getNotifications,
  markReadByLink,
  subscribe
} from "/src/lib/notifications.ts";
const inboxMetaText = "var(--text-muted)";
const inboxTimeText = "var(--text-subtle)";
const InboxPage = ({ onBack, onNavigate }) => {
  _s();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    setNotifications(getNotifications());
    const unsubscribe = subscribe(() => {
      if (isMounted) {
        setNotifications(getNotifications());
      }
    });
    (async () => {
      setLoading(true);
      try {
        const data = await fetchNotifications();
        if (!isMounted) return;
        setNotifications(data);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);
  const handleNotificationClick = async (notification) => {
    if (notification.link) {
      await markReadByLink(notification.link);
      setNotifications(
        (prev) => prev.map(
          (item) => item.link === notification.link ? { ...item, read: true } : item
        )
      );
      onNavigate(notification.link);
    }
  };
  const formatTime = (iso) => {
    const d = new Date(iso);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 6e4);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };
  const typeEmoji = (type) => {
    switch (type) {
      case "chat":
        return "💬";
      case "ride":
        return "🚗";
      case "booking":
        return "📋";
      default:
        return "🔔";
    }
  };
  return /* @__PURE__ */ jsxDEV("div", { children: [
    /* @__PURE__ */ jsxDEV("div", { style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 16px",
      borderBottom: "1px solid rgba(255,255,255,0.08)"
    }, children: [
      /* @__PURE__ */ jsxDEV("button", { type: "button", onClick: onBack, style: {
        background: "none",
        border: "none",
        color: "inherit",
        cursor: "pointer",
        padding: 4
      }, "aria-label": "Back", children: Icons.back }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
        lineNumber: 92,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("h2", { style: { margin: 0, fontSize: 16, fontWeight: 700, flex: 1 }, children: "Inbox" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
        lineNumber: 97,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
      lineNumber: 88,
      columnNumber: 7
    }, this),
    loading && /* @__PURE__ */ jsxDEV("p", { style: { padding: 20, color: inboxMetaText }, children: "Loading..." }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
      lineNumber: 100,
      columnNumber: 19
    }, this),
    !loading && notifications.length === 0 && /* @__PURE__ */ jsxDEV("div", { style: { textAlign: "center", padding: "60px 20px", color: inboxMetaText }, children: [
      /* @__PURE__ */ jsxDEV("div", { style: { fontSize: 40, marginBottom: 12 }, children: "📭" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
        lineNumber: 104,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { style: { fontWeight: 600, marginBottom: 4 }, children: "No notifications yet" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
        lineNumber: 105,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { style: { fontSize: 13 }, children: "You'll see messages and ride updates here" }, void 0, false, {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
        lineNumber: 106,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
      lineNumber: 103,
      columnNumber: 7
    }, this),
    !loading && notifications.length > 0 && /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", flexDirection: "column" }, children: notifications.map(
      (n) => /* @__PURE__ */ jsxDEV(
        "button",
        {
          type: "button",
          onClick: () => void handleNotificationClick(n),
          style: {
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: "14px 16px",
            background: n.read ? "none" : "rgba(201, 166, 82, 0.16)",
            border: "none",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            cursor: n.link ? "pointer" : "default",
            textAlign: "left",
            color: "inherit",
            width: "100%",
            opacity: 1
          },
          children: [
            /* @__PURE__ */ jsxDEV("div", { style: { fontSize: 22, paddingTop: 2 }, children: typeEmoji(n.type) }, void 0, false, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
              lineNumber: 126,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsxDEV("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                /* @__PURE__ */ jsxDEV("span", { style: { fontWeight: n.read ? 500 : 800, fontSize: 14, color: n.read ? inboxMetaText : "var(--text-primary)" }, children: n.title }, void 0, false, {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
                  lineNumber: 129,
                  columnNumber: 19
                }, this),
                !n.read && /* @__PURE__ */ jsxDEV("span", { style: {
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#3b82f6",
                  display: "inline-block",
                  flexShrink: 0
                } }, void 0, false, {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
                  lineNumber: 131,
                  columnNumber: 15
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
                lineNumber: 128,
                columnNumber: 17
              }, this),
              n.body && /* @__PURE__ */ jsxDEV("div", { style: {
                fontSize: 13,
                color: n.read ? inboxMetaText : "var(--text-primary)",
                marginTop: 2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }, children: n.body }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
                lineNumber: 138,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV("div", { style: { fontSize: 11, color: n.read ? inboxTimeText : "var(--text-primary)", fontWeight: n.read ? 400 : 700, marginTop: 4 }, children: formatTime(n.created_at) }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
                lineNumber: 145,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
              lineNumber: 127,
              columnNumber: 15
            }, this)
          ]
        },
        n.id,
        true,
        {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
          lineNumber: 113,
          columnNumber: 9
        },
        this
      )
    ) }, void 0, false, {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
      lineNumber: 111,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx",
    lineNumber: 87,
    columnNumber: 5
  }, this);
};
_s(InboxPage, "b5Z8U3/R7VRYC3BVdCsp3rDTxkc=");
_c = InboxPage;
export default InboxPage;
var _c;
$RefreshReg$(_c, "InboxPage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/InboxPage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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LHVCQUdFO0FBQUEsbUJBTk47QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFRQTtBQUFBLGNBQ0NSLEVBQUVTLFFBQ0QsdUJBQUMsU0FBSSxPQUFPO0FBQUEsZ0JBQ1ZoQixVQUFVO0FBQUEsZ0JBQUlKLE9BQU9XLEVBQUVuQyxPQUFPbkIsZ0JBQWdCO0FBQUEsZ0JBQXVCZ0UsV0FBVztBQUFBLGdCQUNoRkMsVUFBVTtBQUFBLGdCQUFVQyxjQUFjO0FBQUEsZ0JBQVlDLFlBQVk7QUFBQSxjQUM1RCxHQUNHYixZQUFFUyxRQUpMO0FBQUE7QUFBQTtBQUFBO0FBQUEscUJBS0E7QUFBQSxjQUVGLHVCQUFDLFNBQUksT0FBTyxFQUFFaEIsVUFBVSxJQUFJSixPQUFPVyxFQUFFbkMsT0FBT2xCLGdCQUFnQix1QkFBdUIrQyxZQUFZTSxFQUFFbkMsT0FBTyxNQUFNLEtBQUs2QyxXQUFXLEVBQUUsR0FDN0g1QyxxQkFBV2tDLEVBQUVjLFVBQVUsS0FEMUI7QUFBQTtBQUFBO0FBQUE7QUFBQSxxQkFFQTtBQUFBLGlCQXBCRjtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQXFCQTtBQUFBO0FBQUE7QUFBQSxRQWxDS2QsRUFBRWU7QUFBQUEsUUFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLE1Bb0NBO0FBQUEsSUFDRCxLQXZDSDtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBd0NBO0FBQUEsT0FoRUo7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQWtFQTtBQUVKO0FBQUVoRSxHQXhJSUgsV0FBbUM7QUFBQW9FLEtBQW5DcEU7QUEwSU4sZUFBZUE7QUFBVSxJQUFBb0U7QUFBQUMsYUFBQUQsSUFBQSIsIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJJY29ucyIsImZldGNoTm90aWZpY2F0aW9ucyIsImdldE5vdGlmaWNhdGlvbnMiLCJtYXJrUmVhZEJ5TGluayIsInN1YnNjcmliZSIsImluYm94TWV0YVRleHQiLCJpbmJveFRpbWVUZXh0IiwiSW5ib3hQYWdlIiwib25CYWNrIiwib25OYXZpZ2F0ZSIsIl9zIiwibm90aWZpY2F0aW9ucyIsInNldE5vdGlmaWNhdGlvbnMiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImlzTW91bnRlZCIsInVuc3Vic2NyaWJlIiwiZGF0YSIsImhhbmRsZU5vdGlmaWNhdGlvbkNsaWNrIiwibm90aWZpY2F0aW9uIiwibGluayIsInByZXYiLCJtYXAiLCJpdGVtIiwicmVhZCIsImZvcm1hdFRpbWUiLCJpc28iLCJkIiwiRGF0ZSIsIm5vdyIsImRpZmZNcyIsImdldFRpbWUiLCJkaWZmTWluIiwiTWF0aCIsImZsb29yIiwiZGlmZkhyIiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwiZGF5IiwibW9udGgiLCJ0eXBlRW1vamkiLCJ0eXBlIiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJnYXAiLCJwYWRkaW5nIiwiYm9yZGVyQm90dG9tIiwiYmFja2dyb3VuZCIsImJvcmRlciIsImNvbG9yIiwiY3Vyc29yIiwiYmFjayIsIm1hcmdpbiIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsImZsZXgiLCJsZW5ndGgiLCJ0ZXh0QWxpZ24iLCJtYXJnaW5Cb3R0b20iLCJmbGV4RGlyZWN0aW9uIiwibiIsIndpZHRoIiwib3BhY2l0eSIsInBhZGRpbmdUb3AiLCJtaW5XaWR0aCIsInRpdGxlIiwiaGVpZ2h0IiwiYm9yZGVyUmFkaXVzIiwiZmxleFNocmluayIsImJvZHkiLCJtYXJnaW5Ub3AiLCJvdmVyZmxvdyIsInRleHRPdmVyZmxvdyIsIndoaXRlU3BhY2UiLCJjcmVhdGVkX2F0IiwiaWQiLCJfYyIsIiRSZWZyZXNoUmVnJCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJJbmJveFBhZ2UudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBJY29ucyB9IGZyb20gJy4vQXBwJztcclxuaW1wb3J0IHtcclxuICB0eXBlIE5vdGlmaWNhdGlvbixcclxuICBmZXRjaE5vdGlmaWNhdGlvbnMsXHJcbiAgZ2V0Tm90aWZpY2F0aW9ucyxcclxuICBtYXJrUmVhZEJ5TGluayxcclxuICBzdWJzY3JpYmUsXHJcbn0gZnJvbSAnLi9saWIvbm90aWZpY2F0aW9ucyc7XHJcblxyXG5jb25zdCBpbmJveE1ldGFUZXh0ID0gJ3ZhcigtLXRleHQtbXV0ZWQpJztcclxuY29uc3QgaW5ib3hUaW1lVGV4dCA9ICd2YXIoLS10ZXh0LXN1YnRsZSknO1xyXG5cclxudHlwZSBJbmJveFBhZ2VQcm9wcyA9IHtcclxuICBvbkJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgb25OYXZpZ2F0ZTogKGxpbms6IHN0cmluZykgPT4gdm9pZDtcclxufTtcclxuXHJcbmNvbnN0IEluYm94UGFnZTogUmVhY3QuRkM8SW5ib3hQYWdlUHJvcHM+ID0gKHsgb25CYWNrLCBvbk5hdmlnYXRlIH0pID0+IHtcclxuICBjb25zdCBbbm90aWZpY2F0aW9ucywgc2V0Tm90aWZpY2F0aW9uc10gPSB1c2VTdGF0ZTxOb3RpZmljYXRpb25bXT4oW10pO1xyXG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgbGV0IGlzTW91bnRlZCA9IHRydWU7XHJcblxyXG4gICAgc2V0Tm90aWZpY2F0aW9ucyhnZXROb3RpZmljYXRpb25zKCkpO1xyXG5cclxuICAgIGNvbnN0IHVuc3Vic2NyaWJlID0gc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgaWYgKGlzTW91bnRlZCkge1xyXG4gICAgICAgIHNldE5vdGlmaWNhdGlvbnMoZ2V0Tm90aWZpY2F0aW9ucygpKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgZmV0Y2hOb3RpZmljYXRpb25zKCk7XHJcbiAgICAgICAgaWYgKCFpc01vdW50ZWQpIHJldHVybjtcclxuICAgICAgICBzZXROb3RpZmljYXRpb25zKGRhdGEpO1xyXG4gICAgICB9IGZpbmFsbHkge1xyXG4gICAgICAgIGlmIChpc01vdW50ZWQpIHtcclxuICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSkoKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICBpc01vdW50ZWQgPSBmYWxzZTtcclxuICAgICAgdW5zdWJzY3JpYmUoKTtcclxuICAgIH07XHJcbiAgfSwgW10pO1xyXG5cclxuICBjb25zdCBoYW5kbGVOb3RpZmljYXRpb25DbGljayA9IGFzeW5jIChub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbikgPT4ge1xyXG4gICAgaWYgKG5vdGlmaWNhdGlvbi5saW5rKSB7XHJcbiAgICAgIGF3YWl0IG1hcmtSZWFkQnlMaW5rKG5vdGlmaWNhdGlvbi5saW5rKTtcclxuICAgICAgc2V0Tm90aWZpY2F0aW9ucygocHJldikgPT5cclxuICAgICAgICBwcmV2Lm1hcCgoaXRlbSkgPT5cclxuICAgICAgICAgIGl0ZW0ubGluayA9PT0gbm90aWZpY2F0aW9uLmxpbmsgPyB7IC4uLml0ZW0sIHJlYWQ6IHRydWUgfSA6IGl0ZW0sXHJcbiAgICAgICAgKSxcclxuICAgICAgKTtcclxuICAgICAgb25OYXZpZ2F0ZShub3RpZmljYXRpb24ubGluayk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZm9ybWF0VGltZSA9IChpc286IHN0cmluZykgPT4ge1xyXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKGlzbyk7XHJcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgZGlmZk1zID0gbm93LmdldFRpbWUoKSAtIGQuZ2V0VGltZSgpO1xyXG4gICAgY29uc3QgZGlmZk1pbiA9IE1hdGguZmxvb3IoZGlmZk1zIC8gNjAwMDApO1xyXG4gICAgaWYgKGRpZmZNaW4gPCAxKSByZXR1cm4gJ0p1c3Qgbm93JztcclxuICAgIGlmIChkaWZmTWluIDwgNjApIHJldHVybiBgJHtkaWZmTWlufW0gYWdvYDtcclxuICAgIGNvbnN0IGRpZmZIciA9IE1hdGguZmxvb3IoZGlmZk1pbiAvIDYwKTtcclxuICAgIGlmIChkaWZmSHIgPCAyNCkgcmV0dXJuIGAke2RpZmZIcn1oIGFnb2A7XHJcbiAgICByZXR1cm4gZC50b0xvY2FsZURhdGVTdHJpbmcoJ2VuLUdCJywgeyBkYXk6ICdudW1lcmljJywgbW9udGg6ICdzaG9ydCcgfSk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgdHlwZUVtb2ppID0gKHR5cGU6IHN0cmluZykgPT4ge1xyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgJ2NoYXQnOiByZXR1cm4gJ/CfkqwnO1xyXG4gICAgICBjYXNlICdyaWRlJzogcmV0dXJuICfwn5qXJztcclxuICAgICAgY2FzZSAnYm9va2luZyc6IHJldHVybiAn8J+Tiyc7XHJcbiAgICAgIGRlZmF1bHQ6IHJldHVybiAn8J+UlCc7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxkaXYgc3R5bGU9e3tcclxuICAgICAgICBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6IDgsIHBhZGRpbmc6ICcxMnB4IDE2cHgnLFxyXG4gICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMDgpJyxcclxuICAgICAgfX0+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17b25CYWNrfSBzdHlsZT17e1xyXG4gICAgICAgICAgYmFja2dyb3VuZDogJ25vbmUnLCBib3JkZXI6ICdub25lJywgY29sb3I6ICdpbmhlcml0JywgY3Vyc29yOiAncG9pbnRlcicsIHBhZGRpbmc6IDQsXHJcbiAgICAgICAgfX0gYXJpYS1sYWJlbD1cIkJhY2tcIj5cclxuICAgICAgICAgIHtJY29ucy5iYWNrfVxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDxoMiBzdHlsZT17eyBtYXJnaW46IDAsIGZvbnRTaXplOiAxNiwgZm9udFdlaWdodDogNzAwLCBmbGV4OiAxIH19PkluYm94PC9oMj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7bG9hZGluZyAmJiA8cCBzdHlsZT17eyBwYWRkaW5nOiAyMCwgY29sb3I6IGluYm94TWV0YVRleHQgfX0+TG9hZGluZy4uLjwvcD59XHJcblxyXG4gICAgICB7IWxvYWRpbmcgJiYgbm90aWZpY2F0aW9ucy5sZW5ndGggPT09IDAgJiYgKFxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJywgcGFkZGluZzogJzYwcHggMjBweCcsIGNvbG9yOiBpbmJveE1ldGFUZXh0IH19PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogNDAsIG1hcmdpbkJvdHRvbTogMTIgfX0+8J+TrTwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250V2VpZ2h0OiA2MDAsIG1hcmdpbkJvdHRvbTogNCB9fT5ObyBub3RpZmljYXRpb25zIHlldDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogMTMgfX0+WW91J2xsIHNlZSBtZXNzYWdlcyBhbmQgcmlkZSB1cGRhdGVzIGhlcmU8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIHshbG9hZGluZyAmJiBub3RpZmljYXRpb25zLmxlbmd0aCA+IDAgJiYgKFxyXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyB9fT5cclxuICAgICAgICAgIHtub3RpZmljYXRpb25zLm1hcCgobikgPT4gKFxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAga2V5PXtuLmlkfVxyXG4gICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHZvaWQgaGFuZGxlTm90aWZpY2F0aW9uQ2xpY2sobil9XHJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2ZsZXgtc3RhcnQnLCBnYXA6IDEyLFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzE0cHggMTZweCcsIGJhY2tncm91bmQ6IG4ucmVhZCA/ICdub25lJyA6ICdyZ2JhKDIwMSwgMTY2LCA4MiwgMC4xNiknLCBib3JkZXI6ICdub25lJyxcclxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMDYpJyxcclxuICAgICAgICAgICAgICAgIGN1cnNvcjogbi5saW5rID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnLCB0ZXh0QWxpZ246ICdsZWZ0JyxcclxuICAgICAgICAgICAgICAgIGNvbG9yOiAnaW5oZXJpdCcsIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTaXplOiAyMiwgcGFkZGluZ1RvcDogMiB9fT57dHlwZUVtb2ppKG4udHlwZSl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBtaW5XaWR0aDogMCB9fT5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiA2IH19PlxyXG4gICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiBuLnJlYWQgPyA1MDAgOiA4MDAsIGZvbnRTaXplOiAxNCwgY29sb3I6IG4ucmVhZCA/IGluYm94TWV0YVRleHQgOiAndmFyKC0tdGV4dC1wcmltYXJ5KScgfX0+e24udGl0bGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICB7IW4ucmVhZCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiA3LCBoZWlnaHQ6IDcsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmQ6ICcjM2I4MmY2JyxcclxuICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBmbGV4U2hyaW5rOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIH19IC8+XHJcbiAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIHtuLmJvZHkgJiYgKFxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEzLCBjb2xvcjogbi5yZWFkID8gaW5ib3hNZXRhVGV4dCA6ICd2YXIoLS10ZXh0LXByaW1hcnkpJywgbWFyZ2luVG9wOiAyLFxyXG4gICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJywgdGV4dE92ZXJmbG93OiAnZWxsaXBzaXMnLCB3aGl0ZVNwYWNlOiAnbm93cmFwJyxcclxuICAgICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAge24uYm9keX1cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogMTEsIGNvbG9yOiBuLnJlYWQgPyBpbmJveFRpbWVUZXh0IDogJ3ZhcigtLXRleHQtcHJpbWFyeSknLCBmb250V2VpZ2h0OiBuLnJlYWQgPyA0MDAgOiA3MDAsIG1hcmdpblRvcDogNCB9fT5cclxuICAgICAgICAgICAgICAgICAge2Zvcm1hdFRpbWUobi5jcmVhdGVkX2F0KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICkpfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEluYm94UGFnZTtcclxuIl0sImZpbGUiOiJDOi9Vc2Vycy95bGFubi92c2NvZGUvVW5pL1NhbXVkaHlhblJpZGVzL2Zyb250ZW5kL3NyYy9JbmJveFBhZ2UudHN4In0=