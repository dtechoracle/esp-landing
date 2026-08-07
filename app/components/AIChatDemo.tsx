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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px 0",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--ink-900)",
          }}
        >
          Hello, User.
        </h3>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--text-muted)",
            padding: "6px 12px",
            border: "1px solid var(--line-200)",
            borderRadius: "var(--radius-pill)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 11 }}>↻</span> New Chat
        </span>
      </div>

      {/* Animated conversation */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          padding: "16px 24px 12px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        {messages.map((m) => {
          if (m.sender === "typing") {
            return (
              <div
                key={m.id}
                className="esp-msg-in"
                style={{ display: "flex", gap: 8, alignItems: "flex-end" }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    borderRadius: "50%",
                    background: "var(--navy-900)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                  }}
                >
                  ✦
                </span>
                <div
                  style={{
                    background: "var(--surface-sunken)",
                    border: "1px solid var(--line-200)",
                    borderRadius: "4px 14px 14px 14px",
                    padding: "12px 14px",
                    display: "flex",
                    gap: 5,
                    color: "var(--ink-900)",
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
                flexDirection: "column",
                gap: 4,
                alignItems: isUser ? "flex-end" : "flex-start",
                maxWidth: "100%",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: isUser ? "var(--blue-600)" : "var(--text-muted)",
                  padding: "0 4px",
                }}
              >
                {isUser ? "User" : "EventSpacePro AI"}
              </span>
              <div
                style={{
                  maxWidth: "85%",
                  background: isUser ? "var(--blue-600)" : "var(--surface-sunken)",
                  border: isUser ? "none" : "1px solid var(--line-200)",
                  color: isUser ? "white" : "var(--ink-900)",
                  borderRadius: isUser ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                  padding: "12px 14px",
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: 1.45,
                  letterSpacing: "-0.01em",
                }}
              >
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Search input bar */}
      <div
        style={{
          padding: "0 24px 18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 48,
            padding: "0 16px",
            border: "2px solid var(--blue-600)",
            borderRadius: "var(--radius-pill)",
            background: "var(--surface-0)",
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "var(--surface-sunken)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <span
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: 500,
              color: "var(--text-faint)",
              letterSpacing: "-0.01em",
            }}
          >
            What do you need help with?
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-muted)",
              padding: "4px 8px",
              border: "1px solid var(--line-200)",
              borderRadius: "var(--radius-sm)",
              flexShrink: 0,
            }}
          >
            Ctrl + K
          </span>
        </div>
      </div>
    </div>
  );
}
