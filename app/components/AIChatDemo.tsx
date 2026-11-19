"use client";

import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  who: "me" | "ai";
  text: string;
}

const STEPS = [
  "Describe your event",
  "Review AI placement",
  "Fine-tune in 2D",
];

const SCRIPT: Array<
  | { d: number; add: ChatMessage; step: number; typing?: false; reset?: false }
  | { d: number; typing: true; add?: never; step?: never; reset?: false }
  | { d: number; reset: true; add?: never; step?: never; typing?: false }
> = [
  { d: 600, add: { who: "me", text: "Seat 320 guests banquet-style" }, step: 0 },
  { d: 1100, typing: true },
  { d: 1900, add: { who: "ai", text: "I can place the dance floor, stage, and bars to fit the space." }, step: 1 },
  { d: 900, add: { who: "me", text: "Add a photo booth near the entrance" }, step: 2 },
  { d: 1000, typing: true },
  { d: 1800, add: { who: "ai", text: "Photo booth placed. 30 tables arranged, capacity 320 confirmed." }, step: 2 },
  { d: 3200, reset: true },
];

export default function AIChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const scriptIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isVisibleRef = useRef(false);
  const isReducedMotionRef = useRef(false);

  useEffect(() => {
    isReducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isReducedMotionRef.current) {
      setMessages([
        { who: "me", text: "Seat 320 guests banquet-style" },
        { who: "ai", text: "I can place the dance floor, stage, and bars to fit the space." },
        { who: "me", text: "Add a photo booth near the entrance" },
        { who: "ai", text: "Photo booth placed. 30 tables arranged, capacity 320 confirmed." },
      ]);
      setCurrentStep(2);
      return;
    }

    function runNextStep() {
      if (!isVisibleRef.current) return;
      const item = SCRIPT[scriptIndexRef.current];
      if (!item) return;

      timerRef.current = setTimeout(() => {
        if (item.reset) {
          setMessages([]);
          setIsTyping(false);
          setCurrentStep(0);
        } else if (item.typing) {
          setIsTyping(true);
        } else if (item.add) {
          setIsTyping(false);
          setMessages((prev) => [...prev, item.add]);
          if (typeof item.step === "number") {
            setCurrentStep(item.step);
          }
        }

        scriptIndexRef.current = (scriptIndexRef.current + 1) % SCRIPT.length;
        runNextStep();
      }, item.d);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting;
          isVisibleRef.current = visible;
          if (visible) {
            runNextStep();
          } else {
            if (timerRef.current) clearTimeout(timerRef.current);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (bodyRef.current && !isReducedMotionRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="demo-stage" ref={containerRef}>
      <ol className="demo-steps" id="demo-steps" aria-label="Workflow steps">
        {STEPS.map((step, idx) => (
          <li key={step} className={idx === currentStep ? "is-active" : ""}>
            <span className="step-num">{idx + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="chat" role="region" aria-label="Interactive AI demo">
        <div className="chat-bar">
          <span className="ai-badge">
            <svg width="14" height="14">
              <use href="#i-spark" />
            </svg>
            AI assistant
          </span>
          <span className="chat-status">Ready</span>
        </div>
        <div className="chat-body" ref={bodyRef}>
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.who === "me" ? "msg-me" : "msg-ai"}`}>
              {m.text}
            </div>
          ))}
          {isTyping && (
            <div className="msg msg-ai typing" aria-label="AI is drafting…">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
        <div className="chat-input" aria-hidden="true">
          <span className="ph">Ask the assistant to adjust the layout…</span>
          <kbd>↵</kbd>
        </div>
      </div>
    </div>
  );
}
