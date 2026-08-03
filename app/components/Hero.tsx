import AIChatDemo from "./AIChatDemo";

export default function Hero() {
  return (
    <section
      className="container grid-hero esp-section"
      style={{ padding: "60px 24px 72px" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--surface-sunken)",
            border: "1px solid var(--line-200)",
            borderRadius: "var(--radius-pill)",
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-muted)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            width: "fit-content",
          }}
        >
          <span style={{ fontSize: 14 }}>✦</span>
          Next-Gen AI Venue Layout
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 56,
            lineHeight: 1.05,
            fontWeight: 600,
            letterSpacing: "-0.03em",
          }}
        >
          Design, book, and visualize event spaces in one place.
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
          EventSpacePro turns any venue into an editable 2D floor plan, a walkable
          3D preview, and an AI assistant that lays out your event from a single
          prompt.
        </p>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <a
            href="/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 48,
              padding: "0 28px",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "var(--ink-900)",
              background: "transparent",
              border: "1px solid var(--line-300)",
              borderRadius: "var(--radius-pill)",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Login
          </a>
          <a
            href="/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: 48,
              padding: "0 28px",
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "white",
              background: "var(--navy-900)",
              border: "none",
              borderRadius: "var(--radius-pill)",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Sign Up
          </a>
        </div>
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
