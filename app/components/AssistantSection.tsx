"use client";

import { useEffect, useRef, useState } from "react";

interface ChatMessage {
  who: "me" | "ai";
  text: string;
}

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

export default function AssistantSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

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
      setActiveStep(2);
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
          setActiveStep(0);
        } else if (item.typing) {
          setIsTyping(true);
        } else if (item.add) {
          setIsTyping(false);
          setMessages((prev) => [...prev, item.add]);
          if (typeof item.step === "number") {
            setActiveStep(item.step);
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
      { threshold: 0.15 }
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
    <section className="section" id="assistant" aria-labelledby="assistant-title" ref={containerRef}>
      <div className="wrap split">
        <div>
          <span className="eyebrow">AI layout assistant</span>
          <h2 className="h2" id="assistant-title" style={{ marginTop: 14 }}>
            Tell it the brief. Get the first draft.
          </h2>
          <ol className="steps-list" id="demo-steps">
            <li className={activeStep === 0 ? "is-active" : ""}>
              <span className="ic">
                <svg width="18" height="18">
                  <use href="#i-chat" />
                </svg>
              </span>
              <div>
                <h3>Describe the event.</h3>
                <p>Guest count, seating style, must-haves. Plain words are enough.</p>
              </div>
            </li>
            <li className={activeStep === 1 ? "is-active" : ""}>
              <span className="ic">
                <svg width="18" height="18">
                  <use href="#i-spark" />
                </svg>
              </span>
              <div>
                <h3>Get a draft to scale.</h3>
                <p>The assistant places tables, stage, bars and dance floor on a precise grid.</p>
              </div>
            </li>
            <li className={activeStep === 2 ? "is-active" : ""}>
              <span className="ic">
                <svg width="18" height="18">
                  <use href="#i-move" />
                </svg>
              </span>
              <div>
                <h3>Tweak it by hand.</h3>
                <p>Ask for changes, or drag anything until the plan is exactly right.</p>
              </div>
            </li>
          </ol>
        </div>

        <div className="demo-stage">
          <div className="chat" aria-label="Example conversation with the AI layout assistant" role="img">
            <div className="chat-top">
              <h3>Hello there.</h3>
              <span className="chat-new">✨ New chat</span>
            </div>
            <div className="chat-body" ref={bodyRef}>
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.who === "me" ? "me" : ""}`}>
                  <span className="who">{m.who === "me" ? "You" : "AI assistant"}</span>
                  <div className="bubble">{m.text}</div>
                </div>
              ))}
              {isTyping && (
                <div className="typing" aria-label="AI is drafting…">
                  <i />
                  <i />
                  <i />
                </div>
              )}
            </div>
            <div className="chat-input">
              <svg width="15" height="15" aria-hidden="true">
                <use href="#i-search" />
              </svg>
              <span>What do you need help with?</span>
              <kbd>Ctrl + K</kbd>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
