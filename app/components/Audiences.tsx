export default function Audiences() {
  return (
    <section id="audiences" style={{ background: "var(--surface-card)" }}>
      <div
        className="container grid-audience esp-section"
        style={{ padding: "72px 24px" }}
      >
        {/* For event planners */}
        <div
          className="esp-audience-card"
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
              background:
                "radial-gradient(circle, rgba(9,51,187,0.65), transparent 70%)",
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
            For event planners
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
            Pitch layouts clients can walk through.
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
            {[
              "Search and compare venues with accurate floor plans",
              "Design seating, staging, and flow before you sign",
              "Send clients a 3D walkthrough instead of a PDF",
            ].map((item) => (
              <li key={item} style={{ display: "flex", gap: 10 }}>
                <span style={{ color: "#8fb4e8" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* For venue owners */}
        <div
          className="esp-audience-card"
          style={{
            background: "var(--surface-page)",
            borderRadius: "var(--radius-lg)",
            padding: 40,
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--blue-600)",
            }}
          >
            For venue owners
          </span>
          <h3
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.15,
            }}
          >
            List once. Get booked with confidence.
          </h3>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontSize: 15,
              fontWeight: 500,
              lineHeight: 1.4,
              color: "var(--text-muted)",
            }}
          >
            {[
              "Digitize your spaces into reusable floor plans",
              "Approve layouts against real capacity.",
              "Fewer site visits, faster contracts, happier clients",
            ].map((item) => (
              <li key={item} style={{ display: "flex", gap: 10 }}>
                <span style={{ color: "var(--blue-600)" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}