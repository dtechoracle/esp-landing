"use client";

import { useEffect, useState } from "react";
import { CONTENT } from "@/content/site";

export default function ProofSection() {
  const [showSlots, setShowSlots] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowSlots(new URLSearchParams(window.location.search).has("slots"));
    }
  }, []);

  const testimonials = CONTENT.PROOF.testimonials.filter((t) => t.quote.trim() !== "");
  const stats = CONTENT.PROOF.stats.filter((s) => s.value.trim() !== "");

  const hasContent = testimonials.length > 0 || stats.length > 0 || showSlots;

  if (!hasContent) {
    return null;
  }

  const quotesToRender =
    testimonials.length > 0
      ? testimonials
      : showSlots
      ? [
          {
            quote: "Real quote goes here",
            name: "Planner Name",
            role: "Lead Planner",
            city: "Lagos",
          },
        ]
      : [];

  const statsToRender =
    stats.length > 0
      ? stats
      : showSlots
      ? [
          { value: "500+", label: "events planned" },
          { value: "98%", label: "client approval" },
          { value: "10x", label: "faster drafts" },
        ]
      : [];

  return (
    <section className="section" id="proof" aria-labelledby="proof-title">
      <div className="wrap">
        <div className="section-head center">
          <span className="eyebrow">In their words</span>
          <h2 className="h2 center" id="proof-title">
            What planners are saying.
          </h2>
        </div>

        {quotesToRender.length > 0 && (
          <div className="proof-grid" id="proof-quotes">
            {quotesToRender.map((q, i) => {
              const initials = (q.name || "")
                .replace(/[^A-Za-z\s]/g, "")
                .trim()
                .split(/\s+/)
                .map((w) => w.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase() || "★";
              const meta = [q.role, q.city].filter(Boolean).join(", ");

              return (
                <figure key={i} className="quote" style={{ margin: 0 }}>
                  <blockquote>&ldquo;{q.quote}&rdquo;</blockquote>
                  <figcaption>
                    <span className="avatar" aria-hidden="true">
                      {initials}
                    </span>
                    <span className="who">
                      <b>{q.name}</b>
                      <span>{meta}</span>
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        )}

        {statsToRender.length > 0 && (
          <div className="stats-row" id="proof-stats">
            {statsToRender.map((s, i) => (
              <div key={i} className="stat">
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
