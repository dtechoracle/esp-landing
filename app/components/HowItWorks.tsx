const steps = [
  {
    n: "1",
    title: "Pick a space",
    body: "Choose from listed venues or upload your own room dimensions.",
  },
  {
    n: "2",
    title: "Describe the event",
    body: "Tell the AI assistant the guest count, style, and must-haves.",
  },
  {
    n: "3",
    title: "Refine in 2D",
    body: "Drag tables, stages, and assets until the plan is exactly right.",
  },
  {
    n: "4",
    title: "Walk it in 3D",
    body: "Preview the room, share it, and book with zero surprises.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how">
      <div
        className="container esp-section"
        style={{
          padding: "72px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 48,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 560 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--blue-600)",
            }}
          >
            How it works
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
            From blank room to booked event in four steps.
          </h2>
        </div>

        <div className="grid-steps">
          {steps.map((step) => (
            <div key={step.n} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--navy-900)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {step.n}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.45,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}