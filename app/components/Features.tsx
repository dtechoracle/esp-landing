const features = [
  {
    icon: "⬚",
    iconBg: "rgba(0,86,169,0.1)",
    iconColor: "var(--blue-600)",
    title: "2D floor-plan editor",
    body: "Drag-and-drop walls, tables, stages, and assets on a precise grid. Real dimensions, real capacity counts — no CAD required.",
  },
  {
    icon: "✦",
    iconBg: "rgba(78,28,216,0.1)",
    iconColor: "var(--purple-600)",
    title: "AI layout assistant",
    body: 'Describe the event — "250 guests, theater seating, two bars" — and get a compliant layout in seconds. Then tweak it by hand.',
  },
  {
    icon: "◇",
    iconBg: "rgba(2,25,56,0.08)",
    iconColor: "var(--navy-900)",
    title: "3D walkthrough preview",
    body: "Flip any plan into 3D and walk the room before you book it. Share a link so clients see exactly what they're getting.",
  },
];

export default function Features() {
  return (
    <section id="features" style={{ background: "var(--surface-card)" }}>
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
            Features
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
            Everything between the idea and the event.
          </h2>
        </div>

        <div className="grid-features">
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "var(--surface-page)",
                borderRadius: "var(--radius-lg)",
                padding: 30,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <span
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  background: f.iconBg,
                  color: f.iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                {f.icon}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.45,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                }}
              >
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}