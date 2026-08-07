import WaitlistForm from "./WaitlistForm";
import AIChatDemo from "./AIChatDemo";

export default function Hero() {
  return (
    <section
      className="container grid-hero esp-section"
      style={{ padding: "60px 24px 72px" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 56,
            lineHeight: 1.05,
            fontWeight: 600,
            letterSpacing: "-0.03em",
          }}
        >
          Design stunning event blueprints, and plan every detail before a single chair is placed.
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 18,
            lineHeight: 1.45,
            fontWeight: 500,
            letterSpacing: "-0.015em",
            color: "var(--text-muted)",
            maxWidth: 480,
          }}
        >
          EventSpacePro turns any venue into an editable floor plan, an AI-powered layout engine, and a shareable blueprint, all from a single prompt.
        </p>

        <WaitlistForm />
      </div>

      <div>
        <div
          style={{
            background: "var(--surface-card)",
            overflow: "hidden",
            borderRadius: 16,
            border: "1px solid var(--line-200)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            height: "var(--mock-height)",
          }}
        >
          <AIChatDemo />
        </div>
      </div>
    </section>
  );
}
