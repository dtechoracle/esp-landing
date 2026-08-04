const features = [
  {
    icon: "🗺️",
    iconBg: "rgba(0,86,169,0.1)",
    iconColor: "var(--blue-600)",
    title: "Event Blueprints",
    body: "Design detailed floor plans and layouts for any type of event with precision drag-and-drop tools.",
  },
  {
    icon: "📐",
    iconBg: "rgba(78,28,216,0.1)",
    iconColor: "var(--purple-600)",
    title: "Smart Templates",
    body: "Kick-start your event with intelligent templates tailored for weddings, conferences, galas, and more.",
  },
  {
    icon: "⚡",
    iconBg: "rgba(2,25,56,0.08)",
    iconColor: "var(--navy-900)",
    title: "Real-Time Collaboration",
    body: "Invite your team, vendors, and clients to co-plan events live, all from one dashboard.",
  },
  {
    icon: "🧊",
    iconBg: "rgba(0,86,169,0.1)",
    iconColor: "var(--blue-600)",
    title: "3D Visualization",
    body: "Walk through your event space in immersive 3D before the first guest ever arrives.",
  },
  {
    icon: "🎨",
    iconBg: "rgba(78,28,216,0.1)",
    iconColor: "var(--purple-600)",
    title: "Decor Simulation",
    body: "Place virtual décor, lighting, and furniture to see how everything looks before you commit.",
  },
  {
    icon: "📊",
    iconBg: "rgba(2,25,56,0.08)",
    iconColor: "var(--navy-900)",
    title: "Compliance Integration",
    body: "Fire safety regulations, capacity limits, accessibility requirements, and venue-specific constraints with built-in AI powered insights.",
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
            What&apos;s Coming
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
            Everything you need to build the perfect event.
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
