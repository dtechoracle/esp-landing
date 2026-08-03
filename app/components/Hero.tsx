import WaitlistForm from "./WaitlistForm";

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

        <WaitlistForm />
      </div>

      <div>
        <div
          style={{
            background: "var(--surface-card)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "12px 16px",
              background: "var(--surface-sunken-2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--line-300)",
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--line-300)",
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--line-300)",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "-0.015em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Rivera Wedding — Grand Hall
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                background: "var(--blue-600)",
                color: "white",
                borderRadius: "var(--radius-pill)",
                padding: "4px 10px",
                whiteSpace: "nowrap",
              }}
            >
              3D preview
            </span>
          </div>

          <div
            style={{
              height: "var(--mock-height)",
              background: "var(--surface-0)",
              position: "relative",
            }}
          >
            <img
              src="/assets/dummy1.png"
              alt="EventSpacePro 3D preview of an event space floor plan"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "fill",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}