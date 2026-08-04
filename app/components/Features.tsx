const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
      </svg>
    ),
    iconBg: "rgba(0,86,169,0.1)",
    iconColor: "var(--blue-600)",
    title: "Event Blueprints",
    body: "Design detailed floor plans and layouts for any type of event with precision drag-and-drop tools.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    iconBg: "rgba(78,28,216,0.1)",
    iconColor: "var(--purple-600)",
    title: "Smart Templates",
    body: "Kick-start your event with intelligent templates tailored for weddings, conferences, galas, and more.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    iconBg: "rgba(2,25,56,0.08)",
    iconColor: "var(--navy-900)",
    title: "Real-Time Collaboration",
    body: "Invite your team, vendors, and clients to co-plan events live, all from one dashboard.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    iconBg: "rgba(0,86,169,0.1)",
    iconColor: "var(--blue-600)",
    title: "3D Visualization",
    body: "Walk through your event space in immersive 3D before the first guest ever arrives.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="10.5" r="2.5" />
        <circle cx="8.5" cy="7.5" r="2.5" />
        <circle cx="6.5" cy="12.5" r="2.5" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
      </svg>
    ),
    iconBg: "rgba(78,28,216,0.1)",
    iconColor: "var(--purple-600)",
    title: "Decor Simulation",
    body: "Place virtual decor, lighting, and furniture to see how everything looks before you commit.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
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
