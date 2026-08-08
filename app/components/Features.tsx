import workspaceImage from "../../assets/workspace-2d-editor.png";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 13h6" />
      </svg>
    ),
    iconBg: "rgba(0,86,169,0.1)",
    iconColor: "var(--blue-600)",
    title: "2D floor-plan editor",
    body: "Drag-and-drop walls, tables, stages, and assets on a precise grid. Real dimensions, real capacity counts, no CAD required.",
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
    title: "AI layout assistant",
    body: "Describe the event, \"250 guests, theater seating, two bars\", and get a compliant layout in seconds. Then tweak it by hand.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    iconBg: "rgba(2,25,56,0.08)",
    iconColor: "var(--gray-500)",
    title: "3D walkthrough preview",
    body: "In build now: flip any plan into 3D and walk the room before load-in day. Every plan you draw today carries straight over.",
  },
];

export default function Features() {
  return (
    <section id="features" style={{ background: "var(--surface-card)" }}>
      <div className="container esp-section" style={{ padding: "72px 24px", display: "flex", flexDirection: "column", gap: 48 }}>
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
            Shipping at launch... plus what comes next.
          </h2>
        </div>

        <div className="grid-features">
          {features.map((feature) => (
            <div
              key={feature.title}
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
                  background: feature.iconBg,
                  color: feature.iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {feature.icon}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: feature.title === "3D walkthrough preview" ? "var(--text-muted)" : "var(--ink-900)",
                  }}
                >
                  {feature.title}
                </h3>
                {feature.title === "2D floor-plan editor" && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--success-500)", textTransform: "uppercase", letterSpacing: "0.08em" }}>At launch</span>
                )}
                {feature.title === "AI layout assistant" && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--success-500)", textTransform: "uppercase", letterSpacing: "0.08em" }}>At launch</span>
                )}
                {feature.title === "3D walkthrough preview" && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Early 2027</span>
                )}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.45,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  textWrap: "pretty",
                }}
              >
                {feature.body}
              </p>
            </div>
          ))}
        </div>

        <figure style={{ margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--surface-sunken-2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--line-300)" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--line-300)" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--line-300)" }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "-0.015em", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 12px" }}>
              Tomi &amp; Chioma Wedding — Habour Point Event Centre
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--blue-600)", letterSpacing: "-0.015em" }}>2D editor</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "-0.015em" }}>3D · 2027</span>
            </div>
          </div>
          <img src={workspaceImage.src} alt="The EventSpacePro 2D editor: an 84-table banquet layout in a 64.95 × 25.18 m hall, with the elements panel, venue assets, and properties sidebar" style={{ width: "100%", height: "auto", display: "block", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-dropdown)" }} />
          <figcaption style={{ fontSize: 13, fontWeight: 500, color: "var(--text-muted)", letterSpacing: "-0.015em" }}>
            84 numbered tables across a 64.95 × 25.18 m hall drawn to real dimensions and numbered automatically.
          </figcaption>
        </figure>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--blue-600)" }}>Also included at launch</span>
            <span style={{ flex: 1, height: 1, background: "color-mix(in oklch, var(--blue-600) 18%, transparent)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {[
              { title: "Asset library", body: "Tables, chairs, stages, bars, and props drag-ready and sized to real dimensions." },
              { title: "Real-time collaboration", body: "Plan alongside your team and the venue in one file. Changes appear as they happen." },
              { title: "Venue templates", body: "Edit and save any layout as a reusable template e.g marquees, outdoor.... and start the next event from it." },
              { title: "Preloaded venues", body: "Listed spaces arrive with accurate plans and locations already integrated in." },
              { title: "Table numbering", body: "Auto-number tables and seats, then export the list for place cards and charts." },
            ].map((extra) => (
              <div key={extra.title} style={{ background: "color-mix(in oklch, var(--blue-600) 8%, white)", borderRadius: "var(--radius-md)", padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}>{extra.title}</h4>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.4, fontWeight: 500, color: "var(--text-muted)", textWrap: "pretty" }}>{extra.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
