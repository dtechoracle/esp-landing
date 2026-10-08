"use client";
import { useState } from "react";

const faqs = [
  {
    question: "What is EventSpacePro?",
    answer: "EventSpacePro is a 2D floor plan editor designed for event planners, decorators, and venues. It features an AI layout assistant that creates an initial draft from a text prompt, which you can then edit on a precise grid with real-world dimensions.",
  },
  {
    question: "Do I need any CAD or design experience?",
    answer: "Not at all. The interface is completely drag-and-drop. You can let the AI generate the first layout and simply tweak the tables, stages, and elements until it's exactly right.",
  },
  {
    question: "Is there a 3D view?",
    answer: "Yes, our 3D walkthrough preview is currently in development and will launch in early 2027. Any 2D plans you create now will automatically be compatible with the 3D viewer when it's released.",
  },
  {
    question: "Can I collaborate with my team or the venue?",
    answer: "Yes! EventSpacePro includes real-time collaboration. You can plan alongside your team or the venue in a single file, and all changes will appear as they happen.",
  },
  {
    question: "When will EventSpacePro be available?",
    answer: "We are launching soon! Join the waitlist on this page to be one of the first to get access.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: "var(--surface-page)" }}>
      <div
        className="container esp-section"
        style={{
          padding: "72px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 48,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "center", maxWidth: 560 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--blue-600)",
            }}
          >
            FAQ
          </span>
          <h2
            style={{
              margin: 0,
              fontSize: 36,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            Frequently asked questions
          </h2>
        </div>

        <div style={{ width: "100%", maxWidth: 680, display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  background: "var(--surface-card)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--line-200)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "var(--ink-900)",
                    fontFamily: "var(--font-sans)",
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {faq.question}
                  <span
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 200ms ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--text-muted)",
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 24px 20px 24px", fontSize: 15, lineHeight: 1.5, color: "var(--text-muted)" }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
