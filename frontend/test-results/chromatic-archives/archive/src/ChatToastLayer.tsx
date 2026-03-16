import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/ChatToastLayer.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=b8f2434d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=b8f2434d"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useEffect = __vite__cjsImport1_react["useEffect"]; const useEffectEvent = __vite__cjsImport1_react["useEffectEvent"];
const AUTO_DISMISS_MS = 5e3;
const ChatToastItem = ({ toast, onOpen, onDismiss }) => {
  _s();
  const handleAutoDismiss = useEffectEvent(() => {
    onDismiss(toast.id);
  });
  useEffect(() => {
    const timer = window.setTimeout(() => {
      handleAutoDismiss();
    }, AUTO_DISMISS_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [toast.id, handleAutoDismiss]);
  return /* @__PURE__ */ jsxDEV(
    "button",
    {
      type: "button",
      className: "chat-toast-card",
      onClick: () => onOpen(toast),
      "aria-label": `Open chat from ${toast.senderName}`,
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "chat-toast-kicker", children: "New message" }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatToastLayer.tsx",
          lineNumber: 44,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "chat-toast-sender", children: toast.senderName }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatToastLayer.tsx",
          lineNumber: 45,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "chat-toast-preview", children: toast.preview }, void 0, false, {
          fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatToastLayer.tsx",
          lineNumber: 46,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatToastLayer.tsx",
      lineNumber: 38,
      columnNumber: 5
    },
    this
  );
};
_s(ChatToastItem, "exdVom0plgb6h0JK6fbDiDe58Z0=", false, function() {
  return [useEffectEvent];
});
_c = ChatToastItem;
const ChatToastLayer = ({ toasts, onOpen, onDismiss }) => {
  if (toasts.length === 0) return null;
  return /* @__PURE__ */ jsxDEV("div", { className: "chat-toast-layer", "aria-live": "polite", "aria-atomic": "false", children: toasts.map(
    (toast) => /* @__PURE__ */ jsxDEV(
      ChatToastItem,
      {
        toast,
        onOpen,
        onDismiss
      },
      toast.id,
      false,
      {
        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatToastLayer.tsx",
        lineNumber: 57,
        columnNumber: 7
      },
      this
    )
  ) }, void 0, false, {
    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatToastLayer.tsx",
    lineNumber: 55,
    columnNumber: 5
  }, this);
};
_c2 = ChatToastLayer;
export default ChatToastLayer;
var _c, _c2;
$RefreshReg$(_c, "ChatToastItem");
$RefreshReg$(_c2, "ChatToastLayer");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatToastLayer.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatToastLayer.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatToastLayer.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBMkNNOztBQTNDTixPQUFPQSxTQUFTQyxXQUFXQyxzQkFBc0I7QUFlakQsTUFBTUMsa0JBQWtCO0FBRXhCLE1BQU1DLGdCQUlEQSxDQUFDLEVBQUVDLE9BQU9DLFFBQVFDLFVBQVUsTUFBTTtBQUFBQyxLQUFBO0FBQ3JDLFFBQU1DLG9CQUFvQlAsZUFBZSxNQUFNO0FBQzdDSyxjQUFVRixNQUFNSyxFQUFFO0FBQUEsRUFDcEIsQ0FBQztBQUVEVCxZQUFVLE1BQU07QUFDZCxVQUFNVSxRQUFRQyxPQUFPQyxXQUFXLE1BQU07QUFDcENKLHdCQUFrQjtBQUFBLElBQ3BCLEdBQUdOLGVBQWU7QUFFbEIsV0FBTyxNQUFNO0FBQ1hTLGFBQU9FLGFBQWFILEtBQUs7QUFBQSxJQUMzQjtBQUFBLEVBQ0YsR0FBRyxDQUFDTixNQUFNSyxJQUFJRCxpQkFBaUIsQ0FBQztBQUVoQyxTQUNFO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFDQyxNQUFLO0FBQUEsTUFDTCxXQUFVO0FBQUEsTUFDVixTQUFTLE1BQU1ILE9BQU9ELEtBQUs7QUFBQSxNQUMzQixjQUFZLGtCQUFrQkEsTUFBTVUsVUFBVTtBQUFBLE1BRTlDO0FBQUEsK0JBQUMsU0FBSSxXQUFVLHFCQUFvQiwyQkFBbkM7QUFBQTtBQUFBO0FBQUE7QUFBQSxlQUE4QztBQUFBLFFBQzlDLHVCQUFDLFNBQUksV0FBVSxxQkFBcUJWLGdCQUFNVSxjQUExQztBQUFBO0FBQUE7QUFBQTtBQUFBLGVBQXFEO0FBQUEsUUFDckQsdUJBQUMsU0FBSSxXQUFVLHNCQUFzQlYsZ0JBQU1XLFdBQTNDO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFBbUQ7QUFBQTtBQUFBO0FBQUEsSUFSckQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBU0E7QUFFSjtBQUFFUixHQS9CSUosZUFJSjtBQUFBLFVBQzBCRixjQUFjO0FBQUE7QUFBQWUsS0FMcENiO0FBaUNOLE1BQU1jLGlCQUFnREEsQ0FBQyxFQUFFQyxRQUFRYixRQUFRQyxVQUFVLE1BQU07QUFDdkYsTUFBSVksT0FBT0MsV0FBVyxFQUFHLFFBQU87QUFFaEMsU0FDRSx1QkFBQyxTQUFJLFdBQVUsb0JBQW1CLGFBQVUsVUFBUyxlQUFZLFNBQzlERCxpQkFBT0U7QUFBQUEsSUFBSSxDQUFDaEIsVUFDWDtBQUFBLE1BQUM7QUFBQTtBQUFBLFFBRUM7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBO0FBQUEsTUFIS0EsTUFBTUs7QUFBQUEsTUFEYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSXVCO0FBQUEsRUFFeEIsS0FSSDtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBU0E7QUFFSjtBQUFFWSxNQWZJSjtBQWlCTixlQUFlQTtBQUFlLElBQUFELElBQUFLO0FBQUFDLGFBQUFOLElBQUE7QUFBQU0sYUFBQUQsS0FBQSIsIm5hbWVzIjpbIlJlYWN0IiwidXNlRWZmZWN0IiwidXNlRWZmZWN0RXZlbnQiLCJBVVRPX0RJU01JU1NfTVMiLCJDaGF0VG9hc3RJdGVtIiwidG9hc3QiLCJvbk9wZW4iLCJvbkRpc21pc3MiLCJfcyIsImhhbmRsZUF1dG9EaXNtaXNzIiwiaWQiLCJ0aW1lciIsIndpbmRvdyIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJzZW5kZXJOYW1lIiwicHJldmlldyIsIl9jIiwiQ2hhdFRvYXN0TGF5ZXIiLCJ0b2FzdHMiLCJsZW5ndGgiLCJtYXAiLCJfYzIiLCIkUmVmcmVzaFJlZyQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsiQ2hhdFRvYXN0TGF5ZXIudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZUVmZmVjdEV2ZW50IH0gZnJvbSAncmVhY3QnO1xyXG5cclxuZXhwb3J0IHR5cGUgQ2hhdFRvYXN0ID0ge1xyXG4gIGlkOiBzdHJpbmc7XHJcbiAgc2VuZGVyTmFtZTogc3RyaW5nO1xyXG4gIHByZXZpZXc6IHN0cmluZztcclxuICBsaW5rOiBzdHJpbmc7XHJcbn07XHJcblxyXG50eXBlIENoYXRUb2FzdExheWVyUHJvcHMgPSB7XHJcbiAgdG9hc3RzOiBDaGF0VG9hc3RbXTtcclxuICBvbk9wZW46ICh0b2FzdDogQ2hhdFRvYXN0KSA9PiB2b2lkO1xyXG4gIG9uRGlzbWlzczogKHRvYXN0SWQ6IHN0cmluZykgPT4gdm9pZDtcclxufTtcclxuXHJcbmNvbnN0IEFVVE9fRElTTUlTU19NUyA9IDUwMDA7XHJcblxyXG5jb25zdCBDaGF0VG9hc3RJdGVtOiBSZWFjdC5GQzx7XHJcbiAgdG9hc3Q6IENoYXRUb2FzdDtcclxuICBvbk9wZW46ICh0b2FzdDogQ2hhdFRvYXN0KSA9PiB2b2lkO1xyXG4gIG9uRGlzbWlzczogKHRvYXN0SWQ6IHN0cmluZykgPT4gdm9pZDtcclxufT4gPSAoeyB0b2FzdCwgb25PcGVuLCBvbkRpc21pc3MgfSkgPT4ge1xyXG4gIGNvbnN0IGhhbmRsZUF1dG9EaXNtaXNzID0gdXNlRWZmZWN0RXZlbnQoKCkgPT4ge1xyXG4gICAgb25EaXNtaXNzKHRvYXN0LmlkKTtcclxuICB9KTtcclxuXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGNvbnN0IHRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBoYW5kbGVBdXRvRGlzbWlzcygpO1xyXG4gICAgfSwgQVVUT19ESVNNSVNTX01TKTtcclxuXHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgIH07XHJcbiAgfSwgW3RvYXN0LmlkLCBoYW5kbGVBdXRvRGlzbWlzc10pO1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGJ1dHRvblxyXG4gICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgY2xhc3NOYW1lPVwiY2hhdC10b2FzdC1jYXJkXCJcclxuICAgICAgb25DbGljaz17KCkgPT4gb25PcGVuKHRvYXN0KX1cclxuICAgICAgYXJpYS1sYWJlbD17YE9wZW4gY2hhdCBmcm9tICR7dG9hc3Quc2VuZGVyTmFtZX1gfVxyXG4gICAgPlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYXQtdG9hc3Qta2lja2VyXCI+TmV3IG1lc3NhZ2U8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjaGF0LXRvYXN0LXNlbmRlclwiPnt0b2FzdC5zZW5kZXJOYW1lfTwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoYXQtdG9hc3QtcHJldmlld1wiPnt0b2FzdC5wcmV2aWV3fTwvZGl2PlxyXG4gICAgPC9idXR0b24+XHJcbiAgKTtcclxufTtcclxuXHJcbmNvbnN0IENoYXRUb2FzdExheWVyOiBSZWFjdC5GQzxDaGF0VG9hc3RMYXllclByb3BzPiA9ICh7IHRvYXN0cywgb25PcGVuLCBvbkRpc21pc3MgfSkgPT4ge1xyXG4gIGlmICh0b2FzdHMubGVuZ3RoID09PSAwKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2hhdC10b2FzdC1sYXllclwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiIGFyaWEtYXRvbWljPVwiZmFsc2VcIj5cclxuICAgICAge3RvYXN0cy5tYXAoKHRvYXN0KSA9PiAoXHJcbiAgICAgICAgPENoYXRUb2FzdEl0ZW1cclxuICAgICAgICAgIGtleT17dG9hc3QuaWR9XHJcbiAgICAgICAgICB0b2FzdD17dG9hc3R9XHJcbiAgICAgICAgICBvbk9wZW49e29uT3Blbn1cclxuICAgICAgICAgIG9uRGlzbWlzcz17b25EaXNtaXNzfVxyXG4gICAgICAgIC8+XHJcbiAgICAgICkpfVxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IENoYXRUb2FzdExheWVyO1xyXG4iXSwiZmlsZSI6IkM6L1VzZXJzL3lsYW5uL3ZzY29kZS9VbmkvU2FtdWRoeWFuUmlkZXMvZnJvbnRlbmQvc3JjL0NoYXRUb2FzdExheWVyLnRzeCJ9