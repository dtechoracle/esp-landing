export default function Audiences() {
  const audienceCards = [
    {
      eyebrow: "For event planners",
      title: "Pitch layouts clients can actually read.",
      points: [
        "Start from a preloaded venue plan or your own dimensions",
        "Design seating, staging, and guest flow to scale",
        "Share a live plan link instead of a flat PDF",
      ],
    },
    {
      eyebrow: "For venues and venue staff",
      title: "Show every space exactly as it is.",
      points: [
        "Digitize your rooms once into reusable floor plans",
        "Check any layout against real capacity before you approve it",
        "Fewer site visits, fewer surprises on the day",
      ],
    },
    {
      eyebrow: "For decorators",
      title: "Show the look before a single prop moves.",
      points: [
        "Place drapery, florals, and props to scale from the asset library",
        "Check sightlines and clearance long before load-in day",
        "Hand the crew an exact placement list, not a mood board",
      ],
    },
    {
      eyebrow: "For other creative pros",
      title: "Know the room before you arrive.",
      points: [
        "AV, catering, and entertainment plan against the real footprint",
        "Mark rigging, power, and service routes on the shared plan",
        "Work in the same file as the planner, in real time",
      ],
    },
  ];

  return (
    <section id="audiences" style={{ background: "var(--surface-card)" }}>
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "72px 48px",
          boxSizing: "border-box",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        {audienceCards.map((audience) => (
          <div
            key={audience.eyebrow}
            style={{
              background: "var(--navy-900)",
              color: "white",
              borderRadius: "var(--radius-lg)",
              padding: 40,
              display: "flex",
              flexDirection: "column",
              gap: 18,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -80,
                right: -60,
                width: 280,
                height: 280,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(9,51,187,0.65), transparent 70%)",
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#8fb4e8",
                position: "relative",
              }}
            >
              {audience.eyebrow}
            </span>
            <h3
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "-0.025em",
                lineHeight: 1.15,
                position: "relative",
              }}
            >
              {audience.title}
            </h3>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                position: "relative",
                fontSize: 15,
                fontWeight: 500,
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {audience.points.map((item) => (
                <li key={item} style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "#8fb4e8" }}>—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
