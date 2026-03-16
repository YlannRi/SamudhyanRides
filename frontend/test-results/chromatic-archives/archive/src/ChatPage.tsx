import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/ChatPage.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=c85c9c72"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=c85c9c72"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react; const useEffect = __vite__cjsImport1_react["useEffect"]; const useRef = __vite__cjsImport1_react["useRef"]; const useState = __vite__cjsImport1_react["useState"];
import { apiFetch, buildWebSocketUrl } from "/src/lib/api.ts";
import { getAuthToken } from "/src/lib/authToken.ts";
import { buildChatPath } from "/src/lib/chatRoutes.ts";
import { Icons } from "/src/App.tsx";
const ChatPage = ({ rideId, participantId, onBack }) => {
  _s();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const chatQuery = participantId ? `?participant_id=${encodeURIComponent(participantId)}` : "";
  const chatLink = buildChatPath(rideId, participantId);
  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch("users/me", { method: "GET" });
        if (data && data.length > 0) {
          setCurrentUserId(data[0].id);
        }
      } catch {
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const history = await apiFetch(`rides/${rideId}/chat${chatQuery}`, { method: "GET" });
        setMessages(history || []);
      } catch {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [rideId, chatQuery]);
  useEffect(() => {
    apiFetch("notifications/read-by-link?link=" + encodeURIComponent(chatLink), {
      method: "PUT"
    }).catch(() => {
    });
  }, [chatLink]);
  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    const participantQuery = participantId ? `&participant_id=${encodeURIComponent(participantId)}` : "";
    const wsUrl = buildWebSocketUrl(
      `/rides/ws/rides/${rideId}?token=${encodeURIComponent(token)}${participantQuery}`
    );
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      } catch {
      }
    };
    ws.onerror = () => {
    };
    ws.onclose = () => {
    };
    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [rideId, participantId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message: text }));
    } else {
      try {
        const msg = await apiFetch(`rides/${rideId}/chat/message${chatQuery}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text })
        });
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      } catch {
        setInput(text);
      }
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };
  const shellWidth = 480;
  const bottomNavHeight = 56;
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      style: {
        position: "fixed",
        top: 0,
        bottom: bottomNavHeight,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: shellWidth,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-main, #333232)",
        textAlign: "left",
        zIndex: 19
      },
      children: [
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            style: {
              flexShrink: 0,
              background: "var(--color-bg, #181a20)",
              borderBottom: "1px solid rgba(255,255,255,0.08)"
            },
            children: /* @__PURE__ */ jsxDEV(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 16px",
                  minHeight: 56
                },
                children: [
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      type: "button",
                      onClick: onBack,
                      style: {
                        background: "none",
                        border: "none",
                        color: "inherit",
                        cursor: "pointer",
                        padding: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      },
                      "aria-label": "Back",
                      children: Icons.back
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                      lineNumber: 184,
                      columnNumber: 9
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV("h2", { style: { margin: 0, fontSize: 16, fontWeight: 700 }, children: "Ride Chat" }, void 0, false, {
                    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                    lineNumber: 202,
                    columnNumber: 9
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                lineNumber: 175,
                columnNumber: 7
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
            lineNumber: 168,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            style: {
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              padding: "14px 16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 10
            },
            children: [
              loading && /* @__PURE__ */ jsxDEV("p", { style: { color: "rgba(255,255,255,0.5)", textAlign: "center" }, children: "Loading messages..." }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                lineNumber: 218,
                columnNumber: 9
              }, this),
              !loading && messages.length === 0 && /* @__PURE__ */ jsxDEV(
                "p",
                {
                  style: {
                    color: "rgba(255,255,255,0.4)",
                    textAlign: "center",
                    marginTop: 40
                  },
                  children: "No messages yet. Say hello!"
                },
                void 0,
                false,
                {
                  fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                  lineNumber: 224,
                  columnNumber: 9
                },
                this
              ),
              messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                return /* @__PURE__ */ jsxDEV(
                  "div",
                  {
                    style: {
                      display: "flex",
                      justifyContent: isMe ? "flex-end" : "flex-start",
                      width: "100%"
                    },
                    children: /* @__PURE__ */ jsxDEV(
                      "div",
                      {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          alignItems: isMe ? "flex-end" : "flex-start",
                          maxWidth: "78%",
                          gap: 4
                        },
                        children: [
                          !isMe && /* @__PURE__ */ jsxDEV(
                            "span",
                            {
                              style: {
                                fontSize: 11,
                                color: "rgba(255,255,255,0.45)",
                                marginLeft: 4,
                                textAlign: "left"
                              },
                              children: msg.sender_name
                            },
                            void 0,
                            false,
                            {
                              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                              lineNumber: 256,
                              columnNumber: 17
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDEV(
                            "div",
                            {
                              style: {
                                background: isMe ? "#3b82f6" : "rgba(255,255,255,0.1)",
                                color: "#fff",
                                padding: "8px 14px",
                                borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                fontSize: 14,
                                lineHeight: 1.4,
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                                textAlign: "left"
                              },
                              children: msg.message
                            },
                            void 0,
                            false,
                            {
                              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                              lineNumber: 268,
                              columnNumber: 15
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDEV(
                            "span",
                            {
                              style: {
                                fontSize: 10,
                                color: "rgba(255,255,255,0.3)",
                                marginRight: isMe ? 4 : 0,
                                marginLeft: isMe ? 0 : 4,
                                textAlign: isMe ? "right" : "left"
                              },
                              children: formatTime(msg.created_at)
                            },
                            void 0,
                            false,
                            {
                              fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                              lineNumber: 284,
                              columnNumber: 15
                            },
                            this
                          )
                        ]
                      },
                      void 0,
                      true,
                      {
                        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                        lineNumber: 246,
                        columnNumber: 13
                      },
                      this
                    )
                  },
                  msg.id,
                  false,
                  {
                    fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                    lineNumber: 238,
                    columnNumber: 13
                  },
                  this
                );
              }),
              /* @__PURE__ */ jsxDEV("div", { ref: messagesEndRef }, void 0, false, {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                lineNumber: 300,
                columnNumber: 7
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
            lineNumber: 206,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            style: {
              flexShrink: 0,
              background: "var(--color-bg, #181a20)",
              borderTop: "1px solid rgba(255,255,255,0.08)"
            },
            children: /* @__PURE__ */ jsxDEV(
              "div",
              {
                style: {
                  display: "flex",
                  gap: 8,
                  padding: "10px 16px 12px",
                  alignItems: "center"
                },
                children: [
                  /* @__PURE__ */ jsxDEV(
                    "input",
                    {
                      type: "text",
                      value: input,
                      onChange: (e) => setInput(e.target.value),
                      onKeyDown: handleKeyDown,
                      placeholder: "Type a message...",
                      style: {
                        flex: 1,
                        background: "rgba(255,255,255,0.08)",
                        border: "none",
                        borderRadius: 20,
                        padding: "10px 16px",
                        color: "#fff",
                        fontSize: 14,
                        outline: "none"
                      }
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                      lineNumber: 318,
                      columnNumber: 9
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV(
                    "button",
                    {
                      type: "button",
                      onClick: sendMessage,
                      disabled: !input.trim(),
                      style: {
                        background: input.trim() ? "#3b82f6" : "rgba(255,255,255,0.1)",
                        border: "none",
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: input.trim() ? "pointer" : "default",
                        color: "#fff",
                        transition: "background 0.2s",
                        flexShrink: 0
                      },
                      "aria-label": "Send message",
                      children: /* @__PURE__ */ jsxDEV("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsxDEV("path", { d: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" }, void 0, false, {
                        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                        lineNumber: 357,
                        columnNumber: 13
                      }, this) }, void 0, false, {
                        fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                        lineNumber: 356,
                        columnNumber: 11
                      }, this)
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                      lineNumber: 336,
                      columnNumber: 9
                    },
                    this
                  )
                ]
              },
              void 0,
              true,
              {
                fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
                lineNumber: 310,
                columnNumber: 7
              },
              this
            )
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
            lineNumber: 303,
            columnNumber: 7
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx",
      lineNumber: 152,
      columnNumber: 5
    },
    this
  );
};
_s(ChatPage, "ekQunLL5btlw/ZtNsZv7K9DqAOs=");
_c = ChatPage;
export default ChatPage;
var _c;
$RefreshReg$(_c, "ChatPage");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/ylann/vscode/Uni/SamudhyanRides/frontend/src/ChatPage.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFrREE7QUFBQTtBQUFBLFVBekRBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQTBEQTtBQUFBO0FBQUE7QUFBQSxJQWpORjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFrTkE7QUFFSjtBQUFFM0UsR0F0VklKLFVBQWlDO0FBQUFpSCxLQUFqQ2pIO0FBd1ZOLGVBQWVBO0FBQVMsSUFBQWlIO0FBQUFDLGFBQUFELElBQUEiLCJuYW1lcyI6WyJSZWFjdCIsInVzZUVmZmVjdCIsInVzZVJlZiIsInVzZVN0YXRlIiwiYXBpRmV0Y2giLCJidWlsZFdlYlNvY2tldFVybCIsImdldEF1dGhUb2tlbiIsImJ1aWxkQ2hhdFBhdGgiLCJJY29ucyIsIkNoYXRQYWdlIiwicmlkZUlkIiwicGFydGljaXBhbnRJZCIsIm9uQmFjayIsIl9zIiwibWVzc2FnZXMiLCJzZXRNZXNzYWdlcyIsImlucHV0Iiwic2V0SW5wdXQiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImN1cnJlbnRVc2VySWQiLCJzZXRDdXJyZW50VXNlcklkIiwibWVzc2FnZXNFbmRSZWYiLCJ3c1JlZiIsImNoYXRRdWVyeSIsImVuY29kZVVSSUNvbXBvbmVudCIsImNoYXRMaW5rIiwiZGF0YSIsIm1ldGhvZCIsImxlbmd0aCIsImlkIiwiaGlzdG9yeSIsImNhdGNoIiwidG9rZW4iLCJwYXJ0aWNpcGFudFF1ZXJ5Iiwid3NVcmwiLCJ3cyIsIldlYlNvY2tldCIsImN1cnJlbnQiLCJvbm1lc3NhZ2UiLCJldmVudCIsIm1zZyIsIkpTT04iLCJwYXJzZSIsInByZXYiLCJzb21lIiwibSIsIm9uZXJyb3IiLCJvbmNsb3NlIiwiY2xvc2UiLCJzY3JvbGxJbnRvVmlldyIsImJlaGF2aW9yIiwic2VuZE1lc3NhZ2UiLCJ0ZXh0IiwidHJpbSIsInJlYWR5U3RhdGUiLCJPUEVOIiwic2VuZCIsInN0cmluZ2lmeSIsIm1lc3NhZ2UiLCJoZWFkZXJzIiwiYm9keSIsImhhbmRsZUtleURvd24iLCJlIiwia2V5Iiwic2hpZnRLZXkiLCJwcmV2ZW50RGVmYXVsdCIsImZvcm1hdFRpbWUiLCJpc28iLCJkIiwiRGF0ZSIsInRvTG9jYWxlVGltZVN0cmluZyIsImhvdXIiLCJtaW51dGUiLCJzaGVsbFdpZHRoIiwiYm90dG9tTmF2SGVpZ2h0IiwicG9zaXRpb24iLCJ0b3AiLCJib3R0b20iLCJsZWZ0IiwidHJhbnNmb3JtIiwid2lkdGgiLCJtYXhXaWR0aCIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwiYmFja2dyb3VuZCIsInRleHRBbGlnbiIsInpJbmRleCIsImZsZXhTaHJpbmsiLCJib3JkZXJCb3R0b20iLCJhbGlnbkl0ZW1zIiwiZ2FwIiwicGFkZGluZyIsIm1pbkhlaWdodCIsImJvcmRlciIsImNvbG9yIiwiY3Vyc29yIiwianVzdGlmeUNvbnRlbnQiLCJiYWNrIiwibWFyZ2luIiwiZm9udFNpemUiLCJmb250V2VpZ2h0IiwiZmxleCIsIm92ZXJmbG93WSIsIm1hcmdpblRvcCIsIm1hcCIsImlzTWUiLCJzZW5kZXJfaWQiLCJtYXJnaW5MZWZ0Iiwic2VuZGVyX25hbWUiLCJib3JkZXJSYWRpdXMiLCJsaW5lSGVpZ2h0Iiwid29yZEJyZWFrIiwid2hpdGVTcGFjZSIsIm1hcmdpblJpZ2h0IiwiY3JlYXRlZF9hdCIsImJvcmRlclRvcCIsInRhcmdldCIsInZhbHVlIiwib3V0bGluZSIsImhlaWdodCIsInRyYW5zaXRpb24iLCJfYyIsIiRSZWZyZXNoUmVnJCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJDaGF0UGFnZS50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgYXBpRmV0Y2gsIGJ1aWxkV2ViU29ja2V0VXJsIH0gZnJvbSAnLi9saWIvYXBpJztcclxuaW1wb3J0IHsgZ2V0QXV0aFRva2VuIH0gZnJvbSAnLi9saWIvYXV0aFRva2VuJztcclxuaW1wb3J0IHsgYnVpbGRDaGF0UGF0aCB9IGZyb20gJy4vbGliL2NoYXRSb3V0ZXMnO1xyXG5pbXBvcnQgeyBJY29ucyB9IGZyb20gJy4vQXBwJztcclxuXHJcbnR5cGUgQ2hhdE1lc3NhZ2UgPSB7XHJcbiAgaWQ6IHN0cmluZztcclxuICBzZW5kZXJfaWQ6IHN0cmluZztcclxuICBzZW5kZXJfbmFtZTogc3RyaW5nO1xyXG4gIG1lc3NhZ2U6IHN0cmluZztcclxuICBjcmVhdGVkX2F0OiBzdHJpbmc7XHJcbiAgcmVhZDogYm9vbGVhbjtcclxufTtcclxuXHJcbnR5cGUgQ2hhdFBhZ2VQcm9wcyA9IHtcclxuICByaWRlSWQ6IHN0cmluZztcclxuICBwYXJ0aWNpcGFudElkPzogc3RyaW5nO1xyXG4gIG9uQmFjazogKCkgPT4gdm9pZDtcclxufTtcclxuXHJcbmNvbnN0IENoYXRQYWdlOiBSZWFjdC5GQzxDaGF0UGFnZVByb3BzPiA9ICh7IHJpZGVJZCwgcGFydGljaXBhbnRJZCwgb25CYWNrIH0pID0+IHtcclxuICBjb25zdCBbbWVzc2FnZXMsIHNldE1lc3NhZ2VzXSA9IHVzZVN0YXRlPENoYXRNZXNzYWdlW10+KFtdKTtcclxuICBjb25zdCBbaW5wdXQsIHNldElucHV0XSA9IHVzZVN0YXRlKCcnKTtcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICBjb25zdCBbY3VycmVudFVzZXJJZCwgc2V0Q3VycmVudFVzZXJJZF0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKTtcclxuICBjb25zdCBtZXNzYWdlc0VuZFJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XHJcbiAgY29uc3Qgd3NSZWYgPSB1c2VSZWY8V2ViU29ja2V0IHwgbnVsbD4obnVsbCk7XHJcbiAgY29uc3QgY2hhdFF1ZXJ5ID0gcGFydGljaXBhbnRJZCA/IGA/cGFydGljaXBhbnRfaWQ9JHtlbmNvZGVVUklDb21wb25lbnQocGFydGljaXBhbnRJZCl9YCA6ICcnO1xyXG4gIGNvbnN0IGNoYXRMaW5rID0gYnVpbGRDaGF0UGF0aChyaWRlSWQsIHBhcnRpY2lwYW50SWQpO1xyXG5cclxuICAvLyBSZXNvbHZlIGN1cnJlbnQgdXNlcidzIHByb2ZpbGVfaWRcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgYXBpRmV0Y2g8YW55PigndXNlcnMvbWUnLCB7IG1ldGhvZDogJ0dFVCcgfSk7XHJcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBzZXRDdXJyZW50VXNlcklkKGRhdGFbMF0uaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgLy8gaWdub3JlXHJcbiAgICAgIH1cclxuICAgIH0pKCk7XHJcbiAgfSwgW10pO1xyXG5cclxuICAvLyBGZXRjaCBtZXNzYWdlIGhpc3RvcnlcclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgKGFzeW5jICgpID0+IHtcclxuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBoaXN0b3J5ID0gYXdhaXQgYXBpRmV0Y2g8Q2hhdE1lc3NhZ2VbXT4oYHJpZGVzLyR7cmlkZUlkfS9jaGF0JHtjaGF0UXVlcnl9YCwgeyBtZXRob2Q6ICdHRVQnIH0pO1xyXG4gICAgICAgIHNldE1lc3NhZ2VzKGhpc3RvcnkgfHwgW10pO1xyXG4gICAgICB9IGNhdGNoIHtcclxuICAgICAgICAvLyBubyBjaGF0IHlldFxyXG4gICAgICAgIHNldE1lc3NhZ2VzKFtdKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfSkoKTtcclxuICB9LCBbcmlkZUlkLCBjaGF0UXVlcnldKTtcclxuXHJcbiAgLy8gTWFyayBub3RpZmljYXRpb25zIGZvciB0aGlzIGNoYXQgYXMgcmVhZFxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBhcGlGZXRjaCgnbm90aWZpY2F0aW9ucy9yZWFkLWJ5LWxpbms/bGluaz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGNoYXRMaW5rKSwge1xyXG4gICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgfSkuY2F0Y2goKCkgPT4ge30pO1xyXG4gIH0sIFtjaGF0TGlua10pO1xyXG5cclxuICAvLyBXZWJTb2NrZXQgY29ubmVjdGlvblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCB0b2tlbiA9IGdldEF1dGhUb2tlbigpO1xyXG4gICAgaWYgKCF0b2tlbikgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHBhcnRpY2lwYW50UXVlcnkgPSBwYXJ0aWNpcGFudElkID8gYCZwYXJ0aWNpcGFudF9pZD0ke2VuY29kZVVSSUNvbXBvbmVudChwYXJ0aWNpcGFudElkKX1gIDogJyc7XHJcbiAgICBjb25zdCB3c1VybCA9IGJ1aWxkV2ViU29ja2V0VXJsKFxyXG4gICAgICBgL3JpZGVzL3dzL3JpZGVzLyR7cmlkZUlkfT90b2tlbj0ke2VuY29kZVVSSUNvbXBvbmVudCh0b2tlbil9JHtwYXJ0aWNpcGFudFF1ZXJ5fWAsXHJcbiAgICApO1xyXG5cclxuICAgIGNvbnN0IHdzID0gbmV3IFdlYlNvY2tldCh3c1VybCk7XHJcbiAgICB3c1JlZi5jdXJyZW50ID0gd3M7XHJcblxyXG4gICAgd3Mub25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgbXNnOiBDaGF0TWVzc2FnZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XHJcbiAgICAgICAgc2V0TWVzc2FnZXMoKHByZXYpID0+IHtcclxuICAgICAgICAgIC8vIEF2b2lkIGR1cGxpY2F0ZXNcclxuICAgICAgICAgIGlmIChwcmV2LnNvbWUoKG0pID0+IG0uaWQgPT09IG1zZy5pZCkpIHJldHVybiBwcmV2O1xyXG4gICAgICAgICAgcmV0dXJuIFsuLi5wcmV2LCBtc2ddO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGNhdGNoIHtcclxuICAgICAgICAvLyBpZ25vcmVcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB3cy5vbmVycm9yID0gKCkgPT4ge307XHJcbiAgICB3cy5vbmNsb3NlID0gKCkgPT4ge307XHJcblxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgd3MuY2xvc2UoKTtcclxuICAgICAgd3NSZWYuY3VycmVudCA9IG51bGw7XHJcbiAgICB9O1xyXG4gIH0sIFtyaWRlSWQsIHBhcnRpY2lwYW50SWRdKTtcclxuXHJcbiAgLy8gQXV0by1zY3JvbGwgdG8gYm90dG9tXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIG1lc3NhZ2VzRW5kUmVmLmN1cnJlbnQ/LnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6ICdzbW9vdGgnIH0pO1xyXG4gIH0sIFttZXNzYWdlc10pO1xyXG5cclxuICBjb25zdCBzZW5kTWVzc2FnZSA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IHRleHQgPSBpbnB1dC50cmltKCk7XHJcbiAgICBpZiAoIXRleHQpIHJldHVybjtcclxuICAgIHNldElucHV0KCcnKTtcclxuXHJcbiAgICAvLyBJZiBXZWJTb2NrZXQgaXMgb3Blbiwgc2VuZCB2aWEgV1MgKGl0IHdpbGwgYmUgc3RvcmVkICsgYnJvYWRjYXN0KVxyXG4gICAgaWYgKHdzUmVmLmN1cnJlbnQgJiYgd3NSZWYuY3VycmVudC5yZWFkeVN0YXRlID09PSBXZWJTb2NrZXQuT1BFTikge1xyXG4gICAgICB3c1JlZi5jdXJyZW50LnNlbmQoSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiB0ZXh0IH0pKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIEZhbGxiYWNrIHRvIFJFU1RcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBtc2cgPSBhd2FpdCBhcGlGZXRjaDxDaGF0TWVzc2FnZT4oYHJpZGVzLyR7cmlkZUlkfS9jaGF0L21lc3NhZ2Uke2NoYXRRdWVyeX1gLCB7XHJcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxyXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiB0ZXh0IH0pLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNldE1lc3NhZ2VzKChwcmV2KSA9PiB7XHJcbiAgICAgICAgICBpZiAocHJldi5zb21lKChtKSA9PiBtLmlkID09PSBtc2cuaWQpKSByZXR1cm4gcHJldjtcclxuICAgICAgICAgIHJldHVybiBbLi4ucHJldiwgbXNnXTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBjYXRjaCB7XHJcbiAgICAgICAgLy8gcmVzdG9yZSBpbnB1dCBvbiBmYWlsdXJlXHJcbiAgICAgICAgc2V0SW5wdXQodGV4dCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBoYW5kbGVLZXlEb3duID0gKGU6IFJlYWN0LktleWJvYXJkRXZlbnQpID0+IHtcclxuICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJyAmJiAhZS5zaGlmdEtleSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIHNlbmRNZXNzYWdlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgZm9ybWF0VGltZSA9IChpc286IHN0cmluZykgPT4ge1xyXG4gICAgY29uc3QgZCA9IG5ldyBEYXRlKGlzbyk7XHJcbiAgICByZXR1cm4gZC50b0xvY2FsZVRpbWVTdHJpbmcoJ2VuLUdCJywgeyBob3VyOiAnMi1kaWdpdCcsIG1pbnV0ZTogJzItZGlnaXQnIH0pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNoZWxsV2lkdGggPSA0ODA7XHJcbiAgY29uc3QgYm90dG9tTmF2SGVpZ2h0ID0gNTY7XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2XHJcbiAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXHJcbiAgICAgICAgdG9wOiAwLFxyXG4gICAgICAgIGJvdHRvbTogYm90dG9tTmF2SGVpZ2h0LFxyXG4gICAgICAgIGxlZnQ6ICc1MCUnLFxyXG4gICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknLFxyXG4gICAgICAgIHdpZHRoOiAnMTAwJScsXHJcbiAgICAgICAgbWF4V2lkdGg6IHNoZWxsV2lkdGgsXHJcbiAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxyXG4gICAgICAgIGJhY2tncm91bmQ6ICd2YXIoLS1iZy1tYWluLCAjMzMzMjMyKScsXHJcbiAgICAgICAgdGV4dEFsaWduOiAnbGVmdCcsXHJcbiAgICAgICAgekluZGV4OiAxOSxcclxuICAgICAgfX1cclxuICAgID5cclxuICAgICAgPGRpdlxyXG4gICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICBmbGV4U2hyaW5rOiAwLFxyXG4gICAgICAgICAgYmFja2dyb3VuZDogJ3ZhcigtLWNvbG9yLWJnLCAjMTgxYTIwKScsXHJcbiAgICAgICAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjA4KScsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgZ2FwOiA4LFxyXG4gICAgICAgICAgcGFkZGluZzogJzEycHggMTZweCcsXHJcbiAgICAgICAgICBtaW5IZWlnaHQ6IDU2LFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgIG9uQ2xpY2s9e29uQmFja31cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICdub25lJyxcclxuICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXHJcbiAgICAgICAgICAgIGNvbG9yOiAnaW5oZXJpdCcsXHJcbiAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxyXG4gICAgICAgICAgICBwYWRkaW5nOiA0LFxyXG4gICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgICAgYXJpYS1sYWJlbD1cIkJhY2tcIlxyXG4gICAgICAgID5cclxuICAgICAgICAgIHtJY29ucy5iYWNrfVxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICA8aDIgc3R5bGU9e3sgbWFyZ2luOiAwLCBmb250U2l6ZTogMTYsIGZvbnRXZWlnaHQ6IDcwMCB9fT5SaWRlIENoYXQ8L2gyPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIGZsZXg6IDEsXHJcbiAgICAgICAgICBtaW5IZWlnaHQ6IDAsXHJcbiAgICAgICAgICBvdmVyZmxvd1k6ICdhdXRvJyxcclxuICAgICAgICAgIHBhZGRpbmc6ICcxNHB4IDE2cHggMThweCcsXHJcbiAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgICAgICAgIGdhcDogMTAsXHJcbiAgICAgICAgfX1cclxuICAgICAgPlxyXG4gICAgICB7bG9hZGluZyAmJiAoXHJcbiAgICAgICAgPHAgc3R5bGU9e3sgY29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDAuNSknLCB0ZXh0QWxpZ246ICdjZW50ZXInIH19PlxyXG4gICAgICAgICAgTG9hZGluZyBtZXNzYWdlcy4uLlxyXG4gICAgICAgIDwvcD5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIHshbG9hZGluZyAmJiBtZXNzYWdlcy5sZW5ndGggPT09IDAgJiYgKFxyXG4gICAgICAgIDxwXHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICBjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMC40KScsXHJcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIG1hcmdpblRvcDogNDAsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgID5cclxuICAgICAgICAgIE5vIG1lc3NhZ2VzIHlldC4gU2F5IGhlbGxvIVxyXG4gICAgICAgIDwvcD5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIHttZXNzYWdlcy5tYXAoKG1zZykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGlzTWUgPSBtc2cuc2VuZGVyX2lkID09PSBjdXJyZW50VXNlcklkO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIGtleT17bXNnLmlkfVxyXG4gICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcclxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogaXNNZSA/ICdmbGV4LWVuZCcgOiAnZmxleC1zdGFydCcsXHJcbiAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcclxuICAgICAgICAgICAgfX1cclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgICAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcclxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6IGlzTWUgPyAnZmxleC1lbmQnIDogJ2ZsZXgtc3RhcnQnLFxyXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6ICc3OCUnLFxyXG4gICAgICAgICAgICAgICAgZ2FwOiA0LFxyXG4gICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICB7IWlzTWUgJiYgKFxyXG4gICAgICAgICAgICAgICAgPHNwYW5cclxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdyZ2JhKDI1NSwyNTUsMjU1LDAuNDUpJyxcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiA0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ2xlZnQnLFxyXG4gICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICB7bXNnLnNlbmRlcl9uYW1lfVxyXG4gICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGlzTWUgPyAnIzNiODJmNicgOiAncmdiYSgyNTUsMjU1LDI1NSwwLjEpJyxcclxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzhweCAxNHB4JyxcclxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBpc01lID8gJzE2cHggMTZweCA0cHggMTZweCcgOiAnMTZweCAxNnB4IDE2cHggNHB4JyxcclxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE0LFxyXG4gICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjQsXHJcbiAgICAgICAgICAgICAgICAgIHdvcmRCcmVhazogJ2JyZWFrLXdvcmQnLFxyXG4gICAgICAgICAgICAgICAgICB3aGl0ZVNwYWNlOiAncHJlLXdyYXAnLFxyXG4gICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0JyxcclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAge21zZy5tZXNzYWdlfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8c3BhblxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEwLFxyXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJ3JnYmEoMjU1LDI1NSwyNTUsMC4zKScsXHJcbiAgICAgICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiBpc01lID8gNCA6IDAsXHJcbiAgICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IGlzTWUgPyAwIDogNCxcclxuICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBpc01lID8gJ3JpZ2h0JyA6ICdsZWZ0JyxcclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAge2Zvcm1hdFRpbWUobXNnLmNyZWF0ZWRfYXQpfVxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgICB9KX1cclxuXHJcbiAgICAgIDxkaXYgcmVmPXttZXNzYWdlc0VuZFJlZn0gLz5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2XHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIGZsZXhTaHJpbms6IDAsXHJcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAndmFyKC0tY29sb3ItYmcsICMxODFhMjApJyxcclxuICAgICAgICAgIGJvcmRlclRvcDogJzFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMDgpJyxcclxuICAgICAgICB9fVxyXG4gICAgICA+XHJcbiAgICAgIDxkaXZcclxuICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxyXG4gICAgICAgICAgZ2FwOiA4LFxyXG4gICAgICAgICAgcGFkZGluZzogJzEwcHggMTZweCAxMnB4JyxcclxuICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICA8aW5wdXRcclxuICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgIHZhbHVlPXtpbnB1dH1cclxuICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0SW5wdXQoZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgb25LZXlEb3duPXtoYW5kbGVLZXlEb3dufVxyXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJUeXBlIGEgbWVzc2FnZS4uLlwiXHJcbiAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICBmbGV4OiAxLFxyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAncmdiYSgyNTUsMjU1LDI1NSwwLjA4KScsXHJcbiAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxyXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDIwLFxyXG4gICAgICAgICAgICBwYWRkaW5nOiAnMTBweCAxNnB4JyxcclxuICAgICAgICAgICAgY29sb3I6ICcjZmZmJyxcclxuICAgICAgICAgICAgZm9udFNpemU6IDE0LFxyXG4gICAgICAgICAgICBvdXRsaW5lOiAnbm9uZScsXHJcbiAgICAgICAgICB9fVxyXG4gICAgICAgIC8+XHJcblxyXG4gICAgICAgIDxidXR0b25cclxuICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxyXG4gICAgICAgICAgb25DbGljaz17c2VuZE1lc3NhZ2V9XHJcbiAgICAgICAgICBkaXNhYmxlZD17IWlucHV0LnRyaW0oKX1cclxuICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGlucHV0LnRyaW0oKSA/ICcjM2I4MmY2JyA6ICdyZ2JhKDI1NSwyNTUsMjU1LDAuMSknLFxyXG4gICAgICAgICAgICBib3JkZXI6ICdub25lJyxcclxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcclxuICAgICAgICAgICAgd2lkdGg6IDQwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwLFxyXG4gICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXHJcbiAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgICAgIGN1cnNvcjogaW5wdXQudHJpbSgpID8gJ3BvaW50ZXInIDogJ2RlZmF1bHQnLFxyXG4gICAgICAgICAgICBjb2xvcjogJyNmZmYnLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiAnYmFja2dyb3VuZCAwLjJzJyxcclxuICAgICAgICAgICAgZmxleFNocmluazogMCxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgICBhcmlhLWxhYmVsPVwiU2VuZCBtZXNzYWdlXCJcclxuICAgICAgICA+XHJcbiAgICAgICAgICA8c3ZnIHdpZHRoPVwiMThcIiBoZWlnaHQ9XCIxOFwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwiY3VycmVudENvbG9yXCI+XHJcbiAgICAgICAgICAgIDxwYXRoIGQ9XCJNMi4wMSAyMUwyMyAxMiAyLjAxIDMgMiAxMGwxNSAyLTE1IDJ6XCIgLz5cclxuICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2hhdFBhZ2U7XHJcbiJdLCJmaWxlIjoiQzovVXNlcnMveWxhbm4vdnNjb2RlL1VuaS9TYW11ZGh5YW5SaWRlcy9mcm9udGVuZC9zcmMvQ2hhdFBhZ2UudHN4In0=