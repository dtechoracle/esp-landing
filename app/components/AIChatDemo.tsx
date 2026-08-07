"use client";

import { useEffect, useState } from "react";

type Message =
  | { id: number; sender: "user"; text: string }
  | { id: number; sender: "ai"; text: string }
  | { id: number; sender: "typing" };

const timeline: { delay: number; add?: Message; reset?: boolean }[] = [
  { delay: 600, add: { id: 1, sender: "user", text: "Seat 320 guests banquet-style" } },
  { delay: 1200, add: { id: 2, sender: "typing" } },
  {
    delay: 2200,
    add: {
      id: 3,
      sender: "ai",
      text: "I can place the dance floor, stage, and bars to fit the room.",
    },
  },
  { delay: 800, add: { id: 4, sender: "user", text: "Add a photo booth near the entrance" } },
  { delay: 1000, add: { id: 5, sender: "typing" } },
  {
    delay: 2000,
    add: {
      id: 6,
      sender: "ai",
      text: "Photo booth placed. 30 tables arranged, capacity 320 confirmed.",
    },
  },
  { delay: 3000, reset: true },
];

export default function AIChatDemo() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let idx = 0;
    setMessages([]);

    function run() {
      const item = timeline[idx];
      timer = setTimeout(() => {
        if (cancelled) return;
        if (item.reset) {
          setMessages([]);
          idx = 0;
          run();
          return;
        }
        setMessages((m) => [...m, item.add!]);
        idx++;
        run();
      }, item.delay);
    }

    run();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--surface-0)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--line-200)",
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--blue-600)",
          }}
        >
          AI Assistant
        </span>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 12,
        }}
      >
        {messages.map((m) => {
          if (m.sender === "typing") {
            return (
              <div
                key={m.id}
                className="esp-msg-in"
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--line-200)",
                    borderRadius: "4px 14px 14px 14px",
                    padding: "12px 16px",
                    display: "flex",
                    gap: 5,
                  }}
                >
                  <span className="esp-typing-dot" />
                  <span className="esp-typing-dot" />
                  <span className="esp-typing-dot" />
                </div>
              </div>
            );
          }

          const isUser = m.sender === "user";
          return (
            <div
              key={m.id}
              className="esp-msg-in"
              style={{
                display: "flex",
                justifyContent: isUser ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "85%",
                  background: isUser ? "var(--navy-900)" : "var(--surface-sunken)",
                  border: isUser ? "none" : "1px solid var(--line-200)",
                  color: isUser ? "white" : "var(--ink-900)",
                  borderRadius: isUser ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                  padding: "12px 16px",
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 1.45,
                }}
              >
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <div
        style={{
          padding: "12px 20px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 48,
            padding: "0 16px",
            border: "1px solid var(--line-200)",
            borderRadius: "var(--radius-pill)",
            background: "var(--surface-0)",
          }}
        >
          <span
            style={{
              width: 20,
              height: 20,
              color: "var(--blue-600)",
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </span>
          <span
            style={{
              flex: 1,
              fontSize: 14,
              color: "var(--text-faint)",
            }}
          >
            Build a banquet layout for...
          </span>
        </div>
      </div>
    </div>
  );
}
